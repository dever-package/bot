import { _ as p, am as f, aw as L, q as U, u as ft, v as pt, z as q, ax as lt, ay as _t, az as B, aA as yt, aB as gt, Z as ht, aC as bt, aD as kt, aE as G, a3 as St, Y as D, X as It } from "./asset-audio-preview-DlcU6JQ0.js";
import { g as Tt, h as xt, y as Rt, j as S, l as wt, m as Nt } from "./space-assistant-layout-B9KyeCM0.js";
import { s as Y } from "./space-content-view-BelgOwBR.js";
function Te(t, e) {
  return (t?.outputType === "setting" || t?.outputType === "storyboard") && e?.outputType === "storyboard" ? "structure" : "media";
}
const Ct = "story-compose-";
function At(t) {
  return t.purpose ? t.purpose : t.id.startsWith("script-item-edge-") || t.id.startsWith("script-compose-edge-") || t.id.startsWith(Ct) ? "dependency" : t.id.startsWith("script-edge-") ? "structure" : "media";
}
function xe(t) {
  return At(t) === "media";
}
function Re(t, e, n) {
  const r = new Map(n.map((i) => [i.id, i])), o = new Set(t.map((i) => i.id));
  return [
    ...t.flatMap((i) => {
      if (!e.has(i.id))
        return [i];
      const s = r.get(i.id);
      return s ? [s] : [];
    }),
    ...n.filter((i) => !o.has(i.id))
  ];
}
const Bt = [
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
function we(t) {
  const e = Math.round(t * 10) / 10;
  return Number.isInteger(e) ? e.toString() : e.toFixed(1);
}
function Ne() {
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
function Ce(t) {
  const e = p(t);
  if (Number(e.version || 0) !== 3)
    return;
  const n = Array.isArray(e.clips) ? e.clips.map(V).filter(Boolean) : [], r = p(e.settings), o = Array.isArray(e.audioTracks ?? e.audio_tracks) ? (e.audioTracks ?? e.audio_tracks).map(K).filter(Boolean) : [], i = p(e.storyboardBaseline);
  return {
    version: 3,
    ...Array.isArray(i.clips) && Array.isArray(i.audioTracks) ? {
      storyboardBaseline: {
        clips: i.clips.map(V).filter(Boolean),
        audioTracks: i.audioTracks.map(K).filter(Boolean)
      }
    } : {},
    clips: n,
    audioTracks: o,
    settings: {
      resolution: c(r.resolution) || "auto",
      fps: y(r.fps, 0, 120, 0)
    }
  };
}
function Ae(t) {
  const e = t.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = t.clips.reduce((r, o, i) => i >= t.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, e - n);
}
function Be(t) {
  const e = t.clips.flatMap(
    (r, o) => W(r).map(
      (i) => `${r.title || `镜头 ${o + 1}`}：${i}`
    )
  ), n = t.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...e, ...n];
}
function W(t) {
  const e = [];
  t.visualVideo || e.push("缺少镜头视频素材");
  for (const n of t.speechTracks)
    n.audio || e.push(`语音“${n.text}”缺少音频素材`);
  for (const n of t.subtitleTracks)
    n.speechId && !t.speechTracks.some((r) => r.id === n.speechId) && e.push(`字幕“${n.text}”未找到对应语音`);
  return [...new Set(e)];
}
function vt(t) {
  return t ? `${t.assetId}:${t.versionId}` : "";
}
function ve(t) {
  return t ? [
    vt(t),
    Number(t.mediaIndex || 0),
    t.mediaUrl || ""
  ].join(":") : "";
}
function V(t) {
  const e = p(t), n = c(e.id);
  if (!n)
    return null;
  const r = w(
    e.visualVideo ?? e.visual_video
  ), o = w(
    e.originalAudioSource ?? e.original_audio_source
  ), i = p(
    e.transitionToNext ?? e.transition_to_next
  ), s = Array.isArray(e.speechTracks ?? e.speech_tracks) ? (e.speechTracks ?? e.speech_tracks).map(Pt).filter(Boolean) : [], a = Array.isArray(
    e.subtitleTracks ?? e.subtitle_tracks
  ) ? (e.subtitleTracks ?? e.subtitle_tracks).map(Mt).filter(Boolean) : [], u = Ot(i.type), d = Math.round(y(i.soundLeadMs ?? i.sound_lead_ms, 0, 900, 0)), m = c(e.sourceEdgeId ?? e.source_edge_id), l = {
    id: n,
    title: c(e.title) || r?.label || "镜头",
    ...m ? { sourceEdgeId: m } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: $t(e.duration),
    originalVolume: y(
      e.originalVolume ?? e.original_volume,
      0,
      1,
      1
    ),
    speechTracks: s,
    subtitleTracks: a,
    useOriginalVideo: Z(
      e.useOriginalVideo ?? e.use_original_video
    ),
    blockingIssues: [],
    transitionToNext: {
      type: u,
      ...u === "none" && d >= 100 ? { soundLeadMs: d } : {},
      durationMs: u === "none" ? 0 : y(
        i.durationMs ?? i.duration_ms,
        100,
        5e3,
        500
      )
    }
  };
  return l.blockingIssues = W(l), l;
}
function Mt(t) {
  const e = p(t), n = c(e.id), r = c(e.text);
  if (!n || !r)
    return null;
  const o = c(e.source) === "speech" ? "speech" : "caption", i = c(e.speechId ?? e.speech_id), s = f(e.endTime ?? e.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, f(e.startTime ?? e.start_time)),
    ...s > 0 ? { endTime: s } : {},
    ...i ? { speechId: i } : {},
    source: o
  };
}
function Pt(t) {
  const e = p(t), n = c(e.id);
  if (!n)
    return null;
  const r = w(e.audio), o = c(e.kind) === "narration" ? "narration" : "dialogue", i = c(e.characterId ?? e.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, f(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, f(e.sourceStart ?? e.source_start)),
    fit: X(e.fit, "trim"),
    kind: o,
    ...i ? { characterId: i } : {},
    text: c(e.text),
    volume: y(e.volume, 0, 1, 1)
  };
}
function K(t) {
  const e = p(t), n = c(e.id);
  if (!n)
    return null;
  const r = w(e.audio), o = c(e.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, f(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, f(e.sourceStart ?? e.source_start)),
    kind: o,
    volume: y(e.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: X(e.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && Z(e.loop),
    fadeOut: y(
      e.fadeOut ?? e.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function X(t, e) {
  return c(t) === "strict" ? "strict" : c(t) === "trim" ? "trim" : e;
}
function $t(t) {
  const e = f(t);
  return e > 0 ? Math.max(1, Math.floor(e)) : 0;
}
function w(t) {
  const e = p(t), n = f(e.assetId ?? e.asset_id), r = f(e.versionId ?? e.version_id);
  if (!n || !r)
    return;
  const o = Et(
    e.mediaItems ?? e.media_items ?? e.refMediaItems ?? e.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: c(e.label),
    ...f(e.mediaIndex ?? e.media_index) > 0 ? { mediaIndex: f(e.mediaIndex ?? e.media_index) } : {},
    ...c(e.mediaUrl ?? e.media_url) ? { mediaUrl: c(e.mediaUrl ?? e.media_url) } : {},
    ...c(
      e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
    ) ? {
      mediaThumbnail: c(
        e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function Et(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t) {
    const o = p(r), i = c(o.url), s = f(o.index);
    if (!i && s <= 0)
      continue;
    const a = s > 0 ? `index:${s}` : `url:${i}`;
    n.has(a) || (n.add(a), e.push({
      url: i,
      index: s > 0 ? s : 0,
      ...c(o.usage) ? { usage: c(o.usage) } : {}
    }));
  }
  return e;
}
function Ot(t) {
  const e = c(t);
  return Bt.some(
    (n) => n.options.some((r) => r.key === e)
  ) ? e : "none";
}
function c(t) {
  return String(t ?? "").trim();
}
function y(t, e, n, r) {
  const o = Number(t);
  return Number.isFinite(o) ? Math.min(n, Math.max(e, o)) : r;
}
function Z(t) {
  return t === !0 || t === 1 || t === "1" || t === "true";
}
function H(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return;
  const e = t, n = k(e.started_at ?? e.startedAt);
  if (n == null)
    return;
  const r = k(e.finished_at ?? e.finishedAt);
  return {
    startedAt: n,
    ...r != null && r >= n ? { finishedAt: r } : {}
  };
}
function Dt(t) {
  const e = Number(t);
  return Number.isFinite(e) && e > 0 ? Math.round(e) : void 0;
}
function Me({
  nodeRunTiming: t,
  runCreatedAt: e,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return k(t?.startedAt) ?? k(e) ?? k(n) ?? r;
}
function T(t) {
  const e = Math.max(0, Math.floor(t / 1e3)), n = e % 60, r = Math.floor(e / 60), o = r % 60, i = Math.floor(r / 60);
  return i > 0 ? `${i}:${x(o)}:${x(n)}` : `${x(r)}:${x(n)}`;
}
function Pe(t, e, n) {
  const r = T(t);
  if (!e)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const o = Dt(n);
  if (!o)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const i = t >= o ? `已超预计 ${T(t - o)}` : `剩余约 ${T(o - t)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: i,
    tooltip: `已运行 ${r}，历史平均约 ${T(o)}，${i}`
  };
}
function k(t) {
  if (typeof t == "number" && Number.isFinite(t) && t > 0)
    return t < 1e12 ? t * 1e3 : t;
  if (typeof t != "string" || !t.trim())
    return;
  const e = Date.parse(t);
  return Number.isFinite(e) ? e : void 0;
}
function x(t) {
  return String(t).padStart(2, "0");
}
function $e(t) {
  const e = Number(t.execution_id || 0);
  if (e > 0)
    return `execution:${e}`;
  const n = Number(t.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(t.request_id || "")}`;
}
function Ee(t) {
  const e = String(t.status || "").trim();
  return e ? Tt(e) || xt(e) : !1;
}
function Oe(t) {
  if (!t)
    return "";
  const e = String(
    t.status || t.result?.status || ""
  ).trim();
  return e ? S(e) : "";
}
function Vt(t) {
  const e = String(t || "").trim();
  return !!e && Rt(e);
}
function De(t, e) {
  const n = t.target_node_ids || [];
  if (!Vt(t.status) || n.length === 0)
    return !1;
  const r = Number(t.canvas_id || 0), o = Number(t.asset_cate_id || 0), i = r ? [e[String(r)]].filter(Boolean) : Object.values(e).filter(
    (s) => !o || s.assetCateId === o
  );
  return i.length > 0 && i.every((s) => {
    const a = new Set(s.nodes.map((u) => u.id));
    return n.every((u) => !a.has(u));
  });
}
function Ve(t) {
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
    status: S(t?.status || n.status),
    error: _(t?.error || n.error),
    executed: Number(t?.executed || t?.output?.executed || 0),
    total: Number(t?.total || t?.output?.total || 0),
    single_node: !!t?.single_node,
    created_at: String(t?.created_at || ""),
    updated_at: String(t?.updated_at || ""),
    title: String(t?.title || ""),
    output: t?.output || n.output,
    approvals: Array.isArray(t?.approvals) ? t.approvals : Array.isArray(t?.data?.approvals) ? t.data.approvals : [],
    interactions: Array.isArray(t?.interactions) ? t.interactions : Array.isArray(t?.data?.interactions) ? t.data.interactions : [],
    node_results: J(
      t?.node_results || e.node_results
    ),
    pending_node: v(
      t?.pending_node || e.pending_node
    ),
    execution_plan: Ft(t?.execution_plan),
    node_runs: Array.isArray(t?.node_runs) ? t.node_runs.map(Ut).filter((r) => !!r) : []
  };
}
function v(t) {
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
    status: S(t.status || t.result?.status),
    error: _(t.error),
    output: t.output,
    asset: t.asset,
    version: t.version,
    result: t.result,
    approval: t.approval,
    interaction: t.interaction,
    persists_result: !!t.persists_result,
    agent_run_id: Number(t.agent_run_id || 0),
    runTiming: H(t.run_timing)
  } : null;
}
function J(t) {
  return Array.isArray(t) ? t.map(v).filter((e) => !!e) : [];
}
function Ke(t, e = "") {
  if (!t || typeof t != "object")
    return null;
  const n = String(e || "").trim(), r = J(t.node_results), o = n ? r.find((i) => i.node_key === n) : r[0];
  return o || v(
    n && !String(t.node_key || "").trim() ? { ...t, node_key: n } : t
  );
}
function Q(t) {
  return t ? nt(
    t.error,
    t.result?.error,
    t.output?.error
  ) : "";
}
function Kt(t) {
  if (!t)
    return "";
  const e = [...t.node_results || []].reverse().find((n) => S(
    n.status || n.result?.status
  ) === "fail");
  return nt(
    Q(e),
    t.output?.error,
    t.error
  );
}
function ze(t, e = "节点运行失败") {
  return tt(
    Q(t),
    e
  );
}
function Fe(t, e = "画布运行失败") {
  return tt(Kt(t), e);
}
function tt(t, e = "运行失败") {
  const n = _(t);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : e;
}
function zt(...t) {
  for (const e of t) {
    const n = _(e);
    if (n)
      return n;
  }
  return "";
}
const et = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function je(t) {
  return et.has(_(t));
}
function Le(t) {
  const e = _(t);
  return e.includes("运行已取消") || e.includes("运行已停止");
}
function nt(...t) {
  let e = "";
  for (const n of t) {
    const r = _(n);
    if (r && (e ||= r, !et.has(r)))
      return r;
  }
  return e;
}
function _(t) {
  if (typeof t == "string")
    return t.trim();
  if (t instanceof Error)
    return t.message.trim();
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, n = zt(e.error, e.message, e.msg);
  if (n)
    return n;
  const r = _(e.code), o = _(e.detail);
  return [r, o].filter(Boolean).join(": ");
}
function Ft(t) {
  if (!t || typeof t != "object")
    return null;
  const e = Array.isArray(t.nodes) ? t.nodes.map(jt).filter((r) => !!r) : [], n = Array.isArray(t.edges) ? t.edges.map(Lt).filter((r) => !!r) : [];
  return {
    nodes: e,
    edges: n,
    incoming: z(t.incoming),
    outgoing: z(t.outgoing),
    order: Array.isArray(t.order) ? t.order.map((r) => String(r || "")).filter(Boolean) : e.map((r) => r.id)
  };
}
function jt(t) {
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
function Lt(t) {
  const e = String(t?.source || ""), n = String(t?.target || "");
  return !e || !n ? null : {
    id: String(t?.id || `${e}-${n}`),
    source: e,
    target: n
  };
}
function z(t) {
  const e = /* @__PURE__ */ new Map();
  if (!t || typeof t != "object" || Array.isArray(t))
    return e;
  for (const [n, r] of Object.entries(t)) {
    const o = Array.isArray(r) ? r.map((i) => String(i || "")).filter(Boolean) : [];
    e.set(String(n), o);
  }
  return e;
}
function Ut(t) {
  const e = String(t?.node_key || ""), n = Number(t?.node_run_id || 0);
  return !e || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(t?.node_id || 0),
    node_key: e,
    node_type: String(t?.node_type || ""),
    status: S(t?.status),
    persists_result: !!t?.persists_result,
    runTiming: H(t?.run_timing)
  };
}
const R = "primary_text", qt = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), Gt = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), h = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function Yt(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t) {
    const o = String(r.key || "").trim(), i = String(r.type || "").trim().toLowerCase(), s = String(r.value_type || "string").trim().toLowerCase();
    !o || h.has(o) || e.has(o) || !qt.has(i) || s === "number" || (e.add(o), n.push(o === r.key ? r : { ...r, key: o }));
  }
  return n;
}
function Wt(t, e, n) {
  const r = n.trim(), o = g(e?.paramBindings);
  return Yt(t).filter(
    (i) => ot(o, i.key, r)
  );
}
function Ue(t, e, n) {
  return ot(
    g(t?.paramBindings),
    e,
    n
  );
}
function Xt(t) {
  if (t.length !== 1)
    return;
  const e = t[0], n = String(e.key || "").trim();
  return n && !h.has(n) ? n : void 0;
}
function Zt(t) {
  const e = Xt(t);
  return e ? { kind: "automatic", targetParamKey: e } : t.length > 1 ? { kind: "choose", params: t } : { kind: "unavailable" };
}
function qe(t, e, n = !1) {
  const r = (e?.length || 0) + (n ? 1 : 0);
  if (t) {
    let o = r;
    (t.purpose === "storyboard_lyrics" && n || t.purpose !== "storyboard_lyrics" && t.targetParamKey && e?.some((s) => s.key === t.targetParamKey)) && (o -= 1);
    const i = !!(e && o > 0);
    return {
      label: t.label,
      interactive: i,
      showChevron: i,
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
function Ge(t, e, n) {
  const r = g(e?.paramBindings), o = new Set(
    Object.values(r || {}).map((u) => u.sourceNodeId)
  ), i = [
    ...new Set(t.map((u) => u.trim()).filter(Boolean))
  ].filter((u) => !o.has(u));
  if (i.length !== 1)
    return;
  const s = i[0], a = Zt(
    Wt(n, e, s)
  );
  return a.kind === "automatic" ? { sourceNodeId: s, targetParamKey: a.targetParamKey } : void 0;
}
function Ht(t) {
  return A(t.type) === "prompt" || A(t.key) === "prompt" ? "提示词" : String(t.name || "").trim() || "文本参数";
}
function Ye(t) {
  return !t || t.outputType === "setting" || t.outputType === "storyboard" ? !1 : t.type === "agent" ? !0 : t.type === "power" ? !wt(t.power, t.kind, t.outputType) && N(t.power?.kind, t.kind, t.outputType) : t.type === "asset" ? N(t.asset?.kind, t.kind, t.outputType) : N(t.kind, t.outputType);
}
function We(t) {
  return !!(t?.type === "power" && t.composerDraft?.storyboardWorkType === "mv" && Nt(t.power, t.kind, t.outputType));
}
function g(t) {
  const e = F(t), n = [];
  for (const [r, o] of Object.entries(e)) {
    const i = r.trim(), s = F(o), a = String(
      s.sourceNodeId ?? s.source_node_id ?? ""
    ).trim(), u = String(
      s.sourceOutput ?? s.source_output ?? R
    ).trim().toLowerCase();
    !i || h.has(i) || !a || u !== R || n.push([
      i,
      {
        sourceNodeId: a,
        sourceOutput: R
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function Xe(t) {
  const e = g(t);
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
function Jt(t, e, n) {
  const r = e.trim(), o = n.trim();
  return !r || h.has(r) || !o ? t : {
    ...t,
    paramBindings: {
      ...g(t.paramBindings) || {},
      [r]: {
        sourceNodeId: o,
        sourceOutput: R
      }
    }
  };
}
function Ze(t, e, n) {
  const r = e.trim();
  if (!r)
    return t;
  const o = n.trim();
  return !o || h.has(o) ? t : Jt(
    it(t, r),
    o,
    r
  );
}
function Qt(t, e, n = []) {
  const r = e.trim(), o = g(t?.paramBindings);
  if (!r || !o)
    return;
  const i = Object.entries(o).filter(([, u]) => u.sourceNodeId === r).map(([u]) => u).sort();
  if (i.length === 0)
    return;
  const s = new Map(
    n.map((u) => [u.key.trim(), Ht(u)])
  ), a = i.map(
    (u) => s.get(u) || "文本参数"
  );
  return {
    targetParamKeys: i,
    targetParamKey: i.length === 1 ? i[0] : void 0,
    label: a.length === 1 ? a[0] : `${a[0]} +${a.length - 1}`
  };
}
function He(t, e, n = []) {
  const r = e.trim();
  if (r && String(t?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const o = Qt(t, r, n);
  return o ? { ...o, purpose: "param" } : void 0;
}
function Je(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = rt(t, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function rt(t, e) {
  const n = e.trim(), r = g(t.paramBindings);
  if (!n || !r)
    return t;
  const o = Object.fromEntries(
    Object.entries(r).filter(
      ([, i]) => i.sourceNodeId !== n
    )
  );
  return Object.keys(o).length === Object.keys(r).length ? t : te(t, o);
}
function it(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = rt(t, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: o, ...i } = r;
  return i;
}
function Qe(t, e) {
  if (e.size === 0)
    return t;
  let n = !1;
  const r = t.map((o) => {
    let i = o.composerDraft;
    if (!i?.paramBindings && !i?.storyboardLyricsSourceNodeId)
      return o;
    for (const s of e)
      i = it(i, s);
    return i === o.composerDraft ? o : (n = !0, { ...o, composerDraft: i });
  });
  return n ? r : t;
}
function A(t) {
  return String(t || "").trim().toLowerCase();
}
function N(...t) {
  const e = t.map(A).find(Boolean) || "";
  return Gt.has(e);
}
function te(t, e) {
  const { paramBindings: n, ...r } = t;
  return Object.keys(e).length > 0 ? { ...r, paramBindings: e } : r;
}
function ot(t, e, n) {
  const r = e.trim(), o = n.trim();
  if (!r || h.has(r) || !o)
    return !1;
  const i = t?.[r];
  return !i || i.sourceNodeId === o;
}
function F(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const st = [
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
], ee = new Map(
  st.map((t) => [t.key, t])
), tn = st.map(({ key: t, label: e, description: n }) => ({
  key: t,
  label: e,
  description: n
}));
function at(t) {
  return ee.get(
    String(t || "").trim()
  );
}
function en(t, e = "") {
  const n = re(t), r = b(n.key), o = at(
    r || ne(e)
  );
  if (!o)
    return r ? {
      key: r,
      label: b(n.label),
      description: b(n.description)
    } : void 0;
  const i = b(n.label), s = b(n.description);
  return {
    key: o.key,
    label: o.key === "import" && i === "导入" ? o.label : i || o.label,
    description: o.key === "import" && s === "导入资产并连接到当前节点。" ? o.description : s || o.description
  };
}
function nn(t, e) {
  if (t.type !== "function")
    return !1;
  const n = at(t.functionOption?.key);
  return !!(n && (!e || n.key === e));
}
function ne(t) {
  const e = t.trim();
  return e === "开始" ? "start" : e === "导入" || e === "引用" ? "import" : e === "展示" ? "display" : e.includes("保存") ? "save" : "";
}
function re(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function b(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ut(t, e) {
  return `${t}:${e}`;
}
const ie = [
  "characters",
  "scenes",
  "props"
], rn = [
  C("characters", "角色组", "character", 0),
  C("scenes", "场景组", "scene", 1),
  C("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ie,
    layoutIndex: 0,
    enabled: L,
    items: se
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
    enabled: U,
    items: oe
  },
  {
    key: "speech",
    title: "配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: ft,
    items: ae
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
    enabled: pt,
    items: ce
  }
];
function oe(t) {
  const e = yt(t);
  return t.shots.map((n, r) => {
    const o = gt(n), { start: i, end: s } = q(t.shots, r, t.chapter_boundary?.connection === "continue"), a = i && i.shotId !== n.id ? i.shotId : void 0, u = t.shots[r + 1]?.continue_previous ? "first_last" : n.shot_image_mode, d = i ? [i] : [];
    return u === "first_last" && d.push(s), {
      type: "shot",
      visualContext: P(t, B(t, n)),
      id: n.id,
      title: "镜头 " + (n.order || r + 1),
      prompt: ye(t, n, r),
      referenceItems: d.map((m) => M(m.shotId, m.role)),
      externalReferences: he(t, n),
      paramValues: {
        aspectRatio: t.aspect_ratio,
        duration: o,
        referenceMode: "frames"
      },
      shotId: n.id,
      shotImageMode: u,
      sharedStartShotId: a,
      shotDuration: o,
      requiredDurationValues: e,
      continuityAnchor: n.continuity_anchor
    };
  });
}
function M(t, e) {
  return { type: "shot_image", id: St(t, e) };
}
function se(t) {
  const e = t.shots.flatMap((i, s) => {
    const a = s === 0 && t.chapter_boundary?.connection === "continue", { start: u } = q(t.shots, s, a);
    return (u?.shotId === i.id ? ["start", "end"] : ["end"]).map((m) => {
      const l = m === "end" ? "last_frame" : "first_frame", I = pe(t, i, s, m, a);
      return {
        ...M(i.id, m),
        visualContext: P(t, B(t, i)),
        title: "镜头 " + (i.order || s + 1) + " " + _t[l],
        prompt: _e(i, m, t.shots[s + 1]?.continue_previous === !0),
        ...I,
        paramValues: { aspectRatio: t.aspect_ratio },
        shotId: i.id,
        shotImageMode: l,
        frameRole: m,
        frameMediaItems: lt(l)
      };
    });
  });
  if (!U(t)) return e;
  const n = t.shots.at(-1)?.id, r = new Set(t.shots.filter(
    (i, s) => i.shot_image_mode === "first_last" || t.shots[s + 1]?.continue_previous
  ).map((i) => i.id)), o = new Set(e.filter(
    (i) => i.frameRole === "start" || i.shotId === n || r.has(i.shotId)
  ).map((i) => i.id));
  for (const i of [...e].reverse())
    if (o.has(i.id))
      for (const s of i.dependencyItems) o.add(s.id);
  return e.map((i) => o.has(i.id) ? i : { ...i, optional: !0 });
}
function C(t, e, n, r) {
  return {
    key: t,
    title: e,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o, i) => L(o) && o.materials.some(j(n, i)),
    items: (o, i) => o.materials.filter(j(n, i)).map((s) => {
      const a = ge(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: me(s),
        visualContext: P(o, [s]),
        externalReferences: a
      };
    })
  };
}
function j(t, e) {
  return (n) => n.type === t && !e?.settingItemKeys?.has(
    ut(n.type, n.id)
  );
}
function ae(t) {
  const e = t.narrator_voice.trim();
  return [...ht(t).map(({ speech: r, shotId: o }, i) => ({
    type: "speech",
    id: r.id,
    title: `旁白 ${i + 1}`,
    prompt: r.text.trim(),
    ...e ? { paramValues: { voice: e } } : {},
    shotId: o,
    speechId: r.id,
    speechKind: "narration",
    startTime: r.start_time
  })), ...t.shots.flatMap(
    (r, o) => r.speech.filter((i) => i.kind === "dialogue" && i.text.trim()).map((i, s) => {
      const a = ue(t, i);
      return {
        type: "speech",
        id: i.id,
        title: de(
          t,
          i,
          r.order || o + 1,
          s
        ),
        prompt: i.text.trim(),
        ...a ? { paramValues: { voice: a } } : {},
        shotId: r.id,
        speechId: i.id,
        characterId: i.character_id,
        speechKind: i.kind,
        speakerMode: i.speaker_mode,
        startTime: i.start_time,
        shotDuration: r.duration
      };
    })
  )];
}
function ue(t, e) {
  return e.kind === "narration" ? t.narrator_voice.trim() : (t.materials.find(
    (n) => n.type === "character" && n.id === e.character_id
  )?.voice || "").trim();
}
function ce(t) {
  return t.shots.flatMap((e, n) => {
    const r = bt(e);
    return r.length ? [
      {
        type: "subtitle",
        id: e.id,
        title: `镜头 ${e.order || n + 1} 字幕`,
        prompt: r.map((o) => o.text).join(" / "),
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
function de(t, e, n, r) {
  if (e.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = t.materials.find(
    (i) => i.type === "character" && i.id === e.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function P(t, e) {
  return JSON.stringify([
    t.visual_mode,
    t.style_prompt.trim(),
    e.map((n) => [n.id, n.type, n.name, n.prompt.trim()])
  ]);
}
function me(t) {
  return t.prompt.trim() || `${t.name}素材`;
}
function fe(t) {
  return t.map((e) => ({
    type: e.type,
    id: e.id
  }));
}
function pe(t, e, n, r, o) {
  const i = kt(
    t.shots,
    n,
    r,
    t.materials
  ), s = !o && i.anchorID && i.anchorFrameRole ? M(i.anchorID, i.anchorFrameRole) : void 0, a = new Set(o ? e.material_ids : i.materialIDs), u = B(t, e).filter(
    (m) => a.has(m.id)
  ), d = le(
    t,
    o ? e.reference_keys : i.referenceKeys,
    o || i.includeGlobalReferences,
    u
  );
  return {
    dependencyItems: s ? [s] : [],
    referenceItems: [...s ? [s] : [], ...fe(u)],
    externalReferences: d
  };
}
function le(t, e, n, r) {
  const o = new Set(
    r.flatMap((s) => s.reference_keys)
  );
  if (r.length)
    for (const s of $(t, "image"))
      o.add(s.key);
  const i = new Set(e);
  return E(
    t.references.filter(
      (s) => s.kind === "image" && !o.has(s.key) && (dt.image.has(s.purpose) ? n : i.has(s.key))
    )
  );
}
function _e(t, e, n) {
  const r = G(t, e), o = e === "end" ? t.continuity_state.exit.trim() : t.continuity_state.entry.trim();
  return ct([
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `${e === "end" ? "尾帧" : "首帧"}状态：${o}`,
    r ? "静态构图：" + r : "",
    e === "end" && t.camera_instruction ? "到达尾帧机位的运镜：" + t.camera_instruction : "",
    e === "end" && n && t.handoff?.outgoing && t.handoff.outgoing !== o ? "共享接点：" + t.handoff.outgoing : "",
    e === "end" && n && t.handoff?.outgoing_motion ? "接点进行中的动作：" + t.handoff.outgoing_motion : ""
  ]);
}
function ye(t, e, n) {
  const r = G(e, "video"), o = D(t, n - 1), i = D(t, n), s = e.continue_previous || e.handoff?.match_action ? t.shots[n - 1]?.handoff?.outgoing_motion : "", a = t.shots[n + 1], u = a?.continue_previous || a?.handoff?.match_action ? e.handoff?.outgoing_motion : "";
  return ct([
    `画面内容：${e.description.trim()}`,
    r ? "镜内动作与声音：" + r : "",
    e.spatial_layout.trim() ? `空间关系：${e.spatial_layout.trim()}` : "",
    `起始状态：${e.continuity_state.entry.trim()}`,
    e.start_framing?.trim() ? `起始构图：${e.start_framing.trim()}` : "",
    `结束状态：${e.continuity_state.exit.trim()}`,
    e.end_framing?.trim() ? `结束构图：${e.end_framing.trim()}` : "",
    e.handoff?.incoming && e.handoff.incoming !== e.continuity_state.entry ? "本段入点：" + e.handoff.incoming : "",
    e.handoff?.outgoing && e.handoff.outgoing !== e.continuity_state.exit ? "本段出点：" + e.handoff.outgoing : "",
    s ? "入点进行中的动作：" + s : "",
    u ? "出点进行中的动作：" + u : "",
    e.continue_previous && t.shots[n - 1]?.handoff?.camera_through ? "承接摄影路线：" + t.shots[n - 1].handoff.camera_through : "",
    a?.continue_previous && e.handoff?.camera_through ? "交给下一段的摄影路线：" + e.handoff.camera_through : "",
    e.handoff?.camera_path ? "连续经过的空间路线：" + e.handoff.camera_path : "",
    e.camera_instruction.trim() ? `运镜：${e.camera_instruction.trim()}` : "",
    e.handoff?.sound_cue ? "开场环境底声：" + e.handoff.sound_cue : "",
    o ? "开场前 " + o + " 毫秒只保留底声" : "",
    i ? "结束前 " + i + " 毫秒只延续底声" : "",
    ...It(t) ? [
      "声音方式：视频原声",
      ...e.speech.filter((d) => d.text.trim()).map((d) => {
        const m = t.materials.find((mt) => mt.id === d.character_id), l = d.kind === "narration" ? "旁白" : m?.name || d.character_id, I = d.kind === "narration" ? t.narrator_voice : m?.voice;
        return `${d.start_time}秒，${l}（${d.kind === "narration" || d.speaker_mode === "offscreen" ? "画外" : "出镜"}）：${d.text}${I ? `；声线：${I}` : ""}`;
      })
    ] : []
  ]);
}
function ct(t) {
  return t.filter(Boolean).join(`
`);
}
function ge(t, e) {
  return E([
    ...t.references.filter(
      (n) => n.kind === "image" && e.reference_keys.includes(n.key)
    ),
    ...$(t, "image")
  ]);
}
function he(t, e) {
  return E([
    ...t.references.filter(
      (n) => n.kind === "video" && e.reference_keys.includes(n.key)
    ),
    ...$(t, "video")
  ]);
}
const dt = {
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
function $(t, e) {
  const n = dt[e];
  return t.references.filter(
    (r) => r.kind === e && n.has(r.purpose)
  );
}
function E(t) {
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t)
    n.has(r.asset_id) || (n.add(r.asset_id), e.push(r));
  return e;
}
function be(t) {
  return Y(t)?.materials || [];
}
function O(t, e) {
  return t.find((n) => n.id === e && n.type === "power" && n.outputType === "setting");
}
function on(t, e, n) {
  for (const r of e) {
    if ((r.logicalTo || r.to) !== n || r.executionMode === "manual") continue;
    const o = O(t, r.logicalFrom || r.from);
    if (o) return o;
  }
}
function sn(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if ((o.logicalTo || o.to) !== n || o.executionMode === "manual")
      continue;
    const i = O(t, o.logicalFrom || o.from);
    if (i)
      for (const s of t) {
        const a = s.storyboardItem;
        a?.sourceNodeId === i.id && ["character", "scene", "prop"].includes(a.itemType) && r.set(ut(a.itemType, a.itemId), s);
      }
  }
  return r;
}
function an(t, e) {
  const n = t.storyboardItem;
  if (!n || !["character", "scene", "prop"].includes(n.itemType) || !t.asset && !t.resultRef && t.resultOutput == null)
    return "";
  const r = O(e, n.sourceNodeId);
  if (!r) return "";
  const o = be(r).find(
    (a) => a.id === n.itemId
  );
  if (!o) return "此设定已移除；旧形象仍保留，请更新分镜引用";
  const i = t.asset?.version?.source?.story_setting;
  if (!i) return "此形象尚未绑定当前设定，请重新生成";
  if (i.name !== o.name || i.prompt !== o.prompt)
    return "设定已更新；当前显示旧形象，重新生成后用于后续制作";
  const s = Y(r);
  return i.visual_mode !== s.visual_mode || i.aspect_ratio !== s.aspect_ratio || i.style_prompt_input !== s.style_prompt ? "全片画风或画幅已更新；当前显示旧形象，请重新生成" : "";
}
export {
  en as $,
  Vt as A,
  Le as B,
  Oe as C,
  Ve as D,
  Fe as E,
  an as F,
  At as G,
  it as H,
  He as I,
  qe as J,
  Ue as K,
  Ze as L,
  Je as M,
  Ge as N,
  Zt as O,
  Re as P,
  O as Q,
  Qe as R,
  rn as S,
  De as T,
  Me as U,
  Bt as V,
  ze as W,
  Ke as X,
  H as Y,
  Dt as Z,
  g as _,
  Ht as a,
  Xe as a0,
  je as a1,
  Q as a2,
  Pe as a3,
  Kt as b,
  tn as c,
  $e as d,
  tt as e,
  Ne as f,
  we as g,
  Ae as h,
  Ee as i,
  Be as j,
  vt as k,
  xe as l,
  T as m,
  Ce as n,
  W as o,
  sn as p,
  ut as q,
  Ct as r,
  on as s,
  Te as t,
  nn as u,
  ve as v,
  Ye as w,
  We as x,
  Wt as y,
  at as z
};
