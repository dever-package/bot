import { a, j as l, F as W } from "./_commonjsHelpers-CTFd9u1x.js";
import { a as B, Y as $, N as K, V as j, _ as G, F as V, $ as z, a0 as H, a1 as Y, a2 as Z, a3 as X, k, p as q, a4 as J, a5 as Q, S as ee, w as ne, Z as te } from "./vendor-icons-Cc7Kl3It.js";
import { c as R, u as oe, l as ie, d as se } from "./react-C7Xtl8sB.js";
await window.DeverFront?.ensureCompat?.(["@/lib/icon"]);
const x = window.DeverFront?.sdk?.getCompatModule("@/lib/icon");
if (!x || Object.keys(x).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/icon");
function Ce({
  iconName: e,
  iconImage: n,
  fallbackIcon: t,
  className: o,
  strokeWidth: s
}) {
  const i = String(n || "").trim();
  if (i)
    return R("img", {
      src: i,
      alt: "",
      "aria-hidden": !0,
      draggable: !1,
      className: o
    });
  const d = T(e, t);
  return R(d, { className: o, strokeWidth: s });
}
function T(e, n) {
  const t = ae(e);
  return re(t) || n;
}
function re(e) {
  if (!e)
    return null;
  try {
    const n = x.resolveLucideIcon, t = n?.(e);
    if (t)
      return t;
  } catch {
  }
  return null;
}
function ae(e) {
  const n = String(e || "").trim();
  return !n || n === "-" ? "" : n.replace(/^i-lucide-/i, "").replace(/^lucide[:/\\-]/i, "").replace(/Icon$/i, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
const ce = 1, P = 2;
function Ee(e) {
  const n = le(e) ? e : {};
  return {
    id: v(n.id),
    name: ue(n.name || n.value) || "未命名分组",
    type: v(n.type) === P ? P : ce,
    status: v(n.status) === 2 ? 2 : 1,
    sort: v(n.sort, 100)
  };
}
function de(e, n, t) {
  const o = new Map(
    n.filter((r) => r.id > 0).map((r) => [r.id, r])
  ), s = /* @__PURE__ */ new Map(), i = [];
  for (const r of e) {
    const u = o.get(t(r));
    if (u?.status !== 2 && u?.type === P) {
      const m = s.get(u.id) || [];
      m.push(r), s.set(u.id, m);
      continue;
    }
    i.push(r);
  }
  const d = n.filter(
    (r) => r.status !== 2 && r.type === P && (s.get(r.id)?.length || 0) > 0
  ).sort((r, u) => r.sort - u.sort || r.id - u.id).map((r) => ({
    category: r,
    powers: s.get(r.id) || []
  }));
  return { basicPowers: i, groups: d };
}
function Re(e) {
  return [
    ...e.basicPowers,
    ...e.groups.flatMap((n) => n.powers)
  ];
}
function le(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e));
}
function ue(e) {
  return typeof e == "string" ? e.trim() : "";
}
function v(e, n = 0) {
  const t = Number(e);
  return Number.isFinite(t) ? t : n;
}
const me = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" }
}, pe = {
  text: "文本",
  llm: "文本",
  image: "图片",
  audio: "音频",
  music: "音频",
  video: "视频",
  file: "文件",
  mixed: "图文",
  role: "角色",
  multi: "多模态",
  embeddings: "向量",
  workflow: "工作流"
};
function h(e, n = "", t = "") {
  const o = f(e?.kind || n) || "text", s = f(t || e?.outputType) || "general", i = me[s], d = f(e?.output?.key) === s ? e?.output : void 0;
  return {
    outputType: s,
    outputName: o === "text" || o === "llm" || s !== "general" ? String(d?.name || "").trim() || i?.name || s : "",
    kindName: we(o),
    viewMode: f(d?.viewMode) || i?.viewMode || "content"
  };
}
function Ae(e, n = "", t = "") {
  return h(e, n, t).viewMode === "storyboard";
}
function ze(e, n = "", t = "") {
  return h(e, n, t).viewMode === "video_compose";
}
function He(e, n = "", t = "") {
  return h(e, n, t).viewMode === "storyboard_grid";
}
function Oe(e, n = "") {
  const t = f(e?.kind || n);
  return t === "audio" || t === "music";
}
function we(e) {
  const n = f(e) || "text";
  return pe[n] || "文本";
}
function f(e) {
  return String(e || "").trim().toLowerCase();
}
function fe({
  power: e,
  kind: n,
  outputType: t,
  size: o,
  className: s
}) {
  const i = h(e, n, t), d = he(i.outputType) || ge(e?.kind || n || ""), r = T(e?.icon, d);
  return /* @__PURE__ */ a(r, { size: o, className: s });
}
function he(e) {
  return String(e).trim().toLowerCase() === "storyboard" ? B : null;
}
function De({
  name: e,
  size: n,
  className: t
}) {
  const o = T(e, X);
  return /* @__PURE__ */ a(o, { size: n, className: t });
}
function ge(e) {
  const n = String(e || "").toLowerCase();
  return n === "text" || n === "llm" ? $ : n === "image" ? K : n === "video" ? j : n === "audio" || n === "music" ? G : n === "file" ? V : n === "workflow" ? z : n === "role" || n === "agent" ? H : n === "multi" ? Y : Z;
}
const O = [
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
], D = 292, ye = 248, I = 420, N = 14;
function be({
  menu: e,
  flows: n,
  powers: t,
  powerCategories: o,
  roles: s,
  onClose: i,
  onSelectFlow: d,
  onSelectFunction: r,
  onSelectGroup: u,
  onSelectRole: m,
  onSelectPower: p
}) {
  const g = Se(e), S = oe(null), [_, y] = ie(null), C = _?.groupID || 0, b = se(
    () => de(
      t,
      o,
      (c) => c.cate_id
    ),
    [o, t]
  ), E = b.groups.find(
    (c) => c.category.id === C
  ) || null, w = [];
  function U(c, M) {
    S.current && y({
      groupID: c.category.id,
      ...xe(
        S.current,
        M,
        c.powers.length
      )
    });
  }
  return (b.basicPowers.length > 0 || b.groups.length > 0) && w.push(
    Me(
      b,
      C,
      U,
      () => y(null),
      p
    )
  ), s.length > 0 && w.push(
    A({
      sectionKey: "roles",
      title: "智能体",
      items: s,
      itemKey: (c) => String(c.id || c.role_key || c.name),
      itemClassName: "is-agent",
      label: (c) => c.name,
      icon: () => /* @__PURE__ */ a(H, { size: 16 }),
      onSelect: m
    })
  ), n.length > 0 && w.push(
    A({
      sectionKey: "flows",
      title: "流程",
      items: n,
      itemKey: (c) => String(c.id || c.key || c.name),
      itemClassName: "is-flow",
      label: (c) => c.name,
      icon: () => /* @__PURE__ */ a(z, { size: 16 }),
      onSelect: d
    })
  ), w.push(Ne(r, u)), /* @__PURE__ */ l(W, { children: [
    /* @__PURE__ */ a(
      "div",
      {
        className: "ws-add-menu-backdrop",
        onMouseDown: i,
        onContextMenu: (c) => {
          c.preventDefault(), i();
        }
      }
    ),
    /* @__PURE__ */ l(
      "section",
      {
        ref: S,
        className: "ws-add-menu custom-scrollbar",
        style: { left: g.x, top: g.y, maxHeight: g.maxHeight },
        onMouseDown: (c) => c.stopPropagation(),
        onMouseLeave: () => y(null),
        children: [
          /* @__PURE__ */ a("div", { className: "ws-add-menu-head", children: /* @__PURE__ */ a("strong", { children: e.connection ? "引用该节点生成" : "添加节点" }) }),
          /* @__PURE__ */ a(
            "div",
            {
              className: "ws-add-menu-body",
              onScroll: () => y(null),
              children: w.map((c, M) => /* @__PURE__ */ l("div", { children: [
                c,
                M < w.length - 1 ? /* @__PURE__ */ a("div", { className: "ws-add-divider" }) : null
              ] }, M))
            }
          ),
          E ? /* @__PURE__ */ a(
            ve,
            {
              group: E,
              side: _e(g.x),
              top: _?.top || 0,
              maxHeight: _?.maxHeight || I,
              onSelect: p
            }
          ) : null
        ]
      }
    )
  ] });
}
function A({
  sectionKey: e,
  title: n,
  items: t,
  itemKey: o,
  itemClassName: s,
  label: i,
  description: d,
  icon: r,
  onSelect: u
}) {
  return /* @__PURE__ */ l("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ a("div", { className: "ws-add-section-title", children: n }),
    F({
      items: t,
      itemKey: o,
      itemClassName: s,
      label: i,
      description: d,
      icon: r,
      onSelect: u
    })
  ] }, e);
}
function Me(e, n, t, o, s) {
  return /* @__PURE__ */ l("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ a("div", { className: "ws-add-section-title", children: "能力" }),
    /* @__PURE__ */ l("div", { className: "ws-add-menu-list", children: [
      e.basicPowers.map((i) => /* @__PURE__ */ a(
        L,
        {
          power: i,
          onMouseEnter: o,
          onSelect: s
        },
        i.key || i.id
      )),
      e.groups.map((i) => /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: `ws-add-item is-power-group${n === i.category.id ? " is-open" : ""}`,
          "aria-haspopup": "menu",
          "aria-expanded": n === i.category.id,
          onMouseEnter: (d) => t(i, d.currentTarget),
          onFocus: (d) => t(i, d.currentTarget),
          onClick: (d) => t(i, d.currentTarget),
          children: [
            /* @__PURE__ */ a("span", { className: "ws-add-icon", children: /* @__PURE__ */ a(k, { size: 16 }) }),
            /* @__PURE__ */ l("span", { className: "ws-add-copy", children: [
              /* @__PURE__ */ a("span", { className: "ws-add-label", children: i.category.name }),
              /* @__PURE__ */ l("span", { className: "ws-add-desc", children: [
                i.powers.length,
                " 项能力"
              ] })
            ] }),
            /* @__PURE__ */ a(q, { className: "ws-add-submenu-arrow", size: 15 })
          ]
        },
        i.category.id
      ))
    ] })
  ] }, "powers");
}
function ve({
  group: e,
  side: n,
  top: t,
  maxHeight: o,
  onSelect: s
}) {
  return /* @__PURE__ */ l(
    "aside",
    {
      className: `ws-add-submenu-panel is-${n} custom-scrollbar`,
      role: "menu",
      "aria-label": e.category.name,
      style: { top: t, maxHeight: o },
      onMouseDown: (i) => i.stopPropagation(),
      children: [
        /* @__PURE__ */ l("div", { className: "ws-add-submenu-head", children: [
          /* @__PURE__ */ a(k, { size: 15 }),
          /* @__PURE__ */ a("strong", { children: e.category.name })
        ] }),
        /* @__PURE__ */ a("div", { className: "ws-add-menu-list", children: e.powers.map((i) => /* @__PURE__ */ a(
          L,
          {
            power: i,
            onSelect: s
          },
          i.key || i.id
        )) })
      ]
    }
  );
}
function L({
  power: e,
  onMouseEnter: n,
  onSelect: t
}) {
  const o = h(e).kindName;
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "ws-add-item is-power",
      role: "menuitem",
      title: `${e.name} · ${o}`,
      onMouseEnter: n,
      onFocus: n,
      onClick: () => t(e),
      children: [
        /* @__PURE__ */ a("span", { className: "ws-add-icon", children: /* @__PURE__ */ a(fe, { power: e, size: 16 }) }),
        /* @__PURE__ */ l("span", { className: "ws-add-copy", children: [
          /* @__PURE__ */ a("span", { className: "ws-add-label", children: e.name }),
          /* @__PURE__ */ a("span", { className: "ws-add-desc", children: o })
        ] })
      ]
    }
  );
}
function Ne(e, n) {
  const t = [
    ...O.map((o) => ({
      key: o.key,
      label: o.label,
      description: o.description,
      className: o.key === "import" ? "is-function is-import" : "is-function",
      Icon: Pe(o.key),
      select: () => e(o)
    })),
    {
      key: "group",
      label: "分组",
      description: "组织并统一运行一组节点",
      className: "is-group",
      Icon: k,
      select: n
    }
  ];
  return /* @__PURE__ */ l("div", { className: "ws-add-section", children: [
    /* @__PURE__ */ a("div", { className: "ws-add-section-title", children: "功能" }),
    F({
      items: t,
      itemKey: (o) => o.key,
      itemClassName: (o) => o.className,
      label: (o) => o.label,
      description: (o) => o.description,
      icon: (o) => {
        const s = o.Icon;
        return /* @__PURE__ */ a(s, { size: 16 });
      },
      onSelect: (o) => o.select()
    })
  ] }, "functions");
}
function F({
  items: e,
  itemKey: n,
  itemClassName: t,
  label: o,
  description: s,
  icon: i,
  onSelect: d
}) {
  return /* @__PURE__ */ a("div", { className: "ws-add-menu-list", children: e.map((r) => {
    const u = typeof t == "function" ? t(r) : t, m = s?.(r) || "", p = o(r);
    return /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: `ws-add-item ${u}`.trim(),
        title: m ? `${p} · ${m}` : p,
        onClick: () => d(r),
        children: [
          /* @__PURE__ */ a("span", { className: "ws-add-icon", children: i(r) }),
          /* @__PURE__ */ l("span", { className: "ws-add-copy", children: [
            /* @__PURE__ */ a("span", { className: "ws-add-label", children: p }),
            m ? /* @__PURE__ */ a("span", { className: "ws-add-desc", children: m }) : null
          ] })
        ]
      },
      n(r)
    );
  }) });
}
function Pe(e) {
  return e === "start" ? J : e === "import" ? Q : e === "save" ? ee : e === "display" ? ne : te;
}
function Se(e) {
  if (typeof window > "u")
    return { x: e.x, y: e.y, maxHeight: 520 };
  const n = 14, t = 62, o = Math.min(D, window.innerWidth - n * 2), s = Math.min(
    520,
    Math.max(180, window.innerHeight - t - n)
  ), i = e.y + s > window.innerHeight - n ? e.y - s : e.y;
  return {
    x: Math.min(
      Math.max(n, e.x),
      Math.max(n, window.innerWidth - o - n)
    ),
    y: Math.min(
      Math.max(t, i),
      Math.max(t, window.innerHeight - s - n)
    ),
    maxHeight: s
  };
}
function _e(e) {
  return typeof window > "u" ? "right" : e + D + ye > window.innerWidth ? "left" : "right";
}
function xe(e, n, t) {
  if (typeof window > "u")
    return { top: 0, maxHeight: I };
  const o = e.getBoundingClientRect(), s = n.getBoundingClientRect(), i = window.innerHeight, d = Math.min(
    I,
    Math.max(120, i - N * 2)
  ), r = Math.min(d, 48 + t * 45);
  return {
    top: Math.min(
      Math.max(N, s.top),
      Math.max(
        N,
        i - r - N
      )
    ) - o.top,
    maxHeight: d
  };
}
const Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AddNodeMenu: be,
  canvasFunctionOptions: O
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ce as C,
  fe as P,
  Ae as a,
  de as b,
  T as c,
  De as d,
  Oe as e,
  Re as f,
  He as g,
  ze as i,
  Ee as n,
  h as r,
  Le as s
};
