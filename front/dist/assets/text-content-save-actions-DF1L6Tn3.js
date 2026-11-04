import { a as m, j as t, F as ce } from "./preloadable-BrN58FXf.js";
import { b as P, a as I, d as V, u as be, q as ye, S as we, h as L } from "./file-kind-BSFhe2vU.js";
import { d as de, N as ve, G as Ne, j as Ce, O as Se, P as Pe, Q as xe, L as ue, R as Me, T as Re, U as De, k as Ie, V as Z, B as $e } from "./content-view-0gIO2Kkv.js";
import { l as ke, g as ze, p as Te } from "./asset-preview-D6nljO8_.js";
import { bc as _e, r as ee, j as Oe, bd as Ee, c as Le, n as Ae, J as Ge, d as je, a8 as Fe, a6 as H, q as Ue, s as Ve, w as He, e as Be } from "./vendor-icons-UGaOWWu-.js";
import { V as qe, a as Ye } from "./media-inspector-gallery-CQ7C4itZ.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./text-content-save-actions-B4S9BdoA.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const te = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!te || Object.keys(te).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const We = te.FirstFrameVideo, Je = 56;
function se(e, n) {
  const r = e.getBoundingClientRect(), a = Math.min(
    Je,
    r.height * 0.25
  );
  return n >= r.bottom - a;
}
function Ke({
  src: e,
  poster: n = "",
  alt: r = "",
  className: a,
  style: o,
  title: c,
  draggable: d = !1,
  ariaLabel: f,
  onLoad: g,
  onError: b,
  onMediaSize: p,
  objectFit: s = "cover",
  allowDragFromVideo: h = !1,
  playButtonOnly: u = !1
}) {
  const w = P(null), [y, v] = I(""), [T, x] = I(""), [$, i] = I(""), [D, R] = I(""), [N, k] = I(""), z = y === e, C = T === e, M = $ === e, q = D !== e && N !== e, K = u || !C && !z, F = !u && z && !C, Q = u ? { bottom: 12, right: 12 } : {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };
  V(() => {
    const l = w.current;
    if (!l || !h || u) return;
    const _ = (E) => {
      se(l, E.clientY) && E.stopPropagation();
    }, O = (E) => {
      const A = E.touches[0];
      A && se(l, A.clientY) && E.stopPropagation();
    };
    return l.addEventListener("mousedown", _), l.addEventListener("touchstart", O, {
      passive: !0
    }), () => {
      l.removeEventListener("mousedown", _), l.removeEventListener("touchstart", O);
    };
  }, [h, u]);
  function U(l) {
    l.stopPropagation();
  }
  function Y() {
    v((l) => l === e ? "" : l), x((l) => l === e ? "" : l), i((l) => l === e ? "" : l);
  }
  function S(l) {
    l.preventDefault(), l.stopPropagation();
    const _ = w.current;
    if (_) {
      if (M) {
        i((O) => O === e ? "" : O), _.pause();
        return;
      }
      v(e), i(e), C || x(""), _.play().catch(() => {
        Y(), b?.();
      });
    }
  }
  return /* @__PURE__ */ m(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        a
      ].filter(Boolean).join(" "),
      style: o,
      title: c,
      draggable: d,
      children: [
        /* @__PURE__ */ t(
          We,
          {
            videoRef: w,
            src: e,
            poster: n || void 0,
            controls: z && !u,
            playsInline: !0,
            preload: "none",
            draggable: d,
            "aria-hidden": C ? void 0 : !0,
            className: [
              h ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              C ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: s },
            onPointerDown: u || h ? void 0 : U,
            onClick: u ? void 0 : U,
            onLoadedMetadata: (l) => p?.(
              l.currentTarget.videoWidth,
              l.currentTarget.videoHeight
            ),
            onPlaying: () => {
              x(e), i(e);
            },
            onPause: () => i((l) => l === e ? "" : l),
            onEnded: () => i((l) => l === e ? "" : l),
            onError: () => {
              Y(), b?.();
            }
          }
        ),
        C ? null : /* @__PURE__ */ t(
          qe,
          {
            src: e,
            poster: n,
            alt: r,
            className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
            style: { objectFit: s },
            draggable: d,
            ariaHidden: !0,
            onLoad: () => {
              R(e), g?.();
            },
            onError: () => {
              k(e), b?.();
            },
            onMediaSize: p
          }
        ),
        K ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            style: Q,
            "aria-label": M ? "暂停视频" : f ? `播放${f}` : "播放视频",
            "aria-pressed": M,
            onPointerDown: U,
            onClick: S,
            children: M ? /* @__PURE__ */ t(_e, { size: 16, className: "fill-current", "aria-hidden": "true" }) : q && !C ? /* @__PURE__ */ t(
              ee,
              {
                size: 16,
                className: "animate-spin",
                "aria-hidden": "true"
              }
            ) : /* @__PURE__ */ t(
              Oe,
              {
                size: 16,
                className: "translate-x-px fill-current",
                "aria-hidden": "true"
              }
            )
          }
        ) : F ? /* @__PURE__ */ t(
          "span",
          {
            className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
            role: "status",
            "aria-label": "正在加载视频",
            children: /* @__PURE__ */ t(ee, { size: 16, className: "animate-spin", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
const Qe = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Xe = /* @__PURE__ */ new Set([
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
]), Ze = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function et({
  items: e,
  mediaCount: n,
  previewMediaURL: r,
  outputMediaURLs: a = []
}) {
  if (e.length > 1 || n > 1)
    return !0;
  const o = n === 1 && B(r) !== "" && a.length === 1 && B(a[0]) === B(r);
  return e.some(
    (c) => tt(c, o)
  );
}
function tt(e, n) {
  return ne(e) ? Qe.some((r) => J(e[r])) ? !0 : J(e.rich) ? !n || W(e.rich, /* @__PURE__ */ new Set(), 0) : !1 : J(e);
}
function W(e, n, r) {
  if (e == null || e === "")
    return !1;
  if (r > 32)
    return !0;
  if (typeof e == "string") {
    const o = e.trim();
    if (!o)
      return !1;
    try {
      return W(
        JSON.parse(o),
        n,
        r + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(e))
    return e.some(
      (o) => W(o, n, r + 1)
    );
  if (!ne(e) || n.has(e))
    return !0;
  n.add(e);
  const a = nt(e.type);
  if (a === "text")
    return B(e.text) !== "";
  if (Xe.has(a)) {
    const o = ne(e.attrs) ? e.attrs : void 0;
    return J(o?.caption);
  }
  return Ze.has(a) ? !0 : Array.isArray(e.content) ? e.content.some(
    (o) => W(o, n, r + 1)
  ) : !1;
}
function J(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e == "object" ? Object.keys(e).length > 0 : !0;
}
function ne(e) {
  return e != null && typeof e == "object" && !Array.isArray(e);
}
function nt(e) {
  return B(e).toLowerCase().replace(/[\s_-]+/g, "");
}
function B(e) {
  return typeof e == "string" ? e.trim() : "";
}
function St(e, n) {
  if (at(e, n))
    return !1;
  const r = ve(e), a = Ne(e), o = pe(n);
  return et({
    items: a,
    mediaCount: r,
    previewMediaURL: o?.url,
    outputMediaURLs: o ? de(e, o.kind).map(
      (c) => c.url
    ) : []
  });
}
function rt(e, n) {
  if (!n)
    return null;
  const r = de(e, n);
  return r.length > 1 ? { kind: n, items: r } : null;
}
function Pt(e) {
  return pe(e)?.kind;
}
function pe(e) {
  if (e?.videoUrl)
    return { kind: "video", url: e.videoUrl };
  if (e?.imageUrl)
    return { kind: "image", url: e.imageUrl };
  if (e?.audioUrl)
    return { kind: "audio", url: e.audioUrl };
}
function at(e, n) {
  const r = re(e, /* @__PURE__ */ new Set(), 0);
  return !r || !n ? !1 : [
    n.imageUrl,
    n.videoUrl,
    n.audioUrl,
    n.fileUrl
  ].some((a) => String(a || "").trim() === r);
}
function re(e, n, r) {
  if (e == null || r > 12)
    return "";
  if (typeof e == "string")
    return e.trim();
  if (Array.isArray(e))
    return e.length === 1 ? re(e[0], n, r + 1) : "";
  if (typeof e != "object" || n.has(e))
    return "";
  n.add(e);
  const o = Object.entries(e).filter(
    ([c, d]) => !["type", "kind", "format", "version"].includes(c) && Ce(d)
  ).map(([, c]) => c);
  return o.length === 1 ? re(o[0], n, r + 1) : "";
}
function me(e, n) {
  const r = Se(n, e), a = Math.max(1, Math.ceil(e / r.capacity)), [o, c] = I(0), d = Pe(o, a);
  return {
    shape: r,
    pageCount: a,
    pageIndex: d,
    pageOffset: d * r.capacity,
    setPageIndex: c
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const ot = j.DropdownMenu, it = j.DropdownMenuContent, st = j.DropdownMenuItem, lt = j.DropdownMenuTrigger, ae = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!ae || Object.keys(ae).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ct = ae.EnergonAudioPlayer, dt = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, ut = {
  image: "张",
  video: "个",
  audio: "个"
};
function fe({
  layout: e,
  countLabel: n,
  pageIndex: r,
  pageCount: a,
  disabled: o = !1,
  leading: c,
  actions: d,
  onLayoutChange: f,
  onPageChange: g
}) {
  const b = ue(e), p = Me(b);
  return /* @__PURE__ */ m("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ m("div", { className: "ws-media-grid-toolbar-main", children: [
      c,
      /* @__PURE__ */ m(ot, { modal: !1, children: [
        /* @__PURE__ */ t(lt, { asChild: !0, children: /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: o || !f,
            "aria-label": "选择每页宫格布局",
            onClick: (s) => s.stopPropagation(),
            children: [
              /* @__PURE__ */ t(Ee, { size: 14 }),
              p.label,
              /* @__PURE__ */ t(Le, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ t(
          it,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (s) => s.stopPropagation(),
            children: Re.map((s) => /* @__PURE__ */ m(
              st,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  g(0), f?.(s.value);
                },
                children: [
                  /* @__PURE__ */ t("span", { children: s.label }),
                  /* @__PURE__ */ t("small", { children: s.value === "auto" ? "按结果排版" : `每页 ${s.capacity} 格` }),
                  s.value === b ? /* @__PURE__ */ t(Ae, { size: 13 }) : null
                ]
              },
              s.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: "ws-media-grid-count", children: n }),
      a > 1 ? /* @__PURE__ */ m("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: r <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (s) => {
              s.stopPropagation(), g(Math.max(0, r - 1));
            },
            children: /* @__PURE__ */ t(Ge, { size: 14 })
          }
        ),
        /* @__PURE__ */ m("span", { children: [
          r + 1,
          "/",
          a
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: r >= a - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (s) => {
              s.stopPropagation(), g(Math.min(a - 1, r + 1));
            },
            children: /* @__PURE__ */ t(je, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    d ? /* @__PURE__ */ t("div", { className: "ws-media-grid-toolbar-actions", children: d }) : null
  ] });
}
function pt({
  kind: e,
  items: n,
  label: r,
  compact: a = !1
}) {
  const [o, c] = I("auto"), d = me(n.length, o), f = a ? xe(n.length) : d.shape, g = a ? 0 : d.pageOffset, b = n.slice(g, g + f.capacity), p = Array.from(
    { length: f.capacity },
    (u, w) => b[w]
  ), s = dt[e], h = ut[e];
  return /* @__PURE__ */ m(
    "section",
    {
      className: `ws-media-grid-view is-${e}${a ? " is-compact" : ""}`,
      children: [
        a ? /* @__PURE__ */ t(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${n.length} ${h}`,
            children: n.length > f.capacity ? `共${n.length}${h}` : `${n.length}${h}`
          }
        ) : /* @__PURE__ */ t(
          fe,
          {
            layout: o,
            countLabel: `${n.length} ${h}`,
            pageIndex: d.pageIndex,
            pageCount: d.pageCount,
            onLayoutChange: c,
            onPageChange: d.setPageIndex
          }
        ),
        /* @__PURE__ */ t("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ t(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${f.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${f.rows}, minmax(0, 1fr))`
            },
            children: p.map((u, w) => {
              const y = g + w, v = `${r || s} ${y + 1}`;
              return u ? /* @__PURE__ */ t(
                "figure",
                {
                  className: e === "audio" ? "is-audio" : void 0,
                  "aria-label": e === "audio" ? v : void 0,
                  children: /* @__PURE__ */ t(mt, { kind: e, item: u, label: v })
                },
                `${u.url}-${y}`
              ) : /* @__PURE__ */ t("figure", { className: "is-empty" }, `empty-${y}`);
            })
          }
        ) })
      ]
    }
  );
}
function mt({
  kind: e,
  item: n,
  label: r
}) {
  const { url: a } = n;
  return e === "image" ? /* @__PURE__ */ t(
    "img",
    {
      src: a,
      alt: r,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : e === "video" ? /* @__PURE__ */ t(
    Ke,
    {
      src: a,
      poster: n.thumbnail,
      draggable: !1,
      ariaLabel: r,
      objectFit: "cover"
    },
    a
  ) : /* @__PURE__ */ m(
    "div",
    {
      className: `ws-media-grid-audio-card${n.thumbnail ? " has-cover" : ""}`,
      children: [
        n.thumbnail ? /* @__PURE__ */ t("img", { src: n.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ t(
          ct,
          {
            src: a,
            preload: "none",
            className: "ws-media-grid-audio-player nodrag nopan"
          }
        )
      ]
    }
  );
}
function ft({
  items: e,
  initialItemID: n,
  onClose: r
}) {
  const a = le(e, n), [o, c] = I(a), d = e.map((b) => `${String(b.id)}:${b.url}`).join(`
`);
  V(() => {
    c(le(e, n));
  }, [n, d]);
  const f = Math.min(
    Math.max(0, o),
    Math.max(0, e.length - 1)
  ), g = e[f];
  return g ? /* @__PURE__ */ t(
    ze,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: r,
      header: /* @__PURE__ */ t(
        ke,
        {
          icon: /* @__PURE__ */ t(Fe, { size: 16 }),
          title: g.name || "图片预览",
          subtitle: `图片 ${f + 1}/${e.length}`,
          downloadUrl: g.url,
          onClose: r
        }
      ),
      children: /* @__PURE__ */ t("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ t(
        Ye,
        {
          kind: "image",
          items: e,
          activeIndex: f,
          onSelect: c
        }
      ) })
    }
  ) : null;
}
function le(e, n) {
  const r = e.findIndex((a) => String(a.id) === String(n));
  return r >= 0 ? r : 0;
}
function ge({
  grid: e,
  variant: n = "compact",
  readonly: r = !0,
  renderFrameAction: a,
  onFrameChange: o,
  onFrameImport: c,
  onEmptyFrameImport: d,
  capacity: f,
  showHeader: g = !0,
  showCaptions: b = !0,
  columns: p,
  rows: s,
  frameOffset: h = 0,
  previewFrames: u
}) {
  const [w, y] = I(
    null
  ), v = be(
    () => (u || e.frames).filter((i) => !!i.image).map((i) => ({
      id: i.id || i.order,
      name: i.title || `画面 ${i.order}`,
      url: i.image,
      thumbnail: i.image
    })),
    [e.frames, u]
  ), T = Math.max(
    e.frames.length,
    Math.trunc(Number(f) || 0)
  ), x = Array.from(
    { length: T },
    (i, D) => e.frames[D]
  ), $ = {
    ...p ? { gridTemplateColumns: `repeat(${p}, minmax(0, 1fr))` } : {},
    ...s ? { gridTemplateRows: `repeat(${s}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ m("section", { className: `ws-storyboard-grid-output is-${n}`, children: [
    g ? /* @__PURE__ */ m("header", { children: [
      /* @__PURE__ */ t("strong", { children: e.title }),
      e.summary ? /* @__PURE__ */ t("p", { children: e.summary }) : null
    ] }) : null,
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": x.length,
        style: $,
        children: x.map((i, D) => {
          const R = h + D;
          return i ? /* @__PURE__ */ m("figure", { className: i.image ? "" : "is-empty", children: [
            i.image ? /* @__PURE__ */ t(
              gt,
              {
                frame: i,
                onPreview: () => y(i.id || i.order)
              },
              `${i.id}:${i.image}`
            ) : c ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${i.order} 格导入图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), c(i, R);
                },
                children: /* @__PURE__ */ t(H, { size: 18 })
              }
            ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-error", children: i.error || "暂无图片" }),
            i.image && c ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${i.order} 格图片`,
                onClick: (N) => {
                  N.preventDefault(), N.stopPropagation(), c(i, R);
                },
                children: /* @__PURE__ */ t(H, { size: 14 })
              }
            ) : null,
            b ? /* @__PURE__ */ m("figcaption", { children: [
              /* @__PURE__ */ t("span", { children: String(i.order).padStart(2, "0") }),
              n === "detail" && !r && o ? /* @__PURE__ */ t(
                "input",
                {
                  value: i.title,
                  "aria-label": `第 ${i.order} 格标题`,
                  onChange: (N) => o(R, { title: N.target.value })
                }
              ) : /* @__PURE__ */ t("strong", { children: i.title })
            ] }) : null,
            n === "detail" ? /* @__PURE__ */ m("div", { className: "ws-storyboard-grid-output-details", children: [
              r || !o ? /* @__PURE__ */ t("p", { children: i.description || "暂无画面说明" }) : /* @__PURE__ */ t(
                "textarea",
                {
                  value: i.description,
                  rows: 3,
                  "aria-label": `第 ${i.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (N) => o(R, {
                    description: N.target.value
                  })
                }
              ),
              a ? /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-actions", children: a(i, R) }) : null
            ] }) : null
          ] }, i.id) : /* @__PURE__ */ t("figure", { className: "is-empty", children: d ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${R + 1} 格导入图片`,
              onClick: (N) => {
                N.preventDefault(), N.stopPropagation(), d(R);
              },
              children: /* @__PURE__ */ t(H, { size: 18 })
            }
          ) : null }, `empty-${R}`);
        })
      }
    ),
    w != null && v.length > 0 ? /* @__PURE__ */ t(
      ft,
      {
        items: v,
        initialItemID: w,
        onClose: () => y(null)
      }
    ) : null
  ] });
}
function gt({
  frame: e,
  onPreview: n
}) {
  const [r, a] = I(!1);
  return r ? /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-output-error", children: e.error || "图片加载失败" }) : /* @__PURE__ */ t(
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
          onError: () => a(!0)
        }
      )
    }
  );
}
function xt({
  grid: e,
  aspectRatio: n,
  running: r = !1,
  onImport: a,
  onFrameImport: o,
  onSlotImport: c,
  onEdit: d,
  layout: f = "auto",
  onLayoutChange: g
}) {
  const b = ue(f), p = e?.frames.length || 0, s = me(p, b), h = e ? {
    ...e,
    frames: e.frames.slice(
      s.pageOffset,
      s.pageOffset + s.shape.capacity
    )
  } : null, u = e?.frames.filter((y) => y.image).length || 0, w = p > 0 && u !== p ? `${u}/${p} 张` : `${p} 张`;
  return /* @__PURE__ */ m(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ t(
          fe,
          {
            layout: b,
            countLabel: w,
            pageIndex: s.pageIndex,
            pageCount: s.pageCount,
            disabled: r || !g,
            leading: /* @__PURE__ */ m("span", { children: [
              "比例 ",
              n || "自动"
            ] }),
            actions: a || e && d ? /* @__PURE__ */ m(ce, { children: [
              a ? /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: r,
                  onClick: (y) => {
                    y.stopPropagation(), a();
                  },
                  children: [
                    /* @__PURE__ */ t(H, { size: 14 }),
                    /* @__PURE__ */ t("span", { children: e ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              e && d ? /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: r,
                  onClick: (y) => {
                    y.stopPropagation(), d();
                  },
                  children: [
                    /* @__PURE__ */ t(Ue, { size: 14 }),
                    /* @__PURE__ */ t("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: g,
            onPageChange: s.setPageIndex
          }
        ),
        /* @__PURE__ */ t("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: h ? /* @__PURE__ */ t(
          ge,
          {
            grid: h,
            previewFrames: e?.frames,
            capacity: s.shape.capacity,
            columns: s.shape.columns,
            rows: s.shape.rows,
            frameOffset: s.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: r ? void 0 : o,
            onEmptyFrameImport: r ? void 0 : c
          }
        ) : /* @__PURE__ */ t(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": r,
            style: {
              gridTemplateColumns: `repeat(${s.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${s.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: s.shape.capacity }, (y, v) => /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: r || !c,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${v + 1} 格`,
                onClick: (T) => {
                  T.stopPropagation(), c?.(v);
                },
                children: /* @__PURE__ */ t(H, { size: 18 })
              },
              v
            ))
          }
        ) })
      ]
    }
  );
}
const ht = ye(
  () => import("./space-storyboard-view-D4elHahc.js").then((e) => ({
    default: e.StoryboardView
  }))
);
function Mt({
  output: e,
  fallback: n = "",
  streaming: r = !1,
  emptyText: a = "暂无内容",
  className: o,
  markdownClassName: c,
  richClassName: d,
  mediaLayout: f = "default",
  mediaGridKind: g,
  compactMediaGrid: b = !1,
  storyboardEditable: p = !1,
  storyboardDisabled: s = !1,
  onStoryboardSave: h
}) {
  const u = De(e, n), w = Te(u), y = Ie(u);
  if (y)
    return /* @__PURE__ */ t(Z, { className: o, children: /* @__PURE__ */ t(ge, { grid: y }) });
  if (w)
    return /* @__PURE__ */ t(Z, { className: o, children: /* @__PURE__ */ t(we, { fallback: /* @__PURE__ */ t("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ t(
      ht,
      {
        storyboard: w,
        editable: p,
        disabled: s,
        onSave: h
      }
    ) }) });
  const v = rt(u, g);
  return v ? /* @__PURE__ */ t(
    Z,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ t(
        pt,
        {
          kind: v.kind,
          items: v.items,
          label: n,
          compact: b
        }
      )
    }
  ) : /* @__PURE__ */ t(
    $e,
    {
      output: u,
      fallback: n,
      streaming: r,
      emptyText: a,
      className: o,
      markdownClassName: c,
      richClassName: d,
      mediaLayout: f
    }
  );
}
function Rt({
  value: e,
  resetKey: n,
  fingerprint: r,
  save: a,
  onError: o,
  autoSave: c = !0,
  debounceMs: d = 1200
}) {
  const [f, g] = I(e), [b, p] = I("saved"), s = P(e), h = P(e), u = P(r), w = P(a), y = P(o), v = P(c), T = P(r(e)), x = P(0), $ = P(0), i = P(null), D = P(null), R = P(async () => !1), N = P(null), k = P(!1), z = P(!0), C = L(() => {
    i.current !== null && (window.clearTimeout(i.current), i.current = null);
  }, []), M = L(
    async (S, l = !1, _) => {
      C();
      const O = $.current;
      for (; z.current && O === $.current; ) {
        if (D.current && (!await D.current || O !== $.current))
          return !1;
        if (!l && S !== void 0 && S !== x.current)
          return !0;
        const E = h.current, A = u.current(E);
        if (A === T.current)
          return k.current = !1, z.current && p("saved"), !0;
        const oe = x.current;
        z.current && p("saving");
        const ie = _ || w.current, X = ie(E).then(() => {
          if (!z.current || O !== $.current)
            return !1;
          T.current = A, k.current = !1, N.current = null;
          const G = u.current(h.current);
          return p(
            G === A ? "saved" : "dirty"
          ), !0;
        }).catch((G) => (z.current && O === $.current && (C(), k.current = !0, N.current = ie, p("error"), y.current?.(G)), !1));
        D.current = X;
        const he = await X;
        if (D.current === X && (D.current = null), !he) return !1;
        if (!l && oe !== x.current && i.current === null && !k.current) {
          const G = x.current;
          i.current = window.setTimeout(() => {
            i.current = null, R.current(G);
          }, d);
        }
        if (!l || oe === x.current)
          return !0;
      }
      return !1;
    },
    [C, d]
  ), q = L(
    (S) => {
      C(), !(!v.current || k.current) && (i.current = window.setTimeout(() => {
        i.current = null, M(S);
      }, d));
    },
    [C, d, M]
  ), K = L(
    (S) => {
      const l = typeof S == "function" ? S(h.current) : S, _ = u.current(l);
      if (h.current = l, g(l), x.current += 1, _ === T.current) {
        C(), k.current = !1, p("saved");
        return;
      }
      if (k.current) {
        p("error");
        return;
      }
      p("dirty"), q(x.current);
    },
    [C, q]
  ), F = L(() => {
    const S = s.current;
    $.current += 1, x.current = 0, h.current = S, T.current = u.current(S), k.current = !1, N.current = null, D.current = null, C(), g(S), p("saved");
  }, [C]), Q = L(() => M(void 0, !0), [M]), U = L(
    (S) => M(void 0, !0, S),
    [M]
  ), Y = L(async () => (k.current = !1, M(void 0, !0, N.current || w.current)), [M]);
  return V(() => {
    s.current = e, u.current = r, w.current = a, y.current = o, v.current = c, R.current = M;
  }, [c, r, o, M, a, e]), V(() => F(), [F, n]), V(() => (z.current = !0, () => {
    z.current = !1, $.current += 1, C();
  }), [C]), {
    draft: f,
    status: b,
    setDraft: K,
    reset: F,
    flush: Q,
    flushWith: U,
    retry: Y,
    hasPendingChanges: b !== "saved"
  };
}
function Dt({
  status: e,
  hasPendingChanges: n,
  onReset: r,
  onSaveAsNewVersion: a,
  onSave: o
}) {
  const c = e === "saving", d = c || !n;
  return /* @__PURE__ */ m(ce, { children: [
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: d,
        onClick: r,
        children: [
          /* @__PURE__ */ t(Ve, { size: 13 }),
          /* @__PURE__ */ t("span", { children: "取消修改" })
        ]
      }
    ),
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: d,
        onClick: a,
        children: [
          /* @__PURE__ */ t(He, { size: 13 }),
          /* @__PURE__ */ t("span", { children: "保存为新版本" })
        ]
      }
    ),
    /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: d,
        onClick: o,
        children: [
          c ? /* @__PURE__ */ t(ee, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ t(Be, { size: 13 }),
          /* @__PURE__ */ t("span", { children: c ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
export {
  Mt as C,
  Ke as P,
  ge as S,
  Dt as T,
  Pt as a,
  rt as b,
  St as c,
  xt as d,
  se as i,
  Rt as u
};
