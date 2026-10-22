import { j as e, a as n, F as pe } from "./react-D9GkiX5b.js";
import { a as R, b as A, d as H, u as he, l as Dt } from "./file-kind-D6bMOzYN.js";
import { X as ot, h as De, n as Ne, L as Bt, P as me, as as We, at as Ze, aH as At, B as Be, q as lt, ab as Je, r as Pe, w as $t } from "./vendor-icons-fVDtJt66.js";
import { a7 as ae, B as Z, D as Le, a8 as zt, a9 as Qe, aa as Fe, ab as Ae, ac as Ke, ad as Pt, ae as Lt, af as Ft, ag as Yt, ah as qt, ai as Vt, aj as Ut, ak as jt, al as $e, a6 as Ht, m as Xt, am as Gt, an as Wt, ao as et, ap as Zt, aq as Jt, ar as Me, as as Qt, at as Kt, au as tt, av as en } from "./asset-preview-qznc7rjG.js";
import { o as nt, s as tn, u as Ee, v as nn, _ as an } from "./space-ordered-list-BzuXThI0.js";
import { u as ct, a as rn, b as sn } from "./space-reference-editor-B5nVnbhA.js";
import { a as on } from "./space-storyboard-shot-card-DbYv-26X.js";
import { s as we, S as ln } from "./space-storyboard-confirm-dialog-CMg5ee12.js";
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const ge = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!ge || Object.keys(ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const cn = ge.Dialog, dn = ge.DialogContent, un = ge.DialogTitle;
function dt({
  material: t,
  creating: l = !1,
  readonly: a,
  usage: i,
  existingNames: c = [],
  onSave: u,
  onRemove: g,
  onClose: C
}) {
  const [O, s] = R(t.name), [m, d] = R(t.prompt), [f, N] = R(t.voice), [v, M] = R(!1), [E] = R(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), y = O.trim().replace(/^[@#]+/, ""), P = m.trim(), z = c.some(
    (I) => I.trim().toLocaleLowerCase() === y.toLocaleLowerCase()
  ), L = (i?.shotIds.length || 0) + (i?.speechIds.length || 0), X = !l && !a && !!g && L === 0, D = ae[t.type];
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
            /* @__PURE__ */ e(un, { children: l ? `新增${D}` : t.name || D }),
            /* @__PURE__ */ n("span", { children: [
              D,
              "素材",
              a ? " · 当前版本只读" : l ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
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
                onChange: (I) => s(I.target.value)
              }
            ),
            z ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
          ] }),
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e("span", { children: "生成提示词" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                value: m,
                readOnly: a,
                placeholder: `描述${y || D}的外观、结构、材质与风格`,
                onChange: (I) => d(I.target.value)
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
          !l && L > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-usage", role: "note", children: [
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
          /* @__PURE__ */ e("div", { children: !a && !l && g ? /* @__PURE__ */ e(
            Z,
            {
              label: L > 0 ? "该素材仍被镜头或对白引用" : v ? "再次点击确认删除" : "删除素材",
              children: /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "is-danger",
                  disabled: !X,
                  onClick: () => {
                    if (!v) {
                      M(!0);
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
                disabled: !y || !P || z,
                onClick: () => u({
                  ...t,
                  name: y,
                  prompt: P,
                  voice: t.type === "character" ? f.trim() : ""
                }),
                children: [
                  /* @__PURE__ */ e(Ne, { size: 14 }),
                  l ? "添加素材" : "确认修改"
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
  referenceItems: l,
  workType: a,
  purposeSpecs: i,
  editable: c,
  disabled: u,
  onChange: g
}) {
  const C = ct(l);
  if (t.references.length === 0)
    return null;
  const O = (s, m, d = !1) => {
    let f = d ? ut(t, s) : t;
    if (f = {
      ...f,
      references: f.references.map(
        (N) => N.key === s ? { ...N, ...m } : N
      )
    }, d) {
      const N = f.references.find((M) => M.key === s), v = N ? at(f, N, i) : [];
      v.length === 1 && (f = rt(f, s, v[0].value));
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
    /* @__PURE__ */ e("div", { className: "ws-storyboard-reference-list", children: t.references.map((s) => {
      const m = at(
        t,
        s,
        i
      ), d = pn(t, s.key), f = zt(
        s.kind,
        a,
        i
      ), N = f.some(
        (v) => v.value === s.purpose
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
                value: `@${s.label}`,
                content: mn(s),
                adapter: C
              }
            ),
            c ? /* @__PURE__ */ n(pe, { children: [
              /* @__PURE__ */ n(
                "select",
                {
                  className: "nodrag nopan",
                  value: s.purpose,
                  disabled: u,
                  "aria-label": `${s.label}的参考用途`,
                  onChange: (v) => O(
                    s.key,
                    {
                      purpose: v.target.value
                    },
                    !0
                  ),
                  children: [
                    N ? null : /* @__PURE__ */ n("option", { value: s.purpose, children: [
                      Qe(
                        s.purpose,
                        i
                      ),
                      "（当前类型不支持）"
                    ] }),
                    f.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ),
              st(
                s.purpose,
                i
              ) ? /* @__PURE__ */ n(
                "select",
                {
                  className: "nodrag nopan",
                  value: d,
                  disabled: u,
                  "aria-label": `${s.label}的关联目标`,
                  onChange: (v) => g(
                    rt(
                      t,
                      s.key,
                      v.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "选择关联目标" }),
                    m.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ) : /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-global", children: it(
                s.purpose,
                i
              ) })
            ] }) : /* @__PURE__ */ n(pe, { children: [
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-purpose", children: Qe(
                s.purpose,
                i
              ) }),
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-target", children: gn(t, d) || (st(
                s.purpose,
                i
              ) ? "未关联" : it(
                s.purpose,
                i
              )) })
            ] })
          ]
        },
        s.key
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
function at(t, l, a) {
  const i = Fe(
    l.purpose,
    a
  );
  return i?.scope === "material" ? t.materials.filter((c) => c.type === i.material_type).map((c) => ({
    value: `material:${c.id}`,
    label: c.name
  })) : i?.scope === "shot" ? t.shots.map((c, u) => ({
    value: `shot:${c.id}`,
    label: `镜头 ${c.order || u + 1}`
  })) : [];
}
function pn(t, l) {
  const a = t.materials.find(
    (c) => c.reference_keys.includes(l)
  );
  if (a)
    return `material:${a.id}`;
  const i = t.shots.find(
    (c) => c.reference_keys.includes(l)
  );
  return i ? `shot:${i.id}` : "";
}
function gn(t, l) {
  const [a, i] = l.split(":", 2);
  if (a === "material")
    return t.materials.find((c) => c.id === i)?.name || "";
  if (a === "shot") {
    const c = t.shots.findIndex((u) => u.id === i);
    return c >= 0 ? `镜头 ${t.shots[c].order || c + 1}` : "";
  }
  return "";
}
function rt(t, l, a) {
  const i = ut(t, l);
  if (!a)
    return i;
  const [c, u] = a.split(":", 2);
  return c === "material" ? {
    ...i,
    materials: i.materials.map(
      (g) => g.id === u ? {
        ...g,
        reference_keys: [...g.reference_keys, l]
      } : g
    )
  } : c === "shot" ? {
    ...i,
    shots: i.shots.map(
      (g) => g.id === u ? { ...g, reference_keys: [...g.reference_keys, l] } : g
    )
  } : i;
}
function ut(t, l) {
  return {
    ...t,
    materials: t.materials.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter(
        (i) => i !== l
      )
    })),
    shots: t.shots.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter((i) => i !== l)
    }))
  };
}
function st(t, l) {
  const a = Fe(t, l)?.scope;
  return a === "material" || a === "shot";
}
function it(t, l) {
  const a = Fe(t, l);
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
function ze(t, l, a, i) {
  const c = { ...t.reference_contents || {} };
  return i ? c[l] = i : delete c[l], {
    [l]: a,
    reference_contents: c
  };
}
function Ye(t) {
  return {
    ...t,
    material_ids: [...t.material_ids],
    continuity_state: { ...t.continuity_state },
    speech: t.speech.map((l) => ({ ...l })),
    captions: t.captions.map((l) => ({ ...l })),
    reference_contents: { ...t.reference_contents || {} }
  };
}
function mt(t, l, a) {
  const i = t.shots.findIndex((O) => O.id === l.id);
  if (i < 0) return t;
  const c = t.shots[i], u = [...t.shots];
  u[i] = l;
  const g = t.shots[i - 1], C = t.shots[i + 1];
  return g && c.continue_previous && l.continue_previous && c.start_framing?.trim() && (c.start_framing?.trim() || "") === (g.end_framing?.trim() || "") && l.start_framing !== c.start_framing && (u[i - 1] = {
    ...g,
    ...ze(
      g,
      "end_framing",
      l.start_framing || ""
    )
  }), C?.continue_previous && c.end_framing?.trim() && (c.end_framing?.trim() || "") === (C.start_framing?.trim() || "") && l.end_framing !== c.end_framing && (u[i + 1] = {
    ...C,
    ...ze(
      C,
      "start_framing",
      l.end_framing || ""
    )
  }), { ...t, materials: a, shots: u };
}
function pt(t, l, a) {
  const i = t.shots.findIndex((s) => s.id === l.id), c = mt(t, l, a), u = we(c).filter(
    (s) => s.severity === "error" && (s.shotId === l.id || !!(s.materialId && l.material_ids.includes(s.materialId)))
  ), g = t.shots[i + 1]?.id, C = new Set(
    we(Ae(t)).filter(
      (s) => s.severity === "error" && s.shotId === g
    ).map((s) => s.message)
  ), O = g ? we(Ae(c)).filter(
    (s) => s.severity === "error" && s.shotId === g && !C.has(s.message)
  ) : [];
  return [...u, ...O];
}
function bn(t, l, a) {
  if (a.shot.id !== l.id || a.shot.order !== l.order)
    throw new Error("生成的镜头标识或顺序与当前镜头不符");
  const i = { ...a.shot.reference_contents };
  for (const g of ht)
    l[g] === a.shot[g] && l.reference_contents?.[g] && (i[g] = l.reference_contents[g]);
  const c = { ...a.shot, reference_contents: i }, u = pt(
    t,
    c,
    a.materials
  );
  if (u.length)
    throw new Error(u.map((g) => g.message).join("；"));
  return { shot: Ye(c), materials: a.materials };
}
function fn({
  shot: t,
  materials: l,
  readonly: a,
  onChange: i
}) {
  const c = l.filter(
    (s) => s.type === "character"
  ), u = (s, m) => {
    i((d) => {
      const f = d.speech.map(
        (v) => v.id === s ? vn(v, m) : v
      ), N = f.filter((v) => v.kind === "dialogue").map((v) => v.character_id || "").filter(Boolean);
      return {
        ...d,
        material_ids: [.../* @__PURE__ */ new Set([...d.material_ids, ...N])],
        speech: f
      };
    });
  }, g = (s, m) => {
    i((d) => {
      const f = d.speech.findIndex(
        (E) => E.id === s
      ), N = f + m;
      if (f < 0 || N < 0 || N >= d.speech.length)
        return d;
      const v = [...d.speech], [M] = v.splice(f, 1);
      return v.splice(N, 0, M), { ...d, speech: v };
    });
  }, C = (s, m) => {
    i((d) => ({
      ...d,
      captions: d.captions.map(
        (f) => f.id === s ? { ...f, ...m } : f
      )
    }));
  }, O = (s, m) => {
    i((d) => {
      const f = d.captions.findIndex(
        (E) => E.id === s
      ), N = f + m;
      if (f < 0 || N < 0 || N >= d.captions.length)
        return d;
      const v = [...d.captions], [M] = v.splice(f, 1);
      return v.splice(N, 0, M), { ...d, captions: v };
    });
  };
  return /* @__PURE__ */ n(pe, { children: [
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
              onClick: () => i((s) => ({
                ...s,
                speech: [
                  ...s.speech,
                  Ke(s, "dialogue")
                ]
              })),
              children: [
                /* @__PURE__ */ e(me, { size: 13 }),
                "添加对白"
              ]
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => i((s) => ({
                ...s,
                speech: [
                  ...s.speech,
                  Ke(s, "narration")
                ]
              })),
              children: [
                /* @__PURE__ */ e(me, { size: 13 }),
                "添加旁白"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.speech.length ? t.speech.map((s, m) => /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ n("strong", { children: [
            "语音 ",
            m + 1
          ] }),
          a ? null : /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e(
              te,
              {
                label: "上移语音",
                disabled: m === 0,
                onClick: () => g(s.id, -1),
                children: /* @__PURE__ */ e(We, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "下移语音",
                disabled: m === t.speech.length - 1,
                onClick: () => g(s.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "删除语音",
                danger: !0,
                onClick: () => i((d) => ({
                  ...d,
                  speech: d.speech.filter(
                    (f) => f.id !== s.id
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
                value: s.kind,
                disabled: a,
                onChange: (d) => u(s.id, {
                  kind: d.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "dialogue", children: "角色对白" }),
                  /* @__PURE__ */ e("option", { value: "narration", children: "旁白" })
                ]
              }
            )
          ] }),
          s.kind === "dialogue" ? /* @__PURE__ */ n(pe, { children: [
            /* @__PURE__ */ n("label", { children: [
              "角色",
              /* @__PURE__ */ n(
                "select",
                {
                  value: s.character_id || "",
                  disabled: a,
                  onChange: (d) => u(s.id, {
                    character_id: d.target.value
                  }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "请选择角色" }),
                    c.map((d) => /* @__PURE__ */ e("option", { value: d.id, children: d.name }, d.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("label", { children: [
              "说话方式",
              /* @__PURE__ */ n(
                "select",
                {
                  value: s.speaker_mode || "offscreen",
                  disabled: a,
                  onChange: (d) => u(s.id, {
                    speaker_mode: d.target.value === "visible" ? "visible" : "offscreen"
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
                  value: s.start_time,
                  disabled: a,
                  onChange: (d) => u(s.id, {
                    start_time: Te(d)
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
              value: s.text,
              readOnly: a,
              placeholder: s.kind === "narration" ? "输入旁白" : "输入对白",
              onChange: (d) => u(s.id, {
                text: d.target.value
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
                checked: s.subtitle_enabled,
                disabled: a,
                onChange: (d) => u(s.id, {
                  subtitle_enabled: d.target.checked
                })
              }
            ),
            "加入字幕"
          ] }),
          s.subtitle_enabled ? /* @__PURE__ */ e(
            "input",
            {
              value: s.subtitle_text,
              readOnly: a,
              placeholder: "可选：填写精简字幕；留空使用原文",
              onChange: (d) => u(s.id, {
                subtitle_text: d.target.value
              })
            }
          ) : null
        ] })
      ] }, s.id)) : /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e(At, { size: 24 }),
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
            onClick: () => i((s) => ({
              ...s,
              captions: [
                ...s.captions,
                Pt(s)
              ]
            })),
            children: [
              /* @__PURE__ */ e(me, { size: 13 }),
              "添加文案"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.captions.length ? t.captions.map((s, m) => /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ n("strong", { children: [
            "文案 ",
            m + 1
          ] }),
          a ? null : /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e(
              te,
              {
                label: "上移文案",
                disabled: m === 0,
                onClick: () => O(s.id, -1),
                children: /* @__PURE__ */ e(We, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "下移文案",
                disabled: m === t.captions.length - 1,
                onClick: () => O(s.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              te,
              {
                label: "删除文案",
                danger: !0,
                onClick: () => i((d) => ({
                  ...d,
                  captions: d.captions.filter(
                    (f) => f.id !== s.id
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
                value: s.type,
                disabled: a,
                onChange: (d) => C(s.id, {
                  type: d.target.value
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
                  value: s.start_time,
                  disabled: a,
                  onChange: (d) => C(s.id, {
                    start_time: Te(d)
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
                  value: s.end_time,
                  disabled: a,
                  onChange: (d) => C(s.id, {
                    end_time: Te(d)
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
              value: s.text,
              readOnly: a,
              placeholder: "输入不对应语音的标题、说明或重点文字",
              onChange: (d) => C(s.id, {
                text: d.target.value
              })
            }
          )
        ] })
      ] }, s.id)) : /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e(Be, { size: 24 }),
        /* @__PURE__ */ e("span", { children: "当前镜头没有附加字幕文案" })
      ] }) })
    ] })
  ] });
}
function te({
  label: t,
  disabled: l,
  danger: a = !1,
  onClick: i,
  children: c
}) {
  return /* @__PURE__ */ e(Z, { label: t, children: /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${a ? "is-danger" : ""}`,
      "aria-label": t,
      disabled: l,
      onClick: i,
      children: c
    }
  ) });
}
function vn(t, l) {
  const a = { ...t, ...l };
  return a.kind === "dialogue" ? (a.character_id ||= "", a.speaker_mode ||= "offscreen") : (delete a.character_id, delete a.speaker_mode), a.subtitle_enabled = !!a.subtitle_enabled, a.subtitle_text ||= "", a;
}
function Te(t) {
  const l = Number.parseFloat(t.target.value);
  return Number.isFinite(l) && l >= 0 ? l : 0;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const be = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!be || Object.keys(be).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const yn = be.Dialog, _n = be.DialogContent, wn = be.DialogTitle, Nn = [
  { value: "independent", label: "独立切镜", description: "新构图或新状态" },
  { value: "match", label: "画面匹配", description: "沿用上一镜结束状态" },
  { value: "continue", label: "动作续接", description: "从上一段真实尾帧继续" }
];
function Sn({
  shot: t,
  index: l,
  previousShot: a,
  storyboard: i,
  materials: c,
  readonly: u,
  referenceAdapter: g,
  onGenerate: C,
  onSave: O,
  onClose: s
}) {
  const [m, d] = R(() => Ye(t)), [f, N] = R(
    () => c.map((o) => ({ ...o }))
  ), [v, M] = R(""), E = f.find(
    (o) => o.id === v
  ), [y, P] = R(!1), z = A(!0);
  H(() => (z.current = !0, () => {
    z.current = !1;
  }), []);
  const L = () => {
    z.current = !1, s();
  }, [X, D] = R(""), [I, F] = R("picture"), [J] = R(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), [B, G] = R(""), Y = new Set(
    c.map((o) => o.id)
  ), re = new Set(
    m.speech.filter((o) => o.kind === "dialogue").map((o) => o.character_id || "").filter(Boolean)
  ), fe = Lt(m, l), ve = Cn(m), W = pt(
    i,
    m,
    f
  ), q = (o, p, S) => {
    d((x) => ({
      ...x,
      ...ze(x, o, p, S)
    }));
  }, se = (o) => {
    d((p) => p.material_ids.includes(o) ? re.has(o) ? p : {
      ...p,
      material_ids: p.material_ids.filter((S) => S !== o)
    } : {
      ...p,
      material_ids: [...p.material_ids, o]
    });
  }, Se = async (o) => {
    if (!C || y)
      return !1;
    G(""), P(!0);
    try {
      const p = {
        ...i,
        materials: f,
        shots: i.shots.map(
          (U) => U.id === m.id ? m : U
        )
      }, S = await C(
        p,
        m.id,
        o.trim()
      ), x = bn(
        p,
        m,
        S
      );
      return z.current ? (N(x.materials), d(x.shot), D(""), !0) : !1;
    } catch (p) {
      return z.current && G(
        p instanceof Error ? p.message : "生成镜头失败，请重试"
      ), !1;
    } finally {
      z.current && P(!1);
    }
  };
  return /* @__PURE__ */ n(pe, { children: [
    /* @__PURE__ */ e(yn, { open: !0, onOpenChange: (o) => !o && L(), children: /* @__PURE__ */ n(
      _n,
      {
        className: "ws-storyboard-shot-dialog ws-storyboard-shot-editor nodrag nopan nowheel",
        layerClassName: "wb-detail-backdrop",
        layerZIndex: Le,
        showCloseButton: !1,
        "aria-describedby": void 0,
        "aria-busy": y,
        onCloseAutoFocus: (o) => {
          J?.isConnected && (o.preventDefault(), J.focus({ preventScroll: !0 }));
        },
        children: [
          /* @__PURE__ */ n("header", { children: [
            /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ n(wn, { children: [
                u ? "查看镜头" : "编辑镜头",
                " ",
                String(l + 1).padStart(2, "0")
              ] }),
              /* @__PURE__ */ e("span", { children: u ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
            ] }),
            /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: L, children: /* @__PURE__ */ e(ot, { size: 18 }) })
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
                      ].map((o) => /* @__PURE__ */ e(
                        "button",
                        {
                          type: "button",
                          "aria-pressed": I === o.id,
                          onClick: () => F(o.id),
                          children: o.label
                        },
                        o.id
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
                                value: m.duration || "",
                                disabled: u,
                                onChange: (o) => d((p) => ({
                                  ...p,
                                  duration: Rn(o)
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
                              value: m.shot_image_mode,
                              disabled: u,
                              onChange: (o) => d((p) => ({
                                ...p,
                                shot_image_mode: Vt(
                                  o.target.value
                                )
                              })),
                              children: Yt(m).map((o) => /* @__PURE__ */ e("option", { value: o, children: o === "first_frame" && m.continue_previous ? "首帧（沿用上镜尾帧）" : o === "last_frame" && m.continue_previous ? "尾帧（首帧沿用上镜）" : qt[o] }, o))
                            }
                          )
                        ] }) }),
                        /* @__PURE__ */ n(
                          "div",
                          {
                            className: `ws-storyboard-shot-field-row ${l === 0 ? "is-single" : ""}`,
                            children: [
                              /* @__PURE__ */ e(
                                _e,
                                {
                                  label: "动作与变化",
                                  value: m.beat,
                                  placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                                  readonly: u || y,
                                  onChange: (o) => d((p) => ({ ...p, beat: o }))
                                }
                              ),
                              l > 0 ? /* @__PURE__ */ e(
                                _e,
                                {
                                  label: "与上镜关系",
                                  value: m.transition,
                                  placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                                  readonly: u || y,
                                  onChange: (o) => d((p) => ({
                                    ...p,
                                    transition: o
                                  }))
                                }
                              ) : null
                            ]
                          }
                        ),
                        l > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ n("label", { children: [
                            /* @__PURE__ */ e("span", { children: "剪辑转场" }),
                            /* @__PURE__ */ e(
                              "select",
                              {
                                value: m.transition_type,
                                disabled: u,
                                onChange: (o) => d((p) => {
                                  const S = o.target.value;
                                  return {
                                    ...p,
                                    transition_type: S,
                                    transition_duration_ms: S === "none" ? 0 : Math.max(
                                      500,
                                      p.transition_duration_ms
                                    )
                                  };
                                }),
                                children: Ut.map((o) => /* @__PURE__ */ e("option", { value: o, children: jt[o] }, o))
                              }
                            )
                          ] }),
                          m.transition_type !== "none" ? /* @__PURE__ */ n("label", { children: [
                            /* @__PURE__ */ e("span", { children: "转场时长" }),
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: 100,
                                max: 5e3,
                                step: 100,
                                value: m.transition_duration_ms,
                                disabled: u,
                                onChange: (o) => d((p) => ({
                                  ...p,
                                  transition_duration_ms: Math.min(
                                    5e3,
                                    On(
                                      o,
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
                            value: m.description,
                            content: m.reference_contents?.description,
                            placeholder: "描述当前画面中的主体、位置和环境；动作填写在动作与变化中",
                            readonly: u || y,
                            referenceAdapter: g,
                            onChange: (o, p) => q("description", o, p)
                          }
                        ) }),
                        /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                          ne,
                          {
                            label: "空间关系",
                            value: m.spatial_layout,
                            content: m.reference_contents?.spatial_layout,
                            placeholder: "主体、环境和物件的前后左右、接触或承载关系，以及真实相对尺度",
                            readonly: u || y,
                            referenceAdapter: g,
                            onChange: (o, p) => q("spatial_layout", o, p)
                          }
                        ) }),
                        /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "起始构图",
                              value: m.start_framing || "",
                              content: m.reference_contents?.start_framing,
                              placeholder: "动作开始时的景别、机位、主体位置、景深与焦点",
                              readonly: u || y,
                              referenceAdapter: g,
                              onChange: (o, p) => q("start_framing", o, p)
                            }
                          ),
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "结束构图",
                              value: m.end_framing || "",
                              content: m.reference_contents?.end_framing,
                              placeholder: "动作结束时的景别、机位、主体位置、景深与焦点",
                              readonly: u || y,
                              referenceAdapter: g,
                              onChange: (o, p) => q("end_framing", o, p)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "景别与运镜",
                              value: m.camera_instruction,
                              content: m.reference_contents?.camera_instruction,
                              placeholder: "景别、机位和运动方式",
                              readonly: u || y,
                              referenceAdapter: g,
                              onChange: (o, p) => q("camera_instruction", o, p)
                            }
                          ),
                          /* @__PURE__ */ e(
                            ne,
                            {
                              label: "视频提示词",
                              value: m.video_prompt,
                              content: m.reference_contents?.video_prompt,
                              placeholder: "补充视频制作要求；与动作、构图和运镜保持一致",
                              readonly: u || y,
                              referenceAdapter: g,
                              onChange: (o, p) => q("video_prompt", o, p)
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
                            m.material_ids.length,
                            " 个素材"
                          ] })
                        ] }) }),
                        f.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((o) => {
                          const p = f.filter(
                            (S) => S.type === o
                          );
                          return p.length ? /* @__PURE__ */ n("fieldset", { children: [
                            /* @__PURE__ */ e("legend", { children: ae[o] }),
                            /* @__PURE__ */ e("div", { children: p.map((S) => {
                              const x = m.material_ids.includes(
                                S.id
                              ), U = re.has(
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
                                        label: x && U ? "该角色已用于对白，不能取消关联" : x ? "取消关联" : "关联素材",
                                        children: /* @__PURE__ */ n("label", { children: [
                                          /* @__PURE__ */ e(
                                            "input",
                                            {
                                              type: "checkbox",
                                              checked: x,
                                              disabled: u || x && U,
                                              onChange: () => se(S.id)
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
                                        label: `${u ? "查看" : "编辑"}${ae[o]}提示词：${S.name}`,
                                        children: /* @__PURE__ */ n(
                                          "button",
                                          {
                                            type: "button",
                                            disabled: y,
                                            onClick: () => M(S.id),
                                            children: [
                                              /* @__PURE__ */ e("span", { children: S.name }),
                                              u ? null : /* @__PURE__ */ e(lt, { size: 11 })
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
                          ] }, o) : null;
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
                          l > 0 ? /* @__PURE__ */ e("div", { className: "ws-storyboard-continuity-modes", children: Nn.map((o) => /* @__PURE__ */ n(
                            "label",
                            {
                              className: `ws-storyboard-continuity-input${ve === o.value ? " is-selected" : ""}`,
                              children: [
                                /* @__PURE__ */ e(
                                  "input",
                                  {
                                    type: "radio",
                                    name: `storyboard-continuity-${t.id}`,
                                    value: o.value,
                                    checked: ve === o.value,
                                    disabled: u,
                                    onChange: () => d(
                                      (p) => In(
                                        p,
                                        o.value,
                                        a
                                      )
                                    )
                                  }
                                ),
                                /* @__PURE__ */ n("span", { children: [
                                  /* @__PURE__ */ e("strong", { children: o.label }),
                                  /* @__PURE__ */ e("small", { children: o.description })
                                ] })
                              ]
                            },
                            o.value
                          )) }) : null,
                          l > 0 && m.continue_previous ? /* @__PURE__ */ n("label", { className: "ws-storyboard-continuity-anchor", children: [
                            /* @__PURE__ */ e("span", { children: "连续性锚点" }),
                            /* @__PURE__ */ e(
                              "textarea",
                              {
                                value: m.continuity_anchor,
                                readOnly: u,
                                placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                onChange: (o) => d((p) => ({
                                  ...p,
                                  continuity_anchor: o.target.value
                                }))
                              }
                            )
                          ] }) : null,
                          /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row", children: [
                            /* @__PURE__ */ e(
                              _e,
                              {
                                label: "入镜状态",
                                value: m.continuity_state.entry,
                                placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                readonly: u || y || fe,
                                onChange: (o) => d((p) => ({
                                  ...p,
                                  continuity_state: {
                                    ...p.continuity_state,
                                    entry: o
                                  }
                                }))
                              }
                            ),
                            /* @__PURE__ */ e(
                              _e,
                              {
                                label: "出镜状态",
                                value: m.continuity_state.exit,
                                placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                readonly: u || y,
                                onChange: (o) => d((p) => ({
                                  ...p,
                                  continuity_state: {
                                    ...p.continuity_state,
                                    exit: o
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
                      shot: m,
                      materials: f,
                      readonly: u || y,
                      onChange: d
                    }
                  ) : null,
                  W.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-form-error", role: "alert", children: W.map((o) => /* @__PURE__ */ e("p", { children: o.message }, o.id)) }) : null
                ]
              }
            ),
            !u && C ? /* @__PURE__ */ n("aside", { className: "ws-storyboard-shot-ai", children: [
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
                    onChange: (o) => {
                      D(o.target.value), G("");
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
                    Se(X);
                  },
                  children: [
                    y ? /* @__PURE__ */ e(Pe, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(Je, { size: 14 }),
                    y ? "正在修改" : "修改当前镜头"
                  ]
                }
              ),
              /* @__PURE__ */ e("p", { children: "生成后直接更新左侧草稿，检查后保存。取消会保留原镜头。" }),
              B ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "alert", children: B }) : null
            ] }) : null
          ] }),
          /* @__PURE__ */ n("footer", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: L, children: u ? "关闭" : "取消" }),
            u ? null : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: y || W.length > 0,
                onClick: () => O(
                  m,
                  f.filter(
                    (o) => Y.has(o.id) || m.material_ids.includes(o.id)
                  )
                ),
                children: [
                  /* @__PURE__ */ e(Ne, { size: 14 }),
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
        readonly: u || y,
        usage: $e(
          {
            ...i,
            shots: i.shots.map(
              (o) => o.id === m.id ? m : o
            )
          },
          E.id
        ),
        existingNames: f.filter((o) => o.id !== E.id).map((o) => o.name),
        onSave: (o) => {
          N(
            (p) => p.map(
              (S) => S.id === o.id ? o : S
            )
          ), M("");
        },
        onClose: () => M("")
      }
    ) : null
  ] });
}
function ne({
  label: t,
  value: l,
  content: a,
  placeholder: i,
  readonly: c,
  referenceAdapter: u,
  onChange: g
}) {
  return /* @__PURE__ */ n("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      sn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: l,
        content: a,
        adapter: u,
        placeholder: i,
        disabled: c,
        layerZIndex: Le + 40,
        onChange: g
      }
    )
  ] });
}
function _e({
  label: t,
  value: l,
  placeholder: a,
  readonly: i,
  onChange: c
}) {
  return /* @__PURE__ */ n("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: l,
        rows: 3,
        placeholder: a,
        readOnly: i,
        onChange: (u) => c(u.target.value)
      }
    )
  ] });
}
function Cn(t) {
  return t.continue_previous ? "continue" : t.match_previous ? "match" : "independent";
}
function In(t, l, a) {
  const i = l !== "independent", c = l === "continue";
  return {
    ...t,
    match_previous: l === "match",
    continue_previous: c,
    shot_image_mode: Ht({
      ...t,
      match_previous: l === "match",
      continue_previous: c
    }).mode,
    continuity_anchor: c ? t.continuity_anchor : "",
    continuity_state: i ? {
      ...t.continuity_state,
      entry: a?.continuity_state.exit || t.continuity_state.entry
    } : t.continuity_state
  };
}
function Rn(t) {
  const l = Number(t.target.value);
  return Number.isFinite(l) ? l : 0;
}
function On(t, l, a) {
  const i = Number(t.target.value);
  return Number.isInteger(i) && i >= a ? i : l;
}
const kn = [], xn = [], Mn = [], En = [];
function Un({
  storyboard: t,
  editable: l = !1,
  disabled: a = !1,
  onSave: i,
  onChange: c,
  onConfirm: u,
  onCreateRevision: g,
  onGenerateShot: C,
  workflowAction: O = "",
  saveStatus: s,
  showSaveStatus: m = !0,
  showMetrics: d = !0,
  referenceItems: f = kn,
  storyboardSourceNodeId: N = "",
  canvasNodes: v = xn,
  workTypeSpecs: M = Mn,
  purposeSpecs: E = En,
  focus: y
}) {
  const P = he(
    () => JSON.stringify(t),
    [t]
  ), [z, L] = R(t), [X, D] = R("saved"), [I, F] = R(""), [J, B] = R(""), [G, Y] = R(null), [re, fe] = R(""), [ve, W] = R(""), [q, se] = R([]), [Se, o] = R(
    "before"
  ), p = A(null), S = A(""), x = A([]), U = A(/* @__PURE__ */ new Map()), Q = A(/* @__PURE__ */ new Map()), Ce = A(t), ye = A(!1), ie = A(0), qe = A(P), V = A(null), Ve = A(Promise.resolve()), oe = A(!0), le = !!c, b = le ? t : z, Ue = M.find(
    (r) => r.key === b.work_type
  )?.name, Ie = Xt(b), k = l && !a && !Ie && !O && !!(c || i), je = k && !le && !!i, He = ct(f), ce = b.shots.find((r) => r.id === I), Re = b.shots.findIndex(
    (r) => r.id === I
  ), bt = Re > 0 ? b.shots[Re - 1] : void 0, Oe = b.materials.find(
    (r) => r.id === J
  ), K = Oe || G, ft = K ? $e(b, K.id) : void 0, vt = he(
    () => nt(b.shots, q, (r) => r.id),
    [b.shots, q]
  ), ke = he(
    () => we(b, {
      coreOnly: !0,
      workTypeSpecs: M,
      purposeSpecs: E
    }),
    [b, E, M]
  ), yt = ke.some(
    (r) => r.severity === "error"
  ), _t = (r) => {
    if (r.materialId) {
      F(""), Y(null), B(r.materialId);
      return;
    }
    r.shotId && (B(""), Y(null), F(r.shotId));
  }, wt = he(
    () => new Map(
      tn(b, N, v).map(
        (r) => [r.shot.id, r]
      )
    ),
    [b, N, v]
  ), Nt = he(
    () => b.shots.some(
      (r) => r.speech.some(
        (h) => h.kind === "narration" && !!h.text.trim()
      )
    ),
    [b.shots]
  );
  H(() => (oe.current = !0, () => {
    oe.current = !1, V.current && window.clearTimeout(V.current);
  }), []), H(
    () => () => {
      for (const r of Q.current.values())
        r.cancel();
      Q.current.clear();
    },
    []
  ), Dt(() => {
    const r = U.current, h = p.current;
    if (!h || r.size === 0)
      return;
    const w = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    h.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((_) => {
      if (_.classList.contains("is-dragging"))
        return;
      const T = _.dataset.sequenceItemId || "", j = r.get(T);
      if (!j || w)
        return;
      const xe = _.getBoundingClientRect(), de = j.left - xe.left, ee = j.top - xe.top;
      if (Math.abs(de) < 1 && Math.abs(ee) < 1)
        return;
      Q.current.get(T)?.cancel();
      const ue = _.animate(
        [
          { transform: `translate3d(${de}px, ${ee}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      Q.current.set(T, ue), ue.onfinish = () => {
        Q.current.get(T) === ue && Q.current.delete(T);
      };
    }), r.clear();
  }, [q]), H(() => {
    qe.current !== P && (qe.current = P, !ye.current && (Ce.current = t, L(t), D("saved")));
  }, [P, t]), H(() => {
    I && !ce && F("");
  }, [ce, I]), H(() => {
    J && !Oe && B("");
  }, [Oe, J]), H(() => {
    if (!y)
      return;
    if (y.materialId && b.materials.some((h) => h.id === y.materialId)) {
      Y(null), F(""), B(y.materialId);
      return;
    }
    if (y.shotId && b.shots.some((h) => h.id === y.shotId)) {
      Y(null), B(""), F(y.shotId);
      return;
    }
    const r = window.requestAnimationFrame(() => {
      const h = y.materialType ? `[data-storyboard-material-type="${y.materialType}"]` : y.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      p.current?.querySelector(h)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(r);
  }, [y?.materialId, y?.materialType, y?.section, y?.shotId]), H(() => {
    if (!je || !ye.current || !i)
      return;
    V.current && window.clearTimeout(V.current);
    const r = b, h = ie.current;
    return V.current = window.setTimeout(() => {
      V.current = null, Ve.current = Ve.current.catch(() => {
      }).then(async () => {
        oe.current && h === ie.current && D("saving");
        try {
          if (await i(r), !oe.current || h !== ie.current)
            return;
          ye.current = !1, D("saved");
        } catch {
          if (!oe.current || h !== ie.current)
            return;
          D("error");
        }
      });
    }, 800), () => {
      V.current && (window.clearTimeout(V.current), V.current = null);
    };
  }, [je, b, i]);
  const $ = (r) => {
    if (!k)
      return;
    const h = le ? t : Ce.current, w = r(h), _ = Dn(
      Ae(Qt(h, w)),
      He.options
    );
    if (Ce.current = _, le) {
      c?.(_);
      return;
    }
    ye.current = !0, ie.current += 1, L(_), D("typing");
  }, Xe = () => {
    const r = p.current;
    if (!r)
      return;
    const h = /* @__PURE__ */ new Map();
    r.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((w) => {
      const _ = w.dataset.sequenceItemId || "";
      _ && h.set(_, w.getBoundingClientRect());
    }), U.current = h;
  }, St = (r) => {
    const h = b.shots.map((w) => w.id);
    S.current = r, x.current = h, fe(r), W(""), se(h);
  }, Ct = (r, h) => {
    const w = S.current, _ = x.current;
    if (!w || !r || w === r || !_.length || !_.includes(w) || !_.includes(r))
      return;
    const T = h.currentTarget.getBoundingClientRect(), j = h.currentTarget.parentElement?.getBoundingClientRect(), de = !!(j && T.width * 1.5 < j.width) ? h.clientX < T.left + T.width / 2 ? "before" : "after" : h.clientY < T.top + T.height / 2 ? "before" : "after", ee = nn(
      _,
      w,
      r,
      de,
      (ue) => ue
    );
    W(r), o(de), !Ee(_, ee) && (Xe(), x.current = ee, se(ee));
  }, Ge = () => {
    const r = x.current, h = b.shots.map((w) => w.id);
    r.length > 0 && !Ee(r, h) && Xe(), S.current = "", x.current = [], fe(""), W(""), se([]);
  }, It = () => {
    const r = x.current;
    r.length > 0 && $((h) => {
      const w = nt(h.shots, r, (_) => _.id);
      return Ee(
        h.shots.map((_) => _.id),
        w.map((_) => _.id)
      ) ? h : { ...h, shots: w };
    }), Ge();
  }, Rt = (r, h) => {
    $((w) => mt(w, r, h)), F("");
  }, Ot = (r) => {
    $((h) => {
      const w = h.materials.some((_) => _.id === r.id);
      return {
        ...h,
        materials: w ? h.materials.map(
          (_) => _.id === r.id ? r : _
        ) : [...h.materials, r]
      };
    }), B(""), Y(null);
  }, kt = (r) => {
    B(""), Y(Kt(b.materials, r));
  }, xt = (r) => {
    const h = $e(b, r);
    h.shotIds.length || h.speechIds.length || ($((w) => ({
      ...w,
      materials: w.materials.filter((_) => _.id !== r)
    })), B(""), Y(null));
  }, Mt = (r) => {
    $((h) => h.shots.length <= 1 ? h : {
      ...h,
      shots: h.shots.filter((w) => w.id !== r)
    });
  }, Et = (r) => {
    $((h) => {
      if (h.shots.length >= Me)
        return h;
      const w = An(h.shots, r), _ = h.shots.findIndex((j) => j.id === r.id), T = [...h.shots];
      return T.splice(_ + 1, 0, w), { ...h, shots: T };
    });
  }, Tt = () => {
    $((r) => r.shots.length >= Me ? r : {
      ...r,
      shots: [...r.shots, gt(r.shots)]
    });
  };
  return /* @__PURE__ */ n(
    "section",
    {
      ref: p,
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
                  onChange: (r) => $(() => r)
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
                      onChange: (r) => $((h) => ({
                        ...h,
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
                      onChange: (r) => $((h) => ({
                        ...h,
                        aspect_ratio: r.target.value
                      })),
                      children: Zt.map((r) => /* @__PURE__ */ e("option", { value: r, children: r }, r))
                    }
                  ) : /* @__PURE__ */ e("span", { children: b.aspect_ratio })
                ] }),
                Nt || b.narrator_voice ? /* @__PURE__ */ n("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ e("strong", { children: "旁白音色" }),
                  k ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: b.narrator_voice,
                      placeholder: "自动配音时必填",
                      disabled: a,
                      onChange: (r) => $((h) => ({
                        ...h,
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
                      onChange: (r) => $(
                        (h) => en(
                          h,
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
                  onOpen: B,
                  onCreate: kt
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ e("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ n("div", { className: "ws-storyboard-toolbar-end", children: [
              d || k && m ? /* @__PURE__ */ n("div", { className: "ws-storyboard-toolbar-meta", children: [
                d ? /* @__PURE__ */ n("span", { children: [
                  b.shots.length,
                  " 个镜头 ·",
                  " ",
                  Jt(b),
                  " 秒 · ",
                  b.aspect_ratio
                ] }) : null,
                k && m ? /* @__PURE__ */ e(
                  Bn,
                  {
                    status: le ? s || "saved" : X
                  }
                ) : null
              ] }) : null,
              k ? /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: a || b.shots.length >= Me,
                  onClick: Tt,
                  children: [
                    /* @__PURE__ */ e(me, { size: 13 }),
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
                    O === "revising" ? /* @__PURE__ */ e(Pe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e($t, { size: 13 }),
                    O === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !Ie && k && u ? /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: yt,
                  onClick: () => {
                    u();
                  },
                  children: [
                    /* @__PURE__ */ e(Ne, { size: 13 }),
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
            /* @__PURE__ */ e("div", { className: "ws-storyboard-grid nowheel", children: b.shots.length ? vt.map((r, h) => /* @__PURE__ */ e(
              on,
              {
                shot: r,
                index: h,
                storyboard: b,
                frame: wt.get(r.id),
                selected: I === r.id,
                editable: k,
                dragging: re === r.id,
                dropPlacement: ve === r.id && re !== r.id ? Se : void 0,
                onOpen: () => F(r.id),
                onDuplicate: () => Et(r),
                onRemove: () => Mt(r.id),
                onDragStart: () => St(r.id),
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
        ce ? /* @__PURE__ */ e(
          Sn,
          {
            shot: ce,
            index: Re,
            previousShot: bt,
            storyboard: b,
            materials: b.materials,
            readonly: !k,
            referenceAdapter: He,
            onGenerate: C,
            onSave: Rt,
            onClose: () => F("")
          },
          ce.id
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
              B(""), Y(null);
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
  editable: l,
  onOpen: a,
  onCreate: i
}) {
  return /* @__PURE__ */ n("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ e("strong", { children: "素材设定" }),
      l ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((c) => /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => i(c),
          children: [
            /* @__PURE__ */ e(me, { size: 11 }),
            ae[c]
          ]
        },
        c
      )) }) : null
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((c) => {
        const u = t.filter(
          (g) => g.type === c
        );
        return u.length ? /* @__PURE__ */ n(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": c,
            children: [
              /* @__PURE__ */ e("span", { children: ae[c] }),
              u.map((g) => /* @__PURE__ */ e(
                Z,
                {
                  label: `${l ? "编辑" : "查看"}${ae[c]}提示词：${g.name}`,
                  children: /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => a(g.id),
                      children: [
                        /* @__PURE__ */ e("span", { children: g.name }),
                        l ? /* @__PURE__ */ e(lt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                g.id
              ))
            ]
          },
          c
        ) : null;
      }),
      t.length ? null : /* @__PURE__ */ e("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Dn(t, l) {
  return {
    ...t,
    shots: t.shots.map((a) => {
      const i = { ...a.reference_contents || {} };
      for (const c of ht) {
        const u = an(
          a[c] || "",
          i[c],
          l
        );
        u ? i[c] = u : delete i[c];
      }
      return { ...a, reference_contents: i };
    })
  };
}
function Bn({ status: t }) {
  return /* @__PURE__ */ n("span", { className: `ws-storyboard-save-state is-${t}`, children: [
    t === "saving" ? /* @__PURE__ */ e(Pe, { size: 12, className: "ws-spin" }) : t === "saved" ? /* @__PURE__ */ e(Ne, { size: 12 }) : null,
    t === "typing" ? "编辑中" : t === "saving" ? "保存中" : t === "error" ? "保存失败" : "已保存"
  ] });
}
function gt(t) {
  const l = new Set(t.map((c) => c.id));
  let a = t.length, i = tt(a);
  for (; l.has(i.id); )
    a += 1, i = tt(a);
  return i;
}
function An(t, l) {
  const a = gt(t);
  return {
    ...Ye(l),
    id: a.id,
    order: a.order,
    speech: l.speech.map((i, c) => ({
      ...i,
      id: `${a.id}-speech-${c + 1}`
    })),
    captions: l.captions.map((i, c) => ({
      ...i,
      id: `${a.id}-caption-${c + 1}`
    }))
  };
}
export {
  Un as StoryboardView
};
