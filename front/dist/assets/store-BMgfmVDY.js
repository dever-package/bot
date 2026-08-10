await window.DeverFront?.ensureCompat?.(["@/lib/store"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
export {
  e as m
};
