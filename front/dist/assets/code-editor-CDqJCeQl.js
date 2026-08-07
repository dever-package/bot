import { j as Qf } from "./createLucideIcon-fWv1XcFy.js";
import { b as Bi, o as gp, c as Ii, f as Sp, e as Qp, F as bp, d as yp } from "./runtime-entry-ClkZDmNs.js";
import { f as xp } from "./knowledge-file-manager-D3rbgGVt.js";
function go() {
  return go = Object.assign ? Object.assign.bind() : function(i) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var n in t) ({}).hasOwnProperty.call(t, n) && (i[n] = t[n]);
    }
    return i;
  }, go.apply(null, arguments);
}
function $p(i, e) {
  if (i == null) return {};
  var t = {};
  for (var n in i) if ({}.hasOwnProperty.call(i, n)) {
    if (e.indexOf(n) !== -1) continue;
    t[n] = i[n];
  }
  return t;
}
let So = [], bf = [];
(() => {
  let i = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, t = 0; e < i.length; e++)
    (e % 2 ? bf : So).push(t = t + i[e]);
})();
function Pp(i) {
  if (i < 768) return !1;
  for (let e = 0, t = So.length; ; ) {
    let n = e + t >> 1;
    if (i < So[n]) t = n;
    else if (i >= bf[n]) e = n + 1;
    else return !0;
    if (e == t) return !1;
  }
}
function Ca(i) {
  return i >= 127462 && i <= 127487;
}
const Xa = 8205;
function kp(i, e, t = !0, n = !0) {
  return (t ? yf : wp)(i, e, n);
}
function yf(i, e, t) {
  if (e == i.length) return e;
  e && xf(i.charCodeAt(e)) && $f(i.charCodeAt(e - 1)) && e--;
  let n = $s(i, e);
  for (e += Za(n); e < i.length; ) {
    let r = $s(i, e);
    if (n == Xa || r == Xa || t && Pp(r))
      e += Za(r), n = r;
    else if (Ca(r)) {
      let s = 0, o = e - 2;
      for (; o >= 0 && Ca($s(i, o)); )
        s++, o -= 2;
      if (s % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function wp(i, e, t) {
  for (; e > 1; ) {
    let n = yf(i, e - 2, t);
    if (n < e) return n;
    e--;
  }
  return 0;
}
function $s(i, e) {
  let t = i.charCodeAt(e);
  if (!$f(t) || e + 1 == i.length) return t;
  let n = i.charCodeAt(e + 1);
  return xf(n) ? (t - 55296 << 10) + (n - 56320) + 65536 : t;
}
function xf(i) {
  return i >= 56320 && i < 57344;
}
function $f(i) {
  return i >= 55296 && i < 56320;
}
function Za(i) {
  return i < 65536 ? 1 : 2;
}
class D {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, n) {
    [e, t] = Xi(this, e, t);
    let r = [];
    return this.decompose(
      0,
      e,
      r,
      2
      /* Open.To */
    ), n.length && n.decompose(
      0,
      n.length,
      r,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      r,
      1
      /* Open.From */
    ), rt.from(r, this.length - (t - e) + n.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Xi(this, e, t);
    let n = [];
    return this.decompose(e, t, n, 0), rt.from(n, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), n = this.length - this.scanIdentical(e, -1), r = new sn(this), s = new sn(e);
    for (let o = t, l = t; ; ) {
      if (r.next(o), s.next(o), o = 0, r.lineBreak != s.lineBreak || r.done != s.done || r.value != s.value)
        return !1;
      if (l += r.value.length, r.done || l >= n)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new sn(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new Pf(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let n;
    if (e == null)
      n = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let r = this.line(e).from;
      n = this.iterRange(r, Math.max(r, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new kf(n);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? D.empty : e.length <= 32 ? new re(e) : rt.from(re.split(e, []));
  }
}
class re extends D {
  constructor(e, t = vp(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, n, r) {
    for (let s = 0; ; s++) {
      let o = this.text[s], l = r + o.length;
      if ((t ? n : l) >= e)
        return new Tp(r, l, n, o);
      r = l + 1, n++;
    }
  }
  decompose(e, t, n, r) {
    let s = e <= 0 && t >= this.length ? this : new re(Ra(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (r & 1) {
      let o = n.pop(), l = ur(s.text, o.text.slice(), 0, s.length);
      if (l.length <= 32)
        n.push(new re(l, o.length + s.length));
      else {
        let a = l.length >> 1;
        n.push(new re(l.slice(0, a)), new re(l.slice(a)));
      }
    } else
      n.push(s);
  }
  replace(e, t, n) {
    if (!(n instanceof re))
      return super.replace(e, t, n);
    [e, t] = Xi(this, e, t);
    let r = ur(this.text, ur(n.text, Ra(this.text, 0, e)), t), s = this.length + n.length - (t - e);
    return r.length <= 32 ? new re(r, s) : rt.from(re.split(r, []), s);
  }
  sliceString(e, t = this.length, n = `
`) {
    [e, t] = Xi(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s <= t && o < this.text.length; o++) {
      let l = this.text[o], a = s + l.length;
      s > e && o && (r += n), e < a && t > s && (r += l.slice(Math.max(0, e - s), t - s)), s = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let n = [], r = -1;
    for (let s of e)
      n.push(s), r += s.length + 1, n.length == 32 && (t.push(new re(n, r)), n = [], r = -1);
    return r > -1 && t.push(new re(n, r)), t;
  }
}
class rt extends D {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let n of e)
      this.lines += n.lines;
  }
  lineInner(e, t, n, r) {
    for (let s = 0; ; s++) {
      let o = this.children[s], l = r + o.length, a = n + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, n, r);
      r = l + 1, n = a + 1;
    }
  }
  decompose(e, t, n, r) {
    for (let s = 0, o = 0; o <= t && s < this.children.length; s++) {
      let l = this.children[s], a = o + l.length;
      if (e <= a && t >= o) {
        let h = r & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? n.push(l) : l.decompose(e - o, t - o, n, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, n) {
    if ([e, t] = Xi(this, e, t), n.lines < this.lines)
      for (let r = 0, s = 0; r < this.children.length; r++) {
        let o = this.children[r], l = s + o.length;
        if (e >= s && t <= l) {
          let a = o.replace(e - s, t - s, n), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let c = this.children.slice();
            return c[r] = a, new rt(c, this.length - (t - e) + n.length);
          }
          return super.replace(s, l, a);
        }
        s = l + 1;
      }
    return super.replace(e, t, n);
  }
  sliceString(e, t = this.length, n = `
`) {
    [e, t] = Xi(this, e, t);
    let r = "";
    for (let s = 0, o = 0; s < this.children.length && o <= t; s++) {
      let l = this.children[s], a = o + l.length;
      o > e && s && (r += n), e < a && t > o && (r += l.sliceString(e - o, t - o, n)), o = a + 1;
    }
    return r;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof rt))
      return 0;
    let n = 0, [r, s, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; r += t, s += t) {
      if (r == o || s == l)
        return n;
      let a = this.children[r], h = e.children[s];
      if (a != h)
        return n + a.scanIdentical(h, t);
      n += a.length + 1;
    }
  }
  static from(e, t = e.reduce((n, r) => n + r.length + 1, -1)) {
    let n = 0;
    for (let u of e)
      n += u.lines;
    if (n < 32) {
      let u = [];
      for (let d of e)
        d.flatten(u);
      return new re(u, t);
    }
    let r = Math.max(
      32,
      n >> 5
      /* Tree.BranchShift */
    ), s = r << 1, o = r >> 1, l = [], a = 0, h = -1, c = [];
    function f(u) {
      let d;
      if (u.lines > s && u instanceof rt)
        for (let m of u.children)
          f(m);
      else u.lines > o && (a > o || !a) ? (O(), l.push(u)) : u instanceof re && a && (d = c[c.length - 1]) instanceof re && u.lines + d.lines <= 32 ? (a += u.lines, h += u.length + 1, c[c.length - 1] = new re(d.text.concat(u.text), d.length + 1 + u.length)) : (a + u.lines > r && O(), a += u.lines, h += u.length + 1, c.push(u));
    }
    function O() {
      a != 0 && (l.push(c.length == 1 ? c[0] : rt.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let u of e)
      f(u);
    return O(), l.length == 1 ? l[0] : new rt(l, t);
  }
}
D.empty = /* @__PURE__ */ new re([""], 0);
function vp(i) {
  let e = -1;
  for (let t of i)
    e += t.length + 1;
  return e;
}
function ur(i, e, t = 0, n = 1e9) {
  for (let r = 0, s = 0, o = !0; s < i.length && r <= n; s++) {
    let l = i[s], a = r + l.length;
    a >= t && (a > n && (l = l.slice(0, n - r)), r < t && (l = l.slice(t - r)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), r = a + 1;
  }
  return e;
}
function Ra(i, e, t) {
  return ur(i, [""], e, t);
}
class sn {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof re ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let n = this.nodes.length - 1, r = this.nodes[n], s = this.offsets[n], o = s >> 1, l = r instanceof re ? r.text.length : r.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (n == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[n - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((s & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[n] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (r instanceof re) {
        let a = r.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[n] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = r.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[n] += t) : (t < 0 && this.offsets[n]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof re ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class Pf {
  constructor(e, t, n) {
    this.value = "", this.done = !1, this.cursor = new sn(e, t > n ? -1 : 1), this.pos = t > n ? e.length : 0, this.from = Math.min(t, n), this.to = Math.max(t, n);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let n = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > n && (e = n), n -= e;
    let { value: r } = this.cursor.next(e);
    return this.pos += (r.length + e) * t, this.value = r.length <= n ? r : t < 0 ? r.slice(r.length - n) : r.slice(0, n), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class kf {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: n, value: r } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : n ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = r, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (D.prototype[Symbol.iterator] = function() {
  return this.iter();
}, sn.prototype[Symbol.iterator] = Pf.prototype[Symbol.iterator] = kf.prototype[Symbol.iterator] = function() {
  return this;
});
class Tp {
  /**
  @internal
  */
  constructor(e, t, n, r) {
    this.from = e, this.to = t, this.number = n, this.text = r;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Xi(i, e, t) {
  return e = Math.max(0, Math.min(i.length, e)), [e, Math.max(e, Math.min(i.length, t))];
}
function ce(i, e, t = !0, n = !0) {
  return kp(i, e, t, n);
}
function Cp(i) {
  return i >= 56320 && i < 57344;
}
function Xp(i) {
  return i >= 55296 && i < 56320;
}
function Te(i, e) {
  let t = i.charCodeAt(e);
  if (!Xp(t) || e + 1 == i.length)
    return t;
  let n = i.charCodeAt(e + 1);
  return Cp(n) ? (t - 55296 << 10) + (n - 56320) + 65536 : t;
}
function Tl(i) {
  return i <= 65535 ? String.fromCharCode(i) : (i -= 65536, String.fromCharCode((i >> 10) + 55296, (i & 1023) + 56320));
}
function st(i) {
  return i < 65536 ? 1 : 2;
}
const Qo = /\r\n?|\n/;
var pe = /* @__PURE__ */ (function(i) {
  return i[i.Simple = 0] = "Simple", i[i.TrackDel = 1] = "TrackDel", i[i.TrackBefore = 2] = "TrackBefore", i[i.TrackAfter = 3] = "TrackAfter", i;
})(pe || (pe = {}));
class ft {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let n = this.sections[t + 1];
      e += n < 0 ? this.sections[t] : n;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, n = 0, r = 0; t < this.sections.length; ) {
      let s = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(n, r, s), r += s) : r += o, n += s;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    bo(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let n = this.sections[t++], r = this.sections[t++];
      r < 0 ? e.push(n, r) : e.push(r, n);
    }
    return new ft(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : wf(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : yo(this, e, t);
  }
  mapPos(e, t = -1, n = pe.Simple) {
    let r = 0, s = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = r + l;
      if (a < 0) {
        if (h > e)
          return s + (e - r);
        s += l;
      } else {
        if (n != pe.Simple && h >= e && (n == pe.TrackDel && r < e && h > e || n == pe.TrackBefore && r < e || n == pe.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == r || t < 0 ? s : s + a;
        s += a;
      }
      r = h;
    }
    if (e > r)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);
    return s;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let n = 0, r = 0; n < this.sections.length && r <= t; ) {
      let s = this.sections[n++], o = this.sections[n++], l = r + s;
      if (o >= 0 && r <= t && l >= e)
        return r < e && l > t ? "cover" : !0;
      r = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let n = this.sections[t++], r = this.sections[t++];
      e += (e ? " " : "") + n + (r >= 0 ? ":" + r : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new ft(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new ft(e);
  }
}
class le extends ft {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return bo(this, (t, n, r, s, o) => e = e.replace(r, r + (n - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return yo(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), n = [];
    for (let r = 0, s = 0; r < t.length; r += 2) {
      let o = t[r], l = t[r + 1];
      if (l >= 0) {
        t[r] = l, t[r + 1] = o;
        let a = r >> 1;
        for (; n.length < a; )
          n.push(D.empty);
        n.push(o ? e.slice(s, s + o) : D.empty);
      }
      s += o;
    }
    return new le(t, n);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : wf(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : yo(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    bo(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return ft.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], n = [], r = [], s = new un(this);
    e: for (let o = 0, l = 0; ; ) {
      let a = o == e.length ? 1e9 : e[o++];
      for (; l < a || l == a && s.len == 0; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, a - l);
        Se(r, c, -1);
        let f = s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0;
        Se(t, c, f), f > 0 && Zt(n, t, s.text), s.forward(c), l += c;
      }
      let h = e[o++];
      for (; l < h; ) {
        if (s.done)
          break e;
        let c = Math.min(s.len, h - l);
        Se(t, c, -1), Se(r, c, s.ins == -1 ? -1 : s.off == 0 ? s.ins : 0), s.forward(c), l += c;
      }
    }
    return {
      changes: new le(t, n),
      filtered: ft.create(r)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let n = this.sections[t], r = this.sections[t + 1];
      r < 0 ? e.push(n) : r == 0 ? e.push([n]) : e.push([n].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, n) {
    let r = [], s = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !r.length)
        return;
      o < t && Se(r, t - o, -1);
      let f = new le(r, s);
      l = l ? l.compose(f.map(l)) : f, r = [], s = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof le) {
        if (c.length != t)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${t})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: O = f, insert: u } = c;
        if (f > O || f < 0 || O > t)
          throw new RangeError(`Invalid change range ${f} to ${O} (in doc of length ${t})`);
        let d = u ? typeof u == "string" ? D.of(u.split(n || Qo)) : u : D.empty, m = d.length;
        if (f == O && m == 0)
          return;
        f < o && a(), f > o && Se(r, f - o, -1), Se(r, O - f, m), Zt(s, r, d), o = O;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new le(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], n = [];
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (typeof s == "number")
        t.push(s, -1);
      else {
        if (!Array.isArray(s) || typeof s[0] != "number" || s.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (s.length == 1)
          t.push(s[0], 0);
        else {
          for (; n.length < r; )
            n.push(D.empty);
          n[r] = D.of(s.slice(1)), t.push(s[0], n[r].length);
        }
      }
    }
    return new le(t, n);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new le(e, t);
  }
}
function Se(i, e, t, n = !1) {
  if (e == 0 && t <= 0)
    return;
  let r = i.length - 2;
  r >= 0 && t <= 0 && t == i[r + 1] ? i[r] += e : r >= 0 && e == 0 && i[r] == 0 ? i[r + 1] += t : n ? (i[r] += e, i[r + 1] += t) : i.push(e, t);
}
function Zt(i, e, t) {
  if (t.length == 0)
    return;
  let n = e.length - 2 >> 1;
  if (n < i.length)
    i[i.length - 1] = i[i.length - 1].append(t);
  else {
    for (; i.length < n; )
      i.push(D.empty);
    i.push(t);
  }
}
function bo(i, e, t) {
  let n = i.inserted;
  for (let r = 0, s = 0, o = 0; o < i.sections.length; ) {
    let l = i.sections[o++], a = i.sections[o++];
    if (a < 0)
      r += l, s += l;
    else {
      let h = r, c = s, f = D.empty;
      for (; h += l, c += a, a && n && (f = f.append(n[o - 2 >> 1])), !(t || o == i.sections.length || i.sections[o + 1] < 0); )
        l = i.sections[o++], a = i.sections[o++];
      e(r, h, s, c, f), r = h, s = c;
    }
  }
}
function yo(i, e, t, n = !1) {
  let r = [], s = n ? [] : null, o = new un(i), l = new un(e);
  for (let a = -1; ; ) {
    if (o.done && l.len || l.done && o.len)
      throw new Error("Mismatched change set lengths");
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      Se(r, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (Se(r, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (Se(r, 0, o.ins), s && Zt(s, r, o.text), a = o.i), o.forward(c), h -= c;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (l.ins == -1) {
          let f = Math.min(c, l.len);
          h += f, c -= f, l.forward(f);
        } else if (l.ins == 0 && l.len < c)
          c -= l.len, l.next();
        else
          break;
      Se(r, h, a < o.i ? o.ins : 0), s && a < o.i && Zt(s, r, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return s ? le.createSet(r, s) : ft.create(r);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function wf(i, e, t = !1) {
  let n = [], r = t ? [] : null, s = new un(i), o = new un(e);
  for (let l = !1; ; ) {
    if (s.done && o.done)
      return r ? le.createSet(n, r) : ft.create(n);
    if (s.ins == 0)
      Se(n, s.len, 0, l), s.next();
    else if (o.len == 0 && !o.done)
      Se(n, 0, o.ins, l), r && Zt(r, n, o.text), o.next();
    else {
      if (s.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(s.len2, o.len), h = n.length;
        if (s.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          Se(n, a, c, l), r && c && Zt(r, n, o.text);
        } else o.ins == -1 ? (Se(n, s.off ? 0 : s.len, a, l), r && Zt(r, n, s.textBit(a))) : (Se(n, s.off ? 0 : s.len, o.off ? 0 : o.ins, l), r && !o.off && Zt(r, n, o.text));
        l = (s.ins > a || o.ins >= 0 && o.len > a) && (l || n.length > h), s.forward2(a), o.forward(a);
      }
    }
  }
}
class un {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? D.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, n = this.i - 2 >> 1;
    return n >= t.length && !e ? D.empty : t[n].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class Ct {
  constructor(e, t, n, r) {
    this.from = e, this.to = t, this.flags = n, this.goalColumn = r;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  A flag that, when set, makes some selection-extending commands
  treat the range's head and anchor as exchangeable, so that for
  example Shift-ArrowUp will make the lower side of the selection
  the anchor, even if that was the head before. Used to implement
  MacOS-style undirectional selections.
  */
  get undirectional() {
    return (this.flags & 64) > 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let n, r;
    return this.empty ? n = r = e.mapPos(this.from, t) : (n = e.mapPos(this.from, 1), r = e.mapPos(this.to, -1)), n == this.from && r == this.to ? this : new Ct(n, r, this.flags, this.goalColumn);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e, n = 0) {
    if (e <= this.anchor && t >= this.anchor)
      return b.range(e, t, void 0, void 0, n);
    let r = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return b.range(this.anchor, r, void 0, void 0, n);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && this.goalColumn == e.goalColumn && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return b.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, n, r) {
    return new Ct(e, t, n, r);
  }
}
class b {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : b.create(this.ranges.map((n) => n.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let n = 0; n < this.ranges.length; n++)
      if (!this.ranges[n].eq(e.ranges[n], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new b([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return b.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let n = this.ranges.slice();
    return n[t] = e, b.create(n, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new b(e.ranges.map((t) => Ct.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new b([b.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let n = 0, r = 0; r < e.length; r++) {
      let s = e[r];
      if (s.empty ? s.from <= n : s.from < n)
        return b.normalized(e.slice(), t);
      n = s.to;
    }
    return new b(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, n, r) {
    return Ct.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (n == null ? 7 : Math.min(6, n)), r);
  }
  /**
  Create a selection range.
  */
  static range(e, t, n, r, s) {
    let o = r == null ? 7 : Math.min(6, r);
    return !s && e != t && (s = t < e ? 1 : -1), s && (o |= s < 0 ? 8 : 16), t < e ? Ct.create(t, e, o | 32, n) : Ct.create(e, t, o, n);
  }
  /**
  Create an [undirectional](https://codemirror.net/6/docs/ref/#state.SelectionRange.undirectional)
  selection range.
  */
  static undirectionalRange(e, t) {
    return Ct.create(e, t, 64, void 0);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let n = e[t];
    e.sort((r, s) => r.from - s.from), t = e.indexOf(n);
    for (let r = 1; r < e.length; r++) {
      let s = e[r], o = e[r - 1];
      if (s.empty ? s.from <= o.to : s.from < o.to) {
        let l = o.from, a = Math.max(s.to, o.to);
        r <= t && t--, e.splice(--r, 2, s.anchor > s.head ? b.range(a, l) : b.range(l, a));
      }
    }
    return new b(e, t);
  }
}
function vf(i, e) {
  for (let t of i.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let Cl = 0;
class C {
  constructor(e, t, n, r, s) {
    this.combine = e, this.compareInput = t, this.compare = n, this.isStatic = r, this.id = Cl++, this.default = e([]), this.extensions = typeof s == "function" ? s(this) : s;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new C(e.combine || ((t) => t), e.compareInput || ((t, n) => t === n), e.compare || (e.combine ? (t, n) => t === n : Xl), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new dr([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new dr(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new dr(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (n) => n), this.compute([e], (n) => t(n.field(e)));
  }
}
function Xl(i, e) {
  return i == e || i.length == e.length && i.every((t, n) => t === e[n]);
}
class dr {
  constructor(e, t, n, r) {
    this.dependencies = e, this.facet = t, this.type = n, this.value = r, this.id = Cl++;
  }
  dynamicSlot(e) {
    var t;
    let n = this.value, r = this.facet.compareInput, s = this.id, o = e[s] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : (((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1) == 0 && c.push(e[f.id]);
    return {
      create(f) {
        return f.values[o] = n(f), 1;
      },
      update(f, O) {
        if (a && O.docChanged || h && (O.docChanged || O.selection) || xo(f, c)) {
          let u = n(f);
          if (l ? !Aa(u, f.values[o], r) : !r(u, f.values[o]))
            return f.values[o] = u, 1;
        }
        return 0;
      },
      reconfigure: (f, O) => {
        let u, d = O.config.address[s];
        if (d != null) {
          let m = wr(O, d);
          if (this.dependencies.every((g) => g instanceof C ? O.facet(g) === f.facet(g) : g instanceof ge ? O.field(g, !1) == f.field(g, !1) : !0) || (l ? Aa(u = n(f), m, r) : r(u = n(f), m)))
            return f.values[o] = m, 0;
        } else
          u = n(f);
        return f.values[o] = u, 1;
      }
    };
  }
  get extension() {
    return this;
  }
}
function Aa(i, e, t) {
  if (i.length != e.length)
    return !1;
  for (let n = 0; n < i.length; n++)
    if (!t(i[n], e[n]))
      return !1;
  return !0;
}
function xo(i, e) {
  let t = !1;
  for (let n of e)
    on(i, n) & 1 && (t = !0);
  return t;
}
function Zp(i, e, t) {
  let n = t.map((a) => i[a.id]), r = t.map((a) => a.type), s = n.filter((a) => !(a & 1)), o = i[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < n.length; c++) {
      let f = wr(a, n[c]);
      if (r[c] == 2)
        for (let O of f)
          h.push(O);
      else
        h.push(f);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of n)
        on(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!xo(a, s))
        return 0;
      let c = l(a);
      return e.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = xo(a, n), f = h.config.facets[e.id], O = h.facet(e);
      if (f && !c && Xl(t, f))
        return a.values[o] = O, 0;
      let u = l(a);
      return e.compare(u, O) ? (a.values[o] = O, 0) : (a.values[o] = u, 1);
    }
  };
}
const Ln = /* @__PURE__ */ C.define({ static: !0 });
class ge {
  constructor(e, t, n, r, s) {
    this.id = e, this.createF = t, this.updateF = n, this.compareF = r, this.spec = s, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new ge(Cl++, e.create, e.update, e.compare || ((n, r) => n === r), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(Ln).find((n) => n.field == this);
    return (t?.create || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (n) => (n.values[t] = this.create(n), 1),
      update: (n, r) => {
        let s = n.values[t], o = this.updateF(s, r);
        return this.compareF(s, o) ? 0 : (n.values[t] = o, 1);
      },
      reconfigure: (n, r) => {
        let s = n.facet(Ln), o = r.facet(Ln), l;
        return (l = s.find((a) => a.field == this)) && l != o.find((a) => a.field == this) ? (n.values[t] = l.create(n), 1) : r.config.address[this.id] != null ? (n.values[t] = r.field(this), 0) : (n.values[t] = this.create(n), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, Ln.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Kt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function Gi(i) {
  return (e) => new Tf(e, i);
}
const zt = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ Gi(Kt.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ Gi(Kt.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ Gi(Kt.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ Gi(Kt.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ Gi(Kt.lowest)
};
class Tf {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
  get extension() {
    return this;
  }
}
class ss {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new $o(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return ss.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class $o {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
  get extension() {
    return this;
  }
}
class kr {
  constructor(e, t, n, r, s, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = n, this.address = r, this.staticValues = s, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < n.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, n) {
    let r = [], s = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let O of Rp(e, t, o))
      O instanceof ge ? r.push(O) : (s[O.facet.id] || (s[O.facet.id] = [])).push(O);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let O of r)
      l[O.id] = h.length << 1, h.push((u) => O.slot(u));
    let c = n?.config.facets;
    for (let O in s) {
      let u = s[O], d = u[0].facet, m = c && c[O] || [];
      if (u.every(
        (g) => g.type == 0
        /* Provider.Static */
      ))
        if (l[d.id] = a.length << 1 | 1, Xl(m, u))
          a.push(n.facet(d));
        else {
          let g = d.combine(u.map((S) => S.value));
          a.push(n && d.compare(g, n.facet(d)) ? n.facet(d) : g);
        }
      else {
        for (let g of u)
          g.type == 0 ? (l[g.id] = a.length << 1 | 1, a.push(g.value)) : (l[g.id] = h.length << 1, h.push((S) => g.dynamicSlot(S)));
        l[d.id] = h.length << 1, h.push((g) => Zp(g, d, u));
      }
    }
    let f = h.map((O) => O(l));
    return new kr(e, o, f, l, a, s);
  }
}
function Rp(i, e, t) {
  let n = [[], [], [], [], []], r = /* @__PURE__ */ new Map();
  function s(o, l) {
    let a = r.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = n[a].indexOf(o);
      h > -1 && n[a].splice(h, 1), o instanceof $o && t.delete(o.compartment);
    }
    if (r.set(o, l), Array.isArray(o))
      for (let h of o)
        s(h, l);
    else if (o instanceof $o) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), s(h, l);
    } else if (o instanceof Tf)
      s(o.inner, o.prec);
    else if (o instanceof ge)
      n[l].push(o), o.provides && s(o.provides, l);
    else if (o instanceof dr)
      n[l].push(o), o.facet.extensions && s(o.facet.extensions, Kt.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}).`);
      if (h == o)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      s(h, l);
    }
  }
  return s(i, Kt.default), n.reduce((o, l) => o.concat(l));
}
function on(i, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, n = i.status[t];
  if (n == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (n & 2)
    return n;
  i.status[t] = 4;
  let r = i.computeSlot(i, i.config.dynamicSlots[t]);
  return i.status[t] = 2 | r;
}
function wr(i, e) {
  return e & 1 ? i.config.staticValues[e >> 1] : i.values[e >> 1];
}
const Cf = /* @__PURE__ */ C.define(), Po = /* @__PURE__ */ C.define({
  combine: (i) => i.some((e) => e),
  static: !0
}), Xf = /* @__PURE__ */ C.define({
  combine: (i) => i.length ? i[0] : void 0,
  static: !0
}), Zf = /* @__PURE__ */ C.define(), Rf = /* @__PURE__ */ C.define(), Af = /* @__PURE__ */ C.define(), Mf = /* @__PURE__ */ C.define({
  combine: (i) => i.length ? i[0] : !1
});
class pt {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new Ap();
  }
}
class Ap {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new pt(this, e);
  }
}
class Mp {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new M(this, e);
  }
}
class M {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new M(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new Mp(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let n = [];
    for (let r of e) {
      let s = r.map(t);
      s && n.push(s);
    }
    return n;
  }
}
M.reconfigure = /* @__PURE__ */ M.define();
M.appendConfig = /* @__PURE__ */ M.define();
class se {
  constructor(e, t, n, r, s, o) {
    this.startState = e, this.changes = t, this.selection = n, this.effects = r, this.annotations = s, this.scrollIntoView = o, this._doc = null, this._state = null, n && vf(n, t.newLength), s.some((l) => l.type == se.time) || (this.annotations = s.concat(se.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, n, r, s, o) {
    return new se(e, t, n, r, s, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(se.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
se.time = /* @__PURE__ */ pt.define();
se.userEvent = /* @__PURE__ */ pt.define();
se.addToHistory = /* @__PURE__ */ pt.define();
se.remote = /* @__PURE__ */ pt.define();
function Wp(i, e) {
  let t = [];
  for (let n = 0, r = 0; ; ) {
    let s, o;
    if (n < i.length && (r == e.length || e[r] >= i[n]))
      s = i[n++], o = i[n++];
    else if (r < e.length)
      s = e[r++], o = e[r++];
    else
      return t;
    !t.length || t[t.length - 1] < s ? t.push(s, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function Wf(i, e, t) {
  var n;
  let r, s, o;
  return t ? (r = e.changes, s = le.empty(e.changes.length), o = i.changes.compose(e.changes)) : (r = e.changes.map(i.changes), s = i.changes.mapDesc(e.changes, !0), o = i.changes.compose(r)), {
    changes: o,
    selection: e.selection ? e.selection.map(s) : (n = i.selection) === null || n === void 0 ? void 0 : n.map(r),
    effects: M.mapEffects(i.effects, r).concat(M.mapEffects(e.effects, s)),
    annotations: i.annotations.length ? i.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: i.scrollIntoView || e.scrollIntoView
  };
}
function ko(i, e, t) {
  let n = e.selection, r = xi(e.annotations);
  return e.userEvent && (r = r.concat(se.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof le ? e.changes : le.of(e.changes || [], t, i.facet(Xf)),
    selection: n && (n instanceof b ? n : b.single(n.anchor, n.head)),
    effects: xi(e.effects),
    annotations: r,
    scrollIntoView: !!e.scrollIntoView
  };
}
function qf(i, e, t) {
  let n = ko(i, e.length ? e[0] : {}, i.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let s = 1; s < e.length; s++) {
    e[s].filter === !1 && (t = !1);
    let o = !!e[s].sequential;
    n = Wf(n, ko(i, e[s], o ? n.changes.newLength : i.doc.length), o);
  }
  let r = se.create(i, n.changes, n.selection, n.effects, n.annotations, n.scrollIntoView);
  return Yp(t ? qp(r) : r);
}
function qp(i) {
  let e = i.startState, t = !0;
  for (let r of e.facet(Zf)) {
    let s = r(i);
    if (s === !1) {
      t = !1;
      break;
    }
    Array.isArray(s) && (t = t === !0 ? s : Wp(t, s));
  }
  if (t !== !0) {
    let r, s;
    if (t === !1)
      s = i.changes.invertedDesc, r = le.empty(e.doc.length);
    else {
      let o = i.changes.filter(t);
      r = o.changes, s = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    i = se.create(e, r, i.selection && i.selection.map(s), M.mapEffects(i.effects, s), i.annotations, i.scrollIntoView);
  }
  let n = e.facet(Rf);
  for (let r = n.length - 1; r >= 0; r--) {
    let s = n[r](i);
    s instanceof se ? i = s : Array.isArray(s) && s.length == 1 && s[0] instanceof se ? i = s[0] : i = qf(e, xi(s), !1);
  }
  return i;
}
function Yp(i) {
  let e = i.startState, t = e.facet(Af), n = i;
  for (let r = t.length - 1; r >= 0; r--) {
    let s = t[r](i);
    s && Object.keys(s).length && (n = Wf(n, ko(e, s, i.changes.newLength), !0));
  }
  return n == i ? i : se.create(e, i.changes, i.selection, n.effects, n.annotations, n.scrollIntoView);
}
const _p = [];
function xi(i) {
  return i == null ? _p : Array.isArray(i) ? i : [i];
}
var K = /* @__PURE__ */ (function(i) {
  return i[i.Word = 0] = "Word", i[i.Space = 1] = "Space", i[i.Other = 2] = "Other", i;
})(K || (K = {}));
const jp = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let wo;
try {
  wo = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function zp(i) {
  if (wo)
    return wo.test(i);
  for (let e = 0; e < i.length; e++) {
    let t = i[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || jp.test(t)))
      return !0;
  }
  return !1;
}
function Vp(i) {
  return (e) => {
    if (!/\S/.test(e))
      return K.Space;
    if (zp(e))
      return K.Word;
    for (let t = 0; t < i.length; t++)
      if (e.indexOf(i[t]) > -1)
        return K.Word;
    return K.Other;
  };
}
class V {
  constructor(e, t, n, r, s, o) {
    this.config = e, this.doc = t, this.selection = n, this.values = r, this.status = e.statusTemplate.slice(), this.computeSlot = s, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      on(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let n = this.config.address[e.id];
    if (n == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return on(this, n), wr(this, n);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return qf(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: n, compartments: r } = t;
    for (let l of e.effects)
      l.is(ss.reconfigure) ? (t && (r = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => r.set(h, a)), t = null), r.set(l.value.compartment, l.value.extension)) : l.is(M.reconfigure) ? (t = null, n = l.value) : l.is(M.appendConfig) && (t = null, n = xi(n).concat(l.value));
    let s;
    t ? s = e.startState.values.slice() : (t = kr.resolve(n, r, this), s = new V(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(Po) ? e.newSelection : e.newSelection.asSingle();
    new V(t, e.newDoc, o, s, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: b.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, n = e(t.ranges[0]), r = this.changes(n.changes), s = [n.range], o = xi(n.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), c = h.map(r);
      for (let O = 0; O < l; O++)
        s[O] = s[O].map(c);
      let f = r.mapDesc(h, !0);
      s.push(a.range.map(f)), r = r.compose(c), o = M.mapEffects(o, c).concat(M.mapEffects(xi(a.effects), f));
    }
    return {
      changes: r,
      selection: b.create(s, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof le ? e : le.of(e, this.doc.length, this.facet(V.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return D.of(e.split(this.facet(V.lineSeparator) || Qo));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (on(this, t), wr(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let n in e) {
        let r = e[n];
        r instanceof ge && this.config.address[r.id] != null && (t[n] = r.spec.toJSON(this.field(e[n]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, n) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let r = [];
    if (n) {
      for (let s in n)
        if (Object.prototype.hasOwnProperty.call(e, s)) {
          let o = n[s], l = e[s];
          r.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return V.create({
      doc: e.doc,
      selection: b.fromJSON(e.selection),
      extensions: t.extensions ? r.concat([t.extensions]) : r
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = kr.resolve(e.extensions || [], /* @__PURE__ */ new Map()), n = e.doc instanceof D ? e.doc : D.of((e.doc || "").split(t.staticFacet(V.lineSeparator) || Qo)), r = e.selection ? e.selection instanceof b ? e.selection : b.single(e.selection.anchor, e.selection.head) : b.single(0);
    return vf(r, n.length), t.staticFacet(Po) || (r = r.asSingle()), new V(t, n, r, t.dynamicSlots.map(() => null), (s, o) => o.create(s), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(V.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(V.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(Mf);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let n of this.facet(V.phrases))
      if (Object.prototype.hasOwnProperty.call(n, e)) {
        e = n[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (n, r) => {
      if (r == "$")
        return "$";
      let s = +(r || 1);
      return !s || s > t.length ? n : t[s - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, n = -1) {
    let r = [];
    for (let s of this.facet(Cf))
      for (let o of s(this, t, n))
        Object.prototype.hasOwnProperty.call(o, e) && r.push(o[e]);
    return r;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    let t = this.languageDataAt("wordChars", e);
    return Vp(t.length ? t[0] : "");
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: n, length: r } = this.doc.lineAt(e), s = this.charCategorizer(e), o = e - n, l = e - n;
    for (; o > 0; ) {
      let a = ce(t, o, !1);
      if (s(t.slice(a, o)) != K.Word)
        break;
      o = a;
    }
    for (; l < r; ) {
      let a = ce(t, l);
      if (s(t.slice(l, a)) != K.Word)
        break;
      l = a;
    }
    return o == l ? null : b.range(o + n, l + n);
  }
}
V.allowMultipleSelections = Po;
V.tabSize = /* @__PURE__ */ C.define({
  combine: (i) => i.length ? i[0] : 4
});
V.lineSeparator = Xf;
V.readOnly = Mf;
V.phrases = /* @__PURE__ */ C.define({
  compare(i, e) {
    let t = Object.keys(i), n = Object.keys(e);
    return t.length == n.length && t.every((r) => i[r] == e[r]);
  }
});
V.languageData = Cf;
V.changeFilter = Zf;
V.transactionFilter = Rf;
V.transactionExtender = Af;
ss.reconfigure = /* @__PURE__ */ M.define();
function mt(i, e, t = {}) {
  let n = {};
  for (let r of i)
    for (let s of Object.keys(r)) {
      let o = r[s], l = n[s];
      if (l === void 0)
        n[s] = o;
      else if (!(l === o || o === void 0)) if (Object.hasOwnProperty.call(t, s))
        n[s] = t[s](l, o);
      else
        throw new Error("Config merge conflict for field " + s);
    }
  for (let r in e)
    n[r] === void 0 && (n[r] = e[r]);
  return n;
}
class At {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return vo.create(e, t, this);
  }
}
At.prototype.startSide = At.prototype.endSide = 0;
At.prototype.point = !1;
At.prototype.mapMode = pe.TrackDel;
function Zl(i, e) {
  return i == e || i.constructor == e.constructor && i.eq(e);
}
let vo = class Yf {
  constructor(e, t, n) {
    this.from = e, this.to = t, this.value = n;
  }
  /**
  @internal
  */
  static create(e, t, n) {
    return new Yf(e, t, n);
  }
};
function To(i, e) {
  return i.from - e.from || i.value.startSide - e.value.startSide;
}
class Rl {
  constructor(e, t, n, r) {
    this.from = e, this.to = t, this.value = n, this.maxPoint = r;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, n, r = 0) {
    let s = n ? this.to : this.from;
    for (let o = r, l = s.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = s[a] - e || (n ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, n, r) {
    for (let s = this.findIndex(t, -1e9, !0), o = this.findIndex(n, 1e9, !1, s); s < o; s++)
      if (r(this.from[s] + e, this.to[s] + e, this.value[s]) === !1)
        return !1;
  }
  map(e, t) {
    let n = [], r = [], s = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + e, f = this.to[a] + e, O, u;
      if (c == f) {
        let d = t.mapPos(c, h.startSide, h.mapMode);
        if (d == null || (O = u = d, h.startSide != h.endSide && (u = t.mapPos(c, h.endSide), u < O)))
          continue;
      } else if (O = t.mapPos(c, h.startSide), u = t.mapPos(f, h.endSide), O > u || O == u && h.startSide > 0 && h.endSide <= 0)
        continue;
      (u - O || h.endSide - h.startSide) < 0 || (o < 0 && (o = O), h.point && (l = Math.max(l, u - O)), n.push(h), r.push(O - o), s.push(u - o));
    }
    return { mapped: n.length ? new Rl(r, s, n, l) : null, pos: o };
  }
}
class j {
  constructor(e, t, n, r) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = n, this.maxPoint = r;
  }
  /**
  @internal
  */
  static create(e, t, n, r) {
    return new j(e, t, n, r);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: n = !1, filterFrom: r = 0, filterTo: s = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (n && (t = t.slice().sort(To)), this.isEmpty)
      return t.length ? j.of(t) : this;
    let l = new _f(this, null, -1).goto(0), a = 0, h = [], c = new $t();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let f = t[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || r > this.chunkEnd(l.chunkIndex) || s < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || r > l.to || s < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(vo.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? j.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: r, filterTo: s }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], n = [], r = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        r = Math.max(r, a.maxPoint), t.push(a), n.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, e);
        c && (r = Math.max(r, c.maxPoint), t.push(c), n.push(f));
      }
    }
    let s = this.nextLayer.map(e);
    return t.length == 0 ? s : new j(n, t, s || j.empty, r);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, n) {
    if (!this.isEmpty) {
      for (let r = 0; r < this.chunk.length; r++) {
        let s = this.chunkPos[r], o = this.chunk[r];
        if (t >= s && e <= s + o.length && o.between(s, e - s, t - s, n) === !1)
          return;
      }
      this.nextLayer.between(e, t, n);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return dn.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return dn.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, n, r, s = -1) {
    let o = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), l = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= s), a = Ma(o, l, n), h = new Ni(o, a, s), c = new Ni(l, a, s);
    n.iterGaps((f, O, u) => Wa(h, f, c, O, u, r)), n.empty && n.length == 0 && Wa(h, 0, c, 0, 0, r);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, n = 0, r) {
    r == null && (r = 999999999);
    let s = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0), o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
    if (s.length != o.length)
      return !1;
    if (!s.length)
      return !0;
    let l = Ma(s, o), a = new Ni(s, l, 0).goto(n), h = new Ni(o, l, 0).goto(n);
    for (; ; ) {
      if (a.to != h.to || !Co(a.active, h.active) || a.point && (!h.point || !Zl(a.point, h.point)))
        return !1;
      if (a.to > r)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, n, r, s = -1) {
    let o = new Ni(e, null, s).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, n);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < t ? c.length + 1 : o.point.startSide < 0 ? c.length : Math.min(c.length, a);
        r.point(l, h, o.point, c, f, o.pointRank), a = Math.min(o.openEnd(h), c.length);
      } else h > l && (r.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > n)
        return a + (o.point && o.to > n ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let n = new $t();
    for (let r of e instanceof vo ? [e] : t ? Dp(e) : e)
      n.add(r.from, r.to, r.value);
    return n.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return j.empty;
    let t = e[e.length - 1];
    for (let n = e.length - 2; n >= 0; n--)
      for (let r = e[n]; r != j.empty; r = r.nextLayer)
        t = new j(r.chunkPos, r.chunk, t, Math.max(r.maxPoint, t.maxPoint));
    return t;
  }
}
j.empty = /* @__PURE__ */ new j([], [], null, -1);
function Dp(i) {
  if (i.length > 1)
    for (let e = i[0], t = 1; t < i.length; t++) {
      let n = i[t];
      if (To(e, n) > 0)
        return i.slice().sort(To);
      e = n;
    }
  return i;
}
j.empty.nextLayer = j.empty;
class $t {
  finishChunk(e) {
    this.chunks.push(new Rl(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, n) {
    this.addInner(e, t, n) || (this.nextLayer || (this.nextLayer = new $t())).add(e, t, n);
  }
  /**
  @internal
  */
  addInner(e, t, n) {
    let r = e - this.lastTo || n.startSide - this.last.endSide;
    if (r <= 0 && (e - this.lastFrom || n.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return r < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = n, this.lastFrom = e, this.lastTo = t, this.value.push(n), n.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let n = t.value.length - 1;
    return this.last = t.value[n], this.lastFrom = t.from[n] + e, this.lastTo = t.to[n] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(j.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = j.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function Ma(i, e, t) {
  let n = /* @__PURE__ */ new Map();
  for (let s of i)
    for (let o = 0; o < s.chunk.length; o++)
      s.chunk[o].maxPoint <= 0 && n.set(s.chunk[o], s.chunkPos[o]);
  let r = /* @__PURE__ */ new Set();
  for (let s of e)
    for (let o = 0; o < s.chunk.length; o++) {
      let l = n.get(s.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == s.chunkPos[o] && !t?.touchesRange(l, l + s.chunk[o].length) && r.add(s.chunk[o]);
    }
  return r;
}
class _f {
  constructor(e, t, n, r = 0) {
    this.layer = e, this.skip = t, this.minPoint = n, this.rank = r;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, n) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let r = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(r) || this.layer.chunkEnd(this.chunkIndex) < e || r.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, n = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let r = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!n || this.rangeIndex < r) && this.setRangeIndex(r);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], n = e + t.from[this.rangeIndex];
        if (this.from = n, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class dn {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, n = -1) {
    let r = [];
    for (let s = 0; s < e.length; s++)
      for (let o = e[s]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= n && r.push(new _f(o, t, n, s));
    return r.length == 1 ? r[0] : new dn(r);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let n of this.heap)
      n.goto(e, t);
    for (let n = this.heap.length >> 1; n >= 0; n--)
      Ps(this.heap, n);
    return this.next(), this;
  }
  forward(e, t) {
    for (let n of this.heap)
      n.forward(e, t);
    for (let n = this.heap.length >> 1; n >= 0; n--)
      Ps(this.heap, n);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Ps(this.heap, 0);
    }
  }
}
function Ps(i, e) {
  for (let t = i[e]; ; ) {
    let n = (e << 1) + 1;
    if (n >= i.length)
      break;
    let r = i[n];
    if (n + 1 < i.length && r.compare(i[n + 1]) >= 0 && (r = i[n + 1], n++), t.compare(r) < 0)
      break;
    i[n] = t, i[e] = r, e = n;
  }
}
class Ni {
  constructor(e, t, n) {
    this.minPoint = n, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = dn.from(e, t, n);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Bn(this.active, e), Bn(this.activeTo, e), Bn(this.activeRank, e), this.minActive = qa(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: n, to: r, rank: s } = this.cursor;
    for (; t < this.activeRank.length && (s - this.activeRank[t] || r - this.activeTo[t]) > 0; )
      t++;
    In(this.active, t, n), In(this.activeTo, t, r), In(this.activeRank, t, s), e && In(e, t, this.cursor.from), this.minActive = qa(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let n = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let r = this.minActive;
      if (r > -1 && (this.activeTo[r] - this.cursor.from || this.active[r].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[r] > e) {
          this.to = this.activeTo[r], this.endSide = this.active[r].endSide;
          break;
        }
        this.removeActive(r), n && Bn(n, r);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let s = this.cursor.value;
          if (!s.point)
            this.addActive(n), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = s, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = s.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (n) {
      this.openStart = 0;
      for (let r = n.length - 1; r >= 0 && n[r] < e; r--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let n = this.active.length - 1; n >= 0 && !(this.activeRank[n] < this.pointRank); n--)
      (this.activeTo[n] > e || this.activeTo[n] == e && this.active[n].endSide >= this.point.endSide) && t.push(this.active[n]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let n = this.activeTo.length - 1; n >= 0 && this.activeTo[n] > e; n--)
      t++;
    return t;
  }
}
function Wa(i, e, t, n, r, s) {
  i.goto(e), t.goto(n);
  let o = n + r, l = n, a = n - e, h = !!s.boundChange;
  for (let c = !1; ; ) {
    let f = i.to + a - t.to, O = f || i.endSide - t.endSide, u = O < 0 ? i.to + a : t.to, d = Math.min(u, o);
    if (i.point || t.point ? (i.point && t.point && Zl(i.point, t.point) && Co(i.activeForPoint(i.to), t.activeForPoint(t.to)) || s.comparePoint(l, d, i.point, t.point), c = !1) : (c && s.boundChange(l), d > l && !Co(i.active, t.active) && s.compareRange(l, d, i.active, t.active), h && d < o && (f || i.openEnd(u) != t.openEnd(u)) && (c = !0)), u > o)
      break;
    l = u, O <= 0 && i.next(), O >= 0 && t.next();
  }
}
function Co(i, e) {
  if (i.length != e.length)
    return !1;
  for (let t = 0; t < i.length; t++)
    if (i[t] != e[t] && !Zl(i[t], e[t]))
      return !1;
  return !0;
}
function Bn(i, e) {
  for (let t = e, n = i.length - 1; t < n; t++)
    i[t] = i[t + 1];
  i.pop();
}
function In(i, e, t) {
  for (let n = i.length - 1; n >= e; n--)
    i[n + 1] = i[n];
  i[e] = t;
}
function qa(i, e) {
  let t = -1, n = 1e9;
  for (let r = 0; r < e.length; r++)
    (e[r] - n || i[r].endSide - i[t].endSide) < 0 && (t = r, n = e[r]);
  return t;
}
function zi(i, e, t = i.length) {
  let n = 0;
  for (let r = 0; r < t && r < i.length; )
    i.charCodeAt(r) == 9 ? (n += e - n % e, r++) : (n++, r = ce(i, r));
  return n;
}
function Xo(i, e, t, n) {
  for (let r = 0, s = 0; ; ) {
    if (s >= e)
      return r;
    if (r == i.length)
      break;
    s += i.charCodeAt(r) == 9 ? t - s % t : 1, r = ce(i, r);
  }
  return n === !0 ? -1 : i.length;
}
const Zo = "ͼ", Ya = typeof Symbol > "u" ? "__" + Zo : Symbol.for(Zo), Ro = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : /* @__PURE__ */ Symbol("styleSet"), _a = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class Mt {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: n } = t || {};
    function r(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function s(o, l, a, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), O = f && f[1] == "keyframes";
      if (f && l == null) return a.push(o[0] + ";");
      for (let u in l) {
        let d = l[u];
        if (/&/.test(u))
          s(
            u.split(/,\s*/).map((m) => o.map((g) => m.replace(/&/, g))).reduce((m, g) => m.concat(g)),
            d,
            a
          );
        else if (d && typeof d == "object") {
          if (!f) throw new RangeError("The value of a property (" + u + ") should be a primitive value.");
          s(r(u), d, c, O);
        } else d != null && c.push(u.replace(/_.*/, "").replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()) + ": " + d + ";");
      }
      (c.length || O) && a.push((n && !f && !h ? o.map(n) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in e) s(r(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = _a[Ya] || 1;
    return _a[Ya] = e + 1, Zo + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, n) {
    let r = e[Ro], s = n && n.nonce;
    r ? s && r.setNonce(s) : r = new Ep(e, s), r.mount(Array.isArray(t) ? t : [t], e);
  }
}
let ja = /* @__PURE__ */ new Map();
class Ep {
  constructor(e, t) {
    let n = e.ownerDocument || e, r = n.defaultView;
    if (!e.head && e.adoptedStyleSheets && r.CSSStyleSheet) {
      let s = ja.get(n);
      if (s) return e[Ro] = s;
      this.sheet = new r.CSSStyleSheet(), ja.set(n, this);
    } else
      this.styleTag = n.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[Ro] = this;
  }
  mount(e, t) {
    let n = this.sheet, r = 0, s = 0;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = this.modules.indexOf(l);
      if (a < s && a > -1 && (this.modules.splice(a, 1), s--, a = -1), a == -1) {
        if (this.modules.splice(s++, 0, l), n) for (let h = 0; h < l.rules.length; h++)
          n.insertRule(l.rules[h], r++);
      } else {
        for (; s < a; ) r += this.modules[s++].rules.length;
        r += l.rules.length, s++;
      }
    }
    if (n)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      let o = "";
      for (let a = 0; a < this.modules.length; a++)
        o += this.modules[a].getRules() + `
`;
      this.styleTag.textContent = o;
      let l = t.head || t;
      this.styleTag.parentNode != l && l.insertBefore(this.styleTag, l.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var Wt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, pn = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Lp = typeof navigator < "u" && /Mac/.test(navigator.platform), Bp = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var de = 0; de < 10; de++) Wt[48 + de] = Wt[96 + de] = String(de);
for (var de = 1; de <= 24; de++) Wt[de + 111] = "F" + de;
for (var de = 65; de <= 90; de++)
  Wt[de] = String.fromCharCode(de + 32), pn[de] = String.fromCharCode(de);
for (var ks in Wt) pn.hasOwnProperty(ks) || (pn[ks] = Wt[ks]);
function Ip(i) {
  var e = Lp && i.metaKey && i.shiftKey && !i.ctrlKey && !i.altKey || Bp && i.shiftKey && i.key && i.key.length == 1 || i.key == "Unidentified", t = !e && i.key || (i.shiftKey ? pn : Wt)[i.keyCode] || i.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function I() {
  var i = arguments[0];
  typeof i == "string" && (i = document.createElement(i));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
      var r = t[n];
      typeof r == "string" ? i.setAttribute(n, r) : r != null && (i[n] = r);
    }
    e++;
  }
  for (; e < arguments.length; e++) jf(i, arguments[e]);
  return i;
}
function jf(i, e) {
  if (typeof e == "string")
    i.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    i.appendChild(e);
  else if (Array.isArray(e))
    for (var t = 0; t < e.length; t++) jf(i, e[t]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
let $e = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Ao = typeof document < "u" ? document : { documentElement: { style: {} } };
const Mo = /* @__PURE__ */ /Edge\/(\d+)/.exec($e.userAgent), zf = /* @__PURE__ */ /MSIE \d/.test($e.userAgent), Wo = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec($e.userAgent), os = !!(zf || Wo || Mo), za = !os && /* @__PURE__ */ /gecko\/(\d+)/i.test($e.userAgent), ws = !os && /* @__PURE__ */ /Chrome\/(\d+)/.exec($e.userAgent), Va = "webkitFontSmoothing" in Ao.documentElement.style, qo = !os && /* @__PURE__ */ /Apple Computer/.test($e.vendor), Da = qo && (/* @__PURE__ */ /Mobile\/\w+/.test($e.userAgent) || $e.maxTouchPoints > 2);
var T = {
  mac: Da || /* @__PURE__ */ /Mac/.test($e.platform),
  windows: /* @__PURE__ */ /Win/.test($e.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test($e.platform),
  ie: os,
  ie_version: zf ? Ao.documentMode || 6 : Wo ? +Wo[1] : Mo ? +Mo[1] : 0,
  gecko: za,
  gecko_version: za ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec($e.userAgent) || [0, 0])[1] : 0,
  chrome: !!ws,
  chrome_version: ws ? +ws[1] : 0,
  ios: Da,
  android: /* @__PURE__ */ /Android\b/.test($e.userAgent),
  webkit: Va,
  webkit_version: Va ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec($e.userAgent) || [0, 0])[1] : 0,
  safari: qo,
  safari_version: qo ? +(/* @__PURE__ */ /\bVersion\/(\d+(\.\d+)?)/.exec($e.userAgent) || [0, 0])[1] : 0,
  tabSize: Ao.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
function Al(i, e) {
  for (let t in i)
    t == "class" && e.class ? e.class += " " + i.class : t == "style" && e.style ? e.style += ";" + i.style : e[t] = i[t];
  return e;
}
const vr = /* @__PURE__ */ Object.create(null);
function Ml(i, e, t) {
  if (i == e)
    return !0;
  i || (i = vr), e || (e = vr);
  let n = Object.keys(i), r = Object.keys(e);
  if (n.length - 0 != r.length - 0)
    return !1;
  for (let s of n)
    if (s != t && (r.indexOf(s) == -1 || i[s] !== e[s]))
      return !1;
  return !0;
}
function Gp(i, e) {
  for (let t = i.attributes.length - 1; t >= 0; t--) {
    let n = i.attributes[t].name;
    e[n] == null && i.removeAttribute(n);
  }
  for (let t in e) {
    let n = e[t];
    t == "style" ? i.style.cssText = n : i.getAttribute(t) != n && i.setAttribute(t, n);
  }
}
function Ea(i, e, t) {
  let n = !1;
  if (e)
    for (let r in e)
      t && r in t || (n = !0, r == "style" ? i.style.cssText = "" : i.removeAttribute(r));
  if (t)
    for (let r in t)
      e && e[r] == t[r] || (n = !0, r == "style" ? i.style.cssText = t[r] : i.setAttribute(r, t[r]));
  return n;
}
function Np(i) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < i.attributes.length; t++) {
    let n = i.attributes[t];
    e[n.name] = n.value;
  }
  return e;
}
class Ue {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t, n) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, n) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var me = /* @__PURE__ */ (function(i) {
  return i[i.Text = 0] = "Text", i[i.WidgetBefore = 1] = "WidgetBefore", i[i.WidgetAfter = 2] = "WidgetAfter", i[i.WidgetRange = 3] = "WidgetRange", i;
})(me || (me = {}));
class Z extends At {
  constructor(e, t, n, r) {
    super(), this.startSide = e, this.endSide = t, this.widget = n, this.spec = r;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new An(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), n = !!e.block;
    return t += n && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new li(e, t, t, n, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, n, r;
    if (e.isBlockGap)
      n = -5e8, r = 4e8;
    else {
      let { start: s, end: o } = Vf(e, t);
      n = (s ? t ? -3e8 : -1 : 5e8) - 1, r = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new li(e, n, r, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Mn(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return j.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
Z.none = j.empty;
class An extends Z {
  constructor(e) {
    let { start: t, end: n } = Vf(e);
    super(t ? -1 : 5e8, n ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? Al(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || vr;
  }
  eq(e) {
    return this == e || e instanceof An && this.tagName == e.tagName && Ml(this.attrs, e.attrs);
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
An.prototype.point = !1;
class Mn extends Z {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Mn && this.spec.class == e.spec.class && Ml(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Mn.prototype.mapMode = pe.TrackBefore;
Mn.prototype.point = !0;
class li extends Z {
  constructor(e, t, n, r, s, o) {
    super(t, n, s, e), this.block = r, this.isReplace = o, this.mapMode = r ? t <= 0 ? pe.TrackBefore : pe.TrackAfter : pe.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? me.WidgetRange : this.startSide <= 0 ? me.WidgetBefore : me.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof li && Up(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
li.prototype.point = !0;
function Vf(i, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: n } = i;
  return t == null && (t = i.inclusive), n == null && (n = i.inclusive), { start: t ?? e, end: n ?? e };
}
function Up(i, e) {
  return i == e || !!(i && e && i.compare(e));
}
function $i(i, e, t, n = 0) {
  let r = t.length - 1;
  r >= 0 && t[r] + n >= i ? t[r] = Math.max(t[r], e) : t.push(i, e);
}
class mn extends At {
  constructor(e, t, n) {
    super(), this.tagName = e, this.attributes = t, this.rank = n;
  }
  eq(e) {
    return e == this || e instanceof mn && this.tagName == e.tagName && Ml(this.attributes, e.attributes);
  }
  /**
  Create a block wrapper object with the given tag name and
  attributes.
  */
  static create(e) {
    return new mn(e.tagName, e.attributes || vr, e.rank == null ? 50 : Math.max(0, Math.min(e.rank, 100)));
  }
  /**
  Create a range set from the given block wrapper ranges.
  */
  static set(e, t = !1) {
    return j.of(e, t);
  }
}
mn.prototype.startSide = mn.prototype.endSide = -1;
function gn(i) {
  let e;
  return i.nodeType == 11 ? e = i.getSelection ? i : i.ownerDocument : e = i, e.getSelection();
}
function Yo(i, e) {
  return e ? i == e || i.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function ln(i, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return Yo(i, e.anchorNode);
  } catch {
    return !1;
  }
}
function an(i) {
  return i.nodeType == 3 ? Qn(i, 0, i.nodeValue.length).getClientRects() : i.nodeType == 1 ? i.getClientRects() : [];
}
function hn(i, e, t, n) {
  return t ? La(i, e, t, n, -1) || La(i, e, t, n, 1) : !1;
}
function qt(i) {
  for (var e = 0; ; e++)
    if (i = i.previousSibling, !i)
      return e;
}
function Tr(i) {
  return i.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(i.nodeName);
}
function La(i, e, t, n, r) {
  for (; ; ) {
    if (i == t && e == n)
      return !0;
    if (e == (r < 0 ? 0 : Pt(i))) {
      if (i.nodeName == "DIV")
        return !1;
      let s = i.parentNode;
      if (!s || s.nodeType != 1)
        return !1;
      e = qt(i) + (r < 0 ? 0 : 1), i = s;
    } else if (i.nodeType == 1) {
      if (i = i.childNodes[e + (r < 0 ? -1 : 0)], i.nodeType == 1 && i.contentEditable == "false")
        return !1;
      e = r < 0 ? Pt(i) : 0;
    } else
      return !1;
  }
}
function Pt(i) {
  return i.nodeType == 3 ? i.nodeValue.length : i.childNodes.length;
}
function Sn(i, e) {
  let { left: t, right: n } = i;
  if (t == n)
    return i;
  let r = e ? t : n;
  return { left: r, right: r, top: i.top, bottom: i.bottom };
}
function Fp(i) {
  let e = i.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: i.innerWidth,
    top: 0,
    bottom: i.innerHeight
  };
}
function Df(i, e) {
  let t = e.width / i.offsetWidth, n = e.height / i.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - i.offsetWidth) < 1) && (t = 1), (n > 0.995 && n < 1.005 || !isFinite(n) || Math.abs(e.height - i.offsetHeight) < 1) && (n = 1), { scaleX: t, scaleY: n };
}
function Hp(i, e, t, n, r, s, o, l) {
  let a = i.ownerDocument, h = a.defaultView || window;
  for (let c = i, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let O, u = c == a.body, d = 1, m = 1;
      if (u)
        O = Fp(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let Q = c.getBoundingClientRect();
        ({ scaleX: d, scaleY: m } = Df(c, Q)), O = {
          left: Q.left,
          right: Q.left + c.clientWidth * d,
          top: Q.top,
          bottom: Q.top + c.clientHeight * m
        };
      }
      let g = 0, S = 0;
      if (r == "nearest")
        e.top < O.top + o ? (S = e.top - (O.top + o), t > 0 && e.bottom > O.bottom + S && (S = e.bottom - O.bottom + o)) : e.bottom > O.bottom - o && (S = e.bottom - O.bottom + o, t < 0 && e.top - S < O.top && (S = e.top - (O.top + o)));
      else {
        let Q = e.bottom - e.top, y = O.bottom - O.top;
        S = (r == "center" && Q <= y ? e.top + Q / 2 - y / 2 : r == "start" || r == "center" && t < 0 ? e.top - o : e.bottom - y + o) - O.top;
      }
      if (n == "nearest" ? e.left < O.left + s ? (g = e.left - (O.left + s), t > 0 && e.right > O.right + g && (g = e.right - O.right + s)) : e.right > O.right - s && (g = e.right - O.right + s, t < 0 && e.left < O.left + g && (g = e.left - (O.left + s))) : g = (n == "center" ? e.left + (e.right - e.left) / 2 - (O.right - O.left) / 2 : n == "start" == l ? e.left - s : e.right - (O.right - O.left) + s) - O.left, g || S)
        if (u)
          h.scrollBy(g, S);
        else {
          let Q = 0, y = 0;
          if (S) {
            let w = c.scrollTop;
            c.scrollTop += S / m, y = (c.scrollTop - w) * m;
          }
          if (g) {
            let w = c.scrollLeft;
            c.scrollLeft += g / d, Q = (c.scrollLeft - w) * d;
          }
          e = {
            left: e.left - Q,
            top: e.top - y,
            right: e.right - Q,
            bottom: e.bottom - y
          }, Q && Math.abs(Q - g) < 1 && (n = "nearest"), y && Math.abs(y - S) < 1 && (r = "nearest");
        }
      if (u)
        break;
      (e.top < O.top || e.bottom > O.bottom || e.left < O.left || e.right > O.right) && (e = {
        left: Math.max(e.left, O.left),
        right: Math.min(e.right, O.right),
        top: Math.max(e.top, O.top),
        bottom: Math.min(e.bottom, O.bottom)
      }), c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function Ef(i, e = !0) {
  let t = i.ownerDocument, n = null, r = null;
  for (let s = i.parentNode; s && !(s == t.body || (!e || n) && r); )
    if (s.nodeType == 1)
      !r && s.scrollHeight > s.clientHeight && (r = s), e && !n && s.scrollWidth > s.clientWidth && (n = s), s = s.assignedSlot || s.parentNode;
    else if (s.nodeType == 11)
      s = s.host;
    else
      break;
  return { x: n, y: r };
}
class Kp {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: n } = e;
    this.set(t, Math.min(e.anchorOffset, t ? Pt(t) : 0), n, Math.min(e.focusOffset, n ? Pt(n) : 0));
  }
  set(e, t, n, r) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = n, this.focusOffset = r;
  }
}
let Ft = null;
T.safari && T.safari_version >= 26 && (Ft = !1);
function Lf(i) {
  if (i.setActive)
    return i.setActive();
  if (Ft)
    return i.focus(Ft);
  let e = [];
  for (let t = i; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (i.focus(Ft == null ? {
    get preventScroll() {
      return Ft = { preventScroll: !0 }, !0;
    }
  } : void 0), !Ft) {
    Ft = !1;
    for (let t = 0; t < e.length; ) {
      let n = e[t++], r = e[t++], s = e[t++];
      n.scrollTop != r && (n.scrollTop = r), n.scrollLeft != s && (n.scrollLeft = s);
    }
  }
}
let Ba;
function Qn(i, e, t = e) {
  let n = Ba || (Ba = document.createRange());
  return n.setEnd(i, t), n.setStart(i, e), n;
}
function Pi(i, e, t, n) {
  let r = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  n && ({ altKey: r.altKey, ctrlKey: r.ctrlKey, shiftKey: r.shiftKey, metaKey: r.metaKey } = n);
  let s = new KeyboardEvent("keydown", r);
  s.synthetic = !0, i.dispatchEvent(s);
  let o = new KeyboardEvent("keyup", r);
  return o.synthetic = !0, i.dispatchEvent(o), s.defaultPrevented || o.defaultPrevented;
}
function Jp(i) {
  for (; i; ) {
    if (i && (i.nodeType == 9 || i.nodeType == 11 && i.host))
      return i;
    i = i.assignedSlot || i.parentNode;
  }
  return null;
}
function em(i, e) {
  let t = e.focusNode, n = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != n)
    return !1;
  for (n = Math.min(n, Pt(t)); ; )
    if (n) {
      if (t.nodeType != 1)
        return !1;
      let r = t.childNodes[n - 1];
      r.contentEditable == "false" ? n-- : (t = r, n = Pt(t));
    } else {
      if (t == i)
        return !0;
      n = qt(t), t = t.parentNode;
    }
}
function Bf(i) {
  return i instanceof Window ? i.pageYOffset > Math.max(0, i.document.documentElement.scrollHeight - i.innerHeight - 4) : i.scrollTop > Math.max(1, i.scrollHeight - i.clientHeight - 4);
}
function If(i, e) {
  for (let t = i, n = e; ; ) {
    if (t.nodeType == 3 && n > 0)
      return { node: t, offset: n };
    if (t.nodeType == 1 && n > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[n - 1], n = Pt(t);
    } else if (t.parentNode && !Tr(t))
      n = qt(t), t = t.parentNode;
    else
      return null;
  }
}
function Gf(i, e) {
  for (let t = i, n = e; ; ) {
    if (t.nodeType == 3 && n < t.nodeValue.length)
      return { node: t, offset: n };
    if (t.nodeType == 1 && n < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[n], n = 0;
    } else if (t.parentNode && !Tr(t))
      n = qt(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class Ie {
  constructor(e, t, n = !0) {
    this.node = e, this.offset = t, this.precise = n;
  }
  static before(e, t) {
    return new Ie(e.parentNode, qt(e), t);
  }
  static after(e, t) {
    return new Ie(e.parentNode, qt(e) + 1, t);
  }
}
var U = /* @__PURE__ */ (function(i) {
  return i[i.LTR = 0] = "LTR", i[i.RTL = 1] = "RTL", i;
})(U || (U = {}));
const ai = U.LTR, Wl = U.RTL;
function Nf(i) {
  let e = [];
  for (let t = 0; t < i.length; t++)
    e.push(1 << +i[t]);
  return e;
}
const tm = /* @__PURE__ */ Nf("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), im = /* @__PURE__ */ Nf("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), _o = /* @__PURE__ */ Object.create(null), et = [];
for (let i of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ i.charCodeAt(0), t = /* @__PURE__ */ i.charCodeAt(1);
  _o[e] = t, _o[t] = -e;
}
function Uf(i) {
  return i <= 247 ? tm[i] : 1424 <= i && i <= 1524 ? 2 : 1536 <= i && i <= 1785 ? im[i - 1536] : 1774 <= i && i <= 2220 ? 4 : 8192 <= i && i <= 8204 ? 256 : 64336 <= i && i <= 65023 ? 4 : 1;
}
const nm = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class lt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Wl : ai;
  }
  /**
  @internal
  */
  constructor(e, t, n) {
    this.from = e, this.to = t, this.level = n;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, n, r) {
    let s = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == n)
          return o;
        (s < 0 || (r != 0 ? r < 0 ? l.from < t : l.to > t : e[s].level > l.level)) && (s = o);
      }
    }
    if (s < 0)
      throw new RangeError("Index out of range");
    return s;
  }
}
function Ff(i, e) {
  if (i.length != e.length)
    return !1;
  for (let t = 0; t < i.length; t++) {
    let n = i[t], r = e[t];
    if (n.from != r.from || n.to != r.to || n.direction != r.direction || !Ff(n.inner, r.inner))
      return !1;
  }
  return !0;
}
const N = [];
function rm(i, e, t, n, r) {
  for (let s = 0; s <= n.length; s++) {
    let o = s ? n[s - 1].to : e, l = s < n.length ? n[s].from : t, a = s ? 256 : r;
    for (let h = o, c = a, f = a; h < l; h++) {
      let O = Uf(i.charCodeAt(h));
      O == 512 ? O = c : O == 8 && f == 4 && (O = 16), N[h] = O == 4 ? 2 : O, O & 7 && (f = O), c = O;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let O = N[h];
      if (O == 128)
        h < l - 1 && c == N[h + 1] && c & 24 ? O = N[h] = c : N[h] = 256;
      else if (O == 64) {
        let u = h + 1;
        for (; u < l && N[u] == 64; )
          u++;
        let d = h && c == 8 || u < t && N[u] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let m = h; m < u; m++)
          N[m] = d;
        h = u - 1;
      } else O == 8 && f == 1 && (N[h] = 1);
      c = O, O & 7 && (f = O);
    }
  }
}
function sm(i, e, t, n, r) {
  let s = r == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= n.length; o++) {
    let h = o ? n[o - 1].to : e, c = o < n.length ? n[o].from : t;
    for (let f = h, O, u, d; f < c; f++)
      if (u = _o[O = i.charCodeAt(f)])
        if (u < 0) {
          for (let m = l - 3; m >= 0; m -= 3)
            if (et[m + 1] == -u) {
              let g = et[m + 2], S = g & 2 ? r : g & 4 ? g & 1 ? s : r : 0;
              S && (N[f] = N[et[m]] = S), l = m;
              break;
            }
        } else {
          if (et.length == 189)
            break;
          et[l++] = f, et[l++] = O, et[l++] = a;
        }
      else if ((d = N[f]) == 2 || d == 1) {
        let m = d == r;
        a = m ? 0 : 1;
        for (let g = l - 3; g >= 0; g -= 3) {
          let S = et[g + 2];
          if (S & 2)
            break;
          if (m)
            et[g + 2] |= 2;
          else {
            if (S & 4)
              break;
            et[g + 2] |= 4;
          }
        }
      }
  }
}
function om(i, e, t, n) {
  for (let r = 0, s = n; r <= t.length; r++) {
    let o = r ? t[r - 1].to : i, l = r < t.length ? t[r].from : e;
    for (let a = o; a < l; ) {
      let h = N[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (r == t.length)
              break;
            c = t[r++].to, l = r < t.length ? t[r].from : e;
          } else if (N[c] == 256)
            c++;
          else
            break;
        let f = s == 1, O = (c < e ? N[c] : n) == 1, u = f == O ? f ? 1 : 2 : n;
        for (let d = c, m = r, g = m ? t[m - 1].to : i; d > a; )
          d == g && (d = t[--m].from, g = m ? t[m - 1].to : i), N[--d] = u;
        a = c;
      } else
        s = h, a++;
    }
  }
}
function jo(i, e, t, n, r, s, o) {
  let l = n % 2 ? 2 : 1;
  if (n % 2 == r % 2)
    for (let a = e, h = 0; a < t; ) {
      let c = !0, f = !1;
      if (h == s.length || a < s[h].from) {
        let m = N[a];
        m != l && (c = !1, f = m == 16);
      }
      let O = !c && l == 1 ? [] : null, u = c ? n : n + 1, d = a;
      e: for (; ; )
        if (h < s.length && d == s[h].from) {
          if (f)
            break e;
          let m = s[h];
          if (!c)
            for (let g = m.to, S = h + 1; ; ) {
              if (g == t)
                break e;
              if (S < s.length && s[S].from == g)
                g = s[S++].to;
              else {
                if (N[g] == l)
                  break e;
                break;
              }
            }
          if (h++, O)
            O.push(m);
          else {
            m.from > a && o.push(new lt(a, m.from, u));
            let g = m.direction == ai != !(u % 2);
            zo(i, g ? n + 1 : n, r, m.inner, m.from, m.to, o), a = m.to;
          }
          d = m.to;
        } else {
          if (d == t || (c ? N[d] != l : N[d] == l))
            break;
          d++;
        }
      O ? jo(i, a, d, n + 1, r, O, o) : a < d && o.push(new lt(a, d, u)), a = d;
    }
  else
    for (let a = t, h = s.length; a > e; ) {
      let c = !0, f = !1;
      if (!h || a > s[h - 1].to) {
        let m = N[a - 1];
        m != l && (c = !1, f = m == 16);
      }
      let O = !c && l == 1 ? [] : null, u = c ? n : n + 1, d = a;
      e: for (; ; )
        if (h && d == s[h - 1].to) {
          if (f)
            break e;
          let m = s[--h];
          if (!c)
            for (let g = m.from, S = h; ; ) {
              if (g == e)
                break e;
              if (S && s[S - 1].to == g)
                g = s[--S].from;
              else {
                if (N[g - 1] == l)
                  break e;
                break;
              }
            }
          if (O)
            O.push(m);
          else {
            m.to < a && o.push(new lt(m.to, a, u));
            let g = m.direction == ai != !(u % 2);
            zo(i, g ? n + 1 : n, r, m.inner, m.from, m.to, o), a = m.from;
          }
          d = m.from;
        } else {
          if (d == e || (c ? N[d - 1] != l : N[d - 1] == l))
            break;
          d--;
        }
      O ? jo(i, d, a, n + 1, r, O, o) : d < a && o.push(new lt(d, a, u)), a = d;
    }
}
function zo(i, e, t, n, r, s, o) {
  let l = e % 2 ? 2 : 1;
  rm(i, r, s, n, l), sm(i, r, s, n, l), om(r, s, n, l), jo(i, r, s, e, t, n, o);
}
function lm(i, e, t) {
  if (!i)
    return [new lt(0, 0, e == Wl ? 1 : 0)];
  if (e == ai && !t.length && !nm.test(i))
    return Hf(i.length);
  if (t.length)
    for (; i.length > N.length; )
      N[N.length] = 256;
  let n = [], r = e == ai ? 0 : 1;
  return zo(i, r, r, t, 0, i.length, n), n;
}
function Hf(i) {
  return [new lt(0, i, 0)];
}
let Kf = "";
function am(i, e, t, n, r) {
  var s;
  let o = n.head - i.from, l = lt.find(e, o, (s = n.bidiLevel) !== null && s !== void 0 ? s : -1, n.assoc), a = e[l], h = a.side(r, t);
  if (o == h) {
    let O = l += r ? 1 : -1;
    if (O < 0 || O >= e.length)
      return null;
    a = e[l = O], o = a.side(!r, t), h = a.side(r, t);
  }
  let c = ce(i.text, o, a.forward(r, t));
  (c < a.from || c > a.to) && (c = h), Kf = i.text.slice(Math.min(o, c), Math.max(o, c));
  let f = l == (r ? e.length - 1 : 0) ? null : e[l + (r ? 1 : -1)];
  return f && c == h && f.level + (r ? 0 : 1) < a.level ? b.cursor(f.side(!r, t) + i.from, f.forward(r, t) ? 1 : -1, f.level) : b.cursor(c + i.from, a.forward(r, t) ? -1 : 1, a.level);
}
function hm(i, e, t) {
  for (let n = e; n < t; n++) {
    let r = Uf(i.charCodeAt(n));
    if (r == 1)
      return ai;
    if (r == 2 || r == 4)
      return Wl;
  }
  return ai;
}
const Jf = /* @__PURE__ */ C.define(), eO = /* @__PURE__ */ C.define(), tO = /* @__PURE__ */ C.define(), iO = /* @__PURE__ */ C.define(), Vo = /* @__PURE__ */ C.define(), nO = /* @__PURE__ */ C.define(), rO = /* @__PURE__ */ C.define(), ql = /* @__PURE__ */ C.define(), Yl = /* @__PURE__ */ C.define(), sO = /* @__PURE__ */ C.define({
  combine: (i) => i.some((e) => e)
}), oO = /* @__PURE__ */ C.define({
  combine: (i) => i.some((e) => e)
}), lO = /* @__PURE__ */ C.define();
class ki {
  constructor(e, t, n, r, s, o = !1) {
    this.range = e, this.y = t, this.x = n, this.yMargin = r, this.xMargin = s, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new ki(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new ki(b.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Gn = /* @__PURE__ */ M.define({ map: (i, e) => i.map(e) }), aO = /* @__PURE__ */ M.define();
function Ze(i, e, t) {
  let n = i.facet(iO);
  n.length ? n[0](e) : window.onerror && window.onerror(String(e), t, void 0, void 0, e) || (t ? console.error(t + ":", e) : console.error(e));
}
const bt = /* @__PURE__ */ C.define({ combine: (i) => i.length ? i[0] : !0 });
let cm = 0;
const Si = /* @__PURE__ */ C.define({
  combine(i) {
    return i.filter((e, t) => {
      for (let n = 0; n < t; n++)
        if (i[n].plugin == e.plugin)
          return !1;
      return !0;
    });
  }
});
class ie {
  constructor(e, t, n, r, s) {
    this.id = e, this.create = t, this.domEventHandlers = n, this.domEventObservers = r, this.baseExtensions = s(this), this.extension = this.baseExtensions.concat(Si.of({ plugin: this, arg: void 0 }));
  }
  /**
  Create an extension for this plugin with the given argument.
  */
  of(e) {
    return this.baseExtensions.concat(Si.of({ plugin: this, arg: e }));
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: n, eventObservers: r, provide: s, decorations: o } = t || {};
    return new ie(cm++, e, n, r, (l) => {
      let a = [];
      return o && a.push(ls.of((h) => {
        let c = h.plugin(l);
        return c ? o(c) : Z.none;
      })), s && a.push(s(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ie.define((n, r) => new e(n, r), t);
  }
}
class vs {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  get plugin() {
    return this.spec && this.spec.plugin;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (n) {
            if (Ze(t.state, n, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.plugin.create(e, this.spec.arg);
      } catch (t) {
        Ze(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (n) {
        Ze(e.state, n, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const hO = /* @__PURE__ */ C.define(), _l = /* @__PURE__ */ C.define(), ls = /* @__PURE__ */ C.define(), cO = /* @__PURE__ */ C.define(), jl = /* @__PURE__ */ C.define(), Wn = /* @__PURE__ */ C.define(), fO = /* @__PURE__ */ C.define();
function Ia(i, e) {
  let t = i.state.facet(fO);
  if (!t.length)
    return t;
  let n = t.map((s) => s instanceof Function ? s(i) : s), r = [];
  return j.spans(n, e.from, e.to, {
    point() {
    },
    span(s, o, l, a) {
      let h = s - e.from, c = o - e.from, f = r;
      for (let O = l.length - 1; O >= 0; O--, a--) {
        let u = l[O].spec.bidiIsolate, d;
        if (u == null && (u = hm(e.text, h, c)), a > 0 && f.length && (d = f[f.length - 1]).to == h && d.direction == u)
          d.to = c, f = d.inner;
        else {
          let m = { from: h, to: c, direction: u, inner: [] };
          f.push(m), f = m.inner;
        }
      }
    }
  }), r;
}
const OO = /* @__PURE__ */ C.define();
function zl(i) {
  let e = 0, t = 0, n = 0, r = 0;
  for (let s of i.state.facet(OO)) {
    let o = s(i);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (n = Math.max(n, o.top)), o.bottom != null && (r = Math.max(r, o.bottom)));
  }
  return { left: e, right: t, top: n, bottom: r };
}
const en = /* @__PURE__ */ C.define();
class je {
  constructor(e, t, n, r) {
    this.fromA = e, this.toA = t, this.fromB = n, this.toB = r;
  }
  join(e) {
    return new je(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, n = this;
    for (; t > 0; t--) {
      let r = e[t - 1];
      if (!(r.fromA > n.toA)) {
        if (r.toA < n.fromA)
          break;
        n = n.join(r), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, n), e;
  }
  // Extend a set to cover all the content in `ranges`, which is a
  // flat array with each pair of numbers representing fromB/toB
  // positions. These pairs are generated in unchanged ranges, so the
  // offset between doc A and doc B is the same for their start and
  // end points.
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let n = [];
    for (let r = 0, s = 0, o = 0; ; ) {
      let l = r < e.length ? e[r].fromB : 1e9, a = s < t.length ? t[s] : 1e9, h = Math.min(l, a);
      if (h == 1e9)
        break;
      let c = h + o, f = h, O = c;
      for (; ; )
        if (s < t.length && t[s] <= f) {
          let u = t[s + 1];
          s += 2, f = Math.max(f, u);
          for (let d = r; d < e.length && e[d].fromB <= f; d++)
            o = e[d].toA - e[d].toB;
          O = Math.max(O, u + o);
        } else if (r < e.length && e[r].fromB <= f) {
          let u = e[r++];
          f = Math.max(f, u.toB), O = Math.max(O, u.toA), o = u.toA - u.toB;
        } else
          break;
      n.push(new je(c, O, h, f));
    }
    return n;
  }
}
class Cr {
  constructor(e, t, n) {
    this.view = e, this.state = t, this.transactions = n, this.flags = 0, this.startState = e.state, this.changes = le.empty(this.startState.doc.length);
    for (let s of n)
      this.changes = this.changes.compose(s.changes);
    let r = [];
    this.changes.iterChangedRanges((s, o, l, a) => r.push(new je(s, o, l, a))), this.changedRanges = r;
  }
  /**
  @internal
  */
  static create(e, t, n) {
    return new Cr(e, t, n);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
const fm = [];
class te {
  constructor(e, t, n = 0) {
    this.dom = e, this.length = t, this.flags = n, this.parent = null, e.cmTile = this;
  }
  get breakAfter() {
    return this.flags & 1;
  }
  get children() {
    return fm;
  }
  isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  isComposite() {
    return !1;
  }
  isLine() {
    return !1;
  }
  isText() {
    return !1;
  }
  isBlock() {
    return !1;
  }
  get domAttrs() {
    return null;
  }
  sync(e) {
    if (this.flags |= 2, this.flags & 4) {
      this.flags &= -5;
      let t = this.domAttrs;
      t && Gp(this.dom, t);
    }
  }
  toString() {
    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "");
  }
  destroy() {
    this.parent = null;
  }
  setDOM(e) {
    this.dom = e, e.cmTile = this;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e, t = this.posAtStart) {
    let n = t;
    for (let r of this.children) {
      if (r == e)
        return n;
      n += r.length + r.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  covers(e) {
    return !0;
  }
  coordsIn(e, t, n) {
    return null;
  }
  domPosFor(e, t) {
    let n = qt(this.dom), r = this.length ? e > 0 : t > 0;
    return new Ie(this.parent.dom, n + (r ? 1 : 0), e == 0 || e == this.length);
  }
  markDirty(e) {
    this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
  }
  get overrideDOMText() {
    return null;
  }
  get root() {
    for (let e = this; e; e = e.parent)
      if (e instanceof hs)
        return e;
    return null;
  }
  static get(e) {
    return e.cmTile;
  }
}
class as extends te {
  constructor(e) {
    super(e, 0), this._children = [];
  }
  isComposite() {
    return !0;
  }
  get children() {
    return this._children;
  }
  get lastChild() {
    return this.children.length ? this.children[this.children.length - 1] : null;
  }
  append(e) {
    this.children.push(e), e.parent = this;
  }
  sync(e) {
    if (this.flags & 2)
      return;
    super.sync(e);
    let t = this.dom, n = null, r, s = e?.node == t ? e : null, o = 0;
    for (let l of this.children) {
      if (l.sync(e), o += l.length + l.breakAfter, r = n ? n.nextSibling : t.firstChild, s && r != l.dom && (s.written = !0), l.dom.parentNode == t)
        for (; r && r != l.dom; )
          r = Ga(r);
      else
        t.insertBefore(l.dom, r);
      n = l.dom;
    }
    for (r = n ? n.nextSibling : t.firstChild, s && r && (s.written = !0); r; )
      r = Ga(r);
    this.length = o;
  }
}
function Ga(i) {
  let e = i.nextSibling;
  return i.parentNode.removeChild(i), e;
}
class hs extends as {
  constructor(e, t) {
    super(t), this.view = e;
  }
  owns(e) {
    for (; e; e = e.parent)
      if (e == this)
        return !0;
    return !1;
  }
  isBlock() {
    return !0;
  }
  nearest(e) {
    for (; ; ) {
      if (!e)
        return null;
      let t = te.get(e);
      if (t && this.owns(t))
        return t;
      e = e.parentNode;
    }
  }
  blockTiles(e) {
    for (let t = [], n = this, r = 0, s = 0; ; )
      if (r == n.children.length) {
        if (!t.length)
          return;
        n = n.parent, n.breakAfter && s++, r = t.pop();
      } else {
        let o = n.children[r++];
        if (o instanceof yt)
          t.push(r), n = o, r = 0;
        else {
          let l = s + o.length, a = e(o, s);
          if (a !== void 0)
            return a;
          s = l + o.breakAfter;
        }
      }
  }
  // Find the block at the given position. If side < -1, make sure to
  // stay before block widgets at that position, if side > 1, after
  // such widgets (used for selection drawing, which needs to be able
  // to get coordinates for positions that aren't valid cursor positions).
  resolveBlock(e, t) {
    let n, r = -1, s, o = -1;
    if (this.blockTiles((l, a) => {
      let h = a + l.length;
      if (e >= a && e <= h) {
        if (l.isWidget() && t >= -1 && t <= 1) {
          if (l.flags & 32)
            return !0;
          l.flags & 16 && (n = void 0);
        }
        (a < e || e == h && (t < -1 ? l.length : l.covers(1))) && (!n || !l.isWidget() && n.isWidget()) && (n = l, r = e - a), (h > e || e == a && (t > 1 ? l.length : l.covers(-1))) && (!s || !l.isWidget() && s.isWidget()) && (s = l, o = e - a);
      }
    }), !n && !s)
      throw new Error("No tile at position " + e);
    return n && t < 0 || !s ? { tile: n, offset: r } : { tile: s, offset: o };
  }
}
class yt extends as {
  constructor(e, t) {
    super(e), this.wrapper = t;
  }
  isBlock() {
    return !0;
  }
  covers(e) {
    return this.children.length ? e < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1) : !1;
  }
  get domAttrs() {
    return this.wrapper.attributes;
  }
  static of(e, t) {
    let n = new yt(t || document.createElement(e.tagName), e);
    return t || (n.flags |= 4), n;
  }
}
class Zi extends as {
  constructor(e, t) {
    super(e), this.attrs = t;
  }
  isLine() {
    return !0;
  }
  static start(e, t, n) {
    let r = new Zi(t || document.createElement("div"), e);
    return (!t || !n) && (r.flags |= 4), r;
  }
  get domAttrs() {
    return this.attrs;
  }
  // Find the tile associated with a given position in this line.
  // Side -2/2 is handled specially, in that it allows the position
  // returned to be before (-2) or after (2) widgets that would always
  // be after/before a cursor position.
  resolveInline(e, t, n) {
    let r = null, s = -1, o = null, l = -1;
    function a(c, f) {
      for (let O = 0, u = 0; O < c.children.length && u <= f; O++) {
        let d = c.children[O], m = u + d.length;
        m >= f && (d.isComposite() ? a(d, f - u) : (!o || o.isHidden && (t > 0 && !(o.flags & 32) || n && um(o, d))) && (m > f || d.flags & 32 && t <= 1) ? (o = d, l = f - u) : (u < f || d.flags & 16 && !d.isHidden && t >= -1) && (r = d, s = f - u)), u = m;
      }
    }
    a(this, e);
    let h = (t < 0 ? r : o) || r || o;
    return h ? { tile: h, offset: h == r ? s : l } : null;
  }
  coordsIn(e, t, n) {
    let r = this.resolveInline(e, t, !0);
    return r ? r.tile.coordsIn(Math.max(0, r.offset), t, n) : Om(this);
  }
  domIn(e, t) {
    let n = this.resolveInline(e, t);
    if (n) {
      let { tile: r, offset: s } = n;
      if (this.dom.contains(r.dom))
        return r.isText() ? new Ie(r.dom, Math.min(r.dom.nodeValue.length, s)) : r.domPosFor(s, r.flags & 16 ? 1 : r.flags & 32 ? -1 : t);
      let o = n.tile.parent, l = !1;
      for (let a of o.children) {
        if (l)
          return new Ie(a.dom, 0);
        a == n.tile && (l = !0);
      }
    }
    return new Ie(this.dom, 0);
  }
}
function Om(i) {
  let e = i.dom.lastChild;
  if (!e)
    return i.dom.getBoundingClientRect();
  let t = an(e);
  return t[t.length - 1] || null;
}
function um(i, e) {
  let t = i.coordsIn(0, 1), n = e.coordsIn(0, 1);
  return t && n && n.top < t.bottom;
}
class Xe extends as {
  constructor(e, t) {
    super(e), this.mark = t;
  }
  get domAttrs() {
    return this.mark.attrs;
  }
  static of(e, t) {
    let n = new Xe(t || document.createElement(e.tagName), e);
    return t || (n.flags |= 4), n;
  }
}
class ti extends te {
  constructor(e, t) {
    super(e, t.length), this.text = t;
  }
  sync(e) {
    this.flags & 2 || (super.sync(e), this.dom.nodeValue != this.text && (e && e.node == this.dom && (e.written = !0), this.dom.nodeValue = this.text));
  }
  isText() {
    return !0;
  }
  toString() {
    return JSON.stringify(this.text);
  }
  coordsIn(e, t, n) {
    let r = this.dom.nodeValue.length;
    e > r && (e = r);
    let s = e, o = e, l = 0;
    e == 0 && t < 0 || e == r && t >= 0 ? T.chrome || T.gecko || (e ? (s--, l = 1) : o < r && (o++, l = -1)) : t < 0 ? s-- : o < r && o++;
    let a = Qn(this.dom, s, o).getClientRects();
    if (!a.length)
      return null;
    let h = a[(l ? l < 0 : t >= 0) ? 0 : a.length - 1];
    return T.safari && !l && h.width == 0 && (h = Array.prototype.find.call(a, (c) => c.width) || h), n == null ? h : Sn(h, (l ? l > 0 : t < 0) == n);
  }
  static of(e, t) {
    let n = new ti(t || document.createTextNode(e), e);
    return t || (n.flags |= 2), n;
  }
}
class hi extends te {
  constructor(e, t, n, r) {
    super(e, t, r), this.widget = n;
  }
  isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  covers(e) {
    return this.flags & 48 ? !1 : (this.flags & (e < 0 ? 64 : 128)) > 0;
  }
  coordsIn(e, t) {
    return this.coordsInWidget(e, t, !1);
  }
  coordsInWidget(e, t, n) {
    let r = this.widget.coordsAt(this.dom, e, t);
    if (r)
      return r;
    if (n)
      return Sn(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
    {
      let s = this.dom.getClientRects(), o = null;
      if (!s.length)
        return null;
      let l = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
      for (let a = l ? s.length - 1 : 0; o = s[a], !(e > 0 ? a == 0 : a == s.length - 1 || o.top < o.bottom); a += l ? -1 : 1)
        ;
      return Sn(o, !l);
    }
  }
  get overrideDOMText() {
    if (!this.length)
      return D.empty;
    let { root: e } = this;
    if (!e)
      return D.empty;
    let t = this.posAtStart;
    return e.view.state.doc.slice(t, t + this.length);
  }
  destroy() {
    super.destroy(), this.widget.destroy(this.dom);
  }
  static of(e, t, n, r, s) {
    return s || (s = e.toDOM(t), e.editable || (s.contentEditable = "false")), new hi(s, n, e, r);
  }
}
class Xr extends te {
  constructor(e) {
    let t = document.createElement("img");
    t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
  }
  get isHidden() {
    return !0;
  }
  get overrideDOMText() {
    return D.empty;
  }
  coordsIn(e, t, n) {
    let r = this.dom.getBoundingClientRect();
    return n == null ? r : Sn(r, t > 0 == n);
  }
}
class dm {
  constructor(e) {
    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
  }
  // Advance by the given distance. If side is -1, stop leaving or
  // entering tiles, or skipping zero-length tiles, once the distance
  // has been traversed. When side is 1, leave, enter, or skip
  // everything at the end position.
  advance(e, t, n) {
    let { tile: r, index: s, beforeBreak: o, parents: l } = this;
    for (; e || t > 0; )
      if (r.isComposite())
        if (o) {
          if (!e)
            break;
          n && n.break(), e--, o = !1;
        } else if (s == r.children.length) {
          if (!e && !l.length)
            break;
          n && n.leave(r), o = !!r.breakAfter, { tile: r, index: s } = l.pop(), s++;
        } else {
          let a = r.children[s], h = a.breakAfter;
          (t > 0 ? a.length <= e : a.length < e) && (!n || n.skip(a, 0, a.length) !== !1 || !a.isComposite) ? (o = !!h, s++, e -= a.length) : (l.push({ tile: r, index: s }), r = a, s = 0, n && a.isComposite() && n.enter(a));
        }
      else {
        let a = r.length;
        if (s < a && e) {
          let h = Math.min(e, a - s);
          n && n.skip(r, s, s + h), e -= h, s += h;
        }
        if (s == a)
          o = !!r.breakAfter, { tile: r, index: s } = l.pop(), s++;
        else if (!e)
          break;
      }
    return this.tile = r, this.index = s, this.beforeBreak = o, this;
  }
  get root() {
    return this.parents.length ? this.parents[0].tile : this.tile;
  }
}
class pm {
  constructor(e, t, n, r) {
    this.from = e, this.to = t, this.wrapper = n, this.rank = r;
  }
}
class mm {
  constructor(e, t, n) {
    this.cache = e, this.root = t, this.blockWrappers = n, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
  }
  addText(e, t, n, r) {
    var s;
    this.flushBuffer();
    let o = this.ensureMarks(t, n), l = o.lastChild;
    if (l && l.isText() && !(l.flags & 8) && l.length + e.length < 512) {
      this.cache.reused.set(
        l,
        2
        /* Reused.DOM */
      );
      let a = o.children[o.children.length - 1] = new ti(l.dom, l.text + e);
      a.parent = o;
    } else
      o.append(r || ti.of(e, (s = this.cache.find(ti)) === null || s === void 0 ? void 0 : s.dom));
    this.pos += e.length, this.afterWidget = null;
  }
  addComposition(e, t) {
    let n = this.curLine;
    n.dom != t.line.dom && (n.setDOM(this.cache.reused.has(t.line) ? Ts(t.line.dom) : t.line.dom), this.cache.reused.set(
      t.line,
      2
      /* Reused.DOM */
    ));
    let r = n;
    for (let l = t.marks.length - 1; l >= 0; l--) {
      let a = t.marks[l], h = r.lastChild;
      if (h instanceof Xe && h.mark.eq(a.mark))
        h.dom != a.dom && h.setDOM(Ts(a.dom)), r = h;
      else {
        if (this.cache.reused.get(a)) {
          let f = te.get(a.dom);
          f && f.setDOM(Ts(a.dom));
        }
        let c = Xe.of(a.mark, a.dom);
        r.append(c), r = c;
      }
      this.cache.reused.set(
        a,
        2
        /* Reused.DOM */
      );
    }
    let s = te.get(e.text);
    s && this.cache.reused.set(
      s,
      2
      /* Reused.DOM */
    );
    let o = new ti(e.text, e.text.nodeValue);
    o.flags |= 8, this.pos = e.range.toB, r.append(o);
  }
  addInlineWidget(e, t, n) {
    let r = this.afterWidget && e.flags & 48 && (this.afterWidget.flags & 48) == (e.flags & 48);
    r || this.flushBuffer();
    let s = this.ensureMarks(t, n);
    !r && !(e.flags & 16) && s.append(this.getBuffer(1)), s.append(e), this.pos += e.length, this.afterWidget = e;
  }
  addMark(e, t, n) {
    this.flushBuffer(), this.ensureMarks(t, n).append(e), this.pos += e.length, this.afterWidget = null;
  }
  addBlockWidget(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  continueWidget(e) {
    let t = this.afterWidget || this.lastBlock;
    t.length += e, this.pos += e;
  }
  addLineStart(e, t) {
    var n;
    e || (e = uO);
    let r = Zi.start(e, t || ((n = this.cache.find(Zi)) === null || n === void 0 ? void 0 : n.dom), !!t);
    this.getBlockPos().append(this.lastBlock = this.curLine = r);
  }
  addLine(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  addBreak() {
    this.lastBlock.flags |= 1, this.endLine(), this.pos++;
  }
  addLineStartIfNotCovered(e) {
    this.blockPosCovered() || this.addLineStart(e);
  }
  ensureLine(e) {
    this.curLine || this.addLineStart(e);
  }
  ensureMarks(e, t) {
    var n;
    let r = this.curLine;
    for (let s = e.length - 1; s >= 0; s--) {
      let o = e[s], l;
      if (t > 0 && (l = r.lastChild) && l instanceof Xe && l.mark.eq(o))
        r = l, t--;
      else {
        let a = Xe.of(o, (n = this.cache.find(Xe, (h) => h.mark.eq(o))) === null || n === void 0 ? void 0 : n.dom);
        r.append(a), r = a, t = 0;
      }
    }
    return r;
  }
  endLine() {
    if (this.curLine) {
      this.flushBuffer();
      let e = this.curLine.lastChild;
      (!e || !Na(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(T.ios && Na(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(
        Cs,
        0,
        32
        /* TileFlag.After */
      ) || new hi(
        Cs.toDOM(),
        0,
        Cs,
        32
        /* TileFlag.After */
      )), this.curLine = this.afterWidget = null;
    }
  }
  updateBlockWrappers() {
    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
    for (let e = this.wrappers.length - 1; e >= 0; e--)
      this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
    for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next())
      if (e.to >= this.pos) {
        let t = e.rank * 102 + e.value.rank, n = new pm(e.from, e.to, e.value, t), r = this.wrappers.length;
        for (; r > 0 && (this.wrappers[r - 1].rank - n.rank || this.wrappers[r - 1].to - n.to) < 0; )
          r--;
        this.wrappers.splice(r, 0, n);
      }
    this.wrapperPos = this.pos;
  }
  getBlockPos() {
    var e;
    this.updateBlockWrappers();
    let t = this.root;
    for (let n of this.wrappers) {
      let r = t.lastChild;
      if (n.from < this.pos && r instanceof yt && r.wrapper.eq(n.wrapper))
        t = r;
      else {
        let s = yt.of(n.wrapper, (e = this.cache.find(yt, (o) => o.wrapper.eq(n.wrapper))) === null || e === void 0 ? void 0 : e.dom);
        t.append(s), t = s;
      }
    }
    return t;
  }
  blockPosCovered() {
    let e = this.lastBlock;
    return e != null && !e.breakAfter && (!e.isWidget() || (e.flags & 160) > 0);
  }
  getBuffer(e) {
    let t = 2 | (e < 0 ? 16 : 32), n = this.cache.find(
      Xr,
      void 0,
      1
      /* Reused.Full */
    );
    return n && (n.flags = t), n || new Xr(t);
  }
  flushBuffer() {
    this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
  }
}
class gm {
  constructor(e) {
    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = e.iter();
  }
  skip(e) {
    this.textOff + e <= this.text.length ? this.textOff += e : (this.skipCount += e - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
  }
  next(e) {
    if (this.textOff == this.text.length) {
      let { value: r, lineBreak: s, done: o } = this.cursor.next(this.skipCount);
      if (this.skipCount = 0, o)
        throw new Error("Ran out of text content when drawing inline views");
      this.text = r;
      let l = this.textOff = Math.min(e, r.length);
      return s ? null : r.slice(0, l);
    }
    let t = Math.min(this.text.length, this.textOff + e), n = this.text.slice(this.textOff, t);
    return this.textOff = t, n;
  }
}
const Zr = [hi, Zi, ti, Xe, Xr, yt, hs];
for (let i = 0; i < Zr.length; i++)
  Zr[i].bucket = i;
class Sm {
  constructor(e) {
    this.view = e, this.buckets = Zr.map(() => []), this.index = Zr.map(() => 0), this.reused = /* @__PURE__ */ new Map();
  }
  // Put a tile in the cache.
  add(e) {
    let t = e.constructor.bucket, n = this.buckets[t];
    n.length < 6 ? n.push(e) : n[
      this.index[t] = (this.index[t] + 1) % 6
      /* C.Bucket */
    ] = e;
  }
  find(e, t, n = 2) {
    let r = e.bucket, s = this.buckets[r], o = this.index[r];
    for (let l = 0; l < s.length; l++) {
      let a = (l + o) % s.length, h = s[a];
      if ((!t || t(h)) && !this.reused.has(h))
        return s.splice(a, 1), a < o && this.index[r]--, this.reused.set(h, n), h;
    }
    return null;
  }
  findWidget(e, t, n) {
    let r = this.buckets[0];
    if (r.length)
      for (let s = 0, o = 0; ; s++) {
        if (s == r.length) {
          if (o)
            return null;
          o = 1, s = 0;
        }
        let l = r[s];
        if (!this.reused.has(l) && (o == 0 ? l.widget.compare(e) : l.widget.constructor == e.constructor && e.updateDOM(l.dom, this.view, l.widget)))
          return r.splice(s, 1), s < this.index[0] && this.index[0]--, l.widget == e && l.length == t && (l.flags & 497) == n ? (this.reused.set(
            l,
            1
            /* Reused.Full */
          ), l) : (this.reused.set(
            l,
            2
            /* Reused.DOM */
          ), new hi(l.dom, t, e, l.flags & -498 | n));
      }
  }
  reuse(e) {
    return this.reused.set(
      e,
      1
      /* Reused.Full */
    ), e;
  }
  maybeReuse(e, t = 2) {
    if (!this.reused.has(e))
      return this.reused.set(e, t), e.dom;
  }
  clear() {
    for (let e = 0; e < this.buckets.length; e++)
      this.buckets[e].length = this.index[e] = 0;
  }
}
class Qm {
  constructor(e, t, n, r, s) {
    this.view = e, this.decorations = r, this.disallowBlockEffectsFor = s, this.openWidget = !1, this.openMarks = 0, this.cache = new Sm(e), this.text = new gm(e.state.doc), this.builder = new mm(this.cache, new hs(e, e.contentDOM), j.iter(n)), this.cache.reused.set(
      t,
      2
      /* Reused.DOM */
    ), this.old = new dm(t), this.reuseWalker = {
      skip: (o, l, a) => {
        if (this.cache.add(o), o.isComposite())
          return !1;
      },
      enter: (o) => this.cache.add(o),
      leave: () => {
      },
      break: () => {
      }
    };
  }
  run(e, t) {
    let n = t && this.getCompositionContext(t.text);
    for (let r = 0, s = 0, o = 0; ; ) {
      let l = o < e.length ? e[o++] : null, a = l ? l.fromA : this.old.root.length;
      if (a > r) {
        let h = a - r;
        this.preserve(h, !o, !l), r = a, s += h;
      }
      if (!l)
        break;
      t && l.fromA <= t.range.fromA && l.toA >= t.range.toA ? (this.forward(l.fromA, t.range.fromA, t.range.fromA < t.range.toA ? 1 : -1), this.emit(s, t.range.fromB), this.builder.flushBuffer(), this.cache.clear(), this.builder.addComposition(t, n), this.text.skip(t.range.toB - t.range.fromB), this.forward(t.range.fromA, l.toA), this.emit(t.range.toB, l.toB)) : (this.forward(l.fromA, l.toA), this.emit(s, l.toB)), s = l.toB, r = l.toA;
    }
    return this.builder.curLine && this.builder.endLine(), this.builder.root;
  }
  preserve(e, t, n) {
    let r = xm(this.old), s = this.openMarks;
    this.old.advance(e, n ? 1 : -1, {
      skip: (o, l, a) => {
        if (o.isWidget())
          if (this.openWidget)
            this.builder.continueWidget(a - l);
          else {
            let h = a > 0 || l < o.length ? hi.of(o.widget, this.view, a - l, o.flags & 496, this.cache.maybeReuse(o)) : this.cache.reuse(o);
            h.flags & 256 ? (h.flags &= -2, this.builder.addBlockWidget(h)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(h, r, s), s = r.length);
          }
        else if (o.isText())
          this.builder.ensureLine(null), !l && a == o.length && !this.cache.reused.has(o) ? this.builder.addText(o.text, r, s, this.cache.reuse(o)) : (this.cache.add(o), this.builder.addText(o.text.slice(l, a), r, s)), s = r.length;
        else if (o.isLine())
          o.flags &= -2, this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), this.builder.addLine(o);
        else if (o instanceof Xr)
          this.cache.add(o);
        else if (o instanceof Xe)
          this.builder.ensureLine(null), this.builder.addMark(o, r, s), this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), s = r.length;
        else
          return !1;
        this.openWidget = !1;
      },
      enter: (o) => {
        o.isLine() ? this.builder.addLineStart(o.attrs, this.cache.maybeReuse(o)) : (this.cache.add(o), o instanceof Xe && r.unshift(o.mark)), this.openWidget = !1;
      },
      leave: (o) => {
        o.isLine() ? r.length && (r.length = s = 0) : o instanceof Xe && (r.shift(), s = Math.min(s, r.length));
      },
      break: () => {
        this.builder.addBreak(), this.openWidget = !1;
      }
    }), this.text.skip(e);
  }
  emit(e, t) {
    let n = null, r = this.builder, s = -1, o = j.spans(this.decorations, e, t, {
      point: (l, a, h, c, f, O) => {
        if (h instanceof li) {
          if (this.disallowBlockEffectsFor[O]) {
            if (h.block)
              throw new RangeError("Block decorations may not be specified via plugins");
            if (a > this.view.state.doc.lineAt(l).to)
              throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
          }
          if (s = c.length, f > c.length)
            r.continueWidget(a - l);
          else {
            let u = h.widget || (h.block ? Ri.block : Ri.inline), d = bm(h), m = this.cache.findWidget(u, a - l, d) || hi.of(u, this.view, a - l, d);
            h.block ? (h.startSide > 0 && r.addLineStartIfNotCovered(n), r.addBlockWidget(m)) : (r.ensureLine(n), r.addInlineWidget(m, c, f));
          }
          n = null;
        } else
          n = ym(n, h);
        a > l && this.text.skip(a - l);
      },
      span: (l, a, h, c) => {
        for (let f = l; f < a; ) {
          let O = this.text.next(Math.min(512, a - f));
          O == null ? (r.addLineStartIfNotCovered(n), r.addBreak(), f++) : (r.ensureLine(n), r.addText(O, h, f == l ? c : h.length), f += O.length), n = null;
        }
        s = h.length;
      }
    });
    s > -1 && (this.openWidget = o > s), this.openWidget || r.addLineStartIfNotCovered(n), this.openMarks = o;
  }
  forward(e, t, n = 1) {
    t - e <= 10 ? this.old.advance(t - e, n, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, n, this.reuseWalker));
  }
  getCompositionContext(e) {
    let t = [], n = null;
    for (let r = e.parentNode; ; r = r.parentNode) {
      let s = te.get(r);
      if (r == this.view.contentDOM)
        break;
      s instanceof Xe ? t.push(s) : s?.isLine() ? n = s : s instanceof yt || (r.nodeName == "DIV" && !n && r != this.view.contentDOM ? n = new Zi(r, uO) : n || t.push(Xe.of(new An({ tagName: r.nodeName.toLowerCase(), attributes: Np(r) }), r)));
    }
    return { line: n, marks: t };
  }
}
function Na(i, e) {
  let t = (n) => {
    for (let r of n.children)
      if ((e ? r.isText() : r.length) || t(r))
        return !0;
    return !1;
  };
  return t(i);
}
function bm(i) {
  let e = i.isReplace ? (i.startSide < 0 ? 64 : 0) | (i.endSide > 0 ? 128 : 0) : i.startSide > 0 ? 32 : 16;
  return i.block && (e |= 256), e;
}
const uO = { class: "cm-line" };
function ym(i, e) {
  let t = e.spec.attributes, n = e.spec.class;
  return !t && !n || (i || (i = { class: "cm-line" }), t && Al(t, i), n && (i.class += " " + n)), i;
}
function xm(i) {
  let e = [];
  for (let t = i.parents.length; t > 1; t--) {
    let n = t == i.parents.length ? i.tile : i.parents[t].tile;
    n instanceof Xe && e.push(n.mark);
  }
  return e;
}
function Ts(i) {
  let e = te.get(i);
  return e && e.setDOM(i.cloneNode()), i;
}
class Ri extends Ue {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Ri.inline = /* @__PURE__ */ new Ri("span");
Ri.block = /* @__PURE__ */ new Ri("div");
const Cs = /* @__PURE__ */ new class extends Ue {
  toDOM() {
    return document.createElement("br");
  }
  get isHidden() {
    return !0;
  }
  get editable() {
    return !0;
  }
}();
class Ua {
  constructor(e) {
    this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = Z.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new hs(e, e.contentDOM), this.updateInner([new je(0, 0, 0, e.state.doc.length)], null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let n = e.changedRanges;
    this.minWidth > 0 && n.length && (n.every(({ fromA: c, toA: f }) => f < this.minWidthFrom || c > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let r = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? r = this.domChanged.newSel.head : !Zm(e.changes, this.hasComposition) && !e.selectionSet && (r = e.state.selection.main.head));
    let s = r > -1 ? Pm(this.view, e.changes, r) : null;
    if (this.domChanged = null, this.hasComposition) {
      let { from: c, to: f } = this.hasComposition;
      n = new je(c, f, e.changes.mapPos(c, -1), e.changes.mapPos(f, 1)).addToSet(n.slice());
    }
    this.hasComposition = s ? { from: s.range.fromB, to: s.range.toB } : null, (T.ie || T.chrome) && !s && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.blockWrappers;
    this.updateDeco();
    let a = vm(o, this.decorations, e.changes);
    a.length && (n = je.extendWithRanges(n, a));
    let h = Cm(l, this.blockWrappers, e.changes);
    return h.length && (n = je.extendWithRanges(n, h)), s && !n.some((c) => c.fromA <= s.range.fromA && c.toA >= s.range.toA) && (n = s.range.addToSet(n.slice())), this.tile.flags & 2 && n.length == 0 ? !1 : (this.updateInner(n, s), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t) {
    this.view.viewState.mustMeasureContent = !0;
    let { observer: n } = this.view;
    n.ignore(() => {
      if (t || e.length) {
        let o = this.tile, l = new Qm(this.view, o, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
        t && te.get(t.text) && l.cache.reused.set(
          te.get(t.text),
          2
          /* Reused.DOM */
        ), this.tile = l.run(e, t), Do(o, l.cache.reused);
      }
      this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let s = T.chrome || T.ios ? { node: n.selectionRange.focusNode, written: !1 } : void 0;
      this.tile.sync(s), s && (s.written || n.selectionRange.focusNode != s.node || !this.tile.dom.contains(s.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
    });
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let s of this.tile.children)
        s.isWidget() && s.widget instanceof Xs && r.push(s.dom);
    n.updateGaps(r);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let n of t.effects)
        n.is(aO) && (this.editContextFormatting = n.value);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let { dom: n } = this.tile, r = this.view.root.activeElement, s = r == n, o = !s && !(this.view.state.facet(bt) || n.tabIndex > -1) && ln(n, this.view.observer.selectionRange) && !(r && n.contains(r));
    if (!(s || t || o))
      return;
    let l = this.forceSelection;
    this.forceSelection = !1;
    let a = this.view.state.selection.main, h, c;
    if (a.empty ? c = h = this.inlineDOMNearPos(a.anchor, a.assoc || 1) : (c = this.inlineDOMNearPos(a.head, a.head == a.from ? 1 : -1), h = this.inlineDOMNearPos(a.anchor, a.anchor == a.from ? 1 : -1)), T.gecko && a.empty && !this.hasComposition && $m(h)) {
      let O = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(O, h.node.childNodes[h.offset] || null)), h = c = new Ie(O, 0), l = !0;
    }
    let f = this.view.observer.selectionRange;
    (l || !f.focusNode || (!hn(h.node, h.offset, f.anchorNode, f.anchorOffset) || !hn(c.node, c.offset, f.focusNode, f.focusOffset)) && !this.suppressWidgetCursorChange(f, a)) && (this.view.observer.ignore(() => {
      T.android && T.chrome && n.contains(f.focusNode) && Xm(f.focusNode, n) && (n.blur(), n.focus({ preventScroll: !0 }));
      let O = gn(this.view.root);
      if (O) if (a.empty) {
        if (T.gecko) {
          let u = km(h.node, h.offset);
          if (u && u != 3) {
            let d = (u == 1 ? If : Gf)(h.node, h.offset);
            d && (h = new Ie(d.node, d.offset));
          }
        }
        O.collapse(h.node, h.offset), a.bidiLevel != null && O.caretBidiLevel !== void 0 && (O.caretBidiLevel = a.bidiLevel);
      } else if (O.extend) {
        O.collapse(h.node, h.offset);
        try {
          O.extend(c.node, c.offset);
        } catch {
        }
      } else {
        let u = document.createRange();
        a.anchor > a.head && ([h, c] = [c, h]), u.setEnd(c.node, c.offset), u.setStart(h.node, h.offset), O.removeAllRanges(), O.addRange(u);
      }
      o && this.view.root.activeElement == n && (n.blur(), r && r.focus());
    }), this.view.observer.setSelectionRange(h, c)), this.impreciseAnchor = h.precise ? null : new Ie(f.anchorNode, f.anchorOffset), this.impreciseHead = c.precise ? null : new Ie(f.focusNode, f.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && hn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, n = gn(e.root), { anchorNode: r, anchorOffset: s } = e.observer.selectionRange;
    if (!n || !t.empty || !t.assoc || !n.modify)
      return;
    let o = this.lineAt(t.head, t.assoc);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(t.head + t.assoc, t.assoc);
    n.collapse(c.node, c.offset), n.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let f = e.observer.selectionRange;
    e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from && n.collapse(r, s);
  }
  posFromDOM(e, t) {
    let n = this.tile.nearest(e);
    if (!n)
      return this.tile.dom.compareDocumentPosition(e) & 2 ? 0 : this.view.state.doc.length;
    let r = n.posAtStart;
    if (n.isComposite()) {
      let s;
      if (e == n.dom)
        s = n.dom.childNodes[t];
      else {
        let o = Pt(e) == 0 ? 0 : t == 0 ? -1 : 1;
        for (; ; ) {
          let l = e.parentNode;
          if (l == n.dom)
            break;
          o == 0 && l.firstChild != l.lastChild && (e == l.firstChild ? o = -1 : o = 1), e = l;
        }
        o < 0 ? s = e : s = e.nextSibling;
      }
      if (s == n.dom.firstChild)
        return r;
      for (; s && !te.get(s); )
        s = s.nextSibling;
      if (!s)
        return r + n.length;
      for (let o = 0, l = r; ; o++) {
        let a = n.children[o];
        if (a.dom == s)
          return l;
        l += a.length + a.breakAfter;
      }
    } else return n.isText() ? e == n.dom ? r + t : r + (t ? n.length : 0) : r;
  }
  domAtPos(e, t) {
    let { tile: n, offset: r } = this.tile.resolveBlock(e, t);
    return n.isWidget() ? n.domPosFor(r, t) : n.domIn(r, t);
  }
  inlineDOMNearPos(e, t) {
    let n, r = -1, s = !1, o, l = -1, a = !1;
    return this.tile.blockTiles((h, c) => {
      if (h.isWidget()) {
        if (h.flags & 32 && c >= e)
          return !0;
        h.flags & 16 && (s = !0);
      } else {
        let f = c + h.length;
        if (c <= e && (n = h, r = e - c, s = f < e), f >= e && !o && (o = h, l = e - c, a = c > e), c > e && o)
          return !0;
      }
    }), !n && !o ? this.domAtPos(e, t) : (s && o ? n = null : a && n && (o = null), n && t < 0 || !o ? n.domIn(r, t) : o.domIn(l, t));
  }
  // Get the coord of the element at the given side of the given
  // position. If rtl is given, flatten it using that text direction.
  coordsAt(e, t, n) {
    let { tile: r, offset: s } = this.tile.resolveBlock(e, t);
    return r.isWidget() ? r.widget instanceof Xs ? null : r.coordsInWidget(s, t, !0) : r.coordsIn(s, t, n);
  }
  lineAt(e, t) {
    let { tile: n } = this.tile.resolveBlock(e, t);
    return n.isLine() ? n : null;
  }
  coordsForChar(e) {
    let { tile: t, offset: n } = this.tile.resolveBlock(e, 1);
    if (!t.isLine())
      return null;
    function r(s, o) {
      if (s.isComposite())
        for (let l of s.children) {
          if (l.length >= o) {
            let a = r(l, o);
            if (a)
              return a;
          }
          if (o -= l.length, o < 0)
            break;
        }
      else if (s.isText() && o < s.length) {
        let l = ce(s.text, o);
        if (l == o)
          return null;
        let a = Qn(s.dom, o, l).getClientRects();
        for (let h = 0; h < a.length; h++) {
          let c = a[h];
          if (h == a.length - 1 || c.top < c.bottom && c.left < c.right)
            return c;
        }
      }
      return null;
    }
    return r(t, n);
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: n, to: r } = e, s = this.view.contentDOM.clientWidth, o = s > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == U.LTR, h = 0, c = (f, O, u) => {
      for (let d = 0; d < f.children.length && !(O > r); d++) {
        let m = f.children[d], g = O + m.length, S = m.dom.getBoundingClientRect(), { height: Q } = S;
        if (u && !d && (h += S.top - u.top), m instanceof yt)
          g > n && c(m, O, S);
        else if (O >= n && (h > 0 && t.push(-h), t.push(Q + h), h = 0, o)) {
          let y = m.dom.lastChild, w = y ? an(y) : [];
          if (w.length) {
            let x = w[w.length - 1], $ = a ? x.right - S.left : S.right - x.left;
            $ > l && (l = $, this.minWidth = s, this.minWidthFrom = O, this.minWidthTo = g);
          }
        }
        u && d == f.children.length - 1 && (h += u.bottom - S.bottom), O = g + m.breakAfter;
      }
    };
    return c(this.tile, 0, null), t;
  }
  textDirectionAt(e) {
    let { tile: t } = this.tile.resolveBlock(e, 1);
    return getComputedStyle(t.dom).direction == "rtl" ? U.RTL : U.LTR;
  }
  measureTextSize() {
    let e = this.tile.blockTiles((o) => {
      if (o.isLine() && o.children.length && o.length <= 20) {
        let l = 0, a;
        for (let h of o.children) {
          if (!h.isText() || /[^ -~]/.test(h.text))
            return;
          let c = an(h.dom);
          if (c.length != 1)
            return;
          l += c[0].width, a = c[0].height;
        }
        if (l)
          return {
            lineHeight: o.dom.getBoundingClientRect().height,
            charWidth: l / o.length,
            textHeight: a
          };
      }
    });
    if (e)
      return e;
    let t = document.createElement("div"), n, r, s;
    return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.tile.dom.appendChild(t);
      let o = an(t.firstChild)[0];
      n = t.getBoundingClientRect().height, r = o && o.width ? o.width / 27 : 7, s = o && o.height ? o.height : n, t.remove();
    }), { lineHeight: n, charWidth: r, textHeight: s };
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let n = 0, r = 0; ; r++) {
      let s = r == t.viewports.length ? null : t.viewports[r], o = s ? s.from - 1 : this.view.state.doc.length;
      if (o > n) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(n).top) / this.view.scaleY;
        e.push(Z.replace({
          widget: new Xs(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(n, o));
      }
      if (!s)
        break;
      n = s.to + 1;
    }
    return Z.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(ls).map((s) => (this.dynamicDecorationMap[e++] = typeof s == "function") ? s(this.view) : s), n = !1, r = this.view.state.facet(jl).map((s, o) => {
      let l = typeof s == "function";
      return l && (n = !0), l ? s(this.view) : s;
    });
    for (r.length && (this.dynamicDecorationMap[e++] = n, t.push(j.join(r))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    this.blockWrappers = this.view.state.facet(cO).map((s) => typeof s == "function" ? s(this.view) : s);
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let h of this.view.state.facet(lO))
      try {
        if (h(this.view, e.range, e))
          return !0;
      } catch (c) {
        Ze(this.view.state, c, "scroll handler");
      }
    let { range: t } = e, n = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), r;
    if (!n)
      return;
    !t.empty && (r = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (n = {
      left: Math.min(n.left, r.left),
      top: Math.min(n.top, r.top),
      right: Math.max(n.right, r.right),
      bottom: Math.max(n.bottom, r.bottom)
    });
    let s = zl(this.view), o = {
      left: n.left - s.left,
      top: n.top - s.top,
      right: n.right + s.right,
      bottom: n.bottom + s.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    if (Hp(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == U.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (n.top > window.pageYOffset + window.visualViewport.offsetTop + window.visualViewport.height || n.bottom < window.pageYOffset + window.visualViewport.offsetTop)) {
      let h = this.view.docView.lineAt(t.head, 1);
      h && h.dom.scrollIntoView({ block: "nearest" });
    }
  }
  lineHasWidget(e) {
    let t = (n) => n.isWidget() || n.children.some(t);
    return t(this.tile.resolveBlock(e, 1).tile);
  }
  destroy() {
    Do(this.tile);
  }
}
function Do(i, e) {
  let t = e?.get(i);
  if (t != 1) {
    t == null && i.destroy();
    for (let n of i.children)
      Do(n, e);
  }
}
function $m(i) {
  return i.node.nodeType == 1 && i.node.firstChild && (i.offset == 0 || i.node.childNodes[i.offset - 1].contentEditable == "false") && (i.offset == i.node.childNodes.length || i.node.childNodes[i.offset].contentEditable == "false");
}
function dO(i, e) {
  let t = i.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let n = If(t.focusNode, t.focusOffset), r = Gf(t.focusNode, t.focusOffset), s = n || r;
  if (r && n && r.node != n.node) {
    let l = te.get(r.node);
    if (!l || l.isText() && l.text != r.node.nodeValue)
      s = r;
    else if (i.docView.lastCompositionAfterCursor) {
      let a = te.get(n.node);
      !a || a.isText() && a.text != n.node.nodeValue || (s = r);
    }
  }
  if (i.docView.lastCompositionAfterCursor = s != n, !s)
    return null;
  let o = e - s.offset;
  return { from: o, to: o + s.node.nodeValue.length, node: s.node };
}
function Pm(i, e, t) {
  let n = dO(i, t);
  if (!n)
    return null;
  let { node: r, from: s, to: o } = n, l = r.nodeValue;
  if (/[\n\r]/.test(l) || i.state.doc.sliceString(n.from, n.to) != l)
    return null;
  let a = e.invertedDesc;
  return { range: new je(a.mapPos(s), a.mapPos(o), s, o), text: r };
}
function km(i, e) {
  return i.nodeType != 1 ? 0 : (e && i.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < i.childNodes.length && i.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let wm = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    $i(e, t, this.changes);
  }
  comparePoint(e, t) {
    $i(e, t, this.changes);
  }
  boundChange(e) {
    $i(e, e, this.changes);
  }
};
function vm(i, e, t) {
  let n = new wm();
  return j.compare(i, e, t, n), n.changes;
}
class Tm {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    $i(e, t, this.changes);
  }
  comparePoint() {
  }
  boundChange(e) {
    $i(e, e, this.changes);
  }
}
function Cm(i, e, t) {
  let n = new Tm();
  return j.compare(i, e, t, n), n.changes;
}
function Xm(i, e) {
  for (let t = i; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function Zm(i, e) {
  let t = !1;
  return e && i.iterChangedRanges((n, r) => {
    n < e.to && r > e.from && (t = !0);
  }), t;
}
class Xs extends Ue {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function Rm(i, e, t = 1) {
  let n = i.charCategorizer(e), r = i.doc.lineAt(e), s = e - r.from;
  if (r.length == 0)
    return b.cursor(e);
  s == 0 ? t = 1 : s == r.length && (t = -1);
  let o = s, l = s;
  t < 0 ? o = ce(r.text, s, !1) : l = ce(r.text, s);
  let a = n(r.text.slice(o, l));
  for (; o > 0; ) {
    let h = ce(r.text, o, !1);
    if (n(r.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < r.length; ) {
    let h = ce(r.text, l);
    if (n(r.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return b.undirectionalRange(o + r.from, l + r.from);
}
function Am(i, e, t, n, r) {
  let s = Math.round((n - e.left) * i.defaultCharacterWidth);
  if (i.lineWrapping && t.height > i.defaultLineHeight * 1.5) {
    let l = i.viewState.heightOracle.textHeight, a = Math.floor((r - t.top - (i.defaultLineHeight - l) * 0.5) / l);
    s += a * i.viewState.heightOracle.lineLength;
  }
  let o = i.state.sliceDoc(t.from, t.to);
  return t.from + Xo(o, s, i.state.tabSize);
}
function Eo(i, e, t) {
  let n = i.lineBlockAt(e);
  if (Array.isArray(n.type)) {
    let r;
    for (let s of n.type) {
      if (s.from > e)
        break;
      if (!(s.to < e)) {
        if (s.from < e && s.to > e)
          return s;
        (!r || s.type == me.Text && (r.type != s.type || (t < 0 ? s.from < e : s.to > e))) && (r = s);
      }
    }
    return r || n;
  }
  return n;
}
function Mm(i, e, t, n) {
  let r = Eo(i, e.head, e.assoc || -1), s = !n || r.type != me.Text || !(i.lineWrapping || r.widgetLineBreaks) ? null : i.coordsAtPos(e.assoc < 0 && e.head > r.from ? e.head - 1 : e.head);
  if (s) {
    let o = i.dom.getBoundingClientRect(), l = i.textDirectionAt(r.from), a = i.posAtCoords({
      x: t == (l == U.LTR) ? o.right - 1 : o.left + 1,
      y: (s.top + s.bottom) / 2
    });
    if (a != null)
      return b.cursor(a, t ? -1 : 1);
  }
  return b.cursor(t ? r.to : r.from, t ? -1 : 1);
}
function Fa(i, e, t, n) {
  let r = i.state.doc.lineAt(e.head), s = i.bidiSpans(r), o = i.textDirectionAt(r.from);
  for (let l = e, a = null; ; ) {
    let h = am(r, s, o, l, t), c = Kf;
    if (!h) {
      if (r.number == (t ? i.state.doc.lines : 1))
        return l;
      c = `
`, r = i.state.doc.line(r.number + (t ? 1 : -1)), s = i.bidiSpans(r), h = i.visualLineSide(r, !t);
    }
    if (a) {
      if (!a(c))
        return l;
    } else {
      if (!n)
        return h;
      a = n(c);
    }
    l = h;
  }
}
function Wm(i, e, t) {
  let n = i.state.charCategorizer(e), r = n(t);
  return (s) => {
    let o = n(s);
    return r == K.Space && (r = o), r == o;
  };
}
function qm(i, e, t, n) {
  let r = e.head, s = t ? 1 : -1;
  if (r == (t ? i.state.doc.length : 0))
    return b.cursor(r, e.assoc);
  let o = e.goalColumn, l, a = i.contentDOM.getBoundingClientRect(), h = i.coordsAtPos(r, e.assoc || ((e.empty ? t : e.head == e.from) ? 1 : -1)), c = i.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = s < 0 ? h.top : h.bottom;
  else {
    let d = i.viewState.lineBlockAt(r);
    o == null && (o = Math.min(a.right - a.left, i.defaultCharacterWidth * (r - d.from))), l = (s < 0 ? d.top : d.bottom) + c;
  }
  let f = a.left + o, O = i.viewState.heightOracle.textHeight >> 1, u = n ?? O;
  for (let d = 0; ; d += O) {
    let m = l + (u + d) * s, g = Lo(i, { x: f, y: m }, !1, s);
    if (t ? m > a.bottom : m < a.top)
      return b.cursor(g.pos, g.assoc);
    let S = i.coordsAtPos(g.pos, g.assoc), Q = S ? (S.top + S.bottom) / 2 : 0;
    if (!S || (t ? Q > l : Q < l))
      return b.cursor(g.pos, g.assoc, void 0, o);
  }
}
function cn(i, e, t) {
  for (; ; ) {
    let n = 0;
    for (let r of i)
      r.between(e - 1, e + 1, (s, o, l) => {
        if (e > s && e < o) {
          let a = n || t || (e - s < o - e ? -1 : 1);
          e = a < 0 ? s : o, n = a;
        }
      });
    if (!n)
      return e;
  }
}
function pO(i, e) {
  let t = null;
  for (let n = 0; n < e.ranges.length; n++) {
    let r = e.ranges[n], s = null;
    if (r.empty) {
      let o = cn(i, r.from, 0);
      o != r.from && (s = b.cursor(o, -1));
    } else {
      let o = cn(i, r.from, -1), l = cn(i, r.to, 1);
      (o != r.from || l != r.to) && (r.undirectional ? s = b.undirectionalRange(r.from, r.to) : s = b.range(r.from == r.anchor ? o : l, r.from == r.head ? o : l));
    }
    s && (t || (t = e.ranges.slice()), t[n] = s);
  }
  return t ? b.create(t, e.mainIndex) : e;
}
function Zs(i, e, t) {
  let n = cn(i.state.facet(Wn).map((r) => r(i)), t.from, e.head > t.from ? -1 : 1);
  return n == t.from ? t : b.cursor(n, n < t.from ? 1 : -1);
}
class ot {
  constructor(e, t) {
    this.pos = e, this.assoc = t;
  }
}
function Lo(i, e, t, n) {
  let r = i.contentDOM.getBoundingClientRect(), s = r.top + i.viewState.paddingTop, { x: o, y: l } = e, a = l - s, h;
  for (; ; ) {
    if (a < 0)
      return new ot(0, 1);
    if (a > i.viewState.docHeight)
      return new ot(i.state.doc.length, -1);
    if (h = i.elementAtHeight(a), n == null)
      break;
    if (h.type == me.Text) {
      if (n < 0 ? h.to < i.viewport.from : h.from > i.viewport.to)
        break;
      let O = i.docView.coordsAt(n < 0 ? h.from : h.to, n > 0 ? -1 : 1);
      if (O && (n < 0 ? O.top <= a + s : O.bottom >= a + s))
        break;
    }
    let f = i.viewState.heightOracle.textHeight / 2;
    a = n > 0 ? h.bottom + f : h.top - f;
  }
  if (i.viewport.from >= h.to || i.viewport.to <= h.from) {
    if (t)
      return null;
    if (h.type == me.Text) {
      let f = Am(i, r, h, o, l);
      return new ot(f, f == h.from ? 1 : -1);
    }
  }
  if (h.type != me.Text)
    return a < (h.top + h.bottom) / 2 ? new ot(h.from, 1) : new ot(h.to, -1);
  let c = i.docView.lineAt(h.from, 2);
  return (!c || c.length != h.length) && (c = i.docView.lineAt(h.from, -2)), new Ym(i, o, l, i.textDirectionAt(h.from)).scanTile(c, h.from);
}
class Ym {
  constructor(e, t, n, r) {
    this.view = e, this.x = t, this.y = n, this.baseDir = r, this.line = null, this.spans = null;
  }
  bidiSpansAt(e) {
    return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
  }
  baseDirAt(e, t) {
    let { line: n, spans: r } = this.bidiSpansAt(e);
    return r[lt.find(r, e - n.from, -1, t)].level == this.baseDir;
  }
  dirAt(e, t) {
    let { line: n, spans: r } = this.bidiSpansAt(e);
    return r[lt.find(r, e - n.from, -1, t)].dir;
  }
  // Used to short-circuit bidi tests for content with a uniform direction
  bidiIn(e, t) {
    let { spans: n, line: r } = this.bidiSpansAt(e);
    return n.length > 1 || n.length && (n[0].level != this.baseDir || n[0].to + r.from < t);
  }
  // Scan through the rectangles for the content of a tile with inline
  // content, looking for one that overlaps the queried position
  // vertically and is closest horizontally. The caller is responsible
  // for dividing its content into N pieces, and pass an array with
  // N+1 positions (including the position after the last piece). For
  // a text tile, these will be character clusters, for a composite
  // tile, these will be child tiles.
  scan(e, t, n = !1) {
    let r = 0, s = e.length - 1, o = /* @__PURE__ */ new Set(), l = this.bidiIn(e[0], e[s]), a, h, c = -1, f = 1e9, O;
    e: for (; r < s; ) {
      let d = s - r, m = r + s >> 1;
      t: if (o.has(m)) {
        let S = r + Math.floor(Math.random() * d);
        for (let Q = 0; Q < d; Q++) {
          if (!o.has(S)) {
            m = S;
            break t;
          }
          S++, S == s && (S = r);
        }
        break e;
      }
      o.add(m);
      let g = t(m);
      if (g)
        for (let S = 0; S < g.length; S++) {
          let Q = g[S], y = 0;
          if (!(Q.width == 0 && g.length > 1)) {
            if (Q.bottom < this.y)
              (!a || a.bottom < Q.bottom) && (a = Q), y = 1;
            else if (Q.top > this.y)
              (!h || h.top > Q.top) && (h = Q), y = -1;
            else {
              let w = Q.left > this.x ? this.x - Q.left : Q.right < this.x ? this.x - Q.right : 0, x = Math.abs(w);
              x < f && (c = m, f = x, O = Q), w && (y = w < 0 == (this.baseDir == U.LTR) ? -1 : 1);
            }
            y == -1 && (!l || this.baseDirAt(e[m], 1)) ? s = m : y == 1 && (!l || this.baseDirAt(e[m + 1], -1)) && (r = m + 1);
          }
        }
    }
    if (!O) {
      if (!h && !a)
        return { i: e[0], after: !1 };
      let d = a && (!h || this.y - a.bottom < h.top - this.y) ? a : h;
      return this.y = (d.top + d.bottom) / 2, this.scan(e, t, !0);
    }
    if (f && !n) {
      let { top: d, bottom: m } = O;
      if (a && a.bottom > (d + d + m) / 3)
        return this.y = a.bottom - 1, this.scan(e, t, !0);
      if (h && h.top < (d + m + m) / 3)
        return this.y = h.top + 1, this.scan(e, t, !0);
    }
    let u = (l ? this.dirAt(e[c], 1) : this.baseDir) == U.LTR;
    return {
      i: c,
      // Test whether x is closes to the start or end of this element
      after: this.x > (O.left + O.right) / 2 == u
    };
  }
  scanText(e, t) {
    let n = [];
    for (let s = 0; s < e.length; s = ce(e.text, s))
      n.push(t + s);
    n.push(t + e.length);
    let r = this.scan(n, (s) => {
      let o = n[s] - t, l = n[s + 1] - t;
      return Qn(e.dom, o, l).getClientRects();
    });
    return r.after ? new ot(n[r.i + 1], -1) : new ot(n[r.i], 1);
  }
  scanTile(e, t) {
    if (!e.length)
      return new ot(t, 1);
    if (e.children.length == 1) {
      let l = e.children[0];
      if (l.isText())
        return this.scanText(l, t);
      if (l.isComposite())
        return this.scanTile(l, t);
    }
    let n = [t];
    for (let l = 0, a = t; l < e.children.length; l++)
      n.push(a += e.children[l].length);
    let r = this.scan(n, (l) => {
      let a = e.children[l];
      return a.flags & 48 ? null : (a.dom.nodeType == 1 ? a.dom : Qn(a.dom, 0, a.length)).getClientRects();
    }), s = e.children[r.i], o = n[r.i];
    return s.isText() ? this.scanText(s, o) : s.isComposite() ? this.scanTile(s, o) : r.after ? new ot(n[r.i + 1], -1) : new ot(o, 1);
  }
}
const di = "￿";
class _m {
  constructor(e, t) {
    this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(V.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += di;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let n = e.parentNode;
    for (let r = e; ; ) {
      this.findPointBefore(n, r);
      let s = this.text.length;
      this.readNode(r);
      let o = te.get(r), l = r.nextSibling;
      if (l == t) {
        o?.breakAfter && !l && n != this.view.contentDOM && this.lineBreak();
        break;
      }
      let a = te.get(l);
      (o && a ? o.breakAfter : (o ? o.breakAfter : Tr(r)) || Tr(l) && (r.nodeName != "BR" || o?.isWidget()) && this.text.length > s) && !zm(l, t) && this.lineBreak(), r = l;
    }
    return this.findPointBefore(n, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let n of this.points)
      n.node == e && (n.pos = this.text.length + Math.min(n.offset, t.length));
    for (let n = 0, r = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let s = -1, o = 1, l;
      if (this.lineSeparator ? (s = t.indexOf(this.lineSeparator, n), o = this.lineSeparator.length) : (l = r.exec(t)) && (s = l.index, o = l[0].length), this.append(t.slice(n, s < 0 ? t.length : s)), s < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      n = s + o;
    }
  }
  readNode(e) {
    let t = te.get(e), n = t && t.overrideDOMText;
    if (n != null) {
      this.findPointInside(e, n.length);
      for (let r = n.iter(); !r.next().done; )
        r.lineBreak ? this.lineBreak() : this.append(r.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let n of this.points)
      n.node == e && e.childNodes[n.offset] == t && (n.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let n of this.points)
      (e.nodeType == 3 ? n.node == e : e.contains(n.node)) && (n.pos = this.text.length + (jm(e, n.node, n.offset) ? t : 0));
  }
}
function jm(i, e, t) {
  for (; ; ) {
    if (!e || t < Pt(e))
      return !1;
    if (e == i)
      return !0;
    t = qt(e) + 1, e = e.parentNode;
  }
}
function zm(i, e) {
  let t;
  for (; !(i == e || !i); i = i.nextSibling) {
    let n = te.get(i);
    if (!n?.isWidget())
      return !1;
    n && (t || (t = [])).push(n);
  }
  if (t)
    for (let n of t) {
      let r = n.overrideDOMText;
      if (r?.length)
        return !1;
    }
  return !0;
}
class Ha {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class Vm {
  constructor(e, t, n, r) {
    this.typeOver = r, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: s, impreciseAnchor: o } = e.docView, l = e.state.selection;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = mO(e.docView.tile, t, n, 0))) {
      let a = s || o ? [] : Em(e), h = new _m(a, e);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = Lm(a, this.bounds.from);
    } else {
      let a = e.observer.selectionRange, h = s && s.node == a.focusNode && s.offset == a.focusOffset || !Yo(e.contentDOM, a.focusNode) ? l.main.head : e.docView.posFromDOM(a.focusNode, a.focusOffset), c = o && o.node == a.anchorNode && o.offset == a.anchorOffset || !Yo(e.contentDOM, a.anchorNode) ? l.main.anchor : e.docView.posFromDOM(a.anchorNode, a.anchorOffset), f = e.viewport;
      if ((T.ios || T.chrome) && h != c && Math.min(h, c) <= l.main.from && Math.max(h, c) >= l.main.to && (f.from > 0 || f.to < e.state.doc.length)) {
        let O = Math.min(h, c), u = Math.max(h, c), d = f.from - O, m = f.to - u;
        (d == 0 || d == 1 || O == 0) && (m == 0 || m == -1 || u == e.state.doc.length) && (h = 0, c = e.state.doc.length);
      }
      if (e.inputState.composing > -1 && l.ranges.length > 1)
        this.newSel = l.replaceRange(b.range(c, h));
      else if (e.lineWrapping && c == h && !(l.main.empty && l.main.head == h) && e.inputState.lastTouchTime > Date.now() - 100) {
        let O = e.coordsAtPos(h, -1), u = 0;
        O && (u = e.inputState.lastTouchY <= O.bottom ? -1 : 1), this.newSel = b.create([b.cursor(h, u)]);
      } else
        this.newSel = b.single(c, h);
    }
  }
}
function mO(i, e, t, n) {
  if (i.isComposite()) {
    let r = -1, s = -1, o = -1, l = -1;
    for (let a = 0, h = n, c = n; a < i.children.length; a++) {
      let f = i.children[a], O = h + f.length;
      if (h < e && O > t)
        return mO(f, e, t, h);
      if (O >= e && r == -1 && (r = a, s = h), h > t && f.dom.parentNode == i.dom) {
        o = a, l = c;
        break;
      }
      c = O, h = O + f.breakAfter;
    }
    return {
      from: s,
      to: l < 0 ? n + i.length : l,
      startDOM: (r ? i.children[r - 1].dom.nextSibling : null) || i.dom.firstChild,
      endDOM: o < i.children.length && o >= 0 ? i.children[o].dom : null
    };
  } else return i.isText() ? { from: n, to: n + i.length, startDOM: i.dom, endDOM: i.dom.nextSibling } : null;
}
function gO(i, e) {
  let t, { newSel: n } = e, { state: r } = i, s = r.selection.main, o = i.inputState.lastKeyTime > Date.now() - 100 ? i.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: l, to: a } = e.bounds, h = s.from, c = null;
    (o === 8 || T.android && e.text.length < a - l) && (h = s.to, c = "end");
    let f = r.doc.sliceString(l, a, di), O, u;
    !s.empty && s.from >= l && s.to <= a && (e.typeOver || f != e.text) && f.slice(0, s.from - l) == e.text.slice(0, s.from - l) && f.slice(s.to - l) == e.text.slice(O = e.text.length - (f.length - (s.to - l))) ? t = {
      from: s.from,
      to: s.to,
      insert: D.of(e.text.slice(s.from - l, O).split(di))
    } : (u = SO(f, e.text, h - l, c)) && (T.chrome && o == 13 && u.toB == u.from + 2 && e.text.slice(u.from, u.toB) == di + di && u.toB--, t = {
      from: l + u.from,
      to: l + u.toA,
      insert: D.of(e.text.slice(u.from, u.toB).split(di))
    });
  } else n && (!i.hasFocus && r.facet(bt) || Rr(n, s)) && (n = null);
  if (!t && !n)
    return !1;
  if ((T.mac || T.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && i.contentDOM.getAttribute("autocorrect") == "off" ? (n && t.insert.length == 2 && (n = b.single(n.main.anchor - 1, n.main.head - 1)), t = { from: t.from, to: t.to, insert: D.of([t.insert.toString().replace(".", " ")]) }) : r.doc.lineAt(s.from).to < s.to && i.docView.lineHasWidget(s.to) && i.inputState.insertingTextAt > Date.now() - 50 ? t = {
    from: s.from,
    to: s.to,
    insert: r.toText(i.inputState.insertingText)
  } : T.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && i.lineWrapping && (n && (n = b.single(n.main.anchor - 1, n.main.head - 1)), t = { from: s.from, to: s.to, insert: D.of([" "]) }), t)
    return Vl(i, t, n, o);
  if (n && !Rr(n, s)) {
    let l = !1, a = "select";
    return i.inputState.lastSelectionTime > Date.now() - 50 && (i.inputState.lastSelectionOrigin == "select" && (l = !0), a = i.inputState.lastSelectionOrigin, a == "select.pointer" && (n = pO(r.facet(Wn).map((h) => h(i)), n))), i.dispatch({ selection: n, scrollIntoView: l, userEvent: a }), !0;
  } else
    return !1;
}
function Vl(i, e, t, n = -1) {
  if (T.ios && i.inputState.flushIOSKey(e))
    return !0;
  let r = i.state.selection.main;
  if (T.android && (e.to == r.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == r.from || e.from == r.from - 1 && i.state.sliceDoc(e.from, r.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && Pi(i.contentDOM, "Enter", 13) || (e.from == r.from - 1 && e.to == r.to && e.insert.length == 0 || n == 8 && e.insert.length < e.to - e.from && e.to > r.head) && Pi(i.contentDOM, "Backspace", 8) || e.from == r.from && e.to == r.to + 1 && e.insert.length == 0 && Pi(i.contentDOM, "Delete", 46)))
    return !0;
  let s = e.insert.toString();
  i.inputState.composing >= 0 && i.inputState.composing++;
  let o, l = () => o || (o = Dm(i, e, t));
  return i.state.facet(nO).some((a) => a(i, e.from, e.to, s, l)) || i.dispatch(l()), !0;
}
function Dm(i, e, t) {
  let n, r = i.state, s = r.selection.main, o = -1;
  if (e.from == e.to && e.from < s.from || e.from > s.to) {
    let a = e.from < s.from ? -1 : 1, h = a < 0 ? s.from : s.to, c = cn(r.facet(Wn).map((f) => f(i)), h, a);
    e.from == c && (o = c);
  }
  if (o > -1)
    n = {
      changes: e,
      selection: b.cursor(e.from + e.insert.length, -1)
    };
  else if (e.from >= s.from && e.to <= s.to && e.to - e.from >= (s.to - s.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && i.inputState.composing < 0) {
    let a = s.from < e.from ? r.sliceDoc(s.from, e.from) : "", h = s.to > e.to ? r.sliceDoc(e.to, s.to) : "";
    n = r.replaceSelection(i.state.toText(a + e.insert.sliceString(0, void 0, i.state.lineBreak) + h));
  } else {
    let a = r.changes(e), h = t && t.main.to <= a.newLength ? t.main : void 0;
    if (r.selection.ranges.length > 1 && (i.inputState.composing >= 0 || i.inputState.compositionPendingChange) && e.to <= s.to + 10 && e.to >= s.to - 10) {
      let c = i.state.sliceDoc(e.from, e.to), f, O = t && dO(i, t.main.head);
      if (O) {
        let d = e.insert.length - (e.to - e.from);
        f = { from: O.from, to: O.to - d };
      } else
        f = i.state.doc.lineAt(s.head);
      let u = s.to - e.to;
      n = r.changeByRange((d) => {
        if (d.from == s.from && d.to == s.to)
          return { changes: a, range: h || d.map(a) };
        let m = d.to - u, g = m - c.length;
        if (i.state.sliceDoc(g, m) != c || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        m >= f.from && g <= f.to)
          return { range: d };
        let S = r.changes({ from: g, to: m, insert: e.insert }), Q = d.to - s.to;
        return {
          changes: S,
          range: h ? b.range(Math.max(0, h.anchor + Q), Math.max(0, h.head + Q)) : d.map(S)
        };
      });
    } else
      n = {
        changes: a,
        selection: h && r.selection.replaceRange(h)
      };
  }
  let l = "input.type";
  return (i.composing || i.inputState.compositionPendingChange && i.inputState.compositionEndedAt > Date.now() - 50) && (i.inputState.compositionPendingChange = !1, l += ".compose", i.inputState.compositionFirstChange && (l += ".start", i.inputState.compositionFirstChange = !1)), r.update(n, { userEvent: l, scrollIntoView: !0 });
}
function SO(i, e, t, n) {
  let r = Math.min(i.length, e.length), s = 0;
  for (; s < r && i.charCodeAt(s) == e.charCodeAt(s); )
    s++;
  if (s == r && i.length == e.length)
    return null;
  let o = i.length, l = e.length;
  for (; o > 0 && l > 0 && i.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (n == "end") {
    let a = Math.max(0, s - Math.min(o, l));
    t -= o + a - s;
  }
  if (o < s && i.length < e.length) {
    let a = t <= s && t >= o ? s - t : 0;
    s -= a, l = s + (l - o), o = s;
  } else if (l < s) {
    let a = t <= s && t >= l ? s - t : 0;
    s -= a, o = s + (o - l), l = s;
  }
  return { from: s, toA: o, toB: l };
}
function Em(i) {
  let e = [];
  if (i.root.activeElement != i.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: n, focusNode: r, focusOffset: s } = i.observer.selectionRange;
  return t && (e.push(new Ha(t, n)), (r != t || s != n) && e.push(new Ha(r, s))), e;
}
function Lm(i, e) {
  if (i.length == 0)
    return null;
  let t = i[0].pos, n = i.length == 2 ? i[1].pos : t;
  return t > -1 && n > -1 ? b.single(t + e, n + e) : null;
}
function Rr(i, e) {
  return e.head == i.main.head && e.anchor == i.main.anchor;
}
class Bm {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, T.safari && e.contentDOM.addEventListener("input", () => null), T.gecko && lg(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !eg(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(e.type, e)) : this.runHandlers(e.type, e));
  }
  runHandlers(e, t) {
    let n = this.handlers[e];
    if (n) {
      for (let r of n.observers)
        r(this.view, t);
      for (let r of n.handlers) {
        if (t.defaultPrevented)
          break;
        if (r(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = Gm(e), n = this.handlers, r = this.view.contentDOM;
    for (let s in t)
      if (s != "scroll") {
        let o = !t[s].handlers.length, l = n[s];
        l && o != !l.handlers.length && (r.removeEventListener(s, this.handleEvent), l = null), l || r.addEventListener(s, this.handleEvent, { passive: o });
      }
    for (let s in n)
      s != "scroll" && !t[s] && r.removeEventListener(s, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && bO.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), T.android && T.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    if (T.ios && !e.synthetic && !e.altKey && !e.metaKey && (QO.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || Nm.indexOf(e.key) > -1 && e.ctrlKey)) {
      let t = { ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
      return t.shiftKey && T.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && Im(this.view.win) && (t.shiftKey = !1), this.pendingIOSKey = { key: e.key, keyCode: e.keyCode, mods: t }, setTimeout(() => this.flushIOSKey(), 250), !0;
    }
    return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Pi(this.view.contentDOM, t.key, t.keyCode, t.mods));
  }
  ignoreDuringComposition(e) {
    return !/^key/.test(e.type) || e.synthetic ? !1 : this.composing > 0 ? !0 : T.safari && !T.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Im(i) {
  return i.visualViewport ? i.visualViewport.height * i.visualViewport.scale / i.document.documentElement.clientHeight < 0.85 : !1;
}
function Ka(i, e) {
  return (t, n) => {
    try {
      return e.call(i, n, t);
    } catch (r) {
      Ze(t.state, r);
    }
  };
}
function Gm(i) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(n) {
    return e[n] || (e[n] = { observers: [], handlers: [] });
  }
  for (let n of i) {
    let r = n.spec, s = r && r.plugin.domEventHandlers, o = r && r.plugin.domEventObservers;
    if (s)
      for (let l in s) {
        let a = s[l];
        a && t(l).handlers.push(Ka(n.value, a));
      }
    if (o)
      for (let l in o) {
        let a = o[l];
        a && t(l).observers.push(Ka(n.value, a));
      }
  }
  for (let n in Ne)
    t(n).handlers.push(Ne[n]);
  for (let n in ke)
    t(n).observers.push(ke[n]);
  return e;
}
const QO = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], Nm = "dthko", bO = [16, 17, 18, 20, 91, 92, 224, 225], Nn = 6;
function Un(i) {
  return Math.max(0, i) * 0.7 + 8;
}
function Um(i, e) {
  return Math.max(Math.abs(i.clientX - e.clientX), Math.abs(i.clientY - e.clientY));
}
class Fm {
  constructor(e, t, n, r) {
    this.view = e, this.startEvent = t, this.style = n, this.mustSelect = r, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParents = Ef(e.contentDOM), this.atoms = e.state.facet(Wn).map((o) => o(e));
    let s = e.contentDOM.ownerDocument;
    s.addEventListener("mousemove", this.move = this.move.bind(this)), s.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(V.allowMultipleSelections) && Hm(e, t), this.dragging = Jm(e, t) && $O(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && Um(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let t = 0, n = 0, r = 0, s = 0, o = this.view.win.innerWidth, l = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: r, right: o } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: s, bottom: l } = this.scrollParents.y.getBoundingClientRect());
    let a = zl(this.view);
    e.clientX - a.left <= r + Nn ? t = -Un(r - e.clientX) : e.clientX + a.right >= o - Nn && (t = Un(e.clientX - o)), e.clientY - a.top <= s + Nn ? n = -Un(s - e.clientY) : e.clientY + a.bottom >= l - Nn && (n = Un(e.clientY - l)), this.setScrollSpeed(t, n);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: t } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
  }
  select(e) {
    let { view: t } = this, n = pO(this.atoms, this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !n.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: n,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function Hm(i, e) {
  let t = i.state.facet(Jf);
  return t.length ? t[0](e) : T.mac ? e.metaKey : e.ctrlKey;
}
function Km(i, e) {
  let t = i.state.facet(eO);
  return t.length ? t[0](e) : T.mac ? !e.altKey : !e.ctrlKey;
}
function Jm(i, e) {
  let { main: t } = i.state.selection;
  if (t.empty)
    return !1;
  let n = gn(i.root);
  if (!n || n.rangeCount == 0)
    return !0;
  let r = n.getRangeAt(0).getClientRects();
  for (let s = 0; s < r.length; s++) {
    let o = r[s];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function eg(i, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, n; t != i.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (n = te.get(t)) && n.isWidget() && !n.isHidden && n.widget.ignoreEvent(e))
      return !1;
  return !0;
}
const Ne = /* @__PURE__ */ Object.create(null), ke = /* @__PURE__ */ Object.create(null), yO = T.ie && T.ie_version < 15 || T.ios && T.webkit_version < 604;
function tg(i) {
  let e = i.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    i.focus(), t.remove(), xO(i, t.value);
  }, 50);
}
function cs(i, e, t) {
  for (let n of i.facet(e))
    t = n(t, i);
  return t;
}
function xO(i, e) {
  e = cs(i.state, ql, e);
  let { state: t } = i, n, r = 1, s = t.toText(e), o = s.lines == t.selection.ranges.length;
  if (Bo != null && t.selection.ranges.every((a) => a.empty) && Bo == s.toString()) {
    let a = -1;
    n = t.changeByRange((h) => {
      let c = t.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = t.toText((o ? s.line(r++).text : e) + t.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: b.cursor(h.from + f.length)
      };
    });
  } else o ? n = t.changeByRange((a) => {
    let h = s.line(r++);
    return {
      changes: { from: a.from, to: a.to, insert: h.text },
      range: b.cursor(a.from + h.length)
    };
  }) : n = t.replaceSelection(s);
  i.dispatch(n, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
ke.scroll = (i) => {
  let e = i.inputState;
  e.lastScrollTop = i.scrollDOM.scrollTop, e.lastScrollLeft = i.scrollDOM.scrollLeft, T.ios && !e.touchActive && (e.lastIOSMomentumScroll = Date.now());
};
ke.wheel = ke.mousewheel = (i) => {
  i.inputState.lastWheelEvent = Date.now();
};
Ne.keydown = (i, e) => (i.inputState.setSelectionOrigin("select"), e.keyCode == 27 && i.inputState.tabFocusMode != 0 && (i.inputState.tabFocusMode = Date.now() + 2e3), !1);
ke.touchstart = (i, e) => {
  let t = i.inputState, n = e.targetTouches[0];
  t.touchActive = !0, t.lastTouchTime = Date.now(), n && (t.lastTouchX = n.clientX, t.lastTouchY = n.clientY), t.setSelectionOrigin("select.pointer");
};
ke.touchmove = (i) => {
  i.inputState.setSelectionOrigin("select.pointer");
};
ke.touchend = (i, e) => {
  i.inputState.touchActive = !1;
};
Ne.mousedown = (i, e) => {
  if (i.observer.flush(), i.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let n of i.state.facet(tO))
    if (t = n(i, e), t)
      break;
  if (!t && e.button == 0 && (t = ng(i, e)), t) {
    let n = !i.hasFocus;
    i.inputState.startMouseSelection(new Fm(i, e, t, n)), n && i.observer.ignore(() => {
      Lf(i.contentDOM);
      let s = i.root.activeElement;
      s && !s.contains(i.contentDOM) && s.blur();
    });
    let r = i.inputState.mouseSelection;
    if (r)
      return r.start(e), r.dragging === !1;
  } else
    i.inputState.setSelectionOrigin("select.pointer");
  return !1;
};
function Ja(i, e, t, n) {
  if (n == 1)
    return b.cursor(e, t);
  if (n == 2)
    return Rm(i.state, e, t);
  {
    let r = i.docView.lineAt(e, t), s = i.state.doc.lineAt(r ? r.posAtEnd : e), o = r ? r.posAtStart : s.from, l = r ? r.posAtEnd : s.to;
    return l < i.state.doc.length && l == s.to && l++, b.undirectionalRange(o, l);
  }
}
const ig = T.ie && T.ie_version <= 11;
let eh = null, th = 0, ih = 0;
function $O(i) {
  if (!ig)
    return i.detail;
  let e = eh, t = ih;
  return eh = i, ih = Date.now(), th = !e || t > Date.now() - 400 && Math.abs(e.clientX - i.clientX) < 2 && Math.abs(e.clientY - i.clientY) < 2 ? (th + 1) % 3 : 1;
}
function ng(i, e) {
  let t = i.posAndSideAtCoords({ x: e.clientX, y: e.clientY }, !1), n = $O(e), r = i.state.selection;
  return {
    update(s) {
      s.docChanged && (t.pos = s.changes.mapPos(t.pos), r = r.map(s.changes));
    },
    get(s, o, l) {
      let a = i.posAndSideAtCoords({ x: s.clientX, y: s.clientY }, !1), h, c = Ja(i, a.pos, a.assoc, n);
      if (t.pos != a.pos && !o) {
        let f = Ja(i, t.pos, t.assoc, n), O = Math.min(f.from, c.from), u = Math.max(f.to, c.to);
        c = O < c.from ? b.range(O, u, c.assoc) : b.range(u, O, c.assoc);
      }
      return o ? r.replaceRange(r.main.extend(c.from, c.to, c.assoc)) : l && n == 1 && r.ranges.length > 1 && (h = rg(r, a.pos)) ? h : l ? r.addRange(c) : b.create([c]);
    }
  };
}
function rg(i, e) {
  for (let t = 0; t < i.ranges.length; t++) {
    let { from: n, to: r } = i.ranges[t];
    if (n <= e && r >= e)
      return b.create(i.ranges.slice(0, t).concat(i.ranges.slice(t + 1)), i.mainIndex == t ? 0 : i.mainIndex - (i.mainIndex > t ? 1 : 0));
  }
  return null;
}
Ne.dragstart = (i, e) => {
  let { selection: { main: t } } = i.state;
  if (e.target.draggable) {
    let r = i.docView.tile.nearest(e.target);
    if (r && r.isWidget()) {
      let s = r.posAtStart, o = s + r.length;
      (s >= t.to || o <= t.from) && (t = b.undirectionalRange(s, o));
    }
  }
  let { inputState: n } = i;
  return n.mouseSelection && (n.mouseSelection.dragging = !0), n.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", cs(i.state, Yl, i.state.sliceDoc(t.from, t.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
Ne.dragend = (i) => (i.inputState.draggedContent = null, !1);
function nh(i, e, t, n) {
  if (t = cs(i.state, ql, t), !t)
    return;
  let r = i.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: s } = i.inputState, o = n && s && Km(i, e) ? { from: s.from, to: s.to } : null, l = { from: r, insert: t }, a = i.state.changes(o ? [o, l] : l);
  i.focus(), i.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(r, -1), head: a.mapPos(r, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), i.inputState.draggedContent = null;
}
Ne.drop = (i, e) => {
  if (!e.dataTransfer)
    return !1;
  if (i.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let n = Array(t.length), r = 0, s = () => {
      ++r == t.length && nh(i, e, n.filter((o) => o != null).join(i.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = s, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (n[o] = l.result), s();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let n = e.dataTransfer.getData("Text");
    if (n)
      return nh(i, e, n, !0), !0;
  }
  return !1;
};
Ne.paste = (i, e) => {
  if (i.state.readOnly)
    return !0;
  i.observer.flush();
  let t = yO ? null : e.clipboardData;
  return t ? (xO(i, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (tg(i), !1);
};
function sg(i, e) {
  let t = i.dom.parentNode;
  if (!t)
    return;
  let n = t.appendChild(document.createElement("textarea"));
  n.style.cssText = "position: fixed; left: -10000px; top: 10px", n.value = e, n.focus(), n.selectionEnd = e.length, n.selectionStart = 0, setTimeout(() => {
    n.remove(), i.focus();
  }, 50);
}
function og(i) {
  let e = [], t = [], n = !1;
  for (let r of i.selection.ranges)
    r.empty || (e.push(i.sliceDoc(r.from, r.to)), t.push(r));
  if (!e.length) {
    let r = -1;
    for (let { from: s } of i.selection.ranges) {
      let o = i.doc.lineAt(s);
      o.number > r && (e.push(o.text), t.push({ from: o.from, to: Math.min(i.doc.length, o.to + 1) })), r = o.number;
    }
    n = !0;
  }
  return { text: cs(i, Yl, e.join(i.lineBreak)), ranges: t, linewise: n };
}
let Bo = null;
Ne.copy = Ne.cut = (i, e) => {
  if (!ln(i.contentDOM, i.observer.selectionRange))
    return !1;
  let { text: t, ranges: n, linewise: r } = og(i.state);
  if (!t && !r)
    return !1;
  Bo = r ? t : null, e.type == "cut" && !i.state.readOnly && i.dispatch({
    changes: n,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let s = yO ? null : e.clipboardData;
  return s ? (s.clearData(), s.setData("text/plain", t), !0) : (sg(i, t), !1);
};
const PO = /* @__PURE__ */ pt.define();
function kO(i, e) {
  let t = [];
  for (let n of i.facet(rO)) {
    let r = n(i, e);
    r && t.push(r);
  }
  return t.length ? i.update({ effects: t, annotations: PO.of(!0) }) : null;
}
function wO(i) {
  setTimeout(() => {
    let e = i.hasFocus;
    if (e != i.inputState.notifiedFocused) {
      let t = kO(i.state, e);
      t ? i.dispatch(t) : i.update([]);
    }
  }, 10);
}
ke.focus = (i) => {
  i.inputState.lastFocusTime = Date.now(), !i.scrollDOM.scrollTop && (i.inputState.lastScrollTop || i.inputState.lastScrollLeft) && (i.scrollDOM.scrollTop = i.inputState.lastScrollTop, i.scrollDOM.scrollLeft = i.inputState.lastScrollLeft), wO(i);
};
ke.blur = (i) => {
  i.observer.clearSelectionRange(), wO(i);
};
ke.compositionstart = ke.compositionupdate = (i) => {
  i.observer.editContext || (i.inputState.compositionFirstChange == null && (i.inputState.compositionFirstChange = !0), i.inputState.composing < 0 && (i.inputState.composing = 0));
};
ke.compositionend = (i) => {
  i.observer.editContext || (i.inputState.composing = -1, i.inputState.compositionEndedAt = Date.now(), i.inputState.compositionPendingKey = !0, i.inputState.compositionPendingChange = i.observer.pendingRecords().length > 0, i.inputState.compositionFirstChange = null, T.chrome && T.android ? i.observer.flushSoon() : i.inputState.compositionPendingChange ? Promise.resolve().then(() => i.observer.flush()) : setTimeout(() => {
    i.inputState.composing < 0 && i.docView.hasComposition && i.update([]);
  }, 50));
};
ke.contextmenu = (i) => {
  i.inputState.lastContextMenu = Date.now();
};
Ne.beforeinput = (i, e) => {
  var t, n;
  if ((e.inputType == "insertText" || e.inputType == "insertCompositionText") && (i.inputState.insertingText = e.data, i.inputState.insertingTextAt = Date.now()), e.inputType == "insertReplacementText" && i.observer.editContext) {
    let s = (t = e.dataTransfer) === null || t === void 0 ? void 0 : t.getData("text/plain"), o = e.getTargetRanges();
    if (s && o.length) {
      let l = o[0], a = i.posAtDOM(l.startContainer, l.startOffset), h = i.posAtDOM(l.endContainer, l.endOffset);
      return Vl(i, { from: a, to: h, insert: i.state.toText(s) }, null), !0;
    }
  }
  let r;
  if (T.chrome && T.android && (r = QO.find((s) => s.inputType == e.inputType)) && (i.observer.delayAndroidKey(r.key, r.keyCode), r.key == "Backspace" || r.key == "Delete")) {
    let s = ((n = window.visualViewport) === null || n === void 0 ? void 0 : n.height) || 0;
    setTimeout(() => {
      var o;
      (((o = window.visualViewport) === null || o === void 0 ? void 0 : o.height) || 0) > s + 10 && i.hasFocus && (i.contentDOM.blur(), i.focus());
    }, 100);
  }
  return T.ios && e.inputType == "deleteContentForward" && i.observer.flushSoon(), T.safari && e.inputType == "insertText" && i.inputState.composing >= 0 && setTimeout(() => ke.compositionend(i, e), 20), !1;
};
const rh = /* @__PURE__ */ new Set();
function lg(i) {
  rh.has(i) || (rh.add(i), i.addEventListener("copy", () => {
  }), i.addEventListener("cut", () => {
  }));
}
const sh = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let Ai = !1;
function oh() {
  Ai = !1;
}
class ag {
  constructor(e) {
    this.lineWrapping = e, this.doc = D.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, t) {
    let n = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (n += Math.max(0, Math.ceil((t - e - n * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * n;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return sh.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      r < 0 ? n++ : this.heightSamples[Math.floor(r * 10)] || (t = !0, this.heightSamples[Math.floor(r * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, n, r, s, o) {
    let l = sh.indexOf(e) > -1, a = Math.abs(t - this.lineHeight) > 0.3 || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = n, this.textHeight = r, this.lineLength = s, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class hg {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Be {
  /**
  @internal
  */
  constructor(e, t, n, r, s) {
    this.from = e, this.length = t, this.top = n, this.height = r, this._content = s;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? me.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof li ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new Be(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var F = /* @__PURE__ */ (function(i) {
  return i[i.ByPos = 0] = "ByPos", i[i.ByHeight = 1] = "ByHeight", i[i.ByPosNoHeight = 2] = "ByPosNoHeight", i;
})(F || (F = {}));
const pr = 1e-3;
class Pe {
  constructor(e, t, n = 2) {
    this.length = e, this.height = t, this.flags = n;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > pr && (Ai = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, n) {
    return Pe.of(n);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, n, r) {
    let s = this, o = n.doc;
    for (let l = r.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = r[l], O = s.lineAt(a, F.ByPosNoHeight, n.setDoc(t), 0, 0), u = O.to >= h ? O : s.lineAt(h, F.ByPosNoHeight, n, 0, 0);
      for (f += u.to - h, h = u.to; l > 0 && O.from <= r[l - 1].toA; )
        a = r[l - 1].fromA, c = r[l - 1].fromB, l--, a < O.from && (O = s.lineAt(a, F.ByPosNoHeight, n, 0, 0));
      c += O.from - a, a = O.from;
      let d = Dl.build(n.setDoc(o), e, c, f);
      s = Ar(s, s.replace(a, h, d));
    }
    return s.updateHeight(n, 0);
  }
  static empty() {
    return new Ye(0, 0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, n = e.length, r = 0, s = 0;
    for (; ; )
      if (t == n)
        if (r > s * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), n += 1 + l.break, r -= l.size;
        } else if (s > r * 2) {
          let l = e[n];
          l.break ? e.splice(n, 1, l.left, null, l.right) : e.splice(n, 1, l.left, l.right), n += 2 + l.break, s -= l.size;
        } else
          break;
      else if (r < s) {
        let l = e[t++];
        l && (r += l.size);
      } else {
        let l = e[--n];
        l && (s += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, n++), new fg(Pe.of(e.slice(0, t)), o, Pe.of(e.slice(n)));
  }
}
function Ar(i, e) {
  return i == e ? i : (i.constructor != e.constructor && (Ai = !0), e);
}
Pe.prototype.size = 1;
const cg = /* @__PURE__ */ Z.replace({});
class vO extends Pe {
  constructor(e, t, n) {
    super(e, t), this.deco = n, this.spaceAbove = 0;
  }
  mainBlock(e, t) {
    return new Be(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
  }
  blockAt(e, t, n, r) {
    return this.spaceAbove && e < n + this.spaceAbove ? new Be(r, 0, n, this.spaceAbove, cg) : this.mainBlock(n, r);
  }
  lineAt(e, t, n, r, s) {
    let o = this.mainBlock(r, s);
    return this.spaceAbove ? this.blockAt(0, n, r, s).join(o) : o;
  }
  forEachLine(e, t, n, r, s, o) {
    e <= s + this.length && t >= s && o(this.lineAt(0, F.ByPos, n, r, s));
  }
  setMeasuredHeight(e) {
    let t = e.heights[e.index++];
    t < 0 ? (this.spaceAbove = -t, t = e.heights[e.index++]) : this.spaceAbove = 0, this.setHeight(t);
  }
  updateHeight(e, t = 0, n = !1, r) {
    return r && r.from <= t && r.more && this.setMeasuredHeight(r), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class Ye extends vO {
  constructor(e, t, n) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = n;
  }
  mainBlock(e, t) {
    return new Be(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
  }
  replace(e, t, n) {
    let r = n[0];
    return n.length == 1 && (r instanceof Ye || r instanceof ue && r.flags & 4) && Math.abs(this.length - r.length) < 10 ? (r instanceof ue ? r = new Ye(r.length, this.height, this.spaceAbove) : r.height = this.height, this.outdated || (r.outdated = !1), r) : Pe.of(n);
  }
  updateHeight(e, t = 0, n = !1, r) {
    return r && r.from <= t && r.more ? this.setMeasuredHeight(r) : (n || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class ue extends Pe {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let n = e.doc.lineAt(t).number, r = e.doc.lineAt(t + this.length).number, s = r - n + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * s);
      o = a / s, this.length > s + 1 && (l = (this.height - a) / (this.length - s - 1));
    } else
      o = this.height / s;
    return { firstLine: n, lastLine: r, perLine: o, perChar: l };
  }
  blockAt(e, t, n, r) {
    let { firstLine: s, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, r);
    if (t.lineWrapping) {
      let h = r + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - n) / this.height)) * this.length)), c = t.doc.lineAt(h), f = l + c.length * a, O = Math.max(n, e - f / 2);
      return new Be(c.from, c.length, O, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - s, Math.floor((e - n) / l))), { from: c, length: f } = t.doc.line(s + h);
      return new Be(c, f, n + l * h, l, 0);
    }
  }
  lineAt(e, t, n, r, s) {
    if (t == F.ByHeight)
      return this.blockAt(e, n, r, s);
    if (t == F.ByPosNoHeight) {
      let { from: u, to: d } = n.doc.lineAt(e);
      return new Be(u, d - u, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(n, s), h = n.doc.lineAt(e), c = l + h.length * a, f = h.number - o, O = r + l * f + a * (h.from - s - f);
    return new Be(h.from, h.length, Math.max(r, Math.min(O, r + this.height - c)), c, 0);
  }
  forEachLine(e, t, n, r, s, o) {
    e = Math.max(e, s), t = Math.min(t, s + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(n, s);
    for (let c = e, f = r; c <= t; ) {
      let O = n.doc.lineAt(c);
      if (c == e) {
        let d = O.number - l;
        f += a * d + h * (e - s - d);
      }
      let u = a + h * O.length;
      o(new Be(O.from, O.length, f, u, 0)), f += u, c = O.to + 1;
    }
  }
  replace(e, t, n) {
    let r = this.length - t;
    if (r > 0) {
      let s = n[n.length - 1];
      s instanceof ue ? n[n.length - 1] = new ue(s.length + r) : n.push(null, new ue(r - 1));
    }
    if (e > 0) {
      let s = n[0];
      s instanceof ue ? n[0] = new ue(e + s.length) : n.unshift(new ue(e - 1), null);
    }
    return Pe.of(n);
  }
  decomposeLeft(e, t) {
    t.push(new ue(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new ue(this.length - e - 1));
  }
  updateHeight(e, t = 0, n = !1, r) {
    let s = t + this.length;
    if (r && r.from <= t + this.length && r.more) {
      let o = [], l = Math.max(t, r.from), a = -1;
      for (r.from > t && o.push(new ue(r.from - t - 1).updateHeight(e, t)); l <= s && r.more; ) {
        let c = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = r.heights[r.index++], O = 0;
        f < 0 && (O = -f, f = r.heights[r.index++]), a == -1 ? a = f : Math.abs(f - a) >= pr && (a = -2);
        let u = new Ye(c, f, O);
        u.outdated = !1, o.push(u), l += c + 1;
      }
      l <= s && o.push(null, new ue(s - l).updateHeight(e, l));
      let h = Pe.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= pr || Math.abs(a - this.heightMetrics(e, t).perLine) >= pr) && (Ai = !0), Ar(this, h);
    } else (n || this.outdated) && (this.setHeight(e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class fg extends Pe {
  constructor(e, t, n) {
    super(e.length + t + n.length, e.height + n.height, t | (e.outdated || n.outdated ? 2 : 0)), this.left = e, this.right = n, this.size = e.size + n.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, n, r) {
    let s = n + this.left.height;
    return e < s ? this.left.blockAt(e, t, n, r) : this.right.blockAt(e, t, s, r + this.left.length + this.break);
  }
  lineAt(e, t, n, r, s) {
    let o = r + this.left.height, l = s + this.left.length + this.break, a = t == F.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, n, r, s) : this.right.lineAt(e, t, n, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = t == F.ByPosNoHeight ? F.ByPosNoHeight : F.ByPos;
    return a ? h.join(this.right.lineAt(l, c, n, o, l)) : this.left.lineAt(l, c, n, r, s).join(h);
  }
  forEachLine(e, t, n, r, s, o) {
    let l = r + this.left.height, a = s + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, n, r, s, o), t >= a && this.right.forEachLine(e, t, n, l, a, o);
    else {
      let h = this.lineAt(a, F.ByPos, n, r, s);
      e < h.from && this.left.forEachLine(e, h.from - 1, n, r, s, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, n, l, a, o);
    }
  }
  replace(e, t, n) {
    let r = this.left.length + this.break;
    if (t < r)
      return this.balanced(this.left.replace(e, t, n), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - r, t - r, n));
    let s = [];
    e > 0 && this.decomposeLeft(e, s);
    let o = s.length;
    for (let l of n)
      s.push(l);
    if (e > 0 && lh(s, o - 1), t < this.length) {
      let l = s.length;
      this.decomposeRight(t, s), lh(s, l);
    }
    return Pe.of(s);
  }
  decomposeLeft(e, t) {
    let n = this.left.length;
    if (e <= n)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (n++, e >= n && t.push(null)), e > n && this.right.decomposeLeft(e - n, t);
  }
  decomposeRight(e, t) {
    let n = this.left.length, r = n + this.break;
    if (e >= r)
      return this.right.decomposeRight(e - r, t);
    e < n && this.left.decomposeRight(e, t), this.break && e < r && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? Pe.of(this.break ? [e, null, t] : [e, t]) : (this.left = Ar(this.left, e), this.right = Ar(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, n = !1, r) {
    let { left: s, right: o } = this, l = t + s.length + this.break, a = null;
    return r && r.from <= t + s.length && r.more ? a = s = s.updateHeight(e, t, n, r) : s.updateHeight(e, t, n), r && r.from <= l + o.length && r.more ? a = o = o.updateHeight(e, l, n, r) : o.updateHeight(e, l, n), a ? this.balanced(s, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function lh(i, e) {
  let t, n;
  i[e] == null && (t = i[e - 1]) instanceof ue && (n = i[e + 1]) instanceof ue && i.splice(e - 1, 3, new ue(t.length + 1 + n.length));
}
const Og = 5;
class Dl {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let n = Math.min(t, this.lineEnd), r = this.nodes[this.nodes.length - 1];
      r instanceof Ye ? r.length += n - this.pos : (n > this.pos || !this.isCovered) && this.nodes.push(new Ye(n - this.pos, -1, 0)), this.writtenTo = n, t > n && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, n) {
    if (e < t || n.heightRelevant) {
      let r = n.widget ? n.widget.estimatedHeight : 0, s = n.widget ? n.widget.lineBreaks : 0;
      r < 0 && (r = this.oracle.lineHeight);
      let o = t - e;
      n.block ? this.addBlock(new vO(o, r, n)) : (o || s || r >= Og) && this.addLineDeco(r, s, o);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new Ye(this.pos - e, -1, 0)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let n = new ue(t - e);
    return this.oracle.doc.lineAt(e).to == t && (n.flags |= 4), n;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof Ye)
      return e;
    let t = new Ye(0, -1, 0);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, n) {
    let r = this.ensureLine();
    r.length += n, r.collapsed += n, r.widgetHeight = Math.max(r.widgetHeight, e), r.breaks += t, this.writtenTo = this.pos = this.pos + n;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof Ye) && !this.isCovered ? this.nodes.push(new Ye(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let n = e;
    for (let r of this.nodes)
      r instanceof Ye && r.updateHeight(this.oracle, n), n += r ? r.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, n, r) {
    let s = new Dl(n, e);
    return j.spans(t, n, r, s, 0), s.finish(n);
  }
}
function ug(i, e, t) {
  let n = new dg();
  return j.compare(i, e, t, n, 0), n.changes;
}
class dg {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, n, r) {
    (e < t || n && n.heightRelevant || r && r.heightRelevant) && $i(e, t, this.changes, 5);
  }
}
function pg(i, e) {
  let t = i.getBoundingClientRect(), n = i.ownerDocument, r = n.defaultView || window, s = Math.max(0, t.left), o = Math.min(r.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(r.innerHeight, t.bottom);
  for (let h = i.parentNode; h && h != n.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let O = c.getBoundingClientRect();
        s = Math.max(s, O.left), o = Math.min(o, O.right), l = Math.max(l, O.top), a = Math.min(h == i.parentNode ? r.innerHeight : a, O.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: s - t.left,
    right: Math.max(s, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function mg(i) {
  let e = i.getBoundingClientRect(), t = i.ownerDocument.defaultView || window;
  return e.left < t.innerWidth && e.right > 0 && e.top < t.innerHeight && e.bottom > 0;
}
function gg(i, e) {
  let t = i.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class Rs {
  constructor(e, t, n, r) {
    this.from = e, this.to = t, this.size = n, this.displaySize = r;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let n = 0; n < e.length; n++) {
      let r = e[n], s = t[n];
      if (r.from != s.from || r.to != s.to || r.size != s.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return Z.replace({
      widget: new Sg(this.displaySize * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class Sg extends Ue {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class ah {
  constructor(e, t) {
    this.view = e, this.state = t, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = hh, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = U.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let n = t.facet(_l).some((r) => typeof r != "function" && r.class == "cm-lineWrapping");
    this.heightOracle = new ag(n), this.stateDeco = ch(t), this.heightMap = Pe.empty().applyChanges(this.stateDeco, D.empty, this.heightOracle.setDoc(t.doc), [new je(0, 0, 0, t.doc.length)]);
    for (let r = 0; r < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); r++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = Z.set(this.lineGaps.map((r) => r.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let n = 0; n <= 1; n++) {
      let r = n ? t.head : t.anchor;
      if (!e.some(({ from: s, to: o }) => r >= s && r <= o)) {
        let { from: s, to: o } = this.lineBlockAt(r);
        e.push(new Fn(s, o));
      }
    }
    return this.viewports = e.sort((n, r) => n.from - r.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? hh : new El(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(tn(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let n = this.stateDeco;
    this.stateDeco = ch(this.state);
    let r = e.changedRanges, s = je.extendWithRanges(r, ug(n, this.stateDeco, e ? e.changes : le.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
    oh(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), s), (this.heightMap.height != o || Ai) && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = o);
    let a = s.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, e.flags |= this.updateForViewport(), (h || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(oO) && (this.mustEnforceCursorAssoc = !0);
  }
  measure() {
    let { view: e } = this, t = e.contentDOM, n = window.getComputedStyle(t), r = this.heightOracle, s = n.whiteSpace;
    this.defaultTextDirection = n.direction == "rtl" ? U.RTL : U.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(s) || this.mustMeasureContent === "refresh", l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let { scaleX: x, scaleY: $ } = Df(t, l);
      (x > 5e-3 && Math.abs(this.scaleX - x) > 5e-3 || $ > 5e-3 && Math.abs(this.scaleY - $) > 5e-3) && (this.scaleX = x, this.scaleY = $, h |= 16, o = a = !0);
    }
    let f = (parseInt(n.paddingTop) || 0) * this.scaleY, O = (parseInt(n.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != O) && (this.paddingTop = f, this.paddingBottom = O, h |= 18), this.editorWidth != e.scrollDOM.clientWidth && (r.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 16);
    let u = Ef(this.view.contentDOM, !1).y;
    u != this.scrollParent && (this.scrollParent = u, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
    let d = this.getScrollOffset();
    this.scrollOffset != d && (this.scrollAnchorHeight = -1, this.scrollOffset = d), this.scrolledToBottom = Bf(this.scrollParent || e.win);
    let m = (this.printing ? gg : pg)(t, this.paddingTop), g = m.top - this.pixelViewport.top, S = m.bottom - this.pixelViewport.bottom;
    this.pixelViewport = m;
    let Q = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (Q != this.inView && (this.inView = Q, Q && (a = !0)), !this.inView && !this.scrollTarget && !mg(e.dom))
      return 0;
    let y = l.width;
    if ((this.contentDOMWidth != y || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 16), a) {
      let x = e.docView.measureVisibleLineHeights(this.viewport);
      if (r.mustRefreshForHeights(x) && (o = !0), o || r.lineWrapping && Math.abs(y - this.contentDOMWidth) > r.charWidth) {
        let { lineHeight: $, charWidth: P, textHeight: A } = e.docView.measureTextSize();
        o = $ > 0 && r.refresh(s, $, P, A, Math.max(5, y / P), x), o && (e.docView.minWidth = 0, h |= 16);
      }
      g > 0 && S > 0 ? c = Math.max(g, S) : g < 0 && S < 0 && (c = Math.min(g, S)), oh();
      for (let $ of this.viewports) {
        let P = $.from == this.viewport.from ? x : e.docView.measureVisibleLineHeights($);
        this.heightMap = (o ? Pe.empty().applyChanges(this.stateDeco, D.empty, this.heightOracle, [new je(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(r, 0, o, new hg($.from, P));
      }
      Ai && (h |= 2);
    }
    let w = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return w && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(c, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || w) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let n = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), r = this.heightMap, s = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new Fn(r.lineAt(o - n * 1e3, F.ByHeight, s, 0, 0).from, r.lineAt(l + (1 - n) * 1e3, F.ByHeight, s, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = r.lineAt(h, F.ByPos, s, 0, 0), O;
        t.y == "center" ? O = (f.top + f.bottom) / 2 - c / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? O = f.top : O = f.bottom - c, a = new Fn(r.lineAt(O - 1e3 / 2, F.ByHeight, s, 0, 0).from, r.lineAt(O + c + 1e3 / 2, F.ByHeight, s, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let n = t.mapPos(e.from, -1), r = t.mapPos(e.to, 1);
    return new Fn(this.heightMap.lineAt(n, F.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(r, F.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, n = 0) {
    if (!this.inView)
      return !0;
    let { top: r } = this.heightMap.lineAt(e, F.ByPos, this.heightOracle, 0, 0), { bottom: s } = this.heightMap.lineAt(t, F.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || r <= o - Math.max(10, Math.min(
      -n,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || s >= l + Math.max(10, Math.min(
      n,
      250
      /* VP.MaxCoverMargin */
    ))) && r > o - 2 * 1e3 && s < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let n = [];
    for (let r of e)
      t.touchesRange(r.from, r.to) || n.push(new Rs(t.mapPos(r.from), t.mapPos(r.to), r.size, r.displaySize));
    return n;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let n = this.heightOracle.lineWrapping, r = n ? 1e4 : 2e3, s = r >> 1, o = r << 1;
    if (this.defaultTextDirection != U.LTR && !n)
      return [];
    let l = [], a = (c, f, O, u) => {
      if (f - c < s)
        return;
      let d = this.state.selection.main, m = [d.from];
      d.empty || m.push(d.to);
      for (let S of m)
        if (S > c && S < f) {
          a(c, S - 10, O, u), a(S + 10, f, O, u);
          return;
        }
      let g = bg(e, (S) => S.from >= O.from && S.to <= O.to && Math.abs(S.from - c) < s && Math.abs(S.to - f) < s && !m.some((Q) => S.from < Q && S.to > Q));
      if (!g) {
        if (f < O.to && t && n && t.visibleRanges.some((y) => y.from <= f && y.to >= f)) {
          let y = t.moveToLineBoundary(b.cursor(f), !1, !0).head;
          y > c && (f = y);
        }
        let S = this.gapSize(O, c, f, u), Q = n || S < 2e6 ? S : 2e6;
        g = new Rs(c, f, S, Q);
      }
      l.push(g);
    }, h = (c) => {
      if (c.length < o || c.type != me.Text)
        return;
      let f = Qg(c.from, c.to, this.stateDeco);
      if (f.total < o)
        return;
      let O = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (n) {
        let m = r / this.heightOracle.lineLength * this.heightOracle.lineHeight, g, S;
        if (O != null) {
          let Q = Kn(f, O), y = ((this.visibleBottom - this.visibleTop) / 2 + m) / c.height;
          g = Q - y, S = Q + y;
        } else
          g = (this.visibleTop - c.top - m) / c.height, S = (this.visibleBottom - c.top + m) / c.height;
        u = Hn(f, g), d = Hn(f, S);
      } else {
        let m = f.total * this.heightOracle.charWidth, g = r * this.heightOracle.charWidth, S = 0;
        if (m > 2e6)
          for (let $ of e)
            $.from >= c.from && $.from < c.to && $.size != $.displaySize && $.from * this.heightOracle.charWidth + S < this.pixelViewport.left && (S = $.size - $.displaySize);
        let Q = this.pixelViewport.left + S, y = this.pixelViewport.right + S, w, x;
        if (O != null) {
          let $ = Kn(f, O), P = ((y - Q) / 2 + g) / m;
          w = $ - P, x = $ + P;
        } else
          w = (Q - g) / m, x = (y + g) / m;
        u = Hn(f, w), d = Hn(f, x);
      }
      u > c.from && a(c.from, u, c, f), d < c.to && a(d, c.to, c, f);
    };
    for (let c of this.viewportLines)
      Array.isArray(c.type) ? c.type.forEach(h) : h(c);
    return l;
  }
  gapSize(e, t, n, r) {
    let s = Kn(r, n) - Kn(r, t);
    return this.heightOracle.lineWrapping ? e.height * s : r.total * this.heightOracle.charWidth * s;
  }
  updateLineGaps(e) {
    Rs.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = Z.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let n = [];
    j.spans(t, this.viewport.from, this.viewport.to, {
      span(s, o) {
        n.push({ from: s, to: o });
      },
      point() {
      }
    }, 20);
    let r = 0;
    if (n.length != this.visibleRanges.length)
      r = 12;
    else
      for (let s = 0; s < n.length && !(r & 8); s++) {
        let o = this.visibleRanges[s], l = n[s];
        (o.from != l.from || o.to != l.to) && (r |= 4, e && e.mapPos(o.from, -1) == l.from && e.mapPos(o.to, 1) == l.to || (r |= 8));
      }
    return this.visibleRanges = n, r;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || tn(this.heightMap.lineAt(e, F.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || tn(this.heightMap.lineAt(this.scaler.fromDOM(e), F.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  getScrollOffset() {
    return (this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top) * this.scaleY;
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return tn(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Fn {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Qg(i, e, t) {
  let n = [], r = i, s = 0;
  return j.spans(t, i, e, {
    span() {
    },
    point(o, l) {
      o > r && (n.push({ from: r, to: o }), s += o - r), r = l;
    }
  }, 20), r < e && (n.push({ from: r, to: e }), s += e - r), { total: s, ranges: n };
}
function Hn({ total: i, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let n = Math.floor(i * t);
  for (let r = 0; ; r++) {
    let { from: s, to: o } = e[r], l = o - s;
    if (n <= l)
      return s + n;
    n -= l;
  }
}
function Kn(i, e) {
  let t = 0;
  for (let { from: n, to: r } of i.ranges) {
    if (e <= r) {
      t += e - n;
      break;
    }
    t += r - n;
  }
  return t / i.total;
}
function bg(i, e) {
  for (let t of i)
    if (e(t))
      return t;
}
const hh = {
  toDOM(i) {
    return i;
  },
  fromDOM(i) {
    return i;
  },
  scale: 1,
  eq(i) {
    return i == this;
  }
};
function ch(i) {
  let e = i.facet(ls).filter((n) => typeof n != "function"), t = i.facet(jl).filter((n) => typeof n != "function");
  return t.length && e.push(j.join(t)), e;
}
class El {
  constructor(e, t, n) {
    let r = 0, s = 0, o = 0;
    this.viewports = n.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, F.ByPos, e, 0, 0).top, c = t.lineAt(a, F.ByPos, e, 0, 0).bottom;
      return r += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - r) / (t.height - r);
    for (let l of this.viewports)
      l.domTop = o + (l.top - s) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), s = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, n = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.top)
        return r + (e - n) * this.scale;
      if (e <= s.bottom)
        return s.domTop + (e - s.top);
      n = s.bottom, r = s.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, n = 0, r = 0; ; t++) {
      let s = t < this.viewports.length ? this.viewports[t] : null;
      if (!s || e < s.domTop)
        return n + (e - r) / this.scale;
      if (e <= s.domBottom)
        return s.top + (e - s.domTop);
      n = s.bottom, r = s.domBottom;
    }
  }
  eq(e) {
    return e instanceof El ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, n) => t.from == e.viewports[n].from && t.to == e.viewports[n].to) : !1;
  }
}
function tn(i, e) {
  if (e.scale == 1)
    return i;
  let t = e.toDOM(i.top), n = e.toDOM(i.bottom);
  return new Be(i.from, i.length, t, n - t, Array.isArray(i._content) ? i._content.map((r) => tn(r, e)) : i._content);
}
const Jn = /* @__PURE__ */ C.define({ combine: (i) => i.join(" ") }), Io = /* @__PURE__ */ C.define({ combine: (i) => i.indexOf(!0) > -1 }), Go = /* @__PURE__ */ Mt.newName(), TO = /* @__PURE__ */ Mt.newName(), CO = /* @__PURE__ */ Mt.newName(), XO = { "&light": "." + TO, "&dark": "." + CO };
function No(i, e, t) {
  return new Mt(e, {
    finish(n) {
      return /&/.test(n) ? n.replace(/&\w*/, (r) => {
        if (r == "&")
          return i;
        if (!t || !t[r])
          throw new RangeError(`Unsupported selector: ${r}`);
        return t[r];
      }) : i + " " + n;
    }
  });
}
const yg = /* @__PURE__ */ No("." + Go, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // Issue #456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    userSelect: "none",
    // #1708
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-selectionHandle": {
    backgroundColor: "currentColor",
    width: "1.5px"
  },
  ".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
    content: '""',
    backgroundColor: "inherit",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "-3.25px"
  },
  ".cm-selectionHandle-start::before": { top: "-8px" },
  ".cm-selectionHandle-end::before": { bottom: "-8px" },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    zIndex: 200
  },
  ".cm-gutters-before": { insetInlineStart: 0 },
  ".cm-gutters-after": { insetInlineEnd: 0 },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    border: "0px solid #ddd",
    "&.cm-gutters-before": { borderRightWidth: "1px" },
    "&.cm-gutters-after": { borderLeftWidth: "1px" }
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  ".cm-panels-top": { top: "0" },
  ".cm-panels-bottom": { bottom: "0" },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-dialog": {
    padding: "2px 19px 4px 6px",
    position: "relative",
    "& label": { fontSize: "80%" }
  },
  ".cm-dialog-close": {
    position: "absolute",
    top: "3px",
    right: "4px",
    backgroundColor: "inherit",
    border: "none",
    font: "inherit",
    fontSize: "14px",
    padding: "0"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, XO), xg = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, As = T.ie && T.ie_version <= 11;
class $g {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new Kp(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let n of t)
        this.queue.push(n);
      (T.ie && T.ie_version <= 11 || T.ios && e.composing) && t.some((n) => n.type == "childList" && n.removedNodes.length || n.type == "characterData" && n.oldValue.length > n.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && T.android && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(T.chrome && T.chrome_version < 126) && (this.editContext = new kg(e), e.state.facet(bt) && (e.contentDOM.editContext = this.editContext.editContext)), As && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, n) => t != e[n]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: n } = this, r = this.selectionRange;
    if (n.state.facet(bt) ? n.root.activeElement != this.dom : !ln(this.dom, r))
      return;
    let s = r.anchorNode && n.docView.tile.nearest(r.anchorNode);
    if (s && s.isWidget() && s.widget.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (T.ie && T.ie_version <= 11 || T.android && T.chrome) && !n.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    r.focusNode && hn(r.focusNode, r.focusOffset, r.anchorNode, r.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = gn(e.root);
    if (!t)
      return !1;
    let n = T.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && Pg(this.view, t) || t;
    if (!n || this.selectionRange.eq(n))
      return !1;
    let r = ln(this.dom, n);
    return r && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && em(this.dom, n) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(n), r && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let n = this.dom; n; )
      if (n.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == n ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(n), n = n.assignedSlot || n.parentNode;
      else if (n.nodeType == 11)
        n = n.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let n of this.scrollTargets)
        n.removeEventListener("scroll", this.onScroll);
      for (let n of this.scrollTargets = t)
        n.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, xg), As && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), As && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var n;
    if (!this.delayedAndroidKey) {
      let r = () => {
        let s = this.delayedAndroidKey;
        s && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = s.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && s.force && Pi(this.dom, s.key, s.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(r);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((n = this.delayedAndroidKey) === null || n === void 0) && n.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, n = -1, r = !1;
    for (let s of e) {
      let o = this.readMutation(s);
      o && (o.typeOver && (r = !0), t == -1 ? { from: t, to: n } = o : (t = Math.min(o.from, t), n = Math.max(o.to, n)));
    }
    return { from: t, to: n, typeOver: r };
  }
  readChange() {
    let { from: e, to: t, typeOver: n } = this.processRecords(), r = this.selectionChanged && ln(this.dom, this.selectionRange);
    if (e < 0 && !r)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let s = new Vm(this.view, e, t, n);
    return this.view.docView.domChanged = { newSel: s.newSel ? s.newSel.main : null }, s;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let n = this.view.state, r = gO(this.view, t);
    return this.view.state == n && (t.domChanged || t.newSel && !Rr(this.view.state.selection, t.newSel.main)) && this.view.update([]), r;
  }
  readMutation(e) {
    let t = this.view.docView.tile.nearest(e.target);
    if (!t || t.isWidget())
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "childList") {
      let n = fh(t, e.previousSibling || e.target.previousSibling, -1), r = fh(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: n ? t.posAfter(n) : t.posAtStart,
        to: r ? t.posBefore(r) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(bt) != e.state.facet(bt) && (e.view.contentDOM.editContext = e.state.facet(bt) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, n;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (n = this.resizeScroll) === null || n === void 0 || n.disconnect();
    for (let r of this.scrollTargets)
      r.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function fh(i, e, t) {
  for (; e; ) {
    let n = te.get(e);
    if (n && n.parent == i)
      return n;
    let r = e.parentNode;
    e = r != i.dom ? r : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function Oh(i, e) {
  let t = e.startContainer, n = e.startOffset, r = e.endContainer, s = e.endOffset, o = i.docView.domAtPos(i.state.selection.main.anchor, 1);
  return hn(o.node, o.offset, r, s) && ([t, n, r, s] = [r, s, t, n]), { anchorNode: t, anchorOffset: n, focusNode: r, focusOffset: s };
}
function Pg(i, e) {
  if (e.getComposedRanges) {
    let r = e.getComposedRanges(i.root)[0];
    if (r)
      return Oh(i, r);
  }
  let t = null;
  function n(r) {
    r.preventDefault(), r.stopImmediatePropagation(), t = r.getTargetRanges()[0];
  }
  return i.contentDOM.addEventListener("beforeinput", n, !0), i.dom.ownerDocument.execCommand("indent"), i.contentDOM.removeEventListener("beforeinput", n, !0), t ? Oh(i, t) : null;
}
class kg {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (n) => {
      let r = e.state.selection.main, { anchor: s, head: o } = r, l = this.toEditorPos(n.updateRangeStart), a = this.toEditorPos(n.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: n.updateRangeStart, editorBase: l, drifted: !1 });
      let h = a - l > n.text.length;
      l == this.from && s < this.from ? l = s : a == this.to && s > this.to && (a = s);
      let c = SO(e.state.sliceDoc(l, a), n.text, (h ? r.from : r.to) - l, h ? "end" : null);
      if (!c) {
        let O = b.single(this.toEditorPos(n.selectionStart), this.toEditorPos(n.selectionEnd));
        Rr(O, r) || e.dispatch({ selection: O, userEvent: "select" });
        return;
      }
      let f = {
        from: c.from + l,
        to: c.toA + l,
        insert: D.of(n.text.slice(c.from, c.toB).split(`
`))
      };
      if ((T.mac || T.android) && f.from == o - 1 && /^\. ?$/.test(n.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (f = { from: l, to: a, insert: D.of([n.text.replace(".", " ")]) }), this.pendingContextChange = f, !e.state.readOnly) {
        let O = this.to - this.from + (f.to - f.from + f.insert.length);
        Vl(e, f, b.single(this.toEditorPos(n.selectionStart, O), this.toEditorPos(n.selectionEnd, O)));
      }
      this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state)), f.from < f.to && !f.insert.length && e.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(t.text.slice(Math.max(0, n.updateRangeStart - 1), Math.min(t.text.length, n.updateRangeStart + 1))) && this.handlers.compositionend(n);
    }, this.handlers.characterboundsupdate = (n) => {
      let r = [], s = null;
      for (let o = this.toEditorPos(n.rangeStart), l = this.toEditorPos(n.rangeEnd); o < l; o++) {
        let a = e.coordsForChar(o);
        s = a && new DOMRect(a.left, a.top, a.right - a.left, a.bottom - a.top) || s || new DOMRect(), r.push(s);
      }
      t.updateCharacterBounds(n.rangeStart, r);
    }, this.handlers.textformatupdate = (n) => {
      let r = [];
      for (let s of n.getTextFormats()) {
        let o = s.underlineStyle, l = s.underlineThickness;
        if (!/none/i.test(o) && !/none/i.test(l)) {
          let a = this.toEditorPos(s.rangeStart), h = this.toEditorPos(s.rangeEnd);
          if (a < h) {
            let c = `text-decoration: underline ${/^[a-z]/.test(o) ? o + " " : o == "Dashed" ? "dashed " : o == "Squiggle" ? "wavy " : ""}${/thin/i.test(l) ? 1 : 2}px`;
            r.push(Z.mark({ attributes: { style: c } }).range(a, h));
          }
        }
      }
      e.dispatch({ effects: aO.of(Z.set(r)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: n } = this.composing;
        this.composing = null, n && this.reset(e.state);
      }
    };
    for (let n in this.handlers)
      t.addEventListener(n, this.handlers[n]);
    this.measureReq = { read: (n) => {
      let r = gn(n.root);
      r && r.rangeCount && this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, n = !1, r = this.pendingContextChange;
    return e.changes.iterChanges((s, o, l, a, h) => {
      if (n)
        return;
      let c = h.length - (o - s);
      if (r && o >= r.to)
        if (r.from == s && r.to == o && r.insert.eq(h)) {
          r = this.pendingContextChange = null, t += c, this.to += c;
          return;
        } else
          r = null, this.revertPending(e.state);
      if (s += t, o += t, o <= this.from)
        this.from += c, this.to += c;
      else if (s < this.to) {
        if (s < this.from || o > this.to || this.to - this.from + h.length > 3e4) {
          n = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(s), this.toContextPos(o), h.toString()), this.to += c;
      }
      t += c;
    }), r && !n && this.revertPending(e.state), !n;
  }
  update(e) {
    let t = this.pendingContextChange, n = e.startState.selection.main;
    this.composing && (this.composing.drifted || !e.changes.touchesRange(n.from, n.to) && e.transactions.some((r) => !r.isUserEvent("input.type") && r.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, n = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), r = this.toContextPos(t.head);
    (this.editContext.selectionStart != n || this.editContext.selectionEnd != r) && this.editContext.updateSelection(n, r);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, t = this.to - this.from) {
    e = Math.min(e, t);
    let n = this.composing;
    return n && n.drifted ? n.editorBase + (e - n.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let t = this.composing;
    return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class k {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return !!this.inputState && this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return !!this.inputState && this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var t;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: n } = e;
    this.dispatchTransactions = e.dispatchTransactions || n && ((r) => r.forEach((s) => n(s, this))) || ((r) => this.update(r)), this.dispatch = this.dispatch.bind(this), this._root = e.root || Jp(e.parent) || document, this.viewState = new ah(this, e.state || V.create(e)), e.scrollTo && e.scrollTo.is(Gn) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(Si).map((r) => new vs(r));
    for (let r of this.plugins)
      r.update(this);
    this.observer = new $g(this), this.inputState = new Bm(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Ua(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((t = document.fonts) === null || t === void 0) && t.ready && document.fonts.ready.then(() => {
      this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
    });
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof se ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, n = !1, r, s = this.state;
    for (let O of e) {
      if (O.startState != s)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      s = O.state;
    }
    if (this.destroyed) {
      this.viewState.state = s;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((O) => O.annotation(PO)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = kO(s, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(s.doc) || !this.state.selection.eq(s.selection)) && (c = null)) : this.observer.clear(), s.facet(V.phrases) != this.state.facet(V.phrases))
      return this.setState(s);
    r = Cr.create(this, s, e), r.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let O of e) {
        if (f && (f = f.map(O.changes)), O.scrollIntoView) {
          let { main: u } = O.state.selection, { x: d, y: m } = this.state.facet(k.cursorScrollMargin);
          f = new ki(u.empty ? u : b.cursor(u.head, u.head > u.anchor ? -1 : 1), "nearest", "nearest", m, d);
        }
        for (let u of O.effects)
          u.is(Gn) && (f = u.value.clip(this.state));
      }
      this.viewState.update(r, f), this.bidiCache = Mr.update(this.bidiCache, r.changes), r.empty || (this.updatePlugins(r), this.inputState.update(r)), t = this.docView.update(r), this.state.facet(en) != this.styleModules && this.mountStyles(), n = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((O) => O.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (r.startState.facet(Jn) != r.state.facet(Jn) && (this.viewState.mustMeasureContent = !0), (t || n || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !r.empty)
      for (let O of this.state.facet(Vo))
        try {
          O(r);
        } catch (u) {
          Ze(this.state, u, "update listener");
        }
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !gO(this, c) && h.force && Pi(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let n of this.plugins)
        n.destroy(this);
      this.viewState = new ah(this, e), this.plugins = e.facet(Si).map((n) => new vs(n)), this.pluginMap.clear();
      for (let n of this.plugins)
        n.update(this);
      this.docView.destroy(), this.docView = new Ua(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(Si), n = e.state.facet(Si);
    if (t != n) {
      let r = [];
      for (let s of n) {
        let o = t.indexOf(s);
        if (o < 0)
          r.push(new vs(s));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, r.push(l);
        }
      }
      for (let s of this.plugins)
        s.mustUpdate != e && s.destroy(this);
      this.plugins = r, this.pluginMap.clear();
    } else
      for (let r of this.plugins)
        r.mustUpdate = e;
    for (let r = 0; r < this.plugins.length; r++)
      this.plugins[r].update(this);
    t != n && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (n) {
          Ze(this.state, n, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, n = this.viewState.scrollParent, r = this.viewState.getScrollOffset(), { scrollAnchorPos: s, scrollAnchorHeight: o } = this.viewState;
    Math.abs(r - this.viewState.scrollOffset) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (Bf(n || this.win))
            s = -1, o = this.viewState.heightMap.height;
          else {
            let u = this.viewState.scrollAnchorAt(r);
            s = u.from, o = u.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure();
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((u) => {
          try {
            return u.read(this);
          } catch (d) {
            return Ze(this.state, d), uh;
          }
        }), f = Cr.create(this, this.state, []), O = !1;
        f.flags |= a, t ? t.flags |= a : t = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), O = this.docView.update(f), O && this.docViewUpdate());
        for (let u = 0; u < h.length; u++)
          if (c[u] != uh)
            try {
              let d = h[u];
              d.write && d.write(c[u], this);
            } catch (d) {
              Ze(this.state, d);
            }
        if (O && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let d = ((s < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(s).top) - o) / this.scaleY;
              if ((d > 1 || d < -1) && !(T.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (n == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
                r = r + d, n ? n.scrollTop += d : this.win.scrollBy(0, d), o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(Vo))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return Go + " " + (this.state.facet(Io) ? CO : TO) + " " + this.state.facet(Jn);
  }
  updateAttrs() {
    let e = dh(this, hO, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(bt) ? "true" : "false",
      class: "cm-content",
      style: `${T.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), dh(this, _l, t);
    let n = this.observer.ignore(() => {
      let r = Ea(this.contentDOM, this.contentAttrs, t), s = Ea(this.dom, this.editorAttrs, e);
      return r || s;
    });
    return this.editorAttrs = e, this.contentAttrs = t, n;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let n of e)
      for (let r of n.effects)
        if (r.is(k.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let s = this.announceDOM.appendChild(document.createElement("div"));
          s.textContent = r.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(en);
    let e = this.state.facet(k.cspNonce);
    Mt.mount(this.root, this.styleModules.concat(yg).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.plugin != e) && this.pluginMap.set(e, t = this.plugins.find((n) => n.plugin == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt)) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, n) {
    return Zs(this, e, Fa(this, e, t, n));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return Zs(this, e, Fa(this, e, t, (n) => Wm(this, e.head, n)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let n = this.bidiSpans(e), r = this.textDirectionAt(e.from), s = n[t ? n.length - 1 : 0];
    return b.cursor(s.side(t, r) + e.from, s.forward(!t, r) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, n = !0) {
    return Mm(this, e, t, n);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, n) {
    return Zs(this, e, qm(this, e, t, n));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e, t = 1) {
    return this.docView.domAtPos(e, t);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    this.readMeasured();
    let n = Lo(this, e, t);
    return n && n.pos;
  }
  posAndSideAtCoords(e, t = !0) {
    return this.readMeasured(), Lo(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let n = this.state.doc.lineAt(e), r = this.bidiSpans(n), s = r[lt.find(r, e - n.from, -1, t)];
    return this.docView.coordsAt(e, t, s.dir == U.RTL);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(sO) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > wg)
      return Hf(e.length);
    let t = this.textDirectionAt(e.from), n;
    for (let s of this.bidiCache)
      if (s.from == e.from && s.dir == t && (s.fresh || Ff(s.isolates, n = Ia(this, e))))
        return s.order;
    n || (n = Ia(this, e));
    let r = lm(e.text, t, n);
    return this.bidiCache.push(new Mr(e.from, e.to, t, n, !0, r)), r;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || T.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Lf(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    var n, r, s, o;
    return Gn.of(new ki(typeof e == "number" ? b.cursor(e) : e, (n = t.y) !== null && n !== void 0 ? n : "nearest", (r = t.x) !== null && r !== void 0 ? r : "nearest", (s = t.yMargin) !== null && s !== void 0 ? s : 5, (o = t.xMargin) !== null && o !== void 0 ? o : 5));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, n = this.viewState.scrollAnchorAt(e);
    return Gn.of(new ki(b.cursor(n.from), "start", "start", n.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ie.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ie.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let n = Mt.newName(), r = [Jn.of(n), en.of(No(`.${n}`, e))];
    return t && t.dark && r.push(Io.of(!0)), r;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return zt.lowest(en.of(No("." + Go, e, XO)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let n = e.querySelector(".cm-content"), r = n && te.get(n) || te.get(e);
    return ((t = r?.root) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
k.styleModule = en;
k.inputHandler = nO;
k.clipboardInputFilter = ql;
k.clipboardOutputFilter = Yl;
k.scrollHandler = lO;
k.focusChangeEffect = rO;
k.perLineTextDirection = sO;
k.exceptionSink = iO;
k.updateListener = Vo;
k.editable = bt;
k.mouseSelectionStyle = tO;
k.dragMovesSelection = eO;
k.clickAddsSelectionRange = Jf;
k.decorations = ls;
k.blockWrappers = cO;
k.outerDecorations = jl;
k.atomicRanges = Wn;
k.bidiIsolatedRanges = fO;
k.cursorScrollMargin = /* @__PURE__ */ C.define({
  combine: (i) => {
    let e = 5, t = 5;
    for (let n of i)
      typeof n == "number" ? e = t = n : { x: e, y: t } = n;
    return { x: e, y: t };
  }
});
k.scrollMargins = OO;
k.darkTheme = Io;
k.cspNonce = /* @__PURE__ */ C.define({ combine: (i) => i.length ? i[0] : "" });
k.contentAttributes = _l;
k.editorAttributes = hO;
k.lineWrapping = /* @__PURE__ */ k.contentAttributes.of({ class: "cm-lineWrapping" });
k.announce = /* @__PURE__ */ M.define();
const wg = 4096, uh = {};
class Mr {
  constructor(e, t, n, r, s, o) {
    this.from = e, this.to = t, this.dir = n, this.isolates = r, this.fresh = s, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((s) => s.fresh))
      return e;
    let n = [], r = e.length ? e[e.length - 1].dir : U.LTR;
    for (let s = Math.max(0, e.length - 10); s < e.length; s++) {
      let o = e[s];
      o.dir == r && !t.touchesRange(o.from, o.to) && n.push(new Mr(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return n;
  }
}
function dh(i, e, t) {
  for (let n = i.state.facet(e), r = n.length - 1; r >= 0; r--) {
    let s = n[r], o = typeof s == "function" ? s(i) : s;
    o && Al(o, t);
  }
  return t;
}
const vg = T.mac ? "mac" : T.windows ? "win" : T.linux ? "linux" : "key";
function Tg(i, e) {
  const t = i.split(/-(?!$)/);
  let n = t[t.length - 1];
  n == "Space" && (n = " ");
  let r, s, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      s = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : s = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return r && (n = "Alt-" + n), s && (n = "Ctrl-" + n), l && (n = "Meta-" + n), o && (n = "Shift-" + n), n;
}
function er(i, e, t) {
  return e.altKey && (i = "Alt-" + i), e.ctrlKey && (i = "Ctrl-" + i), e.metaKey && (i = "Meta-" + i), t !== !1 && e.shiftKey && (i = "Shift-" + i), i;
}
const Cg = /* @__PURE__ */ zt.default(/* @__PURE__ */ k.domEventHandlers({
  keydown(i, e) {
    return RO(ZO(e.state), i, e, "editor");
  }
})), qn = /* @__PURE__ */ C.define({ enables: Cg }), ph = /* @__PURE__ */ new WeakMap();
function ZO(i) {
  let e = i.facet(qn), t = ph.get(e);
  return t || ph.set(e, t = Rg(e.reduce((n, r) => n.concat(r), []))), t;
}
function Xg(i, e, t) {
  return RO(ZO(i.state), e, i, t);
}
let Xt = null;
const Zg = 4e3;
function Rg(i, e = vg) {
  let t = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null), r = (o, l) => {
    let a = n[o];
    if (a == null)
      n[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, s = (o, l, a, h, c) => {
    var f, O;
    let u = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), d = l.split(/ (?!$)/).map((S) => Tg(S, e));
    for (let S = 1; S < d.length; S++) {
      let Q = d.slice(0, S).join(" ");
      r(Q, !0), u[Q] || (u[Q] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(y) => {
          let w = Xt = { view: y, prefix: Q, scope: o };
          return setTimeout(() => {
            Xt == w && (Xt = null);
          }, Zg), !0;
        }]
      });
    }
    let m = d.join(" ");
    r(m, !1);
    let g = u[m] || (u[m] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((O = (f = u._any) === null || f === void 0 ? void 0 : f.run) === null || O === void 0 ? void 0 : O.slice()) || []
    });
    a && g.run.push(a), h && (g.preventDefault = !0), c && (g.stopPropagation = !0);
  };
  for (let o of i) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let c = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: f } = o;
        for (let O in c)
          c[O].run.push((u) => f(u, Uo));
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        s(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && s(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
let Uo = null;
function RO(i, e, t, n) {
  Uo = e;
  let r = Ip(e), s = Te(r, 0), o = st(s) == r.length && r != " ", l = "", a = !1, h = !1, c = !1;
  Xt && Xt.view == t && Xt.scope == n && (l = Xt.prefix + " ", bO.indexOf(e.keyCode) < 0 && (h = !0, Xt = null));
  let f = /* @__PURE__ */ new Set(), O = (g) => {
    if (g) {
      for (let S of g.run)
        if (!f.has(S) && (f.add(S), S(t)))
          return g.stopPropagation && (c = !0), !0;
      g.preventDefault && (g.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, u = i[n], d, m;
  return u && (O(u[l + er(r, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(T.windows && e.ctrlKey && e.altKey) && // Alt-combinations on macOS tend to be typed characters
  !(T.mac && e.altKey && !(e.ctrlKey || e.metaKey)) && (d = Wt[e.keyCode]) && d != r ? (O(u[l + er(d, e, !0)]) || e.shiftKey && (m = pn[e.keyCode]) != r && m != d && O(u[l + er(m, e, !1)])) && (a = !0) : o && e.shiftKey && O(u[l + er(r, e, !0)]) && (a = !0), !a && O(u._any) && (a = !0)), h && (a = !0), a && c && e.stopPropagation(), Uo = null, a;
}
class ri {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, n, r, s) {
    this.className = e, this.left = t, this.top = n, this.width = r, this.height = s;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, n) {
    if (n.empty) {
      let r = e.coordsAtPos(n.head, n.assoc || 1);
      if (!r)
        return [];
      let s = AO(e);
      return [new ri(t, r.left - s.left, r.top - s.top, null, r.bottom - r.top)];
    } else
      return Ag(e, t, n);
  }
}
function AO(i) {
  let e = i.scrollDOM.getBoundingClientRect();
  return { left: (i.textDirection == U.LTR ? e.left : e.right - i.scrollDOM.clientWidth * i.scaleX) - i.scrollDOM.scrollLeft * i.scaleX, top: e.top - i.scrollDOM.scrollTop * i.scaleY };
}
function mh(i, e, t, n) {
  let r = i.coordsAtPos(e, t * 2);
  if (!r)
    return n;
  let s = i.dom.getBoundingClientRect(), o = (r.top + r.bottom) / 2, l = i.posAtCoords({ x: s.left + 1, y: o }), a = i.posAtCoords({ x: s.right - 1, y: o });
  return l == null || a == null ? n : { from: Math.max(n.from, Math.min(l, a)), to: Math.min(n.to, Math.max(l, a)) };
}
function Ag(i, e, t) {
  if (t.to <= i.viewport.from || t.from >= i.viewport.to)
    return [];
  let n = Math.max(t.from, i.viewport.from), r = Math.min(t.to, i.viewport.to), s = i.textDirection == U.LTR, o = i.contentDOM, l = o.getBoundingClientRect(), a = AO(i), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), O = l.right - (c ? parseInt(c.paddingRight) : 0), u = Eo(i, n, 1), d = Eo(i, r, -1), m = u.type == me.Text ? u : null, g = d.type == me.Text ? d : null;
  if (m && (i.lineWrapping || u.widgetLineBreaks) && (m = mh(i, n, 1, m)), g && (i.lineWrapping || d.widgetLineBreaks) && (g = mh(i, r, -1, g)), m && g && m.from == g.from && m.to == g.to)
    return Q(y(t.from, t.to, m));
  {
    let x = m ? y(t.from, null, m) : w(u, !1), $ = g ? y(null, t.to, g) : w(d, !0), P = [];
    return (m || u).to < (g || d).from - (m && g ? 1 : 0) || u.widgetLineBreaks > 1 && x.bottom + i.defaultLineHeight / 2 < $.top ? P.push(S(f, x.bottom, O, $.top)) : x.bottom < $.top && i.elementAtHeight((x.bottom + $.top) / 2).type == me.Text && (x.bottom = $.top = (x.bottom + $.top) / 2), Q(x).concat(P).concat(Q($));
  }
  function S(x, $, P, A) {
    return new ri(e, x - a.left, $ - a.top, Math.max(0, P - x), A - $);
  }
  function Q({ top: x, bottom: $, horizontal: P }) {
    let A = [];
    for (let q = 0; q < P.length; q += 2)
      A.push(S(P[q], x, P[q + 1], $));
    return A;
  }
  function y(x, $, P) {
    let A = 1e9, q = -1e9, E = [];
    function W(_, L, ne, ae, ye) {
      let ee = i.coordsAtPos(_, _ == P.to ? -2 : 2), fe = i.coordsAtPos(ne, ne == P.from ? 2 : -2);
      !ee || !fe || (A = Math.min(ee.top, fe.top, A), q = Math.max(ee.bottom, fe.bottom, q), ye == U.LTR ? E.push(s && L ? f : ee.left, s && ae ? O : fe.right) : E.push(!s && ae ? f : fe.left, !s && L ? O : ee.right));
    }
    let R = x ?? P.from, z = $ ?? P.to;
    for (let _ of i.visibleRanges)
      if (_.to > R && _.from < z)
        for (let L = Math.max(_.from, R), ne = Math.min(_.to, z); ; ) {
          let ae = i.state.doc.lineAt(L);
          for (let ye of i.bidiSpans(ae)) {
            let ee = ye.from + ae.from, fe = ye.to + ae.from;
            if (ee >= ne)
              break;
            fe > L && W(Math.max(ee, L), x == null && ee <= R, Math.min(fe, ne), $ == null && fe >= z, ye.dir);
          }
          if (L = ae.to + 1, L >= ne)
            break;
        }
    return E.length == 0 && W(R, x == null, z, $ == null, i.textDirection), { top: A, bottom: q, horizontal: E };
  }
  function w(x, $) {
    let P = l.top + ($ ? x.top : x.bottom);
    return { top: P, bottom: P, horizontal: [] };
  }
}
function Mg(i, e) {
  return i.constructor == e.constructor && i.eq(e);
}
class Wg {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(mr) != e.state.facet(mr) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, n = e.facet(mr);
    for (; t < n.length && n[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, n) => !Mg(t, this.drawn[n]))) {
      let t = this.dom.firstChild, n = 0;
      for (let r of e)
        r.update && t && r.constructor && this.drawn[n].constructor && r.update(t, this.drawn[n]) ? (t = t.nextSibling, n++) : this.dom.insertBefore(r.draw(), t);
      for (; t; ) {
        let r = t.nextSibling;
        t.remove(), t = r;
      }
      this.drawn = e, T.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const mr = /* @__PURE__ */ C.define();
function MO(i) {
  return [
    ie.define((e) => new Wg(e, i)),
    mr.of(i)
  ];
}
const Mi = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0,
      iosSelectionHandles: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function qg(i = {}) {
  return [
    Mi.of(i),
    Yg,
    _g,
    zg,
    oO.of(!0)
  ];
}
function WO(i) {
  return i.startState.facet(Mi) != i.state.facet(Mi);
}
const Yg = /* @__PURE__ */ MO({
  above: !0,
  markers(i) {
    let { state: e } = i, t = e.facet(Mi), n = [];
    for (let r of e.selection.ranges) {
      let s = r == e.selection.main;
      if (r.empty || t.drawRangeCursor && !(s && T.ios && t.iosSelectionHandles)) {
        let o = s ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = r.empty ? r : b.cursor(r.head, r.assoc);
        for (let a of ri.forRange(i, o, l))
          n.push(a);
      }
    }
    return n;
  },
  update(i, e) {
    i.transactions.some((n) => n.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = WO(i);
    return t && gh(i.state, e), i.docChanged || i.selectionSet || t;
  },
  mount(i, e) {
    gh(e.state, i);
  },
  class: "cm-cursorLayer"
});
function gh(i, e) {
  e.style.animationDuration = i.facet(Mi).cursorBlinkRate + "ms";
}
const _g = /* @__PURE__ */ MO({
  above: !1,
  markers(i) {
    let e = [], { main: t, ranges: n } = i.state.selection;
    for (let r of n)
      if (!r.empty)
        for (let s of ri.forRange(i, "cm-selectionBackground", r))
          e.push(s);
    if (T.ios && !t.empty && i.state.facet(Mi).iosSelectionHandles) {
      for (let r of ri.forRange(i, "cm-selectionHandle cm-selectionHandle-start", b.cursor(t.from, 1)))
        e.push(r);
      for (let r of ri.forRange(i, "cm-selectionHandle cm-selectionHandle-end", b.cursor(t.to, 1)))
        e.push(r);
    }
    return e;
  },
  update(i, e) {
    return i.docChanged || i.selectionSet || i.viewportChanged || WO(i);
  },
  class: "cm-selectionLayer"
}), jg = T.gecko && T.gecko_version >= 153 ? "#ffffff01" : "transparent", zg = /* @__PURE__ */ zt.highest(/* @__PURE__ */ k.theme({
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: `${jg} !important` },
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
})), qO = /* @__PURE__ */ M.define({
  map(i, e) {
    return i == null ? null : e.mapPos(i);
  }
}), nn = /* @__PURE__ */ ge.define({
  create() {
    return null;
  },
  update(i, e) {
    return i != null && (i = e.changes.mapPos(i)), e.effects.reduce((t, n) => n.is(qO) ? n.value : t, i);
  }
}), Vg = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.view = i, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(i) {
    var e;
    let t = i.state.field(nn);
    t == null ? this.cursor != null && ((e = this.cursor) === null || e === void 0 || e.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (i.startState.field(nn) != t || i.docChanged || i.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: i } = this, e = i.state.field(nn), t = e != null && i.coordsAtPos(e);
    if (!t)
      return null;
    let n = i.scrollDOM.getBoundingClientRect();
    return {
      left: t.left - n.left + i.scrollDOM.scrollLeft * i.scaleX,
      top: t.top - n.top + i.scrollDOM.scrollTop * i.scaleY,
      height: t.bottom - t.top
    };
  }
  drawCursor(i) {
    if (this.cursor) {
      let { scaleX: e, scaleY: t } = this.view;
      i ? (this.cursor.style.left = i.left / e + "px", this.cursor.style.top = i.top / t + "px", this.cursor.style.height = i.height / t + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(i) {
    this.view.state.field(nn) != i && this.view.dispatch({ effects: qO.of(i) });
  }
}, {
  eventObservers: {
    dragover(i) {
      this.setDropPos(this.view.posAtCoords({ x: i.clientX, y: i.clientY }));
    },
    dragleave(i) {
      (i.target == this.view.contentDOM || !this.view.contentDOM.contains(i.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function Dg() {
  return [nn, Vg];
}
function Sh(i, e, t, n, r) {
  e.lastIndex = 0;
  for (let s = i.iterRange(t, n), o = t, l; !s.next().done; o += s.value.length)
    if (!s.lineBreak)
      for (; l = e.exec(s.value); )
        r(o + l.index, l);
}
function Eg(i, e) {
  let t = i.visibleRanges;
  if (t.length == 1 && t[0].from == i.viewport.from && t[0].to == i.viewport.to)
    return t;
  let n = [];
  for (let { from: r, to: s } of t)
    r = Math.max(i.state.doc.lineAt(r).from, r - e), s = Math.min(i.state.doc.lineAt(s).to, s + e), n.length && n[n.length - 1].to >= r ? n[n.length - 1].to = s : n.push({ from: r, to: s });
  return n;
}
class Lg {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: n, decorate: r, boundary: s, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, r)
      this.addMatch = (l, a, h, c) => r(c, h, h + l[0].length, l, a);
    else if (typeof n == "function")
      this.addMatch = (l, a, h, c) => {
        let f = n(l, a, h);
        f && c(h, h + l[0].length, f);
      };
    else if (n)
      this.addMatch = (l, a, h, c) => c(h, h + l[0].length, n);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = s, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new $t(), n = t.add.bind(t);
    for (let { from: r, to: s } of Eg(e, this.maxLength))
      Sh(e.state.doc, this.regexp, r, s, (o, l) => this.addMatch(l, e, o, n));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let n = 1e9, r = -1;
    return e.docChanged && e.changes.iterChanges((s, o, l, a) => {
      a >= e.view.viewport.from && l <= e.view.viewport.to && (n = Math.min(l, n), r = Math.max(a, r));
    }), e.viewportMoved || r - n > 1e3 ? this.createDeco(e.view) : r > -1 ? this.updateRange(e.view, t.map(e.changes), n, r) : t;
  }
  updateRange(e, t, n, r) {
    for (let s of e.visibleRanges) {
      let o = Math.max(s.from, n), l = Math.min(s.to, r);
      if (l >= o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, c = Math.max(s.from, a.from), f = Math.min(s.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              c = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              f = l;
              break;
            }
        }
        let O = [], u, d = (m, g, S) => O.push(S.range(m, g));
        if (a == h)
          for (this.regexp.lastIndex = c - a.from; (u = this.regexp.exec(a.text)) && u.index < f - a.from; )
            this.addMatch(u, e, u.index + a.from, d);
        else
          Sh(e.state.doc, this.regexp, c, f, (m, g) => this.addMatch(g, e, m, d));
        t = t.update({ filterFrom: c, filterTo: f, filter: (m, g) => m < c || g > f, add: O });
      }
    }
    return t;
  }
}
const Fo = /x/.unicode != null ? "gu" : "g", Bg = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, Fo), Ig = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let Ms = null;
function Gg() {
  var i;
  if (Ms == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    Ms = ((i = e.tabSize) !== null && i !== void 0 ? i : e.MozTabSize) != null;
  }
  return Ms || !1;
}
const gr = /* @__PURE__ */ C.define({
  combine(i) {
    let e = mt(i, {
      render: null,
      specialChars: Bg,
      addSpecialChars: null
    });
    return (e.replaceTabs = !Gg()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, Fo)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, Fo)), e;
  }
});
function Ng(i = {}) {
  return [gr.of(i), Ug()];
}
let Qh = null;
function Ug() {
  return Qh || (Qh = ie.fromClass(class {
    constructor(i) {
      this.view = i, this.decorations = Z.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(i.state.facet(gr)), this.decorations = this.decorator.createDeco(i);
    }
    makeDecorator(i) {
      return new Lg({
        regexp: i.specialChars,
        decoration: (e, t, n) => {
          let { doc: r } = t.state, s = Te(e[0], 0);
          if (s == 9) {
            let o = r.lineAt(n), l = t.state.tabSize, a = zi(o.text, l, n - o.from);
            return Z.replace({
              widget: new Jg((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[s] || (this.decorationCache[s] = Z.replace({ widget: new Kg(i, s) }));
        },
        boundary: i.replaceTabs ? void 0 : /[^]/
      });
    }
    update(i) {
      let e = i.state.facet(gr);
      i.startState.facet(gr) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(i.view)) : this.decorations = this.decorator.updateDeco(i, this.decorations);
    }
  }, {
    decorations: (i) => i.decorations
  }));
}
const Fg = "•";
function Hg(i) {
  return i >= 32 ? Fg : i == 10 ? "␤" : String.fromCharCode(9216 + i);
}
class Kg extends Ue {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = Hg(this.code), n = e.state.phrase("Control character") + " " + (Ig[this.code] || "0x" + this.code.toString(16)), r = this.options.render && this.options.render(this.code, n, t);
    if (r)
      return r;
    let s = document.createElement("span");
    return s.textContent = t, s.title = n, s.setAttribute("aria-label", n), s.className = "cm-specialChar", s;
  }
  ignoreEvent() {
    return !1;
  }
}
class Jg extends Ue {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function e0() {
  return i0;
}
const t0 = /* @__PURE__ */ Z.line({ class: "cm-activeLine" }), i0 = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.decorations = this.getDeco(i);
  }
  update(i) {
    (i.docChanged || i.selectionSet) && (this.decorations = this.getDeco(i.view));
  }
  getDeco(i) {
    let e = -1, t = [];
    for (let n of i.state.selection.ranges) {
      let r = i.lineBlockAt(n.head);
      r.from > e && (t.push(t0.range(r.from)), e = r.from);
    }
    return Z.set(t);
  }
}, {
  decorations: (i) => i.decorations
});
class n0 extends Ue {
  constructor(e) {
    super(), this.content = e;
  }
  toDOM(e) {
    let t = document.createElement("span");
    return t.className = "cm-placeholder", t.style.pointerEvents = "none", t.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : typeof this.content == "function" ? this.content(e) : this.content.cloneNode(!0)), t.setAttribute("aria-hidden", "true"), t;
  }
  coordsAt(e) {
    let t = e.firstChild ? an(e.firstChild) : [];
    if (!t.length)
      return null;
    let n = window.getComputedStyle(e.parentNode), r = Sn(t[0], n.direction != "rtl"), s = parseInt(n.lineHeight);
    return r.bottom - r.top > s * 1.5 ? { left: r.left, right: r.right, top: r.top, bottom: r.top + s } : r;
  }
  ignoreEvent() {
    return !1;
  }
}
function r0(i) {
  let e = ie.fromClass(class {
    constructor(t) {
      this.view = t, this.placeholder = i ? Z.set([Z.widget({ widget: new n0(i), side: 1 }).range(0)]) : Z.none;
    }
    get decorations() {
      return this.view.state.doc.length ? Z.none : this.placeholder;
    }
  }, { decorations: (t) => t.decorations });
  return typeof i == "string" ? [
    e,
    k.contentAttributes.of({ "aria-placeholder": i })
  ] : e;
}
const Ho = 2e3;
function s0(i, e, t) {
  let n = Math.min(e.line, t.line), r = Math.max(e.line, t.line), s = [];
  if (e.off > Ho || t.off > Ho || e.col < 0 || t.col < 0) {
    let o = Math.min(e.off, t.off), l = Math.max(e.off, t.off);
    for (let a = n; a <= r; a++) {
      let h = i.doc.line(a);
      h.length <= l && s.push(b.range(h.from + o, h.to + l));
    }
  } else {
    let o = Math.min(e.col, t.col), l = Math.max(e.col, t.col);
    for (let a = n; a <= r; a++) {
      let h = i.doc.line(a), c = Xo(h.text, o, i.tabSize, !0);
      if (c < 0)
        s.push(b.cursor(h.to));
      else {
        let f = Xo(h.text, l, i.tabSize);
        s.push(b.range(h.from + c, h.from + f));
      }
    }
  }
  return s;
}
function o0(i, e) {
  let t = i.coordsAtPos(i.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / i.defaultCharacterWidth)) : -1;
}
function bh(i, e) {
  let t = i.posAtCoords({ x: e.clientX, y: e.clientY }, !1), n = i.state.doc.lineAt(t), r = t - n.from, s = r > Ho ? -1 : r == n.length ? o0(i, e.clientX) : zi(n.text, i.state.tabSize, t - n.from);
  return { line: n.number, col: s, off: r };
}
function l0(i, e) {
  let t = bh(i, e), n = i.state.selection;
  return t ? {
    update(r) {
      if (r.docChanged) {
        let s = r.changes.mapPos(r.startState.doc.line(t.line).from), o = r.state.doc.lineAt(s);
        t = { line: o.number, col: t.col, off: Math.min(t.off, o.length) }, n = n.map(r.changes);
      }
    },
    get(r, s, o) {
      let l = bh(i, r);
      if (!l)
        return n;
      let a = s0(i.state, t, l);
      return a.length ? o ? b.create(a.concat(n.ranges)) : b.create(a) : n;
    }
  } : null;
}
function a0(i) {
  let e = ((t) => t.altKey && t.button == 0);
  return k.mouseSelectionStyle.of((t, n) => e(n) ? l0(t, n) : null);
}
const h0 = {
  Alt: [18, (i) => !!i.altKey],
  Control: [17, (i) => !!i.ctrlKey],
  Shift: [16, (i) => !!i.shiftKey],
  Meta: [91, (i) => !!i.metaKey]
}, c0 = { style: "cursor: crosshair" };
function f0(i = {}) {
  let [e, t] = h0[i.key || "Alt"], n = ie.fromClass(class {
    constructor(r) {
      this.view = r, this.isDown = !1;
    }
    set(r) {
      this.isDown != r && (this.isDown = r, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(r) {
        this.set(r.keyCode == e || t(r));
      },
      keyup(r) {
        (r.keyCode == e || !t(r)) && this.set(!1);
      },
      mousemove(r) {
        this.set(t(r));
      }
    }
  });
  return [
    n,
    k.contentAttributes.of((r) => {
      var s;
      return !((s = r.plugin(n)) === null || s === void 0) && s.isDown ? c0 : null;
    })
  ];
}
const tr = "-10000px";
class YO {
  constructor(e, t, n, r) {
    this.facet = t, this.createTooltipView = n, this.removeTooltipView = r, this.input = e.state.facet(t), this.tooltips = this.input.filter((o) => o);
    let s = null;
    this.tooltipViews = this.tooltips.map((o) => s = n(o, s));
  }
  update(e, t) {
    var n;
    let r = e.state.facet(this.facet), s = r.filter((a) => a);
    if (r === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(e);
      return !1;
    }
    let o = [], l = t ? [] : null;
    for (let a = 0; a < s.length; a++) {
      let h = s[a], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let O = this.tooltips[f];
          O && O.create == h.create && (c = f);
        }
        if (c < 0)
          o[a] = this.createTooltipView(h, a ? o[a - 1] : null), l && (l[a] = !!h.above);
        else {
          let f = o[a] = this.tooltipViews[c];
          l && (l[a] = t[c]), f.update && f.update(e);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (this.removeTooltipView(a), (n = a.destroy) === null || n === void 0 || n.call(a));
    return t && (l.forEach((a, h) => t[h] = a), t.length = l.length), this.input = r, this.tooltips = s, this.tooltipViews = o, !0;
  }
}
function O0(i) {
  let e = i.dom.ownerDocument.documentElement;
  return { top: 0, left: 0, bottom: e.clientHeight, right: e.clientWidth };
}
const Ws = /* @__PURE__ */ C.define({
  combine: (i) => {
    var e, t, n;
    return {
      position: T.ios ? "absolute" : ((e = i.find((r) => r.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = i.find((r) => r.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((n = i.find((r) => r.tooltipSpace)) === null || n === void 0 ? void 0 : n.tooltipSpace) || O0
    };
  }
}), yh = /* @__PURE__ */ new WeakMap(), Ll = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.view = i, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = i.state.facet(Ws);
    this.position = e.position, this.parent = e.parent, this.classes = i.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new YO(i, Bl, (t, n) => this.createTooltip(t, n), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), i.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let i of this.manager.tooltipViews)
        this.intersectionObserver.observe(i.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(i) {
    i.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(i, this.above);
    e && this.observeIntersection();
    let t = e || i.geometryChanged, n = i.state.facet(Ws);
    if (n.position != this.position && !this.madeAbsolute) {
      this.position = n.position;
      for (let r of this.manager.tooltipViews)
        r.dom.style.position = this.position;
      t = !0;
    }
    if (n.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = n.parent, this.createContainer();
      for (let r of this.manager.tooltipViews)
        this.container.appendChild(r.dom);
      t = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(i, e) {
    let t = i.create(this.view), n = e ? e.dom : null;
    if (t.dom.classList.add("cm-tooltip"), i.arrow && !t.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let r = document.createElement("div");
      r.className = "cm-tooltip-arrow", t.dom.appendChild(r);
    }
    return t.dom.style.position = this.position, t.dom.style.top = tr, t.dom.style.left = "0px", this.container.insertBefore(t.dom, n), t.mount && t.mount(this.view), this.resizeObserver && this.resizeObserver.observe(t.dom), t;
  }
  destroy() {
    var i, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let n of this.manager.tooltipViews)
      n.dom.remove(), (i = n.destroy) === null || i === void 0 || i.call(n);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let i = 1, e = 1, t = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (T.safari) {
        let o = s.getBoundingClientRect();
        t = Math.abs(o.top + 1e4) > 1 || Math.abs(o.left) > 1;
      } else
        t = !!s.offsetParent && s.offsetParent != this.container.ownerDocument.body;
    }
    if (t || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (i = s.width / this.parent.offsetWidth, e = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: i, scaleY: e } = this.view.viewState);
    let n = this.view.scrollDOM.getBoundingClientRect(), r = zl(this.view);
    return {
      visible: {
        left: n.left + r.left,
        top: n.top + r.top,
        right: n.right - r.right,
        bottom: n.bottom - r.bottom
      },
      parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((s, o) => {
        let l = this.manager.tooltipViews[o];
        return l.getCoords ? l.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(Ws).tooltipSpace(this.view),
      scaleX: i,
      scaleY: e,
      makeAbsolute: t
    };
  }
  writeMeasure(i) {
    var e;
    if (i.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { visible: t, space: n, scaleX: r, scaleY: s } = i, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = i.pos[l], O = i.size[l];
      if (!f || a.clip !== !1 && (f.bottom <= Math.max(t.top, n.top) || f.top >= Math.min(t.bottom, n.bottom) || f.right < Math.max(t.left, n.left) - 0.1 || f.left > Math.min(t.right, n.right) + 0.1)) {
        c.style.top = tr;
        continue;
      }
      let u = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, d = u ? 7 : 0, m = O.right - O.left, g = (e = yh.get(h)) !== null && e !== void 0 ? e : O.bottom - O.top, S = h.offset || d0, Q = this.view.textDirection == U.LTR, y = O.width > n.right - n.left ? Q ? n.left : n.right - O.width : Q ? Math.max(n.left, Math.min(f.left - (u ? 14 : 0) + S.x, n.right - m)) : Math.min(Math.max(n.left, f.left - m + (u ? 14 : 0) - S.x), n.right - m), w = this.above[l];
      !a.strictSide && (w ? f.top - g - d - S.y < n.top : f.bottom + g + d + S.y > n.bottom) && w == n.bottom - f.bottom > f.top - n.top && (w = this.above[l] = !w);
      let x = (w ? f.top - n.top : n.bottom - f.bottom) - d;
      if (x < g && h.resize !== !1) {
        if (x < this.view.defaultLineHeight) {
          c.style.top = tr;
          continue;
        }
        yh.set(h, g), c.style.height = (g = x) / s + "px";
      } else c.style.height && (c.style.height = "");
      let $ = w ? f.top - g - d - S.y : f.bottom + d + S.y, P = y + m;
      if (h.overlap !== !0)
        for (let A of o)
          A.left < P && A.right > y && A.top < $ + g && A.bottom > $ && ($ = w ? A.top - g - 2 - d : A.bottom + d + 2);
      if (this.position == "absolute" ? (c.style.top = ($ - i.parent.top) / s + "px", xh(c, (y - i.parent.left) / r)) : (c.style.top = $ / s + "px", xh(c, y / r)), u) {
        let A = f.left + (Q ? S.x : -S.x) - (y + 14 - 7);
        u.style.left = A / r + "px";
      }
      h.overlap !== !0 && o.push({ left: y, top: $, right: P, bottom: $ + g }), c.classList.toggle("cm-tooltip-above", w), c.classList.toggle("cm-tooltip-below", !w), h.positioned && h.positioned(i.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let i of this.manager.tooltipViews)
        i.dom.style.top = tr;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
function xh(i, e) {
  let t = parseInt(i.style.left, 10);
  (isNaN(t) || Math.abs(e - t) > 1) && (i.style.left = e + "px");
}
const u0 = /* @__PURE__ */ k.baseTheme({
  ".cm-tooltip": {
    zIndex: 500,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: "14px",
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), d0 = { x: 0, y: 0 }, Bl = /* @__PURE__ */ C.define({
  enables: [Ll, u0]
}), Wr = /* @__PURE__ */ C.define({
  combine: (i) => i.reduce((e, t) => e.concat(t), [])
});
class fs {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new fs(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new YO(e, Wr, (t, n) => this.createHostedView(t, n), (t) => t.dom.remove());
  }
  createHostedView(e, t) {
    let n = e.create(this.view);
    return n.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(n.dom, t ? t.dom.nextSibling : this.dom.firstChild), this.mounted && n.mount && n.mount(this.view), n;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let n of this.manager.tooltipViews) {
      let r = n[e];
      if (r !== void 0) {
        if (t === void 0)
          t = r;
        else if (t !== r)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const p0 = /* @__PURE__ */ Bl.compute([Wr], (i) => {
  let e = i.facet(Wr);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var n;
      return (n = t.end) !== null && n !== void 0 ? n : t.pos;
    })),
    create: fs.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
}), _O = /* @__PURE__ */ C.define();
class m0 {
  constructor(e, t, n, r, s, o) {
    this.view = e, this.source = t, this.field = n, this.locked = r, this.setHover = s, this.hoverTime = o, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update(e) {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, n = e.docView.tile.nearest(t.target);
    if (!n)
      return;
    let r, s = 1;
    if (n.isWidget())
      r = n.posAtStart;
    else {
      if (r = e.posAtCoords(t), r == null)
        return;
      let o = e.coordsAtPos(r);
      if (!o || t.y < o.top || t.y > o.bottom || t.x < o.left - e.defaultCharacterWidth || t.x > o.right + e.defaultCharacterWidth)
        return;
      let l = e.bidiSpans(e.state.doc.lineAt(r)).find((h) => h.from <= r && h.to >= r), a = l && l.dir == U.RTL ? -1 : 1;
      s = t.x < o.left ? -a : a;
    }
    this.activateHover(e, r, s);
  }
  activateHover(e, t, n, r) {
    let s = this.source(e, t, n), o = (l) => {
      if (l && !(Array.isArray(l) && !l.length)) {
        let a = Array.isArray(l) ? l : [l];
        r && this.locked.set(a, r), e.dispatch({ effects: this.setHover.of(a) });
      }
    };
    if (s && "then" in s) {
      let l = this.pending = { pos: t };
      s.then((a) => {
        this.pending == l && (this.pending = null, o(a));
      }, (a) => Ze(e.state, a, "hover tooltip"));
    } else
      o(s);
  }
  get tooltip() {
    let e = this.view.plugin(Ll), t = e ? e.manager.tooltips.findIndex((n) => n.create == fs.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t, n;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: r, tooltip: s } = this;
    if (r.length && !this.locked.has(r) && s && !g0(s.dom, e) || this.pending) {
      let { pos: o } = r[0] || this.pending, l = (n = (t = r[0]) === null || t === void 0 ? void 0 : t.end) !== null && n !== void 0 ? n : o;
      (o == l ? this.view.posAtCoords(this.lastMove) != o : !S0(this.view, o, l, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t.length && !this.locked.has(t)) {
      let { tooltip: n } = this;
      n && n.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(n.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(e) {
    let t = (n) => {
      e.removeEventListener("mouseleave", t);
      let { active: r } = this;
      r.length && !this.locked.has(r) && !this.view.dom.contains(n.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), clearTimeout(this.restartTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const ir = 4;
function g0(i, e) {
  let { left: t, right: n, top: r, bottom: s } = i.getBoundingClientRect(), o;
  if (o = i.querySelector(".cm-tooltip-arrow")) {
    let l = o.getBoundingClientRect();
    r = Math.min(l.top, r), s = Math.max(l.bottom, s);
  }
  return e.clientX >= t - ir && e.clientX <= n + ir && e.clientY >= r - ir && e.clientY <= s + ir;
}
function S0(i, e, t, n, r, s) {
  let o = i.scrollDOM.getBoundingClientRect(), l = i.documentTop + i.documentPadding.top + i.contentHeight;
  if (o.left > n || o.right < n || o.top > r || Math.min(o.bottom, l) < r)
    return !1;
  let a = i.posAtCoords({ x: n, y: r }, !1);
  return a >= e && a <= t;
}
function Q0(i, e = {}) {
  let t = M.define(), n = /* @__PURE__ */ new WeakMap(), r = ge.define({
    create() {
      return [];
    },
    update(o, l) {
      let a = n.get(o);
      if (o.length && (e.hideOnChange && (l.docChanged || l.selection) ? o = [] : a && a(l) ? o = [] : e.hideOn && (o = o.filter((h) => !e.hideOn(l, h)))), l.docChanged && o.length) {
        let h = [];
        for (let c of o) {
          let f = l.changes.mapPos(c.pos, -1, pe.TrackDel);
          if (f != null) {
            let O = Object.assign(/* @__PURE__ */ Object.create(null), c);
            O.pos = f, O.end != null && (O.end = l.changes.mapPos(O.end)), h.push(O);
          }
        }
        o = h;
      }
      for (let h of l.effects)
        h.is(t) && (o = h.value, a = void 0), (h.is(y0) && !h.value || h.value == r) && (o = []);
      return o.length && a && n.set(o, a), o;
    },
    provide: (o) => Wr.from(o)
  });
  const s = ie.define((o) => new m0(
    o,
    i,
    r,
    n,
    t,
    e.hoverTime || 300
    /* Hover.Time */
  ));
  return {
    active: r,
    extension: [
      r,
      s,
      _O.of(s),
      p0
    ]
  };
}
function b0(i, e, t, n = {}) {
  var r;
  let s = i.state.facet(_O).map((o) => i.plugin(o)).filter((o) => !!o);
  if (n.tooltip && n.tooltip.active) {
    let o = s.find((l) => l.field == n.tooltip.active);
    o && (s = [o]);
  }
  for (let o of s)
    o.activateHover(i, e, t, (r = n.until) !== null && r !== void 0 ? r : (() => !1));
}
function jO(i, e) {
  let t = i.plugin(Ll);
  if (!t)
    return null;
  let n = t.manager.tooltips.indexOf(e);
  return n < 0 ? null : t.manager.tooltipViews[n];
}
const y0 = /* @__PURE__ */ M.define(), $h = /* @__PURE__ */ C.define({
  combine(i) {
    let e, t;
    for (let n of i)
      e = e || n.topContainer, t = t || n.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Il(i, e) {
  let t = i.plugin(zO), n = t ? t.specs.indexOf(e) : -1;
  return n > -1 ? t.panels[n] : null;
}
const zO = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.input = i.state.facet(bn), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(i));
    let e = i.state.facet($h);
    this.top = new nr(i, !0, e.topContainer), this.bottom = new nr(i, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(i) {
    let e = i.state.facet($h);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new nr(i.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new nr(i.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = i.state.facet(bn);
    if (t != this.input) {
      let n = t.filter((a) => a), r = [], s = [], o = [], l = [];
      for (let a of n) {
        let h = this.specs.indexOf(a), c;
        h < 0 ? (c = a(i.view), l.push(c)) : (c = this.panels[h], c.update && c.update(i)), r.push(c), (c.top ? s : o).push(c);
      }
      this.specs = n, this.panels = r, this.top.sync(s), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let n of this.panels)
        n.update && n.update(i);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (i) => k.scrollMargins.of((e) => {
    let t = e.plugin(i);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class nr {
  constructor(e, t, n) {
    this.view = e, this.top = t, this.container = n, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = Ph(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = Ph(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function Ph(i) {
  let e = i.nextSibling;
  return i.remove(), e;
}
const bn = /* @__PURE__ */ C.define({
  enables: zO
});
function x0(i, e) {
  let t, n = new Promise((o) => t = o), r = (o) => $0(o, e, t);
  i.state.field(qs, !1) ? i.dispatch({ effects: VO.of(r) }) : i.dispatch({ effects: M.appendConfig.of(qs.init(() => [r])) });
  let s = DO.of(r);
  return { close: s, result: n.then((o) => ((i.win.queueMicrotask || ((a) => i.win.setTimeout(a, 10)))(() => {
    i.state.field(qs).indexOf(r) > -1 && i.dispatch({ effects: s });
  }), o)) };
}
const qs = /* @__PURE__ */ ge.define({
  create() {
    return [];
  },
  update(i, e) {
    for (let t of e.effects)
      t.is(VO) ? i = [t.value].concat(i) : t.is(DO) && (i = i.filter((n) => n != t.value));
    return i;
  },
  provide: (i) => bn.computeN([i], (e) => e.field(i))
}), VO = /* @__PURE__ */ M.define(), DO = /* @__PURE__ */ M.define();
function $0(i, e, t) {
  let n = e.content ? e.content(i, () => o(null)) : null;
  if (!n) {
    if (n = I("form"), e.input) {
      let l = I("input", e.input);
      /^(text|password|number|email|tel|url)$/.test(l.type) && l.classList.add("cm-textfield"), l.name || (l.name = "input"), n.appendChild(I("label", (e.label || "") + ": ", l));
    } else
      n.appendChild(document.createTextNode(e.label || ""));
    n.appendChild(document.createTextNode(" ")), n.appendChild(I("button", { class: "cm-button", type: "submit" }, e.submitLabel || "OK"));
  }
  let r = n.nodeName == "FORM" ? [n] : n.querySelectorAll("form");
  for (let l = 0; l < r.length; l++) {
    let a = r[l];
    a.addEventListener("keydown", (h) => {
      h.keyCode == 27 ? (h.preventDefault(), o(null)) : h.keyCode == 13 && (h.preventDefault(), o(a));
    }), a.addEventListener("submit", (h) => {
      h.preventDefault(), o(a);
    });
  }
  let s = I("div", n, I("button", {
    onclick: () => o(null),
    "aria-label": i.state.phrase("close"),
    class: "cm-dialog-close",
    type: "button"
  }, ["×"]));
  e.class && (s.className = e.class), s.classList.add("cm-dialog");
  function o(l) {
    s.contains(s.ownerDocument.activeElement) && i.focus(), t(l);
  }
  return {
    dom: s,
    top: e.top,
    mount: () => {
      if (e.focus) {
        let l;
        typeof e.focus == "string" ? l = n.querySelector(e.focus) : l = n.querySelector("input") || n.querySelector("button"), l && "select" in l ? l.select() : l && "focus" in l && l.focus();
      }
    }
  };
}
class kt extends At {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
kt.prototype.elementClass = "";
kt.prototype.toDOM = void 0;
kt.prototype.mapMode = pe.TrackBefore;
kt.prototype.startSide = kt.prototype.endSide = -1;
kt.prototype.point = !0;
const Sr = /* @__PURE__ */ C.define(), P0 = /* @__PURE__ */ C.define(), k0 = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => j.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {},
  side: "before"
}, fn = /* @__PURE__ */ C.define();
function w0(i) {
  return [EO(), fn.of({ ...k0, ...i })];
}
const kh = /* @__PURE__ */ C.define({
  combine: (i) => i.some((e) => e)
});
function EO(i) {
  return [
    v0
  ];
}
const v0 = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.view = i, this.domAfter = null, this.prevViewport = i.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = i.state.facet(fn).map((e) => new vh(i, e)), this.fixed = !i.state.facet(kh);
    for (let e of this.gutters)
      e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), i.scrollDOM.insertBefore(this.dom, i.contentDOM);
  }
  getDOMAfter() {
    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
  }
  update(i) {
    if (this.updateGutters(i)) {
      let e = this.prevViewport, t = i.view.viewport, n = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(n < (t.to - t.from) * 0.8);
    }
    if (i.geometryChanged) {
      let e = this.view.contentHeight / this.view.scaleY + "px";
      this.dom.style.minHeight = e, this.domAfter && (this.domAfter.style.minHeight = e);
    }
    this.view.state.facet(kh) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = i.view.viewport;
  }
  syncGutters(i) {
    let e = this.dom.nextSibling;
    i && (this.dom.remove(), this.domAfter && this.domAfter.remove());
    let t = j.iter(this.view.state.facet(Sr), this.view.viewport.from), n = [], r = this.gutters.map((s) => new T0(s, this.view.viewport, -this.view.documentPadding.top));
    for (let s of this.view.viewportLineBlocks)
      if (n.length && (n = []), Array.isArray(s.type)) {
        let o = !0;
        for (let l of s.type)
          if (l.type == me.Text && o) {
            Ko(t, n, l.from);
            for (let a of r)
              a.line(this.view, l, n);
            o = !1;
          } else if (l.widget)
            for (let a of r)
              a.widget(this.view, l);
      } else if (s.type == me.Text) {
        Ko(t, n, s.from);
        for (let o of r)
          o.line(this.view, s, n);
      } else if (s.widget)
        for (let o of r)
          o.widget(this.view, s);
    for (let s of r)
      s.finish();
    i && (this.view.scrollDOM.insertBefore(this.dom, e), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
  }
  updateGutters(i) {
    let e = i.startState.facet(fn), t = i.state.facet(fn), n = i.docChanged || i.heightChanged || i.viewportChanged || !j.eq(i.startState.facet(Sr), i.state.facet(Sr), i.view.viewport.from, i.view.viewport.to);
    if (e == t)
      for (let r of this.gutters)
        r.update(i) && (n = !0);
    else {
      n = !0;
      let r = [];
      for (let s of t) {
        let o = e.indexOf(s);
        o < 0 ? r.push(new vh(this.view, s)) : (this.gutters[o].update(i), r.push(this.gutters[o]));
      }
      for (let s of this.gutters)
        s.dom.remove(), r.indexOf(s) < 0 && s.destroy();
      for (let s of r)
        s.config.side == "after" ? this.getDOMAfter().appendChild(s.dom) : this.dom.appendChild(s.dom);
      this.gutters = r;
    }
    return n;
  }
  destroy() {
    for (let i of this.gutters)
      i.destroy();
    this.dom.remove(), this.domAfter && this.domAfter.remove();
  }
}, {
  provide: (i) => k.scrollMargins.of((e) => {
    let t = e.plugin(i);
    if (!t || t.gutters.length == 0 || !t.fixed)
      return null;
    let n = t.dom.offsetWidth * e.scaleX, r = t.domAfter ? t.domAfter.offsetWidth * e.scaleX : 0;
    return e.textDirection == U.LTR ? { left: n, right: r } : { right: n, left: r };
  })
});
function wh(i) {
  return Array.isArray(i) ? i : [i];
}
function Ko(i, e, t) {
  for (; i.value && i.from <= t; )
    i.from == t && e.push(i.value), i.next();
}
class T0 {
  constructor(e, t, n) {
    this.gutter = e, this.height = n, this.i = 0, this.cursor = j.iter(e.markers, t.from);
  }
  addElement(e, t, n) {
    let { gutter: r } = this, s = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == r.elements.length) {
      let l = new LO(e, o, s, n);
      r.elements.push(l), r.dom.appendChild(l.dom);
    } else
      r.elements[this.i].update(e, o, s, n);
    this.height = t.bottom, this.i++;
  }
  line(e, t, n) {
    let r = [];
    Ko(this.cursor, r, t.from), n.length && (r = r.concat(n));
    let s = this.gutter.config.lineMarker(e, t, r);
    s && r.unshift(s);
    let o = this.gutter;
    r.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, r);
  }
  widget(e, t) {
    let n = this.gutter.config.widgetMarker(e, t.widget, t), r = n ? [n] : null;
    for (let s of e.state.facet(P0)) {
      let o = s(e, t.widget, t);
      o && (r || (r = [])).push(o);
    }
    r && this.addElement(e, t, r);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class vh {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let n in t.domEventHandlers)
      this.dom.addEventListener(n, (r) => {
        let s = r.target, o;
        if (s != this.dom && this.dom.contains(s)) {
          for (; s.parentNode != this.dom; )
            s = s.parentNode;
          let a = s.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = r.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[n](e, l, r) && r.preventDefault();
      });
    this.markers = wh(t.markers(e)), t.initialSpacer && (this.spacer = new LO(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = wh(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let r = this.config.updateSpacer(this.spacer.markers[0], e);
      r != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [r]);
    }
    let n = e.view.viewport;
    return !j.eq(this.markers, t, n.from, n.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class LO {
  constructor(e, t, n, r) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, n, r);
  }
  update(e, t, n, r) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != n && (this.dom.style.marginTop = (this.above = n) ? n + "px" : ""), C0(this.markers, r) || this.setMarkers(e, r);
  }
  setMarkers(e, t) {
    let n = "cm-gutterElement", r = this.dom.firstChild;
    for (let s = 0, o = 0; ; ) {
      let l = o, a = s < t.length ? t[s++] : null, h = !1;
      if (a) {
        let c = a.elementClass;
        c && (n += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(a)) {
            l = f, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(r);
          let f = r.nextSibling;
          r.remove(), r = f;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? r = r.nextSibling : this.dom.insertBefore(a.toDOM(e), r)), h && o++;
    }
    this.dom.className = n, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function C0(i, e) {
  if (i.length != e.length)
    return !1;
  for (let t = 0; t < i.length; t++)
    if (!i[t].compare(e[t]))
      return !1;
  return !0;
}
const X0 = /* @__PURE__ */ C.define(), Z0 = /* @__PURE__ */ C.define(), Qi = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let n = Object.assign({}, e);
        for (let r in t) {
          let s = n[r], o = t[r];
          n[r] = s ? (l, a, h) => s(l, a, h) || o(l, a, h) : o;
        }
        return n;
      }
    });
  }
});
class Ys extends kt {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function _s(i, e) {
  return i.state.facet(Qi).formatNumber(e, i.state);
}
const R0 = /* @__PURE__ */ fn.compute([Qi], (i) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(X0);
  },
  lineMarker(e, t, n) {
    return n.some((r) => r.toDOM) ? null : new Ys(_s(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: (e, t, n) => {
    for (let r of e.state.facet(Z0)) {
      let s = r(e, t, n);
      if (s)
        return s;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(Qi) != e.state.facet(Qi),
  initialSpacer(e) {
    return new Ys(_s(e, Th(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let n = _s(t.view, Th(t.view.state.doc.lines));
    return n == e.number ? e : new Ys(n);
  },
  domEventHandlers: i.facet(Qi).domEventHandlers,
  side: "before"
}));
function A0(i = {}) {
  return [
    Qi.of(i),
    EO(),
    R0
  ];
}
function Th(i) {
  let e = 9;
  for (; e < i; )
    e = e * 10 + 9;
  return e;
}
const M0 = /* @__PURE__ */ new class extends kt {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), W0 = /* @__PURE__ */ Sr.compute(["selection"], (i) => {
  let e = [], t = -1;
  for (let n of i.selection.ranges) {
    let r = i.doc.lineAt(n.head).from;
    r > t && (t = r, e.push(M0.range(r)));
  }
  return j.of(e);
});
function q0() {
  return W0;
}
const BO = 1024;
let Y0 = 0;
class ze {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class Y {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = Y0++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    }), this.combine = e.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = we.match(e)), (t) => {
      let n = e(t);
      return n === void 0 ? null : [this, n];
    };
  }
}
Y.closedBy = new Y({ deserialize: (i) => i.split(" ") });
Y.openedBy = new Y({ deserialize: (i) => i.split(" ") });
Y.group = new Y({ deserialize: (i) => i.split(" ") });
Y.isolate = new Y({ deserialize: (i) => {
  if (i && i != "rtl" && i != "ltr" && i != "auto")
    throw new RangeError("Invalid value for isolate: " + i);
  return i || "auto";
} });
Y.contextHash = new Y({ perNode: !0 });
Y.lookAhead = new Y({ perNode: !0 });
Y.mounted = new Y({ perNode: !0 });
class wi {
  constructor(e, t, n, r = !1) {
    this.tree = e, this.overlay = t, this.parser = n, this.bracketed = r;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[Y.mounted.id];
  }
}
const _0 = /* @__PURE__ */ Object.create(null);
class we {
  /**
  @internal
  */
  constructor(e, t, n, r = 0) {
    this.name = e, this.props = t, this.id = n, this.flags = r;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : _0, n = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), r = new we(e.name || "", t, e.id, n);
    if (e.props) {
      for (let s of e.props)
        if (Array.isArray(s) || (s = s(r)), s) {
          if (s[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[s[0].id] = s[1];
        }
    }
    return r;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(Y.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let n in e)
      for (let r of n.split(" "))
        t[r] = e[n];
    return (n) => {
      for (let r = n.prop(Y.group), s = -1; s < (r ? r.length : 0); s++) {
        let o = t[s < 0 ? n.name : r[s]];
        if (o)
          return o;
      }
    };
  }
}
we.none = new we(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Gl {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let n of this.types) {
      let r = null;
      for (let s of e) {
        let o = s(n);
        if (o) {
          r || (r = Object.assign({}, n.props));
          let l = o[1], a = o[0];
          a.combine && a.id in r && (l = a.combine(r[a.id], l)), r[a.id] = l;
        }
      }
      t.push(r ? new we(n.name, r, n.id, n.flags) : n);
    }
    return new Gl(t);
  }
}
const rr = /* @__PURE__ */ new WeakMap(), Ch = /* @__PURE__ */ new WeakMap();
var B;
(function(i) {
  i[i.ExcludeBuffers = 1] = "ExcludeBuffers", i[i.IncludeAnonymous = 2] = "IncludeAnonymous", i[i.IgnoreMounts = 4] = "IgnoreMounts", i[i.IgnoreOverlays = 8] = "IgnoreOverlays", i[i.EnterBracketed = 16] = "EnterBracketed";
})(B || (B = {}));
class J {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, n, r, s) {
    if (this.type = e, this.children = t, this.positions = n, this.length = r, this.props = null, s && s.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of s)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = wi.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let n of this.children) {
      let r = n.toString();
      r && (t && (t += ","), t += r);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new qr(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, n = 0) {
    let r = rr.get(this) || this.topNode, s = new qr(r);
    return s.moveTo(e, t), rr.set(this, s._tree), s;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new Qe(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let n = yn(rr.get(this) || this.topNode, e, t, !1);
    return rr.set(this, n), n;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let n = yn(Ch.get(this) || this.topNode, e, t, !0);
    return Ch.set(this, n), n;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return V0(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: n, from: r = 0, to: s = this.length } = e, o = e.mode || 0, l = (o & B.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | B.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= s && a.to >= r && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && n && (l || !a.type.isAnonymous) && n(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Fl(we.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, n, r) => new J(this.type, t, n, r, this.propValues), e.makeTree || ((t, n, r) => new J(we.none, t, n, r)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return D0(e);
  }
}
J.empty = new J(we.none, [], [], 0);
class Nl {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Nl(this.buffer, this.index);
  }
}
class Yt {
  /**
  Create a tree buffer.
  */
  constructor(e, t, n) {
    this.buffer = e, this.length = t, this.set = n;
  }
  /**
  @internal
  */
  get type() {
    return we.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], n = this.buffer[e + 3], r = this.set.types[t], s = r.name;
    if (/\W/.test(s) && !r.isError && (s = JSON.stringify(s)), e += 4, n == e)
      return s;
    let o = [];
    for (; e < n; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return s + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, n, r, s) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(IO(s, r, o[a + 1], o[a + 2]) && (l = a, n > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, n) {
    let r = this.buffer, s = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      s[a++] = r[l++], s[a++] = r[l++] - n;
      let h = s[a++] = r[l++] - n;
      s[a++] = r[l++] - e, o = Math.max(o, h);
    }
    return new Yt(s, o, this.set);
  }
}
function IO(i, e, t, n) {
  switch (i) {
    case -2:
      return t < e;
    case -1:
      return n >= e && t < e;
    case 0:
      return t < e && n > e;
    case 1:
      return t <= e && n > e;
    case 2:
      return n > e;
    case 4:
      return !0;
  }
}
function yn(i, e, t, n) {
  for (var r; i.from == i.to || (t < 1 ? i.from >= e : i.from > e) || (t > -1 ? i.to <= e : i.to < e); ) {
    let o = !n && i instanceof Qe && i.index < 0 ? null : i.parent;
    if (!o)
      return i;
    i = o;
  }
  let s = n ? 0 : B.IgnoreOverlays;
  if (n)
    for (let o = i, l = o.parent; l; o = l, l = o.parent)
      o instanceof Qe && o.index < 0 && ((r = l.enter(e, t, s)) === null || r === void 0 ? void 0 : r.from) != o.from && (i = l);
  for (; ; ) {
    let o = i.enter(e, t, s);
    if (!o)
      return i;
    i = o;
  }
}
class GO {
  cursor(e = 0) {
    return new qr(this, e);
  }
  getChild(e, t = null, n = null) {
    let r = Xh(this, e, t, n);
    return r.length ? r[0] : null;
  }
  getChildren(e, t = null, n = null) {
    return Xh(this, e, t, n);
  }
  resolve(e, t = 0) {
    return yn(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return yn(this, e, t, !0);
  }
  matchContext(e) {
    return Jo(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), n = this;
    for (; t; ) {
      let r = t.lastChild;
      if (!r || r.to != t.to)
        break;
      r.type.isError && r.from == r.to ? (n = t, t = r.prevSibling) : t = r;
    }
    return n;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class Qe extends GO {
  constructor(e, t, n, r) {
    super(), this._tree = e, this.from = t, this.index = n, this._parent = r;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, n, r, s = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let c = l[e], f = a[e] + o.from, O;
        if (!(!(s & B.EnterBracketed && c instanceof J && (O = wi.get(c)) && !O.overlay && O.bracketed && n >= f && n <= f + c.length) && !IO(r, n, f, f + c.length))) {
          if (c instanceof Yt) {
            if (s & B.ExcludeBuffers)
              continue;
            let u = c.findChild(0, c.buffer.length, t, n - f, r);
            if (u > -1)
              return new at(new j0(o, c, e, f), null, u);
          } else if (s & B.IncludeAnonymous || !c.type.isAnonymous || Ul(c)) {
            let u;
            if (!(s & B.IgnoreMounts) && (u = wi.get(c)) && !u.overlay)
              return new Qe(u.tree, f, e, o);
            let d = new Qe(c, f, e, o);
            return s & B.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(t < 0 ? c.children.length - 1 : 0, t, n, r, s);
          }
        }
      }
      if (s & B.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this._tree.prop(e);
  }
  enter(e, t, n = 0) {
    let r;
    if (!(n & B.IgnoreOverlays) && (r = wi.get(this._tree)) && r.overlay) {
      let s = e - this.from, o = n & B.EnterBracketed && r.bracketed;
      for (let { from: l, to: a } of r.overlay)
        if ((t > 0 || o ? l <= s : l < s) && (t < 0 || o ? a >= s : a > s))
          return new Qe(r.tree, r.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, n);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function Xh(i, e, t, n) {
  let r = i.cursor(), s = [];
  if (!r.firstChild())
    return s;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = r.type.is(t), !r.nextSibling())
        return s;
  }
  for (; ; ) {
    if (n != null && r.type.is(n))
      return s;
    if (r.type.is(e) && s.push(r.node), !r.nextSibling())
      return n == null ? s : [];
  }
}
function Jo(i, e, t = e.length - 1) {
  for (let n = i; t >= 0; n = n.parent) {
    if (!n)
      return !1;
    if (!n.type.isAnonymous) {
      if (e[t] && e[t] != n.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class j0 {
  constructor(e, t, n, r) {
    this.parent = e, this.buffer = t, this.index = n, this.start = r;
  }
}
class at extends GO {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, n) {
    super(), this.context = e, this._parent = t, this.index = n, this.type = e.buffer.set.types[e.buffer.buffer[n]];
  }
  child(e, t, n) {
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.context.start, n);
    return s < 0 ? null : new at(this.context, this, s);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this.type.prop(e);
  }
  enter(e, t, n = 0) {
    if (n & B.ExcludeBuffers)
      return null;
    let { buffer: r } = this.context, s = r.findChild(this.index + 4, r.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return s < 0 ? null : new at(this.context, this, s);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new at(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new at(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: n } = this.context, r = this.index + 4, s = n.buffer[this.index + 3];
    if (s > r) {
      let o = n.buffer[this.index + 1];
      e.push(n.slice(r, s, o)), t.push(0);
    }
    return new J(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function NO(i) {
  if (!i.length)
    return null;
  let e = 0, t = i[0];
  for (let s = 1; s < i.length; s++) {
    let o = i[s];
    (o.from > t.from || o.to < t.to) && (t = o, e = s);
  }
  let n = t instanceof Qe && t.index < 0 ? null : t.parent, r = i.slice();
  return n ? r[e] = n : r.splice(e, 1), new z0(r, t);
}
class z0 {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return NO(this.heads);
  }
}
function V0(i, e, t) {
  let n = i.resolveInner(e, t), r = null;
  for (let s = n instanceof Qe ? n : n.context.parent; s; s = s.parent)
    if (s.index < 0) {
      let o = s.parent;
      (r || (r = [n])).push(o.resolve(e, t)), s = o;
    } else {
      let o = wi.get(s.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new Qe(o.tree, o.overlay[0].from + s.from, -1, s);
        (r || (r = [n])).push(yn(l, e, t, !1));
      }
    }
  return r ? NO(r) : n;
}
class qr {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~B.EnterBracketed, e instanceof Qe)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let n = e._parent; n; n = n._parent)
        this.stack.unshift(n.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: n, buffer: r } = this.buffer;
    return this.type = t || r.set.types[r.buffer[e]], this.from = n + r.buffer[e + 1], this.to = n + r.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof Qe ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, n) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, n, this.mode));
    let { buffer: r } = this.buffer, s = r.findChild(this.index + 4, r.buffer[this.index + 3], e, t - this.buffer.start, n);
    return s < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(s));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, n = this.mode) {
    return this.buffer ? n & B.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, n));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & B.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & B.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, n = this.stack.length - 1;
    if (e < 0) {
      let r = n < 0 ? 0 : this.stack[n] + 4;
      if (this.index != r)
        return this.yieldBuf(t.findChild(
          r,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let r = t.buffer[this.index + 3];
      if (r < (n < 0 ? t.buffer.length : t.buffer[this.stack[n] + 3]))
        return this.yieldBuf(r);
    }
    return n < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, n, { buffer: r } = this;
    if (r) {
      if (e > 0) {
        if (this.index < r.buffer.buffer.length)
          return !1;
      } else
        for (let s = 0; s < this.index; s++)
          if (r.buffer.buffer[s + 3] < this.index)
            return !1;
      ({ index: t, parent: n } = r);
    } else
      ({ index: t, _parent: n } = this._tree);
    for (; n; { index: t, _parent: n } = n)
      if (t > -1)
        for (let s = t + e, o = e < 0 ? -1 : n._tree.children.length; s != o; s += e) {
          let l = n._tree.children[s];
          if (this.mode & B.IncludeAnonymous || l instanceof Yt || !l.type.isAnonymous || Ul(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, n = 0;
    if (e && e.context == this.buffer)
      e: for (let r = this.index, s = this.stack.length; s >= 0; ) {
        for (let o = e; o; o = o._parent)
          if (o.index == r) {
            if (r == this.index)
              return o;
            t = o, n = s + 1;
            break e;
          }
        r = this.stack[--s];
      }
    for (let r = n; r < this.stack.length; r++)
      t = new at(this.buffer, t, this.stack[r]);
    return this.bufferNode = new at(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let n = 0; ; ) {
      let r = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          n++;
          continue;
        }
        this.type.isAnonymous || (r = !0);
      }
      for (; ; ) {
        if (r && t && t(this), r = this.type.isAnonymous, !n)
          return;
        if (this.nextSibling())
          break;
        this.parent(), n--, r = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return Jo(this.node.parent, e);
    let { buffer: t } = this.buffer, { types: n } = t.set;
    for (let r = e.length - 1, s = this.stack.length - 1; r >= 0; s--) {
      if (s < 0)
        return Jo(this._tree, e, r);
      let o = n[t.buffer[this.stack[s]]];
      if (!o.isAnonymous) {
        if (e[r] && e[r] != o.name)
          return !1;
        r--;
      }
    }
    return !0;
  }
}
function Ul(i) {
  return i.children.some((e) => e instanceof Yt || !e.type.isAnonymous || Ul(e));
}
function D0(i) {
  var e;
  let { buffer: t, nodeSet: n, maxBufferLength: r = BO, reused: s = [], minRepeatType: o = n.types.length } = i, l = Array.isArray(t) ? new Nl(t, t.length) : t, a = n.types, h = 0, c = 0;
  function f(x, $, P, A, q, E) {
    let { id: W, start: R, end: z, size: _ } = l, L = c, ne = h;
    if (_ < 0)
      if (l.next(), _ == -1) {
        let Oe = s[W];
        P.push(Oe), A.push(R - x);
        return;
      } else if (_ == -3) {
        h = W;
        return;
      } else if (_ == -4) {
        c = W;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${_}`);
    let ae = a[W], ye, ee, fe = R - x;
    if (z - R <= r && (ee = g(l.pos - $, q))) {
      let Oe = new Uint16Array(ee.size - ee.skip), xe = l.pos - ee.size, Ae = Oe.length;
      for (; l.pos > xe; )
        Ae = S(ee.start, Oe, Ae);
      ye = new Yt(Oe, z - ee.start, n), fe = ee.start - x;
    } else {
      let Oe = l.pos - _;
      l.next();
      let xe = [], Ae = [], G = W >= o ? W : -1, Le = 0, Bt = z;
      for (; l.pos > Oe; )
        G >= 0 && l.id == G && l.size >= 0 ? (l.end <= Bt - r && (d(xe, Ae, R, Le, l.end, Bt, G, L, ne), Le = xe.length, Bt = l.end), l.next()) : E > 2500 ? O(R, Oe, xe, Ae) : f(R, Oe, xe, Ae, G, E + 1);
      if (G >= 0 && Le > 0 && Le < xe.length && d(xe, Ae, R, Le, R, Bt, G, L, ne), xe.reverse(), Ae.reverse(), G > -1 && Le > 0) {
        let Oi = u(ae, ne);
        ye = Fl(ae, xe, Ae, 0, xe.length, 0, z - R, Oi, Oi);
      } else
        ye = m(ae, xe, Ae, z - R, L - z, ne);
    }
    P.push(ye), A.push(fe);
  }
  function O(x, $, P, A) {
    let q = [], E = 0, W = -1;
    for (; l.pos > $; ) {
      let { id: R, start: z, end: _, size: L } = l;
      if (L > 4)
        l.next();
      else {
        if (W > -1 && z < W)
          break;
        W < 0 && (W = _ - r), q.push(R, z, _), E++, l.next();
      }
    }
    if (E) {
      let R = new Uint16Array(E * 4), z = q[q.length - 2];
      for (let _ = q.length - 3, L = 0; _ >= 0; _ -= 3)
        R[L++] = q[_], R[L++] = q[_ + 1] - z, R[L++] = q[_ + 2] - z, R[L++] = L;
      P.push(new Yt(R, q[2] - z, n)), A.push(z - x);
    }
  }
  function u(x, $) {
    return (P, A, q) => {
      let E = 0, W = P.length - 1, R, z;
      if (W >= 0 && (R = P[W]) instanceof J) {
        if (!W && R.type == x && R.length == q)
          return R;
        (z = R.prop(Y.lookAhead)) && (E = A[W] + R.length + z);
      }
      return m(x, P, A, q, E, $);
    };
  }
  function d(x, $, P, A, q, E, W, R, z) {
    let _ = [], L = [];
    for (; x.length > A; )
      _.push(x.pop()), L.push($.pop() + P - q);
    x.push(m(n.types[W], _, L, E - q, R - E, z)), $.push(q - P);
  }
  function m(x, $, P, A, q, E, W) {
    if (E) {
      let R = [Y.contextHash, E];
      W = W ? [R].concat(W) : [R];
    }
    if (q > 25) {
      let R = [Y.lookAhead, q];
      W = W ? [R].concat(W) : [R];
    }
    return new J(x, $, P, A, W);
  }
  function g(x, $) {
    let P = l.fork(), A = 0, q = 0, E = 0, W = P.end - r, R = { size: 0, start: 0, skip: 0 };
    e: for (let z = P.pos - x; P.pos > z; ) {
      let _ = P.size;
      if (P.id == $ && _ >= 0) {
        R.size = A, R.start = q, R.skip = E, E += 4, A += 4, P.next();
        continue;
      }
      let L = P.pos - _;
      if (_ < 0 || L < z || P.start < W)
        break;
      let ne = P.id >= o ? 4 : 0, ae = P.start;
      for (P.next(); P.pos > L; ) {
        if (P.size < 0)
          if (P.size == -3 || P.size == -4)
            ne += 4;
          else
            break e;
        else P.id >= o && (ne += 4);
        P.next();
      }
      q = ae, A += _, E += ne;
    }
    return ($ < 0 || A == x) && (R.size = A, R.start = q, R.skip = E), R.size > 4 ? R : void 0;
  }
  function S(x, $, P) {
    let { id: A, start: q, end: E, size: W } = l;
    if (l.next(), W >= 0 && A < o) {
      let R = P;
      if (W > 4) {
        let z = l.pos - (W - 4);
        for (; l.pos > z; )
          P = S(x, $, P);
      }
      $[--P] = R, $[--P] = E - x, $[--P] = q - x, $[--P] = A;
    } else W == -3 ? h = A : W == -4 && (c = A);
    return P;
  }
  let Q = [], y = [];
  for (; l.pos > 0; )
    f(i.start || 0, i.bufferStart || 0, Q, y, -1, 0);
  let w = (e = i.length) !== null && e !== void 0 ? e : Q.length ? y[0] + Q[0].length : 0;
  return new J(a[i.topID], Q.reverse(), y.reverse(), w);
}
const Zh = /* @__PURE__ */ new WeakMap();
function Qr(i, e) {
  if (!i.isAnonymous || e instanceof Yt || e.type != i)
    return 1;
  let t = Zh.get(e);
  if (t == null) {
    t = 1;
    for (let n of e.children) {
      if (n.type != i || !(n instanceof J)) {
        t = 1;
        break;
      }
      t += Qr(i, n);
    }
    Zh.set(e, t);
  }
  return t;
}
function Fl(i, e, t, n, r, s, o, l, a) {
  let h = 0;
  for (let d = n; d < r; d++)
    h += Qr(i, e[d]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], O = [];
  function u(d, m, g, S, Q) {
    for (let y = g; y < S; ) {
      let w = y, x = m[y], $ = Qr(i, d[y]);
      for (y++; y < S; y++) {
        let P = Qr(i, d[y]);
        if ($ + P >= c)
          break;
        $ += P;
      }
      if (y == w + 1) {
        if ($ > c) {
          let P = d[w];
          u(P.children, P.positions, 0, P.children.length, m[w] + Q);
          continue;
        }
        f.push(d[w]);
      } else {
        let P = m[y - 1] + d[y - 1].length - x;
        f.push(Fl(i, d, m, w, y, x, P, null, a));
      }
      O.push(x + Q - s);
    }
  }
  return u(e, t, n, r, 0), (l || a)(f, O, o);
}
class UO {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, n) {
    let r = this.map.get(e);
    r || this.map.set(e, r = /* @__PURE__ */ new Map()), r.set(t, n);
  }
  getBuffer(e, t) {
    let n = this.map.get(e);
    return n && n.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof at ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof Qe && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof at ? this.getBuffer(e.context.buffer, e.index) : e instanceof Qe ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class xt {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, n, r, s = !1, o = !1) {
    this.from = e, this.to = t, this.tree = n, this.offset = r, this.open = (s ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], n = !1) {
    let r = [new xt(0, e.length, e, 0, !1, n)];
    for (let s of t)
      s.to > e.length && r.push(s);
    return r;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, n = 128) {
    if (!t.length)
      return e;
    let r = [], s = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < t.length ? t[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= n)
        for (; o && o.from < f; ) {
          let O = o;
          if (a >= O.from || f <= O.to || h) {
            let u = Math.max(O.from, a) - h, d = Math.min(O.to, f) - h;
            O = u >= d ? null : new xt(u, d, O.tree, O.offset + h, l > 0, !!c);
          }
          if (O && r.push(O), o.to > f)
            break;
          o = s < e.length ? e[s++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return r;
  }
}
class FO {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, n) {
    return typeof e == "string" && (e = new E0(e)), n = n ? n.length ? n.map((r) => new ze(r.from, r.to)) : [new ze(0, 0)] : [new ze(0, e.length)], this.createParse(e, t || [], n);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, n) {
    let r = this.startParse(e, t, n);
    for (; ; ) {
      let s = r.advance();
      if (s)
        return s;
    }
  }
}
class E0 {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
function L0(i) {
  return (e, t, n, r) => new I0(e, i, t, n, r);
}
class Rh {
  constructor(e, t, n, r, s, o) {
    this.parser = e, this.parse = t, this.overlay = n, this.bracketed = r, this.target = s, this.from = o;
  }
}
function Ah(i) {
  if (!i.length || i.some((e) => e.from >= e.to))
    throw new RangeError("Invalid inner parse ranges given: " + JSON.stringify(i));
}
class B0 {
  constructor(e, t, n, r, s, o, l, a) {
    this.parser = e, this.predicate = t, this.mounts = n, this.index = r, this.start = s, this.bracketed = o, this.target = l, this.prev = a, this.depth = 0, this.ranges = [];
  }
}
const el = new Y({ perNode: !0 });
class I0 {
  constructor(e, t, n, r, s) {
    this.nest = t, this.input = n, this.fragments = r, this.ranges = s, this.inner = [], this.innerDone = 0, this.baseTree = null, this.stoppedAt = null, this.baseParse = e;
  }
  advance() {
    if (this.baseParse) {
      let n = this.baseParse.advance();
      if (!n)
        return null;
      if (this.baseParse = null, this.baseTree = n, this.startInner(), this.stoppedAt != null)
        for (let r of this.inner)
          r.parse.stopAt(this.stoppedAt);
    }
    if (this.innerDone == this.inner.length) {
      let n = this.baseTree;
      return this.stoppedAt != null && (n = new J(n.type, n.children, n.positions, n.length, n.propValues.concat([[el, this.stoppedAt]]))), n;
    }
    let e = this.inner[this.innerDone], t = e.parse.advance();
    if (t) {
      this.innerDone++;
      let n = Object.assign(/* @__PURE__ */ Object.create(null), e.target.props);
      n[Y.mounted.id] = new wi(t, e.overlay, e.parser, e.bracketed), e.target.props = n;
    }
    return null;
  }
  get parsedPos() {
    if (this.baseParse)
      return 0;
    let e = this.input.length;
    for (let t = this.innerDone; t < this.inner.length; t++)
      this.inner[t].from < e && (e = Math.min(e, this.inner[t].parse.parsedPos));
    return e;
  }
  stopAt(e) {
    if (this.stoppedAt = e, this.baseParse)
      this.baseParse.stopAt(e);
    else
      for (let t = this.innerDone; t < this.inner.length; t++)
        this.inner[t].parse.stopAt(e);
  }
  startInner() {
    let e = new U0(this.fragments), t = null, n = null, r = new qr(new Qe(this.baseTree, this.ranges[0].from, 0, null), B.IncludeAnonymous | B.IgnoreMounts);
    e: for (let s, o; ; ) {
      let l = !0, a;
      if (this.stoppedAt != null && r.from >= this.stoppedAt)
        l = !1;
      else if (e.hasNode(r)) {
        if (t) {
          let h = t.mounts.find((c) => c.frag.from <= r.from && c.frag.to >= r.to && c.mount.overlay);
          if (h)
            for (let c of h.mount.overlay) {
              let f = c.from + h.pos, O = c.to + h.pos;
              f >= r.from && O <= r.to && !t.ranges.some((u) => u.from < O && u.to > f) && t.ranges.push({ from: f, to: O });
            }
        }
        l = !1;
      } else if (n && (o = G0(n.ranges, r.from, r.to)))
        l = o != 2;
      else if (!r.type.isAnonymous && (s = this.nest(r, this.input)) && (r.from < r.to || !s.overlay)) {
        r.tree || (N0(r), t && t.depth++, n && n.depth++);
        let h = e.findMounts(r.from, s.parser);
        if (typeof s.overlay == "function")
          t = new B0(s.parser, s.overlay, h, this.inner.length, r.from, !!s.bracketed, r.tree, t);
        else {
          let c = qh(this.ranges, s.overlay || (r.from < r.to ? [new ze(r.from, r.to)] : []));
          c.length && Ah(c), (c.length || !s.overlay) && this.inner.push(new Rh(s.parser, c.length ? s.parser.startParse(this.input, Yh(h, c), c) : s.parser.startParse(""), s.overlay ? s.overlay.map((f) => new ze(f.from - r.from, f.to - r.from)) : null, !!s.bracketed, r.tree, c.length ? c[0].from : r.from)), s.overlay ? c.length && (n = { ranges: c, depth: 0, prev: n }) : l = !1;
        }
      } else if (t && (a = t.predicate(r)) && (a === !0 && (a = new ze(r.from, r.to)), a.from < a.to)) {
        let h = t.ranges.length - 1;
        h >= 0 && t.ranges[h].to == a.from ? t.ranges[h] = { from: t.ranges[h].from, to: a.to } : t.ranges.push(a);
      }
      if (l && r.firstChild())
        t && t.depth++, n && n.depth++;
      else
        for (; !r.nextSibling(); ) {
          if (!r.parent())
            break e;
          if (t && !--t.depth) {
            let h = qh(this.ranges, t.ranges);
            h.length && (Ah(h), this.inner.splice(t.index, 0, new Rh(t.parser, t.parser.startParse(this.input, Yh(t.mounts, h), h), t.ranges.map((c) => new ze(c.from - t.start, c.to - t.start)), t.bracketed, t.target, h[0].from))), t = t.prev;
          }
          n && !--n.depth && (n = n.prev);
        }
    }
  }
}
function G0(i, e, t) {
  for (let n of i) {
    if (n.from >= t)
      break;
    if (n.to > e)
      return n.from <= e && n.to >= t ? 2 : 1;
  }
  return 0;
}
function Mh(i, e, t, n, r, s) {
  if (e < t) {
    let o = i.buffer[e + 1];
    n.push(i.slice(e, t, o)), r.push(o - s);
  }
}
function N0(i) {
  let { node: e } = i, t = [], n = e.context.buffer;
  do
    t.push(i.index), i.parent();
  while (!i.tree);
  let r = i.tree, s = r.children.indexOf(n), o = r.children[s], l = o.buffer, a = [s];
  function h(c, f, O, u, d, m) {
    let g = t[m], S = [], Q = [];
    Mh(o, c, g, S, Q, u);
    let y = l[g + 1], w = l[g + 2];
    a.push(S.length);
    let x = m ? h(g + 4, l[g + 3], o.set.types[l[g]], y, w - y, m - 1) : e.toTree();
    return S.push(x), Q.push(y - u), Mh(o, l[g + 3], f, S, Q, u), new J(O, S, Q, d);
  }
  r.children[s] = h(0, l.length, we.none, 0, o.length, t.length - 1);
  for (let c of a) {
    let f = i.tree.children[c], O = i.tree.positions[c];
    i.yield(new Qe(f, O + i.from, c, i._tree));
  }
}
class Wh {
  constructor(e, t) {
    this.offset = t, this.done = !1, this.cursor = e.cursor(B.IncludeAnonymous | B.IgnoreMounts);
  }
  // Move to the first node (in pre-order) that starts at or after `pos`.
  moveTo(e) {
    let { cursor: t } = this, n = e - this.offset;
    for (; !this.done && t.from < n; )
      if (!(t.to >= e && t.enter(n, 1, B.IgnoreOverlays | B.ExcludeBuffers))) if (t.to <= e)
        t.next(!1) || (this.done = !0);
      else
        break;
  }
  hasNode(e) {
    if (this.moveTo(e.from), !this.done && this.cursor.from + this.offset == e.from && this.cursor.tree)
      for (let t = this.cursor.tree; ; ) {
        if (t == e.tree)
          return !0;
        if (t.children.length && t.positions[0] == 0 && t.children[0] instanceof J)
          t = t.children[0];
        else
          break;
      }
    return !1;
  }
}
let U0 = class {
  constructor(e) {
    var t;
    if (this.fragments = e, this.curTo = 0, this.fragI = 0, e.length) {
      let n = this.curFrag = e[0];
      this.curTo = (t = n.tree.prop(el)) !== null && t !== void 0 ? t : n.to, this.inner = new Wh(n.tree, -n.offset);
    } else
      this.curFrag = this.inner = null;
  }
  hasNode(e) {
    for (; this.curFrag && e.from >= this.curTo; )
      this.nextFrag();
    return this.curFrag && this.curFrag.from <= e.from && this.curTo >= e.to && this.inner.hasNode(e);
  }
  nextFrag() {
    var e;
    if (this.fragI++, this.fragI == this.fragments.length)
      this.curFrag = this.inner = null;
    else {
      let t = this.curFrag = this.fragments[this.fragI];
      this.curTo = (e = t.tree.prop(el)) !== null && e !== void 0 ? e : t.to, this.inner = new Wh(t.tree, -t.offset);
    }
  }
  findMounts(e, t) {
    var n;
    let r = [];
    if (this.inner) {
      this.inner.cursor.moveTo(e, 1);
      for (let s = this.inner.cursor.node; s; s = s.parent) {
        let o = (n = s.tree) === null || n === void 0 ? void 0 : n.prop(Y.mounted);
        if (o && o.parser == t)
          for (let l = this.fragI; l < this.fragments.length; l++) {
            let a = this.fragments[l];
            if (a.from >= s.to)
              break;
            a.tree == this.curFrag.tree && r.push({
              frag: a,
              pos: s.from - a.offset,
              mount: o
            });
          }
      }
    }
    return r;
  }
};
function qh(i, e) {
  let t = null, n = e;
  for (let r = 1, s = 0; r < i.length; r++) {
    let o = i[r - 1].to, l = i[r].from;
    for (; s < n.length; s++) {
      let a = n[s];
      if (a.from >= l)
        break;
      a.to <= o || (t || (n = t = e.slice()), a.from < o ? (t[s] = new ze(a.from, o), a.to > l && t.splice(s + 1, 0, new ze(l, a.to))) : a.to > l ? t[s--] = new ze(l, a.to) : t.splice(s--, 1));
    }
  }
  return n;
}
function F0(i, e, t, n) {
  let r = 0, s = 0, o = !1, l = !1, a = -1e9, h = [];
  for (; ; ) {
    let c = r == i.length ? 1e9 : o ? i[r].to : i[r].from, f = s == e.length ? 1e9 : l ? e[s].to : e[s].from;
    if (o != l) {
      let O = Math.max(a, t), u = Math.min(c, f, n);
      O < u && h.push(new ze(O, u));
    }
    if (a = Math.min(c, f), a == 1e9)
      break;
    c == a && (o ? (o = !1, r++) : o = !0), f == a && (l ? (l = !1, s++) : l = !0);
  }
  return h;
}
function Yh(i, e) {
  let t = [];
  for (let { pos: n, mount: r, frag: s } of i) {
    let o = n + (r.overlay ? r.overlay[0].from : 0), l = o + r.tree.length, a = Math.max(s.from, o), h = Math.min(s.to, l);
    if (r.overlay) {
      let c = r.overlay.map((O) => new ze(O.from + n, O.to + n)), f = F0(e, c, a, h);
      for (let O = 0, u = a; ; O++) {
        let d = O == f.length, m = d ? h : f[O].from;
        if (m > u && t.push(new xt(u, m, r.tree, -o, s.from >= u || s.openStart, s.to <= m || s.openEnd)), d)
          break;
        u = f[O].to;
      }
    } else
      t.push(new xt(a, h, r.tree, -o, s.from >= o || s.openStart, s.to <= l || s.openEnd));
  }
  return t;
}
let H0 = 0, St = class tl {
  /**
  @internal
  */
  constructor(e, t, n, r) {
    this.name = e, this.set = t, this.base = n, this.modified = r, this.id = H0++;
  }
  toString() {
    let { name: e } = this;
    for (let t of this.modified)
      t.name && (e = `${t.name}(${e})`);
    return e;
  }
  static define(e, t) {
    let n = typeof e == "string" ? e : "?";
    if (e instanceof tl && (t = e), t?.base)
      throw new Error("Can not derive from a modified tag");
    let r = new tl(n, [], null, []);
    if (r.set.push(r), t)
      for (let s of t.set)
        r.set.push(s);
    return r;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let t = new Yr(e);
    return (n) => n.modified.indexOf(t) > -1 ? n : Yr.get(n.base || n, n.modified.concat(t).sort((r, s) => r.id - s.id));
  }
}, K0 = 0;
class Yr {
  constructor(e) {
    this.name = e, this.instances = [], this.id = K0++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let n = t[0].instances.find((l) => l.base == e && J0(t, l.modified));
    if (n)
      return n;
    let r = [], s = new St(e.name, r, e, t);
    for (let l of t)
      l.instances.push(s);
    let o = eS(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          r.push(Yr.get(l, a));
    return s;
  }
}
function J0(i, e) {
  return i.length == e.length && i.every((t, n) => t == e[n]);
}
function eS(i) {
  let e = [[]];
  for (let t = 0; t < i.length; t++)
    for (let n = 0, r = e.length; n < r; n++)
      e.push(e[n].concat(i[t]));
  return e.sort((t, n) => n.length - t.length);
}
function Vt(i) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in i) {
    let n = i[t];
    Array.isArray(n) || (n = [n]);
    for (let r of t.split(" "))
      if (r) {
        let s = [], o = 2, l = r;
        for (let f = 0; ; ) {
          if (l == "..." && f > 0 && f + 3 == r.length) {
            o = 1;
            break;
          }
          let O = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!O)
            throw new RangeError("Invalid path: " + r);
          if (s.push(O[0] == "*" ? "" : O[0][0] == '"' ? JSON.parse(O[0]) : O[0]), f += O[0].length, f == r.length)
            break;
          let u = r[f++];
          if (f == r.length && u == "!") {
            o = 0;
            break;
          }
          if (u != "/")
            throw new RangeError("Invalid path: " + r);
          l = r.slice(f);
        }
        let a = s.length - 1, h = s[a];
        if (!h)
          throw new RangeError("Invalid path: " + r);
        let c = new xn(n, o, a > 0 ? s.slice(0, a) : null);
        e[h] = c.sort(e[h]);
      }
  }
  return HO.add(e);
}
const HO = new Y({
  combine(i, e) {
    let t, n, r;
    for (; i || e; ) {
      if (!i || e && i.depth >= e.depth ? (r = e, e = e.next) : (r = i, i = i.next), t && t.mode == r.mode && !r.context && !t.context)
        continue;
      let s = new xn(r.tags, r.mode, r.context);
      t ? t.next = s : n = s, t = s;
    }
    return n;
  }
});
class xn {
  constructor(e, t, n, r) {
    this.tags = e, this.mode = t, this.context = n, this.next = r;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
xn.empty = new xn([], 2, null);
function KO(i, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let s of i)
    if (!Array.isArray(s.tag))
      t[s.tag.id] = s.class;
    else
      for (let o of s.tag)
        t[o.id] = s.class;
  let { scope: n, all: r = null } = e || {};
  return {
    style: (s) => {
      let o = r;
      for (let l of s)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: n
  };
}
function tS(i, e) {
  let t = null;
  for (let n of i) {
    let r = n.style(e);
    r && (t = t ? t + " " + r : r);
  }
  return t;
}
function iS(i, e, t, n = 0, r = i.length) {
  let s = new nS(n, Array.isArray(e) ? e : [e], t);
  s.highlightRange(i.cursor(), n, r, "", s.highlighters), s.flush(r);
}
class nS {
  constructor(e, t, n) {
    this.at = e, this.highlighters = t, this.span = n, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, n, r, s) {
    let { type: o, from: l, to: a } = e;
    if (l >= n || a <= t)
      return;
    o.isTop && (s = this.highlighters.filter((u) => !u.scope || u.scope(o)));
    let h = r, c = rS(e) || xn.empty, f = tS(s, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (r += (r ? " " : "") + f)), this.startSpan(Math.max(t, l), h), c.opaque)
      return;
    let O = e.tree && e.tree.prop(Y.mounted);
    if (O && O.overlay) {
      let u = e.node.enter(O.overlay[0].from + l, 1), d = this.highlighters.filter((g) => !g.scope || g.scope(O.tree.type)), m = e.firstChild();
      for (let g = 0, S = l; ; g++) {
        let Q = g < O.overlay.length ? O.overlay[g] : null, y = Q ? Q.from + l : a, w = Math.max(t, S), x = Math.min(n, y);
        if (w < x && m)
          for (; e.from < x && (this.highlightRange(e, w, x, r, s), this.startSpan(Math.min(x, e.to), h), !(e.to >= y || !e.nextSibling())); )
            ;
        if (!Q || y > n)
          break;
        S = Q.to + l, S > t && (this.highlightRange(u.cursor(), Math.max(t, Q.from + l), Math.min(n, S), "", d), this.startSpan(Math.min(n, S), h));
      }
      m && e.parent();
    } else if (e.firstChild()) {
      O && (r = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= n)
            break;
          this.highlightRange(e, t, n, r, s), this.startSpan(Math.min(n, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function rS(i) {
  let e = i.type.prop(HO);
  for (; e && e.context && !i.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const v = St.define, sr = v(), vt = v(), _h = v(vt), jh = v(vt), Tt = v(), or = v(Tt), js = v(Tt), nt = v(), Nt = v(nt), tt = v(), it = v(), il = v(), Ui = v(il), lr = v(), p = {
  /**
  A comment.
  */
  comment: sr,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: v(sr),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: v(sr),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: v(sr),
  /**
  Any kind of identifier.
  */
  name: vt,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: v(vt),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: _h,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: v(_h),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: jh,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: v(jh),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: v(vt),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: v(vt),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: v(vt),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: v(vt),
  /**
  A literal value.
  */
  literal: Tt,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: or,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: v(or),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: v(or),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: v(or),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: js,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: v(js),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: v(js),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: v(Tt),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: v(Tt),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: v(Tt),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: v(Tt),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: v(Tt),
  /**
  A language keyword.
  */
  keyword: tt,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: v(tt),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: v(tt),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: v(tt),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: v(tt),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: v(tt),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: v(tt),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: v(tt),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: v(tt),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: v(tt),
  /**
  An operator.
  */
  operator: it,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: v(it),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: v(it),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: v(it),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: v(it),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: v(it),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: v(it),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: v(it),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: v(it),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: v(it),
  /**
  Program or markup punctuation.
  */
  punctuation: il,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: v(il),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: Ui,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: v(Ui),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: v(Ui),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: v(Ui),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: v(Ui),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: nt,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: Nt,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: v(Nt),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: v(Nt),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: v(Nt),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: v(Nt),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: v(Nt),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: v(Nt),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: v(nt),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: v(nt),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: v(nt),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: v(nt),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: v(nt),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: v(nt),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: v(nt),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: v(nt),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: v(),
  /**
  Deleted text.
  */
  deleted: v(),
  /**
  Changed text.
  */
  changed: v(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: v(),
  /**
  Metadata or meta-instruction.
  */
  meta: lr,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: v(lr),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: v(lr),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: v(lr),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: St.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: St.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: St.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: St.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: St.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: St.defineModifier("special")
};
for (let i in p) {
  let e = p[i];
  e instanceof St && (e.name = i);
}
KO([
  { tag: p.link, class: "tok-link" },
  { tag: p.heading, class: "tok-heading" },
  { tag: p.emphasis, class: "tok-emphasis" },
  { tag: p.strong, class: "tok-strong" },
  { tag: p.keyword, class: "tok-keyword" },
  { tag: p.atom, class: "tok-atom" },
  { tag: p.bool, class: "tok-bool" },
  { tag: p.url, class: "tok-url" },
  { tag: p.labelName, class: "tok-labelName" },
  { tag: p.inserted, class: "tok-inserted" },
  { tag: p.deleted, class: "tok-deleted" },
  { tag: p.literal, class: "tok-literal" },
  { tag: p.string, class: "tok-string" },
  { tag: p.number, class: "tok-number" },
  { tag: [p.regexp, p.escape, p.special(p.string)], class: "tok-string2" },
  { tag: p.variableName, class: "tok-variableName" },
  { tag: p.local(p.variableName), class: "tok-variableName tok-local" },
  { tag: p.definition(p.variableName), class: "tok-variableName tok-definition" },
  { tag: p.special(p.variableName), class: "tok-variableName2" },
  { tag: p.definition(p.propertyName), class: "tok-propertyName tok-definition" },
  { tag: p.typeName, class: "tok-typeName" },
  { tag: p.namespace, class: "tok-namespace" },
  { tag: p.className, class: "tok-className" },
  { tag: p.macroName, class: "tok-macroName" },
  { tag: p.propertyName, class: "tok-propertyName" },
  { tag: p.operator, class: "tok-operator" },
  { tag: p.comment, class: "tok-comment" },
  { tag: p.meta, class: "tok-meta" },
  { tag: p.invalid, class: "tok-invalid" },
  { tag: p.punctuation, class: "tok-punctuation" }
]);
var zs;
const bi = /* @__PURE__ */ new Y();
function JO(i) {
  return C.define({
    combine: i ? (e) => e.concat(i) : void 0
  });
}
const Hl = /* @__PURE__ */ new Y();
class Ge {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, n = [], r = "") {
    this.data = e, this.name = r, V.prototype.hasOwnProperty("tree") || Object.defineProperty(V.prototype, "tree", { get() {
      return H(this);
    } }), this.parser = t, this.extension = [
      _t.of(this),
      V.languageData.of((s, o, l) => {
        let a = zh(s, o, l), h = a.type.prop(bi);
        if (!h)
          return [];
        let c = s.facet(h), f = a.type.prop(Hl);
        if (f) {
          let O = a.resolve(o - a.from, l);
          for (let u of f)
            if (u.test(O, s)) {
              let d = s.facet(u.facet);
              return u.type == "replace" ? d : d.concat(c);
            }
        }
        return c;
      })
    ].concat(n);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, n = -1) {
    return zh(e, t, n).type.prop(bi) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(_t);
    if (t?.data == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let n = [], r = (s, o) => {
      if (s.prop(bi) == this.data) {
        n.push({ from: o, to: o + s.length });
        return;
      }
      let l = s.prop(Y.mounted);
      if (l) {
        if (l.tree.prop(bi) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              n.push({ from: a.from + o, to: a.to + o });
          else
            n.push({ from: o, to: o + s.length });
          return;
        } else if (l.overlay) {
          let a = n.length;
          if (r(l.tree, l.overlay[0].from + o), n.length > a)
            return;
        }
      }
      for (let a = 0; a < s.children.length; a++) {
        let h = s.children[a];
        h instanceof J && r(h, s.positions[a] + o);
      }
    };
    return r(H(e), 0), n;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
Ge.setState = /* @__PURE__ */ M.define();
function zh(i, e, t) {
  let n = i.facet(_t), r = H(i).topNode;
  if (!n || n.allowsNesting)
    for (let s = r; s; s = s.enter(e, t, B.ExcludeBuffers | B.EnterBracketed))
      s.type.isTop && (r = s);
  return r;
}
class ut extends Ge {
  constructor(e, t, n) {
    super(e, t, [], n), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = JO(e.languageData);
    return new ut(t, e.parser.configure({
      props: [bi.add((n) => n.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new ut(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function H(i) {
  let e = i.field(Ge.state, !1);
  return e ? e.tree : J.empty;
}
class sS {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let n = this.cursorPos - this.string.length;
    return e < n || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - n, t - n);
  }
}
let Fi = null;
class _r {
  constructor(e, t, n = [], r, s, o, l, a) {
    this.parser = e, this.state = t, this.fragments = n, this.tree = r, this.treeLen = s, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, n) {
    return new _r(e, t, [], J.empty, 0, n, [], null);
  }
  startParse() {
    return this.parser.startParse(new sS(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != J.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var n;
      if (typeof e == "number") {
        let r = Date.now() + e;
        e = () => Date.now() > r;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let r = this.parse.advance();
        if (r)
          if (this.fragments = this.withoutTempSkipped(xt.addTree(r, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (n = this.parse.stoppedAt) !== null && n !== void 0 ? n : this.state.doc.length, this.tree = r, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(xt.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = Fi;
    Fi = this;
    try {
      return e();
    } finally {
      Fi = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = Vh(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: n, tree: r, treeLen: s, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, c, f, O) => a.push({ fromA: h, toA: c, fromB: f, toB: O })), n = xt.applyChanges(n, a), r = J.empty, s = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = e.mapPos(h.from, 1), f = e.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new _r(this.parser, t, n, r, s, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let n = 0; n < this.skipped.length; n++) {
      let { from: r, to: s } = this.skipped[n];
      r < e.to && s > e.from && (this.fragments = Vh(this.fragments, r, s), this.skipped.splice(n--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends FO {
      createParse(t, n, r) {
        let s = r[0].from, o = r[r.length - 1].to;
        return {
          parsedPos: s,
          advance() {
            let a = Fi;
            if (a) {
              for (let h of r)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new J(we.none, [], [], o - s);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return Fi;
  }
}
function Vh(i, e, t) {
  return xt.applyChanges(i, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Wi {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), n = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, n) || t.takeTree(), new Wi(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), n = _r.create(e.facet(_t).parser, e, { from: 0, to: t });
    return n.work(20, t) || n.takeTree(), new Wi(n);
  }
}
Ge.state = /* @__PURE__ */ ge.define({
  create: Wi.init,
  update(i, e) {
    for (let t of e.effects)
      if (t.is(Ge.setState))
        return t.value;
    return e.startState.facet(_t) != e.state.facet(_t) ? Wi.init(e.state) : i.apply(e);
  }
});
let eu = (i) => {
  let e = setTimeout(
    () => i(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (eu = (i) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(i, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const Vs = typeof navigator < "u" && (!((zs = navigator.scheduling) === null || zs === void 0) && zs.isInputPending) ? () => navigator.scheduling.isInputPending() : null, oS = /* @__PURE__ */ ie.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(Ge.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(Ge.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = eu(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: n, viewport: { to: r } } = this.view, s = n.field(Ge.state);
    if (s.tree == s.context.tree && s.context.isDone(
      r + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !Vs ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = s.context.treeLen < r && n.doc.length > r + 1e3, a = s.context.work(() => Vs && Vs() || Date.now() > o, r + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (s.context.takeTree(), this.view.dispatch({ effects: Ge.setState.of(new Wi(s.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(s.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => Ze(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), _t = /* @__PURE__ */ C.define({
  combine(i) {
    return i.length ? i[0] : null;
  },
  enables: (i) => [
    Ge.state,
    oS,
    k.contentAttributes.compute([i], (e) => {
      let t = e.facet(i);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class fi {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
const lS = /* @__PURE__ */ C.define(), Yn = /* @__PURE__ */ C.define({
  combine: (i) => {
    if (!i.length)
      return "  ";
    let e = i[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(i[0]));
    return e;
  }
});
function jr(i) {
  let e = i.facet(Yn);
  return e.charCodeAt(0) == 9 ? i.tabSize * e.length : e.length;
}
function $n(i, e) {
  let t = "", n = i.tabSize, r = i.facet(Yn)[0];
  if (r == "	") {
    for (; e >= n; )
      t += "	", e -= n;
    r = " ";
  }
  for (let s = 0; s < e; s++)
    t += r;
  return t;
}
function Kl(i, e) {
  i instanceof V && (i = new Os(i));
  for (let n of i.state.facet(lS)) {
    let r = n(i, e);
    if (r !== void 0)
      return r;
  }
  let t = H(i.state);
  return t.length >= e ? aS(i, t, e) : null;
}
class Os {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = jr(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let n = this.state.doc.lineAt(e), { simulateBreak: r, simulateDoubleBreak: s } = this.options;
    return r != null && r >= n.from && r <= n.to ? s && r == e ? { text: "", from: e } : (t < 0 ? r < e : r <= e) ? { text: n.text.slice(r - n.from), from: r } : { text: n.text.slice(0, r - n.from), from: n.from } : n;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: n, from: r } = this.lineAt(e, t);
    return n.slice(e - r, Math.min(n.length, e + 100 - r));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: n, from: r } = this.lineAt(e, t), s = this.countColumn(n, e - r), o = this.options.overrideIndentation ? this.options.overrideIndentation(r) : -1;
    return o > -1 && (s += o - this.countColumn(n, n.search(/\S|$/))), s;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return zi(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: n, from: r } = this.lineAt(e, t), s = this.options.overrideIndentation;
    if (s) {
      let o = s(r);
      if (o > -1)
        return o;
    }
    return this.countColumn(n, n.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Dt = /* @__PURE__ */ new Y();
function aS(i, e, t) {
  let n = e.resolveStack(t), r = e.resolveInner(t, -1).resolve(t, 0).enterUnfinishedNodesBefore(t);
  if (r != n.node) {
    let s = [];
    for (let o = r; o && !(o.from < n.node.from || o.to > n.node.to || o.from == n.node.from && o.type == n.node.type); o = o.parent)
      s.push(o);
    for (let o = s.length - 1; o >= 0; o--)
      n = { node: s[o], next: n };
  }
  return tu(n, i, t);
}
function tu(i, e, t) {
  for (let n = i; n; n = n.next) {
    let r = cS(n.node);
    if (r)
      return r(Jl.create(e, t, n));
  }
  return 0;
}
function hS(i) {
  return i.pos == i.options.simulateBreak && i.options.simulateDoubleBreak;
}
function cS(i) {
  let e = i.type.prop(Dt);
  if (e)
    return e;
  let t = i.firstChild, n;
  if (t && (n = t.type.prop(Y.closedBy))) {
    let r = i.lastChild, s = r && n.indexOf(r.name) > -1;
    return (o) => iu(o, !0, 1, void 0, s && !hS(o) ? r.from : void 0);
  }
  return i.parent == null ? fS : null;
}
function fS() {
  return 0;
}
class Jl extends Os {
  constructor(e, t, n) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = n;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, n) {
    return new Jl(e, t, n);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let n = e.resolve(t.from);
      for (; n.parent && n.parent.from == n.from; )
        n = n.parent;
      if (OS(n, e))
        break;
      t = this.state.doc.lineAt(n.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return tu(this.context.next, this.base, this.pos);
  }
}
function OS(i, e) {
  for (let t = e; t; t = t.parent)
    if (i == t)
      return !0;
  return !1;
}
function uS(i) {
  let e = i.node, t = e.childAfter(e.from), n = e.lastChild;
  if (!t)
    return null;
  let r = i.options.simulateBreak, s = i.state.doc.lineAt(t.from), o = r == null || r <= s.from ? s.to : Math.min(s.to, r);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == n)
      return null;
    if (!a.type.isSkipped) {
      if (a.from >= o)
        return null;
      let h = /^ */.exec(s.text.slice(t.to - s.from))[0].length;
      return { from: t.from, to: t.to + h };
    }
    l = a.to;
  }
}
function nl({ closing: i, align: e = !0, units: t = 1 }) {
  return (n) => iu(n, e, t, i);
}
function iu(i, e, t, n, r) {
  let s = i.textAfter, o = s.match(/^\s*/)[0].length, l = n && s.slice(o, o + n.length) == n || r == i.pos + o, a = e ? uS(i) : null;
  return a ? l ? i.column(a.from) : i.column(a.to) : i.baseIndent + (l ? 0 : i.unit * t);
}
const dS = (i) => i.baseIndent;
function si({ except: i, units: e = 1 } = {}) {
  return (t) => {
    let n = i && i.test(t.textAfter);
    return t.baseIndent + (n ? 0 : e * t.unit);
  };
}
const pS = 200;
function mS() {
  return V.transactionFilter.of((i) => {
    if (!i.docChanged || !i.isUserEvent("input.type") && !i.isUserEvent("input.complete"))
      return i;
    let e = i.startState.languageDataAt("indentOnInput", i.startState.selection.main.head);
    if (!e.length)
      return i;
    let t = i.newDoc, { head: n } = i.newSelection.main, r = t.lineAt(n);
    if (n > r.from + pS)
      return i;
    let s = t.sliceString(r.from, n);
    if (!e.some((h) => h.test(s)))
      return i;
    let { state: o } = i, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let c = o.doc.lineAt(h);
      if (c.from == l)
        continue;
      l = c.from;
      let f = Kl(o, c.from);
      if (f == null)
        continue;
      let O = /^\s*/.exec(c.text)[0], u = $n(o, f);
      O != u && a.push({ from: c.from, to: c.from + O.length, insert: u });
    }
    return a.length ? [i, { changes: a, sequential: !0 }] : i;
  });
}
const gS = /* @__PURE__ */ C.define(), Et = /* @__PURE__ */ new Y();
function us(i) {
  let e = i.firstChild, t = i.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? i.to : t.from } : null;
}
function SS(i, e, t) {
  let n = H(i);
  if (n.length < t)
    return null;
  let r = n.resolveStack(t, 1), s = null;
  for (let o = r; o; o = o.next) {
    let l = o.node;
    if (l.to <= t || l.from > t)
      continue;
    if (s && l.from < e)
      break;
    let a = l.type.prop(Et);
    if (a && (l.to < n.length - 50 || n.length == i.doc.length || !QS(l))) {
      let h = a(l, i);
      h && h.from <= t && h.from >= e && h.to > t && (s = h);
    }
  }
  return s;
}
function QS(i) {
  let e = i.lastChild;
  return e && e.to == i.to && e.type.isError;
}
function zr(i, e, t) {
  for (let n of i.facet(gS)) {
    let r = n(i, e, t);
    if (r)
      return r;
  }
  return SS(i, e, t);
}
function nu(i, e) {
  let t = e.mapPos(i.from, 1), n = e.mapPos(i.to, -1);
  return t >= n ? void 0 : { from: t, to: n };
}
const ds = /* @__PURE__ */ M.define({ map: nu }), _n = /* @__PURE__ */ M.define({ map: nu });
function ru(i) {
  let e = [];
  for (let { head: t } of i.state.selection.ranges)
    e.some((n) => n.from <= t && n.to >= t) || e.push(i.lineBlockAt(t));
  return e;
}
const ci = /* @__PURE__ */ ge.define({
  create() {
    return Z.none;
  },
  update(i, e) {
    e.isUserEvent("delete") && e.changes.iterChangedRanges((n, r) => i = Dh(i, n, r)), i = i.map(e.changes);
    let t = [];
    for (let n of e.effects)
      n.is(ds) && !bS(i, n.value.from, n.value.to) ? t.push(n.value) : n.is(_n) && (i = i.update({
        filter: (r, s) => n.value.from != r || n.value.to != s,
        filterFrom: n.value.from,
        filterTo: n.value.to
      }));
    if (t.length) {
      let { preparePlaceholder: n } = e.state.facet(lu), r = t.map((s) => (n ? Z.replace({ widget: new vS(n(e.state, s)) }) : Eh).range(s.from, s.to));
      i = i.update({ add: r });
    }
    return e.selection && (i = Dh(i, e.selection.main.head)), i;
  },
  provide: (i) => k.decorations.from(i),
  toJSON(i, e) {
    let t = [];
    return i.between(0, e.doc.length, (n, r) => {
      t.push(n, r);
    }), t;
  },
  fromJSON(i) {
    if (!Array.isArray(i) || i.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < i.length; ) {
      let n = i[t++], r = i[t++];
      if (typeof n != "number" || typeof r != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(Eh.range(n, r));
    }
    return Z.set(e, !0);
  }
});
function Dh(i, e, t = e) {
  let n = !1;
  return i.between(e, t, (r, s) => {
    r < t && s > e && (n = !0);
  }), n ? i.update({
    filterFrom: e,
    filterTo: t,
    filter: (r, s) => r >= t || s <= e
  }) : i;
}
function Vr(i, e, t) {
  var n;
  let r = null;
  return (n = i.field(ci, !1)) === null || n === void 0 || n.between(e, t, (s, o) => {
    (!r || r.from > s) && (r = { from: s, to: o });
  }), r;
}
function bS(i, e, t) {
  let n = !1;
  return i.between(e, e, (r, s) => {
    r == e && s == t && (n = !0);
  }), n;
}
function su(i, e) {
  return i.field(ci, !1) ? e : e.concat(M.appendConfig.of(au()));
}
const yS = (i) => {
  for (let e of ru(i)) {
    let t = zr(i.state, e.from, e.to);
    if (t)
      return i.dispatch({ effects: su(i.state, [ds.of(t), ou(i, t)]) }), !0;
  }
  return !1;
}, xS = (i) => {
  if (!i.state.field(ci, !1))
    return !1;
  let e = [];
  for (let t of ru(i)) {
    let n = Vr(i.state, t.from, t.to);
    n && e.push(_n.of(n), ou(i, n, !1));
  }
  return e.length && i.dispatch({ effects: e }), e.length > 0;
};
function ou(i, e, t = !0) {
  let n = i.state.doc.lineAt(e.from).number, r = i.state.doc.lineAt(e.to).number;
  return k.announce.of(`${i.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${n} ${i.state.phrase("to")} ${r}.`);
}
const $S = (i) => {
  let { state: e } = i, t = [];
  for (let n = 0; n < e.doc.length; ) {
    let r = i.lineBlockAt(n), s = zr(e, r.from, r.to);
    s && t.push(ds.of(s)), n = (s ? i.lineBlockAt(s.to) : r).to + 1;
  }
  return t.length && i.dispatch({ effects: su(i.state, t) }), !!t.length;
}, PS = (i) => {
  let e = i.state.field(ci, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, i.state.doc.length, (n, r) => {
    t.push(_n.of({ from: n, to: r }));
  }), i.dispatch({ effects: t }), !0;
}, kS = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: yS },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: xS },
  { key: "Ctrl-Alt-[", run: $S },
  { key: "Ctrl-Alt-]", run: PS }
], wS = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, lu = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, wS);
  }
});
function au(i) {
  return [ci, XS];
}
function hu(i, e) {
  let { state: t } = i, n = t.facet(lu), r = (o) => {
    let l = i.lineBlockAt(i.posAtDOM(o.target)), a = Vr(i.state, l.from, l.to);
    a && i.dispatch({ effects: _n.of(a) }), o.preventDefault();
  };
  if (n.placeholderDOM)
    return n.placeholderDOM(i, r, e);
  let s = document.createElement("span");
  return s.textContent = n.placeholderText, s.setAttribute("aria-label", t.phrase("folded code")), s.title = t.phrase("unfold"), s.className = "cm-foldPlaceholder", s.onclick = r, s;
}
const Eh = /* @__PURE__ */ Z.replace({ widget: /* @__PURE__ */ new class extends Ue {
  toDOM(i) {
    return hu(i, null);
  }
}() });
class vS extends Ue {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return hu(e, this.value);
  }
}
const TS = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class Ds extends kt {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function CS(i = {}) {
  let e = { ...TS, ...i }, t = new Ds(e, !0), n = new Ds(e, !1), r = ie.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(_t) != o.state.facet(_t) || o.startState.field(ci, !1) != o.state.field(ci, !1) || H(o.startState) != H(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new $t();
      for (let a of o.viewportLineBlocks) {
        let h = Vr(o.state, a.from, a.to) ? n : zr(o.state, a.from, a.to) ? t : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: s } = e;
  return [
    r,
    w0({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(r)) === null || l === void 0 ? void 0 : l.markers) || j.empty;
      },
      initialSpacer() {
        return new Ds(e, !1);
      },
      domEventHandlers: {
        ...s,
        click: (o, l, a) => {
          if (s.click && s.click(o, l, a))
            return !0;
          let h = Vr(o.state, l.from, l.to);
          if (h)
            return o.dispatch({ effects: _n.of(h) }), !0;
          let c = zr(o.state, l.from, l.to);
          return c ? (o.dispatch({ effects: ds.of(c) }), !0) : !1;
        }
      }
    }),
    au()
  ];
}
const XS = /* @__PURE__ */ k.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class jn {
  constructor(e, t) {
    this.specs = e;
    let n;
    function r(l) {
      let a = Mt.newName();
      return (n || (n = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const s = typeof t.all == "string" ? t.all : t.all ? r(t.all) : void 0, o = t.scope;
    this.scope = o instanceof Ge ? (l) => l.prop(bi) == o.data : o ? (l) => l == o : void 0, this.style = KO(e.map((l) => ({
      tag: l.tag,
      class: l.class || r(Object.assign({}, l, { tag: null }))
    })), {
      all: s
    }).style, this.module = n ? new Mt(n) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new jn(e, t || {});
  }
}
const rl = /* @__PURE__ */ C.define(), cu = /* @__PURE__ */ C.define({
  combine(i) {
    return i.length ? [i[0]] : null;
  }
});
function Es(i) {
  let e = i.facet(rl);
  return e.length ? e : i.facet(cu);
}
function fu(i, e) {
  let t = [RS], n;
  return i instanceof jn && (i.module && t.push(k.styleModule.of(i.module)), n = i.themeType), e?.fallback ? t.push(cu.of(i)) : n ? t.push(rl.computeN([k.darkTheme], (r) => r.facet(k.darkTheme) == (n == "dark") ? [i] : [])) : t.push(rl.of(i)), t;
}
class ZS {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = H(e.state), this.decorations = this.buildDeco(e, Es(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = H(e.state), n = Es(e.state), r = n != Es(e.startState), { viewport: s } = e.view, o = e.changes.mapPos(this.decoratedTo, 1);
    t.length < s.to && !r && t.type == this.tree.type && o >= s.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = o) : (t != this.tree || e.viewportChanged || r) && (this.tree = t, this.decorations = this.buildDeco(e.view, n), this.decoratedTo = s.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return Z.none;
    let n = new $t();
    for (let { from: r, to: s } of e.visibleRanges)
      iS(this.tree, t, (o, l, a) => {
        n.add(o, l, this.markCache[a] || (this.markCache[a] = Z.mark({ class: a })));
      }, r, s);
    return n.finish();
  }
}
const RS = /* @__PURE__ */ zt.high(/* @__PURE__ */ ie.fromClass(ZS, {
  decorations: (i) => i.decorations
})), AS = /* @__PURE__ */ jn.define([
  {
    tag: p.meta,
    color: "#404740"
  },
  {
    tag: p.link,
    textDecoration: "underline"
  },
  {
    tag: p.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: p.emphasis,
    fontStyle: "italic"
  },
  {
    tag: p.strong,
    fontWeight: "bold"
  },
  {
    tag: p.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: p.keyword,
    color: "#708"
  },
  {
    tag: [p.atom, p.bool, p.url, p.contentSeparator, p.labelName],
    color: "#219"
  },
  {
    tag: [p.literal, p.inserted],
    color: "#164"
  },
  {
    tag: [p.string, p.deleted],
    color: "#a11"
  },
  {
    tag: [p.regexp, p.escape, /* @__PURE__ */ p.special(p.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ p.definition(p.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ p.local(p.variableName),
    color: "#30a"
  },
  {
    tag: [p.typeName, p.namespace],
    color: "#085"
  },
  {
    tag: p.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ p.special(p.variableName), p.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ p.definition(p.propertyName),
    color: "#00c"
  },
  {
    tag: p.comment,
    color: "#940"
  },
  {
    tag: p.invalid,
    color: "#f00"
  }
]), MS = /* @__PURE__ */ k.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), Ou = 1e4, uu = "()[]{}", du = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, {
      afterCursor: !0,
      brackets: uu,
      maxScanDistance: Ou,
      renderMatch: YS
    });
  }
}), WS = /* @__PURE__ */ Z.mark({ class: "cm-matchingBracket" }), qS = /* @__PURE__ */ Z.mark({ class: "cm-nonmatchingBracket" });
function YS(i) {
  let e = [], t = i.matched ? WS : qS;
  return e.push(t.range(i.start.from, i.start.to)), i.end && e.push(t.range(i.end.from, i.end.to)), e;
}
function Lh(i) {
  let e = [], t = i.facet(du);
  for (let n of i.selection.ranges) {
    if (!n.empty)
      continue;
    let r = ht(i, n.head, -1, t) || n.head > 0 && ht(i, n.head - 1, 1, t) || t.afterCursor && (ht(i, n.head, 1, t) || n.head < i.doc.length && ht(i, n.head + 1, -1, t));
    r && (e = e.concat(t.renderMatch(r, i)));
  }
  return Z.set(e, !0);
}
const _S = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.paused = !1, this.decorations = Lh(i.state);
  }
  update(i) {
    (i.docChanged || i.selectionSet || this.paused) && (i.view.composing ? (this.decorations = this.decorations.map(i.changes), this.paused = !0) : (this.decorations = Lh(i.state), this.paused = !1));
  }
}, {
  decorations: (i) => i.decorations
}), jS = [
  _S,
  MS
];
function zS(i = {}) {
  return [du.of(i), jS];
}
const ea = /* @__PURE__ */ new Y();
function sl(i, e, t) {
  let n = i.prop(e < 0 ? Y.openedBy : Y.closedBy);
  if (n)
    return n;
  if (i.name.length == 1) {
    let r = t.indexOf(i.name);
    if (r > -1 && r % 2 == (e < 0 ? 1 : 0))
      return [t[r + e]];
  }
  return null;
}
function ol(i) {
  let e = i.type.prop(ea);
  return e ? e(i.node) : i;
}
function ht(i, e, t, n = {}) {
  let r = n.maxScanDistance || Ou, s = n.brackets || uu, o = H(i), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = sl(a.type, t, s);
    if (h && a.from < a.to) {
      let c = ol(a);
      if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
        return VS(i, e, t, a, c, h, s);
    }
  }
  return DS(i, e, t, o, l.type, r, s);
}
function VS(i, e, t, n, r, s, o) {
  let l = n.parent, a = { from: r.from, to: r.to }, h = 0, c = l?.cursor();
  if (c && (t < 0 ? c.childBefore(n.from) : c.childAfter(n.to)))
    do
      if (t < 0 ? c.to <= n.from : c.from >= n.to) {
        if (h == 0 && s.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = ol(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (sl(c.type, t, o))
          h++;
        else if (sl(c.type, -t, o)) {
          if (h == 0) {
            let f = ol(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function DS(i, e, t, n, r, s, o) {
  if (t < 0 ? !e : e == i.doc.length)
    return null;
  let l = t < 0 ? i.sliceDoc(e - 1, e) : i.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, c = i.doc.iterRange(e, t > 0 ? i.doc.length : 0), f = 0;
  for (let O = 0; !c.next().done && O <= s; ) {
    let u = c.value;
    t < 0 && (O += u.length);
    let d = e + O * t;
    for (let m = t > 0 ? 0 : u.length - 1, g = t > 0 ? u.length : -1; m != g; m += t) {
      let S = o.indexOf(u[m]);
      if (!(S < 0 || n.resolveInner(d + m, 1).type != r))
        if (S % 2 == 0 == t > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: d + m, to: d + m + 1 }, matched: S >> 1 == a >> 1 };
          f--;
        }
    }
    t > 0 && (O += u.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
const ES = /* @__PURE__ */ Object.create(null), Bh = [we.none], Ih = [], Gh = /* @__PURE__ */ Object.create(null), LS = /* @__PURE__ */ Object.create(null);
for (let [i, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  LS[i] = /* @__PURE__ */ BS(ES, e);
function Ls(i, e) {
  Ih.indexOf(i) > -1 || (Ih.push(i), console.warn(e));
}
function BS(i, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let c = i[h] || p[h];
      c ? typeof c == "function" ? a.length ? a = a.map(c) : Ls(h, `Modifier ${h} used at start of tag`) : a.length ? Ls(h, `Tag ${h} used as modifier`) : a = Array.isArray(c) ? c : [c] : Ls(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let n = e.replace(/ /g, "_"), r = n + " " + t.map((l) => l.id), s = Gh[r];
  if (s)
    return s.id;
  let o = Gh[r] = we.define({
    id: Bh.length,
    name: n,
    props: [Vt({ [n]: t })]
  });
  return Bh.push(o), o.id;
}
U.RTL, U.LTR;
const IS = (i) => {
  let { state: e } = i, t = e.doc.lineAt(e.selection.main.from), n = ia(i.state, t.from);
  return n.line ? GS(i) : n.block ? US(i) : !1;
};
function ta(i, e) {
  return ({ state: t, dispatch: n }) => {
    if (t.readOnly)
      return !1;
    let r = i(e, t);
    return r ? (n(t.update(r)), !0) : !1;
  };
}
const GS = /* @__PURE__ */ ta(
  KS,
  0
  /* CommentOption.Toggle */
), NS = /* @__PURE__ */ ta(
  pu,
  0
  /* CommentOption.Toggle */
), US = /* @__PURE__ */ ta(
  (i, e) => pu(i, e, HS(e)),
  0
  /* CommentOption.Toggle */
);
function ia(i, e) {
  let t = i.languageDataAt("commentTokens", e, 1);
  return t.length ? t[0] : {};
}
const Hi = 50;
function FS(i, { open: e, close: t }, n, r) {
  let s = i.sliceDoc(n - Hi, n), o = i.sliceDoc(r, r + Hi), l = /\s*$/.exec(s)[0].length, a = /^\s*/.exec(o)[0].length, h = s.length - l;
  if (s.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
    return {
      open: { pos: n - l, margin: l && 1 },
      close: { pos: r + a, margin: a && 1 }
    };
  let c, f;
  r - n <= 2 * Hi ? c = f = i.sliceDoc(n, r) : (c = i.sliceDoc(n, n + Hi), f = i.sliceDoc(r - Hi, r));
  let O = /^\s*/.exec(c)[0].length, u = /\s*$/.exec(f)[0].length, d = f.length - u - t.length;
  return c.slice(O, O + e.length) == e && f.slice(d, d + t.length) == t ? {
    open: {
      pos: n + O + e.length,
      margin: /\s/.test(c.charAt(O + e.length)) ? 1 : 0
    },
    close: {
      pos: r - u - t.length,
      margin: /\s/.test(f.charAt(d - 1)) ? 1 : 0
    }
  } : null;
}
function HS(i) {
  let e = [];
  for (let t of i.selection.ranges) {
    let n = i.doc.lineAt(t.from), r = t.to <= n.to ? n : i.doc.lineAt(t.to);
    r.from > n.from && r.from == t.to && (r = t.to == n.to + 1 ? n : i.doc.lineAt(t.to - 1));
    let s = e.length - 1;
    s >= 0 && e[s].to > n.from ? e[s].to = r.to : e.push({ from: n.from + /^\s*/.exec(n.text)[0].length, to: r.to });
  }
  return e;
}
function pu(i, e, t = e.selection.ranges) {
  let n = t.map((s) => ia(e, s.from).block);
  if (!n.every((s) => s))
    return null;
  let r = t.map((s, o) => FS(e, n[o], s.from, s.to));
  if (i != 2 && !r.every((s) => s))
    return { changes: e.changes(t.map((s, o) => r[o] ? [] : [{ from: s.from, insert: n[o].open + " " }, { from: s.to, insert: " " + n[o].close }])) };
  if (i != 1 && r.some((s) => s)) {
    let s = [];
    for (let o = 0, l; o < r.length; o++)
      if (l = r[o]) {
        let a = n[o], { open: h, close: c } = l;
        s.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: c.pos - c.margin, to: c.pos + a.close.length });
      }
    return { changes: s };
  }
  return null;
}
function KS(i, e, t = e.selection.ranges) {
  let n = [], r = -1;
  e: for (let { from: s, to: o } of t) {
    let l = n.length, a = 1e9, h;
    for (let c = s; c <= o; ) {
      let f = e.doc.lineAt(c);
      if (h == null && (h = ia(e, f.from).line, !h))
        continue e;
      if (f.from > r && (s == o || o > f.from)) {
        r = f.from;
        let O = /^\s*/.exec(f.text)[0].length, u = O == f.length, d = f.text.slice(O, O + h.length) == h ? O : -1;
        O < f.text.length && O < a && (a = O), n.push({ line: f, comment: d, token: h, indent: O, empty: u, single: !1 });
      }
      c = f.to + 1;
    }
    if (a < 1e9)
      for (let c = l; c < n.length; c++)
        n[c].indent < n[c].line.text.length && (n[c].indent = a);
    n.length == l + 1 && (n[l].single = !0);
  }
  if (i != 2 && n.some((s) => s.comment < 0 && (!s.empty || s.single))) {
    let s = [];
    for (let { line: l, token: a, indent: h, empty: c, single: f } of n)
      (f || !c) && s.push({ from: l.from + h, insert: a + " " });
    let o = e.changes(s);
    return { changes: o, selection: e.selection.map(o, 1) };
  } else if (i != 1 && n.some((s) => s.comment >= 0)) {
    let s = [];
    for (let { line: o, comment: l, token: a } of n)
      if (l >= 0) {
        let h = o.from + l, c = h + a.length;
        o.text[c - o.from] == " " && c++, s.push({ from: h, to: c });
      }
    return { changes: s };
  }
  return null;
}
const ll = /* @__PURE__ */ pt.define(), JS = /* @__PURE__ */ pt.define(), eQ = /* @__PURE__ */ C.define(), mu = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (n, r) => e(n, r) || t(n, r)
    });
  }
}), gu = /* @__PURE__ */ ge.define({
  create() {
    return ct.empty;
  },
  update(i, e) {
    let t = e.state.facet(mu), n = e.annotation(ll);
    if (n) {
      let a = Re.fromTransaction(e, n.selection), h = n.side, c = h == 0 ? i.undone : i.done;
      return a ? c = Dr(c, c.length, t.minDepth, a) : c = bu(c, e.startState.selection), new ct(h == 0 ? n.rest : c, h == 0 ? c : n.rest);
    }
    let r = e.annotation(JS);
    if ((r == "full" || r == "before") && (i = i.isolate()), e.annotation(se.addToHistory) === !1)
      return e.changes.empty ? i : i.addMapping(e.changes.desc);
    let s = Re.fromTransaction(e), o = e.annotation(se.time), l = e.annotation(se.userEvent);
    return s ? i = i.addChanges(s, o, l, t, e) : e.selection && (i = i.addSelection(e.startState.selection, o, l, t.newGroupDelay)), (r == "full" || r == "after") && (i = i.isolate()), i;
  },
  toJSON(i) {
    return { done: i.done.map((e) => e.toJSON()), undone: i.undone.map((e) => e.toJSON()) };
  },
  fromJSON(i) {
    return new ct(i.done.map(Re.fromJSON), i.undone.map(Re.fromJSON));
  }
});
function tQ(i = {}) {
  return [
    gu,
    mu.of(i),
    k.domEventHandlers({
      beforeinput(e, t) {
        let n = e.inputType == "historyUndo" ? Su : e.inputType == "historyRedo" ? al : null;
        return n ? (e.preventDefault(), n(t)) : !1;
      }
    })
  ];
}
function ps(i, e) {
  return function({ state: t, dispatch: n }) {
    if (!e && t.readOnly)
      return !1;
    let r = t.field(gu, !1);
    if (!r)
      return !1;
    let s = r.pop(i, t, e);
    return s ? (n(s), !0) : !1;
  };
}
const Su = /* @__PURE__ */ ps(0, !1), al = /* @__PURE__ */ ps(1, !1), iQ = /* @__PURE__ */ ps(0, !0), nQ = /* @__PURE__ */ ps(1, !0);
class Re {
  constructor(e, t, n, r, s) {
    this.changes = e, this.effects = t, this.mapped = n, this.startSelection = r, this.selectionsAfter = s;
  }
  setSelAfter(e) {
    return new Re(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, n;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (n = this.startSelection) === null || n === void 0 ? void 0 : n.toJSON(),
      selectionsAfter: this.selectionsAfter.map((r) => r.toJSON())
    };
  }
  static fromJSON(e) {
    return new Re(e.changes && le.fromJSON(e.changes), [], e.mapped && ft.fromJSON(e.mapped), e.startSelection && b.fromJSON(e.startSelection), e.selectionsAfter.map(b.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let n = Ve;
    for (let r of e.startState.facet(eQ)) {
      let s = r(e);
      s.length && (n = n.concat(s));
    }
    return !n.length && e.changes.empty ? null : new Re(e.changes.invert(e.startState.doc), n, void 0, t || e.startState.selection, Ve);
  }
  static selection(e) {
    return new Re(void 0, Ve, void 0, void 0, e);
  }
}
function Dr(i, e, t, n) {
  let r = e + 1 > t + 20 ? e - t - 1 : 0, s = i.slice(r, e);
  return s.push(n), s;
}
function rQ(i, e) {
  let t = [], n = !1;
  return i.iterChangedRanges((r, s) => t.push(r, s)), e.iterChangedRanges((r, s, o, l) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], c = t[a++];
      l >= h && o <= c && (n = !0);
    }
  }), n;
}
function sQ(i, e) {
  return i.ranges.length == e.ranges.length && i.ranges.filter((t, n) => t.empty != e.ranges[n].empty).length === 0;
}
function Qu(i, e) {
  return i.length ? e.length ? i.concat(e) : i : e;
}
const Ve = [], oQ = 200;
function bu(i, e) {
  if (i.length) {
    let t = i[i.length - 1], n = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - oQ));
    return n.length && n[n.length - 1].eq(e) ? i : (n.push(e), Dr(i, i.length - 1, 1e9, t.setSelAfter(n)));
  } else
    return [Re.selection([e])];
}
function lQ(i) {
  let e = i[i.length - 1], t = i.slice();
  return t[i.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function Bs(i, e) {
  if (!i.length)
    return i;
  let t = i.length, n = Ve;
  for (; t; ) {
    let r = aQ(i[t - 1], e, n);
    if (r.changes && !r.changes.empty || r.effects.length) {
      let s = i.slice(0, t);
      return s[t - 1] = r, s;
    } else
      e = r.mapped, t--, n = r.selectionsAfter;
  }
  return n.length ? [Re.selection(n)] : Ve;
}
function aQ(i, e, t) {
  let n = Qu(i.selectionsAfter.length ? i.selectionsAfter.map((l) => l.map(e)) : Ve, t);
  if (!i.changes)
    return Re.selection(n);
  let r = i.changes.map(e), s = e.mapDesc(i.changes, !0), o = i.mapped ? i.mapped.composeDesc(s) : s;
  return new Re(r, M.mapEffects(i.effects, e), o, i.startSelection.map(s), n);
}
const hQ = /^(input\.type|delete)($|\.)/;
class ct {
  constructor(e, t, n = 0, r = void 0) {
    this.done = e, this.undone = t, this.prevTime = n, this.prevUserEvent = r;
  }
  isolate() {
    return this.prevTime ? new ct(this.done, this.undone) : this;
  }
  addChanges(e, t, n, r, s) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!n || hQ.test(n)) && (!l.selectionsAfter.length && t - this.prevTime < r.newGroupDelay && r.joinToEvent(s, rQ(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    n == "input.type.compose") ? o = Dr(o, o.length - 1, r.minDepth, new Re(e.changes.compose(l.changes), Qu(M.mapEffects(e.effects, l.changes), l.effects), l.mapped, l.startSelection, Ve)) : o = Dr(o, o.length, r.minDepth, e), new ct(o, Ve, t, n);
  }
  addSelection(e, t, n, r) {
    let s = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ve;
    return s.length > 0 && t - this.prevTime < r && n == this.prevUserEvent && n && /^select($|\.)/.test(n) && sQ(s[s.length - 1], e) ? this : new ct(bu(this.done, e), this.undone, t, n);
  }
  addMapping(e) {
    return new ct(Bs(this.done, e), Bs(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, n) {
    let r = e == 0 ? this.done : this.undone;
    if (r.length == 0)
      return null;
    let s = r[r.length - 1], o = s.selectionsAfter[0] || (s.startSelection ? s.startSelection.map(s.changes.invertedDesc, 1) : t.selection);
    if (n && s.selectionsAfter.length)
      return t.update({
        selection: s.selectionsAfter[s.selectionsAfter.length - 1],
        annotations: ll.of({ side: e, rest: lQ(r), selection: o }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (s.changes) {
      let l = r.length == 1 ? Ve : r.slice(0, r.length - 1);
      return s.mapped && (l = Bs(l, s.mapped)), t.update({
        changes: s.changes,
        selection: s.startSelection,
        effects: s.effects,
        annotations: ll.of({ side: e, rest: l, selection: o }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
ct.empty = /* @__PURE__ */ new ct(Ve, Ve);
const cQ = [
  { key: "Mod-z", run: Su, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: al, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: al, preventDefault: !0 },
  { key: "Mod-u", run: iQ, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: nQ, preventDefault: !0 }
];
function Vi(i, e) {
  return b.create(i.ranges.map(e), i.mainIndex);
}
function Fe(i, e) {
  return i.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function He({ state: i, dispatch: e }, t) {
  let n = Vi(i.selection, t);
  return n.eq(i.selection, !0) ? !1 : (e(Fe(i, n)), !0);
}
function ms(i, e) {
  return b.cursor(e ? i.to : i.from);
}
function yu(i, e) {
  return He(i, (t) => t.empty ? i.moveByChar(t, e) : ms(t, e));
}
function be(i) {
  return i.textDirectionAt(i.state.selection.main.head) == U.LTR;
}
const xu = (i) => yu(i, !be(i)), $u = (i) => yu(i, be(i));
function Pu(i, e) {
  return He(i, (t) => t.empty ? i.moveByGroup(t, e) : ms(t, e));
}
const fQ = (i) => Pu(i, !be(i)), OQ = (i) => Pu(i, be(i));
function uQ(i, e, t) {
  if (e.type.prop(t))
    return !0;
  let n = e.to - e.from;
  return n && (n > 2 || /[^\s,.;:]/.test(i.sliceDoc(e.from, e.to))) || e.firstChild;
}
function gs(i, e, t) {
  let n = H(i).resolveInner(e.head), r = t ? Y.closedBy : Y.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? n.childAfter(a) : n.childBefore(a);
    if (!h)
      break;
    uQ(i, h, r) ? n = h : a = t ? h.to : h.from;
  }
  let s = n.type.prop(r), o, l;
  return s && (o = t ? ht(i, n.from, 1) : ht(i, n.to, -1)) && o.matched ? l = t ? o.end.to : o.end.from : l = t ? n.to : n.from, b.cursor(l, t ? -1 : 1);
}
const dQ = (i) => He(i, (e) => gs(i.state, e, !be(i))), pQ = (i) => He(i, (e) => gs(i.state, e, be(i)));
function ku(i, e) {
  return He(i, (t) => {
    if (!t.empty)
      return ms(t, e);
    let n = i.moveVertically(t, e);
    return n.head != t.head ? n : i.moveToLineBoundary(t, e);
  });
}
const wu = (i) => ku(i, !1), vu = (i) => ku(i, !0);
function Tu(i) {
  let e = i.scrollDOM.clientHeight < i.scrollDOM.scrollHeight - 2, t = 0, n = 0, r;
  if (e) {
    for (let s of i.state.facet(k.scrollMargins)) {
      let o = s(i);
      o?.top && (t = Math.max(o?.top, t)), o?.bottom && (n = Math.max(o?.bottom, n));
    }
    r = i.scrollDOM.clientHeight - t - n;
  } else
    r = (i.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: n,
    selfScroll: e,
    height: Math.max(i.defaultLineHeight, r - 5)
  };
}
function Cu(i, e) {
  let t = Tu(i), { state: n } = i, r = Vi(n.selection, (o) => o.empty ? i.moveVertically(o, e, t.height) : ms(o, e));
  if (r.eq(n.selection))
    return !1;
  let s;
  if (t.selfScroll) {
    let o = i.coordsAtPos(n.selection.main.head), l = i.scrollDOM.getBoundingClientRect(), a = l.top + t.marginTop, h = l.bottom - t.marginBottom;
    o && o.top > a && o.bottom < h && (s = k.scrollIntoView(r.main.head, { y: "start", yMargin: o.top - a }));
  }
  return i.dispatch(Fe(n, r), { effects: s }), !0;
}
const Nh = (i) => Cu(i, !1), hl = (i) => Cu(i, !0);
function Lt(i, e, t) {
  let n = i.lineBlockAt(e.head), r = i.moveToLineBoundary(e, t);
  if (r.head == e.head && r.head != (t ? n.to : n.from) && (r = i.moveToLineBoundary(e, t, !1)), !t && r.head == n.from && n.length) {
    let s = /^\s*/.exec(i.state.sliceDoc(n.from, Math.min(n.from + 100, n.to)))[0].length;
    s && e.head != n.from + s && (r = b.cursor(n.from + s));
  }
  return r;
}
const mQ = (i) => He(i, (e) => Lt(i, e, !0)), gQ = (i) => He(i, (e) => Lt(i, e, !1)), SQ = (i) => He(i, (e) => Lt(i, e, !be(i))), QQ = (i) => He(i, (e) => Lt(i, e, be(i))), bQ = (i) => He(i, (e) => b.cursor(i.lineBlockAt(e.head).from, 1)), yQ = (i) => He(i, (e) => b.cursor(i.lineBlockAt(e.head).to, -1));
function xQ(i, e, t) {
  let n = !1, r = Vi(i.selection, (s) => {
    let o = ht(i, s.head, -1) || ht(i, s.head, 1) || s.head > 0 && ht(i, s.head - 1, 1) || s.head < i.doc.length && ht(i, s.head + 1, -1);
    if (!o || !o.end)
      return s;
    n = !0;
    let l = o.start.from == s.head ? o.end.to : o.end.from;
    return b.cursor(l);
  });
  return n ? (e(Fe(i, r)), !0) : !1;
}
const $Q = ({ state: i, dispatch: e }) => xQ(i, e);
function Ee(i, e, t) {
  let n = Vi(i.state.selection, (r) => {
    r.undirectional && r.head >= r.anchor != e && (r = b.range(r.head, r.anchor));
    let s = t(r);
    return b.range(r.anchor, s.head, s.goalColumn, s.bidiLevel || void 0, s.assoc);
  });
  return n.eq(i.state.selection) ? !1 : (i.dispatch(Fe(i.state, n)), !0);
}
function Xu(i, e) {
  return Ee(i, e, (t) => i.moveByChar(t, e));
}
const Zu = (i) => Xu(i, !be(i)), Ru = (i) => Xu(i, be(i));
function Au(i, e) {
  return Ee(i, e, (t) => i.moveByGroup(t, e));
}
const PQ = (i) => Au(i, !be(i)), kQ = (i) => Au(i, be(i)), wQ = (i) => {
  let e = !be(i);
  return Ee(i, e, (t) => gs(i.state, t, e));
}, vQ = (i) => {
  let e = be(i);
  return Ee(i, e, (t) => gs(i.state, t, e));
};
function Mu(i, e) {
  return Ee(i, e, (t) => i.moveVertically(t, e));
}
const Wu = (i) => Mu(i, !1), qu = (i) => Mu(i, !0);
function Yu(i, e) {
  return Ee(i, e, (t) => i.moveVertically(t, e, Tu(i).height));
}
const Uh = (i) => Yu(i, !1), Fh = (i) => Yu(i, !0), TQ = (i) => Ee(i, !0, (e) => Lt(i, e, !0)), CQ = (i) => Ee(i, !1, (e) => Lt(i, e, !1)), XQ = (i) => {
  let e = !be(i);
  return Ee(i, e, (t) => Lt(i, t, e));
}, ZQ = (i) => {
  let e = be(i);
  return Ee(i, e, (t) => Lt(i, t, e));
}, RQ = (i) => Ee(i, !1, (e) => b.cursor(i.lineBlockAt(e.head).from)), AQ = (i) => Ee(i, !0, (e) => b.cursor(i.lineBlockAt(e.head).to)), Hh = ({ state: i, dispatch: e }) => (e(Fe(i, { anchor: 0 })), !0), Kh = ({ state: i, dispatch: e }) => (e(Fe(i, { anchor: i.doc.length })), !0), Jh = ({ state: i, dispatch: e }) => (e(Fe(i, { anchor: i.selection.main.anchor, head: 0 })), !0), ec = ({ state: i, dispatch: e }) => (e(Fe(i, { anchor: i.selection.main.anchor, head: i.doc.length })), !0), MQ = ({ state: i, dispatch: e }) => (e(i.update({ selection: { anchor: 0, head: i.doc.length }, userEvent: "select" })), !0), WQ = ({ state: i, dispatch: e }) => {
  let t = Ss(i).map(({ from: n, to: r }) => b.range(n, Math.min(r + 1, i.doc.length)));
  return e(i.update({ selection: b.create(t), userEvent: "select" })), !0;
}, qQ = ({ state: i, dispatch: e }) => {
  let t = Vi(i.selection, (n) => {
    let r = H(i), s = r.resolveStack(n.from, 1);
    if (n.empty) {
      let o = r.resolveStack(n.from, -1);
      o.node.from >= s.node.from && o.node.to <= s.node.to && (s = o);
    }
    for (let o = s; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < n.from && l.to >= n.to || l.to > n.to && l.from <= n.from) && o.next)
        return b.range(l.to, l.from);
    }
    return n;
  });
  return t.eq(i.selection) ? !1 : (e(Fe(i, t)), !0);
};
function _u(i, e) {
  let { state: t } = i, n = t.selection, r = t.selection.ranges.slice();
  for (let s of t.selection.ranges) {
    let o = t.doc.lineAt(s.head);
    if (e ? o.to < i.state.doc.length : o.from > 0)
      for (let l = s; ; ) {
        let a = i.moveVertically(l, e);
        if (a.head < o.from || a.head > o.to) {
          r.some((h) => h.head == a.head) || r.push(a);
          break;
        } else {
          if (a.head == l.head)
            break;
          l = a;
        }
      }
  }
  return r.length == n.ranges.length ? !1 : (i.dispatch(Fe(t, b.create(r, r.length - 1))), !0);
}
const YQ = (i) => _u(i, !1), _Q = (i) => _u(i, !0), jQ = ({ state: i, dispatch: e }) => {
  let t = i.selection, n = null;
  return t.ranges.length > 1 ? n = b.create([t.main]) : t.main.empty || (n = b.create([b.cursor(t.main.head)])), n ? (e(Fe(i, n)), !0) : !1;
};
function zn(i, e) {
  if (i.state.readOnly)
    return !1;
  let t = "delete.selection", { state: n } = i, r = n.changeByRange((s) => {
    let { from: o, to: l } = s;
    if (o == l) {
      let a = e(s);
      a < o ? (t = "delete.backward", a = ar(i, a, !1)) : a > o && (t = "delete.forward", a = ar(i, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = ar(i, o, !1), l = ar(i, l, !0);
    return o == l ? { range: s } : { changes: { from: o, to: l }, range: b.cursor(o, o < s.head ? -1 : 1) };
  });
  return r.changes.empty ? !1 : (i.dispatch(n.update(r, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? k.announce.of(n.phrase("Selection deleted")) : void 0
  })), !0);
}
function ar(i, e, t) {
  if (i instanceof k)
    for (let n of i.state.facet(k.atomicRanges).map((r) => r(i)))
      n.between(e, e, (r, s) => {
        r < e && s > e && (e = t ? s : r);
      });
  return e;
}
const ju = (i, e, t) => zn(i, (n) => {
  let r = n.from, { state: s } = i, o = s.doc.lineAt(r), l, a;
  if (t && !e && r > o.from && r < o.from + 200 && !/[^ \t]/.test(l = o.text.slice(0, r - o.from))) {
    if (l[l.length - 1] == "	")
      return r - 1;
    let h = zi(l, s.tabSize), c = h % jr(s) || jr(s);
    for (let f = 0; f < c && l[l.length - 1 - f] == " "; f++)
      r--;
    a = r;
  } else
    a = ce(o.text, r - o.from, e, e) + o.from, a == r && o.number != (e ? s.doc.lines : 1) ? a += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(o.text.slice(a - o.from, r - o.from)) && (a = ce(o.text, a - o.from, !1, !1) + o.from);
  return a;
}), cl = (i) => ju(i, !1, !0), zu = (i) => ju(i, !0, !1), Vu = (i, e) => zn(i, (t) => {
  let n = t.head, { state: r } = i, s = r.doc.lineAt(n), o = r.charCategorizer(n);
  for (let l = null; ; ) {
    if (n == (e ? s.to : s.from)) {
      n == t.head && s.number != (e ? r.doc.lines : 1) && (n += e ? 1 : -1);
      break;
    }
    let a = ce(s.text, n - s.from, e) + s.from, h = s.text.slice(Math.min(n, a) - s.from, Math.max(n, a) - s.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || n != t.head) && (l = c), n = a;
  }
  return n;
}), Du = (i) => Vu(i, !1), zQ = (i) => Vu(i, !0), VQ = (i) => zn(i, (e) => {
  let t = i.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(i.state.doc.length, e.head + 1);
}), DQ = (i) => zn(i, (e) => {
  let t = i.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), EQ = (i) => zn(i, (e) => {
  let t = i.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(i.state.doc.length, e.head + 1);
}), LQ = ({ state: i, dispatch: e }) => {
  if (i.readOnly)
    return !1;
  let t = i.changeByRange((n) => ({
    changes: { from: n.from, to: n.to, insert: D.of(["", ""]) },
    range: b.cursor(n.from)
  }));
  return e(i.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, BQ = ({ state: i, dispatch: e }) => {
  if (i.readOnly)
    return !1;
  let t = i.changeByRange((n) => {
    if (!n.empty || n.from == 0 || n.from == i.doc.length)
      return { range: n };
    let r = n.from, s = i.doc.lineAt(r), o = r == s.from ? r - 1 : ce(s.text, r - s.from, !1) + s.from, l = r == s.to ? r + 1 : ce(s.text, r - s.from, !0) + s.from;
    return {
      changes: { from: o, to: l, insert: i.doc.slice(r, l).append(i.doc.slice(o, r)) },
      range: b.cursor(l)
    };
  });
  return t.changes.empty ? !1 : (e(i.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function Ss(i) {
  let e = [], t = -1;
  for (let n of i.selection.ranges) {
    let r = i.doc.lineAt(n.from), s = i.doc.lineAt(n.to);
    if (!n.empty && n.to == s.from && (s = i.doc.lineAt(n.to - 1)), t >= r.number) {
      let o = e[e.length - 1];
      o.to = s.to, o.ranges.push(n);
    } else
      e.push({ from: r.from, to: s.to, ranges: [n] });
    t = s.number + 1;
  }
  return e;
}
function Eu(i, e, t) {
  if (i.readOnly)
    return !1;
  let n = [], r = [];
  for (let s of Ss(i)) {
    if (t ? s.to == i.doc.length : s.from == 0)
      continue;
    let o = i.doc.lineAt(t ? s.to + 1 : s.from - 1), l = o.length + 1;
    if (t) {
      n.push({ from: s.to, to: o.to }, { from: s.from, insert: o.text + i.lineBreak });
      for (let a of s.ranges)
        r.push(b.range(Math.min(i.doc.length, a.anchor + l), Math.min(i.doc.length, a.head + l)));
    } else {
      n.push({ from: o.from, to: s.from }, { from: s.to, insert: i.lineBreak + o.text });
      for (let a of s.ranges)
        r.push(b.range(a.anchor - l, a.head - l));
    }
  }
  return n.length ? (e(i.update({
    changes: n,
    scrollIntoView: !0,
    selection: b.create(r, i.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const IQ = ({ state: i, dispatch: e }) => Eu(i, e, !1), GQ = ({ state: i, dispatch: e }) => Eu(i, e, !0);
function Lu(i, e, t) {
  if (i.readOnly)
    return !1;
  let n = [];
  for (let s of Ss(i))
    t ? n.push({ from: s.from, insert: i.doc.slice(s.from, s.to) + i.lineBreak }) : n.push({ from: s.to, insert: i.lineBreak + i.doc.slice(s.from, s.to) });
  let r = i.changes(n);
  return e(i.update({
    changes: r,
    selection: i.selection.map(r, t ? 1 : -1),
    scrollIntoView: !0,
    userEvent: "input.copyline"
  })), !0;
}
const NQ = ({ state: i, dispatch: e }) => Lu(i, e, !1), UQ = ({ state: i, dispatch: e }) => Lu(i, e, !0), FQ = (i) => {
  if (i.state.readOnly)
    return !1;
  let { state: e } = i, t = e.changes(Ss(e).map(({ from: r, to: s }) => (r > 0 ? r-- : s < e.doc.length && s++, { from: r, to: s }))), n = Vi(e.selection, (r) => {
    let s;
    if (i.lineWrapping) {
      let o = i.lineBlockAt(r.head), l = i.coordsAtPos(r.head, r.assoc || 1);
      l && (s = o.bottom + i.documentTop - l.bottom + i.defaultLineHeight / 2);
    }
    return i.moveVertically(r, !0, s);
  }).map(t);
  return i.dispatch({ changes: t, selection: n, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function HQ(i, e) {
  if (/\(\)|\[\]|\{\}/.test(i.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = H(i).resolveInner(e), n = t.childBefore(e), r = t.childAfter(e), s;
  return n && r && n.to <= e && r.from >= e && (s = n.type.prop(Y.closedBy)) && s.indexOf(r.name) > -1 && i.doc.lineAt(n.to).from == i.doc.lineAt(r.from).from && !/\S/.test(i.sliceDoc(n.to, r.from)) ? { from: n.to, to: r.from } : null;
}
const tc = /* @__PURE__ */ Bu(!1), KQ = /* @__PURE__ */ Bu(!0);
function Bu(i) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let n = e.changeByRange((r) => {
      let { from: s, to: o } = r, l = e.doc.lineAt(s), a = !i && s == o && HQ(e, s);
      i && (s = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
      let h = new Os(e, { simulateBreak: s, simulateDoubleBreak: !!a }), c = Kl(h, s);
      for (c == null && (c = zi(/^\s*/.exec(e.doc.lineAt(s).text)[0], e.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: s, to: o } = a : s > l.from && s < l.from + 100 && !/\S/.test(l.text.slice(0, s)) && (s = l.from);
      let f = ["", $n(e, c)];
      return a && f.push($n(e, h.lineIndent(l.from, -1))), {
        changes: { from: s, to: o, insert: D.of(f) },
        range: b.cursor(s + 1 + f[1].length)
      };
    });
    return t(e.update(n, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function na(i, e) {
  let t = -1;
  return i.changeByRange((n) => {
    let r = [];
    for (let o = n.from; o <= n.to; ) {
      let l = i.doc.lineAt(o);
      l.number > t && (n.empty || n.to > l.from) && (e(l, r, n), t = l.number), o = l.to + 1;
    }
    let s = i.changes(r);
    return {
      changes: r,
      range: b.range(s.mapPos(n.anchor, 1), s.mapPos(n.head, 1))
    };
  });
}
const JQ = ({ state: i, dispatch: e }) => {
  if (i.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), n = new Os(i, { overrideIndentation: (s) => {
    let o = t[s];
    return o ?? -1;
  } }), r = na(i, (s, o, l) => {
    let a = Kl(n, s.from);
    if (a == null)
      return;
    /\S/.test(s.text) || (a = 0);
    let h = /^\s*/.exec(s.text)[0], c = $n(i, a);
    (h != c || l.from < s.from + h.length) && (t[s.from] = a, o.push({ from: s.from, to: s.from + h.length, insert: c }));
  });
  return r.changes.empty || e(i.update(r, { userEvent: "indent" })), !0;
}, Iu = ({ state: i, dispatch: e }) => i.readOnly ? !1 : (e(i.update(na(i, (t, n) => {
  n.push({ from: t.from, insert: i.facet(Yn) });
}), { userEvent: "input.indent" })), !0), Gu = ({ state: i, dispatch: e }) => i.readOnly ? !1 : (e(i.update(na(i, (t, n) => {
  let r = /^\s*/.exec(t.text)[0];
  if (!r)
    return;
  let s = zi(r, i.tabSize), o = 0, l = $n(i, Math.max(0, s - jr(i)));
  for (; o < r.length && o < l.length && r.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  n.push({ from: t.from + o, to: t.from + r.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), eb = (i) => (i.setTabFocusMode(), !0), tb = [
  { key: "Ctrl-b", run: xu, shift: Zu, preventDefault: !0 },
  { key: "Ctrl-f", run: $u, shift: Ru },
  { key: "Ctrl-p", run: wu, shift: Wu },
  { key: "Ctrl-n", run: vu, shift: qu },
  { key: "Ctrl-a", run: bQ, shift: RQ },
  { key: "Ctrl-e", run: yQ, shift: AQ },
  { key: "Ctrl-d", run: zu },
  { key: "Ctrl-h", run: cl },
  { key: "Ctrl-k", run: VQ },
  { key: "Ctrl-Alt-h", run: Du },
  { key: "Ctrl-o", run: LQ },
  { key: "Ctrl-t", run: BQ },
  { key: "Ctrl-v", run: hl }
], ib = /* @__PURE__ */ [
  { key: "ArrowLeft", run: xu, shift: Zu, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: fQ, shift: PQ, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: SQ, shift: XQ, preventDefault: !0 },
  { key: "ArrowRight", run: $u, shift: Ru, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: OQ, shift: kQ, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: QQ, shift: ZQ, preventDefault: !0 },
  { key: "ArrowUp", run: wu, shift: Wu, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: Hh, shift: Jh },
  { mac: "Ctrl-ArrowUp", run: Nh, shift: Uh },
  { key: "ArrowDown", run: vu, shift: qu, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: Kh, shift: ec },
  { mac: "Ctrl-ArrowDown", run: hl, shift: Fh },
  { key: "PageUp", run: Nh, shift: Uh },
  { key: "PageDown", run: hl, shift: Fh },
  { key: "Home", run: gQ, shift: CQ, preventDefault: !0 },
  { key: "Mod-Home", run: Hh, shift: Jh },
  { key: "End", run: mQ, shift: TQ, preventDefault: !0 },
  { key: "Mod-End", run: Kh, shift: ec },
  { key: "Enter", run: tc, shift: tc },
  { key: "Mod-a", run: MQ },
  { key: "Backspace", run: cl, shift: cl, preventDefault: !0 },
  { key: "Delete", run: zu, preventDefault: !0 },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: Du, preventDefault: !0 },
  { key: "Mod-Delete", mac: "Alt-Delete", run: zQ, preventDefault: !0 },
  { mac: "Mod-Backspace", run: DQ, preventDefault: !0 },
  { mac: "Mod-Delete", run: EQ, preventDefault: !0 }
].concat(/* @__PURE__ */ tb.map((i) => ({ mac: i.key, run: i.run, shift: i.shift }))), nb = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: dQ, shift: wQ },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: pQ, shift: vQ },
  { key: "Alt-ArrowUp", run: IQ },
  { key: "Shift-Alt-ArrowUp", run: NQ },
  { key: "Alt-ArrowDown", run: GQ },
  { key: "Shift-Alt-ArrowDown", run: UQ },
  { key: "Mod-Alt-ArrowUp", run: YQ },
  { key: "Mod-Alt-ArrowDown", run: _Q },
  { key: "Escape", run: jQ },
  { key: "Mod-Enter", run: KQ },
  { key: "Alt-l", mac: "Ctrl-l", run: WQ },
  { key: "Mod-i", run: qQ, preventDefault: !0 },
  { key: "Mod-[", run: Gu },
  { key: "Mod-]", run: Iu },
  { key: "Mod-Alt-\\", run: JQ },
  { key: "Shift-Mod-k", run: FQ },
  { key: "Shift-Mod-\\", run: $Q },
  { key: "Mod-/", run: IS },
  { key: "Alt-A", run: NS },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: eb }
].concat(ib), rb = { key: "Tab", run: Iu, shift: Gu }, ic = typeof String.prototype.normalize == "function" ? (i) => i.normalize("NFKD") : (i) => i;
class qi {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(e, t, n = 0, r = e.length, s, o) {
    this.test = o, this.value = { from: 0, to: 0, precise: !1 }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = e.iterRange(n, r), this.bufferStart = n, this.normalize = s ? (l) => s(ic(l)) : ic, this.query = this.normalize(t);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done)
        return -1;
      this.bufferPos = 0, this.buffer = this.iter.value;
    }
    return Te(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    for (; this.matches.length; )
      this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (; ; ) {
      let e = this.peek();
      if (e < 0)
        return this.done = !0, this;
      let t = Tl(e), n = this.bufferStart + this.bufferPos;
      this.bufferPos += st(e);
      let r = this.normalize(t);
      if (r.length)
        for (let s = 0, o = n, l = !0; ; s++) {
          let a = r.charCodeAt(s), h = this.match(a, o, l, this.bufferPos + this.bufferStart, s == r.length - 1);
          if (h)
            return this.value = h, this;
          if (s == r.length - 1)
            break;
          l && s < t.length && t.charCodeAt(s) == a ? o++ : l = !1;
        }
    }
  }
  match(e, t, n, r, s) {
    let o = null;
    for (let l = 0; l < this.matches.length; ) {
      let a = this.matches[l], h = !1;
      this.query.charCodeAt(a.index) == e && (a.index == this.query.length - 1 ? o = { from: a.from, to: r, precise: s && a.precise } : (a.index++, h = !0)), h ? l++ : this.matches.splice(l, 1);
    }
    return this.query.charCodeAt(0) == e && (this.query.length == 1 ? o = { from: t, to: r, precise: n && s } : this.matches.push({ from: t, index: 1, precise: n })), o && this.test && !this.test(o.from, o.to, this.buffer, this.bufferStart) && (o = null), o;
  }
}
typeof Symbol < "u" && (qi.prototype[Symbol.iterator] = function() {
  return this;
});
const Nu = { from: -1, to: -1, match: /* @__PURE__ */ /.*/.exec(""), precise: !0 }, ra = "gm" + (/x/.unicode == null ? "" : "u");
class Uu {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(e, t, n, r = 0, s = e.length) {
    if (this.text = e, this.to = s, this.curLine = "", this.done = !1, this.value = Nu, /\\[sWDnr]|\n|\r|\[\^/.test(t))
      return new Fu(e, t, n, r, s);
    this.re = new RegExp(t, ra + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.iter = e.iter();
    let o = e.lineAt(r);
    this.curLineStart = o.from, this.matchPos = Er(e, r), this.getLine(this.curLineStart);
  }
  getLine(e) {
    this.iter.next(e), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let e = this.matchPos - this.curLineStart; ; ) {
      this.re.lastIndex = e;
      let t = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (t) {
        let n = this.curLineStart + t.index, r = n + t[0].length;
        if (this.matchPos = Er(this.text, r + (n == r ? 1 : 0)), n == this.curLineStart + this.curLine.length && this.nextLine(), (n < r || n > this.value.to) && (!this.test || this.test(n, r, t)))
          return this.value = { from: n, to: r, precise: !0, match: t }, this;
        e = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to)
        this.nextLine(), e = 0;
      else
        return this.done = !0, this;
    }
  }
}
const Is = /* @__PURE__ */ new WeakMap();
class vi {
  constructor(e, t) {
    this.from = e, this.text = t;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(e, t, n) {
    let r = Is.get(e);
    if (!r || r.from >= n || r.to <= t) {
      let l = new vi(t, e.sliceString(t, n));
      return Is.set(e, l), l;
    }
    if (r.from == t && r.to == n)
      return r;
    let { text: s, from: o } = r;
    return o > t && (s = e.sliceString(t, o) + s, o = t), r.to < n && (s += e.sliceString(r.to, n)), Is.set(e, new vi(o, s)), new vi(t, s.slice(t - o, n - o));
  }
}
class Fu {
  constructor(e, t, n, r, s) {
    this.text = e, this.to = s, this.done = !1, this.value = Nu, this.matchPos = Er(e, r), this.re = new RegExp(t, ra + (n?.ignoreCase ? "i" : "")), this.test = n?.test, this.flat = vi.get(e, r, this.chunkEnd(
      r + 5e3
      /* Chunk.Base */
    ));
  }
  chunkEnd(e) {
    return e >= this.to ? this.to : this.text.lineAt(e).to;
  }
  next() {
    for (; ; ) {
      let e = this.re.lastIndex = this.matchPos - this.flat.from, t = this.re.exec(this.flat.text);
      if (t && !t[0] && t.index == e && (this.re.lastIndex = e + 1, t = this.re.exec(this.flat.text)), t) {
        let n = this.flat.from + t.index, r = n + t[0].length;
        if ((this.flat.to >= this.to || t.index + t[0].length <= this.flat.text.length - 10) && (!this.test || this.test(n, r, t)))
          return this.value = { from: n, to: r, precise: !0, match: t }, this.matchPos = Er(this.text, r + (n == r ? 1 : 0)), this;
      }
      if (this.flat.to == this.to)
        return this.done = !0, this;
      this.flat = vi.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
typeof Symbol < "u" && (Uu.prototype[Symbol.iterator] = Fu.prototype[Symbol.iterator] = function() {
  return this;
});
function sb(i) {
  try {
    return new RegExp(i, ra), !0;
  } catch {
    return !1;
  }
}
function Er(i, e) {
  if (e >= i.length)
    return e;
  let t = i.lineAt(e), n;
  for (; e < t.to && (n = t.text.charCodeAt(e - t.from)) >= 56320 && n < 57344; )
    e++;
  return e;
}
const ob = (i) => {
  let { state: e } = i, t = String(e.doc.lineAt(i.state.selection.main.head).number), { close: n, result: r } = x0(i, {
    label: e.phrase("Go to line"),
    input: { type: "text", name: "line", value: t },
    focus: !0,
    submitLabel: e.phrase("go")
  });
  return r.then((s) => {
    let o = s && /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(s.elements.line.value);
    if (!o) {
      i.dispatch({ effects: n });
      return;
    }
    let l = e.doc.lineAt(e.selection.main.head), [, a, h, c, f] = o, O = c ? +c.slice(1) : 0, u = h ? +h : l.number;
    if (h && f) {
      let g = u / 100;
      a && (g = g * (a == "-" ? -1 : 1) + l.number / e.doc.lines), u = Math.round(e.doc.lines * g);
    } else h && a && (u = u * (a == "-" ? -1 : 1) + l.number);
    let d = e.doc.line(Math.max(1, Math.min(e.doc.lines, u))), m = b.cursor(d.from + Math.max(0, Math.min(O, d.length)));
    i.dispatch({
      effects: [n, k.scrollIntoView(m.from, { y: "center" })],
      selection: m
    });
  }), !0;
}, lb = {
  highlightWordAroundCursor: !1,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: !1
}, ab = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, lb, {
      highlightWordAroundCursor: (e, t) => e || t,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
function hb(i) {
  return [db, ub];
}
const cb = /* @__PURE__ */ Z.mark({ class: "cm-selectionMatch" }), fb = /* @__PURE__ */ Z.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
function nc(i, e, t, n) {
  return (t == 0 || i(e.sliceDoc(t - 1, t)) != K.Word) && (n == e.doc.length || i(e.sliceDoc(n, n + 1)) != K.Word);
}
function Ob(i, e, t, n) {
  return i(e.sliceDoc(t, t + 1)) == K.Word && i(e.sliceDoc(n - 1, n)) == K.Word;
}
const ub = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.decorations = this.getDeco(i);
  }
  update(i) {
    (i.selectionSet || i.docChanged || i.viewportChanged) && (this.decorations = this.getDeco(i.view));
  }
  getDeco(i) {
    let e = i.state.facet(ab), { state: t } = i, n = t.selection;
    if (n.ranges.length > 1)
      return Z.none;
    let r = n.main, s, o = null;
    if (r.empty) {
      if (!e.highlightWordAroundCursor)
        return Z.none;
      let a = t.wordAt(r.head);
      if (!a)
        return Z.none;
      o = t.charCategorizer(r.head), s = t.sliceDoc(a.from, a.to);
    } else {
      let a = r.to - r.from;
      if (a < e.minSelectionLength || a > 200)
        return Z.none;
      if (e.wholeWords) {
        if (s = t.sliceDoc(r.from, r.to), o = t.charCategorizer(r.head), !(nc(o, t, r.from, r.to) && Ob(o, t, r.from, r.to)))
          return Z.none;
      } else if (s = t.sliceDoc(r.from, r.to), !s)
        return Z.none;
    }
    let l = [];
    for (let a of i.visibleRanges) {
      let h = new qi(t.doc, s, a.from, a.to);
      for (; !h.next().done; ) {
        let { from: c, to: f } = h.value;
        if ((!o || nc(o, t, c, f)) && (r.empty && c <= r.from && f >= r.to ? l.push(fb.range(c, f)) : (c >= r.to || f <= r.from) && l.push(cb.range(c, f)), l.length > e.maxMatches))
          return Z.none;
      }
    }
    return Z.set(l);
  }
}, {
  decorations: (i) => i.decorations
}), db = /* @__PURE__ */ k.baseTheme({
  ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
  ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" }
}), pb = ({ state: i, dispatch: e }) => {
  let { selection: t } = i, n = b.create(t.ranges.map((r) => i.wordAt(r.head) || b.cursor(r.head)), t.mainIndex);
  return n.eq(t) ? !1 : (e(i.update({ selection: n })), !0);
};
function mb(i, e) {
  let { main: t, ranges: n } = i.selection, r = i.wordAt(t.head), s = r && r.from == t.from && r.to == t.to;
  for (let o = !1, l = new qi(i.doc, e, n[n.length - 1].to); ; )
    if (l.next(), l.done) {
      if (o)
        return null;
      l = new qi(i.doc, e, 0, Math.max(0, n[n.length - 1].from - 1)), o = !0;
    } else {
      if (o && n.some((a) => a.from == l.value.from))
        continue;
      if (s) {
        let a = i.wordAt(l.value.from);
        if (!a || a.from != l.value.from || a.to != l.value.to)
          continue;
      }
      return l.value;
    }
}
const gb = ({ state: i, dispatch: e }) => {
  let { ranges: t } = i.selection;
  if (t.some((s) => s.from === s.to))
    return pb({ state: i, dispatch: e });
  let n = i.sliceDoc(t[0].from, t[0].to);
  if (i.selection.ranges.some((s) => i.sliceDoc(s.from, s.to) != n))
    return !1;
  let r = mb(i, n);
  return r ? (e(i.update({
    selection: i.selection.addRange(b.range(r.from, r.to), !1),
    effects: k.scrollIntoView(r.to)
  })), !0) : !1;
}, Di = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, {
      top: !1,
      caseSensitive: !1,
      literal: !1,
      regexp: !1,
      wholeWord: !1,
      createPanel: (e) => new Zb(e),
      scrollToMatch: (e) => k.scrollIntoView(e)
    });
  }
});
class Hu {
  /**
  Create a query object.
  */
  constructor(e) {
    this.search = e.search, this.caseSensitive = !!e.caseSensitive, this.literal = !!e.literal, this.regexp = !!e.regexp, this.replace = e.replace || "", this.valid = !!this.search && (!this.regexp || sb(this.search)), this.unquoted = this.unquote(this.search), this.wholeWord = !!e.wholeWord, this.test = e.test;
  }
  /**
  @internal
  */
  unquote(e) {
    return this.literal ? e : e.replace(/\\([nrt\\])/g, (t, n) => n == "n" ? `
` : n == "r" ? "\r" : n == "t" ? "	" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(e) {
    return this.search == e.search && this.replace == e.replace && this.caseSensitive == e.caseSensitive && this.regexp == e.regexp && this.wholeWord == e.wholeWord && this.test == e.test;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new $b(this) : new bb(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(e, t = 0, n) {
    let r = e.doc ? e : V.create({ doc: e });
    return n == null && (n = r.doc.length), this.regexp ? mi(this, r, t, n) : pi(this, r, t, n);
  }
}
class Ku {
  constructor(e) {
    this.spec = e;
  }
}
function Sb(i, e, t) {
  return (n, r, s, o) => {
    if (t && !t(n, r, s, o))
      return !1;
    let l = n >= o && r <= o + s.length ? s.slice(n - o, r - o) : e.doc.sliceString(n, r);
    return i(l, e, n, r);
  };
}
function pi(i, e, t, n) {
  let r;
  return i.wholeWord && (r = Qb(e.doc, e.charCategorizer(e.selection.main.head))), i.test && (r = Sb(i.test, e, r)), new qi(e.doc, i.unquoted, t, n, i.caseSensitive ? void 0 : (s) => s.toLowerCase(), r);
}
function Qb(i, e) {
  return (t, n, r, s) => ((s > t || s + r.length < n) && (s = Math.max(0, t - 2), r = i.sliceString(s, Math.min(i.length, n + 2))), (e(Lr(r, t - s)) != K.Word || e(Br(r, t - s)) != K.Word) && (e(Br(r, n - s)) != K.Word || e(Lr(r, n - s)) != K.Word));
}
class bb extends Ku {
  constructor(e) {
    super(e);
  }
  nextMatch(e, t, n) {
    let r = pi(this.spec, e, n, e.doc.length).nextOverlapping();
    if (r.done) {
      let s = Math.min(e.doc.length, t + this.spec.unquoted.length);
      r = pi(this.spec, e, 0, s).nextOverlapping();
    }
    return r.done || r.value.from == t && r.value.to == n ? null : r.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(e, t, n) {
    for (let r = n; ; ) {
      let s = Math.max(t, r - 1e4 - this.spec.unquoted.length), o = pi(this.spec, e, s, r), l = null;
      for (; !o.nextOverlapping().done; )
        l = o.value;
      if (l)
        return l;
      if (s == t)
        return null;
      r -= 1e4;
    }
  }
  prevMatch(e, t, n) {
    let r = this.prevMatchInRange(e, 0, t);
    return r || (r = this.prevMatchInRange(e, Math.max(0, n - this.spec.unquoted.length), e.doc.length)), r && (r.from != t || r.to != n) ? r : null;
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(e, t) {
    let n = pi(this.spec, e, 0, e.doc.length), r = [];
    for (; !n.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(n.value);
    }
    return r;
  }
  highlight(e, t, n, r) {
    let s = pi(this.spec, e, Math.max(0, t - this.spec.unquoted.length), Math.min(n + this.spec.unquoted.length, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
function yb(i, e, t) {
  return (n, r, s) => (!t || t(n, r, s)) && i(s[0], e, n, r);
}
function mi(i, e, t, n) {
  let r;
  return i.wholeWord && (r = xb(e.charCategorizer(e.selection.main.head))), i.test && (r = yb(i.test, e, r)), new Uu(e.doc, i.search, { ignoreCase: !i.caseSensitive, test: r }, t, n);
}
function Lr(i, e) {
  return i.slice(ce(i, e, !1), e);
}
function Br(i, e) {
  return i.slice(e, ce(i, e));
}
function xb(i) {
  return (e, t, n) => !n[0].length || (i(Lr(n.input, n.index)) != K.Word || i(Br(n.input, n.index)) != K.Word) && (i(Br(n.input, n.index + n[0].length)) != K.Word || i(Lr(n.input, n.index + n[0].length)) != K.Word);
}
class $b extends Ku {
  nextMatch(e, t, n) {
    let r = mi(this.spec, e, n, e.doc.length).next();
    return r.done && (r = mi(this.spec, e, 0, t).next()), r.done ? null : r.value;
  }
  prevMatchInRange(e, t, n) {
    for (let r = 1; ; r++) {
      let s = Math.max(
        t,
        n - r * 1e4
        /* FindPrev.ChunkSize */
      ), o = mi(this.spec, e, s, n), l = null;
      for (; !o.next().done; )
        l = o.value;
      if (l && (s == t || l.from > s + 10))
        return l;
      if (s == t)
        return null;
    }
  }
  prevMatch(e, t, n) {
    return this.prevMatchInRange(e, 0, t) || this.prevMatchInRange(e, n, e.doc.length);
  }
  getReplacement(e) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g, (t, n) => {
      if (n == "&")
        return e.match[0];
      if (n == "$")
        return "$";
      for (let r = n.length; r > 0; r--) {
        let s = +n.slice(0, r);
        if (s > 0 && s < e.match.length)
          return e.match[s] + n.slice(r);
      }
      return t;
    });
  }
  matchAll(e, t) {
    let n = mi(this.spec, e, 0, e.doc.length), r = [];
    for (; !n.next().done; ) {
      if (r.length >= t)
        return null;
      r.push(n.value);
    }
    return r;
  }
  highlight(e, t, n, r) {
    let s = mi(this.spec, e, Math.max(
      0,
      t - 250
      /* RegExp.HighlightMargin */
    ), Math.min(n + 250, e.doc.length));
    for (; !s.next().done; )
      r(s.value.from, s.value.to);
  }
}
const Pn = /* @__PURE__ */ M.define(), sa = /* @__PURE__ */ M.define(), Rt = /* @__PURE__ */ ge.define({
  create(i) {
    return new Gs(fl(i).create(), null);
  },
  update(i, e) {
    for (let t of e.effects)
      t.is(Pn) ? i = new Gs(t.value.create(), i.panel) : t.is(sa) && (i = new Gs(i.query, t.value ? oa : null));
    return i;
  },
  provide: (i) => bn.from(i, (e) => e.panel)
});
class Gs {
  constructor(e, t) {
    this.query = e, this.panel = t;
  }
}
const Pb = /* @__PURE__ */ Z.mark({ class: "cm-searchMatch" }), kb = /* @__PURE__ */ Z.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), wb = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.view = i, this.decorations = this.highlight(i.state.field(Rt));
  }
  update(i) {
    let e = i.state.field(Rt);
    (e != i.startState.field(Rt) || i.docChanged || i.selectionSet || i.viewportChanged) && (this.decorations = this.highlight(e));
  }
  highlight({ query: i, panel: e }) {
    if (!e || !i.spec.valid)
      return Z.none;
    let { view: t } = this, n = new $t();
    for (let r = 0, s = t.visibleRanges, o = s.length; r < o; r++) {
      let { from: l, to: a } = s[r];
      for (; r < o - 1 && a > s[r + 1].from - 500; )
        a = s[++r].to;
      i.highlight(t.state, l, a, (h, c) => {
        let f = t.state.selection.ranges.some((O) => O.from == h && O.to == c);
        n.add(h, c, f ? kb : Pb);
      });
    }
    return n.finish();
  }
}, {
  decorations: (i) => i.decorations
});
function Vn(i) {
  return (e) => {
    let t = e.state.field(Rt, !1);
    return t && t.query.spec.valid ? i(e, t) : td(e);
  };
}
const Ir = /* @__PURE__ */ Vn((i, { query: e }) => {
  let { to: t } = i.state.selection.main, n = e.nextMatch(i.state, t, t);
  if (!n)
    return !1;
  let r = b.single(n.from, n.to), s = i.state.facet(Di);
  return i.dispatch({
    selection: r,
    effects: [la(i, n), s.scrollToMatch(r.main, i)],
    userEvent: "select.search"
  }), ed(i), !0;
}), Gr = /* @__PURE__ */ Vn((i, { query: e }) => {
  let { state: t } = i, { from: n } = t.selection.main, r = e.prevMatch(t, n, n);
  if (!r)
    return !1;
  let s = b.single(r.from, r.to), o = i.state.facet(Di);
  return i.dispatch({
    selection: s,
    effects: [la(i, r), o.scrollToMatch(s.main, i)],
    userEvent: "select.search"
  }), ed(i), !0;
}), vb = /* @__PURE__ */ Vn((i, { query: e }) => {
  let t = e.matchAll(i.state, 1e3);
  return !t || !t.length ? !1 : (i.dispatch({
    selection: b.create(t.map((n) => b.range(n.from, n.to))),
    userEvent: "select.search.matches"
  }), !0);
}), Tb = ({ state: i, dispatch: e }) => {
  let t = i.selection;
  if (t.ranges.length > 1 || t.main.empty)
    return !1;
  let { from: n, to: r } = t.main, s = [], o = 0;
  for (let l = new qi(i.doc, i.sliceDoc(n, r)); !l.next().done; ) {
    if (s.length > 1e3)
      return !1;
    l.value.from == n && (o = s.length), s.push(b.range(l.value.from, l.value.to));
  }
  return e(i.update({
    selection: b.create(s, o),
    userEvent: "select.search.matches"
  })), !0;
}, rc = /* @__PURE__ */ Vn((i, { query: e }) => {
  let { state: t } = i, { from: n, to: r } = t.selection.main;
  if (t.readOnly)
    return !1;
  let s = e.nextMatch(t, n, n);
  if (!s)
    return !1;
  let o = s, l = [], a, h, c = [];
  o.precise ? o.from == n && o.to == r && (h = t.toText(e.getReplacement(o)), l.push({ from: o.from, to: o.to, insert: h }), o = e.nextMatch(t, o.from, o.to), c.push(k.announce.of(t.phrase("replaced match on line $", t.doc.lineAt(n).number) + "."))) : o = e.nextMatch(t, o.from, o.to);
  let f = i.state.changes(l);
  return o && (a = b.single(o.from, o.to).map(f), c.push(la(i, o)), c.push(t.facet(Di).scrollToMatch(a.main, i))), i.dispatch({
    changes: f,
    selection: a,
    effects: c,
    userEvent: "input.replace"
  }), !0;
}), Cb = /* @__PURE__ */ Vn((i, { query: e }) => {
  if (i.state.readOnly)
    return !1;
  let t = [];
  for (let r of e.matchAll(i.state, 1e9)) {
    let { from: s, to: o, precise: l } = r;
    l && t.push({ from: s, to: o, insert: e.getReplacement(r) });
  }
  if (!t.length)
    return !1;
  let n = i.state.phrase("replaced $ matches", t.length) + ".";
  return i.dispatch({
    changes: t,
    effects: k.announce.of(n),
    userEvent: "input.replace.all"
  }), !0;
});
function oa(i) {
  return i.state.facet(Di).createPanel(i);
}
function fl(i, e) {
  var t, n, r, s, o;
  let l = i.selection.main, a = l.empty || l.to > l.from + 100 ? "" : i.sliceDoc(l.from, l.to);
  if (e && !a)
    return e;
  let h = i.facet(Di);
  return new Hu({
    search: ((t = e?.literal) !== null && t !== void 0 ? t : h.literal) ? a : a.replace(/\n/g, "\\n"),
    caseSensitive: (n = e?.caseSensitive) !== null && n !== void 0 ? n : h.caseSensitive,
    literal: (r = e?.literal) !== null && r !== void 0 ? r : h.literal,
    regexp: (s = e?.regexp) !== null && s !== void 0 ? s : h.regexp,
    wholeWord: (o = e?.wholeWord) !== null && o !== void 0 ? o : h.wholeWord
  });
}
function Ju(i) {
  let e = Il(i, oa);
  return e && e.dom.querySelector("[main-field]");
}
function ed(i) {
  let e = Ju(i);
  e && e == i.root.activeElement && e.select();
}
const td = (i) => {
  let e = i.state.field(Rt, !1);
  if (e && e.panel) {
    let t = Ju(i);
    if (t && t != i.root.activeElement) {
      let n = fl(i.state, e.query.spec);
      n.valid && i.dispatch({ effects: Pn.of(n) }), t.focus(), t.select();
    }
  } else
    i.dispatch({ effects: [
      sa.of(!0),
      e ? Pn.of(fl(i.state, e.query.spec)) : M.appendConfig.of(Ab)
    ] });
  return !0;
}, id = (i) => {
  let e = i.state.field(Rt, !1);
  if (!e || !e.panel)
    return !1;
  let t = Il(i, oa);
  return t && t.dom.contains(i.root.activeElement) && i.focus(), i.dispatch({ effects: sa.of(!1) }), !0;
}, Xb = [
  { key: "Mod-f", run: td, scope: "editor search-panel" },
  { key: "F3", run: Ir, shift: Gr, scope: "editor search-panel", preventDefault: !0 },
  { key: "Mod-g", run: Ir, shift: Gr, scope: "editor search-panel", preventDefault: !0 },
  { key: "Escape", run: id, scope: "editor search-panel" },
  { key: "Mod-Shift-l", run: Tb },
  { key: "Mod-Alt-g", run: ob },
  { key: "Mod-d", run: gb, preventDefault: !0 }
];
class Zb {
  constructor(e) {
    this.view = e;
    let t = this.query = e.state.field(Rt).query.spec;
    this.commit = this.commit.bind(this), this.searchField = I("input", {
      value: t.search,
      placeholder: Me(e, "Find"),
      "aria-label": Me(e, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.replaceField = I("input", {
      value: t.replace,
      placeholder: Me(e, "Replace"),
      "aria-label": Me(e, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    }), this.caseField = I("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: t.caseSensitive,
      onchange: this.commit
    }), this.reField = I("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: t.regexp,
      onchange: this.commit
    }), this.wordField = I("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: t.wholeWord,
      onchange: this.commit
    });
    function n(r, s, o) {
      return I("button", { class: "cm-button", name: r, onclick: s, type: "button" }, o);
    }
    this.dom = I("div", { onkeydown: (r) => this.keydown(r), class: "cm-search" }, [
      this.searchField,
      n("next", () => Ir(e), [Me(e, "next")]),
      n("prev", () => Gr(e), [Me(e, "previous")]),
      n("select", () => vb(e), [Me(e, "all")]),
      I("label", null, [this.caseField, Me(e, "match case")]),
      I("label", null, [this.reField, Me(e, "regexp")]),
      I("label", null, [this.wordField, Me(e, "by word")]),
      ...e.state.readOnly ? [] : [
        I("br"),
        this.replaceField,
        n("replace", () => rc(e), [Me(e, "replace")]),
        n("replaceAll", () => Cb(e), [Me(e, "replace all")])
      ],
      I("button", {
        name: "close",
        onclick: () => id(e),
        "aria-label": Me(e, "close"),
        type: "button"
      }, ["×"])
    ]);
  }
  commit() {
    let e = new Hu({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    e.eq(this.query) || (this.query = e, this.view.dispatch({ effects: Pn.of(e) }));
  }
  keydown(e) {
    Xg(this.view, e, "search-panel") ? e.preventDefault() : e.keyCode == 13 && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? Gr : Ir)(this.view)) : e.keyCode == 13 && e.target == this.replaceField && (e.preventDefault(), rc(this.view));
  }
  update(e) {
    for (let t of e.transactions)
      for (let n of t.effects)
        n.is(Pn) && !n.value.eq(this.query) && this.setQuery(n.value);
  }
  setQuery(e) {
    this.query = e, this.searchField.value = e.search, this.replaceField.value = e.replace, this.caseField.checked = e.caseSensitive, this.reField.checked = e.regexp, this.wordField.checked = e.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(Di).top;
  }
}
function Me(i, e) {
  return i.state.phrase(e);
}
const hr = 30, cr = /[\s\.,:;?!]/;
function la(i, { from: e, to: t }) {
  let n = i.state.doc.lineAt(e), r = i.state.doc.lineAt(t).to, s = Math.max(n.from, e - hr), o = Math.min(r, t + hr), l = i.state.sliceDoc(s, o);
  if (s != n.from) {
    for (let a = 0; a < hr; a++)
      if (!cr.test(l[a + 1]) && cr.test(l[a])) {
        l = l.slice(a);
        break;
      }
  }
  if (o != r) {
    for (let a = l.length - 1; a > l.length - hr; a--)
      if (!cr.test(l[a - 1]) && cr.test(l[a])) {
        l = l.slice(0, a);
        break;
      }
  }
  return k.announce.of(`${i.state.phrase("current match")}. ${l} ${i.state.phrase("on line")} ${n.number}.`);
}
const Rb = /* @__PURE__ */ k.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
  "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
  "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
  "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" }
}), Ab = [
  Rt,
  /* @__PURE__ */ zt.low(wb),
  Rb
];
class nd {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, n, r) {
    this.state = e, this.pos = t, this.explicit = n, this.view = r, this.abortListeners = [], this.abortOnDocChange = !1;
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = H(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), n = Math.max(t.from, this.pos - 250), r = t.text.slice(n - t.from, this.pos - t.from), s = r.search(sd(e, !1));
    return s < 0 ? null : { from: n + s, to: this.pos, text: r.slice(s) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  
  By default, running queries will not be aborted for regular
  typing or backspacing, on the assumption that they are likely to
  return a result with a
  [`validFor`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.validFor) field that
  allows the result to be used after all. Passing `onDocChange:
  true` will cause this query to be aborted for any document
  change.
  */
  addEventListener(e, t, n) {
    e == "abort" && this.abortListeners && (this.abortListeners.push(t), n && n.onDocChange && (this.abortOnDocChange = !0));
  }
}
function sc(i) {
  let e = Object.keys(i).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function Mb(i) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: r } of i) {
    e[r[0]] = !0;
    for (let s = 1; s < r.length; s++)
      t[r[s]] = !0;
  }
  let n = sc(e) + sc(t) + "*$";
  return [new RegExp("^" + n), new RegExp(n)];
}
function aa(i) {
  let e = i.map((r) => typeof r == "string" ? { label: r } : r), [t, n] = e.every((r) => /^\w+$/.test(r.label)) ? [/\w*$/, /\w+$/] : Mb(e);
  return (r) => {
    let s = r.matchBefore(n);
    return s || r.explicit ? { from: s ? s.from : r.pos, options: e, validFor: t } : null;
  };
}
function rd(i, e) {
  return (t) => {
    for (let n = H(t.state).resolveInner(t.pos, -1); n; n = n.parent) {
      if (i.indexOf(n.name) > -1)
        return null;
      if (n.type.isTop)
        break;
    }
    return e(t);
  };
}
class oc {
  constructor(e, t, n, r) {
    this.completion = e, this.source = t, this.match = n, this.score = r;
  }
}
function oi(i) {
  return i.selection.main.from;
}
function sd(i, e) {
  var t;
  let { source: n } = i, r = e && n[0] != "^", s = n[n.length - 1] != "$";
  return !r && !s ? i : new RegExp(`${r ? "^" : ""}(?:${n})${s ? "$" : ""}`, (t = i.flags) !== null && t !== void 0 ? t : i.ignoreCase ? "i" : "");
}
const ha = /* @__PURE__ */ pt.define();
function Wb(i, e, t, n) {
  let { main: r } = i.selection, s = t - r.from, o = n - r.from;
  return {
    ...i.changeByRange((l) => {
      if (l != r && t != n && i.sliceDoc(l.from + s, l.from + o) != i.sliceDoc(t, n))
        return { range: l };
      let a = i.toText(e);
      return {
        changes: { from: l.from + s, to: n == r.from ? l.to : l.from + o, insert: a },
        range: b.cursor(l.from + s + a.length)
      };
    }),
    scrollIntoView: !0,
    userEvent: "input.complete"
  };
}
const lc = /* @__PURE__ */ new WeakMap();
function qb(i) {
  if (!Array.isArray(i))
    return i;
  let e = lc.get(i);
  return e || lc.set(i, e = aa(i)), e;
}
const Nr = /* @__PURE__ */ M.define(), kn = /* @__PURE__ */ M.define();
class Yb {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let n = Te(e, t), r = st(n);
      this.chars.push(n);
      let s = e.slice(t, t + r), o = s.toUpperCase();
      this.folded.push(Te(o == s ? s.toLowerCase() : o, 0)), t += r;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, this;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return null;
    let { chars: t, folded: n, any: r, precise: s, byWord: o } = this;
    if (t.length == 1) {
      let Q = Te(e, 0), y = st(Q), w = y == e.length ? 0 : -100;
      if (Q != t[0]) if (Q == n[0])
        w += -200;
      else
        return null;
      return this.ret(w, [0, y]);
    }
    let l = e.indexOf(this.pattern);
    if (l == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = t.length, h = 0;
    if (l < 0) {
      for (let Q = 0, y = Math.min(e.length, 200); Q < y && h < a; ) {
        let w = Te(e, Q);
        (w == t[h] || w == n[h]) && (r[h++] = Q), Q += st(w);
      }
      if (h < a)
        return null;
    }
    let c = 0, f = 0, O = !1, u = 0, d = -1, m = -1, g = /[a-z]/.test(e), S = !0;
    for (let Q = 0, y = Math.min(e.length, 200), w = 0; Q < y && f < a; ) {
      let x = Te(e, Q);
      l < 0 && (c < a && x == t[c] && (s[c++] = Q), u < a && (x == t[u] || x == n[u] ? (u == 0 && (d = Q), m = Q + 1, u++) : u = 0));
      let $, P = x < 255 ? x >= 48 && x <= 57 || x >= 97 && x <= 122 ? 2 : x >= 65 && x <= 90 ? 1 : 0 : ($ = Tl(x)) != $.toLowerCase() ? 1 : $ != $.toUpperCase() ? 2 : 0;
      (!Q || P == 1 && g || w == 0 && P != 0) && (t[f] == x || n[f] == x && (O = !0) ? o[f++] = Q : o.length && (S = !1)), w = P, Q += st(x);
    }
    return f == a && o[0] == 0 && S ? this.result(-100 + (O ? -200 : 0), o, e) : u == a && d == 0 ? this.ret(-200 - e.length + (m == e.length ? 0 : -100), [0, m]) : l > -1 ? this.ret(-700 - e.length, [l, l + this.pattern.length]) : u == a ? this.ret(-900 - e.length, [d, m]) : f == a ? this.result(-100 + (O ? -200 : 0) + -700 + (S ? 0 : -1100), o, e) : t.length == 2 ? null : this.result((r[0] ? -700 : 0) + -200 + -1100, r, e);
  }
  result(e, t, n) {
    let r = [], s = 0;
    for (let o of t) {
      let l = o + (this.astral ? st(Te(n, o)) : 1);
      s && r[s - 1] == o ? r[s - 1] = l : (r[s++] = o, r[s++] = l);
    }
    return this.ret(e - n.length, r);
  }
}
class _b {
  constructor(e) {
    this.pattern = e, this.matched = [], this.score = 0, this.folded = e.toLowerCase();
  }
  match(e) {
    if (e.length < this.pattern.length)
      return null;
    let t = e.slice(0, this.pattern.length), n = t == this.pattern ? 0 : t.toLowerCase() == this.folded ? -200 : null;
    return n == null ? null : (this.matched = [0, t.length], this.score = n + (e.length == this.pattern.length ? 0 : -100), this);
  }
}
const he = /* @__PURE__ */ C.define({
  combine(i) {
    return mt(i, {
      activateOnTyping: !0,
      activateOnCompletion: () => !1,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: jb,
      filterStrict: !1,
      compareCompletions: (e, t) => (e.sortText || e.label).localeCompare(t.sortText || t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (n) => ac(e(n), t(n)),
      optionClass: (e, t) => (n) => ac(e(n), t(n)),
      addToOptions: (e, t) => e.concat(t),
      filterStrict: (e, t) => e || t
    });
  }
});
function ac(i, e) {
  return i ? e ? i + " " + e : i : e;
}
function jb(i, e, t, n, r, s) {
  let o = i.textDirection == U.RTL, l = o, a = !1, h = "top", c, f, O = e.left - r.left, u = r.right - e.right, d = n.right - n.left, m = n.bottom - n.top;
  if (l && O < Math.min(d, u) ? l = !1 : !l && u < Math.min(d, O) && (l = !0), d <= (l ? O : u))
    c = Math.max(r.top, Math.min(t.top, r.bottom - m)) - e.top, f = Math.min(400, l ? O : u);
  else {
    a = !0, f = Math.min(
      400,
      (o ? e.right : r.right - e.left) - 30
      /* Info.Margin */
    );
    let Q = r.bottom - e.bottom;
    Q >= m || Q > e.top ? c = t.bottom - e.top : (h = "bottom", c = e.bottom - t.top);
  }
  let g = (e.bottom - e.top) / s.offsetHeight, S = (e.right - e.left) / s.offsetWidth;
  return {
    style: `${h}: ${c / g}px; max-width: ${f / S}px`,
    class: "cm-completionInfo-" + (a ? o ? "left-narrow" : "right-narrow" : l ? "left" : "right")
  };
}
const ca = /* @__PURE__ */ M.define();
function zb(i) {
  let e = i.addToOptions.slice();
  return i.icons && e.push({
    render(t) {
      let n = document.createElement("div");
      return n.classList.add("cm-completionIcon"), t.type && n.classList.add(...t.type.split(/\s+/g).map((r) => "cm-completionIcon-" + r)), n.setAttribute("aria-hidden", "true"), n;
    },
    position: 20
  }), e.push({
    render(t, n, r, s) {
      let o = document.createElement("span");
      o.className = "cm-completionLabel";
      let l = t.displayLabel || t.label, a = 0;
      for (let h = 0; h < s.length; ) {
        let c = s[h++], f = s[h++];
        c > a && o.appendChild(document.createTextNode(l.slice(a, c)));
        let O = o.appendChild(document.createElement("span"));
        O.appendChild(document.createTextNode(l.slice(c, f))), O.className = "cm-completionMatchedText", a = f;
      }
      return a < l.length && o.appendChild(document.createTextNode(l.slice(a))), o;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let n = document.createElement("span");
      return n.className = "cm-completionDetail", n.textContent = t.detail, n;
    },
    position: 80
  }), e.sort((t, n) => t.position - n.position).map((t) => t.render);
}
function Ns(i, e, t) {
  if (i <= t)
    return { from: 0, to: i };
  if (e < 0 && (e = 0), e <= i >> 1) {
    let r = Math.floor(e / t);
    return { from: r * t, to: (r + 1) * t };
  }
  let n = Math.ceil((i - e) / t);
  return { from: i - n * t, to: i - (n - 1) * t };
}
class Vb {
  constructor(e, t, n) {
    this.view = e, this.stateField = t, this.applyCompletion = n, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let r = e.state.field(t), { options: s, selected: o } = r.open, l = e.state.facet(he);
    this.optionContent = zb(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = Ns(s.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (a) => {
      let { options: h } = e.state.field(t).open;
      for (let c = a.target, f; c && c != this.dom; c = c.parentNode)
        if (c.nodeName == "LI" && (f = /-(\d+)$/.exec(c.id)) && +f[1] < h.length) {
          this.applyCompletion(e, h[+f[1]]), a.preventDefault();
          return;
        }
      if (a.target == this.list) {
        let c = this.list.classList.contains("cm-completionListIncompleteTop") && a.clientY < this.list.firstChild.getBoundingClientRect().top ? this.range.from - 1 : this.list.classList.contains("cm-completionListIncompleteBottom") && a.clientY > this.list.lastChild.getBoundingClientRect().bottom ? this.range.to : null;
        c != null && (e.dispatch({ effects: ca.of(c) }), a.preventDefault());
      }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = e.state.field(this.stateField, !1);
      h && h.tooltip && e.state.facet(he).closeOnBlur && a.relatedTarget != e.contentDOM && e.dispatch({ effects: kn.of(null) });
    }), this.showOptions(s, r.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let n = e.state.field(this.stateField), r = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), n != r) {
      let { options: s, selected: o, disabled: l } = n.open;
      (!r.open || r.open.options != s) && (this.range = Ns(s.length, o, e.state.facet(he).maxRenderedOptions), this.showOptions(s, n.id)), this.updateSel(), l != ((t = r.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let n of this.currentClass.split(" "))
        n && this.dom.classList.remove(n);
      for (let n of t.split(" "))
        n && this.dom.classList.add(n);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    (t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = Ns(t.options.length, t.selected, this.view.state.facet(he).maxRenderedOptions), this.showOptions(t.options, e.id));
    let n = this.updateSelectedOption(t.selected);
    if (n) {
      this.destroyInfo();
      let { completion: r } = t.options[t.selected], { info: s } = r;
      if (!s)
        return;
      let o = typeof s == "string" ? document.createTextNode(s) : s(r);
      if (!o)
        return;
      "then" in o ? o.then((l) => {
        l && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(l, r);
      }).catch((l) => Ze(this.view.state, l, "completion info")) : (this.addInfoPane(o, r), n.setAttribute("aria-describedby", this.info.id));
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let n = this.info = document.createElement("div");
    if (n.className = "cm-tooltip cm-completionInfo", n.id = "cm-completionInfo-" + Math.floor(Math.random() * 65535).toString(16), e.nodeType != null)
      n.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: r, destroy: s } = e;
      n.appendChild(r), this.infoDestroy = s || null;
    }
    this.dom.appendChild(n), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let n = this.list.firstChild, r = this.range.from; n; n = n.nextSibling, r++)
      n.nodeName != "LI" || !n.id ? r-- : r == e ? n.hasAttribute("aria-selected") || (n.setAttribute("aria-selected", "true"), t = n) : n.hasAttribute("aria-selected") && (n.removeAttribute("aria-selected"), n.removeAttribute("aria-describedby"));
    return t && Eb(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), n = this.info.getBoundingClientRect(), r = e.getBoundingClientRect(), s = this.space;
    if (!s) {
      let o = this.dom.ownerDocument.documentElement;
      s = { left: 0, top: 0, right: o.clientWidth, bottom: o.clientHeight };
    }
    return r.top > Math.min(s.bottom, t.bottom) - 10 || r.bottom < Math.max(s.top, t.top) + 10 ? null : this.view.state.facet(he).positionInfo(this.view, t, r, n, s, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, n) {
    const r = document.createElement("ul");
    r.id = t, r.setAttribute("role", "listbox"), r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-label", this.view.state.phrase("Completions")), r.addEventListener("mousedown", (o) => {
      o.target == r && o.preventDefault();
    });
    let s = null;
    for (let o = n.from; o < n.to; o++) {
      let { completion: l, match: a } = e[o], { section: h } = l;
      if (h) {
        let O = typeof h == "string" ? h : h.name;
        if (O != s && (o > n.from || n.from == 0))
          if (s = O, typeof h != "string" && h.header)
            r.appendChild(h.header(h));
          else {
            let u = r.appendChild(document.createElement("completion-section"));
            u.textContent = O;
          }
      }
      const c = r.appendChild(document.createElement("li"));
      c.id = t + "-" + o, c.setAttribute("role", "option");
      let f = this.optionClass(l);
      f && (c.className = f);
      for (let O of this.optionContent) {
        let u = O(l, this.view.state, this.view, a);
        u && c.appendChild(u);
      }
    }
    return n.from && r.classList.add("cm-completionListIncompleteTop"), n.to < e.length && r.classList.add("cm-completionListIncompleteBottom"), r;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function Db(i, e) {
  return (t) => new Vb(t, i, e);
}
function Eb(i, e) {
  let t = i.getBoundingClientRect(), n = e.getBoundingClientRect(), r = t.height / i.offsetHeight;
  n.top < t.top ? i.scrollTop -= (t.top - n.top) / r : n.bottom > t.bottom && (i.scrollTop += (n.bottom - t.bottom) / r);
}
function hc(i) {
  return (i.boost || 0) * 100 + (i.apply ? 10 : 0) + (i.info ? 5 : 0) + (i.type ? 1 : 0);
}
function Lb(i, e) {
  let t = [], n = null, r = null, s = (c) => {
    t.push(c);
    let { section: f } = c.completion;
    if (f) {
      n || (n = []);
      let O = typeof f == "string" ? f : f.name;
      n.some((u) => u.name == O) || n.push(typeof f == "string" ? { name: O } : f);
    }
  }, o = e.facet(he);
  for (let c of i)
    if (c.hasResult()) {
      let f = c.result.getMatch;
      if (c.result.filter === !1)
        for (let O of c.result.options)
          s(new oc(O, c.source, f ? f(O) : [], 1e9 - t.length));
      else {
        let O = e.sliceDoc(c.from, c.to), u, d = o.filterStrict ? new _b(O) : new Yb(O);
        for (let m of c.result.options)
          if (u = d.match(m.label)) {
            let g = m.displayLabel ? f ? f(m, u.matched) : [] : u.matched, S = u.score + (m.boost || 0);
            if (s(new oc(m, c.source, g, S)), typeof m.section == "object" && m.section.rank === "dynamic") {
              let { name: Q } = m.section;
              r || (r = /* @__PURE__ */ Object.create(null)), r[Q] = Math.max(S, r[Q] || -1e9);
            }
          }
      }
    }
  if (n) {
    let c = /* @__PURE__ */ Object.create(null), f = 0, O = (u, d) => (u.rank === "dynamic" && d.rank === "dynamic" ? r[d.name] - r[u.name] : 0) || (typeof u.rank == "number" ? u.rank : 1e9) - (typeof d.rank == "number" ? d.rank : 1e9) || (u.name < d.name ? -1 : 1);
    for (let u of n.sort(O))
      f -= 1e5, c[u.name] = f;
    for (let u of t) {
      let { section: d } = u.completion;
      d && (u.score += c[typeof d == "string" ? d : d.name]);
    }
  }
  let l = [], a = null, h = o.compareCompletions;
  for (let c of t.sort((f, O) => O.score - f.score || h(f.completion, O.completion))) {
    let f = c.completion;
    !a || a.label != f.label || a.detail != f.detail || a.type != null && f.type != null && a.type != f.type || a.apply != f.apply || a.boost != f.boost ? l.push(c) : hc(c.completion) > hc(a) && (l[l.length - 1] = c), a = c.completion;
  }
  return l;
}
class yi {
  constructor(e, t, n, r, s, o) {
    this.options = e, this.attrs = t, this.tooltip = n, this.timestamp = r, this.selected = s, this.disabled = o;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new yi(this.options, cc(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, n, r, s, o) {
    if (r && !o && e.some((h) => h.isPending))
      return r.setDisabled();
    let l = Lb(e, t);
    if (!l.length)
      return r && e.some((h) => h.isPending) ? r.setDisabled() : null;
    let a = t.facet(he).selectOnOpen ? 0 : -1;
    if (r && r.selected != a && r.selected != -1) {
      let h = r.options[r.selected].completion;
      for (let c = 0; c < l.length; c++)
        if (l[c].completion == h) {
          a = c;
          break;
        }
    }
    return new yi(l, cc(n, a), {
      pos: e.reduce((h, c) => c.hasResult() ? Math.min(h, c.from) : h, 1e8),
      create: Fb,
      above: s.aboveCursor
    }, r ? r.timestamp : Date.now(), a, !1);
  }
  map(e) {
    return new yi(this.options, this.attrs, { ...this.tooltip, pos: e.mapPos(this.tooltip.pos) }, this.timestamp, this.selected, this.disabled);
  }
  setDisabled() {
    return new yi(this.options, this.attrs, this.tooltip, this.timestamp, this.selected, !0);
  }
}
class Ur {
  constructor(e, t, n) {
    this.active = e, this.id = t, this.open = n;
  }
  static start() {
    return new Ur(Nb, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, n = t.facet(he), s = (n.override || t.languageDataAt("autocomplete", oi(t)).map(qb)).map((a) => (this.active.find((c) => c.source == a) || new De(
      a,
      this.active.some(
        (c) => c.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, n));
    s.length == this.active.length && s.every((a, h) => a == this.active[h]) && (s = this.active);
    let o = this.open, l = e.effects.some((a) => a.is(fa));
    o && e.docChanged && (o = o.map(e.changes)), e.selection || s.some((a) => a.hasResult() && e.changes.touchesRange(a.from, a.to)) || !Bb(s, this.active) || l ? o = yi.build(s, t, this.id, o, n, l) : o && o.disabled && !s.some((a) => a.isPending) && (o = null), !o && s.every((a) => !a.isPending) && s.some((a) => a.hasResult()) && (s = s.map((a) => a.hasResult() ? new De(
      a.source,
      0
      /* State.Inactive */
    ) : a));
    for (let a of e.effects)
      a.is(ca) && (o = o && o.setSelected(a.value, this.id));
    return s == this.active && o == this.open ? this : new Ur(s, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : this.active.length ? Ib : Gb;
  }
}
function Bb(i, e) {
  if (i == e)
    return !0;
  for (let t = 0, n = 0; ; ) {
    for (; t < i.length && !i[t].hasResult(); )
      t++;
    for (; n < e.length && !e[n].hasResult(); )
      n++;
    let r = t == i.length, s = n == e.length;
    if (r || s)
      return r == s;
    if (i[t++].result != e[n++].result)
      return !1;
  }
}
const Ib = {
  "aria-autocomplete": "list"
}, Gb = {};
function cc(i, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": i
  };
  return e > -1 && (t["aria-activedescendant"] = i + "-" + e), t;
}
const Nb = [];
function od(i, e) {
  if (i.isUserEvent("input.complete")) {
    let n = i.annotation(ha);
    if (n && e.activateOnCompletion(n))
      return 12;
  }
  let t = i.isUserEvent("input.type");
  return t && e.activateOnTyping ? 5 : t ? 1 : i.isUserEvent("delete.backward") ? 2 : i.selection ? 8 : i.docChanged ? 16 : 0;
}
class De {
  constructor(e, t, n = !1) {
    this.source = e, this.state = t, this.explicit = n;
  }
  hasResult() {
    return !1;
  }
  get isPending() {
    return this.state == 1;
  }
  update(e, t) {
    let n = od(e, t), r = this;
    (n & 8 || n & 16 && this.touches(e)) && (r = new De(
      r.source,
      0
      /* State.Inactive */
    )), n & 4 && r.state == 0 && (r = new De(
      this.source,
      1
      /* State.Pending */
    )), r = r.updateFor(e, n);
    for (let s of e.effects)
      if (s.is(Nr))
        r = new De(r.source, 1, s.value);
      else if (s.is(kn))
        r = new De(
          r.source,
          0
          /* State.Inactive */
        );
      else if (s.is(fa))
        for (let o of s.value)
          o.source == r.source && (r = o);
    return r;
  }
  updateFor(e, t) {
    return this.map(e.changes);
  }
  map(e) {
    return this;
  }
  touches(e) {
    return e.changes.touchesRange(oi(e.state));
  }
}
class Ti extends De {
  constructor(e, t, n, r, s, o) {
    super(e, 3, t), this.limit = n, this.result = r, this.from = s, this.to = o;
  }
  hasResult() {
    return !0;
  }
  updateFor(e, t) {
    var n;
    if (!(t & 3))
      return this.map(e.changes);
    let r = this.result;
    r.map && !e.changes.empty && (r = r.map(r, e.changes));
    let s = e.changes.mapPos(this.from), o = e.changes.mapPos(this.to, 1), l = oi(e.state);
    if (l > o || !r || t & 2 && (oi(e.startState) == this.from || l < this.limit))
      return new De(
        this.source,
        t & 4 ? 1 : 0
        /* State.Inactive */
      );
    let a = e.changes.mapPos(this.limit);
    return Ub(r.validFor, e.state, s, o) ? new Ti(this.source, this.explicit, a, r, s, o) : r.update && (r = r.update(r, s, o, new nd(e.state, l, !1))) ? new Ti(this.source, this.explicit, a, r, r.from, (n = r.to) !== null && n !== void 0 ? n : oi(e.state)) : new De(this.source, 1, this.explicit);
  }
  map(e) {
    if (e.empty)
      return this;
    let t = this.result.map ? this.result.map(this.result, e) : this.result;
    return t ? new Ti(this.source, this.explicit, e.mapPos(this.limit), t, e.mapPos(this.from), e.mapPos(this.to, 1)) : new De(
      this.source,
      0
      /* State.Inactive */
    );
  }
  touches(e) {
    return e.changes.touchesRange(this.from, this.to);
  }
}
function Ub(i, e, t, n) {
  if (!i)
    return !1;
  let r = e.sliceDoc(t, n);
  return typeof i == "function" ? i(r, t, n, e) : sd(i, !0).test(r);
}
const fa = /* @__PURE__ */ M.define({
  map(i, e) {
    return i.map((t) => t.map(e));
  }
}), Ce = /* @__PURE__ */ ge.define({
  create() {
    return Ur.start();
  },
  update(i, e) {
    return i.update(e);
  },
  provide: (i) => [
    Bl.from(i, (e) => e.tooltip),
    k.contentAttributes.from(i, (e) => e.attrs)
  ]
});
function Oa(i, e) {
  const t = e.completion.apply || e.completion.label;
  let n = i.state.field(Ce).active.find((r) => r.source == e.source);
  return n instanceof Ti ? (typeof t == "string" ? i.dispatch({
    ...Wb(i.state, t, n.from, n.to),
    annotations: ha.of(e.completion)
  }) : t(i, e.completion, n.from, n.to), !0) : !1;
}
const Fb = /* @__PURE__ */ Db(Ce, Oa);
function fr(i, e = "option") {
  return (t) => {
    let n = t.state.field(Ce, !1);
    if (!n || !n.open || n.open.disabled || Date.now() - n.open.timestamp < t.state.facet(he).interactionDelay)
      return !1;
    let r = 1, s;
    e == "page" && (s = jO(t, n.open.tooltip)) && (r = Math.max(2, Math.floor(s.dom.offsetHeight / s.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = n.open.options, l = n.open.selected > -1 ? n.open.selected + r * (i ? 1 : -1) : i ? 0 : o - 1;
    return l < 0 ? l = e == "page" ? 0 : o - 1 : l >= o && (l = e == "page" ? o - 1 : 0), t.dispatch({ effects: ca.of(l) }), !0;
  };
}
const Hb = (i) => {
  let e = i.state.field(Ce, !1);
  return i.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < i.state.facet(he).interactionDelay ? !1 : Oa(i, e.open.options[e.open.selected]);
}, Us = (i) => i.state.field(Ce, !1) ? (i.dispatch({ effects: Nr.of(!0) }), !0) : !1, Kb = (i) => {
  let e = i.state.field(Ce, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (i.dispatch({ effects: kn.of(null) }), !0);
};
class Jb {
  constructor(e, t) {
    this.active = e, this.context = t, this.time = Date.now(), this.updates = [], this.done = void 0;
  }
}
const e1 = 50, t1 = 1e3, i1 = /* @__PURE__ */ ie.fromClass(class {
  constructor(i) {
    this.view = i, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.pendingStart = !1, this.composing = 0;
    for (let e of i.state.field(Ce).active)
      e.isPending && this.startQuery(e);
  }
  update(i) {
    let e = i.state.field(Ce), t = i.state.facet(he);
    if (!i.selectionSet && !i.docChanged && i.startState.field(Ce) == e)
      return;
    let n = i.transactions.some((s) => {
      let o = od(s, t);
      return o & 8 || (s.selection || s.docChanged) && !(o & 3);
    });
    for (let s = 0; s < this.running.length; s++) {
      let o = this.running[s];
      if (n || o.context.abortOnDocChange && i.docChanged || o.updates.length + i.transactions.length > e1 && Date.now() - o.time > t1) {
        for (let l of o.context.abortListeners)
          try {
            l();
          } catch (a) {
            Ze(this.view.state, a);
          }
        o.context.abortListeners = null, this.running.splice(s--, 1);
      } else
        o.updates.push(...i.transactions);
    }
    this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), i.transactions.some((s) => s.effects.some((o) => o.is(Nr))) && (this.pendingStart = !0);
    let r = this.pendingStart ? 50 : t.activateOnTypingDelay;
    if (this.debounceUpdate = e.active.some((s) => s.isPending && !this.running.some((o) => o.active.source == s.source)) ? setTimeout(() => this.startUpdate(), r) : -1, this.composing != 0)
      for (let s of i.transactions)
        s.isUserEvent("input.type") ? this.composing = 2 : this.composing == 2 && s.selection && (this.composing = 3);
  }
  startUpdate() {
    this.debounceUpdate = -1, this.pendingStart = !1;
    let { state: i } = this.view, e = i.field(Ce);
    for (let t of e.active)
      t.isPending && !this.running.some((n) => n.active.source == t.source) && this.startQuery(t);
    this.running.length && e.open && e.open.disabled && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(he).updateSyncTime));
  }
  startQuery(i) {
    let { state: e } = this.view, t = oi(e), n = new nd(e, t, i.explicit, this.view), r = new Jb(i, n);
    this.running.push(r), Promise.resolve(i.source(n)).then((s) => {
      r.context.aborted || (r.done = s || null, this.scheduleAccept());
    }, (s) => {
      this.view.dispatch({ effects: kn.of(null) }), Ze(this.view.state, s);
    });
  }
  scheduleAccept() {
    this.running.every((i) => i.done !== void 0) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(() => this.accept(), this.view.state.facet(he).updateSyncTime));
  }
  // For each finished query in this.running, try to create a result
  // or, if appropriate, restart the query.
  accept() {
    var i;
    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
    let e = [], t = this.view.state.facet(he), n = this.view.state.field(Ce);
    for (let r = 0; r < this.running.length; r++) {
      let s = this.running[r];
      if (s.done === void 0)
        continue;
      if (this.running.splice(r--, 1), s.done) {
        let l = oi(s.updates.length ? s.updates[0].startState : this.view.state), a = Math.min(l, s.done.from + (s.active.explicit ? 0 : 1)), h = new Ti(s.active.source, s.active.explicit, a, s.done, s.done.from, (i = s.done.to) !== null && i !== void 0 ? i : l);
        for (let c of s.updates)
          h = h.update(c, t);
        if (h.hasResult()) {
          e.push(h);
          continue;
        }
      }
      let o = n.active.find((l) => l.source == s.active.source);
      if (o && o.isPending)
        if (s.done == null) {
          let l = new De(
            s.active.source,
            0
            /* State.Inactive */
          );
          for (let a of s.updates)
            l = l.update(a, t);
          l.isPending || e.push(l);
        } else
          this.startQuery(o);
    }
    (e.length || n.open && n.open.disabled) && this.view.dispatch({ effects: fa.of(e) });
  }
}, {
  eventHandlers: {
    blur(i) {
      let e = this.view.state.field(Ce, !1);
      if (e && e.tooltip && this.view.state.facet(he).closeOnBlur) {
        let t = e.open && jO(this.view, e.open.tooltip);
        (!t || !t.dom.contains(i.relatedTarget)) && setTimeout(() => this.view.dispatch({ effects: kn.of(null) }), 10);
      }
    },
    compositionstart() {
      this.composing = 1;
    },
    compositionend() {
      this.composing == 3 && setTimeout(() => this.view.dispatch({ effects: Nr.of(!1) }), 20), this.composing = 0;
    }
  }
}), n1 = typeof navigator == "object" && /* @__PURE__ */ /Win/.test(navigator.platform), r1 = /* @__PURE__ */ zt.highest(/* @__PURE__ */ k.domEventHandlers({
  keydown(i, e) {
    let t = e.state.field(Ce, !1);
    if (!t || !t.open || t.open.disabled || t.open.selected < 0 || i.key.length > 1 || i.ctrlKey && !(n1 && i.altKey) || i.metaKey)
      return !1;
    let n = t.open.options[t.open.selected], r = t.active.find((o) => o.source == n.source), s = n.completion.commitCharacters || r.result.commitCharacters;
    return s && s.indexOf(i.key) > -1 && Oa(e, n), !1;
  }
})), ld = /* @__PURE__ */ k.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center",
    cursor: "pointer"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class s1 {
  constructor(e, t, n, r) {
    this.field = e, this.line = t, this.from = n, this.to = r;
  }
}
class ua {
  constructor(e, t, n) {
    this.field = e, this.from = t, this.to = n;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, pe.TrackDel), n = e.mapPos(this.to, 1, pe.TrackDel);
    return t == null || n == null ? null : new ua(this.field, t, n);
  }
}
class da {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let n = [], r = [t], s = e.doc.lineAt(t), o = /^\s*/.exec(s.text)[0];
    for (let a of this.lines) {
      if (n.length) {
        let h = o, c = /^\t*/.exec(a)[0].length;
        for (let f = 0; f < c; f++)
          h += e.facet(Yn);
        r.push(t + h.length - c), a = h + a.slice(c);
      }
      n.push(a), t += a.length + 1;
    }
    let l = this.fieldPositions.map((a) => new ua(a.field, r[a.line] + a.from, r[a.line] + a.to));
    return { text: n, ranges: l };
  }
  static parse(e) {
    let t = [], n = [], r = [], s;
    for (let o of e.split(/\r\n?|\n/)) {
      for (; s = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(o); ) {
        let l = s[1] ? +s[1] : null, a = s[2] || s[3] || "", h = -1;
        l === 0 && (l = 1e9);
        let c = a.replace(/\\[{}]/g, (f) => f[1]);
        for (let f = 0; f < t.length; f++)
          (l != null ? t[f].seq == l : c && t[f].name == c) && (h = f);
        if (h < 0) {
          let f = 0;
          for (; f < t.length && (l == null || t[f].seq != null && t[f].seq < l); )
            f++;
          t.splice(f, 0, { seq: l, name: c }), h = f;
          for (let O of r)
            O.field >= h && O.field++;
        }
        for (let f of r)
          if (f.line == n.length && f.from > s.index) {
            let O = s[2] ? 3 + (s[1] || "").length : 2;
            f.from -= O, f.to -= O;
          }
        r.push(new s1(h, n.length, s.index, s.index + c.length)), o = o.slice(0, s.index) + a + o.slice(s.index + s[0].length);
      }
      o = o.replace(/\\([{}])/g, (l, a, h) => {
        for (let c of r)
          c.line == n.length && c.from > h && (c.from--, c.to--);
        return a;
      }), n.push(o);
    }
    return new da(n, r);
  }
}
let o1 = /* @__PURE__ */ Z.widget({ widget: /* @__PURE__ */ new class extends Ue {
  toDOM() {
    let i = document.createElement("span");
    return i.className = "cm-snippetFieldPosition", i;
  }
  ignoreEvent() {
    return !1;
  }
}() }), l1 = /* @__PURE__ */ Z.mark({ class: "cm-snippetField" });
class Ei {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = Z.set(e.map((n) => (n.from == n.to ? o1 : l1).range(n.from, n.to)), !0);
  }
  map(e) {
    let t = [];
    for (let n of this.ranges) {
      let r = n.map(e);
      if (!r)
        return null;
      t.push(r);
    }
    return new Ei(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((n) => n.field == this.active && n.from <= t.from && n.to >= t.to));
  }
}
const Dn = /* @__PURE__ */ M.define({
  map(i, e) {
    return i && i.map(e);
  }
}), a1 = /* @__PURE__ */ M.define(), wn = /* @__PURE__ */ ge.define({
  create() {
    return null;
  },
  update(i, e) {
    for (let t of e.effects) {
      if (t.is(Dn))
        return t.value;
      if (t.is(a1) && i)
        return new Ei(i.ranges, t.value);
    }
    return i && e.docChanged && (i = i.map(e.changes)), i && e.selection && !i.selectionInsideField(e.selection) && (i = null), i;
  },
  provide: (i) => k.decorations.from(i, (e) => e ? e.deco : Z.none)
});
function pa(i, e) {
  return b.create(i.filter((t) => t.field == e).map((t) => b.range(t.from, t.to)));
}
function h1(i) {
  let e = da.parse(i);
  return (t, n, r, s) => {
    let { text: o, ranges: l } = e.instantiate(t.state, r), { main: a } = t.state.selection, h = {
      changes: { from: r, to: s == a.from ? a.to : s, insert: D.of(o) },
      scrollIntoView: !0,
      annotations: n ? [ha.of(n), se.userEvent.of("input.complete")] : void 0
    };
    if (l.length && (h.selection = pa(l, 0)), l.some((c) => c.field > 0)) {
      let c = new Ei(l, 0), f = h.effects = [Dn.of(c)];
      t.state.field(wn, !1) === void 0 && f.push(M.appendConfig.of([wn, d1, p1, ld]));
    }
    t.dispatch(t.state.update(h));
  };
}
function ad(i) {
  return ({ state: e, dispatch: t }) => {
    let n = e.field(wn, !1);
    if (!n || i < 0 && n.active == 0)
      return !1;
    let r = n.active + i, s = i > 0 && !n.ranges.some((o) => o.field == r + i);
    return t(e.update({
      selection: pa(n.ranges, r),
      effects: Dn.of(s ? null : new Ei(n.ranges, r)),
      scrollIntoView: !0
    })), !0;
  };
}
const c1 = ({ state: i, dispatch: e }) => i.field(wn, !1) ? (e(i.update({ effects: Dn.of(null) })), !0) : !1, f1 = /* @__PURE__ */ ad(1), O1 = /* @__PURE__ */ ad(-1), u1 = [
  { key: "Tab", run: f1, shift: O1 },
  { key: "Escape", run: c1 }
], fc = /* @__PURE__ */ C.define({
  combine(i) {
    return i.length ? i[0] : u1;
  }
}), d1 = /* @__PURE__ */ zt.highest(/* @__PURE__ */ qn.compute([fc], (i) => i.facet(fc)));
function ve(i, e) {
  return { ...e, apply: h1(i) };
}
const p1 = /* @__PURE__ */ k.domEventHandlers({
  mousedown(i, e) {
    let t = e.state.field(wn, !1), n;
    if (!t || (n = e.posAtCoords({ x: i.clientX, y: i.clientY })) == null)
      return !1;
    let r = t.ranges.find((s) => s.from <= n && s.to >= n);
    return !r || r.field == t.active ? !1 : (e.dispatch({
      selection: pa(t.ranges, r.field),
      effects: Dn.of(t.ranges.some((s) => s.field > r.field) ? new Ei(t.ranges, r.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), vn = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, ii = /* @__PURE__ */ M.define({
  map(i, e) {
    let t = e.mapPos(i, -1, pe.TrackAfter);
    return t ?? void 0;
  }
}), ma = /* @__PURE__ */ new class extends At {
}();
ma.startSide = 1;
ma.endSide = -1;
const hd = /* @__PURE__ */ ge.define({
  create() {
    return j.empty;
  },
  update(i, e) {
    if (i = i.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      i = i.update({ filter: (n) => n >= t.from && n <= t.to });
    }
    for (let t of e.effects)
      t.is(ii) && (i = i.update({ add: [ma.range(t.value, t.value + 1)] }));
    return i;
  }
});
function m1() {
  return [S1, hd];
}
const Fs = "()[]{}<>«»»«［］｛｝";
function cd(i) {
  for (let e = 0; e < Fs.length; e += 2)
    if (Fs.charCodeAt(e) == i)
      return Fs.charAt(e + 1);
  return Tl(i < 128 ? i : i + 1);
}
function fd(i, e) {
  return i.languageDataAt("closeBrackets", e)[0] || vn;
}
const g1 = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), S1 = /* @__PURE__ */ k.inputHandler.of((i, e, t, n) => {
  if ((g1 ? i.composing : i.compositionStarted) || i.state.readOnly)
    return !1;
  let r = i.state.selection.main;
  if (n.length > 2 || n.length == 2 && st(Te(n, 0)) == 1 || e != r.from || t != r.to)
    return !1;
  let s = y1(i.state, n);
  return s ? (i.dispatch(s), !0) : !1;
}), Q1 = ({ state: i, dispatch: e }) => {
  if (i.readOnly)
    return !1;
  let n = fd(i, i.selection.main.head).brackets || vn.brackets, r = null, s = i.changeByRange((o) => {
    if (o.empty) {
      let l = x1(i.doc, o.head);
      for (let a of n)
        if (a == l && Qs(i.doc, o.head) == cd(Te(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: b.cursor(o.head - a.length)
          };
    }
    return { range: r = o };
  });
  return r || e(i.update(s, { scrollIntoView: !0, userEvent: "delete.backward" })), !r;
}, b1 = [
  { key: "Backspace", run: Q1 }
];
function y1(i, e) {
  let t = fd(i, i.selection.main.head), n = t.brackets || vn.brackets;
  for (let r of n) {
    let s = cd(Te(r, 0));
    if (e == r)
      return s == r ? k1(i, r, n.indexOf(r + r + r) > -1, t) : $1(i, r, s, t.before || vn.before);
    if (e == s && Od(i, i.selection.main.from))
      return P1(i, r, s);
  }
  return null;
}
function Od(i, e) {
  let t = !1;
  return i.field(hd).between(0, i.doc.length, (n) => {
    n == e && (t = !0);
  }), t;
}
function Qs(i, e) {
  let t = i.sliceString(e, e + 2);
  return t.slice(0, st(Te(t, 0)));
}
function x1(i, e) {
  let t = i.sliceString(e - 2, e);
  return st(Te(t, 0)) == t.length ? t : t.slice(1);
}
function $1(i, e, t, n) {
  let r = null, s = i.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: e, from: o.from }, { insert: t, from: o.to }],
        effects: ii.of(o.to + e.length),
        range: b.range(o.anchor + e.length, o.head + e.length)
      };
    let l = Qs(i.doc, o.head);
    return !l || /\s/.test(l) || n.indexOf(l) > -1 ? {
      changes: { insert: e + t, from: o.head },
      effects: ii.of(o.head + e.length),
      range: b.cursor(o.head + e.length)
    } : { range: r = o };
  });
  return r ? null : i.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function P1(i, e, t) {
  let n = null, r = i.changeByRange((s) => s.empty && Qs(i.doc, s.head) == t ? {
    changes: { from: s.head, to: s.head + t.length, insert: t },
    range: b.cursor(s.head + t.length)
  } : n = { range: s });
  return n ? null : i.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function k1(i, e, t, n) {
  let r = n.stringPrefixes || vn.stringPrefixes, s = null, o = i.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: e, from: l.to }],
        effects: ii.of(l.to + e.length),
        range: b.range(l.anchor + e.length, l.head + e.length)
      };
    let a = l.head, h = Qs(i.doc, a), c;
    if (h == e) {
      if (Oc(i, a))
        return {
          changes: { insert: e + e, from: a },
          effects: ii.of(a + e.length),
          range: b.cursor(a + e.length)
        };
      if (Od(i, a)) {
        let O = t && i.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: a, to: a + O.length, insert: O },
          range: b.cursor(a + O.length)
        };
      }
    } else {
      if (t && i.sliceDoc(a - 2 * e.length, a) == e + e && (c = uc(i, a - 2 * e.length, r)) > -1 && Oc(i, c))
        return {
          changes: { insert: e + e + e + e, from: a },
          effects: ii.of(a + e.length),
          range: b.cursor(a + e.length)
        };
      if (i.charCategorizer(a)(h) != K.Word && uc(i, a, r) > -1 && !w1(i, a, e, r))
        return {
          changes: { insert: e + e, from: a },
          effects: ii.of(a + e.length),
          range: b.cursor(a + e.length)
        };
    }
    return { range: s = l };
  });
  return s ? null : i.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Oc(i, e) {
  let t = H(i).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function w1(i, e, t, n) {
  let r = H(i).resolveInner(e, -1), s = n.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = i.sliceDoc(r.from, Math.min(r.to, r.from + t.length + s)), a = l.indexOf(t);
    if (!a || a > -1 && n.indexOf(l.slice(0, a)) > -1) {
      let c = r.firstChild;
      for (; c && c.from == r.from && c.to - c.from > t.length + a; ) {
        if (i.sliceDoc(c.to - t.length, c.to) == t)
          return !1;
        c = c.firstChild;
      }
      return !0;
    }
    let h = r.to == e && r.parent;
    if (!h)
      break;
    r = h;
  }
  return !1;
}
function uc(i, e, t) {
  let n = i.charCategorizer(e);
  if (n(i.sliceDoc(e - 1, e)) != K.Word)
    return e;
  for (let r of t) {
    let s = e - r.length;
    if (i.sliceDoc(s, e) == r && n(i.sliceDoc(s - 1, s)) != K.Word)
      return s;
  }
  return -1;
}
function v1(i = {}) {
  return [
    r1,
    Ce,
    he.of(i),
    i1,
    T1,
    ld
  ];
}
const ud = [
  { key: "Ctrl-Space", run: Us },
  { mac: "Alt-`", run: Us },
  { mac: "Alt-i", run: Us },
  { key: "Escape", run: Kb },
  { key: "ArrowDown", run: /* @__PURE__ */ fr(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ fr(!1) },
  { key: "PageDown", run: /* @__PURE__ */ fr(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ fr(!1, "page") },
  { key: "Enter", run: Hb }
], T1 = /* @__PURE__ */ zt.highest(/* @__PURE__ */ qn.computeN([he], (i) => i.facet(he).defaultKeymap ? [ud] : []));
class dc {
  constructor(e, t, n) {
    this.from = e, this.to = t, this.diagnostic = n;
  }
}
class Jt {
  constructor(e, t, n) {
    this.diagnostics = e, this.panel = t, this.selected = n;
  }
  static init(e, t, n) {
    let r = n.facet(Tn).markerFilter;
    r && (e = r(e, n));
    let s = e.slice().sort((u, d) => u.from - d.from || u.to - d.to), o = new $t(), l = [], a = 0, h = n.doc.iter(), c = 0, f = n.doc.length;
    for (let u = 0; ; ) {
      let d = u == s.length ? null : s[u];
      if (!d && !l.length)
        break;
      let m, g;
      if (l.length)
        m = a, g = l.reduce((y, w) => Math.min(y, w.to), d && d.from > m ? d.from : 1e8);
      else {
        if (m = d.from, m > f)
          break;
        g = d.to, l.push(d), u++;
      }
      for (; u < s.length; ) {
        let y = s[u];
        if (y.from == m && (y.to > y.from || y.to == m))
          l.push(y), u++, g = Math.min(y.to, g);
        else {
          g = Math.min(y.from, g);
          break;
        }
      }
      g = Math.min(g, f);
      let S = !1;
      if (l.some((y) => y.from == m && (y.to == g || g == f)) && (S = m == g, !S && g - m < 10)) {
        let y = m - (c + h.value.length);
        y > 0 && (h.next(y), c = m);
        for (let w = m; ; ) {
          if (w >= g) {
            S = !0;
            break;
          }
          if (!h.lineBreak && c + h.value.length > w)
            break;
          w = c + h.value.length, c += h.value.length, h.next();
        }
      }
      let Q = V1(l);
      if (S)
        o.add(m, m, Z.widget({
          widget: new Y1(Q),
          diagnostics: l.slice()
        }));
      else {
        let y = l.reduce((w, x) => x.markClass ? w + " " + x.markClass : w, "");
        o.add(m, g, Z.mark({
          class: "cm-lintRange cm-lintRange-" + Q + y,
          diagnostics: l.slice(),
          inclusiveEnd: l.some((w) => w.to > g)
        }));
      }
      if (a = g, a == f)
        break;
      for (let y = 0; y < l.length; y++)
        l[y].to <= a && l.splice(y--, 1);
    }
    let O = o.finish();
    return new Jt(O, t, jt(O));
  }
}
function jt(i, e = null, t = 0) {
  let n = null;
  return i.between(t, 1e9, (r, s, { spec: o }) => {
    if (!(e && o.diagnostics.indexOf(e) < 0))
      if (!n)
        n = new dc(r, s, e || o.diagnostics[0]);
      else {
        if (o.diagnostics.indexOf(n.diagnostic) < 0)
          return !1;
        n = new dc(n.from, s, n.diagnostic);
      }
  }), n;
}
function C1(i, e) {
  let t = e.pos, n = e.end || t, r = i.state.facet(Tn).hideOn(i, t, n);
  if (r != null)
    return r;
  let s = i.startState.doc.lineAt(e.pos);
  return !!(i.effects.some((o) => o.is(dd)) || i.changes.touchesRange(s.from, Math.max(s.to, n)));
}
function X1(i, e) {
  return i.field(_e, !1) ? e : e.concat(M.appendConfig.of(D1));
}
const dd = /* @__PURE__ */ M.define(), ga = /* @__PURE__ */ M.define(), pd = /* @__PURE__ */ M.define(), _e = /* @__PURE__ */ ge.define({
  create() {
    return new Jt(Z.none, null, null);
  },
  update(i, e) {
    if (e.docChanged && i.diagnostics.size) {
      let t = i.diagnostics.map(e.changes), n = null, r = i.panel;
      if (i.selected) {
        let s = e.changes.mapPos(i.selected.from, 1);
        n = jt(t, i.selected.diagnostic, s) || jt(t, null, s);
      }
      !t.size && r && e.state.facet(Tn).autoPanel && (r = null), i = new Jt(t, r, n);
    }
    for (let t of e.effects)
      if (t.is(dd)) {
        let n = e.state.facet(Tn).autoPanel ? t.value.length ? Cn.open : null : i.panel;
        i = Jt.init(t.value, n, e.state);
      } else t.is(ga) ? i = new Jt(i.diagnostics, t.value ? Cn.open : null, i.selected) : t.is(pd) && (i = new Jt(i.diagnostics, i.panel, t.value));
    return i;
  },
  provide: (i) => [
    bn.from(i, (e) => e.panel),
    k.decorations.from(i, (e) => e.diagnostics)
  ]
}), Z1 = /* @__PURE__ */ Z.mark({ class: "cm-lintRange cm-lintRange-active" });
function R1(i, e, t) {
  let { diagnostics: n } = i.state.field(_e), r, s = -1, o = -1;
  n.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: c }) => {
    if (e >= a && e <= h && (a == h || (e > a || t > 0) && (e < h || t < 0)))
      return r = c.diagnostics, s = a, o = h, !1;
  });
  let l = i.state.facet(Tn).tooltipFilter;
  return r && l && (r = l(r, i.state)), r ? {
    pos: s,
    end: o,
    above: !0,
    create() {
      return { dom: A1(i, r) };
    }
  } : null;
}
function A1(i, e) {
  return I("ul", { class: "cm-tooltip-lint" }, e.map((t) => gd(i, t, !1)));
}
const M1 = (i) => {
  let e = i.state.field(_e, !1);
  (!e || !e.panel) && i.dispatch({ effects: X1(i.state, [ga.of(!0)]) });
  let t = Il(i, Cn.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, pc = (i) => {
  let e = i.state.field(_e, !1);
  return !e || !e.panel ? !1 : (i.dispatch({ effects: ga.of(!1) }), !0);
}, W1 = (i) => {
  let e = i.state.field(_e, !1);
  if (!e)
    return !1;
  let t = i.state.selection.main, n = jt(e.diagnostics, null, t.to + 1);
  return !n && (n = jt(e.diagnostics, null, 0), !n || n.from == t.from && n.to == t.to) ? !1 : (i.dispatch({ selection: { anchor: n.from, head: n.to }, scrollIntoView: !0 }), b0(i, n.from, 1, {
    tooltip: Sd,
    until: (r) => r.docChanged || r.newSelection.main.head < n.from || r.newSelection.main.head > n.to
  }), !0);
}, q1 = [
  { key: "Mod-Shift-m", run: M1, preventDefault: !0 },
  { key: "F8", run: W1 }
], Tn = /* @__PURE__ */ C.define({
  combine(i) {
    return {
      sources: i.map((e) => e.source).filter((e) => e != null),
      ...mt(i.map((e) => e.config), {
        delay: 750,
        markerFilter: null,
        tooltipFilter: null,
        needsRefresh: null,
        hideOn: () => null
      }, {
        delay: Math.max,
        markerFilter: mc,
        tooltipFilter: mc,
        needsRefresh: (e, t) => e ? t ? (n) => e(n) || t(n) : e : t,
        hideOn: (e, t) => e ? t ? (n, r, s) => e(n, r, s) || t(n, r, s) : e : t,
        autoPanel: (e, t) => e || t
      })
    };
  }
});
function mc(i, e) {
  return i ? e ? (t, n) => e(i(t, n), n) : i : e;
}
function md(i) {
  let e = [];
  if (i)
    e: for (let { name: t } of i) {
      for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (/[a-zA-Z]/.test(r) && !e.some((s) => s.toLowerCase() == r.toLowerCase())) {
          e.push(r);
          continue e;
        }
      }
      e.push("");
    }
  return e;
}
function gd(i, e, t) {
  var n;
  let r = t ? md(e.actions) : [];
  return I("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, I("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage(i) : e.message), (n = e.actions) === null || n === void 0 ? void 0 : n.map((s, o) => {
    let l = !1, a = (u) => {
      if (u.preventDefault(), l)
        return;
      l = !0;
      let d = jt(i.state.field(_e).diagnostics, e);
      d && s.apply(i, d.from, d.to);
    }, { name: h } = s, c = r[o] ? h.indexOf(r[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      I("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ], O = s.markClass ? " " + s.markClass : "";
    return I("button", {
      type: "button",
      class: "cm-diagnosticAction" + O,
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${r[o]})"`}.`
    }, f);
  }), e.source && I("div", { class: "cm-diagnosticSource" }, e.source));
}
class Y1 extends Ue {
  constructor(e) {
    super(), this.sev = e;
  }
  eq(e) {
    return e.sev == this.sev;
  }
  toDOM() {
    return I("span", { class: "cm-lintPoint cm-lintPoint-" + this.sev });
  }
}
class gc {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = gd(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Cn {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (r) => {
      if (!(r.ctrlKey || r.altKey || r.metaKey)) {
        if (r.keyCode == 27)
          pc(this.view), this.view.focus();
        else if (r.keyCode == 38 || r.keyCode == 33)
          this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
        else if (r.keyCode == 40 || r.keyCode == 34)
          this.moveSelection((this.selectedIndex + 1) % this.items.length);
        else if (r.keyCode == 36)
          this.moveSelection(0);
        else if (r.keyCode == 35)
          this.moveSelection(this.items.length - 1);
        else if (r.keyCode == 13)
          this.view.focus();
        else if (r.keyCode >= 65 && r.keyCode <= 90 && this.selectedIndex >= 0) {
          let { diagnostic: s } = this.items[this.selectedIndex], o = md(s.actions);
          for (let l = 0; l < o.length; l++)
            if (o[l].toUpperCase().charCodeAt(0) == r.keyCode) {
              let a = jt(this.view.state.field(_e).diagnostics, s);
              a && s.actions[l].apply(e, a.from, a.to);
            }
        } else
          return;
        r.preventDefault();
      }
    }, n = (r) => {
      for (let s = 0; s < this.items.length; s++)
        this.items[s].dom.contains(r.target) && this.moveSelection(s);
    };
    this.list = I("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: n
    }), this.dom = I("div", { class: "cm-panel-lint" }, this.list, I("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => pc(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(_e).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(_e), n = 0, r = !1, s = null, o = /* @__PURE__ */ new Set();
    for (e.between(0, this.view.state.doc.length, (l, a, { spec: h }) => {
      for (let c of h.diagnostics) {
        if (o.has(c))
          continue;
        o.add(c);
        let f = -1, O;
        for (let u = n; u < this.items.length; u++)
          if (this.items[u].diagnostic == c) {
            f = u;
            break;
          }
        f < 0 ? (O = new gc(this.view, c), this.items.splice(n, 0, O), r = !0) : (O = this.items[f], f > n && (this.items.splice(n, f - n), r = !0)), t && O.diagnostic == t.diagnostic ? O.dom.hasAttribute("aria-selected") || (O.dom.setAttribute("aria-selected", "true"), s = O) : O.dom.hasAttribute("aria-selected") && O.dom.removeAttribute("aria-selected"), n++;
      }
    }); n < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      r = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new gc(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), r = !0), s ? (this.list.setAttribute("aria-activedescendant", s.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: s.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: l, panel: a }) => {
        let h = a.height / this.list.offsetHeight;
        l.top < a.top ? this.list.scrollTop -= (a.top - l.top) / h : l.bottom > a.bottom && (this.list.scrollTop += (l.bottom - a.bottom) / h);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), r && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let n = e;
      e = n.nextSibling, n.remove();
    }
    for (let n of this.items)
      if (n.dom.parentNode == this.list) {
        for (; e != n.dom; )
          t();
        e = n.dom.nextSibling;
      } else
        this.list.insertBefore(n.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(_e), n = jt(t.diagnostics, this.items[e].diagnostic);
    n && this.view.dispatch({
      selection: { anchor: n.from, head: n.to },
      scrollIntoView: !0,
      effects: pd.of(n)
    });
  }
  static open(e) {
    return new Cn(e);
  }
}
function _1(i, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(i)}</svg>')`;
}
function Or(i) {
  return _1(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${i}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const j1 = /* @__PURE__ */ k.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ Or("#f11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ Or("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ Or("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ Or("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  },
  "&dark .cm-lintRange-active": { backgroundColor: "#86714a80" },
  "&dark .cm-panel.cm-panel-lint ul": {
    "& [aria-selected]": {
      backgroundColor: "#2e343e"
    }
  }
});
function z1(i) {
  return i == "error" ? 4 : i == "warning" ? 3 : i == "info" ? 2 : 1;
}
function V1(i) {
  let e = "hint", t = 1;
  for (let n of i) {
    let r = z1(n.severity);
    r > t && (t = r, e = n.severity);
  }
  return e;
}
const Sd = /* @__PURE__ */ Q0(R1, { hideOn: C1 }), D1 = [
  _e,
  /* @__PURE__ */ k.decorations.compute([_e], (i) => {
    let { selected: e, panel: t } = i.field(_e);
    return !e || !t || e.from == e.to ? Z.none : Z.set([
      Z1.range(e.from, e.to)
    ]);
  }),
  Sd,
  j1
];
var Sc = function(e) {
  e === void 0 && (e = {});
  var t = e, n = t.crosshairCursor, r = n === void 0 ? !1 : n, s = [];
  e.closeBracketsKeymap !== !1 && (s = s.concat(b1)), e.defaultKeymap !== !1 && (s = s.concat(nb)), e.searchKeymap !== !1 && (s = s.concat(Xb)), e.historyKeymap !== !1 && (s = s.concat(cQ)), e.foldKeymap !== !1 && (s = s.concat(kS)), e.completionKeymap !== !1 && (s = s.concat(ud)), e.lintKeymap !== !1 && (s = s.concat(q1));
  var o = [];
  return e.lineNumbers !== !1 && o.push(A0()), e.highlightActiveLineGutter !== !1 && o.push(q0()), e.highlightSpecialChars !== !1 && o.push(Ng()), e.history !== !1 && o.push(tQ()), e.foldGutter !== !1 && o.push(CS()), e.drawSelection !== !1 && o.push(qg()), e.dropCursor !== !1 && o.push(Dg()), e.allowMultipleSelections !== !1 && o.push(V.allowMultipleSelections.of(!0)), e.indentOnInput !== !1 && o.push(mS()), e.syntaxHighlighting !== !1 && o.push(fu(AS, {
    fallback: !0
  })), e.bracketMatching !== !1 && o.push(zS()), e.closeBrackets !== !1 && o.push(m1()), e.autocompletion !== !1 && o.push(v1()), e.rectangularSelection !== !1 && o.push(a0()), r !== !1 && o.push(f0()), e.highlightActiveLine !== !1 && o.push(e0()), e.highlightSelectionMatches !== !1 && o.push(hb()), e.tabSize && typeof e.tabSize == "number" && o.push(Yn.of(" ".repeat(e.tabSize))), o.concat([qn.of(s.flat())]).filter(Boolean);
};
const E1 = "#e5c07b", Qc = "#e06c75", L1 = "#56b6c2", B1 = "#ffffff", br = "#abb2bf", Ol = "#7d8799", I1 = "#61afef", G1 = "#98c379", bc = "#d19a66", N1 = "#c678dd", U1 = "#21252b", yc = "#2c313a", xc = "#282c34", Hs = "#353a42", F1 = "#3E4451", $c = "#528bff", H1 = /* @__PURE__ */ k.theme({
  "&": {
    color: br,
    backgroundColor: xc
  },
  ".cm-content": {
    caretColor: $c
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: $c },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: F1 },
  ".cm-panels": { backgroundColor: U1, color: br },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847"
  },
  ".cm-gutters": {
    backgroundColor: xc,
    color: Ol,
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: yc
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: Hs
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: Hs,
    borderBottomColor: Hs
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: yc,
      color: br
    }
  }
}, { dark: !0 }), K1 = /* @__PURE__ */ jn.define([
  {
    tag: p.keyword,
    color: N1
  },
  {
    tag: [p.name, p.deleted, p.character, p.propertyName, p.macroName],
    color: Qc
  },
  {
    tag: [/* @__PURE__ */ p.function(p.variableName), p.labelName],
    color: I1
  },
  {
    tag: [p.color, /* @__PURE__ */ p.constant(p.name), /* @__PURE__ */ p.standard(p.name)],
    color: bc
  },
  {
    tag: [/* @__PURE__ */ p.definition(p.name), p.separator],
    color: br
  },
  {
    tag: [p.typeName, p.className, p.number, p.changed, p.annotation, p.modifier, p.self, p.namespace],
    color: E1
  },
  {
    tag: [p.operator, p.operatorKeyword, p.url, p.escape, p.regexp, p.link, /* @__PURE__ */ p.special(p.string)],
    color: L1
  },
  {
    tag: [p.meta, p.comment],
    color: Ol
  },
  {
    tag: p.strong,
    fontWeight: "bold"
  },
  {
    tag: p.emphasis,
    fontStyle: "italic"
  },
  {
    tag: p.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: p.link,
    color: Ol,
    textDecoration: "underline"
  },
  {
    tag: p.heading,
    fontWeight: "bold",
    color: Qc
  },
  {
    tag: [p.atom, p.bool, /* @__PURE__ */ p.special(p.variableName)],
    color: bc
  },
  {
    tag: [p.processingInstruction, p.string, p.inserted],
    color: G1
  },
  {
    tag: p.invalid,
    color: B1
  }
]), J1 = [H1, /* @__PURE__ */ fu(K1)];
var ey = k.theme({
  "&": {
    backgroundColor: "#fff"
  }
}, {
  dark: !1
}), ty = function(e) {
  e === void 0 && (e = {});
  var t = e, n = t.indentWithTab, r = n === void 0 ? !0 : n, s = t.editable, o = s === void 0 ? !0 : s, l = t.readOnly, a = l === void 0 ? !1 : l, h = t.theme, c = h === void 0 ? "light" : h, f = t.placeholder, O = f === void 0 ? "" : f, u = t.basicSetup, d = u === void 0 ? !0 : u, m = [];
  switch (r && m.unshift(qn.of([rb])), d && (typeof d == "boolean" ? m.unshift(Sc()) : m.unshift(Sc(d))), O && m.unshift(r0(O)), c) {
    case "light":
      m.push(ey);
      break;
    case "dark":
      m.push(J1);
      break;
    case "none":
      break;
    default:
      m.push(c);
      break;
  }
  return o === !1 && m.push(k.editable.of(!1)), a && m.push(V.readOnly.of(!0)), [...m];
}, iy = (i) => ({
  line: i.state.doc.lineAt(i.state.selection.main.from),
  lineCount: i.state.doc.lines,
  lineBreak: i.state.lineBreak,
  length: i.state.doc.length,
  readOnly: i.state.readOnly,
  tabSize: i.state.tabSize,
  selection: i.state.selection,
  selectionAsSingle: i.state.selection.asSingle().main,
  ranges: i.state.selection.ranges,
  selectionCode: i.state.sliceDoc(i.state.selection.main.from, i.state.selection.main.to),
  selections: i.state.selection.ranges.map((e) => i.state.sliceDoc(e.from, e.to)),
  selectedText: i.state.selection.ranges.some((e) => !e.empty)
});
class ny {
  constructor(e, t) {
    this.timeLeftMS = void 0, this.timeoutMS = void 0, this.isCancelled = !1, this.isTimeExhausted = !1, this.callbacks = [], this.timeLeftMS = t, this.timeoutMS = t, this.callbacks.push(e);
  }
  tick() {
    if (!this.isCancelled && !this.isTimeExhausted && (this.timeLeftMS--, this.timeLeftMS <= 0)) {
      this.isTimeExhausted = !0;
      var e = this.callbacks.slice();
      this.callbacks.length = 0, e.forEach((t) => {
        try {
          t();
        } catch (n) {
          console.error("TimeoutLatch callback error:", n);
        }
      });
    }
  }
  cancel() {
    this.isCancelled = !0, this.callbacks.length = 0;
  }
  reset() {
    this.timeLeftMS = this.timeoutMS, this.isCancelled = !1, this.isTimeExhausted = !1;
  }
  get isDone() {
    return this.isCancelled || this.isTimeExhausted;
  }
}
class Pc {
  constructor() {
    this.interval = null, this.latches = /* @__PURE__ */ new Set();
  }
  add(e) {
    this.latches.add(e), this.start();
  }
  remove(e) {
    this.latches.delete(e), this.latches.size === 0 && this.stop();
  }
  start() {
    this.interval === null && (this.interval = setInterval(() => {
      this.latches.forEach((e) => {
        e.tick(), e.isDone && this.remove(e);
      });
    }, 1));
  }
  stop() {
    this.interval !== null && (clearInterval(this.interval), this.interval = null);
  }
}
var Ks = null, ry = () => typeof window > "u" ? new Pc() : (Ks || (Ks = new Pc()), Ks), sy = k.theme({
  "& .cm-scroller": {
    height: "100% !important"
  }
}), kc = null, Js = null;
function oy(i, e, t, n, r, s) {
  if (!i && !e && !t && !n && !r && !s)
    return null;
  var o = JSON.stringify({
    height: i,
    minHeight: e,
    maxHeight: t,
    width: n,
    minWidth: r,
    maxWidth: s
  });
  return o === kc || (kc = o, Js = k.theme({
    "&": {
      height: i,
      minHeight: e,
      maxHeight: t,
      width: n,
      minWidth: r,
      maxWidth: s
    }
  })), Js;
}
var wc = pt.define(), ly = 200, ay = [];
function hy(i) {
  var e = i.value, t = i.selection, n = i.onChange, r = i.onStatistics, s = i.onCreateEditor, o = i.onUpdate, l = i.extensions, a = l === void 0 ? ay : l, h = i.autoFocus, c = i.theme, f = c === void 0 ? "light" : c, O = i.height, u = O === void 0 ? null : O, d = i.minHeight, m = d === void 0 ? null : d, g = i.maxHeight, S = g === void 0 ? null : g, Q = i.width, y = Q === void 0 ? null : Q, w = i.minWidth, x = w === void 0 ? null : w, $ = i.maxWidth, P = $ === void 0 ? null : $, A = i.placeholder, q = A === void 0 ? "" : A, E = i.editable, W = E === void 0 ? !0 : E, R = i.readOnly, z = R === void 0 ? !1 : R, _ = i.indentWithTab, L = _ === void 0 ? !0 : _, ne = i.basicSetup, ae = ne === void 0 ? !0 : ne, ye = i.root, ee = i.initialState, fe = Bi(), Oe = fe[0], xe = fe[1], Ae = Bi(), G = Ae[0], Le = Ae[1], Bt = Bi(), Oi = Bt[0], ys = Bt[1], Ke = Bi(() => ({
    current: null
  }))[0], En = Bi(() => ({
    current: null
  }))[0], Ta = oy(u, m, S, y, x, P), pp = k.updateListener.of((Je) => {
    if (Je.docChanged && typeof n == "function" && // Fix echoing of the remote changes:
    // If transaction is market as remote we don't have to call `onChange` handler again
    !Je.transactions.some((xs) => xs.annotation(wc))) {
      Ke.current ? Ke.current.reset() : (Ke.current = new ny(() => {
        if (En.current) {
          var xs = En.current;
          En.current = null, xs();
        }
        Ke.current = null;
      }, ly), ry().add(Ke.current));
      var It = Je.state.doc, Gt = It.toString();
      n(Gt, Je);
    }
    r && r(iy(Je));
  }), mp = ty({
    theme: f,
    editable: W,
    readOnly: z,
    placeholder: q,
    indentWithTab: L,
    basicSetup: ae
  }), Li = [pp, ...Ta ? [Ta] : [], sy, ...mp];
  return o && typeof o == "function" && Li.push(k.updateListener.of(o)), Li = Li.concat(a), gp(() => {
    if (Oe && !Oi) {
      var Je = {
        doc: e,
        selection: t,
        extensions: Li
      }, It = ee ? V.fromJSON(ee.json, Je, ee.fields) : V.create(Je);
      if (ys(It), !G) {
        var Gt = new k({
          state: It,
          parent: Oe,
          root: ye
        });
        Le(Gt), s && s(Gt, It);
      }
    }
    return () => {
      G && (ys(void 0), Le(void 0));
    };
  }, [Oe, Oi]), Ii(() => {
    i.container && xe(i.container);
  }, [i.container]), Ii(() => () => {
    G && (G.destroy(), Le(void 0)), Ke.current && (Ke.current.cancel(), Ke.current = null);
  }, [G]), Ii(() => {
    h && G && G.focus();
  }, [h, G]), Ii(() => {
    G && G.dispatch({
      effects: M.reconfigure.of(Li)
    });
  }, [f, a, u, m, S, y, x, P, q, W, z, L, ae, n, o]), Ii(() => {
    if (e !== void 0) {
      var Je = G ? G.state.doc.toString() : "";
      if (G && e !== Je) {
        var It = Ke.current && !Ke.current.isDone, Gt = () => {
          G && e !== G.state.doc.toString() && G.dispatch({
            changes: {
              from: 0,
              to: G.state.doc.toString().length,
              insert: e || ""
            },
            annotations: [wc.of(!0)]
          });
        };
        It ? En.current = Gt : Gt();
      }
    }
  }, [e, G]), {
    state: Oi,
    setState: ys,
    view: G,
    setView: Le,
    container: Oe,
    setContainer: xe
  };
}
var cy = ["className", "value", "selection", "extensions", "onChange", "onStatistics", "onCreateEditor", "onUpdate", "autoFocus", "theme", "height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "basicSetup", "placeholder", "indentWithTab", "editable", "readOnly", "root", "initialState"], Qd = /* @__PURE__ */ Sp((i, e) => {
  var t = i.className, n = i.value, r = n === void 0 ? "" : n, s = i.selection, o = i.extensions, l = o === void 0 ? [] : o, a = i.onChange, h = i.onStatistics, c = i.onCreateEditor, f = i.onUpdate, O = i.autoFocus, u = i.theme, d = u === void 0 ? "light" : u, m = i.height, g = i.minHeight, S = i.maxHeight, Q = i.width, y = i.minWidth, w = i.maxWidth, x = i.basicSetup, $ = i.placeholder, P = i.indentWithTab, A = i.editable, q = i.readOnly, E = i.root, W = i.initialState, R = $p(i, cy), z = Qp(null), _ = hy({
    root: E,
    value: r,
    autoFocus: O,
    theme: d,
    height: m,
    minHeight: g,
    maxHeight: S,
    width: Q,
    minWidth: y,
    maxWidth: w,
    basicSetup: x,
    placeholder: $,
    indentWithTab: P,
    editable: A,
    readOnly: q,
    selection: s,
    onChange: a,
    onStatistics: h,
    onCreateEditor: c,
    onUpdate: f,
    extensions: l,
    initialState: W
  }), L = _.state, ne = _.view, ae = _.container, ye = _.setContainer;
  bp(e, () => ({
    editor: z.current,
    state: L,
    view: ne
  }), [z, ae, L, ne]);
  var ee = yp((Oe) => {
    z.current = Oe, ye(Oe);
  }, [ye]);
  if (typeof r != "string")
    throw new Error("value must be typeof string but got " + typeof r);
  var fe = typeof d == "string" ? "cm-theme-" + d : "cm-theme";
  return /* @__PURE__ */ Qf("div", go({
    ref: ee,
    className: "" + fe + (t ? " " + t : "")
  }, R));
});
Qd.displayName = "CodeMirror";
class Fr {
  /**
  @internal
  */
  constructor(e, t, n, r, s, o, l, a, h, c = 0, f) {
    this.p = e, this.stack = t, this.state = n, this.reducePos = r, this.pos = s, this.score = o, this.buffer = l, this.bufferBase = a, this.curContext = h, this.lookAhead = c, this.parent = f;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, n = 0) {
    let r = e.parser.context;
    return new Fr(e, [], t, n, n, 0, [], 0, r ? new vc(r, r.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let n = e >> 19, r = e & 65535, { parser: s } = this.p, o = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), l = s.dynamicPrecedence(r);
    if (l && (this.score += l), n == 0) {
      r < s.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(s.getGoto(this.state, r, !0), this.reducePos), r < s.minRepeatTerm && this.storeNode(r, this.reducePos, this.reducePos, o ? 8 : 4, !0), this.reduceContext(r, this.reducePos);
      return;
    }
    let a = this.stack.length - (n - 1) * 3 - (e & 262144 ? 6 : 0), h = a ? this.stack[a - 2] : this.p.ranges[0].from;
    r < s.minRepeatTerm && h == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
    let c = this.reducePos - h;
    c >= 2e3 && !(!((t = this.p.parser.nodeSet.types[r]) === null || t === void 0) && t.isAnonymous) && (h == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = c) : this.p.lastBigReductionSize < c && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = h, this.p.lastBigReductionSize = c));
    let f = a ? this.stack[a - 1] : 0, O = this.bufferBase + this.buffer.length - f;
    if (r < s.minRepeatTerm || e & 131072) {
      let u = s.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(r, h, u, O + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[a];
    else {
      let u = this.stack[a - 3];
      this.state = s.getGoto(u, r, !0);
    }
    for (; this.stack.length > a; )
      this.stack.pop();
    this.reduceContext(r, h);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, n, r = 4, s = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] == 0 && this.buffer[o - 1] > -1) {
        if (t == n)
          return;
        if (this.buffer[o - 2] >= t) {
          this.buffer[o - 2] = n;
          return;
        }
      }
    }
    if (!s || this.pos == n)
      this.buffer.push(e, t, n, r);
    else {
      let o = this.buffer.length;
      if (o > 0 && (this.buffer[o - 4] != 0 || this.buffer[o - 1] < 0)) {
        let l = !1;
        for (let a = o; a > 0 && this.buffer[a - 2] > n; a -= 4)
          if (this.buffer[a - 1] >= 0) {
            l = !0;
            break;
          }
        if (l)
          for (; o > 0 && this.buffer[o - 2] > n; )
            this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, r > 4 && (r -= 4);
      }
      this.buffer[o] = e, this.buffer[o + 1] = t, this.buffer[o + 2] = n, this.buffer[o + 3] = r;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, n, r) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if ((e & 262144) == 0) {
      let s = e, { parser: o } = this.p;
      this.pos = r;
      let l = o.stateFlag(
        s,
        1
        /* StateFlag.Skipped */
      );
      !l && (r > n || t <= o.maxNode) && (this.reducePos = r), this.pushState(s, l ? n : Math.min(n, this.reducePos)), this.shiftContext(t, n), t <= o.maxNode && this.buffer.push(t, n, r, 4);
    } else
      this.pos = r, this.shiftContext(t, n), t <= this.p.parser.maxNode && this.buffer.push(t, n, r, 4);
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, n, r) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, n, r);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let n = this.p.reused.length - 1;
    (n < 0 || this.p.reused[n] != e) && (this.p.reused.push(e), n++);
    let r = this.pos;
    this.reducePos = this.pos = r + e.length, this.pushState(t, r), this.buffer.push(
      n,
      r,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (t && e.buffer[t - 4] == 0 && (t -= 4); t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let n = e.buffer.slice(t), r = e.bufferBase + t;
    for (; e && r == e.bufferBase; )
      e = e.parent;
    return new Fr(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, n, r, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let n = e <= this.p.parser.maxNode;
    n && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, n ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new fy(this); ; ) {
      let n = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (n == 0)
        return !1;
      if ((n & 65536) == 0)
        return !0;
      t.reduce(n);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let r = [];
      for (let s = 0, o; s < t.length; s += 2)
        (o = t[s + 1]) != this.state && this.p.parser.hasAction(o, e) && r.push(t[s], o);
      if (this.stack.length < 120)
        for (let s = 0; r.length < 8 && s < t.length; s += 2) {
          let o = t[s + 1];
          r.some((l, a) => a & 1 && l == o) || r.push(t[s], o);
        }
      t = r;
    }
    let n = [];
    for (let r = 0; r < t.length && n.length < 4; r += 2) {
      let s = t[r + 1];
      if (s == this.state)
        continue;
      let o = this.split();
      o.pushState(s, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(t[r], this.pos), o.reducePos = this.pos, o.score -= 200, n.push(o);
    }
    return n;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((t & 65536) == 0)
      return !1;
    if (!e.validAction(this.state, t)) {
      let n = t >> 19, r = t & 65535, s = this.stack.length - n * 3;
      if (s < 0 || e.getGoto(this.stack[s], r, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        t = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], n = (r, s) => {
      if (!t.includes(r))
        return t.push(r), e.allActions(r, (o) => {
          if (!(o & 393216)) if (o & 65536) {
            let l = (o >> 19) - s;
            if (l > 1) {
              let a = o & 65535, h = this.stack.length - l * 3;
              if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                return l << 19 | 65536 | a;
            }
          } else {
            let l = n(o, s + 1);
            if (l != null)
              return l;
          }
        });
    };
    return n(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new vc(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class vc {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class fy {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, n = e >> 19;
    n == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (n - 1) * 3;
    let r = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = r;
  }
}
class Hr {
  constructor(e, t, n) {
    this.stack = e, this.pos = t, this.index = n, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new Hr(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new Hr(this.stack, this.pos, this.index);
  }
}
function rn(i, e = Uint16Array) {
  if (typeof i != "string")
    return i;
  let t = null;
  for (let n = 0, r = 0; n < i.length; ) {
    let s = 0;
    for (; ; ) {
      let o = i.charCodeAt(n++), l = !1;
      if (o == 126) {
        s = 65535;
        break;
      }
      o >= 92 && o--, o >= 34 && o--;
      let a = o - 32;
      if (a >= 46 && (a -= 46, l = !0), s += a, l)
        break;
      s *= 46;
    }
    t ? t[r++] = s : t = new e(s);
  }
  return t;
}
class yr {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const Tc = new yr();
class Oy {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = Tc, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let n = this.range, r = this.rangeIndex, s = this.pos + e;
    for (; s < n.from; ) {
      if (!r)
        return null;
      let o = this.ranges[--r];
      s -= n.from - o.to, n = o;
    }
    for (; t < 0 ? s > n.to : s >= n.to; ) {
      if (r == this.ranges.length - 1)
        return null;
      let o = this.ranges[++r];
      s += o.from - n.to, n = o;
    }
    return s;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, n, r;
    if (t >= 0 && t < this.chunk.length)
      n = this.pos + e, r = this.chunk.charCodeAt(t);
    else {
      let s = this.resolveOffset(e, 1);
      if (s == null)
        return -1;
      if (n = s, n >= this.chunk2Pos && n < this.chunk2Pos + this.chunk2.length)
        r = this.chunk2.charCodeAt(n - this.chunk2Pos);
      else {
        let o = this.rangeIndex, l = this.range;
        for (; l.to <= n; )
          l = this.ranges[++o];
        this.chunk2 = this.input.chunk(this.chunk2Pos = n), n + this.chunk2.length > l.to && (this.chunk2 = this.chunk2.slice(0, l.to - n)), r = this.chunk2.charCodeAt(0);
      }
    }
    return n >= this.token.lookAhead && (this.token.lookAhead = n + 1), r;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let n = t ? this.resolveOffset(t, -1) : this.pos;
    if (n == null || n < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = n;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, t) {
    this.token.value = e, this.token.end = t;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = Tc, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let n = "";
    for (let r of this.ranges) {
      if (r.from >= t)
        break;
      r.to > e && (n += this.input.read(Math.max(r.from, e), Math.min(r.to, t)));
    }
    return n;
  }
}
class Ci {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: n } = t.p;
    bd(this.data, e, t, this.id, n.data, n.tokenPrecTable);
  }
}
Ci.prototype.contextual = Ci.prototype.fallback = Ci.prototype.extend = !1;
class Kr {
  constructor(e, t, n) {
    this.precTable = t, this.elseToken = n, this.data = typeof e == "string" ? rn(e) : e;
  }
  token(e, t) {
    let n = e.pos, r = 0;
    for (; ; ) {
      let s = e.next < 0, o = e.resolveOffset(1, 1);
      if (bd(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (s || r++, o == null)
        break;
      e.reset(o, e.token);
    }
    r && (e.reset(n, e.token), e.acceptToken(this.elseToken, r));
  }
}
Kr.prototype.contextual = Ci.prototype.fallback = Ci.prototype.extend = !1;
class oe {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function bd(i, e, t, n, r, s) {
  let o = 0, l = 1 << n, { dialect: a } = t.p.parser;
  e: for (; (l & i[o]) != 0; ) {
    let h = i[o + 1];
    for (let u = o + 3; u < h; u += 2)
      if ((i[u + 1] & l) > 0) {
        let d = i[u];
        if (a.allows(d) && (e.token.value == -1 || e.token.value == d || uy(d, e.token.value, r, s))) {
          e.acceptToken(d);
          break;
        }
      }
    let c = e.next, f = 0, O = i[o + 2];
    if (e.next < 0 && O > f && i[h + O * 3 - 3] == 65535) {
      o = i[h + O * 3 - 1];
      continue e;
    }
    for (; f < O; ) {
      let u = f + O >> 1, d = h + u + (u << 1), m = i[d], g = i[d + 1] || 65536;
      if (c < m)
        O = u;
      else if (c >= g)
        f = u + 1;
      else {
        o = i[d + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function Cc(i, e, t) {
  for (let n = e, r; (r = i[n]) != 65535; n++)
    if (r == t)
      return n - e;
  return -1;
}
function uy(i, e, t, n) {
  let r = Cc(t, n, e);
  return r < 0 || Cc(t, n, i) < r;
}
const We = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let eo = null;
function Xc(i, e, t) {
  let n = i.cursor(B.IncludeAnonymous);
  for (n.moveTo(e); ; )
    if (!(t < 0 ? n.childBefore(e) : n.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? n.to < e : n.from > e) && !n.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            n.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(i.length, Math.max(
            n.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (t < 0 ? n.prevSibling() : n.nextSibling())
          break;
        if (!n.parent())
          return t < 0 ? 0 : i.length;
      }
}
class dy {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? Xc(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? Xc(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let n = this.trees[t], r = this.index[t];
      if (r == n.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let s = n.children[r], o = this.start[t] + n.positions[r];
      if (o > e)
        return this.nextStart = o, null;
      if (s instanceof J) {
        if (o == e) {
          if (o < this.safeFrom)
            return null;
          let l = o + s.length;
          if (l <= this.safeTo) {
            let a = s.prop(Y.lookAhead);
            if (!a || l + a < this.fragment.to)
              return s;
          }
        }
        this.index[t]++, o + s.length >= Math.max(this.safeFrom, e) && (this.trees.push(s), this.start.push(o), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = o + s.length;
    }
  }
}
class py {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((n) => new yr());
  }
  getActions(e) {
    let t = 0, n = null, { parser: r } = e.p, { tokenizers: s } = r, o = r.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), l = e.curContext ? e.curContext.hash : 0, a = 0;
    for (let h = 0; h < s.length; h++) {
      if ((1 << h & o) == 0)
        continue;
      let c = s[h], f = this.tokens[h];
      if (!(n && !c.fallback) && ((c.contextual || f.start != e.pos || f.mask != o || f.context != l) && (this.updateCachedToken(f, c, e), f.mask = o, f.context = l), f.lookAhead > f.end + 25 && (a = Math.max(f.lookAhead, a)), f.value != 0)) {
        let O = t;
        if (f.extended > -1 && (t = this.addActions(e, f.extended, f.end, t)), t = this.addActions(e, f.value, f.end, t), !c.extend && (n = f, t > O))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return a && e.setLookAhead(a), !n && e.pos == this.stream.end && (n = new yr(), n.value = e.p.parser.eofTerm, n.start = n.end = e.pos, t = this.addActions(e, n.value, n.end, t)), this.mainToken = n, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new yr(), { pos: n, p: r } = e;
    return t.start = n, t.end = Math.min(n + 1, r.stream.end), t.value = n == r.stream.end ? r.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, n) {
    let r = this.stream.clipPos(n.pos);
    if (t.token(this.stream.reset(r, e), n), e.value > -1) {
      let { parser: s } = n.p;
      for (let o = 0; o < s.specialized.length; o++)
        if (s.specialized[o] == e.value) {
          let l = s.specializers[o](this.stream.read(e.start, e.end), n);
          if (l >= 0 && n.p.parser.dialect.allows(l >> 1)) {
            (l & 1) == 0 ? e.value = l >> 1 : e.extended = l >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(r + 1);
  }
  putAction(e, t, n, r) {
    for (let s = 0; s < r; s += 3)
      if (this.actions[s] == e)
        return r;
    return this.actions[r++] = e, this.actions[r++] = t, this.actions[r++] = n, r;
  }
  addActions(e, t, n, r) {
    let { state: s } = e, { parser: o } = e.p, { data: l } = o;
    for (let a = 0; a < 2; a++)
      for (let h = o.stateSlot(
        s,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (l[h] == 65535)
          if (l[h + 1] == 1)
            h = Qt(l, h + 2);
          else {
            r == 0 && l[h + 1] == 2 && (r = this.putAction(Qt(l, h + 2), t, n, r));
            break;
          }
        l[h] == t && (r = this.putAction(Qt(l, h + 1), t, n, r));
      }
    return r;
  }
}
class my {
  constructor(e, t, n, r) {
    this.parser = e, this.input = t, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new Oy(t, r), this.tokens = new py(e, this.stream), this.topTerm = e.top[1];
    let { from: s } = r[0];
    this.stacks = [Fr.start(this, e.top[0], s)], this.fragments = n.length && this.stream.end - s > e.bufferLength * 4 ? new dy(n, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, n = this.stacks = [], r, s;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [o] = e;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, l.pos > t)
          n.push(l);
        else {
          if (this.advanceStack(l, n, e))
            continue;
          {
            r || (r = [], s = []), r.push(l);
            let a = this.tokens.getMainToken(l);
            s.push(a.value, a.end);
          }
        }
        break;
      }
    }
    if (!n.length) {
      let o = r && Sy(r);
      if (o)
        return We && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw We && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && r) {
      let o = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, s, n);
      if (o)
        return We && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (n.length > o)
        for (n.sort((l, a) => a.score - l.score); n.length > o; )
          n.pop();
      n.some((l) => l.reducePos > t) && this.recovering--;
    } else if (n.length > 1) {
      e: for (let o = 0; o < n.length - 1; o++) {
        let l = n[o];
        for (let a = o + 1; a < n.length; a++) {
          let h = n[a];
          if (l.sameState(h) || l.buffer.length > 500 && h.buffer.length > 500)
            if ((l.score - h.score || l.buffer.length - h.buffer.length) > 0)
              n.splice(a--, 1);
            else {
              n.splice(o--, 1);
              continue e;
            }
        }
      }
      n.length > 12 && (n.sort((o, l) => l.score - o.score), n.splice(
        12,
        n.length - 12
        /* Rec.MaxStackCount */
      ));
    }
    this.minStackPos = n[0].pos;
    for (let o = 1; o < n.length; o++)
      n[o].pos < this.minStackPos && (this.minStackPos = n[o].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, n) {
    let r = e.pos, { parser: s } = this, o = We ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && r > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.curContext && e.curContext.tracker.strict, c = h ? e.curContext.hash : 0;
      for (let f = this.fragments.nodeAt(r); f; ) {
        let O = this.parser.nodeSet.types[f.type.id] == f.type ? s.getGoto(e.state, f.type.id) : -1;
        if (O > -1 && f.length && (!h || (f.prop(Y.contextHash) || 0) == c))
          return e.useNode(f, O), We && console.log(o + this.stackID(e) + ` (via reuse of ${s.getName(f.type.id)})`), !0;
        if (!(f instanceof J) || f.children.length == 0 || f.positions[0] > 0)
          break;
        let u = f.children[0];
        if (u instanceof J && f.positions[0] == 0)
          f = u;
        else
          break;
      }
    }
    let l = s.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (l > 0)
      return e.reduce(l), We && console.log(o + this.stackID(e) + ` (via always-reduce ${s.getName(
        l & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let a = this.tokens.getActions(e);
    for (let h = 0; h < a.length; ) {
      let c = a[h++], f = a[h++], O = a[h++], u = h == a.length || !n, d = u ? e : e.split(), m = this.tokens.mainToken;
      if (d.apply(c, f, m ? m.start : d.pos, O), We && console.log(o + this.stackID(d) + ` (via ${(c & 65536) == 0 ? "shift" : `reduce of ${s.getName(
        c & 65535
        /* Action.ValueMask */
      )}`} for ${s.getName(f)} @ ${r}${d == e ? "" : ", split"})`), u)
        return !0;
      d.pos > r ? t.push(d) : n.push(d);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let n = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > n)
        return Zc(e, t), !0;
    }
  }
  runRecovery(e, t, n) {
    let r = null, s = !1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = t[o << 1], h = t[(o << 1) + 1], c = We ? this.stackID(l) + " -> " : "";
      if (l.deadEnd && (s || (s = !0, l.restart(), We && console.log(c + this.stackID(l) + " (restarted)"), this.advanceFully(l, n))))
        continue;
      let f = l.split(), O = c;
      for (let u = 0; u < 10 && f.forceReduce() && (We && console.log(O + this.stackID(f) + " (via force-reduce)"), !this.advanceFully(f, n)); u++)
        We && (O = this.stackID(f) + " -> ");
      for (let u of l.recoverByInsert(a))
        We && console.log(c + this.stackID(u) + " (via recover-insert)"), this.advanceFully(u, n);
      this.stream.end > l.pos ? (h == l.pos && (h++, a = 0), l.recoverByDelete(a, h), We && console.log(c + this.stackID(l) + ` (via recover-delete ${this.parser.getName(a)})`), Zc(l, n)) : (!r || r.score < f.score) && (r = f);
    }
    return r;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), J.build({
      buffer: Hr.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (eo || (eo = /* @__PURE__ */ new WeakMap())).get(e);
    return t || eo.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function Zc(i, e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (n.pos == i.pos && n.sameState(i)) {
      e[t].score < i.score && (e[t] = i);
      return;
    }
  }
  e.push(i);
}
class gy {
  constructor(e, t, n) {
    this.source = e, this.flags = t, this.disabled = n;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const to = (i) => i;
class bs {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || to, this.reduce = e.reduce || to, this.reuse = e.reuse || to, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class dt extends FO {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let l = 0; l < e.repeatNodeCount; l++)
      t.push("");
    let n = Object.keys(e.topRules).map((l) => e.topRules[l][1]), r = [];
    for (let l = 0; l < t.length; l++)
      r.push([]);
    function s(l, a, h) {
      r[l].push([a, a.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let l of e.nodeProps) {
        let a = l[0];
        typeof a == "string" && (a = Y[a]);
        for (let h = 1; h < l.length; ) {
          let c = l[h++];
          if (c >= 0)
            s(c, a, l[h++]);
          else {
            let f = l[h + -c];
            for (let O = -c; O > 0; O--)
              s(l[h++], a, f);
            h++;
          }
        }
      }
    this.nodeSet = new Gl(t.map((l, a) => we.define({
      name: a >= this.minRepeatTerm ? void 0 : l,
      id: a,
      props: r[a],
      top: n.indexOf(a) > -1,
      error: a == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = BO;
    let o = rn(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let l = 0; l < this.specializerSpecs.length; l++)
      this.specialized[l] = this.specializerSpecs[l].term;
    this.specializers = this.specializerSpecs.map(Rc), this.states = rn(e.states, Uint32Array), this.data = rn(e.stateData), this.goto = rn(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((l) => typeof l == "number" ? new Ci(o, l) : l), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, n) {
    let r = new my(this, e, t, n);
    for (let s of this.wrappers)
      r = s(r, e, t, n);
    return r;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, n = !1) {
    let r = this.goto;
    if (t >= r[0])
      return -1;
    for (let s = r[t + 1]; ; ) {
      let o = r[s++], l = o & 1, a = r[s++];
      if (l && n)
        return a;
      for (let h = s + (o >> 1); s < h; s++)
        if (r[s] == e)
          return a;
      if (l)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let n = this.data;
    for (let r = 0; r < 2; r++)
      for (let s = this.stateSlot(
        e,
        r ? 2 : 1
        /* ParseState.Actions */
      ), o; ; s += 3) {
        if ((o = n[s]) == 65535)
          if (n[s + 1] == 1)
            o = n[s = Qt(n, s + 2)];
          else {
            if (n[s + 1] == 2)
              return Qt(n, s + 2);
            break;
          }
        if (o == t || o == 0)
          return Qt(n, s + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (n) => n == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let n = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), r = n ? t(n) : void 0;
    for (let s = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); r == null; s += 3) {
      if (this.data[s] == 65535)
        if (this.data[s + 1] == 1)
          s = Qt(this.data, s + 2);
        else
          break;
      r = t(Qt(this.data, s + 1));
    }
    return r;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let n = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; n += 3) {
      if (this.data[n] == 65535)
        if (this.data[n + 1] == 1)
          n = Qt(this.data, n + 2);
        else
          break;
      if ((this.data[n + 2] & 1) == 0) {
        let r = this.data[n + 1];
        t.some((s, o) => o & 1 && s == r) || t.push(this.data[n], r);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(dt.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let n = this.topRules[e.top];
      if (!n)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = n;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((n) => {
      let r = e.tokenizers.find((s) => s.from == n);
      return r ? r.to : n;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((n, r) => {
      let s = e.specializers.find((l) => l.from == n.external);
      if (!s)
        return n;
      let o = Object.assign(Object.assign({}, n), { external: s.to });
      return t.specializers[r] = Rc(o), o;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), n = t.map(() => !1);
    if (e)
      for (let s of e.split(" ")) {
        let o = t.indexOf(s);
        o >= 0 && (n[o] = !0);
      }
    let r = null;
    for (let s = 0; s < t.length; s++)
      if (!n[s])
        for (let o = this.dialects[t[s]], l; (l = this.data[o++]) != 65535; )
          (r || (r = new Uint8Array(this.maxTerm + 1)))[l] = 1;
    return new gy(e, n, r);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new dt(e);
  }
}
function Qt(i, e) {
  return i[e] | i[e + 1] << 16;
}
function Sy(i) {
  let e = null;
  for (let t of i) {
    let n = t.p.stoppedAt;
    (t.pos == t.p.stream.end || n != null && t.pos > n) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function Rc(i) {
  if (i.external) {
    let e = i.extend ? 1 : 0;
    return (t, n) => i.external(t, n) << 1 | e;
  }
  return i.get;
}
const Qy = 145, Ac = 1, by = 146, yy = 147, yd = 2, xy = 148, $y = 3, Py = 4, xd = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], ky = 58, wy = 40, $d = 95, vy = 91, xr = 45, Ty = 46, Cy = 35, Xy = 37, Zy = 38, Ry = 92, Ay = 10, My = 42;
function Xn(i) {
  return i >= 65 && i <= 90 || i >= 97 && i <= 122 || i >= 161;
}
function Sa(i) {
  return i >= 48 && i <= 57;
}
function Mc(i) {
  return Sa(i) || i >= 97 && i <= 102 || i >= 65 && i <= 70;
}
const Pd = (i, e, t) => (n, r) => {
  for (let s = !1, o = 0, l = 0; ; l++) {
    let { next: a } = n;
    if (Xn(a) || a == xr || a == $d || s && Sa(a))
      !s && (a != xr || l > 0) && (s = !0), o === l && a == xr && o++, n.advance();
    else if (a == Ry && n.peek(1) != Ay) {
      if (n.advance(), Mc(n.next)) {
        do
          n.advance();
        while (Mc(n.next));
        n.next == 32 && n.advance();
      } else n.next > -1 && n.advance();
      s = !0;
    } else {
      s && n.acceptToken(
        o == 2 && r.canShift(yd) ? e : a == wy ? t : i
      );
      break;
    }
  }
}, Wy = new oe(
  Pd(by, yd, yy),
  { contextual: !0 }
), qy = new oe(
  Pd(xy, $y, Py),
  { contextual: !0 }
), Yy = new oe((i) => {
  if (xd.includes(i.peek(-1))) {
    let { next: e } = i;
    (Xn(e) || e == $d || e == Cy || e == Ty || e == My || e == vy || e == ky && Xn(i.peek(1)) || e == xr || e == Zy) && i.acceptToken(Qy);
  }
}), _y = new oe((i) => {
  if (!xd.includes(i.peek(-1))) {
    let { next: e } = i;
    if (e == Xy && (i.advance(), i.acceptToken(Ac)), Xn(e)) {
      do
        i.advance();
      while (Xn(i.next) || Sa(i.next));
      i.acceptToken(Ac);
    }
  }
}), jy = Vt({
  "AtKeyword import charset namespace keyframes media supports font-feature-values": p.definitionKeyword,
  "from to selector scope MatchFlag": p.keyword,
  NamespaceName: p.namespace,
  KeyframeName: p.labelName,
  KeyframeRangeName: p.operatorKeyword,
  TagName: p.tagName,
  ClassName: p.className,
  PseudoClassName: p.constant(p.className),
  IdName: p.labelName,
  "FeatureName PropertyName": p.propertyName,
  AttributeName: p.attributeName,
  NumberLiteral: p.number,
  KeywordQuery: p.keyword,
  UnaryQueryOp: p.operatorKeyword,
  "CallTag ValueName FontName": p.atom,
  VariableName: p.variableName,
  Callee: p.operatorKeyword,
  Unit: p.unit,
  "UniversalSelector NestingSelector": p.definitionOperator,
  "MatchOp CompareOp": p.compareOperator,
  "ChildOp SiblingOp, LogicOp": p.logicOperator,
  BinOp: p.arithmeticOperator,
  Important: p.modifier,
  Comment: p.blockComment,
  ColorLiteral: p.color,
  "ParenthesizedContent StringLiteral": p.string,
  ":": p.punctuation,
  "PseudoOp #": p.derefOperator,
  "; , |": p.separator,
  "( )": p.paren,
  "[ ]": p.squareBracket,
  "{ }": p.brace
}), zy = { __proto__: null, lang: 44, "nth-child": 44, "nth-last-child": 44, "nth-of-type": 44, "nth-last-of-type": 44, dir: 44, "host-context": 44, if: 90, url: 152, "url-prefix": 152, domain: 152, regexp: 152 }, Vy = { __proto__: null, or: 104, and: 104, not: 112, only: 112, layer: 206 }, Dy = { __proto__: null, selector: 118, style: 124, layer: 202 }, Ey = { __proto__: null, "@import": 198, "@media": 210, "@charset": 214, "@namespace": 218, "@keyframes": 224, "@supports": 236, "@scope": 240, "@font-feature-values": 246 }, Ly = { __proto__: null, to: 243 }, By = dt.deserialize({
  version: 14,
  states: "MlQYQdOOO#}QdOOP$UO`OOO%OQaO'#CfOOQP'#Ce'#CeO%VQdO'#CgO%[Q`O'#CgO%aQaO'#FnO&XQdO'#CkO&xQaO'#CcO'SQdO'#CnO'_QdO'#EOO'dQdO'#EQO'oQdO'#EXO'oQdO'#E[OOQP'#Fn'#FnO)RQhO'#E}OOQS'#Fm'#FmOOQS'#FQ'#FQQYQdOOO)YQdO'#EbO*iQhO'#EhO)YQdO'#EjO*pQdO'#ElO*{QdO'#EoO)}QhO'#EuO+TQdO'#EwO+`QdO'#EzO+eQaO'#CfO+lQ`O'#E_O+qQ`O'#F{O+|QdO'#F{QOQ`OOP,WO&jO'#CaPOOO)CA])CA]OOQP'#Ci'#CiOOQP,59R,59RO%VQdO,59ROOQP'#Cm'#CmOOQP,59V,59VO&XQdO,59VO,cQdO,59YO'_QdO,5:jO'dQdO,5:lO'oQdO,5:sO'oQdO,5:uO'oQdO,5:vO'oQdO'#FXO,nQ`O,58}O,vQdO'#E^OOQS,58},58}OOQP'#Cq'#CqOOQO'#D|'#D|OOQP,59Y,59YO,}Q`O,59YO-SQ`O,59YOOQP'#EP'#EPOOQP,5:j,5:jO-XQpO'#ERO-dQdO'#ESO-iQ`O'#ESO-nQpO,5:lO.XQaO,5:sO.oQaO,5:vOOQW'#D^'#D^O/nQhO'#DgO0RQhO,5;iO)}QhO'#DeO0`Q`O'#DnO0eQhO'#DxOOQW'#Ft'#FtOOQS,5;i,5;iO0jQ`O'#DhO0oQ`O'#DkOOQS-E9O-E9OOOQ['#Cv'#CvO0tQdO'#CwO1[QdO'#C}O1rQdO'#DQO2YQ!pO'#DSO4fQ!jO,5:|OOQO'#DX'#DXO-SQ`O'#DWO4vQ!nO'#FqO6|Q`O'#DYO7RQ`O'#DyOOQ['#Fq'#FqO7WQhO'#GOO7fQ`O,5;SO7kQ!bO,5;UOOQS'#En'#EnO7sQ`O,5;WO7xQdO,5;WOOQO'#Eq'#EqO8QQ`O,5;ZO8VQhO,5;aO'oQdO'#DjOOQS,5;c,5;cO0jQ`O,5;cO8_QdO,5;cOOQS'#F`'#F`O8gQdO'#E|O7fQ`O,5;fO8oQdO,5:yO9PQdO'#FZO9^Q`O,5<gO9^Q`O,5<gPOOO'#FP'#FPP9iO&jO,58{POOO,58{,58{OOQP1G.m1G.mOOQP1G.q1G.qOOQP1G.t1G.tO,}Q`O1G.tO-SQ`O1G.tOOQP1G0U1G0UO9tQpO1G0WO9|QaO1G0_O:dQaO1G0aO:zQaO1G0bO;bQaO,5;sOOQO-E9V-E9VOOQS1G.i1G.iO;lQ`O,5:xO;qQdO'#D}O;xQdO'#CuOOQO'#EU'#EUOOQO,5:n,5:nO-dQdO,5:nOOQP1G0W1G0WO)YQdO1G0WO<PQ!jO'#D^O<_Q!bO,59yO<gQhO,5:ROOQO'#Fu'#FuO<bQ!bO,59}O<oQhO'#FaO)}QhO,59{O)}QhO'#FaO=gQhO1G1TOOQS1G1T1G1TO=qQhO,5:PO>lQhO'#DoOOQW,5:Y,5:YOOQW,5:d,5:dOOQW,5:S,5:SO>vQhO,5:VO?bQ!fO'#FrOOQS'#Fr'#FrOOQS'#FS'#FSO@rQdO,59cOOQ[,59c,59cOAYQdO,59iOOQ[,59i,59iOApQdO,59lOOQ[,59l,59lOOQ[,59n,59nO)YQdO,59pOBWQhO'#EdOOQW'#Ed'#EdOBuQ`O1G0hO4oQhO1G0hOOQ[,59r,59rO)}QhO'#D[OOQ[,59t,59tOBzQ#tO,5:eOCVQhO'#F]OCdQ`O,5<jOOQS1G0n1G0nOOQS1G0p1G0pOOQS1G0r1G0rOCoQ`O1G0rOCtQdO'#ErOOQS1G0u1G0uOOQS1G0{1G0{ODPQaO,5:UO7fQ`O1G0}OOQS1G0}1G0}O0jQ`O1G0}OOQS-E9^-E9^OOQS1G1Q1G1QODWQ!fO1G0eODnQ`O'#EaOOQO1G0e1G0eOOQO,5;u,5;uODsQdO,5;uOOQO-E9X-E9XOEQQ`O1G2RPOOO-E8}-E8}POOO1G.g1G.gOOQP7+$`7+$`OOQP7+%r7+%rO)YQdO7+%rOOQS1G0d1G0dOE]QaO'#FzOEgQ`O,5:iOElQ!fO'#FROFjQdO'#FpOFtQ`O,59aOOQO1G0Y1G0YOFyQ!bO7+%rO)YQdO1G/eOGUQhO1G/iOOQW1G/m1G/mOOQW1G/g1G/gOGgQhO,5;{OOQW-E9_-E9_OOQS7+&o7+&oOH_QhO'#D^OHmQhO'#FxOHxQ`O'#FxOH}Q`O,5:ZOISQ!bO'#D`O>vQhO'#DmOI_QhO'#DqOIgQhO'#DsOIlQhO'#FwOOQO'#Fw'#FwOItQ!bO'#DwOOQO'#Fy'#FyOOQO'#Fv'#FvOIyQ`O1G/qOOQS-E9Q-E9QOOQ[1G.}1G.}OOQ[1G/T1G/TOOQ[1G/W1G/WOOQ[1G/[1G/[OJOQdO,5;OOOQS7+&S7+&SOJTQ`O7+&SOJYQhO'#D]OJbQ`O,59vO)}QhO,59vOOQ[1G0P1G0POJjQ`O1G0POJoQhO,5;wOOQO-E9Z-E9ZOOQS7+&^7+&^OJ}QbO'#DSOOQO'#Et'#EtOK]Q`O'#EsOOQO'#Es'#EsOKhQ`O'#F^OKpQdO,5;^OOQS,5;^,5;^OOQ[1G/p1G/pOOQS7+&i7+&iO7fQ`O7+&iOK{Q!fO'#FYO)YQdO'#FYOMSQdO7+&POOQO7+&P7+&POOQO,5:{,5:{OOQO1G1a1G1aOMgQ!bO<<I^OMrQdO'#FWOM|Q`O,5<fOOQP1G0T1G0TOOQS-E9P-E9PONUQdO'#FVON`Q`O,5<[OOQ]1G.{1G.{OOQP<<I^<<I^ONhQ`O<<I^ONmQdO7+%POOQO'#D`'#D`ONtQ!bO7+%TON|QhO'#FUO! ZQ`O,5<dO)YQdO,5<dOOQW1G/u1G/uO)YQdO,5:bO! cQ`O,5:XO>vQhO'#DrOOQO,5:],5:]O! hQhO,5:_OGUQhO,5:cOOQW7+%]7+%]OOQO'#Ef'#EfO! pQ`O1G0jOOQS<<In<<InO)YQdO,59wO!!dQhO1G/bOOQ[1G/b1G/bO!!kQ`O1G/bOOQW-E9R-E9ROOQ[7+%k7+%kOOQO,5;_,5;_OCwQdO'#F_OKhQ`O,5;xOOQS,5;x,5;xOOQS-E9[-E9[OOQS1G0x1G0xOOQS<<JT<<JTO!!sQ!fO,5;tOOQS-E9W-E9WOOQO<<Ik<<IkOOQPAN>xAN>xO!#zQ`OAN>xO!$PQaO,5;rOOQO-E9U-E9UO!$ZQdO,5;qOOQO-E9T-E9TOOQW<<Hk<<HkOOQW<<Ho<<HoO!$eQhO<<HoO!$vQhO,5;pO!%RQ`O,5;pOOQO-E9S-E9SO!%WQdO1G2OO!%bQdO1G/|O!%iQhO1G/sO!%qQ`O,5:^O>vQhO'#DuOOQO1G/y1G/yO!%vQ!bO1G/}OJOQdO'#F[O!&OQ`O7+&UOOQW7+&U7+&UO!&WQ!bO1G/cOOQ[7+$|7+$|O!&cQhO7+$|P!&jQ`O'#FTOOQO,5;y,5;yOOQO-E9]-E9]OOQS1G1d1G1dOOQPG24dG24dO!&oQ`OAN>ZO)YQdO1G1[O!&tQ`O7+'jOOQO1G/x1G/xO!&|Q`O,5:aO!$eQhO7+%iOOQO,5;v,5;vOOQO-E9Y-E9YOOQW<<Ip<<IpOOQ[<<Hh<<HhPOQW,5;o,5;oOOQWG23uG23uO!'RQdO7+&vOOQO1G/{1G/{OOQO<<IT<<IT",
  stateData: "!'f~O$[OS$]QQ~OWVO^_O`WOcYOdYOl`OmZOp[O!|]O#P^O#VdO#]eO#_fO#agO#dhO#jiO#ljO#okO$WRO$cTO~OQmOWVO^_O`WOcYOdYOl`OmZOp[O!|]O#P^O#VdO#]eO#_fO#agO#dhO#jiO#ljO#okO$WlO$cTO~O$U$oP~P!jO$]qO~O`YXcYXdYXmYXpYXsYX!dYX!|YX#PYX$VYX$c[X~OgYX~P$ZO$WsO~O$cuO~O$cuO`$bXc$bXd$bXm$bXp$bXs$bX!d$bX!|$bX#P$bX$V$bXg$bX~O$WvO~O`xOcyOdyOmzOp{O!||O#P!OO$V}O~Os!RO!d!PO~P&^Of!XO$W!TO$X!UO~O$W!YO~OW!^O$W![O$c!]O~OWVO^_O`WOcYOdYOmZOp[O!|]O#P^O$WRO$cTO~OS!fOc!gOd!gOh!cOs!RO!Y!eO!]!jO!`!kO$Y!bO~On!iO~P(dOQ!uOh!nOp!oOs!pOu!xOw!xO}!vO!n!wO$W!mO$X!sO$g!qO~OS!fOc!gOd!gOh!cO!Y!eO!]!jO!`!kO$Y!bO~Os$rP~P)}Ow!}O!n!wO$W!|O~Ow#PO$W#PO~Oh#SOs!RO#m#UO~O$W#WO~Oc#SX~P$ZOc#ZO~On#[O$U$oXr$oX~O$U$oXr$oX~P!jO$^#_O$_#_O$`#aO~Of#fO$W!TO$X!UO~Os!RO!d!PO~Or$oP~P!jOh#pO~Oh#qO~Oo!uX!y!uX$c!wX~O$W#rO~O$c#tO~Oo#uO!y#vO~O`xOcyOdyOmzOp{O~Os!{a!d!{a!|!{a#P!{a$V!{ag!{a~P-vOs#Oa!d#Oa!|#Oa#P#Oa$V#Oag#Oa~P-vOS!fOc!gOd!gOh!cO!Y!eO!]!jO!`!kO~OR#zOu#zOw#zO$Y#wO$g!qO~P/VOn$QO!U#}O!d$OO~P(dOh$SO~O$Y$UO~Oh#SO~Oh$WO~O`$YOc$YOg$]Ol$YOm$YOn$YO~P)YO`$YOc$YOl$YOm$YOn$YOo$_O~P)YO`$YOc$YOl$YOm$YOn$YOr$aO~P)YOP$bOSvXcvXdvXhvXnvXyvX!YvX!]vX!`vX#XvX#ZvX$YvX!WvXQvX`vXgvXlvXmvXpvXsvXuvXwvX}vX!nvX$WvX$XvX$gvXovXrvX!dvX$UvX$qvX!zvX~Oy$cO#X$dO#Z$eOn$rP~P)}Oh#qOS$eXc$eXd$eXn$eXy$eX!Y$eX!]$eX!`$eX#X$eX#Z$eX$Y$eXQ$eX`$eXg$eXl$eXm$eXp$eXs$eXu$eXw$eX}$eX!n$eX$W$eX$X$eX$g$eXo$eXr$eX!d$eX$U$eX$q$eX!z$eX~Oh$iO~Oh$kO~O!U#}O!d$lOs$rXn$rX~Os!RO~On$oOy$cO~On$pO~Ow$qO!n!wO~Os$rO~Os!RO!U#}O~Os!RO#m$xO~O$W#WOs#pX~O$q$|On#Ra$U#Rar#Ra~P)YOn#}X$U#}Xr#}X~P!jOn#[O$U$oar$oa~O$^#_O$_#_O$`%TO~Oo%VO!y%WO~Os!{i!d!{i!|!{i#P!{i$V!{ig!{i~P-vOs!}i!d!}i!|!}i#P!}i$V!}ig!}i~P-vOs#Oi!d#Oi!|#Oi#P#Oi$V#Oig#Oi~P-vOs#{a!d#{a~P&^Or%XO~Og$nP~P'oOg$dP~P)YOc!SXg!QX!U!QX!W!SX~Oc%aO!W%bO~Og%cO!U#}O~O!U#}OS$TXc$TXd$TXh$TXn$TXs$TX!Y$TX!]$TX!`$TX!d$TX$Y$TX~On%gO!d$OO~P(dO!U#}OS!Xac!Xad!Xah!Xan!Xas!Xa!Y!Xa!]!Xa!`!Xa!d!Xa$Y!Xag!Xa~O$Y%hOg$lP~P/VOR#zOS!fOh%mOu#zOw#zO!Y%nO$Y%lO$g!qO~Oy$cOQ$fX`$fXc$fXg$fXh$fXl$fXm$fXn$fXp$fXs$fXu$fXw$fX}$fX!n$fX$W$fX$X$fX$g$fXo$fXr$fX~O`$YOc$YOg%wOl$YOm$YOn$YO~P)YO`$YOc$YOl$YOm$YOn$YOo%xO~P)YO`$YOc$YOl$YOm$YOn$YOr%yO~P)YOh%{OS#WXc#WXd#WXn#WX!Y#WX!]#WX!`#WX$Y#WX~On%|O~Og&ROw&SO!o&SO~Os$PX!d$PXn$PX~P)}O!d$lOs$ran$ra~On&VO~Or&^O$W&XO$g&WO~Og&_O~P&^Oy$cO!d&cO$q$|On#Ri$U#Rir#Ri~P)YO$p&fO~On#}a$U#}ar#}a~P!jOn#[O$U$oir$oi~O!d&iOg$nX~P&^Og&kO~Oy$cOQ#uXg#uXh#uXp#uXs#uXu#uXw#uX}#uX!d#uX!n#uX$W#uX$X#uX$g#uX~O!d&mOg$dX~P)YOg&oO~Oo&pOy$cO!z&qO~OR#zOu#zOw#zO$Y&sO$g!qO~O!U#}OS$Tac$Tad$Tah$Tan$Tas$Ta!Y$Ta!]$Ta!`$Ta!d$Ta$Y$Ta~Oc!SXg!QX!U!QX!d!QX~O!U#}O!d&uOg$lX~Oc&wO~Og&xO~Oc&yOg!jX!W!SX~OS!fOh&{O~O!U&}O~O!U&}Og$kX~O!W'OO~Og'PO~O$W'QO~On'SO~Oc'TO!U#}O~Og'VOn'UO~Og'YO~O!U#}Os$Pa!d$Pan$Pa~OP$bOsvX!dvXgvX~O$g&WOs#gX!d#gX~Os!RO!d'[O~Or'`O$W&XO$g&WO~Oy$cOQ#|Xh#|Xn#|Xp#|Xs#|Xu#|Xw#|X}#|X!d#|X!n#|X$U#|X$W#|X$X#|X$g#|X$q#|Xr#|X~O!d&cO$q$|On#Rq$U#Rqr#Rq~P)YOo'eOy$cO!z'fO~Og#zX!d#zX~P'oO!d&iOg$na~Og#yX!d#yX~P)YO!d&mOg$da~Oo'eO~Og'kO~P)YOg'lO!W'mO~O$Y%hOg#xX!d#xX~P/VO!d&uOg$la~Og'sO~OS!fOh'uO~O`'xOg'zO~OS#wac#wad#wah#wa!Y#wa!]#wa!`#wa$Y#wa~Og'|O~P! xOg'|On'}O~Oy$cOQ#|ah#|an#|ap#|as#|au#|aw#|a}#|a!d#|a!n#|a$U#|a$W#|a$X#|a$g#|a$q#|ar#|a~Oo(SO~Og#za!d#za~P&^Og#ya!d#ya~P)YOR#zOu#zOw#zO$Y&sO$g&WO~O!U#}Og#xa!d#xa~Oc(UO~O!d&uOg$li~P)YOg!ji~P)YOg!ai!U!hi~Og(WO~O!W(YOg!ki~O`'xOg(]O~Oy$cOg!Pin!Pi~Og(^O~P! xOn(_O~Og(`O~O!d&uOg$lq~Og(bO~Og#xq!d#xq~P)YO$[!o$]$g`$gy#P~",
  goto: "7[$sPPPPP$tP$wP%Q%d%Q%v&YP%QP&`%QPP&fPPP&l&v&vPPPPP&vPP&vP'fP&vP&v(i&vP)X)[)b)b)t)bP)bP)bP)b)bP*a)bP*m*s+cP*m+f*m+i+`+o+o)b+uPP,k,q%Q,w%Q,},}-T-XPP%QP%Q%QP-_.Z.h.o$wP.xP.{P$wP$wP$wP/R$wP/U/X/[/c$wP$wPP$wP/h$wP/k/q0Q0l0z1Q1[1b1h1n1t2O2U2[2b2h2nPPPPPPPPPPP2t2}P3s3v4zP5S5|6c6o6u6o6x6{PP7RRrQ_aOPco!R#[%Pq_OP]^co|}!O!P!R#S#[#p%P&iqSOP]^co|}!O!P!R#S#[#p%P&iqUOP]^co|}!O!P!R#S#[#p%P&iQtTR#buQwWR#cxQ!VYR#dyQ#d!XS$h!t!uR%U#f!Z!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(a!Y!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(ab#z!c$W%b%m&{'O'm'u(YU&Z$r&]'[R'Z&Y!Z!tdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(aR$j!vQ&P$iR'W&Qq!h`ei!c!d!e!r#}$O$P$S$g$i$l&Q&uQ#x!cQ%j$SW%r$W%m&{'uQ&t%bQ'o&uQ'w'OQ(T'mR(c(YQ#VjQ$V!jQ$v#UR&a$xX%q$W%m&{'up!h`ei!c!d!e!r#}$O$P$S$g$i$l&Q&uW%p$W%m&{'uQ&|%nR'v&}R$T!fR&|%nX%o$W%m&{'uX%s$W%m&{'u!Y!xdf!n!o!p#Z#q#v$[$^$`$c${%W%]%a&c&d&m&r&w&y'T'i'q'r(U(aQ!}gR$q#OQ!WYR#eyQ#d!WR%U#eQ!ZZR#gzQ!_[R#h{T!^[{Q#s!]R%_#tQ!SXQ!i`Q#TjQ#n!QQ$Q!dQ$n!zQ$t#RQ$w#VQ$z#YQ%g$PQ&`$vQ'^&[Q'a&aR(R']SnP!RQ#^oQ%O#[R&g%PZmPo!R#[%PQ$}#ZQ&e${R'd&dR$g!rQ'R%{R(Z'xR#OgR#QhR$s#QS&[$r&]R(P'[V&Y$r&]'[R#YkQ#`qR%S#`QcOSoP!RU!lco%PR%P#[Q%]#q[&l%]&r'i'q'r(aQ&r%aQ'i&mQ'q&wQ'r&yR(a(UQ$[!nQ$^!oQ$`!pV%v$[$^$`Q&Q$iR'X&QQ&v%iS'p&v(VR(V'qQ&n%]R'j&nQ&j%YR'h&jQ!QXR#m!QQ&d${R'c&dQ#]nS%Q#]%RR%R#^Q'y'RR(['yQ$m!yR&U$mQ&]$rR'_&]Q']&[R(Q']Q#XkR$y#XQ$P!dR%f$P_bOPco!R#[%P^XOPco!R#[%PQ!`]Q!a^Q#i|Q#j}Q#k!OQ#l!PQ$u#SQ%Y#pR'g&iR%^#qQ!rdQ!{f[$X!n!o!p$[$^$`Q${#Zh%[#q%]%a&m&r&w&y'i'q'r(U(aQ%`#vQ%z$cS&b${&dQ&h%WQ'b&cR'{'T]$Z!n!o!p$[$^$`Q!d`U!ye!r$gQ#RiQ#y!cS#|!d$PQ$R!eQ%d#}Q%e$OQ%i$SS&O$i&QQ&T$lR'n&uQ#{!cW%r$W%m&{'uQ&t%bQ'w'OQ(T'mR(c(YQ%u$WQ&z%mQ't&{R(X'uX%t$W%m&{'uR%k$SR%Z#pQpPR#o!RQ!zeQ$f!rR%}$g",
  nodeNames: "⚠ Unit VariableName VariableName QueryCallee Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NamespacedTagSelector NamespaceName TagName NestingSelector ClassSelector . ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue AtKeyword # ; ] [ BracketedValue } { BracedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee IfExpression if ArgList IfBranch KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp ComparisonQuery CompareOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector ParenthesizedSelector StyleQuery style ParenthesedQuery CallQuery ArgList , UnaryQuery ParenthesedQuery BinaryQuery ParenthesedQuery ParenthesedQuery StyleFeature StyleRange PseudoQuery CallLiteral CallTag ParenthesizedContent PseudoClassName ArgList IdSelector IdName AttributeSelector AttributeName NamespacedAttribute NamespaceName AttributeName MatchOp MatchFlag ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block Declaration PropertyName Important ImportStatement import Layer layer LayerName layer MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports ScopeStatement scope to FontFeatureStatement font-feature-values FontName AtRule Styles",
  maxTerm: 172,
  nodeProps: [
    ["isolate", -2, 5, 39, ""],
    ["openedBy", 23, "(", 31, "[", 34, "{"],
    ["closedBy", 24, ")", 32, "]", 35, "}"]
  ],
  propSources: [jy],
  skippedNodes: [0, 5, 127],
  repeatNodeCount: 17,
  tokenData: "K`~R!bOX%ZX^&R^p%Zpq&Rqr)ers)vst+jtu2Xuv%Zvw3Rwx3dxy5Ryz5dz{5i{|6S|}:u}!O;W!O!P;u!P!Q<^!Q![=V![!]>Q!]!^>|!^!_?_!_!`@Z!`!a@n!a!b%Z!b!cAo!c!k%Z!k!lC|!l!u%Z!u!vC|!v!}%Z!}#OD_#O#P%Z#P#QDp#Q#R2X#R#]%Z#]#^ER#^#g%Z#g#hC|#h#o%Z#o#pIf#p#qIw#q#rJ`#r#sJq#s#y%Z#y#z&R#z$f%Z$f$g&R$g#BY%Z#BY#BZ&R#BZ$IS%Z$IS$I_&R$I_$I|%Z$I|$JO&R$JO$JT%Z$JT$JU&R$JU$KV%Z$KV$KW&R$KW&FU%Z&FU&FV&R&FV;'S%Z;'S;=`KY<%lO%Z`%^SOy%jz;'S%j;'S;=`%{<%lO%j`%oS!o`Oy%jz;'S%j;'S;=`%{<%lO%j`&OP;=`<%l%j~&Wh$[~OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%j~'yh$[~!o`OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%jj)jS$qYOy%jz;'S%j;'S;=`%{<%lO%j~)yWOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d<%lO)v~*hOw~~*kRO;'S)v;'S;=`*t;=`O)v~*wXOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d;=`<%l)v<%lO)v~+gP;=`<%l)vj+oYmYOy%jz!Q%j!Q![,_![!c%j!c!i,_!i#T%j#T#Z,_#Z;'S%j;'S;=`%{<%lO%jj,dY!o`Oy%jz!Q%j!Q![-S![!c%j!c!i-S!i#T%j#T#Z-S#Z;'S%j;'S;=`%{<%lO%jj-XY!o`Oy%jz!Q%j!Q![-w![!c%j!c!i-w!i#T%j#T#Z-w#Z;'S%j;'S;=`%{<%lO%jj.OYuY!o`Oy%jz!Q%j!Q![.n![!c%j!c!i.n!i#T%j#T#Z.n#Z;'S%j;'S;=`%{<%lO%jj.uYuY!o`Oy%jz!Q%j!Q![/e![!c%j!c!i/e!i#T%j#T#Z/e#Z;'S%j;'S;=`%{<%lO%jj/jY!o`Oy%jz!Q%j!Q![0Y![!c%j!c!i0Y!i#T%j#T#Z0Y#Z;'S%j;'S;=`%{<%lO%jj0aYuY!o`Oy%jz!Q%j!Q![1P![!c%j!c!i1P!i#T%j#T#Z1P#Z;'S%j;'S;=`%{<%lO%jj1UY!o`Oy%jz!Q%j!Q![1t![!c%j!c!i1t!i#T%j#T#Z1t#Z;'S%j;'S;=`%{<%lO%jj1{SuY!o`Oy%jz;'S%j;'S;=`%{<%lO%jd2[UOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jd2uS!yS!o`Oy%jz;'S%j;'S;=`%{<%lO%jb3WS^QOy%jz;'S%j;'S;=`%{<%lO%j~3gWOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{<%lO3d~4SRO;'S3d;'S;=`4];=`O3d~4`XOY3dZw3dwx*cx#O3d#O#P4P#P;'S3d;'S;=`4{;=`<%l3d<%lO3d~5OP;=`<%l3dj5WShYOy%jz;'S%j;'S;=`%{<%lO%j~5iOg~n5pUWQyWOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jj6ZWyW#PQOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj6xU!o`Oy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%jj7cY!o`$gYOy%jz!Q%j!Q![7[![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj8WY!o`Oy%jz{%j{|8v|}%j}!O8v!O!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj8{U!o`Oy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj9fU!o`$gYOy%jz!Q%j!Q![9_![;'S%j;'S;=`%{<%lO%jj:P[!o`$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj:zS!dYOy%jz;'S%j;'S;=`%{<%lO%jj;]WyWOy%jz!O%j!O!P6s!P!Q%j!Q![9x![;'S%j;'S;=`%{<%lO%jj;zU`YOy%jz!Q%j!Q![7[![;'S%j;'S;=`%{<%lO%j~<cTyWOy%jz{<r{;'S%j;'S;=`%{<%lO%j~<yS!o`$]~Oy%jz;'S%j;'S;=`%{<%lO%jj=[[$gYOy%jz!O%j!O!P7[!P!Q%j!Q![9x![!g%j!g!h8R!h#X%j#X#Y8R#Y;'S%j;'S;=`%{<%lO%jj>VUcYOy%jz![%j![!]>i!];'S%j;'S;=`%{<%lO%jj>pSdY!o`Oy%jz;'S%j;'S;=`%{<%lO%jj?RSnYOy%jz;'S%j;'S;=`%{<%lO%jh?dU!WWOy%jz!_%j!_!`?v!`;'S%j;'S;=`%{<%lO%jh?}S!WW!o`Oy%jz;'S%j;'S;=`%{<%lO%jl@bS!WW!ySOy%jz;'S%j;'S;=`%{<%lO%jj@uV!|Q!WWOy%jz!_%j!_!`?v!`!aA[!a;'S%j;'S;=`%{<%lO%jbAcS!|Q!o`Oy%jz;'S%j;'S;=`%{<%lO%jjArYOy%jz}%j}!OBb!O!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjBgW!o`Oy%jz!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jjCW[lY!o`Oy%jz}%j}!OCP!O!Q%j!Q![CP![!c%j!c!}CP!}#T%j#T#oCP#o;'S%j;'S;=`%{<%lO%jhDRS!zWOy%jz;'S%j;'S;=`%{<%lO%jjDdSpYOy%jz;'S%j;'S;=`%{<%lO%jnDuSo^Oy%jz;'S%j;'S;=`%{<%lO%jjEWU!zWOy%jz#a%j#a#bEj#b;'S%j;'S;=`%{<%lO%jbEoU!o`Oy%jz#d%j#d#eFR#e;'S%j;'S;=`%{<%lO%jbFWU!o`Oy%jz#c%j#c#dFj#d;'S%j;'S;=`%{<%lO%jbFoU!o`Oy%jz#f%j#f#gGR#g;'S%j;'S;=`%{<%lO%jbGWU!o`Oy%jz#h%j#h#iGj#i;'S%j;'S;=`%{<%lO%jbGoU!o`Oy%jz#T%j#T#UHR#U;'S%j;'S;=`%{<%lO%jbHWU!o`Oy%jz#b%j#b#cHj#c;'S%j;'S;=`%{<%lO%jbHoU!o`Oy%jz#h%j#h#iIR#i;'S%j;'S;=`%{<%lO%jbIYS$pQ!o`Oy%jz;'S%j;'S;=`%{<%lO%jjIkSsYOy%jz;'S%j;'S;=`%{<%lO%jfI|U$cUOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%jjJeSrYOy%jz;'S%j;'S;=`%{<%lO%jfJvU#PQOy%jz!_%j!_!`2n!`;'S%j;'S;=`%{<%lO%j`K]P;=`<%l%Z",
  tokenizers: [Yy, _y, Wy, qy, 1, 2, 3, 4, new Kr("m~RRYZ[z{a~~g~aO$_~~dP!P!Qg~lO$`~~", 28, 152)],
  topRules: { StyleSheet: [0, 6], Styles: [1, 126] },
  dynamicPrecedences: { 94: 1 },
  specialized: [{ term: 147, get: (i) => zy[i] || -1 }, { term: 148, get: (i) => Vy[i] || -1 }, { term: 4, get: (i) => Dy[i] || -1 }, { term: 28, get: (i) => Ey[i] || -1 }, { term: 146, get: (i) => Ly[i] || -1 }],
  tokenPrec: 2405
});
let io = null;
function no() {
  if (!io && typeof document == "object" && document.body) {
    let { style: i } = document.body, e = [], t = /* @__PURE__ */ new Set();
    for (let n in i)
      n != "cssText" && n != "cssFloat" && typeof i[n] == "string" && (/[A-Z]/.test(n) && (n = n.replace(/[A-Z]/g, (r) => "-" + r.toLowerCase())), t.has(n) || (e.push(n), t.add(n)));
    io = e.sort().map((n) => ({ type: "property", label: n, apply: n + ": " }));
  }
  return io || [];
}
const Wc = /* @__PURE__ */ [
  "active",
  "after",
  "any-link",
  "autofill",
  "backdrop",
  "before",
  "checked",
  "cue",
  "default",
  "defined",
  "disabled",
  "empty",
  "enabled",
  "file-selector-button",
  "first",
  "first-child",
  "first-letter",
  "first-line",
  "first-of-type",
  "focus",
  "focus-visible",
  "focus-within",
  "fullscreen",
  "has",
  "host",
  "host-context",
  "hover",
  "in-range",
  "indeterminate",
  "invalid",
  "is",
  "lang",
  "last-child",
  "last-of-type",
  "left",
  "link",
  "marker",
  "modal",
  "not",
  "nth-child",
  "nth-last-child",
  "nth-last-of-type",
  "nth-of-type",
  "only-child",
  "only-of-type",
  "optional",
  "out-of-range",
  "part",
  "placeholder",
  "placeholder-shown",
  "read-only",
  "read-write",
  "required",
  "right",
  "root",
  "scope",
  "selection",
  "slotted",
  "target",
  "target-text",
  "valid",
  "visited",
  "where"
].map((i) => ({ type: "class", label: i })), qc = /* @__PURE__ */ [
  "above",
  "absolute",
  "activeborder",
  "additive",
  "activecaption",
  "after-white-space",
  "ahead",
  "alias",
  "all",
  "all-scroll",
  "alphabetic",
  "alternate",
  "always",
  "antialiased",
  "appworkspace",
  "asterisks",
  "attr",
  "auto",
  "auto-flow",
  "avoid",
  "avoid-column",
  "avoid-page",
  "avoid-region",
  "axis-pan",
  "background",
  "backwards",
  "baseline",
  "below",
  "bidi-override",
  "blink",
  "block",
  "block-axis",
  "bold",
  "bolder",
  "border",
  "border-box",
  "both",
  "bottom",
  "break",
  "break-all",
  "break-word",
  "bullets",
  "button",
  "button-bevel",
  "buttonface",
  "buttonhighlight",
  "buttonshadow",
  "buttontext",
  "calc",
  "capitalize",
  "caps-lock-indicator",
  "caption",
  "captiontext",
  "caret",
  "cell",
  "center",
  "checkbox",
  "circle",
  "cjk-decimal",
  "clear",
  "clip",
  "close-quote",
  "col-resize",
  "collapse",
  "color",
  "color-burn",
  "color-dodge",
  "column",
  "column-reverse",
  "compact",
  "condensed",
  "contain",
  "content",
  "contents",
  "content-box",
  "context-menu",
  "continuous",
  "copy",
  "counter",
  "counters",
  "cover",
  "crop",
  "cross",
  "crosshair",
  "currentcolor",
  "cursive",
  "cyclic",
  "darken",
  "dashed",
  "decimal",
  "decimal-leading-zero",
  "default",
  "default-button",
  "dense",
  "destination-atop",
  "destination-in",
  "destination-out",
  "destination-over",
  "difference",
  "disc",
  "discard",
  "disclosure-closed",
  "disclosure-open",
  "document",
  "dot-dash",
  "dot-dot-dash",
  "dotted",
  "double",
  "down",
  "e-resize",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "element",
  "ellipse",
  "ellipsis",
  "embed",
  "end",
  "ethiopic-abegede-gez",
  "ethiopic-halehame-aa-er",
  "ethiopic-halehame-gez",
  "ew-resize",
  "exclusion",
  "expanded",
  "extends",
  "extra-condensed",
  "extra-expanded",
  "fantasy",
  "fast",
  "fill",
  "fill-box",
  "fixed",
  "flat",
  "flex",
  "flex-end",
  "flex-start",
  "footnotes",
  "forwards",
  "from",
  "geometricPrecision",
  "graytext",
  "grid",
  "groove",
  "hand",
  "hard-light",
  "help",
  "hidden",
  "hide",
  "higher",
  "highlight",
  "highlighttext",
  "horizontal",
  "hsl",
  "hsla",
  "hue",
  "icon",
  "ignore",
  "inactiveborder",
  "inactivecaption",
  "inactivecaptiontext",
  "infinite",
  "infobackground",
  "infotext",
  "inherit",
  "initial",
  "inline",
  "inline-axis",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "inset",
  "inside",
  "intrinsic",
  "invert",
  "italic",
  "justify",
  "keep-all",
  "landscape",
  "large",
  "larger",
  "left",
  "level",
  "lighter",
  "lighten",
  "line-through",
  "linear",
  "linear-gradient",
  "lines",
  "list-item",
  "listbox",
  "listitem",
  "local",
  "logical",
  "loud",
  "lower",
  "lower-hexadecimal",
  "lower-latin",
  "lower-norwegian",
  "lowercase",
  "ltr",
  "luminosity",
  "manipulation",
  "match",
  "matrix",
  "matrix3d",
  "medium",
  "menu",
  "menutext",
  "message-box",
  "middle",
  "min-intrinsic",
  "mix",
  "monospace",
  "move",
  "multiple",
  "multiple_mask_images",
  "multiply",
  "n-resize",
  "narrower",
  "ne-resize",
  "nesw-resize",
  "no-close-quote",
  "no-drop",
  "no-open-quote",
  "no-repeat",
  "none",
  "normal",
  "not-allowed",
  "nowrap",
  "ns-resize",
  "numbers",
  "numeric",
  "nw-resize",
  "nwse-resize",
  "oblique",
  "opacity",
  "open-quote",
  "optimizeLegibility",
  "optimizeSpeed",
  "outset",
  "outside",
  "outside-shape",
  "overlay",
  "overline",
  "padding",
  "padding-box",
  "painted",
  "page",
  "paused",
  "perspective",
  "pinch-zoom",
  "plus-darker",
  "plus-lighter",
  "pointer",
  "polygon",
  "portrait",
  "pre",
  "pre-line",
  "pre-wrap",
  "preserve-3d",
  "progress",
  "push-button",
  "radial-gradient",
  "radio",
  "read-only",
  "read-write",
  "read-write-plaintext-only",
  "rectangle",
  "region",
  "relative",
  "repeat",
  "repeating-linear-gradient",
  "repeating-radial-gradient",
  "repeat-x",
  "repeat-y",
  "reset",
  "reverse",
  "rgb",
  "rgba",
  "ridge",
  "right",
  "rotate",
  "rotate3d",
  "rotateX",
  "rotateY",
  "rotateZ",
  "round",
  "row",
  "row-resize",
  "row-reverse",
  "rtl",
  "run-in",
  "running",
  "s-resize",
  "sans-serif",
  "saturation",
  "scale",
  "scale3d",
  "scaleX",
  "scaleY",
  "scaleZ",
  "screen",
  "scroll",
  "scrollbar",
  "scroll-position",
  "se-resize",
  "self-start",
  "self-end",
  "semi-condensed",
  "semi-expanded",
  "separate",
  "serif",
  "show",
  "single",
  "skew",
  "skewX",
  "skewY",
  "skip-white-space",
  "slide",
  "slider-horizontal",
  "slider-vertical",
  "sliderthumb-horizontal",
  "sliderthumb-vertical",
  "slow",
  "small",
  "small-caps",
  "small-caption",
  "smaller",
  "soft-light",
  "solid",
  "source-atop",
  "source-in",
  "source-out",
  "source-over",
  "space",
  "space-around",
  "space-between",
  "space-evenly",
  "spell-out",
  "square",
  "start",
  "static",
  "status-bar",
  "stretch",
  "stroke",
  "stroke-box",
  "sub",
  "subpixel-antialiased",
  "svg_masks",
  "super",
  "sw-resize",
  "symbolic",
  "symbols",
  "system-ui",
  "table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row",
  "table-row-group",
  "text",
  "text-bottom",
  "text-top",
  "textarea",
  "textfield",
  "thick",
  "thin",
  "threeddarkshadow",
  "threedface",
  "threedhighlight",
  "threedlightshadow",
  "threedshadow",
  "to",
  "top",
  "transform",
  "translate",
  "translate3d",
  "translateX",
  "translateY",
  "translateZ",
  "transparent",
  "ultra-condensed",
  "ultra-expanded",
  "underline",
  "unidirectional-pan",
  "unset",
  "up",
  "upper-latin",
  "uppercase",
  "url",
  "var",
  "vertical",
  "vertical-text",
  "view-box",
  "visible",
  "visibleFill",
  "visiblePainted",
  "visibleStroke",
  "visual",
  "w-resize",
  "wait",
  "wave",
  "wider",
  "window",
  "windowframe",
  "windowtext",
  "words",
  "wrap",
  "wrap-reverse",
  "x-large",
  "x-small",
  "xor",
  "xx-large",
  "xx-small"
].map((i) => ({ type: "keyword", label: i })).concat(/* @__PURE__ */ [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "grey",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen"
].map((i) => ({ type: "constant", label: i }))), Iy = /* @__PURE__ */ [
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "form",
  "header",
  "hgroup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "meter",
  "nav",
  "ol",
  "output",
  "p",
  "pre",
  "ruby",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
].map((i) => ({ type: "type", label: i })), Gy = /* @__PURE__ */ [
  "@charset",
  "@color-profile",
  "@container",
  "@counter-style",
  "@font-face",
  "@font-feature-values",
  "@font-palette-values",
  "@import",
  "@keyframes",
  "@layer",
  "@media",
  "@namespace",
  "@page",
  "@position-try",
  "@property",
  "@scope",
  "@starting-style",
  "@supports",
  "@view-transition"
].map((i) => ({ type: "keyword", label: i })), gt = /^(\w[\w-]*|-\w[\w-]*|)$/, Ny = /^-(-[\w-]*)?$/;
function Uy(i, e) {
  var t;
  if ((i.name == "(" || i.type.isError) && (i = i.parent || i), i.name != "ArgList")
    return !1;
  let n = (t = i.parent) === null || t === void 0 ? void 0 : t.firstChild;
  return n?.name != "Callee" ? !1 : e.sliceString(n.from, n.to) == "var";
}
const Yc = /* @__PURE__ */ new UO(), Fy = ["Declaration"];
function Hy(i) {
  for (let e = i; ; ) {
    if (e.type.isTop)
      return e;
    if (!(e = e.parent))
      return i;
  }
}
function kd(i, e, t) {
  if (e.to - e.from > 4096) {
    let n = Yc.get(e);
    if (n)
      return n;
    let r = [], s = /* @__PURE__ */ new Set(), o = e.cursor(B.IncludeAnonymous);
    if (o.firstChild())
      do
        for (let l of kd(i, o.node, t))
          s.has(l.label) || (s.add(l.label), r.push(l));
      while (o.nextSibling());
    return Yc.set(e, r), r;
  } else {
    let n = [], r = /* @__PURE__ */ new Set();
    return e.cursor().iterate((s) => {
      var o;
      if (t(s) && s.matchContext(Fy) && ((o = s.node.nextSibling) === null || o === void 0 ? void 0 : o.name) == ":") {
        let l = i.sliceString(s.from, s.to);
        r.has(l) || (r.add(l), n.push({ label: l, type: "variable" }));
      }
    }), n;
  }
}
const Ky = (i) => (e) => {
  let { state: t, pos: n } = e, r = H(t).resolveInner(n, -1), s = r.type.isError && r.from == r.to - 1 && t.doc.sliceString(r.from, r.to) == "-";
  if (r.name == "PropertyName" || (s || r.name == "TagName") && /^(Block|Styles)$/.test(r.resolve(r.to).name))
    return { from: r.from, options: no(), validFor: gt };
  if (r.name == "ValueName")
    return { from: r.from, options: qc, validFor: gt };
  if (r.name == "PseudoClassName")
    return { from: r.from, options: Wc, validFor: gt };
  if (i(r) || (e.explicit || s) && Uy(r, t.doc))
    return {
      from: i(r) || s ? r.from : n,
      options: kd(t.doc, Hy(r), i),
      validFor: Ny
    };
  if (r.name == "TagName") {
    for (let { parent: a } = r; a; a = a.parent)
      if (a.name == "Block")
        return { from: r.from, options: no(), validFor: gt };
    return { from: r.from, options: Iy, validFor: gt };
  }
  if (r.name == "AtKeyword")
    return { from: r.from, options: Gy, validFor: gt };
  if (!e.explicit)
    return null;
  let o = r.resolve(n), l = o.childBefore(n);
  return l && l.name == ":" && o.name == "PseudoClassSelector" ? { from: n, options: Wc, validFor: gt } : l && l.name == ":" && o.name == "Declaration" || o.name == "ArgList" ? { from: n, options: qc, validFor: gt } : o.name == "Block" || o.name == "Styles" ? { from: n, options: no(), validFor: gt } : null;
}, Jy = /* @__PURE__ */ Ky((i) => i.name == "VariableName"), Jr = /* @__PURE__ */ ut.define({
  name: "css",
  parser: /* @__PURE__ */ By.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        Declaration: /* @__PURE__ */ si()
      }),
      /* @__PURE__ */ Et.add({
        "Block KeyframeList": us
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*\}$/,
    wordChars: "-"
  }
});
function wd() {
  return new fi(Jr, Jr.data.of({ autocomplete: Jy }));
}
const ex = 55, tx = 1, ix = 56, nx = 2, rx = 57, sx = 3, _c = 4, ox = 5, Qa = 6, vd = 7, Td = 8, Cd = 9, Xd = 10, lx = 11, ax = 12, hx = 13, ro = 58, cx = 14, fx = 15, jc = 59, Zd = 21, Ox = 23, Rd = 24, ux = 25, ul = 27, Ad = 28, dx = 29, px = 32, mx = 35, gx = 37, Sx = 38, Qx = 0, bx = 1, yx = {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  command: !0,
  embed: !0,
  frame: !0,
  hr: !0,
  img: !0,
  input: !0,
  keygen: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0,
  menuitem: !0
}, xx = {
  dd: !0,
  li: !0,
  optgroup: !0,
  option: !0,
  p: !0,
  rp: !0,
  rt: !0,
  tbody: !0,
  td: !0,
  tfoot: !0,
  th: !0,
  tr: !0
}, zc = {
  dd: { dd: !0, dt: !0 },
  dt: { dd: !0, dt: !0 },
  li: { li: !0 },
  option: { option: !0, optgroup: !0 },
  optgroup: { optgroup: !0 },
  p: {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    dir: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    menu: !0,
    nav: !0,
    ol: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    ul: !0
  },
  rp: { rp: !0, rt: !0 },
  rt: { rp: !0, rt: !0 },
  tbody: { tbody: !0, tfoot: !0 },
  td: { td: !0, th: !0 },
  tfoot: { tbody: !0 },
  th: { td: !0, th: !0 },
  thead: { tbody: !0, tfoot: !0 },
  tr: { tr: !0 }
};
function $x(i) {
  return i == 45 || i == 46 || i == 58 || i >= 65 && i <= 90 || i == 95 || i >= 97 && i <= 122 || i >= 161;
}
let Vc = null, Dc = null, Ec = 0;
function dl(i, e) {
  let t = i.pos + e;
  if (Ec == t && Dc == i) return Vc;
  let n = i.peek(e), r = "";
  for (; $x(n); )
    r += String.fromCharCode(n), n = i.peek(++e);
  return Dc = i, Ec = t, Vc = r ? r.toLowerCase() : n == Px || n == kx ? void 0 : null;
}
const Md = 60, es = 62, ba = 47, Px = 63, kx = 33, wx = 45;
function Lc(i, e) {
  this.name = i, this.parent = e;
}
const vx = [Qa, Xd, vd, Td, Cd], Tx = new bs({
  start: null,
  shift(i, e, t, n) {
    return vx.indexOf(e) > -1 ? new Lc(dl(n, 1) || "", i) : i;
  },
  reduce(i, e) {
    return e == Zd && i ? i.parent : i;
  },
  reuse(i, e, t, n) {
    let r = e.type.id;
    return r == Qa || r == gx ? new Lc(dl(n, 1) || "", i) : i;
  },
  strict: !1
}), Cx = new oe((i, e) => {
  if (i.next != Md) {
    i.next < 0 && e.context && i.acceptToken(ro);
    return;
  }
  i.advance();
  let t = i.next == ba;
  t && i.advance();
  let n = dl(i, 0);
  if (n === void 0) return;
  if (!n) return i.acceptToken(t ? fx : cx);
  let r = e.context ? e.context.name : null;
  if (t) {
    if (n == r) return i.acceptToken(lx);
    if (r && xx[r]) return i.acceptToken(ro, -2);
    if (e.dialectEnabled(Qx)) return i.acceptToken(ax);
    for (let s = e.context; s; s = s.parent) if (s.name == n) return;
    i.acceptToken(hx);
  } else {
    if (n == "script") return i.acceptToken(vd);
    if (n == "style") return i.acceptToken(Td);
    if (n == "textarea") return i.acceptToken(Cd);
    if (yx.hasOwnProperty(n)) return i.acceptToken(Xd);
    r && zc[r] && zc[r][n] ? i.acceptToken(ro, -1) : i.acceptToken(Qa);
  }
}, { contextual: !0 }), Xx = new oe((i) => {
  for (let e = 0, t = 0; ; t++) {
    if (i.next < 0) {
      t && i.acceptToken(jc);
      break;
    }
    if (i.next == wx)
      e++;
    else if (i.next == es && e >= 2) {
      t >= 3 && i.acceptToken(jc, -2);
      break;
    } else
      e = 0;
    i.advance();
  }
});
function Zx(i) {
  for (; i; i = i.parent)
    if (i.name == "svg" || i.name == "math") return !0;
  return !1;
}
const Rx = new oe((i, e) => {
  if (i.next == ba && i.peek(1) == es) {
    let t = e.dialectEnabled(bx) || Zx(e.context);
    i.acceptToken(t ? ox : _c, 2);
  } else i.next == es && i.acceptToken(_c, 1);
});
function ya(i, e, t) {
  let n = 2 + i.length;
  return new oe((r) => {
    for (let s = 0, o = 0, l = 0; ; l++) {
      if (r.next < 0) {
        l && r.acceptToken(e);
        break;
      }
      if (s == 0 && r.next == Md || s == 1 && r.next == ba || s >= 2 && s < n && r.next == i.charCodeAt(s - 2))
        s++, o++;
      else if (s == n && r.next == es) {
        l > o ? r.acceptToken(e, -o) : r.acceptToken(t, -(o - 2));
        break;
      } else if ((r.next == 10 || r.next == 13) && l) {
        r.acceptToken(e, 1);
        break;
      } else
        s = o = 0;
      r.advance();
    }
  });
}
const Ax = ya("script", ex, tx), Mx = ya("style", ix, nx), Wx = ya("textarea", rx, sx), qx = Vt({
  "Text RawText IncompleteTag IncompleteCloseTag": p.content,
  "StartTag StartCloseTag SelfClosingEndTag EndTag": p.angleBracket,
  TagName: p.tagName,
  "MismatchedCloseTag/TagName": [p.tagName, p.invalid],
  AttributeName: p.attributeName,
  "AttributeValue UnquotedAttributeValue": p.attributeValue,
  Is: p.definitionOperator,
  "EntityReference CharacterReference": p.character,
  Comment: p.blockComment,
  ProcessingInst: p.processingInstruction,
  DoctypeDecl: p.documentMeta
}), Yx = dt.deserialize({
  version: 14,
  states: ",xOVO!rOOO!ZQ#tO'#CrO!`Q#tO'#C{O!eQ#tO'#DOO!jQ#tO'#DRO!oQ#tO'#DTO!tOaO'#CqO#PObO'#CqO#[OdO'#CqO$kO!rO'#CqOOO`'#Cq'#CqO$rO$fO'#DUO$zQ#tO'#DWO%PQ#tO'#DXOOO`'#Dl'#DlOOO`'#DZ'#DZQVO!rOOO%UQ&rO,59^O%aQ&rO,59gO%lQ&rO,59jO%wQ&rO,59mO&SQ&rO,59oOOOa'#D_'#D_O&_OaO'#CyO&jOaO,59]OOOb'#D`'#D`O&rObO'#C|O&}ObO,59]OOOd'#Da'#DaO'VOdO'#DPO'bOdO,59]OOO`'#Db'#DbO'jO!rO,59]O'qQ#tO'#DSOOO`,59],59]OOOp'#Dc'#DcO'vO$fO,59pOOO`,59p,59pO(OQ#|O,59rO(TQ#|O,59sOOO`-E7X-E7XO(YQ&rO'#CtOOQW'#D['#D[O(hQ&rO1G.xOOOa1G.x1G.xOOO`1G/Z1G/ZO(sQ&rO1G/ROOOb1G/R1G/RO)OQ&rO1G/UOOOd1G/U1G/UO)ZQ&rO1G/XOOO`1G/X1G/XO)fQ&rO1G/ZOOOa-E7]-E7]O)qQ#tO'#CzOOO`1G.w1G.wOOOb-E7^-E7^O)vQ#tO'#C}OOOd-E7_-E7_O){Q#tO'#DQOOO`-E7`-E7`O*QQ#|O,59nOOOp-E7a-E7aOOO`1G/[1G/[OOO`1G/^1G/^OOO`1G/_1G/_O*VQ,UO,59`OOQW-E7Y-E7YOOOa7+$d7+$dOOO`7+$u7+$uOOOb7+$m7+$mOOOd7+$p7+$pOOO`7+$s7+$sO*bQ#|O,59fO*gQ#|O,59iO*lQ#|O,59lOOO`1G/Y1G/YO*qO7[O'#CwO+SOMhO'#CwOOQW1G.z1G.zOOO`1G/Q1G/QOOO`1G/T1G/TOOO`1G/W1G/WOOOO'#D]'#D]O+eO7[O,59cOOQW,59c,59cOOOO'#D^'#D^O+vOMhO,59cOOOO-E7Z-E7ZOOQW1G.}1G.}OOOO-E7[-E7[",
  stateData: ",c~O!_OS~OUSOVPOWQOXROYTO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O|_O!eZO~OgaO~OgbO~OgcO~OgdO~OgeO~O!XfOPmP![mP~O!YiOQpP![pP~O!ZlORsP![sP~OUSOVPOWQOXROYTOZqO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O!eZO~O![rO~P#gO!]sO!fuO~OgvO~OgwO~OS|OT}OiyO~OS!POT}OiyO~OS!ROT}OiyO~OS!TOT}OiyO~OS}OT}OiyO~O!XfOPmX![mX~OP!WO![!XO~O!YiOQpX![pX~OQ!ZO![!XO~O!ZlORsX![sX~OR!]O![!XO~O![!XO~P#gOg!_O~O!]sO!f!aO~OS!bO~OS!cO~Oj!dOShXThXihX~OS!fOT!gOiyO~OS!hOT!gOiyO~OS!iOT!gOiyO~OS!jOT!gOiyO~OS!gOT!gOiyO~Og!kO~Og!lO~Og!mO~OS!nO~Ol!qO!a!oO!c!pO~OS!rO~OS!sO~OS!tO~Ob!uOc!uOd!uO!a!wO!b!uO~Ob!xOc!xOd!xO!c!wO!d!xO~Ob!uOc!uOd!uO!a!{O!b!uO~Ob!xOc!xOd!xO!c!{O!d!xO~OT~cbd!ey|!e~",
  goto: "%q!aPPPPPPPPPPPPPPPPPPPPP!b!hP!nPP!zP!}#Q#T#Z#^#a#g#j#m#s#y!bP!b!bP$P$V$m$s$y%P%V%]%cPPPPPPPP%iX^OX`pXUOX`pezabcde{!O!Q!S!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ!ObQ!QcQ!SdQ!UeZ!e{!O!Q!S!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",
  nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
  maxTerm: 68,
  context: Tx,
  nodeProps: [
    ["closedBy", -10, 1, 2, 3, 7, 8, 9, 10, 11, 12, 13, "EndTag", 6, "EndTag SelfClosingEndTag", -4, 22, 31, 34, 37, "CloseTag"],
    ["openedBy", 4, "StartTag StartCloseTag", 5, "StartTag", -4, 30, 33, 36, 38, "OpenTag"],
    ["group", -10, 14, 15, 18, 19, 20, 21, 40, 41, 42, 43, "Entity", 17, "Entity TextContent", -3, 29, 32, 35, "TextContent Entity"],
    ["isolate", -11, 22, 30, 31, 33, 34, 36, 37, 38, 39, 42, 43, "ltr", -3, 27, 28, 40, ""]
  ],
  propSources: [qx],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|caPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bXaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UVaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pTaPOv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!dpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({WaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!b`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!b`!dpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYlWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]`aP!b`!dp!_^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebiSlWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXiSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vciSaP!b`!dpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!ahaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WiiSlWd!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zblWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOb!R!R7tP;=`<%l7S!Z8OYlWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{iiSlWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbiSlWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QciSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXiSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TalWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOc!R!RAwP;=`<%lAY!ZBRYlWc!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbiSlWc!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbiSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXiSc!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!cxaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYliSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_kiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_XaP!b`!dp!fQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZiSgQaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!b`!dpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!b`!dp!ePOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!b`!dpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!b`!dpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!b`!dpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!b`!dpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!b`!dpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!b`!dpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!b`!dpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!dpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO|PP!-nP;=`<%l!-Sq!-xS!dp|POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!b`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!b`|POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!b`!dp|POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!b`!dpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!b`!dpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!b`!dpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!b`!dpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!b`!dpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!b`!dpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!dpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOyPP!7TP;=`<%l!6Vq!7]V!dpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!dpyPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!b`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!b`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!b`yPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!b`!dpyPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXjSaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",
  tokenizers: [Ax, Mx, Wx, Rx, Cx, Xx, 0, 1, 2, 3, 4, 5],
  topRules: { Document: [0, 16] },
  dialects: { noMatch: 0, selfClosing: 515 },
  tokenPrec: 517
});
function Wd(i, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let n of i.getChildren(Rd)) {
    let r = n.getChild(ux), s = n.getChild(ul) || n.getChild(Ad);
    r && (t[e.read(r.from, r.to)] = s ? s.type.id == ul ? e.read(s.from + 1, s.to - 1) : e.read(s.from, s.to) : "");
  }
  return t;
}
function Bc(i, e) {
  let t = i.getChild(Ox);
  return t ? e.read(t.from, t.to) : " ";
}
function so(i, e, t) {
  let n;
  for (let r of t)
    if (!r.attrs || r.attrs(n || (n = Wd(i.node.parent.firstChild, e))))
      return { parser: r.parser, bracketed: !0 };
  return null;
}
function qd(i = [], e = []) {
  let t = [], n = [], r = [], s = [];
  for (let l of i)
    (l.tag == "script" ? t : l.tag == "style" ? n : l.tag == "textarea" ? r : s).push(l);
  let o = e.length ? /* @__PURE__ */ Object.create(null) : null;
  for (let l of e) (o[l.name] || (o[l.name] = [])).push(l);
  return L0((l, a) => {
    let h = l.type.id;
    if (h == dx) return so(l, a, t);
    if (h == px) return so(l, a, n);
    if (h == mx) return so(l, a, r);
    if (h == Zd && s.length) {
      let c = l.node, f = c.firstChild, O = f && Bc(f, a), u;
      if (O) {
        for (let d of s)
          if (d.tag == O && (!d.attrs || d.attrs(u || (u = Wd(f, a))))) {
            let m = c.lastChild, g = m.type.id == Sx ? m.from : c.to;
            if (g > f.to)
              return { parser: d.parser, overlay: [{ from: f.to, to: g }] };
          }
      }
    }
    if (o && h == Rd) {
      let c = l.node, f;
      if (f = c.firstChild) {
        let O = o[a.read(f.from, f.to)];
        if (O) for (let u of O) {
          if (u.tagName && u.tagName != Bc(c.parent, a)) continue;
          let d = c.lastChild;
          if (d.type.id == ul) {
            let m = d.from + 1, g = d.lastChild, S = d.to - (g && g.isError ? 0 : 1);
            if (S > m) return { parser: u.parser, overlay: [{ from: m, to: S }], bracketed: !0 };
          } else if (d.type.id == Ad)
            return { parser: u.parser, overlay: [{ from: d.from, to: d.to }] };
        }
      }
    }
    return null;
  });
}
const _x = 316, jx = 317, Ic = 1, zx = 2, Vx = 3, Dx = 4, Ex = 318, Lx = 320, Bx = 321, Ix = 5, Gx = 6, Nx = 0, pl = [
  9,
  10,
  11,
  12,
  13,
  32,
  133,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8232,
  8233,
  8239,
  8287,
  12288
], Yd = 125, Ux = 59, ml = 47, Fx = 42, Hx = 43, Kx = 45, Jx = 60, e$ = 44, t$ = 63, i$ = 46, n$ = 91, r$ = new bs({
  start: !1,
  shift(i, e) {
    return e == Ix || e == Gx || e == Lx ? i : e == Bx;
  },
  strict: !1
}), s$ = new oe((i, e) => {
  let { next: t } = i;
  (t == Yd || t == -1 || e.context) && i.acceptToken(Ex);
}, { contextual: !0, fallback: !0 }), o$ = new oe((i, e) => {
  let { next: t } = i, n;
  pl.indexOf(t) > -1 || t == ml && ((n = i.peek(1)) == ml || n == Fx) || t != Yd && t != Ux && t != -1 && !e.context && i.acceptToken(_x);
}, { contextual: !0 }), l$ = new oe((i, e) => {
  i.next == n$ && !e.context && i.acceptToken(jx);
}, { contextual: !0 }), a$ = new oe((i, e) => {
  let { next: t } = i;
  if (t == Hx || t == Kx) {
    if (i.advance(), t == i.next) {
      i.advance();
      let n = !e.context && e.canShift(Ic);
      i.acceptToken(n ? Ic : zx);
    }
  } else t == t$ && i.peek(1) == i$ && (i.advance(), i.advance(), (i.next < 48 || i.next > 57) && i.acceptToken(Vx));
}, { contextual: !0 });
function oo(i, e) {
  return i >= 65 && i <= 90 || i >= 97 && i <= 122 || i == 95 || i >= 192 || !e && i >= 48 && i <= 57;
}
const h$ = new oe((i, e) => {
  if (i.next != Jx || !e.dialectEnabled(Nx) || (i.advance(), i.next == ml)) return;
  let t = 0;
  for (; pl.indexOf(i.next) > -1; )
    i.advance(), t++;
  if (oo(i.next, !0)) {
    for (i.advance(), t++; oo(i.next, !1); )
      i.advance(), t++;
    for (; pl.indexOf(i.next) > -1; )
      i.advance(), t++;
    if (i.next == e$) return;
    for (let n = 0; ; n++) {
      if (n == 7) {
        if (!oo(i.next, !0)) return;
        break;
      }
      if (i.next != "extends".charCodeAt(n)) break;
      i.advance(), t++;
    }
  }
  i.acceptToken(Dx, -t);
}), c$ = Vt({
  "get set async static": p.modifier,
  "for while do if else switch try catch finally return throw break continue default case defer": p.controlKeyword,
  "in of await yield void typeof delete instanceof as satisfies": p.operatorKeyword,
  "let var const using function class extends": p.definitionKeyword,
  "import export from": p.moduleKeyword,
  "with debugger new": p.keyword,
  TemplateString: p.special(p.string),
  super: p.atom,
  BooleanLiteral: p.bool,
  this: p.self,
  null: p.null,
  Star: p.modifier,
  VariableName: p.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": p.function(p.variableName),
  VariableDefinition: p.definition(p.variableName),
  Label: p.labelName,
  PropertyName: p.propertyName,
  PrivatePropertyName: p.special(p.propertyName),
  "CallExpression/MemberExpression/PropertyName": p.function(p.propertyName),
  "FunctionDeclaration/VariableDefinition": p.function(p.definition(p.variableName)),
  "ClassDeclaration/VariableDefinition": p.definition(p.className),
  "NewExpression/VariableName": p.className,
  PropertyDefinition: p.definition(p.propertyName),
  PrivatePropertyDefinition: p.definition(p.special(p.propertyName)),
  UpdateOp: p.updateOperator,
  "LineComment Hashbang": p.lineComment,
  BlockComment: p.blockComment,
  Number: p.number,
  String: p.string,
  Escape: p.escape,
  ArithOp: p.arithmeticOperator,
  LogicOp: p.logicOperator,
  BitOp: p.bitwiseOperator,
  CompareOp: p.compareOperator,
  RegExp: p.regexp,
  Equals: p.definitionOperator,
  Arrow: p.function(p.punctuation),
  ": Spread": p.punctuation,
  "( )": p.paren,
  "[ ]": p.squareBracket,
  "{ }": p.brace,
  "InterpolationStart InterpolationEnd": p.special(p.brace),
  ".": p.derefOperator,
  ", ;": p.separator,
  "@": p.meta,
  TypeName: p.typeName,
  TypeDefinition: p.definition(p.typeName),
  "type enum interface implements namespace module declare": p.definitionKeyword,
  "abstract global Privacy readonly override": p.modifier,
  "is keyof unique infer asserts": p.operatorKeyword,
  JSXAttributeValue: p.attributeValue,
  JSXText: p.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": p.angleBracket,
  "JSXIdentifier JSXNameSpacedName": p.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": p.attributeName,
  "JSXBuiltin/JSXIdentifier": p.standard(p.tagName)
}), f$ = { __proto__: null, export: 20, as: 25, from: 33, default: 36, async: 41, function: 42, in: 52, out: 55, const: 56, extends: 60, this: 64, true: 72, false: 72, null: 84, void: 88, typeof: 92, super: 108, new: 142, delete: 154, yield: 163, await: 167, class: 172, public: 235, private: 235, protected: 235, readonly: 237, instanceof: 256, satisfies: 259, import: 292, keyof: 349, unique: 353, infer: 359, asserts: 395, is: 397, abstract: 417, implements: 419, type: 421, let: 424, var: 426, using: 429, interface: 435, enum: 439, namespace: 445, module: 447, declare: 451, global: 455, defer: 471, for: 476, of: 485, while: 488, with: 492, do: 496, if: 500, else: 502, switch: 506, case: 512, try: 518, catch: 522, finally: 526, return: 530, throw: 534, break: 538, continue: 542, debugger: 546 }, O$ = { __proto__: null, async: 129, get: 131, set: 133, declare: 195, public: 197, private: 197, protected: 197, static: 199, abstract: 201, override: 203, readonly: 209, accessor: 211, new: 401 }, u$ = { __proto__: null, "<": 193 }, d$ = dt.deserialize({
  version: 14,
  states: "$F|Q%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Il'#IlO1XQ`O'#GsO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JrO6[Q!0MxO'#JsO6uQ`O'#F]O6zQ,UO'#FtOOQ!0Lf'#Ff'#FfO7VO7dO'#FfO9XQMhO'#F|O9`Q`O'#F{OOQ!0Lf'#Js'#JsOOQ!0Lb'#Jr'#JrO9eQ`O'#GwOOQ['#K_'#K_O9pQ`O'#IYO9uQ!0LrO'#IZOOQ['#J`'#J`OOQ['#I_'#I_Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GsO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EyO;hQMhO'#FeO;xQ`O'#GsOOQO'#K`'#K`O;}Q`O'#K`O<]Q`O'#G{O<]Q`O'#G|O<]Q`O'#HOO9kQ`O'#HRO=SQ`O'#HUO>kQ`O'#CeO>{Q`O'#HcO?TQ`O'#HiO?TQ`O'#HkO`QlO'#HmO?TQ`O'#HoO?TQ`O'#HrO?YQ`O'#HxO?_Q!0LsO'#IOO%[QlO'#IQO?jQ!0LsO'#ISO?uQ!0LsO'#IUO9uQ!0LrO'#IWO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FeOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jv'#JvO%[QlO'#JvOOQO'#Jy'#JyOOQO'#Ih'#IhOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#J}'#J}OC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jx'#JxODlQpO'#JyOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CD})CD}OOOO'#I`'#I`OFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ia'#IaOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Ic'#IcOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IdOGyQ`O'#JtOIxQ!fO'#JtO+}QlO'#JtOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KTOKPQ`O'#KSOKPQ`O'#KSOKXQ`O,5;^OK^Q`O'#KROOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KQONtQ`O'#KPO9eQ`O'#KPO! YQ`O'#KPO! bQ`O,5;]O! gQ`O'#KPO!#lQ!fO'#JsOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#Jz'#JzOOQO-E<j-E<jO9kQ`O,5=_O!$rQ`O,5=_O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;dO!(|QpO,5;dO%[QlO,5;dOOQ['#FT'#FTOOQ['#FV'#FVO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eO%[QlO,5;eOOQ['#FZ'#FZO!)[QlO,5;tOOQ!0Lf,5;y,5;yOOQ!0Lf,5;z,5;zOOQ!0Lf,5;|,5;|O%[QlO'#IpO!+_Q!0LrO,5<iO%[QlO,5;eO!&zQMhO,5;eO!+|QMhO,5;eO!-nQMhO'#E^O%[QlO,5;wOOQ!0Lf,5;{,5;{O!-uQ,UO'#FjO!.rQ,UO'#KXO!.^Q,UO'#KXO!.yQ,UO'#KXOOQO'#KX'#KXO!/_Q,UO,5<SOOOW,5<`,5<`O!/pQlO'#FvOOOW'#Io'#IoO7VO7dO,5<QO!/wQ,UO'#FxOOQ!0Lf,5<Q,5<QO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<eO!1pQ`O,5<hO!3YQ(CWO'#GXO!3jQ`O'#GYO!3oQ`O'#GYO!5_Q(CWO'#G^O!6dQpO'#GbOOQO'#Gn'#GnO!,TQMhO'#GmOOQO'#Gp'#GpO!,TQMhO'#GoO!7VQ$IUO'#JlOOQ!0Lh'#Jl'#JlO!7aQ`O'#JkO!7oQ`O'#JjO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<eO1SQ`O'#DZO!,TQMhO'#GPO!,TQMhO'#GRO!8gQ`O'#GTO!8lQ`O'#GUO!3oQ`O'#G[O!,TQMhO'#GaO<]Q`O'#JkO!8qQ`O'#EqO!9`Q`O,5<gOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KR'#KRO!:iQ!0LrO'#KaO9uQ!0LrO,5=cO`QlO,5>tOOQ['#Jh'#JhOOQ[,5>u,5>uOOQ[-E<]-E<]O!<hQ!0MxO,5:bO!:]QpO,5:`O!?RQ!0MxO,5:jO%[QlO,5:jO!AiQ!0MxO,5:lOOQO,5@z,5@zO!BYQMhO,5=_O!BhQ!0LrO'#JiO9`Q`O'#JiO!ByQ!0LrO,59ZO!CUQpO,59ZO!C^QMhO,59ZO:dQMhO,59ZO!CiQ`O,5;ZO!CqQ`O'#HbO!DVQ`O'#KdO%[QlO,5;}O!:]QpO,5<PO!D_Q`O,5=zO!DdQ`O,5=zO!DiQ`O,5=zO!DwQ`O,5=zO9uQ!0LrO,5=zO<]Q`O,5=jOOQO'#Cy'#CyO!EOQpO,5=gO!EWQMhO,5=hO!EcQ`O,5=jO!EhQ!bO,5=mO!EpQ`O'#K`O?YQ`O'#HWO9kQ`O'#HYO!EuQ`O'#HYO:dQMhO'#H[O!EzQ`O'#H[OOQ[,5=p,5=pO!FPQ`O'#H]O!FbQ`O'#CoO!FgQ`O,59PO!FqQ`O,59PO!HvQlO,59POOQ[,59P,59PO!IWQ!0LrO,59PO%[QlO,59PO!KcQlO'#HeOOQ['#Hf'#HfOOQ['#Hg'#HgO`QlO,5=}O!KyQ`O,5=}O`QlO,5>TO`QlO,5>VO!LOQ`O,5>XO`QlO,5>ZO!LTQ`O,5>^O!LYQlO,5>dOOQ[,5>j,5>jO%[QlO,5>jO9uQ!0LrO,5>lOOQ[,5>n,5>nO#!dQ`O,5>nOOQ[,5>p,5>pO#!dQ`O,5>pOOQ[,5>r,5>rO##QQpO'#D_O%[QlO'#JvO##sQpO'#JvO##}QpO'#DmO#$`QpO'#DmO#&qQlO'#DmO#&xQ`O'#JuO#'QQ`O,5:WO#'VQ`O'#EtO#'eQ`O'#KUO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CUQpO,5;YO!C^QMhO,5;YO:dQMhO,5;YO#(`Q`O,5@bO#(eQ07dO,5:sOOQO-E<f-E<fO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!ByQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CUQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I^'#I^P#+RO&2DjO,58|POOO,58|,58|OOOO-E<^-E<^OOQ!0Lh1G.p1G.pOOOO-E<_-E<_OOOO,59},59}O#+^Q!bO,59}OOOO-E<a-E<aOOQ!0Lf1G/g1G/gO#+cQ!fO,5?OO+}QlO,5?OOOQO,5?U,5?UO#+mQlO'#IdOOQO-E<b-E<bO#+zQ`O,5@`O#,SQ!fO,5@`O#,ZQ`O,5@nOOQ!0Lf1G/m1G/mO%[QlO,5@oO#,cQ`O'#IjOOQO-E<h-E<hO#,ZQ`O,5@nOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@lO#,wQ!0LrO,5@lO#-YQ!0LrO,5@lO#-aQ`O,5@kO9eQ`O,5@kO#-iQ`O,5@kO#-wQ`O'#ImO#-aQ`O,5@kOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2yO9kQ`O1G2yOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GW'#GWO#0rQ!0MzO'#JlO!$wQlO1G0uO#2}Q!fO'#JwO%[QlO'#JwO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1O1G1OO%[QlO1G1OOOQ!0Lf1G1f1G1fO#3^Q`O1G1OO#5rQ!0MxO1G1PO#5yQ!0MxO1G1PO#8aQ!0MxO1G1PO#8hQ!0MxO1G1PO#;OQ!0MxO1G1PO#=fQ!0MxO1G1PO#=mQ!0MxO1G1PO#=tQ!0MxO1G1PO#@[Q!0MxO1G1PO#@cQ!0MxO1G1PO#BpQ?MtO'#CiO#DkQ?MtO1G1`O#DrQ?MtO'#JsO#EVQ!0MxO,5?[OOQ!0Lb-E<n-E<nO#GdQ!0MxO1G1PO#HaQ!0MzO1G1POOQ!0Lf1G1P1G1PO#IdQMjO'#J|O#InQ`O,5:xO#IsQ!0MxO1G1cO#JgQ,UO,5<WO#JoQ,UO,5<XO#JwQ,UO'#FoO#K`Q`O'#FnOOQO'#KY'#KYOOQO'#In'#InO#KeQ,UO1G1nOOQ!0Lf1G1n1G1nOOOW1G1y1G1yO#KvQ?MtO'#JrO#LQQ`O,5<bO!)[QlO,5<bOOOW-E<m-E<mOOQ!0Lf1G1l1G1lO#LVQpO'#KXOOQ!0Lf,5<d,5<dO#L_QpO,5<dO#LdQMhO'#DTOOOO'#Ib'#IbO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2PO!8lQ`O'#IrO#LvQ`O,5<zOOQ!0Lh,5<w,5<wO!,TQMhO'#IuO#MdQMjO,5=XO!,TQMhO'#IwO#NVQMjO,5=ZO!&zQMhO,5=]OOQO1G2S1G2SO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GbO$!dQ!dO,5<sO$!kQ`O'#K[O9eQ`O'#K[O$!yQ`O,5<uO$#aQ!dO'#C{O!,TQMhO,5<tO$#kQ`O'#GZO$$PQ`O,5<tO$$UQ!dO'#GWO$$cQ!dO'#K]O$$mQ`O'#K]O!&zQMhO'#K]O$$rQ`O,5<xO$$wQlO'#JvO$%RQpO'#GcO#$`QpO'#GcO$%dQ`O'#GgO!3oQ`O'#GkO$%iQ!0LrO'#ItO$%tQpO,5<|OOQ!0Lp,5<|,5<|O$%{QpO'#GcO$&YQpO'#GdO$&kQpO'#GdO$&pQMjO,5=XO$'QQMjO,5=ZOOQ!0Lh,5=^,5=^O!,TQMhO,5@VO!,TQMhO,5@VO$'bQ`O'#IyO$'vQ`O,5@UO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@VO$)TQ$IYO,59uOOQ!0Lh'#Jp'#JpO$)vQMjO,5<kO$*iQMjO,5<mO@zQ`O,5<oOOQ!0Lh,5<p,5<pO$*sQ`O,5<vO$*xQMjO,5<{O$+YQ`O'#KPO!$wQlO1G2RO$+_Q`O1G2RO9eQ`O'#KSO9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I{O$+dQ!0LrO,5@{OOQ[1G2}1G2}OOQ[1G4`1G4`OOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-fQ!0MxO1G0UOOQ[1G2y1G2yO!&zQMhO1G2yO%[QlO1G2yO#.tQ`O1G2yO$/jQMhO'#EkOOQ!0Lb,5@T,5@TO$/wQ!0LrO,5@TOOQ[1G.u1G.uO!ByQ!0LrO1G.uO!CUQpO1G.uO!C^QMhO1G.uO$0YQ`O1G0uO$0_Q`O'#CiO$0jQ`O'#KeO$0rQ`O,5=|O$0wQ`O'#KeO$0|Q`O'#KeO$1[Q`O'#JRO$1jQ`O,5AOO$1rQ!fO1G1iOOQ!0Lf1G1k1G1kO9kQ`O1G3fO@zQ`O1G3fO$1yQ`O1G3fO$2OQ`O1G3fO!DiQ`O1G3fO9uQ!0LrO1G3fOOQ[1G3f1G3fO!EcQ`O1G3UO!&zQMhO1G3RO$2TQ`O1G3ROOQ[1G3S1G3SO!&zQMhO1G3SO$2YQ`O1G3SO$2bQpO'#HQOOQ[1G3U1G3UO!6_QpO'#I}O!EhQ!bO1G3XOOQ[1G3X1G3XOOQ[,5=r,5=rO$2jQMhO,5=tO9kQ`O,5=tO$%dQ`O,5=vO9`Q`O,5=vO!CUQpO,5=vO!C^QMhO,5=vO:dQMhO,5=vO$2xQ`O'#KcO$3TQ`O,5=wOOQ[1G.k1G.kO$3YQ!0LrO1G.kO@zQ`O1G.kO$3eQ`O1G.kO9uQ!0LrO1G.kO$5mQ!fO,5AQO$5zQ`O,5AQO9eQ`O,5AQO$6VQlO,5>PO$6^Q`O,5>POOQ[1G3i1G3iO`QlO1G3iOOQ[1G3o1G3oOOQ[1G3q1G3qO?TQ`O1G3sO$6cQlO1G3uO$:gQlO'#HtOOQ[1G3x1G3xO$:tQ`O'#HzO?YQ`O'#H|OOQ[1G4O1G4OO$:|QlO1G4OO9uQ!0LrO1G4UOOQ[1G4W1G4WOOQ!0Lb'#G_'#G_O9uQ!0LrO1G4YO9uQ!0LrO1G4[O$?TQ`O,5@bO!)[QlO,5;`O9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CUQpO,5:XO$?YQ?MtO,5:XOOQO,5;`,5;`O$?dQpO'#IeO$?zQ`O,5@aOOQ!0Lf1G/r1G/rO$@SQpO'#IkO$@^Q`O,5@pOOQ!0Lb1G0y1G0yO#$`QpO,5:XOOQO'#Ig'#IgO$@fQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CUQpO1G0tO!C^QMhO1G0tOOQ!0Lb1G5|1G5|O!ByQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@mQ!0LrO1G0mO$@xQ!0LrO1G0mO!CUQpO1G0^ODWQpO1G0^O$AWQ!0LrO1G0mOOQO1G0^1G0^O$AlQ!0MxO1G0mPOOO-E<[-E<[POOO1G.h1G.hOOOO1G/i1G/iO$AvQ!bO,5<iO$BOQ!fO1G4jOOQO1G4p1G4pO%[QlO,5?OO$BYQ`O1G5zO$BbQ`O1G6YO$BjQ!fO1G6ZO9eQ`O,5?UO$BtQ!0MxO1G6WO%[QlO1G6WO$CUQ!0LrO1G6WO$CgQ`O1G6VO$CgQ`O1G6VO9eQ`O1G6VO$CoQ`O,5?XO9eQ`O,5?XOOQO,5?X,5?XO$DTQ`O,5?XO$+YQ`O,5?XOOQO-E<k-E<kOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(e7+(eO!&zQMhO7+(eO%[QlO7+(eO$DcQ`O7+(eO$DnQMhO7+(eO$D|Q!0MzO,5=XO$GXQ!0MzO,5=ZO$IdQ!0MzO,5=XO$KuQ!0MzO,5=ZO$NWQ!0MzO,59uO%!]Q!0MzO,5<kO%$hQ!0MzO,5<mO%&sQ!0MzO,5<{OOQ!0Lf7+&a7+&aO%)UQ!0MxO7+&aO%)xQlO'#IfO%*VQ`O,5@cO%*_Q!fO,5@cOOQ!0Lf1G0P1G0PO%*iQ`O7+&jOOQ!0Lf7+&j7+&jO%*nQ?MtO,5:fO%[QlO7+&zO%*xQ?MtO,5:bO%+VQ?MtO,5:jO%+aQ?MtO,5:lO%+kQMhO'#IiO%+uQ`O,5@hOOQ!0Lh1G0d1G0dOOQO1G1r1G1rOOQO1G1s1G1sO%+}Q!jO,5<ZO!)[QlO,5<YOOQO-E<l-E<lOOQ!0Lf7+'Y7+'YOOOW7+'e7+'eOOOW1G1|1G1|O%,YQ`O1G1|OOQ!0Lf1G2O1G2OOOOO,59o,59oO%,_Q!dO,59oOOOO-E<`-E<`OOQ!0Lh1G/X1G/XO%,fQ!0MxO7+'kOOQ!0Lh,5?^,5?^O%-YQMhO1G2fP%-aQ`O'#IrPOQ!0Lh-E<p-E<pO%-}QMjO,5?aOOQ!0Lh-E<s-E<sO%.pQMjO,5?cOOQ!0Lh-E<u-E<uO%.zQ!dO1G2wO%/RQ!dO'#CrO%/iQMhO'#KSO$$wQlO'#JvOOQ!0Lh1G2_1G2_O%/sQ`O'#IqO%0[Q`O,5@vO%0[Q`O,5@vO%0dQ`O,5@vO%0oQ`O,5@vOOQO1G2a1G2aO%0}QMjO1G2`O$+YQ`O'#K[O!,TQMhO1G2`O%1_Q(CWO'#IsO%1lQ`O,5@wO!&zQMhO,5@wO%1tQ!dO,5@wOOQ!0Lh1G2d1G2dO%4UQ!fO'#CiO%4`Q`O,5=POOQ!0Lb,5<},5<}O%4hQpO,5<}OOQ!0Lb,5=O,5=OOCwQ`O,5<}O%4sQpO,5<}OOQ!0Lb,5=R,5=RO$+YQ`O,5=VOOQO,5?`,5?`OOQO-E<r-E<rOOQ!0Lp1G2h1G2hO#$`QpO,5<}O$$wQlO,5=PO%5RQ`O,5=OO%5^QpO,5=OO!,TQMhO'#IuO%6WQMjO1G2sO!,TQMhO'#IwO%6yQMjO1G2uO%7TQMjO1G5qO%7_QMjO1G5qOOQO,5?e,5?eOOQO-E<w-E<wOOQO1G.{1G.{O!,TQMhO1G5qO!,TQMhO1G5qO!:]QpO,59wO%[QlO,59wOOQ!0Lh,5<j,5<jO%7lQ`O1G2ZO!,TQMhO1G2bO%7qQ!0MxO7+'mOOQ!0Lf7+'m7+'mO!$wQlO7+'mO%8eQ`O,5;`OOQ!0Lb,5?g,5?gOOQ!0Lb-E<y-E<yO%8jQ!dO'#K^O#(ZQ`O7+(eO4UQ!fO7+(eO$DfQ`O7+(eO%8tQ!0MvO'#CiO%9XQ!0MvO,5=SO%9lQ`O,5=SO%9tQ`O,5=SOOQ!0Lb1G5o1G5oOOQ[7+$a7+$aO!ByQ!0LrO7+$aO!CUQpO7+$aO!$wQlO7+&aO%9yQ`O'#JQO%:bQ`O,5APOOQO1G3h1G3hO9kQ`O,5APO%:bQ`O,5APO%:jQ`O,5APOOQO,5?m,5?mOOQO-E=P-E=POOQ!0Lf7+'T7+'TO%:oQ`O7+)QO9uQ!0LrO7+)QO9kQ`O7+)QO@zQ`O7+)QO%:tQ`O7+)QOOQ[7+)Q7+)QOOQ[7+(p7+(pO%:yQ!0MvO7+(mO!&zQMhO7+(mO!E^Q`O7+(nOOQ[7+(n7+(nO!&zQMhO7+(nO%;TQ`O'#KbO%;`Q`O,5=lOOQO,5?i,5?iOOQO-E<{-E<{OOQ[7+(s7+(sO%<rQpO'#HZOOQ[1G3`1G3`O!&zQMhO1G3`O%[QlO1G3`O%<yQ`O1G3`O%=UQMhO1G3`O9uQ!0LrO1G3bO$%dQ`O1G3bO9`Q`O1G3bO!CUQpO1G3bO!C^QMhO1G3bO%=dQ`O'#JPO%=xQ`O,5@}O%>QQpO,5@}OOQ!0Lb1G3c1G3cOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>]Q`O7+$VO%[QlO1G6lO%[QlO1G6mO%>bQ!0LrO1G6lO%>lQlO1G3kO%>sQ`O1G3kO%>xQlO1G3kOOQ[7+)T7+)TO9uQ!0LrO7+)_O`QlO7+)aOOQ['#Kh'#KhOOQ['#JS'#JSO%?PQlO,5>`OOQ[,5>`,5>`O%[QlO'#HuO%?^Q`O'#HwOOQ[,5>f,5>fO9eQ`O,5>fOOQ[,5>h,5>hOOQ[7+)j7+)jOOQ[7+)p7+)pOOQ[7+)t7+)tOOQ[7+)v7+)vO%?cQpO1G5|O%?}Q?MtO1G0zO%@XQ`O1G0zOOQO1G/s1G/sO%@dQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?P,5?POOQO-E<c-E<cOOQO,5?V,5?VOOQO-E<i-E<iO!CUQpO1G/sOOQO-E<e-E<eOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CUQpO7+&`OOQO7+%x7+%xO$AlQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@nQ!0LrO7+&XO!ByQ!0LrO7+%xO!CUQpO7+%xO%@yQ!0LrO7+&XO%AXQ!0MxO7++rO%[QlO7++rO%AiQ`O7++qO%AiQ`O7++qOOQO1G4s1G4sO9eQ`O1G4sO%AqQ`O1G4sOOQS7+%}7+%}O#(ZQ`O<<LPO4UQ!fO<<LPO%BPQ`O<<LPOOQ[<<LP<<LPO!&zQMhO<<LPO%[QlO<<LPO%BXQ`O<<LPO%BdQ!0MzO,5?aO%DoQ!0MzO,5?cO%FzQ!0MzO1G2`O%I]Q!0MzO1G2sO%KhQ!0MzO1G2uO%MsQ!fO,5?QO%[QlO,5?QOOQO-E<d-E<dO%M}Q`O1G5}OOQ!0Lf<<JU<<JUO%NVQ?MtO1G0uO&!^Q?MtO1G1PO&!eQ?MtO1G1PO&$fQ?MtO1G1PO&$mQ?MtO1G1PO&&nQ?MtO1G1PO&(oQ?MtO1G1PO&(vQ?MtO1G1PO&(}Q?MtO1G1PO&+OQ?MtO1G1PO&+VQ?MtO1G1PO&+^Q!0MxO<<JfO&-UQ?MtO1G1PO&.RQ?MvO1G1PO&/UQ?MvO'#JlO&1[Q?MtO1G1cO&1iQ?MtO1G0UO&1sQMjO,5?TOOQO-E<g-E<gO!)[QlO'#FqOOQO'#KZ'#KZOOQO1G1u1G1uO&1}Q`O1G1tO&2SQ?MtO,5?[OOOW7+'h7+'hOOOO1G/Z1G/ZO&2^Q!dO1G4xOOQ!0Lh7+(Q7+(QP!&zQMhO,5?^O!,TQMhO7+(cO&2eQ`O,5?]O9eQ`O,5?]O$+YQ`O,5?]OOQO-E<o-E<oO&2sQ`O1G6bO&2sQ`O1G6bO&2{Q`O1G6bO&3WQMjO7+'zO&3hQ!dO,5?_O&3rQ`O,5?_O!&zQMhO,5?_OOQO-E<q-E<qO&3wQ!dO1G6cO&4RQ`O1G6cO&4ZQ`O1G2kO!&zQMhO1G2kOOQ!0Lb1G2i1G2iOOQ!0Lb1G2j1G2jO%4hQpO1G2iO!CUQpO1G2iOCwQ`O1G2iOOQ!0Lb1G2q1G2qO&4`QpO1G2iO&4nQ`O1G2kO$+YQ`O1G2jOCwQ`O1G2jO$$wQlO1G2kO&4vQ`O1G2jO&5jQMjO,5?aOOQ!0Lh-E<t-E<tO&6]QMjO,5?cOOQ!0Lh-E<v-E<vO!,TQMhO7++]O&6gQMjO7++]O&6qQMjO7++]OOQ!0Lh1G/c1G/cO&7OQ`O1G/cOOQ!0Lh7+'u7+'uO&7TQMjO7+'|O&7eQ!0MxO<<KXOOQ!0Lf<<KX<<KXO&8XQ`O1G0zO!&zQMhO'#IzO&8^Q`O,5@xO&:`Q!fO<<LPO!&zQMhO1G2nO&:gQ!0LrO1G2nOOQ[<<G{<<G{O!ByQ!0LrO<<G{O&:xQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?l,5?lO&;lQ`O,5?lO&;qQ`O,5?lOOQO-E=O-E=OO&<PQ`O1G6kO&<PQ`O1G6kO9kQ`O1G6kO@zQ`O<<LlOOQ[<<Ll<<LlO&<XQ`O<<LlO9uQ!0LrO<<LlO9kQ`O<<LlOOQ[<<LX<<LXO%:yQ!0MvO<<LXOOQ[<<LY<<LYO!E^Q`O<<LYO&<^QpO'#I|O&<iQ`O,5@|O!)[QlO,5@|OOQ[1G3W1G3WOOQO'#JO'#JOO9uQ!0LrO'#JOO&<qQpO,5=uOOQ[,5=u,5=uO&<xQpO'#EgO&=PQpO'#GeO&=UQ`O7+(zO&=ZQ`O7+(zOOQ[7+(z7+(zO!&zQMhO7+(zO%[QlO7+(zO&=cQ`O7+(zOOQ[7+(|7+(|O9uQ!0LrO7+(|O$%dQ`O7+(|O9`Q`O7+(|O!CUQpO7+(|O&=nQ`O,5?kOOQO-E<}-E<}OOQO'#H^'#H^O&=yQ`O1G6iO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>RQ`O7+,WO&>WQ`O7+,XO%[QlO7+,WO%[QlO7+,XOOQ[7+)V7+)VO&>]Q`O7+)VO&>bQlO7+)VO&>iQ`O7+)VOOQ[<<Ly<<LyOOQ[<<L{<<L{OOQ[-E=Q-E=QOOQ[1G3z1G3zO&>nQ`O,5>aOOQ[,5>c,5>cO&>sQ`O1G4QO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&>xQ?MtO1G6ZO?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AlQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!ByQ!0LrO<<IdO&?SQ!0LrO<<IsO&?_Q!0MxO<= ^O&?oQ`O<= ]OOQO7+*_7+*_O9eQ`O7+*_OOQ[ANAkANAkO&?wQ!fOANAkO!&zQMhOANAkO#(ZQ`OANAkO4UQ!fOANAkO&@OQ`OANAkO%[QlOANAkO&@WQ!0MzO7+'zO&BiQ!0MzO,5?aO&DtQ!0MzO,5?cO&GPQ!0MzO7+'|O&IbQ!fO1G4lO&IlQ?MtO7+&aO&KpQ?MvO,5=XO&MwQ?MvO,5=ZO&NXQ?MvO,5=XO&NiQ?MvO,5=ZO&NyQ?MvO,59uO'#PQ?MvO,5<kO'%SQ?MvO,5<mO''hQ?MvO,5<{O')^Q?MtO7+'kO')kQ?MtO7+'mO')xQ`O,5<]OOQO7+'`7+'`OOQ!0Lh7+*d7+*dO')}QMjO<<K}OOQO1G4w1G4wO'*UQ`O1G4wO'*aQ`O1G4wO'*oQ`O7++|O'*oQ`O7++|O!&zQMhO1G4yO'*wQ!dO1G4yO'+RQ`O7++}O'+ZQ`O7+(VO'+fQ!dO7+(VOOQ!0Lb7+(T7+(TOOQ!0Lb7+(U7+(UO!CUQpO7+(TOCwQ`O7+(TO'+pQ`O7+(VO!&zQMhO7+(VO$+YQ`O7+(UO'+uQ`O7+(VOCwQ`O7+(UO'+}QMjO<<NwO!,TQMhO<<NwOOQ!0Lh7+$}7+$}O',XQ!dO,5?fOOQO-E<x-E<xO',cQ!0MvO7+(YO!&zQMhO7+(YOOQ[AN=gAN=gO9kQ`O1G5WOOQO1G5W1G5WO',sQ`O1G5WO',xQ`O7+,VO',xQ`O7+,VO9uQ!0LrOANBWO@zQ`OANBWOOQ[ANBWANBWO'-QQ`OANBWOOQ[ANAsANAsOOQ[ANAtANAtO'-VQ`O,5?hOOQO-E<z-E<zO'-bQ?MtO1G6hOOQO,5?j,5?jOOQO-E<|-E<|OOQ[1G3a1G3aO'-lQ`O,5=POOQ[<<Lf<<LfO!&zQMhO<<LfO&=UQ`O<<LfO'-qQ`O<<LfO%[QlO<<LfOOQ[<<Lh<<LhO9uQ!0LrO<<LhO$%dQ`O<<LhO9`Q`O<<LhO'-yQpO1G5VO'.UQ`O7+,TOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= r<= rOOQ[<= s<= sO'.^Q`O<= rO'.cQ`O<= sOOQ[<<Lq<<LqO'.hQ`O<<LqO'.mQlO<<LqOOQ[1G3{1G3{O?YQ`O7+)lO'.tQ`O<<JQO'/PQ?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AlQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<My<<MyOOQ[G27VG27VO!&zQMhOG27VO#(ZQ`OG27VO'/ZQ!fOG27VO4UQ!fOG27VO'/bQ`OG27VO'/jQ?MtO<<JfO'/wQ?MvO1G2`O'1mQ?MvO,5?aO'3pQ?MvO,5?cO'5sQ?MvO1G2sO'7vQ?MvO1G2uO'9yQ?MtO<<KXO':WQ?MtO<<I{OOQO1G1w1G1wO!,TQMhOANAiOOQO7+*c7+*cO':eQ`O7+*cO':pQ`O<= hO':xQ!dO7+*eOOQ!0Lb<<Kq<<KqO$+YQ`O<<KqOCwQ`O<<KqO';SQ`O<<KqO!&zQMhO<<KqOOQ!0Lb<<Ko<<KoO!CUQpO<<KoO';_Q!dO<<KqOOQ!0Lb<<Kp<<KpO';iQ`O<<KqO!&zQMhO<<KqO$+YQ`O<<KpO';nQMjOANDcO';xQ!0MvO<<KtOOQO7+*r7+*rO9kQ`O7+*rO'<YQ`O<= qOOQ[G27rG27rO9uQ!0LrOG27rO@zQ`OG27rO!)[QlO1G5SO'<bQ`O7+,SO'<jQ`O1G2kO&=UQ`OANBQOOQ[ANBQANBQO!&zQMhOANBQO'<oQ`OANBQOOQ[ANBSANBSO9uQ!0LrOANBSO$%dQ`OANBSOOQO'#H_'#H_OOQO7+*q7+*qOOQ[G22wG22wOOQ[ANE^ANE^OOQ[ANE_ANE_OOQ[ANB]ANB]O'<wQ`OANB]OOQ[<<MW<<MWO!)[QlOAN?lOOQOG24yG24yO$AlQ!0MxOG24yO#(ZQ`OLD,qOOQ[LD,qLD,qO!&zQMhOLD,qO'<|Q!fOLD,qO'=TQ?MvO7+'zO'>yQ?MvO,5?aO'@|Q?MvO,5?cO'CPQ?MvO7+'|O'DuQMjOG27TOOQO<<M}<<M}OOQ!0LbANA]ANA]O$+YQ`OANA]OCwQ`OANA]O'EVQ!dOANA]OOQ!0LbANAZANAZO'E^Q`OANA]O!&zQMhOANA]O'EiQ!dOANA]OOQ!0LbANA[ANA[OOQO<<N^<<N^OOQ[LD-^LD-^O9uQ!0LrOLD-^O'EsQ?MtO7+*nOOQO'#Gf'#GfOOQ[G27lG27lO&=UQ`OG27lO!&zQMhOG27lOOQ[G27nG27nO9uQ!0LrOG27nOOQ[G27wG27wO'E}Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!]!$(!]O#(ZQ`O!$(!]O!&zQMhO!$(!]O'FXQ!0MzOG27TOOQ!0LbG26wG26wO$+YQ`OG26wO'HjQ`OG26wOCwQ`OG26wO'HuQ!dOG26wO!&zQMhOG26wOOQ[!$(!x!$(!xOOQ[LD-WLD-WO&=UQ`OLD-WOOQ[LD-YLD-YOOQ[!)9Ew!)9EwO#(ZQ`O!)9EwOOQ!0LbLD,cLD,cO$+YQ`OLD,cOCwQ`OLD,cO'H|Q`OLD,cO'IXQ!dOLD,cOOQ[!$(!r!$(!rOOQ[!.K;c!.K;cO'I`Q?MvOG27TOOQ!0Lb!$( }!$( }O$+YQ`O!$( }OCwQ`O!$( }O'KUQ`O!$( }OOQ!0Lb!)9Ei!)9EiO$+YQ`O!)9EiOCwQ`O!)9EiOOQ!0Lb!.K;T!.K;TO$+YQ`O!.K;TOOQ!0Lb!4/0o!4/0oO!)[QlO'#DzO1PQ`O'#EXO'KaQ!fO'#JrO'KhQ!L^O'#DvO'KoQlO'#EOO'KvQ!fO'#CiO'N^Q!fO'#CiO!)[QlO'#EQO'NnQlO,5;ZO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO,5;eO!)[QlO'#IpO(!qQ`O,5<iO!)[QlO,5;eO(!yQMhO,5;eO($dQMhO,5;eO!)[QlO,5;wO!&zQMhO'#GmO(!yQMhO'#GmO!&zQMhO'#GoO(!yQMhO'#GoO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GPO(!yQMhO'#GPO!&zQMhO'#GRO(!yQMhO'#GRO!&zQMhO'#GaO(!yQMhO'#GaO!)[QlO,5:jO($kQpO'#D_O($uQpO'#JvO!)[QlO,5@oO'NnQlO1G0uO(%PQ?MtO'#CiO!)[QlO1G2PO!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO(%ZQ!dO'#CrO!&zQMhO,5<tO(!yQMhO,5<tO'NnQlO1G2RO!)[QlO7+&zO!&zQMhO1G2`O(!yQMhO1G2`O!&zQMhO'#IuO(!yQMhO'#IuO!&zQMhO'#IwO(!yQMhO'#IwO!&zQMhO1G2bO(!yQMhO1G2bO'NnQlO7+'mO'NnQlO7+&aO!&zQMhOANAiO(!yQMhOANAiO(%nQ`O'#EoO(%sQ`O'#EoO(%{Q`O'#F]O(&QQ`O'#EyO(&VQ`O'#KTO(&bQ`O'#KRO(&mQ`O,5;ZO(&rQMjO,5<eO(&yQ`O'#GYO('OQ`O'#GYO('TQ`O,5<eO(']Q`O,5<gO('eQ`O,5;ZO('mQ?MtO1G1`O('tQ`O,5<tO('yQ`O,5<tO((OQ`O,5<vO((TQ`O,5<vO((YQ`O1G2RO((_Q`O1G0uO((dQMjO<<K}O((kQMjO<<K}O((rQMhO'#F|O9`Q`O'#F{OAuQ`O'#EnO!)[QlO,5;tO!3oQ`O'#GYO!3oQ`O'#GYO!3oQ`O'#G[O!3oQ`O'#G[O!,TQMhO7+(cO!,TQMhO7+(cO%.zQ!dO1G2wO%.zQ!dO1G2wO!&zQMhO,5=]O!&zQMhO,5=]",
  stateData: "()x~O'|OS'}OSTOS(ORQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$W|O$niO%h}O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO&W!WO&^!XO&`!YO&b!ZO&d![O&g!]O&m!^O&s!_O&u!`O&w!aO&y!bO&{!cO(TSO(VTO(YUO(aVO(o[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O(O!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X'z]X(a]X(r]X(y]X(z]X~O!g%RX~P(qO_!}O(V#PO(W!}O(X#PO~O_#QO(X#PO(Y#PO(Z#QO~Ox#SO!U#TO(b#TO(c#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T<ZO(VTO(YUO(aVO(o[O~O![#ZO!]#WO!Y(hP!Y(vP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(VTO(YUO(aVO(o[O~Op#mO![#iO!|]O#i#lO#j#iO(T<[O!k(sP~P.iO!l#oO(T#nO~O!x#sO!|]O%h#tO~O#k#uO~O!g#vO#k#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa(fX'z(fX'w(fX!k(fX!Y(fX!_(fX%i(fX!g(fX~P1qO#S$dO#`$eO$Q$eOP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX!_(gX%i(gX~Oa(gX'z(gX'w(gX!Y(gX!k(gXv(gX!g(gX~P4UO#`$eO~O$]$hO$_$gO$f$mO~OSfO!_$nO$i$oO$k$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T$sO(VTO(YUO(a$uO(y$}O(z%POg(^P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(T%gO~O!g%mO~Oa%nO'z%nO~O!Q%rO~P%[O(U!lO~P%[O%n%vO~P%[Oh%VO!l%eO(T%gO(U!lO~Oe%}O!l%eO(T%gO~Oj$RO~O!_&PO(T%gO(U!lO(VTO(YUO`)WP~O!Q&SO!l&RO%j&VO&T&WO~P;SO!x#sO~O%s&YO!S)SX!_)SX(T)SX~O(T&ZO~Ol!PO!u&`O%j!QO%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO~Od&eOe&dO!x&bO%h&cO%{&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%h}O%l!OO%m!OO%n!OO%q!RO%s!SO%v!TO%w!TO%y!UO~Ob&kO#`&nO%j&iO(U!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'x&{O'z%nO~Oa%nO'x'OO'z%nO~Oa%nO'x'QO'z%nO~O'w]X!Y]Xv]X!k]X&[]X!_]X%i]X!g]X~P(qO!b'_O!c'WO!d'WO(U!lO(VTO(YUO~Os'UO!S'TO!['XO(e'SO!^(iP!^(xP~P@nOn'bO!_'`O(T%gO~Oe'gO!l%eO(T%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<VO#T!pO#U!pO#W!pO#X!pO(U!lO(VTO(YUO(e!mO(o!sO~O!b'mO!c'lO!d'lO#V!pO#['nO#]'nO~PBYOa%nOh%VO!g#vO!l%eO'z%nO(r'pO~O!p'tO#`'rO~PChOs!nO!S!oO(VTO(YUO(e!mO(o!sO~O!_XOs(mX!S(mX!b(mX!c(mX!d(mX!|(mX#T(mX#U(mX#V(mX#W(mX#X(mX#[(mX#](mX(U(mX(V(mX(Y(mX(e(mX(o(mX~O!c'lO!d'lO(U!lO~PDWO(P'xO(Q'xO(R'zO~O_!}O(V'|O(W!}O(X'|O~O_#QO(X'|O(Y'|O(Z#QO~Ov(OO~P%[Ox#SO!U#TO(b#TO(c(RO~O![(TO!Y'WX!Y'^X!]'WX!]'^X~P+}O!](VO!Y(hX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](VO!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~O!Y(hX~PHRO!Y([O~O!Y(uX!](uX!g(uX!k(uX(r(uX~O#`(uX#k#dX!^(uX~PJUO#`(]O!Y(wX!](wX~O!](^O!Y(vX~O!Y(aO~O#`$eO~PJUO!^(bO~P`OR#zO!Q#yO!S#{O!l#xO(aVOP!na[!naj!nar!na!]!na!p!na#R!na#n!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#x!na#z!na#{!na(r!na(y!na(z!na~Oa!na'z!na'w!na!Y!na!k!nav!na!_!na%i!na!g!na~PKlO!k(cO~O!g#vO#`(dO(r'pO!](tXa(tX'z(tX~O!k(tX~PNXO!S%hO!_%iO!|]O#i(iO#j(hO(T%gO~O!](jO!k(sX~O!k(lO~O!S%hO!_%iO#j(hO(T%gO~OP(gXR(gX[(gXj(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~O!g#vO!k(gX~P! uOR(nO!Q(mO!l#xO#S$dO!|!{a!S!{a~O!x!{a%h!{a!_!{a#i!{a#j!{a(T!{a~P!#vO!x(rO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~O#k(xO~O![(zO!k(kP~P%[O(e(|O(o[O~O!S)OO!l#xO(e(|O(o[O~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]$_Oa$qa'z$qa'w$qa!k$qa!Y$qa!_$qa%i$qa!g$qa~Ol)dO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#j%cO$W%`O$t%^O$v%_O$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Og(pP~P!,TO!Q)iO!g)hO!_$^X$Z$^X$]$^X$_$^X$f$^X~O!g)hO!_({X$Z({X$]({X$_({X$f({X~O!Q)iO~P!.^O!Q)iO!_({X$Z({X$]({X$_({X$f({X~O!_)kO$Z)oO$])jO$_)jO$f)pO~O![)sO~P!)[O$]$hO$_$gO$f)wO~On$zX!Q$zX#S$zX'y$zX(y$zX(z$zX~OgmXg$zXnmX!]mX#`mX~P!0SOx)yO(b)zO(c)|O~On*VO!Q*OO'y*PO(y$}O(z%PO~Og)}O~P!1WOg*WO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S*YO!_*ZO!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op*`O![*^O(T*XO!k)OP~P!1uO#k*aO~O!l*bO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(T*dO(VTO(YUO(a$uO(y$}O(z%PO~O![*gO!Y)PP~P!3tOr*sOs!nO!S*iO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO(e!mO~O!^*pO~P!5iO#S$dOn(`X!Q(`X'y(`X(y(`X(z(`X!](`X#`(`X~Og(`X$O(`X~P!6kOn*xO#`*wOg(_X!](_X~O!]*yOg(^X~Oj%dOk%dOl%dO(T&ZOg(^P~Os*|O~Og)}O(T&ZO~O!l+SO~O(T(vO~Op+WO!S%hO![#iO!_%iO!|]O#i#lO#j#iO(T%gO!k(sP~O!g#vO#k+XO~O!S%hO![+ZO!](^O!_%iO(T%gO!Y(vP~Os'[O!S+]O![+[O(VTO(YUO(e(|O~O!^(xP~P!9|O!]+^Oa)TX'z)TX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO#z$WO#{$XO(aVO(r$YO(y#|O(z#}O~Oa!ja!]!ja'z!ja'w!ja!Y!ja!k!jav!ja!_!ja%i!ja!g!ja~P!:tOR#zO!Q#yO!S#{O!l#xO(aVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#n!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#x!ra#z!ra#{!ra(r!ra(y!ra(z!ra~Oa!ra'z!ra'w!ra!Y!ra!k!rav!ra!_!ra%i!ra!g!ra~P!=[OR#zO!Q#yO!S#{O!l#xO(aVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#n!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#x!ta#z!ta#{!ta(r!ta(y!ta(z!ta~Oa!ta'z!ta'w!ta!Y!ta!k!tav!ta!_!ta%i!ta!g!ta~P!?rOh%VOn+gO!_'`O%i+fO~O!g+iOa(]X!_(]X'z(]X!](]X~Oa%nO!_XO'z%nO~Oh%VO!l%eO~Oh%VO!l%eO(T%gO~O!g#vO#k(xO~Ob+tO%j+uO(T+qO(VTO(YUO!^)XP~O!]+vO`)WX~O[+zO~O`+{O~O!_&PO(T%gO(U!lO`)WP~O%j,OO~P;SOh%VO#`,SO~Oh%VOn,VO!_$|O~O!_,XO~O!Q,ZO!_XO~O%n%vO~O!x,`O~Oe,eO~Ob,fO(T#nO(VTO(YUO!^)VP~Oe%}O~O%j!QO(T&ZO~P=gO[,kO`,jO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$niO%h}O(VTO(YUO(aVO(o[O~O!_!eO!u!gO$W!kO(T!dO~P!FyO`,jOa%nO'z%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$W!kO$niO(T!dO(VTO(YUO(aVO(o[O~Oa,pOl!OO!uwO%l!OO%m!OO%n!OO~P!IcO!l&oO~O&^,vO~O!_,xO~O&o,zO&q,{OP&laQ&laS&laY&laa&lad&lae&lal&lap&lar&las&lat&laz&la|&la!O&la!S&la!W&la!X&la!_&la!i&la!l&la!o&la!p&la!q&la!s&la!u&la!x&la!|&la$W&la$n&la%h&la%j&la%l&la%m&la%n&la%q&la%s&la%v&la%w&la%y&la&W&la&^&la&`&la&b&la&d&la&g&la&m&la&s&la&u&la&w&la&y&la&{&la'w&la(T&la(V&la(Y&la(a&la(o&la!^&la&e&lab&la&j&la~O(T-QO~Oh!eX!]!RX!^!RX!g!RX!g!eX!l!eX#`!RX~O!]!eX!^!eX~P#!iO!g-VO#`-UOh(jX!]#hX!^#hX!g(jX!l(jX~O!](jX!^(jX~P##[Oh%VO!g-XO!l%eO!]!aX!^!aX~Os!nO!S!oO(VTO(YUO(e!mO~OP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_!eO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(VTO(YUO(aVO(o[O~O(T=QO~P#$qO!]-]O!^(iX~O!^-_O~O!g-VO#`-UO!]#hX!^#hX~O!]-`O!^(xX~O!^-bO~O!c-cO!d-cO(U!lO~P#$`O!^-fO~P'_On-iO!_'`O~O!Y-nO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(U!{a(V!{a(Y!{a(e!{a(o!{a~P!#vO!p-sO#`-qO~PChO!c-uO!d-uO(U!lO~PDWOa%nO#`-qO'z%nO~Oa%nO!g#vO#`-qO'z%nO~Oa%nO!g#vO!p-sO#`-qO'z%nO(r'pO~O(P'xO(Q'xO(R-zO~Ov-{O~O!Y'Wa!]'Wa~P!:tO![.PO!Y'WX!]'WX~P%[O!](VO!Y(ha~O!Y(ha~PHRO!](^O!Y(va~O!S%hO![.TO!_%iO(T%gO!Y'^X!]'^X~O#`.VO!](ta!k(taa(ta'z(ta~O!g#vO~P#,wO!](jO!k(sa~O!S%hO!_%iO#j.ZO(T%gO~Op.`O!S%hO![.]O!_%iO!|]O#i._O#j.]O(T%gO!]'aX!k'aX~OR.dO!l#xO~Oh%VOn.gO!_'`O%i.fO~Oa#ci!]#ci'z#ci'w#ci!Y#ci!k#civ#ci!_#ci%i#ci!g#ci~P!:tOn>]O!Q*OO'y*PO(y$}O(z%PO~O#k#_aa#_a#`#_a'z#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#k(`XP(`XR(`X[(`Xa(`Xj(`Xr(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X'z(`X(a(`X(r(`X!k(`X!Y(`X'w(`Xv(`X!_(`X%i(`X!g(`X~P!6kO!].tO!k(kX~P!:tO!k.wO~O!Y.yO~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mia#mij#mir#mi!]#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#n#mi~P#3cO#n$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO[#mia#mij#mi!]#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#r#mi~P#6QO#r$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO(aVOa#mi!]#mi#x#mi#z#mi#{#mi'z#mi(r#mi(y#mi(z#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#v#mi~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO(aVO(z#}Oa#mi!]#mi#z#mi#{#mi'z#mi(r#mi(y#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#x$UO~P#;VO#x#mi~P#;VO#v$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#n$OO#o$PO#p$PO#q$PO#r$QO#s$RO#t$RO#u$bO#v$SO#x$UO(aVO(y#|O(z#}Oa#mi!]#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~O#z#mi~P#={O#z$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X!]]X!^]X~O$O]X~P#@jOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO#z<gO#{<hO(aVO(r$YO(y#|O(z#}O~O$O.{O~P#BwO#S$dO#`<nO$Q<nO$O(gX!^(gX~P! uOa'da!]'da'z'da'w'da!k'da!Y'dav'da!_'da%i'da!g'da~P!:tO[#mia#mij#mir#mi!]#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi'z#mi(r#mi'w#mi!Y#mi!k#miv#mi!_#mi%i#mi!g#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n$OO#o$PO#p$PO#q$PO(aVO(y#mi(z#mi~P#EyOn>]O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P#EyO!]/POg(pX~P!1WOg/RO~Oa$Pi!]$Pi'z$Pi'w$Pi!Y$Pi!k$Piv$Pi!_$Pi%i$Pi!g$Pi~P!:tO$]/SO$_/SO~O$]/TO$_/TO~O!g)hO#`/UO!_$cX$Z$cX$]$cX$_$cX$f$cX~O![/VO~O!_)kO$Z/XO$])jO$_)jO$f/YO~O!]<iO!^(fX~P#BwO!^/ZO~O!g)hO$f({X~O$f/]O~Ov/^O~P!&zOx)yO(b)zO(c/aO~O!S/dO~O(y$}On%aa!Q%aa'y%aa(z%aa!]%aa#`%aa~Og%aa$O%aa~P#L{O(z%POn%ca!Q%ca'y%ca(y%ca!]%ca#`%ca~Og%ca$O%ca~P#MnO!]fX!gfX!kfX!k$zX(rfX~P!0SOp%WO![/mO!](^O(T/lO!Y(vP!Y)PP~P!1uOr*sO!b*qO!c*kO!d*kO!l*bO#[*rO%`*mO(U!lO(VTO(YUO~Os<}O!S/nO![+[O!^*pO(e<|O!^(xP~P$ [O!k/oO~P#/sO!]/pO!g#vO(r'pO!k)OX~O!k/uO~OnoX!QoX'yoX(yoX(zoX~O!g#vO!koX~P$#OOp/wO!S%hO![*^O!_%iO(T%gO!k)OP~O#k/xO~O!Y$zX!]$zX!g%RX~P!0SO!]/yO!Y)PX~P#/sO!g/{O~O!Y/}O~OpkO(T0OO~P.iOh%VOr0TO!g#vO!l%eO(r'pO~O!g+iO~Oa%nO!]0XO'z%nO~O!^0ZO~P!5iO!c0[O!d0[O(U!lO~P#$`Os!nO!S0]O(VTO(YUO(e!mO~O#[0_O~Og%aa!]%aa#`%aa$O%aa~P!1WOg%ca!]%ca#`%ca$O%ca~P!1WOj%dOk%dOl%dO(T&ZOg'mX!]'mX~O!]*yOg(^a~Og0hO~On0jO#`0iOg(_a!](_a~OR0kO!Q0kO!S0lO#S$dOn}a'y}a(y}a(z}a!]}a#`}a~Og}a$O}a~P$(cO!Q*OO'y*POn$sa(y$sa(z$sa!]$sa#`$sa~Og$sa$O$sa~P$)_O!Q*OO'y*POn$ua(y$ua(z$ua!]$ua#`$ua~Og$ua$O$ua~P$*QO#k0oO~Og%Ta!]%Ta#`%Ta$O%Ta~P!1WO!g#vO~O#k0rO~O!]+^Oa)Ta'z)Ta~OR#zO!Q#yO!S#{O!l#xO(aVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#n!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#x!ri#z!ri#{!ri(r!ri(y!ri(z!ri~Oa!ri'z!ri'w!ri!Y!ri!k!riv!ri!_!ri%i!ri!g!ri~P$+oOh%VOr%XOs$tOt$tOz%YO|%ZO!O<sO!S${O!_$|O!i>VO!l$xO#j<yO$W%`O$t<uO$v<wO$y%aO(VTO(YUO(a$uO(y$}O(z%PO~Op0{O%]0|O(T0zO~P$.VO!g+iOa(]a!_(]a'z(]a!](]a~O#k1SO~O[]X!]fX!^fX~O!]1TO!^)XX~O!^1VO~O[1WO~Ob1YO(T+qO(VTO(YUO~O!_&PO(T%gO`'uX!]'uX~O!]+vO`)Wa~O!k1]O~P!:tO[1`O~O`1aO~O#`1fO~On1iO!_$|O~O(e(|O!^)UP~Oh%VOn1rO!_1oO%i1qO~O[1|O!]1zO!^)VX~O!^1}O~O`2POa%nO'z%nO~O(T#nO(VTO(YUO~O#S$dO#`$eO$Q$eOP(gXR(gX[(gXr(gX!Q(gX!S(gX!](gX!l(gX!p(gX#R(gX#n(gX#o(gX#p(gX#q(gX#r(gX#s(gX#t(gX#u(gX#v(gX#x(gX#z(gX#{(gX(a(gX(r(gX(y(gX(z(gX~Oj2SO&[2TOa(gX~P$3pOj2SO#`$eO&[2TO~Oa2VO~P%[Oa2XO~O&e2[OP&ciQ&ciS&ciY&cia&cid&cie&cil&cip&cir&cis&cit&ciz&ci|&ci!O&ci!S&ci!W&ci!X&ci!_&ci!i&ci!l&ci!o&ci!p&ci!q&ci!s&ci!u&ci!x&ci!|&ci$W&ci$n&ci%h&ci%j&ci%l&ci%m&ci%n&ci%q&ci%s&ci%v&ci%w&ci%y&ci&W&ci&^&ci&`&ci&b&ci&d&ci&g&ci&m&ci&s&ci&u&ci&w&ci&y&ci&{&ci'w&ci(T&ci(V&ci(Y&ci(a&ci(o&ci!^&cib&ci&j&ci~Ob2bO!^2`O&j2aO~P`O!_XO!l2dO~O&q,{OP&liQ&liS&liY&lia&lid&lie&lil&lip&lir&lis&lit&liz&li|&li!O&li!S&li!W&li!X&li!_&li!i&li!l&li!o&li!p&li!q&li!s&li!u&li!x&li!|&li$W&li$n&li%h&li%j&li%l&li%m&li%n&li%q&li%s&li%v&li%w&li%y&li&W&li&^&li&`&li&b&li&d&li&g&li&m&li&s&li&u&li&w&li&y&li&{&li'w&li(T&li(V&li(Y&li(a&li(o&li!^&li&e&lib&li&j&li~O!Y2jO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2pO(e!mO!]'XX!^'XX~P@nO!]-]O!^(ia~O!]'_X!^'_X~P!9|O!]-`O!^(xa~O!^2wO~P'_Oa%nO#`3QO'z%nO~Oa%nO!g#vO#`3QO'z%nO~Oa%nO!g#vO!p3UO#`3QO'z%nO(r'pO~Oa%nO'z%nO~P!:tO!]$_Ov$qa~O!Y'Wi!]'Wi~P!:tO!](VO!Y(hi~O!](^O!Y(vi~O!Y(wi!](wi~P!:tO!](ti!k(tia(ti'z(ti~P!:tO#`3WO!](ti!k(tia(ti'z(ti~O!](jO!k(si~O!S%hO!_%iO!|]O#i3]O#j3[O(T%gO~O!S%hO!_%iO#j3[O(T%gO~On3dO!_'`O%i3cO~Oh%VOn3dO!_'`O%i3cO~O#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aav%aa!_%aa%i%aa!g%aa~P#L{O#k%caP%caR%ca[%caa%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%cav%ca!_%ca%i%ca!g%ca~P#MnO#k%aaP%aaR%aa[%aaa%aaj%aar%aa!S%aa!]%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa'z%aa(a%aa(r%aa!k%aa!Y%aa'w%aa#`%aav%aa!_%aa%i%aa!g%aa~P#/sO#k%caP%caR%ca[%caa%caj%car%ca!S%ca!]%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca'z%ca(a%ca(r%ca!k%ca!Y%ca'w%ca#`%cav%ca!_%ca%i%ca!g%ca~P#/sO#k}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a'z}a(a}a(r}a!k}a!Y}a'w}av}a!_}a%i}a!g}a~P$(cO#k$saP$saR$sa[$saa$saj$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa'z$sa(a$sa(r$sa!k$sa!Y$sa'w$sav$sa!_$sa%i$sa!g$sa~P$)_O#k$uaP$uaR$ua[$uaa$uaj$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua'z$ua(a$ua(r$ua!k$ua!Y$ua'w$uav$ua!_$ua%i$ua!g$ua~P$*QO#k%TaP%TaR%Ta[%Taa%Taj%Tar%Ta!S%Ta!]%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta'z%Ta(a%Ta(r%Ta!k%Ta!Y%Ta'w%Ta#`%Tav%Ta!_%Ta%i%Ta!g%Ta~P#/sOa#cq!]#cq'z#cq'w#cq!Y#cq!k#cqv#cq!_#cq%i#cq!g#cq~P!:tO![3lO!]'YX!k'YX~P%[O!].tO!k(ka~O!].tO!k(ka~P!:tO!Y3oO~O$O!na!^!na~PKlO$O!ja!]!ja!^!ja~P#BwO$O!ra!^!ra~P!=[O$O!ta!^!ta~P!?rOg']X!]']X~P!,TO!]/POg(pa~OSfO!_4TO$d4UO~O!^4YO~Ov4ZO~P#/sOa$mq!]$mq'z$mq'w$mq!Y$mq!k$mqv$mq!_$mq%i$mq!g$mq~P!:tO!Y4]O~P!&zO!S4^O~O!Q*OO'y*PO(z%POn'ia(y'ia!]'ia#`'ia~Og'ia$O'ia~P%-fO!Q*OO'y*POn'ka(y'ka(z'ka!]'ka#`'ka~Og'ka$O'ka~P%.XO(r$YO~P#/sO!YfX!Y$zX!]fX!]$zX!g%RX#`fX~P!0SOp%WO(T=WO~P!1uOp4bO!S%hO![4aO!_%iO(T%gO!]'eX!k'eX~O!]/pO!k)Oa~O!]/pO!g#vO!k)Oa~O!]/pO!g#vO(r'pO!k)Oa~Og$|i!]$|i#`$|i$O$|i~P!1WO![4jO!Y'gX!]'gX~P!3tO!]/yO!Y)Pa~O!]/yO!Y)Pa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~Oj%YX!g%YX~P%2OOj4oO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4tO!l%eO(r'pO~Or4yO!g#vO(r'pO~Os!nO!S4zO(VTO(YUO(e!mO~O(y$}On%ai!Q%ai'y%ai(z%ai!]%ai#`%ai~Og%ai$O%ai~P%5oO(z%POn%ci!Q%ci'y%ci(y%ci!]%ci#`%ci~Og%ci$O%ci~P%6bOg(_i!](_i~P!1WO#`5QOg(_i!](_i~P!1WO!k5VO~Oa$oq!]$oq'z$oq'w$oq!Y$oq!k$oqv$oq!_$oq%i$oq!g$oq~P!:tO!Y5ZO~O!]5[O!_)QX~P#/sOa$zX!_$zX%^]X'z$zX!]$zX~P!0SO%^5_OaoX!_oX'zoX!]oX~P$#OOp5`O(T#nO~O%^5_O~Ob5fO%j5gO(T+qO(VTO(YUO!]'tX!^'tX~O!]1TO!^)Xa~O[5kO~O`5lO~O[5pO~Oa%nO'z%nO~P#/sO!]5uO#`5wO!^)UX~O!^5xO~Or6OOs!nO!S*iO!b!yO!c!vO!d!vO!|<VO#T!pO#U!pO#V!pO#W!pO#X!pO#[5}O#]!zO(U!lO(VTO(YUO(e!mO(o!sO~O!^5|O~P%;eOn6TO!_1oO%i6SO~Oh%VOn6TO!_1oO%i6SO~Ob6[O(T#nO(VTO(YUO!]'sX!^'sX~O!]1zO!^)Va~O(VTO(YUO(e6^O~O`6bO~Oj6eO&[6fO~PNXO!k6gO~P%[Oa6iO~Oa6iO~P%[Ob2bO!^6nO&j2aO~P`O!g6pO~O!g6rOh(ji!](ji!^(ji!g(ji!l(jir(ji(r(ji~O!]#hi!^#hi~P#BwO#`6sO!]#hi!^#hi~O!]!ai!^!ai~P#BwOa%nO#`6|O'z%nO~Oa%nO!g#vO#`6|O'z%nO~O!](tq!k(tqa(tq'z(tq~P!:tO!](jO!k(sq~O!S%hO!_%iO#j7TO(T%gO~O!_'`O%i7WO~On7[O!_'`O%i7WO~O#k'iaP'iaR'ia['iaa'iaj'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia'z'ia(a'ia(r'ia!k'ia!Y'ia'w'iav'ia!_'ia%i'ia!g'ia~P%-fO#k'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka'z'ka(a'ka(r'ka!k'ka!Y'ka'w'kav'ka!_'ka%i'ka!g'ka~P%.XO#k$|iP$|iR$|i[$|ia$|ij$|ir$|i!S$|i!]$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i'z$|i(a$|i(r$|i!k$|i!Y$|i'w$|i#`$|iv$|i!_$|i%i$|i!g$|i~P#/sO#k%aiP%aiR%ai[%aia%aij%air%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai'z%ai(a%ai(r%ai!k%ai!Y%ai'w%aiv%ai!_%ai%i%ai!g%ai~P%5oO#k%ciP%ciR%ci[%cia%cij%cir%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci'z%ci(a%ci(r%ci!k%ci!Y%ci'w%civ%ci!_%ci%i%ci!g%ci~P%6bO!]'Ya!k'Ya~P!:tO!].tO!k(ki~O$O#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(aVO[#mij#mir#mi#R#mi#o#mi#p#mi#q#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#n#mi~P%NdO#n<_O~P%NdOP$[OR#zOr<kO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO[#mij#mi#R#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#r#mi~P&!lO#r<aO~P&!lOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO(aVO#x#mi#z#mi#{#mi$O#mi(r#mi(y#mi(z#mi!]#mi!^#mi~O#v#mi~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO(aVO(z#}O#z#mi#{#mi$O#mi(r#mi(y#mi!]#mi!^#mi~O#x<eO~P&&uO#x#mi~P&&uO#v<cO~P&$tOP$[OR#zO[<mOj<bOr<kO!Q#yO!S#{O!l#xO!p$[O#R<bO#n<_O#o<`O#p<`O#q<`O#r<aO#s<bO#t<bO#u<lO#v<cO#x<eO(aVO(y#|O(z#}O#{#mi$O#mi(r#mi!]#mi!^#mi~O#z#mi~P&)UO#z<gO~P&)UOa#|y!]#|y'z#|y'w#|y!Y#|y!k#|yv#|y!_#|y%i#|y!g#|y~P!:tO[#mij#mir#mi#R#mi#r#mi#s#mi#t#mi#u#mi#v#mi#x#mi#z#mi#{#mi$O#mi(r#mi!]#mi!^#mi~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#n<_O#o<`O#p<`O#q<`O(aVO(y#mi(z#mi~P&,QOn>^O!Q*OO'y*PO(y$}O(z%POP#miR#mi!S#mi!l#mi!p#mi#n#mi#o#mi#p#mi#q#mi(a#mi~P&,QO#S$dOP(`XR(`X[(`Xj(`Xn(`Xr(`X!Q(`X!S(`X!l(`X!p(`X#R(`X#n(`X#o(`X#p(`X#q(`X#r(`X#s(`X#t(`X#u(`X#v(`X#x(`X#z(`X#{(`X$O(`X'y(`X(a(`X(r(`X(y(`X(z(`X!](`X!^(`X~O$O$Pi!]$Pi!^$Pi~P#BwO$O!ri!^!ri~P$+oOg']a!]']a~P!1WO!^7nO~O!]'da!^'da~P#BwO!Y7oO~P#/sO!g#vO(r'pO!]'ea!k'ea~O!]/pO!k)Oi~O!]/pO!g#vO!k)Oi~Og$|q!]$|q#`$|q$O$|q~P!1WO!Y'ga!]'ga~P#/sO!g7vO~O!]/yO!Y)Pi~P#/sO!]/yO!Y)Pi~O!Y7yO~Oh%VOr8OO!l%eO(r'pO~Oj8QO!g#vO~Or8TO!g#vO(r'pO~O!Q*OO'y*PO(z%POn'ja(y'ja!]'ja#`'ja~Og'ja$O'ja~P&5RO!Q*OO'y*POn'la(y'la(z'la!]'la#`'la~Og'la$O'la~P&5tOg(_q!](_q~P!1WO#`8VOg(_q!](_q~P!1WO!Y8WO~Og%Oq!]%Oq#`%Oq$O%Oq~P!1WOa$oy!]$oy'z$oy'w$oy!Y$oy!k$oyv$oy!_$oy%i$oy!g$oy~P!:tO!g6rO~O!]5[O!_)Qa~O!_'`OP$TaR$Ta[$Taj$Tar$Ta!Q$Ta!S$Ta!]$Ta!l$Ta!p$Ta#R$Ta#n$Ta#o$Ta#p$Ta#q$Ta#r$Ta#s$Ta#t$Ta#u$Ta#v$Ta#x$Ta#z$Ta#{$Ta(a$Ta(r$Ta(y$Ta(z$Ta~O%i7WO~P&8fO%^8[Oa%[i!_%[i'z%[i!]%[i~Oa#cy!]#cy'z#cy'w#cy!Y#cy!k#cyv#cy!_#cy%i#cy!g#cy~P!:tO[8^O~Ob8`O(T+qO(VTO(YUO~O!]1TO!^)Xi~O`8dO~O(e(|O!]'pX!^'pX~O!]5uO!^)Ua~O!^8nO~P%;eO(o!sO~P$&YO#[8oO~O!_1oO~O!_1oO%i8qO~On8tO!_1oO%i8qO~O[8yO!]'sa!^'sa~O!]1zO!^)Vi~O!k8}O~O!k9OO~O!k9RO~O!k9RO~P%[Oa9TO~O!g9UO~O!k9VO~O!](wi!^(wi~P#BwOa%nO#`9_O'z%nO~O!](ty!k(tya(ty'z(ty~P!:tO!](jO!k(sy~O%i9bO~P&8fO!_'`O%i9bO~O#k$|qP$|qR$|q[$|qa$|qj$|qr$|q!S$|q!]$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q'z$|q(a$|q(r$|q!k$|q!Y$|q'w$|q#`$|qv$|q!_$|q%i$|q!g$|q~P#/sO#k'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja'z'ja(a'ja(r'ja!k'ja!Y'ja'w'jav'ja!_'ja%i'ja!g'ja~P&5RO#k'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la'z'la(a'la(r'la!k'la!Y'la'w'lav'la!_'la%i'la!g'la~P&5tO#k%OqP%OqR%Oq[%Oqa%Oqj%Oqr%Oq!S%Oq!]%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq'z%Oq(a%Oq(r%Oq!k%Oq!Y%Oq'w%Oq#`%Oqv%Oq!_%Oq%i%Oq!g%Oq~P#/sO!]'Yi!k'Yi~P!:tO$O#cq!]#cq!^#cq~P#BwO(y$}OP%aaR%aa[%aaj%aar%aa!S%aa!l%aa!p%aa#R%aa#n%aa#o%aa#p%aa#q%aa#r%aa#s%aa#t%aa#u%aa#v%aa#x%aa#z%aa#{%aa$O%aa(a%aa(r%aa!]%aa!^%aa~On%aa!Q%aa'y%aa(z%aa~P&IyO(z%POP%caR%ca[%caj%car%ca!S%ca!l%ca!p%ca#R%ca#n%ca#o%ca#p%ca#q%ca#r%ca#s%ca#t%ca#u%ca#v%ca#x%ca#z%ca#{%ca$O%ca(a%ca(r%ca!]%ca!^%ca~On%ca!Q%ca'y%ca(y%ca~P&LQOn>^O!Q*OO'y*PO(z%PO~P&IyOn>^O!Q*OO'y*PO(y$}O~P&LQOR0kO!Q0kO!S0lO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#n}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#x}a#z}a#{}a$O}a'y}a(a}a(r}a(y}a(z}a!]}a!^}a~O!Q*OO'y*POP$saR$sa[$saj$san$sar$sa!S$sa!l$sa!p$sa#R$sa#n$sa#o$sa#p$sa#q$sa#r$sa#s$sa#t$sa#u$sa#v$sa#x$sa#z$sa#{$sa$O$sa(a$sa(r$sa(y$sa(z$sa!]$sa!^$sa~O!Q*OO'y*POP$uaR$ua[$uaj$uan$uar$ua!S$ua!l$ua!p$ua#R$ua#n$ua#o$ua#p$ua#q$ua#r$ua#s$ua#t$ua#u$ua#v$ua#x$ua#z$ua#{$ua$O$ua(a$ua(r$ua(y$ua(z$ua!]$ua!^$ua~On>^O!Q*OO'y*PO(y$}O(z%PO~OP%TaR%Ta[%Taj%Tar%Ta!S%Ta!l%Ta!p%Ta#R%Ta#n%Ta#o%Ta#p%Ta#q%Ta#r%Ta#s%Ta#t%Ta#u%Ta#v%Ta#x%Ta#z%Ta#{%Ta$O%Ta(a%Ta(r%Ta!]%Ta!^%Ta~P''VO$O$mq!]$mq!^$mq~P#BwO$O$oq!]$oq!^$oq~P#BwO!^9oO~O$O9pO~P!1WO!g#vO!]'ei!k'ei~O!g#vO(r'pO!]'ei!k'ei~O!]/pO!k)Oq~O!Y'gi!]'gi~P#/sO!]/yO!Y)Pq~Or9wO!g#vO(r'pO~O[9yO!Y9xO~P#/sO!Y9xO~Oj:PO!g#vO~Og(_y!](_y~P!1WO!]'na!_'na~P#/sOa%[q!_%[q'z%[q!]%[q~P#/sO[:UO~O!]1TO!^)Xq~O`:YO~O#`:ZO!]'pa!^'pa~O!]5uO!^)Ui~P#BwO!S:]O~O!_1oO%i:`O~O(VTO(YUO(e:eO~O!]1zO!^)Vq~O!k:hO~O!k:iO~O!k:jO~O!k:jO~P%[O#`:mO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%i:rO~P&8fO!_'`O%i:rO~O$O#|y!]#|y!^#|y~P#BwOP$|iR$|i[$|ij$|ir$|i!S$|i!l$|i!p$|i#R$|i#n$|i#o$|i#p$|i#q$|i#r$|i#s$|i#t$|i#u$|i#v$|i#x$|i#z$|i#{$|i$O$|i(a$|i(r$|i!]$|i!^$|i~P''VO!Q*OO'y*PO(z%POP'iaR'ia['iaj'ian'iar'ia!S'ia!l'ia!p'ia#R'ia#n'ia#o'ia#p'ia#q'ia#r'ia#s'ia#t'ia#u'ia#v'ia#x'ia#z'ia#{'ia$O'ia(a'ia(r'ia(y'ia!]'ia!^'ia~O!Q*OO'y*POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#n'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#x'ka#z'ka#{'ka$O'ka(a'ka(r'ka(y'ka(z'ka!]'ka!^'ka~O(y$}OP%aiR%ai[%aij%ain%air%ai!Q%ai!S%ai!l%ai!p%ai#R%ai#n%ai#o%ai#p%ai#q%ai#r%ai#s%ai#t%ai#u%ai#v%ai#x%ai#z%ai#{%ai$O%ai'y%ai(a%ai(r%ai(z%ai!]%ai!^%ai~O(z%POP%ciR%ci[%cij%cin%cir%ci!Q%ci!S%ci!l%ci!p%ci#R%ci#n%ci#o%ci#p%ci#q%ci#r%ci#s%ci#t%ci#u%ci#v%ci#x%ci#z%ci#{%ci$O%ci'y%ci(a%ci(r%ci(y%ci!]%ci!^%ci~O$O$oy!]$oy!^$oy~P#BwO$O#cy!]#cy!^#cy~P#BwO!g#vO!]'eq!k'eq~O!]/pO!k)Oy~O!Y'gq!]'gq~P#/sOr:|O!g#vO(r'pO~O[;QO!Y;PO~P#/sO!Y;PO~Og(_!R!](_!R~P!1WOa%[y!_%[y'z%[y!]%[y~P#/sO!]1TO!^)Xy~O!]5uO!^)Uq~O(T;XO~O!_1oO%i;[O~O!k;_O~O%i;dO~P&8fOP$|qR$|q[$|qj$|qr$|q!S$|q!l$|q!p$|q#R$|q#n$|q#o$|q#p$|q#q$|q#r$|q#s$|q#t$|q#u$|q#v$|q#x$|q#z$|q#{$|q$O$|q(a$|q(r$|q!]$|q!^$|q~P''VO!Q*OO'y*PO(z%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#n'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#x'ja#z'ja#{'ja$O'ja(a'ja(r'ja(y'ja!]'ja!^'ja~O!Q*OO'y*POP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#n'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#x'la#z'la#{'la$O'la(a'la(r'la(y'la(z'la!]'la!^'la~OP%OqR%Oq[%Oqj%Oqr%Oq!S%Oq!l%Oq!p%Oq#R%Oq#n%Oq#o%Oq#p%Oq#q%Oq#r%Oq#s%Oq#t%Oq#u%Oq#v%Oq#x%Oq#z%Oq#{%Oq$O%Oq(a%Oq(r%Oq!]%Oq!^%Oq~P''VOg%e!Z!]%e!Z#`%e!Z$O%e!Z~P!1WO!Y;hO~P#/sOr;iO!g#vO(r'pO~O[;kO!Y;hO~P#/sO!]'pq!^'pq~P#BwO!]#h!Z!^#h!Z~P#BwO#k%e!ZP%e!ZR%e!Z[%e!Za%e!Zj%e!Zr%e!Z!S%e!Z!]%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z'z%e!Z(a%e!Z(r%e!Z!k%e!Z!Y%e!Z'w%e!Z#`%e!Zv%e!Z!_%e!Z%i%e!Z!g%e!Z~P#/sOr;tO!g#vO(r'pO~O!Y;uO~P#/sOr;|O!g#vO(r'pO~O!Y;}O~P#/sOP%e!ZR%e!Z[%e!Zj%e!Zr%e!Z!S%e!Z!l%e!Z!p%e!Z#R%e!Z#n%e!Z#o%e!Z#p%e!Z#q%e!Z#r%e!Z#s%e!Z#t%e!Z#u%e!Z#v%e!Z#x%e!Z#z%e!Z#{%e!Z$O%e!Z(a%e!Z(r%e!Z!]%e!Z!^%e!Z~P''VOr<QO!g#vO(r'pO~Ov(fX~P1qO!Q%rO~P!)[O(U!lO~P!)[O!YfX!]fX#`fX~P%2OOP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#kfX#n]X#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#x]X#z]X#{]X$Q]X(a]X(r]X(y]X(z]X~O!gfX!k]X!kfX(rfX~P'LTOP<UOQ<UOSfOd>ROe!iOpkOr<UOskOtkOzkO|<UO!O<UO!SWO!WkO!XkO!_XO!i<XO!lZO!o<UO!p<UO!q<UO!s<YO!u<]O!x!hO$W!kO$n>PO(T)]O(VTO(YUO(aVO(o[O~O!]<iO!^$qa~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<tO!S${O!_$|O!i>WO!l$xO#j<zO$W%`O$t<vO$v<xO$y%aO(T(vO(VTO(YUO(a$uO(y$}O(z%PO~Ol)dO~P(!yOr!eX(r!eX~P#!iOr(jX(r(jX~P##[O!^]X!^fX~P'LTO!YfX!Y$zX!]fX!]$zX#`fX~P!0SO#k<^O~O!g#vO#k<^O~O#`<nO~Oj<bO~O#`=OO!](wX!^(wX~O#`<nO!](uX!^(uX~O#k=PO~Og=RO~P!1WO#k=XO~O#k=YO~Og=RO(T&ZO~O!g#vO#k=ZO~O!g#vO#k=PO~O$O=[O~P#BwO#k=]O~O#k=^O~O#k=cO~O#k=dO~O#k=eO~O#k=fO~O$O=gO~P!1WO$O=hO~P!1WOl=sO~P7eOk#S#T#U#W#X#[#i#j#u$n$t$v$y%]%^%h%i%j%q%s%v%w%y%{~(OT#o!X'|(U#ps#n#qr!Q'}$]'}(T$_(e~",
  goto: "$9Y)]PPPPPP)^PP)aP)rP+W/]PPPP6mPP7TPP=QPPP@tPA^PA^PPPA^PCfPA^PA^PA^PCjPCoPD^PIWPPPI[PPPPI[L_PPPLeMVPI[PI[PP! eI[PPPI[PI[P!#lI[P!'S!(X!(bP!)U!)Y!)U!,gPPPPPPP!-W!(XPP!-h!/YP!2iI[I[!2n!5z!:h!:h!>gPPP!>oI[PPPPPPPPP!BOP!C]PPI[!DnPI[PI[I[I[I[I[PI[!FQP!I[P!LbP!Lf!Lp!Lt!LtP!IXP!Lx!LxP#!OP#!SI[PI[#!Y#%_CjA^PA^PA^A^P#&lA^A^#)OA^#+vA^#.SA^A^#.r#1W#1W#1]#1f#1W#1qPP#1WPA^#2ZA^#6YA^A^6mPPP#:_PPP#:x#:xP#:xP#;`#:xPP#;fP#;]P#;]#;y#;]#<e#<k#<n)aP#<q)aP#<z#<z#<zP)aP)aP)aP)aPP)aP#=Q#=TP#=T)aP#=XP#=[P)aP)aP)aP)aP)aP)a)aPP#=b#=h#=s#=y#>P#>V#>]#>k#>q#>{#?R#?]#?c#?s#?y#@k#@}#AT#AZ#Ai#BO#Cs#DR#DY#Et#FS#Gt#HS#HY#H`#Hf#Hp#Hv#H|#IW#Ij#IpPPPPPPPPPPP#IvPPPPPPP#Jk#Mx$ b$ i$ qPPP$']P$'f$*_$0x$0{$1O$1}$2Q$2X$2aP$2g$2jP$3W$3[$4S$5b$5g$5}PP$6S$6Y$6^$6a$6e$6i$7e$7|$8e$8i$8l$8o$8y$8|$9Q$9UR!|RoqOXst!Z#d%m&r&t&u&w,s,x2[2_Y!vQ'`-e1o5{Q%tvQ%|yQ&T|Q&j!VS'W!e-]Q'f!iS'l!r!yU*k$|*Z*oQ+o%}S+|&V&WQ,d&dQ-c'_Q-m'gQ-u'mQ0[*qQ1b,OQ1y,eR<{<Y%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_S#q]<V!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU+P%]<s<tQ+t&PQ,f&gQ,m&oQ0x+gQ0}+iQ1Y+uQ2R,kQ3`.gQ5`0|Q5f1TQ6[1zQ7Y3dQ8`5gR9e7['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S!S!nQ!r!v!y!z$|'W'_'`'l'm'n*k*o*q*r-]-c-e-u0[0_1o5{5}%[$ti#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q&X|Q'U!eS'[%i-`Q+t&PQ,P&WQ,f&gQ0n+SQ1Y+uQ1_+{Q2Q,jQ2R,kQ5f1TQ5o1aQ6[1zQ6_1|Q6`2PQ8`5gQ8c5lQ8|6bQ:X8dQ:f8yQ;V:YR<}*ZrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R,h&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'b'r(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>R>S[#]WZ#W#Z'X(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ%wxQ%{yW&Q|&V&W,OQ&_!TQ'c!hQ'e!iQ(q#sS+n%|%}Q+r&PQ,_&bQ,c&dS-l'f'gQ.i(rQ1R+oQ1X+uQ1Z+vQ1^+zQ1t,`S1x,d,eQ2|-mQ5e1TQ5i1WQ5n1`Q6Z1yQ8_5gQ8b5kQ8f5pQ:T8^R;T:U!U$zi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y!^%yy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{Q+h%wQ,T&[Q,W&]Q,b&dQ.h(qQ1s,_U1w,c,d,eQ3e.iQ6U1tS6Y1x1yQ8x6Z#f>T#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o>U<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hW%Ti%V*y>PS&[!Q&iQ&]!RQ&^!SU*}%[%d=sR,R&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^T)z$u){V+P%]<s<tW'[!e%i*Z-`S(}#y#zQ+c%rQ+y&SS.b(m(nQ1j,XQ5T0kR8i5u'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S$i$^c#Y#e%q%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.|.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ'Y!eR2q-]!W!nQ!e!r!v!y!z$|'W'_'`'l'm'n*Z*k*o*q*r-]-c-e-u0[0_1o5{5}R1l,ZnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&y!^Q'v!xS(s#u<^Q+l%zQ,]&_Q,^&aQ-j'dQ-w'oS.r(x=PS0q+X=ZQ1P+mQ1n,[Q2c,zQ2e,{Q2m-WQ2z-kQ2}-oS5Y0r=eQ5a1QS5d1S=fQ6t2oQ6x2{Q6}3SQ8]5bQ9Y6vQ9Z6yQ9^7OR:l9V$d$]c#Y#e%s%u(S(Y(t(y)R)S)T)U)V)W)X)Y)Z)[)^)`)b)g)q+d+x-Z-x-}.S.U.s.v.z.}/O/b0p2k2n3O3V3k3p3q3r3s3t3u3v3w3x3y3z3{3|4P4Q4X5X5c6u6{7Q7a7b7k7l8k9X9]9g9m9n:o;W;`<W=vS(o#p'iQ)P#zS+b%q.|S.c(n(pR3^.d'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS#q]<VQ&t!XQ&u!YQ&w![Q&x!]R2Z,vQ'a!hQ+e%wQ-h'cS.e(q+hQ2x-gW3b.h.i0w0yQ6w2yW7U3_3a3e5^U9a7V7X7ZU:q9c9d9fS;b:p:sQ;p;cR;x;qU!wQ'`-eT5y1o5{!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(j,s,x.[2[2_]!pQ!r'`-e1o5{T#q]<V%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S(}#y#zS.b(m(n!s=l$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SU$fd)_,mS(p#p'iU*v%R(w4OU0m+O.n7gQ5^0xQ7V3`Q9d7YR:s9em!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}Q't!uS(f#g2US-s'k'wQ/s*]Q0R*jQ3U-vQ4f/tQ4r0TQ4s0UQ4x0^Q7r4`S7}4t4vS8R4y4{Q9r7sQ9v7yQ9{8OQ:Q8TS:{9w9xS;g:|;PS;s;h;iS;{;t;uS<P;|;}R<S<QQ#wbQ's!uS(e#g2US(g#m+WQ+Y%fQ+j%xQ+p&OU-r'k't'wQ.W(fU/r*]*`/wQ0S*jQ0V*lQ1O+kQ1u,aS3R-s-vQ3Z.`S4e/s/tQ4n0PS4q0R0^Q4u0WQ6W1vQ7P3US7q4`4bQ7u4fU7|4r4x4{Q8P4wQ8v6XS9q7r7sQ9u7yQ9}8RQ:O8SQ:c8wQ:y9rS:z9v9xQ;S:QQ;^:dS;f:{;PS;r;g;hS;z;s;uS<O;{;}Q<R<PQ<T<SQ=o=jQ={=tR=|=uV!wQ'`-e%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_S#wz!j!r=i$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=o>R%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Q%fj!^%xy!i!u%{%|%}'V'e'f'g'k'u*j+n+o-Y-l-m-t0R0U1R2u2|3T4r4s4v7}9{S&Oz!jQ+k%yQ,a&dW1v,b,c,d,eU6X1w1x1yS8w6Y6ZQ:d8x!r=j$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ=t>QR=u>R%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_Y#bWZ#W#Z(T!b%jm#h#i#l$x%e%h(^(h(i(j*Y*^*b+Z+[+^,o-V.T.Z.[.]._/m/p2d3[3]4a6r7TQ,n&o!p=k$Z$n)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SR=n'XU']!e%i*ZR2s-`%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+],p,s,x-i-q.P.V.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3l4z6T6e6f6i6|8t9T9_!r)_$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SQ,m&oQ0x+gQ3`.gQ7Y3dR9e7[!b$Tc#Y%q(S(Y(t(y)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!P<d)^)q-Z.|2k2n3p3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!f$Vc#Y%q(S(Y(t(y)W)X)Z)[)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<W!T<f)^)q-Z.|2k2n3p3v3w3y3z4P4X6u7b7k7l8k9X9g9m9n;W;`=v!^$Zc#Y%q(S(Y(t(y)`)g+x-x-}.S.U.s.v/b0p3O3V3k3{5X5c6{7Q7a9]:o<WQ4_/kz>S)^)q-Z.|2k2n3p4P4X6u7b7k7l8k9X9g9m9n;W;`=vQ>X>ZR>Y>['QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>SS$oh$pR4U/U'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$kf$qQ$ifS)j$l)nR)v$qT$jf$qT)l$l)n'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'b'r(T(V(](d(x(z)O)s)}*i+X+]+g,p,s,x-U-X-i-q.P.V.g.t.{/U/V/n0]0l0r1S1r2S2T2V2X2[2_2a2p3Q3W3d3l4T4z5w6T6e6f6i6s6|7[8t9T9_:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>ST$oh$pQ$rhR)u$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'b'r(T(V(](d(x(z)O)}*i+X+]+g,p,s,x-i-q.P.V.g.t.{/n0]0l0r1S1r2S2T2V2X2[2_2a3Q3W3d3l4z6T6e6f6i6|7[8t9T9_!s>Q$Z$n'X)s-U-X/V2p4T5w6s:Z:m<U<X<Y<]<^<_<`<a<b<c<d<e<f<g<h<i<k<n<{=O=P=R=Z=[=e=f>S#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'b)O)s*i+]+g,p,s,x-i.g/V/n0]0l1r2S2T2V2X2[2_2a3d4T4z6T6e6f6i7[8t9T!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^Q+T%aQ/c*Oo4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!U$yi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>YQ*c$zU*l$|*Z*oQ+U%bQ0W*m#f=q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n=r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hQ=w>TQ=x>UQ=y>VR=z>W!U%Ri$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y#f(w#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^o4O<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=hnoOXst!Z#d%m&r&t&u&w,s,x2[2_S*f${*YQ-R'OQ-S'QR4i/y%[%Si#v$b$c$d$x${%O%Q%^%_%c)y*R*T*V*Y*a*g*w*x+f+i,S,V.f/P/d/m/x/y/{0`0b0i0j0o1f1i1q3c4^4_4j4o5Q5[5_6S7W7v8Q8V8[8q9b9p9y:P:`:r;Q;[;d;k<l<m<o<p<q<r<u<v<w<x<y<z=S=T=U=V=X=Y=]=^=_=`=a=b=c=d=g=h>P>X>Y>]>^Q,U&]Q1h,WQ5s1gR8h5tV*n$|*Z*oU*n$|*Z*oT5z1o5{S0P*i/nQ4w0]T8S4z:]Q+j%xQ0V*lQ1O+kQ1u,aQ6W1vQ8v6XQ:c8wR;^:d!U%Oi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Yx*R$v)e*S*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>OS0`*t0a#f<o#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<p<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!d=S(u)c*[*e.j.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[`=T3}7c7f7j9h:t:w;yS=_.l3iT=`7e9k!U%Qi$d%O%Q%^%_%c*R*T*a*w*x/P/x0`0b0i0j0o4_5Q8V9p>P>X>Y|*T$v)e*U*t+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>OS0b*u0c#f<q#v$b$c$x${)y*V*Y*g+f+i,S,V.f/d/m/y/{1f1i1q3c4^4j4o5[5_6S7W7v8Q8[8q9b9y:P:`:r;Q;[;d;k<o<q<u<w<y=S=U=X=]=_=a=c=g>]>^n<r<l<m<p<r<v<x<z=T=V=Y=^=`=b=d=h!h=U(u)c*[*e.k.l.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[d=V3}7d7e7j9h9i:t:u:w;yS=a.m3jT=b7f9lrnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q&f!UR,p&ornOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_R&f!UQ,Y&^R1d,RsnOXst!V!Z#d%m&i&r&t&u&w,s,x2[2_Q1p,_S6R1s1tU8p6P6Q6US:_8r8sS;Y:^:aQ;m;ZR;w;nQ&m!VR,i&iR6_1|R:f8yW&Q|&V&W,OR1Z+vQ&r!WR,s&sR,y&xT2],x2_R,}&yQ,|&yR2f,}Q'y!{R-y'ySsOtQ#dXT%ps#dQ#OTR'{#OQ#RUR'}#RQ){$uR/`){Q#UVR(Q#UQ#XWU(W#X(X.QQ(X#YR.Q(YQ-^'YR2r-^Q.u(yS3m.u3nR3n.vQ-e'`R2v-eY!rQ'`-e1o5{R'j!rQ/Q)eR4S/QU#_W%h*YU(_#_(`.RQ(`#`R.R(ZQ-a']R2t-at`OXst!V!Z#d%m&i&k&r&t&u&w,s,x2[2_S#hZ%eU#r`#h.[R.[(jQ(k#jQ.X(gW.a(k.X3X7RQ3X.YR7R3YQ)n$lR/W)nQ$phR)t$pQ$`cU)a$`-|<jQ-|<WR<j)qQ/q*]W4c/q4d7t9sU4d/r/s/tS7t4e4fR9s7u$e*Q$v(u)c)e*[*e*t*u+Q+R+V.l.m.o.p.q/_/g/i/k/v/|0d0e0v1e3f3g3h3}4R4[4g4h4l4|5O5R5S5W5r7]7^7_7`7e7f7h7i7j7p7w7z8U8X8Z9h9i9j9t9|:R:S:t:u:v:w:x:};R;e;j;v;y=p=}>O>Z>[Q/z*eU4k/z4m7xQ4m/|R7x4lS*o$|*ZR0Y*ox*S$v)e*t*u+V/v0d0e4R4g5R5S5W7p8U:R:x=p=}>O!d.j(u)c*[*e.l.m.q/_/k/|0v1e3h4[4h4l5r7]7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/h*S.j7ca7c3}7e7f7j9h:t:w;yQ0a*tQ3i.lU4}0a3i9kR9k7e|*U$v)e*t*u+V/g/v0d0e4R4g4|5R5S5W7p8U:R:x=p=}>O!h.k(u)c*[*e.l.m.q/_/k/|0v1e3f3h4[4h4l5r7]7^7`7w7z8X8Z9t9|:S:};R;e;j;v>Z>[U/j*U.k7de7d3}7e7f7j9h9i:t:u:w;yQ0c*uQ3j.mU5P0c3j9lR9l7fQ*z%UR0g*zQ5]0vR8Y5]Q+_%kR0u+_Q5v1jS8j5v:[R:[8kQ,[&_R1m,[Q5{1oR8m5{Q1{,fS6]1{8zR8z6_Q1U+rW5h1U5j8a:VQ5j1XQ8a5iR:V8bQ+w&QR1[+wQ2_,xR6m2_YrOXst#dQ&v!ZQ+a%mQ,r&rQ,t&tQ,u&uQ,w&wQ2Y,sS2],x2_R6l2[Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'q!uQ+`%lQ+l%zQ,Q&XQ,h&mQ-P&|W-p'k's't'wQ-w'oQ0X*nQ1P+mQ1c,PS2O,i,lQ2g-OQ2h-RQ2i-SQ2}-oW3P-r-s-v-xQ5a1QQ5m1_Q5q1eQ6V1uQ6a2QQ6k2ZU6z3O3R3UQ6}3SQ8]5bQ8e5oQ8g5rQ8l5zQ8u6WQ8{6`S9[6{7PQ9^7OQ:W8cQ:b8vQ:g8|Q:n9]Q;U:XQ;]:cQ;a:oQ;l;VR;o;^Q%zyQ'd!iQ'o!uU+m%{%|%}Q-W'VU-k'e'f'gS-o'k'uQ0Q*jS1Q+n+oQ2o-YS2{-l-mQ3S-tS4p0R0UQ5b1RQ6v2uQ6y2|Q7O3TU7{4r4s4vQ9z7}R;O9{S$wi>PR*{%VU%Ui%V>PR0f*yQ$viS(u#v+iS)c$b$cQ)e$dQ*[$xS*e${*YQ*t%OQ*u%QQ+Q%^Q+R%_Q+V%cQ.l<oQ.m<qQ.o<uQ.p<wQ.q<yQ/_)yQ/g*RQ/i*TQ/k*VQ/v*aS/|*g/mQ0d*wQ0e*xl0v+f,V.f1i1q3c6S7W8q9b:`:r;[;dQ1e,SQ3f=SQ3g=UQ3h=XS3}<l<mQ4R/PS4[/d4^Q4g/xQ4h/yQ4l/{Q4|0`Q5O0bQ5R0iQ5S0jQ5W0oQ5r1fQ7]=]Q7^=_Q7_=aQ7`=cQ7e<pQ7f<rQ7h<vQ7i<xQ7j<zQ7p4_Q7w4jQ7z4oQ8U5QQ8X5[Q8Z5_Q9h=YQ9i=TQ9j=VQ9t7vQ9|8QQ:R8VQ:S8[Q:t=^Q:u=`Q:v=bQ:w=dQ:x9pQ:}9yQ;R:PQ;e=gQ;j;QQ;v;kQ;y=hQ=p>PQ=}>XQ>O>YQ>Z>]R>[>^Q+O%]Q.n<sR7g<tnpOXst!Z#d%m&r&t&u&w,s,x2[2_Q!fPS#fZ#oQ&|!`W'h!o*i0]4zQ(P#SQ)Q#{Q)r$nS,l&k&nQ,q&oQ-O&{S-T'T/nQ-g'bQ.x)OQ/[)sQ0s+]Q0y+gQ2W,pQ2y-iQ3a.gQ4W/VQ5U0lQ6Q1rQ6c2SQ6d2TQ6h2VQ6j2XQ6o2aQ7Z3dQ7m4TQ8s6TQ9P6eQ9Q6fQ9S6iQ9f7[Q:a8tR:k9T#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'b)O*i+]+g,p,s,x-i.g/n0]0l1r2S2T2V2X2[2_2a3d4z6T6e6f6i7[8t9TQ#YWQ#eYQ%quQ%svS%uw!gS(S#W(VQ(Y#ZQ(t#uQ(y#xQ)R$OQ)S$PQ)T$QQ)U$RQ)V$SQ)W$TQ)X$UQ)Y$VQ)Z$WQ)[$XQ)^$ZQ)`$_Q)b$aQ)g$eW)q$n)s/V4TQ+d%tQ+x&RS-Z'X2pQ-x'rS-}(T.PQ.S(]Q.U(dQ.s(xQ.v(zQ.z<UQ.|<XQ.}<YQ/O<]Q/b)}Q0p+XQ2k-UQ2n-XQ3O-qQ3V.VQ3k.tQ3p<^Q3q<_Q3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{.{Q3|<kQ4P<nQ4Q<{Q4X<iQ5X0rQ5c1SQ6u=OQ6{3QQ7Q3WQ7a3lQ7b=PQ7k=RQ7l=ZQ8k5wQ9X6sQ9]6|Q9g=[Q9m=eQ9n=fQ:o9_Q;W:ZQ;`:mQ<W#SR=v>SR#[WR'Z!el!tQ!r!v!y!z'`'l'm'n-e-u1o5{5}S'V!e-]U*j$|*Z*oS-Y'W'_S0U*k*qQ0^*rQ2u-cQ4v0[R4{0_R({#xQ!fQT-d'`-e]!qQ!r'`-e1o5{Q#p]R'i<VR)f$dY!uQ'`-e1o5{Q'k!rS'u!v!yS'w!z5}S-t'l'mQ-v'nR3T-uT#kZ%eS#jZ%eS%km,oU(g#h#i#lS.Y(h(iQ.^(jQ0t+^Q3Y.ZU3Z.[.]._S7S3[3]R9`7Td#^W#W#Z%h(T(^*Y+Z.T/mr#gZm#h#i#l%e(h(i(j+^.Z.[.]._3[3]7TS*]$x*bQ/t*^Q2U,oQ2l-VQ4`/pQ6q2dQ7s4aQ9W6rT=m'X+[V#aW%h*YU#`W%h*YS(U#W(^U(Z#Z+Z/mS-['X+[T.O(T.TV'^!e%i*ZQ$lfR)x$qT)m$l)nR4V/UT*_$x*bT*h${*YQ0w+fQ1g,VQ3_.fQ5t1iQ6P1qQ7X3cQ8r6SQ9c7WQ:^8qQ:p9bQ;Z:`Q;c:rQ;n;[R;q;dnqOXst!Z#d%m&r&t&u&w,s,x2[2_Q&l!VR,h&itmOXst!U!V!Z#d%m&i&r&t&u&w,s,x2[2_R,o&oT%lm,oR1k,XR,g&gQ&U|S+}&V&WR1^,OR+s&PT&p!W&sT&q!W&sT2^,x2_",
  nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 380,
  context: r$,
  nodeProps: [
    ["isolate", -8, 5, 6, 14, 37, 39, 51, 53, 55, ""],
    ["group", -26, 9, 17, 19, 68, 207, 211, 215, 216, 218, 221, 224, 234, 237, 243, 245, 247, 249, 252, 258, 264, 266, 268, 270, 272, 274, 275, "Statement", -34, 13, 14, 32, 35, 36, 42, 51, 54, 55, 57, 62, 70, 72, 76, 80, 82, 84, 85, 110, 111, 120, 121, 136, 139, 141, 142, 143, 144, 145, 147, 148, 167, 169, 171, "Expression", -23, 31, 33, 37, 41, 43, 45, 173, 175, 177, 178, 180, 181, 182, 184, 185, 186, 188, 189, 190, 201, 203, 205, 206, "Type", -3, 88, 103, 109, "ClassItem"],
    ["openedBy", 23, "<", 38, "InterpolationStart", 56, "[", 60, "{", 73, "(", 160, "JSXStartCloseTag"],
    ["closedBy", -2, 24, 168, ">", 40, "InterpolationEnd", 50, "]", 61, "}", 74, ")", 165, "JSXEndTag"]
  ],
  propSources: [c$],
  skippedNodes: [0, 5, 6, 278],
  repeatNodeCount: 37,
  tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$i&j(Wp(Z!b'|0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(X#S$i&j'}0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$i&j(Wp(Z!b'}0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$i&j!p),Q(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#v(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(V':f$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$i&j(Z!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$i&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$d`$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$d``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$d`$i&j(Z!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(Z!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$d`(Z!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$i&j(Wp(Z!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$i&j(Wp(Z!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$i&j(Z!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$i&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS(Z!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$i&j(WpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(WpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Wp(Z!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$i&j(o%1l(Wp(Z!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$i&j(Wp(Z!b$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$i&j(Wp(Z!b$]#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$i&j(Wp(Z!b#p(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$i&j$Q(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva(z+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$i&j#z(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Y';W$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$i&j(WpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$i&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$d`$i&j(WpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(WpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$d`(WpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$i&j(Wp(Z!b(U%&f#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$i&j(Wp(Z!b#n(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$i&j(Wp(Z!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$i&j(Wp(Z!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$i&j(Wp(Z!b#o(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$i&j(Z!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$i&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$i&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$i&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$i&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$i&j(Z!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ(Z!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse(Z!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX(Z!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$i&j(Z!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$i&j(Wp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$i&j(Wp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Wp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Wp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(WpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$i&j(WpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$i&j(Wp(Z!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Wp(Z!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Wp(Z!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Wp(Z!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$i&j(Wp(Z!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$i&j(Wp(Z!b(O0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$i&j(Wp(Z!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$i&j(Z!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$i&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW(Z!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$i&j(WpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(WpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Wp(Z!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$i&j$Q(Ch(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$Z#t$i&j(Wp(Z!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$i&j(Wp(Z!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$i&j$O)Lv(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Wp(Z!b$n7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$k&j(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#r(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$Q(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#s(Ch(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#k(Cl$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#s(Ch$f#|$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#s(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#r(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(r(Ct$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$i&j#{(Ch(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$i&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$i&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$i&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$i&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$i&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$i&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#x(Ch$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$i&j(Wp(Z!b(a+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$i&j(Wp(Z!b(T,2j$_#t(e$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$i&j(Wp(Z!b$_#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Wp(Z!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(y+JY$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$i&j(Wp(Z!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$i&j(Wp(Z!b'|0/l$]#t(T,2j(e$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$i&j(Wp(Z!b'}0/l$]#t(T,2j(e$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [o$, l$, a$, h$, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, s$, new Kr("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(c~~", 141, 340), new Kr("j~RQYZXz{^~^O(Q~~aP!P!Qd~iO(R~~", 25, 323)],
  topRules: { Script: [0, 7], SingleExpression: [1, 276], SingleClassItem: [2, 277] },
  dialects: { jsx: 0, ts: 15175 },
  dynamicPrecedences: { 80: 1, 82: 1, 94: 1, 169: 1, 199: 1 },
  specialized: [{ term: 327, get: (i) => f$[i] || -1 }, { term: 343, get: (i) => O$[i] || -1 }, { term: 95, get: (i) => u$[i] || -1 }],
  tokenPrec: 15201
}), _d = [
  /* @__PURE__ */ ve("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ ve(`try {
	\${}
} catch (\${error}) {
	\${}
}`, {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ ve(`if (\${}) {
	\${}
} else {
	\${}
}`, {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ ve(`class \${name} {
	constructor(\${params}) {
		\${}
	}
}`, {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ ve('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  /* @__PURE__ */ ve('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
], p$ = /* @__PURE__ */ _d.concat([
  /* @__PURE__ */ ve("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ ve("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]), Gc = /* @__PURE__ */ new UO(), jd = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function Ki(i) {
  return (e, t) => {
    let n = e.node.getChild("VariableDefinition");
    return n && t(n, i), !0;
  };
}
const m$ = ["FunctionDeclaration"], g$ = {
  FunctionDeclaration: /* @__PURE__ */ Ki("function"),
  ClassDeclaration: /* @__PURE__ */ Ki("class"),
  ClassExpression: () => !0,
  EnumDeclaration: /* @__PURE__ */ Ki("constant"),
  TypeAliasDeclaration: /* @__PURE__ */ Ki("type"),
  NamespaceDeclaration: /* @__PURE__ */ Ki("namespace"),
  VariableDefinition(i, e) {
    i.matchContext(m$) || e(i, "variable");
  },
  TypeDefinition(i, e) {
    e(i, "type");
  },
  __proto__: null
};
function zd(i, e) {
  let t = Gc.get(e);
  if (t)
    return t;
  let n = [], r = !0;
  function s(o, l) {
    let a = i.sliceString(o.from, o.to);
    n.push({ label: a, type: l });
  }
  return e.cursor(B.IncludeAnonymous).iterate((o) => {
    if (r)
      r = !1;
    else if (o.name) {
      let l = g$[o.name];
      if (l && l(o, s) || jd.has(o.name))
        return !1;
    } else if (o.to - o.from > 8192) {
      for (let l of zd(i, o.node))
        n.push(l);
      return !1;
    }
  }), Gc.set(e, n), n;
}
const Nc = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, Vd = [
  "TemplateString",
  "String",
  "RegExp",
  "LineComment",
  "BlockComment",
  "VariableDefinition",
  "TypeDefinition",
  "Label",
  "PropertyDefinition",
  "PropertyName",
  "PrivatePropertyDefinition",
  "PrivatePropertyName",
  "JSXText",
  "JSXAttributeValue",
  "JSXOpenTag",
  "JSXCloseTag",
  "JSXSelfClosingTag",
  ".",
  "?."
];
function S$(i) {
  let e = H(i.state).resolveInner(i.pos, -1);
  if (Vd.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && Nc.test(i.state.sliceDoc(e.from, e.to));
  if (!t && !i.explicit)
    return null;
  let n = [];
  for (let r = e; r; r = r.parent)
    jd.has(r.name) && (n = n.concat(zd(i.state.doc, r)));
  return {
    options: n,
    from: t ? e.from : i.pos,
    validFor: Nc
  };
}
const Ot = /* @__PURE__ */ ut.define({
  name: "javascript",
  parser: /* @__PURE__ */ d$.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        IfStatement: /* @__PURE__ */ si({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ si({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: dS,
        SwitchBody: (i) => {
          let e = i.textAfter, t = /^\s*\}/.test(e), n = /^\s*(case|default)\b/.test(e);
          return i.baseIndent + (t ? 0 : n ? 1 : 2) * i.unit;
        },
        Block: /* @__PURE__ */ nl({ closing: "}" }),
        ArrowFunction: (i) => i.baseIndent + i.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": /* @__PURE__ */ si({ except: /^\s*{/ }),
        JSXElement(i) {
          let e = /^\s*<\//.test(i.textAfter);
          return i.lineIndent(i.node.from) + (e ? 0 : i.unit);
        },
        JSXEscape(i) {
          let e = /\s*\}/.test(i.textAfter);
          return i.lineIndent(i.node.from) + (e ? 0 : i.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(i) {
          return i.column(i.node.from) + i.unit;
        }
      }),
      /* @__PURE__ */ Et.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": us,
        BlockComment(i) {
          return { from: i.from + 2, to: i.to - 2 };
        },
        JSXElement(i) {
          let e = i.firstChild;
          if (!e || e.name == "JSXSelfClosingTag")
            return null;
          let t = i.lastChild;
          return { from: e.to, to: t.type.isError ? i.to : t.from };
        },
        "JSXSelfClosingTag JSXOpenTag"(i) {
          var e;
          let t = (e = i.firstChild) === null || e === void 0 ? void 0 : e.nextSibling, n = i.lastChild;
          return !t || t.type.isError ? null : { from: t.to, to: n.type.isError ? i.to : n.from };
        }
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
}), Dd = {
  test: (i) => /^JSX/.test(i.name),
  facet: /* @__PURE__ */ JO({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
}, Ed = /* @__PURE__ */ Ot.configure({ dialect: "ts" }, "typescript"), Ld = /* @__PURE__ */ Ot.configure({
  dialect: "jsx",
  props: [/* @__PURE__ */ Hl.add((i) => i.isTop ? [Dd] : void 0)]
}), Bd = /* @__PURE__ */ Ot.configure({
  dialect: "jsx ts",
  props: [/* @__PURE__ */ Hl.add((i) => i.isTop ? [Dd] : void 0)]
}, "typescript");
let Id = (i) => ({ label: i, type: "keyword" });
const Gd = /* @__PURE__ */ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(Id), Q$ = /* @__PURE__ */ Gd.concat(/* @__PURE__ */ ["declare", "implements", "private", "protected", "public"].map(Id));
function Nd(i = {}) {
  let e = i.jsx ? i.typescript ? Bd : Ld : i.typescript ? Ed : Ot, t = i.typescript ? p$.concat(Q$) : _d.concat(Gd);
  return new fi(e, [
    Ot.data.of({
      autocomplete: rd(Vd, aa(t))
    }),
    Ot.data.of({
      autocomplete: S$
    }),
    i.jsx ? x$ : []
  ]);
}
function b$(i) {
  for (; ; ) {
    if (i.name == "JSXOpenTag" || i.name == "JSXSelfClosingTag" || i.name == "JSXFragmentTag")
      return i;
    if (i.name == "JSXEscape" || !i.parent)
      return null;
    i = i.parent;
  }
}
function Uc(i, e, t = i.length) {
  for (let n = e?.firstChild; n; n = n.nextSibling)
    if (n.name == "JSXIdentifier" || n.name == "JSXBuiltin" || n.name == "JSXNamespacedName" || n.name == "JSXMemberExpression")
      return i.sliceString(n.from, Math.min(n.to, t));
  return "";
}
const y$ = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), x$ = /* @__PURE__ */ k.inputHandler.of((i, e, t, n, r) => {
  if ((y$ ? i.composing : i.compositionStarted) || i.state.readOnly || e != t || n != ">" && n != "/" || !Ot.isActiveAt(i.state, e, -1))
    return !1;
  let s = r(), { state: o } = s, l = o.changeByRange((a) => {
    var h;
    let { head: c } = a, f = H(o).resolveInner(c - 1, -1), O;
    if (f.name == "JSXStartTag" && (f = f.parent), !(o.doc.sliceString(c - 1, c) != n || f.name == "JSXAttributeValue" && f.to > c)) {
      if (n == ">" && f.name == "JSXFragmentTag")
        return { range: a, changes: { from: c, insert: "</>" } };
      if (n == "/" && f.name == "JSXStartCloseTag") {
        let u = f.parent, d = u.parent;
        if (d && u.from == c - 2 && ((O = Uc(o.doc, d.firstChild, c)) || ((h = d.firstChild) === null || h === void 0 ? void 0 : h.name) == "JSXFragmentTag")) {
          let m = `${O}>`;
          return { range: b.cursor(c + m.length, -1), changes: { from: c, insert: m } };
        }
      } else if (n == ">") {
        let u = b$(f);
        if (u && u.name == "JSXOpenTag" && !/^\/?>|^<\//.test(o.doc.sliceString(c, c + 2)) && (O = Uc(o.doc, u, c)))
          return { range: a, changes: { from: c, insert: `</${O}>` } };
      }
    }
    return { range: a };
  });
  return l.changes.empty ? !1 : (i.dispatch([
    s,
    o.update(l, { userEvent: "input.complete", scrollIntoView: !0 })
  ]), !0);
}), Ji = ["_blank", "_self", "_top", "_parent"], lo = ["ascii", "utf-8", "utf-16", "latin1", "latin1"], ao = ["get", "post", "put", "delete"], ho = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], qe = ["true", "false"], X = {}, $$ = {
  a: {
    attrs: {
      href: null,
      ping: null,
      type: null,
      media: null,
      target: Ji,
      hreflang: null
    }
  },
  abbr: X,
  address: X,
  area: {
    attrs: {
      alt: null,
      coords: null,
      href: null,
      target: null,
      ping: null,
      media: null,
      hreflang: null,
      type: null,
      shape: ["default", "rect", "circle", "poly"]
    }
  },
  article: X,
  aside: X,
  audio: {
    attrs: {
      src: null,
      mediagroup: null,
      crossorigin: ["anonymous", "use-credentials"],
      preload: ["none", "metadata", "auto"],
      autoplay: ["autoplay"],
      loop: ["loop"],
      controls: ["controls"]
    }
  },
  b: X,
  base: { attrs: { href: null, target: Ji } },
  bdi: X,
  bdo: X,
  blockquote: { attrs: { cite: null } },
  body: X,
  br: X,
  button: {
    attrs: {
      form: null,
      formaction: null,
      name: null,
      value: null,
      autofocus: ["autofocus"],
      disabled: ["autofocus"],
      formenctype: ho,
      formmethod: ao,
      formnovalidate: ["novalidate"],
      formtarget: Ji,
      type: ["submit", "reset", "button"]
    }
  },
  canvas: { attrs: { width: null, height: null } },
  caption: X,
  center: X,
  cite: X,
  code: X,
  col: { attrs: { span: null } },
  colgroup: { attrs: { span: null } },
  command: {
    attrs: {
      type: ["command", "checkbox", "radio"],
      label: null,
      icon: null,
      radiogroup: null,
      command: null,
      title: null,
      disabled: ["disabled"],
      checked: ["checked"]
    }
  },
  data: { attrs: { value: null } },
  datagrid: { attrs: { disabled: ["disabled"], multiple: ["multiple"] } },
  datalist: { attrs: { data: null } },
  dd: X,
  del: { attrs: { cite: null, datetime: null } },
  details: { attrs: { open: ["open"] } },
  dfn: X,
  div: X,
  dl: X,
  dt: X,
  em: X,
  embed: { attrs: { src: null, type: null, width: null, height: null } },
  eventsource: { attrs: { src: null } },
  fieldset: { attrs: { disabled: ["disabled"], form: null, name: null } },
  figcaption: X,
  figure: X,
  footer: X,
  form: {
    attrs: {
      action: null,
      name: null,
      "accept-charset": lo,
      autocomplete: ["on", "off"],
      enctype: ho,
      method: ao,
      novalidate: ["novalidate"],
      target: Ji
    }
  },
  h1: X,
  h2: X,
  h3: X,
  h4: X,
  h5: X,
  h6: X,
  head: {
    children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]
  },
  header: X,
  hgroup: X,
  hr: X,
  html: {
    attrs: { manifest: null }
  },
  i: X,
  iframe: {
    attrs: {
      src: null,
      srcdoc: null,
      name: null,
      width: null,
      height: null,
      sandbox: ["allow-top-navigation", "allow-same-origin", "allow-forms", "allow-scripts"],
      seamless: ["seamless"]
    }
  },
  img: {
    attrs: {
      alt: null,
      src: null,
      ismap: null,
      usemap: null,
      width: null,
      height: null,
      crossorigin: ["anonymous", "use-credentials"]
    }
  },
  input: {
    attrs: {
      alt: null,
      dirname: null,
      form: null,
      formaction: null,
      height: null,
      list: null,
      max: null,
      maxlength: null,
      min: null,
      name: null,
      pattern: null,
      placeholder: null,
      size: null,
      src: null,
      step: null,
      value: null,
      width: null,
      accept: ["audio/*", "video/*", "image/*"],
      autocomplete: ["on", "off"],
      autofocus: ["autofocus"],
      checked: ["checked"],
      disabled: ["disabled"],
      formenctype: ho,
      formmethod: ao,
      formnovalidate: ["novalidate"],
      formtarget: Ji,
      multiple: ["multiple"],
      readonly: ["readonly"],
      required: ["required"],
      type: [
        "hidden",
        "text",
        "search",
        "tel",
        "url",
        "email",
        "password",
        "datetime",
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range",
        "color",
        "checkbox",
        "radio",
        "file",
        "submit",
        "image",
        "reset",
        "button"
      ]
    }
  },
  ins: { attrs: { cite: null, datetime: null } },
  kbd: X,
  keygen: {
    attrs: {
      challenge: null,
      form: null,
      name: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      keytype: ["RSA"]
    }
  },
  label: { attrs: { for: null, form: null } },
  legend: X,
  li: { attrs: { value: null } },
  link: {
    attrs: {
      href: null,
      type: null,
      hreflang: null,
      media: null,
      sizes: ["all", "16x16", "16x16 32x32", "16x16 32x32 64x64"]
    }
  },
  map: { attrs: { name: null } },
  mark: X,
  menu: { attrs: { label: null, type: ["list", "context", "toolbar"] } },
  meta: {
    attrs: {
      content: null,
      charset: lo,
      name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
      "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
    }
  },
  meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
  nav: X,
  noscript: X,
  object: {
    attrs: {
      data: null,
      type: null,
      name: null,
      usemap: null,
      form: null,
      width: null,
      height: null,
      typemustmatch: ["typemustmatch"]
    }
  },
  ol: {
    attrs: { reversed: ["reversed"], start: null, type: ["1", "a", "A", "i", "I"] },
    children: ["li", "script", "template", "ul", "ol"]
  },
  optgroup: { attrs: { disabled: ["disabled"], label: null } },
  option: { attrs: { disabled: ["disabled"], label: null, selected: ["selected"], value: null } },
  output: { attrs: { for: null, form: null, name: null } },
  p: X,
  param: { attrs: { name: null, value: null } },
  pre: X,
  progress: { attrs: { value: null, max: null } },
  q: { attrs: { cite: null } },
  rp: X,
  rt: X,
  ruby: X,
  samp: X,
  script: {
    attrs: {
      type: ["text/javascript"],
      src: null,
      async: ["async"],
      defer: ["defer"],
      charset: lo
    }
  },
  section: X,
  select: {
    attrs: {
      form: null,
      name: null,
      size: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      multiple: ["multiple"]
    }
  },
  slot: { attrs: { name: null } },
  small: X,
  source: { attrs: { src: null, type: null, media: null } },
  span: X,
  strong: X,
  style: {
    attrs: {
      type: ["text/css"],
      media: null,
      scoped: null
    }
  },
  sub: X,
  summary: X,
  sup: X,
  table: X,
  tbody: X,
  td: { attrs: { colspan: null, rowspan: null, headers: null } },
  template: X,
  textarea: {
    attrs: {
      dirname: null,
      form: null,
      maxlength: null,
      name: null,
      placeholder: null,
      rows: null,
      cols: null,
      autofocus: ["autofocus"],
      disabled: ["disabled"],
      readonly: ["readonly"],
      required: ["required"],
      wrap: ["soft", "hard"]
    }
  },
  tfoot: X,
  th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"] } },
  thead: X,
  time: { attrs: { datetime: null } },
  title: X,
  tr: X,
  track: {
    attrs: {
      src: null,
      label: null,
      default: null,
      kind: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
      srclang: null
    }
  },
  ul: { children: ["li", "script", "template", "ul", "ol"] },
  var: X,
  video: {
    attrs: {
      src: null,
      poster: null,
      width: null,
      height: null,
      crossorigin: ["anonymous", "use-credentials"],
      preload: ["auto", "metadata", "none"],
      autoplay: ["autoplay"],
      mediagroup: ["movie"],
      muted: ["muted"],
      controls: ["controls"]
    }
  },
  wbr: X
}, Ud = {
  accesskey: null,
  class: null,
  contenteditable: qe,
  contextmenu: null,
  dir: ["ltr", "rtl", "auto"],
  draggable: ["true", "false", "auto"],
  dropzone: ["copy", "move", "link", "string:", "file:"],
  hidden: ["hidden"],
  id: null,
  inert: ["inert"],
  itemid: null,
  itemprop: null,
  itemref: null,
  itemscope: ["itemscope"],
  itemtype: null,
  lang: ["ar", "bn", "de", "en-GB", "en-US", "es", "fr", "hi", "id", "ja", "pa", "pt", "ru", "tr", "zh"],
  spellcheck: qe,
  autocorrect: qe,
  autocapitalize: qe,
  style: null,
  tabindex: null,
  title: null,
  translate: ["yes", "no"],
  rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"],
  role: /* @__PURE__ */ "alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),
  "aria-activedescendant": null,
  "aria-atomic": qe,
  "aria-autocomplete": ["inline", "list", "both", "none"],
  "aria-busy": qe,
  "aria-checked": ["true", "false", "mixed", "undefined"],
  "aria-controls": null,
  "aria-describedby": null,
  "aria-disabled": qe,
  "aria-dropeffect": null,
  "aria-expanded": ["true", "false", "undefined"],
  "aria-flowto": null,
  "aria-grabbed": ["true", "false", "undefined"],
  "aria-haspopup": qe,
  "aria-hidden": qe,
  "aria-invalid": ["true", "false", "grammar", "spelling"],
  "aria-label": null,
  "aria-labelledby": null,
  "aria-level": null,
  "aria-live": ["off", "polite", "assertive"],
  "aria-multiline": qe,
  "aria-multiselectable": qe,
  "aria-owns": null,
  "aria-posinset": null,
  "aria-pressed": ["true", "false", "mixed", "undefined"],
  "aria-readonly": qe,
  "aria-relevant": null,
  "aria-required": qe,
  "aria-selected": ["true", "false", "undefined"],
  "aria-setsize": null,
  "aria-sort": ["ascending", "descending", "none", "other"],
  "aria-valuemax": null,
  "aria-valuemin": null,
  "aria-valuenow": null,
  "aria-valuetext": null
}, Fd = /* @__PURE__ */ "beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map((i) => "on" + i);
for (let i of Fd)
  Ud[i] = null;
class ts {
  constructor(e, t) {
    this.tags = { ...$$, ...e }, this.globalAttrs = { ...Ud, ...t }, this.allTags = Object.keys(this.tags), this.globalAttrNames = Object.keys(this.globalAttrs);
  }
}
ts.default = /* @__PURE__ */ new ts();
function Yi(i, e, t = i.length) {
  if (!e)
    return "";
  let n = e.firstChild, r = n && n.getChild("TagName");
  return r ? i.sliceString(r.from, Math.min(r.to, t)) : "";
}
function _i(i, e = !1) {
  for (; i; i = i.parent)
    if (i.name == "Element")
      if (e)
        e = !1;
      else
        return i;
  return null;
}
function Hd(i, e, t) {
  let n = t.tags[Yi(i, _i(e))];
  return n?.children || t.allTags;
}
function xa(i, e) {
  let t = [];
  for (let n = _i(e); n && !n.type.isTop; n = _i(n.parent)) {
    let r = Yi(i, n);
    if (r && n.lastChild.name == "CloseTag")
      break;
    r && t.indexOf(r) < 0 && (e.name == "EndTag" || e.from >= n.firstChild.to) && t.push(r);
  }
  return t;
}
const Kd = /^[:\-\.\w\u00b7-\uffff]*$/;
function Fc(i, e, t, n, r) {
  let s = /\s*>/.test(i.sliceDoc(r, r + 5)) ? "" : ">", o = _i(t, t.name == "StartTag" || t.name == "TagName");
  return {
    from: n,
    to: r,
    options: Hd(i.doc, o, e).map((l) => ({ label: l, type: "type" })).concat(xa(i.doc, t).map((l, a) => ({
      label: "/" + l,
      apply: "/" + l + s,
      type: "type",
      boost: 99 - a
    }))),
    validFor: /^\/?[:\-\.\w\u00b7-\uffff]*$/
  };
}
function Hc(i, e, t, n) {
  let r = /\s*>/.test(i.sliceDoc(n, n + 5)) ? "" : ">";
  return {
    from: t,
    to: n,
    options: xa(i.doc, e).map((s, o) => ({ label: s, apply: s + r, type: "type", boost: 99 - o })),
    validFor: Kd
  };
}
function P$(i, e, t, n) {
  let r = [], s = 0;
  for (let o of Hd(i.doc, t, e))
    r.push({ label: "<" + o, type: "type" });
  for (let o of xa(i.doc, t))
    r.push({ label: "</" + o + ">", type: "type", boost: 99 - s++ });
  return { from: n, to: n, options: r, validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
}
function k$(i, e, t, n, r) {
  let s = _i(t), o = s ? e.tags[Yi(i.doc, s)] : null, l = o && o.attrs ? Object.keys(o.attrs) : [], a = o && o.globalAttrs === !1 ? l : l.length ? l.concat(e.globalAttrNames) : e.globalAttrNames;
  return {
    from: n,
    to: r,
    options: a.map((h) => ({ label: h, type: "property" })),
    validFor: Kd
  };
}
function w$(i, e, t, n, r) {
  var s;
  let o = (s = t.parent) === null || s === void 0 ? void 0 : s.getChild("AttributeName"), l = [], a;
  if (o) {
    let h = i.sliceDoc(o.from, o.to), c = e.globalAttrs[h];
    if (!c) {
      let f = _i(t), O = f ? e.tags[Yi(i.doc, f)] : null;
      c = O?.attrs && O.attrs[h];
    }
    if (c) {
      let f = i.sliceDoc(n, r).toLowerCase(), O = '"', u = '"';
      /^['"]/.test(f) ? (a = f[0] == '"' ? /^[^"]*$/ : /^[^']*$/, O = "", u = i.sliceDoc(r, r + 1) == f[0] ? "" : f[0], f = f.slice(1), n++) : a = /^[^\s<>='"]*$/;
      for (let d of c)
        l.push({ label: d, apply: O + d + u, type: "constant" });
    }
  }
  return { from: n, to: r, options: l, validFor: a };
}
function v$(i, e) {
  let { state: t, pos: n } = e, r = H(t).resolveInner(n, -1), s = r.resolve(n);
  for (let o = n, l; s == r && (l = r.childBefore(o)); ) {
    let a = l.lastChild;
    if (!a || !a.type.isError || a.from < a.to)
      break;
    s = r = l, o = a.from;
  }
  return r.name == "TagName" ? r.parent && /CloseTag$/.test(r.parent.name) ? Hc(t, r, r.from, n) : Fc(t, i, r, r.from, n) : r.name == "StartTag" || r.name == "IncompleteTag" ? Fc(t, i, r, n, n) : r.name == "StartCloseTag" || r.name == "IncompleteCloseTag" ? Hc(t, r, n, n) : r.name == "OpenTag" || r.name == "SelfClosingTag" || r.name == "AttributeName" ? k$(t, i, r, r.name == "AttributeName" ? r.from : n, n) : r.name == "Is" || r.name == "AttributeValue" || r.name == "UnquotedAttributeValue" ? w$(t, i, r, r.name == "Is" ? n : r.from, n) : e.explicit && (s.name == "Element" || s.name == "Text" || s.name == "Document") ? P$(t, i, r, n) : null;
}
function T$(i) {
  let { extraTags: e, extraGlobalAttributes: t } = i, n = t || e ? new ts(e, t) : ts.default;
  return (r) => v$(n, r);
}
const C$ = /* @__PURE__ */ Ot.parser.configure({ top: "SingleExpression" }), Jd = [
  {
    tag: "script",
    attrs: (i) => i.type == "text/typescript" || i.lang == "ts",
    parser: Ed.parser
  },
  {
    tag: "script",
    attrs: (i) => i.type == "text/babel" || i.type == "text/jsx",
    parser: Ld.parser
  },
  {
    tag: "script",
    attrs: (i) => i.type == "text/typescript-jsx",
    parser: Bd.parser
  },
  {
    tag: "script",
    attrs(i) {
      return /^(importmap|speculationrules|application\/(.+\+)?json)$/i.test(i.type);
    },
    parser: C$
  },
  {
    tag: "script",
    attrs(i) {
      return !i.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(i.type);
    },
    parser: Ot.parser
  },
  {
    tag: "style",
    attrs(i) {
      return (!i.lang || i.lang == "css") && (!i.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(i.type));
    },
    parser: Jr.parser
  }
], ep = /* @__PURE__ */ [
  {
    name: "style",
    parser: /* @__PURE__ */ Jr.parser.configure({ top: "Styles" })
  }
].concat(/* @__PURE__ */ Fd.map((i) => ({ name: i, parser: Ot.parser }))), tp = /* @__PURE__ */ ut.define({
  name: "html",
  parser: /* @__PURE__ */ Yx.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        Element(i) {
          let e = /^(\s*)(<\/)?/.exec(i.textAfter);
          return i.node.to <= i.pos + e[0].length ? i.continue() : i.lineIndent(i.node.from) + (e[2] ? 0 : i.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(i) {
          return i.column(i.node.from) + i.unit;
        },
        Document(i) {
          if (i.pos + /\s*/.exec(i.textAfter)[0].length < i.node.to)
            return i.continue();
          let e = null, t;
          for (let n = i.node; ; ) {
            let r = n.lastChild;
            if (!r || r.name != "Element" || r.to != n.to)
              break;
            e = n = r;
          }
          return e && !((t = e.lastChild) && (t.name == "CloseTag" || t.name == "SelfClosingTag")) ? i.lineIndent(e.from) + i.unit : null;
        }
      }),
      /* @__PURE__ */ Et.add({
        Element(i) {
          let e = i.firstChild, t = i.lastChild;
          return !e || e.name != "OpenTag" ? null : { from: e.to, to: t.name == "CloseTag" ? t.from : i.to };
        }
      }),
      /* @__PURE__ */ ea.add({
        "OpenTag CloseTag": (i) => i.getChild("TagName")
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/\w+\W$/,
    wordChars: "-_"
  }
}), $r = /* @__PURE__ */ tp.configure({
  wrap: /* @__PURE__ */ qd(Jd, ep)
});
function X$(i = {}) {
  let e = "", t;
  i.matchClosingTags === !1 && (e = "noMatch"), i.selfClosingTags === !0 && (e = (e ? e + " " : "") + "selfClosing"), (i.nestedLanguages && i.nestedLanguages.length || i.nestedAttributes && i.nestedAttributes.length) && (t = qd((i.nestedLanguages || []).concat(Jd), (i.nestedAttributes || []).concat(ep)));
  let n = t ? tp.configure({ wrap: t, dialect: e }) : e ? $r.configure({ dialect: e }) : $r;
  return new fi(n, [
    $r.data.of({ autocomplete: T$(i) }),
    i.autoCloseTags !== !1 ? Z$ : [],
    Nd().support,
    wd().support
  ]);
}
const Kc = /* @__PURE__ */ new Set(/* @__PURE__ */ "area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" ")), Z$ = /* @__PURE__ */ k.inputHandler.of((i, e, t, n, r) => {
  if (i.composing || i.state.readOnly || e != t || n != ">" && n != "/" || !$r.isActiveAt(i.state, e, -1))
    return !1;
  let s = r(), { state: o } = s, l = o.changeByRange((a) => {
    var h, c, f;
    let O = o.doc.sliceString(a.from - 1, a.to) == n, { head: u } = a, d = H(o).resolveInner(u, -1), m;
    if (O && n == ">" && d.name == "EndTag") {
      let g = d.parent;
      if (((c = (h = g.parent) === null || h === void 0 ? void 0 : h.lastChild) === null || c === void 0 ? void 0 : c.name) != "CloseTag" && (m = Yi(o.doc, g.parent, u)) && !Kc.has(m)) {
        let S = u + (o.doc.sliceString(u, u + 1) === ">" ? 1 : 0), Q = `</${m}>`;
        return { range: a, changes: { from: u, to: S, insert: Q } };
      }
    } else if (O && n == "/" && d.name == "IncompleteCloseTag") {
      let g = d.parent;
      if (d.from == u - 2 && ((f = g.lastChild) === null || f === void 0 ? void 0 : f.name) != "CloseTag" && (m = Yi(o.doc, g, u)) && !Kc.has(m)) {
        let S = u + (o.doc.sliceString(u, u + 1) === ">" ? 1 : 0), Q = `${m}>`;
        return {
          range: b.cursor(u + Q.length, -1),
          changes: { from: u, to: S, insert: Q }
        };
      }
    }
    return { range: a };
  });
  return l.changes.empty ? !1 : (i.dispatch([
    s,
    o.update(l, {
      userEvent: "input.complete",
      scrollIntoView: !0
    })
  ]), !0);
}), R$ = Vt({
  String: p.string,
  Number: p.number,
  "True False": p.bool,
  PropertyName: p.propertyName,
  Null: p.null,
  ", :": p.separator,
  "[ ]": p.squareBracket,
  "{ }": p.brace
}), A$ = dt.deserialize({
  version: 14,
  states: "$bOVQPOOOOQO'#Cb'#CbOnQPO'#CeOvQPO'#ClOOQO'#Cr'#CrQOQPOOOOQO'#Cg'#CgO}QPO'#CfO!SQPO'#CtOOQO,59P,59PO![QPO,59PO!aQPO'#CuOOQO,59W,59WO!iQPO,59WOVQPO,59QOqQPO'#CmO!nQPO,59`OOQO1G.k1G.kOVQPO'#CnO!vQPO,59aOOQO1G.r1G.rOOQO1G.l1G.lOOQO,59X,59XOOQO-E6k-E6kOOQO,59Y,59YOOQO-E6l-E6l",
  stateData: "#O~OeOS~OQSORSOSSOTSOWQO_ROgPO~OVXOgUO~O^[O~PVO[^O~O]_OVhX~OVaO~O]bO^iX~O^dO~O]_OVha~O]bO^ia~O",
  goto: "!kjPPPPPPkPPkqwPPPPk{!RPPP!XP!e!hXSOR^bQWQRf_TVQ_Q`WRg`QcZRicQTOQZRQe^RhbRYQR]R",
  nodeNames: "⚠ JsonText True False Null Number String } { Object Property PropertyName : , ] [ Array",
  maxTerm: 25,
  nodeProps: [
    ["isolate", -2, 6, 11, ""],
    ["openedBy", 7, "{", 14, "["],
    ["closedBy", 8, "}", 15, "]"]
  ],
  propSources: [R$],
  skippedNodes: [0],
  repeatNodeCount: 2,
  tokenData: "(|~RaXY!WYZ!W]^!Wpq!Wrs!]|}$u}!O$z!Q!R%T!R![&c![!]&t!}#O&y#P#Q'O#Y#Z'T#b#c'r#h#i(Z#o#p(r#q#r(w~!]Oe~~!`Wpq!]qr!]rs!xs#O!]#O#P!}#P;'S!];'S;=`$o<%lO!]~!}Og~~#QXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#m~#pR!Q![#y!c!i#y#T#Z#y~#|R!Q![$V!c!i$V#T#Z$V~$YR!Q![$c!c!i$c#T#Z$c~$fR!Q![!]!c!i!]#T#Z!]~$rP;=`<%l!]~$zO]~~$}Q!Q!R%T!R![&c~%YRT~!O!P%c!g!h%w#X#Y%w~%fP!Q![%i~%nRT~!Q![%i!g!h%w#X#Y%w~%zR{|&T}!O&T!Q![&Z~&WP!Q![&Z~&`PT~!Q![&Z~&hST~!O!P%c!Q![&c!g!h%w#X#Y%w~&yO[~~'OO_~~'TO^~~'WP#T#U'Z~'^P#`#a'a~'dP#g#h'g~'jP#X#Y'm~'rOR~~'uP#i#j'x~'{P#`#a(O~(RP#`#a(U~(ZOS~~(^P#f#g(a~(dP#i#j(g~(jP#X#Y(m~(rOQ~~(wOW~~(|OV~",
  tokenizers: [0],
  topRules: { JsonText: [0, 1] },
  tokenPrec: 0
}), M$ = /* @__PURE__ */ ut.define({
  name: "json",
  parser: /* @__PURE__ */ A$.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        Object: /* @__PURE__ */ si({ except: /^\s*\}/ }),
        Array: /* @__PURE__ */ si({ except: /^\s*\]/ })
      }),
      /* @__PURE__ */ Et.add({
        "Object Array": us
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    indentOnInput: /^\s*[\}\]]$/
  }
});
function W$() {
  return new fi(M$);
}
const q$ = 36, Jc = 1, Y$ = 2, ui = 3, co = 4, _$ = 5, j$ = 6, z$ = 7, V$ = 8, D$ = 9, E$ = 10, L$ = 11, B$ = 12, I$ = 13, G$ = 14, N$ = 15, U$ = 16, F$ = 17, ef = 18, H$ = 19, ip = 20, np = 21, tf = 22, K$ = 23, J$ = 24;
function gl(i) {
  return i >= 65 && i <= 90 || i >= 97 && i <= 122 || i >= 48 && i <= 57;
}
function eP(i) {
  return i >= 48 && i <= 57 || i >= 97 && i <= 102 || i >= 65 && i <= 70;
}
function Ht(i, e, t) {
  for (let n = !1; ; ) {
    if (i.next < 0)
      return;
    if (i.next == e && !n) {
      i.advance();
      return;
    }
    n = t && !n && i.next == 92, i.advance();
  }
}
function tP(i, e) {
  e: for (; ; ) {
    if (i.next < 0)
      return;
    if (i.next == 36) {
      i.advance();
      for (let t = 0; t < e.length; t++) {
        if (i.next != e.charCodeAt(t))
          continue e;
        i.advance();
      }
      if (i.next == 36) {
        i.advance();
        return;
      }
    } else
      i.advance();
  }
}
function iP(i, e) {
  let t = "[{<(".indexOf(String.fromCharCode(e)), n = t < 0 ? e : "]}>)".charCodeAt(t);
  for (; ; ) {
    if (i.next < 0)
      return;
    if (i.next == n && i.peek(1) == 39) {
      i.advance(2);
      return;
    }
    i.advance();
  }
}
function Sl(i, e) {
  for (; !(i.next != 95 && !gl(i.next)); )
    e != null && (e += String.fromCharCode(i.next)), i.advance();
  return e;
}
function nP(i) {
  if (i.next == 39 || i.next == 34 || i.next == 96) {
    let e = i.next;
    i.advance(), Ht(i, e, !1);
  } else
    Sl(i);
}
function nf(i, e) {
  for (; i.next == 48 || i.next == 49; )
    i.advance();
  e && i.next == e && i.advance();
}
function rf(i, e) {
  for (; ; ) {
    if (i.next == 46) {
      if (e)
        break;
      e = !0;
    } else if (i.next < 48 || i.next > 57)
      break;
    i.advance();
  }
  if (i.next == 69 || i.next == 101)
    for (i.advance(), (i.next == 43 || i.next == 45) && i.advance(); i.next >= 48 && i.next <= 57; )
      i.advance();
}
function sf(i) {
  for (; !(i.next < 0 || i.next == 10); )
    i.advance();
}
function Ut(i, e) {
  for (let t = 0; t < e.length; t++)
    if (e.charCodeAt(t) == i)
      return !0;
  return !1;
}
const fo = ` 	\r
`;
function rp(i, e, t) {
  let n = /* @__PURE__ */ Object.create(null);
  n.true = n.false = _$, n.null = n.unknown = j$;
  for (let r of i.split(" "))
    r && (n[r] = ip);
  for (let r of e.split(" "))
    r && (n[r] = np);
  for (let r of (t || "").split(" "))
    r && (n[r] = J$);
  return n;
}
const rP = "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ", sP = "absolute action add after all allocate alter and any are as asc assertion at authorization before begin between both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ", Ql = {
  backslashEscapes: !1,
  hashComments: !1,
  spaceAfterDashes: !1,
  slashComments: !1,
  doubleQuotedStrings: !1,
  doubleDollarQuotedStrings: !1,
  unquotedBitLiterals: !1,
  treatBitsAsBytes: !1,
  charSetCasts: !1,
  plsqlQuotingMechanism: !1,
  operatorChars: "*+-%<>!=&|~^/",
  specialVar: "?",
  identifierQuotes: '"',
  caseInsensitiveIdentifiers: !1,
  words: /* @__PURE__ */ rp(sP, rP)
};
function oP(i, e, t, n) {
  let r = {};
  for (let s in Ql)
    r[s] = (i.hasOwnProperty(s) ? i : Ql)[s];
  return e && (r.words = rp(e, t || "", n)), r;
}
function sp(i) {
  return new oe((e) => {
    var t;
    let { next: n } = e;
    if (e.advance(), Ut(n, fo)) {
      for (; Ut(e.next, fo); )
        e.advance();
      e.acceptToken(q$);
    } else if (n == 36 && i.doubleDollarQuotedStrings) {
      let r = Sl(e, "");
      e.next == 36 && (e.advance(), tP(e, r), e.acceptToken(ui));
    } else if (n == 39 || n == 34 && i.doubleQuotedStrings)
      Ht(e, n, i.backslashEscapes), e.acceptToken(ui);
    else if (n == 35 && i.hashComments || n == 47 && e.next == 47 && i.slashComments)
      sf(e), e.acceptToken(Jc);
    else if (n == 45 && e.next == 45 && (!i.spaceAfterDashes || e.peek(1) == 32))
      sf(e), e.acceptToken(Jc);
    else if (n == 47 && e.next == 42) {
      e.advance();
      for (let r = 1; ; ) {
        let s = e.next;
        if (e.next < 0)
          break;
        if (e.advance(), s == 42 && e.next == 47) {
          if (r--, e.advance(), !r)
            break;
        } else s == 47 && e.next == 42 && (r++, e.advance());
      }
      e.acceptToken(Y$);
    } else if ((n == 101 || n == 69) && e.next == 39)
      e.advance(), Ht(e, 39, !0), e.acceptToken(ui);
    else if ((n == 110 || n == 78) && e.next == 39 && i.charSetCasts)
      e.advance(), Ht(e, 39, i.backslashEscapes), e.acceptToken(ui);
    else if (n == 95 && i.charSetCasts)
      for (let r = 0; ; r++) {
        if (e.next == 39 && r > 1) {
          e.advance(), Ht(e, 39, i.backslashEscapes), e.acceptToken(ui);
          break;
        }
        if (!gl(e.next))
          break;
        e.advance();
      }
    else if (i.plsqlQuotingMechanism && (n == 113 || n == 81) && e.next == 39 && e.peek(1) > 0 && !Ut(e.peek(1), fo)) {
      let r = e.peek(1);
      e.advance(2), iP(e, r), e.acceptToken(ui);
    } else if (Ut(n, i.identifierQuotes)) {
      const r = n == 91 ? 93 : n;
      Ht(e, r, !1), e.acceptToken(H$);
    } else if (n == 40)
      e.acceptToken(z$);
    else if (n == 41)
      e.acceptToken(V$);
    else if (n == 123)
      e.acceptToken(D$);
    else if (n == 125)
      e.acceptToken(E$);
    else if (n == 91)
      e.acceptToken(L$);
    else if (n == 93)
      e.acceptToken(B$);
    else if (n == 59)
      e.acceptToken(I$);
    else if (i.unquotedBitLiterals && n == 48 && e.next == 98)
      e.advance(), nf(e), e.acceptToken(tf);
    else if ((n == 98 || n == 66) && (e.next == 39 || e.next == 34)) {
      const r = e.next;
      e.advance(), i.treatBitsAsBytes ? (Ht(e, r, i.backslashEscapes), e.acceptToken(K$)) : (nf(e, r), e.acceptToken(tf));
    } else if (n == 48 && (e.next == 120 || e.next == 88) || (n == 120 || n == 88) && e.next == 39) {
      let r = e.next == 39;
      for (e.advance(); eP(e.next); )
        e.advance();
      r && e.next == 39 && e.advance(), e.acceptToken(co);
    } else if (n == 46 && e.next >= 48 && e.next <= 57)
      rf(e, !0), e.acceptToken(co);
    else if (n == 46)
      e.acceptToken(G$);
    else if (n >= 48 && n <= 57)
      rf(e, !1), e.acceptToken(co);
    else if (Ut(n, i.operatorChars)) {
      for (; Ut(e.next, i.operatorChars); )
        e.advance();
      e.acceptToken(N$);
    } else if (Ut(n, i.specialVar))
      e.next == n && e.advance(), nP(e), e.acceptToken(F$);
    else if (n == 58 || n == 44)
      e.acceptToken(U$);
    else if (gl(n)) {
      let r = Sl(e, String.fromCharCode(n));
      e.acceptToken(e.next == 46 || e.peek(-r.length - 1) == 46 ? ef : (t = i.words[r.toLowerCase()]) !== null && t !== void 0 ? t : ef);
    }
  });
}
const op = /* @__PURE__ */ sp(Ql), lP = /* @__PURE__ */ dt.deserialize({
  version: 14,
  states: "%vQ]QQOOO#wQRO'#DSO$OQQO'#CwO%eQQO'#CxO%lQQO'#CyO%sQQO'#CzOOQQ'#DS'#DSOOQQ'#C}'#C}O'UQRO'#C{OOQQ'#Cv'#CvOOQQ'#C|'#C|Q]QQOOQOQQOOO'`QQO'#DOO(xQRO,59cO)PQQO,59cO)UQQO'#DSOOQQ,59d,59dO)cQQO,59dOOQQ,59e,59eO)jQQO,59eOOQQ,59f,59fO)qQQO,59fOOQQ-E6{-E6{OOQQ,59b,59bOOQQ-E6z-E6zOOQQ,59j,59jOOQQ-E6|-E6|O+VQRO1G.}O+^QQO,59cOOQQ1G/O1G/OOOQQ1G/P1G/POOQQ1G/Q1G/QP+kQQO'#C}O+rQQO1G.}O)PQQO,59cO,PQQO'#Cw",
  stateData: ",[~OtOSPOSQOS~ORUOSUOTUOUUOVROXSOZTO]XO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O^]ORvXSvXTvXUvXVvXXvXZvX]vX_vX`vXavXbvXcvXdvXevXfvXgvXhvX~OsvX~P!jOa_Ob_Oc_O~ORUOSUOTUOUUOVROXSOZTO^tO_UO`UOa`Ob`Oc`OdUOeUOfUOgUOhUO~OWaO~P$ZOYcO~P$ZO[eO~P$ZORUOSUOTUOUUOVROXSOZTO^QO_UO`UOaPObPOcPOdUOeUOfUOgUOhUO~O]hOsoX~P%zOajObjOcjO~O^]ORkaSkaTkaUkaVkaXkaZka]ka_ka`kaakabkackadkaekafkagkahka~Oska~P'kO^]O~OWvXYvX[vX~P!jOWnO~P$ZOYoO~P$ZO[pO~P$ZO^]ORkiSkiTkiUkiVkiXkiZki]ki_ki`kiakibkickidkiekifkigkihki~Oski~P)xOWkaYka[ka~P'kO]hO~P$ZOWkiYki[ki~P)xOasObsOcsO~O",
  goto: "#hwPPPPPPPPPPPPPPPPPPPPPPPPPPx||||!Y!^!d!xPPP#[TYOZeUORSTWZbdfqT[OZQZORiZSWOZQbRQdSQfTZgWbdfqQ^PWk^lmrQl_Qm`RrseVORSTWZbdfq",
  nodeNames: "⚠ LineComment BlockComment String Number Bool Null ( ) { } [ ] ; . Operator Punctuation SpecialVar Identifier QuotedIdentifier Keyword Type Bits Bytes Builtin Script Statement CompositeIdentifier Parens Braces Brackets Statement",
  maxTerm: 38,
  nodeProps: [
    ["isolate", -4, 1, 2, 3, 19, ""]
  ],
  skippedNodes: [0, 1, 2],
  repeatNodeCount: 3,
  tokenData: "RORO",
  tokenizers: [0, op],
  topRules: { Script: [0, 25] },
  tokenPrec: 0
});
function bl(i) {
  let e = i.cursor().moveTo(i.from, -1);
  for (; /Comment/.test(e.name); )
    e.moveTo(e.from, -1);
  return e.node;
}
function Zn(i, e) {
  let t = i.sliceString(e.from, e.to), n = /^([`'"\[])(.*)([`'"\]])$/.exec(t);
  return n ? n[2] : t;
}
function is(i) {
  return i && (i.name == "Identifier" || i.name == "QuotedIdentifier");
}
function aP(i, e) {
  if (e.name == "CompositeIdentifier") {
    let t = [];
    for (let n = e.firstChild; n; n = n.nextSibling)
      is(n) && t.push(Zn(i, n));
    return t;
  }
  return [Zn(i, e)];
}
function of(i, e) {
  for (let t = []; ; ) {
    if (!e || e.name != ".")
      return t;
    let n = bl(e);
    if (!is(n))
      return t;
    t.unshift(Zn(i, n)), e = bl(n);
  }
}
function hP(i, e) {
  let t = H(i).resolveInner(e, -1), n = fP(i.doc, t);
  return t.name == "Identifier" || t.name == "QuotedIdentifier" || t.name == "Keyword" ? {
    from: t.from,
    quoted: t.name == "QuotedIdentifier" ? i.doc.sliceString(t.from, t.from + 1) : null,
    parents: of(i.doc, bl(t)),
    aliases: n
  } : t.name == "." ? { from: e, quoted: null, parents: of(i.doc, t), aliases: n } : { from: e, quoted: null, parents: [], empty: !0, aliases: n };
}
const cP = /* @__PURE__ */ new Set(/* @__PURE__ */ "where group having order union intersect except all distinct limit offset fetch for".split(" "));
function fP(i, e) {
  let t;
  for (let r = e; !t; r = r.parent) {
    if (!r)
      return null;
    r.name == "Statement" && (t = r);
  }
  let n = null;
  for (let r = t.firstChild, s = !1, o = null; r; r = r.nextSibling) {
    let l = r.name == "Keyword" ? i.sliceString(r.from, r.to).toLowerCase() : null, a = null;
    if (!s)
      s = l == "from";
    else if (l == "as" && o && is(r.nextSibling))
      a = Zn(i, r.nextSibling);
    else {
      if (l && cP.has(l))
        break;
      o && is(r) && (a = Zn(i, r));
    }
    a && (n || (n = /* @__PURE__ */ Object.create(null)), n[a] = aP(i, o)), o = /Identifier$/.test(r.name) ? r : null;
  }
  return n;
}
function OP(i, e, t) {
  return t.map((n) => ({ ...n, label: n.label[0] == i ? n.label : i + n.label + e, apply: void 0 }));
}
const uP = /^\w*$/, dP = /^[`'"\[]?\w*[`'"\]]?$/;
function lf(i) {
  return i.self && typeof i.self.label == "string";
}
class $a {
  constructor(e, t) {
    this.idQuote = e, this.idCaseInsensitive = t, this.list = [], this.children = void 0;
  }
  child(e) {
    let t = this.children || (this.children = /* @__PURE__ */ Object.create(null)), n = t[e];
    return n || (e && !this.list.some((r) => r.label == e) && this.list.push(af(e, "type", this.idQuote, this.idCaseInsensitive)), t[e] = new $a(this.idQuote, this.idCaseInsensitive));
  }
  maybeChild(e) {
    return this.children ? this.children[e] : null;
  }
  addCompletion(e) {
    let t = this.list.findIndex((n) => n.label == e.label);
    t > -1 ? this.list[t] = e : this.list.push(e);
  }
  addCompletions(e) {
    for (let t of e)
      this.addCompletion(typeof t == "string" ? af(t, "property", this.idQuote, this.idCaseInsensitive) : t);
  }
  addNamespace(e) {
    Array.isArray(e) ? this.addCompletions(e) : lf(e) ? this.addNamespace(e.children) : this.addNamespaceObject(e);
  }
  addNamespaceObject(e) {
    for (let t of Object.keys(e)) {
      let n = e[t], r = null, s = t.replace(/\\?\./g, (l) => l == "." ? "\0" : l).split("\0"), o = this;
      lf(n) && (r = n.self, n = n.children);
      for (let l = 0; l < s.length; l++)
        r && l == s.length - 1 && o.addCompletion(r), o = o.child(s[l].replace(/\\\./g, "."));
      o.addNamespace(n);
    }
  }
}
function af(i, e, t, n) {
  return new RegExp("^[a-z_][a-z_\\d]*$", n ? "i" : "").test(i) ? { label: i, type: e } : { label: i, type: e, apply: t + i + lp(t) };
}
function lp(i) {
  return i === "[" ? "]" : i;
}
function pP(i, e, t, n, r, s) {
  var o;
  let l = ((o = s?.spec.identifierQuotes) === null || o === void 0 ? void 0 : o[0]) || '"', a = new $a(l, !!s?.spec.caseInsensitiveIdentifiers), h = r ? a.child(r) : null;
  return a.addNamespace(i), e && (h || a).addCompletions(e), t && a.addCompletions(t), h && a.addCompletions(h.list), n && a.addCompletions((h || a).child(n).list), (c) => {
    let { parents: f, from: O, quoted: u, empty: d, aliases: m } = hP(c.state, c.pos);
    if (d && !c.explicit)
      return null;
    m && f.length == 1 && (f = m[f[0]] || f);
    let g = a;
    for (let Q of f) {
      for (; !g.children || !g.children[Q]; )
        if (g == a && h)
          g = h;
        else if (g == h && n)
          g = g.child(n);
        else
          return null;
      let y = g.maybeChild(Q);
      if (!y)
        return null;
      g = y;
    }
    let S = g.list;
    if (g == a && m && (S = S.concat(Object.keys(m).map((Q) => ({ label: Q, type: "constant" })))), u) {
      let Q = u[0], y = lp(Q), w = c.state.sliceDoc(c.pos, c.pos + 1) == y;
      return {
        from: O,
        to: w ? c.pos + 1 : void 0,
        options: OP(Q, y, S),
        validFor: dP
      };
    } else
      return {
        from: O,
        options: S,
        validFor: uP
      };
  };
}
function mP(i) {
  return i == np ? "type" : i == ip ? "keyword" : "variable";
}
function gP(i, e, t) {
  let n = Object.keys(i).map((r) => t(e ? r.toUpperCase() : r, mP(i[r])));
  return rd(["QuotedIdentifier", "String", "LineComment", "BlockComment", "."], aa(n));
}
let SP = /* @__PURE__ */ lP.configure({
  props: [
    /* @__PURE__ */ Dt.add({
      Statement: /* @__PURE__ */ si()
    }),
    /* @__PURE__ */ Et.add({
      Statement(i, e) {
        return { from: Math.min(i.from + 100, e.doc.lineAt(i.from).to), to: i.to };
      },
      BlockComment(i) {
        return { from: i.from + 2, to: i.to - 2 };
      }
    }),
    /* @__PURE__ */ Vt({
      Keyword: p.keyword,
      Type: p.typeName,
      Builtin: /* @__PURE__ */ p.standard(p.name),
      Bits: p.number,
      Bytes: p.string,
      Bool: p.bool,
      Null: p.null,
      Number: p.number,
      String: p.string,
      Identifier: p.name,
      QuotedIdentifier: /* @__PURE__ */ p.special(p.string),
      SpecialVar: /* @__PURE__ */ p.special(p.name),
      LineComment: p.lineComment,
      BlockComment: p.blockComment,
      Operator: p.operator,
      "Semi Punctuation": p.punctuation,
      "( )": p.paren,
      "{ }": p.brace,
      "[ ]": p.squareBracket
    })
  ]
});
class ns {
  constructor(e, t, n) {
    this.dialect = e, this.language = t, this.spec = n;
  }
  /**
  Returns the language for this dialect as an extension.
  */
  get extension() {
    return this.language.extension;
  }
  /**
  Reconfigure the parser used by this dialect. Returns a new
  dialect object.
  */
  configureLanguage(e, t) {
    return new ns(this.dialect, this.language.configure(e, t), this.spec);
  }
  /**
  Define a new dialect.
  */
  static define(e) {
    let t = oP(e, e.keywords, e.types, e.builtin), n = ut.define({
      name: "sql",
      parser: SP.configure({
        tokenizers: [{ from: op, to: sp(t) }]
      }),
      languageData: {
        commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
      }
    });
    return new ns(t, n, e);
  }
}
function QP(i, e) {
  return { label: i, type: e, boost: -1 };
}
function bP(i, e = !1, t) {
  return gP(i.dialect.words, e, t || QP);
}
function yP(i) {
  return i.schema ? pP(i.schema, i.tables, i.schemas, i.defaultTable, i.defaultSchema, i.dialect || Pa) : () => null;
}
function xP(i) {
  return i.schema ? (i.dialect || Pa).language.data.of({
    autocomplete: yP(i)
  }) : [];
}
function $P(i = {}) {
  let e = i.dialect || Pa;
  return new fi(e.language, [
    xP(i),
    e.language.data.of({
      autocomplete: bP(e, i.upperCaseKeywords, i.keywordCompletion)
    })
  ]);
}
const Pa = /* @__PURE__ */ ns.define({}), yl = 1, PP = 2, kP = 3, wP = 4, vP = 5, TP = 36, CP = 37, XP = 38, ZP = 11, RP = 13;
function AP(i) {
  return i == 45 || i == 46 || i == 58 || i >= 65 && i <= 90 || i == 95 || i >= 97 && i <= 122 || i >= 161;
}
function MP(i) {
  return i == 9 || i == 10 || i == 13 || i == 32;
}
let hf = null, cf = null, ff = 0;
function xl(i, e) {
  let t = i.pos + e;
  if (cf == i && ff == t) return hf;
  for (; MP(i.peek(e)); ) e++;
  let n = "";
  for (; ; ) {
    let r = i.peek(e);
    if (!AP(r)) break;
    n += String.fromCharCode(r), e++;
  }
  return cf = i, ff = t, hf = n || null;
}
function Of(i, e) {
  this.name = i, this.parent = e;
}
const WP = new bs({
  start: null,
  shift(i, e, t, n) {
    return e == yl ? new Of(xl(n, 1) || "", i) : i;
  },
  reduce(i, e) {
    return e == ZP && i ? i.parent : i;
  },
  reuse(i, e, t, n) {
    let r = e.type.id;
    return r == yl || r == RP ? new Of(xl(n, 1) || "", i) : i;
  },
  strict: !1
}), qP = new oe((i, e) => {
  if (i.next == 60) {
    if (i.advance(), i.next == 47) {
      i.advance();
      let t = xl(i, 0);
      if (!t) return i.acceptToken(vP);
      if (e.context && t == e.context.name) return i.acceptToken(PP);
      for (let n = e.context; n; n = n.parent) if (n.name == t) return i.acceptToken(kP, -2);
      i.acceptToken(wP);
    } else if (i.next != 33 && i.next != 63)
      return i.acceptToken(yl);
  }
}, { contextual: !0 });
function ka(i, e) {
  return new oe((t) => {
    let n = 0, r = e.charCodeAt(0);
    e: for (; !(t.next < 0); t.advance(), n++)
      if (t.next == r) {
        for (let s = 1; s < e.length; s++)
          if (t.peek(s) != e.charCodeAt(s)) continue e;
        break;
      }
    n && t.acceptToken(i);
  });
}
const YP = ka(TP, "-->"), _P = ka(CP, "?>"), jP = ka(XP, "]]>"), zP = Vt({
  Text: p.content,
  "StartTag StartCloseTag EndTag SelfCloseEndTag": p.angleBracket,
  TagName: p.tagName,
  "MismatchedCloseTag/TagName": [p.tagName, p.invalid],
  AttributeName: p.attributeName,
  AttributeValue: p.attributeValue,
  Is: p.definitionOperator,
  "EntityReference CharacterReference": p.character,
  Comment: p.blockComment,
  ProcessingInst: p.processingInstruction,
  DoctypeDecl: p.documentMeta,
  Cdata: p.special(p.string)
}), VP = dt.deserialize({
  version: 14,
  states: ",lOQOaOOOrOxO'#CfOzOpO'#CiO!tOaO'#CgOOOP'#Cg'#CgO!{OrO'#CrO#TOtO'#CsO#]OpO'#CtOOOP'#DT'#DTOOOP'#Cv'#CvQQOaOOOOOW'#Cw'#CwO#eOxO,59QOOOP,59Q,59QOOOO'#Cx'#CxO#mOpO,59TO#uO!bO,59TOOOP'#C|'#C|O$TOaO,59RO$[OpO'#CoOOOP,59R,59ROOOQ'#C}'#C}O$dOrO,59^OOOP,59^,59^OOOS'#DO'#DOO$lOtO,59_OOOP,59_,59_O$tOpO,59`O$|OpO,59`OOOP-E6t-E6tOOOW-E6u-E6uOOOP1G.l1G.lOOOO-E6v-E6vO%UO!bO1G.oO%UO!bO1G.oO%dOpO'#CkO%lO!bO'#CyO%zO!bO1G.oOOOP1G.o1G.oOOOP1G.w1G.wOOOP-E6z-E6zOOOP1G.m1G.mO&VOpO,59ZO&_OpO,59ZOOOQ-E6{-E6{OOOP1G.x1G.xOOOS-E6|-E6|OOOP1G.y1G.yO&gOpO1G.zO&gOpO1G.zOOOP1G.z1G.zO&oO!bO7+$ZO&}O!bO7+$ZOOOP7+$Z7+$ZOOOP7+$c7+$cO'YOpO,59VO'bOpO,59VO'mO!bO,59eOOOO-E6w-E6wO'{OpO1G.uO'{OpO1G.uOOOP1G.u1G.uO(TOpO7+$fOOOP7+$f7+$fO(]O!bO<<GuOOOP<<Gu<<GuOOOP<<G}<<G}O'bOpO1G.qO'bOpO1G.qO(hO#tO'#CnO(vO&jO'#CnOOOO1G.q1G.qO)UOpO7+$aOOOP7+$a7+$aOOOP<<HQ<<HQOOOPAN=aAN=aOOOPAN=iAN=iO'bOpO7+$]OOOO7+$]7+$]OOOO'#Cz'#CzO)^O#tO,59YOOOO,59Y,59YOOOO'#C{'#C{O)lO&jO,59YOOOP<<G{<<G{OOOO<<Gw<<GwOOOO-E6x-E6xOOOO1G.t1G.tOOOO-E6y-E6y",
  stateData: ")z~OPQOSVOTWOVWOWWOXWOiXOyPO!QTO!SUO~OvZOx]O~O^`Oz^O~OPQOQcOSVOTWOVWOWWOXWOyPO!QTO!SUO~ORdO~P!SOteO!PgO~OuhO!RjO~O^lOz^O~OvZOxoO~O^qOz^O~O[vO`sOdwOz^O~ORyO~P!SO^{Oz^O~OteO!P}O~OuhO!R!PO~O^!QOz^O~O[!SOz^O~O[!VO`sOd!WOz^O~Oa!YOz^O~Oz^O[mX`mXdmX~O[!VO`sOd!WO~O^!]Oz^O~O[!_Oz^O~O[!aOz^O~O[!cO`sOd!dOz^O~O[!cO`sOd!dO~Oa!eOz^O~Oz^O{!gO}!hO~Oz^O[ma`madma~O[!kOz^O~O[!lOz^O~O[!mO`sOd!nO~OW!qOX!qO{!sO|!qO~OW!tOX!tO}!sO!O!tO~O[!vOz^O~OW!qOX!qO{!yO|!qO~OW!tOX!tO}!yO!O!tO~O",
  goto: "%cxPPPPPPPPPPyyP!PP!VPP!`!jP!pyyyP!v!|#S$[$k$q$w$}%TPPPP%ZXWORYbXRORYb_t`qru!T!U!bQ!i!YS!p!e!fR!w!oQdRRybXSORYbQYORmYQ[PRn[Q_QQkVjp_krz!R!T!X!Z!^!`!f!j!oQr`QzcQ!RlQ!TqQ!XsQ!ZtQ!^{Q!`!QQ!f!YQ!j!]R!o!eQu`S!UqrU![u!U!bR!b!TQ!r!gR!x!rQ!u!hR!z!uQbRRxbQfTR|fQiUR!OiSXOYTaRb",
  nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl",
  maxTerm: 50,
  context: WP,
  nodeProps: [
    ["closedBy", 1, "SelfCloseEndTag EndTag", 13, "CloseTag MissingCloseTag"],
    ["openedBy", 12, "StartTag StartCloseTag", 19, "OpenTag", 20, "StartTag"],
    ["isolate", -6, 13, 18, 19, 21, 22, 24, ""]
  ],
  propSources: [zP],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "!)v~R!YOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs*vsv$qvw+fwx/ix}$q}!O0[!O!P$q!P!Q2z!Q![$q![!]4n!]!^$q!^!_8U!_!`!#t!`!a!$l!a!b!%d!b!c$q!c!}4n!}#P$q#P#Q!'W#Q#R$q#R#S4n#S#T$q#T#o4n#o%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U$q4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qi$zXVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qa%nVVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%gP&YTVPOv&Tw!^&T!_;'S&T;'S;=`&i<%lO&TP&lP;=`<%l&T`&tS!O`Ov&ox;'S&o;'S;=`'Q<%lO&o`'TP;=`<%l&oa'ZP;=`<%l%gX'eWVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^W(ST|WOr'}sv'}w;'S'};'S;=`(c<%lO'}W(fP;=`<%l'}X(lP;=`<%l'^h(vV|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oh)`P;=`<%l(oi)fP;=`<%l$qo)t`VP|W!O`zUOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk+PV{YVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%g~+iast,n![!]-r!c!}-r#R#S-r#T#o-r%W%o-r%p&a-r&b1p-r4U4d-r4e$IS-r$I`$Ib-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~,qQ!Q![,w#l#m-V~,zQ!Q![,w!]!^-Q~-VOX~~-YR!Q![-c!c!i-c#T#Z-c~-fS!Q![-c!]!^-Q!c!i-c#T#Z-c~-ug}!O-r!O!P-r!Q![-r![!]-r!]!^/^!c!}-r#R#S-r#T#o-r$}%O-r%W%o-r%p&a-r&b1p-r1p4U-r4U4d-r4e$IS-r$I`$Ib-r$Je$Jg-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~/cOW~~/fP;=`<%l-rk/rW}bVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^k0eZVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O1W!O!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk1aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a2S!a;'S$q;'S;=`)c<%lO$qk2_X!PQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qm3TZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a3v!a;'S$q;'S;=`)c<%lO$qm4RXdSVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo4{!P`S^QVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O4n!O!P4n!P!Q$q!Q![4n![!]4n!]!^$q!^!_(o!_!c$q!c!}4n!}#R$q#R#S4n#S#T$q#T#o4n#o$}$q$}%O4n%O%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U4n4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Je$q$Je$Jg4n$Jg$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qo8RP;=`<%l4ni8]Y|W!O`Oq(oqr8{rs&osv(owx'}x!a(o!a!b!#U!b;'S(o;'S;=`)]<%lO(oi9S_|W!O`Or(ors&osv(owx'}x}(o}!O:R!O!f(o!f!g;e!g!}(o!}#ODh#O#W(o#W#XLp#X;'S(o;'S;=`)]<%lO(oi:YX|W!O`Or(ors&osv(owx'}x}(o}!O:u!O;'S(o;'S;=`)]<%lO(oi;OV!QP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oi;lX|W!O`Or(ors&osv(owx'}x!q(o!q!r<X!r;'S(o;'S;=`)]<%lO(oi<`X|W!O`Or(ors&osv(owx'}x!e(o!e!f<{!f;'S(o;'S;=`)]<%lO(oi=SX|W!O`Or(ors&osv(owx'}x!v(o!v!w=o!w;'S(o;'S;=`)]<%lO(oi=vX|W!O`Or(ors&osv(owx'}x!{(o!{!|>c!|;'S(o;'S;=`)]<%lO(oi>jX|W!O`Or(ors&osv(owx'}x!r(o!r!s?V!s;'S(o;'S;=`)]<%lO(oi?^X|W!O`Or(ors&osv(owx'}x!g(o!g!h?y!h;'S(o;'S;=`)]<%lO(oi@QY|W!O`Or?yrs@psv?yvwA[wxBdx!`?y!`!aCr!a;'S?y;'S;=`Db<%lO?ya@uV!O`Ov@pvxA[x!`@p!`!aAy!a;'S@p;'S;=`B^<%lO@pPA_TO!`A[!`!aAn!a;'SA[;'S;=`As<%lOA[PAsOiPPAvP;=`<%lA[aBQSiP!O`Ov&ox;'S&o;'S;=`'Q<%lO&oaBaP;=`<%l@pXBiX|WOrBdrsA[svBdvwA[w!`Bd!`!aCU!a;'SBd;'S;=`Cl<%lOBdXC]TiP|WOr'}sv'}w;'S'};'S;=`(c<%lO'}XCoP;=`<%lBdiC{ViP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiDeP;=`<%l?yiDoZ|W!O`Or(ors&osv(owx'}x!e(o!e!fEb!f#V(o#V#WIr#W;'S(o;'S;=`)]<%lO(oiEiX|W!O`Or(ors&osv(owx'}x!f(o!f!gFU!g;'S(o;'S;=`)]<%lO(oiF]X|W!O`Or(ors&osv(owx'}x!c(o!c!dFx!d;'S(o;'S;=`)]<%lO(oiGPX|W!O`Or(ors&osv(owx'}x!v(o!v!wGl!w;'S(o;'S;=`)]<%lO(oiGsX|W!O`Or(ors&osv(owx'}x!c(o!c!dH`!d;'S(o;'S;=`)]<%lO(oiHgX|W!O`Or(ors&osv(owx'}x!}(o!}#OIS#O;'S(o;'S;=`)]<%lO(oiI]V|W!O`yPOr(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiIyX|W!O`Or(ors&osv(owx'}x#W(o#W#XJf#X;'S(o;'S;=`)]<%lO(oiJmX|W!O`Or(ors&osv(owx'}x#T(o#T#UKY#U;'S(o;'S;=`)]<%lO(oiKaX|W!O`Or(ors&osv(owx'}x#h(o#h#iK|#i;'S(o;'S;=`)]<%lO(oiLTX|W!O`Or(ors&osv(owx'}x#T(o#T#UH`#U;'S(o;'S;=`)]<%lO(oiLwX|W!O`Or(ors&osv(owx'}x#c(o#c#dMd#d;'S(o;'S;=`)]<%lO(oiMkX|W!O`Or(ors&osv(owx'}x#V(o#V#WNW#W;'S(o;'S;=`)]<%lO(oiN_X|W!O`Or(ors&osv(owx'}x#h(o#h#iNz#i;'S(o;'S;=`)]<%lO(oi! RX|W!O`Or(ors&osv(owx'}x#m(o#m#n! n#n;'S(o;'S;=`)]<%lO(oi! uX|W!O`Or(ors&osv(owx'}x#d(o#d#e!!b#e;'S(o;'S;=`)]<%lO(oi!!iX|W!O`Or(ors&osv(owx'}x#X(o#X#Y?y#Y;'S(o;'S;=`)]<%lO(oi!#_V!SP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(ok!$PXaQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo!$wX[UVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!%mZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!&`!a;'S$q;'S;=`)c<%lO$qk!&kX!RQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!'aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_#P$q#P#Q!(S#Q;'S$q;'S;=`)c<%lO$qk!(]ZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!)O!a;'S$q;'S;=`)c<%lO$qk!)ZXxQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$q",
  tokenizers: [qP, YP, _P, jP, 0, 1, 2, 3, 4],
  topRules: { Document: [0, 6] },
  tokenPrec: 0
});
function Pr(i, e) {
  let t = e && e.getChild("TagName");
  return t ? i.sliceString(t.from, t.to) : "";
}
function Oo(i, e) {
  let t = e && e.firstChild;
  return !t || t.name != "OpenTag" ? "" : Pr(i, t);
}
function DP(i, e, t) {
  let n = e && e.getChildren("Attribute").find((s) => s.from <= t && s.to >= t), r = n && n.getChild("AttributeName");
  return r ? i.sliceString(r.from, r.to) : "";
}
function uo(i) {
  for (let e = i && i.parent; e; e = e.parent)
    if (e.name == "Element")
      return e;
  return null;
}
function EP(i, e) {
  var t;
  let n = H(i).resolveInner(e, -1), r = null;
  for (let s = n; !r && s.parent; s = s.parent)
    (s.name == "OpenTag" || s.name == "CloseTag" || s.name == "SelfClosingTag" || s.name == "MismatchedCloseTag") && (r = s);
  if (r && (r.to > e || r.lastChild.type.isError)) {
    let s = r.parent;
    if (n.name == "TagName")
      return r.name == "CloseTag" || r.name == "MismatchedCloseTag" ? { type: "closeTag", from: n.from, context: s } : { type: "openTag", from: n.from, context: uo(s) };
    if (n.name == "AttributeName")
      return { type: "attrName", from: n.from, context: r };
    if (n.name == "AttributeValue")
      return { type: "attrValue", from: n.from, context: r };
    let o = n == r || n.name == "Attribute" ? n.childBefore(e) : n;
    return o?.name == "StartTag" ? { type: "openTag", from: e, context: uo(s) } : o?.name == "StartCloseTag" && o.to <= e ? { type: "closeTag", from: e, context: s } : o?.name == "Is" ? { type: "attrValue", from: e, context: r } : o ? { type: "attrName", from: e, context: r } : null;
  } else if (n.name == "StartCloseTag")
    return { type: "closeTag", from: e, context: n.parent };
  for (; n.parent && n.to == e && !(!((t = n.lastChild) === null || t === void 0) && t.type.isError); )
    n = n.parent;
  return n.name == "Element" || n.name == "Text" || n.name == "Document" ? { type: "tag", from: e, context: n.name == "Element" ? n : uo(n) } : null;
}
class LP {
  constructor(e, t, n) {
    this.attrs = t, this.attrValues = n, this.children = [], this.name = e.name, this.completion = Object.assign(Object.assign({ type: "type" }, e.completion || {}), { label: this.name }), this.openCompletion = Object.assign(Object.assign({}, this.completion), { label: "<" + this.name }), this.closeCompletion = Object.assign(Object.assign({}, this.completion), { label: "</" + this.name + ">", boost: 2 }), this.closeNameCompletion = Object.assign(Object.assign({}, this.completion), { label: this.name + ">" }), this.text = e.textContent ? e.textContent.map((r) => ({ label: r, type: "text" })) : [];
  }
}
const po = /^[:\-\.\w\u00b7-\uffff]*$/;
function uf(i) {
  return Object.assign(Object.assign({ type: "property" }, i.completion || {}), { label: i.name });
}
function df(i) {
  return typeof i == "string" ? { label: `"${i}"`, type: "constant" } : /^"/.test(i.label) ? i : Object.assign(Object.assign({}, i), { label: `"${i.label}"` });
}
function BP(i, e) {
  let t = [], n = [], r = /* @__PURE__ */ Object.create(null);
  for (let a of e) {
    let h = uf(a);
    t.push(h), a.global && n.push(h), a.values && (r[a.name] = a.values.map(df));
  }
  let s = [], o = [], l = /* @__PURE__ */ Object.create(null);
  for (let a of i) {
    let h = n, c = r;
    a.attributes && (h = h.concat(a.attributes.map((O) => typeof O == "string" ? t.find((u) => u.label == O) || { label: O, type: "property" } : (O.values && (c == r && (c = Object.create(c)), c[O.name] = O.values.map(df)), uf(O)))));
    let f = new LP(a, h, c);
    l[f.name] = f, s.push(f), a.top && o.push(f);
  }
  o.length || (o = s);
  for (let a = 0; a < s.length; a++) {
    let h = i[a], c = s[a];
    if (h.children)
      for (let f of h.children)
        l[f] && c.children.push(l[f]);
    else
      c.children = s;
  }
  return (a) => {
    var h;
    let { doc: c } = a.state, f = EP(a.state, a.pos);
    if (!f || f.type == "tag" && !a.explicit)
      return null;
    let { type: O, from: u, context: d } = f;
    if (O == "openTag") {
      let m = o, g = Oo(c, d);
      if (g) {
        let S = l[g];
        m = S?.children || s;
      }
      return {
        from: u,
        options: m.map((S) => S.completion),
        validFor: po
      };
    } else if (O == "closeTag") {
      let m = Oo(c, d);
      return m ? {
        from: u,
        to: a.pos + (c.sliceString(a.pos, a.pos + 1) == ">" ? 1 : 0),
        options: [((h = l[m]) === null || h === void 0 ? void 0 : h.closeNameCompletion) || { label: m + ">", type: "type" }],
        validFor: po
      } : null;
    } else if (O == "attrName") {
      let m = l[Pr(c, d)];
      return {
        from: u,
        options: m?.attrs || n,
        validFor: po
      };
    } else if (O == "attrValue") {
      let m = DP(c, d, u);
      if (!m)
        return null;
      let g = l[Pr(c, d)], S = (g?.attrValues || r)[m];
      return !S || !S.length ? null : {
        from: u,
        to: a.pos + (c.sliceString(a.pos, a.pos + 1) == '"' ? 1 : 0),
        options: S,
        validFor: /^"[^"]*"?$/
      };
    } else if (O == "tag") {
      let m = Oo(c, d), g = l[m], S = [], Q = d && d.lastChild;
      m && (!Q || Q.name != "CloseTag" || Pr(c, Q) != m) && S.push(g ? g.closeCompletion : { label: "</" + m + ">", type: "type", boost: 2 });
      let y = S.concat((g?.children || (d ? s : o)).map((w) => w.openCompletion));
      if (d && g?.text.length) {
        let w = d.firstChild;
        w.to > a.pos - 20 && !/\S/.test(a.state.sliceDoc(w.to, a.pos)) && (y = y.concat(g.text));
      }
      return {
        from: u,
        options: y,
        validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/
      };
    } else
      return null;
  };
}
const $l = /* @__PURE__ */ ut.define({
  name: "xml",
  parser: /* @__PURE__ */ VP.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        Element(i) {
          let e = /^\s*<\//.test(i.textAfter);
          return i.lineIndent(i.node.from) + (e ? 0 : i.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(i) {
          return i.column(i.node.from) + i.unit;
        }
      }),
      /* @__PURE__ */ Et.add({
        Element(i) {
          let e = i.firstChild, t = i.lastChild;
          return !e || e.name != "OpenTag" ? null : { from: e.to, to: t.name == "CloseTag" ? t.from : i.to };
        }
      }),
      /* @__PURE__ */ ea.add({
        "OpenTag CloseTag": (i) => i.getChild("TagName")
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/$/
  }
});
function IP(i = {}) {
  let e = [$l.data.of({
    autocomplete: BP(i.elements || [], i.attributes || [])
  })];
  return i.autoCloseTags !== !1 && e.push(GP), new fi($l, e);
}
function pf(i, e, t = i.length) {
  if (!e)
    return "";
  let n = e.firstChild, r = n && n.getChild("TagName");
  return r ? i.sliceString(r.from, Math.min(r.to, t)) : "";
}
const GP = /* @__PURE__ */ k.inputHandler.of((i, e, t, n, r) => {
  if (i.composing || i.state.readOnly || e != t || n != ">" && n != "/" || !$l.isActiveAt(i.state, e, -1))
    return !1;
  let s = r(), { state: o } = s, l = o.changeByRange((a) => {
    var h, c, f;
    let { head: O } = a, u = o.doc.sliceString(O - 1, O) == n, d = H(o).resolveInner(O, -1), m;
    if (u && n == ">" && d.name == "EndTag") {
      let g = d.parent;
      if (((c = (h = g.parent) === null || h === void 0 ? void 0 : h.lastChild) === null || c === void 0 ? void 0 : c.name) != "CloseTag" && (m = pf(o.doc, g.parent, O))) {
        let S = O + (o.doc.sliceString(O, O + 1) === ">" ? 1 : 0), Q = `</${m}>`;
        return { range: a, changes: { from: O, to: S, insert: Q } };
      }
    } else if (u && n == "/" && d.name == "StartCloseTag") {
      let g = d.parent;
      if (d.from == O - 2 && ((f = g.lastChild) === null || f === void 0 ? void 0 : f.name) != "CloseTag" && (m = pf(o.doc, g, O))) {
        let S = O + (o.doc.sliceString(O, O + 1) === ">" ? 1 : 0), Q = `${m}>`;
        return {
          range: b.cursor(O + Q.length, -1),
          changes: { from: O, to: S, insert: Q }
        };
      }
    }
    return { range: a };
  });
  return l.changes.empty ? !1 : (i.dispatch([
    s,
    o.update(l, {
      userEvent: "input.complete",
      scrollIntoView: !0
    })
  ]), !0);
}), gi = 63, mf = 64, NP = 1, UP = 2, ap = 3, FP = 4, hp = 5, HP = 6, KP = 7, cp = 65, JP = 66, ek = 8, tk = 9, ik = 10, nk = 11, rk = 12, fp = 13, sk = 19, ok = 20, lk = 29, ak = 33, hk = 34, ck = 47, fk = 0, wa = 1, Pl = 2, Rn = 3, kl = 4;
class ei {
  constructor(e, t, n) {
    this.parent = e, this.depth = t, this.type = n, this.hash = (e ? e.hash + e.hash << 8 : 0) + t + (t << 4) + n;
  }
}
ei.top = new ei(null, -1, fk);
function On(i, e) {
  for (let t = 0, n = e - i.pos - 1; ; n--, t++) {
    let r = i.peek(n);
    if (wt(r) || r == -1) return t;
  }
}
function wl(i) {
  return i == 32 || i == 9;
}
function wt(i) {
  return i == 10 || i == 13;
}
function Op(i) {
  return wl(i) || wt(i);
}
function ni(i) {
  return i < 0 || Op(i);
}
const Ok = new bs({
  start: ei.top,
  reduce(i, e) {
    return i.type == Rn && (e == ok || e == hk) ? i.parent : i;
  },
  shift(i, e, t, n) {
    if (e == ap)
      return new ei(i, On(n, n.pos), wa);
    if (e == cp || e == hp)
      return new ei(i, On(n, n.pos), Pl);
    if (e == gi)
      return i.parent;
    if (e == sk || e == ak)
      return new ei(i, 0, Rn);
    if (e == fp && i.type == kl)
      return i.parent;
    if (e == ck) {
      let r = /[1-9]/.exec(n.read(n.pos, t.pos));
      if (r) return new ei(i, i.depth + +r[0], kl);
    }
    return i;
  },
  hash(i) {
    return i.hash;
  }
});
function ji(i, e, t = 0) {
  return i.peek(t) == e && i.peek(t + 1) == e && i.peek(t + 2) == e && ni(i.peek(t + 3));
}
const uk = new oe((i, e) => {
  if (i.next == -1 && e.canShift(mf))
    return i.acceptToken(mf);
  let t = i.peek(-1);
  if ((wt(t) || t < 0) && e.context.type != Rn) {
    if (ji(
      i,
      45
      /* '-' */
    ))
      if (e.canShift(gi)) i.acceptToken(gi);
      else return i.acceptToken(NP, 3);
    if (ji(
      i,
      46
      /* '.' */
    ))
      if (e.canShift(gi)) i.acceptToken(gi);
      else return i.acceptToken(UP, 3);
    let n = 0;
    for (; i.next == 32; )
      n++, i.advance();
    (n < e.context.depth || n == e.context.depth && e.context.type == wa && (i.next != 45 || !ni(i.peek(1)))) && // Not blank
    i.next != -1 && !wt(i.next) && i.next != 35 && i.acceptToken(gi, -n);
  }
}, { contextual: !0 }), dk = new oe((i, e) => {
  if (e.context.type == Rn) {
    i.next == 63 && (i.advance(), ni(i.next) && i.acceptToken(KP));
    return;
  }
  if (i.next == 45)
    i.advance(), ni(i.next) && i.acceptToken(e.context.type == wa && e.context.depth == On(i, i.pos - 1) ? FP : ap);
  else if (i.next == 63)
    i.advance(), ni(i.next) && i.acceptToken(e.context.type == Pl && e.context.depth == On(i, i.pos - 1) ? HP : hp);
  else {
    let t = i.pos;
    for (; ; )
      if (wl(i.next)) {
        if (i.pos == t) return;
        i.advance();
      } else if (i.next == 33)
        up(i);
      else if (i.next == 38)
        vl(i);
      else if (i.next == 42) {
        vl(i);
        break;
      } else if (i.next == 39 || i.next == 34) {
        if (va(i, !0)) break;
        return;
      } else if (i.next == 91 || i.next == 123) {
        if (!mk(i)) return;
        break;
      } else {
        dp(i, !0, !1, 0);
        break;
      }
    for (; wl(i.next); ) i.advance();
    if (i.next == 58) {
      if (i.pos == t && e.canShift(lk)) return;
      let n = i.peek(1);
      ni(n) && i.acceptTokenTo(e.context.type == Pl && e.context.depth == On(i, t) ? JP : cp, t);
    }
  }
}, { contextual: !0 });
function pk(i) {
  return i > 32 && i < 127 && i != 34 && i != 37 && i != 44 && i != 60 && i != 62 && i != 92 && i != 94 && i != 96 && i != 123 && i != 124 && i != 125;
}
function gf(i) {
  return i >= 48 && i <= 57 || i >= 97 && i <= 102 || i >= 65 && i <= 70;
}
function Sf(i, e) {
  return i.next == 37 ? (i.advance(), gf(i.next) && i.advance(), gf(i.next) && i.advance(), !0) : pk(i.next) || e && i.next == 44 ? (i.advance(), !0) : !1;
}
function up(i) {
  if (i.advance(), i.next == 60) {
    for (i.advance(); ; )
      if (!Sf(i, !0)) {
        i.next == 62 && i.advance();
        break;
      }
  } else
    for (; Sf(i, !1); )
      ;
}
function vl(i) {
  for (i.advance(); !ni(i.next) && rs(i.next) != "f"; ) i.advance();
}
function va(i, e) {
  let t = i.next, n = !1, r = i.pos;
  for (i.advance(); ; ) {
    let s = i.next;
    if (s < 0) break;
    if (i.advance(), s == t)
      if (s == 39)
        if (i.next == 39) i.advance();
        else break;
      else
        break;
    else if (s == 92 && t == 34)
      i.next >= 0 && i.advance();
    else if (wt(s)) {
      if (e) return !1;
      n = !0;
    } else if (e && i.pos >= r + 1024)
      return !1;
  }
  return !n;
}
function mk(i) {
  for (let e = [], t = i.pos + 1024; ; )
    if (i.next == 91 || i.next == 123)
      e.push(i.next), i.advance();
    else if (i.next == 39 || i.next == 34) {
      if (!va(i, !0)) return !1;
    } else if (i.next == 93 || i.next == 125) {
      if (e[e.length - 1] != i.next - 2) return !1;
      if (e.pop(), i.advance(), !e.length) return !0;
    } else {
      if (i.next < 0 || i.pos > t || wt(i.next))
        return !1;
      i.advance();
    }
}
const gk = "iiisiiissisfissssssssssssisssiiissssssssssssssssssssssssssfsfssissssssssssssssssssssssssssfif";
function rs(i) {
  return i < 33 ? "u" : i > 125 ? "s" : gk[i - 33];
}
function mo(i, e) {
  let t = rs(i);
  return t != "u" && !(e && t == "f");
}
function dp(i, e, t, n) {
  if (rs(i.next) == "s" || (i.next == 63 || i.next == 58 || i.next == 45) && mo(i.peek(1), t))
    i.advance();
  else
    return !1;
  let r = i.pos;
  for (; ; ) {
    let s = i.next, o = 0, l = n + 1;
    for (; Op(s); ) {
      if (wt(s)) {
        if (e) return !1;
        l = 0;
      } else
        l++;
      s = i.peek(++o);
    }
    if (!(s >= 0 && (s == 58 ? mo(i.peek(o + 1), t) : s == 35 ? i.peek(o - 1) != 32 : mo(s, t))) || !t && l <= n || l == 0 && !t && (ji(i, 45, o) || ji(i, 46, o)))
      break;
    if (e && rs(s) == "f") return !1;
    for (let h = o; h >= 0; h--) i.advance();
    if (e && i.pos > r + 1024) return !1;
  }
  return !0;
}
const Sk = new oe((i, e) => {
  if (i.next == 33)
    up(i), i.acceptToken(rk);
  else if (i.next == 38 || i.next == 42) {
    let t = i.next == 38 ? ik : nk;
    vl(i), i.acceptToken(t);
  } else i.next == 39 || i.next == 34 ? (va(i, !1), i.acceptToken(tk)) : dp(i, !1, e.context.type == Rn, e.context.depth) && i.acceptToken(ek);
}), Qk = new oe((i, e) => {
  let t = e.context.type == kl ? e.context.depth : -1, n = i.pos;
  e: for (; ; ) {
    let r = 0, s = i.next;
    for (; s == 32; ) s = i.peek(++r);
    if (!r && (ji(i, 45, r) || ji(i, 46, r)) || !wt(s) && (t < 0 && (t = Math.max(e.context.depth + 1, r)), r < t))
      break;
    for (; ; ) {
      if (i.next < 0) break e;
      let o = wt(i.next);
      if (i.advance(), o) continue e;
      n = i.pos;
    }
  }
  i.acceptTokenTo(fp, n);
}), bk = Vt({
  DirectiveName: p.keyword,
  DirectiveContent: p.attributeValue,
  "DirectiveEnd DocEnd": p.meta,
  QuotedLiteral: p.string,
  BlockLiteralHeader: p.special(p.string),
  BlockLiteralContent: p.content,
  Literal: p.content,
  "Key/Literal Key/QuotedLiteral": p.definition(p.propertyName),
  "Anchor Alias": p.labelName,
  Tag: p.typeName,
  Comment: p.lineComment,
  ": , -": p.separator,
  "?": p.punctuation,
  "[ ]": p.squareBracket,
  "{ }": p.brace
}), yk = dt.deserialize({
  version: 14,
  states: "5lQ!ZQgOOO#PQfO'#CpO#uQfO'#DOOOQR'#Dv'#DvO$qQgO'#DRO%gQdO'#DUO%nQgO'#DUO&ROaO'#D[OOQR'#Du'#DuO&{QgO'#D^O'rQgO'#D`OOQR'#Dt'#DtO(iOqO'#DbOOQP'#Dj'#DjO(zQaO'#CmO)YQgO'#CmOOQP'#Cm'#CmQ)jQaOOQ)uQgOOQ]QgOOO*PQdO'#CrO*nQdO'#CtOOQO'#Dw'#DwO+]Q`O'#CxO+hQdO'#CwO+rQ`O'#CwOOQO'#Cv'#CvO+wQdO'#CvOOQO'#Cq'#CqO,UQ`O,59[O,^QfO,59[OOQR,59[,59[OOQO'#Cx'#CxO,eQ`O'#DPO,pQdO'#DPOOQO'#Dx'#DxO,zQdO'#DxO-XQ`O,59jO-aQfO,59jOOQR,59j,59jOOQR'#DS'#DSO-hQcO,59mO-sQgO'#DVO.TQ`O'#DVO.YQcO,59pOOQR'#DX'#DXO#|QfO'#DWO.hQcO'#DWOOQR,59v,59vO.yOWO,59vO/OOaO,59vO/WOaO,59vO/cQgO'#D_OOQR,59x,59xO0VQgO'#DaOOQR,59z,59zOOQP,59|,59|O0yOaO,59|O1ROaO,59|O1aOqO,59|OOQP-E7h-E7hO1oQgO,59XOOQP,59X,59XO2PQaO'#DeO2_QgO'#DeO2oQgO'#DkOOQP'#Dk'#DkQ)jQaOOO3PQdO'#CsOOQO,59^,59^O3kQdO'#CuOOQO,59`,59`OOQO,59c,59cO4VQdO,59cO4aQdO'#CzO4kQ`O'#CzOOQO,59b,59bOOQU,5:Q,5:QOOQR1G.v1G.vO4pQ`O1G.vOOQU-E7d-E7dO4xQdO,59kOOQO,59k,59kO5SQdO'#DQO5^Q`O'#DQOOQO,5:d,5:dOOQU,5:R,5:ROOQR1G/U1G/UO5cQ`O1G/UOOQU-E7e-E7eO5kQgO'#DhO5xQcO1G/XOOQR1G/X1G/XOOQR,59q,59qO6TQgO,59qO6eQdO'#DiO6lQgO'#DiO7PQcO1G/[OOQR1G/[1G/[OOQR,59r,59rO#|QfO,59rOOQR1G/b1G/bO7_OWO1G/bO7dOaO1G/bOOQR,59y,59yOOQR,59{,59{OOQP1G/h1G/hO7lOaO1G/hO7tOaO1G/hO8POaO1G/hOOQP1G.s1G.sO8_QgO,5:POOQP,5:P,5:POOQP,5:V,5:VOOQP-E7i-E7iOOQO,59_,59_OOQO,59a,59aOOQO1G.}1G.}OOQO,59f,59fO8oQdO,59fOOQR7+$b7+$bP,XQ`O'#DfOOQO1G/V1G/VOOQO,59l,59lO8yQdO,59lOOQR7+$p7+$pP9TQ`O'#DgOOQR'#DT'#DTOOQR,5:S,5:SOOQR-E7f-E7fOOQR7+$s7+$sOOQR1G/]1G/]O9YQgO'#DYO9jQ`O'#DYOOQR,5:T,5:TO#|QfO'#DZO9oQcO'#DZOOQR-E7g-E7gOOQR7+$v7+$vOOQR1G/^1G/^OOQR7+$|7+$|O:QOWO7+$|OOQP7+%S7+%SO:VOaO7+%SO:_OaO7+%SOOQP1G/k1G/kOOQO1G/Q1G/QOOQO1G/W1G/WOOQR,59t,59tO:jQgO,59tOOQR,59u,59uO#|QfO,59uOOQR<<Hh<<HhOOQP<<Hn<<HnO:zOaO<<HnOOQR1G/`1G/`OOQR1G/a1G/aOOQPAN>YAN>Y",
  stateData: ";S~O!fOS!gOS^OS~OP_OQbORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!V[O!cTO~O`cO~P]OVkOWROXROYeOZfO[dOcPOmhOqQO~OboO~P!bOVtOWROXROYeOZfO[dOcPOmrOqQO~OpwO~P#WORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!cTO~OSvP!avP!bvP~P#|OWROXROYeOZfO[dOcPOqQO~OmzO~P%OOm!OOUzP!azP!bzP!dzP~P#|O^!SO!b!QO!f!TO!g!RO~ORSOTUOWROXROcPOqQO!PVO!cTO~OY!UOP!QXQ!QX!V!QX!`!QXS!QX!a!QX!b!QXU!QXm!QX!d!QX~P&aO[!WOP!SXQ!SX!V!SX!`!SXS!SX!a!SX!b!SXU!SXm!SX!d!SX~P&aO^!ZO!W![O!b!YO!f!]O!g!YO~OP!_O!V[OQaX!`aX~OPaXQaX!VaX!`aX~P#|OP!bOQ!cO!V[O~OP_O!V[O~P#|OWROXROY!fOcPOqQObfXmfXofXpfX~OWROXRO[!hOcPOqQObhXmhXohXphX~ObeXmlXoeX~ObkXokX~P%OOm!kO~Om!lObnPonP~P%OOb!pOo!oO~Ob!pO~P!bOm!sOosXpsX~OosXpsX~P%OOm!uOotPptP~P%OOo!xOp!yO~Op!yO~P#WOS!|O!a#OO!b#OO~OUyX!ayX!byX!dyX~P#|Om#QO~OU#SO!a#UO!b#UO!d#RO~Om#WOUzX!azX!bzX!dzX~O]#XO~O!b#XO!g#YO~O^#ZO!b#XO!g#YO~OP!RXQ!RX!V!RX!`!RXS!RX!a!RX!b!RXU!RXm!RX!d!RX~P&aOP!TXQ!TX!V!TX!`!TXS!TX!a!TX!b!TXU!TXm!TX!d!TX~P&aO!b#^O!g#^O~O^#_O!b#^O!f#`O!g#^O~O^#_O!W#aO!b#^O!g#^O~OPaaQaa!Vaa!`aa~P#|OP#cO!V[OQ!XX!`!XX~OP!XXQ!XX!V!XX!`!XX~P#|OP_O!V[OQ!_X!`!_X~P#|OWROXROcPOqQObgXmgXogXpgX~OWROXROcPOqQObiXmiXoiXpiX~Obkaoka~P%OObnXonX~P%OOm#kO~Ob#lOo!oO~Oosapsa~P%OOotXptX~P%OOm#pO~Oo!xOp#qO~OSwP!awP!bwP~P#|OS!|O!a#vO!b#vO~OUya!aya!bya!dya~P#|Om#xO~P%OOm#{OU}P!a}P!b}P!d}P~P#|OU#SO!a$OO!b$OO!d#RO~O]$QO~O!b$QO!g$RO~O!b$SO!g$SO~O^$TO!b$SO!g$SO~O^$TO!b$SO!f$UO!g$SO~OP!XaQ!Xa!V!Xa!`!Xa~P#|Obnaona~P%OOotapta~P%OOo!xO~OU|X!a|X!b|X!d|X~P#|Om$ZO~Om$]OU}X!a}X!b}X!d}X~O]$^O~O!b$_O!g$_O~O^$`O!b$_O!g$_O~OU|a!a|a!b|a!d|a~P#|O!b$cO!g$cO~O",
  goto: ",]!mPPPPPPPPPPPPPPPPP!nPP!v#v#|$`#|$c$f$j$nP%VPPP!v%Y%^%a%{&O%a&R&U&X&_&b%aP&e&{&e'O'RPP']'a'g'm's'y(XPPPPPPPP(_)e*X+c,VUaObcR#e!c!{ROPQSTUXY_bcdehknrtvz!O!U!W!_!b!c!f!h!k!l!s!u!|#Q#R#S#W#c#k#p#x#{$Z$]QmPR!qnqfPQThknrtv!k!l!s!u#R#k#pR!gdR!ieTlPnTjPnSiPnSqQvQ{TQ!mkQ!trQ!vtR#y#RR!nkTsQvR!wt!RWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]RySR#t!|R|TR|UQ!PUR#|#SR#z#RR#z#SyZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]R!VXR!XYa]O^abc!a!c!eT!da!eQnPR!rnQvQR!{vQ!}yR#u!}Q#T|R#}#TW^Obc!cS!^^!aT!aa!eQ!eaR#f!eW`Obc!cQxSS}U#SQ!`_Q#PzQ#V!OQ#b!_Q#d!bQ#s!|Q#w#QQ$P#WQ$V#cQ$Y#xQ$[#{Q$a$ZR$b$]xZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]Q!VXQ!XYQ#[!UR#]!W!QWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]pfPQThknrtv!k!l!s!u#R#k#pQ!gdQ!ieQ#g!fR#h!hSgPn^pQTkrtv#RQ!jhQ#i!kQ#j!lQ#n!sQ#o!uQ$W#kR$X#pQuQR!zv",
  nodeNames: "⚠ DirectiveEnd DocEnd - - ? ? ? Literal QuotedLiteral Anchor Alias Tag BlockLiteralContent Comment Stream BOM Document ] [ FlowSequence Item Tagged Anchored Anchored Tagged FlowMapping Pair Key : Pair , } { FlowMapping Pair Pair BlockSequence Item Item BlockMapping Pair Pair Key Pair Pair BlockLiteral BlockLiteralHeader Tagged Anchored Anchored Tagged Directive DirectiveName DirectiveContent Document",
  maxTerm: 74,
  context: Ok,
  nodeProps: [
    ["isolate", -3, 8, 9, 14, ""],
    ["openedBy", 18, "[", 32, "{"],
    ["closedBy", 19, "]", 33, "}"]
  ],
  propSources: [bk],
  skippedNodes: [0],
  repeatNodeCount: 6,
  tokenData: "-Y~RnOX#PXY$QYZ$]Z]#P]^$]^p#Ppq$Qqs#Pst$btu#Puv$yv|#P|}&e}![#P![!]'O!]!`#P!`!a'i!a!}#P!}#O*g#O#P#P#P#Q+Q#Q#o#P#o#p+k#p#q'i#q#r,U#r;'S#P;'S;=`#z<%l?HT#P?HT?HU,o?HUO#PQ#UU!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PQ#kTOY#PZs#Pt;'S#P;'S;=`#z<%lO#PQ#}P;=`<%l#P~$VQ!f~XY$Qpq$Q~$bO!g~~$gS^~OY$bZ;'S$b;'S;=`$s<%lO$b~$vP;=`<%l$bR%OX!WQOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR%rX!WQ!VPOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR&bP;=`<%l%kR&lUoP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'VUmP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'p[!PP!WQOY#PZp#Ppq#hq{#P{|(f|}#P}!O(f!O!R#P!R![)p![;'S#P;'S;=`#z<%lO#PR(mW!PP!WQOY#PZp#Ppq#hq!R#P!R![)V![;'S#P;'S;=`#z<%lO#PR)^U!PP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR)wY!PP!WQOY#PZp#Ppq#hq{#P{|)V|}#P}!O)V!O;'S#P;'S;=`#z<%lO#PR*nUcP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+XUbP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+rUqP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,]UpP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,vU`P!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#P",
  tokenizers: [uk, dk, Sk, Qk, 0, 1],
  topRules: { Stream: [0, 15] },
  tokenPrec: 0
}), xk = /* @__PURE__ */ ut.define({
  name: "yaml",
  parser: /* @__PURE__ */ yk.configure({
    props: [
      /* @__PURE__ */ Dt.add({
        Stream: (i) => {
          for (let e = i.node.resolve(i.pos, -1); e && e.to >= i.pos; e = e.parent) {
            if (e.name == "BlockLiteralContent" && e.from < e.to)
              return i.baseIndentFor(e);
            if (e.name == "BlockLiteral")
              return i.baseIndentFor(e) + i.unit;
            if (e.name == "BlockSequence" || e.name == "BlockMapping")
              return i.column(e.firstChild.from, 1);
            if (e.name == "QuotedLiteral")
              return null;
            if (e.name == "Literal") {
              let t = i.column(e.from, 1);
              if (t == i.lineIndent(e.from, 1))
                return t;
              if (e.to > i.pos)
                return null;
            }
          }
          return null;
        },
        FlowMapping: /* @__PURE__ */ nl({ closing: "}" }),
        FlowSequence: /* @__PURE__ */ nl({ closing: "]" })
      }),
      /* @__PURE__ */ Et.add({
        "FlowMapping FlowSequence": us,
        "Item Pair BlockLiteral": (i, e) => ({ from: e.doc.lineAt(i.from).to, to: i.to })
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "#" },
    indentOnInput: /^\s*[\]\}]$/
  }
});
function $k() {
  return new fi(xk);
}
function Zk({
  file: i,
  content: e,
  kind: t,
  onChange: n
}) {
  return /* @__PURE__ */ Qf(
    Qd,
    {
      value: e,
      height: "100%",
      basicSetup: {
        autocompletion: !0,
        bracketMatching: !0,
        foldGutter: !0,
        highlightActiveLine: !0,
        highlightSelectionMatches: !0,
        lineNumbers: !0
      },
      extensions: Pk(i.name, t),
      className: "knowledge-code-editor",
      onChange: n
    }
  );
}
function Pk(i, e) {
  const t = xp(i);
  return e === "html" ? [X$()] : t === "json" ? [W$()] : t === "css" || t === "scss" || t === "less" ? [wd()] : t === "js" || t === "jsx" || t === "ts" || t === "tsx" || t === "vue" ? [Nd({ jsx: t === "jsx" || t === "tsx" })] : t === "sql" ? [$P()] : t === "xml" ? [IP()] : t === "yaml" || t === "yml" ? [$k()] : [];
}
export {
  Zk as KnowledgeCodeEditor
};
