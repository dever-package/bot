import { a as I, j as ce, F as Ne } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as ge, b as xe, d as he, h as ut, j as Ye, n as as, o as ne, f as Zn, m as ie, u as J } from "./react-C7Xtl8sB.js";
import { s as ft, p as Yn, z as Wn, d as Xn, i as cs, a as vt, b as Nt, t as ls, c as ds, u as us, e as ae, f as se } from "./shallow-By_Vmu3B.js";
import { c as fs } from "./preloadable-PCKj9Z7v.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./vendor-canvas-BnuhLJ6X.css", import.meta.url).href]);
const pe = {
  error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: o }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : o}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, Ge = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Gn = ["Enter", " ", "Escape"], Kn = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var Re;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(Re || (Re = {}));
var $e;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})($e || ($e = {}));
var Ke;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Ke || (Ke = {}));
const qn = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var Ie;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Ie || (Ie = {}));
var it;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(it || (it = {}));
var F;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(F || (F = {}));
const nn = {
  [F.Left]: F.Right,
  [F.Right]: F.Left,
  [F.Top]: F.Bottom,
  [F.Bottom]: F.Top
};
function Un(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const Qn = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, gs = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), zt = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), je = (e, t = [0, 0]) => {
  const { width: n, height: o } = we(e), r = e.origin ?? t, s = n * r[0], i = o * r[1];
  return {
    x: e.position.x - s,
    y: e.position.y - i
  };
}, hs = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const n = e.reduce((o, r) => {
    const s = typeof r == "string";
    let i = !t.nodeLookup && !s ? r : void 0;
    t.nodeLookup && (i = s ? t.nodeLookup.get(r) : zt(r) ? r : t.nodeLookup.get(r.id));
    const a = i ? at(i, t.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return gt(o, a);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return ht(n);
}, Je = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, o = !1;
  return e.forEach((r) => {
    (t.filter === void 0 || t.filter(r)) && (n = gt(n, at(r)), o = !0);
  }), o ? ht(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Tt = (e, t, [n, o, r] = [0, 0, 1], s = !1, i = !1) => {
  const a = (t.x - n) / r, g = (t.y - o) / r, u = t.width / r, h = t.height / r, c = [];
  for (const f of e.values()) {
    const { measured: p, selectable: d = !0, hidden: x = !1 } = f;
    if (i && !d || x)
      continue;
    const m = p.width ?? f.width ?? f.initialWidth ?? 0, y = p.height ?? f.height ?? f.initialHeight ?? 0, { x: w, y: l } = f.internals.positionAbsolute, b = to(a, g, u, h, w, l, m, y), S = m * y, E = s && b > 0;
    (!f.internals.handleBounds || E || b >= S || f.dragging) && c.push(f);
  }
  return c;
}, ps = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((o) => {
    n.add(o.id);
  }), t.filter((o) => n.has(o.source) || n.has(o.target));
};
function ms(e, t) {
  const n = /* @__PURE__ */ new Map(), o = t?.nodes ? new Set(t.nodes.map((r) => r.id)) : null;
  return e.forEach((r) => {
    let s;
    if (t?.includeHiddenNodes) {
      const { width: i, height: a } = we(r);
      s = i > 0 && a > 0;
    } else
      s = !!(r.measured.width && r.measured.height && !r.hidden);
    s && (!o || o.has(r.id)) && n.set(r.id, r);
  }), n;
}
async function ys({ nodes: e, width: t, height: n, panZoom: o, minZoom: r, maxZoom: s }, i) {
  if (e.size === 0)
    return !0;
  const a = ms(e, i), g = Je(a), u = Vt(g, t, n, i?.minZoom ?? r, i?.maxZoom ?? s, i?.padding ?? 0.1);
  return await o.setViewport(u, {
    duration: i?.duration,
    ease: i?.ease,
    interpolate: i?.interpolate
  }), !0;
}
function jn({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: o = [0, 0], nodeExtent: r, onError: s }) {
  const i = n.get(e), a = i.parentId ? n.get(i.parentId) : void 0, { x: g, y: u } = a ? a.internals.positionAbsolute : { x: 0, y: 0 }, h = i.origin ?? o;
  let c = i.extent || r;
  if (i.extent === "parent" && !i.expandParent)
    if (!a)
      s?.("005", pe.error005());
    else {
      const p = a.measured.width, d = a.measured.height;
      p && d && (c = [
        [g, u],
        [g + p, u + d]
      ]);
    }
  else a && Le(i.extent) && (c = [
    [i.extent[0][0] + g, i.extent[0][1] + u],
    [i.extent[1][0] + g, i.extent[1][1] + u]
  ]);
  const f = Le(c) ? _e(t, c, i.measured) : t;
  return (i.measured.width === void 0 || i.measured.height === void 0) && s?.("015", pe.error015()), {
    position: {
      x: f.x - g + (i.measured.width ?? 0) * h[0],
      y: f.y - u + (i.measured.height ?? 0) * h[1]
    },
    positionAbsolute: f
  };
}
async function xs({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: o, onBeforeDelete: r }) {
  const s = new Set(e.map((f) => f.id)), i = [];
  for (const f of n) {
    if (f.deletable === !1)
      continue;
    const p = s.has(f.id), d = !p && f.parentId && i.find((x) => x.id === f.parentId);
    (p || d) && i.push(f);
  }
  const a = new Set(t.map((f) => f.id)), g = o.filter((f) => f.deletable !== !1), h = ps(i, g);
  for (const f of g)
    a.has(f.id) && !h.find((d) => d.id === f.id) && h.push(f);
  if (!r)
    return {
      edges: h,
      nodes: i
    };
  const c = await r({
    nodes: i,
    edges: h
  });
  return typeof c == "boolean" ? c ? { edges: h, nodes: i } : { edges: [], nodes: [] } : c;
}
const Oe = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), _e = (e = { x: 0, y: 0 }, t, n) => ({
  x: Oe(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
  y: Oe(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function Jn(e, t, n) {
  const { width: o, height: r } = we(n), { x: s, y: i } = n.internals.positionAbsolute;
  return _e(e, [
    [s, i],
    [s + o, i + r]
  ], t);
}
const on = (e, t, n) => e < t ? Oe(Math.abs(e - t), 1, t) / t : e > n ? -Oe(Math.abs(e - n), 1, t) / t : 0, Bt = (e, t, n = 15, o = 40) => {
  const r = on(e.x, o, t.width - o) * n, s = on(e.y, o, t.height - o) * n;
  return [r, s];
}, gt = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), kt = ({ x: e, y: t, width: n, height: o }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + o
}), ht = ({ x: e, y: t, x2: n, y2: o }) => ({
  x: e,
  y: t,
  width: n - e,
  height: o - t
}), qe = (e, t = [0, 0]) => {
  const { x: n, y: o } = zt(e) ? e.internals.positionAbsolute : je(e, t);
  return {
    x: n,
    y: o,
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}, at = (e, t = [0, 0]) => {
  const { x: n, y: o } = zt(e) ? e.internals.positionAbsolute : je(e, t);
  return {
    x: n,
    y: o,
    x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
    y2: o + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
  };
}, eo = (e, t) => ht(gt(kt(e), kt(t))), to = (e, t, n, o, r, s, i, a) => {
  const g = Math.max(0, Math.min(e + n, r + i) - Math.max(e, r)), u = Math.max(0, Math.min(t + o, s + a) - Math.max(t, s));
  return Math.ceil(g * u);
}, ct = (e, t) => to(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), rn = (e) => ue(e.width) && ue(e.height) && ue(e.x) && ue(e.y), ue = (e) => !isNaN(e) && isFinite(e), no = (e, t) => (n, o) => {
}, et = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), tt = ({ x: e, y: t }, [n, o, r], s = !1, i = [1, 1]) => {
  const a = {
    x: (e - n) / r,
    y: (t - o) / r
  };
  return s ? et(a, i) : a;
}, Fe = ({ x: e, y: t }, [n, o, r]) => ({
  x: e * r + n,
  y: t * r + o
});
function Te(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function ws(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = Te(e, n), r = Te(e, t);
    return {
      top: o,
      right: r,
      bottom: o,
      left: r,
      x: r * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = Te(e.top ?? e.y ?? 0, n), r = Te(e.bottom ?? e.y ?? 0, n), s = Te(e.left ?? e.x ?? 0, t), i = Te(e.right ?? e.x ?? 0, t);
    return { top: o, right: i, bottom: r, left: s, x: s + i, y: o + r };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function bs(e, t, n, o, r, s) {
  const { x: i, y: a } = Fe(e, [t, n, o]), { x: g, y: u } = Fe({ x: e.x + e.width, y: e.y + e.height }, [t, n, o]), h = r - g, c = s - u;
  return {
    left: Math.floor(i),
    top: Math.floor(a),
    right: Math.floor(h),
    bottom: Math.floor(c)
  };
}
const Vt = (e, t, n, o, r, s) => {
  const i = ws(s, t, n), a = (t - i.x) / e.width, g = (n - i.y) / e.height, u = Math.min(a, g), h = Oe(u, o, r), c = e.x + e.width / 2, f = e.y + e.height / 2, p = t / 2 - c * h, d = n / 2 - f * h, x = bs(e, p, d, h, t, n), m = {
    left: Math.min(x.left - i.left, 0),
    top: Math.min(x.top - i.top, 0),
    right: Math.min(x.right - i.right, 0),
    bottom: Math.min(x.bottom - i.bottom, 0)
  };
  return {
    x: p - m.left + m.right,
    y: d - m.top + m.bottom,
    zoom: h
  };
}, Ue = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function Le(e) {
  return e != null && e !== "parent";
}
function we(e) {
  return {
    width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
    height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
  };
}
function oo(e) {
  return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function ro(e, t = { width: 0, height: 0 }, n, o, r) {
  const s = { ...e }, i = o.get(n);
  if (i) {
    const a = i.origin || r;
    s.x += i.internals.positionAbsolute.x - (t.width ?? 0) * a[0], s.y += i.internals.positionAbsolute.y - (t.height ?? 0) * a[1];
  }
  return s;
}
function sn(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Es() {
  let e, t;
  return { promise: new Promise((o, r) => {
    e = o, t = r;
  }), resolve: e, reject: t };
}
function Ss(e) {
  return { ...Kn, ...e || {} };
}
function Xe(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: o, containerBounds: r }) {
  const { x: s, y: i } = fe(e), a = tt({ x: s - (r?.left ?? 0), y: i - (r?.top ?? 0) }, o), { x: g, y: u } = n ? et(a, t) : a;
  return {
    xSnapped: g,
    ySnapped: u,
    ...a
  };
}
const Rt = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), so = (e) => e?.getRootNode?.() || window?.document, vs = ["INPUT", "SELECT", "TEXTAREA"];
function io(e) {
  const t = e.composedPath?.()?.[0] || e.target;
  return t?.nodeType !== 1 ? !1 : vs.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const ao = (e) => "clientX" in e, fe = (e, t) => {
  const n = ao(e), o = n ? e.clientX : e.touches?.[0].clientX, r = n ? e.clientY : e.touches?.[0].clientY;
  return {
    x: o - (t?.left ?? 0),
    y: r - (t?.top ?? 0)
  };
}, an = (e, t, n, o, r) => {
  const s = t.querySelectorAll(`.${e}`);
  return !s || !s.length ? null : Array.from(s).map((i) => {
    const a = i.getBoundingClientRect();
    return {
      id: i.getAttribute("data-handleid"),
      type: e,
      nodeId: r,
      position: i.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...Rt(i)
    };
  });
};
function co({ sourceX: e, sourceY: t, targetX: n, targetY: o, sourceControlX: r, sourceControlY: s, targetControlX: i, targetControlY: a }) {
  const g = e * 0.125 + r * 0.375 + i * 0.375 + n * 0.125, u = t * 0.125 + s * 0.375 + a * 0.375 + o * 0.125, h = Math.abs(g - e), c = Math.abs(u - t);
  return [g, u, h, c];
}
function nt(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function cn({ pos: e, x1: t, y1: n, x2: o, y2: r, c: s }) {
  switch (e) {
    case F.Left:
      return [t - nt(t - o, s), n];
    case F.Right:
      return [t + nt(o - t, s), n];
    case F.Top:
      return [t, n - nt(n - r, s)];
    case F.Bottom:
      return [t, n + nt(r - n, s)];
  }
}
function lo({ sourceX: e, sourceY: t, sourcePosition: n = F.Bottom, targetX: o, targetY: r, targetPosition: s = F.Top, curvature: i = 0.25 }) {
  const [a, g] = cn({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r,
    c: i
  }), [u, h] = cn({
    pos: s,
    x1: o,
    y1: r,
    x2: e,
    y2: t,
    c: i
  }), [c, f, p, d] = co({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: a,
    sourceControlY: g,
    targetControlX: u,
    targetControlY: h
  });
  return [
    `M${e},${t} C${a},${g} ${u},${h} ${o},${r}`,
    c,
    f,
    p,
    d
  ];
}
function uo({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const r = Math.abs(n - e) / 2, s = n < e ? n + r : n - r, i = Math.abs(o - t) / 2, a = o < t ? o + i : o - i;
  return [s, a, r, i];
}
function Ns({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: o = 0, elevateOnSelect: r = !1, zIndexMode: s = "basic" }) {
  if (s === "manual")
    return o;
  const i = r && n ? o + 1e3 : o, a = Math.max(e.parentId || r && e.selected ? e.internals.z : 0, t.parentId || r && t.selected ? t.internals.z : 0);
  return i + a;
}
function Cs({ sourceNode: e, targetNode: t, width: n, height: o, transform: r }) {
  const s = gt(at(e), at(t));
  s.x === s.x2 && (s.x2 += 1), s.y === s.y2 && (s.y2 += 1);
  const i = {
    x: -r[0] / r[2],
    y: -r[1] / r[2],
    width: n / r[2],
    height: o / r[2]
  };
  return ct(i, ht(s)) > 0;
}
const Ms = ({ source: e, sourceHandle: t, target: n, targetHandle: o }) => `xy-edge__${e}${t || ""}-${n}${o || ""}`, Is = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Ps = (e, t, n = {}) => {
  if (!e.source || !e.target)
    return n.onError?.("006", pe.error006()), t;
  const o = n.getEdgeId || Ms;
  let r;
  return Qn(e) ? r = { ...e } : r = {
    ...e,
    id: o(e)
  }, Is(r, t) ? t : (r.sourceHandle === null && delete r.sourceHandle, r.targetHandle === null && delete r.targetHandle, t.concat(r));
};
function fo({ sourceX: e, sourceY: t, targetX: n, targetY: o }) {
  const [r, s, i, a] = uo({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: o
  });
  return [`M ${e},${t}L ${n},${o}`, r, s, i, a];
}
const ln = {
  [F.Left]: { x: -1, y: 0 },
  [F.Right]: { x: 1, y: 0 },
  [F.Top]: { x: 0, y: -1 },
  [F.Bottom]: { x: 0, y: 1 }
}, As = ({ source: e, sourcePosition: t = F.Bottom, target: n }) => t === F.Left || t === F.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, dn = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function ks({ source: e, sourcePosition: t = F.Bottom, target: n, targetPosition: o = F.Top, center: r, offset: s, stepPosition: i }) {
  const a = ln[t], g = ln[o], u = { x: e.x + a.x * s, y: e.y + a.y * s }, h = { x: n.x + g.x * s, y: n.y + g.y * s }, c = As({
    source: u,
    sourcePosition: t,
    target: h
  }), f = c.x !== 0 ? "x" : "y", p = c[f];
  let d = [], x, m;
  const y = { x: 0, y: 0 }, w = { x: 0, y: 0 }, [, , l, b] = uo({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (a[f] * g[f] === -1) {
    f === "x" ? (x = r.x ?? u.x + (h.x - u.x) * i, m = r.y ?? (u.y + h.y) / 2) : (x = r.x ?? (u.x + h.x) / 2, m = r.y ?? u.y + (h.y - u.y) * i);
    const C = [
      { x, y: u.y },
      { x, y: h.y }
    ], N = [
      { x: u.x, y: m },
      { x: h.x, y: m }
    ];
    a[f] === p ? d = f === "x" ? C : N : d = f === "x" ? N : C;
  } else {
    const C = [{ x: u.x, y: h.y }], N = [{ x: h.x, y: u.y }];
    if (f === "x" ? d = a.x === p ? N : C : d = a.y === p ? C : N, t === o) {
      const k = Math.abs(e[f] - n[f]);
      if (k <= s) {
        const M = Math.min(s - 1, s - k);
        a[f] === p ? y[f] = (u[f] > e[f] ? -1 : 1) * M : w[f] = (h[f] > n[f] ? -1 : 1) * M;
      }
    }
    if (t !== o) {
      const k = f === "x" ? "y" : "x", M = a[f] === g[k], T = u[k] > h[k], D = u[k] < h[k];
      (a[f] === 1 && (!M && T || M && D) || a[f] !== 1 && (!M && D || M && T)) && (d = f === "x" ? C : N);
    }
    const z = { x: u.x + y.x, y: u.y + y.y }, A = { x: h.x + w.x, y: h.y + w.y }, $ = Math.max(Math.abs(z.x - d[0].x), Math.abs(A.x - d[0].x)), P = Math.max(Math.abs(z.y - d[0].y), Math.abs(A.y - d[0].y));
    $ >= P ? (x = (z.x + A.x) / 2, m = d[0].y) : (x = d[0].x, m = (z.y + A.y) / 2);
  }
  const S = { x: u.x + y.x, y: u.y + y.y }, E = { x: h.x + w.x, y: h.y + w.y };
  return [[
    e,
    // we only want to add the gapped source/target if they are different from the first/last point to avoid duplicates which can cause issues with the bends
    ...S.x !== d[0].x || S.y !== d[0].y ? [S] : [],
    ...d,
    ...E.x !== d[d.length - 1].x || E.y !== d[d.length - 1].y ? [E] : [],
    n
  ], x, m, l, b];
}
function Hs(e, t, n, o) {
  const r = Math.min(dn(e, t) / 2, dn(t, n) / 2, o), { x: s, y: i } = t;
  if (e.x === s && s === n.x || e.y === i && i === n.y)
    return `L${s} ${i}`;
  if (e.y === i) {
    const u = e.x < n.x ? -1 : 1, h = e.y < n.y ? 1 : -1;
    return `L ${s + r * u},${i}Q ${s},${i} ${s},${i + r * h}`;
  }
  const a = e.x < n.x ? 1 : -1, g = e.y < n.y ? -1 : 1;
  return `L ${s},${i + r * g}Q ${s},${i} ${s + r * a},${i}`;
}
function Ht({ sourceX: e, sourceY: t, sourcePosition: n = F.Bottom, targetX: o, targetY: r, targetPosition: s = F.Top, borderRadius: i = 5, centerX: a, centerY: g, offset: u = 20, stepPosition: h = 0.5 }) {
  const [c, f, p, d, x] = ks({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: o, y: r },
    targetPosition: s,
    center: { x: a, y: g },
    offset: u,
    stepPosition: h
  });
  let m = `M${c[0].x} ${c[0].y}`;
  for (let y = 1; y < c.length - 1; y++)
    m += Hs(c[y - 1], c[y], c[y + 1], i);
  return m += `L${c[c.length - 1].x} ${c[c.length - 1].y}`, [m, f, p, d, x];
}
function un(e) {
  return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Ds(e) {
  const { sourceNode: t, targetNode: n } = e;
  if (!un(t) || !un(n))
    return null;
  const o = t.internals.handleBounds || fn(t.handles), r = n.internals.handleBounds || fn(n.handles), s = gn(o?.source ?? [], e.sourceHandle), i = gn(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === Re.Strict ? r?.target ?? [] : (r?.target ?? []).concat(r?.source ?? []),
    e.targetHandle
  );
  if (!s || !i)
    return e.onError?.("008", pe.error008(s ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const a = s?.position || F.Bottom, g = i?.position || F.Top, u = ze(t, s, a), h = ze(n, i, g);
  return {
    sourceX: u.x,
    sourceY: u.y,
    targetX: h.x,
    targetY: h.y,
    sourcePosition: a,
    targetPosition: g
  };
}
function fn(e) {
  if (!e)
    return null;
  const t = [], n = [];
  for (const o of e)
    o.width = o.width ?? 1, o.height = o.height ?? 1, o.type === "source" ? t.push(o) : o.type === "target" && n.push(o);
  return {
    source: t,
    target: n
  };
}
function ze(e, t, n = F.Left, o = !1) {
  const r = (t?.x ?? 0) + e.internals.positionAbsolute.x, s = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: i, height: a } = t ?? we(e);
  if (o)
    return { x: r + i / 2, y: s + a / 2 };
  switch (t?.position ?? n) {
    case F.Top:
      return { x: r + i / 2, y: s };
    case F.Right:
      return { x: r + i, y: s + a / 2 };
    case F.Bottom:
      return { x: r + i / 2, y: s + a };
    case F.Left:
      return { x: r, y: s + a / 2 };
  }
}
function gn(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Dt(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}` : "";
}
function $s(e, { id: t, defaultColor: n, defaultMarkerStart: o, defaultMarkerEnd: r }) {
  const s = /* @__PURE__ */ new Set();
  return e.reduce((i, a) => ([a.markerStart || o, a.markerEnd || r].forEach((g) => {
    if (g && typeof g == "object") {
      const u = Dt(g, t);
      s.has(u) || (i.push({ id: u, color: g.color || n, ...g }), s.add(u));
    }
  }), i), []).sort((i, a) => i.id.localeCompare(a.id));
}
const go = 1e3, _s = 10, Ot = {
  nodeOrigin: [0, 0],
  nodeExtent: Ge,
  elevateNodesOnSelect: !0,
  zIndexMode: "basic",
  defaults: {}
}, Ls = {
  ...Ot,
  checkEquality: !0
};
function Ft(e, t) {
  const n = { ...e };
  for (const o in t)
    t[o] !== void 0 && (n[o] = t[o]);
  return n;
}
function zs(e, t, n) {
  const o = Ft(Ot, n);
  for (const r of e.values())
    if (r.parentId)
      Yt(r, e, t, o);
    else {
      const s = je(r, o.nodeOrigin), i = Le(r.extent) ? r.extent : o.nodeExtent, a = _e(s, i, we(r));
      r.internals.positionAbsolute = a;
    }
}
function Ts(e, t) {
  if (!e.handles)
    return e.measured ? t?.internals.handleBounds : void 0;
  const n = [], o = [];
  for (const r of e.handles) {
    const s = {
      id: r.id,
      width: r.width ?? 1,
      height: r.height ?? 1,
      nodeId: e.id,
      x: r.x,
      y: r.y,
      position: r.position,
      type: r.type
    };
    r.type === "source" ? n.push(s) : r.type === "target" && o.push(s);
  }
  return {
    source: n,
    target: o
  };
}
function Zt(e) {
  return e === "manual";
}
function $t(e, t, n, o = {}) {
  const r = Ft(Ls, o), s = { i: 0 }, i = new Map(t), a = r?.elevateNodesOnSelect && !Zt(r.zIndexMode) ? go : 0;
  let g = e.length > 0, u = !1;
  t.clear(), n.clear();
  for (const h of e) {
    let c = i.get(h.id);
    if (r.checkEquality && h === c?.internals.userNode)
      t.set(h.id, c);
    else {
      const f = je(h, r.nodeOrigin), p = Le(h.extent) ? h.extent : r.nodeExtent, d = _e(f, p, we(h));
      c = {
        ...r.defaults,
        ...h,
        measured: {
          width: h.measured?.width,
          height: h.measured?.height
        },
        internals: {
          positionAbsolute: d,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Ts(h, c),
          z: ho(h, a, r.zIndexMode),
          userNode: h
        }
      }, t.set(h.id, c);
    }
    (c.measured === void 0 || c.measured.width === void 0 || c.measured.height === void 0) && !c.hidden && (g = !1), h.parentId && Yt(c, t, n, o, s), u ||= h.selected ?? !1;
  }
  return { nodesInitialized: g, hasSelectedNodes: u };
}
function Bs(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Yt(e, t, n, o, r) {
  const { elevateNodesOnSelect: s, nodeOrigin: i, nodeExtent: a, zIndexMode: g } = Ft(Ot, o), u = e.parentId, h = t.get(u);
  if (!h) {
    console.warn(`Parent node ${u} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Bs(e, n), r && !h.parentId && h.internals.rootParentIndex === void 0 && g === "auto" && (h.internals.rootParentIndex = ++r.i, h.internals.z = h.internals.z + r.i * _s), r && h.internals.rootParentIndex !== void 0 && (r.i = h.internals.rootParentIndex);
  const c = s && !Zt(g) ? go : 0, { x: f, y: p, z: d } = Vs(e, h, i, a, c, g), { positionAbsolute: x } = e.internals, m = f !== x.x || p !== x.y;
  (m || d !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: m ? { x: f, y: p } : x,
      z: d
    }
  });
}
function ho(e, t, n) {
  const o = ue(e.zIndex) ? e.zIndex : 0;
  return Zt(n) ? o : o + (e.selected ? t : 0);
}
function Vs(e, t, n, o, r, s) {
  const { x: i, y: a } = t.internals.positionAbsolute, g = we(e), u = je(e, n), h = Le(e.extent) ? _e(u, e.extent, g) : u;
  let c = _e({ x: i + h.x, y: a + h.y }, o, g);
  e.extent === "parent" && (c = Jn(c, g, t));
  const f = ho(e, r, s), p = t.internals.z ?? 0;
  return {
    x: c.x,
    y: c.y,
    z: p >= f ? p + 1 : f
  };
}
function Wt(e, t, n, o = [0, 0]) {
  const r = [], s = /* @__PURE__ */ new Map();
  for (const i of e) {
    const a = t.get(i.parentId);
    if (!a)
      continue;
    const g = s.get(i.parentId)?.expandedRect ?? qe(a), u = eo(g, i.rect);
    s.set(i.parentId, { expandedRect: u, parent: a });
  }
  return s.size > 0 && s.forEach(({ expandedRect: i, parent: a }, g) => {
    const u = a.internals.positionAbsolute, h = we(a), c = a.origin ?? o, f = i.x < u.x ? Math.round(Math.abs(u.x - i.x)) : 0, p = i.y < u.y ? Math.round(Math.abs(u.y - i.y)) : 0, d = Math.max(h.width, Math.round(i.width)), x = Math.max(h.height, Math.round(i.height)), m = (d - h.width) * c[0], y = (x - h.height) * c[1];
    (f > 0 || p > 0 || m || y) && (r.push({
      id: g,
      type: "position",
      position: {
        x: a.position.x - f + m,
        y: a.position.y - p + y
      }
    }), n.get(g)?.forEach((w) => {
      e.some((l) => l.id === w.id) || r.push({
        id: w.id,
        type: "position",
        position: {
          x: w.position.x + f,
          y: w.position.y + p
        }
      });
    })), (h.width < i.width || h.height < i.height || f || p) && r.push({
      id: g,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: d + (f ? c[0] * f - m : 0),
        height: x + (p ? c[1] * p - y : 0)
      }
    });
  }), r;
}
function Rs(e, t, n, o, r, s, i) {
  const a = o?.querySelector(".xyflow__viewport");
  let g = !1;
  if (!a)
    return { changes: [], updatedInternals: g };
  const u = [], h = window.getComputedStyle(a), { m22: c } = new window.DOMMatrixReadOnly(h.transform), f = [];
  for (const p of e.values()) {
    const d = t.get(p.id);
    if (!d)
      continue;
    if (d.hidden) {
      t.set(d.id, {
        ...d,
        internals: {
          ...d.internals,
          handleBounds: void 0
        }
      }), g = !0;
      continue;
    }
    const x = Rt(p.nodeElement), m = d.measured.width !== x.width || d.measured.height !== x.height;
    if (!!(x.width && x.height && (m || !d.internals.handleBounds || p.force))) {
      const w = p.nodeElement.getBoundingClientRect(), l = Le(d.extent) ? d.extent : s;
      let { positionAbsolute: b } = d.internals;
      if (d.parentId && d.extent === "parent") {
        const E = t.get(d.parentId);
        E && (b = Jn(b, x, E));
      } else l && (b = _e(b, l, x));
      const S = {
        ...d,
        measured: x,
        internals: {
          ...d.internals,
          positionAbsolute: b,
          handleBounds: {
            source: an("source", p.nodeElement, w, c, d.id),
            target: an("target", p.nodeElement, w, c, d.id)
          }
        }
      };
      t.set(d.id, S), d.parentId && Yt(S, t, n, { nodeOrigin: r, zIndexMode: i }), g = !0, m && (u.push({
        id: d.id,
        type: "dimensions",
        dimensions: x
      }), d.expandParent && d.parentId && f.push({
        id: d.id,
        parentId: d.parentId,
        rect: qe(S, r)
      }));
    }
  }
  if (f.length > 0) {
    const p = Wt(f, t, n, r);
    u.push(...p);
  }
  return { changes: u, updatedInternals: g };
}
async function Os({ delta: e, panZoom: t, transform: n, translateExtent: o, width: r, height: s }) {
  if (!t || !e.x && !e.y)
    return !1;
  const i = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [r, s]
  ], o);
  return !!i && (i.x !== n[0] || i.y !== n[1] || i.k !== n[2]);
}
function hn(e, t, n, o, r, s) {
  let i = r;
  const a = o.get(i) || /* @__PURE__ */ new Map();
  o.set(i, a.set(n, t)), i = `${r}-${e}`;
  const g = o.get(i) || /* @__PURE__ */ new Map();
  if (o.set(i, g.set(n, t)), s) {
    i = `${r}-${e}-${s}`;
    const u = o.get(i) || /* @__PURE__ */ new Map();
    o.set(i, u.set(n, t));
  }
}
function po(e, t, n) {
  e.clear(), t.clear();
  for (const o of n) {
    const { source: r, target: s, sourceHandle: i = null, targetHandle: a = null } = o, g = { edgeId: o.id, source: r, target: s, sourceHandle: i, targetHandle: a }, u = `${r}-${i}--${s}-${a}`, h = `${s}-${a}--${r}-${i}`;
    hn("source", g, h, e, r, i), hn("target", g, u, e, s, a), t.set(o.id, o);
  }
}
function mo(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : mo(n, t) : !1;
}
function pn(e, t, n) {
  let o = e;
  do {
    if (o?.matches?.(t))
      return !0;
    if (o === n)
      return !1;
    o = o?.parentElement;
  } while (o);
  return !1;
}
function Fs(e, t, n, o) {
  const r = /* @__PURE__ */ new Map();
  for (const [s, i] of e)
    if ((i.selected || i.id === o) && (!i.parentId || !mo(i, e)) && (i.draggable || t && typeof i.draggable > "u")) {
      const a = e.get(s);
      a && r.set(s, {
        id: s,
        position: a.position || { x: 0, y: 0 },
        distance: {
          x: n.x - a.internals.positionAbsolute.x,
          y: n.y - a.internals.positionAbsolute.y
        },
        extent: a.extent,
        parentId: a.parentId,
        origin: a.origin,
        expandParent: a.expandParent,
        internals: {
          positionAbsolute: a.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: a.measured.width ?? 0,
          height: a.measured.height ?? 0
        }
      });
    }
  return r;
}
function Ct({ nodeId: e, dragItems: t, nodeLookup: n, dragging: o = !0 }) {
  const r = [];
  for (const [i, a] of t) {
    const g = n.get(i)?.internals.userNode;
    g && r.push({
      ...g,
      position: a.position,
      dragging: o
    });
  }
  if (!e)
    return [r[0], r];
  const s = n.get(e)?.internals.userNode;
  return [
    s ? {
      ...s,
      position: t.get(e)?.position || s.position,
      dragging: o
    } : r[0],
    r
  ];
}
function Zs({ dragItems: e, snapGrid: t, x: n, y: o }) {
  const r = e.values().next().value;
  if (!r)
    return null;
  const s = {
    x: n - r.distance.x,
    y: o - r.distance.y
  }, i = et(s, t);
  return {
    x: i.x - s.x,
    y: i.y - s.y
  };
}
function Ys({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: o, onDragStop: r }) {
  let s = { x: null, y: null }, i = 0, a = /* @__PURE__ */ new Map(), g = !1, u = { x: 0, y: 0 }, h = null, c = !1, f = null, p = !1, d = !1, x = null;
  function m({ noDragClassName: w, handleSelector: l, domNode: b, isSelectable: S, nodeId: E, nodeClickDistance: v = 0 }) {
    f = ft(b);
    function C({ x: $, y: P }) {
      const { nodeLookup: k, nodeExtent: M, snapGrid: T, snapToGrid: D, nodeOrigin: L, onNodeDrag: _, onSelectionDrag: Z, onError: V, updateNodePositions: B } = t();
      s = { x: $, y: P };
      let W = !1;
      const X = a.size > 1, K = X && M ? kt(Je(a)) : null, te = X && D ? Zs({
        dragItems: a,
        snapGrid: T,
        x: $,
        y: P
      }) : null;
      for (const [q, H] of a) {
        if (!k.has(q))
          continue;
        let R = { x: $ - H.distance.x, y: P - H.distance.y };
        D && (R = te ? {
          x: Math.round(R.x + te.x),
          y: Math.round(R.y + te.y)
        } : et(R, T));
        let U = null;
        if (X && M && !H.extent && K) {
          const { positionAbsolute: Y } = H.internals, Q = Y.x - K.x + M[0][0], ee = Y.x + H.measured.width - K.x2 + M[1][0], re = Y.y - K.y + M[0][1], le = Y.y + H.measured.height - K.y2 + M[1][1];
          U = [
            [Q, re],
            [ee, le]
          ];
        }
        const { position: G, positionAbsolute: O } = jn({
          nodeId: q,
          nextPosition: R,
          nodeLookup: k,
          nodeExtent: U || M,
          nodeOrigin: L,
          onError: V
        });
        W = W || H.position.x !== G.x || H.position.y !== G.y, H.position = G, H.internals.positionAbsolute = O;
      }
      if (d = d || W, !!W && (B(a, !0), x && (o || _ || !E && Z))) {
        const [q, H] = Ct({
          nodeId: E,
          dragItems: a,
          nodeLookup: k
        });
        o?.(x, a, q, H), _?.(x, q, H), E || Z?.(x, H);
      }
    }
    async function N() {
      if (!h)
        return;
      const { transform: $, panBy: P, autoPanSpeed: k, autoPanOnNodeDrag: M } = t();
      if (!M) {
        g = !1, cancelAnimationFrame(i);
        return;
      }
      const [T, D] = Bt(u, h, k);
      (T !== 0 || D !== 0) && (s.x = (s.x ?? 0) - T / $[2], s.y = (s.y ?? 0) - D / $[2], await P({ x: T, y: D }) && C(s)), i = requestAnimationFrame(N);
    }
    function z($) {
      const { nodeLookup: P, multiSelectionActive: k, nodesDraggable: M, transform: T, snapGrid: D, snapToGrid: L, selectNodesOnDrag: _, onNodeDragStart: Z, onSelectionDragStart: V, unselectNodesAndEdges: B } = t();
      c = !0, (!_ || !S) && !k && E && (P.get(E)?.selected || B()), S && _ && E && e?.(E);
      const W = Xe($.sourceEvent, { transform: T, snapGrid: D, snapToGrid: L, containerBounds: h });
      if (s = W, a = Fs(P, M, W, E), a.size > 0 && (n || Z || !E && V)) {
        const [X, K] = Ct({
          nodeId: E,
          dragItems: a,
          nodeLookup: P
        });
        n?.($.sourceEvent, a, X, K), Z?.($.sourceEvent, X, K), E || V?.($.sourceEvent, K);
      }
    }
    const A = Xn().clickDistance(v).on("start", ($) => {
      const { domNode: P, nodeDragThreshold: k, transform: M, snapGrid: T, snapToGrid: D } = t();
      h = P?.getBoundingClientRect() || null, p = !1, d = !1, x = $.sourceEvent, k === 0 && z($), s = Xe($.sourceEvent, { transform: M, snapGrid: T, snapToGrid: D, containerBounds: h }), u = fe($.sourceEvent, h);
    }).on("drag", ($) => {
      const { autoPanOnNodeDrag: P, transform: k, snapGrid: M, snapToGrid: T, nodeDragThreshold: D, nodeLookup: L } = t(), _ = Xe($.sourceEvent, { transform: k, snapGrid: M, snapToGrid: T, containerBounds: h });
      if (x = $.sourceEvent, ($.sourceEvent.type === "touchmove" && $.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      E && !L.has(E)) && (p = !0), !p) {
        if (!g && P && c && (g = !0, N()), !c) {
          const Z = fe($.sourceEvent, h), V = Z.x - u.x, B = Z.y - u.y;
          Math.sqrt(V * V + B * B) > D && z($);
        }
        (s.x !== _.xSnapped || s.y !== _.ySnapped) && a && c && (u = fe($.sourceEvent, h), C(_));
      }
    }).on("end", ($) => {
      if (!c || p) {
        p && a.size > 0 && t().updateNodePositions(a, !1);
        return;
      }
      if (g = !1, c = !1, cancelAnimationFrame(i), a.size > 0) {
        const { nodeLookup: P, updateNodePositions: k, onNodeDragStop: M, onSelectionDragStop: T } = t();
        if (d && (k(a, !1), d = !1), r || M || !E && T) {
          const [D, L] = Ct({
            nodeId: E,
            dragItems: a,
            nodeLookup: P,
            dragging: !1
          });
          r?.($.sourceEvent, a, D, L), M?.($.sourceEvent, D, L), E || T?.($.sourceEvent, L);
        }
      }
    }).filter(($) => {
      const P = $.target;
      return !$.button && (!w || !pn(P, `.${w}`, b)) && (!l || pn(P, l, b));
    });
    f.call(A);
  }
  function y() {
    f?.on(".drag", null);
  }
  return {
    update: m,
    destroy: y
  };
}
function Ws(e, t, n) {
  const o = [], r = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const s of t.values())
    ct(r, qe(s)) > 0 && o.push(s);
  return o;
}
const Xs = 250;
function Gs(e, t, n, o) {
  let r = [], s = 1 / 0;
  const i = Ws(e, n, t + Xs);
  for (const a of i) {
    const g = [...a.internals.handleBounds?.source ?? [], ...a.internals.handleBounds?.target ?? []];
    for (const u of g) {
      if (o.nodeId === u.nodeId && o.type === u.type && o.id === u.id)
        continue;
      const { x: h, y: c } = ze(a, u, u.position, !0), f = Math.sqrt(Math.pow(h - e.x, 2) + Math.pow(c - e.y, 2));
      f > t || (f < s ? (r = [{ ...u, x: h, y: c }], s = f) : f === s && r.push({ ...u, x: h, y: c }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const a = o.type === "source" ? "target" : "source";
    return r.find((g) => g.type === a) ?? r[0];
  }
  return r[0];
}
function yo(e, t, n, o, r, s = !1) {
  const i = o.get(e);
  if (!i)
    return null;
  const a = r === "strict" ? i.internals.handleBounds?.[t] : [...i.internals.handleBounds?.source ?? [], ...i.internals.handleBounds?.target ?? []], g = (n ? a?.find((u) => u.id === n) : a?.[0]) ?? null;
  return g && s ? { ...g, ...ze(i, g, g.position, !0) } : g;
}
function xo(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Ks(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const wo = () => !0;
function qs(e, { connectionMode: t, connectionRadius: n, handleId: o, nodeId: r, edgeUpdaterType: s, isTarget: i, domNode: a, nodeLookup: g, lib: u, autoPanOnConnect: h, flowId: c, panBy: f, cancelConnection: p, onConnectStart: d, onConnect: x, onConnectEnd: m, isValidConnection: y = wo, onReconnectEnd: w, updateConnection: l, getTransform: b, getFromHandle: S, autoPanSpeed: E, dragThreshold: v = 1, handleDomNode: C }) {
  const N = so(e.target);
  let z = 0, A;
  const { x: $, y: P } = fe(e), k = xo(s, C), M = a?.getBoundingClientRect();
  let T = !1;
  if (!M || !k)
    return;
  const D = yo(r, k, o, g, t);
  if (!D)
    return;
  let L = fe(e, M), _ = !1, Z = null, V = !1, B = null;
  function W() {
    if (!h || !M)
      return;
    const [G, O] = Bt(L, M, E);
    f({ x: G, y: O }), z = requestAnimationFrame(W);
  }
  const X = {
    ...D,
    nodeId: r,
    type: k,
    position: D.position
  }, K = g.get(r);
  let q = {
    inProgress: !0,
    isValid: null,
    from: ze(K, X, F.Left, !0),
    fromHandle: X,
    fromPosition: X.position,
    fromNode: K,
    to: L,
    toHandle: null,
    toPosition: nn[X.position],
    toNode: null,
    pointer: L
  };
  function H() {
    T = !0, l(q), d?.(e, { nodeId: r, handleId: o, handleType: k });
  }
  v === 0 && H();
  function R(G) {
    if (!T) {
      const { x: le, y: be } = fe(G), me = le - $, ye = be - P;
      if (!(me * me + ye * ye > v * v))
        return;
      H();
    }
    if (!S() || !X) {
      U(G);
      return;
    }
    const O = b();
    L = fe(G, M), A = Gs(tt(L, O, !1, [1, 1]), n, g, X), _ || (W(), _ = !0);
    const Y = bo(G, {
      handle: A,
      connectionMode: t,
      fromNodeId: r,
      fromHandleId: o,
      fromType: i ? "target" : "source",
      isValidConnection: y,
      doc: N,
      lib: u,
      flowId: c,
      nodeLookup: g
    });
    B = Y.handleDomNode, Z = Y.connection, V = Ks(!!A, Y.isValid);
    const Q = g.get(r), ee = Q ? ze(Q, X, F.Left, !0) : q.from, re = {
      ...q,
      from: ee,
      isValid: V,
      to: Y.toHandle && V ? Fe({ x: Y.toHandle.x, y: Y.toHandle.y }, O) : L,
      toHandle: Y.toHandle,
      toPosition: V && Y.toHandle ? Y.toHandle.position : nn[X.position],
      toNode: Y.toHandle ? g.get(Y.toHandle.nodeId) : null,
      pointer: L
    };
    l(re), q = re;
  }
  function U(G) {
    if (!("touches" in G && G.touches.length > 0)) {
      if (T) {
        (A || B) && Z && V && x?.(Z);
        const { inProgress: O, ...Y } = q, Q = {
          ...Y,
          toPosition: q.toHandle ? q.toPosition : null
        };
        m?.(G, Q), s && w?.(G, Q);
      }
      p(), cancelAnimationFrame(z), _ = !1, V = !1, Z = null, B = null, N.removeEventListener("mousemove", R), N.removeEventListener("mouseup", U), N.removeEventListener("touchmove", R), N.removeEventListener("touchend", U);
    }
  }
  N.addEventListener("mousemove", R), N.addEventListener("mouseup", U), N.addEventListener("touchmove", R), N.addEventListener("touchend", U);
}
function bo(e, { handle: t, connectionMode: n, fromNodeId: o, fromHandleId: r, fromType: s, doc: i, lib: a, flowId: g, isValidConnection: u = wo, nodeLookup: h }) {
  const c = s === "target", f = t ? i.querySelector(`.${a}-flow__handle[data-id="${g}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: p, y: d } = fe(e), x = i.elementFromPoint(p, d), m = x?.classList.contains(`${a}-flow__handle`) ? x : f, y = {
    handleDomNode: m,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (m) {
    const w = xo(void 0, m), l = m.getAttribute("data-nodeid"), b = m.getAttribute("data-handleid"), S = m.classList.contains("connectable"), E = m.classList.contains("connectableend");
    if (!l || !w)
      return y;
    const v = {
      source: c ? l : o,
      sourceHandle: c ? b : r,
      target: c ? o : l,
      targetHandle: c ? r : b
    };
    y.connection = v;
    const N = S && E && (n === Re.Strict ? c && w === "source" || !c && w === "target" : l !== o || b !== r);
    y.isValid = N && u(v), y.toHandle = yo(l, w, b, h, n, !0);
  }
  return y;
}
const _t = {
  onPointerDown: qs,
  isValid: bo
};
function Us({ domNode: e, panZoom: t, getTransform: n, getViewScale: o }) {
  const r = ft(e);
  function s({ translateExtent: a, width: g, height: u, zoomStep: h = 1, pannable: c = !0, zoomable: f = !0, inversePan: p = !1 }) {
    const d = (l) => {
      if (l.sourceEvent.type !== "wheel" || !t)
        return;
      const b = n(), S = l.sourceEvent.ctrlKey && Ue() ? 10 : 1, E = -l.sourceEvent.deltaY * (l.sourceEvent.deltaMode === 1 ? 0.05 : l.sourceEvent.deltaMode ? 1 : 2e-3) * h, v = b[2] * Math.pow(2, E * S);
      t.scaleTo(v);
    };
    let x = [0, 0];
    const m = (l) => {
      (l.sourceEvent.type === "mousedown" || l.sourceEvent.type === "touchstart") && (x = [
        l.sourceEvent.clientX ?? l.sourceEvent.touches[0].clientX,
        l.sourceEvent.clientY ?? l.sourceEvent.touches[0].clientY
      ]);
    }, y = (l) => {
      const b = n();
      if (l.sourceEvent.type !== "mousemove" && l.sourceEvent.type !== "touchmove" || !t)
        return;
      const S = [
        l.sourceEvent.clientX ?? l.sourceEvent.touches[0].clientX,
        l.sourceEvent.clientY ?? l.sourceEvent.touches[0].clientY
      ], E = [S[0] - x[0], S[1] - x[1]];
      x = S;
      const v = o() * Math.max(b[2], Math.log(b[2])) * (p ? -1 : 1), C = {
        x: b[0] - E[0] * v,
        y: b[1] - E[1] * v
      }, N = [
        [0, 0],
        [g, u]
      ];
      t.setViewportConstrained({
        x: C.x,
        y: C.y,
        zoom: b[2]
      }, N, a);
    }, w = Wn().on("start", m).on("zoom", c ? y : null).on("zoom.wheel", f ? d : null);
    r.call(w, {});
  }
  function i() {
    r.on("zoom", null);
  }
  return {
    update: s,
    destroy: i,
    pointer: Yn
  };
}
const pt = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Mt = ({ x: e, y: t, zoom: n }) => cs.translate(e, t).scale(n), Be = (e, t) => e.target.closest(`.${t}`), Eo = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Qs = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, It = (e, t = 0, n = Qs, o = () => {
}) => {
  const r = typeof t == "number" && t > 0;
  return r || o(), r ? e.transition().duration(t).ease(n).on("end", o) : e;
}, So = (e) => {
  const t = e.ctrlKey && Ue() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function js({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: o, panOnScrollMode: r, panOnScrollSpeed: s, zoomOnPinch: i, onPanZoomStart: a, onPanZoom: g, onPanZoomEnd: u }) {
  return (h) => {
    if (Be(h, t))
      return h.ctrlKey && h.preventDefault(), !1;
    h.preventDefault(), h.stopImmediatePropagation();
    const c = n.property("__zoom").k || 1;
    if (h.ctrlKey && i) {
      const m = Yn(h), y = So(h), w = c * Math.pow(2, y);
      o.scaleTo(n, w, m, h);
      return;
    }
    const f = h.deltaMode === 1 ? 20 : 1;
    let p = r === $e.Vertical ? 0 : h.deltaX * f, d = r === $e.Horizontal ? 0 : h.deltaY * f;
    !Ue() && h.shiftKey && r !== $e.Vertical && (p = h.deltaY * f, d = 0), o.translateBy(
      n,
      -(p / c) * s,
      -(d / c) * s,
      // @ts-ignore
      { internal: !0 }
    );
    const x = pt(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? g?.(h, x) : (e.isPanScrolling = !0, a?.(h, x)), e.panScrollTimeout = setTimeout(() => {
      u?.(h, x), e.isPanScrolling = !1;
    }, 150);
  };
}
function Js({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(o, r) {
    const s = o.type === "wheel", i = !t && s && !o.ctrlKey, a = Be(o, e);
    if (o.ctrlKey && s && a && o.preventDefault(), i || a)
      return null;
    o.preventDefault(), n.call(this, o, r);
  };
}
function ei({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (o) => {
    if (o.sourceEvent?.internal)
      return;
    const r = pt(o.transform);
    e.mouseButton = o.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = r, o.sourceEvent?.type === "mousedown" && t(!0), n && n?.(o.sourceEvent, r);
  };
}
function ti({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: o, onPanZoom: r }) {
  return (s) => {
    e.usedRightMouseButton = !!(n && Eo(t, e.mouseButton ?? 0)), s.sourceEvent?.sync || o([s.transform.x, s.transform.y, s.transform.k]), r && !s.sourceEvent?.internal && r?.(s.sourceEvent, pt(s.transform));
  };
}
function ni({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: o, onPanZoomEnd: r, onPaneContextMenu: s }) {
  return (i) => {
    if (!i.sourceEvent?.internal && (e.isZoomingOrPanning = !1, s && Eo(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && i.sourceEvent && s(i.sourceEvent), e.usedRightMouseButton = !1, o(!1), r)) {
      const a = pt(i.transform);
      e.prevViewport = a, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          r?.(i.sourceEvent, a);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function oi({ zoomActivationKeyPressed: e, zoomOnScroll: t, zoomOnPinch: n, panOnDrag: o, panOnScroll: r, zoomOnDoubleClick: s, userSelectionActive: i, noWheelClassName: a, noPanClassName: g, lib: u, connectionInProgress: h }) {
  return (c) => {
    const f = e || t, p = n && c.ctrlKey, d = c.type === "wheel";
    if (c.button === 1 && c.type === "mousedown" && (Be(c, `${u}-flow__node`) || Be(c, `${u}-flow__edge`)))
      return !0;
    if (!o && !f && !r && !s && !n || i || h && !d || Be(c, a) && d || Be(c, g) && (!d || r && d && !e) || !n && c.ctrlKey && d)
      return !1;
    if (!n && c.type === "touchstart" && c.touches?.length > 1)
      return c.preventDefault(), !1;
    if (!f && !r && !p && d || !o && (c.type === "mousedown" || c.type === "touchstart") || Array.isArray(o) && !o.includes(c.button) && c.type === "mousedown")
      return !1;
    const x = Array.isArray(o) && o.includes(c.button) || !c.button || c.button <= 1;
    return (!c.ctrlKey || d) && x;
  };
}
function ri({ domNode: e, minZoom: t, maxZoom: n, translateExtent: o, viewport: r, onPanZoom: s, onPanZoomStart: i, onPanZoomEnd: a, onDraggingChange: g }) {
  const u = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, h = e.getBoundingClientRect();
  let c = [
    [0, 0],
    [h.width, h.height]
  ];
  (typeof ResizeObserver < "u" ? new ResizeObserver((P) => {
    const k = P[0];
    k && (c = [
      [0, 0],
      [k.contentRect.width, k.contentRect.height]
    ]);
  }) : null)?.observe(e);
  const p = Wn().extent(() => c).scaleExtent([t, n]).translateExtent(o), d = ft(e).call(p);
  b({
    x: r.x,
    y: r.y,
    zoom: Oe(r.zoom, t, n)
  }, [
    [0, 0],
    [h.width, h.height]
  ], o);
  const x = d.on("wheel.zoom"), m = d.on("dblclick.zoom");
  p.wheelDelta(So);
  async function y(P, k) {
    return d ? new Promise((M) => {
      p?.interpolate(k?.interpolate === "linear" ? Nt : vt).transform(It(d, k?.duration, k?.ease, () => M(!0)), P);
    }) : !1;
  }
  function w({ noWheelClassName: P, noPanClassName: k, onPaneContextMenu: M, userSelectionActive: T, panOnScroll: D, panOnDrag: L, panOnScrollMode: _, panOnScrollSpeed: Z, preventScrolling: V, zoomOnPinch: B, zoomOnScroll: W, zoomOnDoubleClick: X, zoomActivationKeyPressed: K, lib: te, onTransformChange: q, connectionInProgress: H, paneClickDistance: R, selectionOnDrag: U }) {
    T && !u.isZoomingOrPanning && l();
    const G = D && !K && !T;
    p.clickDistance(U ? 1 / 0 : !ue(R) || R < 0 ? 0 : R);
    const O = G ? js({
      zoomPanValues: u,
      noWheelClassName: P,
      d3Selection: d,
      d3Zoom: p,
      panOnScrollMode: _,
      panOnScrollSpeed: Z,
      zoomOnPinch: B,
      onPanZoomStart: i,
      onPanZoom: s,
      onPanZoomEnd: a
    }) : Js({
      noWheelClassName: P,
      preventScrolling: V,
      d3ZoomHandler: x
    });
    d.on("wheel.zoom", O, { passive: !1 });
    const Y = ei({
      zoomPanValues: u,
      onDraggingChange: g,
      onPanZoomStart: i
    });
    p.on("start", Y);
    const Q = ti({
      zoomPanValues: u,
      panOnDrag: L,
      onPaneContextMenu: !!M,
      onPanZoom: s,
      onTransformChange: q
    });
    p.on("zoom", Q);
    const ee = ni({
      zoomPanValues: u,
      panOnDrag: L,
      panOnScroll: D,
      onPaneContextMenu: M,
      onPanZoomEnd: a,
      onDraggingChange: g
    });
    p.on("end", ee);
    const re = oi({
      zoomActivationKeyPressed: K,
      panOnDrag: L,
      zoomOnScroll: W,
      panOnScroll: D,
      zoomOnDoubleClick: X,
      zoomOnPinch: B,
      userSelectionActive: T,
      noPanClassName: k,
      noWheelClassName: P,
      lib: te,
      connectionInProgress: H
    });
    p.filter(re), X ? d.on("dblclick.zoom", m) : d.on("dblclick.zoom", null);
  }
  function l() {
    p.on("zoom", null);
  }
  async function b(P, k, M) {
    const T = Mt(P), D = p?.constrain()(T, k, M);
    return D && await y(D), D;
  }
  async function S(P, k) {
    const M = Mt(P);
    return await y(M, k), M;
  }
  function E(P) {
    if (d) {
      const k = Mt(P), M = d.property("__zoom");
      (M.k !== P.zoom || M.x !== P.x || M.y !== P.y) && p?.transform(d, k, null, { sync: !0 });
    }
  }
  function v() {
    const P = d ? ls(d.node()) : { x: 0, y: 0, k: 1 };
    return { x: P.x, y: P.y, zoom: P.k };
  }
  async function C(P, k) {
    return d ? new Promise((M) => {
      p?.interpolate(k?.interpolate === "linear" ? Nt : vt).scaleTo(It(d, k?.duration, k?.ease, () => M(!0)), P);
    }) : !1;
  }
  async function N(P, k) {
    return d ? new Promise((M) => {
      p?.interpolate(k?.interpolate === "linear" ? Nt : vt).scaleBy(It(d, k?.duration, k?.ease, () => M(!0)), P);
    }) : !1;
  }
  function z(P) {
    p?.scaleExtent(P);
  }
  function A(P) {
    p?.translateExtent(P);
  }
  function $(P) {
    const k = !ue(P) || P < 0 ? 0 : P;
    p?.clickDistance(k);
  }
  return {
    update: w,
    destroy: l,
    setViewport: S,
    setViewportConstrained: b,
    getViewport: v,
    scaleTo: C,
    scaleBy: N,
    setScaleExtent: z,
    setTranslateExtent: A,
    syncViewport: E,
    setClickDistance: $
  };
}
var Ze;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(Ze || (Ze = {}));
function si({ width: e, prevWidth: t, height: n, prevHeight: o, affectsX: r, affectsY: s }) {
  const i = e - t, a = n - o, g = [i > 0 ? 1 : i < 0 ? -1 : 0, a > 0 ? 1 : a < 0 ? -1 : 0];
  return i && r && (g[0] = g[0] * -1), a && s && (g[1] = g[1] * -1), g;
}
function mn(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), o = e.includes("left"), r = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: o,
    affectsY: r
  };
}
function Ce(e, t) {
  return Math.max(0, t - e);
}
function Me(e, t) {
  return Math.max(0, e - t);
}
function ot(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function yn(e, t) {
  return e ? !t : t;
}
function ii(e, t, n, o, r, s, i, a) {
  let { affectsX: g, affectsY: u } = t;
  const { isHorizontal: h, isVertical: c } = t, f = h && c, { xSnapped: p, ySnapped: d } = n, { minWidth: x, maxWidth: m, minHeight: y, maxHeight: w } = o, { x: l, y: b, width: S, height: E, aspectRatio: v } = e;
  let C = Math.floor(h ? p - e.pointerX : 0), N = Math.floor(c ? d - e.pointerY : 0);
  const z = S + (g ? -C : C), A = E + (u ? -N : N), $ = -s[0] * S, P = -s[1] * E;
  let k = ot(z, x, m), M = ot(A, y, w);
  if (i) {
    let L = 0, _ = 0;
    g && C < 0 ? L = Ce(l + C + $, i[0][0]) : !g && C > 0 && (L = Me(l + z + $, i[1][0])), u && N < 0 ? _ = Ce(b + N + P, i[0][1]) : !u && N > 0 && (_ = Me(b + A + P, i[1][1])), k = Math.max(k, L), M = Math.max(M, _);
  }
  if (a) {
    let L = 0, _ = 0;
    g && C > 0 ? L = Me(l + C, a[0][0]) : !g && C < 0 && (L = Ce(l + z, a[1][0])), u && N > 0 ? _ = Me(b + N, a[0][1]) : !u && N < 0 && (_ = Ce(b + A, a[1][1])), k = Math.max(k, L), M = Math.max(M, _);
  }
  if (r) {
    if (h) {
      const L = ot(z / v, y, w) * v;
      if (k = Math.max(k, L), i) {
        let _ = 0;
        !g && !u || g && !u && f ? _ = Me(b + P + z / v, i[1][1]) * v : _ = Ce(b + P + (g ? C : -C) / v, i[0][1]) * v, k = Math.max(k, _);
      }
      if (a) {
        let _ = 0;
        !g && !u || g && !u && f ? _ = Ce(b + z / v, a[1][1]) * v : _ = Me(b + (g ? C : -C) / v, a[0][1]) * v, k = Math.max(k, _);
      }
    }
    if (c) {
      const L = ot(A * v, x, m) / v;
      if (M = Math.max(M, L), i) {
        let _ = 0;
        !g && !u || u && !g && f ? _ = Me(l + A * v + $, i[1][0]) / v : _ = Ce(l + (u ? N : -N) * v + $, i[0][0]) / v, M = Math.max(M, _);
      }
      if (a) {
        let _ = 0;
        !g && !u || u && !g && f ? _ = Ce(l + A * v, a[1][0]) / v : _ = Me(l + (u ? N : -N) * v, a[0][0]) / v, M = Math.max(M, _);
      }
    }
  }
  N = N + (N < 0 ? M : -M), C = C + (C < 0 ? k : -k), r && (f ? z > A * v ? N = (yn(g, u) ? -C : C) / v : C = (yn(g, u) ? -N : N) * v : h ? (N = C / v, u = g) : (C = N * v, g = u));
  const T = g ? l + C : l, D = u ? b + N : b;
  return {
    width: S + (g ? -C : C),
    height: E + (u ? -N : N),
    x: s[0] * C * (g ? -1 : 1) + T,
    y: s[1] * N * (u ? -1 : 1) + D
  };
}
const vo = { width: 0, height: 0, x: 0, y: 0 }, ai = {
  ...vo,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function ci(e, t, n) {
  const o = t.position.x + e.position.x, r = t.position.y + e.position.y, s = e.measured.width ?? 0, i = e.measured.height ?? 0, a = n[0] * s, g = n[1] * i;
  return [
    [o - a, r - g],
    [o + s - a, r + i - g]
  ];
}
function li({ domNode: e, nodeId: t, getStoreItems: n, onChange: o, onEnd: r }) {
  const s = ft(e);
  let i = {
    controlDirection: mn("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function a({ controlPosition: u, boundaries: h, keepAspectRatio: c, resizeDirection: f, onResizeStart: p, onResize: d, onResizeEnd: x, shouldResize: m }) {
    let y = { ...vo }, w = { ...ai };
    i = {
      boundaries: h,
      resizeDirection: f,
      keepAspectRatio: c,
      controlDirection: mn(u)
    };
    let l, b = null, S = [], E, v, C, N = !1;
    const z = Xn().on("start", (A) => {
      const { nodeLookup: $, transform: P, snapGrid: k, snapToGrid: M, nodeOrigin: T, paneDomNode: D } = n();
      if (l = $.get(t), !l)
        return;
      b = D?.getBoundingClientRect() ?? null;
      const { xSnapped: L, ySnapped: _ } = Xe(A.sourceEvent, {
        transform: P,
        snapGrid: k,
        snapToGrid: M,
        containerBounds: b
      });
      y = {
        width: l.measured.width ?? 0,
        height: l.measured.height ?? 0,
        x: l.position.x ?? 0,
        y: l.position.y ?? 0
      }, w = {
        ...y,
        pointerX: L,
        pointerY: _,
        aspectRatio: y.width / y.height
      }, E = void 0, v = Le(l.extent) ? l.extent : void 0, l.parentId && (l.extent === "parent" || l.expandParent) && (E = $.get(l.parentId)), E && l.extent === "parent" && (v = [
        [0, 0],
        [E.measured.width, E.measured.height]
      ]), S = [], C = void 0;
      for (const [Z, V] of $)
        if (V.parentId === t && (S.push({
          id: Z,
          position: { ...V.position },
          extent: V.extent
        }), V.extent === "parent" || V.expandParent)) {
          const B = ci(V, l, V.origin ?? T);
          C ? C = [
            [Math.min(B[0][0], C[0][0]), Math.min(B[0][1], C[0][1])],
            [Math.max(B[1][0], C[1][0]), Math.max(B[1][1], C[1][1])]
          ] : C = B;
        }
      p?.(A, { ...y });
    }).on("drag", (A) => {
      const { transform: $, snapGrid: P, snapToGrid: k, nodeOrigin: M } = n(), T = Xe(A.sourceEvent, {
        transform: $,
        snapGrid: P,
        snapToGrid: k,
        containerBounds: b
      }), D = [];
      if (!l)
        return;
      const { x: L, y: _, width: Z, height: V } = y, B = {}, W = l.origin ?? M, { width: X, height: K, x: te, y: q } = ii(w, i.controlDirection, T, i.boundaries, i.keepAspectRatio, W, v, C), H = X !== Z, R = K !== V, U = te !== L && H, G = q !== _ && R;
      if (!U && !G && !H && !R)
        return;
      if ((U || G || W[0] === 1 || W[1] === 1) && (B.x = U ? te : y.x, B.y = G ? q : y.y, y.x = B.x, y.y = B.y, S.length > 0)) {
        const ee = te - L, re = q - _;
        for (const le of S)
          le.position = {
            x: le.position.x - ee + W[0] * (X - Z),
            y: le.position.y - re + W[1] * (K - V)
          }, D.push(le);
      }
      if ((H || R) && (B.width = H && (!i.resizeDirection || i.resizeDirection === "horizontal") ? X : y.width, B.height = R && (!i.resizeDirection || i.resizeDirection === "vertical") ? K : y.height, y.width = B.width, y.height = B.height), E && l.expandParent) {
        const ee = W[0] * (B.width ?? 0);
        B.x && B.x < ee && (y.x = ee, w.x = w.x - (B.x - ee));
        const re = W[1] * (B.height ?? 0);
        B.y && B.y < re && (y.y = re, w.y = w.y - (B.y - re));
      }
      const O = si({
        width: y.width,
        prevWidth: Z,
        height: y.height,
        prevHeight: V,
        affectsX: i.controlDirection.affectsX,
        affectsY: i.controlDirection.affectsY
      }), Y = { ...y, direction: O };
      m?.(A, Y) !== !1 && (N = !0, d?.(A, Y), o(B, D));
    }).on("end", (A) => {
      N && (x?.(A, { ...y }), r?.({ ...y }), N = !1);
    });
    s.call(z);
  }
  function g() {
    s.on(".drag", null);
  }
  return {
    update: a,
    destroy: g
  };
}
const mt = ut(null), di = mt.Provider, No = pe.error001("react");
function j(e, t) {
  const n = Ye(mt);
  if (n === null)
    throw new Error(No);
  return us(n, e, t);
}
function oe() {
  const e = Ye(mt);
  if (e === null)
    throw new Error(No);
  return he(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const xn = { display: "none" }, ui = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, Co = "react-flow__node-desc", Mo = "react-flow__edge-desc", fi = "react-flow__aria-live", gi = (e) => e.ariaLiveMessage, hi = (e) => e.ariaLabelConfig;
function pi({ rfId: e }) {
  const t = j(gi);
  return I("div", { id: `${fi}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: ui, children: t });
}
function mi({ rfId: e, disableKeyboardA11y: t }) {
  const n = j(hi);
  return ce(Ne, { children: [I("div", { id: `${Co}-${e}`, style: xn, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), I("div", { id: `${Mo}-${e}`, style: xn, children: n["edge.a11yDescription.default"] }), !t && I(pi, { rfId: e })] });
}
const yt = Zn(({ position: e = "top-left", children: t, className: n, style: o, ...r }, s) => {
  const i = `${e}`.split("-");
  return I("div", { className: ae(["react-flow__panel", n, ...i]), style: o, ref: s, ...r, children: t });
});
yt.displayName = "Panel";
const wn = "https://reactflow.dev?utm_source=attribution";
function yi({ proOptions: e, position: t = "bottom-right" }) {
  return e?.hideAttribution ? null : I(yt, { position: t, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${wn}`, children: I("a", { href: wn, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const xi = (e) => {
  const t = [], n = [];
  for (const [, o] of e.nodeLookup)
    o.selected && t.push(o.internals.userNode);
  for (const [, o] of e.edgeLookup)
    o.selected && n.push(o);
  return { selectedNodes: t, selectedEdges: n };
}, rt = (e) => e.id;
function wi(e, t) {
  return se(e.selectedNodes.map(rt), t.selectedNodes.map(rt)) && se(e.selectedEdges.map(rt), t.selectedEdges.map(rt));
}
function bi({ onSelectionChange: e }) {
  const t = oe(), { selectedNodes: n, selectedEdges: o } = j(xi, wi);
  return ne(() => {
    const r = { nodes: n, edges: o };
    e?.(r), t.getState().onSelectionChangeHandlers.forEach((s) => s(r));
  }, [n, o, e]), null;
}
const Ei = (e) => !!e.onSelectionChangeHandlers;
function Si({ onSelectionChange: e }) {
  const t = j(Ei);
  return e || t ? I(bi, { onSelectionChange: e }) : null;
}
const Io = [0, 0], vi = { x: 0, y: 0, zoom: 1 }, Ni = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
], bn = [...Ni, "rfId"], Ci = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), En = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: Ge,
  nodeOrigin: Io,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function Mi(e) {
  const { setNodes: t, setEdges: n, setMinZoom: o, setMaxZoom: r, setTranslateExtent: s, setNodeExtent: i, reset: a, setDefaultNodesAndEdges: g } = j(Ci, se), u = oe();
  ne(() => (g(e.defaultNodes, e.defaultEdges), () => {
    h.current = En, a();
  }), []);
  const h = J(En);
  return ne(
    () => {
      for (const c of bn) {
        const f = e[c], p = h.current[c];
        f !== p && (typeof e[c] > "u" || (c === "nodes" ? t(f) : c === "edges" ? n(f) : c === "minZoom" ? o(f) : c === "maxZoom" ? r(f) : c === "translateExtent" ? s(f) : c === "nodeExtent" ? i(f) : c === "ariaLabelConfig" ? u.setState({ ariaLabelConfig: Ss(f) }) : c === "fitView" ? u.setState({ fitViewQueued: f }) : c === "fitViewOptions" ? u.setState({ fitViewOptions: f }) : u.setState({ [c]: f })));
      }
      h.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    bn.map((c) => e[c])
  ), null;
}
function Sn() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Ii(e) {
  const [t, n] = ge(e === "system" ? null : e);
  return ne(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const o = Sn(), r = () => n(o?.matches ? "dark" : "light");
    return r(), o?.addEventListener("change", r), () => {
      o?.removeEventListener("change", r);
    };
  }, [e]), t !== null ? t : Sn()?.matches ? "dark" : "light";
}
const vn = typeof document < "u" ? document : null;
function Qe(e = null, t = { target: vn, actInsideInputWithModifier: !0 }) {
  const [n, o] = ge(!1), r = J(!1), s = J(/* @__PURE__ */ new Set([])), [i, a] = he(() => {
    if (e !== null) {
      const u = (Array.isArray(e) ? e : [e]).filter((c) => typeof c == "string").map((c) => c.replace("+", `
`).replace(`

`, `
+`).split(`
`)), h = u.reduce((c, f) => c.concat(...f), []);
      return [u, h];
    }
    return [[], []];
  }, [e]);
  return ne(() => {
    const g = t?.target ?? vn, u = t?.actInsideInputWithModifier ?? !0;
    if (e !== null) {
      const h = (p) => {
        if (r.current = p.ctrlKey || p.metaKey || p.shiftKey || p.altKey, (!r.current || r.current && !u) && io(p))
          return !1;
        const x = Cn(p.code, a);
        if (s.current.add(p[x]), Nn(i, s.current, !1)) {
          const m = p.composedPath?.()?.[0] || p.target, y = m?.nodeName === "BUTTON" || m?.nodeName === "A";
          t.preventDefault !== !1 && (r.current || !y) && p.preventDefault(), o(!0);
        }
      }, c = (p) => {
        const d = Cn(p.code, a);
        Nn(i, s.current, !0) ? (o(!1), s.current.clear()) : s.current.delete(p[d]), p.key === "Meta" && s.current.clear(), r.current = !1;
      }, f = () => {
        s.current.clear(), o(!1);
      };
      return g?.addEventListener("keydown", h), g?.addEventListener("keyup", c), window.addEventListener("blur", f), window.addEventListener("contextmenu", f), () => {
        g?.removeEventListener("keydown", h), g?.removeEventListener("keyup", c), window.removeEventListener("blur", f), window.removeEventListener("contextmenu", f);
      };
    }
  }, [e, o]), n;
}
function Nn(e, t, n) {
  return e.filter((o) => n || o.length === t.size).some((o) => o.every((r) => t.has(r)));
}
function Cn(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Pi = () => {
  const e = oe();
  return he(() => ({
    zoomIn: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, t) : !1;
    },
    zoomOut: async (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, t) : !1;
    },
    zoomTo: async (t, n) => {
      const { panZoom: o } = e.getState();
      return o ? o.scaleTo(t, n) : !1;
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      const { transform: [o, r, s], panZoom: i } = e.getState();
      return i ? (await i.setViewport({
        x: t.x ?? o,
        y: t.y ?? r,
        zoom: t.zoom ?? s
      }, n), !0) : !1;
    },
    getViewport: () => {
      const [t, n, o] = e.getState().transform;
      return { x: t, y: n, zoom: o };
    },
    setCenter: async (t, n, o) => e.getState().setCenter(t, n, o),
    fitBounds: async (t, n) => {
      const { width: o, height: r, minZoom: s, maxZoom: i, panZoom: a } = e.getState(), g = Vt(t, o, r, s, i, n?.padding ?? 0.1);
      return a ? (await a.setViewport(g, {
        duration: n?.duration,
        ease: n?.ease,
        interpolate: n?.interpolate
      }), !0) : !1;
    },
    screenToFlowPosition: (t, n = {}) => {
      const { transform: o, snapGrid: r, snapToGrid: s, domNode: i } = e.getState();
      if (!i)
        return t;
      const { x: a, y: g } = i.getBoundingClientRect(), u = {
        x: t.x - a,
        y: t.y - g
      }, h = n.snapGrid ?? r, c = n.snapToGrid ?? s;
      return tt(u, o, c, h);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: o } = e.getState();
      if (!o)
        return t;
      const { x: r, y: s } = o.getBoundingClientRect(), i = Fe(t, n);
      return {
        x: i.x + r,
        y: i.y + s
      };
    }
  }), []);
};
function Po(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = [];
  for (const s of e)
    if (s.type === "add") {
      r.push(s);
      continue;
    } else if (s.type === "remove" || s.type === "replace")
      o.set(s.id, [s]);
    else {
      const i = o.get(s.id);
      i ? i.push(s) : o.set(s.id, [s]);
    }
  for (const s of t) {
    const i = o.get(s.id);
    if (!i) {
      n.push(s);
      continue;
    }
    if (i[0].type === "remove")
      continue;
    if (i[0].type === "replace") {
      n.push({ ...i[0].item });
      continue;
    }
    const a = { ...s };
    for (const g of i)
      Ai(g, a);
    n.push(a);
  }
  return r.length && r.forEach((s) => {
    s.index !== void 0 ? n.splice(s.index, 0, { ...s.item }) : n.push({ ...s.item });
  }), n;
}
function Ai(e, t) {
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && (t.measured = {
        ...e.dimensions
      }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function ki(e, t) {
  return Po(e, t);
}
function Hi(e, t) {
  return Po(e, t);
}
function De(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ve(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [r, s] of e) {
    const i = t.has(r);
    !(s.selected === void 0 && !i) && s.selected !== i && (n && (s.selected = i), o.push(De(s.id, i)));
  }
  return o;
}
function Mn({ items: e = [], lookup: t }) {
  const n = [], o = new Map(e.map((r) => [r.id, r]));
  for (const [r, s] of e.entries()) {
    const i = t.get(s.id), a = i?.internals?.userNode ?? i;
    a !== void 0 && a !== s && n.push({ id: s.id, item: s, type: "replace" }), a === void 0 && n.push({ item: s, type: "add", index: r });
  }
  for (const [r] of t)
    o.get(r) === void 0 && n.push({ id: r, type: "remove" });
  return n;
}
function In(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const Di = no();
function $i(e, t, n = {}) {
  return Ps(e, t, {
    ...n,
    onError: n.onError ?? Di
  });
}
const Pn = (e) => gs(e), _i = (e) => Qn(e);
function Ao(e) {
  return Zn(e);
}
const ko = typeof window < "u" ? as : ne;
function An(e) {
  const [t, n] = ge(BigInt(0)), [o] = ge(() => Li(() => n((r) => r + BigInt(1))));
  return ko(() => {
    const r = o.get();
    r.length && (e(r), o.reset());
  }, [t]), o;
}
function Li(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const Ho = ut(null);
function zi({ children: e }) {
  const t = oe(), n = xe((a) => {
    const { nodes: g = [], setNodes: u, hasDefaultNodes: h, onNodesChange: c, nodeLookup: f, fitViewQueued: p, onNodesChangeMiddlewareMap: d } = t.getState();
    let x = g;
    for (const y of a)
      x = typeof y == "function" ? y(x) : y;
    let m = Mn({
      items: x,
      lookup: f
    });
    for (const y of d.values())
      m = y(m);
    h && u(x), m.length > 0 ? c?.(m) : p && window.requestAnimationFrame(() => {
      const { fitViewQueued: y, nodes: w, setNodes: l } = t.getState();
      y && l(w);
    });
  }, []), o = An(n), r = xe((a) => {
    const { edges: g = [], setEdges: u, hasDefaultEdges: h, onEdgesChange: c, edgeLookup: f } = t.getState();
    let p = g;
    for (const d of a)
      p = typeof d == "function" ? d(p) : d;
    h ? u(p) : c && c(Mn({
      items: p,
      lookup: f
    }));
  }, []), s = An(r), i = he(() => ({ nodeQueue: o, edgeQueue: s }), []);
  return I(Ho.Provider, { value: i, children: e });
}
function Ti() {
  const e = Ye(Ho);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const Bi = (e) => !!e.panZoom;
function Xt() {
  const e = Pi(), t = oe(), n = Ti(), o = j(Bi), r = he(() => {
    const s = (c) => t.getState().nodeLookup.get(c), i = (c) => {
      n.nodeQueue.push(c);
    }, a = (c) => {
      n.edgeQueue.push(c);
    }, g = (c) => {
      const { nodeLookup: f, nodeOrigin: p } = t.getState(), d = Pn(c) ? c : f.get(c.id), x = d.parentId ? ro(d.position, d.measured, d.parentId, f, p) : d.position, m = {
        ...d,
        position: x,
        width: d.measured?.width ?? d.width,
        height: d.measured?.height ?? d.height
      };
      return qe(m);
    }, u = (c, f, p = { replace: !1 }) => {
      i((d) => d.map((x) => {
        if (x.id === c) {
          const m = typeof f == "function" ? f(x) : f;
          return p.replace && Pn(m) ? m : { ...x, ...m };
        }
        return x;
      }));
    }, h = (c, f, p = { replace: !1 }) => {
      a((d) => d.map((x) => {
        if (x.id === c) {
          const m = typeof f == "function" ? f(x) : f;
          return p.replace && _i(m) ? m : { ...x, ...m };
        }
        return x;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((c) => ({ ...c })),
      getNode: (c) => s(c)?.internals.userNode,
      getInternalNode: s,
      getEdges: () => {
        const { edges: c = [] } = t.getState();
        return c.map((f) => ({ ...f }));
      },
      getEdge: (c) => t.getState().edgeLookup.get(c),
      setNodes: i,
      setEdges: a,
      addNodes: (c) => {
        const f = Array.isArray(c) ? c : [c];
        n.nodeQueue.push((p) => [...p, ...f]);
      },
      addEdges: (c) => {
        const f = Array.isArray(c) ? c : [c];
        n.edgeQueue.push((p) => [...p, ...f]);
      },
      toObject: () => {
        const { nodes: c = [], edges: f = [], transform: p } = t.getState(), [d, x, m] = p;
        return {
          nodes: c.map((y) => ({ ...y })),
          edges: f.map((y) => ({ ...y })),
          viewport: {
            x: d,
            y: x,
            zoom: m
          }
        };
      },
      deleteElements: async ({ nodes: c = [], edges: f = [] }) => {
        const { nodes: p, edges: d, onNodesDelete: x, onEdgesDelete: m, triggerNodeChanges: y, triggerEdgeChanges: w, onDelete: l, onBeforeDelete: b } = t.getState(), { nodes: S, edges: E } = await xs({
          nodesToRemove: c,
          edgesToRemove: f,
          nodes: p,
          edges: d,
          onBeforeDelete: b
        }), v = E.length > 0, C = S.length > 0;
        if (v) {
          const N = E.map(In);
          m?.(E), w(N);
        }
        if (C) {
          const N = S.map(In);
          x?.(S), y(N);
        }
        return (C || v) && l?.({ nodes: S, edges: E }), { deletedNodes: S, deletedEdges: E };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (c, f = !0, p) => {
        const d = rn(c), x = d ? c : g(c), m = p !== void 0;
        return x ? (p || t.getState().nodes).filter((y) => {
          const w = t.getState().nodeLookup.get(y.id);
          if (w && !d && (y.id === c.id || !w.internals.positionAbsolute))
            return !1;
          const l = qe(m ? y : w), b = ct(l, x);
          return f && b > 0 || b >= l.width * l.height || b >= x.width * x.height;
        }) : [];
      },
      isNodeIntersecting: (c, f, p = !0) => {
        const x = rn(c) ? c : g(c);
        if (!x)
          return !1;
        const m = ct(x, f);
        return p && m > 0 || m >= f.width * f.height || m >= x.width * x.height;
      },
      updateNode: u,
      updateNodeData: (c, f, p = { replace: !1 }) => {
        u(c, (d) => {
          const x = typeof f == "function" ? f(d) : f;
          return p.replace ? { ...d, data: x } : { ...d, data: { ...d.data, ...x } };
        }, p);
      },
      updateEdge: h,
      updateEdgeData: (c, f, p = { replace: !1 }) => {
        h(c, (d) => {
          const x = typeof f == "function" ? f(d) : f;
          return p.replace ? { ...d, data: x } : { ...d, data: { ...d.data, ...x } };
        }, p);
      },
      getNodesBounds: (c) => {
        const { nodeLookup: f, nodeOrigin: p } = t.getState();
        return hs(c, { nodeLookup: f, nodeOrigin: p });
      },
      getHandleConnections: ({ type: c, id: f, nodeId: p }) => Array.from(t.getState().connectionLookup.get(`${p}-${c}${f ? `-${f}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type: c, handleId: f, nodeId: p }) => Array.from(t.getState().connectionLookup.get(`${p}${c ? f ? `-${c}-${f}` : `-${c}` : ""}`)?.values() ?? []),
      fitView: async (c) => {
        const f = t.getState().fitViewResolver ?? Es();
        return t.setState({ fitViewQueued: !0, fitViewOptions: c, fitViewResolver: f }), n.nodeQueue.push((p) => [...p]), f.promise;
      }
    };
  }, []);
  return he(() => ({
    ...r,
    ...e,
    viewportInitialized: o
  }), [o]);
}
const kn = (e) => e.selected, Vi = typeof window < "u" ? window : void 0;
function Ri({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = oe(), { deleteElements: o } = Xt(), r = Qe(e, { actInsideInputWithModifier: !1 }), s = Qe(t, { target: Vi });
  ne(() => {
    if (r) {
      const { edges: i, nodes: a } = n.getState();
      o({ nodes: a.filter(kn), edges: i.filter(kn) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [r]), ne(() => {
    n.setState({ multiSelectionActive: s });
  }, [s]);
}
function Oi(e) {
  const t = oe();
  ne(() => {
    const n = () => {
      if (!e.current || !(e.current.checkVisibility?.() ?? !0))
        return !1;
      const o = Rt(e.current);
      (o.height === 0 || o.width === 0) && t.getState().onError?.("004", pe.error004()), t.setState({ width: o.width || 500, height: o.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const o = new ResizeObserver(() => n());
      return o.observe(e.current), () => {
        window.removeEventListener("resize", n), o && e.current && o.unobserve(e.current);
      };
    }
  }, []);
}
const xt = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, Fi = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function Zi({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: o = !1, panOnScrollSpeed: r = 0.5, panOnScrollMode: s = $e.Free, zoomOnDoubleClick: i = !0, panOnDrag: a = !0, defaultViewport: g, translateExtent: u, minZoom: h, maxZoom: c, zoomActivationKeyCode: f, preventScrolling: p = !0, children: d, noWheelClassName: x, noPanClassName: m, onViewportChange: y, isControlledViewport: w, paneClickDistance: l, selectionOnDrag: b }) {
  const S = oe(), E = J(null), { userSelectionActive: v, lib: C, connectionInProgress: N } = j(Fi, se), z = Qe(f), A = J();
  Oi(E);
  const $ = xe((P) => {
    y?.({ x: P[0], y: P[1], zoom: P[2] }), w || S.setState({ transform: P });
  }, [y, w]);
  return ne(() => {
    if (E.current) {
      A.current = ri({
        domNode: E.current,
        minZoom: h,
        maxZoom: c,
        translateExtent: u,
        viewport: g,
        onDraggingChange: (T) => S.setState((D) => D.paneDragging === T ? D : { paneDragging: T }),
        onPanZoomStart: (T, D) => {
          const { onViewportChangeStart: L, onMoveStart: _ } = S.getState();
          _?.(T, D), L?.(D);
        },
        onPanZoom: (T, D) => {
          const { onViewportChange: L, onMove: _ } = S.getState();
          _?.(T, D), L?.(D);
        },
        onPanZoomEnd: (T, D) => {
          const { onViewportChangeEnd: L, onMoveEnd: _ } = S.getState();
          _?.(T, D), L?.(D);
        }
      });
      const { x: P, y: k, zoom: M } = A.current.getViewport();
      return S.setState({
        panZoom: A.current,
        transform: [P, k, M],
        domNode: E.current.closest(".react-flow")
      }), () => {
        A.current?.destroy();
      };
    }
  }, []), ne(() => {
    A.current?.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: o,
      panOnScrollSpeed: r,
      panOnScrollMode: s,
      zoomOnDoubleClick: i,
      panOnDrag: a,
      zoomActivationKeyPressed: z,
      preventScrolling: p,
      noPanClassName: m,
      userSelectionActive: v,
      noWheelClassName: x,
      lib: C,
      onTransformChange: $,
      connectionInProgress: N,
      selectionOnDrag: b,
      paneClickDistance: l
    });
  }, [
    e,
    t,
    n,
    o,
    r,
    s,
    i,
    a,
    z,
    p,
    m,
    v,
    x,
    C,
    $,
    N,
    b,
    l
  ]), I("div", { className: "react-flow__renderer", ref: E, style: xt, children: d });
}
const Yi = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function Wi() {
  const { userSelectionActive: e, userSelectionRect: t } = j(Yi, se);
  return e && t ? I("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Pt = (e, t) => (n) => {
  n.target === t.current && e?.(n);
}, Xi = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  dragging: e.paneDragging,
  panBy: e.panBy,
  autoPanSpeed: e.autoPanSpeed
});
function Gi({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Ke.Full, panOnDrag: o, autoPanOnSelection: r, paneClickDistance: s, selectionOnDrag: i, onSelectionStart: a, onSelectionEnd: g, onPaneClick: u, onPaneContextMenu: h, onPaneScroll: c, onPaneMouseEnter: f, onPaneMouseMove: p, onPaneMouseLeave: d, children: x }) {
  const m = J(0), y = oe(), { userSelectionActive: w, elementsSelectable: l, dragging: b, panBy: S, autoPanSpeed: E } = j(Xi, se), v = l && (e || w), C = J(null), N = J(), z = J(/* @__PURE__ */ new Set()), A = J(/* @__PURE__ */ new Set()), $ = J(!1), P = J(!1), k = J({ x: 0, y: 0 }), M = J(!1), T = (H) => {
    if (P.current || $.current || y.getState().connection.inProgress) {
      P.current = !1, $.current = !1;
      return;
    }
    u?.(H), y.getState().resetSelectedElements(), y.setState({ nodesSelectionActive: !1 });
  }, D = (H) => {
    if (Array.isArray(o) && o?.includes(2)) {
      H.preventDefault();
      return;
    }
    h?.(H);
  }, L = c ? (H) => c(H) : void 0, _ = (H) => {
    P.current && (H.stopPropagation(), P.current = !1);
  }, Z = (H) => {
    const { domNode: R, transform: U } = y.getState();
    if (N.current = R?.getBoundingClientRect(), !N.current)
      return;
    const G = H.target === C.current;
    if (!G && !!H.target.closest(".nokey") || !e || !(i && G || t) || H.button !== 0 || !H.isPrimary)
      return;
    H.target?.setPointerCapture?.(H.pointerId), P.current = !1;
    const { x: Q, y: ee } = fe(H.nativeEvent, N.current), re = tt({ x: Q, y: ee }, U);
    y.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: re.x,
        startY: re.y,
        x: Q,
        y: ee
      }
    }), G || (H.stopPropagation(), H.preventDefault());
  };
  function V(H, R) {
    const { userSelectionRect: U } = y.getState();
    if (!U)
      return;
    const { transform: G, nodeLookup: O, edgeLookup: Y, connectionLookup: Q, triggerNodeChanges: ee, triggerEdgeChanges: re, defaultEdgeOptions: le } = y.getState(), be = { x: U.startX, y: U.startY }, { x: me, y: ye } = Fe(be, G), Ee = {
      startX: be.x,
      startY: be.y,
      x: H < me ? H : me,
      y: R < ye ? R : ye,
      width: Math.abs(H - me),
      height: Math.abs(R - ye)
    }, We = z.current, Ae = A.current;
    z.current = new Set(Tt(O, Ee, G, n === Ke.Partial, !0).map((de) => de.id)), A.current = /* @__PURE__ */ new Set();
    const ke = le?.selectable ?? !0;
    for (const de of z.current) {
      const Se = Q.get(de);
      if (Se)
        for (const { edgeId: ve } of Se.values()) {
          const He = Y.get(ve);
          He && (He.selectable ?? ke) && A.current.add(ve);
        }
    }
    if (!sn(We, z.current)) {
      const de = Ve(O, z.current, !0);
      ee(de);
    }
    if (!sn(Ae, A.current)) {
      const de = Ve(Y, A.current);
      re(de);
    }
    y.setState({
      userSelectionRect: Ee,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }
  function B() {
    if (!r || !N.current)
      return;
    const [H, R] = Bt(k.current, N.current, E);
    S({ x: H, y: R }).then((U) => {
      if (!P.current || !U) {
        m.current = requestAnimationFrame(B);
        return;
      }
      const { x: G, y: O } = k.current;
      V(G, O), m.current = requestAnimationFrame(B);
    });
  }
  const W = () => {
    cancelAnimationFrame(m.current), m.current = 0, M.current = !1;
  };
  ne(() => () => W(), []);
  const X = (H) => {
    const { userSelectionRect: R, transform: U, resetSelectedElements: G } = y.getState();
    if (!N.current || !R)
      return;
    const { x: O, y: Y } = fe(H.nativeEvent, N.current);
    k.current = { x: O, y: Y };
    const Q = Fe({ x: R.startX, y: R.startY }, U);
    if (!P.current) {
      const ee = t ? 0 : s;
      if (Math.hypot(O - Q.x, Y - Q.y) <= ee)
        return;
      G(), a?.(H);
    }
    P.current = !0, M.current || (B(), M.current = !0), V(O, Y);
  }, K = (H) => {
    if (!v) {
      H.target === C.current && y.getState().connection.inProgress && ($.current = !0);
      return;
    }
    H.button === 0 && (H.target?.releasePointerCapture?.(H.pointerId), !w && H.target === C.current && y.getState().userSelectionRect && T?.(H), y.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), P.current && (g?.(H), y.setState({
      nodesSelectionActive: z.current.size > 0
    })), W());
  }, te = (H) => {
    H.target?.releasePointerCapture?.(H.pointerId), W();
  }, q = o === !0 || Array.isArray(o) && o.includes(0);
  return ce("div", { className: ae(["react-flow__pane", { draggable: q, dragging: b, selection: e }]), onClick: v ? void 0 : Pt(T, C), onContextMenu: Pt(D, C), onWheel: Pt(L, C), onPointerEnter: v ? void 0 : f, onPointerMove: v ? X : p, onPointerUp: K, onPointerCancel: v ? te : void 0, onPointerDownCapture: v ? Z : void 0, onClickCapture: v ? _ : void 0, onPointerLeave: d, ref: C, style: xt, children: [x, I(Wi, {})] });
}
function Lt({ id: e, store: t, unselect: n = !1, nodeRef: o }) {
  const { addSelectedNodes: r, unselectNodesAndEdges: s, multiSelectionActive: i, nodeLookup: a, onError: g } = t.getState(), u = a.get(e);
  if (!u) {
    g?.("012", pe.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), u.selected ? (n || u.selected && i) && (s({ nodes: [u], edges: [] }), requestAnimationFrame(() => o?.current?.blur())) : r([e]);
}
function Do({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: o, nodeId: r, isSelectable: s, nodeClickDistance: i }) {
  const a = oe(), [g, u] = ge(!1), h = J();
  return ne(() => {
    if (!t)
      return h.current = Ys({
        getStoreItems: () => a.getState(),
        onNodeMouseDown: (c) => {
          Lt({
            id: c,
            store: a,
            nodeRef: e
          });
        },
        onDragStart: () => {
          u(!0);
        },
        onDragStop: () => {
          u(!1);
        }
      }), () => {
        h.current?.destroy(), h.current = void 0;
      };
  }, [t, a, e]), ne(() => {
    t || !e.current || !h.current || h.current.update({
      noDragClassName: n,
      handleSelector: o,
      domNode: e.current,
      isSelectable: s,
      nodeId: r,
      nodeClickDistance: i
    });
  }, [n, o, t, s, e, r, i]), g;
}
const Ki = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function $o() {
  const e = oe();
  return xe((n) => {
    const { nodeExtent: o, snapToGrid: r, snapGrid: s, nodesDraggable: i, onError: a, updateNodePositions: g, nodeLookup: u, nodeOrigin: h } = e.getState(), c = /* @__PURE__ */ new Map(), f = Ki(i), p = r ? s[0] : 5, d = r ? s[1] : 5, x = n.direction.x * p * n.factor, m = n.direction.y * d * n.factor;
    for (const [, y] of u) {
      if (!f(y))
        continue;
      let w = {
        x: y.internals.positionAbsolute.x + x,
        y: y.internals.positionAbsolute.y + m
      };
      r && (w = et(w, s));
      const { position: l, positionAbsolute: b } = jn({
        nodeId: y.id,
        nextPosition: w,
        nodeLookup: u,
        nodeExtent: o,
        nodeOrigin: h,
        onError: a
      });
      y.position = l, y.internals.positionAbsolute = b, c.set(y.id, y);
    }
    g(c);
  }, []);
}
const Gt = ut(null), qi = Gt.Provider;
Gt.Consumer;
const _o = () => Ye(Gt), Ui = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), Lo = ut(null);
function Qi({ children: e }) {
  const t = j(Ui, se);
  return I(Lo.Provider, { value: t, children: e });
}
function ji() {
  const e = Ye(Lo);
  if (!e)
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  return e;
}
const Ji = {
  connectingFrom: !1,
  connectingTo: !1,
  clickConnecting: !1,
  isPossibleEndHandle: !0,
  connectionInProcess: !1,
  clickConnectionInProcess: !1,
  valid: !1
}, ea = (e, t, n) => (o) => {
  const { connectionClickStartHandle: r, connectionMode: s, connection: i } = o, { fromHandle: a, toHandle: g, isValid: u } = i;
  if (!a && !r)
    return Ji;
  const h = g?.nodeId === e && g?.id === t && g?.type === n;
  return {
    connectingFrom: a?.nodeId === e && a?.id === t && a?.type === n,
    connectingTo: h,
    clickConnecting: r?.nodeId === e && r?.id === t && r?.type === n,
    isPossibleEndHandle: s === Re.Strict ? a?.type !== n : e !== a?.nodeId || t !== a?.id,
    connectionInProcess: !!a,
    clickConnectionInProcess: !!r,
    valid: h && u
  };
};
function ta({ type: e = "source", position: t = F.Top, isValidConnection: n, isConnectable: o = !0, isConnectableStart: r = !0, isConnectableEnd: s = !0, id: i, onConnect: a, children: g, className: u, onMouseDown: h, onTouchStart: c, ...f }, p) {
  const d = i || null, x = e === "target", m = oe(), y = _o(), { connectOnClick: w, noPanClassName: l, rfId: b } = ji(), { connectingFrom: S, connectingTo: E, clickConnecting: v, isPossibleEndHandle: C, connectionInProcess: N, clickConnectionInProcess: z, valid: A } = j(ea(y, d, e), se);
  y || m.getState().onError?.("010", pe.error010());
  const $ = (M) => {
    const { defaultEdgeOptions: T, onConnect: D, hasDefaultEdges: L } = m.getState(), _ = {
      ...T,
      ...M
    };
    if (L) {
      const { edges: Z, setEdges: V, onError: B } = m.getState();
      V($i(_, Z, { onError: B }));
    }
    D?.(_), a?.(_);
  }, P = (M) => {
    if (!y)
      return;
    const T = ao(M.nativeEvent);
    if (r && (T && M.button === 0 || !T)) {
      const D = m.getState();
      _t.onPointerDown(M.nativeEvent, {
        handleDomNode: M.currentTarget,
        autoPanOnConnect: D.autoPanOnConnect,
        connectionMode: D.connectionMode,
        connectionRadius: D.connectionRadius,
        domNode: D.domNode,
        nodeLookup: D.nodeLookup,
        lib: D.lib,
        isTarget: x,
        handleId: d,
        nodeId: y,
        flowId: D.rfId,
        panBy: D.panBy,
        cancelConnection: D.cancelConnection,
        onConnectStart: D.onConnectStart,
        onConnectEnd: (...L) => m.getState().onConnectEnd?.(...L),
        updateConnection: D.updateConnection,
        onConnect: $,
        isValidConnection: n || ((...L) => m.getState().isValidConnection?.(...L) ?? !0),
        getTransform: () => m.getState().transform,
        getFromHandle: () => m.getState().connection.fromHandle,
        autoPanSpeed: D.autoPanSpeed,
        dragThreshold: D.connectionDragThreshold
      });
    }
    T ? h?.(M) : c?.(M);
  }, k = (M) => {
    const { onClickConnectStart: T, onClickConnectEnd: D, connectionClickStartHandle: L, connectionMode: _, isValidConnection: Z, lib: V, rfId: B, nodeLookup: W, connection: X } = m.getState();
    if (!y || !L && !r)
      return;
    if (!L) {
      T?.(M.nativeEvent, { nodeId: y, handleId: d, handleType: e }), m.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: d } });
      return;
    }
    const K = so(M.target), te = n || Z, { connection: q, isValid: H } = _t.isValid(M.nativeEvent, {
      handle: {
        nodeId: y,
        id: d,
        type: e
      },
      connectionMode: _,
      fromNodeId: L.nodeId,
      fromHandleId: L.id || null,
      fromType: L.type,
      isValidConnection: te,
      flowId: B,
      doc: K,
      lib: V,
      nodeLookup: W
    });
    H && q && $(q);
    const R = structuredClone(X);
    delete R.inProgress, R.toPosition = R.toHandle ? R.toHandle.position : null, D?.(M, R), m.setState({ connectionClickStartHandle: null });
  };
  return I("div", { "data-handleid": d, "data-nodeid": y, "data-handlepos": t, "data-id": `${b}-${y}-${d}-${e}`, className: ae([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    l,
    u,
    {
      source: !x,
      target: x,
      connectable: o,
      connectablestart: r,
      connectableend: s,
      clickconnecting: v,
      connectingfrom: S,
      connectingto: E,
      valid: A,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: o && (!N || C) && (N || z ? s : r)
    }
  ]), onMouseDown: P, onTouchStart: P, onClick: w ? k : void 0, ref: p, ...f, children: g });
}
const lt = ie(Ao(ta));
function na({ data: e, isConnectable: t, sourcePosition: n = F.Bottom }) {
  return ce(Ne, { children: [e?.label, I(lt, { type: "source", position: n, isConnectable: t })] });
}
function oa({ data: e, isConnectable: t, targetPosition: n = F.Top, sourcePosition: o = F.Bottom }) {
  return ce(Ne, { children: [I(lt, { type: "target", position: n, isConnectable: t }), e?.label, I(lt, { type: "source", position: o, isConnectable: t })] });
}
function ra() {
  return null;
}
function sa({ data: e, isConnectable: t, targetPosition: n = F.Top }) {
  return ce(Ne, { children: [I(lt, { type: "target", position: n, isConnectable: t }), e?.label] });
}
const dt = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, Hn = {
  input: na,
  default: oa,
  output: sa,
  group: ra
};
function ia(e) {
  return e.internals.handleBounds === void 0 ? {
    width: e.width ?? e.initialWidth ?? e.style?.width,
    height: e.height ?? e.initialHeight ?? e.style?.height
  } : {
    width: e.width ?? e.style?.width,
    height: e.height ?? e.style?.height
  };
}
const aa = (e) => {
  const { width: t, height: n, x: o, y: r } = Je(e.nodeLookup, {
    filter: (s) => !!s.selected
  });
  return {
    width: ue(t) ? t : null,
    height: ue(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${o}px,${r}px)`
  };
};
function ca({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const o = oe(), { width: r, height: s, transformString: i, userSelectionActive: a } = j(aa, se), g = $o(), u = J(null);
  ne(() => {
    n || u.current?.focus({
      preventScroll: !0
    });
  }, [n]);
  const h = !a && r !== null && s !== null;
  if (Do({
    nodeRef: u,
    disabled: !h
  }), !h)
    return null;
  const c = e ? (p) => {
    const d = o.getState().nodes.filter((x) => x.selected);
    e(p, d);
  } : void 0, f = (p) => {
    Object.prototype.hasOwnProperty.call(dt, p.key) && (p.preventDefault(), g({
      direction: dt[p.key],
      factor: p.shiftKey ? 4 : 1
    }));
  };
  return I("div", { className: ae(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: i
  }, children: I("div", { ref: u, className: "react-flow__nodesselection-rect", onContextMenu: c, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : f, style: {
    width: r,
    height: s
  } }) });
}
const Dn = typeof window < "u" ? window : void 0, la = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function zo({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: s, onPaneScroll: i, paneClickDistance: a, deleteKeyCode: g, selectionKeyCode: u, selectionOnDrag: h, selectionMode: c, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: d, panActivationKeyCode: x, zoomActivationKeyCode: m, elementsSelectable: y, zoomOnScroll: w, zoomOnPinch: l, panOnScroll: b, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: v, panOnDrag: C, autoPanOnSelection: N, defaultViewport: z, translateExtent: A, minZoom: $, maxZoom: P, preventScrolling: k, onSelectionContextMenu: M, noWheelClassName: T, noPanClassName: D, disableKeyboardA11y: L, onViewportChange: _, isControlledViewport: Z }) {
  const { nodesSelectionActive: V, userSelectionActive: B } = j(la, se), W = Qe(u, { target: Dn }), X = Qe(x, { target: Dn }), K = X || C, te = X || b, q = h && K !== !0, H = W || B || q;
  return Ri({ deleteKeyCode: g, multiSelectionKeyCode: d }), I(Zi, { onPaneContextMenu: s, elementsSelectable: y, zoomOnScroll: w, zoomOnPinch: l, panOnScroll: te, panOnScrollSpeed: S, panOnScrollMode: E, zoomOnDoubleClick: v, panOnDrag: !W && K, defaultViewport: z, translateExtent: A, minZoom: $, maxZoom: P, zoomActivationKeyCode: m, preventScrolling: k, noWheelClassName: T, noPanClassName: D, onViewportChange: _, isControlledViewport: Z, paneClickDistance: a, selectionOnDrag: q, children: ce(Gi, { onSelectionStart: f, onSelectionEnd: p, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: o, onPaneMouseLeave: r, onPaneContextMenu: s, onPaneScroll: i, panOnDrag: K, autoPanOnSelection: N, isSelecting: !!H, selectionMode: c, selectionKeyPressed: W, paneClickDistance: a, selectionOnDrag: q, children: [e, V && I(ca, { onSelectionContextMenu: M, noPanClassName: D, disableKeyboardA11y: L })] }) });
}
zo.displayName = "FlowRenderer";
const da = ie(zo), ua = (e) => (t) => e ? Tt(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function fa(e) {
  return j(xe(ua(e), [e]), se);
}
const ga = (e) => e.updateNodeInternals;
function ha() {
  const e = j(ga), [t] = ge(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const o = /* @__PURE__ */ new Map();
    n.forEach((r) => {
      const s = r.target.getAttribute("data-id");
      o.set(s, {
        id: s,
        nodeElement: r.target,
        force: !0
      });
    }), e(o);
  }));
  return ne(() => () => {
    t?.disconnect();
  }, [t]), t;
}
function pa({ node: e, nodeType: t, hasDimensions: n, resizeObserver: o }) {
  const r = oe(), s = J(null), i = J(null), a = J(e.sourcePosition), g = J(e.targetPosition), u = J(t), h = n && !!e.internals.handleBounds;
  return ne(() => {
    s.current && !e.hidden && (!h || i.current !== s.current) && (i.current && o?.unobserve(i.current), o?.observe(s.current), i.current = s.current);
  }, [h, e.hidden]), ne(() => () => {
    i.current && (o?.unobserve(i.current), i.current = null);
  }, []), ne(() => {
    if (s.current) {
      const c = u.current !== t, f = a.current !== e.sourcePosition, p = g.current !== e.targetPosition;
      (c || f || p) && (u.current = t, a.current = e.sourcePosition, g.current = e.targetPosition, r.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: s.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), s;
}
function ma({ id: e, onClick: t, onMouseEnter: n, onMouseMove: o, onMouseLeave: r, onContextMenu: s, onDoubleClick: i, nodesDraggable: a, elementsSelectable: g, nodesConnectable: u, nodesFocusable: h, resizeObserver: c, noDragClassName: f, noPanClassName: p, disableKeyboardA11y: d, rfId: x, nodeTypes: m, nodeClickDistance: y, onError: w }) {
  const { node: l, internals: b, isParent: S } = j((H) => {
    const R = H.nodeLookup.get(e), U = H.parentLookup.has(e);
    return {
      node: R,
      internals: R.internals,
      isParent: U
    };
  }, se);
  let E = l.type || "default", v = m?.[E] || Hn[E];
  v === void 0 && (w?.("003", pe.error003(E)), E = "default", v = m?.default || Hn.default);
  const C = !!(l.draggable || a && typeof l.draggable > "u"), N = !!(l.selectable || g && typeof l.selectable > "u"), z = !!(l.connectable || u && typeof l.connectable > "u"), A = !!(l.focusable || h && typeof l.focusable > "u"), $ = oe(), P = oo(l), k = pa({ node: l, nodeType: E, hasDimensions: P, resizeObserver: c }), M = Do({
    nodeRef: k,
    disabled: l.hidden || !C,
    noDragClassName: f,
    handleSelector: l.dragHandle,
    nodeId: e,
    isSelectable: N,
    nodeClickDistance: y
  }), T = $o();
  if (l.hidden)
    return null;
  const D = we(l), L = ia(l), _ = N || C || t || n || o || r, Z = n ? (H) => n(H, { ...b.userNode }) : void 0, V = o ? (H) => o(H, { ...b.userNode }) : void 0, B = r ? (H) => r(H, { ...b.userNode }) : void 0, W = s ? (H) => s(H, { ...b.userNode }) : void 0, X = i ? (H) => i(H, { ...b.userNode }) : void 0, K = (H) => {
    const { selectNodesOnDrag: R, nodeDragThreshold: U } = $.getState();
    N && (!R || !C || U > 0) && Lt({
      id: e,
      store: $,
      nodeRef: k
    }), t && t(H, { ...b.userNode });
  }, te = (H) => {
    if (!(io(H.nativeEvent) || d)) {
      if (Gn.includes(H.key) && N) {
        const R = H.key === "Escape";
        Lt({
          id: e,
          store: $,
          unselect: R,
          nodeRef: k
        });
      } else if (C && l.selected && Object.prototype.hasOwnProperty.call(dt, H.key)) {
        H.preventDefault();
        const { ariaLabelConfig: R } = $.getState();
        $.setState({
          ariaLiveMessage: R["node.a11yDescription.ariaLiveMessage"]({
            direction: H.key.replace("Arrow", "").toLowerCase(),
            x: ~~b.positionAbsolute.x,
            y: ~~b.positionAbsolute.y
          })
        }), T({
          direction: dt[H.key],
          factor: H.shiftKey ? 4 : 1
        });
      }
    }
  }, q = () => {
    if (d || !k.current?.matches(":focus-visible"))
      return;
    const { transform: H, width: R, height: U, autoPanOnNodeFocus: G, setCenter: O } = $.getState();
    if (!G)
      return;
    Tt(/* @__PURE__ */ new Map([[e, l]]), { x: 0, y: 0, width: R, height: U }, H, !0).length > 0 || O(l.position.x + D.width / 2, l.position.y + D.height / 2, {
      zoom: H[2]
    });
  };
  return I("div", { className: ae([
    "react-flow__node",
    `react-flow__node-${E}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [p]: C
    },
    l.className,
    {
      selected: l.selected,
      selectable: N,
      parent: S,
      draggable: C,
      dragging: M
    }
  ]), ref: k, style: {
    zIndex: b.z,
    transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
    pointerEvents: _ ? "all" : "none",
    visibility: P ? "visible" : "hidden",
    ...l.style,
    ...L
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: Z, onMouseMove: V, onMouseLeave: B, onContextMenu: W, onClick: K, onDoubleClick: X, onKeyDown: A ? te : void 0, tabIndex: A ? 0 : void 0, onFocus: A ? q : void 0, role: l.ariaRole ?? (A ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": d ? void 0 : `${Co}-${x}`, "aria-label": l.ariaLabel, ...l.domAttributes, children: I(qi, { value: e, children: I(v, { id: e, data: l.data, type: E, positionAbsoluteX: b.positionAbsolute.x, positionAbsoluteY: b.positionAbsolute.y, selected: l.selected ?? !1, selectable: N, draggable: C, deletable: l.deletable ?? !0, isConnectable: z, sourcePosition: l.sourcePosition, targetPosition: l.targetPosition, dragging: M, dragHandle: l.dragHandle, zIndex: b.z, parentId: l.parentId, ...D }) }) });
}
var ya = ie(ma);
const xa = (e) => ({
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function To(e) {
  const { nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, onError: r } = j(xa, se), s = fa(e.onlyRenderVisibleElements), i = ha();
  return I("div", { className: "react-flow__nodes", style: xt, children: s.map((a) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    I(ya, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: i, nodesDraggable: e.nodesDraggable ?? !0, nodesConnectable: t, nodesFocusable: n, elementsSelectable: o, nodeClickDistance: e.nodeClickDistance, onError: r }, a)
  )) });
}
To.displayName = "NodeRenderer";
const wa = ie(To);
function ba(e) {
  return j(xe((n) => {
    if (!e)
      return n.edges.map((r) => r.id);
    const o = [];
    if (n.width && n.height)
      for (const r of n.edges) {
        const s = n.nodeLookup.get(r.source), i = n.nodeLookup.get(r.target);
        s && i && Cs({
          sourceNode: s,
          targetNode: i,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && o.push(r.id);
      }
    return o;
  }, [e]), se);
}
const Ea = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return I("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, Sa = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return I("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, $n = {
  [it.Arrow]: Ea,
  [it.ArrowClosed]: Sa
};
function va(e) {
  const t = oe();
  return he(() => Object.prototype.hasOwnProperty.call($n, e) ? $n[e] : (t.getState().onError?.("009", pe.error009(e)), null), [e]);
}
const Na = ({ id: e, type: t, color: n, width: o = 12.5, height: r = 12.5, markerUnits: s = "strokeWidth", strokeWidth: i, orient: a = "auto-start-reverse" }) => {
  const g = va(t);
  return g ? I("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${o}`, markerHeight: `${r}`, viewBox: "-10 -10 20 20", markerUnits: s, orient: a, refX: "0", refY: "0", children: I(g, { color: n, strokeWidth: i }) }) : null;
}, Bo = ({ defaultColor: e, rfId: t }) => {
  const n = j((s) => s.edges), o = j((s) => s.defaultEdgeOptions), r = he(() => $s(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: o?.markerStart,
    defaultMarkerEnd: o?.markerEnd
  }), [n, o, t, e]);
  return r.length ? I("svg", { className: "react-flow__marker", "aria-hidden": "true", children: I("defs", { children: r.map((s) => I(Na, { id: s.id, type: s.type, color: s.color, width: s.width, height: s.height, markerUnits: s.markerUnits, strokeWidth: s.strokeWidth, orient: s.orient }, s.id)) }) }) : null;
};
Bo.displayName = "MarkerDefinitions";
var Ca = ie(Bo);
function Vo({ x: e, y: t, label: n, labelStyle: o, labelShowBg: r = !0, labelBgStyle: s, labelBgPadding: i = [2, 4], labelBgBorderRadius: a = 2, children: g, className: u, ...h }) {
  const [c, f] = ge({ x: 1, y: 0, width: 0, height: 0 }), p = ae(["react-flow__edge-textwrapper", u]), d = J(null);
  return ne(() => {
    if (d.current) {
      const x = d.current.getBBox();
      f({
        x: x.x,
        y: x.y,
        width: x.width,
        height: x.height
      });
    }
  }, [n]), n ? ce("g", { transform: `translate(${e - c.width / 2} ${t - c.height / 2})`, className: p, visibility: c.width ? "visible" : "hidden", ...h, children: [r && I("rect", { width: c.width + 2 * i[0], x: -i[0], y: -i[1], height: c.height + 2 * i[1], className: "react-flow__edge-textbg", style: s, rx: a, ry: a }), I("text", { className: "react-flow__edge-text", y: c.height / 2, dy: "0.3em", ref: d, style: o, children: n }), g] }) : null;
}
Vo.displayName = "EdgeText";
const Ma = ie(Vo);
function wt({ path: e, labelX: t, labelY: n, label: o, labelStyle: r, labelShowBg: s, labelBgStyle: i, labelBgPadding: a, labelBgBorderRadius: g, interactionWidth: u = 20, ...h }) {
  return ce(Ne, { children: [I("path", { ...h, d: e, fill: "none", className: ae(["react-flow__edge-path", h.className]) }), u ? I("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: u, className: "react-flow__edge-interaction" }) : null, o && ue(t) && ue(n) ? I(Ma, { x: t, y: n, label: o, labelStyle: r, labelShowBg: s, labelBgStyle: i, labelBgPadding: a, labelBgBorderRadius: g }) : null] });
}
function _n({ pos: e, x1: t, y1: n, x2: o, y2: r }) {
  return e === F.Left || e === F.Right ? [0.5 * (t + o), n] : [t, 0.5 * (n + r)];
}
function Ro({ sourceX: e, sourceY: t, sourcePosition: n = F.Bottom, targetX: o, targetY: r, targetPosition: s = F.Top }) {
  const [i, a] = _n({
    pos: n,
    x1: e,
    y1: t,
    x2: o,
    y2: r
  }), [g, u] = _n({
    pos: s,
    x1: o,
    y1: r,
    x2: e,
    y2: t
  }), [h, c, f, p] = co({
    sourceX: e,
    sourceY: t,
    targetX: o,
    targetY: r,
    sourceControlX: i,
    sourceControlY: a,
    targetControlX: g,
    targetControlY: u
  });
  return [
    `M${e},${t} C${i},${a} ${g},${u} ${o},${r}`,
    h,
    c,
    f,
    p
  ];
}
function Oo(e) {
  return ie(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, sourcePosition: i, targetPosition: a, label: g, labelStyle: u, labelShowBg: h, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: p, style: d, markerEnd: x, markerStart: m, interactionWidth: y }) => {
    const [w, l, b] = Ro({
      sourceX: n,
      sourceY: o,
      sourcePosition: i,
      targetX: r,
      targetY: s,
      targetPosition: a
    }), S = e.isInternal ? void 0 : t;
    return I(wt, { id: S, path: w, labelX: l, labelY: b, label: g, labelStyle: u, labelShowBg: h, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: p, style: d, markerEnd: x, markerStart: m, interactionWidth: y });
  });
}
const Ia = Oo({ isInternal: !1 }), Fo = Oo({ isInternal: !0 });
Ia.displayName = "SimpleBezierEdge";
Fo.displayName = "SimpleBezierEdgeInternal";
function Zo(e) {
  return ie(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, label: i, labelStyle: a, labelShowBg: g, labelBgStyle: u, labelBgPadding: h, labelBgBorderRadius: c, style: f, sourcePosition: p = F.Bottom, targetPosition: d = F.Top, markerEnd: x, markerStart: m, pathOptions: y, interactionWidth: w }) => {
    const [l, b, S] = Ht({
      sourceX: n,
      sourceY: o,
      sourcePosition: p,
      targetX: r,
      targetY: s,
      targetPosition: d,
      borderRadius: y?.borderRadius,
      offset: y?.offset,
      stepPosition: y?.stepPosition
    }), E = e.isInternal ? void 0 : t;
    return I(wt, { id: E, path: l, labelX: b, labelY: S, label: i, labelStyle: a, labelShowBg: g, labelBgStyle: u, labelBgPadding: h, labelBgBorderRadius: c, style: f, markerEnd: x, markerStart: m, interactionWidth: w });
  });
}
const Yo = Zo({ isInternal: !1 }), Wo = Zo({ isInternal: !0 });
Yo.displayName = "SmoothStepEdge";
Wo.displayName = "SmoothStepEdgeInternal";
function Xo(e) {
  return ie(({ id: t, ...n }) => {
    const o = e.isInternal ? void 0 : t;
    return I(Yo, { ...n, id: o, pathOptions: he(() => ({ borderRadius: 0, offset: n.pathOptions?.offset }), [n.pathOptions?.offset]) });
  });
}
const Pa = Xo({ isInternal: !1 }), Go = Xo({ isInternal: !0 });
Pa.displayName = "StepEdge";
Go.displayName = "StepEdgeInternal";
function Ko(e) {
  return ie(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, label: i, labelStyle: a, labelShowBg: g, labelBgStyle: u, labelBgPadding: h, labelBgBorderRadius: c, style: f, markerEnd: p, markerStart: d, interactionWidth: x }) => {
    const [m, y, w] = fo({ sourceX: n, sourceY: o, targetX: r, targetY: s }), l = e.isInternal ? void 0 : t;
    return I(wt, { id: l, path: m, labelX: y, labelY: w, label: i, labelStyle: a, labelShowBg: g, labelBgStyle: u, labelBgPadding: h, labelBgBorderRadius: c, style: f, markerEnd: p, markerStart: d, interactionWidth: x });
  });
}
const Aa = Ko({ isInternal: !1 }), qo = Ko({ isInternal: !0 });
Aa.displayName = "StraightEdge";
qo.displayName = "StraightEdgeInternal";
function Uo(e) {
  return ie(({ id: t, sourceX: n, sourceY: o, targetX: r, targetY: s, sourcePosition: i = F.Bottom, targetPosition: a = F.Top, label: g, labelStyle: u, labelShowBg: h, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: p, style: d, markerEnd: x, markerStart: m, pathOptions: y, interactionWidth: w }) => {
    const [l, b, S] = lo({
      sourceX: n,
      sourceY: o,
      sourcePosition: i,
      targetX: r,
      targetY: s,
      targetPosition: a,
      curvature: y?.curvature
    }), E = e.isInternal ? void 0 : t;
    return I(wt, { id: E, path: l, labelX: b, labelY: S, label: g, labelStyle: u, labelShowBg: h, labelBgStyle: c, labelBgPadding: f, labelBgBorderRadius: p, style: d, markerEnd: x, markerStart: m, interactionWidth: w });
  });
}
const ka = Uo({ isInternal: !1 }), Qo = Uo({ isInternal: !0 });
ka.displayName = "BezierEdge";
Qo.displayName = "BezierEdgeInternal";
const Ln = {
  default: Qo,
  straight: qo,
  step: Go,
  smoothstep: Wo,
  simplebezier: Fo
}, zn = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
}, Ha = (e, t, n) => n === F.Left ? e - t : n === F.Right ? e + t : e, Da = (e, t, n) => n === F.Top ? e - t : n === F.Bottom ? e + t : e, Tn = "react-flow__edgeupdater";
function Bn({ position: e, centerX: t, centerY: n, radius: o = 10, onMouseDown: r, onMouseEnter: s, onMouseOut: i, type: a }) {
  return I("circle", { onMouseDown: r, onMouseEnter: s, onMouseOut: i, className: ae([Tn, `${Tn}-${a}`]), cx: Ha(t, o, e), cy: Da(n, o, e), r: o, stroke: "transparent", fill: "transparent" });
}
function $a({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: o, sourceY: r, targetX: s, targetY: i, sourcePosition: a, targetPosition: g, onReconnect: u, onReconnectStart: h, onReconnectEnd: c, setReconnecting: f, setUpdateHover: p }) {
  const d = oe(), x = (b, S) => {
    if (b.button !== 0)
      return;
    const { autoPanOnConnect: E, domNode: v, connectionMode: C, connectionRadius: N, lib: z, onConnectStart: A, cancelConnection: $, nodeLookup: P, rfId: k, panBy: M, updateConnection: T } = d.getState(), D = S.type === "target", L = (V, B) => {
      f(!1), c?.(V, n, S.type, B);
    }, _ = (V) => u?.(n, V), Z = (V, B) => {
      f(!0), h?.(b, n, S.type), A?.(V, B);
    };
    _t.onPointerDown(b.nativeEvent, {
      autoPanOnConnect: E,
      connectionMode: C,
      connectionRadius: N,
      domNode: v,
      handleId: S.id,
      nodeId: S.nodeId,
      nodeLookup: P,
      isTarget: D,
      edgeUpdaterType: S.type,
      lib: z,
      flowId: k,
      cancelConnection: $,
      panBy: M,
      isValidConnection: (...V) => d.getState().isValidConnection?.(...V) ?? !0,
      onConnect: _,
      onConnectStart: Z,
      onConnectEnd: (...V) => d.getState().onConnectEnd?.(...V),
      onReconnectEnd: L,
      updateConnection: T,
      getTransform: () => d.getState().transform,
      getFromHandle: () => d.getState().connection.fromHandle,
      dragThreshold: d.getState().connectionDragThreshold,
      handleDomNode: b.currentTarget
    });
  }, m = (b) => x(b, { nodeId: n.target, id: n.targetHandle ?? null, type: "target" }), y = (b) => x(b, { nodeId: n.source, id: n.sourceHandle ?? null, type: "source" }), w = () => p(!0), l = () => p(!1);
  return ce(Ne, { children: [(e === !0 || e === "source") && I(Bn, { position: a, centerX: o, centerY: r, radius: t, onMouseDown: m, onMouseEnter: w, onMouseOut: l, type: "source" }), (e === !0 || e === "target") && I(Bn, { position: g, centerX: s, centerY: i, radius: t, onMouseDown: y, onMouseEnter: w, onMouseOut: l, type: "target" })] });
}
function _a({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: o, onClick: r, onDoubleClick: s, onContextMenu: i, onMouseEnter: a, onMouseMove: g, onMouseLeave: u, reconnectRadius: h, onReconnect: c, onReconnectStart: f, onReconnectEnd: p, rfId: d, edgeTypes: x, noPanClassName: m, onError: y, disableKeyboardA11y: w }) {
  let l = j((O) => O.edgeLookup.get(e));
  const b = j((O) => O.defaultEdgeOptions);
  l = b ? { ...b, ...l } : l;
  let S = l.type || "default", E = x?.[S] || Ln[S];
  E === void 0 && (y?.("011", pe.error011(S)), S = "default", E = x?.default || Ln.default);
  const v = !!(l.focusable || t && typeof l.focusable > "u"), C = typeof c < "u" && (l.reconnectable || n && typeof l.reconnectable > "u"), N = !!(l.selectable || o && typeof l.selectable > "u"), z = J(null), [A, $] = ge(!1), [P, k] = ge(!1), M = oe(), { zIndex: T = l.zIndex, sourceX: D, sourceY: L, targetX: _, targetY: Z, sourcePosition: V, targetPosition: B } = j(xe((O) => {
    const Y = O.nodeLookup.get(l.source), Q = O.nodeLookup.get(l.target);
    if (!Y || !Q)
      return zn;
    const ee = Ds({
      id: e,
      sourceNode: Y,
      targetNode: Q,
      sourceHandle: l.sourceHandle || null,
      targetHandle: l.targetHandle || null,
      connectionMode: O.connectionMode,
      onError: y
    }), re = Ns({
      selected: l.selected,
      zIndex: l.zIndex,
      sourceNode: Y,
      targetNode: Q,
      elevateOnSelect: O.elevateEdgesOnSelect,
      zIndexMode: O.zIndexMode
    });
    return {
      ...ee || zn,
      zIndex: re
    };
  }, [l.source, l.target, l.sourceHandle, l.targetHandle, l.selected, l.zIndex]), se), W = he(() => l.markerStart ? `url('#${Dt(l.markerStart, d)}')` : void 0, [l.markerStart, d]), X = he(() => l.markerEnd ? `url('#${Dt(l.markerEnd, d)}')` : void 0, [l.markerEnd, d]);
  if (l.hidden || D === null || L === null || _ === null || Z === null)
    return null;
  const K = (O) => {
    const { addSelectedEdges: Y, unselectNodesAndEdges: Q, multiSelectionActive: ee } = M.getState();
    N && (M.setState({ nodesSelectionActive: !1 }), l.selected && ee ? (Q({ nodes: [], edges: [l] }), z.current?.blur()) : Y([e])), r && r(O, l);
  }, te = s ? (O) => {
    s(O, { ...l });
  } : void 0, q = i ? (O) => {
    i(O, { ...l });
  } : void 0, H = a ? (O) => {
    a(O, { ...l });
  } : void 0, R = g ? (O) => {
    g(O, { ...l });
  } : void 0, U = u ? (O) => {
    u(O, { ...l });
  } : void 0, G = (O) => {
    if (!w && Gn.includes(O.key) && N) {
      const { unselectNodesAndEdges: Y, addSelectedEdges: Q } = M.getState();
      O.key === "Escape" ? (z.current?.blur(), Y({ edges: [l] })) : Q([e]);
    }
  };
  return I("svg", { style: { zIndex: T }, children: ce("g", { className: ae([
    "react-flow__edge",
    `react-flow__edge-${S}`,
    l.className,
    m,
    {
      selected: l.selected,
      animated: l.animated,
      inactive: !N && !r,
      updating: A,
      selectable: N
    }
  ]), onClick: K, onDoubleClick: te, onContextMenu: q, onMouseEnter: H, onMouseMove: R, onMouseLeave: U, onKeyDown: v ? G : void 0, tabIndex: v ? 0 : void 0, role: l.ariaRole ?? (v ? "group" : "img"), "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": l.ariaLabel === null ? void 0 : l.ariaLabel || `Edge from ${l.source} to ${l.target}`, "aria-describedby": v ? `${Mo}-${d}` : void 0, ref: z, ...l.domAttributes, children: [!P && I(E, { id: e, source: l.source, target: l.target, type: l.type, selected: l.selected, animated: l.animated, selectable: N, deletable: l.deletable ?? !0, label: l.label, labelStyle: l.labelStyle, labelShowBg: l.labelShowBg, labelBgStyle: l.labelBgStyle, labelBgPadding: l.labelBgPadding, labelBgBorderRadius: l.labelBgBorderRadius, sourceX: D, sourceY: L, targetX: _, targetY: Z, sourcePosition: V, targetPosition: B, data: l.data, style: l.style, sourceHandleId: l.sourceHandle, targetHandleId: l.targetHandle, markerStart: W, markerEnd: X, pathOptions: "pathOptions" in l ? l.pathOptions : void 0, interactionWidth: l.interactionWidth }), C && I($a, { edge: l, isReconnectable: C, reconnectRadius: h, onReconnect: c, onReconnectStart: f, onReconnectEnd: p, sourceX: D, sourceY: L, targetX: _, targetY: Z, sourcePosition: V, targetPosition: B, setUpdateHover: $, setReconnecting: k })] }) });
}
var La = ie(_a);
const za = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function jo({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: o, noPanClassName: r, onReconnect: s, onEdgeContextMenu: i, onEdgeMouseEnter: a, onEdgeMouseMove: g, onEdgeMouseLeave: u, onEdgeClick: h, reconnectRadius: c, onEdgeDoubleClick: f, onReconnectStart: p, onReconnectEnd: d, disableKeyboardA11y: x }) {
  const { edgesFocusable: m, edgesReconnectable: y, elementsSelectable: w, onError: l } = j(za, se), b = ba(t);
  return ce("div", { className: "react-flow__edges", children: [I(Ca, { defaultColor: e, rfId: n }), b.map((S) => I(La, { id: S, edgesFocusable: m, edgesReconnectable: y, elementsSelectable: w, noPanClassName: r, onReconnect: s, onContextMenu: i, onMouseEnter: a, onMouseMove: g, onMouseLeave: u, onClick: h, reconnectRadius: c, onDoubleClick: f, onReconnectStart: p, onReconnectEnd: d, rfId: n, onError: l, edgeTypes: o, disableKeyboardA11y: x }, S))] });
}
jo.displayName = "EdgeRenderer";
const Ta = ie(jo), Vn = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function Ba({ children: e }) {
  const t = oe(), n = J(null), [o] = ge(() => t.getState().transform);
  return ko(() => {
    let r = null;
    const s = () => {
      const i = t.getState().transform;
      r && i[0] === r[0] && i[1] === r[1] && i[2] === r[2] || (r = i, n.current && (n.current.style.transform = Vn(i)));
    };
    return s(), t.subscribe(s);
  }, [t]), I("div", { ref: n, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: Vn(o) }, children: e });
}
function Va(e) {
  const t = Xt(), n = J(!1);
  ne(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const Ra = (e) => e.panZoom?.syncViewport;
function Oa(e) {
  const t = j(Ra), n = oe();
  return ne(() => {
    e && (t?.(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function Fa(e) {
  return e.connection.inProgress ? { ...e.connection, to: tt(e.connection.to, e.transform) } : { ...e.connection };
}
function Za(e) {
  return Fa;
}
function Ya(e) {
  const t = Za();
  return j(t, se);
}
const Wa = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function Xa({ containerStyle: e, style: t, type: n, component: o }) {
  const { nodesConnectable: r, width: s, height: i, isValid: a, inProgress: g } = j(Wa, se);
  return !(s && r && g) ? null : I("svg", { style: e, width: s, height: i, className: "react-flow__connectionline react-flow__container", children: I("g", { className: ae(["react-flow__connection", Un(a)]), children: I(Jo, { style: t, type: n, CustomComponent: o, isValid: a }) }) });
}
const Jo = ({ style: e, type: t = Ie.Bezier, CustomComponent: n, isValid: o }) => {
  const { inProgress: r, from: s, fromNode: i, fromHandle: a, fromPosition: g, to: u, toNode: h, toHandle: c, toPosition: f, pointer: p } = Ya();
  if (!r)
    return;
  if (n)
    return I(n, { connectionLineType: t, connectionLineStyle: e, fromNode: i, fromHandle: a, fromX: s.x, fromY: s.y, toX: u.x, toY: u.y, fromPosition: g, toPosition: f, connectionStatus: Un(o), toNode: h, toHandle: c, pointer: p });
  let d = "";
  const x = {
    sourceX: s.x,
    sourceY: s.y,
    sourcePosition: g,
    targetX: u.x,
    targetY: u.y,
    targetPosition: f
  };
  switch (t) {
    case Ie.Bezier:
      [d] = lo(x);
      break;
    case Ie.SimpleBezier:
      [d] = Ro(x);
      break;
    case Ie.Step:
      [d] = Ht({
        ...x,
        borderRadius: 0
      });
      break;
    case Ie.SmoothStep:
      [d] = Ht(x);
      break;
    default:
      [d] = fo(x);
  }
  return I("path", { d, fill: "none", className: "react-flow__connection-path", style: e });
};
Jo.displayName = "ConnectionLine";
const Ga = {};
function Rn(e = Ga) {
  J(e), oe(), ne(() => {
  }, [e]);
}
function Ka() {
  oe(), J(!1), ne(() => {
  }, []);
}
function er({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: o, onEdgeClick: r, onNodeDoubleClick: s, onEdgeDoubleClick: i, onNodeMouseEnter: a, onNodeMouseMove: g, onNodeMouseLeave: u, onNodeContextMenu: h, onSelectionContextMenu: c, onSelectionStart: f, onSelectionEnd: p, connectionLineType: d, connectionLineStyle: x, connectionLineComponent: m, connectionLineContainerStyle: y, selectionKeyCode: w, selectionOnDrag: l, selectionMode: b, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: v, deleteKeyCode: C, onlyRenderVisibleElements: N, elementsSelectable: z, defaultViewport: A, translateExtent: $, minZoom: P, maxZoom: k, preventScrolling: M, defaultMarkerColor: T, zoomOnScroll: D, zoomOnPinch: L, panOnScroll: _, panOnScrollSpeed: Z, panOnScrollMode: V, zoomOnDoubleClick: B, panOnDrag: W, autoPanOnSelection: X, onPaneClick: K, onPaneMouseEnter: te, onPaneMouseMove: q, onPaneMouseLeave: H, onPaneScroll: R, onPaneContextMenu: U, paneClickDistance: G, nodeClickDistance: O, onEdgeContextMenu: Y, onEdgeMouseEnter: Q, onEdgeMouseMove: ee, onEdgeMouseLeave: re, reconnectRadius: le, onReconnect: be, onReconnectStart: me, onReconnectEnd: ye, noDragClassName: Ee, noWheelClassName: We, noPanClassName: Ae, disableKeyboardA11y: ke, nodeExtent: de, rfId: Se, viewport: ve, onViewportChange: He, nodesDraggable: bt }) {
  return Rn(e), Rn(t), Ka(), Va(n), Oa(ve), I(da, { onPaneClick: K, onPaneMouseEnter: te, onPaneMouseMove: q, onPaneMouseLeave: H, onPaneContextMenu: U, onPaneScroll: R, paneClickDistance: G, deleteKeyCode: C, selectionKeyCode: w, selectionOnDrag: l, selectionMode: b, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: S, panActivationKeyCode: E, zoomActivationKeyCode: v, elementsSelectable: z, zoomOnScroll: D, zoomOnPinch: L, zoomOnDoubleClick: B, panOnScroll: _, panOnScrollSpeed: Z, panOnScrollMode: V, panOnDrag: W, autoPanOnSelection: X, defaultViewport: A, translateExtent: $, minZoom: P, maxZoom: k, onSelectionContextMenu: c, preventScrolling: M, noDragClassName: Ee, noWheelClassName: We, noPanClassName: Ae, disableKeyboardA11y: ke, onViewportChange: He, isControlledViewport: !!ve, children: ce(Ba, { children: [I(Ta, { edgeTypes: t, onEdgeClick: r, onEdgeDoubleClick: i, onReconnect: be, onReconnectStart: me, onReconnectEnd: ye, onlyRenderVisibleElements: N, onEdgeContextMenu: Y, onEdgeMouseEnter: Q, onEdgeMouseMove: ee, onEdgeMouseLeave: re, reconnectRadius: le, defaultMarkerColor: T, noPanClassName: Ae, disableKeyboardA11y: ke, rfId: Se }), I(Xa, { style: x, type: d, component: m, containerStyle: y }), I("div", { className: "react-flow__edgelabel-renderer" }), I(wa, { nodeTypes: e, onNodeClick: o, onNodeDoubleClick: s, onNodeMouseEnter: a, onNodeMouseMove: g, onNodeMouseLeave: u, onNodeContextMenu: h, nodeClickDistance: O, onlyRenderVisibleElements: N, noPanClassName: Ae, noDragClassName: Ee, disableKeyboardA11y: ke, nodeExtent: de, rfId: Se, nodesDraggable: bt }), I("div", { className: "react-flow__viewport-portal" })] }) });
}
er.displayName = "GraphView";
const qa = ie(er), Ua = no(), On = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: s, fitView: i, fitViewOptions: a, minZoom: g = 0.5, maxZoom: u = 2, nodeOrigin: h, nodeExtent: c, zIndexMode: f = "basic" } = {}) => {
  const p = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = o ?? t ?? [], w = n ?? e ?? [], l = h ?? [0, 0], b = c ?? Ge;
  po(x, m, y);
  const { nodesInitialized: S } = $t(w, p, d, {
    nodeOrigin: l,
    nodeExtent: b,
    zIndexMode: f
  });
  let E = [0, 0, 1];
  if (i && r && s) {
    const v = Je(p, {
      filter: (A) => !!((A.width || A.initialWidth) && (A.height || A.initialHeight))
    }), { x: C, y: N, zoom: z } = Vt(v, r, s, g, u, a?.padding ?? 0.1);
    E = [C, N, z];
  }
  return {
    rfId: "1",
    width: r ?? 0,
    height: s ?? 0,
    transform: E,
    nodes: w,
    nodesInitialized: S,
    nodeLookup: p,
    parentLookup: d,
    edges: y,
    edgeLookup: m,
    connectionLookup: x,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: o !== void 0,
    panZoom: null,
    minZoom: g,
    maxZoom: u,
    translateExtent: Ge,
    nodeExtent: b,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: Re.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: l,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: i ?? !1,
    fitViewOptions: a,
    fitViewResolver: null,
    connection: { ...qn },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Ua,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Kn,
    zIndexMode: f,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map()
  };
}, Qa = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, width: r, height: s, fitView: i, fitViewOptions: a, minZoom: g, maxZoom: u, nodeOrigin: h, nodeExtent: c, zIndexMode: f }) => ds((p, d) => {
  async function x() {
    const { nodeLookup: m, panZoom: y, fitViewOptions: w, fitViewResolver: l, width: b, height: S, minZoom: E, maxZoom: v } = d();
    y && (await ys({
      nodes: m,
      width: b,
      height: S,
      panZoom: y,
      minZoom: E,
      maxZoom: v
    }, w), l?.resolve(!0), p({ fitViewResolver: null }));
  }
  return {
    ...On({
      nodes: e,
      edges: t,
      width: r,
      height: s,
      fitView: i,
      fitViewOptions: a,
      minZoom: g,
      maxZoom: u,
      nodeOrigin: h,
      nodeExtent: c,
      defaultNodes: n,
      defaultEdges: o,
      zIndexMode: f
    }),
    setNodes: (m) => {
      const { nodeLookup: y, parentLookup: w, nodeOrigin: l, elevateNodesOnSelect: b, fitViewQueued: S, zIndexMode: E, nodesSelectionActive: v } = d(), { nodesInitialized: C, hasSelectedNodes: N } = $t(m, y, w, {
        nodeOrigin: l,
        nodeExtent: c,
        elevateNodesOnSelect: b,
        checkEquality: !0,
        zIndexMode: E
      }), z = v && N;
      S && C ? (x(), p({
        nodes: m,
        nodesInitialized: C,
        fitViewQueued: !1,
        fitViewOptions: void 0,
        nodesSelectionActive: z
      })) : p({ nodes: m, nodesInitialized: C, nodesSelectionActive: z });
    },
    setEdges: (m) => {
      const { connectionLookup: y, edgeLookup: w } = d();
      po(y, w, m), p({ edges: m });
    },
    setDefaultNodesAndEdges: (m, y) => {
      if (m) {
        const { setNodes: w } = d();
        w(m), p({ hasDefaultNodes: !0 });
      }
      if (y) {
        const { setEdges: w } = d();
        w(y), p({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (m) => {
      const { triggerNodeChanges: y, nodeLookup: w, parentLookup: l, domNode: b, nodeOrigin: S, nodeExtent: E, debug: v, fitViewQueued: C, zIndexMode: N } = d(), { changes: z, updatedInternals: A } = Rs(m, w, l, b, S, E, N);
      A && (zs(w, l, { nodeOrigin: S, nodeExtent: E, zIndexMode: N }), C ? (x(), p({ fitViewQueued: !1, fitViewOptions: void 0 })) : p({}), z?.length > 0 && (v && console.log("React Flow: trigger node changes", z), y?.(z)));
    },
    updateNodePositions: (m, y = !1) => {
      const w = [];
      let l = [];
      const { nodeLookup: b, triggerNodeChanges: S, connection: E, updateConnection: v, onNodesChangeMiddlewareMap: C } = d();
      for (const [N, z] of m) {
        const A = b.get(N), $ = !!(A?.expandParent && A?.parentId && z?.position), P = {
          id: N,
          type: "position",
          position: $ ? {
            x: Math.max(0, z.position.x),
            y: Math.max(0, z.position.y)
          } : z.position,
          dragging: y
        };
        if (A && E.inProgress && E.fromNode.id === A.id) {
          const k = ze(A, E.fromHandle, F.Left, !0);
          v({ ...E, from: k });
        }
        $ && A.parentId && w.push({
          id: N,
          parentId: A.parentId,
          rect: {
            ...z.internals.positionAbsolute,
            width: z.measured.width ?? 0,
            height: z.measured.height ?? 0
          }
        }), l.push(P);
      }
      if (w.length > 0) {
        const { parentLookup: N, nodeOrigin: z } = d(), A = Wt(w, b, N, z);
        l.push(...A);
      }
      for (const N of C.values())
        l = N(l);
      S(l);
    },
    triggerNodeChanges: (m) => {
      const { onNodesChange: y, setNodes: w, nodes: l, hasDefaultNodes: b, debug: S } = d();
      if (m?.length) {
        if (b) {
          const E = ki(m, l);
          w(E);
        }
        S && console.log("React Flow: trigger node changes", m), y?.(m);
      }
    },
    triggerEdgeChanges: (m) => {
      const { onEdgesChange: y, setEdges: w, edges: l, hasDefaultEdges: b, debug: S } = d();
      if (m?.length) {
        if (b) {
          const E = Hi(m, l);
          w(E);
        }
        S && console.log("React Flow: trigger edge changes", m), y?.(m);
      }
    },
    addSelectedNodes: (m) => {
      const { multiSelectionActive: y, edgeLookup: w, nodeLookup: l, triggerNodeChanges: b, triggerEdgeChanges: S } = d();
      if (y) {
        const E = m.map((v) => De(v, !0));
        b(E);
        return;
      }
      b(Ve(l, /* @__PURE__ */ new Set([...m]), !0)), S(Ve(w));
    },
    addSelectedEdges: (m) => {
      const { multiSelectionActive: y, edgeLookup: w, nodeLookup: l, triggerNodeChanges: b, triggerEdgeChanges: S } = d();
      if (y) {
        const E = m.map((v) => De(v, !0));
        S(E);
        return;
      }
      S(Ve(w, /* @__PURE__ */ new Set([...m]))), b(Ve(l, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: m, edges: y } = {}) => {
      const { edges: w, nodes: l, nodeLookup: b, triggerNodeChanges: S, triggerEdgeChanges: E } = d(), v = m || l, C = y || w, N = [];
      for (const A of v) {
        if (!A.selected)
          continue;
        const $ = b.get(A.id);
        $ && ($.selected = !1), N.push(De(A.id, !1));
      }
      const z = [];
      for (const A of C)
        A.selected && z.push(De(A.id, !1));
      S(N), E(z);
    },
    setMinZoom: (m) => {
      const { panZoom: y, maxZoom: w } = d();
      y?.setScaleExtent([m, w]), p({ minZoom: m });
    },
    setMaxZoom: (m) => {
      const { panZoom: y, minZoom: w } = d();
      y?.setScaleExtent([w, m]), p({ maxZoom: m });
    },
    setTranslateExtent: (m) => {
      d().panZoom?.setTranslateExtent(m), p({ translateExtent: m });
    },
    resetSelectedElements: () => {
      const { edges: m, nodes: y, triggerNodeChanges: w, triggerEdgeChanges: l, elementsSelectable: b } = d();
      if (!b)
        return;
      const S = y.reduce((v, C) => C.selected ? [...v, De(C.id, !1)] : v, []), E = m.reduce((v, C) => C.selected ? [...v, De(C.id, !1)] : v, []);
      w(S), l(E);
    },
    setNodeExtent: (m) => {
      const { nodes: y, nodeLookup: w, parentLookup: l, nodeOrigin: b, elevateNodesOnSelect: S, nodeExtent: E, zIndexMode: v } = d();
      m[0][0] === E[0][0] && m[0][1] === E[0][1] && m[1][0] === E[1][0] && m[1][1] === E[1][1] || ($t(y, w, l, {
        nodeOrigin: b,
        nodeExtent: m,
        elevateNodesOnSelect: S,
        checkEquality: !1,
        zIndexMode: v
      }), p({ nodeExtent: m }));
    },
    panBy: (m) => {
      const { transform: y, width: w, height: l, panZoom: b, translateExtent: S } = d();
      return Os({ delta: m, panZoom: b, transform: y, translateExtent: S, width: w, height: l });
    },
    setCenter: async (m, y, w) => {
      const { width: l, height: b, maxZoom: S, panZoom: E } = d();
      if (!E)
        return !1;
      const v = typeof w?.zoom < "u" ? w.zoom : S;
      return await E.setViewport({
        x: l / 2 - m * v,
        y: b / 2 - y * v,
        zoom: v
      }, { duration: w?.duration, ease: w?.ease, interpolate: w?.interpolate }), !0;
    },
    cancelConnection: () => {
      p({
        connection: { ...qn }
      });
    },
    updateConnection: (m) => {
      p({ connection: m });
    },
    reset: () => p({ ...On() })
  };
}, Object.is);
function ja({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: o, initialWidth: r, initialHeight: s, initialMinZoom: i, initialMaxZoom: a, initialFitViewOptions: g, fitView: u, nodeOrigin: h, nodeExtent: c, zIndexMode: f, children: p }) {
  const [d] = ge(() => Qa({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: o,
    width: r,
    height: s,
    fitView: u,
    minZoom: i,
    maxZoom: a,
    fitViewOptions: g,
    nodeOrigin: h,
    nodeExtent: c,
    zIndexMode: f
  }));
  return I(di, { value: d, children: I(zi, { children: I(Qi, { children: p }) }) });
}
function Ja({ children: e, nodes: t, edges: n, defaultNodes: o, defaultEdges: r, width: s, height: i, fitView: a, fitViewOptions: g, minZoom: u, maxZoom: h, nodeOrigin: c, nodeExtent: f, zIndexMode: p }) {
  return Ye(mt) ? I(Ne, { children: e }) : I(ja, { initialNodes: t, initialEdges: n, defaultNodes: o, defaultEdges: r, initialWidth: s, initialHeight: i, fitView: a, initialFitViewOptions: g, initialMinZoom: u, initialMaxZoom: h, nodeOrigin: c, nodeExtent: f, zIndexMode: p, children: e });
}
const ec = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function tc({ nodes: e, edges: t, defaultNodes: n, defaultEdges: o, className: r, nodeTypes: s, edgeTypes: i, onNodeClick: a, onEdgeClick: g, onInit: u, onMove: h, onMoveStart: c, onMoveEnd: f, onConnect: p, onConnectStart: d, onConnectEnd: x, onClickConnectStart: m, onClickConnectEnd: y, onNodeMouseEnter: w, onNodeMouseMove: l, onNodeMouseLeave: b, onNodeContextMenu: S, onNodeDoubleClick: E, onNodeDragStart: v, onNodeDrag: C, onNodeDragStop: N, onNodesDelete: z, onEdgesDelete: A, onDelete: $, onSelectionChange: P, onSelectionDragStart: k, onSelectionDrag: M, onSelectionDragStop: T, onSelectionContextMenu: D, onSelectionStart: L, onSelectionEnd: _, onBeforeDelete: Z, connectionMode: V, connectionLineType: B = Ie.Bezier, connectionLineStyle: W, connectionLineComponent: X, connectionLineContainerStyle: K, deleteKeyCode: te = "Backspace", selectionKeyCode: q = "Shift", selectionOnDrag: H = !1, selectionMode: R = Ke.Full, panActivationKeyCode: U = "Space", multiSelectionKeyCode: G = Ue() ? "Meta" : "Control", zoomActivationKeyCode: O = Ue() ? "Meta" : "Control", snapToGrid: Y, snapGrid: Q, onlyRenderVisibleElements: ee = !1, selectNodesOnDrag: re, nodesDraggable: le, autoPanOnNodeFocus: be, nodesConnectable: me, nodesFocusable: ye, nodeOrigin: Ee = Io, edgesFocusable: We, edgesReconnectable: Ae, elementsSelectable: ke = !0, defaultViewport: de = vi, minZoom: Se = 0.5, maxZoom: ve = 2, translateExtent: He = Ge, preventScrolling: bt = !0, nodeExtent: Et, defaultMarkerColor: rr = "#b1b1b7", zoomOnScroll: sr = !0, zoomOnPinch: ir = !0, panOnScroll: ar = !1, panOnScrollSpeed: cr = 0.5, panOnScrollMode: lr = $e.Free, zoomOnDoubleClick: dr = !0, panOnDrag: ur = !0, onPaneClick: fr, onPaneMouseEnter: gr, onPaneMouseMove: hr, onPaneMouseLeave: pr, onPaneScroll: mr, onPaneContextMenu: yr, paneClickDistance: xr = 1, nodeClickDistance: wr = 0, children: br, onReconnect: Er, onReconnectStart: Sr, onReconnectEnd: vr, onEdgeContextMenu: Nr, onEdgeDoubleClick: Cr, onEdgeMouseEnter: Mr, onEdgeMouseMove: Ir, onEdgeMouseLeave: Pr, reconnectRadius: Ar = 10, onNodesChange: kr, onEdgesChange: Hr, noDragClassName: Dr = "nodrag", noWheelClassName: $r = "nowheel", noPanClassName: Kt = "nopan", fitView: qt, fitViewOptions: Ut, connectOnClick: _r, attributionPosition: Lr, proOptions: zr, defaultEdgeOptions: Tr, elevateNodesOnSelect: Br = !0, elevateEdgesOnSelect: Vr = !1, disableKeyboardA11y: Qt = !1, autoPanOnConnect: Rr, autoPanOnNodeDrag: Or, autoPanOnSelection: Fr = !0, autoPanSpeed: Zr, connectionRadius: Yr, isValidConnection: Wr, onError: Xr, style: Gr, id: jt, nodeDragThreshold: Kr, connectionDragThreshold: qr, viewport: Ur, onViewportChange: Qr, width: jr, height: Jr, colorMode: es = "light", debug: ts, onScroll: Jt, ariaLabelConfig: ns, zIndexMode: en = "basic", ...os }, rs) {
  const St = jt || "1", ss = Ii(es), is = xe((tn) => {
    tn.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), Jt?.(tn);
  }, [Jt]);
  return I("div", { "data-testid": "rf__wrapper", ...os, onScroll: is, style: { ...Gr, ...ec }, ref: rs, className: ae(["react-flow", r, ss]), id: jt, role: "application", children: ce(Ja, { nodes: e, edges: t, width: jr, height: Jr, fitView: qt, fitViewOptions: Ut, minZoom: Se, maxZoom: ve, nodeOrigin: Ee, nodeExtent: Et, zIndexMode: en, children: [I(Mi, { nodes: e, edges: t, defaultNodes: n, defaultEdges: o, onConnect: p, onConnectStart: d, onConnectEnd: x, onClickConnectStart: m, onClickConnectEnd: y, nodesDraggable: le, autoPanOnNodeFocus: be, nodesConnectable: me, nodesFocusable: ye, edgesFocusable: We, edgesReconnectable: Ae, elementsSelectable: ke, elevateNodesOnSelect: Br, elevateEdgesOnSelect: Vr, minZoom: Se, maxZoom: ve, nodeExtent: Et, onNodesChange: kr, onEdgesChange: Hr, snapToGrid: Y, snapGrid: Q, connectionMode: V, translateExtent: He, connectOnClick: _r, defaultEdgeOptions: Tr, fitView: qt, fitViewOptions: Ut, onNodesDelete: z, onEdgesDelete: A, onDelete: $, onNodeDragStart: v, onNodeDrag: C, onNodeDragStop: N, onSelectionDrag: M, onSelectionDragStart: k, onSelectionDragStop: T, onMove: h, onMoveStart: c, onMoveEnd: f, noPanClassName: Kt, nodeOrigin: Ee, rfId: St, autoPanOnConnect: Rr, autoPanOnNodeDrag: Or, autoPanSpeed: Zr, onError: Xr, connectionRadius: Yr, isValidConnection: Wr, selectNodesOnDrag: re, nodeDragThreshold: Kr, connectionDragThreshold: qr, onBeforeDelete: Z, debug: ts, ariaLabelConfig: ns, zIndexMode: en }), I(qa, { onInit: u, onNodeClick: a, onEdgeClick: g, onNodeMouseEnter: w, onNodeMouseMove: l, onNodeMouseLeave: b, onNodeContextMenu: S, onNodeDoubleClick: E, nodeTypes: s, edgeTypes: i, connectionLineType: B, connectionLineStyle: W, connectionLineComponent: X, connectionLineContainerStyle: K, selectionKeyCode: q, selectionOnDrag: H, selectionMode: R, deleteKeyCode: te, multiSelectionKeyCode: G, panActivationKeyCode: U, zoomActivationKeyCode: O, onlyRenderVisibleElements: ee, defaultViewport: de, translateExtent: He, minZoom: Se, maxZoom: ve, preventScrolling: bt, zoomOnScroll: sr, zoomOnPinch: ir, zoomOnDoubleClick: dr, panOnScroll: ar, panOnScrollSpeed: cr, panOnScrollMode: lr, panOnDrag: ur, autoPanOnSelection: Fr, onPaneClick: fr, onPaneMouseEnter: gr, onPaneMouseMove: hr, onPaneMouseLeave: pr, onPaneScroll: mr, onPaneContextMenu: yr, paneClickDistance: xr, nodeClickDistance: wr, onSelectionContextMenu: D, onSelectionStart: L, onSelectionEnd: _, onReconnect: Er, onReconnectStart: Sr, onReconnectEnd: vr, onEdgeContextMenu: Nr, onEdgeDoubleClick: Cr, onEdgeMouseEnter: Mr, onEdgeMouseMove: Ir, onEdgeMouseLeave: Pr, reconnectRadius: Ar, defaultMarkerColor: rr, noDragClassName: Dr, noWheelClassName: $r, noPanClassName: Kt, rfId: St, disableKeyboardA11y: Qt, nodeExtent: Et, viewport: Ur, onViewportChange: Qr, nodesDraggable: le }), I(Si, { onSelectionChange: P }), br, I(yi, { proOptions: zr, position: Lr }), I(mi, { rfId: St, disableKeyboardA11y: Qt })] }) });
}
var $c = Ao(tc);
const nc = (e) => e.domNode?.querySelector(".react-flow__edgelabel-renderer");
function _c({ children: e }) {
  const t = j(nc);
  return t ? fs(e, t) : null;
}
function oc({ dimensions: e, lineWidth: t, variant: n, className: o }) {
  return I("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: ae(["react-flow__background-pattern", n, o]) });
}
function rc({ radius: e, className: t }) {
  return I("circle", { cx: e, cy: e, r: e, className: ae(["react-flow__background-pattern", "dots", t]) });
}
var Pe;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Pe || (Pe = {}));
const sc = {
  [Pe.Dots]: 1,
  [Pe.Lines]: 1,
  [Pe.Cross]: 6
}, ic = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function tr({
  id: e,
  variant: t = Pe.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: o,
  lineWidth: r = 1,
  offset: s = 0,
  color: i,
  bgColor: a,
  style: g,
  className: u,
  patternClassName: h
}) {
  const c = J(null), { transform: f, patternId: p } = j(ic, se), d = o || sc[t], x = t === Pe.Dots, m = t === Pe.Cross, y = Array.isArray(n) ? n : [n, n], w = [y[0] * f[2] || 1, y[1] * f[2] || 1], l = d * f[2], b = Array.isArray(s) ? s : [s, s], S = m ? [l, l] : w, E = [
    b[0] * f[2] || 1 + S[0] / 2,
    b[1] * f[2] || 1 + S[1] / 2
  ], v = `${p}${e || ""}`;
  return ce("svg", { className: ae(["react-flow__background", u]), style: {
    ...g,
    ...xt,
    "--xy-background-color-props": a,
    "--xy-background-pattern-color-props": i
  }, ref: c, "data-testid": "rf__background", children: [I("pattern", { id: v, x: f[0] % w[0], y: f[1] % w[1], width: w[0], height: w[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${E[0]},-${E[1]})`, children: x ? I(rc, { radius: l / 2, className: h }) : I(oc, { dimensions: S, lineWidth: r, variant: t, className: h }) }), I("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${v})` })] });
}
tr.displayName = "Background";
ie(tr);
function ac() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: I("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function cc() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: I("path", { d: "M0 0h32v4.2H0z" }) });
}
function lc() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: I("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function dc() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function uc() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function st({ children: e, className: t, ...n }) {
  return I("button", { type: "button", className: ae(["react-flow__controls-button", t]), ...n, children: e });
}
const fc = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function nr({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: o = !0, fitViewOptions: r, onZoomIn: s, onZoomOut: i, onFitView: a, onInteractiveChange: g, className: u, children: h, position: c = "bottom-left", orientation: f = "vertical", "aria-label": p }) {
  const d = oe(), { isInteractive: x, minZoomReached: m, maxZoomReached: y, ariaLabelConfig: w } = j(fc, se), { zoomIn: l, zoomOut: b, fitView: S } = Xt(), E = () => {
    l(), s?.();
  }, v = () => {
    b(), i?.();
  }, C = () => {
    S(r), a?.();
  }, N = () => {
    d.setState({
      nodesDraggable: !x,
      nodesConnectable: !x,
      elementsSelectable: !x
    }), g?.(!x);
  };
  return ce(yt, { className: ae(["react-flow__controls", f === "horizontal" ? "horizontal" : "vertical", u]), position: c, style: e, "data-testid": "rf__controls", "aria-label": p ?? w["controls.ariaLabel"], children: [t && ce(Ne, { children: [I(st, { onClick: E, className: "react-flow__controls-zoomin", title: w["controls.zoomIn.ariaLabel"], "aria-label": w["controls.zoomIn.ariaLabel"], disabled: y, children: I(ac, {}) }), I(st, { onClick: v, className: "react-flow__controls-zoomout", title: w["controls.zoomOut.ariaLabel"], "aria-label": w["controls.zoomOut.ariaLabel"], disabled: m, children: I(cc, {}) })] }), n && I(st, { className: "react-flow__controls-fitview", onClick: C, title: w["controls.fitView.ariaLabel"], "aria-label": w["controls.fitView.ariaLabel"], children: I(lc, {}) }), o && I(st, { className: "react-flow__controls-interactive", onClick: N, title: w["controls.interactive.ariaLabel"], "aria-label": w["controls.interactive.ariaLabel"], children: x ? I(uc, {}) : I(dc, {}) }), h] });
}
nr.displayName = "Controls";
const Lc = ie(nr);
function gc({ id: e, x: t, y: n, width: o, height: r, style: s, color: i, strokeColor: a, strokeWidth: g, className: u, borderRadius: h, shapeRendering: c, selected: f, onClick: p }) {
  const { background: d, backgroundColor: x } = s || {}, m = i || d || x;
  return I("rect", { className: ae(["react-flow__minimap-node", { selected: f }, u]), x: t, y: n, rx: h, ry: h, width: o, height: r, style: {
    fill: m,
    stroke: a,
    strokeWidth: g
  }, shapeRendering: c, onClick: p ? (y) => p(y, e) : void 0 });
}
const hc = ie(gc), pc = (e) => e.nodes.map((t) => t.id), At = (e) => e instanceof Function ? e : () => e;
function mc({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: r,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: s = hc,
  onClick: i
}) {
  const a = j(pc, se), g = At(t), u = At(e), h = At(n), c = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return I(Ne, { children: a.map((f) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    I(xc, { id: f, nodeColorFunc: g, nodeStrokeColorFunc: u, nodeClassNameFunc: h, nodeBorderRadius: o, nodeStrokeWidth: r, NodeComponent: s, onClick: i, shapeRendering: c }, f)
  )) });
}
function yc({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: o, nodeBorderRadius: r, nodeStrokeWidth: s, shapeRendering: i, NodeComponent: a, onClick: g }) {
  const { node: u, x: h, y: c, width: f, height: p } = j((d) => {
    const x = d.nodeLookup.get(e);
    if (!x)
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    const m = x.internals.userNode, { x: y, y: w } = x.internals.positionAbsolute, { width: l, height: b } = we(m);
    return {
      node: m,
      x: y,
      y: w,
      width: l,
      height: b
    };
  }, se);
  return !u || u.hidden || !oo(u) ? null : I(a, { x: h, y: c, width: f, height: p, style: u.style, selected: !!u.selected, className: o(u), color: t(u), borderRadius: r, strokeColor: n(u), strokeWidth: s, shapeRendering: i, onClick: g, id: u.id });
}
const xc = ie(yc);
var wc = ie(mc);
const bc = 200, Ec = 150, Sc = (e) => !e.hidden, vc = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: t,
    boundingRect: e.nodeLookup.size > 0 ? eo(Je(e.nodeLookup, { filter: Sc }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, Fn = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, Nc = (e, t) => Fn(e.viewBB, t.viewBB) && Fn(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, Cc = "react-flow__minimap-desc";
function or({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: o,
  nodeClassName: r = "",
  nodeBorderRadius: s = 5,
  nodeStrokeWidth: i,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: a,
  bgColor: g,
  maskColor: u,
  maskStrokeColor: h,
  maskStrokeWidth: c,
  position: f = "bottom-right",
  onClick: p,
  onNodeClick: d,
  pannable: x = !1,
  zoomable: m = !1,
  ariaLabel: y,
  inversePan: w,
  zoomStep: l = 1,
  offsetScale: b = 5
}) {
  const S = oe(), E = J(null), { boundingRect: v, viewBB: C, rfId: N, panZoom: z, translateExtent: A, flowWidth: $, flowHeight: P, ariaLabelConfig: k } = j(vc, Nc), M = e?.width ?? bc, T = e?.height ?? Ec, D = v.width / M, L = v.height / T, _ = Math.max(D, L), Z = _ * M, V = _ * T, B = b * _, W = v.x - (Z - v.width) / 2 - B, X = v.y - (V - v.height) / 2 - B, K = Z + B * 2, te = V + B * 2, q = `${Cc}-${N}`, H = J(0), R = J();
  H.current = _, ne(() => {
    if (E.current && z)
      return R.current = Us({
        domNode: E.current,
        panZoom: z,
        getTransform: () => S.getState().transform,
        getViewScale: () => H.current
      }), () => {
        R.current?.destroy();
      };
  }, [z]), ne(() => {
    R.current?.update({
      translateExtent: A,
      width: $,
      height: P,
      inversePan: w,
      pannable: x,
      zoomStep: l,
      zoomable: m
    });
  }, [x, m, w, l, A, $, P]);
  const U = p ? (Y) => {
    const [Q, ee] = R.current?.pointer(Y) || [0, 0];
    p(Y, { x: Q, y: ee });
  } : void 0, G = d ? xe((Y, Q) => {
    const ee = S.getState().nodeLookup.get(Q).internals.userNode;
    d(Y, ee);
  }, []) : void 0, O = y ?? k["minimap.ariaLabel"];
  return I(yt, { position: f, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof g == "string" ? g : void 0,
    "--xy-minimap-mask-background-color-props": typeof u == "string" ? u : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof h == "string" ? h : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof c == "number" ? c * _ : void 0,
    "--xy-minimap-node-background-color-props": typeof o == "string" ? o : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof i == "number" ? i : void 0
  }, className: ae(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: ce("svg", { width: M, height: T, viewBox: `${W} ${X} ${K} ${te}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": q, ref: E, onClick: U, children: [O && I("title", { id: q, children: O }), I(wc, { onClick: G, nodeColor: o, nodeStrokeColor: n, nodeBorderRadius: s, nodeClassName: r, nodeStrokeWidth: i, nodeComponent: a }), I("path", { className: "react-flow__minimap-mask", d: `M${W - B},${X - B}h${K + B * 2}v${te + B * 2}h${-K - B * 2}z
        M${C.x},${C.y}h${C.width}v${C.height}h${-C.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
or.displayName = "MiniMap";
const zc = ie(or), Mc = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, Ic = {
  [Ze.Line]: "right",
  [Ze.Handle]: "bottom-right"
};
function Pc({ nodeId: e, position: t, variant: n = Ze.Handle, className: o, style: r = void 0, children: s, color: i, minWidth: a = 10, minHeight: g = 10, maxWidth: u = Number.MAX_VALUE, maxHeight: h = Number.MAX_VALUE, keepAspectRatio: c = !1, resizeDirection: f, autoScale: p = !0, shouldResize: d, onResizeStart: x, onResize: m, onResizeEnd: y }) {
  const w = _o(), l = typeof e == "string" ? e : w, b = oe(), S = J(null), E = n === Ze.Handle, v = j(xe(Mc(E && p), [E, p]), se), C = J(null), N = t ?? Ic[n];
  ne(() => {
    if (!(!S.current || !l))
      return C.current || (C.current = li({
        domNode: S.current,
        nodeId: l,
        getStoreItems: () => {
          const { nodeLookup: A, transform: $, snapGrid: P, snapToGrid: k, nodeOrigin: M, domNode: T } = b.getState();
          return {
            nodeLookup: A,
            transform: $,
            snapGrid: P,
            snapToGrid: k,
            nodeOrigin: M,
            paneDomNode: T
          };
        },
        onChange: (A, $) => {
          const { triggerNodeChanges: P, nodeLookup: k, parentLookup: M, nodeOrigin: T } = b.getState(), D = [], L = { x: A.x, y: A.y }, _ = k.get(l);
          if (_ && _.expandParent && _.parentId) {
            const Z = _.origin ?? T, V = A.width ?? _.measured.width ?? 0, B = A.height ?? _.measured.height ?? 0, W = {
              id: _.id,
              parentId: _.parentId,
              rect: {
                width: V,
                height: B,
                ...ro({
                  x: A.x ?? _.position.x,
                  y: A.y ?? _.position.y
                }, { width: V, height: B }, _.parentId, k, Z)
              }
            }, X = Wt([W], k, M, T);
            D.push(...X), L.x = A.x ? Math.max(Z[0] * V, A.x) : void 0, L.y = A.y ? Math.max(Z[1] * B, A.y) : void 0;
          }
          if (L.x !== void 0 && L.y !== void 0) {
            const Z = {
              id: l,
              type: "position",
              position: { ...L }
            };
            D.push(Z);
          }
          if (A.width !== void 0 && A.height !== void 0) {
            const V = {
              id: l,
              type: "dimensions",
              resizing: !0,
              setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: A.width,
                height: A.height
              }
            };
            D.push(V);
          }
          for (const Z of $) {
            const V = {
              ...Z,
              type: "position"
            };
            D.push(V);
          }
          P(D);
        },
        onEnd: ({ width: A, height: $ }) => {
          const P = {
            id: l,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: A,
              height: $
            }
          };
          b.getState().triggerNodeChanges([P]);
        }
      })), C.current.update({
        controlPosition: N,
        boundaries: {
          minWidth: a,
          minHeight: g,
          maxWidth: u,
          maxHeight: h
        },
        keepAspectRatio: c,
        resizeDirection: f,
        onResizeStart: x,
        onResize: m,
        onResizeEnd: y,
        shouldResize: d
      }), () => {
        C.current?.destroy();
      };
  }, [
    N,
    a,
    g,
    u,
    h,
    c,
    x,
    m,
    y,
    d
  ]);
  const z = N.split("-");
  return I("div", { className: ae(["react-flow__resize-control", "nodrag", ...z, n, o]), ref: S, style: {
    ...r,
    scale: v,
    ...i && { [E ? "backgroundColor" : "borderColor"]: i }
  }, children: s });
}
const Tc = ie(Pc);
export {
  wt as B,
  Lc as C,
  _c as E,
  lt as H,
  zc as M,
  Tc as N,
  F as P,
  ja as R,
  ki as a,
  Hi as b,
  lo as g,
  $c as i,
  Xt as u
};
