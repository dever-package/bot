import { a as n, j as e } from "./react-HSzdbxZ7.js";
import { v as C, w as _, h as D } from "./vendor-icons-fVDtJt66.js";
import { S as N } from "./space-sequence-card-DbsNaRSc.js";
import { B as s } from "./asset-preview-DGKZUP9q.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-shot-card-lRBX-atz.css", import.meta.url).href]);
function z({
  shot: r,
  index: t,
  storyboard: i,
  frame: l,
  selected: o = !1,
  editable: a = !1,
  dragging: c = !1,
  dropPlacement: f,
  onOpen: m,
  onDuplicate: u,
  onRemove: g,
  onDragStart: h,
  onDragOver: y,
  onDrop: w,
  onDragEnd: S
}) {
  return /* @__PURE__ */ n(
    N,
    {
      itemId: r.id,
      index: t,
      durationLabel: `${r.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: o,
      readonly: !a,
      wholeCardDraggable: !0,
      dragging: c,
      dropPlacement: f,
      ariaLabel: `镜头 ${t + 1}`,
      onSelect: m,
      onDragStart: h || p,
      onDragOver: y || v,
      onDrop: w || p,
      onDragEnd: S || p,
      children: [
        /* @__PURE__ */ e(
          b,
          {
            shot: r,
            storyboard: i,
            frame: l
          }
        ),
        /* @__PURE__ */ n("footer", { children: [
          /* @__PURE__ */ e(s, { label: a ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": a ? "编辑镜头" : "查看镜头",
              onClick: d(m),
              children: [
                /* @__PURE__ */ e(C, { size: 13 }),
                /* @__PURE__ */ e("span", { children: a ? "编辑镜头" : "查看镜头" })
              ]
            }
          ) }),
          a && u ? /* @__PURE__ */ e(s, { label: "复制镜头", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: d(u),
              children: /* @__PURE__ */ e(_, { size: 13 })
            }
          ) }) : null,
          a && g ? /* @__PURE__ */ e(s, { label: "删除镜头", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: d(g),
              children: /* @__PURE__ */ e(D, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function U({
  shot: r,
  index: t,
  storyboard: i,
  frame: l,
  onOpen: o
}) {
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      "aria-label": `查看镜头 ${t + 1}`,
      disabled: !o,
      onMouseDown: (a) => a.stopPropagation(),
      onClick: (a) => {
        a.preventDefault(), a.stopPropagation(), o?.();
      },
      children: [
        /* @__PURE__ */ n("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ n("strong", { children: [
            "镜头 ",
            String(t + 1).padStart(2, "0")
          ] }),
          /* @__PURE__ */ n("span", { children: [
            r.duration,
            "秒"
          ] })
        ] }),
        /* @__PURE__ */ e(
          b,
          {
            shot: r,
            storyboard: i,
            frame: l
          }
        )
      ]
    }
  );
}
function b({
  shot: r,
  storyboard: t,
  frame: i
}) {
  const l = i?.references?.filter((a) => a.imageURL) || [i?.start, i?.end].filter(
    (a) => !!a?.imageURL
  ), o = r.speech.filter((a) => a.text.trim());
  return /* @__PURE__ */ n("div", { className: "ws-storyboard-card-reading", children: [
    r.start_framing || r.camera_instruction ? /* @__PURE__ */ n("p", { className: "ws-storyboard-card-camera", children: [
      r.start_framing ? /* @__PURE__ */ e("span", { title: r.start_framing, children: r.start_framing }) : null,
      r.camera_instruction ? /* @__PURE__ */ e("span", { title: r.camera_instruction, children: r.camera_instruction }) : null
    ] }) : null,
    l.length ? /* @__PURE__ */ e(
      "div",
      {
        className: "ws-storyboard-card-images",
        style: {
          aspectRatio: t?.aspect_ratio?.replace(":", " / ")
        },
        children: l.slice(0, 1).map((a, c) => /* @__PURE__ */ e(
          "img",
          {
            src: a.imageURL,
            alt: `镜头 ${r.order}画面`,
            loading: "lazy",
            decoding: "async"
          },
          `${a.imageURL}:${c}`
        ))
      }
    ) : null,
    /* @__PURE__ */ n("div", { className: "ws-storyboard-card-description", children: [
      r.beat ? /* @__PURE__ */ e("p", { children: r.beat }) : null,
      r.description && r.description.trim() !== r.beat.trim() ? /* @__PURE__ */ e("p", { children: r.description }) : null,
      !r.beat && !r.description ? /* @__PURE__ */ e("p", { children: "等待补充镜头内容" }) : null
    ] }),
    o.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-card-speech", children: o.map((a) => /* @__PURE__ */ n("p", { children: [
      /* @__PURE__ */ e("strong", { children: a.kind === "dialogue" ? t?.materials.find(
        (c) => c.id === a.character_id
      )?.name || "对白" : "旁白" }),
      /* @__PURE__ */ e("span", { children: a.text })
    ] }, a.id)) }) : null
  ] });
}
function d(r) {
  return (t) => {
    t.stopPropagation(), r();
  };
}
function p() {
}
function v(r) {
}
export {
  U as S,
  z as a
};
