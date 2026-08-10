import { a as o, j as L } from "./_commonjsHelpers-CTFd9u1x.js";
import { u as X, l as E, o as F } from "./react-C7Xtl8sB.js";
import { L as ie, I as se, F as Z, J as le, V as ce, N as ue } from "./vendor-icons-Cc7Kl3It.js";
import { m as de } from "./content-view-DKqPlRti.js";
import { m as J } from "./first-frame-video-BTFoLT0t.js";
import { m as me } from "./upload-5FgQdFzM.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./media-inspector-gallery-CbGNTMFV.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const z = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!z || Object.keys(z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const fe = J.FirstFrameVideo, pe = "vframe/jpg/offset/0/w/640", W = 0.01, he = 2, ve = 48, we = 160, ge = 1e4, C = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Set(), Y = /* @__PURE__ */ new Set(), M = [];
let $ = 0;
function be({
  src: e,
  poster: t = "",
  alt: r = "",
  className: a,
  style: s,
  title: n,
  draggable: i = !1,
  ariaLabel: c,
  ariaHidden: m,
  onLoad: f,
  onError: p,
  onMediaSize: h
}) {
  const v = X(null), [u, l] = E(!1), [b, R] = E(""), [U, T] = E(), [oe, P] = E(""), [D, q] = E(""), y = t.trim() || Ee(e), _ = !y || b === y || B.has(y), w = U?.src === e ? U.result : void 0, g = oe === e;
  F(() => {
    if (!w || g || typeof window > "u" || typeof window.URL?.createObjectURL != "function") {
      q("");
      return;
    }
    const d = window.URL.createObjectURL(w.blob);
    return q(d), () => {
      typeof window.URL?.revokeObjectURL == "function" && window.URL.revokeObjectURL(d);
    };
  }, [g, w]), F(() => {
    if (g) {
      l(!0);
      return;
    }
    const d = v.current;
    if (!d || typeof IntersectionObserver > "u") {
      l(!0);
      return;
    }
    const I = new IntersectionObserver(
      (j) => {
        const H = j.find((ae) => ae.target === d);
        H && l(H.isIntersecting);
      },
      { rootMargin: "80px 0px" }
    );
    return I.observe(d), () => I.disconnect();
  }, [g, e]), F(() => {
    if (!u || !_ || w || g || !e)
      return;
    let d = !1;
    const I = Re(e);
    return I.promise.then(
      (j) => {
        d || T({ src: e, result: j });
      },
      () => {
        d || P(e);
      }
    ), () => {
      d = !0, I.release();
    };
  }, [u, g, w, _, e]);
  const N = {
    ref: v,
    alt: r,
    className: a,
    style: s,
    title: n,
    draggable: i,
    "aria-label": c,
    "aria-hidden": m ? !0 : void 0
  };
  return u ? _ ? w && D && !g ? /* @__PURE__ */ o(
    "img",
    {
      ...N,
      src: D,
      decoding: "async",
      onLoad: () => {
        h?.(w.width, w.height), f?.();
      },
      onError: () => P(e)
    }
  ) : g ? /* @__PURE__ */ o(
    fe,
    {
      src: e,
      className: a,
      style: s,
      title: n,
      muted: !0,
      playsInline: !0,
      preload: "metadata",
      draggable: i,
      "aria-label": c,
      "aria-hidden": m ? !0 : void 0,
      onLoadedMetadata: (d) => h?.(
        d.currentTarget.videoWidth,
        d.currentTarget.videoHeight
      ),
      onFirstFrameReady: f,
      onError: p
    }
  ) : /* @__PURE__ */ o("img", { ...N }) : /* @__PURE__ */ o(
    "img",
    {
      ...N,
      src: y,
      loading: "lazy",
      decoding: "async",
      onLoad: (d) => {
        h?.(
          d.currentTarget.naturalWidth,
          d.currentTarget.naturalHeight
        ), f?.();
      },
      onError: () => {
        ee(B, y), R(y);
      }
    }
  ) : /* @__PURE__ */ o("img", { ...N });
}
function Ee(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  try {
    const r = new URL(t);
    if (r.protocol !== "http:" && r.protocol !== "https:")
      return "";
    if (r.search.includes("vframe/"))
      return t;
    const a = r.hash;
    return r.hash = "", `${r.toString()}${r.search ? "&" : "?"}${pe}${a}`;
  } catch {
    return "";
  }
}
function Re(e) {
  const t = C.get(e);
  if (t)
    return k(e, t), { promise: Promise.resolve(t), release: () => {
    } };
  if (Y.has(e))
    return {
      promise: Promise.reject(new Error("视频首帧无法缓存")),
      release: () => {
      }
    };
  let r = A.get(e);
  if (!r) {
    let s, n;
    const i = new Promise((c, m) => {
      s = c, n = m;
    });
    r = {
      src: e,
      consumers: 0,
      state: "queued",
      promise: i,
      resolve: s,
      reject: n
    }, A.set(e, r), M.push(r);
  }
  r.consumers += 1, V();
  let a = !1;
  return {
    promise: r.promise,
    release: () => {
      a || (a = !0, ye(r));
    }
  };
}
function ye(e) {
  if (e.consumers = Math.max(0, e.consumers - 1), e.consumers > 0 || e.state === "settled")
    return;
  if (e.state === "active") {
    const r = e.cancelCapture;
    S(e), e.reject(x()), r?.();
    return;
  }
  const t = M.indexOf(e);
  t >= 0 && M.splice(t, 1), S(e), e.reject(x()), V();
}
function V() {
  for (; $ < he && M.length > 0; ) {
    const e = M.shift();
    if (!e) return;
    if (e.state !== "queued" || e.consumers === 0)
      continue;
    e.state = "active", $ += 1;
    const t = Ce(e.src);
    e.cancelCapture = t.cancel, t.promise.then((r) => {
      e.state !== "settled" && (k(e.src, r), S(e), e.resolve(r));
    }).catch((r) => {
      if (e.state === "settled") return;
      const a = r instanceof Error ? r : new Error("视频首帧提取失败");
      a.name !== "AbortError" && ee(Y, e.src), S(e), e.reject(a);
    }).finally(() => {
      $ -= 1, V();
    });
  }
}
function S(e) {
  e.state = "settled", e.cancelCapture = void 0, A.get(e.src) === e && A.delete(e.src);
}
function x() {
  const e = new Error("视频首帧提取已取消");
  return e.name = "AbortError", e;
}
function k(e, t) {
  for (C.delete(e), C.set(e, t); C.size > ve; ) {
    const r = C.keys().next().value;
    if (!r) return;
    C.delete(r);
  }
}
function ee(e, t) {
  for (e.delete(t), e.add(t); e.size > we; ) {
    const r = e.values().next().value;
    if (!r) return;
    e.delete(r);
  }
}
function Ce(e) {
  let t = () => {
  };
  return { promise: new Promise((a, s) => {
    if (typeof document > "u") {
      s(new Error("当前环境无法提取视频首帧"));
      return;
    }
    const n = document.createElement("video");
    let i = !1, c = !1, m = 0;
    const f = () => {
      window.clearTimeout(m), n.removeEventListener("error", v), n.removeEventListener("loadeddata", h), n.removeEventListener("seeked", h), n.removeEventListener("loadedmetadata", u), n.pause(), n.removeAttribute("src"), n.load();
    }, p = (l) => {
      i || (i = !0, f(), s(l));
    }, h = () => {
      if (!(i || c || n.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || n.videoWidth <= 0 || n.videoHeight <= 0)) {
        c = !0;
        try {
          const l = Math.min(640, n.videoWidth), b = Math.max(
            1,
            Math.round(n.videoHeight / n.videoWidth * l)
          ), R = document.createElement("canvas");
          R.width = l, R.height = b;
          const U = R.getContext("2d");
          if (!U) {
            p(new Error("浏览器无法创建首帧画布"));
            return;
          }
          U.drawImage(n, 0, 0, l, b), R.toBlob(
            (T) => {
              if (!i) {
                if (!T) {
                  p(new Error("浏览器无法编码视频首帧"));
                  return;
                }
                i = !0, f(), a({ blob: T, width: l, height: b });
              }
            },
            "image/jpeg",
            0.82
          );
        } catch (l) {
          p(l instanceof Error ? l : new Error("视频首帧提取失败"));
        }
      }
    }, v = () => p(new Error("视频首帧加载失败")), u = () => {
      const l = n.duration, b = Number.isFinite(l) && l > 0 ? Math.min(W, l / 2) : W;
      try {
        n.currentTime = b;
      } catch {
        h();
      }
    };
    t = () => p(x()), m = window.setTimeout(
      () => p(new Error("视频首帧提取超时")),
      ge
    ), n.crossOrigin = "anonymous", n.muted = !0, n.playsInline = !0, n.preload = "metadata", n.addEventListener("error", v), n.addEventListener("loadeddata", h), n.addEventListener("seeked", h), n.addEventListener("loadedmetadata", u), n.src = e, n.load();
  }), cancel: () => t() };
}
function te(e, t = "") {
  if (!e || /^(?:data|blob):/i.test(e)) return t;
  let r = e.split(/[?#]/, 1)[0];
  try {
    r = new URL(e, "http://resource.local").pathname;
  } catch {
  }
  const a = r.slice(r.lastIndexOf("/") + 1);
  if (!a) return t;
  try {
    return decodeURIComponent(a) || t;
  } catch {
    return a;
  }
}
function Le(e, t) {
  const r = G(t || ""), a = G(te(e));
  if (K(r)) return r;
  const s = K(a);
  return r ? `${r}${s}` : a || "file";
}
function G(e) {
  return e.trim().replace(/[\\/:*?"<>|]+/g, "-");
}
function K(e) {
  return e.match(/\.[a-z0-9]{1,12}$/i)?.[0] || "";
}
const { downloadUploadFile: Q } = me;
function Fe({
  url: e,
  name: t,
  label: r = "下载内容",
  className: a = "",
  iconSize: s = 17
}) {
  const [n, i] = E(
    "idle"
  );
  F(() => i("idle"), [t, e]);
  const c = n === "downloading", m = n === "error" ? "下载失败，请重试" : r;
  async function f() {
    if (!(!e || c)) {
      i("downloading");
      try {
        if (typeof Q != "function")
          throw new Error("当前页面未提供下载能力");
        await Q({
          name: Le(e, t),
          url: e,
          download: e
        }), i("idle");
      } catch (p) {
        console.error("[resource-download] 下载失败", p), i("error");
      }
    }
  }
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: a,
      disabled: c,
      "aria-busy": c || void 0,
      "aria-label": m,
      title: m,
      onClick: () => {
        f();
      },
      children: c ? /* @__PURE__ */ o(ie, { size: s, className: "animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ o(se, { size: s, "aria-hidden": "true" })
    }
  );
}
const Ue = de.EnergonAudioPlayer, Ie = J.FirstFrameVideo;
function Me({
  kind: e,
  urls: t = [],
  mediaItems: r,
  zoom: a = 1,
  compact: s = !1,
  downloadable: n = !1,
  className: i = "",
  supplementalText: c
}) {
  const [m, f] = E(0), p = r && r.length > 0 ? r : t.map((u) => ({ url: u })), h = p.map((u) => `${u.url}
${u.thumbnail || ""}`).join(`
`);
  F(() => {
    f(0);
  }, [h]);
  const v = p.map((u, l) => ({
    id: u.url,
    name: te(
      u.url,
      `${Ae[e]} ${l + 1}`
    ),
    url: u.url,
    thumbnail: u.thumbnail
  }));
  return v.length === 0 ? null : /* @__PURE__ */ o(
    re,
    {
      kind: e,
      items: v,
      activeIndex: Math.min(m, v.length - 1),
      zoom: a,
      compact: s,
      downloadable: n,
      className: i,
      supplementalText: c,
      onSelect: f
    }
  );
}
function re({
  kind: e,
  items: t,
  activeIndex: r,
  zoom: a = 1,
  compact: s = !1,
  downloadable: n = !1,
  className: i = "",
  supplementalText: c,
  onSelect: m
}) {
  const f = t[r] || t[0];
  return f ? /* @__PURE__ */ L(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        s ? "is-compact" : "",
        i
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ o(
          Te,
          {
            kind: e,
            item: f,
            zoom: a,
            downloadable: n,
            supplementalText: c
          }
        ),
        t.length > 1 ? /* @__PURE__ */ o(
          Ne,
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
function Te({
  kind: e,
  item: t,
  zoom: r,
  downloadable: a,
  supplementalText: s
}) {
  return /* @__PURE__ */ L("div", { className: "bot-media-inspector-stage", children: [
    a && t.url ? /* @__PURE__ */ o(
      Fe,
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
    ) : /* @__PURE__ */ o(O, { kind: e }) : null,
    e === "video" ? t.url ? /* @__PURE__ */ o(
      Ie,
      {
        src: t.url,
        poster: t.thumbnail,
        controls: !0,
        playsInline: !0,
        preload: t.thumbnail ? "none" : "metadata"
      },
      t.url
    ) : /* @__PURE__ */ o(O, { kind: e }) : null,
    e === "audio" ? t.url ? /* @__PURE__ */ L("div", { className: "bot-media-inspector-audio-content", children: [
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
        Ue,
        {
          src: t.url,
          detailed: !0,
          preload: "none",
          className: "bot-media-inspector-audio"
        },
        t.url
      ),
      s?.text ? /* @__PURE__ */ L("section", { className: "bot-media-inspector-audio-text", children: [
        /* @__PURE__ */ o("strong", { children: s.label }),
        /* @__PURE__ */ o("p", { children: s.text })
      ] }) : null
    ] }) : /* @__PURE__ */ o(O, { kind: e }) : null,
    e === "file" ? /* @__PURE__ */ L("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ o(Z, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("strong", { children: t.name })
    ] }) : null
  ] });
}
function Ne({
  kind: e,
  items: t,
  activeIndex: r,
  onSelect: a
}) {
  const s = X(null);
  return F(() => {
    s.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [r]), /* @__PURE__ */ o("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ o("div", { className: "bot-media-inspector-list", children: t.map((n, i) => /* @__PURE__ */ o(
    "button",
    {
      ref: i === r ? s : void 0,
      type: "button",
      title: n.name,
      "aria-label": `查看第 ${i + 1} 个素材`,
      "aria-current": i === r ? "true" : void 0,
      onClick: () => a(i),
      children: e === "video" && n.url ? /* @__PURE__ */ o(
        be,
        {
          src: n.url,
          poster: n.thumbnail,
          draggable: !1,
          ariaHidden: !0
        },
        n.url
      ) : e === "image" && n.url || n.thumbnail ? /* @__PURE__ */ o("img", { src: n.thumbnail || n.url, alt: "" }) : /* @__PURE__ */ o(ne, { kind: e })
    },
    `${String(n.id)}-${i}`
  )) }) });
}
function O({ kind: e }) {
  return /* @__PURE__ */ L("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ o(ne, { kind: e }),
    /* @__PURE__ */ o("span", { children: "当前素材无法在线预览" })
  ] });
}
function ne({ kind: e }) {
  const t = Se[e];
  return /* @__PURE__ */ o(t, { "aria-hidden": "true" });
}
const Ae = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件"
}, Se = {
  image: ue,
  video: ce,
  audio: le,
  file: Z
}, Pe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MediaInspector: Me,
  MediaInspectorGallery: re
}, Symbol.toStringTag, { value: "Module" }));
export {
  re as M,
  Fe as R,
  be as V,
  Me as a,
  Pe as b,
  z as m,
  te as r
};
