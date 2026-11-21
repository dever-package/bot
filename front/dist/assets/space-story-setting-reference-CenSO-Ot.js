import { E as m, Y as d } from "./asset-audio-preview-CsYcyVm8.js";
import { g as ut, h as ct, y as dt, j as b, l as mt, m as pt } from "./space-assistant-layout-B9KyeCM0.js";
import { s as F } from "./space-content-view-YfCrbd08.js";
import { a8 as z, h as ft, j as lt, k as yt, t as L, a9 as _t, aa as gt, ab as A, ac as bt, U as kt, ad as ht, ae as St, af as U, Y as It, T as Tt } from "./asset-preview-DonyTaaN.js";
function he(t, e) {
  return (t?.outputType === "setting" || t?.outputType === "storyboard") && e?.outputType === "storyboard" ? "structure" : "media";
}
const xt = "story-compose-";
function Rt(t) {
  return t.purpose ? t.purpose : t.id.startsWith("script-item-edge-") || t.id.startsWith("script-compose-edge-") || t.id.startsWith(xt) ? "dependency" : t.id.startsWith("script-edge-") ? "structure" : "media";
}
function Se(t) {
  return Rt(t) === "media";
}
function Ie(t, e, n) {
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
const wt = [
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
function Te(t) {
  const e = Math.round(t * 10) / 10;
  return Number.isInteger(e) ? e.toString() : e.toFixed(1);
}
function xe() {
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
function Re(t) {
  const e = m(t);
  if (Number(e.version || 0) !== 3)
    return;
  const n = Array.isArray(e.clips) ? e.clips.map(O).filter(Boolean) : [], r = m(e.settings), i = Array.isArray(e.audioTracks ?? e.audio_tracks) ? (e.audioTracks ?? e.audio_tracks).map(D).filter(Boolean) : [], o = m(e.storyboardBaseline);
  return {
    version: 3,
    ...Array.isArray(o.clips) && Array.isArray(o.audioTracks) ? {
      storyboardBaseline: {
        clips: o.clips.map(O).filter(Boolean),
        audioTracks: o.audioTracks.map(D).filter(Boolean)
      }
    } : {},
    clips: n,
    audioTracks: i,
    settings: {
      resolution: c(r.resolution) || "auto",
      fps: f(r.fps, 0, 120, 0)
    }
  };
}
function we(t) {
  const e = t.clips.reduce(
    (r, i) => r + Math.max(0, i.duration),
    0
  ), n = t.clips.reduce((r, i, o) => o >= t.clips.length - 1 || i.transitionToNext.type === "none" ? r : r + i.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, e - n);
}
function Ne(t) {
  const e = t.clips.flatMap(
    (r, i) => G(r).map(
      (o) => `${r.title || `镜头 ${i + 1}`}：${o}`
    )
  ), n = t.audioTracks.flatMap(
    (r, i) => r.audio ? [] : [`全片声音 ${i + 1}：缺少音频素材`]
  );
  return [...e, ...n];
}
function G(t) {
  const e = [];
  t.visualVideo || e.push("缺少镜头视频素材");
  for (const n of t.speechTracks)
    n.audio || e.push(`语音“${n.text}”缺少音频素材`);
  for (const n of t.subtitleTracks)
    n.speechId && !t.speechTracks.some((r) => r.id === n.speechId) && e.push(`字幕“${n.text}”未找到对应语音`);
  return [...new Set(e)];
}
function Nt(t) {
  return t ? `${t.assetId}:${t.versionId}` : "";
}
function Ce(t) {
  return t ? [
    Nt(t),
    Number(t.mediaIndex || 0),
    t.mediaUrl || ""
  ].join(":") : "";
}
function O(t) {
  const e = m(t), n = c(e.id);
  if (!n)
    return null;
  const r = x(
    e.visualVideo ?? e.visual_video
  ), i = x(
    e.originalAudioSource ?? e.original_audio_source
  ), o = m(
    e.transitionToNext ?? e.transition_to_next
  ), s = Array.isArray(e.speechTracks ?? e.speech_tracks) ? (e.speechTracks ?? e.speech_tracks).map(At).filter(Boolean) : [], a = Array.isArray(
    e.subtitleTracks ?? e.subtitle_tracks
  ) ? (e.subtitleTracks ?? e.subtitle_tracks).map(Ct).filter(Boolean) : [], u = Pt(o.type), k = Math.round(f(o.soundLeadMs ?? o.sound_lead_ms, 0, 900, 0)), h = c(e.sourceEdgeId ?? e.source_edge_id), R = {
    id: n,
    title: c(e.title) || r?.label || "镜头",
    ...h ? { sourceEdgeId: h } : {},
    ...r ? { visualVideo: r } : {},
    ...i ? { originalAudioSource: i } : {},
    duration: Bt(e.duration),
    originalVolume: f(
      e.originalVolume ?? e.original_volume,
      0,
      1,
      1
    ),
    speechTracks: s,
    subtitleTracks: a,
    useOriginalVideo: Y(
      e.useOriginalVideo ?? e.use_original_video
    ),
    blockingIssues: [],
    transitionToNext: {
      type: u,
      ...u === "none" && k >= 100 ? { soundLeadMs: k } : {},
      durationMs: u === "none" ? 0 : f(
        o.durationMs ?? o.duration_ms,
        100,
        5e3,
        500
      )
    }
  };
  return R.blockingIssues = G(R), R;
}
function Ct(t) {
  const e = m(t), n = c(e.id), r = c(e.text);
  if (!n || !r)
    return null;
  const i = c(e.source) === "speech" ? "speech" : "caption", o = c(e.speechId ?? e.speech_id), s = d(e.endTime ?? e.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    ...s > 0 ? { endTime: s } : {},
    ...o ? { speechId: o } : {},
    source: i
  };
}
function At(t) {
  const e = m(t), n = c(e.id);
  if (!n)
    return null;
  const r = x(e.audio), i = c(e.kind) === "narration" ? "narration" : "dialogue", o = c(e.characterId ?? e.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, d(e.sourceStart ?? e.source_start)),
    fit: q(e.fit, "trim"),
    kind: i,
    ...o ? { characterId: o } : {},
    text: c(e.text),
    volume: f(e.volume, 0, 1, 1)
  };
}
function D(t) {
  const e = m(t), n = c(e.id);
  if (!n)
    return null;
  const r = x(e.audio), i = c(e.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, d(e.sourceStart ?? e.source_start)),
    kind: i,
    volume: f(e.volume, 0, 1, i === "music" ? 0.35 : 1),
    fit: q(e.fit, i === "music" ? "trim" : "strict"),
    loop: i === "music" && Y(e.loop),
    fadeOut: f(
      e.fadeOut ?? e.fade_out,
      0,
      10,
      i === "music" ? 1 : 0
    )
  };
}
function q(t, e) {
  return c(t) === "strict" ? "strict" : c(t) === "trim" ? "trim" : e;
}
function Bt(t) {
  const e = d(t);
  return e > 0 ? Math.max(1, Math.floor(e)) : 0;
}
function x(t) {
  const e = m(t), n = d(e.assetId ?? e.asset_id), r = d(e.versionId ?? e.version_id);
  if (!n || !r)
    return;
  const i = Mt(
    e.mediaItems ?? e.media_items ?? e.refMediaItems ?? e.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: c(e.label),
    ...d(e.mediaIndex ?? e.media_index) > 0 ? { mediaIndex: d(e.mediaIndex ?? e.media_index) } : {},
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
function Mt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t) {
    const i = m(r), o = c(i.url), s = d(i.index);
    if (!o && s <= 0)
      continue;
    const a = s > 0 ? `index:${s}` : `url:${o}`;
    n.has(a) || (n.add(a), e.push({
      url: o,
      index: s > 0 ? s : 0,
      ...c(i.usage) ? { usage: c(i.usage) } : {}
    }));
  }
  return e;
}
function Pt(t) {
  const e = c(t);
  return wt.some(
    (n) => n.options.some((r) => r.key === e)
  ) ? e : "none";
}
function c(t) {
  return String(t ?? "").trim();
}
function f(t, e, n, r) {
  const i = Number(t);
  return Number.isFinite(i) ? Math.min(n, Math.max(e, i)) : r;
}
function Y(t) {
  return t === !0 || t === 1 || t === "1" || t === "true";
}
function W(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return;
  const e = t, n = g(e.started_at ?? e.startedAt);
  if (n == null)
    return;
  const r = g(e.finished_at ?? e.finishedAt);
  return {
    startedAt: n,
    ...r != null && r >= n ? { finishedAt: r } : {}
  };
}
function vt(t) {
  const e = Number(t);
  return Number.isFinite(e) && e > 0 ? Math.round(e) : void 0;
}
function Ae({
  nodeRunTiming: t,
  runCreatedAt: e,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return g(t?.startedAt) ?? g(e) ?? g(n) ?? r;
}
function S(t) {
  const e = Math.max(0, Math.floor(t / 1e3)), n = e % 60, r = Math.floor(e / 60), i = r % 60, o = Math.floor(r / 60);
  return o > 0 ? `${o}:${I(i)}:${I(n)}` : `${I(r)}:${I(n)}`;
}
function Be(t, e, n) {
  const r = S(t);
  if (!e)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const i = vt(n);
  if (!i)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const o = t >= i ? `已超预计 ${S(t - i)}` : `剩余约 ${S(i - t)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: o,
    tooltip: `已运行 ${r}，历史平均约 ${S(i)}，${o}`
  };
}
function g(t) {
  if (typeof t == "number" && Number.isFinite(t) && t > 0)
    return t < 1e12 ? t * 1e3 : t;
  if (typeof t != "string" || !t.trim())
    return;
  const e = Date.parse(t);
  return Number.isFinite(e) ? e : void 0;
}
function I(t) {
  return String(t).padStart(2, "0");
}
function Me(t) {
  const e = Number(t.execution_id || 0);
  if (e > 0)
    return `execution:${e}`;
  const n = Number(t.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(t.request_id || "")}`;
}
function Pe(t) {
  const e = String(t.status || "").trim();
  return e ? ut(e) || ct(e) : !1;
}
function ve(t) {
  if (!t)
    return "";
  const e = String(
    t.status || t.result?.status || ""
  ).trim();
  return e ? b(e) : "";
}
function $t(t) {
  const e = String(t || "").trim();
  return !!e && dt(e);
}
function $e(t, e) {
  const n = t.target_node_ids || [];
  if (!$t(t.status) || n.length === 0)
    return !1;
  const r = Number(t.canvas_id || 0), i = Number(t.asset_cate_id || 0), o = r ? [e[String(r)]].filter(Boolean) : Object.values(e).filter(
    (s) => !i || s.assetCateId === i
  );
  return o.length > 0 && o.every((s) => {
    const a = new Set(s.nodes.map((u) => u.id));
    return n.every((u) => !a.has(u));
  });
}
function Ee(t) {
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
    status: b(t?.status || n.status),
    error: p(t?.error || n.error),
    executed: Number(t?.executed || t?.output?.executed || 0),
    total: Number(t?.total || t?.output?.total || 0),
    single_node: !!t?.single_node,
    created_at: String(t?.created_at || ""),
    updated_at: String(t?.updated_at || ""),
    title: String(t?.title || ""),
    output: t?.output || n.output,
    approvals: Array.isArray(t?.approvals) ? t.approvals : Array.isArray(t?.data?.approvals) ? t.data.approvals : [],
    interactions: Array.isArray(t?.interactions) ? t.interactions : Array.isArray(t?.data?.interactions) ? t.data.interactions : [],
    node_results: X(
      t?.node_results || e.node_results
    ),
    pending_node: B(
      t?.pending_node || e.pending_node
    ),
    execution_plan: Dt(t?.execution_plan),
    node_runs: Array.isArray(t?.node_runs) ? t.node_runs.map(jt).filter((r) => !!r) : []
  };
}
function B(t) {
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
    status: b(t.status || t.result?.status),
    error: p(t.error),
    output: t.output,
    asset: t.asset,
    version: t.version,
    result: t.result,
    approval: t.approval,
    interaction: t.interaction,
    persists_result: !!t.persists_result,
    agent_run_id: Number(t.agent_run_id || 0),
    runTiming: W(t.run_timing)
  } : null;
}
function X(t) {
  return Array.isArray(t) ? t.map(B).filter((e) => !!e) : [];
}
function Oe(t, e = "") {
  if (!t || typeof t != "object")
    return null;
  const n = String(e || "").trim(), r = X(t.node_results), i = n ? r.find((o) => o.node_key === n) : r[0];
  return i || B(
    n && !String(t.node_key || "").trim() ? { ...t, node_key: n } : t
  );
}
function H(t) {
  return t ? Q(
    t.error,
    t.result?.error,
    t.output?.error
  ) : "";
}
function Et(t) {
  if (!t)
    return "";
  const e = [...t.node_results || []].reverse().find((n) => b(
    n.status || n.result?.status
  ) === "fail");
  return Q(
    H(e),
    t.output?.error,
    t.error
  );
}
function De(t, e = "节点运行失败") {
  return J(
    H(t),
    e
  );
}
function Ve(t, e = "画布运行失败") {
  return J(Et(t), e);
}
function J(t, e = "运行失败") {
  const n = p(t);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : e;
}
function Ot(...t) {
  for (const e of t) {
    const n = p(e);
    if (n)
      return n;
  }
  return "";
}
const Z = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function Ke(t) {
  return Z.has(p(t));
}
function je(t) {
  const e = p(t);
  return e.includes("运行已取消") || e.includes("运行已停止");
}
function Q(...t) {
  let e = "";
  for (const n of t) {
    const r = p(n);
    if (r && (e ||= r, !Z.has(r)))
      return r;
  }
  return e;
}
function p(t) {
  if (typeof t == "string")
    return t.trim();
  if (t instanceof Error)
    return t.message.trim();
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, n = Ot(e.error, e.message, e.msg);
  if (n)
    return n;
  const r = p(e.code), i = p(e.detail);
  return [r, i].filter(Boolean).join(": ");
}
function Dt(t) {
  if (!t || typeof t != "object")
    return null;
  const e = Array.isArray(t.nodes) ? t.nodes.map(Vt).filter((r) => !!r) : [], n = Array.isArray(t.edges) ? t.edges.map(Kt).filter((r) => !!r) : [];
  return {
    nodes: e,
    edges: n,
    incoming: V(t.incoming),
    outgoing: V(t.outgoing),
    order: Array.isArray(t.order) ? t.order.map((r) => String(r || "")).filter(Boolean) : e.map((r) => r.id)
  };
}
function Vt(t) {
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
function Kt(t) {
  const e = String(t?.source || ""), n = String(t?.target || "");
  return !e || !n ? null : {
    id: String(t?.id || `${e}-${n}`),
    source: e,
    target: n
  };
}
function V(t) {
  const e = /* @__PURE__ */ new Map();
  if (!t || typeof t != "object" || Array.isArray(t))
    return e;
  for (const [n, r] of Object.entries(t)) {
    const i = Array.isArray(r) ? r.map((o) => String(o || "")).filter(Boolean) : [];
    e.set(String(n), i);
  }
  return e;
}
function jt(t) {
  const e = String(t?.node_key || ""), n = Number(t?.node_run_id || 0);
  return !e || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(t?.node_id || 0),
    node_key: e,
    node_type: String(t?.node_type || ""),
    status: b(t?.status),
    persists_result: !!t?.persists_result,
    runTiming: W(t?.run_timing)
  };
}
const T = "primary_text", Ft = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), zt = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), y = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function Lt(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t) {
    const i = String(r.key || "").trim(), o = String(r.type || "").trim().toLowerCase(), s = String(r.value_type || "string").trim().toLowerCase();
    !i || y.has(i) || e.has(i) || !Ft.has(o) || s === "number" || (e.add(i), n.push(i === r.key ? r : { ...r, key: i }));
  }
  return n;
}
function Ut(t, e, n) {
  const r = n.trim(), i = l(e?.paramBindings);
  return Lt(t).filter(
    (o) => nt(i, o.key, r)
  );
}
function Fe(t, e, n) {
  return nt(
    l(t?.paramBindings),
    e,
    n
  );
}
function Gt(t) {
  if (t.length !== 1)
    return;
  const e = t[0], n = String(e.key || "").trim();
  return n && !y.has(n) ? n : void 0;
}
function qt(t) {
  const e = Gt(t);
  return e ? { kind: "automatic", targetParamKey: e } : t.length > 1 ? { kind: "choose", params: t } : { kind: "unavailable" };
}
function ze(t, e, n = !1) {
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
function Le(t, e, n) {
  const r = l(e?.paramBindings), i = new Set(
    Object.values(r || {}).map((u) => u.sourceNodeId)
  ), o = [
    ...new Set(t.map((u) => u.trim()).filter(Boolean))
  ].filter((u) => !i.has(u));
  if (o.length !== 1)
    return;
  const s = o[0], a = qt(
    Ut(n, e, s)
  );
  return a.kind === "automatic" ? { sourceNodeId: s, targetParamKey: a.targetParamKey } : void 0;
}
function Yt(t) {
  return C(t.type) === "prompt" || C(t.key) === "prompt" ? "提示词" : String(t.name || "").trim() || "文本参数";
}
function Ue(t) {
  return !t || t.outputType === "setting" || t.outputType === "storyboard" ? !1 : t.type === "agent" ? !0 : t.type === "power" ? !mt(t.power, t.kind, t.outputType) && w(t.power?.kind, t.kind, t.outputType) : t.type === "asset" ? w(t.asset?.kind, t.kind, t.outputType) : w(t.kind, t.outputType);
}
function Ge(t) {
  return !!(t?.type === "power" && t.composerDraft?.storyboardWorkType === "mv" && pt(t.power, t.kind, t.outputType));
}
function l(t) {
  const e = K(t), n = [];
  for (const [r, i] of Object.entries(e)) {
    const o = r.trim(), s = K(i), a = String(
      s.sourceNodeId ?? s.source_node_id ?? ""
    ).trim(), u = String(
      s.sourceOutput ?? s.source_output ?? T
    ).trim().toLowerCase();
    !o || y.has(o) || !a || u !== T || n.push([
      o,
      {
        sourceNodeId: a,
        sourceOutput: T
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function qe(t) {
  const e = l(t);
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
function Wt(t, e, n) {
  const r = e.trim(), i = n.trim();
  return !r || y.has(r) || !i ? t : {
    ...t,
    paramBindings: {
      ...l(t.paramBindings) || {},
      [r]: {
        sourceNodeId: i,
        sourceOutput: T
      }
    }
  };
}
function Ye(t, e, n) {
  const r = e.trim();
  if (!r)
    return t;
  const i = n.trim();
  return !i || y.has(i) ? t : Wt(
    et(t, r),
    i,
    r
  );
}
function Xt(t, e, n = []) {
  const r = e.trim(), i = l(t?.paramBindings);
  if (!r || !i)
    return;
  const o = Object.entries(i).filter(([, u]) => u.sourceNodeId === r).map(([u]) => u).sort();
  if (o.length === 0)
    return;
  const s = new Map(
    n.map((u) => [u.key.trim(), Yt(u)])
  ), a = o.map(
    (u) => s.get(u) || "文本参数"
  );
  return {
    targetParamKeys: o,
    targetParamKey: o.length === 1 ? o[0] : void 0,
    label: a.length === 1 ? a[0] : `${a[0]} +${a.length - 1}`
  };
}
function We(t, e, n = []) {
  const r = e.trim();
  if (r && String(t?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const i = Xt(t, r, n);
  return i ? { ...i, purpose: "param" } : void 0;
}
function Xe(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = tt(t, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function tt(t, e) {
  const n = e.trim(), r = l(t.paramBindings);
  if (!n || !r)
    return t;
  const i = Object.fromEntries(
    Object.entries(r).filter(
      ([, o]) => o.sourceNodeId !== n
    )
  );
  return Object.keys(i).length === Object.keys(r).length ? t : Ht(t, i);
}
function et(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = tt(t, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: i, ...o } = r;
  return o;
}
function He(t, e) {
  if (e.size === 0)
    return t;
  let n = !1;
  const r = t.map((i) => {
    let o = i.composerDraft;
    if (!o?.paramBindings && !o?.storyboardLyricsSourceNodeId)
      return i;
    for (const s of e)
      o = et(o, s);
    return o === i.composerDraft ? i : (n = !0, { ...i, composerDraft: o });
  });
  return n ? r : t;
}
function C(t) {
  return String(t || "").trim().toLowerCase();
}
function w(...t) {
  const e = t.map(C).find(Boolean) || "";
  return zt.has(e);
}
function Ht(t, e) {
  const { paramBindings: n, ...r } = t;
  return Object.keys(e).length > 0 ? { ...r, paramBindings: e } : r;
}
function nt(t, e, n) {
  const r = e.trim(), i = n.trim();
  if (!r || y.has(r) || !i)
    return !1;
  const o = t?.[r];
  return !o || o.sourceNodeId === i;
}
function K(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const rt = [
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
], Jt = new Map(
  rt.map((t) => [t.key, t])
), Je = rt.map(({ key: t, label: e, description: n }) => ({
  key: t,
  label: e,
  description: n
}));
function it(t) {
  return Jt.get(
    String(t || "").trim()
  );
}
function Ze(t, e = "") {
  const n = Qt(t), r = _(n.key), i = it(
    r || Zt(e)
  );
  if (!i)
    return r ? {
      key: r,
      label: _(n.label),
      description: _(n.description)
    } : void 0;
  const o = _(n.label), s = _(n.description);
  return {
    key: i.key,
    label: i.key === "import" && o === "导入" ? i.label : o || i.label,
    description: i.key === "import" && s === "导入资产并连接到当前节点。" ? i.description : s || i.description
  };
}
function Qe(t, e) {
  if (t.type !== "function")
    return !1;
  const n = it(t.functionOption?.key);
  return !!(n && (!e || n.key === e));
}
function Zt(t) {
  const e = t.trim();
  return e === "开始" ? "start" : e === "导入" || e === "引用" ? "import" : e === "展示" ? "display" : e.includes("保存") ? "save" : "";
}
function Qt(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function _(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ot(t, e) {
  return `${t}:${e}`;
}
const te = [
  "characters",
  "scenes",
  "props"
], tn = [
  N("characters", "角色组", "character", 0),
  N("scenes", "场景组", "scene", 1),
  N("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: te,
    layoutIndex: 0,
    enabled: z,
    items: ne
  },
  {
    key: "shots",
    title: "镜头视频组",
    itemType: "shot",
    powerKind: "video",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ["shot_images"],
    layoutIndex: 1,
    enabled: ft,
    items: ee
  },
  {
    key: "speech",
    title: "配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: lt,
    items: re
  },
  {
    key: "subtitles",
    title: "字幕组",
    itemType: "subtitle",
    powerKind: "text",
    outputType: "general",
    local: !0,
    direction: "downstream",
    layoutIndex: 3,
    enabled: yt,
    items: oe
  }
];
function ee(t) {
  const e = bt(t);
  return t.shots.map((n, r) => {
    const { start: i, end: o } = L(t.shots, r, t.chapter_boundary?.connection === "continue");
    return {
      type: "shot",
      visualContext: P(t, A(t, n)),
      id: n.id,
      title: "镜头 " + (n.order || r + 1),
      prompt: pe(t, n),
      referenceItems: (i ? [i, o] : [o]).map((s) => M(s.shotId, s.role)),
      externalReferences: le(t, n),
      paramValues: {
        aspectRatio: t.aspect_ratio,
        duration: n.duration,
        referenceMode: "frames"
      },
      shotId: n.id,
      shotImageMode: "first_last",
      sharedStartShotId: i && i.shotId !== n.id ? i.shotId : void 0,
      shotDuration: n.duration,
      requiredDurationValues: e,
      continuityAnchor: n.continuity_anchor
    };
  });
}
function M(t, e) {
  return { type: "shot_image", id: It(t, e) };
}
function ne(t) {
  return t.shots.flatMap((e, n) => {
    const r = n === 0 && t.chapter_boundary?.connection === "continue", { start: i } = L(t.shots, n, r);
    return (i?.shotId === e.id ? ["start", "end"] : ["end"]).map((s) => {
      const a = s === "end" ? "last_frame" : "first_frame", u = ce(t, e, n, s, r);
      return {
        ...M(e.id, s),
        visualContext: P(t, A(t, e)),
        title: "镜头 " + (e.order || n + 1) + " " + gt[a],
        prompt: me(e, s),
        ...u,
        paramValues: { aspectRatio: t.aspect_ratio },
        shotId: e.id,
        shotImageMode: a,
        frameRole: s,
        frameMediaItems: _t(a)
      };
    });
  });
}
function N(t, e, n, r) {
  return {
    key: t,
    title: e,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (i, o) => z(i) && i.materials.some(j(n, o)),
    items: (i, o) => i.materials.filter(j(n, o)).map((s) => {
      const a = fe(
        i,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: ae(s),
        visualContext: P(i, [s]),
        externalReferences: a
      };
    })
  };
}
function j(t, e) {
  return (n) => n.type === t && !e?.settingItemKeys?.has(
    ot(n.type, n.id)
  );
}
function re(t) {
  const e = t.narrator_voice.trim();
  return [...kt(t).map(({ speech: r, shotId: i }, o) => ({
    type: "speech",
    id: r.id,
    title: `旁白 ${o + 1}`,
    prompt: r.text.trim(),
    ...e ? { paramValues: { voice: e } } : {},
    shotId: i,
    speechId: r.id,
    speechKind: "narration",
    startTime: r.start_time
  })), ...t.shots.flatMap(
    (r, i) => r.speech.filter((o) => o.kind === "dialogue" && o.text.trim()).map((o, s) => {
      const a = ie(t, o);
      return {
        type: "speech",
        id: o.id,
        title: se(
          t,
          o,
          r.order || i + 1,
          s
        ),
        prompt: o.text.trim(),
        ...a ? { paramValues: { voice: a } } : {},
        shotId: r.id,
        speechId: o.id,
        characterId: o.character_id,
        speechKind: o.kind,
        speakerMode: o.speaker_mode,
        startTime: o.start_time,
        shotDuration: r.duration
      };
    })
  )];
}
function ie(t, e) {
  return e.kind === "narration" ? t.narrator_voice.trim() : (t.materials.find(
    (n) => n.type === "character" && n.id === e.character_id
  )?.voice || "").trim();
}
function oe(t) {
  return t.shots.flatMap((e, n) => {
    const r = ht(e);
    return r.length ? [
      {
        type: "subtitle",
        id: e.id,
        title: `镜头 ${e.order || n + 1} 字幕`,
        prompt: r.map((i) => i.text).join(" / "),
        localOutput: {
          type: "storyboard_subtitles",
          shot_id: e.id,
          tracks: r
        },
        shotId: e.id,
        shotDuration: e.duration
      }
    ] : [];
  });
}
function se(t, e, n, r) {
  if (e.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const i = t.materials.find(
    (o) => o.type === "character" && o.id === e.character_id
  );
  return `镜头 ${n} ${i?.name || "角色"}配音`;
}
function P(t, e) {
  return JSON.stringify([
    t.visual_mode,
    t.style_prompt.trim(),
    e.map((n) => [n.id, n.type, n.name, n.prompt.trim()])
  ]);
}
function ae(t) {
  return t.prompt.trim() || `${t.name}素材`;
}
function ue(t) {
  return t.map((e) => ({
    type: e.type,
    id: e.id
  }));
}
function ce(t, e, n, r, i) {
  const o = St(
    t.shots,
    n,
    r,
    t.materials
  ), s = !i && o.anchorID && o.anchorFrameRole ? M(o.anchorID, o.anchorFrameRole) : void 0, a = new Set(i ? e.material_ids : o.materialIDs), u = A(t, e).filter(
    (h) => a.has(h.id)
  ), k = de(
    t,
    i ? e.reference_keys : o.referenceKeys,
    i || o.includeGlobalReferences,
    u
  );
  return {
    dependencyItems: s ? [s] : [],
    referenceItems: [...s ? [s] : [], ...ue(u)],
    externalReferences: k
  };
}
function de(t, e, n, r) {
  const i = new Set(
    r.flatMap((s) => s.reference_keys)
  );
  if (r.length)
    for (const s of v(t, "image"))
      i.add(s.key);
  const o = new Set(e);
  return $(
    t.references.filter(
      (s) => s.kind === "image" && !i.has(s.key) && (at.image.has(s.purpose) ? n : o.has(s.key))
    )
  );
}
function me(t, e) {
  const n = U(t, e), r = e === "end" ? t.continuity_state.exit.trim() : t.continuity_state.entry.trim();
  return st([
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `${e === "end" ? "尾帧" : "首帧"}状态：${r}`,
    n ? "静态构图：" + n : ""
  ]);
}
function pe(t, e) {
  const n = U(e, "video");
  return st([
    `画面内容：${e.description.trim()}`,
    e.spatial_layout.trim() ? `空间关系：${e.spatial_layout.trim()}` : "",
    `起始状态：${e.continuity_state.entry.trim()}`,
    e.start_framing?.trim() ? `起始构图：${e.start_framing.trim()}` : "",
    `结束状态：${e.continuity_state.exit.trim()}`,
    e.end_framing?.trim() ? `结束构图：${e.end_framing.trim()}` : "",
    e.handoff?.incoming ? "本段入点：" + e.handoff.incoming : "",
    e.handoff?.outgoing ? "本段出点：" + e.handoff.outgoing : "",
    e.handoff?.camera_path ? "连续经过的空间路线：" + e.handoff.camera_path : "",
    e.camera_instruction.trim() ? `运镜：${e.camera_instruction.trim()}` : "",
    n ? "镜内动作与声音：" + n : "",
    ...Tt(t) ? [
      "声音方式：视频原声",
      ...e.speech.filter((r) => r.text.trim()).map((r) => {
        const i = t.materials.find((a) => a.id === r.character_id), o = r.kind === "narration" ? "旁白" : i?.name || r.character_id, s = r.kind === "narration" ? t.narrator_voice : i?.voice;
        return `${r.start_time}秒，${o}（${r.kind === "narration" || r.speaker_mode === "offscreen" ? "画外" : "出镜"}）：${r.text}${s ? `；声线：${s}` : ""}`;
      })
    ] : []
  ]);
}
function st(t) {
  return t.filter(Boolean).join(`
`);
}
function fe(t, e) {
  return $([
    ...t.references.filter(
      (n) => n.kind === "image" && e.reference_keys.includes(n.key)
    ),
    ...v(t, "image")
  ]);
}
function le(t, e) {
  return $([
    ...t.references.filter(
      (n) => n.kind === "video" && e.reference_keys.includes(n.key)
    ),
    ...v(t, "video")
  ]);
}
const at = {
  image: /* @__PURE__ */ new Set([
    "visual_style",
    "brand_style"
  ]),
  video: /* @__PURE__ */ new Set([
    "visual_style",
    "motion_style",
    "performance",
    "brand_style"
  ])
};
function v(t, e) {
  const n = at[e];
  return t.references.filter(
    (r) => r.kind === e && n.has(r.purpose)
  );
}
function $(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    n.has(r.asset_id) || (n.add(r.asset_id), e.push(r));
  return e;
}
function ye(t) {
  return F(t)?.materials || [];
}
function E(t, e) {
  return t.find((n) => n.id === e && n.type === "power" && n.outputType === "setting");
}
function en(t, e, n) {
  for (const r of e) {
    if ((r.logicalTo || r.to) !== n || r.executionMode === "manual") continue;
    const i = E(t, r.logicalFrom || r.from);
    if (i) return i;
  }
}
function nn(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of e) {
    if ((i.logicalTo || i.to) !== n || i.executionMode === "manual")
      continue;
    const o = E(t, i.logicalFrom || i.from);
    if (o)
      for (const s of t) {
        const a = s.storyboardItem;
        a?.sourceNodeId === o.id && ["character", "scene", "prop"].includes(a.itemType) && r.set(ot(a.itemType, a.itemId), s);
      }
  }
  return r;
}
function rn(t, e) {
  const n = t.storyboardItem;
  if (!n || !["character", "scene", "prop"].includes(n.itemType) || !t.asset && !t.resultRef && t.resultOutput == null)
    return "";
  const r = E(e, n.sourceNodeId);
  if (!r) return "";
  const i = ye(r).find(
    (a) => a.id === n.itemId
  );
  if (!i) return "此设定已移除；旧形象仍保留，请更新分镜引用";
  const o = t.asset?.version?.source?.story_setting;
  if (!o) return "此形象尚未绑定当前设定，请重新生成";
  if (o.name !== i.name || o.prompt !== i.prompt)
    return "设定已更新；当前显示旧形象，重新生成后用于后续制作";
  const s = F(r);
  return o.visual_mode !== s.visual_mode || o.aspect_ratio !== s.aspect_ratio || o.style_prompt_input !== s.style_prompt ? "全片画风或画幅已更新；当前显示旧形象，请重新生成" : "";
}
export {
  Ze as $,
  $t as A,
  je as B,
  ve as C,
  Ee as D,
  Ve as E,
  rn as F,
  Rt as G,
  et as H,
  We as I,
  ze as J,
  Fe as K,
  Ye as L,
  Xe as M,
  Le as N,
  qt as O,
  Ie as P,
  E as Q,
  He as R,
  tn as S,
  $e as T,
  Ae as U,
  wt as V,
  De as W,
  Oe as X,
  W as Y,
  vt as Z,
  l as _,
  Yt as a,
  qe as a0,
  Ke as a1,
  H as a2,
  Be as a3,
  Et as b,
  Je as c,
  Me as d,
  J as e,
  xe as f,
  Te as g,
  we as h,
  Pe as i,
  Ne as j,
  Nt as k,
  Se as l,
  S as m,
  Re as n,
  G as o,
  nn as p,
  ot as q,
  xt as r,
  en as s,
  he as t,
  Qe as u,
  Ce as v,
  Ue as w,
  Ge as x,
  Ut as y,
  it as z
};
