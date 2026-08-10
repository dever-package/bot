import { a as e, j as s, F as r } from "./_commonjsHelpers-CTFd9u1x.js";
import { B as a, X as i, L as c } from "./vendor-icons-Cc7Kl3It.js";
import { m as n } from "./sheet-CM50TMuv.js";
import { u as d, B as h, a as m } from "./content-page-Rh_WXSqU.js";
const p = n.Sheet, u = n.SheetClose, x = n.SheetContent, y = n.SheetDescription, f = n.SheetHeader, S = n.SheetTitle;
function b({
  articleID: o,
  open: t,
  onOpenChange: l
}) {
  return /* @__PURE__ */ e(p, { open: t, onOpenChange: l, children: /* @__PURE__ */ e(
    x,
    {
      side: "right",
      showCloseButton: !1,
      className: "body-content-sheet flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[760px]",
      children: t ? /* @__PURE__ */ e(C, { articleID: o }) : null
    }
  ) });
}
function C({ articleID: o }) {
  const t = d(o);
  return /* @__PURE__ */ s(r, { children: [
    /* @__PURE__ */ s(f, { className: "body-content-sheet-header flex h-14 shrink-0 flex-row items-center gap-3 px-5 py-0 text-start", children: [
      /* @__PURE__ */ e(a, { className: "size-4 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ s("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e(S, { className: "truncate text-sm", children: t.article?.title || "内容详情" }),
        /* @__PURE__ */ e(y, { className: "sr-only", children: "查看内容文章详情" })
      ] }),
      /* @__PURE__ */ e(u, { asChild: !0, children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "body-content-sheet-close",
          "aria-label": "关闭内容详情",
          title: "关闭",
          children: /* @__PURE__ */ e(i, { size: 18 })
        }
      ) })
    ] }),
    /* @__PURE__ */ s("div", { className: "body-content-sheet-scroll", children: [
      t.loading ? /* @__PURE__ */ s("div", { className: "body-content-sheet-loading", "aria-live": "polite", children: [
        /* @__PURE__ */ e(c, { className: "size-5 animate-spin" }),
        /* @__PURE__ */ e("span", { children: "正在读取内容" })
      ] }) : null,
      !t.loading && t.error ? /* @__PURE__ */ e(h, { message: t.error, onRetry: t.reload }) : null,
      !t.loading && t.article ? /* @__PURE__ */ e(m, { article: t.article, showTitle: !1 }) : null
    ] })
  ] });
}
export {
  b as BodyContentArticleSheet
};
