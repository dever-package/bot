import { a as r, j as e, F as E, u as fe } from "./runtime-entry-9YhLBCWA.js";
import { a as f, d as W, b as N, S as L, l as ae, e as I, u as re } from "./_commonjsHelpers-C76sftkf.js";
import { B as R, aH as se, b9 as ie, X as pe, ba as ge, r as le, v as ye, R as ce, H as ve, bb as X, b1 as Z, b0 as J, bc as ke, bd as we, d as Ne, n as Ce, ae as Me, be as De, K as Pe, Z as Se, b8 as Ie, bf as xe } from "./vendor-icons-DgDZMD4Q.js";
import { t as $, q as Ee, f as Ae, m as Te, o as Oe } from "./site-config-CnYw1vhW.js";
import { c as Q, a as ue, B as Fe } from "./site-brand-DSXRyFfX.js";
import { u as We } from "./project-dialogs-mYJg07yc.js";
import { u as Be } from "./use-body-appearance-CTGiTRxB.js";
import { a as Le } from "./content-api-Bo6RMy66.js";
import { C as B } from "./power-icon-Bx5F2rhr.js";
import { h as A, c as T, l as je } from "./preloadable-BSZIYdQl.js";
import { f as Ke, g as _e } from "./workbench-api-4sP0Ef4Z.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./home-shell-BpJUEpXC.css", import.meta.url).href]);
const Re = ae(
  () => import("./content-article-sheet-u2h-SZwk.js").then((n) => ({
    default: n.BodyContentArticleSheet
  }))
);
function $e({
  menu: n,
  navigation: t
}) {
  const [a, i] = f(!1), [l, m] = f(0), o = W(null), h = t.items[0];
  if (N(() => {
    if (!a || typeof document > "u")
      return;
    function s(p) {
      o.current?.contains(p.target) || i(!1);
    }
    return document.addEventListener("pointerdown", s), () => {
      document.removeEventListener("pointerdown", s);
    };
  }, [a]), !h)
    return null;
  function b(s) {
    o.current?.contains(s.relatedTarget) || i(!1);
  }
  function u(s) {
    s.key === "Escape" && (s.preventDefault(), i(!1), o.current?.querySelector(".hb-rail-action")?.focus());
  }
  function c(s, p) {
    i(!1), !(!$(p) || !qe(s)) && (s.preventDefault(), m(p.articleID));
  }
  const v = l > 0 ? /* @__PURE__ */ e(L, { fallback: null, children: /* @__PURE__ */ e(
    Re,
    {
      articleID: l,
      open: !0,
      onOpenChange: (s) => {
        s || m(0);
      }
    }
  ) }) : null;
  return t.items.length === 1 ? /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ r(
      Q,
      {
        link: h,
        className: "hb-rail-action",
        title: n.name,
        ariaHasPopup: $(h) ? "dialog" : void 0,
        onClick: (s) => c(s, h),
        children: [
          /* @__PURE__ */ e(
            B,
            {
              iconName: n.icon,
              iconImage: n.iconImage,
              fallbackIcon: R,
              className: "hb-configured-menu-icon",
              strokeWidth: 1.8
            }
          ),
          /* @__PURE__ */ e("span", { children: n.name })
        ]
      }
    ),
    v
  ] }) : /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        ref: o,
        className: "hb-content-menu-root",
        onMouseEnter: () => i(!0),
        onMouseLeave: () => i(!1),
        onFocusCapture: () => i(!0),
        onBlurCapture: b,
        onKeyDown: u,
        children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "hb-rail-action",
              title: n.name,
              "aria-haspopup": "menu",
              "aria-expanded": a,
              onClick: () => i((s) => !s),
              children: [
                /* @__PURE__ */ e(
                  B,
                  {
                    iconName: n.icon,
                    iconImage: n.iconImage,
                    fallbackIcon: R,
                    className: "hb-configured-menu-icon",
                    strokeWidth: 1.8
                  }
                ),
                /* @__PURE__ */ e("span", { children: n.name })
              ]
            }
          ),
          a ? /* @__PURE__ */ r("div", { className: "hb-content-menu", role: "menu", "aria-label": n.name, children: [
            /* @__PURE__ */ e("div", { className: "hb-content-menu-header", children: n.name }),
            /* @__PURE__ */ e("div", { className: "hb-content-menu-list", children: t.items.map((s) => {
              const p = s.type === "url" ? se : R;
              return /* @__PURE__ */ r(
                Q,
                {
                  link: s,
                  role: "menuitem",
                  ariaHasPopup: $(s) ? "dialog" : void 0,
                  onClick: (x) => c(x, s),
                  children: [
                    /* @__PURE__ */ e(p, { size: 15 }),
                    /* @__PURE__ */ e("span", { children: s.name })
                  ]
                },
                s.id
              );
            }) })
          ] }) : null
        ]
      }
    ),
    v
  ] });
}
function qe(n) {
  return n.button === 0 && !n.metaKey && !n.ctrlKey && !n.shiftKey && !n.altKey;
}
const ze = A(
  T(() => import("./workbench-system-message-detail-B5CUbFvZ.js")),
  (n) => n.WorkbenchSystemMessageDetail
), He = ze.Component;
function Ue({
  site: n
}) {
  const t = W(null), [a, i] = f(!1), [l, m] = f(null), o = Ye(a), h = n.homeMenu.messages;
  return N(() => {
    if (!a)
      return;
    const b = (c) => {
      !l && !t.current?.contains(c.target) && i(!1);
    }, u = (c) => {
      c.key === "Escape" && !l && i(!1);
    };
    return document.addEventListener("pointerdown", b), document.addEventListener("keydown", u), () => {
      document.removeEventListener("pointerdown", b), document.removeEventListener("keydown", u);
    };
  }, [a, l]), /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ r("div", { ref: t, className: "hb-system-message-root", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "hb-rail-action",
          title: h.name,
          "aria-label": `打开${h.name}`,
          "aria-expanded": a,
          onClick: () => i((b) => !b),
          children: [
            /* @__PURE__ */ e(
              B,
              {
                iconName: h.icon,
                iconImage: h.iconImage,
                fallbackIcon: ie,
                className: "hb-configured-menu-icon",
                strokeWidth: 1.8
              }
            ),
            /* @__PURE__ */ e("span", { children: h.name })
          ]
        }
      ),
      a ? /* @__PURE__ */ r("aside", { className: "hb-system-message-panel", "aria-label": "消息中心", children: [
        /* @__PURE__ */ r("header", { className: "hb-system-message-header", children: [
          /* @__PURE__ */ e("strong", { children: "消息中心" }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "hb-system-message-icon-button",
              title: "关闭",
              "aria-label": "关闭消息中心",
              onClick: () => i(!1),
              children: /* @__PURE__ */ e(pe, {})
            }
          )
        ] }),
        /* @__PURE__ */ e("div", { className: "hb-system-message-filter", "aria-label": "消息类型", children: /* @__PURE__ */ e("span", { children: "官方消息" }) }),
        /* @__PURE__ */ r("div", { className: "hb-system-message-list", "aria-live": "polite", children: [
          o.loading && o.items.length === 0 ? /* @__PURE__ */ e(Ge, {}) : null,
          !o.loading && o.error ? /* @__PURE__ */ e(
            Ze,
            {
              message: o.error,
              onRetry: o.reload
            }
          ) : null,
          !o.loading && !o.error && o.items.length === 0 ? /* @__PURE__ */ e(Xe, {}) : null,
          o.error ? null : o.items.map((b) => /* @__PURE__ */ e(
            Ve,
            {
              site: n,
              message: b,
              onOpen: () => m(b),
              onNavigate: () => i(!1)
            },
            b.id
          ))
        ] })
      ] }) : null
    ] }),
    l ? /* @__PURE__ */ e(L, { fallback: null, children: /* @__PURE__ */ e(
      He,
      {
        message: l,
        publishedAtLabel: de(
          l.publishedAt
        ),
        onClose: () => m(null)
      }
    ) }) : null
  ] });
}
function Ye(n) {
  const [t, a] = f(0), [i, l] = f([]), [m, o] = f(!1), [h, b] = f("");
  return N(() => {
    if (!n)
      return;
    let u = !0;
    return b(""), o(!0), Ke().then((c) => {
      u && l(c);
    }).catch((c) => {
      u && b(
        c instanceof Error ? c.message : "加载系统消息失败"
      );
    }).finally(() => {
      u && o(!1);
    }), () => {
      u = !1;
    };
  }, [n, t]), {
    items: i,
    loading: m,
    error: h,
    reload: () => a((u) => u + 1)
  };
}
function Ve({
  site: n,
  message: t,
  onOpen: a,
  onNavigate: i
}) {
  const l = /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ e("span", { className: "hb-system-message-mark", "aria-hidden": "true", children: /* @__PURE__ */ e(
      ue,
      {
        site: n,
        className: "hb-system-message-brand",
        logoClassName: "hb-system-message-brand-logo",
        nameClassName: "hb-system-message-brand-name"
      }
    ) }),
    /* @__PURE__ */ r("span", { className: "hb-system-message-copy", children: [
      /* @__PURE__ */ r("span", { className: "hb-system-message-title-row", children: [
        /* @__PURE__ */ e("strong", { children: t.title }),
        t.pinned ? /* @__PURE__ */ e(ge, { "aria-label": "置顶消息" }) : null,
        t.url ? /* @__PURE__ */ e(se, { "aria-hidden": "true" }) : null
      ] }),
      /* @__PURE__ */ e("span", { className: "hb-system-message-content", children: t.content }),
      /* @__PURE__ */ e("time", { dateTime: t.publishedAt, children: Je(t.publishedAt) })
    ] })
  ] });
  return t.url ? /* @__PURE__ */ e(
    "a",
    {
      className: "hb-system-message-row",
      href: t.url,
      target: "_blank",
      rel: "noreferrer noopener",
      onClick: i,
      children: l
    }
  ) : /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "hb-system-message-row",
      "aria-haspopup": "dialog",
      onClick: a,
      children: l
    }
  );
}
function Ge() {
  return /* @__PURE__ */ r("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ e(le, { className: "is-spinning" }),
    /* @__PURE__ */ e("span", { children: "正在加载官方消息" })
  ] });
}
function Xe() {
  return /* @__PURE__ */ r("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ e(ie, {}),
    /* @__PURE__ */ e("span", { children: "暂无官方消息" })
  ] });
}
function Ze({
  message: n,
  onRetry: t
}) {
  return /* @__PURE__ */ r("div", { className: "hb-system-message-state is-error", children: [
    /* @__PURE__ */ e(ye, {}),
    /* @__PURE__ */ e("span", { children: n }),
    /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "hb-system-message-icon-button",
        title: "重新加载",
        "aria-label": "重新加载官方消息",
        onClick: t,
        children: /* @__PURE__ */ e(ce, {})
      }
    )
  ] });
}
function Je(n) {
  const t = new Date(n);
  if (Number.isNaN(t.getTime()))
    return "";
  const a = Math.max(0, Date.now() - t.getTime()), i = Math.floor(a / 6e4);
  if (i < 1)
    return "刚刚";
  if (i < 60)
    return `${i}分钟前`;
  const l = Math.floor(i / 60);
  if (l < 24)
    return `${l}小时前`;
  const m = Math.floor(l / 24);
  return m < 30 ? `${m}天前` : de(n, !1);
}
function de(n, t = !0) {
  const a = new Date(n);
  if (Number.isNaN(a.getTime()))
    return "";
  const i = /* @__PURE__ */ new Date(), l = a.getFullYear() !== i.getFullYear();
  return new Intl.DateTimeFormat("zh-CN", {
    ...l ? { year: "numeric" } : {},
    month: "long",
    day: "numeric",
    ...t ? {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    } : {}
  }).format(a);
}
function ee({
  src: n,
  name: t,
  account: a,
  className: i = ""
}) {
  const [l, m] = f(!1);
  return N(() => {
    m(!1);
  }, [n]), /* @__PURE__ */ e("span", { className: `hb-workbench-avatar ${i}`.trim(), children: n && !l ? /* @__PURE__ */ e(
    "img",
    {
      src: n,
      alt: "",
      loading: "lazy",
      onError: () => m(!0)
    }
  ) : /* @__PURE__ */ e("span", { "aria-hidden": "true", children: Qe(t || a) }) });
}
function Qe(n) {
  return (String(n || "用").trim() || "用").slice(0, 1).toUpperCase();
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/lib/request", "@/stores/auth-store", "@/context/theme-provider"]);
const z = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!z || Object.keys(z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const ne = z.Button, P = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!P || Object.keys(P).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const en = P.Dialog, nn = P.DialogContent, tn = P.DialogDescription, on = P.DialogFooter, an = P.DialogHeader, rn = P.DialogTitle, H = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const sn = H.resetFrontRuntimeCache, U = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const ln = U.useAuthStore, Y = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const cn = Y.useTheme, un = ae(
  () => import("./workbench-profile-dialog-B6wZu3R_.js").then((n) => ({
    default: n.WorkbenchProfileDialog
  }))
);
function dn({
  teams: n,
  teamID: t,
  disabled: a,
  onTeamChange: i
}) {
  const l = ln((g) => g.auth), m = fe(), { resolvedTheme: o, setTheme: h, theme: b } = cn(), u = l.user, c = W(null), v = W(null), [s, p] = f(!1), [x, C] = f(null), [M, S] = f(!1), [O, D] = f(!1), F = n.find((g) => g.id === t), K = Array.isArray(u?.role) && u.role.length > 0 ? u.role.join("、") : "普通用户", w = I(() => {
    v.current !== null && (window.clearTimeout(v.current), v.current = null);
  }, []), d = I(
    (g) => {
      w(), C(g);
    },
    [w]
  ), y = I(() => {
    w(), v.current = window.setTimeout(() => {
      v.current = null, C(null);
    }, 180);
  }, [w]);
  N(() => {
    if (!s) {
      w(), C(null);
      return;
    }
    const g = (_) => {
      c.current?.contains(_.target) || p(!1);
    }, G = (_) => {
      _.key === "Escape" && p(!1);
    };
    return document.addEventListener("pointerdown", g), document.addEventListener("keydown", G), () => {
      w(), document.removeEventListener("pointerdown", g), document.removeEventListener("keydown", G);
    };
  }, [w, s]);
  const k = () => {
    const g = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    D(!1), p(!1), l.reset(), sn(), m({
      to: "/sign-in",
      search: { redirect: g },
      replace: !0
    });
  };
  return /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ r("div", { ref: c, className: "hb-user-menu-root", children: [
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "hb-rail-user",
          "aria-label": "打开用户菜单",
          "aria-expanded": s,
          title: u?.name || u?.account || "用户菜单",
          onClick: () => p((g) => !g),
          children: /* @__PURE__ */ e(
            ee,
            {
              src: u?.avatar,
              name: u?.name,
              account: u?.account
            }
          )
        }
      ),
      s ? /* @__PURE__ */ r("div", { className: "hb-user-menu", role: "menu", children: [
        /* @__PURE__ */ r("div", { className: "hb-user-summary", children: [
          /* @__PURE__ */ e(
            ee,
            {
              src: u?.avatar,
              name: u?.name,
              account: u?.account,
              className: "hb-user-summary-avatar"
            }
          ),
          /* @__PURE__ */ r("span", { children: [
            /* @__PURE__ */ e("strong", { children: u?.name || "未命名用户" }),
            /* @__PURE__ */ e("small", { children: u?.account || "暂无账号信息" })
          ] })
        ] }),
        /* @__PURE__ */ r("div", { className: "hb-user-menu-list", children: [
          /* @__PURE__ */ e(
            te,
            {
              icon: ve,
              label: "个人信息",
              onClick: () => {
                S(!0), p(!1);
              }
            }
          ),
          /* @__PURE__ */ r(
            oe,
            {
              icon: X,
              label: "工作切换",
              detail: F?.name || "暂无工作",
              active: x === "team",
              onActivate: () => d("team"),
              onDeactivate: y,
              children: [
                /* @__PURE__ */ r("div", { className: "hb-user-submenu-head", children: [
                  /* @__PURE__ */ e("strong", { children: "切换工作" }),
                  /* @__PURE__ */ r("span", { children: [
                    n.length,
                    " 个工作"
                  ] })
                ] }),
                /* @__PURE__ */ e("div", { className: "hb-user-team-list", children: n.length === 0 ? /* @__PURE__ */ e("span", { className: "hb-user-team-empty", children: "暂无可用工作" }) : n.map((g) => /* @__PURE__ */ e(
                  j,
                  {
                    icon: X,
                    label: g.name,
                    active: g.id === t,
                    disabled: a,
                    onClick: () => i(g.id)
                  },
                  g.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ r(
            oe,
            {
              icon: o === "dark" ? Z : J,
              label: o === "dark" ? "深色模式" : "浅色模式",
              detail: "切换展示模式",
              active: x === "theme",
              onActivate: () => d("theme"),
              onDeactivate: y,
              children: [
                /* @__PURE__ */ e("div", { className: "hb-user-submenu-head", children: /* @__PURE__ */ e("strong", { children: "展示模式" }) }),
                /* @__PURE__ */ e(
                  j,
                  {
                    icon: J,
                    label: "浅色",
                    active: b === "light",
                    onClick: () => h("light")
                  }
                ),
                /* @__PURE__ */ e(
                  j,
                  {
                    icon: Z,
                    label: "深色",
                    active: b === "dark",
                    onClick: () => h("dark")
                  }
                ),
                /* @__PURE__ */ e(
                  j,
                  {
                    icon: ke,
                    label: "跟随系统",
                    active: b === "system",
                    onClick: () => h("system")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ e(
            te,
            {
              icon: we,
              label: "退出",
              tone: "danger",
              onClick: () => {
                D(!0), p(!1);
              }
            }
          )
        ] })
      ] }) : null
    ] }),
    M ? /* @__PURE__ */ e(L, { fallback: null, children: /* @__PURE__ */ e(
      un,
      {
        open: M,
        roleLabel: K,
        onOpenChange: S,
        onPasswordChanged: k
      }
    ) }) : null,
    /* @__PURE__ */ e(en, { open: O, onOpenChange: D, children: /* @__PURE__ */ r(nn, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ r(an, { children: [
        /* @__PURE__ */ e(rn, { children: "退出登录" }),
        /* @__PURE__ */ e(tn, { children: "确认退出当前账户吗？退出后需要重新登录才能继续访问工作台。" })
      ] }),
      /* @__PURE__ */ r(on, { children: [
        /* @__PURE__ */ e(ne, { variant: "outline", onClick: () => D(!1), children: "取消" }),
        /* @__PURE__ */ e(ne, { variant: "destructive", onClick: k, children: "退出" })
      ] })
    ] }) })
  ] });
}
function te({
  icon: n,
  label: t,
  tone: a,
  onClick: i
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: `hb-user-menu-item ${a === "danger" ? "is-danger" : ""}`,
      role: "menuitem",
      onClick: i,
      children: [
        /* @__PURE__ */ e(n, {}),
        /* @__PURE__ */ e("span", { children: t })
      ]
    }
  );
}
function oe({
  icon: n,
  label: t,
  detail: a,
  active: i,
  onActivate: l,
  onDeactivate: m,
  children: o
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      className: `hb-user-submenu-shell ${i ? "is-active" : ""}`,
      onMouseEnter: l,
      onMouseLeave: m,
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "hb-user-menu-item",
            role: "menuitem",
            onClick: l,
            children: [
              /* @__PURE__ */ e(n, {}),
              /* @__PURE__ */ r("span", { children: [
                t,
                /* @__PURE__ */ e("small", { children: a })
              ] }),
              /* @__PURE__ */ e(Ne, { className: "hb-user-menu-chevron" })
            ]
          }
        ),
        /* @__PURE__ */ e("div", { className: "hb-user-submenu", children: o })
      ]
    }
  );
}
function j({
  icon: n,
  label: t,
  active: a,
  disabled: i = !1,
  onClick: l
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: `hb-submenu-choice ${a ? "is-active" : ""}`,
      disabled: i,
      onClick: l,
      children: [
        /* @__PURE__ */ e(n, {}),
        /* @__PURE__ */ e("span", { children: t }),
        a ? /* @__PURE__ */ e(Ce, { className: "hb-submenu-choice-check" }) : null
      ]
    }
  );
}
const me = A(
  T(() => import("./workbench-account-center-BMY0I8_0.js")),
  (n) => n.WorkbenchAccountCenter
), mn = me.Component;
function hn({
  site: n,
  navigation: t,
  activePage: a,
  teams: i,
  teamID: l,
  loading: m,
  contentNavigation: o,
  onNavigate: h,
  onTeamChange: b
}) {
  const [u, c] = f(!1), v = ["points", "messages", "content"].filter((s) => n.homeMenu[s].enabled).sort(
    (s, p) => n.homeMenu[s].sort - n.homeMenu[p].sort
  );
  return /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ r("aside", { className: "hb-laper-sidebar", "aria-label": "工作台导航", children: [
      /* @__PURE__ */ e("div", { className: "hb-laper-sidebar-head", children: /* @__PURE__ */ r("div", { className: "hb-rail-brand-wrap", children: [
        /* @__PURE__ */ e(
          ue,
          {
            site: n,
            className: "hb-rail-brand",
            logoClassName: "hb-rail-brand-logo",
            nameClassName: "hb-rail-brand-name"
          }
        ),
        /* @__PURE__ */ e("span", { className: "hb-rail-brand-tooltip", role: "tooltip", children: n.siteName })
      ] }) }),
      /* @__PURE__ */ e("nav", { className: "hb-laper-nav", "aria-label": "工作区导航", children: t.map((s) => /* @__PURE__ */ e(
        bn,
        {
          page: s,
          active: a === s.key,
          onClick: () => h(s.key)
        },
        s.key
      )) }),
      /* @__PURE__ */ r("div", { className: "hb-laper-sidebar-foot", children: [
        v.map((s) => s === "points" ? /* @__PURE__ */ e(
          fn,
          {
            iconName: n.homeMenu.points.icon,
            iconImage: n.homeMenu.points.iconImage,
            fallbackIcon: Me,
            label: n.homeMenu.points.name,
            onIntent: me.preload,
            onClick: () => c(!0)
          },
          s
        ) : s === "messages" ? /* @__PURE__ */ e(Ue, { site: n }, s) : /* @__PURE__ */ e(
          $e,
          {
            menu: n.homeMenu.content,
            navigation: o
          },
          s
        )),
        /* @__PURE__ */ e(
          dn,
          {
            teams: i,
            teamID: l,
            disabled: m,
            onTeamChange: b
          }
        )
      ] })
    ] }),
    u ? /* @__PURE__ */ e(L, { fallback: null, children: /* @__PURE__ */ e(
      mn,
      {
        open: u,
        onOpenChange: c
      }
    ) }) : null
  ] });
}
function bn({
  page: n,
  active: t,
  onClick: a
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: `hb-laper-nav-item ${t ? "is-active" : ""}`,
      "aria-current": t ? "page" : void 0,
      title: n.label,
      onClick: a,
      children: [
        /* @__PURE__ */ e(
          B,
          {
            iconName: n.iconName,
            iconImage: n.iconImage,
            fallbackIcon: n.fallbackIcon,
            className: "hb-configured-menu-icon",
            strokeWidth: 1.9
          }
        ),
        /* @__PURE__ */ e("span", { children: n.label })
      ]
    }
  );
}
function fn({
  iconName: n,
  iconImage: t,
  fallbackIcon: a,
  label: i,
  onIntent: l,
  onClick: m
}) {
  const o = je(l);
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "hb-rail-action",
      title: i,
      onPointerEnter: o.schedule,
      onPointerLeave: o.cancel,
      onFocus: o.preloadNow,
      onClick: () => {
        o.preloadNow(), m();
      },
      children: [
        /* @__PURE__ */ e(
          B,
          {
            iconName: n,
            iconImage: t,
            fallbackIcon: a,
            className: "hb-configured-menu-icon",
            strokeWidth: 1.8
          }
        ),
        /* @__PURE__ */ e("span", { children: i })
      ]
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const V = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!V || Object.keys(V).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const pn = V.useTheme, gn = A(
  T(() => import("./project-page-CiMnUPJ1.js")),
  (n) => n.WorkProjectPage
), yn = gn.Component, vn = A(
  T(() => import("./asset-page-APee_q5x.js").then((n) => n.e)),
  (n) => n.WorkbenchAssetPage
), kn = vn.Component, wn = A(
  T(() => import("./dialogue-page-8tavRyR7.js")),
  (n) => n.WorkbenchDialoguePage
), Nn = wn.Component, Cn = A(
  T(() => import("./function-page-dqk438EL.js")),
  (n) => n.WorkbenchFunctionPage
), Mn = Cn.Component, Dn = "bot.body.workbench.team", q = {
  items: []
}, Pn = [
  { key: "works", menuKey: "works", fallbackIcon: De },
  { key: "dialogue", menuKey: "dialogue", fallbackIcon: Pe },
  { key: "function", menuKey: "function", fallbackIcon: Se },
  { key: "assets", menuKey: "assets", fallbackIcon: Ie }
];
function Sn({ item: n }) {
  const t = Ee(), a = We(), { resolvedTheme: i } = pn();
  Be(t.site.appearance, i);
  const [l, m] = f(
    () => Tn(
      typeof n?.value == "string" ? n.value : n?.value?.page
    )
  ), [o, h] = f(null), [b, u] = f(!0), [c, v] = f(""), [s, p] = f(q), [x, C] = f(null), M = W(0), S = I(
    async (d = 0) => {
      const y = ++M.current;
      u(!0), v("");
      try {
        const k = await _e(d, a);
        if (y !== M.current)
          return;
        h(k), C(null), k.team?.id && Wn(a, k.team.id), m((g) => On(g, k));
      } catch (k) {
        if (y !== M.current)
          return;
        v(
          k instanceof Error ? k.message : "加载团队工作区失败"
        );
      } finally {
        y === M.current && u(!1);
      }
    },
    [a]
  );
  N(() => {
    Ae(t.site);
  }, [t.site]), N(() => {
    if (h(null), C(null), !a) {
      M.current += 1, u(!1);
      return;
    }
    S(Fn(a));
  }, [S, a]), N(() => {
    if (!t.site.homeMenu.content.enabled) {
      p(q);
      return;
    }
    let d = !0;
    return Le().then((y) => {
      d && p(y);
    }).catch(() => {
      d && p(q);
    }), () => {
      d = !1;
    };
  }, [t.site.homeMenu.content.enabled]);
  const O = re(
    () => [...Pn].filter((d) => t.site.homeMenu[d.menuKey].enabled).sort(
      (d, y) => t.site.homeMenu[d.menuKey].sort - t.site.homeMenu[y.menuKey].sort
    ).map((d) => {
      const y = t.site.homeMenu[d.menuKey];
      return {
        key: d.key,
        label: y.name,
        iconName: y.icon,
        iconImage: y.iconImage,
        fallbackIcon: d.fallbackIcon
      };
    }).filter(
      (d) => d.key !== "works" || !o || o.projectEnabled
    ),
    [o, t.site.homeMenu]
  ), D = O.find((d) => d.key === l)?.key || O[0]?.key, F = I(
    (d) => d.sourceType === "dialogue" ? !!o?.roles.some((y) => y.id === d.sourceID) : !!o?.powers.some((y) => y.id === d.sourceID),
    [o?.powers, o?.roles]
  ), K = I(
    (d) => {
      F(d) && (C(d), m(d.sourceType === "dialogue" ? "dialogue" : "function"));
    },
    [F]
  ), w = I(() => C(null), []);
  return /* @__PURE__ */ r(
    "main",
    {
      className: "hb-laper-app",
      "data-workbench-template": t.site.appearance.workbenchTemplate,
      "data-page-background": Oe(t.site.appearance, "workbench") ? "custom" : void 0,
      style: Te(t.site.appearance, "workbench"),
      children: [
        /* @__PURE__ */ e(Fe, {}),
        /* @__PURE__ */ e(
          hn,
          {
            site: t.site,
            navigation: O,
            activePage: D || "assets",
            teams: o?.teams || [],
            teamID: o?.team?.id || 0,
            loading: b,
            contentNavigation: s,
            onNavigate: m,
            onTeamChange: (d) => {
              S(d);
            }
          }
        ),
        /* @__PURE__ */ e("section", { className: "hb-laper-main", children: /* @__PURE__ */ e("div", { className: "hb-laper-frame", children: /* @__PURE__ */ e("div", { className: "hb-laper-content", children: b ? /* @__PURE__ */ e(he, {}) : c ? /* @__PURE__ */ e(
          xn,
          {
            message: c,
            onRetry: () => {
              S(o?.team?.id);
            }
          }
        ) : o?.team ? D ? /* @__PURE__ */ e(
          In,
          {
            page: D,
            catalog: o,
            continuationAsset: x,
            onContinueAsset: K,
            canContinueAsset: F,
            onClearContinuation: w
          },
          a
        ) : /* @__PURE__ */ e(An, {}) : /* @__PURE__ */ e(En, {}) }) }) })
      ]
    }
  );
}
function In({
  page: n,
  catalog: t,
  continuationAsset: a,
  onContinueAsset: i,
  canContinueAsset: l,
  onClearContinuation: m
}) {
  const o = t.team?.id || 0, [h, b] = f([n]), u = re(
    () => ({
      tools: t.powers.map((c) => ({
        id: c.id,
        name: c.name
      })),
      dialogues: t.roles.map((c) => ({
        id: c.id,
        name: c.name
      })),
      assetCates: t.assetCates.map((c) => ({
        id: c.id,
        name: c.name,
        kind: c.kind,
        cardinality: c.cardinality
      }))
    }),
    [t.assetCates, t.powers, t.roles]
  );
  return N(() => {
    b(
      (c) => c.includes(n) ? c : [...c, n]
    );
  }, [n]), /* @__PURE__ */ e(L, { fallback: /* @__PURE__ */ e(he, {}), children: /* @__PURE__ */ r("div", { className: "h-full min-h-0", children: [
    n === "function" || h.includes("function") ? /* @__PURE__ */ e("div", { className: n === "function" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ e(
      Mn,
      {
        teamID: o,
        powers: t.powers,
        powerCategories: t.powerCategories,
        continuationAsset: a,
        onClearContinuation: m
      }
    ) }) : null,
    n === "dialogue" || h.includes("dialogue") ? /* @__PURE__ */ e("div", { className: n === "dialogue" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ e(
      Nn,
      {
        teamID: o,
        roles: t.roles,
        powerCategories: t.powerCategories,
        continuationAsset: a,
        onClearContinuation: m
      }
    ) }) : null,
    n === "works" ? /* @__PURE__ */ e("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ e(yn, { teamID: o }, o) }) : null,
    n === "assets" ? /* @__PURE__ */ e(
      kn,
      {
        teamID: o,
        onContinue: i,
        canContinue: l,
        catalogOptions: u
      }
    ) : null
  ] }) });
}
function he() {
  return /* @__PURE__ */ e("div", { className: "flex h-full items-center justify-center text-[var(--body-work-muted)]", children: /* @__PURE__ */ e(le, { className: "size-5 animate-spin" }) });
}
function xn({
  message: n,
  onRetry: t
}) {
  return /* @__PURE__ */ e("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ e("p", { className: "m-0 text-sm text-red-600", children: n }),
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "mx-auto mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface)] px-3 text-sm text-[var(--body-work-text)]",
        onClick: t,
        children: [
          /* @__PURE__ */ e(ce, { className: "size-4" }),
          "重试"
        ]
      }
    )
  ] }) });
}
function En() {
  return /* @__PURE__ */ e("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ e(xe, { className: "mx-auto mb-3 size-6 text-[var(--body-work-muted)]" }),
    /* @__PURE__ */ e("p", { className: "m-0 text-sm font-medium text-[var(--body-work-text)]", children: "暂无已发布团队" })
  ] }) });
}
function An() {
  return /* @__PURE__ */ e("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ e("p", { className: "m-0 text-sm text-[var(--body-work-muted)]", children: "暂无可用功能" }) });
}
function Tn(n) {
  switch (n) {
    case "dialogue":
      return "dialogue";
    case "function":
      return "function";
    case "works":
    case "project":
      return "works";
    case "assets":
      return "assets";
    default:
      return "works";
  }
}
function On(n, t) {
  return n !== "works" || t.projectEnabled ? n : t.roles.length > 0 ? "dialogue" : t.powers.length > 0 ? "function" : "assets";
}
function be(n) {
  return `${Dn}.${n}`;
}
function Fn(n) {
  try {
    return Number(
      window.localStorage.getItem(be(n)) || 0
    );
  } catch {
    return 0;
  }
}
function Wn(n, t) {
  try {
    window.localStorage.setItem(
      be(n),
      String(t)
    );
  } catch {
  }
}
const Yn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkHomeShell: Sn
}, Symbol.toStringTag, { value: "Module" }));
export {
  ee as W,
  Yn as h
};
