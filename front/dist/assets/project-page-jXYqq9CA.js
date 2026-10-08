import { j as t, a as n, F as L, b as G } from "./react-CDpwMNlY.js";
import { a as w, e as O, b as T, h as P, S as Y } from "./file-kind-DFeonxO2.js";
import { r as F, o as H, q as Q, h as X, s as Z, P as I, a1 as ee, a2 as x, Y as te, d as se } from "./vendor-icons-Cz5zFzlk.js";
import { t as v } from "./index-CVhTq79S.js";
import { b as re, d as W, c as ae } from "./preloadable-B6OSmL0f.js";
import { u as ne } from "./project-dialogs-B9JRVYmP.js";
import { h as oe, c as E, a as ie, s as ce, r as C, j as le, k as q } from "./site-config-cvPYHSmK.js";
import { i as M } from "./asset-api-nw012__Q.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./project-page-DGJSA1S4.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const R = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!R || Object.keys(R).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const de = R.joinSiteApi, ue = R.request, me = re();
function pe(e, s, l = 1, i = 24, o = "") {
  const p = JSON.stringify({
    requestScopeKey: o,
    teamID: e,
    view: s,
    page: l,
    pageSize: i
  });
  return me(p, async () => {
    const a = await j(
      s === "trash" ? "trash" : "list",
      "get",
      { team_id: e, page: l, page_size: i },
      s === "trash" ? "加载回收站失败" : "加载作品失败"
    );
    return {
      items: ie(a.items).map(we).filter(ye),
      page: E(a.page, l),
      pageSize: E(a.page_size, i),
      total: oe(a.total),
      hasMore: !!a.has_more
    };
  });
}
async function he(e, s) {
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
async function be(e, s) {
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
async function fe(e) {
  return j("delete", "post", { id: e }, "删除作品失败");
}
async function ge(e) {
  return j("restore", "post", { id: e }, "恢复作品失败");
}
async function j(e, s, l, i) {
  const o = await ue(de(`project/${e}`), s, l);
  return ce(o, i);
}
function we(e) {
  const s = le(e) ? e : {};
  return {
    id: E(s.id),
    name: C(s.name) || "未命名作品",
    description: C(s.description),
    createdAt: C(s.created_at),
    updatedAt: C(s.updated_at),
    deletedAt: C(s.deleted_at)
  };
}
function ye(e) {
  return e.id > 0;
}
function Ne({ onCreate: e }) {
  return /* @__PURE__ */ n("button", { type: "button", className: "hb-script-create-card", onClick: e, children: [
    /* @__PURE__ */ t("span", { className: "hb-script-create-plus", children: /* @__PURE__ */ t(I, { size: 20, strokeWidth: 1.35 }) }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-title", children: "新作品" }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-desc", children: "创建我的作品" })
  ] });
}
function _({
  project: e,
  view: s,
  restoring: l = !1,
  onOpen: i,
  onEdit: o,
  onDelete: p,
  onRestore: a
}) {
  const [u, d] = w(!1), h = O(null);
  T(() => {
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
  const N = /* @__PURE__ */ n(L, { children: [
    /* @__PURE__ */ t("span", { className: "hb-script-card-binding", "aria-hidden": "true" }),
    /* @__PURE__ */ n("span", { className: "hb-script-card-body", children: [
      /* @__PURE__ */ t("strong", { children: e.name }),
      /* @__PURE__ */ t("span", { children: e.description })
    ] }),
    /* @__PURE__ */ t("time", { children: ke(
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
          u ? /* @__PURE__ */ t("div", { className: "hb-script-card-menu-popover", role: "menu", children: s === "works" ? /* @__PURE__ */ n(L, { children: [
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
function ve() {
  return /* @__PURE__ */ t("div", { className: "hb-script-grid", children: [0, 1, 2].map((e) => /* @__PURE__ */ n("div", { className: "hb-script-skeleton", "aria-hidden": "true", children: [
    /* @__PURE__ */ t("span", {}),
    /* @__PURE__ */ t("strong", {}),
    /* @__PURE__ */ t("em", {}),
    /* @__PURE__ */ t("small", {})
  ] }, e)) });
}
function ke(e, s) {
  if (!e)
    return s;
  const l = new Date(e);
  if (Number.isNaN(l.getTime()))
    return s;
  const i = Math.max(0, Math.floor((Date.now() - l.getTime()) / 1e3)), o = 60, p = o * 60, a = p * 24;
  return i < o ? `${s} 刚刚` : i < p ? `${s} ${Math.floor(i / o)}分钟前` : i < a ? `${s} ${Math.floor(i / p)}小时前` : `${s} ${Math.floor(i / a)}天前`;
}
const V = ae(
  () => import("./project-dialogs-B9JRVYmP.js").then((e) => e.p)
), Pe = W(
  V,
  (e) => e.ProjectMetadataDialog
), Ce = W(
  V,
  (e) => e.DeleteProjectDialog
), je = Pe.Component, Me = Ce.Component, D = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function Oe({
  teamID: e = 0,
  onRequireAuth: s
}) {
  const l = G(), i = ne(), [o, p] = w("works"), [a, u] = w(D), [d, h] = w(1), [N, g] = w(e > 0), [c, y] = w(null), [m, S] = w(null), [z, $] = w(0), k = O(0), b = P(async () => {
    const r = ++k.current;
    if (!e) {
      u(D), g(!1);
      return;
    }
    u((f) => ({ ...f, items: [] })), g(!0);
    try {
      const f = await pe(
        e,
        o,
        d,
        24,
        i
      );
      r === k.current && u(f);
    } catch (f) {
      r === k.current && v.error(q(f, "加载作品失败"));
    } finally {
      r === k.current && g(!1);
    }
  }, [o, d, i, e]);
  T(() => (b(), () => {
    k.current += 1;
  }), [b]);
  const J = P(() => {
    if (!e && s) {
      s();
      return;
    }
    y({ mode: "create" });
  }, [s, e]), K = P(
    async (r) => {
      if (c?.mode === "edit" && c.project)
        await be(c.project.id, r), M({ teamID: e }), v.success("作品信息已更新"), await b();
      else {
        if (!e)
          throw new Error("当前创作空间不可用");
        await he(e, r), M({ teamID: e }), v.success("作品已创建"), d === 1 ? await b() : h(1);
      }
      y(null);
    },
    [b, c, d, e]
  ), U = P(async () => {
    m && (await fe(m.id), M({ teamID: e }), v.success("作品已移入回收站"), a.items.length === 1 && d > 1 ? h((r) => r - 1) : await b(), S(null));
  }, [m, b, d, a.items.length, e]), B = P(
    async (r) => {
      if (!z) {
        $(r.id);
        try {
          await ge(r.id), M({ teamID: e }), v.success("作品已恢复"), a.items.length === 1 && d > 1 ? h((f) => f - 1) : await b();
        } catch (f) {
          v.error(q(f, "恢复作品失败"));
        } finally {
          $(0);
        }
      }
    },
    [b, d, a.items.length, z, e]
  );
  function A(r) {
    r !== o && (u(D), h(1), g(!0), p(r));
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
          onClick: () => A("works"),
          children: [
            /* @__PURE__ */ t(ee, { size: 14 }),
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
          onClick: () => A("trash"),
          children: [
            /* @__PURE__ */ t(x, { size: 14 }),
            "回收站"
          ]
        }
      )
    ] }) }),
    N ? /* @__PURE__ */ t(ve, {}) : o === "works" ? /* @__PURE__ */ n("div", { className: "hb-script-grid", children: [
      /* @__PURE__ */ t(Ne, { onCreate: J }),
      a.items.map((r) => /* @__PURE__ */ t(
        _,
        {
          project: r,
          view: "works",
          onOpen: () => l({
            to: "/bot/work/space",
            search: { project_id: String(r.id) }
          }),
          onEdit: () => y({ mode: "edit", project: r }),
          onDelete: () => S(r)
        },
        r.id
      ))
    ] }) : a.items.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-script-grid", children: a.items.map((r) => /* @__PURE__ */ t(
      _,
      {
        project: r,
        view: "trash",
        restoring: z === r.id,
        onRestore: () => {
          B(r);
        }
      },
      r.id
    )) }) : /* @__PURE__ */ t(Se, {}),
    a.total > a.pageSize ? /* @__PURE__ */ n("footer", { className: "hb-script-pagination", children: [
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "上一页",
          disabled: d <= 1 || N,
          onClick: () => h((r) => r - 1),
          children: /* @__PURE__ */ t(te, {})
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
          children: /* @__PURE__ */ t(se, {})
        }
      )
    ] }) : null,
    c || m ? /* @__PURE__ */ n(Y, { fallback: /* @__PURE__ */ t(Re, {}), children: [
      c ? /* @__PURE__ */ t(
        je,
        {
          mode: c.mode,
          project: c.project,
          onClose: () => y(null),
          onSubmit: K
        },
        `${c.mode}-${c.project?.id || 0}`
      ) : null,
      m ? /* @__PURE__ */ t(
        Me,
        {
          project: m,
          onClose: () => S(null),
          onConfirm: U
        }
      ) : null
    ] }) : null
  ] });
}
function Re() {
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
function Se() {
  return /* @__PURE__ */ n("div", { className: "hb-script-empty", children: [
    /* @__PURE__ */ t(x, { size: 24, strokeWidth: 1.5 }),
    /* @__PURE__ */ t("strong", { children: "回收站为空" })
  ] });
}
export {
  Oe as WorkProjectPage
};
