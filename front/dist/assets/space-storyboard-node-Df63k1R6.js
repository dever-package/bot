import { a as s, j as e, S as H } from "./preloadable-CbkzeflN.js";
import { a as w, b as J, d as K, u as G } from "./file-kind-X0KKJPkQ.js";
import { a3 as V, a4 as W, r as A, x as E, z as q, c as Q, j as U, C as X, n as Z, a5 as k } from "./vendor-icons-B1zF1_4n.js";
import { x as nn, p as en, y as tn } from "./asset-audio-preview-DlcU6JQ0.js";
import { S as rn, a as on } from "./space-storyboard-material-dialog-DGClkQIy.js";
import { u as sn, d as an, b as ln, c as dn, a as Y } from "./space-storyboard-workspace-D7SRlGZK.js";
import { s as cn } from "./space-content-view-BelgOwBR.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-node-CzwekqtD.css", import.meta.url).href]);
function un(n) {
  const t = R(n), r = R(R(t?.meta)?.storyboard_preview);
  if (r?.type !== "storyboard" || !Array.isArray(r.shots))
    return null;
  const g = [];
  for (const u of r.shots) {
    const o = R(u);
    if (!o || typeof o.id != "string" || !o.id.trim() || !Number.isInteger(o.order) || !Number.isFinite(o.duration) || Number(o.duration) <= 0 || typeof o.description != "string" || typeof o.beat != "string" || typeof o.camera_instruction != "string" || !Array.isArray(o.speech))
      continue;
    const d = [];
    for (const m of o.speech) {
      const c = R(m);
      c && typeof c.id == "string" && typeof c.text == "string" && (c.kind === "dialogue" || c.kind === "narration") && d.push({
        id: c.id,
        kind: c.kind,
        text: c.text,
        ...typeof c.character_id == "string" ? { character_id: c.character_id } : {}
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
      speech: d
    });
  }
  const i = (Array.isArray(r.materials) ? r.materials : []).flatMap((u) => {
    const o = R(u);
    return o && typeof o.id == "string" && typeof o.name == "string" ? [{ id: o.id, name: o.name }] : [];
  });
  return {
    shots: g,
    materials: i,
    ...typeof r.title == "string" ? { title: r.title } : {},
    ...typeof r.aspect_ratio == "string" && /^\d+:\d+$/.test(r.aspect_ratio) ? { aspect_ratio: r.aspect_ratio } : {}
  };
}
function R(n) {
  return n && typeof n == "object" && !Array.isArray(n) ? n : null;
}
const pn = ["character", "scene", "prop"];
function Rn({ workspace: n, readonly: t, node: r, onOpenDetail: g }) {
  const [i, u] = w(null), [o, d] = w(!1), [m, c] = w(""), y = cn(r), b = n?.groups || [], p = !!n?.running, h = t || p ? void 0 : r.onReplaceSettingImage, { selectedNodeId: _, openResult: M, editor: P } = sn(
    b.flatMap((l) => l.results),
    h
  ), T = n ? n.workNodeCount - n.completedCount : 0, B = async (l, z) => {
    if (y) {
      d(!0), c("");
      try {
        await r.onSettingMaterials(r.id, z ? [...y.materials, l] : y.materials.map((v) => v.id === l.id ? l : v)), u(null);
      } catch (v) {
        c(v instanceof Error ? v.message : "保存设定失败");
      } finally {
        d(!1);
      }
    }
  }, f = p ? { text: n?.currentNodeTitle ? `正在生成 ${n.currentNodeTitle}…` : "正在生成形象…", tone: "running" } : m ? { text: m, tone: "error" } : n?.runBlockedReason && T > 0 ? { text: n.runBlockedReason, tone: "muted" } : null;
  return /* @__PURE__ */ s("section", { className: "ws-story-setting nodrag-content", "aria-label": "设定", children: [
    /* @__PURE__ */ s("header", { className: "ws-story-setting-header", children: [
      /* @__PURE__ */ s("span", { className: "ws-story-setting-title", children: [
        /* @__PURE__ */ e(V, { size: 15, "aria-hidden": "true" }),
        /* @__PURE__ */ e("strong", { children: "设定" }),
        n && n.workNodeCount > 0 ? /* @__PURE__ */ s("small", { children: [
          n.completedCount,
          "/",
          n.workNodeCount,
          " 已生成"
        ] }) : null
      ] }),
      /* @__PURE__ */ s("span", { className: "ws-story-setting-actions", children: [
        n ? /* @__PURE__ */ e(mn, { workspace: n, groups: b, pending: T, readonly: t }) : null,
        g && (y || n) ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onMouseDown: (l) => l.stopPropagation(),
            onClick: C(g),
            children: [
              /* @__PURE__ */ e(W, { size: 13 }),
              /* @__PURE__ */ e("span", { children: "查看详情" })
            ]
          }
        ) : null
      ] })
    ] }),
    f ? /* @__PURE__ */ s("p", { className: `ws-story-setting-status is-${f.tone}`, role: f.tone === "error" ? "alert" : "status", children: [
      f.tone === "running" ? /* @__PURE__ */ e(A, { size: 12, className: "ws-spin" }) : null,
      f.tone === "error" ? /* @__PURE__ */ e(E, { size: 12 }) : null,
      /* @__PURE__ */ e("span", { children: f.text })
    ] }) : null,
    !y && !n ? /* @__PURE__ */ s("div", { className: "ws-story-setting-empty", children: [
      /* @__PURE__ */ e(V, { size: 20, "aria-hidden": "true" }),
      /* @__PURE__ */ e("strong", { children: "还没有设定" }),
      /* @__PURE__ */ e("span", { children: "在下方描述人物、场景和道具，AI 会整理设定并生成形象" })
    ] }) : /* @__PURE__ */ e(
      an,
      {
        groups: b,
        variant: "canvas",
        renderNode: n?.renderNode || (() => null),
        selectedNodeId: _,
        onOpenResult: M,
        onReferenceResult: t ? void 0 : n?.onReferenceResult,
        materials: y?.materials,
        materialActions: y && !t ? {
          disabled: p || o,
          onEdit: (l) => u({ material: l, creating: !1 }),
          onAdd: (l) => u({ material: nn(y.materials, l), creating: !0 })
        } : void 0
      }
    ),
    i && y ? /* @__PURE__ */ e(
      rn,
      {
        material: i.material,
        creating: i.creating,
        readonly: t || o,
        context: "setting",
        loadVoiceOptions: r.onLoadVoiceOptions,
        existingNames: y.materials.filter((l) => l.id !== i.material.id).map((l) => l.name),
        onClose: () => u(null),
        onSave: (l) => {
          B(l, i.creating);
        }
      }
    ) : null,
    P
  ] });
}
function mn({ workspace: n, groups: t, pending: r, readonly: g }) {
  const [i, u] = w(!1), o = J(null);
  if (K(() => {
    if (!i) return;
    const m = (c) => {
      o.current?.contains(c.target) || u(!1);
    };
    return document.addEventListener("pointerdown", m, !0), () => document.removeEventListener("pointerdown", m, !0);
  }, [i]), n.running)
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action nodrag nopan",
        disabled: g || n.stopping || !n.onStop,
        onClick: C(() => n.onStop?.()),
        children: [
          n.stopping ? /* @__PURE__ */ e(A, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(q, { size: 11, fill: "currentColor" }),
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
        onClick: C(n.onRun),
        children: [
          /* @__PURE__ */ e(U, { size: 11, fill: "currentColor" }),
          "生成形象"
        ]
      }
    );
  const d = pn.flatMap((m) => {
    const c = t.find((y) => y.materialType === m)?.onRun;
    return c ? [{ type: m, onRun: c }] : [];
  });
  return d.length === 0 ? null : /* @__PURE__ */ s("div", { ref: o, className: "ws-setting-gallery-menu nodrag nopan", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-setting-gallery-action",
        disabled: g,
        "aria-expanded": i,
        onClick: C(() => u((m) => !m)),
        children: [
          "重新生成",
          /* @__PURE__ */ e(Q, { size: 12 })
        ]
      }
    ),
    i ? /* @__PURE__ */ e("div", { role: "menu", children: d.map(({ type: m, onRun: c }) => /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: C(() => {
          u(!1), c();
        }),
        children: [
          "重做全部",
          H[m]
        ]
      },
      m
    )) }) : null
  ] });
}
function C(n) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), n();
  };
}
function An({
  output: n,
  status: t,
  completedShotCount: r = 0,
  targetShotCount: g = 0,
  workspace: i,
  onOpenDetail: u,
  onConfirm: o,
  scriptEditContext: d,
  onRegenerateScreenplay: m
}) {
  const [c, y] = w(
    ln
  ), b = G(
    () => t !== "running" ? en(n) : null,
    [n, t]
  ), p = G(
    () => t === "running" ? un(n) : b,
    [n, t, b]
  ), [h, _] = w(!1), [M, P] = w(""), T = async (a, N) => {
    if (!d) return;
    const { onSaved: S, ...I } = d, { editCanvasStoryboardScript: D } = await import("./space-storyboard-shot-request-BudkUmzN.js").then(($) => $.a);
    S(await D({ ...I, edit: { mode: "shot", shotId: a, instruction: N } }));
  }, B = async (a, N) => {
    if (!d) return;
    const { onSaved: S, ...I } = d, { editCanvasStoryboardScript: D } = await import("./space-storyboard-shot-request-BudkUmzN.js").then(($) => $.a);
    S(await D({ ...I, edit: { mode: "save", previous: N, storyboard: a } }));
  }, f = async () => {
    if (!(!d || h)) {
      _(!0), P("");
      try {
        const { onSaved: a, ...N } = d, { editCanvasStoryboardScript: S } = await import("./space-storyboard-shot-request-BudkUmzN.js").then((I) => I.a);
        a(await S({ ...N, edit: { mode: "revision" } }));
      } catch (a) {
        P(a instanceof Error ? a.message : "创建分镜修订稿失败");
      } finally {
        _(!1);
      }
    }
  };
  if (t === "running" && !p?.shots.length)
    return /* @__PURE__ */ s("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ e(A, { size: 22, className: "ws-spin" }),
      /* @__PURE__ */ e("strong", { children: F(
        p?.shots.length || r,
        g
      ) })
    ] });
  if (t === "error")
    return /* @__PURE__ */ e(
      L,
      {
        icon: /* @__PURE__ */ e(E, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (t === "empty")
    return /* @__PURE__ */ e(
      L,
      {
        icon: /* @__PURE__ */ e(k, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头描述"
      }
    );
  if (!p)
    return /* @__PURE__ */ e(
      L,
      {
        icon: /* @__PURE__ */ e(E, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: u
      }
    );
  if (p.screenplay && !p.shots.length)
    return /* @__PURE__ */ s("section", { className: "ws-storyboard-node", children: [
      /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
        /* @__PURE__ */ s("strong", { children: [
          p.title,
          " · 剧本"
        ] }),
        /* @__PURE__ */ s("span", { children: [
          p.screenplay.parts.length,
          " 场"
        ] })
      ] }),
      /* @__PURE__ */ e("div", { style: { padding: 16, whiteSpace: "pre-wrap" }, children: p.screenplay.parts.map((a) => a.title + `
` + a.description).join(`

`) }),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-actions", children: [
        u && /* @__PURE__ */ e(j, { onOpenDetail: () => u() }),
        m && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onClick: (a) => {
              a.stopPropagation(), m();
            },
            children: p.screenplay ? "重做剧本" : "重做分镜"
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
  const l = b ? tn(b) : !1, z = !!(d && t === "complete" && !l && !i?.running), v = d?.node.resultRef?.asset_id || d?.node.asset?.id, x = d?.node.resultRef?.version_id || d?.node.asset?.version_id, O = p.shots.reduce(
    (a, N) => a + N.speech.filter((S) => S.text.trim()).length,
    0
  );
  return /* @__PURE__ */ s("section", { className: `ws-storyboard-node is-${t}`, children: [
    /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-copy", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ e("strong", { children: p.title || "分镜脚本" }),
          t !== "running" ? /* @__PURE__ */ s("span", { className: `ws-storyboard-node-complete${l ? "" : " is-draft"}`, children: [
            l ? /* @__PURE__ */ e(X, { size: 14 }) : null,
            l ? "已确认" : "草稿"
          ] }) : null
        ] }),
        /* @__PURE__ */ s("span", { children: [
          p.shots.length,
          " 个镜头 ·",
          " ",
          p.shots.reduce((a, N) => a + N.duration, 0),
          " ",
          "秒",
          O > 0 ? ` · ${O} 条语音` : ""
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-actions", children: [
        p.screenplay && m && !h && /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button nodrag nopan",
            onClick: (a) => {
              a.stopPropagation(), m();
            },
            children: "重做剧本"
          }
        ),
        i && t !== "running" ? /* @__PURE__ */ e(gn, { data: i }) : null,
        u && !h ? /* @__PURE__ */ e(
          j,
          {
            onOpenDetail: () => u()
          }
        ) : null,
        t !== "running" && !l && o ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            disabled: h,
            "aria-label": "确认脚本",
            className: "ws-storyboard-detail-button is-primary nodrag nopan",
            onMouseDown: (a) => a.stopPropagation(),
            onClick: (a) => {
              a.preventDefault(), a.stopPropagation(), o();
            },
            children: [
              /* @__PURE__ */ e(Z, { size: 13 }),
              /* @__PURE__ */ e("span", { children: "确认脚本" })
            ]
          }
        ) : null
      ] })
    ] }),
    t === "running" ? /* @__PURE__ */ s("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(A, { size: 13, className: "ws-spin" }),
      /* @__PURE__ */ e("span", { children: F(
        p?.shots.length || r,
        g
      ) })
    ] }) : null,
    i?.running ? /* @__PURE__ */ s("div", { className: "ws-storyboard-node-production-status", role: "status", children: [
      /* @__PURE__ */ e(A, { size: 13, className: "ws-spin" }),
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
      dn,
      {
        activeSectionId: c,
        groups: i?.groups || [],
        settingSource: i?.settingSource,
        onReferenceResult: i?.onReferenceResult,
        settings: i?.settingSource ? void 0 : {
          materials: b?.materials,
          materialActions: z && u ? {
            disabled: h,
            onEdit: (a) => u(Y, { section: "materials", materialType: a.type, materialId: a.id }),
            onAdd: (a) => u(Y, { section: "materials", materialType: a, addMaterial: !0 })
          } : void 0
        },
        mediaAspect: p.aspect_ratio,
        scriptContent: /* @__PURE__ */ s("div", { className: "ws-storyboard-node-body nowheel", children: [
          /* @__PURE__ */ e(
            on,
            {
              shots: p.shots,
              storyboard: b || void 0,
              groups: i?.groups,
              promptVersion: d && v && x ? {
                projectId: d.projectId,
                assetId: v,
                versionId: x
              } : void 0,
              onSave: z ? B : void 0,
              onGenerate: z ? T : void 0,
              onCreateRevision: l && !i?.running && d ? f : void 0,
              disabled: h,
              onBusyChange: _
            }
          ),
          l && !i?.running && d ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "ws-storyboard-shot-action ws-storyboard-revision-button nodrag nopan",
              disabled: h,
              onClick: () => {
                f();
              },
              children: h ? "创建中" : "创建修订稿"
            }
          ) : null,
          M ? /* @__PURE__ */ e("p", { className: "ws-storyboard-shot-list-error", role: "alert", children: M }) : null
        ] }),
        renderNode: i?.renderNode || yn,
        onActiveSectionChange: y
      }
    )
  ] });
}
function gn({
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
          n.stopping ? /* @__PURE__ */ e(A, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(q, { size: 12, fill: "currentColor" }),
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
        /* @__PURE__ */ e(U, { size: 13, fill: "currentColor" }),
        /* @__PURE__ */ e("span", { children: t ? "重新制作" : "开始制作" })
      ]
    }
  );
}
function yn() {
  return null;
}
function F(n, t) {
  return t > 0 && n >= t ? `已完成 ${n} / ${t} 个镜头，正在整理脚本` : n > 0 && t > 0 ? `已完成 ${n} / ${t} 个镜头，正在继续` : n > 0 ? `已完成 ${n} 个镜头，正在继续` : t > 0 ? `分镜规划完成，共 ${t} 个分镜` : "正在规划分镜";
}
function L({
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
        i ? /* @__PURE__ */ e(j, { label: "打开详情", onOpenDetail: i }) : null
      ]
    }
  );
}
function j({
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
        /* @__PURE__ */ e(W, { size: 13 }),
        /* @__PURE__ */ e("span", { children: n })
      ]
    }
  );
}
export {
  Rn as StorySettingNodeContent,
  An as StoryboardNodeContent
};
