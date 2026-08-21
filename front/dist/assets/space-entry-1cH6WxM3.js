import { j as t, a as r, F as s } from "./preloadable-Bomi5PEU.js";
import { a as i, e as l, l as d, S as c } from "./_commonjsHelpers-61wyk6v6.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-entry-CRTO4Plz.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const n = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!n || Object.keys(n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const p = n.useTheme;
function u() {
  const { resolvedTheme: e } = p();
  return /* @__PURE__ */ t(
    "main",
    {
      className: `ws-startup-loading is-${e}`,
      role: "status",
      "aria-live": "polite",
      children: /* @__PURE__ */ r("div", { className: "ws-startup-loading-content", children: [
        /* @__PURE__ */ t("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ t("strong", { children: "正在加载创作空间" }),
        /* @__PURE__ */ t("span", { children: "正在准备画布与项目内容" })
      ] })
    }
  );
}
const m = d(
  () => import("./space-page-CeQICFO0.js").then((e) => e.G).then((e) => ({
    default: e.WorkSpacePage
  }))
);
function v() {
  const [e, a] = i(!0), o = l(() => {
    a(!1);
  }, []);
  return /* @__PURE__ */ r(s, { children: [
    /* @__PURE__ */ t(c, { fallback: null, children: /* @__PURE__ */ t(m, { onInitialLoadComplete: o }) }),
    e ? /* @__PURE__ */ t(u, {}) : null
  ] });
}
export {
  v as WorkSpaceEntry
};
