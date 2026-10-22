import { j as o, a as U } from "./react-D9GkiX5b.js";
import { a as h, b as le, d as T } from "./file-kind-D6bMOzYN.js";
import { r as ge, D as be, b as de, a5 as Ee, a6 as Re, a7 as Ce } from "./vendor-icons-fVDtJt66.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./media-inspector-gallery-CbGNTMFV.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Q = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Q || Object.keys(Q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const ye = Q.FirstFrameVideo, B = 0.01, Le = 2, Fe = 48, Me = 160, Ue = 1e4, Te = 3e4, C = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), S = [];
let X = 0;
function Ie({
  src: e,
  poster: t = "",
  alt: r = "",
  className: i,
  style: a,
  title: n,
  draggable: s = !1,
  ariaLabel: c,
  ariaHidden: m,
  onLoad: f,
  onError: w,
  onMediaSize: g
}) {
  const [p, l] = h(null), E = le(!1), [y, O] = h(!1), [j, d] = h(""), [I, L] = h(""), [N, _] = h(), [fe, W] = h(""), [x, re] = h(""), [pe, he] = h(""), [ve, ne] = h(""), v = t.trim() || Ne(e), z = !v || j === v || $(K, v), b = N?.src === e ? N.result : void 0, F = fe === e;
  T(() => {
    if (!b || F || typeof window > "u" || typeof window.URL?.createObjectURL != "function") {
      re("");
      return;
    }
    const u = window.URL.createObjectURL(b.blob);
    return re(u), () => {
      typeof window.URL?.revokeObjectURL == "function" && window.URL.revokeObjectURL(u);
    };
  }, [F, b]), T(() => {
    const u = p;
    if (!u) return;
    const A = (M) => {
      M && !E.current && ($(K, v) || d(""), $(q, e) || W("")), M || ne(""), E.current = M, O(M);
    };
    if (typeof IntersectionObserver > "u") {
      A(!0);
      return;
    }
    const R = new IntersectionObserver(
      (M) => {
        const oe = M.find((we) => we.target === u);
        oe && A(oe.isIntersecting);
      },
      { rootMargin: "80px 0px" }
    );
    return R.observe(u), () => R.disconnect();
  }, [v, e, p]), T(() => {
    if (!y || !z || b || F || !e)
      return;
    let u = !1;
    const A = _e(e);
    return A.promise.then(
      (R) => {
        u || _({ src: e, result: R });
      },
      (R) => {
        !u && !(R instanceof Error && R.name === "AbortError") && W(e);
      }
    ), () => {
      u = !0, A.release();
    };
  }, [y, F, b, z, e]);
  const V = {
    ref: l,
    alt: r,
    className: i,
    style: a,
    title: n,
    draggable: s,
    "aria-label": c,
    "aria-hidden": m ? !0 : void 0
  };
  return y ? z ? b && x && !F ? /* @__PURE__ */ o(
    "img",
    {
      ...V,
      src: x,
      style: D(a, pe === x),
      decoding: "async",
      onLoad: () => {
        he(x), g?.(b.width, b.height), f?.();
      },
      onError: () => {
        C.delete(e), k(q, e), _(void 0), W(e);
      }
    }
  ) : F ? /* @__PURE__ */ o(
    ye,
    {
      videoRef: l,
      src: e,
      className: i,
      style: D(a, ve === e),
      title: n,
      muted: !0,
      playsInline: !0,
      preload: "metadata",
      draggable: s,
      "aria-label": c,
      "aria-hidden": m ? !0 : void 0,
      onLoadedMetadata: (u) => g?.(
        u.currentTarget.videoWidth,
        u.currentTarget.videoHeight
      ),
      onFirstFrameReady: () => {
        ne(e), f?.();
      },
      onError: w
    }
  ) : /* @__PURE__ */ o("img", { ...V, style: D(a, !1) }) : /* @__PURE__ */ o(
    "img",
    {
      ...V,
      src: v,
      style: D(a, I === v),
      loading: "lazy",
      decoding: "async",
      onLoad: (u) => {
        L(v), g?.(
          u.currentTarget.naturalWidth,
          u.currentTarget.naturalHeight
        ), f?.();
      },
      onError: () => {
        k(K, v), d(v);
      }
    }
  ) : /* @__PURE__ */ o("img", { ...V, style: D(a, !1) });
}
function Ne(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  try {
    const r = new URL(t);
    return r.protocol !== "http:" && r.protocol !== "https:" ? "" : r.search.includes("vframe/") ? t : "";
  } catch {
    return "";
  }
}
function D(e, t) {
  return t ? e : { ...e, visibility: "hidden" };
}
function _e(e) {
  const t = C.get(e);
  if (t)
    return ce(e, t), { promise: Promise.resolve(t), release: () => {
    } };
  if ($(q, e))
    return {
      promise: Promise.reject(new Error("视频首帧无法缓存")),
      release: () => {
      }
    };
  let r = P.get(e);
  if (!r) {
    let a, n;
    const s = new Promise((c, m) => {
      a = c, n = m;
    });
    r = {
      src: e,
      consumers: 0,
      state: "queued",
      promise: s,
      resolve: a,
      reject: n
    }, P.set(e, r), S.push(r);
  }
  r.consumers += 1, te();
  let i = !1;
  return {
    promise: r.promise,
    release: () => {
      i || (i = !0, Ae(r));
    }
  };
}
function Ae(e) {
  if (e.consumers = Math.max(0, e.consumers - 1), e.consumers > 0 || e.state === "settled")
    return;
  if (e.state === "active") {
    const r = e.cancelCapture;
    H(e), e.reject(Z()), r?.();
    return;
  }
  const t = S.indexOf(e);
  t >= 0 && S.splice(t, 1), H(e), e.reject(Z()), te();
}
function te() {
  for (; X < Le && S.length > 0; ) {
    const e = S.shift();
    if (!e) return;
    if (e.state !== "queued" || e.consumers === 0)
      continue;
    e.state = "active", X += 1;
    const t = De(e.src);
    e.cancelCapture = t.cancel, t.promise.then((r) => {
      e.state !== "settled" && (ce(e.src, r), H(e), e.resolve(r));
    }).catch((r) => {
      if (e.state === "settled") return;
      const i = r instanceof Error ? r : new Error("视频首帧提取失败");
      i.name !== "AbortError" && k(q, e.src), H(e), e.reject(i);
    }).finally(() => {
      X -= 1, te();
    });
  }
}
function H(e) {
  e.state = "settled", e.cancelCapture = void 0, P.get(e.src) === e && P.delete(e.src);
}
function Z() {
  const e = new Error("视频首帧提取已取消");
  return e.name = "AbortError", e;
}
function ce(e, t) {
  for (C.delete(e), C.set(e, t); C.size > Fe; ) {
    const r = C.keys().next().value;
    if (!r) return;
    C.delete(r);
  }
}
function $(e, t) {
  const r = e.get(t);
  return r !== void 0 && r > Date.now();
}
function k(e, t) {
  for (e.delete(t), e.set(t, Date.now() + Te); e.size > Me; ) {
    const r = e.keys().next().value;
    if (!r) return;
    e.delete(r);
  }
}
function De(e) {
  let t = () => {
  };
  return { promise: new Promise((i, a) => {
    if (typeof document > "u") {
      a(new Error("当前环境无法提取视频首帧"));
      return;
    }
    const n = document.createElement("video");
    let s = !1, c = !1, m = !1, f = B, w = 0;
    const g = () => {
      window.clearTimeout(w), n.removeEventListener("error", E), n.removeEventListener("loadeddata", y), n.removeEventListener("seeked", O), n.removeEventListener("loadedmetadata", j), n.pause(), n.removeAttribute("src"), n.load();
    }, p = (d) => {
      s || (s = !0, g(), a(d));
    }, l = () => {
      if (!(s || c || n.seeking || n.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || n.videoWidth <= 0 || n.videoHeight <= 0)) {
        c = !0;
        try {
          const d = Math.min(640, n.videoWidth), I = Math.max(
            1,
            Math.round(n.videoHeight / n.videoWidth * d)
          ), L = document.createElement("canvas");
          L.width = d, L.height = I;
          const N = L.getContext("2d");
          if (!N) {
            p(new Error("浏览器无法创建首帧画布"));
            return;
          }
          N.drawImage(n, 0, 0, d, I), L.toBlob(
            (_) => {
              if (!s) {
                if (!_) {
                  p(new Error("浏览器无法编码视频首帧"));
                  return;
                }
                s = !0, g(), i({ blob: _, width: d, height: I });
              }
            },
            "image/jpeg",
            0.82
          );
        } catch (d) {
          p(d instanceof Error ? d : new Error("视频首帧提取失败"));
        }
      }
    }, E = () => p(new Error("视频首帧加载失败")), y = () => {
      (!m || Math.abs(n.currentTime - f) < 1e-3) && l();
    }, O = () => l(), j = () => {
      const d = n.duration;
      if (f = Number.isFinite(d) && d > 0 ? Math.min(B, d / 2) : B, !Number.isFinite(d)) {
        l();
        return;
      }
      try {
        m = !0, n.currentTime = f;
      } catch {
        m = !1;
      }
      l();
    };
    t = () => p(Z()), w = window.setTimeout(
      () => p(new Error("视频首帧提取超时")),
      Ue
    ), n.crossOrigin = "anonymous", n.muted = !0, n.playsInline = !0, n.preload = "metadata", n.addEventListener("error", E), n.addEventListener("loadeddata", y), n.addEventListener("seeked", O), n.addEventListener("loadedmetadata", j), n.src = e, n.load();
  }), cancel: () => t() };
}
function ue(e, t = "") {
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
function Se(e, t) {
  const r = ae(t || ""), i = ae(ue(e));
  if (ie(r)) return r;
  const a = ie(i);
  return r ? `${r}${a}` : i || "file";
}
function ae(e) {
  return e.trim().replace(/[\\/:*?"<>|]+/g, "-");
}
function ie(e) {
  return e.match(/\.[a-z0-9]{1,12}$/i)?.[0] || "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/upload"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const { downloadUploadFile: se } = Y;
function Oe({
  url: e,
  name: t,
  label: r = "下载内容",
  className: i = "",
  iconSize: a = 17
}) {
  const [n, s] = h(
    "idle"
  );
  T(() => s("idle"), [t, e]);
  const c = n === "downloading", m = n === "error" ? "下载失败，请重试" : r;
  async function f() {
    if (!(!e || c)) {
      s("downloading");
      try {
        if (typeof se != "function")
          throw new Error("当前页面未提供下载能力");
        await se({
          name: Se(e, t),
          url: e,
          download: e
        }), s("idle");
      } catch (w) {
        console.error("[resource-download] 下载失败", w), s("error");
      }
    }
  }
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: i,
      disabled: c,
      "aria-busy": c || void 0,
      "aria-label": m,
      title: m,
      onClick: () => {
        f();
      },
      children: c ? /* @__PURE__ */ o(ge, { size: a, className: "animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ o(be, { size: a, "aria-hidden": "true" })
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/components/media/first-frame-video"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const je = J.EnergonAudioPlayer, ee = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!ee || Object.keys(ee).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const xe = ee.FirstFrameVideo;
function Ke({
  kind: e,
  urls: t = [],
  mediaItems: r,
  zoom: i = 1,
  compact: a = !1,
  downloadable: n = !1,
  className: s = "",
  supplementalText: c
}) {
  const [m, f] = h(0), w = r && r.length > 0 ? r : t.map((l) => ({ url: l })), g = w.map((l) => `${l.url}
${l.thumbnail || ""}`).join(`
`);
  T(() => {
    f(0);
  }, [g]);
  const p = w.map((l, E) => ({
    id: l.url,
    name: ue(
      l.url,
      `${qe[e]} ${E + 1}`
    ),
    url: l.url,
    thumbnail: l.thumbnail
  }));
  return p.length === 0 ? null : /* @__PURE__ */ o(
    Ve,
    {
      kind: e,
      items: p,
      activeIndex: Math.min(m, p.length - 1),
      zoom: i,
      compact: a,
      downloadable: n,
      className: s,
      supplementalText: c,
      onSelect: f
    }
  );
}
function Ve({
  kind: e,
  items: t,
  activeIndex: r,
  zoom: i = 1,
  compact: a = !1,
  downloadable: n = !1,
  className: s = "",
  supplementalText: c,
  onSelect: m
}) {
  const f = t[r] || t[0];
  return f ? /* @__PURE__ */ U(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        a ? "is-compact" : "",
        s
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ o(
          $e,
          {
            kind: e,
            item: f,
            zoom: i,
            downloadable: n,
            supplementalText: c
          }
        ),
        t.length > 1 ? /* @__PURE__ */ o(
          Pe,
          {
            kind: e,
            items: t,
            activeIndex: r,
            onSelect: m
          }
        ) : null
      ]
    }
  ) : null;
}
function $e({
  kind: e,
  item: t,
  zoom: r,
  downloadable: i,
  supplementalText: a
}) {
  return /* @__PURE__ */ U("div", { className: "bot-media-inspector-stage", children: [
    i && t.url ? /* @__PURE__ */ o(
      Oe,
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
    ) : /* @__PURE__ */ o(G, { kind: e }) : null,
    e === "video" ? t.url ? /* @__PURE__ */ o(
      xe,
      {
        src: t.url,
        poster: t.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: t.thumbnail ? "none" : "metadata"
      },
      t.url
    ) : /* @__PURE__ */ o(G, { kind: e }) : null,
    e === "audio" ? t.url ? /* @__PURE__ */ U("div", { className: "bot-media-inspector-audio-content", children: [
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
        je,
        {
          src: t.url,
          detailed: !0,
          preload: "none",
          className: "bot-media-inspector-audio"
        },
        t.url
      ),
      a?.text ? /* @__PURE__ */ U("section", { className: "bot-media-inspector-audio-text", children: [
        /* @__PURE__ */ o("strong", { children: a.label }),
        /* @__PURE__ */ o("p", { children: a.text })
      ] }) : null
    ] }) : /* @__PURE__ */ o(G, { kind: e }) : null,
    e === "file" ? /* @__PURE__ */ U("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ o(de, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("strong", { children: t.name })
    ] }) : null
  ] });
}
function Pe({
  kind: e,
  items: t,
  activeIndex: r,
  onSelect: i
}) {
  const a = le(null);
  return T(() => {
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
        Ie,
        {
          src: n.url,
          poster: n.thumbnail,
          draggable: !1,
          ariaHidden: !0
        },
        n.url
      ) : e === "image" && n.url || n.thumbnail ? /* @__PURE__ */ o("img", { src: n.thumbnail || n.url, alt: "" }) : /* @__PURE__ */ o(me, { kind: e })
    },
    `${String(n.id)}-${s}`
  )) }) });
}
function G({ kind: e }) {
  return /* @__PURE__ */ U("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ o(me, { kind: e }),
    /* @__PURE__ */ o("span", { children: "当前素材无法在线预览" })
  ] });
}
function me({ kind: e }) {
  const t = He[e];
  return /* @__PURE__ */ o(t, { "aria-hidden": "true" });
}
const qe = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件"
}, He = {
  image: Ce,
  video: Re,
  audio: Ee,
  file: de
};
export {
  Ke as M,
  Oe as R,
  Ie as V,
  Ve as a,
  ue as r
};
