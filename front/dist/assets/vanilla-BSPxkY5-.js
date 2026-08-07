import { c as b } from "./createLucideIcon-fWv1XcFy.js";
const f = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]], j = b("loader-circle", f), l = (o) => {
  let t;
  const n = /* @__PURE__ */ new Set(), s = (e, r) => {
    const c = typeof e == "function" ? e(t) : e;
    if (!Object.is(c, t)) {
      const u = t;
      t = r ?? (typeof c != "object" || c === null) ? c : Object.assign({}, t, c), n.forEach((S) => S(t, u));
    }
  }, a = () => t, i = { setState: s, getState: a, getInitialState: () => d, subscribe: (e) => (n.add(e), () => n.delete(e)) }, d = t = o(s, a, i);
  return i;
}, m = ((o) => o ? l(o) : l);
export {
  j as L,
  m as c
};
