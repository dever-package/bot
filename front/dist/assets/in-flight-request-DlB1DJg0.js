await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
function i() {
  const e = /* @__PURE__ */ new Map();
  return (t, s) => {
    const n = e.get(t);
    if (n)
      return n;
    let r;
    return r = Promise.resolve().then(s).finally(() => {
      e.get(t) === r && e.delete(t);
    }), e.set(t, r), r;
  };
}
export {
  i as c,
  o as m
};
