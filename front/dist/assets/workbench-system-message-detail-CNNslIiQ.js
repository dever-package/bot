import { a as e, j as a } from "./_commonjsHelpers-CTFd9u1x.js";
import { m as c } from "./content-view-DKqPlRti.js";
import { m as r } from "./button-CpfaQlDK.js";
import { m as t } from "./dialog-Oss_U0H4.js";
const d = r.Button, h = t.Dialog, g = t.DialogContent, D = t.DialogDescription, p = t.DialogFooter, y = t.DialogHeader, b = t.DialogTitle, i = c, n = i.ContentView || i.EnergonContentView;
function x({
  message: s,
  publishedAtLabel: l,
  onClose: o
}) {
  return /* @__PURE__ */ e(
    h,
    {
      open: !0,
      onOpenChange: (m) => {
        m || o();
      },
      children: /* @__PURE__ */ a(g, { className: "hb-system-message-detail sm:max-w-2xl", children: [
        /* @__PURE__ */ a(y, { className: "hb-system-message-detail-header", children: [
          /* @__PURE__ */ e(b, { children: "系统消息" }),
          /* @__PURE__ */ e(D, { className: "sr-only", children: "查看官方消息详情" })
        ] }),
        /* @__PURE__ */ a("div", { className: "hb-system-message-detail-body", children: [
          /* @__PURE__ */ a("header", { className: "hb-system-message-detail-article-header", children: [
            /* @__PURE__ */ e("h2", { children: s.title || "系统消息" }),
            /* @__PURE__ */ e("time", { dateTime: s.publishedAt, children: l })
          ] }),
          n ? /* @__PURE__ */ e(
            n,
            {
              output: { text: s.content },
              emptyText: "暂无消息内容。",
              markdownClassName: "hb-system-message-detail-content",
              richClassName: "hb-system-message-detail-content",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ e("p", { className: "hb-system-message-detail-content", children: s.content || "暂无消息内容。" })
        ] }),
        /* @__PURE__ */ e(p, { className: "hb-system-message-detail-footer", children: /* @__PURE__ */ e(d, { onClick: o, children: "我知道了" }) })
      ] })
    }
  );
}
export {
  x as WorkbenchSystemMessageDetail
};
