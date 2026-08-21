import { a as i, j as n, F as O, r as Ee, i as Ae, b as F, c as W, u as xe } from "./preloadable-Bomi5PEU.js";
import { a as f, d as L, b as D, S as $, l as be, e as x, u as ge } from "./_commonjsHelpers-61wyk6v6.js";
import { B as Y, aD as ye, b3 as ke, X as Te, b4 as Oe, L as we, m as Fe, R as ve, s as We, b5 as ie, aX as le, aW as ce, b6 as Be, b7 as je, d as Le, o as Re, a8 as $e, b8 as qe, w as Ke, Z as ze, b1 as Ue, b9 as He } from "./vendor-icons-B3DKX3la.js";
import { t as X, s as q, a as P, d as w, r as y, q as Ve, f as Ye, m as Xe, o as Ge } from "./site-config-C63CM9jT.js";
import { c as ue, a as Ce, B as Je } from "./site-brand-B-xUrz3O.js";
import { u as Ze } from "./project-dialogs-BNviIblA.js";
import { u as Qe } from "./use-body-appearance-RBVqJFik.js";
import { a as en } from "./content-api-DLuAZmij.js";
import { C as R, n as nn, g as tn, b as on } from "./power-icon-HeeWAKmZ.js";
import { b as oe } from "./file-kind-UfTAlHnR.js";
import { a as an } from "./react-CHwuTySH.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./home-shell-BpJUEpXC.css", import.meta.url).href]);
const rn = be(
  () => import("./content-article-sheet-BtIxfF5n.js").then((e) => ({
    default: e.BodyContentArticleSheet
  }))
);
function sn({
  menu: e,
  navigation: t
}) {
  const [o, a] = f(!1), [r, d] = f(0), s = L(null), m = t.items[0];
  if (D(() => {
    if (!o || typeof document > "u")
      return;
    function l(b) {
      s.current?.contains(b.target) || a(!1);
    }
    return document.addEventListener("pointerdown", l), () => {
      document.removeEventListener("pointerdown", l);
    };
  }, [o]), !m)
    return null;
  function p(l) {
    s.current?.contains(l.relatedTarget) || a(!1);
  }
  function u(l) {
    l.key === "Escape" && (l.preventDefault(), a(!1), s.current?.querySelector(".hb-rail-action")?.focus());
  }
  function c(l, b) {
    a(!1), !(!X(b) || !ln(l)) && (l.preventDefault(), d(b.articleID));
  }
  const v = r > 0 ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
    rn,
    {
      articleID: r,
      open: !0,
      onOpenChange: (l) => {
        l || d(0);
      }
    }
  ) }) : null;
  return t.items.length === 1 ? /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ i(
      ue,
      {
        link: m,
        className: "hb-rail-action",
        title: e.name,
        ariaHasPopup: X(m) ? "dialog" : void 0,
        onClick: (l) => c(l, m),
        children: [
          /* @__PURE__ */ n(
            R,
            {
              iconName: e.icon,
              iconImage: e.iconImage,
              fallbackIcon: Y,
              className: "hb-configured-menu-icon",
              strokeWidth: 1.8
            }
          ),
          /* @__PURE__ */ n("span", { children: e.name })
        ]
      }
    ),
    v
  ] }) : /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ i(
      "div",
      {
        ref: s,
        className: "hb-content-menu-root",
        onMouseEnter: () => a(!0),
        onMouseLeave: () => a(!1),
        onFocusCapture: () => a(!0),
        onBlurCapture: p,
        onKeyDown: u,
        children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "hb-rail-action",
              title: e.name,
              "aria-haspopup": "menu",
              "aria-expanded": o,
              onClick: () => a((l) => !l),
              children: [
                /* @__PURE__ */ n(
                  R,
                  {
                    iconName: e.icon,
                    iconImage: e.iconImage,
                    fallbackIcon: Y,
                    className: "hb-configured-menu-icon",
                    strokeWidth: 1.8
                  }
                ),
                /* @__PURE__ */ n("span", { children: e.name })
              ]
            }
          ),
          o ? /* @__PURE__ */ i("div", { className: "hb-content-menu", role: "menu", "aria-label": e.name, children: [
            /* @__PURE__ */ n("div", { className: "hb-content-menu-header", children: e.name }),
            /* @__PURE__ */ n("div", { className: "hb-content-menu-list", children: t.items.map((l) => {
              const b = l.type === "url" ? ye : Y;
              return /* @__PURE__ */ i(
                ue,
                {
                  link: l,
                  role: "menuitem",
                  ariaHasPopup: X(l) ? "dialog" : void 0,
                  onClick: (T) => c(T, l),
                  children: [
                    /* @__PURE__ */ n(b, { size: 15 }),
                    /* @__PURE__ */ n("span", { children: l.name })
                  ]
                },
                l.id
              );
            }) })
          ] }) : null
        ]
      }
    ),
    v
  ] });
}
function ln(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/components/agent/stream-request-params"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ae = U.joinSiteApi, K = U.request, J = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const cn = J.normalizePowerParamConfig, un = oe(), dn = oe(), mn = oe();
function hn(e = 0, t = "") {
  const o = JSON.stringify({ requestScopeKey: t, teamID: e });
  return un(o, async () => {
    const a = await K(ae("workbench/catalog"), "get", {
      team_id: e || void 0
    }), r = q(a, "加载团队工作区失败"), d = P(r.teams).map(de).filter(S), s = de(r.team), m = s.id ? {
      ...s,
      projectEnabled: !!r.project_enabled
    } : null, p = P(r.power_cates).map(nn).filter(S), u = P(r.powers).map(De).filter(S);
    return {
      teams: d,
      team: m,
      releaseID: w(r.release?.id),
      workspaceBodyID: w(r.workspace?.body_id),
      projectEnabled: !!r.project_enabled,
      powers: tn(
        on(u, p, (c) => c.cateID)
      ),
      powerCategories: p,
      roles: P(r.roles).map(gn).filter(S),
      assetCates: P(r.asset_cates).map(yn).filter(S)
    };
  });
}
async function pn(e = 20) {
  const t = await K(ae("system_message/list"), "get", {
    limit: e
  }), o = q(t, "加载系统消息失败");
  return P(o.items).map(kn).filter(S);
}
function Ct(e) {
  const t = `${e.teamID}:${e.roleID}`;
  return dn(t, async () => {
    const o = await K(
      fn("chat_config", e),
      "get"
    ), a = q(o, "加载对话配置失败"), r = P(a.model_sources).map((m) => ({
      id: w(m?.target_id || m?.id),
      name: Ee(
        m?.service_name,
        m?.name,
        "未命名模型"
      )
    })).filter(S), d = w(a.model_source_rule, 1), s = Ae(d) ? w(a.selected_model_target_id, r[0]?.id || 0) : 0;
    return {
      modelSourceRule: d,
      modelSources: r,
      selectedModelTargetID: s,
      toolsEnabled: _e(a.tools_enabled),
      tools: P(a.tools).map(bn).filter(S)
    };
  });
}
function Nt(e) {
  const t = `${e.teamID}:${e.teamPowerID}:${e.sourceTargetID || 0}`;
  return mn(t, async () => {
    const o = await K(re("power_form"), "get", {
      team_id: e.teamID,
      team_power_id: e.teamPowerID,
      source_target_id: e.sourceTargetID || void 0
    });
    return cn(q(o, "加载工具参数失败"));
  });
}
function re(e) {
  return ae(`workbench/${e}`);
}
function fn(e, t) {
  const o = new URLSearchParams({ team_id: String(t.teamID) });
  t.roleID && o.set("role_id", String(t.roleID));
  const a = re(e);
  return `${a}${a.includes("?") ? "&" : "?"}${o.toString()}`;
}
async function Dt(e) {
  return Ne("chat_save_asset", {
    team_id: e.teamID,
    role_id: e.roleID,
    message_id: e.messageID,
    artifact_id: e.artifactID || void 0,
    document_id: e.documentID || void 0,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function _t(e) {
  return Ne("power_save_asset", {
    team_id: e.teamID,
    team_power_id: e.teamPowerID,
    request_id: e.requestID,
    target_asset_id: e.targetAssetID || void 0,
    name: e.name?.trim() || void 0
  });
}
async function Ne(e, t) {
  const o = await K(re(e), "post", t), a = q(o, "保存资产失败"), r = w(a.asset?.id);
  if (!r)
    throw new Error("保存资产结果为空");
  return r;
}
function de(e) {
  return {
    id: w(e?.id),
    name: y(e?.name) || "未命名团队",
    description: y(e?.description),
    projectEnabled: _e(e?.project_enabled)
  };
}
function De(e) {
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
function bn(e) {
  return De({
    ...e,
    id: e?.team_power_id
  });
}
function gn(e) {
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
function yn(e) {
  return {
    id: w(e?.id),
    name: y(e?.name) || "未命名分类",
    kind: y(e?.kind) || "text",
    cardinality: y(e?.cardinality) || "single"
  };
}
function kn(e) {
  return {
    id: w(e?.id),
    title: y(e?.title) || "系统消息",
    content: y(e?.content),
    url: y(e?.url),
    pinned: !!e?.pinned,
    publishedAt: y(e?.published_at)
  };
}
function S(e) {
  return e.id > 0;
}
function _e(e) {
  return e !== !1 && Number(e || 1) !== 2;
}
const wn = F(
  W(() => import("./workbench-system-message-detail-uAnx-9Yk.js")),
  (e) => e.WorkbenchSystemMessageDetail
), vn = wn.Component;
function Cn({
  site: e
}) {
  const t = L(null), [o, a] = f(!1), [r, d] = f(null), s = Nn(o), m = e.homeMenu.messages;
  return D(() => {
    if (!o)
      return;
    const p = (c) => {
      !r && !t.current?.contains(c.target) && a(!1);
    }, u = (c) => {
      c.key === "Escape" && !r && a(!1);
    };
    return document.addEventListener("pointerdown", p), document.addEventListener("keydown", u), () => {
      document.removeEventListener("pointerdown", p), document.removeEventListener("keydown", u);
    };
  }, [o, r]), /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ i("div", { ref: t, className: "hb-system-message-root", children: [
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "hb-rail-action",
          title: m.name,
          "aria-label": `打开${m.name}`,
          "aria-expanded": o,
          onClick: () => a((p) => !p),
          children: [
            /* @__PURE__ */ n(
              R,
              {
                iconName: m.icon,
                iconImage: m.iconImage,
                fallbackIcon: ke,
                className: "hb-configured-menu-icon",
                strokeWidth: 1.8
              }
            ),
            /* @__PURE__ */ n("span", { children: m.name })
          ]
        }
      ),
      o ? /* @__PURE__ */ i("aside", { className: "hb-system-message-panel", "aria-label": "消息中心", children: [
        /* @__PURE__ */ i("header", { className: "hb-system-message-header", children: [
          /* @__PURE__ */ n("strong", { children: "消息中心" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "hb-system-message-icon-button",
              title: "关闭",
              "aria-label": "关闭消息中心",
              onClick: () => a(!1),
              children: /* @__PURE__ */ n(Te, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "hb-system-message-filter", "aria-label": "消息类型", children: /* @__PURE__ */ n("span", { children: "官方消息" }) }),
        /* @__PURE__ */ i("div", { className: "hb-system-message-list", "aria-live": "polite", children: [
          s.loading && s.items.length === 0 ? /* @__PURE__ */ n(_n, {}) : null,
          !s.loading && s.error ? /* @__PURE__ */ n(
            Mn,
            {
              message: s.error,
              onRetry: s.reload
            }
          ) : null,
          !s.loading && !s.error && s.items.length === 0 ? /* @__PURE__ */ n(In, {}) : null,
          s.error ? null : s.items.map((p) => /* @__PURE__ */ n(
            Dn,
            {
              site: e,
              message: p,
              onOpen: () => d(p),
              onNavigate: () => a(!1)
            },
            p.id
          ))
        ] })
      ] }) : null
    ] }),
    r ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      vn,
      {
        message: r,
        publishedAtLabel: Ie(
          r.publishedAt
        ),
        onClose: () => d(null)
      }
    ) }) : null
  ] });
}
function Nn(e) {
  const [t, o] = f(0), [a, r] = f([]), [d, s] = f(!1), [m, p] = f("");
  return D(() => {
    if (!e)
      return;
    let u = !0;
    return p(""), s(!0), pn().then((c) => {
      u && r(c);
    }).catch((c) => {
      u && p(
        c instanceof Error ? c.message : "加载系统消息失败"
      );
    }).finally(() => {
      u && s(!1);
    }), () => {
      u = !1;
    };
  }, [e, t]), {
    items: a,
    loading: d,
    error: m,
    reload: () => o((u) => u + 1)
  };
}
function Dn({
  site: e,
  message: t,
  onOpen: o,
  onNavigate: a
}) {
  const r = /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ n("span", { className: "hb-system-message-mark", "aria-hidden": "true", children: /* @__PURE__ */ n(
      Ce,
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
        t.pinned ? /* @__PURE__ */ n(Oe, { "aria-label": "置顶消息" }) : null,
        t.url ? /* @__PURE__ */ n(ye, { "aria-hidden": "true" }) : null
      ] }),
      /* @__PURE__ */ n("span", { className: "hb-system-message-content", children: t.content }),
      /* @__PURE__ */ n("time", { dateTime: t.publishedAt, children: Pn(t.publishedAt) })
    ] })
  ] });
  return t.url ? /* @__PURE__ */ n(
    "a",
    {
      className: "hb-system-message-row",
      href: t.url,
      target: "_blank",
      rel: "noreferrer noopener",
      onClick: a,
      children: r
    }
  ) : /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: "hb-system-message-row",
      "aria-haspopup": "dialog",
      onClick: o,
      children: r
    }
  );
}
function _n() {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ n(we, { className: "is-spinning" }),
    /* @__PURE__ */ n("span", { children: "正在加载官方消息" })
  ] });
}
function In() {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state", children: [
    /* @__PURE__ */ n(ke, {}),
    /* @__PURE__ */ n("span", { children: "暂无官方消息" })
  ] });
}
function Mn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ i("div", { className: "hb-system-message-state is-error", children: [
    /* @__PURE__ */ n(Fe, {}),
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "hb-system-message-icon-button",
        title: "重新加载",
        "aria-label": "重新加载官方消息",
        onClick: t,
        children: /* @__PURE__ */ n(ve, {})
      }
    )
  ] });
}
function Pn(e) {
  const t = new Date(e);
  if (Number.isNaN(t.getTime()))
    return "";
  const o = Math.max(0, Date.now() - t.getTime()), a = Math.floor(o / 6e4);
  if (a < 1)
    return "刚刚";
  if (a < 60)
    return `${a}分钟前`;
  const r = Math.floor(a / 60);
  if (r < 24)
    return `${r}小时前`;
  const d = Math.floor(r / 24);
  return d < 30 ? `${d}天前` : Ie(e, !1);
}
function Ie(e, t = !0) {
  const o = new Date(e);
  if (Number.isNaN(o.getTime()))
    return "";
  const a = /* @__PURE__ */ new Date(), r = o.getFullYear() !== a.getFullYear();
  return new Intl.DateTimeFormat("zh-CN", {
    ...r ? { year: "numeric" } : {},
    month: "long",
    day: "numeric",
    ...t ? {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1
    } : {}
  }).format(o);
}
function me({
  src: e,
  name: t,
  account: o,
  className: a = ""
}) {
  const [r, d] = f(!1);
  return D(() => {
    d(!1);
  }, [e]), /* @__PURE__ */ n("span", { className: `hb-workbench-avatar ${a}`.trim(), children: e && !r ? /* @__PURE__ */ n(
    "img",
    {
      src: e,
      alt: "",
      loading: "lazy",
      onError: () => d(!0)
    }
  ) : /* @__PURE__ */ n("span", { "aria-hidden": "true", children: Sn(t || o) }) });
}
function Sn(e) {
  return (String(e || "用").trim() || "用").slice(0, 1).toUpperCase();
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/lib/request", "@/stores/auth-store", "@/context/theme-provider"]);
const Z = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Z || Object.keys(Z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const he = Z.Button, E = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!E || Object.keys(E).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const En = E.Dialog, An = E.DialogContent, xn = E.DialogDescription, Tn = E.DialogFooter, On = E.DialogHeader, Fn = E.DialogTitle, Q = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Q || Object.keys(Q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Wn = Q.resetFrontRuntimeCache, ee = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!ee || Object.keys(ee).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Bn = ee.useAuthStore, ne = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!ne || Object.keys(ne).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const jn = ne.useTheme, Ln = be(
  () => import("./workbench-profile-dialog-C3sM92Ni.js").then((e) => ({
    default: e.WorkbenchProfileDialog
  }))
);
function Rn({
  teams: e,
  teamID: t,
  disabled: o,
  onTeamChange: a
}) {
  const r = Bn((g) => g.auth), d = an(), { resolvedTheme: s, setTheme: m, theme: p } = jn(), u = r.user, c = L(null), v = L(null), [l, b] = f(!1), [T, _] = f(null), [I, A] = f(!1), [B, M] = f(!1), j = e.find((g) => g.id === t), H = Array.isArray(u?.role) && u.role.length > 0 ? u.role.join("、") : "普通用户", N = x(() => {
    v.current !== null && (window.clearTimeout(v.current), v.current = null);
  }, []), h = x(
    (g) => {
      N(), _(g);
    },
    [N]
  ), k = x(() => {
    N(), v.current = window.setTimeout(() => {
      v.current = null, _(null);
    }, 180);
  }, [N]);
  D(() => {
    if (!l) {
      N(), _(null);
      return;
    }
    const g = (V) => {
      c.current?.contains(V.target) || b(!1);
    }, se = (V) => {
      V.key === "Escape" && b(!1);
    };
    return document.addEventListener("pointerdown", g), document.addEventListener("keydown", se), () => {
      N(), document.removeEventListener("pointerdown", g), document.removeEventListener("keydown", se);
    };
  }, [N, l]);
  const C = () => {
    const g = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    M(!1), b(!1), r.reset(), Wn(), d({
      to: "/sign-in",
      search: { redirect: g },
      replace: !0
    });
  };
  return /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ i("div", { ref: c, className: "hb-user-menu-root", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "hb-rail-user",
          "aria-label": "打开用户菜单",
          "aria-expanded": l,
          title: u?.name || u?.account || "用户菜单",
          onClick: () => b((g) => !g),
          children: /* @__PURE__ */ n(
            me,
            {
              src: u?.avatar,
              name: u?.name,
              account: u?.account
            }
          )
        }
      ),
      l ? /* @__PURE__ */ i("div", { className: "hb-user-menu", role: "menu", children: [
        /* @__PURE__ */ i("div", { className: "hb-user-summary", children: [
          /* @__PURE__ */ n(
            me,
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
            pe,
            {
              icon: We,
              label: "个人信息",
              onClick: () => {
                A(!0), b(!1);
              }
            }
          ),
          /* @__PURE__ */ i(
            fe,
            {
              icon: ie,
              label: "工作切换",
              detail: j?.name || "暂无工作",
              active: T === "team",
              onActivate: () => h("team"),
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
                  z,
                  {
                    icon: ie,
                    label: g.name,
                    active: g.id === t,
                    disabled: o,
                    onClick: () => a(g.id)
                  },
                  g.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ i(
            fe,
            {
              icon: s === "dark" ? le : ce,
              label: s === "dark" ? "深色模式" : "浅色模式",
              detail: "切换展示模式",
              active: T === "theme",
              onActivate: () => h("theme"),
              onDeactivate: k,
              children: [
                /* @__PURE__ */ n("div", { className: "hb-user-submenu-head", children: /* @__PURE__ */ n("strong", { children: "展示模式" }) }),
                /* @__PURE__ */ n(
                  z,
                  {
                    icon: ce,
                    label: "浅色",
                    active: p === "light",
                    onClick: () => m("light")
                  }
                ),
                /* @__PURE__ */ n(
                  z,
                  {
                    icon: le,
                    label: "深色",
                    active: p === "dark",
                    onClick: () => m("dark")
                  }
                ),
                /* @__PURE__ */ n(
                  z,
                  {
                    icon: Be,
                    label: "跟随系统",
                    active: p === "system",
                    onClick: () => m("system")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ n(
            pe,
            {
              icon: je,
              label: "退出",
              tone: "danger",
              onClick: () => {
                M(!0), b(!1);
              }
            }
          )
        ] })
      ] }) : null
    ] }),
    I ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      Ln,
      {
        open: I,
        roleLabel: H,
        onOpenChange: A,
        onPasswordChanged: C
      }
    ) }) : null,
    /* @__PURE__ */ n(En, { open: B, onOpenChange: M, children: /* @__PURE__ */ i(An, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ i(On, { children: [
        /* @__PURE__ */ n(Fn, { children: "退出登录" }),
        /* @__PURE__ */ n(xn, { children: "确认退出当前账户吗？退出后需要重新登录才能继续访问工作台。" })
      ] }),
      /* @__PURE__ */ i(Tn, { children: [
        /* @__PURE__ */ n(he, { variant: "outline", onClick: () => M(!1), children: "取消" }),
        /* @__PURE__ */ n(he, { variant: "destructive", onClick: C, children: "退出" })
      ] })
    ] }) })
  ] });
}
function pe({
  icon: e,
  label: t,
  tone: o,
  onClick: a
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-user-menu-item ${o === "danger" ? "is-danger" : ""}`,
      role: "menuitem",
      onClick: a,
      children: [
        /* @__PURE__ */ n(e, {}),
        /* @__PURE__ */ n("span", { children: t })
      ]
    }
  );
}
function fe({
  icon: e,
  label: t,
  detail: o,
  active: a,
  onActivate: r,
  onDeactivate: d,
  children: s
}) {
  return /* @__PURE__ */ i(
    "div",
    {
      className: `hb-user-submenu-shell ${a ? "is-active" : ""}`,
      onMouseEnter: r,
      onMouseLeave: d,
      children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "hb-user-menu-item",
            role: "menuitem",
            onClick: r,
            children: [
              /* @__PURE__ */ n(e, {}),
              /* @__PURE__ */ i("span", { children: [
                t,
                /* @__PURE__ */ n("small", { children: o })
              ] }),
              /* @__PURE__ */ n(Le, { className: "hb-user-menu-chevron" })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "hb-user-submenu", children: s })
      ]
    }
  );
}
function z({
  icon: e,
  label: t,
  active: o,
  disabled: a = !1,
  onClick: r
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-submenu-choice ${o ? "is-active" : ""}`,
      disabled: a,
      onClick: r,
      children: [
        /* @__PURE__ */ n(e, {}),
        /* @__PURE__ */ n("span", { children: t }),
        o ? /* @__PURE__ */ n(Re, { className: "hb-submenu-choice-check" }) : null
      ]
    }
  );
}
const Me = F(
  W(() => import("./workbench-account-center-CBpul5Et.js")),
  (e) => e.WorkbenchAccountCenter
), $n = Me.Component;
function qn({
  site: e,
  navigation: t,
  activePage: o,
  teams: a,
  teamID: r,
  loading: d,
  contentNavigation: s,
  onNavigate: m,
  onTeamChange: p
}) {
  const [u, c] = f(!1), v = ["points", "messages", "content"].filter((l) => e.homeMenu[l].enabled).sort(
    (l, b) => e.homeMenu[l].sort - e.homeMenu[b].sort
  );
  return /* @__PURE__ */ i(O, { children: [
    /* @__PURE__ */ i("aside", { className: "hb-laper-sidebar", "aria-label": "工作台导航", children: [
      /* @__PURE__ */ n("div", { className: "hb-laper-sidebar-head", children: /* @__PURE__ */ i("div", { className: "hb-rail-brand-wrap", children: [
        /* @__PURE__ */ n(
          Ce,
          {
            site: e,
            className: "hb-rail-brand",
            logoClassName: "hb-rail-brand-logo",
            nameClassName: "hb-rail-brand-name"
          }
        ),
        /* @__PURE__ */ n("span", { className: "hb-rail-brand-tooltip", role: "tooltip", children: e.siteName })
      ] }) }),
      /* @__PURE__ */ n("nav", { className: "hb-laper-nav", "aria-label": "工作区导航", children: t.map((l) => /* @__PURE__ */ n(
        Kn,
        {
          page: l,
          active: o === l.key,
          onClick: () => m(l.key)
        },
        l.key
      )) }),
      /* @__PURE__ */ i("div", { className: "hb-laper-sidebar-foot", children: [
        v.map((l) => l === "points" ? /* @__PURE__ */ n(
          zn,
          {
            iconName: e.homeMenu.points.icon,
            iconImage: e.homeMenu.points.iconImage,
            fallbackIcon: $e,
            label: e.homeMenu.points.name,
            onIntent: Me.preload,
            onClick: () => c(!0)
          },
          l
        ) : l === "messages" ? /* @__PURE__ */ n(Cn, { site: e }, l) : /* @__PURE__ */ n(
          sn,
          {
            menu: e.homeMenu.content,
            navigation: s
          },
          l
        )),
        /* @__PURE__ */ n(
          Rn,
          {
            teams: a,
            teamID: r,
            disabled: d,
            onTeamChange: p
          }
        )
      ] })
    ] }),
    u ? /* @__PURE__ */ n($, { fallback: null, children: /* @__PURE__ */ n(
      $n,
      {
        open: u,
        onOpenChange: c
      }
    ) }) : null
  ] });
}
function Kn({
  page: e,
  active: t,
  onClick: o
}) {
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: `hb-laper-nav-item ${t ? "is-active" : ""}`,
      "aria-current": t ? "page" : void 0,
      title: e.label,
      onClick: o,
      children: [
        /* @__PURE__ */ n(
          R,
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
function zn({
  iconName: e,
  iconImage: t,
  fallbackIcon: o,
  label: a,
  onIntent: r,
  onClick: d
}) {
  const s = xe(r);
  return /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: "hb-rail-action",
      title: a,
      onPointerEnter: s.schedule,
      onPointerLeave: s.cancel,
      onFocus: s.preloadNow,
      onClick: () => {
        s.preloadNow(), d();
      },
      children: [
        /* @__PURE__ */ n(
          R,
          {
            iconName: e,
            iconImage: t,
            fallbackIcon: o,
            className: "hb-configured-menu-icon",
            strokeWidth: 1.8
          }
        ),
        /* @__PURE__ */ n("span", { children: a })
      ]
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const te = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!te || Object.keys(te).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const Un = te.useTheme, Hn = F(
  W(() => import("./project-page-DqxWhLqD.js")),
  (e) => e.WorkProjectPage
), Vn = Hn.Component, Yn = F(
  W(() => import("./asset-page-D9DFDknb.js").then((e) => e.d)),
  (e) => e.WorkbenchAssetPage
), Xn = Yn.Component, Gn = F(
  W(() => import("./dialogue-page-H4Vk9_P4.js")),
  (e) => e.WorkbenchDialoguePage
), Jn = Gn.Component, Zn = F(
  W(() => import("./function-page-Cu5JCUp5.js")),
  (e) => e.WorkbenchFunctionPage
), Qn = Zn.Component, et = "bot.body.workbench.team", G = {
  items: []
}, nt = [
  { key: "works", menuKey: "works", fallbackIcon: qe },
  { key: "dialogue", menuKey: "dialogue", fallbackIcon: Ke },
  { key: "function", menuKey: "function", fallbackIcon: ze },
  { key: "assets", menuKey: "assets", fallbackIcon: Ue }
];
function tt({ item: e }) {
  const t = Ve(), o = Ze(), { resolvedTheme: a } = Un();
  Qe(t.site.appearance, a);
  const [r, d] = f(
    () => it(
      typeof e?.value == "string" ? e.value : e?.value?.page
    )
  ), [s, m] = f(null), [p, u] = f(!0), [c, v] = f(""), [l, b] = f(G), [T, _] = f(null), I = L(0), A = x(
    async (h = 0) => {
      const k = ++I.current;
      u(!0), v("");
      try {
        const C = await hn(h, o);
        if (k !== I.current)
          return;
        m(C), _(null), C.team?.id && ut(o, C.team.id), d((g) => lt(g, C));
      } catch (C) {
        if (k !== I.current)
          return;
        v(
          C instanceof Error ? C.message : "加载团队工作区失败"
        );
      } finally {
        k === I.current && u(!1);
      }
    },
    [o]
  );
  D(() => {
    Ye(t.site);
  }, [t.site]), D(() => {
    if (m(null), _(null), !o) {
      I.current += 1, u(!1);
      return;
    }
    A(ct(o));
  }, [A, o]), D(() => {
    if (!t.site.homeMenu.content.enabled) {
      b(G);
      return;
    }
    let h = !0;
    return en().then((k) => {
      h && b(k);
    }).catch(() => {
      h && b(G);
    }), () => {
      h = !1;
    };
  }, [t.site.homeMenu.content.enabled]);
  const B = ge(
    () => [...nt].filter((h) => t.site.homeMenu[h.menuKey].enabled).sort(
      (h, k) => t.site.homeMenu[h.menuKey].sort - t.site.homeMenu[k.menuKey].sort
    ).map((h) => {
      const k = t.site.homeMenu[h.menuKey];
      return {
        key: h.key,
        label: k.name,
        iconName: k.icon,
        iconImage: k.iconImage,
        fallbackIcon: h.fallbackIcon
      };
    }).filter(
      (h) => h.key !== "works" || !s || s.projectEnabled
    ),
    [s, t.site.homeMenu]
  ), M = B.find((h) => h.key === r)?.key || B[0]?.key, j = x(
    (h) => h.sourceType === "dialogue" ? !!s?.roles.some((k) => k.id === h.sourceID) : !!s?.powers.some((k) => k.id === h.sourceID),
    [s?.powers, s?.roles]
  ), H = x(
    (h) => {
      j(h) && (_(h), d(h.sourceType === "dialogue" ? "dialogue" : "function"));
    },
    [j]
  ), N = x(() => _(null), []);
  return /* @__PURE__ */ i(
    "main",
    {
      className: "hb-laper-app",
      "data-workbench-template": t.site.appearance.workbenchTemplate,
      "data-page-background": Ge(t.site.appearance, "workbench") ? "custom" : void 0,
      style: Xe(t.site.appearance, "workbench"),
      children: [
        /* @__PURE__ */ n(Je, {}),
        /* @__PURE__ */ n(
          qn,
          {
            site: t.site,
            navigation: B,
            activePage: M || "assets",
            teams: s?.teams || [],
            teamID: s?.team?.id || 0,
            loading: p,
            contentNavigation: l,
            onNavigate: d,
            onTeamChange: (h) => {
              A(h);
            }
          }
        ),
        /* @__PURE__ */ n("section", { className: "hb-laper-main", children: /* @__PURE__ */ n("div", { className: "hb-laper-frame", children: /* @__PURE__ */ n("div", { className: "hb-laper-content", children: p ? /* @__PURE__ */ n(Pe, {}) : c ? /* @__PURE__ */ n(
          at,
          {
            message: c,
            onRetry: () => {
              A(s?.team?.id);
            }
          }
        ) : s?.team ? M ? /* @__PURE__ */ n(
          ot,
          {
            page: M,
            catalog: s,
            continuationAsset: T,
            onContinueAsset: H,
            canContinueAsset: j,
            onClearContinuation: N
          },
          o
        ) : /* @__PURE__ */ n(st, {}) : /* @__PURE__ */ n(rt, {}) }) }) })
      ]
    }
  );
}
function ot({
  page: e,
  catalog: t,
  continuationAsset: o,
  onContinueAsset: a,
  canContinueAsset: r,
  onClearContinuation: d
}) {
  const s = t.team?.id || 0, [m, p] = f([e]), u = ge(
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
  return D(() => {
    p(
      (c) => c.includes(e) ? c : [...c, e]
    );
  }, [e]), /* @__PURE__ */ n($, { fallback: /* @__PURE__ */ n(Pe, {}), children: /* @__PURE__ */ i("div", { className: "h-full min-h-0", children: [
    e === "function" || m.includes("function") ? /* @__PURE__ */ n("div", { className: e === "function" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ n(
      Qn,
      {
        teamID: s,
        powers: t.powers,
        powerCategories: t.powerCategories,
        continuationAsset: o,
        onClearContinuation: d
      }
    ) }) : null,
    e === "dialogue" || m.includes("dialogue") ? /* @__PURE__ */ n("div", { className: e === "dialogue" ? "h-full min-h-0" : "hidden", children: /* @__PURE__ */ n(
      Jn,
      {
        teamID: s,
        roles: t.roles,
        powerCategories: t.powerCategories,
        continuationAsset: o,
        onClearContinuation: d
      }
    ) }) : null,
    e === "works" ? /* @__PURE__ */ n("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ n(Vn, { teamID: s }, s) }) : null,
    e === "assets" ? /* @__PURE__ */ n(
      Xn,
      {
        teamID: s,
        onContinue: a,
        canContinue: r,
        catalogOptions: u
      }
    ) : null
  ] }) });
}
function Pe() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center text-[var(--body-work-muted)]", children: /* @__PURE__ */ n(we, { className: "size-5 animate-spin" }) });
}
function at({
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
          /* @__PURE__ */ n(ve, { className: "size-4" }),
          "重试"
        ]
      }
    )
  ] }) });
}
function rt() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ i("div", { children: [
    /* @__PURE__ */ n(He, { className: "mx-auto mb-3 size-6 text-[var(--body-work-muted)]" }),
    /* @__PURE__ */ n("p", { className: "m-0 text-sm font-medium text-[var(--body-work-text)]", children: "暂无已发布团队" })
  ] }) });
}
function st() {
  return /* @__PURE__ */ n("div", { className: "flex h-full items-center justify-center px-6 text-center", children: /* @__PURE__ */ n("p", { className: "m-0 text-sm text-[var(--body-work-muted)]", children: "暂无可用功能" }) });
}
function it(e) {
  switch (e) {
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
function lt(e, t) {
  return e !== "works" || t.projectEnabled ? e : t.roles.length > 0 ? "dialogue" : t.powers.length > 0 ? "function" : "assets";
}
function Se(e) {
  return `${et}.${e}`;
}
function ct(e) {
  try {
    return Number(
      window.localStorage.getItem(Se(e)) || 0
    );
  } catch {
    return 0;
  }
}
function ut(e, t) {
  try {
    window.localStorage.setItem(
      Se(e),
      String(t)
    );
  } catch {
  }
}
const It = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkHomeShell: tt
}, Symbol.toStringTag, { value: "Module" }));
export {
  me as W,
  _t as a,
  Nt as b,
  Dt as c,
  It as h,
  Ct as l,
  fn as s,
  re as w
};
