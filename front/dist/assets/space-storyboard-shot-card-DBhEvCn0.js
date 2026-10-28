import { a as t, j as a } from "./react-5Z-wsVEn.js";
import { v as S, w as C, h as N } from "./vendor-icons-fVDtJt66.js";
import { S as D } from "./space-sequence-card-XZLSsSh2.js";
import { B as c } from "./asset-preview-BZxHU4Mm.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-shot-card-lRBX-atz.css", import.meta.url).href]);
function z({
  shot: r,
  index: i,
  storyboard: o,
  frame: s,
  selected: l = !1,
  editable: n = !1,
  dragging: e = !1,
  dropPlacement: d,
  onOpen: u,
  onDuplicate: g,
  onRemove: b,
  onDragStart: f,
  onDragOver: w,
  onDrop: y,
  onDragEnd: _
}) {
  return /* @__PURE__ */ t(
    D,
    {
      itemId: r.id,
      index: i,
      durationLabel: `${r.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: l,
      readonly: !n,
      wholeCardDraggable: !0,
      dragging: e,
      dropPlacement: d,
      ariaLabel: `镜头 ${i + 1}`,
      onSelect: u,
      onDragStart: f || m,
      onDragOver: w || v,
      onDrop: y || m,
      onDragEnd: _ || m,
      children: [
        /* @__PURE__ */ a(
          h,
          {
            shot: r,
            storyboard: o,
            frame: s
          }
        ),
        /* @__PURE__ */ t("footer", { children: [
          /* @__PURE__ */ a(c, { label: n ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              "aria-label": n ? "编辑镜头" : "查看镜头",
              onClick: p(u),
              children: [
                /* @__PURE__ */ a(S, { size: 13 }),
                /* @__PURE__ */ a("span", { children: n ? "编辑镜头" : "查看镜头" })
              ]
            }
          ) }),
          n && g ? /* @__PURE__ */ a(c, { label: "复制镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: p(g),
              children: /* @__PURE__ */ a(C, { size: 13 })
            }
          ) }) : null,
          n && b ? /* @__PURE__ */ a(c, { label: "删除镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: p(b),
              children: /* @__PURE__ */ a(N, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function U({
  shot: r,
  index: i,
  storyboard: o,
  frame: s,
  onOpen: l
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      "aria-label": `查看镜头 ${i + 1}`,
      disabled: !l,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), l?.();
      },
      children: [
        /* @__PURE__ */ t("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ t("strong", { children: [
            "镜头 ",
            String(i + 1).padStart(2, "0")
          ] }),
          /* @__PURE__ */ t("span", { children: [
            r.duration,
            "秒"
          ] })
        ] }),
        /* @__PURE__ */ a(
          h,
          {
            shot: r,
            storyboard: o,
            frame: s
          }
        )
      ]
    }
  );
}
function h({
  shot: r,
  storyboard: i,
  frame: o
}) {
  const s = i?.shots?.find(
    (e) => e.id === r.shared_end_shot_id
  ), l = o?.references?.filter((e) => e.imageURL) || [o?.start, o?.end].filter(
    (e) => !!e?.imageURL
  ), n = r.speech.filter((e) => e.text.trim());
  return /* @__PURE__ */ t("div", { className: "ws-storyboard-card-reading", children: [
    r.shared_end_shot_id ? /* @__PURE__ */ a("p", { className: "ws-storyboard-card-camera", children: s ? `结束画面：镜头 ${s.order} 首帧` : "共享来源已移除" }) : null,
    r.start_framing || r.camera_instruction ? /* @__PURE__ */ t("p", { className: "ws-storyboard-card-camera", children: [
      r.start_framing ? /* @__PURE__ */ a("span", { title: r.start_framing, children: r.start_framing }) : null,
      r.camera_instruction ? /* @__PURE__ */ a("span", { title: r.camera_instruction, children: r.camera_instruction }) : null
    ] }) : null,
    l.length ? /* @__PURE__ */ a(
      "div",
      {
        className: "ws-storyboard-card-images",
        style: {
          aspectRatio: i?.aspect_ratio?.replace(":", " / ")
        },
        children: l.slice(0, 1).map((e, d) => /* @__PURE__ */ a(
          "img",
          {
            src: e.imageURL,
            alt: `镜头 ${r.order}画面`,
            loading: "lazy",
            decoding: "async"
          },
          `${e.imageURL}:${d}`
        ))
      }
    ) : null,
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-description", children: [
      r.beat ? /* @__PURE__ */ a("p", { children: r.beat }) : null,
      r.description && r.description.trim() !== r.beat.trim() ? /* @__PURE__ */ a("p", { children: r.description }) : null,
      !r.beat && !r.description ? /* @__PURE__ */ a("p", { children: "等待补充镜头内容" }) : null
    ] }),
    n.length ? /* @__PURE__ */ a("div", { className: "ws-storyboard-card-speech", children: n.map((e) => /* @__PURE__ */ t("p", { children: [
      /* @__PURE__ */ a("strong", { children: e.kind === "dialogue" ? i?.materials.find(
        (d) => d.id === e.character_id
      )?.name || "对白" : "旁白" }),
      /* @__PURE__ */ a("span", { children: e.text })
    ] }, e.id)) }) : null
  ] });
}
function p(r) {
  return (i) => {
    i.stopPropagation(), r();
  };
}
function m() {
}
function v(r) {
}
export {
  U as S,
  z as a
};
