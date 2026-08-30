import { j as a, a as t, F as re } from "./preloadable-Bomi5PEU.js";
import { a as u, b as K } from "./_commonjsHelpers-61wyk6v6.js";
import { b as se } from "./file-kind-CYMG3EzQ.js";
import { m as le, P as de, X as V, G as oe, n as X, o as ce, p as ue, c as R, q as me, r as O, h as q, s as fe } from "./vendor-icons-DwjYEojZ.js";
/* empty css                               */
function Ne({
  open: l,
  canvases: i,
  deletedCanvases: m,
  deletedLoading: $ = !1,
  activeCanvasId: T,
  disabled: z = !1,
  onClose: c,
  onSelect: b,
  onCreate: H,
  onRename: J,
  onReorder: Q,
  onDelete: W,
  onRestore: Y
}) {
  const [w, y] = u(0), [A, N] = u(""), [h, C] = u(!1), [s, d] = u(""), [I, p] = u(0), [P, D] = u(0), [L, S] = u(!1), [F, x] = u(0), [M, k] = u(0);
  K(() => {
    if (!l) return;
    const e = (n) => {
      if (n.key === "Escape") {
        if (I || w || h) {
          p(0), y(0), C(!1);
          return;
        }
        c();
      }
    };
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [I, h, w, c, l]), K(() => {
    l || (y(0), N(""), C(!1), d(""), p(0), D(0), S(!1), x(0), k(0));
  }, [l]);
  function Z(e) {
    C(!1), D(0), p(0), y(e.id), N(e.name || "第一幕");
  }
  function _() {
    y(0), D(0), p(0), N(""), C(!0);
  }
  async function j() {
    const e = A.trim();
    if (!e && !h || s) return;
    const n = h ? "create" : `rename:${w}`;
    d(n);
    try {
      h ? await H(e) : w && await J(w, e), C(!1), y(0), N("");
    } catch {
    } finally {
      d("");
    }
  }
  async function ee(e) {
    if (e === T) {
      c();
      return;
    }
    d(`select:${e}`);
    try {
      await b(e) !== !1 && c();
    } finally {
      d("");
    }
  }
  async function B(e, n) {
    const o = e + n;
    if (o < 0 || o >= i.length || s)
      return;
    const r = i.map((f) => f.id);
    [r[e], r[o]] = [r[o], r[e]], await G(r);
  }
  function ae(e, n) {
    if (s || z) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(n)), x(n);
  }
  async function te(e, n) {
    e.preventDefault();
    const o = F || Number(e.dataTransfer.getData("text/plain"));
    if (x(0), k(0), !o || o === n) return;
    const r = i.map((g) => g.id), f = r.indexOf(o), E = r.indexOf(n);
    f < 0 || E < 0 || (r.splice(f, 1), r.splice(E, 0, o), await G(r));
  }
  async function G(e) {
    d("reorder"), p(0);
    try {
      await Q(e);
    } catch {
    } finally {
      d("");
    }
  }
  async function ne(e) {
    if (!s) {
      if (P !== e) {
        D(e);
        return;
      }
      d(`delete:${e}`);
      try {
        await W(e), D(0), p(0);
      } catch {
      } finally {
        d("");
      }
    }
  }
  async function ie(e) {
    if (!s) {
      d(`restore:${e}`);
      try {
        await Y(e), c();
      } catch {
      } finally {
        d("");
      }
    }
  }
  if (!l || typeof document > "u") return null;
  const v = z || !!s;
  return se(
    /* @__PURE__ */ a(
      "div",
      {
        className: "ws-canvas-manager-backdrop",
        onMouseDown: (e) => {
          e.target === e.currentTarget && !s && c();
        },
        children: /* @__PURE__ */ t(
          "section",
          {
            className: "ws-canvas-manager-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "ws-canvas-manager-title",
            children: [
              /* @__PURE__ */ t("header", { className: "ws-canvas-manager-header", children: [
                /* @__PURE__ */ t("div", { children: [
                  /* @__PURE__ */ a("span", { className: "ws-canvas-manager-icon", "aria-hidden": "true", children: /* @__PURE__ */ a(le, { size: 18 }) }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ t("h2", { id: "ws-canvas-manager-title", children: [
                    "画布 ",
                    i.length
                  ] }) })
                ] }),
                /* @__PURE__ */ t("div", { className: "ws-canvas-manager-header-actions", children: [
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      className: "is-primary",
                      disabled: v || h,
                      onClick: _,
                      children: [
                        /* @__PURE__ */ a(de, { size: 15 }),
                        "新建"
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      "aria-label": "关闭画布管理",
                      disabled: !!s,
                      onClick: c,
                      children: /* @__PURE__ */ a(V, { size: 17 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ws-canvas-manager-body custom-scrollbar", children: [
                h ? /* @__PURE__ */ a("div", { className: "ws-canvas-manager-create", children: /* @__PURE__ */ a(
                  U,
                  {
                    value: A,
                    busy: s === "create",
                    placeholder: "留空自动命名",
                    allowEmpty: !0,
                    onChange: N,
                    onSubmit: j,
                    onCancel: () => C(!1)
                  }
                ) }) : null,
                /* @__PURE__ */ a("div", { className: "ws-canvas-manager-list", "aria-label": "画布列表", children: i.map((e, n) => {
                  const o = w === e.id, r = e.id === T, f = I === e.id, E = P === e.id;
                  return /* @__PURE__ */ t(
                    "div",
                    {
                      className: `ws-canvas-manager-row ${r ? "is-active" : ""} ${M === e.id ? "is-drag-target" : ""}`,
                      onDragOver: (g) => {
                        F && (g.preventDefault(), g.dataTransfer.dropEffect = "move", k(e.id));
                      },
                      onDragLeave: () => {
                        M === e.id && k(0);
                      },
                      onDrop: (g) => {
                        te(g, e.id);
                      },
                      children: [
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            className: "ws-canvas-manager-drag",
                            draggable: !v,
                            "aria-label": `拖动${e.name || "画布"}调整顺序`,
                            disabled: v || i.length < 2,
                            onDragStart: (g) => ae(g, e.id),
                            onDragEnd: () => {
                              x(0), k(0);
                            },
                            children: /* @__PURE__ */ a(oe, { size: 15 })
                          }
                        ),
                        o ? /* @__PURE__ */ a(
                          U,
                          {
                            value: A,
                            busy: s === `rename:${e.id}`,
                            onChange: N,
                            onSubmit: j,
                            onCancel: () => y(0)
                          }
                        ) : /* @__PURE__ */ t(re, { children: [
                          /* @__PURE__ */ t(
                            "button",
                            {
                              type: "button",
                              className: "ws-canvas-manager-select",
                              disabled: v,
                              onClick: () => {
                                ee(e.id);
                              },
                              children: [
                                /* @__PURE__ */ a("strong", { children: e.name || "第一幕" }),
                                r ? /* @__PURE__ */ t("span", { children: [
                                  /* @__PURE__ */ a(X, { size: 13 }),
                                  "当前"
                                ] }) : null
                              ]
                            }
                          ),
                          /* @__PURE__ */ t("div", { className: "ws-canvas-manager-more", children: [
                            /* @__PURE__ */ a(
                              "button",
                              {
                                type: "button",
                                "aria-label": `${e.name || "画布"}操作`,
                                "aria-expanded": f,
                                disabled: v,
                                onClick: () => {
                                  D(0), p(f ? 0 : e.id);
                                },
                                children: /* @__PURE__ */ a(ce, { size: 17 })
                              }
                            ),
                            f ? /* @__PURE__ */ t("div", { className: "ws-canvas-manager-menu", children: [
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  disabled: n === 0,
                                  onClick: () => {
                                    B(n, -1);
                                  },
                                  children: [
                                    /* @__PURE__ */ a(ue, { size: 14 }),
                                    "上移"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  disabled: n === i.length - 1,
                                  onClick: () => {
                                    B(n, 1);
                                  },
                                  children: [
                                    /* @__PURE__ */ a(R, { size: 14 }),
                                    "下移"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => Z(e),
                                  children: [
                                    /* @__PURE__ */ a(me, { size: 14 }),
                                    "重命名"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  className: E ? "is-danger" : "",
                                  disabled: i.length <= 1,
                                  onClick: () => {
                                    ne(e.id);
                                  },
                                  children: [
                                    s === `delete:${e.id}` ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(q, { size: 14 }),
                                    E ? "确认删除" : "删除"
                                  ]
                                }
                              )
                            ] }) : null
                          ] })
                        ] })
                      ]
                    },
                    e.id
                  );
                }) }),
                /* @__PURE__ */ t("section", { className: "ws-canvas-manager-trash", children: [
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      className: "ws-canvas-manager-trash-toggle",
                      "aria-expanded": L,
                      onClick: () => S((e) => !e),
                      children: [
                        /* @__PURE__ */ t("span", { children: [
                          /* @__PURE__ */ a(q, { size: 15 }),
                          "已删除画布"
                        ] }),
                        /* @__PURE__ */ t("span", { children: [
                          $ ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : m.length,
                          /* @__PURE__ */ a(R, { size: 15, className: L ? "is-open" : "" })
                        ] })
                      ]
                    }
                  ),
                  L ? /* @__PURE__ */ a("div", { className: "ws-canvas-manager-deleted-list", children: $ ? /* @__PURE__ */ a("p", { children: "正在加载已删除画布" }) : m.length === 0 ? /* @__PURE__ */ a("p", { children: "暂无已删除画布" }) : m.map((e) => /* @__PURE__ */ t(
                    "div",
                    {
                      className: "ws-canvas-manager-deleted-row",
                      children: [
                        /* @__PURE__ */ t("div", { children: [
                          /* @__PURE__ */ a("strong", { children: e.name || "未命名画布" }),
                          /* @__PURE__ */ a("span", { children: ge(e) })
                        ] }),
                        /* @__PURE__ */ t(
                          "button",
                          {
                            type: "button",
                            disabled: v,
                            onClick: () => {
                              ie(e.id);
                            },
                            children: [
                              s === `restore:${e.id}` ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(fe, { size: 14 }),
                              "恢复"
                            ]
                          }
                        )
                      ]
                    },
                    e.id
                  )) }) : null
                ] })
              ] })
            ]
          }
        )
      }
    ),
    document.body
  );
}
function U({
  value: l,
  busy: i,
  placeholder: m,
  allowEmpty: $ = !1,
  onChange: T,
  onSubmit: z,
  onCancel: c
}) {
  return /* @__PURE__ */ t("div", { className: "ws-canvas-name-editor", children: [
    /* @__PURE__ */ a(
      "input",
      {
        autoFocus: !0,
        value: l,
        maxLength: 128,
        placeholder: m,
        disabled: i,
        onChange: (b) => T(b.target.value),
        onKeyDown: (b) => {
          b.key === "Enter" && z(), b.key === "Escape" && c();
        }
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": "保存名称",
        disabled: i || !$ && !l.trim(),
        onClick: () => {
          z();
        },
        children: i ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(X, { size: 14 })
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": "取消",
        disabled: i,
        onClick: c,
        children: /* @__PURE__ */ a(V, { size: 14 })
      }
    )
  ] });
}
function ge(l) {
  const i = l.deletedAt || l.updatedAt;
  if (!i) return "删除时间未知";
  const m = new Date(i);
  return Number.isNaN(m.getTime()) ? "删除时间未知" : `删除于 ${new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(m)}`;
}
export {
  Ne as SpaceCanvasManagerDialog
};
