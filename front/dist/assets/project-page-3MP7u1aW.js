import { j as e, a as r, F as D } from "./createLucideIcon-fWv1XcFy.js";
import { r as U, n as X, b as f, e as _, c as L, x as G, d as E } from "./runtime-entry-ClkZDmNs.js";
import { A as q } from "./archive-restore-D9JOj_bb.js";
import { F as H, C as Q } from "./folder-open-ypoXJW1v.js";
import { C as Y } from "./chevron-right-DDWuhzEV.js";
import { t as P } from "./index-Cf7idtTi.js";
import { u as Z } from "./auth-scope-Bzy5p9cd.js";
import { q as I, f as j, d as ee, s as te, r as z, j as ae, k as S } from "./site-config-DrnclGFw.js";
import { c as se, X as x } from "./in-flight-request-CXY2yBH9.js";
import { E as re } from "./ellipsis-DUwJfgBr.js";
import { L as $ } from "./vanilla-BSPxkY5-.js";
import { P as ie } from "./pencil-DsS_UhAq.js";
import { P as ne } from "./_commonjsHelpers-BNFp87fY.js";
import { R as ce } from "./rotate-ccw-BOBeflIt.js";
import { T as F } from "./trash-2-C2PWG3er.js";
const oe = se();
function le(t, a, c = 1, i = 24, o = "") {
  const u = JSON.stringify({
    requestScopeKey: o,
    teamID: t,
    view: a,
    page: c,
    pageSize: i
  });
  return oe(u, async () => {
    const s = await M(
      a === "trash" ? "trash" : "list",
      "get",
      { team_id: t, page: c, page_size: i },
      a === "trash" ? "加载回收站失败" : "加载作品失败"
    );
    return {
      items: ee(s.items).map(pe).filter(be),
      page: j(s.page, c),
      pageSize: j(s.page_size, i),
      total: I(s.total),
      hasMore: !!s.has_more
    };
  });
}
async function de(t, a) {
  return M(
    "create",
    "post",
    {
      team_id: t,
      name: a.name,
      description: a.description
    },
    "创建作品失败"
  );
}
async function me(t, a) {
  return M(
    "update",
    "post",
    {
      id: t,
      name: a.name,
      description: a.description
    },
    "更新作品失败"
  );
}
async function ue(t) {
  return M("delete", "post", { id: t }, "删除作品失败");
}
async function he(t) {
  return M("restore", "post", { id: t }, "恢复作品失败");
}
async function M(t, a, c, i) {
  const o = await U(X(`project/${t}`), a, c);
  return te(o, i);
}
function pe(t) {
  const a = ae(t) ? t : {};
  return {
    id: j(a.id),
    name: z(a.name) || "未命名作品",
    description: z(a.description),
    createdAt: z(a.created_at),
    updatedAt: z(a.updated_at),
    deletedAt: z(a.deleted_at)
  };
}
function be(t) {
  return t.id > 0;
}
function fe({ onCreate: t }) {
  return /* @__PURE__ */ r("button", { type: "button", className: "hb-script-create-card", onClick: t, children: [
    /* @__PURE__ */ e("span", { className: "hb-script-create-plus", children: /* @__PURE__ */ e(ne, { size: 20, strokeWidth: 1.35 }) }),
    /* @__PURE__ */ e("span", { className: "hb-script-create-title", children: "新作品" }),
    /* @__PURE__ */ e("span", { className: "hb-script-create-desc", children: "创建我的作品" })
  ] });
}
function O({
  project: t,
  view: a,
  restoring: c = !1,
  onOpen: i,
  onEdit: o,
  onDelete: u,
  onRestore: s
}) {
  const [h, l] = f(!1), p = _(null);
  L(() => {
    if (!h)
      return;
    function d(m) {
      p.current?.contains(m.target) || l(!1);
    }
    function N(m) {
      m.key === "Escape" && l(!1);
    }
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", N), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", N);
    };
  }, [h]);
  const b = /* @__PURE__ */ r(D, { children: [
    /* @__PURE__ */ e("span", { className: "hb-script-card-binding", "aria-hidden": "true" }),
    /* @__PURE__ */ r("span", { className: "hb-script-card-body", children: [
      /* @__PURE__ */ e("strong", { children: t.name }),
      /* @__PURE__ */ e("span", { children: t.description })
    ] }),
    /* @__PURE__ */ e("time", { children: Ne(
      a === "trash" ? t.deletedAt || t.updatedAt : t.updatedAt || t.createdAt,
      a === "trash" ? "删除于" : "最近编辑"
    ) })
  ] });
  function g(d) {
    l(!1), d?.();
  }
  return /* @__PURE__ */ r(
    "article",
    {
      className: `hb-script-card ${h ? "has-open-menu" : ""} ${c ? "is-busy" : ""}`,
      children: [
        a === "works" ? /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "hb-script-card-main",
            onClick: i,
            "aria-label": `打开作品：${t.name}`,
            children: b
          }
        ) : /* @__PURE__ */ e("div", { className: "hb-script-card-main is-trash", children: b }),
        /* @__PURE__ */ r("div", { className: "hb-script-card-menu", ref: p, children: [
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "hb-script-card-menu-trigger",
              "aria-label": `${t.name}的更多操作`,
              "aria-haspopup": "menu",
              "aria-expanded": h,
              disabled: c,
              onClick: () => l((d) => !d),
              children: c ? /* @__PURE__ */ e($, { size: 15, className: "hb-script-spin" }) : /* @__PURE__ */ e(re, { size: 17 })
            }
          ),
          h ? /* @__PURE__ */ e("div", { className: "hb-script-card-menu-popover", role: "menu", children: a === "works" ? /* @__PURE__ */ r(D, { children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                role: "menuitem",
                onClick: () => g(o),
                children: [
                  /* @__PURE__ */ e(ie, { size: 14 }),
                  "编辑作品"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: "is-danger",
                onClick: () => g(u),
                children: [
                  /* @__PURE__ */ e(F, { size: 14 }),
                  "移入回收站"
                ]
              }
            )
          ] }) : /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: c,
              onClick: () => g(s),
              children: [
                /* @__PURE__ */ e(ce, { size: 14 }),
                "恢复作品"
              ]
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function ge() {
  return /* @__PURE__ */ e("div", { className: "hb-script-grid", children: [0, 1, 2].map((t) => /* @__PURE__ */ r("div", { className: "hb-script-skeleton", "aria-hidden": "true", children: [
    /* @__PURE__ */ e("span", {}),
    /* @__PURE__ */ e("strong", {}),
    /* @__PURE__ */ e("em", {}),
    /* @__PURE__ */ e("small", {})
  ] }, t)) });
}
function Ne(t, a) {
  if (!t)
    return a;
  const c = new Date(t);
  if (Number.isNaN(c.getTime()))
    return a;
  const i = Math.max(0, Math.floor((Date.now() - c.getTime()) / 1e3)), o = 60, u = o * 60, s = u * 24;
  return i < o ? `${a} 刚刚` : i < u ? `${a} ${Math.floor(i / o)}分钟前` : i < s ? `${a} ${Math.floor(i / u)}小时前` : `${a} ${Math.floor(i / s)}天前`;
}
function ye({
  mode: t,
  project: a,
  onClose: c,
  onSubmit: i
}) {
  const [o, u] = f(a?.name || ""), [s, h] = f(a?.description || ""), [l, p] = f(""), [b, g] = f(!1);
  W(c, b);
  async function d(m) {
    if (m.preventDefault(), b)
      return;
    const v = o.trim();
    if (!v) {
      p("请输入作品标题");
      return;
    }
    if (Array.from(v).length > 128) {
      p("作品标题不能超过 128 个字符");
      return;
    }
    g(!0), p("");
    try {
      await i({
        name: v,
        description: s.trim()
      });
    } catch (w) {
      p(w instanceof Error ? w.message : "保存作品失败");
    } finally {
      g(!1);
    }
  }
  const N = t === "edit";
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (m) => {
        m.target === m.currentTarget && !b && c();
      },
      children: /* @__PURE__ */ r(
        "form",
        {
          className: "hb-script-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "hb-script-metadata-title",
          onSubmit: d,
          children: [
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "hb-script-modal-close",
                onClick: c,
                disabled: b,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(x, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ r("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-metadata-title", children: N ? "编辑作品" : "新建作品" }),
              /* @__PURE__ */ e("p", { children: N ? "修改作品标题与描述。" : "记录灵感，开始新的创作。" })
            ] }),
            /* @__PURE__ */ r("div", { className: "hb-script-modal-body", children: [
              /* @__PURE__ */ r("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "标题" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: o,
                    maxLength: 128,
                    onChange: (m) => u(m.target.value),
                    placeholder: "输入作品标题",
                    autoFocus: !0
                  }
                )
              ] }),
              /* @__PURE__ */ r("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ e("span", { children: "描述" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: s,
                    onChange: (m) => h(m.target.value),
                    placeholder: "记录作品的灵感、目标或进展",
                    rows: 4
                  }
                )
              ] }),
              l ? /* @__PURE__ */ e("div", { className: "hb-script-form-error", children: l }) : null
            ] }),
            /* @__PURE__ */ r("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: c,
                  disabled: b,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "submit",
                  className: "hb-script-primary",
                  disabled: b,
                  children: [
                    b ? /* @__PURE__ */ e($, { size: 15, className: "hb-script-spin" }) : null,
                    N ? "保存" : "创建"
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
function ke({
  project: t,
  onClose: a,
  onConfirm: c
}) {
  const [i, o] = f(!1), [u, s] = f("");
  W(a, i);
  async function h() {
    if (!i) {
      o(!0), s("");
      try {
        await c();
      } catch (l) {
        s(l instanceof Error ? l.message : "删除作品失败");
      } finally {
        o(!1);
      }
    }
  }
  return /* @__PURE__ */ e(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (l) => {
        l.target === l.currentTarget && !i && a();
      },
      children: /* @__PURE__ */ r(
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
                onClick: a,
                disabled: i,
                "aria-label": "关闭",
                children: /* @__PURE__ */ e(x, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ e("div", { className: "hb-script-confirm-icon", children: /* @__PURE__ */ e(F, { size: 20 }) }),
            /* @__PURE__ */ r("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ e("h2", { id: "hb-script-delete-title", children: "移入回收站？" }),
              /* @__PURE__ */ r("p", { children: [
                "“",
                t.name,
                "”将从作品列表移除，你可以稍后在回收站中恢复。"
              ] })
            ] }),
            u ? /* @__PURE__ */ e("div", { className: "hb-script-confirm-error", children: u }) : null,
            /* @__PURE__ */ r("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: a,
                  disabled: i,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "hb-script-danger",
                  onClick: () => {
                    h();
                  },
                  disabled: i,
                  children: [
                    i ? /* @__PURE__ */ e($, { size: 15, className: "hb-script-spin" }) : null,
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
function W(t, a) {
  L(() => {
    function c(i) {
      i.key === "Escape" && !a && t();
    }
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, [a, t]);
}
const R = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function _e({
  teamID: t = 0,
  onRequireAuth: a
}) {
  const c = G(), i = Z(), [o, u] = f("works"), [s, h] = f(R), [l, p] = f(1), [b, g] = f(t > 0), [d, N] = f(null), [m, v] = f(null), [w, T] = f(0), C = _(0), y = E(async () => {
    const n = ++C.current;
    if (!t) {
      h(R), g(!1);
      return;
    }
    h((k) => ({ ...k, items: [] })), g(!0);
    try {
      const k = await le(
        t,
        o,
        l,
        24,
        i
      );
      n === C.current && h(k);
    } catch (k) {
      n === C.current && P.error(S(k, "加载作品失败"));
    } finally {
      n === C.current && g(!1);
    }
  }, [o, l, i, t]);
  L(() => (y(), () => {
    C.current += 1;
  }), [y]);
  const V = E(() => {
    if (!t && a) {
      a();
      return;
    }
    N({ mode: "create" });
  }, [a, t]), K = E(
    async (n) => {
      if (d?.mode === "edit" && d.project)
        await me(d.project.id, n), P.success("作品信息已更新"), await y();
      else {
        if (!t)
          throw new Error("当前创作空间不可用");
        await de(t, n), P.success("作品已创建"), l === 1 ? await y() : p(1);
      }
      N(null);
    },
    [y, d, l, t]
  ), B = E(async () => {
    m && (await ue(m.id), P.success("作品已移入回收站"), s.items.length === 1 && l > 1 ? p((n) => n - 1) : await y(), v(null));
  }, [m, y, l, s.items.length]), J = E(
    async (n) => {
      if (!w) {
        T(n.id);
        try {
          await he(n.id), P.success("作品已恢复"), s.items.length === 1 && l > 1 ? p((k) => k - 1) : await y();
        } catch (k) {
          P.error(S(k, "恢复作品失败"));
        } finally {
          T(0);
        }
      }
    },
    [y, l, s.items.length, w]
  );
  function A(n) {
    n !== o && (h(R), p(1), g(!0), u(n));
  }
  return /* @__PURE__ */ r("div", { className: "hb-script-page", children: [
    /* @__PURE__ */ e("header", { className: "hb-script-toolbar", children: /* @__PURE__ */ r("div", { className: "hb-script-tabs", role: "tablist", "aria-label": "创作视图", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": o === "works",
          className: o === "works" ? "is-active" : "",
          onClick: () => A("works"),
          children: [
            /* @__PURE__ */ e(H, { size: 14 }),
            "作品"
          ]
        }
      ),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": o === "trash",
          className: o === "trash" ? "is-active" : "",
          onClick: () => A("trash"),
          children: [
            /* @__PURE__ */ e(q, { size: 14 }),
            "回收站"
          ]
        }
      )
    ] }) }),
    b ? /* @__PURE__ */ e(ge, {}) : o === "works" ? /* @__PURE__ */ r("div", { className: "hb-script-grid", children: [
      /* @__PURE__ */ e(fe, { onCreate: V }),
      s.items.map((n) => /* @__PURE__ */ e(
        O,
        {
          project: n,
          view: "works",
          onOpen: () => c({
            to: "/bot/work/space",
            search: { project_id: String(n.id) }
          }),
          onEdit: () => N({ mode: "edit", project: n }),
          onDelete: () => v(n)
        },
        n.id
      ))
    ] }) : s.items.length > 0 ? /* @__PURE__ */ e("div", { className: "hb-script-grid", children: s.items.map((n) => /* @__PURE__ */ e(
      O,
      {
        project: n,
        view: "trash",
        restoring: w === n.id,
        onRestore: () => {
          J(n);
        }
      },
      n.id
    )) }) : /* @__PURE__ */ e(ve, {}),
    s.total > s.pageSize ? /* @__PURE__ */ r("footer", { className: "hb-script-pagination", children: [
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          title: "上一页",
          disabled: l <= 1 || b,
          onClick: () => p((n) => n - 1),
          children: /* @__PURE__ */ e(Q, {})
        }
      ),
      /* @__PURE__ */ r("span", { children: [
        s.page,
        " /",
        " ",
        Math.max(1, Math.ceil(s.total / s.pageSize))
      ] }),
      /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          title: "下一页",
          disabled: !s.hasMore || b,
          onClick: () => p((n) => n + 1),
          children: /* @__PURE__ */ e(Y, {})
        }
      )
    ] }) : null,
    d ? /* @__PURE__ */ e(
      ye,
      {
        mode: d.mode,
        project: d.project,
        onClose: () => N(null),
        onSubmit: K
      },
      `${d.mode}-${d.project?.id || 0}`
    ) : null,
    m ? /* @__PURE__ */ e(
      ke,
      {
        project: m,
        onClose: () => v(null),
        onConfirm: B
      }
    ) : null
  ] });
}
function ve() {
  return /* @__PURE__ */ r("div", { className: "hb-script-empty", children: [
    /* @__PURE__ */ e(q, { size: 24, strokeWidth: 1.5 }),
    /* @__PURE__ */ e("strong", { children: "回收站为空" })
  ] });
}
export {
  _e as WorkProjectPage
};
