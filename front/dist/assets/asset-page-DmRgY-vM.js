import { j as d } from "./createLucideIcon-Gw0gLVQ5.js";
import { A as i, u as l, n as p } from "./upload-asset-api-JzPGB3fW.js";
function f({
  teamID: s,
  onContinue: e,
  canContinue: a,
  catalogOptions: r
}) {
  async function t(n) {
    return (await l({ teamID: s, files: n })).map(({ asset: o }) => p(o)).filter((o) => o.id > 0);
  }
  return /* @__PURE__ */ d(
    i,
    {
      teamID: s,
      onLocalUpload: t,
      onContinue: e,
      canContinue: a,
      catalogOptions: r
    }
  );
}
export {
  f as WorkbenchAssetPage
};
