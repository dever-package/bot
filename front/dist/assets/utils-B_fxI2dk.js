await window.DeverFront?.ensureCompat?.(["@/lib/utils"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
export {
  e as m
};
