import { j as c, a as i } from "./createLucideIcon-CEtb6KSk.js";
import { m as r } from "./select-CpECJwtQ.js";
const s = r.Select, o = r.SelectContent, m = r.SelectItem, S = r.SelectTrigger, h = r.SelectValue;
function d({
  value: t,
  options: n,
  ariaLabel: l,
  onValueChange: a
}) {
  return /* @__PURE__ */ c("div", { className: "workbench-picker", children: /* @__PURE__ */ i(
    s,
    {
      value: String(t),
      onValueChange: (e) => a(Number(e)),
      children: [
        /* @__PURE__ */ c(
          S,
          {
            "aria-label": l,
            className: "workbench-picker-trigger",
            children: /* @__PURE__ */ c(h, {})
          }
        ),
        /* @__PURE__ */ c(o, { align: "start", className: "workbench-picker-content", children: n.map((e) => /* @__PURE__ */ c(
          m,
          {
            className: "workbench-picker-item",
            value: String(e.id),
            children: e.name
          },
          e.id
        )) })
      ]
    }
  ) });
}
export {
  d as W
};
