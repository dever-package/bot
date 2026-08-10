import { j as t, a as r, F as y } from "./_commonjsHelpers-CTFd9u1x.js";
import { e as v, f as D, P as z, g as B, T as L, U as _, B as T, h as M } from "./vendor-icons-Cc7Kl3It.js";
import { S as x } from "./space-sequence-card-CzyxbAhV.js";
import { B as p } from "./storyboard-grid-view-CJXm84yJ.js";
import { b as A, S as $, c as P, d as E, e as F } from "./node-detail-content-DhUE_leQ.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-shot-card-BCm6GXS7.css", import.meta.url).href]);
function H({
  shot: a,
  index: s,
  storyboard: n,
  selected: e = !1,
  editable: o = !1,
  dragging: l = !1,
  dropPlacement: i,
  onOpen: d,
  onDuplicate: c,
  onRemove: h,
  onDragStart: f,
  onDragOver: w,
  onDrop: C,
  onDragEnd: N
}) {
  const b = a.speech.filter((k) => k.text.trim()).length;
  return /* @__PURE__ */ t(
    x,
    {
      itemId: a.id,
      index: s,
      durationLabel: `${a.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: e,
      readonly: !o,
      wholeCardDraggable: !0,
      dragging: l,
      dropPlacement: i,
      ariaLabel: `镜头 ${s + 1}`,
      onSelect: d,
      onDragStart: f || m,
      onDragOver: w || j,
      onDrop: C || m,
      onDragEnd: N || m,
      headerActions: /* @__PURE__ */ r("span", { className: "ws-storyboard-card-count", children: b ? `${b} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ r(
          R,
          {
            shot: a,
            storyboard: n
          }
        ),
        /* @__PURE__ */ t("footer", { children: [
          /* @__PURE__ */ r(p, { label: o ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": o ? "编辑镜头" : "查看镜头",
              onClick: u(d),
              children: /* @__PURE__ */ r(z, { size: 13 })
            }
          ) }),
          o && c ? /* @__PURE__ */ r(p, { label: "复制镜头", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: u(c),
              children: /* @__PURE__ */ r(B, { size: 13 })
            }
          ) }) : null,
          o && h ? /* @__PURE__ */ r(p, { label: "删除镜头", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: u(h),
              children: /* @__PURE__ */ r(L, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function V({
  shot: a,
  index: s,
  storyboard: n,
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
          /* @__PURE__ */ r("strong", { children: String(s + 1).padStart(2, "0") }),
          /* @__PURE__ */ t("span", { children: [
            a.duration,
            "秒"
          ] }),
          /* @__PURE__ */ r(
            S,
            {
              continues: a.continue_previous,
              matches: a.match_previous
            }
          )
        ] }),
        /* @__PURE__ */ r("span", { className: "ws-storyboard-compact-description", children: a.beat || a.description || `镜头 ${s + 1}` }),
        /* @__PURE__ */ r("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ r(g, { shot: a, storyboard: n }) })
      ]
    }
  );
}
function R({ shot: a, storyboard: s }) {
  const n = a.speech.filter((c) => c.text.trim()), e = n[0], o = new Map(
    s.materials.filter((c) => c.type === "character").map((c) => [c.id, c.name])
  ), l = [...new Set(n.map(P))], i = E(a).length, d = F(a);
  return /* @__PURE__ */ t(y, { children: [
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-preview", children: [
      /* @__PURE__ */ r("span", { children: /* @__PURE__ */ r(
        S,
        {
          continues: a.continue_previous,
          matches: a.match_previous
        }
      ) }),
      /* @__PURE__ */ r("strong", { children: a.beat || `镜头 ${a.order} 的叙事变化` }),
      /* @__PURE__ */ r("p", { children: a.description || "等待补充镜头内容" })
    ] }),
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-body", children: [
      /* @__PURE__ */ t("div", { className: "ws-storyboard-card-tags", children: [
        /* @__PURE__ */ r(g, { shot: a, storyboard: s }),
        l.map((c) => /* @__PURE__ */ r("span", { children: c }, c)),
        i ? /* @__PURE__ */ t("span", { children: [
          i,
          " 条字幕"
        ] }) : null,
        d ? /* @__PURE__ */ r("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ r("p", { className: "ws-storyboard-card-camera", children: a.camera_instruction || "未设置镜头语言" }),
      e ? /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech", children: [
        e.kind === "dialogue" ? /* @__PURE__ */ r(_, { size: 12 }) : /* @__PURE__ */ r(T, { size: 12 }),
        /* @__PURE__ */ r("strong", { children: e.kind === "dialogue" ? o.get(e.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ r("span", { children: e.text })
      ] }) : /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ r(M, { size: 12 }),
        /* @__PURE__ */ r("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function g({
  shot: a,
  storyboard: s
}) {
  const n = /* @__PURE__ */ new Map();
  for (const e of A(s, a))
    n.set(e.type, (n.get(e.type) || 0) + 1);
  return n.size ? /* @__PURE__ */ r(y, { children: ["character", "scene", "prop"].map(
    (e) => n.get(e) ? /* @__PURE__ */ t("span", { children: [
      $[e],
      " ",
      n.get(e)
    ] }, e) : null
  ) }) : /* @__PURE__ */ r("span", { className: "is-empty", children: "无关联素材" });
}
function S({
  continues: a,
  matches: s
}) {
  const n = a || s;
  return /* @__PURE__ */ t(
    "span",
    {
      className: `ws-storyboard-continuity ${n ? "is-linked" : "is-cut"}`,
      children: [
        n ? /* @__PURE__ */ r(v, { size: 11 }) : /* @__PURE__ */ r(D, { size: 11 }),
        a ? "延续上镜" : s ? "匹配上镜" : "切镜"
      ]
    }
  );
}
function u(a) {
  return (s) => {
    s.stopPropagation(), a();
  };
}
function m() {
}
function j(a) {
}
export {
  V as S,
  H as a
};
