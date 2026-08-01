import { j as e, a as o, F as l } from "./createLucideIcon-CEtb6KSk.js";
import { L as a } from "./loader-circle-QnfinZ3F.js";
import { B as i } from "./user-round-uRCY5ob-.js";
import { X as c } from "./x-D8YQA7_X.js";
import { m as n } from "./sheet-DLbcD_RG.js";
import { u as d, B as h, a as m } from "./content-page-Cb78ARb1.js";
const p = n.Sheet, f = n.SheetClose, u = n.SheetContent, x = n.SheetDescription, y = n.SheetHeader, S = n.SheetTitle;
function A({
  articleID: s,
  open: t,
  onOpenChange: r
}) {
  return /* @__PURE__ */ e(p, { open: t, onOpenChange: r, children: /* @__PURE__ */ e(
    u,
    {
      side: "right",
      showCloseButton: !1,
      className: "body-content-sheet flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[760px]",
      children: t ? /* @__PURE__ */ e(C, { articleID: s }) : null
    }
  ) });
}
function C({ articleID: s }) {
  const t = d(s);
  return /* @__PURE__ */ o(l, { children: [
    /* @__PURE__ */ o(y, { className: "body-content-sheet-header flex h-14 shrink-0 flex-row items-center gap-3 px-5 py-0 text-start", children: [
      /* @__PURE__ */ e(i, { className: "size-4 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ o("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e(S, { className: "truncate text-sm", children: t.article?.title || "内容详情" }),
        /* @__PURE__ */ e(x, { className: "sr-only", children: "查看内容文章详情" })
      ] }),
      /* @__PURE__ */ e(f, { asChild: !0, children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "body-content-sheet-close",
          "aria-label": "关闭内容详情",
          title: "关闭",
          children: /* @__PURE__ */ e(c, { size: 18 })
        }
      ) })
    ] }),
    /* @__PURE__ */ o("div", { className: "body-content-sheet-scroll", children: [
      t.loading ? /* @__PURE__ */ o("div", { className: "body-content-sheet-loading", "aria-live": "polite", children: [
        /* @__PURE__ */ e(a, { className: "size-5 animate-spin" }),
        /* @__PURE__ */ e("span", { children: "正在读取内容" })
      ] }) : null,
      !t.loading && t.error ? /* @__PURE__ */ e(h, { message: t.error, onRetry: t.reload }) : null,
      !t.loading && t.article ? /* @__PURE__ */ e(m, { article: t.article, showTitle: !1 }) : null
    ] })
  ] });
}
export {
  A as BodyContentArticleSheet
};
