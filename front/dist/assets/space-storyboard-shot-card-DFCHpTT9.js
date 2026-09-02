import { a as t, j as a, F as y } from "./runtime-entry-9YhLBCWA.js";
import { y as D, z as k, h as v, H as L, B, I as z, L as A, J as M } from "./vendor-icons-DgDZMD4Q.js";
import { S as T } from "./space-sequence-card-BuVDhSHD.js";
import { b as E, S as x, B as p, c as O, d as R, e as $, f as F } from "./upload-asset-api-BHoUDUjk.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-shot-card-BCm6GXS7.css", import.meta.url).href]);
function U({
  shot: r,
  index: s,
  storyboard: n,
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
  const b = r.speech.filter((_) => _.text.trim()).length;
  return /* @__PURE__ */ t(
    T,
    {
      itemId: r.id,
      index: s,
      durationLabel: `${r.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: e,
      readonly: !o,
      wholeCardDraggable: !0,
      dragging: l,
      dropPlacement: i,
      ariaLabel: `镜头 ${s + 1}`,
      onSelect: d,
      onDragStart: w || m,
      onDragOver: f || P,
      onDrop: C || m,
      onDragEnd: N || m,
      headerActions: /* @__PURE__ */ a("span", { className: "ws-storyboard-card-count", children: b ? `${b} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ a(
          I,
          {
            shot: r,
            storyboard: n
          }
        ),
        /* @__PURE__ */ t("footer", { children: [
          /* @__PURE__ */ a(p, { label: o ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": o ? "编辑镜头" : "查看镜头",
              onClick: u(d),
              children: /* @__PURE__ */ a(D, { size: 13 })
            }
          ) }),
          o && c ? /* @__PURE__ */ a(p, { label: "复制镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: u(c),
              children: /* @__PURE__ */ a(k, { size: 13 })
            }
          ) }) : null,
          o && h ? /* @__PURE__ */ a(p, { label: "删除镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: u(h),
              children: /* @__PURE__ */ a(v, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function Y({
  shot: r,
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
          /* @__PURE__ */ a("strong", { children: String(s + 1).padStart(2, "0") }),
          /* @__PURE__ */ t("span", { children: [
            r.duration,
            "秒"
          ] }),
          /* @__PURE__ */ a(
            g,
            {
              continues: r.continue_previous,
              matches: r.match_previous
            }
          )
        ] }),
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-description", children: r.beat || r.description || `镜头 ${s + 1}` }),
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ a(S, { shot: r, storyboard: n }) })
      ]
    }
  );
}
function I({ shot: r, storyboard: s }) {
  const n = r.speech.filter((c) => c.text.trim()), e = n[0], o = new Map(
    s.materials.filter((c) => c.type === "character").map((c) => [c.id, c.name])
  ), l = [...new Set(n.map(O))], i = R(r).length, d = $(r);
  return /* @__PURE__ */ t(y, { children: [
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-preview", children: [
      /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(
        g,
        {
          continues: r.continue_previous,
          matches: r.match_previous
        }
      ) }),
      /* @__PURE__ */ a("strong", { children: r.beat || `镜头 ${r.order} 的叙事变化` }),
      /* @__PURE__ */ a("p", { children: r.description || "等待补充镜头内容" })
    ] }),
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-body", children: [
      /* @__PURE__ */ t("div", { className: "ws-storyboard-card-tags", children: [
        /* @__PURE__ */ a("span", { children: F[r.shot_image_mode] }),
        /* @__PURE__ */ a(S, { shot: r, storyboard: s }),
        l.map((c) => /* @__PURE__ */ a("span", { children: c }, c)),
        i ? /* @__PURE__ */ t("span", { children: [
          i,
          " 条字幕"
        ] }) : null,
        d ? /* @__PURE__ */ a("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ a("p", { className: "ws-storyboard-card-camera", children: r.camera_instruction || "未设置镜头语言" }),
      e ? /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech", children: [
        e.kind === "dialogue" ? /* @__PURE__ */ a(L, { size: 12 }) : /* @__PURE__ */ a(B, { size: 12 }),
        /* @__PURE__ */ a("strong", { children: e.kind === "dialogue" ? o.get(e.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ a("span", { children: e.text })
      ] }) : /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ a(z, { size: 12 }),
        /* @__PURE__ */ a("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function S({
  shot: r,
  storyboard: s
}) {
  const n = /* @__PURE__ */ new Map();
  for (const e of E(s, r))
    n.set(e.type, (n.get(e.type) || 0) + 1);
  return n.size ? /* @__PURE__ */ a(y, { children: ["character", "scene", "prop"].map(
    (e) => n.get(e) ? /* @__PURE__ */ t("span", { children: [
      x[e],
      " ",
      n.get(e)
    ] }, e) : null
  ) }) : /* @__PURE__ */ a("span", { className: "is-empty", children: "无关联素材" });
}
function g({
  continues: r,
  matches: s
}) {
  const n = r || s;
  return /* @__PURE__ */ t(
    "span",
    {
      className: `ws-storyboard-continuity ${n ? "is-linked" : "is-cut"}`,
      children: [
        n ? /* @__PURE__ */ a(A, { size: 11 }) : /* @__PURE__ */ a(M, { size: 11 }),
        r ? "延续上镜" : s ? "匹配上镜" : "切镜"
      ]
    }
  );
}
function u(r) {
  return (s) => {
    s.stopPropagation(), r();
  };
}
function m() {
}
function P(r) {
}
export {
  Y as S,
  U as a
};
