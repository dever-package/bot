import { e as b, $ as Ct, h as Bt, F as l, _ as C, j as Pt, a0 as Lt, a1 as Ft, a2 as Et, r as zt, B as Z, v as at, w as Ut, k as $t, X as Vt } from "./asset-audio-preview-Du5K0btg.js";
import { j as f, a as T } from "./preloadable-R-5sHdlM.js";
import { b as ct, aI as jt, aF as Yt, bc as Kt, bd as vt, a8 as Ht, Q as qt } from "./vendor-icons-IZIW7U43.js";
import { r as Gt, V as Wt, M as tt } from "./media-inspector-gallery-a93u-E1M.js";
import { b as Xt, a as F, d as Jt } from "./file-kind-Cq3pESGF.js";
function v(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!b(o))
      continue;
    const i = N(o.asset_id ?? o.assetId), s = ft(o.kind), a = $(o.purpose);
    if (!i || !s || !a || n.has(i))
      continue;
    let c = String(o.key || "").trim() || U(i);
    if (r.has(c) && (c = U(i)), r.has(c))
      continue;
    const u = N(o.version_id ?? o.versionId), m = String(o.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: c,
      asset_id: i,
      ...u ? { version_id: u } : {},
      label: m,
      kind: s,
      purpose: a
    }), r.add(c), n.add(i);
  }
  return e;
}
function We(t, e, r, n, o, i) {
  const s = new Map(
    v(e).map((y) => [
      y.asset_id,
      y
    ])
  ), a = new Map(
    r.flatMap((y) => {
      const d = N(y.refId);
      return d ? [[d, y]] : [];
    })
  ), c = [], u = (t?.parts || []).map((y) => ({ ...y })), m = /* @__PURE__ */ new Set();
  for (const [y, d] of (t?.parts || []).entries()) {
    if (d.type !== "reference" || d.ref_type !== "asset")
      continue;
    const _ = N(d.ref_id);
    if (!_ || m.has(_))
      continue;
    const p = s.get(_), g = a.get(_), h = ft(g?.kind) || p?.kind;
    if (!h)
      continue;
    const S = N(g?.versionID || d.ref_version_id), w = String(g?.title || d.label || p?.label || "").trim() || `参考素材 ${c.length + 1}`, R = ut(
      h,
      o,
      i
    ), k = $(d.purpose), I = $(
      p?.purpose
    ), A = [k, I].find(
      (Nt) => R.some((Mt) => Mt.value === Nt)
    ) || Zt(h, o, i), L = u[y];
    L?.type === "reference" && (L.purpose = A || void 0), c.push({
      key: p?.key || U(_),
      asset_id: _,
      ...S ? { version_id: S } : {},
      label: w,
      kind: h,
      purpose: A
    }), m.add(_);
  }
  return {
    content: t ? { ...t, parts: u } : void 0,
    references: c
  };
}
function Xe(t, e) {
  return e.filter(
    (r) => r.work_types.length === 0 || r.work_types.includes(t)
  ).map((r) => ({
    key: r.key,
    label: r.name,
    acceptedKinds: [...r.media_kinds]
  }));
}
function ut(t, e, r) {
  return r.filter(
    (n) => n.media_kinds.includes(t) && (n.work_types.length === 0 || n.work_types.includes(e))
  ).map((n) => ({ value: n.key, label: n.name }));
}
function dt(t, e) {
  return e.find((r) => r.key === t);
}
function Qt(t, e) {
  return dt(t, e)?.name || t;
}
function Je(t, e, r, n) {
  const o = r.find((s) => s.key === e);
  if (!o || n.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const a = dt(
      s.purpose,
      n
    );
    if (!a)
      return `参考素材“${s.label}”的用途无效`;
    if (!a.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${a.name}”`;
    if (a.work_types.length > 0 && !a.work_types.includes(e))
      return `当前作品类型不支持“${s.label}”的用途“${a.name}”`;
    const c = (i.get(s.purpose) || 0) + 1;
    if (i.set(s.purpose, c), a.max_count > 0 && c > a.max_count)
      return `用途“${a.name}”最多只能选择 ${a.max_count} 个素材`;
  }
  for (const s of o.required_reference_purposes)
    if (!i.get(s))
      return `${o.name}必须添加“${Qt(
        s,
        n
      )}”`;
  return "";
}
function U(t) {
  return `ref-${t}`;
}
function $(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Zt(t, e, r) {
  const n = ut(t, e, r);
  return r.find(
    (i) => i.default_media_kinds.includes(t) && (i.work_types.length === 0 || i.work_types.includes(e))
  )?.key || n[0]?.value || "";
}
function ft(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function N(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function te(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const ee = 10, ne = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], H = "first_last", Qe = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function re(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function Ze(t, e) {
  const r = re(t);
  return e ? Math.max(r || 0, ee) : r;
}
function mt(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function oe(t) {
  return mt(t) || "start";
}
function tn(t) {
  return oe(t) === "end" ? "lastFrame" : "firstFrame";
}
function en(t) {
  return ne.includes(t) ? t : void 0;
}
function nn(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return ie();
    default:
      return [];
  }
}
function rn(t, e) {
  return e + ":" + t;
}
function E(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ie() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function on(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!o || typeof o != "object" || Array.isArray(o))
      continue;
    const i = o, s = mt(i.frameRole ?? i.frame_role), a = Number(i.mediaIndex ?? i.media_index);
    !s || !Number.isInteger(a) || a <= 0 || r.has(s) || n.has(a) || (r.add(s), n.add(a), e.push({ frameRole: s, mediaIndex: a }));
  }
  return e.sort((o, i) => o.mediaIndex - i.mediaIndex);
}
function sn(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const r = e, n = E(r.prompt);
    if (!n)
      return;
    const o = E(r.title);
    return {
      title: o || "画面",
      description: E(r.description) || o || n,
      prompt: n
    };
  }).filter((e) => !!e) : [];
}
function an(t, e) {
  return t?.find((r) => r.frameRole === e)?.mediaIndex || 0;
}
function cn(t, e, r) {
  const n = t[e], o = n.continue_previous ? t[e - 1] : void 0;
  return {
    start: e === 0 && r ? null : o ? { shotId: o.id, shotIndex: e - 1, role: "end" } : { shotId: n.id, shotIndex: e, role: "start" },
    end: { shotId: n.id, shotIndex: e, role: "end" }
  };
}
function un(t, e, r, n) {
  const o = t[e], i = se(t, e, r, n);
  if (!o || !i)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: O(o?.material_ids),
      referenceKeys: O(o?.reference_keys),
      includeGlobalReferences: !0
    };
  const s = t[i.shotIndex];
  return {
    anchorID: i.id,
    anchorFrameRole: i.frameRole,
    anchorShotIndex: i.shotIndex,
    // A close-up may not show the whole subject or environment. A new
    // framing still needs the current identity, prop and scene references.
    materialIDs: O(o.material_ids).filter(
      (a) => r === "start" || !s?.material_ids?.includes(a)
    ),
    referenceKeys: r === "start" ? O(o.reference_keys) : ae(o.reference_keys, s?.reference_keys),
    includeGlobalReferences: !1
  };
}
function se(t, e, r, n) {
  const o = t[e];
  if (!o)
    return;
  if (r === "end")
    return e > 0 && o.continue_previous ? { id: t[e - 1].id, shotIndex: e - 1, frameRole: "end" } : { id: o.id, shotIndex: e, frameRole: "start" };
  if (!o.match_previous || e <= 0) return;
  if (o.handoff?.match_action)
    return { id: t[e - 1].id, shotIndex: e - 1, frameRole: "end" };
  const i = new Set(o.material_ids || []), s = (d) => n.filter((_) => _.type === d && i.has(_.id)).map((_) => _.id), a = s("character"), c = s("prop"), u = s("scene"), m = new Set(n.filter((d) => d.type === "scene").map((d) => d.id)), y = a.length ? a : c.length ? c : u;
  for (let d = e - 1; d >= 0; d -= 1) {
    const _ = t[d], p = t[d + 1];
    if (p.scene_index != null && _.scene_index != null && p.scene_index !== _.scene_index && !p.match_previous && !p.continue_previous) break;
    const g = _.material_ids || [], h = g.filter((S) => m.has(S));
    if (u.length && h.length && (u.length !== h.length || !u.every((S) => h.includes(S)))) break;
    if (!(!u.every((S) => g.includes(S)) || !y.some((S) => g.includes(S))))
      return { id: _.id, shotIndex: d, frameRole: "end" };
  }
}
function ae(t, e) {
  const r = new Set(O(e));
  return O(t).filter(
    (n) => !r.has(n)
  );
}
function O(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
const lt = 4, V = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function q(t) {
  if (t == null || String(t).trim() === "")
    return lt;
  const e = Number(t);
  if (!Number.isInteger(e) || !V.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function dn(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return q(t);
    } catch {
      return;
    }
}
function fn(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), r = t.map((n) => {
    const o = b(n) ? n : {}, i = q(o.seconds), s = Number(o.sort);
    if (e.has(i) || !Number.isInteger(s))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(i), {
      seconds: i,
      name: String(o.name || "").trim() || `${i} 秒`,
      sort: s
    };
  });
  if (r.length !== V.size || [...V].some(
    (n) => !e.has(n)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return r.sort((n, o) => n.sort - o.sort);
}
function mn(t) {
  const e = t.shots.map((r) => Number(r.duration));
  return [...new Set(e.filter(pt))].sort(
    (r, n) => r - n
  );
}
function ln(t, e) {
  const r = _t(
    e
  );
  return r.length === 0 ? t : t.filter((n) => {
    const o = new Set(
      (n.supported_options?.duration || []).map(
        (i) => String(i).trim()
      )
    );
    return r.every((i) => o.has(String(i)));
  });
}
function _n(t) {
  const e = _t(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function _t(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(pt))
  ].sort((r, n) => r - n);
}
function pt(t) {
  return Number.isInteger(t) && t >= 2;
}
const j = 9, yt = 2, ce = 50, et = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), ue = ["photoreal", "stylized"], pn = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, de = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], fe = "16:9", me = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], nt = {
  output_target: "shot_images",
  subtitle_mode: "off"
};
function G(t, e, r, n) {
  if (!b(t)) return;
  const o = l(t.outgoing), i = e ? l(t.incoming) : "", s = l(t.sound_cue), a = r && t.match_action === !0, c = n ? l(t.camera_path) : "";
  if (!o && !i && !s && !a && !c) return;
  const u = Math.round(x(t.sound_lead_ms) ?? 0);
  return {
    outgoing: o,
    incoming: i,
    sound_cue: s,
    sound_lead_ms: e && !n && s && u >= 100 ? Math.min(900, u) : 0,
    ...a ? { match_action: !0 } : {},
    ...c ? { camera_path: c } : {}
  };
}
function le(t, e) {
  return (e === "video" ? t.video_prompt : e === "start" ? t.start_framing : t.end_framing)?.trim() || "";
}
function yn(t, e) {
  return t.prompt_overrides?.[e] || le(t, e);
}
function _e(t) {
  if (!b(t)) return;
  const e = l(t.start).trim(), r = l(t.end).trim(), n = l(t.video).trim();
  return e || r || n ? { ...e && { start: e }, ...r && { end: r }, ...n && { video: n } } : void 0;
}
function pe(t, e) {
  return e > 0 && t.continue_previous;
}
const ye = [
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
function hn(t) {
  return we(t, Re);
}
function bn(t, e) {
  if (!b(t) || !Array.isArray(t.materials))
    return null;
  const r = t.materials.map(It);
  if (r.some((s) => !s))
    return null;
  const n = r, o = new Set(
    n.map((s) => s.id)
  );
  if (o.size !== n.length)
    return null;
  const i = At(t.shot, e, o);
  return i ? { shot: i, materials: n } : null;
}
function gn(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : ht(t.shots);
}
function ht(t) {
  return t.reduce(
    (e, r) => e + Math.max(0, Number(r.duration) || 0),
    0
  );
}
function he(t) {
  return Number.isInteger(t) && t >= yt;
}
function Sn(t, e) {
  const r = new Map(
    t.materials.map((n) => [n.id, n])
  );
  return e.material_ids.map((n) => r.get(n)).filter((n) => !!n);
}
function In(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: lt,
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    spatial_layout: "",
    start_framing: "",
    end_framing: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    shot_image_mode: H,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function An(t, e) {
  const r = new Set(t.map((i) => i.id));
  let n = t.filter((i) => i.type === e).length + 1, o = `${e}-${n}`;
  for (; r.has(o); )
    n += 1, o = `${e}-${n}`;
  return {
    id: o,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function wn(t, e) {
  const r = [], n = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && r.push(o.id);
    for (const i of o.speech)
      i.character_id === e && n.push(i.id);
  }
  return { shotIds: r, speechIds: n };
}
function Rn(t) {
  let e = 0;
  const r = [];
  for (const n of t.shots) {
    for (const o of [...n.speech].sort((i, s) => i.start_time - s.start_time))
      o.kind === "narration" && o.text.trim() && r.push({ speech: o, startTime: e + o.start_time, shotId: n.id });
    e += n.duration;
  }
  return r;
}
function be(t) {
  const e = Rt(t.workflow), r = v(t.references), n = new Set(r.map((s) => s.key)), o = new Set(
    t.materials.map((s) => s.id)
  ), i = t.shots.map((s, a) => {
    const c = a > 0 && !!s.continue_previous, u = a > 0 && !c && !!s.match_previous;
    return {
      ...s,
      id: s.id || `shot-${a + 1}`,
      order: a + 1,
      transition: a > 0 ? s.transition.trim() : "",
      handoff: G(
        s.handoff,
        a > 0 || !!t.chapter_boundary,
        u,
        c || a === 0 && t.chapter_boundary?.connection === "continue"
      ),
      transition_type: "none",
      transition_duration_ms: 0,
      material_ids: M(s.material_ids).filter(
        (m) => o.has(m)
      ),
      reference_keys: M(s.reference_keys).filter(
        (m) => n.has(m)
      ),
      shot_image_mode: H,
      shared_end_shot_id: "",
      match_previous: u,
      continue_previous: c,
      continuity_anchor: c ? s.continuity_anchor.trim() : "",
      continuity_state: bt(
        s.continuity_state
      ),
      lyric_line_indexes: wt(
        s.lyric_line_indexes
      )
    };
  });
  return i.forEach((s, a) => {
    const c = pe(s, a);
    if (a > 0 && (c || s.match_previous && s.handoff?.match_action)) {
      const u = i[a - 1];
      s.continuity_state.entry = u.continuity_state.exit || s.continuity_state.entry, c && (s.start_framing = u.end_framing || s.start_framing);
    }
  }), {
    ...t,
    version: j,
    workflow: e,
    production_plan: W(
      t.production_plan,
      t.work_type
    ),
    target_duration: !i.length && t.screenplay ? t.target_duration : ht(i),
    target_shot_count: i.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: gt(t.aspect_ratio),
    references: r,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: M(s.reference_keys).filter(
        (a) => n.has(a)
      )
    })),
    shots: i
  };
}
function bt(t) {
  const e = b(t) ? t : {};
  return {
    entry: l(e.entry).trim(),
    exit: l(e.exit).trim()
  };
}
function ge(t, e) {
  return t.material_ids.filter((r) => e.has(r)).sort().join(`
`);
}
function xn(t, e) {
  const r = new Map(t.shots.map((i, s) => [i.id, s])), n = new Set([...t.materials, ...e.materials].filter((i) => i.type === "scene").map((i) => i.id)), o = (i) => ge(i, n);
  return {
    ...e,
    shots: e.shots.map((i, s) => {
      const a = r.get(i.id) ?? -1, c = t.shots[a], u = t.shots[a - 1], m = e.shots[s - 1], y = u?.id !== m?.id;
      let d = !!(m && i.continue_previous), _ = !!(m && i.match_previous);
      const p = o(i), g = m ? o(m) : "", h = !!(c && p !== o(c)) || !!(u && g !== o(u)), S = i.handoff?.camera_path, w = d && !!S && !y && (!h || S !== c?.handoff?.camera_path);
      if (m) {
        const I = !!(p && p === g), A = !!(c && (i.start_framing !== c.start_framing || i.continuity_state.entry !== c.continuity_state.entry));
        !d && !_ && (!!(c?.continue_previous || c?.match_previous) || i.scene_index != null && m.scene_index != null && i.scene_index !== m.scene_index) || !w && !I && (p || g || y || A) ? (d = !1, _ = !1) : (y || h || d && A) && (d = (I || w) && !!i.continuity_state.entry.trim() && i.continuity_state.entry.trim() === m.continuity_state.exit.trim() && (i.start_framing || "").trim() === (m.end_framing || "").trim(), _ = I && !d);
      }
      let R = {};
      if (!d && (h || y) && c?.continue_previous && u && (i.continuity_state.entry === c.continuity_state.entry && c.continuity_state.entry === u.continuity_state.exit && (R.continuity_state = { ...i.continuity_state, entry: "" }), i.start_framing === c.start_framing && c.start_framing === u.end_framing)) {
        const I = { ...i.reference_contents };
        delete I.start_framing, R = { ...R, start_framing: "", reference_contents: I };
      }
      const k = s === 0 && e.chapter_boundary?.connection === "continue";
      return {
        ...i,
        ...R,
        transition: !m || y ? "" : i.transition,
        handoff: y || h && !w ? void 0 : G(
          i.handoff,
          !!(m || k),
          !d && _,
          d || k
        ),
        match_previous: !d && _,
        continue_previous: d,
        continuity_anchor: d ? i.continuity_anchor : ""
      };
    })
  };
}
function kn(t) {
  return t.workflow.status === "confirmed";
}
function W(t, e) {
  const r = b(t) ? t : {}, n = l(r.output_target).toLowerCase(), o = {
    output_target: me.includes(
      n
    ) ? n : nt.output_target,
    voice_mode: r.voice_mode === "native" ? "native" : rt(r.voice_mode, "auto"),
    subtitle_mode: rt(
      r.subtitle_mode,
      nt.subtitle_mode
    ),
    shot_visual_strategy: "auto"
  };
  return e === "mv" ? {
    ...o,
    voice_mode: "off",
    subtitle_mode: "off"
  } : o;
}
function On(t) {
  return {
    ...W(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video"
  };
}
function Tn(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function X(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function Dn(t) {
  return t.production_plan.output_target === "final_video";
}
function J(t) {
  return t.work_type === "mv";
}
function Nn(t) {
  return !J(t) && X(t) && t.production_plan.voice_mode === "auto" && Se(t) > 0;
}
function Mn(t) {
  return !J(t) && X(t) && t.production_plan.voice_mode === "native";
}
function Cn(t) {
  return !J(t) && X(t) && t.production_plan.subtitle_mode === "auto" && Ie(t) > 0;
}
function Se(t) {
  return t.shots.reduce(
    (e, r) => e + r.speech.filter(Fe).length,
    0
  );
}
function Ie(t) {
  return t.shots.reduce(
    (e, r) => e + Ae(r).length,
    0
  );
}
function Ae(t) {
  const e = t.speech.filter((n) => n.subtitle_enabled && !!n.text.trim()).map((n) => ({
    id: `subtitle-${n.id}`,
    text: n.subtitle_text.trim() || n.text.trim(),
    start_time: n.start_time,
    speech_id: n.id,
    source: "speech"
  })), r = t.captions.filter((n) => !!n.text.trim()).map((n) => ({
    id: n.id,
    text: n.text.trim(),
    start_time: n.start_time,
    end_time: n.end_time,
    source: "caption"
  }));
  return [...e, ...r].sort(
    (n, o) => n.start_time - o.start_time
  );
}
function Bn(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Pn(t) {
  return t.summary.trim() || St("", t.shots);
}
function Ln(t, e) {
  return { ...t, style_prompt: e };
}
function gt(t) {
  const e = l(t);
  return de.includes(e) ? e : fe;
}
function we(t, e) {
  return D(t, /* @__PURE__ */ new Set(), 0, e);
}
function D(t, e, r, n) {
  if (t == null || r > 10)
    return null;
  if (typeof t == "string") {
    for (const a of Ct(t)) {
      const c = D(a, e, r + 1, n);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const a of t) {
      const c = D(a, e, r + 1, n);
      if (c)
        return c;
    }
    return null;
  }
  const o = t, i = n(o);
  if (i)
    return i;
  const s = Be(o);
  if (s) {
    const a = D(s, e, r + 1, n);
    if (a)
      return a;
  }
  for (const a of ye) {
    const c = o[a];
    if (c == null || c === t)
      continue;
    const u = D(c, e, r + 1, n);
    if (u)
      return u;
  }
  return null;
}
function Re(t) {
  const e = l(t.visual_mode).toLowerCase(), r = Oe(t.work_type);
  let n;
  try {
    n = q(t.min_shot_duration);
  } catch {
    return null;
  }
  if (l(t.type).toLowerCase() !== "storyboard" || x(t.version) !== j || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ne(e) || !r || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const o = b(t.workflow) && t.workflow.status === "draft", i = t.screenplay == null ? void 0 : xe(t.screenplay);
  if (i === null) return null;
  const s = Te(t.storyline);
  if (!s)
    return null;
  const a = v(t.references);
  if (a.length !== t.references.length)
    return null;
  const c = t.materials.map(It);
  if (c.some((I) => !I))
    return null;
  const u = c, m = /* @__PURE__ */ new Set();
  for (const I of u) {
    if (m.has(I.id))
      return null;
    m.add(I.id);
  }
  const y = /* @__PURE__ */ new Set(), d = b(t.chapter_boundary) && t.chapter_boundary.connection === "continue", _ = t.shots.map(
    (I, A) => At(I, A, m, o, A === 0 && d)
  );
  if (_.some((I) => !I))
    return null;
  const p = _;
  for (const [I, A] of p.entries()) {
    if (y.has(A.id))
      return null;
    y.add(A.id);
  }
  const g = x(t.target_duration), h = x(t.target_shot_count);
  if (g == null || !Number.isInteger(g) || g < yt || h == null || !Number.isInteger(h) || h < (i && o && !p.length ? 0 : 1) || h > ce)
    return null;
  const S = ke(t, r);
  if (S === null)
    return null;
  const w = Rt(t.workflow), R = St(
    l(t.summary),
    p
  ), k = {
    ...t,
    type: "storyboard",
    version: j,
    work_type: r,
    workflow: w,
    screenplay: i,
    production_plan: W(
      t.production_plan,
      r
    ),
    title: De(t.title, R, p),
    summary: R,
    target_duration: g,
    target_shot_count: h,
    min_shot_duration: n,
    ...S,
    lyrics_lrc: r === "mv" ? l(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: s,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: gt(t.aspect_ratio),
    references: a,
    materials: u,
    shots: p
  };
  return be(k);
}
function xe(t) {
  if (!b(t)) return null;
  const { source: e, source_passages: r, parts: n } = t;
  return !b(e) || !Array.isArray(r) || !Array.isArray(n) || typeof e.unit_id != "string" || !e.unit_id || !["work_asset_id", "work_version_id", "asset_id", "version_id"].every(
    (o) => Number.isInteger(e[o]) && Number(e[o]) > 0
  ) || !r.length || !r.every(
    (o) => b(o) && typeof o.id == "string" && typeof o.text == "string"
  ) || !n.length || !n.every(
    (o) => b(o) && typeof o.title == "string" && typeof o.description == "string" && ["reset", "match", "continue"].includes(String(o.connection)) && Number.isInteger(o.source_start) && Number(o.source_start) > 0 && Number.isInteger(o.source_end) && Number(o.source_end) >= Number(o.source_start) && Number(o.source_end) <= r.length && Number.isInteger(o.target_duration) && Number(o.target_duration) > 0
  ) ? null : t;
}
function ke(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((a) => a == null || a === ""))
    return {};
  const n = C(t.storyboard_range_start_ms), o = C(t.storyboard_range_end_ms), i = C(
    t.storyboard_soundtrack_duration_ms
  ), s = C(t.timeline_duration_ms);
  return e !== "mv" || n == null || o == null || i == null || s == null || ![n, o, i, s].every(
    Number.isInteger
  ) || n < 0 || o <= n || o > i || s !== o - n ? null : {
    storyboard_range_start_ms: n,
    storyboard_range_end_ms: o,
    storyboard_soundtrack_duration_ms: i,
    timeline_duration_ms: s
  };
}
function Oe(t) {
  const e = l(t).toLowerCase();
  return e ? te(e) ? e : null : "short";
}
function Te(t) {
  if (!b(t))
    return null;
  const e = l(t.setup), r = l(t.development), n = l(t.payoff);
  return { setup: e, development: r, payoff: n };
}
function St(t, e) {
  const r = t.trim();
  if (r)
    return r;
  const n = e.map((o) => o.description.trim()).filter(Boolean);
  return n.length > 0 ? n.join("；") : "暂无内容简介";
}
function De(t, e, r) {
  const n = t.trim();
  if (n && !et.has(n))
    return n;
  const o = [e, r[0]?.beat, r[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !et.has(s));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function Ne(t) {
  return ue.includes(t);
}
function It(t) {
  if (!b(t))
    return null;
  const e = l(t.type).toLowerCase();
  return !Pe(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: M(t.reference_keys.map(l))
  };
}
function At(t, e, r, n = !1, o = !1) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !n && !t.beat.trim() || typeof t.transition != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !b(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = x(t.duration);
  if (i == null || !he(i))
    return null;
  const s = t.material_ids.map(l);
  if (s.some((p) => !p || !r.has(p)) || new Set(s).size !== s.length)
    return null;
  const a = t.speech.map(Me);
  if (a.some((p) => !p))
    return null;
  const c = t.captions.map(Ce);
  if (c.some(
    (p) => !p || p.end_time > i
  ))
    return null;
  const u = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const m = e > 0 && !u && t.match_previous, y = t.transition.trim(), d = t.continuity_anchor.trim(), _ = bt(
    t.continuity_state
  );
  return {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: i,
    beat: t.beat.trim(),
    transition: e > 0 ? y : "",
    handoff: G(
      t.handoff,
      e > 0 || o,
      m,
      u || o
    ),
    transition_type: "none",
    transition_duration_ms: 0,
    description: t.description,
    spatial_layout: l(t.spatial_layout),
    start_framing: l(t.start_framing),
    end_framing: l(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    prompt_overrides: _e(t.prompt_overrides),
    material_ids: s,
    reference_keys: M(t.reference_keys.map(l)),
    shot_image_mode: H,
    shared_end_shot_id: "",
    match_previous: m,
    continue_previous: u,
    continuity_anchor: u ? d : "",
    continuity_state: _,
    lyric_line_indexes: wt(
      t.lyric_line_indexes
    ),
    speech: a,
    captions: c
  };
}
function wt(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, r) => e - r) : [];
}
function Me(t) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = l(t.kind).toLowerCase(), r = x(t.start_time);
  if (e !== "dialogue" && e !== "narration" || r == null || r < 0)
    return null;
  if (e === "narration") {
    const o = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: r,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete o.character_id, delete o.speaker_mode, o;
  }
  const n = l(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || n !== "visible" && n !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: e,
    text: t.text,
    start_time: r,
    character_id: t.character_id.trim(),
    speaker_mode: n,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function Ce(t) {
  if (!b(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = l(t.type).toLowerCase(), r = x(t.start_time), n = x(t.end_time);
  return !Le(e) || r == null || n == null || r < 0 || n <= r ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: r,
    end_time: n
  };
}
function Rt(t) {
  const e = b(t) ? t : {}, r = l(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: r,
    confirmed_at: r === "confirmed" ? l(e.confirmed_at) : ""
  };
}
function rt(t, e) {
  const r = l(t).toLowerCase();
  return r === "auto" || r === "off" ? r : e;
}
function Be(t) {
  const e = Bt(t);
  if (e)
    return e;
  if (!b(t))
    return "";
  const r = t.type === "doc" ? t : b(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return r ? xt(r).trim() : "";
}
function xt(t) {
  if (!b(t))
    return "";
  if (t.type === "text")
    return l(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(xt).join(e);
}
function Pe(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Le(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Fe(t) {
  return t.text.trim().length > 0;
}
function M(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function x(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const kt = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Ot(t, e) {
  const r = kt[t], n = r ? Q(e, t) : [];
  if (r && n.length > 0)
    return { [r]: n };
  const o = Lt(e);
  if (!o)
    return e;
  const i = Ft(o);
  return i && (t === "text" || Et(i.plainText)) ? { text: i.markdown } : { rich: o };
}
function Ee(t, e) {
  return Q(t, e)[0] || "";
}
function Q(t, e) {
  return Y(t, e).map((r) => r.url);
}
function Y(t, e) {
  return ze(e) ? Pt(t, e) : [];
}
function Fn(t, e) {
  if (!kt[e])
    return 0;
  const r = Q(t, e).length;
  if (!t || typeof t != "object" || Array.isArray(t))
    return r;
  const n = Number(
    t.media_count || 0
  );
  return Math.max(
    r,
    Number.isFinite(n) ? Math.trunc(n) : 0
  );
}
function ze(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function P(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return Tt(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((n) => P(n, e + 1)).filter(Boolean)[0] || "";
  if (typeof t != "object") return "";
  const r = t;
  for (const n of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const o = P(r[n], e + 1);
    if (o) return o;
  }
  return "";
}
function En(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function Ue(t) {
  const e = Ee(t, "file"), r = B(t) || Gt(e), n = r.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: r, extension: n };
}
function B(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const n = t.trim();
    return Tt(n) ? "" : n;
  }
  if (Array.isArray(t)) {
    for (const n of t) {
      const o = B(n, e + 1);
      if (o) return o;
    }
    return "";
  }
  if (typeof t != "object") return "";
  const r = t;
  for (const n of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const o = B(r[n], e + 1);
    if (o) return o;
  }
  for (const n of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const o = B(r[n], e + 1);
    if (o) return o;
  }
  return "";
}
function Tt(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ot = K, it = ot.ContentView || ot.EnergonContentView;
function Dt({
  output: t,
  fallback: e = "",
  streaming: r = !1,
  emptyText: n = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: a = "default"
}) {
  const c = $e(t, e);
  return it ? /* @__PURE__ */ f(Ve, { className: o, children: /* @__PURE__ */ f(
    it,
    {
      output: c,
      streaming: r,
      emptyText: n,
      markdownClassName: i,
      richClassName: s,
      mediaLayout: a
    }
  ) }) : e ? /* @__PURE__ */ f("div", { className: o, children: e }) : null;
}
function $e(t, e = "") {
  return zt(t) ? t : e ? { text: e } : t;
}
function Ve({
  className: t,
  children: e
}) {
  const r = (n) => {
    je(n.target) && n.stopPropagation();
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: t,
      onPointerDown: r,
      onClick: r,
      children: e
    }
  );
}
function je(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function st({
  content: t,
  summary: e,
  compact: r = !1
}) {
  const n = Ue(t), o = n.name || e || "文件", i = n.extension ? n.extension.toUpperCase() : "FILE", s = n.extension ? `${n.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ T("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ f("strong", { children: i }),
    /* @__PURE__ */ f(Z, { label: o, children: /* @__PURE__ */ f("p", { children: o }) }),
    /* @__PURE__ */ f("span", { children: "文件" })
  ] }) : /* @__PURE__ */ T("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ f("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ f(ct, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ T("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ f(Z, { label: o, children: /* @__PURE__ */ f("strong", { children: o }) }),
      /* @__PURE__ */ f("span", { children: s })
    ] }),
    n.url ? /* @__PURE__ */ T("a", { href: n.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ f(jt, { "aria-hidden": "true" }),
      /* @__PURE__ */ f("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ f("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function z({
  kind: t,
  src: e,
  poster: r
}) {
  const n = Xt(null), [o, i] = F(""), [s, a] = F(""), [c, u] = F(""), m = o === e, y = s === e, d = c === e;
  Jt(() => {
    const g = n.current;
    if (!e || !g || typeof IntersectionObserver > "u") {
      i(e);
      return;
    }
    const h = new IntersectionObserver(
      (S) => {
        S.some((w) => w.isIntersecting) && (i(e), h.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return h.observe(g), () => h.disconnect();
  }, [e]);
  function _() {
    a(e), u("");
  }
  function p() {
    a(""), u(e);
  }
  return /* @__PURE__ */ T(
    "div",
    {
      ref: n,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        y ? "is-loaded" : "is-pending",
        d ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        m && (t === "video" || !d) ? t === "image" ? /* @__PURE__ */ f(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: _,
            onError: p
          }
        ) : /* @__PURE__ */ f(
          Wt,
          {
            src: e,
            poster: r,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: _,
            onError: p
          }
        ) : null,
        d ? /* @__PURE__ */ f("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function Ye({
  kind: t,
  content: e,
  summary: r
}) {
  const n = Ot(t, e), o = r || P(e) || at(t), i = Ut(n, "storyboard") ? { text: o } : n;
  return /* @__PURE__ */ f("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ f(
    Dt,
    {
      output: i,
      fallback: o,
      emptyText: o,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function zn({
  kind: t,
  content: e,
  summary: r,
  prompt: n,
  compact: o = !1
}) {
  const i = Y(e, t), s = i.map((c) => c.url), a = s[0] || "";
  if (!o) {
    const c = t === "audio" ? $t(e) : null;
    if ((t === "image" || t === "video") && s.length > 0)
      return /* @__PURE__ */ f(
        tt,
        {
          kind: t,
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return /* @__PURE__ */ f(
        tt,
        {
          kind: "audio",
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: c || (n ? { label: "语音文本", text: n } : null),
          attachmentUrls: Y(e, "file").map(
            (m) => m.url
          )
        }
      );
    if (t === "file")
      return /* @__PURE__ */ f(st, { content: e, summary: r });
    const u = Ot(t, e);
    return /* @__PURE__ */ f(
      Dt,
      {
        output: u,
        fallback: r || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return t === "image" && a ? /* @__PURE__ */ f(z, { kind: "image", src: a }) : t === "video" && a ? /* @__PURE__ */ f(
    z,
    {
      kind: "video",
      src: a,
      poster: i[0]?.thumbnail
    }
  ) : t === "audio" ? i[0]?.thumbnail ? /* @__PURE__ */ f(z, { kind: "image", src: i[0].thumbnail }) : /* @__PURE__ */ f(Vt, { src: a }) : t === "file" ? /* @__PURE__ */ f(st, { content: e, summary: r, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ f(Ye, { kind: t, content: e, summary: r }) : /* @__PURE__ */ f("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ f("p", { children: r || P(e) || at(t) }) });
}
function Un({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ f(qt, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ f(Ht, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ f(vt, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ f(Kt, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ f(Yt, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ f(ct, { "aria-hidden": "true" });
  }
}
export {
  tn as $,
  pn as A,
  de as B,
  Ln as C,
  In as D,
  Y as E,
  Fn as F,
  zn as G,
  Un as H,
  En as I,
  q as J,
  lt as K,
  Xe as L,
  yt as M,
  Je as N,
  ln as O,
  _n as P,
  We as Q,
  Dt as R,
  ue as S,
  Mn as T,
  Rn as U,
  ee as V,
  re as W,
  Ze as X,
  rn as Y,
  on as Z,
  en as _,
  Ot as a,
  an as a0,
  dn as a1,
  v as a2,
  te as a3,
  _t as a4,
  sn as a5,
  mt as a6,
  fn as a7,
  Tn as a8,
  nn as a9,
  Qe as aa,
  Sn as ab,
  mn as ac,
  Ae as ad,
  un as ae,
  yn as af,
  we as ag,
  It as ah,
  $e as ai,
  Ve as aj,
  Bn as ak,
  bn as b,
  On as c,
  Se as d,
  Ie as e,
  Q as f,
  J as g,
  X as h,
  gn as i,
  Nn as j,
  Cn as k,
  Dn as l,
  An as m,
  be as n,
  kn as o,
  hn as p,
  Ee as q,
  xn as r,
  le as s,
  cn as t,
  ce as u,
  ut as v,
  Qt as w,
  dt as x,
  wn as y,
  Pn as z
};
