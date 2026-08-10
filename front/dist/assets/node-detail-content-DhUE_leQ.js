import { a as k } from "./_commonjsHelpers-CTFd9u1x.js";
import { p as Bt, S as Ut } from "./react-C7Xtl8sB.js";
import { O as l, ae as jt, V as f, R as rt, af as zt, p as V, ag as I, ah as Et, ai as Vt, c as Yt, aj as Gt, ak as Y, G as P, S as Ft, al as Wt, am as Kt, X as qt, Z as S, a2 as Ht, _ as w, N as Jt, U as A, an as et, Y as nt } from "./storyboard-grid-view-CJXm84yJ.js";
function G(t) {
  if (!Array.isArray(t))
    return [];
  const r = [], e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!l(o))
      continue;
    const s = x(o.asset_id ?? o.assetId), i = st(o.kind), a = N(o.purpose);
    if (!s || !i || !a || n.has(s))
      continue;
    let c = String(o.key || "").trim() || L(s);
    if (e.has(c) && (c = L(s)), e.has(c))
      continue;
    const y = x(o.version_id ?? o.versionId), u = String(o.label || "").trim() || `参考素材 ${r.length + 1}`;
    r.push({
      key: c,
      asset_id: s,
      ...y ? { version_id: y } : {},
      label: u,
      kind: i,
      purpose: a
    }), e.add(c), n.add(s);
  }
  return r;
}
function Wr(t, r, e, n, o, s) {
  const i = new Map(
    G(r).map((p) => [
      p.asset_id,
      p
    ])
  ), a = new Map(
    e.flatMap((p) => {
      const d = x(p.refId);
      return d ? [[d, p]] : [];
    })
  ), c = [], y = (t?.parts || []).map((p) => ({ ...p })), u = /* @__PURE__ */ new Set();
  for (const [p, d] of (t?.parts || []).entries()) {
    if (d.type !== "reference" || d.ref_type !== "asset")
      continue;
    const m = x(d.ref_id);
    if (!m || u.has(m))
      continue;
    const _ = i.get(m), b = a.get(m), h = st(b?.kind) || _?.kind;
    if (!h)
      continue;
    const g = x(b?.versionID || d.ref_version_id), q = String(b?.title || d.label || _?.label || "").trim() || `参考素材 ${c.length + 1}`, Dt = ot(
      h,
      o,
      s
    ), $t = N(d.purpose), Pt = N(
      _?.purpose
    ), H = [$t, Pt].find(
      (Lt) => Dt.some((Nt) => Nt.value === Lt)
    ) || Zt(
      n,
      q,
      h,
      o,
      s
    ), J = y[p];
    J?.type === "reference" && (J.purpose = H || void 0), c.push({
      key: _?.key || L(m),
      asset_id: m,
      ...g ? { version_id: g } : {},
      label: q,
      kind: h,
      purpose: H
    }), u.add(m);
  }
  return {
    content: t ? { ...t, parts: y } : void 0,
    references: c
  };
}
function Kr(t, r) {
  return r.filter(
    (e) => e.work_types.length === 0 || e.work_types.includes(t)
  ).map((e) => ({
    key: e.key,
    label: e.name,
    acceptedKinds: [...e.media_kinds]
  }));
}
function ot(t, r, e) {
  return e.filter(
    (n) => n.media_kinds.includes(t) && (n.work_types.length === 0 || n.work_types.includes(r))
  ).map((n) => ({ value: n.key, label: n.name }));
}
function it(t, r) {
  return r.find((e) => e.key === t);
}
function Xt(t, r) {
  return it(t, r)?.name || t;
}
function qr(t, r, e, n) {
  const o = e.find((i) => i.key === r);
  if (!o || n.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const s = /* @__PURE__ */ new Map();
  for (const i of t) {
    const a = it(
      i.purpose,
      n
    );
    if (!a)
      return `参考素材“${i.label}”的用途无效`;
    if (!a.media_kinds.includes(i.kind))
      return `参考素材“${i.label}”的类型不支持用途“${a.name}”`;
    if (a.work_types.length > 0 && !a.work_types.includes(r))
      return `当前作品类型不支持“${i.label}”的用途“${a.name}”`;
    const c = (s.get(i.purpose) || 0) + 1;
    if (s.set(i.purpose, c), a.max_count > 0 && c > a.max_count)
      return `用途“${a.name}”最多只能选择 ${a.max_count} 个素材`;
  }
  for (const i of o.required_reference_purposes)
    if (!s.get(i))
      return `${o.name}必须添加“${Xt(
        i,
        n
      )}”`;
  return "";
}
function L(t) {
  return `ref-${t}`;
}
function N(t) {
  const r = String(t || "").trim();
  return r || void 0;
}
function Zt(t, r, e, n, o) {
  const s = Qt(t, r), i = [];
  /角色|人物|主角|外貌|长相|形象/.test(s) && e === "image" && i.push("character"), /场景|环境|地点|空间/.test(s) && e === "image" && i.push("scene"), /产品|商品/.test(s) && e === "image" && n === "ad" && i.push("product"), /道具|产品|商品|物品/.test(s) && e === "image" && i.push("prop"), /镜头|构图|画面/.test(s) && e !== "audio" && i.push("shot"), /运镜|节奏|动作|转场|剪辑/.test(s) && e === "video" && i.push("motion_style"), /风格|画风|色调|光线|质感|视觉/.test(s) && e !== "audio" && i.push("visual_style");
  const a = ot(e, n, o), c = i.find(
    (u) => a.some((p) => p.value === u)
  );
  return c || o.find(
    (u) => u.default_media_kinds.includes(e) && (u.work_types.length === 0 || u.work_types.includes(n))
  )?.key || a[0]?.value || "";
}
function Qt(t, r) {
  const e = `@${String(r || "").replace(/^@+/, "")}`, n = t.indexOf(e);
  return n < 0 ? t : t.slice(Math.max(0, n - 24), n + e.length + 32);
}
function st(t) {
  const r = String(t || "").trim().toLowerCase();
  return r === "image" || r === "video" || r === "audio" ? r : void 0;
}
function x(t) {
  const r = Number(t || 0);
  return Number.isInteger(r) && r > 0 ? r : 0;
}
function vt(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const B = 9, F = 4, tr = 50, X = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), rr = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Hr = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, er = ["photoreal", "stylized"], Jr = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, nr = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], or = "16:9", Xr = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, ir = {
  character: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然",
  scene: "画面类型：写实影像，空间透视、尺度关系、光线和环境材质保持真实自然",
  prop: "画面类型：写实影像，道具比例、结构、光线和材质保持真实自然",
  shot: "画面类型：写实影像，人物五官、身体比例、光线和材质保持真实自然"
}, sr = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], R = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off",
  shot_visual_strategy: "auto"
};
function at(t, r) {
  return r > 0 && (t.match_previous || t.continue_previous);
}
const ar = [
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
function ct(t) {
  return T(t, /* @__PURE__ */ new Set(), 0);
}
function Zr(t, r) {
  if (!l(t) || !Array.isArray(t.materials))
    return null;
  const e = t.materials.map(St);
  if (e.some((i) => !i))
    return null;
  const n = e, o = new Set(
    n.map((i) => i.id)
  );
  if (o.size !== n.length)
    return null;
  const s = bt(t.shot, r, o);
  return s ? { shot: s, materials: n } : null;
}
function Qr(t) {
  return ut(t.shots);
}
function ut(t) {
  return t.reduce(
    (r, e) => r + Math.max(0, Number(e.duration) || 0),
    0
  );
}
function cr(t) {
  return Number.isInteger(t) && t >= F;
}
function vr(t, r) {
  const e = new Map(
    t.materials.map((n) => [n.id, n])
  );
  return r.material_ids.map((n) => e.get(n)).filter((n) => !!n);
}
function te(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: F,
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
function re(t, r) {
  const e = new Set(t.map((s) => s.id));
  let n = t.filter((s) => s.type === r).length + 1, o = `${r}-${n}`;
  for (; e.has(o); )
    n += 1, o = `${r}-${n}`;
  return {
    id: o,
    type: r,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function ee(t, r) {
  const e = [], n = [];
  for (const o of t.shots) {
    o.material_ids.includes(r) && e.push(o.id);
    for (const s of o.speech)
      s.character_id === r && n.push(s.id);
  }
  return { shotIds: e, speechIds: n };
}
function ne(t, r = "dialogue") {
  const e = new Set(t.speech.map((s) => s.id));
  let n = t.speech.length + 1, o = `${t.id}-speech-${n}`;
  for (; e.has(o); )
    n += 1, o = `${t.id}-speech-${n}`;
  return {
    id: o,
    kind: r,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...r === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function oe(t) {
  const r = new Set(t.captions.map((o) => o.id));
  let e = t.captions.length + 1, n = `${t.id}-caption-${e}`;
  for (; r.has(n); )
    e += 1, n = `${t.id}-caption-${e}`;
  return {
    id: n,
    type: "caption",
    text: "",
    start_time: 0,
    end_time: Math.min(t.duration, 2)
  };
}
function ur(t) {
  const r = gt(t.workflow), e = G(t.references), n = new Set(e.map((i) => i.key)), o = new Set(
    t.materials.map((i) => i.id)
  ), s = t.shots.map((i, a) => {
    const c = a > 0 ? _t(i.transition_type) : "none", y = Math.round(
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
          Number.isFinite(y) ? y : 100
        )
      ) : 0,
      material_ids: M(i.material_ids).filter(
        (u) => o.has(u)
      ),
      reference_keys: M(i.reference_keys).filter(
        (u) => n.has(u)
      ),
      match_previous: a > 0 && !i.continue_previous && !!i.match_previous,
      continue_previous: a > 0 && !!i.continue_previous,
      continuity_anchor: a > 0 && i.continue_previous ? i.continuity_anchor.trim() : "",
      continuity_state: dt(
        i.continuity_state
      )
    };
  });
  return s.forEach((i, a) => {
    at(i, a) && (i.continuity_state.entry = s[a - 1].continuity_state.exit);
  }), {
    ...t,
    version: B,
    workflow: r,
    production_plan: ft(
      t.production_plan
    ),
    target_duration: ut(s),
    target_shot_count: s.length,
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: yt(t.aspect_ratio),
    references: e,
    materials: t.materials.map((i) => ({
      ...i,
      voice: i.type === "character" ? i.voice.trim() : "",
      reference_keys: M(i.reference_keys).filter(
        (a) => n.has(a)
      )
    })),
    shots: s
  };
}
function dt(t) {
  const r = l(t) ? t : {};
  return {
    entry: f(r.entry).trim(),
    exit: f(r.exit).trim()
  };
}
function ie(t, r) {
  const e = /* @__PURE__ */ new Map();
  return t.shots.forEach((n, o) => {
    o > 0 && e.set(n.id, t.shots[o - 1].id);
  }), {
    ...r,
    shots: r.shots.map((n, o) => {
      const s = o > 0 ? r.shots[o - 1].id : "", i = o === 0 || e.get(n.id) !== s;
      return {
        ...n,
        transition: i ? "" : n.transition,
        transition_type: i ? "none" : n.transition_type,
        transition_duration_ms: i ? 0 : n.transition_duration_ms,
        match_previous: !i && !n.continue_previous ? n.match_previous : !1,
        continue_previous: !i && !!n.continue_previous,
        continuity_anchor: !i && n.continue_previous ? n.continuity_anchor : ""
      };
    })
  };
}
function se(t) {
  return t.workflow.status === "confirmed";
}
function ft(t) {
  if (!l(t))
    return { ...R };
  const r = f(t.output_target).toLowerCase();
  return {
    output_target: sr.includes(
      r
    ) ? r : R.output_target,
    voice_mode: D(
      t.voice_mode,
      R.voice_mode
    ),
    subtitle_mode: D(
      t.subtitle_mode,
      R.subtitle_mode
    ),
    lip_sync_mode: D(
      t.lip_sync_mode,
      R.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
}
function ae(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function lt(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ce(t) {
  return t.production_plan.output_target === "final_video";
}
function dr(t) {
  return lt(t) && t.production_plan.voice_mode === "auto" && fr(t) > 0;
}
function ue(t) {
  return lt(t) && t.production_plan.subtitle_mode === "auto" && lr(t) > 0;
}
function de(t) {
  return dr(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(yr);
}
function fr(t) {
  return t.shots.reduce(
    (r, e) => r + e.speech.filter(Ot).length,
    0
  );
}
function lr(t) {
  return t.shots.reduce(
    (r, e) => r + pr(e).length,
    0
  );
}
function pr(t) {
  const r = t.speech.filter(
    (n) => n.subtitle_enabled && !!n.text.trim()
  ).map((n) => ({
    id: `subtitle-${n.id}`,
    text: n.subtitle_text.trim() || n.text.trim(),
    start_time: n.start_time,
    speech_id: n.id,
    source: "speech"
  })), e = t.captions.filter((n) => !!n.text.trim()).map((n) => ({
    id: n.id,
    text: n.text.trim(),
    start_time: n.start_time,
    end_time: n.end_time,
    source: "caption"
  }));
  return [...r, ...e].sort(
    (n, o) => n.start_time - o.start_time
  );
}
function mr(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function pt(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function yr(t) {
  return t.speech.some(pt);
}
function fe(t) {
  return new Set(
    t.speech.filter(pt).map((r) => r.character_id?.trim()).filter((r) => !!r)
  );
}
function mt(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function le(t) {
  return t.summary.trim() || ht("", t.shots);
}
function pe(t, r) {
  const e = t.style_prompt.trim(), n = { ...t, style_prompt: r };
  return !e || e === r.trim() ? n : {
    ...n,
    materials: t.materials.map((o) => ({
      ...o,
      prompt: Z(
        o.prompt,
        e
      )
    })),
    shots: t.shots.map((o) => ({
      ...o,
      video_prompt: Z(
        o.video_prompt,
        e
      )
    }))
  };
}
function me(t, r, e = "shot") {
  const n = t.visual_mode === "photoreal" ? ir[e] : "画面类型：非写实影像，保持统一造型语言，不得漂移为真人摄影";
  let o = Q(r.trim(), n);
  const s = t.style_prompt.trim();
  if (!s)
    return o;
  const i = `统一视觉风格：${s}`;
  return o = Q(o, i), o;
}
function Z(t, r) {
  const e = `统一视觉风格：${r}`, n = t.trimEnd().replace(/[。！？!?；;，,\s]+$/g, "");
  return n.endsWith(e) ? n.slice(0, -e.length).replace(/[。！？!?；;，,：:\s]+$/g, "").trimEnd() : t;
}
function Q(t, r) {
  if (!r || t.includes(r))
    return t;
  if (!t)
    return r;
  const e = /[。！？!?；;，,：:]$/.test(t) ? "" : "。";
  return `${t}${e}${r}`;
}
function yt(t) {
  const r = f(t);
  return nr.includes(r) ? r : or;
}
function _t(t) {
  const r = f(t);
  return rr.includes(r) ? r : "none";
}
function ye(t) {
  const r = t.speech.filter(Ot).map((n) => `${mr(n)}：${n.text.trim()}`).join("；");
  return [
    t.description,
    t.continuity_state.entry ? `入镜状态：${t.continuity_state.entry}` : "",
    t.continuity_state.exit ? `出镜状态：${t.continuity_state.exit}` : "",
    t.camera_instruction ? `镜头语言：${t.camera_instruction}` : "",
    t.continue_previous && t.continuity_anchor ? `连续性锚点：${t.continuity_anchor}` : "",
    r,
    t.duration > 0 ? `时长：${t.duration} 秒` : ""
  ].filter(Boolean).join("。") || `镜头 ${t.order} 视频生成提示词`;
}
function T(t, r, e) {
  if (t == null || e > 10)
    return null;
  if (typeof t == "string") {
    for (const i of jt(t)) {
      const a = T(i, r, e + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object" || r.has(t))
    return null;
  if (r.add(t), Array.isArray(t)) {
    for (const i of t) {
      const a = T(i, r, e + 1);
      if (a)
        return a;
    }
    return null;
  }
  const n = t, o = _r(n);
  if (o)
    return o;
  const s = Ar(n);
  if (s) {
    const i = T(s, r, e + 1);
    if (i)
      return i;
  }
  for (const i of ar) {
    const a = n[i];
    if (a == null || a === t)
      continue;
    const c = T(a, r, e + 1);
    if (c)
      return c;
  }
  return null;
}
function _r(t) {
  const r = f(t.visual_mode).toLowerCase(), e = hr(t.work_type);
  if (f(t.type).toLowerCase() !== "storyboard" || O(t.version) !== B || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !gr(r) || !e || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const n = Sr(t.storyline);
  if (!n)
    return null;
  const o = G(t.references);
  if (o.length !== t.references.length)
    return null;
  const s = t.materials.map(St);
  if (s.some((h) => !h))
    return null;
  const i = s, a = /* @__PURE__ */ new Set();
  for (const h of i) {
    if (a.has(h.id))
      return null;
    a.add(h.id);
  }
  const c = /* @__PURE__ */ new Set(), y = t.shots.map(
    (h, g) => bt(h, g, a)
  );
  if (y.some((h) => !h))
    return null;
  const u = y;
  for (const [h, g] of u.entries()) {
    if (c.has(g.id) || at(g, h) && g.continuity_state.entry !== u[h - 1].continuity_state.exit)
      return null;
    c.add(g.id);
  }
  const p = O(t.target_duration), d = O(t.target_shot_count);
  if (p == null || !Number.isInteger(p) || p < F || d == null || !Number.isInteger(d) || d < 1 || d > tr)
    return null;
  const m = gt(t.workflow), _ = ht(
    f(t.summary),
    u
  ), b = {
    ...t,
    type: "storyboard",
    version: B,
    work_type: e,
    workflow: m,
    production_plan: ft(t.production_plan),
    title: br(t.title, _, u),
    summary: _,
    target_duration: p,
    target_shot_count: d,
    narrator_voice: t.narrator_voice.trim(),
    storyline: n,
    style_prompt: t.style_prompt,
    visual_mode: r,
    aspect_ratio: yt(t.aspect_ratio),
    references: o,
    materials: i,
    shots: u
  };
  return ur(b);
}
function hr(t) {
  const r = f(t).toLowerCase();
  return r ? vt(r) ? r : null : "short";
}
function Sr(t) {
  if (!l(t))
    return null;
  const r = f(t.setup), e = f(t.development), n = f(t.payoff);
  return { setup: r, development: e, payoff: n };
}
function ht(t, r) {
  const e = t.trim();
  if (e)
    return e;
  const n = r.map((o) => o.description.trim()).filter(Boolean);
  return n.length > 0 ? n.join("；") : "暂无内容简介";
}
function br(t, r, e) {
  const n = t.trim();
  if (n && !X.has(n))
    return n;
  const o = [r, e[0]?.beat, e[0]?.description].map((i) => String(i || "").trim()).find((i) => i && !X.has(i));
  if (!o)
    return "分镜脚本";
  const s = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(s).slice(0, 24).join("") || "分镜脚本";
}
function gr(t) {
  return er.includes(t);
}
function St(t) {
  if (!l(t))
    return null;
  const r = f(t.type).toLowerCase();
  return !Rr(r) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: r,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: r === "character" ? t.voice.trim() : "",
    reference_keys: M(t.reference_keys.map(f))
  };
}
function bt(t, r, e) {
  if (!l(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !l(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const n = O(t.duration);
  if (n == null || !cr(n))
    return null;
  const o = t.material_ids.map(f);
  if (o.some((_) => !_ || !e.has(_)) || new Set(o).size !== o.length)
    return null;
  const s = t.speech.map(kr);
  if (s.some((_) => !_))
    return null;
  const i = t.captions.map(Or);
  if (i.some(
    (_) => !_ || _.end_time > n
  ))
    return null;
  const a = r > 0 && t.continue_previous;
  if (r === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const c = r > 0 && !a && t.match_previous, y = t.transition.trim();
  if (r > 0 && !y)
    return null;
  const u = t.continuity_anchor.trim();
  if (a && !u)
    return null;
  const p = dt(
    t.continuity_state
  );
  if (!p.entry || !p.exit)
    return null;
  const d = _t(
    t.transition_type
  ), m = O(t.transition_duration_ms);
  return d !== t.transition_type || m == null || !Number.isInteger(m) || m < 0 || m > 5e3 || r === 0 && (d !== "none" || m !== 0) || r > 0 && d === "none" && m !== 0 || r > 0 && d !== "none" && m < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: r + 1,
    duration: n,
    beat: t.beat.trim(),
    transition: r > 0 ? y : "",
    transition_type: r > 0 ? d : "none",
    transition_duration_ms: r > 0 && d !== "none" ? m : 0,
    description: t.description,
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: M(t.reference_keys.map(f)),
    match_previous: c,
    continue_previous: a,
    continuity_anchor: a ? u : "",
    continuity_state: p,
    speech: s,
    captions: i
  };
}
function kr(t) {
  if (!l(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const r = f(t.kind).toLowerCase(), e = O(t.start_time);
  if (r !== "dialogue" && r !== "narration" || e == null || e < 0)
    return null;
  if (r === "narration") {
    const o = {
      ...t,
      id: t.id.trim(),
      kind: r,
      text: t.text,
      start_time: e,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete o.character_id, delete o.speaker_mode, o;
  }
  const n = f(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || n !== "visible" && n !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: r,
    text: t.text,
    start_time: e,
    character_id: t.character_id.trim(),
    speaker_mode: n,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function Or(t) {
  if (!l(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const r = f(t.type).toLowerCase(), e = O(t.start_time), n = O(t.end_time);
  return !Tr(r) || e == null || n == null || e < 0 || n <= e ? null : {
    ...t,
    id: t.id.trim(),
    type: r,
    text: t.text,
    start_time: e,
    end_time: n
  };
}
function gt(t) {
  const r = l(t) ? t : {}, e = f(r.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: e,
    confirmed_at: e === "confirmed" ? f(r.confirmed_at) : ""
  };
}
function D(t, r) {
  const e = f(t).toLowerCase();
  return e === "auto" || e === "off" ? e : r;
}
function Ar(t) {
  const r = rt(t);
  if (r)
    return r;
  if (!l(t))
    return "";
  const e = t.type === "doc" ? t : l(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return e ? kt(e).trim() : "";
}
function kt(t) {
  if (!l(t))
    return "";
  if (t.type === "text")
    return f(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const r = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(kt).join(r);
}
function Rr(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Tr(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Ot(t) {
  return t.text.trim().length > 0;
}
function M(t) {
  return [...new Set(t.map((r) => r.trim()).filter(Boolean))];
}
function O(t) {
  const r = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(r) ? r : null;
}
const wr = Bt(
  () => import("./space-storyboard-view-CugNizUh.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function xr({
  output: t,
  fallback: r = "",
  streaming: e = !1,
  emptyText: n = "暂无内容",
  className: o,
  markdownClassName: s,
  richClassName: i,
  mediaLayout: a = "default",
  mediaGridKind: c,
  storyboardEditable: y = !1,
  storyboardDisabled: u = !1,
  onStoryboardSave: p
}) {
  const d = zt(t, r), m = ct(d), _ = V(d);
  if (_)
    return /* @__PURE__ */ k(I, { className: o, children: /* @__PURE__ */ k(Ft, { grid: _ }) });
  if (m)
    return /* @__PURE__ */ k(I, { className: o, children: /* @__PURE__ */ k(Ut, { fallback: /* @__PURE__ */ k("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ k(
      wr,
      {
        storyboard: m,
        editable: y,
        disabled: u,
        onSave: p
      }
    ) }) });
  const b = At(d, c);
  return b ? /* @__PURE__ */ k(
    I,
    {
      className: [o, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ k(
        Et,
        {
          kind: b.kind,
          items: b.items,
          label: r
        }
      )
    }
  ) : /* @__PURE__ */ k(
    Vt,
    {
      output: d,
      fallback: r,
      streaming: e,
      emptyText: n,
      className: o,
      markdownClassName: s,
      richClassName: i,
      mediaLayout: a
    }
  );
}
function Mr(t, r) {
  if (Ir(t, r))
    return !1;
  const e = Gt(t), n = Y(t);
  return n.length > 1 || e > 1 ? !0 : n.some((o) => !o || typeof o != "object" || Array.isArray(o) ? P(o) : [
    o.title,
    o.text,
    o.reasoning,
    o.rich,
    o.progress,
    o.error,
    o.json
  ].some(P));
}
function At(t, r) {
  if (!r)
    return null;
  const e = Yt(t, r);
  return e.length > 1 ? { kind: r, items: e } : null;
}
function Cr(t) {
  if (t?.videoUrl)
    return "video";
  if (t?.imageUrl)
    return "image";
  if (t?.audioUrl)
    return "audio";
}
function Ir(t, r) {
  const e = U(t, /* @__PURE__ */ new Set(), 0);
  return !e || !r ? !1 : [
    r.imageUrl,
    r.videoUrl,
    r.audioUrl,
    r.fileUrl
  ].some((n) => String(n || "").trim() === e);
}
function U(t, r, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? U(t[0], r, e + 1) : "";
  if (typeof t != "object" || r.has(t))
    return "";
  r.add(t);
  const o = Object.entries(t).filter(
    ([s, i]) => !["type", "kind", "format", "version"].includes(s) && P(i)
  ).map(([, s]) => s);
  return o.length === 1 ? U(o[0], r, e + 1) : "";
}
const _e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CanvasNodeContentView: xr,
  canvasMediaGridKind: Cr,
  canvasMultiMediaGridOutput: At,
  contentOutputNeedsRenderer: Mr
}, Symbol.toStringTag, { value: "Module" }));
function he(t, r) {
  const e = $r(t, r), n = V(e);
  if (n)
    return {
      mode: "storyboard_grid",
      value: n,
      format: "json",
      summary: Tt(n),
      downloadUrl: ""
    };
  const o = ct(e);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: mt(o),
      downloadUrl: ""
    };
  const s = xt(e);
  if (s) {
    const u = zr(e) ? null : Wt(s);
    return u && (t.kind === "text" || Kt(u.plainText)) ? $(u.markdown) : v(s);
  }
  const i = z(e);
  if (i)
    return {
      mode: "file",
      value: i,
      format: "json",
      summary: i.description || i.name || "文件内容",
      downloadUrl: i.url
    };
  const a = Ur(e);
  if (a)
    return $(a);
  const c = Pr(e);
  if (c)
    return v(c);
  const y = E(e) || t.description || "";
  return $(y);
}
function Se(t, r, e = {}) {
  const n = e.includeNodeResult === !1 ? r?.content : qt(
    r?.content,
    t.asset?.version?.content,
    t.resultOutput,
    Mt(t, "result", "output")
  ), o = S(n);
  if (V(o))
    return;
  const s = rt(o);
  for (const a of [o, S(s)])
    if (Ht(a))
      return Dr(a);
  const i = Br(t.kind, o);
  if (i)
    return i;
}
function Dr(t) {
  const e = Y(t).map((n) => {
    if (!l(n) || n.json === void 0)
      return n;
    const o = { ...n };
    return delete o.json, o;
  });
  return e.length === 1 ? e[0] : e;
}
function $r(t, r) {
  return Jt(
    r?.content,
    t.asset?.version?.content,
    t.resultOutput,
    Mt(t, "result", "output"),
    t.description
  );
}
function Rt(t) {
  if (t.mode === "storyboard" || t.mode === "storyboard_grid")
    return t.value;
  if (t.mode === "file")
    return Nr(t.value);
  const r = String(t.value || "");
  return t.format === "markdown" ? { format: "markdown", text: r } : w(S(r)) || jr(r);
}
function be(t) {
  return nt(Rt(t));
}
function ge(t, r) {
  const e = { ...t, value: r };
  if (e.mode === "storyboard")
    e.summary = mt(r);
  else if (e.mode === "storyboard_grid")
    e.summary = Tt(r);
  else if (e.mode === "file") {
    const n = r;
    e.summary = n.description || n.name || "文件内容", e.downloadUrl = n.url;
  } else
    e.summary = W(et(Rt(e)));
  return e;
}
function Tt(t) {
  return A(
    t.summary,
    `${t.title || "宫格图片"} · ${t.frames.length} 张`
  );
}
function v(t) {
  const r = et(t);
  return {
    mode: "rich",
    value: nt(t),
    format: "json",
    summary: W(r),
    downloadUrl: wt(t)
  };
}
function $(t) {
  return {
    mode: "rich",
    value: t,
    format: "markdown",
    summary: W(t),
    downloadUrl: ""
  };
}
function Pr(t) {
  if (typeof t == "string" && S(t) === t)
    return null;
  const r = Y(t), e = [];
  return j(
    r,
    e,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), e.length === 0 ? null : w({ type: "doc", content: e });
}
function j(t, r, e, n, o, s) {
  if (t == null || s > 12)
    return;
  const i = S(t);
  if (typeof i == "string") {
    tt(r, i, n);
    return;
  }
  if (Array.isArray(i)) {
    i.forEach(
      (c) => j(
        c,
        r,
        e,
        n,
        o,
        s + 1
      )
    );
    return;
  }
  if (!l(i) || e.has(i))
    return;
  e.add(i);
  const a = xt(i);
  if (a) {
    for (const c of a.content || [])
      r.push(c);
    return;
  }
  tt(
    r,
    A(i.title, i.text),
    n
  ), Lr(i, r, o);
  for (const c of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    i[c] !== void 0 && j(
      i[c],
      r,
      e,
      n,
      o,
      s + 1
    );
}
function Lr(t, r, e) {
  const n = [
    { kind: "image", values: [t.image, t.image_url, t.imageUrl, t.images] },
    { kind: "video", values: [t.video, t.video_url, t.videoUrl, t.videos] },
    { kind: "audio", values: [t.audio, t.audio_url, t.audioUrl, t.audios] }
  ];
  for (const o of n)
    for (const s of o.values)
      for (const i of C(s)) {
        const a = `${o.kind}:${i}`;
        e.has(a) || (e.add(a), r.push({
          type: Er(o.kind),
          attrs: { src: i }
        }));
      }
}
function tt(t, r, e) {
  const n = String(r || "").trim();
  !n || It(n) || K(n) || e.has(n) || (e.add(n), t.push({
    type: "paragraph",
    content: [{ type: "text", text: n }]
  }));
}
function C(t) {
  return Array.isArray(t) ? t.flatMap(C) : typeof t == "string" ? It(t.trim()) ? [t.trim()] : [] : l(t) ? [
    t.url,
    t.src,
    t.path,
    t.download_url,
    t.downloadUrl
  ].flatMap(C) : [];
}
function z(t) {
  const r = S(t);
  if (Array.isArray(r)) {
    for (const n of r) {
      const o = z(n);
      if (o)
        return o;
    }
    return null;
  }
  if (!l(r))
    return null;
  const e = Vr(
    r.file,
    r.file_url,
    r.fileUrl,
    r.files
  );
  if (e)
    return {
      url: e,
      name: A(r.name, r.filename, r.title) || Ct(e),
      description: A(
        r.description,
        r.text,
        r.summary
      )
    };
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (r[n] !== void 0) {
      const o = z(r[n]);
      if (o)
        return o;
    }
  return null;
}
function Nr(t) {
  return {
    type: "file",
    file_url: t.url,
    name: t.name || Ct(t.url),
    description: t.description.trim()
  };
}
function Br(t, r) {
  if (t !== "image" && t !== "video" && t !== "audio")
    return;
  const e = C(r);
  if (e.length !== 0)
    return {
      [`${t}s`]: e
    };
}
function E(t) {
  const r = S(t);
  if (typeof r == "string")
    return K(r) ? "" : r;
  if (Array.isArray(r))
    return r.map(E).filter(Boolean).join(`

`);
  if (!l(r))
    return "";
  const e = A(
    r.text,
    r.summary,
    r.description
  );
  if (e)
    return e;
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (r[n] !== void 0) {
      const o = E(r[n]);
      if (o)
        return o;
    }
  return "";
}
function Ur(t) {
  const r = S(t);
  return typeof r == "string" ? K(r) ? "" : r : l(r) && String(r.format || "").trim().toLowerCase() === "markdown" ? A(r.text, r.markdown) : "";
}
function jr(t) {
  const r = t.split(/\n{2,}/).map((e) => e.trim());
  return {
    type: "doc",
    content: (r.length ? r : [""]).map((e) => ({
      type: "paragraph",
      content: e ? [{ type: "text", text: e }] : []
    }))
  };
}
function wt(t) {
  if (!t || typeof t != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(t.type || "")
  ))
    return String(t.attrs?.src || "").trim();
  for (const r of Array.isArray(t.content) ? t.content : []) {
    const e = wt(r);
    if (e)
      return e;
  }
  return "";
}
function xt(t) {
  const r = S(t);
  if (!l(r))
    return null;
  if (String(r.type || "") === "doc")
    return w(r);
  const e = Object.keys(r).filter((n) => n !== "format");
  return e.length === 1 && e[0] === "rich" ? w(r.rich) : String(r.format || "").trim().toLowerCase() === "rich_json" ? w(r.rich ?? r.content) : null;
}
function zr(t) {
  const r = S(t);
  return l(r) && String(r.format || "").trim().toLowerCase() === "rich_json";
}
function Er(t) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[t];
}
function Vr(...t) {
  for (const r of t) {
    const e = C(r)[0];
    if (e)
      return e;
  }
  return "";
}
function Mt(t, ...r) {
  let e = t;
  for (const n of r) {
    if (!l(e))
      return;
    e = e[n];
  }
  return e;
}
function Ct(t) {
  const e = (t.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(e) || "文件";
  } catch {
    return e || "文件";
  }
}
function W(t) {
  const r = String(t || "").replace(/\s+/g, " ").trim();
  return r.length > 120 ? `${r.slice(0, 120)}…` : r || "暂无内容";
}
function It(t) {
  return /^(https?:\/\/|\/|data:)/i.test(t);
}
function K(t) {
  const r = t.trim();
  return r.startsWith("{") && r.endsWith("}") || r.startsWith("[") && r.endsWith("]");
}
export {
  me as $,
  ae as A,
  fe as B,
  xr as C,
  lr as D,
  ft as E,
  ce as F,
  ot as G,
  Xt as H,
  ee as I,
  le as J,
  er as K,
  Jr as L,
  tr as M,
  nr as N,
  ur as O,
  ie as P,
  re as Q,
  F as R,
  Xr as S,
  Hr as T,
  ne as U,
  oe as V,
  te as W,
  pe as X,
  G as Y,
  Zr as Z,
  pt as _,
  fr as a,
  ye as a0,
  Mr as a1,
  Cr as a2,
  At as a3,
  _e as a4,
  vr as b,
  mr as c,
  pr as d,
  yr as e,
  Se as f,
  Rt as g,
  be as h,
  se as i,
  vt as j,
  Kr as k,
  qr as l,
  Wr as m,
  ge as n,
  ut as o,
  ct as p,
  it as q,
  he as r,
  Qr as s,
  cr as t,
  at as u,
  rr as v,
  de as w,
  ue as x,
  dr as y,
  lt as z
};
