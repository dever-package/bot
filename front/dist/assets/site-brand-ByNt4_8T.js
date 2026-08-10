import { a as o, F as c, j as u } from "./_commonjsHelpers-CTFd9u1x.js";
import { e as d } from "./site-config-BVY1isir.js";
import { T as m } from "./index-BxqXLJC9.js";
import { l as f, o as p } from "./react-C7Xtl8sB.js";
function g({
  link: e,
  onClick: r,
  children: t,
  className: a,
  role: s,
  title: n,
  ariaHasPopup: l
}) {
  return /* @__PURE__ */ o(
    "a",
    {
      className: a,
      href: d(e),
      target: e.target,
      rel: e.target === "_blank" ? "noreferrer noopener" : void 0,
      role: s,
      title: n,
      "aria-haspopup": l,
      onClick: r,
      children: t ?? e.name
    }
  );
}
function v({
  links: e,
  ariaLabel: r,
  className: t,
  id: a,
  onLinkClick: s
}) {
  return /* @__PURE__ */ o("nav", { id: a, className: t, "aria-label": r, children: e.map((n) => /* @__PURE__ */ o(
    g,
    {
      link: n,
      onClick: s
    },
    n.id
  )) });
}
function L() {
  return /* @__PURE__ */ o(
    m,
    {
      className: "bot-work-toaster",
      position: "top-center",
      richColors: !0,
      closeButton: !0
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/layout/site-logo"]);
const i = window.DeverFront?.sdk?.getCompatModule("@/components/layout/site-logo");
if (!i || Object.keys(i).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/layout/site-logo");
const h = i.SiteLogo;
function k({
  site: e,
  className: r = "",
  logoClassName: t = "",
  nameClassName: a = ""
}) {
  return /* @__PURE__ */ u("span", { className: r, "aria-label": e.siteName, children: [
    /* @__PURE__ */ o(
      y,
      {
        src: e.logo,
        alt: "",
        className: t,
        fallback: /* @__PURE__ */ o(h, { className: t })
      }
    ),
    /* @__PURE__ */ o("span", { className: a, children: e.siteName })
  ] });
}
function y({
  src: e,
  alt: r,
  className: t = "",
  fallback: a
}) {
  const [s, n] = f("");
  return p(() => {
    n("");
  }, [e]), !e || s === e ? /* @__PURE__ */ o(c, { children: a }) : /* @__PURE__ */ o(
    "img",
    {
      src: e,
      alt: r,
      className: t,
      onError: () => n(e)
    }
  );
}
export {
  L as B,
  k as a,
  v as b,
  g as c,
  y as d
};
