import { ah as de, ai as ce, aj as ue, p as pe, ak as j, R as me } from "./asset-preview-DonyTaaN.js";
import { a as f, j as n, F as ge } from "./preloadable-CnUP9jgB.js";
import { b as fe, a as x, d as J, u as he, q as be, S as ye } from "./file-kind-Cq3pESGF.js";
import { l as X, a4 as we, a0 as ve, u as Ne, a5 as Ce, a6 as xe, a7 as Me, Z, a8 as Pe, a9 as Ie, m as Se, n as $e, r as De } from "./asset-audio-preview-CsYcyVm8.js";
import { be as ke, r as Y, j as Oe, bf as _e, c as ze, n as Ee, I as Le, d as Re, a8 as Te, a6 as _, q as Ae } from "./vendor-icons-B8sieP24.js";
import { V as Ge, a as je } from "./media-inspector-gallery-BOUXOYjy.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-content-view-B4S9BdoA.css", import.meta.url).href]);
function Ue(e) {
  return de(e, (t) => {
    if (t.type !== "setting" || t.version !== 1 || !Array.isArray(t.materials)) return null;
    const a = t.materials.map(ce);
    return a.some((r) => !r) ? null : { ...t, materials: a };
  });
}
function bt(e) {
  return Ue([e.asset?.version?.content, e.resultOutput]);
}
function yt(e, t, a, r, o) {
  if (!t || !a || t === a)
    return e;
  const d = e.findIndex((g) => o(g) === t);
  if (d < 0)
    return e;
  const i = [...e], [p] = i.splice(d, 1), m = i.findIndex((g) => o(g) === a);
  return m < 0 ? e : (i.splice(m + (r === "after" ? 1 : 0), 0, p), i);
}
function wt(e, t, a) {
  if (!t.length)
    return e;
  const r = new Map(e.map((i) => [a(i), i])), o = [];
  for (const i of t)
    r.has(i) && o.push(r.get(i));
  const d = new Set(o.map(a));
  return [
    ...o,
    ...e.filter((i) => !d.has(a(i)))
  ];
}
function vt(e, t) {
  return e.length === t.length && e.every((a, r) => a === t[r]);
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Ve = U.FirstFrameVideo, Fe = 56;
function K(e, t) {
  const a = e.getBoundingClientRect(), r = Math.min(
    Fe,
    a.height * 0.25
  );
  return t >= a.bottom - r;
}
function Be({
  src: e,
  poster: t = "",
  alt: a = "",
  className: r,
  style: o,
  title: d,
  draggable: i = !1,
  ariaLabel: p,
  onLoad: m,
  onError: g,
  onMediaSize: b,
  objectFit: l = "cover",
  allowDragFromVideo: y = !1,
  playButtonOnly: u = !1
}) {
  const v = fe(null), [h, w] = x(""), [$, P] = x(""), [T, s] = x(""), [D, C] = x(""), [N, ae] = x(""), A = h === e, M = $ === e, E = T === e, re = D !== e && N !== e, oe = u || !M && !A, ie = !u && A && !M, se = u ? { bottom: 12, right: 12 } : {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };
  J(() => {
    const c = v.current;
    if (!c || !y || u) return;
    const I = (O) => {
      K(c, O.clientY) && O.stopPropagation();
    }, k = (O) => {
      const q = O.touches[0];
      q && K(c, q.clientY) && O.stopPropagation();
    };
    return c.addEventListener("mousedown", I), c.addEventListener("touchstart", k, {
      passive: !0
    }), () => {
      c.removeEventListener("mousedown", I), c.removeEventListener("touchstart", k);
    };
  }, [y, u]);
  function G(c) {
    c.stopPropagation();
  }
  function H() {
    w((c) => c === e ? "" : c), P((c) => c === e ? "" : c), s((c) => c === e ? "" : c);
  }
  function le(c) {
    c.preventDefault(), c.stopPropagation();
    const I = v.current;
    if (I) {
      if (E) {
        s((k) => k === e ? "" : k), I.pause();
        return;
      }
      w(e), s(e), M || P(""), I.play().catch(() => {
        H(), g?.();
      });
    }
  }
  return /* @__PURE__ */ f(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: o,
      title: d,
      draggable: i,
      children: [
        /* @__PURE__ */ n(
          Ve,
          {
            videoRef: v,
            src: e,
            poster: t || void 0,
            controls: A && !u,
            playsInline: !0,
            preload: "none",
            draggable: i,
            "aria-hidden": M ? void 0 : !0,
            className: [
              y ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              M ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: l },
            onPointerDown: u || y ? void 0 : G,
            onClick: u ? void 0 : G,
            onLoadedMetadata: (c) => b?.(
              c.currentTarget.videoWidth,
              c.currentTarget.videoHeight
            ),
            onPlaying: () => {
              P(e), s(e);
            },
            onPause: () => s((c) => c === e ? "" : c),
            onEnded: () => s((c) => c === e ? "" : c),
            onError: () => {
              H(), g?.();
            }
          }
        ),
        M ? null : /* @__PURE__ */ n(
          Ge,
          {
            src: e,
            poster: t,
            alt: a,
            className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
            style: { objectFit: l },
            draggable: i,
            ariaHidden: !0,
            onLoad: () => {
              C(e), m?.();
            },
            onError: () => {
              ae(e), g?.();
            },
            onMediaSize: b
          }
        ),
        oe ? /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            style: se,
            "aria-label": E ? "暂停视频" : p ? `播放${p}` : "播放视频",
            "aria-pressed": E,
            onPointerDown: G,
            onClick: le,
            children: E ? /* @__PURE__ */ n(ke, { size: 16, className: "fill-current", "aria-hidden": "true" }) : re && !M ? /* @__PURE__ */ n(
              Y,
              {
                size: 16,
                className: "animate-spin",
                "aria-hidden": "true"
              }
            ) : /* @__PURE__ */ n(
              Oe,
              {
                size: 16,
                className: "translate-x-px fill-current",
                "aria-hidden": "true"
              }
            )
          }
        ) : ie ? /* @__PURE__ */ n(
          "span",
          {
            className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
            role: "status",
            "aria-label": "正在加载视频",
            children: /* @__PURE__ */ n(Y, { size: 16, className: "animate-spin", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
const He = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], qe = /* @__PURE__ */ new Set([
  "audio",
  "editormediaaudio",
  "editormediaembed",
  "editormediaexternal",
  "editormediaimage",
  "editormediavideo",
  "externalmedia",
  "image",
  "mediaaudio",
  "mediaembed",
  "mediaexternal",
  "mediaimage",
  "mediavideo",
  "video"
]), Ye = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Ke({
  items: e,
  mediaCount: t,
  previewMediaURL: a,
  outputMediaURLs: r = []
}) {
  if (e.length > 1 || t > 1)
    return !0;
  const o = t === 1 && z(a) !== "" && r.length === 1 && z(r[0]) === z(a);
  return e.some(
    (d) => We(d, o)
  );
}
function We(e, t) {
  return V(e) ? He.some((a) => R(e[a])) ? !0 : R(e.rich) ? !t || L(e.rich, /* @__PURE__ */ new Set(), 0) : !1 : R(e);
}
function L(e, t, a) {
  if (e == null || e === "")
    return !1;
  if (a > 32)
    return !0;
  if (typeof e == "string") {
    const o = e.trim();
    if (!o)
      return !1;
    try {
      return L(
        JSON.parse(o),
        t,
        a + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(e))
    return e.some(
      (o) => L(o, t, a + 1)
    );
  if (!V(e) || t.has(e))
    return !0;
  t.add(e);
  const r = Je(e.type);
  if (r === "text")
    return z(e.text) !== "";
  if (qe.has(r)) {
    const o = V(e.attrs) ? e.attrs : void 0;
    return R(o?.caption);
  }
  return Ye.has(r) ? !0 : Array.isArray(e.content) ? e.content.some(
    (o) => L(o, t, a + 1)
  ) : !1;
}
function R(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e == "object" ? Object.keys(e).length > 0 : !0;
}
function V(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function Je(e) {
  return z(e).toLowerCase().replace(/[\s_-]+/g, "");
}
function z(e) {
  return typeof e == "string" ? e.trim() : "";
}
function Nt(e, t) {
  if (Ze(e, t))
    return !1;
  const a = we(e), r = ve(e), o = Q(t);
  return Ke({
    items: r,
    mediaCount: a,
    previewMediaURL: o?.url,
    outputMediaURLs: o ? X(e, o.kind).map(
      (d) => d.url
    ) : []
  });
}
function Xe(e, t) {
  if (!t)
    return null;
  const a = X(e, t);
  return a.length > 1 ? { kind: t, items: a } : null;
}
function Ct(e) {
  return Q(e)?.kind;
}
function Q(e) {
  if (e?.videoUrl)
    return { kind: "video", url: e.videoUrl };
  if (e?.imageUrl)
    return { kind: "image", url: e.imageUrl };
  if (e?.audioUrl)
    return { kind: "audio", url: e.audioUrl };
}
function Ze(e, t) {
  const a = F(e, /* @__PURE__ */ new Set(), 0);
  return !a || !t ? !1 : [
    t.imageUrl,
    t.videoUrl,
    t.audioUrl,
    t.fileUrl
  ].some((r) => String(r || "").trim() === a);
}
function F(e, t, a) {
  if (e == null || a > 12)
    return "";
  if (typeof e == "string")
    return e.trim();
  if (Array.isArray(e))
    return e.length === 1 ? F(e[0], t, a + 1) : "";
  if (typeof e != "object" || t.has(e))
    return "";
  t.add(e);
  const o = Object.entries(e).filter(
    ([d, i]) => !["type", "kind", "format", "version"].includes(d) && Ne(i)
  ).map(([, d]) => d);
  return o.length === 1 ? F(o[0], t, a + 1) : "";
}
function ee(e, t) {
  const a = Ce(t, e), r = Math.max(1, Math.ceil(e / a.capacity)), [o, d] = x(0), i = xe(o, r);
  return {
    shape: a,
    pageCount: r,
    pageIndex: i,
    pageOffset: i * a.capacity,
    setPageIndex: d
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const S = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!S || Object.keys(S).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Qe = S.DropdownMenu, et = S.DropdownMenuContent, tt = S.DropdownMenuItem, nt = S.DropdownMenuTrigger, B = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const at = B.EnergonAudioPlayer, rt = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, ot = {
  image: "张",
  video: "个",
  audio: "个"
};
function te({
  layout: e,
  countLabel: t,
  pageIndex: a,
  pageCount: r,
  disabled: o = !1,
  leading: d,
  actions: i,
  onLayoutChange: p,
  onPageChange: m
}) {
  const g = Z(e), b = Pe(g);
  return /* @__PURE__ */ f("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ f("div", { className: "ws-media-grid-toolbar-main", children: [
      d,
      /* @__PURE__ */ f(Qe, { modal: !1, children: [
        /* @__PURE__ */ n(nt, { asChild: !0, children: /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: o || !p,
            "aria-label": "选择每页宫格布局",
            onClick: (l) => l.stopPropagation(),
            children: [
              /* @__PURE__ */ n(_e, { size: 14 }),
              b.label,
              /* @__PURE__ */ n(ze, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ n(
          et,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (l) => l.stopPropagation(),
            children: Ie.map((l) => /* @__PURE__ */ f(
              tt,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  m(0), p?.(l.value);
                },
                children: [
                  /* @__PURE__ */ n("span", { children: l.label }),
                  /* @__PURE__ */ n("small", { children: l.value === "auto" ? "按结果排版" : `每页 ${l.capacity} 格` }),
                  l.value === g ? /* @__PURE__ */ n(Ee, { size: 13 }) : null
                ]
              },
              l.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ n("span", { className: "ws-media-grid-count", children: t }),
      r > 1 ? /* @__PURE__ */ f("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: a <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (l) => {
              l.stopPropagation(), m(Math.max(0, a - 1));
            },
            children: /* @__PURE__ */ n(Le, { size: 14 })
          }
        ),
        /* @__PURE__ */ f("span", { children: [
          a + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: a >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (l) => {
              l.stopPropagation(), m(Math.min(r - 1, a + 1));
            },
            children: /* @__PURE__ */ n(Re, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    i ? /* @__PURE__ */ n("div", { className: "ws-media-grid-toolbar-actions", children: i }) : null
  ] });
}
function it({
  kind: e,
  items: t,
  label: a,
  compact: r = !1
}) {
  const [o, d] = x("auto"), i = ee(t.length, o), p = r ? Me(t.length) : i.shape, m = r ? 0 : i.pageOffset, g = t.slice(m, m + p.capacity), b = Array.from(
    { length: p.capacity },
    (u, v) => g[v]
  ), l = rt[e], y = ot[e];
  return /* @__PURE__ */ f(
    "section",
    {
      className: `ws-media-grid-view is-${e}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ n(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${t.length} ${y}`,
            children: t.length > p.capacity ? `共${t.length}${y}` : `${t.length}${y}`
          }
        ) : /* @__PURE__ */ n(
          te,
          {
            layout: o,
            countLabel: `${t.length} ${y}`,
            pageIndex: i.pageIndex,
            pageCount: i.pageCount,
            onLayoutChange: d,
            onPageChange: i.setPageIndex
          }
        ),
        /* @__PURE__ */ n("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ n(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${p.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${p.rows}, minmax(0, 1fr))`
            },
            children: b.map((u, v) => {
              const h = m + v, w = `${a || l} ${h + 1}`;
              return u ? /* @__PURE__ */ n(
                "figure",
                {
                  className: e === "audio" ? "is-audio" : void 0,
                  "aria-label": e === "audio" ? w : void 0,
                  children: /* @__PURE__ */ n(st, { kind: e, item: u, label: w })
                },
                `${u.url}-${h}`
              ) : /* @__PURE__ */ n("figure", { className: "is-empty" }, `empty-${h}`);
            })
          }
        ) })
      ]
    }
  );
}
function st({
  kind: e,
  item: t,
  label: a
}) {
  const { url: r } = t;
  return e === "image" ? /* @__PURE__ */ n(
    "img",
    {
      src: r,
      alt: a,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : e === "video" ? /* @__PURE__ */ n(
    Be,
    {
      src: r,
      poster: t.thumbnail,
      draggable: !1,
      ariaLabel: a,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ f(
    "div",
    {
      className: `ws-media-grid-audio-card${t.thumbnail ? " has-cover" : ""}`,
      children: [
        t.thumbnail ? /* @__PURE__ */ n("img", { src: t.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ n(
          at,
          {
            src: r,
            preload: "none",
            className: "ws-media-grid-audio-player nodrag nopan"
          }
        )
      ]
    }
  );
}
function lt({
  items: e,
  initialItemID: t,
  onClose: a
}) {
  const r = W(e, t), [o, d] = x(r), i = e.map((g) => `${String(g.id)}:${g.url}`).join(`
`);
  J(() => {
    d(W(e, t));
  }, [t, i]);
  const p = Math.min(
    Math.max(0, o),
    Math.max(0, e.length - 1)
  ), m = e[p];
  return m ? /* @__PURE__ */ n(
    $e,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: a,
      header: /* @__PURE__ */ n(
        Se,
        {
          icon: /* @__PURE__ */ n(Te, { size: 16 }),
          title: m.name || "图片预览",
          subtitle: `图片 ${p + 1}/${e.length}`,
          downloadUrl: m.url,
          onClose: a
        }
      ),
      children: /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n(
        je,
        {
          kind: "image",
          items: e,
          activeIndex: p,
          onSelect: d
        }
      ) })
    }
  ) : null;
}
function W(e, t) {
  const a = e.findIndex((r) => String(r.id) === String(t));
  return a >= 0 ? a : 0;
}
function ne({
  grid: e,
  variant: t = "compact",
  readonly: a = !0,
  renderFrameAction: r,
  onFrameChange: o,
  onFrameImport: d,
  onEmptyFrameImport: i,
  capacity: p,
  showHeader: m = !0,
  showCaptions: g = !0,
  columns: b,
  rows: l,
  frameOffset: y = 0,
  previewFrames: u
}) {
  const [v, h] = x(
    null
  ), w = he(
    () => (u || e.frames).filter((s) => !!s.image).map((s) => ({
      id: s.id || s.order,
      name: s.title || `画面 ${s.order}`,
      url: s.image,
      thumbnail: s.image
    })),
    [e.frames, u]
  ), $ = Math.max(
    e.frames.length,
    Math.trunc(Number(p) || 0)
  ), P = Array.from(
    { length: $ },
    (s, D) => e.frames[D]
  ), T = {
    ...b ? { gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` } : {},
    ...l ? { gridTemplateRows: `repeat(${l}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ f("section", { className: `ws-storyboard-grid-output is-${t}`, children: [
    m ? /* @__PURE__ */ f("header", { children: [
      /* @__PURE__ */ n("strong", { children: e.title }),
      e.summary ? /* @__PURE__ */ n("p", { children: e.summary }) : null
    ] }) : null,
    /* @__PURE__ */ n(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": P.length,
        style: T,
        children: P.map((s, D) => {
          const C = y + D;
          return s ? /* @__PURE__ */ f("figure", { className: s.image ? "" : "is-empty", children: [
            s.image ? /* @__PURE__ */ n(
              dt,
              {
                frame: s,
                onPreview: () => h(s.id || s.order)
              },
              `${s.id}:${s.image}`
            ) : d ? /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${s.order} 格导入图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), d(s, C);
                },
                children: /* @__PURE__ */ n(_, { size: 18 })
              }
            ) : /* @__PURE__ */ n("div", { className: "ws-storyboard-grid-output-error", children: s.error || "暂无图片" }),
            s.image && d ? /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${s.order} 格图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), d(s, C);
                },
                children: /* @__PURE__ */ n(_, { size: 14 })
              }
            ) : null,
            g ? /* @__PURE__ */ f("figcaption", { children: [
              /* @__PURE__ */ n("span", { children: String(s.order).padStart(2, "0") }),
              t === "detail" && !a && o ? /* @__PURE__ */ n(
                "input",
                {
                  value: s.title,
                  "aria-label": `第 ${s.order} 格标题`,
                  onChange: (N) => o(C, { title: N.target.value })
                }
              ) : /* @__PURE__ */ n("strong", { children: s.title })
            ] }) : null,
            t === "detail" ? /* @__PURE__ */ f("div", { className: "ws-storyboard-grid-output-details", children: [
              a || !o ? /* @__PURE__ */ n("p", { children: s.description || "暂无画面说明" }) : /* @__PURE__ */ n(
                "textarea",
                {
                  value: s.description,
                  rows: 3,
                  "aria-label": `第 ${s.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (N) => o(C, {
                    description: N.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ n("div", { className: "ws-storyboard-grid-output-actions", children: r(s, C) }) : null
            ] }) : null
          ] }, s.id) : /* @__PURE__ */ n("figure", { className: "is-empty", children: i ? /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${C + 1} 格导入图片`,
              onClick: (N) => {
                N.preventDefault(), N.stopPropagation(), i(C);
              },
              children: /* @__PURE__ */ n(_, { size: 18 })
            }
          ) : null }, `empty-${C}`);
        })
      }
    ),
    v != null && w.length > 0 ? /* @__PURE__ */ n(
      lt,
      {
        items: w,
        initialItemID: v,
        onClose: () => h(null)
      }
    ) : null
  ] });
}
function dt({
  frame: e,
  onPreview: t
}) {
  const [a, r] = x(!1);
  return a ? /* @__PURE__ */ n("div", { className: "ws-storyboard-grid-output-error", children: e.error || "图片加载失败" }) : /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${e.order} 格图片`,
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), t();
      },
      children: /* @__PURE__ */ n(
        "img",
        {
          src: e.image,
          alt: e.title,
          loading: "lazy",
          decoding: "async",
          onError: () => r(!0)
        }
      )
    }
  );
}
function xt({
  grid: e,
  aspectRatio: t,
  running: a = !1,
  onImport: r,
  onFrameImport: o,
  onSlotImport: d,
  onEdit: i,
  layout: p = "auto",
  onLayoutChange: m
}) {
  const g = Z(p), b = e?.frames.length || 0, l = ee(b, g), y = e ? {
    ...e,
    frames: e.frames.slice(
      l.pageOffset,
      l.pageOffset + l.shape.capacity
    )
  } : null, u = e?.frames.filter((h) => h.image).length || 0, v = b > 0 && u !== b ? `${u}/${b} 张` : `${b} 张`;
  return /* @__PURE__ */ f(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${a ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ n(
          te,
          {
            layout: g,
            countLabel: v,
            pageIndex: l.pageIndex,
            pageCount: l.pageCount,
            disabled: a || !m,
            leading: /* @__PURE__ */ f("span", { children: [
              "比例 ",
              t || "自动"
            ] }),
            actions: r || e && i ? /* @__PURE__ */ f(ge, { children: [
              r ? /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: a,
                  onClick: (h) => {
                    h.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ n(_, { size: 14 }),
                    /* @__PURE__ */ n("span", { children: e ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              e && i ? /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: a,
                  onClick: (h) => {
                    h.stopPropagation(), i();
                  },
                  children: [
                    /* @__PURE__ */ n(Ae, { size: 14 }),
                    /* @__PURE__ */ n("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: m,
            onPageChange: l.setPageIndex
          }
        ),
        /* @__PURE__ */ n("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: y ? /* @__PURE__ */ n(
          ne,
          {
            grid: y,
            previewFrames: e?.frames,
            capacity: l.shape.capacity,
            columns: l.shape.columns,
            rows: l.shape.rows,
            frameOffset: l.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: a ? void 0 : o,
            onEmptyFrameImport: a ? void 0 : d
          }
        ) : /* @__PURE__ */ n(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": a,
            style: {
              gridTemplateColumns: `repeat(${l.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${l.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: l.shape.capacity }, (h, w) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: a || !d,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${w + 1} 格`,
                onClick: ($) => {
                  $.stopPropagation(), d?.(w);
                },
                children: /* @__PURE__ */ n(_, { size: 18 })
              },
              w
            ))
          }
        ) })
      ]
    }
  );
}
const ct = be(
  () => import("./space-storyboard-view-B7o6lt0R.js").then((e) => ({
    default: e.StoryboardView
  }))
);
function Mt({
  output: e,
  fallback: t = "",
  streaming: a = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: d,
  richClassName: i,
  mediaLayout: p = "default",
  mediaGridKind: m,
  compactMediaGrid: g = !1,
  storyboardEditable: b = !1,
  storyboardDisabled: l = !1,
  onStoryboardSave: y
}) {
  const u = ue(e, t), v = pe(u), h = De(u);
  if (h)
    return /* @__PURE__ */ n(j, { className: o, children: /* @__PURE__ */ n(ne, { grid: h }) });
  if (v)
    return /* @__PURE__ */ n(j, { className: o, children: /* @__PURE__ */ n(ye, { fallback: /* @__PURE__ */ n("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ n(
      ct,
      {
        storyboard: v,
        editable: b,
        disabled: l,
        onSave: y
      }
    ) }) });
  const w = Xe(u, m);
  return w ? /* @__PURE__ */ n(
    j,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ n(
        it,
        {
          kind: w.kind,
          items: w.items,
          label: t,
          compact: g
        }
      )
    }
  ) : /* @__PURE__ */ n(
    me,
    {
      output: u,
      fallback: t,
      streaming: a,
      emptyText: r,
      className: o,
      markdownClassName: d,
      richClassName: i,
      mediaLayout: p
    }
  );
}
export {
  Mt as C,
  Be as P,
  ne as S,
  vt as a,
  Ct as b,
  Nt as c,
  Xe as d,
  xt as e,
  K as i,
  yt as m,
  wt as o,
  Ue as p,
  bt as s
};
