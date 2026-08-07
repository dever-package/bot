import { j as o } from "./createLucideIcon-fWv1XcFy.js";
import { m as a } from "./media-inspector-gallery-TNes-xFo.js";
const l = "z-[100]", i = 2e3, r = i + 100, c = a.HoverTip;
function p({
  label: t,
  triggerClassName: e = "inline-flex shrink-0",
  children: n
}) {
  return /* @__PURE__ */ o(
    c,
    {
      content: t,
      side: "top",
      sideOffset: 7,
      layerZIndex: r,
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
  r as a,
  i as b,
  f as c,
  l as d
};
