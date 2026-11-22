import { j as t, a as l, F as G } from "./preloadable-R-5sHdlM.js";
import { b as U, a as N, S as $, q as K } from "./file-kind-Cq3pESGF.js";
import { q as cn, R as A, t as ln, z as dn, a4 as un, b as V, r as gn } from "./vendor-icons-IZIW7U43.js";
import { s as T, a as H } from "./node-detail-header-_ds1F0v7.js";
import { d as pn, e as mn, g as hn, h as wn, i as fn, f as vn, j as _n } from "./writing-reference-DlogpT9K.js";
import { i as bn } from "./space-node-runtime-mQKAQcW3.js";
import { u as yn, g as kn, w as Nn, p as Pn, c as Cn } from "./writing-run-labels-C7uoY0ZO.js";
import { g as Sn, h as Rn, j as In } from "./space-assistant-layout-B9KyeCM0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-preview-CpV0rMT5.css", import.meta.url).href]);
function En(n) {
  const i = yn({ ...n, readOnMount: !1 }), g = U(!1), [_, h] = N(!1), [f, w] = N(!1), r = U(n);
  r.current = n;
  const c = () => {
    const a = i.snapshotRef.current;
    return !!(a && !r.current.readonly && !r.current.running && a.document.status !== "running");
  }, d = async (a) => {
    if (g.current) throw new Error("正在处理其他操作，请稍后再试");
    g.current = !0, h(!0);
    try {
      return await a();
    } finally {
      g.current = !1, i.mounted.current && h(!1);
    }
  }, p = async (a, m = {}) => {
    if (!c() || g.current || i.snapshotRef.current?.document.selected_inspiration_id)
      return !1;
    try {
      return await d(async () => {
        i.clearPreview(), i.clearGenerationError();
        const u = await T(
          i.command(a, m)
        );
        return i.mounted.current ? (i.acceptSnapshot(u), i.setError(""), !0) : !1;
      });
    } catch (u) {
      return i.mounted.current && i.reportError(u), !1;
    }
  }, s = (a) => {
    const m = i.snapshotRef.current;
    if (a.project_id !== r.current.projectId || a.canvas_id !== r.current.canvasId || a.work_asset_id !== m.work_asset_id || a.expected_work_version_id !== m.work_version_id || a.expected_work_revision !== m.work_revision)
      throw new Error("作品已更新，请关闭弹窗后重新操作；当前内容已保留");
  }, b = async (a) => {
    if (!c()) throw new Error("当前作品只读或正在生成，请稍后重试");
    if (s(a), i.snapshotRef.current?.document.selected_inspiration_id)
      throw new Error("选定灵感后不能修改或重新生成");
    await d(async () => {
      const m = await T(a);
      i.clearPreview(), i.clearGenerationError(), i.acceptSnapshot(m), i.setError("");
    });
  };
  return {
    ...i,
    busy: _,
    stopping: f,
    action: p,
    stop: async () => {
      const a = i.snapshotRef.current;
      if (!(!a?.run_id || a.document.status !== "running" || g.current || r.current.readonly))
        try {
          await d(async () => {
            w(!0);
            try {
              await i.stopRun(), i.setError("");
            } finally {
              i.mounted.current && w(!1);
            }
          });
        } catch (m) {
          i.reportError(m);
        }
    },
    beginInspirationEdit: (a) => {
      if (!c() || g.current || i.snapshotRef.current?.document.selected_inspiration_id)
        return null;
      const m = i.snapshotRef.current.document, u = m.inspirations.find((S) => S.id === a);
      return u ? {
        command: { ...i.command("save_document"), document: m },
        inspiration: u
      } : null;
    },
    saveInspiration: async (a, m) => {
      if (!c()) throw new Error("当前作品只读或正在生成，输入内容已保留");
      if (i.snapshotRef.current?.document.selected_inspiration_id)
        throw new Error("选定灵感后不能修改");
      const u = a.command;
      s(u), !(m.title === a.inspiration.title && m.content === a.inspiration.content) && await d(async () => {
        const S = {
          ...u.document,
          inspirations: u.document.inspirations.map(
            (D) => D.id === a.inspiration.id ? { ...D, ...m } : D
          )
        };
        i.acceptSnapshot(
          await T({ ...u, document: S })
        ), i.setError("");
      });
    },
    regenerateInspiration: async (a) => {
      if (!a.inspiration.id) throw new Error("当前灵感尚未保存，请稍后重试");
      const { document: m, ...u } = a.command;
      await b({
        ...u,
        action: "generate_inspirations",
        inspiration_id: a.inspiration.id
      });
    }
  };
}
function Wn({
  document: n,
  disabled: i,
  onSelect: g,
  onRegenerate: _,
  onEdit: h,
  pending: f = !1
}) {
  const w = f ? Array.from(
    { length: Math.max(3, n.inspirations.length) },
    (r, c) => n.inspirations[c]
  ) : n.inspirations;
  return /* @__PURE__ */ t("div", { className: "writing-inspirations is-compact", children: /* @__PURE__ */ t("div", { className: "writing-inspiration-grid", children: w.map((r, c) => {
    if (!r)
      return /* @__PURE__ */ t(Q, {}, `pending-${c}`);
    const d = /* @__PURE__ */ l("span", { className: "writing-inspiration-heading", children: [
      /* @__PURE__ */ t("span", { className: "writing-inspiration-number", children: String(c + 1).padStart(2, "0") }),
      /* @__PURE__ */ t("strong", { children: r.title || "正在构思…" })
    ] }), p = /* @__PURE__ */ t("span", { className: "writing-inspiration-description", children: r.content });
    return /* @__PURE__ */ l(
      "article",
      {
        className: "writing-inspiration-card",
        children: [
          /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "writing-inspiration-open nodrag nopan",
              disabled: i || !r.id,
              "aria-label": `查看并编辑灵感 ${c + 1}：${r.title || "正在构思"}`,
              onPointerDown: (s) => s.stopPropagation(),
              onClick: (s) => {
                s.stopPropagation(), h(r.id);
              },
              children: [
                d,
                p
              ]
            }
          ),
          /* @__PURE__ */ l("footer", { children: [
            /* @__PURE__ */ l(
              "button",
              {
                className: "writing-inspiration-secondary nodrag nopan",
                type: "button",
                disabled: i || !r.id,
                "aria-label": `编辑灵感 ${c + 1}`,
                onPointerDown: (s) => s.stopPropagation(),
                onClick: (s) => {
                  s.stopPropagation(), h(r.id);
                },
                children: [
                  /* @__PURE__ */ t(cn, { size: 12 }),
                  " 编辑"
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "writing-inspiration-secondary nodrag nopan",
                type: "button",
                disabled: i || !r.id,
                "aria-label": `更换灵感 ${c + 1}`,
                onPointerDown: (s) => s.stopPropagation(),
                onClick: (s) => {
                  s.stopPropagation(), _(r.id);
                },
                children: [
                  /* @__PURE__ */ t(A, { size: 12 }),
                  " 换一条"
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "nodrag nopan is-primary",
                type: "button",
                "aria-label": `选用灵感 ${c + 1}`,
                disabled: i || !pn(n, r.id),
                onPointerDown: (s) => s.stopPropagation(),
                onClick: (s) => {
                  s.stopPropagation(), g(r.id);
                },
                children: [
                  "选用",
                  /* @__PURE__ */ t(ln, { size: 13 })
                ]
              }
            )
          ] })
        ]
      },
      r.id || c
    );
  }) }) });
}
function Q() {
  return /* @__PURE__ */ l(
    "article",
    {
      className: "writing-inspiration-card is-skeleton",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t("i", { className: "writing-inspiration-skeleton-title" }),
        /* @__PURE__ */ l("div", { children: [
          /* @__PURE__ */ t("i", {}),
          /* @__PURE__ */ t("i", {}),
          /* @__PURE__ */ t("i", {})
        ] }),
        /* @__PURE__ */ t("i", { className: "writing-inspiration-skeleton-action" })
      ]
    }
  );
}
function Dn() {
  return /* @__PURE__ */ t(
    "div",
    {
      className: "writing-inspirations is-compact",
      "aria-label": "正在构思三个灵感",
      children: /* @__PURE__ */ t("div", { className: "writing-inspiration-grid", children: [0, 1, 2].map((n) => /* @__PURE__ */ t(Q, {}, n)) })
    }
  );
}
function X(n) {
  const i = n ? mn(n) : "inspiration", g = n ? n.units : [], _ = g.filter((c) => c.has_body).length, h = n ? hn(n) : void 0, f = n ? {
    title: n.title || h?.title || "未命名故事",
    content: h?.content || n.outline.overview.trim() || g.map((c) => c.plan.trim()).filter(Boolean).join(`
`) || g.map((c) => c.title).join(" · ")
  } : void 0;
  let w = "剧情已规划";
  return g.length > 0 && _ === g.length && (w = "正文完成", (n?.preferences.planned_chapters || 0) > g.length ? w = "本批正文完成，待继续规划" : n?.preferences.mode === "serial" && (w = "本批正文完成")), {
    label: {
      inspiration: "选择灵感",
      outline: "准备大纲",
      chapters: "大纲完成",
      body: w
    }[i],
    inspiration: h,
    summary: f,
    leaves: g.length,
    completed: _
  };
}
function Bn({
  snapshot: n,
  canvasRun: i,
  runningNode: g,
  running: _,
  loading: h,
  failure: f,
  stopping: w
}) {
  const r = n?.document, c = !!(i?.status && (Sn(i.status) || Rn(i.status))), d = r?.status === "running" ? n : null, p = !!(_ || d || c), s = i ? In(i.status) : "", b = X(r), k = d?.checkpoint, E = k && k.action === "generate_units" ? Math.max(0, k.target || 0) : 0, W = Math.max(0, Math.min(E, k?.completed || 0));
  let a = "待创作";
  return p ? w ? a = "正在停止" : d ? a = kn(d) : c ? g?.status === "waiting" || s === "pending" ? a = "排队中" : a = "正在生成灵感" : a = "提交中" : f || r?.status === "failed" || !r && s === "fail" ? a = "生成未完成" : r?.status === "stopped" || !r && s === "canceled" ? a = "已停止" : r && (a = b.label), {
    active: p,
    canvasActive: c,
    usesWritingRun: !!d,
    label: a,
    target: E,
    committed: W,
    // 有新任务时旧错误不覆盖内容；终态错误完整文本只进系统弹窗。
    failure: p ? "" : f || (r ? "" : i?.error || "")
  };
}
const J = K(
  () => import("./writing-dialog-CSrEAH-C.js").then((n) => ({
    default: n.WritingDialog
  }))
), Tn = K(
  () => import("./writing-dialog-CSrEAH-C.js").then((n) => ({
    default: n.WritingInspirationDialog
  }))
);
function Mn(n) {
  const [i, g] = N(!1), [_, h] = N(!1), [f, w] = N([]), [r, c] = N(""), d = En(n), { snapshot: p, generationTiming: s, busy: b, error: k, stop: j } = d, [E, W] = N(!1), [a, m] = N(null), u = p?.document, S = !!u || wn(n.node), D = _n, P = u?.status === "running" && (p?.run_id !== n.canvasRun?.run_id || p?.request_id !== n.canvasRun?.request_id) ? void 0 : n.canvasRun, O = !!(P && n.canvasRunStopping), o = Bn({
    snapshot: p,
    canvasRun: P,
    runningNode: n.runningNode,
    running: !!(n.running || b),
    loading: !1,
    failure: k || (u ? "" : n.node.runError) || "",
    stopping: O || d.stopping
  }), x = s && s.workAssetId === p?.work_asset_id && s.runId === p.run_id && s.requestId === p.request_id ? s : n.node.resultRef?.run_id === p?.run_id ? n.node.runTiming : void 0, Y = !!(p?.run_id && (!o.active || o.usesWritingRun)), q = o.active && !bn(n.runningNode), Z = P ? P.node_runs?.find((e) => e.node_key === n.node.id)?.runTiming || P.node_results?.find((e) => e.node_key === n.node.id)?.runTiming || (n.node.resultRef?.run_id && n.node.resultRef.run_id === P.run_id ? n.node.runTiming : void 0) : n.node.runTiming, nn = Y ? /* @__PURE__ */ t(
    H,
    {
      runTiming: x,
      active: o.usesWritingRun,
      observed: x === s && s?.source === "observed",
      showEstimate: !1
    }
  ) : /* @__PURE__ */ t(
    H,
    {
      runTiming: q ? void 0 : Z,
      active: q ? !0 : !o.active && P ? !1 : void 0,
      runningNode: n.runningNode,
      showEstimate: !1
    }
  ), en = !!(p?.run_id && o.usesWritingRun), F = !!(o.canvasActive && n.onStopCanvasRun), tn = o.active && (en || F), y = !fn(u), an = Nn(p), B = u && y && o.active ? Pn(
    u,
    d.preview,
    p?.checkpoint?.action
  ) : u, z = !!(B && !B.selected_inspiration_id && B.inspirations.length), C = X(u), R = u?.units.filter(
    (e) => e.has_body && e.asset_id && e.version_id
  ) || [], rn = o.failure && /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "writing-preview-error nodrag nopan",
      onPointerDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.stopPropagation(), W(!0);
      },
      children: "查看错误"
    }
  ), M = /* @__PURE__ */ l(
    "span",
    {
      className: `writing-preview-status${o.failure ? " is-error" : ""}`,
      role: "status",
      children: [
        o.active && /* @__PURE__ */ t(gn, { size: 13, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ t("span", { title: o.label, children: z && !o.active && !o.failure ? "选择一个灵感" : o.label }),
        C.leaves > 0 && /* @__PURE__ */ l("span", { className: "writing-preview-count", children: [
          "已写 ",
          C.completed,
          "/",
          C.leaves,
          " 章",
          o.active && o.target > 1 ? ` · 本次 ${o.committed}/${o.target}` : ""
        ] })
      ]
    }
  ), L = /* @__PURE__ */ l(G, { children: [
    rn,
    y && !o.active && an?.action === "retry_generation" && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "nodrag nopan",
        disabled: b || !!n.readonly,
        onPointerDown: (e) => e.stopPropagation(),
        onClick: (e) => {
          e.stopPropagation(), d.action("retry_generation");
        },
        children: [
          /* @__PURE__ */ t(A, { size: 12 }),
          "重试生成"
        ]
      }
    ),
    tn && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "nodrag nopan",
        disabled: b || n.readonly || O,
        onPointerDown: (e) => e.stopPropagation(),
        onClick: (e) => {
          e.stopPropagation(), F ? n.onStopCanvasRun?.() : j();
        },
        children: [
          /* @__PURE__ */ t(dn, { size: 12 }),
          "停止"
        ]
      }
    )
  ] }), on = /* @__PURE__ */ l("section", { className: "writing-preview", "aria-label": `${D.title}预览`, children: [
    /* @__PURE__ */ l("header", { className: "writing-preview-header", children: [
      y ? M : /* @__PURE__ */ l("span", { className: "writing-preview-eyebrow", children: [
        C.label,
        " · 正文 ",
        R.length,
        "/",
        u?.units.length || 0,
        " 章"
      ] }),
      /* @__PURE__ */ l("div", { className: "writing-preview-actions", children: [
        y && L,
        z && !o.active && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "writing-preview-batch nodrag nopan",
            disabled: b || !!n.readonly,
            onPointerDown: (e) => e.stopPropagation(),
            onClick: (e) => {
              e.stopPropagation(), d.action("generate_inspirations");
            },
            children: [
              /* @__PURE__ */ t(A, { size: 13 }),
              "换一批"
            ]
          }
        ),
        Cn(u) && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: !n.onOpenDetail,
            onPointerDown: (e) => e.stopPropagation(),
            onClick: (e) => {
              e.stopPropagation(), n.onOpenDetail?.(d.snapshotRef.current);
            },
            children: [
              /* @__PURE__ */ t(un, { size: 13 }),
              "编辑故事"
            ]
          }
        ),
        !y && R.length > 0 && n.onCreateStoryboards && /* @__PURE__ */ l(
          "button",
          {
            title: "为选中的章节创建分镜节点，自动带上本章正文和设定",
            type: "button",
            className: "nodrag nopan",
            disabled: !!n.readonly || o.active,
            onPointerDown: (e) => e.stopPropagation(),
            onClick: (e) => {
              e.stopPropagation();
              const v = R.map((I) => I.id);
              v.length === 1 ? n.onCreateStoryboards?.(v) : (w(v), h(!0));
            },
            children: [
              /* @__PURE__ */ t(V, { size: 13 }),
              "制作分镜"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "writing-preview-content", children: B && z ? /* @__PURE__ */ t(
      Wn,
      {
        pending: o.active,
        document: B,
        disabled: o.active || b || !!n.readonly,
        onEdit: (e) => m(d.beginInspirationEdit(e)),
        onRegenerate: (e) => {
          d.action(
            "generate_inspirations",
            e ? { inspiration_id: e } : {}
          );
        },
        onSelect: async (e) => {
          await d.action("select_inspiration", {
            inspiration_id: e
          }) && n.onOpenDetail?.(d.snapshotRef.current);
        }
      }
    ) : !y && C.summary ? /* @__PURE__ */ l("div", { className: "writing-preview-selected", children: [
      /* @__PURE__ */ t("h3", { children: C.summary.title }),
      /* @__PURE__ */ t("p", { children: C.summary.content })
    ] }) : o.active && y ? /* @__PURE__ */ t(Dn, {}) : /* @__PURE__ */ l("div", { className: "writing-preview-empty", children: [
      /* @__PURE__ */ t(V, { size: 24, strokeWidth: 1.3, "aria-hidden": "true" }),
      /* @__PURE__ */ t("p", { children: S ? y ? "暂无灵感，可重试生成" : R.length ? `${R.length} 章正文已保存，可以继续编辑故事或制作分镜。` : "编辑故事，直接写作或粘贴已有小说" : "填写提示词，开始创作" }),
      !S && !o.active && /* @__PURE__ */ t("button", { className: "nodrag nopan", disabled: i || n.readonly, onPointerDown: (e) => e.stopPropagation(), onClick: async (e) => {
        e.stopPropagation(), g(!0), c("");
        try {
          const v = await T({ project_id: n.projectId, canvas_id: n.canvasId, action: "create", node_key: n.node.id, title: n.node.title || "新的小说", work_asset_id: 0, expected_work_version_id: 0, expected_work_revision: 0 }), I = await vn({ projectId: n.projectId, assetId: v.work_asset_id, currentOnly: !0 });
          n.onAssetUpdated?.(I.asset), n.onOpenDetail?.(v);
        } catch (v) {
          c(String(v?.message || v));
        } finally {
          g(!1);
        }
      }, children: i ? "正在创建…" : "直接开始写／带入已有小说" }),
      r && /* @__PURE__ */ t("p", { role: "alert", children: r })
    ] }) }),
    !y && /* @__PURE__ */ l("footer", { className: "writing-preview-footer", children: [
      M,
      /* @__PURE__ */ t("div", { className: "writing-preview-actions", children: L })
    ] })
  ] });
  return /* @__PURE__ */ l(G, { children: [
    n.renderFrame(on, nn, o.active),
    _ && /* @__PURE__ */ t($, { fallback: null, children: /* @__PURE__ */ t(J, { title: "选择制作章节", onClose: () => h(!1), children: /* @__PURE__ */ l("div", { className: "writing-dialog-scroll writing-chapter-selection", children: [
      /* @__PURE__ */ t("p", { children: "选择要制作的章节，人物、场景和道具会自动共用。" }),
      R.map((e) => /* @__PURE__ */ l("label", { children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            checked: f.includes(e.id),
            onChange: (v) => w(
              (I) => v.target.checked ? [...I, e.id] : I.filter((sn) => sn !== e.id)
            )
          }
        ),
        e.title
      ] }, e.id)),
      /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: !!n.readonly || o.active || !f.length,
          onClick: () => {
            n.onCreateStoryboards?.(f), h(!1);
          },
          children: "创建分镜"
        }
      )
    ] }) }) }),
    E && /* @__PURE__ */ t($, { fallback: null, children: /* @__PURE__ */ t(J, { title: "生成错误", onClose: () => W(!1), children: /* @__PURE__ */ t("div", { className: "writing-preview-error-detail", role: "alert", children: o.failure || k }) }) }),
    a && /* @__PURE__ */ t($, { fallback: null, children: /* @__PURE__ */ t(
      Tn,
      {
        edit: a,
        disabled: o.active || b || !!n.readonly,
        onSave: (e) => d.saveInspiration(a, e),
        onRegenerate: () => d.regenerateInspiration(a),
        onClose: () => m(null)
      }
    ) })
  ] });
}
export {
  Mn as WritingPreview
};
