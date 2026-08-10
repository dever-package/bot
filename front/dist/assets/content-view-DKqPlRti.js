await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
export {
  e as m
};
