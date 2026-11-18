import { a as g, j as t, F as de } from "./space-storyboard-material-ECvLpyk_.js";
import { b as ce, a as P, d as J, u as ue, q as pe, S as me } from "./file-kind-Cq3pESGF.js";
import { n as X, a6 as ge, a7 as he, u as fe, a8 as be, a9 as ye, aa as we, ab as Q, ac as ve, ad as Ne, A as Ce, t as Pe, ae as Me, x as xe, af as j, I as Se } from "./asset-audio-preview-Cezm24us.js";
import { p as Ie } from "./asset-preview-Bb3VoJnt.js";
import { bf as $e, r as Y, j as De, bg as ke, c as _e, n as ze, H as Ee, d as Le, a9 as Oe, a7 as z, q as Re } from "./vendor-icons-BZHLe0mm.js";
import { V as Te, a as Ae } from "./media-inspector-gallery-BR6rzcOx.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-content-view-B4S9BdoA.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Ge = U.FirstFrameVideo, je = 56;
function K(e, n) {
  const a = e.getBoundingClientRect(), r = Math.min(
    je,
    a.height * 0.25
  );
  return n >= a.bottom - r;
}
function Ue({
  src: e,
  poster: n = "",
  alt: a = "",
  className: r,
  style: o,
  title: d,
  draggable: c = !1,
  ariaLabel: p,
  onLoad: m,
  onError: h,
  onMediaSize: b,
  objectFit: s = "cover",
  allowDragFromVideo: y = !1,
  playButtonOnly: u = !1
}) {
  const v = ce(null), [f, w] = P(""), [$, x] = P(""), [T, i] = P(""), [D, C] = P(""), [N, ae] = P(""), A = f === e, M = $ === e, L = T === e, re = D !== e && N !== e, oe = u || !M && !A, ie = !u && A && !M, se = u ? { bottom: 12, right: 12 } : {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };
  J(() => {
    const l = v.current;
    if (!l || !y || u) return;
    const S = (_) => {
      K(l, _.clientY) && _.stopPropagation();
    }, k = (_) => {
      const q = _.touches[0];
      q && K(l, q.clientY) && _.stopPropagation();
    };
    return l.addEventListener("mousedown", S), l.addEventListener("touchstart", k, {
      passive: !0
    }), () => {
      l.removeEventListener("mousedown", S), l.removeEventListener("touchstart", k);
    };
  }, [y, u]);
  function G(l) {
    l.stopPropagation();
  }
  function B() {
    w((l) => l === e ? "" : l), x((l) => l === e ? "" : l), i((l) => l === e ? "" : l);
  }
  function le(l) {
    l.preventDefault(), l.stopPropagation();
    const S = v.current;
    if (S) {
      if (L) {
        i((k) => k === e ? "" : k), S.pause();
        return;
      }
      w(e), i(e), M || x(""), S.play().catch(() => {
        B(), h?.();
      });
    }
  }
  return /* @__PURE__ */ g(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: o,
      title: d,
      draggable: c,
      children: [
        /* @__PURE__ */ t(
          Ge,
          {
            videoRef: v,
            src: e,
            poster: n || void 0,
            controls: A && !u,
            playsInline: !0,
            preload: "none",
            draggable: c,
            "aria-hidden": M ? void 0 : !0,
            className: [
              y ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              M ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: s },
            onPointerDown: u || y ? void 0 : G,
            onClick: u ? void 0 : G,
            onLoadedMetadata: (l) => b?.(
              l.currentTarget.videoWidth,
              l.currentTarget.videoHeight
            ),
            onPlaying: () => {
              x(e), i(e);
            },
            onPause: () => i((l) => l === e ? "" : l),
            onEnded: () => i((l) => l === e ? "" : l),
            onError: () => {
              B(), h?.();
            }
          }
        ),
        M ? null : /* @__PURE__ */ t(
          Te,
          {
            src: e,
            poster: n,
            alt: a,
            className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
            style: { objectFit: s },
            draggable: c,
            ariaHidden: !0,
            onLoad: () => {
              C(e), m?.();
            },
            onError: () => {
              ae(e), h?.();
            },
            onMediaSize: b
          }
        ),
        oe ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            style: se,
            "aria-label": L ? "暂停视频" : p ? `播放${p}` : "播放视频",
            "aria-pressed": L,
            onPointerDown: G,
            onClick: le,
            children: L ? /* @__PURE__ */ t($e, { size: 16, className: "fill-current", "aria-hidden": "true" }) : re && !M ? /* @__PURE__ */ t(
              Y,
              {
                size: 16,
                className: "animate-spin",
                "aria-hidden": "true"
              }
            ) : /* @__PURE__ */ t(
              De,
              {
                size: 16,
                className: "translate-x-px fill-current",
                "aria-hidden": "true"
              }
            )
          }
        ) : ie ? /* @__PURE__ */ t(
          "span",
          {
            className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
            role: "status",
            "aria-label": "正在加载视频",
            children: /* @__PURE__ */ t(Y, { size: 16, className: "animate-spin", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
const Ve = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Fe = /* @__PURE__ */ new Set([
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
]), He = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Be({
  items: e,
  mediaCount: n,
  previewMediaURL: a,
  outputMediaURLs: r = []
}) {
  if (e.length > 1 || n > 1)
    return !0;
  const o = n === 1 && E(a) !== "" && r.length === 1 && E(r[0]) === E(a);
  return e.some(
    (d) => qe(d, o)
  );
}
function qe(e, n) {
  return V(e) ? Ve.some((a) => R(e[a])) ? !0 : R(e.rich) ? !n || O(e.rich, /* @__PURE__ */ new Set(), 0) : !1 : R(e);
}
function O(e, n, a) {
  if (e == null || e === "")
    return !1;
  if (a > 32)
    return !0;
  if (typeof e == "string") {
    const o = e.trim();
    if (!o)
      return !1;
    try {
      return O(
        JSON.parse(o),
        n,
        a + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(e))
    return e.some(
      (o) => O(o, n, a + 1)
    );
  if (!V(e) || n.has(e))
    return !0;
  n.add(e);
  const r = Ye(e.type);
  if (r === "text")
    return E(e.text) !== "";
  if (Fe.has(r)) {
    const o = V(e.attrs) ? e.attrs : void 0;
    return R(o?.caption);
  }
  return He.has(r) ? !0 : Array.isArray(e.content) ? e.content.some(
    (o) => O(o, n, a + 1)
  ) : !1;
}
function R(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e == "object" ? Object.keys(e).length > 0 : !0;
}
function V(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function Ye(e) {
  return E(e).toLowerCase().replace(/[\s_-]+/g, "");
}
function E(e) {
  return typeof e == "string" ? e.trim() : "";
}
function gt(e, n) {
  if (We(e, n))
    return !1;
  const a = ge(e), r = he(e), o = Z(n);
  return Be({
    items: r,
    mediaCount: a,
    previewMediaURL: o?.url,
    outputMediaURLs: o ? X(e, o.kind).map(
      (d) => d.url
    ) : []
  });
}
function Ke(e, n) {
  if (!n)
    return null;
  const a = X(e, n);
  return a.length > 1 ? { kind: n, items: a } : null;
}
function ht(e) {
  return Z(e)?.kind;
}
function Z(e) {
  if (e?.videoUrl)
    return { kind: "video", url: e.videoUrl };
  if (e?.imageUrl)
    return { kind: "image", url: e.imageUrl };
  if (e?.audioUrl)
    return { kind: "audio", url: e.audioUrl };
}
function We(e, n) {
  const a = F(e, /* @__PURE__ */ new Set(), 0);
  return !a || !n ? !1 : [
    n.imageUrl,
    n.videoUrl,
    n.audioUrl,
    n.fileUrl
  ].some((r) => String(r || "").trim() === a);
}
function F(e, n, a) {
  if (e == null || a > 12)
    return "";
  if (typeof e == "string")
    return e.trim();
  if (Array.isArray(e))
    return e.length === 1 ? F(e[0], n, a + 1) : "";
  if (typeof e != "object" || n.has(e))
    return "";
  n.add(e);
  const o = Object.entries(e).filter(
    ([d, c]) => !["type", "kind", "format", "version"].includes(d) && fe(c)
  ).map(([, d]) => d);
  return o.length === 1 ? F(o[0], n, a + 1) : "";
}
function ee(e, n) {
  const a = be(n, e), r = Math.max(1, Math.ceil(e / a.capacity)), [o, d] = P(0), c = ye(o, r);
  return {
    shape: a,
    pageCount: r,
    pageIndex: c,
    pageOffset: c * a.capacity,
    setPageIndex: d
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const I = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Je = I.DropdownMenu, Xe = I.DropdownMenuContent, Qe = I.DropdownMenuItem, Ze = I.DropdownMenuTrigger, H = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const et = H.EnergonAudioPlayer, tt = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, nt = {
  image: "张",
  video: "个",
  audio: "个"
};
function te({
  layout: e,
  countLabel: n,
  pageIndex: a,
  pageCount: r,
  disabled: o = !1,
  leading: d,
  actions: c,
  onLayoutChange: p,
  onPageChange: m
}) {
  const h = Q(e), b = ve(h);
  return /* @__PURE__ */ g("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ g("div", { className: "ws-media-grid-toolbar-main", children: [
      d,
      /* @__PURE__ */ g(Je, { modal: !1, children: [
        /* @__PURE__ */ t(Ze, { asChild: !0, children: /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: o || !p,
            "aria-label": "选择每页宫格布局",
            onClick: (s) => s.stopPropagation(),
            children: [
              /* @__PURE__ */ t(ke, { size: 14 }),
              b.label,
              /* @__PURE__ */ t(_e, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ t(
          Xe,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (s) => s.stopPropagation(),
            children: Ne.map((s) => /* @__PURE__ */ g(
              Qe,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  m(0), p?.(s.value);
                },
                children: [
                  /* @__PURE__ */ t("span", { children: s.label }),
                  /* @__PURE__ */ t("small", { children: s.value === "auto" ? "按结果排版" : `每页 ${s.capacity} 格` }),
                  s.value === h ? /* @__PURE__ */ t(ze, { size: 13 }) : null
                ]
              },
              s.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: "ws-media-grid-count", children: n }),
      r > 1 ? /* @__PURE__ */ g("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: a <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (s) => {
              s.stopPropagation(), m(Math.max(0, a - 1));
            },
            children: /* @__PURE__ */ t(Ee, { size: 14 })
          }
        ),
        /* @__PURE__ */ g("span", { children: [
          a + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: a >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (s) => {
              s.stopPropagation(), m(Math.min(r - 1, a + 1));
            },
            children: /* @__PURE__ */ t(Le, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    c ? /* @__PURE__ */ t("div", { className: "ws-media-grid-toolbar-actions", children: c }) : null
  ] });
}
function at({
  kind: e,
  items: n,
  label: a,
  compact: r = !1
}) {
  const [o, d] = P("auto"), c = ee(n.length, o), p = r ? we(n.length) : c.shape, m = r ? 0 : c.pageOffset, h = n.slice(m, m + p.capacity), b = Array.from(
    { length: p.capacity },
    (u, v) => h[v]
  ), s = tt[e], y = nt[e];
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-media-grid-view is-${e}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ t(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${n.length} ${y}`,
            children: n.length > p.capacity ? `共${n.length}${y}` : `${n.length}${y}`
          }
        ) : /* @__PURE__ */ t(
          te,
          {
            layout: o,
            countLabel: `${n.length} ${y}`,
            pageIndex: c.pageIndex,
            pageCount: c.pageCount,
            onLayoutChange: d,
            onPageChange: c.setPageIndex
          }
        ),
        /* @__PURE__ */ t("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ t(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${p.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${p.rows}, minmax(0, 1fr))`
            },
            children: b.map((u, v) => {
              const f = m + v, w = `${a || s} ${f + 1}`;
              return u ? /* @__PURE__ */ t(
                "figure",
                {
                  className: e === "audio" ? "is-audio" : void 0,
                  "aria-label": e === "audio" ? w : void 0,
                  children: /* @__PURE__ */ t(rt, { kind: e, item: u, label: w })
                },
                `${u.url}-${f}`
              ) : /* @__PURE__ */ t("figure", { className: "is-empty" }, `empty-${f}`);
            })
          }
        ) })
      ]
    }
  );
}
function rt({
  kind: e,
  item: n,
  label: a
}) {
  const { url: r } = n;
  return e === "image" ? /* @__PURE__ */ t(
    "img",
    {
      src: r,
      alt: a,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : e === "video" ? /* @__PURE__ */ t(
    Ue,
    {
      src: r,
      poster: n.thumbnail,
      draggable: !1,
      ariaLabel: a,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ g(
    "div",
    {
      className: `ws-media-grid-audio-card${n.thumbnail ? " has-cover" : ""}`,
      children: [
        n.thumbnail ? /* @__PURE__ */ t("img", { src: n.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ t(
          et,
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
function ot({
  items: e,
  initialItemID: n,
  onClose: a
}) {
  const r = W(e, n), [o, d] = P(r), c = e.map((h) => `${String(h.id)}:${h.url}`).join(`
`);
  J(() => {
    d(W(e, n));
  }, [n, c]);
  const p = Math.min(
    Math.max(0, o),
    Math.max(0, e.length - 1)
  ), m = e[p];
  return m ? /* @__PURE__ */ t(
    Pe,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: a,
      header: /* @__PURE__ */ t(
        Ce,
        {
          icon: /* @__PURE__ */ t(Oe, { size: 16 }),
          title: m.name || "图片预览",
          subtitle: `图片 ${p + 1}/${e.length}`,
          downloadUrl: m.url,
          onClose: a
        }
      ),
      children: /* @__PURE__ */ t("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ t(
        Ae,
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
function W(e, n) {
  const a = e.findIndex((r) => String(r.id) === String(n));
  return a >= 0 ? a : 0;
}
function ne({
  grid: e,
  variant: n = "compact",
  readonly: a = !0,
  renderFrameAction: r,
  onFrameChange: o,
  onFrameImport: d,
  onEmptyFrameImport: c,
  capacity: p,
  showHeader: m = !0,
  showCaptions: h = !0,
  columns: b,
  rows: s,
  frameOffset: y = 0,
  previewFrames: u
}) {
  const [v, f] = P(
    null
  ), w = ue(
    () => (u || e.frames).filter((i) => !!i.image).map((i) => ({
      id: i.id || i.order,
      name: i.title || `画面 ${i.order}`,
      url: i.image,
      thumbnail: i.image
    })),
    [e.frames, u]
  ), $ = Math.max(
    e.frames.length,
    Math.trunc(Number(p) || 0)
  ), x = Array.from(
    { length: $ },
    (i, D) => e.frames[D]
  ), T = {
    ...b ? { gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))` } : {},
    ...s ? { gridTemplateRows: `repeat(${s}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ g("section", { className: `ws-storyboard-grid-output is-${n}`, children: [
    m ? /* @__PURE__ */ g("header", { children: [
      /* @__PURE__ */ t("strong", { children: e.title }),
      e.summary ? /* @__PURE__ */ t("p", { children: e.summary }) : null
    ] }) : null,
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": x.length,
        style: T,
        children: x.map((i, D) => {
          const C = y + D;
          return i ? /* @__PURE__ */ g("figure", { className: i.image ? "" : "is-empty", children: [
            i.image ? /* @__PURE__ */ t(
              it,
              {
                frame: i,
                onPreview: () => f(i.id || i.order)
              },
              `${i.id}:${i.image}`
            ) : d ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${i.order} 格导入图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), d(i, C);
                },
                children: /* @__PURE__ */ t(z, { size: 18 })
              }
            ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-error", children: i.error || "暂无图片" }),
            i.image && d ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${i.order} 格图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), d(i, C);
                },
                children: /* @__PURE__ */ t(z, { size: 14 })
              }
            ) : null,
            h ? /* @__PURE__ */ g("figcaption", { children: [
              /* @__PURE__ */ t("span", { children: String(i.order).padStart(2, "0") }),
              n === "detail" && !a && o ? /* @__PURE__ */ t(
                "input",
                {
                  value: i.title,
                  "aria-label": `第 ${i.order} 格标题`,
                  onChange: (N) => o(C, { title: N.target.value })
                }
              ) : /* @__PURE__ */ t("strong", { children: i.title })
            ] }) : null,
            n === "detail" ? /* @__PURE__ */ g("div", { className: "ws-storyboard-grid-output-details", children: [
              a || !o ? /* @__PURE__ */ t("p", { children: i.description || "暂无画面说明" }) : /* @__PURE__ */ t(
                "textarea",
                {
                  value: i.description,
                  rows: 3,
                  "aria-label": `第 ${i.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (N) => o(C, {
                    description: N.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-actions", children: r(i, C) }) : null
            ] }) : null
          ] }, i.id) : /* @__PURE__ */ t("figure", { className: "is-empty", children: c ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${C + 1} 格导入图片`,
              onClick: (N) => {
                N.preventDefault(), N.stopPropagation(), c(C);
              },
              children: /* @__PURE__ */ t(z, { size: 18 })
            }
          ) : null }, `empty-${C}`);
        })
      }
    ),
    v != null && w.length > 0 ? /* @__PURE__ */ t(
      ot,
      {
        items: w,
        initialItemID: v,
        onClose: () => f(null)
      }
    ) : null
  ] });
}
function it({
  frame: e,
  onPreview: n
}) {
  const [a, r] = P(!1);
  return a ? /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-error", children: e.error || "图片加载失败" }) : /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${e.order} 格图片`,
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), n();
      },
      children: /* @__PURE__ */ t(
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
function ft({
  grid: e,
  aspectRatio: n,
  running: a = !1,
  onImport: r,
  onFrameImport: o,
  onSlotImport: d,
  onEdit: c,
  layout: p = "auto",
  onLayoutChange: m
}) {
  const h = Q(p), b = e?.frames.length || 0, s = ee(b, h), y = e ? {
    ...e,
    frames: e.frames.slice(
      s.pageOffset,
      s.pageOffset + s.shape.capacity
    )
  } : null, u = e?.frames.filter((f) => f.image).length || 0, v = b > 0 && u !== b ? `${u}/${b} 张` : `${b} 张`;
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${a ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ t(
          te,
          {
            layout: h,
            countLabel: v,
            pageIndex: s.pageIndex,
            pageCount: s.pageCount,
            disabled: a || !m,
            leading: /* @__PURE__ */ g("span", { children: [
              "比例 ",
              n || "自动"
            ] }),
            actions: r || e && c ? /* @__PURE__ */ g(de, { children: [
              r ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: a,
                  onClick: (f) => {
                    f.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ t(z, { size: 14 }),
                    /* @__PURE__ */ t("span", { children: e ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              e && c ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: a,
                  onClick: (f) => {
                    f.stopPropagation(), c();
                  },
                  children: [
                    /* @__PURE__ */ t(Re, { size: 14 }),
                    /* @__PURE__ */ t("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: m,
            onPageChange: s.setPageIndex
          }
        ),
        /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: y ? /* @__PURE__ */ t(
          ne,
          {
            grid: y,
            previewFrames: e?.frames,
            capacity: s.shape.capacity,
            columns: s.shape.columns,
            rows: s.shape.rows,
            frameOffset: s.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: a ? void 0 : o,
            onEmptyFrameImport: a ? void 0 : d
          }
        ) : /* @__PURE__ */ t(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": a,
            style: {
              gridTemplateColumns: `repeat(${s.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${s.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: s.shape.capacity }, (f, w) => /* @__PURE__ */ t(
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
                children: /* @__PURE__ */ t(z, { size: 18 })
              },
              w
            ))
          }
        ) })
      ]
    }
  );
}
const st = pe(
  () => import("./space-storyboard-view-DSDW_IK3.js").then((e) => ({
    default: e.StoryboardView
  }))
);
function bt({
  output: e,
  fallback: n = "",
  streaming: a = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: d,
  richClassName: c,
  mediaLayout: p = "default",
  mediaGridKind: m,
  compactMediaGrid: h = !1,
  storyboardEditable: b = !1,
  storyboardDisabled: s = !1,
  onStoryboardSave: y
}) {
  const u = Me(e, n), v = Ie(u), f = xe(u);
  if (f)
    return /* @__PURE__ */ t(j, { className: o, children: /* @__PURE__ */ t(ne, { grid: f }) });
  if (v)
    return /* @__PURE__ */ t(j, { className: o, children: /* @__PURE__ */ t(me, { fallback: /* @__PURE__ */ t("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ t(
      st,
      {
        storyboard: v,
        editable: b,
        disabled: s,
        onSave: y
      }
    ) }) });
  const w = Ke(u, m);
  return w ? /* @__PURE__ */ t(
    j,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ t(
        at,
        {
          kind: w.kind,
          items: w.items,
          label: n,
          compact: h
        }
      )
    }
  ) : /* @__PURE__ */ t(
    Se,
    {
      output: u,
      fallback: n,
      streaming: a,
      emptyText: r,
      className: o,
      markdownClassName: d,
      richClassName: c,
      mediaLayout: p
    }
  );
}
export {
  bt as C,
  Ue as P,
  ne as S,
  ht as a,
  Ke as b,
  gt as c,
  ft as d,
  K as i
};
