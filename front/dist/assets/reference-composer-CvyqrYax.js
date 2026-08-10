await window.DeverFront?.ensureCompat?.(["@/components/reference-composer"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
export {
  e as m
};
