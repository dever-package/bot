import { a as o, j as e, S as be } from "./preloadable-R-5sHdlM.js";
import { r as te, af as ye, c as ge, a5 as ve, d as we, ag as fe, h as le, P as Ne, X as Ce, n as De } from "./vendor-icons-IZIW7U43.js";
import { a as l, n as Se, b as de, d as ce } from "./file-kind-Cq3pESGF.js";
import { d as Ie, D as ue, m as _e, n as Ee, B as ke } from "./asset-audio-preview-Du5K0btg.js";
import { M as Oe, t as Le, s as ne, u as Te } from "./asset-preview-DpK5-z_L.js";
import { w as ie, s as Re, f as Pe } from "./space-storyboard-shot-request-CJHNC9nE.js";
import { S as Ae } from "./space-sequence-card-ZRyRNc1-.js";
/* empty css                               */
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-material-dialog-CXKIFlpm.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const Fe = Y.Dialog, ze = Y.DialogContent, Me = Y.DialogDescription, xe = Y.DialogTitle, Be = [
  { key: "camera", label: "镜头语言" },
  { key: "image", label: "图片提示词" },
  { key: "video", label: "视频提示词" }
];
function $e({ storyboard: i, index: a, groups: F, promptVersion: h, onSave: d, onGenerate: L, onCreateRevision: T, onClose: S }) {
  const [p, k] = l(i), [y] = l(i), [I, H] = l(""), [R, b] = l("camera"), w = Se(), f = y.shots[a], N = p.shots[a], [O, j] = l(String(N.duration)), [C, g] = l(""), [x, z] = l(""), [P, B] = l(!1), r = de(null), m = !d, v = K(a), _ = O !== String(f.duration) || JSON.stringify(p.shots) !== JSON.stringify(y.shots), s = Number(O), M = Math.max(Oe, ...N.captions.map((t) => Math.ceil(t.end_time))), q = Number.isSafeInteger(s) && s >= M, { start: E, end: $ } = Le(p.shots, a, p.chapter_boundary?.connection === "continue"), he = p.shots[a + 1]?.continue_previous, oe = F?.flatMap((t) => t.results) || [], me = oe.find(({ node: t }) => t.storyboardItem?.itemType === "shot" && t.storyboardItem.shotId === N.id)?.node;
  ce(() => {
    const t = document.activeElement;
    return () => {
      t instanceof HTMLElement && t.isConnected && t.focus({ preventScroll: !0 });
    };
  }, []);
  const Z = (t, c) => {
    k((n) => ({ ...n, shots: n.shots.map((u, D) => D === t ? c(u) : u) }));
  }, W = (t, c) => {
    Z(a, (n) => ({ ...n, ...Re(n, t, c) }));
  }, A = !!C, Q = async (t, c) => {
    if (!A) {
      g(t), z("");
      try {
        await c(), S();
      } catch (n) {
        z(n instanceof Error ? n.message : "操作失败，请重试");
      } finally {
        g("");
      }
    }
  }, se = C === "save" || C === "revision", G = () => {
    if (!se) {
      if (!_) {
        S();
        return;
      }
      r.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, B(!0);
    }
  }, J = (t, c, n, u = 3) => /* @__PURE__ */ o("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e("textarea", { rows: u, value: c, readOnly: m || A, onChange: (D) => n(D.target.value) })
  ] }), ee = (t, c, n, u) => {
    const D = p.shots[c];
    return /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-prompt", children: [
      u ? /* @__PURE__ */ e("small", { children: u }) : null,
      /* @__PURE__ */ o("label", { className: "ws-storyboard-shot-field", children: [
        /* @__PURE__ */ e("span", { children: t }),
        /* @__PURE__ */ e(
          "textarea",
          {
            rows: 4,
            value: D.prompt_overrides?.[n] ?? ne(D, n),
            readOnly: m || A,
            onChange: (X) => {
              const U = X.target.value;
              Z(c, (ae) => ({ ...ae, prompt_overrides: { ...ae.prompt_overrides, [n]: U } }));
            }
          }
        )
      ] }),
      !m && D.prompt_overrides?.[n] !== void 0 ? /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-storyboard-shot-action",
          disabled: A,
          onClick: () => Z(c, (X) => ie(X, n, ne(X, n))),
          children: "恢复自动"
        }
      ) : null
    ] });
  }, re = (t, c) => {
    const n = t === "entry" ? E : $;
    n && Z(n.shotIndex, (u) => ({ ...u, continuity_state: {
      ...u.continuity_state,
      [n.role === "start" ? "entry" : "exit"]: c
    } }));
  }, pe = () => {
    !d || !_ || !q || Q("save", async () => {
      const t = p.shots.map((c, n) => {
        let u = n === a ? { ...c, duration: s } : c;
        for (const D of ["start", "end", "video"])
          u.prompt_overrides?.[D] !== void 0 && (u = ie(u, D, u.prompt_overrides[D]));
        return u;
      });
      await d({ ...p, shots: t }, y);
    });
  };
  return /* @__PURE__ */ o(
    Ee,
    {
      ariaLabel: v + "编辑",
      layer: "nested",
      className: "ws-storyboard-shot-edit-layer",
      onRequestClose: G,
      header: /* @__PURE__ */ e(_e, { icon: /* @__PURE__ */ e(ve, { size: 16 }), title: v, subtitle: m ? N.duration + " 秒" : "微调镜头", onClose: G }),
      children: [
        /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-editor", children: [
          /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-editor-body", children: [
            /* @__PURE__ */ o("section", { className: "ws-storyboard-shot-brief", "aria-label": "镜头概况", children: [
              /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-brief-head", children: [
                m ? /* @__PURE__ */ e("span", { children: "镜头描述" }) : /* @__PURE__ */ e("label", { htmlFor: w + "-description", children: "镜头描述" }),
                m ? null : /* @__PURE__ */ o("label", { className: "ws-storyboard-shot-duration", children: [
                  "时长",
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "number",
                      "aria-label": "时长（秒）",
                      min: M,
                      step: 1,
                      value: O,
                      disabled: A,
                      onChange: (t) => j(t.target.value)
                    }
                  ),
                  "秒"
                ] })
              ] }),
              m ? /* @__PURE__ */ e("p", { children: N.description }) : /* @__PURE__ */ e(
                "textarea",
                {
                  id: w + "-description",
                  rows: 3,
                  value: N.description,
                  readOnly: A,
                  onChange: (t) => W("description", t.target.value)
                }
              )
            ] }),
            L ? /* @__PURE__ */ o("form", { className: "ws-storyboard-shot-rewrite", onSubmit: (t) => {
              t.preventDefault(), t.stopPropagation(), _ || Q("generate", () => L(I.trim()));
            }, children: [
              /* @__PURE__ */ e("label", { htmlFor: w + "-instruction", children: "用一句话改这一镜" }),
              /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-rewrite-row", children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    id: w + "-instruction",
                    placeholder: "例如：沿着纸船平稳跟拍",
                    value: I,
                    disabled: A,
                    onChange: (t) => H(t.target.value)
                  }
                ),
                /* @__PURE__ */ o("button", { type: "submit", className: "ws-storyboard-shot-action", disabled: A || _, children: [
                  C === "generate" ? /* @__PURE__ */ e(te, { size: 14, className: "ws-spin", "aria-hidden": "true" }) : /* @__PURE__ */ e(ye, { size: 14, "aria-hidden": "true" }),
                  C === "generate" ? "编排中…" : "重新编排"
                ] })
              ] }),
              /* @__PURE__ */ e("small", { children: _ ? "先保存手动改动，再重新编排。" : "只重写这一镜的脚本。" })
            ] }) : null,
            /* @__PURE__ */ o("details", { className: "ws-storyboard-shot-edit-options", open: !0, children: [
              /* @__PURE__ */ o("summary", { children: [
                /* @__PURE__ */ e("span", { children: "精细调整" }),
                /* @__PURE__ */ e("small", { children: "运镜、图片和视频提示词" }),
                /* @__PURE__ */ e(ge, { size: 16, "aria-hidden": "true" })
              ] }),
              /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-picker", role: "radiogroup", "aria-label": "选择微调内容", children: Be.map(({ key: t, label: c }) => /* @__PURE__ */ o("label", { children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "radio",
                    name: w + "-section",
                    checked: R === t,
                    "aria-controls": w + "-" + t,
                    onChange: () => b(t)
                  }
                ),
                /* @__PURE__ */ e("span", { children: c })
              ] }, t)) }),
              /* @__PURE__ */ o("div", { id: w + "-camera", className: "ws-storyboard-shot-detail-fields", hidden: R !== "camera", children: [
                J("机位与运镜", N.camera_instruction, (t) => W("camera_instruction", t)),
                J("场内位置与空间关系", N.spatial_layout, (t) => W("spatial_layout", t)),
                E ? J("开场状态", p.shots[E.shotIndex].continuity_state[E.role === "end" ? "exit" : "entry"], (t) => re("entry", t)) : /* @__PURE__ */ e("small", { children: "开场承接上一章节的尾帧。" }),
                J("结束状态", N.continuity_state.exit, (t) => re("exit", t))
              ] }),
              /* @__PURE__ */ o("div", { id: w + "-image", className: "ws-storyboard-shot-detail-fields", hidden: R !== "image", children: [
                E ? ee(
                  "首帧构图",
                  E.shotIndex,
                  E.role,
                  E.shotIndex !== a ? "与" + K(E.shotIndex) + "的尾帧共用同一张图。" : void 0
                ) : /* @__PURE__ */ e("small", { children: "首帧使用上一章节的尾帧。" }),
                ee("尾帧构图", a, "end", he ? "此尾帧也是" + K(a + 1) + "的首帧。" : void 0)
              ] }),
              /* @__PURE__ */ o("div", { id: w + "-video", className: "ws-storyboard-shot-detail-fields", hidden: R !== "video", children: [
                ee("镜内动作、速度与声音", a, "video"),
                /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-bindings", "aria-label": "绑定的参考图", children: [E, $].map((t, c) => {
                  const n = c === 0 ? "首帧" : "尾帧", u = t && oe.find(({ node: U }) => U.storyboardItem?.itemType === "shot_image" && U.storyboardItem.shotId === t.shotId && U.storyboardItem.frameRole === t.role), D = u?.status === "complete" ? Ie(u.node.resultOutput ?? u.node.asset?.version?.content, "image")[0] : "", X = t ? K(t.shotIndex) + "的" + (t.role === "start" ? "首帧" : "尾帧") : "上一章节的尾帧";
                  return /* @__PURE__ */ o("div", { children: [
                    D ? /* @__PURE__ */ e("img", { src: D, alt: "", loading: "lazy" }) : null,
                    /* @__PURE__ */ o("span", { children: [
                      n,
                      /* @__PURE__ */ e("small", { children: X })
                    ] })
                  ] }, n);
                }) }),
                h ? /* @__PURE__ */ e(He, { version: h, shotId: N.id, node: me, dirty: _ }) : null
              ] })
            ] }),
            x ? /* @__PURE__ */ e("p", { role: "alert", className: "ws-storyboard-shot-list-error", children: x }) : null
          ] }),
          /* @__PURE__ */ o("footer", { className: "ws-storyboard-shot-editor-footer", children: [
            /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action", onClick: G, disabled: se, children: m ? "关闭" : "取消" }),
            d ? /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-primary", onClick: pe, disabled: !_ || !q || A, children: C === "save" ? "保存中" : "保存微调" }) : T ? /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-primary", disabled: A, onClick: () => {
              Q("revision", T);
            }, children: C === "revision" ? "创建中" : "创建修订稿" }) : null
          ] })
        ] }),
        P ? /* @__PURE__ */ e(Fe, { open: !0, onOpenChange: (t) => !t && B(!1), children: /* @__PURE__ */ o(
          ze,
          {
            role: "alertdialog",
            className: "ws-storyboard-shot-discard nodrag nopan nowheel",
            layerClassName: "wb-detail-backdrop is-dialog-layer",
            layerZIndex: ue,
            showCloseButton: !1,
            onCloseAutoFocus: (t) => {
              t.preventDefault(), r.current?.isConnected && r.current.focus({ preventScroll: !0 });
            },
            children: [
              /* @__PURE__ */ e(xe, { children: "镜头修改尚未保存" }),
              /* @__PURE__ */ e(Me, { children: "放弃后，本次微调不会保存。" }),
              /* @__PURE__ */ o("footer", { children: [
                /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-primary", onClick: () => B(!1), children: "继续编辑" }),
                /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-danger", onClick: S, children: "放弃修改" })
              ] })
            ]
          }
        ) }) : null
      ]
    }
  );
}
function He({ version: i, shotId: a, node: F, dirty: h }) {
  const [d, L] = l(""), [T, S] = l(""), [p, k] = l(!1), y = async () => {
    k(!0), S("");
    try {
      L(await Pe(i, a, F));
    } catch (I) {
      S(I instanceof Error ? I.message : "读取制作提示词失败");
    } finally {
      k(!1);
    }
  };
  return /* @__PURE__ */ o("details", { className: "ws-storyboard-shot-request-preview", onToggle: (I) => {
    I.currentTarget.open && !h && !d && !T && !p && y();
  }, children: [
    /* @__PURE__ */ e("summary", { children: "查看完整制作提示词" }),
    h ? /* @__PURE__ */ e("p", { children: "保存微调后可查看更新后的提示词。" }) : p ? /* @__PURE__ */ e("p", { role: "status", children: "正在读取提示词…" }) : T ? /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ e("p", { role: "alert", children: T }),
      /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action", onClick: () => {
        y();
      }, children: "重试" })
    ] }) : d ? /* @__PURE__ */ e("pre", { children: d }) : null
  ] });
}
function K(i) {
  return "镜头 " + String(i + 1).padStart(2, "0");
}
function Ge({
  shots: i,
  storyboard: a,
  groups: F,
  promptVersion: h,
  onGenerate: d,
  onSave: L,
  onCreateRevision: T,
  onBusyChange: S,
  disabled: p = !1,
  rowActions: k
}) {
  const [y, I] = l(""), [H, R] = l(!1), [b, w] = l(""), [f, N] = l(null), [O, j] = l(""), C = de(!1), g = p || f !== null, x = y ? a?.shots.findIndex((r) => r.id === y) ?? -1 : -1, z = !!((d || f === "") && i.length < Te), P = async (r, m) => {
    if (g || C.current) throw new Error("另一个镜头操作正在进行");
    C.current = !0, N(r), j(""), S?.(!0);
    try {
      await m();
    } finally {
      C.current = !1, N(null), S?.(!1);
    }
  }, B = async () => {
    if (!(!d || !b.trim()))
      try {
        await P("", () => d("", b.trim())), R(!1), w("");
      } catch (r) {
        j(r instanceof Error ? r.message : "镜头生成失败，请重试");
      }
  };
  return /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-list nodrag nopan", "aria-busy": g || void 0, children: [
    /* @__PURE__ */ e("ol", { className: "ws-storyboard-shot-grid", "aria-label": "镜头列表", children: i.map((r, m) => {
      const v = g ? void 0 : k?.(r), s = "镜头 " + String(m + 1).padStart(2, "0"), M = f === r.id, q = L ? "微调" : "提示词", E = a && !g ? () => I(r.id) : () => {
      };
      return /* @__PURE__ */ e("li", { className: "ws-storyboard-shot-item", children: /* @__PURE__ */ o(
        Ae,
        {
          itemId: r.id,
          index: m,
          durationLabel: r.duration + " 秒",
          className: "ws-storyboard-shot-row",
          dragClassName: "ws-storyboard-shot-grip",
          readonly: !v?.onDragStart,
          wholeCardDraggable: !0,
          dragging: v?.dragging,
          dropPlacement: v?.dropPlacement,
          ariaLabel: s,
          onSelect: E,
          onDragStart: v?.onDragStart ?? (() => {
          }),
          onDragOver: v?.onDragOver ?? (() => {
          }),
          onDrop: v?.onDrop ?? (() => {
          }),
          onDragEnd: v?.onDragEnd ?? (() => {
          }),
          headerActions: v?.onRemove ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "ws-storyboard-shot-remove",
              "aria-label": "删除" + s,
              title: "删除镜头",
              onClick: ($) => {
                $.stopPropagation(), v.onRemove?.();
              },
              children: /* @__PURE__ */ e(le, { size: 12 })
            }
          ) : void 0,
          children: [
            /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-body", children: /* @__PURE__ */ e("span", { className: "ws-storyboard-shot-description", children: r.description.trim() || r.beat.trim() || "暂无镜头描述" }) }),
            a ? /* @__PURE__ */ o("footer", { children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  "aria-label": s + "，" + q,
                  "aria-haspopup": "dialog",
                  disabled: g,
                  onClick: ($) => {
                    $.stopPropagation(), I(r.id);
                  },
                  children: [
                    q,
                    /* @__PURE__ */ e(we, { size: 12 })
                  ]
                }
              ),
              M ? /* @__PURE__ */ o("small", { role: "status", children: [
                /* @__PURE__ */ e(te, { size: 12, className: "ws-spin" }),
                "处理中"
              ] }) : null,
              v?.onDuplicate ? /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-shot-copy",
                  "aria-label": "复制" + s,
                  title: "复制镜头",
                  onClick: ($) => {
                    $.stopPropagation(), v.onDuplicate?.();
                  },
                  children: /* @__PURE__ */ e(fe, { size: 13 })
                }
              ) : null
            ] }) : null
          ]
        }
      ) }, r.id);
    }) }),
    z && !H ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "ws-storyboard-shot-action ws-storyboard-add-shot-button",
        disabled: g,
        onClick: () => {
          j(""), R(!0);
        },
        children: [
          /* @__PURE__ */ e(Ne, { size: 15, "aria-hidden": "true" }),
          "添加镜头"
        ]
      }
    ) : null,
    !i.length && !z ? /* @__PURE__ */ e("p", { className: "ws-storyboard-shot-list-empty", children: "暂无镜头" }) : null,
    z && H ? /* @__PURE__ */ o("form", { className: "ws-storyboard-add-shot", onSubmit: (r) => {
      r.preventDefault(), r.stopPropagation(), B();
    }, children: [
      /* @__PURE__ */ e(
        "input",
        {
          type: "text",
          autoFocus: !0,
          value: b,
          "aria-label": "新镜头的一句话描述",
          placeholder: "用一句话描述新镜头",
          onChange: (r) => w(r.target.value),
          onKeyDown: (r) => r.stopPropagation(),
          readOnly: g
        }
      ),
      /* @__PURE__ */ o("button", { type: "submit", className: "ws-storyboard-shot-action is-primary", disabled: g || !b.trim(), children: [
        f === "" ? /* @__PURE__ */ e(te, { size: 14, className: "ws-spin" }) : null,
        f === "" ? "生成中" : "生成镜头"
      ] }),
      /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action", disabled: g, onClick: () => R(!1), children: "取消" })
    ] }) : null,
    x >= 0 && a ? /* @__PURE__ */ e(
      $e,
      {
        storyboard: a,
        index: x,
        groups: F,
        promptVersion: h,
        onGenerate: d ? (r) => P(y, () => d(y, r)) : void 0,
        onSave: L ? (r, m) => P(y, () => L(r, m)) : void 0,
        onCreateRevision: T,
        onClose: () => I("")
      },
      y + ":" + (h?.versionId || 0) + ":" + x
    ) : null,
    O ? /* @__PURE__ */ e("p", { className: "ws-storyboard-shot-list-error", role: "alert", children: O }) : null
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const V = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!V || Object.keys(V).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const je = V.Dialog, Xe = V.DialogContent, Ye = V.DialogTitle;
function et({
  material: i,
  creating: a = !1,
  context: F = "storyboard",
  readonly: h,
  usage: d,
  existingNames: L = [],
  onSave: T,
  onRemove: S,
  onClose: p,
  loadVoiceOptions: k
}) {
  const [y, I] = l(i.name), [H, R] = l(i.prompt), [b, w] = l(i.voice), [f, N] = l(null), [O, j] = l(""), C = i.type === "character" && !!k;
  ce(() => {
    if (!C || !k) return;
    let s = !1;
    return k().then(
      (M) => {
        s || N(M);
      },
      (M) => {
        s || j(M instanceof Error ? M.message : "读取音色失败");
      }
    ), () => {
      s = !0;
    };
  }, [C, k]);
  const [g, x] = l(!1), [z] = l(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), P = y.trim().replace(/^[@#]+/, ""), B = H.trim(), r = L.some(
    (s) => s.trim().toLocaleLowerCase() === P.toLocaleLowerCase()
  ), m = (d?.shotIds.length || 0) + (d?.speechIds.length || 0), v = !a && !h && !!S && m === 0, _ = be[i.type];
  return /* @__PURE__ */ e(je, { open: !0, onOpenChange: (s) => !s && p(), children: /* @__PURE__ */ o(
    Xe,
    {
      className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog nodrag nopan nowheel",
      layerClassName: "wb-detail-backdrop is-dialog-layer",
      layerZIndex: ue + 20,
      showCloseButton: !1,
      "aria-describedby": void 0,
      onCloseAutoFocus: (s) => {
        z?.isConnected && (s.preventDefault(), z.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ o("header", { children: [
          /* @__PURE__ */ o("div", { children: [
            /* @__PURE__ */ e(Ye, { children: a ? `新增${_}` : i.name || _ }),
            /* @__PURE__ */ o("span", { children: [
              _,
              "素材",
              h ? " · 当前版本只读" : a ? F === "setting" ? " · 保存到共用设定" : " · 保存后加入当前分镜草稿" : F === "setting" ? " · 所连接的分镜共用此设定" : " · 修改会保存到当前分镜草稿"
            ] })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: p, children: /* @__PURE__ */ e(Ce, { size: 18 }) })
        ] }),
        /* @__PURE__ */ o("div", { className: "ws-storyboard-material-form nowheel", children: [
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "素材名称" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: y,
                readOnly: h,
                autoFocus: !h,
                placeholder: `例如：${i.type === "character" ? "主角" : i.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                onChange: (s) => I(s.target.value)
              }
            ),
            r ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
          ] }),
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "生成提示词" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                value: H,
                readOnly: h,
                placeholder: `描述${P || _}的外观、结构、材质与风格`,
                onChange: (s) => R(s.target.value)
              }
            )
          ] }),
          i.type === "character" && C ? /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色" }),
            f && f.length > 0 ? /* @__PURE__ */ o("select", { value: b, disabled: h, onChange: (s) => w(s.target.value), children: [
              /* @__PURE__ */ e("option", { value: "", children: "暂不指定" }),
              b && !f.some((s) => s.value === b) ? /* @__PURE__ */ o("option", { value: b, children: [
                "当前值：",
                b
              ] }) : null,
              f.map((s) => /* @__PURE__ */ e("option", { value: s.value, children: s.group ? `${s.group} · ${s.name}` : s.name }, s.id || s.value))
            ] }) : /* @__PURE__ */ e("select", { value: b, disabled: !0, children: /* @__PURE__ */ e("option", { value: b, children: O ? "读取音色失败" : f ? b || "暂不指定" : "正在读取音色…" }) }),
            /* @__PURE__ */ e("small", { className: O ? "ws-storyboard-form-error" : void 0, children: O || (f && f.length === 0 ? "当前没有可用的语音合成能力，配置后可在这里选择音色。" : "角色对白自动配音时使用；不指定时可在配音节点里再选。") })
          ] }) : i.type === "character" ? /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: b,
                readOnly: h,
                placeholder: "自动配音时必填",
                onChange: (s) => w(s.target.value)
              }
            ),
            /* @__PURE__ */ e("small", { children: "填写当前语音能力支持的音色值。" })
          ] }) : null,
          !a && m > 0 ? /* @__PURE__ */ o("div", { className: "ws-storyboard-material-usage", role: "note", children: [
            /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
            /* @__PURE__ */ o("span", { children: [
              d?.shotIds.length || 0,
              " 个镜头",
              d?.speechIds.length ? ` · ${d.speechIds.length} 条对白` : "",
              "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
            ] })
          ] }) : null,
          /* @__PURE__ */ e("p", { children: F === "setting" ? "修改后保留旧形象，重新生成或上传替换后用于后续制作。" : "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
        ] }),
        /* @__PURE__ */ o("footer", { children: [
          /* @__PURE__ */ e("div", { children: !h && !a && S ? /* @__PURE__ */ e(
            ke,
            {
              label: m > 0 ? "该素材仍被镜头或对白引用" : g ? "再次点击确认删除" : "删除素材",
              children: /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  className: "is-danger",
                  disabled: !v,
                  onClick: () => {
                    if (!g) {
                      x(!0);
                      return;
                    }
                    S(i.id);
                  },
                  children: [
                    /* @__PURE__ */ e(le, { size: 14 }),
                    g ? "确认删除" : "删除素材"
                  ]
                }
              )
            }
          ) : null }),
          /* @__PURE__ */ o("div", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: p, children: h ? "关闭" : "取消" }),
            h ? null : /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: !P || !B || r,
                onClick: () => T({
                  ...i,
                  name: P,
                  prompt: B,
                  voice: i.type === "character" ? b.trim() : ""
                }),
                children: [
                  /* @__PURE__ */ e(De, { size: 14 }),
                  a ? "添加素材" : "确认修改"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  et as S,
  Ge as a
};
