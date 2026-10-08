import { a as p, j as l } from "./react-CDpwMNlY.js";
import { a as X, u as T, b as G } from "./file-kind-DFeonxO2.js";
import { a as J } from "./preloadable-B6OSmL0f.js";
import { I as Q, X as W, n as A, r as q } from "./vendor-icons-Cz5zFzlk.js";
import { G as Z, X as K, b6 as ee, a1 as R, M as E, a9 as te, a0 as ie, a4 as ne, az as Y, ay as U, ax as H, aw as x, av as re, $ as ae, b7 as se, f as oe, b8 as ce, c as le, e as de, aJ as ue } from "./node-detail-content-DEcv8fc7.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-confirm-dialog-BtxYkI3Q.css", import.meta.url).href]);
function pe(e, n = {}) {
  const r = Se(e, n), i = [], a = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), m = new Map(
    e.references.map((t) => [t.key, t])
  ), h = /* @__PURE__ */ new Set();
  if (n.workTypeSpecs?.length && n.purposeSpecs?.length) {
    const t = Z(
      e.references,
      e.work_type,
      n.workTypeSpecs,
      n.purposeSpecs
    );
    t && i.push(v("references", t));
  }
  e.title.trim() || i.push(v("title", "分镜标题不能为空")), e.summary.trim() || i.push(v("summary", "请补充整个脚本的内容简介")), r.referenceImages && !e.style_prompt.trim() && i.push(v("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > K) && i.push(
    v(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${K} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && i.push(
    v("target_shot_count", "目标镜头数与实际镜头数不一致")
  );
  const S = ee(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < R ? i.push(
    v(
      "target_duration",
      `目标总时长必须是不小于 ${R} 秒的整数`
    )
  ) : e.target_duration !== S && i.push(
    v("target_duration", "目标总时长与镜头时长之和不一致")
  );
  for (const t of e.materials) {
    const s = t.name.trim(), o = s.toLocaleLowerCase();
    t.id.trim() ? a.has(t.id) && i.push(y(t, `素材标识“${t.id}”重复`)) : i.push(y(t, "缺少稳定标识")), s ? c.has(o) && i.push(y(t, `素材名称“${s}”重复`)) : i.push(y(t, "名称不能为空")), r.referenceImages && !t.prompt.trim() && i.push(y(t, "生成提示词不能为空")), t.type !== "character" && t.voice.trim() && i.push(y(t, "只有角色可以配置音色"));
    for (const g of t.reference_keys) {
      const D = m.get(g);
      D ? n.purposeSpecs?.length && E(
        D.purpose,
        n.purposeSpecs || []
      )?.material_type !== t.type ? i.push(
        y(t, `参考素材“${D.label}”的用途不匹配`)
      ) : h.add(g) : i.push(
        y(t, `引用了不存在的参考素材“${g}”`)
      );
    }
    c.add(o), a.set(t.id, t);
  }
  if (r.voice && fe(e, i), !e.shots.length)
    return i.push(v("shots", "分镜至少需要一个镜头")), i;
  let w = /* @__PURE__ */ new Set(), I = !1, b = "", $ = "", k = 0;
  const P = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
  e.shots.forEach((t, s) => {
    const o = s + 1;
    (!t.id.trim() || P.has(t.id)) && i.push(d(t, o, "镜头标识缺失或重复")), P.add(t.id), te(t.duration) || i.push(
      d(
        t,
        o,
        `时长必须是不小于 ${R} 秒的整数`
      )
    ), t.beat.trim() ? F(
      M,
      t.beat,
      t,
      o,
      "本镜变化",
      i
    ) : i.push(d(t, o, "请填写本镜变化")), s === 0 && t.transition.trim() ? i.push(d(t, o, "第一镜不能填写上镜承接关系")) : s > 0 && !t.transition.trim() && i.push(d(t, o, "请说明与上一镜头的承接关系")), t.description.trim() ? F(
      C,
      t.description,
      t,
      o,
      "镜头描述",
      i
    ) : i.push(d(t, o, "镜头描述不能为空")), r.shotVideos && !t.video_prompt.trim() && i.push(d(t, o, "视频提示词不能为空"));
    for (const _ of t.reference_keys) {
      const N = m.get(_);
      N ? n.purposeSpecs?.length && E(
        N.purpose,
        n.purposeSpecs || []
      )?.scope !== "shot" ? i.push(
        d(
          t,
          o,
          `参考素材“${N.label}”的用途不匹配`
        )
      ) : h.add(_) : i.push(
        d(
          t,
          o,
          `引用了不存在的参考素材“${_}”`
        )
      );
    }
    const g = /* @__PURE__ */ new Set();
    for (const _ of t.material_ids)
      a.has(_) ? g.has(_) && i.push(d(t, o, `重复引用素材“${_}”`)) : i.push(
        d(t, o, `引用了不存在的素材“${_}”`)
      ), g.add(_);
    s === 0 && t.continue_previous && i.push(d(t, o, "第一个镜头不能承接上一镜头")), s === 0 && t.match_previous && i.push(d(t, o, "第一个镜头不能匹配上一镜头")), t.match_previous && t.continue_previous && i.push(
      d(t, o, "不能同时匹配上一镜画面和延续上一镜视频")
    );
    const D = t.continuity_state?.entry.trim() || "", z = t.continuity_state?.exit.trim() || "";
    if (r.referenceImages) {
      D || i.push(d(t, o, "请填写入镜状态"));
      const _ = t.start_framing?.trim() || "";
      t.continue_previous && _ && $ && _ !== $ && i.push(
        d(
          t,
          o,
          "动作续接时，起始构图必须与上一镜头的结束构图完全一致"
        )
      ), z || i.push(d(t, o, "请填写出镜状态")), ie(t, s) && D !== b && i.push(
        d(
          t,
          o,
          "入镜状态必须与上一镜头的出镜状态完全一致"
        )
      );
    }
    r.shotVideos && (ne.includes(t.transition_type) || i.push(d(t, o, "结构化转场类型无效")), s === 0 && (t.transition_type !== "none" || t.transition_duration_ms !== 0) ? i.push(d(t, o, "第一镜不能配置转场效果")) : t.transition_type === "none" && t.transition_duration_ms !== 0 ? i.push(d(t, o, "硬切的转场时长必须为 0")) : t.transition_type !== "none" && (t.transition_duration_ms < 100 || t.transition_duration_ms > 5e3) && i.push(
      d(t, o, "转场时长必须是 100 到 5000 毫秒")
    ));
    const B = ye(
      g,
      a
    );
    r.shotVideos && t.continue_previous ? (k += 1, t.continuity_anchor.trim() || i.push(d(t, o, "请填写连续性锚点")), k >= 3 && i.push(
      V(
        `shot:${t.id}:continuity-chain`,
        `镜头 ${o}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        t.id
      )
    ), ve(w, B) || i.push(
      d(
        t,
        o,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : k = 0;
    let O = !1;
    (r.voice || r.subtitles || r.lipSync) && (O = me(
      t,
      o,
      a,
      g,
      f,
      i,
      {
        validateTimeline: r.voice,
        validateVisibleSpeakers: r.lipSync
      }
    )), r.lipSync && t.continue_previous && (I || O) && i.push(
      V(
        `shot:${t.id}:visible-dialogue-continuity`,
        `镜头 ${o}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        t.id
      )
    ), r.subtitles && _e(t, o, u, i), w = B, I = O, b = z, $ = t.end_framing?.trim() || "";
  });
  for (const t of e.references) {
    const s = E(
      t.purpose,
      n.purposeSpecs || []
    )?.scope;
    (s === "material" || s === "shot") && !h.has(t.key) && i.push(
      V(
        `reference:${t.key}`,
        `参考素材“${t.label}”尚未关联到具体目标`
      )
    );
  }
  return i;
}
function fe(e, n) {
  const r = /* @__PURE__ */ new Set();
  let i = !1;
  for (const a of e.shots)
    for (const c of a.speech)
      c.text.trim() && (c.kind === "narration" ? i = !0 : c.character_id && r.add(c.character_id));
  i && !e.narrator_voice.trim() && n.push(v("narrator_voice", "旁白：请选择音色"));
  for (const a of e.materials)
    r.has(a.id) && a.type === "character" && !a.voice.trim() && n.push(y(a, "请选择音色"));
}
function me(e, n, r, i, a, c, f) {
  for (const m of e.speech) {
    if ((!m.id.trim() || a.has(m.id)) && c.push(d(e, n, "语音标识缺失或重复")), a.add(m.id), m.text.trim() || c.push(d(e, n, "对白或旁白文本不能为空")), (m.start_time < 0 || m.start_time >= e.duration) && c.push(d(e, n, "语音开始时间超出镜头范围")), m.kind !== "dialogue")
      continue;
    const h = m.character_id || "";
    r.get(h)?.type !== "character" ? c.push(d(e, n, "对白没有选择有效角色")) : i.has(h) || c.push(d(e, n, "对白角色未关联到当前镜头"));
  }
  const u = ae(e);
  return f.validateVisibleSpeakers && u.size > 1 && c.push(d(e, n, "最多只能有一个出镜说话角色")), f.validateTimeline && he(e, n, c), u.size > 0;
}
function he(e, n, r) {
  const i = e.speech.filter((a) => a.text.trim()).map((a) => ({
    speech: a,
    start: a.start_time,
    end: a.start_time + Math.max(0.6, ge(a) / 3.5)
  })).sort((a, c) => a.start - c.start);
  for (let a = 0; a < i.length; a += 1) {
    const c = i[a];
    c.end > e.duration + 0.01 && r.push(
      j(
        `shot:${e.id}:speech:${c.speech.id}:duration`,
        `镜头 ${n} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const f = i[a + 1];
    f && c.end > f.start + 0.01 && r.push(
      j(
        `shot:${e.id}:speech:${c.speech.id}:overlap`,
        `镜头 ${n} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function _e(e, n, r, i) {
  for (const a of e.captions)
    (!a.id.trim() || r.has(a.id)) && i.push(d(e, n, "字幕标识缺失或重复")), r.add(a.id), a.text.trim() || i.push(d(e, n, "字幕文案不能为空")), (a.start_time < 0 || a.end_time <= a.start_time || a.end_time > e.duration) && i.push(d(e, n, "字幕时间范围超出镜头"));
}
function ge(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function ve(e, n) {
  if (e.size !== n.size)
    return !1;
  for (const r of e)
    if (!n.has(r))
      return !1;
  return !0;
}
function ye(e, n) {
  return new Set(
    [...e].filter((r) => {
      const i = n.get(r)?.type;
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
    shotVideos: x(e),
    voice: H(e),
    subtitles: U(e),
    lipSync: Y(e)
  };
}
function v(e, n) {
  return { id: e, message: n, severity: "error" };
}
function y(e, n) {
  return {
    id: `material:${e.id}:${n}`,
    message: `${e.name || "未命名素材"}：${n}`,
    severity: "error",
    materialId: e.id
  };
}
function d(e, n, r) {
  return {
    id: `shot:${e.id}:${r}`,
    message: `镜头 ${n}：${r}`,
    severity: "error",
    shotId: e.id
  };
}
function V(e, n, r) {
  return { id: e, message: n, severity: "warning", shotId: r };
}
function j(e, n, r) {
  return { id: e, message: n, severity: "error", shotId: r };
}
function F(e, n, r, i, a, c) {
  const f = n.replace(/\s+/g, "").toLocaleLowerCase(), u = e.get(f);
  u ? c.push(
    V(
      `shot:${r.id}:${a}:duplicate`,
      `镜头 ${i} 的${a}与镜头 ${u} 重复，建议审查是否有新的叙事作用`,
      r.id
    )
  ) : e.set(f, i);
}
function we({
  issues: e,
  onOpen: n
}) {
  const r = e.filter((c) => c.severity === "error"), i = e.filter((c) => c.severity === "warning"), a = [...r, ...i].slice(0, 5);
  return /* @__PURE__ */ p(
    "section",
    {
      className: `ws-storyboard-validation ${r.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ p("header", { children: [
          /* @__PURE__ */ l(Q, { size: 14 }),
          /* @__PURE__ */ l("strong", { children: r.length ? `${r.length} 项需要处理` : `${i.length} 项建议检查` }),
          e.length > a.length ? /* @__PURE__ */ p("span", { children: [
            "另有 ",
            e.length - a.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ l("div", { children: a.map((c, f) => {
          const u = !!(c.materialId || c.shotId);
          return /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              disabled: !u,
              onClick: () => u && n(c),
              children: /* @__PURE__ */ l("span", { children: c.message })
            },
            `${c.id}:${f}`
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
  storyboard: e,
  lipSyncAvailable: n,
  submitting: r,
  portalContainer: i,
  onClose: a,
  onEditIssue: c,
  onConfirm: f
}) {
  const [u, m] = X(
    () => se(e, n)
  ), h = oe(e), S = ce(e), w = e.shots.some(
    le
  ), I = T(
    () => Ie(u, {
      speech: h > 0,
      subtitles: S > 0,
      visibleDialogue: w
    }),
    [w, u, h, S]
  ), b = T(
    () => ({ ...e, production_plan: I }),
    [I, e]
  ), $ = T(
    () => pe(b),
    [b]
  ), k = $.some(
    (s) => s.severity === "error"
  ), P = T(
    () => ke(b),
    [b]
  ), M = x(
    b
  );
  G(() => {
    const s = (o) => {
      o.key === "Escape" && !r && a();
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [a, r]);
  const C = (s, o) => {
    m((g) => ({
      ...g,
      [s]: o ? "auto" : "off"
    }));
  }, t = async () => {
    if (k) return;
    await f(I) && a();
  };
  return J(
    /* @__PURE__ */ l(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          r || a();
        },
        children: /* @__PURE__ */ p(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (s) => s.stopPropagation(),
            children: [
              /* @__PURE__ */ p("header", { children: [
                /* @__PURE__ */ p("div", { children: [
                  /* @__PURE__ */ l("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ l("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: r,
                    onClick: a,
                    children: /* @__PURE__ */ l(W, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ l("strong", { children: e.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ p("span", { children: [
                    e.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ p("span", { children: [
                    de(e),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ p("span", { children: [
                    h,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ p("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ l("legend", { children: "产出目标" }),
                  /* @__PURE__ */ l("div", { className: "ws-storyboard-output-options", children: be.map((s) => /* @__PURE__ */ p(
                    "label",
                    {
                      className: u.output_target === s.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ l(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: s.value,
                            checked: u.output_target === s.value,
                            disabled: r,
                            onChange: () => m((o) => ({
                              ...o,
                              output_target: s.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ p("span", { children: [
                          /* @__PURE__ */ l("strong", { children: s.title }),
                          /* @__PURE__ */ l("small", { children: s.description })
                        ] }),
                        u.output_target === s.value ? /* @__PURE__ */ l(A, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    s.value
                  )) })
                ] }),
                M ? /* @__PURE__ */ p("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ l("legend", { children: "附加内容" }),
                  /* @__PURE__ */ l(
                    L,
                    {
                      title: "配音",
                      description: h > 0 ? `按脚本中的 ${h} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: h > 0 && u.voice_mode === "auto",
                      disabled: r || h === 0,
                      onChange: (s) => C("voice_mode", s)
                    }
                  ),
                  /* @__PURE__ */ l(
                    L,
                    {
                      title: "字幕",
                      description: S > 0 ? `按脚本中的 ${S} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: S > 0 && u.subtitle_mode === "auto",
                      disabled: r || S === 0,
                      onChange: (s) => C("subtitle_mode", s)
                    }
                  ),
                  /* @__PURE__ */ l(
                    L,
                    {
                      title: "口型同步",
                      description: w ? n ? "仅对出镜对白创建口型同步，默认开启。" : "当前未配置口型同步能力，保持关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: w && u.voice_mode === "auto" && u.lip_sync_mode === "auto",
                      disabled: r || !n || !w || u.voice_mode !== "auto",
                      onChange: (s) => C("lip_sync_mode", s)
                    }
                  )
                ] }) : null,
                $.length ? /* @__PURE__ */ l(
                  we,
                  {
                    issues: $,
                    onOpen: c
                  }
                ) : null,
                /* @__PURE__ */ p("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ p("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ l("strong", { children: "制作流程" }),
                    /* @__PURE__ */ l("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ l("div", { className: "ws-storyboard-production-flow", children: P.map((s, o) => /* @__PURE__ */ p("span", { children: [
                    o > 0 ? /* @__PURE__ */ l("i", { "aria-hidden": "true", children: "/" }) : null,
                    s
                  ] }, s)) })
                ] })
              ] }),
              /* @__PURE__ */ p("footer", { children: [
                /* @__PURE__ */ l("button", { type: "button", disabled: r, onClick: a, children: "返回修改" }),
                /* @__PURE__ */ p(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: r || k,
                    onClick: () => {
                      t();
                    },
                    children: [
                      r ? /* @__PURE__ */ l(q, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ l(A, { size: 15 }),
                      r ? "创建中" : De(u.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    i || document.body
  );
}
function L({
  title: e,
  description: n,
  checked: r,
  disabled: i,
  onChange: a
}) {
  return /* @__PURE__ */ p("label", { className: `ws-storyboard-production-switch${i ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ p("span", { children: [
      /* @__PURE__ */ l("strong", { children: e }),
      /* @__PURE__ */ l("small", { children: n })
    ] }),
    /* @__PURE__ */ l(
      "input",
      {
        type: "checkbox",
        checked: r,
        disabled: i,
        onChange: (c) => a(c.target.checked)
      }
    ),
    /* @__PURE__ */ l("i", { "aria-hidden": "true" })
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
  const r = n.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: r,
    subtitle_mode: n.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: n.visibleDialogue && r === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function ke(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const n = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return x(e) && n.push("镜头视频"), H(e) && n.push("配音"), U(e) && n.push("字幕"), Y(e) && n.push("口型同步"), ue(e) && n.push("视频合成"), n;
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
