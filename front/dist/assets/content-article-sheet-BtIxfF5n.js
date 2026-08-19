import { j as e, a as o, F as l } from "./preloadable-Bomi5PEU.js";
import { B as a, X as i, L as c } from "./vendor-icons-B3DKX3la.js";
import { u as d, B as h, a as m } from "./content-page-BKaLSwvM.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/sheet"]);
const n = window.DeverFront?.sdk?.getCompatModule("@/components/ui/sheet");
if (!n || Object.keys(n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/sheet");
const p = n.Sheet, u = n.SheetClose, w = n.SheetContent, y = n.SheetDescription, f = n.SheetHeader, x = n.SheetTitle;
function B({
  articleID: s,
  open: t,
  onOpenChange: r
}) {
  return /* @__PURE__ */ e(p, { open: t, onOpenChange: r, children: /* @__PURE__ */ e(
    w,
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
    /* @__PURE__ */ o(f, { className: "body-content-sheet-header flex h-14 shrink-0 flex-row items-center gap-3 px-5 py-0 text-start", children: [
      /* @__PURE__ */ e(a, { className: "size-4 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ o("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e(x, { className: "truncate text-sm", children: t.article?.title || "内容详情" }),
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
    /* @__PURE__ */ o("div", { className: "body-content-sheet-scroll", children: [
      t.loading ? /* @__PURE__ */ o("div", { className: "body-content-sheet-loading", "aria-live": "polite", children: [
        /* @__PURE__ */ e(c, { className: "size-5 animate-spin" }),
        /* @__PURE__ */ e("span", { children: "正在读取内容" })
      ] }) : null,
      !t.loading && t.error ? /* @__PURE__ */ e(h, { message: t.error, onRetry: t.reload }) : null,
      !t.loading && t.article ? /* @__PURE__ */ e(m, { article: t.article, showTitle: !1 }) : null
    ] })
  ] });
}
export {
  B as BodyContentArticleSheet
};
