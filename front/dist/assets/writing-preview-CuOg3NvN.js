import { j as e, a as l, F as z } from "./react-HSzdbxZ7.js";
import { b as $, a as W, S as A, q } from "./file-kind-D6bMOzYN.js";
import { q as J, R as F, t as Q, H as U, Q as V, b as K, r as X } from "./vendor-icons-fVDtJt66.js";
import { h as Y, s as B, j as Z, k as nn, l as j, m as tn, n as en } from "./writing-run-labels-3Ti7hIo6.js";
import { b as rn, d as an, e as on, h as sn, f as cn } from "./space-ordered-list-CMPTqlTO.js";
import { i as ln, a as dn, n as un } from "./interaction-BINoNx5F.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-preview-BHAJl883.css", import.meta.url).href]);
function pn(i) {
  const n = Y({ ...i, readOnMount: !1 }), c = $(!1), [g, w] = W(!1), [h, _] = W(!1), r = $(i);
  r.current = i;
  const d = () => {
    const t = n.snapshotRef.current;
    return !!(t && !r.current.readonly && !r.current.running && t.document.status !== "running");
  }, p = async (t) => {
    if (c.current) throw new Error("正在处理其他操作，请稍后再试");
    c.current = !0, w(!0);
    try {
      return await t();
    } finally {
      c.current = !1, n.mounted.current && w(!1);
    }
  }, f = async (t, u = {}) => {
    if (!d() || c.current || n.snapshotRef.current?.document.selected_inspiration_id)
      return !1;
    try {
      return await p(async () => {
        n.clearPreview(), n.clearGenerationError();
        const m = await B(
          n.command(t, u)
        );
        return n.mounted.current ? (n.acceptSnapshot(m), n.setError(""), !0) : !1;
      });
    } catch (m) {
      return n.mounted.current && n.reportError(m), !1;
    }
  }, a = (t) => {
    const u = n.snapshotRef.current;
    if (t.project_id !== r.current.projectId || t.canvas_id !== r.current.canvasId || t.work_asset_id !== u.work_asset_id || t.expected_work_version_id !== u.work_version_id || t.expected_work_revision !== u.work_revision)
      throw new Error("作品已更新，请关闭弹窗后重新操作；当前内容已保留");
  }, y = async (t) => {
    if (!d()) throw new Error("当前作品只读或正在生成，请稍后重试");
    if (a(t), n.snapshotRef.current?.document.selected_inspiration_id)
      throw new Error("选定灵感后不能修改或重新生成");
    await p(async () => {
      const u = await B(t);
      n.clearPreview(), n.clearGenerationError(), n.acceptSnapshot(u), n.setError("");
    });
  };
  return {
    ...n,
    busy: g,
    stopping: h,
    action: f,
    stop: async () => {
      const t = n.snapshotRef.current;
      if (!(!t?.run_id || t.document.status !== "running" || c.current || r.current.readonly))
        try {
          await p(async () => {
            _(!0);
            try {
              await n.stopRun(), n.setError("");
            } finally {
              n.mounted.current && _(!1);
            }
          });
        } catch (u) {
          n.reportError(u);
        }
    },
    beginInspirationEdit: (t) => {
      if (!d() || c.current || n.snapshotRef.current?.document.selected_inspiration_id)
        return null;
      const u = n.snapshotRef.current.document, m = u.inspirations.find((R) => R.id === t);
      return m ? {
        command: { ...n.command("save_document"), document: u },
        inspiration: m
      } : null;
    },
    saveInspiration: async (t, u) => {
      if (!d()) throw new Error("当前作品只读或正在生成，输入内容已保留");
      if (n.snapshotRef.current?.document.selected_inspiration_id)
        throw new Error("选定灵感后不能修改");
      const m = t.command;
      a(m), !(u.title === t.inspiration.title && u.content === t.inspiration.content) && await p(async () => {
        const R = {
          ...m.document,
          inspirations: m.document.inspirations.map(
            (P) => P.id === t.inspiration.id ? { ...P, ...u } : P
          )
        };
        n.acceptSnapshot(
          await B({ ...m, document: R })
        ), n.setError("");
      });
    },
    regenerateInspiration: async (t) => {
      if (!t.inspiration.id) throw new Error("当前灵感尚未保存，请稍后重试");
      const { document: u, ...m } = t.command;
      await y({
        ...m,
        action: "generate_inspirations",
        inspiration_id: t.inspiration.id
      });
    }
  };
}
function gn({
  document: i,
  disabled: n,
  onSelect: c,
  onRegenerate: g,
  onEdit: w,
  pending: h = !1
}) {
  const _ = h ? Array.from(
    { length: Math.max(3, i.inspirations.length) },
    (r, d) => i.inspirations[d]
  ) : i.inspirations;
  return /* @__PURE__ */ e("div", { className: "writing-inspirations is-compact", children: /* @__PURE__ */ e("div", { className: "writing-inspiration-grid", children: _.map((r, d) => {
    if (!r)
      return /* @__PURE__ */ e(O, {}, `pending-${d}`);
    const p = /* @__PURE__ */ l("span", { className: "writing-inspiration-heading", children: [
      /* @__PURE__ */ e("span", { className: "writing-inspiration-number", children: String(d + 1).padStart(2, "0") }),
      /* @__PURE__ */ e("strong", { children: r.title || "正在构思…" })
    ] }), f = /* @__PURE__ */ e("span", { className: "writing-inspiration-description", children: r.content });
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
              disabled: n || !r.id,
              "aria-label": `查看并编辑灵感 ${d + 1}：${r.title || "正在构思"}`,
              onPointerDown: (a) => a.stopPropagation(),
              onClick: (a) => {
                a.stopPropagation(), w(r.id);
              },
              children: [
                p,
                f
              ]
            }
          ),
          /* @__PURE__ */ l("footer", { children: [
            /* @__PURE__ */ l(
              "button",
              {
                className: "writing-inspiration-secondary nodrag nopan",
                type: "button",
                disabled: n || !r.id,
                "aria-label": `编辑灵感 ${d + 1}`,
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), w(r.id);
                },
                children: [
                  /* @__PURE__ */ e(J, { size: 12 }),
                  " 编辑"
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                className: "writing-inspiration-secondary nodrag nopan",
                type: "button",
                disabled: n || !r.id,
                "aria-label": `更换灵感 ${d + 1}`,
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), g(r.id);
                },
                children: [
                  /* @__PURE__ */ e(F, { size: 12 }),
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
                disabled: n || !rn(i, r.id),
                onPointerDown: (a) => a.stopPropagation(),
                onClick: (a) => {
                  a.stopPropagation(), c(r.id);
                },
                children: [
                  "选用",
                  /* @__PURE__ */ e(Q, { size: 13 })
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
function O() {
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
function mn() {
  return /* @__PURE__ */ e(
    "div",
    {
      className: "writing-inspirations is-compact",
      "aria-label": "正在构思三个灵感",
      children: /* @__PURE__ */ e("div", { className: "writing-inspiration-grid", children: [0, 1, 2].map((i) => /* @__PURE__ */ e(O, {}, i)) })
    }
  );
}
function M(i) {
  const n = i ? an(i) : "inspiration", c = i ? i.units : [], g = c.filter((h) => h.has_body).length;
  return {
    label: {
      inspiration: "选择灵感",
      outline: "准备大纲",
      chapters: "大纲完成",
      body: c.length > 0 && g === c.length ? "正文完成" : "剧情已规划"
    }[n],
    inspiration: i ? on(i) : void 0,
    leaves: c.length,
    completed: g
  };
}
function wn({
  snapshot: i,
  canvasRun: n,
  runningNode: c,
  running: g,
  loading: w,
  failure: h,
  stopping: _
}) {
  const r = i?.document, d = !!(n?.status && (ln(n.status) || dn(n.status))), p = r?.status === "running" ? i : null, f = !!(g || p || d), a = n ? un(n.status) : "", y = M(r), b = p?.checkpoint, k = b && b.action === "generate_units" ? Math.max(0, b.target || 0) : 0, o = Math.max(0, Math.min(k, b?.completed || 0));
  let t = "待创作";
  return f ? _ ? t = "正在停止" : p ? t = Z(p) : d ? c?.status === "waiting" || a === "pending" ? t = "排队中" : t = "正在生成灵感" : t = "提交中" : h || r?.status === "failed" || !r && a === "fail" ? t = "生成未完成" : r?.status === "stopped" || !r && a === "canceled" ? t = "已停止" : r && (t = y.label), {
    active: f,
    canvasActive: d,
    usesWritingRun: !!p,
    label: t,
    target: k,
    committed: o,
    // 有新任务时旧错误不覆盖内容；终态错误完整文本只进系统弹窗。
    failure: f ? "" : h || (r ? "" : n?.error || "")
  };
}
const hn = q(
  () => import("./writing-dialog-CPtmxdRD.js").then((i) => ({
    default: i.WritingDialog
  }))
), fn = q(
  () => import("./writing-dialog-CPtmxdRD.js").then((i) => ({
    default: i.WritingInspirationDialog
  }))
);
function Rn(i) {
  const n = pn(i), { snapshot: c, generationTiming: g, busy: w, error: h, stop: _ } = n, [r, d] = W(!1), [p, f] = W(null), a = c?.document, y = !!a || sn(i.node), b = cn, v = a?.status === "running" && (c?.run_id !== i.canvasRun?.run_id || c?.request_id !== i.canvasRun?.request_id) ? void 0 : i.canvasRun, k = !!(v && i.canvasRunStopping), o = wn({
    snapshot: c,
    canvasRun: v,
    runningNode: i.runningNode,
    running: !!(i.running || w),
    loading: !1,
    failure: h || (a ? "" : i.node.runError) || "",
    stopping: k || n.stopping
  }), t = g && g.workAssetId === c?.work_asset_id && g.runId === c.run_id && g.requestId === c.request_id ? g : i.node.resultRef?.run_id === c?.run_id ? i.node.runTiming : void 0, u = !!(c?.run_id && (!o.active || o.usesWritingRun)), m = o.active && !nn(i.runningNode), R = v ? v.node_runs?.find((s) => s.node_key === i.node.id)?.runTiming || v.node_results?.find((s) => s.node_key === i.node.id)?.runTiming || (i.node.resultRef?.run_id && i.node.resultRef.run_id === v.run_id ? i.node.runTiming : void 0) : i.node.runTiming, P = u ? /* @__PURE__ */ e(
    j,
    {
      runTiming: t,
      active: o.usesWritingRun,
      observed: t === g && g?.source === "observed",
      showEstimate: !1
    }
  ) : /* @__PURE__ */ e(
    j,
    {
      runTiming: m ? void 0 : R,
      active: m ? !0 : !o.active && v ? !1 : void 0,
      runningNode: i.runningNode,
      showEstimate: !1
    }
  ), x = !!(c?.run_id && o.usesWritingRun), C = !!(o.canvasActive && i.onStopCanvasRun), G = o.active && (x || C), S = !a?.selected_inspiration_id, E = a && S && o.active ? tn(
    a,
    n.preview,
    c?.checkpoint?.action
  ) : a, I = !!(E && !E.selected_inspiration_id && E.inspirations.length), N = M(a), H = o.failure && /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "writing-preview-error nodrag nopan",
      onPointerDown: (s) => s.stopPropagation(),
      onClick: (s) => {
        s.stopPropagation(), d(!0);
      },
      children: "查看错误"
    }
  ), D = /* @__PURE__ */ l(
    "span",
    {
      className: `writing-preview-status${o.failure ? " is-error" : ""}`,
      role: "status",
      children: [
        o.active && /* @__PURE__ */ e(X, { size: 13, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { title: o.label, children: I && !o.active && !o.failure ? "选择一个灵感" : o.label }),
        N.leaves > 0 && /* @__PURE__ */ l("span", { className: "writing-preview-count", children: [
          "已写 ",
          N.completed,
          "/",
          N.leaves,
          " 章",
          o.active && o.target > 1 ? ` · 本次 ${o.committed}/${o.target}` : ""
        ] })
      ]
    }
  ), T = /* @__PURE__ */ l(z, { children: [
    H,
    G && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "nodrag nopan",
        disabled: w || i.readonly || k,
        onPointerDown: (s) => s.stopPropagation(),
        onClick: (s) => {
          s.stopPropagation(), C ? i.onStopCanvasRun?.() : _();
        },
        children: [
          /* @__PURE__ */ e(U, { size: 12 }),
          "停止"
        ]
      }
    )
  ] }), L = /* @__PURE__ */ l("section", { className: "writing-preview", "aria-label": `${b.title}预览`, children: [
    /* @__PURE__ */ l("header", { className: "writing-preview-header", children: [
      S ? D : /* @__PURE__ */ e("span", { className: "writing-preview-eyebrow", children: "已选灵感" }),
      /* @__PURE__ */ l("div", { className: "writing-preview-actions", children: [
        S && T,
        I && !o.active && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "writing-preview-batch nodrag nopan",
            disabled: w || !!i.readonly,
            onPointerDown: (s) => s.stopPropagation(),
            onClick: (s) => {
              s.stopPropagation(), n.action("generate_inspirations");
            },
            children: [
              /* @__PURE__ */ e(F, { size: 13 }),
              "换一批"
            ]
          }
        ),
        en(a) && /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: !i.onOpenDetail,
            onPointerDown: (s) => s.stopPropagation(),
            onClick: (s) => {
              s.stopPropagation(), i.onOpenDetail?.(n.snapshotRef.current);
            },
            children: [
              /* @__PURE__ */ e(V, { size: 13 }),
              "打开工作区"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "writing-preview-content", children: E && I ? /* @__PURE__ */ e(
      gn,
      {
        pending: o.active,
        document: E,
        disabled: o.active || w || !!i.readonly,
        onEdit: (s) => f(n.beginInspirationEdit(s)),
        onRegenerate: (s) => {
          n.action(
            "generate_inspirations",
            s ? { inspiration_id: s } : {}
          );
        },
        onSelect: async (s) => {
          await n.action("select_inspiration", {
            inspiration_id: s
          }) && i.onOpenDetail?.(n.snapshotRef.current);
        }
      }
    ) : N.inspiration ? /* @__PURE__ */ l("div", { className: "writing-preview-selected", children: [
      /* @__PURE__ */ e("h3", { children: N.inspiration.title }),
      /* @__PURE__ */ e("p", { children: N.inspiration.content })
    ] }) : o.active && S ? /* @__PURE__ */ e(mn, {}) : /* @__PURE__ */ l("div", { className: "writing-preview-empty", children: [
      /* @__PURE__ */ e(K, { size: 24, strokeWidth: 1.3, "aria-hidden": "true" }),
      /* @__PURE__ */ e("p", { children: y ? "暂无内容，打开工作区继续创作" : "填写提示词，开始创作" })
    ] }) }),
    !S && /* @__PURE__ */ l("footer", { className: "writing-preview-footer", children: [
      D,
      /* @__PURE__ */ e("div", { className: "writing-preview-actions", children: T })
    ] })
  ] });
  return /* @__PURE__ */ l(z, { children: [
    i.renderFrame(L, P, o.active),
    r && /* @__PURE__ */ e(A, { fallback: null, children: /* @__PURE__ */ e(hn, { title: "生成错误", onClose: () => d(!1), children: /* @__PURE__ */ e("div", { className: "writing-preview-error-detail", role: "alert", children: o.failure || h }) }) }),
    p && /* @__PURE__ */ e(A, { fallback: null, children: /* @__PURE__ */ e(
      fn,
      {
        edit: p,
        disabled: o.active || w || !!i.readonly,
        onSave: (s) => n.saveInspiration(p, s),
        onRegenerate: () => n.regenerateInspiration(p),
        onClose: () => f(null)
      }
    ) })
  ] });
}
export {
  Rn as WritingPreview
};
