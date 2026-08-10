await window.DeverFront?.ensureCompat?.(["@/components/agent/interaction-panel"]);
const n = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!n || Object.keys(n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
export {
  n as m
};
