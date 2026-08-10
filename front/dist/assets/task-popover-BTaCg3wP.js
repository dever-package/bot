await window.DeverFront?.ensureCompat?.(["@/components/assistant/task-popover"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/task-popover");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/task-popover");
export {
  o as m
};
