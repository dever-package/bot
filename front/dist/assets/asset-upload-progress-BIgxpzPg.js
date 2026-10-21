await window.DeverFront?.ensureCompat?.(["@/stores/auth-store"]);
const h = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const w = h.useAuthStore;
function y() {
  const e = w((o) => o.auth?.user);
  return b(e);
}
function b(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const o = e, r = Number(o.id || 0);
  if (Number.isFinite(r) && r > 0)
    return `user:${r}`;
  const s = String(o.account || "").trim();
  return s ? `account:${s}` : "";
}
function A(e, o) {
  const r = e.map((t) => ({
    name: String(t.name || ""),
    size: g(t.size)
  })), s = r.reduce((t, n) => t + n.size, 0), u = r.map((t) => Math.max(t.size, 1)), z = u.reduce((t, n) => t + n, 0), m = r.map(() => 0);
  function M(t, n) {
    const i = r[t];
    if (!i || !o) return;
    const a = r.reduce(
      (c, f, p) => c + f.size * m[p],
      0
    ), l = u.reduce(
      (c, f, p) => c + f * m[p],
      0
    );
    o({
      phase: n,
      fileName: i.name,
      fileIndex: t + 1,
      fileCount: r.length,
      loaded: Math.round(a),
      total: s,
      percent: z > 0 ? Math.round(Math.min(1, l / z) * 100) : 100
    });
  }
  function d(t, n, i) {
    r[t] && (m[t] = Math.max(m[t], v(n)), M(t, i));
  }
  return {
    start(t) {
      d(t, 0, "preparing");
    },
    report(t, n, i, a = "uploading") {
      const l = r[t];
      if (!l) return;
      const c = a === "saving" || a === "complete" ? 1 : S(n, i, l.size);
      d(t, c, a);
    },
    saving(t) {
      d(t, 1, "saving");
    },
    complete(t) {
      d(t, 1, "complete");
    }
  };
}
function S(e, o, r) {
  const s = g(e), u = g(o);
  return u > 0 ? s / u : r > 0 ? s / r : 0;
}
function g(e) {
  const o = Number(e || 0);
  return Number.isFinite(o) && o > 0 ? o : 0;
}
function v(e) {
  return Math.max(0, Math.min(Number.isFinite(e) ? e : 0, 1));
}
export {
  A as c,
  y as u
};
