import { j as o, a as F } from "./preloadable-Bomi5PEU.js";
import { d as re, a as h, b as M } from "./_commonjsHelpers-61wyk6v6.js";
import { L as pe, D as he, b as ne, a1 as ve, a2 as we, a3 as be } from "./vendor-icons-B3DKX3la.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./media-inspector-gallery-CbGNTMFV.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const z = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!z || Object.keys(z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const ge = z.FirstFrameVideo, q = 0.01, Ee = 2, Re = 48, Ce = 160, ye = 1e4, L = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Set(), oe = /* @__PURE__ */ new Set(), N = [];
let H = 0;
function Le({
  src: e,
  poster: t = "",
  alt: r = "",
  className: i,
  style: a,
  title: n,
  draggable: s = !1,
  ariaLabel: l,
  ariaHidden: u,
  onLoad: m,
  onError: v,
  onMediaSize: w
}) {
  const p = re(null), [d, b] = h(!1), [_, S] = h(""), [A, f] = h(""), [C, y] = h(), [j, U] = h(""), [D, Z] = h(""), [le, ce] = h(""), [ue, me] = h(""), g = t.trim() || Fe(e), $ = !g || _ === g || J.has(g), E = C?.src === e ? C.result : void 0, R = j === e;
  M(() => {
    if (!E || R || typeof window > "u" || typeof window.URL?.createObjectURL != "function") {
      Z("");
      return;
    }
    const c = window.URL.createObjectURL(E.blob);
    return Z(c), () => {
      typeof window.URL?.revokeObjectURL == "function" && window.URL.revokeObjectURL(c);
    };
  }, [R, E]), M(() => {
    if (R) {
      b(!0);
      return;
    }
    const c = p.current;
    if (!c || typeof IntersectionObserver > "u") {
      b(!0);
      return;
    }
    const T = new IntersectionObserver(
      (P) => {
        const Y = P.find((fe) => fe.target === c);
        Y && b(Y.isIntersecting);
      },
      { rootMargin: "80px 0px" }
    );
    return T.observe(c), () => T.disconnect();
  }, [R, e]), M(() => {
    if (!d || !$ || E || R || !e)
      return;
    let c = !1;
    const T = Me(e);
    return T.promise.then(
      (P) => {
        c || y({ src: e, result: P });
      },
      () => {
        c || U(e);
      }
    ), () => {
      c = !0, T.release();
    };
  }, [d, R, E, $, e]);
  const O = {
    ref: p,
    alt: r,
    className: i,
    style: a,
    title: n,
    draggable: s,
    "aria-label": l,
    "aria-hidden": u ? !0 : void 0
  };
  return d ? $ ? E && D && !R ? /* @__PURE__ */ o(
    "img",
    {
      ...O,
      src: D,
      style: I(a, le === D),
      decoding: "async",
      onLoad: () => {
        ce(D), w?.(E.width, E.height), m?.();
      },
      onError: () => U(e)
    }
  ) : R ? /* @__PURE__ */ o(
    ge,
    {
      src: e,
      className: i,
      style: I(a, ue === e),
      title: n,
      muted: !0,
      playsInline: !0,
      preload: "metadata",
      draggable: s,
      "aria-label": l,
      "aria-hidden": u ? !0 : void 0,
      onLoadedMetadata: (c) => w?.(
        c.currentTarget.videoWidth,
        c.currentTarget.videoHeight
      ),
      onFirstFrameReady: () => {
        me(e), m?.();
      },
      onError: v
    }
  ) : /* @__PURE__ */ o("img", { ...O, style: I(a, !1) }) : /* @__PURE__ */ o(
    "img",
    {
      ...O,
      src: g,
      style: I(a, A === g),
      loading: "lazy",
      decoding: "async",
      onLoad: (c) => {
        f(g), w?.(
          c.currentTarget.naturalWidth,
          c.currentTarget.naturalHeight
        ), m?.();
      },
      onError: () => {
        ie(J, g), S(g);
      }
    }
  ) : /* @__PURE__ */ o("img", { ...O, style: I(a, !1) });
}
function Fe(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  try {
    const r = new URL(t);
    return r.protocol !== "http:" && r.protocol !== "https:" ? "" : r.search.includes("vframe/") ? t : "";
  } catch {
    return "";
  }
}
function I(e, t) {
  return t ? e : { ...e, visibility: "hidden" };
}
function Me(e) {
  const t = L.get(e);
  if (t)
    return ae(e, t), { promise: Promise.resolve(t), release: () => {
    } };
  if (oe.has(e))
    return {
      promise: Promise.reject(new Error("视频首帧无法缓存")),
      release: () => {
      }
    };
  let r = x.get(e);
  if (!r) {
    let a, n;
    const s = new Promise((l, u) => {
      a = l, n = u;
    });
    r = {
      src: e,
      consumers: 0,
      state: "queued",
      promise: s,
      resolve: a,
      reject: n
    }, x.set(e, r), N.push(r);
  }
  r.consumers += 1, Q();
  let i = !1;
  return {
    promise: r.promise,
    release: () => {
      i || (i = !0, Ue(r));
    }
  };
}
function Ue(e) {
  if (e.consumers = Math.max(0, e.consumers - 1), e.consumers > 0 || e.state === "settled")
    return;
  if (e.state === "active") {
    const r = e.cancelCapture;
    V(e), e.reject(B()), r?.();
    return;
  }
  const t = N.indexOf(e);
  t >= 0 && N.splice(t, 1), V(e), e.reject(B()), Q();
}
function Q() {
  for (; H < Ee && N.length > 0; ) {
    const e = N.shift();
    if (!e) return;
    if (e.state !== "queued" || e.consumers === 0)
      continue;
    e.state = "active", H += 1;
    const t = Te(e.src);
    e.cancelCapture = t.cancel, t.promise.then((r) => {
      e.state !== "settled" && (ae(e.src, r), V(e), e.resolve(r));
    }).catch((r) => {
      if (e.state === "settled") return;
      const i = r instanceof Error ? r : new Error("视频首帧提取失败");
      i.name !== "AbortError" && ie(oe, e.src), V(e), e.reject(i);
    }).finally(() => {
      H -= 1, Q();
    });
  }
}
function V(e) {
  e.state = "settled", e.cancelCapture = void 0, x.get(e.src) === e && x.delete(e.src);
}
function B() {
  const e = new Error("视频首帧提取已取消");
  return e.name = "AbortError", e;
}
function ae(e, t) {
  for (L.delete(e), L.set(e, t); L.size > Re; ) {
    const r = L.keys().next().value;
    if (!r) return;
    L.delete(r);
  }
}
function ie(e, t) {
  for (e.delete(t), e.add(t); e.size > Ce; ) {
    const r = e.values().next().value;
    if (!r) return;
    e.delete(r);
  }
}
function Te(e) {
  let t = () => {
  };
  return { promise: new Promise((i, a) => {
    if (typeof document > "u") {
      a(new Error("当前环境无法提取视频首帧"));
      return;
    }
    const n = document.createElement("video");
    let s = !1, l = !1, u = !1, m = q, v = 0;
    const w = () => {
      window.clearTimeout(v), n.removeEventListener("error", b), n.removeEventListener("loadeddata", _), n.removeEventListener("seeked", S), n.removeEventListener("loadedmetadata", A), n.pause(), n.removeAttribute("src"), n.load();
    }, p = (f) => {
      s || (s = !0, w(), a(f));
    }, d = () => {
      if (!(s || l || n.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || n.videoWidth <= 0 || n.videoHeight <= 0)) {
        l = !0;
        try {
          const f = Math.min(640, n.videoWidth), C = Math.max(
            1,
            Math.round(n.videoHeight / n.videoWidth * f)
          ), y = document.createElement("canvas");
          y.width = f, y.height = C;
          const j = y.getContext("2d");
          if (!j) {
            p(new Error("浏览器无法创建首帧画布"));
            return;
          }
          j.drawImage(n, 0, 0, f, C), y.toBlob(
            (U) => {
              if (!s) {
                if (!U) {
                  p(new Error("浏览器无法编码视频首帧"));
                  return;
                }
                s = !0, w(), i({ blob: U, width: f, height: C });
              }
            },
            "image/jpeg",
            0.82
          );
        } catch (f) {
          p(f instanceof Error ? f : new Error("视频首帧提取失败"));
        }
      }
    }, b = () => p(new Error("视频首帧加载失败")), _ = () => {
      (!u || Math.abs(n.currentTime - m) < 1e-3) && d();
    }, S = () => d(), A = () => {
      const f = n.duration;
      m = Number.isFinite(f) && f > 0 ? Math.min(q, f / 2) : q;
      try {
        u = !0, n.currentTime = m;
      } catch {
        u = !1, d();
      }
    };
    t = () => p(B()), v = window.setTimeout(
      () => p(new Error("视频首帧提取超时")),
      ye
    ), n.crossOrigin = "anonymous", n.muted = !0, n.playsInline = !0, n.preload = "metadata", n.addEventListener("error", b), n.addEventListener("loadeddata", _), n.addEventListener("seeked", S), n.addEventListener("loadedmetadata", A), n.src = e, n.load();
  }), cancel: () => t() };
}
function se(e, t = "") {
  if (!e || /^(?:data|blob):/i.test(e)) return t;
  let r = e.split(/[?#]/, 1)[0];
  try {
    r = new URL(e, "http://resource.local").pathname;
  } catch {
  }
  const i = r.slice(r.lastIndexOf("/") + 1);
  if (!i) return t;
  try {
    return decodeURIComponent(i) || t;
  } catch {
    return i;
  }
}
function Ie(e, t) {
  const r = k(t || ""), i = k(se(e));
  if (ee(r)) return r;
  const a = ee(i);
  return r ? `${r}${a}` : i || "file";
}
function k(e) {
  return e.trim().replace(/[\\/:*?"<>|]+/g, "-");
}
function ee(e) {
  return e.match(/\.[a-z0-9]{1,12}$/i)?.[0] || "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/upload"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const { downloadUploadFile: te } = K;
function Ne({
  url: e,
  name: t,
  label: r = "下载内容",
  className: i = "",
  iconSize: a = 17
}) {
  const [n, s] = h(
    "idle"
  );
  M(() => s("idle"), [t, e]);
  const l = n === "downloading", u = n === "error" ? "下载失败，请重试" : r;
  async function m() {
    if (!(!e || l)) {
      s("downloading");
      try {
        if (typeof te != "function")
          throw new Error("当前页面未提供下载能力");
        await te({
          name: Ie(e, t),
          url: e,
          download: e
        }), s("idle");
      } catch (v) {
        console.error("[resource-download] 下载失败", v), s("error");
      }
    }
  }
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: i,
      disabled: l,
      "aria-busy": l || void 0,
      "aria-label": u,
      title: u,
      onClick: () => {
        m();
      },
      children: l ? /* @__PURE__ */ o(pe, { size: a, className: "animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ o(he, { size: a, "aria-hidden": "true" })
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/components/media/first-frame-video"]);
const X = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!X || Object.keys(X).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const _e = X.EnergonAudioPlayer, G = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!G || Object.keys(G).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Se = G.FirstFrameVideo;
function qe({
  kind: e,
  urls: t = [],
  mediaItems: r,
  zoom: i = 1,
  compact: a = !1,
  downloadable: n = !1,
  className: s = "",
  supplementalText: l
}) {
  const [u, m] = h(0), v = r && r.length > 0 ? r : t.map((d) => ({ url: d })), w = v.map((d) => `${d.url}
${d.thumbnail || ""}`).join(`
`);
  M(() => {
    m(0);
  }, [w]);
  const p = v.map((d, b) => ({
    id: d.url,
    name: se(
      d.url,
      `${Oe[e]} ${b + 1}`
    ),
    url: d.url,
    thumbnail: d.thumbnail
  }));
  return p.length === 0 ? null : /* @__PURE__ */ o(
    Ae,
    {
      kind: e,
      items: p,
      activeIndex: Math.min(u, p.length - 1),
      zoom: i,
      compact: a,
      downloadable: n,
      className: s,
      supplementalText: l,
      onSelect: m
    }
  );
}
function Ae({
  kind: e,
  items: t,
  activeIndex: r,
  zoom: i = 1,
  compact: a = !1,
  downloadable: n = !1,
  className: s = "",
  supplementalText: l,
  onSelect: u
}) {
  const m = t[r] || t[0];
  return m ? /* @__PURE__ */ F(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        a ? "is-compact" : "",
        s
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ o(
          je,
          {
            kind: e,
            item: m,
            zoom: i,
            downloadable: n,
            supplementalText: l
          }
        ),
        t.length > 1 ? /* @__PURE__ */ o(
          De,
          {
            kind: e,
            items: t,
            activeIndex: r,
            onSelect: u
          }
        ) : null
      ]
    }
  ) : null;
}
function je({
  kind: e,
  item: t,
  zoom: r,
  downloadable: i,
  supplementalText: a
}) {
  return /* @__PURE__ */ F("div", { className: "bot-media-inspector-stage", children: [
    i && t.url ? /* @__PURE__ */ o(
      Ne,
      {
        className: "bot-media-inspector-download",
        url: t.url,
        name: t.name,
        label: "下载当前素材"
      }
    ) : null,
    e === "image" ? t.url ? /* @__PURE__ */ o(
      "img",
      {
        src: t.url,
        alt: t.name,
        draggable: !1,
        style: { transform: `scale(${r})` }
      },
      t.url
    ) : /* @__PURE__ */ o(W, { kind: e }) : null,
    e === "video" ? t.url ? /* @__PURE__ */ o(
      Se,
      {
        src: t.url,
        poster: t.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: t.thumbnail ? "none" : "metadata"
      },
      t.url
    ) : /* @__PURE__ */ o(W, { kind: e }) : null,
    e === "audio" ? t.url ? /* @__PURE__ */ F("div", { className: "bot-media-inspector-audio-content", children: [
      t.thumbnail ? /* @__PURE__ */ o(
        "img",
        {
          className: "bot-media-inspector-audio-cover",
          src: t.thumbnail,
          alt: t.name,
          draggable: !1
        },
        t.thumbnail
      ) : null,
      /* @__PURE__ */ o(
        _e,
        {
          src: t.url,
          detailed: !0,
          preload: "none",
          className: "bot-media-inspector-audio"
        },
        t.url
      ),
      a?.text ? /* @__PURE__ */ F("section", { className: "bot-media-inspector-audio-text", children: [
        /* @__PURE__ */ o("strong", { children: a.label }),
        /* @__PURE__ */ o("p", { children: a.text })
      ] }) : null
    ] }) : /* @__PURE__ */ o(W, { kind: e }) : null,
    e === "file" ? /* @__PURE__ */ F("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ o(ne, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("strong", { children: t.name })
    ] }) : null
  ] });
}
function De({
  kind: e,
  items: t,
  activeIndex: r,
  onSelect: i
}) {
  const a = re(null);
  return M(() => {
    a.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [r]), /* @__PURE__ */ o("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ o("div", { className: "bot-media-inspector-list", children: t.map((n, s) => /* @__PURE__ */ o(
    "button",
    {
      ref: s === r ? a : void 0,
      type: "button",
      title: n.name,
      "aria-label": `查看第 ${s + 1} 个素材`,
      "aria-current": s === r ? "true" : void 0,
      onClick: () => i(s),
      children: e === "video" && n.url ? /* @__PURE__ */ o(
        Le,
        {
          src: n.url,
          poster: n.thumbnail,
          draggable: !1,
          ariaHidden: !0
        },
        n.url
      ) : e === "image" && n.url || n.thumbnail ? /* @__PURE__ */ o("img", { src: n.thumbnail || n.url, alt: "" }) : /* @__PURE__ */ o(de, { kind: e })
    },
    `${String(n.id)}-${s}`
  )) }) });
}
function W({ kind: e }) {
  return /* @__PURE__ */ F("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ o(de, { kind: e }),
    /* @__PURE__ */ o("span", { children: "当前素材无法在线预览" })
  ] });
}
function de({ kind: e }) {
  const t = xe[e];
  return /* @__PURE__ */ o(t, { "aria-hidden": "true" });
}
const Oe = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件"
}, xe = {
  image: be,
  video: we,
  audio: ve,
  file: ne
};
export {
  qe as M,
  Ne as R,
  Le as V,
  Ae as a,
  se as r
};
