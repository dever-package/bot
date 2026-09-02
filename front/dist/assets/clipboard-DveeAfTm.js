import { j as n } from "./runtime-entry-9YhLBCWA.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./clipboard-DCeMsMAc.css", import.meta.url).href]);
const c = "z-[100]", i = 2e3, a = i + 100;
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const s = o.HoverTip;
function l({
  label: t,
  triggerClassName: e = "inline-flex shrink-0",
  children: r
}) {
  return /* @__PURE__ */ n(
    s,
    {
      content: t,
      side: "top",
      sideOffset: 7,
      layerZIndex: a,
      className: "agent-chat-tooltip-content max-w-64",
      children: /* @__PURE__ */ n("span", { className: e, children: r })
    }
  );
}
async function p(t) {
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
  l as A,
  a,
  i as b,
  p as c,
  c as d
};
