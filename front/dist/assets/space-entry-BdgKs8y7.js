import { j as r } from "./runtime-entry-9YhLBCWA.js";
import { l as a, S as o } from "./_commonjsHelpers-C76sftkf.js";
const t = a(
  () => import("./space-page-CQN519oX.js").then((e) => e.I).then((e) => ({
    default: e.WorkSpacePage
  }))
);
function p({
  onInitialLoadComplete: e
}) {
  return /* @__PURE__ */ r(o, { fallback: null, children: /* @__PURE__ */ r(t, { onInitialLoadComplete: e }) });
}
export {
  p as WorkSpaceEntry
};
