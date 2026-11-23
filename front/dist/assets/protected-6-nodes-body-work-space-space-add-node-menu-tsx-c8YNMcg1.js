import { a as r, j as t, F as A } from "./preloadable-B6QZqbLd.js";
import { i as x, d as L, j as U, L as z, e as F, k as $, Z as C, l as O, W as B } from "./vendor-icons-IZIW7U43.js";
import { b as K, a as j, u as Z, d as G } from "./file-kind-Cq3pESGF.js";
import { b as X, c as Y, r as V } from "./space-assistant-layout-B9KyeCM0.js";
import { D as q } from "./asset-audio-preview-CWf3Wq_n.js";
import { P as J } from "./power-icon-CM-9ejD_.js";
import { c as Q } from "./space-story-setting-reference-HUiOpGO8.js";
const _ = 292, ee = 248, v = 420, N = 14;
function pe({
  menu: e,
  flows: i,
  powers: o,
  powerCategories: d,
  roles: s,
  overDetail: l = !1,
  reference: n,
  onClose: c,
  onSelectFlow: u,
  onSelectFunction: h,
  onSelectGroup: p,
  onSelectRole: T,
  onSelectPower: P
}) {
  const g = ie(e), b = K(null), [M, y] = j(null), I = M?.groupID || 0, f = Z(
    () => X(o, d, (a) => a.cate_id),
    [d, o]
  ), k = f.groups.find((a) => a.category.id === I) || null, w = [];
  G(() => {
    function a(m) {
      m.key === "Escape" && (m.preventDefault(), m.stopImmediatePropagation(), c());
    }
    return window.addEventListener("keydown", a, !0), () => window.removeEventListener("keydown", a, !0);
  }, [c]);
  function W(a, m) {
    b.current && y({
      groupID: a.category.id,
      ...ce(
        b.current,
        m,
        a.powers.length
      )
    });
  }
  (f.basicPowers.length > 0 || f.groups.length > 0) && w.push(
    ne(
      f,
      I,
      W,
      () => y(null),
      P,
      n?.describePower
    )
  ), s.length > 0 && w.push(
    S({
      sectionKey: "roles",
      title: "智能体",
      items: s,
      itemKey: (a) => String(a.id || a.role_key || a.name),
      itemClassName: "is-agent",
      label: (a) => a.name,
      icon: () => /* @__PURE__ */ t(O, { size: 16 }),
      onSelect: T
    })
  ), i.length > 0 && w.push(
    S({
      sectionKey: "flows",
      title: "流程",
      items: i,
      itemKey: (a) => String(a.id || a.key || a.name),
      itemClassName: "is-flow",
      label: (a) => a.name,
      icon: () => /* @__PURE__ */ t(B, { size: 16 }),
      onSelect: u
    })
  );
  const E = n?.functions ?? Q;
  (!n || E.length > 0) && w.push(te(E, h, n ? void 0 : p));
  const H = /* @__PURE__ */ r(A, { children: [
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-add-menu-backdrop",
        onMouseDown: c,
        onContextMenu: (a) => {
          a.preventDefault(), c();
        }
      }
    ),
    /* @__PURE__ */ r(
      "section",
      {
        ref: b,
        className: "ws-add-menu custom-scrollbar",
        style: { left: g.x, top: g.y, maxHeight: g.maxHeight },
        onMouseDown: (a) => a.stopPropagation(),
        onMouseLeave: () => y(null),
        children: [
          /* @__PURE__ */ t("div", { className: "ws-add-menu-head", children: /* @__PURE__ */ t("strong", { children: e.connection?.handleType === "target" ? "为该节点添加上游" : e.connection ? "引用该节点生成" : "添加节点" }) }),
          /* @__PURE__ */ r(
            "div",
            {
              className: "ws-add-menu-body",
              onScroll: () => y(null),
              children: [
                n?.loading ? /* @__PURE__ */ t("p", { className: "ws-add-menu-note", role: "status", children: "正在检查可用的输入…" }) : null,
                n?.notice ? /* @__PURE__ */ t("p", { className: "ws-add-menu-note", role: "status", children: n.notice }) : null,
                n?.warning ? /* @__PURE__ */ t("p", { className: "ws-add-menu-note", role: "alert", children: n.warning }) : null,
                w.map((a, m) => /* @__PURE__ */ r("div", { children: [
                  a,
                  m < w.length - 1 ? /* @__PURE__ */ t("div", { className: "ws-add-divider" }) : null
                ] }, m))
              ]
            }
          ),
          k ? /* @__PURE__ */ t(
            se,
            {
              group: k,
              side: oe(g.x),
              top: M?.top || 0,
              maxHeight: M?.maxHeight || v,
              onSelect: P,
              describePower: n?.describePower
            }
          ) : null
        ]
      }
    )
  ] });
  return l ? Y(
    /* @__PURE__ */ t("div", { className: "wb-detail-backdrop is-dialog-layer", "data-slot": "dialog-layer", style: { zIndex: q }, children: H }),
    document.body
  ) : H;
}
function S({
  sectionKey: e,
  title: i,
  items: o,
  itemKey: d,
  itemClassName: s,
  label: l,
  description: n,
  icon: c,
  onSelect: u
}) {
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: i }),
    R({
      items: o,
      itemKey: d,
      itemClassName: s,
      label: l,
      description: n,
      icon: c,
      onSelect: u
    })
  ] }, e);
}
function ne(e, i, o, d, s, l) {
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "能力" }),
    /* @__PURE__ */ r("div", { className: "ws-add-menu-list", children: [
      e.basicPowers.map((n) => /* @__PURE__ */ t(
        D,
        {
          power: n,
          description: l?.(n),
          onMouseEnter: d,
          onSelect: s
        },
        n.key || n.id
      )),
      e.groups.map((n) => /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: `ws-add-item is-power-group${i === n.category.id ? " is-open" : ""}`,
          "aria-haspopup": "menu",
          "aria-expanded": i === n.category.id,
          onMouseEnter: (c) => o(n, c.currentTarget),
          onFocus: (c) => o(n, c.currentTarget),
          onClick: (c) => o(n, c.currentTarget),
          children: [
            /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(x, { size: 16 }) }),
            /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
              /* @__PURE__ */ t("span", { className: "ws-add-label", children: n.category.name }),
              /* @__PURE__ */ r("span", { className: "ws-add-desc", children: [
                n.powers.length,
                " 项能力"
              ] })
            ] }),
            /* @__PURE__ */ t(L, { className: "ws-add-submenu-arrow", size: 15 })
          ]
        },
        n.category.id
      ))
    ] })
  ] }, "powers");
}
function se({
  group: e,
  side: i,
  top: o,
  maxHeight: d,
  onSelect: s,
  describePower: l
}) {
  return /* @__PURE__ */ r(
    "aside",
    {
      className: `ws-add-submenu-panel is-${i} custom-scrollbar`,
      role: "menu",
      "aria-label": e.category.name,
      style: { top: o, maxHeight: d },
      onMouseDown: (n) => n.stopPropagation(),
      children: [
        /* @__PURE__ */ r("div", { className: "ws-add-submenu-head", children: [
          /* @__PURE__ */ t(x, { size: 15 }),
          /* @__PURE__ */ t("strong", { children: e.category.name })
        ] }),
        /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.powers.map((n) => /* @__PURE__ */ t(
          D,
          {
            power: n,
            description: l?.(n),
            onSelect: s
          },
          n.key || n.id
        )) })
      ]
    }
  );
}
function D({
  power: e,
  description: i = V(e).kindName,
  onMouseEnter: o,
  onSelect: d
}) {
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      className: "ws-add-item is-power",
      role: "menuitem",
      title: `${e.name} · ${i}`,
      onMouseEnter: o,
      onFocus: o,
      onClick: () => d(e),
      children: [
        /* @__PURE__ */ t("span", { className: "ws-add-icon", children: /* @__PURE__ */ t(J, { power: e, size: 16 }) }),
        /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
          /* @__PURE__ */ t("span", { className: "ws-add-label", children: e.name }),
          /* @__PURE__ */ t("span", { className: "ws-add-desc", children: i })
        ] })
      ]
    }
  );
}
function te(e, i, o) {
  const d = [
    ...e.map((s) => ({
      key: s.key,
      label: s.label,
      description: s.description,
      className: s.key === "import" ? "is-function is-import" : "is-function",
      Icon: ae(s.key),
      select: () => i(s)
    })),
    ...o ? [{
      key: "group",
      label: "分组",
      description: "组织并统一运行一组节点",
      className: "is-group",
      Icon: x,
      select: o
    }] : []
  ];
  return /* @__PURE__ */ r("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ t("div", { className: "ws-add-section-title", children: "功能" }),
    R({
      items: d,
      itemKey: (s) => s.key,
      itemClassName: (s) => s.className,
      label: (s) => s.label,
      description: (s) => s.description,
      icon: (s) => {
        const l = s.Icon;
        return /* @__PURE__ */ t(l, { size: 16 });
      },
      onSelect: (s) => s.select()
    })
  ] }, "functions");
}
function R({
  items: e,
  itemKey: i,
  itemClassName: o,
  label: d,
  description: s,
  icon: l,
  onSelect: n
}) {
  return /* @__PURE__ */ t("div", { className: "ws-add-menu-list", children: e.map((c) => {
    const u = typeof o == "function" ? o(c) : o, h = s?.(c) || "", p = d(c);
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: `ws-add-item ${u}`.trim(),
        title: h ? `${p} · ${h}` : p,
        onClick: () => n(c),
        children: [
          /* @__PURE__ */ t("span", { className: "ws-add-icon", children: l(c) }),
          /* @__PURE__ */ r("span", { className: "ws-add-copy", children: [
            /* @__PURE__ */ t("span", { className: "ws-add-label", children: p }),
            h ? /* @__PURE__ */ t("span", { className: "ws-add-desc", children: h }) : null
          ] })
        ]
      },
      i(c)
    );
  }) });
}
function ae(e) {
  return e === "start" ? U : e === "import" ? z : e === "save" ? F : e === "display" ? $ : C;
}
function ie(e) {
  if (typeof window > "u")
    return { x: e.x, y: e.y, maxHeight: 520 };
  const i = 14, o = 62, d = Math.min(_, window.innerWidth - i * 2), s = Math.min(
    520,
    Math.max(180, window.innerHeight - o - i)
  ), l = e.y + s > window.innerHeight - i ? e.y - s : e.y;
  return {
    x: Math.min(
      Math.max(i, e.x),
      Math.max(i, window.innerWidth - d - i)
    ),
    y: Math.min(
      Math.max(o, l),
      Math.max(o, window.innerHeight - s - i)
    ),
    maxHeight: s
  };
}
function oe(e) {
  return typeof window > "u" ? "right" : e + _ + ee > window.innerWidth ? "left" : "right";
}
function ce(e, i, o) {
  if (typeof window > "u")
    return { top: 0, maxHeight: v };
  const d = e.getBoundingClientRect(), s = i.getBoundingClientRect(), l = window.innerHeight, n = Math.min(
    v,
    Math.max(120, l - N * 2)
  ), c = Math.min(n, 48 + o * 45);
  return {
    top: Math.min(
      Math.max(N, s.top),
      Math.max(
        N,
        l - c - N
      )
    ) - d.top,
    maxHeight: n
  };
}
export {
  pe as AddNodeMenu
};
