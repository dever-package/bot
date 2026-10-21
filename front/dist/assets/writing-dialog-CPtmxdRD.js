import { j as e, a as r } from "./react-HSzdbxZ7.js";
import { a as h, b as C } from "./file-kind-D6bMOzYN.js";
import { X as k } from "./vendor-icons-fVDtJt66.js";
import { D as E } from "./asset-preview-DGKZUP9q.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-dialog-DaSdUWkB.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog"]);
const v = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!v || Object.keys(v).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const b = v.Button, c = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!c || Object.keys(c).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const F = c.Dialog, _ = c.DialogContent, I = c.DialogHeader, L = c.DialogDescription, j = c.DialogFooter, B = c.DialogTitle;
function N({
  title: u,
  titleStatus: i,
  children: f,
  onClose: a,
  closeDisabled: l = !1,
  className: t = "",
  described: g = !1
}) {
  const [s] = h(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), m = C(!1), [p, w] = h(!1), n = async () => {
    if (!(l || m.current)) {
      m.current = !0, w(!0);
      try {
        await a();
      } finally {
        m.current = !1, w(!1);
      }
    }
  };
  return /* @__PURE__ */ e(F, { open: !0, onOpenChange: (d) => !d && void n(), children: /* @__PURE__ */ r(
    _,
    {
      className: `writing-editor writing-dialog nodrag nopan nowheel ${t}`,
      layerZIndex: E,
      showCloseButton: !1,
      ...g ? {} : { "aria-describedby": void 0 },
      onCloseAutoFocus: (d) => {
        s?.isConnected && (d.preventDefault(), s.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ r(I, { className: "writing-dialog-header", children: [
          /* @__PURE__ */ e(B, { children: u }),
          i && /* @__PURE__ */ e("div", { className: "writing-dialog-title-status", children: i }),
          /* @__PURE__ */ e(
            b,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              "aria-label": `关闭${u}`,
              disabled: l || p,
              onClick: () => {
                n();
              },
              children: /* @__PURE__ */ e(k, { size: 18 })
            }
          )
        ] }),
        f
      ]
    }
  ) });
}
function R({
  title: u,
  description: i,
  confirmLabel: f,
  pending: a,
  disabled: l,
  error: t,
  onConfirm: g,
  onClose: s
}) {
  return /* @__PURE__ */ r(
    N,
    {
      title: u,
      closeDisabled: a,
      onClose: s,
      className: "writing-confirm-dialog",
      described: !0,
      children: [
        /* @__PURE__ */ r("div", { className: "writing-dialog-scroll", children: [
          /* @__PURE__ */ e(L, { children: i }),
          t && /* @__PURE__ */ e("p", { role: "alert", className: "writing-inspiration-form-error", children: t })
        ] }),
        /* @__PURE__ */ r(j, { className: "writing-confirm-footer", children: [
          /* @__PURE__ */ e(
            b,
            {
              type: "button",
              variant: "outline",
              disabled: a,
              onClick: s,
              children: "取消"
            }
          ),
          /* @__PURE__ */ e(
            b,
            {
              type: "button",
              disabled: a || l,
              onClick: () => {
                g();
              },
              children: a ? "正在提交…" : f
            }
          )
        ] })
      ]
    }
  );
}
function T({
  edit: u,
  disabled: i,
  onSave: f,
  onRegenerate: a,
  onClose: l
}) {
  const [t, g] = h(() => ({
    title: u.inspiration.title,
    content: u.inspiration.content
  })), [s, m] = h(""), [p, w] = h(
    null
  ), n = p !== null, d = C(!1), D = async (o) => {
    if (!(i || d.current)) {
      d.current = !0, w(o), m("");
      try {
        o === "save" ? await f(t) : await a(), l();
      } catch (y) {
        m(
          y instanceof Error ? y.message : o === "save" ? "保存灵感失败" : "重新生成灵感失败"
        );
      } finally {
        d.current = !1, w(null);
      }
    }
  };
  return /* @__PURE__ */ e(
    N,
    {
      title: "编辑灵感",
      className: "writing-inspiration-dialog",
      closeDisabled: n,
      onClose: l,
      children: /* @__PURE__ */ r(
        "form",
        {
          className: "writing-dialog-scroll writing-inspiration-form",
          onSubmit: (o) => {
            o.preventDefault(), D("save");
          },
          children: [
            /* @__PURE__ */ r("label", { children: [
              "标题",
              /* @__PURE__ */ e(
                "input",
                {
                  "aria-label": "灵感标题",
                  required: !0,
                  disabled: n,
                  value: t.title,
                  onChange: (o) => g({ ...t, title: o.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ r("label", { children: [
              "内容",
              /* @__PURE__ */ e(
                "textarea",
                {
                  "aria-label": "灵感内容",
                  rows: 7,
                  required: !0,
                  disabled: n,
                  value: t.content,
                  onChange: (o) => g({ ...t, content: o.target.value })
                }
              )
            ] }),
            (s || i && !n) && /* @__PURE__ */ e("p", { className: "writing-inspiration-form-error", role: "alert", children: s || "当前暂不可保存，输入内容已保留。" }),
            /* @__PURE__ */ r("div", { className: "writing-actions", children: [
              /* @__PURE__ */ e("button", { type: "button", disabled: n, onClick: l, children: "取消" }),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  disabled: i || n,
                  onClick: () => {
                    D("regenerate");
                  },
                  children: p === "regenerate" ? "重新生成中…" : "重新生成"
                }
              ),
              /* @__PURE__ */ e(
                "button",
                {
                  className: "is-primary",
                  type: "submit",
                  disabled: i || n || !t.title.trim() || !t.content.trim(),
                  children: p === "save" ? "保存中…" : "保存"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  R as WritingConfirmDialog,
  N as WritingDialog,
  T as WritingInspirationDialog
};
