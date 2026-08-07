import { j as n, F as p, a as u } from "./createLucideIcon-fWv1XcFy.js";
import { g as l, h as b } from "./site-config-DrnclGFw.js";
import { T as f } from "./index-Cf7idtTi.js";
import { o as m, b as k, c as w, p as g } from "./runtime-entry-ClkZDmNs.js";
function v({
  link: e,
  onClick: t,
  children: r,
  className: a,
  role: i,
  title: s,
  ariaHasPopup: o
}) {
  return /* @__PURE__ */ n(
    "a",
    {
      className: a,
      href: l(e),
      target: e.target,
      rel: e.target === "_blank" ? "noreferrer noopener" : void 0,
      role: i,
      title: s,
      "aria-haspopup": o,
      onClick: t,
      children: r ?? e.name
    }
  );
}
function L({
  links: e,
  ariaLabel: t,
  className: r,
  id: a,
  onLinkClick: i
}) {
  return /* @__PURE__ */ n("nav", { id: a, className: r, "aria-label": t, children: e.map((s) => /* @__PURE__ */ n(
    v,
    {
      link: s,
      onClick: i
    },
    s.id
  )) });
}
function x() {
  return /* @__PURE__ */ n(
    f,
    {
      className: "bot-work-toaster",
      position: "top-center",
      richColors: !0,
      closeButton: !0
    }
  );
}
const y = [
  "--body-work-bg",
  "--body-work-canvas",
  "--body-work-surface",
  "--body-work-surface-raised",
  "--body-work-text",
  "--body-work-muted",
  "--body-work-line",
  "--body-work-active",
  "--body-work-shadow",
  "--body-work-primary",
  "--body-work-primary-strong",
  "--body-work-primary-bright",
  "--body-work-primary-soft",
  "--body-work-on-primary",
  "--body-work-ring"
];
function N(e, t) {
  m(() => {
    if (typeof document > "u")
      return;
    const r = document.documentElement, a = r.getAttribute("data-body-appearance"), i = y.map((o) => ({
      property: o,
      value: r.style.getPropertyValue(o),
      priority: r.style.getPropertyPriority(o)
    })), s = b(e, t);
    r.setAttribute("data-body-appearance", "active");
    for (const o of y) {
      const d = s[o];
      d ? r.style.setProperty(o, d) : r.style.removeProperty(o);
    }
    return () => {
      a == null ? r.removeAttribute("data-body-appearance") : r.setAttribute("data-body-appearance", a);
      for (const { property: o, value: d, priority: c } of i)
        d ? r.style.setProperty(o, d, c) : r.style.removeProperty(o);
    };
  }, [e, t]);
}
function E({
  site: e,
  className: t = "",
  logoClassName: r = "",
  nameClassName: a = ""
}) {
  return /* @__PURE__ */ u("span", { className: t, "aria-label": e.siteName, children: [
    /* @__PURE__ */ n(
      h,
      {
        src: e.logo,
        alt: "",
        className: r,
        fallback: /* @__PURE__ */ n(g, { className: r })
      }
    ),
    /* @__PURE__ */ n("span", { className: a, children: e.siteName })
  ] });
}
function h({
  src: e,
  alt: t,
  className: r = "",
  fallback: a
}) {
  const [i, s] = k("");
  return w(() => {
    s("");
  }, [e]), !e || i === e ? /* @__PURE__ */ n(p, { children: a }) : /* @__PURE__ */ n(
    "img",
    {
      src: e,
      alt: t,
      className: r,
      onError: () => s(e)
    }
  );
}
export {
  x as B,
  E as a,
  L as b,
  v as c,
  h as d,
  N as u
};
