import { j as e, a as l, F as $ } from "./preloadable-BrN58FXf.js";
import { b as A, a as W, S as q, q as O } from "./file-kind-BSFhe2vU.js";
import { q as Q, R as B, t as U, H as V, Q as K, b as X, r as Y } from "./vendor-icons-UGaOWWu-.js";
import { u as Z, s as I, g as nn, C as F, p as tn } from "./writing-run-labels--5SZkRES.js";
import { i as en } from "./space-node-runtime-CxMQ_W2k.js";
import { c as rn, w as an, s as on, h as sn, a as cn } from "./writing-document-YwPtpDvk.js";
import { w as ln, c as dn } from "./space-optional-components-C8EUHVoE.js";
import { i as un, a as pn, n as gn } from "./interaction-D6_wMtPr.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-preview-BHAJl883.css", import.meta.url).href]);
function mn(n) {
  const i = Z({ ...n, readOnMount: !1 }), c = A(!1), [m, p] = W(!1), [h, f] = W(!1), r = A(n);
  r.current = n;
  const d = () => {
    const t = i.snapshotRef.current;
    return !!(t && !r.current.readonly && !r.current.running && t.document.status !== "running");
  }, g = async (t) => {
    if (c.current) throw new Error("正在处理其他操作，请稍后再试");
    c.current = !0, p(!0);
    try {
      return await t();
    } finally {
      c.current = !1, i.mounted.current && p(!1);
    }
  }, v = async (t, u = {}) => {
    if (!d() || c.current || i.snapshotRef.current?.document.selected_inspiration_id)
      return !1;
    try {
      return await g(async () => {
        i.clearPreview(), i.clearGenerationError();
        const w = await I(
          i.command(t, u)
        );
        return i.mounted.current ? (i.acceptSnapshot(w), i.setError(""), !0) : !1;
      });
    } catch (w) {
      return i.mounted.current && i.reportError(w), !1;
    }
  }, a = (t) => {
    const u = i.snapshotRef.current;
    if (t.project_id !== r.current.projectId || t.canvas_id !== r.current.canvasId || t.work_asset_id !== u.work_asset_id || t.expected_work_version_id !== u.work_version_id || t.expected_work_revision !== u.work_revision)
      throw new Error("作品已更新，请关闭弹窗后重新操作；当前内容已保留");
  }, R = async (t) => {
    if (!d()) throw new Error("当前作品只读或正在生成，请稍后重试");
    if (a(t), i.snapshotRef.current?.document.selected_inspiration_id)
      throw new Error("选定灵感后不能修改或重新生成");
    await g(async () => {
      const u = await I(t);
      i.clearPreview(), i.clearGenerationError(), i.acceptSnapshot(u), i.setError("");
    });
  };
  return {
    ...i,
    busy: m,
    stopping: h,
    action: v,
    stop: async () => {
      const t = i.snapshotRef.current;
      if (!(!t?.run_id || t.document.status !== "running" || c.current || r.current.readonly))
        try {
          await g(async () => {
            f(!0);
            try {
              await i.stopRun(), i.setError("");
            } finally {
              i.mounted.current && f(!1);
            }
          });
        } catch (u) {
          i.reportError(u);
        }
    },
    beginInspirationEdit: (t) => {
      if (!d() || c.current || i.snapshotRef.current?.document.selected_inspiration_id)
        return null;
      const u = i.snapshotRef.current.document, w = u.inspirations.find((P) => P.id === t);
      return w ? {
        command: { ...i.command("save_document"), document: u },
        inspiration: w
      } : null;
    },
    saveInspiration: async (t, u) => {
      if (!d()) throw new Error("当前作品只读或正在生成，输入内容已保留");
      if (i.snapshotRef.current?.document.selected_inspiration_id)
        throw new Error("选定灵感后不能修改");
      const w = t.command;
      a(w), !(u.title === t.inspiration.title && u.content === t.inspiration.content) && await g(async () => {
        const P = {
          ...w.document,
          inspirations: w.document.inspirations.map(
            (S) => S.id === t.inspiration.id ? { ...S, ...u } : S
          )
        };
        i.acceptSnapshot(
          await I({ ...w, document: P })
        ), i.setError("");
      });
    },
    regenerateInspiration: async (t) => {
      if (!t.inspiration.id) throw new Error("当前灵感尚未保存，请稍后重试");
      const { document: u, ...w } = t.command;
      await R({
        ...w,
        action: "generate_inspirations",
        inspiration_id: t.inspiration.id
      });
    }
  };
}
function wn({
  document: n,
  disabled: i,
  onSelect: c,
  onRegenerate: m,
  onEdit: p,
  pending: h = !1
}) {
  const f = h ? Array.from(
    { length: Math.max(3, n.inspirations.length) },
    (r, d) => n.inspirations[d]
  ) : n.inspirations;
  return /* @__PURE__ */ e("div", { className: "writing-inspirations is-compact", children: /* @__PURE__ */ e("div", { className: "writing-inspiration-grid", children: f.map((r, d) => {
    if (!r)
      return /* @__PURE__ */ e(j, {}, `pending-${d}`);
    const g = /* @__PURE__ */ l("span", { className: "writing-inspiration-heading", children: [
      /* @__PURE__ */ e("span", { className: "writing-inspiration-number", children: String(d + 1).padStart(2, "0") }),
      /* @__PURE__ */ e("strong", { children: r.title || "正在构思…" })
    ] }), v = /* @__PURE__ */ e("span", { className: "writing-inspiration-description", children: r.content });
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
              "aria-label": `查看并编辑灵感 ${d + 1}：${r.title || "正在构思"}`,
              onPointerDown: (a) => a.stopPropagation(),
              onClick: (a) => {
                a.stopPropagation(), p(r.id);
              },
              children: [
                g,
                v
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
                "aria-label": `编辑灵感 ${d + 1}`,
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), p(r.id);
                },
                children: [
                  /* @__PURE__ */ e(Q, { size: 12 }),
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
                "aria-label": `更换灵感 ${d + 1}`,
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), m(r.id);
                },
                children: [
                  /* @__PURE__ */ e(B, { size: 12 }),
                  " 换一条"
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "nodrag nopan is-primary",
                type: "button",
                "aria-label": `选用灵感 ${d + 1}`,
                disabled: i || !rn(n, r.id),
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), c(r.id);
                },
                children: [
                  "选用",
                  /* @__PURE__ */ e(U, { size: 13 })
                ]
              }
            )
          ] })
        ]
      },
      r.id || d
    );
  }) }) });
}
function j() {
  return /* @__PURE__ */ l(
    "article",
    {
      className: "writing-inspiration-card is-skeleton",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ e("i", { className: "writing-inspiration-skeleton-title" }),
        /* @__PURE__ */ l("div", { children: [
          /* @__PURE__ */ e("i", {}),
          /* @__PURE__ */ e("i", {}),
          /* @__PURE__ */ e("i", {})
        ] }),
        /* @__PURE__ */ e("i", { className: "writing-inspiration-skeleton-action" })
      ]
    }
  );
}
function hn() {
  return /* @__PURE__ */ e(
    "div",
    {
      className: "writing-inspirations is-compact",
      "aria-label": "正在构思三个灵感",
      children: /* @__PURE__ */ e("div", { className: "writing-inspiration-grid", children: [0, 1, 2].map((n) => /* @__PURE__ */ e(j, {}, n)) })
    }
  );
}
function M(n) {
  const i = n ? an(n) : "inspiration", c = n ? n.units : [], m = c.filter((f) => f.has_body).length;
  let p = "剧情已规划";
  return c.length > 0 && m === c.length && (p = "正文完成", (n?.preferences.planned_chapters || 0) > c.length ? p = "本批正文完成，待继续规划" : n?.preferences.mode === "serial" && (p = "本批正文完成")), {
    label: {
      inspiration: "选择灵感",
      outline: "准备大纲",
      chapters: "大纲完成",
      body: p
    }[i],
    inspiration: n ? on(n) : void 0,
    leaves: c.length,
    completed: m
  };
}
function fn({
  snapshot: n,
  canvasRun: i,
  runningNode: c,
  running: m,
  loading: p,
  failure: h,
  stopping: f
}) {
  const r = n?.document, d = !!(i?.status && (un(i.status) || pn(i.status))), g = r?.status === "running" ? n : null, v = !!(m || g || d), a = i ? gn(i.status) : "", R = M(r), b = g?.checkpoint, k = b && b.action === "generate_units" ? Math.max(0, b.target || 0) : 0, s = Math.max(0, Math.min(k, b?.completed || 0));
  let t = "待创作";
  return v ? f ? t = "正在停止" : g ? t = nn(g) : d ? c?.status === "waiting" || a === "pending" ? t = "排队中" : t = "正在生成灵感" : t = "提交中" : h || r?.status === "failed" || !r && a === "fail" ? t = "生成未完成" : r?.status === "stopped" || !r && a === "canceled" ? t = "已停止" : r && (t = R.label), {
    active: v,
    canvasActive: d,
    usesWritingRun: !!g,
    label: t,
    target: k,
    committed: s,
    // 有新任务时旧错误不覆盖内容；终态错误完整文本只进系统弹窗。
    failure: v ? "" : h || (r ? "" : i?.error || "")
  };
}
const vn = O(
  () => import("./writing-dialog-jA3DrOYu.js").then((n) => ({
    default: n.WritingDialog
  }))
), _n = O(
  () => import("./writing-dialog-jA3DrOYu.js").then((n) => ({
    default: n.WritingInspirationDialog
  }))
);
function Wn(n) {
  const i = mn(n), { snapshot: c, generationTiming: m, busy: p, error: h, stop: f } = i, [r, d] = W(!1), [g, v] = W(null), a = c?.document, R = !!a || sn(n.node), b = cn, _ = a?.status === "running" && (c?.run_id !== n.canvasRun?.run_id || c?.request_id !== n.canvasRun?.request_id) ? void 0 : n.canvasRun, k = !!(_ && n.canvasRunStopping), s = fn({
    snapshot: c,
    canvasRun: _,
    runningNode: n.runningNode,
    running: !!(n.running || p),
    loading: !1,
    failure: h || (a ? "" : n.node.runError) || "",
    stopping: k || i.stopping
  }), t = m && m.workAssetId === c?.work_asset_id && m.runId === c.run_id && m.requestId === c.request_id ? m : n.node.resultRef?.run_id === c?.run_id ? n.node.runTiming : void 0, u = !!(c?.run_id && (!s.active || s.usesWritingRun)), w = s.active && !en(n.runningNode), P = _ ? _.node_runs?.find((o) => o.node_key === n.node.id)?.runTiming || _.node_results?.find((o) => o.node_key === n.node.id)?.runTiming || (n.node.resultRef?.run_id && n.node.resultRef.run_id === _.run_id ? n.node.runTiming : void 0) : n.node.runTiming, S = u ? /* @__PURE__ */ e(
    F,
    {
      runTiming: t,
      active: s.usesWritingRun,
      observed: t === m && m?.source === "observed",
      showEstimate: !1
    }
  ) : /* @__PURE__ */ e(
    F,
    {
      runTiming: w ? void 0 : P,
      active: w ? !0 : !s.active && _ ? !1 : void 0,
      runningNode: n.runningNode,
      showEstimate: !1
    }
  ), x = !!(c?.run_id && s.usesWritingRun), D = !!(s.canvasActive && n.onStopCanvasRun), L = s.active && (x || D), y = !a?.selected_inspiration_id, G = ln(c), E = a && y && s.active ? tn(
    a,
    i.preview,
    c?.checkpoint?.action
  ) : a, C = !!(E && !E.selected_inspiration_id && E.inspirations.length), N = M(a), H = s.failure && /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "writing-preview-error nodrag nopan",
      onPointerDown: (o) => o.stopPropagation(),
      onClick: (o) => {
        o.stopPropagation(), d(!0);
      },
      children: "查看错误"
    }
  ), T = /* @__PURE__ */ l(
    "span",
    {
      className: `writing-preview-status${s.failure ? " is-error" : ""}`,
      role: "status",
      children: [
        s.active && /* @__PURE__ */ e(Y, { size: 13, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { title: s.label, children: C && !s.active && !s.failure ? "选择一个灵感" : s.label }),
        N.leaves > 0 && /* @__PURE__ */ l("span", { className: "writing-preview-count", children: [
          "已写 ",
          N.completed,
          "/",
          N.leaves,
          " 章",
          s.active && s.target > 1 ? ` · 本次 ${s.committed}/${s.target}` : ""
        ] })
      ]
    }
  ), z = /* @__PURE__ */ l($, { children: [
    H,
    y && !s.active && G?.action === "retry_generation" && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "nodrag nopan",
        disabled: p || !!n.readonly,
        onPointerDown: (o) => o.stopPropagation(),
        onClick: (o) => {
          o.stopPropagation(), i.action("retry_generation");
        },
        children: [
          /* @__PURE__ */ e(B, { size: 12 }),
          "重试生成"
        ]
      }
    ),
    L && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "nodrag nopan",
        disabled: p || n.readonly || k,
        onPointerDown: (o) => o.stopPropagation(),
        onClick: (o) => {
          o.stopPropagation(), D ? n.onStopCanvasRun?.() : f();
        },
        children: [
          /* @__PURE__ */ e(V, { size: 12 }),
          "停止"
        ]
      }
    )
  ] }), J = /* @__PURE__ */ l("section", { className: "writing-preview", "aria-label": `${b.title}预览`, children: [
    /* @__PURE__ */ l("header", { className: "writing-preview-header", children: [
      y ? T : /* @__PURE__ */ e("span", { className: "writing-preview-eyebrow", children: "已选灵感" }),
      /* @__PURE__ */ l("div", { className: "writing-preview-actions", children: [
        y && z,
        C && !s.active && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "writing-preview-batch nodrag nopan",
            disabled: p || !!n.readonly,
            onPointerDown: (o) => o.stopPropagation(),
            onClick: (o) => {
              o.stopPropagation(), i.action("generate_inspirations");
            },
            children: [
              /* @__PURE__ */ e(B, { size: 13 }),
              "换一批"
            ]
          }
        ),
        dn(a) && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: !n.onOpenDetail,
            onPointerDown: (o) => o.stopPropagation(),
            onClick: (o) => {
              o.stopPropagation(), n.onOpenDetail?.(i.snapshotRef.current);
            },
            children: [
              /* @__PURE__ */ e(K, { size: 13 }),
              "打开工作区"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "writing-preview-content", children: E && C ? /* @__PURE__ */ e(
      wn,
      {
        pending: s.active,
        document: E,
        disabled: s.active || p || !!n.readonly,
        onEdit: (o) => v(i.beginInspirationEdit(o)),
        onRegenerate: (o) => {
          i.action(
            "generate_inspirations",
            o ? { inspiration_id: o } : {}
          );
        },
        onSelect: async (o) => {
          await i.action("select_inspiration", {
            inspiration_id: o
          }) && n.onOpenDetail?.(i.snapshotRef.current);
        }
      }
    ) : N.inspiration ? /* @__PURE__ */ l("div", { className: "writing-preview-selected", children: [
      /* @__PURE__ */ e("h3", { children: N.inspiration.title }),
      /* @__PURE__ */ e("p", { children: N.inspiration.content })
    ] }) : s.active && y ? /* @__PURE__ */ e(hn, {}) : /* @__PURE__ */ l("div", { className: "writing-preview-empty", children: [
      /* @__PURE__ */ e(X, { size: 24, strokeWidth: 1.3, "aria-hidden": "true" }),
      /* @__PURE__ */ e("p", { children: R ? y ? "暂无灵感，可重试生成" : "暂无内容，打开工作区继续创作" : "填写提示词，开始创作" })
    ] }) }),
    !y && /* @__PURE__ */ l("footer", { className: "writing-preview-footer", children: [
      T,
      /* @__PURE__ */ e("div", { className: "writing-preview-actions", children: z })
    ] })
  ] });
  return /* @__PURE__ */ l($, { children: [
    n.renderFrame(J, S, s.active),
    r && /* @__PURE__ */ e(q, { fallback: null, children: /* @__PURE__ */ e(vn, { title: "生成错误", onClose: () => d(!1), children: /* @__PURE__ */ e("div", { className: "writing-preview-error-detail", role: "alert", children: s.failure || h }) }) }),
    g && /* @__PURE__ */ e(q, { fallback: null, children: /* @__PURE__ */ e(
      _n,
      {
        edit: g,
        disabled: s.active || p || !!n.readonly,
        onSave: (o) => i.saveInspiration(g, o),
        onRegenerate: () => i.regenerateInspiration(g),
        onClose: () => v(null)
      }
    ) })
  ] });
}
export {
  Wn as WritingPreview
};
