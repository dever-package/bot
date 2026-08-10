await window.DeverFront?.ensureCompat?.(["@/components/searchable-option-picker"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
export {
  e as m
};
