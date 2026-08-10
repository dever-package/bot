await window.DeverFront?.ensureCompat?.(["@/lib/upload"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
export {
  o as m
};
