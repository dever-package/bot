import { a as o, j as t, F as q } from "./preloadable-Bomi5PEU.js";
import { e as T, a as g, b as dn, d as In, u as Y } from "./_commonjsHelpers-61wyk6v6.js";
import { t as z } from "./index-BqbNvFGg.js";
import { r as x, v as xn, R as U, ak as mn, al as nn, am as ln, C as Mn, an as en, ao as Bn, ap as Ln, d as Rn, aq as Fn, ar as En, X as On, c as Sn } from "./vendor-icons-DwjYEojZ.js";
import { s as L, a as _, r as s, d as p, k as Q } from "./site-config-C63CM9jT.js";
import { c as zn } from "./power-icon-DzGqVPMs.js";
import { W as Tn } from "./home-shell-BA3oPw_T.js";
import { W as Un } from "./workbench-picker-pU70WuO4.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./workbench-account-center-BfQYmzoL.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const R = j.joinSiteApi, F = j.request;
async function jn() {
  const n = await F(R("account/overview"), "get"), e = L(n, "加载账户信息失败");
  return {
    user: {
      id: p(e.user?.id),
      name: s(e.user?.name) || "用户",
      account: s(e.user?.account)
    },
    pointAccounts: _(e.point_accounts).map(Jn).filter((i) => i.pointConfigID > 0),
    subscriptions: _(e.subscriptions).map(Kn).filter((i) => i.identityID > 0),
    catalog: _(e.catalog).map(Zn).filter((i) => i.id > 0 && i.levels.length > 0),
    pointPackages: _(e.point_packages).map(ee).filter((i) => i.id > 0)
  };
}
async function qn(n, e = "", i = 20) {
  const l = await F(R("account/point_logs"), "get", {
    point_config_id: n,
    cursor: e || void 0,
    limit: i
  }), c = L(l, "加载积分明细失败");
  return {
    items: _(c.items).map(te).filter((u) => u.id > 0),
    nextCursor: s(c.next_cursor)
  };
}
async function Vn(n, e = "", i = 20) {
  const l = await F(R("account/orders"), "get", {
    point_config_id: n,
    cursor: e || void 0,
    limit: i
  }), c = L(l, "加载订单记录失败");
  return {
    items: _(c.items).map(tn).filter((u) => u.id > 0),
    nextCursor: s(c.next_cursor)
  };
}
async function Wn(n) {
  return V("subscription_checkout", {
    level_id: n,
    request_id: hn()
  });
}
async function Hn(n) {
  return V("point_checkout", {
    package_id: n,
    request_id: hn()
  });
}
async function Yn(n) {
  return V("order_cancel", {
    type: n.type,
    order_no: n.orderNo
  });
}
async function Qn(n) {
  return V("order_retry", {
    type: n.type,
    order_no: n.orderNo
  });
}
async function Xn(n) {
  const e = await F(R("account/order_status"), "get", {
    type: n.type,
    order_no: n.orderNo
  });
  return tn(L(e, "加载订单状态失败"));
}
async function Gn(n, e = 30, i = 2e3) {
  let l = n;
  for (let c = 0; c < e; c += 1) {
    if (!["pending_payment", "paying", "paid", "fulfilling"].includes(l.status))
      return l;
    await oe(i), l = await Xn(l);
  }
  return l;
}
async function V(n, e) {
  const i = await F(R(`account/${n}`), "post", e);
  return tn(L(i, "账户操作失败"));
}
function pn(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "积分",
    symbol: s(n?.symbol),
    symbolPosition: Number(n?.symbol_position || 2),
    exchangeRate: Number(n?.exchange_rate || 0)
  };
}
function Jn(n) {
  return {
    id: p(n?.id),
    pointConfigID: p(n?.point_config_id),
    name: s(n?.name) || "积分",
    symbol: s(n?.symbol),
    symbolPosition: Number(n?.symbol_position || 2),
    balance: Number(n?.balance || 0),
    availableBalance: Number(n?.available_balance || 0)
  };
}
function Kn(n) {
  return {
    id: p(n?.id),
    identityID: p(n?.identity_id),
    pointConfigID: p(n?.point_config_id),
    identityName: s(n?.identity_name),
    levelID: p(n?.level_id),
    levelName: s(n?.level_name),
    level: Number(n?.level || 0),
    cardNo: s(n?.card_no),
    expiredAt: s(n?.expired_at)
  };
}
function Zn(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "订阅",
    pointConfig: pn(n?.point_config),
    levels: _(n?.levels).map(ne).filter((e) => e.id > 0),
    currentLevelID: p(n?.current_level_id),
    currentExpiredAt: s(n?.current_expired_at)
  };
}
function ne(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "订阅方案",
    level: Number(n?.level || 0),
    durationDays: Number(n?.duration_days || 0),
    payType: Number(n?.pay_type || 0),
    basePoints: Number(n?.base_points || 0),
    checkoutPoints: Number(n?.checkout_points || 0),
    payAmountMicros: Number(n?.pay_amount_micros || 0),
    benefitDescriptions: _(n?.benefit_descriptions).map((e) => ({
      icon: s(e?.icon),
      text: s(e?.text)
    })).filter((e) => !!e.text),
    periodicBenefits: _(n?.periodic_benefits).map((e) => ({
      pointName: s(e?.point_name) || "积分",
      pointAmount: Number(e?.point_amount || 0),
      cycleDays: Number(e?.cycle_days || 0),
      limitTimes: Number(e?.limit_times || 0)
    })),
    billingBenefits: _(n?.billing_benefits).map((e) => ({
      scope: s(e?.scope),
      saleRatio: s(e?.sale_ratio)
    }))
  };
}
function ee(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "积分套餐",
    pointConfig: pn(n?.point_config),
    pointAmount: Number(n?.point_amount || 0),
    bonusAmount: Number(n?.bonus_amount || 0),
    payAmountMicros: Number(n?.pay_amount_micros || 0)
  };
}
function tn(n) {
  return {
    id: p(n?.id),
    type: s(n?.type) === "point" ? "point" : "identity",
    orderNo: s(n?.order_no),
    pointConfigID: p(n?.point_config_id),
    pointName: s(n?.point_name),
    title: s(n?.title) || "账户订单",
    status: s(n?.status),
    action: s(n?.action),
    totalPoints: Number(n?.total_points || 0),
    rechargePoints: Number(n?.recharge_points || 0),
    bonusPoints: Number(n?.bonus_points || 0),
    payAmountMicros: Number(n?.pay_amount_micros || 0),
    currency: s(n?.currency) || "CNY",
    paymentURL: s(n?.payment_url),
    error: s(n?.error),
    targetExpiredAt: s(n?.target_expired_at),
    createdAt: s(n?.created_at),
    paidAt: s(n?.paid_at),
    fulfilledAt: s(n?.fulfilled_at),
    canCancel: !!n?.can_cancel,
    canRetry: !!n?.can_retry
  };
}
function te(n) {
  return {
    id: p(n?.id),
    pointConfigID: p(n?.point_config_id),
    pointName: s(n?.point_name) || "积分",
    pointSymbol: s(n?.point_symbol),
    changeType: s(n?.change_type),
    source: s(n?.source),
    amount: Number(n?.amount || 0),
    balanceBefore: Number(n?.balance_before || 0),
    balanceAfter: Number(n?.balance_after || 0),
    remark: s(n?.remark),
    createdAt: s(n?.created_at)
  };
}
function hn() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `account-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function oe(n) {
  return new Promise((e) => window.setTimeout(e, n));
}
function y(n) {
  return new Intl.NumberFormat("zh-CN").format(Number(n || 0));
}
function on(n) {
  const e = Number(n || 0) / 1e6;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: e % 1 === 0 ? 0 : 2
  }).format(e);
}
function ie(n, e) {
  return n <= 0 || e <= 0 ? 0 : Math.ceil(n * 1e6 / e);
}
function ce(n) {
  return n >= 365 && n % 365 === 0 ? `${n / 365} 年` : n >= 30 && n % 30 === 0 ? `${n / 30} 个月` : `${n} 天`;
}
function fn(n) {
  if (!n)
    return "";
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? n : e.toLocaleDateString("zh-CN");
}
function bn(n) {
  if (!n)
    return "-";
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? n : e.toLocaleString("zh-CN", { hour12: !1 });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button"]);
const X = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!X || Object.keys(X).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const re = X.Button;
function gn({ compact: n = !1 }) {
  return /* @__PURE__ */ o("div", { className: `hb-account-state${n ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ t(x, { className: "animate-spin" }),
    /* @__PURE__ */ t("span", { children: "正在加载账户信息" })
  ] });
}
function yn({
  message: n,
  onRetry: e,
  compact: i = !1
}) {
  return /* @__PURE__ */ o("div", { className: `hb-account-state is-error${i ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ t(xn, {}),
    /* @__PURE__ */ t("strong", { children: "加载失败" }),
    /* @__PURE__ */ t("span", { children: n }),
    /* @__PURE__ */ o(re, { variant: "outline", onClick: e, children: [
      /* @__PURE__ */ t(U, {}),
      "重试"
    ] })
  ] });
}
function cn({ icon: n, text: e }) {
  return /* @__PURE__ */ o("div", { className: "hb-account-empty", children: [
    n || /* @__PURE__ */ t(mn, {}),
    /* @__PURE__ */ t("span", { children: e })
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button"]);
const G = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!G || Object.keys(G).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Nn = G.Button;
function ae({
  overview: n,
  activeIdentity: e,
  activeIdentityID: i,
  pointName: l,
  busyKey: c,
  onIdentityChange: u,
  onCheckout: d
}) {
  return /* @__PURE__ */ o("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ o("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ t("h2", { children: "订阅计划" }),
        /* @__PURE__ */ o("p", { children: [
          n.catalog.length,
          " 个使用",
          l,
          "的订阅身份"
        ] })
      ] }),
      n.catalog.length > 1 ? /* @__PURE__ */ t("div", { className: "hb-account-identity-switch", "aria-label": "订阅身份", children: n.catalog.map((r) => /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: r.id === i ? "is-active" : "",
          onClick: () => u(r.id),
          children: r.name
        },
        r.id
      )) }) : null
    ] }),
    e ? /* @__PURE__ */ t("div", { className: "hb-account-plan-grid", children: e.levels.map((r) => /* @__PURE__ */ t(
      se,
      {
        identity: e,
        plan: r,
        busy: c === `plan-${r.id}`,
        disabled: !!c,
        onCheckout: () => d(r)
      },
      r.id
    )) }) : /* @__PURE__ */ t(
      cn,
      {
        icon: /* @__PURE__ */ t(nn, {}),
        text: `暂无使用${l}的订阅计划`
      }
    )
  ] });
}
function se({
  identity: n,
  plan: e,
  busy: i,
  disabled: l,
  onCheckout: c
}) {
  const u = n.currentLevelID === e.id, d = u ? "续订当前方案" : n.currentLevelID ? "切换到此方案" : "立即订阅";
  return /* @__PURE__ */ o("article", { className: `hb-account-plan${u ? " is-current" : ""}`, children: [
    /* @__PURE__ */ o("div", { className: "hb-account-plan-head", children: [
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ t("span", { children: n.name }),
        /* @__PURE__ */ t("h3", { children: e.name })
      ] }),
      u ? /* @__PURE__ */ t("em", { children: "当前方案" }) : null
    ] }),
    /* @__PURE__ */ o("div", { className: "hb-account-plan-price", children: [
      /* @__PURE__ */ t("strong", { children: y(e.checkoutPoints) }),
      /* @__PURE__ */ t("span", { children: n.pointConfig.name })
    ] }),
    /* @__PURE__ */ o("p", { className: "hb-account-plan-cash", children: [
      "参考价 ",
      on(e.payAmountMicros),
      " · ",
      ce(e.durationDays)
    ] }),
    /* @__PURE__ */ t("div", { className: "hb-account-plan-benefits", children: e.benefitDescriptions.length > 0 ? e.benefitDescriptions.map((r, f) => {
      const N = zn(
        r.icon,
        Mn
      );
      return /* @__PURE__ */ o("span", { children: [
        /* @__PURE__ */ t(N, {}),
        r.text
      ] }, `${r.text}-${f}`);
    }) : /* @__PURE__ */ o(q, { children: [
      e.periodicBenefits.map((r, f) => /* @__PURE__ */ o("span", { children: [
        /* @__PURE__ */ t(en, {}),
        "每 ",
        r.cycleDays,
        " 天 ",
        y(r.pointAmount),
        " ",
        r.pointName
      ] }, `${r.pointName}-${f}`)),
      e.billingBenefits.map((r, f) => /* @__PURE__ */ o("span", { children: [
        /* @__PURE__ */ t(Bn, {}),
        "能力计费系数 ",
        r.saleRatio || "1"
      ] }, `${r.scope}-${f}`)),
      e.periodicBenefits.length === 0 && e.billingBenefits.length === 0 ? /* @__PURE__ */ o("span", { children: [
        /* @__PURE__ */ t(Ln, {}),
        "有效期内享受当前等级权益"
      ] }) : null
    ] }) }),
    /* @__PURE__ */ o(Nn, { className: "w-full", disabled: l, onClick: c, children: [
      i ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
      i ? "处理中" : d
    ] })
  ] });
}
function le({
  overview: n,
  pointName: e,
  busyKey: i,
  onCheckout: l
}) {
  return /* @__PURE__ */ o("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ t("div", { className: "hb-account-section-heading", children: /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("h2", { children: [
        "购买",
        e
      ] }),
      /* @__PURE__ */ o("p", { children: [
        n.pointPackages.length,
        " 个可用套餐"
      ] })
    ] }) }),
    n.pointPackages.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-account-package-grid", children: n.pointPackages.map((c) => /* @__PURE__ */ o("article", { className: "hb-account-package", children: [
      /* @__PURE__ */ t(ln, {}),
      /* @__PURE__ */ t("h3", { children: c.name }),
      /* @__PURE__ */ o("strong", { children: [
        y(c.pointAmount + c.bonusAmount),
        " ",
        c.pointConfig.name
      ] }),
      /* @__PURE__ */ o("p", { children: [
        "基础 ",
        y(c.pointAmount),
        c.bonusAmount > 0 ? `，赠送 ${y(c.bonusAmount)}` : ""
      ] }),
      /* @__PURE__ */ o(
        Nn,
        {
          variant: "outline",
          disabled: !!i,
          onClick: () => l(c),
          children: [
            i === `package-${c.id}` ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
            on(c.payAmountMicros)
          ]
        }
      )
    ] }, c.id)) }) : /* @__PURE__ */ t(
      cn,
      {
        icon: /* @__PURE__ */ t(ln, {}),
        text: `暂无可购买的${e}套餐`
      }
    )
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const I = J.Button;
function ue({
  resetKey: n,
  pointConfigID: e,
  pointName: i,
  busyKey: l,
  onAction: c
}) {
  const u = Cn(e, Vn), d = _n(n, u);
  return /* @__PURE__ */ o("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ o("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ o("h2", { children: [
        i,
        "订单"
      ] }) }),
      /* @__PURE__ */ o(
        I,
        {
          variant: "outline",
          size: "sm",
          disabled: d.loading,
          onClick: d.reload,
          children: [
            /* @__PURE__ */ t(U, { className: d.loading ? "animate-spin" : "" }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(kn, { page: d, emptyText: `暂无${i}订单`, children: /* @__PURE__ */ t("div", { className: "hb-account-record-list", children: d.items.map((r) => /* @__PURE__ */ o(
      "article",
      {
        className: "hb-account-record",
        children: [
          /* @__PURE__ */ t("span", { className: `hb-account-record-mark is-${r.type}`, children: r.type === "identity" ? /* @__PURE__ */ t(nn, {}) : /* @__PURE__ */ t(en, {}) }),
          /* @__PURE__ */ o("div", { className: "hb-account-record-copy", children: [
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ t("strong", { children: r.title }),
              /* @__PURE__ */ t(me, { status: r.status })
            ] }),
            /* @__PURE__ */ o("p", { children: [
              y(r.totalPoints),
              " ",
              r.pointName || i,
              " ·",
              " ",
              bn(r.createdAt)
            ] }),
            r.error ? /* @__PURE__ */ t("small", { children: r.error }) : null
          ] }),
          /* @__PURE__ */ o("div", { className: "hb-account-record-actions", children: [
            r.paymentURL && r.status === "paying" ? /* @__PURE__ */ t(
              I,
              {
                size: "sm",
                onClick: () => window.open(r.paymentURL, "_blank", "noopener,noreferrer"),
                children: "继续支付"
              }
            ) : null,
            r.canRetry ? /* @__PURE__ */ o(
              I,
              {
                size: "sm",
                variant: "outline",
                disabled: !!l,
                onClick: () => c(
                  `retry-${r.type}-${r.id}`,
                  () => Qn(r)
                ),
                children: [
                  l === `retry-${r.type}-${r.id}` ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : /* @__PURE__ */ t(U, {}),
                  "重试"
                ]
              }
            ) : null,
            r.canCancel ? /* @__PURE__ */ t(
              I,
              {
                size: "sm",
                variant: "ghost",
                disabled: !!l,
                onClick: () => c(
                  `cancel-${r.type}-${r.id}`,
                  () => Yn(r)
                ),
                children: "取消"
              }
            ) : null
          ] })
        ]
      },
      `${r.type}-${r.id}`
    )) }) })
  ] });
}
function de({
  resetKey: n,
  pointConfigID: e,
  pointName: i
}) {
  const l = Cn(e, qn), c = _n(n, l);
  return /* @__PURE__ */ o("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ o("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ o("h2", { children: [
        i,
        "明细"
      ] }) }),
      /* @__PURE__ */ o(
        I,
        {
          variant: "outline",
          size: "sm",
          disabled: c.loading,
          onClick: c.reload,
          children: [
            /* @__PURE__ */ t(U, { className: c.loading ? "animate-spin" : "" }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(kn, { page: c, emptyText: `暂无${i}明细`, children: /* @__PURE__ */ t("div", { className: "hb-account-record-list", children: c.items.map((u) => {
      const d = u.changeType === "increase";
      return /* @__PURE__ */ o("article", { className: "hb-account-record", children: [
        /* @__PURE__ */ t(
          "span",
          {
            className: `hb-account-record-mark ${d ? "is-increase" : "is-consume"}`,
            children: /* @__PURE__ */ t(en, {})
          }
        ),
        /* @__PURE__ */ o("div", { className: "hb-account-record-copy", children: [
          /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t("strong", { children: u.remark || (d ? `${i}增加` : `${i}消费`) }) }),
          /* @__PURE__ */ o("p", { children: [
            u.pointName,
            " · ",
            bn(u.createdAt),
            " · 余额",
            " ",
            y(u.balanceAfter)
          ] })
        ] }),
        /* @__PURE__ */ o(
          "strong",
          {
            className: d ? "hb-account-positive" : "hb-account-negative",
            children: [
              d ? "+" : "-",
              y(u.amount)
            ]
          }
        )
      ] }, u.id);
    }) }) })
  ] });
}
function Cn(n, e) {
  return T(
    (i = "", l = 20) => n > 0 ? e(n, i, l) : Promise.resolve({ items: [], nextCursor: "" }),
    [e, n]
  );
}
function _n(n, e) {
  const [i, l] = g([]), [c, u] = g(""), [d, r] = g(!1), [f, N] = g(""), k = T(
    async (v, m) => {
      r(!0), N("");
      try {
        const C = await e(v, 20);
        l((M) => m ? [...M, ...C.items] : C.items), u(C.nextCursor);
      } catch (C) {
        N(Q(C, "加载记录失败"));
      } finally {
        r(!1);
      }
    },
    [e]
  );
  return dn(() => {
    l([]), u(""), k("", !1);
  }, [k, n]), {
    items: i,
    cursor: c,
    loading: d,
    error: f,
    reload: () => {
      k("", !1);
    },
    loadMore: () => {
      k(c, !0);
    }
  };
}
function kn({
  page: n,
  emptyText: e,
  children: i
}) {
  return n.loading && n.items.length === 0 ? /* @__PURE__ */ t(gn, { compact: !0 }) : n.error && n.items.length === 0 ? /* @__PURE__ */ t(yn, { message: n.error, onRetry: n.reload, compact: !0 }) : n.items.length === 0 ? /* @__PURE__ */ t(cn, { text: e }) : /* @__PURE__ */ o(q, { children: [
    i,
    n.cursor ? /* @__PURE__ */ t("div", { className: "hb-account-load-more", children: /* @__PURE__ */ o(I, { variant: "outline", disabled: n.loading, onClick: n.loadMore, children: [
      n.loading ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : /* @__PURE__ */ t(Rn, {}),
      n.loading ? "加载中" : "加载更多"
    ] }) }) : null,
    n.error ? /* @__PURE__ */ t("p", { className: "hb-account-inline-error", children: n.error }) : null
  ] });
}
function me({ status: n }) {
  const e = {
    pending_payment: "待支付",
    paying: "支付中",
    paid: "已支付",
    fulfilling: "处理中",
    completed: "已完成",
    failed: "失败",
    canceled: "已取消"
  };
  return /* @__PURE__ */ t("span", { className: `hb-account-status is-${n}`, children: e[n] || n });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/stores/auth-store"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const un = K.Button, D = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const wn = D.Dialog, An = D.DialogContent, Dn = D.DialogDescription, pe = D.DialogFooter, vn = D.DialogHeader, $n = D.DialogTitle, Z = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!Z || Object.keys(Z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const he = Z.useAuthStore;
function Pe({
  open: n,
  onOpenChange: e
}) {
  const [i, l] = g("plans"), [c, u] = g(null), [d, r] = g(0), [f, N] = g(0), [k, v] = g(!1), [m, C] = g(""), [M, Pn] = g(0), [E, rn] = g(""), [W, O] = g(null), H = In(!1), S = T(() => Pn((a) => a + 1), []);
  dn(() => {
    if (!n)
      return;
    let a = !0;
    return v(!0), C(""), jn().then((b) => {
      a && (u(b), r(
        (h) => b.catalog.some((P) => P.id === h) ? h : b.catalog[0]?.id || 0
      ), N(
        (h) => b.pointAccounts.some((P) => P.pointConfigID === h) ? h : b.pointAccounts[0]?.pointConfigID || 0
      ));
    }).catch((b) => {
      a && C(Q(b, "加载账户信息失败"));
    }).finally(() => {
      a && v(!1);
    }), () => {
      a = !1;
    };
  }, [n, M]);
  const an = Y(
    () => c?.pointAccounts.find(
      (a) => a.pointConfigID === f
    ) || c?.pointAccounts[0] || null,
    [f, c?.pointAccounts]
  ), $ = an?.pointConfigID || 0, B = an?.name || "积分", w = Y(
    () => c ? {
      ...c,
      subscriptions: c.subscriptions.filter(
        (a) => ye(a, c) === $
      ),
      catalog: c.catalog.filter(
        (a) => a.pointConfig.id === $
      ),
      pointPackages: c.pointPackages.filter(
        (a) => a.pointConfig.id === $
      )
    } : null,
    [$, c]
  ), A = Y(
    () => w?.catalog.find(
      (a) => a.id === d
    ) || w?.catalog[0] || null,
    [d, w?.catalog]
  ), sn = T(
    async (a, b) => {
      if (!H.current) {
        H.current = !0, rn(a);
        try {
          const h = await b();
          h.paymentURL ? (window.open(h.paymentURL, "_blank", "noopener,noreferrer"), z.info("支付页面已打开，完成后可在订单记录中查看状态"), Gn(h).then((P) => {
            P.status === "completed" && (z.success("支付完成，账户权益已更新"), S());
          }).catch(() => {
          })) : h.status === "completed" && z.success("操作已完成"), S();
        } catch (h) {
          z.error(Q(h, "账户操作失败"));
        } finally {
          H.current = !1, rn("");
        }
      }
    },
    [S]
  );
  return /* @__PURE__ */ o(wn, { open: n, onOpenChange: e, children: [
    /* @__PURE__ */ o(
      An,
      {
        showCloseButton: !1,
        layerClassName: "hb-account-layer",
        className: "hb-account-dialog",
        children: [
          /* @__PURE__ */ o(vn, { className: "sr-only", children: [
            /* @__PURE__ */ t($n, { children: "积分与订阅中心" }),
            /* @__PURE__ */ t(Dn, { children: "查看积分、订阅计划、订单与积分明细。" })
          ] }),
          /* @__PURE__ */ o("div", { className: "hb-account-shell", children: [
            /* @__PURE__ */ t(
              fe,
              {
                overview: w,
                view: i,
                activePointConfigID: $,
                pointName: B,
                onViewChange: l,
                onPointConfigChange: N,
                onClose: () => e(!1)
              }
            ),
            /* @__PURE__ */ o("main", { className: "hb-account-main", children: [
              k && !c ? /* @__PURE__ */ t(gn, {}) : null,
              !k && m ? /* @__PURE__ */ t(yn, { message: m, onRetry: S }) : null,
              w && !m ? /* @__PURE__ */ o(q, { children: [
                i === "plans" ? /* @__PURE__ */ t(
                  ae,
                  {
                    overview: w,
                    activeIdentity: A,
                    activeIdentityID: A?.id || 0,
                    pointName: B,
                    busyKey: E,
                    onIdentityChange: r,
                    onCheckout: (a) => {
                      const b = w.pointAccounts.find(
                        (P) => P.pointConfigID === A?.pointConfig.id
                      )?.availableBalance || 0, h = Math.max(a.checkoutPoints - b, 0);
                      O({
                        key: `plan-${a.id}`,
                        title: `${A?.name || "订阅"} · ${a.name}`,
                        detail: A?.currentLevelID ? "方案变更将立即生效" : "开通订阅方案",
                        pointAmount: a.checkoutPoints,
                        pointName: A?.pointConfig.name || "积分",
                        payAmountMicros: ie(
                          h,
                          A?.pointConfig.exchangeRate || 0
                        ),
                        paymentUnavailable: h > 0 && (A?.pointConfig.exchangeRate || 0) <= 0,
                        action: () => Wn(a.id)
                      });
                    }
                  }
                ) : null,
                i === "points" ? /* @__PURE__ */ t(
                  le,
                  {
                    overview: w,
                    pointName: B,
                    busyKey: E,
                    onCheckout: (a) => O({
                      key: `package-${a.id}`,
                      title: a.name,
                      detail: `到账 ${y(a.pointAmount + a.bonusAmount)} ${a.pointConfig.name}`,
                      pointAmount: a.pointAmount + a.bonusAmount,
                      pointName: a.pointConfig.name,
                      payAmountMicros: a.payAmountMicros,
                      action: () => Hn(a.id)
                    })
                  }
                ) : null,
                i === "orders" ? /* @__PURE__ */ t(
                  ue,
                  {
                    resetKey: M,
                    pointConfigID: $,
                    pointName: B,
                    busyKey: E,
                    onAction: (a, b) => {
                      sn(a, b);
                    }
                  }
                ) : null,
                i === "logs" ? /* @__PURE__ */ t(
                  de,
                  {
                    resetKey: M,
                    pointConfigID: $,
                    pointName: B
                  }
                ) : null
              ] }) : null
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ t(
      Ne,
      {
        intent: W,
        busy: !!E,
        onClose: () => O(null),
        onConfirm: () => {
          if (!W)
            return;
          const a = W;
          O(null), sn(a.key, a.action);
        }
      }
    )
  ] });
}
function fe({
  overview: n,
  view: e,
  activePointConfigID: i,
  pointName: l,
  onViewChange: c,
  onPointConfigChange: u,
  onClose: d
}) {
  const f = he((m) => m.auth).user, N = f?.name || n?.user.name || "账户中心", k = [
    { key: "plans", label: "订阅计划", icon: nn },
    { key: "points", label: `购买${l}`, icon: Fn },
    { key: "orders", label: `${l}订单`, icon: mn },
    { key: "logs", label: `${l}明细`, icon: En }
  ], v = n ? ge(n) : "";
  return /* @__PURE__ */ o("header", { className: "hb-account-header", children: [
    /* @__PURE__ */ o("div", { className: "hb-account-user", children: [
      /* @__PURE__ */ t(
        Tn,
        {
          src: f?.avatar,
          name: N,
          account: f?.account,
          className: "hb-account-avatar"
        }
      ),
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ t("strong", { children: N }),
        n ? /* @__PURE__ */ o("div", { className: "hb-account-user-meta", children: [
          n.pointAccounts.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-account-point-picker", children: /* @__PURE__ */ t(
            Un,
            {
              value: i,
              ariaLabel: "切换积分账户",
              options: n.pointAccounts.map((m) => ({
                id: m.pointConfigID,
                name: `${y(m.balance)} ${m.name}`
              })),
              onValueChange: u
            }
          ) }) : /* @__PURE__ */ t("span", { children: "0 积分" }),
          /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "·" }),
          /* @__PURE__ */ t(be, { overview: n }),
          v ? /* @__PURE__ */ o(q, { children: [
            /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "·" }),
            /* @__PURE__ */ o("span", { className: "hb-account-user-expiry", children: [
              "最近到期 ",
              v
            ] })
          ] }) : null
        ] }) : /* @__PURE__ */ t("span", { className: "hb-account-user-placeholder", children: "积分与订阅" })
      ] })
    ] }),
    /* @__PURE__ */ t("nav", { className: "hb-account-nav", "aria-label": "账户中心导航", children: k.map((m) => {
      const C = m.icon;
      return /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: e === m.key ? "is-active" : "",
          onClick: () => c(m.key),
          children: [
            /* @__PURE__ */ t(C, {}),
            /* @__PURE__ */ t("span", { children: m.label })
          ]
        },
        m.key
      );
    }) }),
    /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        className: "hb-account-close",
        title: "关闭",
        "aria-label": "关闭账户中心",
        onClick: d,
        children: /* @__PURE__ */ t(On, {})
      }
    )
  ] });
}
function be({ overview: n }) {
  return n.subscriptions.length === 0 ? /* @__PURE__ */ t("span", { className: "hb-account-subscription-empty", children: "0 个有效订阅" }) : /* @__PURE__ */ o("details", { className: "hb-account-subscription-menu", children: [
    /* @__PURE__ */ o(
      "summary",
      {
        className: "hb-account-subscription-trigger",
        "aria-label": `查看 ${n.subscriptions.length} 个有效订阅`,
        children: [
          /* @__PURE__ */ o("span", { children: [
            n.subscriptions.length,
            " 个有效订阅"
          ] }),
          /* @__PURE__ */ t(Sn, {})
        ]
      }
    ),
    /* @__PURE__ */ o("div", { className: "hb-account-subscription-popover", children: [
      /* @__PURE__ */ t("strong", { children: "有效订阅" }),
      /* @__PURE__ */ t("div", { className: "hb-account-subscription-list", children: n.subscriptions.map((e) => /* @__PURE__ */ o("div", { className: "hb-account-subscription-row", children: [
        /* @__PURE__ */ o("div", { children: [
          /* @__PURE__ */ t("strong", { children: e.identityName || "订阅身份" }),
          /* @__PURE__ */ t("span", { children: e.levelName || "已订阅" })
        ] }),
        /* @__PURE__ */ o("small", { children: [
          "有效期至 ",
          fn(e.expiredAt)
        ] })
      ] }, e.id)) })
    ] })
  ] });
}
function ge(n) {
  const e = n.subscriptions.map((i) => i.expiredAt).filter(Boolean).sort()[0];
  return e ? fn(e) : "";
}
function ye(n, e) {
  return n.pointConfigID > 0 ? n.pointConfigID : e.catalog.find(
    (i) => i.id === n.identityID
  )?.pointConfig.id || 0;
}
function Ne({
  intent: n,
  busy: e,
  onClose: i,
  onConfirm: l
}) {
  return /* @__PURE__ */ t(
    wn,
    {
      open: !!n,
      onOpenChange: (c) => {
        c || i();
      },
      children: /* @__PURE__ */ o(An, { className: "hb-account-confirm sm:max-w-md", children: [
        /* @__PURE__ */ o(vn, { children: [
          /* @__PURE__ */ t($n, { children: "确认购买" }),
          /* @__PURE__ */ t(Dn, { children: n?.detail || "确认当前账户操作" })
        ] }),
        n ? /* @__PURE__ */ o("div", { className: "hb-account-confirm-detail", children: [
          /* @__PURE__ */ t("strong", { children: n.title }),
          /* @__PURE__ */ o("dl", { children: [
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ t("dt", { children: "积分" }),
              /* @__PURE__ */ o("dd", { children: [
                y(n.pointAmount),
                " ",
                n.pointName
              ] })
            ] }),
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ t("dt", { children: "需支付" }),
              /* @__PURE__ */ t("dd", { children: n.paymentUnavailable ? "支付换算未配置" : n.payAmountMicros > 0 ? on(n.payAmountMicros) : "使用积分余额" })
            ] })
          ] })
        ] }) : null,
        /* @__PURE__ */ o(pe, { children: [
          /* @__PURE__ */ t(un, { variant: "outline", disabled: e, onClick: i, children: "取消" }),
          /* @__PURE__ */ o(un, { disabled: e || !!n?.paymentUnavailable, onClick: l, children: [
            e ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
            "确认"
          ] })
        ] })
      ] })
    }
  );
}
export {
  Pe as WorkbenchAccountCenter
};
