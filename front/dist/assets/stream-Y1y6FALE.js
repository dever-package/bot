await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
await window.DeverFront?.ensureCompat?.(["@/lib/stream"]);
const t = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!t || Object.keys(t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
export {
  e as a,
  t as m
};
