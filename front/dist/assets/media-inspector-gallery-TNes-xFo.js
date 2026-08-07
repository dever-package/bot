import { g as w, e as y, c as b, b as I } from "./runtime-entry-ClkZDmNs.js";
import { c as j, a as c, j as r } from "./createLucideIcon-fWv1XcFy.js";
import { D as N, F as g, V as M, I as k } from "./first-frame-video-DlIx6mwp.js";
import { F as f } from "./file-text-GWInsYzS.js";
import { m as $ } from "./content-view-BXwDWBA5.js";
const E = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["path", { d: "m9 9 12-2", key: "1e64n2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
], F = j("music-4", E), h = w("@/page/nodes/show/tooltip");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const S = $.EnergonAudioPlayer;
function _({
  kind: t,
  urls: e,
  zoom: a = 1,
  compact: i = !1,
  downloadable: n = !1,
  className: o = ""
}) {
  const [l, d] = I(0), s = e.join(`
`);
  b(() => {
    d(0);
  }, [s]);
  const p = e.map((u, v) => ({
    id: u,
    name: C(u, t, v),
    url: u
  }));
  return p.length === 0 ? null : /* @__PURE__ */ r(
    V,
    {
      kind: t,
      items: p,
      activeIndex: Math.min(l, p.length - 1),
      zoom: a,
      compact: i,
      downloadable: n,
      className: o,
      onSelect: d
    }
  );
}
function V({
  kind: t,
  items: e,
  activeIndex: a,
  zoom: i = 1,
  compact: n = !1,
  downloadable: o = !1,
  className: l = "",
  onSelect: d
}) {
  const s = e[a] || e[0];
  return s ? /* @__PURE__ */ c(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        n ? "is-compact" : "",
        l
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ r("style", { children: z }),
        /* @__PURE__ */ r(
          R,
          {
            kind: t,
            item: s,
            zoom: i,
            downloadable: o
          }
        ),
        e.length > 1 ? /* @__PURE__ */ r(
          A,
          {
            kind: t,
            items: e,
            activeIndex: a,
            onSelect: d
          }
        ) : null
      ]
    }
  ) : null;
}
function R({
  kind: t,
  item: e,
  zoom: a,
  downloadable: i
}) {
  return /* @__PURE__ */ c("div", { className: "bot-media-inspector-stage", children: [
    i && e.url ? /* @__PURE__ */ r(
      "a",
      {
        className: "bot-media-inspector-download",
        href: e.url,
        download: !0,
        title: "下载当前素材",
        "aria-label": "下载当前素材",
        children: /* @__PURE__ */ r(N, { "aria-hidden": "true" })
      }
    ) : null,
    t === "image" ? e.url ? /* @__PURE__ */ r(
      "img",
      {
        src: e.url,
        alt: e.name,
        draggable: !1,
        style: { transform: `scale(${a})` }
      },
      e.url
    ) : /* @__PURE__ */ r(m, { kind: t }) : null,
    t === "video" ? e.url ? /* @__PURE__ */ r(
      g,
      {
        src: e.url,
        poster: e.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: "metadata"
      },
      e.url
    ) : /* @__PURE__ */ r(m, { kind: t }) : null,
    t === "audio" ? e.url ? /* @__PURE__ */ r(
      S,
      {
        src: e.url,
        detailed: !0,
        className: "bot-media-inspector-audio"
      },
      e.url
    ) : /* @__PURE__ */ r(m, { kind: t }) : null,
    t === "file" ? /* @__PURE__ */ c("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ r(f, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("strong", { children: e.name })
    ] }) : null
  ] });
}
function A({
  kind: t,
  items: e,
  activeIndex: a,
  onSelect: i
}) {
  const n = y(null);
  return b(() => {
    n.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [a]), /* @__PURE__ */ r("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ r("div", { className: "bot-media-inspector-list", children: e.map((o, l) => /* @__PURE__ */ r(
    "button",
    {
      ref: l === a ? n : void 0,
      type: "button",
      title: o.name,
      "aria-label": `查看第 ${l + 1} 个素材`,
      "aria-current": l === a ? "true" : void 0,
      onClick: () => i(l),
      children: t === "video" && o.url ? /* @__PURE__ */ r(
        g,
        {
          src: o.url,
          poster: o.thumbnail,
          muted: !0,
          playsInline: !0,
          preload: "metadata",
          draggable: !1,
          "aria-hidden": "true"
        },
        o.url
      ) : t === "image" && o.url || o.thumbnail ? /* @__PURE__ */ r("img", { src: o.thumbnail || o.url, alt: "" }) : /* @__PURE__ */ r(x, { kind: t })
    },
    `${String(o.id)}-${l}`
  )) }) });
}
function m({ kind: t }) {
  return /* @__PURE__ */ c("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ r(x, { kind: t }),
    /* @__PURE__ */ r("span", { children: "当前素材无法在线预览" })
  ] });
}
function x({ kind: t }) {
  const e = P[t];
  return /* @__PURE__ */ r(e, { "aria-hidden": "true" });
}
function C(t, e, a) {
  const i = t.split(/[?#]/, 1)[0], n = i.slice(i.lastIndexOf("/") + 1);
  if (n)
    try {
      return decodeURIComponent(n);
    } catch {
      return n;
    }
  return `${K[e]} ${a + 1}`;
}
const K = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件"
}, P = {
  image: k,
  video: M,
  audio: F,
  file: f
}, z = `
.bot-media-inspector-gallery {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.bot-media-inspector-gallery.is-compact {
  height: auto;
  flex: 0 0 auto;
}

.bot-media-inspector-stage {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.2));
  padding: 16px;
}

.bot-media-inspector-gallery.is-compact .bot-media-inspector-stage {
  min-height: 224px;
  padding: 32px 24px;
}

.bot-media-inspector-download {
  position: absolute;
  z-index: 2;
  top: 12px;
  right: 12px;
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--wb-detail-line, hsl(var(--border)));
  border-radius: 5px;
  background: var(--wb-detail-surface, hsl(var(--background)));
  color: var(--wb-detail-text, hsl(var(--foreground)));
  box-shadow: 0 2px 8px hsl(var(--foreground) / 0.08);
  transition: background-color 150ms ease, border-color 150ms ease;
}

.bot-media-inspector-download:hover {
  border-color: color-mix(
    in srgb,
    var(--wb-detail-text, hsl(var(--foreground))) 40%,
    var(--wb-detail-line, hsl(var(--border)))
  );
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.3));
}

.bot-media-inspector-download > svg {
  width: 17px;
  height: 17px;
}

.bot-media-inspector-stage > img,
.bot-media-inspector-stage > video {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bot-media-inspector-stage > img {
  user-select: none;
  transition: transform 150ms ease;
}

.bot-media-inspector-stage > video {
  background: #000;
}

.bot-media-inspector-audio {
  width: min(768px, 100%);
}

.bot-media-inspector-file,
.bot-media-inspector-empty {
  display: flex;
  max-width: 420px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  text-align: center;
}

.bot-media-inspector-file svg,
.bot-media-inspector-empty svg {
  width: 40px;
  height: 40px;
}

.bot-media-inspector-file strong {
  color: var(--wb-detail-text, hsl(var(--foreground)));
  font-size: 14px;
  overflow-wrap: anywhere;
}

.bot-media-inspector-rail {
  display: flex;
  height: 80px;
  flex: 0 0 80px;
  border-top: 1px solid var(--wb-detail-line, hsl(var(--border)));
  background: var(--wb-detail-surface, hsl(var(--background)));
  padding: 8px 12px;
}

.bot-media-inspector-list {
  display: flex;
  min-width: 0;
  flex: 1;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.bot-media-inspector-list > button {
  display: flex;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--wb-detail-line, hsl(var(--border)));
  border-radius: 5px;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.3));
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  padding: 0;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.bot-media-inspector-list > button:hover {
  border-color: color-mix(
    in srgb,
    var(--wb-detail-text, hsl(var(--foreground))) 40%,
    var(--wb-detail-line, hsl(var(--border)))
  );
}

.bot-media-inspector-list > button[aria-current="true"] {
  border-color: var(--wb-detail-text, hsl(var(--foreground)));
  box-shadow: 0 0 0 1px var(--wb-detail-text, hsl(var(--foreground)));
}

.bot-media-inspector-list > button :where(img, video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-media-inspector-list > button video {
  background: #000;
  pointer-events: none;
}

.bot-media-inspector-list > button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .bot-media-inspector-gallery {
    flex-direction: row;
  }

  .bot-media-inspector-rail {
    width: 92px;
    height: 100%;
    flex: 0 0 92px;
    border-top: 0;
    border-left: 1px solid var(--wb-detail-line, hsl(var(--border)));
    padding: 12px 10px;
  }

  .bot-media-inspector-list {
    display: grid;
    width: 100%;
    max-height: 100%;
    flex: none;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: 70px;
    gap: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 2px;
  }

  .bot-media-inspector-list > button {
    width: 100%;
    height: 70px;
    min-height: 70px;
    flex: none;
  }
}
`;
export {
  _ as M,
  V as a,
  F as b,
  h as m
};
