import { a as i, j as e, F as we, S as ye } from "./space-storyboard-material-ECvLpyk_.js";
import { s as At } from "./space-media-references-BUYeAxyJ.js";
import { a as T, b as D, d as G, u as Re, l as Pt } from "./file-kind-Cq3pESGF.js";
import { L as Ft, P as _e, as as Je, at as Ze, h as Qe, aG as Lt, B as Be, H as Yt, d as Vt, X as qt, q as ht, ac as Ke, r as Fe, n as Le, Q as Ut } from "./vendor-icons-BZHLe0mm.js";
import { k as jt, l as et, m as Se, n as Gt, o as Ht, S as pt, g as Xt, f as Wt, d as Jt, q as Zt, M as mt, r as tt, t as nt, u as Qt, v as Kt, w as ze, i as en, x as tn, y as nn, z as rt, B as rn, e as an, C as xe, D as sn, E as on, c as ln, F as at, G as cn } from "./asset-preview-Bb3VoJnt.js";
import { o as st, s as De, m as dn } from "./text-content-save-actions-CrfXuWSV.js";
import { d as un, t as hn } from "./writing-reference-Bgk4pNta.js";
import { u as ft, C as pn, a as mn } from "./space-reference-editor-Co9tuhcH.js";
import { S as gt, b as fn } from "./space-storyboard-material-dialog-Bh12SKvW.js";
import { B as Q, D as bt } from "./asset-audio-preview-Cezm24us.js";
import "./space-storyboard-confirm-dialog-BDTdbniY.js";
function it({
  storyboard: t,
  editable: l,
  onChange: a
}) {
  const r = t.screenplay;
  return r ? /* @__PURE__ */ i("section", { className: "ws-screenplay", children: [
    /* @__PURE__ */ e("p", { children: "系统按本章正文自动拆分场景，再生成镜头；这里可以对照原文查看剧本。" }),
    r.parts.map((s, h) => /* @__PURE__ */ i("article", { children: [
      /* @__PURE__ */ i("strong", { children: [
        h + 1,
        ". ",
        s.title
      ] }),
      /* @__PURE__ */ i("small", { children: [
        "原文第 ",
        s.source_start,
        "—",
        s.source_end,
        " 段 ·",
        " ",
        s.connection === "reset" ? "换场" : s.connection === "match" ? "同场换机位" : "动作接续"
      ] }),
      l ? /* @__PURE__ */ e(
        "textarea",
        {
          className: "nodrag nopan nowheel",
          "aria-label": s.title,
          value: s.description,
          onChange: (m) => a?.({
            ...t,
            screenplay: {
              ...r,
              parts: r.parts.map(
                (S, I) => I === h ? { ...S, description: m.target.value } : S
              )
            }
          })
        }
      ) : /* @__PURE__ */ e("p", { children: s.description }),
      /* @__PURE__ */ i("details", { children: [
        /* @__PURE__ */ e("summary", { children: "对照原文" }),
        /* @__PURE__ */ e("p", { children: r.source_passages.slice(s.source_start - 1, s.source_end).map((m) => m.text).join("") })
      ] })
    ] }, h))
  ] }) : null;
}
function gn({
  storyboard: t,
  referenceItems: l,
  workType: a,
  purposeSpecs: r,
  editable: s,
  disabled: h,
  onChange: m
}) {
  const S = ft(l);
  if (t.references.length === 0)
    return null;
  const I = (n, _, o = !1) => {
    let g = o ? vt(t, n) : t;
    if (g = {
      ...g,
      references: g.references.map(
        (b) => b.key === n ? { ...b, ..._ } : b
      )
    }, o) {
      const b = g.references.find((A) => A.key === n), v = b ? ot(g, b, r) : [];
      v.length === 1 && (g = lt(g, n, v[0].value));
    }
    m(g);
  };
  return /* @__PURE__ */ i("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ e(Ft, { size: 14 }),
      /* @__PURE__ */ e("strong", { children: "参考素材" }),
      /* @__PURE__ */ i("span", { children: [
        t.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ws-storyboard-reference-list", children: t.references.map((n) => {
      const _ = ot(
        t,
        n,
        r
      ), o = vn(t, n.key), g = jt(
        n.kind,
        a,
        r
      ), b = g.some(
        (v) => v.value === n.purpose
      );
      return /* @__PURE__ */ i(
        "div",
        {
          className: `ws-storyboard-reference-row ${b ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ e(
              pn,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${n.label}`,
                content: bn(n),
                adapter: S
              }
            ),
            s ? /* @__PURE__ */ i(we, { children: [
              /* @__PURE__ */ i(
                "select",
                {
                  className: "nodrag nopan",
                  value: n.purpose,
                  disabled: h,
                  "aria-label": `${n.label}的参考用途`,
                  onChange: (v) => I(
                    n.key,
                    {
                      purpose: v.target.value
                    },
                    !0
                  ),
                  children: [
                    b ? null : /* @__PURE__ */ i("option", { value: n.purpose, children: [
                      et(
                        n.purpose,
                        r
                      ),
                      "（当前类型不支持）"
                    ] }),
                    g.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ),
              ct(
                n.purpose,
                r
              ) ? /* @__PURE__ */ i(
                "select",
                {
                  className: "nodrag nopan",
                  value: o,
                  disabled: h,
                  "aria-label": `${n.label}的关联目标`,
                  onChange: (v) => m(
                    lt(
                      t,
                      n.key,
                      v.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "选择关联目标" }),
                    _.map((v) => /* @__PURE__ */ e("option", { value: v.value, children: v.label }, v.value))
                  ]
                }
              ) : /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-global", children: dt(
                n.purpose,
                r
              ) })
            ] }) : /* @__PURE__ */ i(we, { children: [
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-purpose", children: et(
                n.purpose,
                r
              ) }),
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-target", children: yn(t, o) || (ct(
                n.purpose,
                r
              ) ? "未关联" : dt(
                n.purpose,
                r
              )) })
            ] })
          ]
        },
        n.key
      );
    }) })
  ] });
}
function bn(t) {
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
function ot(t, l, a) {
  const r = Se(
    l.purpose,
    a
  );
  return r?.scope === "material" ? t.materials.filter((s) => s.type === r.material_type).map((s) => ({
    value: `material:${s.id}`,
    label: s.name
  })) : r?.scope === "shot" ? t.shots.map((s, h) => ({
    value: `shot:${s.id}`,
    label: `镜头 ${s.order || h + 1}`
  })) : [];
}
function vn(t, l) {
  const a = t.materials.find(
    (s) => s.reference_keys.includes(l)
  );
  if (a)
    return `material:${a.id}`;
  const r = t.shots.find(
    (s) => s.reference_keys.includes(l)
  );
  return r ? `shot:${r.id}` : "";
}
function yn(t, l) {
  const [a, r] = l.split(":", 2);
  if (a === "material")
    return t.materials.find((s) => s.id === r)?.name || "";
  if (a === "shot") {
    const s = t.shots.findIndex((h) => h.id === r);
    return s >= 0 ? `镜头 ${t.shots[s].order || s + 1}` : "";
  }
  return "";
}
function lt(t, l, a) {
  const r = vt(t, l);
  if (!a)
    return r;
  const [s, h] = a.split(":", 2);
  return s === "material" ? {
    ...r,
    materials: r.materials.map(
      (m) => m.id === h ? {
        ...m,
        reference_keys: [...m.reference_keys, l]
      } : m
    )
  } : s === "shot" ? {
    ...r,
    shots: r.shots.map(
      (m) => m.id === h ? { ...m, reference_keys: [...m.reference_keys, l] } : m
    )
  } : r;
}
function vt(t, l) {
  return {
    ...t,
    materials: t.materials.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter(
        (r) => r !== l
      )
    })),
    shots: t.shots.map((a) => ({
      ...a,
      reference_keys: a.reference_keys.filter((r) => r !== l)
    }))
  };
}
function ct(t, l) {
  const a = Se(t, l)?.scope;
  return a === "material" || a === "shot";
}
function dt(t, l) {
  const a = Se(t, l);
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
function _n(t, l = {}) {
  if (t.screenplay && !t.shots.length)
    return t.screenplay.parts.some((n) => !n.description.trim()) ? [{ id: "screenplay", message: "场次剧本不能为空", severity: "error" }] : [];
  const a = Cn(t, l), r = [], s = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set(), S = new Map(
    t.references.map((n) => [n.key, n])
  );
  if (l.workTypeSpecs?.length && l.purposeSpecs?.length) {
    const n = Gt(
      t.references,
      t.work_type,
      l.workTypeSpecs,
      l.purposeSpecs
    );
    n && r.push(Ae("references", n));
  }
  for (const n of t.materials) {
    n.id.trim() ? s.has(n.id) && r.push(Z(n, `素材标识“${n.id}”重复`)) : r.push(Z(n, "缺少稳定标识")), a.referenceImages && !n.prompt.trim() && r.push(Z(n, "生成提示词不能为空")), n.type !== "character" && n.voice.trim() && r.push(Z(n, "只有角色可以配置音色"));
    for (const _ of n.reference_keys) {
      const o = S.get(_);
      o ? l.purposeSpecs?.length && Se(
        o.purpose,
        l.purposeSpecs || []
      )?.material_type !== n.type && r.push(
        Z(n, `参考素材“${o.label}”的用途不匹配`)
      ) : r.push(
        Z(n, `引用了不存在的参考素材“${_}”`)
      );
    }
    s.set(n.id, n);
  }
  if (a.voice && wn(t, r), !t.shots.length)
    return r.push(Ae("shots", "分镜至少需要一个镜头")), r;
  const I = /* @__PURE__ */ new Set();
  return t.shots.forEach((n, _) => {
    const o = _ + 1;
    (!n.id.trim() || I.has(n.id)) && r.push(R(n, o, "镜头标识缺失或重复")), I.add(n.id), Ht(n.duration) || r.push(
      R(
        n,
        o,
        `时长必须是不小于 ${mt} 秒的整数`
      )
    ), n.description.trim() || r.push(R(n, o, "镜头描述不能为空")), a.shotVideos && !n.video_prompt.trim() && r.push(R(n, o, "视频提示词不能为空"));
    for (const b of n.reference_keys) {
      const v = S.get(b);
      v ? l.purposeSpecs?.length && Se(
        v.purpose,
        l.purposeSpecs || []
      )?.scope !== "shot" && r.push(
        R(
          n,
          o,
          `参考素材“${v.label}”的用途不匹配`
        )
      ) : r.push(
        R(
          n,
          o,
          `引用了不存在的参考素材“${b}”`
        )
      );
    }
    const g = /* @__PURE__ */ new Set();
    for (const b of n.material_ids)
      s.has(b) ? g.has(b) && r.push(R(n, o, `重复引用素材“${b}”`)) : r.push(
        R(n, o, `引用了不存在的素材“${b}”`)
      ), g.add(b);
    _ === 0 && n.continue_previous && r.push(R(n, o, "第一个镜头不能承接上一镜头")), _ === 0 && n.match_previous && r.push(R(n, o, "第一个镜头不能匹配上一镜头")), n.match_previous && n.continue_previous && r.push(
      R(n, o, "不能同时匹配上一镜画面和延续上一镜视频")
    ), a.shotVideos && (pt.includes(n.transition_type) || r.push(R(n, o, "结构化转场类型无效")), _ === 0 && (n.transition_type !== "none" || n.transition_duration_ms !== 0) ? r.push(R(n, o, "第一镜不能配置转场效果")) : n.transition_type === "none" && n.transition_duration_ms !== 0 ? r.push(R(n, o, "硬切的转场时长必须为 0")) : n.transition_type !== "none" && (n.transition_duration_ms < 100 || n.transition_duration_ms > 5e3) && r.push(
      R(n, o, "转场时长必须是 100 到 5000 毫秒")
    )), (a.voice || a.subtitles) && Sn(
      n,
      o,
      s,
      g,
      h,
      r
    ), a.subtitles && Nn(n, o, m, r);
  }), r;
}
function wn(t, l) {
  const a = /* @__PURE__ */ new Set();
  let r = !1;
  for (const s of t.shots)
    for (const h of s.speech)
      h.text.trim() && (h.kind === "narration" ? r = !0 : h.character_id && a.add(h.character_id));
  r && !t.narrator_voice.trim() && l.push(Ae("narrator_voice", "旁白：请选择音色"));
  for (const s of t.materials)
    a.has(s.id) && s.type === "character" && !s.voice.trim() && l.push(Z(s, "请选择音色"));
}
function Sn(t, l, a, r, s, h) {
  for (const m of t.speech) {
    if ((!m.id.trim() || s.has(m.id)) && h.push(R(t, l, "语音标识缺失或重复")), s.add(m.id), m.text.trim() || h.push(R(t, l, "对白或旁白文本不能为空")), (m.start_time < 0 || m.start_time >= t.duration) && h.push(R(t, l, "语音开始时间超出镜头范围")), m.kind !== "dialogue")
      continue;
    const S = m.character_id || "";
    a.get(S)?.type !== "character" ? h.push(R(t, l, "对白没有选择有效角色")) : r.has(S) || h.push(R(t, l, "对白角色未关联到当前镜头"));
  }
}
function Nn(t, l, a, r) {
  for (const s of t.captions)
    (!s.id.trim() || a.has(s.id)) && r.push(R(t, l, "字幕标识缺失或重复")), a.add(s.id), s.text.trim() || r.push(R(t, l, "字幕文案不能为空")), (s.start_time < 0 || s.end_time <= s.start_time || s.end_time > t.duration) && r.push(R(t, l, "字幕时间范围超出镜头"));
}
function Cn(t, l) {
  return l.coreOnly ? {
    referenceImages: !1,
    shotVideos: !1,
    voice: !1,
    subtitles: !1
  } : {
    referenceImages: Zt(t),
    shotVideos: Jt(t),
    voice: Wt(t),
    subtitles: Xt(t)
  };
}
function Ae(t, l) {
  return { id: t, message: l, severity: "error" };
}
function Z(t, l) {
  return {
    id: `material:${t.id}:${l}`,
    message: `${t.name || "未命名素材"}：${l}`,
    severity: "error",
    materialId: t.id
  };
}
function R(t, l, a) {
  return {
    id: `shot:${t.id}:${a}`,
    message: `镜头 ${l}：${a}`,
    severity: "error",
    shotId: t.id
  };
}
const yt = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt"
];
function Pe(t, l, a, r) {
  const s = { ...t.reference_contents || {} };
  return r ? s[l] = r : delete s[l], {
    [l]: a,
    reference_contents: s
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
function _t(t, l, a) {
  const r = t.shots.findIndex((n) => n.id === l.id);
  if (r < 0) return t;
  const s = t.shots[r], h = [...t.shots];
  h[r] = l;
  const m = new Set([...t.materials, ...a].filter((n) => n.type === "scene").map((n) => n.id));
  if (tt(s, m) !== tt(l, m))
    return { ...t, materials: a, shots: h };
  const S = t.shots[r - 1], I = t.shots[r + 1];
  return S && s.continue_previous && l.continue_previous && s.start_framing?.trim() && (s.start_framing?.trim() || "") === (S.end_framing?.trim() || "") && l.start_framing !== s.start_framing && (h[r - 1] = {
    ...S,
    ...Pe(
      S,
      "end_framing",
      l.start_framing || ""
    )
  }), I?.continue_previous && s.end_framing?.trim() && (s.end_framing?.trim() || "") === (I.start_framing?.trim() || "") && l.end_framing !== s.end_framing && (h[r + 1] = {
    ...I,
    ...Pe(
      I,
      "start_framing",
      l.end_framing || ""
    )
  }), { ...t, materials: a, shots: h };
}
function wt(t, l, a) {
  return _n(_t(t, l, a)).filter(
    (r) => r.shotId === l.id || !!(r.materialId && l.material_ids.includes(r.materialId))
  );
}
function In(t, l, a) {
  if (a.shot.id !== l.id || a.shot.order !== l.order)
    throw new Error("生成的镜头标识或顺序与当前镜头不符");
  const r = { ...a.shot.reference_contents };
  for (const m of yt)
    l[m] === a.shot[m] && l.reference_contents?.[m] && (r[m] = l.reference_contents[m]);
  const s = { ...a.shot, reference_contents: r }, h = wt(
    t,
    s,
    a.materials
  );
  if (h.length)
    throw new Error(h.map((m) => m.message).join("；"));
  return { shot: Ye(s), materials: a.materials };
}
function Rn({
  shot: t,
  materials: l,
  readonly: a,
  onChange: r
}) {
  const s = l.filter(
    (n) => n.type === "character"
  ), h = (n, _) => {
    r((o) => {
      const g = o.speech.map(
        (v) => v.id === n ? kn(v, _) : v
      ), b = g.filter((v) => v.kind === "dialogue").map((v) => v.character_id || "").filter(Boolean);
      return {
        ...o,
        material_ids: [.../* @__PURE__ */ new Set([...o.material_ids, ...b])],
        speech: g
      };
    });
  }, m = (n, _) => {
    r((o) => {
      const g = o.speech.findIndex(
        (H) => H.id === n
      ), b = g + _;
      if (g < 0 || b < 0 || b >= o.speech.length)
        return o;
      const v = [...o.speech], [A] = v.splice(g, 1);
      return v.splice(b, 0, A), { ...o, speech: v };
    });
  }, S = (n, _) => {
    r((o) => ({
      ...o,
      captions: o.captions.map(
        (g) => g.id === n ? { ...g, ..._ } : g
      )
    }));
  }, I = (n, _) => {
    r((o) => {
      const g = o.captions.findIndex(
        (H) => H.id === n
      ), b = g + _;
      if (g < 0 || b < 0 || b >= o.captions.length)
        return o;
      const v = [...o.captions], [A] = v.splice(g, 1);
      return v.splice(b, 0, A), { ...o, captions: v };
    });
  };
  return /* @__PURE__ */ i(we, { children: [
    /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
      /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ e("strong", { children: "角色配音与旁白" }),
          /* @__PURE__ */ i("span", { children: [
            t.speech.length,
            " 条语音"
          ] })
        ] }),
        a ? null : /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: () => r((n) => ({
                ...n,
                speech: [
                  ...n.speech,
                  nt(n, "dialogue")
                ]
              })),
              children: [
                /* @__PURE__ */ e(_e, { size: 13 }),
                "添加对白"
              ]
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: () => r((n) => ({
                ...n,
                speech: [
                  ...n.speech,
                  nt(n, "narration")
                ]
              })),
              children: [
                /* @__PURE__ */ e(_e, { size: 13 }),
                "添加旁白"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.speech.length ? t.speech.map((n, _) => /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ i("strong", { children: [
            "语音 ",
            _ + 1
          ] }),
          a ? null : /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ e(
              ce,
              {
                label: "上移语音",
                disabled: _ === 0,
                onClick: () => m(n.id, -1),
                children: /* @__PURE__ */ e(Je, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              ce,
              {
                label: "下移语音",
                disabled: _ === t.speech.length - 1,
                onClick: () => m(n.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              ce,
              {
                label: "删除语音",
                danger: !0,
                onClick: () => r((o) => ({
                  ...o,
                  speech: o.speech.filter(
                    (g) => g.id !== n.id
                  )
                })),
                children: /* @__PURE__ */ e(Qe, { size: 13 })
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
                value: n.kind,
                disabled: a,
                onChange: (o) => h(n.id, {
                  kind: o.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "dialogue", children: "角色对白" }),
                  /* @__PURE__ */ e("option", { value: "narration", children: "旁白" })
                ]
              }
            )
          ] }),
          n.kind === "dialogue" ? /* @__PURE__ */ i(we, { children: [
            /* @__PURE__ */ i("label", { children: [
              "角色",
              /* @__PURE__ */ i(
                "select",
                {
                  value: n.character_id || "",
                  disabled: a,
                  onChange: (o) => h(n.id, {
                    character_id: o.target.value
                  }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "请选择角色" }),
                    s.map((o) => /* @__PURE__ */ e("option", { value: o.id, children: o.name }, o.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ i("label", { children: [
              "说话方式",
              /* @__PURE__ */ i(
                "select",
                {
                  value: n.speaker_mode || "offscreen",
                  disabled: a,
                  onChange: (o) => h(n.id, {
                    speaker_mode: o.target.value === "visible" ? "visible" : "offscreen"
                  }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "visible", children: "出镜对白" }),
                    /* @__PURE__ */ e("option", { value: "offscreen", children: "画外音" })
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ i("label", { children: [
            "开始时间",
            /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0,
                  max: Math.max(0, t.duration - 0.01),
                  step: 0.1,
                  value: n.start_time,
                  disabled: a,
                  onChange: (o) => h(n.id, {
                    start_time: $e(o)
                  })
                }
              ),
              "秒"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("label", { className: "ws-storyboard-speech-text", children: [
          "文本",
          /* @__PURE__ */ e(
            "textarea",
            {
              value: n.text,
              readOnly: a,
              placeholder: n.kind === "narration" ? "输入旁白" : "输入对白",
              onChange: (o) => h(n.id, {
                text: o.target.value
              })
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-subtitle", children: [
          /* @__PURE__ */ i("label", { children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: n.subtitle_enabled,
                disabled: a,
                onChange: (o) => h(n.id, {
                  subtitle_enabled: o.target.checked
                })
              }
            ),
            "加入字幕"
          ] }),
          n.subtitle_enabled ? /* @__PURE__ */ e(
            "input",
            {
              value: n.subtitle_text,
              readOnly: a,
              placeholder: "可选：填写精简字幕；留空使用原文",
              onChange: (o) => h(n.id, {
                subtitle_text: o.target.value
              })
            }
          ) : null
        ] })
      ] }, n.id)) : /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e(Lt, { size: 24 }),
        /* @__PURE__ */ e("span", { children: "当前镜头没有对白或旁白" })
      ] }) })
    ] }),
    /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
      /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
        /* @__PURE__ */ i("div", { children: [
          /* @__PURE__ */ e("strong", { children: "附加字幕文案" }),
          /* @__PURE__ */ i("span", { children: [
            t.captions.length,
            " 条文案"
          ] })
        ] }),
        a ? null : /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            onClick: () => r((n) => ({
              ...n,
              captions: [
                ...n.captions,
                Qt(n)
              ]
            })),
            children: [
              /* @__PURE__ */ e(_e, { size: 13 }),
              "添加文案"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: t.captions.length ? t.captions.map((n, _) => /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row", children: [
        /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-row-head", children: [
          /* @__PURE__ */ i("strong", { children: [
            "文案 ",
            _ + 1
          ] }),
          a ? null : /* @__PURE__ */ i("div", { children: [
            /* @__PURE__ */ e(
              ce,
              {
                label: "上移文案",
                disabled: _ === 0,
                onClick: () => I(n.id, -1),
                children: /* @__PURE__ */ e(Je, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              ce,
              {
                label: "下移文案",
                disabled: _ === t.captions.length - 1,
                onClick: () => I(n.id, 1),
                children: /* @__PURE__ */ e(Ze, { size: 13 })
              }
            ),
            /* @__PURE__ */ e(
              ce,
              {
                label: "删除文案",
                danger: !0,
                onClick: () => r((o) => ({
                  ...o,
                  captions: o.captions.filter(
                    (g) => g.id !== n.id
                  )
                })),
                children: /* @__PURE__ */ e(Qe, { size: 13 })
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
                value: n.type,
                disabled: a,
                onChange: (o) => S(n.id, {
                  type: o.target.value
                }),
                children: [
                  /* @__PURE__ */ e("option", { value: "caption", children: "说明" }),
                  /* @__PURE__ */ e("option", { value: "title", children: "标题" }),
                  /* @__PURE__ */ e("option", { value: "highlight", children: "重点" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ i("label", { children: [
            "开始时间",
            /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0,
                  max: t.duration,
                  step: 0.1,
                  value: n.start_time,
                  disabled: a,
                  onChange: (o) => S(n.id, {
                    start_time: $e(o)
                  })
                }
              ),
              "秒"
            ] })
          ] }),
          /* @__PURE__ */ i("label", { children: [
            "结束时间",
            /* @__PURE__ */ i("span", { className: "ws-storyboard-time-input", children: [
              /* @__PURE__ */ e(
                "input",
                {
                  type: "number",
                  min: 0.1,
                  max: t.duration,
                  step: 0.1,
                  value: n.end_time,
                  disabled: a,
                  onChange: (o) => S(n.id, {
                    end_time: $e(o)
                  })
                }
              ),
              "秒"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i("label", { className: "ws-storyboard-speech-text", children: [
          "文本",
          /* @__PURE__ */ e(
            "textarea",
            {
              value: n.text,
              readOnly: a,
              placeholder: "输入不对应语音的标题、说明或重点文字",
              onChange: (o) => S(n.id, {
                text: o.target.value
              })
            }
          )
        ] })
      ] }, n.id)) : /* @__PURE__ */ i("div", { className: "ws-storyboard-speech-empty", children: [
        /* @__PURE__ */ e(Be, { size: 24 }),
        /* @__PURE__ */ e("span", { children: "当前镜头没有附加字幕文案" })
      ] }) })
    ] })
  ] });
}
function ce({
  label: t,
  disabled: l,
  danger: a = !1,
  onClick: r,
  children: s
}) {
  return /* @__PURE__ */ e(Q, { label: t, children: /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${a ? "is-danger" : ""}`,
      "aria-label": t,
      disabled: l,
      onClick: r,
      children: s
    }
  ) });
}
function kn(t, l) {
  const a = { ...t, ...l };
  return a.kind === "dialogue" ? (a.character_id ||= "", a.speaker_mode ||= "offscreen") : (delete a.character_id, delete a.speaker_mode), a.subtitle_enabled = !!a.subtitle_enabled, a.subtitle_text ||= "", a;
}
function $e(t) {
  const l = Number.parseFloat(t.target.value);
  return Number.isFinite(l) && l >= 0 ? l : 0;
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const Ne = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Ne || Object.keys(Ne).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const On = Ne.Dialog, Tn = Ne.DialogContent, En = Ne.DialogTitle;
function Mn({
  shot: t,
  index: l,
  storyboard: a,
  materials: r,
  readonly: s,
  referenceAdapter: h,
  frame: m,
  onGenerate: S,
  onNavigate: I,
  onSave: n,
  onClose: _
}) {
  const [o, g] = T(() => Ye(t)), [b, v] = T(
    () => r.map((d) => ({ ...d }))
  ), [A] = T(() => JSON.stringify([o, b])), [H, ue] = T(""), k = b.find(
    (d) => d.id === H
  ), [N, X] = T(!1), L = D(!0);
  G(() => (L.current = !0, () => {
    L.current = !1;
  }), []);
  const K = () => {
    L.current = !1, _();
  }, [ee, Y] = T(""), [W, P] = T(!1), [te] = T(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), [$, J] = T(""), V = new Set(
    r.map((d) => d.id)
  ), he = new Set(
    o.speech.filter((d) => d.kind === "dialogue").map((d) => d.character_id || "").filter(Boolean)
  ), pe = W || !!(o.end_framing?.trim() && o.end_framing.trim() !== (o.start_framing || "").trim()), Ce = [m?.start, m?.end, ...m?.references || []].find((d) => d?.imageURL)?.imageURL, ne = JSON.stringify([o, b]) !== A, re = (d) => d && I && !N && !ne ? () => I(d.id) : void 0, ae = re(a.shots[l - 1]), Ie = re(a.shots[l + 1]), me = wt(
    a,
    o,
    b
  ), B = (d, p, C) => {
    g((E) => ({
      ...E,
      ...Pe(E, d, p, C)
    }));
  }, fe = (d) => {
    g((p) => p.material_ids.includes(d) ? he.has(d) ? p : {
      ...p,
      material_ids: p.material_ids.filter((C) => C !== d)
    } : {
      ...p,
      material_ids: [...p.material_ids, d]
    });
  }, q = async (d) => {
    if (!S || N)
      return !1;
    J(""), X(!0);
    try {
      const p = {
        ...a,
        materials: b,
        shots: a.shots.map(
          (z) => z.id === o.id ? o : z
        )
      }, C = await S(
        p,
        o.id,
        d.trim()
      ), E = In(
        p,
        o,
        C
      );
      return L.current ? (v(E.materials), g(E.shot), Y(""), !0) : !1;
    } catch (p) {
      return L.current && J(
        p instanceof Error ? p.message : "生成镜头失败，请重试"
      ), !1;
    } finally {
      L.current && X(!1);
    }
  };
  return /* @__PURE__ */ i(we, { children: [
    /* @__PURE__ */ e(On, { open: !0, onOpenChange: (d) => !d && K(), children: /* @__PURE__ */ i(
      Tn,
      {
        className: "ws-storyboard-shot-dialog ws-storyboard-shot-editor nodrag nopan nowheel",
        layerClassName: "wb-detail-backdrop is-dialog-layer",
        layerZIndex: bt,
        showCloseButton: !1,
        "aria-describedby": void 0,
        "aria-busy": N,
        onCloseAutoFocus: (d) => {
          te?.isConnected && (d.preventDefault(), te.focus({ preventScroll: !0 }));
        },
        children: [
          /* @__PURE__ */ i("header", { children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ i(En, { children: [
                s ? "查看镜头" : "编辑镜头",
                " ",
                String(l + 1).padStart(2, "0")
              ] }),
              /* @__PURE__ */ e("span", { children: s ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
            ] }),
            I && a.shots.length > 1 ? /* @__PURE__ */ e(Q, { label: ne ? "先保存或取消当前修改再切换" : "切换镜头", children: /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-nav", children: [
              /* @__PURE__ */ e("button", { type: "button", "aria-label": "上一镜", disabled: !ae, onClick: ae, children: /* @__PURE__ */ e(Yt, { size: 16 }) }),
              /* @__PURE__ */ i("span", { children: [
                l + 1,
                "/",
                a.shots.length
              ] }),
              /* @__PURE__ */ e("button", { type: "button", "aria-label": "下一镜", disabled: !Ie, onClick: Ie, children: /* @__PURE__ */ e(Vt, { size: 16 }) })
            ] }) }) : null,
            /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: K, children: /* @__PURE__ */ e(qt, { size: 18 }) })
          ] }),
          /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-editor-body", children: [
            /* @__PURE__ */ i(
              "fieldset",
              {
                className: "ws-storyboard-shot-form nowheel",
                disabled: N,
                children: [
                  Ce ? /* @__PURE__ */ e(
                    "figure",
                    {
                      className: "ws-storyboard-shot-preview",
                      style: { aspectRatio: a.aspect_ratio?.replace(":", " / ") },
                      children: /* @__PURE__ */ e("img", { src: Ce, alt: `镜头 ${l + 1} 画面`, decoding: "async" })
                    }
                  ) : null,
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ e("strong", { children: "镜头内容" }),
                      /* @__PURE__ */ e("div", { children: /* @__PURE__ */ i("label", { children: [
                        "时长",
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "number",
                            min: mt,
                            step: 1,
                            value: o.duration || "",
                            disabled: s,
                            onChange: (d) => g((p) => ({
                              ...p,
                              duration: xn(d)
                            }))
                          }
                        ),
                        "秒"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      de,
                      {
                        label: "画面描述",
                        value: o.description,
                        content: o.reference_contents?.description,
                        placeholder: "画面里有谁、在哪、是什么环境",
                        readonly: s || N,
                        referenceAdapter: h,
                        onChange: (d, p) => B("description", d, p)
                      }
                    ) }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      ke,
                      {
                        label: "动作与变化",
                        value: o.beat,
                        placeholder: "这一镜发生了什么：动作、结果或关系变化",
                        readonly: s || N,
                        onChange: (d) => g((p) => ({ ...p, beat: d }))
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ e("strong", { children: "镜头与构图" }) }),
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ e(
                        de,
                        {
                          label: "景别与运镜",
                          value: o.camera_instruction,
                          content: o.reference_contents?.camera_instruction,
                          placeholder: "例如：中景，缓慢推近",
                          readonly: s || N,
                          referenceAdapter: h,
                          onChange: (d, p) => B("camera_instruction", d, p)
                        }
                      ),
                      /* @__PURE__ */ e(
                        de,
                        {
                          label: pe ? "起始构图" : "构图",
                          value: o.start_framing || "",
                          content: o.reference_contents?.start_framing,
                          placeholder: "主体在画面中的位置、景深与焦点",
                          readonly: s || N,
                          referenceAdapter: h,
                          onChange: (d, p) => B("start_framing", d, p)
                        }
                      )
                    ] }),
                    pe ? /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      de,
                      {
                        label: "结束构图",
                        value: o.end_framing || "",
                        content: o.reference_contents?.end_framing,
                        placeholder: "动作结束时的景别、主体位置、景深与焦点",
                        readonly: s || N,
                        referenceAdapter: h,
                        onChange: (d, p) => B("end_framing", d, p)
                      }
                    ) }) : s ? null : /* @__PURE__ */ e(
                      "button",
                      {
                        type: "button",
                        className: "ws-storyboard-shot-inline-action",
                        onClick: () => P(!0),
                        children: "结束时构图不同？单独填写"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ i("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ i("div", { children: [
                      /* @__PURE__ */ e("strong", { children: "出场素材" }),
                      /* @__PURE__ */ i("span", { children: [
                        o.material_ids.length,
                        " 个"
                      ] })
                    ] }) }),
                    b.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((d) => {
                      const p = b.filter(
                        (C) => C.type === d
                      );
                      return p.length ? /* @__PURE__ */ i("fieldset", { children: [
                        /* @__PURE__ */ e("legend", { children: ye[d] }),
                        /* @__PURE__ */ e("div", { children: p.map((C) => {
                          const E = o.material_ids.includes(
                            C.id
                          ), z = he.has(
                            C.id
                          );
                          return /* @__PURE__ */ i(
                            "div",
                            {
                              className: "ws-storyboard-material-option",
                              children: [
                                /* @__PURE__ */ e(
                                  Q,
                                  {
                                    label: E && z ? "该角色已用于对白，不能取消关联" : E ? "取消关联" : "关联素材",
                                    children: /* @__PURE__ */ i("label", { children: [
                                      /* @__PURE__ */ e(
                                        "input",
                                        {
                                          type: "checkbox",
                                          checked: E,
                                          disabled: s || E && z,
                                          onChange: () => fe(C.id)
                                        }
                                      ),
                                      /* @__PURE__ */ i("span", { className: "sr-only", children: [
                                        "关联 ",
                                        C.name
                                      ] })
                                    ] })
                                  }
                                ),
                                /* @__PURE__ */ e(
                                  Q,
                                  {
                                    label: `${s ? "查看" : "编辑"}${ye[d]}提示词：${C.name}`,
                                    children: /* @__PURE__ */ i(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: N,
                                        onClick: () => ue(C.id),
                                        children: [
                                          /* @__PURE__ */ e("span", { children: C.name }),
                                          s ? null : /* @__PURE__ */ e(ht, { size: 11 })
                                        ]
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            C.id
                          );
                        }) })
                      ] }, d) : null;
                    }) }) : /* @__PURE__ */ e("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                  ] }),
                  /* @__PURE__ */ e(
                    Rn,
                    {
                      shot: o,
                      materials: b,
                      readonly: s || N,
                      onChange: g
                    }
                  ),
                  /* @__PURE__ */ i("details", { className: "ws-storyboard-shot-advanced", children: [
                    /* @__PURE__ */ i("summary", { children: [
                      /* @__PURE__ */ e("strong", { children: "高级设置" }),
                      /* @__PURE__ */ e("span", { children: "系统生成，一般不用改" })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      de,
                      {
                        label: "空间关系",
                        value: o.spatial_layout,
                        content: o.reference_contents?.spatial_layout,
                        placeholder: "主体、环境和物件的前后左右、接触或承载关系，以及真实相对尺度",
                        readonly: s || N,
                        referenceAdapter: h,
                        onChange: (d, p) => B("spatial_layout", d, p)
                      }
                    ) }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      de,
                      {
                        label: "视频提示词",
                        value: o.video_prompt,
                        content: o.reference_contents?.video_prompt,
                        placeholder: "补充视频制作要求；与动作、构图和运镜保持一致",
                        readonly: s || N,
                        referenceAdapter: h,
                        onChange: (d, p) => B("video_prompt", d, p)
                      }
                    ) }),
                    l > 0 ? /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      ke,
                      {
                        label: "与上镜关系说明",
                        value: o.transition,
                        placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                        readonly: s || N,
                        onChange: (d) => g((p) => ({ ...p, transition: d }))
                      }
                    ) }) : null,
                    l > 0 && o.continue_previous ? /* @__PURE__ */ i("label", { className: "ws-storyboard-continuity-anchor", children: [
                      /* @__PURE__ */ e("span", { children: "连续性锚点" }),
                      /* @__PURE__ */ e(
                        "textarea",
                        {
                          value: o.continuity_anchor,
                          readOnly: s,
                          placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                          onChange: (d) => g((p) => ({
                            ...p,
                            continuity_anchor: d.target.value
                          }))
                        }
                      )
                    ] }) : null,
                    /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ e(
                        ke,
                        {
                          label: "入镜状态",
                          value: o.continuity_state.entry,
                          placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                          readonly: s || N,
                          onChange: (d) => g((p) => ({
                            ...p,
                            continuity_state: {
                              ...p.continuity_state,
                              entry: d
                            }
                          }))
                        }
                      ),
                      /* @__PURE__ */ e(
                        ke,
                        {
                          label: "出镜状态",
                          value: o.continuity_state.exit,
                          placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                          readonly: s || N,
                          onChange: (d) => g((p) => ({
                            ...p,
                            continuity_state: {
                              ...p.continuity_state,
                              exit: d
                            }
                          }))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ i("label", { children: [
                      /* @__PURE__ */ e("span", { children: "镜头图片" }),
                      /* @__PURE__ */ e("span", { children: o.continue_previous ? "生成尾帧 · 首帧沿用上一镜规划尾帧" : "生成首尾帧" })
                    ] }) }),
                    l > 0 ? /* @__PURE__ */ i("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ i("label", { children: [
                        /* @__PURE__ */ e("span", { children: "剪辑转场" }),
                        /* @__PURE__ */ e(
                          "select",
                          {
                            value: o.transition_type,
                            disabled: s,
                            onChange: (d) => g((p) => {
                              const C = d.target.value;
                              return {
                                ...p,
                                transition_type: C,
                                transition_duration_ms: C === "none" ? 0 : Math.max(
                                  500,
                                  p.transition_duration_ms
                                )
                              };
                            }),
                            children: pt.map((d) => /* @__PURE__ */ e("option", { value: d, children: Kt[d] }, d))
                          }
                        )
                      ] }),
                      o.transition_type !== "none" ? /* @__PURE__ */ i("label", { children: [
                        /* @__PURE__ */ e("span", { children: "转场时长" }),
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "number",
                            min: 100,
                            max: 5e3,
                            step: 100,
                            value: o.transition_duration_ms,
                            disabled: s,
                            onChange: (d) => g((p) => ({
                              ...p,
                              transition_duration_ms: Math.min(
                                5e3,
                                Dn(
                                  d,
                                  p.transition_duration_ms,
                                  100
                                )
                              )
                            }))
                          }
                        )
                      ] }) : null
                    ] }) : null
                  ] }),
                  me.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-form-error", role: "alert", children: me.map((d) => /* @__PURE__ */ e("p", { children: d.message }, d.id)) }) : null
                ]
              }
            ),
            !s && S ? /* @__PURE__ */ i("aside", { className: "ws-storyboard-shot-ai", children: [
              /* @__PURE__ */ i("strong", { children: [
                /* @__PURE__ */ e(Ke, { size: 15 }),
                "AI 修改"
              ] }),
              /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ e("span", { children: "修改要求" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: ee,
                    disabled: N,
                    placeholder: "例如：改成手部特写，保留人物和道具，调整动作与前后镜头的衔接",
                    onChange: (d) => {
                      Y(d.target.value), J("");
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  disabled: N || !ee.trim(),
                  onClick: () => {
                    q(ee);
                  },
                  children: [
                    N ? /* @__PURE__ */ e(Fe, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(Ke, { size: 14 }),
                    N ? "正在修改" : "修改当前镜头"
                  ]
                }
              ),
              /* @__PURE__ */ e("p", { children: "生成后直接更新左侧草稿，检查后保存。取消会保留原镜头。" }),
              $ ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "alert", children: $ }) : null
            ] }) : null
          ] }),
          /* @__PURE__ */ i("footer", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: K, children: s ? "关闭" : "取消" }),
            s ? null : /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: N || me.length > 0,
                onClick: () => n(
                  o,
                  b.filter(
                    (d) => V.has(d.id) || o.material_ids.includes(d.id)
                  )
                ),
                children: [
                  /* @__PURE__ */ e(Le, { size: 14 }),
                  "保存镜头"
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    k ? /* @__PURE__ */ e(
      gt,
      {
        material: k,
        readonly: s || N,
        usage: ze(
          {
            ...a,
            shots: a.shots.map(
              (d) => d.id === o.id ? o : d
            )
          },
          k.id
        ),
        existingNames: b.filter((d) => d.id !== k.id).map((d) => d.name),
        onSave: (d) => {
          v(
            (p) => p.map(
              (C) => C.id === d.id ? d : C
            )
          ), ue("");
        },
        onClose: () => ue("")
      }
    ) : null
  ] });
}
function de({
  label: t,
  value: l,
  content: a,
  placeholder: r,
  readonly: s,
  referenceAdapter: h,
  onChange: m
}) {
  return /* @__PURE__ */ i("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      mn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: l,
        content: a,
        adapter: h,
        placeholder: r,
        disabled: s,
        layerZIndex: bt + 40,
        onChange: m
      }
    )
  ] });
}
function ke({
  label: t,
  value: l,
  placeholder: a,
  readonly: r,
  onChange: s
}) {
  return /* @__PURE__ */ i("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: t }),
    /* @__PURE__ */ e(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: l,
        rows: 3,
        placeholder: a,
        readOnly: r,
        onChange: (h) => s(h.target.value)
      }
    )
  ] });
}
function xn(t) {
  const l = Number(t.target.value);
  return Number.isFinite(l) ? l : 0;
}
function Dn(t, l, a) {
  const r = Number(t.target.value);
  return Number.isInteger(r) && r >= a ? r : l;
}
const $n = [], Bn = [], zn = [], An = [];
function Qn({
  storyboard: t,
  editable: l = !1,
  disabled: a = !1,
  onSave: r,
  onChange: s,
  onConfirm: h,
  onCreateRevision: m,
  onGenerateShot: S,
  workflowAction: I = "",
  saveStatus: n,
  showSaveStatus: _ = !0,
  showMetrics: o = !0,
  referenceItems: g = $n,
  storyboardSourceNodeId: b = "",
  canvasNodes: v = Bn,
  canvasEdges: A = [],
  workTypeSpecs: H = zn,
  purposeSpecs: ue = An,
  focus: k,
  workspaceSlots: N
}) {
  const X = Re(
    () => JSON.stringify(t),
    [t]
  ), [L, K] = T(t), [ee, Y] = T("saved"), [W, P] = T(""), [te, $] = T(""), [J, V] = T(null), [he, pe] = T(""), [Ce, ne] = T(""), [re, ae] = T([]), [Ie, me] = T(
    "before"
  ), B = D(null), fe = D(""), q = D([]), d = D(/* @__PURE__ */ new Map()), p = D(/* @__PURE__ */ new Map()), C = D(t), E = D(!1), z = D(0), Ve = D(X), F = D(null), qe = D(Promise.resolve()), ge = D(!0), se = !!s, f = se ? t : L, Ue = H.find(
    (c) => c.key === f.work_type
  )?.name, Oe = en(f), U = At(v, A, b), O = l && !a && !Oe && !I && !!(s || r), je = O && !se && !!r, Ge = ft(g), ie = f.shots.find((c) => c.id === W), Nt = f.shots.findIndex(
    (c) => c.id === W
  ), Te = f.materials.find(
    (c) => c.id === te
  ), oe = Te || J, Ct = oe ? ze(f, oe.id) : void 0, It = Re(
    () => st(f.shots, re, (c) => c.id),
    [f.shots, re]
  ), Ee = Re(
    () => new Map(
      un(f, b, v).map(
        (c) => [c.shot.id, c]
      )
    ),
    [f, b, v]
  ), Rt = (c) => {
    const u = Ee.get(c);
    return [...u?.references || [], u?.start, u?.end].flatMap((y) => y?.node ? [y.node.id] : []);
  }, kt = Re(
    () => f.shots.some(
      (c) => c.speech.some(
        (u) => u.kind === "narration" && !!u.text.trim()
      )
    ),
    [f.shots]
  );
  G(() => (ge.current = !0, () => {
    ge.current = !1, F.current && window.clearTimeout(F.current);
  }), []), G(
    () => () => {
      for (const c of p.current.values())
        c.cancel();
      p.current.clear();
    },
    []
  ), Pt(() => {
    const c = d.current, u = B.current;
    if (!u || c.size === 0)
      return;
    const y = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    u.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((w) => {
      if (w.classList.contains("is-dragging"))
        return;
      const M = w.dataset.sequenceItemId || "", j = c.get(M);
      if (!j || y)
        return;
      const Me = w.getBoundingClientRect(), be = j.left - Me.left, le = j.top - Me.top;
      if (Math.abs(be) < 1 && Math.abs(le) < 1)
        return;
      p.current.get(M)?.cancel();
      const ve = w.animate(
        [
          { transform: `translate3d(${be}px, ${le}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      p.current.set(M, ve), ve.onfinish = () => {
        p.current.get(M) === ve && p.current.delete(M);
      };
    }), c.clear();
  }, [re]), G(() => {
    Ve.current !== X && (Ve.current = X, !E.current && (C.current = t, K(t), Y("saved")));
  }, [X, t]), G(() => {
    W && !ie && P("");
  }, [ie, W]), G(() => {
    te && !Te && $("");
  }, [Te, te]), G(() => {
    if (!k)
      return;
    if (k.materialId && f.materials.some((u) => u.id === k.materialId)) {
      V(null), P(""), $(k.materialId);
      return;
    }
    if (k.shotId && f.shots.some((u) => u.id === k.shotId)) {
      V(null), $(""), P(k.shotId);
      return;
    }
    const c = window.requestAnimationFrame(() => {
      const u = k.materialType ? `[data-storyboard-material-type="${k.materialType}"]` : k.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      B.current?.querySelector(u)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(c);
  }, [k?.materialId, k?.materialType, k?.section, k?.shotId]), G(() => {
    if (!je || !E.current || !r)
      return;
    F.current && window.clearTimeout(F.current);
    const c = f, u = z.current;
    return F.current = window.setTimeout(() => {
      F.current = null, qe.current = qe.current.catch(() => {
      }).then(async () => {
        ge.current && u === z.current && Y("saving");
        try {
          if (await r(c), !ge.current || u !== z.current)
            return;
          E.current = !1, Y("saved");
        } catch {
          if (!ge.current || u !== z.current)
            return;
          Y("error");
        }
      });
    }, 800), () => {
      F.current && (window.clearTimeout(F.current), F.current = null);
    };
  }, [je, f, r]);
  const x = (c) => {
    if (!O)
      return;
    const u = se ? t : C.current, y = c(u), w = Fn(
      sn(on(u, y)),
      Ge.options
    );
    if (C.current = w, se) {
      s?.(w);
      return;
    }
    E.current = !0, z.current += 1, K(w), Y("typing");
  }, He = () => {
    const c = B.current;
    if (!c)
      return;
    const u = /* @__PURE__ */ new Map();
    c.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((y) => {
      const w = y.dataset.sequenceItemId || "";
      w && u.set(w, y.getBoundingClientRect());
    }), d.current = u;
  }, Ot = (c) => {
    const u = f.shots.map((y) => y.id);
    fe.current = c, q.current = u, pe(c), ne(""), ae(u);
  }, Tt = (c, u) => {
    const y = fe.current, w = q.current;
    if (!y || !c || y === c || !w.length || !w.includes(y) || !w.includes(c))
      return;
    const M = u.currentTarget.getBoundingClientRect(), j = u.currentTarget.parentElement?.getBoundingClientRect(), be = !!(j && M.width * 1.5 < j.width) ? u.clientX < M.left + M.width / 2 ? "before" : "after" : u.clientY < M.top + M.height / 2 ? "before" : "after", le = dn(
      w,
      y,
      c,
      be,
      (ve) => ve
    );
    ne(c), me(be), !De(w, le) && (He(), q.current = le, ae(le));
  }, Xe = () => {
    const c = q.current, u = f.shots.map((y) => y.id);
    c.length > 0 && !De(c, u) && He(), fe.current = "", q.current = [], pe(""), ne(""), ae([]);
  }, Et = () => {
    const c = q.current;
    c.length > 0 && x((u) => {
      const y = st(u.shots, c, (w) => w.id);
      return De(
        u.shots.map((w) => w.id),
        y.map((w) => w.id)
      ) ? u : { ...u, shots: y };
    }), Xe();
  }, Mt = (c, u) => {
    x((y) => _t(y, c, u)), P("");
  }, xt = (c) => {
    x((u) => {
      const y = u.materials.some((w) => w.id === c.id);
      return {
        ...u,
        materials: y ? u.materials.map(
          (w) => w.id === c.id ? c : w
        ) : [...u.materials, c]
      };
    }), $(""), V(null);
  }, We = (c) => {
    $(""), V(ln(f.materials, c));
  }, Dt = (c) => {
    const u = ze(f, c);
    u.shotIds.length || u.speechIds.length || (x((y) => ({
      ...y,
      materials: y.materials.filter((w) => w.id !== c)
    })), $(""), V(null));
  }, $t = (c) => {
    x((u) => u.shots.length <= 1 ? u : {
      ...u,
      shots: u.shots.filter((y) => y.id !== c)
    });
  }, Bt = (c) => {
    x((u) => {
      if (u.shots.length >= xe)
        return u;
      const y = Ln(u.shots, c), w = u.shots.findIndex((j) => j.id === c.id), M = [...u.shots];
      return M.splice(w + 1, 0, y), { ...u, shots: M };
    });
  }, zt = () => {
    x((c) => c.shots.length >= xe ? c : {
      ...c,
      shots: [...c.shots, St(c.shots)]
    });
  };
  return f.screenplay && !f.shots.length ? /* @__PURE__ */ i("section", { className: "ws-storyboard is-editable", "aria-label": "章节剧本", children: [
    /* @__PURE__ */ i("header", { className: "ws-storyboard-toolbar", children: [
      /* @__PURE__ */ i("strong", { children: [
        f.title,
        " · 剧本"
      ] }),
      /* @__PURE__ */ e(
        ut,
        {
          status: se ? n || "saved" : ee
        }
      ),
      O && h && /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-storyboard-command is-primary",
          disabled: a || !!I,
          onClick: () => {
            h();
          },
          children: "继续生成分镜"
        }
      )
    ] }),
    /* @__PURE__ */ e(
      it,
      {
        storyboard: f,
        editable: O && !a,
        onChange: (c) => x(() => c)
      }
    )
  ] }) : /* @__PURE__ */ i(
    "section",
    {
      ref: B,
      className: `ws-storyboard ${O ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ i("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ i("div", { className: "ws-storyboard-summary", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ i("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ i("header", { children: [
                /* @__PURE__ */ e(Be, { size: 14 }),
                /* @__PURE__ */ e("strong", { children: "内容简介" }),
                Ue ? /* @__PURE__ */ e("span", { className: "ws-storyboard-work-type", children: Ue }) : null
              ] }),
              /* @__PURE__ */ e("p", { children: tn(f) })
            ] }),
            /* @__PURE__ */ i("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ e(
                gn,
                {
                  storyboard: f,
                  referenceItems: g,
                  editable: O,
                  disabled: a,
                  workType: f.work_type,
                  purposeSpecs: ue,
                  onChange: (c) => x(() => c)
                }
              ),
              /* @__PURE__ */ i("section", { className: "ws-storyboard-basic-settings", children: [
                U && /* @__PURE__ */ e("p", { children: "画风、画幅及人物形象由画布上的“设定”统一管理，各章共用。" }),
                /* @__PURE__ */ i("div", { className: "ws-storyboard-global-settings", children: [
                  /* @__PURE__ */ i("label", { children: [
                    /* @__PURE__ */ e("strong", { children: /* @__PURE__ */ e(Q, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ e("span", { children: "画面类型" }) }) }),
                    O && !U ? /* @__PURE__ */ e(
                      "select",
                      {
                        className: "nodrag nopan",
                        value: f.visual_mode,
                        disabled: a,
                        onChange: (c) => x((u) => ({
                          ...u,
                          visual_mode: c.target.value
                        })),
                        children: nn.map((c) => /* @__PURE__ */ e("option", { value: c, children: rt[c] }, c))
                      }
                    ) : /* @__PURE__ */ e("span", { children: rt[f.visual_mode] })
                  ] }),
                  /* @__PURE__ */ i("label", { children: [
                    /* @__PURE__ */ e("strong", { children: "画幅" }),
                    O && !U ? /* @__PURE__ */ e(
                      "select",
                      {
                        className: "nodrag nopan",
                        value: f.aspect_ratio,
                        disabled: a,
                        onChange: (c) => x((u) => ({
                          ...u,
                          aspect_ratio: c.target.value
                        })),
                        children: rn.map((c) => /* @__PURE__ */ e("option", { value: c, children: c }, c))
                      }
                    ) : /* @__PURE__ */ e("span", { children: f.aspect_ratio })
                  ] }),
                  kt || f.narrator_voice ? /* @__PURE__ */ i("label", { className: "ws-storyboard-setting-wide", children: [
                    /* @__PURE__ */ e("strong", { children: "旁白音色" }),
                    O ? /* @__PURE__ */ e(
                      "input",
                      {
                        className: "nodrag nopan",
                        value: f.narrator_voice,
                        placeholder: "自动配音时必填",
                        disabled: a,
                        onChange: (c) => x((u) => ({
                          ...u,
                          narrator_voice: c.target.value
                        }))
                      }
                    ) : /* @__PURE__ */ e("span", { children: f.narrator_voice || "未配置" })
                  ] }) : null,
                  /* @__PURE__ */ i("div", { className: "ws-storyboard-style", children: [
                    /* @__PURE__ */ e("strong", { children: "统一视觉风格" }),
                    O && !U ? /* @__PURE__ */ e(
                      "input",
                      {
                        className: "nodrag nopan",
                        value: f.style_prompt,
                        placeholder: "可选，整部作品保持一致的画面风格",
                        disabled: a,
                        onChange: (c) => x(
                          (u) => cn(
                            u,
                            c.target.value
                          )
                        )
                      }
                    ) : /* @__PURE__ */ e(Q, { label: f.style_prompt, children: /* @__PURE__ */ e("span", { children: f.style_prompt || "未设置统一视觉风格" }) })
                  ] })
                ] })
              ] }),
              N ? /* @__PURE__ */ i("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
                /* @__PURE__ */ e("header", { children: /* @__PURE__ */ e("strong", { children: "素材设定" }) }),
                N.renderSettingGallery({
                  key: k?.materialType || "",
                  mediaAspect: f.aspect_ratio,
                  defaultType: k?.materialType,
                  materials: U ? void 0 : f.materials,
                  materialActions: O && !U ? {
                    disabled: !!a,
                    onEdit: (c) => $(c.id),
                    onAdd: We
                  } : void 0
                })
              ] }) : f.materials.length || O ? /* @__PURE__ */ e(
                Pn,
                {
                  materials: f.materials,
                  editable: O && !U,
                  onOpen: $,
                  onCreate: We
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ e("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ i("div", { className: "ws-storyboard-toolbar-end", children: [
              o || O && _ ? /* @__PURE__ */ i("div", { className: "ws-storyboard-toolbar-meta", children: [
                o ? /* @__PURE__ */ i("span", { children: [
                  f.shots.length,
                  " 个镜头 ·",
                  " ",
                  an(f),
                  " 秒 · ",
                  f.aspect_ratio
                ] }) : null,
                O && _ ? /* @__PURE__ */ e(
                  ut,
                  {
                    status: se ? n || "saved" : ee
                  }
                ) : null
              ] }) : null,
              O ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: a || f.shots.length >= xe,
                  onClick: zt,
                  children: [
                    /* @__PURE__ */ e(_e, { size: 13 }),
                    /* @__PURE__ */ e("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              Oe && m ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: a || !!I,
                  onClick: () => {
                    m();
                  },
                  children: [
                    I === "revising" ? /* @__PURE__ */ e(Fe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(Ut, { size: 13 }),
                    I === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !Oe && O && h ? /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  onClick: () => {
                    h();
                  },
                  children: [
                    /* @__PURE__ */ e(Le, { size: 13 }),
                    "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            f.screenplay && /* @__PURE__ */ i("details", { children: [
              /* @__PURE__ */ e("summary", { children: "本章剧本" }),
              /* @__PURE__ */ e(it, { storyboard: f, editable: !1 })
            ] }),
            /* @__PURE__ */ e("div", { className: "ws-storyboard-grid nowheel", children: f.shots.length ? It.map((c, u) => /* @__PURE__ */ e(
              fn,
              {
                shot: c,
                index: u,
                storyboard: f,
                frame: Ee.get(c.id),
                media: N?.renderFrameNode(Rt(c.id), f.aspect_ratio),
                selected: W === c.id,
                editable: O,
                dragging: he === c.id,
                dropPlacement: Ce === c.id && he !== c.id ? Ie : void 0,
                onOpen: () => P(c.id),
                onDuplicate: () => Bt(c),
                onRemove: () => $t(c.id),
                onDragStart: () => Ot(c.id),
                onDragOver: (y) => Tt(c.id, y),
                onDrop: Et,
                onDragEnd: Xe
              },
              c.id
            )) : /* @__PURE__ */ i("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ e(Be, { size: 26 }),
              /* @__PURE__ */ e("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ e("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        ie ? /* @__PURE__ */ e(
          Mn,
          {
            shot: ie,
            index: Nt,
            storyboard: f,
            materials: f.materials,
            readonly: !O,
            referenceAdapter: Ge,
            frame: Ee.get(ie.id),
            onNavigate: P,
            onGenerate: S,
            onSave: Mt,
            onClose: () => P("")
          },
          ie.id
        ) : null,
        oe ? /* @__PURE__ */ e(
          gt,
          {
            material: oe,
            creating: !!J,
            readonly: !O || !!U,
            usage: Ct,
            existingNames: f.materials.filter((c) => c.id !== oe.id).map((c) => c.name),
            onSave: xt,
            onRemove: Dt,
            onClose: () => {
              $(""), V(null);
            }
          },
          `${J ? "create" : "edit"}:${oe.id}`
        ) : null
      ]
    }
  );
}
function Pn({
  materials: t,
  editable: l,
  onOpen: a,
  onCreate: r
}) {
  return /* @__PURE__ */ i("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ e("strong", { children: "素材设定" }),
      l ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((s) => /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => r(s),
          children: [
            /* @__PURE__ */ e(_e, { size: 11 }),
            ye[s]
          ]
        },
        s
      )) }) : null
    ] }),
    /* @__PURE__ */ i("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((s) => {
        const h = t.filter(
          (m) => m.type === s
        );
        return h.length ? /* @__PURE__ */ i(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": s,
            children: [
              /* @__PURE__ */ e("span", { children: ye[s] }),
              h.map((m) => /* @__PURE__ */ e(
                Q,
                {
                  label: `${l ? "编辑" : "查看"}${ye[s]}提示词：${m.name}`,
                  children: /* @__PURE__ */ i(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => a(m.id),
                      children: [
                        /* @__PURE__ */ e("span", { children: m.name }),
                        l ? /* @__PURE__ */ e(ht, { size: 11 }) : null
                      ]
                    }
                  )
                },
                m.id
              ))
            ]
          },
          s
        ) : null;
      }),
      t.length ? null : /* @__PURE__ */ e("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Fn(t, l) {
  return {
    ...t,
    shots: t.shots.map((a) => {
      const r = { ...a.reference_contents || {} };
      for (const s of yt) {
        const h = hn(
          a[s] || "",
          r[s],
          l
        );
        h ? r[s] = h : delete r[s];
      }
      return { ...a, reference_contents: r };
    })
  };
}
function ut({ status: t }) {
  return /* @__PURE__ */ i("span", { className: `ws-storyboard-save-state is-${t}`, children: [
    t === "saving" ? /* @__PURE__ */ e(Fe, { size: 12, className: "ws-spin" }) : t === "saved" ? /* @__PURE__ */ e(Le, { size: 12 }) : null,
    t === "typing" ? "编辑中" : t === "saving" ? "保存中" : t === "error" ? "保存失败" : "已保存"
  ] });
}
function St(t) {
  const l = new Set(t.map((s) => s.id));
  let a = t.length, r = at(a);
  for (; l.has(r.id); )
    a += 1, r = at(a);
  return r;
}
function Ln(t, l) {
  const a = St(t);
  return {
    ...Ye(l),
    id: a.id,
    order: a.order,
    speech: l.speech.map((r, s) => ({
      ...r,
      id: `${a.id}-speech-${s + 1}`
    })),
    captions: l.captions.map((r, s) => ({
      ...r,
      id: `${a.id}-caption-${s + 1}`
    }))
  };
}
export {
  Qn as StoryboardView
};
