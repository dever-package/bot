await window.DeverFront?.ensureCompat?.(["@/components/stream-timing"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
export {
  e as m
};
