import { a as H, b as s, h as m, d as K } from "./file-kind-Cq3pESGF.js";
import { a as N, F as L, j as R } from "./space-storyboard-material-ECvLpyk_.js";
import { s as V, Q as rr, r as er, e as tr } from "./vendor-icons-BZHLe0mm.js";
function ar(r, n, t, c, o) {
  if (!n || !t || n === t)
    return r;
  const a = r.findIndex((g) => o(g) === n);
  if (a < 0)
    return r;
  const e = [...r], [T] = e.splice(a, 1), C = e.findIndex((g) => o(g) === t);
  return C < 0 ? r : (e.splice(C + (c === "after" ? 1 : 0), 0, T), e);
}
function ir(r, n, t) {
  if (!n.length)
    return r;
  const c = new Map(r.map((e) => [t(e), e])), o = [];
  for (const e of n)
    c.has(e) && o.push(c.get(e));
  const a = new Set(o.map(t));
  return [
    ...o,
    ...r.filter((e) => !a.has(t(e)))
  ];
}
function fr(r, n) {
  return r.length === n.length && r.every((t, c) => t === n[c]);
}
await window.DeverFront?.ensureCompat?.(["@/stores/auth-store"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const nr = U.useAuthStore;
function lr() {
  const r = nr((n) => n.auth?.user);
  return cr(r);
}
function cr(r) {
  if (!r || typeof r != "object" || Array.isArray(r))
    return "";
  const n = r, t = Number(n.id || 0);
  if (Number.isFinite(t) && t > 0)
    return `user:${t}`;
  const c = String(n.account || "").trim();
  return c ? `account:${c}` : "";
}
function dr({
  value: r,
  resetKey: n,
  fingerprint: t,
  save: c,
  onError: o,
  autoSave: a = !0,
  debounceMs: e = 1200
}) {
  const [T, C] = H(r), [g, d] = H("saved"), _ = s(r), x = s(r), F = s(t), j = s(c), $ = s(o), q = s(a), k = s(t(r)), p = s(0), v = s(0), h = s(null), S = s(null), E = s(async () => !1), A = s(null), l = s(!1), w = s(!0), i = m(() => {
    h.current !== null && (window.clearTimeout(h.current), h.current = null);
  }, []), f = m(
    async (u, y = !1, z) => {
      i();
      const D = v.current;
      for (; w.current && D === v.current; ) {
        if (S.current && (!await S.current || D !== v.current))
          return !1;
        if (!y && u !== void 0 && u !== p.current)
          return !0;
        const Q = x.current, B = F.current(Q);
        if (B === k.current)
          return l.current = !1, w.current && d("saved"), !0;
        const W = p.current;
        w.current && d("saving");
        const G = z || j.current, O = G(Q).then(() => {
          if (!w.current || D !== v.current)
            return !1;
          k.current = B, l.current = !1, A.current = null;
          const b = F.current(x.current);
          return d(
            b === B ? "saved" : "dirty"
          ), !0;
        }).catch((b) => (w.current && D === v.current && (i(), l.current = !0, A.current = G, d("error"), $.current?.(b)), !1));
        S.current = O;
        const Z = await O;
        if (S.current === O && (S.current = null), !Z) return !1;
        if (!y && W !== p.current && h.current === null && !l.current) {
          const b = p.current;
          h.current = window.setTimeout(() => {
            h.current = null, E.current(b);
          }, e);
        }
        if (!y || W === p.current)
          return !0;
      }
      return !1;
    },
    [i, e]
  ), P = m(
    (u) => {
      i(), !(!q.current || l.current) && (h.current = window.setTimeout(() => {
        h.current = null, f(u);
      }, e));
    },
    [i, e, f]
  ), J = m(
    (u) => {
      const y = typeof u == "function" ? u(x.current) : u, z = F.current(y);
      if (x.current = y, C(y), p.current += 1, z === k.current) {
        i(), l.current = !1, d("saved");
        return;
      }
      if (l.current) {
        d("error");
        return;
      }
      d("dirty"), P(p.current);
    },
    [i, P]
  ), I = m(() => {
    const u = _.current;
    v.current += 1, p.current = 0, x.current = u, k.current = F.current(u), l.current = !1, A.current = null, S.current = null, i(), C(u), d("saved");
  }, [i]), M = m(() => f(void 0, !0), [f]), X = m(
    (u) => f(void 0, !0, u),
    [f]
  ), Y = m(async () => (l.current = !1, f(void 0, !0, A.current || j.current)), [f]);
  return K(() => {
    _.current = r, F.current = t, j.current = c, $.current = o, q.current = a, E.current = f;
  }, [a, t, o, f, c, r]), K(() => I(), [I, n]), K(() => (w.current = !0, () => {
    w.current = !1, v.current += 1, i();
  }), [i]), {
    draft: T,
    status: g,
    setDraft: J,
    reset: I,
    flush: M,
    flushWith: X,
    retry: Y,
    hasPendingChanges: g !== "saved"
  };
}
function pr({
  status: r,
  hasPendingChanges: n,
  onReset: t,
  onSaveAsNewVersion: c,
  onSave: o
}) {
  const a = r === "saving", e = a || !n;
  return /* @__PURE__ */ N(L, { children: [
    /* @__PURE__ */ N(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: e,
        onClick: t,
        children: [
          /* @__PURE__ */ R(V, { size: 13 }),
          /* @__PURE__ */ R("span", { children: "取消修改" })
        ]
      }
    ),
    /* @__PURE__ */ N(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: e,
        onClick: c,
        children: [
          /* @__PURE__ */ R(rr, { size: 13 }),
          /* @__PURE__ */ R("span", { children: "保存为新版本" })
        ]
      }
    ),
    /* @__PURE__ */ N(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: e,
        onClick: o,
        children: [
          a ? /* @__PURE__ */ R(er, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ R(tr, { size: 13 }),
          /* @__PURE__ */ R("span", { children: a ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
export {
  pr as T,
  dr as a,
  ar as m,
  ir as o,
  fr as s,
  lr as u
};
