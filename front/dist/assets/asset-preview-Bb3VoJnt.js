import { k as S, a1 as Ot, j as Dt, K as h, a2 as P, a3 as Nt, B as G, a as et, a4 as nt, w as rt, y as Mt, I as it, a5 as W, m as Pt, a0 as Bt } from "./asset-audio-preview-Cezm24us.js";
import { a as O, j as f } from "./space-storyboard-material-ECvLpyk_.js";
import { b as ot, aJ as Ct, aH as Lt, bd as Et, be as Ft, a9 as $t, V as zt } from "./vendor-icons-BZHLe0mm.js";
import { V as Ut, M as J } from "./media-inspector-gallery-BR6rzcOx.js";
import { b as Vt, a as C, d as Yt } from "./file-kind-Cq3pESGF.js";
function Y(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!S(i))
      continue;
    const o = N(i.asset_id ?? i.assetId), c = ct(i.kind), s = z(i.purpose);
    if (!o || !c || !s || r.has(o))
      continue;
    let a = String(i.key || "").trim() || $(o);
    if (n.has(a) && (a = $(o)), n.has(a))
      continue;
    const l = N(i.version_id ?? i.versionId), d = String(i.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: a,
      asset_id: o,
      ...l ? { version_id: l } : {},
      label: d,
      kind: c,
      purpose: s
    }), n.add(a), r.add(o);
  }
  return e;
}
function Ce(t, e, n, r, i, o) {
  const c = new Map(
    Y(e).map((p) => [
      p.asset_id,
      p
    ])
  ), s = new Map(
    n.flatMap((p) => {
      const m = N(p.refId);
      return m ? [[m, p]] : [];
    })
  ), a = [], l = (t?.parts || []).map((p) => ({ ...p })), d = /* @__PURE__ */ new Set();
  for (const [p, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const y = N(m.ref_id);
    if (!y || d.has(y))
      continue;
    const u = c.get(y), _ = s.get(y), b = ct(_?.kind) || u?.kind;
    if (!b)
      continue;
    const I = N(_?.versionID || m.ref_version_id), R = String(_?.title || m.label || u?.label || "").trim() || `参考素材 ${a.length + 1}`, A = st(
      b,
      i,
      o
    ), g = z(m.purpose), w = z(
      u?.purpose
    ), k = [g, w].find(
      (Tt) => A.some((kt) => kt.value === Tt)
    ) || jt(b, i, o), B = l[p];
    B?.type === "reference" && (B.purpose = k || void 0), a.push({
      key: u?.key || $(y),
      asset_id: y,
      ...I ? { version_id: I } : {},
      label: R,
      kind: b,
      purpose: k
    }), d.add(y);
  }
  return {
    content: t ? { ...t, parts: l } : void 0,
    references: a
  };
}
function Le(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function st(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function at(t, e) {
  return e.find((n) => n.key === t);
}
function Kt(t, e) {
  return at(t, e)?.name || t;
}
function Ee(t, e, n, r) {
  const i = n.find((c) => c.key === e);
  if (!i || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const o = /* @__PURE__ */ new Map();
  for (const c of t) {
    const s = at(
      c.purpose,
      r
    );
    if (!s)
      return `参考素材“${c.label}”的用途无效`;
    if (!s.media_kinds.includes(c.kind))
      return `参考素材“${c.label}”的类型不支持用途“${s.name}”`;
    if (s.work_types.length > 0 && !s.work_types.includes(e))
      return `当前作品类型不支持“${c.label}”的用途“${s.name}”`;
    const a = (o.get(c.purpose) || 0) + 1;
    if (o.set(c.purpose, a), s.max_count > 0 && a > s.max_count)
      return `用途“${s.name}”最多只能选择 ${s.max_count} 个素材`;
  }
  for (const c of i.required_reference_purposes)
    if (!o.get(c))
      return `${i.name}必须添加“${Kt(
        c,
        r
      )}”`;
  return "";
}
function $(t) {
  return `ref-${t}`;
}
function z(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function jt(t, e, n) {
  const r = st(t, e, n);
  return n.find(
    (o) => o.default_media_kinds.includes(t) && (o.work_types.length === 0 || o.work_types.includes(e))
  )?.key || r[0]?.value || "";
}
function ct(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function N(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function qt(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Ht = 8, vt = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], ut = "first_last", Fe = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function Gt(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function $e(t, e) {
  const n = Gt(t);
  return e ? Math.max(n || 0, Ht) : n;
}
function dt(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function Wt(t) {
  return dt(t) || "start";
}
function ze(t) {
  return Wt(t) === "end" ? "lastFrame" : "firstFrame";
}
function Ue(t) {
  return vt.includes(t) ? t : void 0;
}
function Jt(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return Xt();
    default:
      return [];
  }
}
function K(t) {
  const e = ut, n = t.continue_previous ? "last_frame" : e;
  return {
    mode: e,
    nodeMode: n,
    frameMediaItems: Jt(n),
    referenceMode: "frames"
  };
}
function ft(t) {
  return t.map(K);
}
function L(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Xt() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function Ve(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!i || typeof i != "object" || Array.isArray(i))
      continue;
    const o = i, c = dt(o.frameRole ?? o.frame_role), s = Number(o.mediaIndex ?? o.media_index);
    !c || !Number.isInteger(s) || s <= 0 || n.has(c) || r.has(s) || (n.add(c), r.add(s), e.push({ frameRole: c, mediaIndex: s }));
  }
  return e.sort((i, o) => i.mediaIndex - o.mediaIndex);
}
function Ye(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = L(n.prompt);
    if (!r)
      return;
    const i = L(n.title);
    return {
      title: i || "画面",
      description: L(n.description) || i || r,
      prompt: r
    };
  }).filter((e) => !!e) : [];
}
function E(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function Ke(t, e, n, r) {
  const i = t[e], o = Qt(t, e, n, r);
  if (!i || !o)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: T(i?.material_ids),
      referenceKeys: T(i?.reference_keys),
      includeGlobalReferences: !0
    };
  const c = t[o.shotIndex];
  return {
    anchorID: o.id,
    anchorFrameRole: o.frameRole,
    anchorShotIndex: o.shotIndex,
    // A close-up may not show the whole subject or environment. A new
    // framing still needs the current identity, prop and scene references.
    materialIDs: T(i.material_ids).filter(
      (s) => n === "start" || !c?.material_ids?.includes(s)
    ),
    referenceKeys: n === "start" ? T(i.reference_keys) : Zt(i.reference_keys, c?.reference_keys),
    includeGlobalReferences: !1
  };
}
function Qt(t, e, n, r) {
  const i = t[e];
  if (!i)
    return;
  const o = ft(t);
  if (n === "end" && !i.continue_previous)
    return E(o[e]?.frameMediaItems, "start") ? { id: i.id, shotIndex: e, frameRole: "start" } : void 0;
  if (n === "start" && !i.match_previous && !i.continue_previous || e <= 0)
    return;
  const c = new Set(i.material_ids || []), s = (u) => r.filter((_) => _.type === u && c.has(_.id)).map((_) => _.id), a = s("character"), l = s("prop"), d = s("scene"), p = new Set(r.filter((u) => u.type === "scene").map((u) => u.id)), m = a.length ? a : l.length ? l : d, y = n === "start" && i.match_previous && !i.continue_previous;
  for (let u = e - 1; u >= 0; u -= 1) {
    if (y) {
      const b = t[u], I = t[u + 1];
      if (I.scene_index != null && b.scene_index != null && I.scene_index !== b.scene_index && !I.match_previous && !I.continue_previous) break;
      const R = b.material_ids || [], A = R.filter((g) => p.has(g));
      if (d.length && A.length && (d.length !== A.length || !d.every((g) => A.includes(g)))) break;
      if (!d.every((g) => R.includes(g)) || !m.some((g) => R.includes(g))) continue;
    }
    const _ = o[u];
    if (E(_?.frameMediaItems, "end"))
      return {
        id: t[u].id,
        shotIndex: u,
        frameRole: "end"
      };
    if (E(_?.frameMediaItems, "start"))
      return {
        id: t[u].id,
        shotIndex: u,
        frameRole: "start"
      };
    if (!t[u].continue_previous)
      return;
  }
}
function Zt(t, e) {
  const n = new Set(T(e));
  return T(t).filter(
    (r) => !n.has(r)
  );
}
function T(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
const lt = 4, U = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function j(t) {
  if (t == null || String(t).trim() === "")
    return lt;
  const e = Number(t);
  if (!Number.isInteger(e) || !U.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function je(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return j(t);
    } catch {
      return;
    }
}
function qe(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const i = S(r) ? r : {}, o = j(i.seconds), c = Number(i.sort);
    if (e.has(o) || !Number.isInteger(c))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(o), {
      seconds: o,
      name: String(i.name || "").trim() || `${o} 秒`,
      sort: c
    };
  });
  if (n.length !== U.size || [...U].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, i) => r.sort - i.sort);
}
function He(t) {
  const e = t.shots.map((n) => Number(n.duration));
  return [...new Set(e.filter(_t))].sort(
    (n, r) => n - r
  );
}
function ve(t, e) {
  const n = mt(
    e
  );
  return n.length === 0 ? t : t.filter((r) => {
    const i = new Set(
      (r.supported_options?.duration || []).map(
        (o) => String(o).trim()
      )
    );
    return n.every((o) => i.has(String(o)));
  });
}
function Ge(t) {
  const e = mt(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function mt(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(_t))
  ].sort((n, r) => n - r);
}
function _t(t) {
  return Number.isInteger(t) && t >= 2;
}
const V = 9, pt = 2, te = 50, X = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), ee = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], We = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, ne = ["photoreal", "stylized"], Je = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, re = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], ie = "16:9", oe = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], Q = {
  output_target: "shot_images",
  subtitle_mode: "off"
};
function se(t, e) {
  return e > 0 && t.continue_previous;
}
const ae = [
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
function Xe(t) {
  return _e(t, pe);
}
function Qe(t, e) {
  if (!S(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(It);
  if (n.some((c) => !c))
    return null;
  const r = n, i = new Set(
    r.map((c) => c.id)
  );
  if (i.size !== r.length)
    return null;
  const o = At(t.shot, e, i);
  return o ? { shot: o, materials: r } : null;
}
function Ze(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : yt(t.shots);
}
function yt(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function ce(t) {
  return Number.isInteger(t) && t >= pt;
}
function tn(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function en(t) {
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
    shot_image_mode: ut,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function nn(t, e) {
  const n = new Set(t.map((o) => o.id));
  let r = t.filter((o) => o.type === e).length + 1, i = `${e}-${r}`;
  for (; n.has(i); )
    r += 1, i = `${e}-${r}`;
  return {
    id: i,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function rn(t, e) {
  const n = [], r = [];
  for (const i of t.shots) {
    i.material_ids.includes(e) && n.push(i.id);
    for (const o of i.speech)
      o.character_id === e && r.push(o.id);
  }
  return { shotIds: n, speechIds: r };
}
function on(t, e = "dialogue") {
  const n = new Set(t.speech.map((o) => o.id));
  let r = t.speech.length + 1, i = `${t.id}-speech-${r}`;
  for (; n.has(i); )
    r += 1, i = `${t.id}-speech-${r}`;
  return {
    id: i,
    kind: e,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...e === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function sn(t) {
  let e = 0;
  const n = [];
  for (const [r, i] of t.shots.entries()) {
    r > 0 && i.transition_type !== "none" && (e -= i.transition_duration_ms / 1e3);
    for (const o of [...i.speech].sort((c, s) => c.start_time - s.start_time))
      o.kind === "narration" && o.text.trim() && n.push({ speech: o, startTime: e + o.start_time, shotId: i.id });
    e += i.duration;
  }
  return n;
}
function an(t) {
  const e = new Set(t.captions.map((i) => i.id));
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
function ue(t) {
  const e = wt(t.workflow), n = Y(t.references), r = new Set(n.map((s) => s.key)), i = new Set(
    t.materials.map((s) => s.id)
  ), o = t.shots.map((s, a) => {
    const l = a > 0 ? gt(s.transition_type) : "none", d = Math.round(
      Number(s.transition_duration_ms)
    ), p = a > 0 && !!s.continue_previous, m = a > 0 && !p && !!s.match_previous;
    return {
      ...s,
      id: s.id || `shot-${a + 1}`,
      order: a + 1,
      transition: a > 0 ? s.transition.trim() : "",
      transition_type: l,
      transition_duration_ms: l !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(d) ? d : 100
        )
      ) : 0,
      material_ids: M(s.material_ids).filter(
        (y) => i.has(y)
      ),
      reference_keys: M(s.reference_keys).filter(
        (y) => r.has(y)
      ),
      shot_image_mode: K({
        ...s,
        continue_previous: p
      }).mode,
      shared_end_shot_id: s.shot_image_mode === "next_first" && s.shared_end_shot_id || "",
      match_previous: m,
      continue_previous: p,
      continuity_anchor: p ? s.continuity_anchor.trim() : "",
      continuity_state: ht(
        s.continuity_state
      ),
      lyric_line_indexes: Rt(
        s.lyric_line_indexes
      )
    };
  });
  o.forEach((s, a) => {
    if (se(s, a)) {
      const l = o[a - 1];
      s.continuity_state.entry = l.continuity_state.exit || s.continuity_state.entry, s.start_framing = l.end_framing || s.start_framing, s.transition_type = "none", s.transition_duration_ms = 0;
    }
  });
  const c = ft(o);
  return o.forEach((s, a) => {
    s.shot_image_mode = c[a].mode;
  }), {
    ...t,
    version: V,
    workflow: e,
    production_plan: q(
      t.production_plan,
      t.work_type
    ),
    target_duration: !o.length && t.screenplay ? t.target_duration : yt(o),
    target_shot_count: o.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: bt(t.aspect_ratio),
    references: n,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: M(s.reference_keys).filter(
        (a) => r.has(a)
      )
    })),
    shots: o
  };
}
function ht(t) {
  const e = S(t) ? t : {};
  return {
    entry: h(e.entry).trim(),
    exit: h(e.exit).trim()
  };
}
function de(t, e) {
  return t.material_ids.filter((n) => e.has(n)).sort().join(`
`);
}
function cn(t, e) {
  const n = new Map(t.shots.map((o, c) => [o.id, c])), r = new Set([...t.materials, ...e.materials].filter((o) => o.type === "scene").map((o) => o.id)), i = (o) => de(o, r);
  return {
    ...e,
    shots: e.shots.map((o, c) => {
      const s = n.get(o.id) ?? -1, a = t.shots[s], l = t.shots[s - 1], d = e.shots[c - 1], p = l?.id !== d?.id;
      let m = !!(d && o.continue_previous), y = !!(d && o.match_previous);
      const u = i(o), _ = d ? i(d) : "", b = !!(a && u !== i(a)) || !!(l && _ !== i(l));
      if (d) {
        const A = !!(u && u === _), g = !!(a && o.camera_instruction !== a.camera_instruction), w = !!(a && (o.spatial_layout !== a.spatial_layout || o.description !== a.description)), k = !!(a && (g || w || o.start_framing !== a.start_framing || o.continuity_state.entry !== a.continuity_state.entry));
        !m && !y && (!!(a?.continue_previous || a?.match_previous) || o.scene_index != null && d.scene_index != null && o.scene_index !== d.scene_index) || !A && (u || _ || p || k) ? (m = !1, y = !1) : (p || b || m && k) && (m = A && !g && !w && !!o.continuity_state.entry.trim() && o.continuity_state.entry.trim() === d.continuity_state.exit.trim() && (o.start_framing || "").trim() === (d.end_framing || "").trim(), y = A && !m);
      }
      let I = {};
      if (!m && (b || p) && a?.continue_previous && l && (o.continuity_state.entry === a.continuity_state.entry && a.continuity_state.entry === l.continuity_state.exit && (I.continuity_state = { ...o.continuity_state, entry: "" }), o.start_framing === a.start_framing && a.start_framing === l.end_framing)) {
        const A = { ...o.reference_contents };
        delete A.start_framing, I = { ...I, start_framing: "", reference_contents: A };
      }
      const R = !d || p || m;
      return {
        ...o,
        ...I,
        transition: !d || p ? "" : o.transition,
        transition_type: R ? "none" : o.transition_type,
        transition_duration_ms: R ? 0 : o.transition_duration_ms,
        match_previous: !m && y,
        continue_previous: m,
        continuity_anchor: m ? o.continuity_anchor : ""
      };
    })
  };
}
function un(t) {
  return t.workflow.status === "confirmed";
}
function q(t, e) {
  const n = S(t) ? t : {}, r = h(n.output_target).toLowerCase(), i = {
    output_target: oe.includes(
      r
    ) ? r : Q.output_target,
    voice_mode: n.voice_mode === "native" ? "native" : Z(n.voice_mode, "auto"),
    subtitle_mode: Z(
      n.subtitle_mode,
      Q.subtitle_mode
    ),
    shot_visual_strategy: "auto"
  };
  return e === "mv" ? {
    ...i,
    voice_mode: "off",
    subtitle_mode: "off"
  } : i;
}
function dn(t) {
  return {
    ...q(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video"
  };
}
function fn(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function H(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ln(t) {
  return t.production_plan.output_target === "final_video";
}
function v(t) {
  return t.work_type === "mv";
}
function mn(t) {
  return !v(t) && H(t) && t.production_plan.voice_mode === "auto" && fe(t) > 0;
}
function _n(t) {
  return !v(t) && H(t) && t.production_plan.voice_mode === "native";
}
function pn(t) {
  return !v(t) && H(t) && t.production_plan.subtitle_mode === "auto" && le(t) > 0;
}
function fe(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(ke).length,
    0
  );
}
function le(t) {
  return t.shots.reduce(
    (e, n) => e + me(n).length,
    0
  );
}
function me(t) {
  const e = t.speech.filter((r) => r.subtitle_enabled && !!r.text.trim()).map((r) => ({
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
    (r, i) => r.start_time - i.start_time
  );
}
function yn(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function hn(t) {
  return t.summary.trim() || St("", t.shots);
}
function bn(t, e) {
  return { ...t, style_prompt: e };
}
function bt(t) {
  const e = h(t);
  return re.includes(e) ? e : ie;
}
function gt(t) {
  const e = h(t);
  return ee.includes(e) ? e : "none";
}
function _e(t, e) {
  return D(t, /* @__PURE__ */ new Set(), 0, e);
}
function D(t, e, n, r) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const s of Ot(t)) {
      const a = D(s, e, n + 1, r);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const s of t) {
      const a = D(s, e, n + 1, r);
      if (a)
        return a;
    }
    return null;
  }
  const i = t, o = r(i);
  if (o)
    return o;
  const c = we(i);
  if (c) {
    const s = D(c, e, n + 1, r);
    if (s)
      return s;
  }
  for (const s of ae) {
    const a = i[s];
    if (a == null || a === t)
      continue;
    const l = D(a, e, n + 1, r);
    if (l)
      return l;
  }
  return null;
}
function pe(t) {
  const e = h(t.visual_mode).toLowerCase(), n = be(t.work_type);
  let r;
  try {
    r = j(t.min_shot_duration);
  } catch {
    return null;
  }
  if (h(t.type).toLowerCase() !== "storyboard" || x(t.version) !== V || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ie(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const i = S(t.workflow) && t.workflow.status === "draft", o = t.screenplay == null ? void 0 : ye(t.screenplay);
  if (o === null) return null;
  const c = ge(t.storyline);
  if (!c)
    return null;
  const s = Y(t.references);
  if (s.length !== t.references.length)
    return null;
  const a = t.materials.map(It);
  if (a.some((g) => !g))
    return null;
  const l = a, d = /* @__PURE__ */ new Set();
  for (const g of l) {
    if (d.has(g.id))
      return null;
    d.add(g.id);
  }
  const p = /* @__PURE__ */ new Set(), m = t.shots.map(
    (g, w) => At(g, w, d, i)
  );
  if (m.some((g) => !g))
    return null;
  const y = m;
  for (const [g, w] of y.entries()) {
    if (p.has(w.id))
      return null;
    p.add(w.id);
  }
  const u = x(t.target_duration), _ = x(t.target_shot_count);
  if (u == null || !Number.isInteger(u) || u < pt || _ == null || !Number.isInteger(_) || _ < (o && i && !y.length ? 0 : 1) || _ > te)
    return null;
  const b = he(t, n);
  if (b === null)
    return null;
  const I = wt(t.workflow), R = St(
    h(t.summary),
    y
  ), A = {
    ...t,
    type: "storyboard",
    version: V,
    work_type: n,
    workflow: I,
    screenplay: o,
    production_plan: q(
      t.production_plan,
      n
    ),
    title: Se(t.title, R, y),
    summary: R,
    target_duration: u,
    target_shot_count: _,
    min_shot_duration: r,
    ...b,
    lyrics_lrc: n === "mv" ? h(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: c,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: bt(t.aspect_ratio),
    references: s,
    materials: l,
    shots: y
  };
  return ue(A);
}
function ye(t) {
  if (!S(t)) return null;
  const { source: e, source_passages: n, parts: r } = t;
  return !S(e) || !Array.isArray(n) || !Array.isArray(r) || typeof e.unit_id != "string" || !e.unit_id || !["work_asset_id", "work_version_id", "asset_id", "version_id"].every(
    (i) => Number.isInteger(e[i]) && Number(e[i]) > 0
  ) || !n.length || !n.every(
    (i) => S(i) && typeof i.id == "string" && typeof i.text == "string"
  ) || !r.length || !r.every(
    (i) => S(i) && typeof i.title == "string" && typeof i.description == "string" && ["reset", "match", "continue"].includes(String(i.connection)) && Number.isInteger(i.source_start) && Number(i.source_start) > 0 && Number.isInteger(i.source_end) && Number(i.source_end) >= Number(i.source_start) && Number(i.source_end) <= n.length && Number.isInteger(i.target_duration) && Number(i.target_duration) > 0
  ) ? null : t;
}
function he(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((s) => s == null || s === ""))
    return {};
  const r = P(t.storyboard_range_start_ms), i = P(t.storyboard_range_end_ms), o = P(
    t.storyboard_soundtrack_duration_ms
  ), c = P(t.timeline_duration_ms);
  return e !== "mv" || r == null || i == null || o == null || c == null || ![r, i, o, c].every(
    Number.isInteger
  ) || r < 0 || i <= r || i > o || c !== i - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: i,
    storyboard_soundtrack_duration_ms: o,
    timeline_duration_ms: c
  };
}
function be(t) {
  const e = h(t).toLowerCase();
  return e ? qt(e) ? e : null : "short";
}
function ge(t) {
  if (!S(t))
    return null;
  const e = h(t.setup), n = h(t.development), r = h(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function St(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((i) => i.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Se(t, e, n) {
  const r = t.trim();
  if (r && !X.has(r))
    return r;
  const i = [e, n[0]?.beat, n[0]?.description].map((c) => String(c || "").trim()).find((c) => c && !X.has(c));
  if (!i)
    return "分镜脚本";
  const o = i.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(o).slice(0, 24).join("") || "分镜脚本";
}
function Ie(t) {
  return ne.includes(t);
}
function It(t) {
  if (!S(t))
    return null;
  const e = h(t.type).toLowerCase();
  return !xe(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: M(t.reference_keys.map(h))
  };
}
function At(t, e, n, r = !1) {
  if (!S(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !r && !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !S(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = x(t.duration);
  if (i == null || !ce(i))
    return null;
  const o = t.material_ids.map(h);
  if (o.some((b) => !b || !n.has(b)) || new Set(o).size !== o.length)
    return null;
  const c = t.speech.map(Ae);
  if (c.some((b) => !b))
    return null;
  const s = t.captions.map(Re);
  if (s.some(
    (b) => !b || b.end_time > i
  ))
    return null;
  const a = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const l = e > 0 && !a && t.match_previous, d = K({
    shot_image_mode: t.shot_image_mode,
    continue_previous: a
  }).mode, p = t.transition.trim(), m = t.continuity_anchor.trim(), y = ht(
    t.continuity_state
  ), u = gt(
    t.transition_type
  ), _ = x(t.transition_duration_ms);
  return u !== t.transition_type || _ == null || !Number.isInteger(_) || _ < 0 || _ > 5e3 || e === 0 && (u !== "none" || _ !== 0) || e > 0 && u === "none" && _ !== 0 || e > 0 && u !== "none" && _ < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: i,
    beat: t.beat.trim(),
    transition: e > 0 ? p : "",
    transition_type: e > 0 ? u : "none",
    transition_duration_ms: e > 0 && u !== "none" ? _ : 0,
    description: t.description,
    spatial_layout: h(t.spatial_layout),
    start_framing: h(t.start_framing),
    end_framing: h(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: M(t.reference_keys.map(h)),
    shot_image_mode: d,
    shared_end_shot_id: d === "next_first" ? h(t.shared_end_shot_id) : "",
    match_previous: l,
    continue_previous: a,
    continuity_anchor: a ? m : "",
    continuity_state: y,
    lyric_line_indexes: Rt(
      t.lyric_line_indexes
    ),
    speech: c,
    captions: s
  };
}
function Rt(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, n) => e - n) : [];
}
function Ae(t) {
  if (!S(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = h(t.kind).toLowerCase(), n = x(t.start_time);
  if (e !== "dialogue" && e !== "narration" || n == null || n < 0)
    return null;
  if (e === "narration") {
    const i = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: n,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete i.character_id, delete i.speaker_mode, i;
  }
  const r = h(t.speaker_mode).toLowerCase();
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
function Re(t) {
  if (!S(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = h(t.type).toLowerCase(), n = x(t.start_time), r = x(t.end_time);
  return !Te(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function wt(t) {
  const e = S(t) ? t : {}, n = h(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? h(e.confirmed_at) : ""
  };
}
function Z(t, e) {
  const n = h(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function we(t) {
  const e = Dt(t);
  if (e)
    return e;
  if (!S(t))
    return "";
  const n = t.type === "doc" ? t : S(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? xt(n).trim() : "";
}
function xt(t) {
  if (!S(t))
    return "";
  if (t.type === "text")
    return h(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(xt).join(e);
}
function xe(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Te(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function ke(t) {
  return t.text.trim().length > 0;
}
function M(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function x(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
function tt({
  content: t,
  summary: e,
  compact: n = !1
}) {
  const r = Nt(t), i = r.name || e || "文件", o = r.extension ? r.extension.toUpperCase() : "FILE", c = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return n ? /* @__PURE__ */ O("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ f("strong", { children: o }),
    /* @__PURE__ */ f(G, { label: i, children: /* @__PURE__ */ f("p", { children: i }) }),
    /* @__PURE__ */ f("span", { children: "文件" })
  ] }) : /* @__PURE__ */ O("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ f("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ f(ot, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ O("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ f(G, { label: i, children: /* @__PURE__ */ f("strong", { children: i }) }),
      /* @__PURE__ */ f("span", { children: c })
    ] }),
    r.url ? /* @__PURE__ */ O("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ f(Ct, { "aria-hidden": "true" }),
      /* @__PURE__ */ f("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ f("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function F({
  kind: t,
  src: e,
  poster: n
}) {
  const r = Vt(null), [i, o] = C(""), [c, s] = C(""), [a, l] = C(""), d = i === e, p = c === e, m = a === e;
  Yt(() => {
    const _ = r.current;
    if (!e || !_ || typeof IntersectionObserver > "u") {
      o(e);
      return;
    }
    const b = new IntersectionObserver(
      (I) => {
        I.some((R) => R.isIntersecting) && (o(e), b.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return b.observe(_), () => b.disconnect();
  }, [e]);
  function y() {
    s(e), l("");
  }
  function u() {
    s(""), l(e);
  }
  return /* @__PURE__ */ O(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        p ? "is-loaded" : "is-pending",
        m ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        d && (t === "video" || !m) ? t === "image" ? /* @__PURE__ */ f(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: y,
            onError: u
          }
        ) : /* @__PURE__ */ f(
          Ut,
          {
            src: e,
            poster: n,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: y,
            onError: u
          }
        ) : null,
        m ? /* @__PURE__ */ f("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function Oe({
  kind: t,
  content: e,
  summary: n
}) {
  const r = et(t, e), i = n || nt(e) || rt(t), o = Mt(r, "storyboard") ? { text: i } : r;
  return /* @__PURE__ */ f("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ f(
    it,
    {
      output: o,
      fallback: i,
      emptyText: i,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function gn({
  kind: t,
  content: e,
  summary: n,
  prompt: r,
  compact: i = !1
}) {
  const o = W(e, t), c = o.map((a) => a.url), s = c[0] || "";
  if (!i) {
    const a = t === "audio" ? Pt(e) : null;
    if ((t === "image" || t === "video") && c.length > 0)
      return /* @__PURE__ */ f(
        J,
        {
          kind: t,
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return /* @__PURE__ */ f(
        J,
        {
          kind: "audio",
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: a || (r ? { label: "语音文本", text: r } : null),
          attachmentUrls: W(e, "file").map(
            (d) => d.url
          )
        }
      );
    if (t === "file")
      return /* @__PURE__ */ f(tt, { content: e, summary: n });
    const l = et(t, e);
    return /* @__PURE__ */ f(
      it,
      {
        output: l,
        fallback: n || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return t === "image" && s ? /* @__PURE__ */ f(F, { kind: "image", src: s }) : t === "video" && s ? /* @__PURE__ */ f(
    F,
    {
      kind: "video",
      src: s,
      poster: o[0]?.thumbnail
    }
  ) : t === "audio" ? o[0]?.thumbnail ? /* @__PURE__ */ f(F, { kind: "image", src: o[0].thumbnail }) : /* @__PURE__ */ f(Bt, { src: s }) : t === "file" ? /* @__PURE__ */ f(tt, { content: e, summary: n, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ f(Oe, { kind: t, content: e, summary: n }) : /* @__PURE__ */ f("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ f("p", { children: n || nt(e) || rt(t) }) });
}
function Sn({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ f(zt, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ f($t, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ f(Ft, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ f(Et, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ f(Lt, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ f(ot, { "aria-hidden": "true" });
  }
}
export {
  tn as $,
  gn as A,
  re as B,
  te as C,
  ue as D,
  cn as E,
  en as F,
  bn as G,
  j as H,
  lt as I,
  Le as J,
  ve as K,
  Ge as L,
  pt as M,
  Ce as N,
  v as O,
  _n as P,
  sn as Q,
  Ht as R,
  ee as S,
  Gt as T,
  $e as U,
  Ve as V,
  Ue as W,
  ze as X,
  E as Y,
  ft as Z,
  K as _,
  fe as a,
  He as a0,
  me as a1,
  Ke as a2,
  Fe as a3,
  je as a4,
  Y as a5,
  qt as a6,
  mt as a7,
  Ye as a8,
  dt as a9,
  qe as aa,
  Qe as ab,
  _e as ac,
  It as ad,
  yn as ae,
  Wt as af,
  le as b,
  nn as c,
  H as d,
  Ze as e,
  mn as f,
  pn as g,
  ln as h,
  un as i,
  Sn as j,
  st as k,
  Kt as l,
  at as m,
  Ee as n,
  ce as o,
  Xe as p,
  fn as q,
  de as r,
  dn as s,
  on as t,
  an as u,
  We as v,
  rn as w,
  hn as x,
  ne as y,
  Je as z
};
