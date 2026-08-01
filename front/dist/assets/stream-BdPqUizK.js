import { g as r } from "./runtime-entry-CIrzyMsA.js";
const t = r("@/lib/runtime-stream-output");
if (!t || Object.keys(t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const e = r("@/lib/stream");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
export {
  t as a,
  e as m
};
