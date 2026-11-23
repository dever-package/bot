import { e as g, $ as Bt, h as Pt, F as l, _ as M, j as Lt, a0 as Ft, a1 as Et, a2 as zt, r as Ut, B as Z, v as ct, w as $t, k as Vt, X as jt } from "./asset-audio-preview-CWf3Wq_n.js";
import { j as f, a as T } from "./preloadable-B6QZqbLd.js";
import { b as ut, aI as Yt, aF as Kt, bc as vt, bd as Ht, a8 as qt, Q as Gt } from "./vendor-icons-IZIW7U43.js";
import { r as Wt, V as Xt, M as tt } from "./media-inspector-gallery-B1Jisuon.js";
import { b as Jt, a as F, d as Qt } from "./file-kind-Cq3pESGF.js";
function v(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!g(o))
      continue;
    const i = N(o.asset_id ?? o.assetId), s = mt(o.kind), a = $(o.purpose);
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
function Xe(t, e, r, n, o, i) {
  const s = new Map(
    v(e).map((p) => [
      p.asset_id,
      p
    ])
  ), a = new Map(
    r.flatMap((p) => {
      const d = N(p.refId);
      return d ? [[d, p]] : [];
    })
  ), c = [], u = (t?.parts || []).map((p) => ({ ...p })), m = /* @__PURE__ */ new Set();
  for (const [p, d] of (t?.parts || []).entries()) {
    if (d.type !== "reference" || d.ref_type !== "asset")
      continue;
    const _ = N(d.ref_id);
    if (!_ || m.has(_))
      continue;
    const h = s.get(_), y = a.get(_), b = mt(y?.kind) || h?.kind;
    if (!b)
      continue;
    const S = N(y?.versionID || d.ref_version_id), w = String(y?.title || d.label || h?.label || "").trim() || `参考素材 ${c.length + 1}`, R = dt(
      b,
      o,
      i
    ), k = $(d.purpose), A = $(
      h?.purpose
    ), I = [k, A].find(
      (Ct) => R.some((Mt) => Mt.value === Ct)
    ) || te(b, o, i), L = u[p];
    L?.type === "reference" && (L.purpose = I || void 0), c.push({
      key: h?.key || U(_),
      asset_id: _,
      ...S ? { version_id: S } : {},
      label: w,
      kind: b,
      purpose: I
    }), m.add(_);
  }
  return {
    content: t ? { ...t, parts: u } : void 0,
    references: c
  };
}
function Je(t, e) {
  return e.filter(
    (r) => r.work_types.length === 0 || r.work_types.includes(t)
  ).map((r) => ({
    key: r.key,
    label: r.name,
    acceptedKinds: [...r.media_kinds]
  }));
}
function dt(t, e, r) {
  return r.filter(
    (n) => n.media_kinds.includes(t) && (n.work_types.length === 0 || n.work_types.includes(e))
  ).map((n) => ({ value: n.key, label: n.name }));
}
function ft(t, e) {
  return e.find((r) => r.key === t);
}
function Zt(t, e) {
  return ft(t, e)?.name || t;
}
function Qe(t, e, r, n) {
  const o = r.find((s) => s.key === e);
  if (!o || n.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const a = ft(
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
      return `${o.name}必须添加“${Zt(
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
function te(t, e, r) {
  const n = dt(t, e, r);
  return r.find(
    (i) => i.default_media_kinds.includes(t) && (i.work_types.length === 0 || i.work_types.includes(e))
  )?.key || n[0]?.value || "";
}
function mt(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function N(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function ee(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const ne = 10, re = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], H = "first_last", Ze = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function oe(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function tn(t, e) {
  const r = oe(t);
  return e ? Math.max(r || 0, ne) : r;
}
function lt(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function ie(t) {
  return lt(t) || "start";
}
function en(t) {
  return ie(t) === "end" ? "lastFrame" : "firstFrame";
}
function nn(t) {
  return re.includes(t) ? t : void 0;
}
function rn(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return se();
    default:
      return [];
  }
}
function on(t, e) {
  return e + ":" + t;
}
function E(t) {
  return typeof t == "string" ? t.trim() : "";
}
function se() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function sn(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!o || typeof o != "object" || Array.isArray(o))
      continue;
    const i = o, s = lt(i.frameRole ?? i.frame_role), a = Number(i.mediaIndex ?? i.media_index);
    !s || !Number.isInteger(a) || a <= 0 || r.has(s) || n.has(a) || (r.add(s), n.add(a), e.push({ frameRole: s, mediaIndex: a }));
  }
  return e.sort((o, i) => o.mediaIndex - i.mediaIndex);
}
function an(t) {
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
function cn(t, e) {
  return t?.find((r) => r.frameRole === e)?.mediaIndex || 0;
}
function un(t, e, r) {
  const n = t[e], o = n.continue_previous ? t[e - 1] : void 0;
  return {
    start: e === 0 && r ? null : o ? { shotId: o.id, shotIndex: e - 1, role: "end" } : { shotId: n.id, shotIndex: e, role: "start" },
    end: { shotId: n.id, shotIndex: e, role: "end" }
  };
}
function dn(t, e, r, n) {
  const o = t[e], i = ae(t, e, r, n);
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
    referenceKeys: r === "start" ? O(o.reference_keys) : ce(o.reference_keys, s?.reference_keys),
    includeGlobalReferences: !1
  };
}
function ae(t, e, r, n) {
  const o = t[e];
  if (!o)
    return;
  if (r === "end")
    return e > 0 && o.continue_previous ? { id: t[e - 1].id, shotIndex: e - 1, frameRole: "end" } : { id: o.id, shotIndex: e, frameRole: "start" };
  if (!o.match_previous || e <= 0) return;
  if (o.handoff?.match_action)
    return { id: t[e - 1].id, shotIndex: e - 1, frameRole: "end" };
  const i = new Set(o.material_ids || []), s = (d) => n.filter((_) => _.type === d && i.has(_.id)).map((_) => _.id), a = s("character"), c = s("prop"), u = s("scene"), m = new Set(n.filter((d) => d.type === "scene").map((d) => d.id)), p = a.length ? a : c.length ? c : u;
  for (let d = e - 1; d >= 0; d -= 1) {
    const _ = t[d], h = t[d + 1];
    if (h.scene_index != null && _.scene_index != null && h.scene_index !== _.scene_index && !h.match_previous && !h.continue_previous) break;
    const y = _.material_ids || [], b = y.filter((S) => m.has(S));
    if (u.length && b.length && (u.length !== b.length || !u.every((S) => b.includes(S)))) break;
    if (!(!u.every((S) => y.includes(S)) || !p.some((S) => y.includes(S))))
      return { id: _.id, shotIndex: d, frameRole: "end" };
  }
}
function ce(t, e) {
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
const _t = 4, V = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function q(t) {
  if (t == null || String(t).trim() === "")
    return _t;
  const e = Number(t);
  if (!Number.isInteger(e) || !V.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function fn(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return q(t);
    } catch {
      return;
    }
}
function mn(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), r = t.map((n) => {
    const o = g(n) ? n : {}, i = q(o.seconds), s = Number(o.sort);
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
function ue(t) {
  return t.capture_duration ?? t.duration;
}
function ln(t) {
  const e = t.shots.map(ue);
  return [...new Set(e.filter(yt))].sort(
    (r, n) => r - n
  );
}
function _n(t, e) {
  const r = pt(
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
function pn(t) {
  const e = pt(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function pt(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(yt))
  ].sort((r, n) => r - n);
}
function yt(t) {
  return Number.isInteger(t) && t >= 2;
}
const j = 9, ht = 2, de = 50, et = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), fe = ["photoreal", "stylized"], yn = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, me = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], le = "16:9", _e = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], nt = {
  output_target: "shot_images",
  subtitle_mode: "off"
};
function G(t, e, r, n) {
  if (!g(t)) return;
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
function pe(t, e) {
  return (e === "video" ? t.video_prompt : e === "start" ? t.start_framing : t.end_framing)?.trim() || "";
}
function hn(t, e) {
  return t.prompt_overrides?.[e] || pe(t, e);
}
function ye(t) {
  if (!g(t)) return;
  const e = l(t.start).trim(), r = l(t.end).trim(), n = l(t.video).trim();
  return e || r || n ? { ...e && { start: e }, ...r && { end: r }, ...n && { video: n } } : void 0;
}
function he(t, e) {
  return e > 0 && t.continue_previous;
}
const be = [
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
function bn(t) {
  return Re(t, xe);
}
function gn(t, e) {
  if (!g(t) || !Array.isArray(t.materials))
    return null;
  const r = t.materials.map(It);
  if (r.some((s) => !s))
    return null;
  const n = r, o = new Set(
    n.map((s) => s.id)
  );
  if (o.size !== n.length)
    return null;
  const i = wt(t.shot, e, o);
  return i ? { shot: i, materials: n } : null;
}
function Sn(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : bt(t.shots);
}
function bt(t) {
  return t.reduce(
    (e, r) => e + Math.max(0, Number(r.duration) || 0),
    0
  );
}
function rt(t) {
  return Number.isInteger(t) && t >= ht;
}
function An(t, e) {
  const r = new Map(
    t.materials.map((n) => [n.id, n])
  );
  return e.material_ids.map((n) => r.get(n)).filter((n) => !!n);
}
function In(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: _t,
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
function wn(t, e) {
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
function Rn(t, e) {
  const r = [], n = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && r.push(o.id);
    for (const i of o.speech)
      i.character_id === e && n.push(i.id);
  }
  return { shotIds: r, speechIds: n };
}
function xn(t) {
  let e = 0;
  const r = [];
  for (const n of t.shots) {
    for (const o of [...n.speech].sort((i, s) => i.start_time - s.start_time))
      o.kind === "narration" && o.text.trim() && r.push({ speech: o, startTime: e + o.start_time, shotId: n.id });
    e += n.duration;
  }
  return r;
}
function ge(t) {
  const e = xt(t.workflow), r = v(t.references), n = new Set(r.map((s) => s.key)), o = new Set(
    t.materials.map((s) => s.id)
  ), i = t.shots.map((s, a) => {
    const c = a > 0 && !s.continuity_state.time_jump?.trim(), u = c && !!s.continue_previous, m = c && !u && !!s.match_previous;
    return {
      ...s,
      id: s.id || `shot-${a + 1}`,
      order: a + 1,
      transition: a > 0 ? s.transition.trim() : "",
      handoff: G(
        s.handoff,
        a > 0 || !!t.chapter_boundary,
        m,
        u || a === 0 && t.chapter_boundary?.connection === "continue"
      ),
      transition_type: "none",
      transition_duration_ms: 0,
      material_ids: C(s.material_ids).filter(
        (p) => o.has(p)
      ),
      reference_keys: C(s.reference_keys).filter(
        (p) => n.has(p)
      ),
      shot_image_mode: H,
      shared_end_shot_id: "",
      match_previous: m,
      continue_previous: u,
      continuity_anchor: u ? s.continuity_anchor.trim() : "",
      continuity_state: gt(
        s.continuity_state
      ),
      lyric_line_indexes: Rt(
        s.lyric_line_indexes
      )
    };
  });
  return i.forEach((s, a) => {
    const c = he(s, a);
    if (a > 0 && (c || s.match_previous && s.handoff?.match_action)) {
      const u = i[a - 1];
      s.continuity_state.facts || (s.continuity_state.entry = u.continuity_state.exit || s.continuity_state.entry), c && (s.start_framing = u.end_framing || s.start_framing);
    }
  }), {
    ...t,
    version: j,
    workflow: e,
    production_plan: W(
      t.production_plan,
      t.work_type
    ),
    target_duration: !i.length && t.screenplay ? t.target_duration : bt(i),
    target_shot_count: i.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: St(t.aspect_ratio),
    references: r,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: C(s.reference_keys).filter(
        (a) => n.has(a)
      )
    })),
    shots: i
  };
}
function gt(t) {
  const e = g(t) ? t : {};
  return {
    entry: l(e.entry).trim(),
    exit: l(e.exit).trim(),
    ...Array.isArray(e.facts) ? { facts: e.facts, time_jump: l(e.time_jump) } : {}
  };
}
function Se(t, e) {
  return t.material_ids.filter((r) => e.has(r)).sort().join(`
`);
}
function kn(t, e) {
  const r = new Map(t.shots.map((i, s) => [i.id, s])), n = new Set([...t.materials, ...e.materials].filter((i) => i.type === "scene").map((i) => i.id)), o = (i) => Se(i, n);
  return {
    ...e,
    shots: e.shots.map((i, s) => {
      const a = r.get(i.id) ?? -1, c = t.shots[a], u = t.shots[a - 1], m = e.shots[s - 1], p = u?.id !== m?.id;
      let d = !!(m && i.continue_previous), _ = !!(m && i.match_previous);
      const h = o(i), y = m ? o(m) : "", b = !!(c && h !== o(c)) || !!(u && y !== o(u)), S = i.handoff?.camera_path, w = d && !!S && !p && (!b || S !== c?.handoff?.camera_path);
      if (m) {
        const A = !!(h && h === y), I = !!(c && (i.start_framing !== c.start_framing || i.continuity_state.entry !== c.continuity_state.entry));
        !!i.continuity_state.time_jump?.trim() || !d && !_ && (!!(c?.continue_previous || c?.match_previous) || i.scene_index != null && m.scene_index != null && i.scene_index !== m.scene_index) || !w && !A && (h || y || p || I) ? (d = !1, _ = !1) : (p || b || d && I) && (d = (A || w) && !!i.continuity_state.entry.trim() && i.continuity_state.entry.trim() === m.continuity_state.exit.trim() && (i.start_framing || "").trim() === (m.end_framing || "").trim(), _ = A && !d);
      }
      let R = {};
      if (!d && (b || p) && c?.continue_previous && u && (i.continuity_state.entry === c.continuity_state.entry && c.continuity_state.entry === u.continuity_state.exit && (R.continuity_state = { ...i.continuity_state, entry: "" }), i.start_framing === c.start_framing && c.start_framing === u.end_framing)) {
        const A = { ...i.reference_contents };
        delete A.start_framing, R = { ...R, start_framing: "", reference_contents: A };
      }
      const k = s === 0 && e.chapter_boundary?.connection === "continue";
      return {
        ...i,
        ...R,
        transition: !m || p ? "" : i.transition,
        handoff: p || b && !w ? void 0 : G(
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
function On(t) {
  return t.workflow.status === "confirmed";
}
function W(t, e) {
  const r = g(t) ? t : {}, n = l(r.output_target).toLowerCase(), o = {
    output_target: _e.includes(
      n
    ) ? n : nt.output_target,
    voice_mode: r.voice_mode === "native" ? "native" : ot(r.voice_mode, "auto"),
    subtitle_mode: ot(
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
function Tn(t) {
  return {
    ...W(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video"
  };
}
function Dn(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function X(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function Nn(t) {
  return t.production_plan.output_target === "final_video";
}
function J(t) {
  return t.work_type === "mv";
}
function Cn(t) {
  return !J(t) && X(t) && t.production_plan.voice_mode === "auto" && Ae(t) > 0;
}
function Mn(t) {
  return !J(t) && X(t) && t.production_plan.voice_mode === "native";
}
function Bn(t) {
  return !J(t) && X(t) && t.production_plan.subtitle_mode === "auto" && Ie(t) > 0;
}
function Ae(t) {
  return t.shots.reduce(
    (e, r) => e + r.speech.filter(Ee).length,
    0
  );
}
function Ie(t) {
  return t.shots.reduce(
    (e, r) => e + we(r).length,
    0
  );
}
function we(t) {
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
function Pn(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Ln(t) {
  return t.summary.trim() || At("", t.shots);
}
function Fn(t, e) {
  return { ...t, style_prompt: e };
}
function St(t) {
  const e = l(t);
  return me.includes(e) ? e : le;
}
function Re(t, e) {
  return D(t, /* @__PURE__ */ new Set(), 0, e);
}
function D(t, e, r, n) {
  if (t == null || r > 10)
    return null;
  if (typeof t == "string") {
    for (const a of Bt(t)) {
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
  const s = Pe(o);
  if (s) {
    const a = D(s, e, r + 1, n);
    if (a)
      return a;
  }
  for (const a of be) {
    const c = o[a];
    if (c == null || c === t)
      continue;
    const u = D(c, e, r + 1, n);
    if (u)
      return u;
  }
  return null;
}
function xe(t) {
  const e = l(t.visual_mode).toLowerCase(), r = Te(t.work_type);
  let n;
  try {
    n = q(t.min_shot_duration);
  } catch {
    return null;
  }
  if (l(t.type).toLowerCase() !== "storyboard" || x(t.version) !== j || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ce(e) || !r || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const o = g(t.workflow) && t.workflow.status === "draft", i = t.screenplay == null ? void 0 : ke(t.screenplay);
  if (i === null) return null;
  const s = De(t.storyline);
  if (!s)
    return null;
  const a = v(t.references);
  if (a.length !== t.references.length)
    return null;
  const c = t.materials.map(It);
  if (c.some((A) => !A))
    return null;
  const u = c, m = /* @__PURE__ */ new Set();
  for (const A of u) {
    if (m.has(A.id))
      return null;
    m.add(A.id);
  }
  const p = /* @__PURE__ */ new Set(), d = g(t.chapter_boundary) && t.chapter_boundary.connection === "continue", _ = t.shots.map(
    (A, I) => wt(A, I, m, o, I === 0 && d)
  );
  if (_.some((A) => !A))
    return null;
  const h = _;
  for (const [A, I] of h.entries()) {
    if (p.has(I.id))
      return null;
    p.add(I.id);
  }
  const y = x(t.target_duration), b = x(t.target_shot_count);
  if (y == null || !Number.isInteger(y) || y < ht || b == null || !Number.isInteger(b) || b < (i && o && !h.length ? 0 : 1) || b > de)
    return null;
  const S = Oe(t, r);
  if (S === null)
    return null;
  const w = xt(t.workflow), R = At(
    l(t.summary),
    h
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
    title: Ne(t.title, R, h),
    summary: R,
    target_duration: y,
    target_shot_count: b,
    min_shot_duration: n,
    ...S,
    lyrics_lrc: r === "mv" ? l(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: s,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: St(t.aspect_ratio),
    references: a,
    materials: u,
    shots: h
  };
  return ge(k);
}
function ke(t) {
  if (!g(t)) return null;
  const { source: e, source_passages: r, parts: n } = t;
  return !g(e) || !Array.isArray(r) || !Array.isArray(n) || typeof e.unit_id != "string" || !e.unit_id || !["work_asset_id", "work_version_id", "asset_id", "version_id"].every(
    (o) => Number.isInteger(e[o]) && Number(e[o]) > 0
  ) || !r.length || !r.every(
    (o) => g(o) && typeof o.id == "string" && typeof o.text == "string"
  ) || !n.length || !n.every(
    (o) => g(o) && typeof o.title == "string" && typeof o.description == "string" && ["reset", "match", "continue"].includes(String(o.connection)) && Number.isInteger(o.source_start) && Number(o.source_start) > 0 && Number.isInteger(o.source_end) && Number(o.source_end) >= Number(o.source_start) && Number(o.source_end) <= r.length && Number.isInteger(o.target_duration) && Number(o.target_duration) > 0
  ) ? null : t;
}
function Oe(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((a) => a == null || a === ""))
    return {};
  const n = M(t.storyboard_range_start_ms), o = M(t.storyboard_range_end_ms), i = M(
    t.storyboard_soundtrack_duration_ms
  ), s = M(t.timeline_duration_ms);
  return e !== "mv" || n == null || o == null || i == null || s == null || ![n, o, i, s].every(
    Number.isInteger
  ) || n < 0 || o <= n || o > i || s !== o - n ? null : {
    storyboard_range_start_ms: n,
    storyboard_range_end_ms: o,
    storyboard_soundtrack_duration_ms: i,
    timeline_duration_ms: s
  };
}
function Te(t) {
  const e = l(t).toLowerCase();
  return e ? ee(e) ? e : null : "short";
}
function De(t) {
  if (!g(t))
    return null;
  const e = l(t.setup), r = l(t.development), n = l(t.payoff);
  return { setup: e, development: r, payoff: n };
}
function At(t, e) {
  const r = t.trim();
  if (r)
    return r;
  const n = e.map((o) => o.description.trim()).filter(Boolean);
  return n.length > 0 ? n.join("；") : "暂无内容简介";
}
function Ne(t, e, r) {
  const n = t.trim();
  if (n && !et.has(n))
    return n;
  const o = [e, r[0]?.beat, r[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !et.has(s));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function Ce(t) {
  return fe.includes(t);
}
function It(t) {
  if (!g(t))
    return null;
  const e = l(t.type).toLowerCase();
  return !Le(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: C(t.reference_keys.map(l))
  };
}
function wt(t, e, r, n = !1, o = !1) {
  if (!g(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !n && !t.beat.trim() || typeof t.transition != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !g(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = x(t.duration);
  if (i == null || !rt(i))
    return null;
  const s = x(t.capture_duration);
  if (t.capture_duration != null && (s == null || !rt(s) || s < i))
    return null;
  const a = t.material_ids.map(l);
  if (a.some((y) => !y || !r.has(y)) || new Set(a).size !== a.length)
    return null;
  const c = t.speech.map(Me);
  if (c.some((y) => !y))
    return null;
  const u = t.captions.map(Be);
  if (u.some(
    (y) => !y || y.end_time > i
  ))
    return null;
  const m = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const p = e > 0 && !m && t.match_previous, d = t.transition.trim(), _ = t.continuity_anchor.trim(), h = gt(
    t.continuity_state
  );
  return {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: i,
    capture_duration: s ?? void 0,
    beat: t.beat.trim(),
    transition: e > 0 ? d : "",
    handoff: G(
      t.handoff,
      e > 0 || o,
      p,
      m || o
    ),
    transition_type: "none",
    transition_duration_ms: 0,
    description: t.description,
    spatial_layout: l(t.spatial_layout),
    start_framing: l(t.start_framing),
    end_framing: l(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    prompt_overrides: ye(t.prompt_overrides),
    material_ids: a,
    reference_keys: C(t.reference_keys.map(l)),
    shot_image_mode: H,
    shared_end_shot_id: "",
    match_previous: p,
    continue_previous: m,
    continuity_anchor: m ? _ : "",
    continuity_state: h,
    lyric_line_indexes: Rt(
      t.lyric_line_indexes
    ),
    speech: c,
    captions: u
  };
}
function Rt(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, r) => e - r) : [];
}
function Me(t) {
  if (!g(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
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
function Be(t) {
  if (!g(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = l(t.type).toLowerCase(), r = x(t.start_time), n = x(t.end_time);
  return !Fe(e) || r == null || n == null || r < 0 || n <= r ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: r,
    end_time: n
  };
}
function xt(t) {
  const e = g(t) ? t : {}, r = l(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: r,
    confirmed_at: r === "confirmed" ? l(e.confirmed_at) : ""
  };
}
function ot(t, e) {
  const r = l(t).toLowerCase();
  return r === "auto" || r === "off" ? r : e;
}
function Pe(t) {
  const e = Pt(t);
  if (e)
    return e;
  if (!g(t))
    return "";
  const r = t.type === "doc" ? t : g(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return r ? kt(r).trim() : "";
}
function kt(t) {
  if (!g(t))
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
  return t.content.map(kt).join(e);
}
function Le(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Fe(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Ee(t) {
  return t.text.trim().length > 0;
}
function C(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function x(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
const Ot = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Tt(t, e) {
  const r = Ot[t], n = r ? Q(e, t) : [];
  if (r && n.length > 0)
    return { [r]: n };
  const o = Ft(e);
  if (!o)
    return e;
  const i = Et(o);
  return i && (t === "text" || zt(i.plainText)) ? { text: i.markdown } : { rich: o };
}
function ze(t, e) {
  return Q(t, e)[0] || "";
}
function Q(t, e) {
  return Y(t, e).map((r) => r.url);
}
function Y(t, e) {
  return Ue(e) ? Lt(t, e) : [];
}
function En(t, e) {
  if (!Ot[e])
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
function Ue(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function P(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return Dt(t) ? "" : t.trim();
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
function zn(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function $e(t) {
  const e = ze(t, "file"), r = B(t) || Wt(e), n = r.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: r, extension: n };
}
function B(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const n = t.trim();
    return Dt(n) ? "" : n;
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
function Dt(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const it = K, st = it.ContentView || it.EnergonContentView;
function Nt({
  output: t,
  fallback: e = "",
  streaming: r = !1,
  emptyText: n = "暂无内容",
  className: o,
  markdownClassName: i,
  richClassName: s,
  mediaLayout: a = "default"
}) {
  const c = Ve(t, e);
  return st ? /* @__PURE__ */ f(je, { className: o, children: /* @__PURE__ */ f(
    st,
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
function Ve(t, e = "") {
  return Ut(t) ? t : e ? { text: e } : t;
}
function je({
  className: t,
  children: e
}) {
  const r = (n) => {
    Ye(n.target) && n.stopPropagation();
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
function Ye(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function at({
  content: t,
  summary: e,
  compact: r = !1
}) {
  const n = $e(t), o = n.name || e || "文件", i = n.extension ? n.extension.toUpperCase() : "FILE", s = n.extension ? `${n.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ T("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ f("strong", { children: i }),
    /* @__PURE__ */ f(Z, { label: o, children: /* @__PURE__ */ f("p", { children: o }) }),
    /* @__PURE__ */ f("span", { children: "文件" })
  ] }) : /* @__PURE__ */ T("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ f("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ f(ut, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ T("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ f(Z, { label: o, children: /* @__PURE__ */ f("strong", { children: o }) }),
      /* @__PURE__ */ f("span", { children: s })
    ] }),
    n.url ? /* @__PURE__ */ T("a", { href: n.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ f(Yt, { "aria-hidden": "true" }),
      /* @__PURE__ */ f("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ f("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function z({
  kind: t,
  src: e,
  poster: r
}) {
  const n = Jt(null), [o, i] = F(""), [s, a] = F(""), [c, u] = F(""), m = o === e, p = s === e, d = c === e;
  Qt(() => {
    const y = n.current;
    if (!e || !y || typeof IntersectionObserver > "u") {
      i(e);
      return;
    }
    const b = new IntersectionObserver(
      (S) => {
        S.some((w) => w.isIntersecting) && (i(e), b.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return b.observe(y), () => b.disconnect();
  }, [e]);
  function _() {
    a(e), u("");
  }
  function h() {
    a(""), u(e);
  }
  return /* @__PURE__ */ T(
    "div",
    {
      ref: n,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        p ? "is-loaded" : "is-pending",
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
            onError: h
          }
        ) : /* @__PURE__ */ f(
          Xt,
          {
            src: e,
            poster: r,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: _,
            onError: h
          }
        ) : null,
        d ? /* @__PURE__ */ f("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function Ke({
  kind: t,
  content: e,
  summary: r
}) {
  const n = Tt(t, e), o = r || P(e) || ct(t), i = $t(n, "storyboard") ? { text: o } : n;
  return /* @__PURE__ */ f("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ f(
    Nt,
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
function Un({
  kind: t,
  content: e,
  summary: r,
  prompt: n,
  compact: o = !1
}) {
  const i = Y(e, t), s = i.map((c) => c.url), a = s[0] || "";
  if (!o) {
    const c = t === "audio" ? Vt(e) : null;
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
      return /* @__PURE__ */ f(at, { content: e, summary: r });
    const u = Tt(t, e);
    return /* @__PURE__ */ f(
      Nt,
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
  ) : t === "audio" ? i[0]?.thumbnail ? /* @__PURE__ */ f(z, { kind: "image", src: i[0].thumbnail }) : /* @__PURE__ */ f(jt, { src: a }) : t === "file" ? /* @__PURE__ */ f(at, { content: e, summary: r, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ f(Ke, { kind: t, content: e, summary: r }) : /* @__PURE__ */ f("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ f("p", { children: r || P(e) || ct(t) }) });
}
function $n({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ f(Gt, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ f(qt, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ f(Ht, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ f(vt, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ f(Kt, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ f(ut, { "aria-hidden": "true" });
  }
}
export {
  en as $,
  yn as A,
  me as B,
  Fn as C,
  In as D,
  Y as E,
  En as F,
  Un as G,
  $n as H,
  zn as I,
  q as J,
  _t as K,
  Je as L,
  ht as M,
  Qe as N,
  _n as O,
  pn as P,
  Xe as Q,
  Nt as R,
  fe as S,
  Mn as T,
  xn as U,
  ne as V,
  oe as W,
  tn as X,
  on as Y,
  sn as Z,
  nn as _,
  Tt as a,
  cn as a0,
  fn as a1,
  v as a2,
  ee as a3,
  pt as a4,
  an as a5,
  lt as a6,
  mn as a7,
  Dn as a8,
  rn as a9,
  Ze as aa,
  An as ab,
  ln as ac,
  ue as ad,
  we as ae,
  dn as af,
  hn as ag,
  Re as ah,
  It as ai,
  Ve as aj,
  je as ak,
  Pn as al,
  gn as b,
  Tn as c,
  Ae as d,
  Ie as e,
  Q as f,
  J as g,
  X as h,
  Sn as i,
  Cn as j,
  Bn as k,
  Nn as l,
  wn as m,
  ge as n,
  On as o,
  bn as p,
  ze as q,
  kn as r,
  pe as s,
  un as t,
  de as u,
  dt as v,
  Zt as w,
  ft as x,
  Rn as y,
  Ln as z
};
