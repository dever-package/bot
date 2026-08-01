import { a as c, j as s, F as _ } from "./createLucideIcon-CEtb6KSk.js";
import { C as U } from "./chevron-right-BCx0yky9.js";
import { E as W } from "./eye-EJzwoxVH.js";
import { F as v } from "./folder-tree-DXj3CroT.js";
import { P as D } from "./play-cbWwOmIe.js";
import { S as C } from "./save-CZ_LAFk4.js";
import { U as F } from "./upload-I0iT6F7Q.js";
import { U as z, W as A } from "./workflow-Cs2Tatpf.js";
import { Z as $ } from "./zap-Cf0iKERu.js";
import { a as B, u as K, c as O } from "./runtime-entry-CIrzyMsA.js";
import { b as j } from "./power-menu-DV7gh-v8.js";
import { P as G } from "./space-power-icon-DPR3KYFq.js";
import { r as Z, b as H } from "./upload-asset-api-DAbIOMVJ.js";
const L = [
  {
    key: "start",
    label: "开始",
    description: "启动连接的创作节点，直到保存或展示。"
  },
  { key: "import", label: "导入", description: "导入资产并连接到当前节点。" },
  {
    key: "save",
    label: "保存",
    description: "将上游结果保存为当前资产类型的资产。"
  },
  { key: "display", label: "展示", description: "展示上游节点的结果。" }
], I = 292, V = 248, M = 420, g = 14;
function we({
  menu: n,
  flows: i,
  powers: a,
  powerCategories: e,
  roles: r,
  onClose: t,
  onSelectFlow: d,
  onSelectFunction: l,
  onSelectGroup: m,
  onSelectRole: u,
  onSelectPower: x
}) {
  const p = Q(n), N = B(null), [b, w] = K(null), P = b?.groupID || 0, f = O(
    () => j(
      a,
      e,
      (o) => o.cate_id
    ),
    [e, a]
  ), S = f.groups.find(
    (o) => o.category.id === P
  ) || null, h = [];
  function T(o, y) {
    N.current && w({
      groupID: o.category.id,
      ...ne(
        N.current,
        y,
        o.powers.length
      )
    });
  }
  return (f.basicPowers.length > 0 || f.groups.length > 0) && h.push(
    X(
      f,
      P,
      T,
      () => w(null),
      x
    )
  ), r.length > 0 && h.push(
    k({
      sectionKey: "roles",
      title: "智能体",
      items: r,
      itemKey: (o) => String(o.id || o.role_key || o.name),
      itemClassName: "is-agent",
      label: (o) => o.name,
      icon: () => /* @__PURE__ */ s(z, { size: 16 }),
      onSelect: u
    })
  ), i.length > 0 && h.push(
    k({
      sectionKey: "flows",
      title: "流程",
      items: i,
      itemKey: (o) => String(o.id || o.key || o.name),
      itemClassName: "is-flow",
      label: (o) => o.name,
      icon: () => /* @__PURE__ */ s(A, { size: 16 }),
      onSelect: d
    })
  ), h.push(q(l, m)), /* @__PURE__ */ c(_, { children: [
    /* @__PURE__ */ s(
      "div",
      {
        className: "ws-add-menu-backdrop",
        onMouseDown: t,
        onContextMenu: (o) => {
          o.preventDefault(), t();
        }
      }
    ),
    /* @__PURE__ */ c(
      "section",
      {
        ref: N,
        className: "ws-add-menu custom-scrollbar",
        style: { left: p.x, top: p.y, maxHeight: p.maxHeight },
        onMouseDown: (o) => o.stopPropagation(),
        onMouseLeave: () => w(null),
        children: [
          /* @__PURE__ */ s("div", { className: "ws-add-menu-head", children: /* @__PURE__ */ s("strong", { children: n.connection ? "引用该节点生成" : "添加节点" }) }),
          /* @__PURE__ */ s(
            "div",
            {
              className: "ws-add-menu-body",
              onScroll: () => w(null),
              children: h.map((o, y) => /* @__PURE__ */ c("div", { children: [
                o,
                y < h.length - 1 ? /* @__PURE__ */ s("div", { className: "ws-add-divider" }) : null
              ] }, y))
            }
          ),
          S ? /* @__PURE__ */ s(
            Y,
            {
              group: S,
              side: ee(p.x),
              top: b?.top || 0,
              maxHeight: b?.maxHeight || M,
              onSelect: x
            }
          ) : null
        ]
      }
    )
  ] });
}
function k({
  sectionKey: n,
  title: i,
  items: a,
  itemKey: e,
  itemClassName: r,
  label: t,
  description: d,
  icon: l,
  onSelect: m
}) {
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ s("div", { className: "ws-add-section-title", children: i }),
    R({
      items: a,
      itemKey: e,
      itemClassName: r,
      label: t,
      description: d,
      icon: l,
      onSelect: m
    })
  ] }, n);
}
function X(n, i, a, e, r) {
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ s("div", { className: "ws-add-section-title", children: "能力" }),
    /* @__PURE__ */ c("div", { className: "ws-add-menu-list", children: [
      n.basicPowers.map((t) => /* @__PURE__ */ s(
        E,
        {
          power: t,
          onMouseEnter: e,
          onSelect: r
        },
        t.key || t.id
      )),
      n.groups.map((t) => /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: `ws-add-item is-power-group${i === t.category.id ? " is-open" : ""}`,
          "aria-haspopup": "menu",
          "aria-expanded": i === t.category.id,
          onMouseEnter: (d) => a(t, d.currentTarget),
          onFocus: (d) => a(t, d.currentTarget),
          onClick: (d) => a(t, d.currentTarget),
          children: [
            /* @__PURE__ */ s("span", { className: "ws-add-icon", children: /* @__PURE__ */ s(v, { size: 16 }) }),
            /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
              /* @__PURE__ */ s("span", { className: "ws-add-label", children: t.category.name }),
              /* @__PURE__ */ c("span", { className: "ws-add-desc", children: [
                t.powers.length,
                " 项能力"
              ] })
            ] }),
            /* @__PURE__ */ s(U, { className: "ws-add-submenu-arrow", size: 15 })
          ]
        },
        t.category.id
      ))
    ] })
  ] }, "powers");
}
function Y({
  group: n,
  side: i,
  top: a,
  maxHeight: e,
  onSelect: r
}) {
  return /* @__PURE__ */ c(
    "aside",
    {
      className: `ws-add-submenu-panel is-${i} custom-scrollbar`,
      role: "menu",
      "aria-label": n.category.name,
      style: { top: a, maxHeight: e },
      onMouseDown: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: "ws-add-submenu-head", children: [
          /* @__PURE__ */ s(v, { size: 15 }),
          /* @__PURE__ */ s("strong", { children: n.category.name })
        ] }),
        /* @__PURE__ */ s("div", { className: "ws-add-menu-list", children: n.powers.map((t) => /* @__PURE__ */ s(
          E,
          {
            power: t,
            onSelect: r
          },
          t.key || t.id
        )) })
      ]
    }
  );
}
function E({
  power: n,
  onMouseEnter: i,
  onSelect: a
}) {
  const e = Z(n).kindName;
  return /* @__PURE__ */ s(H, { label: `${n.name} · ${e}`, children: /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "ws-add-item is-power",
      role: "menuitem",
      onMouseEnter: i,
      onFocus: i,
      onClick: () => a(n),
      children: [
        /* @__PURE__ */ s("span", { className: "ws-add-icon", children: /* @__PURE__ */ s(G, { power: n, size: 16 }) }),
        /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
          /* @__PURE__ */ s("span", { className: "ws-add-label", children: n.name }),
          /* @__PURE__ */ s("span", { className: "ws-add-desc", children: e })
        ] })
      ]
    }
  ) });
}
function q(n, i) {
  const a = [
    ...L.map((e) => ({
      key: e.key,
      label: e.label,
      description: e.description,
      className: e.key === "import" ? "is-function is-import" : "is-function",
      Icon: J(e.key),
      select: () => n(e)
    })),
    {
      key: "group",
      label: "分组",
      description: "组织并统一运行一组节点",
      className: "is-group",
      Icon: v,
      select: i
    }
  ];
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ s("div", { className: "ws-add-section-title", children: "功能" }),
    R({
      items: a,
      itemKey: (e) => e.key,
      itemClassName: (e) => e.className,
      label: (e) => e.label,
      description: (e) => e.description,
      icon: (e) => {
        const r = e.Icon;
        return /* @__PURE__ */ s(r, { size: 16 });
      },
      onSelect: (e) => e.select()
    })
  ] }, "functions");
}
function R({
  items: n,
  itemKey: i,
  itemClassName: a,
  label: e,
  description: r,
  icon: t,
  onSelect: d
}) {
  return /* @__PURE__ */ s("div", { className: "ws-add-menu-list", children: n.map((l) => {
    const m = typeof a == "function" ? a(l) : a, u = r?.(l) || "";
    return /* @__PURE__ */ s(
      H,
      {
        label: u ? `${e(l)} · ${u}` : e(l),
        children: /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: `ws-add-item ${m}`.trim(),
            onClick: () => d(l),
            children: [
              /* @__PURE__ */ s("span", { className: "ws-add-icon", children: t(l) }),
              /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
                /* @__PURE__ */ s("span", { className: "ws-add-label", children: e(l) }),
                u ? /* @__PURE__ */ s("span", { className: "ws-add-desc", children: u }) : null
              ] })
            ]
          }
        )
      },
      i(l)
    );
  }) });
}
function J(n) {
  return n === "start" ? D : n === "import" ? F : n === "save" ? C : n === "display" ? W : $;
}
function Q(n) {
  if (typeof window > "u")
    return { x: n.x, y: n.y, maxHeight: 520 };
  const i = 14, a = 62, e = Math.min(I, window.innerWidth - i * 2), r = Math.min(
    520,
    Math.max(180, window.innerHeight - a - i)
  ), t = n.y + r > window.innerHeight - i ? n.y - r : n.y;
  return {
    x: Math.min(
      Math.max(i, n.x),
      Math.max(i, window.innerWidth - e - i)
    ),
    y: Math.min(
      Math.max(a, t),
      Math.max(a, window.innerHeight - r - i)
    ),
    maxHeight: r
  };
}
function ee(n) {
  return typeof window > "u" ? "right" : n + I + V > window.innerWidth ? "left" : "right";
}
function ne(n, i, a) {
  if (typeof window > "u")
    return { top: 0, maxHeight: M };
  const e = n.getBoundingClientRect(), r = i.getBoundingClientRect(), t = window.innerHeight, d = Math.min(
    M,
    Math.max(120, t - g * 2)
  ), l = Math.min(d, 48 + a * 45);
  return {
    top: Math.min(
      Math.max(g, r.top),
      Math.max(
        g,
        t - l - g
      )
    ) - e.top,
    maxHeight: d
  };
}
export {
  we as AddNodeMenu,
  L as canvasFunctionOptions
};
