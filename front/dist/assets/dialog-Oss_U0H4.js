await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
export {
  o as m
};
