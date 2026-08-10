await window.DeverFront?.ensureCompat?.(["@/components/ui/textarea"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/ui/textarea");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/textarea");
export {
  e as m
};
