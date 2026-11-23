import { j as t, a as m, S as x, F as D } from "./preloadable-B6QZqbLd.js";
import { P as q, L as K, q as J, O as Q, b as G, a3 as X, r as _, z as W, j as A, c as Z, a8 as ee } from "./vendor-icons-IZIW7U43.js";
import { a as $, b as T, l as M, d as z, h as I, S as te, r as ne } from "./file-kind-Cq3pESGF.js";
import { k as F, c as oe } from "./space-assistant-layout-B9KyeCM0.js";
import { p as re, b as se } from "./node-detail-header-DivpGPu9.js";
import { B } from "./asset-audio-preview-CWf3Wq_n.js";
import { C as H, a as ae } from "./writing-run-labels-LBbhWSQU.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-workspace-gDEkVy-_.css", import.meta.url).href]);
function ie(e, n, i) {
  const r = Math.min(n.width, Math.max(0, i.width - 32)), u = e.left + e.width / 2, o = Math.min(
    Math.max(16 + r / 2, u),
    i.width - 16 - r / 2
  ), s = e.top + e.height + 16, w = Math.min(
    Math.max(16, s),
    Math.max(16, i.height - 16 - 240)
  ), g = Math.max(0, i.height - 16 - w);
  return { left: o, top: w, maxHeight: g };
}
const E = "storyboard-script", S = "storyboard-setting", V = ["character", "scene", "prop"];
function le({
  activeSectionId: e,
  groups: n,
  scriptContent: i,
  renderNode: d,
  onActiveSectionChange: c,
  variant: r = "canvas",
  settingOnly: u = !1,
  onReplaceImage: o,
  onReferenceResult: s,
  settingSource: y,
  settings: w,
  mediaAspect: g
}) {
  const p = n.find((l) => l.id === e), { selectedNodeId: b, openResult: h, closeEditor: f, editor: C } = ce(
    (u || e === S ? n.filter((l) => l.materialType) : p ? [p] : []).flatMap((l) => l.results),
    o
  );
  z(() => {
    u || e === E || e === S || n.some((l) => !l.materialType && l.id === e) || c(E);
  }, [e, n, c, u]);
  const a = (l) => {
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
            onReferenceResult: s,
            ...w
          }
        ) : /* @__PURE__ */ m(D, { children: [
          /* @__PURE__ */ m("nav", { className: "ws-storyboard-workspace-menu", "aria-label": "分镜制作菜单", children: [
            /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: `ws-storyboard-workspace-script ${e === E ? "is-selected" : ""}`,
                "aria-current": e === E ? "page" : void 0,
                onClick: k(() => a(E)),
                children: [
                  /* @__PURE__ */ t("span", { children: /* @__PURE__ */ t("strong", { children: r === "detail" ? "镜头列表" : "分镜脚本" }) }),
                  r === "detail" ? /* @__PURE__ */ t(Q, { size: 14 }) : /* @__PURE__ */ t(G, { size: 14 })
                ]
              }
            ),
            /* @__PURE__ */ m(
              "button",
              {
                type: "button",
                className: "ws-storyboard-workspace-script " + (e === S ? "is-selected" : ""),
                "aria-current": e === S ? "page" : void 0,
                onClick: k(() => a(S)),
                children: [
                  /* @__PURE__ */ m("span", { children: [
                    /* @__PURE__ */ t("strong", { children: "设定" }),
                    /* @__PURE__ */ t("small", { children: y ? "共用设定" : "角色、场景、道具" })
                  ] }),
                  /* @__PURE__ */ t(X, { size: 14 })
                ]
              }
            ),
            n.filter((l) => !l.materialType).map((l) => /* @__PURE__ */ t(
              be,
              {
                group: l,
                selected: l.id === e,
                onSelect: () => a(l.id)
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
                onReferenceResult: s,
                ...w
              }
            )
          ] }) : e === E ? /* @__PURE__ */ t("section", { className: "ws-storyboard-workspace-content is-script", children: i }, E) : /* @__PURE__ */ t(
            we,
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
function ce(e, n) {
  const [i, d] = $(""), [c, r] = $(null), u = T(null), o = T(null), s = e.find((p) => p.nodeId === i);
  M(() => {
    if (!s || !u.current) return;
    const p = u.current, b = () => {
      const l = p.getBoundingClientRect(), v = o.current?.firstElementChild?.getBoundingClientRect(), N = ie(
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
    }, a = new MutationObserver(C);
    return o.current && a.observe(o.current, { childList: !0 }), C(), window.addEventListener("resize", b), window.addEventListener("scroll", b, !0), () => {
      a.disconnect(), h.disconnect(), window.removeEventListener("resize", b), window.removeEventListener("scroll", b, !0);
    };
  }, [s, c !== null]), z(() => {
    if (!s) return;
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
  }, [s]);
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
      u.current = b, r(null), d(p.nodeId), re();
    },
    []
  ), w = I(() => d(""), []), g = s && c ? oe(
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
          te,
          {
            fallback: /* @__PURE__ */ t("div", { className: "ws-storyboard-workspace-editor-loading", children: "正在加载参数..." }),
            children: /* @__PURE__ */ t(
              se,
              {
                node: s.node,
                onReplaceImage: n ? () => {
                  n(s.nodeId), d("");
                } : void 0
              },
              i
            )
          }
        )
      }
    ),
    u.current?.closest(".wb-detail-backdrop") || u.current?.closest(".ws-page") || document.body
  ) : null;
  return { selectedNodeId: i, openResult: y, closeEditor: w, editor: g };
}
function Se({ groups: e, renderNode: n, variant: i = "canvas", onReplaceImage: d, onReferenceResult: c, settings: r }) {
  return /* @__PURE__ */ t(
    le,
    {
      settingOnly: !0,
      onReplaceImage: d,
      onReferenceResult: c,
      groups: e,
      renderNode: n,
      settings: r,
      variant: i,
      activeSectionId: "",
      onActiveSectionChange: () => {
      },
      scriptContent: null
    }
  );
}
const de = [];
function O({
  groups: e,
  variant: n,
  renderNode: i,
  selectedNodeId: d,
  onOpenResult: c,
  onReferenceResult: r,
  materials: u = de,
  materialActions: o,
  runAction: s = !1,
  defaultType: y = "character"
}) {
  const [w, g] = $(y), p = T(null), b = (a) => e.find((l) => l.materialType === a), h = b(w), f = he(u.filter((a) => a.type === w), h), C = x[w];
  return /* @__PURE__ */ m("div", { className: `ws-setting-gallery is-${n}`, children: [
    /* @__PURE__ */ m("div", { className: "ws-setting-gallery-bar", children: [
      /* @__PURE__ */ t("nav", { className: "ws-setting-gallery-tabs nodrag nopan", "aria-label": "设定分类", children: V.map((a) => {
        const l = b(a), L = u.filter((v) => v.type === a).length || l?.memberCount || 0;
        return /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            "aria-pressed": w === a,
            "data-storyboard-material-type": a,
            className: l?.status === "error" ? "is-error" : me(l) ? "is-running" : void 0,
            onClick: k(() => g(a)),
            children: [
              x[a],
              /* @__PURE__ */ t("em", { children: l ? `${l.completedCount}/${l.runnableCount || l.memberCount}` : L })
            ]
          },
          a
        );
      }) }),
      o || s ? /* @__PURE__ */ m("div", { className: "ws-setting-gallery-actions", children: [
        o ? /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-setting-gallery-action nodrag nopan",
            disabled: o.disabled,
            onClick: k(() => o.onAdd(w)),
            children: [
              /* @__PURE__ */ t(q, { size: 14, "aria-hidden": "true" }),
              "添加",
              C
            ]
          }
        ) : null,
        s ? /* @__PURE__ */ t(ue, { groups: e }) : null
      ] }) : null
    ] }),
    h?.runBlockedReason && !P(h) ? /* @__PURE__ */ t("p", { className: "ws-setting-gallery-note", children: h.runBlockedReason }) : null,
    /* @__PURE__ */ t("div", { ref: p, className: "ws-setting-gallery-grid nodrag nopan nowheel", children: /* @__PURE__ */ t(H, { root: p, rootMargin: "160px", children: /* @__PURE__ */ m("div", { className: "ws-setting-gallery-cards", children: [
      f.map(({ key: a, name: l, material: L, result: v }) => /* @__PURE__ */ t(
        U,
        {
          name: l,
          result: v,
          selected: d === v?.nodeId,
          renderNode: i,
          onOpenResult: c,
          actions: /* @__PURE__ */ m(D, { children: [
            v && r ? /* @__PURE__ */ t(B, { label: "引用该素材生成", children: /* @__PURE__ */ t(
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
                children: /* @__PURE__ */ t(K, { size: 14, "aria-hidden": "true" })
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
                  /* @__PURE__ */ t(J, { size: 12, "aria-hidden": "true" }),
                  "编辑"
                ]
              }
            ) : null
          ] })
        },
        a
      )),
      f.length === 0 ? /* @__PURE__ */ m("p", { className: "ws-setting-gallery-empty", children: [
        "暂无",
        C
      ] }) : null
    ] }) }) })
  ] });
}
function ue({ groups: e }) {
  const [n, i] = $(!1), d = T(null);
  z(() => {
    if (!n) return;
    const o = (s) => {
      d.current?.contains(s.target) || i(!1);
    };
    return document.addEventListener("pointerdown", o, !0), () => document.removeEventListener("pointerdown", o, !0);
  }, [n]);
  const c = V.flatMap((o) => {
    const s = e.find((y) => y.materialType === o);
    return s ? [{ type: o, group: s }] : [];
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
          r.stopping || !r.onStop ? /* @__PURE__ */ t(_, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(W, { size: 11, fill: "currentColor" }),
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
        onClick: k(() => i((o) => !o)),
        children: [
          u ? /* @__PURE__ */ t(A, { size: 11, fill: "currentColor" }) : null,
          u ? "生成形象" : "重新生成",
          /* @__PURE__ */ t(Z, { size: 12 })
        ]
      }
    ),
    n ? /* @__PURE__ */ t("div", { role: "menu", children: c.map(({ type: o, group: s }) => /* @__PURE__ */ t(B, { label: s.runBlockedReason || Y({ ...s, title: x[o] }), children: /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        role: "menuitem",
        disabled: !s.onRun,
        onClick: k(() => {
          i(!1), s.onRun?.();
        }),
        children: pe(s, x[o])
      }
    ) }, o)) }) : null
  ] });
}
function pe(e, n) {
  const i = e.runnableCount || e.memberCount;
  return i > 0 && e.completedCount >= i ? `重做全部${n}` : e.completedCount > 0 ? `继续生成${n}` : `生成${n}`;
}
function me(e) {
  return e ? P(e) : !1;
}
function he(e, n) {
  const i = n?.results || [], d = /* @__PURE__ */ new Set(), c = e.map((r) => {
    const u = i.find((o) => o.node.storyboardItem?.itemId === r.id);
    return u && d.add(u.nodeId), { key: r.id, name: r.name || "未命名", material: r, result: u };
  });
  for (const r of i)
    d.has(r.nodeId) || c.push({ key: r.nodeId, name: r.node.title || "未命名", result: r });
  return c;
}
function be({
  group: e,
  selected: n,
  onSelect: i
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
            onClick: k(i),
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
        /* @__PURE__ */ t(fe, { group: e, onBeforeAction: i })
      ]
    }
  );
}
function fe({
  group: e,
  onBeforeAction: n
}) {
  const i = P(e), d = i ? e.onStop : e.onRun, c = i ? e.stopping ? "正在停止" : e.onStop ? `停止${e.title}` : `${e.title}正在执行` : e.runBlockedReason || Y(e);
  return /* @__PURE__ */ t(B, { label: c, children: /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: `ws-storyboard-workspace-group-action nodrag nopan ${i ? "is-stop" : ""}`,
      "aria-label": c,
      disabled: e.stopping || !d || !i && !!e.runBlockedReason,
      onClick: d ? k(() => {
        n?.(), d();
      }) : void 0,
      children: e.stopping || i && !e.onStop ? /* @__PURE__ */ t(_, { size: 13, className: "ws-spin" }) : i ? /* @__PURE__ */ t(W, { size: 12, fill: "currentColor" }) : /* @__PURE__ */ t(A, { size: 13, fill: "currentColor" })
    }
  ) });
}
function we({
  group: e,
  mediaAspect: n,
  renderNode: i,
  selectedNodeId: d,
  onOpenResult: c
}) {
  const r = T(null), u = T(/* @__PURE__ */ new Map()), o = e?.id;
  return M(() => {
    const s = r.current;
    !s || !o || (s.scrollTop = u.current.get(o) || 0);
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
            onScroll: (s) => {
              o && u.current.set(
                o,
                s.currentTarget.scrollTop
              );
            },
            children: /* @__PURE__ */ t(H, { root: r, rootMargin: "160px", children: /* @__PURE__ */ t("div", { className: "ws-storyboard-preview-grid", children: e.results.map((s) => s.node.storyboardItem?.itemType === "shot_image" ? /* @__PURE__ */ t(
              U,
              {
                name: s.node.title,
                result: s,
                mediaAspect: n,
                selected: d === s.nodeId,
                renderNode: i,
                onOpenResult: c
              },
              s.nodeId
            ) : /* @__PURE__ */ t(
              j,
              {
                result: s,
                mediaAspect: n,
                selected: d === s.nodeId,
                renderNode: i,
                onOpenResult: c
              },
              s.nodeId
            )) }) })
          }
        ) : /* @__PURE__ */ m("div", { className: "ws-storyboard-workspace-result-empty", children: [
          /* @__PURE__ */ t(G, { size: 18 }),
          /* @__PURE__ */ t("span", { children: "这一组还没有内容" }),
          /* @__PURE__ */ t("small", { children: "确认分镜脚本后会自动生成镜头图和视频" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-workspace-results is-empty", children: "暂无制作分组" });
}
const ye = {
  pending: "待生成",
  running: "生成中",
  waiting: "等待反馈",
  complete: "",
  error: "生成失败"
};
function U({
  name: e,
  result: n,
  mediaAspect: i,
  selected: d,
  renderNode: c,
  onOpenResult: r,
  actions: u
}) {
  const o = n?.status ?? "pending", s = ye[o];
  return /* @__PURE__ */ m("div", { className: "ws-storyboard-picture-card", "data-status": o, children: [
    n ? /* @__PURE__ */ t(
      j,
      {
        result: n,
        mediaAspect: i,
        selected: d,
        renderNode: c,
        onOpenResult: r
      }
    ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-picture-placeholder", "aria-hidden": "true", children: /* @__PURE__ */ t(ee, { size: 20 }) }),
    /* @__PURE__ */ m("div", { className: "ws-storyboard-picture-caption", children: [
      /* @__PURE__ */ m("div", { children: [
        /* @__PURE__ */ t("strong", { children: e }),
        s ? /* @__PURE__ */ t("small", { children: s }) : null
      ] }),
      u
    ] })
  ] });
}
const j = ne(function({
  result: n,
  mediaAspect: i,
  selected: d,
  renderNode: c,
  onOpenResult: r
}) {
  const { ref: u, visible: o } = ae(!1), [s, y] = $(!1), [w, g] = $(!1), p = T(/* @__PURE__ */ new Set());
  M(() => {
    for (const a of p.current)
      (!u.current?.contains(a) || a.paused || a.ended) && p.current.delete(a);
    g(p.current.size > 0);
  }, [u, n.node]);
  const b = (a) => {
    p.current.delete(a.target), g(p.current.size > 0);
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
        aspectRatio: `var(--ws-storyboard-preview-aspect, ${i?.includes(":") ? i.replace(":", " / ") : `${f} / ${C}`})`
      },
      onFocusCapture: () => y(!0),
      onBlurCapture: (a) => {
        a.currentTarget.contains(a.relatedTarget) || y(!1);
      },
      onPlayCapture: (a) => {
        p.current.add(a.target), g(!0);
      },
      onPauseCapture: b,
      onEndedCapture: b,
      onClick: (a) => {
        a.stopPropagation(), !a.target.closest(
          "button, a, video, input, textarea, select, [contenteditable]"
        ) && r(n, a.currentTarget);
      },
      onKeyDown: (a) => {
        a.target === a.currentTarget && (a.key !== "Enter" && a.key !== " " || (a.preventDefault(), a.stopPropagation(), r(n, a.currentTarget)));
      },
      "aria-label": `编辑${n.node.title || "制作节点"}`,
      children: o || d || s || w ? c(n.node, d) : null
    }
  );
});
function P(e) {
  return e.status === "running" || e.status === "waiting";
}
function Y(e) {
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
  le as c,
  O as d,
  ce as u
};
