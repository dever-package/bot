import { c as a } from "./createLucideIcon-CEtb6KSk.js";
import { n as o, g as l } from "./runtime-entry-CIrzyMsA.js";
const d = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
], k = a("moon", d);
const s = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
], y = a("sun", s);
function I({
  iconName: n,
  iconImage: e,
  fallbackIcon: t,
  className: r,
  strokeWidth: i
}) {
  const c = String(e || "").trim();
  if (c)
    return o("img", {
      src: c,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: r
    });
  const u = p(n, t);
  return o(u, { className: r, strokeWidth: i });
}
function p(n, e) {
  const t = g(n);
  return m(t) || e;
}
function m(n) {
  if (!n)
    return null;
  try {
    const e = l("@/lib/icon").resolveLucideIcon, t = e?.(n);
    if (t)
      return t;
  } catch {
  }
  return null;
}
function g(n) {
  const e = String(n || "").trim();
  return !e || e === "-" ? "" : e.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
export {
  I as C,
  k as M,
  y as S,
  p as r
};
