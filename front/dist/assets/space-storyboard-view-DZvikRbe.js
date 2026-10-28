import { j as e, a as n, F as me } from "./react-5Z-wsVEn.js";
import { a as R, b as $, d as H, u as ue, l as Dt } from "./file-kind-D6bMOzYN.js";
import { X as ot, h as De, n as we, L as Bt, P as he, as as We, at as Ze, aH as $t, B as Be, q as lt, ab as Je, r as Pe, w as At } from "./vendor-icons-fVDtJt66.js";
import { a7 as ae, B as Z, D as Le, a8 as zt, a9 as Qe, aa as Fe, ab as $e, ac as Ke, ad as Pt, ae as Lt, af as Ft, ag as Yt, ah as qt, ai as Vt, aj as Ut, ak as jt, al as Ae, a6 as Ht, m as Xt, am as Gt, an as Wt, ao as et, ap as Zt, aq as Jt, ar as Ee, as as Qt, at as Kt, au as tt, av as en } from "./asset-preview-BZxHU4Mm.js";
import { o as nt, s as tn, u as Me, v as nn, _ as an } from "./space-ordered-list-CBeUyd80.js";
import { u as ct, a as rn, b as sn } from "./space-reference-editor-Bh9oSxH4.js";
import { a as on } from "./space-storyboard-shot-card-DBhEvCn0.js";
import { s as _e, S as ln } from "./space-storyboard-confirm-dialog-0RNJcSS4.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const pe = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!pe || Object.keys(pe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const cn = pe.Dialog, dn = pe.DialogContent, un = pe.DialogTitle;
function dt({
  material: t,
  creating: o = !1,
  readonly: a,
  usage: i,
  existingNames: d = [],
  onSave: h,
  onRemove: g,
  onClose: C
}) {
  const [O, c] = R(t.name), [u, l] = R(t.prompt), [f, N] = R(t.voice), [v, x] = R(!1), [E] = R(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), y = O.trim().replace(/^[@#]+/, ""), L = u.trim(), P = d.some(
    (I) => I.trim().toLocaleLowerCase() === y.toLocaleLowerCase()
  ), F = (i?.shotIds.length || 0) + (i?.speechIds.length || 0), X = !o && !a && !!g && F === 0, T = ae[t.type];
  return /* @__PURE__ */ e(cn, { open: !0, onOpenChange: (I) => !I && C(), children: /* @__PURE__ */ n(
    dn,
    {
      className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog nodrag nopan nowheel",
      layerClassName: "wb-detail-backdrop",
      layerZIndex: Le + 20,
      showCloseButton: !1,
      "aria-describedby": void 0,
      onCloseAutoFocus: (I) => {
        E?.isConnected && (I.preventDefault(), E.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e(un, { children: o ? `新增${T}` : t.name || T }),
            /* @__PURE__ */ n("span", { children: [
              T,
              "素材",
              a ? " · 当前版本只读" : o ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
            ] })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: C, children: /* @__PURE__ */ e(ot, { size: 18 }) })
        ] }),
        /* @__PURE__ */ n("div", { className: "ws-storyboard-material-form nowheel", children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e("span", { children: "素材名称" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: O,
                readOnly: a,
                autoFocus: !a,
                placeholder: `例如：${t.type === "character" ? "主角" : t.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                onChange: (I) => c(I.target.value)
              }
            ),
            P ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
          ] }),
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e("span", { children: "生成提示词" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                value: u,
                readOnly: a,
                placeholder: `描述${y || T}的外观、结构、材质与风格`,
                onChange: (I) => l(I.target.value)
              }
            )
          ] }),
          t.type === "character" ? /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色参数值" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: f,
                readOnly: a,
                placeholder: "自动配音时必填",
                onChange: (I) => N(I.target.value)
              }
            ),
            /* @__PURE__ */ e("small", { children: "填写当前语音能力支持的音色值。" })
          ] }) : null,
          !o && F > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-usage", role: "note", children: [
            /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
            /* @__PURE__ */ n("span", { children: [
              i?.shotIds.length || 0,
              " 个镜头",
              i?.speechIds.length ? ` · ${i.speechIds.length} 条对白` : "",
              "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
            ] })
          ] }) : null,
          /* @__PURE__ */ e("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
        ] }),
        /* @__PURE__ */ n("footer", { children: [
          /* @__PURE__ */ e("div", { children: !a && !o && g ? /* @__PURE__ */ e(
            Z,
            {
              label: F > 0 ? "该素材仍被镜头或对白引用" : v ? "再次点击确认删除" : "删除素材",
              children: /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "is-danger",
                  disabled: !X,
                  onClick: () => {
                    if (!v) {
                      x(!0);
                      return;
                    }
                    g(t.id);
                  },
                  children: [
                    /* @__PURE__ */ e(De, { size: 14 }),
                    v ? "确认删除" : "删除素材"
                  ]
                }
              )
            }
          ) : null }),
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: C, children: a ? "关闭" : "取消" }),
            a ? null : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: !y || !L || P,
                onClick: () => h({
                  ...t,
                  name: y,
                  prompt: L,
                  voice: t.type === "character" ? f.trim() : ""
                }),
                children: [
                  /* @__PURE__ */ e(we, { size: 14 }),
                  o ? "添加素材" : "确认修改"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function hn({
  storyboard: t,
  referenceItems: o,
  workType: a,
  purposeSpecs: i,
  editable: d,
  disabled: h,
  onChange: g
}) {
  const C = ct(o);
  if (t.references.length === 0)
    return null;
  const O = (c, u, l = !1) => {
    let f = l ? ut(t, c) : t;
    if (f = {
      ...f,
      references: f.references.map(
        (N) => N.key === c ? { ...N, ...u } : N
      )
    }, l) {
      const N = f.references.find((x) => x.key === c), v = N ? at(f, N, i) : [];
      v.length === 1 && (f = rt(f, c, v[0].value));
    }
    g(f);
  };
  return /* @__PURE__ */ n("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ e(Bt, { size: 14 }),
      /* @__PURE__ */ e("strong", { children: "参考素材" }),
      /* @__PURE__ */ n("span", { children: [
        t.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ws-storyboard-reference-list", children: t.references.map((c) => {
      const u = at(
        t,
        c,
        i
      ), l = pn(t, c.key), f = zt(
        c.kind,
        a,
        i
      ), N = f.some(
        (v) => v.value === c.purpose
      );
      return /* @__PURE__ */ n(
        "div",
        {
          className: `ws-storyboard-reference-row ${N ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ e(
              rn,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${c.label}`,
                content: mn(c),
                adapter: C
              }
            ),
            d ? /* @__PURE__ */ n(me, { children: [
              /* @__PURE__ */ n(
                "select",
                {
                  className: "nodrag nopan",
                  value: c.purpose,
                  disabled: h,
                  "aria-label": `${c.label}的参考用途`,
                  onChange: (v) => O(
                    c.key,
                    {
                      purpose: v.target.value
                    },
                    !0
                  ),
                  children: [
                    N ? null : /* @__PURE__ */ n("option", { value: c.purpose, children: [
                      Qe(
                        c.purpose,
                        i
                      ),
                      "（当前类型不支持）"
                    ] }),
                    f.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ),
              st(
                c.purpose,
                i
              ) ? /* @__PURE__ */ n(
                "select",
                {
                  className: "nodrag nopan",
                  value: l,
                  disabled: h,
                  "aria-label": `${c.label}的关联目标`,
                  onChange: (v) => g(
                    rt(
                      t,
                      c.key,
                      v.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "选择关联目标" }),
                    u.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ) : /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-global", children: it(
                c.purpose,
                i
              ) })
            ] }) : /* @__PURE__ */ n(me, { children: [
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-purpose", children: Qe(
                c.purpose,
                i
              ) }),
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-target", children: gn(t, l) || (st(
                c.purpose,
                i
              ) ? "未关联" : it(
                c.purpose,
                i
              )) })
            ] })
          ]
        },
        c.key
      );
    }) })
  ] });
}
function mn(t) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: t.asset_id,
        label: t.label,
        purpose: t.purpose,
        ref_trigger: "@",
        ref_version_id: t.version_id
      }
    ]
  };
}
function at(t, o, a) {
  const i = Fe(
    o.purpose,
    a
  );
  return i?.scope === "material" ? t.materials.filter((d) => d.type === i.material_type).map((d) => ({
    value: `material:${d.id}`,
    label: d.name
  })) : i?.scope === "shot" ? t.shots.map((d, h) => ({
    value: `shot:${d.id}`,
    label: `镜头 ${d.order || h + 1}`
  })) : [];
}
function pn(t, o) {
  const a = t.materials.find(
    (d) => d.reference_keys.includes(o)
  );
  if (a)
    return `material:${a.id}`;
  const i = t.shots.find(
    (d) => d.reference_keys.includes(o)
  );
  return i ? `shot:${i.id}` : "";
}
function gn(t, o) {
  const [a, i] = o.split(":", 2);
  if (a === "material")
    return t.materials.find((d) => d.id === i)?.name || "";
  if (a === "shot") {
    const d = t.shots.findIndex((h) => h.id === i);
    return d >= 0 ? `镜头 ${t.shots[d].order || d + 1}` : "";
  }
  return "";
}
function rt(t, o, a) {
  const i = ut(t, o);
  if (!a)
    return i;
  const [d, h] = a.split(":", 2);
  return d === "material" ? {
    ...i,
    materials: i.materials.map(
      (g) => g.id === h ? {
        ...g,
        reference_keys: [...g.reference_keys, o]
      } : g
    )
  } : d === "shot" ? {
    ...i,
    shots: i.shots.map(
      (g) => g.id === h ? { ...g, reference_keys: [...g.reference_keys, o] } : g
    )
  } : i;
}
function ut(t, o) {
  return {
    ...t,
    materials: t.materials.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter(
        (i) => i !== o
      )
    })),
    shots: t.shots.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter((i) => i !== o)
    }))
  };
}
function st(t, o) {
  const a = Fe(t, o)?.scope;
  return a === "material" || a === "shot";
}
function it(t, o) {
  const a = Fe(t, o);
  if (!a)
    return "用途无效";
  switch (a.scope) {
    case "composition":
      return "合成应用";
    case "context":
      return "上下文参考";
    default:
      return "全局应用";
  }
}
const ht = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt"
];
function ze(t, o, a, i) {
  const d = { ...t.reference_contents || {} };
  return i ? d[o] = i : delete d[o], {
    [o]: a,
    reference_contents: d
  };
}
function Ye(t) {
  return {
    ...t,
    material_ids: [...t.material_ids],
    continuity_state: { ...t.continuity_state },
    speech: t.speech.map((o) => ({ ...o })),
    captions: t.captions.map((o) => ({ ...o })),
    reference_contents: { ...t.reference_contents || {} }
  };
}
function mt(t, o, a) {
  const i = t.shots.findIndex((O) => O.id === o.id);
  if (i < 0) return t;
  const d = t.shots[i], h = [...t.shots];
  h[i] = o;
  const g = t.shots[i - 1], C = t.shots[i + 1];
  return g && d.continue_previous && o.continue_previous && d.start_framing?.trim() && (d.start_framing?.trim() || "") === (g.end_framing?.trim() || "") && o.start_framing !== d.start_framing && (h[i - 1] = {
    ...g,
    ...ze(
      g,
      "end_framing",
      o.start_framing || ""
    )
  }), C?.continue_previous && d.end_framing?.trim() && (d.end_framing?.trim() || "") === (C.start_framing?.trim() || "") && o.end_framing !== d.end_framing && (h[i + 1] = {
    ...C,
    ...ze(
      C,
      "start_framing",
      o.end_framing || ""
    )
  }), { ...t, materials: a, shots: h };
}
function pt(t, o, a) {
  const i = t.shots.findIndex((l) => l.id === o.id), d = mt(t, o, a), h = _e(d).filter(
    (l) => l.severity === "error" && (l.shotId === o.id || !!(l.materialId && o.material_ids.includes(l.materialId)))
  ), g = t.shots[i - 1]?.id, C = t.shots[i + 1]?.id, O = (l) => `${l.shotId}:${l.message}`, c = new Set(
    _e($e(t)).filter(
      (l) => l.severity === "error" && (l.shotId === C || l.shotId === g)
    ).map(O)
  ), u = C || g ? _e($e(d)).filter(
    (l) => l.severity === "error" && (l.shotId === C || l.shotId === g) && !c.has(O(l))
  ) : [];
  return [...h, ...u];
}
function bn(t, o, a) {
  if (a.shot.id !== o.id || a.shot.order !== o.order)
    throw new Error("生成的镜头标识或顺序与当前镜头不符");
  const i = { ...a.shot.reference_contents };
  for (const g of ht)
    o[g] === a.shot[g] && o.reference_contents?.[g] && (i[g] = o.reference_contents[g]);
  const d = { ...a.shot, reference_contents: i }, h = pt(
    t,
    d,
    a.materials
  );
  if (h.length)
    throw new Error(h.map((g) => g.message).join("；"));
  return { shot: Ye(d), materials: a.materials };
}
function fn({
  shot: t,
  materials: o,
  readonly: a,
  onChange: i
}) {
  const d = o.filter(
    (c) => c.type === "character"
  ), h = (c, u) => {
    i((l) => {
      const f = l.speech.map(
        (v) => v.id === c ? vn(v, u) : v
      ), N = f.filter((v) => v.kind === "dialogue").map((v) => v.character_id || "").filter(Boolean);
      return {
        ...l,
        material_ids: [.../* @__PURE__ */ new Set([...l.material_ids, ...N])],
        speech: f
      };
    });
  }, g = (c, u) => {
    i((l) => {
      const f = l.speech.findIndex(
        (E) => E.id === c
      ), N = f + u;
      if (f < 0 || N < 0 || N >= l.speech.length)
        return l;
      const v = [...l.speech], [x] = v.splice(f, 1);
      return v.splice(N, 0, x), { ...l, speech: v };
    });
  }, C = (c, u) => {
    i((l) => ({
      ...l,
      captions: l.captions.map(
        (f) => f.id === c ? { ...f, ...u } : f
      )
    }));
  }, O = (c, u) => {
    i((l) => {
      const f = l.captions.findIndex(
        (E) => E.id === c
      ), N = f + u;
      if (f < 0 || N < 0 || N >= l.captions.length)
        return l;
      const v = [...l.captions], [x] = v.splice(f, 1);
      return v.splice(N, 0, x), { ...l, captions: v };
    });
  };
  return /* @__PURE__ */ n(me, { children: [
    /* @__PURE__ */ n("section", { className: "ws-storyboard-shot-section", children: [
      /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-section-head", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ e("strong", { children: "角色配音与旁白" }),
          /* @__PURE__ */ n("span", { children: [
            t.speech.length,
            " 条语音"
          ] })
        ] }),
        a ? null : /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => i((c) => ({
                ...c,
                speech: [
                  ...c.speech,
                  Ke(c, "dialogue")
                ]
              })),
              children: [
                /* @__PURE__ */ e(he, { size: 13 }),
                "添加对白"
              ]
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => i((c) => ({
                ...c,
                speech: [
                  ...c.speech,
                  Ke(c, "narration")
                ]
              })),
              children: [
                /* @__PURE__ */ e(he, { size: 13 }),
                "添加旁白"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.speech.length ? t.speech.map((c, u) => /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ n("strong", { children: [
            "语音 ",
            u + 1
          ] }),
          a ? null : /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e(
              te,
              {
                label: "上移语音",
                disabled: u === 0,
                onClick: () => g(c.id, -1),
                children: /* @__PURE__ */ e(We, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "下移语音",
                disabled: u === t.speech.length - 1,
                onClick: () => g(c.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "删除语音",
                danger: !0,
                onClick: () => i((l) => ({
                  ...l,
                  speech: l.speech.filter(
                    (f) => f.id !== c.id
                  )
                })),
                children: /* @__PURE__ */ e(De, { size: 13 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-fields", children: [
          /* @__PURE__ */ n("label", { children: [
            "类型",
            /* @__PURE__ */ n(
              "select",
              {
                value: c.kind,
                disabled: a,
                onChange: (l) => h(c.id, {
                  kind: l.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "dialogue", children: "角色对白" }),
                  /* @__PURE__ */ e("option", { value: "narration", children: "旁白" })
                ]
              }
            )
          ] }),
          c.kind === "dialogue" ? /* @__PURE__ */ n(me, { children: [
            /* @__PURE__ */ n("label", { children: [
              "角色",
              /* @__PURE__ */ n(
                "select",
                {
                  value: c.character_id || "",
                  disabled: a,
                  onChange: (l) => h(c.id, {
                    character_id: l.target.value
                  }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "请选择角色" }),
                    d.map((l) => /* @__PURE__ */ e("option", { value: l.id, children: l.name }, l.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("label", { children: [
              "说话方式",
              /* @__PURE__ */ n(
                "select",
                {
                  value: c.speaker_mode || "offscreen",
                  disabled: a,
                  onChange: (l) => h(c.id, {
                    speaker_mode: l.target.value === "visible" ? "visible" : "offscreen"
                  }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "visible", children: "出镜对白" }),
                    /* @__PURE__ */ e("option", { value: "offscreen", children: "画外音" })
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ n("label", { children: [
            "开始时间",
            /* @__PURE__ */ n("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0,
                  max: Math.max(0, t.duration - 0.01),
                  step: 0.1,
                  value: c.start_time,
                  disabled: a,
                  onChange: (l) => h(c.id, {
                    start_time: Te(l)
                  })
                }
              ),
              "秒"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n("label", { className: "ws-storyboard-speech-text", children: [
          "文本",
          /* @__PURE__ */ e(
            "textarea",
            {
              value: c.text,
              readOnly: a,
              placeholder: c.kind === "narration" ? "输入旁白" : "输入对白",
              onChange: (l) => h(c.id, {
                text: l.target.value
              })
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-subtitle", children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: c.subtitle_enabled,
                disabled: a,
                onChange: (l) => h(c.id, {
                  subtitle_enabled: l.target.checked
                })
              }
            ),
            "加入字幕"
          ] }),
          c.subtitle_enabled ? /* @__PURE__ */ e(
            "input",
            {
              value: c.subtitle_text,
              readOnly: a,
              placeholder: "可选：填写精简字幕；留空使用原文",
              onChange: (l) => h(c.id, {
                subtitle_text: l.target.value
              })
            }
          ) : null
        ] })
      ] }, c.id)) : /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e($t, { size: 24 }),
        /* @__PURE__ */ e("span", { children: "当前镜头没有对白或旁白" })
      ] }) })
    ] }),
    /* @__PURE__ */ n("section", { className: "ws-storyboard-shot-section", children: [
      /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-section-head", children: [
        /* @__PURE__ */ n("div", { children: [
          /* @__PURE__ */ e("strong", { children: "附加字幕文案" }),
          /* @__PURE__ */ n("span", { children: [
            t.captions.length,
            " 条文案"
          ] })
        ] }),
        a ? null : /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => i((c) => ({
              ...c,
              captions: [
                ...c.captions,
                Pt(c)
              ]
            })),
            children: [
              /* @__PURE__ */ e(he, { size: 13 }),
              "添加文案"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.captions.length ? t.captions.map((c, u) => /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ n("strong", { children: [
            "文案 ",
            u + 1
          ] }),
          a ? null : /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e(
              te,
              {
                label: "上移文案",
                disabled: u === 0,
                onClick: () => O(c.id, -1),
                children: /* @__PURE__ */ e(We, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "下移文案",
                disabled: u === t.captions.length - 1,
                onClick: () => O(c.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "删除文案",
                danger: !0,
                onClick: () => i((l) => ({
                  ...l,
                  captions: l.captions.filter(
                    (f) => f.id !== c.id
                  )
                })),
                children: /* @__PURE__ */ e(De, { size: 13 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-fields", children: [
          /* @__PURE__ */ n("label", { children: [
            "类型",
            /* @__PURE__ */ n(
              "select",
              {
                value: c.type,
                disabled: a,
                onChange: (l) => C(c.id, {
                  type: l.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "caption", children: "说明" }),
                  /* @__PURE__ */ e("option", { value: "title", children: "标题" }),
                  /* @__PURE__ */ e("option", { value: "highlight", children: "重点" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ n("label", { children: [
            "开始时间",
            /* @__PURE__ */ n("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0,
                  max: t.duration,
                  step: 0.1,
                  value: c.start_time,
                  disabled: a,
                  onChange: (l) => C(c.id, {
                    start_time: Te(l)
                  })
                }
              ),
              "秒"
            ] })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            "结束时间",
            /* @__PURE__ */ n("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0.1,
                  max: t.duration,
                  step: 0.1,
                  value: c.end_time,
                  disabled: a,
                  onChange: (l) => C(c.id, {
                    end_time: Te(l)
                  })
                }
              ),
              "秒"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n("label", { className: "ws-storyboard-speech-text", children: [
          "文本",
          /* @__PURE__ */ e(
            "textarea",
            {
              value: c.text,
              readOnly: a,
              placeholder: "输入不对应语音的标题、说明或重点文字",
              onChange: (l) => C(c.id, {
                text: l.target.value
              })
            }
          )
        ] })
      ] }, c.id)) : /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e(Be, { size: 24 }),
        /* @__PURE__ */ e("span", { children: "当前镜头没有附加字幕文案" })
      ] }) })
    ] })
  ] });
}
function te({
  label: t,
  disabled: o,
  danger: a = !1,
  onClick: i,
  children: d
}) {
  return /* @__PURE__ */ e(Z, { label: t, children: /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${a ? "is-danger" : ""}`,
      "aria-label": t,
      disabled: o,
      onClick: i,
      children: d
    }
  ) });
}
function vn(t, o) {
  const a = { ...t, ...o };
  return a.kind === "dialogue" ? (a.character_id ||= "", a.speaker_mode ||= "offscreen") : (delete a.character_id, delete a.speaker_mode), a.subtitle_enabled = !!a.subtitle_enabled, a.subtitle_text ||= "", a;
}
function Te(t) {
  const o = Number.parseFloat(t.target.value);
  return Number.isFinite(o) && o >= 0 ? o : 0;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const ge = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!ge || Object.keys(ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const yn = ge.Dialog, _n = ge.DialogContent, wn = ge.DialogTitle, Sn = [
  { value: "independent", label: "独立切镜", description: "新构图或新状态" },
  { value: "match", label: "画面匹配", description: "沿用上一镜结束状态" },
  { value: "continue", label: "动作续接", description: "从上一段真实尾帧继续" }
];
function Nn({
  shot: t,
  index: o,
  previousShot: a,
  storyboard: i,
  materials: d,
  readonly: h,
  referenceAdapter: g,
  onGenerate: C,
  onSave: O,
  onClose: c
}) {
  const [u, l] = R(() => Ye(t)), [f, N] = R(
    () => d.map((s) => ({ ...s }))
  ), [v, x] = R(""), E = f.find(
    (s) => s.id === v
  ), [y, L] = R(!1), P = $(!0);
  H(() => (P.current = !0, () => {
    P.current = !1;
  }), []);
  const F = () => {
    P.current = !1, c();
  }, [X, T] = R(""), [I, Y] = R("picture"), [J] = R(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), [D, G] = R(""), q = new Set(
    d.map((s) => s.id)
  ), re = new Set(
    u.speech.filter((s) => s.kind === "dialogue").map((s) => s.character_id || "").filter(Boolean)
  ), be = Lt(u, o), fe = i.shots.find(
    (s) => s.id === u.shared_end_shot_id
  ), Q = Cn(u), W = pt(
    i,
    u,
    f
  ), V = (s, p, S) => {
    l((B) => ({
      ...B,
      ...ze(B, s, p, S)
    }));
  }, Se = (s) => {
    l((p) => p.material_ids.includes(s) ? re.has(s) ? p : {
      ...p,
      material_ids: p.material_ids.filter((S) => S !== s)
    } : {
      ...p,
      material_ids: [...p.material_ids, s]
    });
  }, Ne = async (s) => {
    if (!C || y)
      return !1;
    G(""), L(!0);
    try {
      const p = {
        ...i,
        materials: f,
        shots: i.shots.map(
          (A) => A.id === u.id ? u : A
        )
      }, S = await C(
        p,
        u.id,
        s.trim()
      ), B = bn(
        p,
        u,
        S
      );
      return P.current ? (N(B.materials), l(B.shot), T(""), !0) : !1;
    } catch (p) {
      return P.current && G(
        p instanceof Error ? p.message : "生成镜头失败，请重试"
      ), !1;
    } finally {
      P.current && L(!1);
    }
  };
  return /* @__PURE__ */ n(me, { children: [
    /* @__PURE__ */ e(yn, { open: !0, onOpenChange: (s) => !s && F(), children: /* @__PURE__ */ n(
      _n,
      {
        className: "ws-storyboard-shot-dialog ws-storyboard-shot-editor nodrag nopan nowheel",
        layerClassName: "wb-detail-backdrop",
        layerZIndex: Le,
        showCloseButton: !1,
        "aria-describedby": void 0,
        "aria-busy": y,
        onCloseAutoFocus: (s) => {
          J?.isConnected && (s.preventDefault(), J.focus({ preventScroll: !0 }));
        },
        children: [
          /* @__PURE__ */ n("header", { children: [
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ n(wn, { children: [
                h ? "查看镜头" : "编辑镜头",
                " ",
                String(o + 1).padStart(2, "0")
              ] }),
              /* @__PURE__ */ e("span", { children: h ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
            ] }),
            /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: F, children: /* @__PURE__ */ e(ot, { size: 18 }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-editor-body", children: [
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "ws-storyboard-shot-form nowheel",
                disabled: y,
                children: [
                  /* @__PURE__ */ e(
                    "nav",
                    {
                      className: "ws-storyboard-shot-tabs",
                      "aria-label": "镜头编辑内容",
                      children: [
                        { id: "picture", label: "画面" },
                        { id: "continuity", label: "衔接" },
                        { id: "speech", label: "对白与字幕" }
                      ].map((s) => /* @__PURE__ */ e(
                        "button",
                        {
                          type: "button",
                          "aria-pressed": I === s.id,
                          onClick: () => Y(s.id),
                          children: s.label
                        },
                        s.id
                      ))
                    }
                  ),
                  /* @__PURE__ */ n(
                    "section",
                    {
                      className: "ws-storyboard-shot-section",
                      hidden: I !== "picture",
                      children: [
                        /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-section-head", children: [
                          /* @__PURE__ */ e("strong", { children: "镜头内容" }),
                          /* @__PURE__ */ e("div", { children: /* @__PURE__ */ n("label", { children: [
                            "时长",
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: Ft,
                                step: 1,
                                value: u.duration || "",
                                disabled: h,
                                onChange: (s) => l((p) => ({
                                  ...p,
                                  duration: Rn(s)
                                }))
                              }
                            ),
                            "秒"
                          ] }) })
                        ] }),
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ n("label", { children: [
                          /* @__PURE__ */ e("span", { children: "镜头图片" }),
                          /* @__PURE__ */ e(
                            "select",
                            {
                              value: u.shot_image_mode,
                              disabled: h,
                              onChange: (s) => l((p) => ({
                                ...p,
                                shot_image_mode: Vt(
                                  s.target.value
                                ),
                                shared_end_shot_id: s.target.value === "next_first" && i.shots[o + 1]?.id || ""
                              })),
                              children: Yt(u).filter(
                                (s) => s !== "next_first" || !u.continue_previous && !!i.shots[o + 1]
                              ).map((s) => /* @__PURE__ */ e("option", { value: s, children: s === "first_frame" && u.continue_previous ? "首帧（沿用上镜尾帧）" : s === "last_frame" && u.continue_previous ? "尾帧（首帧沿用上镜）" : qt[s] }, s))
                            }
                          )
                        ] }) }),
                        u.shot_image_mode === "next_first" ? /* @__PURE__ */ e("p", { children: fe ? `结束画面：镜头 ${fe.order} 首帧` : "共享来源已移除" }) : null,
                        /* @__PURE__ */ n(
                          "div",
                          {
                            className: `ws-storyboard-shot-field-row ${o === 0 ? "is-single" : ""}`,
                            children: [
                              /* @__PURE__ */ e(
                                ye,
                                {
                                  label: "动作与变化",
                                  value: u.beat,
                                  placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                                  readonly: h || y,
                                  onChange: (s) => l((p) => ({ ...p, beat: s }))
                                }
                              ),
                              o > 0 ? /* @__PURE__ */ e(
                                ye,
                                {
                                  label: "与上镜关系",
                                  value: u.transition,
                                  placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                                  readonly: h || y,
                                  onChange: (s) => l((p) => ({
                                    ...p,
                                    transition: s
                                  }))
                                }
                              ) : null
                            ]
                          }
                        ),
                        o > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ n("label", { children: [
                            /* @__PURE__ */ e("span", { children: "剪辑转场" }),
                            /* @__PURE__ */ e(
                              "select",
                              {
                                value: u.transition_type,
                                disabled: h,
                                onChange: (s) => l((p) => {
                                  const S = s.target.value;
                                  return {
                                    ...p,
                                    transition_type: S,
                                    transition_duration_ms: S === "none" ? 0 : Math.max(
                                      500,
                                      p.transition_duration_ms
                                    )
                                  };
                                }),
                                children: Ut.map((s) => /* @__PURE__ */ e("option", { value: s, children: jt[s] }, s))
                              }
                            )
                          ] }),
                          u.transition_type !== "none" ? /* @__PURE__ */ n("label", { children: [
                            /* @__PURE__ */ e("span", { children: "转场时长" }),
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: 100,
                                max: 5e3,
                                step: 100,
                                value: u.transition_duration_ms,
                                disabled: h,
                                onChange: (s) => l((p) => ({
                                  ...p,
                                  transition_duration_ms: Math.min(
                                    5e3,
                                    On(
                                      s,
                                      p.transition_duration_ms,
                                      100
                                    )
                                  )
                                }))
                              }
                            )
                          ] }) : null
                        ] }) : null,
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                          ne,
                          {
                            label: "画面描述",
                            value: u.description,
                            content: u.reference_contents?.description,
                            placeholder: "描述当前画面中的主体、位置和环境；动作填写在动作与变化中",
                            readonly: h || y,
                            referenceAdapter: g,
                            onChange: (s, p) => V("description", s, p)
                          }
                        ) }),
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                          ne,
                          {
                            label: "空间关系",
                            value: u.spatial_layout,
                            content: u.reference_contents?.spatial_layout,
                            placeholder: "主体、环境和物件的前后左右、接触或承载关系，以及真实相对尺度",
                            readonly: h || y,
                            referenceAdapter: g,
                            onChange: (s, p) => V("spatial_layout", s, p)
                          }
                        ) }),
                        /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "起始构图",
                              value: u.start_framing || "",
                              content: u.reference_contents?.start_framing,
                              placeholder: "动作开始时的景别、机位、主体位置、景深与焦点",
                              readonly: h || y,
                              referenceAdapter: g,
                              onChange: (s, p) => V("start_framing", s, p)
                            }
                          ),
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "结束构图",
                              value: u.end_framing || "",
                              content: u.reference_contents?.end_framing,
                              placeholder: "动作结束时的景别、机位、主体位置、景深与焦点",
                              readonly: h || y,
                              referenceAdapter: g,
                              onChange: (s, p) => V("end_framing", s, p)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "景别与运镜",
                              value: u.camera_instruction,
                              content: u.reference_contents?.camera_instruction,
                              placeholder: "景别、机位和运动方式",
                              readonly: h || y,
                              referenceAdapter: g,
                              onChange: (s, p) => V("camera_instruction", s, p)
                            }
                          ),
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "视频提示词",
                              value: u.video_prompt,
                              content: u.reference_contents?.video_prompt,
                              placeholder: "补充视频制作要求；与动作、构图和运镜保持一致",
                              readonly: h || y,
                              referenceAdapter: g,
                              onChange: (s, p) => V("video_prompt", s, p)
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n(
                    "section",
                    {
                      className: "ws-storyboard-shot-section",
                      hidden: I !== "picture",
                      children: [
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ n("div", { children: [
                          /* @__PURE__ */ e("strong", { children: "关联素材" }),
                          /* @__PURE__ */ n("span", { children: [
                            u.material_ids.length,
                            " 个素材"
                          ] })
                        ] }) }),
                        f.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((s) => {
                          const p = f.filter(
                            (S) => S.type === s
                          );
                          return p.length ? /* @__PURE__ */ n("fieldset", { children: [
                            /* @__PURE__ */ e("legend", { children: ae[s] }),
                            /* @__PURE__ */ e("div", { children: p.map((S) => {
                              const B = u.material_ids.includes(
                                S.id
                              ), A = re.has(
                                S.id
                              );
                              return /* @__PURE__ */ n(
                                "div",
                                {
                                  className: "ws-storyboard-material-option",
                                  children: [
                                    /* @__PURE__ */ e(
                                      Z,
                                      {
                                        label: B && A ? "该角色已用于对白，不能取消关联" : B ? "取消关联" : "关联素材",
                                        children: /* @__PURE__ */ n("label", { children: [
                                          /* @__PURE__ */ e(
                                            "input",
                                            {
                                              type: "checkbox",
                                              checked: B,
                                              disabled: h || B && A,
                                              onChange: () => Se(S.id)
                                            }
                                          ),
                                          /* @__PURE__ */ n("span", { className: "sr-only", children: [
                                            "关联 ",
                                            S.name
                                          ] })
                                        ] })
                                      }
                                    ),
                                    /* @__PURE__ */ e(
                                      Z,
                                      {
                                        label: `${h ? "查看" : "编辑"}${ae[s]}提示词：${S.name}`,
                                        children: /* @__PURE__ */ n(
                                          "button",
                                          {
                                            type: "button",
                                            disabled: y,
                                            onClick: () => x(S.id),
                                            children: [
                                              /* @__PURE__ */ e("span", { children: S.name }),
                                              h ? null : /* @__PURE__ */ e(lt, { size: 11 })
                                            ]
                                          }
                                        )
                                      }
                                    )
                                  ]
                                },
                                S.id
                              );
                            }) })
                          ] }, s) : null;
                        }) }) : /* @__PURE__ */ e("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n(
                    "section",
                    {
                      className: "ws-storyboard-shot-section",
                      hidden: I !== "continuity",
                      children: [
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ e("strong", { children: "镜头衔接" }) }),
                        /* @__PURE__ */ e("section", { className: "ws-storyboard-continuity-settings", children: /* @__PURE__ */ n("div", { children: [
                          o > 0 ? /* @__PURE__ */ e("div", { className: "ws-storyboard-continuity-modes", children: Sn.map((s) => /* @__PURE__ */ n(
                            "label",
                            {
                              className: `ws-storyboard-continuity-input${Q === s.value ? " is-selected" : ""}`,
                              children: [
                                /* @__PURE__ */ e(
                                  "input",
                                  {
                                    type: "radio",
                                    name: `storyboard-continuity-${t.id}`,
                                    value: s.value,
                                    checked: Q === s.value,
                                    disabled: h,
                                    onChange: () => l(
                                      (p) => In(
                                        p,
                                        s.value,
                                        a
                                      )
                                    )
                                  }
                                ),
                                /* @__PURE__ */ n("span", { children: [
                                  /* @__PURE__ */ e("strong", { children: s.label }),
                                  /* @__PURE__ */ e("small", { children: s.description })
                                ] })
                              ]
                            },
                            s.value
                          )) }) : null,
                          o > 0 && u.continue_previous ? /* @__PURE__ */ n("label", { className: "ws-storyboard-continuity-anchor", children: [
                            /* @__PURE__ */ e("span", { children: "连续性锚点" }),
                            /* @__PURE__ */ e(
                              "textarea",
                              {
                                value: u.continuity_anchor,
                                readOnly: h,
                                placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                onChange: (s) => l((p) => ({
                                  ...p,
                                  continuity_anchor: s.target.value
                                }))
                              }
                            )
                          ] }) : null,
                          /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                            /* @__PURE__ */ e(
                              ye,
                              {
                                label: "入镜状态",
                                value: u.continuity_state.entry,
                                placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                readonly: h || y || be,
                                onChange: (s) => l((p) => ({
                                  ...p,
                                  continuity_state: {
                                    ...p.continuity_state,
                                    entry: s
                                  }
                                }))
                              }
                            ),
                            /* @__PURE__ */ e(
                              ye,
                              {
                                label: "出镜状态",
                                value: u.continuity_state.exit,
                                placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                readonly: h || y,
                                onChange: (s) => l((p) => ({
                                  ...p,
                                  continuity_state: {
                                    ...p.continuity_state,
                                    exit: s
                                  }
                                }))
                              }
                            )
                          ] })
                        ] }) })
                      ]
                    }
                  ),
                  I === "speech" ? /* @__PURE__ */ e(
                    fn,
                    {
                      shot: u,
                      materials: f,
                      readonly: h || y,
                      onChange: l
                    }
                  ) : null,
                  W.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-form-error", role: "alert", children: W.map((s) => /* @__PURE__ */ e("p", { children: s.message }, s.id)) }) : null
                ]
              }
            ),
            !h && C ? /* @__PURE__ */ n("aside", { className: "ws-storyboard-shot-ai", children: [
              /* @__PURE__ */ n("strong", { children: [
                /* @__PURE__ */ e(Je, { size: 15 }),
                "AI 修改"
              ] }),
              /* @__PURE__ */ n("label", { children: [
                /* @__PURE__ */ e("span", { children: "修改要求" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: X,
                    disabled: y,
                    placeholder: "例如：改成手部特写，保留人物和道具，调整动作与前后镜头的衔接",
                    onChange: (s) => {
                      T(s.target.value), G("");
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: y || !X.trim(),
                  onClick: () => {
                    Ne(X);
                  },
                  children: [
                    y ? /* @__PURE__ */ e(Pe, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(Je, { size: 14 }),
                    y ? "正在修改" : "修改当前镜头"
                  ]
                }
              ),
              /* @__PURE__ */ e("p", { children: "生成后直接更新左侧草稿，检查后保存。取消会保留原镜头。" }),
              D ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "alert", children: D }) : null
            ] }) : null
          ] }),
          /* @__PURE__ */ n("footer", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: F, children: h ? "关闭" : "取消" }),
            h ? null : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: y || W.length > 0,
                onClick: () => O(
                  u,
                  f.filter(
                    (s) => q.has(s.id) || u.material_ids.includes(s.id)
                  )
                ),
                children: [
                  /* @__PURE__ */ e(we, { size: 14 }),
                  "保存镜头"
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    E ? /* @__PURE__ */ e(
      dt,
      {
        material: E,
        readonly: h || y,
        usage: Ae(
          {
            ...i,
            shots: i.shots.map(
              (s) => s.id === u.id ? u : s
            )
          },
          E.id
        ),
        existingNames: f.filter((s) => s.id !== E.id).map((s) => s.name),
        onSave: (s) => {
          N(
            (p) => p.map(
              (S) => S.id === s.id ? s : S
            )
          ), x("");
        },
        onClose: () => x("")
      }
    ) : null
  ] });
}
function ne({
  label: t,
  value: o,
  content: a,
  placeholder: i,
  readonly: d,
  referenceAdapter: h,
  onChange: g
}) {
  return /* @__PURE__ */ n("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      sn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: o,
        content: a,
        adapter: h,
        placeholder: i,
        disabled: d,
        layerZIndex: Le + 40,
        onChange: g
      }
    )
  ] });
}
function ye({
  label: t,
  value: o,
  placeholder: a,
  readonly: i,
  onChange: d
}) {
  return /* @__PURE__ */ n("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: o,
        rows: 3,
        placeholder: a,
        readOnly: i,
        onChange: (h) => d(h.target.value)
      }
    )
  ] });
}
function Cn(t) {
  return t.continue_previous ? "continue" : t.match_previous ? "match" : "independent";
}
function In(t, o, a) {
  const i = o !== "independent", d = o === "continue";
  return {
    ...t,
    match_previous: o === "match",
    continue_previous: d,
    shot_image_mode: Ht({
      ...t,
      match_previous: o === "match",
      continue_previous: d
    }).mode,
    continuity_anchor: d ? t.continuity_anchor : "",
    continuity_state: i ? {
      ...t.continuity_state,
      entry: a?.continuity_state.exit || t.continuity_state.entry
    } : t.continuity_state
  };
}
function Rn(t) {
  const o = Number(t.target.value);
  return Number.isFinite(o) ? o : 0;
}
function On(t, o, a) {
  const i = Number(t.target.value);
  return Number.isInteger(i) && i >= a ? i : o;
}
const kn = [], xn = [], En = [], Mn = [];
function Un({
  storyboard: t,
  editable: o = !1,
  disabled: a = !1,
  onSave: i,
  onChange: d,
  onConfirm: h,
  onCreateRevision: g,
  onGenerateShot: C,
  workflowAction: O = "",
  saveStatus: c,
  showSaveStatus: u = !0,
  showMetrics: l = !0,
  referenceItems: f = kn,
  storyboardSourceNodeId: N = "",
  canvasNodes: v = xn,
  workTypeSpecs: x = En,
  purposeSpecs: E = Mn,
  focus: y
}) {
  const L = ue(
    () => JSON.stringify(t),
    [t]
  ), [P, F] = R(t), [X, T] = R("saved"), [I, Y] = R(""), [J, D] = R(""), [G, q] = R(null), [re, be] = R(""), [fe, Q] = R(""), [W, V] = R([]), [Se, Ne] = R(
    "before"
  ), s = $(null), p = $(""), S = $([]), B = $(/* @__PURE__ */ new Map()), A = $(/* @__PURE__ */ new Map()), Ce = $(t), ve = $(!1), se = $(0), qe = $(L), U = $(null), Ve = $(Promise.resolve()), ie = $(!0), oe = !!d, b = oe ? t : P, Ue = x.find(
    (r) => r.key === b.work_type
  )?.name, Ie = Xt(b), k = o && !a && !Ie && !O && !!(d || i), je = k && !oe && !!i, He = ct(f), le = b.shots.find((r) => r.id === I), Re = b.shots.findIndex(
    (r) => r.id === I
  ), bt = Re > 0 ? b.shots[Re - 1] : void 0, Oe = b.materials.find(
    (r) => r.id === J
  ), K = Oe || G, ft = K ? Ae(b, K.id) : void 0, vt = ue(
    () => nt(b.shots, W, (r) => r.id),
    [b.shots, W]
  ), ke = ue(
    () => _e(b, {
      coreOnly: !0,
      workTypeSpecs: x,
      purposeSpecs: E
    }),
    [b, E, x]
  ), yt = ke.some(
    (r) => r.severity === "error"
  ), _t = (r) => {
    if (r.materialId) {
      Y(""), q(null), D(r.materialId);
      return;
    }
    r.shotId && (D(""), q(null), Y(r.shotId));
  }, wt = ue(
    () => new Map(
      tn(b, N, v).map(
        (r) => [r.shot.id, r]
      )
    ),
    [b, N, v]
  ), St = ue(
    () => b.shots.some(
      (r) => r.speech.some(
        (m) => m.kind === "narration" && !!m.text.trim()
      )
    ),
    [b.shots]
  );
  H(() => (ie.current = !0, () => {
    ie.current = !1, U.current && window.clearTimeout(U.current);
  }), []), H(
    () => () => {
      for (const r of A.current.values())
        r.cancel();
      A.current.clear();
    },
    []
  ), Dt(() => {
    const r = B.current, m = s.current;
    if (!m || r.size === 0)
      return;
    const w = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    m.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((_) => {
      if (_.classList.contains("is-dragging"))
        return;
      const M = _.dataset.sequenceItemId || "", j = r.get(M);
      if (!j || w)
        return;
      const xe = _.getBoundingClientRect(), ce = j.left - xe.left, ee = j.top - xe.top;
      if (Math.abs(ce) < 1 && Math.abs(ee) < 1)
        return;
      A.current.get(M)?.cancel();
      const de = _.animate(
        [
          { transform: `translate3d(${ce}px, ${ee}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      A.current.set(M, de), de.onfinish = () => {
        A.current.get(M) === de && A.current.delete(M);
      };
    }), r.clear();
  }, [W]), H(() => {
    qe.current !== L && (qe.current = L, !ve.current && (Ce.current = t, F(t), T("saved")));
  }, [L, t]), H(() => {
    I && !le && Y("");
  }, [le, I]), H(() => {
    J && !Oe && D("");
  }, [Oe, J]), H(() => {
    if (!y)
      return;
    if (y.materialId && b.materials.some((m) => m.id === y.materialId)) {
      q(null), Y(""), D(y.materialId);
      return;
    }
    if (y.shotId && b.shots.some((m) => m.id === y.shotId)) {
      q(null), D(""), Y(y.shotId);
      return;
    }
    const r = window.requestAnimationFrame(() => {
      const m = y.materialType ? `[data-storyboard-material-type="${y.materialType}"]` : y.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      s.current?.querySelector(m)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(r);
  }, [y?.materialId, y?.materialType, y?.section, y?.shotId]), H(() => {
    if (!je || !ve.current || !i)
      return;
    U.current && window.clearTimeout(U.current);
    const r = b, m = se.current;
    return U.current = window.setTimeout(() => {
      U.current = null, Ve.current = Ve.current.catch(() => {
      }).then(async () => {
        ie.current && m === se.current && T("saving");
        try {
          if (await i(r), !ie.current || m !== se.current)
            return;
          ve.current = !1, T("saved");
        } catch {
          if (!ie.current || m !== se.current)
            return;
          T("error");
        }
      });
    }, 800), () => {
      U.current && (window.clearTimeout(U.current), U.current = null);
    };
  }, [je, b, i]);
  const z = (r) => {
    if (!k)
      return;
    const m = oe ? t : Ce.current, w = r(m), _ = Dn(
      $e(Qt(m, w)),
      He.options
    );
    if (Ce.current = _, oe) {
      d?.(_);
      return;
    }
    ve.current = !0, se.current += 1, F(_), T("typing");
  }, Xe = () => {
    const r = s.current;
    if (!r)
      return;
    const m = /* @__PURE__ */ new Map();
    r.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((w) => {
      const _ = w.dataset.sequenceItemId || "";
      _ && m.set(_, w.getBoundingClientRect());
    }), B.current = m;
  }, Nt = (r) => {
    const m = b.shots.map((w) => w.id);
    p.current = r, S.current = m, be(r), Q(""), V(m);
  }, Ct = (r, m) => {
    const w = p.current, _ = S.current;
    if (!w || !r || w === r || !_.length || !_.includes(w) || !_.includes(r))
      return;
    const M = m.currentTarget.getBoundingClientRect(), j = m.currentTarget.parentElement?.getBoundingClientRect(), ce = !!(j && M.width * 1.5 < j.width) ? m.clientX < M.left + M.width / 2 ? "before" : "after" : m.clientY < M.top + M.height / 2 ? "before" : "after", ee = nn(
      _,
      w,
      r,
      ce,
      (de) => de
    );
    Q(r), Ne(ce), !Me(_, ee) && (Xe(), S.current = ee, V(ee));
  }, Ge = () => {
    const r = S.current, m = b.shots.map((w) => w.id);
    r.length > 0 && !Me(r, m) && Xe(), p.current = "", S.current = [], be(""), Q(""), V([]);
  }, It = () => {
    const r = S.current;
    r.length > 0 && z((m) => {
      const w = nt(m.shots, r, (_) => _.id);
      return Me(
        m.shots.map((_) => _.id),
        w.map((_) => _.id)
      ) ? m : { ...m, shots: w };
    }), Ge();
  }, Rt = (r, m) => {
    z((w) => mt(w, r, m)), Y("");
  }, Ot = (r) => {
    z((m) => {
      const w = m.materials.some((_) => _.id === r.id);
      return {
        ...m,
        materials: w ? m.materials.map(
          (_) => _.id === r.id ? r : _
        ) : [...m.materials, r]
      };
    }), D(""), q(null);
  }, kt = (r) => {
    D(""), q(Kt(b.materials, r));
  }, xt = (r) => {
    const m = Ae(b, r);
    m.shotIds.length || m.speechIds.length || (z((w) => ({
      ...w,
      materials: w.materials.filter((_) => _.id !== r)
    })), D(""), q(null));
  }, Et = (r) => {
    z((m) => m.shots.length <= 1 ? m : {
      ...m,
      shots: m.shots.filter((w) => w.id !== r)
    });
  }, Mt = (r) => {
    z((m) => {
      if (m.shots.length >= Ee)
        return m;
      const w = $n(m.shots, r), _ = m.shots.findIndex((j) => j.id === r.id), M = [...m.shots];
      return M.splice(_ + 1, 0, w), { ...m, shots: M };
    });
  }, Tt = () => {
    z((r) => r.shots.length >= Ee ? r : {
      ...r,
      shots: [...r.shots, gt(r.shots)]
    });
  };
  return /* @__PURE__ */ n(
    "section",
    {
      ref: s,
      className: `ws-storyboard ${k ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ n("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ n("div", { className: "ws-storyboard-summary", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ n("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ n("header", { children: [
                /* @__PURE__ */ e(Be, { size: 14 }),
                /* @__PURE__ */ e("strong", { children: "内容简介" }),
                Ue ? /* @__PURE__ */ e("span", { className: "ws-storyboard-work-type", children: Ue }) : null
              ] }),
              /* @__PURE__ */ e("p", { children: Gt(b) })
            ] }),
            /* @__PURE__ */ n("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ e(
                hn,
                {
                  storyboard: b,
                  referenceItems: f,
                  editable: k,
                  disabled: a,
                  workType: b.work_type,
                  purposeSpecs: E,
                  onChange: (r) => z(() => r)
                }
              ),
              /* @__PURE__ */ e("section", { className: "ws-storyboard-basic-settings", children: /* @__PURE__ */ n("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ n("label", { children: [
                  /* @__PURE__ */ e("strong", { children: /* @__PURE__ */ e(Z, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ e("span", { children: "画面类型" }) }) }),
                  k ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: b.visual_mode,
                      disabled: a,
                      onChange: (r) => z((m) => ({
                        ...m,
                        visual_mode: r.target.value
                      })),
                      children: Wt.map((r) => /* @__PURE__ */ e("option", { value: r, children: et[r] }, r))
                    }
                  ) : /* @__PURE__ */ e("span", { children: et[b.visual_mode] })
                ] }),
                /* @__PURE__ */ n("label", { children: [
                  /* @__PURE__ */ e("strong", { children: "画幅" }),
                  k ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: b.aspect_ratio,
                      disabled: a,
                      onChange: (r) => z((m) => ({
                        ...m,
                        aspect_ratio: r.target.value
                      })),
                      children: Zt.map((r) => /* @__PURE__ */ e("option", { value: r, children: r }, r))
                    }
                  ) : /* @__PURE__ */ e("span", { children: b.aspect_ratio })
                ] }),
                St || b.narrator_voice ? /* @__PURE__ */ n("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ e("strong", { children: "旁白音色" }),
                  k ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: b.narrator_voice,
                      placeholder: "自动配音时必填",
                      disabled: a,
                      onChange: (r) => z((m) => ({
                        ...m,
                        narrator_voice: r.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ e("span", { children: b.narrator_voice || "未配置" })
                ] }) : null,
                /* @__PURE__ */ n("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ e("strong", { children: "统一视觉风格" }),
                  k ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: b.style_prompt,
                      placeholder: "可选，整部作品保持一致的画面风格",
                      disabled: a,
                      onChange: (r) => z(
                        (m) => en(
                          m,
                          r.target.value
                        )
                      )
                    }
                  ) : /* @__PURE__ */ e(Z, { label: b.style_prompt, children: /* @__PURE__ */ e("span", { children: b.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] }) }),
              b.materials.length || k ? /* @__PURE__ */ e(
                Tn,
                {
                  materials: b.materials,
                  editable: k,
                  onOpen: D,
                  onCreate: kt
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ e("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ n("div", { className: "ws-storyboard-toolbar-end", children: [
              l || k && u ? /* @__PURE__ */ n("div", { className: "ws-storyboard-toolbar-meta", children: [
                l ? /* @__PURE__ */ n("span", { children: [
                  b.shots.length,
                  " 个镜头 ·",
                  " ",
                  Jt(b),
                  " 秒 · ",
                  b.aspect_ratio
                ] }) : null,
                k && u ? /* @__PURE__ */ e(
                  Bn,
                  {
                    status: oe ? c || "saved" : X
                  }
                ) : null
              ] }) : null,
              k ? /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: a || b.shots.length >= Ee,
                  onClick: Tt,
                  children: [
                    /* @__PURE__ */ e(he, { size: 13 }),
                    /* @__PURE__ */ e("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              Ie && g ? /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: a || !!O,
                  onClick: () => {
                    g();
                  },
                  children: [
                    O === "revising" ? /* @__PURE__ */ e(Pe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(At, { size: 13 }),
                    O === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !Ie && k && h ? /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: yt,
                  onClick: () => {
                    h();
                  },
                  children: [
                    /* @__PURE__ */ e(we, { size: 13 }),
                    "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            k && ke.length ? /* @__PURE__ */ e(
              ln,
              {
                issues: ke,
                onOpen: _t
              }
            ) : null,
            /* @__PURE__ */ e("div", { className: "ws-storyboard-grid nowheel", children: b.shots.length ? vt.map((r, m) => /* @__PURE__ */ e(
              on,
              {
                shot: r,
                index: m,
                storyboard: b,
                frame: wt.get(r.id),
                selected: I === r.id,
                editable: k,
                dragging: re === r.id,
                dropPlacement: fe === r.id && re !== r.id ? Se : void 0,
                onOpen: () => Y(r.id),
                onDuplicate: () => Mt(r),
                onRemove: () => Et(r.id),
                onDragStart: () => Nt(r.id),
                onDragOver: (w) => Ct(r.id, w),
                onDrop: It,
                onDragEnd: Ge
              },
              r.id
            )) : /* @__PURE__ */ n("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ e(Be, { size: 26 }),
              /* @__PURE__ */ e("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ e("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        le ? /* @__PURE__ */ e(
          Nn,
          {
            shot: le,
            index: Re,
            previousShot: bt,
            storyboard: b,
            materials: b.materials,
            readonly: !k,
            referenceAdapter: He,
            onGenerate: C,
            onSave: Rt,
            onClose: () => Y("")
          },
          le.id
        ) : null,
        K ? /* @__PURE__ */ e(
          dt,
          {
            material: K,
            creating: !!G,
            readonly: !k,
            usage: ft,
            existingNames: b.materials.filter((r) => r.id !== K.id).map((r) => r.name),
            onSave: Ot,
            onRemove: xt,
            onClose: () => {
              D(""), q(null);
            }
          },
          `${G ? "create" : "edit"}:${K.id}`
        ) : null
      ]
    }
  );
}
function Tn({
  materials: t,
  editable: o,
  onOpen: a,
  onCreate: i
}) {
  return /* @__PURE__ */ n("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ e("strong", { children: "素材设定" }),
      o ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((d) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => i(d),
          children: [
            /* @__PURE__ */ e(he, { size: 11 }),
            ae[d]
          ]
        },
        d
      )) }) : null
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((d) => {
        const h = t.filter(
          (g) => g.type === d
        );
        return h.length ? /* @__PURE__ */ n(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": d,
            children: [
              /* @__PURE__ */ e("span", { children: ae[d] }),
              h.map((g) => /* @__PURE__ */ e(
                Z,
                {
                  label: `${o ? "编辑" : "查看"}${ae[d]}提示词：${g.name}`,
                  children: /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => a(g.id),
                      children: [
                        /* @__PURE__ */ e("span", { children: g.name }),
                        o ? /* @__PURE__ */ e(lt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                g.id
              ))
            ]
          },
          d
        ) : null;
      }),
      t.length ? null : /* @__PURE__ */ e("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Dn(t, o) {
  return {
    ...t,
    shots: t.shots.map((a) => {
      const i = { ...a.reference_contents || {} };
      for (const d of ht) {
        const h = an(
          a[d] || "",
          i[d],
          o
        );
        h ? i[d] = h : delete i[d];
      }
      return { ...a, reference_contents: i };
    })
  };
}
function Bn({ status: t }) {
  return /* @__PURE__ */ n("span", { className: `ws-storyboard-save-state is-${t}`, children: [
    t === "saving" ? /* @__PURE__ */ e(Pe, { size: 12, className: "ws-spin" }) : t === "saved" ? /* @__PURE__ */ e(we, { size: 12 }) : null,
    t === "typing" ? "编辑中" : t === "saving" ? "保存中" : t === "error" ? "保存失败" : "已保存"
  ] });
}
function gt(t) {
  const o = new Set(t.map((d) => d.id));
  let a = t.length, i = tt(a);
  for (; o.has(i.id); )
    a += 1, i = tt(a);
  return i;
}
function $n(t, o) {
  const a = gt(t);
  return {
    ...Ye(o),
    id: a.id,
    order: a.order,
    speech: o.speech.map((i, d) => ({
      ...i,
      id: `${a.id}-speech-${d + 1}`
    })),
    captions: o.captions.map((i, d) => ({
      ...i,
      id: `${a.id}-caption-${d + 1}`
    }))
  };
}
export {
  Un as StoryboardView
};
