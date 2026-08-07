import { c as o, j as k } from "./createLucideIcon-fWv1XcFy.js";
import { e as T } from "./runtime-entry-ClkZDmNs.js";
const x = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
], L = o("download", x);
const S = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
], l = o("image", S);
const _ = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
], D = o("video", _), i = 0.01;
function s(t) {
  if (t.readyState < HTMLMediaElement.HAVE_METADATA) return;
  const a = t.duration, n = Number.isFinite(a) && a > 0 ? Math.min(i, a / 2) : i;
  if (!(t.currentTime >= n))
    try {
      t.currentTime = n;
    } catch {
    }
}
function E({
  src: t,
  preload: a = "metadata",
  onLoadedMetadata: n,
  onLoadedData: u,
  onSeeked: m,
  onFirstFrameReady: h,
  ...y
}) {
  const c = T("");
  function d(e) {
    const r = t || e.currentSrc;
    c.current !== r && (c.current = r, h?.(e));
  }
  function f(e) {
    n?.(e), s(e.currentTarget);
  }
  function F(e) {
    u?.(e);
    const r = e.currentTarget;
    s(r), d(r);
  }
  function g(e) {
    m?.(e), d(e.currentTarget);
  }
  return /* @__PURE__ */ k(
    "video",
    {
      ...y,
      src: t,
      preload: a,
      onLoadedMetadata: f,
      onLoadedData: F,
      onSeeked: g
    }
  );
}
export {
  L as D,
  E as F,
  l as I,
  D as V
};
