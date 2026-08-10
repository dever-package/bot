import { a as t, j as r, F as c } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as i, o as d, b as m, p, S as f } from "./react-C7Xtl8sB.js";
import { L as h } from "./vendor-icons-Cc7Kl3It.js";
import { m as w } from "./theme-provider-vgtP-iBt.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-entry-CRTO4Plz.css", import.meta.url).href]);
const g = w.useTheme;
function v() {
  const { resolvedTheme: e } = g();
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
function k({
  label: e,
  overlay: s = !1,
  compact: n = !1,
  delay: a = 160
}) {
  const [l, o] = i(a <= 0);
  return d(() => {
    if (a <= 0) {
      o(!0);
      return;
    }
    const u = window.setTimeout(() => o(!0), a);
    return () => window.clearTimeout(u);
  }, [a]), l ? /* @__PURE__ */ r(
    "div",
    {
      className: `ws-module-loading ${s ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ t(h, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ t("span", { children: e })
      ]
    }
  ) : null;
}
const S = p(
  () => import("./space-page-D3VBae11.js").then((e) => e.F).then((e) => ({
    default: e.WorkSpacePage
  }))
);
function L() {
  const [e, s] = i(!0), n = m(() => {
    s(!1);
  }, []);
  return /* @__PURE__ */ r(c, { children: [
    /* @__PURE__ */ t(f, { fallback: null, children: /* @__PURE__ */ t(S, { onInitialLoadComplete: n }) }),
    e ? /* @__PURE__ */ t(v, {}) : null
  ] });
}
const j = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpaceEntry: L
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as C,
  v as a,
  j as s
};
