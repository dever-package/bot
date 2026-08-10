await window.DeverFront?.ensureCompat?.(["@/components/ui/button"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
export {
  o as m
};
