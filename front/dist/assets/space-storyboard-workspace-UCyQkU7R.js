import { a as d, j as n } from "./react-CDpwMNlY.js";
import { b as z, r as G, H as j, j as H } from "./vendor-icons-Cz5zFzlk.js";
import { a as $, e as O, b as D, l as I, S as F } from "./file-kind-DFeonxO2.js";
import { a as _ } from "./preloadable-B6OSmL0f.js";
import { i as A } from "./power-icon-Dfs_ppQs.js";
import { C as q, p as K } from "./space-page-B7eY-TDj.js";
import { B as U } from "./node-detail-content-DEcv8fc7.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-workspace-B4TuM9A9.css", import.meta.url).href]);
function V(e, r, i) {
  const o = Math.min(r.width, Math.max(0, i.width - 32)), h = Math.min(r.height, Math.max(0, i.height - 32)), k = e.left + e.width / 2, w = Math.min(
    Math.max(16 + o / 2, k),
    i.width - 16 - o / 2
  ), m = e.top + e.height + 16, g = e.top - r.height - 16, E = m + r.height <= i.height - 16 || g < 16 ? m : g, v = Math.min(
    Math.max(16, E),
    i.height - 16 - h
  );
  return { left: w, top: v };
}
const C = "storyboard-script";
function ae({
  activeSectionId: e,
  groups: r,
  scriptContent: i,
  scriptMeta: a,
  renderNode: s,
  onActiveSectionChange: o,
  variant: h = "canvas"
}) {
  const [k, w] = $(""), [m, g] = $(null), [E, v] = $(!1), p = O(null), f = O(null);
  D(() => {
    e === C || r.some((t) => t.id === e) || o(C);
  }, [e, r, o]);
  const x = r.find((t) => t.id === e), b = x?.results.find(
    (t) => t.nodeId === k
  );
  I(() => {
    if (!b || !p.current) return;
    const t = p.current, c = () => {
      const y = t.getBoundingClientRect(), R = f.current?.firstElementChild, B = R?.getBoundingClientRect();
      v(
        !!(R && R.scrollHeight > window.innerHeight - 32)
      );
      const N = V(
        y,
        { width: B?.width || 640, height: B?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight }
      );
      g(
        (L) => L?.left === N.left && L.top === N.top ? L : N
      );
    }, l = new ResizeObserver(c);
    l.observe(t);
    let u = null;
    const S = () => {
      const y = f.current?.firstElementChild || null;
      y !== u && (u && l.unobserve(u), y && l.observe(y), u = y), c();
    }, T = new MutationObserver(S);
    return f.current && T.observe(f.current, { childList: !0 }), S(), window.addEventListener("resize", c), window.addEventListener("scroll", c, !0), () => {
      T.disconnect(), l.disconnect(), window.removeEventListener("resize", c), window.removeEventListener("scroll", c, !0);
    };
  }, [b, m !== null]), D(() => {
    if (!b) return;
    const t = (l) => {
      const u = l.target;
      !p.current?.contains(u) && !f.current?.contains(u) && w("");
    }, c = (l) => {
      l.key === "Escape" && w("");
    };
    return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", c), () => {
      document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", c);
    };
  }, [b]);
  const M = (t) => {
    w(""), o(t);
  }, W = (t, c) => {
    if (t.node.type !== "power" || A(
      t.node.power,
      t.node.kind,
      t.node.outputType
    )) {
      t.onOpen();
      return;
    }
    p.current = c, g(null), v(!1), w(t.nodeId), K();
  };
  return /* @__PURE__ */ d(
    "div",
    {
      className: `ws-storyboard-workspace is-${h} nodrag nopan nowheel`,
      children: [
        /* @__PURE__ */ d(
          "nav",
          {
            className: "ws-storyboard-workspace-menu",
            "aria-label": "分镜制作菜单",
            children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: `ws-storyboard-workspace-script ${e === C ? "is-selected" : ""}`,
                  onClick: P(() => M(C)),
                  children: [
                    /* @__PURE__ */ d("span", { children: [
                      /* @__PURE__ */ n("strong", { children: "分镜脚本" }),
                      /* @__PURE__ */ n("small", { children: a })
                    ] }),
                    /* @__PURE__ */ n(z, { size: 14 })
                  ]
                }
              ),
              r.map((t) => /* @__PURE__ */ n(
                Y,
                {
                  group: t,
                  selected: t.id === e,
                  onSelect: () => M(t.id)
                },
                t.id
              ))
            ]
          }
        ),
        e === C ? /* @__PURE__ */ n("section", { className: "ws-storyboard-workspace-content is-script", children: i }) : /* @__PURE__ */ n(
          J,
          {
            group: x,
            renderNode: s,
            selectedNodeId: k,
            onOpenResult: W
          }
        ),
        b && m ? _(
          /* @__PURE__ */ n(
            "div",
            {
              ref: f,
              className: `ws-storyboard-workspace-editor-anchor nodrag nopan nowheel${E ? " is-overflowing" : ""}`,
              style: m,
              onPointerDown: (t) => t.stopPropagation(),
              onMouseDown: (t) => t.stopPropagation(),
              children: /* @__PURE__ */ n(
                F,
                {
                  fallback: /* @__PURE__ */ n("div", { className: "ws-storyboard-workspace-editor-loading", children: "正在加载参数..." }),
                  children: /* @__PURE__ */ n(
                    q,
                    {
                      node: b.node
                    },
                    k
                  )
                }
              )
            }
          ),
          p.current?.closest(".wb-detail-backdrop") || p.current?.closest(".ws-page") || document.body
        ) : null
      ]
    }
  );
}
function Y({
  group: e,
  selected: r,
  onSelect: i
}) {
  const a = Q(e), s = Z(e), o = a ? e.onStop : e.onRun, h = a ? e.stopping ? "正在停止" : e.onStop ? `停止${e.title}` : `${e.title}正在执行` : e.runBlockedReason || X(e);
  return /* @__PURE__ */ d(
    "div",
    {
      className: `ws-storyboard-workspace-group ${r ? "is-selected" : ""} ${a ? "is-running" : ""} ${e.status === "error" ? "is-error" : ""}`,
      children: [
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "ws-storyboard-workspace-group-select nodrag nopan",
            onClick: P(i),
            children: [
              /* @__PURE__ */ d("span", { children: [
                /* @__PURE__ */ n("strong", { children: e.title }),
                /* @__PURE__ */ n("small", { children: s })
              ] }),
              /* @__PURE__ */ d("em", { children: [
                e.completedCount,
                "/",
                e.runnableCount || e.memberCount
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n(U, { label: h, children: /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: `ws-storyboard-workspace-group-action nodrag nopan ${a ? "is-stop" : ""}`,
            "aria-label": h,
            disabled: e.stopping || !o || !a && !!e.runBlockedReason,
            onClick: o ? P(() => {
              i(), o();
            }) : void 0,
            children: e.stopping || a && !e.onStop ? /* @__PURE__ */ n(G, { size: 13, className: "ws-spin" }) : a ? /* @__PURE__ */ n(j, { size: 12, fill: "currentColor" }) : /* @__PURE__ */ n(H, { size: 13, fill: "currentColor" })
          }
        ) })
      ]
    }
  );
}
function J({
  group: e,
  renderNode: r,
  selectedNodeId: i,
  onOpenResult: a
}) {
  return e ? /* @__PURE__ */ d("section", { className: "ws-storyboard-workspace-results", children: [
    /* @__PURE__ */ d("header", { children: [
      /* @__PURE__ */ n("strong", { children: e.title }),
      /* @__PURE__ */ d("span", { children: [
        e.results.length,
        " 项结果"
      ] })
    ] }),
    e.results.length > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-workspace-result-grid", children: e.results.map((s) => /* @__PURE__ */ n(
      "div",
      {
        role: "group",
        tabIndex: 0,
        className: `ws-storyboard-workspace-result is-${s.status} ${i === s.nodeId ? "is-selected" : ""} nodrag nopan`,
        style: {
          width: Math.max(1, s.node.width),
          height: Math.max(1, s.node.height)
        },
        onClick: (o) => {
          o.stopPropagation(), !o.target.closest(
            "button, a, video, input, textarea, select, [contenteditable]"
          ) && a(s, o.currentTarget);
        },
        onKeyDown: (o) => {
          o.target === o.currentTarget && (o.key !== "Enter" && o.key !== " " || (o.preventDefault(), o.stopPropagation(), a(s, o.currentTarget)));
        },
        "aria-label": `编辑${s.node.title || "制作节点"}`,
        children: r(s.node, i === s.nodeId)
      },
      s.nodeId
    )) }) : /* @__PURE__ */ d("div", { className: "ws-storyboard-workspace-result-empty", children: [
      /* @__PURE__ */ n(z, { size: 18 }),
      /* @__PURE__ */ n("span", { children: "当前分组暂无结果节点" })
    ] })
  ] }) : /* @__PURE__ */ n("div", { className: "ws-storyboard-workspace-results is-empty", children: "暂无制作分组" });
}
function Q(e) {
  return e.status === "running" || e.status === "waiting";
}
function X(e) {
  return e.runnableCount > 0 && e.completedCount >= e.runnableCount ? `重新执行${e.title}` : e.completedCount > 0 ? `继续执行${e.title}` : `执行${e.title}`;
}
function Z(e) {
  return e.stopping ? "停止中" : e.status === "running" ? "执行中" : e.status === "waiting" ? "等待反馈" : e.status === "error" ? e.failedCount > 0 ? `失败 ${e.failedCount}` : "执行失败" : e.runBlockedReason ? "等待前置" : e.runnableCount > 0 && e.completedCount >= e.runnableCount ? "已完成" : e.completedCount > 0 ? "部分完成" : "待执行";
}
function P(e) {
  return (r) => {
    r.preventDefault(), r.stopPropagation(), e();
  };
}
export {
  C as S,
  ae as a
};
