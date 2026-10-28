import { l as E, a as u, d as P } from "./file-kind-D6bMOzYN.js";
import { p as S } from "./site-config-kAiWSd_3.js";
import { j as e, a as o } from "./react-5Z-wsVEn.js";
import { X as k, h as j, r as v } from "./vendor-icons-fVDtJt66.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./project-dialogs-DVQpqw1G.css", import.meta.url).href]);
const w = [
  "--body-work-bg",
  "--body-work-canvas",
  "--body-work-surface",
  "--body-work-surface-raised",
  "--body-work-text",
  "--body-work-muted",
  "--body-work-line",
  "--body-work-active",
  "--body-work-shadow",
  "--body-work-primary",
  "--body-work-primary-strong",
  "--body-work-primary-bright",
  "--body-work-primary-soft",
  "--body-work-on-primary",
  "--body-work-ring"
];
function _(n, s) {
  E(() => {
    if (typeof document > "u")
      return;
    const t = document.documentElement, a = t.getAttribute("data-body-appearance"), d = w.map((r) => ({
      property: r,
      value: t.style.getPropertyValue(r),
      priority: t.style.getPropertyPriority(r)
    })), m = S(n, s);
    t.setAttribute("data-body-appearance", "active");
    for (const r of w) {
      const c = m[r];
      c ? t.style.setProperty(r, c) : t.style.removeProperty(r);
    }
    return () => {
      a == null ? t.removeAttribute("data-body-appearance") : t.setAttribute("data-body-appearance", a);
      for (const { property: r, value: c, priority: i } of d)
        c ? t.style.setProperty(r, c, i) : t.style.removeProperty(r);
    };
  }, [n, s]);
}
function A({
  mode: n,
  project: s,
  onClose: t,
  onSubmit: a
}) {
  const [d, m] = u(s?.name || ""), [r, c] = u(s?.description || ""), [i, b] = u(""), [p, f] = u(!1);
  N(t, p);
  async function D(l) {
    if (l.preventDefault(), p)
      return;
    const y = d.trim();
    if (!y) {
      b("请输入作品标题");
      return;
    }
    if (Array.from(y).length > 128) {
      b("作品标题不能超过 128 个字符");
      return;
    }
    f(!0), b("");
    try {
      await a({
        name: y,
        description: r.trim()
      });
    } catch (g) {
      b(g instanceof Error ? g.message : "保存作品失败");
    } finally {
      f(!1);
    }
  }
  const h = n === "edit";
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (l) => {
        l.target === l.currentTarget && !p && t();
      },
      children: /* @__PURE__ */ o(
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
                onClick: t,
                disabled: p,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(k, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ o("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-metadata-title", children: h ? "编辑作品" : "新建作品" }),
              /* @__PURE__ */ e("p", { children: h ? "修改作品标题与描述。" : "记录灵感，开始新的创作。" })
            ] }),
            /* @__PURE__ */ o("div", { className: "hb-script-modal-body", children: [
              /* @__PURE__ */ o("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "标题" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: d,
                    maxLength: 128,
                    onChange: (l) => m(l.target.value),
                    placeholder: "输入作品标题",
                    autoFocus: !0
                  }
                )
              ] }),
              /* @__PURE__ */ o("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "描述" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: r,
                    onChange: (l) => c(l.target.value),
                    placeholder: "记录作品的灵感、目标或进展",
                    rows: 4
                  }
                )
              ] }),
              i ? /* @__PURE__ */ e("div", { className: "hb-script-form-error", children: i }) : null
            ] }),
            /* @__PURE__ */ o("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: t,
                  disabled: p,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "submit",
                  className: "hb-script-primary",
                  disabled: p,
                  children: [
                    p ? /* @__PURE__ */ e(v, { size: 15, className: "hb-script-spin" }) : null,
                    h ? "保存" : "创建"
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
function x({
  project: n,
  onClose: s,
  onConfirm: t
}) {
  const [a, d] = u(!1), [m, r] = u("");
  N(s, a);
  async function c() {
    if (!a) {
      d(!0), r("");
      try {
        await t();
      } catch (i) {
        r(i instanceof Error ? i.message : "删除作品失败");
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
        i.target === i.currentTarget && !a && s();
      },
      children: /* @__PURE__ */ o(
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
                onClick: s,
                disabled: a,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(k, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ e("div", { className: "hb-script-confirm-icon", children: /* @__PURE__ */ e(j, { size: 20 }) }),
            /* @__PURE__ */ o("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-delete-title", children: "移入回收站？" }),
              /* @__PURE__ */ o("p", { children: [
                "“",
                n.name,
                "”将从作品列表移除，你可以稍后在回收站中恢复。"
              ] })
            ] }),
            m ? /* @__PURE__ */ e("div", { className: "hb-script-confirm-error", children: m }) : null,
            /* @__PURE__ */ o("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: s,
                  disabled: a,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  className: "hb-script-danger",
                  onClick: () => {
                    c();
                  },
                  disabled: a,
                  children: [
                    a ? /* @__PURE__ */ e(v, { size: 15, className: "hb-script-spin" }) : null,
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
function N(n, s) {
  P(() => {
    function t(a) {
      a.key === "Escape" && !s && n();
    }
    return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
  }, [s, n]);
}
const F = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DeleteProjectDialog: x,
  ProjectMetadataDialog: A
}, Symbol.toStringTag, { value: "Module" }));
export {
  F as p,
  _ as u
};
