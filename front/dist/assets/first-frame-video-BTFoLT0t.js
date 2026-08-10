await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
export {
  e as m
};
