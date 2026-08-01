import { j as e, a as r, F as _e } from "./createLucideIcon-CEtb6KSk.js";
import { u as P, b as X, c as me, a as q, h as zt } from "./runtime-entry-CIrzyMsA.js";
import { c as Be } from "./react-dom-C2oimP4o.js";
import { L as fe } from "./loader-circle-QnfinZ3F.js";
import { S as Et } from "./sparkles-BKIkAh44.js";
import { A as Xe } from "./arrow-down-DYgL1-UY.js";
import { u as it, C as Pt, o as He, s as De, m as xt, A as Ke, r as Bt, a as Lt } from "./space-DNu08Ce2.js";
import { B as ye } from "./user-round-uRCY5ob-.js";
import { C as ie } from "./check-CgzWfIok.js";
import { C as At } from "./copy-B2Ci6O8V.js";
import { a as Ft, M as Yt } from "./space-storyboard-shot-card-CdcCQX_F.js";
import { P as st } from "./pencil-tXNtQW8N.js";
import { P as ge } from "./plus-Di9i7LEg.js";
import { T as Ee } from "./trash-2-EsqTj1ob.js";
import { X as Le } from "./x-D8YQA7_X.js";
import { m as Vt } from "./confirm-dialog-DEEg8Sz8.js";
import { w as ae, b as H, g as ot, F as lt, t as qt, G as ct, f as dt, H as Ut, I as Wt, J as Xt, K as Ht, L as Kt, M as G, N as ut, O as ht, P as pt, e as jt, S as Gt, i as Jt, Q as je, R as Qt, T as Zt, U as Ge, W as en, X as Pe, Y as tn, Z as nn, _ as rn, $ as an, a0 as Je, a1 as sn, a2 as Qe, a3 as on } from "./upload-asset-api-DAbIOMVJ.js";
import { C as ln } from "./circle-alert-QPWZCk4j.js";
import { L as cn } from "./link-2-D3KtV2w-.js";
function dn({
  material: t,
  creating: n = !1,
  readonly: l,
  usage: a,
  existingNames: c = [],
  portalContainer: p,
  onSave: v,
  onRemove: m,
  onClose: C
}) {
  const [u, g] = P(t.name), [O, F] = P(t.prompt), [x, I] = P(t.voice), [s, k] = P(!1), y = u.trim().replace(/^[@#]+/, ""), M = O.trim(), R = c.some(
    (T) => T.trim().toLocaleLowerCase() === y.toLocaleLowerCase()
  ), D = (a?.shotIds.length || 0) + (a?.speechIds.length || 0), E = !n && !l && !!m && D === 0, Y = ae[t.type];
  X(() => {
    function T(i) {
      i.key === "Escape" && (i.preventDefault(), C());
    }
    return window.addEventListener("keydown", T), () => window.removeEventListener("keydown", T);
  }, [C]);
  const B = /* @__PURE__ */ e(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: C,
      children: /* @__PURE__ */ r(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${n ? "新增" : l ? "查看" : "编辑"}${Y}素材 ${t.name}`,
          onMouseDown: (T) => T.stopPropagation(),
          children: [
            /* @__PURE__ */ r("header", { children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("strong", { children: n ? `新增${Y}` : t.name || Y }),
                /* @__PURE__ */ r("span", { children: [
                  Y,
                  "素材",
                  l ? " · 当前版本只读" : n ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ e(H, { label: "关闭", children: /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: C, children: /* @__PURE__ */ e(Le, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ r("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("span", { children: "素材名称" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: u,
                    readOnly: l,
                    autoFocus: !l,
                    placeholder: `例如：${t.type === "character" ? "主角" : t.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (T) => g(T.target.value)
                  }
                ),
                R ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("span", { children: "生成提示词" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: O,
                    readOnly: l,
                    placeholder: `描述${y || Y}的外观、结构、材质与风格`,
                    onChange: (T) => F(T.target.value)
                  }
                )
              ] }),
              t.type === "character" ? /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: x,
                    readOnly: l,
                    placeholder: "留空使用语音能力默认音色",
                    onChange: (T) => I(T.target.value)
                  }
                ),
                /* @__PURE__ */ e("small", { children: "填写语音能力实际接受的音色值，不绑定具体供应商。" })
              ] }) : null,
              !n && D > 0 ? /* @__PURE__ */ r("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ r("span", { children: [
                  a?.shotIds.length || 0,
                  " 个镜头",
                  a?.speechIds.length ? ` · ${a.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ e("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ r("footer", { children: [
              /* @__PURE__ */ e("div", { children: !l && !n && m ? /* @__PURE__ */ e(
                H,
                {
                  label: D > 0 ? "该素材仍被镜头或对白引用" : s ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !E,
                      onClick: () => {
                        if (!s) {
                          k(!0);
                          return;
                        }
                        m(t.id);
                      },
                      children: [
                        /* @__PURE__ */ e(Ee, { size: 14 }),
                        s ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("button", { type: "button", onClick: C, children: l ? "关闭" : "取消" }),
                l ? null : /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !y || !M || R,
                    onClick: () => v({
                      ...t,
                      name: y,
                      prompt: M,
                      voice: t.type === "character" ? x.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ e(ie, { size: 14 }),
                      n ? "添加素材" : "确认修改"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : Be(B, p || document.body);
}
const un = [
  {
    value: "shot_images",
    title: "生成参考图",
    description: "生成素材设定和镜头参考图，之后可在画布中自行连接视频节点。"
  },
  {
    value: "shot_videos",
    title: "生成镜头视频",
    description: "生成各个镜头及所选附加内容，不创建最终视频合成。"
  },
  {
    value: "final_video",
    title: "生成完整成片",
    description: "创建完整镜头制作流程和视频合成，继续完成整条成片。"
  }
];
function hn({
  storyboard: t,
  submitting: n,
  portalContainer: l,
  onClose: a,
  onConfirm: c
}) {
  const [p, v] = P(
    () => fn(t.production_plan)
  ), m = ot(t), C = lt(t), u = t.shots.some(
    qt
  ), g = me(
    () => ({ ...t, production_plan: p }),
    [p, t]
  ), O = me(
    () => mn(g),
    [g]
  ), F = ct(
    g
  );
  X(() => {
    const s = (k) => {
      k.key === "Escape" && !n && a();
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [a, n]);
  const x = (s, k) => {
    v((y) => ({
      ...y,
      [s]: k ? "auto" : "off"
    }));
  }, I = async () => {
    await c(
      pn(p, {
        speech: m > 0,
        subtitles: C > 0,
        visibleDialogue: u
      })
    ) && a();
  };
  return Be(
    /* @__PURE__ */ e(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          n || a();
        },
        children: /* @__PURE__ */ r(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (s) => s.stopPropagation(),
            children: [
              /* @__PURE__ */ r("header", { children: [
                /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e("strong", { children: "确认分镜并创建制作区" }),
                  /* @__PURE__ */ e("span", { children: "确认后脚本进入只读状态，需要修改时可创建修订稿。" })
                ] }),
                /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: n,
                    onClick: a,
                    children: /* @__PURE__ */ e(Le, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ r("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ r("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ e("strong", { children: t.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ r("span", { children: [
                    t.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ r("span", { children: [
                    dt(t),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ r("span", { children: [
                    m,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ r("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ e("legend", { children: "产出目标" }),
                  /* @__PURE__ */ e("div", { className: "ws-storyboard-output-options", children: un.map((s) => /* @__PURE__ */ r(
                    "label",
                    {
                      className: p.output_target === s.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: s.value,
                            checked: p.output_target === s.value,
                            disabled: n,
                            onChange: () => v((k) => ({
                              ...k,
                              output_target: s.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ r("span", { children: [
                          /* @__PURE__ */ e("strong", { children: s.title }),
                          /* @__PURE__ */ e("small", { children: s.description })
                        ] }),
                        p.output_target === s.value ? /* @__PURE__ */ e(ie, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    s.value
                  )) })
                ] }),
                F ? /* @__PURE__ */ r("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ e("legend", { children: "附加内容" }),
                  /* @__PURE__ */ e(
                    Me,
                    {
                      title: "配音",
                      description: m > 0 ? `按脚本中的 ${m} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: m > 0 && p.voice_mode === "auto",
                      disabled: n || m === 0,
                      onChange: (s) => x("voice_mode", s)
                    }
                  ),
                  /* @__PURE__ */ e(
                    Me,
                    {
                      title: "字幕",
                      description: C > 0 ? `按脚本中的 ${C} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: C > 0 && p.subtitle_mode === "auto",
                      disabled: n || C === 0,
                      onChange: (s) => x("subtitle_mode", s)
                    }
                  ),
                  /* @__PURE__ */ e(
                    Me,
                    {
                      title: "口型同步",
                      description: u ? "仅对出镜对白创建口型同步，默认关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: u && p.voice_mode === "auto" && p.lip_sync_mode === "auto",
                      disabled: n || !u || p.voice_mode !== "auto",
                      onChange: (s) => x("lip_sync_mode", s)
                    }
                  )
                ] }) : null,
                /* @__PURE__ */ r("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ r("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ e("strong", { children: "制作流程" }),
                    /* @__PURE__ */ e("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ e("div", { className: "ws-storyboard-production-flow", children: O.map((s, k) => /* @__PURE__ */ r("span", { children: [
                    k > 0 ? /* @__PURE__ */ e("i", { "aria-hidden": "true", children: "/" }) : null,
                    s
                  ] }, s)) })
                ] })
              ] }),
              /* @__PURE__ */ r("footer", { children: [
                /* @__PURE__ */ e("button", { type: "button", disabled: n, onClick: a, children: "返回修改" }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: n,
                    onClick: () => {
                      I();
                    },
                    children: [
                      n ? /* @__PURE__ */ e(fe, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ e(ie, { size: 15 }),
                      n ? "确认中" : "确认并创建"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    l || document.body
  );
}
function Me({
  title: t,
  description: n,
  checked: l,
  disabled: a,
  onChange: c
}) {
  return /* @__PURE__ */ r("label", { className: `ws-storyboard-production-switch${a ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ r("span", { children: [
      /* @__PURE__ */ e("strong", { children: t }),
      /* @__PURE__ */ e("small", { children: n })
    ] }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        checked: l,
        disabled: a,
        onChange: (p) => c(p.target.checked)
      }
    ),
    /* @__PURE__ */ e("i", { "aria-hidden": "true" })
  ] });
}
function pn(t, n) {
  if (!["shot_videos", "final_video"].includes(t.output_target))
    return {
      ...t,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const l = n.speech && t.voice_mode === "auto" ? "auto" : "off";
  return {
    ...t,
    voice_mode: l,
    subtitle_mode: n.subtitles && t.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: n.visibleDialogue && l === "auto" && t.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function mn(t) {
  if (t.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const n = [
    ...t.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return ct(t) && n.push("镜头视频"), Wt(t) && n.push("配音"), Xt(t) && n.push("字幕"), Ht(t) && n.push("口型同步"), Kt(t) && n.push("视频合成"), n;
}
function fn(t) {
  const n = Ut(t);
  return n.output_target === "storyboard_only" ? { ...n, output_target: "shot_images" } : n;
}
function gn(t) {
  const n = [], l = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set(), v = new Map(
    t.references.map((s) => [s.key, s])
  ), m = /* @__PURE__ */ new Set();
  t.title.trim() || n.push(U("title", "分镜标题不能为空")), t.summary.trim() || n.push(U("summary", "请补充整个脚本的内容简介")), t.storyline.setup.trim() || n.push(U("storyline:setup", "请补充故事起点")), t.storyline.development.trim() || n.push(U("storyline:development", "请补充核心推进")), t.storyline.payoff.trim() || n.push(U("storyline:payoff", "请补充结果落点")), t.style_prompt.trim() || n.push(U("style", "请设置整部作品的统一视觉风格")), (!Number.isInteger(t.target_shot_count) || t.target_shot_count < 1 || t.target_shot_count > G) && n.push(
    U(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${G} 的整数`
    )
  ), t.target_shot_count !== t.shots.length && n.push(U("target_shot_count", "目标镜头数与实际镜头数不一致"));
  const C = t.shots.reduce(
    (s, k) => s + k.duration,
    0
  );
  !Number.isInteger(t.target_duration) || t.target_duration < 4 ? n.push(U("target_duration", "目标总时长必须是不小于 4 秒的整数")) : t.target_duration !== C && n.push(U("target_duration", "目标总时长与镜头时长之和不一致"));
  for (const s of t.materials) {
    const k = s.name.trim(), y = k.toLocaleLowerCase();
    s.id.trim() ? l.has(s.id) && n.push(j(s, `素材标识“${s.id}”重复`)) : n.push(j(s, "缺少稳定标识")), k ? a.has(y) && n.push(j(s, `素材名称“${k}”重复`)) : n.push(j(s, "名称不能为空")), s.prompt.trim() || n.push(j(s, "生成提示词不能为空")), s.type !== "character" && s.voice.trim() && n.push(j(s, "只有角色可以配置音色"));
    for (const M of s.reference_keys) {
      const R = v.get(M);
      R ? R.purpose !== s.type ? n.push(j(s, `参考素材“${R.label}”的用途不匹配`)) : m.add(M) : n.push(j(s, `引用了不存在的参考素材“${M}”`));
    }
    a.add(y), l.set(s.id, s);
  }
  if (!t.shots.length)
    return n.push(U("shots", "分镜至少需要一个镜头")), n;
  let u = /* @__PURE__ */ new Set(), g = !1, O = 0;
  const F = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  t.shots.forEach((s, k) => {
    const y = k + 1;
    (!s.id.trim() || F.has(s.id)) && n.push(S(s, y, "镜头标识缺失或重复")), F.add(s.id), ut(s.duration) || n.push(
      S(s, y, "时长必须是不小于 4 秒的整数")
    ), s.beat.trim() ? et(x, s.beat, s, y, "本镜变化", n) : n.push(S(s, y, "请填写本镜变化")), k === 0 && s.transition.trim() ? n.push(S(s, y, "第一镜不能填写上镜承接关系")) : k > 0 && !s.transition.trim() && n.push(S(s, y, "请说明与上一镜头的承接关系")), s.description.trim() ? et(
      I,
      s.description,
      s,
      y,
      "镜头描述",
      n
    ) : n.push(S(s, y, "镜头描述不能为空")), s.video_prompt.trim() || n.push(S(s, y, "视频提示词不能为空"));
    for (const D of s.reference_keys) {
      const E = v.get(D);
      E ? E.purpose !== "shot" ? n.push(
        S(s, y, `参考素材“${E.label}”的用途不匹配`)
      ) : m.add(D) : n.push(
        S(s, y, `引用了不存在的参考素材“${D}”`)
      );
    }
    const M = /* @__PURE__ */ new Set();
    for (const D of s.material_ids)
      l.has(D) ? M.has(D) && n.push(
        S(s, y, `重复引用素材“${D}”`)
      ) : n.push(
        S(s, y, `引用了不存在的素材“${D}”`)
      ), M.add(D);
    k === 0 && s.continue_previous && n.push(S(s, y, "第一个镜头不能承接上一镜头")), k === 0 && s.match_previous && n.push(S(s, y, "第一个镜头不能匹配上一镜头")), s.match_previous && s.continue_previous && n.push(S(s, y, "不能同时匹配上一镜画面和延续上一镜视频")), ht.includes(s.transition_type) || n.push(S(s, y, "结构化转场类型无效")), k === 0 && (s.transition_type !== "none" || s.transition_duration_ms !== 0) ? n.push(S(s, y, "第一镜不能配置转场效果")) : s.transition_type === "none" && s.transition_duration_ms !== 0 ? n.push(S(s, y, "硬切的转场时长必须为 0")) : s.transition_type !== "none" && (s.transition_duration_ms < 100 || s.transition_duration_ms > 5e3) && n.push(S(s, y, "转场时长必须是 100 到 5000 毫秒")), s.continue_previous ? (O += 1, s.continuity_anchor.trim() || n.push(S(s, y, "请填写连续性锚点")), O >= 3 && n.push(
      S(s, y, "连续镜头链最多包含 3 个镜头")
    ), wn(u, M) || n.push(
      S(
        s,
        y,
        "连续镜头不能新增、移除或更换角色、场景或道具"
      )
    )) : O = 0;
    const R = bn(
      s,
      y,
      l,
      M,
      c,
      n
    );
    s.continue_previous && (g || R) && n.push(
      S(s, y, "出镜对白不能跨越连续镜头边界")
    ), yn(s, y, p, n), u = M, g = R;
  });
  for (const s of t.references)
    s.purpose !== "visual_style" && s.purpose !== "motion_style" && !m.has(s.key) && n.push(
      U(
        `reference:${s.key}`,
        `参考素材“${s.label}”尚未关联到具体目标`
      )
    );
  return n;
}
function bn(t, n, l, a, c, p) {
  for (const m of t.speech) {
    if ((!m.id.trim() || c.has(m.id)) && p.push(S(t, n, "语音标识缺失或重复")), c.add(m.id), m.text.trim() || p.push(S(t, n, "对白或旁白文本不能为空")), (m.start_time < 0 || m.start_time >= t.duration) && p.push(S(t, n, "语音开始时间超出镜头范围")), m.kind !== "dialogue")
      continue;
    const C = m.character_id || "";
    l.get(C)?.type !== "character" ? p.push(S(t, n, "对白没有选择有效角色")) : a.has(C) || p.push(S(t, n, "对白角色未关联到当前镜头"));
  }
  const v = pt(t);
  return v.size > 1 && p.push(S(t, n, "最多只能有一个出镜说话角色")), vn(t, n, p), v.size > 0;
}
function vn(t, n, l) {
  const a = t.speech.filter((c) => c.text.trim()).map((c) => ({
    speech: c,
    start: c.start_time,
    end: c.start_time + Math.max(0.6, _n(c) / 3.5)
  })).sort((c, p) => c.start - p.start);
  for (let c = 0; c < a.length; c += 1) {
    const p = a[c];
    p.end > t.duration + 0.01 && l.push(
      Ze(
        `shot:${t.id}:speech:${p.speech.id}:duration`,
        `镜头 ${n} 的语音按正常语速可能无法在镜头内说完`,
        t.id
      )
    );
    const v = a[c + 1];
    v && p.end > v.start + 0.01 && l.push(
      Ze(
        `shot:${t.id}:speech:${p.speech.id}:overlap`,
        `镜头 ${n} 的相邻语音按正常语速可能重叠`,
        t.id
      )
    );
  }
}
function yn(t, n, l, a) {
  for (const c of t.captions)
    (!c.id.trim() || l.has(c.id)) && a.push(S(t, n, "字幕标识缺失或重复")), l.add(c.id), c.text.trim() || a.push(S(t, n, "字幕文案不能为空")), (c.start_time < 0 || c.end_time <= c.start_time || c.end_time > t.duration) && a.push(S(t, n, "字幕时间范围超出镜头"));
}
function _n(t) {
  return [...t.text.replace(/\s+/g, "")].length;
}
function wn(t, n) {
  if (t.size !== n.size)
    return !1;
  for (const l of t)
    if (!n.has(l))
      return !1;
  return !0;
}
function U(t, n) {
  return { id: t, message: n, severity: "error" };
}
function j(t, n) {
  return {
    id: `material:${t.id}:${n}`,
    message: `${t.name || "未命名素材"}：${n}`,
    severity: "error",
    materialId: t.id
  };
}
function S(t, n, l) {
  return {
    id: `shot:${t.id}:${l}`,
    message: `镜头 ${n}：${l}`,
    severity: "error",
    shotId: t.id
  };
}
function Sn(t, n, l) {
  return { id: t, message: n, severity: "warning", shotId: l };
}
function Ze(t, n, l) {
  return { id: t, message: n, severity: "error", shotId: l };
}
function et(t, n, l, a, c, p) {
  const v = n.replace(/\s+/g, "").toLocaleLowerCase(), m = t.get(v);
  m ? p.push(
    Sn(
      `shot:${l.id}:${c}:duplicate`,
      `镜头 ${a} 的${c}与镜头 ${m} 重复，建议审查是否有新的叙事作用`,
      l.id
    )
  ) : t.set(v, a);
}
function Nn({
  issues: t,
  onOpen: n
}) {
  const l = t.filter((p) => p.severity === "error"), a = t.filter((p) => p.severity === "warning"), c = [...l, ...a].slice(0, 5);
  return /* @__PURE__ */ r(
    "section",
    {
      className: `ws-storyboard-validation ${l.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ r("header", { children: [
          /* @__PURE__ */ e(ln, { size: 14 }),
          /* @__PURE__ */ e("strong", { children: l.length ? `${l.length} 项需要处理` : `${a.length} 项建议检查` }),
          t.length > c.length ? /* @__PURE__ */ r("span", { children: [
            "另有 ",
            t.length - c.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ e("div", { children: c.map((p, v) => {
          const m = !!(p.materialId || p.shotId);
          return /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              disabled: !m,
              onClick: () => m && n(p),
              children: /* @__PURE__ */ e("span", { children: p.message })
            },
            `${p.id}:${v}`
          );
        }) })
      ]
    }
  );
}
function Cn({
  storyboard: t,
  referenceItems: n,
  editable: l,
  disabled: a,
  onChange: c
}) {
  const p = it(n);
  if (t.references.length === 0)
    return null;
  const v = (m, C, u = !1) => {
    let g = u ? mt(t, m) : t;
    if (g = {
      ...g,
      references: g.references.map(
        (O) => O.key === m ? { ...O, ...C } : O
      )
    }, u) {
      const O = g.references.find((x) => x.key === m), F = O ? tt(g, O) : [];
      F.length === 1 && (g = nt(g, m, F[0].value));
    }
    c(g);
  };
  return /* @__PURE__ */ r("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ r("header", { children: [
      /* @__PURE__ */ e(cn, { size: 14 }),
      /* @__PURE__ */ e("strong", { children: "参考素材" }),
      /* @__PURE__ */ r("span", { children: [
        t.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ws-storyboard-reference-list", children: t.references.map((m) => {
      const C = tt(
        t,
        m
      ), u = In(t, m.key);
      return /* @__PURE__ */ r("div", { className: "ws-storyboard-reference-row", children: [
        /* @__PURE__ */ e(
          Pt,
          {
            className: "ws-storyboard-reference-asset",
            value: `@${m.label}`,
            content: kn(m),
            adapter: p
          }
        ),
        l ? /* @__PURE__ */ r(_e, { children: [
          /* @__PURE__ */ e(
            "select",
            {
              className: "nodrag nopan",
              value: m.purpose,
              disabled: a,
              "aria-label": `${m.label}的参考用途`,
              onChange: (g) => v(
                m.key,
                {
                  purpose: g.target.value
                },
                !0
              ),
              children: jt(m.kind).map(
                (g) => /* @__PURE__ */ e("option", { value: g.value, children: g.label }, g.value)
              )
            }
          ),
          rt(m.purpose) ? /* @__PURE__ */ r(
            "select",
            {
              className: "nodrag nopan",
              value: u,
              disabled: a,
              "aria-label": `${m.label}的关联目标`,
              onChange: (g) => c(
                nt(
                  t,
                  m.key,
                  g.target.value
                )
              ),
              children: [
                /* @__PURE__ */ e("option", { value: "", children: "选择关联目标" }),
                C.map((g) => /* @__PURE__ */ e("option", { value: g.value, children: g.label }, g.value))
              ]
            }
          ) : /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-global", children: "全局应用" }),
          /* @__PURE__ */ e(
            "input",
            {
              className: "nodrag nopan",
              value: m.instruction,
              disabled: a,
              "aria-label": `${m.label}的补充说明`,
              placeholder: "补充说明（可选）",
              onChange: (g) => v(m.key, {
                instruction: g.target.value
              })
            }
          )
        ] }) : /* @__PURE__ */ r(_e, { children: [
          /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-purpose", children: Gt[m.purpose] }),
          /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-target", children: Rn(t, u) || (rt(m.purpose) ? "未关联" : "全局应用") }),
          m.instruction ? /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-instruction", children: m.instruction }) : null
        ] })
      ] }, m.key);
    }) })
  ] });
}
function kn(t) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: t.asset_id,
        label: t.label,
        ref_trigger: "@",
        ref_version_id: t.version_id
      }
    ]
  };
}
function tt(t, n) {
  return ft(n.purpose) ? t.materials.filter((l) => l.type === n.purpose).map((l) => ({
    value: `material:${l.id}`,
    label: l.name
  })) : n.purpose === "shot" ? t.shots.map((l, a) => ({
    value: `shot:${l.id}`,
    label: `镜头 ${l.order || a + 1}`
  })) : [];
}
function In(t, n) {
  const l = t.materials.find(
    (c) => c.reference_keys.includes(n)
  );
  if (l)
    return `material:${l.id}`;
  const a = t.shots.find(
    (c) => c.reference_keys.includes(n)
  );
  return a ? `shot:${a.id}` : "";
}
function Rn(t, n) {
  const [l, a] = n.split(":", 2);
  if (l === "material")
    return t.materials.find((c) => c.id === a)?.name || "";
  if (l === "shot") {
    const c = t.shots.findIndex((p) => p.id === a);
    return c >= 0 ? `镜头 ${t.shots[c].order || c + 1}` : "";
  }
  return "";
}
function nt(t, n, l) {
  const a = mt(t, n);
  if (!l)
    return a;
  const [c, p] = l.split(":", 2);
  return c === "material" ? {
    ...a,
    materials: a.materials.map(
      (v) => v.id === p ? {
        ...v,
        reference_keys: [...v.reference_keys, n]
      } : v
    )
  } : c === "shot" ? {
    ...a,
    shots: a.shots.map(
      (v) => v.id === p ? { ...v, reference_keys: [...v.reference_keys, n] } : v
    )
  } : a;
}
function mt(t, n) {
  return {
    ...t,
    materials: t.materials.map((l) => ({
      ...l,
      reference_keys: l.reference_keys.filter(
        (a) => a !== n
      )
    })),
    shots: t.shots.map((l) => ({
      ...l,
      reference_keys: l.reference_keys.filter((a) => a !== n)
    }))
  };
}
function ft(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function rt(t) {
  return ft(t) || t === "shot";
}
const $n = Vt.ConfirmDialog, On = [], Dn = [
  {
    key: "setup",
    label: "起点",
    placeholder: "人物、产品或事件开始时处于什么具体状态"
  },
  {
    key: "development",
    label: "推进",
    placeholder: "什么触发了变化，核心动作如何推进"
  },
  {
    key: "payoff",
    label: "落点",
    placeholder: "最终发生了什么可见结果"
  }
];
function ir({
  storyboard: t,
  layout: n = "stacked",
  editable: l = !1,
  disabled: a = !1,
  onSave: c,
  onChange: p,
  onConfirm: v,
  onReview: m,
  onCreateRevision: C,
  workflowAction: u = "",
  saveStatus: g,
  showSaveStatus: O = !0,
  showMetrics: F = !0,
  referenceItems: x = On,
  focus: I
}) {
  const s = me(
    () => JSON.stringify(t),
    [t]
  ), [k, y] = P(t), [M, R] = P("saved"), [D, E] = P(""), [Y, B] = P(""), [T, i] = P(null), [f, h] = P(!1), [N, L] = P(!1), [z, J] = P(""), [se, we] = P(""), [Se, Ne] = P([]), [vt, yt] = P(
    "before"
  ), oe = q(null), Ce = oe.current?.closest(".wb-detail-backdrop, .ws-page") || null, ke = q(""), Q = q([]), Ae = q(/* @__PURE__ */ new Map()), Z = q(/* @__PURE__ */ new Map()), Ie = q(t), be = q(!1), le = q(0), Fe = q(s), W = q(null), Ye = q(Promise.resolve()), ce = q(!0), de = !!p, b = de ? t : k, ue = Jt(b), $ = l && !a && !ue && !u && !!(p || c), Ve = $ && !de && !!c, qe = it(x), ee = b.shots.find((o) => o.id === D), Re = b.materials.find(
    (o) => o.id === Y
  ), te = Re || T, _t = te ? je(b, te.id) : void 0, wt = me(
    () => He(b.shots, Se, (o) => o.id),
    [b.shots, Se]
  ), $e = me(
    () => gn(b),
    [b]
  ), St = $e.some(
    (o) => o.severity === "error"
  );
  X(() => (ce.current = !0, () => {
    ce.current = !1, W.current && window.clearTimeout(W.current);
  }), []), X(
    () => () => {
      for (const o of Z.current.values())
        o.cancel();
      Z.current.clear();
    },
    []
  ), zt(() => {
    const o = Ae.current, d = oe.current;
    if (!d || o.size === 0)
      return;
    const _ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    d.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((w) => {
      if (w.classList.contains("is-dragging"))
        return;
      const V = w.dataset.sequenceItemId || "", K = o.get(V);
      if (!K || _)
        return;
      const Oe = w.getBoundingClientRect(), he = K.left - Oe.left, ne = K.top - Oe.top;
      if (Math.abs(he) < 1 && Math.abs(ne) < 1)
        return;
      Z.current.get(V)?.cancel();
      const pe = w.animate(
        [
          { transform: `translate3d(${he}px, ${ne}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      Z.current.set(V, pe), pe.onfinish = () => {
        Z.current.get(V) === pe && Z.current.delete(V);
      };
    }), o.clear();
  }, [Se]), X(() => {
    Fe.current !== s && (Fe.current = s, !be.current && (Ie.current = t, y(t), R("saved")));
  }, [s, t]), X(() => {
    D && !ee && E("");
  }, [ee, D]), X(() => {
    Y && !Re && B("");
  }, [Re, Y]), X(() => {
    if (!I)
      return;
    if (I.materialId && b.materials.some((d) => d.id === I.materialId)) {
      i(null), E(""), B(I.materialId);
      return;
    }
    if (I.shotId && b.shots.some((d) => d.id === I.shotId)) {
      i(null), B(""), E(I.shotId);
      return;
    }
    const o = window.requestAnimationFrame(() => {
      const d = I.materialType ? `[data-storyboard-material-type="${I.materialType}"]` : I.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      oe.current?.querySelector(d)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(o);
  }, [
    I?.materialId,
    I?.materialType,
    I?.section,
    I?.shotId
  ]), X(() => {
    if (!Ve || !be.current || !c)
      return;
    W.current && window.clearTimeout(W.current);
    const o = b, d = le.current;
    return W.current = window.setTimeout(() => {
      W.current = null, Ye.current = Ye.current.catch(() => {
      }).then(async () => {
        ce.current && d === le.current && R("saving");
        try {
          if (await c(o), !ce.current || d !== le.current)
            return;
          be.current = !1, R("saved");
        } catch {
          if (!ce.current || d !== le.current)
            return;
          R("error");
        }
      });
    }, 800), () => {
      W.current && (window.clearTimeout(W.current), W.current = null);
    };
  }, [Ve, b, c]);
  const A = (o) => {
    if (!$)
      return;
    const d = de ? t : Ie.current, _ = o(d), w = zn(
      tn(nn(d, _)),
      qe.options
    );
    if (Ie.current = w, de) {
      p?.(w);
      return;
    }
    be.current = !0, le.current += 1, y(w), R("typing");
  }, Ue = () => {
    const o = oe.current;
    if (!o)
      return;
    const d = /* @__PURE__ */ new Map();
    o.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((_) => {
      const w = _.dataset.sequenceItemId || "";
      w && d.set(w, _.getBoundingClientRect());
    }), Ae.current = d;
  }, Nt = (o) => {
    const d = b.shots.map((_) => _.id);
    ke.current = o, Q.current = d, J(o), we(""), Ne(d);
  }, Ct = (o, d) => {
    const _ = ke.current, w = Q.current;
    if (!_ || !o || _ === o || !w.length || !w.includes(_) || !w.includes(o))
      return;
    const V = d.currentTarget.getBoundingClientRect(), K = d.currentTarget.parentElement?.getBoundingClientRect(), he = !!(K && V.width * 1.5 < K.width) ? d.clientX < V.left + V.width / 2 ? "before" : "after" : d.clientY < V.top + V.height / 2 ? "before" : "after", ne = xt(
      w,
      _,
      o,
      he,
      (pe) => pe
    );
    we(o), yt(he), !De(w, ne) && (Ue(), Q.current = ne, Ne(ne));
  }, We = () => {
    const o = Q.current, d = b.shots.map((_) => _.id);
    o.length > 0 && !De(o, d) && Ue(), ke.current = "", Q.current = [], J(""), we(""), Ne([]);
  }, kt = () => {
    const o = Q.current;
    o.length > 0 && A((d) => {
      const _ = He(d.shots, o, (w) => w.id);
      return De(
        d.shots.map((w) => w.id),
        _.map((w) => w.id)
      ) ? d : { ...d, shots: _ };
    }), We();
  }, It = (o) => {
    A(
      (d) => ve(
        d,
        d.shots.map((_) => _.id === o.id ? o : _)
      )
    ), E("");
  }, Rt = (o) => {
    A((d) => {
      const _ = d.materials.some((w) => w.id === o.id);
      return {
        ...d,
        materials: _ ? d.materials.map(
          (w) => w.id === o.id ? o : w
        ) : [...d.materials, o]
      };
    }), B(""), i(null);
  }, $t = (o) => {
    B(""), i(rn(b.materials, o));
  }, Ot = (o) => {
    const d = je(b, o);
    d.shotIds.length || d.speechIds.length || (A((_) => ({
      ..._,
      materials: _.materials.filter((w) => w.id !== o)
    })), B(""), i(null));
  }, Dt = (o) => {
    A((d) => d.shots.length <= 1 ? d : ve(
      d,
      d.shots.filter((_) => _.id !== o)
    ));
  }, Mt = (o) => {
    A((d) => {
      if (d.shots.length >= G)
        return d;
      const _ = An(d.shots, o), w = d.shots.findIndex((K) => K.id === o.id), V = [...d.shots];
      return V.splice(w + 1, 0, _), ve(d, V);
    });
  }, Tt = () => {
    A((o) => o.shots.length >= G ? o : ve(o, [
      ...o.shots,
      gt(o.shots)
    ]));
  };
  return /* @__PURE__ */ r(
    "section",
    {
      ref: oe,
      className: `ws-storyboard is-${n} ${$ ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ r("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ r("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ r("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ r("header", { children: [
                /* @__PURE__ */ e(ye, { size: 14 }),
                /* @__PURE__ */ e("strong", { children: "内容简介" })
              ] }),
              $ ? /* @__PURE__ */ e(
                "textarea",
                {
                  className: "nodrag nopan nowheel",
                  value: b.summary,
                  rows: 3,
                  placeholder: "概括故事背景、核心事件和结局走向",
                  disabled: a,
                  onChange: (o) => A((d) => ({
                    ...d,
                    summary: o.target.value
                  }))
                }
              ) : /* @__PURE__ */ e("p", { children: Qt(b) })
            ] }),
            /* @__PURE__ */ r("section", { className: "ws-storyboard-storyline", children: [
              /* @__PURE__ */ r("header", { children: [
                /* @__PURE__ */ e(ye, { size: 14 }),
                /* @__PURE__ */ e("strong", { children: "叙事主线" })
              ] }),
              /* @__PURE__ */ e("div", { children: Dn.map((o) => /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("strong", { children: o.label }),
                $ ? /* @__PURE__ */ e(
                  "textarea",
                  {
                    className: "nodrag nopan nowheel",
                    value: b.storyline[o.key],
                    rows: 2,
                    placeholder: o.placeholder,
                    disabled: a,
                    onChange: (d) => A((_) => ({
                      ..._,
                      storyline: {
                        ..._.storyline,
                        [o.key]: d.target.value
                      }
                    }))
                  }
                ) : /* @__PURE__ */ e("p", { children: b.storyline[o.key] })
              ] }, o.key)) })
            ] }),
            /* @__PURE__ */ e(
              Cn,
              {
                storyboard: b,
                referenceItems: x,
                editable: $,
                disabled: a,
                onChange: (o) => A(() => o)
              }
            ),
            /* @__PURE__ */ r("section", { className: "ws-storyboard-basic-settings", children: [
              /* @__PURE__ */ e("header", { children: /* @__PURE__ */ e("strong", { children: "基础设置" }) }),
              /* @__PURE__ */ r("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ r("label", { children: [
                  /* @__PURE__ */ e("strong", { children: /* @__PURE__ */ e(H, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ e("span", { children: "画面类型" }) }) }),
                  $ ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: b.visual_mode,
                      disabled: a,
                      onChange: (o) => A((d) => ({
                        ...d,
                        visual_mode: o.target.value
                      })),
                      children: Zt.map((o) => /* @__PURE__ */ e("option", { value: o, children: Ge[o] }, o))
                    }
                  ) : /* @__PURE__ */ e("span", { children: Ge[b.visual_mode] })
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  /* @__PURE__ */ e("strong", { children: "画幅" }),
                  $ ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: b.aspect_ratio,
                      disabled: a,
                      onChange: (o) => A((d) => ({
                        ...d,
                        aspect_ratio: o.target.value
                      })),
                      children: en.map((o) => /* @__PURE__ */ e("option", { value: o, children: o }, o))
                    }
                  ) : /* @__PURE__ */ e("span", { children: b.aspect_ratio })
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  /* @__PURE__ */ e("strong", { children: "目标时长" }),
                  $ ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      type: "number",
                      min: Pe,
                      step: 1,
                      value: b.target_duration,
                      disabled: a,
                      onChange: (o) => A((d) => ({
                        ...d,
                        target_duration: xe(
                          o,
                          d.target_duration,
                          Pe
                        )
                      }))
                    }
                  ) : /* @__PURE__ */ r("span", { children: [
                    b.target_duration,
                    " 秒"
                  ] })
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  /* @__PURE__ */ e("strong", { children: "目标镜头" }),
                  $ ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      type: "number",
                      min: 1,
                      max: G,
                      step: 1,
                      value: b.target_shot_count,
                      disabled: a,
                      onChange: (o) => A((d) => ({
                        ...d,
                        target_shot_count: Math.min(
                          G,
                          xe(
                            o,
                            d.target_shot_count,
                            1
                          )
                        )
                      }))
                    }
                  ) : /* @__PURE__ */ r("span", { children: [
                    b.target_shot_count,
                    " 个"
                  ] })
                ] }),
                /* @__PURE__ */ r("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ e("strong", { children: "旁白音色" }),
                  $ ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: b.narrator_voice,
                      placeholder: "能力默认",
                      disabled: a,
                      onChange: (o) => A((d) => ({
                        ...d,
                        narrator_voice: o.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ e("span", { children: b.narrator_voice || "能力默认" })
                ] }),
                /* @__PURE__ */ r("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ e("strong", { children: "统一视觉风格" }),
                  $ ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: b.style_prompt,
                      placeholder: "整部作品保持一致的画面风格",
                      disabled: a,
                      onChange: (o) => A(
                        (d) => on(d, o.target.value)
                      )
                    }
                  ) : /* @__PURE__ */ e(H, { label: b.style_prompt, children: /* @__PURE__ */ e("span", { children: b.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] })
            ] }),
            b.materials.length || $ ? /* @__PURE__ */ e(
              Mn,
              {
                materials: b.materials,
                editable: $,
                onOpen: B,
                onCreate: $t
              }
            ) : null
          ] }),
          /* @__PURE__ */ r("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ e("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ r("div", { className: "ws-storyboard-toolbar-end", children: [
              F || $ && O ? /* @__PURE__ */ r("div", { className: "ws-storyboard-toolbar-meta", children: [
                F ? /* @__PURE__ */ r("span", { children: [
                  b.shots.length,
                  " 个镜头 ·",
                  " ",
                  dt(b),
                  " 秒 ·",
                  " ",
                  ot(b),
                  " 条语音 ·",
                  " ",
                  lt(b),
                  " 条字幕"
                ] }) : null,
                $ && O ? /* @__PURE__ */ e(
                  xn,
                  {
                    status: de ? g || "saved" : M
                  }
                ) : null
              ] }) : null,
              $ ? /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: a || b.shots.length >= G,
                  onClick: Tt,
                  children: [
                    /* @__PURE__ */ e(ge, { size: 13 }),
                    /* @__PURE__ */ e("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              ue && C ? /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: a || !!u,
                  onClick: () => {
                    C();
                  },
                  children: [
                    u === "revising" ? /* @__PURE__ */ e(fe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(At, { size: 13 }),
                    u === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !ue && $ ? /* @__PURE__ */ r(_e, { children: [
                m ? /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "ws-storyboard-command",
                    disabled: a || !!u,
                    onClick: () => L(!0),
                    children: [
                      u === "reviewing" ? /* @__PURE__ */ e(fe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(Et, { size: 13 }),
                      u === "reviewing" ? "审查中" : "AI 审查并优化"
                    ]
                  }
                ) : null,
                v ? /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "ws-storyboard-command is-primary",
                    disabled: a || !!u || St,
                    onClick: () => h(!0),
                    children: [
                      u === "confirming" ? /* @__PURE__ */ e(fe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(ie, { size: 13 }),
                      u === "confirming" ? "确认中" : "确认脚本"
                    ]
                  }
                ) : null
              ] }) : null
            ] }) }),
            $ && $e.length ? /* @__PURE__ */ e(
              Nn,
              {
                issues: $e,
                onOpen: (o) => {
                  if (o.materialId) {
                    E(""), i(null), B(o.materialId);
                    return;
                  }
                  o.shotId && (B(""), i(null), E(o.shotId));
                }
              }
            ) : null,
            /* @__PURE__ */ e("div", { className: "ws-storyboard-grid nowheel", children: b.shots.length ? wt.map((o, d) => /* @__PURE__ */ e(
              Ft,
              {
                shot: o,
                index: d,
                storyboard: b,
                selected: D === o.id,
                editable: $,
                dragging: z === o.id,
                dropPlacement: se === o.id && z !== o.id ? vt : void 0,
                onOpen: () => E(o.id),
                onDuplicate: () => Mt(o),
                onRemove: () => Dt(o.id),
                onDragStart: () => Nt(o.id),
                onDragOver: (_) => Ct(o.id, _),
                onDrop: kt,
                onDragEnd: We
              },
              o.id
            )) : /* @__PURE__ */ r("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ e(ye, { size: 26 }),
              /* @__PURE__ */ e("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ e("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        f && v && !ue ? /* @__PURE__ */ e(
          hn,
          {
            storyboard: b,
            submitting: u === "confirming",
            portalContainer: Ce,
            onClose: () => h(!1),
            onConfirm: (o) => v(b, o)
          }
        ) : null,
        /* @__PURE__ */ e(
          $n,
          {
            open: N && !!m && !ue,
            onOpenChange: (o) => {
              u || L(o);
            },
            title: "AI 审查并优化分镜",
            desc: "将基于当前内容重新生成一份优化后的完整分镜。开始后会关闭详情页，可在画布节点查看生成进度。",
            confirmText: "开始优化",
            handleConfirm: () => {
              L(!1), m?.(b);
            },
            isLoading: u === "reviewing"
          }
        ),
        ee ? /* @__PURE__ */ e(
          Tn,
          {
            shot: ee,
            index: b.shots.findIndex((o) => o.id === ee.id),
            materials: b.materials,
            readonly: !$,
            referenceAdapter: qe,
            portalContainer: Ce,
            onEditMaterial: B,
            onSave: It,
            onClose: () => E("")
          },
          ee.id
        ) : null,
        te ? /* @__PURE__ */ e(
          dn,
          {
            material: te,
            creating: !!T,
            readonly: !$,
            usage: _t,
            existingNames: b.materials.filter((o) => o.id !== te.id).map((o) => o.name),
            portalContainer: Ce,
            onSave: Rt,
            onRemove: Ot,
            onClose: () => {
              B(""), i(null);
            }
          },
          `${T ? "create" : "edit"}:${te.id}`
        ) : null
      ]
    }
  );
}
function Mn({
  materials: t,
  editable: n,
  onOpen: l,
  onCreate: a
}) {
  return /* @__PURE__ */ r("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ r("header", { children: [
      /* @__PURE__ */ e("strong", { children: "素材设定" }),
      n ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((c) => /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => a(c),
          children: [
            /* @__PURE__ */ e(ge, { size: 11 }),
            ae[c]
          ]
        },
        c
      )) }) : null
    ] }),
    /* @__PURE__ */ r("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((c) => {
        const p = t.filter(
          (v) => v.type === c
        );
        return p.length ? /* @__PURE__ */ r(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": c,
            children: [
              /* @__PURE__ */ e("span", { children: ae[c] }),
              p.map((v) => /* @__PURE__ */ e(
                H,
                {
                  label: `${n ? "编辑" : "查看"}${ae[c]}提示词：${v.name}`,
                  children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => l(v.id),
                      children: [
                        /* @__PURE__ */ e("span", { children: v.name }),
                        n ? /* @__PURE__ */ e(st, { size: 11 }) : null
                      ]
                    }
                  )
                },
                v.id
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
function Tn({
  shot: t,
  index: n,
  materials: l,
  readonly: a,
  referenceAdapter: c,
  portalContainer: p,
  onEditMaterial: v,
  onSave: m,
  onClose: C
}) {
  const [u, g] = P(() => bt(t)), O = l.filter(
    (i) => i.type === "character"
  ), F = new Set(
    u.speech.filter((i) => i.kind === "dialogue").map((i) => i.character_id || "").filter(Boolean)
  ), x = pt(u), I = u.speech.some(
    (i) => i.start_time < 0 || i.start_time >= u.duration
  ), s = n > 0 && (u.continue_previous && !u.continuity_anchor.trim() || u.continue_previous && u.match_previous), k = !u.beat.trim() || n > 0 && !u.transition.trim(), y = u.captions.some(
    (i) => !i.text.trim() || i.start_time < 0 || i.end_time <= i.start_time || i.end_time > u.duration
  ), M = (i, f, h) => {
    g((N) => ({
      ...N,
      ...Pn(N, i, f, h)
    }));
  }, R = (i, f) => {
    g((h) => {
      const N = h.speech.map(
        (z) => z.id === i ? Bn(z, f) : z
      ), L = N.filter((z) => z.kind === "dialogue").map((z) => z.character_id || "").filter(Boolean);
      return {
        ...h,
        material_ids: [.../* @__PURE__ */ new Set([...h.material_ids, ...L])],
        speech: N
      };
    });
  }, D = (i) => {
    g((f) => f.material_ids.includes(i) ? F.has(i) ? f : {
      ...f,
      material_ids: f.material_ids.filter((h) => h !== i)
    } : {
      ...f,
      material_ids: [...f.material_ids, i]
    });
  }, E = (i, f) => {
    g((h) => {
      const N = h.speech.findIndex(
        (se) => se.id === i
      ), L = N + f;
      if (N < 0 || L < 0 || L >= h.speech.length)
        return h;
      const z = [...h.speech], [J] = z.splice(N, 1);
      return z.splice(L, 0, J), { ...h, speech: z };
    });
  }, Y = (i, f) => {
    g((h) => ({
      ...h,
      captions: h.captions.map(
        (N) => N.id === i ? { ...N, ...f } : N
      )
    }));
  }, B = (i, f) => {
    g((h) => {
      const N = h.captions.findIndex(
        (se) => se.id === i
      ), L = N + f;
      if (N < 0 || L < 0 || L >= h.captions.length)
        return h;
      const z = [...h.captions], [J] = z.splice(N, 1);
      return z.splice(L, 0, J), { ...h, captions: z };
    });
  }, T = /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-backdrop", onMouseDown: C, children: /* @__PURE__ */ r(
    "section",
    {
      className: "ws-storyboard-shot-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${a ? "查看" : "编辑"}镜头 ${n + 1}`,
      onMouseDown: (i) => i.stopPropagation(),
      children: [
        /* @__PURE__ */ r("header", { children: [
          /* @__PURE__ */ r("div", { children: [
            /* @__PURE__ */ r("strong", { children: [
              a ? "查看镜头" : "编辑镜头",
              " ",
              String(n + 1).padStart(2, "0")
            ] }),
            /* @__PURE__ */ e("span", { children: a ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
          ] }),
          /* @__PURE__ */ e(H, { label: "关闭", children: /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: C, children: /* @__PURE__ */ e(Le, { size: 18 }) }) })
        ] }),
        /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-form nowheel", children: [
          /* @__PURE__ */ r("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ e("strong", { children: "镜头内容" }),
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ r("label", { className: "ws-storyboard-continuity-input", children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: n > 0 && u.match_previous,
                      disabled: a || n === 0,
                      onChange: (i) => g((f) => ({
                        ...f,
                        match_previous: n > 0 && i.target.checked,
                        continue_previous: i.target.checked ? !1 : f.continue_previous,
                        continuity_anchor: i.target.checked ? "" : f.continuity_anchor
                      }))
                    }
                  ),
                  "匹配上一镜画面"
                ] }),
                /* @__PURE__ */ r("label", { className: "ws-storyboard-continuity-input", children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: n > 0 && u.continue_previous,
                      disabled: a || n === 0,
                      onChange: (i) => g((f) => ({
                        ...f,
                        match_previous: i.target.checked ? !1 : f.match_previous,
                        continue_previous: n > 0 && i.target.checked,
                        continuity_anchor: n > 0 && i.target.checked ? f.continuity_anchor : ""
                      }))
                    }
                  ),
                  "承接上一镜头"
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  "时长",
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "number",
                      min: Pe,
                      step: 1,
                      value: u.duration,
                      disabled: a,
                      onChange: (i) => g((f) => ({
                        ...f,
                        duration: Ln(
                          i,
                          f.duration
                        )
                      }))
                    }
                  ),
                  "秒"
                ] })
              ] })
            ] }),
            n > 0 && u.continue_previous ? /* @__PURE__ */ r("label", { className: "ws-storyboard-continuity-anchor", children: [
              /* @__PURE__ */ e("span", { children: "连续性锚点" }),
              /* @__PURE__ */ e(
                "textarea",
                {
                  value: u.continuity_anchor,
                  readOnly: a,
                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                  onChange: (i) => g((f) => ({
                    ...f,
                    continuity_anchor: i.target.value
                  }))
                }
              )
            ] }) : null,
            s ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "画面匹配和视频延续不能同时启用；延续上一镜头时必须填写连续性锚点。" }) : null,
            /* @__PURE__ */ r(
              "div",
              {
                className: `ws-storyboard-shot-field-row ${n === 0 ? "is-single" : ""}`,
                children: [
                  /* @__PURE__ */ e(
                    at,
                    {
                      label: "本镜变化",
                      value: u.beat,
                      placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                      readonly: a,
                      onChange: (i) => g((f) => ({ ...f, beat: i }))
                    }
                  ),
                  n > 0 ? /* @__PURE__ */ e(
                    at,
                    {
                      label: "与上镜关系",
                      value: u.transition,
                      placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                      readonly: a,
                      onChange: (i) => g((f) => ({
                        ...f,
                        transition: i
                      }))
                    }
                  ) : null
                ]
              }
            ),
            n > 0 ? /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-field-row", children: [
              /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("span", { children: "剪辑转场" }),
                /* @__PURE__ */ e(
                  "select",
                  {
                    value: u.transition_type,
                    disabled: a,
                    onChange: (i) => g((f) => {
                      const h = i.target.value;
                      return {
                        ...f,
                        transition_type: h,
                        transition_duration_ms: h === "none" ? 0 : Math.max(500, f.transition_duration_ms)
                      };
                    }),
                    children: ht.map((i) => /* @__PURE__ */ e("option", { value: i, children: an[i] }, i))
                  }
                )
              ] }),
              u.transition_type !== "none" ? /* @__PURE__ */ r("label", { children: [
                /* @__PURE__ */ e("span", { children: "转场时长" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "number",
                    min: 100,
                    max: 5e3,
                    step: 100,
                    value: u.transition_duration_ms,
                    disabled: a,
                    onChange: (i) => g((f) => ({
                      ...f,
                      transition_duration_ms: Math.min(
                        5e3,
                        xe(
                          i,
                          f.transition_duration_ms,
                          100
                        )
                      )
                    }))
                  }
                )
              ] }) : null
            ] }) : null,
            k ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
            /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
              Te,
              {
                label: "镜头描述",
                value: u.description,
                content: u.reference_contents?.description,
                placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                readonly: a,
                referenceAdapter: c,
                onChange: (i, f) => M("description", i, f)
              }
            ) }),
            /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-field-row", children: [
              /* @__PURE__ */ e(
                Te,
                {
                  label: "镜头语言",
                  value: u.camera_instruction,
                  content: u.reference_contents?.camera_instruction,
                  placeholder: "景别、机位和运动方式",
                  readonly: a,
                  referenceAdapter: c,
                  onChange: (i, f) => M("camera_instruction", i, f)
                }
              ),
              /* @__PURE__ */ e(
                Te,
                {
                  label: "视频提示词",
                  value: u.video_prompt,
                  content: u.reference_contents?.video_prompt,
                  placeholder: "完整描述动作、运镜、光线与风格",
                  readonly: a,
                  referenceAdapter: c,
                  onChange: (i, f) => M("video_prompt", i, f)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ r("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ r("div", { children: [
              /* @__PURE__ */ e("strong", { children: "关联素材" }),
              /* @__PURE__ */ r("span", { children: [
                u.material_ids.length,
                " 个素材"
              ] })
            ] }) }),
            l.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((i) => {
              const f = l.filter(
                (h) => h.type === i
              );
              return f.length ? /* @__PURE__ */ r("fieldset", { children: [
                /* @__PURE__ */ e("legend", { children: ae[i] }),
                /* @__PURE__ */ e("div", { children: f.map((h) => {
                  const N = u.material_ids.includes(
                    h.id
                  ), L = F.has(h.id);
                  return /* @__PURE__ */ r(
                    "div",
                    {
                      className: "ws-storyboard-material-option",
                      children: [
                        /* @__PURE__ */ e(
                          H,
                          {
                            label: N && L ? "该角色已用于对白，不能取消关联" : N ? "取消关联" : "关联素材",
                            children: /* @__PURE__ */ r("label", { children: [
                              /* @__PURE__ */ e(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: N,
                                  disabled: a || N && L,
                                  onChange: () => D(h.id)
                                }
                              ),
                              /* @__PURE__ */ r("span", { className: "sr-only", children: [
                                "关联 ",
                                h.name
                              ] })
                            ] })
                          }
                        ),
                        /* @__PURE__ */ e(
                          H,
                          {
                            label: `${a ? "查看" : "编辑"}${ae[i]}提示词：${h.name}`,
                            children: /* @__PURE__ */ r(
                              "button",
                              {
                                type: "button",
                                onClick: () => v(h.id),
                                children: [
                                  /* @__PURE__ */ e("span", { children: h.name }),
                                  a ? null : /* @__PURE__ */ e(st, { size: 11 })
                                ]
                              }
                            )
                          }
                        )
                      ]
                    },
                    h.id
                  );
                }) })
              ] }, i) : null;
            }) }) : /* @__PURE__ */ e("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
          ] }),
          /* @__PURE__ */ r("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("strong", { children: "角色配音与旁白" }),
                /* @__PURE__ */ r("span", { children: [
                  u.speech.length,
                  " 条语音"
                ] })
              ] }),
              a ? null : /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => g((i) => ({
                      ...i,
                      speech: [
                        ...i.speech,
                        Je(i, "dialogue")
                      ]
                    })),
                    children: [
                      /* @__PURE__ */ e(ge, { size: 13 }),
                      "添加对白"
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => g((i) => ({
                      ...i,
                      speech: [
                        ...i.speech,
                        Je(i, "narration")
                      ]
                    })),
                    children: [
                      /* @__PURE__ */ e(ge, { size: 13 }),
                      "添加旁白"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: u.speech.length ? u.speech.map((i, f) => /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-row", children: [
              /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-row-head", children: [
                /* @__PURE__ */ r("strong", { children: [
                  "语音 ",
                  f + 1
                ] }),
                a ? null : /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "上移语音",
                      disabled: f === 0,
                      onClick: () => E(i.id, -1),
                      children: /* @__PURE__ */ e(Ke, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "下移语音",
                      disabled: f === u.speech.length - 1,
                      onClick: () => E(i.id, 1),
                      children: /* @__PURE__ */ e(Xe, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "删除语音",
                      danger: !0,
                      onClick: () => g((h) => ({
                        ...h,
                        speech: h.speech.filter(
                          (N) => N.id !== i.id
                        )
                      })),
                      children: /* @__PURE__ */ e(Ee, { size: 13 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-fields", children: [
                /* @__PURE__ */ r("label", { children: [
                  "类型",
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: i.kind,
                      disabled: a,
                      onChange: (h) => R(i.id, {
                        kind: h.target.value
                      }),
                      children: [
                        /* @__PURE__ */ e("option", { value: "dialogue", children: "角色对白" }),
                        /* @__PURE__ */ e("option", { value: "narration", children: "旁白" })
                      ]
                    }
                  )
                ] }),
                i.kind === "dialogue" ? /* @__PURE__ */ r(_e, { children: [
                  /* @__PURE__ */ r("label", { children: [
                    "角色",
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: i.character_id || "",
                        disabled: a,
                        onChange: (h) => R(i.id, {
                          character_id: h.target.value
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "", children: "请选择角色" }),
                          O.map((h) => /* @__PURE__ */ e("option", { value: h.id, children: h.name }, h.id))
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ r("label", { children: [
                    "说话方式",
                    /* @__PURE__ */ r(
                      "select",
                      {
                        value: i.speaker_mode || "offscreen",
                        disabled: a,
                        onChange: (h) => R(i.id, {
                          speaker_mode: h.target.value === "visible" ? "visible" : "offscreen"
                        }),
                        children: [
                          /* @__PURE__ */ e("option", { value: "visible", children: "出镜对白" }),
                          /* @__PURE__ */ e("option", { value: "offscreen", children: "画外音" })
                        ]
                      }
                    )
                  ] })
                ] }) : null,
                /* @__PURE__ */ r("label", { children: [
                  "开始时间",
                  /* @__PURE__ */ r("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ e(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        max: Math.max(0, u.duration - 0.01),
                        step: 0.1,
                        value: i.start_time,
                        disabled: a,
                        onChange: (h) => R(i.id, {
                          start_time: ze(h)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ r("label", { className: "ws-storyboard-speech-text", children: [
                "文本",
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: i.text,
                    readOnly: a,
                    placeholder: i.kind === "narration" ? "输入旁白" : "输入对白",
                    onChange: (h) => R(i.id, { text: h.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-subtitle", children: [
                /* @__PURE__ */ r("label", { children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "checkbox",
                      checked: i.subtitle_enabled,
                      disabled: a,
                      onChange: (h) => R(i.id, {
                        subtitle_enabled: h.target.checked
                      })
                    }
                  ),
                  "加入字幕"
                ] }),
                i.subtitle_enabled ? /* @__PURE__ */ e(
                  "input",
                  {
                    value: i.subtitle_text,
                    readOnly: a,
                    placeholder: "可选：填写精简字幕；留空使用原文",
                    onChange: (h) => R(i.id, {
                      subtitle_text: h.target.value
                    })
                  }
                ) : null
              ] })
            ] }, i.id)) : /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-empty", children: [
              /* @__PURE__ */ e(Yt, { size: 24 }),
              /* @__PURE__ */ e("span", { children: "当前镜头没有对白或旁白" })
            ] }) }),
            x.size > 1 ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
            I ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
          ] }),
          /* @__PURE__ */ r("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ r("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ r("div", { children: [
                /* @__PURE__ */ e("strong", { children: "附加字幕文案" }),
                /* @__PURE__ */ r("span", { children: [
                  u.captions.length,
                  " 条文案"
                ] })
              ] }),
              a ? null : /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => g((i) => ({
                    ...i,
                    captions: [
                      ...i.captions,
                      sn(i)
                    ]
                  })),
                  children: [
                    /* @__PURE__ */ e(ge, { size: 13 }),
                    "添加文案"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: u.captions.length ? u.captions.map((i, f) => /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-row", children: [
              /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-row-head", children: [
                /* @__PURE__ */ r("strong", { children: [
                  "文案 ",
                  f + 1
                ] }),
                a ? null : /* @__PURE__ */ r("div", { children: [
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "上移文案",
                      disabled: f === 0,
                      onClick: () => B(i.id, -1),
                      children: /* @__PURE__ */ e(Ke, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "下移文案",
                      disabled: f === u.captions.length - 1,
                      onClick: () => B(i.id, 1),
                      children: /* @__PURE__ */ e(Xe, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    re,
                    {
                      label: "删除文案",
                      danger: !0,
                      onClick: () => g((h) => ({
                        ...h,
                        captions: h.captions.filter(
                          (N) => N.id !== i.id
                        )
                      })),
                      children: /* @__PURE__ */ e(Ee, { size: 13 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-fields", children: [
                /* @__PURE__ */ r("label", { children: [
                  "类型",
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: i.type,
                      disabled: a,
                      onChange: (h) => Y(i.id, {
                        type: h.target.value
                      }),
                      children: [
                        /* @__PURE__ */ e("option", { value: "caption", children: "说明" }),
                        /* @__PURE__ */ e("option", { value: "title", children: "标题" }),
                        /* @__PURE__ */ e("option", { value: "highlight", children: "重点" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  "开始时间",
                  /* @__PURE__ */ r("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ e(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        max: u.duration,
                        step: 0.1,
                        value: i.start_time,
                        disabled: a,
                        onChange: (h) => Y(i.id, {
                          start_time: ze(h)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] }),
                /* @__PURE__ */ r("label", { children: [
                  "结束时间",
                  /* @__PURE__ */ r("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ e(
                      "input",
                      {
                        type: "number",
                        min: 0.1,
                        max: u.duration,
                        step: 0.1,
                        value: i.end_time,
                        disabled: a,
                        onChange: (h) => Y(i.id, {
                          end_time: ze(h)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ r("label", { className: "ws-storyboard-speech-text", children: [
                "文本",
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: i.text,
                    readOnly: a,
                    placeholder: "输入不对应语音的标题、说明或重点文字",
                    onChange: (h) => Y(i.id, {
                      text: h.target.value
                    })
                  }
                )
              ] })
            ] }, i.id)) : /* @__PURE__ */ r("div", { className: "ws-storyboard-speech-empty", children: [
              /* @__PURE__ */ e(ye, { size: 24 }),
              /* @__PURE__ */ e("span", { children: "当前镜头没有附加字幕文案" })
            ] }) }),
            y ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
          ] })
        ] }),
        /* @__PURE__ */ r("footer", { children: [
          /* @__PURE__ */ e("button", { type: "button", onClick: C, children: a ? "关闭" : "取消" }),
          a ? null : /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "is-primary",
              disabled: x.size > 1 || I || k || s || y,
              onClick: () => m(u),
              children: [
                /* @__PURE__ */ e(ie, { size: 14 }),
                "确认修改"
              ]
            }
          )
        ] })
      ]
    }
  ) });
  return typeof document > "u" ? null : Be(T, p || document.body);
}
function Te({
  label: t,
  value: n,
  content: l,
  placeholder: a,
  readonly: c,
  referenceAdapter: p,
  onChange: v
}) {
  return /* @__PURE__ */ r("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      Lt,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: n,
        content: l,
        adapter: p,
        placeholder: a,
        disabled: c,
        layerZIndex: 2700,
        onChange: v
      }
    )
  ] });
}
function at({
  label: t,
  value: n,
  placeholder: l,
  readonly: a,
  onChange: c
}) {
  return /* @__PURE__ */ r("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: n,
        rows: 3,
        placeholder: l,
        readOnly: a,
        onChange: (p) => c(p.target.value)
      }
    )
  ] });
}
function zn(t, n) {
  return {
    ...t,
    shots: t.shots.map((l) => {
      const a = { ...l.reference_contents || {} };
      for (const c of En) {
        const p = Bt(
          l[c],
          a[c],
          n
        );
        p ? a[c] = p : delete a[c];
      }
      return { ...l, reference_contents: a };
    })
  };
}
const En = [
  "description",
  "camera_instruction",
  "video_prompt"
];
function Pn(t, n, l, a) {
  const c = { ...t.reference_contents || {} };
  return a ? c[n] = a : delete c[n], {
    [n]: l,
    reference_contents: c
  };
}
function re({
  label: t,
  disabled: n,
  danger: l = !1,
  onClick: a,
  children: c
}) {
  return /* @__PURE__ */ e(H, { label: t, children: /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${l ? "is-danger" : ""}`,
      "aria-label": t,
      disabled: n,
      onClick: a,
      children: c
    }
  ) });
}
function xn({ status: t }) {
  return /* @__PURE__ */ r("span", { className: `ws-storyboard-save-state is-${t}`, children: [
    t === "saving" ? /* @__PURE__ */ e(fe, { size: 12, className: "ws-spin" }) : t === "saved" ? /* @__PURE__ */ e(ie, { size: 12 }) : null,
    t === "typing" ? "编辑中" : t === "saving" ? "保存中" : t === "error" ? "保存失败" : "已保存"
  ] });
}
function Bn(t, n) {
  const l = { ...t, ...n };
  return l.kind === "dialogue" ? (l.character_id ||= "", l.speaker_mode ||= "offscreen") : (delete l.character_id, delete l.speaker_mode), l.subtitle_enabled = !!l.subtitle_enabled, l.subtitle_text ||= "", l;
}
function Ln(t, n) {
  const l = Number(t.target.value);
  return ut(l) ? l : n;
}
function xe(t, n, l) {
  const a = Number(t.target.value);
  return Number.isInteger(a) && a >= l ? a : n;
}
function ze(t) {
  const n = Number.parseFloat(t.target.value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function gt(t) {
  const n = new Set(t.map((c) => c.id));
  let l = t.length, a = Qe(l);
  for (; n.has(a.id); )
    l += 1, a = Qe(l);
  return a;
}
function ve(t, n) {
  return {
    ...t,
    shots: n,
    target_shot_count: n.length,
    target_duration: n.reduce((l, a) => l + a.duration, 0)
  };
}
function An(t, n) {
  const l = gt(t);
  return {
    ...bt(n),
    id: l.id,
    order: l.order,
    speech: n.speech.map((a, c) => ({
      ...a,
      id: `${l.id}-speech-${c + 1}`
    })),
    captions: n.captions.map((a, c) => ({
      ...a,
      id: `${l.id}-caption-${c + 1}`
    }))
  };
}
function bt(t) {
  return {
    ...t,
    material_ids: [...t.material_ids],
    speech: t.speech.map((n) => ({ ...n })),
    captions: t.captions.map((n) => ({ ...n })),
    reference_contents: { ...t.reference_contents || {} }
  };
}
export {
  ir as StoryboardView
};
