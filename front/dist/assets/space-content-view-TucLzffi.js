import { j as h } from "./createLucideIcon-fWv1XcFy.js";
import { l as J, S as Q } from "./runtime-entry-ClkZDmNs.js";
import { z as y, C as X, E as p, F as Z, G as v, p as tt, H as T, M as et, I as rt, d as nt, J as ot, K as it, L as k, S as st } from "./storyboard-grid-view-BldHSQpc.js";
const at = [
  "visual_style",
  "motion_style",
  "character",
  "scene",
  "prop",
  "shot"
], ct = {
  visual_style: "视觉风格",
  motion_style: "动态风格",
  character: "角色参考",
  scene: "场景参考",
  prop: "道具参考",
  shot: "镜头参考"
};
function w(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!y(o))
      continue;
    const s = O(o.asset_id ?? o.assetId), i = $(o.kind), a = pt(o.purpose);
    if (!s || !i || !a || !dt(i, a) || r.has(s))
      continue;
    let c = String(o.key || "").trim() || C(s);
    if (n.has(c) && (c = C(s)), n.has(c))
      continue;
    const u = O(o.version_id ?? o.versionId), f = String(o.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: c,
      asset_id: s,
      ...u ? { version_id: u } : {},
      label: f,
      kind: i,
      purpose: a,
      instruction: String(o.instruction || "").trim()
    }), n.add(c), r.add(s);
  }
  return e;
}
function qt(t, e, n, r) {
  const o = new Map(
    w(e).map((c) => [
      c.asset_id,
      c
    ])
  ), s = new Map(
    n.flatMap((c) => {
      const u = O(c.refId);
      return u ? [[u, c]] : [];
    })
  ), i = [], a = /* @__PURE__ */ new Set();
  for (const c of t?.parts || []) {
    if (c.type !== "reference" || c.ref_type !== "asset")
      continue;
    const u = O(c.ref_id);
    if (!u || a.has(u))
      continue;
    const f = o.get(u), _ = s.get(u), l = $(_?.kind) || f?.kind;
    if (!l)
      continue;
    const m = O(_?.versionID || c.ref_version_id), d = String(_?.title || c.label || f?.label || "").trim() || `参考素材 ${i.length + 1}`;
    i.push({
      key: f?.key || C(u),
      asset_id: u,
      ...m ? { version_id: m } : {},
      label: d,
      kind: l,
      purpose: f?.purpose || ft(r, d, l),
      instruction: f?.instruction || ""
    }), a.add(u);
  }
  return i;
}
function ut(t) {
  return (t === "video" ? ["motion_style", "visual_style", "shot"] : ["visual_style", "character", "scene", "prop", "shot"]).map((n) => ({
    value: n,
    label: ct[n]
  }));
}
function dt(t, e) {
  return ut(t).some(
    (n) => n.value === e
  );
}
function C(t) {
  return `ref-${t}`;
}
function pt(t) {
  const e = String(t || "");
  return at.includes(e) ? e : void 0;
}
function ft(t, e, n) {
  const r = lt(t, e);
  return /角色|人物|主角|外貌|长相|形象/.test(r) && n === "image" ? "character" : /场景|环境|地点|空间/.test(r) && n === "image" ? "scene" : /道具|产品|商品|物品/.test(r) && n === "image" ? "prop" : /镜头|构图|画面/.test(r) ? "shot" : /运镜|节奏|动作|转场|剪辑/.test(r) && n === "video" ? "motion_style" : /风格|画风|色调|光线|质感|视觉/.test(r) ? "visual_style" : n === "video" ? "motion_style" : "visual_style";
}
function lt(t, e) {
  const n = `@${String(e || "").replace(/^@+/, "")}`, r = t.indexOf(n);
  return r < 0 ? t : t.slice(Math.max(0, r - 24), r + n.length + 32);
}
function $(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" ? e : void 0;
}
function O(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
const D = 9, B = 4, mt = 50, _t = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Ht = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, yt = ["photoreal", "stylized"], Wt = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, St = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], ht = "16:9", Jt = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, bt = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], g = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off",
  shot_visual_strategy: "auto"
};
function E(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const gt = [
  "storyboard",
  "json",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "text",
  "finalOutput",
  "final_output",
  "rich"
];
function At(t) {
  return A(t, /* @__PURE__ */ new Set(), 0);
}
function Qt(t, e) {
  if (!y(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(G);
  if (n.some((i) => !i))
    return null;
  const r = n, o = new Set(
    r.map((i) => i.id)
  );
  if (o.size !== r.length)
    return null;
  const s = K(t.shot, e, o);
  return s ? { shot: s, materials: r } : null;
}
function Xt(t) {
  return L(t.shots);
}
function L(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function Ot(t) {
  return Number.isInteger(t) && t >= B;
}
function Zt(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function vt(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: B,
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function te(t, e) {
  const n = new Set(t.map((s) => s.id));
  let r = t.filter((s) => s.type === e).length + 1, o = `${e}-${r}`;
  for (; n.has(o); )
    r += 1, o = `${e}-${r}`;
  return {
    id: o,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function ee(t, e) {
  const n = [], r = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && n.push(o.id);
    for (const s of o.speech)
      s.character_id === e && r.push(s.id);
  }
  return { shotIds: n, speechIds: r };
}
function re(t, e = "dialogue") {
  const n = new Set(t.speech.map((s) => s.id));
  let r = t.speech.length + 1, o = `${t.id}-speech-${r}`;
  for (; n.has(o); )
    r += 1, o = `${t.id}-speech-${r}`;
  return {
    id: o,
    kind: e,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...e === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function ne(t) {
  const e = new Set(t.captions.map((o) => o.id));
  let n = t.captions.length + 1, r = `${t.id}-caption-${n}`;
  for (; e.has(r); )
    n += 1, r = `${t.id}-caption-${n}`;
  return {
    id: r,
    type: "caption",
    text: "",
    start_time: 0,
    end_time: Math.min(t.duration, 2)
  };
}
function Rt(t) {
  const e = q(t.workflow), n = w(t.references), r = new Set(n.map((i) => i.key)), o = new Set(
    t.materials.map((i) => i.id)
  ), s = t.shots.map((i, a) => {
    const c = a > 0 ? j(i.transition_type) : "none", u = Math.round(
      Number(i.transition_duration_ms)
    );
    return {
      ...i,
      id: i.id || `shot-${a + 1}`,
      order: a + 1,
      transition: a > 0 ? i.transition.trim() : "",
      transition_type: c,
      transition_duration_ms: c !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(u) ? u : 100
        )
      ) : 0,
      material_ids: R(i.material_ids).filter(
        (f) => o.has(f)
      ),
      reference_keys: R(i.reference_keys).filter(
        (f) => r.has(f)
      ),
      match_previous: a > 0 && !i.continue_previous && !!i.match_previous,
      continue_previous: a > 0 && !!i.continue_previous,
      continuity_anchor: a > 0 && i.continue_previous ? i.continuity_anchor.trim() : "",
      continuity_state: N(
        i.continuity_state
      )
    };
  });
  return s.forEach((i, a) => {
    E(i, a) && (i.continuity_state.entry = s[a - 1].continuity_state.exit);
  }), {
    ...t,
    version: D,
    workflow: e,
    production_plan: z(
      t.production_plan
    ),
    target_duration: L(s),
    target_shot_count: s.length,
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: Y(t.aspect_ratio),
    references: n,
    materials: t.materials.map((i) => ({
      ...i,
      voice: i.type === "character" ? i.voice.trim() : "",
      reference_keys: R(i.reference_keys).filter(
        (a) => r.has(a)
      )
    })),
    shots: s
  };
}
function N(t) {
  const e = y(t) ? t : {};
  return {
    entry: p(e.entry).trim(),
    exit: p(e.exit).trim()
  };
}
function oe(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, o) => {
    o > 0 && n.set(r.id, t.shots[o - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, o) => {
      const s = o > 0 ? e.shots[o - 1].id : "", i = o === 0 || n.get(r.id) !== s;
      return {
        ...r,
        transition: i ? "" : r.transition,
        transition_type: i ? "none" : r.transition_type,
        transition_duration_ms: i ? 0 : r.transition_duration_ms,
        match_previous: !i && !r.continue_previous ? r.match_previous : !1,
        continue_previous: !i && !!r.continue_previous,
        continuity_anchor: !i && r.continue_previous ? r.continuity_anchor : ""
      };
    })
  };
}
function ie(t) {
  return t.workflow.status === "confirmed";
}
function z(t) {
  if (!y(t))
    return { ...g };
  const e = p(t.output_target).toLowerCase();
  return {
    output_target: bt.includes(
      e
    ) ? e : g.output_target,
    voice_mode: I(
      t.voice_mode,
      g.voice_mode
    ),
    subtitle_mode: I(
      t.subtitle_mode,
      g.subtitle_mode
    ),
    lip_sync_mode: I(
      t.lip_sync_mode,
      g.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
}
function se(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function V(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ae(t) {
  return t.production_plan.output_target === "final_video";
}
function Tt(t) {
  return V(t) && t.production_plan.voice_mode === "auto" && It(t) > 0;
}
function ce(t) {
  return V(t) && t.production_plan.subtitle_mode === "auto" && kt(t) > 0;
}
function ue(t) {
  return Tt(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(Pt);
}
function It(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(W).length,
    0
  );
}
function kt(t) {
  return t.shots.reduce(
    (e, n) => e + Ct(n).length,
    0
  );
}
function Ct(t) {
  const e = t.speech.filter(
    (r) => r.subtitle_enabled && !!r.text.trim()
  ).map((r) => ({
    id: `subtitle-${r.id}`,
    text: r.subtitle_text.trim() || r.text.trim(),
    start_time: r.start_time,
    speech_id: r.id,
    source: "speech"
  })), n = t.captions.filter((r) => !!r.text.trim()).map((r) => ({
    id: r.id,
    text: r.text.trim(),
    start_time: r.start_time,
    end_time: r.end_time,
    source: "caption"
  }));
  return [...e, ...n].sort(
    (r, o) => r.start_time - o.start_time
  );
}
function Dt(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function U(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function Pt(t) {
  return t.speech.some(U);
}
function de(t) {
  return new Set(
    t.speech.filter(U).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function pe(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function fe(t) {
  return t.summary.trim() || F("", t.shots);
}
function le(t, e) {
  const n = t.style_prompt.trim(), r = { ...t, style_prompt: e };
  return !n || n === e.trim() ? r : {
    ...r,
    materials: t.materials.map((o) => ({
      ...o,
      prompt: M(
        o.prompt,
        n
      )
    })),
    shots: t.shots.map((o) => ({
      ...o,
      video_prompt: M(
        o.video_prompt,
        n
      )
    }))
  };
}
function me(t, e) {
  const n = t.visual_mode === "photoreal" ? "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然" : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let r = x(e.trim(), n);
  const o = t.style_prompt.trim();
  if (!o)
    return r;
  const s = `统一视觉风格：${o}`;
  return r = x(r, s), r;
}
function M(t, e) {
  const n = `统一视觉风格：${e}`, r = t.trimEnd().replace(/[。！？!?；;，,\s]+$/g, "");
  return r.endsWith(n) ? r.slice(0, -n.length).replace(/[。！？!?；;，,：:\s]+$/g, "").trimEnd() : t;
}
function x(t, e) {
  if (!e || t.includes(e))
    return t;
  if (!t)
    return e;
  const n = /[。！？!?；;，,：:]$/.test(t) ? "" : "。";
  return `${t}${n}${e}`;
}
function Y(t) {
  const e = p(t);
  return St.includes(e) ? e : ht;
}
function j(t) {
  const e = p(t);
  return _t.includes(e) ? e : "none";
}
function _e(t) {
  const e = t.speech.filter(W).map((r) => `${Dt(r)}：${r.text.trim()}`).join("；");
  return [
    t.description,
    t.continuity_state.entry ? `入镜状态：${t.continuity_state.entry}` : "",
    t.continuity_state.exit ? `出镜状态：${t.continuity_state.exit}` : "",
    t.camera_instruction ? `镜头语言：${t.camera_instruction}` : "",
    t.continue_previous && t.continuity_anchor ? `连续性锚点：${t.continuity_anchor}` : "",
    e,
    t.duration > 0 ? `时长：${t.duration} 秒` : ""
  ].filter(Boolean).join("。") || `镜头 ${t.order} 视频生成提示词`;
}
function A(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const i of X(t)) {
      const a = A(i, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const i of t) {
      const a = A(i, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  const r = t, o = wt(r);
  if (o)
    return o;
  const s = Et(r);
  if (s) {
    const i = A(s, e, n + 1);
    if (i)
      return i;
  }
  for (const i of gt) {
    const a = r[i];
    if (a == null || a === t)
      continue;
    const c = A(a, e, n + 1);
    if (c)
      return c;
  }
  return null;
}
function wt(t) {
  const e = p(t.visual_mode).toLowerCase();
  if (p(t.type).toLowerCase() !== "storyboard" || b(t.version) !== D || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Mt(e) || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const n = Bt(t.storyline);
  if (!n)
    return null;
  const r = w(t.references);
  if (r.length !== t.references.length)
    return null;
  const o = t.materials.map(G);
  if (o.some((d) => !d))
    return null;
  const s = o, i = /* @__PURE__ */ new Set();
  for (const d of s) {
    if (i.has(d.id))
      return null;
    i.add(d.id);
  }
  const a = /* @__PURE__ */ new Set(), c = t.shots.map(
    (d, S) => K(d, S, i)
  );
  if (c.some((d) => !d))
    return null;
  const u = c;
  for (const [d, S] of u.entries()) {
    if (a.has(S.id) || E(S, d) && S.continuity_state.entry !== u[d - 1].continuity_state.exit)
      return null;
    a.add(S.id);
  }
  const f = b(t.target_duration), _ = b(t.target_shot_count);
  if (f == null || !Number.isInteger(f) || f < B || _ == null || !Number.isInteger(_) || _ < 1 || _ > mt)
    return null;
  const l = q(t.workflow), m = {
    ...t,
    type: "storyboard",
    version: D,
    workflow: l,
    production_plan: z(t.production_plan),
    title: t.title,
    summary: F(
      p(t.summary),
      u
    ),
    target_duration: f,
    target_shot_count: _,
    narrator_voice: t.narrator_voice.trim(),
    storyline: n,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: Y(t.aspect_ratio),
    references: r,
    materials: s,
    shots: u
  };
  return Rt(m);
}
function Bt(t) {
  if (!y(t))
    return null;
  const e = p(t.setup), n = p(t.development), r = p(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function F(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((o) => o.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Mt(t) {
  return yt.includes(t);
}
function G(t) {
  if (!y(t))
    return null;
  const e = p(t.type).toLowerCase();
  return !Lt(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: R(t.reference_keys.map(p))
  };
}
function K(t, e, n) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !y(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const r = b(t.duration);
  if (r == null || !Ot(r))
    return null;
  const o = t.material_ids.map(p);
  if (o.some((d) => !d || !n.has(d)) || new Set(o).size !== o.length)
    return null;
  const s = t.speech.map(xt);
  if (s.some((d) => !d))
    return null;
  const i = t.captions.map($t);
  if (i.some(
    (d) => !d || d.end_time > r
  ))
    return null;
  const a = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const c = e > 0 && !a && t.match_previous, u = t.transition.trim();
  if (e > 0 && !u)
    return null;
  const f = t.continuity_anchor.trim();
  if (a && !f)
    return null;
  const _ = N(
    t.continuity_state
  );
  if (!_.entry || !_.exit)
    return null;
  const l = j(
    t.transition_type
  ), m = b(t.transition_duration_ms);
  return l !== t.transition_type || m == null || !Number.isInteger(m) || m < 0 || m > 5e3 || e === 0 && (l !== "none" || m !== 0) || e > 0 && l === "none" && m !== 0 || e > 0 && l !== "none" && m < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: r,
    beat: t.beat.trim(),
    transition: e > 0 ? u : "",
    transition_type: e > 0 ? l : "none",
    transition_duration_ms: e > 0 && l !== "none" ? m : 0,
    description: t.description,
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: R(t.reference_keys.map(p)),
    match_previous: c,
    continue_previous: a,
    continuity_anchor: a ? f : "",
    continuity_state: _,
    speech: s,
    captions: i
  };
}
function xt(t) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = p(t.kind).toLowerCase(), n = b(t.start_time);
  if (e !== "dialogue" && e !== "narration" || n == null || n < 0)
    return null;
  if (e === "narration") {
    const o = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: n,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete o.character_id, delete o.speaker_mode, o;
  }
  const r = p(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || r !== "visible" && r !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: e,
    text: t.text,
    start_time: n,
    character_id: t.character_id.trim(),
    speaker_mode: r,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function $t(t) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = p(t.type).toLowerCase(), n = b(t.start_time), r = b(t.end_time);
  return !Nt(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function q(t) {
  const e = y(t) ? t : {}, n = p(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? p(e.confirmed_at) : ""
  };
}
function I(t, e) {
  const n = p(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Et(t) {
  const e = Z(t);
  if (e)
    return e;
  if (!y(t))
    return "";
  const n = t.type === "doc" ? t : y(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? H(n).trim() : "";
}
function H(t) {
  if (!y(t))
    return "";
  if (t.type === "text")
    return p(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(H).join(e);
}
function Lt(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Nt(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function W(t) {
  return t.text.trim().length > 0;
}
function R(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function b(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const zt = J(
  () => import("./space-storyboard-view-Cu6ZkcmQ.js").then((t) => t.c).then((t) => ({
    default: t.StoryboardView
  }))
);
function Vt({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: o,
  markdownClassName: s,
  richClassName: i,
  mediaLayout: a = "default",
  mediaGridKind: c,
  storyboardEditable: u = !1,
  storyboardDisabled: f = !1,
  onStoryboardSave: _
}) {
  const l = v(t, e), m = At(l), d = tt(l);
  if (d)
    return /* @__PURE__ */ h(T, { className: o, children: /* @__PURE__ */ h(st, { grid: d }) });
  if (m)
    return /* @__PURE__ */ h(T, { className: o, children: /* @__PURE__ */ h(
      Q,
      {
        fallback: /* @__PURE__ */ h("div", { className: "min-h-24", "aria-busy": "true" }),
        children: /* @__PURE__ */ h(
          zt,
          {
            storyboard: m,
            editable: u,
            disabled: f,
            onSave: _
          }
        )
      }
    ) });
  const S = Yt(l, c);
  return S ? /* @__PURE__ */ h(
    T,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ h(
        et,
        {
          kind: S.kind,
          urls: S.urls,
          label: e
        }
      )
    }
  ) : /* @__PURE__ */ h(
    rt,
    {
      output: l,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: o,
      markdownClassName: s,
      richClassName: i,
      mediaLayout: a
    }
  );
}
function Ut(t, e) {
  if (jt(t, e))
    return !1;
  const n = ot(t), r = it(t);
  return r.length > 1 || n > 1 ? !0 : r.some((o) => !o || typeof o != "object" || Array.isArray(o) ? k(o) : [
    o.title,
    o.text,
    o.reasoning,
    o.rich,
    o.progress,
    o.error,
    o.json
  ].some(k));
}
function Yt(t, e) {
  if (!e)
    return null;
  const n = nt(t, e);
  return n.length > 1 ? { kind: e, urls: n } : null;
}
function jt(t, e) {
  const n = P(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function P(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? P(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const o = Object.entries(t).filter(
    ([s, i]) => !["type", "kind", "format", "version"].includes(s) && k(i)
  ).map(([, s]) => s);
  return o.length === 1 ? P(o[0], e, n + 1) : "";
}
const ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CanvasNodeContentView: Vt,
  contentOutputNeedsRenderer: Ut
}, Symbol.toStringTag, { value: "Module" }));
export {
  yt as A,
  Wt as B,
  Vt as C,
  St as D,
  Rt as E,
  oe as F,
  te as G,
  B as H,
  Ht as I,
  re as J,
  ne as K,
  vt as L,
  mt as M,
  le as N,
  w as O,
  Qt as P,
  U as Q,
  me as R,
  Jt as S,
  _e as T,
  Ut as U,
  qt as V,
  ye as W,
  Dt as a,
  Ct as b,
  Pt as c,
  L as d,
  Ot as e,
  E as f,
  _t as g,
  ue as h,
  ie as i,
  ce as j,
  Tt as k,
  V as l,
  se as m,
  de as n,
  It as o,
  kt as p,
  Xt as q,
  z as r,
  Zt as s,
  ae as t,
  ut as u,
  ct as v,
  At as w,
  pe as x,
  ee as y,
  fe as z
};
