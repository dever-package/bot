import { i as w, W as qt, t as p, h as Gt, M as O, e as Wt, X as Xt, H as Zt, I as Jt, l as Qt, B as dt, b as te } from "./content-view-0gIO2Kkv.js";
import { j as c, a as b, f as lt } from "./preloadable-BrN58FXf.js";
import { r as v, c as ee, n as re, X as ne, ag as oe, b as ft, aI as ie, aG as se, be as ae, bf as ce, a8 as ue, _ as de } from "./vendor-icons-UGaOWWu-.js";
import { b as Z, d as J, a as L } from "./file-kind-BSFhe2vU.js";
import { c as le } from "./space-loading-FH4pJ97O.js";
import { r as fe, R as me, V as pe, M as ot } from "./media-inspector-gallery-CQ7C4itZ.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-preview-B1j9kRkj.css", import.meta.url).href]);
function Q(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!w(o))
      continue;
    const i = T(o.asset_id ?? o.assetId), a = _t(o.kind), s = H(o.purpose);
    if (!i || !a || !s || r.has(i))
      continue;
    let u = String(o.key || "").trim() || j(i);
    if (n.has(u) && (u = j(i)), n.has(u))
      continue;
    const l = T(o.version_id ?? o.versionId), f = String(o.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: u,
      asset_id: i,
      ...l ? { version_id: l } : {},
      label: f,
      kind: a,
      purpose: s
    }), n.add(u), r.add(i);
  }
  return e;
}
function lr(t, e, n, r, o, i) {
  const a = new Map(
    Q(e).map((y) => [
      y.asset_id,
      y
    ])
  ), s = new Map(
    n.flatMap((y) => {
      const m = T(y.refId);
      return m ? [[m, y]] : [];
    })
  ), u = [], l = (t?.parts || []).map((y) => ({ ...y })), f = /* @__PURE__ */ new Set();
  for (const [y, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const _ = T(m.ref_id);
    if (!_ || f.has(_))
      continue;
    const h = a.get(_), g = s.get(_), d = _t(g?.kind) || h?.kind;
    if (!d)
      continue;
    const S = T(g?.versionID || m.ref_version_id), k = String(g?.title || m.label || h?.label || "").trim() || `参考素材 ${u.length + 1}`, A = mt(
      d,
      o,
      i
    ), I = H(m.purpose), jt = H(
      h?.purpose
    ), rt = [I, jt].find(
      (Ht) => A.some((Kt) => Kt.value === Ht)
    ) || ye(d, o, i), nt = l[y];
    nt?.type === "reference" && (nt.purpose = rt || void 0), u.push({
      key: h?.key || j(_),
      asset_id: _,
      ...S ? { version_id: S } : {},
      label: k,
      kind: d,
      purpose: rt
    }), f.add(_);
  }
  return {
    content: t ? { ...t, parts: l } : void 0,
    references: u
  };
}
function fr(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function mt(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function pt(t, e) {
  return e.find((n) => n.key === t);
}
function _e(t, e) {
  return pt(t, e)?.name || t;
}
function mr(t, e, n, r) {
  const o = n.find((a) => a.key === e);
  if (!o || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const a of t) {
    const s = pt(
      a.purpose,
      r
    );
    if (!s)
      return `参考素材“${a.label}”的用途无效`;
    if (!s.media_kinds.includes(a.kind))
      return `参考素材“${a.label}”的类型不支持用途“${s.name}”`;
    if (s.work_types.length > 0 && !s.work_types.includes(e))
      return `当前作品类型不支持“${a.label}”的用途“${s.name}”`;
    const u = (i.get(a.purpose) || 0) + 1;
    if (i.set(a.purpose, u), s.max_count > 0 && u > s.max_count)
      return `用途“${s.name}”最多只能选择 ${s.max_count} 个素材`;
  }
  for (const a of o.required_reference_purposes)
    if (!i.get(a))
      return `${o.name}必须添加“${_e(
        a,
        r
      )}”`;
  return "";
}
function j(t) {
  return `ref-${t}`;
}
function H(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function ye(t, e, n) {
  const r = mt(t, e, n);
  return n.find(
    (i) => i.default_media_kinds.includes(t) && (i.work_types.length === 0 || i.work_types.includes(e))
  )?.key || r[0]?.value || "";
}
function _t(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function T(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function he(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const yt = 5, ht = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], C = "first_frame", pr = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function bt(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function _r(t) {
  return (bt(t) || 0) >= yt;
}
function yr(t, e) {
  const n = bt(t);
  return e ? Math.max(n || 0, yt) : n;
}
function gt(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function be(t) {
  return gt(t) || "start";
}
function hr(t) {
  return be(t) === "end" ? "lastFrame" : "firstFrame";
}
function St(t) {
  return ge(t) || C;
}
function ge(t) {
  return ht.includes(t) ? t : void 0;
}
function Se(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return Ae();
    default:
      return [];
  }
}
function z(t) {
  const e = St(t.shot_image_mode), n = !!t.continue_previous, r = !!t.match_previous, o = we(
    e,
    r,
    n
  );
  let i = o === "next_first" ? "first_frame" : o;
  return n && o === "first_frame" && (i = "none"), {
    mode: o,
    nodeMode: i,
    frameMediaItems: Se(i),
    referenceMode: o === "references" ? "references" : o === "none" ? "" : "frames"
  };
}
function wt(t) {
  return t.map(z);
}
function D(t) {
  return typeof t == "string" ? t.trim() : "";
}
function br(t) {
  return ht.filter(
    (e) => !(e === "next_first" && t.continue_previous) && z({ ...t, shot_image_mode: e }).mode === e
  );
}
function we(t, e, n) {
  return n && t === "first_last" ? "last_frame" : t === "last_frame" && !n || n && (t === "references" || t === "none") || e && t === "none" ? C : t;
}
function Ae() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function gr(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!o || typeof o != "object" || Array.isArray(o))
      continue;
    const i = o, a = gt(i.frameRole ?? i.frame_role), s = Number(i.mediaIndex ?? i.media_index);
    !a || !Number.isInteger(s) || s <= 0 || n.has(a) || r.has(s) || (n.add(a), r.add(s), e.push({ frameRole: a, mediaIndex: s }));
  }
  return e.sort((o, i) => o.mediaIndex - i.mediaIndex);
}
function Sr(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = D(n.prompt);
    if (!r)
      return;
    const o = D(n.title);
    return {
      title: o || "画面",
      description: D(n.description) || o || r,
      prompt: r
    };
  }).filter((e) => !!e) : [];
}
function U(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function wr(t, e, n) {
  const r = t[e], o = Ie(t, e, n);
  if (!r || !o)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: E(r?.material_ids),
      referenceKeys: E(r?.reference_keys),
      includeGlobalReferences: !0
    };
  const i = t[o.shotIndex];
  return {
    anchorID: o.id,
    anchorFrameRole: o.frameRole,
    anchorShotIndex: o.shotIndex,
    materialIDs: it(
      r.material_ids,
      i?.material_ids
    ),
    referenceKeys: it(
      r.reference_keys,
      i?.reference_keys
    ),
    includeGlobalReferences: !1
  };
}
function Ie(t, e, n) {
  const r = t[e];
  if (!r)
    return;
  const o = wt(t);
  if (n === "end" && !r.continue_previous)
    return U(o[e]?.frameMediaItems, "start") ? { id: r.id, shotIndex: e, frameRole: "start" } : void 0;
  if (!(n === "start" && !r.match_previous && !r.continue_previous || e <= 0))
    for (let i = e - 1; i >= 0; i -= 1) {
      const a = o[i];
      if (U(a?.frameMediaItems, "end"))
        return {
          id: t[i].id,
          shotIndex: i,
          frameRole: "end"
        };
      if (U(a?.frameMediaItems, "start"))
        return {
          id: t[i].id,
          shotIndex: i,
          frameRole: "start"
        };
      if (!t[i].continue_previous)
        return;
    }
}
function it(t, e) {
  const n = new Set(E(e));
  return E(t).filter(
    (r) => !n.has(r)
  );
}
function E(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
function Ar(t, e, n) {
  const r = t[e];
  if (r?.shot_image_mode !== "next_first") return "";
  const o = t[e + 1];
  if (!o) return "最后一镜没有下一镜，请改用首帧或独立首尾帧";
  if (r.shared_end_shot_id !== o.id)
    return "来源不再是相邻下一镜，请重新选择结束画面";
  if (r.continue_previous || o.continue_previous || !o.match_previous)
    return "须使用计划首帧直接连续，不能与真实视频尾帧续接混用";
  if (!["first_frame", "first_last", "next_first"].includes(
    St(o.shot_image_mode)
  ))
    return "下一镜没有可共享的首帧";
  if (o.transition_type && o.transition_type !== "none")
    return "下一镜不能设置转场效果";
  const i = (f) => f && typeof f == "object" ? f : {}, a = D(i(r.continuity_state).exit);
  if (!a || a !== D(i(o.continuity_state).entry))
    return "结束状态必须与下一镜入镜状态完全一致";
  if (!r.end_framing?.trim() || r.end_framing.trim() !== o.start_framing?.trim())
    return "结束构图必须与下一镜起始构图完全一致";
  const s = n, u = s.filter(
    (f) => r.material_ids?.includes(f.id)
  ), l = s.filter(
    (f) => o.material_ids?.includes(f.id)
  );
  return !u.some((f) => f.type === "scene") || u.length !== l.length || u.some((f) => !o.material_ids?.includes(f.id)) ? "必须保持同一场景与相同主体素材" : "";
}
const At = 4, K = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function $(t) {
  if (t == null || String(t).trim() === "")
    return At;
  const e = Number(t);
  if (!Number.isInteger(e) || !K.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function Ir(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return $(t);
    } catch {
      return;
    }
}
function Rr(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const o = w(r) ? r : {}, i = $(o.seconds), a = Number(o.sort);
    if (e.has(i) || !Number.isInteger(a))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(i), {
      seconds: i,
      name: String(o.name || "").trim() || `${i} 秒`,
      sort: a
    };
  });
  if (n.length !== K.size || [...K].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, o) => r.sort - o.sort);
}
function kr(t) {
  const e = [
    $(t.min_shot_duration),
    ...t.shots.map((n) => Number(n.duration))
  ];
  return [...new Set(e.filter(Rt))].sort(
    (n, r) => n - r
  );
}
function xr(t, e) {
  const n = It(
    e
  );
  return n.length === 0 ? t : t.filter((r) => {
    const o = new Set(
      (r.supported_options?.duration || []).map(
        (i) => String(i).trim()
      )
    );
    return n.every((i) => o.has(String(i)));
  });
}
function Tr(t) {
  const e = It(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function It(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(Rt))
  ].sort((n, r) => n - r);
}
function Rt(t) {
  return Number.isInteger(t) && t >= 2;
}
const q = 9, kt = 2, Re = 50, st = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), ke = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Dr = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, xe = ["photoreal", "stylized"], Nr = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, Te = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], De = "16:9", Or = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, Ne = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], M = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off"
};
function xt(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const Oe = [
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
function Mr(t) {
  return x(t, /* @__PURE__ */ new Set(), 0);
}
function Lr(t, e) {
  if (!w(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(Ft);
  if (n.some((a) => !a))
    return null;
  const r = n, o = new Set(
    r.map((a) => a.id)
  );
  if (o.size !== r.length)
    return null;
  const i = Bt(t.shot, e, o);
  return i ? { shot: i, materials: r } : null;
}
function Pr(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : Tt(t.shots);
}
function Tt(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function Me(t) {
  return Number.isInteger(t) && t >= kt;
}
function Cr(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function Er(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: At,
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
    shot_image_mode: C,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function Fr(t, e) {
  const n = new Set(t.map((i) => i.id));
  let r = t.filter((i) => i.type === e).length + 1, o = `${e}-${r}`;
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
function Br(t, e) {
  const n = [], r = [];
  for (const o of t.shots) {
    o.material_ids.includes(e) && n.push(o.id);
    for (const i of o.speech)
      i.character_id === e && r.push(i.id);
  }
  return { shotIds: n, speechIds: r };
}
function zr(t, e = "dialogue") {
  const n = new Set(t.speech.map((i) => i.id));
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
function $r(t) {
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
function Le(t) {
  const e = $t(t.workflow), n = Q(t.references), r = new Set(n.map((s) => s.key)), o = new Set(
    t.materials.map((s) => s.id)
  ), i = t.shots.map((s, u) => {
    const l = u > 0 ? Ct(s.transition_type) : "none", f = Math.round(
      Number(s.transition_duration_ms)
    ), y = u > 0 && !!s.continue_previous, m = u > 0 && !y && !!s.match_previous;
    return {
      ...s,
      id: s.id || `shot-${u + 1}`,
      order: u + 1,
      transition: u > 0 ? s.transition.trim() : "",
      transition_type: l,
      transition_duration_ms: l !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(f) ? f : 100
        )
      ) : 0,
      material_ids: N(s.material_ids).filter(
        (_) => o.has(_)
      ),
      reference_keys: N(s.reference_keys).filter(
        (_) => r.has(_)
      ),
      shot_image_mode: z({
        ...s,
        match_previous: m,
        continue_previous: y
      }).mode,
      shared_end_shot_id: s.shot_image_mode === "next_first" && s.shared_end_shot_id || "",
      match_previous: m,
      continue_previous: y,
      continuity_anchor: y ? s.continuity_anchor.trim() : "",
      continuity_state: Dt(
        s.continuity_state
      ),
      lyric_line_indexes: zt(
        s.lyric_line_indexes
      )
    };
  });
  i.forEach((s, u) => {
    xt(s, u) && (s.continuity_state.entry = i[u - 1].continuity_state.exit);
  });
  const a = wt(i);
  return i.forEach((s, u) => {
    s.shot_image_mode = a[u].mode;
  }), {
    ...t,
    version: q,
    workflow: e,
    production_plan: tt(
      t.production_plan,
      t.work_type
    ),
    target_duration: Tt(i),
    target_shot_count: i.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: Pt(t.aspect_ratio),
    references: n,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: N(s.reference_keys).filter(
        (u) => r.has(u)
      )
    })),
    shots: i
  };
}
function Dt(t) {
  const e = w(t) ? t : {};
  return {
    entry: p(e.entry).trim(),
    exit: p(e.exit).trim()
  };
}
function vr(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, o) => {
    o > 0 && n.set(r.id, t.shots[o - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, o) => {
      const i = o > 0 ? e.shots[o - 1].id : "", a = o === 0 || n.get(r.id) !== i;
      return {
        ...r,
        transition: a ? "" : r.transition,
        transition_type: a ? "none" : r.transition_type,
        transition_duration_ms: a ? 0 : r.transition_duration_ms,
        match_previous: !a && !r.continue_previous ? r.match_previous : !1,
        continue_previous: !a && !!r.continue_previous,
        continuity_anchor: !a && r.continue_previous ? r.continuity_anchor : ""
      };
    })
  };
}
function Ur(t) {
  return t.workflow.status === "confirmed";
}
function tt(t, e) {
  const n = w(t) ? t : {}, r = p(n.output_target).toLowerCase(), o = {
    output_target: Ne.includes(
      r
    ) ? r : M.output_target,
    voice_mode: V(
      n.voice_mode,
      M.voice_mode
    ),
    subtitle_mode: V(
      n.subtitle_mode,
      M.subtitle_mode
    ),
    lip_sync_mode: V(
      n.lip_sync_mode,
      M.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
  return e === "mv" ? {
    ...o,
    voice_mode: "off",
    subtitle_mode: "off",
    lip_sync_mode: "off"
  } : o;
}
function Vr(t, e) {
  return {
    ...tt(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video",
    lip_sync_mode: t.work_type !== "mv" && e && t.shots.some(Lt) ? "auto" : "off"
  };
}
function Yr(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function Nt(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function jr(t) {
  return t.production_plan.output_target === "final_video";
}
function Ot(t) {
  return t.work_type === "mv";
}
function Pe(t) {
  return !Ot(t) && Nt(t) && t.production_plan.voice_mode === "auto" && Ce(t) > 0;
}
function Hr(t) {
  return !Ot(t) && Nt(t) && t.production_plan.subtitle_mode === "auto" && Ee(t) > 0;
}
function Kr(t) {
  return Pe(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(Lt);
}
function Ce(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(Ge).length,
    0
  );
}
function Ee(t) {
  return t.shots.reduce(
    (e, n) => e + Fe(n).length,
    0
  );
}
function Fe(t) {
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
    (r, o) => r.start_time - o.start_time
  );
}
function Mt(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function Lt(t) {
  return t.speech.some(Mt);
}
function qr(t) {
  return new Set(
    t.speech.filter(Mt).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function Gr(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Wr(t) {
  return t.summary.trim() || Et("", t.shots);
}
function Xr(t, e) {
  return { ...t, style_prompt: e };
}
function Pt(t) {
  const e = p(t);
  return Te.includes(e) ? e : De;
}
function Ct(t) {
  const e = p(t);
  return ke.includes(e) ? e : "none";
}
function x(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const a of qt(t)) {
      const s = x(a, e, n + 1);
      if (s)
        return s;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const a of t) {
      const s = x(a, e, n + 1);
      if (s)
        return s;
    }
    return null;
  }
  const r = t, o = Be(r);
  if (o)
    return o;
  const i = He(r);
  if (i) {
    const a = x(i, e, n + 1);
    if (a)
      return a;
  }
  for (const a of Oe) {
    const s = r[a];
    if (s == null || s === t)
      continue;
    const u = x(s, e, n + 1);
    if (u)
      return u;
  }
  return null;
}
function Be(t) {
  const e = p(t.visual_mode).toLowerCase(), n = $e(t.work_type);
  let r;
  try {
    r = $(t.min_shot_duration);
  } catch {
    return null;
  }
  if (p(t.type).toLowerCase() !== "storyboard" || R(t.version) !== q || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ve(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const o = w(t.workflow) && t.workflow.status === "draft", i = ve(t.storyline);
  if (!i)
    return null;
  const a = Q(t.references);
  if (a.length !== t.references.length)
    return null;
  const s = t.materials.map(Ft);
  if (s.some((A) => !A))
    return null;
  const u = s, l = /* @__PURE__ */ new Set();
  for (const A of u) {
    if (l.has(A.id))
      return null;
    l.add(A.id);
  }
  const f = /* @__PURE__ */ new Set(), y = t.shots.map(
    (A, I) => Bt(A, I, l, o)
  );
  if (y.some((A) => !A))
    return null;
  const m = y;
  for (const [A, I] of m.entries()) {
    if (f.has(I.id) || !o && xt(I, A) && I.continuity_state.entry !== m[A - 1].continuity_state.exit)
      return null;
    f.add(I.id);
  }
  const _ = R(t.target_duration), h = R(t.target_shot_count);
  if (_ == null || !Number.isInteger(_) || _ < kt || h == null || !Number.isInteger(h) || h < 1 || h > Re)
    return null;
  const g = ze(t, n);
  if (g === null)
    return null;
  const d = $t(t.workflow), S = Et(
    p(t.summary),
    m
  ), k = {
    ...t,
    type: "storyboard",
    version: q,
    work_type: n,
    workflow: d,
    production_plan: tt(
      t.production_plan,
      n
    ),
    title: Ue(t.title, S, m),
    summary: S,
    target_duration: _,
    target_shot_count: h,
    min_shot_duration: r,
    ...g,
    lyrics_lrc: n === "mv" ? p(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: i,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: Pt(t.aspect_ratio),
    references: a,
    materials: u,
    shots: m
  };
  return Le(k);
}
function ze(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((s) => s == null || s === ""))
    return {};
  const r = O(t.storyboard_range_start_ms), o = O(t.storyboard_range_end_ms), i = O(
    t.storyboard_soundtrack_duration_ms
  ), a = O(t.timeline_duration_ms);
  return e !== "mv" || r == null || o == null || i == null || a == null || ![r, o, i, a].every(
    Number.isInteger
  ) || r < 0 || o <= r || o > i || a !== o - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: o,
    storyboard_soundtrack_duration_ms: i,
    timeline_duration_ms: a
  };
}
function $e(t) {
  const e = p(t).toLowerCase();
  return e ? he(e) ? e : null : "short";
}
function ve(t) {
  if (!w(t))
    return null;
  const e = p(t.setup), n = p(t.development), r = p(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function Et(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((o) => o.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Ue(t, e, n) {
  const r = t.trim();
  if (r && !st.has(r))
    return r;
  const o = [e, n[0]?.beat, n[0]?.description].map((a) => String(a || "").trim()).find((a) => a && !st.has(a));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function Ve(t) {
  return xe.includes(t);
}
function Ft(t) {
  if (!w(t))
    return null;
  const e = p(t.type).toLowerCase();
  return !Ke(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: N(t.reference_keys.map(p))
  };
}
function Bt(t, e, n, r = !1) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !r && !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !w(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const o = R(t.duration);
  if (o == null || !Me(o))
    return null;
  const i = t.material_ids.map(p);
  if (i.some((d) => !d || !n.has(d)) || new Set(i).size !== i.length)
    return null;
  const a = t.speech.map(Ye);
  if (a.some((d) => !d))
    return null;
  const s = t.captions.map(je);
  if (s.some(
    (d) => !d || d.end_time > o
  ))
    return null;
  const u = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const l = e > 0 && !u && t.match_previous, f = z({
    shot_image_mode: t.shot_image_mode,
    match_previous: l,
    continue_previous: u
  }).mode, y = t.transition.trim();
  if (!r && e > 0 && !y)
    return null;
  const m = t.continuity_anchor.trim();
  if (!r && u && !m)
    return null;
  const _ = Dt(
    t.continuity_state
  );
  if (!r && (!_.entry || !_.exit))
    return null;
  const h = Ct(
    t.transition_type
  ), g = R(t.transition_duration_ms);
  return h !== t.transition_type || g == null || !Number.isInteger(g) || g < 0 || g > 5e3 || e === 0 && (h !== "none" || g !== 0) || e > 0 && h === "none" && g !== 0 || e > 0 && h !== "none" && g < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: o,
    beat: t.beat.trim(),
    transition: e > 0 ? y : "",
    transition_type: e > 0 ? h : "none",
    transition_duration_ms: e > 0 && h !== "none" ? g : 0,
    description: t.description,
    spatial_layout: p(t.spatial_layout),
    start_framing: p(t.start_framing),
    end_framing: p(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: i,
    reference_keys: N(t.reference_keys.map(p)),
    shot_image_mode: f,
    shared_end_shot_id: f === "next_first" ? p(t.shared_end_shot_id) : "",
    match_previous: l,
    continue_previous: u,
    continuity_anchor: u ? m : "",
    continuity_state: _,
    lyric_line_indexes: zt(
      t.lyric_line_indexes
    ),
    speech: a,
    captions: s
  };
}
function zt(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, n) => e - n) : [];
}
function Ye(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = p(t.kind).toLowerCase(), n = R(t.start_time);
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
function je(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = p(t.type).toLowerCase(), n = R(t.start_time), r = R(t.end_time);
  return !qe(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function $t(t) {
  const e = w(t) ? t : {}, n = p(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? p(e.confirmed_at) : ""
  };
}
function V(t, e) {
  const n = p(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function He(t) {
  const e = Gt(t);
  if (e)
    return e;
  if (!w(t))
    return "";
  const n = t.type === "doc" ? t : w(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? vt(n).trim() : "";
}
function vt(t) {
  if (!w(t))
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
  return t.content.map(vt).join(e);
}
function Ke(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function qe(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Ge(t) {
  return t.text.trim().length > 0;
}
function N(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function R(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const G = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!G || Object.keys(G).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const We = G.HoverTip, Xe = 12e3;
function F({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: o
}) {
  return /* @__PURE__ */ c(
    We,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Xe,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: o
    }
  );
}
const Ut = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Vt(t, e) {
  const n = Ut[t], r = n ? et(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const o = Xt(e);
  if (!o)
    return e;
  const i = Zt(o);
  return i && (t === "text" || Jt(i.plainText)) ? { text: i.markdown } : { rich: o };
}
function Ze(t, e) {
  return et(t, e)[0] || "";
}
function et(t, e) {
  return W(t, e).map((n) => n.url);
}
function W(t, e) {
  return Je(e) ? Wt(t, e) : [];
}
function Zr(t, e) {
  if (!Ut[e])
    return 0;
  const n = et(t, e).length;
  if (!t || typeof t != "object" || Array.isArray(t))
    return n;
  const r = Number(
    t.media_count || 0
  );
  return Math.max(
    n,
    Number.isFinite(r) ? Math.trunc(r) : 0
  );
}
function Je(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function B(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return Yt(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => B(r, e + 1)).filter(Boolean)[0] || "";
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const o = B(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function Jr(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function Qe(t) {
  const e = Ze(t, "file"), n = P(t) || fe(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function P(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return Yt(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const o = P(r, e + 1);
      if (o) return o;
    }
    return "";
  }
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const o = P(n[r], e + 1);
    if (o) return o;
  }
  for (const r of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const o = P(n[r], e + 1);
    if (o) return o;
  }
  return "";
}
function Yt(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
function tr(t) {
  if (!t) return !1;
  const e = document.querySelectorAll('[data-slot="dialog-layer"]');
  return e.item(e.length - 1)?.contains(t) || !1;
}
const Qr = 10040;
function tn({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  onEscape: o,
  layer: i = "default"
}) {
  const a = Z(null);
  J(() => {
    const u = (l) => {
      l.key !== "Escape" || l.defaultPrevented || !tr(a.current) || (l.preventDefault(), l.stopImmediatePropagation(), (o || r)());
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [o, r]);
  const s = /* @__PURE__ */ c(
    "div",
    {
      ref: a,
      className: `wb-detail-backdrop ${i === "nested" ? "is-nested" : ""}`.trim(),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: (u) => {
        u.stopPropagation(), u.target === u.currentTarget && r();
      },
      children: /* @__PURE__ */ b(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (u) => u.stopPropagation(),
          children: [
            e,
            n
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : le(s, document.body);
}
function en({
  icon: t,
  title: e,
  subtitle: n,
  titleStatus: r,
  versionSelect: o,
  state: i,
  updatedAt: a,
  actions: s,
  downloadUrl: u,
  onClose: l
}) {
  return /* @__PURE__ */ b("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ b("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ c("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ b("div", { children: [
        /* @__PURE__ */ c("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ c("span", { children: n }) : null
      ] })
    ] }),
    r && /* @__PURE__ */ c("div", { className: "wb-detail-title-status", children: r }),
    /* @__PURE__ */ b("div", { className: "wb-detail-meta", children: [
      o,
      i,
      a ? /* @__PURE__ */ c("time", { children: a }) : null
    ] }),
    /* @__PURE__ */ b("div", { className: "wb-detail-actions", children: [
      s,
      u ? /* @__PURE__ */ c(F, { label: "下载内容", children: /* @__PURE__ */ c(
        me,
        {
          url: u,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ c(F, { label: "关闭", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: l,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ c(ne, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function rn({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: o,
  loading: i,
  loadingMore: a,
  error: s,
  disabled: u = !1,
  onSelect: l,
  onLoadMore: f,
  onRetry: y
}) {
  const [m, _] = L(!1), h = Z(null), g = t.find((d) => d.id === n) || t.find((d) => d.id === e);
  return J(() => {
    if (!m) return;
    const d = (S) => {
      h.current?.contains(S.target) || _(!1);
    };
    return document.addEventListener("mousedown", d), () => document.removeEventListener("mousedown", d);
  }, [m]), !n && !i ? null : /* @__PURE__ */ b("div", { className: "wb-detail-version-select", ref: h, children: [
    /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": m,
        disabled: u || i && t.length === 0,
        onClick: () => _((d) => !d),
        children: [
          i && t.length === 0 ? /* @__PURE__ */ c(v, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ c("span", { children: ct(g?.version) }),
          r > 0 ? /* @__PURE__ */ b("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ c(ee, { size: 13 })
        ]
      }
    ),
    m ? /* @__PURE__ */ c("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ b(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (d) => {
          const S = d.currentTarget;
          o && !a && S.scrollHeight - S.scrollTop - S.clientHeight < 36 && f();
        },
        children: [
          t.length > 0 ? t.map((d) => {
            const S = d.id === n, k = d.id === e;
            return /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": S,
                className: S ? "is-selected" : "",
                onClick: () => {
                  _(!1), l(d.value);
                },
                children: [
                  /* @__PURE__ */ b("span", { children: [
                    /* @__PURE__ */ c("strong", { children: ct(d.version) }),
                    k ? /* @__PURE__ */ c("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ c("time", { children: er(d.updatedAt) }),
                  S ? /* @__PURE__ */ c(re, { size: 13 }) : /* @__PURE__ */ c("i", { "aria-hidden": "true" })
                ]
              },
              d.id
            );
          }) : s ? /* @__PURE__ */ c(at, { error: s, onRetry: y }) : /* @__PURE__ */ b("div", { className: "wb-detail-version-message", children: [
            i ? /* @__PURE__ */ c(v, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ c("span", { children: i ? "正在读取版本" : "暂无版本" })
          ] }),
          s && t.length > 0 ? /* @__PURE__ */ c(at, { error: s, onRetry: y }) : null,
          a ? /* @__PURE__ */ b("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ c(v, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function at({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ b("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ c("span", { children: t }),
    /* @__PURE__ */ b("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ c(oe, { size: 12 }),
      "重试"
    ] })
  ] });
}
function ct(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function er(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const X = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!X || Object.keys(X).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const rr = X.EnergonAudioPlayer;
function nr({
  src: t,
  autoPlay: e = !1
}) {
  return /* @__PURE__ */ c("div", { className: "wb-asset-audio-preview", children: /* @__PURE__ */ c(
    rr,
    {
      src: t,
      autoPlay: e,
      className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
    }
  ) });
}
function ut({
  content: t,
  summary: e,
  compact: n = !1
}) {
  const r = Qe(t), o = r.name || e || "文件", i = r.extension ? r.extension.toUpperCase() : "FILE", a = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return n ? /* @__PURE__ */ b("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ c("strong", { children: i }),
    /* @__PURE__ */ c(F, { label: o, children: /* @__PURE__ */ c("p", { children: o }) }),
    /* @__PURE__ */ c("span", { children: "文件" })
  ] }) : /* @__PURE__ */ b("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ c("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ c(ft, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ b("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ c(F, { label: o, children: /* @__PURE__ */ c("strong", { children: o }) }),
      /* @__PURE__ */ c("span", { children: a })
    ] }),
    r.url ? /* @__PURE__ */ b("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ c(ie, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ c("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function Y({
  kind: t,
  src: e,
  poster: n
}) {
  const r = Z(null), [o, i] = L(""), [a, s] = L(""), [u, l] = L(""), f = o === e, y = a === e, m = u === e;
  J(() => {
    const g = r.current;
    if (!e || !g || typeof IntersectionObserver > "u") {
      i(e);
      return;
    }
    const d = new IntersectionObserver(
      (S) => {
        S.some((k) => k.isIntersecting) && (i(e), d.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return d.observe(g), () => d.disconnect();
  }, [e]);
  function _() {
    s(e), l("");
  }
  function h() {
    s(""), l(e);
  }
  return /* @__PURE__ */ b(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        y ? "is-loaded" : "is-pending",
        m ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        f && (t === "video" || !m) ? t === "image" ? /* @__PURE__ */ c(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: _,
            onError: h
          }
        ) : /* @__PURE__ */ c(
          pe,
          {
            src: e,
            poster: n,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: _,
            onError: h
          }
        ) : null,
        m ? /* @__PURE__ */ c("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function or({
  kind: t,
  content: e,
  summary: n
}) {
  const r = Vt(t, e), o = n || B(e) || lt(t), i = Qt(r, "storyboard") ? { text: o } : r;
  return /* @__PURE__ */ c("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ c(
    dt,
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
function nn({
  kind: t,
  content: e,
  summary: n,
  prompt: r,
  compact: o = !1
}) {
  const i = W(e, t), a = i.map((u) => u.url), s = a[0] || "";
  if (!o) {
    const u = t === "audio" ? te(e) : null;
    if ((t === "image" || t === "video") && a.length > 0)
      return /* @__PURE__ */ c(
        ot,
        {
          kind: t,
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return /* @__PURE__ */ c(
        ot,
        {
          kind: "audio",
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: u || (r ? { label: "语音文本", text: r } : null),
          attachmentUrls: W(e, "file").map(
            (f) => f.url
          )
        }
      );
    if (t === "file")
      return /* @__PURE__ */ c(ut, { content: e, summary: n });
    const l = Vt(t, e);
    return /* @__PURE__ */ c(
      dt,
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
  return t === "image" && s ? /* @__PURE__ */ c(Y, { kind: "image", src: s }) : t === "video" && s ? /* @__PURE__ */ c(
    Y,
    {
      kind: "video",
      src: s,
      poster: i[0]?.thumbnail
    }
  ) : t === "audio" ? i[0]?.thumbnail ? /* @__PURE__ */ c(Y, { kind: "image", src: i[0].thumbnail }) : /* @__PURE__ */ c(nr, { src: s }) : t === "file" ? /* @__PURE__ */ c(ut, { content: e, summary: n, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ c(or, { kind: t, content: e, summary: n }) : /* @__PURE__ */ c("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ c("p", { children: n || B(e) || lt(t) }) });
}
function on({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ c(de, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ c(ue, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ c(ce, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ c(ae, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ c(se, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ c(ft, { "aria-hidden": "true" });
  }
}
export {
  Kr as $,
  nn as A,
  F as B,
  z as C,
  Qr as D,
  Wr as E,
  xe as F,
  Nr as G,
  Te as H,
  Pr as I,
  Re as J,
  vr as K,
  Fr as L,
  kt as M,
  Er as N,
  Xr as O,
  $ as P,
  At as Q,
  fr as R,
  Or as S,
  mr as T,
  xr as U,
  Tr as V,
  lr as W,
  Yr as X,
  Nt as Y,
  Pe as Z,
  Hr as _,
  Vt as a,
  _r as a0,
  kr as a1,
  wt as a2,
  Fe as a3,
  Mt as a4,
  wr as a5,
  Cr as a6,
  Ot as a7,
  bt as a8,
  yt as a9,
  yr as aa,
  jr as ab,
  gr as ac,
  ge as ad,
  hr as ae,
  U as af,
  nr as ag,
  Tt as ah,
  Ar as ai,
  Me as aj,
  qr as ak,
  Vr as al,
  Ce as am,
  Ee as an,
  Lt as ao,
  Gr as ap,
  W as aq,
  be as ar,
  Ir as as,
  Q as at,
  he as au,
  It as av,
  Sr as aw,
  gt as ax,
  Rr as ay,
  Lr as az,
  Ur as b,
  Ze as c,
  er as d,
  rn as e,
  et as f,
  tn as g,
  Zr as h,
  tr as i,
  on as j,
  Jr as k,
  en as l,
  _e as m,
  pt as n,
  Le as o,
  Mr as p,
  zr as q,
  $r as r,
  mt as s,
  xt as t,
  br as u,
  pr as v,
  St as w,
  ke as x,
  Dr as y,
  Br as z
};
