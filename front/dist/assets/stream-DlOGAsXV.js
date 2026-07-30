import { R as s, g as a } from "./runtime-entry-CkPHMDB1.js";
import { c as i } from "./vanilla-Ddg6vX1P.js";
const l = (t) => t;
function m(t, e = l) {
  const r = s.useSyncExternalStore(
    t.subscribe,
    s.useCallback(() => e(t.getState()), [t, e]),
    s.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return s.useDebugValue(r), r;
}
const n = (t) => {
  const e = i(t), r = (c) => m(e, c);
  return Object.assign(r, e), r;
}, d = ((t) => t ? n(t) : n), o = a("@/lib/runtime-stream-output");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const u = a("@/lib/stream");
if (!u || Object.keys(u).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
export {
  o as a,
  d as c,
  u as m,
  m as u
};
