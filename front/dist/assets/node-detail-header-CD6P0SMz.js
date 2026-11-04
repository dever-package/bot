import { o as m, K as d } from "./content-view-0gIO2Kkv.js";
import { i as Y, a as Q, h as J, n as h } from "./interaction-D6_wMtPr.js";
import { f as Z, r as tt } from "./space-loading-FH4pJ97O.js";
import { j as l, a as R } from "./preloadable-BrN58FXf.js";
import { ag as et, r as nt, aQ as rt, W as it, k as ot, a8 as st, a9 as at, M as ut, b as ct } from "./vendor-icons-UGaOWWu-.js";
import { l as dt, B as mt } from "./asset-preview-D6nljO8_.js";
import { P as ft } from "./power-icon-C4gLuaR6.js";
const lt = [
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
function Qt(t) {
  const e = Math.round(t * 10) / 10;
  return Number.isInteger(e) ? e.toString() : e.toFixed(1);
}
function Jt() {
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
function Zt(t) {
  const e = m(t);
  if (Number(e.version || 0) !== 3)
    return;
  const n = Array.isArray(e.clips) ? e.clips.map(P).filter(Boolean) : [], r = m(e.settings), i = Array.isArray(e.audioTracks ?? e.audio_tracks) ? (e.audioTracks ?? e.audio_tracks).map(M).filter(Boolean) : [], o = m(e.storyboardBaseline);
  return {
    version: 3,
    ...Array.isArray(o.clips) && Array.isArray(o.audioTracks) ? {
      storyboardBaseline: {
        clips: o.clips.map(P).filter(Boolean),
        audioTracks: o.audioTracks.map(M).filter(Boolean)
      }
    } : {},
    clips: n,
    audioTracks: i,
    settings: {
      resolution: u(r.resolution) || "auto",
      fps: y(r.fps, 0, 120, 0)
    }
  };
}
function te(t) {
  const e = t.clips.reduce(
    (r, i) => r + Math.max(0, i.duration),
    0
  ), n = t.clips.reduce((r, i, o) => o >= t.clips.length - 1 || i.transitionToNext.type === "none" ? r : r + i.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, e - n);
}
function ee(t) {
  const e = t.clips.flatMap(
    (r, i) => $(r).map(
      (o) => `${r.title || `镜头 ${i + 1}`}：${o}`
    )
  ), n = t.audioTracks.flatMap(
    (r, i) => r.audio ? [] : [`全片声音 ${i + 1}：缺少音频素材`]
  );
  return [...e, ...n];
}
function $(t) {
  const e = [];
  t.visualVideo || e.push("缺少镜头视频素材");
  for (const n of t.speechTracks)
    n.audio || e.push(`语音“${n.text}”缺少音频素材`);
  for (const n of t.subtitleTracks)
    n.speechId && !t.speechTracks.some((r) => r.id === n.speechId) && e.push(`字幕“${n.text}”未找到对应语音`);
  return [...new Set(e)];
}
function pt(t) {
  return t ? `${t.assetId}:${t.versionId}` : "";
}
function ne(t) {
  return t ? [
    pt(t),
    Number(t.mediaIndex || 0),
    t.mediaUrl || ""
  ].join(":") : "";
}
function P(t) {
  const e = m(t), n = u(e.id);
  if (!n)
    return null;
  const r = C(
    e.visualVideo ?? e.visual_video
  ), i = C(
    e.originalAudioSource ?? e.original_audio_source
  ), o = m(
    e.transitionToNext ?? e.transition_to_next
  ), s = Array.isArray(e.speechTracks ?? e.speech_tracks) ? (e.speechTracks ?? e.speech_tracks).map(gt).filter(Boolean) : [], c = Array.isArray(
    e.subtitleTracks ?? e.subtitle_tracks
  ) ? (e.subtitleTracks ?? e.subtitle_tracks).map(yt).filter(Boolean) : [], a = kt(o.type), S = u(e.sourceEdgeId ?? e.source_edge_id), _ = {
    id: n,
    title: u(e.title) || r?.label || "镜头",
    ...S ? { sourceEdgeId: S } : {},
    ...r ? { visualVideo: r } : {},
    ...i ? { originalAudioSource: i } : {},
    duration: _t(e.duration),
    originalVolume: y(
      e.originalVolume ?? e.original_volume,
      0,
      1,
      1
    ),
    speechTracks: s,
    subtitleTracks: c,
    useOriginalVideo: z(
      e.useOriginalVideo ?? e.use_original_video
    ),
    blockingIssues: [],
    transitionToNext: {
      type: a,
      durationMs: a === "none" ? 0 : y(
        o.durationMs ?? o.duration_ms,
        100,
        5e3,
        500
      )
    }
  };
  return _.blockingIssues = $(_), _;
}
function yt(t) {
  const e = m(t), n = u(e.id), r = u(e.text);
  if (!n || !r)
    return null;
  const i = u(e.source) === "speech" ? "speech" : "caption", o = u(e.speechId ?? e.speech_id), s = d(e.endTime ?? e.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    ...s > 0 ? { endTime: s } : {},
    ...o ? { speechId: o } : {},
    source: i
  };
}
function gt(t) {
  const e = m(t), n = u(e.id);
  if (!n)
    return null;
  const r = C(e.audio), i = u(e.kind) === "narration" ? "narration" : "dialogue", o = u(e.characterId ?? e.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, d(e.sourceStart ?? e.source_start)),
    fit: O(e.fit, "trim"),
    kind: i,
    ...o ? { characterId: o } : {},
    text: u(e.text),
    volume: y(e.volume, 0, 1, 1)
  };
}
function M(t) {
  const e = m(t), n = u(e.id);
  if (!n)
    return null;
  const r = C(e.audio), i = u(e.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, d(e.startTime ?? e.start_time)),
    sourceStart: Math.max(0, d(e.sourceStart ?? e.source_start)),
    kind: i,
    volume: y(e.volume, 0, 1, i === "music" ? 0.35 : 1),
    fit: O(e.fit, i === "music" ? "trim" : "strict"),
    loop: i === "music" && z(e.loop),
    fadeOut: y(
      e.fadeOut ?? e.fade_out,
      0,
      10,
      i === "music" ? 1 : 0
    )
  };
}
function O(t, e) {
  return u(t) === "strict" ? "strict" : u(t) === "trim" ? "trim" : e;
}
function _t(t) {
  const e = d(t);
  return e > 0 ? Math.max(1, Math.floor(e)) : 0;
}
function C(t) {
  const e = m(t), n = d(e.assetId ?? e.asset_id), r = d(e.versionId ?? e.version_id);
  if (!n || !r)
    return;
  const i = bt(
    e.mediaItems ?? e.media_items ?? e.refMediaItems ?? e.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: u(e.label),
    ...d(e.mediaIndex ?? e.media_index) > 0 ? { mediaIndex: d(e.mediaIndex ?? e.media_index) } : {},
    ...u(e.mediaUrl ?? e.media_url) ? { mediaUrl: u(e.mediaUrl ?? e.media_url) } : {},
    ...u(
      e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
    ) ? {
      mediaThumbnail: u(
        e.mediaThumbnail ?? e.media_thumbnail ?? e.thumbnail ?? e.poster
      )
    } : {},
    ...i.length ? { mediaItems: i } : {}
  };
}
function bt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set();
  for (const r of t) {
    const i = m(r), o = u(i.url), s = d(i.index);
    if (!o && s <= 0)
      continue;
    const c = s > 0 ? `index:${s}` : `url:${o}`;
    n.has(c) || (n.add(c), e.push({
      url: o,
      index: s > 0 ? s : 0,
      ...u(i.usage) ? { usage: u(i.usage) } : {}
    }));
  }
  return e;
}
function kt(t) {
  const e = u(t);
  return lt.some(
    (n) => n.options.some((r) => r.key === e)
  ) ? e : "none";
}
function u(t) {
  return String(t ?? "").trim();
}
function y(t, e, n, r) {
  const i = Number(t);
  return Number.isFinite(i) ? Math.min(n, Math.max(e, i)) : r;
}
function z(t) {
  return t === !0 || t === 1 || t === "1" || t === "true";
}
function j(t) {
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
function ht(t) {
  const e = Number(t);
  return Number.isFinite(e) && e > 0 ? Math.round(e) : void 0;
}
function re({
  nodeRunTiming: t,
  runCreatedAt: e,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return k(t?.startedAt) ?? k(e) ?? k(n) ?? r;
}
function N(t) {
  const e = Math.max(0, Math.floor(t / 1e3)), n = e % 60, r = Math.floor(e / 60), i = r % 60, o = Math.floor(r / 60);
  return o > 0 ? `${o}:${x(i)}:${x(n)}` : `${x(r)}:${x(n)}`;
}
function ie(t, e, n) {
  const r = N(t);
  if (!e)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const i = ht(n);
  if (!i)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const o = t >= i ? `已超预计 ${N(t - i)}` : `剩余约 ${N(i - t)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: o,
    tooltip: `已运行 ${r}，历史平均约 ${N(i)}，${o}`
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
function oe(t) {
  const e = Number(t.execution_id || 0);
  if (e > 0)
    return `execution:${e}`;
  const n = Number(t.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(t.request_id || "")}`;
}
function se(t) {
  const e = String(t.status || "").trim();
  return e ? Y(e) || Q(e) : !1;
}
function ae(t) {
  if (!t)
    return "";
  const e = String(
    t.status || t.result?.status || ""
  ).trim();
  return e ? h(e) : "";
}
function St(t) {
  const e = String(t || "").trim();
  return !!e && J(e);
}
function ue(t, e) {
  const n = t.target_node_ids || [];
  if (!St(t.status) || n.length === 0)
    return !1;
  const r = Number(t.canvas_id || 0), i = Number(t.asset_cate_id || 0), o = r ? [e[String(r)]].filter(Boolean) : Object.values(e).filter(
    (s) => !i || s.assetCateId === i
  );
  return o.length > 0 && o.every((s) => {
    const c = new Set(s.nodes.map((a) => a.id));
    return n.every((a) => !c.has(a));
  });
}
function ce(t) {
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
    status: h(t?.status || n.status),
    error: f(t?.error || n.error),
    executed: Number(t?.executed || t?.output?.executed || 0),
    total: Number(t?.total || t?.output?.total || 0),
    single_node: !!t?.single_node,
    created_at: String(t?.created_at || ""),
    updated_at: String(t?.updated_at || ""),
    title: String(t?.title || ""),
    output: t?.output || n.output,
    approvals: Array.isArray(t?.approvals) ? t.approvals : Array.isArray(t?.data?.approvals) ? t.data.approvals : [],
    interactions: Array.isArray(t?.interactions) ? t.interactions : Array.isArray(t?.data?.interactions) ? t.data.interactions : [],
    node_results: D(
      t?.node_results || e.node_results
    ),
    pending_node: B(
      t?.pending_node || e.pending_node
    ),
    execution_plan: xt(t?.execution_plan),
    node_runs: Array.isArray(t?.node_runs) ? t.node_runs.map(It).filter((r) => !!r) : []
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
    status: h(t.status || t.result?.status),
    error: f(t.error),
    output: t.output,
    asset: t.asset,
    version: t.version,
    result: t.result,
    approval: t.approval,
    interaction: t.interaction,
    persists_result: !!t.persists_result,
    agent_run_id: Number(t.agent_run_id || 0),
    runTiming: j(t.run_timing)
  } : null;
}
function D(t) {
  return Array.isArray(t) ? t.map(B).filter((e) => !!e) : [];
}
function de(t, e = "") {
  if (!t || typeof t != "object")
    return null;
  const n = String(e || "").trim(), r = D(t.node_results), i = n ? r.find((o) => o.node_key === n) : r[0];
  return i || B(
    n && !String(t.node_key || "").trim() ? { ...t, node_key: n } : t
  );
}
function V(t) {
  return t ? L(
    t.error,
    t.result?.error,
    t.output?.error
  ) : "";
}
function Tt(t) {
  if (!t)
    return "";
  const e = [...t.node_results || []].reverse().find((n) => h(
    n.status || n.result?.status
  ) === "fail");
  return L(
    V(e),
    t.output?.error,
    t.error
  );
}
function me(t, e = "节点运行失败") {
  return K(
    V(t),
    e
  );
}
function fe(t, e = "画布运行失败") {
  return K(Tt(t), e);
}
function K(t, e = "运行失败") {
  const n = f(t);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : e;
}
function Nt(...t) {
  for (const e of t) {
    const n = f(e);
    if (n)
      return n;
  }
  return "";
}
const F = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function le(t) {
  return F.has(f(t));
}
function pe(t) {
  const e = f(t);
  return e.includes("运行已取消") || e.includes("运行已停止");
}
function L(...t) {
  let e = "";
  for (const n of t) {
    const r = f(n);
    if (r && (e ||= r, !F.has(r)))
      return r;
  }
  return e;
}
function f(t) {
  if (typeof t == "string")
    return t.trim();
  if (t instanceof Error)
    return t.message.trim();
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, n = Nt(e.error, e.message, e.msg);
  if (n)
    return n;
  const r = f(e.code), i = f(e.detail);
  return [r, i].filter(Boolean).join(": ");
}
function xt(t) {
  if (!t || typeof t != "object")
    return null;
  const e = Array.isArray(t.nodes) ? t.nodes.map(wt).filter((r) => !!r) : [], n = Array.isArray(t.edges) ? t.edges.map(Ct).filter((r) => !!r) : [];
  return {
    nodes: e,
    edges: n,
    incoming: v(t.incoming),
    outgoing: v(t.outgoing),
    order: Array.isArray(t.order) ? t.order.map((r) => String(r || "")).filter(Boolean) : e.map((r) => r.id)
  };
}
function wt(t) {
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
function Ct(t) {
  const e = String(t?.source || ""), n = String(t?.target || "");
  return !e || !n ? null : {
    id: String(t?.id || `${e}-${n}`),
    source: e,
    target: n
  };
}
function v(t) {
  const e = /* @__PURE__ */ new Map();
  if (!t || typeof t != "object" || Array.isArray(t))
    return e;
  for (const [n, r] of Object.entries(t)) {
    const i = Array.isArray(r) ? r.map((o) => String(o || "")).filter(Boolean) : [];
    e.set(String(n), i);
  }
  return e;
}
function It(t) {
  const e = String(t?.node_key || ""), n = Number(t?.node_run_id || 0);
  return !e || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(t?.node_id || 0),
    node_key: e,
    node_type: String(t?.node_type || ""),
    status: h(t?.status),
    persists_result: !!t?.persists_result,
    runTiming: j(t?.run_timing)
  };
}
const w = "primary_text", At = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), Bt = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), g = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function Rt(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t) {
    const i = String(r.key || "").trim(), o = String(r.type || "").trim().toLowerCase(), s = String(r.value_type || "string").trim().toLowerCase();
    !i || g.has(i) || e.has(i) || !At.has(o) || s === "number" || (e.add(i), n.push(i === r.key ? r : { ...r, key: i }));
  }
  return n;
}
function Pt(t, e, n) {
  const r = n.trim(), i = p(e?.paramBindings);
  return Rt(t).filter(
    (o) => G(i, o.key, r)
  );
}
function ye(t, e, n) {
  return G(
    p(t?.paramBindings),
    e,
    n
  );
}
function Mt(t) {
  if (t.length !== 1)
    return;
  const e = t[0], n = String(e.key || "").trim();
  return n && !g.has(n) ? n : void 0;
}
function vt(t) {
  const e = Mt(t);
  return e ? { kind: "automatic", targetParamKey: e } : t.length > 1 ? { kind: "choose", params: t } : { kind: "unavailable" };
}
function ge(t, e, n = !1) {
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
function _e(t, e, n) {
  const r = p(e?.paramBindings), i = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), o = [
    ...new Set(t.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !i.has(a));
  if (o.length !== 1)
    return;
  const s = o[0], c = vt(
    Pt(n, e, s)
  );
  return c.kind === "automatic" ? { sourceNodeId: s, targetParamKey: c.targetParamKey } : void 0;
}
function Et(t) {
  return A(t.type) === "prompt" || A(t.key) === "prompt" ? "提示词" : String(t.name || "").trim() || "文本参数";
}
function be(t) {
  return t ? t.type === "agent" ? !0 : t.type === "power" ? I(t.power?.kind, t.kind, t.outputType) : t.type === "asset" ? I(t.asset?.kind, t.kind, t.outputType) : I(t.kind, t.outputType) : !1;
}
function ke(t) {
  return !!(t?.type === "power" && t.composerDraft?.storyboardWorkType === "mv" && Z(t.power, t.kind, t.outputType));
}
function p(t) {
  const e = E(t), n = [];
  for (const [r, i] of Object.entries(e)) {
    const o = r.trim(), s = E(i), c = String(
      s.sourceNodeId ?? s.source_node_id ?? ""
    ).trim(), a = String(
      s.sourceOutput ?? s.source_output ?? w
    ).trim().toLowerCase();
    !o || g.has(o) || !c || a !== w || n.push([
      o,
      {
        sourceNodeId: c,
        sourceOutput: w
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function he(t) {
  const e = p(t);
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
function $t(t, e, n) {
  const r = e.trim(), i = n.trim();
  return !r || g.has(r) || !i ? t : {
    ...t,
    paramBindings: {
      ...p(t.paramBindings) || {},
      [r]: {
        sourceNodeId: i,
        sourceOutput: w
      }
    }
  };
}
function Se(t, e, n) {
  const r = e.trim();
  if (!r)
    return t;
  const i = n.trim();
  return !i || g.has(i) ? t : $t(
    q(t, r),
    i,
    r
  );
}
function Ot(t, e, n = []) {
  const r = e.trim(), i = p(t?.paramBindings);
  if (!r || !i)
    return;
  const o = Object.entries(i).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (o.length === 0)
    return;
  const s = new Map(
    n.map((a) => [a.key.trim(), Et(a)])
  ), c = o.map(
    (a) => s.get(a) || "文本参数"
  );
  return {
    targetParamKeys: o,
    targetParamKey: o.length === 1 ? o[0] : void 0,
    label: c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`
  };
}
function Te(t, e, n = []) {
  const r = e.trim();
  if (r && String(t?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const i = Ot(t, r, n);
  return i ? { ...i, purpose: "param" } : void 0;
}
function Ne(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = U(t, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function U(t, e) {
  const n = e.trim(), r = p(t.paramBindings);
  if (!n || !r)
    return t;
  const i = Object.fromEntries(
    Object.entries(r).filter(
      ([, o]) => o.sourceNodeId !== n
    )
  );
  return Object.keys(i).length === Object.keys(r).length ? t : zt(t, i);
}
function q(t, e) {
  const n = e.trim();
  if (!n)
    return t;
  const r = U(t, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: i, ...o } = r;
  return o;
}
function xe(t, e) {
  if (e.size === 0)
    return t;
  let n = !1;
  const r = t.map((i) => {
    let o = i.composerDraft;
    if (!o?.paramBindings && !o?.storyboardLyricsSourceNodeId)
      return i;
    for (const s of e)
      o = q(o, s);
    return o === i.composerDraft ? i : (n = !0, { ...i, composerDraft: o });
  });
  return n ? r : t;
}
function A(t) {
  return String(t || "").trim().toLowerCase();
}
function I(...t) {
  const e = t.map(A).find(Boolean) || "";
  return Bt.has(e);
}
function zt(t, e) {
  const { paramBindings: n, ...r } = t;
  return Object.keys(e).length > 0 ? { ...r, paramBindings: e } : r;
}
function G(t, e, n) {
  const r = e.trim(), i = n.trim();
  if (!r || g.has(r) || !i)
    return !1;
  const o = t?.[r];
  return !o || o.sourceNodeId === i;
}
function E(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
const W = [
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
], jt = new Map(
  W.map((t) => [t.key, t])
), we = W.map(({ key: t, label: e, description: n }) => ({
  key: t,
  label: e,
  description: n
}));
function H(t) {
  return jt.get(
    String(t || "").trim()
  );
}
function Ce(t, e = "") {
  const n = Vt(t), r = b(n.key), i = H(
    r || Dt(e)
  );
  if (!i)
    return r ? {
      key: r,
      label: b(n.label),
      description: b(n.description)
    } : void 0;
  const o = b(n.label), s = b(n.description);
  return {
    key: i.key,
    label: i.key === "import" && o === "导入" ? i.label : o || i.label,
    description: i.key === "import" && s === "导入资产并连接到当前节点。" ? i.description : s || i.description
  };
}
function Ie(t, e) {
  if (t.type !== "function")
    return !1;
  const n = H(t.functionOption?.key);
  return !!(n && (!e || n.key === e));
}
function Dt(t) {
  const e = t.trim();
  return e === "开始" ? "start" : e === "导入" || e === "引用" ? "import" : e === "展示" ? "display" : e.includes("保存") ? "save" : "";
}
function Vt(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function b(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Ae({
  node: t,
  contentLabel: e,
  titleStatus: n,
  versionSelect: r,
  updatedAt: i,
  status: o,
  readonly: s,
  actions: c,
  downloadUrl: a,
  onRetry: S,
  onClose: _
}) {
  const T = t.type === "power" ? tt(t.power, t.kind, t.outputType) : null, X = T && T.outputName !== e ? `${T.outputName} · ${e}` : T?.outputName || e;
  return /* @__PURE__ */ l(
    dt,
    {
      icon: /* @__PURE__ */ l(Ft, { node: t }),
      title: t.title || "节点详情",
      subtitle: X,
      titleStatus: n,
      versionSelect: r,
      state: s ? /* @__PURE__ */ l("span", { className: "wb-detail-state", children: "只读预览" }) : o === "error" ? /* @__PURE__ */ l(mt, { label: "重试保存", children: /* @__PURE__ */ R(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: S,
          children: [
            /* @__PURE__ */ l(et, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ R("span", { className: `wb-detail-state is-${o}`, children: [
        o === "saving" ? /* @__PURE__ */ l(nt, { size: 12, className: "wb-detail-spin" }) : null,
        Kt(o)
      ] }),
      updatedAt: i,
      actions: c,
      downloadUrl: a,
      onClose: _
    }
  );
}
function Kt(t) {
  return t === "dirty" ? "未保存" : t === "saving" ? "保存中" : "已保存";
}
function Ft({ node: t }) {
  if (t.type === "power")
    return /* @__PURE__ */ l(
      ft,
      {
        power: t.power,
        kind: t.kind,
        outputType: t.outputType,
        size: 16
      }
    );
  const e = Lt(t);
  return /* @__PURE__ */ l(e, { size: 16 });
}
function Lt(t) {
  return t.type === "agent" ? rt : t.type === "flow" ? it : t.type === "function" ? ot : t.kind === "image" ? st : t.kind === "video" ? at : t.kind === "audio" ? ut : ct;
}
export {
  ge as A,
  ye as B,
  Se as C,
  Ne as D,
  _e as E,
  vt as F,
  Pt as G,
  xe as H,
  ue as I,
  re as J,
  me as K,
  ht as L,
  de as M,
  Ae as N,
  j as O,
  p as P,
  Ce as Q,
  he as R,
  le as S,
  V as T,
  ie as U,
  lt as V,
  Et as a,
  Tt as b,
  we as c,
  oe as d,
  K as e,
  Jt as f,
  Qt as g,
  te as h,
  se as i,
  ee as j,
  pt as k,
  N as l,
  H as m,
  Zt as n,
  Ie as o,
  $ as p,
  St as q,
  pe as r,
  ae as s,
  ce as t,
  fe as u,
  ne as v,
  q as w,
  Te as x,
  be as y,
  ke as z
};
