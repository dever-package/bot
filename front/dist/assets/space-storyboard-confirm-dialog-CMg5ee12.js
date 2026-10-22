import { a as u, j as c } from "./react-D9GkiX5b.js";
import { a as G, u as P, d as X } from "./file-kind-D6bMOzYN.js";
import { c as q } from "./preloadable-CT3tMmBD.js";
import { y as Q, X as W, n as A, r as J } from "./vendor-icons-fVDtJt66.js";
import { Q as Z, ar as j, aw as ee, af as E, aa as R, ax as te, ae as ie, aj as ne, ay as H, az as U, aA as Y, aB as z, aC as re, aD as ae, aE as se, aF as oe, aG as ce, aH as le, aq as de, aI as ue } from "./asset-preview-qznc7rjG.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-confirm-dialog-Dmpdwwvy.css", import.meta.url).href]);
function pe(e, n = {}) {
  const a = Se(e, n), i = [], s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), d = new Map(
    e.references.map((t) => [t.key, t])
  ), v = /* @__PURE__ */ new Set();
  if (n.workTypeSpecs?.length && n.purposeSpecs?.length) {
    const t = Z(
      e.references,
      e.work_type,
      n.workTypeSpecs,
      n.purposeSpecs
    );
    t && i.push(g("references", t));
  }
  e.title.trim() || i.push(g("title", "分镜标题不能为空")), e.summary.trim() || i.push(g("summary", "请补充整个脚本的内容简介")), a.referenceImages && !e.style_prompt.trim() && i.push(g("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > j) && i.push(
    g(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${j} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && i.push(
    g("target_shot_count", "目标镜头数与实际镜头数不一致")
  );
  const y = ee(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < E ? i.push(
    g(
      "target_duration",
      `目标总时长必须是不小于 ${E} 秒的整数`
    )
  ) : e.target_duration !== y && i.push(
    g("target_duration", "目标总时长与镜头时长之和不一致")
  );
  for (const t of e.materials) {
    const p = t.name.trim(), r = p.toLocaleLowerCase();
    t.id.trim() ? s.has(t.id) && i.push(b(t, `素材标识“${t.id}”重复`)) : i.push(b(t, "缺少稳定标识")), p ? o.has(r) && i.push(b(t, `素材名称“${p}”重复`)) : i.push(b(t, "名称不能为空")), a.referenceImages && !t.prompt.trim() && i.push(b(t, "生成提示词不能为空")), t.type !== "character" && t.voice.trim() && i.push(b(t, "只有角色可以配置音色"));
    for (const f of t.reference_keys) {
      const I = d.get(f);
      I ? n.purposeSpecs?.length && R(
        I.purpose,
        n.purposeSpecs || []
      )?.material_type !== t.type ? i.push(
        b(t, `参考素材“${I.label}”的用途不匹配`)
      ) : v.add(f) : i.push(
        b(t, `引用了不存在的参考素材“${f}”`)
      );
    }
    o.add(r), s.set(t.id, t);
  }
  if (a.voice && fe(e, i), !e.shots.length)
    return i.push(g("shots", "分镜至少需要一个镜头")), i;
  let S = /* @__PURE__ */ new Set(), $ = !1, D = "", w = "", k = 0;
  const C = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
  e.shots.forEach((t, p) => {
    const r = p + 1;
    (!t.id.trim() || C.has(t.id)) && i.push(l(t, r, "镜头标识缺失或重复")), C.add(t.id), te(t.duration) || i.push(
      l(
        t,
        r,
        `时长必须是不小于 ${E} 秒的整数`
      )
    ), t.beat.trim() ? K(
      V,
      t.beat,
      t,
      r,
      "本镜变化",
      i
    ) : i.push(l(t, r, "请填写本镜变化")), p === 0 && t.transition.trim() ? i.push(l(t, r, "第一镜不能填写上镜承接关系")) : p > 0 && !t.transition.trim() && i.push(l(t, r, "请说明与上一镜头的承接关系")), t.description.trim() ? K(
      M,
      t.description,
      t,
      r,
      "镜头描述",
      i
    ) : i.push(l(t, r, "镜头描述不能为空")), a.shotVideos && !t.video_prompt.trim() && i.push(l(t, r, "视频提示词不能为空"));
    for (const _ of t.reference_keys) {
      const N = d.get(_);
      N ? n.purposeSpecs?.length && R(
        N.purpose,
        n.purposeSpecs || []
      )?.scope !== "shot" ? i.push(
        l(
          t,
          r,
          `参考素材“${N.label}”的用途不匹配`
        )
      ) : v.add(_) : i.push(
        l(
          t,
          r,
          `引用了不存在的参考素材“${_}”`
        )
      );
    }
    const f = /* @__PURE__ */ new Set();
    for (const _ of t.material_ids)
      s.has(_) ? f.has(_) && i.push(l(t, r, `重复引用素材“${_}”`)) : i.push(
        l(t, r, `引用了不存在的素材“${_}”`)
      ), f.add(_);
    p === 0 && t.continue_previous && i.push(l(t, r, "第一个镜头不能承接上一镜头")), p === 0 && t.match_previous && i.push(l(t, r, "第一个镜头不能匹配上一镜头")), t.match_previous && t.continue_previous && i.push(
      l(t, r, "不能同时匹配上一镜画面和延续上一镜视频")
    );
    const I = t.continuity_state?.entry.trim() || "", x = t.continuity_state?.exit.trim() || "";
    if (a.referenceImages) {
      I || i.push(l(t, r, "请填写入镜状态"));
      const _ = t.start_framing?.trim() || "";
      t.continue_previous && _ && w && _ !== w && i.push(
        l(
          t,
          r,
          "动作续接时，起始构图必须与上一镜头的结束构图完全一致"
        )
      ), x || i.push(l(t, r, "请填写出镜状态")), ie(t, p) && I !== D && i.push(
        l(
          t,
          r,
          "入镜状态必须与上一镜头的出镜状态完全一致"
        )
      );
    }
    a.shotVideos && (ne.includes(t.transition_type) || i.push(l(t, r, "结构化转场类型无效")), p === 0 && (t.transition_type !== "none" || t.transition_duration_ms !== 0) ? i.push(l(t, r, "第一镜不能配置转场效果")) : t.transition_type === "none" && t.transition_duration_ms !== 0 ? i.push(l(t, r, "硬切的转场时长必须为 0")) : t.transition_type !== "none" && (t.transition_duration_ms < 100 || t.transition_duration_ms > 5e3) && i.push(
      l(t, r, "转场时长必须是 100 到 5000 毫秒")
    ));
    const B = ye(
      f,
      s
    );
    a.shotVideos && t.continue_previous ? (k += 1, t.continuity_anchor.trim() || i.push(l(t, r, "请填写连续性锚点")), k >= 3 && i.push(
      T(
        `shot:${t.id}:continuity-chain`,
        `镜头 ${r}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        t.id
      )
    ), ve(S, B) || i.push(
      l(
        t,
        r,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : k = 0;
    let O = !1;
    (a.voice || a.subtitles || a.lipSync) && (O = me(
      t,
      r,
      s,
      f,
      m,
      i,
      {
        validateTimeline: a.voice,
        validateVisibleSpeakers: a.lipSync
      }
    )), a.lipSync && t.continue_previous && ($ || O) && i.push(
      T(
        `shot:${t.id}:visible-dialogue-continuity`,
        `镜头 ${r}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        t.id
      )
    ), a.subtitles && _e(t, r, h, i), S = B, $ = O, D = x, w = t.end_framing?.trim() || "";
  });
  for (const t of e.references) {
    const p = R(
      t.purpose,
      n.purposeSpecs || []
    )?.scope;
    (p === "material" || p === "shot") && !v.has(t.key) && i.push(
      T(
        `reference:${t.key}`,
        `参考素材“${t.label}”尚未关联到具体目标`
      )
    );
  }
  return i;
}
function fe(e, n) {
  const a = /* @__PURE__ */ new Set();
  let i = !1;
  for (const s of e.shots)
    for (const o of s.speech)
      o.text.trim() && (o.kind === "narration" ? i = !0 : o.character_id && a.add(o.character_id));
  i && !e.narrator_voice.trim() && n.push(g("narrator_voice", "旁白：请选择音色"));
  for (const s of e.materials)
    a.has(s.id) && s.type === "character" && !s.voice.trim() && n.push(b(s, "请选择音色"));
}
function me(e, n, a, i, s, o, m) {
  for (const d of e.speech) {
    if ((!d.id.trim() || s.has(d.id)) && o.push(l(e, n, "语音标识缺失或重复")), s.add(d.id), d.text.trim() || o.push(l(e, n, "对白或旁白文本不能为空")), (d.start_time < 0 || d.start_time >= e.duration) && o.push(l(e, n, "语音开始时间超出镜头范围")), d.kind !== "dialogue")
      continue;
    const v = d.character_id || "";
    a.get(v)?.type !== "character" ? o.push(l(e, n, "对白没有选择有效角色")) : i.has(v) || o.push(l(e, n, "对白角色未关联到当前镜头"));
  }
  const h = ae(e);
  return m.validateVisibleSpeakers && h.size > 1 && o.push(l(e, n, "最多只能有一个出镜说话角色")), m.validateTimeline && he(e, n, o), h.size > 0;
}
function he(e, n, a) {
  const i = e.speech.filter((s) => s.text.trim()).map((s) => ({
    speech: s,
    start: s.start_time,
    end: s.start_time + Math.max(0.6, ge(s) / 3.5)
  })).sort((s, o) => s.start - o.start);
  for (let s = 0; s < i.length; s += 1) {
    const o = i[s];
    o.end > e.duration + 0.01 && a.push(
      F(
        `shot:${e.id}:speech:${o.speech.id}:duration`,
        `镜头 ${n} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const m = i[s + 1];
    m && o.end > m.start + 0.01 && a.push(
      F(
        `shot:${e.id}:speech:${o.speech.id}:overlap`,
        `镜头 ${n} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function _e(e, n, a, i) {
  for (const s of e.captions)
    (!s.id.trim() || a.has(s.id)) && i.push(l(e, n, "字幕标识缺失或重复")), a.add(s.id), s.text.trim() || i.push(l(e, n, "字幕文案不能为空")), (s.start_time < 0 || s.end_time <= s.start_time || s.end_time > e.duration) && i.push(l(e, n, "字幕时间范围超出镜头"));
}
function ge(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function ve(e, n) {
  if (e.size !== n.size)
    return !1;
  for (const a of e)
    if (!n.has(a))
      return !1;
  return !0;
}
function ye(e, n) {
  return new Set(
    [...e].filter((a) => {
      const i = n.get(a)?.type;
      return i === "character" || i === "scene";
    })
  );
}
function Se(e, n) {
  return n.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1,
    lipSync: !1
  } : {
    referenceImages: re(e),
    shotVideos: z(e),
    voice: Y(e),
    subtitles: U(e),
    lipSync: H(e)
  };
}
function g(e, n) {
  return { id: e, message: n, severity: "error" };
}
function b(e, n) {
  return {
    id: `material:${e.id}:${n}`,
    message: `${e.name || "未命名素材"}：${n}`,
    severity: "error",
    materialId: e.id
  };
}
function l(e, n, a) {
  return {
    id: `shot:${e.id}:${a}`,
    message: `镜头 ${n}：${a}`,
    severity: "error",
    shotId: e.id
  };
}
function T(e, n, a) {
  return { id: e, message: n, severity: "warning", shotId: a };
}
function F(e, n, a) {
  return { id: e, message: n, severity: "error", shotId: a };
}
function K(e, n, a, i, s, o) {
  const m = n.replace(/\s+/g, "").toLocaleLowerCase(), h = e.get(m);
  h ? o.push(
    T(
      `shot:${a.id}:${s}:duplicate`,
      `镜头 ${i} 的${s}与镜头 ${h} 重复，建议审查是否有新的叙事作用`,
      a.id
    )
  ) : e.set(m, i);
}
function we({
  issues: e,
  onOpen: n
}) {
  const a = e.filter((o) => o.severity === "error"), i = e.filter((o) => o.severity === "warning"), s = [...a, ...i].slice(0, 5);
  return /* @__PURE__ */ u(
    "section",
    {
      className: `ws-storyboard-validation ${a.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ c(Q, { size: 14 }),
          /* @__PURE__ */ c("strong", { children: a.length ? `${a.length} 项需要处理` : `${i.length} 项建议检查` }),
          e.length > s.length ? /* @__PURE__ */ u("span", { children: [
            "另有 ",
            e.length - s.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ c("div", { children: s.map((o, m) => {
          const h = !!(o.materialId || o.shotId);
          return /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              disabled: !h,
              onClick: () => h && n(o),
              children: /* @__PURE__ */ c("span", { children: o.message })
            },
            `${o.id}:${m}`
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
function $e({
  errorFeedback: e,
  storyboard: n,
  lipSyncAvailable: a,
  submitting: i,
  portalContainer: s,
  onClose: o,
  onEditIssue: m,
  onConfirm: h
}) {
  const [d, v] = G(
    () => se(n, a)
  ), y = oe(n), S = ce(n), $ = n.shots.some(
    le
  ), D = P(
    () => Ie(d, {
      speech: y > 0,
      subtitles: S > 0,
      visibleDialogue: $
    }),
    [$, d, y, S]
  ), w = P(
    () => ({ ...n, production_plan: D }),
    [D, n]
  ), k = P(
    () => pe(w),
    [w]
  ), C = k.some(
    (r) => r.severity === "error"
  ), V = P(
    () => ke(w),
    [w]
  ), M = z(
    w
  );
  X(() => {
    const r = (f) => {
      f.key === "Escape" && !i && o();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [o, i]);
  const t = (r, f) => {
    v((I) => ({
      ...I,
      [r]: f ? "auto" : "off"
    }));
  }, p = async () => {
    if (C) return;
    await h(D) && o();
  };
  return q(
    /* @__PURE__ */ c(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          i || o();
        },
        children: /* @__PURE__ */ u(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (r) => r.stopPropagation(),
            children: [
              e,
              /* @__PURE__ */ u("header", { children: [
                /* @__PURE__ */ u("div", { children: [
                  /* @__PURE__ */ c("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ c("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: i,
                    onClick: o,
                    children: /* @__PURE__ */ c(W, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ u("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ c("strong", { children: n.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ u("span", { children: [
                    n.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ u("span", { children: [
                    de(n),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ u("span", { children: [
                    y,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ u("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ c("legend", { children: "产出目标" }),
                  /* @__PURE__ */ c("div", { className: "ws-storyboard-output-options", children: be.map((r) => /* @__PURE__ */ u(
                    "label",
                    {
                      className: d.output_target === r.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ c(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: r.value,
                            checked: d.output_target === r.value,
                            disabled: i,
                            onChange: () => v((f) => ({
                              ...f,
                              output_target: r.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ u("span", { children: [
                          /* @__PURE__ */ c("strong", { children: r.title }),
                          /* @__PURE__ */ c("small", { children: r.description })
                        ] }),
                        d.output_target === r.value ? /* @__PURE__ */ c(A, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    r.value
                  )) })
                ] }),
                M ? /* @__PURE__ */ u("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ c("legend", { children: "附加内容" }),
                  /* @__PURE__ */ c(
                    L,
                    {
                      title: "配音",
                      description: y > 0 ? `按脚本中的 ${y} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: y > 0 && d.voice_mode === "auto",
                      disabled: i || y === 0,
                      onChange: (r) => t("voice_mode", r)
                    }
                  ),
                  /* @__PURE__ */ c(
                    L,
                    {
                      title: "字幕",
                      description: S > 0 ? `按脚本中的 ${S} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: S > 0 && d.subtitle_mode === "auto",
                      disabled: i || S === 0,
                      onChange: (r) => t("subtitle_mode", r)
                    }
                  ),
                  /* @__PURE__ */ c(
                    L,
                    {
                      title: "口型同步",
                      description: $ ? a ? "仅对出镜对白创建口型同步，默认开启。" : "当前未配置口型同步能力，保持关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: $ && d.voice_mode === "auto" && d.lip_sync_mode === "auto",
                      disabled: i || !a || !$ || d.voice_mode !== "auto",
                      onChange: (r) => t("lip_sync_mode", r)
                    }
                  )
                ] }) : null,
                k.length ? /* @__PURE__ */ c(
                  we,
                  {
                    issues: k,
                    onOpen: m
                  }
                ) : null,
                /* @__PURE__ */ u("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ u("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ c("strong", { children: "制作流程" }),
                    /* @__PURE__ */ c("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "ws-storyboard-production-flow", children: V.map((r, f) => /* @__PURE__ */ u("span", { children: [
                    f > 0 ? /* @__PURE__ */ c("i", { "aria-hidden": "true", children: "/" }) : null,
                    r
                  ] }, r)) })
                ] })
              ] }),
              /* @__PURE__ */ u("footer", { children: [
                /* @__PURE__ */ c("button", { type: "button", disabled: i, onClick: o, children: "返回修改" }),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: i || C,
                    onClick: () => {
                      p();
                    },
                    children: [
                      i ? /* @__PURE__ */ c(J, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ c(A, { size: 15 }),
                      i ? "创建中" : De(d.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    s || document.body
  );
}
function L({
  title: e,
  description: n,
  checked: a,
  disabled: i,
  onChange: s
}) {
  return /* @__PURE__ */ u("label", { className: `ws-storyboard-production-switch${i ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ u("span", { children: [
      /* @__PURE__ */ c("strong", { children: e }),
      /* @__PURE__ */ c("small", { children: n })
    ] }),
    /* @__PURE__ */ c(
      "input",
      {
        type: "checkbox",
        checked: a,
        disabled: i,
        onChange: (o) => s(o.target.checked)
      }
    ),
    /* @__PURE__ */ c("i", { "aria-hidden": "true" })
  ] });
}
function Ie(e, n) {
  if (!["shot_videos", "final_video"].includes(e.output_target))
    return {
      ...e,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const a = n.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: a,
    subtitle_mode: n.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: n.visibleDialogue && a === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function ke(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const n = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return z(e) && n.push("镜头视频"), Y(e) && n.push("配音"), U(e) && n.push("字幕"), H(e) && n.push("口型同步"), ue(e) && n.push("视频合成"), n;
}
function De(e) {
  return e === "shot_images" ? "创建参考图" : e === "shot_videos" ? "创建镜头视频" : "完成视频";
}
const Oe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StoryboardConfirmDialog: $e
}, Symbol.toStringTag, { value: "Module" }));
export {
  we as S,
  Oe as a,
  pe as s
};
