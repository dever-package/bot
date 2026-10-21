import { a as l, j as r } from "./react-HSzdbxZ7.js";
import { G as p } from "./vendor-icons-fVDtJt66.js";
import { b as q } from "./file-kind-D6bMOzYN.js";
import { B as m } from "./asset-preview-DGKZUP9q.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-sequence-card-C57NOS_Z.css", import.meta.url).href]);
function A({
  itemId: s,
  index: g,
  durationLabel: D,
  className: h,
  dragClassName: n,
  selected: v = !1,
  readonly: t = !1,
  wholeCardDraggable: i = !1,
  dragging: S = !1,
  dropPlacement: o,
  ariaLabel: c,
  headerActions: T,
  children: w,
  onSelect: b,
  onDragStart: x,
  onDragOver: E,
  onDrop: j,
  onDragEnd: k
}) {
  const a = q(!1);
  function f(e) {
    const d = e.target;
    if (i && d instanceof HTMLElement && d.closest("button, a, input, textarea, select")) {
      e.preventDefault();
      return;
    }
    a.current = !0, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", s), i && e.dataTransfer.setDragImage(e.currentTarget, 28, 18), x();
  }
  function u() {
    k(), window.setTimeout(() => {
      a.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ l(
    "article",
    {
      className: [
        "ws-sequence-card",
        h,
        v ? "is-selected" : "",
        i && !t ? "is-drag-enabled" : "",
        S ? "is-dragging" : "",
        o ? `is-drop-${o}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": s,
      "aria-label": c,
      draggable: !t && i,
      onClick: () => {
        a.current || b();
      },
      onDragStart: !t && i ? f : void 0,
      onDragOver: t ? void 0 : (e) => {
        e.preventDefault(), e.dataTransfer.dropEffect = "move", E(e);
      },
      onDrop: t ? void 0 : (e) => {
        e.preventDefault(), j();
      },
      onDragEnd: !t && i ? u : void 0,
      children: [
        /* @__PURE__ */ l("header", { children: [
          i ? /* @__PURE__ */ r(m, { label: t ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ r("span", { className: n, "aria-hidden": "true", children: /* @__PURE__ */ r(p, { size: 13 }) }) }) : /* @__PURE__ */ r(m, { label: t ? void 0 : "拖动排序", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: n,
              draggable: !t,
              disabled: t,
              "aria-label": `拖动${c}排序`,
              onClick: (e) => e.stopPropagation(),
              onDragStart: f,
              onDragEnd: u,
              children: /* @__PURE__ */ r(p, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ r("strong", { children: String(g + 1).padStart(2, "0") }),
          /* @__PURE__ */ r("span", { children: D }),
          T || /* @__PURE__ */ r("i", { "aria-hidden": "true" })
        ] }),
        w
      ]
    }
  );
}
export {
  A as S
};
