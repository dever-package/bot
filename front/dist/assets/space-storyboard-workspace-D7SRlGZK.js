import { j as t, a as m, S as x, F as G } from "./preloadable-CbkzeflN.js";
import { P as Y, L as q, q as K, O as J, b as D, a3 as Q, r as W, z as _, j as A, c as X, a8 as Z } from "./vendor-icons-B1zF1_4n.js";
import { a as $, b as T, l as M, d as B, h as I, S as ee, r as te } from "./file-kind-X0KKJPkQ.js";
import { k as F, c as ne } from "./space-assistant-layout-B9KyeCM0.js";
import { p as oe, b as re } from "./node-detail-header-YT4Fy3hu.js";
import { B as z } from "./asset-preview-B63J-8X6.js";
import { C as H, a as se } from "./writing-run-labels-BAOiEHWx.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-workspace-BdM7Wdok.css", import.meta.url).href]);
function ae(e, n, a) {
  const r = Math.min(n.width, Math.max(0, a.width - 32)), u = e.left + e.width / 2, o = Math.min(
    Math.max(16 + r / 2, u),
    a.width - 16 - r / 2
  ), i = e.top + e.height + 16, w = Math.min(
    Math.max(16, i),
    Math.max(16, a.height - 16 - 240)
  ), g = Math.max(0, a.height - 16 - w);
  return { left: o, top: w, maxHeight: g };
}
const E = "storyboard-script", S = "storyboard-setting", U = ["character", "scene", "prop"];
function ie({
  activeSectionId: e,
  groups: n,
  scriptContent: a,
  renderNode: d,
  onActiveSectionChange: c,
  variant: r = "canvas",
  settingOnly: u = !1,
  onReplaceImage: o,
  onReferenceResult: i,
  settingSource: y,
  settings: w,
  mediaAspect: g
}) {
  const p = n.find((l) => l.id === e), { selectedNodeId: b, openResult: h, closeEditor: f, editor: C } = le(
    (u || e === S ? n.filter((l) => l.materialType) : p ? [p] : []).flatMap((l) => l.results),
    o
  );
  B(() => {
    u || e === E || e === S || n.some((l) => !l.materialType && l.id === e) || c(E);
  }, [e, n, c, u]);
  const s = (l) => {
    f(), c(l);
  };
  return /* @__PURE__ */ m(
    "div",
    {
      className: `ws-storyboard-workspace is-${r}${u ? " is-setting-only" : ""} nodrag nopan nowheel`,
      children: [
        u ? /* @__PURE__ */ t(
          O,
          {
            groups: n,
            variant: r,
            runAction: !0,
            renderNode: d,
            selectedNodeId: b,
            onOpenResult: h,
            onReferenceResult: i,
            ...w
          }
        ) : /* @__PURE__ */ m(G, { children: [
          /* @__PURE__ */ m("nav", { className: "ws-storyboard-workspace-menu", "aria-label": "分镜制作菜单", children: [
            /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: `ws-storyboard-workspace-script ${e === E ? "is-selected" : ""}`,
                "aria-current": e === E ? "page" : void 0,
                onClick: k(() => s(E)),
                children: [
                  /* @__PURE__ */ t("span", { children: /* @__PURE__ */ t("strong", { children: r === "detail" ? "镜头列表" : "分镜脚本" }) }),
                  r === "detail" ? /* @__PURE__ */ t(J, { size: 14 }) : /* @__PURE__ */ t(D, { size: 14 })
                ]
              }
            ),
            /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: "ws-storyboard-workspace-script " + (e === S ? "is-selected" : ""),
                "aria-current": e === S ? "page" : void 0,
                onClick: k(() => s(S)),
                children: [
                  /* @__PURE__ */ m("span", { children: [
                    /* @__PURE__ */ t("strong", { children: "设定" }),
                    /* @__PURE__ */ t("small", { children: y ? "共用设定" : "角色、场景、道具" })
                  ] }),
                  /* @__PURE__ */ t(Q, { size: 14 })
                ]
              }
            ),
            n.filter((l) => !l.materialType).map((l) => /* @__PURE__ */ t(
              he,
              {
                group: l,
                selected: l.id === e,
                onSelect: () => s(l.id)
              },
              l.id
            ))
          ] }),
          e === S ? /* @__PURE__ */ m("section", { className: "ws-storyboard-workspace-setting", children: [
            y && /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: "ws-storyboard-setting-source",
                onClick: k(y.onOpen),
                children: [
                  "共用设定 · ",
                  y.title,
                  " ↗"
                ]
              }
            ),
            /* @__PURE__ */ t(
              O,
              {
                groups: n,
                variant: r,
                runAction: !0,
                renderNode: d,
                selectedNodeId: b,
                onOpenResult: h,
                onReferenceResult: i,
                ...w
              }
            )
          ] }) : e === E ? /* @__PURE__ */ t("section", { className: "ws-storyboard-workspace-content is-script", children: a }, E) : /* @__PURE__ */ t(
            fe,
            {
              group: p,
              mediaAspect: g,
              renderNode: d,
              selectedNodeId: b,
              onOpenResult: h
            }
          )
        ] }),
        C
      ]
    }
  );
}
function le(e, n) {
  const [a, d] = $(""), [c, r] = $(null), u = T(null), o = T(null), i = e.find((p) => p.nodeId === a);
  M(() => {
    if (!i || !u.current) return;
    const p = u.current, b = () => {
      const l = p.getBoundingClientRect(), v = o.current?.firstElementChild?.getBoundingClientRect(), N = ae(
        l,
        { width: v?.width || 640, height: v?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight }
      );
      r(
        (R) => R?.left === N.left && R.top === N.top && R.maxHeight === N.maxHeight ? R : N
      );
    }, h = new ResizeObserver(b);
    h.observe(p);
    let f = null;
    const C = () => {
      const l = o.current?.firstElementChild || null;
      l !== f && (f && h.unobserve(f), l && h.observe(l), f = l), b();
    }, s = new MutationObserver(C);
    return o.current && s.observe(o.current, { childList: !0 }), C(), window.addEventListener("resize", b), window.addEventListener("scroll", b, !0), () => {
      s.disconnect(), h.disconnect(), window.removeEventListener("resize", b), window.removeEventListener("scroll", b, !0);
    };
  }, [i, c !== null]), B(() => {
    if (!i) return;
    const p = (h) => {
      const f = h.target;
      !u.current?.contains(f) && !o.current?.contains(f) && d("");
    }, b = (h) => {
      if (h.key !== "Escape" || (h.stopPropagation(), h.defaultPrevented)) return;
      const f = h.target instanceof Element ? h.target.closest(
        '[role="dialog"], [role="menu"], [role="listbox"]'
      ) : null;
      f && o.current?.contains(f) || (h.preventDefault(), d(""));
    };
    return document.addEventListener("pointerdown", p, !0), document.addEventListener("keydown", b), () => {
      document.removeEventListener("pointerdown", p, !0), document.removeEventListener("keydown", b);
    };
  }, [i]);
  const y = I(
    (p, b) => {
      if (p.node.type !== "power" || F(
        p.node.power,
        p.node.kind,
        p.node.outputType
      )) {
        p.onOpen();
        return;
      }
      u.current = b, r(null), d(p.nodeId), oe();
    },
    []
  ), w = I(() => d(""), []), g = i && c ? ne(
    /* @__PURE__ */ t(
      "div",
      {
        ref: o,
        className: "ws-storyboard-workspace-editor-anchor nodrag nopan nowheel",
        style: {
          left: c.left,
          top: c.top,
          "--ws-storyboard-editor-max-height": `${c.maxHeight}px`
        },
        onPointerDown: (p) => p.stopPropagation(),
        onMouseDown: (p) => p.stopPropagation(),
        children: /* @__PURE__ */ t(
          ee,
          {
            fallback: /* @__PURE__ */ t("div", { className: "ws-storyboard-workspace-editor-loading", children: "正在加载参数..." }),
            children: /* @__PURE__ */ t(
              re,
              {
                node: i.node,
                onReplaceImage: n ? () => {
                  n(i.nodeId), d("");
                } : void 0
              },
              a
            )
          }
        )
      }
    ),
    u.current?.closest(".wb-detail-backdrop") || u.current?.closest(".ws-page") || document.body
  ) : null;
  return { selectedNodeId: a, openResult: y, closeEditor: w, editor: g };
}
function Se({ groups: e, renderNode: n, variant: a = "canvas", onReplaceImage: d, onReferenceResult: c, settings: r }) {
  return /* @__PURE__ */ t(
    ie,
    {
      settingOnly: !0,
      onReplaceImage: d,
      onReferenceResult: c,
      groups: e,
      renderNode: n,
      settings: r,
      variant: a,
      activeSectionId: "",
      onActiveSectionChange: () => {
      },
      scriptContent: null
    }
  );
}
const ce = [];
function O({
  groups: e,
  variant: n,
  renderNode: a,
  selectedNodeId: d,
  onOpenResult: c,
  onReferenceResult: r,
  materials: u = ce,
  materialActions: o,
  runAction: i = !1,
  defaultType: y = "character"
}) {
  const [w, g] = $(y), p = T(null), b = (s) => e.find((l) => l.materialType === s), h = b(w), f = me(u.filter((s) => s.type === w), h), C = x[w];
  return /* @__PURE__ */ m("div", { className: `ws-setting-gallery is-${n}`, children: [
    /* @__PURE__ */ m("div", { className: "ws-setting-gallery-bar", children: [
      /* @__PURE__ */ t("nav", { className: "ws-setting-gallery-tabs nodrag nopan", "aria-label": "设定分类", children: U.map((s) => {
        const l = b(s), L = u.filter((v) => v.type === s).length || l?.memberCount || 0;
        return /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            "aria-pressed": w === s,
            "data-storyboard-material-type": s,
            className: l?.status === "error" ? "is-error" : pe(l) ? "is-running" : void 0,
            onClick: k(() => g(s)),
            children: [
              x[s],
              /* @__PURE__ */ t("em", { children: l ? `${l.completedCount}/${l.runnableCount || l.memberCount}` : L })
            ]
          },
          s
        );
      }) }),
      o || i ? /* @__PURE__ */ m("div", { className: "ws-setting-gallery-actions", children: [
        o ? /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-setting-gallery-action nodrag nopan",
            disabled: o.disabled,
            onClick: k(() => o.onAdd(w)),
            children: [
              /* @__PURE__ */ t(Y, { size: 14, "aria-hidden": "true" }),
              "添加",
              C
            ]
          }
        ) : null,
        i ? /* @__PURE__ */ t(de, { groups: e }) : null
      ] }) : null
    ] }),
    h?.runBlockedReason && !P(h) ? /* @__PURE__ */ t("p", { className: "ws-setting-gallery-note", children: h.runBlockedReason }) : null,
    /* @__PURE__ */ t("div", { ref: p, className: "ws-setting-gallery-grid nodrag nopan nowheel", children: /* @__PURE__ */ t(H, { root: p, rootMargin: "160px", children: /* @__PURE__ */ m("div", { className: "ws-setting-gallery-cards", children: [
      f.map(({ key: s, name: l, material: L, result: v }) => /* @__PURE__ */ t(
        ye,
        {
          name: l,
          result: v,
          selected: d === v?.nodeId,
          renderNode: a,
          onOpenResult: c,
          actions: /* @__PURE__ */ m(G, { children: [
            v && r ? /* @__PURE__ */ t(z, { label: "引用该素材生成", children: /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ws-setting-gallery-edit nodrag nopan",
                "aria-label": "引用" + l + "生成",
                onClick: (N) => {
                  N.stopPropagation();
                  const R = N.currentTarget.getBoundingClientRect();
                  r(v.nodeId, { x: R.right, y: R.bottom });
                },
                children: /* @__PURE__ */ t(q, { size: 14, "aria-hidden": "true" })
              }
            ) }) : null,
            L && o ? /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: "ws-setting-gallery-edit nodrag nopan",
                "aria-label": "编辑" + l + "的描述",
                disabled: o.disabled,
                onClick: k(() => o.onEdit(L)),
                children: [
                  /* @__PURE__ */ t(K, { size: 12, "aria-hidden": "true" }),
                  "编辑"
                ]
              }
            ) : null
          ] })
        },
        s
      )),
      f.length === 0 ? /* @__PURE__ */ m("p", { className: "ws-setting-gallery-empty", children: [
        "暂无",
        C
      ] }) : null
    ] }) }) })
  ] });
}
function de({ groups: e }) {
  const [n, a] = $(!1), d = T(null);
  B(() => {
    if (!n) return;
    const o = (i) => {
      d.current?.contains(i.target) || a(!1);
    };
    return document.addEventListener("pointerdown", o, !0), () => document.removeEventListener("pointerdown", o, !0);
  }, [n]);
  const c = U.flatMap((o) => {
    const i = e.find((y) => y.materialType === o);
    return i ? [{ type: o, group: i }] : [];
  }), r = c.find(({ group: o }) => P(o))?.group;
  if (r)
    return /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action nodrag nopan",
        disabled: r.stopping || !r.onStop,
        onClick: k(() => r.onStop?.()),
        children: [
          r.stopping || !r.onStop ? /* @__PURE__ */ t(W, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(_, { size: 11, fill: "currentColor" }),
          r.stopping ? "停止中" : r.onStop ? "停止" : "执行中"
        ]
      }
    );
  if (c.length === 0) return null;
  const u = c.some(({ group: o }) => o.completedCount < (o.runnableCount || o.memberCount));
  return /* @__PURE__ */ m("div", { ref: d, className: "ws-setting-gallery-menu nodrag nopan", children: [
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: `ws-setting-gallery-action${u ? " is-primary" : ""}`,
        "aria-expanded": n,
        onClick: k(() => a((o) => !o)),
        children: [
          u ? /* @__PURE__ */ t(A, { size: 11, fill: "currentColor" }) : null,
          u ? "生成形象" : "重新生成",
          /* @__PURE__ */ t(X, { size: 12 })
        ]
      }
    ),
    n ? /* @__PURE__ */ t("div", { role: "menu", children: c.map(({ type: o, group: i }) => /* @__PURE__ */ t(z, { label: i.runBlockedReason || j({ ...i, title: x[o] }), children: /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        role: "menuitem",
        disabled: !i.onRun,
        onClick: k(() => {
          a(!1), i.onRun?.();
        }),
        children: ue(i, x[o])
      }
    ) }, o)) }) : null
  ] });
}
function ue(e, n) {
  const a = e.runnableCount || e.memberCount;
  return a > 0 && e.completedCount >= a ? `重做全部${n}` : e.completedCount > 0 ? `继续生成${n}` : `生成${n}`;
}
function pe(e) {
  return e ? P(e) : !1;
}
function me(e, n) {
  const a = n?.results || [], d = /* @__PURE__ */ new Set(), c = e.map((r) => {
    const u = a.find((o) => o.node.storyboardItem?.itemId === r.id);
    return u && d.add(u.nodeId), { key: r.id, name: r.name || "未命名", material: r, result: u };
  });
  for (const r of a)
    d.has(r.nodeId) || c.push({ key: r.nodeId, name: r.node.title || "未命名", result: r });
  return c;
}
function he({
  group: e,
  selected: n,
  onSelect: a
}) {
  const d = P(e), c = ge(e), r = e.runnableCount || e.memberCount;
  return /* @__PURE__ */ m(
    "div",
    {
      className: `ws-storyboard-workspace-group ${n ? "is-selected" : ""} ${d ? "is-running" : ""} ${e.status === "error" ? "is-error" : ""}`,
      children: [
        /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-storyboard-workspace-group-select nodrag nopan",
            "aria-label": `${e.title}，已完成 ${e.completedCount}/${r}${c ? `，${c}` : ""}`,
            "aria-current": n ? "page" : void 0,
            onClick: k(a),
            children: [
              /* @__PURE__ */ m("span", { children: [
                /* @__PURE__ */ t("strong", { children: e.title }),
                c ? /* @__PURE__ */ t("small", { role: "status", children: c }) : null
              ] }),
              /* @__PURE__ */ m("em", { children: [
                e.completedCount,
                "/",
                r
              ] })
            ]
          }
        ),
        /* @__PURE__ */ t(be, { group: e, onBeforeAction: a })
      ]
    }
  );
}
function be({
  group: e,
  onBeforeAction: n
}) {
  const a = P(e), d = a ? e.onStop : e.onRun, c = a ? e.stopping ? "正在停止" : e.onStop ? `停止${e.title}` : `${e.title}正在执行` : e.runBlockedReason || j(e);
  return /* @__PURE__ */ t(z, { label: c, children: /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: `ws-storyboard-workspace-group-action nodrag nopan ${a ? "is-stop" : ""}`,
      "aria-label": c,
      disabled: e.stopping || !d || !a && !!e.runBlockedReason,
      onClick: d ? k(() => {
        n?.(), d();
      }) : void 0,
      children: e.stopping || a && !e.onStop ? /* @__PURE__ */ t(W, { size: 13, className: "ws-spin" }) : a ? /* @__PURE__ */ t(_, { size: 12, fill: "currentColor" }) : /* @__PURE__ */ t(A, { size: 13, fill: "currentColor" })
    }
  ) });
}
function fe({
  group: e,
  mediaAspect: n,
  renderNode: a,
  selectedNodeId: d,
  onOpenResult: c
}) {
  const r = T(null), u = T(/* @__PURE__ */ new Map()), o = e?.id;
  return M(() => {
    const i = r.current;
    !i || !o || (i.scrollTop = u.current.get(o) || 0);
  }, [o]), e ? /* @__PURE__ */ m(
    "section",
    {
      className: "ws-storyboard-workspace-results",
      "aria-label": e.title,
      children: [
        e.runBlockedReason && !P(e) ? /* @__PURE__ */ t("p", { className: "ws-storyboard-workspace-blocked", children: e.runBlockedReason }) : null,
        e.results.length > 0 ? /* @__PURE__ */ t(
          "div",
          {
            ref: r,
            className: "ws-storyboard-workspace-result-grid",
            onScroll: (i) => {
              o && u.current.set(
                o,
                i.currentTarget.scrollTop
              );
            },
            children: /* @__PURE__ */ t(H, { root: r, rootMargin: "160px", children: /* @__PURE__ */ t("div", { className: "ws-storyboard-preview-grid", children: e.results.map((i) => /* @__PURE__ */ t(
              V,
              {
                result: i,
                mediaAspect: n,
                selected: d === i.nodeId,
                renderNode: a,
                onOpenResult: c
              },
              i.nodeId
            )) }) })
          }
        ) : /* @__PURE__ */ m("div", { className: "ws-storyboard-workspace-result-empty", children: [
          /* @__PURE__ */ t(D, { size: 18 }),
          /* @__PURE__ */ t("span", { children: "这一组还没有内容" }),
          /* @__PURE__ */ t("small", { children: "确认分镜脚本后会自动生成镜头图和视频" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-workspace-results is-empty", children: "暂无制作分组" });
}
const we = {
  pending: "待生成",
  running: "生成中",
  waiting: "等待反馈",
  complete: "",
  error: "生成失败"
};
function ye({
  name: e,
  result: n,
  mediaAspect: a,
  selected: d,
  renderNode: c,
  onOpenResult: r,
  actions: u
}) {
  const o = n?.status ?? "pending", i = we[o];
  return /* @__PURE__ */ m("div", { className: "ws-storyboard-picture-card", "data-status": o, children: [
    n ? /* @__PURE__ */ t(
      V,
      {
        result: n,
        mediaAspect: a,
        selected: d,
        renderNode: c,
        onOpenResult: r
      }
    ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-picture-placeholder", "aria-hidden": "true", children: /* @__PURE__ */ t(Z, { size: 20 }) }),
    /* @__PURE__ */ m("div", { className: "ws-storyboard-picture-caption", children: [
      /* @__PURE__ */ m("div", { children: [
        /* @__PURE__ */ t("strong", { children: e }),
        i ? /* @__PURE__ */ t("small", { children: i }) : null
      ] }),
      u
    ] })
  ] });
}
const V = te(function({
  result: n,
  mediaAspect: a,
  selected: d,
  renderNode: c,
  onOpenResult: r
}) {
  const { ref: u, visible: o } = se(!1), [i, y] = $(!1), [w, g] = $(!1), p = T(/* @__PURE__ */ new Set());
  M(() => {
    for (const s of p.current)
      (!u.current?.contains(s) || s.paused || s.ended) && p.current.delete(s);
    g(p.current.size > 0);
  }, [u, n.node]);
  const b = (s) => {
    p.current.delete(s.target), g(p.current.size > 0);
  }, h = F(
    n.node.power,
    n.node.kind,
    n.node.outputType
  ), f = Math.max(1, n.node.width), C = Math.max(1, n.node.height);
  return /* @__PURE__ */ t(
    "div",
    {
      ref: u,
      role: "group",
      tabIndex: 0,
      className: `ws-storyboard-workspace-result${h ? " is-video-compose" : ""} is-${n.status} ${d ? "is-selected" : ""} nodrag nopan`,
      style: h ? { height: C } : {
        aspectRatio: `var(--ws-storyboard-preview-aspect, ${a?.includes(":") ? a.replace(":", " / ") : `${f} / ${C}`})`
      },
      onFocusCapture: () => y(!0),
      onBlurCapture: (s) => {
        s.currentTarget.contains(s.relatedTarget) || y(!1);
      },
      onPlayCapture: (s) => {
        p.current.add(s.target), g(!0);
      },
      onPauseCapture: b,
      onEndedCapture: b,
      onClick: (s) => {
        s.stopPropagation(), !s.target.closest(
          "button, a, video, input, textarea, select, [contenteditable]"
        ) && r(n, s.currentTarget);
      },
      onKeyDown: (s) => {
        s.target === s.currentTarget && (s.key !== "Enter" && s.key !== " " || (s.preventDefault(), s.stopPropagation(), r(n, s.currentTarget)));
      },
      "aria-label": `编辑${n.node.title || "制作节点"}`,
      children: o || d || i || w ? c(n.node, d) : null
    }
  );
});
function P(e) {
  return e.status === "running" || e.status === "waiting";
}
function j(e) {
  return e.runnableCount > 0 && e.completedCount >= e.runnableCount ? `重新执行${e.title}` : e.completedCount > 0 ? `继续执行${e.title}` : `执行${e.title}`;
}
function ge(e) {
  return e.stopping ? "停止中" : e.status === "running" ? "执行中" : e.status === "waiting" ? "等待反馈" : e.status === "error" ? e.failedCount > 0 ? `失败 ${e.failedCount}` : "执行失败" : e.runBlockedReason ? "等待前置" : "";
}
function k(e) {
  return (n) => {
    n.preventDefault(), n.stopPropagation(), e();
  };
}
export {
  Se as S,
  S as a,
  E as b,
  ie as c,
  O as d,
  le as u
};
