import { j as t, a as s, F as We } from "./preloadable-Bomi5PEU.js";
import { a as L, b as K, u as ne, d as j, g as rn } from "./_commonjsHelpers-61wyk6v6.js";
import { b as Je } from "./file-kind-CYMG3EzQ.js";
import { X as Qe, h as Ke, n as pe, v as an, r as Ce, L as sn, aG as on, B as Xe, P as Ne, z as ln, q as Nt, au as ct, av as dt, I as cn } from "./vendor-icons-DwjYEojZ.js";
import { f as se, B as re, z as dn, M as Ie, H as un, I as Ee, J as he, K as It, L as Ct, N as kt, O as Rt, P as $t, Q as Mt, R as Ze, T as hn, U as Ot, V as pn, a as mn, W as fn, d as bn, s as Dt, X as gn, Y as vn, Z as ut, _ as yn, $ as _n, a0 as wn, a1 as Tt, m as Et, i as Sn, a2 as ht, a3 as Nn, a4 as In, a5 as pt, a6 as Cn, a7 as kn, a8 as Rn, a9 as $n, aa as Mn, S as On, ab as Dn, ac as Tn, ad as mt, ae as En, af as ft, ag as Pn } from "./upload-asset-api-DDv34zo1.js";
import { o as bt, s as Ue, m as Ln, J as xn } from "./space-sequence-card-LI0YIDhg.js";
import { u as Pt, a as zn, b as Bn } from "./space-reference-editor-Bi365szy.js";
import { a as An } from "./space-storyboard-shot-card-Bfa5kPco.js";
import { b as Lt } from "./node-detail-content-BcHQCibx.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-view-sLLbktSy.css", import.meta.url).href]);
function Fn({
  material: e,
  creating: r = !1,
  readonly: a,
  usage: n,
  existingNames: i = [],
  portalContainer: l,
  onSave: b,
  onRemove: _,
  onClose: N
}) {
  const [g, E] = L(e.name), [$, u] = L(e.prompt), [y, w] = L(e.voice), [x, A] = L(!1), V = g.trim().replace(/^[@#]+/, ""), d = $.trim(), S = i.some(
    (M) => M.trim().toLocaleLowerCase() === V.toLocaleLowerCase()
  ), p = (n?.shotIds.length || 0) + (n?.speechIds.length || 0), O = !r && !a && !!_ && p === 0, P = se[e.type];
  K(() => {
    function M(z) {
      z.key === "Escape" && (z.preventDefault(), N());
    }
    return window.addEventListener("keydown", M), () => window.removeEventListener("keydown", M);
  }, [N]);
  const Q = /* @__PURE__ */ t(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: N,
      children: /* @__PURE__ */ s(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${r ? "新增" : a ? "查看" : "编辑"}${P}素材 ${e.name}`,
          onMouseDown: (M) => M.stopPropagation(),
          children: [
            /* @__PURE__ */ s("header", { children: [
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ t("strong", { children: r ? `新增${P}` : e.name || P }),
                /* @__PURE__ */ s("span", { children: [
                  P,
                  "素材",
                  a ? " · 当前版本只读" : r ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ t(re, { label: "关闭", children: /* @__PURE__ */ t("button", { type: "button", "aria-label": "关闭", onClick: N, children: /* @__PURE__ */ t(Qe, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ s("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ t("span", { children: "素材名称" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    value: g,
                    readOnly: a,
                    autoFocus: !a,
                    placeholder: `例如：${e.type === "character" ? "主角" : e.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (M) => E(M.target.value)
                  }
                ),
                S ? /* @__PURE__ */ t("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ t("span", { children: "生成提示词" }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    value: $,
                    readOnly: a,
                    placeholder: `描述${V || P}的外观、结构、材质与风格`,
                    onChange: (M) => u(M.target.value)
                  }
                )
              ] }),
              e.type === "character" ? /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ t("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    value: y,
                    readOnly: a,
                    placeholder: "自动配音时必填",
                    onChange: (M) => w(M.target.value)
                  }
                ),
                /* @__PURE__ */ t("small", { children: "填写当前语音能力支持的音色值。" })
              ] }) : null,
              !r && p > 0 ? /* @__PURE__ */ s("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ t("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ s("span", { children: [
                  n?.shotIds.length || 0,
                  " 个镜头",
                  n?.speechIds.length ? ` · ${n.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ t("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ s("footer", { children: [
              /* @__PURE__ */ t("div", { children: !a && !r && _ ? /* @__PURE__ */ t(
                re,
                {
                  label: p > 0 ? "该素材仍被镜头或对白引用" : x ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !O,
                      onClick: () => {
                        if (!x) {
                          A(!0);
                          return;
                        }
                        _(e.id);
                      },
                      children: [
                        /* @__PURE__ */ t(Ke, { size: 14 }),
                        x ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ t("button", { type: "button", onClick: N, children: a ? "关闭" : "取消" }),
                a ? null : /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !V || !d || S,
                    onClick: () => b({
                      ...e,
                      name: V,
                      prompt: d,
                      voice: e.type === "character" ? y.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ t(pe, { size: 14 }),
                      r ? "添加素材" : "确认修改"
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
  return typeof document > "u" ? null : Je(Q, l || document.body);
}
function xt(e, r = {}) {
  const a = Kn(e, r), n = [], i = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set(), b = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), N = new Map(
    e.references.map((d) => [d.key, d])
  ), g = /* @__PURE__ */ new Set();
  if (r.workTypeSpecs?.length && r.purposeSpecs?.length) {
    const d = dn(
      e.references,
      e.work_type,
      r.workTypeSpecs,
      r.purposeSpecs
    );
    d && n.push(J("references", d));
  }
  e.title.trim() || n.push(J("title", "分镜标题不能为空")), e.summary.trim() || n.push(J("summary", "请补充整个脚本的内容简介")), a.referenceImages && !e.style_prompt.trim() && n.push(J("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > Ie) && n.push(
    J(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${Ie} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && n.push(J("target_shot_count", "目标镜头数与实际镜头数不一致"));
  const E = un(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < Ee ? n.push(
    J(
      "target_duration",
      `目标总时长必须是不小于 ${Ee} 秒的整数`
    )
  ) : e.target_duration !== E && n.push(J("target_duration", "目标总时长与镜头时长之和不一致"));
  for (const d of e.materials) {
    const S = d.name.trim(), p = S.toLocaleLowerCase();
    d.id.trim() ? i.has(d.id) && n.push(te(d, `素材标识“${d.id}”重复`)) : n.push(te(d, "缺少稳定标识")), S ? l.has(p) && n.push(te(d, `素材名称“${S}”重复`)) : n.push(te(d, "名称不能为空")), a.referenceImages && !d.prompt.trim() && n.push(te(d, "生成提示词不能为空")), d.type !== "character" && d.voice.trim() && n.push(te(d, "只有角色可以配置音色"));
    for (const O of d.reference_keys) {
      const P = N.get(O);
      P ? r.purposeSpecs?.length && he(
        P.purpose,
        r.purposeSpecs || []
      )?.material_type !== d.type ? n.push(te(d, `参考素材“${P.label}”的用途不匹配`)) : g.add(O) : n.push(te(d, `引用了不存在的参考素材“${O}”`));
    }
    l.add(p), i.set(d.id, d);
  }
  if (a.voice && Vn(e, n), !e.shots.length)
    return n.push(J("shots", "分镜至少需要一个镜头")), n;
  let $ = /* @__PURE__ */ new Set(), u = !1, y = "", w = 0;
  const x = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map();
  e.shots.forEach((d, S) => {
    const p = S + 1;
    (!d.id.trim() || x.has(d.id)) && n.push(R(d, p, "镜头标识缺失或重复")), x.add(d.id), It(d.duration) || n.push(
      R(
        d,
        p,
        `时长必须是不小于 ${Ee} 秒的整数`
      )
    ), d.beat.trim() ? vt(A, d.beat, d, p, "本镜变化", n) : n.push(R(d, p, "请填写本镜变化")), S === 0 && d.transition.trim() ? n.push(R(d, p, "第一镜不能填写上镜承接关系")) : S > 0 && !d.transition.trim() && n.push(R(d, p, "请说明与上一镜头的承接关系")), d.description.trim() ? vt(
      V,
      d.description,
      d,
      p,
      "镜头描述",
      n
    ) : n.push(R(d, p, "镜头描述不能为空")), a.shotVideos && !d.video_prompt.trim() && n.push(R(d, p, "视频提示词不能为空"));
    for (const D of d.reference_keys) {
      const X = N.get(D);
      X ? r.purposeSpecs?.length && he(
        X.purpose,
        r.purposeSpecs || []
      )?.scope !== "shot" ? n.push(
        R(d, p, `参考素材“${X.label}”的用途不匹配`)
      ) : g.add(D) : n.push(
        R(d, p, `引用了不存在的参考素材“${D}”`)
      );
    }
    const O = /* @__PURE__ */ new Set();
    for (const D of d.material_ids)
      i.has(D) ? O.has(D) && n.push(
        R(d, p, `重复引用素材“${D}”`)
      ) : n.push(
        R(d, p, `引用了不存在的素材“${D}”`)
      ), O.add(D);
    S === 0 && d.continue_previous && n.push(R(d, p, "第一个镜头不能承接上一镜头")), S === 0 && d.match_previous && n.push(R(d, p, "第一个镜头不能匹配上一镜头")), d.match_previous && d.continue_previous && n.push(R(d, p, "不能同时匹配上一镜画面和延续上一镜视频"));
    const P = d.continuity_state?.entry.trim() || "", Q = d.continuity_state?.exit.trim() || "";
    a.referenceImages && (P || n.push(R(d, p, "请填写入镜状态")), Q || n.push(R(d, p, "请填写出镜状态")), Ct(d, S) && P !== y && n.push(
      R(d, p, "入镜状态必须与上一镜头的出镜状态完全一致")
    )), a.shotVideos && (kt.includes(d.transition_type) || n.push(R(d, p, "结构化转场类型无效")), S === 0 && (d.transition_type !== "none" || d.transition_duration_ms !== 0) ? n.push(R(d, p, "第一镜不能配置转场效果")) : d.transition_type === "none" && d.transition_duration_ms !== 0 ? n.push(R(d, p, "硬切的转场时长必须为 0")) : d.transition_type !== "none" && (d.transition_duration_ms < 100 || d.transition_duration_ms > 5e3) && n.push(R(d, p, "转场时长必须是 100 到 5000 毫秒")));
    const M = Wn(
      O,
      i
    );
    a.shotVideos && d.continue_previous ? (w += 1, d.continuity_anchor.trim() || n.push(R(d, p, "请填写连续性锚点")), w >= 3 && n.push(
      Pe(
        `shot:${d.id}:continuity-chain`,
        `镜头 ${p}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        d.id
      )
    ), Hn($, M) || n.push(
      R(
        d,
        p,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : w = 0;
    let z = !1;
    (a.voice || a.subtitles || a.lipSync) && (z = Un(
      d,
      p,
      i,
      O,
      b,
      n,
      {
        validateTimeline: a.voice,
        validateVisibleSpeakers: a.lipSync
      }
    )), a.lipSync && d.continue_previous && (u || z) && n.push(
      Pe(
        `shot:${d.id}:visible-dialogue-continuity`,
        `镜头 ${p}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        d.id
      )
    ), a.subtitles && qn(d, p, _, n), $ = M, u = z, y = Q;
  });
  for (const d of e.references) {
    const S = he(
      d.purpose,
      r.purposeSpecs || []
    )?.scope;
    (S === "material" || S === "shot") && !g.has(d.key) && n.push(
      Pe(
        `reference:${d.key}`,
        `参考素材“${d.label}”尚未关联到具体目标`
      )
    );
  }
  return n;
}
function Vn(e, r) {
  const a = /* @__PURE__ */ new Set();
  let n = !1;
  for (const i of e.shots)
    for (const l of i.speech)
      l.text.trim() && (l.kind === "narration" ? n = !0 : l.character_id && a.add(l.character_id));
  n && !e.narrator_voice.trim() && r.push(J("narrator_voice", "旁白：请选择音色"));
  for (const i of e.materials)
    a.has(i.id) && i.type === "character" && !i.voice.trim() && r.push(te(i, "请选择音色"));
}
function Un(e, r, a, n, i, l, b) {
  for (const N of e.speech) {
    if ((!N.id.trim() || i.has(N.id)) && l.push(R(e, r, "语音标识缺失或重复")), i.add(N.id), N.text.trim() || l.push(R(e, r, "对白或旁白文本不能为空")), (N.start_time < 0 || N.start_time >= e.duration) && l.push(R(e, r, "语音开始时间超出镜头范围")), N.kind !== "dialogue")
      continue;
    const g = N.character_id || "";
    a.get(g)?.type !== "character" ? l.push(R(e, r, "对白没有选择有效角色")) : n.has(g) || l.push(R(e, r, "对白角色未关联到当前镜头"));
  }
  const _ = Ot(e);
  return b.validateVisibleSpeakers && _.size > 1 && l.push(R(e, r, "最多只能有一个出镜说话角色")), b.validateTimeline && Yn(e, r, l), _.size > 0;
}
function Yn(e, r, a) {
  const n = e.speech.filter((i) => i.text.trim()).map((i) => ({
    speech: i,
    start: i.start_time,
    end: i.start_time + Math.max(0.6, jn(i) / 3.5)
  })).sort((i, l) => i.start - l.start);
  for (let i = 0; i < n.length; i += 1) {
    const l = n[i];
    l.end > e.duration + 0.01 && a.push(
      gt(
        `shot:${e.id}:speech:${l.speech.id}:duration`,
        `镜头 ${r} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const b = n[i + 1];
    b && l.end > b.start + 0.01 && a.push(
      gt(
        `shot:${e.id}:speech:${l.speech.id}:overlap`,
        `镜头 ${r} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function qn(e, r, a, n) {
  for (const i of e.captions)
    (!i.id.trim() || a.has(i.id)) && n.push(R(e, r, "字幕标识缺失或重复")), a.add(i.id), i.text.trim() || n.push(R(e, r, "字幕文案不能为空")), (i.start_time < 0 || i.end_time <= i.start_time || i.end_time > e.duration) && n.push(R(e, r, "字幕时间范围超出镜头"));
}
function jn(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function Hn(e, r) {
  if (e.size !== r.size)
    return !1;
  for (const a of e)
    if (!r.has(a))
      return !1;
  return !0;
}
function Wn(e, r) {
  return new Set(
    [...e].filter((a) => {
      const n = r.get(a)?.type;
      return n === "character" || n === "scene";
    })
  );
}
function Kn(e, r) {
  return r.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1,
    lipSync: !1
  } : {
    referenceImages: hn(e),
    shotVideos: Ze(e),
    voice: Mt(e),
    subtitles: $t(e),
    lipSync: Rt(e)
  };
}
function J(e, r) {
  return { id: e, message: r, severity: "error" };
}
function te(e, r) {
  return {
    id: `material:${e.id}:${r}`,
    message: `${e.name || "未命名素材"}：${r}`,
    severity: "error",
    materialId: e.id
  };
}
function R(e, r, a) {
  return {
    id: `shot:${e.id}:${a}`,
    message: `镜头 ${r}：${a}`,
    severity: "error",
    shotId: e.id
  };
}
function Pe(e, r, a) {
  return { id: e, message: r, severity: "warning", shotId: a };
}
function gt(e, r, a) {
  return { id: e, message: r, severity: "error", shotId: a };
}
function vt(e, r, a, n, i, l) {
  const b = r.replace(/\s+/g, "").toLocaleLowerCase(), _ = e.get(b);
  _ ? l.push(
    Pe(
      `shot:${a.id}:${i}:duplicate`,
      `镜头 ${n} 的${i}与镜头 ${_} 重复，建议审查是否有新的叙事作用`,
      a.id
    )
  ) : e.set(b, n);
}
function zt({
  issues: e,
  onOpen: r
}) {
  const a = e.filter((l) => l.severity === "error"), n = e.filter((l) => l.severity === "warning"), i = [...a, ...n].slice(0, 5);
  return /* @__PURE__ */ s(
    "section",
    {
      className: `ws-storyboard-validation ${a.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ s("header", { children: [
          /* @__PURE__ */ t(an, { size: 14 }),
          /* @__PURE__ */ t("strong", { children: a.length ? `${a.length} 项需要处理` : `${n.length} 项建议检查` }),
          e.length > i.length ? /* @__PURE__ */ s("span", { children: [
            "另有 ",
            e.length - i.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ t("div", { children: i.map((l, b) => {
          const _ = !!(l.materialId || l.shotId);
          return /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              disabled: !_,
              onClick: () => _ && r(l),
              children: /* @__PURE__ */ t("span", { children: l.message })
            },
            `${l.id}:${b}`
          );
        }) })
      ]
    }
  );
}
const Xn = [
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
function Gn({
  storyboard: e,
  lipSyncAvailable: r,
  submitting: a,
  portalContainer: n,
  onClose: i,
  onEditIssue: l,
  onConfirm: b
}) {
  const [_, N] = L(
    () => pn(e, r)
  ), g = mn(e), E = fn(e), $ = e.shots.some(
    bn
  ), u = ne(
    () => Jn(_, {
      speech: g > 0,
      subtitles: E > 0,
      visibleDialogue: $
    }),
    [$, _, g, E]
  ), y = ne(
    () => ({ ...e, production_plan: u }),
    [u, e]
  ), w = ne(
    () => xt(y),
    [y]
  ), x = w.some(
    (p) => p.severity === "error"
  ), A = ne(
    () => Qn(y),
    [y]
  ), V = Ze(
    y
  );
  K(() => {
    const p = (O) => {
      O.key === "Escape" && !a && i();
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [i, a]);
  const d = (p, O) => {
    N((P) => ({
      ...P,
      [p]: O ? "auto" : "off"
    }));
  }, S = async () => {
    if (x) return;
    await b(u) && i();
  };
  return Je(
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          a || i();
        },
        children: /* @__PURE__ */ s(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (p) => p.stopPropagation(),
            children: [
              /* @__PURE__ */ s("header", { children: [
                /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ t("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ t("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: a,
                    onClick: i,
                    children: /* @__PURE__ */ t(Qe, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ t("strong", { children: e.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ s("span", { children: [
                    e.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ s("span", { children: [
                    Dt(e),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ s("span", { children: [
                    g,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ s("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ t("legend", { children: "产出目标" }),
                  /* @__PURE__ */ t("div", { className: "ws-storyboard-output-options", children: Xn.map((p) => /* @__PURE__ */ s(
                    "label",
                    {
                      className: _.output_target === p.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: p.value,
                            checked: _.output_target === p.value,
                            disabled: a,
                            onChange: () => N((O) => ({
                              ...O,
                              output_target: p.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ s("span", { children: [
                          /* @__PURE__ */ t("strong", { children: p.title }),
                          /* @__PURE__ */ t("small", { children: p.description })
                        ] }),
                        _.output_target === p.value ? /* @__PURE__ */ t(pe, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    p.value
                  )) })
                ] }),
                V ? /* @__PURE__ */ s("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ t("legend", { children: "附加内容" }),
                  /* @__PURE__ */ t(
                    Ye,
                    {
                      title: "配音",
                      description: g > 0 ? `按脚本中的 ${g} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: g > 0 && _.voice_mode === "auto",
                      disabled: a || g === 0,
                      onChange: (p) => d("voice_mode", p)
                    }
                  ),
                  /* @__PURE__ */ t(
                    Ye,
                    {
                      title: "字幕",
                      description: E > 0 ? `按脚本中的 ${E} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: E > 0 && _.subtitle_mode === "auto",
                      disabled: a || E === 0,
                      onChange: (p) => d("subtitle_mode", p)
                    }
                  ),
                  /* @__PURE__ */ t(
                    Ye,
                    {
                      title: "口型同步",
                      description: $ ? r ? "仅对出镜对白创建口型同步，默认开启。" : "当前未配置口型同步能力，保持关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: $ && _.voice_mode === "auto" && _.lip_sync_mode === "auto",
                      disabled: a || !r || !$ || _.voice_mode !== "auto",
                      onChange: (p) => d("lip_sync_mode", p)
                    }
                  )
                ] }) : null,
                w.length ? /* @__PURE__ */ t(
                  zt,
                  {
                    issues: w,
                    onOpen: l
                  }
                ) : null,
                /* @__PURE__ */ s("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ t("strong", { children: "制作流程" }),
                    /* @__PURE__ */ t("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ t("div", { className: "ws-storyboard-production-flow", children: A.map((p, O) => /* @__PURE__ */ s("span", { children: [
                    O > 0 ? /* @__PURE__ */ t("i", { "aria-hidden": "true", children: "/" }) : null,
                    p
                  ] }, p)) })
                ] })
              ] }),
              /* @__PURE__ */ s("footer", { children: [
                /* @__PURE__ */ t("button", { type: "button", disabled: a, onClick: i, children: "返回修改" }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: a || x,
                    onClick: () => {
                      S();
                    },
                    children: [
                      a ? /* @__PURE__ */ t(Ce, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ t(pe, { size: 15 }),
                      a ? "创建中" : Zn(_.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    n || document.body
  );
}
function Ye({
  title: e,
  description: r,
  checked: a,
  disabled: n,
  onChange: i
}) {
  return /* @__PURE__ */ s("label", { className: `ws-storyboard-production-switch${n ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s("span", { children: [
      /* @__PURE__ */ t("strong", { children: e }),
      /* @__PURE__ */ t("small", { children: r })
    ] }),
    /* @__PURE__ */ t(
      "input",
      {
        type: "checkbox",
        checked: a,
        disabled: n,
        onChange: (l) => i(l.target.checked)
      }
    ),
    /* @__PURE__ */ t("i", { "aria-hidden": "true" })
  ] });
}
function Jn(e, r) {
  if (!["shot_videos", "final_video"].includes(e.output_target))
    return {
      ...e,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const a = r.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: a,
    subtitle_mode: r.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: r.visibleDialogue && a === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function Qn(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const r = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return Ze(e) && r.push("镜头视频"), Mt(e) && r.push("配音"), $t(e) && r.push("字幕"), Rt(e) && r.push("口型同步"), gn(e) && r.push("视频合成"), r;
}
function Zn(e) {
  return e === "shot_images" ? "创建参考图" : e === "shot_videos" ? "创建镜头视频" : "完成视频";
}
function er({
  storyboard: e,
  referenceItems: r,
  workType: a,
  purposeSpecs: n,
  editable: i,
  disabled: l,
  onChange: b
}) {
  const _ = Pt(r);
  if (e.references.length === 0)
    return null;
  const N = (g, E, $ = !1) => {
    let u = $ ? Bt(e, g) : e;
    if (u = {
      ...u,
      references: u.references.map(
        (y) => y.key === g ? { ...y, ...E } : y
      )
    }, $) {
      const y = u.references.find((x) => x.key === g), w = y ? yt(u, y, n) : [];
      w.length === 1 && (u = _t(u, g, w[0].value));
    }
    b(u);
  };
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ s("header", { children: [
      /* @__PURE__ */ t(sn, { size: 14 }),
      /* @__PURE__ */ t("strong", { children: "参考素材" }),
      /* @__PURE__ */ s("span", { children: [
        e.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "ws-storyboard-reference-list", children: e.references.map((g) => {
      const E = yt(
        e,
        g,
        n
      ), $ = nr(e, g.key), u = vn(
        g.kind,
        a,
        n
      ), y = u.some(
        (w) => w.value === g.purpose
      );
      return /* @__PURE__ */ s(
        "div",
        {
          className: `ws-storyboard-reference-row ${y ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ t(
              zn,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${g.label}`,
                content: tr(g),
                adapter: _
              }
            ),
            i ? /* @__PURE__ */ s(We, { children: [
              /* @__PURE__ */ s(
                "select",
                {
                  className: "nodrag nopan",
                  value: g.purpose,
                  disabled: l,
                  "aria-label": `${g.label}的参考用途`,
                  onChange: (w) => N(
                    g.key,
                    {
                      purpose: w.target.value
                    },
                    !0
                  ),
                  children: [
                    y ? null : /* @__PURE__ */ s("option", { value: g.purpose, children: [
                      ut(
                        g.purpose,
                        n
                      ),
                      "（当前类型不支持）"
                    ] }),
                    u.map((w) => /* @__PURE__ */ t("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ),
              wt(
                g.purpose,
                n
              ) ? /* @__PURE__ */ s(
                "select",
                {
                  className: "nodrag nopan",
                  value: $,
                  disabled: l,
                  "aria-label": `${g.label}的关联目标`,
                  onChange: (w) => b(
                    _t(
                      e,
                      g.key,
                      w.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ t("option", { value: "", children: "选择关联目标" }),
                    E.map((w) => /* @__PURE__ */ t("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ) : /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-global", children: St(
                g.purpose,
                n
              ) })
            ] }) : /* @__PURE__ */ s(We, { children: [
              /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-purpose", children: ut(
                g.purpose,
                n
              ) }),
              /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-target", children: rr(e, $) || (wt(
                g.purpose,
                n
              ) ? "未关联" : St(
                g.purpose,
                n
              )) })
            ] })
          ]
        },
        g.key
      );
    }) })
  ] });
}
function tr(e) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: e.asset_id,
        label: e.label,
        purpose: e.purpose,
        ref_trigger: "@",
        ref_version_id: e.version_id
      }
    ]
  };
}
function yt(e, r, a) {
  const n = he(
    r.purpose,
    a
  );
  return n?.scope === "material" ? e.materials.filter((i) => i.type === n.material_type).map((i) => ({
    value: `material:${i.id}`,
    label: i.name
  })) : n?.scope === "shot" ? e.shots.map((i, l) => ({
    value: `shot:${i.id}`,
    label: `镜头 ${i.order || l + 1}`
  })) : [];
}
function nr(e, r) {
  const a = e.materials.find(
    (i) => i.reference_keys.includes(r)
  );
  if (a)
    return `material:${a.id}`;
  const n = e.shots.find(
    (i) => i.reference_keys.includes(r)
  );
  return n ? `shot:${n.id}` : "";
}
function rr(e, r) {
  const [a, n] = r.split(":", 2);
  if (a === "material")
    return e.materials.find((i) => i.id === n)?.name || "";
  if (a === "shot") {
    const i = e.shots.findIndex((l) => l.id === n);
    return i >= 0 ? `镜头 ${e.shots[i].order || i + 1}` : "";
  }
  return "";
}
function _t(e, r, a) {
  const n = Bt(e, r);
  if (!a)
    return n;
  const [i, l] = a.split(":", 2);
  return i === "material" ? {
    ...n,
    materials: n.materials.map(
      (b) => b.id === l ? {
        ...b,
        reference_keys: [...b.reference_keys, r]
      } : b
    )
  } : i === "shot" ? {
    ...n,
    shots: n.shots.map(
      (b) => b.id === l ? { ...b, reference_keys: [...b.reference_keys, r] } : b
    )
  } : n;
}
function Bt(e, r) {
  return {
    ...e,
    materials: e.materials.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter(
        (n) => n !== r
      )
    })),
    shots: e.shots.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter((n) => n !== r)
    }))
  };
}
function wt(e, r) {
  const a = he(e, r)?.scope;
  return a === "material" || a === "shot";
}
function St(e, r) {
  const a = he(e, r);
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
function ar({
  storyboard: e,
  sourceNodeId: r,
  canvasNodes: a
}) {
  const n = At(e, r, a);
  return /* @__PURE__ */ t("div", { className: "ws-storyboard-board", "aria-label": "画面预览", children: n.map(
    ({ shot: i, start: l, end: b, singleRole: _, references: N, emptyLabel: g }) => /* @__PURE__ */ s("article", { className: "ws-storyboard-board-frame", children: [
      /* @__PURE__ */ s("header", { children: [
        /* @__PURE__ */ t("strong", { children: String(i.order).padStart(2, "0") }),
        /* @__PURE__ */ s("span", { children: [
          i.duration,
          " 秒"
        ] }),
        /* @__PURE__ */ t("span", { children: cr(i) })
      ] }),
      N ? /* @__PURE__ */ t(
        "div",
        {
          className: `ws-storyboard-frame-media is-reference-group${N.length <= 1 ? " is-single" : ""}`,
          style: { aspectRatio: qe(e) },
          children: (N.length ? N : [l]).map(
            (E, $) => /* @__PURE__ */ t(
              De,
              {
                shot: i,
                media: E,
                label: `参考图 ${$ + 1}`,
                emptyLabel: "参考图待生成"
              },
              `${i.id}:reference:${$}`
            )
          )
        }
      ) : b ? /* @__PURE__ */ s(
        "div",
        {
          className: "ws-storyboard-frame-media is-paired",
          style: { aspectRatio: qe(e) },
          children: [
            /* @__PURE__ */ t(
              De,
              {
                shot: i,
                media: l,
                frameRole: "start",
                label: "首帧"
              }
            ),
            /* @__PURE__ */ t(
              De,
              {
                shot: i,
                media: b,
                frameRole: "end",
                label: "尾帧"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ t(
        "div",
        {
          className: "ws-storyboard-frame-media",
          style: { aspectRatio: qe(e) },
          children: /* @__PURE__ */ t(
            De,
            {
              shot: i,
              media: l,
              frameRole: _,
              label: _ === "end" ? "尾帧" : void 0,
              emptyLabel: g
            }
          )
        }
      ),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-frame-copy", children: [
        /* @__PURE__ */ t("strong", { children: i.beat }),
        /* @__PURE__ */ t("span", { children: i.camera_instruction || "固定机位" }),
        /* @__PURE__ */ s("div", { className: "ws-storyboard-frame-continuity", children: [
          /* @__PURE__ */ s("p", { children: [
            /* @__PURE__ */ t("b", { children: "入" }),
            /* @__PURE__ */ t("span", { children: i.continuity_state.entry })
          ] }),
          /* @__PURE__ */ s("p", { children: [
            /* @__PURE__ */ t("b", { children: "出" }),
            /* @__PURE__ */ t("span", { children: i.continuity_state.exit })
          ] })
        ] }),
        /* @__PURE__ */ t(
          ir,
          {
            start: l,
            end: b,
            references: N
          }
        )
      ] })
    ] }, i.id)
  ) });
}
function ir({
  start: e,
  end: r,
  references: a
}) {
  const n = e.node?.runError || r?.node?.runError || a?.find((i) => i.node?.runError)?.node?.runError || "";
  return n ? /* @__PURE__ */ t("small", { children: n }) : null;
}
function sr(e, r, a) {
  return At(e, r, a).some(
    (n) => !!(n.start.imageURL || n.end?.imageURL || n.references?.some((i) => i.imageURL))
  );
}
function At(e, r, a) {
  const n = /* @__PURE__ */ new Map();
  for (const i of a) {
    const l = i.storyboardItem;
    if (l?.sourceNodeId === r && l.itemType === "shot_image" && l.shotId) {
      const b = n.get(l.shotId) || {};
      if (yn(l.shotImageMode) === "references") {
        b.referenceNode = i, n.set(l.shotId, b);
        continue;
      }
      const _ = _n(
        l.frameMediaItems
      );
      if (_.length)
        for (const N of _)
          b[N.frameRole] = {
            node: i,
            mediaIndex: N.mediaIndex
          };
      else
        b[wn(l.frameRole)] = {
          node: i,
          mediaIndex: 1
        };
      n.set(l.shotId, b);
    }
  }
  return e.shots.map((i) => {
    const l = n.get(i.id), b = Tt(i);
    return b.nodeMode === "references" ? {
      shot: i,
      start: Se(),
      references: or(l?.referenceNode)
    } : b.nodeMode === "last_frame" ? {
      shot: i,
      start: Se(l?.end),
      singleRole: "end"
    } : b.nodeMode === "none" ? {
      shot: i,
      start: Se(),
      emptyLabel: i.continue_previous ? "沿用上一镜尾帧" : "无需参考图"
    } : {
      shot: i,
      start: Se(l?.start),
      ...l?.end ? { end: Se(l.end) } : {}
    };
  });
}
function or(e) {
  const r = e ? Lt(e) : void 0;
  return (r ? Et(r, "image") : []).slice(0, 4).map((n) => ({ node: e, imageURL: n }));
}
function Se(e) {
  const r = e ? Lt(e.node) : void 0;
  return {
    node: e?.node,
    imageURL: r ? lr(r, e?.mediaIndex || 1) : ""
  };
}
function lr(e, r) {
  const a = e && typeof e == "object" && !Array.isArray(e) ? e : void 0, n = a?.meta && typeof a.meta == "object" && !Array.isArray(a.meta) ? a.meta : void 0, l = (Array.isArray(n?.items) ? n.items : []).find((_) => !_ || typeof _ != "object" || Array.isArray(_) ? !1 : Number(_.order) === r);
  return String(l?.image || "").trim() || Et(e, "image")[r - 1] || "";
}
function De({
  shot: e,
  media: r,
  frameRole: a,
  label: n,
  emptyLabel: i
}) {
  const l = r.imageURL ? /* @__PURE__ */ t("a", { href: r.imageURL, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ t(
    "img",
    {
      src: r.imageURL,
      alt: `镜头 ${e.order}${n ? ` ${n}` : " 故事板"}`,
      loading: "lazy",
      decoding: "async"
    }
  ) }) : /* @__PURE__ */ s("div", { className: "ws-storyboard-frame-empty", children: [
    /* @__PURE__ */ t(on, { size: 22 }),
    /* @__PURE__ */ t("span", { children: i || dr(e, r.node, a) })
  ] });
  return n ? /* @__PURE__ */ s("div", { className: "ws-storyboard-frame-slot", children: [
    /* @__PURE__ */ t("span", { className: "ws-storyboard-frame-role", children: n }),
    l
  ] }) : l;
}
function cr(e) {
  return e.continue_previous ? "尾帧续接" : e.match_previous ? "画面匹配" : "新镜头";
}
function dr(e, r, a) {
  return r?.runError ? "生成失败" : r ? "暂无结果" : a === "end" ? "尾帧待生成" : a === "start" && e.continue_previous ? "运行时取上一镜尾帧" : e.continue_previous ? "沿用上一镜尾帧" : "待生成";
}
function qe(e) {
  return e.aspect_ratio.replace(":", " / ");
}
await window.DeverFront?.ensureCompat?.(["@/components/assistant/task-popover"]);
const Ge = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/task-popover");
if (!Ge || Object.keys(Ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/task-popover");
const ur = Ge.AssistantTaskPopover, hr = [], pr = [], mr = [], fr = [], br = [
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
function Br({
  storyboard: e,
  layout: r = "stacked",
  editable: a = !1,
  disabled: n = !1,
  onSave: i,
  onChange: l,
  onConfirm: b,
  onCreateRevision: _,
  onGenerateShot: N,
  workflowAction: g = "",
  saveStatus: E,
  showSaveStatus: $ = !0,
  showMetrics: u = !0,
  referenceItems: y = hr,
  storyboardSourceNodeId: w = "",
  canvasNodes: x = pr,
  lipSyncAvailable: A = !1,
  workTypeSpecs: V = mr,
  purposeSpecs: d = fr,
  focus: S
}) {
  const p = ne(
    () => JSON.stringify(e),
    [e]
  ), [O, P] = L(e), [Q, M] = L("saved"), [z, D] = L(""), [X, U] = L(""), [H, G] = L(null), [ke, ae] = L(!1), [W, me] = L("script"), [Re, o] = L(""), [f, h] = L(""), [I, F] = L([]), [T, fe] = L(
    "before"
  ), Z = j(null), Le = Z.current?.closest(".wb-detail-backdrop, .ws-page") || null, xe = j(""), oe = j([]), et = j(/* @__PURE__ */ new Map()), le = j(/* @__PURE__ */ new Map()), ze = j(e), $e = j(!1), be = j(0), tt = j(p), ee = j(null), nt = j(Promise.resolve()), ge = j(!0), ve = !!l, v = ve ? e : O, rt = V.find(
    (c) => c.key === v.work_type
  )?.name, Me = Sn(v), B = a && !n && !Me && !g && !!(l || i), at = B && !ve && !!i, it = Pt(y), ye = v.shots.find((c) => c.id === z), Be = v.shots.findIndex(
    (c) => c.id === z
  ), Ut = Be > 0 ? v.shots[Be - 1] : void 0, Ae = v.materials.find(
    (c) => c.id === X
  ), ce = Ae || H, Yt = ce ? ht(v, ce.id) : void 0, qt = ne(
    () => bt(v.shots, I, (c) => c.id),
    [v.shots, I]
  ), Fe = ne(
    () => xt(v, {
      coreOnly: !0,
      workTypeSpecs: V,
      purposeSpecs: d
    }),
    [v, d, V]
  ), jt = Fe.some(
    (c) => c.severity === "error"
  ), st = (c) => {
    if (c.materialId) {
      D(""), G(null), U(c.materialId);
      return;
    }
    c.shotId && (U(""), G(null), D(c.shotId));
  }, Oe = ne(
    () => !!w && sr(v, w, x),
    [x, v, w]
  ), Ht = ne(
    () => v.shots.some(
      (c) => c.speech.some(
        (m) => m.kind === "narration" && !!m.text.trim()
      )
    ),
    [v.shots]
  );
  K(() => (ge.current = !0, () => {
    ge.current = !1, ee.current && window.clearTimeout(ee.current);
  }), []), K(
    () => () => {
      for (const c of le.current.values())
        c.cancel();
      le.current.clear();
    },
    []
  ), rn(() => {
    const c = et.current, m = Z.current;
    if (!m || c.size === 0)
      return;
    const k = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    m.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((C) => {
      if (C.classList.contains("is-dragging"))
        return;
      const Y = C.dataset.sequenceItemId || "", ie = c.get(Y);
      if (!ie || k)
        return;
      const Ve = C.getBoundingClientRect(), _e = ie.left - Ve.left, de = ie.top - Ve.top;
      if (Math.abs(_e) < 1 && Math.abs(de) < 1)
        return;
      le.current.get(Y)?.cancel();
      const we = C.animate(
        [
          { transform: `translate3d(${_e}px, ${de}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      le.current.set(Y, we), we.onfinish = () => {
        le.current.get(Y) === we && le.current.delete(Y);
      };
    }), c.clear();
  }, [I]), K(() => {
    tt.current !== p && (tt.current = p, !$e.current && (ze.current = e, P(e), M("saved")));
  }, [p, e]), K(() => {
    z && !ye && D("");
  }, [ye, z]), K(() => {
    X && !Ae && U("");
  }, [Ae, X]), K(() => {
    !Oe && W === "board" && me("script");
  }, [W, Oe]), K(() => {
    if (!S)
      return;
    if (S.materialId && v.materials.some((m) => m.id === S.materialId)) {
      G(null), D(""), U(S.materialId);
      return;
    }
    if (S.shotId && v.shots.some((m) => m.id === S.shotId)) {
      G(null), U(""), D(S.shotId);
      return;
    }
    const c = window.requestAnimationFrame(() => {
      const m = S.materialType ? `[data-storyboard-material-type="${S.materialType}"]` : S.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      Z.current?.querySelector(m)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(c);
  }, [
    S?.materialId,
    S?.materialType,
    S?.section,
    S?.shotId
  ]), K(() => {
    if (!at || !$e.current || !i)
      return;
    ee.current && window.clearTimeout(ee.current);
    const c = v, m = be.current;
    return ee.current = window.setTimeout(() => {
      ee.current = null, nt.current = nt.current.catch(() => {
      }).then(async () => {
        ge.current && m === be.current && M("saving");
        try {
          if (await i(c), !ge.current || m !== be.current)
            return;
          $e.current = !1, M("saved");
        } catch {
          if (!ge.current || m !== be.current)
            return;
          M("error");
        }
      });
    }, 800), () => {
      ee.current && (window.clearTimeout(ee.current), ee.current = null);
    };
  }, [at, v, i]);
  const q = (c) => {
    if (!B)
      return;
    const m = ve ? e : ze.current, k = c(m), C = yr(
      kn(Rn(m, k)),
      it.options
    );
    if (ze.current = C, ve) {
      l?.(C);
      return;
    }
    $e.current = !0, be.current += 1, P(C), M("typing");
  }, ot = () => {
    const c = Z.current;
    if (!c)
      return;
    const m = /* @__PURE__ */ new Map();
    c.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((k) => {
      const C = k.dataset.sequenceItemId || "";
      C && m.set(C, k.getBoundingClientRect());
    }), et.current = m;
  }, Wt = (c) => {
    const m = v.shots.map((k) => k.id);
    xe.current = c, oe.current = m, o(c), h(""), F(m);
  }, Kt = (c, m) => {
    const k = xe.current, C = oe.current;
    if (!k || !c || k === c || !C.length || !C.includes(k) || !C.includes(c))
      return;
    const Y = m.currentTarget.getBoundingClientRect(), ie = m.currentTarget.parentElement?.getBoundingClientRect(), _e = !!(ie && Y.width * 1.5 < ie.width) ? m.clientX < Y.left + Y.width / 2 ? "before" : "after" : m.clientY < Y.top + Y.height / 2 ? "before" : "after", de = Ln(
      C,
      k,
      c,
      _e,
      (we) => we
    );
    h(c), fe(_e), !Ue(C, de) && (ot(), oe.current = de, F(de));
  }, lt = () => {
    const c = oe.current, m = v.shots.map((k) => k.id);
    c.length > 0 && !Ue(c, m) && ot(), xe.current = "", oe.current = [], o(""), h(""), F([]);
  }, Xt = () => {
    const c = oe.current;
    c.length > 0 && q((m) => {
      const k = bt(m.shots, c, (C) => C.id);
      return Ue(
        m.shots.map((C) => C.id),
        k.map((C) => C.id)
      ) ? m : { ...m, shots: k };
    }), lt();
  }, Gt = (c, m) => {
    q((k) => ({
      ...k,
      materials: m,
      shots: k.shots.map(
        (C) => C.id === c.id ? c : C
      )
    })), D("");
  }, Jt = (c) => {
    q((m) => {
      const k = m.materials.some((C) => C.id === c.id);
      return {
        ...m,
        materials: k ? m.materials.map(
          (C) => C.id === c.id ? c : C
        ) : [...m.materials, c]
      };
    }), U(""), G(null);
  }, Qt = (c) => {
    U(""), G($n(v.materials, c));
  }, Zt = (c) => {
    const m = ht(v, c);
    m.shotIds.length || m.speechIds.length || (q((k) => ({
      ...k,
      materials: k.materials.filter((C) => C.id !== c)
    })), U(""), G(null));
  }, en = (c) => {
    q((m) => m.shots.length <= 1 ? m : {
      ...m,
      shots: m.shots.filter((k) => k.id !== c)
    });
  }, tn = (c) => {
    q((m) => {
      if (m.shots.length >= Ie)
        return m;
      const k = $r(m.shots, c), C = m.shots.findIndex((ie) => ie.id === c.id), Y = [...m.shots];
      return Y.splice(C + 1, 0, k), { ...m, shots: Y };
    });
  }, nn = () => {
    q((c) => c.shots.length >= Ie ? c : {
      ...c,
      shots: [...c.shots, Ft(c.shots)]
    });
  };
  return /* @__PURE__ */ s(
    "section",
    {
      ref: Z,
      className: `ws-storyboard is-${r} ${B ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ s("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ s("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ s("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ s("header", { children: [
                /* @__PURE__ */ t(Xe, { size: 14 }),
                /* @__PURE__ */ t("strong", { children: "内容简介" }),
                rt ? /* @__PURE__ */ t("span", { className: "ws-storyboard-work-type", children: rt }) : null
              ] }),
              /* @__PURE__ */ t("p", { children: Nn(v) })
            ] }),
            /* @__PURE__ */ s("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ t(
                er,
                {
                  storyboard: v,
                  referenceItems: y,
                  editable: B,
                  disabled: n,
                  workType: v.work_type,
                  purposeSpecs: d,
                  onChange: (c) => q(() => c)
                }
              ),
              /* @__PURE__ */ t("section", { className: "ws-storyboard-basic-settings", children: /* @__PURE__ */ s("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ t("strong", { children: /* @__PURE__ */ t(re, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ t("span", { children: "画面类型" }) }) }),
                  B ? /* @__PURE__ */ t(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: v.visual_mode,
                      disabled: n,
                      onChange: (c) => q((m) => ({
                        ...m,
                        visual_mode: c.target.value
                      })),
                      children: In.map((c) => /* @__PURE__ */ t("option", { value: c, children: pt[c] }, c))
                    }
                  ) : /* @__PURE__ */ t("span", { children: pt[v.visual_mode] })
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ t("strong", { children: "画幅" }),
                  B ? /* @__PURE__ */ t(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: v.aspect_ratio,
                      disabled: n,
                      onChange: (c) => q((m) => ({
                        ...m,
                        aspect_ratio: c.target.value
                      })),
                      children: Cn.map((c) => /* @__PURE__ */ t("option", { value: c, children: c }, c))
                    }
                  ) : /* @__PURE__ */ t("span", { children: v.aspect_ratio })
                ] }),
                Ht || v.narrator_voice ? /* @__PURE__ */ s("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ t("strong", { children: "旁白音色" }),
                  B ? /* @__PURE__ */ t(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: v.narrator_voice,
                      placeholder: "自动配音时必填",
                      disabled: n,
                      onChange: (c) => q((m) => ({
                        ...m,
                        narrator_voice: c.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ t("span", { children: v.narrator_voice || "未配置" })
                ] }) : null,
                /* @__PURE__ */ s("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ t("strong", { children: "统一视觉风格" }),
                  B ? /* @__PURE__ */ t(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: v.style_prompt,
                      placeholder: "可选，整部作品保持一致的画面风格",
                      disabled: n,
                      onChange: (c) => q(
                        (m) => Pn(
                          m,
                          c.target.value
                        )
                      )
                    }
                  ) : /* @__PURE__ */ t(re, { label: v.style_prompt, children: /* @__PURE__ */ t("span", { children: v.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] }) }),
              v.materials.length || B ? /* @__PURE__ */ t(
                gr,
                {
                  materials: v.materials,
                  editable: B,
                  onOpen: U,
                  onCreate: Qt
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ s("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ t("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ s("div", { className: "ws-storyboard-toolbar-end", children: [
              Oe ? /* @__PURE__ */ s("div", { className: "ws-storyboard-view-tabs", role: "tablist", children: [
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": W === "script",
                    className: W === "script" ? "is-active" : "",
                    onClick: () => me("script"),
                    children: "分镜脚本"
                  }
                ),
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": W === "board",
                    className: W === "board" ? "is-active" : "",
                    onClick: () => me("board"),
                    children: "画面预览"
                  }
                )
              ] }) : null,
              u || B && $ ? /* @__PURE__ */ s("div", { className: "ws-storyboard-toolbar-meta", children: [
                u ? /* @__PURE__ */ s("span", { children: [
                  v.shots.length,
                  " 个镜头 ·",
                  " ",
                  Dt(v),
                  " 秒 · ",
                  v.aspect_ratio
                ] }) : null,
                B && $ ? /* @__PURE__ */ t(
                  Sr,
                  {
                    status: ve ? E || "saved" : Q
                  }
                ) : null
              ] }) : null,
              B ? /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: n || v.shots.length >= Ie,
                  onClick: nn,
                  children: [
                    /* @__PURE__ */ t(Ne, { size: 13 }),
                    /* @__PURE__ */ t("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              Me && _ ? /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: n || !!g,
                  onClick: () => {
                    _();
                  },
                  children: [
                    g === "revising" ? /* @__PURE__ */ t(Ce, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(ln, { size: 13 }),
                    g === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !Me && B && b ? /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: n || !!g || jt,
                  onClick: () => ae(!0),
                  children: [
                    g === "confirming" ? /* @__PURE__ */ t(Ce, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(pe, { size: 13 }),
                    g === "confirming" ? "确认中" : "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            W === "script" && B && Fe.length ? /* @__PURE__ */ t(
              zt,
              {
                issues: Fe,
                onOpen: st
              }
            ) : null,
            W === "board" && Oe ? /* @__PURE__ */ t(
              ar,
              {
                storyboard: v,
                sourceNodeId: w,
                canvasNodes: x
              }
            ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-grid nowheel", children: v.shots.length ? qt.map((c, m) => /* @__PURE__ */ t(
              An,
              {
                shot: c,
                index: m,
                storyboard: v,
                selected: z === c.id,
                editable: B,
                dragging: Re === c.id,
                dropPlacement: f === c.id && Re !== c.id ? T : void 0,
                onOpen: () => D(c.id),
                onDuplicate: () => tn(c),
                onRemove: () => en(c.id),
                onDragStart: () => Wt(c.id),
                onDragOver: (k) => Kt(c.id, k),
                onDrop: Xt,
                onDragEnd: lt
              },
              c.id
            )) : /* @__PURE__ */ s("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ t(Xe, { size: 26 }),
              /* @__PURE__ */ t("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ t("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        ke && b && !Me ? /* @__PURE__ */ t(
          Gn,
          {
            storyboard: v,
            lipSyncAvailable: A,
            submitting: g === "confirming",
            portalContainer: Le,
            onClose: () => ae(!1),
            onEditIssue: (c) => {
              ae(!1), st(c);
            },
            onConfirm: (c) => b(v, c)
          }
        ) : null,
        ye ? /* @__PURE__ */ t(
          vr,
          {
            shot: ye,
            index: Be,
            previousShot: Ut,
            storyboard: v,
            materials: v.materials,
            readonly: !B,
            referenceAdapter: it,
            portalContainer: Le,
            onEditMaterial: U,
            onGenerate: N,
            onSave: Gt,
            onClose: () => D("")
          },
          ye.id
        ) : null,
        ce ? /* @__PURE__ */ t(
          Fn,
          {
            material: ce,
            creating: !!H,
            readonly: !B,
            usage: Yt,
            existingNames: v.materials.filter((c) => c.id !== ce.id).map((c) => c.name),
            portalContainer: Le,
            onSave: Jt,
            onRemove: Zt,
            onClose: () => {
              U(""), G(null);
            }
          },
          `${H ? "create" : "edit"}:${ce.id}`
        ) : null
      ]
    }
  );
}
function gr({
  materials: e,
  editable: r,
  onOpen: a,
  onCreate: n
}) {
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ s("header", { children: [
      /* @__PURE__ */ t("strong", { children: "素材设定" }),
      r ? /* @__PURE__ */ t("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((i) => /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => n(i),
          children: [
            /* @__PURE__ */ t(Ne, { size: 11 }),
            se[i]
          ]
        },
        i
      )) }) : null
    ] }),
    /* @__PURE__ */ s("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((i) => {
        const l = e.filter(
          (b) => b.type === i
        );
        return l.length ? /* @__PURE__ */ s(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": i,
            children: [
              /* @__PURE__ */ t("span", { children: se[i] }),
              l.map((b) => /* @__PURE__ */ t(
                re,
                {
                  label: `${r ? "编辑" : "查看"}${se[i]}提示词：${b.name}`,
                  children: /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => a(b.id),
                      children: [
                        /* @__PURE__ */ t("span", { children: b.name }),
                        r ? /* @__PURE__ */ t(Nt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                b.id
              ))
            ]
          },
          i
        ) : null;
      }),
      e.length ? null : /* @__PURE__ */ t("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function vr({
  shot: e,
  index: r,
  previousShot: a,
  storyboard: n,
  materials: i,
  readonly: l,
  referenceAdapter: b,
  portalContainer: _,
  onEditMaterial: N,
  onGenerate: g,
  onSave: E,
  onClose: $
}) {
  const [u, y] = L(() => Vt(e)), [w, x] = L(() => i), [A, V] = L(!1);
  K(() => {
    x((o) => {
      const f = new Set(i.map((h) => h.id));
      return [
        ...i,
        ...o.filter((h) => !f.has(h.id))
      ];
    });
  }, [i]);
  const d = new Set(
    i.map((o) => o.id)
  ), S = w.filter(
    (o) => o.type === "character"
  ), p = new Set(
    u.speech.filter((o) => o.kind === "dialogue").map((o) => o.character_id || "").filter(Boolean)
  ), O = Ot(u), P = Ct(u, r), Q = Ir(u), M = u.speech.some(
    (o) => o.start_time < 0 || o.start_time >= u.duration
  ), z = !u.continuity_state.entry.trim() || !u.continuity_state.exit.trim() || P && u.continuity_state.entry.trim() !== a?.continuity_state.exit.trim() || r > 0 && (u.continue_previous && !u.continuity_anchor.trim() || u.continue_previous && u.match_previous), D = !u.beat.trim() || r > 0 && !u.transition.trim(), X = u.captions.some(
    (o) => !o.text.trim() || o.start_time < 0 || o.end_time <= o.start_time || o.end_time > u.duration
  ), U = (o, f, h) => {
    y((I) => ({
      ...I,
      ...wr(I, o, f, h)
    }));
  }, H = (o, f) => {
    y((h) => {
      const I = h.speech.map(
        (T) => T.id === o ? Nr(T, f) : T
      ), F = I.filter((T) => T.kind === "dialogue").map((T) => T.character_id || "").filter(Boolean);
      return {
        ...h,
        material_ids: [.../* @__PURE__ */ new Set([...h.material_ids, ...F])],
        speech: I
      };
    });
  }, G = (o) => {
    y((f) => f.material_ids.includes(o) ? p.has(o) ? f : {
      ...f,
      material_ids: f.material_ids.filter((h) => h !== o)
    } : {
      ...f,
      material_ids: [...f.material_ids, o]
    });
  }, ke = (o, f) => {
    y((h) => {
      const I = h.speech.findIndex(
        (Z) => Z.id === o
      ), F = I + f;
      if (I < 0 || F < 0 || F >= h.speech.length)
        return h;
      const T = [...h.speech], [fe] = T.splice(I, 1);
      return T.splice(F, 0, fe), { ...h, speech: T };
    });
  }, ae = (o, f) => {
    y((h) => ({
      ...h,
      captions: h.captions.map(
        (I) => I.id === o ? { ...I, ...f } : I
      )
    }));
  }, W = (o, f) => {
    y((h) => {
      const I = h.captions.findIndex(
        (Z) => Z.id === o
      ), F = I + f;
      if (I < 0 || F < 0 || F >= h.captions.length)
        return h;
      const T = [...h.captions], [fe] = T.splice(I, 1);
      return T.splice(F, 0, fe), { ...h, captions: T };
    });
  }, me = async (o) => {
    if (!g || A)
      return !1;
    V(!0);
    try {
      const f = {
        ...n,
        materials: w,
        shots: n.shots.map(
          (I) => I.id === u.id ? u : I
        )
      }, h = await g(
        f,
        u.id,
        o.trim()
      );
      return x(h.materials), y((I) => ({
        ...h.shot,
        reference_contents: { ...I.reference_contents || {} }
      })), !0;
    } finally {
      V(!1);
    }
  }, Re = /* @__PURE__ */ t(
    "div",
    {
      className: "ws-storyboard-shot-backdrop",
      "data-slot": "dialog-layer",
      onMouseDown: (o) => {
        o.target instanceof Element && o.target.closest('[data-assistant-layer="true"]') || A || $();
      },
      children: /* @__PURE__ */ s(
        "section",
        {
          className: "ws-storyboard-shot-dialog",
          "data-slot": "dialog-content",
          role: "dialog",
          "aria-modal": "true",
          "aria-busy": A,
          "aria-label": `${l ? "查看" : "编辑"}镜头 ${r + 1}`,
          onMouseDown: (o) => o.stopPropagation(),
          children: [
            /* @__PURE__ */ s("header", { children: [
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ s("strong", { children: [
                  l ? "查看镜头" : "编辑镜头",
                  " ",
                  String(r + 1).padStart(2, "0")
                ] }),
                /* @__PURE__ */ t("span", { children: l ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
              ] }),
              /* @__PURE__ */ t(re, { label: "关闭", children: /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  "aria-label": "关闭",
                  disabled: A,
                  onClick: $,
                  children: /* @__PURE__ */ t(Qe, { size: 18 })
                }
              ) })
            ] }),
            /* @__PURE__ */ s(
              "fieldset",
              {
                className: "ws-storyboard-shot-form nowheel",
                disabled: A,
                children: [
                  A ? /* @__PURE__ */ s("div", { className: "ws-storyboard-generation-mask", role: "status", children: [
                    /* @__PURE__ */ t(Ce, { size: 18, className: "ws-spin" }),
                    /* @__PURE__ */ t("span", { children: "正在生成镜头" })
                  ] }) : null,
                  /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ t("strong", { children: "镜头内容" }),
                      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ s("label", { children: [
                        "时长",
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "number",
                            min: Ee,
                            step: 1,
                            value: u.duration,
                            disabled: l,
                            onChange: (o) => y((f) => ({
                              ...f,
                              duration: kr(
                                o,
                                f.duration
                              )
                            }))
                          }
                        ),
                        "秒"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ s("label", { children: [
                      /* @__PURE__ */ t("span", { children: "镜头图片" }),
                      /* @__PURE__ */ t(
                        "select",
                        {
                          value: u.shot_image_mode,
                          disabled: l,
                          onChange: (o) => y((f) => ({
                            ...f,
                            shot_image_mode: Dn(
                              o.target.value
                            )
                          })),
                          children: Mn(u).map((o) => /* @__PURE__ */ t("option", { value: o, children: o === "first_frame" && u.continue_previous ? "首帧（沿用上镜尾帧）" : o === "last_frame" && u.continue_previous ? "尾帧（首帧沿用上镜）" : On[o] }, o))
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ s(
                      "details",
                      {
                        className: `ws-storyboard-continuity-settings${z ? " is-invalid" : ""}`,
                        open: z || void 0,
                        children: [
                          /* @__PURE__ */ s("summary", { children: [
                            /* @__PURE__ */ s("span", { children: [
                              "连续性设置",
                              /* @__PURE__ */ t("small", { children: "高级" })
                            ] }),
                            /* @__PURE__ */ t("b", { children: z ? "需要处理" : r === 0 ? "首镜" : u.continue_previous ? "动作延续" : u.match_previous ? "画面匹配" : "独立切镜" })
                          ] }),
                          /* @__PURE__ */ s("div", { children: [
                            r > 0 ? /* @__PURE__ */ t("div", { className: "ws-storyboard-continuity-modes", children: br.map((o) => /* @__PURE__ */ s(
                              "label",
                              {
                                className: `ws-storyboard-continuity-input${Q === o.value ? " is-selected" : ""}`,
                                children: [
                                  /* @__PURE__ */ t(
                                    "input",
                                    {
                                      type: "radio",
                                      name: `storyboard-continuity-${e.id}`,
                                      value: o.value,
                                      checked: Q === o.value,
                                      disabled: l,
                                      onChange: () => y(
                                        (f) => Cr(
                                          f,
                                          o.value,
                                          a
                                        )
                                      )
                                    }
                                  ),
                                  /* @__PURE__ */ s("span", { children: [
                                    /* @__PURE__ */ t("strong", { children: o.label }),
                                    /* @__PURE__ */ t("small", { children: o.description })
                                  ] })
                                ]
                              },
                              o.value
                            )) }) : null,
                            r > 0 && u.continue_previous ? /* @__PURE__ */ s("label", { className: "ws-storyboard-continuity-anchor", children: [
                              /* @__PURE__ */ t("span", { children: "连续性锚点" }),
                              /* @__PURE__ */ t(
                                "textarea",
                                {
                                  value: u.continuity_anchor,
                                  readOnly: l,
                                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                  onChange: (o) => y((f) => ({
                                    ...f,
                                    continuity_anchor: o.target.value
                                  }))
                                }
                              )
                            ] }) : null,
                            z ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "请填写入镜和出镜状态；匹配或延续上一镜时，入镜状态必须等于上一镜出镜状态；视频延续还必须填写连续性锚点。" }) : null,
                            /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-field-row", children: [
                              /* @__PURE__ */ t(
                                Te,
                                {
                                  label: "入镜状态",
                                  value: u.continuity_state.entry,
                                  placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                  readonly: l || P,
                                  onChange: (o) => y((f) => ({
                                    ...f,
                                    continuity_state: {
                                      ...f.continuity_state,
                                      entry: o
                                    }
                                  }))
                                }
                              ),
                              /* @__PURE__ */ t(
                                Te,
                                {
                                  label: "出镜状态",
                                  value: u.continuity_state.exit,
                                  placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                  readonly: l,
                                  onChange: (o) => y((f) => ({
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
                    /* @__PURE__ */ s(
                      "div",
                      {
                        className: `ws-storyboard-shot-field-row ${r === 0 ? "is-single" : ""}`,
                        children: [
                          /* @__PURE__ */ t(
                            Te,
                            {
                              label: "本镜变化",
                              value: u.beat,
                              placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                              readonly: l,
                              onChange: (o) => y((f) => ({ ...f, beat: o }))
                            }
                          ),
                          r > 0 ? /* @__PURE__ */ t(
                            Te,
                            {
                              label: "与上镜关系",
                              value: u.transition,
                              placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                              readonly: l,
                              onChange: (o) => y((f) => ({
                                ...f,
                                transition: o
                              }))
                            }
                          ) : null
                        ]
                      }
                    ),
                    r > 0 ? /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ s("label", { children: [
                        /* @__PURE__ */ t("span", { children: "剪辑转场" }),
                        /* @__PURE__ */ t(
                          "select",
                          {
                            value: u.transition_type,
                            disabled: l,
                            onChange: (o) => y((f) => {
                              const h = o.target.value;
                              return {
                                ...f,
                                transition_type: h,
                                transition_duration_ms: h === "none" ? 0 : Math.max(500, f.transition_duration_ms)
                              };
                            }),
                            children: kt.map((o) => /* @__PURE__ */ t("option", { value: o, children: Tn[o] }, o))
                          }
                        )
                      ] }),
                      u.transition_type !== "none" ? /* @__PURE__ */ s("label", { children: [
                        /* @__PURE__ */ t("span", { children: "转场时长" }),
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "number",
                            min: 100,
                            max: 5e3,
                            step: 100,
                            value: u.transition_duration_ms,
                            disabled: l,
                            onChange: (o) => y((f) => ({
                              ...f,
                              transition_duration_ms: Math.min(
                                5e3,
                                Rr(
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
                    D ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ t(
                      je,
                      {
                        label: "镜头描述",
                        value: u.description,
                        content: u.reference_contents?.description,
                        placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                        readonly: l,
                        referenceAdapter: b,
                        onChange: (o, f) => U("description", o, f)
                      }
                    ) }),
                    /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ t(
                        je,
                        {
                          label: "镜头语言",
                          value: u.camera_instruction,
                          content: u.reference_contents?.camera_instruction,
                          placeholder: "景别、机位和运动方式",
                          readonly: l,
                          referenceAdapter: b,
                          onChange: (o, f) => U("camera_instruction", o, f)
                        }
                      ),
                      /* @__PURE__ */ t(
                        je,
                        {
                          label: "视频提示词",
                          value: u.video_prompt,
                          content: u.reference_contents?.video_prompt,
                          placeholder: "完整描述动作、运镜、光线与风格",
                          readonly: l,
                          referenceAdapter: b,
                          onChange: (o, f) => U("video_prompt", o, f)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ s("div", { children: [
                      /* @__PURE__ */ t("strong", { children: "关联素材" }),
                      /* @__PURE__ */ s("span", { children: [
                        u.material_ids.length,
                        " 个素材"
                      ] })
                    ] }) }),
                    w.length ? /* @__PURE__ */ t("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((o) => {
                      const f = w.filter(
                        (h) => h.type === o
                      );
                      return f.length ? /* @__PURE__ */ s("fieldset", { children: [
                        /* @__PURE__ */ t("legend", { children: se[o] }),
                        /* @__PURE__ */ t("div", { children: f.map((h) => {
                          const I = u.material_ids.includes(
                            h.id
                          ), F = p.has(h.id), T = d.has(
                            h.id
                          );
                          return /* @__PURE__ */ s(
                            "div",
                            {
                              className: "ws-storyboard-material-option",
                              children: [
                                /* @__PURE__ */ t(
                                  re,
                                  {
                                    label: I && F ? "该角色已用于对白，不能取消关联" : I ? "取消关联" : "关联素材",
                                    children: /* @__PURE__ */ s("label", { children: [
                                      /* @__PURE__ */ t(
                                        "input",
                                        {
                                          type: "checkbox",
                                          checked: I,
                                          disabled: l || I && F,
                                          onChange: () => G(h.id)
                                        }
                                      ),
                                      /* @__PURE__ */ s("span", { className: "sr-only", children: [
                                        "关联 ",
                                        h.name
                                      ] })
                                    ] })
                                  }
                                ),
                                /* @__PURE__ */ t(
                                  re,
                                  {
                                    label: T ? `${l ? "查看" : "编辑"}${se[o]}提示词：${h.name}` : `AI 新增${se[o]}，确认镜头后可编辑：${h.name}`,
                                    children: /* @__PURE__ */ s(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: !T,
                                        onClick: () => N(h.id),
                                        children: [
                                          /* @__PURE__ */ t("span", { children: h.name }),
                                          !l && T ? /* @__PURE__ */ t(Nt, { size: 11 }) : null
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
                      ] }, o) : null;
                    }) }) : /* @__PURE__ */ t("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                  ] }),
                  /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ s("div", { children: [
                        /* @__PURE__ */ t("strong", { children: "角色配音与旁白" }),
                        /* @__PURE__ */ s("span", { children: [
                          u.speech.length,
                          " 条语音"
                        ] })
                      ] }),
                      l ? null : /* @__PURE__ */ s("div", { children: [
                        /* @__PURE__ */ s(
                          "button",
                          {
                            type: "button",
                            onClick: () => y((o) => ({
                              ...o,
                              speech: [
                                ...o.speech,
                                mt(o, "dialogue")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ t(Ne, { size: 13 }),
                              "添加对白"
                            ]
                          }
                        ),
                        /* @__PURE__ */ s(
                          "button",
                          {
                            type: "button",
                            onClick: () => y((o) => ({
                              ...o,
                              speech: [
                                ...o.speech,
                                mt(o, "narration")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ t(Ne, { size: 13 }),
                              "添加旁白"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-speech-list", children: u.speech.length ? u.speech.map((o, f) => /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ s("strong", { children: [
                          "语音 ",
                          f + 1
                        ] }),
                        l ? null : /* @__PURE__ */ s("div", { children: [
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "上移语音",
                              disabled: f === 0,
                              onClick: () => ke(o.id, -1),
                              children: /* @__PURE__ */ t(ct, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "下移语音",
                              disabled: f === u.speech.length - 1,
                              onClick: () => ke(o.id, 1),
                              children: /* @__PURE__ */ t(dt, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "删除语音",
                              danger: !0,
                              onClick: () => y((h) => ({
                                ...h,
                                speech: h.speech.filter(
                                  (I) => I.id !== o.id
                                )
                              })),
                              children: /* @__PURE__ */ t(Ke, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ s("label", { children: [
                          "类型",
                          /* @__PURE__ */ s(
                            "select",
                            {
                              value: o.kind,
                              disabled: l,
                              onChange: (h) => H(o.id, {
                                kind: h.target.value
                              }),
                              children: [
                                /* @__PURE__ */ t("option", { value: "dialogue", children: "角色对白" }),
                                /* @__PURE__ */ t("option", { value: "narration", children: "旁白" })
                              ]
                            }
                          )
                        ] }),
                        o.kind === "dialogue" ? /* @__PURE__ */ s(We, { children: [
                          /* @__PURE__ */ s("label", { children: [
                            "角色",
                            /* @__PURE__ */ s(
                              "select",
                              {
                                value: o.character_id || "",
                                disabled: l,
                                onChange: (h) => H(o.id, {
                                  character_id: h.target.value
                                }),
                                children: [
                                  /* @__PURE__ */ t("option", { value: "", children: "请选择角色" }),
                                  S.map((h) => /* @__PURE__ */ t("option", { value: h.id, children: h.name }, h.id))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ s("label", { children: [
                            "说话方式",
                            /* @__PURE__ */ s(
                              "select",
                              {
                                value: o.speaker_mode || "offscreen",
                                disabled: l,
                                onChange: (h) => H(o.id, {
                                  speaker_mode: h.target.value === "visible" ? "visible" : "offscreen"
                                }),
                                children: [
                                  /* @__PURE__ */ t("option", { value: "visible", children: "出镜对白" }),
                                  /* @__PURE__ */ t("option", { value: "offscreen", children: "画外音" })
                                ]
                              }
                            )
                          ] })
                        ] }) : null,
                        /* @__PURE__ */ s("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: Math.max(0, u.duration - 0.01),
                                step: 0.1,
                                value: o.start_time,
                                disabled: l,
                                onChange: (h) => H(o.id, {
                                  start_time: He(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ s("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ t(
                          "textarea",
                          {
                            value: o.text,
                            readOnly: l,
                            placeholder: o.kind === "narration" ? "输入旁白" : "输入对白",
                            onChange: (h) => H(o.id, { text: h.target.value })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-subtitle", children: [
                        /* @__PURE__ */ s("label", { children: [
                          /* @__PURE__ */ t(
                            "input",
                            {
                              type: "checkbox",
                              checked: o.subtitle_enabled,
                              disabled: l,
                              onChange: (h) => H(o.id, {
                                subtitle_enabled: h.target.checked
                              })
                            }
                          ),
                          "加入字幕"
                        ] }),
                        o.subtitle_enabled ? /* @__PURE__ */ t(
                          "input",
                          {
                            value: o.subtitle_text,
                            readOnly: l,
                            placeholder: "可选：填写精简字幕；留空使用原文",
                            onChange: (h) => H(o.id, {
                              subtitle_text: h.target.value
                            })
                          }
                        ) : null
                      ] })
                    ] }, o.id)) : /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ t(cn, { size: 24 }),
                      /* @__PURE__ */ t("span", { children: "当前镜头没有对白或旁白" })
                    ] }) }),
                    O.size > 1 ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
                    M ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
                  ] }),
                  /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ s("div", { children: [
                        /* @__PURE__ */ t("strong", { children: "附加字幕文案" }),
                        /* @__PURE__ */ s("span", { children: [
                          u.captions.length,
                          " 条文案"
                        ] })
                      ] }),
                      l ? null : /* @__PURE__ */ s(
                        "button",
                        {
                          type: "button",
                          onClick: () => y((o) => ({
                            ...o,
                            captions: [
                              ...o.captions,
                              En(o)
                            ]
                          })),
                          children: [
                            /* @__PURE__ */ t(Ne, { size: 13 }),
                            "添加文案"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-speech-list", children: u.captions.length ? u.captions.map((o, f) => /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ s("strong", { children: [
                          "文案 ",
                          f + 1
                        ] }),
                        l ? null : /* @__PURE__ */ s("div", { children: [
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "上移文案",
                              disabled: f === 0,
                              onClick: () => W(o.id, -1),
                              children: /* @__PURE__ */ t(ct, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "下移文案",
                              disabled: f === u.captions.length - 1,
                              onClick: () => W(o.id, 1),
                              children: /* @__PURE__ */ t(dt, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            ue,
                            {
                              label: "删除文案",
                              danger: !0,
                              onClick: () => y((h) => ({
                                ...h,
                                captions: h.captions.filter(
                                  (I) => I.id !== o.id
                                )
                              })),
                              children: /* @__PURE__ */ t(Ke, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ s("label", { children: [
                          "类型",
                          /* @__PURE__ */ s(
                            "select",
                            {
                              value: o.type,
                              disabled: l,
                              onChange: (h) => ae(o.id, {
                                type: h.target.value
                              }),
                              children: [
                                /* @__PURE__ */ t("option", { value: "caption", children: "说明" }),
                                /* @__PURE__ */ t("option", { value: "title", children: "标题" }),
                                /* @__PURE__ */ t("option", { value: "highlight", children: "重点" })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ s("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: u.duration,
                                step: 0.1,
                                value: o.start_time,
                                disabled: l,
                                onChange: (h) => ae(o.id, {
                                  start_time: He(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] }),
                        /* @__PURE__ */ s("label", { children: [
                          "结束时间",
                          /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0.1,
                                max: u.duration,
                                step: 0.1,
                                value: o.end_time,
                                disabled: l,
                                onChange: (h) => ae(o.id, {
                                  end_time: He(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ s("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ t(
                          "textarea",
                          {
                            value: o.text,
                            readOnly: l,
                            placeholder: "输入不对应语音的标题、说明或重点文字",
                            onChange: (h) => ae(o.id, {
                              text: h.target.value
                            })
                          }
                        )
                      ] })
                    ] }, o.id)) : /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ t(Xe, { size: 24 }),
                      /* @__PURE__ */ t("span", { children: "当前镜头没有附加字幕文案" })
                    ] }) }),
                    X ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ s("footer", { children: [
              !l && g ? /* @__PURE__ */ t(
                ur,
                {
                  title: `AI 生成镜头 ${String(r + 1).padStart(2, "0")}`,
                  description: "可以补充本镜头的内容、动作、镜头语言或素材要求；不填也会按当前分镜生成。",
                  triggerLabel: "AI 生成",
                  triggerClassName: "is-ai",
                  triggerVariant: "outline",
                  triggerSize: "sm",
                  disabled: A,
                  textareaPlaceholder: "可选：输入本次镜头的补充要求，留空则按当前分镜上下文生成。",
                  submitLabel: "确定生成",
                  loadingText: "正在生成镜头",
                  errorText: "生成镜头失败",
                  referencesEnabled: !1,
                  stoppable: !1,
                  onSubmit: ({ instruction: o }) => me(o)
                }
              ) : null,
              /* @__PURE__ */ t("button", { type: "button", disabled: A, onClick: $, children: l ? "关闭" : "取消" }),
              l ? null : /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: A || O.size > 1 || M || D || z || X,
                  onClick: () => E(
                    u,
                    w.filter(
                      (o) => d.has(o.id) || u.material_ids.includes(o.id)
                    )
                  ),
                  children: [
                    /* @__PURE__ */ t(pe, { size: 14 }),
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
  return typeof document > "u" ? null : Je(Re, _ || document.body);
}
function je({
  label: e,
  value: r,
  content: a,
  placeholder: n,
  readonly: i,
  referenceAdapter: l,
  onChange: b
}) {
  return /* @__PURE__ */ s("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t(
      Bn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: r,
        content: a,
        adapter: l,
        placeholder: n,
        disabled: i,
        layerZIndex: 2700,
        onChange: b
      }
    )
  ] });
}
function Te({
  label: e,
  value: r,
  placeholder: a,
  readonly: n,
  onChange: i
}) {
  return /* @__PURE__ */ s("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: r,
        rows: 3,
        placeholder: a,
        readOnly: n,
        onChange: (l) => i(l.target.value)
      }
    )
  ] });
}
function yr(e, r) {
  return {
    ...e,
    shots: e.shots.map((a) => {
      const n = { ...a.reference_contents || {} };
      for (const i of _r) {
        const l = xn(
          a[i],
          n[i],
          r
        );
        l ? n[i] = l : delete n[i];
      }
      return { ...a, reference_contents: n };
    })
  };
}
const _r = [
  "description",
  "camera_instruction",
  "video_prompt"
];
function wr(e, r, a, n) {
  const i = { ...e.reference_contents || {} };
  return n ? i[r] = n : delete i[r], {
    [r]: a,
    reference_contents: i
  };
}
function ue({
  label: e,
  disabled: r,
  danger: a = !1,
  onClick: n,
  children: i
}) {
  return /* @__PURE__ */ t(re, { label: e, children: /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${a ? "is-danger" : ""}`,
      "aria-label": e,
      disabled: r,
      onClick: n,
      children: i
    }
  ) });
}
function Sr({ status: e }) {
  return /* @__PURE__ */ s("span", { className: `ws-storyboard-save-state is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ t(Ce, { size: 12, className: "ws-spin" }) : e === "saved" ? /* @__PURE__ */ t(pe, { size: 12 }) : null,
    e === "typing" ? "编辑中" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存"
  ] });
}
function Nr(e, r) {
  const a = { ...e, ...r };
  return a.kind === "dialogue" ? (a.character_id ||= "", a.speaker_mode ||= "offscreen") : (delete a.character_id, delete a.speaker_mode), a.subtitle_enabled = !!a.subtitle_enabled, a.subtitle_text ||= "", a;
}
function Ir(e) {
  return e.continue_previous ? "continue" : e.match_previous ? "match" : "independent";
}
function Cr(e, r, a) {
  const n = r !== "independent", i = r === "continue";
  return {
    ...e,
    match_previous: r === "match",
    continue_previous: i,
    shot_image_mode: Tt({
      ...e,
      match_previous: r === "match",
      continue_previous: i
    }).mode,
    continuity_anchor: i ? e.continuity_anchor : "",
    continuity_state: n ? {
      ...e.continuity_state,
      entry: a?.continuity_state.exit || e.continuity_state.entry
    } : e.continuity_state
  };
}
function kr(e, r) {
  const a = Number(e.target.value);
  return It(a) ? a : r;
}
function Rr(e, r, a) {
  const n = Number(e.target.value);
  return Number.isInteger(n) && n >= a ? n : r;
}
function He(e) {
  const r = Number.parseFloat(e.target.value);
  return Number.isFinite(r) && r >= 0 ? r : 0;
}
function Ft(e) {
  const r = new Set(e.map((i) => i.id));
  let a = e.length, n = ft(a);
  for (; r.has(n.id); )
    a += 1, n = ft(a);
  return n;
}
function $r(e, r) {
  const a = Ft(e);
  return {
    ...Vt(r),
    id: a.id,
    order: a.order,
    speech: r.speech.map((n, i) => ({
      ...n,
      id: `${a.id}-speech-${i + 1}`
    })),
    captions: r.captions.map((n, i) => ({
      ...n,
      id: `${a.id}-caption-${i + 1}`
    }))
  };
}
function Vt(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    continuity_state: { ...e.continuity_state },
    speech: e.speech.map((r) => ({ ...r })),
    captions: e.captions.map((r) => ({ ...r })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
export {
  Br as StoryboardView
};
