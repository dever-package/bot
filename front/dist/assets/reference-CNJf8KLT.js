await window.DeverFront?.ensureCompat?.(["@/lib/assistant/reference"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/lib/assistant/reference");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/assistant/reference");
export {
  e as m
};
