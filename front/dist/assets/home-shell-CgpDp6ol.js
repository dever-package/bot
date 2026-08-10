import { j as i, a as n, F as E } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as p, u as R, o as D, S as $, p as ce, b as A, d as le } from "./react-C7Xtl8sB.js";
import { B as H, ai as ue, aj as me, X as ve, ak as Ce, L as de, C as De, R as he, U as Ie, al as Q, am as ee, an as ne, ao as Pe, ap as Se, p as Me, c as Ae, a1 as _e, aq as Te, i as xe, Z as Ee, ar as We, as as Be } from "./vendor-icons-Cc7Kl3It.js";
import { m as fe } from "./theme-provider-vgtP-iBt.js";
import { q as U, s as Y, a as T, c as w, r as y, l as Oe, f as Le, o as je, p as Re } from "./site-config-BVY1isir.js";
import { c as te, a as pe, B as Fe } from "./site-brand-ByNt4_8T.js";
import { u as $e } from "./auth-scope-DtEYh2HY.js";
import { u as Ke } from "./use-body-appearance-BJXSEKAq.js";
import { a as ze } from "./content-api-CpguGUg7.js";
import { C as F, n as qe, f as He, b as Ue } from "./space-add-node-menu-pcpVf0B3.js";
import { a as W, b as B, u as Ve } from "./preloadable-PCKj9Z7v.js";
import { c as Ye, m as G } from "./in-flight-request-DlB1DJg0.js";
import { u as Ge } from "./runtime-entry-CEEPqE_1.js";
import { m as Je } from "./button-CpfaQlDK.js";
import { m as O } from "./dialog-Oss_U0H4.js";
import { m as Ze } from "./project-dialogs-CdThoMTm.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./home-shell-Dk5jHjyJ.css", import.meta.url).href]);
const Xe = ce(
  () => import("./content-article-sheet-_EW0sfqj.js").then((e) => ({
    default: e.BodyContentArticleSheet
  }))
);
function Qe({
  menu: e,
  navigation: t
}) {
  const [a, r] = p(!1), [s, m] = p(0), o = R(null), f = t.items[0];
  if (D(() => {
    if (!a || typeof document > "u")
      return;
    function c(b) {
      o.current?.contains(b.target) || r(!1);
    }
    return document.addEventListener("pointerdown", c), () => {
      document.removeEventListener("pointerdown", c);
    };
  }, [a]), !f)
    return null;
  function h(c) {
    o.current?.contains(c.relatedTarget) || r(!1);
  }
  function u(c) {
    c.key === "Escape" && (c.preventDefault(), r(!1), o.current?.querySelector(".hb-rail-action")?.focus());
  }
  function l(c, b) {
    r(!1), !(!U(b) || !en(c)) && (c.preventDefault(), m(b.articleID));
  }
  const N = s > 0 ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
    Xe,
    {
      articleID: s,
      open: !0,
      onOpenChange: (c) => {
        c || m(0);
      }
    }
  ) }) : null;
  return t.items.length === 1 ? /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ i(
      te,
      {
        link: f,
        className: "hb-rail-action",
        title: e.name,
        ariaHasPopup: U(f) ? "dialog" : void 0,
        onClick: (c) => l(c, f),
        children: [
          /* @__PURE__ */ n(
            F,
            {
              iconName: e.icon,
              iconImage: e.iconImage,
              fallbackIcon: H,
              className: "hb-configured-menu-icon",
              strokeWidth: 1.8
            }
          ),
          /* @__PURE__ */ n("span", { children: e.name })
        ]
      }
    ),
    N
  ] }) : /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ i(
      "div",
      {
        ref: o,
        className: "hb-content-menu-root",
        onMouseEnter: () => r(!0),
        onMouseLeave: () => r(!1),
        onFocusCapture: () => r(!0),
        onBlurCapture: h,
        onKeyDown: u,
        children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "hb-rail-action",
              title: e.name,
              "aria-haspopup": "menu",
              "aria-expanded": a,
              onClick: () => r((c) => !c),
              children: [
                /* @__PURE__ */ n(
                  F,
                  {
                    iconName: e.icon,
                    iconImage: e.iconImage,
                    fallbackIcon: H,
                    className: "hb-configured-menu-icon",
                    strokeWidth: 1.8
                  }
                ),
                /* @__PURE__ */ n("span", { children: e.name })
              ]
            }
          ),
          a ? /* @__PURE__ */ i("div", { className: "hb-content-menu", role: "menu", "aria-label": e.name, children: [
            /* @__PURE__ */ n("div", { className: "hb-content-menu-header", children: e.name }),
            /* @__PURE__ */ n("div", { className: "hb-content-menu-list", children: t.items.map((c) => {
              const b = c.type === "url" ? ue : H;
              return /* @__PURE__ */ i(
                te,
                {
                  link: c,
                  role: "menuitem",
                  ariaHasPopup: U(c) ? "dialog" : void 0,
                  onClick: (_) => l(_, c),
                  children: [
                    /* @__PURE__ */ n(b, { size: 15 }),
                    /* @__PURE__ */ n("span", { children: c.name })
                  ]
                },
                c.id
              );
            }) })
          ] }) : null
        ]
      }
    ),
    N
  ] });
}
function en(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
const J = G.joinSiteApi, Z = G.request, nn = Ye();
function tn(e = 0, t = "") {
  const a = JSON.stringify({ requestScopeKey: t, teamID: e });
  return nn(a, async () => {
    const r = await Z(J("workbench/catalog"), "get", {
      team_id: e || void 0
    }), s = Y(r, "加载团队工作区失败"), m = T(s.teams).map(ae).filter(x), o = ae(s.team), f = o.id ? {
      ...o,
      projectEnabled: !!s.project_enabled
    } : null, h = T(s.power_cates).map(qe).filter(x), u = T(s.powers).map(on).filter(x);
    return {
      teams: m,
      team: f,
      releaseID: w(s.release?.id),
      workspaceBodyID: w(s.workspace?.body_id),
      projectEnabled: !!s.project_enabled,
      powers: He(
        Ue(u, h, (l) => l.cateID)
      ),
      powerCategories: h,
      roles: T(s.roles).map(sn).filter(x),
      assetCates: T(s.asset_cates).map(rn).filter(x)
    };
  });
}
async function an(e = 20) {
  const t = await Z(J("system_message/list"), "get", {
    limit: e
  }), a = Y(t, "加载系统消息失败");
  return T(a.items).map(cn).filter(x);
}
function be(e) {
  return J(`workbench/${e}`);
}
function gt(e, t) {
  const a = new URLSearchParams({ team_id: String(t.teamID) });
  t.roleID && a.set("role_id", String(t.roleID));
  const r = be(e);
  return `${r}${r.includes("?") ? "&" : "?"}${a.toString()}`;
}
async function yt(e) {
  return ge("chat_save_asset", {
    team_id: e.teamID,
    role_id: e.roleID,
    message_id: e.messageID,
    artifact_id: e.artifactID || void 0,
    document_id: e.documentID || void 0,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function kt(e) {
  return ge("power_save_asset", {
    team_id: e.teamID,
    team_power_id: e.teamPowerID,
    request_id: e.requestID,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function ge(e, t) {
  const a = await Z(be(e), "post", t), r = Y(a, "保存资产失败"), s = w(r.asset?.id);
  if (!s)
    throw new Error("保存资产结果为空");
  return s;
}
function ae(e) {
  return {
    id: w(e?.id),
    name: y(e?.name) || "未命名团队",
    description: y(e?.description),
    projectEnabled: ln(e?.project_enabled)
  };
}
function on(e) {
  return {
    id: w(e?.id),
    powerID: w(e?.power_id),
    cateID: w(e?.cate_id),
    name: y(e?.name || e?.key) || "未命名能力",
    key: y(e?.key),
    icon: y(e?.icon),
    kind: y(e?.kind),
    outputType: y(e?.output_type || e?.output)
  };
}
function sn(e) {
  return {
    id: w(e?.id),
    name: y(e?.name) || "未命名角色",
    roleType: y(e?.role_type),
    assignment: y(e?.assignment),
    agentID: w(e?.agent_id),
    agentKey: y(e?.agent_key),
    agentName: y(e?.agent_name),
    openingEnabled: !!e?.opening_enabled
  };
}
function rn(e) {
  return {
    id: w(e?.id),
    name: y(e?.name) || "未命名分类",
    kind: y(e?.kind) || "text",
    cardinality: y(e?.cardinality) || "single"
  };
}
function cn(e) {
  return {
    id: w(e?.id),
    title: y(e?.title) || "系统消息",
    content: y(e?.content),
    url: y(e?.url),
    pinned: !!e?.pinned,
    publishedAt: y(e?.published_at)
  };
}
function x(e) {
  return e.id > 0;
}
function ln(e) {
  return e !== !1 && Number(e || 1) !== 2;
}
const un = W(
  B(() => import("./workbench-system-message-detail-CNNslIiQ.js")),
  (e) => e.WorkbenchSystemMessageDetail
), mn = un.Component;
function dn({
  site: e
}) {
  const t = R(null), [a, r] = p(!1), [s, m] = p(null), o = hn(a), f = e.homeMenu.messages;
  return D(() => {
    if (!a)
      return;
    const h = (l) => {
      !s && !t.current?.contains(l.target) && r(!1);
    }, u = (l) => {
      l.key === "Escape" && !s && r(!1);
    };
    return document.addEventListener("pointerdown", h), document.addEventListener("keydown", u), () => {
      document.removeEventListener("pointerdown", h), document.removeEventListener("keydown", u);
    };
  }, [a, s]), /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ i("div", { ref: t, className: "hb-system-message-root", children: [
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "hb-rail-action",
          title: f.name,
          "aria-label": `打开${f.name}`,
          "aria-expanded": a,
          onClick: () => r((h) => !h),
          children: [
            /* @__PURE__ */ n(
              F,
              {
                iconName: f.icon,
                iconImage: f.iconImage,
                fallbackIcon: me,
                className: "hb-configured-menu-icon",
                strokeWidth: 1.8
              }
            ),
            /* @__PURE__ */ n("span", { children: f.name })
          ]
        }
      ),
      a ? /* @__PURE__ */ i("aside", { className: "hb-system-message-panel", "aria-label": "消息中心", children: [
        /* @__PURE__ */ i("header", { className: "hb-system-message-header", children: [
          /* @__PURE__ */ n("strong", { children: "消息中心" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "hb-system-message-icon-button",
              title: "关闭",
              "aria-label": "关闭消息中心",
              onClick: () => r(!1),
              children: /* @__PURE__ */ n(ve, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "hb-system-message-filter", "aria-label": "消息类型", children: /* @__PURE__ */ n("span", { children: "官方消息" }) }),
        /* @__PURE__ */ i("div", { className: "hb-system-message-list", "aria-live": "polite", children: [
          o.loading && o.items.length === 0 ? /* @__PURE__ */ n(pn, {}) : null,
          !o.loading && o.error ? /* @__PURE__ */ n(
            gn,
            {
              message: o.error,
              onRetry: o.reload
            }
          ) : null,
          !o.loading && !o.error && o.items.length === 0 ? /* @__PURE__ */ n(bn, {}) : null,
          o.error ? null : o.items.map((h) => /* @__PURE__ */ n(
            fn,
            {
              site: e,
              message: h,
              onOpen: () => m(h),
              onNavigate: () => r(!1)
            },
            h.id
          ))
        ] })
      ] }) : null
    ] }),
    s ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      mn,
      {
        message: s,
        publishedAtLabel: ye(
          s.publishedAt
        ),
        onClose: () => m(null)
      }
    ) }) : null
  ] });
}
function hn(e) {
  const [t, a] = p(0), [r, s] = p([]), [m, o] = p(!1), [f, h] = p("");
  return D(() => {
    if (!e)
      return;
    let u = !0;
    return h(""), o(!0), an().then((l) => {
      u && s(l);
    }).catch((l) => {
      u && h(
        l instanceof Error ? l.message : "加载系统消息失败"
      );
    }).finally(() => {
      u && o(!1);
    }), () => {
      u = !1;
    };
  }, [e, t]), {
    items: r,
    loading: m,
    error: f,
    reload: () => a((u) => u + 1)
  };
}
function fn({
  site: e,
  message: t,
  onOpen: a,
  onNavigate: r
}) {
  const s = /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ n("span", { className: "hb-system-message-mark", "aria-hidden": "true", children: /* @__PURE__ */ n(
      pe,
      {
        site: e,
        className: "hb-system-message-brand",
        logoClassName: "hb-system-message-brand-logo",
        nameClassName: "hb-system-message-brand-name"
      }
    ) }),
    /* @__PURE__ */ i("span", { className: "hb-system-message-copy", children: [
      /* @__PURE__ */ i("span", { className: "hb-system-message-title-row", children: [
        /* @__PURE__ */ n("strong", { children: t.title }),
        t.pinned ? /* @__PURE__ */ n(Ce, { "aria-label": "置顶消息" }) : null,
        t.url ? /* @__PURE__ */ n(ue, { "aria-hidden": "true" }) : null
      ] }),
      /* @__PURE__ */ n("span", { className: "hb-system-message-content", children: t.content }),
      /* @__PURE__ */ n("time", { dateTime: t.publishedAt, children: yn(t.publishedAt) })
    ] })
  ] });
  return t.url ? /* @__PURE__ */ n(
    "a",
    {
      className: "hb-system-message-row",
      href: t.url,
      target: "_blank",
      rel: "noreferrer noopener",
      onClick: r,
      children: s
    }
  ) : /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: "hb-system-message-row",
      "aria-haspopup": "dialog",
      onClick: a,
      children: s
    }
  );
}
function pn() {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ n(de, { className: "is-spinning" }),
    /* @__PURE__ */ n("span", { children: "正在加载官方消息" })
  ] });
}
function bn() {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ n(me, {}),
    /* @__PURE__ */ n("span", { children: "暂无官方消息" })
  ] });
}
function gn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state is-error", children: [
    /* @__PURE__ */ n(De, {}),
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "hb-system-message-icon-button",
        title: "重新加载",
        "aria-label": "重新加载官方消息",
        onClick: t,
        children: /* @__PURE__ */ n(he, {})
      }
    )
  ] });
}
function yn(e) {
  const t = new Date(e);
  if (Number.isNaN(t.getTime()))
    return "";
  const a = Math.max(0, Date.now() - t.getTime()), r = Math.floor(a / 6e4);
  if (r < 1)
    return "刚刚";
  if (r < 60)
    return `${r}分钟前`;
  const s = Math.floor(r / 60);
  if (s < 24)
    return `${s}小时前`;
  const m = Math.floor(s / 24);
  return m < 30 ? `${m}天前` : ye(e, !1);
}
function ye(e, t = !0) {
  const a = new Date(e);
  if (Number.isNaN(a.getTime()))
    return "";
  const r = /* @__PURE__ */ new Date(), s = a.getFullYear() !== r.getFullYear();
  return new Intl.DateTimeFormat("zh-CN", {
    ...s ? { year: "numeric" } : {},
    month: "long",
    day: "numeric",
    ...t ? {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    } : {}
  }).format(a);
}
function oe({
  src: e,
  name: t,
  account: a,
  className: r = ""
}) {
  const [s, m] = p(!1);
  return D(() => {
    m(!1);
  }, [e]), /* @__PURE__ */ n("span", { className: `hb-workbench-avatar ${r}`.trim(), children: e && !s ? /* @__PURE__ */ n(
    "img",
    {
      src: e,
      alt: "",
      loading: "lazy",
      onError: () => m(!0)
    }
  ) : /* @__PURE__ */ n("span", { "aria-hidden": "true", children: kn(t || a) }) });
}
function kn(e) {
  return (String(e || "用").trim() || "用").slice(0, 1).toUpperCase();
}
const se = Je.Button, Nn = O.Dialog, wn = O.DialogContent, vn = O.DialogDescription, Cn = O.DialogFooter, Dn = O.DialogHeader, In = O.DialogTitle, Pn = G.resetFrontRuntimeCache, Sn = Ze.useAuthStore, Mn = fe.useTheme, An = ce(
  () => import("./workbench-profile-dialog-BtbFcnm9.js").then((e) => ({
    default: e.WorkbenchProfileDialog
  }))
);
function _n({
  teams: e,
  teamID: t,
  disabled: a,
  onTeamChange: r
}) {
  const s = Sn((g) => g.auth), m = Ge(), { resolvedTheme: o, setTheme: f, theme: h } = Mn(), u = s.user, l = R(null), N = R(null), [c, b] = p(!1), [_, I] = p(null), [P, M] = p(!1), [L, S] = p(!1), j = e.find((g) => g.id === t), z = Array.isArray(u?.role) && u.role.length > 0 ? u.role.join("、") : "普通用户", C = A(() => {
    N.current !== null && (window.clearTimeout(N.current), N.current = null);
  }, []), d = A(
    (g) => {
      C(), I(g);
    },
    [C]
  ), k = A(() => {
    C(), N.current = window.setTimeout(() => {
      N.current = null, I(null);
    }, 180);
  }, [C]);
  D(() => {
    if (!c) {
      C(), I(null);
      return;
    }
    const g = (q) => {
      l.current?.contains(q.target) || b(!1);
    }, X = (q) => {
      q.key === "Escape" && b(!1);
    };
    return document.addEventListener("pointerdown", g), document.addEventListener("keydown", X), () => {
      C(), document.removeEventListener("pointerdown", g), document.removeEventListener("keydown", X);
    };
  }, [C, c]);
  const v = () => {
    const g = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    S(!1), b(!1), s.reset(), Pn(), m({
      to: "/sign-in",
      search: { redirect: g },
      replace: !0
    });
  };
  return /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ i("div", { ref: l, className: "hb-user-menu-root", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "hb-rail-user",
          "aria-label": "打开用户菜单",
          "aria-expanded": c,
          title: u?.name || u?.account || "用户菜单",
          onClick: () => b((g) => !g),
          children: /* @__PURE__ */ n(
            oe,
            {
              src: u?.avatar,
              name: u?.name,
              account: u?.account
            }
          )
        }
      ),
      c ? /* @__PURE__ */ i("div", { className: "hb-user-menu", role: "menu", children: [
        /* @__PURE__ */ i("div", { className: "hb-user-summary", children: [
          /* @__PURE__ */ n(
            oe,
            {
              src: u?.avatar,
              name: u?.name,
              account: u?.account,
              className: "hb-user-summary-avatar"
            }
          ),
          /* @__PURE__ */ i("span", { children: [
            /* @__PURE__ */ n("strong", { children: u?.name || "未命名用户" }),
            /* @__PURE__ */ n("small", { children: u?.account || "暂无账号信息" })
          ] })
        ] }),
        /* @__PURE__ */ i("div", { className: "hb-user-menu-list", children: [
          /* @__PURE__ */ n(
            re,
            {
              icon: Ie,
              label: "个人信息",
              onClick: () => {
                M(!0), b(!1);
              }
            }
          ),
          /* @__PURE__ */ i(
            ie,
            {
              icon: Q,
              label: "工作切换",
              detail: j?.name || "暂无工作",
              active: _ === "team",
              onActivate: () => d("team"),
              onDeactivate: k,
              children: [
                /* @__PURE__ */ i("div", { className: "hb-user-submenu-head", children: [
                  /* @__PURE__ */ n("strong", { children: "切换工作" }),
                  /* @__PURE__ */ i("span", { children: [
                    e.length,
                    " 个工作"
                  ] })
                ] }),
                /* @__PURE__ */ n("div", { className: "hb-user-team-list", children: e.length === 0 ? /* @__PURE__ */ n("span", { className: "hb-user-team-empty", children: "暂无可用工作" }) : e.map((g) => /* @__PURE__ */ n(
                  K,
                  {
                    icon: Q,
                    label: g.name,
                    active: g.id === t,
                    disabled: a,
                    onClick: () => r(g.id)
                  },
                  g.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ i(
            ie,
            {
              icon: o === "dark" ? ee : ne,
              label: o === "dark" ? "深色模式" : "浅色模式",
              detail: "切换展示模式",
              active: _ === "theme",
              onActivate: () => d("theme"),
              onDeactivate: k,
              children: [
                /* @__PURE__ */ n("div", { className: "hb-user-submenu-head", children: /* @__PURE__ */ n("strong", { children: "展示模式" }) }),
                /* @__PURE__ */ n(
                  K,
                  {
                    icon: ne,
                    label: "浅色",
                    active: h === "light",
                    onClick: () => f("light")
                  }
                ),
                /* @__PURE__ */ n(
                  K,
                  {
                    icon: ee,
                    label: "深色",
                    active: h === "dark",
                    onClick: () => f("dark")
                  }
                ),
                /* @__PURE__ */ n(
                  K,
                  {
                    icon: Pe,
                    label: "跟随系统",
                    active: h === "system",
                    onClick: () => f("system")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ n(
            re,
            {
              icon: Se,
              label: "退出",
              tone: "danger",
              onClick: () => {
                S(!0), b(!1);
              }
            }
          )
        ] })
      ] }) : null
    ] }),
    P ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      An,
      {
        open: P,
        roleLabel: z,
        onOpenChange: M,
        onPasswordChanged: v
      }
    ) }) : null,
    /* @__PURE__ */ n(Nn, { open: L, onOpenChange: S, children: /* @__PURE__ */ i(wn, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ i(Dn, { children: [
        /* @__PURE__ */ n(In, { children: "退出登录" }),
        /* @__PURE__ */ n(vn, { children: "确认退出当前账户吗？退出后需要重新登录才能继续访问工作台。" })
      ] }),
      /* @__PURE__ */ i(Cn, { children: [
        /* @__PURE__ */ n(se, { variant: "outline", onClick: () => S(!1), children: "取消" }),
        /* @__PURE__ */ n(se, { variant: "destructive", onClick: v, children: "退出" })
      ] })
    ] }) })
  ] });
}
function re({
  icon: e,
  label: t,
  tone: a,
  onClick: r
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-user-menu-item ${a === "danger" ? "is-danger" : ""}`,
      role: "menuitem",
      onClick: r,
      children: [
        /* @__PURE__ */ n(e, {}),
        /* @__PURE__ */ n("span", { children: t })
      ]
    }
  );
}
function ie({
  icon: e,
  label: t,
  detail: a,
  active: r,
  onActivate: s,
  onDeactivate: m,
  children: o
}) {
  return /* @__PURE__ */ i(
    "div",
    {
      className: `hb-user-submenu-shell ${r ? "is-active" : ""}`,
      onMouseEnter: s,
      onMouseLeave: m,
      children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "hb-user-menu-item",
            role: "menuitem",
            onClick: s,
            children: [
              /* @__PURE__ */ n(e, {}),
              /* @__PURE__ */ i("span", { children: [
                t,
                /* @__PURE__ */ n("small", { children: a })
              ] }),
              /* @__PURE__ */ n(Me, { className: "hb-user-menu-chevron" })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "hb-user-submenu", children: o })
      ]
    }
  );
}
function K({
  icon: e,
  label: t,
  active: a,
  disabled: r = !1,
  onClick: s
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-submenu-choice ${a ? "is-active" : ""}`,
      disabled: r,
      onClick: s,
      children: [
        /* @__PURE__ */ n(e, {}),
        /* @__PURE__ */ n("span", { children: t }),
        a ? /* @__PURE__ */ n(Ae, { className: "hb-submenu-choice-check" }) : null
      ]
    }
  );
}
const ke = W(
  B(() => import("./workbench-account-center-D_WnJ0Ov.js")),
  (e) => e.WorkbenchAccountCenter
), Tn = ke.Component;
function xn({
  site: e,
  navigation: t,
  activePage: a,
  teams: r,
  teamID: s,
  loading: m,
  contentNavigation: o,
  onNavigate: f,
  onTeamChange: h
}) {
  const [u, l] = p(!1), N = ["points", "messages", "content"].filter((c) => e.homeMenu[c].enabled).sort(
    (c, b) => e.homeMenu[c].sort - e.homeMenu[b].sort
  );
  return /* @__PURE__ */ i(E, { children: [
    /* @__PURE__ */ i("aside", { className: "hb-laper-sidebar", "aria-label": "工作台导航", children: [
      /* @__PURE__ */ n("div", { className: "hb-laper-sidebar-head", children: /* @__PURE__ */ i("div", { className: "hb-rail-brand-wrap", children: [
        /* @__PURE__ */ n(
          pe,
          {
            site: e,
            className: "hb-rail-brand",
            logoClassName: "hb-rail-brand-logo",
            nameClassName: "hb-rail-brand-name"
          }
        ),
        /* @__PURE__ */ n("span", { className: "hb-rail-brand-tooltip", role: "tooltip", children: e.siteName })
      ] }) }),
      /* @__PURE__ */ n("nav", { className: "hb-laper-nav", "aria-label": "工作区导航", children: t.map((c) => /* @__PURE__ */ n(
        En,
        {
          page: c,
          active: a === c.key,
          onClick: () => f(c.key)
        },
        c.key
      )) }),
      /* @__PURE__ */ i("div", { className: "hb-laper-sidebar-foot", children: [
        N.map((c) => c === "points" ? /* @__PURE__ */ n(
          Wn,
          {
            iconName: e.homeMenu.points.icon,
            iconImage: e.homeMenu.points.iconImage,
            fallbackIcon: _e,
            label: e.homeMenu.points.name,
            onIntent: ke.preload,
            onClick: () => l(!0)
          },
          c
        ) : c === "messages" ? /* @__PURE__ */ n(dn, { site: e }, c) : /* @__PURE__ */ n(
          Qe,
          {
            menu: e.homeMenu.content,
            navigation: o
          },
          c
        )),
        /* @__PURE__ */ n(
          _n,
          {
            teams: r,
            teamID: s,
            disabled: m,
            onTeamChange: h
          }
        )
      ] })
    ] }),
    u ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      Tn,
      {
        open: u,
        onOpenChange: l
      }
    ) }) : null
  ] });
}
function En({
  page: e,
  active: t,
  onClick: a
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-laper-nav-item ${t ? "is-active" : ""}`,
      "aria-current": t ? "page" : void 0,
      title: e.label,
      onClick: a,
      children: [
        /* @__PURE__ */ n(
          F,
          {
            iconName: e.iconName,
            iconImage: e.iconImage,
            fallbackIcon: e.fallbackIcon,
            className: "hb-configured-menu-icon",
            strokeWidth: 1.9
          }
        ),
        /* @__PURE__ */ n("span", { children: e.label })
      ]
    }
  );
}
function Wn({
  iconName: e,
  iconImage: t,
  fallbackIcon: a,
  label: r,
  onIntent: s,
  onClick: m
}) {
  const o = Ve(s);
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: "hb-rail-action",
      title: r,
      onPointerEnter: o.schedule,
      onPointerLeave: o.cancel,
      onFocus: o.preloadNow,
      onClick: () => {
        o.preloadNow(), m();
      },
      children: [
        /* @__PURE__ */ n(
          F,
          {
            iconName: e,
            iconImage: t,
            fallbackIcon: a,
            className: "hb-configured-menu-icon",
            strokeWidth: 1.8
          }
        ),
        /* @__PURE__ */ n("span", { children: r })
      ]
    }
  );
}
const Bn = fe.useTheme, On = W(
  B(() => import("./project-page-B9yp10Mj.js")),
  (e) => e.WorkProjectPage
), Ln = On.Component, jn = W(
  B(() => import("./asset-page-PUYGD6nC.js").then((e) => e.c)),
  (e) => e.WorkbenchAssetPage
), Rn = jn.Component, Fn = W(
  B(() => import("./dialogue-page-Do2ewI4P.js")),
  (e) => e.WorkbenchDialoguePage
), $n = Fn.Component, Kn = W(
  B(() => import("./function-page-kxpDOqfp.js")),
  (e) => e.WorkbenchFunctionPage
), zn = Kn.Component, qn = "bot.body.workbench.team", V = {
  items: []
}, Hn = [
  { key: "works", menuKey: "works", fallbackIcon: Te },
  { key: "dialogue", menuKey: "dialogue", fallbackIcon: xe },
  { key: "function", menuKey: "function", fallbackIcon: Ee },
  { key: "assets", menuKey: "assets", fallbackIcon: We }
];
function Un({ item: e }) {
  const t = Oe(), a = $e(), { resolvedTheme: r } = Bn();
  Ke(t.site.appearance, r);
  const [s, m] = p(
    () => Zn(
      typeof e?.value == "string" ? e.value : e?.value?.page
    )
  ), [o, f] = p(null), [h, u] = p(!0), [l, N] = p(""), [c, b] = p(V), [_, I] = p(null), P = R(0), M = A(
    async (d = 0) => {
      const k = ++P.current;
      u(!0), N("");
      try {
        const v = await tn(d, a);
        if (k !== P.current)
          return;
        f(v), I(null), v.team?.id && et(a, v.team.id), m((g) => Xn(g, v));
      } catch (v) {
        if (k !== P.current)
          return;
        N(
          v instanceof Error ? v.message : "加载团队工作区失败"
        );
      } finally {
        k === P.current && u(!1);
      }
    },
    [a]
  );
  D(() => {
    Le(t.site);
  }, [t.site]), D(() => {
    if (f(null), I(null), !a) {
      P.current += 1, u(!1);
      return;
    }
    M(Qn(a));
  }, [M, a]), D(() => {
    if (!t.site.homeMenu.content.enabled) {
      b(V);
      return;
    }
    let d = !0;
    return ze().then((k) => {
      d && b(k);
    }).catch(() => {
      d && b(V);
    }), () => {
      d = !1;
    };
  }, [t.site.homeMenu.content.enabled]);
  const L = le(
    () => [...Hn].filter((d) => t.site.homeMenu[d.menuKey].enabled).sort(
      (d, k) => t.site.homeMenu[d.menuKey].sort - t.site.homeMenu[k.menuKey].sort
    ).map((d) => {
      const k = t.site.homeMenu[d.menuKey];
      return {
        key: d.key,
        label: k.name,
        iconName: k.icon,
        iconImage: k.iconImage,
        fallbackIcon: d.fallbackIcon
      };
    }).filter(
      (d) => d.key !== "works" || !o || o.projectEnabled
    ),
    [o, t.site.homeMenu]
  ), S = L.find((d) => d.key === s)?.key || L[0]?.key, j = A(
    (d) => d.sourceType === "dialogue" ? !!o?.roles.some((k) => k.id === d.sourceID) : !!o?.powers.some((k) => k.id === d.sourceID),
    [o?.powers, o?.roles]
  ), z = A(
    (d) => {
      j(d) && (I(d), m(d.sourceType === "dialogue" ? "dialogue" : "function"));
    },
    [j]
  ), C = A(() => I(null), []);
  return /* @__PURE__ */ i(
    "main",
    {
      className: "hb-laper-app",
      "data-workbench-template": t.site.appearance.workbenchTemplate,
      "data-page-background": Re(t.site.appearance, "workbench") ? "custom" : void 0,
      style: je(t.site.appearance, "workbench"),
      children: [
        /* @__PURE__ */ n(Fe, {}),
        /* @__PURE__ */ n(
          xn,
          {
            site: t.site,
            navigation: L,
            activePage: S || "assets",
            teams: o?.teams || [],
            teamID: o?.team?.id || 0,
            loading: h,
            contentNavigation: c,
            onNavigate: m,
            onTeamChange: (d) => {
              M(d);
            }
          }
        ),
        /* @__PURE__ */ n("section", { className: "hb-laper-main", children: /* @__PURE__ */ n("div", { className: "hb-laper-frame", children: /* @__PURE__ */ n("div", { className: "hb-laper-content", children: h ? /* @__PURE__ */ n(Ne, {}) : l ? /* @__PURE__ */ n(
          Yn,
          {
            message: l,
            onRetry: () => {
              M(o?.team?.id);
            }
          }
        ) : o?.team ? S ? /* @__PURE__ */ n(
          Vn,
          {
            page: S,
            catalog: o,
            continuationAsset: _,
            onContinueAsset: z,
            canContinueAsset: j,
            onClearContinuation: C
          },
          a
        ) : /* @__PURE__ */ n(Jn, {}) : /* @__PURE__ */ n(Gn, {}) }) }) })
      ]
    }
  );
}
function Vn({
  page: e,
  catalog: t,
  continuationAsset: a,
  onContinueAsset: r,
  canContinueAsset: s,
  onClearContinuation: m
}) {
  const o = t.team?.id || 0, [f, h] = p([e]), u = le(
    () => ({
      tools: t.powers.map((l) => ({
        id: l.id,
        name: l.name
      })),
      dialogues: t.roles.map((l) => ({
        id: l.id,
        name: l.name
      })),
      assetCates: t.assetCates.map((l) => ({
        id: l.id,
        name: l.name,
        kind: l.kind,
        cardinality: l.cardinality
      }))
    }),
    [t.assetCates, t.powers, t.roles]
  );
  return D(() => {
    h(
      (l) => l.includes(e) ? l : [...l, e]
    );
  }, [e]), /* @__PURE__ */ n($, { fallback: /* @__PURE__ */ n(Ne, {}), children: /* @__PURE__ */ i("div", { className: "h-full min-h-0", children: [
    e === "function" || f.includes("function") ? /* @__PURE__ */ n("div", { className: e === "function" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ n(
      zn,
      {
        teamID: o,
        powers: t.powers,
        powerCategories: t.powerCategories,
        continuationAsset: a,
        onClearContinuation: m
      }
    ) }) : null,
    e === "dialogue" || f.includes("dialogue") ? /* @__PURE__ */ n("div", { className: e === "dialogue" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ n(
      $n,
      {
        teamID: o,
        roles: t.roles,
        continuationAsset: a,
        onClearContinuation: m
      }
    ) }) : null,
    e === "works" ? /* @__PURE__ */ n("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ n(Ln, { teamID: o }, o) }) : null,
    e === "assets" ? /* @__PURE__ */ n(
      Rn,
      {
        teamID: o,
        onContinue: r,
        canContinue: s,
        catalogOptions: u
      }
    ) : null
  ] }) });
}
function Ne() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center text-[var(--body-work-muted)]", children: /* @__PURE__ */ n(de, { className: "size-5 animate-spin" }) });
}
function Yn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ n("p", { className: "m-0 text-sm text-red-600", children: e }),
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "mx-auto mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface)] px-3 text-sm text-[var(--body-work-text)]",
        onClick: t,
        children: [
          /* @__PURE__ */ n(he, { className: "size-4" }),
          "重试"
        ]
      }
    )
  ] }) });
}
function Gn() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ n(Be, { className: "mx-auto mb-3 size-6 text-[var(--body-work-muted)]" }),
    /* @__PURE__ */ n("p", { className: "m-0 text-sm font-medium text-[var(--body-work-text)]", children: "暂无已发布团队" })
  ] }) });
}
function Jn() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ n("p", { className: "m-0 text-sm text-[var(--body-work-muted)]", children: "暂无可用功能" }) });
}
function Zn(e) {
  switch (e) {
    case "dialogue":
      return "dialogue";
    case "works":
    case "project":
      return "works";
    case "assets":
      return "assets";
    default:
      return "works";
  }
}
function Xn(e, t) {
  return e !== "works" || t.projectEnabled ? e : t.roles.length > 0 ? "dialogue" : t.powers.length > 0 ? "function" : "assets";
}
function we(e) {
  return `${qn}.${e}`;
}
function Qn(e) {
  try {
    return Number(
      window.localStorage.getItem(we(e)) || 0
    );
  } catch {
    return 0;
  }
}
function et(e, t) {
  try {
    window.localStorage.setItem(
      we(e),
      String(t)
    );
  } catch {
  }
}
const Nt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkHomeShell: Un
}, Symbol.toStringTag, { value: "Module" }));
export {
  oe as W,
  gt as a,
  kt as b,
  Nt as h,
  yt as s,
  be as w
};
