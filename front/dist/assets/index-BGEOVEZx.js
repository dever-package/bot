import { P as Za, N as ka, a as ya, D as _a, b as OO, T as oe, I as tO, p as Qt, s as Y, t as l, L as j, c as R, i as E, d as C, f as A, e as Pe, g as q, h as pt, E as aO, j as rO, k as ut, l as ft, m as va, n as Ce, o as ht, q as b, r as wa, u as $t } from "./index-CfEYn6pJ.js";
class Qe {
  /**
  @internal
  */
  constructor(e, a, t, r, s, i, n, o, d, Q = 0, c) {
    this.p = e, this.stack = a, this.state = t, this.reducePos = r, this.pos = s, this.score = i, this.buffer = n, this.bufferBase = o, this.curContext = d, this.lookAhead = Q, this.parent = c;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, a) => a % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, a, t = 0) {
    let r = e.parser.context;
    return new Qe(e, [], a, t, t, 0, [], 0, r ? new PO(r, r.start) : null, 0, null);
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
  pushState(e, a) {
    this.stack.push(this.state, a, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var a;
    let t = e >> 19, r = e & 65535, { parser: s } = this.p, i = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), n = s.dynamicPrecedence(r);
    if (n && (this.score += n), t == 0) {
      r < s.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(s.getGoto(this.state, r, !0), this.reducePos), r < s.minRepeatTerm && this.storeNode(r, this.reducePos, this.reducePos, i ? 8 : 4, !0), this.reduceContext(r, this.reducePos);
      return;
    }
    let o = this.stack.length - (t - 1) * 3 - (e & 262144 ? 6 : 0), d = o ? this.stack[o - 2] : this.p.ranges[0].from;
    r < s.minRepeatTerm && d == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
    let Q = this.reducePos - d;
    Q >= 2e3 && !(!((a = this.p.parser.nodeSet.types[r]) === null || a === void 0) && a.isAnonymous) && (d == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = Q) : this.p.lastBigReductionSize < Q && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = d, this.p.lastBigReductionSize = Q));
    let c = o ? this.stack[o - 1] : 0, p = this.bufferBase + this.buffer.length - c;
    if (r < s.minRepeatTerm || e & 131072) {
      let u = s.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(r, d, u, p + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[o];
    else {
      let u = this.stack[o - 3];
      this.state = s.getGoto(u, r, !0);
    }
    for (; this.stack.length > o; )
      this.stack.pop();
    this.reduceContext(r, d);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, a, t, r = 4, s = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let i = this.buffer.length;
      if (i > 0 && this.buffer[i - 4] == 0 && this.buffer[i - 1] > -1) {
        if (a == t)
          return;
        if (this.buffer[i - 2] >= a) {
          this.buffer[i - 2] = t;
          return;
        }
      }
    }
    if (!s || this.pos == t)
      this.buffer.push(e, a, t, r);
    else {
      let i = this.buffer.length;
      if (i > 0 && (this.buffer[i - 4] != 0 || this.buffer[i - 1] < 0)) {
        let n = !1;
        for (let o = i; o > 0 && this.buffer[o - 2] > t; o -= 4)
          if (this.buffer[o - 1] >= 0) {
            n = !0;
            break;
          }
        if (n)
          for (; i > 0 && this.buffer[i - 2] > t; )
            this.buffer[i] = this.buffer[i - 4], this.buffer[i + 1] = this.buffer[i - 3], this.buffer[i + 2] = this.buffer[i - 2], this.buffer[i + 3] = this.buffer[i - 1], i -= 4, r > 4 && (r -= 4);
      }
      this.buffer[i] = e, this.buffer[i + 1] = a, this.buffer[i + 2] = t, this.buffer[i + 3] = r;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, a, t, r) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if ((e & 262144) == 0) {
      let s = e, { parser: i } = this.p;
      this.pos = r;
      let n = i.stateFlag(
        s,
        1
        /* StateFlag.Skipped */
      );
      !n && (r > t || a <= i.maxNode) && (this.reducePos = r), this.pushState(s, n ? t : Math.min(t, this.reducePos)), this.shiftContext(a, t), a <= i.maxNode && this.buffer.push(a, t, r, 4);
    } else
      this.pos = r, this.shiftContext(a, t), a <= this.p.parser.maxNode && this.buffer.push(a, t, r, 4);
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, a, t, r) {
    e & 65536 ? this.reduce(e) : this.shift(e, a, t, r);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, a) {
    let t = this.p.reused.length - 1;
    (t < 0 || this.p.reused[t] != e) && (this.p.reused.push(e), t++);
    let r = this.pos;
    this.reducePos = this.pos = r + e.length, this.pushState(a, r), this.buffer.push(
      t,
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
    let e = this, a = e.buffer.length;
    for (a && e.buffer[a - 4] == 0 && (a -= 4); a > 0 && e.buffer[a - 2] > e.reducePos; )
      a -= 4;
    let t = e.buffer.slice(a), r = e.bufferBase + a;
    for (; e && r == e.bufferBase; )
      e = e.parent;
    return new Qe(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, t, r, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, a) {
    let t = e <= this.p.parser.maxNode;
    t && this.storeNode(e, this.pos, a, 4), this.storeNode(0, this.pos, a, t ? 8 : 4), this.pos = this.reducePos = a, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let a = new ja(this); ; ) {
      let t = this.p.parser.stateSlot(
        a.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(a.state, e);
      if (t == 0)
        return !1;
      if ((t & 65536) == 0)
        return !0;
      a.reduce(t);
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
    let a = this.p.parser.nextStates(this.state);
    if (a.length > 8 || this.stack.length >= 120) {
      let r = [];
      for (let s = 0, i; s < a.length; s += 2)
        (i = a[s + 1]) != this.state && this.p.parser.hasAction(i, e) && r.push(a[s], i);
      if (this.stack.length < 120)
        for (let s = 0; r.length < 8 && s < a.length; s += 2) {
          let i = a[s + 1];
          r.some((n, o) => o & 1 && n == i) || r.push(a[s], i);
        }
      a = r;
    }
    let t = [];
    for (let r = 0; r < a.length && t.length < 4; r += 2) {
      let s = a[r + 1];
      if (s == this.state)
        continue;
      let i = this.split();
      i.pushState(s, this.pos), i.storeNode(0, i.pos, i.pos, 4, !0), i.shiftContext(a[r], this.pos), i.reducePos = this.pos, i.score -= 200, t.push(i);
    }
    return t;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, a = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((a & 65536) == 0)
      return !1;
    if (!e.validAction(this.state, a)) {
      let t = a >> 19, r = a & 65535, s = this.stack.length - t * 3;
      if (s < 0 || e.getGoto(this.stack[s], r, !1) < 0) {
        let i = this.findForcedReduction();
        if (i == null)
          return !1;
        a = i;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(a), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, a = [], t = (r, s) => {
      if (!a.includes(r))
        return a.push(r), e.allActions(r, (i) => {
          if (!(i & 393216)) if (i & 65536) {
            let n = (i >> 19) - s;
            if (n > 1) {
              let o = i & 65535, d = this.stack.length - n * 3;
              if (d >= 0 && e.getGoto(this.stack[d], o, !1) >= 0)
                return n << 19 | 65536 | o;
            }
          } else {
            let n = t(i, s + 1);
            if (n != null)
              return n;
          }
        });
    };
    return t(this.state, 0);
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
    for (let a = 0; a < this.stack.length; a += 3)
      if (this.stack[a] != e.stack[a])
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
  shiftContext(e, a) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(a)));
  }
  reduceContext(e, a) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(a)));
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
      let a = new PO(this.curContext.tracker, e);
      a.hash != this.curContext.hash && this.emitContext(), this.curContext = a;
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
class PO {
  constructor(e, a) {
    this.tracker = e, this.context = a, this.hash = e.strict ? e.hash(a) : 0;
  }
}
class ja {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let a = e & 65535, t = e >> 19;
    t == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (t - 1) * 3;
    let r = this.start.p.parser.getGoto(this.stack[this.base - 3], a, !0);
    this.state = r;
  }
}
class pe {
  constructor(e, a, t) {
    this.stack = e, this.pos = a, this.index = t, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, a = e.bufferBase + e.buffer.length) {
    return new pe(e, a, a - e.bufferBase);
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
    return new pe(this.stack, this.pos, this.index);
  }
}
function ee(O, e = Uint16Array) {
  if (typeof O != "string")
    return O;
  let a = null;
  for (let t = 0, r = 0; t < O.length; ) {
    let s = 0;
    for (; ; ) {
      let i = O.charCodeAt(t++), n = !1;
      if (i == 126) {
        s = 65535;
        break;
      }
      i >= 92 && i--, i >= 34 && i--;
      let o = i - 32;
      if (o >= 46 && (o -= 46, n = !0), s += o, n)
        break;
      s *= 46;
    }
    a ? a[r++] = s : a = new e(s);
  }
  return a;
}
class le {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const SO = new le();
class Ta {
  /**
  @internal
  */
  constructor(e, a) {
    this.input = e, this.ranges = a, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = SO, this.rangeIndex = 0, this.pos = this.chunkPos = a[0].from, this.range = a[0], this.end = a[a.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, a) {
    let t = this.range, r = this.rangeIndex, s = this.pos + e;
    for (; s < t.from; ) {
      if (!r)
        return null;
      let i = this.ranges[--r];
      s -= t.from - i.to, t = i;
    }
    for (; a < 0 ? s > t.to : s >= t.to; ) {
      if (r == this.ranges.length - 1)
        return null;
      let i = this.ranges[++r];
      s += i.from - t.to, t = i;
    }
    return s;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let a of this.ranges)
      if (a.to > e)
        return Math.max(e, a.from);
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
    let a = this.chunkOff + e, t, r;
    if (a >= 0 && a < this.chunk.length)
      t = this.pos + e, r = this.chunk.charCodeAt(a);
    else {
      let s = this.resolveOffset(e, 1);
      if (s == null)
        return -1;
      if (t = s, t >= this.chunk2Pos && t < this.chunk2Pos + this.chunk2.length)
        r = this.chunk2.charCodeAt(t - this.chunk2Pos);
      else {
        let i = this.rangeIndex, n = this.range;
        for (; n.to <= t; )
          n = this.ranges[++i];
        this.chunk2 = this.input.chunk(this.chunk2Pos = t), t + this.chunk2.length > n.to && (this.chunk2 = this.chunk2.slice(0, n.to - t)), r = this.chunk2.charCodeAt(0);
      }
    }
    return t >= this.token.lookAhead && (this.token.lookAhead = t + 1), r;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, a = 0) {
    let t = a ? this.resolveOffset(a, -1) : this.pos;
    if (t == null || t < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = t;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, a) {
    this.token.value = e, this.token.end = a;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: a } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = a, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), a = this.pos + e.length;
      this.chunk = a > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
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
  reset(e, a) {
    if (a ? (this.token = a, a.start = e, a.lookAhead = e + 1, a.value = a.extended = -1) : this.token = SO, this.pos != e) {
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
  read(e, a) {
    if (e >= this.chunkPos && a <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, a - this.chunkPos);
    if (e >= this.chunk2Pos && a <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, a - this.chunk2Pos);
    if (e >= this.range.from && a <= this.range.to)
      return this.input.read(e, a);
    let t = "";
    for (let r of this.ranges) {
      if (r.from >= a)
        break;
      r.to > e && (t += this.input.read(Math.max(r.from, e), Math.min(r.to, a)));
    }
    return t;
  }
}
class B {
  constructor(e, a) {
    this.data = e, this.id = a;
  }
  token(e, a) {
    let { parser: t } = a.p;
    mt(this.data, e, a, this.id, t.data, t.tokenPrecTable);
  }
}
B.prototype.contextual = B.prototype.fallback = B.prototype.extend = !1;
class ue {
  constructor(e, a, t) {
    this.precTable = a, this.elseToken = t, this.data = typeof e == "string" ? ee(e) : e;
  }
  token(e, a) {
    let t = e.pos, r = 0;
    for (; ; ) {
      let s = e.next < 0, i = e.resolveOffset(1, 1);
      if (mt(this.data, e, a, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (s || r++, i == null)
        break;
      e.reset(i, e.token);
    }
    r && (e.reset(t, e.token), e.acceptToken(this.elseToken, r));
  }
}
ue.prototype.contextual = B.prototype.fallback = B.prototype.extend = !1;
class P {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, a = {}) {
    this.token = e, this.contextual = !!a.contextual, this.fallback = !!a.fallback, this.extend = !!a.extend;
  }
}
function mt(O, e, a, t, r, s) {
  let i = 0, n = 1 << t, { dialect: o } = a.p.parser;
  e: for (; (n & O[i]) != 0; ) {
    let d = O[i + 1];
    for (let u = i + 3; u < d; u += 2)
      if ((O[u + 1] & n) > 0) {
        let f = O[u];
        if (o.allows(f) && (e.token.value == -1 || e.token.value == f || qa(f, e.token.value, r, s))) {
          e.acceptToken(f);
          break;
        }
      }
    let Q = e.next, c = 0, p = O[i + 2];
    if (e.next < 0 && p > c && O[d + p * 3 - 3] == 65535) {
      i = O[d + p * 3 - 1];
      continue e;
    }
    for (; c < p; ) {
      let u = c + p >> 1, f = d + u + (u << 1), m = O[f], $ = O[f + 1] || 65536;
      if (Q < m)
        p = u;
      else if (Q >= $)
        c = u + 1;
      else {
        i = O[f + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function bO(O, e, a) {
  for (let t = e, r; (r = O[t]) != 65535; t++)
    if (r == a)
      return t - e;
  return -1;
}
function qa(O, e, a, t) {
  let r = bO(a, t, e);
  return r < 0 || bO(a, t, O) < r;
}
const X = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let Xe = null;
function XO(O, e, a) {
  let t = O.cursor(tO.IncludeAnonymous);
  for (t.moveTo(e); ; )
    if (!(a < 0 ? t.childBefore(e) : t.childAfter(e)))
      for (; ; ) {
        if ((a < 0 ? t.to < e : t.from > e) && !t.type.isError)
          return a < 0 ? Math.max(0, Math.min(
            t.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(O.length, Math.max(
            t.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (a < 0 ? t.prevSibling() : t.nextSibling())
          break;
        if (!t.parent())
          return a < 0 ? 0 : O.length;
      }
}
class Ya {
  constructor(e, a) {
    this.fragments = e, this.nodeSet = a, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? XO(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? XO(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
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
      let a = this.trees.length - 1;
      if (a < 0)
        return this.nextFragment(), null;
      let t = this.trees[a], r = this.index[a];
      if (r == t.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let s = t.children[r], i = this.start[a] + t.positions[r];
      if (i > e)
        return this.nextStart = i, null;
      if (s instanceof oe) {
        if (i == e) {
          if (i < this.safeFrom)
            return null;
          let n = i + s.length;
          if (n <= this.safeTo) {
            let o = s.prop(OO.lookAhead);
            if (!o || n + o < this.fragment.to)
              return s;
          }
        }
        this.index[a]++, i + s.length >= Math.max(this.safeFrom, e) && (this.trees.push(s), this.start.push(i), this.index.push(0));
      } else
        this.index[a]++, this.nextStart = i + s.length;
    }
  }
}
class Ra {
  constructor(e, a) {
    this.stream = a, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((t) => new le());
  }
  getActions(e) {
    let a = 0, t = null, { parser: r } = e.p, { tokenizers: s } = r, i = r.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), n = e.curContext ? e.curContext.hash : 0, o = 0;
    for (let d = 0; d < s.length; d++) {
      if ((1 << d & i) == 0)
        continue;
      let Q = s[d], c = this.tokens[d];
      if (!(t && !Q.fallback) && ((Q.contextual || c.start != e.pos || c.mask != i || c.context != n) && (this.updateCachedToken(c, Q, e), c.mask = i, c.context = n), c.lookAhead > c.end + 25 && (o = Math.max(c.lookAhead, o)), c.value != 0)) {
        let p = a;
        if (c.extended > -1 && (a = this.addActions(e, c.extended, c.end, a)), a = this.addActions(e, c.value, c.end, a), !Q.extend && (t = c, a > p))
          break;
      }
    }
    for (; this.actions.length > a; )
      this.actions.pop();
    return o && e.setLookAhead(o), !t && e.pos == this.stream.end && (t = new le(), t.value = e.p.parser.eofTerm, t.start = t.end = e.pos, a = this.addActions(e, t.value, t.end, a)), this.mainToken = t, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let a = new le(), { pos: t, p: r } = e;
    return a.start = t, a.end = Math.min(t + 1, r.stream.end), a.value = t == r.stream.end ? r.parser.eofTerm : 0, a;
  }
  updateCachedToken(e, a, t) {
    let r = this.stream.clipPos(t.pos);
    if (a.token(this.stream.reset(r, e), t), e.value > -1) {
      let { parser: s } = t.p;
      for (let i = 0; i < s.specialized.length; i++)
        if (s.specialized[i] == e.value) {
          let n = s.specializers[i](this.stream.read(e.start, e.end), t);
          if (n >= 0 && t.p.parser.dialect.allows(n >> 1)) {
            (n & 1) == 0 ? e.value = n >> 1 : e.extended = n >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(r + 1);
  }
  putAction(e, a, t, r) {
    for (let s = 0; s < r; s += 3)
      if (this.actions[s] == e)
        return r;
    return this.actions[r++] = e, this.actions[r++] = a, this.actions[r++] = t, r;
  }
  addActions(e, a, t, r) {
    let { state: s } = e, { parser: i } = e.p, { data: n } = i;
    for (let o = 0; o < 2; o++)
      for (let d = i.stateSlot(
        s,
        o ? 2 : 1
        /* ParseState.Actions */
      ); ; d += 3) {
        if (n[d] == 65535)
          if (n[d + 1] == 1)
            d = w(n, d + 2);
          else {
            r == 0 && n[d + 1] == 2 && (r = this.putAction(w(n, d + 2), a, t, r));
            break;
          }
        n[d] == a && (r = this.putAction(w(n, d + 1), a, t, r));
      }
    return r;
  }
}
class za {
  constructor(e, a, t, r) {
    this.parser = e, this.input = a, this.ranges = r, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new Ta(a, r), this.tokens = new Ra(e, this.stream), this.topTerm = e.top[1];
    let { from: s } = r[0];
    this.stacks = [Qe.start(this, e.top[0], s)], this.fragments = t.length && this.stream.end - s > e.bufferLength * 4 ? new Ya(t, e.nodeSet) : null;
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
    let e = this.stacks, a = this.minStackPos, t = this.stacks = [], r, s;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [i] = e;
      for (; i.forceReduce() && i.stack.length && i.stack[i.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      for (; ; ) {
        if (this.tokens.mainToken = null, n.pos > a)
          t.push(n);
        else {
          if (this.advanceStack(n, t, e))
            continue;
          {
            r || (r = [], s = []), r.push(n);
            let o = this.tokens.getMainToken(n);
            s.push(o.value, o.end);
          }
        }
        break;
      }
    }
    if (!t.length) {
      let i = r && Ua(r);
      if (i)
        return X && console.log("Finish with " + this.stackID(i)), this.stackToTree(i);
      if (this.parser.strict)
        throw X && r && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + a);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && r) {
      let i = this.stoppedAt != null && r[0].pos > this.stoppedAt ? r[0] : this.runRecovery(r, s, t);
      if (i)
        return X && console.log("Force-finish " + this.stackID(i)), this.stackToTree(i.forceAll());
    }
    if (this.recovering) {
      let i = this.recovering == 1 ? 1 : this.recovering * 3;
      if (t.length > i)
        for (t.sort((n, o) => o.score - n.score); t.length > i; )
          t.pop();
      t.some((n) => n.reducePos > a) && this.recovering--;
    } else if (t.length > 1) {
      e: for (let i = 0; i < t.length - 1; i++) {
        let n = t[i];
        for (let o = i + 1; o < t.length; o++) {
          let d = t[o];
          if (n.sameState(d) || n.buffer.length > 500 && d.buffer.length > 500)
            if ((n.score - d.score || n.buffer.length - d.buffer.length) > 0)
              t.splice(o--, 1);
            else {
              t.splice(i--, 1);
              continue e;
            }
        }
      }
      t.length > 12 && (t.sort((i, n) => n.score - i.score), t.splice(
        12,
        t.length - 12
        /* Rec.MaxStackCount */
      ));
    }
    this.minStackPos = t[0].pos;
    for (let i = 1; i < t.length; i++)
      t[i].pos < this.minStackPos && (this.minStackPos = t[i].pos);
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
  advanceStack(e, a, t) {
    let r = e.pos, { parser: s } = this, i = X ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && r > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let d = e.curContext && e.curContext.tracker.strict, Q = d ? e.curContext.hash : 0;
      for (let c = this.fragments.nodeAt(r); c; ) {
        let p = this.parser.nodeSet.types[c.type.id] == c.type ? s.getGoto(e.state, c.type.id) : -1;
        if (p > -1 && c.length && (!d || (c.prop(OO.contextHash) || 0) == Q))
          return e.useNode(c, p), X && console.log(i + this.stackID(e) + ` (via reuse of ${s.getName(c.type.id)})`), !0;
        if (!(c instanceof oe) || c.children.length == 0 || c.positions[0] > 0)
          break;
        let u = c.children[0];
        if (u instanceof oe && c.positions[0] == 0)
          c = u;
        else
          break;
      }
    }
    let n = s.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (n > 0)
      return e.reduce(n), X && console.log(i + this.stackID(e) + ` (via always-reduce ${s.getName(
        n & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let o = this.tokens.getActions(e);
    for (let d = 0; d < o.length; ) {
      let Q = o[d++], c = o[d++], p = o[d++], u = d == o.length || !t, f = u ? e : e.split(), m = this.tokens.mainToken;
      if (f.apply(Q, c, m ? m.start : f.pos, p), X && console.log(i + this.stackID(f) + ` (via ${(Q & 65536) == 0 ? "shift" : `reduce of ${s.getName(
        Q & 65535
        /* Action.ValueMask */
      )}`} for ${s.getName(c)} @ ${r}${f == e ? "" : ", split"})`), u)
        return !0;
      f.pos > r ? a.push(f) : t.push(f);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, a) {
    let t = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > t)
        return xO(e, a), !0;
    }
  }
  runRecovery(e, a, t) {
    let r = null, s = !1;
    for (let i = 0; i < e.length; i++) {
      let n = e[i], o = a[i << 1], d = a[(i << 1) + 1], Q = X ? this.stackID(n) + " -> " : "";
      if (n.deadEnd && (s || (s = !0, n.restart(), X && console.log(Q + this.stackID(n) + " (restarted)"), this.advanceFully(n, t))))
        continue;
      let c = n.split(), p = Q;
      for (let u = 0; u < 10 && c.forceReduce() && (X && console.log(p + this.stackID(c) + " (via force-reduce)"), !this.advanceFully(c, t)); u++)
        X && (p = this.stackID(c) + " -> ");
      for (let u of n.recoverByInsert(o))
        X && console.log(Q + this.stackID(u) + " (via recover-insert)"), this.advanceFully(u, t);
      this.stream.end > n.pos ? (d == n.pos && (d++, o = 0), n.recoverByDelete(o, d), X && console.log(Q + this.stackID(n) + ` (via recover-delete ${this.parser.getName(o)})`), xO(n, t)) : (!r || r.score < c.score) && (r = c);
    }
    return r;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), oe.build({
      buffer: pe.create(e),
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
    let a = (Xe || (Xe = /* @__PURE__ */ new WeakMap())).get(e);
    return a || Xe.set(e, a = String.fromCodePoint(this.nextStackID++)), a + e;
  }
}
function xO(O, e) {
  for (let a = 0; a < e.length; a++) {
    let t = e[a];
    if (t.pos == O.pos && t.sameState(O)) {
      e[a].score < O.score && (e[a] = O);
      return;
    }
  }
  e.push(O);
}
class Wa {
  constructor(e, a, t) {
    this.source = e, this.flags = a, this.disabled = t;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const xe = (O) => O;
class Se {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || xe, this.reduce = e.reduce || xe, this.reuse = e.reuse || xe, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class y extends Za {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let a = e.nodeNames.split(" ");
    this.minRepeatTerm = a.length;
    for (let n = 0; n < e.repeatNodeCount; n++)
      a.push("");
    let t = Object.keys(e.topRules).map((n) => e.topRules[n][1]), r = [];
    for (let n = 0; n < a.length; n++)
      r.push([]);
    function s(n, o, d) {
      r[n].push([o, o.deserialize(String(d))]);
    }
    if (e.nodeProps)
      for (let n of e.nodeProps) {
        let o = n[0];
        typeof o == "string" && (o = OO[o]);
        for (let d = 1; d < n.length; ) {
          let Q = n[d++];
          if (Q >= 0)
            s(Q, o, n[d++]);
          else {
            let c = n[d + -Q];
            for (let p = -Q; p > 0; p--)
              s(n[d++], o, c);
            d++;
          }
        }
      }
    this.nodeSet = new ka(a.map((n, o) => ya.define({
      name: o >= this.minRepeatTerm ? void 0 : n,
      id: o,
      props: r[o],
      top: t.indexOf(o) > -1,
      error: o == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(o) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = _a;
    let i = ee(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let n = 0; n < this.specializerSpecs.length; n++)
      this.specialized[n] = this.specializerSpecs[n].term;
    this.specializers = this.specializerSpecs.map(ZO), this.states = ee(e.states, Uint32Array), this.data = ee(e.stateData), this.goto = ee(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((n) => typeof n == "number" ? new B(i, n) : n), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, a, t) {
    let r = new za(this, e, a, t);
    for (let s of this.wrappers)
      r = s(r, e, a, t);
    return r;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, a, t = !1) {
    let r = this.goto;
    if (a >= r[0])
      return -1;
    for (let s = r[a + 1]; ; ) {
      let i = r[s++], n = i & 1, o = r[s++];
      if (n && t)
        return o;
      for (let d = s + (i >> 1); s < d; s++)
        if (r[s] == e)
          return o;
      if (n)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, a) {
    let t = this.data;
    for (let r = 0; r < 2; r++)
      for (let s = this.stateSlot(
        e,
        r ? 2 : 1
        /* ParseState.Actions */
      ), i; ; s += 3) {
        if ((i = t[s]) == 65535)
          if (t[s + 1] == 1)
            i = t[s = w(t, s + 2)];
          else {
            if (t[s + 1] == 2)
              return w(t, s + 2);
            break;
          }
        if (i == a || i == 0)
          return w(t, s + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, a) {
    return this.states[e * 6 + a];
  }
  /**
  @internal
  */
  stateFlag(e, a) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & a) > 0;
  }
  /**
  @internal
  */
  validAction(e, a) {
    return !!this.allActions(e, (t) => t == a ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, a) {
    let t = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), r = t ? a(t) : void 0;
    for (let s = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); r == null; s += 3) {
      if (this.data[s] == 65535)
        if (this.data[s + 1] == 1)
          s = w(this.data, s + 2);
        else
          break;
      r = a(w(this.data, s + 1));
    }
    return r;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let a = [];
    for (let t = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; t += 3) {
      if (this.data[t] == 65535)
        if (this.data[t + 1] == 1)
          t = w(this.data, t + 2);
        else
          break;
      if ((this.data[t + 2] & 1) == 0) {
        let r = this.data[t + 1];
        a.some((s, i) => i & 1 && s == r) || a.push(this.data[t], r);
      }
    }
    return a;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let a = Object.assign(Object.create(y.prototype), this);
    if (e.props && (a.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let t = this.topRules[e.top];
      if (!t)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      a.top = t;
    }
    return e.tokenizers && (a.tokenizers = this.tokenizers.map((t) => {
      let r = e.tokenizers.find((s) => s.from == t);
      return r ? r.to : t;
    })), e.specializers && (a.specializers = this.specializers.slice(), a.specializerSpecs = this.specializerSpecs.map((t, r) => {
      let s = e.specializers.find((n) => n.from == t.external);
      if (!s)
        return t;
      let i = Object.assign(Object.assign({}, t), { external: s.to });
      return a.specializers[r] = ZO(i), i;
    })), e.contextTracker && (a.context = e.contextTracker), e.dialect && (a.dialect = this.parseDialect(e.dialect)), e.strict != null && (a.strict = e.strict), e.wrap && (a.wrappers = a.wrappers.concat(e.wrap)), e.bufferLength != null && (a.bufferLength = e.bufferLength), a;
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
    let a = this.dynamicPrecedences;
    return a == null ? 0 : a[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let a = Object.keys(this.dialects), t = a.map(() => !1);
    if (e)
      for (let s of e.split(" ")) {
        let i = a.indexOf(s);
        i >= 0 && (t[i] = !0);
      }
    let r = null;
    for (let s = 0; s < a.length; s++)
      if (!t[s])
        for (let i = this.dialects[a[s]], n; (n = this.data[i++]) != 65535; )
          (r || (r = new Uint8Array(this.maxTerm + 1)))[n] = 1;
    return new Wa(e, t, r);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new y(e);
  }
}
function w(O, e) {
  return O[e] | O[e + 1] << 16;
}
function Ua(O) {
  let e = null;
  for (let a of O) {
    let t = a.p.stoppedAt;
    (a.pos == a.p.stream.end || t != null && a.pos > t) && a.p.parser.stateFlag(
      a.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < a.score) && (e = a);
  }
  return e;
}
function ZO(O) {
  if (O.external) {
    let e = O.extend ? 1 : 0;
    return (a, t) => O.external(a, t) << 1 | e;
  }
  return O.get;
}
const Va = 55, Ca = 1, Ga = 56, Ea = 2, Aa = 57, Ma = 3, kO = 4, La = 5, iO = 6, gt = 7, Pt = 8, St = 9, bt = 10, Da = 11, Na = 12, Ia = 13, Ze = 58, Ba = 14, Fa = 15, yO = 59, Xt = 21, Ja = 23, xt = 24, Ka = 25, Ge = 27, Zt = 28, Ha = 29, er = 32, Or = 35, tr = 37, ar = 38, rr = 0, ir = 1, sr = {
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
}, nr = {
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
}, _O = {
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
function or(O) {
  return O == 45 || O == 46 || O == 58 || O >= 65 && O <= 90 || O == 95 || O >= 97 && O <= 122 || O >= 161;
}
let vO = null, wO = null, jO = 0;
function Ee(O, e) {
  let a = O.pos + e;
  if (jO == a && wO == O) return vO;
  let t = O.peek(e), r = "";
  for (; or(t); )
    r += String.fromCharCode(t), t = O.peek(++e);
  return wO = O, jO = a, vO = r ? r.toLowerCase() : t == lr || t == cr ? void 0 : null;
}
const kt = 60, fe = 62, sO = 47, lr = 63, cr = 33, dr = 45;
function TO(O, e) {
  this.name = O, this.parent = e;
}
const Qr = [iO, bt, gt, Pt, St], pr = new Se({
  start: null,
  shift(O, e, a, t) {
    return Qr.indexOf(e) > -1 ? new TO(Ee(t, 1) || "", O) : O;
  },
  reduce(O, e) {
    return e == Xt && O ? O.parent : O;
  },
  reuse(O, e, a, t) {
    let r = e.type.id;
    return r == iO || r == tr ? new TO(Ee(t, 1) || "", O) : O;
  },
  strict: !1
}), ur = new P((O, e) => {
  if (O.next != kt) {
    O.next < 0 && e.context && O.acceptToken(Ze);
    return;
  }
  O.advance();
  let a = O.next == sO;
  a && O.advance();
  let t = Ee(O, 0);
  if (t === void 0) return;
  if (!t) return O.acceptToken(a ? Fa : Ba);
  let r = e.context ? e.context.name : null;
  if (a) {
    if (t == r) return O.acceptToken(Da);
    if (r && nr[r]) return O.acceptToken(Ze, -2);
    if (e.dialectEnabled(rr)) return O.acceptToken(Na);
    for (let s = e.context; s; s = s.parent) if (s.name == t) return;
    O.acceptToken(Ia);
  } else {
    if (t == "script") return O.acceptToken(gt);
    if (t == "style") return O.acceptToken(Pt);
    if (t == "textarea") return O.acceptToken(St);
    if (sr.hasOwnProperty(t)) return O.acceptToken(bt);
    r && _O[r] && _O[r][t] ? O.acceptToken(Ze, -1) : O.acceptToken(iO);
  }
}, { contextual: !0 }), fr = new P((O) => {
  for (let e = 0, a = 0; ; a++) {
    if (O.next < 0) {
      a && O.acceptToken(yO);
      break;
    }
    if (O.next == dr)
      e++;
    else if (O.next == fe && e >= 2) {
      a >= 3 && O.acceptToken(yO, -2);
      break;
    } else
      e = 0;
    O.advance();
  }
});
function hr(O) {
  for (; O; O = O.parent)
    if (O.name == "svg" || O.name == "math") return !0;
  return !1;
}
const $r = new P((O, e) => {
  if (O.next == sO && O.peek(1) == fe) {
    let a = e.dialectEnabled(ir) || hr(e.context);
    O.acceptToken(a ? La : kO, 2);
  } else O.next == fe && O.acceptToken(kO, 1);
});
function nO(O, e, a) {
  let t = 2 + O.length;
  return new P((r) => {
    for (let s = 0, i = 0, n = 0; ; n++) {
      if (r.next < 0) {
        n && r.acceptToken(e);
        break;
      }
      if (s == 0 && r.next == kt || s == 1 && r.next == sO || s >= 2 && s < t && r.next == O.charCodeAt(s - 2))
        s++, i++;
      else if (s == t && r.next == fe) {
        n > i ? r.acceptToken(e, -i) : r.acceptToken(a, -(i - 2));
        break;
      } else if ((r.next == 10 || r.next == 13) && n) {
        r.acceptToken(e, 1);
        break;
      } else
        s = i = 0;
      r.advance();
    }
  });
}
const mr = nO("script", Va, Ca), gr = nO("style", Ga, Ea), Pr = nO("textarea", Aa, Ma), Sr = Y({
  "Text RawText IncompleteTag IncompleteCloseTag": l.content,
  "StartTag StartCloseTag SelfClosingEndTag EndTag": l.angleBracket,
  TagName: l.tagName,
  "MismatchedCloseTag/TagName": [l.tagName, l.invalid],
  AttributeName: l.attributeName,
  "AttributeValue UnquotedAttributeValue": l.attributeValue,
  Is: l.definitionOperator,
  "EntityReference CharacterReference": l.character,
  Comment: l.blockComment,
  ProcessingInst: l.processingInstruction,
  DoctypeDecl: l.documentMeta
}), br = y.deserialize({
  version: 14,
  states: ",xOVO!rOOO!ZQ#tO'#CrO!`Q#tO'#C{O!eQ#tO'#DOO!jQ#tO'#DRO!oQ#tO'#DTO!tOaO'#CqO#PObO'#CqO#[OdO'#CqO$kO!rO'#CqOOO`'#Cq'#CqO$rO$fO'#DUO$zQ#tO'#DWO%PQ#tO'#DXOOO`'#Dl'#DlOOO`'#DZ'#DZQVO!rOOO%UQ&rO,59^O%aQ&rO,59gO%lQ&rO,59jO%wQ&rO,59mO&SQ&rO,59oOOOa'#D_'#D_O&_OaO'#CyO&jOaO,59]OOOb'#D`'#D`O&rObO'#C|O&}ObO,59]OOOd'#Da'#DaO'VOdO'#DPO'bOdO,59]OOO`'#Db'#DbO'jO!rO,59]O'qQ#tO'#DSOOO`,59],59]OOOp'#Dc'#DcO'vO$fO,59pOOO`,59p,59pO(OQ#|O,59rO(TQ#|O,59sOOO`-E7X-E7XO(YQ&rO'#CtOOQW'#D['#D[O(hQ&rO1G.xOOOa1G.x1G.xOOO`1G/Z1G/ZO(sQ&rO1G/ROOOb1G/R1G/RO)OQ&rO1G/UOOOd1G/U1G/UO)ZQ&rO1G/XOOO`1G/X1G/XO)fQ&rO1G/ZOOOa-E7]-E7]O)qQ#tO'#CzOOO`1G.w1G.wOOOb-E7^-E7^O)vQ#tO'#C}OOOd-E7_-E7_O){Q#tO'#DQOOO`-E7`-E7`O*QQ#|O,59nOOOp-E7a-E7aOOO`1G/[1G/[OOO`1G/^1G/^OOO`1G/_1G/_O*VQ,UO,59`OOQW-E7Y-E7YOOOa7+$d7+$dOOO`7+$u7+$uOOOb7+$m7+$mOOOd7+$p7+$pOOO`7+$s7+$sO*bQ#|O,59fO*gQ#|O,59iO*lQ#|O,59lOOO`1G/Y1G/YO*qO7[O'#CwO+SOMhO'#CwOOQW1G.z1G.zOOO`1G/Q1G/QOOO`1G/T1G/TOOO`1G/W1G/WOOOO'#D]'#D]O+eO7[O,59cOOQW,59c,59cOOOO'#D^'#D^O+vOMhO,59cOOOO-E7Z-E7ZOOQW1G.}1G.}OOOO-E7[-E7[",
  stateData: ",c~O!_OS~OUSOVPOWQOXROYTO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O|_O!eZO~OgaO~OgbO~OgcO~OgdO~OgeO~O!XfOPmP![mP~O!YiOQpP![pP~O!ZlORsP![sP~OUSOVPOWQOXROYTOZqO[]O][O^^O_^Oa^Ob^Oc^Od^Oy^O!eZO~O![rO~P#gO!]sO!fuO~OgvO~OgwO~OS|OT}OiyO~OS!POT}OiyO~OS!ROT}OiyO~OS!TOT}OiyO~OS}OT}OiyO~O!XfOPmX![mX~OP!WO![!XO~O!YiOQpX![pX~OQ!ZO![!XO~O!ZlORsX![sX~OR!]O![!XO~O![!XO~P#gOg!_O~O!]sO!f!aO~OS!bO~OS!cO~Oj!dOShXThXihX~OS!fOT!gOiyO~OS!hOT!gOiyO~OS!iOT!gOiyO~OS!jOT!gOiyO~OS!gOT!gOiyO~Og!kO~Og!lO~Og!mO~OS!nO~Ol!qO!a!oO!c!pO~OS!rO~OS!sO~OS!tO~Ob!uOc!uOd!uO!a!wO!b!uO~Ob!xOc!xOd!xO!c!wO!d!xO~Ob!uOc!uOd!uO!a!{O!b!uO~Ob!xOc!xOd!xO!c!{O!d!xO~OT~cbd!ey|!e~",
  goto: "%q!aPPPPPPPPPPPPPPPPPPPPP!b!hP!nPP!zP!}#Q#T#Z#^#a#g#j#m#s#y!bP!b!bP$P$V$m$s$y%P%V%]%cPPPPPPPP%iX^OX`pXUOX`pezabcde{!O!Q!S!UR!q!dRhUR!XhXVOX`pRkVR!XkXWOX`pRnWR!XnXXOX`pQrXR!XpXYOX`pQ`ORx`Q{aQ!ObQ!QcQ!SdQ!UeZ!e{!O!Q!S!UQ!v!oR!z!vQ!y!pR!|!yQgUR!VgQjVR!YjQmWR![mQpXR!^pQtZR!`tS_O`ToXp",
  nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag EndTag SelfClosingEndTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteTag IncompleteCloseTag Document Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName Attribute AttributeName Is AttributeValue UnquotedAttributeValue ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag CloseTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
  maxTerm: 68,
  context: pr,
  nodeProps: [
    ["closedBy", -10, 1, 2, 3, 7, 8, 9, 10, 11, 12, 13, "EndTag", 6, "EndTag SelfClosingEndTag", -4, 22, 31, 34, 37, "CloseTag"],
    ["openedBy", 4, "StartTag StartCloseTag", 5, "StartTag", -4, 30, 33, 36, 38, "OpenTag"],
    ["group", -10, 14, 15, 18, 19, 20, 21, 40, 41, 42, 43, "Entity", 17, "Entity TextContent", -3, 29, 32, 35, "TextContent Entity"],
    ["isolate", -11, 22, 30, 31, 33, 34, 36, 37, 38, 39, 42, 43, "ltr", -3, 27, 28, 40, ""]
  ],
  propSources: [Sr],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "!<p!aR!YOX$qXY,QYZ,QZ[$q[]&X]^,Q^p$qpq,Qqr-_rs3_sv-_vw3}wxHYx}-_}!OH{!O!P-_!P!Q$q!Q![-_![!]Mz!]!^-_!^!_!$S!_!`!;x!`!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4U-_4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!Z$|caPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr$qrs&}sv$qvw+Pwx(tx!^$q!^!_*V!_!a&X!a#S$q#S#T&X#T;'S$q;'S;=`+z<%lO$q!R&bXaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&Xq'UVaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}P'pTaPOv'kw!^'k!_;'S'k;'S;=`(P<%lO'kP(SP;=`<%l'kp([S!dpOv(Vx;'S(V;'S;=`(h<%lO(Vp(kP;=`<%l(Vq(qP;=`<%l&}a({WaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t`)jT!b`Or)esv)ew;'S)e;'S;=`)y<%lO)e`)|P;=`<%l)ea*SP;=`<%l(t!Q*^V!b`!dpOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!Q*vP;=`<%l*V!R*|P;=`<%l&XW+UYlWOX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+PW+wP;=`<%l+P!Z+}P;=`<%l$q!a,]`aP!b`!dp!_^OX&XXY,QYZ,QZ]&X]^,Q^p&Xpq,Qqr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!_-ljiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q[/ebiSlWOX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+PS0rXiSqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0mS1bP;=`<%l0m[1hP;=`<%l/^!V1vciSaP!b`!dpOq&Xqr1krs&}sv1kvw0mwx(tx!P1k!P!Q&X!Q!^1k!^!_*V!_!a&X!a#s1k#s$f&X$f;'S1k;'S;=`3R<%l?Ah1k?Ah?BY&X?BY?Mn1k?MnO&X!V3UP;=`<%l1k!_3[P;=`<%l-_!Z3hV!ahaP!dpOv&}wx'kx!^&}!^!_(V!_;'S&};'S;=`(n<%lO&}!_4WiiSlWd!ROX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst>]tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^/^!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!Z5zblWOX5uXZ7SZ[5u[^7S^p5uqr5urs7Sst+Ptw5uwx7Sx!]5u!]!^7w!^!a7S!a#S5u#S#T7S#T;'S5u;'S;=`8n<%lO5u!R7VVOp7Sqs7St!]7S!]!^7l!^;'S7S;'S;=`7q<%lO7S!R7qOb!R!R7tP;=`<%l7S!Z8OYlWb!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!Z8qP;=`<%l5u!_8{iiSlWOX5uXZ7SZ[5u[^7S^p5uqr8trs7Sst/^tw8twx7Sx!P8t!P!Q5u!Q!]8t!]!^:j!^!a7S!a#S8t#S#T;{#T#s8t#s$f5u$f;'S8t;'S;=`>V<%l?Ah8t?Ah?BY5u?BY?Mn8t?MnO5u!_:sbiSlWb!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!V<QciSOp7Sqr;{rs7Sst0mtw;{wx7Sx!P;{!P!Q7S!Q!];{!]!^=]!^!a7S!a#s;{#s$f7S$f;'S;{;'S;=`>P<%l?Ah;{?Ah?BY7S?BY?Mn;{?MnO7S!V=dXiSb!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!V>SP;=`<%l;{!_>YP;=`<%l8t!_>dhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^/^!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!Z@TalWOX@OXZAYZ[@O[^AY^p@Oqr@OrsAYsw@OwxAYx!]@O!]!^Az!^!aAY!a#S@O#S#TAY#T;'S@O;'S;=`Bq<%lO@O!RA]UOpAYq!]AY!]!^Ao!^;'SAY;'S;=`At<%lOAY!RAtOc!R!RAwP;=`<%lAY!ZBRYlWc!ROX+PZ[+P^p+Pqr+Psw+Px!^+P!a#S+P#T;'S+P;'S;=`+t<%lO+P!ZBtP;=`<%l@O!_COhiSlWOX@OXZAYZ[@O[^AY^p@OqrBwrsAYswBwwxAYx!PBw!P!Q@O!Q!]Bw!]!^Dj!^!aAY!a#SBw#S#TE{#T#sBw#s$f@O$f;'SBw;'S;=`HS<%l?AhBw?Ah?BY@O?BY?MnBw?MnO@O!_DsbiSlWc!ROX+PZ[+P^p+Pqr/^sw/^x!P/^!P!Q+P!Q!^/^!a#S/^#S#T0m#T#s/^#s$f+P$f;'S/^;'S;=`1e<%l?Ah/^?Ah?BY+P?BY?Mn/^?MnO+P!VFQbiSOpAYqrE{rsAYswE{wxAYx!PE{!P!QAY!Q!]E{!]!^GY!^!aAY!a#sE{#s$fAY$f;'SE{;'S;=`G|<%l?AhE{?Ah?BYAY?BY?MnE{?MnOAY!VGaXiSc!Rqr0msw0mx!P0m!Q!^0m!a#s0m$f;'S0m;'S;=`1_<%l?Ah0m?BY?Mn0m!VHPP;=`<%lE{!_HVP;=`<%lBw!ZHcW!cxaP!b`Or(trs'ksv(tw!^(t!^!_)e!_;'S(t;'S;=`*P<%lO(t!aIYliSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OKQ!O!P-_!P!Q$q!Q!^-_!^!_*V!_!a&X!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!aK_kiSaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx!P-_!P!Q$q!Q!^-_!^!_*V!_!`&X!`!aMS!a#S-_#S#T1k#T#s-_#s$f$q$f;'S-_;'S;=`3X<%l?Ah-_?Ah?BY$q?BY?Mn-_?MnO$q!TM_XaP!b`!dp!fQOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X!aNZ!ZiSgQaPlW!b`!dpOX$qXZ&XZ[$q[^&X^p$qpq&Xqr-_rs&}sv-_vw/^wx(tx}-_}!OMz!O!PMz!P!Q$q!Q![Mz![!]Mz!]!^-_!^!_*V!_!a&X!a!c-_!c!}Mz!}#R-_#R#SMz#S#T1k#T#oMz#o#s-_#s$f$q$f$}-_$}%OMz%O%W-_%W%oMz%o%p-_%p&aMz&a&b-_&b1pMz1p4UMz4U4dMz4d4e-_4e$ISMz$IS$I`-_$I`$IbMz$Ib$Je-_$Je$JgMz$Jg$Kh-_$Kh%#tMz%#t&/x-_&/x&EtMz&Et&FV-_&FV;'SMz;'S;:j!#|;:j;=`3X<%l?&r-_?&r?AhMz?Ah?BY$q?BY?MnMz?MnO$q!a!$PP;=`<%lMz!R!$ZY!b`!dpOq*Vqr!$yrs(Vsv*Vwx)ex!a*V!a!b!4t!b;'S*V;'S;=`*s<%lO*V!R!%Q]!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!%y!O!f*V!f!g!']!g#W*V#W#X!0`#X;'S*V;'S;=`*s<%lO*V!R!&QX!b`!dpOr*Vrs(Vsv*Vwx)ex}*V}!O!&m!O;'S*V;'S;=`*s<%lO*V!R!&vV!b`!dp!ePOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!'dX!b`!dpOr*Vrs(Vsv*Vwx)ex!q*V!q!r!(P!r;'S*V;'S;=`*s<%lO*V!R!(WX!b`!dpOr*Vrs(Vsv*Vwx)ex!e*V!e!f!(s!f;'S*V;'S;=`*s<%lO*V!R!(zX!b`!dpOr*Vrs(Vsv*Vwx)ex!v*V!v!w!)g!w;'S*V;'S;=`*s<%lO*V!R!)nX!b`!dpOr*Vrs(Vsv*Vwx)ex!{*V!{!|!*Z!|;'S*V;'S;=`*s<%lO*V!R!*bX!b`!dpOr*Vrs(Vsv*Vwx)ex!r*V!r!s!*}!s;'S*V;'S;=`*s<%lO*V!R!+UX!b`!dpOr*Vrs(Vsv*Vwx)ex!g*V!g!h!+q!h;'S*V;'S;=`*s<%lO*V!R!+xY!b`!dpOr!+qrs!,hsv!+qvw!-Swx!.[x!`!+q!`!a!/j!a;'S!+q;'S;=`!0Y<%lO!+qq!,mV!dpOv!,hvx!-Sx!`!,h!`!a!-q!a;'S!,h;'S;=`!.U<%lO!,hP!-VTO!`!-S!`!a!-f!a;'S!-S;'S;=`!-k<%lO!-SP!-kO|PP!-nP;=`<%l!-Sq!-xS!dp|POv(Vx;'S(V;'S;=`(h<%lO(Vq!.XP;=`<%l!,ha!.aX!b`Or!.[rs!-Ssv!.[vw!-Sw!`!.[!`!a!.|!a;'S!.[;'S;=`!/d<%lO!.[a!/TT!b`|POr)esv)ew;'S)e;'S;=`)y<%lO)ea!/gP;=`<%l!.[!R!/sV!b`!dp|POr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!0]P;=`<%l!+q!R!0gX!b`!dpOr*Vrs(Vsv*Vwx)ex#c*V#c#d!1S#d;'S*V;'S;=`*s<%lO*V!R!1ZX!b`!dpOr*Vrs(Vsv*Vwx)ex#V*V#V#W!1v#W;'S*V;'S;=`*s<%lO*V!R!1}X!b`!dpOr*Vrs(Vsv*Vwx)ex#h*V#h#i!2j#i;'S*V;'S;=`*s<%lO*V!R!2qX!b`!dpOr*Vrs(Vsv*Vwx)ex#m*V#m#n!3^#n;'S*V;'S;=`*s<%lO*V!R!3eX!b`!dpOr*Vrs(Vsv*Vwx)ex#d*V#d#e!4Q#e;'S*V;'S;=`*s<%lO*V!R!4XX!b`!dpOr*Vrs(Vsv*Vwx)ex#X*V#X#Y!+q#Y;'S*V;'S;=`*s<%lO*V!R!4{Y!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!a!4t!a!b!:]!b;'S!4t;'S;=`!;r<%lO!4tq!5pV!dpOv!5kvx!6Vx!a!5k!a!b!7W!b;'S!5k;'S;=`!8V<%lO!5kP!6YTO!a!6V!a!b!6i!b;'S!6V;'S;=`!7Q<%lO!6VP!6lTO!`!6V!`!a!6{!a;'S!6V;'S;=`!7Q<%lO!6VP!7QOyPP!7TP;=`<%l!6Vq!7]V!dpOv!5kvx!6Vx!`!5k!`!a!7r!a;'S!5k;'S;=`!8V<%lO!5kq!7yS!dpyPOv(Vx;'S(V;'S;=`(h<%lO(Vq!8YP;=`<%l!5ka!8bX!b`Or!8]rs!6Vsv!8]vw!6Vw!a!8]!a!b!8}!b;'S!8];'S;=`!:V<%lO!8]a!9SX!b`Or!8]rs!6Vsv!8]vw!6Vw!`!8]!`!a!9o!a;'S!8];'S;=`!:V<%lO!8]a!9vT!b`yPOr)esv)ew;'S)e;'S;=`)y<%lO)ea!:YP;=`<%l!8]!R!:dY!b`!dpOr!4trs!5ksv!4tvw!6Vwx!8]x!`!4t!`!a!;S!a;'S!4t;'S;=`!;r<%lO!4t!R!;]V!b`!dpyPOr*Vrs(Vsv*Vwx)ex;'S*V;'S;=`*s<%lO*V!R!;uP;=`<%l!4t!V!<TXjSaP!b`!dpOr&Xrs&}sv&Xwx(tx!^&X!^!_*V!_;'S&X;'S;=`*y<%lO&X",
  tokenizers: [mr, gr, Pr, $r, ur, fr, 0, 1, 2, 3, 4, 5],
  topRules: { Document: [0, 16] },
  dialects: { noMatch: 0, selfClosing: 515 },
  tokenPrec: 517
});
function yt(O, e) {
  let a = /* @__PURE__ */ Object.create(null);
  for (let t of O.getChildren(xt)) {
    let r = t.getChild(Ka), s = t.getChild(Ge) || t.getChild(Zt);
    r && (a[e.read(r.from, r.to)] = s ? s.type.id == Ge ? e.read(s.from + 1, s.to - 1) : e.read(s.from, s.to) : "");
  }
  return a;
}
function qO(O, e) {
  let a = O.getChild(Ja);
  return a ? e.read(a.from, a.to) : " ";
}
function ke(O, e, a) {
  let t;
  for (let r of a)
    if (!r.attrs || r.attrs(t || (t = yt(O.node.parent.firstChild, e))))
      return { parser: r.parser, bracketed: !0 };
  return null;
}
function _t(O = [], e = []) {
  let a = [], t = [], r = [], s = [];
  for (let n of O)
    (n.tag == "script" ? a : n.tag == "style" ? t : n.tag == "textarea" ? r : s).push(n);
  let i = e.length ? /* @__PURE__ */ Object.create(null) : null;
  for (let n of e) (i[n.name] || (i[n.name] = [])).push(n);
  return Qt((n, o) => {
    let d = n.type.id;
    if (d == Ha) return ke(n, o, a);
    if (d == er) return ke(n, o, t);
    if (d == Or) return ke(n, o, r);
    if (d == Xt && s.length) {
      let Q = n.node, c = Q.firstChild, p = c && qO(c, o), u;
      if (p) {
        for (let f of s)
          if (f.tag == p && (!f.attrs || f.attrs(u || (u = yt(c, o))))) {
            let m = Q.lastChild, $ = m.type.id == ar ? m.from : Q.to;
            if ($ > c.to)
              return { parser: f.parser, overlay: [{ from: c.to, to: $ }] };
          }
      }
    }
    if (i && d == xt) {
      let Q = n.node, c;
      if (c = Q.firstChild) {
        let p = i[o.read(c.from, c.to)];
        if (p) for (let u of p) {
          if (u.tagName && u.tagName != qO(Q.parent, o)) continue;
          let f = Q.lastChild;
          if (f.type.id == Ge) {
            let m = f.from + 1, $ = f.lastChild, g = f.to - ($ && $.isError ? 0 : 1);
            if (g > m) return { parser: u.parser, overlay: [{ from: m, to: g }], bracketed: !0 };
          } else if (f.type.id == Zt)
            return { parser: u.parser, overlay: [{ from: f.from, to: f.to }] };
        }
      }
    }
    return null;
  });
}
const Xr = 148, YO = 1, xr = 149, Zr = 150, vt = 2, kr = 151, yr = 3, _r = 4, vr = 152, wt = [
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
], wr = 58, jr = 40, jt = 95, Tr = 91, ce = 45, qr = 46, Yr = 35, Rr = 37, zr = 38, Wr = 92, Ur = 10, Vr = 42;
function ae(O) {
  return O >= 65 && O <= 90 || O >= 97 && O <= 122 || O >= 161;
}
function oO(O) {
  return O >= 48 && O <= 57;
}
function RO(O) {
  return oO(O) || O >= 97 && O <= 102 || O >= 65 && O <= 70;
}
const Tt = (O, e, a) => (t, r) => {
  for (let s = !1, i = 0, n = 0; ; n++) {
    let { next: o } = t;
    if (ae(o) || o == ce || o == jt || s && oO(o))
      !s && (o != ce || n > 0) && (s = !0), i === n && o == ce && i++, t.advance();
    else if (o == Wr && t.peek(1) != Ur) {
      if (t.advance(), RO(t.next)) {
        do
          t.advance();
        while (RO(t.next));
        t.next == 32 && t.advance();
      } else t.next > -1 && t.advance();
      s = !0;
    } else {
      s && t.acceptToken(
        i >= 2 && r.canShift(vt) ? e : o == jr ? a : O
      );
      break;
    }
  }
}, Cr = new P(
  Tt(xr, vt, Zr),
  { contextual: !0 }
), Gr = new P(
  Tt(kr, yr, _r),
  { contextual: !0 }
), Er = new P((O) => {
  if (wt.includes(O.peek(-1))) {
    let { next: e } = O;
    (ae(e) || e == jt || e == Yr || e == qr || e == Vr || e == Tr || e == wr && ae(O.peek(1)) || e == ce || e == zr) && O.acceptToken(Xr);
  }
}), Ar = new P((O) => {
  if (!wt.includes(O.peek(-1))) {
    let { next: e } = O;
    if (e == Rr && (O.advance(), O.acceptToken(YO)), ae(e)) {
      do
        O.advance();
      while (ae(O.next) || oO(O.next));
      O.acceptToken(YO);
    }
  }
});
function zO(O) {
  return /^#[a-f\d]{3}([a-f\d]{3}([a-f\d]{2})?)?$/i.test(O) ? vr : -1;
}
const Mr = Y({
  "AtKeyword import charset namespace keyframes media supports font-feature-values": l.definitionKeyword,
  "from to selector scope MatchFlag": l.keyword,
  NamespaceName: l.namespace,
  KeyframeName: l.labelName,
  KeyframeRangeName: l.operatorKeyword,
  TagName: l.tagName,
  ClassName: l.className,
  PseudoClassName: l.constant(l.className),
  IdName: l.labelName,
  "FeatureName PropertyName": l.propertyName,
  AttributeName: l.attributeName,
  NumberLiteral: l.number,
  KeywordQuery: l.keyword,
  UnaryQueryOp: l.operatorKeyword,
  "CallTag ValueName FontName": l.atom,
  VariableName: l.variableName,
  Callee: l.operatorKeyword,
  Unit: l.unit,
  "UniversalSelector NestingSelector": l.definitionOperator,
  "MatchOp CompareOp": l.compareOperator,
  "ChildOp SiblingOp, LogicOp": l.logicOperator,
  BinOp: l.arithmeticOperator,
  Important: l.modifier,
  Comment: l.blockComment,
  ColorLiteral: l.color,
  "ParenthesizedContent StringLiteral": l.string,
  ":": l.punctuation,
  PseudoOp: l.derefOperator,
  "; , |": l.separator,
  "( )": l.paren,
  "[ ]": l.squareBracket,
  "{ }": l.brace
}), Lr = { __proto__: null, lang: 44, "nth-child": 44, "nth-last-child": 44, "nth-of-type": 44, "nth-last-of-type": 44, dir: 44, "host-context": 44, if: 88, url: 158, "url-prefix": 158, domain: 158, regexp: 158 }, Dr = { __proto__: null, or: 102, and: 102, not: 112, only: 112, layer: 212 }, Nr = { __proto__: null, selector: 118, style: 124, layer: 208 }, Ir = { __proto__: null, "@import": 204, "@media": 216, "@charset": 220, "@namespace": 224, "@keyframes": 230, "@supports": 242, "@scope": 246, "@font-feature-values": 252 }, Br = { __proto__: null, to: 249 }, Fr = y.deserialize({
  version: 14,
  states: "MrQYQdOOO$TQdOOP$[O`OOO%XQaO'#CfOOQP'#Ce'#CeO%`QdO'#CgO%eQ`O'#CgO%jQaO'#FrO&eQdO'#CkO'XQaO'#CcO'cQdO'#CnOOQP'#ES'#ESOOQP'#ER'#ERO'nQdO'#ETO'yQdO'#E[O'yQdO'#E_OOQP'#Fr'#FrO)`QhO'#FQOOQS'#Fq'#FqOOQS'#FT'#FTQYQdOOO)gQdO'#EeO*vQhO'#EkO)gQdO'#EmO*}QdO'#EoO+YQdO'#ErO*[QhO'#ExO+bQdO'#EzO+mQdO'#E}O+rQaO'#CfO+yQ`O'#EbO,OQ`O'#GPO,ZQdO'#GPQOQ`OOP,eO&jO'#CaPOOO)CAa)CAaOOQP'#Ci'#CiOOQP,59R,59RO%`QdO,59ROOQP'#Cm'#CmOOQP,59V,59VO&eQdO,59VO,pQdO,59YOOQP,5:m,5:mO'nQdO,5:oO'yQdO,5:vO'yQdO,5:xO'yQdO,5:yO'yQdO'#F[O,{Q`O,58}O-TQdO'#EaOOQS,58},58}OOQP'#Cq'#CqOOQO'#EP'#EPOOQP,59Y,59YO-[Q`O,59YO-aQ`O,59YO-fQpO'#EUO-qQdO'#EVO-vQ`O'#EVO-{QpO,5:oO.iQaO,5:vO/PQaO,5:yOOQW'#D]'#D]O0OQhO'#DgO0cQhO,5;lO*[QhO'#DeO0pQ`O'#DnO0uQhO'#D{OOQW'#Fx'#FxOOQS,5;l,5;lO0zQ`O'#DhO1PQ`O'#DkOOQS-E9R-E9ROOQ['#Cv'#CvO1UQdO'#CwO1iQdO'#C|O1|QdO'#DPOOQ['#DQ'#DQO2aQ!pO'#DRO4jQ!jO,5;POOQO'#DW'#DWO-aQ`O'#DVO4zQ!nO'#FuO6}Q`O'#DXO7SQ`O'#D|OOQ['#Fu'#FuO7XQhO'#GSO7gQ`O,5;VO7lQ!bO,5;XOOQS'#Eq'#EqO7tQ`O,5;ZO7yQdO,5;ZOOQO'#Et'#EtO8RQ`O,5;^O8WQhO,5;dO'yQdO'#DjOOQS,5;f,5;fO0zQ`O,5;fO8`QdO,5;fOOQS'#Fc'#FcO8hQdO'#FPO7gQ`O,5;iO8pQdO,5:|O9QQdO'#F^O9_Q`O,5<kO9_Q`O,5<kPOOO'#FS'#FSP9jO&jO,58{POOO,58{,58{OOQP1G.m1G.mOOQP1G.q1G.qOOQP1G.t1G.tO-[Q`O1G.tO-aQ`O1G.tO9uQpO1G0ZO9}QaO1G0bO:eQaO1G0dO:{QaO1G0eO;cQaO,5;vOOQO-E9Y-E9YOOQS1G.i1G.iO;mQ`O,5:{O;rQdO'#EQO;yQdO'#CuOOQO'#EX'#EXOOQO,5:q,5:qO-qQdO,5:qOOQP1G0Z1G0ZO)gQdO1G0ZO<QQ!jO'#D]O<`Q!bO,59xO<hQhO,5:ROOQO'#Dc'#DcOOQO'#Fy'#FyO<cQ!bO,59|O<pQhO'#FdO*[QhO,59zO*[QhO'#FdO=hQhO1G1WOOQS1G1W1G1WO=rQhO,5:PO>mQhO'#DoOOQW,5:Y,5:YOOQW,5:g,5:gOOQW,5:S,5:SO>wQhO,5:VO?cQ!fO'#FvOOQS'#Fv'#FvOOQS'#FV'#FVO@pQdO,59cOOQ[,59c,59cOATQdO,59hOOQ[,59h,59hOAhQdO,59kOOQ[,59k,59kOOQ[,59m,59mO)gQdO,59oOA{QhO'#EgOOQW'#Eg'#EgOBjQ`O1G0kO4sQhO1G0kOOQ[,59q,59qO*[QhO'#DZOOQ[,59s,59sOBoQ#tO,5:hOBzQhO'#F`OCXQ`O,5<nOOQS1G0q1G0qOOQS1G0s1G0sOOQS1G0u1G0uOCdQ`O1G0uOCiQdO'#EuOOQS1G0x1G0xOOQS1G1O1G1OOCtQaO,5:UO7gQ`O1G1QOOQS1G1Q1G1QO0zQ`O1G1QOOQS-E9a-E9aOOQS1G1T1G1TOC{Q!fO1G0hODcQ`O'#EdOOQO1G0h1G0hOOQO,5;x,5;xODhQdO,5;xOOQO-E9[-E9[ODuQ`O1G2VPOOO-E9Q-E9QPOOO1G.g1G.gOOQP7+$`7+$`OOQP7+%u7+%uO)gQdO7+%uOOQS1G0g1G0gOEQQaO'#F}OE[Q`O,5:lOEaQ!fO'#FUOF_QdO'#FtOFiQ`O,59aOOQO1G0]1G0]OFnQ!bO7+%uO)gQdO1G/dOFyQhO1G/hOOQW1G/m1G/mOOQW1G/f1G/fOG[QhO,5<OOOQW-E9b-E9bOOQS7+&r7+&rOHSQhO'#D]OHbQhO'#F|OHmQ`O'#F|OHrQ`O,5:ZOHwQ!bO'#D_O>wQhO'#DmOISQhO'#DsOI[QhO'#DuOIaQ!jO'#F{OOQO'#F{'#F{OIlQ`O'#DxOItQ!bO'#DzOOQO'#Fz'#FzOIyQ`O1G/qOOQS-E9T-E9TOOQ[1G.}1G.}OOQ[1G/S1G/SOOQ[1G/V1G/VOOQ[1G/Z1G/ZOJOQdO,5;ROOQS7+&V7+&VOJTQ`O7+&VOJYQhO'#D[OJbQ`O,59uO*[QhO,59uOOQ[1G0S1G0SOJjQ`O1G0SOJoQhO,5;zOOQO-E9^-E9^OOQS7+&a7+&aOJ}QbO'#DROOQO'#Ew'#EwOK]Q`O'#EvOOQO'#Ev'#EvOKhQ`O'#FaOKpQdO,5;aOOQS,5;a,5;aOOQ[1G/p1G/pOOQS7+&l7+&lO7gQ`O7+&lOK{Q!fO'#F]O)gQdO'#F]OMSQdO7+&SOOQO7+&S7+&SOOQO,5;O,5;OOOQO1G1d1G1dOMgQ!bO<<IaOMrQdO'#FZOM|Q`O,5<iOOQP1G0W1G0WOOQS-E9S-E9SONUQdO'#FYON`Q`O,5<`OOQ]1G.{1G.{OOQP<<Ia<<IaONhQ`O<<IaONmQdO7+%OOOQO'#D_'#D_ONtQ!bO7+%SON|QhO'#FXO! ZQ`O,5<hO)gQdO,5<hOOQW1G/u1G/uO! cQ`O,5:XO>wQhO'#DtOOQO,5:_,5:_O! hQhO,5:aO! pQhO,5:fO)gQdO,5:dOOQW7+%]7+%]OOQO'#Ei'#EiO! wQ`O1G0mOOQS<<Iq<<IqO)gQdO,59vO!!kQhO1G/aOOQ[1G/a1G/aO!!rQ`O1G/aOOQW-E9U-E9UOOQ[7+%n7+%nOOQO,5;b,5;bOClQdO'#FbOKhQ`O,5;{OOQS,5;{,5;{OOQS-E9_-E9_OOQS1G0{1G0{OOQS<<JW<<JWO!!zQ!fO,5;wOOQS-E9Z-E9ZOOQO<<In<<InOOQPAN>{AN>{O!$RQ`OAN>{O!$WQaO,5;uOOQO-E9X-E9XO!$bQdO,5;tOOQO-E9W-E9WOOQW<<Hj<<HjOOQW<<Hn<<HnO!$lQhO<<HnO!$}QhO'#D]O!%]QhO,5;sO!%hQ`O,5;sOOQO-E9V-E9VO!%mQdO1G2SO!%wQhO1G/sO!&PQ`O,5:`O>wQhO'#DwOOQO1G/{1G/{O!&UQ!bO1G0QO!&^QdO1G0OOJOQdO'#F_O!&eQ`O7+&XOOQW7+&X7+&XO!&mQ!bO1G/bOOQ[7+${7+${O!&xQhO7+${P!'PQ`O'#FWOOQO,5;|,5;|OOQO-E9`-E9`OOQS1G1g1G1gOOQPG24gG24gO!'UQ`OAN>YO)gQdO1G1_O!'ZQ`O7+'nOOQO1G/z1G/zO!'cQ`O,5:cO!'hQhO7+%lOOQO,5;y,5;yOOQO-E9]-E9]OOQW<<Is<<IsOOQ[<<Hg<<HgPOQW,5;r,5;rOOQWG23tG23tO!'oQdO7+&yOOQO1G/}1G/}OOQO<<IW<<IW",
  stateData: "!(S~O$`OS$aQQ~OWVO^`O`WOcYOdYOlaOo]O#P^O#S_O#YeO#`fO#bgO#dhO#giO#mjO#okO#rlO$ZRO$^ZO$gTO$rZO~OQnOWVO^`O`WOcYOdYOlaOo]O#P^O#S_O#YeO#`fO#bgO#dhO#giO#mjO#okO#rlO$ZmO$^ZO$gTO$rZO~O$X$sP~P!mO$arO~O`YXcYXdYXoYXrYX!eYX#PYX#SYX$YYX$^YX$g[X$rYX~OgYX~P$aO$ZtO~O$gvO~O$gvO`$fXc$fXd$fXo$fXr$fX!e$fX#P$fX#S$fX$Y$fX$^$fX$r$fXg$fX~O$ZwO~O`yOczOdzOo|O#P}O#S!PO$Y!OO$^ZO$rZO~Or!SO!e!QO~P&jOf!YO$Z!UO$[!VO~OW!]O$Z!ZO$g![O~OWVO^`O`WOcYOdYOo]O#P^O#S_O$ZRO$^ZO$gTO$rZO~OS!eOc!fOd!fOh!bOr!SO!Y!dO!]!iO!`!jO$]!aO~Om!hO~P(qOQ!uOh!mOo!nOr!oOv!xO|!vO!q!wO$Z!lO$[!sO$^!pO$k!qO~OS!eOc!fOd!fOh!bO!Y!dO!]!iO!`!jO$]!aO~Or$vP~P*[Ov!}O!q!wO$Z!|O~Ov#PO$Z#PO~Oh#SOr!SO#p#UO~O$Z#WO~Oc#VX~P$aOc#ZO~Om#[O$X$sXq$sX~O$X$sXq$sX~P!mO$b#_O$c#_O$d#aO~Of#fO$Z!UO$[!VO~Or!SO!e!QO~Oq$sP~P!mOh#oO~Oh#pO~On!xX!|!xX$g!zX~O$Z#qO~O$g#sO~On#tO!|#uO~O`yOczOdzOo|O$^ZO$rZO~Or#Oa!e#Oa#P#Oa#S#Oa$Y#Oag#Oa~P.TOr#Ra!e#Ra#P#Ra#S#Ra$Y#Rag#Ra~P.TOS!eOc!fOd!fOh!bO!Y!dO!]!iO!`!jO~OR#zOv#zO$]#vO$^#yO$k!qO~P/gOm$QO!T#}O!e$OO~P(qOh$SO~O$]$UO~Oh#SO~Oh$WO~O`$YOc$YOg$]Ol$YOm$YO~P)gO`$YOc$YOl$YOm$YOn$_O~P)gO`$YOc$YOl$YOm$YOq$aO~P)gOP$bOSuXcuXduXhuXmuXxuX!YuX!]uX!`uX#[uX#^uX$]uX!WuXQuX`uXguXluXouXruXvuX|uX!quX$ZuX$[uX$^uX$kuXnuXquX!euX$XuX$uuX!}uX~Ox$cO#[$dO#^$eOm$vP~P*[Oh#pOS$iXc$iXd$iXm$iXx$iX!Y$iX!]$iX!`$iX#[$iX#^$iX$]$iXQ$iX`$iXg$iXl$iXo$iXr$iXv$iX|$iX!q$iX$Z$iX$[$iX$^$iX$k$iXn$iXq$iX!e$iX$X$iX$u$iX!}$iX~Oh$iO~Oh$kO~O!T#}O!e$lOr$vXm$vX~Or!SO~Om$oOx$cO~Om$pO~Ov$qO!q!wO~Or$rO~Or!SO!T#}O~Or!SO#p$xO~O$Z#WOr#sX~O$u$|Om#Ua$X#Uaq#Ua~P)gOm$QX$X$QXq$QX~P!mOm#[O$X$saq$sa~O$b#_O$c#_O$d%TO~On%VO!|%WO~Or#Oi!e#Oi#P#Oi#S#Oi$Y#Oig#Oi~P.TOr#Qi!e#Qi#P#Qi#S#Qi$Y#Qig#Qi~P.TOr#Ri!e#Ri#P#Ri#S#Ri$Y#Rig#Ri~P.TOr$Oa!e$Oa~P&jOq%XO~Og$qP~P'yOg$hP~P)gOc!RXg!PX!T!PX!W!RX~Oc%aO!W%bO~Og%cO!T#}O~O!T#}OS$WXc$WXd$WXh$WXm$WXr$WX!Y$WX!]$WX!`$WX!e$WX$]$WX~Om%gO!e$OO~P(qO!T#}OS!Xac!Xad!Xah!Xam!Xar!Xa!Y!Xa!]!Xa!`!Xa!e!Xa$]!Xag!Xa~O$]%hOg$pP~P/gOR#zOS!eOh%mOv#zO!Y%nO$]%lO$^#yO$k!qO~Ox$cOQ$jX`$jXc$jXg$jXh$jXl$jXm$jXo$jXr$jXv$jX|$jX!q$jX$Z$jX$[$jX$^$jX$k$jXn$jXq$jX~O`$YOc$YOg%wOl$YOm$YO~P)gO`$YOc$YOl$YOm$YOn%xO~P)gO`$YOc$YOl$YOm$YOq%yO~P)gOh%{OS#ZXc#ZXd#ZXm#ZX!Y#ZX!]#ZX!`#ZX$]#ZX~Om%|O~Og&ROv&SO!r&SO~Or$SX!e$SXm$SX~P*[O!e$lOr$vam$va~Om&VO~Oq&^O$Z&XO$k&WO~Og&_O~P&jOx$cO!e&cO$u$|Om#Ui$X#Uiq#Ui~P)gO$t&fO~Om$Qa$X$Qaq$Qa~P!mOm#[O$X$siq$si~O!e&iOg$qX~P&jOg&kO~Ox$cOQ#xXg#xXh#xXo#xXr#xXv#xX|#xX!e#xX!q#xX$Z#xX$[#xX$^#xX$k#xX~O!e&mOg$hX~P)gOg&oO~On&pOx$cO!}&qO~OR#zOv#zO$]&sO$^#yO$k!qO~O!T#}OS$Wac$Wad$Wah$Wam$War$Wa!Y$Wa!]$Wa!`$Wa!e$Wa$]$Wa~Oc!dXg!PX!T!PX!e!PX~O!T#}O!e&uOg$pX~Oc&wO~Og&xO~Oc!mXg!mX!W!RX~OS!eOh&zO~O!T&|O~O!T&|O!W&}Og$oX~Oc'OOg!lX~O!W&}O~Og'PO~O$Z'QO~Om'SO~Oc'TO!T#}O~Og'VOm'UO~Og'YO~O!T#}Or$Sa!e$Sam$Sa~OP$bOruX!euXguX~O$k&WOr#jX!e#jX~Or!SO!e'[O~Oq'`O$Z&XO$k&WO~Ox$cOQ$PXh$PXm$PXo$PXr$PXv$PX|$PX!e$PX!q$PX$X$PX$Z$PX$[$PX$^$PX$k$PX$u$PXq$PX~O!e&cO$u$|Om#Uq$X#Uqq#Uq~P)gOn'eOx$cO!}'fO~Og#}X!e#}X~P'yO!e&iOg$qa~Og#|X!e#|X~P)gO!e&mOg$ha~On'eO~Og'kO~P)gOg'lO!W'mO~O$]'nOg#{X!e#{X~P/gO!e&uOg$pa~Og'sO~OS!eOh'uO~OS!eO~PFyO`'yOg'{O~OS#zac#zad#zah#za!Y#za!]#za!`#za$]#za~Og'}O~P!!POg'}Om(OO~Ox$cOQ$Pah$Pam$Pao$Par$Pav$Pa|$Pa!e$Pa!q$Pa$X$Pa$Z$Pa$[$Pa$^$Pa$k$Pa$u$Paq$Pa~On(TO~Og#}a!e#}a~P&jOg#|a!e#|a~P)gOR#zOv#zO$]&sO$^#yO$k&WO~Oc!fXg!PX!T!PX!e!PX~O!T#}Og#{a!e#{a~Oc(VO~O!e&uOg$pi~P)gOg!ai!T!ji~Og(XO~O!W(ZOg!ni~Og!li~P)gO`'yOg(^O~Ox$cOg!Oim!Oi~Og(_O~P!!POm(`O~Og(aO~O!e&uOg$pq~Og(cO~OS!eO~P!$lOg#{q!e#{q~P)gO$`!r$a$k`$kx#S~",
  goto: "8^$wPPPPP$xP${P%U%h%U%z&^P%UP&d%UPP&jPPP&p&z&zPPPP&zPP&z&z'jP&zP&z(m&zP)])`)f)f)x)fP)f*_P)fP)f)fP*j)fP*v*|+r+uP+x*v+{*v,O,U,X,_,X)f,ePP-Z-a%U-g%U.V.V.].aPP%UP%U%UP.g/c/p/w${P0QP0TP${P${P${P0Z${P0^0a0d0k${P${PP${P0p${P0s0y1Y1t2S2Y2d2j2p2v2|3W3^3d3j3p3vPPPPPPPPPPPP3|4VP4{5O6SP6[7U7k,X7w7zP7}PP8TRsQ_bOPdp!S#[%Pq`OP^_dp}!O!P!Q!S#S#[#o%P&iqSOP^_dp}!O!P!Q!S#S#[#o%P&iqUOP^_dp}!O!P!Q!S#S#[#o%P&iQuTR#bvQxWR#cyQ!WYR#dzQ#d!YS$h!t!uR%U#f!Z!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(b!Y!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bb#z!b$W%b%m&z&}'m'u(ZU&Z$r&]'[R'Z&Y!Z!teg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bR$j!vQ&P$iR'W&Qq!gafj!b!c!d!r#}$O$P$S$g$i$l&Q&uQ#w!bW%s$W%m&z'uQ&t%bQ'w&}Q(U'mR(d(Zc#z!b$W%b%m&z&}'m'u(ZQ#VkQ$V!iQ$v#UR&a$xX%q$W%m&z'up!gafj!b!c!d!r#}$O$P$S$g$i$l&Q&uW%p$W%m&z'uQ&{%nQ'v&|Q'w&}R(d(ZR$T!eR%j$SR'p&uR&{%nX%o$W%m&z'uR'v&|X%t$W%m&z'uX%r$W%m&z'u!Y!xeg!m!n!o#Z#p#u$[$^$`$c${%W%]%a&c&d&m&r&w'O'T'i'r'x(V(bQ!}hR$q#OQ!XYR#ezQ#d!XR%U#ep[OP^_dp}!O!P!Q!S#S#[#o%P&ie{X!_!`#h#i#j#k$u%Y'gQ!^]R#g|T!]]|Q#r![R%_#sQ!TXQ!haQ#TkQ#m!RQ$Q!cQ$n!zQ$t#RQ$w#VQ$z#YQ%g$PQ&`$vQ'^&[Q'a&aR(S']SoP!SQ#^pQ%O#[R&g%PZnPp!S#[%PQ$}#ZQ&e${R'd&dR$g!rQ'R%{R(['yR#OhR#QiR$s#QS&[$r&]R(Q'[V&Y$r&]'[R#YlQ#`rR%S#`QdOSpP!SU!kdp%PR%P#[Q%]#p[&l%]&r'i'r'x(bQ&r%aQ'i&mQ'r&wQ'x'OR(b(VQ$[!mQ$^!nQ$`!oV%v$[$^$`Q&Q$iR'X&QQ&v%iS'q&v(WR(W'rQ&n%]R'j&nQ&j%YR'h&jQ!RXR#l!RQ&d${R'c&dQ#]oS%Q#]%RR%R#^Q'z'RR(]'zQ$m!yR&U$mQ&]$rR'_&]Q']&[R(R']Q#XlR$y#XQ$P!cR%f$P_cOPdp!S#[%P^XOPdp!S#[%PQ!_^Q!`_Q#h}Q#i!OQ#j!PQ#k!QQ$u#SQ%Y#oR'g&iR%^#pQ!reQ!{g[$X!m!n!o$[$^$`Q${#Zh%[#p%]%a&m&r&w'O'i'r'x(V(bQ%`#uQ%z$cS&b${&dQ&h%WQ'b&cR'|'T]$Z!m!n!o$[$^$`Q!caU!yf!r$gQ#RjQ#x!bS#|!c$PQ$R!dQ%d#}Q%e$OQ%i$SS&O$i&QQ&T$lR'o&uQ#{!bW%s$W%m&z'uQ&t%bQ'w&}Q(U'mR(d(ZQ%u$WQ&y%mQ't&zR(Y'uR%k$SR%Z#oQqPR#n!SQ!zfQ$f!rR%}$g",
  nodeNames: "⚠ Unit VariableName VariableName QueryCallee Comment StyleSheet RuleSet UniversalSelector TagSelector TagName NamespacedTagSelector NamespaceName TagName NestingSelector ClassSelector . ClassName PseudoClassSelector : :: PseudoClassName PseudoClassName ) ( ArgList ValueName ParenthesizedValue AtKeyword ; ] [ BracketedValue } { BracedValue ColorLiteral NumberLiteral StringLiteral BinaryExpression BinOp CallExpression Callee IfExpression if ArgList IfBranch KeywordQuery FeatureQuery FeatureName BinaryQuery LogicOp ComparisonQuery ColorLiteral CompareOp UnaryQuery UnaryQueryOp ParenthesizedQuery SelectorQuery selector ParenthesizedSelector StyleQuery style ParenthesedQuery CallQuery ArgList PropertyName , PropertyName UnaryQuery ParenthesedQuery BinaryQuery ParenthesedQuery ParenthesedQuery StyleFeature PropertyName StyleRange PseudoQuery CallLiteral CallTag ParenthesizedContent PseudoClassName ArgList IdSelector IdName AttributeSelector AttributeName NamespacedAttribute NamespaceName AttributeName MatchOp MatchFlag ChildSelector ChildOp DescendantSelector SiblingSelector SiblingOp Block Declaration PropertyName Important ImportStatement import Layer layer LayerName layer MediaStatement media CharsetStatement charset NamespaceStatement namespace NamespaceName KeyframesStatement keyframes KeyframeName KeyframeList KeyframeSelector KeyframeRangeName SupportsStatement supports ScopeStatement scope to FontFeatureStatement font-feature-values FontName AtRule Styles",
  maxTerm: 176,
  nodeProps: [
    ["isolate", -2, 5, 38, ""],
    ["openedBy", 23, "(", 30, "[", 33, "{"],
    ["closedBy", 24, ")", 31, "]", 34, "}"]
  ],
  propSources: [Mr],
  skippedNodes: [0, 5, 130],
  repeatNodeCount: 17,
  tokenData: "IO~R!bOX%ZX^&R^p%Zpq&Rqr)ers)vst+jtu/wuv%Zvw0qwx1Sxy2qyz3Sz{3X{|3r|}8e}!O8v!O!P9e!P!Q9|!Q![:u![!];p!]!^<l!^!_<}!_!`=y!`!a>^!a!b%Z!b!c?_!c!k%Z!k!lAl!l!u%Z!u!vAl!v!}%Z!}#OA}#O#P%Z#P#QB`#Q#R/w#R#]%Z#]#^Bq#^#g%Z#g#hAl#h#o%Z#o#pGU#p#qGg#q#rHO#r#sHa#s#y%Z#y#z&R#z$f%Z$f$g&R$g#BY%Z#BY#BZ&R#BZ$IS%Z$IS$I_&R$I_$I|%Z$I|$JO&R$JO$JT%Z$JT$JU&R$JU$KV%Z$KV$KW&R$KW&FU%Z&FU&FV&R&FV;'S%Z;'S;=`Hx<%lO%Z`%^SOy%jz;'S%j;'S;=`%{<%lO%j`%oS!r`Oy%jz;'S%j;'S;=`%{<%lO%j`&OP;=`<%l%j~&Wh$`~OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%j~'yh$`~!r`OX%jX^'r^p%jpq'rqy%jz#y%j#y#z'r#z$f%j$f$g'r$g#BY%j#BY#BZ'r#BZ$IS%j$IS$I_'r$I_$I|%j$I|$JO'r$JO$JT%j$JT$JU'r$JU$KV%j$KV$KW'r$KW&FU%j&FU&FV'r&FV;'S%j;'S;=`%{<%lO%jj)jS$uYOy%jz;'S%j;'S;=`%{<%lO%j~)yWOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d<%lO)v~*hOv~~*kRO;'S)v;'S;=`*t;=`O)v~*wXOY)vZr)vrs*cs#O)v#O#P*h#P;'S)v;'S;=`+d;=`<%l)v<%lO)v~+gP;=`<%l)vj+maOy%jz}%j}!O,r!O!Q%j!Q![,r![!c%j!c!},r!}#O%j#O#P.O#P#R%j#R#S,r#S#T%j#T#o,r#o$g%j$g;'S,r;'S;=`/q<%lO,rj,ya$rY!r`Oy%jz}%j}!O,r!O!Q%j!Q![,r![!c%j!c!},r!}#O%j#O#P.O#P#R%j#R#S,r#S#T%j#T#o,r#o$g%j$g;'S,r;'S;=`/q<%lO,rj.TV!r`OY,rYZ%jZy,ryz.jz;'S,r;'S;=`/q<%lO,rY.oX$rY}!O.j!Q![.j!c!}.j#O#P/[#R#S.j#T#o.j$g;'S.j;'S;=`/k<%lO.jY/_SOY.jZ;'S.j;'S;=`/k<%lO.jY/nP;=`<%l.jj/tP;=`<%l,rd/zUOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jd0eS!|S!r`Oy%jz;'S%j;'S;=`%{<%lO%jb0vS^QOy%jz;'S%j;'S;=`%{<%lO%j~1VWOY1SZw1Swx*cx#O1S#O#P1o#P;'S1S;'S;=`2k<%lO1S~1rRO;'S1S;'S;=`1{;=`O1S~2OXOY1SZw1Swx*cx#O1S#O#P1o#P;'S1S;'S;=`2k;=`<%l1S<%lO1S~2nP;=`<%l1Sj2vShYOy%jz;'S%j;'S;=`%{<%lO%j~3XOg~n3`UWQxWOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jj3yWxW#SQOy%jz!O%j!O!P4c!P!Q%j!Q![7h![;'S%j;'S;=`%{<%lO%jj4hU!r`Oy%jz!Q%j!Q![4z![;'S%j;'S;=`%{<%lO%jj5RY!r`$kYOy%jz!Q%j!Q![4z![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj5vY!r`Oy%jz{%j{|6f|}%j}!O6f!O!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj6kU!r`Oy%jz!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj7UU!r`$kYOy%jz!Q%j!Q![6}![;'S%j;'S;=`%{<%lO%jj7o[!r`$kYOy%jz!O%j!O!P4z!P!Q%j!Q![7h![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj8jS!eYOy%jz;'S%j;'S;=`%{<%lO%jj8{WxWOy%jz!O%j!O!P4c!P!Q%j!Q![7h![;'S%j;'S;=`%{<%lO%jj9jU`YOy%jz!Q%j!Q![4z![;'S%j;'S;=`%{<%lO%j~:RTxWOy%jz{:b{;'S%j;'S;=`%{<%lO%j~:iS!r`$a~Oy%jz;'S%j;'S;=`%{<%lO%jj:z[$kYOy%jz!O%j!O!P4z!P!Q%j!Q![7h![!g%j!g!h5q!h#X%j#X#Y5q#Y;'S%j;'S;=`%{<%lO%jj;uUcYOy%jz![%j![!]<X!];'S%j;'S;=`%{<%lO%jj<`SdY!r`Oy%jz;'S%j;'S;=`%{<%lO%jj<qSmYOy%jz;'S%j;'S;=`%{<%lO%jh=SU!WWOy%jz!_%j!_!`=f!`;'S%j;'S;=`%{<%lO%jh=mS!WW!r`Oy%jz;'S%j;'S;=`%{<%lO%jl>QS!WW!|SOy%jz;'S%j;'S;=`%{<%lO%jj>eV#PQ!WWOy%jz!_%j!_!`=f!`!a>z!a;'S%j;'S;=`%{<%lO%jb?RS#PQ!r`Oy%jz;'S%j;'S;=`%{<%lO%jj?bYOy%jz}%j}!O@Q!O!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jj@VW!r`Oy%jz!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jj@v[lY!r`Oy%jz}%j}!O@o!O!Q%j!Q![@o![!c%j!c!}@o!}#T%j#T#o@o#o;'S%j;'S;=`%{<%lO%jhAqS!}WOy%jz;'S%j;'S;=`%{<%lO%jjBSSoYOy%jz;'S%j;'S;=`%{<%lO%jnBeSn^Oy%jz;'S%j;'S;=`%{<%lO%jjBvU!}WOy%jz#a%j#a#bCY#b;'S%j;'S;=`%{<%lO%jbC_U!r`Oy%jz#d%j#d#eCq#e;'S%j;'S;=`%{<%lO%jbCvU!r`Oy%jz#c%j#c#dDY#d;'S%j;'S;=`%{<%lO%jbD_U!r`Oy%jz#f%j#f#gDq#g;'S%j;'S;=`%{<%lO%jbDvU!r`Oy%jz#h%j#h#iEY#i;'S%j;'S;=`%{<%lO%jbE_U!r`Oy%jz#T%j#T#UEq#U;'S%j;'S;=`%{<%lO%jbEvU!r`Oy%jz#b%j#b#cFY#c;'S%j;'S;=`%{<%lO%jbF_U!r`Oy%jz#h%j#h#iFq#i;'S%j;'S;=`%{<%lO%jbFxS$tQ!r`Oy%jz;'S%j;'S;=`%{<%lO%jjGZSrYOy%jz;'S%j;'S;=`%{<%lO%jfGlU$gUOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%jjHTSqYOy%jz;'S%j;'S;=`%{<%lO%jfHfU#SQOy%jz!_%j!_!`0^!`;'S%j;'S;=`%{<%lO%j`H{P;=`<%l%Z",
  tokenizers: [Er, Ar, Cr, Gr, 1, 2, 3, 4, new ue("m~RRYZ[z{a~~g~aO$c~~dP!P!Qg~lO$d~~", 28, 156)],
  topRules: { StyleSheet: [0, 6], Styles: [1, 129] },
  dynamicPrecedences: { 97: 1 },
  specialized: [{ term: 172, get: (O, e) => zO(O) << 1, external: zO }, { term: 150, get: (O) => Lr[O] || -1 }, { term: 151, get: (O) => Dr[O] || -1 }, { term: 4, get: (O) => Nr[O] || -1 }, { term: 28, get: (O) => Ir[O] || -1 }, { term: 149, get: (O) => Br[O] || -1 }],
  tokenPrec: 2433
});
let ye = null;
function _e() {
  if (!ye && typeof document == "object" && document.body) {
    let { style: O } = document.body, e = [], a = /* @__PURE__ */ new Set();
    for (let t in O)
      t != "cssText" && t != "cssFloat" && typeof O[t] == "string" && (/[A-Z]/.test(t) && (t = t.replace(/[A-Z]/g, (r) => "-" + r.toLowerCase())), a.has(t) || (e.push(t), a.add(t)));
    ye = e.sort().map((t) => ({ type: "property", label: t, apply: t + ": " }));
  }
  return ye || [];
}
const WO = /* @__PURE__ */ [
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
].map((O) => ({ type: "class", label: O })), UO = /* @__PURE__ */ [
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
].map((O) => ({ type: "keyword", label: O })).concat(/* @__PURE__ */ [
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
].map((O) => ({ type: "constant", label: O }))), Jr = /* @__PURE__ */ [
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
].map((O) => ({ type: "type", label: O })), Kr = /* @__PURE__ */ [
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
].map((O) => ({ type: "keyword", label: O })), v = /^(\w[\w-]*|-\w[\w-]*|)$/, Hr = /^-(-[\w-]*)?$/;
function ei(O, e) {
  var a;
  if ((O.name == "(" || O.type.isError) && (O = O.parent || O), O.name != "ArgList")
    return !1;
  let t = (a = O.parent) === null || a === void 0 ? void 0 : a.firstChild;
  return t?.name != "Callee" ? !1 : e.sliceString(t.from, t.to) == "var";
}
const VO = /* @__PURE__ */ new pt(), Oi = ["Declaration"];
function ti(O) {
  for (let e = O; ; ) {
    if (e.type.isTop)
      return e;
    if (!(e = e.parent))
      return O;
  }
}
function qt(O, e, a) {
  if (e.to - e.from > 4096) {
    let t = VO.get(e);
    if (t)
      return t;
    let r = [], s = /* @__PURE__ */ new Set(), i = e.cursor(tO.IncludeAnonymous);
    if (i.firstChild())
      do
        for (let n of qt(O, i.node, a))
          s.has(n.label) || (s.add(n.label), r.push(n));
      while (i.nextSibling());
    return VO.set(e, r), r;
  } else {
    let t = [], r = /* @__PURE__ */ new Set();
    return e.cursor().iterate((s) => {
      var i;
      if (a(s) && s.matchContext(Oi) && ((i = s.node.nextSibling) === null || i === void 0 ? void 0 : i.name) == ":") {
        let n = O.sliceString(s.from, s.to);
        r.has(n) || (r.add(n), t.push({ label: n, type: "variable" }));
      }
    }), t;
  }
}
const Yt = (O) => (e) => {
  let { state: a, pos: t } = e, r = q(a).resolveInner(t, -1), s = r.type.isError && r.from == r.to - 1 && a.doc.sliceString(r.from, r.to) == "-";
  if (r.name == "PropertyName" || (s || r.name == "TagName") && /^(Block|Styles)$/.test(r.resolve(r.to).name))
    return { from: r.from, options: _e(), validFor: v };
  if (r.name == "ValueName")
    return { from: r.from, options: UO, validFor: v };
  if (r.name == "PseudoClassName")
    return { from: r.from, options: WO, validFor: v };
  if (O(r) || (e.explicit || s) && ei(r, a.doc))
    return {
      from: O(r) || s ? r.from : t,
      options: qt(a.doc, ti(r), O),
      validFor: Hr
    };
  if (r.name == "TagName") {
    for (let { parent: o } = r; o; o = o.parent)
      if (o.name == "Block")
        return { from: r.from, options: _e(), validFor: v };
    return { from: r.from, options: Jr, validFor: v };
  }
  if (r.name == "AtKeyword")
    return { from: r.from, options: Kr, validFor: v };
  if (!e.explicit)
    return null;
  let i = r.resolve(t), n = i.childBefore(t);
  return n && n.name == ":" && i.name == "PseudoClassSelector" ? { from: t, options: WO, validFor: v } : n && n.name == ":" && i.name == "Declaration" || i.name == "ArgList" ? { from: t, options: UO, validFor: v } : i.name == "Block" || i.name == "Styles" ? { from: t, options: _e(), validFor: v } : null;
}, Rt = /* @__PURE__ */ Yt((O) => O.name == "VariableName"), re = /* @__PURE__ */ R.define({
  name: "css",
  parser: /* @__PURE__ */ Fr.configure({
    props: [
      /* @__PURE__ */ E.add({
        Declaration: /* @__PURE__ */ C()
      }),
      /* @__PURE__ */ A.add({
        "Block KeyframeList": Pe
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*\}$/,
    wordChars: "-"
  }
});
function zt() {
  return new j(re, re.data.of({ autocomplete: Rt }));
}
const Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  css: zt,
  cssCompletionSource: Rt,
  cssLanguage: re,
  defineCSSCompletionSource: Yt
}, Symbol.toStringTag, { value: "Module" })), ai = 317, ri = 318, CO = 1, ii = 2, si = 3, ni = 4, oi = 319, li = 321, ci = 322, di = 5, Qi = 6, pi = 0, Ae = [
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
], Wt = 125, ui = 59, Me = 47, fi = 42, hi = 43, $i = 45, mi = 60, gi = 44, Pi = 63, Si = 46, bi = 91, Xi = new Se({
  start: !1,
  shift(O, e) {
    return e == di || e == Qi || e == li ? O : e == ci;
  },
  strict: !1
}), xi = new P((O, e) => {
  let { next: a } = O;
  (a == Wt || a == -1 || e.context) && O.acceptToken(oi);
}, { contextual: !0, fallback: !0 }), Zi = new P((O, e) => {
  let { next: a } = O, t;
  Ae.indexOf(a) > -1 || a == Me && ((t = O.peek(1)) == Me || t == fi) || a != Wt && a != ui && a != -1 && !e.context && O.acceptToken(ai);
}, { contextual: !0 }), ki = new P((O, e) => {
  O.next == bi && !e.context && O.acceptToken(ri);
}, { contextual: !0 }), yi = new P((O, e) => {
  let { next: a } = O;
  if (a == hi || a == $i) {
    if (O.advance(), a == O.next) {
      O.advance();
      let t = !e.context && e.canShift(CO);
      O.acceptToken(t ? CO : ii);
    }
  } else a == Pi && O.peek(1) == Si && (O.advance(), O.advance(), (O.next < 48 || O.next > 57) && O.acceptToken(si));
}, { contextual: !0 });
function ve(O, e) {
  return O >= 65 && O <= 90 || O >= 97 && O <= 122 || O == 95 || O >= 192 || !e && O >= 48 && O <= 57;
}
const _i = new P((O, e) => {
  if (O.next != mi || !e.dialectEnabled(pi) || (O.advance(), O.next == Me)) return;
  let a = 0;
  for (; Ae.indexOf(O.next) > -1; )
    O.advance(), a++;
  if (ve(O.next, !0)) {
    for (O.advance(), a++; ve(O.next, !1); )
      O.advance(), a++;
    for (; Ae.indexOf(O.next) > -1; )
      O.advance(), a++;
    if (O.next == gi) return;
    for (let t = 0; ; t++) {
      if (t == 7) {
        if (!ve(O.next, !0)) return;
        break;
      }
      if (O.next != "extends".charCodeAt(t)) break;
      O.advance(), a++;
    }
  }
  O.acceptToken(ni, -a);
}), vi = Y({
  "get set async static": l.modifier,
  "for while do if else switch try catch finally return throw break continue default case defer": l.controlKeyword,
  "in of await yield void typeof delete instanceof as satisfies": l.operatorKeyword,
  "let var const using function class extends": l.definitionKeyword,
  "import export from": l.moduleKeyword,
  "with debugger new": l.keyword,
  TemplateString: l.special(l.string),
  super: l.atom,
  BooleanLiteral: l.bool,
  this: l.self,
  null: l.null,
  Star: l.modifier,
  VariableName: l.variableName,
  "CallExpression/VariableName TaggedTemplateExpression/VariableName": l.function(l.variableName),
  VariableDefinition: l.definition(l.variableName),
  Label: l.labelName,
  PropertyName: l.propertyName,
  PrivatePropertyName: l.special(l.propertyName),
  "CallExpression/MemberExpression/PropertyName": l.function(l.propertyName),
  "FunctionDeclaration/VariableDefinition": l.function(l.definition(l.variableName)),
  "ClassDeclaration/VariableDefinition": l.definition(l.className),
  "NewExpression/VariableName": l.className,
  PropertyDefinition: l.definition(l.propertyName),
  PrivatePropertyDefinition: l.definition(l.special(l.propertyName)),
  UpdateOp: l.updateOperator,
  "LineComment Hashbang": l.lineComment,
  BlockComment: l.blockComment,
  Number: l.number,
  String: l.string,
  Escape: l.escape,
  ArithOp: l.arithmeticOperator,
  LogicOp: l.logicOperator,
  BitOp: l.bitwiseOperator,
  CompareOp: l.compareOperator,
  RegExp: l.regexp,
  Equals: l.definitionOperator,
  Arrow: l.function(l.punctuation),
  ": Spread": l.punctuation,
  "( )": l.paren,
  "[ ]": l.squareBracket,
  "{ }": l.brace,
  "InterpolationStart InterpolationEnd": l.special(l.brace),
  ".": l.derefOperator,
  ", ;": l.separator,
  "@": l.meta,
  TypeName: l.typeName,
  TypeDefinition: l.definition(l.typeName),
  "type enum interface implements namespace module declare": l.definitionKeyword,
  "abstract global Privacy readonly override": l.modifier,
  "is keyof unique infer asserts": l.operatorKeyword,
  JSXAttributeValue: l.attributeValue,
  JSXText: l.content,
  "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag": l.angleBracket,
  "JSXIdentifier JSXNameSpacedName": l.tagName,
  "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName": l.attributeName,
  "JSXBuiltin/JSXIdentifier": l.standard(l.tagName)
}), wi = { __proto__: null, export: 20, as: 25, from: 33, default: 36, async: 41, function: 42, in: 52, out: 55, const: 56, extends: 60, this: 64, true: 72, false: 72, null: 84, void: 88, typeof: 92, super: 108, new: 142, delete: 154, yield: 163, await: 167, class: 172, public: 237, private: 237, protected: 237, readonly: 239, instanceof: 258, satisfies: 261, import: 294, keyof: 351, unique: 355, infer: 361, asserts: 397, is: 399, abstract: 419, implements: 421, type: 423, let: 426, var: 428, using: 431, interface: 437, enum: 441, namespace: 447, module: 449, declare: 453, global: 457, defer: 473, for: 478, of: 487, while: 490, with: 494, do: 498, if: 502, else: 504, switch: 508, case: 514, try: 520, catch: 524, finally: 528, return: 532, throw: 536, break: 540, continue: 544, debugger: 548 }, ji = { __proto__: null, async: 129, get: 131, set: 133, declare: 195, public: 197, private: 197, protected: 197, static: 199, abstract: 201, override: 203, readonly: 209, accessor: 211, new: 403 }, Ti = { __proto__: null, "<": 193 }, qi = y.deserialize({
  version: 14,
  states: "$GSQ%TQlOOO%[QlOOO'_QpOOP(lO`OOO*zQ!0MxO'#CiO+RO#tO'#CjO+aO&jO'#CjO+oO#@ItO'#DaO.QQlO'#DgO.bQlO'#DrO%[QlO'#DzO0fQlO'#ESOOQ!0Lf'#E['#E[O1PQ`O'#EXOOQO'#Ep'#EpOOQO'#Im'#ImO1XQ`O'#GtO1dQ`O'#EoO1iQ`O'#EoO3hQ!0MxO'#JsO6[Q!0MxO'#JtO6uQ`O'#F^O6zQ,UO'#FuOOQ!0Lf'#Fg'#FgO7VO7dO'#FgO9XQMhO'#F}O9`Q`O'#F|OOQ!0Lf'#Jt'#JtOOQ!0Lb'#Js'#JsO9eQ`O'#GxOOQ['#K`'#K`O9pQ`O'#IZO9uQ!0LrO'#I[OOQ['#Ja'#JaOOQ['#I`'#I`Q`QlOOQ`QlOOO9}Q!L^O'#DvO:UQlO'#EOO:]QlO'#EQO9kQ`O'#GtO:dQMhO'#CoO:rQ`O'#EnO:}Q`O'#EzO;hQMhO'#FfO;xQ`O'#GtOOQO'#Ka'#KaO;}Q`O'#KaO<]Q`O'#G|O<]Q`O'#G}O<]Q`O'#HPO9kQ`O'#HSO=SQ`O'#HVO>kQ`O'#CeO>{Q`O'#HdO?TQ`O'#HjO?TQ`O'#HlO`QlO'#HnO?TQ`O'#HpO?TQ`O'#HsO?YQ`O'#HyO?_Q!0LsO'#IPO%[QlO'#IRO?jQ!0LsO'#ITO?uQ!0LsO'#IVO9uQ!0LrO'#IXO@QQ!0MxO'#CiOASQpO'#DlQOQ`OOO%[QlO'#EQOAjQ`O'#ETO:dQMhO'#EnOAuQ`O'#EnOBQQ!bO'#FfOOQ['#Cg'#CgOOQ!0Lb'#Dq'#DqOOQ!0Lb'#Jw'#JwO%[QlO'#JwOOQO'#Jz'#JzOOQO'#Ii'#IiOCQQpO'#EgOOQ!0Lb'#Ef'#EfOOQ!0Lb'#KO'#KOOC|Q!0MSO'#EgODWQpO'#EWOOQO'#Jy'#JyODlQpO'#JzOEyQpO'#EWODWQpO'#EgPFWO&2DjO'#CbPOOO)CEO)CEOOOOO'#Ia'#IaOFcO#tO,59UOOQ!0Lh,59U,59UOOOO'#Ib'#IbOFqO&jO,59UOGPQ!L^O'#DcOOOO'#Id'#IdOGWO#@ItO,59{OOQ!0Lf,59{,59{OGfQlO'#IeOGyQ`O'#JuOIxQ!fO'#JuO+}QlO'#JuOJPQ`O,5:ROJgQ`O'#EpOJtQ`O'#KUOKPQ`O'#KTOKPQ`O'#KTOKXQ`O,5;^OK^Q`O'#KSOOQ!0Ln,5:^,5:^OKeQlO,5:^OMcQ!0MxO,5:fONSQ`O,5:nONmQ!0LrO'#KRONtQ`O'#KQO9eQ`O'#KQO! YQ`O'#KQO! bQ`O,5;]O! gQ`O'#KQO!#lQ!fO'#JtOOQ!0Lh'#Ci'#CiO%[QlO'#ESO!$[Q!fO,5:sOOQS'#J{'#J{OOQO-E<k-E<kO9kQ`O,5=`O!$rQ`O,5=`O!$wQlO,5;ZO!&zQMhO'#EkO!(eQ`O,5;ZO!(jQlO'#DyO!(tQpO,5;eO!(|QpO,5;eO%[QlO,5;eOOQ['#FU'#FUOOQ['#FW'#FWO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fO%[QlO,5;fOOQ['#F['#F[O!)[QlO,5;uOOQ!0Lf,5;z,5;zOOQ!0Lf,5;{,5;{OOQ!0Lf,5;},5;}O%[QlO'#IqO!+_Q!0LrO,5<jO%[QlO,5;fO!&zQMhO,5;fO!+|QMhO,5;fO!-nQMhO'#E^O%[QlO,5;xOOQ!0Lf,5;|,5;|O!-uQ,UO'#FkO!.rQ,UO'#KYO!.^Q,UO'#KYO!.yQ,UO'#KYOOQO'#KY'#KYO!/_Q,UO,5<TOOOW,5<a,5<aO!/pQlO'#FwOOOW'#Ip'#IpO7VO7dO,5<RO!/wQ,UO'#FyOOQ!0Lf,5<R,5<RO!0hQ$IUO'#CyOOQ!0Lh'#C}'#C}O!0{O#@ItO'#DRO!1iQMjO,5<fO!1pQ`O,5<iO!3YQ(CWO'#GYO!3jQ`O'#GZO!3oQ`O'#GZO!5_Q(CWO'#G_O!6dQpO'#GcOOQO'#Go'#GoO!,TQMhO'#GnOOQO'#Gq'#GqO!,TQMhO'#GpO!7VQ$IUO'#JmOOQ!0Lh'#Jm'#JmO!7aQ`O'#JlO!7oQ`O'#JkO!7wQ`O'#CuOOQ!0Lh'#C{'#C{O!8YQ`O'#C}OOQ!0Lh'#DV'#DVOOQ!0Lh'#DX'#DXO!8_Q`O,5<fO1SQ`O'#DZO!,TQMhO'#GQO!,TQMhO'#GSO!8gQ`O'#GUO!8lQ`O'#GVO!3oQ`O'#G]O!,TQMhO'#GbO<]Q`O'#JlO!8qQ`O'#EqO!9`Q`O,5<hOOQ!0Lb'#Cr'#CrO!9hQ`O'#ErO!:bQpO'#EsOOQ!0Lb'#KS'#KSO!:iQ!0LrO'#KbO9uQ!0LrO,5=dO`QlO,5>uOOQ['#Ji'#JiOOQ[,5>v,5>vOOQ[-E<^-E<^O!<hQ!0MxO,5:bO!=[QpO,5:`O!?WQ!0MxO,5:jO%[QlO,5:jO!AnQ!0MxO,5:lOOQO,5@{,5@{O!B_QMhO,5=`O!BmQ!0LrO'#JjO9`Q`O'#JjO!COQ!0LrO,59ZO!CZQpO,59ZO!CcQMhO,59ZO:dQMhO,59ZO!CnQ`O,5;ZO!CvQ`O'#HcO!D[Q`O'#KeO%[QlO,5<OO!=[QpO,5<QO!DdQ`O,5={O!DiQ`O,5={O!DnQ`O,5={O!D|Q`O,5={O9uQ!0LrO,5={O<]Q`O,5=kOOQO'#Cy'#CyO!ETQpO,5=hO!E]QMhO,5=iO!EhQ`O,5=kO!EmQ!bO,5=nO!EuQ`O'#KaO?YQ`O'#HXO9kQ`O'#HZO!EzQ`O'#HZO:dQMhO'#H]O!FPQ`O'#H]OOQ[,5=q,5=qO!FUQ`O'#H^O!FgQ`O'#CoO!FlQ`O,59PO!FvQ`O,59PO!H{QlO,59POOQ[,59P,59PO!I]Q!0LrO,59PO%[QlO,59PO!KhQlO'#HfOOQ['#Hg'#HgOOQ['#Hh'#HhO`QlO,5>OO!LOQ`O,5>OO`QlO,5>UO`QlO,5>WO!LTQ`O,5>YO`QlO,5>[O!LYQ`O,5>_O!L_QlO,5>eOOQ[,5>k,5>kO%[QlO,5>kO9uQ!0LrO,5>mOOQ[,5>o,5>oO#!iQ`O,5>oOOQ[,5>q,5>qO#!iQ`O,5>qOOQ[,5>s,5>sO##VQpO'#D_O%[QlO'#JwO##aQpO'#JwO##{QpO'#DmO#$^QpO'#DmO#&oQlO'#DmO#&vQ`O'#JvO#'OQ`O,5:WO#'TQ`O'#EtO#'`Q`O'#EtO#'eQ`O'#KVO#'mQ`O,5;_O#'rQpO'#DmO#(PQpO'#EVOOQ!0Lf,5:o,5:oO%[QlO,5:oO#(WQ`O,5:oO?YQ`O,5;YO!CZQpO,5;YO!CcQMhO,5;YO:dQMhO,5;YO#(`Q`O,5@cO#(eQ07dO,5:sOOQO-E<g-E<gO#)kQ!0MSO,5;RODWQpO,5:rO#)uQpO,5:rODWQpO,5;RO!COQ!0LrO,5:rOOQ!0Lb'#Ej'#EjOOQO,5;R,5;RO%[QlO,5;RO#*SQ!0LrO,5;RO#*_Q!0LrO,5;RO!CZQpO,5:rOOQO,5;X,5;XO#*mQ!0LrO,5;RPOOO'#I_'#I_P#+RO&2DjO,58|POOO,58|,58|OOOO-E<_-E<_OOQ!0Lh1G.p1G.pOOOO-E<`-E<`OOOO,59},59}O#+^Q!bO,59}OOOO-E<b-E<bOOQ!0Lf1G/g1G/gO#+cQ!fO,5?PO+}QlO,5?POOQO,5?V,5?VO#+mQlO'#IeOOQO-E<c-E<cO#+zQ`O,5@aO#,SQ!fO,5@aO#,ZQ`O,5@oOOQ!0Lf1G/m1G/mO%[QlO,5@pO#,cQ`O'#IkOOQO-E<i-E<iO#,ZQ`O,5@oOOQ!0Lb1G0x1G0xOOQ!0Ln1G/x1G/xOOQ!0Ln1G0Y1G0YO%[QlO,5@mO#,wQ!0LrO,5@mO#-YQ!0LrO,5@mO#-aQ`O,5@lO9eQ`O,5@lO#-iQ`O,5@lO#-wQ`O'#InO#-aQ`O,5@lOOQ!0Lb1G0w1G0wO!(tQpO,5:uO!)PQpO,5:uOOQS,5:w,5:wO#.iQdO,5:wO#.qQMhO1G2zO9kQ`O1G2zOOQ!0Lf1G0u1G0uO#/PQ!0MxO1G0uO#0UQ!0MvO,5;VOOQ!0Lh'#GX'#GXO#0rQ!0MzO'#JmO!$wQlO1G0uO#2}Q!fO'#JxO%[QlO'#JxO#3XQ`O,5:eOOQ!0Lh'#D_'#D_OOQ!0Lf1G1P1G1PO%[QlO1G1POOQ!0Lf1G1g1G1gO#3^Q`O1G1PO#5rQ!0MxO1G1QO#5yQ!0MxO1G1QO#8aQ!0MxO1G1QO#8hQ!0MxO1G1QO#;OQ!0MxO1G1QO#=fQ!0MxO1G1QO#=mQ!0MxO1G1QO#=tQ!0MxO1G1QO#@[Q!0MxO1G1QO#@cQ!0MxO1G1QO#BpQ?MtO'#CiO#DkQ?MtO1G1aO#DrQ?MtO'#JtO#EVQ!0MxO,5?]OOQ!0Lb-E<o-E<oO#GdQ!0MxO1G1QO#HaQ!0MzO1G1QOOQ!0Lf1G1Q1G1QO#IdQMjO'#J}O#InQ`O,5:xO#IsQ!0MxO1G1dO#JgQ,UO,5<XO#JoQ,UO,5<YO#JwQ,UO'#FpO#K`Q`O'#FoOOQO'#KZ'#KZOOQO'#Io'#IoO#KeQ,UO1G1oOOQ!0Lf1G1o1G1oOOOW1G1z1G1zO#KvQ?MtO'#JsO#LQQ`O,5<cO!)[QlO,5<cOOOW-E<n-E<nOOQ!0Lf1G1m1G1mO#LVQpO'#KYOOQ!0Lf,5<e,5<eO#L_QpO,5<eO#LdQMhO'#DTOOOO'#Ic'#IcO#LkO#@ItO,59mOOQ!0Lh,59m,59mO%[QlO1G2QO!8lQ`O'#IsO#LvQ`O,5<{OOQ!0Lh,5<x,5<xO!,TQMhO'#IvO#MdQMjO,5=YO!,TQMhO'#IxO#NVQMjO,5=[O!&zQMhO,5=^OOQO1G2T1G2TO#NaQ!dO'#CrO#NtQ(CWO'#ErO$ |QpO'#GcO$!dQ!dO,5<tO$!kQ`O'#K]O9eQ`O'#K]O$!yQ`O,5<vO$#aQ!dO'#C{O!,TQMhO,5<uO$#kQ`O'#G[O$$PQ`O,5<uO$$UQ!dO'#GXO$$cQ!dO'#K^O$$mQ`O'#K^O!&zQMhO'#K^O$$rQ`O,5<yO$$wQlO'#JwO$%RQpO'#GdO#$^QpO'#GdO$%dQ`O'#GhO!3oQ`O'#GlO$%iQ!0LrO'#IuO$%tQpO,5<}OOQ!0Lp,5<},5<}O$%{QpO'#GdO$&YQpO'#GeO$&kQpO'#GeO$&pQMjO,5=YO$'QQMjO,5=[OOQ!0Lh,5=_,5=_O!,TQMhO,5@WO!,TQMhO,5@WO$'bQ`O'#IzO$'vQ`O,5@VO$(OQ`O,59aOOQ!0Lh,59i,59iO$(TQ`O,5@WO$)TQ$IYO,59uOOQ!0Lh'#Jq'#JqO$)vQMjO,5<lO$*iQMjO,5<nO@zQ`O,5<pOOQ!0Lh,5<q,5<qO$*sQ`O,5<wO$*xQMjO,5<|O$+YQ`O'#KQO!$wQlO1G2SO$+_Q`O1G2SO9eQ`O'#KTO$+dQ`O'#D_O9eQ`O'#EtO%[QlO'#EtO9eQ`O'#I|O$+rQ!0LrO,5@|OOQ[1G3O1G3OOOQ[1G4a1G4aOOQ!0Lf1G/|1G/|OOQ!0Lf1G/z1G/zO$-tQ!0MxO1G0UOOQ[1G2z1G2zO!&zQMhO1G2zO%[QlO1G2zO#.tQ`O1G2zO$/xQMhO'#EkOOQ!0Lb,5@U,5@UO$0VQ!0LrO,5@UOOQ[1G.u1G.uO!COQ!0LrO1G.uO!CZQpO1G.uO!CcQMhO1G.uO$0hQ`O1G0uO$0mQ`O'#CiO$0xQ`O'#KfO$1QQ`O,5=}O$1VQ`O'#KfO$1[Q`O'#KfO$1jQ`O'#JSO$1xQ`O,5APO$2QQ!fO1G1jOOQ!0Lf1G1l1G1lO9kQ`O1G3gO@zQ`O1G3gO$2XQ`O1G3gO$2^Q`O1G3gO!DnQ`O1G3gO9uQ!0LrO1G3gOOQ[1G3g1G3gO!EhQ`O1G3VO!&zQMhO1G3SO$2cQ`O1G3SOOQ[1G3T1G3TO!&zQMhO1G3TO$2hQ`O1G3TO$2pQpO'#HROOQ[1G3V1G3VO!6_QpO'#JOO!EmQ!bO1G3YOOQ[1G3Y1G3YOOQ[,5=s,5=sO$2xQMhO,5=uO9kQ`O,5=uO$%dQ`O,5=wO9`Q`O,5=wO!CZQpO,5=wO!CcQMhO,5=wO:dQMhO,5=wO$3WQ`O'#KdO$3cQ`O,5=xOOQ[1G.k1G.kO$3hQ!0LrO1G.kO@zQ`O1G.kO$3sQ`O1G.kO9uQ!0LrO1G.kO$5{Q!fO,5ARO$6YQ`O,5ARO9eQ`O,5ARO$6eQlO,5>QO$6lQ`O,5>QOOQ[1G3j1G3jO`QlO1G3jOOQ[1G3p1G3pOOQ[1G3r1G3rO?TQ`O1G3tO$6qQlO1G3vO$:uQlO'#HuOOQ[1G3y1G3yO$;SQ`O'#H{O?YQ`O'#H}OOQ[1G4P1G4PO$;[QlO1G4PO9uQ!0LrO1G4VOOQ[1G4X1G4XOOQ!0Lb'#G`'#G`O9uQ!0LrO1G4ZO9uQ!0LrO1G4]O$?cQ`O,5@cO9eQ`O,5;`O?YQ`O,5:XO!)[QlO,5:XO!CZQpO,5:XO$?hQ?MtO,5:XOOQO,5;`,5;`O$?rQpO'#IfO$@YQ`O,5@bOOQ!0Lf1G/r1G/rO!)[QlO,5;`O$@bQpO'#IlO$@lQ`O,5@qOOQ!0Lb1G0y1G0yO#$^QpO,5:XOOQO'#Ih'#IhO$@tQpO,5:qOOQ!0Ln,5:q,5:qO#(ZQ`O1G0ZOOQ!0Lf1G0Z1G0ZO%[QlO1G0ZOOQ!0Lf1G0t1G0tO?YQ`O1G0tO!CZQpO1G0tO!CcQMhO1G0tOOQ!0Lb1G5}1G5}O!COQ!0LrO1G0^OOQO1G0m1G0mO%[QlO1G0mO$@{Q!0LrO1G0mO$AWQ!0LrO1G0mO!CZQpO1G0^ODWQpO1G0^O$AfQ!0LrO1G0mOOQO1G0^1G0^O$AzQ!0MxO1G0mPOOO-E<]-E<]POOO1G.h1G.hOOOO1G/i1G/iO$BUQ!bO,5<jO$B^Q!fO1G4kOOQO1G4q1G4qO%[QlO,5?PO$BhQ`O1G5{O$BpQ`O1G6ZO$BxQ!fO1G6[O9eQ`O,5?VO$CSQ!0MxO1G6XO%[QlO1G6XO$CdQ!0LrO1G6XO$CuQ`O1G6WO$CuQ`O1G6WO9eQ`O1G6WO$C}Q`O,5?YO9eQ`O,5?YOOQO,5?Y,5?YO$DcQ`O,5?YO$+YQ`O,5?YOOQO-E<l-E<lOOQS1G0a1G0aOOQS1G0c1G0cO#.lQ`O1G0cOOQ[7+(f7+(fO!&zQMhO7+(fO%[QlO7+(fO$DqQ`O7+(fO$D|QMhO7+(fO$E[Q!0MzO,5=YO$GgQ!0MzO,5=[O$IrQ!0MzO,5=YO$LTQ!0MzO,5=[O$NfQ!0MzO,59uO%!kQ!0MzO,5<lO%$vQ!0MzO,5<nO%'RQ!0MzO,5<|OOQ!0Lf7+&a7+&aO%)dQ!0MxO7+&aO%*WQlO'#IgO%*eQ`O,5@dO%*mQ!fO,5@dOOQ!0Lf1G0P1G0PO%*wQ`O7+&kOOQ!0Lf7+&k7+&kO%*|Q?MtO,5:fO%[QlO7+&{O%+WQ?MtO,5:bO%+eQ?MtO,5:jO%+oQ?MtO,5:lO%+yQMhO'#IjO%,TQ`O,5@iOOQ!0Lh1G0d1G0dOOQO1G1s1G1sOOQO1G1t1G1tO%,]Q!jO,5<[O!)[QlO,5<ZOOQO-E<m-E<mOOQ!0Lf7+'Z7+'ZOOOW7+'f7+'fOOOW1G1}1G1}O%,hQ`O1G1}OOQ!0Lf1G2P1G2POOOO,59o,59oO%,mQ!dO,59oOOOO-E<a-E<aOOQ!0Lh1G/X1G/XO%,tQ!0MxO7+'lOOQ!0Lh,5?_,5?_O%-hQMhO1G2gP%-oQ`O'#IsPOQ!0Lh-E<q-E<qO%.]QMjO,5?bOOQ!0Lh-E<t-E<tO%/OQMjO,5?dOOQ!0Lh-E<v-E<vO%/YQ!dO1G2xO%/aQ!dO'#CrO%/wQMhO'#KTO$$wQlO'#JwOOQ!0Lh1G2`1G2`O%0RQ`O'#IrO%0jQ`O,5@wO%0jQ`O,5@wO%0rQ`O,5@wO%0}Q`O,5@wOOQO1G2b1G2bO%1]QMjO1G2aO$+YQ`O'#K]O!,TQMhO1G2aO%1mQ(CWO'#ItO%1zQ`O,5@xO!&zQMhO,5@xO%2SQ!dO,5@xOOQ!0Lh1G2e1G2eO%4dQ!fO'#CiO%4nQ`O,5=QOOQ!0Lb,5=O,5=OO%4vQpO,5=OOOQ!0Lb,5=P,5=POCwQ`O,5=OO%5RQpO,5=OOOQ!0Lb,5=S,5=SO$+YQ`O,5=WOOQO,5?a,5?aOOQO-E<s-E<sOOQ!0Lp1G2i1G2iO#$^QpO,5=OO$$wQlO,5=QO%5aQ`O,5=PO%5lQpO,5=PO!,TQMhO'#IvO%6fQMjO1G2tO!,TQMhO'#IxO%7XQMjO1G2vO%7cQMjO1G5rO%7mQMjO1G5rOOQO,5?f,5?fOOQO-E<x-E<xOOQO1G.{1G.{O!,TQMhO1G5rO!,TQMhO1G5rO!=[QpO,59wO%[QlO,59wOOQ!0Lh,5<k,5<kO%7zQ`O1G2[O!,TQMhO1G2cO%8PQ!0MxO7+'nOOQ!0Lf7+'n7+'nO!$wQlO7+'nO%8sQ`O,5;`OOQ!0Lb,5?h,5?hOOQ!0Lb-E<z-E<zO%8xQ!dO'#K_O#(ZQ`O7+(fO4UQ!fO7+(fO$DtQ`O7+(fO%9SQ!0MvO'#CiO%9gQ!0MvO,5=TO%9zQ`O,5=TO%:SQ`O,5=TOOQ!0Lb1G5p1G5pOOQ[7+$a7+$aO!COQ!0LrO7+$aO!CZQpO7+$aO!$wQlO7+&aO%:XQ`O'#JRO%:pQ`O,5AQOOQO1G3i1G3iO9kQ`O,5AQO%:pQ`O,5AQO%:xQ`O,5AQOOQO,5?n,5?nOOQO-E=Q-E=QOOQ!0Lf7+'U7+'UO%:}Q`O7+)RO9uQ!0LrO7+)RO9kQ`O7+)RO@zQ`O7+)RO%;SQ`O7+)ROOQ[7+)R7+)ROOQ[7+(q7+(qO%;XQ!0MvO7+(nO!&zQMhO7+(nO!EcQ`O7+(oOOQ[7+(o7+(oO!&zQMhO7+(oO%;cQ`O'#KcO%;nQ`O,5=mOOQO,5?j,5?jOOQO-E<|-E<|OOQ[7+(t7+(tO%=QQpO'#H[OOQ[1G3a1G3aO!&zQMhO1G3aO%[QlO1G3aO%=XQ`O1G3aO%=dQMhO1G3aO9uQ!0LrO1G3cO$%dQ`O1G3cO9`Q`O1G3cO!CZQpO1G3cO!CcQMhO1G3cO%=rQ`O'#JQO%>WQ`O,5AOO%>`QpO,5AOOOQ!0Lb1G3d1G3dOOQ[7+$V7+$VO@zQ`O7+$VO9uQ!0LrO7+$VO%>kQ`O7+$VO%[QlO1G6mO%[QlO1G6nO%>pQ!0LrO1G6mO%>zQlO1G3lO%?RQ`O1G3lO%?WQlO1G3lOOQ[7+)U7+)UO9uQ!0LrO7+)`O`QlO7+)bOOQ['#Ki'#KiOOQ['#JT'#JTO%?_QlO,5>aOOQ[,5>a,5>aO%[QlO'#HvO%?lQ`O'#HxOOQ[,5>g,5>gO9eQ`O,5>gOOQ[,5>i,5>iOOQ[7+)k7+)kOOQ[7+)q7+)qOOQ[7+)u7+)uOOQ[7+)w7+)wO%?qQpO1G5}O%@]Q`O1G0zOOQO1G/s1G/sO%@hQ?MtO1G/sO?YQ`O1G/sO!)[QlO'#DmOOQO,5?Q,5?QOOQO-E<d-E<dO%@rQ?MtO1G0zOOQO,5?W,5?WOOQO-E<j-E<jO!CZQpO1G/sOOQO-E<f-E<fOOQ!0Ln1G0]1G0]OOQ!0Lf7+%u7+%uO#(ZQ`O7+%uOOQ!0Lf7+&`7+&`O?YQ`O7+&`O!CZQpO7+&`OOQO7+%x7+%xO$AzQ!0MxO7+&XOOQO7+&X7+&XO%[QlO7+&XO%@|Q!0LrO7+&XO!COQ!0LrO7+%xO!CZQpO7+%xO%AXQ!0LrO7+&XO%AgQ!0MxO7++sO%[QlO7++sO%AwQ`O7++rO%AwQ`O7++rOOQO1G4t1G4tO9eQ`O1G4tO%BPQ`O1G4tOOQS7+%}7+%}O#(ZQ`O<<LQO4UQ!fO<<LQO%B_Q`O<<LQOOQ[<<LQ<<LQO!&zQMhO<<LQO%[QlO<<LQO%BgQ`O<<LQO%BrQ!0MzO,5?bO%D}Q!0MzO,5?dO%GYQ!0MzO1G2aO%IkQ!0MzO1G2tO%KvQ!0MzO1G2vO%NRQ!fO,5?RO%[QlO,5?ROOQO-E<e-E<eO%N]Q`O1G6OOOQ!0Lf<<JV<<JVO%NeQ?MtO1G0uO&!lQ?MtO1G1QO&!sQ?MtO1G1QO&$tQ?MtO1G1QO&${Q?MtO1G1QO&&|Q?MtO1G1QO&(}Q?MtO1G1QO&)UQ?MtO1G1QO&)]Q?MtO1G1QO&+^Q?MtO1G1QO&+eQ?MtO1G1QO&+lQ!0MxO<<JgO&-dQ?MtO1G1QO&.aQ?MvO1G1QO&/dQ?MvO'#JmO&1jQ?MtO1G1dO&1wQ?MtO1G0UO&2RQMjO,5?UOOQO-E<h-E<hO!)[QlO'#FrOOQO'#K['#K[OOQO1G1v1G1vO&2]Q`O1G1uO&2bQ?MtO,5?]OOOW7+'i7+'iOOOO1G/Z1G/ZO&2lQ!dO1G4yOOQ!0Lh7+(R7+(RP!&zQMhO,5?_O!,TQMhO7+(dO&2sQ`O,5?^O9eQ`O,5?^O$+YQ`O,5?^OOQO-E<p-E<pO&3RQ`O1G6cO&3RQ`O1G6cO&3ZQ`O1G6cO&3fQMjO7+'{O&3vQ!dO,5?`O&4QQ`O,5?`O!&zQMhO,5?`OOQO-E<r-E<rO&4VQ!dO1G6dO&4aQ`O1G6dO&4iQ`O1G2lO!&zQMhO1G2lOOQ!0Lb1G2j1G2jOOQ!0Lb1G2k1G2kO%4vQpO1G2jO!CZQpO1G2jOCwQ`O1G2jOOQ!0Lb1G2r1G2rO&4nQpO1G2jO&4|Q`O1G2lO$+YQ`O1G2kOCwQ`O1G2kO$$wQlO1G2lO&5UQ`O1G2kO&5xQMjO,5?bOOQ!0Lh-E<u-E<uO&6kQMjO,5?dOOQ!0Lh-E<w-E<wO!,TQMhO7++^O&6uQMjO7++^O&7PQMjO7++^OOQ!0Lh1G/c1G/cO&7^Q`O1G/cOOQ!0Lh7+'v7+'vO&7cQMjO7+'}O&7sQ!0MxO<<KYOOQ!0Lf<<KY<<KYO&8gQ`O1G0zO!&zQMhO'#I{O&8lQ`O,5@yO&:nQ!fO<<LQO!&zQMhO1G2oO&:uQ!0LrO1G2oOOQ[<<G{<<G{O!COQ!0LrO<<G{O&;WQ!0MxO<<I{OOQ!0Lf<<I{<<I{OOQO,5?m,5?mO&;zQ`O,5?mO&<PQ`O,5?mOOQO-E=P-E=PO&<_Q`O1G6lO&<_Q`O1G6lO9kQ`O1G6lO@zQ`O<<LmOOQ[<<Lm<<LmO&<gQ`O<<LmO9uQ!0LrO<<LmO9kQ`O<<LmOOQ[<<LY<<LYO%;XQ!0MvO<<LYOOQ[<<LZ<<LZO!EcQ`O<<LZO&<lQpO'#I}O&<wQ`O,5@}O!)[QlO,5@}OOQ[1G3X1G3XOOQO'#JP'#JPO9uQ!0LrO'#JPO&=PQpO,5=vOOQ[,5=v,5=vO&=WQpO'#EgO&=_QpO'#GfO&=dQ`O7+({O&=iQ`O7+({OOQ[7+({7+({O!&zQMhO7+({O%[QlO7+({O&=qQ`O7+({OOQ[7+(}7+(}O9uQ!0LrO7+(}O$%dQ`O7+(}O9`Q`O7+(}O!CZQpO7+(}O&=|Q`O,5?lOOQO-E=O-E=OOOQO'#H_'#H_O&>XQ`O1G6jO9uQ!0LrO<<GqOOQ[<<Gq<<GqO@zQ`O<<GqO&>aQ`O7+,XO&>fQ`O7+,YO%[QlO7+,XO%[QlO7+,YOOQ[7+)W7+)WO&>kQ`O7+)WO&>pQlO7+)WO&>wQ`O7+)WOOQ[<<Lz<<LzOOQ[<<L|<<L|OOQ[-E=R-E=ROOQ[1G3{1G3{O&>|Q`O,5>bOOQ[,5>d,5>dO&?RQ`O1G4RO9eQ`O7+&fO!)[QlO7+&fOOQO7+%_7+%_O&?WQ?MtO1G6[O?YQ`O7+%_OOQ!0Lf<<Ia<<IaOOQ!0Lf<<Iz<<IzO?YQ`O<<IzOOQO<<Is<<IsO$AzQ!0MxO<<IsO%[QlO<<IsOOQO<<Id<<IdO!COQ!0LrO<<IdO&?bQ!0LrO<<IsO&?mQ!0MxO<= _O&?}Q`O<= ^OOQO7+*`7+*`O9eQ`O7+*`OOQ[ANAlANAlO&@VQ!fOANAlO!&zQMhOANAlO#(ZQ`OANAlO4UQ!fOANAlO&@^Q`OANAlO%[QlOANAlO&@fQ!0MzO7+'{O&BwQ!0MzO,5?bO&ESQ!0MzO,5?dO&G_Q!0MzO7+'}O&IpQ!fO1G4mO&IzQ?MtO7+&aO&LOQ?MvO,5=YO&NVQ?MvO,5=[O&NgQ?MvO,5=YO&NwQ?MvO,5=[O' XQ?MvO,59uO'#_Q?MvO,5<lO'%bQ?MvO,5<nO''vQ?MvO,5<|O')lQ?MtO7+'lO')yQ?MtO7+'nO'*WQ`O,5<^OOQO7+'a7+'aOOQ!0Lh7+*e7+*eO'*]QMjO<<LOOOQO1G4x1G4xO'*dQ`O1G4xO'*oQ`O1G4xO'*}Q`O7++}O'*}Q`O7++}O!&zQMhO1G4zO'+VQ!dO1G4zO'+aQ`O7+,OO'+iQ`O7+(WO'+tQ!dO7+(WOOQ!0Lb7+(U7+(UOOQ!0Lb7+(V7+(VO!CZQpO7+(UOCwQ`O7+(UO',OQ`O7+(WO!&zQMhO7+(WO$+YQ`O7+(VO',TQ`O7+(WOCwQ`O7+(VO',]QMjO<<NxO!,TQMhO<<NxOOQ!0Lh7+$}7+$}O',gQ!dO,5?gOOQO-E<y-E<yO',qQ!0MvO7+(ZO!&zQMhO7+(ZOOQ[AN=gAN=gO9kQ`O1G5XOOQO1G5X1G5XO'-RQ`O1G5XO'-WQ`O7+,WO'-WQ`O7+,WO9uQ!0LrOANBXO@zQ`OANBXOOQ[ANBXANBXO'-`Q`OANBXOOQ[ANAtANAtOOQ[ANAuANAuO'-eQ`O,5?iOOQO-E<{-E<{O'-pQ?MtO1G6iOOQO,5?k,5?kOOQO-E<}-E<}OOQ[1G3b1G3bO'-zQ`O,5=QOOQ[<<Lg<<LgO!&zQMhO<<LgO&=dQ`O<<LgO'.PQ`O<<LgO%[QlO<<LgOOQ[<<Li<<LiO9uQ!0LrO<<LiO$%dQ`O<<LiO9`Q`O<<LiO'.XQpO1G5WO'.dQ`O7+,UOOQ[AN=]AN=]O9uQ!0LrOAN=]OOQ[<= s<= sOOQ[<= t<= tO'.lQ`O<= sO'.qQ`O<= tOOQ[<<Lr<<LrO'.vQ`O<<LrO'.{QlO<<LrOOQ[1G3|1G3|O?YQ`O7+)mO'/SQ`O<<JQO'/_Q?MtO<<JQOOQO<<Hy<<HyOOQ!0LfAN?fAN?fOOQOAN?_AN?_O$AzQ!0MxOAN?_OOQOAN?OAN?OO%[QlOAN?_OOQO<<Mz<<MzOOQ[G27WG27WO!&zQMhOG27WO#(ZQ`OG27WO'/iQ!fOG27WO4UQ!fOG27WO'/pQ`OG27WO'/xQ?MtO<<JgO'0VQ?MvO1G2aO'1{Q?MvO,5?bO'4OQ?MvO,5?dO'6RQ?MvO1G2tO'8UQ?MvO1G2vO':XQ?MtO<<KYO':fQ?MtO<<I{OOQO1G1x1G1xO!,TQMhOANAjOOQO7+*d7+*dO':sQ`O7+*dO';OQ`O<= iO';WQ!dO7+*fOOQ!0Lb<<Kr<<KrO$+YQ`O<<KrOCwQ`O<<KrO';bQ`O<<KrO!&zQMhO<<KrOOQ!0Lb<<Kp<<KpO!CZQpO<<KpO';mQ!dO<<KrOOQ!0Lb<<Kq<<KqO';wQ`O<<KrO!&zQMhO<<KrO$+YQ`O<<KqO';|QMjOANDdO'<WQ!0MvO<<KuOOQO7+*s7+*sO9kQ`O7+*sO'<hQ`O<= rOOQ[G27sG27sO9uQ!0LrOG27sO@zQ`OG27sO!)[QlO1G5TO'<pQ`O7+,TO'<xQ`O1G2lO&=dQ`OANBROOQ[ANBRANBRO!&zQMhOANBRO'<}Q`OANBROOQ[ANBTANBTO9uQ!0LrOANBTO$%dQ`OANBTOOQO'#H`'#H`OOQO7+*r7+*rOOQ[G22wG22wOOQ[ANE_ANE_OOQ[ANE`ANE`OOQ[ANB^ANB^O'=VQ`OANB^OOQ[<<MX<<MXO!)[QlOAN?lOOQOG24yG24yO$AzQ!0MxOG24yO#(ZQ`OLD,rOOQ[LD,rLD,rO!&zQMhOLD,rO'=[Q!fOLD,rO'=cQ?MvO7+'{O'?XQ?MvO,5?bO'A[Q?MvO,5?dO'C_Q?MvO7+'}O'ETQMjOG27UOOQO<<NO<<NOOOQ!0LbANA^ANA^O$+YQ`OANA^OCwQ`OANA^O'EeQ!dOANA^OOQ!0LbANA[ANA[O'ElQ`OANA^O!&zQMhOANA^O'EwQ!dOANA^OOQ!0LbANA]ANA]OOQO<<N_<<N_OOQ[LD-_LD-_O9uQ!0LrOLD-_O'FRQ?MtO7+*oOOQO'#Gg'#GgOOQ[G27mG27mO&=dQ`OG27mO!&zQMhOG27mOOQ[G27oG27oO9uQ!0LrOG27oOOQ[G27xG27xO'F]Q?MtOG25WOOQOLD*eLD*eOOQ[!$(!^!$(!^O#(ZQ`O!$(!^O!&zQMhO!$(!^O'FgQ!0MzOG27UOOQ!0LbG26xG26xO$+YQ`OG26xO'HxQ`OG26xOCwQ`OG26xO'ITQ!dOG26xO!&zQMhOG26xOOQ[!$(!y!$(!yOOQ[LD-XLD-XO&=dQ`OLD-XOOQ[LD-ZLD-ZOOQ[!)9Ex!)9ExO#(ZQ`O!)9ExOOQ!0LbLD,dLD,dO$+YQ`OLD,dOCwQ`OLD,dO'I[Q`OLD,dO'IgQ!dOLD,dOOQ[!$(!s!$(!sOOQ[!.K;d!.K;dO'InQ?MvOG27UOOQ!0Lb!$(!O!$(!OO$+YQ`O!$(!OOCwQ`O!$(!OO'KdQ`O!$(!OOOQ!0Lb!)9Ej!)9EjO$+YQ`O!)9EjOCwQ`O!)9EjOOQ!0Lb!.K;U!.K;UO$+YQ`O!.K;UOOQ!0Lb!4/0p!4/0pO!)[QlO'#DzO1PQ`O'#EXO'KoQ!fO'#JsO'KvQ!L^O'#DvO'K}QlO'#EOO'LUQ!fO'#CiO'NlQ!fO'#CiO!)[QlO'#EQO'N|QlO,5;ZO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO,5;fO!)[QlO'#IqO(#PQ`O,5<jO!)[QlO,5;fO(#XQMhO,5;fO($rQMhO,5;fO!)[QlO,5;xO!&zQMhO'#GnO(#XQMhO'#GnO!&zQMhO'#GpO(#XQMhO'#GpO1SQ`O'#DZO1SQ`O'#DZO!&zQMhO'#GQO(#XQMhO'#GQO!&zQMhO'#GSO(#XQMhO'#GSO!&zQMhO'#GbO(#XQMhO'#GbO!)[QlO,5:jO($yQpO'#D_O!)[QlO,5@pO'N|QlO1G0uO(%TQ?MtO'#CiO!)[QlO1G2QO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO(%_Q!dO'#CrO!&zQMhO,5<uO(#XQMhO,5<uO'N|QlO1G2SO!)[QlO7+&{O!&zQMhO1G2aO(#XQMhO1G2aO!&zQMhO'#IvO(#XQMhO'#IvO!&zQMhO'#IxO(#XQMhO'#IxO!&zQMhO1G2cO(#XQMhO1G2cO'N|QlO7+'nO'N|QlO7+&aO!&zQMhOANAjO(#XQMhOANAjO(%rQ`O'#EoO(%wQ`O'#EoO(&PQ`O'#F^O(&UQ`O'#EzO(&ZQ`O'#KUO(&fQ`O'#KSO(&qQ`O,5;ZO(&vQMjO,5<fO(&}Q`O'#GZO('SQ`O'#GZO('XQ`O,5<fO('aQ`O,5<hO('iQ`O,5;ZO('qQ?MtO1G1aO('xQ`O,5<uO('}Q`O,5<uO((SQ`O,5<wO((XQ`O,5<wO((^Q`O1G2SO((cQ`O1G0uO((hQMjO<<LOO((oQMjO<<LOO((vQMhO'#F}O9`Q`O'#F|OAuQ`O'#EnO!)[QlO,5;uO!3oQ`O'#GZO!3oQ`O'#GZO!3oQ`O'#G]O!3oQ`O'#G]O!,TQMhO7+(dO!,TQMhO7+(dO%/YQ!dO1G2xO%/YQ!dO1G2xO!&zQMhO,5=^O!&zQMhO,5=^",
  stateData: "(){~O'}OS(OOSTOS(PRQ~OPYOQYOSfOY!VOaqOdzOeyOl!POpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!uwO!xxO!|]O$X|O$oiO%i}O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO&X!WO&_!XO&a!YO&c!ZO&e![O&h!]O&n!^O&t!_O&v!`O&x!aO&z!bO&|!cO(USO(WTO(ZUO(bVO(p[O~OWtO~P`OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa!wOs!nO!S!oO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!xO#W!pO#X!pO#[!zO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O(P!{O~OP]XR]X[]Xa]Xj]Xr]X!Q]X!S]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X'{]X(b]X(s]X(z]X({]X~O!g%SX~P(qO_!}O(W#PO(X!}O(Y#PO~O_#QO(Y#PO(Z#PO([#QO~Ox#SO!U#TO(c#TO(d#VO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U<]O(WTO(ZUO(bVO(p[O~O![#ZO!]#WO!Y(iP!Y(wP~P+}O!^#cO~P`OPYOQYOSfOd!jOe!iOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(WTO(ZUO(bVO(p[O~Op#mO![#iO!|]O#j#lO#k#iO(U<^O!k(tP~P.iO!l#oO(U#nO~O!x#sO!|]O%i#tO~O#l#uO~O!g#vO#l#uO~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!]$_O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa(gX'{(gX'x(gX!k(gX!Y(gX!_(gX%j(gX!g(gX~P1qO#S$dO#`$eO$R$eOP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX!_(hX%j(hX~Oa(hX'{(hX'x(hX!Y(hX!k(hXv(hX!g(hX~P4UO#`$eO~O$^$hO$`$gO$g$mO~OSfO!_$nO$j$oO$l$qO~Oh%VOj%dOk%dOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U$sO(WTO(ZUO(b$uO(z$}O({%POg(_P~Ol%[O~P7eO!l%eO~O!S%hO!_%iO(U%gO~O!g%mO~Oa%nO'{%nO~O!Q%rO~P%[O(V!lO~P%[O%o%vO~P%[Oh%VO!l%eO(U%gO(V!lO~Oe%}O!l%eO(U%gO~Oj$RO~O!_&PO(U%gO(V!lO(WTO(ZUO`)XP~O!Q&SO!l&RO%k&VO&U&WO~P;SO!x#sO~O%t&YO!S)TX!_)TX(U)TX~O(U&ZO~Ol!PO!u&`O%k!QO%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO~Od&eOe&dO!x&bO%i&cO%|&aO~P<bOd&hOeyOl!PO!_&gO!u&`O!xxO!|]O%i}O%m!OO%n!OO%o!OO%r!RO%t!SO%w!TO%x!TO%z!UO~Ob&kO#`&nO%k&iO(V!lO~P=gO!l&oO!u&sO~O!l#oO~O!_XO~Oa%nO'y&{O'{%nO~Oa%nO'y'OO'{%nO~Oa%nO'y'QO'{%nO~O'x]X!Y]Xv]X!k]X&]]X!_]X%j]X!g]X~P(qO!b'`O!c'WO!d'WO(V!lO(WTO(ZUO~Os'UO!S'TO!['XO(f'SO!^(jP!^(yP~P@nOn'cO!_'aO(U%gO~Oe'hO!l%eO(U%gO~O!Q&SO!l&RO~Os!nO!S!oO!|<XO#T!pO#U!pO#W!pO#X!pO(V!lO(WTO(ZUO(f!mO(p!sO~O!b'nO!c'mO!d'mO#V!pO#['oO#]'oO~PBYOa%nOh%VO!g#vO!l%eO'{%nO(s'qO~O!p'uO#`'sO~PChOs!nO!S!oO(WTO(ZUO(f!mO(p!sO~O!_XOs(nX!S(nX!b(nX!c(nX!d(nX!|(nX#T(nX#U(nX#V(nX#W(nX#X(nX#[(nX#](nX(V(nX(W(nX(Z(nX(f(nX(p(nX~O!c'mO!d'mO(V!lO~PDWO(Q'yO(R'yO(S'{O~O_!}O(W'}O(X!}O(Y'}O~O_#QO(Y'}O(Z'}O([#QO~Ov(PO~P%[Ox#SO!U#TO(c#TO(d(SO~O![(UO!Y'XX!Y'_X!]'XX!]'_X~P+}O!](WO!Y(iX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!](WO!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~O!Y(iX~PHRO!Y(]O~O!Y(vX!](vX!g(vX!k(vX(s(vX~O#`(vX#l#dX!^(vX~PJUO#`(^O!Y(xX!](xX~O!](_O!Y(wX~O!Y(bO~O#`$eO~PJUO!^(cO~P`OR#zO!Q#yO!S#{O!l#xO(bVOP!na[!naj!nar!na!]!na!p!na#R!na#o!na#p!na#q!na#r!na#s!na#t!na#u!na#v!na#w!na#y!na#{!na#|!na(s!na(z!na({!na~Oa!na'{!na'x!na!Y!na!k!nav!na!_!na%j!na!g!na~PKlO!k(dO~O!g#vO#`(eO(s'qO!](uXa(uX'{(uX~O!k(uX~PNXO!S%hO!_%iO!|]O#j(jO#k(iO(U%gO~O!](kO!k(tX~O!k(mO~O!S%hO!_%iO#k(iO(U%gO~OP(hXR(hX[(hXj(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~O!g#vO!k(hX~P! uOR(oO!Q(nO!l#xO#S$dO!|!{a!S!{a~O!x!{a%i!{a!_!{a#j!{a#k!{a(U!{a~P!#vO!x(sO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_XO!iuO!lZO!oYO!pYO!qYO!svO!u!gO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~O#l(yO~O![({O!k(lP~P%[O(f(}O(p[O~O!S)PO!l#xO(f(}O(p[O~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]$_Oa$ra'{$ra'x$ra!k$ra!Y$ra!_$ra%j$ra!g$ra~Ol)eO~P!&zOh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O%]O!S${O!_$|O!i%bO!l$xO#k%cO$X%`O$u%^O$w%_O$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Og(qP~P!,TO!Q)jO!g)iO!_$_X$[$_X$^$_X$`$_X$g$_X~O!g)iO!_(|X$[(|X$^(|X$`(|X$g(|X~O!Q)jO~P!.^O!Q)jO!_(|X$[(|X$^(|X$`(|X$g(|X~O!_)lO$[)pO$^)kO$`)kO$g)qO~O![)tO~P!)[O$^$hO$`$gO$g)xO~On${X!Q${X#S${X'z${X(z${X({${X~OgmXg${XnmX!]mX#`mX~P!0SOx)zO(c){O(d)}O~On*WO!Q*PO'z*QO(z$}O({%PO~Og*OO~P!1WOg*XO~Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S*ZO!_*[O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op*aO![*_O(U*YO!k)PP~P!1uO#l*bO~O!l*cO~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(U*eO(WTO(ZUO(b$uO(z$}O({%PO~O![*hO!Y)QP~P!3tOr*tOs!nO!S*jO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO(f!mO~O!^*qO~P!5iO#S$dOn(aX!Q(aX'z(aX(z(aX({(aX!](aX#`(aX~Og(aX$P(aX~P!6kOn*yO#`*xOg(`X!](`X~O!]*zOg(_X~Oj%dOk%dOl%dO(U&ZOg(_P~Os*}O~Og*OO(U&ZO~O!l+TO~O(U(wO~Op+XO!S%hO![#iO!_%iO!|]O#j#lO#k#iO(U%gO!k(tP~O!g#vO#l+YO~O!S%hO![+[O!](_O!_%iO(U%gO!Y(wP~Os']O!S+_O![+^O(WTO(ZUO(f+]O~O!^(yP~P!9|O!]+`Oa)UX'{)UX~OP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO#{$WO#|$XO(bVO(s$YO(z#|O({#}O~Oa!ja!]!ja'{!ja'x!ja!Y!ja!k!jav!ja!_!ja%j!ja!g!ja~P!:tO(f(}O~OR#zO!Q#yO!S#{O!l#xO(bVOP!ra[!raj!rar!ra!]!ra!p!ra#R!ra#o!ra#p!ra#q!ra#r!ra#s!ra#t!ra#u!ra#v!ra#w!ra#y!ra#{!ra#|!ra(s!ra(z!ra({!ra~Oa!ra'{!ra'x!ra!Y!ra!k!rav!ra!_!ra%j!ra!g!ra~P!=aOR#zO!Q#yO!S#{O!l#xO(bVOP!ta[!taj!tar!ta!]!ta!p!ta#R!ta#o!ta#p!ta#q!ta#r!ta#s!ta#t!ta#u!ta#v!ta#w!ta#y!ta#{!ta#|!ta(s!ta(z!ta({!ta~Oa!ta'{!ta'x!ta!Y!ta!k!tav!ta!_!ta%j!ta!g!ta~P!?wOh%VOn+iO!_'aO%j+hO~O!g+kOa(^X!_(^X'{(^X!](^X~Oa%nO!_XO'{%nO~Oh%VO!l%eO~Oh%VO!l%eO(U%gO~O!g#vO#l(yO~Ob+vO%k+wO(U+sO(WTO(ZUO!^)YP~O!]+xO`)XX~O[+|O~O`+}O~O!_&PO(U%gO(V!lO`)XP~O%k,QO~P;SOh%VO#`,UO~Oh%VOn,XO!_$|O~O!_,ZO~O!Q,]O!_XO~O%o%vO~O!x,bO~Oe,gO~Ob,hO(U#nO(WTO(ZUO!^)WP~Oe%}O~O%k!QO(U&ZO~P=gO[,mO`,lO~OPYOQYOSfOdzOeyOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!iuO!lZO!oYO!pYO!qYO!svO!xxO!|]O$oiO%i}O(WTO(ZUO(bVO(p[O~O!_!eO!u!gO$X!kO(U!dO~P!GOO`,lOa%nO'{%nO~OPYOQYOSfOd!jOe!iOpkOrYOskOtkOzkO|YO!OYO!SWO!WkO!XkO!_!eO!iuO!lZO!oYO!pYO!qYO!svO!x!hO$X!kO$oiO(U!dO(WTO(ZUO(bVO(p[O~Oa,rOl!OO!uwO%m!OO%n!OO%o!OO~P!IhO!l&oO~O&_,xO~O!_,zO~O&p,|O&r,}OP&maQ&maS&maY&maa&mad&mae&mal&map&mar&mas&mat&maz&ma|&ma!O&ma!S&ma!W&ma!X&ma!_&ma!i&ma!l&ma!o&ma!p&ma!q&ma!s&ma!u&ma!x&ma!|&ma$X&ma$o&ma%i&ma%k&ma%m&ma%n&ma%o&ma%r&ma%t&ma%w&ma%x&ma%z&ma&X&ma&_&ma&a&ma&c&ma&e&ma&h&ma&n&ma&t&ma&v&ma&x&ma&z&ma&|&ma'x&ma(U&ma(W&ma(Z&ma(b&ma(p&ma!^&ma&f&mab&ma&k&ma~O(U-SO~Oh!eX!]#iX!^#iX!g!RX!g!eX!l!eX#`#iX~O!]!eX!^!eX~P#!nO!g-WOh(kX!](kX!^(kX!g(kX!l(kXr(kX(s(kX~Oh%VO!g-YO!l%eO!]!aX!^!aX~Os!nO!S!oO(WTO(ZUO(f!mO~OP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_!eO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(WTO(ZUO(bVO(p[O~O(U=RO~P#$oO!]-^O!^(jX~O!^-`O~O#`-aO!]#hX!^#hX~O!g-WO~O!]-bO!^(yX~O!^-dO~O!c-eO!d-eO(V!lO~P#$^O!^-hO~P'_On-kO!_'aO~O!Y-pO~Os!{a!b!{a!c!{a!d!{a#T!{a#U!{a#V!{a#W!{a#X!{a#[!{a#]!{a(V!{a(W!{a(Z!{a(f!{a(p!{a~P!#vO!p-uO#`-sO~PChO!c-wO!d-wO(V!lO~PDWOa%nO#`-sO'{%nO~Oa%nO!g#vO#`-sO'{%nO~Oa%nO!g#vO!p-uO#`-sO'{%nO(s'qO~O(Q'yO(R'yO(S-|O~Ov-}O~O!Y'Xa!]'Xa~P!:tO![.RO!Y'XX!]'XX~P%[O!](WO!Y(ia~O!Y(ia~PHRO!](_O!Y(wa~O!S%hO![.VO!_%iO(U%gO!Y'_X!]'_X~O#`.XO!](ua!k(uaa(ua'{(ua~O!g#vO~P#,wO!](kO!k(ta~O!S%hO!_%iO#k.]O(U%gO~Op.bO!S%hO![._O!_%iO!|]O#j.aO#k._O(U%gO!]'bX!k'bX~OR.fO!l#xO~Oh%VOn.iO!_'aO%j.hO~Oa#ci!]#ci'{#ci'x#ci!Y#ci!k#civ#ci!_#ci%j#ci!g#ci~P!:tOn>^O!Q*PO'z*QO(z$}O({%PO~O#l#_aa#_a#`#_a'{#_a!]#_a!k#_a!_#_a!Y#_a~P#/sO#l(aXP(aXR(aX[(aXa(aXj(aXr(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX'{(aX(b(aX(s(aX!k(aX!Y(aX'x(aXv(aX!_(aX%j(aX!g(aX~P!6kO!].vO!k(lX~P!:tO!k.yO~O!Y.{O~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nia#nij#nir#ni!]#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#o#ni~P#3cO#o$OO~P#3cOP$[OR#zOr$aO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO[#nia#nij#ni!]#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#s#ni~P#6QO#s$QO~P#6QOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO(bVOa#ni!]#ni#y#ni#{#ni#|#ni'{#ni(s#ni(z#ni({#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#w#ni~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO(bVO({#}Oa#ni!]#ni#{#ni#|#ni'{#ni(s#ni(z#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#y$UO~P#;VO#y#ni~P#;VO#w$SO~P#8oOP$[OR#zO[$cOj$ROr$aO!Q#yO!S#{O!l#xO!p$[O#R$RO#o$OO#p$PO#q$PO#r$PO#s$QO#t$RO#u$RO#v$bO#w$SO#y$UO(bVO(z#|O({#}Oa#ni!]#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~O#{#ni~P#={O#{$WO~P#={OP]XR]X[]Xj]Xr]X!Q]X!S]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X!]]X!^]X~O$P]X~P#@jOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO#{<iO#|<jO(bVO(s$YO(z#|O({#}O~O$P.}O~P#BwO#S$dO#`<pO$R<pO$P(hX!^(hX~P! uOa'ea!]'ea'{'ea'x'ea!k'ea!Y'eav'ea!_'ea%j'ea!g'ea~P!:tO[#nia#nij#nir#ni!]#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni'{#ni(s#ni'x#ni!Y#ni!k#niv#ni!_#ni%j#ni!g#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o$OO#p$PO#q$PO#r$PO(bVO(z#ni({#ni~P#EyOn>^O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P#EyO!]/ROg(qX~P!1WOg/TO~Oa$Qi!]$Qi'{$Qi'x$Qi!Y$Qi!k$Qiv$Qi!_$Qi%j$Qi!g$Qi~P!:tO$^/UO$`/UO~O$^/VO$`/VO~O!g)iO#`/WO!_$dX$[$dX$^$dX$`$dX$g$dX~O![/XO~O!_)lO$[/ZO$^)kO$`)kO$g/[O~O!]<kO!^(gX~P#BwO!^/]O~O!g)iO$g(|X~O$g/_O~Ov/`O~P!&zOx)zO(c){O(d/cO~O!S/fO~O(z$}On%ba!Q%ba'z%ba({%ba!]%ba#`%ba~Og%ba$P%ba~P#L{O({%POn%da!Q%da'z%da(z%da!]%da#`%da~Og%da$P%da~P#MnO!]fX!gfX!kfX!k${X(sfX~P!0SOp%WO![/oO!](_O(U/nO!Y(wP!Y)QP~P!1uOr*tO!b*rO!c*lO!d*lO!l*cO#[*sO%a*nO(V!lO(WTO(ZUO~Os'UO!S/pO![+^O!^*qO(f=OO!^(yP~P$ [O!k/qO~P#/sO!]/rO!g#vO(s'qO!k)PX~O!k/wO~OnoX!QoX'zoX(zoX({oX~O!g#vO!koX~P$#OOp/yO!S%hO![*_O!_%iO(U%gO!k)PP~O#l/zO~O!Y${X!]${X!g%SX~P!0SO!]/{O!Y)QX~P#/sO!g/}O~O!Y0PO~OpkO(U0QO~P.iOh%VOr0VO!g#vO!l%eO(s'qO~O!g+kO~Oa%nO!]0ZO'{%nO~O!^0]O~P!5iO!c0^O!d0^O(V!lO~P#$^Os!nO!S0_O(WTO(ZUO(f!mO~O#[0aO~Og%ba!]%ba#`%ba$P%ba~P!1WOg%da!]%da#`%da$P%da~P!1WOj%dOk%dOl%dO(U&ZOg'nX!]'nX~O!]*zOg(_a~Og0jO~On0lO#`0kOg(`a!](`a~OR0mO!Q0mO!S0nO#S$dOn}a'z}a(z}a({}a!]}a#`}a~Og}a$P}a~P$(cO!Q*PO'z*QOn$ta(z$ta({$ta!]$ta#`$ta~Og$ta$P$ta~P$)_O!Q*PO'z*QOn$va(z$va({$va!]$va#`$va~Og$va$P$va~P$*QO#l0qO~Og%Ua!]%Ua#`%Ua$P%Ua~P!1WO!g#vO~O#l0tO~O!]#iX!^#iX!g!RX#`#iX~O!]+`Oa)Ua'{)Ua~OR#zO!Q#yO!S#{O!l#xO(bVOP!ri[!rij!rir!ri!]!ri!p!ri#R!ri#o!ri#p!ri#q!ri#r!ri#s!ri#t!ri#u!ri#v!ri#w!ri#y!ri#{!ri#|!ri(s!ri(z!ri({!ri~Oa!ri'{!ri'x!ri!Y!ri!k!riv!ri!_!ri%j!ri!g!ri~P$+}Oh%VOr%XOs$tOt$tOz%YO|%ZO!O<uO!S${O!_$|O!i>WO!l$xO#k<{O$X%`O$u<wO$w<yO$z%aO(WTO(ZUO(b$uO(z$}O({%PO~Op0}O%^1OO(U0|O~P$.eO!g+kOa(^a!_(^a'{(^a!](^a~O#l1UO~O[]X!]fX!^fX~O!]1VO!^)YX~O!^1XO~O[1YO~Ob1[O(U+sO(WTO(ZUO~O!_&PO(U%gO`'vX!]'vX~O!]+xO`)Xa~O!k1_O~P!:tO[1bO~O`1cO~O#`1hO~On1kO!_$|O~O(f(}O!^)VP~Oh%VOn1tO!_1qO%j1sO~O[2OO!]1|O!^)WX~O!^2PO~O`2ROa%nO'{%nO~O(U#nO(WTO(ZUO~O#S$dO#`$eO$R$eOP(hXR(hX[(hXr(hX!Q(hX!S(hX!](hX!l(hX!p(hX#R(hX#o(hX#p(hX#q(hX#r(hX#s(hX#t(hX#u(hX#v(hX#w(hX#y(hX#{(hX#|(hX(b(hX(s(hX(z(hX({(hX~Oj2UO&]2VOa(hX~P$4OOj2UO#`$eO&]2VO~Oa2XO~P%[Oa2ZO~O&f2^OP&diQ&diS&diY&dia&did&die&dil&dip&dir&dis&dit&diz&di|&di!O&di!S&di!W&di!X&di!_&di!i&di!l&di!o&di!p&di!q&di!s&di!u&di!x&di!|&di$X&di$o&di%i&di%k&di%m&di%n&di%o&di%r&di%t&di%w&di%x&di%z&di&X&di&_&di&a&di&c&di&e&di&h&di&n&di&t&di&v&di&x&di&z&di&|&di'x&di(U&di(W&di(Z&di(b&di(p&di!^&dib&di&k&di~Ob2dO!^2bO&k2cO~P`O!_XO!l2fO~O&r,}OP&miQ&miS&miY&mia&mid&mie&mil&mip&mir&mis&mit&miz&mi|&mi!O&mi!S&mi!W&mi!X&mi!_&mi!i&mi!l&mi!o&mi!p&mi!q&mi!s&mi!u&mi!x&mi!|&mi$X&mi$o&mi%i&mi%k&mi%m&mi%n&mi%o&mi%r&mi%t&mi%w&mi%x&mi%z&mi&X&mi&_&mi&a&mi&c&mi&e&mi&h&mi&n&mi&t&mi&v&mi&x&mi&z&mi&|&mi'x&mi(U&mi(W&mi(Z&mi(b&mi(p&mi!^&mi&f&mib&mi&k&mi~O!Y2lO~O!]!aa!^!aa~P#BwOs!nO!S!oO![2qO(f!mO!]'YX!^'YX~P@nO!]-^O!^(ja~O!]'`X!^'`X~P!9|O!]-bO!^(ya~O!^2yO~P'_Oa%nO#`3SO'{%nO~Oa%nO!g#vO#`3SO'{%nO~Oa%nO!g#vO!p3WO#`3SO'{%nO(s'qO~Oa%nO'{%nO~P!:tO!]$_Ov$ra~O!Y'Xi!]'Xi~P!:tO!](WO!Y(ii~O!](_O!Y(wi~O!Y(xi!](xi~P!:tO!](ui!k(uia(ui'{(ui~P!:tO#`3YO!](ui!k(uia(ui'{(ui~O!](kO!k(ti~O!S%hO!_%iO!|]O#j3_O#k3^O(U%gO~O!S%hO!_%iO#k3^O(U%gO~On3fO!_'aO%j3eO~Oh%VOn3fO!_'aO%j3eO~O#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%bav%ba!_%ba%j%ba!g%ba~P#L{O#l%daP%daR%da[%daa%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%dav%da!_%da%j%da!g%da~P#MnO#l%baP%baR%ba[%baa%baj%bar%ba!S%ba!]%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba'{%ba(b%ba(s%ba!k%ba!Y%ba'x%ba#`%bav%ba!_%ba%j%ba!g%ba~P#/sO#l%daP%daR%da[%daa%daj%dar%da!S%da!]%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da'{%da(b%da(s%da!k%da!Y%da'x%da#`%dav%da!_%da%j%da!g%da~P#/sO#l}aP}a[}aa}aj}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a'{}a(b}a(s}a!k}a!Y}a'x}av}a!_}a%j}a!g}a~P$(cO#l$taP$taR$ta[$taa$taj$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta'{$ta(b$ta(s$ta!k$ta!Y$ta'x$tav$ta!_$ta%j$ta!g$ta~P$)_O#l$vaP$vaR$va[$vaa$vaj$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va'{$va(b$va(s$va!k$va!Y$va'x$vav$va!_$va%j$va!g$va~P$*QO#l%UaP%UaR%Ua[%Uaa%Uaj%Uar%Ua!S%Ua!]%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua'{%Ua(b%Ua(s%Ua!k%Ua!Y%Ua'x%Ua#`%Uav%Ua!_%Ua%j%Ua!g%Ua~P#/sOa#cq!]#cq'{#cq'x#cq!Y#cq!k#cqv#cq!_#cq%j#cq!g#cq~P!:tO![3nO!]'ZX!k'ZX~P%[O!].vO!k(la~O!].vO!k(la~P!:tO!Y3qO~O$P!na!^!na~PKlO$P!ja!]!ja!^!ja~P#BwO$P!ra!^!ra~P!=aO$P!ta!^!ta~P!?wOg'^X!]'^X~P!,TO!]/ROg(qa~OSfO!_4VO$e4WO~O!^4[O~Ov4]O~P#/sOa$nq!]$nq'{$nq'x$nq!Y$nq!k$nqv$nq!_$nq%j$nq!g$nq~P!:tO!Y4_O~P!&zO!S4`O~O!Q*PO'z*QO({%POn'ja(z'ja!]'ja#`'ja~Og'ja$P'ja~P%-tO!Q*PO'z*QOn'la(z'la({'la!]'la#`'la~Og'la$P'la~P%.gO(s$YO~P#/sO!YfX!Y${X!]fX!]${X!g%SX#`fX~P!0SOp%WO(U=XO~P!1uOp4dO!S%hO![4cO!_%iO(U%gO!]'fX!k'fX~O!]/rO!k)Pa~O!]/rO!g#vO!k)Pa~O!]/rO!g#vO(s'qO!k)Pa~Og$}i!]$}i#`$}i$P$}i~P!1WO![4lO!Y'hX!]'hX~P!3tO!]/{O!Y)Qa~O!]/{O!Y)Qa~P#/sOP]XR]X[]Xj]Xr]X!Q]X!S]X!Y]X!]]X!l]X!p]X#R]X#S]X#`]X#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~Oj%ZX!g%ZX~P%2^Oj4qO!g#vO~Oh%VO!g#vO!l%eO~Oh%VOr4vO!l%eO(s'qO~Or4{O!g#vO(s'qO~Os!nO!S4|O(WTO(ZUO(f!mO~O(z$}On%bi!Q%bi'z%bi({%bi!]%bi#`%bi~Og%bi$P%bi~P%5}O({%POn%di!Q%di'z%di(z%di!]%di#`%di~Og%di$P%di~P%6pOg(`i!](`i~P!1WO#`5SOg(`i!](`i~P!1WO!k5XO~Oa$pq!]$pq'{$pq'x$pq!Y$pq!k$pqv$pq!_$pq%j$pq!g$pq~P!:tO!Y5]O~O!]5^O!_)RX~P#/sOa${X!_${X%_]X'{${X!]${X~P!0SO%_5aOaoX!_oX'{oX!]oX~P$#OOp5bO(U#nO~O%_5aO~Ob5hO%k5iO(U+sO(WTO(ZUO!]'uX!^'uX~O!]1VO!^)Ya~O[5mO~O`5nO~O[5rO~Oa%nO'{%nO~P#/sO!]5wO#`5yO!^)VX~O!^5zO~Or6QOs!nO!S*jO!b!yO!c!vO!d!vO!|<XO#T!pO#U!pO#V!pO#W!pO#X!pO#[6PO#]!zO(V!lO(WTO(ZUO(f!mO(p!sO~O!^6OO~P%;sOn6VO!_1qO%j6UO~Oh%VOn6VO!_1qO%j6UO~Ob6^O(U#nO(WTO(ZUO!]'tX!^'tX~O!]1|O!^)Wa~O(WTO(ZUO(f6`O~O`6dO~Oj6gO&]6hO~PNXO!k6iO~P%[Oa6kO~Oa6kO~P%[Ob2dO!^6pO&k2cO~P`O!g6rO~O!g6tOh(ki!](ki!^(ki!g(ki!l(kir(ki(s(ki~O#`6uO!]#hi!^#hi~O!]!ai!^!ai~P#BwO!]#hi!^#hi~P#BwOa%nO#`7OO'{%nO~Oa%nO!g#vO#`7OO'{%nO~O!](uq!k(uqa(uq'{(uq~P!:tO!](kO!k(tq~O!S%hO!_%iO#k7VO(U%gO~O!_'aO%j7YO~On7^O!_'aO%j7YO~O#l'jaP'jaR'ja['jaa'jaj'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja'{'ja(b'ja(s'ja!k'ja!Y'ja'x'jav'ja!_'ja%j'ja!g'ja~P%-tO#l'laP'laR'la['laa'laj'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la'{'la(b'la(s'la!k'la!Y'la'x'lav'la!_'la%j'la!g'la~P%.gO#l$}iP$}iR$}i[$}ia$}ij$}ir$}i!S$}i!]$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i'{$}i(b$}i(s$}i!k$}i!Y$}i'x$}i#`$}iv$}i!_$}i%j$}i!g$}i~P#/sO#l%biP%biR%bi[%bia%bij%bir%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi'{%bi(b%bi(s%bi!k%bi!Y%bi'x%biv%bi!_%bi%j%bi!g%bi~P%5}O#l%diP%diR%di[%dia%dij%dir%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di'{%di(b%di(s%di!k%di!Y%di'x%div%di!_%di%j%di!g%di~P%6pO!]'Za!k'Za~P!:tO!].vO!k(li~O$P#ci!]#ci!^#ci~P#BwOP$[OR#zO!Q#yO!S#{O!l#xO!p$[O(bVO[#nij#nir#ni#R#ni#p#ni#q#ni#r#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#o#ni~P%NrO#o<aO~P%NrOP$[OR#zOr<mO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO[#nij#ni#R#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#s#ni~P&!zO#s<cO~P&!zOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO(bVO#y#ni#{#ni#|#ni$P#ni(s#ni(z#ni({#ni!]#ni!^#ni~O#w#ni~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO(bVO({#}O#{#ni#|#ni$P#ni(s#ni(z#ni!]#ni!^#ni~O#y<gO~P&'TO#y#ni~P&'TO#w<eO~P&%SOP$[OR#zO[<oOj<dOr<mO!Q#yO!S#{O!l#xO!p$[O#R<dO#o<aO#p<bO#q<bO#r<bO#s<cO#t<dO#u<dO#v<nO#w<eO#y<gO(bVO(z#|O({#}O#|#ni$P#ni(s#ni!]#ni!^#ni~O#{#ni~P&)dO#{<iO~P&)dOa#}y!]#}y'{#}y'x#}y!Y#}y!k#}yv#}y!_#}y%j#}y!g#}y~P!:tO[#nij#nir#ni#R#ni#s#ni#t#ni#u#ni#v#ni#w#ni#y#ni#{#ni#|#ni$P#ni(s#ni!]#ni!^#ni~OP$[OR#zO!Q#yO!S#{O!l#xO!p$[O#o<aO#p<bO#q<bO#r<bO(bVO(z#ni({#ni~P&,`On>_O!Q*PO'z*QO(z$}O({%POP#niR#ni!S#ni!l#ni!p#ni#o#ni#p#ni#q#ni#r#ni(b#ni~P&,`O#S$dOP(aXR(aX[(aXj(aXn(aXr(aX!Q(aX!S(aX!l(aX!p(aX#R(aX#o(aX#p(aX#q(aX#r(aX#s(aX#t(aX#u(aX#v(aX#w(aX#y(aX#{(aX#|(aX$P(aX'z(aX(b(aX(s(aX(z(aX({(aX!](aX!^(aX~O$P$Qi!]$Qi!^$Qi~P#BwO$P!ri!^!ri~P$+}Og'^a!]'^a~P!1WO!^7pO~O!]'ea!^'ea~P#BwO!Y7qO~P#/sO!g#vO(s'qO!]'fa!k'fa~O!]/rO!k)Pi~O!]/rO!g#vO!k)Pi~Og$}q!]$}q#`$}q$P$}q~P!1WO!Y'ha!]'ha~P#/sO!g7xO~O!]/{O!Y)Qi~P#/sO!]/{O!Y)Qi~O!Y7{O~Oh%VOr8QO!l%eO(s'qO~Oj8SO!g#vO~Or8VO!g#vO(s'qO~O!Q*PO'z*QO({%POn'ka(z'ka!]'ka#`'ka~Og'ka$P'ka~P&5aO!Q*PO'z*QOn'ma(z'ma({'ma!]'ma#`'ma~Og'ma$P'ma~P&6SOg(`q!](`q~P!1WO#`8XOg(`q!](`q~P!1WO!Y8YO~Og%Pq!]%Pq#`%Pq$P%Pq~P!1WOa$py!]$py'{$py'x$py!Y$py!k$pyv$py!_$py%j$py!g$py~P!:tO!g6tO~O!]5^O!_)Ra~O!_'aOP$UaR$Ua[$Uaj$Uar$Ua!Q$Ua!S$Ua!]$Ua!l$Ua!p$Ua#R$Ua#o$Ua#p$Ua#q$Ua#r$Ua#s$Ua#t$Ua#u$Ua#v$Ua#w$Ua#y$Ua#{$Ua#|$Ua(b$Ua(s$Ua(z$Ua({$Ua~O%j7YO~P&8tO%_8^Oa%]i!_%]i'{%]i!]%]i~Oa#cy!]#cy'{#cy'x#cy!Y#cy!k#cyv#cy!_#cy%j#cy!g#cy~P!:tO[8`O~Ob8bO(U+sO(WTO(ZUO~O!]1VO!^)Yi~O`8fO~O(f(}O!]'qX!^'qX~O!]5wO!^)Va~O!^8pO~P%;sO(p!sO~P$&YO#[8qO~O!_1qO~O!_1qO%j8sO~On8vO!_1qO%j8sO~O[8{O!]'ta!^'ta~O!]1|O!^)Wi~O!k9PO~O!k9QO~O!k9TO~O!k9TO~P%[Oa9VO~O!g9WO~O!k9XO~O!](xi!^(xi~P#BwOa%nO#`9aO'{%nO~O!](uy!k(uya(uy'{(uy~P!:tO!](kO!k(ty~O%j9dO~P&8tO!_'aO%j9dO~O#l$}qP$}qR$}q[$}qa$}qj$}qr$}q!S$}q!]$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q'{$}q(b$}q(s$}q!k$}q!Y$}q'x$}q#`$}qv$}q!_$}q%j$}q!g$}q~P#/sO#l'kaP'kaR'ka['kaa'kaj'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka'{'ka(b'ka(s'ka!k'ka!Y'ka'x'kav'ka!_'ka%j'ka!g'ka~P&5aO#l'maP'maR'ma['maa'maj'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma'{'ma(b'ma(s'ma!k'ma!Y'ma'x'mav'ma!_'ma%j'ma!g'ma~P&6SO#l%PqP%PqR%Pq[%Pqa%Pqj%Pqr%Pq!S%Pq!]%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq'{%Pq(b%Pq(s%Pq!k%Pq!Y%Pq'x%Pq#`%Pqv%Pq!_%Pq%j%Pq!g%Pq~P#/sO!]'Zi!k'Zi~P!:tO$P#cq!]#cq!^#cq~P#BwO(z$}OP%baR%ba[%baj%bar%ba!S%ba!l%ba!p%ba#R%ba#o%ba#p%ba#q%ba#r%ba#s%ba#t%ba#u%ba#v%ba#w%ba#y%ba#{%ba#|%ba$P%ba(b%ba(s%ba!]%ba!^%ba~On%ba!Q%ba'z%ba({%ba~P&JXO({%POP%daR%da[%daj%dar%da!S%da!l%da!p%da#R%da#o%da#p%da#q%da#r%da#s%da#t%da#u%da#v%da#w%da#y%da#{%da#|%da$P%da(b%da(s%da!]%da!^%da~On%da!Q%da'z%da(z%da~P&L`On>_O!Q*PO'z*QO({%PO~P&JXOn>_O!Q*PO'z*QO(z$}O~P&L`OR0mO!Q0mO!S0nO#S$dOP}a[}aj}an}ar}a!l}a!p}a#R}a#o}a#p}a#q}a#r}a#s}a#t}a#u}a#v}a#w}a#y}a#{}a#|}a$P}a'z}a(b}a(s}a(z}a({}a!]}a!^}a~O!Q*PO'z*QOP$taR$ta[$taj$tan$tar$ta!S$ta!l$ta!p$ta#R$ta#o$ta#p$ta#q$ta#r$ta#s$ta#t$ta#u$ta#v$ta#w$ta#y$ta#{$ta#|$ta$P$ta(b$ta(s$ta(z$ta({$ta!]$ta!^$ta~O!Q*PO'z*QOP$vaR$va[$vaj$van$var$va!S$va!l$va!p$va#R$va#o$va#p$va#q$va#r$va#s$va#t$va#u$va#v$va#w$va#y$va#{$va#|$va$P$va(b$va(s$va(z$va({$va!]$va!^$va~On>_O!Q*PO'z*QO(z$}O({%PO~OP%UaR%Ua[%Uaj%Uar%Ua!S%Ua!l%Ua!p%Ua#R%Ua#o%Ua#p%Ua#q%Ua#r%Ua#s%Ua#t%Ua#u%Ua#v%Ua#w%Ua#y%Ua#{%Ua#|%Ua$P%Ua(b%Ua(s%Ua!]%Ua!^%Ua~P''eO$P$nq!]$nq!^$nq~P#BwO$P$pq!]$pq!^$pq~P#BwO!^9qO~O$P9rO~P!1WO!g#vO!]'fi!k'fi~O!g#vO(s'qO!]'fi!k'fi~O!]/rO!k)Pq~O!Y'hi!]'hi~P#/sO!]/{O!Y)Qq~Or9yO!g#vO(s'qO~O[9{O!Y9zO~P#/sO!Y9zO~Oj:RO!g#vO~Og(`y!](`y~P!1WO!]'oa!_'oa~P#/sOa%]q!_%]q'{%]q!]%]q~P#/sO[:WO~O!]1VO!^)Yq~O`:[O~O#`:]O!]'qa!^'qa~O!]5wO!^)Vi~P#BwO!S:_O~O!_1qO%j:bO~O(WTO(ZUO(f:gO~O!]1|O!^)Wq~O!k:jO~O!k:kO~O!k:lO~O!k:lO~P%[O#`:oO!]#hy!^#hy~O!]#hy!^#hy~P#BwO%j:tO~P&8tO!_'aO%j:tO~O$P#}y!]#}y!^#}y~P#BwOP$}iR$}i[$}ij$}ir$}i!S$}i!l$}i!p$}i#R$}i#o$}i#p$}i#q$}i#r$}i#s$}i#t$}i#u$}i#v$}i#w$}i#y$}i#{$}i#|$}i$P$}i(b$}i(s$}i!]$}i!^$}i~P''eO!Q*PO'z*QO({%POP'jaR'ja['jaj'jan'jar'ja!S'ja!l'ja!p'ja#R'ja#o'ja#p'ja#q'ja#r'ja#s'ja#t'ja#u'ja#v'ja#w'ja#y'ja#{'ja#|'ja$P'ja(b'ja(s'ja(z'ja!]'ja!^'ja~O!Q*PO'z*QOP'laR'la['laj'lan'lar'la!S'la!l'la!p'la#R'la#o'la#p'la#q'la#r'la#s'la#t'la#u'la#v'la#w'la#y'la#{'la#|'la$P'la(b'la(s'la(z'la({'la!]'la!^'la~O(z$}OP%biR%bi[%bij%bin%bir%bi!Q%bi!S%bi!l%bi!p%bi#R%bi#o%bi#p%bi#q%bi#r%bi#s%bi#t%bi#u%bi#v%bi#w%bi#y%bi#{%bi#|%bi$P%bi'z%bi(b%bi(s%bi({%bi!]%bi!^%bi~O({%POP%diR%di[%dij%din%dir%di!Q%di!S%di!l%di!p%di#R%di#o%di#p%di#q%di#r%di#s%di#t%di#u%di#v%di#w%di#y%di#{%di#|%di$P%di'z%di(b%di(s%di(z%di!]%di!^%di~O$P$py!]$py!^$py~P#BwO$P#cy!]#cy!^#cy~P#BwO!g#vO!]'fq!k'fq~O!]/rO!k)Py~O!Y'hq!]'hq~P#/sOr;OO!g#vO(s'qO~O[;SO!Y;RO~P#/sO!Y;RO~Og(`!R!](`!R~P!1WOa%]y!_%]y'{%]y!]%]y~P#/sO!]1VO!^)Yy~O!]5wO!^)Vq~O(U;ZO~O!_1qO%j;^O~O!k;aO~O%j;fO~P&8tOP$}qR$}q[$}qj$}qr$}q!S$}q!l$}q!p$}q#R$}q#o$}q#p$}q#q$}q#r$}q#s$}q#t$}q#u$}q#v$}q#w$}q#y$}q#{$}q#|$}q$P$}q(b$}q(s$}q!]$}q!^$}q~P''eO!Q*PO'z*QO({%POP'kaR'ka['kaj'kan'kar'ka!S'ka!l'ka!p'ka#R'ka#o'ka#p'ka#q'ka#r'ka#s'ka#t'ka#u'ka#v'ka#w'ka#y'ka#{'ka#|'ka$P'ka(b'ka(s'ka(z'ka!]'ka!^'ka~O!Q*PO'z*QOP'maR'ma['maj'man'mar'ma!S'ma!l'ma!p'ma#R'ma#o'ma#p'ma#q'ma#r'ma#s'ma#t'ma#u'ma#v'ma#w'ma#y'ma#{'ma#|'ma$P'ma(b'ma(s'ma(z'ma({'ma!]'ma!^'ma~OP%PqR%Pq[%Pqj%Pqr%Pq!S%Pq!l%Pq!p%Pq#R%Pq#o%Pq#p%Pq#q%Pq#r%Pq#s%Pq#t%Pq#u%Pq#v%Pq#w%Pq#y%Pq#{%Pq#|%Pq$P%Pq(b%Pq(s%Pq!]%Pq!^%Pq~P''eOg%f!Z!]%f!Z#`%f!Z$P%f!Z~P!1WO!Y;jO~P#/sOr;kO!g#vO(s'qO~O[;mO!Y;jO~P#/sO!]'qq!^'qq~P#BwO!]#h!Z!^#h!Z~P#BwO#l%f!ZP%f!ZR%f!Z[%f!Za%f!Zj%f!Zr%f!Z!S%f!Z!]%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z'{%f!Z(b%f!Z(s%f!Z!k%f!Z!Y%f!Z'x%f!Z#`%f!Zv%f!Z!_%f!Z%j%f!Z!g%f!Z~P#/sOr;vO!g#vO(s'qO~O!Y;wO~P#/sOr<OO!g#vO(s'qO~O!Y<PO~P#/sOP%f!ZR%f!Z[%f!Zj%f!Zr%f!Z!S%f!Z!l%f!Z!p%f!Z#R%f!Z#o%f!Z#p%f!Z#q%f!Z#r%f!Z#s%f!Z#t%f!Z#u%f!Z#v%f!Z#w%f!Z#y%f!Z#{%f!Z#|%f!Z$P%f!Z(b%f!Z(s%f!Z!]%f!Z!^%f!Z~P''eOr<SO!g#vO(s'qO~Ov(gX~P1qO!Q%rO~P!)[O(V!lO~P!)[O!YfX!]fX#`fX~P%2^OP]XR]X[]Xj]Xr]X!Q]X!S]X!]]X!]fX!l]X!p]X#R]X#S]X#`]X#`fX#lfX#o]X#p]X#q]X#r]X#s]X#t]X#u]X#v]X#w]X#y]X#{]X#|]X$R]X(b]X(s]X(z]X({]X~O!gfX!k]X!kfX(sfX~P'LcOP<WOQ<WOSfOd>SOe!iOpkOr<WOskOtkOzkO|<WO!O<WO!SWO!WkO!XkO!_XO!i<ZO!lZO!o<WO!p<WO!q<WO!s<[O!u<_O!x!hO$X!kO$o>QO(U)^O(WTO(ZUO(bVO(p[O~O!]<kO!^$ra~Oh%VOp%WOr%XOs$tOt$tOz%YO|%ZO!O<vO!S${O!_$|O!i>XO!l$xO#k<|O$X%`O$u<xO$w<zO$z%aO(U(wO(WTO(ZUO(b$uO(z$}O({%PO~Ol)eO~P(#XOr!eX(s!eX~P#!nO!^]X!^fX~P'LcO!YfX!Y${X!]fX!]${X#`fX~P!0SO#l<`O~O!g#vO#l<`O~O#`<pO~Oj<dO~O#`=PO!](xX!^(xX~O#`<pO!](vX!^(vX~O#l=QO~Og=SO~P!1WO#l=YO~O#l=ZO~Og=SO(U&ZO~O!g#vO#l=[O~O!g#vO#l=QO~O$P=]O~P#BwO#l=^O~O#l=_O~O#l=dO~O#l=eO~O#l=fO~O#l=gO~O$P=hO~P!1WO$P=iO~P!1WOl=tO~P7eOk#S#T#U#W#X#[#j#k#v$o$u$w$z%^%_%i%j%k%r%t%w%x%z%|~(PT#p!X'}(V#qs#o#rr!Q(O$^(U$`(f~",
  goto: "$9_)^PPPPPP)_PP)bP)sP+X/^PPPP6lPP7SPP=PPPP@sPA]PA]PPPA]PCePA]PA]PA]PCiPCnPD]PIVPPPIZPPPPIZL^PPPLdMUPIZPIZPP! dIZPPPIZPIZP!#kIZP!'R!(W!(aP!)T!)X!)T!,fPPPPPPP!-V!(WPP!-g!/XP!2hIZIZ!2m!5y!:g!:g!>f!>nPPP!>tIZPPPPPPPPP!BTP!CbPPIZ!DsPIZPIZIZIZIZIZPIZ!FVP!IaP!LgP!Lk!Lu!Ly!LyP!I^P!L}!L}P#!TP#!XIZPIZ#!_#%dCiA]PA]PA]A]P#&qA]A]#)TA]#+{A]#.XA]A]#.w#1]#1]#1b#1k#1]#1vPP#1]PA]#2`A]#6_A]A]6lPPP#:dPPP#:}#:}P#:}P#;e#:}PP#;kP#;bP#;b#<O#;b#<j#<p#<s)bP#<v)bP#=P#=P#=PP)bP)bP)bP)bPP)bP#=V#=YP#=Y)bP#=^P#=aP)bP)bP)bP)bP)bP)b)bPP#=g#=m#=x#>O#>U#>[#>b#>p#>v#?Q#?W#?b#?h#?x#@O#@p#AS#AY#A`#An#BT#Cx#DW#D_#Ey#FX#Gy#HX#H_#He#Hk#Hu#H{#IR#I]#Io#IuPPPPPPPPPPP#I{PPPPPPP#Jp#M}$ g$ n$ vPPP$'bP$'k$*d$0}$1Q$1T$2S$2V$2^$2fP$2l$2oP$3]$3a$4X$5g$5l$6SPP$6X$6_$6c$6f$6j$6n$7j$8R$8j$8n$8q$8t$9O$9R$9V$9ZR!|RoqOXst!Z#d%m&r&t&u&w,u,z2^2aY!vQ'a-g1q5}Q%tvQ%|yQ&T|Q&j!VS'W!e-^Q'g!iS'm!r!yU*l$|*[*pQ+q%}S,O&V&WQ,f&dQ-e'`Q-o'hQ-w'nQ0^*rQ1d,QQ1{,gR<}<[%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9aS#q]<X!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU+Q%]<u<vQ+v&PQ,h&gQ,o&oQ0z+iQ1P+kQ1[+wQ2T,mQ3b.iQ5b1OQ5h1VQ6^1|Q7[3fQ8b5iR9g7^'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T!S!nQ!r!v!y!z$|'W'`'a'm'n'o*l*p*r*s-^-e-g-w0^0a1q5}6P%[$ti#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q&X|S'U!e*[S']%i-bQ+v&PQ,R&WQ,h&gQ0p+TQ1[+wQ1a+}Q2S,lQ2T,mQ5h1VQ5q1cQ6^1|Q6a2OQ6b2RQ8b5iQ8e5nQ9O6dQ:Z8fQ:h8{R;X:[rnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR,j&k&z^OPXYstuvwz!Z!`!g!j!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'c's(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>S>T[#]WZ#W#Z'X(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ%wxQ%{yW&Q|&V&W,QQ&_!TQ'd!hQ'f!iQ(r#sS+p%|%}Q+t&PQ,a&bQ,e&dS-n'g'hQ.k(sQ1T+qQ1Z+wQ1]+xQ1`+|Q1v,bS1z,f,gQ3O-oQ5g1VQ5k1YQ5p1bQ6]1{Q8a5iQ8d5mQ8h5rQ:V8`R;V:W!U$zi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z!^%yy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}Q+j%wQ,V&[Q,Y&]Q,d&dQ.j(rQ1u,aU1y,e,f,gQ3g.kQ6W1vS6[1z1{Q8z6]#f>U#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o>V<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iW%Ti%V*z>QS&[!Q&iQ&]!RQ&^!SU+O%[%d=tR,T&Y%]%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_T){$u)|V+Q%]<u<vW']!e%i*[-bS)O#y#zQ+e%rQ+{&SS.d(n(oQ1l,ZQ5V0mR8k5w'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T$i$^c#Y#e%q%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/O/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wT#TV#U'RkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ'Y!eR2r-^!W!nQ!e!r!v!y!z$|'W'`'a'm'n'o*[*l*p*r*s-^-e-g-w0^0a1q5}6PR1n,]nqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&y!^Q'w!xS(t#u<`Q+n%zQ,_&_Q,`&aQ-l'eQ-y'pS.t(y=QS0s+Y=[Q1R+oQ1p,^Q2e,|Q2g,}Q2n-XQ2|-mQ3P-qS5[0t=fQ5c1SS5f1U=gQ6v2pQ6z2}Q7P3UQ8_5dQ9[6xQ9]6{Q9`7QR:n9X$d$]c#Y#e%s%u(T(Z(u(z)S)T)U)V)W)X)Y)Z)[)])_)a)c)h)r+f+z-[-z.P.U.W.u.x.|/P/Q/d0r2o2t3Q3X3m3r3s3t3u3v3w3x3y3z3{3|3}4O4R4S4Z5Z5e6w6}7S7c7d7m7n8m9Z9_9i9o9p:q;Y;b<Y=wS(p#p'jQ)Q#zS+d%q/OS.e(o(qR3`.f'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS#q]<XQ&t!XQ&u!YQ&w![Q&x!]R2],xQ'b!hQ+g%wQ-j'dS.g(r+jQ2z-iW3d.j.k0y0{Q6y2{W7W3a3c3g5`U9c7X7Z7]U:s9e9f9hS;d:r:uQ;r;eR;z;sU!wQ'a-gT5{1q5}!Q_OXZ`st!V!Z#d#h%e%m&i&k&r&t&u&w(k,u,z.^2^2a]!pQ!r'a-g1q5}T#q]<X%^{OPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS)O#y#zS.d(n(o!s=m$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TU$fd)`,oS(q#p'jU*w%R(x4QU0o+P.p7iQ5`0zQ7X3bQ9f7[R:u9gm!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PQ'u!uS(g#g2WS-u'l'xQ/u*^Q0T*kQ3W-xQ4h/vQ4t0VQ4u0WQ4z0`Q7t4bS8P4v4xS8T4{4}Q9t7uQ9x7{Q9}8QQ:S8VS:}9y9zS;i;O;RS;u;j;kS;};v;wS<R<O<PR<U<SQ#wbQ't!uS(f#g2WS(h#m+XQ+Z%fQ+l%xQ+r&OU-t'l'u'xQ.Y(gU/t*^*a/yQ0U*kQ0X*mQ1Q+mQ1w,cS3T-u-xQ3].bS4g/u/vQ4p0RS4s0T0`Q4w0YQ6Y1xQ7R3WS7s4b4dQ7w4hU8O4t4z4}Q8R4yQ8x6ZS9s7t7uQ9w7{Q:P8TQ:Q8UQ:e8yQ:{9tS:|9x9zQ;U:SQ;`:fS;h:};RS;t;i;jS;|;u;wS<Q;}<PQ<T<RQ<V<UQ=p=kQ=|=uR=}=vV!wQ'a-g%^aOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aS#wz!j!r=j$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=p>S%^bOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aQ%fj!^%xy!i!u%{%|%}'V'f'g'h'l'v*k+p+q-Z-n-o-v0T0W1T2w3O3V4t4u4x8P9}S&Oz!jQ+m%yQ,c&dW1x,d,e,f,gU6Z1y1z1{S8y6[6]Q:f8z!r=k$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ=u>RR=v>S%QeOPXYstuvw!Z!`!g!o#S#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9aY#bWZ#W#Z(U!b%jm#h#i#l$x%e%h(_(i(j(k*Z*_*c+[+^+`,q-W.V.].^._.a/o/r2f3^3_4c6t7VQ,p&o!p=l$Z$n)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TR=o'XU'^!e%i*[R2u-bX'[!e%i*[-b%SdOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_,r,u,z-k-s.R.X.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3n4|6V6g6h6k7O8v9V9a!r)`$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TQ,o&oQ0z+iQ3b.iQ7[3fR9g7^!b$Tc#Y%q(T(Z(u(z)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!P<f)_)r-[/O2o2t3r3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!f$Vc#Y%q(T(Z(u(z)X)Y)[)])a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<Y!T<h)_)r-[/O2o2t3r3x3y3{3|4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=w!^$Zc#Y%q(T(Z(u(z)a)h+z-z.P.U.W.u.x/d0r3Q3X3m3}5Z5e6}7S7c9_:q<YQ4a/mz>T)_)r-[/O2o2t3r4R4Z6w7d7m7n8m9Z9i9o9p;Y;b=wQ>Y>[R>Z>]'QkOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TS$oh$pR4W/W'XgOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$kf$qQ$ifS)k$l)oR)w$qT$jf$qT)m$l)o'XhOPWXYZhstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$Z$_$a$e$n$p%m%t&R&k&n&o&r&t&u&w&{'T'X'c's(U(W(^(e(y({)P)t*O*j+Y+_+i,r,u,z-Y-a-k-s.R.X.i.v.}/W/X/p0_0n0t1U1t2U2V2X2Z2^2a2c2q3S3Y3f3n4V4|5y6V6g6h6k6u7O7^8v9V9a:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>TT$oh$pQ$rhR)v$p%^jOPWXYZstuvw!Z!`!g!o#S#W#Z#d#o#u#x#{$O$P$Q$R$S$T$U$V$W$X$_$a$e%m%t&R&k&n&o&r&t&u&w&{'T'c's(U(W(^(e(y({)P*O*j+Y+_+i,r,u,z-k-s.R.X.i.v.}/p0_0n0t1U1t2U2V2X2Z2^2a2c3S3Y3f3n4|6V6g6h6k7O7^8v9V9a!s>R$Z$n'X)t-Y-a/X2q4V5y6u:]:o<W<Z<[<_<`<a<b<c<d<e<f<g<h<i<j<k<m<p<}=P=Q=S=[=]=f=g>T#glOPXZst!Z!`!o#S#d#o#{$n%m&k&n&o&r&t&u&w&{'T'c)P)t*j+_+i,r,u,z-k.i/X/p0_0n1t2U2V2X2Z2^2a2c3f4V4|6V6g6h6k7^8v9V!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_Q+U%aQ/e*Po4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!U$yi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>ZQ*d$zU*m$|*[*pQ+V%bQ0Y*n#f=r#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n=s<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=iQ=x>UQ=y>VQ=z>WR={>X!U%Ri$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z#f(x#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_o4Q<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=inoOXst!Z#d%m&r&t&u&w,u,z2^2aS*g${*ZQ-T'OQ-U'QR4k/{%[%Si#v$b$c$d$x${%O%Q%^%_%c)z*S*U*W*Z*b*h*x*y+h+k,U,X.h/R/f/o/z/{/}0b0d0k0l0q1h1k1s3e4`4a4l4q5S5^5a6U7Y7x8S8X8^8s9d9r9{:R:b:t;S;^;f;m<n<o<q<r<s<t<w<x<y<z<{<|=T=U=V=W=Y=Z=^=_=`=a=b=c=d=e=h=i>Q>Y>Z>^>_Q,W&]Q1j,YQ5u1iR8j5vV*o$|*[*pU*o$|*[*pT5|1q5}S0R*j/pQ4y0_T8U4|:_Q+l%xQ0X*mQ1Q+mQ1w,cQ6Y1xQ8x6ZQ:e8yR;`:f!U%Oi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Zx*S$v)f*T*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>PS0b*u0c#f<q#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<r<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!d=T(v)d*]*f.l.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]`=U4P7e7h7l9j:v:y;{S=`.n3kT=a7g9m!U%Qi$d%O%Q%^%_%c*S*U*b*x*y/R/z0b0d0k0l0q4a5S8X9r>Q>Y>Z|*U$v)f*V*u+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>PS0d*v0e#f<s#v$b$c$x${)z*W*Z*h+h+k,U,X.h/f/o/{/}1h1k1s3e4`4l4q5^5a6U7Y7x8S8^8s9d9{:R:b:t;S;^;f;m<q<s<w<y<{=T=V=Y=^=`=b=d=h>^>_n<t<n<o<r<t<x<z<|=U=W=Z=_=a=c=e=i!h=V(v)d*]*f.m.n.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]d=W4P7f7g7l9j9k:v:w:y;{S=b.o3lT=c7h9nrnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ&f!UR,r&ornOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aR&f!UQ,[&^R1f,TsnOXst!V!Z#d%m&i&r&t&u&w,u,z2^2aQ1r,aS6T1u1vU8r6R6S6WS:a8t8uS;[:`:cQ;o;]R;y;pQ&m!VR,k&iR6a2OR:h8{W&Q|&V&W,QR1]+xQ&r!WR,u&sR,{&xT2_,z2aR-P&yQ-O&yR2h-PQ'z!{R-{'zSsOtQ#dXT%ps#dQ#OTR'|#OQ#RUR(O#RQ)|$uR/b)|Q#UVR(R#UQ#XWU(X#X(Y.SQ(Y#YR.S(ZQ-_'YR2s-_Q.w(zS3o.w3pR3p.xQ-g'aR2x-gY!rQ'a-g1q5}R'k!rQ/S)fR4U/SU#_W%h*ZU(`#_(a.TQ(a#`R.T([Q-c'^R2v-ct`OXst!V!Z#d%m&i&k&r&t&u&w,u,z2^2aS#hZ%eU#r`#h.^R.^(kQ(l#jQ.Z(hW.c(l.Z3Z7TQ3Z.[R7T3[Q)o$lR/Y)oQ$phR)u$pQ$`cU)b$`.O<lQ.O<YR<l)rQ/s*^W4e/s4f7v9uU4f/t/u/vS7v4g4hR9u7w$e*R$v(v)d)f*]*f*u*v+R+S+W.n.o.q.r.s/a/i/k/m/x0O0f0g0x1g3h3i3j4P4T4^4i4j4n5O5Q5T5U5Y5t7_7`7a7b7g7h7j7k7l7r7y7|8W8Z8]9j9k9l9v:O:T:U:v:w:x:y:z;P;T;g;l;x;{=q>O>P>[>]Q/|*fU4m/|4o7zQ4o0OR7z4nS*p$|*[R0[*px*T$v)f*u*v+W/x0f0g4T4i5T5U5Y7r8W:T:z=q>O>P!d.l(v)d*]*f.n.o.s/a/m0O0x1g3j4^4j4n5t7_7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/j*T.l7ea7e4P7g7h7l9j:v:y;{Q0c*uQ3k.nU5P0c3k9mR9m7g|*V$v)f*u*v+W/i/x0f0g4T4i5O5T5U5Y7r8W:T:z=q>O>P!h.m(v)d*]*f.n.o.s/a/m0O0x1g3h3j4^4j4n5t7_7`7b7y7|8Z8]9v:O:U;P;T;g;l;x>[>]U/l*V.m7fe7f4P7g7h7l9j9k:v:w:y;{Q0e*vQ3l.oU5R0e3l9nR9n7hQ*{%UR0i*{Q5_0xR8[5_Q+a%kR0w+aQ5x1lS8l5x:^R:^8mQ,^&_R1o,^Q5}1qR8o5}Q1},hS6_1}8|R8|6aQ1W+tW5j1W5l8c:XQ5l1ZQ8c5kR:X8dQ+y&QR1^+yQ2a,zR6o2aYrOXst#dQ&v!ZQ+c%mQ,t&rQ,v&tQ,w&uQ,y&wQ2[,uS2_,z2aR6n2^Q%opQ&z!_Q&}!aQ'P!bQ'R!cQ'r!uQ+b%lQ+n%zQ,S&XQ,j&mQ-R&|W-r'l't'u'xQ-y'pQ0Z*oQ1R+oQ1e,RS2Q,k,nQ2i-QQ2j-TQ2k-UQ3P-qW3R-t-u-x-zQ5c1SQ5o1aQ5s1gQ6X1wQ6c2SQ6m2]U6|3Q3T3WQ7P3UQ8_5dQ8g5qQ8i5tQ8n5|Q8w6YQ8}6bS9^6}7RQ9`7QQ:Y8eQ:d8xQ:i9OQ:p9_Q;W:ZQ;_:eQ;c:qQ;n;XR;q;`Q%zyQ'e!iQ'p!uU+o%{%|%}Q-X'VU-m'f'g'hS-q'l'vQ0S*kS1S+p+qQ2p-ZS2}-n-oQ3U-vS4r0T0WQ5d1TQ6x2wQ6{3OQ7Q3VU7}4t4u4xQ9|8PR;Q9}S$wi>QR*|%VU%Ui%V>QR0h*zQ$viS(v#v+kS)d$b$cQ)f$dQ*]$xS*f${*ZQ*u%OQ*v%QQ+R%^Q+S%_Q+W%cQ.n<qQ.o<sQ.q<wQ.r<yQ.s<{Q/a)zQ/i*SQ/k*UQ/m*WQ/x*bS0O*h/oQ0f*xQ0g*yl0x+h,X.h1k1s3e6U7Y8s9d:b:t;^;fQ1g,UQ3h=TQ3i=VQ3j=YS4P<n<oQ4T/RS4^/f4`Q4i/zQ4j/{Q4n/}Q5O0bQ5Q0dQ5T0kQ5U0lQ5Y0qQ5t1hQ7_=^Q7`=`Q7a=bQ7b=dQ7g<rQ7h<tQ7j<xQ7k<zQ7l<|Q7r4aQ7y4lQ7|4qQ8W5SQ8Z5^Q8]5aQ9j=ZQ9k=UQ9l=WQ9v7xQ:O8SQ:T8XQ:U8^Q:v=_Q:w=aQ:x=cQ:y=eQ:z9rQ;P9{Q;T:RQ;g=hQ;l;SQ;x;mQ;{=iQ=q>QQ>O>YQ>P>ZQ>[>^R>]>_Q+P%]Q.p<uR7i<vnpOXst!Z#d%m&r&t&u&w,u,z2^2aQ!fPS#fZ#oQ&|!`W'i!o*j0_4|Q(Q#SQ)R#{Q)s$nS,n&k&nQ,s&oQ-Q&{S-V'T/pQ-i'cQ.z)PQ/^)tQ0u+_Q0{+iQ2Y,rQ2{-kQ3c.iQ4Y/XQ5W0nQ6S1tQ6e2UQ6f2VQ6j2XQ6l2ZQ6q2cQ7]3fQ7o4VQ8u6VQ9R6gQ9S6hQ9U6kQ9h7^Q:c8vR:m9V#[cOPXZst!Z!`!o#d#o#{%m&k&n&o&r&t&u&w&{'T'c)P*j+_+i,r,u,z-k.i/p0_0n1t2U2V2X2Z2^2a2c3f4|6V6g6h6k7^8v9VQ#YWQ#eYQ%quQ%svS%uw!gS(T#W(WQ(Z#ZQ(u#uQ(z#xQ)S$OQ)T$PQ)U$QQ)V$RQ)W$SQ)X$TQ)Y$UQ)Z$VQ)[$WQ)]$XQ)_$ZQ)a$_Q)c$aQ)h$eW)r$n)t/X4VQ+f%tQ+z&RS-['X2qQ-z'sS.P(U.RQ.U(^Q.W(eQ.u(yQ.x({Q.|<WQ/O<ZQ/P<[Q/Q<_Q/d*OQ0r+YQ2o-YQ2t-aQ3Q-sQ3X.XQ3m.vQ3r<`Q3s<aQ3t<bQ3u<cQ3v<dQ3w<eQ3x<fQ3y<gQ3z<hQ3{<iQ3|<jQ3}.}Q4O<mQ4R<pQ4S<}Q4Z<kQ5Z0tQ5e1UQ6w=PQ6}3SQ7S3YQ7c3nQ7d=QQ7m=SQ7n=[Q8m5yQ9Z6uQ9_7OQ9i=]Q9o=fQ9p=gQ:q9aQ;Y:]Q;b:oQ<Y#SR=w>TR#[WR'Z!el!tQ!r!v!y!z'a'm'n'o-g-w1q5}6PS'V!e-^U*k$|*[*pS-Z'W'`S0W*l*rQ0`*sQ2w-eQ4x0^R4}0aR(|#xQ!fQT-f'a-g]!qQ!r'a-g1q5}Q#p]R'j<XR)g$dY!uQ'a-g1q5}Q'l!rS'v!v!yS'x!z6PS-v'm'nQ-x'oR3V-wT#kZ%eS#jZ%eS%km,qU(h#h#i#lS.[(i(jQ.`(kQ0v+`Q3[.]U3].^._.aS7U3^3_R9b7Vd#^W#W#Z%h(U(_*Z+[.V/or#gZm#h#i#l%e(i(j(k+`.].^._.a3^3_7VS*^$x*cQ/v*_Q2W,qQ2m-WQ4b/rQ6s2fQ7u4cQ9Y6tT=n'X+^V#aW%h*ZU#`W%h*ZS(V#W(_U([#Z+[/oS-]'X+^T.Q(U.VV'_!e%i*[Q$lfR)y$qT)n$l)oR4X/WT*`$x*cT*i${*ZQ0y+hQ1i,XQ3a.hQ5v1kQ6R1sQ7Z3eQ8t6UQ9e7YQ:`8sQ:r9dQ;]:bQ;e:tQ;p;^R;s;fnqOXst!Z#d%m&r&t&u&w,u,z2^2aQ&l!VR,j&itmOXst!U!V!Z#d%m&i&r&t&u&w,u,z2^2aR,q&oT%lm,qR1m,ZR,i&gQ&U|S,P&V&WR1`,QR+u&PT&p!W&sT&q!W&sT2`,z2a",
  nodeNames: "⚠ ArithOp ArithOp ?. JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList in out const TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewTarget new NewExpression ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression TypeArgList CompareOp < declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty VariableDefinition Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression InstantiationExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast < ArrowFunction TypeParamList SequenceExpression InstantiationExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate asserts is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration defer ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
  maxTerm: 381,
  context: Xi,
  nodeProps: [
    ["isolate", -8, 5, 6, 14, 37, 39, 51, 53, 55, ""],
    ["group", -26, 9, 17, 19, 68, 208, 212, 216, 217, 219, 222, 225, 235, 238, 244, 246, 248, 250, 253, 259, 265, 267, 269, 271, 273, 275, 276, "Statement", -34, 13, 14, 32, 35, 36, 42, 51, 54, 55, 57, 62, 70, 72, 76, 80, 82, 84, 85, 110, 111, 121, 122, 137, 140, 142, 143, 144, 145, 146, 148, 149, 168, 170, 172, "Expression", -23, 31, 33, 37, 41, 43, 45, 174, 176, 178, 179, 181, 182, 183, 185, 186, 187, 189, 190, 191, 202, 204, 206, 207, "Type", -3, 88, 103, 109, "ClassItem"],
    ["openedBy", 23, "<", 38, "InterpolationStart", 56, "[", 60, "{", 73, "(", 161, "JSXStartCloseTag"],
    ["closedBy", -2, 24, 169, ">", 40, "InterpolationEnd", 50, "]", 61, "}", 74, ")", 166, "JSXEndTag"]
  ],
  propSources: [vi],
  skippedNodes: [0, 5, 6, 279],
  repeatNodeCount: 37,
  tokenData: "$Fq07[R!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#:O!R![#<_![!]#I_!]!^#Jk!^!_#Ku!_!`$![!`!a$$v!a!b$*T!b!c$,r!c!}Er!}#O$-|#O#P$/W#P#Q$4o#Q#R$5y#R#SEr#S#T$7W#T#o$8b#o#p$<r#p#q$=h#q#r$>x#r#s$@U#s$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$I|Er$I|$I}$Dk$I}$JO$Dk$JO$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr(n%d_$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z07[+rq$j&j(Xp([!b'}0/lOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z07[.ST(Y#S$j&j(O0/lO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c07[.n_$j&j(Xp([!b(O0/lOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)3p/x`$j&j!p),Q(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW1V`#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW2d_#w(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At3l_(W':f$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$j&j([!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$j&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$e`$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$e``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$e`$j&j([!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ([!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$e`([!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k%9[:hh$j&j(Xp([!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__WS$j&j(Xp([!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]WS$j&j([!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXWS$j&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSWSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWWS([!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]WS$j&j(XpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWWS(XpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYWS(Xp([!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S%9[C}i$j&j(p%1l(Xp([!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr%9[EoP;=`<%lCr07[FRk$j&j(Xp([!b$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$j&j(Xp([!b$^#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv07[JPP;=`<%lEr(KWJ_`$j&j(Xp([!b#q(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWKl_$j&j$R(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,#xLva({+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KWNW`$j&j#{(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'At! c_(Z';W$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$j&j(XpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$j&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$e`$j&j(XpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(XpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$e`(XpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b/5|!'t_!l/.^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&U!)O_!k!Lf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z-!n!*[b$j&j(Xp([!b(V%&f#r(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW!+o`$j&j(Xp([!b#o(ChOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;x!,|`$j&j(Xp([!br+4YOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z,$U!.Z_!]+Jf$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!/ec$j&j(Xp([!b!Q.2^OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!0ya$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#%|!2Z_![!L^$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!3eg$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!5Vg$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!6wc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad!8_c$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[!9uf$j&j(Xp([!b#p(ChOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcxz!;Zz{#-}{!P!;Z!P!Q#/d!Q!^!;Z!^!_#(i!_!`#7S!`!a#8i!a!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z?O!;fb$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z>^!<w`$j&j([!b!X7`OY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eq!Q!^!<n!^!_!Gr!_!}!<n!}#O!KS#O#P!Dy#P#o!<n#o#p!Gr#p;'S!<n;'S;=`!L]<%lO!<n<z!>Q^$j&j!X7`OY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@c!_!}!=y!}#O!CW#O#P!Dy#P#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!?Td$j&j!X7`O!^&c!_#W&c#W#X!>|#X#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#k!>|#k#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&c7`!@hX!X7`OY!@cZ!P!@c!P!Q!AT!Q!}!@c!}#O!Ar#O#P!Bq#P;'S!@c;'S;=`!CQ<%lO!@c7`!AYW!X7`#W#X!AT#Z#[!AT#]#^!AT#a#b!AT#g#h!AT#i#j!AT#j#k!AT#m#n!AT7`!AuVOY!ArZ#O!Ar#O#P!B[#P#Q!@c#Q;'S!Ar;'S;=`!Bk<%lO!Ar7`!B_SOY!ArZ;'S!Ar;'S;=`!Bk<%lO!Ar7`!BnP;=`<%l!Ar7`!BtSOY!@cZ;'S!@c;'S;=`!CQ<%lO!@c7`!CTP;=`<%l!@c<z!C][$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#O!CW#O#P!DR#P#Q!=y#Q#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DWX$j&jOY!CWYZ&cZ!^!CW!^!_!Ar!_#o!CW#o#p!Ar#p;'S!CW;'S;=`!Ds<%lO!CW<z!DvP;=`<%l!CW<z!EOX$j&jOY!=yYZ&cZ!^!=y!^!_!@c!_#o!=y#o#p!@c#p;'S!=y;'S;=`!Ek<%lO!=y<z!EnP;=`<%l!=y>^!Ezl$j&j([!b!X7`OY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#W&}#W#X!Eq#X#Z&}#Z#[!Eq#[#]&}#]#^!Eq#^#a&}#a#b!Eq#b#g&}#g#h!Eq#h#i&}#i#j!Eq#j#k!Eq#k#m&}#m#n!Eq#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}8r!GyZ([!b!X7`OY!GrZw!Grwx!@cx!P!Gr!P!Q!Hl!Q!}!Gr!}#O!JU#O#P!Bq#P;'S!Gr;'S;=`!J|<%lO!Gr8r!Hse([!b!X7`OY'}Zw'}x#O'}#P#W'}#W#X!Hl#X#Z'}#Z#[!Hl#[#]'}#]#^!Hl#^#a'}#a#b!Hl#b#g'}#g#h!Hl#h#i'}#i#j!Hl#j#k!Hl#k#m'}#m#n!Hl#n;'S'};'S;=`(f<%lO'}8r!JZX([!bOY!JUZw!JUwx!Arx#O!JU#O#P!B[#P#Q!Gr#Q;'S!JU;'S;=`!Jv<%lO!JU8r!JyP;=`<%l!JU8r!KPP;=`<%l!Gr>^!KZ^$j&j([!bOY!KSYZ&cZw!KSwx!CWx!^!KS!^!_!JU!_#O!KS#O#P!DR#P#Q!<n#Q#o!KS#o#p!JU#p;'S!KS;'S;=`!LV<%lO!KS>^!LYP;=`<%l!KS>^!L`P;=`<%l!<n=l!Ll`$j&j(Xp!X7`OY!LcYZ&cZr!Lcrs!=ys!P!Lc!P!Q!Mn!Q!^!Lc!^!_# o!_!}!Lc!}#O#%P#O#P!Dy#P#o!Lc#o#p# o#p;'S!Lc;'S;=`#&Y<%lO!Lc=l!Mwl$j&j(Xp!X7`OY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#W(r#W#X!Mn#X#Z(r#Z#[!Mn#[#](r#]#^!Mn#^#a(r#a#b!Mn#b#g(r#g#h!Mn#h#i(r#i#j!Mn#j#k!Mn#k#m(r#m#n!Mn#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r8Q# vZ(Xp!X7`OY# oZr# ors!@cs!P# o!P!Q#!i!Q!}# o!}#O#$R#O#P!Bq#P;'S# o;'S;=`#$y<%lO# o8Q#!pe(Xp!X7`OY)rZr)rs#O)r#P#W)r#W#X#!i#X#Z)r#Z#[#!i#[#])r#]#^#!i#^#a)r#a#b#!i#b#g)r#g#h#!i#h#i)r#i#j#!i#j#k#!i#k#m)r#m#n#!i#n;'S)r;'S;=`*Z<%lO)r8Q#$WX(XpOY#$RZr#$Rrs!Ars#O#$R#O#P!B[#P#Q# o#Q;'S#$R;'S;=`#$s<%lO#$R8Q#$vP;=`<%l#$R8Q#$|P;=`<%l# o=l#%W^$j&j(XpOY#%PYZ&cZr#%Prs!CWs!^#%P!^!_#$R!_#O#%P#O#P!DR#P#Q!Lc#Q#o#%P#o#p#$R#p;'S#%P;'S;=`#&S<%lO#%P=l#&VP;=`<%l#%P=l#&]P;=`<%l!Lc?O#&kn$j&j(Xp([!b!X7`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#W%Z#W#X#&`#X#Z%Z#Z#[#&`#[#]%Z#]#^#&`#^#a%Z#a#b#&`#b#g%Z#g#h#&`#h#i%Z#i#j#&`#j#k#&`#k#m%Z#m#n#&`#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z9d#(r](Xp([!b!X7`OY#(iZr#(irs!Grsw#(iwx# ox!P#(i!P!Q#)k!Q!}#(i!}#O#+`#O#P!Bq#P;'S#(i;'S;=`#,`<%lO#(i9d#)th(Xp([!b!X7`OY*gZr*grs'}sw*gwx)rx#O*g#P#W*g#W#X#)k#X#Z*g#Z#[#)k#[#]*g#]#^#)k#^#a*g#a#b#)k#b#g*g#g#h#)k#h#i*g#i#j#)k#j#k#)k#k#m*g#m#n#)k#n;'S*g;'S;=`+Z<%lO*g9d#+gZ(Xp([!bOY#+`Zr#+`rs!JUsw#+`wx#$Rx#O#+`#O#P!B[#P#Q#(i#Q;'S#+`;'S;=`#,Y<%lO#+`9d#,]P;=`<%l#+`9d#,cP;=`<%l#(i?O#,o`$j&j(Xp([!bOY#,fYZ&cZr#,frs!KSsw#,fwx#%Px!^#,f!^!_#+`!_#O#,f#O#P!DR#P#Q!;Z#Q#o#,f#o#p#+`#p;'S#,f;'S;=`#-q<%lO#,f?O#-tP;=`<%l#,f?O#-zP;=`<%l!;Z07[#.[b$j&j(Xp([!b(P0/l!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z07[#/o_$j&j(Xp([!bT0/lOY#/dYZ&cZr#/drs#0nsw#/dwx#4Ox!^#/d!^!_#5}!_#O#/d#O#P#1p#P#o#/d#o#p#5}#p;'S#/d;'S;=`#6|<%lO#/d06j#0w]$j&j([!bT0/lOY#0nYZ&cZw#0nwx#1px!^#0n!^!_#3R!_#O#0n#O#P#1p#P#o#0n#o#p#3R#p;'S#0n;'S;=`#3x<%lO#0n05W#1wX$j&jT0/lOY#1pYZ&cZ!^#1p!^!_#2d!_#o#1p#o#p#2d#p;'S#1p;'S;=`#2{<%lO#1p0/l#2iST0/lOY#2dZ;'S#2d;'S;=`#2u<%lO#2d0/l#2xP;=`<%l#2d05W#3OP;=`<%l#1p01O#3YW([!bT0/lOY#3RZw#3Rwx#2dx#O#3R#O#P#2d#P;'S#3R;'S;=`#3r<%lO#3R01O#3uP;=`<%l#3R06j#3{P;=`<%l#0n05x#4X]$j&j(XpT0/lOY#4OYZ&cZr#4Ors#1ps!^#4O!^!_#5Q!_#O#4O#O#P#1p#P#o#4O#o#p#5Q#p;'S#4O;'S;=`#5w<%lO#4O00^#5XW(XpT0/lOY#5QZr#5Qrs#2ds#O#5Q#O#P#2d#P;'S#5Q;'S;=`#5q<%lO#5Q00^#5tP;=`<%l#5Q05x#5zP;=`<%l#4O01p#6WY(Xp([!bT0/lOY#5}Zr#5}rs#3Rsw#5}wx#5Qx#O#5}#O#P#2d#P;'S#5};'S;=`#6v<%lO#5}01p#6yP;=`<%l#5}07[#7PP;=`<%l#/d)3h#7ab$j&j$R(Ch(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;ZAt#8vb$[#t$j&j(Xp([!b!X7`OY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Lcx!P!;Z!P!Q#&`!Q!^!;Z!^!_#(i!_!}!;Z!}#O#,f#O#P!Dy#P#o!;Z#o#p#(i#p;'S!;Z;'S;=`#-w<%lO!;Z'Ad#:Zp$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#U%Z#U#V#?i#V#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#d#Bq#d#l%Z#l#m#Es#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#<jk$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#<_![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#<_#S#X%Z#X#Y!4|#Y#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#>j_$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#?rd$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#A]f$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#AQ!R!S#AQ!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#AQ#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Bzc$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Dbe$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#DV!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#DV#S#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#E|g$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'Ad#Gpi$j&j(Xp([!bs'9tOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#Ge![!^%Z!^!_*g!_!c%Z!c!i#Ge!i#O%Z#O#P&c#P#R%Z#R#S#Ge#S#T%Z#T#Z#Ge#Z#b%Z#b#c#>_#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x#Il_!g$b$j&j$P)Lv(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#Jv_al$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f#LS^h#)`#R-<U(Xp([!b$o7`OY*gZr*grs'}sw*gwx)rx!P*g!P!Q#MO!Q!^*g!^!_#Mt!_!`$ f!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#MXX$l&j(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El#M}Z#s(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#Np!`#O*g#P;'S*g;'S;=`+Z<%lO*g(El#NyX$R(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g(El$ oX#t(Ch(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g*)x$!ga#`*!Y$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$#l!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(K[$#w_#l(Cl$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z*)x$%Vag!*r#t(Ch$g#|$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$&[!`!a$'f!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$&g_#t(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$'qa#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$(v!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$)R`#s(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(Kd$*`a(s(Ct$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!a%Z!a!b$+e!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$+p`$j&j#|(Ch(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`$,}_!|$Ip$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z04f$.X_!S0,v$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/]Z$j&jO!^$0O!^!_$0f!_#i$0O#i#j$0k#j#l$0O#l#m$2^#m#o$0O#o#p$0f#p;'S$0O;'S;=`$4i<%lO$0O(n$0VT_#S$j&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0kO_#S(n$0p[$j&jO!Q&c!Q![$1f![!^&c!_!c&c!c!i$1f!i#T&c#T#Z$1f#Z#o&c#o#p$3|#p;'S&c;'S;=`&w<%lO&c(n$1kZ$j&jO!Q&c!Q![$2^![!^&c!_!c&c!c!i$2^!i#T&c#T#Z$2^#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2cZ$j&jO!Q&c!Q![$3U![!^&c!_!c&c!c!i$3U!i#T&c#T#Z$3U#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3ZZ$j&jO!Q&c!Q![$0O![!^&c!_!c&c!c!i$0O!i#T&c#T#Z$0O#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$4PR!Q![$4Y!c!i$4Y#T#Z$4Y#S$4]S!Q![$4Y!c!i$4Y#T#Z$4Y#q#r$0f(n$4lP;=`<%l$0O#1[$4z_!Y#)l$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(KW$6U`#y(Ch$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z+;p$7c_$j&j(Xp([!b(b+4QOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$8qk$j&j(Xp([!b(U,2j$`#t(f$I[OY%ZYZ&cZr%Zrs&}st%Ztu$8buw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$8b![!^%Z!^!_*g!_!c%Z!c!}$8b!}#O%Z#O#P&c#P#R%Z#R#S$8b#S#T%Z#T#o$8b#o#p*g#p$g%Z$g;'S$8b;'S;=`$<l<%lO$8b+d$:qk$j&j(Xp([!b$`#tOY%ZYZ&cZr%Zrs&}st%Ztu$:fuw%Zwx(rx}%Z}!O$:f!O!Q%Z!Q![$:f![!^%Z!^!_*g!_!c%Z!c!}$:f!}#O%Z#O#P&c#P#R%Z#R#S$:f#S#T%Z#T#o$:f#o#p*g#p$g%Z$g;'S$:f;'S;=`$<f<%lO$:f+d$<iP;=`<%l$:f07[$<oP;=`<%l$8b#Jf$<{X!_#Hb(Xp([!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g,#x$=sa(z+JY$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+e#q;'S%Z;'S;=`+a<%lO%Z)>v$?V_!^(CdvBr$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z?O$@a_!q7`$j&j(Xp([!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z07[$Aq|$j&j(Xp([!b'}0/l$^#t(U,2j(f$I[OX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$A`#BZ$ISEr$IS$I_$A`$I_$JTEr$JT$JU$A`$JU$KVEr$KV$KW$A`$KW&FUEr&FU&FV$A`&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$A`?HUOEr07[$D|k$j&j(Xp([!b(O0/l$^#t(U,2j(f$I[OY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
  tokenizers: [Zi, ki, yi, _i, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, xi, new ue("$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOx~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!U~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(d~~", 141, 341), new ue("j~RQYZXz{^~^O(R~~aP!P!Qd~iO(S~~", 25, 324)],
  topRules: { Script: [0, 7], SingleExpression: [1, 277], SingleClassItem: [2, 278] },
  dialects: { jsx: 0, ts: 15179 },
  dynamicPrecedences: { 80: 1, 82: 1, 94: 1, 170: 1, 200: 1 },
  specialized: [{ term: 328, get: (O) => wi[O] || -1 }, { term: 344, get: (O) => ji[O] || -1 }, { term: 95, get: (O) => Ti[O] || -1 }],
  tokenPrec: 15205
}), lO = [
  /* @__PURE__ */ b("function ${name}(${params}) {\n	${}\n}", {
    label: "function",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ b("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ b("for (let ${name} of ${collection}) {\n	${}\n}", {
    label: "for",
    detail: "of loop",
    type: "keyword"
  }),
  /* @__PURE__ */ b("do {\n	${}\n} while (${})", {
    label: "do",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ b("while (${}) {\n	${}\n}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ b(`try {
	\${}
} catch (\${error}) {
	\${}
}`, {
    label: "try",
    detail: "/ catch block",
    type: "keyword"
  }),
  /* @__PURE__ */ b("if (${}) {\n	${}\n}", {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ b(`if (\${}) {
	\${}
} else {
	\${}
}`, {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ b(`class \${name} {
	constructor(\${params}) {
		\${}
	}
}`, {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ b('import {${names}} from "${module}"\n${}', {
    label: "import",
    detail: "named",
    type: "keyword"
  }),
  /* @__PURE__ */ b('import ${name} from "${module}"\n${}', {
    label: "import",
    detail: "default",
    type: "keyword"
  })
], Ut = /* @__PURE__ */ lO.concat([
  /* @__PURE__ */ b("interface ${name} {\n	${}\n}", {
    label: "interface",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ b("type ${name} = ${type}", {
    label: "type",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ b("enum ${name} {\n	${}\n}", {
    label: "enum",
    detail: "definition",
    type: "keyword"
  })
]), GO = /* @__PURE__ */ new pt(), Vt = /* @__PURE__ */ new Set([
  "Script",
  "Block",
  "FunctionExpression",
  "FunctionDeclaration",
  "ArrowFunction",
  "MethodDeclaration",
  "ForStatement"
]);
function K(O) {
  return (e, a) => {
    let t = e.node.getChild("VariableDefinition");
    return t && a(t, O), !0;
  };
}
const Yi = ["FunctionDeclaration"], Ri = {
  FunctionDeclaration: /* @__PURE__ */ K("function"),
  ClassDeclaration: /* @__PURE__ */ K("class"),
  ClassExpression: () => !0,
  EnumDeclaration: /* @__PURE__ */ K("constant"),
  TypeAliasDeclaration: /* @__PURE__ */ K("type"),
  NamespaceDeclaration: /* @__PURE__ */ K("namespace"),
  VariableDefinition(O, e) {
    O.matchContext(Yi) || e(O, "variable");
  },
  TypeDefinition(O, e) {
    e(O, "type");
  },
  __proto__: null
};
function Ct(O, e) {
  let a = GO.get(e);
  if (a)
    return a;
  let t = [], r = !0;
  function s(i, n) {
    let o = O.sliceString(i.from, i.to);
    t.push({ label: o, type: n });
  }
  return e.cursor(tO.IncludeAnonymous).iterate((i) => {
    if (r)
      r = !1;
    else if (i.name) {
      let n = Ri[i.name];
      if (n && n(i, s) || Vt.has(i.name))
        return !1;
    } else if (i.to - i.from > 8192) {
      for (let n of Ct(O, i.node))
        t.push(n);
      return !1;
    }
  }), GO.set(e, t), t;
}
const he = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/, cO = [
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
function Gt(O) {
  let e = q(O.state).resolveInner(O.pos, -1);
  if (cO.indexOf(e.name) > -1)
    return null;
  let a = e.name == "VariableName" || e.to - e.from < 20 && he.test(O.state.sliceDoc(e.from, e.to));
  if (!a && !O.explicit)
    return null;
  let t = [];
  for (let r = e; r; r = r.parent)
    Vt.has(r.name) && (t = t.concat(Ct(O.state.doc, r)));
  return {
    options: t,
    from: a ? e.from : O.pos,
    validFor: he
  };
}
function we(O, e, a) {
  var t;
  let r = [];
  for (; ; ) {
    let s = e.firstChild, i;
    if (s?.name == "VariableName")
      return r.push(O(s)), { path: r.reverse(), name: a };
    if (s?.name == "MemberExpression" && ((t = i = s.lastChild) === null || t === void 0 ? void 0 : t.name) == "PropertyName")
      r.push(O(i)), e = s;
    else
      return null;
  }
}
function Et(O) {
  let e = (t) => O.state.doc.sliceString(t.from, t.to), a = q(O.state).resolveInner(O.pos, -1);
  return a.name == "PropertyName" ? we(e, a.parent, e(a)) : (a.name == "." || a.name == "?.") && a.parent.name == "MemberExpression" ? we(e, a.parent, "") : cO.indexOf(a.name) > -1 ? null : a.name == "VariableName" || a.to - a.from < 20 && he.test(e(a)) ? { path: [], name: e(a) } : a.name == "MemberExpression" ? we(e, a, "") : O.explicit ? { path: [], name: "" } : null;
}
function zi(O, e) {
  let a = O, t = [], r = /* @__PURE__ */ new Set();
  for (let s = 0; ; s++) {
    for (let n of (Object.getOwnPropertyNames || Object.keys)(O)) {
      if (!/^[a-zA-Z_$\xaa-\uffdc][\w$\xaa-\uffdc]*$/.test(n) || r.has(n))
        continue;
      r.add(n);
      let o;
      try {
        o = a[n];
      } catch {
        continue;
      }
      t.push({
        label: n,
        type: typeof o == "function" ? /^[A-Z]/.test(n) ? "class" : e ? "function" : "method" : e ? "variable" : "property",
        boost: -s
      });
    }
    let i = Object.getPrototypeOf(O);
    if (!i)
      return t;
    O = i;
  }
}
function Wi(O) {
  let e = /* @__PURE__ */ new Map();
  return (a) => {
    let t = Et(a);
    if (!t)
      return null;
    let r = O;
    for (let i of t.path)
      if (r = r[i], !r)
        return null;
    let s = e.get(r);
    return s || e.set(r, s = zi(r, !t.path.length)), {
      from: a.pos - t.name.length,
      options: s,
      validFor: he
    };
  };
}
const Z = /* @__PURE__ */ R.define({
  name: "javascript",
  parser: /* @__PURE__ */ qi.configure({
    props: [
      /* @__PURE__ */ E.add({
        IfStatement: /* @__PURE__ */ C({ except: /^\s*({|else\b)/ }),
        TryStatement: /* @__PURE__ */ C({ except: /^\s*({|catch\b|finally\b)/ }),
        LabeledStatement: va,
        SwitchBody: (O) => {
          let e = O.textAfter, a = /^\s*\}/.test(e), t = /^\s*(case|default)\b/.test(e);
          return O.baseIndent + (a ? 0 : t ? 1 : 2) * O.unit;
        },
        Block: /* @__PURE__ */ Ce({ closing: "}" }),
        ArrowFunction: (O) => O.baseIndent + O.unit,
        "TemplateString BlockComment": () => null,
        "Statement Property": /* @__PURE__ */ C({ except: /^\s*{/ }),
        JSXElement(O) {
          let e = /^\s*<\//.test(O.textAfter);
          return O.lineIndent(O.node.from) + (e ? 0 : O.unit);
        },
        JSXEscape(O) {
          let e = /\s*\}/.test(O.textAfter);
          return O.lineIndent(O.node.from) + (e ? 0 : O.unit);
        },
        "JSXOpenTag JSXSelfClosingTag"(O) {
          return O.column(O.node.from) + O.unit;
        }
      }),
      /* @__PURE__ */ A.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType": Pe,
        BlockComment(O) {
          return { from: O.from + 2, to: O.to - 2 };
        },
        JSXElement(O) {
          let e = O.firstChild;
          if (!e || e.name == "JSXSelfClosingTag")
            return null;
          let a = O.lastChild;
          return { from: e.to, to: a.type.isError ? O.to : a.from };
        },
        "JSXSelfClosingTag JSXOpenTag"(O) {
          var e;
          let a = (e = O.firstChild) === null || e === void 0 ? void 0 : e.nextSibling, t = O.lastChild;
          return !a || a.type.isError ? null : { from: a.to, to: t.type.isError ? O.to : t.from };
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
}), At = {
  test: (O) => /^JSX/.test(O.name),
  facet: /* @__PURE__ */ wa({ commentTokens: { block: { open: "{/*", close: "*/}" } } })
}, dO = /* @__PURE__ */ Z.configure({ dialect: "ts" }, "typescript"), QO = /* @__PURE__ */ Z.configure({
  dialect: "jsx",
  props: [/* @__PURE__ */ ht.add((O) => O.isTop ? [At] : void 0)]
}), pO = /* @__PURE__ */ Z.configure({
  dialect: "jsx ts",
  props: [/* @__PURE__ */ ht.add((O) => O.isTop ? [At] : void 0)]
}, "typescript");
let Mt = (O) => ({ label: O, type: "keyword" });
const Lt = /* @__PURE__ */ "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield".split(" ").map(Mt), Ui = /* @__PURE__ */ Lt.concat(/* @__PURE__ */ ["declare", "implements", "private", "protected", "public"].map(Mt));
function Dt(O = {}) {
  let e = O.jsx ? O.typescript ? pO : QO : O.typescript ? dO : Z, a = O.typescript ? Ut.concat(Ui) : lO.concat(Lt);
  return new j(e, [
    Z.data.of({
      autocomplete: ut(cO, ft(a))
    }),
    Z.data.of({
      autocomplete: Gt
    }),
    O.jsx ? Nt : []
  ]);
}
function Vi(O) {
  for (; ; ) {
    if (O.name == "JSXOpenTag" || O.name == "JSXSelfClosingTag" || O.name == "JSXFragmentTag")
      return O;
    if (O.name == "JSXEscape" || !O.parent)
      return null;
    O = O.parent;
  }
}
function EO(O, e, a = O.length) {
  for (let t = e?.firstChild; t; t = t.nextSibling)
    if (t.name == "JSXIdentifier" || t.name == "JSXBuiltin" || t.name == "JSXNamespacedName" || t.name == "JSXMemberExpression")
      return O.sliceString(t.from, Math.min(t.to, a));
  return "";
}
const Ci = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Nt = /* @__PURE__ */ aO.inputHandler.of((O, e, a, t, r) => {
  if ((Ci ? O.composing : O.compositionStarted) || O.state.readOnly || e != a || t != ">" && t != "/" || !Z.isActiveAt(O.state, e, -1))
    return !1;
  let s = r(), { state: i } = s, n = i.changeByRange((o) => {
    var d;
    let { head: Q } = o, c = q(i).resolveInner(Q - 1, -1), p;
    if (c.name == "JSXStartTag" && (c = c.parent), !(i.doc.sliceString(Q - 1, Q) != t || c.name == "JSXAttributeValue" && c.to > Q)) {
      if (t == ">" && c.name == "JSXFragmentTag")
        return { range: o, changes: { from: Q, insert: "</>" } };
      if (t == "/" && c.name == "JSXStartCloseTag") {
        let u = c.parent, f = u.parent;
        if (f && u.from == Q - 2 && ((p = EO(i.doc, f.firstChild, Q)) || ((d = f.firstChild) === null || d === void 0 ? void 0 : d.name) == "JSXFragmentTag")) {
          let m = `${p}>`;
          return { range: rO.cursor(Q + m.length, -1), changes: { from: Q, insert: m } };
        }
      } else if (t == ">") {
        let u = Vi(c);
        if (u && u.name == "JSXOpenTag" && !/^\/?>|^<\//.test(i.doc.sliceString(Q, Q + 2)) && (p = EO(i.doc, u, Q)))
          return { range: o, changes: { from: Q, insert: `</${p}>` } };
      }
    }
    return { range: o };
  });
  return n.changes.empty ? !1 : (O.dispatch([
    s,
    i.update(n, { userEvent: "input.complete", scrollIntoView: !0 })
  ]), !0);
});
function Gi(O, e) {
  return e || (e = {
    parserOptions: { ecmaVersion: 2019, sourceType: "module" },
    env: { browser: !0, node: !0, es6: !0, es2015: !0, es2017: !0, es2020: !0 },
    rules: {}
  }, O.getRules().forEach((a, t) => {
    var r;
    !((r = a.meta.docs) === null || r === void 0) && r.recommended && (e.rules[t] = 2);
  })), (a) => {
    let { state: t } = a, r = [];
    for (let { from: s, to: i } of Z.findRegions(t)) {
      let n = t.doc.lineAt(s), o = { line: n.number - 1, col: s - n.from, pos: s };
      for (let d of O.verify(t.sliceDoc(s, i), e))
        r.push(Ei(d, t.doc, o));
    }
    return r;
  };
}
function AO(O, e, a, t) {
  return a.line(O + t.line).from + e + (O == 1 ? t.col - 1 : -1);
}
function Ei(O, e, a) {
  let t = AO(O.line, O.column, e, a), r = {
    from: t,
    to: O.endLine != null && O.endColumn != 1 ? AO(O.endLine, O.endColumn, e, a) : t,
    message: O.message,
    source: O.ruleId ? "eslint:" + O.ruleId : "eslint",
    severity: O.severity == 1 ? "warning" : "error"
  };
  if (O.fix) {
    let { range: s, text: i } = O.fix, n = s[0] + a.pos - t, o = s[1] + a.pos - t;
    r.actions = [{
      name: "fix",
      apply(d, Q) {
        d.dispatch({ changes: { from: Q + n, to: Q + o, insert: i }, scrollIntoView: !0 });
      }
    }];
  }
  return r;
}
const Jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  autoCloseTags: Nt,
  completionPath: Et,
  esLint: Gi,
  javascript: Dt,
  javascriptLanguage: Z,
  jsxLanguage: QO,
  localCompletionSource: Gt,
  scopeCompletionSource: Wi,
  snippets: lO,
  tsxLanguage: pO,
  typescriptLanguage: dO,
  typescriptSnippets: Ut
}, Symbol.toStringTag, { value: "Module" })), H = ["_blank", "_self", "_top", "_parent"], je = ["ascii", "utf-8", "utf-16", "latin1", "latin1"], Te = ["get", "post", "put", "delete"], qe = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"], x = ["true", "false"], h = {}, Ai = {
  a: {
    attrs: {
      href: null,
      ping: null,
      type: null,
      media: null,
      target: H,
      hreflang: null
    }
  },
  abbr: h,
  address: h,
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
  article: h,
  aside: h,
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
  b: h,
  base: { attrs: { href: null, target: H } },
  bdi: h,
  bdo: h,
  blockquote: { attrs: { cite: null } },
  body: h,
  br: h,
  button: {
    attrs: {
      form: null,
      formaction: null,
      name: null,
      value: null,
      autofocus: ["autofocus"],
      disabled: ["autofocus"],
      formenctype: qe,
      formmethod: Te,
      formnovalidate: ["novalidate"],
      formtarget: H,
      type: ["submit", "reset", "button"]
    }
  },
  canvas: { attrs: { width: null, height: null } },
  caption: h,
  center: h,
  cite: h,
  code: h,
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
  dd: h,
  del: { attrs: { cite: null, datetime: null } },
  details: { attrs: { open: ["open"] } },
  dfn: h,
  div: h,
  dl: h,
  dt: h,
  em: h,
  embed: { attrs: { src: null, type: null, width: null, height: null } },
  eventsource: { attrs: { src: null } },
  fieldset: { attrs: { disabled: ["disabled"], form: null, name: null } },
  figcaption: h,
  figure: h,
  footer: h,
  form: {
    attrs: {
      action: null,
      name: null,
      "accept-charset": je,
      autocomplete: ["on", "off"],
      enctype: qe,
      method: Te,
      novalidate: ["novalidate"],
      target: H
    }
  },
  h1: h,
  h2: h,
  h3: h,
  h4: h,
  h5: h,
  h6: h,
  head: {
    children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]
  },
  header: h,
  hgroup: h,
  hr: h,
  html: {
    attrs: { manifest: null }
  },
  i: h,
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
      formenctype: qe,
      formmethod: Te,
      formnovalidate: ["novalidate"],
      formtarget: H,
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
  kbd: h,
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
  legend: h,
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
  mark: h,
  menu: { attrs: { label: null, type: ["list", "context", "toolbar"] } },
  meta: {
    attrs: {
      content: null,
      charset: je,
      name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
      "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
    }
  },
  meter: { attrs: { value: null, min: null, low: null, high: null, max: null, optimum: null } },
  nav: h,
  noscript: h,
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
  p: h,
  param: { attrs: { name: null, value: null } },
  pre: h,
  progress: { attrs: { value: null, max: null } },
  q: { attrs: { cite: null } },
  rp: h,
  rt: h,
  ruby: h,
  samp: h,
  script: {
    attrs: {
      type: ["text/javascript"],
      src: null,
      async: ["async"],
      defer: ["defer"],
      charset: je
    }
  },
  section: h,
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
  small: h,
  source: { attrs: { src: null, type: null, media: null } },
  span: h,
  strong: h,
  style: {
    attrs: {
      type: ["text/css"],
      media: null,
      scoped: null
    }
  },
  sub: h,
  summary: h,
  sup: h,
  table: h,
  tbody: h,
  td: { attrs: { colspan: null, rowspan: null, headers: null } },
  template: h,
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
  tfoot: h,
  th: { attrs: { colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"] } },
  thead: h,
  time: { attrs: { datetime: null } },
  title: h,
  tr: h,
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
  var: h,
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
  wbr: h
}, It = {
  accesskey: null,
  class: null,
  contenteditable: x,
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
  spellcheck: x,
  autocorrect: x,
  autocapitalize: x,
  style: null,
  tabindex: null,
  title: null,
  translate: ["yes", "no"],
  rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"],
  role: /* @__PURE__ */ "alert application article banner button cell checkbox complementary contentinfo dialog document feed figure form grid gridcell heading img list listbox listitem main navigation region row rowgroup search switch tab table tabpanel textbox timer".split(" "),
  "aria-activedescendant": null,
  "aria-atomic": x,
  "aria-autocomplete": ["inline", "list", "both", "none"],
  "aria-busy": x,
  "aria-checked": ["true", "false", "mixed", "undefined"],
  "aria-controls": null,
  "aria-describedby": null,
  "aria-disabled": x,
  "aria-dropeffect": null,
  "aria-expanded": ["true", "false", "undefined"],
  "aria-flowto": null,
  "aria-grabbed": ["true", "false", "undefined"],
  "aria-haspopup": x,
  "aria-hidden": x,
  "aria-invalid": ["true", "false", "grammar", "spelling"],
  "aria-label": null,
  "aria-labelledby": null,
  "aria-level": null,
  "aria-live": ["off", "polite", "assertive"],
  "aria-multiline": x,
  "aria-multiselectable": x,
  "aria-owns": null,
  "aria-posinset": null,
  "aria-pressed": ["true", "false", "mixed", "undefined"],
  "aria-readonly": x,
  "aria-relevant": null,
  "aria-required": x,
  "aria-selected": ["true", "false", "undefined"],
  "aria-setsize": null,
  "aria-sort": ["ascending", "descending", "none", "other"],
  "aria-valuemax": null,
  "aria-valuemin": null,
  "aria-valuenow": null,
  "aria-valuetext": null
}, Bt = /* @__PURE__ */ "beforeunload copy cut dragstart dragover dragleave dragenter dragend drag paste focus blur change click load mousedown mouseenter mouseleave mouseup keydown keyup resize scroll unload".split(" ").map((O) => "on" + O);
for (let O of Bt)
  It[O] = null;
class ie {
  constructor(e, a) {
    this.tags = { ...Ai, ...e }, this.globalAttrs = { ...It, ...a }, this.allTags = Object.keys(this.tags), this.globalAttrNames = Object.keys(this.globalAttrs);
  }
}
ie.default = /* @__PURE__ */ new ie();
function G(O, e, a = O.length) {
  if (!e)
    return "";
  let t = e.firstChild, r = t && t.getChild("TagName");
  return r ? O.sliceString(r.from, Math.min(r.to, a)) : "";
}
function F(O, e = !1) {
  for (; O; O = O.parent)
    if (O.name == "Element")
      if (e)
        e = !1;
      else
        return O;
  return null;
}
function Ft(O, e, a) {
  let t = a.tags[G(O, F(e))];
  return t?.children || a.allTags;
}
function uO(O, e) {
  let a = [];
  for (let t = F(e); t && !t.type.isTop; t = F(t.parent)) {
    let r = G(O, t);
    if (r && t.lastChild.name == "CloseTag")
      break;
    r && a.indexOf(r) < 0 && (e.name == "EndTag" || e.from >= t.firstChild.to) && a.push(r);
  }
  return a;
}
const Jt = /^[:\-\.\w\u00b7-\uffff]*$/;
function MO(O, e, a, t, r) {
  let s = /\s*>/.test(O.sliceDoc(r, r + 5)) ? "" : ">", i = F(a, a.name == "StartTag" || a.name == "TagName");
  return {
    from: t,
    to: r,
    options: Ft(O.doc, i, e).map((n) => ({ label: n, type: "type" })).concat(uO(O.doc, a).map((n, o) => ({
      label: "/" + n,
      apply: "/" + n + s,
      type: "type",
      boost: 99 - o
    }))),
    validFor: /^\/?[:\-\.\w\u00b7-\uffff]*$/
  };
}
function LO(O, e, a, t) {
  let r = /\s*>/.test(O.sliceDoc(t, t + 5)) ? "" : ">";
  return {
    from: a,
    to: t,
    options: uO(O.doc, e).map((s, i) => ({ label: s, apply: s + r, type: "type", boost: 99 - i })),
    validFor: Jt
  };
}
function Mi(O, e, a, t) {
  let r = [], s = 0;
  for (let i of Ft(O.doc, a, e))
    r.push({ label: "<" + i, type: "type" });
  for (let i of uO(O.doc, a))
    r.push({ label: "</" + i + ">", type: "type", boost: 99 - s++ });
  return { from: t, to: t, options: r, validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/ };
}
function Li(O, e, a, t, r) {
  let s = F(a), i = s ? e.tags[G(O.doc, s)] : null, n = i && i.attrs ? Object.keys(i.attrs) : [], o = i && i.globalAttrs === !1 ? n : n.length ? n.concat(e.globalAttrNames) : e.globalAttrNames;
  return {
    from: t,
    to: r,
    options: o.map((d) => ({ label: d, type: "property" })),
    validFor: Jt
  };
}
function Di(O, e, a, t, r) {
  var s;
  let i = (s = a.parent) === null || s === void 0 ? void 0 : s.getChild("AttributeName"), n = [], o;
  if (i) {
    let d = O.sliceDoc(i.from, i.to), Q = e.globalAttrs[d];
    if (!Q) {
      let c = F(a), p = c ? e.tags[G(O.doc, c)] : null;
      Q = p?.attrs && p.attrs[d];
    }
    if (Q) {
      let c = O.sliceDoc(t, r).toLowerCase(), p = '"', u = '"';
      /^['"]/.test(c) ? (o = c[0] == '"' ? /^[^"]*$/ : /^[^']*$/, p = "", u = O.sliceDoc(r, r + 1) == c[0] ? "" : c[0], c = c.slice(1), t++) : o = /^[^\s<>='"]*$/;
      for (let f of Q)
        n.push({ label: f, apply: p + f + u, type: "constant" });
    }
  }
  return { from: t, to: r, options: n, validFor: o };
}
function Kt(O, e) {
  let { state: a, pos: t } = e, r = q(a).resolveInner(t, -1), s = r.resolve(t);
  for (let i = t, n; s == r && (n = r.childBefore(i)); ) {
    let o = n.lastChild;
    if (!o || !o.type.isError || o.from < o.to)
      break;
    s = r = n, i = o.from;
  }
  return r.name == "TagName" ? r.parent && /CloseTag$/.test(r.parent.name) ? LO(a, r, r.from, t) : MO(a, O, r, r.from, t) : r.name == "StartTag" || r.name == "IncompleteTag" ? MO(a, O, r, t, t) : r.name == "StartCloseTag" || r.name == "IncompleteCloseTag" ? LO(a, r, t, t) : r.name == "OpenTag" || r.name == "SelfClosingTag" || r.name == "AttributeName" ? Li(a, O, r, r.name == "AttributeName" ? r.from : t, t) : r.name == "Is" || r.name == "AttributeValue" || r.name == "UnquotedAttributeValue" ? Di(a, O, r, r.name == "Is" ? t : r.from, t) : e.explicit && (s.name == "Element" || s.name == "Text" || s.name == "Document") ? Mi(a, O, r, t) : null;
}
function Ni(O) {
  return Kt(ie.default, O);
}
function Ht(O) {
  let { extraTags: e, extraGlobalAttributes: a } = O, t = a || e ? new ie(e, a) : ie.default;
  return (r) => Kt(t, r);
}
const Ii = /* @__PURE__ */ Z.parser.configure({ top: "SingleExpression" }), ea = [
  {
    tag: "script",
    attrs: (O) => O.type == "text/typescript" || O.lang == "ts",
    parser: dO.parser
  },
  {
    tag: "script",
    attrs: (O) => O.type == "text/babel" || O.type == "text/jsx",
    parser: QO.parser
  },
  {
    tag: "script",
    attrs: (O) => O.type == "text/typescript-jsx",
    parser: pO.parser
  },
  {
    tag: "script",
    attrs(O) {
      return /^(importmap|speculationrules|application\/(.+\+)?json)$/i.test(O.type);
    },
    parser: Ii
  },
  {
    tag: "script",
    attrs(O) {
      return !O.type || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(O.type);
    },
    parser: Z.parser
  },
  {
    tag: "style",
    attrs(O) {
      return (!O.lang || O.lang == "css") && (!O.type || /^(text\/)?(x-)?(stylesheet|css)$/i.test(O.type));
    },
    parser: re.parser
  }
], Oa = /* @__PURE__ */ [
  {
    name: "style",
    parser: /* @__PURE__ */ re.parser.configure({ top: "Styles" })
  }
].concat(/* @__PURE__ */ Bt.map((O) => ({ name: O, parser: Z.parser }))), ta = /* @__PURE__ */ R.define({
  name: "html",
  parser: /* @__PURE__ */ br.configure({
    props: [
      /* @__PURE__ */ E.add({
        Element(O) {
          let e = /^(\s*)(<\/)?/.exec(O.textAfter);
          return O.node.to <= O.pos + e[0].length ? O.continue() : O.lineIndent(O.node.from) + (e[2] ? 0 : O.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(O) {
          return O.column(O.node.from) + O.unit;
        },
        Document(O) {
          if (O.pos + /\s*/.exec(O.textAfter)[0].length < O.node.to)
            return O.continue();
          let e = null, a;
          for (let t = O.node; ; ) {
            let r = t.lastChild;
            if (!r || r.name != "Element" || r.to != t.to)
              break;
            e = t = r;
          }
          return e && !((a = e.lastChild) && (a.name == "CloseTag" || a.name == "SelfClosingTag")) ? O.lineIndent(e.from) + O.unit : null;
        }
      }),
      /* @__PURE__ */ A.add({
        Element(O) {
          let e = O.firstChild, a = O.lastChild;
          return !e || e.name != "OpenTag" ? null : { from: e.to, to: a.name == "CloseTag" ? a.from : O.to };
        }
      }),
      /* @__PURE__ */ $t.add({
        "OpenTag CloseTag": (O) => O.getChild("TagName")
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/\w+\W$/,
    wordChars: "-_"
  }
}), Oe = /* @__PURE__ */ ta.configure({
  wrap: /* @__PURE__ */ _t(ea, Oa)
});
function Bi(O = {}) {
  let e = "", a;
  O.matchClosingTags === !1 && (e = "noMatch"), O.selfClosingTags === !0 && (e = (e ? e + " " : "") + "selfClosing"), (O.nestedLanguages && O.nestedLanguages.length || O.nestedAttributes && O.nestedAttributes.length) && (a = _t((O.nestedLanguages || []).concat(ea), (O.nestedAttributes || []).concat(Oa)));
  let t = a ? ta.configure({ wrap: a, dialect: e }) : e ? Oe.configure({ dialect: e }) : Oe;
  return new j(t, [
    Oe.data.of({ autocomplete: Ht(O) }),
    O.autoCloseTags !== !1 ? aa : [],
    Dt().support,
    zt().support
  ]);
}
const DO = /* @__PURE__ */ new Set(/* @__PURE__ */ "area base br col command embed frame hr img input keygen link meta param source track wbr menuitem".split(" "));
function Fi(O, e, a) {
  for (var t; ; ) {
    if (((t = e.lastChild) === null || t === void 0 ? void 0 : t.name) != "CloseTag")
      return !1;
    let r = e.parent;
    if (!r || G(O, r) != a)
      return !0;
    e = r;
  }
}
const aa = /* @__PURE__ */ aO.inputHandler.of((O, e, a, t, r) => {
  if (O.composing || O.state.readOnly || e != a || t != ">" && t != "/" || !Oe.isActiveAt(O.state, e, -1))
    return !1;
  let s = r(), { state: i } = s, n = i.changeByRange((o) => {
    var d;
    let Q = i.doc.sliceString(o.from - 1, o.to) == t, { head: c } = o, p = q(i).resolveInner(c, -1), u;
    if (Q && t == ">" && p.name == "EndTag") {
      let f = p.parent;
      if ((u = G(i.doc, f.parent, c)) && !DO.has(u) && !Fi(i.doc, f.parent, u)) {
        let m = c + (i.doc.sliceString(c, c + 1) === ">" ? 1 : 0), $ = `</${u}>`;
        return { range: o, changes: { from: c, to: m, insert: $ } };
      }
    } else if (Q && t == "/" && p.name == "IncompleteCloseTag") {
      let f = p.parent;
      if (p.from == c - 2 && ((d = f.lastChild) === null || d === void 0 ? void 0 : d.name) != "CloseTag" && (u = G(i.doc, f, c)) && !DO.has(u)) {
        let m = c + (i.doc.sliceString(c, c + 1) === ">" ? 1 : 0), $ = `${u}>`;
        return {
          range: rO.cursor(c + $.length, -1),
          changes: { from: c, to: m, insert: $ }
        };
      }
    }
    return { range: o };
  });
  return n.changes.empty ? !1 : (O.dispatch([
    s,
    i.update(n, {
      userEvent: "input.complete",
      scrollIntoView: !0
    })
  ]), !0);
}), Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  autoCloseTags: aa,
  html: Bi,
  htmlCompletionSource: Ni,
  htmlCompletionSourceWith: Ht,
  htmlLanguage: Oe
}, Symbol.toStringTag, { value: "Module" })), Ji = Y({
  String: l.string,
  Number: l.number,
  "True False": l.bool,
  PropertyName: l.propertyName,
  Null: l.null,
  ", :": l.separator,
  "[ ]": l.squareBracket,
  "{ }": l.brace
}), Ki = y.deserialize({
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
  propSources: [Ji],
  skippedNodes: [0],
  repeatNodeCount: 2,
  tokenData: "(|~RaXY!WYZ!W]^!Wpq!Wrs!]|}$u}!O$z!Q!R%T!R![&c![!]&t!}#O&y#P#Q'O#Y#Z'T#b#c'r#h#i(Z#o#p(r#q#r(w~!]Oe~~!`Wpq!]qr!]rs!xs#O!]#O#P!}#P;'S!];'S;=`$o<%lO!]~!}Og~~#QXrs!]!P!Q!]#O#P!]#U#V!]#Y#Z!]#b#c!]#f#g!]#h#i!]#i#j#m~#pR!Q![#y!c!i#y#T#Z#y~#|R!Q![$V!c!i$V#T#Z$V~$YR!Q![$c!c!i$c#T#Z$c~$fR!Q![!]!c!i!]#T#Z!]~$rP;=`<%l!]~$zO]~~$}Q!Q!R%T!R![&c~%YRT~!O!P%c!g!h%w#X#Y%w~%fP!Q![%i~%nRT~!Q![%i!g!h%w#X#Y%w~%zR{|&T}!O&T!Q![&Z~&WP!Q![&Z~&`PT~!Q![&Z~&hST~!O!P%c!Q![&c!g!h%w#X#Y%w~&yO[~~'OO_~~'TO^~~'WP#T#U'Z~'^P#`#a'a~'dP#g#h'g~'jP#X#Y'm~'rOR~~'uP#i#j'x~'{P#`#a(O~(RP#`#a(U~(ZOS~~(^P#f#g(a~(dP#i#j(g~(jP#X#Y(m~(rOQ~~(wOW~~(|OV~",
  tokenizers: [0],
  topRules: { JsonText: [0, 1] },
  tokenPrec: 0
}), Hi = () => (O) => {
  try {
    JSON.parse(O.state.doc.toString());
  } catch (e) {
    if (!(e instanceof SyntaxError))
      throw e;
    const a = es(e, O.state.doc);
    return [{
      from: a,
      message: e.message,
      severity: "error",
      to: a
    }];
  }
  return [];
};
function es(O, e) {
  let a;
  return (a = O.message.match(/at position (\d+)/)) ? Math.min(+a[1], e.length) : (a = O.message.match(/at line (\d+) column (\d+)/)) ? Math.min(e.line(+a[1]).from + +a[2] - 1, e.length) : 0;
}
const ra = /* @__PURE__ */ R.define({
  name: "json",
  parser: /* @__PURE__ */ Ki.configure({
    props: [
      /* @__PURE__ */ E.add({
        Object: /* @__PURE__ */ C({ except: /^\s*\}/ }),
        Array: /* @__PURE__ */ C({ except: /^\s*\]/ })
      }),
      /* @__PURE__ */ A.add({
        "Object Array": Pe
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    indentOnInput: /^\s*[\}\]]$/
  }
});
function Os() {
  return new j(ra);
}
const Hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  json: Os,
  jsonLanguage: ra,
  jsonParseLinter: Hi
}, Symbol.toStringTag, { value: "Module" })), ts = 36, NO = 1, as = 2, N = 3, Ye = 4, rs = 5, is = 6, ss = 7, ns = 8, os = 9, ls = 10, cs = 11, ds = 12, Qs = 13, ps = 14, us = 15, fs = 16, hs = 17, IO = 18, $s = 19, ia = 20, sa = 21, BO = 22, ms = 23, gs = 24;
function Le(O) {
  return O >= 65 && O <= 90 || O >= 97 && O <= 122 || O >= 48 && O <= 57;
}
function Ps(O) {
  return O >= 48 && O <= 57 || O >= 97 && O <= 102 || O >= 65 && O <= 70;
}
function W(O, e, a) {
  for (let t = !1; ; ) {
    if (O.next < 0)
      return;
    if (O.next == e && !t) {
      O.advance();
      return;
    }
    t = a && !t && O.next == 92, O.advance();
  }
}
function Ss(O, e) {
  e: for (; ; ) {
    if (O.next < 0)
      return;
    if (O.next == 36) {
      O.advance();
      for (let a = 0; a < e.length; a++) {
        if (O.next != e.charCodeAt(a))
          continue e;
        O.advance();
      }
      if (O.next == 36) {
        O.advance();
        return;
      }
    } else
      O.advance();
  }
}
function bs(O, e) {
  let a = "[{<(".indexOf(String.fromCharCode(e)), t = a < 0 ? e : "]}>)".charCodeAt(a);
  for (; ; ) {
    if (O.next < 0)
      return;
    if (O.next == t && O.peek(1) == 39) {
      O.advance(2);
      return;
    }
    O.advance();
  }
}
function De(O, e) {
  for (; !(O.next != 95 && !Le(O.next)); )
    e != null && (e += String.fromCharCode(O.next)), O.advance();
  return e;
}
function Xs(O) {
  if (O.next == 39 || O.next == 34 || O.next == 96) {
    let e = O.next;
    O.advance(), W(O, e, !1);
  } else
    De(O);
}
function FO(O, e) {
  for (; O.next == 48 || O.next == 49; )
    O.advance();
  e && O.next == e && O.advance();
}
function JO(O, e) {
  for (; ; ) {
    if (O.next == 46) {
      if (e)
        break;
      e = !0;
    } else if (O.next < 48 || O.next > 57)
      break;
    O.advance();
  }
  if (O.next == 69 || O.next == 101)
    for (O.advance(), (O.next == 43 || O.next == 45) && O.advance(); O.next >= 48 && O.next <= 57; )
      O.advance();
}
function KO(O) {
  for (; !(O.next < 0 || O.next == 10); )
    O.advance();
}
function z(O, e) {
  for (let a = 0; a < e.length; a++)
    if (e.charCodeAt(a) == O)
      return !0;
  return !1;
}
const Re = ` 	\r
`;
function na(O, e, a) {
  let t = /* @__PURE__ */ Object.create(null);
  t.true = t.false = rs, t.null = t.unknown = is;
  for (let r of O.split(" "))
    r && (t[r] = ia);
  for (let r of e.split(" "))
    r && (t[r] = sa);
  for (let r of (a || "").split(" "))
    r && (t[r] = gs);
  return t;
}
const M = "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying ", L = "absolute action add after all allocate alter and any are as asc assertion at authorization before begin between both breadth by call cascade cascaded case cast catalog check close collate collation column commit condition connect connection constraint constraints constructor continue corresponding count create cross cube current current_date current_default_transform_group current_transform_group_for_type current_path current_role current_time current_timestamp current_user cursor cycle data day deallocate declare default deferrable deferred delete depth deref desc describe descriptor deterministic diagnostics disconnect distinct do domain drop dynamic each else elseif end end-exec equals escape except exception exec execute exists exit external fetch first for foreign found from free full function general get global go goto grant group grouping handle having hold hour identity if immediate in indicator initially inner inout input insert intersect into is isolation join key language last lateral leading leave left level like limit local localtime localtimestamp locator loop map match method minute modifies module month names natural nesting new next no none not of old on only open option or order ordinality out outer output overlaps pad parameter partial path prepare preserve primary prior privileges procedure public read reads recursive redo ref references referencing relative release repeat resignal restrict result return returns revoke right role rollback rollup routine row rows savepoint schema scroll search second section select session session_user set sets signal similar size some space specific specifictype sql sqlexception sqlstate sqlwarning start state static system_user table temporary then timezone_hour timezone_minute to trailing transaction translation treat trigger under undo union unique unnest until update usage user using value values view when whenever where while with without work write year zone ", Ne = {
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
  words: /* @__PURE__ */ na(L, M)
};
function xs(O, e, a, t) {
  let r = {};
  for (let s in Ne)
    r[s] = (O.hasOwnProperty(s) ? O : Ne)[s];
  return e && (r.words = na(e, a || "", t)), r;
}
function oa(O) {
  return new P((e) => {
    var a;
    let { next: t } = e;
    if (e.advance(), z(t, Re)) {
      for (; z(e.next, Re); )
        e.advance();
      e.acceptToken(ts);
    } else if (t == 36 && O.doubleDollarQuotedStrings) {
      let r = De(e, "");
      e.next == 36 && (e.advance(), Ss(e, r), e.acceptToken(N));
    } else if (t == 39 || t == 34 && O.doubleQuotedStrings)
      W(e, t, O.backslashEscapes), e.acceptToken(N);
    else if (t == 35 && O.hashComments || t == 47 && e.next == 47 && O.slashComments)
      KO(e), e.acceptToken(NO);
    else if (t == 45 && e.next == 45 && (!O.spaceAfterDashes || e.peek(1) == 32))
      KO(e), e.acceptToken(NO);
    else if (t == 47 && e.next == 42) {
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
      e.acceptToken(as);
    } else if ((t == 101 || t == 69) && e.next == 39)
      e.advance(), W(e, 39, !0), e.acceptToken(N);
    else if ((t == 110 || t == 78) && e.next == 39 && O.charSetCasts)
      e.advance(), W(e, 39, O.backslashEscapes), e.acceptToken(N);
    else if (t == 95 && O.charSetCasts)
      for (let r = 0; ; r++) {
        if (e.next == 39 && r > 1) {
          e.advance(), W(e, 39, O.backslashEscapes), e.acceptToken(N);
          break;
        }
        if (!Le(e.next))
          break;
        e.advance();
      }
    else if (O.plsqlQuotingMechanism && (t == 113 || t == 81) && e.next == 39 && e.peek(1) > 0 && !z(e.peek(1), Re)) {
      let r = e.peek(1);
      e.advance(2), bs(e, r), e.acceptToken(N);
    } else if (z(t, O.identifierQuotes)) {
      const r = t == 91 ? 93 : t;
      W(e, r, !1), e.acceptToken($s);
    } else if (t == 40)
      e.acceptToken(ss);
    else if (t == 41)
      e.acceptToken(ns);
    else if (t == 123)
      e.acceptToken(os);
    else if (t == 125)
      e.acceptToken(ls);
    else if (t == 91)
      e.acceptToken(cs);
    else if (t == 93)
      e.acceptToken(ds);
    else if (t == 59)
      e.acceptToken(Qs);
    else if (O.unquotedBitLiterals && t == 48 && e.next == 98)
      e.advance(), FO(e), e.acceptToken(BO);
    else if ((t == 98 || t == 66) && (e.next == 39 || e.next == 34)) {
      const r = e.next;
      e.advance(), O.treatBitsAsBytes ? (W(e, r, O.backslashEscapes), e.acceptToken(ms)) : (FO(e, r), e.acceptToken(BO));
    } else if (t == 48 && (e.next == 120 || e.next == 88) || (t == 120 || t == 88) && e.next == 39) {
      let r = e.next == 39;
      for (e.advance(); Ps(e.next); )
        e.advance();
      r && e.next == 39 && e.advance(), e.acceptToken(Ye);
    } else if (t == 46 && e.next >= 48 && e.next <= 57)
      JO(e, !0), e.acceptToken(Ye);
    else if (t == 46)
      e.acceptToken(ps);
    else if (t >= 48 && t <= 57)
      JO(e, !1), e.acceptToken(Ye);
    else if (z(t, O.operatorChars)) {
      for (; z(e.next, O.operatorChars); )
        e.advance();
      e.acceptToken(us);
    } else if (z(t, O.specialVar))
      e.next == t && e.advance(), Xs(e), e.acceptToken(hs);
    else if (t == 58 || t == 44)
      e.acceptToken(fs);
    else if (Le(t)) {
      let r = De(e, String.fromCharCode(t));
      e.acceptToken(e.next == 46 || e.peek(-r.length - 1) == 46 ? IO : (a = O.words[r.toLowerCase()]) !== null && a !== void 0 ? a : IO);
    }
  });
}
const la = /* @__PURE__ */ oa(Ne), Zs = /* @__PURE__ */ y.deserialize({
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
  tokenizers: [0, la],
  topRules: { Script: [0, 25] },
  tokenPrec: 0
});
function Ie(O) {
  let e = O.cursor().moveTo(O.from, -1);
  for (; /Comment/.test(e.name); )
    e.moveTo(e.from, -1);
  return e.node;
}
function se(O, e) {
  let a = O.sliceString(e.from, e.to), t = /^([`'"\[])(.*)([`'"\]])$/.exec(a);
  return t ? t[2] : a;
}
function $e(O) {
  return O && (O.name == "Identifier" || O.name == "QuotedIdentifier");
}
function ks(O, e) {
  if (e.name == "CompositeIdentifier") {
    let a = [];
    for (let t = e.firstChild; t; t = t.nextSibling)
      $e(t) && a.push(se(O, t));
    return a;
  }
  return [se(O, e)];
}
function HO(O, e) {
  for (let a = []; ; ) {
    if (!e || e.name != ".")
      return a;
    let t = Ie(e);
    if (!$e(t))
      return a;
    a.unshift(se(O, t)), e = Ie(t);
  }
}
function ys(O, e) {
  let a = q(O).resolveInner(e, -1), t = vs(O.doc, a);
  return a.name == "Identifier" || a.name == "QuotedIdentifier" || a.name == "Keyword" ? {
    from: a.from,
    quoted: a.name == "QuotedIdentifier" ? O.doc.sliceString(a.from, a.from + 1) : null,
    parents: HO(O.doc, Ie(a)),
    aliases: t
  } : a.name == "." ? { from: e, quoted: null, parents: HO(O.doc, a), aliases: t } : { from: e, quoted: null, parents: [], empty: !0, aliases: t };
}
const _s = /* @__PURE__ */ new Set(/* @__PURE__ */ "where group having order union intersect except all distinct limit offset fetch for".split(" "));
function vs(O, e) {
  let a;
  for (let r = e; !a; r = r.parent) {
    if (!r)
      return null;
    r.name == "Statement" && (a = r);
  }
  let t = null;
  for (let r = a.firstChild, s = !1, i = null; r; r = r.nextSibling) {
    let n = r.name == "Keyword" ? O.sliceString(r.from, r.to).toLowerCase() : null, o = null;
    if (!s)
      s = n == "from";
    else if (n == "as" && i && $e(r.nextSibling))
      o = se(O, r.nextSibling);
    else {
      if (n && _s.has(n))
        break;
      i && $e(r) && (o = se(O, r));
    }
    o && (t || (t = /* @__PURE__ */ Object.create(null)), t[o] = ks(O, i)), i = /Identifier$/.test(r.name) ? r : null;
  }
  return t;
}
function ws(O, e, a) {
  return a.map((t) => ({ ...t, label: t.label[0] == O ? t.label : O + t.label + e, apply: void 0 }));
}
const js = /^\w*$/, Ts = /^[`'"\[]?\w*[`'"\]]?$/;
function et(O) {
  return O.self && typeof O.self.label == "string";
}
class fO {
  constructor(e, a) {
    this.idQuote = e, this.idCaseInsensitive = a, this.list = [], this.children = void 0;
  }
  child(e) {
    let a = this.children || (this.children = /* @__PURE__ */ Object.create(null)), t = a[e];
    return t || (e && !this.list.some((r) => r.label == e) && this.list.push(Ot(e, "type", this.idQuote, this.idCaseInsensitive)), a[e] = new fO(this.idQuote, this.idCaseInsensitive));
  }
  maybeChild(e) {
    return this.children ? this.children[e] : null;
  }
  addCompletion(e) {
    let a = this.list.findIndex((t) => t.label == e.label);
    a > -1 ? this.list[a] = e : this.list.push(e);
  }
  addCompletions(e) {
    for (let a of e)
      this.addCompletion(typeof a == "string" ? Ot(a, "property", this.idQuote, this.idCaseInsensitive) : a);
  }
  addNamespace(e) {
    Array.isArray(e) ? this.addCompletions(e) : et(e) ? this.addNamespace(e.children) : this.addNamespaceObject(e);
  }
  addNamespaceObject(e) {
    for (let a of Object.keys(e)) {
      let t = e[a], r = null, s = a.replace(/\\?\./g, (n) => n == "." ? "\0" : n).split("\0"), i = this;
      et(t) && (r = t.self, t = t.children);
      for (let n = 0; n < s.length; n++)
        r && n == s.length - 1 && i.addCompletion(r), i = i.child(s[n].replace(/\\\./g, "."));
      i.addNamespace(t);
    }
  }
}
function Ot(O, e, a, t) {
  return new RegExp("^[a-z_][a-z_\\d]*$", t ? "i" : "").test(O) ? { label: O, type: e } : { label: O, type: e, apply: a + O + ca(a) };
}
function ca(O) {
  return O === "[" ? "]" : O;
}
function qs(O, e, a, t, r, s) {
  var i;
  let n = ((i = s?.spec.identifierQuotes) === null || i === void 0 ? void 0 : i[0]) || '"', o = new fO(n, !!s?.spec.caseInsensitiveIdentifiers), d = r ? o.child(r) : null;
  return o.addNamespace(O), e && (d || o).addCompletions(e), a && o.addCompletions(a), d && o.addCompletions(d.list), t && o.addCompletions((d || o).child(t).list), (Q) => {
    let { parents: c, from: p, quoted: u, empty: f, aliases: m } = ys(Q.state, Q.pos);
    if (f && !Q.explicit)
      return null;
    m && c.length == 1 && (c = m[c[0]] || c);
    let $ = o;
    for (let S of c) {
      for (; !$.children || !$.children[S]; )
        if ($ == o && d)
          $ = d;
        else if ($ == d && t)
          $ = $.child(t);
        else
          return null;
      let _ = $.maybeChild(S);
      if (!_)
        return null;
      $ = _;
    }
    let g = $.list;
    if ($ == o && m && (g = g.concat(Object.keys(m).map((S) => ({ label: S, type: "constant" })))), u) {
      let S = u[0], _ = ca(S), D = Q.state.sliceDoc(Q.pos, Q.pos + 1) == _;
      return {
        from: p,
        to: D ? Q.pos + 1 : void 0,
        options: ws(S, _, g),
        validFor: Ts
      };
    } else
      return {
        from: p,
        options: g,
        validFor: js
      };
  };
}
function Ys(O) {
  return O == sa ? "type" : O == ia ? "keyword" : "variable";
}
function Rs(O, e, a) {
  let t = Object.keys(O).map((r) => a(e ? r.toUpperCase() : r, Ys(O[r])));
  return ut(["QuotedIdentifier", "String", "LineComment", "BlockComment", "."], ft(t));
}
let zs = /* @__PURE__ */ Zs.configure({
  props: [
    /* @__PURE__ */ E.add({
      Statement: /* @__PURE__ */ C()
    }),
    /* @__PURE__ */ A.add({
      Statement(O, e) {
        return { from: Math.min(O.from + 100, e.doc.lineAt(O.from).to), to: O.to };
      },
      BlockComment(O) {
        return { from: O.from + 2, to: O.to - 2 };
      }
    }),
    /* @__PURE__ */ Y({
      Keyword: l.keyword,
      Type: l.typeName,
      Builtin: /* @__PURE__ */ l.standard(l.name),
      Bits: l.number,
      Bytes: l.string,
      Bool: l.bool,
      Null: l.null,
      Number: l.number,
      String: l.string,
      Identifier: l.name,
      QuotedIdentifier: /* @__PURE__ */ l.special(l.string),
      SpecialVar: /* @__PURE__ */ l.special(l.name),
      LineComment: l.lineComment,
      BlockComment: l.blockComment,
      Operator: l.operator,
      "Semi Punctuation": l.punctuation,
      "( )": l.paren,
      "{ }": l.brace,
      "[ ]": l.squareBracket
    })
  ]
});
class k {
  constructor(e, a, t) {
    this.dialect = e, this.language = a, this.spec = t;
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
  configureLanguage(e, a) {
    return new k(this.dialect, this.language.configure(e, a), this.spec);
  }
  /**
  Define a new dialect.
  */
  static define(e) {
    let a = xs(e, e.keywords, e.types, e.builtin), t = R.define({
      name: "sql",
      parser: zs.configure({
        tokenizers: [{ from: la, to: oa(a) }]
      }),
      languageData: {
        commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] }
      }
    });
    return new k(a, t, e);
  }
}
function Ws(O, e) {
  return { label: O, type: e, boost: -1 };
}
function da(O, e = !1, a) {
  return Rs(O.dialect.words, e, a || Ws);
}
function Qa(O) {
  return O.schema ? qs(O.schema, O.tables, O.schemas, O.defaultTable, O.defaultSchema, O.dialect || be) : () => null;
}
function Us(O) {
  return O.schema ? (O.dialect || be).language.data.of({
    autocomplete: Qa(O)
  }) : [];
}
function Vs(O = {}) {
  let e = O.dialect || be;
  return new j(e.language, [
    Us(O),
    e.language.data.of({
      autocomplete: da(e, O.upperCaseKeywords, O.keywordCompletion)
    })
  ]);
}
const be = /* @__PURE__ */ k.define({}), Cs = /* @__PURE__ */ k.define({
  charSetCasts: !0,
  doubleDollarQuotedStrings: !0,
  operatorChars: "+-*/<>=~!@#%^&|`?",
  specialVar: "",
  keywords: L + "abort abs absent access according ada admin aggregate alias also always analyse analyze array_agg array_max_cardinality asensitive assert assignment asymmetric atomic attach attribute attributes avg backward base64 begin_frame begin_partition bernoulli bit_length blocked bom cache called cardinality catalog_name ceil ceiling chain char_length character_length character_set_catalog character_set_name character_set_schema characteristics characters checkpoint class class_origin cluster coalesce cobol collation_catalog collation_name collation_schema collect column_name columns command_function command_function_code comment comments committed concurrently condition_number configuration conflict connection_name constant constraint_catalog constraint_name constraint_schema contains content control conversion convert copy corr cost covar_pop covar_samp csv cume_dist current_catalog current_row current_schema cursor_name database datalink datatype datetime_interval_code datetime_interval_precision db debug defaults defined definer degree delimiter delimiters dense_rank depends derived detach detail dictionary disable discard dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue document dump dynamic_function dynamic_function_code element elsif empty enable encoding encrypted end_frame end_partition endexec enforced enum errcode error event every exclude excluding exclusive exp explain expression extension extract family file filter final first_value flag floor following force foreach fortran forward frame_row freeze fs functions fusion generated granted greatest groups handler header hex hierarchy hint id ignore ilike immediately immutable implementation implicit import include including increment indent index indexes info inherit inherits inline insensitive instance instantiable instead integrity intersection invoker isnull key_member key_type label lag last_value lead leakproof least length library like_regex link listen ln load location lock locked log logged lower mapping matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text min minvalue mod mode more move multiset mumps name namespace nfc nfd nfkc nfkd nil normalize normalized nothing notice notify notnull nowait nth_value ntile nullable nullif nulls number occurrences_regex octet_length octets off offset oids operator options ordering others over overlay overriding owned owner parallel parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partition pascal passing passthrough password percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding prepared print_strict_params procedural procedures program publication query quote raise range rank reassign recheck recovery refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex rename repeatable replace replica requiring reset respect restart restore result_oid returned_cardinality returned_length returned_octet_length returned_sqlstate returning reverse routine_catalog routine_name routine_schema routines row_count row_number rowtype rule scale schema_name schemas scope scope_catalog scope_name scope_schema security selective self sensitive sequence sequences serializable server server_name setof share show simple skip slice snapshot source specific_name sqlcode sqlerror sqrt stable stacked standalone statement statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time table_name tables tablesample tablespace temp template ties token top_level_count transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex trigger_catalog trigger_name trigger_schema trim trim_array truncate trusted type types uescape unbounded uncommitted unencrypted unlink unlisten unlogged unnamed untyped upper uri use_column use_variable user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema vacuum valid validate validator value_of var_pop var_samp varbinary variable_conflict variadic verbose version versioning views volatile warning whitespace width_bucket window within wrapper xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate yes",
  types: M + "bigint int8 bigserial serial8 varbit bool box bytea cidr circle precision float8 inet int4 json jsonb line lseg macaddr macaddr8 money numeric pg_lsn point polygon float4 int2 smallserial serial2 serial serial4 text timetz timestamptz tsquery tsvector txid_snapshot uuid xml"
}), pa = "accessible algorithm analyze asensitive authors auto_increment autocommit avg avg_row_length binlog btree cache catalog_name chain change changed checkpoint checksum class_origin client_statistics coalesce code collations columns comment committed completion concurrent consistent contains contributors convert database databases day_hour day_microsecond day_minute day_second delay_key_write delayed delimiter des_key_file dev_pop dev_samp deviance directory disable discard distinctrow div dual dumpfile enable enclosed ends engine engines enum errors escaped even event events every explain extended fast field fields flush force found_rows fulltext grants handler hash high_priority hosts hour_microsecond hour_minute hour_second ignore ignore_server_ids import index index_statistics infile innodb insensitive insert_method install invoker iterate keys kill linear lines list load lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modify mutex mysql_errno no_write_to_binlog offline offset one online optimize optionally outfile pack_keys parser partition partitions password phase plugin plugins prev processlist profile profiles purge query quick range read_write rebuild recover regexp relaylog remove rename reorganize repair repeatable replace require resume rlike row_format rtree schedule schema_name schemas second_microsecond security sensitive separator serializable server share show slave slow snapshot soname spatial sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result ssl starting starts std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace terminated triggers truncate uncommitted uninstall unlock upgrade use use_frm user_resources user_statistics utc_date utc_time utc_timestamp variables views warnings xa xor year_month zerofill", ua = M + "bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int1 int2 int3 int4 int8 float4 float8 varbinary varcharacter precision datetime unsigned signed", fa = "charset clear edit ego help nopager notee nowarning pager print prompt quit rehash source status system tee", Gs = /* @__PURE__ */ k.define({
  operatorChars: "*+-%<>!=&|^",
  charSetCasts: !0,
  doubleQuotedStrings: !0,
  unquotedBitLiterals: !0,
  hashComments: !0,
  spaceAfterDashes: !0,
  specialVar: "@?",
  identifierQuotes: "`",
  keywords: L + "group_concat " + pa,
  types: ua,
  builtin: fa
}), Es = /* @__PURE__ */ k.define({
  operatorChars: "*+-%<>!=&|^",
  charSetCasts: !0,
  doubleQuotedStrings: !0,
  unquotedBitLiterals: !0,
  hashComments: !0,
  spaceAfterDashes: !0,
  specialVar: "@?",
  identifierQuotes: "`",
  keywords: L + "always generated groupby_concat hard persistent shutdown soft virtual " + pa,
  types: ua,
  builtin: fa
});
let As = (
  // Aggregate https://msdn.microsoft.com/en-us/library/ms173454.aspx
  "approx_count_distinct approx_percentile_cont approx_percentile_disc avg checksum_agg count count_big grouping grouping_id max min product stdev stdevp sum var varp ai_generate_embeddings ai_generate_chunks cume_dist first_value lag last_value lead percentile_cont percentile_disc percent_rank left_shift right_shift bit_count get_bit set_bit collationproperty tertiary_weights @@datefirst @@dbts @@langid @@language @@lock_timeout @@max_connections @@max_precision @@nestlevel @@options @@remserver @@servername @@servicename @@spid @@textsize @@version cast convert parse try_cast try_convert try_parse asymkey_id asymkeyproperty certproperty cert_id crypt_gen_random decryptbyasymkey decryptbycert decryptbykey decryptbykeyautoasymkey decryptbykeyautocert decryptbypassphrase encryptbyasymkey encryptbycert encryptbykey encryptbypassphrase hashbytes is_objectsigned key_guid key_id key_name signbyasymkey signbycert symkeyproperty verifysignedbycert verifysignedbyasymkey @@cursor_rows @@fetch_status cursor_status datalength ident_current ident_incr ident_seed identity sql_variant_property @@datefirst current_timestamp current_timezone current_timezone_id date_bucket dateadd datediff datediff_big datefromparts datename datepart datetime2fromparts datetimefromparts datetimeoffsetfromparts datetrunc day eomonth getdate getutcdate isdate month smalldatetimefromparts switchoffset sysdatetime sysdatetimeoffset sysutcdatetime timefromparts todatetimeoffset year edit_distance edit_distance_similarity jaro_winkler_distance jaro_winkler_similarity edge_id_from_parts graph_id_from_edge_id graph_id_from_node_id node_id_from_parts object_id_from_edge_id object_id_from_node_id json isjson json_array json_contains json_modify json_object json_path_exists json_query json_value regexp_like regexp_replace regexp_substr regexp_instr regexp_count regexp_matches regexp_split_to_table abs acos asin atan atn2 ceiling cos cot degrees exp floor log log10 pi power radians rand round sign sin sqrt square tan choose greatest iif least @@procid app_name applock_mode applock_test assemblyproperty col_length col_name columnproperty databasepropertyex db_id db_name file_id file_idex file_name filegroup_id filegroup_name filegroupproperty fileproperty filepropertyex fulltextcatalogproperty fulltextserviceproperty index_col indexkey_property indexproperty next value for object_definition object_id object_name object_schema_name objectproperty objectpropertyex original_db_name parsename schema_id schema_name scope_identity serverproperty stats_date type_id type_name typeproperty dense_rank ntile rank row_number publishingservername certenclosed certprivatekey current_user database_principal_id has_dbaccess has_perms_by_name is_member is_rolemember is_srvrolemember loginproperty original_login permissions pwdencrypt pwdcompare session_user sessionproperty suser_id suser_name suser_sid suser_sname system_user user user_id user_name ascii char charindex concat concat_ws difference format left len lower ltrim nchar patindex quotename replace replicate reverse right rtrim soundex space str string_agg string_escape stuff substring translate trim unicode upper $partition @@error @@identity @@pack_received @@rowcount @@trancount binary_checksum checksum compress connectionproperty context_info current_request_id current_transaction_id decompress error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big session_context xact_state @@connections @@cpu_busy @@idle @@io_busy @@pack_sent @@packet_errors @@timeticks @@total_errors @@total_read @@total_write textptr textvalid columns_updated eventdata trigger_nestlevel vector_distance vectorproperty vector_search generate_series opendatasource openjson openquery openrowset openxml predict string_split coalesce nullif apply catch filter force include keep keepfixed modify optimize parameterization parameters partition recompile sequence set"
);
const Ms = /* @__PURE__ */ k.define({
  keywords: L + // Reserved Keywords https://learn.microsoft.com/en-us/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-ver17
  "add external procedure all fetch public alter file raiserror and fillfactor read any for readtext as foreign reconfigure asc freetext references authorization freetexttable replication backup from restore begin full restrict between function return break goto revert browse grant revoke bulk group right by having rollback cascade holdlock rowcount case identity rowguidcol check identity_insert rule checkpoint identitycol save close if schema clustered in securityaudit coalesce index select collate inner semantickeyphrasetable column insert semanticsimilaritydetailstable commit intersect semanticsimilaritytable compute into session_user constraint is set contains join setuser containstable key shutdown continue kill some convert left statistics create like system_user cross lineno table current load tablesample current_date merge textsize current_time national then current_timestamp nocheck to current_user nonclustered top cursor not tran database null transaction dbcc nullif trigger deallocate of truncate declare off try_convert default offsets tsequal delete on union deny open unique desc opendatasource unpivot disk openquery update distinct openrowset updatetext distributed openxml use double option user drop or values dump order varying else outer view end over waitfor errlvl percent when escape pivot where except plan while exec precision with execute primary within group exists print writetext exit proc noexpand index forceseek forcescan holdlock nolock nowait paglock readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot spatial_window_max_cells tablock tablockx updlock xlock keepidentity keepdefaults ignore_constraints ignore_triggers",
  types: M + "smalldatetime datetimeoffset datetime2 datetime bigint smallint smallmoney tinyint money real text nvarchar ntext varbinary image hierarchyid uniqueidentifier sql_variant xml",
  builtin: As,
  operatorChars: "*+-%<>!=^&|/",
  specialVar: "@",
  identifierQuotes: '"['
}), Ls = /* @__PURE__ */ k.define({
  keywords: L + "abort analyze attach autoincrement conflict database detach exclusive fail glob ignore index indexed instead isnull notnull offset plan pragma query raise regexp reindex rename replace temp vacuum virtual",
  types: M + "bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int2 int8 unsigned signed real",
  builtin: "auth backup bail changes clone databases dbinfo dump echo eqp explain fullschema headers help import imposter indexes iotrace lint load log mode nullvalue once print prompt quit restore save scanstats separator shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width",
  operatorChars: "*+-%<>!=&|/~",
  identifierQuotes: '`"',
  specialVar: "@:?$"
}), Ds = /* @__PURE__ */ k.define({
  keywords: "add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime infinity NaN",
  types: M + "ascii bigint blob counter frozen inet list map static text timeuuid tuple uuid varint",
  slashComments: !0
}), Ns = /* @__PURE__ */ k.define({
  keywords: L + "abort accept access add all alter and any arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body by case cast char_base check close cluster clusters colauth column comment commit compress connected constant constraint crash create current currval cursor data_base database dba deallocate debugoff debugon declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry exception exception_init exchange exclusive exists external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base of off offline on online only option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw rebuild record ref references refresh rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work",
  builtin: "appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define echo editfile embedded feedback flagger flush heading headsep instance linesize lno loboffset logsource longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar repfooter repheader serveroutput shiftinout show showmode spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout timing trimout trimspool ttitle underline verify version wrap",
  types: M + "ascii bfile bfilename bigserial bit blob dec long number nvarchar nvarchar2 serial smallint string text uid varchar2 xml",
  operatorChars: "*/+-%<>!=~",
  doubleQuotedStrings: !0,
  charSetCasts: !0,
  plsqlQuotingMechanism: !0
}), eo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Cassandra: Ds,
  MSSQL: Ms,
  MariaSQL: Es,
  MySQL: Gs,
  PLSQL: Ns,
  PostgreSQL: Cs,
  SQLDialect: k,
  SQLite: Ls,
  StandardSQL: be,
  keywordCompletionSource: da,
  schemaCompletionSource: Qa,
  sql: Vs
}, Symbol.toStringTag, { value: "Module" })), Be = 1, Is = 2, Bs = 3, Fs = 4, Js = 5, Ks = 36, Hs = 37, en = 38, On = 11, tn = 13;
function an(O) {
  return O == 45 || O == 46 || O == 58 || O >= 65 && O <= 90 || O == 95 || O >= 97 && O <= 122 || O >= 161;
}
function rn(O) {
  return O == 9 || O == 10 || O == 13 || O == 32;
}
let tt = null, at = null, rt = 0;
function Fe(O, e) {
  let a = O.pos + e;
  if (at == O && rt == a) return tt;
  for (; rn(O.peek(e)); ) e++;
  let t = "";
  for (; ; ) {
    let r = O.peek(e);
    if (!an(r)) break;
    t += String.fromCharCode(r), e++;
  }
  return at = O, rt = a, tt = t || null;
}
function it(O, e) {
  this.name = O, this.parent = e;
}
const sn = new Se({
  start: null,
  shift(O, e, a, t) {
    return e == Be ? new it(Fe(t, 1) || "", O) : O;
  },
  reduce(O, e) {
    return e == On && O ? O.parent : O;
  },
  reuse(O, e, a, t) {
    let r = e.type.id;
    return r == Be || r == tn ? new it(Fe(t, 1) || "", O) : O;
  },
  strict: !1
}), nn = new P((O, e) => {
  if (O.next == 60) {
    if (O.advance(), O.next == 47) {
      O.advance();
      let a = Fe(O, 0);
      if (!a) return O.acceptToken(Js);
      if (e.context && a == e.context.name) return O.acceptToken(Is);
      for (let t = e.context; t; t = t.parent) if (t.name == a) return O.acceptToken(Bs, -2);
      O.acceptToken(Fs);
    } else if (O.next != 33 && O.next != 63)
      return O.acceptToken(Be);
  }
}, { contextual: !0 });
function hO(O, e) {
  return new P((a) => {
    let t = 0, r = e.charCodeAt(0);
    e: for (; !(a.next < 0); a.advance(), t++)
      if (a.next == r) {
        for (let s = 1; s < e.length; s++)
          if (a.peek(s) != e.charCodeAt(s)) continue e;
        break;
      }
    t && a.acceptToken(O);
  });
}
const on = hO(Ks, "-->"), ln = hO(Hs, "?>"), cn = hO(en, "]]>"), dn = Y({
  Text: l.content,
  "StartTag StartCloseTag EndTag SelfCloseEndTag": l.angleBracket,
  TagName: l.tagName,
  "MismatchedCloseTag/TagName": [l.tagName, l.invalid],
  AttributeName: l.attributeName,
  AttributeValue: l.attributeValue,
  Is: l.definitionOperator,
  "EntityReference CharacterReference": l.character,
  Comment: l.blockComment,
  ProcessingInst: l.processingInstruction,
  DoctypeDecl: l.documentMeta,
  Cdata: l.special(l.string)
}), Qn = y.deserialize({
  version: 14,
  states: ",lOQOaOOOrOxO'#CfOzOpO'#CiO!tOaO'#CgOOOP'#Cg'#CgO!{OrO'#CrO#TOtO'#CsO#]OpO'#CtOOOP'#DT'#DTOOOP'#Cv'#CvQQOaOOOOOW'#Cw'#CwO#eOxO,59QOOOP,59Q,59QOOOO'#Cx'#CxO#mOpO,59TO#uO!bO,59TOOOP'#C|'#C|O$TOaO,59RO$[OpO'#CoOOOP,59R,59ROOOQ'#C}'#C}O$dOrO,59^OOOP,59^,59^OOOS'#DO'#DOO$lOtO,59_OOOP,59_,59_O$tOpO,59`O$|OpO,59`OOOP-E6t-E6tOOOW-E6u-E6uOOOP1G.l1G.lOOOO-E6v-E6vO%UO!bO1G.oO%UO!bO1G.oO%dOpO'#CkO%lO!bO'#CyO%zO!bO1G.oOOOP1G.o1G.oOOOP1G.w1G.wOOOP-E6z-E6zOOOP1G.m1G.mO&VOpO,59ZO&_OpO,59ZOOOQ-E6{-E6{OOOP1G.x1G.xOOOS-E6|-E6|OOOP1G.y1G.yO&gOpO1G.zO&gOpO1G.zOOOP1G.z1G.zO&oO!bO7+$ZO&}O!bO7+$ZOOOP7+$Z7+$ZOOOP7+$c7+$cO'YOpO,59VO'bOpO,59VO'mO!bO,59eOOOO-E6w-E6wO'{OpO1G.uO'{OpO1G.uOOOP1G.u1G.uO(TOpO7+$fOOOP7+$f7+$fO(]O!bO<<GuOOOP<<Gu<<GuOOOP<<G}<<G}O'bOpO1G.qO'bOpO1G.qO(hO#tO'#CnO(vO&jO'#CnOOOO1G.q1G.qO)UOpO7+$aOOOP7+$a7+$aOOOP<<HQ<<HQOOOPAN=aAN=aOOOPAN=iAN=iO'bOpO7+$]OOOO7+$]7+$]OOOO'#Cz'#CzO)^O#tO,59YOOOO,59Y,59YOOOO'#C{'#C{O)lO&jO,59YOOOP<<G{<<G{OOOO<<Gw<<GwOOOO-E6x-E6xOOOO1G.t1G.tOOOO-E6y-E6y",
  stateData: ")z~OPQOSVOTWOVWOWWOXWOiXOyPO!QTO!SUO~OvZOx]O~O^`Oz^O~OPQOQcOSVOTWOVWOWWOXWOyPO!QTO!SUO~ORdO~P!SOteO!PgO~OuhO!RjO~O^lOz^O~OvZOxoO~O^qOz^O~O[vO`sOdwOz^O~ORyO~P!SO^{Oz^O~OteO!P}O~OuhO!R!PO~O^!QOz^O~O[!SOz^O~O[!VO`sOd!WOz^O~Oa!YOz^O~Oz^O[mX`mXdmX~O[!VO`sOd!WO~O^!]Oz^O~O[!_Oz^O~O[!aOz^O~O[!cO`sOd!dOz^O~O[!cO`sOd!dO~Oa!eOz^O~Oz^O{!gO}!hO~Oz^O[ma`madma~O[!kOz^O~O[!lOz^O~O[!mO`sOd!nO~OW!qOX!qO{!sO|!qO~OW!tOX!tO}!sO!O!tO~O[!vOz^O~OW!qOX!qO{!yO|!qO~OW!tOX!tO}!yO!O!tO~O",
  goto: "%cxPPPPPPPPPPyyP!PP!VPP!`!jP!pyyyP!v!|#S$[$k$q$w$}%TPPPP%ZXWORYbXRORYb_t`qru!T!U!bQ!i!YS!p!e!fR!w!oQdRRybXSORYbQYORmYQ[PRn[Q_QQkVjp_krz!R!T!X!Z!^!`!f!j!oQr`QzcQ!RlQ!TqQ!XsQ!ZtQ!^{Q!`!QQ!f!YQ!j!]R!o!eQu`S!UqrU![u!U!bR!b!TQ!r!gR!x!rQ!u!hR!z!uQbRRxbQfTR|fQiUR!OiSXOYTaRb",
  nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl",
  maxTerm: 50,
  context: sn,
  nodeProps: [
    ["closedBy", 1, "SelfCloseEndTag EndTag", 13, "CloseTag MissingCloseTag"],
    ["openedBy", 12, "StartTag StartCloseTag", 19, "OpenTag", 20, "StartTag"],
    ["isolate", -6, 13, 18, 19, 21, 22, 24, ""]
  ],
  propSources: [dn],
  skippedNodes: [0],
  repeatNodeCount: 9,
  tokenData: "!)v~R!YOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs*vsv$qvw+fwx/ix}$q}!O0[!O!P$q!P!Q2z!Q![$q![!]4n!]!^$q!^!_8U!_!`!#t!`!a!$l!a!b!%d!b!c$q!c!}4n!}#P$q#P#Q!'W#Q#R$q#R#S4n#S#T$q#T#o4n#o%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U$q4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qi$zXVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qa%nVVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%gP&YTVPOv&Tw!^&T!_;'S&T;'S;=`&i<%lO&TP&lP;=`<%l&T`&tS!O`Ov&ox;'S&o;'S;=`'Q<%lO&o`'TP;=`<%l&oa'ZP;=`<%l%gX'eWVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^W(ST|WOr'}sv'}w;'S'};'S;=`(c<%lO'}W(fP;=`<%l'}X(lP;=`<%l'^h(vV|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oh)`P;=`<%l(oi)fP;=`<%l$qo)t`VP|W!O`zUOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk+PV{YVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%g~+iast,n![!]-r!c!}-r#R#S-r#T#o-r%W%o-r%p&a-r&b1p-r4U4d-r4e$IS-r$I`$Ib-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~,qQ!Q![,w#l#m-V~,zQ!Q![,w!]!^-Q~-VOX~~-YR!Q![-c!c!i-c#T#Z-c~-fS!Q![-c!]!^-Q!c!i-c#T#Z-c~-ug}!O-r!O!P-r!Q![-r![!]-r!]!^/^!c!}-r#R#S-r#T#o-r$}%O-r%W%o-r%p&a-r&b1p-r1p4U-r4U4d-r4e$IS-r$I`$Ib-r$Je$Jg-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~/cOW~~/fP;=`<%l-rk/rW}bVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^k0eZVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O1W!O!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk1aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a2S!a;'S$q;'S;=`)c<%lO$qk2_X!PQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qm3TZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a3v!a;'S$q;'S;=`)c<%lO$qm4RXdSVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo4{!P`S^QVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O4n!O!P4n!P!Q$q!Q![4n![!]4n!]!^$q!^!_(o!_!c$q!c!}4n!}#R$q#R#S4n#S#T$q#T#o4n#o$}$q$}%O4n%O%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U4n4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Je$q$Je$Jg4n$Jg$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qo8RP;=`<%l4ni8]Y|W!O`Oq(oqr8{rs&osv(owx'}x!a(o!a!b!#U!b;'S(o;'S;=`)]<%lO(oi9S_|W!O`Or(ors&osv(owx'}x}(o}!O:R!O!f(o!f!g;e!g!}(o!}#ODh#O#W(o#W#XLp#X;'S(o;'S;=`)]<%lO(oi:YX|W!O`Or(ors&osv(owx'}x}(o}!O:u!O;'S(o;'S;=`)]<%lO(oi;OV!QP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oi;lX|W!O`Or(ors&osv(owx'}x!q(o!q!r<X!r;'S(o;'S;=`)]<%lO(oi<`X|W!O`Or(ors&osv(owx'}x!e(o!e!f<{!f;'S(o;'S;=`)]<%lO(oi=SX|W!O`Or(ors&osv(owx'}x!v(o!v!w=o!w;'S(o;'S;=`)]<%lO(oi=vX|W!O`Or(ors&osv(owx'}x!{(o!{!|>c!|;'S(o;'S;=`)]<%lO(oi>jX|W!O`Or(ors&osv(owx'}x!r(o!r!s?V!s;'S(o;'S;=`)]<%lO(oi?^X|W!O`Or(ors&osv(owx'}x!g(o!g!h?y!h;'S(o;'S;=`)]<%lO(oi@QY|W!O`Or?yrs@psv?yvwA[wxBdx!`?y!`!aCr!a;'S?y;'S;=`Db<%lO?ya@uV!O`Ov@pvxA[x!`@p!`!aAy!a;'S@p;'S;=`B^<%lO@pPA_TO!`A[!`!aAn!a;'SA[;'S;=`As<%lOA[PAsOiPPAvP;=`<%lA[aBQSiP!O`Ov&ox;'S&o;'S;=`'Q<%lO&oaBaP;=`<%l@pXBiX|WOrBdrsA[svBdvwA[w!`Bd!`!aCU!a;'SBd;'S;=`Cl<%lOBdXC]TiP|WOr'}sv'}w;'S'};'S;=`(c<%lO'}XCoP;=`<%lBdiC{ViP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiDeP;=`<%l?yiDoZ|W!O`Or(ors&osv(owx'}x!e(o!e!fEb!f#V(o#V#WIr#W;'S(o;'S;=`)]<%lO(oiEiX|W!O`Or(ors&osv(owx'}x!f(o!f!gFU!g;'S(o;'S;=`)]<%lO(oiF]X|W!O`Or(ors&osv(owx'}x!c(o!c!dFx!d;'S(o;'S;=`)]<%lO(oiGPX|W!O`Or(ors&osv(owx'}x!v(o!v!wGl!w;'S(o;'S;=`)]<%lO(oiGsX|W!O`Or(ors&osv(owx'}x!c(o!c!dH`!d;'S(o;'S;=`)]<%lO(oiHgX|W!O`Or(ors&osv(owx'}x!}(o!}#OIS#O;'S(o;'S;=`)]<%lO(oiI]V|W!O`yPOr(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiIyX|W!O`Or(ors&osv(owx'}x#W(o#W#XJf#X;'S(o;'S;=`)]<%lO(oiJmX|W!O`Or(ors&osv(owx'}x#T(o#T#UKY#U;'S(o;'S;=`)]<%lO(oiKaX|W!O`Or(ors&osv(owx'}x#h(o#h#iK|#i;'S(o;'S;=`)]<%lO(oiLTX|W!O`Or(ors&osv(owx'}x#T(o#T#UH`#U;'S(o;'S;=`)]<%lO(oiLwX|W!O`Or(ors&osv(owx'}x#c(o#c#dMd#d;'S(o;'S;=`)]<%lO(oiMkX|W!O`Or(ors&osv(owx'}x#V(o#V#WNW#W;'S(o;'S;=`)]<%lO(oiN_X|W!O`Or(ors&osv(owx'}x#h(o#h#iNz#i;'S(o;'S;=`)]<%lO(oi! RX|W!O`Or(ors&osv(owx'}x#m(o#m#n! n#n;'S(o;'S;=`)]<%lO(oi! uX|W!O`Or(ors&osv(owx'}x#d(o#d#e!!b#e;'S(o;'S;=`)]<%lO(oi!!iX|W!O`Or(ors&osv(owx'}x#X(o#X#Y?y#Y;'S(o;'S;=`)]<%lO(oi!#_V!SP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(ok!$PXaQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo!$wX[UVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!%mZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!&`!a;'S$q;'S;=`)c<%lO$qk!&kX!RQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!'aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_#P$q#P#Q!(S#Q;'S$q;'S;=`)c<%lO$qk!(]ZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!)O!a;'S$q;'S;=`)c<%lO$qk!)ZXxQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$q",
  tokenizers: [nn, on, ln, cn, 0, 1, 2, 3, 4],
  topRules: { Document: [0, 6] },
  tokenPrec: 0
});
function de(O, e) {
  let a = e && e.getChild("TagName");
  return a ? O.sliceString(a.from, a.to) : "";
}
function ze(O, e) {
  let a = e && e.firstChild;
  return !a || a.name != "OpenTag" ? "" : de(O, a);
}
function pn(O, e, a) {
  let t = e && e.getChildren("Attribute").find((s) => s.from <= a && s.to >= a), r = t && t.getChild("AttributeName");
  return r ? O.sliceString(r.from, r.to) : "";
}
function We(O) {
  for (let e = O && O.parent; e; e = e.parent)
    if (e.name == "Element")
      return e;
  return null;
}
function un(O, e) {
  var a;
  let t = q(O).resolveInner(e, -1), r = null;
  for (let s = t; !r && s.parent; s = s.parent)
    (s.name == "OpenTag" || s.name == "CloseTag" || s.name == "SelfClosingTag" || s.name == "MismatchedCloseTag") && (r = s);
  if (r && (r.to > e || r.lastChild.type.isError)) {
    let s = r.parent;
    if (t.name == "TagName")
      return r.name == "CloseTag" || r.name == "MismatchedCloseTag" ? { type: "closeTag", from: t.from, context: s } : { type: "openTag", from: t.from, context: We(s) };
    if (t.name == "AttributeName")
      return { type: "attrName", from: t.from, context: r };
    if (t.name == "AttributeValue")
      return { type: "attrValue", from: t.from, context: r };
    let i = t == r || t.name == "Attribute" ? t.childBefore(e) : t;
    return i?.name == "StartTag" ? { type: "openTag", from: e, context: We(s) } : i?.name == "StartCloseTag" && i.to <= e ? { type: "closeTag", from: e, context: s } : i?.name == "Is" ? { type: "attrValue", from: e, context: r } : i ? { type: "attrName", from: e, context: r } : null;
  } else if (t.name == "StartCloseTag")
    return { type: "closeTag", from: e, context: t.parent };
  for (; t.parent && t.to == e && !(!((a = t.lastChild) === null || a === void 0) && a.type.isError); )
    t = t.parent;
  return t.name == "Element" || t.name == "Text" || t.name == "Document" ? { type: "tag", from: e, context: t.name == "Element" ? t : We(t) } : null;
}
class fn {
  constructor(e, a, t) {
    this.attrs = a, this.attrValues = t, this.children = [], this.name = e.name, this.completion = Object.assign(Object.assign({ type: "type" }, e.completion || {}), { label: this.name }), this.openCompletion = Object.assign(Object.assign({}, this.completion), { label: "<" + this.name }), this.closeCompletion = Object.assign(Object.assign({}, this.completion), { label: "</" + this.name + ">", boost: 2 }), this.closeNameCompletion = Object.assign(Object.assign({}, this.completion), { label: this.name + ">" }), this.text = e.textContent ? e.textContent.map((r) => ({ label: r, type: "text" })) : [];
  }
}
const Ue = /^[:\-\.\w\u00b7-\uffff]*$/;
function st(O) {
  return Object.assign(Object.assign({ type: "property" }, O.completion || {}), { label: O.name });
}
function nt(O) {
  return typeof O == "string" ? { label: `"${O}"`, type: "constant" } : /^"/.test(O.label) ? O : Object.assign(Object.assign({}, O), { label: `"${O.label}"` });
}
function ha(O, e) {
  let a = [], t = [], r = /* @__PURE__ */ Object.create(null);
  for (let o of e) {
    let d = st(o);
    a.push(d), o.global && t.push(d), o.values && (r[o.name] = o.values.map(nt));
  }
  let s = [], i = [], n = /* @__PURE__ */ Object.create(null);
  for (let o of O) {
    let d = t, Q = r;
    o.attributes && (d = d.concat(o.attributes.map((p) => typeof p == "string" ? a.find((u) => u.label == p) || { label: p, type: "property" } : (p.values && (Q == r && (Q = Object.create(Q)), Q[p.name] = p.values.map(nt)), st(p)))));
    let c = new fn(o, d, Q);
    n[c.name] = c, s.push(c), o.top && i.push(c);
  }
  i.length || (i = s);
  for (let o = 0; o < s.length; o++) {
    let d = O[o], Q = s[o];
    if (d.children)
      for (let c of d.children)
        n[c] && Q.children.push(n[c]);
    else
      Q.children = s;
  }
  return (o) => {
    var d;
    let { doc: Q } = o.state, c = un(o.state, o.pos);
    if (!c || c.type == "tag" && !o.explicit)
      return null;
    let { type: p, from: u, context: f } = c;
    if (p == "openTag") {
      let m = i, $ = ze(Q, f);
      if ($) {
        let g = n[$];
        m = g?.children || s;
      }
      return {
        from: u,
        options: m.map((g) => g.completion),
        validFor: Ue
      };
    } else if (p == "closeTag") {
      let m = ze(Q, f);
      return m ? {
        from: u,
        to: o.pos + (Q.sliceString(o.pos, o.pos + 1) == ">" ? 1 : 0),
        options: [((d = n[m]) === null || d === void 0 ? void 0 : d.closeNameCompletion) || { label: m + ">", type: "type" }],
        validFor: Ue
      } : null;
    } else if (p == "attrName") {
      let m = n[de(Q, f)];
      return {
        from: u,
        options: m?.attrs || t,
        validFor: Ue
      };
    } else if (p == "attrValue") {
      let m = pn(Q, f, u);
      if (!m)
        return null;
      let $ = n[de(Q, f)], g = ($?.attrValues || r)[m];
      return !g || !g.length ? null : {
        from: u,
        to: o.pos + (Q.sliceString(o.pos, o.pos + 1) == '"' ? 1 : 0),
        options: g,
        validFor: /^"[^"]*"?$/
      };
    } else if (p == "tag") {
      let m = ze(Q, f), $ = n[m], g = [], S = f && f.lastChild;
      m && (!S || S.name != "CloseTag" || de(Q, S) != m) && g.push($ ? $.closeCompletion : { label: "</" + m + ">", type: "type", boost: 2 });
      let _ = g.concat(($?.children || (f ? s : i)).map((D) => D.openCompletion));
      if (f && $?.text.length) {
        let D = f.firstChild;
        D.to > o.pos - 20 && !/\S/.test(o.state.sliceDoc(D.to, o.pos)) && (_ = _.concat($.text));
      }
      return {
        from: u,
        options: _,
        validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/
      };
    } else
      return null;
  };
}
const me = /* @__PURE__ */ R.define({
  name: "xml",
  parser: /* @__PURE__ */ Qn.configure({
    props: [
      /* @__PURE__ */ E.add({
        Element(O) {
          let e = /^\s*<\//.test(O.textAfter);
          return O.lineIndent(O.node.from) + (e ? 0 : O.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(O) {
          return O.column(O.node.from) + O.unit;
        }
      }),
      /* @__PURE__ */ A.add({
        Element(O) {
          let e = O.firstChild, a = O.lastChild;
          return !e || e.name != "OpenTag" ? null : { from: e.to, to: a.name == "CloseTag" ? a.from : O.to };
        }
      }),
      /* @__PURE__ */ $t.add({
        "OpenTag CloseTag": (O) => O.getChild("TagName")
      })
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "<!--", close: "-->" } },
    indentOnInput: /^\s*<\/$/
  }
});
function hn(O = {}) {
  let e = [me.data.of({
    autocomplete: ha(O.elements || [], O.attributes || [])
  })];
  return O.autoCloseTags !== !1 && e.push($a), new j(me, e);
}
function ot(O, e, a = O.length) {
  if (!e)
    return "";
  let t = e.firstChild, r = t && t.getChild("TagName");
  return r ? O.sliceString(r.from, Math.min(r.to, a)) : "";
}
const $a = /* @__PURE__ */ aO.inputHandler.of((O, e, a, t, r) => {
  if (O.composing || O.state.readOnly || e != a || t != ">" && t != "/" || !me.isActiveAt(O.state, e, -1))
    return !1;
  let s = r(), { state: i } = s, n = i.changeByRange((o) => {
    var d, Q, c;
    let { head: p } = o, u = i.doc.sliceString(p - 1, p) == t, f = q(i).resolveInner(p, -1), m;
    if (u && t == ">" && f.name == "EndTag") {
      let $ = f.parent;
      if (((Q = (d = $.parent) === null || d === void 0 ? void 0 : d.lastChild) === null || Q === void 0 ? void 0 : Q.name) != "CloseTag" && (m = ot(i.doc, $.parent, p))) {
        let g = p + (i.doc.sliceString(p, p + 1) === ">" ? 1 : 0), S = `</${m}>`;
        return { range: o, changes: { from: p, to: g, insert: S } };
      }
    } else if (u && t == "/" && f.name == "StartCloseTag") {
      let $ = f.parent;
      if (f.from == p - 2 && ((c = $.lastChild) === null || c === void 0 ? void 0 : c.name) != "CloseTag" && (m = ot(i.doc, $, p))) {
        let g = p + (i.doc.sliceString(p, p + 1) === ">" ? 1 : 0), S = `${m}>`;
        return {
          range: rO.cursor(p + S.length, -1),
          changes: { from: p, to: g, insert: S }
        };
      }
    }
    return { range: o };
  });
  return n.changes.empty ? !1 : (O.dispatch([
    s,
    i.update(n, {
      userEvent: "input.complete",
      scrollIntoView: !0
    })
  ]), !0);
}), Oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  autoCloseTags: $a,
  completeFromSchema: ha,
  xml: hn,
  xmlLanguage: me
}, Symbol.toStringTag, { value: "Module" })), I = 63, lt = 64, $n = 1, mn = 2, ma = 3, gn = 4, ga = 5, Pn = 6, Sn = 7, Pa = 65, bn = 66, Xn = 8, xn = 9, Zn = 10, kn = 11, yn = 12, Sa = 13, _n = 19, vn = 20, wn = 29, jn = 33, Tn = 34, qn = 47, Yn = 0, $O = 1, Je = 2, ne = 3, Ke = 4;
class U {
  constructor(e, a, t) {
    this.parent = e, this.depth = a, this.type = t, this.hash = (e ? e.hash + e.hash << 8 : 0) + a + (a << 4) + t;
  }
}
U.top = new U(null, -1, Yn);
function te(O, e) {
  for (let a = 0, t = e - O.pos - 1; ; t--, a++) {
    let r = O.peek(t);
    if (T(r) || r == -1) return a;
  }
}
function He(O) {
  return O == 32 || O == 9;
}
function T(O) {
  return O == 10 || O == 13;
}
function ba(O) {
  return He(O) || T(O);
}
function V(O) {
  return O < 0 || ba(O);
}
const Rn = new Se({
  start: U.top,
  reduce(O, e) {
    return O.type == ne && (e == vn || e == Tn) ? O.parent : O;
  },
  shift(O, e, a, t) {
    if (e == ma)
      return new U(O, te(t, t.pos), $O);
    if (e == Pa || e == ga)
      return new U(O, te(t, t.pos), Je);
    if (e == I)
      return O.parent;
    if (e == _n || e == jn)
      return new U(O, 0, ne);
    if (e == Sa && O.type == Ke)
      return O.parent;
    if (e == qn) {
      let r = /[1-9]/.exec(t.read(t.pos, a.pos));
      if (r) return new U(O, O.depth + +r[0], Ke);
    }
    return O;
  },
  hash(O) {
    return O.hash;
  }
});
function J(O, e, a = 0) {
  return O.peek(a) == e && O.peek(a + 1) == e && O.peek(a + 2) == e && V(O.peek(a + 3));
}
const zn = new P((O, e) => {
  if (O.next == -1 && e.canShift(lt))
    return O.acceptToken(lt);
  let a = O.peek(-1);
  if ((T(a) || a < 0) && e.context.type != ne) {
    if (J(
      O,
      45
      /* '-' */
    ))
      if (e.canShift(I)) O.acceptToken(I);
      else return O.acceptToken($n, 3);
    if (J(
      O,
      46
      /* '.' */
    ))
      if (e.canShift(I)) O.acceptToken(I);
      else return O.acceptToken(mn, 3);
    let t = 0;
    for (; O.next == 32; )
      t++, O.advance();
    (t < e.context.depth || t == e.context.depth && e.context.type == $O && (O.next != 45 || !V(O.peek(1)))) && // Not blank
    O.next != -1 && !T(O.next) && O.next != 35 && O.acceptToken(I, -t);
  }
}, { contextual: !0 }), Wn = new P((O, e) => {
  if (e.context.type == ne) {
    O.next == 63 && (O.advance(), V(O.next) && O.acceptToken(Sn));
    return;
  }
  if (O.next == 45)
    O.advance(), V(O.next) && O.acceptToken(e.context.type == $O && e.context.depth == te(O, O.pos - 1) ? gn : ma);
  else if (O.next == 63)
    O.advance(), V(O.next) && O.acceptToken(e.context.type == Je && e.context.depth == te(O, O.pos - 1) ? Pn : ga);
  else {
    let a = O.pos;
    for (; ; )
      if (He(O.next)) {
        if (O.pos == a) return;
        O.advance();
      } else if (O.next == 33)
        Xa(O);
      else if (O.next == 38)
        eO(O);
      else if (O.next == 42) {
        eO(O);
        break;
      } else if (O.next == 39 || O.next == 34) {
        if (mO(O, !0)) break;
        return;
      } else if (O.next == 91 || O.next == 123) {
        if (!Vn(O)) return;
        break;
      } else {
        xa(O, !0, !1, 0);
        break;
      }
    for (; He(O.next); ) O.advance();
    if (O.next == 58) {
      if (O.pos == a && e.canShift(wn)) return;
      let t = O.peek(1);
      V(t) && O.acceptTokenTo(e.context.type == Je && e.context.depth == te(O, a) ? bn : Pa, a);
    }
  }
}, { contextual: !0 });
function Un(O) {
  return O > 32 && O < 127 && O != 34 && O != 37 && O != 44 && O != 60 && O != 62 && O != 92 && O != 94 && O != 96 && O != 123 && O != 124 && O != 125;
}
function ct(O) {
  return O >= 48 && O <= 57 || O >= 97 && O <= 102 || O >= 65 && O <= 70;
}
function dt(O, e) {
  return O.next == 37 ? (O.advance(), ct(O.next) && O.advance(), ct(O.next) && O.advance(), !0) : Un(O.next) || e && O.next == 44 ? (O.advance(), !0) : !1;
}
function Xa(O) {
  if (O.advance(), O.next == 60) {
    for (O.advance(); ; )
      if (!dt(O, !0)) {
        O.next == 62 && O.advance();
        break;
      }
  } else
    for (; dt(O, !1); )
      ;
}
function eO(O) {
  for (O.advance(); !V(O.next) && ge(O.next) != "f"; ) O.advance();
}
function mO(O, e) {
  let a = O.next, t = !1, r = O.pos;
  for (O.advance(); ; ) {
    let s = O.next;
    if (s < 0) break;
    if (O.advance(), s == a)
      if (s == 39)
        if (O.next == 39) O.advance();
        else break;
      else
        break;
    else if (s == 92 && a == 34)
      O.next >= 0 && O.advance();
    else if (T(s)) {
      if (e) return !1;
      t = !0;
    } else if (e && O.pos >= r + 1024)
      return !1;
  }
  return !t;
}
function Vn(O) {
  for (let e = [], a = O.pos + 1024; ; )
    if (O.next == 91 || O.next == 123)
      e.push(O.next), O.advance();
    else if (O.next == 39 || O.next == 34) {
      if (!mO(O, !0)) return !1;
    } else if (O.next == 93 || O.next == 125) {
      if (e[e.length - 1] != O.next - 2) return !1;
      if (e.pop(), O.advance(), !e.length) return !0;
    } else {
      if (O.next < 0 || O.pos > a || T(O.next))
        return !1;
      O.advance();
    }
}
const Cn = "iiisiiissisfissssssssssssisssiiissssssssssssssssssssssssssfsfssissssssssssssssssssssssssssfif";
function ge(O) {
  return O < 33 ? "u" : O > 125 ? "s" : Cn[O - 33];
}
function Ve(O, e) {
  let a = ge(O);
  return a != "u" && !(e && a == "f");
}
function xa(O, e, a, t) {
  if (ge(O.next) == "s" || (O.next == 63 || O.next == 58 || O.next == 45) && Ve(O.peek(1), a))
    O.advance();
  else
    return !1;
  let r = O.pos;
  for (; ; ) {
    let s = O.next, i = 0, n = t + 1;
    for (; ba(s); ) {
      if (T(s)) {
        if (e) return !1;
        n = 0;
      } else
        n++;
      s = O.peek(++i);
    }
    if (!(s >= 0 && (s == 58 ? Ve(O.peek(i + 1), a) : s == 35 ? O.peek(i - 1) != 32 : Ve(s, a))) || !a && n <= t || n == 0 && !a && (J(O, 45, i) || J(O, 46, i)))
      break;
    if (e && ge(s) == "f") return !1;
    for (let d = i; d >= 0; d--) O.advance();
    if (e && O.pos > r + 1024) return !1;
  }
  return !0;
}
const Gn = new P((O, e) => {
  if (O.next == 33)
    Xa(O), O.acceptToken(yn);
  else if (O.next == 38 || O.next == 42) {
    let a = O.next == 38 ? Zn : kn;
    eO(O), O.acceptToken(a);
  } else O.next == 39 || O.next == 34 ? (mO(O, !1), O.acceptToken(xn)) : xa(O, !1, e.context.type == ne, e.context.depth) && O.acceptToken(Xn);
}), En = new P((O, e) => {
  let a = e.context.type == Ke ? e.context.depth : -1, t = O.pos;
  e: for (; ; ) {
    let r = 0, s = O.next;
    for (; s == 32; ) s = O.peek(++r);
    if (!r && (J(O, 45, r) || J(O, 46, r)) || !T(s) && (a < 0 && (a = Math.max(e.context.depth + 1, r)), r < a))
      break;
    for (; ; ) {
      if (O.next < 0) break e;
      let i = T(O.next);
      if (O.advance(), i) continue e;
      t = O.pos;
    }
  }
  O.acceptTokenTo(Sa, t);
}), An = Y({
  DirectiveName: l.keyword,
  DirectiveContent: l.attributeValue,
  "DirectiveEnd DocEnd": l.meta,
  QuotedLiteral: l.string,
  BlockLiteralHeader: l.special(l.string),
  BlockLiteralContent: l.content,
  Literal: l.content,
  "Key/Literal Key/QuotedLiteral": l.definition(l.propertyName),
  "Anchor Alias": l.labelName,
  Tag: l.typeName,
  Comment: l.lineComment,
  ": , -": l.separator,
  "?": l.punctuation,
  "[ ]": l.squareBracket,
  "{ }": l.brace
}), Mn = y.deserialize({
  version: 14,
  states: "5lQ!ZQgOOO#PQfO'#CpO#uQfO'#DOOOQR'#Dv'#DvO$qQgO'#DRO%gQdO'#DUO%nQgO'#DUO&ROaO'#D[OOQR'#Du'#DuO&{QgO'#D^O'rQgO'#D`OOQR'#Dt'#DtO(iOqO'#DbOOQP'#Dj'#DjO(zQaO'#CmO)YQgO'#CmOOQP'#Cm'#CmQ)jQaOOQ)uQgOOQ]QgOOO*PQdO'#CrO*nQdO'#CtOOQO'#Dw'#DwO+]Q`O'#CxO+hQdO'#CwO+rQ`O'#CwOOQO'#Cv'#CvO+wQdO'#CvOOQO'#Cq'#CqO,UQ`O,59[O,^QfO,59[OOQR,59[,59[OOQO'#Cx'#CxO,eQ`O'#DPO,pQdO'#DPOOQO'#Dx'#DxO,zQdO'#DxO-XQ`O,59jO-aQfO,59jOOQR,59j,59jOOQR'#DS'#DSO-hQcO,59mO-sQgO'#DVO.TQ`O'#DVO.YQcO,59pOOQR'#DX'#DXO#|QfO'#DWO.hQcO'#DWOOQR,59v,59vO.yOWO,59vO/OOaO,59vO/WOaO,59vO/cQgO'#D_OOQR,59x,59xO0VQgO'#DaOOQR,59z,59zOOQP,59|,59|O0yOaO,59|O1ROaO,59|O1aOqO,59|OOQP-E7h-E7hO1oQgO,59XOOQP,59X,59XO2PQaO'#DeO2_QgO'#DeO2oQgO'#DkOOQP'#Dk'#DkQ)jQaOOO3PQdO'#CsOOQO,59^,59^O3kQdO'#CuOOQO,59`,59`OOQO,59c,59cO4VQdO,59cO4aQdO'#CzO4kQ`O'#CzOOQO,59b,59bOOQU,5:Q,5:QOOQR1G.v1G.vO4pQ`O1G.vOOQU-E7d-E7dO4xQdO,59kOOQO,59k,59kO5SQdO'#DQO5^Q`O'#DQOOQO,5:d,5:dOOQU,5:R,5:ROOQR1G/U1G/UO5cQ`O1G/UOOQU-E7e-E7eO5kQgO'#DhO5xQcO1G/XOOQR1G/X1G/XOOQR,59q,59qO6TQgO,59qO6eQdO'#DiO6lQgO'#DiO7PQcO1G/[OOQR1G/[1G/[OOQR,59r,59rO#|QfO,59rOOQR1G/b1G/bO7_OWO1G/bO7dOaO1G/bOOQR,59y,59yOOQR,59{,59{OOQP1G/h1G/hO7lOaO1G/hO7tOaO1G/hO8POaO1G/hOOQP1G.s1G.sO8_QgO,5:POOQP,5:P,5:POOQP,5:V,5:VOOQP-E7i-E7iOOQO,59_,59_OOQO,59a,59aOOQO1G.}1G.}OOQO,59f,59fO8oQdO,59fOOQR7+$b7+$bP,XQ`O'#DfOOQO1G/V1G/VOOQO,59l,59lO8yQdO,59lOOQR7+$p7+$pP9TQ`O'#DgOOQR'#DT'#DTOOQR,5:S,5:SOOQR-E7f-E7fOOQR7+$s7+$sOOQR1G/]1G/]O9YQgO'#DYO9jQ`O'#DYOOQR,5:T,5:TO#|QfO'#DZO9oQcO'#DZOOQR-E7g-E7gOOQR7+$v7+$vOOQR1G/^1G/^OOQR7+$|7+$|O:QOWO7+$|OOQP7+%S7+%SO:VOaO7+%SO:_OaO7+%SOOQP1G/k1G/kOOQO1G/Q1G/QOOQO1G/W1G/WOOQR,59t,59tO:jQgO,59tOOQR,59u,59uO#|QfO,59uOOQR<<Hh<<HhOOQP<<Hn<<HnO:zOaO<<HnOOQR1G/`1G/`OOQR1G/a1G/aOOQPAN>YAN>Y",
  stateData: ";S~O!fOS!gOS^OS~OP_OQbORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!V[O!cTO~O`cO~P]OVkOWROXROYeOZfO[dOcPOmhOqQO~OboO~P!bOVtOWROXROYeOZfO[dOcPOmrOqQO~OpwO~P#WORSOTUOWROXROYYOZZO[XOcPOqQO!PVO!cTO~OSvP!avP!bvP~P#|OWROXROYeOZfO[dOcPOqQO~OmzO~P%OOm!OOUzP!azP!bzP!dzP~P#|O^!SO!b!QO!f!TO!g!RO~ORSOTUOWROXROcPOqQO!PVO!cTO~OY!UOP!QXQ!QX!V!QX!`!QXS!QX!a!QX!b!QXU!QXm!QX!d!QX~P&aO[!WOP!SXQ!SX!V!SX!`!SXS!SX!a!SX!b!SXU!SXm!SX!d!SX~P&aO^!ZO!W![O!b!YO!f!]O!g!YO~OP!_O!V[OQaX!`aX~OPaXQaX!VaX!`aX~P#|OP!bOQ!cO!V[O~OP_O!V[O~P#|OWROXROY!fOcPOqQObfXmfXofXpfX~OWROXRO[!hOcPOqQObhXmhXohXphX~ObeXmlXoeX~ObkXokX~P%OOm!kO~Om!lObnPonP~P%OOb!pOo!oO~Ob!pO~P!bOm!sOosXpsX~OosXpsX~P%OOm!uOotPptP~P%OOo!xOp!yO~Op!yO~P#WOS!|O!a#OO!b#OO~OUyX!ayX!byX!dyX~P#|Om#QO~OU#SO!a#UO!b#UO!d#RO~Om#WOUzX!azX!bzX!dzX~O]#XO~O!b#XO!g#YO~O^#ZO!b#XO!g#YO~OP!RXQ!RX!V!RX!`!RXS!RX!a!RX!b!RXU!RXm!RX!d!RX~P&aOP!TXQ!TX!V!TX!`!TXS!TX!a!TX!b!TXU!TXm!TX!d!TX~P&aO!b#^O!g#^O~O^#_O!b#^O!f#`O!g#^O~O^#_O!W#aO!b#^O!g#^O~OPaaQaa!Vaa!`aa~P#|OP#cO!V[OQ!XX!`!XX~OP!XXQ!XX!V!XX!`!XX~P#|OP_O!V[OQ!_X!`!_X~P#|OWROXROcPOqQObgXmgXogXpgX~OWROXROcPOqQObiXmiXoiXpiX~Obkaoka~P%OObnXonX~P%OOm#kO~Ob#lOo!oO~Oosapsa~P%OOotXptX~P%OOm#pO~Oo!xOp#qO~OSwP!awP!bwP~P#|OS!|O!a#vO!b#vO~OUya!aya!bya!dya~P#|Om#xO~P%OOm#{OU}P!a}P!b}P!d}P~P#|OU#SO!a$OO!b$OO!d#RO~O]$QO~O!b$QO!g$RO~O!b$SO!g$SO~O^$TO!b$SO!g$SO~O^$TO!b$SO!f$UO!g$SO~OP!XaQ!Xa!V!Xa!`!Xa~P#|Obnaona~P%OOotapta~P%OOo!xO~OU|X!a|X!b|X!d|X~P#|Om$ZO~Om$]OU}X!a}X!b}X!d}X~O]$^O~O!b$_O!g$_O~O^$`O!b$_O!g$_O~OU|a!a|a!b|a!d|a~P#|O!b$cO!g$cO~O",
  goto: ",]!mPPPPPPPPPPPPPPPPP!nPP!v#v#|$`#|$c$f$j$nP%VPPP!v%Y%^%a%{&O%a&R&U&X&_&b%aP&e&{&e'O'RPP']'a'g'm's'y(XPPPPPPPP(_)e*X+c,VUaObcR#e!c!{ROPQSTUXY_bcdehknrtvz!O!U!W!_!b!c!f!h!k!l!s!u!|#Q#R#S#W#c#k#p#x#{$Z$]QmPR!qnqfPQThknrtv!k!l!s!u#R#k#pR!gdR!ieTlPnTjPnSiPnSqQvQ{TQ!mkQ!trQ!vtR#y#RR!nkTsQvR!wt!RWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]RySR#t!|R|TR|UQ!PUR#|#SR#z#RR#z#SyZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]R!VXR!XYa]O^abc!a!c!eT!da!eQnPR!rnQvQR!{vQ!}yR#u!}Q#T|R#}#TW^Obc!cS!^^!aT!aa!eQ!eaR#f!eW`Obc!cQxSS}U#SQ!`_Q#PzQ#V!OQ#b!_Q#d!bQ#s!|Q#w#QQ$P#WQ$V#cQ$Y#xQ$[#{Q$a$ZR$b$]xZOSU_bcz!O!_!b!c!|#Q#S#W#c#x#{$Z$]Q!VXQ!XYQ#[!UR#]!W!QWOSUXY_bcz!O!U!W!_!b!c!|#Q#S#W#c#x#{$Z$]pfPQThknrtv!k!l!s!u#R#k#pQ!gdQ!ieQ#g!fR#h!hSgPn^pQTkrtv#RQ!jhQ#i!kQ#j!lQ#n!sQ#o!uQ$W#kR$X#pQuQR!zv",
  nodeNames: "⚠ DirectiveEnd DocEnd - - ? ? ? Literal QuotedLiteral Anchor Alias Tag BlockLiteralContent Comment Stream BOM Document ] [ FlowSequence Item Tagged Anchored Anchored Tagged FlowMapping Pair Key : Pair , } { FlowMapping Pair Pair BlockSequence Item Item BlockMapping Pair Pair Key Pair Pair BlockLiteral BlockLiteralHeader Tagged Anchored Anchored Tagged Directive DirectiveName DirectiveContent Document",
  maxTerm: 74,
  context: Rn,
  nodeProps: [
    ["isolate", -3, 8, 9, 14, ""],
    ["openedBy", 18, "[", 32, "{"],
    ["closedBy", 19, "]", 33, "}"]
  ],
  propSources: [An],
  skippedNodes: [0],
  repeatNodeCount: 6,
  tokenData: "-Y~RnOX#PXY$QYZ$]Z]#P]^$]^p#Ppq$Qqs#Pst$btu#Puv$yv|#P|}&e}![#P![!]'O!]!`#P!`!a'i!a!}#P!}#O*g#O#P#P#P#Q+Q#Q#o#P#o#p+k#p#q'i#q#r,U#r;'S#P;'S;=`#z<%l?HT#P?HT?HU,o?HUO#PQ#UU!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PQ#kTOY#PZs#Pt;'S#P;'S;=`#z<%lO#PQ#}P;=`<%l#P~$VQ!f~XY$Qpq$Q~$bO!g~~$gS^~OY$bZ;'S$b;'S;=`$s<%lO$b~$vP;=`<%l$bR%OX!WQOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR%rX!WQ!VPOX%kXY#PZ]%k]^#P^p%kpq#hq;'S%k;'S;=`&_<%lO%kR&bP;=`<%l%kR&lUoP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'VUmP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR'p[!PP!WQOY#PZp#Ppq#hq{#P{|(f|}#P}!O(f!O!R#P!R![)p![;'S#P;'S;=`#z<%lO#PR(mW!PP!WQOY#PZp#Ppq#hq!R#P!R![)V![;'S#P;'S;=`#z<%lO#PR)^U!PP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR)wY!PP!WQOY#PZp#Ppq#hq{#P{|)V|}#P}!O)V!O;'S#P;'S;=`#z<%lO#PR*nUcP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+XUbP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR+rUqP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,]UpP!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#PR,vU`P!WQOY#PZp#Ppq#hq;'S#P;'S;=`#z<%lO#P",
  tokenizers: [zn, Wn, Gn, En, 0, 1],
  topRules: { Stream: [0, 15] },
  tokenPrec: 0
}), Ln = /* @__PURE__ */ y.deserialize({
  version: 14,
  states: "!vOQOPOOO]OPO'#C_OhOPO'#C^OOOO'#Cc'#CcOpOPO'#CaQOOOOOO{OPOOOOOO'#Cb'#CbO!WOPO'#C`O!`OPO,58xOOOO-E6a-E6aOOOO-E6`-E6`OOOO'#C_'#C_OOOO1G.d1G.d",
  stateData: "!h~OXPOYROWTP~OWVXXRXYRX~OYVOXSP~OXROYROWTX~OXROYROWTP~OYVOXSX~OX[O~OXY~",
  goto: "vWPPX[beioRUOQQOR]XRXQTTOUQWQRZWSSOURYS",
  nodeNames: "⚠ Document Frontmatter DashLine FrontmatterContent Body",
  maxTerm: 10,
  skippedNodes: [0],
  repeatNodeCount: 2,
  tokenData: "$z~RXOYnYZ!^Z]n]^!^^}n}!O!i!O;'Sn;'S;=`!c<%lOn~qXOYnYZ!^Z]n]^!^^;'Sn;'S;=`!c<%l~n~On~~!^~!cOY~~!fP;=`<%ln~!lZOYnYZ!^Z]n]^!^^}n}!O#_!O;'Sn;'S;=`!c<%l~n~On~~!^~#bZOYnYZ!^Z]n]^!^^}n}!O$T!O;'Sn;'S;=`!c<%l~n~On~~!^~$WXOYnYZ$sZ]n]^$s^;'Sn;'S;=`!c<%l~n~On~~$s~$zOX~Y~",
  tokenizers: [0],
  topRules: { Document: [0, 1] },
  tokenPrec: 67
}), gO = /* @__PURE__ */ R.define({
  name: "yaml",
  parser: /* @__PURE__ */ Mn.configure({
    props: [
      /* @__PURE__ */ E.add({
        Stream: (O) => {
          for (let e = O.node.resolve(O.pos, -1); e && e.to >= O.pos; e = e.parent) {
            if (e.name == "BlockLiteralContent" && e.from < e.to)
              return O.baseIndentFor(e);
            if (e.name == "BlockLiteral")
              return O.baseIndentFor(e) + O.unit;
            if (e.name == "BlockSequence" || e.name == "BlockMapping")
              return O.column(e.firstChild.from, 1);
            if (e.name == "QuotedLiteral")
              return null;
            if (e.name == "Literal") {
              let a = O.column(e.from, 1);
              if (a == O.lineIndent(e.from, 1))
                return a;
              if (e.to > O.pos)
                return null;
            }
          }
          return null;
        },
        FlowMapping: /* @__PURE__ */ Ce({ closing: "}" }),
        FlowSequence: /* @__PURE__ */ Ce({ closing: "]" })
      }),
      /* @__PURE__ */ A.add({
        "FlowMapping FlowSequence": Pe,
        "Item Pair BlockLiteral": (O, e) => ({ from: e.doc.lineAt(O.from).to, to: O.to })
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "#" },
    indentOnInput: /^\s*[\]\}]$/
  }
});
function Dn() {
  return new j(gO);
}
const Nn = /* @__PURE__ */ R.define({
  name: "yaml-frontmatter",
  parser: /* @__PURE__ */ Ln.configure({
    props: [/* @__PURE__ */ Y({ DashLine: l.meta })]
  })
});
function In(O) {
  let { language: e, support: a } = O.content instanceof j ? O.content : { language: O.content, support: [] };
  return new j(Nn.configure({
    wrap: Qt((t) => t.name == "FrontmatterContent" ? { parser: gO.parser } : t.name == "Body" ? { parser: e.parser } : null)
  }), a);
}
const to = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  yaml: Dn,
  yamlFrontmatter: In,
  yamlLanguage: gO
}, Symbol.toStringTag, { value: "Module" }));
export {
  Jn as a,
  Kn as b,
  Hn as c,
  eo as d,
  Oo as e,
  to as f,
  Fn as i
};
