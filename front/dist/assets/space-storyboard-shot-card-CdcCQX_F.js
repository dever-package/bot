import { c as b, a as t, j as a, F as g } from "./createLucideIcon-CEtb6KSk.js";
import { U as _, B as z } from "./user-round-uRCY5ob-.js";
import { C as L } from "./copy-B2Ci6O8V.js";
import { L as v } from "./link-2-D3KtV2w-.js";
import { S as D } from "./space-DNu08Ce2.js";
import { T } from "./trash-2-EsqTj1ob.js";
import { S as x } from "./space-sequence-card-z9keCOTE.js";
import { b as p, o as A, q as B, t as $, v as j, w as q } from "./upload-asset-api-DAbIOMVJ.js";
const P = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M7 11h10", key: "1twpyw" }],
  ["path", { d: "M7 15h6", key: "d9of3u" }],
  ["path", { d: "M7 7h8", key: "af5zfr" }]
], E = b("message-square-text", P);
const I = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
], R = b("pen-line", I);
function Q({
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
  onDragOver: N,
  onDrop: k,
  onDragEnd: C
}) {
  const y = r.speech.filter((M) => M.text.trim()).length;
  return /* @__PURE__ */ t(
    x,
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
      onDragOver: N || H,
      onDrop: k || m,
      onDragEnd: C || m,
      headerActions: /* @__PURE__ */ a("span", { className: "ws-storyboard-card-count", children: y ? `${y} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ a(
          F,
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
              children: /* @__PURE__ */ a(R, { size: 13 })
            }
          ) }),
          o && c ? /* @__PURE__ */ a(p, { label: "复制镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: u(c),
              children: /* @__PURE__ */ a(L, { size: 13 })
            }
          ) }) : null,
          o && h ? /* @__PURE__ */ a(p, { label: "删除镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: u(h),
              children: /* @__PURE__ */ a(T, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function X({
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
          ] }),
          /* @__PURE__ */ a(
            S,
            {
              continues: r.continue_previous,
              matches: r.match_previous
            }
          )
        ] }),
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-description", children: r.beat || r.description || `镜头 ${n + 1}` }),
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ a(f, { shot: r, storyboard: s }) })
      ]
    }
  );
}
function F({ shot: r, storyboard: n }) {
  const s = r.speech.filter((c) => c.text.trim()), e = s[0], o = new Map(
    n.materials.filter((c) => c.type === "character").map((c) => [c.id, c.name])
  ), l = [...new Set(s.map(A))], i = B(r).length, d = $(r);
  return /* @__PURE__ */ t(g, { children: [
    /* @__PURE__ */ t("div", { className: "ws-storyboard-card-preview", children: [
      /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(
        S,
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
        /* @__PURE__ */ a(f, { shot: r, storyboard: n }),
        l.map((c) => /* @__PURE__ */ a("span", { children: c }, c)),
        i ? /* @__PURE__ */ t("span", { children: [
          i,
          " 条字幕"
        ] }) : null,
        d ? /* @__PURE__ */ a("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ a("p", { className: "ws-storyboard-card-camera", children: r.camera_instruction || "未设置镜头语言" }),
      e ? /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech", children: [
        e.kind === "dialogue" ? /* @__PURE__ */ a(_, { size: 12 }) : /* @__PURE__ */ a(z, { size: 12 }),
        /* @__PURE__ */ a("strong", { children: e.kind === "dialogue" ? o.get(e.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ a("span", { children: e.text })
      ] }) : /* @__PURE__ */ t("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ a(E, { size: 12 }),
        /* @__PURE__ */ a("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function f({
  shot: r,
  storyboard: n
}) {
  const s = /* @__PURE__ */ new Map();
  for (const e of j(n, r))
    s.set(e.type, (s.get(e.type) || 0) + 1);
  return s.size ? /* @__PURE__ */ a(g, { children: ["character", "scene", "prop"].map(
    (e) => s.get(e) ? /* @__PURE__ */ t("span", { children: [
      q[e],
      " ",
      s.get(e)
    ] }, e) : null
  ) }) : /* @__PURE__ */ a("span", { className: "is-empty", children: "无关联素材" });
}
function S({
  continues: r,
  matches: n
}) {
  const s = r || n;
  return /* @__PURE__ */ t(
    "span",
    {
      className: `ws-storyboard-continuity ${s ? "is-linked" : "is-cut"}`,
      children: [
        s ? /* @__PURE__ */ a(v, { size: 11 }) : /* @__PURE__ */ a(D, { size: 11 }),
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
function H(r) {
}
export {
  E as M,
  X as S,
  Q as a
};
