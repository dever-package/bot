import { h as n } from "./runtime-entry-CIrzyMsA.js";
import { b } from "./site-config-BtBYhKpy.js";
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
function l(t, a) {
  n(() => {
    if (typeof document > "u")
      return;
    const e = document.documentElement, y = e.getAttribute("data-body-appearance"), p = s.map((r) => ({
      property: r,
      value: e.style.getPropertyValue(r),
      priority: e.style.getPropertyPriority(r)
    })), i = b(t, a);
    e.setAttribute("data-body-appearance", "active");
    for (const r of s) {
      const o = i[r];
      o ? e.style.setProperty(r, o) : e.style.removeProperty(r);
    }
    return () => {
      y == null ? e.removeAttribute("data-body-appearance") : e.setAttribute("data-body-appearance", y);
      for (const { property: r, value: o, priority: d } of p)
        o ? e.style.setProperty(r, o, d) : e.style.removeProperty(r);
    };
  }, [t, a]);
}
export {
  l as u
};
