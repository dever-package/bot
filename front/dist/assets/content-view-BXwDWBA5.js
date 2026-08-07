import { R as o, g as a } from "./runtime-entry-ClkZDmNs.js";
import { c as u } from "./vanilla-BSPxkY5-.js";
const i = (e) => e;
function g(e, t = i) {
  const n = o.useSyncExternalStore(
    e.subscribe,
    o.useCallback(() => t(e.getState()), [e, t]),
    o.useCallback(() => t(e.getInitialState()), [e, t])
  );
  return o.useDebugValue(n), n;
}
const s = (e) => {
  const t = u(e), n = (c) => g(t, c);
  return Object.assign(n, t), n;
}, b = ((e) => e ? s(e) : s), r = a("@/components/energon/content-view");
if (!r || Object.keys(r).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
export {
  b as c,
  r as m,
  g as u
};
