import { c as fn, j as n, a, F as qe } from "./createLucideIcon-fWv1XcFy.js";
import { b as P, c as G, i as Q, e as W, o as bn } from "./runtime-entry-ClkZDmNs.js";
import { c as Xe } from "./site-config-DrnclGFw.js";
import { L as Re } from "./vanilla-BSPxkY5-.js";
import { A as dt } from "./arrow-down-BEwslZTQ.js";
import { A as ut } from "./arrow-up-gCOxsuD7.js";
import { B as We } from "./user-round-5NX4bvyQ.js";
import { C as me } from "./check-B_RB4H2g.js";
import { C as gn } from "./copy-BlmHyHAH.js";
import { o as pt, u as yn, q as Ve, t as vn, M as _n, v as wn } from "./space-storyboard-shot-card-DVUe0KAE.js";
import { P as kt } from "./pencil-DsS_UhAq.js";
import { P as ke } from "./_commonjsHelpers-BNFp87fY.js";
import { T as He } from "./trash-2-C2PWG3er.js";
import { X as Ze } from "./in-flight-request-CXY2yBH9.js";
import { m as Sn } from "./task-popover-nchDdidF.js";
import { S as oe, M as Ce, d as Nn, e as Ct, f as It, g as Rt, h as $t, j as Ot, k as Mt, l as Qe, m as kn, n as xt, o as Cn, p as In, c as Rn, q as Dt, r as $n, t as On, u as Mn, v as xn, w as Dn, x as Tt, i as Tn, y as mt, z as zn, A as En, B as ht, D as Pn, E as An, F as Ln, G as Bn, H as Vn, I as Un, J as ft, K as Fn, L as bt, N as jn } from "./space-content-view-TucLzffi.js";
import { u as zt, b as Yn, c as qn } from "./space-reference-editor-CmgVWTz3.js";
import { g as ee, U as Wn, V as X, p as Et, F as Hn, W as Gn, z as te, K as Pt, X as Jn, Y as Kn, Z as Ie, _ as Xn, $ as he, a0 as At, a1 as Lt, d as Zn } from "./storyboard-grid-view-BldHSQpc.js";
import { C as Qn } from "./circle-alert-B2uOyl1_.js";
import { L as er } from "./link-2-fCVybg_U.js";
const tr = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83", key: "1bzlo9" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21", key: "1q0aeu" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15", key: "5mozeu" }],
  [
    "path",
    {
      d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
      key: "mmje98"
    }
  ],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9", key: "43el77" }]
], nr = fn("image-off", tr);
function rr({
  material: e,
  creating: t = !1,
  readonly: r,
  usage: i,
  existingNames: s = [],
  portalContainer: l,
  onSave: u,
  onRemove: b,
  onClose: _
}) {
  const [S, w] = P(e.name), [M, m] = P(e.prompt), [N, E] = P(e.voice), [F, $] = P(!1), A = S.trim().replace(/^[@#]+/, ""), d = M.trim(), v = s.some(
    (D) => D.trim().toLocaleLowerCase() === A.toLocaleLowerCase()
  ), g = (i?.shotIds.length || 0) + (i?.speechIds.length || 0), T = !t && !r && !!b && g === 0, z = oe[e.type];
  G(() => {
    function D(O) {
      O.key === "Escape" && (O.preventDefault(), _());
    }
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [_]);
  const V = /* @__PURE__ */ n(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: _,
      children: /* @__PURE__ */ a(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${t ? "新增" : r ? "查看" : "编辑"}${z}素材 ${e.name}`,
          onMouseDown: (D) => D.stopPropagation(),
          children: [
            /* @__PURE__ */ a("header", { children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ n("strong", { children: t ? `新增${z}` : e.name || z }),
                /* @__PURE__ */ a("span", { children: [
                  z,
                  "素材",
                  r ? " · 当前版本只读" : t ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ n(ee, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", "aria-label": "关闭", onClick: _, children: /* @__PURE__ */ n(Ze, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ a("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ n("span", { children: "素材名称" }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    value: S,
                    readOnly: r,
                    autoFocus: !r,
                    placeholder: `例如：${e.type === "character" ? "主角" : e.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (D) => w(D.target.value)
                  }
                ),
                v ? /* @__PURE__ */ n("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ n("span", { children: "生成提示词" }),
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    value: M,
                    readOnly: r,
                    placeholder: `描述${A || z}的外观、结构、材质与风格`,
                    onChange: (D) => m(D.target.value)
                  }
                )
              ] }),
              e.type === "character" ? /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ n("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    value: N,
                    readOnly: r,
                    placeholder: "留空使用语音能力默认音色",
                    onChange: (D) => E(D.target.value)
                  }
                ),
                /* @__PURE__ */ n("small", { children: "填写语音能力实际接受的音色值，不绑定具体供应商。" })
              ] }) : null,
              !t && g > 0 ? /* @__PURE__ */ a("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ n("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ a("span", { children: [
                  i?.shotIds.length || 0,
                  " 个镜头",
                  i?.speechIds.length ? ` · ${i.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ n("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ a("footer", { children: [
              /* @__PURE__ */ n("div", { children: !r && !t && b ? /* @__PURE__ */ n(
                ee,
                {
                  label: g > 0 ? "该素材仍被镜头或对白引用" : F ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !T,
                      onClick: () => {
                        if (!F) {
                          $(!0);
                          return;
                        }
                        b(e.id);
                      },
                      children: [
                        /* @__PURE__ */ n(He, { size: 14 }),
                        F ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: _, children: r ? "关闭" : "取消" }),
                r ? null : /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !A || !d || v,
                    onClick: () => u({
                      ...e,
                      name: A,
                      prompt: d,
                      voice: e.type === "character" ? N.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ n(me, { size: 14 }),
                      t ? "添加素材" : "确认修改"
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
  return typeof document > "u" ? null : Xe(V, l || document.body);
}
function Bt(e, t = {}) {
  const r = dr(e, t), i = [], s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), _ = new Map(
    e.references.map((d) => [d.key, d])
  ), S = /* @__PURE__ */ new Set();
  e.title.trim() || i.push(re("title", "分镜标题不能为空")), e.summary.trim() || i.push(re("summary", "请补充整个脚本的内容简介")), r.referenceImages && !e.style_prompt.trim() && i.push(re("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > Ce) && i.push(
    re(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${Ce} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && i.push(re("target_shot_count", "目标镜头数与实际镜头数不一致"));
  const w = Nn(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < 4 ? i.push(re("target_duration", "目标总时长必须是不小于 4 秒的整数")) : e.target_duration !== w && i.push(re("target_duration", "目标总时长与镜头时长之和不一致"));
  for (const d of e.materials) {
    const v = d.name.trim(), g = v.toLocaleLowerCase();
    d.id.trim() ? s.has(d.id) && i.push(ie(d, `素材标识“${d.id}”重复`)) : i.push(ie(d, "缺少稳定标识")), v ? l.has(g) && i.push(ie(d, `素材名称“${v}”重复`)) : i.push(ie(d, "名称不能为空")), r.referenceImages && !d.prompt.trim() && i.push(ie(d, "生成提示词不能为空")), d.type !== "character" && d.voice.trim() && i.push(ie(d, "只有角色可以配置音色"));
    for (const T of d.reference_keys) {
      const z = _.get(T);
      z ? z.purpose !== d.type ? i.push(ie(d, `参考素材“${z.label}”的用途不匹配`)) : S.add(T) : i.push(ie(d, `引用了不存在的参考素材“${T}”`));
    }
    l.add(g), s.set(d.id, d);
  }
  if (!e.shots.length)
    return i.push(re("shots", "分镜至少需要一个镜头")), i;
  let M = /* @__PURE__ */ new Set(), m = !1, N = "", E = 0;
  const F = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  e.shots.forEach((d, v) => {
    const g = v + 1;
    (!d.id.trim() || F.has(d.id)) && i.push(R(d, g, "镜头标识缺失或重复")), F.add(d.id), Ct(d.duration) || i.push(
      R(d, g, "时长必须是不小于 4 秒的整数")
    ), d.beat.trim() ? yt($, d.beat, d, g, "本镜变化", i) : i.push(R(d, g, "请填写本镜变化")), v === 0 && d.transition.trim() ? i.push(R(d, g, "第一镜不能填写上镜承接关系")) : v > 0 && !d.transition.trim() && i.push(R(d, g, "请说明与上一镜头的承接关系")), d.description.trim() ? yt(
      A,
      d.description,
      d,
      g,
      "镜头描述",
      i
    ) : i.push(R(d, g, "镜头描述不能为空")), r.shotVideos && !d.video_prompt.trim() && i.push(R(d, g, "视频提示词不能为空"));
    for (const U of d.reference_keys) {
      const j = _.get(U);
      j ? j.purpose !== "shot" ? i.push(
        R(d, g, `参考素材“${j.label}”的用途不匹配`)
      ) : S.add(U) : i.push(
        R(d, g, `引用了不存在的参考素材“${U}”`)
      );
    }
    const T = /* @__PURE__ */ new Set();
    for (const U of d.material_ids)
      s.has(U) ? T.has(U) && i.push(
        R(d, g, `重复引用素材“${U}”`)
      ) : i.push(
        R(d, g, `引用了不存在的素材“${U}”`)
      ), T.add(U);
    v === 0 && d.continue_previous && i.push(R(d, g, "第一个镜头不能承接上一镜头")), v === 0 && d.match_previous && i.push(R(d, g, "第一个镜头不能匹配上一镜头")), d.match_previous && d.continue_previous && i.push(R(d, g, "不能同时匹配上一镜画面和延续上一镜视频"));
    const z = d.continuity_state?.entry.trim() || "", V = d.continuity_state?.exit.trim() || "";
    r.referenceImages && (z || i.push(R(d, g, "请填写入镜状态")), V || i.push(R(d, g, "请填写出镜状态")), It(d, v) && z !== N && i.push(
      R(d, g, "入镜状态必须与上一镜头的出镜状态完全一致")
    )), r.shotVideos && (Rt.includes(d.transition_type) || i.push(R(d, g, "结构化转场类型无效")), v === 0 && (d.transition_type !== "none" || d.transition_duration_ms !== 0) ? i.push(R(d, g, "第一镜不能配置转场效果")) : d.transition_type === "none" && d.transition_duration_ms !== 0 ? i.push(R(d, g, "硬切的转场时长必须为 0")) : d.transition_type !== "none" && (d.transition_duration_ms < 100 || d.transition_duration_ms > 5e3) && i.push(R(d, g, "转场时长必须是 100 到 5000 毫秒")));
    const D = cr(
      T,
      s
    );
    r.shotVideos && d.continue_previous ? (E += 1, d.continuity_anchor.trim() || i.push(R(d, g, "请填写连续性锚点")), E >= 3 && i.push(
      Te(
        `shot:${d.id}:continuity-chain`,
        `镜头 ${g}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        d.id
      )
    ), lr(M, D) || i.push(
      R(
        d,
        g,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : E = 0;
    let O = !1;
    (r.voice || r.subtitles || r.lipSync) && (O = ir(
      d,
      g,
      s,
      T,
      u,
      i,
      {
        validateTimeline: r.voice,
        validateVisibleSpeakers: r.lipSync
      }
    )), r.lipSync && d.continue_previous && (m || O) && i.push(
      Te(
        `shot:${d.id}:visible-dialogue-continuity`,
        `镜头 ${g}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        d.id
      )
    ), r.subtitles && sr(d, g, b, i), M = D, m = O, N = V;
  });
  for (const d of e.references)
    d.purpose !== "visual_style" && d.purpose !== "motion_style" && !S.has(d.key) && i.push(
      Te(
        `reference:${d.key}`,
        `参考素材“${d.label}”尚未关联到具体目标`
      )
    );
  return i;
}
function ir(e, t, r, i, s, l, u) {
  for (const _ of e.speech) {
    if ((!_.id.trim() || s.has(_.id)) && l.push(R(e, t, "语音标识缺失或重复")), s.add(_.id), _.text.trim() || l.push(R(e, t, "对白或旁白文本不能为空")), (_.start_time < 0 || _.start_time >= e.duration) && l.push(R(e, t, "语音开始时间超出镜头范围")), _.kind !== "dialogue")
      continue;
    const S = _.character_id || "";
    r.get(S)?.type !== "character" ? l.push(R(e, t, "对白没有选择有效角色")) : i.has(S) || l.push(R(e, t, "对白角色未关联到当前镜头"));
  }
  const b = xt(e);
  return u.validateVisibleSpeakers && b.size > 1 && l.push(R(e, t, "最多只能有一个出镜说话角色")), u.validateTimeline && ar(e, t, l), b.size > 0;
}
function ar(e, t, r) {
  const i = e.speech.filter((s) => s.text.trim()).map((s) => ({
    speech: s,
    start: s.start_time,
    end: s.start_time + Math.max(0.6, or(s) / 3.5)
  })).sort((s, l) => s.start - l.start);
  for (let s = 0; s < i.length; s += 1) {
    const l = i[s];
    l.end > e.duration + 0.01 && r.push(
      gt(
        `shot:${e.id}:speech:${l.speech.id}:duration`,
        `镜头 ${t} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const u = i[s + 1];
    u && l.end > u.start + 0.01 && r.push(
      gt(
        `shot:${e.id}:speech:${l.speech.id}:overlap`,
        `镜头 ${t} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function sr(e, t, r, i) {
  for (const s of e.captions)
    (!s.id.trim() || r.has(s.id)) && i.push(R(e, t, "字幕标识缺失或重复")), r.add(s.id), s.text.trim() || i.push(R(e, t, "字幕文案不能为空")), (s.start_time < 0 || s.end_time <= s.start_time || s.end_time > e.duration) && i.push(R(e, t, "字幕时间范围超出镜头"));
}
function or(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function lr(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const r of e)
    if (!t.has(r))
      return !1;
  return !0;
}
function cr(e, t) {
  return new Set(
    [...e].filter((r) => {
      const i = t.get(r)?.type;
      return i === "character" || i === "scene";
    })
  );
}
function dr(e, t) {
  return t.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1,
    lipSync: !1
  } : {
    referenceImages: kn(e),
    shotVideos: Qe(e),
    voice: Mt(e),
    subtitles: Ot(e),
    lipSync: $t(e)
  };
}
function re(e, t) {
  return { id: e, message: t, severity: "error" };
}
function ie(e, t) {
  return {
    id: `material:${e.id}:${t}`,
    message: `${e.name || "未命名素材"}：${t}`,
    severity: "error",
    materialId: e.id
  };
}
function R(e, t, r) {
  return {
    id: `shot:${e.id}:${r}`,
    message: `镜头 ${t}：${r}`,
    severity: "error",
    shotId: e.id
  };
}
function Te(e, t, r) {
  return { id: e, message: t, severity: "warning", shotId: r };
}
function gt(e, t, r) {
  return { id: e, message: t, severity: "error", shotId: r };
}
function yt(e, t, r, i, s, l) {
  const u = t.replace(/\s+/g, "").toLocaleLowerCase(), b = e.get(u);
  b ? l.push(
    Te(
      `shot:${r.id}:${s}:duplicate`,
      `镜头 ${i} 的${s}与镜头 ${b} 重复，建议审查是否有新的叙事作用`,
      r.id
    )
  ) : e.set(u, i);
}
function Vt({
  issues: e,
  onOpen: t
}) {
  const r = e.filter((l) => l.severity === "error"), i = e.filter((l) => l.severity === "warning"), s = [...r, ...i].slice(0, 5);
  return /* @__PURE__ */ a(
    "section",
    {
      className: `ws-storyboard-validation ${r.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ a("header", { children: [
          /* @__PURE__ */ n(Qn, { size: 14 }),
          /* @__PURE__ */ n("strong", { children: r.length ? `${r.length} 项需要处理` : `${i.length} 项建议检查` }),
          e.length > s.length ? /* @__PURE__ */ a("span", { children: [
            "另有 ",
            e.length - s.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ n("div", { children: s.map((l, u) => {
          const b = !!(l.materialId || l.shotId);
          return /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: !b,
              onClick: () => b && t(l),
              children: /* @__PURE__ */ n("span", { children: l.message })
            },
            `${l.id}:${u}`
          );
        }) })
      ]
    }
  );
}
const ur = [
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
function pr({
  storyboard: e,
  submitting: t,
  portalContainer: r,
  onClose: i,
  onEditIssue: s,
  onConfirm: l
}) {
  const [u, b] = P(
    () => fr(e.production_plan)
  ), _ = Cn(e), S = In(e), w = e.shots.some(
    Rn
  ), M = Q(
    () => mr(u, {
      speech: _ > 0,
      subtitles: S > 0,
      visibleDialogue: w
    }),
    [w, u, _, S]
  ), m = Q(
    () => ({ ...e, production_plan: M }),
    [M, e]
  ), N = Q(
    () => Bt(m),
    [m]
  ), E = N.some(
    (v) => v.severity === "error"
  ), F = Q(
    () => hr(m),
    [m]
  ), $ = Qe(
    m
  );
  G(() => {
    const v = (g) => {
      g.key === "Escape" && !t && i();
    };
    return window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v);
  }, [i, t]);
  const A = (v, g) => {
    b((T) => ({
      ...T,
      [v]: g ? "auto" : "off"
    }));
  }, d = async () => {
    if (E) return;
    await l(M) && i();
  };
  return Xe(
    /* @__PURE__ */ n(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          t || i();
        },
        children: /* @__PURE__ */ a(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (v) => v.stopPropagation(),
            children: [
              /* @__PURE__ */ a("header", { children: [
                /* @__PURE__ */ a("div", { children: [
                  /* @__PURE__ */ n("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ n("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: t,
                    onClick: i,
                    children: /* @__PURE__ */ n(Ze, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ a("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ a("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ n("strong", { children: e.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ a("span", { children: [
                    e.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ a("span", { children: [
                    Dt(e),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ a("span", { children: [
                    _,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ a("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ n("legend", { children: "产出目标" }),
                  /* @__PURE__ */ n("div", { className: "ws-storyboard-output-options", children: ur.map((v) => /* @__PURE__ */ a(
                    "label",
                    {
                      className: u.output_target === v.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: v.value,
                            checked: u.output_target === v.value,
                            disabled: t,
                            onChange: () => b((g) => ({
                              ...g,
                              output_target: v.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ a("span", { children: [
                          /* @__PURE__ */ n("strong", { children: v.title }),
                          /* @__PURE__ */ n("small", { children: v.description })
                        ] }),
                        u.output_target === v.value ? /* @__PURE__ */ n(me, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    v.value
                  )) })
                ] }),
                $ ? /* @__PURE__ */ a("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ n("legend", { children: "附加内容" }),
                  /* @__PURE__ */ n(
                    Ue,
                    {
                      title: "配音",
                      description: _ > 0 ? `按脚本中的 ${_} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: _ > 0 && u.voice_mode === "auto",
                      disabled: t || _ === 0,
                      onChange: (v) => A("voice_mode", v)
                    }
                  ),
                  /* @__PURE__ */ n(
                    Ue,
                    {
                      title: "字幕",
                      description: S > 0 ? `按脚本中的 ${S} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: S > 0 && u.subtitle_mode === "auto",
                      disabled: t || S === 0,
                      onChange: (v) => A("subtitle_mode", v)
                    }
                  ),
                  /* @__PURE__ */ n(
                    Ue,
                    {
                      title: "口型同步",
                      description: w ? "仅对出镜对白创建口型同步，默认关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: w && u.voice_mode === "auto" && u.lip_sync_mode === "auto",
                      disabled: t || !w || u.voice_mode !== "auto",
                      onChange: (v) => A("lip_sync_mode", v)
                    }
                  )
                ] }) : null,
                N.length ? /* @__PURE__ */ n(
                  Vt,
                  {
                    issues: N,
                    onOpen: s
                  }
                ) : null,
                /* @__PURE__ */ a("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ a("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ n("strong", { children: "制作流程" }),
                    /* @__PURE__ */ n("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ n("div", { className: "ws-storyboard-production-flow", children: F.map((v, g) => /* @__PURE__ */ a("span", { children: [
                    g > 0 ? /* @__PURE__ */ n("i", { "aria-hidden": "true", children: "/" }) : null,
                    v
                  ] }, v)) })
                ] })
              ] }),
              /* @__PURE__ */ a("footer", { children: [
                /* @__PURE__ */ n("button", { type: "button", disabled: t, onClick: i, children: "返回修改" }),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: t || E,
                    onClick: () => {
                      d();
                    },
                    children: [
                      t ? /* @__PURE__ */ n(Re, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ n(me, { size: 15 }),
                      t ? "创建中" : br(u.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    r || document.body
  );
}
function Ue({
  title: e,
  description: t,
  checked: r,
  disabled: i,
  onChange: s
}) {
  return /* @__PURE__ */ a("label", { className: `ws-storyboard-production-switch${i ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ a("span", { children: [
      /* @__PURE__ */ n("strong", { children: e }),
      /* @__PURE__ */ n("small", { children: t })
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        checked: r,
        disabled: i,
        onChange: (l) => s(l.target.checked)
      }
    ),
    /* @__PURE__ */ n("i", { "aria-hidden": "true" })
  ] });
}
function mr(e, t) {
  if (!["shot_videos", "final_video"].includes(e.output_target))
    return {
      ...e,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const r = t.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: r,
    subtitle_mode: t.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: t.visibleDialogue && r === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function hr(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const t = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return Qe(e) && t.push("镜头视频"), Mt(e) && t.push("配音"), Ot(e) && t.push("字幕"), $t(e) && t.push("口型同步"), On(e) && t.push("视频合成"), t;
}
function fr(e) {
  const t = $n(e);
  return t.output_target === "storyboard_only" ? { ...t, output_target: "shot_images" } : t;
}
function br(e) {
  return e === "shot_images" ? "创建参考图" : e === "shot_videos" ? "创建镜头视频" : "完成视频";
}
function gr({
  storyboard: e,
  referenceItems: t,
  editable: r,
  disabled: i,
  onChange: s
}) {
  const l = zt(t);
  if (e.references.length === 0)
    return null;
  const u = (b, _, S = !1) => {
    let w = S ? Ut(e, b) : e;
    if (w = {
      ...w,
      references: w.references.map(
        (M) => M.key === b ? { ...M, ..._ } : M
      )
    }, S) {
      const M = w.references.find((N) => N.key === b), m = M ? vt(w, M) : [];
      m.length === 1 && (w = _t(w, b, m[0].value));
    }
    s(w);
  };
  return /* @__PURE__ */ a("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ n(er, { size: 14 }),
      /* @__PURE__ */ n("strong", { children: "参考素材" }),
      /* @__PURE__ */ a("span", { children: [
        e.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-storyboard-reference-list", children: e.references.map((b) => {
      const _ = vt(
        e,
        b
      ), S = vr(e, b.key);
      return /* @__PURE__ */ a("div", { className: "ws-storyboard-reference-row", children: [
        /* @__PURE__ */ n(
          Yn,
          {
            className: "ws-storyboard-reference-asset",
            value: `@${b.label}`,
            content: yr(b),
            adapter: l
          }
        ),
        r ? /* @__PURE__ */ a(qe, { children: [
          /* @__PURE__ */ n(
            "select",
            {
              className: "nodrag nopan",
              value: b.purpose,
              disabled: i,
              "aria-label": `${b.label}的参考用途`,
              onChange: (w) => u(
                b.key,
                {
                  purpose: w.target.value
                },
                !0
              ),
              children: Mn(b.kind).map(
                (w) => /* @__PURE__ */ n("option", { value: w.value, children: w.label }, w.value)
              )
            }
          ),
          wt(b.purpose) ? /* @__PURE__ */ a(
            "select",
            {
              className: "nodrag nopan",
              value: S,
              disabled: i,
              "aria-label": `${b.label}的关联目标`,
              onChange: (w) => s(
                _t(
                  e,
                  b.key,
                  w.target.value
                )
              ),
              children: [
                /* @__PURE__ */ n("option", { value: "", children: "选择关联目标" }),
                _.map((w) => /* @__PURE__ */ n("option", { value: w.value, children: w.label }, w.value))
              ]
            }
          ) : /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-global", children: "全局应用" }),
          /* @__PURE__ */ n(
            "input",
            {
              className: "nodrag nopan",
              value: b.instruction,
              disabled: i,
              "aria-label": `${b.label}的补充说明`,
              placeholder: "补充说明（可选）",
              onChange: (w) => u(b.key, {
                instruction: w.target.value
              })
            }
          )
        ] }) : /* @__PURE__ */ a(qe, { children: [
          /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-purpose", children: xn[b.purpose] }),
          /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-target", children: _r(e, S) || (wt(b.purpose) ? "未关联" : "全局应用") }),
          b.instruction ? /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-instruction", children: b.instruction }) : null
        ] })
      ] }, b.key);
    }) })
  ] });
}
function yr(e) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: e.asset_id,
        label: e.label,
        ref_trigger: "@",
        ref_version_id: e.version_id
      }
    ]
  };
}
function vt(e, t) {
  return Ft(t.purpose) ? e.materials.filter((r) => r.type === t.purpose).map((r) => ({
    value: `material:${r.id}`,
    label: r.name
  })) : t.purpose === "shot" ? e.shots.map((r, i) => ({
    value: `shot:${r.id}`,
    label: `镜头 ${r.order || i + 1}`
  })) : [];
}
function vr(e, t) {
  const r = e.materials.find(
    (s) => s.reference_keys.includes(t)
  );
  if (r)
    return `material:${r.id}`;
  const i = e.shots.find(
    (s) => s.reference_keys.includes(t)
  );
  return i ? `shot:${i.id}` : "";
}
function _r(e, t) {
  const [r, i] = t.split(":", 2);
  if (r === "material")
    return e.materials.find((s) => s.id === i)?.name || "";
  if (r === "shot") {
    const s = e.shots.findIndex((l) => l.id === i);
    return s >= 0 ? `镜头 ${e.shots[s].order || s + 1}` : "";
  }
  return "";
}
function _t(e, t, r) {
  const i = Ut(e, t);
  if (!r)
    return i;
  const [s, l] = r.split(":", 2);
  return s === "material" ? {
    ...i,
    materials: i.materials.map(
      (u) => u.id === l ? {
        ...u,
        reference_keys: [...u.reference_keys, t]
      } : u
    )
  } : s === "shot" ? {
    ...i,
    shots: i.shots.map(
      (u) => u.id === l ? { ...u, reference_keys: [...u.reference_keys, t] } : u
    )
  } : i;
}
function Ut(e, t) {
  return {
    ...e,
    materials: e.materials.map((r) => ({
      ...r,
      reference_keys: r.reference_keys.filter(
        (i) => i !== t
      )
    })),
    shots: e.shots.map((r) => ({
      ...r,
      reference_keys: r.reference_keys.filter((i) => i !== t)
    }))
  };
}
function Ft(e) {
  return e === "character" || e === "scene" || e === "prop";
}
function wt(e) {
  return Ft(e) || e === "shot";
}
function wi(e, t) {
  const r = Nr(e, t), i = Et(r);
  if (i)
    return {
      mode: "storyboard_grid",
      value: i,
      format: "json",
      summary: Yt(i),
      downloadUrl: ""
    };
  const s = Dn(r);
  if (s)
    return {
      mode: "storyboard",
      value: s,
      format: "json",
      summary: Tt(s),
      downloadUrl: ""
    };
  const l = Wt(r);
  if (l) {
    const w = Mr(r) ? null : Jn(l);
    return w && (e.kind === "text" || Kn(w.plainText)) ? Fe(w.markdown) : St(l);
  }
  const u = Je(r);
  if (u)
    return {
      mode: "file",
      value: u,
      format: "json",
      summary: u.description || u.name || "文件内容",
      downloadUrl: u.url
    };
  const b = $r(r);
  if (b)
    return Fe(b);
  const _ = kr(r);
  if (_)
    return St(_);
  const S = Ke(r) || e.description || "";
  return Fe(S);
}
function wr(e, t, r = {}) {
  const i = r.includeNodeResult === !1 ? t?.content : Wn(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ht(e, "result", "output")
  ), s = X(i);
  if (Et(s))
    return;
  const l = Hn(s);
  for (const b of [s, X(l)])
    if (Gn(b))
      return Sr(b);
  const u = Rr(e.kind, s);
  if (u)
    return u;
}
function Sr(e) {
  const r = Pt(e).map((i) => {
    if (!te(i) || i.json === void 0)
      return i;
    const s = { ...i };
    return delete s.json, s;
  });
  return r.length === 1 ? r[0] : r;
}
function Nr(e, t) {
  return Xn(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ht(e, "result", "output"),
    e.description
  );
}
function jt(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return Ir(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : Ie(X(t)) || Or(t);
}
function Si(e) {
  return Lt(jt(e));
}
function Ni(e, t) {
  const r = { ...e, value: t };
  if (r.mode === "storyboard")
    r.summary = Tt(t);
  else if (r.mode === "storyboard_grid")
    r.summary = Yt(t);
  else if (r.mode === "file") {
    const i = t;
    r.summary = i.description || i.name || "文件内容", r.downloadUrl = i.url;
  } else
    r.summary = et(At(jt(r)));
  return r;
}
function Yt(e) {
  return he(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function St(e) {
  const t = At(e);
  return {
    mode: "rich",
    value: Lt(e),
    format: "json",
    summary: et(t),
    downloadUrl: qt(e)
  };
}
function Fe(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: et(e),
    downloadUrl: ""
  };
}
function kr(e) {
  if (typeof e == "string" && X(e) === e)
    return null;
  const t = Pt(e), r = [];
  return Ge(
    t,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : Ie({ type: "doc", content: r });
}
function Ge(e, t, r, i, s, l) {
  if (e == null || l > 12)
    return;
  const u = X(e);
  if (typeof u == "string") {
    Nt(t, u, i);
    return;
  }
  if (Array.isArray(u)) {
    u.forEach(
      (_) => Ge(
        _,
        t,
        r,
        i,
        s,
        l + 1
      )
    );
    return;
  }
  if (!te(u) || r.has(u))
    return;
  r.add(u);
  const b = Wt(u);
  if (b) {
    for (const _ of b.content || [])
      t.push(_);
    return;
  }
  Nt(
    t,
    he(u.title, u.text),
    i
  ), Cr(u, t, s);
  for (const _ of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    u[_] !== void 0 && Ge(
      u[_],
      t,
      r,
      i,
      s,
      l + 1
    );
}
function Cr(e, t, r) {
  const i = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const s of i)
    for (const l of s.values)
      for (const u of $e(l)) {
        const b = `${s.kind}:${u}`;
        r.has(b) || (r.add(b), t.push({
          type: xr(s.kind),
          attrs: { src: u }
        }));
      }
}
function Nt(e, t, r) {
  const i = String(t || "").trim();
  !i || Jt(i) || tt(i) || r.has(i) || (r.add(i), e.push({
    type: "paragraph",
    content: [{ type: "text", text: i }]
  }));
}
function $e(e) {
  return Array.isArray(e) ? e.flatMap($e) : typeof e == "string" ? Jt(e.trim()) ? [e.trim()] : [] : te(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap($e) : [];
}
function Je(e) {
  const t = X(e);
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = Je(i);
      if (s)
        return s;
    }
    return null;
  }
  if (!te(t))
    return null;
  const r = Dr(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (r)
    return {
      url: r,
      name: he(t.name, t.filename, t.title) || Gt(r),
      description: he(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const i of ["content", "output", "result", "data", "body", "value"])
    if (t[i] !== void 0) {
      const s = Je(t[i]);
      if (s)
        return s;
    }
  return null;
}
function Ir(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || Gt(e.url),
    description: e.description.trim()
  };
}
function Rr(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const r = $e(t);
  if (r.length !== 0)
    return {
      [`${e}s`]: r
    };
}
function Ke(e) {
  const t = X(e);
  if (typeof t == "string")
    return tt(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(Ke).filter(Boolean).join(`

`);
  if (!te(t))
    return "";
  const r = he(
    t.text,
    t.summary,
    t.description
  );
  if (r)
    return r;
  for (const i of ["content", "output", "result", "data", "body", "value"])
    if (t[i] !== void 0) {
      const s = Ke(t[i]);
      if (s)
        return s;
    }
  return "";
}
function $r(e) {
  const t = X(e);
  return typeof t == "string" ? tt(t) ? "" : t : te(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? he(t.text, t.markdown) : "";
}
function Or(e) {
  const t = e.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function qt(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const r = qt(t);
    if (r)
      return r;
  }
  return "";
}
function Wt(e) {
  const t = X(e);
  if (!te(t))
    return null;
  if (String(t.type || "") === "doc")
    return Ie(t);
  const r = Object.keys(t).filter((i) => i !== "format");
  return r.length === 1 && r[0] === "rich" ? Ie(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? Ie(t.rich ?? t.content) : null;
}
function Mr(e) {
  const t = X(e);
  return te(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function xr(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Dr(...e) {
  for (const t of e) {
    const r = $e(t)[0];
    if (r)
      return r;
  }
  return "";
}
function Ht(e, ...t) {
  let r = e;
  for (const i of t) {
    if (!te(r))
      return;
    r = r[i];
  }
  return r;
}
function Gt(e) {
  const r = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function et(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function Jt(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function tt(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Tr({
  storyboard: e,
  sourceNodeId: t,
  canvasNodes: r
}) {
  const i = Kt(e, t, r);
  return /* @__PURE__ */ n("div", { className: "ws-storyboard-board", "aria-label": "画面预览", children: i.map(({ shot: s, node: l, imageURL: u }) => /* @__PURE__ */ a("article", { className: "ws-storyboard-frame", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ n("strong", { children: String(s.order).padStart(2, "0") }),
      /* @__PURE__ */ a("span", { children: [
        s.duration,
        " 秒"
      ] }),
      /* @__PURE__ */ n("span", { children: Er(s) })
    ] }),
    /* @__PURE__ */ n(
      "div",
      {
        className: "ws-storyboard-frame-media",
        style: { aspectRatio: Ar(e) },
        children: u ? /* @__PURE__ */ n("a", { href: u, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ n(
          "img",
          {
            src: u,
            alt: `镜头 ${s.order} 故事板`,
            loading: "lazy",
            decoding: "async"
          }
        ) }) : /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-empty", children: [
          /* @__PURE__ */ n(nr, { size: 22 }),
          /* @__PURE__ */ n("span", { children: Pr(s, l) })
        ] })
      }
    ),
    /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-copy", children: [
      /* @__PURE__ */ n("strong", { children: s.beat }),
      /* @__PURE__ */ n("span", { children: s.camera_instruction || "固定机位" }),
      /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-continuity", children: [
        /* @__PURE__ */ a("p", { children: [
          /* @__PURE__ */ n("b", { children: "入" }),
          /* @__PURE__ */ n("span", { children: s.continuity_state.entry })
        ] }),
        /* @__PURE__ */ a("p", { children: [
          /* @__PURE__ */ n("b", { children: "出" }),
          /* @__PURE__ */ n("span", { children: s.continuity_state.exit })
        ] })
      ] }),
      l?.runError ? /* @__PURE__ */ n("small", { children: l.runError }) : null
    ] })
  ] }, s.id)) });
}
function zr(e, t, r) {
  return Kt(e, t, r).some(
    (i) => !!i.imageURL
  );
}
function Kt(e, t, r) {
  const i = /* @__PURE__ */ new Map();
  for (const s of r) {
    const l = s.storyboardItem;
    l?.sourceNodeId === t && l.itemType === "shot_image" && l.shotId && i.set(l.shotId, s);
  }
  return e.shots.map((s) => {
    const l = i.get(s.id), u = l ? wr(l) : void 0, b = u && Zn(u, "image")[0] || "";
    return { shot: s, node: l, imageURL: b };
  });
}
function Er(e) {
  return e.continue_previous ? "尾帧续接" : e.match_previous ? "画面匹配" : "新镜头";
}
function Pr(e, t) {
  return t?.runError ? "生成失败" : t ? "暂无结果" : e.continue_previous ? "沿用上一镜尾帧" : "待生成";
}
function Ar(e) {
  return e.aspect_ratio.replace(":", " / ");
}
const Lr = Sn.AssistantTaskPopover, Br = [], Vr = [], Ur = [
  {
    value: "independent",
    label: "独立切镜",
    description: "新构图或新状态"
  },
  {
    value: "match",
    label: "画面匹配",
    description: "沿用上一镜结束画面"
  },
  {
    value: "continue",
    label: "动作续接",
    description: "从上一段真实尾帧继续"
  }
];
function Fr({
  storyboard: e,
  layout: t = "stacked",
  editable: r = !1,
  disabled: i = !1,
  onSave: s,
  onChange: l,
  onConfirm: u,
  onCreateRevision: b,
  onGenerateShot: _,
  workflowAction: S = "",
  saveStatus: w,
  showSaveStatus: M = !0,
  showMetrics: m = !0,
  referenceItems: N = Br,
  storyboardSourceNodeId: E = "",
  canvasNodes: F = Vr,
  focus: $
}) {
  const A = Q(
    () => JSON.stringify(e),
    [e]
  ), [d, v] = P(e), [g, T] = P("saved"), [z, V] = P(""), [D, O] = P(""), [U, j] = P(null), [fe, H] = P(!1), [J, le] = P("script"), [ae, be] = P(""), [ze, ge] = P(""), [o, f] = P([]), [p, C] = P(
    "before"
  ), L = W(null), x = L.current?.closest(".wb-detail-backdrop, .ws-page") || null, se = W(""), K = W([]), nt = W(/* @__PURE__ */ new Map()), ce = W(/* @__PURE__ */ new Map()), Ee = W(e), Oe = W(!1), ye = W(0), rt = W(A), Z = W(null), it = W(Promise.resolve()), ve = W(!0), _e = !!l, y = _e ? e : d, Me = Tn(y), B = r && !i && !Me && !S && !!(l || s), at = B && !_e && !!s, st = zt(N), we = y.shots.find((c) => c.id === z), Pe = y.shots.findIndex(
    (c) => c.id === z
  ), Qt = Pe > 0 ? y.shots[Pe - 1] : void 0, Ae = y.materials.find(
    (c) => c.id === D
  ), de = Ae || U, en = de ? mt(y, de.id) : void 0, tn = Q(
    () => pt(y.shots, o, (c) => c.id),
    [y.shots, o]
  ), Le = Q(
    () => Bt(y, { coreOnly: !0 }),
    [y]
  ), nn = Le.some(
    (c) => c.severity === "error"
  ), ot = (c) => {
    if (c.materialId) {
      V(""), j(null), O(c.materialId);
      return;
    }
    c.shotId && (O(""), j(null), V(c.shotId));
  }, xe = Q(
    () => !!E && zr(y, E, F),
    [F, y, E]
  ), rn = Q(
    () => y.shots.some(
      (c) => c.speech.some(
        (h) => h.kind === "narration" && !!h.text.trim()
      )
    ),
    [y.shots]
  );
  G(() => (ve.current = !0, () => {
    ve.current = !1, Z.current && window.clearTimeout(Z.current);
  }), []), G(
    () => () => {
      for (const c of ce.current.values())
        c.cancel();
      ce.current.clear();
    },
    []
  ), bn(() => {
    const c = nt.current, h = L.current;
    if (!h || c.size === 0)
      return;
    const I = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    h.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((k) => {
      if (k.classList.contains("is-dragging"))
        return;
      const Y = k.dataset.sequenceItemId || "", ne = c.get(Y);
      if (!ne || I)
        return;
      const Be = k.getBoundingClientRect(), Se = ne.left - Be.left, ue = ne.top - Be.top;
      if (Math.abs(Se) < 1 && Math.abs(ue) < 1)
        return;
      ce.current.get(Y)?.cancel();
      const Ne = k.animate(
        [
          { transform: `translate3d(${Se}px, ${ue}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      ce.current.set(Y, Ne), Ne.onfinish = () => {
        ce.current.get(Y) === Ne && ce.current.delete(Y);
      };
    }), c.clear();
  }, [o]), G(() => {
    rt.current !== A && (rt.current = A, !Oe.current && (Ee.current = e, v(e), T("saved")));
  }, [A, e]), G(() => {
    z && !we && V("");
  }, [we, z]), G(() => {
    D && !Ae && O("");
  }, [Ae, D]), G(() => {
    !xe && J === "board" && le("script");
  }, [J, xe]), G(() => {
    if (!$)
      return;
    if ($.materialId && y.materials.some((h) => h.id === $.materialId)) {
      j(null), V(""), O($.materialId);
      return;
    }
    if ($.shotId && y.shots.some((h) => h.id === $.shotId)) {
      j(null), O(""), V($.shotId);
      return;
    }
    const c = window.requestAnimationFrame(() => {
      const h = $.materialType ? `[data-storyboard-material-type="${$.materialType}"]` : $.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      L.current?.querySelector(h)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(c);
  }, [
    $?.materialId,
    $?.materialType,
    $?.section,
    $?.shotId
  ]), G(() => {
    if (!at || !Oe.current || !s)
      return;
    Z.current && window.clearTimeout(Z.current);
    const c = y, h = ye.current;
    return Z.current = window.setTimeout(() => {
      Z.current = null, it.current = it.current.catch(() => {
      }).then(async () => {
        ve.current && h === ye.current && T("saving");
        try {
          if (await s(c), !ve.current || h !== ye.current)
            return;
          Oe.current = !1, T("saved");
        } catch {
          if (!ve.current || h !== ye.current)
            return;
          T("error");
        }
      });
    }, 800), () => {
      Z.current && (window.clearTimeout(Z.current), Z.current = null);
    };
  }, [at, y, s]);
  const q = (c) => {
    if (!B)
      return;
    const h = _e ? e : Ee.current, I = c(h), k = qr(
      An(Ln(h, I)),
      st.options
    );
    if (Ee.current = k, _e) {
      l?.(k);
      return;
    }
    Oe.current = !0, ye.current += 1, v(k), T("typing");
  }, lt = () => {
    const c = L.current;
    if (!c)
      return;
    const h = /* @__PURE__ */ new Map();
    c.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((I) => {
      const k = I.dataset.sequenceItemId || "";
      k && h.set(k, I.getBoundingClientRect());
    }), nt.current = h;
  }, an = (c) => {
    const h = y.shots.map((I) => I.id);
    se.current = c, K.current = h, be(c), ge(""), f(h);
  }, sn = (c, h) => {
    const I = se.current, k = K.current;
    if (!I || !c || I === c || !k.length || !k.includes(I) || !k.includes(c))
      return;
    const Y = h.currentTarget.getBoundingClientRect(), ne = h.currentTarget.parentElement?.getBoundingClientRect(), Se = !!(ne && Y.width * 1.5 < ne.width) ? h.clientX < Y.left + Y.width / 2 ? "before" : "after" : h.clientY < Y.top + Y.height / 2 ? "before" : "after", ue = vn(
      k,
      I,
      c,
      Se,
      (Ne) => Ne
    );
    ge(c), C(Se), !Ve(k, ue) && (lt(), K.current = ue, f(ue));
  }, ct = () => {
    const c = K.current, h = y.shots.map((I) => I.id);
    c.length > 0 && !Ve(c, h) && lt(), se.current = "", K.current = [], be(""), ge(""), f([]);
  }, on = () => {
    const c = K.current;
    c.length > 0 && q((h) => {
      const I = pt(h.shots, c, (k) => k.id);
      return Ve(
        h.shots.map((k) => k.id),
        I.map((k) => k.id)
      ) ? h : { ...h, shots: I };
    }), ct();
  }, ln = (c, h) => {
    q((I) => ({
      ...I,
      materials: h,
      shots: I.shots.map(
        (k) => k.id === c.id ? c : k
      )
    })), V("");
  }, cn = (c) => {
    q((h) => {
      const I = h.materials.some((k) => k.id === c.id);
      return {
        ...h,
        materials: I ? h.materials.map(
          (k) => k.id === c.id ? c : k
        ) : [...h.materials, c]
      };
    }), O(""), j(null);
  }, dn = (c) => {
    O(""), j(Bn(y.materials, c));
  }, un = (c) => {
    const h = mt(y, c);
    h.shotIds.length || h.speechIds.length || (q((I) => ({
      ...I,
      materials: I.materials.filter((k) => k.id !== c)
    })), O(""), j(null));
  }, pn = (c) => {
    q((h) => h.shots.length <= 1 ? h : {
      ...h,
      shots: h.shots.filter((I) => I.id !== c)
    });
  }, mn = (c) => {
    q((h) => {
      if (h.shots.length >= Ce)
        return h;
      const I = ei(h.shots, c), k = h.shots.findIndex((ne) => ne.id === c.id), Y = [...h.shots];
      return Y.splice(k + 1, 0, I), { ...h, shots: Y };
    });
  }, hn = () => {
    q((c) => c.shots.length >= Ce ? c : {
      ...c,
      shots: [...c.shots, Xt(c.shots)]
    });
  };
  return /* @__PURE__ */ a(
    "section",
    {
      ref: L,
      className: `ws-storyboard is-${t} ${B ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ a("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ a("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ a("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ a("header", { children: [
                /* @__PURE__ */ n(We, { size: 14 }),
                /* @__PURE__ */ n("strong", { children: "内容简介" })
              ] }),
              /* @__PURE__ */ n("p", { children: zn(y) })
            ] }),
            /* @__PURE__ */ a("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ n(
                gr,
                {
                  storyboard: y,
                  referenceItems: N,
                  editable: B,
                  disabled: i,
                  onChange: (c) => q(() => c)
                }
              ),
              /* @__PURE__ */ n("section", { className: "ws-storyboard-basic-settings", children: /* @__PURE__ */ a("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ a("label", { children: [
                  /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(ee, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ n("span", { children: "画面类型" }) }) }),
                  B ? /* @__PURE__ */ n(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: y.visual_mode,
                      disabled: i,
                      onChange: (c) => q((h) => ({
                        ...h,
                        visual_mode: c.target.value
                      })),
                      children: En.map((c) => /* @__PURE__ */ n("option", { value: c, children: ht[c] }, c))
                    }
                  ) : /* @__PURE__ */ n("span", { children: ht[y.visual_mode] })
                ] }),
                /* @__PURE__ */ a("label", { children: [
                  /* @__PURE__ */ n("strong", { children: "画幅" }),
                  B ? /* @__PURE__ */ n(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: y.aspect_ratio,
                      disabled: i,
                      onChange: (c) => q((h) => ({
                        ...h,
                        aspect_ratio: c.target.value
                      })),
                      children: Pn.map((c) => /* @__PURE__ */ n("option", { value: c, children: c }, c))
                    }
                  ) : /* @__PURE__ */ n("span", { children: y.aspect_ratio })
                ] }),
                rn || y.narrator_voice ? /* @__PURE__ */ a("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ n("strong", { children: "旁白音色" }),
                  B ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: y.narrator_voice,
                      placeholder: "能力默认",
                      disabled: i,
                      onChange: (c) => q((h) => ({
                        ...h,
                        narrator_voice: c.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ n("span", { children: y.narrator_voice || "能力默认" })
                ] }) : null,
                /* @__PURE__ */ a("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ n("strong", { children: "统一视觉风格" }),
                  B ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: y.style_prompt,
                      placeholder: "可选，整部作品保持一致的画面风格",
                      disabled: i,
                      onChange: (c) => q(
                        (h) => jn(
                          h,
                          c.target.value
                        )
                      )
                    }
                  ) : /* @__PURE__ */ n(ee, { label: y.style_prompt, children: /* @__PURE__ */ n("span", { children: y.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] }) }),
              y.materials.length || B ? /* @__PURE__ */ n(
                jr,
                {
                  materials: y.materials,
                  editable: B,
                  onOpen: O,
                  onCreate: dn
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ a("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ n("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ a("div", { className: "ws-storyboard-toolbar-end", children: [
              xe ? /* @__PURE__ */ a("div", { className: "ws-storyboard-view-tabs", role: "tablist", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": J === "script",
                    className: J === "script" ? "is-active" : "",
                    onClick: () => le("script"),
                    children: "分镜脚本"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": J === "board",
                    className: J === "board" ? "is-active" : "",
                    onClick: () => le("board"),
                    children: "画面预览"
                  }
                )
              ] }) : null,
              m || B && M ? /* @__PURE__ */ a("div", { className: "ws-storyboard-toolbar-meta", children: [
                m ? /* @__PURE__ */ a("span", { children: [
                  y.shots.length,
                  " 个镜头 ·",
                  " ",
                  Dt(y),
                  " 秒 · ",
                  y.aspect_ratio
                ] }) : null,
                B && M ? /* @__PURE__ */ n(
                  Gr,
                  {
                    status: _e ? w || "saved" : g
                  }
                ) : null
              ] }) : null,
              B ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: i || y.shots.length >= Ce,
                  onClick: hn,
                  children: [
                    /* @__PURE__ */ n(ke, { size: 13 }),
                    /* @__PURE__ */ n("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              Me && b ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: i || !!S,
                  onClick: () => {
                    b();
                  },
                  children: [
                    S === "revising" ? /* @__PURE__ */ n(Re, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(gn, { size: 13 }),
                    S === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !Me && B && u ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: i || !!S || nn,
                  onClick: () => H(!0),
                  children: [
                    S === "confirming" ? /* @__PURE__ */ n(Re, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(me, { size: 13 }),
                    S === "confirming" ? "确认中" : "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            J === "script" && B && Le.length ? /* @__PURE__ */ n(
              Vt,
              {
                issues: Le,
                onOpen: ot
              }
            ) : null,
            J === "board" && xe ? /* @__PURE__ */ n(
              Tr,
              {
                storyboard: y,
                sourceNodeId: E,
                canvasNodes: F
              }
            ) : /* @__PURE__ */ n("div", { className: "ws-storyboard-grid nowheel", children: y.shots.length ? tn.map((c, h) => /* @__PURE__ */ n(
              yn,
              {
                shot: c,
                index: h,
                storyboard: y,
                selected: z === c.id,
                editable: B,
                dragging: ae === c.id,
                dropPlacement: ze === c.id && ae !== c.id ? p : void 0,
                onOpen: () => V(c.id),
                onDuplicate: () => mn(c),
                onRemove: () => pn(c.id),
                onDragStart: () => an(c.id),
                onDragOver: (I) => sn(c.id, I),
                onDrop: on,
                onDragEnd: ct
              },
              c.id
            )) : /* @__PURE__ */ a("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ n(We, { size: 26 }),
              /* @__PURE__ */ n("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ n("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        fe && u && !Me ? /* @__PURE__ */ n(
          pr,
          {
            storyboard: y,
            submitting: S === "confirming",
            portalContainer: x,
            onClose: () => H(!1),
            onEditIssue: (c) => {
              H(!1), ot(c);
            },
            onConfirm: (c) => u(y, c)
          }
        ) : null,
        we ? /* @__PURE__ */ n(
          Yr,
          {
            shot: we,
            index: Pe,
            previousShot: Qt,
            storyboard: y,
            materials: y.materials,
            readonly: !B,
            referenceAdapter: st,
            portalContainer: x,
            onEditMaterial: O,
            onGenerate: _,
            onSave: ln,
            onClose: () => V("")
          },
          we.id
        ) : null,
        de ? /* @__PURE__ */ n(
          rr,
          {
            material: de,
            creating: !!U,
            readonly: !B,
            usage: en,
            existingNames: y.materials.filter((c) => c.id !== de.id).map((c) => c.name),
            portalContainer: x,
            onSave: cn,
            onRemove: un,
            onClose: () => {
              O(""), j(null);
            }
          },
          `${U ? "create" : "edit"}:${de.id}`
        ) : null
      ]
    }
  );
}
function jr({
  materials: e,
  editable: t,
  onOpen: r,
  onCreate: i
}) {
  return /* @__PURE__ */ a("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ n("strong", { children: "素材设定" }),
      t ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((s) => /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => i(s),
          children: [
            /* @__PURE__ */ n(ke, { size: 11 }),
            oe[s]
          ]
        },
        s
      )) }) : null
    ] }),
    /* @__PURE__ */ a("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((s) => {
        const l = e.filter(
          (u) => u.type === s
        );
        return l.length ? /* @__PURE__ */ a(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": s,
            children: [
              /* @__PURE__ */ n("span", { children: oe[s] }),
              l.map((u) => /* @__PURE__ */ n(
                ee,
                {
                  label: `${t ? "编辑" : "查看"}${oe[s]}提示词：${u.name}`,
                  children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => r(u.id),
                      children: [
                        /* @__PURE__ */ n("span", { children: u.name }),
                        t ? /* @__PURE__ */ n(kt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                u.id
              ))
            ]
          },
          s
        ) : null;
      }),
      e.length ? null : /* @__PURE__ */ n("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Yr({
  shot: e,
  index: t,
  previousShot: r,
  storyboard: i,
  materials: s,
  readonly: l,
  referenceAdapter: u,
  portalContainer: b,
  onEditMaterial: _,
  onGenerate: S,
  onSave: w,
  onClose: M
}) {
  const [m, N] = P(() => Zt(e)), [E, F] = P(() => s), [$, A] = P(!1);
  G(() => {
    F((o) => {
      const f = new Set(s.map((p) => p.id));
      return [
        ...s,
        ...o.filter((p) => !f.has(p.id))
      ];
    });
  }, [s]);
  const d = new Set(
    s.map((o) => o.id)
  ), v = E.filter(
    (o) => o.type === "character"
  ), g = new Set(
    m.speech.filter((o) => o.kind === "dialogue").map((o) => o.character_id || "").filter(Boolean)
  ), T = xt(m), z = It(m, t), V = Kr(m), D = m.speech.some(
    (o) => o.start_time < 0 || o.start_time >= m.duration
  ), O = !m.continuity_state.entry.trim() || !m.continuity_state.exit.trim() || z && m.continuity_state.entry.trim() !== r?.continuity_state.exit.trim() || t > 0 && (m.continue_previous && !m.continuity_anchor.trim() || m.continue_previous && m.match_previous), U = !m.beat.trim() || t > 0 && !m.transition.trim(), j = m.captions.some(
    (o) => !o.text.trim() || o.start_time < 0 || o.end_time <= o.start_time || o.end_time > m.duration
  ), fe = (o, f, p) => {
    N((C) => ({
      ...C,
      ...Hr(C, o, f, p)
    }));
  }, H = (o, f) => {
    N((p) => {
      const C = p.speech.map(
        (x) => x.id === o ? Jr(x, f) : x
      ), L = C.filter((x) => x.kind === "dialogue").map((x) => x.character_id || "").filter(Boolean);
      return {
        ...p,
        material_ids: [.../* @__PURE__ */ new Set([...p.material_ids, ...L])],
        speech: C
      };
    });
  }, J = (o) => {
    N((f) => f.material_ids.includes(o) ? g.has(o) ? f : {
      ...f,
      material_ids: f.material_ids.filter((p) => p !== o)
    } : {
      ...f,
      material_ids: [...f.material_ids, o]
    });
  }, le = (o, f) => {
    N((p) => {
      const C = p.speech.findIndex(
        (K) => K.id === o
      ), L = C + f;
      if (C < 0 || L < 0 || L >= p.speech.length)
        return p;
      const x = [...p.speech], [se] = x.splice(C, 1);
      return x.splice(L, 0, se), { ...p, speech: x };
    });
  }, ae = (o, f) => {
    N((p) => ({
      ...p,
      captions: p.captions.map(
        (C) => C.id === o ? { ...C, ...f } : C
      )
    }));
  }, be = (o, f) => {
    N((p) => {
      const C = p.captions.findIndex(
        (K) => K.id === o
      ), L = C + f;
      if (C < 0 || L < 0 || L >= p.captions.length)
        return p;
      const x = [...p.captions], [se] = x.splice(C, 1);
      return x.splice(L, 0, se), { ...p, captions: x };
    });
  }, ze = async (o) => {
    if (!S || $)
      return !1;
    A(!0);
    try {
      const f = {
        ...i,
        materials: E,
        shots: i.shots.map(
          (C) => C.id === m.id ? m : C
        )
      }, p = await S(
        f,
        m.id,
        o.trim()
      );
      return F(p.materials), N((C) => ({
        ...p.shot,
        reference_contents: { ...C.reference_contents || {} }
      })), !0;
    } finally {
      A(!1);
    }
  }, ge = /* @__PURE__ */ n(
    "div",
    {
      className: "ws-storyboard-shot-backdrop",
      "data-slot": "dialog-layer",
      onMouseDown: (o) => {
        o.target instanceof Element && o.target.closest('[data-assistant-layer="true"]') || $ || M();
      },
      children: /* @__PURE__ */ a(
        "section",
        {
          className: "ws-storyboard-shot-dialog",
          "data-slot": "dialog-content",
          role: "dialog",
          "aria-modal": "true",
          "aria-busy": $,
          "aria-label": `${l ? "查看" : "编辑"}镜头 ${t + 1}`,
          onMouseDown: (o) => o.stopPropagation(),
          children: [
            /* @__PURE__ */ a("header", { children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ a("strong", { children: [
                  l ? "查看镜头" : "编辑镜头",
                  " ",
                  String(t + 1).padStart(2, "0")
                ] }),
                /* @__PURE__ */ n("span", { children: l ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
              ] }),
              /* @__PURE__ */ n(ee, { label: "关闭", children: /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-label": "关闭",
                  disabled: $,
                  onClick: M,
                  children: /* @__PURE__ */ n(Ze, { size: 18 })
                }
              ) })
            ] }),
            /* @__PURE__ */ a(
              "fieldset",
              {
                className: "ws-storyboard-shot-form nowheel",
                disabled: $,
                children: [
                  $ ? /* @__PURE__ */ a("div", { className: "ws-storyboard-generation-mask", role: "status", children: [
                    /* @__PURE__ */ n(Re, { size: 18, className: "ws-spin" }),
                    /* @__PURE__ */ n("span", { children: "正在生成镜头" })
                  ] }) : null,
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ n("strong", { children: "镜头内容" }),
                      /* @__PURE__ */ n("div", { children: /* @__PURE__ */ a("label", { children: [
                        "时长",
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: "number",
                            min: Vn,
                            step: 1,
                            value: m.duration,
                            disabled: l,
                            onChange: (o) => N((f) => ({
                              ...f,
                              duration: Zr(
                                o,
                                f.duration
                              )
                            }))
                          }
                        ),
                        "秒"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ a(
                      "details",
                      {
                        className: `ws-storyboard-continuity-settings${O ? " is-invalid" : ""}`,
                        open: O || void 0,
                        children: [
                          /* @__PURE__ */ a("summary", { children: [
                            /* @__PURE__ */ a("span", { children: [
                              "连续性设置",
                              /* @__PURE__ */ n("small", { children: "高级" })
                            ] }),
                            /* @__PURE__ */ n("b", { children: O ? "需要处理" : t === 0 ? "首镜" : m.continue_previous ? "动作延续" : m.match_previous ? "画面匹配" : "独立切镜" })
                          ] }),
                          /* @__PURE__ */ a("div", { children: [
                            t > 0 ? /* @__PURE__ */ n("div", { className: "ws-storyboard-continuity-modes", children: Ur.map((o) => /* @__PURE__ */ a(
                              "label",
                              {
                                className: `ws-storyboard-continuity-input${V === o.value ? " is-selected" : ""}`,
                                children: [
                                  /* @__PURE__ */ n(
                                    "input",
                                    {
                                      type: "radio",
                                      name: `storyboard-continuity-${e.id}`,
                                      value: o.value,
                                      checked: V === o.value,
                                      disabled: l,
                                      onChange: () => N(
                                        (f) => Xr(
                                          f,
                                          o.value,
                                          r
                                        )
                                      )
                                    }
                                  ),
                                  /* @__PURE__ */ a("span", { children: [
                                    /* @__PURE__ */ n("strong", { children: o.label }),
                                    /* @__PURE__ */ n("small", { children: o.description })
                                  ] })
                                ]
                              },
                              o.value
                            )) }) : null,
                            t > 0 && m.continue_previous ? /* @__PURE__ */ a("label", { className: "ws-storyboard-continuity-anchor", children: [
                              /* @__PURE__ */ n("span", { children: "连续性锚点" }),
                              /* @__PURE__ */ n(
                                "textarea",
                                {
                                  value: m.continuity_anchor,
                                  readOnly: l,
                                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                  onChange: (o) => N((f) => ({
                                    ...f,
                                    continuity_anchor: o.target.value
                                  }))
                                }
                              )
                            ] }) : null,
                            O ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "请填写入镜和出镜状态；匹配或延续上一镜时，入镜状态必须等于上一镜出镜状态；视频延续还必须填写连续性锚点。" }) : null,
                            /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                              /* @__PURE__ */ n(
                                De,
                                {
                                  label: "入镜状态",
                                  value: m.continuity_state.entry,
                                  placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                  readonly: l || z,
                                  onChange: (o) => N((f) => ({
                                    ...f,
                                    continuity_state: {
                                      ...f.continuity_state,
                                      entry: o
                                    }
                                  }))
                                }
                              ),
                              /* @__PURE__ */ n(
                                De,
                                {
                                  label: "出镜状态",
                                  value: m.continuity_state.exit,
                                  placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                  readonly: l,
                                  onChange: (o) => N((f) => ({
                                    ...f,
                                    continuity_state: {
                                      ...f.continuity_state,
                                      exit: o
                                    }
                                  }))
                                }
                              )
                            ] })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a(
                      "div",
                      {
                        className: `ws-storyboard-shot-field-row ${t === 0 ? "is-single" : ""}`,
                        children: [
                          /* @__PURE__ */ n(
                            De,
                            {
                              label: "本镜变化",
                              value: m.beat,
                              placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                              readonly: l,
                              onChange: (o) => N((f) => ({ ...f, beat: o }))
                            }
                          ),
                          t > 0 ? /* @__PURE__ */ n(
                            De,
                            {
                              label: "与上镜关系",
                              value: m.transition,
                              placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                              readonly: l,
                              onChange: (o) => N((f) => ({
                                ...f,
                                transition: o
                              }))
                            }
                          ) : null
                        ]
                      }
                    ),
                    t > 0 ? /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ a("label", { children: [
                        /* @__PURE__ */ n("span", { children: "剪辑转场" }),
                        /* @__PURE__ */ n(
                          "select",
                          {
                            value: m.transition_type,
                            disabled: l,
                            onChange: (o) => N((f) => {
                              const p = o.target.value;
                              return {
                                ...f,
                                transition_type: p,
                                transition_duration_ms: p === "none" ? 0 : Math.max(500, f.transition_duration_ms)
                              };
                            }),
                            children: Rt.map((o) => /* @__PURE__ */ n("option", { value: o, children: Un[o] }, o))
                          }
                        )
                      ] }),
                      m.transition_type !== "none" ? /* @__PURE__ */ a("label", { children: [
                        /* @__PURE__ */ n("span", { children: "转场时长" }),
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: "number",
                            min: 100,
                            max: 5e3,
                            step: 100,
                            value: m.transition_duration_ms,
                            disabled: l,
                            onChange: (o) => N((f) => ({
                              ...f,
                              transition_duration_ms: Math.min(
                                5e3,
                                Qr(
                                  o,
                                  f.transition_duration_ms,
                                  100
                                )
                              )
                            }))
                          }
                        )
                      ] }) : null
                    ] }) : null,
                    U ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
                    /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ n(
                      je,
                      {
                        label: "镜头描述",
                        value: m.description,
                        content: m.reference_contents?.description,
                        placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                        readonly: l,
                        referenceAdapter: u,
                        onChange: (o, f) => fe("description", o, f)
                      }
                    ) }),
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ n(
                        je,
                        {
                          label: "镜头语言",
                          value: m.camera_instruction,
                          content: m.reference_contents?.camera_instruction,
                          placeholder: "景别、机位和运动方式",
                          readonly: l,
                          referenceAdapter: u,
                          onChange: (o, f) => fe("camera_instruction", o, f)
                        }
                      ),
                      /* @__PURE__ */ n(
                        je,
                        {
                          label: "视频提示词",
                          value: m.video_prompt,
                          content: m.reference_contents?.video_prompt,
                          placeholder: "完整描述动作、运镜、光线与风格",
                          readonly: l,
                          referenceAdapter: u,
                          onChange: (o, f) => fe("video_prompt", o, f)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ a("div", { children: [
                      /* @__PURE__ */ n("strong", { children: "关联素材" }),
                      /* @__PURE__ */ a("span", { children: [
                        m.material_ids.length,
                        " 个素材"
                      ] })
                    ] }) }),
                    E.length ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((o) => {
                      const f = E.filter(
                        (p) => p.type === o
                      );
                      return f.length ? /* @__PURE__ */ a("fieldset", { children: [
                        /* @__PURE__ */ n("legend", { children: oe[o] }),
                        /* @__PURE__ */ n("div", { children: f.map((p) => {
                          const C = m.material_ids.includes(
                            p.id
                          ), L = g.has(p.id), x = d.has(
                            p.id
                          );
                          return /* @__PURE__ */ a(
                            "div",
                            {
                              className: "ws-storyboard-material-option",
                              children: [
                                /* @__PURE__ */ n(
                                  ee,
                                  {
                                    label: C && L ? "该角色已用于对白，不能取消关联" : C ? "取消关联" : "关联素材",
                                    children: /* @__PURE__ */ a("label", { children: [
                                      /* @__PURE__ */ n(
                                        "input",
                                        {
                                          type: "checkbox",
                                          checked: C,
                                          disabled: l || C && L,
                                          onChange: () => J(p.id)
                                        }
                                      ),
                                      /* @__PURE__ */ a("span", { className: "sr-only", children: [
                                        "关联 ",
                                        p.name
                                      ] })
                                    ] })
                                  }
                                ),
                                /* @__PURE__ */ n(
                                  ee,
                                  {
                                    label: x ? `${l ? "查看" : "编辑"}${oe[o]}提示词：${p.name}` : `AI 新增${oe[o]}，确认镜头后可编辑：${p.name}`,
                                    children: /* @__PURE__ */ a(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: !x,
                                        onClick: () => _(p.id),
                                        children: [
                                          /* @__PURE__ */ n("span", { children: p.name }),
                                          !l && x ? /* @__PURE__ */ n(kt, { size: 11 }) : null
                                        ]
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            p.id
                          );
                        }) })
                      ] }, o) : null;
                    }) }) : /* @__PURE__ */ n("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ n("strong", { children: "角色配音与旁白" }),
                        /* @__PURE__ */ a("span", { children: [
                          m.speech.length,
                          " 条语音"
                        ] })
                      ] }),
                      l ? null : /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            onClick: () => N((o) => ({
                              ...o,
                              speech: [
                                ...o.speech,
                                ft(o, "dialogue")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ n(ke, { size: 13 }),
                              "添加对白"
                            ]
                          }
                        ),
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            onClick: () => N((o) => ({
                              ...o,
                              speech: [
                                ...o.speech,
                                ft(o, "narration")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ n(ke, { size: 13 }),
                              "添加旁白"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-list", children: m.speech.length ? m.speech.map((o, f) => /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ a("strong", { children: [
                          "语音 ",
                          f + 1
                        ] }),
                        l ? null : /* @__PURE__ */ a("div", { children: [
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "上移语音",
                              disabled: f === 0,
                              onClick: () => le(o.id, -1),
                              children: /* @__PURE__ */ n(ut, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "下移语音",
                              disabled: f === m.speech.length - 1,
                              onClick: () => le(o.id, 1),
                              children: /* @__PURE__ */ n(dt, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "删除语音",
                              danger: !0,
                              onClick: () => N((p) => ({
                                ...p,
                                speech: p.speech.filter(
                                  (C) => C.id !== o.id
                                )
                              })),
                              children: /* @__PURE__ */ n(He, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ a("label", { children: [
                          "类型",
                          /* @__PURE__ */ a(
                            "select",
                            {
                              value: o.kind,
                              disabled: l,
                              onChange: (p) => H(o.id, {
                                kind: p.target.value
                              }),
                              children: [
                                /* @__PURE__ */ n("option", { value: "dialogue", children: "角色对白" }),
                                /* @__PURE__ */ n("option", { value: "narration", children: "旁白" })
                              ]
                            }
                          )
                        ] }),
                        o.kind === "dialogue" ? /* @__PURE__ */ a(qe, { children: [
                          /* @__PURE__ */ a("label", { children: [
                            "角色",
                            /* @__PURE__ */ a(
                              "select",
                              {
                                value: o.character_id || "",
                                disabled: l,
                                onChange: (p) => H(o.id, {
                                  character_id: p.target.value
                                }),
                                children: [
                                  /* @__PURE__ */ n("option", { value: "", children: "请选择角色" }),
                                  v.map((p) => /* @__PURE__ */ n("option", { value: p.id, children: p.name }, p.id))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ a("label", { children: [
                            "说话方式",
                            /* @__PURE__ */ a(
                              "select",
                              {
                                value: o.speaker_mode || "offscreen",
                                disabled: l,
                                onChange: (p) => H(o.id, {
                                  speaker_mode: p.target.value === "visible" ? "visible" : "offscreen"
                                }),
                                children: [
                                  /* @__PURE__ */ n("option", { value: "visible", children: "出镜对白" }),
                                  /* @__PURE__ */ n("option", { value: "offscreen", children: "画外音" })
                                ]
                              }
                            )
                          ] })
                        ] }) : null,
                        /* @__PURE__ */ a("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ n(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: Math.max(0, m.duration - 0.01),
                                step: 0.1,
                                value: o.start_time,
                                disabled: l,
                                onChange: (p) => H(o.id, {
                                  start_time: Ye(p)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ a("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ n(
                          "textarea",
                          {
                            value: o.text,
                            readOnly: l,
                            placeholder: o.kind === "narration" ? "输入旁白" : "输入对白",
                            onChange: (p) => H(o.id, { text: p.target.value })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-subtitle", children: [
                        /* @__PURE__ */ a("label", { children: [
                          /* @__PURE__ */ n(
                            "input",
                            {
                              type: "checkbox",
                              checked: o.subtitle_enabled,
                              disabled: l,
                              onChange: (p) => H(o.id, {
                                subtitle_enabled: p.target.checked
                              })
                            }
                          ),
                          "加入字幕"
                        ] }),
                        o.subtitle_enabled ? /* @__PURE__ */ n(
                          "input",
                          {
                            value: o.subtitle_text,
                            readOnly: l,
                            placeholder: "可选：填写精简字幕；留空使用原文",
                            onChange: (p) => H(o.id, {
                              subtitle_text: p.target.value
                            })
                          }
                        ) : null
                      ] })
                    ] }, o.id)) : /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ n(_n, { size: 24 }),
                      /* @__PURE__ */ n("span", { children: "当前镜头没有对白或旁白" })
                    ] }) }),
                    T.size > 1 ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
                    D ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ n("strong", { children: "附加字幕文案" }),
                        /* @__PURE__ */ a("span", { children: [
                          m.captions.length,
                          " 条文案"
                        ] })
                      ] }),
                      l ? null : /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          onClick: () => N((o) => ({
                            ...o,
                            captions: [
                              ...o.captions,
                              Fn(o)
                            ]
                          })),
                          children: [
                            /* @__PURE__ */ n(ke, { size: 13 }),
                            "添加文案"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-list", children: m.captions.length ? m.captions.map((o, f) => /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ a("strong", { children: [
                          "文案 ",
                          f + 1
                        ] }),
                        l ? null : /* @__PURE__ */ a("div", { children: [
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "上移文案",
                              disabled: f === 0,
                              onClick: () => be(o.id, -1),
                              children: /* @__PURE__ */ n(ut, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "下移文案",
                              disabled: f === m.captions.length - 1,
                              onClick: () => be(o.id, 1),
                              children: /* @__PURE__ */ n(dt, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ n(
                            pe,
                            {
                              label: "删除文案",
                              danger: !0,
                              onClick: () => N((p) => ({
                                ...p,
                                captions: p.captions.filter(
                                  (C) => C.id !== o.id
                                )
                              })),
                              children: /* @__PURE__ */ n(He, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ a("label", { children: [
                          "类型",
                          /* @__PURE__ */ a(
                            "select",
                            {
                              value: o.type,
                              disabled: l,
                              onChange: (p) => ae(o.id, {
                                type: p.target.value
                              }),
                              children: [
                                /* @__PURE__ */ n("option", { value: "caption", children: "说明" }),
                                /* @__PURE__ */ n("option", { value: "title", children: "标题" }),
                                /* @__PURE__ */ n("option", { value: "highlight", children: "重点" })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ a("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ n(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: m.duration,
                                step: 0.1,
                                value: o.start_time,
                                disabled: l,
                                onChange: (p) => ae(o.id, {
                                  start_time: Ye(p)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] }),
                        /* @__PURE__ */ a("label", { children: [
                          "结束时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ n(
                              "input",
                              {
                                type: "number",
                                min: 0.1,
                                max: m.duration,
                                step: 0.1,
                                value: o.end_time,
                                disabled: l,
                                onChange: (p) => ae(o.id, {
                                  end_time: Ye(p)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ a("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ n(
                          "textarea",
                          {
                            value: o.text,
                            readOnly: l,
                            placeholder: "输入不对应语音的标题、说明或重点文字",
                            onChange: (p) => ae(o.id, {
                              text: p.target.value
                            })
                          }
                        )
                      ] })
                    ] }, o.id)) : /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ n(We, { size: 24 }),
                      /* @__PURE__ */ n("span", { children: "当前镜头没有附加字幕文案" })
                    ] }) }),
                    j ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ a("footer", { children: [
              !l && S ? /* @__PURE__ */ n(
                Lr,
                {
                  title: `AI 生成镜头 ${String(t + 1).padStart(2, "0")}`,
                  description: "可以补充本镜头的内容、动作、镜头语言或素材要求；不填也会按当前分镜生成。",
                  triggerLabel: "AI 生成",
                  triggerClassName: "is-ai",
                  triggerVariant: "outline",
                  triggerSize: "sm",
                  disabled: $,
                  textareaPlaceholder: "可选：输入本次镜头的补充要求，留空则按当前分镜上下文生成。",
                  submitLabel: "确定生成",
                  loadingText: "正在生成镜头",
                  errorText: "生成镜头失败",
                  referencesEnabled: !1,
                  stoppable: !1,
                  onSubmit: ({ instruction: o }) => ze(o)
                }
              ) : null,
              /* @__PURE__ */ n("button", { type: "button", disabled: $, onClick: M, children: l ? "关闭" : "取消" }),
              l ? null : /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: $ || T.size > 1 || D || U || O || j,
                  onClick: () => w(
                    m,
                    E.filter(
                      (o) => d.has(o.id) || m.material_ids.includes(o.id)
                    )
                  ),
                  children: [
                    /* @__PURE__ */ n(me, { size: 14 }),
                    "确认修改"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : Xe(ge, b || document.body);
}
function je({
  label: e,
  value: t,
  content: r,
  placeholder: i,
  readonly: s,
  referenceAdapter: l,
  onChange: u
}) {
  return /* @__PURE__ */ a("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      qn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: t,
        content: r,
        adapter: l,
        placeholder: i,
        disabled: s,
        layerZIndex: 2700,
        onChange: u
      }
    )
  ] });
}
function De({
  label: e,
  value: t,
  placeholder: r,
  readonly: i,
  onChange: s
}) {
  return /* @__PURE__ */ a("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: t,
        rows: 3,
        placeholder: r,
        readOnly: i,
        onChange: (l) => s(l.target.value)
      }
    )
  ] });
}
function qr(e, t) {
  return {
    ...e,
    shots: e.shots.map((r) => {
      const i = { ...r.reference_contents || {} };
      for (const s of Wr) {
        const l = wn(
          r[s],
          i[s],
          t
        );
        l ? i[s] = l : delete i[s];
      }
      return { ...r, reference_contents: i };
    })
  };
}
const Wr = [
  "description",
  "camera_instruction",
  "video_prompt"
];
function Hr(e, t, r, i) {
  const s = { ...e.reference_contents || {} };
  return i ? s[t] = i : delete s[t], {
    [t]: r,
    reference_contents: s
  };
}
function pe({
  label: e,
  disabled: t,
  danger: r = !1,
  onClick: i,
  children: s
}) {
  return /* @__PURE__ */ n(ee, { label: e, children: /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${r ? "is-danger" : ""}`,
      "aria-label": e,
      disabled: t,
      onClick: i,
      children: s
    }
  ) });
}
function Gr({ status: e }) {
  return /* @__PURE__ */ a("span", { className: `ws-storyboard-save-state is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ n(Re, { size: 12, className: "ws-spin" }) : e === "saved" ? /* @__PURE__ */ n(me, { size: 12 }) : null,
    e === "typing" ? "编辑中" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存"
  ] });
}
function Jr(e, t) {
  const r = { ...e, ...t };
  return r.kind === "dialogue" ? (r.character_id ||= "", r.speaker_mode ||= "offscreen") : (delete r.character_id, delete r.speaker_mode), r.subtitle_enabled = !!r.subtitle_enabled, r.subtitle_text ||= "", r;
}
function Kr(e) {
  return e.continue_previous ? "continue" : e.match_previous ? "match" : "independent";
}
function Xr(e, t, r) {
  const i = t !== "independent";
  return {
    ...e,
    match_previous: t === "match",
    continue_previous: t === "continue",
    continuity_anchor: t === "continue" ? e.continuity_anchor : "",
    continuity_state: i ? {
      ...e.continuity_state,
      entry: r?.continuity_state.exit || e.continuity_state.entry
    } : e.continuity_state
  };
}
function Zr(e, t) {
  const r = Number(e.target.value);
  return Ct(r) ? r : t;
}
function Qr(e, t, r) {
  const i = Number(e.target.value);
  return Number.isInteger(i) && i >= r ? i : t;
}
function Ye(e) {
  const t = Number.parseFloat(e.target.value);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function Xt(e) {
  const t = new Set(e.map((s) => s.id));
  let r = e.length, i = bt(r);
  for (; t.has(i.id); )
    r += 1, i = bt(r);
  return i;
}
function ei(e, t) {
  const r = Xt(e);
  return {
    ...Zt(t),
    id: r.id,
    order: r.order,
    speech: t.speech.map((i, s) => ({
      ...i,
      id: `${r.id}-speech-${s + 1}`
    })),
    captions: t.captions.map((i, s) => ({
      ...i,
      id: `${r.id}-caption-${s + 1}`
    }))
  };
}
function Zt(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    continuity_state: { ...e.continuity_state },
    speech: e.speech.map((t) => ({ ...t })),
    captions: e.captions.map((t) => ({ ...t })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
const ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StoryboardView: Fr
}, Symbol.toStringTag, { value: "Module" }));
export {
  Fr as S,
  wr as a,
  Si as b,
  ki as c,
  Ni as n,
  wi as r,
  jt as s
};
