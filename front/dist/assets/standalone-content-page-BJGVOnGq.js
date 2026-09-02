import { a as l, j as n, F as k } from "./runtime-entry-9YhLBCWA.js";
import { b as f, a as y, e as g } from "./_commonjsHelpers-C76sftkf.js";
import { X as N, $ as E, a0 as I, A as F } from "./vendor-icons-DgDZMD4Q.js";
import { B as D, a as A, b as w, c as O } from "./site-brand-DSXRyFfX.js";
import { u as S, f as x, g as H } from "./site-config-CnYw1vhW.js";
import { h as z, a as T, b as $ } from "./body-filing-Ixdz0skZ.js";
import { u as R } from "./use-body-appearance-CTGiTRxB.js";
import { u as j, B as M, a as V } from "./content-page-BTIjx4yn.js";
function U({
  items: e,
  mobileOpen: i,
  onMobileOpenChange: a
}) {
  const t = P(e), o = e.length >= 2;
  return f(() => {
    if (!i)
      return;
    const r = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const s = (d) => {
      d.key === "Escape" && a(!1);
    };
    return document.addEventListener("keydown", s), () => {
      document.body.style.overflow = r, document.removeEventListener("keydown", s);
    };
  }, [i, a]), o ? /* @__PURE__ */ l(k, { children: [
    /* @__PURE__ */ n("aside", { className: "body-content-outline-desktop", "aria-label": "文章目录", children: /* @__PURE__ */ l("div", { className: "body-content-outline-sticky", children: [
      /* @__PURE__ */ n("span", { className: "body-content-outline-title", children: "目录" }),
      /* @__PURE__ */ n(v, { items: e, activeID: t })
    ] }) }),
    i ? /* @__PURE__ */ n(
      "div",
      {
        className: "body-content-outline-overlay",
        role: "presentation",
        onMouseDown: (r) => {
          r.target === r.currentTarget && a(!1);
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
                    children: /* @__PURE__ */ n(N, { size: 19 })
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                v,
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
function v({
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
        q(o, t.id), a?.();
      },
      children: t.text
    },
    t.id
  )) });
}
function P(e) {
  const [i, a] = y(""), t = e.map((o) => o.id).join("|");
  return f(() => {
    if (e.length === 0) {
      a("");
      return;
    }
    let o = 0;
    const r = () => {
      o = 0;
      const u = 104;
      let b = e[0].id;
      for (const c of e) {
        const h = document.getElementById(c.id);
        if (!h || h.getBoundingClientRect().top > u)
          break;
        b = c.id;
      }
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 && (b = e[e.length - 1].id), a((c) => c === b ? c : b);
    }, s = () => {
      o || (o = window.requestAnimationFrame(r));
    }, d = _(window.location.hash);
    return e.some((u) => u.id === d) && window.requestAnimationFrame(() => {
      document.getElementById(d)?.scrollIntoView();
    }), r(), window.addEventListener("scroll", s, { passive: !0 }), window.addEventListener("resize", s), () => {
      o && window.cancelAnimationFrame(o), window.removeEventListener("scroll", s), window.removeEventListener("resize", s);
    };
  }, [t, e]), i;
}
function q(e, i) {
  const a = document.getElementById(i);
  if (!a)
    return;
  e.preventDefault();
  const t = new URL(window.location.href);
  t.hash = i, window.history.pushState(null, "", `${t.pathname}${t.search}${t.hash}`), a.scrollIntoView({ behavior: "smooth", block: "start" });
}
function _(e) {
  try {
    return decodeURIComponent(e.replace(/^#/, ""));
  } catch {
    return "";
  }
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const p = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!p || Object.keys(p).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const X = p.useTheme;
function ie() {
  const { config: e, loaded: i } = S(), { resolvedTheme: a } = X(), t = J(), o = j(t), [r, s] = y([]), [d, u] = y(!1), [b, c] = y(!1), h = r.length >= 2;
  R(e.site.appearance, a);
  const L = g(
    (m) => s(m),
    []
  ), C = g(
    (m) => u(m),
    []
  );
  return f(() => {
    i && (x(e.site), document.title = o.article?.title ? `${o.article.title} - ${e.site.siteName}` : e.site.siteName);
  }, [e.site, i, o.article?.title]), f(() => {
    h || u(!1);
  }, [h]), f(() => {
    if (!b)
      return;
    const m = (B) => {
      B.key === "Escape" && c(!1);
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [b]), i ? /* @__PURE__ */ l("main", { className: "body-content-public-page", children: [
    /* @__PURE__ */ n(D, {}),
    /* @__PURE__ */ n(
      Y,
      {
        config: e,
        outlineVisible: h,
        mobileOutlineOpen: d,
        mobileNavigationOpen: b,
        onCloseNavigation: () => c(!1),
        onToggleNavigation: () => {
          u(!1), c((m) => !m);
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
        "data-outline": h ? "visible" : void 0,
        children: [
          /* @__PURE__ */ l("section", { className: "body-content-public-reader", "aria-label": "文章详情", children: [
            !o.loading && o.error ? /* @__PURE__ */ n(M, { message: o.error, onRetry: o.reload }) : null,
            !o.loading && o.article ? /* @__PURE__ */ l(k, { children: [
              /* @__PURE__ */ n(
                V,
                {
                  article: o.article,
                  onOutlineChange: L
                }
              ),
              /* @__PURE__ */ n(G, { config: e })
            ] }) : null
          ] }),
          /* @__PURE__ */ n(
            U,
            {
              items: r,
              mobileOpen: d,
              onMobileOpenChange: C
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
function Y({
  config: e,
  outlineVisible: i,
  mobileOutlineOpen: a,
  mobileNavigationOpen: t,
  onCloseNavigation: o,
  onToggleNavigation: r,
  onOpenOutline: s
}) {
  const d = H();
  return /* @__PURE__ */ l("header", { className: "body-content-public-header", children: [
    /* @__PURE__ */ l("div", { className: "body-content-public-header-inner", children: [
      /* @__PURE__ */ n("div", { className: "body-content-public-brand", children: /* @__PURE__ */ n(
        A,
        {
          site: e.site,
          logoClassName: "body-content-public-brand-logo",
          nameClassName: "body-content-public-brand-name"
        }
      ) }),
      /* @__PURE__ */ n(
        w,
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
            onClick: r,
            children: t ? /* @__PURE__ */ n(N, { size: 18 }) : /* @__PURE__ */ n(E, { size: 18 })
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
            onClick: s,
            children: [
              /* @__PURE__ */ n(I, { size: 18 }),
              /* @__PURE__ */ n("span", { children: "目录" })
            ]
          }
        ) : null,
        /* @__PURE__ */ l("a", { className: "body-content-public-back", href: d, children: [
          /* @__PURE__ */ n(F, { size: 17 }),
          /* @__PURE__ */ n("span", { children: "返回站点" })
        ] })
      ] })
    ] }),
    t && e.links.length > 0 ? /* @__PURE__ */ n(
      w,
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
function G({ config: e }) {
  const i = [
    e.legalLinks.termsOfService,
    e.legalLinks.privacyPolicy
  ].filter((t) => t != null), a = z(e.site.filing);
  return !a && i.length === 0 ? null : /* @__PURE__ */ l("footer", { className: "body-content-public-footer", "aria-label": "站点信息", children: [
    a ? /* @__PURE__ */ n(
      T,
      {
        filing: e.site.filing,
        className: "body-content-public-filing",
        fallback: /* @__PURE__ */ n($, { filing: e.site.filing })
      }
    ) : null,
    i.length > 0 ? /* @__PURE__ */ n("nav", { className: "body-content-public-legal", "aria-label": "协议条款", children: i.map((t) => /* @__PURE__ */ n(O, { link: t }, t.id)) }) : null
  ] });
}
function J() {
  if (typeof window > "u")
    return 0;
  const e = Number(new URLSearchParams(window.location.search).get("id") || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
export {
  ie as StandaloneContentPage
};
