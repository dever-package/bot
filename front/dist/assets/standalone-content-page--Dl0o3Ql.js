import { c as C, a as l, j as n, F as v } from "./createLucideIcon-fWv1XcFy.js";
import { c as y, b as p, a as E, d as f } from "./runtime-entry-ClkZDmNs.js";
import { A as I } from "./arrow-left-8fGzp-c8.js";
import { M as A, h as F, B as S, a as D } from "./body-filing-ClK58x0I.js";
import { X as k } from "./in-flight-request-CXY2yBH9.js";
import { u as O, B as z, a as M, b as g, c as H } from "./site-brand-E6f0Ffb2.js";
import { u as j, a as x, b as R } from "./site-config-DrnclGFw.js";
import { u as T, B as $, a as V } from "./content-page-4YQ6HzLb.js";
const U = [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
], P = C("list", U);
function q({
  items: e,
  mobileOpen: i,
  onMobileOpenChange: a
}) {
  const t = _(e), o = e.length >= 2;
  return y(() => {
    if (!i)
      return;
    const s = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const r = (d) => {
      d.key === "Escape" && a(!1);
    };
    return document.addEventListener("keydown", r), () => {
      document.body.style.overflow = s, document.removeEventListener("keydown", r);
    };
  }, [i, a]), o ? /* @__PURE__ */ l(v, { children: [
    /* @__PURE__ */ n("aside", { className: "body-content-outline-desktop", "aria-label": "文章目录", children: /* @__PURE__ */ l("div", { className: "body-content-outline-sticky", children: [
      /* @__PURE__ */ n("span", { className: "body-content-outline-title", children: "目录" }),
      /* @__PURE__ */ n(w, { items: e, activeID: t })
    ] }) }),
    i ? /* @__PURE__ */ n(
      "div",
      {
        className: "body-content-outline-overlay",
        role: "presentation",
        onMouseDown: (s) => {
          s.target === s.currentTarget && a(!1);
        },
        children: /* @__PURE__ */ l(
          "aside",
          {
            id: "body-content-mobile-outline",
            className: "body-content-outline-mobile",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "文章目录",
            children: [
              /* @__PURE__ */ l("header", { children: [
                /* @__PURE__ */ n("span", { children: "目录" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    autoFocus: !0,
                    "aria-label": "关闭目录",
                    title: "关闭目录",
                    onClick: () => a(!1),
                    children: /* @__PURE__ */ n(k, { size: 19 })
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                w,
                {
                  items: e,
                  activeID: t,
                  onSelect: () => a(!1)
                }
              )
            ]
          }
        )
      }
    ) : null
  ] }) : null;
}
function w({
  items: e,
  activeID: i,
  onSelect: a
}) {
  return /* @__PURE__ */ n("nav", { className: "body-content-outline-links", children: e.map((t) => /* @__PURE__ */ n(
    "a",
    {
      href: `#${t.id}`,
      className: t.level === 3 ? "is-child" : void 0,
      "aria-current": i === t.id ? "location" : void 0,
      onClick: (o) => {
        X(o, t.id), a?.();
      },
      children: t.text
    },
    t.id
  )) });
}
function _(e) {
  const [i, a] = p(""), t = e.map((o) => o.id).join("|");
  return y(() => {
    if (e.length === 0) {
      a("");
      return;
    }
    let o = 0;
    const s = () => {
      o = 0;
      const u = 104;
      let b = e[0].id;
      for (const c of e) {
        const m = document.getElementById(c.id);
        if (!m || m.getBoundingClientRect().top > u)
          break;
        b = c.id;
      }
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 && (b = e[e.length - 1].id), a((c) => c === b ? c : b);
    }, r = () => {
      o || (o = window.requestAnimationFrame(s));
    }, d = Y(window.location.hash);
    return e.some((u) => u.id === d) && window.requestAnimationFrame(() => {
      document.getElementById(d)?.scrollIntoView();
    }), s(), window.addEventListener("scroll", r, { passive: !0 }), window.addEventListener("resize", r), () => {
      o && window.cancelAnimationFrame(o), window.removeEventListener("scroll", r), window.removeEventListener("resize", r);
    };
  }, [t, e]), i;
}
function X(e, i) {
  const a = document.getElementById(i);
  if (!a)
    return;
  e.preventDefault();
  const t = new URL(window.location.href);
  t.hash = i, window.history.pushState(null, "", `${t.pathname}${t.search}${t.hash}`), a.scrollIntoView({ behavior: "smooth", block: "start" });
}
function Y(e) {
  try {
    return decodeURIComponent(e.replace(/^#/, ""));
  } catch {
    return "";
  }
}
function ae() {
  const { config: e, loaded: i } = j(), { resolvedTheme: a } = E(), t = K(), o = T(t), [s, r] = p([]), [d, u] = p(!1), [b, c] = p(!1), m = s.length >= 2;
  O(e.site.appearance, a);
  const N = f(
    (h) => r(h),
    []
  ), L = f(
    (h) => u(h),
    []
  );
  return y(() => {
    i && (x(e.site), document.title = o.article?.title ? `${o.article.title} - ${e.site.siteName}` : e.site.siteName);
  }, [e.site, i, o.article?.title]), y(() => {
    m || u(!1);
  }, [m]), y(() => {
    if (!b)
      return;
    const h = (B) => {
      B.key === "Escape" && c(!1);
    };
    return window.addEventListener("keydown", h), () => window.removeEventListener("keydown", h);
  }, [b]), i ? /* @__PURE__ */ l("main", { className: "body-content-public-page", children: [
    /* @__PURE__ */ n(z, {}),
    /* @__PURE__ */ n(
      G,
      {
        config: e,
        outlineVisible: m,
        mobileOutlineOpen: d,
        mobileNavigationOpen: b,
        onCloseNavigation: () => c(!1),
        onToggleNavigation: () => {
          u(!1), c((h) => !h);
        },
        onOpenOutline: () => {
          c(!1), u(!0);
        }
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        className: "body-content-public-layout",
        "data-outline": m ? "visible" : void 0,
        children: [
          /* @__PURE__ */ l("section", { className: "body-content-public-reader", "aria-label": "文章详情", children: [
            !o.loading && o.error ? /* @__PURE__ */ n($, { message: o.error, onRetry: o.reload }) : null,
            !o.loading && o.article ? /* @__PURE__ */ l(v, { children: [
              /* @__PURE__ */ n(
                V,
                {
                  article: o.article,
                  onOutlineChange: N
                }
              ),
              /* @__PURE__ */ n(J, { config: e })
            ] }) : null
          ] }),
          /* @__PURE__ */ n(
            q,
            {
              items: s,
              mobileOpen: d,
              onMobileOpenChange: L
            }
          )
        ]
      }
    )
  ] }) : /* @__PURE__ */ n(
    "main",
    {
      className: "body-content-public-page body-content-public-page-loading",
      "aria-busy": "true"
    }
  );
}
function G({
  config: e,
  outlineVisible: i,
  mobileOutlineOpen: a,
  mobileNavigationOpen: t,
  onCloseNavigation: o,
  onToggleNavigation: s,
  onOpenOutline: r
}) {
  const d = R();
  return /* @__PURE__ */ l("header", { className: "body-content-public-header", children: [
    /* @__PURE__ */ l("div", { className: "body-content-public-header-inner", children: [
      /* @__PURE__ */ n("div", { className: "body-content-public-brand", children: /* @__PURE__ */ n(
        M,
        {
          site: e.site,
          logoClassName: "body-content-public-brand-logo",
          nameClassName: "body-content-public-brand-name"
        }
      ) }),
      /* @__PURE__ */ n(
        g,
        {
          links: e.links,
          className: "body-content-public-navigation",
          ariaLabel: "站点链接"
        }
      ),
      /* @__PURE__ */ l("div", { className: "body-content-public-actions", children: [
        e.links.length > 0 ? /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "body-content-navigation-trigger",
            "aria-label": t ? "关闭站点链接" : "打开站点链接",
            title: "站点导航",
            "aria-controls": "body-content-mobile-navigation",
            "aria-expanded": t,
            onClick: s,
            children: t ? /* @__PURE__ */ n(k, { size: 18 }) : /* @__PURE__ */ n(A, { size: 18 })
          }
        ) : null,
        i ? /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "body-content-outline-trigger",
            "aria-label": "打开目录",
            title: "目录",
            "aria-controls": "body-content-mobile-outline",
            "aria-expanded": a,
            onClick: r,
            children: [
              /* @__PURE__ */ n(P, { size: 18 }),
              /* @__PURE__ */ n("span", { children: "目录" })
            ]
          }
        ) : null,
        /* @__PURE__ */ l("a", { className: "body-content-public-back", href: d, children: [
          /* @__PURE__ */ n(I, { size: 17 }),
          /* @__PURE__ */ n("span", { children: "返回站点" })
        ] })
      ] })
    ] }),
    t && e.links.length > 0 ? /* @__PURE__ */ n(
      g,
      {
        id: "body-content-mobile-navigation",
        links: e.links,
        className: "body-content-public-mobile-navigation",
        ariaLabel: "移动端站点链接",
        onLinkClick: o
      }
    ) : null
  ] });
}
function J({ config: e }) {
  const i = [
    e.legalLinks.termsOfService,
    e.legalLinks.privacyPolicy
  ].filter((t) => t != null), a = F(e.site.filing);
  return !a && i.length === 0 ? null : /* @__PURE__ */ l("footer", { className: "body-content-public-footer", "aria-label": "站点信息", children: [
    a ? /* @__PURE__ */ n(
      S,
      {
        filing: e.site.filing,
        className: "body-content-public-filing",
        fallback: /* @__PURE__ */ n(D, { filing: e.site.filing })
      }
    ) : null,
    i.length > 0 ? /* @__PURE__ */ n("nav", { className: "body-content-public-legal", "aria-label": "协议条款", children: i.map((t) => /* @__PURE__ */ n(H, { link: t }, t.id)) }) : null
  ] });
}
function K() {
  if (typeof window > "u")
    return 0;
  const e = Number(new URLSearchParams(window.location.search).get("id") || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
export {
  ae as StandaloneContentPage
};
