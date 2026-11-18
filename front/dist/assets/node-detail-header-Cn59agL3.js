import { J as f, ai as m, j as mt, B as K, A as lt } from "./asset-audio-preview-Cezm24us.js";
import { i as ft, a as pt, h as gt, n as C, w as yt } from "./interaction-DQ3mGSoD.js";
import { j as _t, k as ht, g as bt, r as kt } from "./space-assistant-layout-Drz4je9C.js";
import { s as L } from "./site-config-CGpZr2qF.js";
import { af as wt, ag as St } from "./writing-reference-Bgk4pNta.js";
import { z as W, x as U, f as G, e as Ct, p as At, s as xt, o as Tt, q as It, n as Nt } from "./runtime-DQ2rFFvP.js";
import { j as d, a as v } from "./space-storyboard-material-ECvLpyk_.js";
import { x as vt, r as X, ah as Rt, aR as Bt, W as Et, k as Mt, a9 as Pt, aa as Ot, M as jt, b as $t } from "./vendor-icons-BZHLe0mm.js";
import { E as Dt, a as zt, d as Ft } from "./file-kind-Cq3pESGF.js";
import { P as Vt } from "./power-icon-cYmAJUbk.js";
function qe(t, e) {
  return t?.outputType === "setting" && e?.outputType === "storyboard" ? "structure" : "media";
}
const qt = "story-compose-";
function Kt(t) {
  return t.purpose ? t.purpose : t.id.startsWith("script-item-edge-") || t.id.startsWith("script-compose-edge-") || t.id.startsWith(qt) ? "dependency" : t.id.startsWith("script-edge-") ? "structure" : "media";
}
function Ke(t) {
  return Kt(t) === "media";
}
function Le(t, e, n) {
  const r = new Map(n.map((o) => [o.id, o])), i = new Set(t.map((o) => o.id));
  return [
    ...t.flatMap((o) => {
      if (!e.has(o.id))
        return [o];
      const s = r.get(o.id);
      return s ? [s] : [];
    }),
    ...n.filter((o) => !i.has(o.id))
  ];
}
const Lt = [
  {
    name: "基础",
    options: [
      { key: "none", name: "无转场" },
      { key: "fade", name: "淡化" },
      { key: "crossfade", name: "交叉溶解" },
      { key: "fadeblack", name: "黑场淡化" },
      { key: "fadewhite", name: "白场淡化" }
    ]
  },
  {
    name: "擦除",
    options: [
      { key: "wipeleft", name: "向左擦除" },
      { key: "wiperight", name: "向右擦除" },
      { key: "wipeup", name: "向上擦除" },
      { key: "wipedown", name: "向下擦除" }
    ]
  },
  {
    name: "滑动",
    options: [
      { key: "slideleft", name: "向左滑动" },
      { key: "slideright", name: "向右滑动" },
      { key: "slideup", name: "向上滑动" },
      { key: "slidedown", name: "向下滑动" }
    ]
  },
  {
    name: "平滑",
    options: [
      { key: "smoothleft", name: "向左平滑" },
      { key: "smoothright", name: "向右平滑" },
      { key: "smoothup", name: "向上平滑" },
      { key: "smoothdown", name: "向下平滑" }
    ]
  },
  {
    name: "镜头",
    options: [
      { key: "zoomin", name: "放大切换" },
      { key: "circleopen", name: "圆形展开" },
      { key: "circleclose", name: "圆形收拢" }
    ]
  },
  {
    name: "覆盖",
    options: [
      { key: "coverleft", name: "向左覆盖" },
      { key: "coverright", name: "向右覆盖" },
      { key: "coverup", name: "向上覆盖" },
      { key: "coverdown", name: "向下覆盖" }
    ]
  },
  {
    name: "揭示",
    options: [
      { key: "revealleft", name: "向左揭示" },
      { key: "revealright", name: "向右揭示" },
      { key: "revealup", name: "向上揭示" },
      { key: "revealdown", name: "向下揭示" }
    ]
  }
];
function We(t) {
  const e = Math.round(t * 10) / 10;
  return Number.isInteger(e) ? e.toString() : e.toFixed(1);
}
function Ue() {
  return {
    version: 3,
    clips: [],
    audioTracks: [],
    settings: {
      resolution: "auto",
      fps: 0
    }
  };
}
function Ge(t) {
  const e = f(t);
  if (Number(e.version || 0) !== 3)
    return;
  const n = Array.isArray(e.clips) ? e.clips.map(D).filter(Boolean) : [], r = f(e.settings), i = Array.isArray(e.audioTracks ?? e.audio_tracks) ? (e.audioTracks ?? e.audio_tracks).map(z).filter(Boolean) : [], o = f(e.storyboardBaseline);
  return {
    version: 3,
    ...Array.isArray(o.clips) && Array.isArray(o.audioTracks) ? {
      storyboardBaseline: {
        clips: o.clips.map(D).filter(Boolean),
        audioTracks: o.audioTracks.map(z).filter(Boolean)
      }
    } : {},
    clips: n,
    audioTracks: i,
    settings: {
      resolution: c(r.resolution) || "auto",
      fps: h(r.fps, 0, 120, 0)
    }
  };
}
function Xe(t) {
  const e = t.clips.reduce(
    (r, i) => r + Math.max(0, i.duration),
    0
  ), n = t.clips.reduce((r, i, o) => o >= t.clips.length - 1 || i.transitionToNext.type === "none" ? r : r + i.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, e - n);
}
function Ye(t) {
  const e = t.clips.flatMap(
    (r, i) => Y(r).map(
      (o) => `${r.title || `镜头 ${i + 1}`}：${o}`
    )
  ), n = t.audioTracks.flatMap(
    (r, i) => r.audio ? [] : [`全片声音 ${i + 1}：缺少音频素材`]
  );
  return [...e, ...n];
}
function Y(t) {
  const e = [];
  t.visualVideo || e.push("缺少镜头视频素材");
  for (const n of t.speechTracks)
    n.audio || e.push(`语音“${n.text}”缺少音频素材`);
  for (const n of t.subtitleTracks)
    n.speechId && !t.speechTracks.some((r) => r.id === n.speechId) && e.push(`字幕“${n.text}”未找到对应语音`);
  return [...new Set(e)];
}
function Wt(t) {
  return t ? `${t.assetId}:${t.versionId}` : "";
}
function He(t) {
  return t ? [
    Wt(t),
    Number(t.mediaIndex || 0),
    t.mediaUrl || ""
  ].join(":") : "";
}
function D(t) {
  const e = f(t), n = c(e.id);
  if (!n)
    return null;
  const r = R(
    e.visualVideo ?? e.visual_video
  ), i = R(
    e.originalAudioSource ?? e.original_audio_source
  ), o = f(
    e.transitionToNext ?? e.transition_to_next
  ), s = Array.isArray(e.speechTracks ?? e.speech_tracks) ? (e.speechTracks ?? e.speech_tracks).map(Gt).filter(Boolean) : [], u = Array.isArray(
    e.subtitleTracks ?? e.subtitle_tracks
  ) ? (e.subtitleTracks ?? e.subtitle_tracks).map(Ut).filter(Boolean) : [], a = Ht(o.type), p = c(e.sourceEdgeId ?? e.source_edge_id), l = {
    id: n,
    title: c(e.title) || r?.label || "镜头",
    ...p ? { sourceEdgeId: p } : {},
    ...r ? { visualVideo: r } : {},
    ...i ? { originalAudioSource: i } : {},
    duration: Xt(e.duration),
    originalVolume: h(
      e.originalVolume ?? e.original_volume,
      0,
      1,
      1
    ),
    speechTracks: s,
    subtitleTracks: u,
    useOriginalVideo: J(
      e.useOriginalVideo ?? e.use_original_video
    ),
    blockingIssues: [],
    transitionToNext: {
      type: a,
      durationMs: a === "none" ? 0 : h(
        o.durationMs ?? o.duration_ms,
        100,
        5e3,
        500
      )
    }
  };
  return l.blockingIssues = Y(l), l;
}
function Ut(t) {
  const e = f(t), n = c(e.id), r = c(e.text);
  if (!n || !r)
    return null;
  const i = c(e.source) === "speech" ? "speech" : "caption", o = c(e.speechId ?? e.speech_id), s = m(e.endTime ?? e.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, m(e.startTime ?? e.start_time)),
    ...s > 0 ? { endTime: s } : {},
    ...o ? { speechId: o } : {},
    source: i
  };
}
function Gt(t) {
  const e = f(t), n = c(e.id);
  if (!n)
    return null;
  const r = R(e.audio), i = c(e.kind) === "narration" ? "narration" : "dialogue", o = c(e.characterId ?? e.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, m(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, m(e.sourceStart ?? e.source_start)),
    fit: H(e.fit, "trim"),
    kind: i,
    ...o ? { characterId: o } : {},
    text: c(e.text),
    volume: h(e.volume, 0, 1, 1)
  };
}
function z(t) {
  const e = f(t), n = c(e.id);
  if (!n)
    return null;
  const r = R(e.audio), i = c(e.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, m(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, m(e.sourceStart ?? e.source_start)),
    kind: i,
    volume: h(e.volume, 0, 1, i === "music" ? 0.35 : 1),
    fit: H(e.fit, i === "music" ? "trim" : "strict"),
    loop: i === "music" && J(e.loop),
    fadeOut: h(
      e.fadeOut ?? e.fade_out,
      0,
      10,
      i === "music" ? 1 : 0
    )
  };
}
function H(t, e) {
  return c(t) === "strict" ? "strict" : c(t) === "trim" ? "trim" : e;
}
function Xt(t) {
  const e = m(t);
  return e > 0 ? Math.max(1, Math.floor(e)) : 0;
}
function R(t) {
  const e = f(t), n = m(e.assetId ?? e.asset_id), r = m(e.versionId ?? e.version_id);
  if (!n || !r)
    return;
  const i = Yt(
    e.mediaItems ?? e.media_items ?? e.refMediaItems ?? e.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: c(e.label),
    ...m(e.mediaIndex ?? e.media_index) > 0 ? { mediaIndex: m(e.mediaIndex ?? e.media_index) } : {},
    ...c(e.mediaUrl ?? e.media_url) ? { mediaUrl: c(e.mediaUrl ?? e.media_url) } : {},
    ...c(
      e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
    ) ? {
      mediaThumbnail: c(
        e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
      )
    } : {},
    ...i.length ? { mediaItems: i } : {}
  };
}
function Yt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t) {
    const i = f(r), o = c(i.url), s = m(i.index);
    if (!o && s <= 0)
      continue;
    const u = s > 0 ? `index:${s}` : `url:${o}`;
    n.has(u) || (n.add(u), e.push({
      url: o,
      index: s > 0 ? s : 0,
      ...c(i.usage) ? { usage: c(i.usage) } : {}
    }));
  }
  return e;
}
function Ht(t) {
  const e = c(t);
  return Lt.some(
    (n) => n.options.some((r) => r.key === e)
  ) ? e : "none";
}
function c(t) {
  return String(t ?? "").trim();
}
function h(t, e, n, r) {
  const i = Number(t);
  return Number.isFinite(i) ? Math.min(n, Math.max(e, i)) : r;
}
function J(t) {
  return t === !0 || t === 1 || t === "1" || t === "true";
}
function Z(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return;
  const e = t, n = S(e.started_at ?? e.startedAt);
  if (n == null)
    return;
  const r = S(e.finished_at ?? e.finishedAt);
  return {
    startedAt: n,
    ...r != null && r >= n ? { finishedAt: r } : {}
  };
}
function Jt(t) {
  const e = Number(t);
  return Number.isFinite(e) && e > 0 ? Math.round(e) : void 0;
}
function Je({
  nodeRunTiming: t,
  runCreatedAt: e,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return S(t?.startedAt) ?? S(e) ?? S(n) ?? r;
}
function x(t) {
  const e = Math.max(0, Math.floor(t / 1e3)), n = e % 60, r = Math.floor(e / 60), i = r % 60, o = Math.floor(r / 60);
  return o > 0 ? `${o}:${T(i)}:${T(n)}` : `${T(r)}:${T(n)}`;
}
function Zt(t, e, n) {
  const r = x(t);
  if (!e)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const i = Jt(n);
  if (!i)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const o = t >= i ? `已超预计 ${x(t - i)}` : `剩余约 ${x(i - t)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: o,
    tooltip: `已运行 ${r}，历史平均约 ${x(i)}，${o}`
  };
}
function S(t) {
  if (typeof t == "number" && Number.isFinite(t) && t > 0)
    return t < 1e12 ? t * 1e3 : t;
  if (typeof t != "string" || !t.trim())
    return;
  const e = Date.parse(t);
  return Number.isFinite(e) ? e : void 0;
}
function T(t) {
  return String(t).padStart(2, "0");
}
function Ze(t) {
  const e = Number(t.execution_id || 0);
  if (e > 0)
    return `execution:${e}`;
  const n = Number(t.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(t.request_id || "")}`;
}
function Qe(t) {
  const e = String(t.status || "").trim();
  return e ? ft(e) || pt(e) : !1;
}
function tn(t) {
  if (!t)
    return "";
  const e = String(
    t.status || t.result?.status || ""
  ).trim();
  return e ? C(e) : "";
}
function Qt(t) {
  const e = String(t || "").trim();
  return !!e && gt(e);
}
function en(t, e) {
  const n = t.target_node_ids || [];
  if (!Qt(t.status) || n.length === 0)
    return !1;
  const r = Number(t.canvas_id || 0), i = Number(t.asset_cate_id || 0), o = r ? [e[String(r)]].filter(Boolean) : Object.values(e).filter(
    (s) => !i || s.assetCateId === i
  );
  return o.length > 0 && o.every((s) => {
    const u = new Set(s.nodes.map((a) => a.id));
    return n.every((a) => !u.has(a));
  });
}
function nn(t) {
  const e = t?.output && typeof t.output == "object" ? t.output : {}, n = t?.run && typeof t.run == "object" ? t.run : {};
  return {
    execution_id: Number(t?.execution_id || 0),
    canvas_id: Number(t?.canvas_id || 0),
    run_id: Number(t?.run_id || n.id || 0),
    request_id: String(t?.request_id || n.request_id || ""),
    asset_cate_id: Number(t?.asset_cate_id || 0),
    start_node_id: String(t?.start_node_id || ""),
    target_node_ids: Array.isArray(t?.target_node_ids) ? t.target_node_ids.filter(
      (r) => typeof r == "string" && !!r.trim()
    ) : [],
    execution_scope: String(
      t?.execution_scope || e.execution_scope || ""
    ),
    flow_run_id: Number(t?.flow_run_id || n.flow_run_id || 0),
    release_id: Number(t?.release_id || n.release_id || 0),
    status: C(t?.status || n.status),
    error: y(t?.error || n.error),
    executed: Number(t?.executed || t?.output?.executed || 0),
    total: Number(t?.total || t?.output?.total || 0),
    single_node: !!t?.single_node,
    created_at: String(t?.created_at || ""),
    updated_at: String(t?.updated_at || ""),
    title: String(t?.title || ""),
    output: t?.output || n.output,
    approvals: Array.isArray(t?.approvals) ? t.approvals : Array.isArray(t?.data?.approvals) ? t.data.approvals : [],
    interactions: Array.isArray(t?.interactions) ? t.interactions : Array.isArray(t?.data?.interactions) ? t.data.interactions : [],
    node_results: Q(
      t?.node_results || e.node_results
    ),
    pending_node: $(
      t?.pending_node || e.pending_node
    ),
    execution_plan: ne(t?.execution_plan),
    node_runs: Array.isArray(t?.node_runs) ? t.node_runs.map(oe).filter((r) => !!r) : []
  };
}
function $(t) {
  if (!t || typeof t != "object")
    return null;
  const e = String(t.node_key || "");
  return e ? {
    node_key: e,
    execution_id: Number(t.execution_id || 0),
    node_type: String(t.node_type || ""),
    function_key: String(t.function_key || ""),
    node_run_id: Number(t.node_run_id || 0),
    run_id: Number(t.run_id || 0),
    request_id: String(t.request_id || ""),
    flow_run_id: Number(t.flow_run_id || 0),
    release_id: Number(t.release_id || 0),
    child_run_id: Number(t.child_run_id || 0),
    child_request_id: String(t.child_request_id || ""),
    asset_id: Number(t.asset_id || 0),
    version_id: Number(t.version_id || 0),
    status: C(t.status || t.result?.status),
    error: y(t.error),
    output: t.output,
    asset: t.asset,
    version: t.version,
    result: t.result,
    approval: t.approval,
    interaction: t.interaction,
    persists_result: !!t.persists_result,
    agent_run_id: Number(t.agent_run_id || 0),
    runTiming: Z(t.run_timing)
  } : null;
}
function Q(t) {
  return Array.isArray(t) ? t.map($).filter((e) => !!e) : [];
}
function rn(t, e = "") {
  if (!t || typeof t != "object")
    return null;
  const n = String(e || "").trim(), r = Q(t.node_results), i = n ? r.find((o) => o.node_key === n) : r[0];
  return i || $(
    n && !String(t.node_key || "").trim() ? { ...t, node_key: n } : t
  );
}
function tt(t) {
  return t ? rt(
    t.error,
    t.result?.error,
    t.output?.error
  ) : "";
}
function te(t) {
  if (!t)
    return "";
  const e = [...t.node_results || []].reverse().find((n) => C(
    n.status || n.result?.status
  ) === "fail");
  return rt(
    tt(e),
    t.output?.error,
    t.error
  );
}
function on(t, e = "节点运行失败") {
  return et(
    tt(t),
    e
  );
}
function sn(t, e = "画布运行失败") {
  return et(te(t), e);
}
function et(t, e = "运行失败") {
  const n = y(t);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : e;
}
function ee(...t) {
  for (const e of t) {
    const n = y(e);
    if (n)
      return n;
  }
  return "";
}
const nt = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function an(t) {
  return nt.has(y(t));
}
function un(t) {
  const e = y(t);
  return e.includes("运行已取消") || e.includes("运行已停止");
}
function rt(...t) {
  let e = "";
  for (const n of t) {
    const r = y(n);
    if (r && (e ||= r, !nt.has(r)))
      return r;
  }
  return e;
}
function y(t) {
  if (typeof t == "string")
    return t.trim();
  if (t instanceof Error)
    return t.message.trim();
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, n = ee(e.error, e.message, e.msg);
  if (n)
    return n;
  const r = y(e.code), i = y(e.detail);
  return [r, i].filter(Boolean).join(": ");
}
function ne(t) {
  if (!t || typeof t != "object")
    return null;
  const e = Array.isArray(t.nodes) ? t.nodes.map(re).filter((r) => !!r) : [], n = Array.isArray(t.edges) ? t.edges.map(ie).filter((r) => !!r) : [];
  return {
    nodes: e,
    edges: n,
    incoming: F(t.incoming),
    outgoing: F(t.outgoing),
    order: Array.isArray(t.order) ? t.order.map((r) => String(r || "")).filter(Boolean) : e.map((r) => r.id)
  };
}
function re(t) {
  const e = String(t?.id || "");
  return e ? {
    id: e,
    type: String(t?.type || ""),
    title: String(t?.title || ""),
    kind: String(t?.kind || ""),
    output_type: String(t?.output_type || ""),
    group_id: String(t?.group_id || ""),
    function_key: String(t?.function_key || ""),
    asset_cate_id: Number(t?.asset_cate_id || 0),
    persists_result: !!t?.persists_result,
    stops_flow: !!t?.stops_flow
  } : null;
}
function ie(t) {
  const e = String(t?.source || ""), n = String(t?.target || "");
  return !e || !n ? null : {
    id: String(t?.id || `${e}-${n}`),
    source: e,
    target: n
  };
}
function F(t) {
  const e = /* @__PURE__ */ new Map();
  if (!t || typeof t != "object" || Array.isArray(t))
    return e;
  for (const [n, r] of Object.entries(t)) {
    const i = Array.isArray(r) ? r.map((o) => String(o || "")).filter(Boolean) : [];
    e.set(String(n), i);
  }
  return e;
}
function oe(t) {
  const e = String(t?.node_key || ""), n = Number(t?.node_run_id || 0);
  return !e || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(t?.node_id || 0),
    node_key: e,
    node_type: String(t?.node_type || ""),
    status: C(t?.status),
    persists_result: !!t?.persists_result,
    runTiming: Z(t?.run_timing)
  };
}
const N = "primary_text", se = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), ae = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), b = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function ue(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t) {
    const i = String(r.key || "").trim(), o = String(r.type || "").trim().toLowerCase(), s = String(r.value_type || "string").trim().toLowerCase();
    !i || b.has(i) || e.has(i) || !se.has(o) || s === "number" || (e.add(i), n.push(i === r.key ? r : { ...r, key: i }));
  }
  return n;
}
function ce(t, e, n) {
  const r = n.trim(), i = _(e?.paramBindings);
  return ue(t).filter(
    (o) => st(i, o.key, r)
  );
}
function cn(t, e, n) {
  return st(
    _(t?.paramBindings),
    e,
    n
  );
}
function de(t) {
  if (t.length !== 1)
    return;
  const e = t[0], n = String(e.key || "").trim();
  return n && !b.has(n) ? n : void 0;
}
function me(t) {
  const e = de(t);
  return e ? { kind: "automatic", targetParamKey: e } : t.length > 1 ? { kind: "choose", params: t } : { kind: "unavailable" };
}
function dn(t, e, n = !1) {
  const r = (e?.length || 0) + (n ? 1 : 0);
  if (t) {
    let i = r;
    (t.purpose === "storyboard_lyrics" && n || t.purpose !== "storyboard_lyrics" && t.targetParamKey && e?.some((s) => s.key === t.targetParamKey)) && (i -= 1);
    const o = !!(e && i > 0);
    return {
      label: t.label,
      interactive: o,
      showChevron: o,
      invalid: !1
    };
  }
  return e && r === 0 ? {
    label: "无效连接",
    interactive: !1,
    showChevron: !1,
    invalid: !0
  } : {
    label: "待绑定",
    interactive: !0,
    showChevron: !!(e && r > 1),
    invalid: !1
  };
}
function mn(t, e, n) {
  const r = _(e?.paramBindings), i = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), o = [
    ...new Set(t.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !i.has(a));
  if (o.length !== 1)
    return;
  const s = o[0], u = me(
    ce(n, e, s)
  );
  return u.kind === "automatic" ? { sourceNodeId: s, targetParamKey: u.targetParamKey } : void 0;
}
function le(t) {
  return P(t.type) === "prompt" || P(t.key) === "prompt" ? "提示词" : String(t.name || "").trim() || "文本参数";
}
function ln(t) {
  return t ? t.type === "agent" ? !0 : t.type === "power" ? !_t(t.power, t.kind, t.outputType) && M(t.power?.kind, t.kind, t.outputType) : t.type === "asset" ? M(t.asset?.kind, t.kind, t.outputType) : M(t.kind, t.outputType) : !1;
}
function fn(t) {
  return !!(t?.type === "power" && t.composerDraft?.storyboardWorkType === "mv" && ht(t.power, t.kind, t.outputType));
}
function _(t) {
  const e = V(t), n = [];
  for (const [r, i] of Object.entries(e)) {
    const o = r.trim(), s = V(i), u = String(
      s.sourceNodeId ?? s.source_node_id ?? ""
    ).trim(), a = String(
      s.sourceOutput ?? s.source_output ?? N
    ).trim().toLowerCase();
    !o || b.has(o) || !u || a !== N || n.push([
      o,
      {
        sourceNodeId: u,
        sourceOutput: N
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function pn(t) {
  const e = _(t);
  if (e)
    return Object.fromEntries(
      Object.entries(e).map(([n, r]) => [
        n,
        {
          source_node_id: r.sourceNodeId,
          source_output: r.sourceOutput
        }
      ])
    );
}
function fe(t, e, n) {
  const r = e.trim(), i = n.trim();
  return !r || b.has(r) || !i ? t : {
    ...t,
    paramBindings: {
      ..._(t.paramBindings) || {},
      [r]: {
        sourceNodeId: i,
        sourceOutput: N
      }
    }
  };
}
function gn(t, e, n) {
  const r = e.trim();
  if (!r)
    return t;
  const i = n.trim();
  return !i || b.has(i) ? t : fe(
    ot(t, r),
    i,
    r
  );
}
function pe(t, e, n = []) {
  const r = e.trim(), i = _(t?.paramBindings);
  if (!r || !i)
    return;
  const o = Object.entries(i).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (o.length === 0)
    return;
  const s = new Map(
    n.map((a) => [a.key.trim(), le(a)])
  ), u = o.map(
    (a) => s.get(a) || "文本参数"
  );
  return {
    targetParamKeys: o,
    targetParamKey: o.length === 1 ? o[0] : void 0,
    label: u.length === 1 ? u[0] : `${u[0]} +${u.length - 1}`
  };
}
function yn(t, e, n = []) {
  const r = e.trim();
  if (r && String(t?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const i = pe(t, r, n);
  return i ? { ...i, purpose: "param" } : void 0;
}
function _n(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = it(t, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function it(t, e) {
  const n = e.trim(), r = _(t.paramBindings);
  if (!n || !r)
    return t;
  const i = Object.fromEntries(
    Object.entries(r).filter(
      ([, o]) => o.sourceNodeId !== n
    )
  );
  return Object.keys(i).length === Object.keys(r).length ? t : ge(t, i);
}
function ot(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = it(t, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: i, ...o } = r;
  return o;
}
function hn(t, e) {
  if (e.size === 0)
    return t;
  let n = !1;
  const r = t.map((i) => {
    let o = i.composerDraft;
    if (!o?.paramBindings && !o?.storyboardLyricsSourceNodeId)
      return i;
    for (const s of e)
      o = ot(o, s);
    return o === i.composerDraft ? i : (n = !0, { ...i, composerDraft: o });
  });
  return n ? r : t;
}
function P(t) {
  return String(t || "").trim().toLowerCase();
}
function M(...t) {
  const e = t.map(P).find(Boolean) || "";
  return ae.has(e);
}
function ge(t, e) {
  const { paramBindings: n, ...r } = t;
  return Object.keys(e).length > 0 ? { ...r, paramBindings: e } : r;
}
function st(t, e, n) {
  const r = e.trim(), i = n.trim();
  if (!r || b.has(r) || !i)
    return !1;
  const o = t?.[r];
  return !o || o.sourceNodeId === i;
}
function V(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const at = [
  {
    key: "start",
    label: "开始",
    description: "启动连接的创作节点，直到保存或展示。",
    runsInBackend: !1,
    persistsResult: !1,
    showsResult: !1,
    stopsExecution: !1
  },
  {
    key: "import",
    label: "引用",
    description: "选择资产并引用到当前节点。",
    runsInBackend: !1,
    persistsResult: !1,
    showsResult: !0,
    stopsExecution: !1
  },
  {
    key: "save",
    label: "保存",
    description: "将上游结果保存为当前资产类型的资产。",
    runsInBackend: !0,
    persistsResult: !0,
    showsResult: !0,
    stopsExecution: !0
  },
  {
    key: "display",
    label: "展示",
    description: "展示上游节点的结果。",
    runsInBackend: !0,
    persistsResult: !1,
    showsResult: !0,
    stopsExecution: !0
  }
], ye = new Map(
  at.map((t) => [t.key, t])
), bn = at.map(({ key: t, label: e, description: n }) => ({
  key: t,
  label: e,
  description: n
}));
function ut(t) {
  return ye.get(
    String(t || "").trim()
  );
}
function kn(t, e = "") {
  const n = he(t), r = k(n.key), i = ut(
    r || _e(e)
  );
  if (!i)
    return r ? {
      key: r,
      label: k(n.label),
      description: k(n.description)
    } : void 0;
  const o = k(n.label), s = k(n.description);
  return {
    key: i.key,
    label: i.key === "import" && o === "导入" ? i.label : o || i.label,
    description: i.key === "import" && s === "导入资产并连接到当前节点。" ? i.description : s || i.description
  };
}
function wn(t, e) {
  if (t.type !== "function")
    return !1;
  const n = ut(t.functionOption?.key);
  return !!(n && (!e || n.key === e));
}
function _e(t) {
  const e = t.trim();
  return e === "开始" ? "start" : e === "导入" || e === "引用" ? "import" : e === "展示" ? "display" : e.includes("保存") ? "save" : "";
}
function he(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function k(t) {
  return typeof t == "string" ? t.trim() : "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ct = B.joinSiteApi, dt = B.request;
async function Sn(t) {
  const e = L(
    await dt(ct("project/writing_command"), "post", t, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), n = wt(e);
  if (!n) throw new Error("创作响应缺少已保存版本");
  return n;
}
async function Cn(t) {
  const e = L(
    await dt(
      ct("project/writing_runs"),
      "get",
      {
        project_id: t.projectId,
        canvas_id: t.canvasId,
        work_asset_id: t.workAssetId,
        before_id: t.beforeId || 0
      },
      { reportError: !1 }
    ),
    "读取创作运行记录失败"
  );
  return {
    items: (Array.isArray(e.items) ? e.items : []).map(
      (n) => ({
        ...n,
        checkpoint: St(n.checkpoint)
      })
    ),
    hasMore: !!e.has_more,
    beforeId: Number(e.before_id || 0)
  };
}
function An(t, e) {
  const n = t || ke(), r = At({
    type: "stream",
    output: e
  }), i = r.event, o = r.activity, s = we(n.text, r.delta, e, i), u = Se(i, o) ? {
    ...n.output,
    ...r.output,
    ...s ? { text: s } : {}
  } : n.output, a = o && !o.anchorText ? { ...o, anchorText: s } : o, p = a ? xt(n.activities, a) : n.activities, l = Tt(
    It(n.document, r.output),
    G(r.output.document)
  ), g = U(u) || n.interaction, A = W(u);
  return {
    started: !0,
    text: s,
    output: u,
    activities: p,
    document: l,
    interaction: g,
    suggestions: A.length > 0 ? A : n.suggestions,
    error: r.error || n.error
  };
}
function xn(t) {
  const e = be(t);
  return {
    started: Object.keys(e).length > 0,
    text: E(e.text),
    output: e,
    activities: Ct(e),
    document: G(e.document),
    interaction: U(e),
    suggestions: W(e),
    error: E(e.error)
  };
}
function be(t) {
  const e = Nt(t);
  if (E(e.text))
    return e;
  const n = mt(t);
  if (!n)
    return e;
  const r = { ...e, text: n };
  return delete r.rich, r;
}
function Tn(t) {
  return !!(t && (t.started || t.text || t.activities.length > 0 || t.document || t.interaction || t.suggestions.length > 0 || Object.keys(t.output).length > 0));
}
function ke() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function we(t, e, n, r) {
  return e ? `${t}${e}` : r === "final" && E(n.text) || t;
}
function Se(t, e) {
  return !(e || t === "start" || t === "delta");
}
function E(t) {
  return t == null ? "" : String(t);
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const O = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!O || Object.keys(O).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ce = O.joinSiteApi;
async function In(t) {
  const e = String(t.requestId || "").trim();
  if (!e)
    throw new Error("request_id 不能为空");
  return yt({
    streamApi: Ae(t.projectId),
    requestID: e,
    lastID: t.lastId || "0-0",
    blockMs: 15e3,
    signal: t.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: t.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (n, r) => (t.onFrame(r), n)
  });
}
function Ae(t) {
  const e = new URL(Ce("run/stream"), window.location.origin);
  return e.searchParams.set("project_id", String(t || 0)), e.toString();
}
const I = /* @__PURE__ */ new Set();
let j = Date.now(), w;
function xe(t) {
  return I.add(t), w == null && typeof window < "u" && (j = Date.now(), w = window.setInterval(() => {
    j = Date.now(), I.forEach((e) => e());
  }, 1e3)), () => {
    I.delete(t), I.size === 0 && w != null && (window.clearInterval(w), w = void 0);
  };
}
function Te() {
  return () => {
  };
}
function q() {
  return j;
}
function Ie(t) {
  return Dt(
    t ? xe : Te,
    q,
    q
  );
}
function Nn({
  runTiming: t,
  runningNode: e,
  showEstimate: n = !0,
  active: r,
  observed: i = !1
}) {
  const o = r ?? bt(e), s = r !== void 0 ? t : o ? { startedAt: e?.startedAt || 0, finishedAt: void 0 } : Ne(e) || t, u = Ie(!!(o && s?.startedAt));
  if (!s?.startedAt || !o && (!s.finishedAt || s.finishedAt < s.startedAt))
    return null;
  const a = Math.max(
    0,
    (o ? u : s.finishedAt || s.startedAt) - s.startedAt
  ), p = Zt(
    a,
    o,
    e?.estimatedDurationMs
  ), l = `${i ? "本次查看" : ""}${p.elapsed}`, g = i ? l : n ? p.tooltip : l;
  return /* @__PURE__ */ d(K, { label: g, side: "top", sideOffset: 6, children: /* @__PURE__ */ v(
    "span",
    {
      className: `ws-node-run-timing${o ? " is-active" : ""}`,
      "aria-label": g,
      children: [
        /* @__PURE__ */ d(vt, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: l })
      ]
    }
  ) });
}
function Ne(t) {
  if (!(!t?.startedAt || !t.finishedAt))
    return {
      startedAt: t.startedAt,
      finishedAt: t.finishedAt
    };
}
function vn({
  label: t,
  overlay: e = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [i, o] = zt(r <= 0);
  return Ft(() => {
    if (r <= 0) {
      o(!0);
      return;
    }
    const s = window.setTimeout(() => o(!0), r);
    return () => window.clearTimeout(s);
  }, [r]), i ? /* @__PURE__ */ v(
    "div",
    {
      className: `ws-module-loading ${e ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ d(X, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: t })
      ]
    }
  ) : null;
}
function Rn({
  node: t,
  contentLabel: e,
  titleStatus: n,
  versionSelect: r,
  updatedAt: i,
  status: o,
  readonly: s,
  actions: u,
  downloadUrl: a,
  onRetry: p,
  onClose: l
}) {
  const g = t.type === "power" ? kt(t.power, t.kind, t.outputType) : null, A = g && g.outputName !== e ? `${g.outputName} · ${e}` : g?.outputName || e;
  return /* @__PURE__ */ d(
    lt,
    {
      icon: /* @__PURE__ */ d(Re, { node: t }),
      title: t.title || "节点详情",
      subtitle: A,
      titleStatus: n,
      versionSelect: r,
      state: s ? /* @__PURE__ */ d("span", { className: "wb-detail-state", children: "只读预览" }) : o === "error" ? /* @__PURE__ */ d(K, { label: "重试保存", children: /* @__PURE__ */ v(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: p,
          children: [
            /* @__PURE__ */ d(Rt, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ v("span", { className: `wb-detail-state is-${o}`, children: [
        o === "saving" ? /* @__PURE__ */ d(X, { size: 12, className: "wb-detail-spin" }) : null,
        ve(o)
      ] }),
      updatedAt: i,
      actions: u,
      downloadUrl: a,
      onClose: l
    }
  );
}
function ve(t) {
  return t === "dirty" ? "未保存" : t === "saving" ? "保存中" : "已保存";
}
function Re({ node: t }) {
  if (t.type === "power")
    return /* @__PURE__ */ d(
      Vt,
      {
        power: t.power,
        kind: t.kind,
        outputType: t.outputType,
        size: 16
      }
    );
  const e = Be(t);
  return /* @__PURE__ */ d(e, { size: 16 });
}
function Be(t) {
  return t.type === "agent" ? Bt : t.type === "flow" ? Et : t.type === "function" ? Mt : t.kind === "image" ? Pt : t.kind === "video" ? Ot : t.kind === "audio" ? jt : $t;
}
export {
  Z as $,
  ke as A,
  nn as B,
  vn as C,
  sn as D,
  In as E,
  Kt as F,
  ot as G,
  yn as H,
  ln as I,
  fn as J,
  dn as K,
  cn as L,
  gn as M,
  Rn as N,
  _n as O,
  mn as P,
  me as Q,
  Le as R,
  qt as S,
  qe as T,
  ce as U,
  Lt as V,
  hn as W,
  en as X,
  Je as Y,
  on as Z,
  rn as _,
  le as a,
  Jt as a0,
  An as a1,
  Tn as a2,
  an as a3,
  tt as a4,
  _ as a5,
  kn as a6,
  pn as a7,
  te as b,
  bn as c,
  Ze as d,
  et as e,
  Nn as f,
  Ue as g,
  We as h,
  Qe as i,
  Xe as j,
  Ye as k,
  Wt as l,
  Ke as m,
  Ge as n,
  x as o,
  Cn as p,
  Y as q,
  xn as r,
  Sn as s,
  ut as t,
  Ie as u,
  He as v,
  wn as w,
  Qt as x,
  un as y,
  tn as z
};
