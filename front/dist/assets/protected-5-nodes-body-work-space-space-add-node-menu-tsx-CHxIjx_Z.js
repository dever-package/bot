import { a as r, j as t, F as E } from "./runtime-entry-9YhLBCWA.js";
import { i as x, d as T, j as D, L as W, e as U, k as z, Z as A, l as C, W as F } from "./vendor-icons-DgDZMD4Q.js";
import { d as $, a as B, u as K } from "./_commonjsHelpers-C76sftkf.js";
import { b as j, r as L, P as O } from "./power-icon-Bx5F2rhr.js";
const G = [
  {
    key: "start",
    label: "开始",
    description: "启动连接的创作节点，直到保存或展示。"
  },
  { key: "import", label: "引用", description: "选择资产并引用到当前节点。" },
  {
    key: "save",
    label: "保存",
    description: "将上游结果保存为当前资产类型的资产。"
  },
  { key: "display", label: "展示", description: "展示上游节点的结果。" }
], H = 292, Z = 248, v = 420, N = 14;
function ie({
  menu: e,
  flows: a,
  powers: i,
  powerCategories: n,
  roles: o,
  onClose: s,
  onSelectFlow: d,
  onSelectFunction: l,
  onSelectGroup: m,
  onSelectRole: u,
  onSelectPower: h
}) {
  const w = J(e), b = $(null), [M, g] = B(null), P = M?.groupID || 0, y = K(
    () => j(i, n, (c) => c.cate_id),
    [n, i]
  ), k = y.groups.find((c) => c.category.id === P) || null, p = [];
  function _(c, f) {
    b.current && g({
      groupID: c.category.id,
      ...ee(
        b.current,
        f,
        c.powers.length
      )
    });
  }
  return (y.basicPowers.length > 0 || y.groups.length > 0) && p.push(
    V(
      y,
      P,
      _,
      () => g(null),
      h
    )
  ), o.length > 0 && p.push(
    S({
      sectionKey: "roles",
      title: "智能体",
      items: o,
      itemKey: (c) => String(c.id || c.role_key || c.name),
      itemClassName: "is-agent",
      label: (c) => c.name,
      icon: () => /* @__PURE__ */ t(C, { size: 16 }),
      onSelect: u
    })
  ), a.length > 0 && p.push(
    S({
      sectionKey: "flows",
      title: "流程",
      items: a,
      itemKey: (c) => String(c.id || c.key || c.name),
      itemClassName: "is-flow",
      label: (c) => c.name,
      icon: () => /* @__PURE__ */ t(F, { size: 16 }),
      onSelect: d
    })
  ), p.push(Y(l, m)), /* @__PURE__ */ r(E, { children: [
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-add-menu-backdrop",
        onMouseDown: s,
        onContextMenu: (c) => {
          c.preventDefault(), s();
        }
      }
    ),
    /* @__PURE__ */ r(
      "section",
      {
        ref: b,
        className: "ws-add-menu custom-scrollbar",
        style: { left: w.x, top: w.y, maxHeight: w.maxHeight },
        onMouseDown: (c) => c.stopPropagation(),
        onMouseLeave: () => g(null),
        children: [
          /* @__PURE__ */ t("div", { className: "ws-add-menu-head", children: /* @__PURE__ */ t("strong", { children: e.connection ? "引用该节点生成" : "添加节点" }) }),
          /* @__PURE__ */ t(
            "div",
            {
              className: "ws-add-menu-body",
              onScroll: () => g(null),
              children: p.map((c, f) => /* @__PURE__ */ r("div", { children: [
                c,
                f < p.length - 1 ? /* @__PURE__ */ t("div", { className: "ws-add-divider" }) : null
              ] }, f))
            }
          ),
          k ? /* @__PURE__ */ t(
            X,
            {
              group: k,
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
function S({
  sectionKey: e,
  title: a,
  items: i,
  itemKey: n,
  itemClassName: o,
  label: s,
  description: d,
  icon: l,
  onSelect: m
}) {
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: a }),
    R({
      items: i,
      itemKey: n,
      itemClassName: o,
      label: s,
      description: d,
      icon: l,
      onSelect: m
    })
  ] }, e);
}
function V(e, a, i, n, o) {
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "能力" }),
    /* @__PURE__ */ r("div", { className: "ws-add-menu-list", children: [
      e.basicPowers.map((s) => /* @__PURE__ */ t(
        I,
        {
          power: s,
          onMouseEnter: n,
          onSelect: o
        },
        s.key || s.id
      )),
      e.groups.map((s) => /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: `ws-add-item is-power-group${a === s.category.id ? " is-open" : ""}`,
          "aria-haspopup": "menu",
          "aria-expanded": a === s.category.id,
          onMouseEnter: (d) => i(s, d.currentTarget),
          onFocus: (d) => i(s, d.currentTarget),
          onClick: (d) => i(s, d.currentTarget),
          children: [
            /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(x, { size: 16 }) }),
            /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
              /* @__PURE__ */ t("span", { className: "ws-add-label", children: s.category.name }),
              /* @__PURE__ */ r("span", { className: "ws-add-desc", children: [
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
  side: a,
  top: i,
  maxHeight: n,
  onSelect: o
}) {
  return /* @__PURE__ */ r(
    "aside",
    {
      className: `ws-add-submenu-panel is-${a} custom-scrollbar`,
      role: "menu",
      "aria-label": e.category.name,
      style: { top: i, maxHeight: n },
      onMouseDown: (s) => s.stopPropagation(),
      children: [
        /* @__PURE__ */ r("div", { className: "ws-add-submenu-head", children: [
          /* @__PURE__ */ t(x, { size: 15 }),
          /* @__PURE__ */ t("strong", { children: e.category.name })
        ] }),
        /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.powers.map((s) => /* @__PURE__ */ t(
          I,
          {
            power: s,
            onSelect: o
          },
          s.key || s.id
        )) })
      ]
    }
  );
}
function I({
  power: e,
  onMouseEnter: a,
  onSelect: i
}) {
  const n = L(e).kindName;
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "ws-add-item is-power",
      role: "menuitem",
      title: `${e.name} · ${n}`,
      onMouseEnter: a,
      onFocus: a,
      onClick: () => i(e),
      children: [
        /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(O, { power: e, size: 16 }) }),
        /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
          /* @__PURE__ */ t("span", { className: "ws-add-label", children: e.name }),
          /* @__PURE__ */ t("span", { className: "ws-add-desc", children: n })
        ] })
      ]
    }
  );
}
function Y(e, a) {
  const i = [
    ...G.map((n) => ({
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
      select: a
    }
  ];
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "功能" }),
    R({
      items: i,
      itemKey: (n) => n.key,
      itemClassName: (n) => n.className,
      label: (n) => n.label,
      description: (n) => n.description,
      icon: (n) => {
        const o = n.Icon;
        return /* @__PURE__ */ t(o, { size: 16 });
      },
      onSelect: (n) => n.select()
    })
  ] }, "functions");
}
function R({
  items: e,
  itemKey: a,
  itemClassName: i,
  label: n,
  description: o,
  icon: s,
  onSelect: d
}) {
  return /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.map((l) => {
    const m = typeof i == "function" ? i(l) : i, u = o?.(l) || "", h = n(l);
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: `ws-add-item ${m}`.trim(),
        title: u ? `${h} · ${u}` : h,
        onClick: () => d(l),
        children: [
          /* @__PURE__ */ t("span", { className: "ws-add-icon", children: s(l) }),
          /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
            /* @__PURE__ */ t("span", { className: "ws-add-label", children: h }),
            u ? /* @__PURE__ */ t("span", { className: "ws-add-desc", children: u }) : null
          ] })
        ]
      },
      a(l)
    );
  }) });
}
function q(e) {
  return e === "start" ? D : e === "import" ? W : e === "save" ? U : e === "display" ? z : A;
}
function J(e) {
  if (typeof window > "u")
    return { x: e.x, y: e.y, maxHeight: 520 };
  const a = 14, i = 62, n = Math.min(H, window.innerWidth - a * 2), o = Math.min(
    520,
    Math.max(180, window.innerHeight - i - a)
  ), s = e.y + o > window.innerHeight - a ? e.y - o : e.y;
  return {
    x: Math.min(
      Math.max(a, e.x),
      Math.max(a, window.innerWidth - n - a)
    ),
    y: Math.min(
      Math.max(i, s),
      Math.max(i, window.innerHeight - o - a)
    ),
    maxHeight: o
  };
}
function Q(e) {
  return typeof window > "u" ? "right" : e + H + Z > window.innerWidth ? "left" : "right";
}
function ee(e, a, i) {
  if (typeof window > "u")
    return { top: 0, maxHeight: v };
  const n = e.getBoundingClientRect(), o = a.getBoundingClientRect(), s = window.innerHeight, d = Math.min(
    v,
    Math.max(120, s - N * 2)
  ), l = Math.min(d, 48 + i * 45);
  return {
    top: Math.min(
      Math.max(N, o.top),
      Math.max(
        N,
        s - l - N
      )
    ) - n.top,
    maxHeight: d
  };
}
export {
  ie as AddNodeMenu,
  G as canvasFunctionOptions
};
