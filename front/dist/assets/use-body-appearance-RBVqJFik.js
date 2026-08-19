import { g as d } from "./_commonjsHelpers-61wyk6v6.js";
import { b as u } from "./site-config-C63CM9jT.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./use-body-appearance-DVQpqw1G.css", import.meta.url).href]);
const s = [
  "--body-work-bg",
  "--body-work-canvas",
  "--body-work-surface",
  "--body-work-surface-raised",
  "--body-work-text",
  "--body-work-muted",
  "--body-work-line",
  "--body-work-active",
  "--body-work-shadow",
  "--body-work-primary",
  "--body-work-primary-strong",
  "--body-work-primary-bright",
  "--body-work-primary-soft",
  "--body-work-on-primary",
  "--body-work-ring"
];
function w(t, a) {
  d(() => {
    if (typeof document > "u")
      return;
    const e = document.documentElement, y = e.getAttribute("data-body-appearance"), n = s.map((r) => ({
      property: r,
      value: e.style.getPropertyValue(r),
      priority: e.style.getPropertyPriority(r)
    })), p = u(t, a);
    e.setAttribute("data-body-appearance", "active");
    for (const r of s) {
      const o = p[r];
      o ? e.style.setProperty(r, o) : e.style.removeProperty(r);
    }
    return () => {
      y == null ? e.removeAttribute("data-body-appearance") : e.setAttribute("data-body-appearance", y);
      for (const { property: r, value: o, priority: i } of n)
        o ? e.style.setProperty(r, o, i) : e.style.removeProperty(r);
    };
  }, [t, a]);
}
export {
  w as u
};
