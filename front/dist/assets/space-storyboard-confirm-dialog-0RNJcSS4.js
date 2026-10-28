import { a as p, j as u } from "./react-5Z-wsVEn.js";
import { a as X, u as P, d as q } from "./file-kind-D6bMOzYN.js";
import { c as J } from "./preloadable-CT3tMmBD.js";
import { y as Q, X as W, n as F, r as Z } from "./vendor-icons-fVDtJt66.js";
import { Q as ee, ar as K, ax as te, af as E, aa as R, ay as ie, az as re, ae as ne, aj as ae, aA as U, aB as Y, aC as G, aD as z, aE as se, aF as oe, aG as ce, aH as le, aI as ue, aJ as de, aq as pe, aK as fe } from "./asset-preview-BZxHU4Mm.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-confirm-dialog-Dmpdwwvy.css", import.meta.url).href]);
function me(e, r = {}) {
  const n = Ie(e, r), i = [], a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), d = new Map(
    e.references.map((t) => [t.key, t])
  ), y = /* @__PURE__ */ new Set();
  if (r.workTypeSpecs?.length && r.purposeSpecs?.length) {
    const t = ee(
      e.references,
      e.work_type,
      r.workTypeSpecs,
      r.purposeSpecs
    );
    t && i.push(v("references", t));
  }
  e.title.trim() || i.push(v("title", "分镜标题不能为空")), e.summary.trim() || i.push(v("summary", "请补充整个脚本的内容简介")), n.referenceImages && !e.style_prompt.trim() && i.push(v("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > K) && i.push(
    v(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${K} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && i.push(
    v("target_shot_count", "目标镜头数与实际镜头数不一致")
  );
  const S = te(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < E ? i.push(
    v(
      "target_duration",
      `目标总时长必须是不小于 ${E} 秒的整数`
    )
  ) : e.target_duration !== S && i.push(
    v("target_duration", "目标总时长与镜头时长之和不一致")
  );
  for (const t of e.materials) {
    const f = t.name.trim(), l = f.toLocaleLowerCase();
    t.id.trim() ? a.has(t.id) && i.push($(t, `素材标识“${t.id}”重复`)) : i.push($(t, "缺少稳定标识")), f ? s.has(l) && i.push($(t, `素材名称“${f}”重复`)) : i.push($(t, "名称不能为空")), n.referenceImages && !t.prompt.trim() && i.push($(t, "生成提示词不能为空")), t.type !== "character" && t.voice.trim() && i.push($(t, "只有角色可以配置音色"));
    for (const o of t.reference_keys) {
      const g = d.get(o);
      g ? r.purposeSpecs?.length && R(
        g.purpose,
        r.purposeSpecs || []
      )?.material_type !== t.type ? i.push(
        $(t, `参考素材“${g.label}”的用途不匹配`)
      ) : y.add(o) : i.push(
        $(t, `引用了不存在的参考素材“${o}”`)
      );
    }
    s.add(l), a.set(t.id, t);
  }
  if (n.voice && he(e, i), !e.shots.length)
    return i.push(v("shots", "分镜至少需要一个镜头")), i;
  let w = /* @__PURE__ */ new Set(), b = !1, D = "", I = "", k = 0;
  const C = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
  e.shots.forEach((t, f) => {
    const l = ie(
      e.shots,
      f,
      e.materials
    );
    l && i.push(
      c(t, f + 1, `共享结束画面：${l}`)
    );
    const o = f + 1;
    (!t.id.trim() || C.has(t.id)) && i.push(c(t, o, "镜头标识缺失或重复")), C.add(t.id), re(t.duration) || i.push(
      c(
        t,
        o,
        `时长必须是不小于 ${E} 秒的整数`
      )
    ), t.beat.trim() ? H(
      V,
      t.beat,
      t,
      o,
      "本镜变化",
      i
    ) : i.push(c(t, o, "请填写本镜变化")), f === 0 && t.transition.trim() ? i.push(c(t, o, "第一镜不能填写上镜承接关系")) : f > 0 && !t.transition.trim() && i.push(c(t, o, "请说明与上一镜头的承接关系")), t.description.trim() ? H(
      M,
      t.description,
      t,
      o,
      "镜头描述",
      i
    ) : i.push(c(t, o, "镜头描述不能为空")), n.shotVideos && !t.video_prompt.trim() && i.push(c(t, o, "视频提示词不能为空"));
    for (const _ of t.reference_keys) {
      const N = d.get(_);
      N ? r.purposeSpecs?.length && R(
        N.purpose,
        r.purposeSpecs || []
      )?.scope !== "shot" ? i.push(
        c(
          t,
          o,
          `参考素材“${N.label}”的用途不匹配`
        )
      ) : y.add(_) : i.push(
        c(
          t,
          o,
          `引用了不存在的参考素材“${_}”`
        )
      );
    }
    const g = /* @__PURE__ */ new Set();
    for (const _ of t.material_ids)
      a.has(_) ? g.has(_) && i.push(c(t, o, `重复引用素材“${_}”`)) : i.push(
        c(t, o, `引用了不存在的素材“${_}”`)
      ), g.add(_);
    f === 0 && t.continue_previous && i.push(c(t, o, "第一个镜头不能承接上一镜头")), f === 0 && t.match_previous && i.push(c(t, o, "第一个镜头不能匹配上一镜头")), t.match_previous && t.continue_previous && i.push(
      c(t, o, "不能同时匹配上一镜画面和延续上一镜视频")
    );
    const B = t.continuity_state?.entry.trim() || "", x = t.continuity_state?.exit.trim() || "";
    if (n.referenceImages) {
      B || i.push(c(t, o, "请填写入镜状态"));
      const _ = t.start_framing?.trim() || "";
      t.continue_previous && _ && I && _ !== I && i.push(
        c(
          t,
          o,
          "动作续接时，起始构图必须与上一镜头的结束构图完全一致"
        )
      ), x || i.push(c(t, o, "请填写出镜状态")), ne(t, f) && B !== D && i.push(
        c(
          t,
          o,
          "入镜状态必须与上一镜头的出镜状态完全一致"
        )
      );
    }
    n.shotVideos && (ae.includes(t.transition_type) || i.push(c(t, o, "结构化转场类型无效")), f === 0 && (t.transition_type !== "none" || t.transition_duration_ms !== 0) ? i.push(c(t, o, "第一镜不能配置转场效果")) : t.transition_type === "none" && t.transition_duration_ms !== 0 ? i.push(c(t, o, "硬切的转场时长必须为 0")) : t.transition_type !== "none" && (t.transition_duration_ms < 100 || t.transition_duration_ms > 5e3) && i.push(
      c(t, o, "转场时长必须是 100 到 5000 毫秒")
    ));
    const A = we(
      g,
      a
    );
    n.shotVideos && t.continue_previous ? (k += 1, t.continuity_anchor.trim() || i.push(c(t, o, "请填写连续性锚点")), k >= 3 && i.push(
      T(
        `shot:${t.id}:continuity-chain`,
        `镜头 ${o}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        t.id
      )
    ), Se(w, A) || i.push(
      c(
        t,
        o,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : k = 0;
    let O = !1;
    (n.voice || n.subtitles || n.lipSync) && (O = _e(
      t,
      o,
      a,
      g,
      m,
      i,
      {
        validateTimeline: n.voice,
        validateVisibleSpeakers: n.lipSync
      }
    )), n.lipSync && t.continue_previous && (b || O) && i.push(
      T(
        `shot:${t.id}:visible-dialogue-continuity`,
        `镜头 ${o}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        t.id
      )
    ), n.subtitles && ve(t, o, h, i), w = A, b = O, D = x, I = t.end_framing?.trim() || "";
  });
  for (const t of e.references) {
    const f = R(
      t.purpose,
      r.purposeSpecs || []
    )?.scope;
    (f === "material" || f === "shot") && !y.has(t.key) && i.push(
      T(
        `reference:${t.key}`,
        `参考素材“${t.label}”尚未关联到具体目标`
      )
    );
  }
  return i;
}
function he(e, r) {
  const n = /* @__PURE__ */ new Set();
  let i = !1;
  for (const a of e.shots)
    for (const s of a.speech)
      s.text.trim() && (s.kind === "narration" ? i = !0 : s.character_id && n.add(s.character_id));
  i && !e.narrator_voice.trim() && r.push(v("narrator_voice", "旁白：请选择音色"));
  for (const a of e.materials)
    n.has(a.id) && a.type === "character" && !a.voice.trim() && r.push($(a, "请选择音色"));
}
function _e(e, r, n, i, a, s, m) {
  for (const d of e.speech) {
    if ((!d.id.trim() || a.has(d.id)) && s.push(c(e, r, "语音标识缺失或重复")), a.add(d.id), d.text.trim() || s.push(c(e, r, "对白或旁白文本不能为空")), (d.start_time < 0 || d.start_time >= e.duration) && s.push(c(e, r, "语音开始时间超出镜头范围")), d.kind !== "dialogue")
      continue;
    const y = d.character_id || "";
    n.get(y)?.type !== "character" ? s.push(c(e, r, "对白没有选择有效角色")) : i.has(y) || s.push(c(e, r, "对白角色未关联到当前镜头"));
  }
  const h = oe(e);
  return m.validateVisibleSpeakers && h.size > 1 && s.push(c(e, r, "最多只能有一个出镜说话角色")), m.validateTimeline && ge(e, r, s), h.size > 0;
}
function ge(e, r, n) {
  const i = e.speech.filter((a) => a.text.trim()).map((a) => ({
    speech: a,
    start: a.start_time,
    end: a.start_time + Math.max(0.6, ye(a) / 3.5)
  })).sort((a, s) => a.start - s.start);
  for (let a = 0; a < i.length; a += 1) {
    const s = i[a];
    s.end > e.duration + 0.01 && n.push(
      j(
        `shot:${e.id}:speech:${s.speech.id}:duration`,
        `镜头 ${r} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const m = i[a + 1];
    m && s.end > m.start + 0.01 && n.push(
      j(
        `shot:${e.id}:speech:${s.speech.id}:overlap`,
        `镜头 ${r} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function ve(e, r, n, i) {
  for (const a of e.captions)
    (!a.id.trim() || n.has(a.id)) && i.push(c(e, r, "字幕标识缺失或重复")), n.add(a.id), a.text.trim() || i.push(c(e, r, "字幕文案不能为空")), (a.start_time < 0 || a.end_time <= a.start_time || a.end_time > e.duration) && i.push(c(e, r, "字幕时间范围超出镜头"));
}
function ye(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function Se(e, r) {
  if (e.size !== r.size)
    return !1;
  for (const n of e)
    if (!r.has(n))
      return !1;
  return !0;
}
function we(e, r) {
  return new Set(
    [...e].filter((n) => {
      const i = r.get(n)?.type;
      return i === "character" || i === "scene";
    })
  );
}
function Ie(e, r) {
  return r.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1,
    lipSync: !1
  } : {
    referenceImages: se(e),
    shotVideos: z(e),
    voice: G(e),
    subtitles: Y(e),
    lipSync: U(e)
  };
}
function v(e, r) {
  return { id: e, message: r, severity: "error" };
}
function $(e, r) {
  return {
    id: `material:${e.id}:${r}`,
    message: `${e.name || "未命名素材"}：${r}`,
    severity: "error",
    materialId: e.id
  };
}
function c(e, r, n) {
  return {
    id: `shot:${e.id}:${n}`,
    message: `镜头 ${r}：${n}`,
    severity: "error",
    shotId: e.id
  };
}
function T(e, r, n) {
  return { id: e, message: r, severity: "warning", shotId: n };
}
function j(e, r, n) {
  return { id: e, message: r, severity: "error", shotId: n };
}
function H(e, r, n, i, a, s) {
  const m = r.replace(/\s+/g, "").toLocaleLowerCase(), h = e.get(m);
  h ? s.push(
    T(
      `shot:${n.id}:${a}:duplicate`,
      `镜头 ${i} 的${a}与镜头 ${h} 重复，建议审查是否有新的叙事作用`,
      n.id
    )
  ) : e.set(m, i);
}
function $e({
  issues: e,
  onOpen: r
}) {
  const n = e.filter((s) => s.severity === "error"), i = e.filter((s) => s.severity === "warning"), a = [...n, ...i].slice(0, 5);
  return /* @__PURE__ */ p(
    "section",
    {
      className: `ws-storyboard-validation ${n.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ p("header", { children: [
          /* @__PURE__ */ u(Q, { size: 14 }),
          /* @__PURE__ */ u("strong", { children: n.length ? `${n.length} 项需要处理` : `${i.length} 项建议检查` }),
          e.length > a.length ? /* @__PURE__ */ p("span", { children: [
            "另有 ",
            e.length - a.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ u("div", { children: a.map((s, m) => {
          const h = !!(s.materialId || s.shotId);
          return /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: !h,
              onClick: () => h && r(s),
              children: /* @__PURE__ */ u("span", { children: s.message })
            },
            `${s.id}:${m}`
          );
        }) })
      ]
    }
  );
}
const be = [
  {
    value: "shot_images",
    title: "生成参考图",
    description: "生成素材设定和逐镜参考图，之后可自行连线继续制作。"
  },
  {
    value: "shot_videos",
    title: "生成镜头视频",
    description: "生成参考图、各镜头视频和所选附加内容，不创建最终合成。"
  },
  {
    value: "final_video",
    title: "完成视频",
    description: "生成参考图、各镜头视频和所选附加内容，并完成视频合成。"
  }
];
function ke({
  errorFeedback: e,
  storyboard: r,
  lipSyncAvailable: n,
  submitting: i,
  portalContainer: a,
  onClose: s,
  onEditIssue: m,
  onConfirm: h
}) {
  const [d, y] = X(
    () => ce(r, n)
  ), S = le(r), w = ue(r), b = r.shots.some(
    de
  ), D = P(
    () => De(d, {
      speech: S > 0,
      subtitles: w > 0,
      visibleDialogue: b
    }),
    [b, d, S, w]
  ), I = P(
    () => ({ ...r, production_plan: D }),
    [D, r]
  ), k = P(
    () => me(I),
    [I]
  ), C = k.some(
    (l) => l.severity === "error"
  ), V = P(
    () => Ce(I),
    [I]
  ), M = z(
    I
  );
  q(() => {
    const l = (o) => {
      o.key === "Escape" && !i && s();
    };
    return window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l);
  }, [s, i]);
  const t = (l, o) => {
    y((g) => ({
      ...g,
      [l]: o ? "auto" : "off"
    }));
  }, f = async () => {
    if (C) return;
    await h(D) && s();
  };
  return J(
    /* @__PURE__ */ u(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          i || s();
        },
        children: /* @__PURE__ */ p(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (l) => l.stopPropagation(),
            children: [
              e,
              /* @__PURE__ */ p("header", { children: [
                /* @__PURE__ */ p("div", { children: [
                  /* @__PURE__ */ u("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ u("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: i,
                    onClick: s,
                    children: /* @__PURE__ */ u(W, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ u("strong", { children: r.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ p("span", { children: [
                    r.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ p("span", { children: [
                    pe(r),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ p("span", { children: [
                    S,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ p("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ u("legend", { children: "产出目标" }),
                  /* @__PURE__ */ u("div", { className: "ws-storyboard-output-options", children: be.map((l) => /* @__PURE__ */ p(
                    "label",
                    {
                      className: d.output_target === l.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ u(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: l.value,
                            checked: d.output_target === l.value,
                            disabled: i,
                            onChange: () => y((o) => ({
                              ...o,
                              output_target: l.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ p("span", { children: [
                          /* @__PURE__ */ u("strong", { children: l.title }),
                          /* @__PURE__ */ u("small", { children: l.description })
                        ] }),
                        d.output_target === l.value ? /* @__PURE__ */ u(F, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    l.value
                  )) })
                ] }),
                M ? /* @__PURE__ */ p("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ u("legend", { children: "附加内容" }),
                  /* @__PURE__ */ u(
                    L,
                    {
                      title: "配音",
                      description: S > 0 ? `按脚本中的 ${S} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: S > 0 && d.voice_mode === "auto",
                      disabled: i || S === 0,
                      onChange: (l) => t("voice_mode", l)
                    }
                  ),
                  /* @__PURE__ */ u(
                    L,
                    {
                      title: "字幕",
                      description: w > 0 ? `按脚本中的 ${w} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: w > 0 && d.subtitle_mode === "auto",
                      disabled: i || w === 0,
                      onChange: (l) => t("subtitle_mode", l)
                    }
                  ),
                  /* @__PURE__ */ u(
                    L,
                    {
                      title: "口型同步",
                      description: b ? n ? "仅对出镜对白创建口型同步，默认开启。" : "当前未配置口型同步能力，保持关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: b && d.voice_mode === "auto" && d.lip_sync_mode === "auto",
                      disabled: i || !n || !b || d.voice_mode !== "auto",
                      onChange: (l) => t("lip_sync_mode", l)
                    }
                  )
                ] }) : null,
                k.length ? /* @__PURE__ */ u(
                  $e,
                  {
                    issues: k,
                    onOpen: m
                  }
                ) : null,
                /* @__PURE__ */ p("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ u("strong", { children: "制作流程" }),
                    /* @__PURE__ */ u("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ u("div", { className: "ws-storyboard-production-flow", children: V.map((l, o) => /* @__PURE__ */ p("span", { children: [
                    o > 0 ? /* @__PURE__ */ u("i", { "aria-hidden": "true", children: "/" }) : null,
                    l
                  ] }, l)) })
                ] })
              ] }),
              /* @__PURE__ */ p("footer", { children: [
                /* @__PURE__ */ u("button", { type: "button", disabled: i, onClick: s, children: "返回修改" }),
                /* @__PURE__ */ p(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: i || C,
                    onClick: () => {
                      f();
                    },
                    children: [
                      i ? /* @__PURE__ */ u(Z, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ u(F, { size: 15 }),
                      i ? "创建中" : Pe(d.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    a || document.body
  );
}
function L({
  title: e,
  description: r,
  checked: n,
  disabled: i,
  onChange: a
}) {
  return /* @__PURE__ */ p("label", { className: `ws-storyboard-production-switch${i ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ p("span", { children: [
      /* @__PURE__ */ u("strong", { children: e }),
      /* @__PURE__ */ u("small", { children: r })
    ] }),
    /* @__PURE__ */ u(
      "input",
      {
        type: "checkbox",
        checked: n,
        disabled: i,
        onChange: (s) => a(s.target.checked)
      }
    ),
    /* @__PURE__ */ u("i", { "aria-hidden": "true" })
  ] });
}
function De(e, r) {
  if (!["shot_videos", "final_video"].includes(e.output_target))
    return {
      ...e,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const n = r.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: n,
    subtitle_mode: r.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: r.visibleDialogue && n === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function Ce(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const r = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return z(e) && r.push("镜头视频"), G(e) && r.push("配音"), Y(e) && r.push("字幕"), U(e) && r.push("口型同步"), fe(e) && r.push("视频合成"), r;
}
function Pe(e) {
  return e === "shot_images" ? "创建参考图" : e === "shot_videos" ? "创建镜头视频" : "完成视频";
}
const Ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StoryboardConfirmDialog: ke
}, Symbol.toStringTag, { value: "Module" }));
export {
  $e as S,
  Ee as a,
  me as s
};
