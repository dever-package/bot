import { a as c, j as t, F as _ } from "./createLucideIcon-fWv1XcFy.js";
import { C as T } from "./chevron-right-DDWuhzEV.js";
import { E as U } from "./eye-D9RIhpvx.js";
import { F as x } from "./music-DaWYUdzx.js";
import { P as D } from "./play-Cgnd9XVW.js";
import { S as W } from "./save-kV_dHGFf.js";
import { U as C } from "./upload-BAn1zipX.js";
import { U as F, W as z } from "./workflow-DCWxX26l.js";
import { Z as A } from "./zap-CEP3W7uy.js";
import { e as $, b as B, i as K } from "./runtime-entry-ClkZDmNs.js";
import { b as O } from "./power-menu-DU0NNyd7.js";
import { r as j, P as G } from "./power-icon-B4F9A-tn.js";
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
], H = 292, Z = 248, v = 420, N = 14;
function he({
  menu: e,
  flows: i,
  powers: a,
  powerCategories: n,
  roles: r,
  onClose: s,
  onSelectFlow: d,
  onSelectFunction: l,
  onSelectGroup: m,
  onSelectRole: u,
  onSelectPower: h
}) {
  const w = J(e), b = $(null), [M, f] = B(null), P = M?.groupID || 0, g = K(
    () => O(
      a,
      n,
      (o) => o.cate_id
    ),
    [n, a]
  ), S = g.groups.find(
    (o) => o.category.id === P
  ) || null, p = [];
  function R(o, y) {
    b.current && f({
      groupID: o.category.id,
      ...ee(
        b.current,
        y,
        o.powers.length
      )
    });
  }
  return (g.basicPowers.length > 0 || g.groups.length > 0) && p.push(
    V(
      g,
      P,
      R,
      () => f(null),
      h
    )
  ), r.length > 0 && p.push(
    k({
      sectionKey: "roles",
      title: "智能体",
      items: r,
      itemKey: (o) => String(o.id || o.role_key || o.name),
      itemClassName: "is-agent",
      label: (o) => o.name,
      icon: () => /* @__PURE__ */ t(F, { size: 16 }),
      onSelect: u
    })
  ), i.length > 0 && p.push(
    k({
      sectionKey: "flows",
      title: "流程",
      items: i,
      itemKey: (o) => String(o.id || o.key || o.name),
      itemClassName: "is-flow",
      label: (o) => o.name,
      icon: () => /* @__PURE__ */ t(z, { size: 16 }),
      onSelect: d
    })
  ), p.push(Y(l, m)), /* @__PURE__ */ c(_, { children: [
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-add-menu-backdrop",
        onMouseDown: s,
        onContextMenu: (o) => {
          o.preventDefault(), s();
        }
      }
    ),
    /* @__PURE__ */ c(
      "section",
      {
        ref: b,
        className: "ws-add-menu custom-scrollbar",
        style: { left: w.x, top: w.y, maxHeight: w.maxHeight },
        onMouseDown: (o) => o.stopPropagation(),
        onMouseLeave: () => f(null),
        children: [
          /* @__PURE__ */ t("div", { className: "ws-add-menu-head", children: /* @__PURE__ */ t("strong", { children: e.connection ? "引用该节点生成" : "添加节点" }) }),
          /* @__PURE__ */ t(
            "div",
            {
              className: "ws-add-menu-body",
              onScroll: () => f(null),
              children: p.map((o, y) => /* @__PURE__ */ c("div", { children: [
                o,
                y < p.length - 1 ? /* @__PURE__ */ t("div", { className: "ws-add-divider" }) : null
              ] }, y))
            }
          ),
          S ? /* @__PURE__ */ t(
            X,
            {
              group: S,
              side: Q(w.x),
              top: M?.top || 0,
              maxHeight: M?.maxHeight || v,
              onSelect: h
            }
          ) : null
        ]
      }
    )
  ] });
}
function k({
  sectionKey: e,
  title: i,
  items: a,
  itemKey: n,
  itemClassName: r,
  label: s,
  description: d,
  icon: l,
  onSelect: m
}) {
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: i }),
    E({
      items: a,
      itemKey: n,
      itemClassName: r,
      label: s,
      description: d,
      icon: l,
      onSelect: m
    })
  ] }, e);
}
function V(e, i, a, n, r) {
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "能力" }),
    /* @__PURE__ */ c("div", { className: "ws-add-menu-list", children: [
      e.basicPowers.map((s) => /* @__PURE__ */ t(
        I,
        {
          power: s,
          onMouseEnter: n,
          onSelect: r
        },
        s.key || s.id
      )),
      e.groups.map((s) => /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: `ws-add-item is-power-group${i === s.category.id ? " is-open" : ""}`,
          "aria-haspopup": "menu",
          "aria-expanded": i === s.category.id,
          onMouseEnter: (d) => a(s, d.currentTarget),
          onFocus: (d) => a(s, d.currentTarget),
          onClick: (d) => a(s, d.currentTarget),
          children: [
            /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(x, { size: 16 }) }),
            /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
              /* @__PURE__ */ t("span", { className: "ws-add-label", children: s.category.name }),
              /* @__PURE__ */ c("span", { className: "ws-add-desc", children: [
                s.powers.length,
                " 项能力"
              ] })
            ] }),
            /* @__PURE__ */ t(T, { className: "ws-add-submenu-arrow", size: 15 })
          ]
        },
        s.category.id
      ))
    ] })
  ] }, "powers");
}
function X({
  group: e,
  side: i,
  top: a,
  maxHeight: n,
  onSelect: r
}) {
  return /* @__PURE__ */ c(
    "aside",
    {
      className: `ws-add-submenu-panel is-${i} custom-scrollbar`,
      role: "menu",
      "aria-label": e.category.name,
      style: { top: a, maxHeight: n },
      onMouseDown: (s) => s.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: "ws-add-submenu-head", children: [
          /* @__PURE__ */ t(x, { size: 15 }),
          /* @__PURE__ */ t("strong", { children: e.category.name })
        ] }),
        /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.powers.map((s) => /* @__PURE__ */ t(
          I,
          {
            power: s,
            onSelect: r
          },
          s.key || s.id
        )) })
      ]
    }
  );
}
function I({
  power: e,
  onMouseEnter: i,
  onSelect: a
}) {
  const n = j(e).kindName;
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "ws-add-item is-power",
      role: "menuitem",
      title: `${e.name} · ${n}`,
      onMouseEnter: i,
      onFocus: i,
      onClick: () => a(e),
      children: [
        /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(G, { power: e, size: 16 }) }),
        /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
          /* @__PURE__ */ t("span", { className: "ws-add-label", children: e.name }),
          /* @__PURE__ */ t("span", { className: "ws-add-desc", children: n })
        ] })
      ]
    }
  );
}
function Y(e, i) {
  const a = [
    ...L.map((n) => ({
      key: n.key,
      label: n.label,
      description: n.description,
      className: n.key === "import" ? "is-function is-import" : "is-function",
      Icon: q(n.key),
      select: () => e(n)
    })),
    {
      key: "group",
      label: "分组",
      description: "组织并统一运行一组节点",
      className: "is-group",
      Icon: x,
      select: i
    }
  ];
  return /* @__PURE__ */ c("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "功能" }),
    E({
      items: a,
      itemKey: (n) => n.key,
      itemClassName: (n) => n.className,
      label: (n) => n.label,
      description: (n) => n.description,
      icon: (n) => {
        const r = n.Icon;
        return /* @__PURE__ */ t(r, { size: 16 });
      },
      onSelect: (n) => n.select()
    })
  ] }, "functions");
}
function E({
  items: e,
  itemKey: i,
  itemClassName: a,
  label: n,
  description: r,
  icon: s,
  onSelect: d
}) {
  return /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.map((l) => {
    const m = typeof a == "function" ? a(l) : a, u = r?.(l) || "", h = n(l);
    return /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `ws-add-item ${m}`.trim(),
        title: u ? `${h} · ${u}` : h,
        onClick: () => d(l),
        children: [
          /* @__PURE__ */ t("span", { className: "ws-add-icon", children: s(l) }),
          /* @__PURE__ */ c("span", { className: "ws-add-copy", children: [
            /* @__PURE__ */ t("span", { className: "ws-add-label", children: h }),
            u ? /* @__PURE__ */ t("span", { className: "ws-add-desc", children: u }) : null
          ] })
        ]
      },
      i(l)
    );
  }) });
}
function q(e) {
  return e === "start" ? D : e === "import" ? C : e === "save" ? W : e === "display" ? U : A;
}
function J(e) {
  if (typeof window > "u")
    return { x: e.x, y: e.y, maxHeight: 520 };
  const i = 14, a = 62, n = Math.min(H, window.innerWidth - i * 2), r = Math.min(
    520,
    Math.max(180, window.innerHeight - a - i)
  ), s = e.y + r > window.innerHeight - i ? e.y - r : e.y;
  return {
    x: Math.min(
      Math.max(i, e.x),
      Math.max(i, window.innerWidth - n - i)
    ),
    y: Math.min(
      Math.max(a, s),
      Math.max(a, window.innerHeight - r - i)
    ),
    maxHeight: r
  };
}
function Q(e) {
  return typeof window > "u" ? "right" : e + H + Z > window.innerWidth ? "left" : "right";
}
function ee(e, i, a) {
  if (typeof window > "u")
    return { top: 0, maxHeight: v };
  const n = e.getBoundingClientRect(), r = i.getBoundingClientRect(), s = window.innerHeight, d = Math.min(
    v,
    Math.max(120, s - N * 2)
  ), l = Math.min(d, 48 + a * 45);
  return {
    top: Math.min(
      Math.max(N, r.top),
      Math.max(
        N,
        s - l - N
      )
    ) - n.top,
    maxHeight: d
  };
}
export {
  he as AddNodeMenu,
  L as canvasFunctionOptions
};
