import { j as e, a as n } from "./runtime-entry-9YhLBCWA.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/components/energon/content-view"]);
const s = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!s || Object.keys(s).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const m = s.Button, t = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!t || Object.keys(t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const g = t.Dialog, h = t.DialogContent, p = t.DialogDescription, u = t.DialogFooter, w = t.DialogHeader, D = t.DialogTitle, i = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!i || Object.keys(i).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const r = i, l = r.ContentView || r.EnergonContentView;
function y({
  message: o,
  publishedAtLabel: c,
  onClose: a
}) {
  return /* @__PURE__ */ e(
    g,
    {
      open: !0,
      onOpenChange: (d) => {
        d || a();
      },
      children: /* @__PURE__ */ n(h, { className: "hb-system-message-detail sm:max-w-2xl", children: [
        /* @__PURE__ */ n(w, { className: "hb-system-message-detail-header", children: [
          /* @__PURE__ */ e(D, { children: "系统消息" }),
          /* @__PURE__ */ e(p, { className: "sr-only", children: "查看官方消息详情" })
        ] }),
        /* @__PURE__ */ n("div", { className: "hb-system-message-detail-body", children: [
          /* @__PURE__ */ n("header", { className: "hb-system-message-detail-article-header", children: [
            /* @__PURE__ */ e("h2", { children: o.title || "系统消息" }),
            /* @__PURE__ */ e("time", { dateTime: o.publishedAt, children: c })
          ] }),
          l ? /* @__PURE__ */ e(
            l,
            {
              output: { text: o.content },
              emptyText: "暂无消息内容。",
              markdownClassName: "hb-system-message-detail-content",
              richClassName: "hb-system-message-detail-content",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ e("p", { className: "hb-system-message-detail-content", children: o.content || "暂无消息内容。" })
        ] }),
        /* @__PURE__ */ e(u, { className: "hb-system-message-detail-footer", children: /* @__PURE__ */ e(m, { onClick: a, children: "我知道了" }) })
      ] })
    }
  );
}
export {
  y as WorkbenchSystemMessageDetail
};
