await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-runner"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
export {
  e as m
};
