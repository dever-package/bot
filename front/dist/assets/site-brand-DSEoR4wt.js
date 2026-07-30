import { j as r, F as c, a as u } from "./createLucideIcon-Gw0gLVQ5.js";
import { d } from "./site-config-9qHTjCAH.js";
import { T as l } from "./index-wo12HRHg.js";
import { u as f, b as m, S as p } from "./runtime-entry-CkPHMDB1.js";
function h({
  link: e,
  onClick: o,
  children: a,
  className: t,
  role: s,
  title: n,
  ariaHasPopup: i
}) {
  return /* @__PURE__ */ r(
    "a",
    {
      className: t,
      href: d(e),
      target: e.target,
      rel: e.target === "_blank" ? "noreferrer noopener" : void 0,
      role: s,
      title: n,
      "aria-haspopup": i,
      onClick: o,
      children: a ?? e.name
    }
  );
}
function L({
  links: e,
  ariaLabel: o,
  className: a,
  id: t,
  onLinkClick: s
}) {
  return /* @__PURE__ */ r("nav", { id: t, className: a, "aria-label": o, children: e.map((n) => /* @__PURE__ */ r(
    h,
    {
      link: n,
      onClick: s
    },
    n.id
  )) });
}
function N() {
  return /* @__PURE__ */ r(
    l,
    {
      className: "bot-work-toaster",
      position: "top-center",
      richColors: !0,
      closeButton: !0
    }
  );
}
function j({
  site: e,
  className: o = "",
  logoClassName: a = "",
  nameClassName: t = ""
}) {
  return /* @__PURE__ */ u("span", { className: o, "aria-label": e.siteName, children: [
    /* @__PURE__ */ r(
      b,
      {
        src: e.logo,
        alt: "",
        className: a,
        fallback: /* @__PURE__ */ r(p, { className: a })
      }
    ),
    /* @__PURE__ */ r("span", { className: t, children: e.siteName })
  ] });
}
function b({
  src: e,
  alt: o,
  className: a = "",
  fallback: t
}) {
  const [s, n] = f("");
  return m(() => {
    n("");
  }, [e]), !e || s === e ? /* @__PURE__ */ r(c, { children: t }) : /* @__PURE__ */ r(
    "img",
    {
      src: e,
      alt: o,
      className: a,
      onError: () => n(e)
    }
  );
}
export {
  N as B,
  j as a,
  L as b,
  h as c,
  b as d
};
