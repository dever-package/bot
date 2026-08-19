import { a as c, j as n, F as x } from "./preloadable-Bomi5PEU.js";
import { a as S, u as p, b as M } from "./_commonjsHelpers-61wyk6v6.js";
import { S as N, i as P, o as D } from "./vendor-icons-B3DKX3la.js";
import { b as C, P as y } from "./power-icon-HeeWAKmZ.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu"]);
const s = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!s || Object.keys(s).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const v = s.DropdownMenuItem, E = s.DropdownMenuPortal, I = s.DropdownMenuSub, j = s.DropdownMenuSubContent, F = s.DropdownMenuSubTrigger, L = 12;
function q({
  open: o,
  value: t,
  powers: r,
  categories: i,
  appearance: a,
  portalContainer: k,
  onValueChange: d
}) {
  const [h, g] = S(""), u = p(
    () => C(r, i, (e) => e.cateID),
    [i, r]
  ), b = p(
    () => R(u.basicPowers, u.groups),
    [u.basicPowers, u.groups]
  ), m = h.trim().toLocaleLowerCase(), f = p(
    () => m ? b.filter(
      (e) => [e.power.name, e.power.key, e.categoryName].filter(Boolean).join(" ").toLocaleLowerCase().includes(m)
    ) : [],
    [m, b]
  );
  return M(() => {
    o || g("");
  }, [o]), /* @__PURE__ */ c(x, { children: [
    r.length > L ? /* @__PURE__ */ c("div", { className: "mx-0.5 mb-1.5 mt-0.5 flex h-9 items-center gap-2 border-b border-border px-2 text-muted-foreground [&>svg]:size-3.5 [&>svg]:shrink-0", children: [
      /* @__PURE__ */ n(N, { "aria-hidden": "true" }),
      /* @__PURE__ */ n(
        "input",
        {
          type: "search",
          value: h,
          placeholder: "搜索能力",
          "aria-label": "搜索能力",
          autoComplete: "off",
          className: "min-w-0 flex-1 border-0 bg-transparent text-xs text-foreground outline-none [letter-spacing:0] placeholder:text-muted-foreground",
          onChange: (e) => g(e.target.value),
          onKeyDown: (e) => {
            e.key !== "Escape" && e.stopPropagation();
          }
        }
      )
    ] }) : null,
    m ? f.length > 0 ? f.map((e) => /* @__PURE__ */ n(
      w,
      {
        power: e.power,
        categoryName: e.categoryName,
        selected: e.power.id === t,
        appearance: a,
        onSelect: d
      },
      e.power.id
    )) : /* @__PURE__ */ n("div", { className: "px-2.5 py-4 text-center text-xs text-muted-foreground", children: "没有匹配的能力" }) : /* @__PURE__ */ c(x, { children: [
      u.basicPowers.map((e) => /* @__PURE__ */ n(
        w,
        {
          power: e,
          selected: e.id === t,
          appearance: a,
          onSelect: d
        },
        e.id
      )),
      u.groups.map((e) => /* @__PURE__ */ c(I, { children: [
        /* @__PURE__ */ c(
          F,
          {
            className: _(a),
            children: [
              /* @__PURE__ */ n(P, { "aria-hidden": "true" }),
              /* @__PURE__ */ n("span", { className: "min-w-0 flex-1 truncate", children: e.category.name }),
              /* @__PURE__ */ n("small", { children: e.powers.length })
            ]
          }
        ),
        /* @__PURE__ */ n(E, { container: k, children: /* @__PURE__ */ n(
          j,
          {
            className: z(a),
            children: e.powers.map((l) => /* @__PURE__ */ n(
              w,
              {
                power: l,
                selected: l.id === t,
                appearance: a,
                onSelect: d
              },
              l.id
            ))
          }
        ) })
      ] }, e.category.id))
    ] })
  ] });
}
function w({
  power: o,
  categoryName: t,
  selected: r,
  appearance: i,
  onSelect: a
}) {
  return /* @__PURE__ */ c(
    v,
    {
      className: T(i, r),
      onSelect: () => a(o.id),
      children: [
        /* @__PURE__ */ n(y, { power: o, size: 14, className: "shrink-0" }),
        /* @__PURE__ */ c("span", { className: "min-w-0 flex-1 truncate", children: [
          t ? `${t} / ` : "",
          o.name
        ] }),
        r ? /* @__PURE__ */ n(D, { "aria-hidden": "true" }) : null
      ]
    }
  );
}
function R(o, t) {
  return [
    ...o.map((r) => ({ power: r, categoryName: "" })),
    ...t.flatMap(
      (r) => r.powers.map((i) => ({
        power: i,
        categoryName: r.category.name
      }))
    )
  ];
}
function T(o, t) {
  return `${o === "workbench" ? "workbench-picker-item workbench-power-picker-item" : "agent-chat-execution-menu-item agent-chat-execution-power-item"}${t ? " is-selected" : ""}`;
}
function _(o) {
  return o === "workbench" ? "workbench-picker-item workbench-power-group-trigger" : "agent-chat-execution-menu-item agent-chat-execution-group-trigger";
}
function z(o) {
  return o === "workbench" ? "workbench-picker-content workbench-power-picker-subcontent" : "agent-chat-execution-menu agent-chat-execution-submenu";
}
export {
  q as P
};
