import { a as t, j as a, F as b } from "./react-CDpwMNlY.js";
import { v as k, w as _, h as L, x as B, B as v, y as z, L as M, z as A } from "./vendor-icons-Cz5zFzlk.js";
import { S as T } from "./space-sequence-card-B8s1aEtn.js";
import { s as x, S as E, B as p, a as R, b as O, c as $, d as F } from "./node-detail-content-DEcv8fc7.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-shot-card-BYRnChUM.css", import.meta.url).href]);
function G({
  shot: r,
  index: n,
  storyboard: s,
  selected: e = !1,
  editable: o = !1,
  dragging: l = !1,
  dropPlacement: i,
  onOpen: d,
  onDuplicate: c,
  onRemove: h,
  onDragStart: w,
  onDragOver: f,
  onDrop: C,
  onDragEnd: N
}) {
  const y = r.speech.filter((D) => D.text.trim()).length;
  return /* @__PURE__ */ t(
    T,
    {
      itemId: r.id,
      index: n,
      durationLabel: `${r.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: e,
      readonly: !o,
      wholeCardDraggable: !0,
      dragging: l,
      dropPlacement: i,
      ariaLabel: `镜头 ${n + 1}`,
      onSelect: d,
      onDragStart: w || m,
      onDragOver: f || I,
      onDrop: C || m,
      onDragEnd: N || m,
      headerActions: /* @__PURE__ */ a("span", { className: "ws-storyboard-card-count", children: y ? `${y} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ a(
          P,
          {
            shot: r,
            storyboard: s
          }
        ),
        /* @__PURE__ */ t("footer", { children: [
          /* @__PURE__ */ a(p, { label: o ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": o ? "编辑镜头" : "查看镜头",
              onClick: u(d),
              children: /* @__PURE__ */ a(k, { size: 13 })
            }
          ) }),
          o && c ? /* @__PURE__ */ a(p, { label: "复制镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: u(c),
              children: /* @__PURE__ */ a(_, { size: 13 })
            }
          ) }) : null,
          o && h ? /* @__PURE__ */ a(p, { label: "删除镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: u(h),
              children: /* @__PURE__ */ a(L, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function V({
  shot: r,
  index: n,
  storyboard: s,
  onOpen: e
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      disabled: !e,
      onMouseDown: (o) => o.stopPropagation(),
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), e?.();
      },
      children: [
        /* @__PURE__ */ t("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ a("strong", { children: String(n + 1).padStart(2, "0") }),
          /* @__PURE__ */ t("span", { children: [
            r.duration,
            "秒"
          ] })
        ] }),
        /* @__PURE__ */ a(S, { shot: r }),
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ a(g, { shot: r, storyboard: s }) })
      ]
    }
  );
}
function P({ shot: r, storyboard: n }) {
  const s = r.speech.filter((c) => c.text.trim()), e = s[0], o = new Map(
    n.materials.filter((c) => c.type === "character").map((c) => [c.id, c.name])
  ), l = [...new Set(s.map(R))], i = O(r).length, d = $(r);
  return /* @__PURE__ */ t(b, { children: [
    /* @__PURE__ */ a(S, { shot: r }),
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-body", children: [
      /* @__PURE__ */ t("div", { className: "ws-storyboard-card-tags", children: [
        /* @__PURE__ */ a("span", { children: F[r.shot_image_mode] }),
        /* @__PURE__ */ a(g, { shot: r, storyboard: n }),
        l.map((c) => /* @__PURE__ */ a("span", { children: c }, c)),
        i ? /* @__PURE__ */ t("span", { children: [
          i,
          " 条字幕"
        ] }) : null,
        d ? /* @__PURE__ */ a("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ a("p", { className: "ws-storyboard-card-camera", children: r.camera_instruction || "未设置镜头语言" }),
      e ? /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech", children: [
        e.kind === "dialogue" ? /* @__PURE__ */ a(B, { size: 12 }) : /* @__PURE__ */ a(v, { size: 12 }),
        /* @__PURE__ */ a("strong", { children: e.kind === "dialogue" ? o.get(e.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ a("span", { children: e.text })
      ] }) : /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ a(z, { size: 12 }),
        /* @__PURE__ */ a("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function S({ shot: r }) {
  return /* @__PURE__ */ t("span", { className: "ws-storyboard-card-preview", children: [
    /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(
      j,
      {
        continues: r.continue_previous,
        matches: r.match_previous
      }
    ) }),
    /* @__PURE__ */ a("strong", { children: r.beat || `镜头 ${r.order} 的叙事变化` }),
    /* @__PURE__ */ a("span", { className: "ws-storyboard-card-description", children: r.description || "等待补充镜头内容" })
  ] });
}
function g({
  shot: r,
  storyboard: n
}) {
  const s = /* @__PURE__ */ new Map();
  for (const e of x(n, r))
    s.set(e.type, (s.get(e.type) || 0) + 1);
  return s.size ? /* @__PURE__ */ a(b, { children: ["character", "scene", "prop"].map(
    (e) => s.get(e) ? /* @__PURE__ */ t("span", { children: [
      E[e],
      " ",
      s.get(e)
    ] }, e) : null
  ) }) : /* @__PURE__ */ a("span", { className: "is-empty", children: "无关联素材" });
}
function j({
  continues: r,
  matches: n
}) {
  const s = r || n;
  return /* @__PURE__ */ t(
    "span",
    {
      className: `ws-storyboard-continuity ${s ? "is-linked" : "is-cut"}`,
      children: [
        s ? /* @__PURE__ */ a(M, { size: 11 }) : /* @__PURE__ */ a(A, { size: 11 }),
        r ? "延续上镜" : n ? "匹配上镜" : "切镜"
      ]
    }
  );
}
function u(r) {
  return (n) => {
    n.stopPropagation(), r();
  };
}
function m() {
}
function I(r) {
}
export {
  V as S,
  G as a
};
