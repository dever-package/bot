import { j as n, a as p, S, F as _ } from "./space-storyboard-material-ECvLpyk_.js";
import { q as K, P as J, b as A, a3 as Q, r as F, y as H, j as V, c as X } from "./vendor-icons-BZHLe0mm.js";
import { a as E, b as R, l as L, d as B, h as W, S as Z, r as ee, u as x } from "./file-kind-Cq3pESGF.js";
import { h as Y, c as te } from "./space-assistant-layout-Drz4je9C.js";
import { p as ne, C as oe, a as I, u as re } from "./space-optional-components-u700_erT.js";
import { B as G } from "./asset-audio-preview-Cezm24us.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-workspace-DLPlgoyV.css", import.meta.url).href]);
function se(e, r, s) {
  const a = Math.min(r.width, Math.max(0, s.width - 32)), u = e.left + e.width / 2, o = Math.min(
    Math.max(16 + a / 2, u),
    s.width - 16 - a / 2
  ), i = e.top + e.height + 16, b = Math.min(
    Math.max(16, i),
    Math.max(16, s.height - 16 - 240)
  ), h = Math.max(0, s.height - 16 - b);
  return { left: o, top: b, maxHeight: h };
}
const N = "storyboard-script", v = "storyboard-setting", j = ["character", "scene", "prop"];
function ae({
  activeSectionId: e,
  groups: r,
  scriptContent: s,
  scriptMeta: c,
  renderNode: d,
  onActiveSectionChange: a,
  variant: u = "canvas",
  settingOnly: o = !1,
  onReplaceImage: i,
  settingSource: w,
  mediaAspect: b
}) {
  const h = r.find((t) => t.id === e), { selectedNodeId: l, openResult: m, closeEditor: f, editor: y } = U(
    (o || e === v ? r.filter((t) => t.materialType) : h ? [h] : []).flatMap((t) => t.results),
    i
  );
  B(() => {
    o || e === N || e === v || r.some((t) => !t.materialType && t.id === e) || a(N);
  }, [e, r, a, o]);
  const k = (t) => {
    f(), a(t);
  };
  return /* @__PURE__ */ p(
    "div",
    {
      className: `ws-storyboard-workspace is-${u}${o ? " is-setting-only" : ""} nodrag nopan nowheel`,
      children: [
        o ? /* @__PURE__ */ n(
          O,
          {
            groups: r,
            variant: u,
            mediaAspect: b,
            runAction: !0,
            renderNode: d,
            selectedNodeId: l,
            onOpenResult: m
          }
        ) : /* @__PURE__ */ p(_, { children: [
          /* @__PURE__ */ p("nav", { className: "ws-storyboard-workspace-menu", "aria-label": "分镜制作菜单", children: [
            /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: `ws-storyboard-workspace-script ${e === N ? "is-selected" : ""}`,
                "aria-current": e === N ? "page" : void 0,
                onClick: C(() => k(N)),
                children: [
                  /* @__PURE__ */ p("span", { children: [
                    /* @__PURE__ */ n("strong", { children: "分镜脚本" }),
                    /* @__PURE__ */ n("small", { children: c })
                  ] }),
                  /* @__PURE__ */ n(A, { size: 14 })
                ]
              }
            ),
            /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: "ws-storyboard-workspace-script " + (e === v ? "is-selected" : ""),
                "aria-current": e === v ? "page" : void 0,
                onClick: C(() => k(v)),
                children: [
                  /* @__PURE__ */ p("span", { children: [
                    /* @__PURE__ */ n("strong", { children: "设定" }),
                    /* @__PURE__ */ n("small", { children: w ? "共用设定" : "角色、场景、道具" })
                  ] }),
                  /* @__PURE__ */ n(Q, { size: 14 })
                ]
              }
            ),
            r.filter((t) => !t.materialType).map((t) => /* @__PURE__ */ n(
              he,
              {
                group: t,
                selected: t.id === e,
                onSelect: () => k(t.id)
              },
              t.id
            ))
          ] }),
          e === v ? /* @__PURE__ */ p("section", { className: "ws-storyboard-workspace-setting", children: [
            w && /* @__PURE__ */ p(
              "button",
              {
                type: "button",
                className: "ws-storyboard-setting-source",
                onClick: C(w.onOpen),
                children: [
                  "共用设定 · ",
                  w.title,
                  " ↗"
                ]
              }
            ),
            /* @__PURE__ */ n(
              O,
              {
                groups: r,
                variant: u,
                mediaAspect: b,
                runAction: !0,
                renderNode: d,
                selectedNodeId: l,
                onOpenResult: m
              }
            )
          ] }) : e === N ? /* @__PURE__ */ n("section", { className: "ws-storyboard-workspace-content is-script", children: s }) : /* @__PURE__ */ n(
            we,
            {
              group: h,
              mediaAspect: b,
              renderNode: d,
              selectedNodeId: l,
              onOpenResult: m
            }
          )
        ] }),
        y
      ]
    }
  );
}
function U(e, r) {
  const [s, c] = E(""), [d, a] = E(null), u = R(null), o = R(null), i = e.find((l) => l.nodeId === s);
  L(() => {
    if (!i || !u.current) return;
    const l = u.current, m = () => {
      const g = l.getBoundingClientRect(), P = o.current?.firstElementChild?.getBoundingClientRect(), M = se(
        g,
        { width: P?.width || 640, height: P?.height || 240 },
        { width: window.innerWidth, height: window.innerHeight }
      );
      a(
        ($) => $?.left === M.left && $.top === M.top && $.maxHeight === M.maxHeight ? $ : M
      );
    }, f = new ResizeObserver(m);
    f.observe(l);
    let y = null;
    const k = () => {
      const g = o.current?.firstElementChild || null;
      g !== y && (y && f.unobserve(y), g && f.observe(g), y = g), m();
    }, t = new MutationObserver(k);
    return o.current && t.observe(o.current, { childList: !0 }), k(), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), () => {
      t.disconnect(), f.disconnect(), window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0);
    };
  }, [i, d !== null]), B(() => {
    if (!i) return;
    const l = (f) => {
      const y = f.target;
      !u.current?.contains(y) && !o.current?.contains(y) && c("");
    }, m = (f) => {
      if (f.key !== "Escape" || (f.stopPropagation(), f.defaultPrevented)) return;
      const y = f.target instanceof Element ? f.target.closest(
        '[role="dialog"], [role="menu"], [role="listbox"]'
      ) : null;
      y && o.current?.contains(y) || (f.preventDefault(), c(""));
    };
    return document.addEventListener("pointerdown", l, !0), document.addEventListener("keydown", m), () => {
      document.removeEventListener("pointerdown", l, !0), document.removeEventListener("keydown", m);
    };
  }, [i]);
  const w = W(
    (l, m) => {
      if (l.node.type !== "power" || Y(
        l.node.power,
        l.node.kind,
        l.node.outputType
      )) {
        l.onOpen();
        return;
      }
      u.current = m, a(null), c(l.nodeId), ne();
    },
    []
  ), b = W(() => c(""), []), h = i && d ? te(
    /* @__PURE__ */ n(
      "div",
      {
        ref: o,
        className: "ws-storyboard-workspace-editor-anchor nodrag nopan nowheel",
        style: {
          left: d.left,
          top: d.top,
          "--ws-storyboard-editor-max-height": `${d.maxHeight}px`
        },
        onPointerDown: (l) => l.stopPropagation(),
        onMouseDown: (l) => l.stopPropagation(),
        children: /* @__PURE__ */ n(
          Z,
          {
            fallback: /* @__PURE__ */ n("div", { className: "ws-storyboard-workspace-editor-loading", children: "正在加载参数..." }),
            children: /* @__PURE__ */ n(
              oe,
              {
                node: i.node,
                onReplaceImage: r ? () => {
                  r(i.nodeId), c("");
                } : void 0
              },
              s
            )
          }
        )
      }
    ),
    u.current?.closest(".wb-detail-backdrop") || u.current?.closest(".ws-page") || document.body
  ) : null;
  return { selectedNodeId: s, openResult: w, closeEditor: b, editor: h };
}
function Ee({ groups: e, renderNode: r, variant: s = "canvas", onReplaceImage: c, mediaAspect: d }) {
  return /* @__PURE__ */ n(
    ae,
    {
      settingOnly: !0,
      onReplaceImage: c,
      groups: e,
      renderNode: r,
      mediaAspect: d,
      variant: s,
      activeSectionId: "",
      onActiveSectionChange: () => {
      },
      scriptContent: null,
      scriptMeta: ""
    }
  );
}
const ie = [], le = () => null;
function Te({ workspace: e, children: r }) {
  const s = e?.groups || de, c = x(() => s.flatMap((h) => h.results), [s]), d = x(() => s.filter((h) => h.materialType), [s]), a = x(() => new Map(c.map((h) => [h.nodeId, h])), [c]), { selectedNodeId: u, openResult: o, editor: i } = U(c), w = e?.renderNode || le;
  return /* @__PURE__ */ p(_, { children: [
    /* @__PURE__ */ n(I, { root: ce, rootMargin: "160px", children: r({
      renderSettingGallery: ({ key: h, ...l }) => /* @__PURE__ */ n(
        O,
        {
          groups: d,
          variant: "canvas",
          renderNode: w,
          selectedNodeId: u,
          onOpenResult: o,
          ...l
        },
        h
      ),
      renderFrameNode: (h, l) => {
        const m = h.map((f) => a.get(f)).find(Boolean);
        return m ? /* @__PURE__ */ n(
          z,
          {
            result: m,
            mediaAspect: l,
            selected: u === m.nodeId,
            renderNode: w,
            onOpenResult: o
          }
        ) : void 0;
      }
    }) }),
    i
  ] });
}
const ce = { current: null }, de = [];
function O({
  groups: e,
  variant: r,
  mediaAspect: s,
  renderNode: c,
  selectedNodeId: d,
  onOpenResult: a,
  materials: u = ie,
  materialActions: o,
  runAction: i = !1,
  defaultType: w = "character"
}) {
  const [b, h] = E(w), l = R(null), m = (t) => e.find((g) => g.materialType === t), f = m(b), y = fe(u.filter((t) => t.type === b), f), k = s?.includes(":") ? s.replace(":", " / ") : "1 / 1";
  return /* @__PURE__ */ p("div", { className: `ws-setting-gallery is-${r}`, children: [
    /* @__PURE__ */ p("div", { className: "ws-setting-gallery-bar", children: [
      /* @__PURE__ */ n("nav", { className: "ws-setting-gallery-tabs nodrag nopan", "aria-label": "设定分类", children: j.map((t) => {
        const g = m(t), D = u.filter((P) => P.type === t).length || g?.memberCount || 0;
        return /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            "aria-pressed": b === t,
            "data-storyboard-material-type": t,
            className: g?.status === "error" ? "is-error" : me(g) ? "is-running" : void 0,
            onClick: C(() => h(t)),
            children: [
              S[t],
              /* @__PURE__ */ n("em", { children: g ? `${g.completedCount}/${g.runnableCount || g.memberCount}` : D })
            ]
          },
          t
        );
      }) }),
      i ? /* @__PURE__ */ n(ue, { groups: e }) : null
    ] }),
    f?.runBlockedReason && !T(f) ? /* @__PURE__ */ n("p", { className: "ws-setting-gallery-note", children: f.runBlockedReason }) : null,
    /* @__PURE__ */ n("div", { ref: l, className: "ws-setting-gallery-grid nodrag nopan nowheel", children: /* @__PURE__ */ p(I, { root: l, rootMargin: "160px", children: [
      y.map((t) => /* @__PURE__ */ p("div", { className: "ws-setting-gallery-item", children: [
        t.result ? /* @__PURE__ */ n(
          z,
          {
            result: t.result,
            mediaAspect: s,
            selected: d === t.result.nodeId,
            renderNode: c,
            onOpenResult: a
          }
        ) : /* @__PURE__ */ p("div", { className: "ws-setting-gallery-pending", style: { aspectRatio: k }, children: [
          /* @__PURE__ */ n("strong", { children: t.name }),
          /* @__PURE__ */ n("span", { children: "待生成" })
        ] }),
        t.material && o ? /* @__PURE__ */ n(G, { label: "编辑描述", children: /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "ws-setting-gallery-edit nodrag nopan",
            "aria-label": `编辑${t.name}的描述`,
            disabled: o.disabled,
            onClick: C(() => o.onEdit(t.material)),
            children: /* @__PURE__ */ n(K, { size: 12 })
          }
        ) }) : null
      ] }, t.key)),
      o ? /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "ws-setting-gallery-add nodrag nopan",
          disabled: o.disabled,
          style: { aspectRatio: k },
          onClick: C(() => o.onAdd(b)),
          children: [
            /* @__PURE__ */ n(J, { size: 16 }),
            /* @__PURE__ */ p("span", { children: [
              "添加",
              S[b]
            ] })
          ]
        }
      ) : y.length === 0 ? /* @__PURE__ */ p("p", { className: "ws-setting-gallery-empty", children: [
        "暂无",
        S[b]
      ] }) : null
    ] }) })
  ] });
}
function ue({ groups: e }) {
  const [r, s] = E(!1), c = R(null);
  B(() => {
    if (!r) return;
    const o = (i) => {
      c.current?.contains(i.target) || s(!1);
    };
    return document.addEventListener("pointerdown", o, !0), () => document.removeEventListener("pointerdown", o, !0);
  }, [r]);
  const d = j.flatMap((o) => {
    const i = e.find((w) => w.materialType === o);
    return i ? [{ type: o, group: i }] : [];
  }), a = d.find(({ group: o }) => T(o))?.group;
  if (a)
    return /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action nodrag nopan",
        disabled: a.stopping || !a.onStop,
        onClick: C(() => a.onStop?.()),
        children: [
          a.stopping || !a.onStop ? /* @__PURE__ */ n(F, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(H, { size: 11, fill: "currentColor" }),
          a.stopping ? "停止中" : a.onStop ? "停止" : "执行中"
        ]
      }
    );
  if (d.length === 0) return null;
  const u = d.some(({ group: o }) => o.completedCount < (o.runnableCount || o.memberCount));
  return /* @__PURE__ */ p("div", { ref: c, className: "ws-setting-gallery-menu nodrag nopan", children: [
    /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: `ws-setting-gallery-action${u ? " is-primary" : ""}`,
        "aria-expanded": r,
        onClick: C(() => s((o) => !o)),
        children: [
          u ? /* @__PURE__ */ n(V, { size: 11, fill: "currentColor" }) : null,
          u ? "生成形象" : "重新生成",
          /* @__PURE__ */ n(X, { size: 12 })
        ]
      }
    ),
    r ? /* @__PURE__ */ n("div", { role: "menu", children: d.map(({ type: o, group: i }) => /* @__PURE__ */ n(G, { label: i.runBlockedReason || q({ ...i, title: S[o] }), children: /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        role: "menuitem",
        disabled: !i.onRun,
        onClick: C(() => {
          s(!1), i.onRun?.();
        }),
        children: pe(i, S[o])
      }
    ) }, o)) }) : null
  ] });
}
function pe(e, r) {
  const s = e.runnableCount || e.memberCount;
  return s > 0 && e.completedCount >= s ? `重做全部${r}` : e.completedCount > 0 ? `继续生成${r}` : `生成${r}`;
}
function me(e) {
  return e ? T(e) : !1;
}
function fe(e, r) {
  const s = r?.results || [], c = /* @__PURE__ */ new Set(), d = e.map((a) => {
    const u = s.find((o) => o.node.storyboardItem?.itemId === a.id);
    return u && c.add(u.nodeId), { key: a.id, name: a.name || "未命名", material: a, result: u };
  });
  for (const a of s)
    c.has(a.nodeId) || d.push({ key: a.nodeId, name: a.node.title || "未命名", result: a });
  return d;
}
function he({
  group: e,
  selected: r,
  onSelect: s
}) {
  const c = T(e), d = ye(e);
  return /* @__PURE__ */ p(
    "div",
    {
      className: `ws-storyboard-workspace-group ${r ? "is-selected" : ""} ${c ? "is-running" : ""} ${e.status === "error" ? "is-error" : ""}`,
      children: [
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "ws-storyboard-workspace-group-select nodrag nopan",
            "aria-current": r ? "page" : void 0,
            onClick: C(s),
            children: [
              /* @__PURE__ */ p("span", { children: [
                /* @__PURE__ */ n("strong", { children: e.title }),
                /* @__PURE__ */ n("small", { role: "status", children: d })
              ] }),
              /* @__PURE__ */ p("em", { children: [
                e.completedCount,
                "/",
                e.runnableCount || e.memberCount
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n(be, { group: e, onBeforeAction: s })
      ]
    }
  );
}
function be({
  group: e,
  onBeforeAction: r
}) {
  const s = T(e), c = s ? e.onStop : e.onRun, d = s ? e.stopping ? "正在停止" : e.onStop ? `停止${e.title}` : `${e.title}正在执行` : e.runBlockedReason || q(e);
  return /* @__PURE__ */ n(G, { label: d, children: /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: `ws-storyboard-workspace-group-action nodrag nopan ${s ? "is-stop" : ""}`,
      "aria-label": d,
      disabled: e.stopping || !c || !s && !!e.runBlockedReason,
      onClick: c ? C(() => {
        r?.(), c();
      }) : void 0,
      children: e.stopping || s && !e.onStop ? /* @__PURE__ */ n(F, { size: 13, className: "ws-spin" }) : s ? /* @__PURE__ */ n(H, { size: 12, fill: "currentColor" }) : /* @__PURE__ */ n(V, { size: 13, fill: "currentColor" })
    }
  ) });
}
function we({
  group: e,
  mediaAspect: r,
  renderNode: s,
  selectedNodeId: c,
  onOpenResult: d
}) {
  const a = R(null), u = R(/* @__PURE__ */ new Map()), o = e?.id;
  return L(() => {
    const i = a.current;
    !i || !o || (i.scrollTop = u.current.get(o) || 0);
  }, [o]), e ? /* @__PURE__ */ p(
    "section",
    {
      className: "ws-storyboard-workspace-results",
      "aria-label": e.title,
      children: [
        e.runBlockedReason && !T(e) ? /* @__PURE__ */ n("p", { className: "ws-storyboard-workspace-blocked", children: e.runBlockedReason }) : null,
        e.results.length > 0 ? /* @__PURE__ */ n(
          "div",
          {
            ref: a,
            className: "ws-storyboard-workspace-result-grid",
            onScroll: (i) => {
              o && u.current.set(
                o,
                i.currentTarget.scrollTop
              );
            },
            children: /* @__PURE__ */ n(I, { root: a, rootMargin: "160px", children: e.results.map((i) => /* @__PURE__ */ n(
              z,
              {
                result: i,
                mediaAspect: r,
                selected: c === i.nodeId,
                renderNode: s,
                onOpenResult: d
              },
              i.nodeId
            )) })
          }
        ) : /* @__PURE__ */ p("div", { className: "ws-storyboard-workspace-result-empty", children: [
          /* @__PURE__ */ n(A, { size: 18 }),
          /* @__PURE__ */ n("span", { children: "这一组还没有内容" }),
          /* @__PURE__ */ n("small", { children: "确认分镜脚本后会自动生成镜头图和视频" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ n("div", { className: "ws-storyboard-workspace-results is-empty", children: "暂无制作分组" });
}
const z = ee(function({
  result: r,
  mediaAspect: s,
  selected: c,
  renderNode: d,
  onOpenResult: a
}) {
  const { ref: u, visible: o } = re(!1), [i, w] = E(!1), [b, h] = E(!1), l = R(/* @__PURE__ */ new Set());
  L(() => {
    for (const t of l.current)
      (!u.current?.contains(t) || t.paused || t.ended) && l.current.delete(t);
    h(l.current.size > 0);
  }, [u, r.node]);
  const m = (t) => {
    l.current.delete(t.target), h(l.current.size > 0);
  }, f = Y(
    r.node.power,
    r.node.kind,
    r.node.outputType
  ), y = Math.max(1, r.node.width), k = Math.max(1, r.node.height);
  return /* @__PURE__ */ n(
    "div",
    {
      ref: u,
      role: "group",
      tabIndex: 0,
      className: `ws-storyboard-workspace-result${f ? " is-video-compose" : ""} is-${r.status} ${c ? "is-selected" : ""} nodrag nopan`,
      style: f ? { height: k } : {
        aspectRatio: s?.includes(":") ? s.replace(":", " / ") : `${y} / ${k}`
      },
      onFocusCapture: () => w(!0),
      onBlurCapture: (t) => {
        t.currentTarget.contains(t.relatedTarget) || w(!1);
      },
      onPlayCapture: (t) => {
        l.current.add(t.target), h(!0);
      },
      onPauseCapture: m,
      onEndedCapture: m,
      onClick: (t) => {
        t.stopPropagation(), !t.target.closest(
          "button, a, video, input, textarea, select, [contenteditable]"
        ) && a(r, t.currentTarget);
      },
      onKeyDown: (t) => {
        t.target === t.currentTarget && (t.key !== "Enter" && t.key !== " " || (t.preventDefault(), t.stopPropagation(), a(r, t.currentTarget)));
      },
      "aria-label": `编辑${r.node.title || "制作节点"}`,
      children: o || c || i || b ? d(r.node, c) : null
    }
  );
});
function T(e) {
  return e.status === "running" || e.status === "waiting";
}
function q(e) {
  return e.runnableCount > 0 && e.completedCount >= e.runnableCount ? `重新执行${e.title}` : e.completedCount > 0 ? `继续执行${e.title}` : `执行${e.title}`;
}
function ye(e) {
  return e.stopping ? "停止中" : e.status === "running" ? "执行中" : e.status === "waiting" ? "等待反馈" : e.status === "error" ? e.failedCount > 0 ? `失败 ${e.failedCount}` : "执行失败" : e.runBlockedReason ? "等待前置" : e.runnableCount > 0 && e.completedCount >= e.runnableCount ? "已完成" : e.completedCount > 0 ? "部分完成" : "待执行";
}
function C(e) {
  return (r) => {
    r.preventDefault(), r.stopPropagation(), e();
  };
}
export {
  Ee as S,
  N as a,
  ae as b,
  Te as c,
  O as d,
  U as u
};
