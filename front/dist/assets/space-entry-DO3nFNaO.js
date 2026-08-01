import { j as e, a as t, F as i } from "./createLucideIcon-CEtb6KSk.js";
import { i as l, u as r, d as o, l as d, k as c } from "./runtime-entry-CIrzyMsA.js";
import { L as u } from "./loader-circle-QnfinZ3F.js";
function p() {
  const { resolvedTheme: a } = l();
  return /* @__PURE__ */ e(
    "main",
    {
      className: `ws-startup-loading is-${a}`,
      role: "status",
      "aria-live": "polite",
      children: /* @__PURE__ */ t("div", { className: "ws-startup-loading-content", children: [
        /* @__PURE__ */ e("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ e("strong", { children: "正在加载创作空间" }),
        /* @__PURE__ */ e("span", { children: "正在准备画布与项目内容" })
      ] })
    }
  );
}
function L({
  label: a,
  overlay: s = !1,
  compact: n = !1
}) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: `ws-module-loading ${s ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ e(u, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { children: a })
      ]
    }
  );
}
const m = d(
  () => import("./space-page-BBWff1fq.js").then((a) => a.j).then((a) => ({
    default: a.WorkSpacePage
  }))
);
function h() {
  const [a, s] = r(!0), n = o(() => {
    s(!1);
  }, []);
  return /* @__PURE__ */ t(i, { children: [
    /* @__PURE__ */ e(c, { fallback: null, children: /* @__PURE__ */ e(m, { onInitialLoadComplete: n }) }),
    a ? /* @__PURE__ */ e(p, {}) : null
  ] });
}
const S = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpaceEntry: h
}, Symbol.toStringTag, { value: "Module" }));
export {
  p as C,
  L as a,
  S as s
};
