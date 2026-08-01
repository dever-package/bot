import { a as i, j as o } from "./createLucideIcon-CEtb6KSk.js";
import { a as y, b as V } from "./runtime-entry-CIrzyMsA.js";
import { F as k } from "./file-text-CclNuHuN.js";
import { c as x, C as N } from "./upload-asset-api-DAbIOMVJ.js";
function S({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: l,
  className: c = "",
  style: T,
  onOpen: s,
  resizeControls: C,
  children: h,
  customContentIsPureMedia: w = !1,
  followContent: a = !1,
  followKey: F
}) {
  const p = y(null), u = y(!0), U = x(e, n), d = h != null, f = w || !d && !U && P(n), R = !!s && (!d || w), v = [
    "ws-result-view",
    f ? "" : "nodrag",
    "nopan",
    "nowheel",
    f ? "has-pure-media" : "",
    c
  ].filter(Boolean).join(" ");
  return V(() => {
    if (!a) {
      u.current = !0;
      return;
    }
    const r = p.current;
    r && u.current && (r.scrollTop = r.scrollHeight);
  }, [a, F]), /* @__PURE__ */ i(
    "div",
    {
      role: R ? "button" : void 0,
      tabIndex: R ? 0 : void 0,
      className: v,
      style: T,
      onPointerDown: (r) => {
        (!f || D(r)) && r.stopPropagation();
      },
      onClick: (r) => {
        r.stopPropagation(), !(!s || m(r.target, r.currentTarget) || b(r)) && (r.preventDefault(), s());
      },
      onKeyDown: (r) => {
        r.stopPropagation(), !(!s || m(r.target, r.currentTarget) || r.key !== "Enter" && r.key !== " ") && (r.preventDefault(), s());
      },
      children: [
        /* @__PURE__ */ o(
          "div",
          {
            ref: p,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onScroll: (r) => {
              if (!a)
                return;
              const g = r.currentTarget;
              u.current = g.scrollHeight - g.scrollTop - g.clientHeight < 16;
            },
            children: d ? h : U ? /* @__PURE__ */ o(
              N,
              {
                output: e,
                fallback: t,
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ o(B, { preview: n, label: l ?? t })
          }
        ),
        C
      ]
    }
  );
}
function B({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ i("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ o(
      "img",
      {
        src: e.imageUrl,
        alt: t || "图片结果",
        loading: "lazy",
        decoding: "async"
      }
    ),
    t ? /* @__PURE__ */ o("figcaption", { children: t }) : null
  ] }) : e.videoUrl ? /* @__PURE__ */ i("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ o(
      "video",
      {
        src: e.videoUrl,
        muted: !0,
        playsInline: !0,
        preload: "metadata",
        controls: !0
      },
      e.videoUrl
    ),
    t ? /* @__PURE__ */ o("figcaption", { children: t }) : null
  ] }) : e.audioUrl ? /* @__PURE__ */ i("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ o("audio", { src: e.audioUrl, controls: !0, preload: "metadata" }),
    t ? /* @__PURE__ */ o("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ i(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ o(k, { size: 16 }),
        /* @__PURE__ */ o("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ o(
    N,
    {
      output: H(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function H(e) {
  return e ? { text: e } : void 0;
}
function P(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function m(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t);
}
function b(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  if (!t || t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function D(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  if (n instanceof HTMLVideoElement) {
    const l = n.getBoundingClientRect(), c = Math.min(56, l.height * 0.25);
    return e.clientY >= l.bottom - c;
  }
  return m(t, e.currentTarget);
}
export {
  S as CanvasResultView
};
