import { s as u, k as n } from "./runtime-entry-CkPHMDB1.js";
const l = window.React, L = l.Fragment;
function f(e, t) {
  return t == null ? e || {} : Object.assign({}, e || {}, { key: t });
}
function g(e, t, r) {
  return l.createElement(e, f(t, r));
}
const k = g;
const h = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), A = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, r, o) => o ? o.toUpperCase() : r.toLowerCase()
), i = (e) => {
  const t = A(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
}, m = (...e) => e.filter((t, r, o) => !!t && t.trim() !== "" && o.indexOf(t) === r).join(" ").trim(), b = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
};
var j = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const x = u(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: o,
    className: a = "",
    children: s,
    iconNode: d,
    ...c
  }, w) => n(
    "svg",
    {
      ref: w,
      ...j,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: o ? Number(r) * 24 / Number(t) : r,
      className: m("lucide", a),
      ...!s && !b(c) && { "aria-hidden": "true" },
      ...c
    },
    [
      ...d.map(([p, C]) => n(p, C)),
      ...Array.isArray(s) ? s : [s]
    ]
  )
);
const $ = (e, t) => {
  const r = u(
    ({ className: o, ...a }, s) => n(x, {
      ref: s,
      iconNode: t,
      className: m(
        `lucide-${h(i(e))}`,
        `lucide-${e}`,
        o
      ),
      ...a
    })
  );
  return r.displayName = i(e), r;
};
export {
  L as F,
  k as a,
  $ as c,
  g as j
};
