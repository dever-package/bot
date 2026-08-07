import { c } from "./createLucideIcon-fWv1XcFy.js";
const s = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], a = c("x", s);
function u() {
  const e = /* @__PURE__ */ new Map();
  return (t, o) => {
    const r = e.get(t);
    if (r)
      return r;
    let n;
    return n = Promise.resolve().then(o).finally(() => {
      e.get(t) === n && e.delete(t);
    }), e.set(t, n), n;
  };
}
export {
  a as X,
  u as c
};
