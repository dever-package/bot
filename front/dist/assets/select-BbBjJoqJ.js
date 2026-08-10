await window.DeverFront?.ensureCompat?.(["@/components/ui/select"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
export {
  e as m
};
