import { a as e, j as t } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as o, o as E } from "./react-C7Xtl8sB.js";
import { X as v, T as j, L as k } from "./vendor-icons-Cc7Kl3It.js";
await window.DeverFront?.ensureCompat?.(["@/stores/auth-store"]);
const N = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!N || Object.keys(N).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
function z({
  mode: l,
  project: r,
  onClose: s,
  onSubmit: a
}) {
  const [d, h] = o(r?.name || ""), [m, b] = o(r?.description || ""), [i, u] = o(""), [n, g] = o(!1);
  w(s, n);
  async function D(c) {
    if (c.preventDefault(), n)
      return;
    const f = d.trim();
    if (!f) {
      u("请输入作品标题");
      return;
    }
    if (Array.from(f).length > 128) {
      u("作品标题不能超过 128 个字符");
      return;
    }
    g(!0), u("");
    try {
      await a({
        name: f,
        description: m.trim()
      });
    } catch (y) {
      u(y instanceof Error ? y.message : "保存作品失败");
    } finally {
      g(!1);
    }
  }
  const p = l === "edit";
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (c) => {
        c.target === c.currentTarget && !n && s();
      },
      children: /* @__PURE__ */ t(
        "form",
        {
          className: "hb-script-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "hb-script-metadata-title",
          onSubmit: D,
          children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "hb-script-modal-close",
                onClick: s,
                disabled: n,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(v, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ t("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-metadata-title", children: p ? "编辑作品" : "新建作品" }),
              /* @__PURE__ */ e("p", { children: p ? "修改作品标题与描述。" : "记录灵感，开始新的创作。" })
            ] }),
            /* @__PURE__ */ t("div", { className: "hb-script-modal-body", children: [
              /* @__PURE__ */ t("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "标题" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: d,
                    maxLength: 128,
                    onChange: (c) => h(c.target.value),
                    placeholder: "输入作品标题",
                    autoFocus: !0
                  }
                )
              ] }),
              /* @__PURE__ */ t("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "描述" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: m,
                    onChange: (c) => b(c.target.value),
                    placeholder: "记录作品的灵感、目标或进展",
                    rows: 4
                  }
                )
              ] }),
              i ? /* @__PURE__ */ e("div", { className: "hb-script-form-error", children: i }) : null
            ] }),
            /* @__PURE__ */ t("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: s,
                  disabled: n,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "submit",
                  className: "hb-script-primary",
                  disabled: n,
                  children: [
                    n ? /* @__PURE__ */ e(k, { size: 15, className: "hb-script-spin" }) : null,
                    p ? "保存" : "创建"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function M({
  project: l,
  onClose: r,
  onConfirm: s
}) {
  const [a, d] = o(!1), [h, m] = o("");
  w(r, a);
  async function b() {
    if (!a) {
      d(!0), m("");
      try {
        await s();
      } catch (i) {
        m(i instanceof Error ? i.message : "删除作品失败");
      } finally {
        d(!1);
      }
    }
  }
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (i) => {
        i.target === i.currentTarget && !a && r();
      },
      children: /* @__PURE__ */ t(
        "section",
        {
          className: "hb-script-modal hb-script-confirm",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": "hb-script-delete-title",
          children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "hb-script-modal-close",
                onClick: r,
                disabled: a,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(v, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ e("div", { className: "hb-script-confirm-icon", children: /* @__PURE__ */ e(j, { size: 20 }) }),
            /* @__PURE__ */ t("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-delete-title", children: "移入回收站？" }),
              /* @__PURE__ */ t("p", { children: [
                "“",
                l.name,
                "”将从作品列表移除，你可以稍后在回收站中恢复。"
              ] })
            ] }),
            h ? /* @__PURE__ */ e("div", { className: "hb-script-confirm-error", children: h }) : null,
            /* @__PURE__ */ t("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: r,
                  disabled: a,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  className: "hb-script-danger",
                  onClick: () => {
                    b();
                  },
                  disabled: a,
                  children: [
                    a ? /* @__PURE__ */ e(k, { size: 15, className: "hb-script-spin" }) : null,
                    "移入回收站"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function w(l, r) {
  E(() => {
    function s(a) {
      a.key === "Escape" && !r && l();
    }
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [r, l]);
}
const T = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DeleteProjectDialog: M,
  ProjectMetadataDialog: z
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as m,
  T as p
};
