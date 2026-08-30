import { j as e, a as i } from "./preloadable-Bomi5PEU.js";
import { a as l, b as S } from "./_commonjsHelpers-61wyk6v6.js";
import { X as v, h as E, r as k } from "./vendor-icons-DwjYEojZ.js";
await window.DeverFront?.ensureCompat?.(["@/stores/auth-store"]);
const g = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!g || Object.keys(g).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const j = g.useAuthStore;
function F() {
  const a = j((t) => t.auth?.user);
  return M(a);
}
function M(a) {
  if (!a || typeof a != "object" || Array.isArray(a))
    return "";
  const t = a, s = Number(t.id || 0);
  if (Number.isFinite(s) && s > 0)
    return `user:${s}`;
  const r = String(t.account || "").trim();
  return r ? `account:${r}` : "";
}
function z({
  mode: a,
  project: t,
  onClose: s,
  onSubmit: r
}) {
  const [d, m] = l(t?.name || ""), [u, b] = l(t?.description || ""), [c, h] = l(""), [o, y] = l(!1);
  w(s, o);
  async function D(n) {
    if (n.preventDefault(), o)
      return;
    const f = d.trim();
    if (!f) {
      h("请输入作品标题");
      return;
    }
    if (Array.from(f).length > 128) {
      h("作品标题不能超过 128 个字符");
      return;
    }
    y(!0), h("");
    try {
      await r({
        name: f,
        description: u.trim()
      });
    } catch (N) {
      h(N instanceof Error ? N.message : "保存作品失败");
    } finally {
      y(!1);
    }
  }
  const p = a === "edit";
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (n) => {
        n.target === n.currentTarget && !o && s();
      },
      children: /* @__PURE__ */ i(
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
                disabled: o,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(v, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ i("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-metadata-title", children: p ? "编辑作品" : "新建作品" }),
              /* @__PURE__ */ e("p", { children: p ? "修改作品标题与描述。" : "记录灵感，开始新的创作。" })
            ] }),
            /* @__PURE__ */ i("div", { className: "hb-script-modal-body", children: [
              /* @__PURE__ */ i("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "标题" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: d,
                    maxLength: 128,
                    onChange: (n) => m(n.target.value),
                    placeholder: "输入作品标题",
                    autoFocus: !0
                  }
                )
              ] }),
              /* @__PURE__ */ i("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "描述" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: u,
                    onChange: (n) => b(n.target.value),
                    placeholder: "记录作品的灵感、目标或进展",
                    rows: 4
                  }
                )
              ] }),
              c ? /* @__PURE__ */ e("div", { className: "hb-script-form-error", children: c }) : null
            ] }),
            /* @__PURE__ */ i("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: s,
                  disabled: o,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "submit",
                  className: "hb-script-primary",
                  disabled: o,
                  children: [
                    o ? /* @__PURE__ */ e(k, { size: 15, className: "hb-script-spin" }) : null,
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
function A({
  project: a,
  onClose: t,
  onConfirm: s
}) {
  const [r, d] = l(!1), [m, u] = l("");
  w(t, r);
  async function b() {
    if (!r) {
      d(!0), u("");
      try {
        await s();
      } catch (c) {
        u(c instanceof Error ? c.message : "删除作品失败");
      } finally {
        d(!1);
      }
    }
  }
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (c) => {
        c.target === c.currentTarget && !r && t();
      },
      children: /* @__PURE__ */ i(
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
                onClick: t,
                disabled: r,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(v, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ e("div", { className: "hb-script-confirm-icon", children: /* @__PURE__ */ e(E, { size: 20 }) }),
            /* @__PURE__ */ i("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-delete-title", children: "移入回收站？" }),
              /* @__PURE__ */ i("p", { children: [
                "“",
                a.name,
                "”将从作品列表移除，你可以稍后在回收站中恢复。"
              ] })
            ] }),
            m ? /* @__PURE__ */ e("div", { className: "hb-script-confirm-error", children: m }) : null,
            /* @__PURE__ */ i("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: t,
                  disabled: r,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "hb-script-danger",
                  onClick: () => {
                    b();
                  },
                  disabled: r,
                  children: [
                    r ? /* @__PURE__ */ e(k, { size: 15, className: "hb-script-spin" }) : null,
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
function w(a, t) {
  S(() => {
    function s(r) {
      r.key === "Escape" && !t && a();
    }
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  }, [t, a]);
}
const L = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DeleteProjectDialog: A,
  ProjectMetadataDialog: z
}, Symbol.toStringTag, { value: "Module" }));
export {
  L as p,
  F as u
};
