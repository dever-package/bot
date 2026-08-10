await window.DeverFront?.ensureCompat?.(["@/components/ui/input"]);
const n = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!n || Object.keys(n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
export {
  n as m
};
