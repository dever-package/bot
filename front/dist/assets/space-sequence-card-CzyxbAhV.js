import { j as p, a as r } from "./_commonjsHelpers-CTFd9u1x.js";
import { W as m } from "./vendor-icons-Cc7Kl3It.js";
import { u as B } from "./react-C7Xtl8sB.js";
import { B as l } from "./storyboard-grid-view-CJXm84yJ.js";
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const g = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!g || Object.keys(g).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
function N({
  itemId: n,
  index: v,
  durationLabel: D,
  className: h,
  dragClassName: i,
  selected: T = !1,
  readonly: e = !1,
  wholeCardDraggable: a = !1,
  dragging: q = !1,
  dropPlacement: o,
  ariaLabel: c,
  headerActions: S,
  children: b,
  onSelect: j,
  onDragStart: k,
  onDragOver: w,
  onDrop: x,
  onDragEnd: E
}) {
  const s = B(!1);
  function f(t) {
    const u = t.target;
    if (a && u instanceof HTMLElement && u.closest("button, a, input, textarea, select")) {
      t.preventDefault();
      return;
    }
    s.current = !0, t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", n), a && t.dataTransfer.setDragImage(t.currentTarget, 28, 18), k();
  }
  function d() {
    E(), window.setTimeout(() => {
      s.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ p(
    "article",
    {
      className: [
        "ws-sequence-card",
        h,
        T ? "is-selected" : "",
        a && !e ? "is-drag-enabled" : "",
        q ? "is-dragging" : "",
        o ? `is-drop-${o}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": n,
      "aria-label": c,
      draggable: !e && a,
      onClick: () => {
        s.current || j();
      },
      onDragStart: !e && a ? f : void 0,
      onDragOver: e ? void 0 : (t) => {
        t.preventDefault(), t.dataTransfer.dropEffect = "move", w(t);
      },
      onDrop: e ? void 0 : (t) => {
        t.preventDefault(), x();
      },
      onDragEnd: !e && a ? d : void 0,
      children: [
        /* @__PURE__ */ p("header", { children: [
          a ? /* @__PURE__ */ r(l, { label: e ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ r("span", { className: i, "aria-hidden": "true", children: /* @__PURE__ */ r(m, { size: 13 }) }) }) : /* @__PURE__ */ r(l, { label: e ? void 0 : "拖动排序", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: i,
              draggable: !e,
              disabled: e,
              "aria-label": `拖动${c}排序`,
              onClick: (t) => t.stopPropagation(),
              onDragStart: f,
              onDragEnd: d,
              children: /* @__PURE__ */ r(m, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ r("strong", { children: String(v + 1).padStart(2, "0") }),
          /* @__PURE__ */ r("span", { children: D }),
          S || /* @__PURE__ */ r("i", { "aria-hidden": "true" })
        ] }),
        b
      ]
    }
  );
}
export {
  N as S,
  g as m
};
