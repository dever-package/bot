import { j as o, a as L } from "./preloadable-CnUP9jgB.js";
import { a as w, b as ce, d as T } from "./file-kind-Cq3pESGF.js";
import { r as ge, D as Ee, b as ue, ae as Re, a9 as Ce, a8 as ye } from "./vendor-icons-B8sieP24.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./media-inspector-gallery-B2qTIuOh.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const k = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!k || Object.keys(k).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Le = k.FirstFrameVideo, K = 0.01, Fe = 2, Me = 48, Ue = 160, Ie = 1e4, Te = 3e4, F = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), S = [];
let Q = 0;
function Ne({
  src: e,
  poster: t = "",
  alt: r = "",
  className: s,
  style: i,
  title: n,
  draggable: a = !1,
  ariaLabel: c,
  ariaHidden: m,
  onLoad: f,
  onError: p,
  onMediaSize: b
}) {
  const [h, v] = w(null), C = ce(!1), [l, E] = w(!1), [j, d] = w(""), [N, M] = w(""), [_, A] = w(), [pe, z] = w(""), [x, ne] = w(""), [he, ve] = w(""), [we, oe] = w(""), g = t.trim() || _e(e), B = !g || j === g || $(X, g), R = _?.src === e ? _.result : void 0, U = pe === e;
  T(() => {
    if (!R || U || typeof window > "u" || typeof window.URL?.createObjectURL != "function") {
      ne("");
      return;
    }
    const u = window.URL.createObjectURL(R.blob);
    return ne(u), () => {
      typeof window.URL?.revokeObjectURL == "function" && window.URL.revokeObjectURL(u);
    };
  }, [U, R]), T(() => {
    const u = h;
    if (!u) return;
    const D = (I) => {
      I && !C.current && ($(X, g) || d(""), $(q, e) || z("")), I || oe(""), C.current = I, E(I);
    };
    if (typeof IntersectionObserver > "u") {
      D(!0);
      return;
    }
    const y = new IntersectionObserver(
      (I) => {
        const ae = I.find((be) => be.target === u);
        ae && D(ae.isIntersecting);
      },
      { rootMargin: "80px 0px" }
    );
    return y.observe(u), () => y.disconnect();
  }, [g, e, h]), T(() => {
    if (!l || !B || R || U || !e)
      return;
    let u = !1;
    const D = Ae(e);
    return D.promise.then(
      (y) => {
        u || A({ src: e, result: y });
      },
      (y) => {
        !u && !(y instanceof Error && y.name === "AbortError") && z(e);
      }
    ), () => {
      u = !0, D.release();
    };
  }, [l, U, R, B, e]);
  const V = {
    ref: v,
    alt: r,
    className: s,
    style: i,
    title: n,
    draggable: a,
    "aria-label": c,
    "aria-hidden": m ? !0 : void 0
  };
  return l ? B ? R && x && !U ? /* @__PURE__ */ o(
    "img",
    {
      ...V,
      src: x,
      style: O(i, he === x),
      decoding: "async",
      onLoad: () => {
        ve(x), b?.(R.width, R.height), f?.();
      },
      onError: () => {
        F.delete(e), Y(q, e), A(void 0), z(e);
      }
    }
  ) : U ? /* @__PURE__ */ o(
    Le,
    {
      videoRef: v,
      src: e,
      className: s,
      style: O(i, we === e),
      title: n,
      muted: !0,
      playsInline: !0,
      preload: "metadata",
      draggable: a,
      "aria-label": c,
      "aria-hidden": m ? !0 : void 0,
      onLoadedMetadata: (u) => b?.(
        u.currentTarget.videoWidth,
        u.currentTarget.videoHeight
      ),
      onFirstFrameReady: () => {
        oe(e), f?.();
      },
      onError: p
    }
  ) : /* @__PURE__ */ o("img", { ...V, style: O(i, !1) }) : /* @__PURE__ */ o(
    "img",
    {
      ...V,
      src: g,
      style: O(i, N === g),
      loading: "lazy",
      decoding: "async",
      onLoad: (u) => {
        M(g), b?.(
          u.currentTarget.naturalWidth,
          u.currentTarget.naturalHeight
        ), f?.();
      },
      onError: () => {
        Y(X, g), d(g);
      }
    }
  ) : /* @__PURE__ */ o("img", { ...V, style: O(i, !1) });
}
function _e(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  try {
    const r = new URL(t);
    return r.protocol !== "http:" && r.protocol !== "https:" ? "" : r.search.includes("vframe/") ? t : "";
  } catch {
    return "";
  }
}
function O(e, t) {
  return t ? e : { ...e, visibility: "hidden" };
}
function Ae(e) {
  const t = F.get(e);
  if (t)
    return me(e, t), { promise: Promise.resolve(t), release: () => {
    } };
  if ($(q, e))
    return {
      promise: Promise.reject(new Error("视频首帧无法缓存")),
      release: () => {
      }
    };
  let r = P.get(e);
  if (!r) {
    let i, n;
    const a = new Promise((c, m) => {
      i = c, n = m;
    });
    r = {
      src: e,
      consumers: 0,
      state: "queued",
      promise: a,
      resolve: i,
      reject: n
    }, P.set(e, r), S.push(r);
  }
  r.consumers += 1, re();
  let s = !1;
  return {
    promise: r.promise,
    release: () => {
      s || (s = !0, De(r));
    }
  };
}
function De(e) {
  if (e.consumers = Math.max(0, e.consumers - 1), e.consumers > 0 || e.state === "settled")
    return;
  if (e.state === "active") {
    const r = e.cancelCapture;
    H(e), e.reject(G()), r?.();
    return;
  }
  const t = S.indexOf(e);
  t >= 0 && S.splice(t, 1), H(e), e.reject(G()), re();
}
function re() {
  for (; Q < Fe && S.length > 0; ) {
    const e = S.shift();
    if (!e) return;
    if (e.state !== "queued" || e.consumers === 0)
      continue;
    e.state = "active", Q += 1;
    const t = Oe(e.src);
    e.cancelCapture = t.cancel, t.promise.then((r) => {
      e.state !== "settled" && (me(e.src, r), H(e), e.resolve(r));
    }).catch((r) => {
      if (e.state === "settled") return;
      const s = r instanceof Error ? r : new Error("视频首帧提取失败");
      s.name !== "AbortError" && Y(q, e.src), H(e), e.reject(s);
    }).finally(() => {
      Q -= 1, re();
    });
  }
}
function H(e) {
  e.state = "settled", e.cancelCapture = void 0, P.get(e.src) === e && P.delete(e.src);
}
function G() {
  const e = new Error("视频首帧提取已取消");
  return e.name = "AbortError", e;
}
function me(e, t) {
  for (F.delete(e), F.set(e, t); F.size > Me; ) {
    const r = F.keys().next().value;
    if (!r) return;
    F.delete(r);
  }
}
function $(e, t) {
  const r = e.get(t);
  return r !== void 0 && r > Date.now();
}
function Y(e, t) {
  for (e.delete(t), e.set(t, Date.now() + Te); e.size > Ue; ) {
    const r = e.keys().next().value;
    if (!r) return;
    e.delete(r);
  }
}
function Oe(e) {
  let t = () => {
  };
  return { promise: new Promise((s, i) => {
    if (typeof document > "u") {
      i(new Error("当前环境无法提取视频首帧"));
      return;
    }
    const n = document.createElement("video");
    let a = !1, c = !1, m = !1, f = K, p = 0;
    const b = () => {
      window.clearTimeout(p), n.removeEventListener("error", C), n.removeEventListener("loadeddata", l), n.removeEventListener("seeked", E), n.removeEventListener("loadedmetadata", j), n.pause(), n.removeAttribute("src"), n.load();
    }, h = (d) => {
      a || (a = !0, b(), i(d));
    }, v = () => {
      if (!(a || c || n.seeking || n.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || n.videoWidth <= 0 || n.videoHeight <= 0)) {
        c = !0;
        try {
          const d = Math.min(640, n.videoWidth), N = Math.max(
            1,
            Math.round(n.videoHeight / n.videoWidth * d)
          ), M = document.createElement("canvas");
          M.width = d, M.height = N;
          const _ = M.getContext("2d");
          if (!_) {
            h(new Error("浏览器无法创建首帧画布"));
            return;
          }
          _.drawImage(n, 0, 0, d, N), M.toBlob(
            (A) => {
              if (!a) {
                if (!A) {
                  h(new Error("浏览器无法编码视频首帧"));
                  return;
                }
                a = !0, b(), s({ blob: A, width: d, height: N });
              }
            },
            "image/jpeg",
            0.82
          );
        } catch (d) {
          h(d instanceof Error ? d : new Error("视频首帧提取失败"));
        }
      }
    }, C = () => h(new Error("视频首帧加载失败")), l = () => {
      (!m || Math.abs(n.currentTime - f) < 1e-3) && v();
    }, E = () => v(), j = () => {
      const d = n.duration;
      if (f = Number.isFinite(d) && d > 0 ? Math.min(K, d / 2) : K, !Number.isFinite(d)) {
        v();
        return;
      }
      try {
        m = !0, n.currentTime = f;
      } catch {
        m = !1;
      }
      v();
    };
    t = () => h(G()), p = window.setTimeout(
      () => h(new Error("视频首帧提取超时")),
      Ie
    ), n.crossOrigin = "anonymous", n.muted = !0, n.playsInline = !0, n.preload = "metadata", n.addEventListener("error", C), n.addEventListener("loadeddata", l), n.addEventListener("seeked", E), n.addEventListener("loadedmetadata", j), n.src = e, n.load();
  }), cancel: () => t() };
}
function W(e, t = "") {
  if (!e || /^(?:data|blob):/i.test(e)) return t;
  let r = e.split(/[?#]/, 1)[0];
  try {
    r = new URL(e, "http://resource.local").pathname;
  } catch {
  }
  const s = r.slice(r.lastIndexOf("/") + 1);
  if (!s) return t;
  try {
    return decodeURIComponent(s) || t;
  } catch {
    return s;
  }
}
function Se(e, t) {
  const r = ie(t || ""), s = ie(W(e));
  if (se(r)) return r;
  const i = se(s);
  return r ? `${r}${i}` : s || "file";
}
function ie(e) {
  return e.trim().replace(/[\\/:*?"<>|]+/g, "-");
}
function se(e) {
  return e.match(/\.[a-z0-9]{1,12}$/i)?.[0] || "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/upload"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const { downloadUploadFile: le } = J;
function de({
  url: e,
  name: t,
  label: r = "下载内容",
  className: s = "",
  iconSize: i = 17
}) {
  const [n, a] = w(
    "idle"
  );
  T(() => a("idle"), [t, e]);
  const c = n === "downloading", m = n === "error" ? "下载失败，请重试" : r;
  async function f() {
    if (!(!e || c)) {
      a("downloading");
      try {
        if (typeof le != "function")
          throw new Error("当前页面未提供下载能力");
        await le({
          name: Se(e, t),
          url: e,
          download: e
        }), a("idle");
      } catch (p) {
        console.error("[resource-download] 下载失败", p), a("error");
      }
    }
  }
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: s,
      disabled: c,
      "aria-busy": c || void 0,
      "aria-label": m,
      title: m,
      onClick: () => {
        f();
      },
      children: c ? /* @__PURE__ */ o(ge, { size: i, className: "animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ o(Ee, { size: i, "aria-hidden": "true" })
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/components/media/first-frame-video"]);
const ee = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!ee || Object.keys(ee).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const je = ee.EnergonAudioPlayer, te = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!te || Object.keys(te).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const xe = te.FirstFrameVideo;
function Ke({
  kind: e,
  urls: t = [],
  mediaItems: r,
  zoom: s = 1,
  compact: i = !1,
  downloadable: n = !1,
  className: a = "",
  supplementalText: c,
  attachmentUrls: m = []
}) {
  const [f, p] = w(0), b = r && r.length > 0 ? r : t.map((l) => ({ url: l })), h = b.map((l) => `${l.url}
${l.thumbnail || ""}`).join(`
`);
  T(() => {
    p(0);
  }, [h]);
  const v = b.map((l, E) => ({
    id: l.url,
    name: W(
      l.url,
      `${qe[e]} ${E + 1}`
    ),
    url: l.url,
    thumbnail: l.thumbnail
  })), C = m.filter(
    (l) => !b.some((E) => E.url === l)
  );
  return v.length === 0 ? null : /* @__PURE__ */ o(
    Ve,
    {
      kind: e,
      items: v,
      activeIndex: Math.min(f, v.length - 1),
      zoom: s,
      compact: i,
      downloadable: n,
      className: a,
      supplementalText: c,
      attachmentUrls: C,
      onSelect: p
    }
  );
}
function Ve({
  kind: e,
  items: t,
  activeIndex: r,
  zoom: s = 1,
  compact: i = !1,
  downloadable: n = !1,
  className: a = "",
  supplementalText: c,
  attachmentUrls: m = [],
  onSelect: f
}) {
  const p = t[r] || t[0];
  return p ? /* @__PURE__ */ L(
    "div",
    {
      className: [
        "bot-media-inspector-gallery",
        i ? "is-compact" : "",
        a
      ].filter(Boolean).join(" "),
      children: [
        /* @__PURE__ */ o(
          $e,
          {
            kind: e,
            item: p,
            zoom: s,
            downloadable: n,
            supplementalText: c,
            attachmentUrls: m
          }
        ),
        t.length > 1 ? /* @__PURE__ */ o(
          Pe,
          {
            kind: e,
            items: t,
            activeIndex: r,
            onSelect: f
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
  downloadable: s,
  supplementalText: i,
  attachmentUrls: n
}) {
  return /* @__PURE__ */ L("div", { className: "bot-media-inspector-stage", children: [
    s && t.url ? /* @__PURE__ */ o(
      de,
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
    ) : /* @__PURE__ */ o(Z, { kind: e }) : null,
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
    ) : /* @__PURE__ */ o(Z, { kind: e }) : null,
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
        je,
        {
          src: t.url,
          detailed: !0,
          preload: "none",
          className: "bot-media-inspector-audio"
        },
        t.url
      ),
      i?.text ? /* @__PURE__ */ L("section", { className: "bot-media-inspector-audio-text", children: [
        /* @__PURE__ */ o("strong", { children: i.label }),
        /* @__PURE__ */ o("p", { children: i.text })
      ] }) : null,
      n.length > 0 ? /* @__PURE__ */ o("div", { className: "bot-media-inspector-attachments", children: n.map((a) => /* @__PURE__ */ L("div", { className: "bot-media-inspector-attachment", children: [
        /* @__PURE__ */ o("span", { children: /\.lrc(?:[?#].*)?$/i.test(a) ? "LRC 歌词" : W(a, "附件") }),
        /* @__PURE__ */ o(
          de,
          {
            url: a,
            name: W(a, "附件"),
            label: "下载附件"
          }
        )
      ] }, a)) }) : null
    ] }) : /* @__PURE__ */ o(Z, { kind: e }) : null,
    e === "file" ? /* @__PURE__ */ L("div", { className: "bot-media-inspector-file", children: [
      /* @__PURE__ */ o(ue, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("strong", { children: t.name })
    ] }) : null
  ] });
}
function Pe({
  kind: e,
  items: t,
  activeIndex: r,
  onSelect: s
}) {
  const i = ce(null);
  return T(() => {
    i.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }, [r]), /* @__PURE__ */ o("nav", { className: "bot-media-inspector-rail", "aria-label": "同批素材", children: /* @__PURE__ */ o("div", { className: "bot-media-inspector-list", children: t.map((n, a) => /* @__PURE__ */ o(
    "button",
    {
      ref: a === r ? i : void 0,
      type: "button",
      title: n.name,
      "aria-label": `查看第 ${a + 1} 个素材`,
      "aria-current": a === r ? "true" : void 0,
      onClick: () => s(a),
      children: e === "video" && n.url ? /* @__PURE__ */ o(
        Ne,
        {
          src: n.url,
          poster: n.thumbnail,
          draggable: !1,
          ariaHidden: !0
        },
        n.url
      ) : e === "image" && n.url || n.thumbnail ? /* @__PURE__ */ o("img", { src: n.thumbnail || n.url, alt: "" }) : /* @__PURE__ */ o(fe, { kind: e })
    },
    `${String(n.id)}-${a}`
  )) }) });
}
function Z({ kind: e }) {
  return /* @__PURE__ */ L("div", { className: "bot-media-inspector-empty", children: [
    /* @__PURE__ */ o(fe, { kind: e }),
    /* @__PURE__ */ o("span", { children: "当前素材无法在线预览" })
  ] });
}
function fe({ kind: e }) {
  const t = He[e];
  return /* @__PURE__ */ o(t, { "aria-hidden": "true" });
}
const qe = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件"
}, He = {
  image: ye,
  video: Ce,
  audio: Re,
  file: ue
};
export {
  Ke as M,
  de as R,
  Ne as V,
  Ve as a,
  W as r
};
