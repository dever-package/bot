import { a as t, j as n, F as E } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as y, u as T, o as _, b as v, S as U } from "./react-C7Xtl8sB.js";
import { x as B, L as O, y as H, z as Q, T as X, d as Y, D as Z, G as q, o as I, p as ee } from "./vendor-icons-Cc7Kl3It.js";
import { t as k } from "./index-BxqXLJC9.js";
import { u as te } from "./runtime-entry-CEEPqE_1.js";
import { a as x, b as se } from "./preloadable-PCKj9Z7v.js";
import { u as ae } from "./auth-scope-DtEYh2HY.js";
import { k as re, c as z, a as ne, s as oe, r as j, h as ie, j as L } from "./site-config-BVY1isir.js";
import { c as ce, m as F } from "./in-flight-request-DlB1DJg0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./project-page-DGJSA1S4.css", import.meta.url).href]);
const le = F.joinSiteApi, de = F.request, ue = ce();
function me(e, s, l = 1, i = 24, o = "") {
  const p = JSON.stringify({
    requestScopeKey: o,
    teamID: e,
    view: s,
    page: l,
    pageSize: i
  });
  return ue(p, async () => {
    const r = await C(
      s === "trash" ? "trash" : "list",
      "get",
      { team_id: e, page: l, page_size: i },
      s === "trash" ? "加载回收站失败" : "加载作品失败"
    );
    return {
      items: ne(r.items).map(ge).filter(ye),
      page: z(r.page, l),
      pageSize: z(r.page_size, i),
      total: re(r.total),
      hasMore: !!r.has_more
    };
  });
}
async function pe(e, s) {
  return C(
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
  return C(
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
  return C("delete", "post", { id: e }, "删除作品失败");
}
async function be(e) {
  return C("restore", "post", { id: e }, "恢复作品失败");
}
async function C(e, s, l, i) {
  const o = await de(le(`project/${e}`), s, l);
  return oe(o, i);
}
function ge(e) {
  const s = ie(e) ? e : {};
  return {
    id: z(s.id),
    name: j(s.name) || "未命名作品",
    description: j(s.description),
    createdAt: j(s.created_at),
    updatedAt: j(s.updated_at),
    deletedAt: j(s.deleted_at)
  };
}
function ye(e) {
  return e.id > 0;
}
function Ne({ onCreate: e }) {
  return /* @__PURE__ */ n("button", { type: "button", className: "hb-script-create-card", onClick: e, children: [
    /* @__PURE__ */ t("span", { className: "hb-script-create-plus", children: /* @__PURE__ */ t(B, { size: 20, strokeWidth: 1.35 }) }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-title", children: "新作品" }),
    /* @__PURE__ */ t("span", { className: "hb-script-create-desc", children: "创建我的作品" })
  ] });
}
function A({
  project: e,
  view: s,
  restoring: l = !1,
  onOpen: i,
  onEdit: o,
  onDelete: p,
  onRestore: r
}) {
  const [u, d] = y(!1), h = T(null);
  _(() => {
    if (!u)
      return;
    function c(m) {
      h.current?.contains(m.target) || d(!1);
    }
    function N(m) {
      m.key === "Escape" && d(!1);
    }
    return document.addEventListener("mousedown", c), document.addEventListener("keydown", N), () => {
      document.removeEventListener("mousedown", c), document.removeEventListener("keydown", N);
    };
  }, [u]);
  const w = /* @__PURE__ */ n(E, { children: [
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
            children: w
          }
        ) : /* @__PURE__ */ t("div", { className: "hb-script-card-main is-trash", children: w }),
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
              children: l ? /* @__PURE__ */ t(O, { size: 15, className: "hb-script-spin" }) : /* @__PURE__ */ t(H, { size: 17 })
            }
          ),
          u ? /* @__PURE__ */ t("div", { className: "hb-script-card-menu-popover", role: "menu", children: s === "works" ? /* @__PURE__ */ n(E, { children: [
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
              onClick: () => g(r),
              children: [
                /* @__PURE__ */ t(Y, { size: 14 }),
                "恢复作品"
              ]
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function we() {
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
  const i = Math.max(0, Math.floor((Date.now() - l.getTime()) / 1e3)), o = 60, p = o * 60, r = p * 24;
  return i < o ? `${s} 刚刚` : i < p ? `${s} ${Math.floor(i / o)}分钟前` : i < r ? `${s} ${Math.floor(i / p)}小时前` : `${s} ${Math.floor(i / r)}天前`;
}
const W = se(
  () => import("./project-dialogs-CdThoMTm.js").then((e) => e.p)
), Pe = x(
  W,
  (e) => e.ProjectMetadataDialog
), ve = x(
  W,
  (e) => e.DeleteProjectDialog
), je = Pe.Component, Ce = ve.Component, R = {
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
  const l = te(), i = ae(), [o, p] = y("works"), [r, u] = y(R), [d, h] = y(1), [w, g] = y(e > 0), [c, N] = y(null), [m, M] = y(null), [D, S] = y(0), P = T(0), f = v(async () => {
    const a = ++P.current;
    if (!e) {
      u(R), g(!1);
      return;
    }
    u((b) => ({ ...b, items: [] })), g(!0);
    try {
      const b = await me(
        e,
        o,
        d,
        24,
        i
      );
      a === P.current && u(b);
    } catch (b) {
      a === P.current && k.error(L(b, "加载作品失败"));
    } finally {
      a === P.current && g(!1);
    }
  }, [o, d, i, e]);
  _(() => (f(), () => {
    P.current += 1;
  }), [f]);
  const V = v(() => {
    if (!e && s) {
      s();
      return;
    }
    N({ mode: "create" });
  }, [s, e]), G = v(
    async (a) => {
      if (c?.mode === "edit" && c.project)
        await he(c.project.id, a), k.success("作品信息已更新"), await f();
      else {
        if (!e)
          throw new Error("当前创作空间不可用");
        await pe(e, a), k.success("作品已创建"), d === 1 ? await f() : h(1);
      }
      N(null);
    },
    [f, c, d, e]
  ), J = v(async () => {
    m && (await fe(m.id), k.success("作品已移入回收站"), r.items.length === 1 && d > 1 ? h((a) => a - 1) : await f(), M(null));
  }, [m, f, d, r.items.length]), K = v(
    async (a) => {
      if (!D) {
        S(a.id);
        try {
          await be(a.id), k.success("作品已恢复"), r.items.length === 1 && d > 1 ? h((b) => b - 1) : await f();
        } catch (b) {
          k.error(L(b, "恢复作品失败"));
        } finally {
          S(0);
        }
      }
    },
    [f, d, r.items.length, D]
  );
  function $(a) {
    a !== o && (u(R), h(1), g(!0), p(a));
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
            /* @__PURE__ */ t(Z, { size: 14 }),
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
            /* @__PURE__ */ t(q, { size: 14 }),
            "回收站"
          ]
        }
      )
    ] }) }),
    w ? /* @__PURE__ */ t(we, {}) : o === "works" ? /* @__PURE__ */ n("div", { className: "hb-script-grid", children: [
      /* @__PURE__ */ t(Ne, { onCreate: V }),
      r.items.map((a) => /* @__PURE__ */ t(
        A,
        {
          project: a,
          view: "works",
          onOpen: () => l({
            to: "/bot/work/space",
            search: { project_id: String(a.id) }
          }),
          onEdit: () => N({ mode: "edit", project: a }),
          onDelete: () => M(a)
        },
        a.id
      ))
    ] }) : r.items.length > 0 ? /* @__PURE__ */ t("div", { className: "hb-script-grid", children: r.items.map((a) => /* @__PURE__ */ t(
      A,
      {
        project: a,
        view: "trash",
        restoring: D === a.id,
        onRestore: () => {
          K(a);
        }
      },
      a.id
    )) }) : /* @__PURE__ */ t(De, {}),
    r.total > r.pageSize ? /* @__PURE__ */ n("footer", { className: "hb-script-pagination", children: [
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "上一页",
          disabled: d <= 1 || w,
          onClick: () => h((a) => a - 1),
          children: /* @__PURE__ */ t(I, {})
        }
      ),
      /* @__PURE__ */ n("span", { children: [
        r.page,
        " /",
        " ",
        Math.max(1, Math.ceil(r.total / r.pageSize))
      ] }),
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          title: "下一页",
          disabled: !r.hasMore || w,
          onClick: () => h((a) => a + 1),
          children: /* @__PURE__ */ t(ee, {})
        }
      )
    ] }) : null,
    c || m ? /* @__PURE__ */ n(U, { fallback: /* @__PURE__ */ t(Me, {}), children: [
      c ? /* @__PURE__ */ t(
        je,
        {
          mode: c.mode,
          project: c.project,
          onClose: () => N(null),
          onSubmit: G
        },
        `${c.mode}-${c.project?.id || 0}`
      ) : null,
      m ? /* @__PURE__ */ t(
        Ce,
        {
          project: m,
          onClose: () => M(null),
          onConfirm: J
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
      children: /* @__PURE__ */ t(O, { className: "hb-script-spin", size: 20 })
    }
  ) });
}
function De() {
  return /* @__PURE__ */ n("div", { className: "hb-script-empty", children: [
    /* @__PURE__ */ t(q, { size: 24, strokeWidth: 1.5 }),
    /* @__PURE__ */ t("strong", { children: "回收站为空" })
  ] });
}
export {
  Oe as WorkProjectPage
};
