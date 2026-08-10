import { a as e, j as t } from "./_commonjsHelpers-CTFd9u1x.js";
import { L as o, R as k, X as R, C as j, l as x, m as L, n as _, o as T, p as D, b as q, q as B, r as E } from "./vendor-icons-Cc7Kl3It.js";
import { m as r } from "./sheet-CM50TMuv.js";
import { c as H, i as A, a as f, b as I } from "./space-page-D3VBae11.js";
import { B as l } from "./storyboard-grid-view-CJXm84yJ.js";
const X = r.Sheet, F = r.SheetClose, M = r.SheetContent, W = r.SheetDescription, G = r.SheetHeader, J = r.SheetTitle;
function te({
  open: n,
  runs: i,
  loading: a,
  error: c,
  page: d,
  hasNextPage: p,
  onOpenChange: g,
  onRefresh: b,
  onPreviousPage: v,
  onNextPage: N,
  onLocateRun: y,
  onStopRun: C,
  stoppingRunKeys: w
}) {
  return /* @__PURE__ */ e(X, { open: n, onOpenChange: g, children: /* @__PURE__ */ t(
    M,
    {
      side: "right",
      showCloseButton: !1,
      className: "flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl",
      children: [
        /* @__PURE__ */ e(G, { className: "border-b px-5 py-4 text-start", children: /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ t("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e(J, { children: "运行记录" }),
            /* @__PURE__ */ e(W, { children: "每页展示 20 条画布执行记录。" })
          ] }),
          /* @__PURE__ */ t("div", { className: "flex shrink-0 items-center gap-1", children: [
            /* @__PURE__ */ e(l, { label: "刷新运行记录", children: /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
                disabled: a,
                onClick: () => {
                  b();
                },
                "aria-label": "刷新运行记录",
                children: a ? /* @__PURE__ */ e(o, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ e(k, { size: 16 })
              }
            ) }),
            /* @__PURE__ */ e(l, { label: "关闭运行记录", children: /* @__PURE__ */ e(F, { asChild: !0, children: /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "aria-label": "关闭运行记录",
                children: /* @__PURE__ */ e(R, { size: 17 })
              }
            ) }) })
          ] })
        ] }) }),
        /* @__PURE__ */ t("div", { className: "min-h-0 flex-1 overflow-y-auto", children: [
          c ? /* @__PURE__ */ t("div", { className: "flex items-start gap-2 border-b bg-destructive/5 px-5 py-3 text-sm text-destructive", children: [
            /* @__PURE__ */ e(j, { size: 16, className: "mt-0.5 shrink-0" }),
            /* @__PURE__ */ e("span", { children: c })
          ] }) : null,
          a && i.length === 0 ? /* @__PURE__ */ t("div", { className: "flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ e(o, { size: 16, className: "animate-spin" }),
            "正在读取运行记录"
          ] }) : i.length === 0 ? /* @__PURE__ */ t("div", { className: "flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ e(x, { size: 20 }),
            "暂无画布运行记录"
          ] }) : /* @__PURE__ */ e("div", { className: "divide-y", children: i.map((s) => {
            const m = H(s), u = P(s.status), S = !!String(s.start_node_id || ""), z = A(s), h = w.has(f(s));
            return /* @__PURE__ */ t(
              "section",
              {
                className: "flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/30",
                children: [
                  /* @__PURE__ */ e(K, { status: u }),
                  /* @__PURE__ */ t("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ t("div", { className: "flex items-center justify-between gap-3", children: [
                      /* @__PURE__ */ e("strong", { className: "truncate text-sm font-medium", children: O(s) }),
                      /* @__PURE__ */ e("span", { className: "shrink-0 text-xs text-muted-foreground", children: U(
                        s.updated_at || s.created_at
                      ) })
                    ] }),
                    /* @__PURE__ */ t("div", { className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ e("span", { children: Q(u) }),
                      /* @__PURE__ */ t("span", { children: [
                        Number(s.executed || 0),
                        " / ",
                        Number(s.total || 0),
                        " 个节点"
                      ] }),
                      s.request_id ? /* @__PURE__ */ e("span", { className: "max-w-56 truncate font-mono", children: s.request_id }) : null
                    ] }),
                    m ? /* @__PURE__ */ e("p", { className: "mt-2 text-xs leading-5 text-destructive", children: I(m) }) : null
                  ] }),
                  /* @__PURE__ */ t("div", { className: "flex shrink-0 items-center gap-1", children: [
                    z ? /* @__PURE__ */ e(l, { label: "停止本次运行", children: /* @__PURE__ */ e(
                      "button",
                      {
                        type: "button",
                        className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50",
                        disabled: h,
                        onClick: () => C(s),
                        "aria-label": "停止本次运行",
                        children: h ? /* @__PURE__ */ e(o, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ e(L, { size: 15, fill: "currentColor" })
                      }
                    ) }) : null,
                    S ? /* @__PURE__ */ e(l, { label: "在画布中定位", children: /* @__PURE__ */ e(
                      "button",
                      {
                        type: "button",
                        className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        onClick: () => y(s),
                        "aria-label": "在画布中定位",
                        children: /* @__PURE__ */ e(_, { size: 16 })
                      }
                    ) }) : null
                  ] })
                ]
              },
              f(s)
            );
          }) })
        ] }),
        /* @__PURE__ */ t("footer", { className: "flex items-center justify-between border-t px-5 py-3", children: [
          /* @__PURE__ */ t("span", { className: "text-xs text-muted-foreground", children: [
            "第 ",
            d,
            " 页"
          ] }),
          /* @__PURE__ */ t("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
                disabled: a || d <= 1,
                onClick: () => {
                  v();
                },
                children: [
                  /* @__PURE__ */ e(T, { size: 14 }),
                  "上一页"
                ]
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
                disabled: a || !p,
                onClick: () => {
                  N();
                },
                children: [
                  "下一页",
                  /* @__PURE__ */ e(D, { size: 14 })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function K({ status: n }) {
  return n === "success" ? /* @__PURE__ */ e(
    q,
    {
      size: 17,
      className: "mt-0.5 shrink-0 text-emerald-600"
    }
  ) : n === "fail" ? /* @__PURE__ */ e(B, { size: 17, className: "mt-0.5 shrink-0 text-destructive" }) : n === "running" || n === "pending" ? /* @__PURE__ */ e(
    o,
    {
      size: 17,
      className: "mt-0.5 shrink-0 animate-spin text-primary"
    }
  ) : n === "waiting" ? /* @__PURE__ */ e(x, { size: 17, className: "mt-0.5 shrink-0 text-amber-600" }) : /* @__PURE__ */ e(
    E,
    {
      size: 17,
      className: "mt-0.5 shrink-0 text-muted-foreground"
    }
  );
}
function O(n) {
  return n.title || (n.single_node ? "节点运行" : "画布运行");
}
function P(n) {
  const i = String(n || "").trim().toLowerCase();
  return i === "error" ? "fail" : i === "cancelled" ? "canceled" : i;
}
function Q(n) {
  return {
    success: "成功",
    fail: "失败",
    running: "运行中",
    pending: "排队中",
    waiting: "等待输入",
    canceled: "已取消"
  }[n] || "未知状态";
}
function U(n) {
  const i = new Date(String(n || ""));
  return Number.isNaN(i.getTime()) ? "" : i.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
export {
  te as CanvasRunHistoryDrawer
};
