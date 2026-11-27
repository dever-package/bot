import { a as o, j as e, S as be } from "./preloadable-CbkzeflN.js";
import { r as te, af as ye, c as ge, a5 as ve, d as we, ag as fe, h as le, P as Ne, X as De, n as Ce } from "./vendor-icons-B1zF1_4n.js";
import { a as d, n as Se, b as de, d as ce } from "./file-kind-X0KKJPkQ.js";
import { M as _e, z as Ie, a as Ee, s as ne, A as ke } from "./asset-audio-preview-DlcU6JQ0.js";
import { D as ue, g as Oe, h as Le, B as Te } from "./asset-preview-B63J-8X6.js";
import { w as ie, s as Re, f as Ae } from "./space-storyboard-shot-request-BudkUmzN.js";
import { S as Pe } from "./space-sequence-card-B6lMLDcV.js";
/* empty css                               */
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-material-dialog-BSWjH2Kl.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const q = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!q || Object.keys(q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const ze = q.Dialog, Fe = q.DialogContent, Me = q.DialogDescription, xe = q.DialogTitle, Be = [
  { key: "camera", label: "镜头语言" },
  { key: "image", label: "图片提示词" },
  { key: "video", label: "视频提示词" }
];
function $e({ storyboard: i, index: a, groups: z, promptVersion: h, onSave: c, onGenerate: L, onCreateRevision: T, onClose: S }) {
  const [p, k] = d(i), [y] = d(i), [_, H] = d(""), [R, b] = d("camera"), w = Se(), f = y.shots[a], N = p.shots[a], [O, j] = d(String(N.duration)), [D, g] = d(""), [x, F] = d(""), [A, B] = d(!1), s = de(null), m = !c, v = J(a), I = O !== String(f.duration) || JSON.stringify(p.shots) !== JSON.stringify(y.shots), r = Number(O), M = Math.max(_e, ...N.captions.map((t) => Math.ceil(t.end_time))), U = Number.isSafeInteger(r) && r >= M, { start: E, end: $ } = Ie(p.shots, a, p.chapter_boundary?.connection === "continue"), he = p.shots[a + 1]?.continue_previous, oe = z?.flatMap((t) => t.results) || [], me = oe.find(({ node: t }) => t.storyboardItem?.itemType === "shot" && t.storyboardItem.shotId === N.id)?.node;
  ce(() => {
    const t = document.activeElement;
    return () => {
      t instanceof HTMLElement && t.isConnected && t.focus({ preventScroll: !0 });
    };
  }, []);
  const X = (t, l) => {
    k((n) => ({ ...n, shots: n.shots.map((u, C) => C === t ? l(u) : u) }));
  }, K = (t, l) => {
    X(a, (n) => ({ ...n, ...Re(n, t, l) }));
  }, P = !!D, Q = async (t, l) => {
    if (!P) {
      g(t), F("");
      try {
        await l(), S();
      } catch (n) {
        F(n instanceof Error ? n.message : "操作失败，请重试");
      } finally {
        g("");
      }
    }
  }, re = D === "save" || D === "revision", G = () => {
    if (!re) {
      if (!I) {
        S();
        return;
      }
      s.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, B(!0);
    }
  }, Z = (t, l, n, u = 3) => /* @__PURE__ */ o("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e("textarea", { rows: u, value: l, readOnly: m || P, onChange: (C) => n(C.target.value) })
  ] }), ee = (t, l, n, u) => {
    const C = p.shots[l];
    return /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-prompt", children: [
      u ? /* @__PURE__ */ e("small", { children: u }) : null,
      /* @__PURE__ */ o("label", { className: "ws-storyboard-shot-field", children: [
        /* @__PURE__ */ e("span", { children: t }),
        /* @__PURE__ */ e(
          "textarea",
          {
            rows: 4,
            value: C.prompt_overrides?.[n] ?? ne(C, n),
            readOnly: m || P,
            onChange: (Y) => {
              const V = Y.target.value;
              X(l, (ae) => ({ ...ae, prompt_overrides: { ...ae.prompt_overrides, [n]: V } }));
            }
          }
        )
      ] }),
      !m && C.prompt_overrides?.[n] !== void 0 ? /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-storyboard-shot-action",
          disabled: P,
          onClick: () => X(l, (Y) => ie(Y, n, ne(Y, n))),
          children: "恢复自动"
        }
      ) : null
    ] });
  }, se = (t, l) => {
    const n = t === "entry" ? E : $;
    n && X(n.shotIndex, (u) => ({ ...u, continuity_state: {
      ...u.continuity_state,
      [n.role === "start" ? "entry" : "exit"]: l
    } }));
  }, pe = () => {
    !c || !I || !U || Q("save", async () => {
      const t = p.shots.map((l, n) => {
        let u = n === a ? {
          ...l,
          duration: r,
          capture_duration: l.capture_duration != null && l.capture_duration >= r ? l.capture_duration : void 0
        } : l;
        for (const C of ["start", "end", "video"])
          u.prompt_overrides?.[C] !== void 0 && (u = ie(u, C, u.prompt_overrides[C]));
        return u;
      });
      await c({ ...p, shots: t }, y);
    });
  };
  return /* @__PURE__ */ o(
    Le,
    {
      ariaLabel: v + "编辑",
      layer: "nested",
      className: "ws-storyboard-shot-edit-layer",
      onRequestClose: G,
      header: /* @__PURE__ */ e(Oe, { icon: /* @__PURE__ */ e(ve, { size: 16 }), title: v, subtitle: m ? N.duration + " 秒" : "微调镜头", onClose: G }),
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
                      disabled: P,
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
                  readOnly: P,
                  onChange: (t) => K("description", t.target.value)
                }
              )
            ] }),
            L ? /* @__PURE__ */ o("form", { className: "ws-storyboard-shot-rewrite", onSubmit: (t) => {
              t.preventDefault(), t.stopPropagation(), I || Q("generate", () => L(_.trim()));
            }, children: [
              /* @__PURE__ */ e("label", { htmlFor: w + "-instruction", children: "用一句话改这一镜" }),
              /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-rewrite-row", children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    id: w + "-instruction",
                    placeholder: "例如：沿着纸船平稳跟拍",
                    value: _,
                    disabled: P,
                    onChange: (t) => H(t.target.value)
                  }
                ),
                /* @__PURE__ */ o("button", { type: "submit", className: "ws-storyboard-shot-action", disabled: P || I, children: [
                  D === "generate" ? /* @__PURE__ */ e(te, { size: 14, className: "ws-spin", "aria-hidden": "true" }) : /* @__PURE__ */ e(ye, { size: 14, "aria-hidden": "true" }),
                  D === "generate" ? "编排中…" : "重新编排"
                ] })
              ] }),
              /* @__PURE__ */ e("small", { children: I ? "先保存手动改动，再重新编排。" : "只重写这一镜的脚本。" })
            ] }) : null,
            /* @__PURE__ */ o("details", { className: "ws-storyboard-shot-edit-options", open: !0, children: [
              /* @__PURE__ */ o("summary", { children: [
                /* @__PURE__ */ e("span", { children: "精细调整" }),
                /* @__PURE__ */ e("small", { children: "运镜、图片和视频提示词" }),
                /* @__PURE__ */ e(ge, { size: 16, "aria-hidden": "true" })
              ] }),
              /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-picker", role: "radiogroup", "aria-label": "选择微调内容", children: Be.map(({ key: t, label: l }) => /* @__PURE__ */ o("label", { children: [
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
                /* @__PURE__ */ e("span", { children: l })
              ] }, t)) }),
              /* @__PURE__ */ o("div", { id: w + "-camera", className: "ws-storyboard-shot-detail-fields", hidden: R !== "camera", children: [
                Z("机位与运镜", N.camera_instruction, (t) => K("camera_instruction", t)),
                Z("场内位置与空间关系", N.spatial_layout, (t) => K("spatial_layout", t)),
                E ? Z("开场状态", p.shots[E.shotIndex].continuity_state[E.role === "end" ? "exit" : "entry"], (t) => se("entry", t)) : /* @__PURE__ */ e("small", { children: "开场承接上一章节的尾帧。" }),
                Z("结束状态", N.continuity_state.exit, (t) => se("exit", t))
              ] }),
              /* @__PURE__ */ o("div", { id: w + "-image", className: "ws-storyboard-shot-detail-fields", hidden: R !== "image", children: [
                E ? ee(
                  "首帧构图",
                  E.shotIndex,
                  E.role,
                  E.shotIndex !== a ? "与" + J(E.shotIndex) + "的尾帧共用同一张图。" : void 0
                ) : /* @__PURE__ */ e("small", { children: "首帧使用上一章节的尾帧。" }),
                ee("尾帧构图", a, "end", he ? "此尾帧也是" + J(a + 1) + "的首帧。" : void 0)
              ] }),
              /* @__PURE__ */ o("div", { id: w + "-video", className: "ws-storyboard-shot-detail-fields", hidden: R !== "video", children: [
                ee("镜内动作、速度与声音", a, "video"),
                /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-bindings", "aria-label": "绑定的参考图", children: [E, $].map((t, l) => {
                  const n = l === 0 ? "首帧" : "尾帧", u = t && oe.find(({ node: V }) => V.storyboardItem?.itemType === "shot_image" && V.storyboardItem.shotId === t.shotId && V.storyboardItem.frameRole === t.role), C = u?.status === "complete" ? Ee(u.node.resultOutput ?? u.node.asset?.version?.content, "image")[0] : "", Y = t ? J(t.shotIndex) + "的" + (t.role === "start" ? "首帧" : "尾帧") : "上一章节的尾帧";
                  return /* @__PURE__ */ o("div", { children: [
                    C ? /* @__PURE__ */ e("img", { src: C, alt: "", loading: "lazy" }) : null,
                    /* @__PURE__ */ o("span", { children: [
                      n,
                      /* @__PURE__ */ e("small", { children: Y })
                    ] })
                  ] }, n);
                }) }),
                h ? /* @__PURE__ */ e(He, { version: h, shotId: N.id, node: me, dirty: I }) : null
              ] })
            ] }),
            x ? /* @__PURE__ */ e("p", { role: "alert", className: "ws-storyboard-shot-list-error", children: x }) : null
          ] }),
          /* @__PURE__ */ o("footer", { className: "ws-storyboard-shot-editor-footer", children: [
            /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action", onClick: G, disabled: re, children: m ? "关闭" : "取消" }),
            c ? /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-primary", onClick: pe, disabled: !I || !U || P, children: D === "save" ? "保存中" : "保存微调" }) : T ? /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action is-primary", disabled: P, onClick: () => {
              Q("revision", T);
            }, children: D === "revision" ? "创建中" : "创建修订稿" }) : null
          ] })
        ] }),
        A ? /* @__PURE__ */ e(ze, { open: !0, onOpenChange: (t) => !t && B(!1), children: /* @__PURE__ */ o(
          Fe,
          {
            role: "alertdialog",
            className: "ws-storyboard-shot-discard nodrag nopan nowheel",
            layerClassName: "wb-detail-backdrop is-dialog-layer",
            layerZIndex: ue,
            showCloseButton: !1,
            onCloseAutoFocus: (t) => {
              t.preventDefault(), s.current?.isConnected && s.current.focus({ preventScroll: !0 });
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
function He({ version: i, shotId: a, node: z, dirty: h }) {
  const [c, L] = d(""), [T, S] = d(""), [p, k] = d(!1), y = async () => {
    k(!0), S("");
    try {
      L(await Ae(i, a, z));
    } catch (_) {
      S(_ instanceof Error ? _.message : "读取制作提示词失败");
    } finally {
      k(!1);
    }
  };
  return /* @__PURE__ */ o("details", { className: "ws-storyboard-shot-request-preview", onToggle: (_) => {
    _.currentTarget.open && !h && !c && !T && !p && y();
  }, children: [
    /* @__PURE__ */ e("summary", { children: "查看完整制作提示词" }),
    h ? /* @__PURE__ */ e("p", { children: "保存微调后可查看更新后的提示词。" }) : p ? /* @__PURE__ */ e("p", { role: "status", children: "正在读取提示词…" }) : T ? /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ e("p", { role: "alert", children: T }),
      /* @__PURE__ */ e("button", { type: "button", className: "ws-storyboard-shot-action", onClick: () => {
        y();
      }, children: "重试" })
    ] }) : c ? /* @__PURE__ */ e("pre", { children: c }) : null
  ] });
}
function J(i) {
  return "镜头 " + String(i + 1).padStart(2, "0");
}
function Ge({
  shots: i,
  storyboard: a,
  groups: z,
  promptVersion: h,
  onGenerate: c,
  onSave: L,
  onCreateRevision: T,
  onBusyChange: S,
  disabled: p = !1,
  rowActions: k
}) {
  const [y, _] = d(""), [H, R] = d(!1), [b, w] = d(""), [f, N] = d(null), [O, j] = d(""), D = de(!1), g = p || f !== null, x = y ? a?.shots.findIndex((s) => s.id === y) ?? -1 : -1, F = !!((c || f === "") && i.length < ke), A = async (s, m) => {
    if (g || D.current) throw new Error("另一个镜头操作正在进行");
    D.current = !0, N(s), j(""), S?.(!0);
    try {
      await m();
    } finally {
      D.current = !1, N(null), S?.(!1);
    }
  }, B = async () => {
    if (!(!c || !b.trim()))
      try {
        await A("", () => c("", b.trim())), R(!1), w("");
      } catch (s) {
        j(s instanceof Error ? s.message : "镜头生成失败，请重试");
      }
  };
  return /* @__PURE__ */ o("div", { className: "ws-storyboard-shot-list nodrag nopan", "aria-busy": g || void 0, children: [
    /* @__PURE__ */ e("ol", { className: "ws-storyboard-shot-grid", "aria-label": "镜头列表", children: i.map((s, m) => {
      const v = g ? void 0 : k?.(s), r = "镜头 " + String(m + 1).padStart(2, "0"), M = f === s.id, U = L ? "微调" : "提示词", E = a && !g ? () => _(s.id) : () => {
      };
      return /* @__PURE__ */ e("li", { className: "ws-storyboard-shot-item", children: /* @__PURE__ */ o(
        Pe,
        {
          itemId: s.id,
          index: m,
          durationLabel: s.duration + " 秒",
          className: "ws-storyboard-shot-row",
          dragClassName: "ws-storyboard-shot-grip",
          readonly: !v?.onDragStart,
          wholeCardDraggable: !0,
          dragging: v?.dragging,
          dropPlacement: v?.dropPlacement,
          ariaLabel: r,
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
              "aria-label": "删除" + r,
              title: "删除镜头",
              onClick: ($) => {
                $.stopPropagation(), v.onRemove?.();
              },
              children: /* @__PURE__ */ e(le, { size: 12 })
            }
          ) : void 0,
          children: [
            /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-body", children: /* @__PURE__ */ e("span", { className: "ws-storyboard-shot-description", children: s.description.trim() || s.beat.trim() || "暂无镜头描述" }) }),
            a ? /* @__PURE__ */ o("footer", { children: [
              /* @__PURE__ */ o(
                "button",
                {
                  type: "button",
                  "aria-label": r + "，" + U,
                  "aria-haspopup": "dialog",
                  disabled: g,
                  onClick: ($) => {
                    $.stopPropagation(), _(s.id);
                  },
                  children: [
                    U,
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
                  "aria-label": "复制" + r,
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
      ) }, s.id);
    }) }),
    F && !H ? /* @__PURE__ */ o(
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
    !i.length && !F ? /* @__PURE__ */ e("p", { className: "ws-storyboard-shot-list-empty", children: "暂无镜头" }) : null,
    F && H ? /* @__PURE__ */ o("form", { className: "ws-storyboard-add-shot", onSubmit: (s) => {
      s.preventDefault(), s.stopPropagation(), B();
    }, children: [
      /* @__PURE__ */ e(
        "input",
        {
          type: "text",
          autoFocus: !0,
          value: b,
          "aria-label": "新镜头的一句话描述",
          placeholder: "用一句话描述新镜头",
          onChange: (s) => w(s.target.value),
          onKeyDown: (s) => s.stopPropagation(),
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
        groups: z,
        promptVersion: h,
        onGenerate: c ? (s) => A(y, () => c(y, s)) : void 0,
        onSave: L ? (s, m) => A(y, () => L(s, m)) : void 0,
        onCreateRevision: T,
        onClose: () => _("")
      },
      y + ":" + (h?.versionId || 0) + ":" + x
    ) : null,
    O ? /* @__PURE__ */ e("p", { className: "ws-storyboard-shot-list-error", role: "alert", children: O }) : null
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const W = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!W || Object.keys(W).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const je = W.Dialog, Ye = W.DialogContent, qe = W.DialogTitle;
function et({
  material: i,
  creating: a = !1,
  context: z = "storyboard",
  readonly: h,
  usage: c,
  existingNames: L = [],
  onSave: T,
  onRemove: S,
  onClose: p,
  loadVoiceOptions: k
}) {
  const [y, _] = d(i.name), [H, R] = d(i.prompt), [b, w] = d(i.voice), [f, N] = d(null), [O, j] = d(""), D = i.type === "character" && !!k;
  ce(() => {
    if (!D || !k) return;
    let r = !1;
    return k().then(
      (M) => {
        r || N(M);
      },
      (M) => {
        r || j(M instanceof Error ? M.message : "读取音色失败");
      }
    ), () => {
      r = !0;
    };
  }, [D, k]);
  const [g, x] = d(!1), [F] = d(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), A = y.trim().replace(/^[@#]+/, ""), B = H.trim(), s = L.some(
    (r) => r.trim().toLocaleLowerCase() === A.toLocaleLowerCase()
  ), m = (c?.shotIds.length || 0) + (c?.speechIds.length || 0), v = !a && !h && !!S && m === 0, I = be[i.type];
  return /* @__PURE__ */ e(je, { open: !0, onOpenChange: (r) => !r && p(), children: /* @__PURE__ */ o(
    Ye,
    {
      className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog nodrag nopan nowheel",
      layerClassName: "wb-detail-backdrop is-dialog-layer",
      layerZIndex: ue + 20,
      showCloseButton: !1,
      "aria-describedby": void 0,
      onCloseAutoFocus: (r) => {
        F?.isConnected && (r.preventDefault(), F.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ o("header", { children: [
          /* @__PURE__ */ o("div", { children: [
            /* @__PURE__ */ e(qe, { children: a ? `新增${I}` : i.name || I }),
            /* @__PURE__ */ o("span", { children: [
              I,
              "素材",
              h ? " · 当前版本只读" : a ? z === "setting" ? " · 保存到共用设定" : " · 保存后加入当前分镜草稿" : z === "setting" ? " · 所连接的分镜共用此设定" : " · 修改会保存到当前分镜草稿"
            ] })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: p, children: /* @__PURE__ */ e(De, { size: 18 }) })
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
                onChange: (r) => _(r.target.value)
              }
            ),
            s ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
          ] }),
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "生成提示词" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                value: H,
                readOnly: h,
                placeholder: `描述${A || I}的外观、结构、材质与风格`,
                onChange: (r) => R(r.target.value)
              }
            )
          ] }),
          i.type === "character" && D ? /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色" }),
            f && f.length > 0 ? /* @__PURE__ */ o("select", { value: b, disabled: h, onChange: (r) => w(r.target.value), children: [
              /* @__PURE__ */ e("option", { value: "", children: "暂不指定" }),
              b && !f.some((r) => r.value === b) ? /* @__PURE__ */ o("option", { value: b, children: [
                "当前值：",
                b
              ] }) : null,
              f.map((r) => /* @__PURE__ */ e("option", { value: r.value, children: r.group ? `${r.group} · ${r.name}` : r.name }, r.id || r.value))
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
                onChange: (r) => w(r.target.value)
              }
            ),
            /* @__PURE__ */ e("small", { children: "填写当前语音能力支持的音色值。" })
          ] }) : null,
          !a && m > 0 ? /* @__PURE__ */ o("div", { className: "ws-storyboard-material-usage", role: "note", children: [
            /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
            /* @__PURE__ */ o("span", { children: [
              c?.shotIds.length || 0,
              " 个镜头",
              c?.speechIds.length ? ` · ${c.speechIds.length} 条对白` : "",
              "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
            ] })
          ] }) : null,
          /* @__PURE__ */ e("p", { children: z === "setting" ? "修改后保留旧形象，重新生成或上传替换后用于后续制作。" : "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
        ] }),
        /* @__PURE__ */ o("footer", { children: [
          /* @__PURE__ */ e("div", { children: !h && !a && S ? /* @__PURE__ */ e(
            Te,
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
                disabled: !A || !B || s,
                onClick: () => T({
                  ...i,
                  name: A,
                  prompt: B,
                  voice: i.type === "character" ? b.trim() : ""
                }),
                children: [
                  /* @__PURE__ */ e(Ce, { size: 14 }),
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
