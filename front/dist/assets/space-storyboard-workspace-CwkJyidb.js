import { i as z, a as h, j as o } from "./react-5Z-wsVEn.js";
import { b as O, r as H, H as G, j as F } from "./vendor-icons-fVDtJt66.js";
import { a as $, b as E, d as D, l as L, h as V, S as j, p as I } from "./file-kind-D6bMOzYN.js";
import { c as A } from "./preloadable-CT3tMmBD.js";
import { p as _, C as q, g as K, u as U } from "./writing-run-labels-BXHG45m8.js";
import { B as Y } from "./asset-preview-BZxHU4Mm.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-workspace-DWLrP8bW.css", import.meta.url).href]);
function J(e, n, r) {
  const c = Math.min(n.width, Math.max(0, r.width - 32)), m = e.left + e.width / 2, d = Math.min(
    Math.max(16 + c / 2, m),
    r.width - 16 - c / 2
  ), s = e.top + e.height + 16, k = Math.min(
    Math.max(16, s),
    Math.max(16, r.height - 16 - 240)
  ), u = Math.max(0, r.height - 16 - k);
  return { left: d, top: k, maxHeight: u };
}
const C = "storyboard-script";
function le({
  activeSectionId: e,
  groups: n,
  scriptContent: r,
  scriptMeta: a,
  renderNode: p,
  onActiveSectionChange: c,
  variant: m = "canvas"
}) {
  const [d, s] = $(""), [b, k] = $(null), u = E(null), i = E(null);
  D(() => {
    e === C || n.some((t) => t.id === e) || c(C);
  }, [e, n, c]);
  const v = n.find((t) => t.id === e), y = v?.results.find(
    (t) => t.nodeId === d
  );
  L(() => {
    if (!y || !u.current) return;
    const t = u.current, f = () => {
      const g = t.getBoundingClientRect(), W = i.current?.firstElementChild?.getBoundingClientRect(), N = J(
        g,
        { width: W?.width || 640, height: W?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight }
      );
      k(
        (x) => x?.left === N.left && x.top === N.top && x.maxHeight === N.maxHeight ? x : N
      );
    }, l = new ResizeObserver(f);
    l.observe(t);
    let w = null;
    const M = () => {
      const g = i.current?.firstElementChild || null;
      g !== w && (w && l.unobserve(w), g && l.observe(g), w = g), f();
    }, B = new MutationObserver(M);
    return i.current && B.observe(i.current, { childList: !0 }), M(), window.addEventListener("resize", f), window.addEventListener("scroll", f, !0), () => {
      B.disconnect(), l.disconnect(), window.removeEventListener("resize", f), window.removeEventListener("scroll", f, !0);
    };
  }, [y, b !== null]), D(() => {
    if (!y) return;
    const t = (l) => {
      const w = l.target;
      !u.current?.contains(w) && !i.current?.contains(w) && s("");
    }, f = (l) => {
      if (l.key !== "Escape" || (l.stopPropagation(), l.defaultPrevented)) return;
      const w = l.target instanceof Element ? l.target.closest(
        '[role="dialog"], [role="menu"], [role="listbox"]'
      ) : null;
      w && i.current?.contains(w) || (l.preventDefault(), s(""));
    };
    return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", f), () => {
      document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", f);
    };
  }, [y]);
  const R = (t) => {
    s(""), c(t);
  }, P = V(
    (t, f) => {
      if (t.node.type !== "power" || z(
        t.node.power,
        t.node.kind,
        t.node.outputType
      )) {
        t.onOpen();
        return;
      }
      u.current = f, k(null), s(t.nodeId), _();
    },
    []
  );
  return /* @__PURE__ */ h(
    "div",
    {
      className: `ws-storyboard-workspace is-${m} nodrag nopan nowheel`,
      children: [
        /* @__PURE__ */ h("nav", { className: "ws-storyboard-workspace-menu", "aria-label": "分镜制作菜单", children: [
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: `ws-storyboard-workspace-script ${e === C ? "is-selected" : ""}`,
              "aria-current": e === C ? "page" : void 0,
              onClick: T(() => R(C)),
              children: [
                /* @__PURE__ */ h("span", { children: [
                  /* @__PURE__ */ o("strong", { children: "分镜脚本" }),
                  /* @__PURE__ */ o("small", { children: a })
                ] }),
                /* @__PURE__ */ o(O, { size: 14 })
              ]
            }
          ),
          n.map((t) => /* @__PURE__ */ o(
            Q,
            {
              group: t,
              selected: t.id === e,
              onSelect: () => R(t.id)
            },
            t.id
          ))
        ] }),
        e === C ? /* @__PURE__ */ o("section", { className: "ws-storyboard-workspace-content is-script", children: r }) : /* @__PURE__ */ o(
          Z,
          {
            group: v,
            variant: m,
            renderNode: p,
            selectedNodeId: d,
            onOpenResult: P
          }
        ),
        y && b ? A(
          /* @__PURE__ */ o(
            "div",
            {
              ref: i,
              className: "ws-storyboard-workspace-editor-anchor nodrag nopan nowheel",
              style: {
                left: b.left,
                top: b.top,
                "--ws-storyboard-editor-max-height": `${b.maxHeight}px`
              },
              onPointerDown: (t) => t.stopPropagation(),
              onMouseDown: (t) => t.stopPropagation(),
              children: /* @__PURE__ */ o(
                j,
                {
                  fallback: /* @__PURE__ */ o("div", { className: "ws-storyboard-workspace-editor-loading", children: "正在加载参数..." }),
                  children: /* @__PURE__ */ o(
                    q,
                    {
                      node: y.node
                    },
                    d
                  )
                }
              )
            }
          ),
          u.current?.closest(".wb-detail-backdrop") || u.current?.closest(".ws-page") || document.body
        ) : null
      ]
    }
  );
}
function Q({
  group: e,
  selected: n,
  onSelect: r
}) {
  const a = S(e), p = ne(e);
  return /* @__PURE__ */ h(
    "div",
    {
      className: `ws-storyboard-workspace-group ${n ? "is-selected" : ""} ${a ? "is-running" : ""} ${e.status === "error" ? "is-error" : ""}`,
      children: [
        /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            className: "ws-storyboard-workspace-group-select nodrag nopan",
            "aria-current": n ? "page" : void 0,
            onClick: T(r),
            children: [
              /* @__PURE__ */ h("span", { children: [
                /* @__PURE__ */ o("strong", { children: e.title }),
                /* @__PURE__ */ o("small", { role: "status", children: p })
              ] }),
              /* @__PURE__ */ h("em", { children: [
                e.completedCount,
                "/",
                e.runnableCount || e.memberCount
              ] })
            ]
          }
        ),
        /* @__PURE__ */ o(X, { group: e, onBeforeAction: r })
      ]
    }
  );
}
function X({
  group: e,
  onBeforeAction: n
}) {
  const r = S(e), a = r ? e.onStop : e.onRun, p = r ? e.stopping ? "正在停止" : e.onStop ? `停止${e.title}` : `${e.title}正在执行` : e.runBlockedReason || te(e);
  return /* @__PURE__ */ o(Y, { label: p, children: /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: `ws-storyboard-workspace-group-action nodrag nopan ${r ? "is-stop" : ""}`,
      "aria-label": p,
      disabled: e.stopping || !a || !r && !!e.runBlockedReason,
      onClick: a ? T(() => {
        n?.(), a();
      }) : void 0,
      children: e.stopping || r && !e.onStop ? /* @__PURE__ */ o(H, { size: 13, className: "ws-spin" }) : r ? /* @__PURE__ */ o(G, { size: 12, fill: "currentColor" }) : /* @__PURE__ */ o(F, { size: 13, fill: "currentColor" })
    }
  ) });
}
function Z({
  group: e,
  variant: n,
  renderNode: r,
  selectedNodeId: a,
  onOpenResult: p
}) {
  const c = E(null), m = E(/* @__PURE__ */ new Map()), d = e?.id;
  return L(() => {
    const s = c.current;
    !s || !d || (s.scrollTop = m.current.get(d) || 0);
  }, [d]), e ? /* @__PURE__ */ h(
    "section",
    {
      className: "ws-storyboard-workspace-results",
      "aria-label": e.title,
      children: [
        e.runBlockedReason && !S(e) ? /* @__PURE__ */ o("p", { className: "ws-storyboard-workspace-blocked", children: e.runBlockedReason }) : null,
        e.results.length > 0 ? /* @__PURE__ */ o(
          "div",
          {
            ref: c,
            className: "ws-storyboard-workspace-result-grid",
            onScroll: (s) => {
              d && m.current.set(
                d,
                s.currentTarget.scrollTop
              );
            },
            children: /* @__PURE__ */ o(K, { root: c, rootMargin: "160px", children: e.results.map((s) => /* @__PURE__ */ o(
              ee,
              {
                result: s,
                variant: n,
                selected: a === s.nodeId,
                renderNode: r,
                onOpenResult: p
              },
              s.nodeId
            )) })
          }
        ) : /* @__PURE__ */ h("div", { className: "ws-storyboard-workspace-result-empty", children: [
          /* @__PURE__ */ o(O, { size: 18 }),
          /* @__PURE__ */ o("span", { children: "当前分组暂无结果节点" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ o("div", { className: "ws-storyboard-workspace-results is-empty", children: "暂无制作分组" });
}
const ee = I(function({
  result: n,
  variant: r,
  selected: a,
  renderNode: p,
  onOpenResult: c
}) {
  const { ref: m, visible: d } = U(!1), [s, b] = $(!1), [k, u] = $(!1), i = E(/* @__PURE__ */ new Set());
  L(() => {
    for (const t of i.current)
      (!m.current?.contains(t) || t.paused || t.ended) && i.current.delete(t);
    u(i.current.size > 0);
  }, [m, n.node]);
  const v = (t) => {
    i.current.delete(t.target), u(i.current.size > 0);
  }, y = z(
    n.node.power,
    n.node.kind,
    n.node.outputType
  ), R = Math.max(1, n.node.width), P = Math.max(1, n.node.height);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: m,
      role: "group",
      tabIndex: 0,
      className: `ws-storyboard-workspace-result${y ? " is-video-compose" : ""} is-${n.status} ${a ? "is-selected" : ""} nodrag nopan`,
      style: r === "detail" ? { width: R, height: P } : y ? { height: P } : { aspectRatio: `${R} / ${P}` },
      onFocusCapture: () => b(!0),
      onBlurCapture: (t) => {
        t.currentTarget.contains(t.relatedTarget) || b(!1);
      },
      onPlayCapture: (t) => {
        i.current.add(t.target), u(!0);
      },
      onPauseCapture: v,
      onEndedCapture: v,
      onClick: (t) => {
        t.stopPropagation(), !t.target.closest(
          "button, a, video, input, textarea, select, [contenteditable]"
        ) && c(n, t.currentTarget);
      },
      onKeyDown: (t) => {
        t.target === t.currentTarget && (t.key !== "Enter" && t.key !== " " || (t.preventDefault(), t.stopPropagation(), c(n, t.currentTarget)));
      },
      "aria-label": `编辑${n.node.title || "制作节点"}`,
      children: d || a || s || k ? p(n.node, a) : null
    }
  );
});
function S(e) {
  return e.status === "running" || e.status === "waiting";
}
function te(e) {
  return e.runnableCount > 0 && e.completedCount >= e.runnableCount ? `重新执行${e.title}` : e.completedCount > 0 ? `继续执行${e.title}` : `执行${e.title}`;
}
function ne(e) {
  return e.stopping ? "停止中" : e.status === "running" ? "执行中" : e.status === "waiting" ? "等待反馈" : e.status === "error" ? e.failedCount > 0 ? `失败 ${e.failedCount}` : "执行失败" : e.runBlockedReason ? "等待前置" : e.runnableCount > 0 && e.completedCount >= e.runnableCount ? "已完成" : e.completedCount > 0 ? "部分完成" : "待执行";
}
function T(e) {
  return (n) => {
    n.preventDefault(), n.stopPropagation(), e();
  };
}
export {
  C as S,
  le as a
};
