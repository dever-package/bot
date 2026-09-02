import { j as c, a } from "./runtime-entry-9YhLBCWA.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/select"]);
const e = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!e || Object.keys(e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const s = e.Select, i = e.SelectContent, m = e.SelectItem, d = e.SelectTrigger, u = e.SelectValue;
function h({
  value: n,
  options: r,
  ariaLabel: l,
  onValueChange: o
}) {
  return /* @__PURE__ */ c("div", { className: "workbench-picker", children: /* @__PURE__ */ a(
    s,
    {
      value: String(n),
      onValueChange: (t) => o(Number(t)),
      children: [
        /* @__PURE__ */ c(
          d,
          {
            "aria-label": l,
            className: "workbench-picker-trigger",
            children: /* @__PURE__ */ c(u, {})
          }
        ),
        /* @__PURE__ */ c(i, { align: "start", className: "workbench-picker-content", children: r.map((t) => /* @__PURE__ */ c(
          m,
          {
            className: "workbench-picker-item",
            value: String(t.id),
            children: t.name
          },
          t.id
        )) })
      ]
    }
  ) });
}
export {
  h as W
};
