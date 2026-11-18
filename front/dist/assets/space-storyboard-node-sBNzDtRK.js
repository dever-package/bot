import { a as s, j as e, S as O } from "./space-storyboard-material-ECvLpyk_.js";
import { a as R, b as F, d as W, u as _ } from "./file-kind-Cq3pESGF.js";
import { a3 as B, a4 as $, r as h, w as P, y as D, c as Y, j as T, C as G, n as U, a5 as V } from "./vendor-icons-BZHLe0mm.js";
import { c as q, p as K, i as H } from "./asset-preview-Bb3VoJnt.js";
import { S as J, a as Q } from "./space-storyboard-material-dialog-Bh12SKvW.js";
import { u as X, d as Z, a as I, b as k } from "./space-storyboard-workspace-D4am3NFT.js";
import { s as nn, d as en } from "./writing-reference-Bgk4pNta.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-node-B3IF2nK4.css", import.meta.url).href]);
function tn(n) {
  const t = v(n), r = v(v(t?.meta)?.storyboard_preview);
  if (r?.type !== "storyboard" || !Array.isArray(r.shots))
    return null;
  const g = [];
  for (const u of r.shots) {
    const o = v(u);
    if (!o || typeof o.id != "string" || !o.id.trim() || !Number.isInteger(o.order) || !Number.isFinite(o.duration) || Number(o.duration) <= 0 || typeof o.description != "string" || typeof o.beat != "string" || typeof o.camera_instruction != "string" || !Array.isArray(o.speech))
      continue;
    const y = [];
    for (const p of o.speech) {
      const d = v(p);
      d && typeof d.id == "string" && typeof d.text == "string" && (d.kind === "dialogue" || d.kind === "narration") && y.push({
        id: d.id,
        kind: d.kind,
        text: d.text,
        ...typeof d.character_id == "string" ? { character_id: d.character_id } : {}
      });
    }
    g.push({
      id: o.id,
      order: Number(o.order),
      duration: Number(o.duration),
      beat: o.beat,
      description: o.description,
      camera_instruction: o.camera_instruction,
      ...typeof o.start_framing == "string" ? { start_framing: o.start_framing } : {},
      speech: y
    });
  }
  const i = (Array.isArray(r.materials) ? r.materials : []).flatMap((u) => {
    const o = v(u);
    return o && typeof o.id == "string" && typeof o.name == "string" ? [{ id: o.id, name: o.name }] : [];
  });
  return {
    shots: g,
    materials: i,
    ...typeof r.title == "string" ? { title: r.title } : {},
    ...typeof r.aspect_ratio == "string" && /^\d+:\d+$/.test(r.aspect_ratio) ? { aspect_ratio: r.aspect_ratio } : {}
  };
}
function v(n) {
  return n && typeof n == "object" && !Array.isArray(n) ? n : null;
}
const rn = ["character", "scene", "prop"];
function yn({ workspace: n, readonly: t, node: r, onOpenDetail: g }) {
  const [i, u] = R(null), [o, y] = R(!1), [p, d] = R(""), c = nn(r), l = n?.groups || [], w = !!n?.running, S = t || w ? void 0 : r.onReplaceSettingImage, { selectedNodeId: z, openResult: a, editor: b } = X(
    l.flatMap((m) => m.results),
    S
  ), f = n ? n.workNodeCount - n.completedCount : 0, L = async (m, j) => {
    if (c) {
      y(!0), d("");
      try {
        await r.onSettingMaterials(r.id, j ? [...c.materials, m] : c.materials.map((C) => C.id === m.id ? m : C)), u(null);
      } catch (C) {
        d(C instanceof Error ? C.message : "保存设定失败");
      } finally {
        y(!1);
      }
    }
  }, N = w ? { text: n?.currentNodeTitle ? `正在生成 ${n.currentNodeTitle}…` : "正在生成形象…", tone: "running" } : p ? { text: p, tone: "error" } : n?.runBlockedReason && f > 0 ? { text: n.runBlockedReason, tone: "muted" } : null;
  return /* @__PURE__ */ s("section", { className: "ws-story-setting nodrag-content", "aria-label": "设定", children: [
    /* @__PURE__ */ s("header", { className: "ws-story-setting-header", children: [
      /* @__PURE__ */ s("span", { className: "ws-story-setting-title", children: [
        /* @__PURE__ */ e(B, { size: 15, "aria-hidden": "true" }),
        /* @__PURE__ */ e("strong", { children: "设定" }),
        n && n.workNodeCount > 0 ? /* @__PURE__ */ s("small", { children: [
          n.completedCount,
          "/",
          n.workNodeCount,
          " 已生成"
        ] }) : null
      ] }),
      /* @__PURE__ */ s("span", { className: "ws-story-setting-actions", children: [
        n ? /* @__PURE__ */ e(on, { workspace: n, groups: l, pending: f, readonly: t }) : null,
        g && (c || n) ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onMouseDown: (m) => m.stopPropagation(),
            onClick: A(g),
            children: [
              /* @__PURE__ */ e($, { size: 13 }),
              /* @__PURE__ */ e("span", { children: "查看详情" })
            ]
          }
        ) : null
      ] })
    ] }),
    N ? /* @__PURE__ */ s("p", { className: `ws-story-setting-status is-${N.tone}`, role: N.tone === "error" ? "alert" : "status", children: [
      N.tone === "running" ? /* @__PURE__ */ e(h, { size: 12, className: "ws-spin" }) : null,
      N.tone === "error" ? /* @__PURE__ */ e(P, { size: 12 }) : null,
      /* @__PURE__ */ e("span", { children: N.text })
    ] }) : null,
    !c && !n ? /* @__PURE__ */ s("div", { className: "ws-story-setting-empty", children: [
      /* @__PURE__ */ e(B, { size: 20, "aria-hidden": "true" }),
      /* @__PURE__ */ e("strong", { children: "还没有设定" }),
      /* @__PURE__ */ e("span", { children: "在下方描述人物、场景和道具，AI 会整理设定并生成形象" })
    ] }) : /* @__PURE__ */ e(
      Z,
      {
        groups: l,
        variant: "canvas",
        mediaAspect: c?.aspect_ratio,
        renderNode: n?.renderNode || (() => null),
        selectedNodeId: z,
        onOpenResult: a,
        materials: c?.materials,
        materialActions: c && !t ? {
          disabled: w || o,
          onEdit: (m) => u({ material: m, creating: !1 }),
          onAdd: (m) => u({ material: q(c.materials, m), creating: !0 })
        } : void 0
      }
    ),
    i && c ? /* @__PURE__ */ e(
      J,
      {
        material: i.material,
        creating: i.creating,
        readonly: t || o,
        context: "setting",
        loadVoiceOptions: r.onLoadVoiceOptions,
        existingNames: c.materials.filter((m) => m.id !== i.material.id).map((m) => m.name),
        onClose: () => u(null),
        onSave: (m) => {
          L(m, i.creating);
        }
      }
    ) : null,
    b
  ] });
}
function on({ workspace: n, groups: t, pending: r, readonly: g }) {
  const [i, u] = R(!1), o = F(null);
  if (W(() => {
    if (!i) return;
    const p = (d) => {
      o.current?.contains(d.target) || u(!1);
    };
    return document.addEventListener("pointerdown", p, !0), () => document.removeEventListener("pointerdown", p, !0);
  }, [i]), n.running)
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action nodrag nopan",
        disabled: g || n.stopping || !n.onStop,
        onClick: A(() => n.onStop?.()),
        children: [
          n.stopping ? /* @__PURE__ */ e(h, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(D, { size: 11, fill: "currentColor" }),
          n.stopping ? "停止中" : "停止"
        ]
      }
    );
  if (r > 0)
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action is-primary nodrag nopan",
        disabled: g || !!n.runBlockedReason,
        title: n.runBlockedReason || void 0,
        onClick: A(n.onRun),
        children: [
          /* @__PURE__ */ e(T, { size: 11, fill: "currentColor" }),
          "生成形象"
        ]
      }
    );
  const y = rn.flatMap((p) => {
    const d = t.find((c) => c.materialType === p)?.onRun;
    return d ? [{ type: p, onRun: d }] : [];
  });
  return y.length === 0 ? null : /* @__PURE__ */ s("div", { ref: o, className: "ws-setting-gallery-menu nodrag nopan", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action",
        disabled: g,
        "aria-expanded": i,
        onClick: A(() => u((p) => !p)),
        children: [
          "重新生成",
          /* @__PURE__ */ e(Y, { size: 12 })
        ]
      }
    ),
    i ? /* @__PURE__ */ e("div", { role: "menu", children: y.map(({ type: p, onRun: d }) => /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: A(() => {
          u(!1), d();
        }),
        children: [
          "重做全部",
          O[p]
        ]
      },
      p
    )) }) : null
  ] });
}
function A(n) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), n();
  };
}
function bn({
  output: n,
  status: t,
  completedShotCount: r = 0,
  targetShotCount: g = 0,
  workspace: i,
  onOpenDetail: u,
  onConfirm: o,
  onRegenerateScreenplay: y
}) {
  const [p, d] = R(
    I
  ), c = _(
    () => t !== "running" ? K(n) : null,
    [n, t]
  ), l = _(
    () => t === "running" ? tn(n) : c,
    [n, t, c]
  ), w = _(() => {
    if (!c || !i) return /* @__PURE__ */ new Map();
    const a = i.groups.flatMap(
      (b) => b.results.map((f) => f.node.sourceNode)
    );
    return new Map(
      en(c, i.sourceNodeId, a).map(
        (b) => [b.shot.id, b]
      )
    );
  }, [c, i]);
  if (t === "running" && !l?.shots.length)
    return /* @__PURE__ */ s("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ e(h, { size: 22, className: "ws-spin" }),
      /* @__PURE__ */ e("strong", { children: E(
        l?.shots.length || r,
        g
      ) })
    ] });
  if (t === "error")
    return /* @__PURE__ */ e(
      M,
      {
        icon: /* @__PURE__ */ e(P, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (t === "empty")
    return /* @__PURE__ */ e(
      M,
      {
        icon: /* @__PURE__ */ e(V, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头卡片，详情中可以编辑"
      }
    );
  if (!l)
    return /* @__PURE__ */ e(
      M,
      {
        icon: /* @__PURE__ */ e(P, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: u
      }
    );
  if (l.screenplay && !l.shots.length)
    return /* @__PURE__ */ s("section", { className: "ws-storyboard-node", children: [
      /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
        /* @__PURE__ */ s("strong", { children: [
          l.title,
          " · 剧本"
        ] }),
        /* @__PURE__ */ s("span", { children: [
          l.screenplay.parts.length,
          " 场"
        ] })
      ] }),
      /* @__PURE__ */ e("div", { style: { padding: 16, whiteSpace: "pre-wrap" }, children: l.screenplay.parts.map((a) => a.title + `
` + a.description).join(`

`) }),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-actions", children: [
        u && /* @__PURE__ */ e(x, { onOpenDetail: () => u() }),
        y && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onClick: (a) => {
              a.stopPropagation(), y();
            },
            children: l.screenplay ? "重做剧本" : "重做分镜"
          }
        ),
        o && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button is-primary nodrag nopan",
            onClick: (a) => {
              a.stopPropagation(), o();
            },
            children: "继续生成分镜"
          }
        )
      ] })
    ] });
  const S = c ? H(c) : !1, z = l.shots.reduce(
    (a, b) => a + b.speech.filter((f) => f.text.trim()).length,
    0
  );
  return /* @__PURE__ */ s("section", { className: `ws-storyboard-node is-${t}`, children: [
    /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-copy", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("strong", { children: l.title || "分镜脚本" }),
          /* @__PURE__ */ s(
            "span",
            {
              className: `ws-storyboard-node-complete${S ? "" : " is-draft"}`,
              children: [
                t === "running" ? /* @__PURE__ */ e(h, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(G, { size: 14 }),
                t === "running" ? "正在生成" : S ? "已确认" : "草稿"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ s("span", { children: [
          l.shots.length,
          " 个镜头 ·",
          " ",
          l.shots.reduce((a, b) => a + b.duration, 0),
          " ",
          "秒",
          z > 0 ? ` · ${z} 条语音` : ""
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-actions", children: [
        l.screenplay && y && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onClick: (a) => {
              a.stopPropagation(), y();
            },
            children: l.screenplay ? "重做剧本" : "重做分镜"
          }
        ),
        i && t !== "running" ? /* @__PURE__ */ e(sn, { data: i }) : null,
        u ? /* @__PURE__ */ e(
          x,
          {
            onOpenDetail: () => u(p)
          }
        ) : null,
        t !== "running" && !S && o ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button is-primary nodrag nopan",
            onMouseDown: (a) => a.stopPropagation(),
            onClick: (a) => {
              a.preventDefault(), a.stopPropagation(), o();
            },
            children: [
              /* @__PURE__ */ e(U, { size: 13 }),
              /* @__PURE__ */ e("span", { children: "确认脚本" })
            ]
          }
        ) : null
      ] })
    ] }),
    t === "running" ? /* @__PURE__ */ s("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(h, { size: 13, className: "ws-spin" }),
      /* @__PURE__ */ e("span", { children: E(
        l?.shots.length || r,
        g
      ) })
    ] }) : null,
    i?.running ? /* @__PURE__ */ s("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(h, { size: 13, className: "ws-spin" }),
      /* @__PURE__ */ s("span", { children: [
        i.executionStatus,
        i.currentNodeTitle ? ` · ${i.currentNodeTitle}` : ""
      ] }),
      /* @__PURE__ */ s("strong", { children: [
        i.completedCount,
        "/",
        i.workNodeCount,
        " 已完成"
      ] })
    ] }) : null,
    /* @__PURE__ */ e(
      k,
      {
        activeSectionId: p,
        groups: i?.groups || [],
        settingSource: i?.settingSource,
        scriptMeta: `${l.shots.length} 个镜头`,
        mediaAspect: l.aspect_ratio,
        scriptContent: /* @__PURE__ */ e("div", { className: "ws-storyboard-node-body nowheel", children: /* @__PURE__ */ e("div", { className: "ws-storyboard-node-cards", children: l.shots.map((a) => /* @__PURE__ */ e(
          Q,
          {
            shot: a,
            index: a.order - 1,
            storyboard: l,
            frame: w.get(a.id),
            onOpen: u ? () => u(I, {
              section: "shots",
              shotId: a.id
            }) : void 0
          },
          a.id
        )) }) }),
        renderNode: i?.renderNode || an,
        onActiveSectionChange: d
      }
    )
  ] });
}
function sn({
  data: n
}) {
  if (n.running)
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-storyboard-workspace-run is-stop nodrag nopan",
        "aria-label": "停止制作区执行",
        title: "停止制作区执行",
        disabled: n.stopping || !n.onStop,
        onMouseDown: (r) => r.stopPropagation(),
        onClick: (r) => {
          r.preventDefault(), r.stopPropagation(), n.onStop?.();
        },
        children: [
          n.stopping ? /* @__PURE__ */ e(h, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(D, { size: 12, fill: "currentColor" }),
          /* @__PURE__ */ e("span", { children: n.stopping ? "停止中" : "停止" })
        ]
      }
    );
  const t = n.workNodeCount > 0 && n.completedCount >= n.workNodeCount;
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-workspace-run nodrag nopan",
      "aria-label": n.runBlockedReason || "执行制作区",
      disabled: !!n.runBlockedReason,
      title: n.runBlockedReason || void 0,
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), n.onRun();
      },
      children: [
        /* @__PURE__ */ e(T, { size: 13, fill: "currentColor" }),
        /* @__PURE__ */ e("span", { children: t ? "重新制作" : "开始制作" })
      ]
    }
  );
}
function an() {
  return null;
}
function E(n, t) {
  return t > 0 && n >= t ? `已完成 ${n} / ${t} 个镜头，正在整理脚本` : n > 0 && t > 0 ? `已完成 ${n} / ${t} 个镜头，正在继续` : n > 0 ? `已完成 ${n} 个镜头，正在继续` : t > 0 ? `分镜规划完成，共 ${t} 个分镜` : "正在规划分镜";
}
function M({
  icon: n,
  title: t,
  description: r,
  tone: g = "default",
  onOpenDetail: i
}) {
  return /* @__PURE__ */ s(
    "div",
    {
      className: `ws-storyboard-node-state is-${g}`,
      role: g === "error" ? "alert" : void 0,
      children: [
        /* @__PURE__ */ e("span", { className: "ws-storyboard-node-state-icon", children: n }),
        /* @__PURE__ */ e("strong", { children: t }),
        /* @__PURE__ */ e("span", { children: r }),
        i ? /* @__PURE__ */ e(x, { label: "打开详情", onOpenDetail: i }) : null
      ]
    }
  );
}
function x({
  label: n = "打开完整分镜",
  onOpenDetail: t
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-detail-button nodrag nopan",
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), t();
      },
      children: [
        /* @__PURE__ */ e($, { size: 13 }),
        /* @__PURE__ */ e("span", { children: n })
      ]
    }
  );
}
export {
  yn as StorySettingNodeContent,
  bn as StoryboardNodeContent
};
