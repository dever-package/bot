import { a as o } from "./_commonjsHelpers-CTFd9u1x.js";
import { m as r } from "./media-inspector-gallery-nBFOIame.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./clipboard-DCeMsMAc.css", import.meta.url).href]);
const l = "z-[100]", a = 2e3, i = a + 100, s = r.HoverTip;
function p({
  label: t,
  triggerClassName: e = "inline-flex shrink-0",
  children: n
}) {
  return /* @__PURE__ */ o(
    s,
    {
      content: t,
      side: "top",
      sideOffset: 7,
      layerZIndex: i,
      className: "agent-chat-tooltip-content max-w-64",
      children: /* @__PURE__ */ o("span", { className: e, children: n })
    }
  );
}
async function f(t) {
  if (typeof window < "u" && window.isSecureContext && navigator.clipboard?.writeText)
    try {
      await navigator.clipboard.writeText(t);
      return;
    } catch {
    }
  if (typeof document > "u")
    throw new Error("Clipboard API is unavailable");
  const e = document.createElement("textarea");
  e.value = t, e.setAttribute("readonly", "true"), e.style.position = "fixed", e.style.left = "-9999px", e.style.opacity = "0", document.body.appendChild(e);
  try {
    if (e.select(), e.setSelectionRange(0, t.length), !document.execCommand("copy"))
      throw new Error("copy failed");
  } finally {
    e.remove();
  }
}
export {
  p as A,
  i as a,
  a as b,
  f as c,
  l as d
};
