import { c as u, a as n, j as t } from "./createLucideIcon-CEtb6KSk.js";
import { a as h, b } from "./runtime-entry-CIrzyMsA.js";
import { F as p } from "./file-text-CclNuHuN.js";
import { I as g } from "./image-BBD2HfB8.js";
import { V as f } from "./video-BAp8-tqb.js";
import { m as x } from "./content-view-DmJsJzkL.js";
const v = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["path", { d: "m9 9 12-2", key: "1e64n2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
], w = u("music-4", v), y = x.EnergonAudioPlayer;
function S({
  kind: i,
  items: e,
  activeIndex: r,
  zoom: s = 1,
  compact: l = !1,
  className: o = "",
  onSelect: a
}) {
  const c = e[r] || e[0];
  return c ? /* @__PURE__ */ n(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        l ? "is-compact" : "",
        o
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ t("style", { children: M }),
        /* @__PURE__ */ t(j, { kind: i, item: c, zoom: s }),
        e.length > 1 ? /* @__PURE__ */ t(
          I,
          {
            kind: i,
            items: e,
            activeIndex: r,
            onSelect: a
          }
        ) : null
      ]
    }
  ) : null;
}
function j({
  kind: i,
  item: e,
  zoom: r
}) {
  return /* @__PURE__ */ n("div", { className: "bot-media-inspector-stage", children: [
    i === "image" ? e.url ? /* @__PURE__ */ t(
      "img",
      {
        src: e.url,
        alt: e.name,
        draggable: !1,
        style: { transform: `scale(${r})` }
      },
      e.url
    ) : /* @__PURE__ */ t(d, { kind: i }) : null,
    i === "video" ? e.url ? /* @__PURE__ */ t(
      "video",
      {
        src: e.url,
        poster: e.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: "metadata"
      },
      e.url
    ) : /* @__PURE__ */ t(d, { kind: i }) : null,
    i === "audio" ? e.url ? /* @__PURE__ */ t(
      y,
      {
        src: e.url,
        detailed: !0,
        className: "bot-media-inspector-audio"
      },
      e.url
    ) : /* @__PURE__ */ t(d, { kind: i }) : null,
    i === "file" ? /* @__PURE__ */ n("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ t(p, { "aria-hidden": "true" }),
      /* @__PURE__ */ t("strong", { children: e.name })
    ] }) : null
  ] });
}
function I({
  kind: i,
  items: e,
  activeIndex: r,
  onSelect: s
}) {
  const l = h(null);
  return b(() => {
    l.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [r]), /* @__PURE__ */ t("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ t("div", { className: "bot-media-inspector-list", children: e.map((o, a) => /* @__PURE__ */ t(
    "button",
    {
      ref: a === r ? l : void 0,
      type: "button",
      title: o.name,
      "aria-label": `查看第 ${a + 1} 个素材`,
      "aria-current": a === r ? "true" : void 0,
      onClick: () => s(a),
      children: i === "image" && o.url || o.thumbnail ? /* @__PURE__ */ t("img", { src: o.thumbnail || o.url, alt: "" }) : /* @__PURE__ */ t(m, { kind: i })
    },
    `${String(o.id)}-${a}`
  )) }) });
}
function d({ kind: i }) {
  return /* @__PURE__ */ n("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ t(m, { kind: i }),
    /* @__PURE__ */ t("span", { children: "当前素材无法在线预览" })
  ] });
}
function m({ kind: i }) {
  const e = N[i];
  return /* @__PURE__ */ t(e, { "aria-hidden": "true" });
}
const N = {
  image: g,
  video: f,
  audio: w,
  file: p
}, M = `
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

.bot-media-inspector-list > button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  S as M,
  w as a
};
