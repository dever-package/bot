await window.DeverFront?.ensureCompat?.(["@/components/confirm-dialog"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
export {
  o as m
};
