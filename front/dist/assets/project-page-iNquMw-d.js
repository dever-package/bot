import { j as t, a as n, F as A, b as _, c as B } from "./preloadable-Bomi5PEU.js";
import { a as w, d as T, b as O, e as P, S as G } from "./_commonjsHelpers-61wyk6v6.js";
import { P as Y, r as F, o as H, q as Q, h as X, s as Z, a1 as I, a2 as x, Y as ee, d as te } from "./vendor-icons-DwjYEojZ.js";
import { t as v } from "./index-BqbNvFGg.js";
import { a as se } from "./react-zN02Ae7w.js";
import { u as re } from "./project-dialogs-2EFX0RdT.js";
import { h as ae, d as z, a as ne, s as oe, r as C, j as ie, k as L } from "./site-config-C63CM9jT.js";
import { d as ce } from "./file-kind-CYMG3EzQ.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./project-page-DGJSA1S4.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const M = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const le = M.joinSiteApi, de = M.request, ue = ce();
function me(e, s, l = 1, i = 24, o = "") {
  const p = JSON.stringify({
    requestScopeKey: o,
    teamID: e,
    view: s,
    page: l,
    pageSize: i
  });
  return ue(p, async () => {
    const a = await j(
      s === "trash" ? "trash" : "list",
      "get",
      { team_id: e, page: l, page_size: i },
      s === "trash" ? "加载回收站失败" : "加载作品失败"
    );
    return {
      items: ne(a.items).map(ge).filter(we),
      page: z(a.page, l),
      pageSize: z(a.page_size, i),
      total: ae(a.total),
      hasMore: !!a.has_more
    };
  });
}
async function pe(e, s) {
  return j(
    "create",
    "post",
    {
      team_id: e,
      name: s.name,
      description: s.description
    },
    "创建作品失败"
  );
}
async function he(e, s) {
  return j(
    "update",
    "post",
    {
      id: e,
      name: s.name,
      description: s.description
    },
    "更新作品失败"
  );
}
async function be(e) {
  return j("delete", "post", { id: e }, "删除作品失败");
}
async function fe(e) {
  return j("restore", "post", { id: e }, "恢复作品失败");
}
async function j(e, s, l, i) {
  const o = await de(le(`project/${e}`), s, l);
  return oe(o, i);
}
function ge(e) {
  const s = ie(e) ? e : {};
  return {
    id: z(s.id),
    name: C(s.name) || "未命名作品",
    description: C(s.description),
    createdAt: C(s.created_at),
    updatedAt: C(s.updated_at),
    deletedAt: C(s.deleted_at)
  };
}
function we(e) {
  return e.id > 0;
}
function ye({ onCreate: e }) {
  return /* @__PURE__ */ n("button", { type: "button", className: "hb-script-create-card", onClick: e, children: [
    /* @__PURE__ */ t("span", { className: "hb-script-create-plus", children: /* @__PURE__ */ t(Y, { size: 20, strokeWidth: 1.35 }) }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-title", children: "新作品" }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-desc", children: "创建我的作品" })
  ] });
}
function q({
  project: e,
  view: s,
  restoring: l = !1,
  onOpen: i,
  onEdit: o,
  onDelete: p,
  onRestore: a
}) {
  const [u, d] = w(!1), h = T(null);
  O(() => {
    if (!u)
      return;
    function c(m) {
      h.current?.contains(m.target) || d(!1);
    }
    function y(m) {
      m.key === "Escape" && d(!1);
    }
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", y), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", y);
    };
  }, [u]);
  const N = /* @__PURE__ */ n(A, { children: [
    /* @__PURE__ */ t("span", { className: "hb-script-card-binding", "aria-hidden": "true" }),
    /* @__PURE__ */ n("span", { className: "hb-script-card-body", children: [
      /* @__PURE__ */ t("strong", { children: e.name }),
      /* @__PURE__ */ t("span", { children: e.description })
    ] }),
    /* @__PURE__ */ t("time", { children: ve(
      s === "trash" ? e.deletedAt || e.updatedAt : e.updatedAt || e.createdAt,
      s === "trash" ? "删除于" : "最近编辑"
    ) })
  ] });
  function g(c) {
    d(!1), c?.();
  }
  return /* @__PURE__ */ n(
    "article",
    {
      className: `hb-script-card ${u ? "has-open-menu" : ""} ${l ? "is-busy" : ""}`,
      children: [
        s === "works" ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "hb-script-card-main",
            onClick: i,
            "aria-label": `打开作品：${e.name}`,
            children: N
          }
        ) : /* @__PURE__ */ t("div", { className: "hb-script-card-main is-trash", children: N }),
        /* @__PURE__ */ n("div", { className: "hb-script-card-menu", ref: h, children: [
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "hb-script-card-menu-trigger",
              "aria-label": `${e.name}的更多操作`,
              "aria-haspopup": "menu",
              "aria-expanded": u,
              disabled: l,
              onClick: () => d((c) => !c),
              children: l ? /* @__PURE__ */ t(F, { size: 15, className: "hb-script-spin" }) : /* @__PURE__ */ t(H, { size: 17 })
            }
          ),
          u ? /* @__PURE__ */ t("div", { className: "hb-script-card-menu-popover", role: "menu", children: s === "works" ? /* @__PURE__ */ n(A, { children: [
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                role: "menuitem",
                onClick: () => g(o),
                children: [
                  /* @__PURE__ */ t(Q, { size: 14 }),
                  "编辑作品"
                ]
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: "is-danger",
                onClick: () => g(p),
                children: [
                  /* @__PURE__ */ t(X, { size: 14 }),
                  "移入回收站"
                ]
              }
            )
          ] }) : /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: l,
              onClick: () => g(a),
              children: [
                /* @__PURE__ */ t(Z, { size: 14 }),
                "恢复作品"
              ]
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function Ne() {
  return /* @__PURE__ */ t("div", { className: "hb-script-grid", children: [0, 1, 2].map((e) => /* @__PURE__ */ n("div", { className: "hb-script-skeleton", "aria-hidden": "true", children: [
    /* @__PURE__ */ t("span", {}),
    /* @__PURE__ */ t("strong", {}),
    /* @__PURE__ */ t("em", {}),
    /* @__PURE__ */ t("small", {})
  ] }, e)) });
}
function ve(e, s) {
  if (!e)
    return s;
  const l = new Date(e);
  if (Number.isNaN(l.getTime()))
    return s;
  const i = Math.max(0, Math.floor((Date.now() - l.getTime()) / 1e3)), o = 60, p = o * 60, a = p * 24;
  return i < o ? `${s} 刚刚` : i < p ? `${s} ${Math.floor(i / o)}分钟前` : i < a ? `${s} ${Math.floor(i / p)}小时前` : `${s} ${Math.floor(i / a)}天前`;
}
const W = B(
  () => import("./project-dialogs-2EFX0RdT.js").then((e) => e.p)
), ke = _(
  W,
  (e) => e.ProjectMetadataDialog
), Pe = _(
  W,
  (e) => e.DeleteProjectDialog
), Ce = ke.Component, je = Pe.Component, S = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function _e({
  teamID: e = 0,
  onRequireAuth: s
}) {
  const l = se(), i = re(), [o, p] = w("works"), [a, u] = w(S), [d, h] = w(1), [N, g] = w(e > 0), [c, y] = w(null), [m, D] = w(null), [R, E] = w(0), k = T(0), b = P(async () => {
    const r = ++k.current;
    if (!e) {
      u(S), g(!1);
      return;
    }
    u((f) => ({ ...f, items: [] })), g(!0);
    try {
      const f = await me(
        e,
        o,
        d,
        24,
        i
      );
      r === k.current && u(f);
    } catch (f) {
      r === k.current && v.error(L(f, "加载作品失败"));
    } finally {
      r === k.current && g(!1);
    }
  }, [o, d, i, e]);
  O(() => (b(), () => {
    k.current += 1;
  }), [b]);
  const V = P(() => {
    if (!e && s) {
      s();
      return;
    }
    y({ mode: "create" });
  }, [s, e]), J = P(
    async (r) => {
      if (c?.mode === "edit" && c.project)
        await he(c.project.id, r), v.success("作品信息已更新"), await b();
      else {
        if (!e)
          throw new Error("当前创作空间不可用");
        await pe(e, r), v.success("作品已创建"), d === 1 ? await b() : h(1);
      }
      y(null);
    },
    [b, c, d, e]
  ), K = P(async () => {
    m && (await be(m.id), v.success("作品已移入回收站"), a.items.length === 1 && d > 1 ? h((r) => r - 1) : await b(), D(null));
  }, [m, b, d, a.items.length]), U = P(
    async (r) => {
      if (!R) {
        E(r.id);
        try {
          await fe(r.id), v.success("作品已恢复"), a.items.length === 1 && d > 1 ? h((f) => f - 1) : await b();
        } catch (f) {
          v.error(L(f, "恢复作品失败"));
        } finally {
          E(0);
        }
      }
    },
    [b, d, a.items.length, R]
  );
  function $(r) {
    r !== o && (u(S), h(1), g(!0), p(r));
  }
  return /* @__PURE__ */ n("div", { className: "hb-script-page", children: [
    /* @__PURE__ */ t("header", { className: "hb-script-toolbar", children: /* @__PURE__ */ n("div", { className: "hb-script-tabs", role: "tablist", "aria-label": "创作视图", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": o === "works",
          className: o === "works" ? "is-active" : "",
          onClick: () => $("works"),
          children: [
            /* @__PURE__ */ t(I, { size: 14 }),
            "作品"
          ]
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": o === "trash",
          className: o === "trash" ? "is-active" : "",
          onClick: () => $("trash"),
          children: [
            /* @__PURE__ */ t(x, { size: 14 }),
            "回收站"
          ]
        }
      )
    ] }) }),
    N ? /* @__PURE__ */ t(Ne, {}) : o === "works" ? /* @__PURE__ */ n("div", { className: "hb-script-grid", children: [
      /* @__PURE__ */ t(ye, { onCreate: V }),
      a.items.map((r) => /* @__PURE__ */ t(
        q,
        {
          project: r,
          view: "works",
          onOpen: () => l({
            to: "/bot/work/space",
            search: { project_id: String(r.id) }
          }),
          onEdit: () => y({ mode: "edit", project: r }),
          onDelete: () => D(r)
        },
        r.id
      ))
    ] }) : a.items.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-script-grid", children: a.items.map((r) => /* @__PURE__ */ t(
      q,
      {
        project: r,
        view: "trash",
        restoring: R === r.id,
        onRestore: () => {
          U(r);
        }
      },
      r.id
    )) }) : /* @__PURE__ */ t(De, {}),
    a.total > a.pageSize ? /* @__PURE__ */ n("footer", { className: "hb-script-pagination", children: [
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "上一页",
          disabled: d <= 1 || N,
          onClick: () => h((r) => r - 1),
          children: /* @__PURE__ */ t(ee, {})
        }
      ),
      /* @__PURE__ */ n("span", { children: [
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
          disabled: !a.hasMore || N,
          onClick: () => h((r) => r + 1),
          children: /* @__PURE__ */ t(te, {})
        }
      )
    ] }) : null,
    c || m ? /* @__PURE__ */ n(G, { fallback: /* @__PURE__ */ t(Me, {}), children: [
      c ? /* @__PURE__ */ t(
        Ce,
        {
          mode: c.mode,
          project: c.project,
          onClose: () => y(null),
          onSubmit: J
        },
        `${c.mode}-${c.project?.id || 0}`
      ) : null,
      m ? /* @__PURE__ */ t(
        je,
        {
          project: m,
          onClose: () => D(null),
          onConfirm: K
        }
      ) : null
    ] }) : null
  ] });
}
function Me() {
  return /* @__PURE__ */ t("div", { className: "hb-script-modal-backdrop", children: /* @__PURE__ */ t(
    "div",
    {
      className: "hb-script-modal flex min-h-40 items-center justify-center text-[var(--body-work-muted)]",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "正在加载作品操作",
      children: /* @__PURE__ */ t(F, { className: "hb-script-spin", size: 20 })
    }
  ) });
}
function De() {
  return /* @__PURE__ */ n("div", { className: "hb-script-empty", children: [
    /* @__PURE__ */ t(x, { size: 24, strokeWidth: 1.5 }),
    /* @__PURE__ */ t("strong", { children: "回收站为空" })
  ] });
}
export {
  _e as WorkProjectPage
};
