await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
export {
  e as m
};
