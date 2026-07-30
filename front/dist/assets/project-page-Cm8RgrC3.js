import { j as t, a as s, F as $ } from "./createLucideIcon-Gw0gLVQ5.js";
import { r as G, j as H, u as f, a as _, b as A, m as Q, e as E } from "./runtime-entry-CkPHMDB1.js";
import { F as Y, A as F, C as Z } from "./folder-open-Cq24veMe.js";
import { C as I } from "./chevron-right-2QoHuRdg.js";
import { t as P } from "./index-wo12HRHg.js";
import { u as ee } from "./auth-scope-ibH_W2SO.js";
import { i as te } from "./api-response-C-VXY2RJ.js";
import { c as re } from "./in-flight-request-vHkSgDHd.js";
import { E as ae } from "./ellipsis-Dnz6zolG.js";
import { L as R } from "./loader-circle-3ZsHTZm7.js";
import { P as se } from "./pencil-WDd5tOSC.js";
import { P as ne } from "./plus-rAwvnIn1.js";
import { R as ie } from "./rotate-ccw-CYQko_-D.js";
import { T as W } from "./trash-2-Cga0ORNu.js";
import { X as q } from "./x-CDJG94MJ.js";
const ce = re();
function oe(e, r, o = 1, n = 24, c = "") {
  const m = JSON.stringify({
    requestScopeKey: c,
    teamID: e,
    view: r,
    page: o,
    pageSize: n
  });
  return ce(m, async () => {
    const a = await M(
      r === "trash" ? "trash" : "list",
      "get",
      { team_id: e, page: o, page_size: n },
      r === "trash" ? "加载回收站失败" : "加载作品失败"
    );
    return {
      items: be(a.items).map(he).filter(pe),
      page: T(a.page, o),
      pageSize: T(a.page_size, n),
      total: fe(a.total),
      hasMore: !!a.has_more
    };
  });
}
async function le(e, r) {
  return M(
    "create",
    "post",
    {
      team_id: e,
      name: r.name,
      description: r.description
    },
    "创建作品失败"
  );
}
async function de(e, r) {
  return M(
    "update",
    "post",
    {
      id: e,
      name: r.name,
      description: r.description
    },
    "更新作品失败"
  );
}
async function ue(e) {
  return M("delete", "post", { id: e }, "删除作品失败");
}
async function me(e) {
  return M("restore", "post", { id: e }, "恢复作品失败");
}
async function M(e, r, o, n) {
  const c = await G(H(`project/${e}`), r, o);
  if (!te(c))
    throw new Error(String(c?.message || c?.msg || n));
  return x(c?.data) ? c.data : {};
}
function he(e) {
  const r = x(e) ? e : {};
  return {
    id: V(r.id),
    name: z(r.name) || "未命名作品",
    description: z(r.description),
    createdAt: z(r.created_at),
    updatedAt: z(r.updated_at),
    deletedAt: z(r.deleted_at)
  };
}
function pe(e) {
  return e.id > 0;
}
function be(e) {
  return Array.isArray(e) ? e : [];
}
function x(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function V(e) {
  const r = Number(e || 0);
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function T(e, r) {
  return V(e) || r;
}
function fe(e) {
  const r = Number(e || 0);
  return Number.isFinite(r) && r >= 0 ? r : 0;
}
function z(e) {
  return e == null ? "" : String(e).trim();
}
function ge({ onCreate: e }) {
  return /* @__PURE__ */ s("button", { type: "button", className: "hb-script-create-card", onClick: e, children: [
    /* @__PURE__ */ t("span", { className: "hb-script-create-plus", children: /* @__PURE__ */ t(ne, { size: 20, strokeWidth: 1.35 }) }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-title", children: "新作品" }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-desc", children: "创建我的作品" })
  ] });
}
function D({
  project: e,
  view: r,
  restoring: o = !1,
  onOpen: n,
  onEdit: c,
  onDelete: m,
  onRestore: a
}) {
  const [h, l] = f(!1), p = _(null);
  A(() => {
    if (!h)
      return;
    function d(u) {
      p.current?.contains(u.target) || l(!1);
    }
    function y(u) {
      u.key === "Escape" && l(!1);
    }
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", y), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", y);
    };
  }, [h]);
  const b = /* @__PURE__ */ s($, { children: [
    /* @__PURE__ */ t("span", { className: "hb-script-card-binding", "aria-hidden": "true" }),
    /* @__PURE__ */ s("span", { className: "hb-script-card-body", children: [
      /* @__PURE__ */ t("strong", { children: e.name }),
      /* @__PURE__ */ t("span", { children: e.description })
    ] }),
    /* @__PURE__ */ t("time", { children: Ne(
      r === "trash" ? e.deletedAt || e.updatedAt : e.updatedAt || e.createdAt,
      r === "trash" ? "删除于" : "最近编辑"
    ) })
  ] });
  function g(d) {
    l(!1), d?.();
  }
  return /* @__PURE__ */ s(
    "article",
    {
      className: `hb-script-card ${h ? "has-open-menu" : ""} ${o ? "is-busy" : ""}`,
      children: [
        r === "works" ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "hb-script-card-main",
            onClick: n,
            "aria-label": `打开作品：${e.name}`,
            children: b
          }
        ) : /* @__PURE__ */ t("div", { className: "hb-script-card-main is-trash", children: b }),
        /* @__PURE__ */ s("div", { className: "hb-script-card-menu", ref: p, children: [
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "hb-script-card-menu-trigger",
              "aria-label": `${e.name}的更多操作`,
              "aria-haspopup": "menu",
              "aria-expanded": h,
              disabled: o,
              onClick: () => l((d) => !d),
              children: o ? /* @__PURE__ */ t(R, { size: 15, className: "hb-script-spin" }) : /* @__PURE__ */ t(ae, { size: 17 })
            }
          ),
          h ? /* @__PURE__ */ t("div", { className: "hb-script-card-menu-popover", role: "menu", children: r === "works" ? /* @__PURE__ */ s($, { children: [
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                role: "menuitem",
                onClick: () => g(c),
                children: [
                  /* @__PURE__ */ t(se, { size: 14 }),
                  "编辑作品"
                ]
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: "is-danger",
                onClick: () => g(m),
                children: [
                  /* @__PURE__ */ t(W, { size: 14 }),
                  "移入回收站"
                ]
              }
            )
          ] }) : /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: o,
              onClick: () => g(a),
              children: [
                /* @__PURE__ */ t(ie, { size: 14 }),
                "恢复作品"
              ]
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function ye() {
  return /* @__PURE__ */ t("div", { className: "hb-script-grid", children: [0, 1, 2].map((e) => /* @__PURE__ */ s("div", { className: "hb-script-skeleton", "aria-hidden": "true", children: [
    /* @__PURE__ */ t("span", {}),
    /* @__PURE__ */ t("strong", {}),
    /* @__PURE__ */ t("em", {}),
    /* @__PURE__ */ t("small", {})
  ] }, e)) });
}
function Ne(e, r) {
  if (!e)
    return r;
  const o = new Date(e);
  if (Number.isNaN(o.getTime()))
    return r;
  const n = Math.max(0, Math.floor((Date.now() - o.getTime()) / 1e3)), c = 60, m = c * 60, a = m * 24;
  return n < c ? `${r} 刚刚` : n < m ? `${r} ${Math.floor(n / c)}分钟前` : n < a ? `${r} ${Math.floor(n / m)}小时前` : `${r} ${Math.floor(n / a)}天前`;
}
function ke({
  mode: e,
  project: r,
  onClose: o,
  onSubmit: n
}) {
  const [c, m] = f(r?.name || ""), [a, h] = f(r?.description || ""), [l, p] = f(""), [b, g] = f(!1);
  B(o, b);
  async function d(u) {
    if (u.preventDefault(), b)
      return;
    const w = c.trim();
    if (!w) {
      p("请输入作品标题");
      return;
    }
    if (Array.from(w).length > 128) {
      p("作品标题不能超过 128 个字符");
      return;
    }
    g(!0), p("");
    try {
      await n({
        name: w,
        description: a.trim()
      });
    } catch (v) {
      p(v instanceof Error ? v.message : "保存作品失败");
    } finally {
      g(!1);
    }
  }
  const y = e === "edit";
  return /* @__PURE__ */ t(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (u) => {
        u.target === u.currentTarget && !b && o();
      },
      children: /* @__PURE__ */ s(
        "form",
        {
          className: "hb-script-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "hb-script-metadata-title",
          onSubmit: d,
          children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "hb-script-modal-close",
                onClick: o,
                disabled: b,
                "aria-label": "关闭",
                children: /* @__PURE__ */ t(q, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ s("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ t("h2", { id: "hb-script-metadata-title", children: y ? "编辑作品" : "新建作品" }),
              /* @__PURE__ */ t("p", { children: y ? "修改作品标题与描述。" : "记录灵感，开始新的创作。" })
            ] }),
            /* @__PURE__ */ s("div", { className: "hb-script-modal-body", children: [
              /* @__PURE__ */ s("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ t("span", { children: "标题" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    value: c,
                    maxLength: 128,
                    onChange: (u) => m(u.target.value),
                    placeholder: "输入作品标题",
                    autoFocus: !0
                  }
                )
              ] }),
              /* @__PURE__ */ s("label", { className: "hb-script-field", children: [
                /* @__PURE__ */ t("span", { children: "描述" }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    value: a,
                    onChange: (u) => h(u.target.value),
                    placeholder: "记录作品的灵感、目标或进展",
                    rows: 4
                  }
                )
              ] }),
              l ? /* @__PURE__ */ t("div", { className: "hb-script-form-error", children: l }) : null
            ] }),
            /* @__PURE__ */ s("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: o,
                  disabled: b,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "submit",
                  className: "hb-script-primary",
                  disabled: b,
                  children: [
                    b ? /* @__PURE__ */ t(R, { size: 15, className: "hb-script-spin" }) : null,
                    y ? "保存" : "创建"
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
function we({
  project: e,
  onClose: r,
  onConfirm: o
}) {
  const [n, c] = f(!1), [m, a] = f("");
  B(r, n);
  async function h() {
    if (!n) {
      c(!0), a("");
      try {
        await o();
      } catch (l) {
        a(l instanceof Error ? l.message : "删除作品失败");
      } finally {
        c(!1);
      }
    }
  }
  return /* @__PURE__ */ t(
    "div",
    {
      className: "hb-script-modal-backdrop",
      onMouseDown: (l) => {
        l.target === l.currentTarget && !n && r();
      },
      children: /* @__PURE__ */ s(
        "section",
        {
          className: "hb-script-modal hb-script-confirm",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": "hb-script-delete-title",
          children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "hb-script-modal-close",
                onClick: r,
                disabled: n,
                "aria-label": "关闭",
                children: /* @__PURE__ */ t(q, { size: 17, strokeWidth: 2.1 })
              }
            ),
            /* @__PURE__ */ t("div", { className: "hb-script-confirm-icon", children: /* @__PURE__ */ t(W, { size: 20 }) }),
            /* @__PURE__ */ s("header", { className: "hb-script-modal-head", children: [
              /* @__PURE__ */ t("h2", { id: "hb-script-delete-title", children: "移入回收站？" }),
              /* @__PURE__ */ s("p", { children: [
                "“",
                e.name,
                "”将从作品列表移除，你可以稍后在回收站中恢复。"
              ] })
            ] }),
            m ? /* @__PURE__ */ t("div", { className: "hb-script-confirm-error", children: m }) : null,
            /* @__PURE__ */ s("footer", { className: "hb-script-modal-actions", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  className: "hb-script-secondary",
                  onClick: r,
                  disabled: n,
                  children: "取消"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "hb-script-danger",
                  onClick: () => {
                    h();
                  },
                  disabled: n,
                  children: [
                    n ? /* @__PURE__ */ t(R, { size: 15, className: "hb-script-spin" }) : null,
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
function B(e, r) {
  A(() => {
    function o(n) {
      n.key === "Escape" && !r && e();
    }
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [r, e]);
}
const j = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function Fe({
  teamID: e = 0,
  onRequireAuth: r
}) {
  const o = Q(), n = ee(), [c, m] = f("works"), [a, h] = f(j), [l, p] = f(1), [b, g] = f(e > 0), [d, y] = f(null), [u, w] = f(null), [v, S] = f(0), C = _(0), N = E(async () => {
    const i = ++C.current;
    if (!e) {
      h(j), g(!1);
      return;
    }
    h((k) => ({ ...k, items: [] })), g(!0);
    try {
      const k = await oe(
        e,
        c,
        l,
        24,
        n
      );
      i === C.current && h(k);
    } catch (k) {
      i === C.current && P.error(O(k, "加载作品失败"));
    } finally {
      i === C.current && g(!1);
    }
  }, [c, l, n, e]);
  A(() => (N(), () => {
    C.current += 1;
  }), [N]);
  const K = E(() => {
    if (!e && r) {
      r();
      return;
    }
    y({ mode: "create" });
  }, [r, e]), J = E(
    async (i) => {
      if (d?.mode === "edit" && d.project)
        await de(d.project.id, i), P.success("作品信息已更新"), await N();
      else {
        if (!e)
          throw new Error("当前创作空间不可用");
        await le(e, i), P.success("作品已创建"), l === 1 ? await N() : p(1);
      }
      y(null);
    },
    [N, d, l, e]
  ), U = E(async () => {
    u && (await ue(u.id), P.success("作品已移入回收站"), a.items.length === 1 && l > 1 ? p((i) => i - 1) : await N(), w(null));
  }, [u, N, l, a.items.length]), X = E(
    async (i) => {
      if (!v) {
        S(i.id);
        try {
          await me(i.id), P.success("作品已恢复"), a.items.length === 1 && l > 1 ? p((k) => k - 1) : await N();
        } catch (k) {
          P.error(O(k, "恢复作品失败"));
        } finally {
          S(0);
        }
      }
    },
    [N, l, a.items.length, v]
  );
  function L(i) {
    i !== c && (h(j), p(1), g(!0), m(i));
  }
  return /* @__PURE__ */ s("div", { className: "hb-script-page", children: [
    /* @__PURE__ */ t("header", { className: "hb-script-toolbar", children: /* @__PURE__ */ s("div", { className: "hb-script-tabs", role: "tablist", "aria-label": "创作视图", children: [
      /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": c === "works",
          className: c === "works" ? "is-active" : "",
          onClick: () => L("works"),
          children: [
            /* @__PURE__ */ t(Y, { size: 14 }),
            "作品"
          ]
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": c === "trash",
          className: c === "trash" ? "is-active" : "",
          onClick: () => L("trash"),
          children: [
            /* @__PURE__ */ t(F, { size: 14 }),
            "回收站"
          ]
        }
      )
    ] }) }),
    b ? /* @__PURE__ */ t(ye, {}) : c === "works" ? /* @__PURE__ */ s("div", { className: "hb-script-grid", children: [
      /* @__PURE__ */ t(ge, { onCreate: K }),
      a.items.map((i) => /* @__PURE__ */ t(
        D,
        {
          project: i,
          view: "works",
          onOpen: () => o({
            to: "/bot/work/space",
            search: { project_id: String(i.id) }
          }),
          onEdit: () => y({ mode: "edit", project: i }),
          onDelete: () => w(i)
        },
        i.id
      ))
    ] }) : a.items.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-script-grid", children: a.items.map((i) => /* @__PURE__ */ t(
      D,
      {
        project: i,
        view: "trash",
        restoring: v === i.id,
        onRestore: () => {
          X(i);
        }
      },
      i.id
    )) }) : /* @__PURE__ */ t(ve, {}),
    a.total > a.pageSize ? /* @__PURE__ */ s("footer", { className: "hb-script-pagination", children: [
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "上一页",
          disabled: l <= 1 || b,
          onClick: () => p((i) => i - 1),
          children: /* @__PURE__ */ t(Z, {})
        }
      ),
      /* @__PURE__ */ s("span", { children: [
        a.page,
        " /",
        " ",
        Math.max(1, Math.ceil(a.total / a.pageSize))
      ] }),
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "下一页",
          disabled: !a.hasMore || b,
          onClick: () => p((i) => i + 1),
          children: /* @__PURE__ */ t(I, {})
        }
      )
    ] }) : null,
    d ? /* @__PURE__ */ t(
      ke,
      {
        mode: d.mode,
        project: d.project,
        onClose: () => y(null),
        onSubmit: J
      },
      `${d.mode}-${d.project?.id || 0}`
    ) : null,
    u ? /* @__PURE__ */ t(
      we,
      {
        project: u,
        onClose: () => w(null),
        onConfirm: U
      }
    ) : null
  ] });
}
function ve() {
  return /* @__PURE__ */ s("div", { className: "hb-script-empty", children: [
    /* @__PURE__ */ t(F, { size: 24, strokeWidth: 1.5 }),
    /* @__PURE__ */ t("strong", { children: "回收站为空" })
  ] });
}
function O(e, r) {
  return e instanceof Error && e.message ? e.message : r;
}
export {
  Fe as WorkProjectPage
};
