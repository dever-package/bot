import { R as n } from "./runtime-entry-CIrzyMsA.js";
import { c as r } from "./vanilla-Ddg6vX1P.js";
const u = (t) => t;
function a(t, e = u) {
  const s = n.useSyncExternalStore(
    t.subscribe,
    n.useCallback(() => e(t.getState()), [t, e]),
    n.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return n.useDebugValue(s), s;
}
const c = (t) => {
  const e = r(t), s = (o) => a(e, o);
  return Object.assign(s, e), s;
}, l = ((t) => t ? c(t) : c);
export {
  l as c,
  a as u
};
