if (!window.DeverFront?.ensureStyles) {
  throw new Error("Dever front runtime does not support chunk styles");
}
await window.DeverFront.ensureStyles([new URL("./space-canvas-switcher-BKWhk8TQ.css", import.meta.url).href]);
import { j as a, a as t, F as se } from "./react-HSzdbxZ7.js";
import { a as u, d as K } from "./file-kind-D6bMOzYN.js";
import { c as le } from "./preloadable-CT3tMmBD.js";
import { m as de, P as oe, X as V, G as ce, n as X, o as ue, p as me, c as R, q as fe, r as O, h as q, s as ge } from "./vendor-icons-fVDtJt66.js";
/* empty css                               */
function Ce({
  errorFeedback: g,
  open: r,
  canvases: s,
  deletedCanvases: v,
  deletedLoading: T = !1,
  activeCanvasId: z,
  disabled: k = !1,
  onClose: l,
  onSelect: H,
  onCreate: J,
  onRename: Q,
  onReorder: W,
  onDelete: Y,
  onRestore: Z
}) {
  const [b, w] = u(0), [A, y] = u(""), [h, N] = u(!1), [d, o] = u(""), [I, p] = u(0), [P, C] = u(0), [L, S] = u(!1), [F, x] = u(0), [M, E] = u(0);
  K(() => {
    if (!r) return;
    const e = (n) => {
      if (n.key === "Escape") {
        if (I || b || h) {
          p(0), w(0), N(!1);
          return;
        }
        l();
      }
    };
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [I, h, b, l, r]), K(() => {
    r || (w(0), y(""), N(!1), o(""), p(0), C(0), S(!1), x(0), E(0));
  }, [r]);
  function _(e) {
    N(!1), C(0), p(0), w(e.id), y(e.name || "第一幕");
  }
  function ee() {
    w(0), C(0), p(0), y(""), N(!0);
  }
  async function j() {
    const e = A.trim();
    if (!e && !h || d) return;
    const n = h ? "create" : `rename:${b}`;
    o(n);
    try {
      h ? await J(e) : b && await Q(b, e), N(!1), w(0), y("");
    } catch {
    } finally {
      o("");
    }
  }
  async function ae(e) {
    if (e === z) {
      l();
      return;
    }
    o(`select:${e}`);
    try {
      await H(e) !== !1 && l();
    } finally {
      o("");
    }
  }
  async function B(e, n) {
    const c = e + n;
    if (c < 0 || c >= s.length || d)
      return;
    const i = s.map((m) => m.id);
    [i[e], i[c]] = [i[c], i[e]], await G(i);
  }
  function te(e, n) {
    if (d || k) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(n)), x(n);
  }
  async function ne(e, n) {
    e.preventDefault();
    const c = F || Number(e.dataTransfer.getData("text/plain"));
    if (x(0), E(0), !c || c === n) return;
    const i = s.map((f) => f.id), m = i.indexOf(c), $ = i.indexOf(n);
    m < 0 || $ < 0 || (i.splice(m, 1), i.splice($, 0, c), await G(i));
  }
  async function G(e) {
    o("reorder"), p(0);
    try {
      await W(e);
    } catch {
    } finally {
      o("");
    }
  }
  async function ie(e) {
    if (!d) {
      if (P !== e) {
        C(e);
        return;
      }
      o(`delete:${e}`);
      try {
        await Y(e), C(0), p(0);
      } catch {
      } finally {
        o("");
      }
    }
  }
  async function re(e) {
    if (!d) {
      o(`restore:${e}`);
      try {
        await Z(e), l();
      } catch {
      } finally {
        o("");
      }
    }
  }
  if (!r || typeof document > "u") return null;
  const D = k || !!d;
  return le(
    /* @__PURE__ */ a(
      "div",
      {
        className: "ws-canvas-manager-backdrop",
        onMouseDown: (e) => {
          e.target === e.currentTarget && !d && l();
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
                  /* @__PURE__ */ a("span", { className: "ws-canvas-manager-icon", "aria-hidden": "true", children: /* @__PURE__ */ a(de, { size: 18 }) }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ t("h2", { id: "ws-canvas-manager-title", children: [
                    "画布 ",
                    s.length
                  ] }) })
                ] }),
                /* @__PURE__ */ t("div", { className: "ws-canvas-manager-header-actions", children: [
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      className: "is-primary",
                      disabled: D || h,
                      onClick: ee,
                      children: [
                        /* @__PURE__ */ a(oe, { size: 15 }),
                        "新建"
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      "aria-label": "关闭画布管理",
                      disabled: !!d,
                      onClick: l,
                      children: /* @__PURE__ */ a(V, { size: 17 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ t("div", { className: "ws-canvas-manager-body custom-scrollbar", children: [
                g,
                h ? /* @__PURE__ */ a("div", { className: "ws-canvas-manager-create", children: /* @__PURE__ */ a(
                  U,
                  {
                    value: A,
                    busy: d === "create",
                    placeholder: "留空自动命名",
                    allowEmpty: !0,
                    onChange: y,
                    onSubmit: j,
                    onCancel: () => N(!1)
                  }
                ) }) : null,
                /* @__PURE__ */ a("div", { className: "ws-canvas-manager-list", "aria-label": "画布列表", children: s.map((e, n) => {
                  const c = b === e.id, i = e.id === z, m = I === e.id, $ = P === e.id;
                  return /* @__PURE__ */ t(
                    "div",
                    {
                      className: `ws-canvas-manager-row ${i ? "is-active" : ""} ${M === e.id ? "is-drag-target" : ""}`,
                      onDragOver: (f) => {
                        F && (f.preventDefault(), f.dataTransfer.dropEffect = "move", E(e.id));
                      },
                      onDragLeave: () => {
                        M === e.id && E(0);
                      },
                      onDrop: (f) => {
                        ne(f, e.id);
                      },
                      children: [
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            className: "ws-canvas-manager-drag",
                            draggable: !D,
                            "aria-label": `拖动${e.name || "画布"}调整顺序`,
                            disabled: D || s.length < 2,
                            onDragStart: (f) => te(f, e.id),
                            onDragEnd: () => {
                              x(0), E(0);
                            },
                            children: /* @__PURE__ */ a(ce, { size: 15 })
                          }
                        ),
                        c ? /* @__PURE__ */ a(
                          U,
                          {
                            value: A,
                            busy: d === `rename:${e.id}`,
                            onChange: y,
                            onSubmit: j,
                            onCancel: () => w(0)
                          }
                        ) : /* @__PURE__ */ t(se, { children: [
                          /* @__PURE__ */ t(
                            "button",
                            {
                              type: "button",
                              className: "ws-canvas-manager-select",
                              disabled: D,
                              onClick: () => {
                                ae(e.id);
                              },
                              children: [
                                /* @__PURE__ */ a("strong", { children: e.name || "第一幕" }),
                                i ? /* @__PURE__ */ t("span", { children: [
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
                                "aria-expanded": m,
                                disabled: D,
                                onClick: () => {
                                  C(0), p(m ? 0 : e.id);
                                },
                                children: /* @__PURE__ */ a(ue, { size: 17 })
                              }
                            ),
                            m ? /* @__PURE__ */ t("div", { className: "ws-canvas-manager-menu", children: [
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  disabled: n === 0,
                                  onClick: () => {
                                    B(n, -1);
                                  },
                                  children: [
                                    /* @__PURE__ */ a(me, { size: 14 }),
                                    "上移"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  disabled: n === s.length - 1,
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
                                  onClick: () => _(e),
                                  children: [
                                    /* @__PURE__ */ a(fe, { size: 14 }),
                                    "重命名"
                                  ]
                                }
                              ),
                              /* @__PURE__ */ t(
                                "button",
                                {
                                  type: "button",
                                  className: $ ? "is-danger" : "",
                                  disabled: s.length <= 1,
                                  onClick: () => {
                                    ie(e.id);
                                  },
                                  children: [
                                    d === `delete:${e.id}` ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(q, { size: 14 }),
                                    $ ? "确认删除" : "删除"
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
                          T ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : v.length,
                          /* @__PURE__ */ a(R, { size: 15, className: L ? "is-open" : "" })
                        ] })
                      ]
                    }
                  ),
                  L ? /* @__PURE__ */ a("div", { className: "ws-canvas-manager-deleted-list", children: T ? /* @__PURE__ */ a("p", { children: "正在加载已删除画布" }) : v.length === 0 ? /* @__PURE__ */ a("p", { children: "暂无已删除画布" }) : v.map((e) => /* @__PURE__ */ t(
                    "div",
                    {
                      className: "ws-canvas-manager-deleted-row",
                      children: [
                        /* @__PURE__ */ t("div", { children: [
                          /* @__PURE__ */ a("strong", { children: e.name || "未命名画布" }),
                          /* @__PURE__ */ a("span", { children: he(e) })
                        ] }),
                        /* @__PURE__ */ t(
                          "button",
                          {
                            type: "button",
                            disabled: D,
                            onClick: () => {
                              re(e.id);
                            },
                            children: [
                              d === `restore:${e.id}` ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(ge, { size: 14 }),
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
  value: g,
  busy: r,
  placeholder: s,
  allowEmpty: v = !1,
  onChange: T,
  onSubmit: z,
  onCancel: k
}) {
  return /* @__PURE__ */ t("div", { className: "ws-canvas-name-editor", children: [
    /* @__PURE__ */ a(
      "input",
      {
        autoFocus: !0,
        value: g,
        maxLength: 128,
        placeholder: s,
        disabled: r,
        onChange: (l) => T(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" && z(), l.key === "Escape" && k();
        }
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": "保存名称",
        disabled: r || !v && !g.trim(),
        onClick: () => {
          z();
        },
        children: r ? /* @__PURE__ */ a(O, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ a(X, { size: 14 })
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": "取消",
        disabled: r,
        onClick: k,
        children: /* @__PURE__ */ a(V, { size: 14 })
      }
    )
  ] });
}
function he(g) {
  const r = g.deletedAt || g.updatedAt;
  if (!r) return "删除时间未知";
  const s = new Date(r);
  return Number.isNaN(s.getTime()) ? "删除时间未知" : `删除于 ${new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(s)}`;
}
export {
  Ce as SpaceCanvasManagerDialog
};
