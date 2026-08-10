await window.DeverFront?.ensureCompat?.(["@/components/ui/sheet"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/ui/sheet");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/sheet");
export {
  e as m
};
