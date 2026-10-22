import { a, j as e } from "./react-D9GkiX5b.js";
import { a as $, u as N } from "./file-kind-D6bMOzYN.js";
import { r as f, C as M, n as P, H as k, y as _, O as x, j as D, Q as I } from "./vendor-icons-fVDtJt66.js";
import { l as R, m as B } from "./asset-preview-qznc7rjG.js";
import { S as j } from "./space-storyboard-shot-card-DbYv-26X.js";
import { S, a as F } from "./space-storyboard-workspace-C7WKL67O.js";
import { s as T } from "./space-ordered-list-BzuXThI0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-node-CVFkhBdp.css", import.meta.url).href]);
function E(r) {
  const o = m(r), n = m(m(o?.meta)?.storyboard_preview);
  if (n?.type !== "storyboard" || !Array.isArray(n.shots))
    return null;
  const p = [];
  for (const l of n.shots) {
    const s = m(l);
    if (!s || typeof s.id != "string" || !s.id.trim() || !Number.isInteger(s.order) || !Number.isFinite(s.duration) || Number(s.duration) <= 0 || typeof s.description != "string" || typeof s.beat != "string" || typeof s.camera_instruction != "string" || !Array.isArray(s.speech))
      continue;
    const y = [];
    for (const b of s.speech) {
      const i = m(b);
      i && typeof i.id == "string" && typeof i.text == "string" && (i.kind === "dialogue" || i.kind === "narration") && y.push({
        id: i.id,
        kind: i.kind,
        text: i.text,
        ...typeof i.character_id == "string" ? { character_id: i.character_id } : {}
      });
    }
    p.push({
      id: s.id,
      order: Number(s.order),
      duration: Number(s.duration),
      beat: s.beat,
      description: s.description,
      camera_instruction: s.camera_instruction,
      ...typeof s.start_framing == "string" ? { start_framing: s.start_framing } : {},
      speech: y
    });
  }
  const t = (Array.isArray(n.materials) ? n.materials : []).flatMap((l) => {
    const s = m(l);
    return s && typeof s.id == "string" && typeof s.name == "string" ? [{ id: s.id, name: s.name }] : [];
  });
  return {
    shots: p,
    materials: t,
    ...typeof n.title == "string" ? { title: n.title } : {},
    ...typeof n.aspect_ratio == "string" && /^\d+:\d+$/.test(n.aspect_ratio) ? { aspect_ratio: n.aspect_ratio } : {}
  };
}
function m(r) {
  return r && typeof r == "object" && !Array.isArray(r) ? r : null;
}
function G({
  output: r,
  status: o,
  completedShotCount: n = 0,
  targetShotCount: p = 0,
  workspace: t,
  onOpenDetail: l,
  onConfirm: s
}) {
  const [y, b] = $(
    S
  ), i = N(
    () => o !== "running" ? R(r) : null,
    [r, o]
  ), c = N(
    () => o === "running" ? E(r) : i,
    [r, o, i]
  ), A = N(() => {
    if (!i || !t) return /* @__PURE__ */ new Map();
    const d = t.groups.flatMap(
      (u) => u.results.map((g) => g.node.sourceNode)
    );
    return new Map(
      T(i, t.sourceNodeId, d).map(
        (u) => [u.shot.id, u]
      )
    );
  }, [i, t]);
  if (o === "running" && !c?.shots.length)
    return /* @__PURE__ */ a("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ e(f, { size: 22, className: "ws-spin" }),
      /* @__PURE__ */ e("strong", { children: z(
        c?.shots.length || n,
        p
      ) })
    ] });
  if (o === "error")
    return /* @__PURE__ */ e(
      w,
      {
        icon: /* @__PURE__ */ e(_, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (o === "empty")
    return /* @__PURE__ */ e(
      w,
      {
        icon: /* @__PURE__ */ e(x, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头卡片，详情中可以编辑"
      }
    );
  if (!c)
    return /* @__PURE__ */ e(
      w,
      {
        icon: /* @__PURE__ */ e(_, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: l
      }
    );
  const h = i ? B(i) : !1, v = c.shots.reduce(
    (d, u) => d + u.speech.filter((g) => g.text.trim()).length,
    0
  );
  return /* @__PURE__ */ a("section", { className: `ws-storyboard-node is-${o}`, children: [
    /* @__PURE__ */ a("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ a("div", { className: "ws-storyboard-node-summary-copy", children: [
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ e("strong", { children: c.title || "分镜脚本" }),
          /* @__PURE__ */ a(
            "span",
            {
              className: `ws-storyboard-node-complete${h ? "" : " is-draft"}`,
              children: [
                o === "running" ? /* @__PURE__ */ e(f, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(M, { size: 14 }),
                o === "running" ? "正在生成" : h ? "已确认" : "草稿"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ a("span", { children: [
          c.shots.length,
          " 个镜头 ·",
          " ",
          c.shots.reduce((d, u) => d + u.duration, 0),
          " ",
          "秒",
          v > 0 ? ` · ${v} 条语音` : ""
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "ws-storyboard-node-summary-actions", children: [
        t && o !== "running" ? /* @__PURE__ */ e(L, { data: t }) : null,
        l ? /* @__PURE__ */ e(
          C,
          {
            onOpenDetail: () => l(y)
          }
        ) : null,
        o !== "running" && !h && s ? /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button is-primary nodrag nopan",
            onMouseDown: (d) => d.stopPropagation(),
            onClick: (d) => {
              d.preventDefault(), d.stopPropagation(), s();
            },
            children: [
              /* @__PURE__ */ e(P, { size: 13 }),
              /* @__PURE__ */ e("span", { children: "确认脚本" })
            ]
          }
        ) : null
      ] })
    ] }),
    o === "running" ? /* @__PURE__ */ a("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(f, { size: 13, className: "ws-spin" }),
      /* @__PURE__ */ e("span", { children: z(
        c?.shots.length || n,
        p
      ) })
    ] }) : null,
    t?.running ? /* @__PURE__ */ a("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(f, { size: 13, className: "ws-spin" }),
      /* @__PURE__ */ a("span", { children: [
        t.executionStatus,
        t.currentNodeTitle ? ` · ${t.currentNodeTitle}` : ""
      ] }),
      /* @__PURE__ */ a("strong", { children: [
        t.completedCount,
        "/",
        t.workNodeCount,
        " 已完成"
      ] })
    ] }) : null,
    /* @__PURE__ */ e(
      F,
      {
        activeSectionId: y,
        groups: t?.groups || [],
        scriptMeta: `${c.shots.length} 个镜头`,
        scriptContent: /* @__PURE__ */ e("div", { className: "ws-storyboard-node-body nowheel", children: /* @__PURE__ */ e("div", { className: "ws-storyboard-node-cards", children: c.shots.map((d) => /* @__PURE__ */ e(
          j,
          {
            shot: d,
            index: d.order - 1,
            storyboard: c,
            frame: A.get(d.id),
            onOpen: l ? () => l(S, {
              section: "shots",
              shotId: d.id
            }) : void 0
          },
          d.id
        )) }) }),
        renderNode: t?.renderNode || W,
        onActiveSectionChange: b
      }
    )
  ] });
}
function L({
  data: r
}) {
  if (r.running)
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "ws-storyboard-workspace-run is-stop nodrag nopan",
        "aria-label": "停止制作区执行",
        title: "停止制作区执行",
        disabled: r.stopping || !r.onStop,
        onMouseDown: (n) => n.stopPropagation(),
        onClick: (n) => {
          n.preventDefault(), n.stopPropagation(), r.onStop?.();
        },
        children: [
          r.stopping ? /* @__PURE__ */ e(f, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(k, { size: 12, fill: "currentColor" }),
          /* @__PURE__ */ e("span", { children: r.stopping ? "停止中" : "停止" })
        ]
      }
    );
  const o = r.workNodeCount > 0 && r.completedCount >= r.workNodeCount;
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "ws-storyboard-workspace-run nodrag nopan",
      "aria-label": r.runBlockedReason || "执行制作区",
      disabled: !!r.runBlockedReason,
      title: r.runBlockedReason || void 0,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), r.onRun();
      },
      children: [
        /* @__PURE__ */ e(D, { size: 13, fill: "currentColor" }),
        /* @__PURE__ */ e("span", { children: o ? "重新制作" : "开始制作" })
      ]
    }
  );
}
function W() {
  return null;
}
function z(r, o) {
  return o > 0 && r >= o ? `已完成 ${r} / ${o} 个镜头，正在整理脚本` : r > 0 && o > 0 ? `已完成 ${r} / ${o} 个镜头，正在继续` : r > 0 ? `已完成 ${r} 个镜头，正在继续` : o > 0 ? `分镜规划完成，共 ${o} 个分镜` : "正在规划分镜";
}
function w({
  icon: r,
  title: o,
  description: n,
  tone: p = "default",
  onOpenDetail: t
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      className: `ws-storyboard-node-state is-${p}`,
      role: p === "error" ? "alert" : void 0,
      children: [
        /* @__PURE__ */ e("span", { className: "ws-storyboard-node-state-icon", children: r }),
        /* @__PURE__ */ e("strong", { children: o }),
        /* @__PURE__ */ e("span", { children: n }),
        t ? /* @__PURE__ */ e(C, { label: "打开详情", onOpenDetail: t }) : null
      ]
    }
  );
}
function C({
  label: r = "打开完整分镜",
  onOpenDetail: o
}) {
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "ws-storyboard-detail-button nodrag nopan",
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), o();
      },
      children: [
        /* @__PURE__ */ e(I, { size: 13 }),
        /* @__PURE__ */ e("span", { children: r })
      ]
    }
  );
}
export {
  G as StoryboardNodeContent
};
