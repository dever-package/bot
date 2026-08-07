import { j as a, a as i, F as u } from "./createLucideIcon-fWv1XcFy.js";
import { a as d, b as o, c as p, d as m, l as f, S as h } from "./runtime-entry-ClkZDmNs.js";
import { L as g } from "./vanilla-BSPxkY5-.js";
function v() {
  const { resolvedTheme: e } = d();
  return /* @__PURE__ */ a(
    "main",
    {
      className: `ws-startup-loading is-${e}`,
      role: "status",
      "aria-live": "polite",
      children: /* @__PURE__ */ i("div", { className: "ws-startup-loading-content", children: [
        /* @__PURE__ */ a("span", { className: "ws-startup-loading-spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ a("strong", { children: "正在加载创作空间" }),
        /* @__PURE__ */ a("span", { children: "正在准备画布与项目内容" })
      ] })
    }
  );
}
function j({
  label: e,
  overlay: s = !1,
  compact: n = !1,
  delay: t = 160
}) {
  const [l, r] = o(t <= 0);
  return p(() => {
    if (t <= 0) {
      r(!0);
      return;
    }
    const c = window.setTimeout(() => r(!0), t);
    return () => window.clearTimeout(c);
  }, [t]), l ? /* @__PURE__ */ i(
    "div",
    {
      className: `ws-module-loading ${s ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ a(g, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ a("span", { children: e })
      ]
    }
  ) : null;
}
const S = f(
  () => import("./space-page-jOKilSym.js").then((e) => e.q).then((e) => ({
    default: e.WorkSpacePage
  }))
);
function b() {
  const [e, s] = o(!0), n = m(() => {
    s(!1);
  }, []);
  return /* @__PURE__ */ i(u, { children: [
    /* @__PURE__ */ a(h, { fallback: null, children: /* @__PURE__ */ a(S, { onInitialLoadComplete: n }) }),
    e ? /* @__PURE__ */ a(v, {}) : null
  ] });
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpaceEntry: b
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as C,
  j as a,
  k as s
};
