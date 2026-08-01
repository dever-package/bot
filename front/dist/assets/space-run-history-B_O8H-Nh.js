import { c as l, j as e, a as i } from "./createLucideIcon-CEtb6KSk.js";
import { C as k } from "./circle-alert-QPWZCk4j.js";
import { C } from "./circle-check-DjAs7CDF.js";
import { C as w } from "./circle-x-C9cmJm4R.js";
import { L as c } from "./loader-circle-QnfinZ3F.js";
import { C as S } from "./folder-open-BDsZ1uoi.js";
import { C as z } from "./chevron-right-BCx0yky9.js";
import { R as _ } from "./refresh-cw-BtajSIJx.js";
import { X as j } from "./x-D8YQA7_X.js";
import { m as s } from "./sheet-DLbcD_RG.js";
import { c as R, a as M } from "./space-page-BBWff1fq.js";
import { b as o } from "./upload-asset-api-DAbIOMVJ.js";
const L = [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0", key: "5ilxe3" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0", key: "11zvb9" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7", key: "1iw5b2" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8", key: "c0bmvh" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69", key: "1ruxm7" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8", key: "qkgqxc" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69", key: "1mcia2" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7", key: "1fvljs" }]
], T = l("circle-dashed", L);
const q = [
  ["path", { d: "M12 6v6h4", key: "135r8i" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
], x = l("clock-3", q);
const D = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], E = l("locate-fixed", D), H = s.Sheet, B = s.SheetClose, I = s.SheetContent, X = s.SheetDescription, $ = s.SheetHeader, A = s.SheetTitle;
function ae({
  open: t,
  runs: r,
  loading: a,
  error: d,
  page: m,
  hasNextPage: f,
  onOpenChange: p,
  onRefresh: g,
  onPreviousPage: y,
  onNextPage: v,
  onLocateRun: b
}) {
  return /* @__PURE__ */ e(H, { open: t, onOpenChange: p, children: /* @__PURE__ */ i(
    I,
    {
      side: "right",
      showCloseButton: !1,
      className: "flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl",
      children: [
        /* @__PURE__ */ e($, { className: "border-b px-5 py-4 text-start", children: /* @__PURE__ */ i("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ i("div", { className: "min-w-0", children: [
            /* @__PURE__ */ e(A, { children: "运行记录" }),
            /* @__PURE__ */ e(X, { children: "每页展示 20 条画布执行记录。" })
          ] }),
          /* @__PURE__ */ i("div", { className: "flex shrink-0 items-center gap-1", children: [
            /* @__PURE__ */ e(o, { label: "刷新运行记录", children: /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
                disabled: a,
                onClick: () => {
                  g();
                },
                "aria-label": "刷新运行记录",
                children: a ? /* @__PURE__ */ e(c, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ e(_, { size: 16 })
              }
            ) }),
            /* @__PURE__ */ e(o, { label: "关闭运行记录", children: /* @__PURE__ */ e(B, { asChild: !0, children: /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                "aria-label": "关闭运行记录",
                children: /* @__PURE__ */ e(j, { size: 17 })
              }
            ) }) })
          ] })
        ] }) }),
        /* @__PURE__ */ i("div", { className: "min-h-0 flex-1 overflow-y-auto", children: [
          d ? /* @__PURE__ */ i("div", { className: "flex items-start gap-2 border-b bg-destructive/5 px-5 py-3 text-sm text-destructive", children: [
            /* @__PURE__ */ e(k, { size: 16, className: "mt-0.5 shrink-0" }),
            /* @__PURE__ */ e("span", { children: d })
          ] }) : null,
          a && r.length === 0 ? /* @__PURE__ */ i("div", { className: "flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ e(c, { size: 16, className: "animate-spin" }),
            "正在读取运行记录"
          ] }) : r.length === 0 ? /* @__PURE__ */ i("div", { className: "flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ e(x, { size: 20 }),
            "暂无画布运行记录"
          ] }) : /* @__PURE__ */ e("div", { className: "divide-y", children: r.map((n) => {
            const u = R(n), h = G(n.status), N = !!String(n.start_node_id || "");
            return /* @__PURE__ */ i(
              "section",
              {
                className: "flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/30",
                children: [
                  /* @__PURE__ */ e(F, { status: h }),
                  /* @__PURE__ */ i("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ i("div", { className: "flex items-center justify-between gap-3", children: [
                      /* @__PURE__ */ e("strong", { className: "truncate text-sm font-medium", children: W(n) }),
                      /* @__PURE__ */ e("span", { className: "shrink-0 text-xs text-muted-foreground", children: O(
                        n.updated_at || n.created_at
                      ) })
                    ] }),
                    /* @__PURE__ */ i("div", { className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ e("span", { children: J(h) }),
                      /* @__PURE__ */ i("span", { children: [
                        Number(n.executed || 0),
                        " / ",
                        Number(n.total || 0),
                        " 个节点"
                      ] }),
                      n.request_id ? /* @__PURE__ */ e("span", { className: "max-w-56 truncate font-mono", children: n.request_id }) : null
                    ] }),
                    u ? /* @__PURE__ */ e("p", { className: "mt-2 text-xs leading-5 text-destructive", children: M(u) }) : null
                  ] }),
                  N ? /* @__PURE__ */ e(o, { label: "在画布中定位", children: /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      onClick: () => b(n),
                      "aria-label": "在画布中定位",
                      children: /* @__PURE__ */ e(E, { size: 16 })
                    }
                  ) }) : null
                ]
              },
              K(n)
            );
          }) })
        ] }),
        /* @__PURE__ */ i("footer", { className: "flex items-center justify-between border-t px-5 py-3", children: [
          /* @__PURE__ */ i("span", { className: "text-xs text-muted-foreground", children: [
            "第 ",
            m,
            " 页"
          ] }),
          /* @__PURE__ */ i("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
                disabled: a || m <= 1,
                onClick: () => {
                  y();
                },
                children: [
                  /* @__PURE__ */ e(S, { size: 14 }),
                  "上一页"
                ]
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
                disabled: a || !f,
                onClick: () => {
                  v();
                },
                children: [
                  "下一页",
                  /* @__PURE__ */ e(z, { size: 14 })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function F({ status: t }) {
  return t === "success" ? /* @__PURE__ */ e(
    C,
    {
      size: 17,
      className: "mt-0.5 shrink-0 text-emerald-600"
    }
  ) : t === "fail" ? /* @__PURE__ */ e(w, { size: 17, className: "mt-0.5 shrink-0 text-destructive" }) : t === "running" || t === "pending" ? /* @__PURE__ */ e(
    c,
    {
      size: 17,
      className: "mt-0.5 shrink-0 animate-spin text-primary"
    }
  ) : t === "waiting" ? /* @__PURE__ */ e(x, { size: 17, className: "mt-0.5 shrink-0 text-amber-600" }) : /* @__PURE__ */ e(
    T,
    {
      size: 17,
      className: "mt-0.5 shrink-0 text-muted-foreground"
    }
  );
}
function K(t) {
  return String(t.execution_id || t.run_id || t.request_id || "");
}
function W(t) {
  return t.title || (t.single_node ? "节点运行" : "画布运行");
}
function G(t) {
  const r = String(t || "").trim().toLowerCase();
  return r === "error" ? "fail" : r === "cancelled" ? "canceled" : r;
}
function J(t) {
  return {
    success: "成功",
    fail: "失败",
    running: "运行中",
    pending: "排队中",
    waiting: "等待输入",
    canceled: "已取消"
  }[t] || "未知状态";
}
function O(t) {
  const r = new Date(String(t || ""));
  return Number.isNaN(r.getTime()) ? "" : r.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
export {
  ae as CanvasRunHistoryDrawer
};
