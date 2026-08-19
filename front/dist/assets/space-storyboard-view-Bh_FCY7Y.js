import { j as t, a as i, F as Ye } from "./preloadable-Bomi5PEU.js";
import { a as E, b as X, u as Z, d as K, g as Xt } from "./_commonjsHelpers-61wyk6v6.js";
import { d as je } from "./file-kind-UfTAlHnR.js";
import { X as He, h as Ue, o as me, m as Gt, L as Ne, u as Jt, aB as Qt, B as qe, P as we, r as Zt, O as vt, ap as it, aq as at, t as en } from "./vendor-icons-B3DKX3la.js";
import { S as ae, B as ee, x as tn, M as Se, z as nn, E as he, F as yt, G as _t, H as wt, I as St, J as Nt, K as Ct, L as Ke, N as rn, O as kt, a as an, P as sn, g as on, s as It, Q as ln, R as cn, T as dn, U as st, b as un, i as pn, V as ot, W as hn, X as mn, Y as lt, Z as fn, _ as bn, $ as gn, a0 as vn, a1 as yn, a2 as _n, a3 as ct, a4 as wn, a5 as dt, a6 as Sn } from "./upload-asset-api-MyhTP8sK.js";
import { o as ut, s as Le, m as Nn, J as Cn } from "./space-sequence-card-BHJhPhFZ.js";
import { u as $t, a as kn, b as In } from "./space-reference-editor-Dev_4xpZ.js";
import { a as $n } from "./space-storyboard-shot-card-8VmZWQEk.js";
import { b as Rn } from "./node-detail-content-CGnopeKL.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-view-BRjaAamB.css", import.meta.url).href]);
function On({
  material: e,
  creating: n = !1,
  readonly: a,
  usage: r,
  existingNames: o = [],
  portalContainer: d,
  onSave: f,
  onRemove: $,
  onClose: I
}) {
  const [b, B] = E(e.name), [O, p] = E(e.prompt), [_, w] = E(e.voice), [L, T] = E(!1), A = b.trim().replace(/^[@#]+/, ""), l = O.trim(), g = o.some(
    (R) => R.trim().toLocaleLowerCase() === A.toLocaleLowerCase()
  ), y = (r?.shotIds.length || 0) + (r?.speechIds.length || 0), P = !n && !a && !!$ && y === 0, V = ae[e.type];
  X(() => {
    function R(D) {
      D.key === "Escape" && (D.preventDefault(), I());
    }
    return window.addEventListener("keydown", R), () => window.removeEventListener("keydown", R);
  }, [I]);
  const W = /* @__PURE__ */ t(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: I,
      children: /* @__PURE__ */ i(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${n ? "新增" : a ? "查看" : "编辑"}${V}素材 ${e.name}`,
          onMouseDown: (R) => R.stopPropagation(),
          children: [
            /* @__PURE__ */ i("header", { children: [
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ t("strong", { children: n ? `新增${V}` : e.name || V }),
                /* @__PURE__ */ i("span", { children: [
                  V,
                  "素材",
                  a ? " · 当前版本只读" : n ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ t(ee, { label: "关闭", children: /* @__PURE__ */ t("button", { type: "button", "aria-label": "关闭", onClick: I, children: /* @__PURE__ */ t(He, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ i("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ t("span", { children: "素材名称" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    value: b,
                    readOnly: a,
                    autoFocus: !a,
                    placeholder: `例如：${e.type === "character" ? "主角" : e.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (R) => B(R.target.value)
                  }
                ),
                g ? /* @__PURE__ */ t("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ t("span", { children: "生成提示词" }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    value: O,
                    readOnly: a,
                    placeholder: `描述${A || V}的外观、结构、材质与风格`,
                    onChange: (R) => p(R.target.value)
                  }
                )
              ] }),
              e.type === "character" ? /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ t("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    value: _,
                    readOnly: a,
                    placeholder: "留空使用语音能力默认音色",
                    onChange: (R) => w(R.target.value)
                  }
                ),
                /* @__PURE__ */ t("small", { children: "填写语音能力实际接受的音色值，不绑定具体供应商。" })
              ] }) : null,
              !n && y > 0 ? /* @__PURE__ */ i("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ t("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ i("span", { children: [
                  r?.shotIds.length || 0,
                  " 个镜头",
                  r?.speechIds.length ? ` · ${r.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ t("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ i("footer", { children: [
              /* @__PURE__ */ t("div", { children: !a && !n && $ ? /* @__PURE__ */ t(
                ee,
                {
                  label: y > 0 ? "该素材仍被镜头或对白引用" : L ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ i(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !P,
                      onClick: () => {
                        if (!L) {
                          T(!0);
                          return;
                        }
                        $(e.id);
                      },
                      children: [
                        /* @__PURE__ */ t(Ue, { size: 14 }),
                        L ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ t("button", { type: "button", onClick: I, children: a ? "关闭" : "取消" }),
                a ? null : /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !A || !l || g,
                    onClick: () => f({
                      ...e,
                      name: A,
                      prompt: l,
                      voice: e.type === "character" ? _.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ t(me, { size: 14 }),
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
  return typeof document > "u" ? null : je(W, d || document.body);
}
function Rt(e, n = {}) {
  const a = zn(e, n), r = [], o = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Set(), I = new Map(
    e.references.map((l) => [l.key, l])
  ), b = /* @__PURE__ */ new Set();
  if (n.workTypeSpecs?.length && n.purposeSpecs?.length) {
    const l = tn(
      e.references,
      e.work_type,
      n.workTypeSpecs,
      n.purposeSpecs
    );
    l && r.push(Q("references", l));
  }
  e.title.trim() || r.push(Q("title", "分镜标题不能为空")), e.summary.trim() || r.push(Q("summary", "请补充整个脚本的内容简介")), a.referenceImages && !e.style_prompt.trim() && r.push(Q("style_prompt", "请补充统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > Se) && r.push(
    Q(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${Se} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && r.push(Q("target_shot_count", "目标镜头数与实际镜头数不一致"));
  const B = nn(e.shots);
  !Number.isInteger(e.target_duration) || e.target_duration < 4 ? r.push(Q("target_duration", "目标总时长必须是不小于 4 秒的整数")) : e.target_duration !== B && r.push(Q("target_duration", "目标总时长与镜头时长之和不一致"));
  for (const l of e.materials) {
    const g = l.name.trim(), y = g.toLocaleLowerCase();
    l.id.trim() ? o.has(l.id) && r.push(ne(l, `素材标识“${l.id}”重复`)) : r.push(ne(l, "缺少稳定标识")), g ? d.has(y) && r.push(ne(l, `素材名称“${g}”重复`)) : r.push(ne(l, "名称不能为空")), a.referenceImages && !l.prompt.trim() && r.push(ne(l, "生成提示词不能为空")), l.type !== "character" && l.voice.trim() && r.push(ne(l, "只有角色可以配置音色"));
    for (const P of l.reference_keys) {
      const V = I.get(P);
      V ? n.purposeSpecs?.length && he(
        V.purpose,
        n.purposeSpecs || []
      )?.material_type !== l.type ? r.push(ne(l, `参考素材“${V.label}”的用途不匹配`)) : b.add(P) : r.push(ne(l, `引用了不存在的参考素材“${P}”`));
    }
    d.add(y), o.set(l.id, l);
  }
  if (!e.shots.length)
    return r.push(Q("shots", "分镜至少需要一个镜头")), r;
  let O = /* @__PURE__ */ new Set(), p = !1, _ = "", w = 0;
  const L = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
  e.shots.forEach((l, g) => {
    const y = g + 1;
    (!l.id.trim() || L.has(l.id)) && r.push(k(l, y, "镜头标识缺失或重复")), L.add(l.id), yt(l.duration) || r.push(
      k(l, y, "时长必须是不小于 4 秒的整数")
    ), l.beat.trim() ? ht(T, l.beat, l, y, "本镜变化", r) : r.push(k(l, y, "请填写本镜变化")), g === 0 && l.transition.trim() ? r.push(k(l, y, "第一镜不能填写上镜承接关系")) : g > 0 && !l.transition.trim() && r.push(k(l, y, "请说明与上一镜头的承接关系")), l.description.trim() ? ht(
      A,
      l.description,
      l,
      y,
      "镜头描述",
      r
    ) : r.push(k(l, y, "镜头描述不能为空")), a.shotVideos && !l.video_prompt.trim() && r.push(k(l, y, "视频提示词不能为空"));
    for (const F of l.reference_keys) {
      const x = I.get(F);
      x ? n.purposeSpecs?.length && he(
        x.purpose,
        n.purposeSpecs || []
      )?.scope !== "shot" ? r.push(
        k(l, y, `参考素材“${x.label}”的用途不匹配`)
      ) : b.add(F) : r.push(
        k(l, y, `引用了不存在的参考素材“${F}”`)
      );
    }
    const P = /* @__PURE__ */ new Set();
    for (const F of l.material_ids)
      o.has(F) ? P.has(F) && r.push(
        k(l, y, `重复引用素材“${F}”`)
      ) : r.push(
        k(l, y, `引用了不存在的素材“${F}”`)
      ), P.add(F);
    g === 0 && l.continue_previous && r.push(k(l, y, "第一个镜头不能承接上一镜头")), g === 0 && l.match_previous && r.push(k(l, y, "第一个镜头不能匹配上一镜头")), l.match_previous && l.continue_previous && r.push(k(l, y, "不能同时匹配上一镜画面和延续上一镜视频"));
    const V = l.continuity_state?.entry.trim() || "", W = l.continuity_state?.exit.trim() || "";
    a.referenceImages && (V || r.push(k(l, y, "请填写入镜状态")), W || r.push(k(l, y, "请填写出镜状态")), _t(l, g) && V !== _ && r.push(
      k(l, y, "入镜状态必须与上一镜头的出镜状态完全一致")
    )), a.shotVideos && (wt.includes(l.transition_type) || r.push(k(l, y, "结构化转场类型无效")), g === 0 && (l.transition_type !== "none" || l.transition_duration_ms !== 0) ? r.push(k(l, y, "第一镜不能配置转场效果")) : l.transition_type === "none" && l.transition_duration_ms !== 0 ? r.push(k(l, y, "硬切的转场时长必须为 0")) : l.transition_type !== "none" && (l.transition_duration_ms < 100 || l.transition_duration_ms > 5e3) && r.push(k(l, y, "转场时长必须是 100 到 5000 毫秒")));
    const R = xn(
      P,
      o
    );
    a.shotVideos && l.continue_previous ? (w += 1, l.continuity_anchor.trim() || r.push(k(l, y, "请填写连续性锚点")), w >= 3 && r.push(
      De(
        `shot:${l.id}:continuity-chain`,
        `镜头 ${y}：连续动作跨越 4 个以上镜头，建议检查节奏`,
        l.id
      )
    ), Pn(O, R) || r.push(
      k(
        l,
        y,
        "动作续接时不能新增、移除或更换角色与场景"
      )
    )) : w = 0;
    let D = !1;
    (a.voice || a.subtitles || a.lipSync) && (D = Dn(
      l,
      y,
      o,
      P,
      f,
      r,
      {
        validateTimeline: a.voice,
        validateVisibleSpeakers: a.lipSync
      }
    )), a.lipSync && l.continue_previous && (p || D) && r.push(
      De(
        `shot:${l.id}:visible-dialogue-continuity`,
        `镜头 ${y}：出镜对白跨越动作续接边界，建议检查口型衔接`,
        l.id
      )
    ), a.subtitles && Tn(l, y, $, r), O = R, p = D, _ = W;
  });
  for (const l of e.references) {
    const g = he(
      l.purpose,
      n.purposeSpecs || []
    )?.scope;
    (g === "material" || g === "shot") && !b.has(l.key) && r.push(
      De(
        `reference:${l.key}`,
        `参考素材“${l.label}”尚未关联到具体目标`
      )
    );
  }
  return r;
}
function Dn(e, n, a, r, o, d, f) {
  for (const I of e.speech) {
    if ((!I.id.trim() || o.has(I.id)) && d.push(k(e, n, "语音标识缺失或重复")), o.add(I.id), I.text.trim() || d.push(k(e, n, "对白或旁白文本不能为空")), (I.start_time < 0 || I.start_time >= e.duration) && d.push(k(e, n, "语音开始时间超出镜头范围")), I.kind !== "dialogue")
      continue;
    const b = I.character_id || "";
    a.get(b)?.type !== "character" ? d.push(k(e, n, "对白没有选择有效角色")) : r.has(b) || d.push(k(e, n, "对白角色未关联到当前镜头"));
  }
  const $ = kt(e);
  return f.validateVisibleSpeakers && $.size > 1 && d.push(k(e, n, "最多只能有一个出镜说话角色")), f.validateTimeline && Mn(e, n, d), $.size > 0;
}
function Mn(e, n, a) {
  const r = e.speech.filter((o) => o.text.trim()).map((o) => ({
    speech: o,
    start: o.start_time,
    end: o.start_time + Math.max(0.6, En(o) / 3.5)
  })).sort((o, d) => o.start - d.start);
  for (let o = 0; o < r.length; o += 1) {
    const d = r[o];
    d.end > e.duration + 0.01 && a.push(
      pt(
        `shot:${e.id}:speech:${d.speech.id}:duration`,
        `镜头 ${n} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const f = r[o + 1];
    f && d.end > f.start + 0.01 && a.push(
      pt(
        `shot:${e.id}:speech:${d.speech.id}:overlap`,
        `镜头 ${n} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function Tn(e, n, a, r) {
  for (const o of e.captions)
    (!o.id.trim() || a.has(o.id)) && r.push(k(e, n, "字幕标识缺失或重复")), a.add(o.id), o.text.trim() || r.push(k(e, n, "字幕文案不能为空")), (o.start_time < 0 || o.end_time <= o.start_time || o.end_time > e.duration) && r.push(k(e, n, "字幕时间范围超出镜头"));
}
function En(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function Pn(e, n) {
  if (e.size !== n.size)
    return !1;
  for (const a of e)
    if (!n.has(a))
      return !1;
  return !0;
}
function xn(e, n) {
  return new Set(
    [...e].filter((a) => {
      const r = n.get(a)?.type;
      return r === "character" || r === "scene";
    })
  );
}
function zn(e, n) {
  return n.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1,
    lipSync: !1
  } : {
    referenceImages: rn(e),
    shotVideos: Ke(e),
    voice: Ct(e),
    subtitles: Nt(e),
    lipSync: St(e)
  };
}
function Q(e, n) {
  return { id: e, message: n, severity: "error" };
}
function ne(e, n) {
  return {
    id: `material:${e.id}:${n}`,
    message: `${e.name || "未命名素材"}：${n}`,
    severity: "error",
    materialId: e.id
  };
}
function k(e, n, a) {
  return {
    id: `shot:${e.id}:${a}`,
    message: `镜头 ${n}：${a}`,
    severity: "error",
    shotId: e.id
  };
}
function De(e, n, a) {
  return { id: e, message: n, severity: "warning", shotId: a };
}
function pt(e, n, a) {
  return { id: e, message: n, severity: "error", shotId: a };
}
function ht(e, n, a, r, o, d) {
  const f = n.replace(/\s+/g, "").toLocaleLowerCase(), $ = e.get(f);
  $ ? d.push(
    De(
      `shot:${a.id}:${o}:duplicate`,
      `镜头 ${r} 的${o}与镜头 ${$} 重复，建议审查是否有新的叙事作用`,
      a.id
    )
  ) : e.set(f, r);
}
function Ot({
  issues: e,
  onOpen: n
}) {
  const a = e.filter((d) => d.severity === "error"), r = e.filter((d) => d.severity === "warning"), o = [...a, ...r].slice(0, 5);
  return /* @__PURE__ */ i(
    "section",
    {
      className: `ws-storyboard-validation ${a.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ i("header", { children: [
          /* @__PURE__ */ t(Gt, { size: 14 }),
          /* @__PURE__ */ t("strong", { children: a.length ? `${a.length} 项需要处理` : `${r.length} 项建议检查` }),
          e.length > o.length ? /* @__PURE__ */ i("span", { children: [
            "另有 ",
            e.length - o.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ t("div", { children: o.map((d, f) => {
          const $ = !!(d.materialId || d.shotId);
          return /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              disabled: !$,
              onClick: () => $ && n(d),
              children: /* @__PURE__ */ t("span", { children: d.message })
            },
            `${d.id}:${f}`
          );
        }) })
      ]
    }
  );
}
const Bn = [
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
function Ln({
  storyboard: e,
  submitting: n,
  portalContainer: a,
  onClose: r,
  onEditIssue: o,
  onConfirm: d
}) {
  const [f, $] = E(
    () => Fn(e.production_plan)
  ), I = an(e), b = sn(e), B = e.shots.some(
    on
  ), O = Z(
    () => An(f, {
      speech: I > 0,
      subtitles: b > 0,
      visibleDialogue: B
    }),
    [B, f, I, b]
  ), p = Z(
    () => ({ ...e, production_plan: O }),
    [O, e]
  ), _ = Z(
    () => Rt(p),
    [p]
  ), w = _.some(
    (g) => g.severity === "error"
  ), L = Z(
    () => Vn(p),
    [p]
  ), T = Ke(
    p
  );
  X(() => {
    const g = (y) => {
      y.key === "Escape" && !n && r();
    };
    return window.addEventListener("keydown", g), () => window.removeEventListener("keydown", g);
  }, [r, n]);
  const A = (g, y) => {
    $((P) => ({
      ...P,
      [g]: y ? "auto" : "off"
    }));
  }, l = async () => {
    if (w) return;
    await d(O) && r();
  };
  return je(
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          n || r();
        },
        children: /* @__PURE__ */ i(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (g) => g.stopPropagation(),
            children: [
              /* @__PURE__ */ i("header", { children: [
                /* @__PURE__ */ i("div", { children: [
                  /* @__PURE__ */ t("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ t("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: n,
                    onClick: r,
                    children: /* @__PURE__ */ t(He, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ i("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ i("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ t("strong", { children: e.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ i("span", { children: [
                    e.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ i("span", { children: [
                    It(e),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ i("span", { children: [
                    I,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ i("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ t("legend", { children: "产出目标" }),
                  /* @__PURE__ */ t("div", { className: "ws-storyboard-output-options", children: Bn.map((g) => /* @__PURE__ */ i(
                    "label",
                    {
                      className: f.output_target === g.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: g.value,
                            checked: f.output_target === g.value,
                            disabled: n,
                            onChange: () => $((y) => ({
                              ...y,
                              output_target: g.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ i("span", { children: [
                          /* @__PURE__ */ t("strong", { children: g.title }),
                          /* @__PURE__ */ t("small", { children: g.description })
                        ] }),
                        f.output_target === g.value ? /* @__PURE__ */ t(me, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    g.value
                  )) })
                ] }),
                T ? /* @__PURE__ */ i("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ t("legend", { children: "附加内容" }),
                  /* @__PURE__ */ t(
                    Ae,
                    {
                      title: "配音",
                      description: I > 0 ? `按脚本中的 ${I} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: I > 0 && f.voice_mode === "auto",
                      disabled: n || I === 0,
                      onChange: (g) => A("voice_mode", g)
                    }
                  ),
                  /* @__PURE__ */ t(
                    Ae,
                    {
                      title: "字幕",
                      description: b > 0 ? `按脚本中的 ${b} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: b > 0 && f.subtitle_mode === "auto",
                      disabled: n || b === 0,
                      onChange: (g) => A("subtitle_mode", g)
                    }
                  ),
                  /* @__PURE__ */ t(
                    Ae,
                    {
                      title: "口型同步",
                      description: B ? "仅对出镜对白创建口型同步，默认关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: B && f.voice_mode === "auto" && f.lip_sync_mode === "auto",
                      disabled: n || !B || f.voice_mode !== "auto",
                      onChange: (g) => A("lip_sync_mode", g)
                    }
                  )
                ] }) : null,
                _.length ? /* @__PURE__ */ t(
                  Ot,
                  {
                    issues: _,
                    onOpen: o
                  }
                ) : null,
                /* @__PURE__ */ i("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ i("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ t("strong", { children: "制作流程" }),
                    /* @__PURE__ */ t("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ t("div", { className: "ws-storyboard-production-flow", children: L.map((g, y) => /* @__PURE__ */ i("span", { children: [
                    y > 0 ? /* @__PURE__ */ t("i", { "aria-hidden": "true", children: "/" }) : null,
                    g
                  ] }, g)) })
                ] })
              ] }),
              /* @__PURE__ */ i("footer", { children: [
                /* @__PURE__ */ t("button", { type: "button", disabled: n, onClick: r, children: "返回修改" }),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: n || w,
                    onClick: () => {
                      l();
                    },
                    children: [
                      n ? /* @__PURE__ */ t(Ne, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ t(me, { size: 15 }),
                      n ? "创建中" : Yn(f.output_target)
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
function Ae({
  title: e,
  description: n,
  checked: a,
  disabled: r,
  onChange: o
}) {
  return /* @__PURE__ */ i("label", { className: `ws-storyboard-production-switch${r ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ i("span", { children: [
      /* @__PURE__ */ t("strong", { children: e }),
      /* @__PURE__ */ t("small", { children: n })
    ] }),
    /* @__PURE__ */ t(
      "input",
      {
        type: "checkbox",
        checked: a,
        disabled: r,
        onChange: (d) => o(d.target.checked)
      }
    ),
    /* @__PURE__ */ t("i", { "aria-hidden": "true" })
  ] });
}
function An(e, n) {
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
function Vn(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const n = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return Ke(e) && n.push("镜头视频"), Ct(e) && n.push("配音"), Nt(e) && n.push("字幕"), St(e) && n.push("口型同步"), cn(e) && n.push("视频合成"), n;
}
function Fn(e) {
  const n = ln(e);
  return n.output_target === "storyboard_only" ? { ...n, output_target: "shot_images" } : n;
}
function Yn(e) {
  return e === "shot_images" ? "创建参考图" : e === "shot_videos" ? "创建镜头视频" : "完成视频";
}
function Un({
  storyboard: e,
  referenceItems: n,
  workType: a,
  purposeSpecs: r,
  editable: o,
  disabled: d,
  onChange: f
}) {
  const $ = $t(n);
  if (e.references.length === 0)
    return null;
  const I = (b, B, O = !1) => {
    let p = O ? Dt(e, b) : e;
    if (p = {
      ...p,
      references: p.references.map(
        (_) => _.key === b ? { ..._, ...B } : _
      )
    }, O) {
      const _ = p.references.find((L) => L.key === b), w = _ ? mt(p, _, r) : [];
      w.length === 1 && (p = ft(p, b, w[0].value));
    }
    f(p);
  };
  return /* @__PURE__ */ i("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ t(Jt, { size: 14 }),
      /* @__PURE__ */ t("strong", { children: "参考素材" }),
      /* @__PURE__ */ i("span", { children: [
        e.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "ws-storyboard-reference-list", children: e.references.map((b) => {
      const B = mt(
        e,
        b,
        r
      ), O = Wn(e, b.key), p = dn(
        b.kind,
        a,
        r
      ), _ = p.some(
        (w) => w.value === b.purpose
      );
      return /* @__PURE__ */ i(
        "div",
        {
          className: `ws-storyboard-reference-row ${_ ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ t(
              kn,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${b.label}`,
                content: qn(b),
                adapter: $
              }
            ),
            o ? /* @__PURE__ */ i(Ye, { children: [
              /* @__PURE__ */ i(
                "select",
                {
                  className: "nodrag nopan",
                  value: b.purpose,
                  disabled: d,
                  "aria-label": `${b.label}的参考用途`,
                  onChange: (w) => I(
                    b.key,
                    {
                      purpose: w.target.value
                    },
                    !0
                  ),
                  children: [
                    _ ? null : /* @__PURE__ */ i("option", { value: b.purpose, children: [
                      st(
                        b.purpose,
                        r
                      ),
                      "（当前类型不支持）"
                    ] }),
                    p.map((w) => /* @__PURE__ */ t("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ),
              bt(
                b.purpose,
                r
              ) ? /* @__PURE__ */ i(
                "select",
                {
                  className: "nodrag nopan",
                  value: O,
                  disabled: d,
                  "aria-label": `${b.label}的关联目标`,
                  onChange: (w) => f(
                    ft(
                      e,
                      b.key,
                      w.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ t("option", { value: "", children: "选择关联目标" }),
                    B.map((w) => /* @__PURE__ */ t("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ) : /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-global", children: gt(
                b.purpose,
                r
              ) })
            ] }) : /* @__PURE__ */ i(Ye, { children: [
              /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-purpose", children: st(
                b.purpose,
                r
              ) }),
              /* @__PURE__ */ t("span", { className: "ws-storyboard-reference-target", children: jn(e, O) || (bt(
                b.purpose,
                r
              ) ? "未关联" : gt(
                b.purpose,
                r
              )) })
            ] })
          ]
        },
        b.key
      );
    }) })
  ] });
}
function qn(e) {
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
function mt(e, n, a) {
  const r = he(
    n.purpose,
    a
  );
  return r?.scope === "material" ? e.materials.filter((o) => o.type === r.material_type).map((o) => ({
    value: `material:${o.id}`,
    label: o.name
  })) : r?.scope === "shot" ? e.shots.map((o, d) => ({
    value: `shot:${o.id}`,
    label: `镜头 ${o.order || d + 1}`
  })) : [];
}
function Wn(e, n) {
  const a = e.materials.find(
    (o) => o.reference_keys.includes(n)
  );
  if (a)
    return `material:${a.id}`;
  const r = e.shots.find(
    (o) => o.reference_keys.includes(n)
  );
  return r ? `shot:${r.id}` : "";
}
function jn(e, n) {
  const [a, r] = n.split(":", 2);
  if (a === "material")
    return e.materials.find((o) => o.id === r)?.name || "";
  if (a === "shot") {
    const o = e.shots.findIndex((d) => d.id === r);
    return o >= 0 ? `镜头 ${e.shots[o].order || o + 1}` : "";
  }
  return "";
}
function ft(e, n, a) {
  const r = Dt(e, n);
  if (!a)
    return r;
  const [o, d] = a.split(":", 2);
  return o === "material" ? {
    ...r,
    materials: r.materials.map(
      (f) => f.id === d ? {
        ...f,
        reference_keys: [...f.reference_keys, n]
      } : f
    )
  } : o === "shot" ? {
    ...r,
    shots: r.shots.map(
      (f) => f.id === d ? { ...f, reference_keys: [...f.reference_keys, n] } : f
    )
  } : r;
}
function Dt(e, n) {
  return {
    ...e,
    materials: e.materials.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter(
        (r) => r !== n
      )
    })),
    shots: e.shots.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter((r) => r !== n)
    }))
  };
}
function bt(e, n) {
  const a = he(e, n)?.scope;
  return a === "material" || a === "shot";
}
function gt(e, n) {
  const a = he(e, n);
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
function Hn({
  storyboard: e,
  sourceNodeId: n,
  canvasNodes: a
}) {
  const r = Mt(e, n, a);
  return /* @__PURE__ */ t("div", { className: "ws-storyboard-board", "aria-label": "画面预览", children: r.map(({ shot: o, node: d, imageURL: f }) => /* @__PURE__ */ i("article", { className: "ws-storyboard-board-frame", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ t("strong", { children: String(o.order).padStart(2, "0") }),
      /* @__PURE__ */ i("span", { children: [
        o.duration,
        " 秒"
      ] }),
      /* @__PURE__ */ t("span", { children: Xn(o) })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        className: "ws-storyboard-frame-media",
        style: { aspectRatio: Jn(e) },
        children: f ? /* @__PURE__ */ t("a", { href: f, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ t(
          "img",
          {
            src: f,
            alt: `镜头 ${o.order} 故事板`,
            loading: "lazy",
            decoding: "async"
          }
        ) }) : /* @__PURE__ */ i("div", { className: "ws-storyboard-frame-empty", children: [
          /* @__PURE__ */ t(Qt, { size: 22 }),
          /* @__PURE__ */ t("span", { children: Gn(o, d) })
        ] })
      }
    ),
    /* @__PURE__ */ i("div", { className: "ws-storyboard-frame-copy", children: [
      /* @__PURE__ */ t("strong", { children: o.beat }),
      /* @__PURE__ */ t("span", { children: o.camera_instruction || "固定机位" }),
      /* @__PURE__ */ i("div", { className: "ws-storyboard-frame-continuity", children: [
        /* @__PURE__ */ i("p", { children: [
          /* @__PURE__ */ t("b", { children: "入" }),
          /* @__PURE__ */ t("span", { children: o.continuity_state.entry })
        ] }),
        /* @__PURE__ */ i("p", { children: [
          /* @__PURE__ */ t("b", { children: "出" }),
          /* @__PURE__ */ t("span", { children: o.continuity_state.exit })
        ] })
      ] }),
      d?.runError ? /* @__PURE__ */ t("small", { children: d.runError }) : null
    ] })
  ] }, o.id)) });
}
function Kn(e, n, a) {
  return Mt(e, n, a).some(
    (r) => !!r.imageURL
  );
}
function Mt(e, n, a) {
  const r = /* @__PURE__ */ new Map();
  for (const o of a) {
    const d = o.storyboardItem;
    d?.sourceNodeId === n && d.itemType === "shot_image" && d.shotId && r.set(d.shotId, o);
  }
  return e.shots.map((o) => {
    const d = r.get(o.id), f = d ? Rn(d) : void 0, $ = f && un(f, "image")[0] || "";
    return { shot: o, node: d, imageURL: $ };
  });
}
function Xn(e) {
  return e.continue_previous ? "尾帧续接" : e.match_previous ? "画面匹配" : "新镜头";
}
function Gn(e, n) {
  return n?.runError ? "生成失败" : n ? "暂无结果" : e.continue_previous ? "沿用上一镜尾帧" : "待生成";
}
function Jn(e) {
  return e.aspect_ratio.replace(":", " / ");
}
await window.DeverFront?.ensureCompat?.(["@/components/assistant/task-popover"]);
const We = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/task-popover");
if (!We || Object.keys(We).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/task-popover");
const Qn = We.AssistantTaskPopover, Zn = [], er = [], tr = [], nr = [], rr = [
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
function kr({
  storyboard: e,
  layout: n = "stacked",
  editable: a = !1,
  disabled: r = !1,
  onSave: o,
  onChange: d,
  onConfirm: f,
  onCreateRevision: $,
  onGenerateShot: I,
  workflowAction: b = "",
  saveStatus: B,
  showSaveStatus: O = !0,
  showMetrics: p = !0,
  referenceItems: _ = Zn,
  storyboardSourceNodeId: w = "",
  canvasNodes: L = er,
  workTypeSpecs: T = tr,
  purposeSpecs: A = nr,
  focus: l
}) {
  const g = Z(
    () => JSON.stringify(e),
    [e]
  ), [y, P] = E(e), [V, W] = E("saved"), [R, D] = E(""), [F, x] = E(""), [re, Y] = E(null), [Me, se] = E(!1), [j, oe] = E("script"), [Ce, ke] = E(""), [s, m] = E(""), [u, S] = E([]), [U, M] = E(
    "before"
  ), G = K(null), ie = G.current?.closest(".wb-detail-backdrop, .ws-page") || null, Te = K(""), le = K([]), Xe = K(/* @__PURE__ */ new Map()), ce = K(/* @__PURE__ */ new Map()), Ee = K(e), Ie = K(!1), fe = K(0), Ge = K(g), J = K(null), Je = K(Promise.resolve()), be = K(!0), ge = !!d, v = ge ? e : y, Qe = T.find(
    (c) => c.key === v.work_type
  )?.name, $e = pn(v), z = a && !r && !$e && !b && !!(d || o), Ze = z && !ge && !!o, et = $t(_), ve = v.shots.find((c) => c.id === R), Pe = v.shots.findIndex(
    (c) => c.id === R
  ), Pt = Pe > 0 ? v.shots[Pe - 1] : void 0, xe = v.materials.find(
    (c) => c.id === F
  ), de = xe || re, xt = de ? ot(v, de.id) : void 0, zt = Z(
    () => ut(v.shots, u, (c) => c.id),
    [v.shots, u]
  ), ze = Z(
    () => Rt(v, {
      coreOnly: !0,
      workTypeSpecs: T,
      purposeSpecs: A
    }),
    [v, A, T]
  ), Bt = ze.some(
    (c) => c.severity === "error"
  ), tt = (c) => {
    if (c.materialId) {
      D(""), Y(null), x(c.materialId);
      return;
    }
    c.shotId && (x(""), Y(null), D(c.shotId));
  }, Re = Z(
    () => !!w && Kn(v, w, L),
    [L, v, w]
  ), Lt = Z(
    () => v.shots.some(
      (c) => c.speech.some(
        (h) => h.kind === "narration" && !!h.text.trim()
      )
    ),
    [v.shots]
  );
  X(() => (be.current = !0, () => {
    be.current = !1, J.current && window.clearTimeout(J.current);
  }), []), X(
    () => () => {
      for (const c of ce.current.values())
        c.cancel();
      ce.current.clear();
    },
    []
  ), Xt(() => {
    const c = Xe.current, h = G.current;
    if (!h || c.size === 0)
      return;
    const C = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    h.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((N) => {
      if (N.classList.contains("is-dragging"))
        return;
      const q = N.dataset.sequenceItemId || "", te = c.get(q);
      if (!te || C)
        return;
      const Be = N.getBoundingClientRect(), ye = te.left - Be.left, ue = te.top - Be.top;
      if (Math.abs(ye) < 1 && Math.abs(ue) < 1)
        return;
      ce.current.get(q)?.cancel();
      const _e = N.animate(
        [
          { transform: `translate3d(${ye}px, ${ue}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      ce.current.set(q, _e), _e.onfinish = () => {
        ce.current.get(q) === _e && ce.current.delete(q);
      };
    }), c.clear();
  }, [u]), X(() => {
    Ge.current !== g && (Ge.current = g, !Ie.current && (Ee.current = e, P(e), W("saved")));
  }, [g, e]), X(() => {
    R && !ve && D("");
  }, [ve, R]), X(() => {
    F && !xe && x("");
  }, [xe, F]), X(() => {
    !Re && j === "board" && oe("script");
  }, [j, Re]), X(() => {
    if (!l)
      return;
    if (l.materialId && v.materials.some((h) => h.id === l.materialId)) {
      Y(null), D(""), x(l.materialId);
      return;
    }
    if (l.shotId && v.shots.some((h) => h.id === l.shotId)) {
      Y(null), x(""), D(l.shotId);
      return;
    }
    const c = window.requestAnimationFrame(() => {
      const h = l.materialType ? `[data-storyboard-material-type="${l.materialType}"]` : l.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      G.current?.querySelector(h)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(c);
  }, [
    l?.materialId,
    l?.materialType,
    l?.section,
    l?.shotId
  ]), X(() => {
    if (!Ze || !Ie.current || !o)
      return;
    J.current && window.clearTimeout(J.current);
    const c = v, h = fe.current;
    return J.current = window.setTimeout(() => {
      J.current = null, Je.current = Je.current.catch(() => {
      }).then(async () => {
        be.current && h === fe.current && W("saving");
        try {
          if (await o(c), !be.current || h !== fe.current)
            return;
          Ie.current = !1, W("saved");
        } catch {
          if (!be.current || h !== fe.current)
            return;
          W("error");
        }
      });
    }, 800), () => {
      J.current && (window.clearTimeout(J.current), J.current = null);
    };
  }, [Ze, v, o]);
  const H = (c) => {
    if (!z)
      return;
    const h = ge ? e : Ee.current, C = c(h), N = sr(
      bn(gn(h, C)),
      et.options
    );
    if (Ee.current = N, ge) {
      d?.(N);
      return;
    }
    Ie.current = !0, fe.current += 1, P(N), W("typing");
  }, nt = () => {
    const c = G.current;
    if (!c)
      return;
    const h = /* @__PURE__ */ new Map();
    c.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((C) => {
      const N = C.dataset.sequenceItemId || "";
      N && h.set(N, C.getBoundingClientRect());
    }), Xe.current = h;
  }, At = (c) => {
    const h = v.shots.map((C) => C.id);
    Te.current = c, le.current = h, ke(c), m(""), S(h);
  }, Vt = (c, h) => {
    const C = Te.current, N = le.current;
    if (!C || !c || C === c || !N.length || !N.includes(C) || !N.includes(c))
      return;
    const q = h.currentTarget.getBoundingClientRect(), te = h.currentTarget.parentElement?.getBoundingClientRect(), ye = !!(te && q.width * 1.5 < te.width) ? h.clientX < q.left + q.width / 2 ? "before" : "after" : h.clientY < q.top + q.height / 2 ? "before" : "after", ue = Nn(
      N,
      C,
      c,
      ye,
      (_e) => _e
    );
    m(c), M(ye), !Le(N, ue) && (nt(), le.current = ue, S(ue));
  }, rt = () => {
    const c = le.current, h = v.shots.map((C) => C.id);
    c.length > 0 && !Le(c, h) && nt(), Te.current = "", le.current = [], ke(""), m(""), S([]);
  }, Ft = () => {
    const c = le.current;
    c.length > 0 && H((h) => {
      const C = ut(h.shots, c, (N) => N.id);
      return Le(
        h.shots.map((N) => N.id),
        C.map((N) => N.id)
      ) ? h : { ...h, shots: C };
    }), rt();
  }, Yt = (c, h) => {
    H((C) => ({
      ...C,
      materials: h,
      shots: C.shots.map(
        (N) => N.id === c.id ? c : N
      )
    })), D("");
  }, Ut = (c) => {
    H((h) => {
      const C = h.materials.some((N) => N.id === c.id);
      return {
        ...h,
        materials: C ? h.materials.map(
          (N) => N.id === c.id ? c : N
        ) : [...h.materials, c]
      };
    }), x(""), Y(null);
  }, qt = (c) => {
    x(""), Y(vn(v.materials, c));
  }, Wt = (c) => {
    const h = ot(v, c);
    h.shotIds.length || h.speechIds.length || (H((C) => ({
      ...C,
      materials: C.materials.filter((N) => N.id !== c)
    })), x(""), Y(null));
  }, jt = (c) => {
    H((h) => h.shots.length <= 1 ? h : {
      ...h,
      shots: h.shots.filter((C) => C.id !== c)
    });
  }, Ht = (c) => {
    H((h) => {
      if (h.shots.length >= Se)
        return h;
      const C = fr(h.shots, c), N = h.shots.findIndex((te) => te.id === c.id), q = [...h.shots];
      return q.splice(N + 1, 0, C), { ...h, shots: q };
    });
  }, Kt = () => {
    H((c) => c.shots.length >= Se ? c : {
      ...c,
      shots: [...c.shots, Tt(c.shots)]
    });
  };
  return /* @__PURE__ */ i(
    "section",
    {
      ref: G,
      className: `ws-storyboard is-${n} ${z ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ i("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ i("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ i("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ i("header", { children: [
                /* @__PURE__ */ t(qe, { size: 14 }),
                /* @__PURE__ */ t("strong", { children: "内容简介" }),
                Qe ? /* @__PURE__ */ t("span", { className: "ws-storyboard-work-type", children: Qe }) : null
              ] }),
              /* @__PURE__ */ t("p", { children: hn(v) })
            ] }),
            /* @__PURE__ */ i("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ t(
                Un,
                {
                  storyboard: v,
                  referenceItems: _,
                  editable: z,
                  disabled: r,
                  workType: v.work_type,
                  purposeSpecs: A,
                  onChange: (c) => H(() => c)
                }
              ),
              /* @__PURE__ */ t("section", { className: "ws-storyboard-basic-settings", children: /* @__PURE__ */ i("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ i("label", { children: [
                  /* @__PURE__ */ t("strong", { children: /* @__PURE__ */ t(ee, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ t("span", { children: "画面类型" }) }) }),
                  z ? /* @__PURE__ */ t(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: v.visual_mode,
                      disabled: r,
                      onChange: (c) => H((h) => ({
                        ...h,
                        visual_mode: c.target.value
                      })),
                      children: mn.map((c) => /* @__PURE__ */ t("option", { value: c, children: lt[c] }, c))
                    }
                  ) : /* @__PURE__ */ t("span", { children: lt[v.visual_mode] })
                ] }),
                /* @__PURE__ */ i("label", { children: [
                  /* @__PURE__ */ t("strong", { children: "画幅" }),
                  z ? /* @__PURE__ */ t(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: v.aspect_ratio,
                      disabled: r,
                      onChange: (c) => H((h) => ({
                        ...h,
                        aspect_ratio: c.target.value
                      })),
                      children: fn.map((c) => /* @__PURE__ */ t("option", { value: c, children: c }, c))
                    }
                  ) : /* @__PURE__ */ t("span", { children: v.aspect_ratio })
                ] }),
                Lt || v.narrator_voice ? /* @__PURE__ */ i("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ t("strong", { children: "旁白音色" }),
                  z ? /* @__PURE__ */ t(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: v.narrator_voice,
                      placeholder: "能力默认",
                      disabled: r,
                      onChange: (c) => H((h) => ({
                        ...h,
                        narrator_voice: c.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ t("span", { children: v.narrator_voice || "能力默认" })
                ] }) : null,
                /* @__PURE__ */ i("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ t("strong", { children: "统一视觉风格" }),
                  z ? /* @__PURE__ */ t(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: v.style_prompt,
                      placeholder: "可选，整部作品保持一致的画面风格",
                      disabled: r,
                      onChange: (c) => H(
                        (h) => Sn(
                          h,
                          c.target.value
                        )
                      )
                    }
                  ) : /* @__PURE__ */ t(ee, { label: v.style_prompt, children: /* @__PURE__ */ t("span", { children: v.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] }) }),
              v.materials.length || z ? /* @__PURE__ */ t(
                ir,
                {
                  materials: v.materials,
                  editable: z,
                  onOpen: x,
                  onCreate: qt
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ i("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ t("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ i("div", { className: "ws-storyboard-toolbar-end", children: [
              Re ? /* @__PURE__ */ i("div", { className: "ws-storyboard-view-tabs", role: "tablist", children: [
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": j === "script",
                    className: j === "script" ? "is-active" : "",
                    onClick: () => oe("script"),
                    children: "分镜脚本"
                  }
                ),
                /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": j === "board",
                    className: j === "board" ? "is-active" : "",
                    onClick: () => oe("board"),
                    children: "画面预览"
                  }
                )
              ] }) : null,
              p || z && O ? /* @__PURE__ */ i("div", { className: "ws-storyboard-toolbar-meta", children: [
                p ? /* @__PURE__ */ i("span", { children: [
                  v.shots.length,
                  " 个镜头 ·",
                  " ",
                  It(v),
                  " 秒 · ",
                  v.aspect_ratio
                ] }) : null,
                z && O ? /* @__PURE__ */ t(
                  cr,
                  {
                    status: ge ? B || "saved" : V
                  }
                ) : null
              ] }) : null,
              z ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: r || v.shots.length >= Se,
                  onClick: Kt,
                  children: [
                    /* @__PURE__ */ t(we, { size: 13 }),
                    /* @__PURE__ */ t("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              $e && $ ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: r || !!b,
                  onClick: () => {
                    $();
                  },
                  children: [
                    b === "revising" ? /* @__PURE__ */ t(Ne, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(Zt, { size: 13 }),
                    b === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !$e && z && f ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: r || !!b || Bt,
                  onClick: () => se(!0),
                  children: [
                    b === "confirming" ? /* @__PURE__ */ t(Ne, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ t(me, { size: 13 }),
                    b === "confirming" ? "确认中" : "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            j === "script" && z && ze.length ? /* @__PURE__ */ t(
              Ot,
              {
                issues: ze,
                onOpen: tt
              }
            ) : null,
            j === "board" && Re ? /* @__PURE__ */ t(
              Hn,
              {
                storyboard: v,
                sourceNodeId: w,
                canvasNodes: L
              }
            ) : /* @__PURE__ */ t("div", { className: "ws-storyboard-grid nowheel", children: v.shots.length ? zt.map((c, h) => /* @__PURE__ */ t(
              $n,
              {
                shot: c,
                index: h,
                storyboard: v,
                selected: R === c.id,
                editable: z,
                dragging: Ce === c.id,
                dropPlacement: s === c.id && Ce !== c.id ? U : void 0,
                onOpen: () => D(c.id),
                onDuplicate: () => Ht(c),
                onRemove: () => jt(c.id),
                onDragStart: () => At(c.id),
                onDragOver: (C) => Vt(c.id, C),
                onDrop: Ft,
                onDragEnd: rt
              },
              c.id
            )) : /* @__PURE__ */ i("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ t(qe, { size: 26 }),
              /* @__PURE__ */ t("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ t("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        Me && f && !$e ? /* @__PURE__ */ t(
          Ln,
          {
            storyboard: v,
            submitting: b === "confirming",
            portalContainer: ie,
            onClose: () => se(!1),
            onEditIssue: (c) => {
              se(!1), tt(c);
            },
            onConfirm: (c) => f(v, c)
          }
        ) : null,
        ve ? /* @__PURE__ */ t(
          ar,
          {
            shot: ve,
            index: Pe,
            previousShot: Pt,
            storyboard: v,
            materials: v.materials,
            readonly: !z,
            referenceAdapter: et,
            portalContainer: ie,
            onEditMaterial: x,
            onGenerate: I,
            onSave: Yt,
            onClose: () => D("")
          },
          ve.id
        ) : null,
        de ? /* @__PURE__ */ t(
          On,
          {
            material: de,
            creating: !!re,
            readonly: !z,
            usage: xt,
            existingNames: v.materials.filter((c) => c.id !== de.id).map((c) => c.name),
            portalContainer: ie,
            onSave: Ut,
            onRemove: Wt,
            onClose: () => {
              x(""), Y(null);
            }
          },
          `${re ? "create" : "edit"}:${de.id}`
        ) : null
      ]
    }
  );
}
function ir({
  materials: e,
  editable: n,
  onOpen: a,
  onCreate: r
}) {
  return /* @__PURE__ */ i("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ t("strong", { children: "素材设定" }),
      n ? /* @__PURE__ */ t("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((o) => /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => r(o),
          children: [
            /* @__PURE__ */ t(we, { size: 11 }),
            ae[o]
          ]
        },
        o
      )) }) : null
    ] }),
    /* @__PURE__ */ i("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((o) => {
        const d = e.filter(
          (f) => f.type === o
        );
        return d.length ? /* @__PURE__ */ i(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": o,
            children: [
              /* @__PURE__ */ t("span", { children: ae[o] }),
              d.map((f) => /* @__PURE__ */ t(
                ee,
                {
                  label: `${n ? "编辑" : "查看"}${ae[o]}提示词：${f.name}`,
                  children: /* @__PURE__ */ i(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => a(f.id),
                      children: [
                        /* @__PURE__ */ t("span", { children: f.name }),
                        n ? /* @__PURE__ */ t(vt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                f.id
              ))
            ]
          },
          o
        ) : null;
      }),
      e.length ? null : /* @__PURE__ */ t("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function ar({
  shot: e,
  index: n,
  previousShot: a,
  storyboard: r,
  materials: o,
  readonly: d,
  referenceAdapter: f,
  portalContainer: $,
  onEditMaterial: I,
  onGenerate: b,
  onSave: B,
  onClose: O
}) {
  const [p, _] = E(() => Et(e)), [w, L] = E(() => o), [T, A] = E(!1);
  X(() => {
    L((s) => {
      const m = new Set(o.map((u) => u.id));
      return [
        ...o,
        ...s.filter((u) => !m.has(u.id))
      ];
    });
  }, [o]);
  const l = new Set(
    o.map((s) => s.id)
  ), g = w.filter(
    (s) => s.type === "character"
  ), y = new Set(
    p.speech.filter((s) => s.kind === "dialogue").map((s) => s.character_id || "").filter(Boolean)
  ), P = kt(p), V = _t(p, n), W = ur(p), R = p.speech.some(
    (s) => s.start_time < 0 || s.start_time >= p.duration
  ), D = !p.continuity_state.entry.trim() || !p.continuity_state.exit.trim() || V && p.continuity_state.entry.trim() !== a?.continuity_state.exit.trim() || n > 0 && (p.continue_previous && !p.continuity_anchor.trim() || p.continue_previous && p.match_previous), F = !p.beat.trim() || n > 0 && !p.transition.trim(), x = p.captions.some(
    (s) => !s.text.trim() || s.start_time < 0 || s.end_time <= s.start_time || s.end_time > p.duration
  ), re = (s, m, u) => {
    _((S) => ({
      ...S,
      ...lr(S, s, m, u)
    }));
  }, Y = (s, m) => {
    _((u) => {
      const S = u.speech.map(
        (M) => M.id === s ? dr(M, m) : M
      ), U = S.filter((M) => M.kind === "dialogue").map((M) => M.character_id || "").filter(Boolean);
      return {
        ...u,
        material_ids: [.../* @__PURE__ */ new Set([...u.material_ids, ...U])],
        speech: S
      };
    });
  }, Me = (s) => {
    _((m) => m.material_ids.includes(s) ? y.has(s) ? m : {
      ...m,
      material_ids: m.material_ids.filter((u) => u !== s)
    } : {
      ...m,
      material_ids: [...m.material_ids, s]
    });
  }, se = (s, m) => {
    _((u) => {
      const S = u.speech.findIndex(
        (ie) => ie.id === s
      ), U = S + m;
      if (S < 0 || U < 0 || U >= u.speech.length)
        return u;
      const M = [...u.speech], [G] = M.splice(S, 1);
      return M.splice(U, 0, G), { ...u, speech: M };
    });
  }, j = (s, m) => {
    _((u) => ({
      ...u,
      captions: u.captions.map(
        (S) => S.id === s ? { ...S, ...m } : S
      )
    }));
  }, oe = (s, m) => {
    _((u) => {
      const S = u.captions.findIndex(
        (ie) => ie.id === s
      ), U = S + m;
      if (S < 0 || U < 0 || U >= u.captions.length)
        return u;
      const M = [...u.captions], [G] = M.splice(S, 1);
      return M.splice(U, 0, G), { ...u, captions: M };
    });
  }, Ce = async (s) => {
    if (!b || T)
      return !1;
    A(!0);
    try {
      const m = {
        ...r,
        materials: w,
        shots: r.shots.map(
          (S) => S.id === p.id ? p : S
        )
      }, u = await b(
        m,
        p.id,
        s.trim()
      );
      return L(u.materials), _((S) => ({
        ...u.shot,
        reference_contents: { ...S.reference_contents || {} }
      })), !0;
    } finally {
      A(!1);
    }
  }, ke = /* @__PURE__ */ t(
    "div",
    {
      className: "ws-storyboard-shot-backdrop",
      "data-slot": "dialog-layer",
      onMouseDown: (s) => {
        s.target instanceof Element && s.target.closest('[data-assistant-layer="true"]') || T || O();
      },
      children: /* @__PURE__ */ i(
        "section",
        {
          className: "ws-storyboard-shot-dialog",
          "data-slot": "dialog-content",
          role: "dialog",
          "aria-modal": "true",
          "aria-busy": T,
          "aria-label": `${d ? "查看" : "编辑"}镜头 ${n + 1}`,
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ i("header", { children: [
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ i("strong", { children: [
                  d ? "查看镜头" : "编辑镜头",
                  " ",
                  String(n + 1).padStart(2, "0")
                ] }),
                /* @__PURE__ */ t("span", { children: d ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
              ] }),
              /* @__PURE__ */ t(ee, { label: "关闭", children: /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  "aria-label": "关闭",
                  disabled: T,
                  onClick: O,
                  children: /* @__PURE__ */ t(He, { size: 18 })
                }
              ) })
            ] }),
            /* @__PURE__ */ i(
              "fieldset",
              {
                className: "ws-storyboard-shot-form nowheel",
                disabled: T,
                children: [
                  T ? /* @__PURE__ */ i("div", { className: "ws-storyboard-generation-mask", role: "status", children: [
                    /* @__PURE__ */ t(Ne, { size: 18, className: "ws-spin" }),
                    /* @__PURE__ */ t("span", { children: "正在生成镜头" })
                  ] }) : null,
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ t("strong", { children: "镜头内容" }),
                      /* @__PURE__ */ t("div", { children: /* @__PURE__ */ i("label", { children: [
                        "时长",
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "number",
                            min: yn,
                            step: 1,
                            value: p.duration,
                            disabled: d,
                            onChange: (s) => _((m) => ({
                              ...m,
                              duration: hr(
                                s,
                                m.duration
                              )
                            }))
                          }
                        ),
                        "秒"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ i(
                      "details",
                      {
                        className: `ws-storyboard-continuity-settings${D ? " is-invalid" : ""}`,
                        open: D || void 0,
                        children: [
                          /* @__PURE__ */ i("summary", { children: [
                            /* @__PURE__ */ i("span", { children: [
                              "连续性设置",
                              /* @__PURE__ */ t("small", { children: "高级" })
                            ] }),
                            /* @__PURE__ */ t("b", { children: D ? "需要处理" : n === 0 ? "首镜" : p.continue_previous ? "动作延续" : p.match_previous ? "画面匹配" : "独立切镜" })
                          ] }),
                          /* @__PURE__ */ i("div", { children: [
                            n > 0 ? /* @__PURE__ */ t("div", { className: "ws-storyboard-continuity-modes", children: rr.map((s) => /* @__PURE__ */ i(
                              "label",
                              {
                                className: `ws-storyboard-continuity-input${W === s.value ? " is-selected" : ""}`,
                                children: [
                                  /* @__PURE__ */ t(
                                    "input",
                                    {
                                      type: "radio",
                                      name: `storyboard-continuity-${e.id}`,
                                      value: s.value,
                                      checked: W === s.value,
                                      disabled: d,
                                      onChange: () => _(
                                        (m) => pr(
                                          m,
                                          s.value,
                                          a
                                        )
                                      )
                                    }
                                  ),
                                  /* @__PURE__ */ i("span", { children: [
                                    /* @__PURE__ */ t("strong", { children: s.label }),
                                    /* @__PURE__ */ t("small", { children: s.description })
                                  ] })
                                ]
                              },
                              s.value
                            )) }) : null,
                            n > 0 && p.continue_previous ? /* @__PURE__ */ i("label", { className: "ws-storyboard-continuity-anchor", children: [
                              /* @__PURE__ */ t("span", { children: "连续性锚点" }),
                              /* @__PURE__ */ t(
                                "textarea",
                                {
                                  value: p.continuity_anchor,
                                  readOnly: d,
                                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                  onChange: (s) => _((m) => ({
                                    ...m,
                                    continuity_anchor: s.target.value
                                  }))
                                }
                              )
                            ] }) : null,
                            D ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "请填写入镜和出镜状态；匹配或延续上一镜时，入镜状态必须等于上一镜出镜状态；视频延续还必须填写连续性锚点。" }) : null,
                            /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                              /* @__PURE__ */ t(
                                Oe,
                                {
                                  label: "入镜状态",
                                  value: p.continuity_state.entry,
                                  placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                  readonly: d || V,
                                  onChange: (s) => _((m) => ({
                                    ...m,
                                    continuity_state: {
                                      ...m.continuity_state,
                                      entry: s
                                    }
                                  }))
                                }
                              ),
                              /* @__PURE__ */ t(
                                Oe,
                                {
                                  label: "出镜状态",
                                  value: p.continuity_state.exit,
                                  placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                  readonly: d,
                                  onChange: (s) => _((m) => ({
                                    ...m,
                                    continuity_state: {
                                      ...m.continuity_state,
                                      exit: s
                                    }
                                  }))
                                }
                              )
                            ] })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ i(
                      "div",
                      {
                        className: `ws-storyboard-shot-field-row ${n === 0 ? "is-single" : ""}`,
                        children: [
                          /* @__PURE__ */ t(
                            Oe,
                            {
                              label: "本镜变化",
                              value: p.beat,
                              placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                              readonly: d,
                              onChange: (s) => _((m) => ({ ...m, beat: s }))
                            }
                          ),
                          n > 0 ? /* @__PURE__ */ t(
                            Oe,
                            {
                              label: "与上镜关系",
                              value: p.transition,
                              placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                              readonly: d,
                              onChange: (s) => _((m) => ({
                                ...m,
                                transition: s
                              }))
                            }
                          ) : null
                        ]
                      }
                    ),
                    n > 0 ? /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ i("label", { children: [
                        /* @__PURE__ */ t("span", { children: "剪辑转场" }),
                        /* @__PURE__ */ t(
                          "select",
                          {
                            value: p.transition_type,
                            disabled: d,
                            onChange: (s) => _((m) => {
                              const u = s.target.value;
                              return {
                                ...m,
                                transition_type: u,
                                transition_duration_ms: u === "none" ? 0 : Math.max(500, m.transition_duration_ms)
                              };
                            }),
                            children: wt.map((s) => /* @__PURE__ */ t("option", { value: s, children: _n[s] }, s))
                          }
                        )
                      ] }),
                      p.transition_type !== "none" ? /* @__PURE__ */ i("label", { children: [
                        /* @__PURE__ */ t("span", { children: "转场时长" }),
                        /* @__PURE__ */ t(
                          "input",
                          {
                            type: "number",
                            min: 100,
                            max: 5e3,
                            step: 100,
                            value: p.transition_duration_ms,
                            disabled: d,
                            onChange: (s) => _((m) => ({
                              ...m,
                              transition_duration_ms: Math.min(
                                5e3,
                                mr(
                                  s,
                                  m.transition_duration_ms,
                                  100
                                )
                              )
                            }))
                          }
                        )
                      ] }) : null
                    ] }) : null,
                    F ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ t(
                      Ve,
                      {
                        label: "镜头描述",
                        value: p.description,
                        content: p.reference_contents?.description,
                        placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                        readonly: d,
                        referenceAdapter: f,
                        onChange: (s, m) => re("description", s, m)
                      }
                    ) }),
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ t(
                        Ve,
                        {
                          label: "镜头语言",
                          value: p.camera_instruction,
                          content: p.reference_contents?.camera_instruction,
                          placeholder: "景别、机位和运动方式",
                          readonly: d,
                          referenceAdapter: f,
                          onChange: (s, m) => re("camera_instruction", s, m)
                        }
                      ),
                      /* @__PURE__ */ t(
                        Ve,
                        {
                          label: "视频提示词",
                          value: p.video_prompt,
                          content: p.reference_contents?.video_prompt,
                          placeholder: "完整描述动作、运镜、光线与风格",
                          readonly: d,
                          referenceAdapter: f,
                          onChange: (s, m) => re("video_prompt", s, m)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ i("div", { children: [
                      /* @__PURE__ */ t("strong", { children: "关联素材" }),
                      /* @__PURE__ */ i("span", { children: [
                        p.material_ids.length,
                        " 个素材"
                      ] })
                    ] }) }),
                    w.length ? /* @__PURE__ */ t("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((s) => {
                      const m = w.filter(
                        (u) => u.type === s
                      );
                      return m.length ? /* @__PURE__ */ i("fieldset", { children: [
                        /* @__PURE__ */ t("legend", { children: ae[s] }),
                        /* @__PURE__ */ t("div", { children: m.map((u) => {
                          const S = p.material_ids.includes(
                            u.id
                          ), U = y.has(u.id), M = l.has(
                            u.id
                          );
                          return /* @__PURE__ */ i(
                            "div",
                            {
                              className: "ws-storyboard-material-option",
                              children: [
                                /* @__PURE__ */ t(
                                  ee,
                                  {
                                    label: S && U ? "该角色已用于对白，不能取消关联" : S ? "取消关联" : "关联素材",
                                    children: /* @__PURE__ */ i("label", { children: [
                                      /* @__PURE__ */ t(
                                        "input",
                                        {
                                          type: "checkbox",
                                          checked: S,
                                          disabled: d || S && U,
                                          onChange: () => Me(u.id)
                                        }
                                      ),
                                      /* @__PURE__ */ i("span", { className: "sr-only", children: [
                                        "关联 ",
                                        u.name
                                      ] })
                                    ] })
                                  }
                                ),
                                /* @__PURE__ */ t(
                                  ee,
                                  {
                                    label: M ? `${d ? "查看" : "编辑"}${ae[s]}提示词：${u.name}` : `AI 新增${ae[s]}，确认镜头后可编辑：${u.name}`,
                                    children: /* @__PURE__ */ i(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: !M,
                                        onClick: () => I(u.id),
                                        children: [
                                          /* @__PURE__ */ t("span", { children: u.name }),
                                          !d && M ? /* @__PURE__ */ t(vt, { size: 11 }) : null
                                        ]
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            u.id
                          );
                        }) })
                      ] }, s) : null;
                    }) }) : /* @__PURE__ */ t("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                  ] }),
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ i("div", { children: [
                        /* @__PURE__ */ t("strong", { children: "角色配音与旁白" }),
                        /* @__PURE__ */ i("span", { children: [
                          p.speech.length,
                          " 条语音"
                        ] })
                      ] }),
                      d ? null : /* @__PURE__ */ i("div", { children: [
                        /* @__PURE__ */ i(
                          "button",
                          {
                            type: "button",
                            onClick: () => _((s) => ({
                              ...s,
                              speech: [
                                ...s.speech,
                                ct(s, "dialogue")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ t(we, { size: 13 }),
                              "添加对白"
                            ]
                          }
                        ),
                        /* @__PURE__ */ i(
                          "button",
                          {
                            type: "button",
                            onClick: () => _((s) => ({
                              ...s,
                              speech: [
                                ...s.speech,
                                ct(s, "narration")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ t(we, { size: 13 }),
                              "添加旁白"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-speech-list", children: p.speech.length ? p.speech.map((s, m) => /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ i("strong", { children: [
                          "语音 ",
                          m + 1
                        ] }),
                        d ? null : /* @__PURE__ */ i("div", { children: [
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "上移语音",
                              disabled: m === 0,
                              onClick: () => se(s.id, -1),
                              children: /* @__PURE__ */ t(it, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "下移语音",
                              disabled: m === p.speech.length - 1,
                              onClick: () => se(s.id, 1),
                              children: /* @__PURE__ */ t(at, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "删除语音",
                              danger: !0,
                              onClick: () => _((u) => ({
                                ...u,
                                speech: u.speech.filter(
                                  (S) => S.id !== s.id
                                )
                              })),
                              children: /* @__PURE__ */ t(Ue, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ i("label", { children: [
                          "类型",
                          /* @__PURE__ */ i(
                            "select",
                            {
                              value: s.kind,
                              disabled: d,
                              onChange: (u) => Y(s.id, {
                                kind: u.target.value
                              }),
                              children: [
                                /* @__PURE__ */ t("option", { value: "dialogue", children: "角色对白" }),
                                /* @__PURE__ */ t("option", { value: "narration", children: "旁白" })
                              ]
                            }
                          )
                        ] }),
                        s.kind === "dialogue" ? /* @__PURE__ */ i(Ye, { children: [
                          /* @__PURE__ */ i("label", { children: [
                            "角色",
                            /* @__PURE__ */ i(
                              "select",
                              {
                                value: s.character_id || "",
                                disabled: d,
                                onChange: (u) => Y(s.id, {
                                  character_id: u.target.value
                                }),
                                children: [
                                  /* @__PURE__ */ t("option", { value: "", children: "请选择角色" }),
                                  g.map((u) => /* @__PURE__ */ t("option", { value: u.id, children: u.name }, u.id))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ i("label", { children: [
                            "说话方式",
                            /* @__PURE__ */ i(
                              "select",
                              {
                                value: s.speaker_mode || "offscreen",
                                disabled: d,
                                onChange: (u) => Y(s.id, {
                                  speaker_mode: u.target.value === "visible" ? "visible" : "offscreen"
                                }),
                                children: [
                                  /* @__PURE__ */ t("option", { value: "visible", children: "出镜对白" }),
                                  /* @__PURE__ */ t("option", { value: "offscreen", children: "画外音" })
                                ]
                              }
                            )
                          ] })
                        ] }) : null,
                        /* @__PURE__ */ i("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: Math.max(0, p.duration - 0.01),
                                step: 0.1,
                                value: s.start_time,
                                disabled: d,
                                onChange: (u) => Y(s.id, {
                                  start_time: Fe(u)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ i("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ t(
                          "textarea",
                          {
                            value: s.text,
                            readOnly: d,
                            placeholder: s.kind === "narration" ? "输入旁白" : "输入对白",
                            onChange: (u) => Y(s.id, { text: u.target.value })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-subtitle", children: [
                        /* @__PURE__ */ i("label", { children: [
                          /* @__PURE__ */ t(
                            "input",
                            {
                              type: "checkbox",
                              checked: s.subtitle_enabled,
                              disabled: d,
                              onChange: (u) => Y(s.id, {
                                subtitle_enabled: u.target.checked
                              })
                            }
                          ),
                          "加入字幕"
                        ] }),
                        s.subtitle_enabled ? /* @__PURE__ */ t(
                          "input",
                          {
                            value: s.subtitle_text,
                            readOnly: d,
                            placeholder: "可选：填写精简字幕；留空使用原文",
                            onChange: (u) => Y(s.id, {
                              subtitle_text: u.target.value
                            })
                          }
                        ) : null
                      ] })
                    ] }, s.id)) : /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ t(en, { size: 24 }),
                      /* @__PURE__ */ t("span", { children: "当前镜头没有对白或旁白" })
                    ] }) }),
                    P.size > 1 ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
                    R ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
                  ] }),
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ i("div", { children: [
                        /* @__PURE__ */ t("strong", { children: "附加字幕文案" }),
                        /* @__PURE__ */ i("span", { children: [
                          p.captions.length,
                          " 条文案"
                        ] })
                      ] }),
                      d ? null : /* @__PURE__ */ i(
                        "button",
                        {
                          type: "button",
                          onClick: () => _((s) => ({
                            ...s,
                            captions: [
                              ...s.captions,
                              wn(s)
                            ]
                          })),
                          children: [
                            /* @__PURE__ */ t(we, { size: 13 }),
                            "添加文案"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ t("div", { className: "ws-storyboard-speech-list", children: p.captions.length ? p.captions.map((s, m) => /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ i("strong", { children: [
                          "文案 ",
                          m + 1
                        ] }),
                        d ? null : /* @__PURE__ */ i("div", { children: [
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "上移文案",
                              disabled: m === 0,
                              onClick: () => oe(s.id, -1),
                              children: /* @__PURE__ */ t(it, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "下移文案",
                              disabled: m === p.captions.length - 1,
                              onClick: () => oe(s.id, 1),
                              children: /* @__PURE__ */ t(at, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ t(
                            pe,
                            {
                              label: "删除文案",
                              danger: !0,
                              onClick: () => _((u) => ({
                                ...u,
                                captions: u.captions.filter(
                                  (S) => S.id !== s.id
                                )
                              })),
                              children: /* @__PURE__ */ t(Ue, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ i("label", { children: [
                          "类型",
                          /* @__PURE__ */ i(
                            "select",
                            {
                              value: s.type,
                              disabled: d,
                              onChange: (u) => j(s.id, {
                                type: u.target.value
                              }),
                              children: [
                                /* @__PURE__ */ t("option", { value: "caption", children: "说明" }),
                                /* @__PURE__ */ t("option", { value: "title", children: "标题" }),
                                /* @__PURE__ */ t("option", { value: "highlight", children: "重点" })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ i("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: p.duration,
                                step: 0.1,
                                value: s.start_time,
                                disabled: d,
                                onChange: (u) => j(s.id, {
                                  start_time: Fe(u)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] }),
                        /* @__PURE__ */ i("label", { children: [
                          "结束时间",
                          /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ t(
                              "input",
                              {
                                type: "number",
                                min: 0.1,
                                max: p.duration,
                                step: 0.1,
                                value: s.end_time,
                                disabled: d,
                                onChange: (u) => j(s.id, {
                                  end_time: Fe(u)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ i("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ t(
                          "textarea",
                          {
                            value: s.text,
                            readOnly: d,
                            placeholder: "输入不对应语音的标题、说明或重点文字",
                            onChange: (u) => j(s.id, {
                              text: u.target.value
                            })
                          }
                        )
                      ] })
                    ] }, s.id)) : /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ t(qe, { size: 24 }),
                      /* @__PURE__ */ t("span", { children: "当前镜头没有附加字幕文案" })
                    ] }) }),
                    x ? /* @__PURE__ */ t("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ i("footer", { children: [
              !d && b ? /* @__PURE__ */ t(
                Qn,
                {
                  title: `AI 生成镜头 ${String(n + 1).padStart(2, "0")}`,
                  description: "可以补充本镜头的内容、动作、镜头语言或素材要求；不填也会按当前分镜生成。",
                  triggerLabel: "AI 生成",
                  triggerClassName: "is-ai",
                  triggerVariant: "outline",
                  triggerSize: "sm",
                  disabled: T,
                  textareaPlaceholder: "可选：输入本次镜头的补充要求，留空则按当前分镜上下文生成。",
                  submitLabel: "确定生成",
                  loadingText: "正在生成镜头",
                  errorText: "生成镜头失败",
                  referencesEnabled: !1,
                  stoppable: !1,
                  onSubmit: ({ instruction: s }) => Ce(s)
                }
              ) : null,
              /* @__PURE__ */ t("button", { type: "button", disabled: T, onClick: O, children: d ? "关闭" : "取消" }),
              d ? null : /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: T || P.size > 1 || R || F || D || x,
                  onClick: () => B(
                    p,
                    w.filter(
                      (s) => l.has(s.id) || p.material_ids.includes(s.id)
                    )
                  ),
                  children: [
                    /* @__PURE__ */ t(me, { size: 14 }),
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
  return typeof document > "u" ? null : je(ke, $ || document.body);
}
function Ve({
  label: e,
  value: n,
  content: a,
  placeholder: r,
  readonly: o,
  referenceAdapter: d,
  onChange: f
}) {
  return /* @__PURE__ */ i("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t(
      In,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: n,
        content: a,
        adapter: d,
        placeholder: r,
        disabled: o,
        layerZIndex: 2700,
        onChange: f
      }
    )
  ] });
}
function Oe({
  label: e,
  value: n,
  placeholder: a,
  readonly: r,
  onChange: o
}) {
  return /* @__PURE__ */ i("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: n,
        rows: 3,
        placeholder: a,
        readOnly: r,
        onChange: (d) => o(d.target.value)
      }
    )
  ] });
}
function sr(e, n) {
  return {
    ...e,
    shots: e.shots.map((a) => {
      const r = { ...a.reference_contents || {} };
      for (const o of or) {
        const d = Cn(
          a[o],
          r[o],
          n
        );
        d ? r[o] = d : delete r[o];
      }
      return { ...a, reference_contents: r };
    })
  };
}
const or = [
  "description",
  "camera_instruction",
  "video_prompt"
];
function lr(e, n, a, r) {
  const o = { ...e.reference_contents || {} };
  return r ? o[n] = r : delete o[n], {
    [n]: a,
    reference_contents: o
  };
}
function pe({
  label: e,
  disabled: n,
  danger: a = !1,
  onClick: r,
  children: o
}) {
  return /* @__PURE__ */ t(ee, { label: e, children: /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${a ? "is-danger" : ""}`,
      "aria-label": e,
      disabled: n,
      onClick: r,
      children: o
    }
  ) });
}
function cr({ status: e }) {
  return /* @__PURE__ */ i("span", { className: `ws-storyboard-save-state is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ t(Ne, { size: 12, className: "ws-spin" }) : e === "saved" ? /* @__PURE__ */ t(me, { size: 12 }) : null,
    e === "typing" ? "编辑中" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存"
  ] });
}
function dr(e, n) {
  const a = { ...e, ...n };
  return a.kind === "dialogue" ? (a.character_id ||= "", a.speaker_mode ||= "offscreen") : (delete a.character_id, delete a.speaker_mode), a.subtitle_enabled = !!a.subtitle_enabled, a.subtitle_text ||= "", a;
}
function ur(e) {
  return e.continue_previous ? "continue" : e.match_previous ? "match" : "independent";
}
function pr(e, n, a) {
  const r = n !== "independent";
  return {
    ...e,
    match_previous: n === "match",
    continue_previous: n === "continue",
    continuity_anchor: n === "continue" ? e.continuity_anchor : "",
    continuity_state: r ? {
      ...e.continuity_state,
      entry: a?.continuity_state.exit || e.continuity_state.entry
    } : e.continuity_state
  };
}
function hr(e, n) {
  const a = Number(e.target.value);
  return yt(a) ? a : n;
}
function mr(e, n, a) {
  const r = Number(e.target.value);
  return Number.isInteger(r) && r >= a ? r : n;
}
function Fe(e) {
  const n = Number.parseFloat(e.target.value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function Tt(e) {
  const n = new Set(e.map((o) => o.id));
  let a = e.length, r = dt(a);
  for (; n.has(r.id); )
    a += 1, r = dt(a);
  return r;
}
function fr(e, n) {
  const a = Tt(e);
  return {
    ...Et(n),
    id: a.id,
    order: a.order,
    speech: n.speech.map((r, o) => ({
      ...r,
      id: `${a.id}-speech-${o + 1}`
    })),
    captions: n.captions.map((r, o) => ({
      ...r,
      id: `${a.id}-caption-${o + 1}`
    }))
  };
}
function Et(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    continuity_state: { ...e.continuity_state },
    speech: e.speech.map((n) => ({ ...n })),
    captions: e.captions.map((n) => ({ ...n })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
export {
  kr as StoryboardView
};
