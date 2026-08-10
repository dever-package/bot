import { j as i, a as t, F as j } from "./_commonjsHelpers-CTFd9u1x.js";
import { b as O, l as g, o as an, u as $n, d as Y } from "./react-C7Xtl8sB.js";
import { t as E } from "./index-BxqXLJC9.js";
import { L as x, C as Pn, R as F, aa as rn, ab as X, ac as on, b as In, ad as G, ae as wn, af as xn, p as Bn, ag as vn, ah as Ln, X as Rn, j as Mn } from "./vendor-icons-Cc7Kl3It.js";
import { m as V } from "./button-CpfaQlDK.js";
import { m as B } from "./dialog-Oss_U0H4.js";
import { m as Sn } from "./project-dialogs-CdThoMTm.js";
import { m as sn } from "./in-flight-request-DlB1DJg0.js";
import { s as R, a as _, r as s, c as p, j as Q } from "./site-config-BVY1isir.js";
import { c as zn } from "./space-add-node-menu-pcpVf0B3.js";
import { W as Tn } from "./home-shell-CgpDp6ol.js";
import { W as Un } from "./workbench-picker-CWBZz8Mi.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./workbench-account-center-BfQYmzoL.css", import.meta.url).href]);
const M = sn.joinSiteApi, S = sn.request;
async function En() {
  const n = await S(M("account/overview"), "get"), e = R(n, "加载账户信息失败");
  return {
    user: {
      id: p(e.user?.id),
      name: s(e.user?.name) || "用户",
      account: s(e.user?.account)
    },
    pointAccounts: _(e.point_accounts).map(Qn).filter((o) => o.pointConfigID > 0),
    subscriptions: _(e.subscriptions).map(Xn).filter((o) => o.identityID > 0),
    catalog: _(e.catalog).map(Gn).filter((o) => o.id > 0 && o.levels.length > 0),
    pointPackages: _(e.point_packages).map(Kn).filter((o) => o.id > 0)
  };
}
async function On(n, e = "", o = 20) {
  const l = await S(M("account/point_logs"), "get", {
    point_config_id: n,
    cursor: e || void 0,
    limit: o
  }), c = R(l, "加载积分明细失败");
  return {
    items: _(c.items).map(Zn).filter((u) => u.id > 0),
    nextCursor: s(c.next_cursor)
  };
}
async function Fn(n, e = "", o = 20) {
  const l = await S(M("account/orders"), "get", {
    point_config_id: n,
    cursor: e || void 0,
    limit: o
  }), c = R(l, "加载订单记录失败");
  return {
    items: _(c.items).map(J).filter((u) => u.id > 0),
    nextCursor: s(c.next_cursor)
  };
}
async function jn(n) {
  return q("subscription_checkout", {
    level_id: n,
    request_id: un()
  });
}
async function Vn(n) {
  return q("point_checkout", {
    package_id: n,
    request_id: un()
  });
}
async function qn(n) {
  return q("order_cancel", {
    type: n.type,
    order_no: n.orderNo
  });
}
async function Wn(n) {
  return q("order_retry", {
    type: n.type,
    order_no: n.orderNo
  });
}
async function Hn(n) {
  const e = await S(M("account/order_status"), "get", {
    type: n.type,
    order_no: n.orderNo
  });
  return J(R(e, "加载订单状态失败"));
}
async function Yn(n, e = 30, o = 2e3) {
  let l = n;
  for (let c = 0; c < e; c += 1) {
    if (!["pending_payment", "paying", "paid", "fulfilling"].includes(l.status))
      return l;
    await ne(o), l = await Hn(l);
  }
  return l;
}
async function q(n, e) {
  const o = await S(M(`account/${n}`), "post", e);
  return J(R(o, "账户操作失败"));
}
function ln(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "积分",
    symbol: s(n?.symbol),
    symbolPosition: Number(n?.symbol_position || 2),
    exchangeRate: Number(n?.exchange_rate || 0)
  };
}
function Qn(n) {
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
function Xn(n) {
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
function Gn(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "订阅",
    pointConfig: ln(n?.point_config),
    levels: _(n?.levels).map(Jn).filter((e) => e.id > 0),
    currentLevelID: p(n?.current_level_id),
    currentExpiredAt: s(n?.current_expired_at)
  };
}
function Jn(n) {
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
function Kn(n) {
  return {
    id: p(n?.id),
    name: s(n?.name) || "积分套餐",
    pointConfig: ln(n?.point_config),
    pointAmount: Number(n?.point_amount || 0),
    bonusAmount: Number(n?.bonus_amount || 0),
    payAmountMicros: Number(n?.pay_amount_micros || 0)
  };
}
function J(n) {
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
function Zn(n) {
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
function un() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `account-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ne(n) {
  return new Promise((e) => window.setTimeout(e, n));
}
function y(n) {
  return new Intl.NumberFormat("zh-CN").format(Number(n || 0));
}
function K(n) {
  const e = Number(n || 0) / 1e6;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: e % 1 === 0 ? 0 : 2
  }).format(e);
}
function ee(n, e) {
  return n <= 0 || e <= 0 ? 0 : Math.ceil(n * 1e6 / e);
}
function te(n) {
  return n >= 365 && n % 365 === 0 ? `${n / 365} 年` : n >= 30 && n % 30 === 0 ? `${n / 30} 个月` : `${n} 天`;
}
function dn(n) {
  if (!n)
    return "";
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? n : e.toLocaleDateString("zh-CN");
}
function mn(n) {
  if (!n)
    return "-";
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? n : e.toLocaleString("zh-CN", { hour12: !1 });
}
const ie = V.Button;
function pn({ compact: n = !1 }) {
  return /* @__PURE__ */ i("div", { className: `hb-account-state${n ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ t(x, { className: "animate-spin" }),
    /* @__PURE__ */ t("span", { children: "正在加载账户信息" })
  ] });
}
function hn({
  message: n,
  onRetry: e,
  compact: o = !1
}) {
  return /* @__PURE__ */ i("div", { className: `hb-account-state is-error${o ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ t(Pn, {}),
    /* @__PURE__ */ t("strong", { children: "加载失败" }),
    /* @__PURE__ */ t("span", { children: n }),
    /* @__PURE__ */ i(ie, { variant: "outline", onClick: e, children: [
      /* @__PURE__ */ t(F, {}),
      "重试"
    ] })
  ] });
}
function Z({ icon: n, text: e }) {
  return /* @__PURE__ */ i("div", { className: "hb-account-empty", children: [
    n || /* @__PURE__ */ t(rn, {}),
    /* @__PURE__ */ t("span", { children: e })
  ] });
}
const fn = V.Button;
function oe({
  overview: n,
  activeIdentity: e,
  activeIdentityID: o,
  pointName: l,
  busyKey: c,
  onIdentityChange: u,
  onCheckout: d
}) {
  return /* @__PURE__ */ i("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ i("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ i("div", { children: [
        /* @__PURE__ */ t("h2", { children: "订阅计划" }),
        /* @__PURE__ */ i("p", { children: [
          n.catalog.length,
          " 个使用",
          l,
          "的订阅身份"
        ] })
      ] }),
      n.catalog.length > 1 ? /* @__PURE__ */ t("div", { className: "hb-account-identity-switch", "aria-label": "订阅身份", children: n.catalog.map((a) => /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: a.id === o ? "is-active" : "",
          onClick: () => u(a.id),
          children: a.name
        },
        a.id
      )) }) : null
    ] }),
    e ? /* @__PURE__ */ t("div", { className: "hb-account-plan-grid", children: e.levels.map((a) => /* @__PURE__ */ t(
      ce,
      {
        identity: e,
        plan: a,
        busy: c === `plan-${a.id}`,
        disabled: !!c,
        onCheckout: () => d(a)
      },
      a.id
    )) }) : /* @__PURE__ */ t(
      Z,
      {
        icon: /* @__PURE__ */ t(X, {}),
        text: `暂无使用${l}的订阅计划`
      }
    )
  ] });
}
function ce({
  identity: n,
  plan: e,
  busy: o,
  disabled: l,
  onCheckout: c
}) {
  const u = n.currentLevelID === e.id, d = u ? "续订当前方案" : n.currentLevelID ? "切换到此方案" : "立即订阅";
  return /* @__PURE__ */ i("article", { className: `hb-account-plan${u ? " is-current" : ""}`, children: [
    /* @__PURE__ */ i("div", { className: "hb-account-plan-head", children: [
      /* @__PURE__ */ i("div", { children: [
        /* @__PURE__ */ t("span", { children: n.name }),
        /* @__PURE__ */ t("h3", { children: e.name })
      ] }),
      u ? /* @__PURE__ */ t("em", { children: "当前方案" }) : null
    ] }),
    /* @__PURE__ */ i("div", { className: "hb-account-plan-price", children: [
      /* @__PURE__ */ t("strong", { children: y(e.checkoutPoints) }),
      /* @__PURE__ */ t("span", { children: n.pointConfig.name })
    ] }),
    /* @__PURE__ */ i("p", { className: "hb-account-plan-cash", children: [
      "参考价 ",
      K(e.payAmountMicros),
      " · ",
      te(e.durationDays)
    ] }),
    /* @__PURE__ */ t("div", { className: "hb-account-plan-benefits", children: e.benefitDescriptions.length > 0 ? e.benefitDescriptions.map((a, f) => {
      const N = zn(
        a.icon,
        In
      );
      return /* @__PURE__ */ i("span", { children: [
        /* @__PURE__ */ t(N, {}),
        a.text
      ] }, `${a.text}-${f}`);
    }) : /* @__PURE__ */ i(j, { children: [
      e.periodicBenefits.map((a, f) => /* @__PURE__ */ i("span", { children: [
        /* @__PURE__ */ t(G, {}),
        "每 ",
        a.cycleDays,
        " 天 ",
        y(a.pointAmount),
        " ",
        a.pointName
      ] }, `${a.pointName}-${f}`)),
      e.billingBenefits.map((a, f) => /* @__PURE__ */ i("span", { children: [
        /* @__PURE__ */ t(wn, {}),
        "能力计费系数 ",
        a.saleRatio || "1"
      ] }, `${a.scope}-${f}`)),
      e.periodicBenefits.length === 0 && e.billingBenefits.length === 0 ? /* @__PURE__ */ i("span", { children: [
        /* @__PURE__ */ t(xn, {}),
        "有效期内享受当前等级权益"
      ] }) : null
    ] }) }),
    /* @__PURE__ */ i(fn, { className: "w-full", disabled: l, onClick: c, children: [
      o ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
      o ? "处理中" : d
    ] })
  ] });
}
function ae({
  overview: n,
  pointName: e,
  busyKey: o,
  onCheckout: l
}) {
  return /* @__PURE__ */ i("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ t("div", { className: "hb-account-section-heading", children: /* @__PURE__ */ i("div", { children: [
      /* @__PURE__ */ i("h2", { children: [
        "购买",
        e
      ] }),
      /* @__PURE__ */ i("p", { children: [
        n.pointPackages.length,
        " 个可用套餐"
      ] })
    ] }) }),
    n.pointPackages.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-account-package-grid", children: n.pointPackages.map((c) => /* @__PURE__ */ i("article", { className: "hb-account-package", children: [
      /* @__PURE__ */ t(on, {}),
      /* @__PURE__ */ t("h3", { children: c.name }),
      /* @__PURE__ */ i("strong", { children: [
        y(c.pointAmount + c.bonusAmount),
        " ",
        c.pointConfig.name
      ] }),
      /* @__PURE__ */ i("p", { children: [
        "基础 ",
        y(c.pointAmount),
        c.bonusAmount > 0 ? `，赠送 ${y(c.bonusAmount)}` : ""
      ] }),
      /* @__PURE__ */ i(
        fn,
        {
          variant: "outline",
          disabled: !!o,
          onClick: () => l(c),
          children: [
            o === `package-${c.id}` ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
            K(c.payAmountMicros)
          ]
        }
      )
    ] }, c.id)) }) : /* @__PURE__ */ t(
      Z,
      {
        icon: /* @__PURE__ */ t(on, {}),
        text: `暂无可购买的${e}套餐`
      }
    )
  ] });
}
const w = V.Button;
function re({
  resetKey: n,
  pointConfigID: e,
  pointName: o,
  busyKey: l,
  onAction: c
}) {
  const u = bn(e, Fn), d = gn(n, u);
  return /* @__PURE__ */ i("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ i("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ i("h2", { children: [
        o,
        "订单"
      ] }) }),
      /* @__PURE__ */ i(
        w,
        {
          variant: "outline",
          size: "sm",
          disabled: d.loading,
          onClick: d.reload,
          children: [
            /* @__PURE__ */ t(F, { className: d.loading ? "animate-spin" : "" }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(yn, { page: d, emptyText: `暂无${o}订单`, children: /* @__PURE__ */ t("div", { className: "hb-account-record-list", children: d.items.map((a) => /* @__PURE__ */ i(
      "article",
      {
        className: "hb-account-record",
        children: [
          /* @__PURE__ */ t("span", { className: `hb-account-record-mark is-${a.type}`, children: a.type === "identity" ? /* @__PURE__ */ t(X, {}) : /* @__PURE__ */ t(G, {}) }),
          /* @__PURE__ */ i("div", { className: "hb-account-record-copy", children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ t("strong", { children: a.title }),
              /* @__PURE__ */ t(le, { status: a.status })
            ] }),
            /* @__PURE__ */ i("p", { children: [
              y(a.totalPoints),
              " ",
              a.pointName || o,
              " ·",
              " ",
              mn(a.createdAt)
            ] }),
            a.error ? /* @__PURE__ */ t("small", { children: a.error }) : null
          ] }),
          /* @__PURE__ */ i("div", { className: "hb-account-record-actions", children: [
            a.paymentURL && a.status === "paying" ? /* @__PURE__ */ t(
              w,
              {
                size: "sm",
                onClick: () => window.open(a.paymentURL, "_blank", "noopener,noreferrer"),
                children: "继续支付"
              }
            ) : null,
            a.canRetry ? /* @__PURE__ */ i(
              w,
              {
                size: "sm",
                variant: "outline",
                disabled: !!l,
                onClick: () => c(
                  `retry-${a.type}-${a.id}`,
                  () => Wn(a)
                ),
                children: [
                  l === `retry-${a.type}-${a.id}` ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : /* @__PURE__ */ t(F, {}),
                  "重试"
                ]
              }
            ) : null,
            a.canCancel ? /* @__PURE__ */ t(
              w,
              {
                size: "sm",
                variant: "ghost",
                disabled: !!l,
                onClick: () => c(
                  `cancel-${a.type}-${a.id}`,
                  () => qn(a)
                ),
                children: "取消"
              }
            ) : null
          ] })
        ]
      },
      `${a.type}-${a.id}`
    )) }) })
  ] });
}
function se({
  resetKey: n,
  pointConfigID: e,
  pointName: o
}) {
  const l = bn(e, On), c = gn(n, l);
  return /* @__PURE__ */ i("section", { className: "hb-account-section", children: [
    /* @__PURE__ */ i("div", { className: "hb-account-section-heading", children: [
      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ i("h2", { children: [
        o,
        "明细"
      ] }) }),
      /* @__PURE__ */ i(
        w,
        {
          variant: "outline",
          size: "sm",
          disabled: c.loading,
          onClick: c.reload,
          children: [
            /* @__PURE__ */ t(F, { className: c.loading ? "animate-spin" : "" }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ t(yn, { page: c, emptyText: `暂无${o}明细`, children: /* @__PURE__ */ t("div", { className: "hb-account-record-list", children: c.items.map((u) => {
      const d = u.changeType === "increase";
      return /* @__PURE__ */ i("article", { className: "hb-account-record", children: [
        /* @__PURE__ */ t(
          "span",
          {
            className: `hb-account-record-mark ${d ? "is-increase" : "is-consume"}`,
            children: /* @__PURE__ */ t(G, {})
          }
        ),
        /* @__PURE__ */ i("div", { className: "hb-account-record-copy", children: [
          /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t("strong", { children: u.remark || (d ? `${o}增加` : `${o}消费`) }) }),
          /* @__PURE__ */ i("p", { children: [
            u.pointName,
            " · ",
            mn(u.createdAt),
            " · 余额",
            " ",
            y(u.balanceAfter)
          ] })
        ] }),
        /* @__PURE__ */ i(
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
function bn(n, e) {
  return O(
    (o = "", l = 20) => n > 0 ? e(n, o, l) : Promise.resolve({ items: [], nextCursor: "" }),
    [e, n]
  );
}
function gn(n, e) {
  const [o, l] = g([]), [c, u] = g(""), [d, a] = g(!1), [f, N] = g(""), A = O(
    async ($, m) => {
      a(!0), N("");
      try {
        const C = await e($, 20);
        l((v) => m ? [...v, ...C.items] : C.items), u(C.nextCursor);
      } catch (C) {
        N(Q(C, "加载记录失败"));
      } finally {
        a(!1);
      }
    },
    [e]
  );
  return an(() => {
    l([]), u(""), A("", !1);
  }, [A, n]), {
    items: o,
    cursor: c,
    loading: d,
    error: f,
    reload: () => {
      A("", !1);
    },
    loadMore: () => {
      A(c, !0);
    }
  };
}
function yn({
  page: n,
  emptyText: e,
  children: o
}) {
  return n.loading && n.items.length === 0 ? /* @__PURE__ */ t(pn, { compact: !0 }) : n.error && n.items.length === 0 ? /* @__PURE__ */ t(hn, { message: n.error, onRetry: n.reload, compact: !0 }) : n.items.length === 0 ? /* @__PURE__ */ t(Z, { text: e }) : /* @__PURE__ */ i(j, { children: [
    o,
    n.cursor ? /* @__PURE__ */ t("div", { className: "hb-account-load-more", children: /* @__PURE__ */ i(w, { variant: "outline", disabled: n.loading, onClick: n.loadMore, children: [
      n.loading ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : /* @__PURE__ */ t(Bn, {}),
      n.loading ? "加载中" : "加载更多"
    ] }) }) : null,
    n.error ? /* @__PURE__ */ t("p", { className: "hb-account-inline-error", children: n.error }) : null
  ] });
}
function le({ status: n }) {
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
const cn = V.Button, Nn = B.Dialog, Cn = B.DialogContent, _n = B.DialogDescription, ue = B.DialogFooter, An = B.DialogHeader, kn = B.DialogTitle, de = Sn.useAuthStore;
function xe({
  open: n,
  onOpenChange: e
}) {
  const [o, l] = g("plans"), [c, u] = g(null), [d, a] = g(0), [f, N] = g(0), [A, $] = g(!1), [m, C] = g(""), [v, Dn] = g(0), [z, nn] = g(""), [W, T] = g(null), H = $n(!1), U = O(() => Dn((r) => r + 1), []);
  an(() => {
    if (!n)
      return;
    let r = !0;
    return $(!0), C(""), En().then((b) => {
      r && (u(b), a(
        (h) => b.catalog.some((I) => I.id === h) ? h : b.catalog[0]?.id || 0
      ), N(
        (h) => b.pointAccounts.some((I) => I.pointConfigID === h) ? h : b.pointAccounts[0]?.pointConfigID || 0
      ));
    }).catch((b) => {
      r && C(Q(b, "加载账户信息失败"));
    }).finally(() => {
      r && $(!1);
    }), () => {
      r = !1;
    };
  }, [n, v]);
  const en = Y(
    () => c?.pointAccounts.find(
      (r) => r.pointConfigID === f
    ) || c?.pointAccounts[0] || null,
    [f, c?.pointAccounts]
  ), P = en?.pointConfigID || 0, L = en?.name || "积分", k = Y(
    () => c ? {
      ...c,
      subscriptions: c.subscriptions.filter(
        (r) => fe(r, c) === P
      ),
      catalog: c.catalog.filter(
        (r) => r.pointConfig.id === P
      ),
      pointPackages: c.pointPackages.filter(
        (r) => r.pointConfig.id === P
      )
    } : null,
    [P, c]
  ), D = Y(
    () => k?.catalog.find(
      (r) => r.id === d
    ) || k?.catalog[0] || null,
    [d, k?.catalog]
  ), tn = O(
    async (r, b) => {
      if (!H.current) {
        H.current = !0, nn(r);
        try {
          const h = await b();
          h.paymentURL ? (window.open(h.paymentURL, "_blank", "noopener,noreferrer"), E.info("支付页面已打开，完成后可在订单记录中查看状态"), Yn(h).then((I) => {
            I.status === "completed" && (E.success("支付完成，账户权益已更新"), U());
          }).catch(() => {
          })) : h.status === "completed" && E.success("操作已完成"), U();
        } catch (h) {
          E.error(Q(h, "账户操作失败"));
        } finally {
          H.current = !1, nn("");
        }
      }
    },
    [U]
  );
  return /* @__PURE__ */ i(Nn, { open: n, onOpenChange: e, children: [
    /* @__PURE__ */ i(
      Cn,
      {
        showCloseButton: !1,
        layerClassName: "hb-account-layer",
        className: "hb-account-dialog",
        children: [
          /* @__PURE__ */ i(An, { className: "sr-only", children: [
            /* @__PURE__ */ t(kn, { children: "积分与订阅中心" }),
            /* @__PURE__ */ t(_n, { children: "查看积分、订阅计划、订单与积分明细。" })
          ] }),
          /* @__PURE__ */ i("div", { className: "hb-account-shell", children: [
            /* @__PURE__ */ t(
              me,
              {
                overview: k,
                view: o,
                activePointConfigID: P,
                pointName: L,
                onViewChange: l,
                onPointConfigChange: N,
                onClose: () => e(!1)
              }
            ),
            /* @__PURE__ */ i("main", { className: "hb-account-main", children: [
              A && !c ? /* @__PURE__ */ t(pn, {}) : null,
              !A && m ? /* @__PURE__ */ t(hn, { message: m, onRetry: U }) : null,
              k && !m ? /* @__PURE__ */ i(j, { children: [
                o === "plans" ? /* @__PURE__ */ t(
                  oe,
                  {
                    overview: k,
                    activeIdentity: D,
                    activeIdentityID: D?.id || 0,
                    pointName: L,
                    busyKey: z,
                    onIdentityChange: a,
                    onCheckout: (r) => {
                      const b = k.pointAccounts.find(
                        (I) => I.pointConfigID === D?.pointConfig.id
                      )?.availableBalance || 0, h = Math.max(r.checkoutPoints - b, 0);
                      T({
                        key: `plan-${r.id}`,
                        title: `${D?.name || "订阅"} · ${r.name}`,
                        detail: D?.currentLevelID ? "方案变更将立即生效" : "开通订阅方案",
                        pointAmount: r.checkoutPoints,
                        pointName: D?.pointConfig.name || "积分",
                        payAmountMicros: ee(
                          h,
                          D?.pointConfig.exchangeRate || 0
                        ),
                        paymentUnavailable: h > 0 && (D?.pointConfig.exchangeRate || 0) <= 0,
                        action: () => jn(r.id)
                      });
                    }
                  }
                ) : null,
                o === "points" ? /* @__PURE__ */ t(
                  ae,
                  {
                    overview: k,
                    pointName: L,
                    busyKey: z,
                    onCheckout: (r) => T({
                      key: `package-${r.id}`,
                      title: r.name,
                      detail: `到账 ${y(r.pointAmount + r.bonusAmount)} ${r.pointConfig.name}`,
                      pointAmount: r.pointAmount + r.bonusAmount,
                      pointName: r.pointConfig.name,
                      payAmountMicros: r.payAmountMicros,
                      action: () => Vn(r.id)
                    })
                  }
                ) : null,
                o === "orders" ? /* @__PURE__ */ t(
                  re,
                  {
                    resetKey: v,
                    pointConfigID: P,
                    pointName: L,
                    busyKey: z,
                    onAction: (r, b) => {
                      tn(r, b);
                    }
                  }
                ) : null,
                o === "logs" ? /* @__PURE__ */ t(
                  se,
                  {
                    resetKey: v,
                    pointConfigID: P,
                    pointName: L
                  }
                ) : null
              ] }) : null
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ t(
      be,
      {
        intent: W,
        busy: !!z,
        onClose: () => T(null),
        onConfirm: () => {
          if (!W)
            return;
          const r = W;
          T(null), tn(r.key, r.action);
        }
      }
    )
  ] });
}
function me({
  overview: n,
  view: e,
  activePointConfigID: o,
  pointName: l,
  onViewChange: c,
  onPointConfigChange: u,
  onClose: d
}) {
  const f = de((m) => m.auth).user, N = f?.name || n?.user.name || "账户中心", A = [
    { key: "plans", label: "订阅计划", icon: X },
    { key: "points", label: `购买${l}`, icon: vn },
    { key: "orders", label: `${l}订单`, icon: rn },
    { key: "logs", label: `${l}明细`, icon: Ln }
  ], $ = n ? he(n) : "";
  return /* @__PURE__ */ i("header", { className: "hb-account-header", children: [
    /* @__PURE__ */ i("div", { className: "hb-account-user", children: [
      /* @__PURE__ */ t(
        Tn,
        {
          src: f?.avatar,
          name: N,
          account: f?.account,
          className: "hb-account-avatar"
        }
      ),
      /* @__PURE__ */ i("div", { children: [
        /* @__PURE__ */ t("strong", { children: N }),
        n ? /* @__PURE__ */ i("div", { className: "hb-account-user-meta", children: [
          n.pointAccounts.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-account-point-picker", children: /* @__PURE__ */ t(
            Un,
            {
              value: o,
              ariaLabel: "切换积分账户",
              options: n.pointAccounts.map((m) => ({
                id: m.pointConfigID,
                name: `${y(m.balance)} ${m.name}`
              })),
              onValueChange: u
            }
          ) }) : /* @__PURE__ */ t("span", { children: "0 积分" }),
          /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "·" }),
          /* @__PURE__ */ t(pe, { overview: n }),
          $ ? /* @__PURE__ */ i(j, { children: [
            /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "·" }),
            /* @__PURE__ */ i("span", { className: "hb-account-user-expiry", children: [
              "最近到期 ",
              $
            ] })
          ] }) : null
        ] }) : /* @__PURE__ */ t("span", { className: "hb-account-user-placeholder", children: "积分与订阅" })
      ] })
    ] }),
    /* @__PURE__ */ t("nav", { className: "hb-account-nav", "aria-label": "账户中心导航", children: A.map((m) => {
      const C = m.icon;
      return /* @__PURE__ */ i(
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
        children: /* @__PURE__ */ t(Rn, {})
      }
    )
  ] });
}
function pe({ overview: n }) {
  return n.subscriptions.length === 0 ? /* @__PURE__ */ t("span", { className: "hb-account-subscription-empty", children: "0 个有效订阅" }) : /* @__PURE__ */ i("details", { className: "hb-account-subscription-menu", children: [
    /* @__PURE__ */ i(
      "summary",
      {
        className: "hb-account-subscription-trigger",
        "aria-label": `查看 ${n.subscriptions.length} 个有效订阅`,
        children: [
          /* @__PURE__ */ i("span", { children: [
            n.subscriptions.length,
            " 个有效订阅"
          ] }),
          /* @__PURE__ */ t(Mn, {})
        ]
      }
    ),
    /* @__PURE__ */ i("div", { className: "hb-account-subscription-popover", children: [
      /* @__PURE__ */ t("strong", { children: "有效订阅" }),
      /* @__PURE__ */ t("div", { className: "hb-account-subscription-list", children: n.subscriptions.map((e) => /* @__PURE__ */ i("div", { className: "hb-account-subscription-row", children: [
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ t("strong", { children: e.identityName || "订阅身份" }),
          /* @__PURE__ */ t("span", { children: e.levelName || "已订阅" })
        ] }),
        /* @__PURE__ */ i("small", { children: [
          "有效期至 ",
          dn(e.expiredAt)
        ] })
      ] }, e.id)) })
    ] })
  ] });
}
function he(n) {
  const e = n.subscriptions.map((o) => o.expiredAt).filter(Boolean).sort()[0];
  return e ? dn(e) : "";
}
function fe(n, e) {
  return n.pointConfigID > 0 ? n.pointConfigID : e.catalog.find(
    (o) => o.id === n.identityID
  )?.pointConfig.id || 0;
}
function be({
  intent: n,
  busy: e,
  onClose: o,
  onConfirm: l
}) {
  return /* @__PURE__ */ t(
    Nn,
    {
      open: !!n,
      onOpenChange: (c) => {
        c || o();
      },
      children: /* @__PURE__ */ i(Cn, { className: "hb-account-confirm sm:max-w-md", children: [
        /* @__PURE__ */ i(An, { children: [
          /* @__PURE__ */ t(kn, { children: "确认购买" }),
          /* @__PURE__ */ t(_n, { children: n?.detail || "确认当前账户操作" })
        ] }),
        n ? /* @__PURE__ */ i("div", { className: "hb-account-confirm-detail", children: [
          /* @__PURE__ */ t("strong", { children: n.title }),
          /* @__PURE__ */ i("dl", { children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ t("dt", { children: "积分" }),
              /* @__PURE__ */ i("dd", { children: [
                y(n.pointAmount),
                " ",
                n.pointName
              ] })
            ] }),
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ t("dt", { children: "需支付" }),
              /* @__PURE__ */ t("dd", { children: n.paymentUnavailable ? "支付换算未配置" : n.payAmountMicros > 0 ? K(n.payAmountMicros) : "使用积分余额" })
            ] })
          ] })
        ] }) : null,
        /* @__PURE__ */ i(ue, { children: [
          /* @__PURE__ */ t(cn, { variant: "outline", disabled: e, onClick: o, children: "取消" }),
          /* @__PURE__ */ i(cn, { disabled: e || !!n?.paymentUnavailable, onClick: l, children: [
            e ? /* @__PURE__ */ t(x, { className: "animate-spin" }) : null,
            "确认"
          ] })
        ] })
      ] })
    }
  );
}
export {
  xe as WorkbenchAccountCenter
};
