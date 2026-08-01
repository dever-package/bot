import { c as q, a as u, j as r } from "./createLucideIcon-CEtb6KSk.js";
import { a as z } from "./runtime-entry-CIrzyMsA.js";
import { b as p } from "./upload-asset-api-DAbIOMVJ.js";
const N = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
], g = q("grip-vertical", N);
function _({
  itemId: a,
  index: m,
  durationLabel: x,
  className: k,
  dragClassName: s,
  selected: j = !1,
  readonly: t = !1,
  wholeCardDraggable: c = !1,
  dragging: v = !1,
  dropPlacement: n,
  ariaLabel: o,
  headerActions: T,
  children: h,
  onSelect: D,
  onDragStart: S,
  onDragOver: b,
  onDrop: y,
  onDragEnd: E
}) {
  const i = z(!1);
  function f(e) {
    const d = e.target;
    if (c && d instanceof HTMLElement && d.closest("button, a, input, textarea, select")) {
      e.preventDefault();
      return;
    }
    i.current = !0, e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", a), c && e.dataTransfer.setDragImage(e.currentTarget, 28, 18), S();
  }
  function l() {
    E(), window.setTimeout(() => {
      i.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ u(
    "article",
    {
      className: [
        "ws-sequence-card",
        k,
        j ? "is-selected" : "",
        c && !t ? "is-drag-enabled" : "",
        v ? "is-dragging" : "",
        n ? `is-drop-${n}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": a,
      "aria-label": o,
      draggable: !t && c,
      onClick: () => {
        i.current || D();
      },
      onDragStart: !t && c ? f : void 0,
      onDragOver: t ? void 0 : (e) => {
        e.preventDefault(), e.dataTransfer.dropEffect = "move", b(e);
      },
      onDrop: t ? void 0 : (e) => {
        e.preventDefault(), y();
      },
      onDragEnd: !t && c ? l : void 0,
      children: [
        /* @__PURE__ */ u("header", { children: [
          c ? /* @__PURE__ */ r(p, { label: t ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ r("span", { className: s, "aria-hidden": "true", children: /* @__PURE__ */ r(g, { size: 13 }) }) }) : /* @__PURE__ */ r(p, { label: t ? void 0 : "拖动排序", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: s,
              draggable: !t,
              disabled: t,
              "aria-label": `拖动${o}排序`,
              onClick: (e) => e.stopPropagation(),
              onDragStart: f,
              onDragEnd: l,
              children: /* @__PURE__ */ r(g, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ r("strong", { children: String(m + 1).padStart(2, "0") }),
          /* @__PURE__ */ r("span", { children: x }),
          T || /* @__PURE__ */ r("i", { "aria-hidden": "true" })
        ] }),
        h
      ]
    }
  );
}
export {
  _ as S
};
