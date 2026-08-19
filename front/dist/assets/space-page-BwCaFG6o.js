import { a as M, j as d, F as mn, b as Ft, c as wn } from "./preloadable-Bomi5PEU.js";
import { d as H, a as K, b as ce, e as D, g as Ou, m as ai, u as le, S as Le } from "./_commonjsHelpers-61wyk6v6.js";
import { d as zu } from "./file-kind-UfTAlHnR.js";
import { a as pr, N as ju, w as Bu, n as $u, g as Uu, B as Wi, E as Vu, b as Lu, c as Ku, i as qu, M as Gu, P as Oe, H as Hu } from "./normalize-CG6tAU7F.js";
import { aT as Wu, aU as Qa, M as Yu, av as ec, P as tc, k as ci, O as nc, p as Xu, r as Zu, h as Ju, v as Qu, L as Gt, j as Vo, n as el, aV as tl, c as nl, aS as rl, i as ol, C as di, b as ui, X as rc, A as sl, y as il, ae as al, aW as cl, aX as dl, aO as ul, aY as ll, e as oc, l as fl, W as pl, a3 as Yi, a2 as Xi, a6 as ml, aZ as gl, U as yl, m as hl } from "./vendor-icons-B3DKX3la.js";
import { t as Q } from "./index-2TBwAJWu.js";
import { a as wl } from "./react-DQWh0hYM.js";
import { p as mr, s as lt, q as _l } from "./site-config-C63CM9jT.js";
import { u as bl } from "./use-body-appearance-RBVqJFik.js";
import { a7 as yt, a8 as P, a9 as sc, aa as ic, ab as ge, ac as _n, v as li, ad as Zi, ae as ac, af as Pt, ag as Nl, B as Me, ah as cc, ai as Il, aj as ve, ak as Sl, N as dc, L as Cl, K as vl, J as xl, I as kl, f as Rl, al as Al, h as uc, S as lc, am as vo, an as Tl, g as Ml, O as Dl, a2 as El, ao as po, p as Hr, i as Pl, R as fc, ap as ir, C as ar, aq as Lo, ar as xo, as as Fl, at as jn, u as Ol, au as fi, av as zl, c as jl, aw as ko, ax as Te, ay as dt, az as Fn, aA as zr, aB as Bl, A as pc, aC as $l, b as Ul, aD as mc, aE as Vl, aF as zs, aG as Ll, aH as Kl } from "./upload-asset-api-MyhTP8sK.js";
import { r as Kn, n as ql, e as pi, a as Ko, f as Gl, i as Hl, P as Wl } from "./power-icon-HeeWAKmZ.js";
import { w as gc, u as yc, d as hc, c as Yl, n as Xl, l as Zl, p as Jl, k as Ql, o as ef } from "./interaction-C1CfPuZM.js";
import { K as tf, o as nf, L as mi, M as rf, N as wc, O as _c, n as Ji, Q as gi, y as of, z as sf, A as af, C as cf, B as df, R as uf } from "./space-sequence-card-BHJhPhFZ.js";
import "./media-inspector-gallery-ho9rlZcO.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-D1nqjCt6.css", import.meta.url).href]);
function yi(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function bc(e) {
  return yi(e) === "media";
}
const lf = { width: 720, height: 420 }, Qi = { width: 360, height: 240 }, ea = { width: 2400, height: 1600 }, Nc = 48, cr = 16;
function Ic(e, t) {
  return e.filter((n) => n.groupId === t);
}
function Sc(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? Ic(e, n.id) : [n] : [];
}
function ff(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function pf(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.x === n.x && r.y === n.y)
    return e;
  const o = n.x - r.x, s = n.y - r.y;
  return e.map((i) => i.id === t ? { ...i, ...n } : r.type === "group" && i.groupId === r.id ? {
    ...i,
    x: i.x + o,
    y: i.y + s
  } : i);
}
function ws(e, t, n) {
  const r = e.find((a) => a.id === t), o = r ? Cc(e, r) : void 0;
  if (!r || !o)
    return n;
  const s = ta(
    n.x,
    o.x + cr,
    o.x + o.width - cr - r.width
  ), i = ta(
    n.y,
    o.y + Nc,
    o.y + o.height - cr - r.height
  );
  return s === n.x && i === n.y ? n : { x: s, y: i };
}
function js(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group" || Cc(e, r))
    return e;
  const o = { ...r, ...n }, s = mf(e, o);
  return (r.groupId || "") === s ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: s || void 0 } : i
  );
}
function Kt(e, t) {
  const n = new Map(e.map((s) => [s.id, s])), r = /* @__PURE__ */ new Set(), o = [];
  for (const s of t) {
    const i = s.logicalFrom || s.from, a = s.logicalTo || s.to, c = n.get(i), u = n.get(a);
    if (!c || !u)
      continue;
    const l = c.groupId !== u.groupId, m = l && c.type !== "group" && c.groupId ? c.groupId : c.id, I = l && u.type !== "group" && u.groupId ? u.groupId : u.id;
    if (!m || !I || m === I)
      continue;
    const N = `${i}\0${a}\0${yi(s)}`;
    r.has(N) || (r.add(N), o.push({ ...s, from: m, to: I, logicalFrom: i, logicalTo: a }));
  }
  return o;
}
function mf(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.id !== t.id && n >= s.x + cr && n <= s.x + s.width - cr && r >= s.y + Nc && r <= s.y + s.height - cr
  ).sort(
    (s, i) => s.width * s.height - i.width * i.height
  )[0]?.id || "";
}
function Cc(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (n) => n.id === t.groupId && n.type === "group" && n.group?.origin === "script"
    );
}
function ta(e, t, n) {
  return Math.min(Math.max(e, t), Math.max(t, n));
}
const gf = [
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
function Y_(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function X_() {
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
function vc(e) {
  const t = yt(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(hf).filter(Boolean) : [], r = yt(t.settings), o = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(Nf).filter(Boolean) : [];
  return {
    version: 3,
    clips: n,
    audioTracks: o,
    settings: {
      resolution: Se(r.resolution) || "auto",
      fps: Ln(r.fps, 0, 120, 0)
    }
  };
}
function Z_(e) {
  const t = e.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = e.clips.reduce((r, o, s) => s >= e.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function J_(e) {
  const t = e.clips.flatMap(
    (r, o) => r.blockingIssues.map(
      (s) => `${r.title || `镜头 ${o + 1}`}：${s}`
    )
  ), n = e.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function yf(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function Q_(e) {
  return e ? [
    yf(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function hf(e) {
  const t = yt(e), n = Se(t.id);
  if (!n)
    return null;
  const r = Ro(
    t.visualVideo ?? t.visual_video
  ), o = Ro(
    t.originalAudioSource ?? t.original_audio_source
  ), s = yt(
    t.transitionToNext ?? t.transition_to_next
  ), i = yt(
    t.storyboardTransitionToNext ?? t.storyboard_transition_to_next
  ), a = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map(bf).filter(Boolean) : [], c = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(_f).filter(Boolean) : [], u = wf(i), l = kc(s.type), m = Se(t.sourceEdgeId ?? t.source_edge_id);
  return {
    id: n,
    title: Se(t.title) || r?.label || "镜头",
    ...m ? { sourceEdgeId: m } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: If(t.duration),
    originalVolume: Ln(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: a,
    subtitleTracks: c,
    useOriginalVideo: Rc(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: Cf(t.blockingIssues ?? t.blocking_issues),
    transitionToNext: {
      type: l,
      durationMs: l === "none" ? 0 : Ln(
        s.durationMs ?? s.duration_ms,
        100,
        5e3,
        500
      )
    },
    ...u ? { storyboardTransitionToNext: u } : {}
  };
}
function wf(e) {
  if (!Object.keys(e).length)
    return;
  const t = kc(e.type);
  return {
    type: t,
    durationMs: t === "none" ? 0 : Ln(e.durationMs ?? e.duration_ms, 100, 5e3, 500)
  };
}
function _f(e) {
  const t = yt(e), n = Se(t.id), r = Se(t.text);
  if (!n || !r)
    return null;
  const o = Se(t.source) === "speech" ? "speech" : "caption", s = Se(t.speechId ?? t.speech_id), i = P(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...s ? { speechId: s } : {},
    source: o
  };
}
function bf(e) {
  const t = yt(e), n = Se(t.id);
  if (!n)
    return null;
  const r = Ro(t.audio), o = Se(t.kind) === "narration" ? "narration" : "dialogue", s = Se(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    fit: xc(t.fit, "trim"),
    kind: o,
    ...s ? { characterId: s } : {},
    text: Se(t.text),
    volume: Ln(t.volume, 0, 1, 1)
  };
}
function Nf(e) {
  const t = yt(e), n = Se(t.id);
  if (!n)
    return null;
  const r = Ro(t.audio), o = Se(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    kind: o,
    volume: Ln(t.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: xc(t.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && Rc(t.loop),
    fadeOut: Ln(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function xc(e, t) {
  return Se(e) === "strict" ? "strict" : Se(e) === "trim" ? "trim" : t;
}
function If(e) {
  const t = P(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Ro(e) {
  const t = yt(e), n = P(t.assetId ?? t.asset_id), r = P(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const o = Sf(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: Se(t.label),
    ...P(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: P(t.mediaIndex ?? t.media_index) } : {},
    ...Se(t.mediaUrl ?? t.media_url) ? { mediaUrl: Se(t.mediaUrl ?? t.media_url) } : {},
    ...Se(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: Se(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function Sf(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = yt(r), s = Se(o.url), i = P(o.index);
    if (!s && i <= 0)
      continue;
    const a = i > 0 ? `index:${i}` : `url:${s}`;
    n.has(a) || (n.add(a), t.push({
      url: s,
      index: i > 0 ? i : 0,
      ...Se(o.usage) ? { usage: Se(o.usage) } : {}
    }));
  }
  return t;
}
function kc(e) {
  const t = Se(e);
  return gf.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function Se(e) {
  return String(e ?? "").trim();
}
function Cf(e) {
  return Array.isArray(e) ? e.map(Se).filter(Boolean) : [];
}
function Ln(e, t, n, r) {
  const o = Number(e);
  return Number.isFinite(o) ? Math.min(n, Math.max(t, o)) : r;
}
function Rc(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
function On(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function Ac(e) {
  const t = String(e.status || "").trim();
  if (!t)
    return !1;
  const n = pr(t);
  return n === "pending" || n === "running" || n === "waiting";
}
function gn(e) {
  const t = e?.output && typeof e.output == "object" ? e.output : {}, n = e?.run && typeof e.run == "object" ? e.run : {};
  return {
    execution_id: Number(e?.execution_id || 0),
    run_id: Number(e?.run_id || n.id || 0),
    request_id: String(e?.request_id || n.request_id || ""),
    asset_cate_id: Number(e?.asset_cate_id || 0),
    start_node_id: String(e?.start_node_id || ""),
    execution_scope: String(
      e?.execution_scope || t.execution_scope || ""
    ),
    flow_run_id: Number(e?.flow_run_id || n.flow_run_id || 0),
    release_id: Number(e?.release_id || n.release_id || 0),
    status: pr(e?.status || n.status),
    error: Ht(e?.error || n.error),
    executed: Number(e?.executed || e?.output?.executed || 0),
    total: Number(e?.total || e?.output?.total || 0),
    single_node: !!e?.single_node,
    created_at: String(e?.created_at || ""),
    updated_at: String(e?.updated_at || ""),
    title: String(e?.title || ""),
    output: e?.output || n.output,
    approvals: Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [],
    interactions: Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [],
    node_results: Tc(
      e?.node_results || t.node_results
    ),
    pending_node: hi(
      e?.pending_node || t.pending_node
    ),
    execution_plan: Af(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(Df).filter((r) => !!r) : []
  };
}
function hi(e) {
  if (!e || typeof e != "object")
    return null;
  const t = String(e.node_key || "");
  return t ? {
    node_key: t,
    execution_id: Number(e.execution_id || 0),
    node_type: String(e.node_type || ""),
    node_run_id: Number(e.node_run_id || 0),
    run_id: Number(e.run_id || 0),
    request_id: String(e.request_id || ""),
    child_run_id: Number(e.child_run_id || 0),
    child_request_id: String(e.child_request_id || ""),
    status: pr(e.status),
    error: Ht(e.error),
    output: e.output,
    asset: e.asset,
    version: e.version,
    result: e.result,
    approval: e.approval,
    interaction: e.interaction,
    persists_result: !!e.persists_result,
    agent_run_id: Number(e.agent_run_id || 0),
    source_signature: String(e.source_signature || "")
  } : null;
}
function Tc(e) {
  return Array.isArray(e) ? e.map(hi).filter((t) => !!t) : [];
}
function vf(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = Tc(e.node_results), o = n ? r.find((s) => s.node_key === n) : r[0];
  return o || hi(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function wi(e) {
  return e ? Pc(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function Mc(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => pr(
    n.status || n.result?.status
  ) === "fail");
  return Pc(
    wi(t),
    e.output?.error,
    e.error
  );
}
function xf(e, t = "节点运行失败") {
  return _i(
    wi(e),
    t
  );
}
function Dc(e, t = "画布运行失败") {
  return _i(Mc(e), t);
}
function _i(e, t = "运行失败") {
  const n = Ht(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function kf(...e) {
  for (const t of e) {
    const n = Ht(t);
    if (n)
      return n;
  }
  return "";
}
const Ec = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function Rf(e) {
  return Ec.has(Ht(e));
}
function Pr(e) {
  const t = Ht(e);
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function Pc(...e) {
  let t = "";
  for (const n of e) {
    const r = Ht(n);
    if (r && (t ||= r, !Ec.has(r)))
      return r;
  }
  return t;
}
function Ht(e) {
  if (typeof e == "string")
    return e.trim();
  if (e instanceof Error)
    return e.message.trim();
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e, n = kf(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = Ht(t.code), o = Ht(t.detail);
  return [r, o].filter(Boolean).join(": ");
}
function Af(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(Tf).filter(
    (r) => !!r
  ) : [], n = Array.isArray(e.edges) ? e.edges.map(Mf).filter(
    (r) => !!r
  ) : [];
  return {
    nodes: t,
    edges: n,
    incoming: na(e.incoming),
    outgoing: na(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function Tf(e) {
  const t = String(e?.id || "");
  return t ? {
    id: t,
    type: String(e?.type || ""),
    title: String(e?.title || ""),
    kind: String(e?.kind || ""),
    output_type: String(e?.output_type || ""),
    group_id: String(e?.group_id || ""),
    function_key: String(e?.function_key || ""),
    asset_cate_id: Number(e?.asset_cate_id || 0),
    persists_result: !!e?.persists_result,
    stops_flow: !!e?.stops_flow
  } : null;
}
function Mf(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function na(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const o = Array.isArray(r) ? r.map((s) => String(s || "")).filter(Boolean) : [];
    t.set(String(n), o);
  }
  return t;
}
function Df(e) {
  const t = String(e?.node_key || ""), n = Number(e?.node_run_id || 0);
  return !t || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(e?.node_id || 0),
    node_key: t,
    node_type: String(e?.node_type || ""),
    status: pr(e?.status),
    persists_result: !!e?.persists_result
  };
}
const Bs = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, Ef = { width: 180, height: 180 }, Pf = { width: 240, height: 160 }, Ff = { width: 620, height: 360 };
function Of(e) {
  const t = ye(e);
  return {
    project: Vf(t.project),
    team: Lf(t.team),
    release: Kf(t.release),
    assetCates: Ct(t.asset_cates).map(qf),
    flows: Ct(t.flows).map(Hf),
    canvases: Yf(t.canvas),
    assets: Ct(ye(t.assets).items).map(Lc),
    initialAssetCateId: P(t.active_asset_cate_id)
  };
}
function mo(e) {
  return {
    assetCateId: e,
    nextNodeNo: 1,
    nodes: [],
    edges: [],
    viewport: {}
  };
}
function Fc(e, t = 0) {
  const n = ye(e), r = P(
    ge(n.asset_cate_id, t)
  );
  return Oc({
    assetCateId: r,
    nextNodeNo: Math.max(1, P(n.next_node_no)),
    nodes: Ct(n.nodes).map(Jf).filter((o) => !!o),
    edges: Ct(n.edges).map(mp).filter((o) => !!o),
    viewport: gp(n.viewport),
    updatedAt: S(n.updated_at)
  });
}
function Oc(e) {
  let t = bi(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((o) => {
    if (!zc(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const s = t++, i = o.titleMode || "manual";
    return n = !0, {
      ...o,
      nodeNo: s,
      titleMode: i,
      ...i === "auto" && !o.storyboardItem ? { title: jc(o, s) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function bi(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function zc(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function jc(e, t) {
  let n = "节点";
  if (e.type === "power") {
    const r = Kn(
      e.power,
      e.kind,
      e.outputType
    );
    n = r.outputType !== "general" && r.outputName || r.kindName;
  } else e.type === "agent" ? n = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (n = String(e.flow?.name || "流程").trim() || "流程");
  return `${n}-${t}`;
}
function zf(e) {
  const t = ye(e);
  return {
    roles: Ct(t.roles).map(Gf),
    powers: Ct(t.powers).map($c),
    powerCategories: Ct(t.power_cates).map(ql),
    powerKinds: Ct(t.power_kinds).map(Wf),
    outputTypes: Ct(t.output_types).map(Vc)
  };
}
function jr(e) {
  return Lc(ye(e));
}
function Bc(e) {
  return e.assetCates.length > 0 ? e.assetCates : [Bs];
}
function jf(e) {
  return Bc(e)[0]?.id ?? 0;
}
function $s(e, t) {
  const n = e.length > 0 ? e : [Bs];
  return n.find((r) => r.id === t) || n[0] || Bs;
}
function _s(e, t) {
  return $s(e.assetCates, t);
}
function Bf(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => yp(n).has(t)).slice(0, 4);
}
function $f(e) {
  return e.create_status !== 2;
}
function Uf(e) {
  return e.createStatus !== 2;
}
function qo(e, t, n, r, o) {
  const s = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, a = o?.asset, c = o?.flow, u = o?.functionOption, l = o?.power, m = o?.role, I = l ? Kn(l) : null, N = Number(a?.asset_cate_id || t.id), w = {
    asset: [
      a?.name || "资产引用",
      a ? Zi(a.kind) : Zi(t.kind),
      a && ac(a.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      l?.name || hp(t.kind),
      I?.outputName || I?.kindName || "能力节点",
      l ? `调用 ${l.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      m?.name || "智能体节点",
      m?.role_type || "角色执行",
      m?.assignment || "调用团队角色或指定智能体完成一段任务。"
    ],
    flow: [
      c?.name || "流程节点",
      "团队流程",
      c?.goal || "执行一组团队预设流程。"
    ],
    function: [
      u?.label || "保存节点",
      "功能",
      u?.description || "开始、导入、保存、展示等功能节点。"
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。"
    ]
  }, [E, F, $] = w[e], V = qc(e, l);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: E,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: F,
    description: $,
    x: s,
    y: i,
    width: V.width,
    height: V.height,
    assetCateId: N,
    kind: a?.kind || l?.kind || t.kind,
    outputType: l?.outputType,
    cardinality: t.cardinality,
    asset: a,
    flow: c,
    functionOption: u,
    power: l,
    role: m,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function Vf(e) {
  const t = ye(e), n = ye(t.team);
  return {
    id: P(t.id),
    body_id: P(t.body_id),
    team_id: P(t.team_id),
    release_id: P(t.release_id),
    name: S(t.name) || "未命名作品",
    description: S(t.description),
    mode: S(t.mode) || "team",
    team: {
      id: P(n.id),
      name: S(n.name),
      version: P(n.version)
    }
  };
}
function Lf(e) {
  const t = ye(e);
  return {
    id: P(t.id),
    name: S(t.name) || "自由团队",
    description: S(t.description)
  };
}
function Kf(e) {
  const t = ye(e);
  return {
    id: P(t.id),
    team_id: P(t.team_id),
    version: P(t.version),
    status: S(t.status)
  };
}
function qf(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    name: S(e.name) || "未命名资产",
    kind: S(e.kind) || "text",
    cardinality: S(e.cardinality) || "single",
    status: P(e.status),
    sort: P(e.sort)
  };
}
function Gf(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    role_type: S(e.role_type),
    role_key: S(e.role_key),
    name: S(e.name),
    agent_id: P(e.agent_id),
    assignment: S(e.assignment),
    create_status: Uc(e.create_status)
  };
}
function Hf(e) {
  return {
    id: P(e.id),
    name: S(e.name),
    key: S(e.key),
    goal: S(e.goal),
    config: ye(e.config),
    status: P(e.status),
    sort: P(e.sort),
    output_asset_cate_ids: Hc(e.output_asset_cate_ids)
  };
}
function $c(e) {
  const t = S(e.kind) || "text", n = Vc(ye(e.output)), r = S(e.output_type) || "general";
  return {
    id: P(e.id),
    cate_id: P(e.cate_id),
    name: S(e.name) || S(e.key) || "未命名能力",
    key: S(e.key),
    icon: S(e.icon),
    description: S(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: Uc(e.create_status)
  };
}
function Uc(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Vc(e) {
  return {
    key: S(e.key),
    name: S(e.name),
    allowedKinds: _o(e.allowed_kinds),
    viewMode: S(e.view_mode),
    defaultWidth: P(e.default_width),
    defaultHeight: P(e.default_height),
    structured: !!e.structured,
    sort: P(e.sort)
  };
}
function Wf(e) {
  return {
    id: S(e.id),
    value: S(e.value) || S(e.name) || S(e.id)
  };
}
function Lc(e) {
  const t = Ni(ye(e.version)), n = Ii(e.versions);
  return {
    id: P(e.id),
    project_id: P(ge(e.project_id, e.projectID)),
    body_id: P(ge(e.body_id, e.bodyID)),
    team_id: P(ge(e.team_id, e.teamID)),
    flow_id: P(ge(e.flow_id, e.flowID)),
    asset_cate_id: P(
      ge(e.asset_cate_id, e.assetCateID)
    ),
    node_key: S(ge(e.node_key, e.nodeKey)),
    name: S(e.name),
    kind: S(e.kind) || "text",
    role: S(e.role),
    version_id: P(ge(e.version_id, e.versionID)),
    status: S(e.status),
    sort: P(e.sort),
    created_at: S(ge(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function Ni(e) {
  const t = P(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: P(ge(e.asset_id, e.assetID)),
      run_id: P(ge(e.run_id, e.runID)),
      node_run_id: P(ge(e.node_run_id, e.nodeRunID)),
      release_id: P(ge(e.release_id, e.releaseID)),
      request_id: S(ge(e.request_id, e.requestID)),
      node_key: S(ge(e.node_key, e.nodeKey)),
      source: ye(e.source),
      version: P(e.version),
      summary: S(e.summary),
      content: e.content,
      created_at: S(ge(e.created_at, e.createdAt)),
      updated_at: S(ge(e.updated_at, e.updatedAt))
    };
}
function Ii(e) {
  return Ct(e).map(Ni).filter((t) => !!t);
}
function Yf(e) {
  const t = ye(e), n = {};
  for (const [r, o] of Object.entries(t)) {
    const s = Fc(o, P(r));
    n[String(s.assetCateId)] = s;
  }
  return n;
}
function Xf(e, t) {
  const n = new Map(
    t.filter((o) => o.id > 0).map((o) => [o.id, o])
  ), r = new Map(
    t.filter((o) => o.key).map((o) => [o.key, o])
  );
  for (const o of Object.values(e))
    o.nodes = o.nodes.map((s) => {
      if (s.type !== "power" || !s.power)
        return s;
      const i = n.get(Number(s.power.id || 0)) || r.get(s.power.key);
      if (!i)
        return s;
      const a = s.outputType || s.power.outputType || i.outputType;
      return {
        ...s,
        outputType: a,
        power: {
          ...i,
          outputType: a,
          output: i.outputType === a ? i.output : s.power.output
        }
      };
    });
  return e;
}
function Zf(e, t) {
  return Xf(
    { [String(e.assetCateId)]: e },
    t
  )[String(e.assetCateId)];
}
function Jf(e) {
  const t = S(e.id), n = S(e.type);
  if (!t || !n)
    return null;
  const r = S(e.run_error), o = {
    id: t,
    nodeNo: P(e.node_no) || void 0,
    type: n,
    title: S(e.title),
    titleMode: S(e.title_mode) === "manual" ? "manual" : S(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: S(e.subtitle),
    description: S(e.description),
    x: P(e.x),
    y: P(e.y),
    width: P(e.width),
    height: P(e.height),
    groupId: S(e.group_id),
    group: ep(e.group),
    storyboardItem: tp(e.storyboard_item),
    storyboardMaterializedSignature: S(
      e.storyboard_materialized_signature
    ),
    assetCateId: P(e.asset_cate_id),
    outputType: S(e.output_type),
    count: e.count == null ? void 0 : P(e.count),
    functionOption: ip(e.function_option),
    composerDraft: up(e.composer_draft),
    resultRef: pp(e.result_ref),
    resultOutput: e.result_output,
    resultView: Qf(e.result_view),
    runError: Pr(r) ? "" : r,
    local: e.local !== !1
  }, s = S(e.kind), i = S(
    e.cardinality
  ), a = np(e.flow), c = rp(e.role), u = op(e.asset), l = sp(e.power);
  return s && (o.kind = s), i && (o.cardinality = i), a && (o.flow = a), c && (o.role = c), u && (o.asset = u), l && (o.power = l, o.outputType = o.outputType || l.outputType), o;
}
function Qf(e) {
  const t = ye(e), n = Pt(t.width), r = Pt(t.height);
  if (n == null || r == null || n <= 0 || r <= 0)
    return;
  const o = Pt(t.offset_x), s = Pt(t.offset_y);
  return {
    width: n,
    height: r,
    ...o == null ? {} : { offsetX: o },
    ...s == null ? {} : { offsetY: s }
  };
}
function ep(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return {
      origin: S(t.origin),
      sourceNodeId: S(t.source_node_id),
      syncKey: S(t.sync_key),
      layoutKey: S(t.layout_key)
    };
}
function tp(e) {
  const t = ye(e), n = S(t.source_node_id), r = S(t.item_type), o = S(t.item_id);
  if (!(!n || !o || ![
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
    "speech",
    "subtitle",
    "lip_sync",
    "video_compose"
  ].includes(r)))
    return {
      sourceNodeId: n,
      itemType: r,
      itemId: o,
      generatedPrompt: S(t.generated_prompt),
      dependencyNodeIds: _o(t.dependency_node_ids),
      referenceNodeIds: _o(t.reference_node_ids),
      externalReferenceAssetIds: Hc(t.external_reference_asset_ids),
      shotId: S(t.shot_id),
      speechId: S(t.speech_id),
      speechIds: _o(t.speech_ids),
      characterId: S(t.character_id),
      speechKind: S(t.speech_kind),
      speakerMode: S(t.speaker_mode),
      startTime: Pt(t.start_time),
      shotDuration: Pt(t.shot_duration),
      continuityAnchor: S(t.continuity_anchor),
      optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true",
      sourceSignature: S(t.source_signature),
      resultSourceSignature: S(t.result_source_signature),
      stale: t.stale === !0 || t.stale === 1 || String(t.stale || "").toLowerCase() === "true"
    };
}
function np(e) {
  const t = ye(e), n = P(t.id), r = S(t.key), o = S(t.name);
  if (!(!n && !r && !o))
    return {
      id: n,
      key: r,
      name: o,
      goal: S(t.goal)
    };
}
function rp(e) {
  const t = ye(e), n = P(t.id), r = S(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: S(t.role_type),
      agent_id: P(t.agent_id)
    };
}
function op(e) {
  const t = ye(e), n = P(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: P(t.asset_cate_id),
      name: S(t.name),
      kind: S(t.kind),
      role: S(t.role),
      version_id: P(t.version_id),
      sort: 0
    };
}
function sp(e) {
  const t = ye(e), n = P(t.id), r = S(t.key);
  if (!(!n && !r))
    return $c({
      ...t,
      id: n,
      key: r,
      name: S(t.name)
    });
}
function ip(e) {
  const t = ye(e), n = S(t.key);
  if (n)
    return {
      key: n,
      label: S(t.label),
      description: S(t.description)
    };
}
function Kc(e) {
  const t = ye(e);
  if (!Object.keys(t).length)
    return;
  const n = S(t.storyboardGridLayout);
  return {
    prompt: S(t.prompt),
    promptContent: fp(t.promptContent),
    paramValues: ye(t.paramValues),
    selectedTargetId: P(t.selectedTargetId),
    videoComposition: vc(t.videoComposition),
    storyboardReferences: ic(
      t.storyboardReferences
    ),
    storyboardWorkType: lp(t.storyboardWorkType),
    storyboardGridLayout: n ? sc(n) : void 0,
    multiImageMode: dp(t.multiImageMode)
  };
}
function Si(e) {
  return Kc(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function ap(e) {
  const t = Si(e), n = cp(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function ra(e) {
  return JSON.stringify([
    e.prompt,
    e.promptContent || null,
    e.paramValues || {},
    e.selectedTargetId || 0,
    e.storyboardReferences || [],
    e.storyboardWorkType || "",
    e.storyboardGridLayout || "",
    e.multiImageMode || ""
  ]);
}
function eb(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function cp(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function dp(e) {
  const t = S(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function up(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return Kc({
      prompt: t.prompt,
      promptContent: t.prompt_content,
      paramValues: t.param_values,
      selectedTargetId: t.selected_target_id,
      videoComposition: t.video_composition,
      storyboardReferences: t.storyboard_references,
      storyboardWorkType: t.storyboard_work_type,
      storyboardGridLayout: t.storyboard_grid_layout,
      multiImageMode: t.multi_image_mode
    });
}
function lp(e) {
  const t = S(e);
  return li(t) ? t : void 0;
}
function fp(e) {
  const t = ye(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const o = ye(r);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function pp(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return {
      run_id: P(t.run_id),
      request_id: S(t.request_id),
      flow_run_id: P(t.flow_run_id),
      node_run_id: P(t.node_run_id),
      asset_id: P(t.asset_id),
      version_id: P(t.version_id),
      release_id: P(t.release_id),
      role: S(t.role),
      status: S(t.status),
      updated_at: S(t.updated_at)
    };
}
function mp(e) {
  const t = S(e.from), n = S(e.to);
  if (!t || !n)
    return null;
  const r = S(e.purpose);
  return {
    id: S(e.id) || `edge-${t}-${n}`,
    from: t,
    to: n,
    logicalFrom: S(e.logical_from) || void 0,
    logicalTo: S(e.logical_to) || void 0,
    purpose: r === "media" || r === "structure" || r === "dependency" ? r : void 0,
    executionMode: S(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: S(e.media_usage) || void 0
  };
}
function gp(e) {
  const t = ye(e), n = {};
  return t.x != null && (n.x = P(t.x)), t.y != null && (n.y = P(t.y)), t.zoom != null && (n.zoom = P(t.zoom)), n;
}
function yp(e) {
  return new Set(e.output_asset_cate_ids);
}
function hp(e) {
  switch (e) {
    case "image":
      return "生图能力";
    case "video":
      return "生视频能力";
    case "audio":
      return "生音频能力";
    default:
      return "文生文能力";
  }
}
function qc(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...lf };
    case "power":
      return Go(t);
    default:
      return { width: 250, height: 170 };
  }
}
function Go(e) {
  if (pi(e))
    return { ...Pf };
  const t = wp(e);
  return t || (Ko(e) ? { ...Ff } : { ...Ef });
}
function wp(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function Gc(e) {
  const t = qc(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function _o(e) {
  return Array.isArray(e) ? e.map(S).filter(Boolean) : [];
}
function Hc(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = P(r);
    !o || o <= 0 || n.has(o) || (n.add(o), t.push(o));
  }
  return t;
}
function Ct(e) {
  return Array.isArray(e) ? e.filter(_n) : [];
}
function ye(e) {
  return _n(e) ? e : {};
}
function S(e) {
  return e == null ? "" : String(e).trim();
}
function _p(e) {
  const t = new Map(e.nodes.map((o) => [o.id, o]));
  let n = !1;
  const r = e.nodes.map((o) => {
    const s = o.storyboardItem?.dependencyNodeIds || [];
    if (o.storyboardItem?.itemType !== "shot" || !o.storyboardItem.continuityAnchor || s.length !== 1)
      return o;
    const i = s[0], a = bp(t.get(i)), c = (o.storyboardItem.referenceNodeIds || []).filter(
      (N) => N !== i
    ), u = o.composerDraft?.promptContent, l = u && {
      ...u,
      parts: u.parts.filter(
        (N) => N.type !== "reference" || N.ref_type !== "asset" || !a || Number(N.ref_id || 0) !== a
      )
    }, m = c.length !== (o.storyboardItem.referenceNodeIds || []).length, I = l?.parts.length !== u?.parts.length;
    return !m && !I ? o : (n = !0, {
      ...o,
      storyboardItem: {
        ...o.storyboardItem,
        referenceNodeIds: c
      },
      composerDraft: o.composerDraft ? { ...o.composerDraft, promptContent: l } : o.composerDraft
    });
  });
  return n ? { ...e, nodes: r } : e;
}
function bp(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function Wc(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(Np),
    edges: e.edges.map((t) => ({
      id: t.id,
      from: t.from,
      to: t.to,
      ...t.logicalFrom ? { logical_from: t.logicalFrom } : {},
      ...t.logicalTo ? { logical_to: t.logicalTo } : {},
      ...t.purpose ? { purpose: t.purpose } : {},
      ...t.executionMode === "manual" ? { execution_mode: "manual" } : {},
      ...t.mediaUsage ? { media_usage: t.mediaUsage } : {}
    })),
    viewport: {
      ...e.viewport.x == null ? {} : { x: e.viewport.x },
      ...e.viewport.y == null ? {} : { y: e.viewport.y },
      ...e.viewport.zoom == null ? {} : { zoom: e.viewport.zoom }
    }
  };
}
function Np(e) {
  const t = {
    id: e.id,
    type: e.type,
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height
  };
  if (bo(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), St(t, "group_id", e.groupId), e.group) {
    const i = {};
    St(i, "origin", e.group.origin), St(i, "source_node_id", e.group.sourceNodeId), St(i, "sync_key", e.group.syncKey), St(i, "layout_key", e.group.layoutKey), Object.keys(i).length > 0 && (t.group = i);
  }
  if (e.storyboardItem) {
    const i = e.storyboardItem;
    t.storyboard_item = {
      source_node_id: i.sourceNodeId,
      item_type: i.itemType,
      item_id: i.itemId,
      ...i.generatedPrompt ? { generated_prompt: i.generatedPrompt } : {},
      dependency_node_ids: i.dependencyNodeIds || [],
      reference_node_ids: i.referenceNodeIds || [],
      external_reference_asset_ids: i.externalReferenceAssetIds || [],
      ...i.shotId ? { shot_id: i.shotId } : {},
      ...i.speechId ? { speech_id: i.speechId } : {},
      ...i.speechIds?.length ? { speech_ids: i.speechIds } : {},
      ...i.characterId ? { character_id: i.characterId } : {},
      ...i.speechKind ? { speech_kind: i.speechKind } : {},
      ...i.speakerMode ? { speaker_mode: i.speakerMode } : {},
      ...Number.isFinite(i.startTime) ? { start_time: i.startTime } : {},
      ...Number.isFinite(i.shotDuration) ? { shot_duration: i.shotDuration } : {},
      ...i.continuityAnchor ? { continuity_anchor: i.continuityAnchor } : {},
      ...i.optional ? { optional: !0 } : {},
      ...i.sourceSignature ? { source_signature: i.sourceSignature } : {},
      ...i.resultSourceSignature ? { result_source_signature: i.resultSourceSignature } : {},
      ...i.stale ? { stale: !0 } : {}
    };
  }
  St(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), bo(t, "asset_cate_id", e.assetCateId), St(t, "kind", e.kind), St(t, "output_type", e.outputType), St(t, "cardinality", e.cardinality), bo(t, "count", e.count), e.flow && (t.flow = {
    id: e.flow.id,
    key: e.flow.key,
    name: e.flow.name,
    goal: e.flow.goal
  }), e.role && (t.role = {
    id: e.role.id,
    name: e.role.name,
    role_type: e.role.role_type,
    agent_id: e.role.agent_id
  }), e.asset && (t.asset = {
    id: e.asset.id,
    name: e.asset.name,
    kind: e.asset.kind,
    role: e.asset.role,
    asset_cate_id: e.asset.asset_cate_id,
    version_id: e.asset.version_id
  }), e.power && (t.power = {
    id: e.power.id,
    key: e.power.key,
    name: e.power.name,
    kind: e.power.kind,
    icon: e.power.icon,
    output_type: e.power.outputType,
    output: Cp(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = Sp(e.composerDraft);
  n && (t.composer_draft = n);
  const r = Rp(e.resultRef);
  r && (t.result_ref = r), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && un(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = Ip(e.resultView);
  return s && (t.result_view = s), Pr(e.runError) || St(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Ip(e) {
  if (!e)
    return;
  const t = Pt(e.width), n = Pt(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, o = Pt(e.offsetX), s = Pt(e.offsetY);
  return o != null && (r.offset_x = o), s != null && (r.offset_y = s), r;
}
function Sp(e) {
  if (!_n(e))
    return null;
  const t = {};
  St(t, "prompt", e.prompt);
  const n = vp(e.promptContent);
  n && un(n) && (t.prompt_content = n), bo(t, "selected_target_id", e.selectedTargetId);
  const r = xp(e.paramValues);
  r && (t.param_values = r);
  const o = vc(e.videoComposition);
  o && un(o) && (t.video_composition = o);
  const s = ic(
    e.storyboardReferences
  );
  return s.length > 0 && un(s) && (t.storyboard_references = s), li(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), e.storyboardGridLayout && (t.storyboard_grid_layout = sc(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function Cp(e) {
  if (e)
    return {
      key: e.key,
      name: e.name,
      allowed_kinds: e.allowedKinds,
      view_mode: e.viewMode,
      default_width: e.defaultWidth,
      default_height: e.defaultHeight,
      structured: e.structured,
      sort: e.sort
    };
}
function vp(e) {
  if (!(!_n(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function xp(e) {
  if (!_n(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    kp(r) || un(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function kp(e) {
  return _n(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function Rp(e) {
  if (!_n(e))
    return null;
  const t = {};
  for (const n of [
    "run_id",
    "request_id",
    "flow_run_id",
    "node_run_id",
    "asset_id",
    "version_id",
    "release_id",
    "role",
    "status",
    "updated_at"
  ]) {
    const r = e[n];
    r != null && un(r) && (t[n] = r);
  }
  return Object.keys(t).length ? t : null;
}
function St(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n);
}
function bo(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function un(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(un) : _n(e) ? Object.values(e).every(un) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Ao = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Ao || Object.keys(Ao).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const xe = Ao.joinSiteApi, ke = Ao.request;
async function Ap(e, t = 0) {
  const n = await ke(xe("workspace/bootstrap"), "get", {
    project_id: e,
    asset_cate_id: t
  });
  return Of(
    mr(n, "加载创作空间失败")
  );
}
async function Tp(e) {
  const t = await ke(xe("workspace/canvas"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = lt(t, "加载分类画布失败"), r = n.assets || {}, o = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: Fc(n.canvas, e.assetCateId),
    assets: o.map(jr)
  };
}
async function Mp(e) {
  const t = await ke(xe("project/canvas_config"), "get", {
    project_id: e
  });
  return zf(
    mr(t, "加载能力列表失败")
  );
}
async function Dp(e) {
  const t = await ke(xe("project/canvas_power_form"), "get", {
    project_id: e.projectId,
    flow_id: e.flowId || 0,
    power_id: e.powerId,
    power_key: e.powerKey,
    target_id: e.targetId || 0
  });
  return qp(
    mr(t, "加载能力参数失败")
  );
}
async function Ep(e) {
  const t = await ke(xe("workspace/canvas_execute"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    start_node_id: e.startNodeId,
    request_id: e.requestId || "",
    single_node: !!e.singleNode,
    execution_scope: e.executionScope || "",
    canvas: Wc(_p(e.canvas)),
    input: e.runInput || {}
  });
  return lt(t, "画布运行失败");
}
async function Pp(e) {
  const t = await ke(
    xe("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    }
  ), n = lt(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function Wr(e, t, n) {
  const r = lt(e, t).asset;
  if (!r)
    throw new Error(n);
  return jr(r);
}
async function bs(e) {
  const t = await ke(
    xe("workspace/canvas_execution_list"),
    "get",
    {
      project_id: e.projectId,
      scope: e.scope,
      asset_cate_id: e.assetCateId || 0,
      run_ids: (e.runIds || []).filter((r) => r > 0).join(","),
      before_id: e.beforeId || 0,
      limit: e.limit || 20,
      summary_only: e.summaryOnly ? 1 : 0
    }
  ), n = lt(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function Yc(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), o = await ke(
    xe("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    }
  );
  return lt(o, "读取画布运行详情失败");
}
async function Fp(e) {
  const t = await ke(xe("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return mr(t, "继续画布运行失败");
}
async function Op(e) {
  const t = await ke(xe("run/status"), "get", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || "",
    view: "summary"
  });
  return mr(t, "读取流程状态失败");
}
async function zp(e) {
  const t = await ke(xe("run/stop"), "post", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || ""
  });
  return lt(t, "停止画布运行失败");
}
async function jp(e) {
  const t = await ke(
    xe("workspace/canvas_stop_all"),
    "post",
    { project_id: e }
  ), n = lt(t, "停止全部画布运行失败");
  return {
    count: Number(n.count || 0),
    stoppedCount: Number(n.stopped_count || 0),
    failedCount: Number(n.failed_count || 0),
    items: Array.isArray(n.items) ? n.items : []
  };
}
async function Bp(e) {
  const t = await ke(xe("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return mr(t, "提交信息失败");
}
async function $p(e) {
  const t = await ke(
    xe("project/update_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      content: e.content
    }
  );
  return Wr(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function tb(e) {
  const t = await ke(
    xe("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Wr(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function nb(e) {
  const t = await ke(
    xe("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return Wr(t, "确认分镜失败", "确认分镜结果为空");
}
async function rb(e) {
  const t = await ke(
    xe("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Wr(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function ob(e) {
  const t = e.storyboard.shots.findIndex(
    (s) => s.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await ke(
    xe("project/generate_storyboard_shot"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      flow_id: e.flowId,
      asset_cate_id: e.assetCateId,
      request_id: e.requestId,
      node_key: e.nodeKey,
      node_name: e.nodeName,
      power_id: e.powerId,
      power_key: e.powerKey,
      source_target_id: e.sourceTargetId,
      params: e.params,
      storyboard: e.storyboard,
      shot_id: e.shotId,
      instruction: e.instruction
    }
  ), r = lt(n, "生成镜头失败"), o = Nl(r, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function sb(e) {
  const t = await ke(xe("project/asset_detail"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    current_only: e.currentOnly ? 1 : 0
  }), n = lt(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const o = Ii(n.versions);
  return {
    asset: jr(r),
    versions: o,
    versionTotal: Number(n.version_total || o.length),
    hasMore: !!n.has_more
  };
}
async function ib(e) {
  const t = await ke(xe("project/asset_versions"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    page: e.page,
    page_size: e.pageSize || 20
  }), n = lt(t, "读取资产版本失败"), r = Ii(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function ab(e) {
  const t = await ke(
    xe("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    }
  ), n = lt(t, "读取历史版本失败").version, r = Ni(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function Up(e) {
  const t = {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name,
    kind: e.kind,
    content: e.content,
    request_id: e.requestId || ""
  };
  if (e.runId && (t.run_id = e.runId), e.nodeRunId && (t.node_run_id = e.nodeRunId), e.releaseId && (t.release_id = e.releaseId), e.nodeKey && (t.node_key = e.nodeKey), e.source) {
    const n = e.source;
    n.sourceKey && (t.source_key = n.sourceKey), n.sourceRunId && (t.source_run_id = n.sourceRunId), n.sourceNodeRunId && (t.source_node_run_id = n.sourceNodeRunId), n.sourceAssetId && (t.source_asset_id = n.sourceAssetId), n.sourceVersionId && (t.source_version_id = n.sourceVersionId), n.sourceReleaseId && (t.source_release_id = n.sourceReleaseId), n.sourceRequestId && (t.source_request_id = n.sourceRequestId), n.sourceNodeKey && (t.source_node_key = n.sourceNodeKey), n.sourceNodeType && (t.source_node_type = n.sourceNodeType), n.sourceStatus && (t.source_status = n.sourceStatus);
  }
  return t;
}
async function Xc(e, t) {
  const n = await ke(xe("project/save_asset"), "post", {
    ...Up(t),
    role: e
  });
  return Wr(n, "保存资产失败", "保存资产结果为空");
}
function Vp(e) {
  return Xc("work", e);
}
function Lp(e) {
  return Xc("material", e);
}
async function Kp(e, t, n) {
  const r = await ke(xe("workspace/canvas"), "post", {
    project_id: e,
    asset_cate_id: t,
    base_revision: n.updatedAt || "",
    canvas: Wc(n)
  }), o = lt(r, "保存画布失败");
  return {
    assetCateId: Number(o.asset_cate_id || t || 0),
    updatedAt: String(o.updated_at || n.updatedAt || "")
  };
}
function qp(e) {
  const t = e && typeof e == "object" ? e : {}, n = Wp(
    t.storyboard_work_types
  ), r = Yp(
    t.storyboard_reference_purposes,
    n
  ), o = String(
    t.power?.output_type || t.power?.outputType || ""
  ).trim(), s = String(
    t.power?.output?.view_mode || t.power?.output?.viewMode || ""
  ).trim();
  if ((o === "storyboard" || s === "storyboard") && (n.length === 0 || r.length === 0))
    throw new Error("分镜作品类型或参考用途注册信息缺失");
  const i = new Set(
    r.map((a) => a.key)
  );
  if (n.some(
    (a) => a.required_reference_purposes.some(
      (c) => !i.has(c)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: Array.isArray(t.sources) ? t.sources : [],
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: n,
    storyboard_reference_purposes: r
  };
}
const Gp = /* @__PURE__ */ new Set(["image", "video", "audio"]), Hp = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Wp(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = n && typeof n == "object" ? n : {}, o = String(r.key || "").trim().toLowerCase();
    if (!li(o) || t.has(o))
      throw new Error("分镜作品类型注册信息无效");
    const s = Number(r.sort || 0);
    if (!Number.isInteger(s))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(o), {
      key: o,
      name: String(r.name || "").trim() || o,
      sort: s,
      required_reference_purposes: No(
        r.required_reference_purposes
      )
    };
  }).sort((n, r) => n.sort - r.sort);
}
function Yp(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((o) => o.key)), r = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const s = o && typeof o == "object" ? o : {}, i = String(s.key || "").trim(), a = No(s.media_kinds), c = String(
      s.scope || ""
    ).trim(), u = No(s.work_types), l = No(
      s.default_media_kinds
    ), m = String(s.material_type || "").trim(), I = Number(s.max_count || 0), N = Number(s.sort || 0);
    if (!i || r.has(i) || a.length === 0 || a.some((w) => !Gp.has(w)) || !Hp.has(c) || u.some((w) => !n.has(w)) || l.some((w) => !a.includes(w)) || c === "material" && m !== "character" && m !== "scene" && m !== "prop" || c !== "material" && m || !Number.isInteger(I) || I < 0 || !Number.isInteger(N))
      throw new Error("分镜参考用途注册信息无效");
    return r.add(i), {
      key: i,
      name: String(s.name || "").trim() || i,
      media_kinds: a,
      work_types: u,
      scope: c,
      material_type: m,
      default_media_kinds: l,
      max_count: I,
      sort: N
    };
  }).sort((o, s) => o.sort - s.sort);
}
function No(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const oa = 520, Xp = 8e3;
function Zp({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: o
}) {
  const s = H(n), i = H({}), a = H({}), c = H({}), u = H(/* @__PURE__ */ new Map()), l = H({}), m = H(0), I = H(null), [N, w] = K(0), [E, F] = K({});
  ce(() => {
    s.current = n;
  }, [n]);
  const $ = D((C) => {
    const k = l.current[C];
    k != null && (window.clearTimeout(k), delete l.current[C]);
  }, []), V = D(
    (C, k = oa) => {
      if (!t || !e || typeof window > "u")
        return;
      $(C);
      const X = m.current;
      l.current[C] = window.setTimeout(() => {
        delete l.current[C], I.current?.(C, X)?.catch(() => {
        });
      }, k);
    },
    [$, t, e]
  ), q = D(
    async (C, k, X) => {
      if (k !== m.current || !t || !e)
        return;
      for (; u.current.has(C); )
        if (await u.current.get(C), k !== m.current)
          return;
      const pe = X?.revision ?? i.current[C] ?? 0;
      if (pe <= (a.current[C] || 0))
        return;
      const ne = X?.canvas || s.current[C];
      if (!ne)
        return;
      const he = (async () => {
        F((re) => ({ ...re, [C]: "saving" }));
        try {
          const re = await Kp(
            e,
            ne.assetCateId,
            ne
          );
          if (k !== m.current)
            return;
          a.current[C] = Math.max(
            a.current[C] || 0,
            pe
          ), c.current[C] = 0, (i.current[C] || 0) === pe ? (r((Ie) => {
            const Re = Ie[C], fe = re.updatedAt || Re?.updatedAt;
            return !Re || Re.updatedAt === fe ? Ie : {
              ...Ie,
              [C]: { ...Re, updatedAt: fe }
            };
          }), F((Ie) => ({
            ...Ie,
            [C]: "saved"
          }))) : F((Ie) => ({
            ...Ie,
            [C]: "dirty"
          }));
        } catch (re) {
          if (k !== m.current)
            return;
          const te = (c.current[C] || 0) + 1;
          throw c.current[C] = te, F((Ie) => ({ ...Ie, [C]: "error" })), te === 1 && o(re), V(
            C,
            Math.min(Xp, oa * 2 ** te)
          ), re;
        } finally {
          k === m.current && (i.current[C] || 0) > (a.current[C] || 0) && (c.current[C] || 0) === 0 && V(C);
        }
      })();
      u.current.set(C, he);
      try {
        await he;
      } finally {
        u.current.get(C) === he && u.current.delete(C);
      }
    },
    [t, o, e, V, r]
  );
  I.current = q;
  const Y = D(
    async (C) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const k = String(C.assetCateId), X = m.current, pe = (i.current[k] || 0) + 1;
      if (i.current[k] = pe, c.current[k] = 0, $(k), F((ne) => ({ ...ne, [k]: "dirty" })), await q(k, X, { canvas: C, revision: pe }), X !== m.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [$, t, e, q]
  ), oe = D((C) => {
    const k = String(C);
    i.current[k] = (i.current[k] || 0) + 1, c.current[k] = 0, F((X) => ({ ...X, [k]: "dirty" })), w((X) => X + 1);
  }, []), v = D(
    (C) => {
      m.current += 1;
      for (const X of Object.keys(l.current))
        $(X);
      i.current = {}, a.current = {}, c.current = {}, u.current.clear();
      const k = {};
      for (const X of Object.keys(C))
        k[X] = "saved";
      F(k);
    },
    [$]
  );
  return ce(() => {
    for (const [C, k] of Object.entries(i.current))
      k > (a.current[C] || 0) && V(C);
  }, [V, N]), ce(
    () => () => {
      m.current += 1;
      for (const C of Object.values(l.current))
        window.clearTimeout(C);
      l.current = {};
    },
    []
  ), {
    markCanvasDirty: oe,
    flushCanvasSave: Y,
    resetCanvasAutosave: v,
    canvasSaveStatus: E
  };
}
const Jp = 6e4, Qp = 60;
class em {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = tm(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, o = !1) {
    this.setScope(t, n);
    const s = this.scopeKey, i = this.catalogs.get(s) || { loadedAt: 0 };
    if (!o && i.value && Date.now() - i.loadedAt < Jp)
      return Promise.resolve(i.value);
    if (i.inFlight)
      return i.inFlight;
    const a = r().then((c) => (this.scopeKey === s && this.catalogs.set(s, { value: c, loadedAt: Date.now() }), c)).catch((c) => {
      throw this.scopeKey === s && this.catalogs.set(s, {
        value: i.value,
        loadedAt: i.loadedAt
      }), c;
    });
    return this.catalogs.set(s, { ...i, inFlight: a }), a;
  }
  loadPowerForm(t, n) {
    this.setScope(t.projectId, t.releaseId);
    const r = this.scopeKey, o = nm(t), s = this.powerForms.get(o);
    if (s?.value)
      return this.touchPowerForm(o, s), Promise.resolve(s.value);
    if (s?.inFlight)
      return s.inFlight;
    const i = n().then((a) => (this.scopeKey === r && (this.touchPowerForm(o, { value: a }), this.trimPowerForms()), a)).catch((a) => {
      throw this.scopeKey === r && this.powerForms.delete(o), a;
    });
    return this.touchPowerForm(o, { inFlight: i }), this.trimPowerForms(), i;
  }
  touchPowerForm(t, n) {
    this.powerForms.delete(t), this.powerForms.set(t, n);
  }
  trimPowerForms() {
    for (; this.powerForms.size > Qp; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function tm(e, t) {
  return `${e || 0}:${t || 0}`;
}
function nm(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function rm(e, t, n) {
  const r = new Map(t.map((c) => [c.id, c])), o = om(n), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const c of t)
    c.groupId && i.set(c.groupId, [
      ...i.get(c.groupId) || [],
      c.id
    ]);
  const a = (c) => {
    for (const u of o.get(c) || []) {
      if (s.has(u))
        continue;
      s.add(u);
      const l = r.get(u);
      if (l?.type === "group")
        for (const m of i.get(l.id) || [])
          s.has(m) || (s.add(m), a(m));
      (!l || !Zc(l)) && a(u);
    }
  };
  return a(e), [...s];
}
function Zc(e) {
  return e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Ho(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function om(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.from || !n.to || n.executionMode === "manual")
      continue;
    const r = n.logicalFrom || n.from, o = n.logicalTo || n.to;
    t.set(r, [
      ...t.get(r) || [],
      o
    ]);
  }
  return t;
}
function Jc({
  targets: e,
  nodesByID: t,
  hasResult: n
}) {
  const r = new Set(e.map((o) => o.id));
  for (const o of e) {
    const s = o.storyboardItem;
    if (!s)
      continue;
    const i = /* @__PURE__ */ new Set([
      ...s.dependencyNodeIds || [],
      ...s.referenceNodeIds || []
    ]);
    for (const a of i) {
      if (r.has(a))
        continue;
      const c = t.get(a);
      if (!c)
        return "前置素材节点不存在，请重新同步分镜脚本";
      const u = c.title || "未命名素材";
      if (!n(c))
        return c.storyboardItem?.stale ? `请先重新生成前置素材“${u}”` : `请先生成前置素材“${u}”`;
    }
  }
  return "";
}
function Qc({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const o = e.filter(Ho), s = o.filter(
    (l) => l.storyboardItem?.stale
  ).length, i = o.map((l) => t[l.id]).filter((l) => !!l), c = n?.status === "running" || n?.status === "waiting" ? o.filter((l) => {
    const m = t[l.id];
    return m?.status === "success" || !m && r(l);
  }).length : o.filter((l) => {
    const m = t[l.id];
    return m?.status === "success" ? !0 : m ? !1 : r(l);
  }).length, u = i.filter(
    (l) => l.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: o.length,
    completedCount: c,
    failedCount: u,
    staleCount: s,
    status: am(n, i, u)
  };
}
async function sm(e, t) {
  const n = new Map(
    e.filter(Ho).map((s) => [s.id, s])
  ), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
  for (; n.size > 0 && (im(n, o), n.size !== 0); ) {
    const s = [...n.values()].filter(
      (a) => ed(a).every(
        (c) => !n.has(c) || r.has(c)
      )
    );
    if (s.length === 0) {
      for (const a of n.values())
        o.set(a.id, new Error("节点依赖关系存在循环"));
      n.clear();
      break;
    }
    (await Promise.allSettled(
      s.map(async (a) => (await t(a), a.id))
    )).forEach((a, c) => {
      const u = s[c];
      if (n.delete(u.id), a.status === "fulfilled") {
        r.add(u.id);
        return;
      }
      o.set(u.id, a.reason);
    });
  }
  if (o.size > 0) {
    const s = o.values().next().value, i = s instanceof Error ? s.message : "节点更新失败";
    throw new Error(`${o.size} 个节点更新失败：${i}`);
  }
}
function im(e, t) {
  let n = !0;
  for (; n; ) {
    n = !1;
    for (const r of e.values())
      ed(r).find(
        (s) => t.has(s)
      ) && (e.delete(r.id), t.set(r.id, new Error("上游节点更新失败")), n = !0);
  }
}
function ed(e) {
  return e.storyboardItem?.dependencyNodeIds || [];
}
function am(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function cm(e, t) {
  const [n, r] = K(e);
  return Ou(() => {
    t || r(e);
  }, [e, t]), { flowNodes: n, setFlowNodes: r };
}
function dm({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: r = !0,
  canEditStructure: o = !1,
  canResetStoryboardPrompt: s = !1,
  onClose: i,
  onCopy: a,
  onDelete: c,
  onDetail: u,
  onEditStructure: l,
  onResetStoryboardPrompt: m
}) {
  return /* @__PURE__ */ M(mn, { children: [
    /* @__PURE__ */ d("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ M(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (I) => I.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ M("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ d(ci, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "详情" })
          ] }) : null,
          o && l ? /* @__PURE__ */ M("button", { type: "button", onClick: l, children: [
            /* @__PURE__ */ d(nc, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "编辑分镜" })
          ] }) : null,
          s && m ? /* @__PURE__ */ M("button", { type: "button", onClick: m, children: [
            /* @__PURE__ */ d(Xu, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ M("button", { type: "button", onClick: a, children: [
            /* @__PURE__ */ d(Zu, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ M("button", { type: "button", className: "is-danger", onClick: c, children: [
            /* @__PURE__ */ d(Ju, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function um({
  showMiniMap: e,
  snapToGrid: t,
  zoom: n,
  onToggleMiniMap: r,
  onToggleSnap: o,
  onReset: s,
  onZoomIn: i,
  onZoomOut: a,
  onZoomChange: c
}) {
  return /* @__PURE__ */ M("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ d(Me, { label: e ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: e ? "is-active" : "",
        onClick: r,
        "aria-label": e ? "隐藏小地图" : "显示小地图",
        children: /* @__PURE__ */ d(Wu, { size: 16 })
      }
    ) }),
    /* @__PURE__ */ d(Me, { label: t ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: t ? "is-active" : "",
        onClick: o,
        "aria-label": t ? "关闭网格吸附" : "开启网格吸附",
        children: /* @__PURE__ */ d(Qa, { size: 16 })
      }
    ) }),
    /* @__PURE__ */ d(Me, { label: "重置视图", children: /* @__PURE__ */ d("button", { type: "button", onClick: s, "aria-label": "重置视图", children: /* @__PURE__ */ d(Yu, { size: 15 }) }) }),
    /* @__PURE__ */ M("div", { className: "ws-view-zoom", children: [
      /* @__PURE__ */ d(Me, { label: "缩小", children: /* @__PURE__ */ d("button", { type: "button", onClick: a, "aria-label": "缩小", children: /* @__PURE__ */ d(ec, { size: 15 }) }) }),
      /* @__PURE__ */ d(
        "input",
        {
          type: "range",
          min: "0.35",
          max: "1.45",
          step: "0.01",
          value: Math.max(0.35, Math.min(1.45, n)),
          onChange: (u) => c(Number(u.target.value)),
          "aria-label": "画布缩放"
        }
      ),
      /* @__PURE__ */ d(Me, { label: "放大", children: /* @__PURE__ */ d("button", { type: "button", onClick: i, "aria-label": "放大", children: /* @__PURE__ */ d(tc, { size: 15 }) }) })
    ] })
  ] });
}
const td = [
  {
    position: "top-left",
    className: "is-top-left",
    horizontalDirection: -1,
    verticalDirection: -1,
    top: !0,
    left: !0
  },
  {
    position: "top-right",
    className: "is-top-right",
    horizontalDirection: 1,
    verticalDirection: -1,
    top: !0,
    left: !1
  },
  {
    position: "bottom-left",
    className: "is-bottom-left",
    horizontalDirection: -1,
    verticalDirection: 1,
    top: !1,
    left: !0
  },
  {
    position: "bottom-right",
    className: "is-bottom-right",
    horizontalDirection: 1,
    verticalDirection: 1,
    top: !1,
    left: !1
  }
], To = 140, Ci = 100, Fr = 720, sa = { width: 280, height: 64 };
function lm(e, t, n) {
  const r = rd(n), o = e.find((s) => s.id === t);
  return !o || ym(o, r) ? e : e.map(
    (s) => s.id === t ? { ...s, ...r } : s
  );
}
function fm(e, t, n) {
  const r = Br(n), o = e.find((s) => s.id === t);
  return !o || hm(o.resultView, r) ? e : e.map(
    (s) => s.id === t ? { ...s, resultView: r } : s
  );
}
function pm({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: o
}) {
  if (!t || !n || !o)
    return null;
  const s = e.type === "group", i = e.type === "power" && pi(e.power, e.kind);
  return /* @__PURE__ */ d(mn, { children: td.map((a) => /* @__PURE__ */ d(
    ju,
    {
      position: a.position,
      className: `ws-resize-control ws-node-resize-control ${a.className} nodrag nopan`,
      minWidth: s ? Qi.width : i ? sa.width : To,
      minHeight: s ? Qi.height : i ? sa.height : Ci,
      maxWidth: s ? ea.width : Fr,
      maxHeight: s ? ea.height : Fr,
      keepAspectRatio: !s && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (c, u) => o(e.id, rd(u))
    },
    a.position
  )) });
}
function mm({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: o
}) {
  const s = H(null);
  if (!t)
    return null;
  const i = (u, l) => {
    if (u.button !== 0)
      return;
    u.preventDefault(), u.stopPropagation();
    const m = Br(e), I = u.currentTarget.parentElement?.getBoundingClientRect().width || m.width;
    s.current = {
      pointerId: u.pointerId,
      startX: u.clientX,
      startY: u.clientY,
      startView: m,
      currentView: m,
      corner: l,
      scale: Math.max(0.01, I / m.width)
    }, u.currentTarget.setPointerCapture(u.pointerId), n?.();
  }, a = (u) => {
    const l = s.current;
    if (!l || l.pointerId !== u.pointerId)
      return;
    u.preventDefault(), u.stopPropagation();
    const m = gm(
      l.startView,
      l.corner,
      (u.clientX - l.startX) / l.scale,
      (u.clientY - l.startY) / l.scale
    );
    l.currentView = m, r(m);
  }, c = (u) => {
    const l = s.current;
    !l || l.pointerId !== u.pointerId || (u.preventDefault(), u.stopPropagation(), s.current = null, u.currentTarget.hasPointerCapture(u.pointerId) && u.currentTarget.releasePointerCapture(u.pointerId), o(Br(l.currentView)));
  };
  return /* @__PURE__ */ d(mn, { children: td.map((u) => /* @__PURE__ */ d(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${u.className} nodrag nopan nowheel`,
      onPointerDown: (l) => i(l, u),
      onPointerMove: a,
      onPointerUp: c,
      onPointerCancel: c,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
      }
    },
    u.position
  )) });
}
function gm(e, t, n, r) {
  const o = e.width / e.height, s = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * o, a = nd(
    Math.abs(s - e.width) >= Math.abs(i - e.width) ? s : i,
    o
  ), c = a / o, u = Number(e.offsetX || 0), l = Number(e.offsetY || 0);
  return Br({
    width: a,
    height: c,
    offsetX: t.left ? u + e.width - a : u,
    offsetY: t.top ? l + (e.height - c) / 2 : l + (c - e.height) / 2
  });
}
function nd(e, t) {
  const n = Math.max(To, Ci * t), r = Math.min(Fr, Fr * t);
  return n > r ? Math.min(Fr, Math.max(To, e)) : Math.min(r, Math.max(n, e));
}
function Br(e) {
  const t = ia(e.width, To), n = ia(e.height, Ci), r = t / n, o = nd(t, r);
  return {
    width: Math.round(o),
    height: Math.round(o / r),
    offsetX: Math.round(aa(e.offsetX, 0)),
    offsetY: Math.round(aa(e.offsetY, 0))
  };
}
function ia(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function aa(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function rd(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function ym(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function hm(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
function wm(e, t) {
  const n = e || od(), r = Zl({
    type: "stream",
    output: t
  }), o = r.event, s = r.activity, i = Im(n.text, r.delta, t, o), a = Sm(o, s) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, c = s && !s.anchorText ? { ...s, anchorText: i } : s, u = c ? Jl(n.activities, c) : n.activities, l = Ql(
    ef(n.document, r.output),
    hc(r.output.document)
  ), m = yc(a) || n.interaction, I = gc(a);
  return {
    started: !0,
    text: i,
    output: a,
    activities: u,
    document: l,
    interaction: m,
    suggestions: I.length > 0 ? I : n.suggestions,
    error: r.error || n.error
  };
}
function _m(e) {
  const t = bm(e);
  return {
    started: Object.keys(t).length > 0,
    text: Mo(t.text),
    output: t,
    activities: Yl(t),
    document: hc(t.document),
    interaction: yc(t),
    suggestions: gc(t),
    error: Mo(t.error)
  };
}
function bm(e) {
  const t = Xl(e);
  if (Mo(t.text))
    return t;
  const n = cc(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function Nm(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function od() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function Im(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && Mo(n.text) || e;
}
function Sm(e, t) {
  return !(t || e === "start" || e === "delta");
}
function Mo(e) {
  return e == null ? "" : String(e);
}
function Cm(e) {
  const t = ge(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (i) => i.id === Number(t.id || 0)
  ), o = r ? ln(r, e.previousAsset) : e.previousAsset || null, s = ln(
    t,
    o
  );
  return o?.version?.content != null && Number(o.version.id || 0) === Number(s.version?.id || 0) ? ln(o, s) : s.version?.id ? s : null;
}
function vm(e, t) {
  const n = km(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function xm(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function ln(e, t) {
  const n = da(e), r = t ? da(t) : null, o = [
    ...n.versions || [],
    ...r?.versions || []
  ], s = Rm(
    [Tm(n.version)].filter(
      (i) => !!i
    ),
    o
  );
  return {
    ...r,
    ...n,
    version: n.version || r?.version,
    versions: s.length ? s : void 0
  };
}
function ca(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((o) => [o.id, o])), r = e.map((o) => {
    const s = n.get(o.id);
    return s ? (n.delete(o.id), ln(s, o)) : o;
  });
  return [
    ...[...n.values()].map(
      (o) => ln(o)
    ),
    ...r
  ];
}
function km(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function da(e) {
  const t = ua(e.version), n = (e.versions || []).map(ua).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function ua(e) {
  if (!e)
    return;
  const t = Il(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function Rm(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (!s || Number(s.id || 0) <= 0)
      continue;
    const i = String(s.id), a = r.get(i);
    if (a !== void 0) {
      n[a] = Am(
        n[a],
        s
      );
      continue;
    }
    r.set(i, n.length), n.push(s);
  }
  let o = !1;
  return n.sort(
    (s, i) => Number(Ns(i)) - Number(Ns(s)) || Number(i.version || i.id || 0) - Number(s.version || s.id || 0)
  ).map((s) => Ns(s) ? o ? Mm(s) : (o = !0, s) : s);
}
function Am(e, t) {
  const n = { ...e };
  for (const [r, o] of Object.entries(t))
    o !== void 0 && o !== "" && (n[r] = o);
  return n;
}
function Ns(e) {
  return !!(e.is_current || e.current);
}
function Tm(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Mm(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function vi(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return Mn(r, "execution_id", e?.execution_id), Mn(r, "run_id", e?.run_id || n?.run_id), Is(r, "request_id", e?.request_id), Mn(r, "flow_run_id", e?.flow_run_id), Mn(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), Mn(r, "asset_id", t?.id), Mn(r, "version_id", n?.id || t?.version_id), Mn(
    r,
    "release_id",
    n?.release_id || e?.release_id
  ), Is(r, "role", e?.role || t?.role), Is(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function Dm(e) {
  const t = e?.resultRef;
  if (!e || !t)
    return null;
  const n = Number(t.asset_id || 0), r = String(t.node_run_id ? e.nodeId : "").trim();
  return {
    sourceRunId: Number(t.run_id || 0),
    sourceNodeRunId: Number(t.node_run_id || 0),
    sourceAssetId: n,
    sourceVersionId: Number(t.version_id || 0),
    sourceReleaseId: Number(t.release_id || 0),
    sourceRequestId: String(t.request_id || ""),
    sourceNodeKey: r,
    sourceNodeType: String(e.type || ""),
    sourceStatus: String(t.status || ""),
    sourceKey: r || (n > 0 ? `asset:${n}` : "") || ""
  };
}
function Mn(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Is(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const Em = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], Pm = Object.fromEntries(
  Em.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Fm(e) {
  return Pm[e] || "文本";
}
function Om(e) {
  const t = new Map(e.nodes.map((i) => [i.id, i])), n = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), r = zm(
    e.assets,
    e.assetCateId
  ), o = e.nodes.filter(zc).map((i) => {
    const a = r.get(i.id) || i.asset, c = i.groupId ? n.get(i.groupId) : void 0, u = c?.group?.sourceNodeId ? t.get(c.group.sourceNodeId) : void 0, l = e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || Fm(la(i)),
      sourcePath: u?.title && c?.title ? `${u.title} / ${c.title}` : c?.title,
      nodeType: la(i),
      status: jm(
        i,
        a,
        e.nodeHasResult(i)
      ),
      preview: e.nodePreview(i),
      output: l,
      node: i,
      nodeId: i.id,
      nodeNo: i.nodeNo,
      groupId: i.groupId,
      groupTitle: c?.title,
      asset: a,
      assetId: a?.id,
      versionId: a?.version?.id || a?.version_id
    };
  }).filter((i) => !!(i.assetId && i.versionId));
  return [...e.assets.filter(
    (i) => Number(i.asset_cate_id || 0) === e.assetCateId && String(i.role || "material") === "work" && String(i.status || "") !== "archived"
  ).map(
    (i) => ({
      key: `asset:${i.id}`,
      role: "work",
      title: i.name || `作品 ${i.id}`,
      nodeType: sd(i.kind),
      status: i.version?.id || i.version_id ? "ready" : "empty",
      preview: e.assetPreview(i),
      output: i.version?.content,
      asset: i,
      assetId: i.id,
      versionId: i.version?.id || i.version_id
    })
  ), ...o].filter(
    (i) => !!(i.assetId && i.versionId)
  );
}
function la(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : sd(e.power?.kind || e.kind);
}
function sd(e) {
  switch (String(e || "text").toLowerCase()) {
    case "rich":
    case "richtext":
      return "richtext";
    case "image":
      return "image";
    case "audio":
      return "audio";
    case "video":
      return "video";
    default:
      return "text";
  }
}
function zm(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (Number(r.asset_cate_id || 0) !== t || String(r.role || "") !== "material" || String(r.status || "") === "archived")
      continue;
    const o = String(
      r.node_key || r.version?.node_key || ""
    ).trim();
    o && !n.has(o) && n.set(o, r);
  }
  return n;
}
function jm(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function cb(e, t = []) {
  return {
    current: $m([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: id(
          n.preview,
          String(n.kind || n.type || "")
        ),
        source: "current",
        output: n.output,
        preview: n.preview
      }))
    ])
  };
}
function Bm(e) {
  return e.map(
    (t) => ({
      id: t.role === "material" ? t.nodeId || t.key : String(t.assetId || t.key),
      title: t.title,
      kind: id(t.preview, t.nodeType),
      role: t.role,
      source: t.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: t.assetId,
      versionID: t.versionId,
      output: t.output,
      preview: t.preview,
      asset: t.asset
    })
  );
}
function $m(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = `${r.source}:${r.id}`;
    n.has(o) || (n.add(o), t.push(r));
  }
  return t;
}
function id(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Us = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Us || Object.keys(Us).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Um = Us.joinSiteApi;
async function ad(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return Bu({
    streamApi: Vm(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function Vm(e) {
  const t = new URL(Um("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const cd = "反馈已被新的运行替换";
function Lm(e) {
  return e instanceof Error && e.message === cd;
}
function Bn(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function Km(e, t) {
  const n = Number(t.approval?.id || 0);
  return {
    id: `${e.id}:${n || Date.now()}:${Math.random().toString(36).slice(2, 7)}`,
    nodeId: e.id,
    title: t.title || e.title || "补充信息",
    description: t.description || "",
    prompt: t,
    status: "pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function qm(e, t, n) {
  return e.map(
    (r) => r.id === t ? {
      ...r,
      values: n,
      prompt: {
        ...r.prompt,
        values: n
      },
      status: "submitted",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    } : r
  );
}
function Gm(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((s) => s.id === e.node.id) || e.node, o = Bn(r).find(
    (s) => s.id === e.recordId
  );
  return o ? !(o.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function Hm(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: pr(t?.status || e?.status || "running"),
    output: ge(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(Zm).filter(Boolean),
    interactions: r.map(Ym).filter(Boolean),
    raw: e
  };
}
function Wm(e) {
  const t = e.interactions.find(
    (s) => !!(s.interaction?.id && s.interaction?.type)
  );
  if (t)
    return dd(t);
  const n = e.approvals.find(Jm);
  if (!n?.id)
    return null;
  const r = Qm(n), o = xi(r);
  return {
    approval: n,
    title: ve(r.title, n.title, "补充信息"),
    description: ve(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: o,
    values: ki(r, o)
  };
}
function dd(e) {
  const t = e.interaction, n = xi(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: ve(t.title, "补充信息"),
    description: ve(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: ki(t, n)
  };
}
function Ym(e) {
  const t = $u(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function xi(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => eg(n, r)).filter((n) => !!n.key);
}
function ki(e, t) {
  const n = tf(t), r = e.values && typeof e.values == "object" ? e.values : {}, o = {
    ...n,
    ...r
  }, s = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return s > 0 && (o.source_target_id = s), o;
}
function Xm(e, t) {
  const n = tg(e);
  if (!n)
    return null;
  const r = xi(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: ve(n.title, t, "补充信息"),
    description: ve(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: r,
    values: ki(n, r)
  };
}
function Zm(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function Jm(e) {
  return e.status === "pending" || e.decision === "pending";
}
function Qm(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function eg(e, t) {
  const n = Array.isArray(e?.options) ? e.options : [];
  return {
    id: Number(e?.id || t + 1),
    power_param_id: Number(e?.power_param_id || e?.powerParamId || 0),
    name: String(e?.name || e?.label || e?.title || e?.key || ""),
    key: String(e?.key || e?.name || `field_${t + 1}`),
    icon: String(e?.icon || ""),
    type: String(e?.type || "input"),
    preview_type: String(e?.preview_type || e?.previewType || "none"),
    usage: Number(e?.usage || 1),
    value_type: e?.value_type || e?.valueType || "string",
    default_value: String(e?.default_value ?? e?.defaultValue ?? ""),
    active_when_key: String(
      e?.active_when_key ?? e?.activeWhenKey ?? ""
    ),
    active_when_value: String(
      e?.active_when_value ?? e?.activeWhenValue ?? ""
    ),
    upload_rule_id: Number(
      e?.upload_rule_id || e?.uploadRuleId || 0
    ),
    max_files: Number(e?.max_files ?? e?.maxFiles ?? 0),
    accepted_kinds: fa(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: fa(
      e?.asset_kinds ?? e?.assetKinds
    ),
    required: !!e?.required,
    sort: Number(e?.sort || t + 1),
    options: n.map((r, o) => ({
      id: Number(r?.id || o + 1),
      name: String(r?.name || r?.label || r?.value || ""),
      value: String(
        r?.value || r?.id || r?.label || r?.name || ""
      ),
      native_value: String(r?.native_value || r?.nativeValue || ""),
      preview_url: String(r?.preview_url || r?.previewUrl || ""),
      sort: Number(r?.sort || o + 1)
    }))
  };
}
function fa(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function tg(e) {
  const t = Ss(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = Ss(e?.interaction);
    return r && ve(r.type) ? r : null;
  }
  const n = Ss(t.interaction, t.content?.interaction);
  return n && ve(n.type) ? n : null;
}
function Ss(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
async function ng(e) {
  return (await Sl({
    teamID: e.teamID,
    projectID: e.projectID,
    files: e.files,
    ruleID: e.ruleID
  })).map(
    ({ sourceFile: n, uploadedFile: r, asset: o }) => og(r, n, o)
  );
}
function rg(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : "file";
}
function og(e, t, n) {
  const r = String(
    e?.url || e?.open_url || e?.download || ""
  ), o = String(e?.kind || rg(t));
  return {
    name: String(e?.name || t.name),
    alias: String(e?.name || t.name),
    kind: o,
    source: "upload",
    type: String(e?.mime || t.type || o),
    url: r,
    text: String(e?.name || t.name),
    output: e,
    asset: n
  };
}
function sg({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: r,
  targetY: o,
  sourcePosition: s,
  targetPosition: i,
  markerEnd: a,
  style: c,
  data: u
}) {
  const [l, m, I] = Uu({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: r,
    targetY: o,
    targetPosition: i
  }), N = u || {}, w = !!N.isSelected, E = !!(N.isHighlighted || w), F = N.highlightColor || "#0ea5e9";
  return /* @__PURE__ */ M(mn, { children: [
    E ? /* @__PURE__ */ d(
      Wi,
      {
        path: l,
        style: {
          stroke: F,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ d(
      Wi,
      {
        path: l,
        markerEnd: a,
        style: {
          ...c,
          stroke: w ? "var(--ws-edge-selected)" : E ? F : "var(--ws-edge)",
          strokeWidth: w ? 2.8 : E ? 2.4 : 1.45,
          opacity: E ? 0.96 : 0.62,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    w ? /* @__PURE__ */ d(Vu, { children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: "ws-edge-delete nodrag nopan",
        style: {
          transform: `translate(-50%, -50%) translate(${m}px, ${I}px)`
        },
        "aria-label": "删除连线",
        onMouseDown: (Y) => {
          Y.preventDefault(), Y.stopPropagation();
        },
        onClick: (Y) => {
          Y.preventDefault(), Y.stopPropagation(), N.onDelete?.(String(e));
        },
        children: /* @__PURE__ */ d(Qu, { size: 15 })
      }
    ) }) : null,
    E ? /* @__PURE__ */ M(mn, { children: [
      /* @__PURE__ */ d("circle", { r: "3", fill: F, children: /* @__PURE__ */ d("animateMotion", { dur: "2.8s", repeatCount: "indefinite", path: l }) }),
      /* @__PURE__ */ d("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ d("animateMotion", { dur: "2.8s", repeatCount: "indefinite", path: l }) })
    ] }) : null
  ] });
}
const ig = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function ag({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ d(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: ig,
      children: /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ d(Gt, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(Vo, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ d("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Cs({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [o, s] = K(!1), [i, a] = K(e), c = H(null);
  ce(() => {
    o || a(e);
  }, [o, e]), ce(() => {
    o && (c.current?.focus(), c.current?.select());
  }, [o]);
  const u = () => {
    const l = i.trim() || n;
    s(!1), a(l), l !== e && r?.(l);
  };
  return o && r ? /* @__PURE__ */ d(
    "input",
    {
      ref: c,
      className: `ws-canvas-node-title-input nodrag nowheel ${t || ""}`.trim(),
      value: i,
      maxLength: 64,
      "aria-label": "节点名称",
      onChange: (l) => a(l.target.value),
      onBlur: u,
      onPointerDown: (l) => l.stopPropagation(),
      onKeyDown: (l) => {
        l.stopPropagation(), l.key === "Enter" ? (l.preventDefault(), u()) : l.key === "Escape" && (l.preventDefault(), a(e), s(!1));
      }
    }
  ) : /* @__PURE__ */ d(Me, { label: r ? "双击重命名" : e, children: /* @__PURE__ */ d(
    "span",
    {
      className: t,
      onDoubleClick: r ? (l) => {
        l.preventDefault(), l.stopPropagation(), s(!0);
      } : void 0,
      children: e || n
    }
  ) });
}
const pa = 160, ma = 72, ga = 72, Do = 72, $r = 24, Ur = 24, Vr = 40, $n = 2, Eo = { width: 180, height: 180 }, cg = "storyboard-derived-layout-v7";
function dg(e) {
  const t = e.groups.map((w) => ({
    ...w,
    size: pg(w)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(go), o = mg(
    "workspace",
    r
  ), s = t.filter((w) => w.direction === "upstream").sort(go), i = t.filter(
    (w) => w.direction === "downstream" && w.powerKind !== "audio"
  ).sort(go), a = t.filter(
    (w) => w.direction === "downstream" && w.powerKind === "audio"
  ).sort(go), c = i.reduce(
    (w, E) => Math.max(w, E.size.height),
    0
  ), u = i.length ? e.sourceNode.y - c - ga : e.sourceNode.y, l = e.sourceNode.x - pa;
  let m = u;
  for (const w of s)
    n.set(w.key, {
      bounds: {
        x: l - w.size.width,
        y: m,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${o}:${w.key}`
    }), m += w.size.height + ga;
  let I = e.sourceNode.x;
  for (const w of i)
    n.set(w.key, {
      bounds: {
        x: I,
        y: u,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${o}:${w.key}`
    }), I += w.size.width + ma;
  let N = e.sourceNode.x + e.sourceNode.width + pa;
  for (const w of a)
    n.set(w.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${o}:${w.key}`
    }), N += w.size.width + ma;
  return n;
}
function ug(e, t, n) {
  const r = t.filter((a) => a.groupId === e.id), o = n.kind === "audio", s = o ? n.width : Math.max(Eo.width, n.width), i = o ? n.height : Math.max(Eo.height, n.height);
  for (let a = 0; a < r.length + 100; a += 1) {
    const c = a % $n, u = Math.floor(a / $n), l = {
      x: e.x + $r + c * (s + Ur),
      y: e.y + Do + u * (i + Vr)
    };
    if (r.every(
      (m) => !gg(
        { ...l, width: n.width, height: n.height },
        m
      )
    ))
      return l;
  }
  return {
    x: e.x + $r,
    y: e.y + Do
  };
}
function lg(e, t) {
  const n = t.some((s) => s.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : Eo.width,
      ...t.map((s) => s.width)
    ),
    height: Math.max(
      n ? 0 : Eo.height,
      ...t.map((s) => s.height)
    )
  }, o = /* @__PURE__ */ new Map();
  return t.forEach((s, i) => {
    const a = i % $n, c = Math.floor(i / $n);
    o.set(s.id, {
      x: e.x + $r + a * (r.width + Ur),
      y: e.y + Do + c * (r.height + Vr)
    });
  }), {
    ...ud(t.length, r),
    positions: o
  };
}
function fg(e) {
  return Go(e || void 0);
}
function pg(e) {
  const t = fg(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return ud(e.itemCount, t);
}
function ud(e, t) {
  const n = Math.max(1, Math.ceil(e / $n));
  return {
    width: $r * 2 + t.width * $n + Ur * ($n - 1),
    height: Do + $r + n * t.height + (n - 1) * Vr
  };
}
function mg(e, t) {
  return [
    cg,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function go(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function gg(e, t) {
  return !(e.x + e.width + Ur <= t.x || t.x + t.width + Ur <= e.x || e.y + e.height + Vr <= t.y || t.y + t.height + Vr <= e.y);
}
const yg = [
  "characters",
  "scenes",
  "props"
], ya = {
  character: "生成一张纯角色设定图，在同一张图内依次展示当前角色的正面全身、侧面全身、背面全身，以及面部和服装关键细节；各视角互不遮挡，必须保持同一人物的五官、发型、服装、体型和比例一致，采用清晰规范的角色设定图排版，不得拆分生成多张独立图片，不得出现其他人物、文字、水印或界面元素",
  scene: "生成一张纯场景参考图，采用能够完整说明空间关系的广角主视图，清晰展示固定空间的环境、结构、光线和关键区域；只生成一个完整画面，不得使用拼图、宫格或分栏排版，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop: "生成一张纯道具参考图，采用四分之三主视角，清晰展示当前道具的造型、比例、材质和关键细节；只生成一个完整画面，不得使用拼图、宫格、分栏或多视角排版，不得出现人物、手持者、文字、水印或界面元素"
}, Vs = [
  vs("characters", "角色组", "character", 0),
  vs("scenes", "场景组", "scene", 1),
  vs("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: yg,
    layoutIndex: 0,
    enabled: dc,
    items: (e) => e.shots.flatMap((t, n) => {
      if (t.continue_previous)
        return [];
      const r = Cg(e, t, n);
      return [
        {
          type: "shot_image",
          id: t.id,
          title: `镜头 ${t.order || n + 1} 参考图`,
          prompt: kg(
            e,
            t,
            r.previousShot,
            r.externalReferences
          ),
          dependencyItems: r.dependencyItems,
          referenceItems: r.referenceItems,
          externalReferences: r.externalReferences,
          paramValues: Og(e),
          shotId: t.id
        }
      ];
    })
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
    enabled: Cl,
    items: (e) => e.shots.map((t, n) => {
      const r = xg(e, t, n);
      return {
        type: "shot",
        id: t.id,
        title: `镜头 ${t.order || n + 1}`,
        prompt: Rg(
          e,
          t,
          r.externalReferences
        ),
        ...r,
        paramValues: zg(e, t),
        shotId: t.id,
        shotDuration: t.duration,
        continuityAnchor: t.continuity_anchor
      };
    })
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: vl,
    items: hg
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
    enabled: xl,
    items: _g
  },
  {
    key: "lip_sync",
    title: "口型同步组",
    itemType: "lip_sync",
    powerKind: "video",
    outputType: "lip_sync",
    direction: "downstream",
    sourceGroupKeys: ["shots", "speech"],
    layoutIndex: 4,
    enabled: kl,
    items: bg
  }
];
function vs(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o) => dc(o) && o.materials.some((s) => s.type === n),
    items: (o) => o.materials.filter((s) => s.type === n).map((s) => {
      const i = Mg(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: Ig(
          o,
          s,
          i
        ),
        externalReferences: i
      };
    })
  };
}
function hg(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, o) => {
      const s = wg(e, r);
      return {
        type: "speech",
        id: r.id,
        title: Ng(
          e,
          r,
          t.order || n + 1,
          o
        ),
        prompt: r.text.trim(),
        ...s ? { paramValues: { voice: s } } : {},
        shotId: t.id,
        speechId: r.id,
        characterId: r.character_id,
        speechKind: r.kind,
        speakerMode: r.speaker_mode,
        startTime: r.start_time,
        shotDuration: t.duration
      };
    })
  );
}
function wg(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function _g(e) {
  return e.shots.flatMap((t, n) => {
    const r = Rl(t);
    return r.length ? [
      {
        type: "subtitle",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 字幕`,
        prompt: r.map((o) => o.text).join(" / "),
        localOutput: {
          type: "storyboard_subtitles",
          shot_id: t.id,
          tracks: r
        },
        shotId: t.id,
        shotDuration: t.duration
      }
    ] : [];
  });
}
function bg(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(Al);
    if (!r.length)
      return [];
    const o = r.map((a) => a.id), s = r[0]?.character_id, i = t.speech.filter((a) => a.text.trim()).map((a) => a.id);
    return [
      {
        type: "lip_sync",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 口型`,
        prompt: `同步镜头 ${t.order || n + 1} 的角色口型`,
        dependencyItems: [
          { type: "shot", id: t.id },
          ...i.map((a) => ({ type: "speech", id: a }))
        ],
        referenceItems: [
          { type: "shot", id: t.id },
          ...i.map((a) => ({ type: "speech", id: a }))
        ],
        shotId: t.id,
        speechIds: o,
        characterId: s,
        shotDuration: t.duration,
        optional: !0
      }
    ];
  });
}
function Ng(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = e.materials.find(
    (s) => s.type === "character" && s.id === t.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function Ig(e, t, n) {
  const r = ld(n), o = t.prompt.trim();
  if (o)
    return vo(
      e,
      `${r}${o}。${ya[t.type]}`,
      t.type
    );
  const s = e.shots.filter((a) => a.material_ids.includes(t.id)).map((a) => a.description.trim()).filter(Boolean), i = s.length ? `相关镜头：${s.join("；")}` : "保持整部作品的统一视觉风格";
  return vo(
    e,
    `${r}${lc[t.type]}“${t.name}”的素材生成图。${i}。${ya[t.type]}`,
    t.type
  );
}
function Sg(e, t) {
  return uc(e, t).map((n) => ({
    type: n.type,
    id: n.id
  }));
}
function Cg(e, t, n) {
  const r = Sg(e, t), o = Dg(e, t), s = t.match_previous ? vg(e, n) : void 0;
  if (!s)
    return {
      previousShot: void 0,
      dependencyItems: [],
      referenceItems: r,
      externalReferences: o
    };
  const i = {
    type: "shot_image",
    id: s.id
  };
  return {
    previousShot: s,
    dependencyItems: [i],
    referenceItems: [i, ...r],
    externalReferences: o
  };
}
function vg(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function xg(e, t, n) {
  const r = Eg(e, t), o = n > 0 ? e.shots[n - 1] : void 0;
  if (t.continue_previous && o) {
    const s = { type: "shot", id: o.id };
    return {
      dependencyItems: [s],
      referenceItems: [s],
      externalReferences: r
    };
  }
  return {
    dependencyItems: [],
    referenceItems: [{ type: "shot_image", id: t.id }],
    externalReferences: r
  };
}
function kg(e, t, n, r = []) {
  const o = uc(e, t), s = o.some(
    (c) => c.type === "character"
  ), i = [
    ...r.map(
      (c, u) => `参考图${u + 1}是${fd(c)}`
    ),
    n ? `参考图${r.length + 1}是前序镜头 ${n.order} 的参考画面` : "",
    ...o.map(
      (c, u) => `参考图${r.length + u + (n ? 2 : 1)}是${lc[c.type]}“${c.name}”`
    )
  ].filter(Boolean).join("，"), a = [
    `镜头 ${t.order} 的单张参考画面`,
    i ? `图片顺序说明：${i}` : "",
    i ? "必须严格按照上述图片顺序识别素材，不得交换、合并或忽略参考对象" : "",
    n ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留" : "",
    Ag(e, t),
    `入镜关键帧状态：${t.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    s ? "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致" : "当前镜头没有角色素材，不得生成清晰可识别的人物、歌手、演员、乐手、路人或人脸；故事目标、叙事阶段和外部参考中出现的人物也不得擅自带入画面。保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    s ? "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例" : "道具必须保持参考图中的原始尺寸比例",
    t.description.trim(),
    t.camera_instruction.trim() ? `镜头语言：${t.camera_instruction.trim()}` : "",
    md(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return vo(e, pd(a));
}
function Rg(e, t, n = []) {
  const o = [
    t.video_prompt.trim() || Tl(t),
    ld(n),
    t.continue_previous ? `使用上一镜头真实尾帧继续生成。连续性锚点：${t.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容` : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    md(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return vo(e, pd(o));
}
function Ag(e, t) {
  const n = e.shots.findIndex((i) => i.id === t.id), o = (n <= 0 ? e.storyline.setup : n >= e.shots.length - 1 ? e.storyline.payoff : e.storyline.development).trim(), s = e.shots[n + 1]?.transition.trim();
  return [
    `故事目标：${e.summary.trim()}`,
    o ? `当前叙事阶段：${o}` : "",
    `本镜变化：${t.beat.trim()}`,
    t.transition.trim() ? `从上一镜进入本镜：${t.transition.trim()}` : "",
    Tg(t, n),
    s ? `本镜结束需为下一镜建立：${s}` : ""
  ].filter(Boolean).join("；");
}
function Tg(e, t) {
  if (t <= 0)
    return "";
  const n = El[e.transition_type];
  return e.transition_type === "none" ? `进入本镜的剪辑方式：${n}` : `进入本镜的剪辑方式：${n}，时长 ${e.transition_duration_ms} 毫秒；这是后期剪辑信息，画面本身不要生成转场叠影`;
}
function Mg(e, t) {
  return Ai([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Ri(e, "image")
  ]);
}
function Dg(e, t) {
  return Ai([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Ri(e, "image")
  ]);
}
function Eg(e, t) {
  return Ai([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...Ri(e, "video")
  ]);
}
const Pg = {
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
function Ri(e, t) {
  const n = Pg[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function ld(e) {
  const t = e.map(fd);
  return t.length > 0 ? `参考素材：${t.join("；")}。` : "";
}
const Fg = {
  visual_style: "只参考画风、色彩、光线和材质，不复制其中的人物或剧情",
  motion_style: "只参考运镜、动作和剪辑节奏，不沿用原视频主体、剧情或声音",
  character: "作为指定角色的外观与身份锚点",
  scene: "作为指定场景的空间、陈设与光线锚点",
  prop: "作为指定道具的造型、材质与比例锚点",
  shot: "作为指定镜头的主体、构图与空间关系锚点",
  soundtrack: "作为全片主音轨的音乐气质和节奏依据",
  performance: "只参考动作、舞蹈、演奏或表演方式，不沿用原视频主体身份",
  product: "作为广告商品主体的外观、材质、比例与关键细节锚点",
  brand_style: "只参考品牌色彩、陈列、光线和影调，不复制其中的文字或主体",
  brand_logo: "只作为品牌身份和构图规划参考，不要求模型还原可辨识文字"
};
function fd(e) {
  const t = Fg[e.purpose];
  return t ? `${e.label}（${t}）` : e.label;
}
function Ai(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function pd(e) {
  return e.map((t) => t.trim().replace(/[。！？!?；;，,：:]+$/g, "")).filter(Boolean).join("。");
}
function Og(e) {
  return { aspectRatio: e.aspect_ratio, resolution: "2k" };
}
function zg(e, t) {
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration
  };
}
function md(e) {
  return !Ml(e) || ![...Dl(e)][0] ? "" : "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
const yo = "storyboard-soundtrack";
function jg(e) {
  const t = new Map(
    (e.current?.clips || []).map((r) => [r.id, r])
  ), n = e.storyboard.shots.map(
    (r, o) => $g({
      ...e,
      shot: r,
      index: o,
      current: t.get(r.id)
    })
  );
  return {
    version: 3,
    clips: nf(
      n,
      (e.current?.clips || []).map((r) => r.id),
      (r) => r.id
    ),
    audioTracks: Bg(
      e.storyboard,
      e.current?.audioTracks || []
    ),
    settings: {
      resolution: e.current?.settings.resolution || "auto",
      fps: e.current?.settings.fps ?? 0
    }
  };
}
function Bg(e, t) {
  const n = e.references.find(
    (u) => u.purpose === "soundtrack"
  );
  if (!n)
    return t.filter((u) => u.id !== yo);
  const r = t.find(
    (u) => u.id === yo
  ), o = Number(n.asset_id || 0), s = Number(n.version_id || 0), i = {
    id: yo,
    ...o > 0 && s > 0 ? {
      audio: {
        assetId: o,
        versionId: s,
        label: n.label || "主音轨"
      }
    } : {},
    startTime: r?.startTime ?? 0,
    sourceStart: r?.sourceStart ?? 0,
    kind: "music",
    volume: r?.volume ?? 0.35,
    fit: r?.fit ?? "trim",
    loop: r?.loop ?? !1,
    fadeOut: r?.fadeOut ?? 1
  };
  let a = !1;
  const c = t.flatMap((u) => u.id !== yo ? [u] : a ? [] : (a = !0, [i]));
  return a ? c : [...c, i];
}
function $g(e) {
  const t = Po(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), n = Po(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), r = Ls(t), o = n?.storyboardItem?.stale ? void 0 : Ls(n), s = !!e.current?.useOriginalVideo, i = [];
  t?.power ? r || i.push("镜头视频尚未生成") : i.push("未配置镜头视频能力");
  const a = new Map(
    (e.current?.speechTracks || []).map((w) => [w.id, w])
  ), c = e.shot.speech.filter((w) => w.text.trim()).map(
    (w) => Kg(
      e.nodes,
      e.sourceNodeId,
      w,
      a.get(w.id),
      i
    )
  ), u = Lg(
    e.nodes,
    e.sourceNodeId,
    e.shot.id
  ), l = !s && o ? o : r, m = e.storyboard.shots[e.index + 1], I = m ? {
    type: m.transition_type,
    durationMs: m.transition_type === "none" ? 0 : m.transition_duration_ms
  } : { type: "none", durationMs: 0 }, N = Ug(
    e.current,
    I
  );
  return {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...l ? { visualVideo: l } : {},
    ...r ? { originalAudioSource: r } : {},
    duration: e.shot.duration,
    originalVolume: e.current?.originalVolume ?? (c.length ? 0.45 : 1),
    speechTracks: c,
    subtitleTracks: u,
    useOriginalVideo: s,
    blockingIssues: qg(i),
    transitionToNext: N,
    storyboardTransitionToNext: I
  };
}
function Ug(e, t) {
  if (!e)
    return t;
  const n = e.storyboardTransitionToNext;
  return n && Vg(
    e.transitionToNext,
    n
  ) ? t : e.transitionToNext;
}
function Vg(e, t) {
  return e.type === t.type && e.durationMs === t.durationMs;
}
function Lg(e, t, n) {
  const r = Po(
    e,
    t,
    "subtitle",
    n
  ), o = yt(r?.resultOutput);
  return (Array.isArray(o.tracks) ? o.tracks : []).flatMap((i) => {
    const a = yt(i), c = po(a.id), u = po(a.text);
    if (!c || !u)
      return [];
    const l = ha(a.end_time ?? a.endTime), m = po(a.speech_id ?? a.speechId);
    return [
      {
        id: c,
        text: u,
        startTime: Math.max(
          0,
          ha(a.start_time ?? a.startTime)
        ),
        ...l > 0 ? { endTime: l } : {},
        ...m ? { speechId: m } : {},
        source: po(a.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function Kg(e, t, n, r, o) {
  const s = Po(e, t, "speech", n.id), i = Ls(s);
  return s?.power ? i || o.push(`语音“${n.text}”尚未生成`) : o.push(`语音“${n.text}”未配置语音合成能力`), {
    id: n.id,
    ...i ? { audio: i } : {},
    startTime: n.start_time,
    sourceStart: r?.sourceStart ?? 0,
    fit: r?.fit ?? "trim",
    kind: n.kind,
    ...n.character_id ? { characterId: n.character_id } : {},
    text: n.text,
    volume: r?.volume ?? 1
  };
}
function Po(e, t, n, r) {
  return e.find(
    (o) => o.storyboardItem?.sourceNodeId === t && o.storyboardItem.itemType === n && o.storyboardItem.itemId === r
  );
}
function Ls(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), o = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !o))
    return {
      assetId: r,
      versionId: o,
      label: e?.title || "素材"
    };
}
function qg(e) {
  return [...new Set(e.filter(Boolean))];
}
function ha(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function gd(e) {
  const t = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), n = String(e.composerDraft?.prompt || "").trim();
  return !!(t && n && n !== t);
}
function Gg(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!n || r.trim() === n)
    return null;
  const o = new Set(
    e.storyboardItem?.referenceNodeIds || []
  ), s = t.filter((I) => o.has(I.id)).map(
    (I) => hd(
      I,
      e.storyboardItem?.itemType
    )
  ).filter((I) => !!I), i = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = _c(
    e.composerDraft?.promptContent
  ).filter((I) => i.has(I.refId)), c = t.find(
    (I) => I.id === e.storyboardItem?.sourceNodeId
  ), l = ((c ? Hr([
    c.asset?.version?.content,
    c.resultOutput
  ]) : null)?.references || []).filter((I) => i.has(I.asset_id)).map(wd), m = [
    ...s,
    ...a,
    ...l
  ];
  return {
    ...e.composerDraft || {},
    prompt: n,
    promptContent: m.length ? mi(n, m) : void 0,
    paramValues: Nd(
      e.composerDraft?.paramValues,
      r,
      n
    )
  };
}
function Fo(e, t, n) {
  const r = _a(n);
  return e.find(
    (o) => Number(o.id || 0) > 0 && String(o.kind || "").trim().toLowerCase() === t && _a(o.outputType) === r
  ) || null;
}
function Ks(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    if (n.type !== "power" || !Ko(
      n.power,
      n.kind,
      n.outputType
    ))
      continue;
    const r = Hr([
      n.asset?.version?.content,
      n.resultOutput
    ]);
    if (!r || !Pl(r))
      continue;
    const o = t.nodes.find((u) => u.id === n.id) || n, s = Hg(
      o,
      r
    ), i = String(
      o.storyboardMaterializedSignature || ""
    ), a = Wg(
      t.nodes,
      o.id
    );
    t = (i ? i !== s : !a) ? Jg({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers
    }) : Xg({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers
    }), t = Yg(
      t,
      o.id,
      s
    );
  }
  return t;
}
function Hg(e, t) {
  return ot(
    JSON.stringify([
      e.id,
      Number(e.resultRef?.asset_id || e.asset?.id || 0),
      Number(
        e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
      ),
      t.workflow.confirmed_at,
      t.production_plan,
      t.materials.map((n) => [n.type, n.id]),
      t.shots.map((n) => n.id)
    ])
  );
}
function Wg(e, t) {
  return e.some(
    (n) => n.storyboardItem?.sourceNodeId === t || n.type === "group" && n.group?.origin === "script" && n.group.sourceNodeId === t
  );
}
function Yg(e, t, n) {
  const r = e.nodes.findIndex((s) => s.id === t);
  if (r < 0 || e.nodes[r].storyboardMaterializedSignature === n)
    return e;
  const o = [...e.nodes];
  return o[r] = {
    ...o[r],
    storyboardMaterializedSignature: n
  }, { ...e, nodes: o };
}
function Xg(e) {
  const t = [...e.canvas.nodes];
  let n = !1, r = "";
  const o = Vs.filter(
    (a) => a.enabled(e.storyboard)
  );
  for (const a of o) {
    const c = a.local ? null : Fo(e.powers, a.powerKind, a.outputType);
    for (const u of a.items(e.storyboard)) {
      const l = t.findIndex(
        (w) => Lr(
          w,
          e.storyboardNode.id,
          u.type,
          u.id
        )
      );
      if (l < 0)
        continue;
      const m = yd(
        u,
        t,
        e.storyboardNode.id
      ), I = t[l], N = _d(
        I,
        I.groupId || "",
        m,
        a,
        c,
        { preserveStructure: !0 }
      );
      N !== I && (t[l] = N, n = !0);
    }
  }
  if (fc(e.storyboard)) {
    const a = kd({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Fo(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    n = n || !!a?.changed, r = a?.node.id || "";
  }
  let s = vd(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  s = xd(s, t, e.storyboardNode.id), s = r ? Rd(
    s,
    t,
    e.storyboardNode.id,
    r,
    o
  ) : Ad(s, e.storyboardNode.id);
  const i = s !== e.canvas.edges;
  return n || i ? {
    ...e.canvas,
    nodes: n ? t : e.canvas.nodes,
    edges: s
  } : e.canvas;
}
function Zg(e) {
  return JSON.stringify(
    e.nodes.filter(
      (t) => !!t.storyboardItem || t.type === "power" && Ko(
        t.power,
        t.kind,
        t.outputType
      )
    ).map((t) => [
      t.id,
      Number(t.resultRef?.asset_id || 0),
      Number(t.resultRef?.version_id || 0),
      Number(t.asset?.id || 0),
      Number(t.asset?.version_id || t.asset?.version?.id || 0)
    ])
  );
}
function Jg(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Set(), r = new Set(
    Vs.map((N) => N.itemType)
  ), o = Vs.filter(
    (N) => N.enabled(e.storyboard)
  ), s = fc(
    e.storyboard
  );
  r.add("video_compose"), s && n.add(
    Io(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const i = o.map((N) => ({
    spec: N,
    items: N.items(e.storyboard),
    power: N.local ? null : Fo(e.powers, N.powerKind, N.outputType)
  }));
  for (const { items: N } of i)
    for (const w of N)
      n.add(
        Io(e.storyboardNode.id, w.type, w.id)
      );
  let a = !1;
  for (let N = t.length - 1; N >= 0; N -= 1) {
    const w = t[N].storyboardItem;
    !w || w.sourceNodeId !== e.storyboardNode.id || !r.has(w.itemType) || n.has(
      Io(
        w.sourceNodeId,
        w.itemType,
        w.itemId
      )
    ) || (t.splice(N, 1), a = !0);
  }
  const c = dg({
    sourceNode: e.storyboardNode,
    groups: i.map(({ spec: N, items: w, power: E }) => ({
      key: N.key,
      layoutIndex: N.layoutIndex,
      itemCount: w.length,
      power: E,
      powerKind: N.powerKind,
      direction: N.direction
    }))
  });
  let u = bi(t, e.canvas.nextNodeNo);
  a = a || u !== e.canvas.nextNodeNo;
  for (const { spec: N, items: w, power: E } of i) {
    const F = c.get(N.key);
    if (!F)
      continue;
    const $ = ty({
      nodes: t,
      storyboardNode: e.storyboardNode,
      spec: N,
      layout: F,
      assetCate: e.assetCate
    });
    a = a || $.changed;
    for (const v of w) {
      const C = yd(
        v,
        t,
        e.storyboardNode.id
      ), k = t.findIndex(
        (pe) => Lr(
          pe,
          e.storyboardNode.id,
          C.type,
          C.id
        )
      );
      if (k >= 0) {
        const pe = t[k], ne = _d(
          pe,
          $.node.id,
          C,
          N,
          E
        );
        ne !== pe && (t[k] = ne, a = !0);
        continue;
      }
      const X = ny({
        nodes: t,
        group: $.node,
        storyboardNode: e.storyboardNode,
        item: C,
        assetCate: e.assetCate,
        spec: N,
        power: E
      });
      X.nodeNo = u++, t.push(X), a = !0;
    }
    const V = w.map(
      (v) => t.find(
        (C) => C.groupId === $.node.id && Lr(
          C,
          e.storyboardNode.id,
          v.type,
          v.id
        )
      )
    ).filter((v) => !!v), q = lg(
      $.node,
      V
    );
    for (const v of V) {
      const C = q.positions.get(v.id);
      if (!C || v.x === C.x && v.y === C.y)
        continue;
      const k = t.indexOf(v);
      t[k] = { ...v, ...C }, a = !0;
    }
    const Y = t.findIndex((v) => v.id === $.node.id), oe = t[Y];
    (oe.width !== q.width || oe.height !== q.height) && (t[Y] = {
      ...oe,
      width: q.width,
      height: q.height
    }, a = !0);
  }
  const l = new Set(o.map((N) => N.key));
  for (let N = t.length - 1; N >= 0; N -= 1) {
    const w = t[N];
    w.type !== "group" || w.group?.origin !== "script" || w.group.sourceNodeId !== e.storyboardNode.id || !w.group.syncKey || l.has(
      w.group.syncKey
    ) || (t.splice(N, 1), a = !0);
  }
  const m = s ? kd({
    nodes: t,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Fo(e.powers, "video", "video_compose"),
    nextNodeNo: u
  }) : null;
  m && (u = m.nextNodeNo, a = a || m.changed);
  let I = vd(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  return I = xd(I, t, e.storyboardNode.id), I = m ? Rd(
    I,
    t,
    e.storyboardNode.id,
    m.node.id,
    o
  ) : Ad(I, e.storyboardNode.id), I !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: u, nodes: t, edges: I } : e.canvas;
}
function yd(e, t, n) {
  const r = (w) => (w || []).map(
    (E) => t.find(
      (F) => Lr(F, n, E.type, E.id)
    )
  ).filter((E) => !!E), o = r(e.dependencyItems), s = r(e.referenceItems), i = ay([...o, ...s]), a = e.externalReferences || [], c = {
    ...e,
    dependencyNodeIds: o.map((w) => w.id),
    referenceNodeIds: s.map((w) => w.id),
    sourceSignatureParts: [
      ...e.sourceSignatureParts || [],
      ...i.map(cy),
      ...a.map(ey)
    ]
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return c;
  const u = Qg(
    e.prompt,
    s,
    a
  ), l = u === e.prompt ? c : { ...c, prompt: u }, m = a.map(
    wd
  );
  if (m.push(
    ...s.map((w) => hd(w, e.type)).filter((w) => !!w)
  ), !m.length)
    return l;
  const I = mi(
    u,
    m
  ), N = rf(I);
  return wc(I) ? { ...c, prompt: N, promptContent: I } : { ...l, prompt: N };
}
function Qg(e, t, n = []) {
  const r = [], o = /* @__PURE__ */ new Set();
  for (const s of n) {
    const i = Ji(s.label), a = i ? `@${i}` : "";
    !a || o.has(a) || e.includes(a) || (o.add(a), r.push(a));
  }
  for (const s of t) {
    const i = Ji(s.title), a = i ? `@${i}` : "";
    !a || o.has(a) || e.includes(a) || (o.add(a), r.push(a));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function hd(e, t) {
  const n = Number(e.resultRef?.asset_id || e.asset?.id || 0), r = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  return !n || !r ? null : {
    refType: "asset",
    refId: n,
    versionId: r,
    label: e.title,
    usage: t === "shot" && e.storyboardItem?.itemType === "shot_image" ? "firstFrame" : void 0
  };
}
function wd(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function ey(e) {
  return [
    "asset",
    e.asset_id,
    e.version_id || 0,
    e.kind,
    e.purpose
  ].join(":");
}
function ty(e) {
  const t = Ti(
    e.nodes,
    e.storyboardNode.id,
    e.spec.key
  );
  if (t) {
    const o = t.title !== e.spec.title;
    if (t.group?.layoutKey === e.layout.layoutKey && !o)
      return { node: t, changed: !1 };
    if (t.group?.layoutKey === e.layout.layoutKey) {
      const c = { ...t, title: e.spec.title };
      return e.nodes[e.nodes.indexOf(t)] = c, { node: c, changed: !0 };
    }
    const s = e.layout.bounds.x - t.x, i = e.layout.bounds.y - t.y;
    let a = t;
    for (const [c, u] of e.nodes.entries()) {
      if (u.id !== t.id && u.groupId !== t.id)
        continue;
      const l = {
        ...u,
        x: u.x + s,
        y: u.y + i,
        ...u.id === t.id ? {
          title: e.spec.title,
          width: e.layout.bounds.width,
          height: e.layout.bounds.height,
          group: {
            ...u.group || {},
            layoutKey: e.layout.layoutKey
          }
        } : {}
      };
      e.nodes[c] = l, u.id === t.id && (a = l);
    }
    return { node: a, changed: !0 };
  }
  const n = e.layout.bounds, r = qo("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = Di(
    e.nodes,
    `script-group-${ot(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function Ti(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function ny(e) {
  const t = qo(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = Di(
    e.nodes,
    `script-item-${ot(
      Io(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Go({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${iy(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: e.item.prompt,
    promptContent: e.item.promptContent,
    paramValues: e.item.paramValues
  }, t.storyboardItem = Id(
    e.storyboardNode.id,
    e.item
  );
  const n = ug(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function _d(e, t, n, r, o, s = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const a = i.sourceSignature || Sd({
    ...n,
    prompt: i.generatedPrompt,
    promptContent: e.composerDraft?.promptContent
  }), c = String(e.composerDraft?.prompt || ""), u = !c.trim() || c === i.generatedPrompt, l = u ? n.prompt : c, m = l !== c, I = ry(
    e.composerDraft?.paramValues,
    c,
    l,
    n.paramValues
  ), N = I !== e.composerDraft?.paramValues, w = u ? n.promptContent : oy(
    c,
    e.composerDraft?.promptContent,
    n.promptContent
  ), E = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(w || null), F = Id(i.sourceNodeId, n), $ = bd(e), V = i.resultSourceSignature || ($ ? a : "");
  V && !r.local && (F.resultSourceSignature = V), F.stale = r.local ? !1 : !!($ && V !== F.sourceSignature);
  const q = s.preserveStructure && e.titleMode === "manual" ? e.title : n.title, Y = e.title !== q, oe = s.preserveStructure ? e.groupId || "" : t, v = !e.power && !!o, C = e.kind !== r.powerKind, k = e.outputType !== r.outputType, X = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === oe && !m && !N && !E && !Y && !v && !C && !k && !X && Cd(i, F) ? e : {
    ...e,
    title: q,
    kind: r.powerKind,
    outputType: r.outputType,
    ...v ? {
      power: o || void 0,
      subtitle: o?.output?.name || o?.name || e.subtitle
    } : {},
    description: m || v ? l : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: oe,
    composerDraft: m || N || E ? {
      ...e.composerDraft || {},
      prompt: l,
      promptContent: w,
      paramValues: I
    } : e.composerDraft,
    storyboardItem: F
  };
}
function bd(e) {
  return Number(e.resultRef?.version_id || 0) > 0 || Number(e.asset?.version_id || e.asset?.version?.id || 0) > 0 || e.resultOutput != null;
}
function Nd(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [o, s] of Object.entries(e))
    s === t && (r ||= { ...e }, r[o] = n);
  return r || e;
}
function ry(e, t, n, r) {
  let o = Nd(
    e,
    t,
    n
  );
  for (const [s, i] of Object.entries(r || {}))
    o?.[s] !== i && (o = { ...o || {}, [s]: i });
  return o;
}
function oy(e, t, n) {
  return !n || !wc(n) ? t : mi(
    e,
    _c(n)
  );
}
function Id(e, t) {
  return {
    sourceNodeId: e,
    itemType: t.type,
    itemId: t.id,
    generatedPrompt: t.prompt,
    dependencyNodeIds: t.dependencyNodeIds,
    referenceNodeIds: t.referenceNodeIds,
    externalReferenceAssetIds: (t.externalReferences || []).map(
      (n) => n.asset_id
    ),
    shotId: t.shotId,
    speechId: t.speechId,
    speechIds: t.speechIds,
    characterId: t.characterId,
    speechKind: t.speechKind,
    speakerMode: t.speakerMode,
    startTime: t.startTime,
    shotDuration: t.shotDuration,
    continuityAnchor: t.continuityAnchor,
    optional: t.optional,
    sourceSignature: Sd(t),
    stale: !1
  };
}
function Sd(e) {
  return ot(
    JSON.stringify([
      e.prompt,
      e.promptContent || null,
      e.paramValues || null,
      e.localOutput || null,
      e.sourceSignatureParts || [],
      e.shotId || "",
      e.speechId || "",
      e.speechIds || [],
      e.characterId || "",
      e.speechKind || "",
      e.speakerMode || "",
      e.startTime ?? null,
      e.shotDuration ?? null,
      e.continuityAnchor || "",
      !!e.optional
    ])
  );
}
function Cd(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && ho(e.dependencyNodeIds, t.dependencyNodeIds) && ho(e.referenceNodeIds, t.referenceNodeIds) && ho(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.speechId === t.speechId && ho(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && e.continuityAnchor === t.continuityAnchor && !!e.optional == !!t.optional && e.sourceSignature === t.sourceSignature && e.resultSourceSignature === t.resultSourceSignature && !!e.stale == !!t.stale;
}
function Lr(e, t, n, r) {
  const o = e.storyboardItem;
  return !!(o && o.sourceNodeId === t && o.itemType === n && o.itemId === r);
}
function vd(e, t, n, r) {
  const o = r.map((c) => ({
    spec: c,
    group: t.find(
      (u) => u.type === "group" && u.group?.origin === "script" && u.group.sourceNodeId === n && u.group.syncKey === c.key
    )
  })).filter(
    (c) => !!c.group
  ), s = `script-edge-${ot(n)}-`, i = e.filter((c) => !c.id.startsWith(s));
  for (const { spec: c, group: u } of o) {
    const l = c.direction === "upstream", m = (c.sourceGroupKeys || []).map((N) => Ti(t, n, N)).filter((N) => !!N), I = l ? [u] : m.length ? m : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of I) {
      const w = N.id, E = l ? n : u.id;
      i.push({
        id: Ei(
          i,
          `${s}${c.key}-${ot(w)}`
        ),
        from: w,
        to: E,
        logicalFrom: w,
        logicalTo: E,
        purpose: "structure",
        executionMode: l ? void 0 : "manual"
      });
    }
  }
  const a = Kt(t, i);
  return Mi(e, a) ? e : a;
}
function xd(e, t, n) {
  const r = `script-item-edge-${ot(n)}-`, o = e.filter((c) => !c.id.startsWith(r)), s = t.filter(
    (c) => c.storyboardItem?.sourceNodeId === n && (!!c.groupId || c.storyboardItem.itemType === "video_compose")
  ), i = new Map(s.map((c) => [c.id, c]));
  for (const c of s)
    for (const u of c.storyboardItem?.dependencyNodeIds || []) {
      const l = i.get(u);
      !l || l.id === c.id || o.push({
        id: Ei(
          o,
          `${r}${ot(l.id)}-${ot(c.id)}`
        ),
        from: l.id,
        to: c.id,
        logicalFrom: l.id,
        logicalTo: c.id,
        purpose: "dependency",
        executionMode: l.groupId && l.groupId === c.groupId ? void 0 : "manual"
      });
    }
  const a = Kt(t, o);
  return Mi(e, a) ? e : a;
}
function kd(e) {
  const t = e.nodes.find(
    (a) => Lr(
      a,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = jg({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), r = sy(n), o = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceSignature: r,
    stale: !1
  };
  if (t) {
    const a = e.preservePosition ? { x: t.x, y: t.y } : wa(e.nodes, e.storyboardNode), c = bd(t), u = t.storyboardItem?.resultSourceSignature || (c ? t.storyboardItem?.sourceSignature : "");
    u && (o.resultSourceSignature = u), o.stale = !!(c && u !== r);
    const l = !t.power && !!e.power, m = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), I = t.x !== a.x || t.y !== a.y;
    if (!l && !m && !I && t.kind === "video" && t.outputType === "video_compose" && Cd(t.storyboardItem, o))
      return {
        node: t,
        changed: !1,
        nextNodeNo: e.nextNodeNo
      };
    const N = {
      ...t,
      x: a.x,
      y: a.y,
      kind: "video",
      outputType: "video_compose",
      ...l ? {
        power: e.power || void 0,
        subtitle: e.power?.output?.name || e.power?.name || "视频合成",
        description: "按镜头顺序合成画面、原声和配音。"
      } : {},
      composerDraft: {
        ...t.composerDraft || {},
        videoComposition: n
      },
      storyboardItem: o
    };
    return e.nodes[e.nodes.indexOf(t)] = N, {
      node: N,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const s = wa(
    e.nodes,
    e.storyboardNode
  ), i = qo(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return i.id = Di(
    e.nodes,
    `script-compose-${ot(e.storyboardNode.id)}`
  ), i.nodeNo = e.nextNodeNo, i.title = "视频合成", i.kind = "video", i.outputType = "video_compose", i.description = "按镜头顺序合成画面、原声和配音。", e.power || (i.subtitle = "未配置视频合成能力", i.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), i.composerDraft = { videoComposition: n }, i.storyboardItem = o, e.nodes.push(i), {
    node: i,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function sy(e) {
  const t = e.clips.map((n) => {
    const r = { ...n };
    return delete r.storyboardTransitionToNext, r;
  });
  return ot(JSON.stringify({ ...e, clips: t }));
}
function wa(e, t) {
  const n = e.filter(
    (s) => s.type === "group" && s.group?.origin === "script" && s.group.sourceNodeId === t.id
  ), r = n.reduce(
    (s, i) => Math.max(s, i.x + i.width),
    t.x + t.width + 160
  ), o = n.reduce(
    (s, i) => Math.min(s, i.y),
    t.y
  );
  return { x: r + 72, y: o };
}
function Rd(e, t, n, r, o) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (l) => o.some((m) => m.key === l)
  ).map((l) => Ti(t, n, l)).filter((l) => !!l), a = `script-compose-edge-${ot(n)}-`, c = e.filter((l) => !l.id.startsWith(a));
  for (const l of i.length ? i : t.filter((m) => m.id === n))
    c.push({
      id: Ei(
        c,
        `${a}${ot(l.id)}`
      ),
      from: l.id,
      to: r,
      logicalFrom: l.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const u = Kt(t, c);
  return Mi(e, u) ? e : u;
}
function Ad(e, t) {
  const n = `script-compose-edge-${ot(t)}-`, r = e.filter((o) => !o.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function Mi(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const o = n.get(r.id);
    return !!(o && r.from === o.from && r.to === o.to && (r.logicalFrom || "") === (o.logicalFrom || "") && (r.logicalTo || "") === (o.logicalTo || "") && (r.purpose || "") === (o.purpose || "") && (r.executionMode || "auto") === (o.executionMode || "auto") && (r.mediaUsage || "") === (o.mediaUsage || ""));
  });
}
function Io(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function Di(e, t) {
  return Td(new Set(e.map((n) => n.id)), t);
}
function Ei(e, t) {
  return Td(new Set(e.map((n) => n.id)), t);
}
function Td(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function ot(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function _a(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function iy(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function ho(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function ay(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => t.has(n.id) ? !1 : (t.add(n.id), !0));
}
function cy(e) {
  return [
    e.id,
    Number(e.resultRef?.version_id || 0),
    Number(e.asset?.version_id || e.asset?.version?.id || 0),
    e.storyboardItem?.sourceSignature || "",
    e.storyboardItem?.resultSourceSignature || ""
  ].join(":");
}
const dy = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function Md(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return dy[n] || { section: "shots" };
  }
  const t = e.storyboardItem;
  if (t)
    return t.itemType === "character" || t.itemType === "scene" || t.itemType === "prop" ? {
      section: "materials",
      materialType: t.itemType,
      materialId: t.itemId
    } : t.itemType === "video_compose" ? { section: "shots" } : {
      section: "shots",
      shotId: t.shotId || t.itemId
    };
}
const ba = 52, Na = 72, uy = 48, ly = {
  width: 360,
  height: 52
};
function fy(e, t) {
  const n = Yo(e);
  return {
    frames: Ed(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: Dd(e, n)
  };
}
function Ia(e) {
  return Yo(e);
}
function py(e, t) {
  return Dd(e).get(t.id) || "";
}
function Dd(e, t = Yo(e)) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e)
    o.type === "group" && o.group?.origin === "script" && n.set(o.id, o.group.sourceNodeId || "");
  const r = /* @__PURE__ */ new Map();
  for (const o of e) {
    let s = "";
    o.storyboardItem?.sourceNodeId ? s = o.storyboardItem.sourceNodeId : o.type === "group" && o.group?.origin === "script" ? s = o.group.sourceNodeId || "" : t.has(o.id) ? s = o.id : o.groupId && (s = n.get(o.groupId) || ""), s && r.set(o.id, s);
  }
  return r;
}
function Ed(e, t, n = Yo(e)) {
  const r = [];
  for (const o of n) {
    const s = e.find((m) => m.id === o);
    if (!s)
      continue;
    const i = e.filter(
      (m) => m.type === "group" && m.group?.origin === "script" && m.group.sourceNodeId === o
    ), a = new Set(i.map((m) => m.id)), c = e.filter(
      (m) => m.id === o || m.group?.sourceNodeId === o || m.storyboardItem?.sourceNodeId === o || !!(m.groupId && a.has(m.groupId))
    );
    if (c.length <= 1)
      continue;
    const u = c.filter(
      (m) => m.storyboardItem?.sourceNodeId === o && !m.storyboardItem.optional
    ), l = hy(c);
    r.push({
      id: Wo(o),
      sourceNodeId: o,
      title: s.title || "分镜脚本",
      memberNodeIds: c.map((m) => m.id),
      workNodeIds: u.map((m) => m.id),
      groupCount: i.length,
      workNodeCount: u.length,
      completedCount: u.filter(
        (m) => !m.storyboardItem?.stale && t(m)
      ).length,
      bounds: l
    });
  }
  return r.sort(
    (o, s) => o.bounds.y - s.bounds.y || o.bounds.x - s.bounds.x
  );
}
function Pd(e, t, n, r = new Map(t.map((o) => [o.id, o]))) {
  const o = e.workNodeIds.map((l) => r.get(l)).filter((l) => !!l), s = new Set(
    o.filter((l) => l.storyboardItem?.stale || !n(l)).map((l) => l.id)
  );
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const l of o)
      s.has(l.id) || l.storyboardItem?.itemType === "video_compose" || yy(l).some(
        (m) => s.has(m)
      ) && (s.add(l.id), i = !0);
  }
  const a = o.find(
    (l) => l.storyboardItem?.itemType === "video_compose"
  );
  s.size > 0 && a && s.add(a.id);
  const c = o.filter(
    (l) => s.has(l.id)
  );
  if (c.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const u = c.find(
    (l) => !Ho(l)
  );
  return u ? {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: `“${u.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: Jc({
      targets: c,
      nodesByID: r,
      hasResult: n
    })
  };
}
function my(e, t, n) {
  let r = !1;
  const o = e.map((s) => {
    const i = s.storyboardItem;
    return !i || i.sourceNodeId !== t || !n.has(s.id) ? s : (r = !0, {
      ...s,
      storyboardItem: {
        ...i,
        resultSourceSignature: i.sourceSignature || i.resultSourceSignature,
        stale: !1
      }
    });
  });
  return r ? o : e;
}
function Sa(e, t) {
  return t ? {
    x: e.bounds.x,
    y: e.bounds.y,
    ...ly
  } : e.bounds;
}
function gy(e, t, n) {
  const r = Fd(t, n);
  if (r.x === 0 && r.y === 0)
    return e;
  const o = new Set(t.memberNodeIds);
  return e.map(
    (s) => o.has(s.id) ? { ...s, x: s.x + r.x, y: s.y + r.y } : s
  );
}
function Fd(e, t) {
  return {
    x: t.x - e.bounds.x,
    y: t.y - e.bounds.y
  };
}
function Wo(e) {
  return `storyboard-frame:${e}`;
}
function yy(e) {
  return [
    ...e.storyboardItem?.dependencyNodeIds || [],
    ...e.storyboardItem?.referenceNodeIds || []
  ];
}
function Yo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
function hy(e) {
  let t = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY, r = Number.NEGATIVE_INFINITY, o = Number.NEGATIVE_INFINITY;
  for (const s of e) {
    const i = Ca(s.width, 180), a = Ca(s.height, 180);
    t = Math.min(t, s.x), n = Math.min(n, s.y), r = Math.max(r, s.x + i), o = Math.max(o, s.y + a);
  }
  return {
    x: t - ba,
    y: n - Na,
    width: r - t + ba * 2,
    height: o - n + Na + uy
  };
}
function Ca(e, t) {
  return Number.isFinite(e) && e > 0 ? e : t;
}
function wy({ data: e }) {
  const t = e, n = by(t), r = t.running ? "制作区正在执行" : t.runBlockedReason || (t.completedCount > 0 ? "只执行尚未完成或上次失败的内容" : "按依赖顺序生成制作区内容");
  return /* @__PURE__ */ M(
    "section",
    {
      className: `ws-storyboard-frame ${t.collapsed ? "is-collapsed" : ""}`,
      "aria-label": `${t.title} 分镜制作区`,
      children: [
        /* @__PURE__ */ M("header", { className: "ws-storyboard-frame-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-storyboard-frame-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(el, { size: 15 }) }),
          /* @__PURE__ */ M("strong", { children: [
            t.title,
            " · 分镜制作区"
          ] }),
          /* @__PURE__ */ M("span", { className: "ws-storyboard-frame-progress", children: [
            t.groupCount,
            " 组 · ",
            t.completedCount,
            "/",
            t.workNodeCount,
            " ",
            "完成"
          ] }),
          t.runActionEnabled ? /* @__PURE__ */ d(Me, { label: r, children: /* @__PURE__ */ M(
            "button",
            {
              type: "button",
              className: "nodrag nopan ws-storyboard-frame-run",
              "aria-label": n,
              disabled: t.running || !!t.runBlockedReason,
              onClick: xs(t.onRun),
              children: [
                t.running ? /* @__PURE__ */ d(Gt, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Vo, { size: 14, fill: "currentColor" }),
                /* @__PURE__ */ d("span", { children: n })
              ]
            }
          ) }) : null,
          /* @__PURE__ */ d(Me, { label: "聚焦制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": "聚焦制作区",
              onClick: xs(t.onFocus),
              children: /* @__PURE__ */ d(tl, { size: 14 })
            }
          ) }),
          /* @__PURE__ */ d(Me, { label: t.collapsed ? "展开制作区" : "折叠制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": t.collapsed ? "展开制作区" : "折叠制作区",
              onClick: xs(t.onToggleCollapsed),
              children: t.collapsed ? /* @__PURE__ */ d(nl, { size: 15 }) : /* @__PURE__ */ d(rl, { size: 15 })
            }
          ) })
        ] }),
        t.collapsed ? null : /* @__PURE__ */ d("div", { className: "ws-storyboard-frame-surface", "aria-hidden": "true" })
      ]
    }
  );
}
const _y = ai(
  wy,
  (e, t) => e.data === t.data
);
function by(e) {
  return e.running ? "生成中" : e.workNodeCount > 0 && e.completedCount >= e.workNodeCount ? "已完成" : e.completedCount > 0 ? "继续生成" : "开始生成";
}
function xs(e) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), e();
  };
}
const dr = /* @__PURE__ */ new Map(), Ny = 100;
function Iy(e, t) {
  const n = String(t.runError || "").trim(), r = t.id, o = Number(t.resultRef?.execution_id || 0), s = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), a = Cy(
    e,
    r,
    o,
    s,
    i
  ), [c, u] = K(n), [l, m] = K(!1);
  return ce(() => {
    if (u(n), !n || !a || !Rf(n)) {
      m(!1);
      return;
    }
    let I = !0;
    return m(!0), Sy({
      projectId: e,
      nodeId: r,
      executionId: o,
      requestId: s,
      runId: i,
      cacheKey: a,
      fallback: n
    }).then((N) => {
      I && N && u(N);
    }).catch(() => {
    }).finally(() => {
      I && m(!1);
    }), () => {
      I = !1;
    };
  }, [
    o,
    n,
    r,
    e,
    a,
    s,
    i
  ]), { error: c || n, loading: l };
}
function Sy({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: o,
  cacheKey: s,
  fallback: i
}) {
  const a = dr.get(s);
  if (a)
    return a;
  const c = Yc({
    projectId: e,
    executionId: n,
    requestId: r,
    runId: o
  }).then((u) => {
    const l = gn(u), m = [...l.node_results || []].reverse().find((N) => N.node_key === t), I = wi(m) || Mc(l);
    return _i(I, i);
  });
  return dr.set(s, c), vy(), c.catch(() => dr.delete(s)), c;
}
function Cy(e, t, n, r, o) {
  const s = n ? `execution:${n}` : r ? `request:${r}` : o ? `run:${o}` : "";
  return e > 0 && s ? `${e}:${s}:${t}` : "";
}
function vy() {
  for (; dr.size > Ny; ) {
    const e = dr.keys().next().value;
    if (!e)
      return;
    dr.delete(e);
  }
}
function Ke({
  label: e,
  overlay: t = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [o, s] = K(r <= 0);
  return ce(() => {
    if (r <= 0) {
      s(!0);
      return;
    }
    const i = window.setTimeout(() => s(!0), r);
    return () => window.clearTimeout(i);
  }, [r]), o ? /* @__PURE__ */ M(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ d(Gt, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: e })
      ]
    }
  ) : null;
}
function xy({
  space: e,
  canvases: t,
  cache: n
}) {
  const [r, o] = K([]), [s, i] = K([]), [a, c] = K([]), [u, l] = K(!1), m = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, I = H(m), N = le(
    () => u || ky(t),
    [t, u]
  );
  ce(() => {
    I.current = m, o([]), i([]), c([]), l(!1);
  }, [m]);
  const w = D(
    async (E = !1) => {
      if (!e)
        return !1;
      const F = m;
      try {
        const $ = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => Mp(e.project.id),
          E
        );
        return I.current !== F ? !1 : (o($.roles), i($.powers), c($.powerCategories), l(!0), !0);
      } catch ($) {
        return Q.error($ instanceof Error ? $.message : "加载能力列表失败"), !1;
      }
    },
    [n, m, e]
  );
  return ce(() => {
    !e || !N || u || w();
  }, [w, u, N, e]), {
    roles: r,
    powers: s,
    powerCategories: a,
    loaded: u,
    required: N,
    load: w
  };
}
function ky(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : Ko(n.power, n.kind, n.outputType) ? !!Hr([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function zn(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function qt(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function Ry({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: r,
  failedCount: o,
  staleCount: s,
  status: i,
  frameRunning: a = !1,
  selected: c,
  managed: u = !1,
  onRename: l,
  onEditStructure: m,
  onRun: I,
  runBlockedReason: N = "",
  children: w
}) {
  const [E, F] = K(!1), [$, V] = K(e.title), q = H(null), Y = i === "running" || i === "waiting", oe = Y ? "分组正在执行" : a ? "制作区正在执行" : N || (n === 0 ? "分组内暂无可运行节点" : s > 0 ? `重新生成 ${s} 个已变更节点` : "运行分组"), v = !I || n === 0 || Y || a || !!N;
  ce(() => {
    E || V(e.title);
  }, [E, e.title]), ce(() => {
    E && (q.current?.focus(), q.current?.select());
  }, [E]);
  const C = () => {
    const k = $.trim() || "未命名分组";
    F(!1), V(k), k !== e.title && l?.(k);
  };
  return /* @__PURE__ */ M(
    "div",
    {
      className: `ws-node-group-wrap ${c ? "is-selected" : ""} ${Y ? "is-running" : ""} ${i === "error" ? "is-error" : ""} ${u ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ M("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(ol, { size: 15 }) }),
          E ? /* @__PURE__ */ d(
            "input",
            {
              ref: q,
              className: "ws-node-group-title-input nodrag nowheel",
              value: $,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (k) => V(k.target.value),
              onBlur: C,
              onKeyDown: (k) => {
                k.key === "Enter" ? (k.preventDefault(), C()) : k.key === "Escape" && (k.preventDefault(), V(e.title), F(!1));
              }
            }
          ) : /* @__PURE__ */ d(
            Me,
            {
              label: u ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ d(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (k) => {
                    k.preventDefault(), k.stopPropagation(), !(u || !l) && F(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ d("span", { className: "ws-node-group-count", children: Y ? `${r}/${n}` : `${t} 个节点` }),
          i === "waiting" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待反馈" }) : i === "error" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: o > 0 ? `失败 ${o}` : "运行失败" }) : N ? /* @__PURE__ */ d(Me, { label: N, children: /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待前置" }) }) : a ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待调度" }) : s > 0 ? /* @__PURE__ */ d(Me, { label: "上游素材或提示词已变化；当前结果仍可使用，重新运行可更新", children: /* @__PURE__ */ M("span", { className: "ws-node-group-status is-stale", children: [
            "可更新 ",
            s
          ] }) }) : n > 0 && r === n ? /* @__PURE__ */ M("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ d(di, { size: 12 }),
            "已完成"
          ] }) : null,
          m ? /* @__PURE__ */ d(Me, { label: "编辑分镜结构", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (k) => {
                k.preventDefault(), k.stopPropagation(), m();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ d(nc, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ d(Me, { label: oe, children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: v,
              onClick: (k) => {
                k.preventDefault(), k.stopPropagation(), I?.();
              },
              "aria-label": "运行分组",
              children: Y ? /* @__PURE__ */ d(Gt, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Vo, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        w
      ]
    }
  );
}
function Od({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: r,
  className: o = "",
  style: s,
  onOpen: i,
  onOpenIntent: a,
  resizeControls: c,
  children: u,
  customContentIsPureMedia: l = !1,
  followContent: m = !1,
  followKey: I
}) {
  const N = H(null), w = H(!0), E = ir(e, n), F = u != null, $ = l || !F && !E && Un(n), V = !!i && (!F || l), q = [
    "ws-result-view",
    $ ? "" : "nodrag",
    "nopan",
    "nowheel",
    $ ? "has-pure-media" : "",
    o
  ].filter(Boolean).join(" ");
  return ce(() => {
    if (!m) {
      w.current = !0;
      return;
    }
    const v = N.current;
    v && w.current && (v.scrollTop = v.scrollHeight);
  }, [m, I]), /* @__PURE__ */ M(
    "div",
    {
      role: V ? "button" : void 0,
      tabIndex: V ? 0 : void 0,
      className: q,
      style: s,
      onPointerDown: (v) => {
        (!$ || Dy(v)) && v.stopPropagation();
      },
      onClick: (v) => {
        v.stopPropagation(), !(!i || qs(v.target, v.currentTarget) || My(v)) && (v.preventDefault(), i());
      },
      onPointerEnter: i ? a : void 0,
      onFocus: i ? a : void 0,
      onKeyDown: (v) => {
        v.stopPropagation(), !(!i || qs(v.target, v.currentTarget) || v.key !== "Enter" && v.key !== " ") && (v.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            ref: N,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onScroll: (v) => {
              if (!m)
                return;
              const C = v.currentTarget;
              w.current = C.scrollHeight - C.scrollTop - C.clientHeight < 16;
            },
            children: F ? u : E ? /* @__PURE__ */ d(
              ar,
              {
                output: e,
                fallback: t,
                mediaGridKind: Lo(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ d(Ay, { preview: n, label: r ?? t })
          }
        ),
        c
      ]
    }
  );
}
function Ay({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ M("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ d(
      "img",
      {
        src: e.imageUrl,
        alt: t || "图片结果",
        loading: "lazy",
        decoding: "async"
      }
    ),
    t ? /* @__PURE__ */ d("figcaption", { children: t }) : null
  ] }) : e.videoUrl ? /* @__PURE__ */ M("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ d(
      xo,
      {
        src: e.videoUrl,
        poster: e.videoPosterUrl,
        ariaLabel: t || "视频结果",
        objectFit: "contain",
        allowDragFromVideo: !0
      },
      e.videoUrl
    ),
    t ? /* @__PURE__ */ d("figcaption", { children: t }) : null
  ] }) : e.audioUrl ? /* @__PURE__ */ M("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ d("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ d("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ M(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ d(ui, { size: 16 }),
        /* @__PURE__ */ d("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ d(
    ar,
    {
      output: Ty(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function Ty(e) {
  return e ? { text: e } : void 0;
}
function Un(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function qs(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t);
}
function My(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  if (!t || t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function Dy(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? Fl(n, e.clientY) : qs(t, e.currentTarget);
}
const zd = wn(() => import("./space-agent-tools-CVlxLBTq.js")), jd = wn(() => import("./space-asset-tools-uKVvNhKS.js")), Ey = Ft(
  zd,
  (e) => e.AgentInteractionPanel
), Py = Ey.Component, Bd = Ft(
  wn(() => import("./protected-3-nodes-body-work-space-space-add-node-menu-tsx-B2qCqqSZ.js")),
  (e) => e.AddNodeMenu
), Fy = Bd.Component, Oy = Bd.preload, $d = Ft(
  jd,
  (e) => e.AssetBrowser
), zy = $d.Component, jy = $d.preload, Ud = Ft(
  jd,
  (e) => e.AssetPickerDialog
), va = Ud.Component, xa = Ud.preload, Vd = Ft(
  wn(() => import("./space-run-history-DsOb-JY0.js")),
  (e) => e.CanvasRunHistoryDrawer
), By = Vd.Component, $y = Vd.preload, Uy = Ft(
  zd,
  (e) => e.CanvasAgentResultContent
), Vy = Uy.Component, Ld = Ft(
  wn(() => import("./node-detail-dialog-CRNDaMek.js")),
  (e) => e.NodeDetailDialog
), Ly = Ld.Component, Kr = Ld.preload, Kd = Ft(
  wn(() => import("./space-node-settings-BK0OVz_5.js")),
  (e) => e.CanvasNodeSettings
), Ky = Kd.Component, qy = Kd.preload, Gy = Ft(
  wn(() => import("./space-storyboard-node-BL0QO_we.js")),
  (e) => e.StoryboardNodeContent
), Hy = Gy.Component, Wy = Ft(
  wn(() => import("./space-video-compose-view-Dy5ZVB9u.js")),
  (e) => e.VideoComposeView
), Yy = Wy.Component;
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider", "@/lib/agent-result-protocol"]);
const Gs = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!Gs || Object.keys(Gs).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const Xy = Gs.useTheme, Hs = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!Hs || Object.keys(Hs).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const { normalizeAgentResultOutputValue: Zy } = Hs, qd = {}, ka = [], Jy = [], Ra = [], Aa = /* @__PURE__ */ new Set(), Qy = 800;
function eh(e) {
  const t = H([]), n = H(0), r = D(() => {
    n.current && (window.cancelAnimationFrame(n.current), n.current = 0);
    const s = t.current;
    t.current = [], s.length !== 0 && e(
      (i) => s.reduce((a, c) => c(a), i)
    );
  }, [e]), o = D(
    (s) => {
      t.current.push(s), !n.current && (n.current = window.requestAnimationFrame(() => {
        n.current = 0, r();
      }));
    },
    [r]
  );
  return ce(
    () => () => {
      n.current && window.cancelAnimationFrame(n.current), t.current = [];
    },
    []
  ), le(() => ({ enqueue: o, flush: r }), [o, r]);
}
function Ta(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function Gd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const o of Ic(e, r.id))
        n.add(o.id);
  return n;
}
function Hd(e) {
  return Object.values(e).some(qt);
}
function th(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function nh(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function rh(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((o) => {
    const s = Pu(o), i = o.x + s.width, a = o.y + s.height;
    return o.type === "group" ? r.left <= o.x && r.top <= o.y && r.right >= i && r.bottom >= a : r.left <= i && r.right >= o.x && r.top <= a && r.bottom >= o.y;
  }).map((o) => o.id);
}
function oh(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const sh = {
  workSpace: ai(x_, k_),
  storyboardFrame: _y
}, ih = {
  animated: sg
}, ah = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, ch = [18, 18], dh = ["Control", "Meta"], uh = {
  type: "animated",
  animated: !1
}, lh = { padding: 0.32, maxZoom: 0.72 };
function Vt(e) {
  const t = H(e);
  return t.current = e, D((...n) => t.current(...n), []);
}
function fh({
  onInitialLoadComplete: e
}) {
  const t = wl(), n = _l(), r = le(() => P_(), []), o = le(() => new em(), []), [s, i] = K(null), [a, c] = K(0), u = H(0), [l, m] = K(null), I = H(null), [N, w] = K([]), E = N[N.length - 1] || "", [F, $] = K({}), V = H(F), [q, Y] = K("create"), { resolvedTheme: oe, setTheme: v } = Xy();
  bl(n.site.appearance, oe);
  const [C, k] = K(null), [X, pe] = K(!0), ne = H(!0), [he, re] = K({}), te = eh(re), [Ie, Re] = K({}), [fe, ae] = K(null), [Fe, Nn] = K(), [G, _t] = K(
    null
  ), [Hn, Zt] = K(null), [Zr, Jt] = K(!1), [Jr, Ot] = K(""), [We, Qr] = K(null), [zt, st] = K(""), [Ye, je] = K([]), [eo, gr] = K([]), [to, no] = K(!1), [ft, Wn] = K(""), [jt, Yn] = K(!1), [Qt, In] = K(1), [xt, Xn] = K(!1), [Sn, bt] = K(() => /* @__PURE__ */ new Set()), [Bt, en] = K(!1), [Xe, it] = K(null), [tn, kt] = K(!1), Be = H(null), nn = H(!1), Rt = H(/* @__PURE__ */ new Set()), At = H(/* @__PURE__ */ new Set()), Ze = H(/* @__PURE__ */ new Set()), Ce = H([]), Zn = H(!1), Tt = H(!1), Cn = H([0]), vn = H(null), Jn = H(/* @__PURE__ */ new Map()), yr = H(
    /* @__PURE__ */ new Map()
  ), we = H(null), {
    roles: hr,
    powers: Ne,
    powerCategories: wr,
    loaded: Je,
    required: ro,
    load: Qe
  } = xy({
    space: s,
    canvases: F,
    cache: o
  });
  ce(() => {
    V.current = F;
  }, [F]), ce(() => {
    u.current = a;
  }, [a]), ce(() => {
    Ce.current = Ye;
  }, [Ye]);
  const Nt = D((f) => {
    Q.error(f instanceof Error ? f.message : "保存画布失败");
  }, []), {
    markCanvasDirty: xn,
    flushCanvasSave: Mt,
    resetCanvasAutosave: _r,
    canvasSaveStatus: oo
  } = Zp({
    projectId: r,
    enabled: !!s,
    canvases: F,
    setCanvases: $,
    onError: Nt
  });
  ce(() => {
    if (Ze.current.size === 0)
      return;
    const f = [...Ze.current];
    Ze.current.clear();
    for (const g of f)
      xn(g);
  }, [F, xn]);
  const rn = D(async () => {
    if (!r) {
      st("缺少作品 ID"), pe(!1);
      return;
    }
    pe(!0), st("");
    try {
      const f = await Ap(
        r,
        u.current
      ), g = qw(
        f.canvases || {},
        f.assets || []
      ), h = Number(f.initialAssetCateId || 0) || jf(f);
      i(f), V.current = g, $(g), _r(g), u.current = h, c(h), m(null), I.current = null, Rt.current = /* @__PURE__ */ new Set(), At.current = /* @__PURE__ */ new Set(), Ce.current = [], je([]), gr([]), In(1), Xn(!1), Cn.current = [0], rr(
        r,
        f,
        g,
        "recovery",
        { assetCateId: h }
      );
    } catch (f) {
      st(f instanceof Error ? f.message : "加载创作空间失败");
    } finally {
      pe(!1);
    }
  }, [r, _r]), Dt = D((f) => {
    _t(f);
  }, []);
  ce(() => {
    rn();
  }, [rn]), ce(() => {
    X || !ne.current || (ne.current = !1, e());
  }, [X, e]);
  const Et = s?.assetCates, so = le(() => s ? Bc(s) : [], [s]), br = s ? s.assetCates.length > 0 : !1, J = le(
    () => s ? _s(s, a) : null,
    [a, s]
  ), Nr = le(
    () => s && J ? Bf(s, J.id) : [],
    [J, s]
  ), Qn = le(() => hr.filter($f), [hr]), io = le(() => Ne.filter(Uf), [Ne]), se = le(
    () => J ? F[String(J.id)] || mo(J.id) : mo(0),
    [J, F]
  ), Ir = le(
    () => Object.entries(F).map(
      ([f, g]) => `${f}:${Zg(g)}`
    ).join("|"),
    [F]
  ), Ae = le(
    () => _h(se, Ie),
    [se, Ie]
  ), Sr = jn, pt = le(
    () => Om({
      nodes: Ae.nodes,
      assets: s?.assets || [],
      assetCateId: J?.id || 0,
      nodeOutput: Xt,
      nodePreview: qn,
      assetPreview: (f) => {
        const g = f.version?.content ?? f.name, h = bn(
          g,
          String(f.kind || "")
        );
        return yn(h) || (h.text = f.name), h;
      },
      nodeHasResult: vt
    }),
    [J?.id, Ae.nodes, s?.assets]
  ), ao = le(
    () => Bm(pt),
    [pt]
  );
  ce(() => {
    !Et || ro && !Je || $((f) => {
      let g = f;
      for (const [h, b] of Object.entries(f)) {
        const _ = Number(h || b.assetCateId || 0), j = Ks({
          canvas: b,
          assetCate: $s(Et, _),
          powers: Ne
        }), R = qa(j, _);
        Ga(b, R) || (g === f && (g = { ...f }), g[h] = R, Ze.current.add(_));
      }
      return g;
    });
  }, [
    Et,
    Je,
    ro,
    Ne,
    Ir
  ]);
  const Cr = D(
    (f = "") => {
      xa(), Ot(f), Be.current = se.nodes.find((g) => g.id === f) || (Be.current?.id === f ? Be.current : null), k(null), Y("create"), Jt(!0);
    },
    [se.nodes]
  ), $t = D(
    (f, g) => {
      if (!Number.isInteger(f) || f < 0)
        return;
      const h = (j) => {
        const R = String(f), z = j[R] || mo(f), L = qa(
          g(z),
          f
        );
        return Ga(z, L) ? j : (Ze.current.add(f), {
          ...j,
          [R]: L
        });
      }, b = V.current, _ = h(b);
      V.current = _, $((j) => {
        const R = j === b ? _ : h(j);
        return V.current = R, R;
      });
    },
    []
  ), $e = D(
    (f) => {
      J && $t(J.id, f);
    },
    [J, $t]
  ), vr = D(
    (f, g, h) => {
      Re(
        (b) => bh(b, g, h)
      ), $t(f, (b) => {
        const _ = {
          ...b,
          nodes: b.nodes.map(
            (R) => R.id === g ? { ...R, ...h } : R
          )
        };
        return Et ? Ks({
          canvas: _,
          assetCate: $s(Et, f),
          powers: Ne
        }) : _;
      });
    },
    [Et, Ne, $t]
  ), et = D(
    (f, g) => {
      vr(Number(J?.id || 0), f, g), ae(
        (h) => h?.id === f ? { ...h, ...g } : h
      );
    },
    [J?.id, vr]
  ), xr = D(
    (f, g, h) => {
      if (!aw(g, h))
        return;
      const b = fu(h), _ = `${g.id}:${b}`;
      if (Rt.current.has(_))
        return;
      Rt.current.add(_);
      const j = g.title.trim(), R = V.current[String(f)];
      Pp({
        projectId: r,
        nodeKey: g.id,
        versionId: b,
        prompt: iw(g, R)
      }).then((z) => {
        const L = z.title.trim();
        !L || L === j || z.versionId !== b || $t(f, (U) => {
          const B = U.nodes.find(
            (W) => W.id === g.id
          );
          return !B || B.titleMode !== "auto" || B.title.trim() !== j || !lu(B) ? U : {
            ...U,
            nodes: U.nodes.map(
              (W) => W.id === g.id ? { ...W, title: L } : W
            )
          };
        });
      }).catch(() => {
        Rt.current.delete(_);
      });
    },
    [r, $t]
  ), on = D(
    async (f) => {
      const g = Number(f.assetCate.id || 0);
      g && xn(g);
    },
    [xn]
  ), Ee = D(
    (f, g, h) => {
      const b = {};
      $e((_) => {
        const j = _.nodes.map(
          (R) => R.id === f ? {
            ...R,
            composerDraft: Si(g)
          } : R
        );
        return b.canvas = { ..._, nodes: j }, b.canvas;
      }), h?.save === "immediate" && b.canvas && Mt(b.canvas).catch(() => {
      });
    },
    [Mt, $e]
  ), co = D(
    (f) => {
      $e((g) => {
        const h = g.edges.filter((b) => b.id !== f);
        return h.length === g.edges.length ? g : { ...g, edges: h };
      });
    },
    [$e]
  ), ns = D(
    (f, g) => {
      Kr(), Nn(g), ae(f);
    },
    []
  ), er = D(
    (f, g) => {
      Re((h) => {
        const b = se.nodes.find(
          (R) => R.id === f
        );
        if (!b)
          return h;
        const _ = h[f] || {}, j = {
          ...b,
          ..._
        };
        return {
          ...h,
          [f]: {
            ..._,
            feedbackRequests: g(Bn(j))
          }
        };
      });
    },
    [se.nodes]
  ), kn = D((f) => {
    const g = new Set(f.filter(Boolean));
    if (g.size !== 0) {
      if (we.current && g.has(we.current.nodeId)) {
        const h = we.current;
        we.current = null, h.reject(new Error(cd));
      }
      it(
        (h) => h && g.has(h.node.id) ? null : h
      ), Re((h) => {
        const b = { ...h };
        let _ = !1;
        for (const j of g) {
          const R = b[j] || {};
          b[j] = {
            ...R,
            feedbackRequests: []
          }, _ = !0;
        }
        return _ ? b : h;
      });
    }
  }, []), qe = D((f) => {
    !f || !f.id || i((g) => g && {
      ...g,
      assets: ca(g.assets, [f])
    });
  }, []), kr = D(
    ({ node: f, prompt: g }) => {
      const h = Fi(f, g), b = Ys(
        Bn(f),
        h
      );
      return er(
        f.id,
        (_) => Ys(_, h)
      ), kt(!1), new Promise((_, j) => {
        we.current = {
          nodeId: f.id,
          recordId: h.id,
          resolve: _,
          reject: j
        }, it({
          node: { ...f, feedbackRequests: b },
          recordId: h.id,
          prompt: g
        });
      });
    },
    [er]
  ), rs = D(
    async (f) => {
      const g = we.current;
      if (!(!g || tn)) {
        kt(!0);
        try {
          await g.submit?.(f), er(
            g.nodeId,
            (h) => qm(h, g.recordId, f)
          ), we.current = null, it(null), g.resolve(f);
        } catch (h) {
          Q.error(h instanceof Error ? h.message : "提交反馈失败");
        } finally {
          kt(!1);
        }
      }
    },
    [er, tn]
  ), uo = D(() => {
    it(null);
  }, []), os = D(
    (f, g) => {
      if (we.current?.nodeId === f.id && we.current.recordId === g.id && g.status === "pending") {
        it({
          node: f,
          recordId: g.id,
          prompt: g.prompt
        });
        return;
      }
      if (g.status === "pending") {
        const h = sw(
          Ce.current,
          f,
          g
        );
        if (h) {
          kt(!1), we.current = {
            nodeId: f.id,
            recordId: g.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (b) => {
              await du(
                r,
                h.run,
                h.pending,
                h.prompt,
                b
              ), Q.success("已提交反馈，流程继续执行"), window.setTimeout(() => vn.current?.(), 0);
            }
          }, it({
            node: f,
            recordId: g.id,
            prompt: h.prompt
          });
          return;
        }
      }
      it({
        node: f,
        recordId: g.id,
        prompt: {
          ...g.prompt,
          values: g.values || g.prompt.values || {}
        }
      });
    },
    [r]
  ), sn = D(
    ({
      assetCate: f,
      startNode: g,
      canvas: h,
      nodes: b = h.nodes,
      ..._
    }) => {
      if (!s)
        throw new Error("创作空间尚未加载");
      return {
        projectId: r,
        assetCate: f,
        space: s,
        startNode: g,
        ..._,
        nodes: b,
        edges: h.edges,
        viewport: h.viewport,
        canvasUpdatedAt: h.updatedAt,
        flushCanvasSave: Mt,
        onNodeResult: et,
        onAssetCreated: qe,
        setRunningNode: re,
        runningNodeBatcher: te,
        requestFlowFeedback: kr,
        requestNodeTitle: (j, R) => xr(f.id, j, R)
      };
    },
    [
      r,
      Mt,
      xr,
      kr,
      te,
      s,
      et,
      qe
    ]
  ), an = D(
    async (f) => {
      s && await rr(
        r,
        s,
        V.current,
        "recovery",
        { runIds: [Number(f?.canvasRun?.run_id || 0)] }
      );
    },
    [r, s]
  ), _e = D(
    async (f) => {
      if (!s || !J)
        return;
      let g = null;
      try {
        kn(
          rm(
            f.id,
            Ae.nodes,
            Ae.edges
          )
        ), g = sn({
          assetCate: J,
          startNode: f,
          canvas: {
            nodes: Ae.nodes,
            edges: Ae.edges,
            viewport: se.viewport
          }
        }), await ks(g), await on(g), Q.success("开始节点执行完成");
      } catch (h) {
        if (Lm(h) || Pr(h))
          return;
        const b = h instanceof Error ? h.message : "开始节点执行失败";
        re((_) => ({
          ..._,
          [f.id]: {
            nodeId: f.id,
            title: f.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error"
          }
        })), Q.error(b), window.setTimeout(() => {
          re((_) => zn(_, f.id));
        }, 1400);
      } finally {
        await an(g);
      }
    },
    [
      J,
      se.viewport,
      Ae.edges,
      Ae.nodes,
      kn,
      sn,
      on,
      an,
      re,
      s
    ]
  ), Rn = D(
    async (f) => {
      if (!s || !J)
        return;
      const g = Number(J.id || 0), h = V.current[String(g)] || se, b = h.nodes.find(
        (U) => U.id === f
      );
      if (!b) {
        Q.error("分镜脚本节点不存在");
        return;
      }
      const _ = Ed(
        h.nodes,
        vt
      ).find((U) => U.sourceNodeId === f);
      if (!_) {
        Q.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const j = Pd(
        _,
        h.nodes,
        vt
      );
      if (j.blockedReason) {
        Q.error(j.blockedReason);
        return;
      }
      const R = Wo(f), z = sn({
        assetCate: J,
        startNode: b,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        canvas: h
      });
      kn(j.pendingNodeIds), re((U) => ({
        ...U,
        [R]: {
          nodeId: R,
          title: `${b.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let L = 650;
      try {
        await ks(z), Q.success("制作区执行完成");
      } catch (U) {
        if (Pr(U))
          L = 0;
        else {
          L = 1400;
          const B = U instanceof Error ? U.message : "制作区执行失败";
          re((W) => ({
            ...W,
            [R]: {
              ...W[R] || {
                nodeId: R,
                title: `${b.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0
              },
              status: "error"
            }
          })), Q.error(B);
        }
      } finally {
        const U = new Set(
          (z.canvasRun?.node_results || []).filter((B) => Wt(B) === "success").map((B) => B.node_key).filter(Boolean)
        );
        U.size > 0 && ($e(
          (B) => Ma({
            canvas: B,
            sourceNodeId: f,
            successfulNodeIds: U,
            assetCate: J,
            powers: Ne
          })
        ), await on(z)), window.setTimeout(() => {
          re((B) => zn(B, R));
        }, L), await an(z);
      }
    },
    [
      se,
      J,
      kn,
      sn,
      on,
      Ne,
      an,
      s,
      $e
    ]
  ), An = D(
    async (f, g) => {
      if (!s || !J)
        return;
      const h = V.current[String(J.id)] || se, b = h.nodes.find((L) => L.id === f.id) || f, _ = Ih({
        ...b,
        composerDraft: {
          ...b.composerDraft || {},
          ...f.composerDraft || {}
        }
      }), j = h.nodes.map(
        (L) => L.id === _.id ? _ : L
      ), R = Cu(
        f.id,
        j,
        h.edges
      ), z = sn({
        assetCate: J,
        startNode: _,
        singleNode: !0,
        canvas: h,
        nodes: j,
        runInput: {
          _manual_input_context: R || void 0,
          _agent_turn_input: g?.agentInput,
          manual_node_id: f.id
        }
      });
      et(_.id, { runError: "" }), re((L) => ({
        ...L,
        [_.id]: {
          ...L[_.id] || {},
          nodeId: _.id,
          title: _.title,
          startedAt: L[_.id]?.startedAt || Date.now(),
          progress: Math.max(L[_.id]?.progress || 0, 8),
          status: "running",
          ...g?.agentInput ? { agent: od() } : {}
        }
      }));
      try {
        await ks(z), await on(z);
      } catch (L) {
        if (Pr(L)) {
          et(_.id, { runError: "" }), re((U) => zn(U, _.id));
          return;
        }
        throw et(_.id, {
          runError: L instanceof Error ? L.message : "节点运行失败"
        }), re((U) => ({
          ...U,
          [_.id]: {
            ...U[_.id] || {
              nodeId: _.id,
              title: _.title,
              startedAt: Date.now()
            },
            progress: 92,
            status: "error"
          }
        })), window.setTimeout(() => {
          re((U) => zn(U, _.id));
        }, 1400), L;
      } finally {
        await an(z);
      }
    },
    [
      J,
      se,
      sn,
      on,
      an,
      re,
      s,
      et
    ]
  ), tr = D(
    async (f) => {
      if (!J)
        throw new Error("当前分类不存在");
      return g_({
        node: f,
        projectId: r,
        assetCate: J,
        inputContext: f.inputContext || null,
        onNodeResult: et,
        onAssetCreated: qe,
        onRunStartNode: _e,
        onOpenImportPicker: Cr
      });
    },
    [
      J,
      Cr,
      r,
      _e,
      et,
      qe
    ]
  );
  ce(() => {
    s && Tr(
      Ye,
      se,
      a,
      s
    );
  }, [se, a, Ye, s]);
  async function nr(f) {
    if (I.current != null)
      return !1;
    const g = String(f);
    let h = !1;
    if (!Object.prototype.hasOwnProperty.call(V.current, g)) {
      I.current = f, m(f);
      try {
        const _ = await Tp({
          projectId: r,
          assetCateId: f
        }), j = Tu(
          Zf(_.canvas, Ne),
          _.assets
        );
        i(
          (z) => z && {
            ...z,
            assets: ca(z.assets, _.assets)
          }
        );
        const R = {
          ...V.current,
          [g]: j
        };
        V.current = R, $(R), h = !0;
      } catch (_) {
        return Q.error(_ instanceof Error ? _.message : "加载分类画布失败"), !1;
      } finally {
        I.current = null, m(null);
      }
    }
    if (u.current = f, c(f), w([]), Zt(null), k(null), !s)
      return !0;
    const b = V.current[String(f)] || mo(f);
    return Tr(Ye, b, f, s), h && rr(
      r,
      s,
      V.current,
      "recovery",
      { assetCateId: f }
    ), !0;
  }
  function tt(f) {
    Zt((g) => ({
      nodeId: f,
      nonce: (g?.nonce || 0) + 1
    }));
  }
  const ss = D((f) => {
    Zt((g) => !g || g.nodeId !== f.nodeId || g.nonce !== f.nonce ? g : null);
  }, []);
  async function rr(f, g, h, b, _ = {}) {
    if (!Zn.current) {
      Zn.current = !0;
      try {
        const j = b === "active" ? Lh(Ce.current) : [], R = (_.runIds || []).filter((ue) => ue > 0), z = R.length > 0 ? R : b === "active" ? j.map((ue) => Number(ue.run_id || 0)) : [], L = b === "recovery" && z.length === 0;
        let U = await bs({
          projectId: f,
          scope: b,
          assetCateId: _.assetCateId,
          runIds: z,
          summaryOnly: L
        }), B = As(U.items);
        if (L) {
          const ue = Hh(B, h);
          ue.length === 0 ? B = [] : (U = await bs({
            projectId: f,
            scope: b,
            assetCateId: _.assetCateId,
            runIds: ue
          }), B = As(U.items));
        }
        if (b === "active" && j.length > 0) {
          const ue = new Set(B.map(On)), Ge = j.filter(
            (mt) => !ue.has(On(mt))
          );
          if (Ge.length > 0) {
            const mt = await Promise.all(
              Ge.map(async (cn) => {
                try {
                  const ct = await Yc({
                    projectId: f,
                    executionId: Number(cn.execution_id || 0),
                    runId: Number(cn.run_id || 0),
                    requestId: String(cn.request_id || "")
                  });
                  return iu(ct);
                } catch {
                  return null;
                }
              })
            );
            B = Fa(
              B,
              mt.filter(
                (cn) => !!cn
              )
            );
          }
        }
        const W = Fa(
          Ce.current,
          B
        );
        Ce.current = W, je(W);
        for (const [ue, Ge] of Object.entries(h)) {
          const mt = Number(Ge.assetCateId || ue || 0);
          Tr(B, Ge, mt, g);
        }
      } catch {
      } finally {
        Zn.current = !1;
      }
    }
  }
  async function Tn(f, g = 0) {
    if (Tt.current)
      return;
    const h = Cn.current[g] || 0;
    Tt.current = !0, no(!0), Wn("");
    try {
      const b = await bs({
        projectId: f,
        scope: "history",
        beforeId: h,
        limit: 20
      });
      gr(
        As(b.items)
      ), In(g + 1), Xn(b.hasMore);
      const _ = Cn.current.slice(0, g + 1);
      b.hasMore && b.beforeId > 0 && (_[g + 1] = b.beforeId), Cn.current = _;
    } catch (b) {
      Wn(
        b instanceof Error ? b.message : "读取画布运行记录失败"
      );
    } finally {
      Tt.current = !1, no(!1);
    }
  }
  const Rr = le(
    () => su(Ye),
    [Ye]
  ), Ar = Rr.length > 0, is = Ar || Hd(he);
  async function lo(f) {
    const g = !f;
    if (g && (Bt || Sn.size > 0) || !g && f?.some(
      (b) => Sn.has(On(b))
    ))
      return;
    let h = [];
    g && en(!0);
    try {
      let b = f || [], _ = 0, j = b.length;
      if (g) {
        const L = await jp(r);
        b = L.items.map(gn), _ = L.failedCount, j = L.count;
      } else
        b = Kh(b);
      if (j === 0) {
        Q.info("当前没有运行中的任务");
        return;
      }
      g || (h = b.map(On), bt((U) => {
        const B = new Set(U);
        for (const W of h)
          B.add(W);
        return B;
      }), b = (await Promise.allSettled(
        b.map(
          (U) => zp({
            projectId: r,
            runId: Number(U.run_id || 0),
            requestId: String(U.request_id || "")
          })
        )
      )).flatMap((U, B) => {
        if (U.status === "rejected")
          return _ += 1, [];
        const W = gn(U.value);
        return [
          {
            ...b[B],
            status: W.status,
            error: W.error
          }
        ];
      }));
      const R = qh(b), z = b.filter((L) => L.status === "canceled");
      if (R.size > 0) {
        const L = (/* @__PURE__ */ new Date()).toISOString(), U = (W) => W.map((ue) => {
          const Ge = Gh(R, ue);
          return Ge ? { ...ue, status: Ge, updated_at: L } : ue;
        }), B = U(Ce.current);
        Ce.current = B, je(B), gr(U);
      }
      if (z.length > 0) {
        const L = new Set(
          z.flatMap((U) => {
            const B = zo(U), W = Xo(U);
            return W ? [...B, W] : B;
          })
        );
        re((U) => {
          if (g && _ === 0)
            return qd;
          let B = U;
          for (const W of L)
            B[W] && (B === U && (B = { ...U }), delete B[W]);
          return B;
        }), Q.success(
          z.length === 1 ? "已停止运行" : `已停止 ${z.length} 个运行`
        );
      } else _ === 0 && Q.info("任务已经结束，无需停止");
      _ > 0 && Q.error(
        _ === j ? "停止运行失败，请稍后重试" : `${_} 个运行停止失败，请稍后重试`
      ), jt && Tn(
        r,
        Math.max(0, Qt - 1)
      ), window.setTimeout(() => vn.current?.(), 0);
    } catch (b) {
      Q.error(b instanceof Error ? b.message : "停止画布运行失败");
    } finally {
      h.length > 0 && bt((b) => {
        const _ = new Set(b);
        for (const j of h)
          _.delete(j);
        return _;
      }), g && en(!1);
    }
  }
  function as() {
    Dt({
      title: "停止所有运行？",
      description: "停止后不会再提交后续任务。正在生成的内容会尝试取消，已经完成或已经计费的任务不会撤销。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => lo()
    });
  }
  function cs(f) {
    Dt({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => lo([f])
    });
  }
  vn.current = s ? () => {
    rr(
      r,
      s,
      V.current,
      "active",
      { assetCateId: u.current }
    );
  } : null, ce(() => {
    if (!s || !Ar)
      return;
    const f = window.setInterval(() => {
      vn.current?.();
    }, Zd);
    return () => window.clearInterval(f);
  }, [Ar, r, s]), ce(() => {
    const f = Jn.current, g = yr.current, h = [];
    if (s)
      for (const _ of Rr) {
        const j = _.run, R = String(j.request_id || "").trim();
        R && h.push({
          key: `${r}:${R}`,
          requestId: R,
          run: j,
          managedNodeIds: _.managedNodeIds
        });
      }
    const b = new Set(h.map((_) => _.key));
    for (const [_, j] of f)
      b.has(_) || (j.controller.abort(), f.delete(_), g.delete(_));
    for (const _ of h) {
      const j = f.get(_.key);
      if (j) {
        j.managedNodeIds = _.managedNodeIds;
        for (const L of Qs(_.run))
          j.finishedNodeIds.add(L);
        continue;
      }
      const R = new AbortController(), z = {
        controller: R,
        managedNodeIds: _.managedNodeIds,
        finishedNodeIds: Qs(_.run)
      };
      f.set(_.key, z), ad({
        projectId: r,
        requestId: _.requestId,
        lastId: g.get(_.key) || "0-0",
        signal: R.signal,
        onFrame: (L) => {
          R.signal.aborted || (L.stream_id && g.set(_.key, L.stream_id), jh(
            { setRunningNode: re, runningNodeBatcher: te },
            L,
            z.managedNodeIds,
            z.finishedNodeIds
          ));
        }
      }).catch(() => {
        !R.signal.aborted && f.get(_.key) === z && f.delete(_.key);
      });
    }
  }, [r, Rr, te, s]), ce(
    () => () => {
      for (const f of Jn.current.values())
        f.controller.abort();
      Jn.current.clear(), yr.current.clear();
    },
    []
  );
  function Tr(f, g, h, b) {
    const _ = f.filter(
      (z) => Vh(z, h) && !au(z, g)
    );
    if (_.length === 0)
      return;
    const j = /* @__PURE__ */ new Set(), R = /* @__PURE__ */ new Set();
    for (const z of _) {
      const L = new Set(
        zo(z).filter((B) => R.has(B) ? !1 : (R.add(B), !0))
      );
      if (L.size === 0)
        continue;
      const U = (z.node_results || []).filter((B) => {
        const W = B.node_key;
        return !W || !L.has(W) || j.has(W) ? !1 : (j.add(W), !0);
      });
      ds(
        z,
        g,
        b,
        U,
        L
      );
    }
  }
  function ds(f, g, h, b = f.node_results || [], _) {
    const j = Qh(f, g.nodes);
    if (!j)
      return;
    const R = _s(h, g.assetCateId);
    if (!R)
      return;
    const z = {
      projectId: r,
      assetCate: R,
      space: h,
      startNode: j,
      nodes: g.nodes,
      edges: g.edges,
      viewport: g.viewport,
      onNodeResult: (U, B) => vr(g.assetCateId, U, B),
      onAssetCreated: qe,
      setRunningNode: re,
      requestFlowFeedback: kr,
      requestNodeTitle: (U, B) => xr(g.assetCateId, U, B),
      canvasRun: f
    }, L = b.filter((U) => {
      const B = ew(f, U);
      return !B || At.current.has(B) ? !1 : (At.current.add(B), !0);
    });
    uu(z, L), nu(z, L), us(z, f, j), ur(z, f, _), ru(z, f, _);
  }
  function us(f, g, h) {
    if (g.single_node || String(g.status || "").trim().toLowerCase() !== "success" || !Hr(h.resultOutput))
      return;
    const b = new Set(
      (g.node_results || []).filter((_) => Wt(_) === "success").map((_) => _.node_key).filter(Boolean)
    );
    $t(
      f.assetCate.id,
      (_) => Ma({
        canvas: _,
        sourceNodeId: h.id,
        successfulNodeIds: b,
        assetCate: f.assetCate,
        powers: Ne
      })
    );
  }
  function Ut(f, g, h) {
    if (!J)
      return null;
    const b = qo(
      f,
      J,
      se.nodes.length,
      g,
      h
    ), _ = s ? _s(s, ri(b) || J.id) : J;
    f === "asset" && (b.cardinality = _.cardinality);
    const j = f === "asset" && h?.replaceSingleAssetNode ? ri(b) || Number(_.id || 0) : 0, R = j ? La(
      se.nodes,
      se.edges,
      j,
      h?.connectFromNodeId
    ) : null, z = R ? Ka(
      se.nodes,
      se.edges,
      j,
      h?.connectFromNodeId,
      R.id
    ) : /* @__PURE__ */ new Set(), L = R?.id || b.id, U = C?.connection;
    if ($e((B) => {
      let W = B.edges;
      const ue = j ? La(
        B.nodes,
        B.edges,
        j,
        h?.connectFromNodeId
      ) : null;
      if (ue) {
        const mt = Ka(
          B.nodes,
          B.edges,
          j,
          h?.connectFromNodeId,
          ue.id
        );
        if (W = B.edges.filter(
          (ct) => !mt.has(ct.from) && !mt.has(ct.to)
        ), U) {
          const ct = Va(
            U,
            ue.id
          );
          W = Dn(W, ct.source, ct.target);
        } else h?.connectFromNodeId ? W = Dn(
          W,
          h.connectFromNodeId || "",
          ue.id
        ) : h?.connectToNodeId && (W = Dn(
          W,
          ue.id,
          h.connectToNodeId || ""
        ));
        const cn = B.nodes.filter((ct) => !mt.has(ct.id)).map(
          (ct) => ct.id === ue.id ? Es(ct, b) : ct
        );
        return {
          ...B,
          nodes: cn,
          edges: Kt(cn, W)
        };
      }
      if (U) {
        const mt = Va(U, b.id);
        W = Dn(W, mt.source, mt.target);
      } else h?.connectFromNodeId ? W = Dn(
        W,
        h.connectFromNodeId || "",
        b.id
      ) : h?.connectToNodeId && (W = Dn(W, b.id, h.connectToNodeId || ""));
      const Ge = js(
        [...B.nodes, b],
        b.id,
        { x: b.x, y: b.y }
      );
      return {
        ...B,
        nodes: Ge,
        edges: Kt(Ge, W)
      };
    }), R) {
      const B = Es(R, b);
      Re((W) => {
        const ue = { ...W };
        for (const Ge of z)
          delete ue[Ge];
        return ue[R.id] = {
          ...ue[R.id] || {},
          ...Lw(B)
        }, ue;
      });
    }
    return h?.selectCreated !== !1 && (w([L]), tt(L)), Y("create"), k(null), R ? Es(R, b) : b;
  }
  function ls(f, g) {
    if (!J)
      return;
    if (Ia(se.nodes).has(f.id)) {
      Q.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const h = Ew(
      f,
      J.id,
      se.nodes.length,
      g
    );
    $e((b) => {
      const _ = js(
        [...b.nodes, h],
        h.id,
        { x: h.x, y: h.y }
      );
      return {
        ...b,
        nodes: _,
        edges: Kt(_, b.edges)
      };
    }), Re((b) => {
      const _ = b[f.id];
      return _ ? { ...b, [h.id]: _ } : b;
    }), w([h.id]), tt(h.id), k(null), Q.success("已复制节点");
  }
  function fs(f, g = {}) {
    const h = Gd(
      se.nodes,
      f
    );
    if (h.size === 0)
      return;
    const b = Ia(se.nodes);
    if (!g.allowStoryboardFrame && [...h].some((_) => b.has(_))) {
      Q.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    $e((_) => {
      const j = _.nodes.filter((R) => !h.has(R.id));
      return {
        ..._,
        nodes: j,
        edges: Kt(j, _.edges)
      };
    }), Re(
      (_) => Ta(_, h)
    ), re((_) => Ta(_, h)), w([]), Zt(
      (_) => _ && h.has(_.nodeId) ? null : _
    ), ae(
      (_) => _ && h.has(_.id) ? null : _
    ), Ot(
      (_) => h.has(_) ? "" : _
    ), Be.current && h.has(Be.current.id) && (Be.current = null), Q.success(
      f.length > 1 || h.size > 1 ? `已删除 ${h.size} 个节点` : "已删除节点"
    );
  }
  function fo(f, g) {
    Ut("asset", g, { asset: f });
  }
  function ps(f, g) {
    if (!f)
      return;
    const h = se.nodes.find((_) => _.id === f) || (Be.current?.id === f ? Be.current : null);
    if (!h)
      return;
    const b = Bo(g.version?.content) || ut(g.version?.content);
    et(
      f,
      fn(
        {
          ...h,
          kind: g.kind || J.kind,
          assetCateId: Number(g.asset_cate_id || J.id || 0)
        },
        {
          output: b,
          asset: g
        },
        "导入资产"
      )
    ), ms(f, b);
  }
  async function ms(f, g) {
    if (!f)
      return;
    const h = se.edges.filter((b) => b.from === f).map((b) => se.nodes.find((_) => _.id === b.to)).filter(
      (b) => !!b && b.type === "function" && b.functionOption?.key === "display"
    );
    if (h.length !== 0)
      for (const b of h)
        et(
          b.id,
          fn(b, { output: g }, "展示导入结果")
        );
  }
  function gs(f) {
    const g = Jr;
    if (!g) {
      fo(f);
      return;
    }
    if (!(se.nodes.find((b) => b.id === g) || (Be.current?.id === g ? Be.current : null))) {
      fo(f), Ot(""), Be.current = null;
      return;
    }
    ps(g, f);
  }
  function ys() {
    Jt(!1), Ot(""), Be.current = null;
  }
  function hs(f, g) {
    xa(), Qr({ nodeId: f, frameIndex: g }), k(null), Y("create");
  }
  async function p(f) {
    const g = We;
    if (!g || nn.current)
      return;
    const h = Ae.nodes.find((z) => z.id === g.nodeId);
    if (!h) {
      Q.error("宫格节点不存在");
      return;
    }
    const b = f.filter(
      (z) => z.kind === "image" && z.id > 0 && z.versionID > 0
    ), _ = Number.isInteger(g.frameIndex);
    if (_ && b.length === 0) {
      Q.error("请选择一张图片");
      return;
    }
    if (!_ && b.length === 0) {
      Q.error("请至少选择一张图片");
      return;
    }
    if (!_ && b.length > jn) {
      Q.error(`一次最多导入 ${jn} 张图片`);
      return;
    }
    const j = fi([
      h.asset?.version?.content,
      h.resultOutput
    ]), R = _ ? Nh(
      j,
      Number(g.frameIndex),
      b[0],
      h.title
    ) : Wd(
      b,
      j,
      h.title
    );
    if (!R) {
      Q.error("当前宫格内容不可编辑");
      return;
    }
    nn.current = !0;
    try {
      const z = Number(h.asset?.id || 0), L = Number(
        h.asset?.version?.id || h.asset?.version_id || 0
      ), U = z > 0 && L > 0 ? await $p({
        projectId: r,
        assetId: z,
        versionId: L,
        content: R
      }) : await Lp({
        projectId: r,
        assetCateId: Number(h.assetCateId || J?.id || 0),
        name: R.title || h.title || "宫格图片",
        kind: "collection",
        content: R,
        nodeKey: h.id,
        requestId: `storyboard-grid-import:${h.id}:${Date.now()}`
      }), B = ln(
        U,
        h.asset
      );
      qe(B), et(
        h.id,
        Ws(h, B)
      ), Q.success(_ ? "宫格图片已替换" : "图片已导入宫格");
    } catch (z) {
      Q.error(z instanceof Error ? z.message : "导入宫格图片失败");
    } finally {
      nn.current = !1;
    }
  }
  function y(f, g) {
    Ut("power", g, { power: f });
  }
  function T(f = "") {
    Cr(f);
  }
  async function A(f) {
    const g = await ng({
      projectID: r,
      teamID: Number(s?.project.team_id || 0),
      files: f
    }), h = [];
    for (const b of g) {
      const _ = jr(b.asset);
      _.id && qe(_);
      const j = Ol(b.asset);
      j.id && h.push(j);
    }
    return h;
  }
  function O(f, g) {
    Ut("agent", g, { role: f });
  }
  function x(f, g) {
    Ut("flow", g, { flow: f });
  }
  function Z(f) {
    Ut("group", f);
  }
  function de(f, g) {
    const h = Ut("function", g, { functionOption: f });
    f.key === "import" && (Be.current = h, T(h?.id || ""));
  }
  function ee(f, g, h) {
    Oy(), Y("create"), k({
      x: f.x,
      y: f.y,
      position: g,
      connection: h
    }), Qe();
  }
  function me() {
    v(oe === "dark" ? "light" : "dark");
  }
  const nt = Vt((f) => {
    w(f), k(null);
  }), be = Vt(ee), ie = Vt(Ut), Ue = Vt(ls), Ve = Vt(fs), at = Vt(
    (f) => $e((g) => ({ ...g, nodes: f }))
  ), rt = Vt(
    (f) => $e((g) => ({ ...g, edges: f }))
  ), It = Vt(
    (f) => $e((g) => g.nodes.length === 0 && g.edges.length === 0 ? g : { ...g, viewport: f })
  ), or = Vt(
    hs
  );
  return X ? null : zt || !s || !J ? /* @__PURE__ */ d("main", { className: `ws-page is-${oe} ws-loading-screen`, children: /* @__PURE__ */ d("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ d("span", { children: zt || "创作空间不存在" }) }) }) : /* @__PURE__ */ M("main", { className: `ws-page is-${oe} is-${q}-view`, children: [
    /* @__PURE__ */ d(
      hh,
      {
        activeCate: J,
        mode: q,
        interactive: q === "create",
        nodes: Ae.nodes,
        edges: Ae.edges,
        viewport: se.viewport,
        selectedNodeId: E,
        selectedNodeIds: N,
        onSelectNodes: nt,
        onOpenNodeMenu: be,
        onAddConfiguredNode: ie,
        onCopyNode: Ue,
        onDeleteNodes: Ve,
        onShowNodeDetail: ns,
        onNodesCommit: at,
        onEdgesCommit: rt,
        onConnectedMediaEdgeRemove: co,
        onViewportCommit: It,
        focusNodeRequest: Hn,
        onFocusNodeRequestConsumed: ss,
        projectId: r,
        space: s,
        canvasReferenceItems: ao,
        catalogCache: o,
        runningNodes: he,
        setRunningNode: re,
        onNodeResult: et,
        onNodeDraftChange: Ee,
        onAssetCreated: qe,
        onRunStoryboardFrame: Rn,
        onRunFunctionNode: tr,
        onRunBackendNode: An,
        onOpenStoryboardGridImport: or,
        onClearFeedbackRecords: kn,
        requestConfirm: Dt,
        onOpenFeedbackRecord: os
      }
    ),
    /* @__PURE__ */ d(
      ph,
      {
        space: s,
        cates: so,
        activeCate: J,
        saveStatus: oo[String(J.id)] || "saved",
        hasAssetCates: br,
        loadingCateId: l,
        onBack: () => t({ to: "/bot/work" }),
        onSelectCate: nr,
        onRefresh: rn,
        onOpenRunHistory: () => {
          Yn(!0), Tn(r, 0);
        },
        onRunHistoryIntent: $y,
        canStopRuns: is,
        stoppingRuns: Bt || Sn.size > 0,
        onStopRuns: as,
        theme: oe,
        onToggleTheme: me
      }
    ),
    jt ? /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载运行历史", overlay: !0 }),
        children: /* @__PURE__ */ d(
          By,
          {
            open: !0,
            runs: eo,
            loading: to,
            error: ft,
            page: Qt,
            hasNextPage: xt,
            onOpenChange: Yn,
            onRefresh: () => Tn(r, 0),
            onPreviousPage: () => Tn(
              r,
              Math.max(0, Qt - 2)
            ),
            onNextPage: () => Tn(r, Qt),
            stoppingRunKeys: Sn,
            onStopRun: cs,
            onLocateRun: (f) => {
              const g = String(f.start_node_id || "");
              g && (Yn(!1), nr(Number(f.asset_cate_id || a)).then(
                (h) => {
                  h && window.requestAnimationFrame(() => tt(g));
                }
              ));
            }
          }
        )
      }
    ) : null,
    /* @__PURE__ */ d(
      yh,
      {
        mode: q,
        onModeIntent: (f) => {
          f === "result" && jy();
        },
        onSelectMode: (f) => {
          Y(f), k(null);
        }
      }
    ),
    Zr ? /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载资产选择器", overlay: !0 }),
        children: /* @__PURE__ */ d(
          va,
          {
            open: !0,
            teamID: s.project.team_id,
            scopeProjectID: s.project.id,
            title: "导入资产",
            description: "选择已有资产或上传本地文件，确认后加入当前画布。",
            initialFilters: {
              sourceType: "project",
              projectID: s.project.id
            },
            confirmSelection: !0,
            contentMode: "full",
            validateAsset: (f) => f.versionID > 0 ? "" : "该资产没有可用版本，无法导入。",
            onUpload: A,
            onClose: ys,
            onConfirm: (f) => {
              const g = f[0];
              g && gs(jr(g));
            }
          }
        )
      }
    ) : null,
    We ? /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载图片选择器", overlay: !0 }),
        children: /* @__PURE__ */ d(
          va,
          {
            open: !0,
            teamID: s.project.team_id,
            scopeProjectID: s.project.id,
            title: Number.isInteger(We.frameIndex) ? "替换宫格图片" : "导入宫格图片",
            description: Number.isInteger(We.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${Sr} 张已有图片，或上传本地图片。`,
            initialFilters: {
              sourceType: "project",
              projectID: s.project.id,
              kind: "image"
            },
            allowedKinds: ["image"],
            multiple: !Number.isInteger(We.frameIndex),
            maxSelection: Sr,
            confirmSelection: !0,
            contentMode: "full",
            uploadAccept: "image/*",
            validateAsset: (f) => f.kind !== "image" ? "请选择图片资产。" : f.versionID > 0 ? "" : "该图片没有可用版本，无法导入。",
            onUpload: A,
            onClose: () => Qr(null),
            onConfirm: (f) => {
              p(f);
            }
          }
        )
      }
    ) : null,
    q === "result" ? /* @__PURE__ */ d("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ d(Le, { fallback: /* @__PURE__ */ d(Ke, { label: "正在加载资产" }), children: /* @__PURE__ */ d(
      zy,
      {
        teamID: s.project.team_id,
        scopeProjectID: s.project.id,
        onLocalUpload: A,
        initialFilters: {
          sourceType: "project",
          projectID: s.project.id,
          assetCateID: br ? J.id : 0
        },
        headerAction: /* @__PURE__ */ d(Me, { label: "关闭资产", children: /* @__PURE__ */ M("button", { type: "button", onClick: () => Y("create"), children: [
          /* @__PURE__ */ d(rc, { "aria-hidden": "true" }),
          /* @__PURE__ */ d("span", { className: "sr-only", children: "关闭资产" })
        ] }) })
      }
    ) }) }) : null,
    Xe ? /* @__PURE__ */ d(
      __,
      {
        prompt: Xe.prompt,
        running: tn,
        readonly: Gm(
          Xe,
          Ae.nodes,
          we.current
        ),
        history: Bn(
          Ae.nodes.find(
            (f) => f.id === Xe.node.id
          ) || Xe.node
        ),
        activeRecordId: Xe.recordId,
        onSelectRecord: (f) => {
          const g = Ae.nodes.find(
            (h) => h.id === Xe.node.id
          ) || Xe.node;
          it({
            node: g,
            recordId: f.id,
            prompt: {
              ...f.prompt,
              values: f.values || f.prompt.values || {}
            }
          });
        },
        onClose: uo,
        onSubmit: rs
      },
      `${Xe.node.id}-${Xe.recordId}`
    ) : null,
    G ? /* @__PURE__ */ d(
      wh,
      {
        request: G,
        onClose: () => _t(null)
      }
    ) : null,
    C ? /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载节点菜单", overlay: !0 }),
        children: /* @__PURE__ */ d(
          Fy,
          {
            menu: C,
            flows: Nr,
            powers: io,
            powerCategories: wr,
            roles: Qn,
            onClose: () => k(null),
            onSelectFlow: (f) => x(f, C.position),
            onSelectFunction: (f) => de(f, C.position),
            onSelectGroup: () => Z(C.position),
            onSelectRole: (f) => O(f, C.position),
            onSelectPower: (f) => y(f, C.position)
          }
        )
      }
    ) : null,
    fe ? /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载节点详情", overlay: !0 }),
        children: /* @__PURE__ */ d(
          Ly,
          {
            projectId: s.project.id,
            teamId: s.team.id,
            assetCateId: Number(
              fe.assetCateId || fe.asset?.asset_cate_id || J?.id || 0
            ),
            node: fe,
            storyboardFocus: Fe,
            canvasNodes: Ae.nodes,
            connectedMediaReferences: Su(
              Ae.nodes,
              Ae.edges,
              fe.id
            ),
            canvasReferenceItems: ao.filter(
              (f) => f.source !== "current" || f.id !== fe.id
            ),
            onNodeDraftChange: (f) => {
              f && (Ee(fe.id, f), ae(
                (g) => g?.id === fe.id ? { ...g, composerDraft: f } : g
              ));
            },
            onConnectedMediaEdgeRemove: co,
            onRunNode: An,
            onAssetUpdated: (f) => {
              const g = ln(
                f,
                fe.asset
              );
              qe(g);
              const h = Ws(
                fe,
                g
              );
              fe.id.startsWith("asset-detail-") || et(fe.id, h), ae(
                (b) => b?.id === fe.id ? {
                  ...b,
                  ...h
                } : b
              );
            },
            onClose: () => {
              ae(null), Nn(void 0);
            }
          }
        )
      }
    ) : null
  ] });
}
function ph({
  space: e,
  cates: t,
  activeCate: n,
  saveStatus: r,
  hasAssetCates: o,
  loadingCateId: s,
  onBack: i,
  onSelectCate: a,
  onRefresh: c,
  onOpenRunHistory: u,
  onRunHistoryIntent: l,
  canStopRuns: m,
  stoppingRuns: I,
  onStopRuns: N,
  theme: w,
  onToggleTheme: E
}) {
  const F = Math.max(
    0,
    t.findIndex(($) => $.id === n.id)
  );
  return /* @__PURE__ */ M("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ M("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: i,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ d(sl, { size: 18 })
        }
      ),
      /* @__PURE__ */ M("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ d("strong", { children: e.project.name }),
        /* @__PURE__ */ d("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    o ? /* @__PURE__ */ M(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": F
        },
        children: [
          /* @__PURE__ */ d("span", { className: "ws-cate-indicator" }),
          t.map(($) => /* @__PURE__ */ M(
            "button",
            {
              type: "button",
              className: `ws-cate ${$.id === n.id ? "is-active" : ""}`,
              disabled: s != null,
              onClick: () => {
                a($.id);
              },
              children: [
                s === $.id ? /* @__PURE__ */ d(Gt, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ d("span", { className: "ws-cate-name", children: $.name })
              ]
            },
            $.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ M("div", { className: `ws-top-actions ${m ? "has-running" : ""}`, children: [
      /* @__PURE__ */ d(mh, { status: r }),
      m ? /* @__PURE__ */ d(Me, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: I,
          onClick: N,
          children: [
            I ? /* @__PURE__ */ d(Gt, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(il, { size: 13, fill: "currentColor" }),
            I ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ d(Me, { label: "查看画布运行记录", children: /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: l,
          onFocus: l,
          onClick: u,
          children: [
            /* @__PURE__ */ d(al, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ M("button", { type: "button", className: "ws-action", onClick: E, children: [
        w === "dark" ? /* @__PURE__ */ d(cl, { size: 15 }) : /* @__PURE__ */ d(dl, { size: 15 }),
        w === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ M("button", { type: "button", className: "ws-action", onClick: c, children: [
        /* @__PURE__ */ d(di, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function mh({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ d(Me, { label: t, children: /* @__PURE__ */ M("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ d(Gt, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(oc, { size: 14 }),
    t
  ] }) });
}
const gh = [
  { key: "create", label: "创作", icon: ul },
  { key: "result", label: "资产", icon: ll }
];
function yh({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ d("nav", { className: "ws-dock", "aria-label": "画布视角", children: gh.map((r) => {
    const o = r.icon;
    return /* @__PURE__ */ M(
      "button",
      {
        type: "button",
        className: `ws-dock-button ${r.key === e ? "is-active" : ""}`,
        onPointerEnter: () => t(r.key),
        onFocus: () => t(r.key),
        onClick: () => n(r.key),
        children: [
          /* @__PURE__ */ d(o, { size: 20 }),
          r.label
        ]
      },
      r.key
    );
  }) });
}
const hh = ai(function({
  activeCate: t,
  mode: n,
  interactive: r,
  nodes: o,
  edges: s,
  viewport: i,
  selectedNodeId: a,
  selectedNodeIds: c,
  onSelectNodes: u,
  onOpenNodeMenu: l,
  onAddConfiguredNode: m,
  onCopyNode: I,
  onDeleteNodes: N,
  onShowNodeDetail: w,
  onNodesCommit: E,
  onEdgesCommit: F,
  onConnectedMediaEdgeRemove: $,
  onViewportCommit: V,
  focusNodeRequest: q,
  onFocusNodeRequestConsumed: Y,
  projectId: oe,
  space: v,
  canvasReferenceItems: C,
  catalogCache: k,
  runningNodes: X,
  setRunningNode: pe,
  onNodeResult: ne,
  onNodeDraftChange: he,
  onAssetCreated: re,
  onRunStoryboardFrame: te,
  onRunFunctionNode: Ie,
  onRunBackendNode: Re,
  onOpenStoryboardGridImport: fe,
  onClearFeedbackRecords: ae,
  requestConfirm: Fe,
  onOpenFeedbackRecord: Nn
}) {
  const [G, _t] = K(null), [Hn, Zt] = K(""), [Zr, Jt] = K(""), [Jr, Ot] = K(""), [We, Qr] = K(null), [zt, st] = K(null), [Ye, je] = K(""), [eo, gr] = K(!0), [to, no] = K(!1), [ft, Wn] = K(() => /* @__PURE__ */ new Set()), [jt, Yn] = K(1), Qt = H(1), In = H(1), xt = H(null), [Xn, Sn] = K(null), bt = le(
    () => new Set(c),
    [c]
  ), Bt = H(null), en = H(/* @__PURE__ */ new Map()), Xe = H(
    /* @__PURE__ */ new Map()
  ), it = H(/* @__PURE__ */ new Map()), tn = H(null), kt = H(!1), Be = H(!1), nn = H(!1), Rt = H(null), At = H(!1), Ze = H(s);
  Ze.current = s;
  const Ce = D((p) => {
    const y = Pn(p);
    Qt.current = y, xt.current != null && typeof window < "u" && window.cancelAnimationFrame(xt.current), xt.current = null, In.current = y, Za(Bt.current, y), Yn(
      (T) => Math.abs(T - y) > 5e-3 ? y : T
    );
  }, []), Zn = D((p) => {
    const y = Pn(p);
    if (Qt.current = y, !(Math.abs(In.current - y) <= 5e-3) && xt.current == null) {
      if (typeof window > "u") {
        In.current = y, Yn(y);
        return;
      }
      xt.current = window.requestAnimationFrame(() => {
        xt.current = null;
        const T = Qt.current;
        In.current = T, Za(Bt.current, T);
      });
    }
  }, []);
  ce(
    () => () => {
      xt.current != null && typeof window < "u" && window.cancelAnimationFrame(xt.current);
    },
    []
  );
  const Tt = D(
    (p) => {
      Ze.current = p, F(p);
    },
    [F]
  ), Cn = D(
    (p) => {
      const y = Object.entries(p);
      if (y.length === 0)
        return;
      const T = new Map(y);
      let A = !1;
      const O = Ze.current.map((x) => {
        if (!T.has(x.id))
          return x;
        const Z = T.get(x.id) || void 0;
        return (x.mediaUsage || void 0) === Z ? x : (A = !0, { ...x, mediaUsage: Z });
      });
      A && Tt(O);
    },
    [Tt]
  ), vn = D(
    (p) => {
      const y = Ze.current.filter((T) => T.id !== p);
      y.length !== Ze.current.length && (Ze.current = y, je((T) => T === p ? "" : T), $(p));
    },
    [$]
  ), Jn = (p, y) => {
    if (Ot(""), !r)
      return;
    const T = lm(o, p, y);
    T !== o && E(T);
  }, yr = (p, y) => {
    if (Ot(""), !r)
      return;
    const T = fm(o, p, y);
    T !== o && E(T);
  }, we = H({
    onNodeResult: ne,
    onNodeDraftChange: he,
    onAssetCreated: re,
    onRunFunctionNode: Ie,
    onOpenStoryboardGridImport: fe,
    onClearFeedbackRecords: ae,
    onOpenFeedbackRecord: Nn,
    onShowNodeDetail: w,
    requestConfirm: Fe,
    onRunBackendNode: Re,
    onConnectedMediaUsagesChange: Cn,
    onConnectedMediaEdgeRemove: vn,
    onNodeResizeStart: Ot,
    onNodeResizeEnd: Jn,
    onResultViewResizeEnd: yr
  });
  we.current = {
    onNodeResult: ne,
    onNodeDraftChange: he,
    onAssetCreated: re,
    onRunFunctionNode: Ie,
    onOpenStoryboardGridImport: fe,
    onClearFeedbackRecords: ae,
    onOpenFeedbackRecord: Nn,
    onShowNodeDetail: w,
    requestConfirm: Fe,
    onRunBackendNode: Re,
    onConnectedMediaUsagesChange: Cn,
    onConnectedMediaEdgeRemove: vn,
    onNodeResizeStart: Ot,
    onNodeResizeEnd: Jn,
    onResultViewResizeEnd: yr
  };
  const hr = le(
    () => ({
      onNodeResult: (p, y) => we.current.onNodeResult(p, y),
      onNodeDraftChange: (p, y, T) => we.current.onNodeDraftChange(p, y, T),
      onAssetCreated: (p) => we.current.onAssetCreated(p),
      onRunFunctionNode: (p) => we.current.onRunFunctionNode(p),
      onOpenStoryboardGridImport: (p, y) => we.current.onOpenStoryboardGridImport(p, y),
      onClearFeedbackRecords: (p) => we.current.onClearFeedbackRecords(p),
      onOpenFeedbackRecord: (p, y) => we.current.onOpenFeedbackRecord(p, y),
      onShowNodeDetail: (p, y) => we.current.onShowNodeDetail(p, y),
      requestConfirm: (p) => we.current.requestConfirm(p),
      onRunBackendNode: (p, y) => we.current.onRunBackendNode(p, y),
      onConnectedMediaUsagesChange: (p) => we.current.onConnectedMediaUsagesChange(p),
      onConnectedMediaEdgeRemove: (p) => we.current.onConnectedMediaEdgeRemove(p),
      onNodeResizeStart: (p) => we.current.onNodeResizeStart(p),
      onNodeResizeEnd: (p, y) => we.current.onNodeResizeEnd(p, y),
      onResultViewResizeEnd: (p, y) => we.current.onResultViewResizeEnd(p, y)
    }),
    []
  ), Ne = le(
    () => Pw(o, s),
    [s, o]
  ), wr = le(
    () => fy(
      o,
      (p) => Ne.hasResultByNodeId.get(p.id) || !1
    ),
    [Ne.hasResultByNodeId, o]
  ), Je = wr.frames, ro = le(
    () => new Map(
      Je.map((p) => [
        p.id,
        Pd(
          p,
          o,
          (y) => Ne.hasResultByNodeId.get(y.id) || !1,
          Ne.nodeById
        ).blockedReason
      ])
    ),
    [Ne.hasResultByNodeId, o, Je]
  ), Qe = le(
    () => new Map(Je.map((p) => [p.id, p])),
    [Je]
  ), Nt = wr.sourceNodeIds, xn = wr.sourceNodeIdByNodeId;
  ce(() => {
    const p = new Set(Je.map((y) => y.id));
    Wn((y) => {
      const T = new Set(
        [...y].filter((O) => p.has(O))
      );
      return T.size === y.size && [...T].every((O) => y.has(O)) ? y : T;
    });
  }, [Je]);
  const Mt = le(() => {
    const p = /* @__PURE__ */ new Set();
    for (const y of Je)
      if (ft.has(y.id))
        for (const T of y.memberNodeIds)
          p.add(T);
    return p;
  }, [ft, Je]), _r = D(
    (p) => {
      const y = Qe.get(p), T = Bt.current?.getBoundingClientRect();
      if (!y || !G || !T)
        return;
      const A = Sa(
        y,
        ft.has(y.id)
      ), O = Math.max(1, T.width - 144), x = Math.max(1, T.height - 144), Z = Math.max(
        0.35,
        Math.min(
          0.9,
          O / A.width,
          x / A.height
        )
      );
      G.setCenter?.(
        A.x + A.width / 2,
        A.y + A.height / 2,
        { zoom: Z, duration: 320 }
      ), Ce(Z);
    },
    [
      ft,
      G,
      Ce,
      Qe
    ]
  ), oo = D(
    (p) => {
      const y = Qe.get(p);
      if (!y)
        return;
      const T = !ft.has(p);
      if (Wn((A) => {
        const O = new Set(A);
        return O.has(p) ? O.delete(p) : O.add(p), O;
      }), T) {
        const A = new Set(y.memberNodeIds);
        u(
          c.filter((O) => !A.has(O))
        ), Zt(""), je(""), st(null);
      }
    },
    [
      ft,
      u,
      c,
      Qe
    ]
  ), rn = H({
    onRun: te,
    onFocus: _r,
    onToggle: oo
  });
  rn.current = {
    onRun: te,
    onFocus: _r,
    onToggle: oo
  };
  const Dt = le(
    () => o.map((p) => p.id).join("\0"),
    [o]
  ), Et = le(
    () => new Set(
      Dt ? Dt.split("\0") : []
    ),
    [Dt]
  ), so = le(
    () => Dt ? `${t.id}:${Dt}` : "",
    [t.id, Dt]
  ), br = le(
    () => Hd(X),
    [X]
  ), J = le(() => {
    const p = (x) => Ne.hasResultByNodeId.get(x.id) || !1, y = /* @__PURE__ */ new Set(), T = o.filter((x) => !Mt.has(x.id)).map((x) => {
      y.add(x.id);
      const Z = { x: x.x, y: x.y }, de = bt.has(x.id), ee = de && c.length === 1 && si(x), me = x.type === "power" ? Kn(x.power, x.kind, x.outputType).viewMode : "", nt = ee, be = nt ? v : null, ie = nt || me === "storyboard" || me === "video_compose" ? C : Jy, Ue = (me === "video_compose" || ee) && Ne.incomingMediaReferencesByNodeId.get(x.id) || Ra, Ve = Nt.has(x.id), at = xn.get(x.id) || "", rt = at && Ne.nodeById.get(at) || null, It = !!(at && qt(
        X[Wo(at)]
      )), or = `ws-flow-node ws-flow-node-${x.type}`, f = X[x.id] || null, g = x.type === "group" && Ne.groupMembersById.get(x.id) || ka, h = x.type === "group" ? Qc({
        members: g,
        runningNodes: X,
        groupState: f,
        hasResult: p
      }) : null, b = x.type === "function" && x.functionOption?.key === "start" ? br : !1, _ = Ne.inputContextByNodeId.get(x.id) || null, j = Ne.runBlockedReasonByNodeId.get(x.id) || "", R = en.current.get(x.id), z = R?.data, U = z?.sourceNode === x && z.projectId === oe && z.space === be && z.runningNode === f && Mu(z.groupMembers || [], g) && Ww(z.groupRuntime, h) && z.canvasHasRunningNode === b && z.canvasReferenceItems === ie && z.connectedMediaReferences === Ue && z.interactive === r && z.structureLocked === Ve && z.storyboardSourceNode === rt && z.storyboardFrameRunning === It && z.runBlockedReason === j && z.showNodeSettings === ee && Ow(z.inputContext, _) && z ? z : {
        ...x,
        sourceNode: x,
        projectId: oe,
        space: be,
        catalogCache: k,
        runningNode: f,
        groupMembers: g,
        groupRuntime: h,
        canvasHasRunningNode: b,
        canvasReferenceItems: ie,
        connectedMediaReferences: Ue,
        interactive: r,
        structureLocked: Ve,
        storyboardSourceNode: rt,
        storyboardFrameRunning: It,
        runBlockedReason: j,
        showNodeSettings: ee,
        setRunningNode: pe,
        ...hr,
        inputContext: _
      }, B = x.type === "group" ? 1 : x.groupId ? 3 : 2, W = R?.style, ue = Pu(x);
      if (R && R.position.x === Z.x && R.position.y === Z.y && R.data === U && R.selected === de && R.className === or && R.draggable === (r && !Ve) && R.deletable === !Ve && R.zIndex === B && R.initialWidth === ue.width && R.initialHeight === ue.height && W?.width === ue.width && W?.height === ue.height)
        return R;
      const Ge = {
        ...R,
        id: x.id,
        type: "workSpace",
        position: Z,
        data: U,
        selected: de,
        className: or,
        draggable: r && !Ve,
        deletable: !Ve,
        zIndex: B,
        ...Ya(ue, W)
      };
      return en.current.set(x.id, Ge), Ge;
    });
    for (const x of en.current.keys())
      y.has(x) || en.current.delete(x);
    const A = /* @__PURE__ */ new Set(), O = Je.map((x) => {
      A.add(x.id);
      const Z = ft.has(x.id), de = Sa(x, Z), ee = !1, me = "", nt = ee, be = it.current.get(x.id), ie = be?.data, Ve = ie?.title === x.title && ie.groupCount === x.groupCount && ie.workNodeCount === x.workNodeCount && ie.completedCount === x.completedCount && ie.running === nt && ie.runBlockedReason === me && ie.runActionEnabled === ee && ie.collapsed === Z && ie ? ie : {
        type: "storyboardFrame",
        title: x.title,
        groupCount: x.groupCount,
        workNodeCount: x.workNodeCount,
        completedCount: x.completedCount,
        running: nt,
        runBlockedReason: me,
        runActionEnabled: ee,
        collapsed: Z,
        onRun: ie?.onRun || (() => {
          rn.current.onRun(
            x.sourceNodeId
          );
        }),
        onFocus: ie?.onFocus || (() => rn.current.onFocus(x.id)),
        onToggleCollapsed: ie?.onToggleCollapsed || (() => rn.current.onToggle(x.id))
      }, at = bt.has(x.id), rt = be?.style;
      if (be && be.position.x === de.x && be.position.y === de.y && be.data === Ve && be.selected === at && be.draggable === r && be.selectable === r && be.focusable === r && be.initialWidth === de.width && be.initialHeight === de.height && rt?.width === de.width && rt?.height === de.height)
        return be;
      const It = {
        ...be,
        id: x.id,
        type: "storyboardFrame",
        position: { x: de.x, y: de.y },
        data: Ve,
        selected: at,
        className: "ws-flow-node ws-flow-node-storyboard-frame",
        zIndex: 0,
        draggable: r,
        selectable: r,
        connectable: !1,
        deletable: !1,
        focusable: r,
        dragHandle: ".ws-storyboard-frame-header",
        ...Ya(de, rt)
      };
      return it.current.set(x.id, It), It;
    });
    for (const x of it.current.keys())
      A.has(x) || it.current.delete(x);
    return [...O, ...T];
  }, [
    ft,
    Ne,
    Mt,
    r,
    Nt,
    o,
    oe,
    X,
    c.length,
    bt,
    pe,
    v,
    k,
    C,
    br,
    hr,
    Je,
    ro,
    xn
  ]), { flowNodes: Nr, setFlowNodes: Qn } = cm(
    J,
    Zr || Jr
  ), io = D(
    (p) => {
      r && (je(""), F(s.filter((y) => y.id !== p)));
    },
    [s, r, F]
  ), se = D(
    (p) => {
      !r || !s.some((y) => y.id === p) || Fe({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => io(p)
      });
    },
    [io, s, r, Fe]
  ), Ir = D(
    (p) => {
      if (!r || p.length === 0)
        return;
      const y = Gd(o, p);
      if (y.size === 0)
        return;
      if ([...y].some(
        (O) => Nt.has(O)
      )) {
        Q.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const T = p.length === 1 ? p[0] : null, A = p.some((O) => O.type === "group");
      Fe({
        title: T ? `删除「${T.title}」` : `删除 ${y.size} 个节点`,
        description: A ? "会同时删除组内节点，并移除与这些节点相连的连线。" : T ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          je(""), N(p);
        }
      });
    },
    [
      r,
      Nt,
      o,
      N,
      Fe
    ]
  ), Ae = D(
    (p, y = []) => {
      if (!r || p.length === 0)
        return;
      const T = new Set(
        p.flatMap((ee) => ee.memberNodeIds)
      ), A = /* @__PURE__ */ new Set([
        ...T,
        ...y.map((ee) => ee.id)
      ]), O = o.filter((ee) => A.has(ee.id));
      if (O.length === 0)
        return;
      const x = p.length === 1 && y.every((ee) => T.has(ee.id)) ? p[0] : null, Z = O.filter(
        (ee) => ee.type === "group"
      ).length, de = O.length - Z;
      Fe({
        title: x ? `删除「${x.title}」制作区` : `删除 ${O.length} 个节点`,
        description: x ? `将删除其中 ${Z} 个分组和 ${de} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          je(""), N(O, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, o, N, Fe]
  ), Sr = le(
    () => s.filter(
      (p) => Et.has(p.from) && Et.has(p.to) && !Mt.has(p.from) && !Mt.has(p.to)
    ).map((p) => ({
      id: p.id,
      source: p.from,
      sourceHandle: "output-0",
      target: p.to,
      targetHandle: "input-0",
      type: "animated",
      animated: !1,
      data: {
        physicalFrom: p.from,
        physicalTo: p.to,
        logicalFrom: p.logicalFrom,
        logicalTo: p.logicalTo,
        purpose: yi(p),
        executionMode: p.executionMode,
        mediaUsage: p.mediaUsage
      }
    })),
    [Et, s, Mt]
  ), pt = le(() => {
    const p = Ne.highlightedPathEdgesByNodeId.get(a) || Aa, y = Ne.highlightedPathEdgesByNodeId.get(Hn) || Aa, T = /* @__PURE__ */ new Set([
      ...p,
      ...y
    ]), A = p.size > 0 ? a : y.size > 0 ? Hn : "", O = /* @__PURE__ */ new Set(), x = Sr.map((Z) => {
      O.add(Z.id);
      const de = Qw(
        Z,
        Ne.nodeById,
        Hn,
        a,
        Ye,
        T,
        A
      ), ee = Xe.current.get(Z.id);
      if (ee?.baseEdge === Z && ee.highlighted === de.highlighted && ee.selected === de.selected && ee.highlightColor === de.highlightColor && ee.onDeleteEdge === se)
        return ee.renderedEdge;
      const me = e_(
        Z,
        de,
        se
      );
      return Xe.current.set(Z.id, {
        ...de,
        baseEdge: Z,
        renderedEdge: me,
        onDeleteEdge: se
      }), me;
    });
    for (const Z of Xe.current.keys())
      O.has(Z) || Xe.current.delete(Z);
    return x;
  }, [
    Sr,
    Ne,
    Hn,
    se,
    Ye,
    a
  ]), ao = le(
    () => We ? [...pt, We] : pt,
    [pt, We]
  );
  ce(() => {
    if (!G || !so || q || i.zoom != null || typeof window > "u")
      return;
    const p = setTimeout(() => {
      G.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(p);
  }, [so, G, q, i.zoom]), ce(() => {
    if (!G || !q || typeof window > "u")
      return;
    const p = o.find((A) => A.id === q.nodeId);
    if (!p) {
      Y(q);
      return;
    }
    const y = Je.find(
      (A) => ft.has(A.id) && A.memberNodeIds.includes(p.id)
    );
    if (y) {
      Wn((A) => {
        const O = new Set(A);
        return O.delete(y.id), O;
      });
      return;
    }
    const T = window.setTimeout(() => {
      const A = { x: p.x, y: p.y }, O = p.type === "power" ? 1.02 : 0.96;
      G.setCenter?.(
        A.x + (p.width || 180) / 2,
        A.y + (p.height || 180) / 2,
        { zoom: O, duration: 320 }
      ), Ce(O), Y(q);
    }, 80);
    return () => window.clearTimeout(T);
  }, [
    ft,
    G,
    Ce,
    q,
    o,
    Y,
    Je
  ]);
  const Cr = D(
    (p) => {
      if (!r)
        return;
      const y = p.map((O) => {
        if (O.type !== "position" || !O.position)
          return O;
        const x = ws(
          o,
          O.id,
          O.position
        );
        return x === O.position ? O : {
          ...O,
          position: x,
          ...O.positionAbsolute ? { positionAbsolute: x } : {}
        };
      });
      Qn((O) => {
        const x = Lu(y, O);
        for (const Z of x)
          en.current.set(Z.id, Z);
        return x;
      });
      const T = new Set(c);
      let A = !1;
      for (const O of p)
        O.type === "select" && (A = !0, O.selected ? (T.delete(O.id), T.add(O.id)) : T.delete(O.id));
      A && u([...T]);
    },
    [r, o, u, c]
  ), $t = D(
    (p) => {
      if (!r)
        return;
      let y = "", T = !1;
      for (const x of p)
        x.type === "select" && (T = !0, x.selected && (y = x.id));
      T && je(y);
      const A = p.filter(
        (x) => x.type !== "select"
      );
      if (A.length === 0)
        return;
      const O = Ku(A, pt);
      Tt(Kw(O));
    },
    [Tt, pt, r]
  ), $e = D(
    async (p, y) => {
      if (Ze.current.some((ee) => {
        const me = Gr(ee);
        return me.sourceNodeId === p && me.targetNodeId === y;
      }))
        return;
      const A = o.find((ee) => ee.id === y), x = Sc(o, p).filter(gi);
      let Z, de;
      if (A?.type === "power" && A.power && x.length > 0)
        try {
          const ee = Number(
            A.composerDraft?.selectedTargetId || 0
          ), me = Number(
            v.release?.id || v.project.release_id || 0
          ), be = (await k.loadPowerForm(
            {
              projectId: oe,
              releaseId: me,
              flowId: Number(A.flow?.id || 0),
              powerId: Number(A.power?.id || 0),
              powerKey: A.power?.key || "",
              targetId: ee
            },
            () => Dp({
              projectId: oe,
              flowId: Number(A.flow?.id || 0),
              powerId: Number(A.power?.id || 0),
              powerKey: A.power?.key || "",
              targetId: ee
            })
          )).params || [], ie = Pi(A), Ue = Su(
            o,
            Ze.current,
            y
          ), Ve = of(
            be,
            ie
          ), at = sf(
            be,
            Ve,
            [
              ...Ue.map((g) => g.source),
              ...x
            ]
          ), rt = af({
            node: A,
            content: ie.promptContent,
            items: C,
            connections: Ue,
            params: be,
            values: at,
            requestedMode: ie.multiImageMode,
            additionalSources: x
          }), It = rt.active ? rt.mode : void 0;
          if (rt.error) {
            Q.error(rt.error);
            return;
          }
          const or = cf(
            df(be, at)
          ), f = uf(
            Ue,
            or,
            x,
            ie.promptContent,
            C,
            It
          );
          if (f.error) {
            Q.error(f.error);
            return;
          }
          if (Z = f.usage, rt.active && It) {
            const g = Si({
              ...ie,
              paramValues: at,
              multiImageMode: It
            });
            ra(g) !== ra(ie) && (de = g);
          }
        } catch (ee) {
          Q.error(
            ee instanceof Error ? `媒体用途加载失败，未建立连线：${ee.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      A && de && he(A.id, de), Tt(
        Kt(
          o,
          Dn(
            Ze.current,
            p,
            y,
            Z
          )
        )
      );
    },
    [
      C,
      k,
      Tt,
      o,
      he,
      oe,
      v
    ]
  ), vr = D(
    (p) => {
      r && (kt.current = !0, !(!p.source || !p.target || p.source === p.target) && $e(
        p.source || "",
        p.target || ""
      ));
    },
    [$e, r]
  ), et = D(
    (p, y) => {
      if (!r)
        return;
      const T = String(y?.nodeId || "");
      T && (nn.current = !0, u([]), st(null)), tn.current = T ? {
        nodeId: T,
        handleId: y?.handleId || null,
        handleType: y?.handleType || null
      } : null, kt.current = !1, je("");
    },
    [r, u]
  ), xr = D(
    (p) => {
      if (!r) {
        tn.current = null, kt.current = !1;
        return;
      }
      const y = tn.current;
      if (tn.current = null, y?.nodeId && typeof window < "u" && window.setTimeout(() => {
        nn.current = !1;
      }, 0), kt.current) {
        kt.current = !1;
        return;
      }
      if (!y?.nodeId)
        return;
      const T = r_(p);
      T && (Be.current = !0, l(
        T,
        Dr(G, T),
        y
      ));
    },
    [G, r, l]
  ), on = D(
    (p, y) => {
      r && (p.preventDefault(), p.stopPropagation(), st(null), u([]), je(y.id));
    },
    [r, u]
  );
  ce(() => {
    if (!Ye || typeof window > "u")
      return;
    function p(y) {
      !r || !Ha(y) || (y.preventDefault(), se(Ye));
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [r, se, Ye]), ce(() => {
    if (c.length === 0 || Ye || typeof window > "u")
      return;
    function p(y) {
      if (!r || !Ha(y))
        return;
      const T = o.filter(
        (O) => bt.has(O.id)
      ), A = c.map((O) => Qe.get(O)).filter((O) => !!O);
      if (!(T.length === 0 && A.length === 0)) {
        if (y.preventDefault(), A.length > 0) {
          Ae(A, T);
          return;
        }
        Ir(T);
      }
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [
    r,
    o,
    Ir,
    Ae,
    Ye,
    c.length,
    c,
    bt,
    Qe
  ]);
  const Ee = D((p) => {
    Qr(
      (y) => Zw(y, p) ? y : p
    );
  }, []), co = D(
    (p) => {
      if (!r)
        return !1;
      const y = o.find(
        (A) => A.id === p.source
      ), T = o.find(
        (A) => A.id === p.target
      );
      return ni(y, T);
    },
    [r, o]
  ), ns = D(
    (p, y) => {
      if (!r)
        return;
      const T = Qe.get(y.id);
      if (T) {
        const me = Fd(
          T,
          y.position
        ), nt = new Set(T.memberNodeIds);
        Qn(
          (be) => be.map((ie) => {
            if (!nt.has(ie.id))
              return ie;
            const Ue = o.find((Ve) => Ve.id === ie.id);
            return Ue ? {
              ...ie,
              position: {
                x: Ue.x + me.x,
                y: Ue.y + me.y
              }
            } : ie;
          })
        ), Ee(null);
        return;
      }
      if (Nt.has(y.id)) {
        Ee(null);
        return;
      }
      const A = o.find((me) => me.id === y.id);
      if (!A) {
        Ee(null);
        return;
      }
      const O = ws(
        o,
        y.id,
        y.position
      ), x = O === y.position ? y : { ...y, position: O };
      if (A.type === "group") {
        const me = y.position.x - A.x, nt = y.position.y - A.y;
        Qn(
          (be) => be.map((ie) => {
            const Ue = o.find((Ve) => Ve.id === ie.id);
            return Ue?.groupId !== A.id ? ie : {
              ...ie,
              position: {
                x: Ue.x + me,
                y: Ue.y + nt
              }
            };
          })
        ), Ee(null);
        return;
      }
      if (pt.some(
        (me) => me.source === y.id || me.target === y.id
      )) {
        Ee(null);
        return;
      }
      const de = Jw(
        x,
        Nr,
        o
      );
      if (!de) {
        Ee(null);
        return;
      }
      const ee = Yw(
        A,
        de.domainNode
      );
      if (!ee) {
        Ee(null);
        return;
      }
      Ee(Xw(ee));
    },
    [
      pt,
      Nr,
      r,
      Nt,
      o,
      Qn,
      Qe,
      Ee
    ]
  ), er = D(
    (p, y) => {
      if (!r) {
        Jt(""), Ee(null);
        return;
      }
      const T = Qe.get(y.id);
      if (T) {
        const Z = gy(
          o,
          T,
          y.position
        );
        Z !== o && E(Z), Jt(""), Ee(null);
        return;
      }
      if (Nt.has(y.id)) {
        Jt(""), Ee(null);
        return;
      }
      const A = o.find((Z) => Z.id === y.id);
      let O = !1;
      if (A) {
        const Z = ws(
          o,
          y.id,
          y.position
        ), de = pf(
          o,
          y.id,
          Z
        ), ee = js(
          de,
          y.id,
          Z
        );
        O = (A.groupId || "") !== (ee.find((nt) => nt.id === A.id)?.groupId || ""), ee !== o && E(ee);
        const me = Kt(ee, s);
        Du(s, me) || F(me);
      }
      if (Jt(""), O) {
        Ee(null);
        return;
      }
      if (!We) {
        Ee(null);
        return;
      }
      pt.some(
        (Z) => Z.source === We.source && Z.target === We.target
      ) || $e(
        We.source,
        We.target
      ), Ee(null);
    },
    [
      s,
      $e,
      pt,
      r,
      Nt,
      E,
      o,
      We,
      Qe,
      Ee
    ]
  ), kn = D(
    (p) => {
      !r || p.button !== 2 || (At.current = !1, th(p.target) && (Rt.current = {
        pointerId: p.pointerId,
        start: { x: p.clientX, y: p.clientY },
        baseNodeIds: p.ctrlKey || p.metaKey ? [...c] : [],
        moved: !1,
        contextMenuHandled: !1
      }, p.preventDefault(), p.stopPropagation(), p.currentTarget.setPointerCapture?.(p.pointerId)));
    },
    [r, c]
  ), qe = D(
    (p) => {
      l(p, Dr(G, p));
    },
    [G, l]
  ), kr = D(
    (p) => {
      const y = Rt.current;
      !r || !y && !At.current || (p.preventDefault(), p.stopPropagation(), At.current = !1, y && (y.contextMenuHandled = !0));
    },
    [r]
  ), rs = D(
    (p) => {
      const y = Rt.current;
      if (!y || y.pointerId !== p.pointerId || !G || !Bt.current)
        return;
      const T = p.clientX - y.start.x, A = p.clientY - y.start.y;
      if (!y.moved && Math.hypot(T, A) < 5)
        return;
      y.moved = !0, p.preventDefault(), p.stopPropagation();
      const O = Bt.current.getBoundingClientRect();
      Sn(
        nh(
          y.start,
          {
            x: p.clientX,
            y: p.clientY
          },
          O
        )
      );
      const x = rh(
        o,
        Dr(G, y.start),
        Dr(G, {
          x: p.clientX,
          y: p.clientY
        })
      );
      u(oh(y.baseNodeIds, x)), je(""), st(null);
    },
    [G, o, u]
  ), uo = D(
    (p) => {
      const y = Rt.current;
      !y || y.pointerId !== p.pointerId || (Rt.current = null, p.currentTarget.hasPointerCapture?.(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId), Sn(null), At.current = !y.contextMenuHandled, p.preventDefault(), p.stopPropagation(), !y.moved && p.type === "pointerup" && qe({
        x: p.clientX,
        y: p.clientY
      }));
    },
    [qe]
  ), os = D(
    (p) => {
      if (r) {
        if (Be.current) {
          Be.current = !1;
          return;
        }
        u([]), je(""), st(null), !(!("detail" in p) || p.detail !== 2) && (p.preventDefault(), p.stopPropagation(), qe({ x: p.clientX, y: p.clientY }));
      }
    },
    [r, u, qe]
  ), sn = D(
    (p) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), At.current) {
          At.current = !1;
          return;
        }
        qe({ x: p.clientX, y: p.clientY });
      }
    },
    [r, qe]
  ), an = D(
    (p, y) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), Qe.has(y.id)) {
          je(""), bt.has(y.id) || u([y.id]), st({
            nodeId: y.id,
            x: p.clientX,
            y: p.clientY
          });
          return;
        }
        je(""), bt.has(y.id) || u([y.id]), st({
          nodeId: y.id,
          x: p.clientX,
          y: p.clientY
        });
      }
    },
    [r, u, bt, Qe]
  ), _e = zt && o.find((p) => p.id === zt.nodeId) || null, Rn = zt && Qe.get(zt.nodeId) || null, An = !!(_e && Nt.has(_e.id)), tr = _e && o.find(
    (p) => p.id === py(o, _e)
  ) || null, nr = _e ? { x: _e.x, y: _e.y } : void 0;
  function tt() {
    st(null);
  }
  function ss() {
    if (!(!r || !_e)) {
      if (An) {
        Q.info("脚本托管节点不能复制，请在分镜脚本中修改结构"), tt();
        return;
      }
      I(
        _e,
        nr ? { x: nr.x + 34, y: nr.y + 34 } : void 0
      ), tt();
    }
  }
  function rr() {
    if (!r || !_e && !Rn)
      return;
    if (Rn) {
      const y = Rn;
      tt(), Ae([y]);
      return;
    }
    if (!_e)
      return;
    if (An) {
      Q.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"), tt();
      return;
    }
    const p = _e;
    tt(), Ir([p]);
  }
  function Tn() {
    _e && (w(_e), tt());
  }
  function Rr() {
    tr && (w(
      tr,
      Md(_e)
    ), tt());
  }
  function Ar() {
    if (!_e)
      return;
    const p = Gg(_e, o);
    if (!p) {
      tt();
      return;
    }
    he(_e.id, p), Q.success("已恢复脚本生成的提示词"), tt();
  }
  const is = D(
    (p) => {
      r && (p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "move"));
    },
    [r]
  ), lo = D(
    (p) => {
      if (!r || (p.preventDefault(), !G || !m)) return;
      const y = p.dataTransfer.getData(
        "application/shemic-nodetype"
      );
      if (!y) return;
      const T = p.dataTransfer.getData("application/shemic-detail"), A = T ? JSON.parse(T) : void 0, O = G.screenToFlowPosition ? G.screenToFlowPosition({
        x: p.clientX,
        y: p.clientY
      }) : Dr(G, {
        x: p.clientX,
        y: p.clientY
      });
      y === "asset" && A ? m("asset", O, { asset: A }) : y === "power" && A ? m("power", O, { power: A }) : y === "agent" && A ? m("agent", O, { role: A }) : y === "flow" && A ? m("flow", O, { flow: A }) : y === "function" && A ? m("function", O, { functionOption: A }) : m(y, O);
    },
    [G, r, m]
  ), as = D(() => {
    G?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [G]), cs = D(
    (p) => {
      const y = Pn(p);
      Ce(y), G?.zoomTo?.(y, { duration: 120 });
    },
    [G, Ce]
  ), Tr = D(() => {
    const p = Pn(jt + 0.12);
    Ce(p), G?.zoomIn?.({ duration: 140 });
  }, [G, Ce, jt]), ds = D(() => {
    const p = Pn(jt - 0.12);
    Ce(p), G?.zoomOut?.({ duration: 140 });
  }, [G, Ce, jt]), us = D(() => {
    if (r) {
      if (nn.current) {
        nn.current = !1;
        return;
      }
      je(""), st(null);
    }
  }, [r]), Ut = D(
    (p, y) => {
      r && Jt(y.id);
    },
    [r]
  ), ls = D((p, y) => {
    Zt(y.id);
    const T = y.type === "workSpace" ? y.data.sourceNode : null;
    T && si(T) && qy();
  }, []), fs = D(() => {
    Zt("");
  }, []), fo = D(
    (p) => {
      const y = p;
      _t(y), i.x != null && i.y != null && i.zoom != null ? (y.setViewport?.({
        x: i.x,
        y: i.y,
        zoom: i.zoom
      }), Ce(i.zoom)) : Ce(y.getZoom?.() || 1);
    },
    [Ce, i.x, i.y, i.zoom]
  ), ps = D(
    (p, y) => {
      Zn(y.zoom);
    },
    [Zn]
  ), ms = D(
    (p, y) => {
      Ce(y.zoom), V({
        x: y.x,
        y: y.y,
        zoom: y.zoom
      });
    },
    [Ce, V]
  ), gs = D(() => {
    gr((p) => !p);
  }, []), ys = D(() => {
    no((p) => !p);
  }, []), hs = [
    "ws-canvas-wrap",
    Zr ? "is-dragging" : "",
    Xn ? "is-selecting" : "",
    Jr ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ M(
    "section",
    {
      ref: Bt,
      className: hs,
      style: I_(jt),
      onPointerDownCapture: kn,
      onPointerMoveCapture: rs,
      onPointerUpCapture: uo,
      onPointerCancelCapture: uo,
      onContextMenuCapture: kr,
      children: [
        /* @__PURE__ */ d(
          qu,
          {
            nodes: Nr,
            edges: ao,
            onlyRenderVisibleElements: !0,
            nodeTypes: sh,
            edgeTypes: ih,
            onNodesChange: Cr,
            onEdgesChange: $t,
            onConnect: vr,
            onConnectStart: et,
            onConnectEnd: xr,
            isValidConnection: co,
            connectionLineStyle: ah,
            onEdgeClick: on,
            onNodeClick: us,
            onNodeContextMenu: an,
            onNodeDragStart: Ut,
            onNodeDrag: ns,
            onNodeDragStop: er,
            onDragOver: is,
            onDrop: lo,
            onNodeMouseEnter: ls,
            onNodeMouseLeave: fs,
            onInit: fo,
            onMove: ps,
            onMoveEnd: ms,
            onPaneClick: os,
            onPaneContextMenu: sn,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: dh,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: to,
            snapGrid: ch,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: uh,
            fitView: i.zoom == null,
            fitViewOptions: lh,
            children: r && eo && o.length > 0 ? /* @__PURE__ */ d(
              Gu,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeClassName: M_,
                nodeColor: D_
              }
            ) : null
          }
        ),
        Xn ? /* @__PURE__ */ d(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: Xn,
            "aria-hidden": "true"
          }
        ) : null,
        r ? /* @__PURE__ */ d(
          um,
          {
            showMiniMap: eo,
            snapToGrid: to,
            zoom: jt,
            onToggleMiniMap: gs,
            onToggleSnap: ys,
            onReset: as,
            onZoomIn: Tr,
            onZoomOut: ds,
            onZoomChange: cs
          }
        ) : null,
        r && o.length === 0 ? /* @__PURE__ */ M("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ M("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ d(Qa, { size: 16 }),
            /* @__PURE__ */ d("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ d("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && zt && (_e || Rn) ? /* @__PURE__ */ d(
          dm,
          {
            point: zt,
            canShowDetail: !!(_e && vt(_e)),
            canCopy: !!(_e && !An),
            canDelete: !!(Rn || !An),
            canEditStructure: !!(tr && tr.id !== _e?.id),
            canResetStoryboardPrompt: !!(_e && gd(_e)),
            onClose: tt,
            onCopy: ss,
            onDelete: rr,
            onDetail: Tn,
            onEditStructure: Rr,
            onResetStoryboardPrompt: Ar
          }
        ) : null
      ]
    }
  );
});
function wh({
  request: e,
  onClose: t
}) {
  const [n, r] = K(!1);
  async function o() {
    if (n)
      return;
    r(!0);
    const s = e.onConfirm;
    t();
    try {
      Promise.resolve(s()).catch((i) => {
        Q.error(i instanceof Error ? i.message : "操作失败");
      });
    } catch (i) {
      Q.error(i instanceof Error ? i.message : "操作失败");
    }
  }
  return /* @__PURE__ */ d(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ M(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ M("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ d("h3", { children: e.title }),
              /* @__PURE__ */ d("p", { children: e.description })
            ] }),
            /* @__PURE__ */ M("div", { className: "ws-confirm-actions", children: [
              /* @__PURE__ */ d("button", { type: "button", disabled: n, onClick: t, children: "取消" }),
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: e.tone === "danger" ? "is-danger" : "is-primary",
                  disabled: n,
                  onClick: () => {
                    o();
                  },
                  children: n ? "处理中..." : e.confirmText || "确认"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function _h(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function bh(e, t, n) {
  const r = e[t];
  if (!r)
    return e;
  const o = Object.keys(n);
  if (!o.some(
    (a) => Object.prototype.hasOwnProperty.call(r, a)
  ))
    return e;
  const s = { ...r };
  for (const a of o)
    delete s[a];
  const i = { ...e };
  return Object.keys(s).length === 0 ? delete i[t] : i[t] = s, i;
}
function Ma({
  canvas: e,
  sourceNodeId: t,
  successfulNodeIds: n,
  assetCate: r,
  powers: o
}) {
  let s = e;
  const i = Math.max(2, n.size + 1);
  for (let a = 0; a < i; a += 1) {
    const c = {
      ...s,
      nodes: my(
        s.nodes,
        t,
        n
      )
    };
    if (s = Ks({
      canvas: c,
      assetCate: r,
      powers: o
    }), !s.nodes.some((l) => {
      const m = l.storyboardItem;
      return !m || m.sourceNodeId !== t || !n.has(l.id) ? !1 : !!(m.stale || m.sourceSignature && m.resultSourceSignature !== m.sourceSignature);
    }))
      break;
  }
  return s;
}
function Wd(e, t, n, r = e.length) {
  const o = Math.min(
    jn,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: ve(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: o },
      (s, i) => e[i] ? Xd(e[i], i) : Yd(i)
    )
  };
}
function Nh(e, t, n, r) {
  if (t < 0 || t >= jn || (e?.frames.length || 0) > jn)
    return null;
  const o = e || Wd([], null, r, t + 1), s = Math.min(
    jn,
    Math.max(2, o.frames.length, t + 1)
  ), i = Xd(n, t);
  return {
    ...o,
    frames: Array.from(
      { length: s },
      (a, c) => o.frames[c] || Yd(c)
    ).map(
      (a, c) => c === t ? {
        ...a,
        image: i.image,
        status: "success",
        error: "",
        assetID: i.assetID,
        assetVersionID: i.assetVersionID
      } : a
    )
  };
}
function Yd(e) {
  const t = e + 1;
  return {
    id: `frame-${String(t).padStart(2, "0")}`,
    order: t,
    title: `画面 ${String(t).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "pending",
    image: "",
    error: "",
    assetID: 0,
    assetVersionID: 0
  };
}
function Xd(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: Ul(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.id,
    assetVersionID: e.versionID
  };
}
function fn(e, t, n) {
  const r = ge(
    t?.output,
    t?.asset?.version?.content,
    t?.version?.content,
    t?.result?.output,
    t?.result?.asset?.version?.content,
    t?.data?.output,
    t?.data?.content,
    t?.data?.result,
    t?.data
  ), o = e.type === "agent" && r != null ? Te(r) : Bo(r) || ut(r), s = e.type === "power" && Kn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? Hr([
    r,
    t?.asset?.version?.content,
    t?.version?.content,
    t?.result,
    o
  ]) : null, i = e.type === "power" && Gl(e.power, e.kind, e.outputType) ? fi([
    r,
    t?.asset?.version?.content,
    t?.version?.content,
    t?.result,
    o
  ]) : null, a = ve(
    String(t?.asset?.kind || ""),
    String(t?.kind || ""),
    Zo(e, o)
  ), c = bn(o, a), u = ht(o, ""), l = ve(
    i?.title,
    s?.title
  ), m = Mr(n), I = Mr(i?.summary) || Mr(s?.summary) || Mr(c.text) || Mr(u) || (m ? `已按提示生成：${m}` : "生成完成");
  return {
    ...l && e.titleMode === "auto" ? { title: l } : {},
    description: I,
    resultRef: vi(t),
    resultOutput: i || s || o,
    asset: t?.asset || e.asset,
    kind: t?.asset?.kind || e.power?.kind || e.kind
  };
}
function Mr(e) {
  const t = ve(e);
  return Yt(t) ? "" : t;
}
function Ws(e, t) {
  const n = t.version?.content;
  return {
    ...fn(
      e,
      {
        asset: t,
        output: n
      },
      ac(n)
    ),
    asset: t
  };
}
function Pi(e) {
  return ap(e.composerDraft);
}
function Ih(e) {
  const t = Pi(e);
  return e.type !== "power" && e.type !== "agent" ? e : {
    ...e,
    composerDraft: {
      ...e.composerDraft,
      prompt: t.prompt,
      promptContent: t.promptContent,
      paramValues: t.paramValues,
      selectedTargetId: t.selectedTargetId,
      multiImageMode: t.multiImageMode
    }
  };
}
function Fi(e, t) {
  const n = Km(e, t);
  return {
    ...n,
    id: Sh(e, t, n.id)
  };
}
function Sh(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const o = String(t.interaction?.interaction?.id || "");
  if (o)
    return `${e.id}:${o}`;
  const s = ko({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return s ? `${e.id}:feedback:${cu(s)}` : n;
}
function Ys(e, t) {
  const n = Number(t.prompt?.approval?.id || 0), r = e.findIndex(
    (o) => o.id === t.id || n > 0 && Number(o.prompt?.approval?.id || 0) === n
  );
  return r < 0 ? [...e, t] : e.map((o, s) => {
    if (s !== r)
      return o;
    const i = o.status === "submitted", a = o.values || o.prompt?.values || t.values;
    return {
      ...o,
      title: t.title,
      description: t.description,
      prompt: {
        ...t.prompt,
        values: a || t.prompt.values || {}
      },
      values: o.values,
      status: i ? o.status : t.status,
      submittedAt: o.submittedAt
    };
  });
}
const Da = 3600 * 1e3, Zd = 2e3, Ch = 3;
async function ks(e) {
  const t = tw(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = !1, o = "0-0";
  const s = {
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: bi(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s);
  let i = await Ep({
    projectId: e.projectId,
    assetCateId: Number(e.assetCate.id || 0),
    startNodeId: e.startNode.id,
    requestId: t,
    singleNode: e.singleNode,
    executionScope: e.executionScope,
    canvas: s,
    runInput: {
      ...e.runInput || {},
      start_node_id: e.startNode.id
    }
  });
  for (let a = 0; a < 8; a += 1) {
    const c = await vh(
      e,
      i,
      o,
      (m) => {
        const I = uu(
          e,
          m,
          n
        );
        nu(e, m), r = r || I > 0;
      },
      () => r,
      (m) => {
        o = m;
      }
    );
    if (e.canvasRun = c, ur(e, c), Oo(
      e,
      c,
      r
    ) && (c.status === "running" || c.status === "pending")) {
      Q.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const u = Number(c.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      c_(
        c,
        uw(c, u)
      )
    );
    const l = String(c.status || "").toLowerCase();
    if (l !== "waiting") {
      if (ru(e, c), l === "fail" || l === "error")
        throw new Error(Dc(c));
      if (l === "canceled" || l === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await ow(e, c), i = {
      ...c,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
async function vh(e, t, n, r, o, s) {
  let i = Or(
    e,
    gn(t)
  );
  if (i = Zs(e, i), r(i.node_results || []), ur(e, i), i.status !== "running" && i.status !== "pending" || !i.run_id && !i.request_id)
    return i;
  const a = String(i.request_id || ""), c = new AbortController(), u = Date.now() + Da;
  let l = !1, m = null;
  const I = window.setTimeout(() => {
    l = !0, c.abort();
  }, Da);
  try {
    const N = await Dh(
      e,
      a,
      n,
      (w) => {
        w.stream_id && s(w.stream_id);
        const E = Ph(w, e);
        if (!E) {
          tu(e, w);
          return;
        }
        i = Or(
          e,
          Js(i, E)
        ), r(i.node_results || []), ur(e, i);
      },
      c.signal
    );
    N && (i = Or(
      e,
      Js(i, N)
    ), ur(e, i)), r(i.node_results || []);
  } catch (N) {
    m = N;
  } finally {
    window.clearTimeout(I), c.abort(), e.runningNodeBatcher?.flush();
  }
  if (i = Zs(e, i), Xs(e, i) && !Oo(
    e,
    i,
    o()
  ))
    try {
      i = await xh(
        e,
        i,
        a,
        r,
        o,
        u
      );
    } catch (N) {
      throw m instanceof Error && !l ? m : N;
    }
  if (!Xs(e, i) || Oo(
    e,
    i,
    o()
  ))
    return i;
  throw m instanceof Error && !l ? m : new Error("画布仍在运行，请稍后刷新查看结果");
}
async function xh(e, t, n, r, o, s) {
  let i = t, a = 0;
  for (; ; ) {
    if (Date.now() >= s)
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    try {
      i = await Rh(
        e,
        i,
        n,
        r
      ), a = 0;
    } catch (c) {
      if (a += 1, a >= Ch)
        throw c;
    }
    if (!Xs(e, i) || Oo(
      e,
      i,
      o()
    ))
      return i;
    await Mh(
      Math.min(Zd, s - Date.now())
    );
  }
}
function Oo(e, t, n) {
  return !!(e.singleNode && !Qd(e) && n && !kh(t));
}
function kh(e) {
  return String(e.status || "").trim().toLowerCase() === "waiting" || eu(e) ? !0 : [
    e.pending_node,
    e.output,
    ...e.node_results || []
  ].some((r) => !!pn(r));
}
async function Rh(e, t, n, r) {
  let o = t;
  const s = Number(o.run_id || 0), i = String(o.request_id || n || "");
  if (!s && !i)
    return o;
  const a = await Op({
    projectId: e.projectId,
    runId: s,
    requestId: i
  });
  return o = Or(
    e,
    Js(o, gn(a))
  ), o = Zs(e, o), r(o.node_results || []), ur(e, o), o;
}
function Xs(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : !Jd(e, t);
}
function Jd(e, t) {
  return Xh(
    t
  ) ? !0 : e.singleNode ? (t.node_results || []).some(
    (n) => n.node_key === e.startNode.id && Yr(Wt(n))
  ) : !1;
}
function Zs(e, t) {
  return Ah(e, t) ? {
    ...t,
    status: Th(t.node_results || [])
  } : t;
}
function Ah(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : Jd(e, t);
}
function Th(e) {
  for (const t of e) {
    const n = Wt(t);
    if (n === "fail")
      return "fail";
    if (n === "canceled" || n === "cancelled")
      return "canceled";
  }
  return "success";
}
function Mh(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function Dh(e, t, n, r, o) {
  let s = null;
  return await ad({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: o,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if (Eh(i))
          throw new Error(i.msg || "画布流返回失败");
        s = Or(
          e,
          gn(i.output || {})
        );
      }
    }
  }), s;
}
function Eh(e) {
  return Number(e.status || 0) === 2;
}
function Or(e, t) {
  if (!e.singleNode || Qd(e))
    return t;
  const n = (t.node_results || []).find(
    (c) => c.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const o = eu(t), s = ge(n?.output, t.output), i = {
    execution_id: Number(t.execution_id || n?.execution_id || 0),
    node_key: e.startNode.id,
    node_type: e.startNode.type,
    node_run_id: Number(n?.node_run_id || 0),
    run_id: Number(t.run_id || n?.run_id || 0),
    request_id: String(t.request_id || n?.request_id || ""),
    status: r || "success",
    error: n?.error || t.error,
    output: s,
    asset: n?.asset,
    version: n?.version,
    result: {
      ...n?.result || {},
      run_id: t.run_id,
      request_id: t.request_id,
      flow_run_id: t.flow_run_id,
      release_id: t.release_id,
      status: r || "success",
      error: n?.error || t.error,
      output: s,
      approval: o
    },
    approval: ge(n?.approval, o),
    interaction: ge(
      n?.interaction,
      pn(n?.result),
      pn(t.pending_node),
      pn(t.output)
    ),
    persists_result: !!n?.persists_result,
    agent_run_id: Number(n?.agent_run_id || 0)
  }, a = [
    ...(t.node_results || []).filter(
      (c) => c.node_key !== e.startNode.id
    ),
    i
  ];
  return {
    ...t,
    node_results: a,
    pending_node: r === "waiting" ? {
      ...i,
      status: "waiting",
      approval: i.approval,
      interaction: i.interaction
    } : t.pending_node
  };
}
function Qd(e) {
  return e.singleNode && e.startNode.type === "group";
}
function eu(e) {
  const t = e.output;
  return (Array.isArray(e.approvals) ? e.approvals : t && typeof t == "object" && Array.isArray(t.approvals) ? t.approvals : t && typeof t == "object" && Array.isArray(t.data?.approvals) ? t.data.approvals : []).find(
    (r) => r && typeof r == "object" && (r.status === "pending" || r.decision === "pending")
  );
}
function Ph(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return gn(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const o = Fh(n, {
    requireDisplayableResult: r !== "waiting",
    node: t?.nodes.find(
      (s) => s.id === String(n.node_key || n.node_id || "")
    )
  });
  return o ? {
    execution_id: Number(n.execution_id || 0),
    request_id: String(e.request_id || n.parent_request_id || ""),
    run_id: Number(n.parent_run_id || n.run_id || 0),
    flow_run_id: Number(n.parent_flow_run_id || n.flow_run_id || 0),
    release_id: Number(n.release_id || 0),
    status: r === "waiting" ? "waiting" : "running",
    node_results: [o],
    pending_node: r === "waiting" ? o : null
  } : null;
}
function Fh(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, o = r && typeof r == "object" ? r : {}, s = vf(o, n);
  if (!s)
    return null;
  const i = s;
  return t.requireDisplayableResult && !zh(e, i, t.node) ? null : {
    ...s,
    node_key: n,
    execution_id: Number(
      e.execution_id || s.execution_id || o.execution_id || 0
    ),
    node_type: String(e.node_type || s.node_type || ""),
    node_run_id: Number(e.node_run_id || s.node_run_id || 0),
    run_id: Number(
      e.run_id || s.run_id || o.run_id || 0
    ),
    request_id: String(
      e.request_id || s.request_id || o.request_id || ""
    ),
    child_run_id: Number(
      e.child_run_id || s.child_run_id || o.child_run_id || 0
    ),
    child_request_id: String(
      e.child_request_id || s.child_request_id || o.child_request_id || ""
    ),
    status: String(e.status || s.status || ""),
    error: String(
      e.error || s.error || o.error || ""
    ),
    output: s.output ?? o.output ?? r,
    asset: s.asset ?? o.asset,
    version: s.version ?? o.version ?? s.asset?.version,
    result: s.result ?? s,
    approval: ge(
      s.approval,
      Oh(e, i)
    ),
    interaction: ge(
      e.interaction,
      s.interaction,
      pn(s)
    ),
    persists_result: !!(e.persists_result || s.persists_result),
    agent_run_id: Number(
      e.agent_run_id || s.agent_run_id || o.agent_run_id || 0
    ),
    source_signature: s.source_signature
  };
}
function Oh(e, t) {
  const n = ge(
    e.approval,
    t.approval,
    t.result?.approval
  );
  if (n && typeof n == "object")
    return n;
  const r = Number(
    ge(
      e.approval_id,
      t.approval_id,
      t.result?.approval_id
    ) || 0
  );
  return r > 0 ? { id: r } : void 0;
}
function pn(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const o of ["result", "pending_node"]) {
    const s = pn(n[o], t + 1);
    if (s)
      return s;
  }
  const r = Array.isArray(n.node_results) ? n.node_results : [];
  for (const o of r) {
    const s = pn(o, t + 1);
    if (s)
      return s;
  }
}
function zh(e, t, n) {
  return e.persists_result || String(e.node_type || "") !== "function" || String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ) === "display" ? !0 : !!(t.asset || t.version || t.asset?.version || t.data?.asset || t.data?.version);
}
function tu(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.output || {}, r = String(n.event || ""), o = String(n.node_key || n.node_id || "");
  if (o) {
    if (r !== "node_output" && e.runningNodeBatcher?.flush(), r === "node_started") {
      e.setRunningNode((s) => ({
        ...s,
        [o]: {
          nodeId: o,
          title: String(n.node_name || n.node_key || o),
          startedAt: Date.now(),
          status: "running",
          progress: Math.max(s[o]?.progress || 0, 18),
          agent: s[o]?.agent
        }
      }));
      return;
    }
    if (r === "node_output") {
      const s = (i) => {
        const a = i[o];
        if (!a || a.status !== "running")
          return i;
        const c = Ea(n.output), u = String(n.node_type || "").toLowerCase(), l = u === "power", m = u === "agent", I = String(
          c.semantic_event || c.event || ""
        ).toLowerCase(), N = Ea(c.meta), w = l && I === "status" && !!String(N.output_type || ""), E = w && !!(c.json && typeof c.json == "object"), F = l && (I === "audio_ready" || E || Vl(c)), $ = Number(N.generated_count || 0), V = w ? Math.max(
          a.generatedCount || 0,
          Number.isFinite($) ? $ : 0
        ) : a.generatedCount, q = l && typeof c.text == "string" && (I === "delta" || !I) ? c.text : "", Y = F ? c : a.streamOutput;
        return {
          ...i,
          [o]: {
            ...a,
            progress: Math.max(a.progress, 72),
            streamText: q ? `${a.streamText || ""}${q}` : a.streamText,
            streamOutput: Y,
            streamStarted: a.streamStarted || !!q || !!Y,
            ...w ? { streamStarted: !0, generatedCount: V } : {},
            agent: m ? wm(a.agent, c) : a.agent
          }
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s) : e.setRunningNode(s);
    }
  }
}
function jh(e, t, n, r) {
  const o = t.output || {}, s = String(o.event || ""), i = String(o.node_key || o.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (s === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    tu(e, t);
  }
}
function Ea(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Js(e, t) {
  const n = [...e.node_results || []];
  for (const r of t.node_results || []) {
    const o = jo(r), s = n.findIndex(
      (i) => jo(i) === o
    );
    s >= 0 ? n[s] = r : n.push(r);
  }
  return {
    ...e,
    ...t,
    execution_scope: t.execution_scope || e.execution_scope,
    node_runs: t.node_runs?.length ? t.node_runs : e.node_runs,
    execution_plan: t.execution_plan || e.execution_plan,
    node_results: n,
    pending_node: t.status === "waiting" ? t.pending_node || e.pending_node : t.pending_node || null
  };
}
function nu(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => Yr(r.status)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => Bh(e, r, n)
  ), window.setTimeout(() => {
    e.setRunningNode?.((r) => {
      let o = !1, s = r;
      for (const i of n) {
        const a = i.node_key, c = s[a];
        !c || c.status === "running" || (s === r && (s = { ...r }), delete s[a], o = !0);
      }
      return o ? s : r;
    });
  }, 650));
}
function Bh(e, t, n) {
  let r = !1;
  const o = { ...t };
  for (const s of n) {
    const i = s.node_key, a = e.nodes.find((u) => u.id === i);
    if (s.status === "canceled") {
      o[i] && (delete o[i], r = !0);
      continue;
    }
    if (s.status === "waiting") {
      o[i] = {
        nodeId: i,
        title: a?.title || i,
        startedAt: t[i]?.startedAt || Date.now(),
        progress: 92,
        status: "waiting"
      }, r = !0;
      continue;
    }
    const c = o[i];
    c && (o[i] = {
      ...c,
      progress: 100,
      status: s.status === "success" ? "success" : "error",
      agent: a?.type === "agent" ? _m(s.output) : c.agent
    }, r = !0);
  }
  return r ? o : t;
}
function ru(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((o) => {
      const s = Rs(
        e,
        t,
        o,
        n
      );
      if (s.length === 0)
        return o;
      const i = { ...o };
      for (const a of s)
        delete i[a];
      return i;
    });
    return;
  }
  const r = t.status === "success" ? "success" : "error";
  e.setRunningNode((o) => {
    let s = !1;
    const i = { ...o }, a = Rs(
      e,
      t,
      o,
      n
    );
    for (const c of a) {
      const u = i[c];
      u && (i[c] = {
        ...u,
        progress: r === "success" ? 100 : Math.max(u.progress, 92),
        status: r
      }, s = !0);
    }
    return s ? i : o;
  }), window.setTimeout(
    () => {
      e.setRunningNode?.((o) => {
        let s = !1, i = o;
        const a = Rs(
          e,
          t,
          o,
          n
        );
        for (const c of a) {
          const u = i[c];
          !u || u.status === "running" || (i === o && (i = { ...o }), delete i[c], s = !0);
        }
        return s ? i : o;
      });
    },
    r === "success" ? 650 : 1200
  );
}
function Rs(e, t, n, r) {
  const o = Xo(t), s = new Set(
    Uh(e, t).filter(
      (i) => i === o || !r || r.has(i)
    )
  );
  return Object.keys(n).filter((i) => s.has(i));
}
function $h(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const o = Qs(t), s = /* @__PURE__ */ new Map(), i = Xo(t);
  let a = !1, c = "";
  for (const m of t.node_runs || []) {
    const I = String(m.node_key || "");
    if (!I || o.has(I) || n && !n.has(I))
      continue;
    a = !0;
    const N = String(m.status || "").trim().toLowerCase();
    N === "running" ? s.set(I, "running") : N === "waiting" ? s.set(I, "waiting") : N === "pending" && !c && (c = I);
  }
  const u = String(t.pending_node?.node_key || "");
  if (u && !o.has(u) && (!n || n.has(u)) && s.set(u, "waiting"), s.size === 0 && c && s.set(c, "running"), s.size === 0 && !a) {
    const m = String(t.start_node_id || "");
    m && !o.has(m) && (!n || n.has(m)) && s.set(
      m,
      r === "waiting" ? "waiting" : "running"
    );
  }
  if (i && s.set(
    i,
    r === "waiting" ? "waiting" : "running"
  ), s.size === 0)
    return;
  const l = Date.parse(String(t.created_at || ""));
  e.setRunningNode((m) => {
    let I = !1;
    const N = { ...m };
    for (const [w, E] of s) {
      const F = e.nodes.find((q) => q.id === w), $ = w === i;
      if (!F && !$)
        continue;
      const V = m[w];
      V?.status !== E && (N[w] = {
        nodeId: w,
        title: $ ? `${e.startNode.title || "分镜脚本"}制作区` : F?.title || w,
        startedAt: V?.startedAt || (Number.isFinite(l) ? l : Date.now()),
        progress: E === "waiting" ? 92 : V?.progress || 0,
        status: E
      }, I = !0);
    }
    return I ? N : m;
  });
}
function Uh(e, t) {
  const n = new Set(zo(t)), r = Xo(t);
  return r && n.add(r), e.singleNode && n.add(e.startNode.id), [...n];
}
function Xo(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? Wo(t) : "";
}
function Vh(e, t) {
  const n = Number(e.asset_cate_id || 0);
  return n === 0 || n === Number(t || 0);
}
function zo(e) {
  const t = /* @__PURE__ */ new Set(), n = String(e.start_node_id || "");
  n && t.add(n);
  for (const r of e.node_runs || [])
    r.node_key && t.add(r.node_key);
  for (const r of e.node_results || [])
    r.node_key && t.add(r.node_key);
  for (const r of e.execution_plan?.nodes || [])
    r.id && t.add(r.id);
  return [...t];
}
function Qs(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Yr(Wt(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function Lh(e) {
  return su(e).map((t) => t.run);
}
function Kh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    Ac(n) && t.set(On(n), n);
  return [...t.values()];
}
function qh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const o of ou(n))
        t.set(o, r);
  }
  return t;
}
function Gh(e, t) {
  for (const n of ou(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function ou(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function su(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const s of zo(r))
      t.has(s) || (t.add(s), o.add(s));
    o.size !== 0 && Ac(r) && n.push({ run: r, managedNodeIds: o });
  }
  return n;
}
function As(e) {
  return e.map(iu).filter((t) => !!t);
}
function iu(e) {
  const t = gn(e);
  return t.run_id || t.request_id ? t : null;
}
function Hh(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Number(r.run_id || 0);
    o > 0 && !Wh(r, t) && n.add(o);
  }
  return [...n];
}
function Wh(e, t) {
  const n = Number(e.asset_cate_id || 0);
  return (n ? [t[String(n)]].filter(
    (o) => !!o
  ) : Object.values(t)).some(
    (o) => au(e, o)
  );
}
function au(e, t) {
  const n = String(e.status || "").trim().toLowerCase();
  if (!["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
    n
  ))
    return !1;
  const r = new Map(t.nodes.map((s) => [s.id, s]));
  if (!e.single_node) {
    const s = (e.node_results || []).filter(
      (a) => a.node_key
    );
    if (s.length === 0)
      return !1;
    let i = 0;
    for (const a of s) {
      const c = r.get(a.node_key);
      if (c && (i += 1, !Pa(c.resultRef, e, a)))
        return !1;
    }
    return i > 0;
  }
  const o = r.get(String(e.start_node_id || ""));
  return Pa(o?.resultRef, e);
}
function Pa(e, t, n) {
  if (!e)
    return !1;
  const r = Number(t.execution_id || 0), o = Number(e.execution_id || 0);
  if (r > 0 && o > 0 && o >= r)
    return !0;
  const s = Number(t.run_id || 0), i = Number(e.run_id || 0);
  if (s > 0 && i > 0 && i >= s)
    return !0;
  const a = Number(n?.node_run_id || 0), c = Number(e.node_run_id || 0);
  if (a > 0 && c > 0 && c >= a)
    return !0;
  const u = String(n?.request_id || t.request_id || "");
  return !!(u && e.request_id === u);
}
function Fa(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(On(r), r);
  for (const r of t)
    n.set(On(r), r);
  return [...n.values()].sort(Yh).slice(0, 50);
}
function Yh(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = Oa(t) - Oa(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Oa(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function Xh(e) {
  const t = Zh(e);
  if (t.size === 0)
    return !1;
  const n = /* @__PURE__ */ new Set();
  for (const r of e.node_results || []) {
    const o = Wt(r);
    if (o === "waiting" || o === "running" || o === "pending")
      return !1;
    Yr(o) && n.add(r.node_key);
  }
  for (const r of t)
    if (!n.has(r))
      return !1;
  return !0;
}
function Zh(e) {
  const t = /* @__PURE__ */ new Set();
  for (const o of e.execution_plan?.nodes || [])
    Jh(o) && t.add(o.id);
  if (t.size > 0)
    return t;
  const n = /* @__PURE__ */ new Set();
  for (const o of e.node_runs || [])
    o.node_key && n.add(o.node_key);
  if (n.size > 0)
    return n;
  const r = String(e.start_node_id || "");
  return r && (e.node_results || []).some((o) => o.node_key === r) ? /* @__PURE__ */ new Set([r]) : /* @__PURE__ */ new Set();
}
function Jh(e) {
  return ["asset", "power", "agent", "flow"].includes(String(e.type || "")) ? !0 : e.type !== "function" ? !1 : e.function_key === "save" || e.function_key === "display";
}
function Qh(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((o) => o.id === n);
    if (r)
      return r;
  }
  return t.find(i_) || t[0] || null;
}
function ew(e, t) {
  return [
    e.run_id || e.request_id || "",
    jo(t)
  ].join(":");
}
function Yr(e) {
  const t = String(e || "").trim().toLowerCase();
  return t === "success" || t === "fail" || t === "canceled" || t === "cancelled";
}
function Wt(e) {
  if (!e)
    return "";
  const t = String(e.status || e.result?.status || "").trim().toLowerCase();
  return t === "error" ? "fail" : t === "cancelled" ? "canceled" : t;
}
function tw(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function nw(e, t, n) {
  const r = typeof n == "string" ? n : ko(n), o = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${o}-${cu(r)}`.slice(
    0,
    96
  );
}
function cu(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function ur(e, t, n) {
  rw(e, t), $h(e, t, n);
}
function rw(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((c) => c.id === n.node_key);
  if (!r)
    return;
  const o = Oi(n, r);
  if (!o)
    return;
  const s = Fi(r, o), i = Bn(r), a = Ys(
    i,
    s
  );
  if (ko(i) !== ko(a)) {
    const c = {
      ...r,
      feedbackRequests: a
    };
    e.nodes = e.nodes.map(
      (u) => u.id === r.id ? c : u
    ), e.onNodeResult(r.id, { feedbackRequests: a });
  }
  e.setRunningNode?.((c) => ({
    ...c,
    [r.id]: {
      nodeId: r.id,
      title: r.title,
      startedAt: c[r.id]?.startedAt || Date.now(),
      progress: 92,
      status: "waiting"
    }
  }));
}
async function ow(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const o = Oi(n, r);
  if (!o || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const s = await e.requestFlowFeedback({ node: r, prompt: o });
  return du(
    e.projectId,
    t,
    n,
    o,
    s
  );
}
async function du(e, t, n, r, o) {
  return r.interaction ? Bp({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: o
  }) : Fp({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: o
  });
}
function sw(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const o = r.pending_node;
    if (!o || o.node_key !== t.id)
      continue;
    const s = Oi(o, t);
    if (!s)
      continue;
    if (Fi(t, s).id === n.id)
      return { run: r, pending: o, prompt: s };
  }
  return null;
}
function Oi(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : pn(e);
  if (n?.interaction?.id)
    return dd({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const o = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, s = ge(
      e.approval,
      e.result?.approval,
      e.output?.approval
    );
    s && !Array.isArray(o.approvals) && (o.approvals = [s]);
    const i = Hm(o);
    return Wm(i);
  }
  return Xm(
    pu(e),
    t.title
  );
}
function uu(e, t, n) {
  let r = 0;
  const o = new Map(e.nodes.map((s) => [s.id, s]));
  for (const s of t) {
    const i = o.get(s.node_key), a = Wt(s);
    if (!i || !Yr(a))
      continue;
    const c = jo(s);
    if (a === "success" && c && n?.has(c))
      continue;
    const u = cw(e, i, s);
    e.onNodeResult(i.id, u), c && n?.add(c), a === "success" && (r += 1);
    const l = {
      ...i,
      ...u
    };
    o.set(i.id, l), e.nodes = e.nodes.map(
      (m) => m.id === i.id ? l : m
    ), a === "success" && u.asset && e.onAssetCreated(u.asset), a === "success" && e.requestNodeTitle?.(l, s);
  }
  return r;
}
function iw(e, t) {
  const n = Pi(e).prompt.trim(), o = (t ? Cu(e.id, t.nodes, t.edges) : null)?.text.trim() || "", s = [n, o ? `上游内容：
${o}` : ""].filter(Boolean).join(`

`);
  return Array.from(s).slice(0, Qy).join("");
}
function aw(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || Wt(t) !== "success" || fu(t) <= 0 || !lu(e) ? !1 : Kn(e.power, e.kind, e.outputType).viewMode !== "storyboard";
}
function lu(e) {
  const t = Number(e.nodeNo || 0);
  return t > 0 && e.title.trim() === jc(e, t).trim();
}
function fu(e) {
  const t = e, n = [
    t.version_id,
    t.versionId,
    t.version?.id,
    t.asset?.version_id,
    t.asset?.versionId,
    t.asset?.version?.id,
    t.result?.version_id,
    t.result?.versionId,
    t.result?.version?.id,
    t.result?.asset?.version_id,
    t.result?.asset?.version?.id,
    t.output?.version_id,
    t.output?.version?.id,
    t.output?.asset?.version_id,
    t.output?.asset?.version?.id,
    t.data?.version_id,
    t.data?.version?.id,
    t.data?.asset?.version_id,
    t.data?.asset?.version?.id
  ];
  for (const r of n) {
    const o = Number(r || 0);
    if (Number.isInteger(o) && o > 0)
      return o;
  }
  return 0;
}
function jo(e) {
  return [
    e.node_key,
    e.execution_id || "",
    e.request_id || "",
    e.node_run_id || "",
    e.child_run_id || "",
    e.status || "",
    e.source_signature || "",
    Number(
      e.version?.id || e.asset?.version?.id || e.result?.version?.id || 0
    ),
    Number(e.asset?.id || e.result?.asset?.id || 0)
  ].join(":");
}
function cw(e, t, n) {
  const r = pu(n), o = Wt(n);
  if (o === "fail")
    return Ts(t, {
      resultRef: vi(r),
      runError: xf(n)
    });
  if (o === "canceled" || o === "cancelled")
    return Ts(t, {
      runError: ""
    });
  const s = Cm({
    result: r,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), i = (a) => Ts(
    t,
    dw(
      t,
      a,
      n.source_signature
    )
  );
  return i(s ? {
    ...fn(
      t,
      vm(r, s),
      "后端执行结果"
    ),
    runError: ""
  } : {
    ...fn(t, r, "后端执行结果"),
    runError: ""
  });
}
function dw(e, t, n) {
  const r = e.storyboardItem, o = String(n || "").trim();
  if (!r || !o)
    return t;
  const s = String(r.sourceSignature || "").trim();
  return {
    ...t,
    storyboardItem: {
      ...r,
      resultSourceSignature: o,
      stale: s ? o !== s : !!r.stale
    }
  };
}
function Ts(e, t) {
  const n = Bn(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function pu(e) {
  return {
    ...e.result && typeof e.result == "object" ? e.result : {},
    execution_id: e.execution_id || e.result?.execution_id,
    run_id: e.run_id || e.result?.run_id,
    request_id: e.request_id || e.result?.request_id,
    node_run_id: e.node_run_id || e.result?.node_run_id,
    child_run_id: e.child_run_id || e.result?.child_run_id,
    child_request_id: e.child_request_id || e.result?.child_request_id,
    status: e.status || e.result?.status,
    error: e.error || e.result?.error,
    output: e.output ?? e.result?.output,
    asset: e.asset || e.result?.asset,
    version: e.version || e.result?.version || e.asset?.version,
    agent_run_id: e.agent_run_id || e.result?.agent_run_id
  };
}
function uw(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? Dc(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function lw(e) {
  const t = fw(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await Vp({
    projectId: e.projectId,
    assetCateId: t,
    name: e.name,
    kind: e.kind,
    content: e.content,
    runId: Number(e.runRef?.run_id || 0),
    nodeRunId: Number(e.runRef?.node_run_id || 0),
    releaseId: Number(e.runRef?.release_id || 0),
    nodeKey: e.nodeKey,
    requestId: e.requestId,
    source: e.source
  }), r = e.previousAsset || e.previousAssets?.find((o) => o.id === n.id) || null;
  return ln(n, r);
}
function fw(e) {
  return Math.max(0, Number(e || 0));
}
function qn(e) {
  const t = Xt(e), n = bn(
    t,
    Zo(e, t)
  );
  return yn(n) || (n.text = ht(t, "")), n;
}
function Zo(e, t) {
  const n = vw(t);
  return e.type === "power" ? ve(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : ve(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function So(e) {
  const t = qn(e);
  if (yn(t))
    return t;
  const n = bn(
    Xt(e),
    String(e.kind || e.power?.kind || "")
  );
  return yn(n) || (n.text = ht(Xt(e), "")), n;
}
function zi(e) {
  return mw(e) || bw(e);
}
function dn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : Xt(e);
}
function Ms(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    dn(e)
  ];
}
function pw(e) {
  const t = e.composerDraft?.paramValues || {};
  return ve(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function mw(e) {
  return gw(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function gw(...e) {
  for (const t of e) {
    const n = Vn(t);
    if (n)
      return n;
  }
  return null;
}
function Bo(...e) {
  for (const t of e) {
    const n = mu(t);
    if (De(n))
      return n;
  }
  return "";
}
function mu(e) {
  const t = Te(e), n = Xr(t);
  if (n !== t)
    return mu(n);
  const r = Zy?.(t) ?? t, o = En(r, /* @__PURE__ */ new Set());
  if (De(o))
    return o;
  if (r !== t) {
    const a = En(t, /* @__PURE__ */ new Set());
    if (De(a))
      return a;
  }
  const s = Jo(t);
  if (s)
    return zs?.(s) ?? s;
  const i = ji(e);
  return i !== t && De(i) ? i : "";
}
function En(e, t) {
  const n = Te(e), r = Xr(n);
  if (r !== n)
    return En(r, t);
  if (typeof n == "string") {
    const c = yu(n);
    if (De(c))
      return c;
    const u = zr(n);
    return u ? { text: u } : hn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const c = n.map((u) => En(u, t)).filter(De);
    return c.length > 0 ? c : "";
  }
  if (!n || typeof n != "object")
    return n;
  if (Gn(n)) {
    const c = vu(n);
    if (c !== void 0)
      return En(c, t);
    const u = xu(n);
    if (u)
      return { text: u };
    const l = Vn(n) || dt(n);
    return l ? { rich: l } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), Vi(n))
    return ei(n);
  if (hu(n))
    return n;
  for (const c of ["output", "result", "data", "content", "json", "value"]) {
    if (!(c in n))
      continue;
    const u = En(n[c], t);
    if (De(u))
      return u;
  }
  const o = Bi(n);
  if (o) {
    const c = { rich: o };
    return zs?.(c) ?? c;
  }
  const s = dt(n);
  if (s)
    return { rich: s };
  const i = Jo(n);
  if (i)
    return zs?.(i) ?? i;
  const a = ut(n);
  if (a !== n)
    return En(a, t);
  if (yw(n))
    return ei(n);
  if (ts(n)) {
    const c = ve(n.message, n.error, n.status);
    return c ? { text: c } : "";
  }
  return Qo(n) ? n : "";
}
function yw(e) {
  return e && typeof e == "object" && !Array.isArray(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files);
}
function ei(e) {
  const t = {}, n = Te(e.content);
  n && typeof n == "object" && !Array.isArray(n) && ja(t, n), ja(t, e);
  const r = hw(e);
  return r && (t.text = r), !De(t) && n && typeof n == "object" ? n : Qo(t) ? t : "";
}
function hw(e) {
  const t = ve(e.text);
  if (t)
    return t;
  const n = Te(e.content);
  return typeof n == "string" ? n.trim() : n && typeof n == "object" && !Array.isArray(n) ? ve(n.text) : "";
}
function ji(e) {
  const t = Xr(e);
  if (t !== e)
    return ji(t);
  const n = Jo(e);
  if (n)
    return n;
  const r = yu(e);
  if (De(r))
    return r;
  const o = Te(e), s = dt(o);
  if (s)
    return { rich: s };
  const i = ut(o);
  if (i !== o) {
    const a = dt(i);
    return a ? { rich: a } : i;
  }
  return o;
}
function Jo(e) {
  const t = Vn(e);
  return t ? { rich: t } : null;
}
function Vn(e, t = /* @__PURE__ */ new Set()) {
  const n = Te(e), r = Xr(n);
  if (r !== n)
    return Vn(r, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const a = Vn(i, t);
      if (a)
        return a;
    }
    return null;
  }
  if (!n || typeof n != "object" || t.has(n))
    return null;
  if (t.add(n), Gn(n))
    return gu(n, t) || n;
  const o = n, s = [
    Pe(o, ["output", "content", "rich"]),
    Pe(o, ["output", "rich"]),
    Pe(o, ["content", "rich"]),
    o.content,
    o.rich,
    o.text,
    o.summary
  ];
  for (const i of s) {
    if (i === n)
      continue;
    const a = Vn(i, t);
    if (a)
      return a;
  }
  return null;
}
function gu(e, t) {
  const n = $o(e);
  for (const r of n) {
    const o = za(r, t);
    if (o)
      return o;
  }
  return za(n.join(""), t);
}
function za(e, t) {
  const n = String(e || "").trim();
  if (!hn(n))
    return null;
  const r = mc(n);
  return r === n || r === e ? null : Vn(r, t);
}
function ww(e) {
  return $o(e).join("");
}
function $o(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => $o(r, t));
  if (typeof e != "object")
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...$o(e.content, t)), n;
}
function yu(e) {
  const t = wt(e);
  if (t)
    return { rich: t };
  const n = Te(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = zr(n);
    return r ? { text: r } : "";
  }
  return "";
}
function wt(e, t = /* @__PURE__ */ new Set()) {
  const n = Te(e);
  if (Gn(n))
    return gu(n, t) || n;
  if (Array.isArray(n))
    return dt(Ui(n));
  if (!n || typeof n != "object" || t.has(n))
    return null;
  t.add(n);
  const r = n, o = Bi(r);
  if (o)
    return o;
  const s = [
    Pe(r, ["output", "content", "rich"]),
    Pe(r, ["output", "content"]),
    Pe(r, ["output", "rich"]),
    Pe(r, ["content", "output", "content", "rich"]),
    Pe(r, ["content", "output", "content"]),
    Pe(r, ["content", "rich"]),
    Pe(r, ["data", "output", "content", "rich"]),
    Pe(r, ["data", "output", "content"]),
    Pe(r, ["data", "content", "rich"]),
    r.rich,
    r.output,
    r.result,
    r.content,
    r.data,
    r.value,
    r.json,
    r.text,
    r.message
  ];
  for (const i of s) {
    if (i == null || i === n)
      continue;
    const a = wt(i, t);
    if (a)
      return a;
  }
  for (const [i, a] of Object.entries(r)) {
    if (!ku(i) || !a || typeof a != "object")
      continue;
    const c = wt(a, t);
    if (c)
      return c;
  }
  return null;
}
function Bi(e) {
  return Gn(e) ? e : Array.isArray(e.content) && (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json" || e.type === void 0) ? dt({
    type: "doc",
    content: e.content
  }) : (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json") && e.rich != null ? wt(e.rich) : (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json") && e.content?.rich != null ? wt(e.content.rich) : null;
}
function Gn(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e) && e.type === "doc" && Array.isArray(e.content));
}
function ja(e, t) {
  for (const n of [
    "format",
    "title",
    "text",
    "reasoning",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error",
    "progress",
    "meta"
  ])
    De(t[n]) && (e[n] = n === "rich" ? _w(t[n]) : t[n]);
}
function _w(e) {
  return wt(e) || dt(Ui(e)) || dt(e) || e;
}
function Qo(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : De(n));
}
function hu(e) {
  return !e || typeof e != "object" || Array.isArray(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => De(e[t]));
}
function De(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !hn(t) && !gt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(De) : typeof e != "object" ? !1 : wt(e) ? !0 : ts(e) ? !1 : Qo(e);
}
function $i(e) {
  return ht(
    Xt(e),
    e.description || e.title
  );
}
function bw(e) {
  const t = [
    Xt(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = wt(n) || dt(ji(n)) || dt(ut(n)) || dt(n);
    if (r)
      return r;
  }
  return null;
}
function ht(e, t = "") {
  const n = ut(e), r = dt(n), o = r ? Fn(r).trim() : "";
  if (o && !gt(o))
    return o;
  const s = Fn(n).trim();
  if (gt(s))
    return "";
  const i = zr(s);
  if (i)
    return i;
  if (s && !hn(s))
    return s;
  if (Li(s)) {
    const l = Fn(
      ut(Te(s))
    ).trim();
    if (l && l !== s && !gt(l))
      return l;
  }
  const a = String(t || "").trim();
  if (gt(a))
    return "";
  const c = zr(a);
  if (c)
    return c;
  if (!hn(a))
    return a;
  const u = Fn(
    ut(Te(a))
  ).trim();
  return u && u !== a && !gt(u) ? u : "";
}
function gt(e) {
  const t = e.trim();
  return t ? Nw(t) || Iw(t) : !1;
}
function Nw(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function Iw(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function bn(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = ut(e);
  return qr(n, r, t), !yn(n) && r !== e && qr(n, e, t), Un(n) && hn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= jl(e, "video").find(
    (o) => o.url === n.videoUrl
  )?.thumbnail), n;
}
function Sw(e, t) {
  return {
    text: ve(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function qr(e, t, n, r = /* @__PURE__ */ new Set(), o = 0) {
  if (o > 12 || t == null)
    return;
  if (typeof t == "string") {
    Ba(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const u of t)
      if (qr(e, u, n, r, o + 1), Un(e))
        return;
    return;
  }
  if (typeof t != "object") {
    e.text = String(t);
    return;
  }
  if (r.has(t))
    return;
  r.add(t);
  const s = t, i = Cw(e, s, n), a = ht(t, "");
  a && a !== i && !Yt(a) && (e.text ||= a);
  const c = sr(s.url, s.src, s.href);
  if (c && c !== i && Ba(e, c, n), e.imageUrl ||= sr(
    s.image,
    s.image_url,
    s.imageUrl,
    He(s.images),
    He(s.imageUrls)
  ), e.videoUrl ||= sr(
    s.video,
    s.video_url,
    s.videoUrl,
    He(s.videos),
    He(s.videoUrls)
  ), e.audioUrl ||= sr(
    s.audio,
    s.audio_url,
    s.audioUrl,
    He(s.audios),
    He(s.audioUrls)
  ), e.fileUrl ||= sr(
    s.file,
    s.file_url,
    s.fileUrl,
    He(s.files),
    He(s.fileUrls)
  ), !Un(e)) {
    for (const u of ["output", "result", "content", "body", "data", "rich"])
      if (s[u] && typeof s[u] == "object" && (qr(e, s[u], n, r, o + 1), Un(e)))
        return;
  }
  if (!e.text && !yn(e) && !Mw(s) && Qo(s))
    try {
      const u = JSON.stringify(t, null, 2);
      fr(u) || (e.text = u);
    } catch {
      const u = String(t);
      fr(u) || (e.text = u);
    }
}
function Cw(e, t, n) {
  const r = wu(
    n,
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
  if (!r)
    return "";
  const o = sr(...xw(t, r));
  return o ? (r === "image" && (e.imageUrl ||= o), r === "video" && (e.videoUrl ||= o), r === "audio" && (e.audioUrl ||= o), r === "file" && (e.fileUrl ||= o), o) : "";
}
function vw(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return wu(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function wu(...e) {
  for (const t of e) {
    const n = es(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function es(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function xw(e, t) {
  const n = [
    e.url,
    e.src,
    e.href,
    e.path,
    e.file_url,
    e.fileUrl,
    e.text,
    e.content,
    e.value,
    Pe(e, ["attrs", "src"]),
    Pe(e, ["attrs", "url"]),
    Pe(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    He(e.images),
    He(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    He(e.videos),
    He(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    He(e.audios),
    He(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    He(e.files),
    He(e.fileUrls),
    ...n
  ];
}
function Ba(e, t, n) {
  const r = t.trim();
  if (!r || gt(r))
    return;
  if (Li(r)) {
    const a = Te(r);
    if (a !== r && (qr(e, a, n), Un(e)))
      return;
    const c = ht(a, "");
    c && !Yt(c) && (e.text ||= c);
    return;
  }
  const o = zr(r);
  if (o) {
    e.text ||= o;
    return;
  }
  const s = Fn(r);
  if (s && s !== r) {
    e.text ||= s;
    return;
  }
  const i = kw(r, n);
  if (i) {
    Aw(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (Yt(r)) {
    const a = es(n);
    if (a === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(r)) {
      e.imageUrl ||= r;
      return;
    }
    if (a === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(r)) {
      e.videoUrl ||= r;
      return;
    }
    if (a === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(r)) {
      e.audioUrl ||= r;
      return;
    }
    e.fileUrl ||= r;
    return;
  }
  e.text ||= r;
}
function kw(e, t) {
  const n = _u(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const u = Ds(r[2]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: wo(e, r[0], r[1])
      };
  }
  const o = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (o) {
    const u = Ds(o[1]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: wo(e, o[0], "")
      };
  }
  const s = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = s.exec(e); ) {
    const u = Ds(i[2]), l = $a(u, n);
    if (l)
      return {
        kind: l,
        url: u,
        caption: wo(e, i[0], i[1])
      };
  }
  const a = Tw(e), c = $a(a, n);
  return c ? {
    kind: c,
    url: a,
    caption: wo(e, a, "")
  } : null;
}
function _u(e, t) {
  return es(t) ? t : Rw(e) ? "image" : t;
}
function Rw(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Aw(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function $a(e, t) {
  if (!e || !Yt(e))
    return "";
  const n = es(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function wo(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !Yt(r) ? r : String(n || "").trim();
}
function Ds(e) {
  const t = bu(e);
  return Yt(t) ? t : "";
}
function Tw(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? bu(t[0]) : "";
}
function bu(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Mw(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function yn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !fr(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Dw(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (t && typeof t == "object") {
      const n = ve(
        t.url,
        t.src,
        t.href,
        t.path,
        t.file,
        t.file_url,
        t.fileUrl,
        t.image,
        t.image_url,
        t.imageUrl,
        t.video,
        t.video_url,
        t.videoUrl,
        t.audio,
        t.audio_url,
        t.audioUrl,
        Pe(t, ["attrs", "src"]),
        Pe(t, ["attrs", "url"]),
        Pe(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function sr(...e) {
  const t = Dw(...e);
  return Yt(t) ? t : "";
}
function He(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function Yt(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function Dr(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function Ew(e, t, n, r) {
  const o = r?.x ?? e.x + 34, s = r?.y ?? e.y + 34;
  return {
    ...e,
    id: `local-${e.type}-${Date.now()}-${n}`,
    nodeNo: void 0,
    title: `${e.title} 副本`,
    titleMode: "manual",
    x: o,
    y: s,
    assetCateId: e.assetCateId || t,
    group: e.type === "group" && e.group?.origin === "script" ? { origin: "manual" } : e.group,
    storyboardItem: void 0,
    storyboardMaterializedSignature: void 0,
    local: !0
  };
}
function Pw(e, t) {
  const n = Nu(e), r = Iu(e, t, n), o = (s) => n.hasResultByNodeId.get(s.id) || !1;
  return {
    ...n,
    ...r,
    runBlockedReasonByNodeId: new Map(
      e.map((s) => [
        s.id,
        Jc({
          targets: s.type === "group" ? n.groupMembersById.get(s.id) || [] : [s],
          nodesByID: n.nodeById,
          hasResult: o
        })
      ])
    ),
    highlightedPathEdgesByNodeId: t_(
      n.nodeById,
      t
    )
  };
}
function Nu(e) {
  const t = new Map(e.map((o) => [o.id, o])), n = new Map(
    e.map((o) => [o.id, vt(o)])
  ), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o.groupId)
      continue;
    const s = r.get(o.groupId) || [];
    s.push(o), r.set(o.groupId, s);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function Iu(e, t, n, r = "") {
  const { nodeById: o, groupMembersById: s, hasResultByNodeId: i } = n, a = (w) => {
    const E = o.get(w);
    return E ? E.type === "group" ? s.get(E.id) || [] : [E] : [];
  }, c = /* @__PURE__ */ new Set();
  for (const w of t) {
    const E = Gr(w);
    if (r && E.targetNodeId !== r)
      continue;
    const { sourceNodeId: F } = E;
    for (const $ of a(F))
      c.add($.id);
  }
  const u = /* @__PURE__ */ new Map();
  for (const w of e)
    if (c.has(w.id)) {
      const E = Fw(
        w,
        i.get(w.id) || !1
      );
      E && Ua(E).trim() !== "" && u.set(w.id, E);
    }
  const l = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (const w of t) {
    const { sourceNodeId: E, targetNodeId: F } = Gr(w);
    if (!(r && F !== r || !o.has(F)))
      for (const $ of a(E)) {
        if (bc(w) && gi($)) {
          const oe = m.get(F) || [];
          oe.push({ edge: w, source: $ }), m.set(F, oe);
        }
        const V = u.get($.id), q = I.get(F) || /* @__PURE__ */ new Set();
        if (!V || q.has($.id))
          continue;
        q.add($.id), I.set(F, q);
        const Y = l.get(F) || [];
        Y.push(V), l.set(F, Y);
      }
  }
  const N = /* @__PURE__ */ new Map();
  for (const [w, E] of l)
    N.set(w, {
      sources: E,
      text: E.map(Ua).join(`

`)
    });
  return {
    inputContextByNodeId: N,
    incomingMediaReferencesByNodeId: m
  };
}
function Gr(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function Su(e, t, n) {
  const r = [];
  for (const o of t) {
    if (!bc(o))
      continue;
    const s = Gr(o);
    if (s.targetNodeId === n)
      for (const i of Sc(
        e,
        s.sourceNodeId
      ))
        gi(i) && r.push({ edge: o, source: i });
  }
  return r;
}
function Cu(e, t, n) {
  const r = Nu(t);
  return Iu(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function Fw(e, t) {
  if (!t)
    return null;
  const n = Xt(e), r = Zo(e, n), o = bn(n, r);
  return yn(o) || (o.text = ht(
    n,
    e.description || e.title
  )), {
    nodeId: e.id,
    title: e.title,
    type: e.type,
    kind: r,
    output: n,
    preview: o,
    resultRef: e.resultRef
  };
}
function Ow(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const o = t.sources[r];
    return n.nodeId === o.nodeId && n.title === o.title && n.type === o.type && n.kind === o.kind && n.output === o.output && n.resultRef === o.resultRef && n.preview.text === o.preview.text && n.preview.imageUrl === o.preview.imageUrl && n.preview.videoUrl === o.preview.videoUrl && n.preview.audioUrl === o.preview.audioUrl && n.preview.fileUrl === o.preview.fileUrl;
  });
}
function Ua(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || Au(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Xt(e) {
  return zw(
    zl(e.asset?.version?.content, e.resultOutput)
  );
}
function zw(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = vu(n);
    if (r !== void 0)
      return r;
    const o = xu(n);
    if (o)
      return { text: o };
    const s = Bo(n) || ut(n);
    if (De(s) || Ki(s))
      return s;
  }
  if (t !== void 0)
    return Bo(t) || ut(t);
}
function vu(e) {
  const t = Te(e), n = Gn(t) ? t : wt(t);
  if (!n)
    return;
  const r = ww(n).trim();
  if (!hn(r))
    return;
  const o = mc(r);
  if (o === r)
    return;
  const s = ut(o);
  if (De(s) || Ki(s))
    return s;
}
function xu(e) {
  const t = Te(e), n = Gn(t) ? t : wt(t);
  return cc(n);
}
function ut(e) {
  const t = Te(e), n = Xr(t);
  if (n !== t)
    return ut(n);
  if (hu(t))
    return t;
  if (Vi(t)) {
    const s = ei(t);
    if (De(s))
      return s;
  }
  const r = Jo(t);
  if (r)
    return r.rich;
  if (Gn(t))
    return t;
  const o = wt(t);
  return o || Ui(Uo(t, /* @__PURE__ */ new Set()));
}
function Uo(e, t) {
  if (!e || typeof e != "object" || t.has(e))
    return e;
  t.add(e);
  const n = e, r = Ru(n);
  if (r !== void 0)
    return r;
  const o = jw(n, t);
  if (o !== void 0)
    return o;
  for (const s of Bw) {
    const i = Pe(n, s);
    if (i === void 0 || i === e)
      continue;
    const a = Uo(
      Te(i),
      t
    );
    if (ti(a))
      return a;
  }
  if (ts(n))
    for (const s of ["output", "result", "data", "body"]) {
      if (n[s] === void 0 || n[s] === e)
        continue;
      const i = Uo(
        Te(n[s]),
        t
      );
      if (ti(i))
        return i;
    }
  return e;
}
function jw(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!ku(n) || !r || typeof r != "object")
      continue;
    const o = Uo(Te(r), t);
    if (ti(o))
      return o;
  }
}
function ku(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const Bw = [
  ["output", "content", "rich"],
  ["output", "content"],
  ["output", "rich"],
  ["content", "output", "content", "rich"],
  ["content", "output", "content"],
  ["content", "output", "rich"],
  ["content", "data", "text"],
  ["content", "data", "content"],
  ["content", "rich"],
  ["content", "text"],
  ["data", "output", "content", "rich"],
  ["data", "output", "content"],
  ["data", "content", "rich"],
  ["data", "content"],
  ["rich"]
];
function Ru(e) {
  const t = Bi(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Te(e.content);
    if (n && typeof n == "object") {
      const r = Ru(n);
      if (r !== void 0)
        return r;
    }
  }
}
function Ui(e) {
  const t = Te(e);
  return t && typeof t == "object" && !Array.isArray(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function ts(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function ti(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !hn(n) && !gt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (typeof e != "object" || wt(e) || dt(e))
    return !0;
  if (ts(e))
    return !1;
  const t = Fn(e).trim();
  return !!(t && !fr(t));
}
function Pe(e, t) {
  let n = e;
  for (const r of t) {
    if (!n || typeof n != "object" || !(r in n))
      return;
    n = n[r];
  }
  return n;
}
function Xr(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = $w(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function $w(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && /\s/.test(e[o] || ""); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const i = e.indexOf("```", s), a = i >= 0 ? e.slice(o, i) : e.slice(o), c = Uw(a, t === "json");
    if (c)
      return c;
    if (i < 0)
      return;
    s = i + 3;
  }
}
function Uw(e, t = !1) {
  const n = e.trim(), r = Ll(n);
  for (const o of Kl([n, r])) {
    const s = Te(o);
    if (s !== o && (t ? Vw(s) : Vi(s)))
      return s;
  }
  return null;
}
function Vw(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return !1;
  const t = String(e.kind || e.type || e.event || "").toLowerCase().trim();
  return [
    "final",
    "result",
    "final_result",
    "answer",
    "tool",
    "tool_result",
    "power_result"
  ].includes(t) || "content" in e || "tasks" in e || "suggestions" in e || "rich" in e;
}
function Vi(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return !1;
  const t = String(e.kind || e.type || e.event || "").toLowerCase().trim();
  return [
    "final",
    "result",
    "final_result",
    "answer",
    "tool",
    "tool_result",
    "power_result"
  ].includes(t) || "content" in e || "tasks" in e || "suggestions" in e || [
    "title",
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json"
  ].some((n) => De(e[n]));
}
function Li(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function hn(e) {
  const t = String(e || "").trim();
  return !!(t && (Li(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function Au(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return gt(e) ? "" : e;
  const t = Fn(e).trim();
  if (t && gt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return fr(n) ? "" : n;
  } catch {
    const n = String(e);
    return gt(n) ? "" : n;
  }
}
function Ki(e) {
  const t = Au(e).trim();
  return !!(t && !fr(t));
}
function fr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || gt(t);
}
function ni(e, t) {
  return ff(e, t);
}
function Va(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function Dn(e, t, n, r) {
  return !t || !n || t === n || e.some((s) => {
    const i = Gr(s);
    return i.sourceNodeId === t && i.targetNodeId === n;
  }) ? e : [
    ...e,
    {
      id: `edge-${t}-${n}-${Date.now()}`,
      from: t,
      to: n,
      purpose: "media",
      ...r ? { mediaUsage: r } : {}
    }
  ];
}
function ri(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function oi(e, t) {
  return e.type === "asset" && ri(e) === t;
}
function La(e, t, n, r) {
  const o = new Map(e.map((s) => [s.id, s]));
  if (r)
    for (const s of t) {
      if (s.from !== r)
        continue;
      const i = o.get(s.to);
      if (i && oi(i, n))
        return i;
    }
  return e.find((s) => oi(s, n)) || null;
}
function Ka(e, t, n, r, o) {
  const s = /* @__PURE__ */ new Set();
  if (!r || !n)
    return s;
  const i = new Map(e.map((a) => [a.id, a]));
  for (const a of t) {
    if (a.from !== r || a.to === o)
      continue;
    const c = i.get(a.to);
    c && oi(c, n) && s.add(c.id);
  }
  return s;
}
function Es(e, t) {
  return {
    ...t,
    id: e.id,
    x: e.x,
    y: e.y,
    width: e.width || t.width,
    height: e.height || t.height,
    groupId: e.groupId,
    local: e.local !== !1
  };
}
function Lw(e) {
  return {
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    assetCateId: e.assetCateId,
    kind: e.kind,
    cardinality: e.cardinality,
    asset: e.asset
  };
}
function Kw(e) {
  return e.map((t) => ({
    id: String(t.id || `edge-${t.source}-${t.target}`),
    from: String(t.data?.physicalFrom || t.source || ""),
    to: String(t.data?.physicalTo || t.target || ""),
    logicalFrom: String(t.data?.logicalFrom || "") || void 0,
    logicalTo: String(t.data?.logicalTo || "") || void 0,
    purpose: t.data?.purpose === "structure" || t.data?.purpose === "dependency" ? t.data.purpose : "media",
    executionMode: String(t.data?.executionMode || "") === "manual" ? "manual" : void 0,
    mediaUsage: String(t.data?.mediaUsage || "") || void 0
  })).filter((t) => t.from && t.to && t.from !== t.to);
}
function qa(e, t) {
  const n = new Set(e.nodes.map((i) => i.id));
  let r = !1;
  const o = e.nodes.map((i) => {
    const a = Number(i.assetCateId ?? t), c = i.local !== !1;
    return i.assetCateId === a && i.local === c ? i : (r = !0, {
      ...i,
      assetCateId: a,
      local: c
    });
  }), s = e.edges.filter(
    (i) => n.has(i.from) && n.has(i.to)
  );
  return Oc({
    assetCateId: t,
    nextNodeNo: e.nextNodeNo,
    nodes: r ? o : e.nodes,
    edges: s.length === e.edges.length ? e.edges : s,
    viewport: e.viewport || {},
    updatedAt: e.updatedAt
  });
}
function qw(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      Tu(r, t)
    ])
  );
}
function Tu(e, t) {
  if (!t.length)
    return e;
  const n = new Map(t.map((o) => [o.id, o])), r = new Map(
    t.filter(
      (o) => String(o.role || "") === "material" && String(o.status || "") !== "archived" && String(o.node_key || o.version?.node_key || "").trim()
    ).map((o) => [
      String(o.node_key || o.version?.node_key || "").trim(),
      o
    ])
  );
  return {
    ...e,
    nodes: e.nodes.map(
      (o) => Gw(o, n, r)
    )
  };
}
function Gw(e, t, n) {
  const r = Hw(e), o = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!o)
    return e;
  const s = Ws(e, o), i = Number(s.resultRef?.run_id || 0), a = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...s,
    ...e.runError && i > a ? { runError: "" } : {},
    asset: o
  };
}
function Hw(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function Ga(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Mu(e.nodes, t.nodes) && Du(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Mu(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function Ww(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.staleCount === t.staleCount && e.status === t.status;
}
function Du(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n === o || n.id === o.id && n.from === o.from && n.to === o.to && (n.logicalFrom || "") === (o.logicalFrom || "") && (n.logicalTo || "") === (o.logicalTo || "") && (n.purpose || "") === (o.purpose || "") && (n.executionMode || "auto") === (o.executionMode || "auto") && (n.mediaUsage || "") === (o.mediaUsage || "");
  });
}
function Yw(e, t) {
  return ni(e, t) ? { source: e.id, target: t.id } : ni(t, e) ? { source: t.id, target: e.id } : null;
}
function Xw(e) {
  return {
    id: "proximity-preview",
    source: e.source,
    sourceHandle: "output-0",
    target: e.target,
    targetHandle: "input-0",
    type: "animated",
    animated: !0,
    style: {
      stroke: "#0ea5e9",
      strokeWidth: 2,
      strokeDasharray: "5 5",
      opacity: 0.86,
      animation: "ws-dashdraw 0.5s linear infinite"
    },
    data: {
      isHighlighted: !0,
      highlightColor: "#0ea5e9"
    }
  };
}
function Zw(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function Jw(e, t, n) {
  const o = new Map(n.map((i) => [i.id, i]));
  let s = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const a = o.get(i.id);
    if (!a)
      continue;
    const c = i.position.x - e.position.x, u = i.position.y - e.position.y, l = Math.sqrt(c * c + u * u);
    l < 150 && (!s || l < s.distance) && (s = { distance: l, domainNode: a });
  }
  return s;
}
function Qw(e, t, n, r, o, s, i) {
  const a = e.id === o, c = s.has(e.id), u = a || c || e.source === n || e.target === n || e.source === r || e.target === r, l = e.source === n || e.target === n ? n : r;
  return {
    highlighted: u,
    selected: a,
    highlightColor: u ? n_(
      t.get(
        c ? i : l
      )
    ) : "var(--ws-edge)"
  };
}
function e_(e, t, n) {
  return {
    ...e,
    data: {
      ...e.data,
      isHighlighted: t.highlighted,
      isSelected: t.selected,
      onDelete: n,
      highlightColor: t.highlightColor
    }
  };
}
function t_(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of t) {
    const s = n.get(o.from);
    s ? s.push(o) : n.set(o.from, [o]);
  }
  const r = /* @__PURE__ */ new Map();
  for (const o of e.values()) {
    if (o.type !== "function" || o.functionOption?.key !== "start")
      continue;
    const s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set([o.id]), a = [...n.get(o.id) || []];
    for (let c = 0; c < a.length; c += 1) {
      const u = a[c];
      if (!u || s.has(u.id) || (s.add(u.id), i.has(u.to)))
        continue;
      i.add(u.to);
      const l = e.get(u.to);
      l && Zc(l) || a.push(...n.get(u.to) || []);
    }
    s.size > 0 && r.set(o.id, s);
  }
  return r;
}
function n_(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function r_(e) {
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  return t ? { x: t.clientX, y: t.clientY } : typeof e?.clientX == "number" && typeof e?.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function o_(e) {
  return e instanceof HTMLElement ? !!e.closest("input, textarea, select, [contenteditable='true']") : !1;
}
function Ha(e) {
  return !e.repeat && (e.key === "Delete" || e.key === "Backspace") && !o_(e.target);
}
function s_(e) {
  return e === "start" ? Vo : e === "import" ? yl : e === "display" ? ci : oc;
}
function i_(e) {
  return e.type !== "function" ? !1 : e.functionOption?.key === "start" || e.title === "开始";
}
function Eu(e) {
  if (e.type !== "function")
    return !1;
  const t = e.functionOption?.key || "";
  return t === "import" || t === "save" || t === "display";
}
function qi(e) {
  return Eu(e) && vt(e);
}
function a_(e) {
  return {
    description: e
  };
}
function c_(e, t) {
  return {
    ...a_(t),
    resultRef: vi({
      ...e,
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Wa = { width: 620, height: 420 }, Gi = 44;
function Ya(e, t) {
  return {
    initialWidth: e.width,
    initialHeight: e.height,
    style: {
      ...t,
      width: e.width,
      height: e.height
    }
  };
}
function Pu(e) {
  if (e.type === "function") {
    if (qi(e)) {
      if (!Gc(e))
        return { width: e.width, height: e.height };
      const n = Xa(e);
      return n ? {
        width: n.width,
        height: n.height + Gi
      } : u_(e);
    }
    return { width: 128, height: 46 };
  }
  const t = Xa(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Xa(e) {
  if (!Gc(e) || !d_(e))
    return null;
  const t = qn(e);
  return Bl(
    dn(e),
    Lo(t)
  ) ? {
    width: Math.max(e.width, Wa.width),
    height: Math.max(e.height, Wa.height)
  } : null;
}
function d_(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Kn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function u_(e) {
  const t = qn(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = Go({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + Gi
  };
}
function ze({
  id: e,
  type: t,
  position: n,
  className: r,
  style: o
}) {
  return /* @__PURE__ */ d(
    Hu,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: o,
      children: /* @__PURE__ */ d("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ d(ec, { size: 12 }) : /* @__PURE__ */ d(tc, { size: 12 }) })
    }
  );
}
function Lt({
  node: e,
  selected: t
}) {
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && qi(e), r = /* @__PURE__ */ d(
    pm,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const o = qt(e.runningNode);
    return /* @__PURE__ */ M(mn, { children: [
      r,
      /* @__PURE__ */ d(
        ag,
        {
          node: e,
          running: o,
          onRun: () => {
            o || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((s) => {
              Q.error(
                s instanceof Error ? s.message : "流程运行失败"
              );
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !si(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ M(mn, { children: [
    r,
    /* @__PURE__ */ d(
      Le,
      {
        fallback: /* @__PURE__ */ d(Ke, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ d(Ky, { node: e }, e.id)
      }
    )
  ] });
}
function si(e) {
  return e.type === "agent" ? !0 : e.type === "power" && !Hl(e.power, e.kind, e.outputType);
}
function Er({
  node: e,
  onShowNodeDetail: t
}) {
  if (!t || !vt(e))
    return null;
  const n = !!So(e).videoUrl;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: [
        "ws-node-quick-view nodrag nopan",
        n ? "is-video-detail" : ""
      ].filter(Boolean).join(" "),
      "aria-label": "查看详情",
      onPointerEnter: Kr,
      onFocus: Kr,
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ d(ci, { size: 14 })
    }
  );
}
const l_ = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function Ps({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = Br(
    e.resultView || l_
  ), {
    width: o,
    height: s,
    offsetX: i,
    offsetY: a
  } = r, [c, u] = K(r), [l, m] = K(!1);
  ce(() => {
    u({
      width: o,
      height: s,
      offsetX: i,
      offsetY: a
    });
  }, [
    s,
    i,
    a,
    o
  ]);
  const I = e.type === "agent" ? t?.agent : void 0, N = Nm(I);
  if (!vt(e) && !N)
    return null;
  const w = qn(e), E = $i(e), F = ve(
    ht(w.text, ""),
    ht(E, ""),
    ht(e.description, ""),
    e.title,
    "暂无结果"
  ), $ = zi(e), V = dn(e), q = De(V) ? V : $ ? { rich: $ } : F, Y = Un(w) ? w : Sw(
    w,
    bn(F, _u(F, ""))
  ), oe = e.interactive, v = ge(
    e.resultOutput,
    e.asset?.version?.content
  ), C = e.type === "agent" ? async (k) => {
    if (!qt(t))
      try {
        await e.onRunBackendNode(e, { agentInput: k });
      } catch (X) {
        Q.error(
          X instanceof Error ? X.message : "智能体继续运行失败"
        );
      }
  } : void 0;
  return /* @__PURE__ */ d(Le, { fallback: /* @__PURE__ */ d(Ke, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Od,
    {
      output: q,
      fallback: F,
      preview: Y,
      mediaLabel: lr(Y),
      className: `ws-agent-result-bubble ${l ? "is-resizing" : ""}`,
      followContent: !!(t && t.status !== "error"),
      followKey: I,
      style: {
        width: c.width,
        height: c.height,
        left: `calc(100% + 12px + ${Number(c.offsetX || 0)}px)`,
        top: `calc(50% + ${Number(c.offsetY || 0)}px)`
      },
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Kr,
      resizeControls: /* @__PURE__ */ d(
        mm,
        {
          value: c,
          enabled: oe,
          onResizeStart: () => {
            m(!0), e.onNodeResizeStart(e.id);
          },
          onResize: u,
          onResizeEnd: (k) => {
            u(k), m(!1), e.onResultViewResizeEnd(e.id, k);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ d(
        Le,
        {
          fallback: /* @__PURE__ */ d(Ke, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ d(
            Vy,
            {
              output: v,
              runtime: I,
              fallback: F,
              running: qt(t),
              onContinue: C
            }
          )
        }
      ) : void 0
    }
  ) });
}
function f_({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = qn(e), o = zi(e), s = dn(e), i = ve(
    $i(e),
    ht(r.text, ""),
    ht(e.description, ""),
    "暂无内容"
  ), a = De(s) ? s : o ? { rich: o } : i, c = !ir(a, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), u = c && !r.audioUrl ? Co(
    e,
    e.onNodeResult,
    Gi
  ) : void 0;
  return /* @__PURE__ */ d(Le, { fallback: /* @__PURE__ */ d(Ke, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Od,
    {
      output: a,
      fallback: i,
      preview: r,
      mediaLabel: lr(r),
      className: `ws-node-function-result-card ${c ? "has-media" : ""}`,
      customContentIsPureMedia: c,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Kr,
      children: c ? /* @__PURE__ */ d(
        Fu,
        {
          preview: r,
          output: a,
          fallback: i,
          generating: t,
          showMediaCaption: !1,
          onMediaSize: u
        }
      ) : void 0
    }
  ) });
}
function Fs({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = Bn(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (s) => s.status === "pending"
  ).length, o = [...n].reverse().find((s) => s.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ M(
    "button",
    {
      type: "button",
      className: `ws-node-feedback-beacon nodrag nopan ${r > 0 ? "is-pending" : "is-done"}`,
      "aria-label": r > 0 ? "继续填写反馈" : "查看反馈记录",
      onMouseDown: (s) => s.stopPropagation(),
      onClick: (s) => {
        s.preventDefault(), s.stopPropagation(), t(e, o);
      },
      children: [
        /* @__PURE__ */ d(gl, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ d("span", { children: n.length }) : null
      ]
    }
  );
}
function p_(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function vt(e) {
  if (!m_(e) || !p_(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = Xt(e);
  if (t == null)
    return !1;
  const n = bn(
    t,
    Zo(e, t)
  );
  return yn(n) || Ki(t);
}
function m_(e) {
  return e.type !== "function" ? !0 : Eu(e);
}
async function g_(e) {
  const t = e.node.functionOption?.key || "", n = y_(e.inputContext);
  if (t === "display") {
    if (n == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      fn(
        e.node,
        { output: n },
        "展示上游结果"
      )
    ), Q.success("已展示上游结果"), !0;
  }
  if (t === "save") {
    if (n == null)
      throw new Error("保存节点没有可保存的上游结果");
    const r = await lw({
      projectId: e.projectId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: w_(e.node, e.inputContext),
      kind: xm(e.node),
      content: n,
      nodeKey: e.node.id,
      requestId: nw(
        "save",
        e.node.id,
        n
      ),
      source: h_(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(r), e.onNodeResult(
      e.node.id,
      fn(
        e.node,
        {
          output: r.version?.content || n,
          asset: r
        },
        "保存上游结果"
      )
    ), Q.success("资产已保存"), !0;
  }
  return t === "start" ? (await e.onRunStartNode(e.node), !0) : t === "import" ? (e.onOpenImportPicker(e.node.id), !0) : (e.onNodeResult(
    e.node.id,
    fn(
      e.node,
      { output: "操作已应用" },
      "操作已应用"
    )
  ), Q.success("操作已应用"), !0);
}
function Hi(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function y_(e) {
  const t = Hi(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function h_(e) {
  const t = Hi(e);
  return Dm(t);
}
function w_(e, t) {
  const n = Hi(t);
  return ve(n?.title, e.title, "画布资产");
}
function __({
  prompt: e,
  running: t,
  readonly: n,
  history: r,
  activeRecordId: o,
  onSelectRecord: s,
  onClose: i,
  onSubmit: a
}) {
  const c = le(
    () => N_(e),
    [e]
  );
  if (typeof document > "u")
    return null;
  const u = document.querySelector(".ws-page") || document.body;
  return zu(
    /* @__PURE__ */ d("div", { className: "ws-flow-feedback-backdrop", onMouseDown: i, children: /* @__PURE__ */ M(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (l) => l.stopPropagation(),
        children: [
          /* @__PURE__ */ M("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ M("div", { children: [
              /* @__PURE__ */ d("strong", { children: e.title || "补充信息" }),
              n ? /* @__PURE__ */ d("span", { children: "已提交的反馈记录，可查看之前填写的内容。" }) : e.description ? /* @__PURE__ */ d("span", { children: e.description }) : null
            ] }),
            /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "ws-flow-feedback-close",
                disabled: t,
                onClick: i,
                "aria-label": "关闭",
                children: /* @__PURE__ */ d(rc, { size: 18 })
              }
            )
          ] }),
          r && r.length > 1 ? /* @__PURE__ */ d("div", { className: "ws-flow-feedback-tabs", children: r.map((l, m) => /* @__PURE__ */ M(
            "button",
            {
              type: "button",
              className: l.id === o ? "is-active" : "",
              onClick: () => s?.(l),
              children: [
                /* @__PURE__ */ d("span", { children: m + 1 }),
                l.status === "pending" ? "待反馈" : "已提交"
              ]
            },
            l.id
          )) }) : null,
          /* @__PURE__ */ d("div", { className: "ws-flow-feedback-body custom-scrollbar", children: /* @__PURE__ */ d(Le, { fallback: /* @__PURE__ */ d(Ke, { label: "正在加载交互表单" }), children: /* @__PURE__ */ d(
            Py,
            {
              interaction: c,
              disabled: t,
              readonly: n,
              hideHeader: !0,
              layout: "dialog",
              initialData: n ? e.values : void 0,
              onSubmit: (l) => a(
                b_(e, c, l.data)
              )
            }
          ) }) }),
          n ? /* @__PURE__ */ d("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ M(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: i,
              children: [
                /* @__PURE__ */ d(di, { size: 16 }),
                /* @__PURE__ */ d("span", { children: "知道了" })
              ]
            }
          ) }) : null
        ]
      }
    ) }),
    u
  );
}
function b_(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function N_(e) {
  const t = e.interaction?.interaction || {}, n = Array.isArray(t.fields) ? t.fields : e.fields.length > 0 ? e.fields : [
    {
      id: 0,
      key: "text",
      name: "补充信息",
      type: "textarea",
      required: !0
    }
  ];
  return {
    ...t,
    id: String(t.id || `flow-feedback-${e.approval?.id || 0}`),
    type: String(t.type || "form"),
    title: String(t.title || e.title || "补充信息"),
    description: String(t.description || e.description || ""),
    fields: n,
    values: e.values
  };
}
function Pn(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function I_(e) {
  const t = Pn(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Za(e, t) {
  if (!e)
    return;
  const n = Pn(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function S_(e) {
  return e.type === "function" && e.functionOption?.key === "start";
}
function C_(e) {
  return e.type === "function" && e.functionOption?.key === "start" ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function v_(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const o = n.filter(Ho), s = o.filter(
    (a) => a.storyboardItem?.stale || !vt(a)
  ), i = s.length > 0 ? s : o;
  await sm(i, r);
}
function x_({ data: e, selected: t }) {
  const n = e, {
    sourceNode: r,
    projectId: o,
    runningNode: s,
    setRunningNode: i,
    onShowNodeDetail: a,
    onNodeResult: c,
    onOpenFeedbackRecord: u,
    canvasReferenceItems: l,
    connectedMediaReferences: m,
    onConnectedMediaEdgeRemove: I,
    onNodeDraftChange: N,
    onOpenStoryboardGridImport: w,
    onRunBackendNode: E,
    structureLocked: F,
    storyboardSourceNode: $
  } = e, V = n.type === "power" ? Kn(n.power, n.kind, n.outputType) : null, q = V?.viewMode === "storyboard", Y = V?.viewMode === "storyboard_grid", oe = V?.viewMode === "video_compose";
  if (n.type === "group") {
    const v = n.groupMembers, C = n.storyboardFrameRunning, k = n.groupRuntime || Qc({
      members: v,
      runningNodes: qd,
      groupState: s,
      hasResult: vt
    }), X = n.runBlockedReason;
    let pe;
    return !X && !C && (pe = () => {
      i((ne) => ({
        ...ne,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: 8,
          status: "running"
        }
      })), v_(
        n,
        r,
        v,
        E
      ).then(() => {
        i((ne) => zn(ne, n.id));
      }).catch((ne) => {
        i((he) => ({
          ...he,
          [n.id]: {
            ...he[n.id] || {
              nodeId: n.id,
              title: n.title,
              startedAt: Date.now(),
              progress: 8
            },
            status: "error"
          }
        })), Q.error(
          ne instanceof Error ? ne.message : "分组运行失败"
        ), window.setTimeout(() => {
          i((he) => zn(he, n.id));
        }, 1400);
      });
    }), /* @__PURE__ */ d(Le, { fallback: /* @__PURE__ */ d(Ke, { label: "正在加载分组" }), children: /* @__PURE__ */ M(
      Ry,
      {
        node: n,
        memberCount: k.memberCount,
        runnableCount: k.runnableCount,
        completedCount: k.completedCount,
        failedCount: k.failedCount,
        staleCount: k.staleCount,
        status: k.status,
        frameRunning: C,
        selected: t,
        managed: F,
        onRename: F ? void 0 : (ne) => c(n.id, { title: ne, titleMode: "manual" }),
        onEditStructure: $ ? () => a(
          $,
          Md(n)
        ) : void 0,
        onRun: pe,
        runBlockedReason: X,
        children: [
          /* @__PURE__ */ d(
            ze,
            {
              id: "input-0",
              type: "target",
              position: Oe.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ d(
            ze,
            {
              id: "output-0",
              type: "source",
              position: Oe.Right,
              className: "is-out"
            }
          ),
          /* @__PURE__ */ d(Lt, { node: n, selected: t })
        ]
      }
    ) });
  }
  if (n.type === "agent") {
    const v = qt(s) || s?.status === "success";
    return /* @__PURE__ */ M(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${v ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ d(
            ze,
            {
              id: "input-0",
              type: "target",
              position: Oe.Left,
              className: "is-in",
              style: { left: "4px" }
            }
          ),
          /* @__PURE__ */ d(
            ze,
            {
              id: "output-0",
              type: "source",
              position: Oe.Right,
              className: "is-out",
              style: { right: "4px" }
            }
          ),
          /* @__PURE__ */ M("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ d(fl, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ d(
              Cs,
              {
                className: "ws-node-circle-title",
                title: n.title,
                onRename: c ? (C) => c(n.id, { title: C, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          v ? /* @__PURE__ */ M(
            "svg",
            {
              className: "ws-node-running-border is-spin is-circle is-agent",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ d(
                  "circle",
                  {
                    className: "ws-node-running-track",
                    cx: "50",
                    cy: "50",
                    r: "47",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ d(
                  "circle",
                  {
                    className: "ws-node-running-progress",
                    cx: "50",
                    cy: "50",
                    r: "47",
                    pathLength: "100",
                    strokeDasharray: "18 82",
                    strokeDashoffset: "0"
                  }
                )
              ]
            }
          ) : null,
          /* @__PURE__ */ d(
            Fs,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          /* @__PURE__ */ d(
            Ps,
            {
              node: n,
              runningNode: s,
              onShowNodeDetail: a
            }
          ),
          /* @__PURE__ */ d(Lt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "flow") {
    const v = qt(s) || s?.status === "success";
    return /* @__PURE__ */ M(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${v ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ d(
            "svg",
            {
              className: "ws-hexagon-svg",
              viewBox: "0 0 100 100",
              fill: "currentColor",
              children: /* @__PURE__ */ d(
                "polygon",
                {
                  points: "50,4 93,27 93,73 50,96 7,73 7,27",
                  stroke: t ? "var(--ws-blue)" : "var(--ws-border)",
                  strokeWidth: "1.5",
                  strokeLinejoin: "round"
                }
              )
            }
          ),
          v ? /* @__PURE__ */ M(
            "svg",
            {
              className: "ws-node-running-border is-spin is-hexagon",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ d(
                  "polygon",
                  {
                    className: "ws-node-running-track",
                    points: "50,5 92,28 92,72 50,95 8,72 8,28",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ d(
                  "polygon",
                  {
                    className: "ws-node-running-progress",
                    points: "50,5 92,28 92,72 50,95 8,72 8,28",
                    pathLength: "100",
                    strokeDasharray: "18 82",
                    strokeDashoffset: "0"
                  }
                )
              ]
            }
          ) : null,
          /* @__PURE__ */ M("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ d(pl, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ d(
              Cs,
              {
                className: "ws-node-flow-title",
                title: n.title,
                onRename: c ? (C) => c(n.id, { title: C, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ d(
            ze,
            {
              id: "input-0",
              type: "target",
              position: Oe.Left,
              className: "is-in",
              style: { left: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            ze,
            {
              id: "output-0",
              type: "source",
              position: Oe.Right,
              className: "is-out",
              style: { right: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            Fs,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          /* @__PURE__ */ d(Ps, { node: n, onShowNodeDetail: a }),
          /* @__PURE__ */ d(Lt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "function") {
    const v = n.functionOption?.key || (n.title.includes("保存") ? "save" : ""), C = v === "start", k = s_(v), { onRunFunctionNode: X, requestConfirm: pe } = n, ne = qt(s), he = C && n.canvasHasRunningNode, re = ne, te = qi(n), Ie = te ? { left: "0px", top: "19px" } : { left: "0px" }, Re = te ? { left: "128px", right: "auto", top: "19px" } : { right: "0px" }, fe = (G) => {
      i((_t) => ({
        ..._t,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: G === "success" ? 100 : G === "error" ? 92 : 0,
          status: G
        }
      })), G !== "running" && G !== "waiting" && window.setTimeout(
        () => i((_t) => zn(_t, n.id)),
        G === "success" ? 650 : 1200
      );
    }, ae = () => {
      const G = !C;
      G && fe("running"), X(n).then(() => {
        G && fe("success");
      }).catch((_t) => {
        G && fe("error"), Q.error(_t instanceof Error ? _t.message : "执行出错");
      });
    }, Fe = () => {
      if (!(re || he)) {
        if (S_(n)) {
          pe({
            title: `执行「${n.title}」`,
            description: C_(n),
            confirmText: "执行",
            onConfirm: ae
          });
          return;
        }
        ae();
      }
    }, Nn = (G) => {
      G.preventDefault(), G.stopPropagation(), Fe();
    };
    return /* @__PURE__ */ M(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${re ? "is-running" : ""} ${te ? "has-result-card" : ""} is-${v || "default"}`,
        children: [
          /* @__PURE__ */ M(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": re || he,
              onClick: Nn,
              onKeyDown: (G) => {
                G.key !== "Enter" && G.key !== " " || (G.preventDefault(), G.stopPropagation(), Fe());
              },
              children: [
                /* @__PURE__ */ d("div", { className: "ws-node-function-icon", children: ne ? /* @__PURE__ */ d(Gt, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(
                  k,
                  {
                    size: 15,
                    fill: C ? "currentColor" : "none"
                  }
                ) }),
                /* @__PURE__ */ d("span", { className: "ws-node-function-title", children: ne ? s?.status === "waiting" ? "等待中" : "运行中" : n.title })
              ]
            }
          ),
          te ? /* @__PURE__ */ d(
            f_,
            {
              node: n,
              running: re,
              onShowNodeDetail: a
            }
          ) : null,
          /* @__PURE__ */ d(
            ze,
            {
              id: "input-0",
              type: "target",
              position: Oe.Left,
              className: "is-in",
              style: Ie
            }
          ),
          /* @__PURE__ */ d(
            ze,
            {
              id: "output-0",
              type: "source",
              position: Oe.Right,
              className: "is-out",
              style: Re
            }
          ),
          /* @__PURE__ */ d(
            Fs,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          te ? null : /* @__PURE__ */ d(Ps, { node: n, onShowNodeDetail: a }),
          /* @__PURE__ */ d(Lt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "asset") {
    if (n.kind === "image") {
      const te = So(n), Ie = dn(n), Re = ir(Ie, te), fe = Co(n, c), ae = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        te.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ M("div", { className: ae, children: [
        /* @__PURE__ */ M("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(Yi, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "图片资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-image-container ws-node-content-container", children: Re ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          ar,
          {
            output: Ie,
            fallback: te.text || n.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : te.imageUrl ? /* @__PURE__ */ d(
          ii,
          {
            src: te.imageUrl,
            alt: n.title,
            className: "ws-node-image-raw",
            onMediaSize: fe
          }
        ) : /* @__PURE__ */ M("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(Yi, { size: 24 }),
          /* @__PURE__ */ d("span", { children: te.text || n.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ d(
          ze,
          {
            id: "input-0",
            type: "target",
            position: Oe.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          ze,
          {
            id: "output-0",
            type: "source",
            position: Oe.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Er,
          {
            node: n,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ d(Lt, { node: n, selected: t })
      ] });
    }
    if (n.kind === "video") {
      const te = So(n), Ie = dn(n), Re = ir(Ie, te), fe = Co(n, c), ae = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        te.videoUrl || te.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ M("div", { className: ae, children: [
        /* @__PURE__ */ M("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(Xi, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "视频资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-video-container ws-node-content-container", children: Re ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          ar,
          {
            output: Ie,
            fallback: te.text || n.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : te.videoUrl ? /* @__PURE__ */ d(
          xo,
          {
            src: te.videoUrl,
            poster: te.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: n.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            onMediaSize: fe
          },
          te.videoUrl
        ) : te.imageUrl ? /* @__PURE__ */ d(
          ii,
          {
            src: te.imageUrl,
            alt: n.title,
            className: "ws-node-video-raw",
            onMediaSize: fe
          }
        ) : /* @__PURE__ */ M("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(Xi, { size: 24 }),
          /* @__PURE__ */ d("span", { children: te.text || n.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ d(
          ze,
          {
            id: "input-0",
            type: "target",
            position: Oe.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          ze,
          {
            id: "output-0",
            type: "source",
            position: Oe.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Er,
          {
            node: n,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ d(Lt, { node: n, selected: t })
      ] });
    }
    const v = So(n), C = zi(n), k = dn(n), X = $i(n), pe = De(k) ? k : C ? { rich: C } : X || v.text, ne = ir(pe, v), he = !!(v.imageUrl || v.videoUrl || v.audioUrl), re = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      he ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ M("div", { className: re, children: [
      /* @__PURE__ */ M("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(ml, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ d("span", { children: n.title })
      ] }),
      /* @__PURE__ */ d("div", { className: "ws-node-text-card", children: !ne && v.imageUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        "img",
        {
          src: v.imageUrl,
          alt: lr(v) || n.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !ne && v.videoUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        xo,
        {
          src: v.videoUrl,
          poster: v.videoPosterUrl,
          ariaLabel: lr(v) || n.title,
          objectFit: "cover",
          allowDragFromVideo: !0
        },
        v.videoUrl
      ) }) : !ne && v.audioUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ d(
        Le,
        {
          fallback: /* @__PURE__ */ d(Ke, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ d(pc, { src: v.audioUrl })
        }
      ) }) : !ne && v.fileUrl ? /* @__PURE__ */ M("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ d(ui, { size: 16 }),
        /* @__PURE__ */ d("span", { children: lr(v) || "文件内容" })
      ] }) : /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
        ar,
        {
          output: pe,
          fallback: X || v.text || "暂无内容",
          mediaGridKind: Lo(v),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ d(
        ze,
        {
          id: "input-0",
          type: "target",
          position: Oe.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        ze,
        {
          id: "output-0",
          type: "source",
          position: Oe.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ d(
        Er,
        {
          node: n,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ d(Lt, { node: n, selected: t })
    ] });
  }
  if (n.type === "power") {
    const v = qt(s), C = pi(n.power, n.kind), k = Y ? fi(
      v ? [s?.streamOutput, Ms(n)] : Ms(n)
    ) : null, X = vt(n), pe = v ? "running" : s?.status === "error" ? "error" : s?.status === "success" && !X ? "running" : X ? "complete" : "empty", ne = !!(!q && !Y && !oe && s?.streamStarted && (s.streamText || s.streamOutput) && s.status !== "success"), he = ne ? s?.streamOutput ? bn(s.streamOutput, "audio") : {
      text: s?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : qn(n), re = ne ? s?.streamOutput || { text: s?.streamText || "" } : dn(n), te = q || Y || oe || ne || X, Ie = !q && !Y && !oe && !!(he.imageUrl || he.videoUrl || he.audioUrl || he.fileUrl), Re = Co(n, c), fe = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      v ? "is-running" : "",
      n.runError && !v ? "is-error" : "",
      q ? "is-storyboard" : "",
      Y ? "is-storyboard-grid" : "",
      oe ? "is-video-compose" : "",
      C ? "is-audio" : "",
      te ? "has-content" : "",
      Ie ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ M("div", { className: fe, children: [
      /* @__PURE__ */ M("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(
          Wl,
          {
            power: n.power,
            kind: n.kind,
            outputType: n.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ d(
          Cs,
          {
            title: n.title,
            onRename: c && !F ? (ae) => c(n.id, { title: ae, titleMode: "manual" }) : void 0
          }
        ),
        n.storyboardItem?.stale ? /* @__PURE__ */ d(Me, { label: "上游素材或提示词已变化；当前结果仍可使用，重新运行可更新", children: /* @__PURE__ */ d("span", { className: "ws-node-stale-badge", children: "可更新" }) }) : null,
        gd(n) ? /* @__PURE__ */ d("span", { className: "ws-node-prompt-override-badge", children: "提示词已修改" }) : null
      ] }),
      /* @__PURE__ */ M("div", { className: "ws-node-power-card", children: [
        v ? /* @__PURE__ */ M("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
          /* @__PURE__ */ d(
            "rect",
            {
              className: "ws-node-running-track",
              x: "0",
              y: "0",
              width: "100%",
              height: "100%",
              rx: "6",
              pathLength: "100"
            }
          ),
          /* @__PURE__ */ d(
            "rect",
            {
              className: "ws-node-running-progress",
              x: "0",
              y: "0",
              width: "100%",
              height: "100%",
              rx: "6",
              pathLength: "100",
              strokeDasharray: "18 82",
              strokeDashoffset: "0"
            }
          )
        ] }) : null,
        oe ? /* @__PURE__ */ d(
          Le,
          {
            fallback: /* @__PURE__ */ d(Ke, { label: "正在加载视频合成" }),
            children: /* @__PURE__ */ d(
              Yy,
              {
                composition: n.composerDraft?.videoComposition,
                referenceItems: l.filter(
                  (ae) => ae.source !== "current" || ae.id !== n.id
                ),
                connectedMediaReferences: m,
                running: v,
                onChange: N ? (ae) => N(n.id, {
                  ...n.composerDraft || {},
                  videoComposition: ae
                }) : void 0,
                onConnectedMediaEdgeRemove: I,
                onRun: E ? (ae) => {
                  E({
                    ...n,
                    composerDraft: {
                      ...n.composerDraft || {},
                      videoComposition: ae
                    }
                  }).catch(
                    (Fe) => Q.error(
                      Fe instanceof Error ? Fe.message : "视频合成失败"
                    )
                  );
                } : void 0,
                onOpenDetail: a ? () => a(n) : void 0
              }
            )
          }
        ) : q ? /* @__PURE__ */ d(
          Le,
          {
            fallback: /* @__PURE__ */ d(Ke, { label: "正在加载分镜内容", compact: !0 }),
            children: /* @__PURE__ */ d(
              Hy,
              {
                output: v ? s?.streamText || "" : Ms(n),
                status: pe,
                started: !!s?.streamStarted,
                generatedShotCount: s?.generatedCount || 0,
                referenceItems: l.filter(
                  (ae) => ae.source !== "current" || ae.id !== n.id
                ),
                onOpenDetail: X && a ? () => a(n) : void 0
              }
            )
          }
        ) : Y ? /* @__PURE__ */ d(
          Le,
          {
            fallback: /* @__PURE__ */ d(Ke, { label: "正在加载分镜宫格", compact: !0 }),
            children: /* @__PURE__ */ d(
              $l,
              {
                grid: k,
                aspectRatio: pw(n),
                running: v,
                layout: n.composerDraft?.storyboardGridLayout,
                onLayoutChange: N ? (ae) => N(n.id, {
                  ...n.composerDraft || {},
                  storyboardGridLayout: ae
                }) : void 0,
                onImport: w ? () => w(n.id) : void 0,
                onFrameImport: w ? (ae, Fe) => w(n.id, Fe) : void 0,
                onSlotImport: w ? (ae) => w(n.id, ae) : void 0,
                onEdit: k && a ? () => a(n) : void 0
              }
            )
          }
        ) : te ? /* @__PURE__ */ d(
          Fu,
          {
            preview: he,
            output: re,
            fallback: n.description,
            streaming: v && ne,
            generating: v && Ie && !ne,
            videoObjectFit: "cover",
            onMediaSize: Re
          }
        ) : /* @__PURE__ */ d(T_, {})
      ] }),
      n.runError && !v ? /* @__PURE__ */ d(
        R_,
        {
          projectId: o,
          node: n,
          onOpenDetail: a ? () => a(n) : void 0
        }
      ) : null,
      /* @__PURE__ */ d(
        ze,
        {
          id: "input-0",
          type: "target",
          position: Oe.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        ze,
        {
          id: "output-0",
          type: "source",
          position: Oe.Right,
          className: "is-out"
        }
      ),
      q || Y || oe ? null : /* @__PURE__ */ d(
        Er,
        {
          node: n,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ d(Lt, { node: n, selected: t })
    ] });
  }
  return /* @__PURE__ */ M("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ d(
      ze,
      {
        id: "input-0",
        type: "target",
        position: Oe.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ d(
      ze,
      {
        id: "output-0",
        type: "source",
        position: Oe.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ d("div", { className: "ws-node-title", children: n.title }),
    /* @__PURE__ */ d("div", { className: "ws-node-desc", children: n.description }),
    /* @__PURE__ */ d(Er, { node: n, onShowNodeDetail: a }),
    /* @__PURE__ */ d(Lt, { node: n, selected: t })
  ] });
}
function k_(e, t) {
  return e.data === t.data && e.selected === t.selected;
}
function R_({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = Iy(e, t), o = /* @__PURE__ */ M(mn, { children: [
    /* @__PURE__ */ d(hl, { size: 14 }),
    /* @__PURE__ */ d("span", { children: r })
  ] });
  return /* @__PURE__ */ d(Me, { label: r, children: n ? /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: "ws-node-run-error is-action nodrag nowheel",
      "aria-label": `打开错误详情：${r}`,
      onClick: (s) => {
        s.stopPropagation(), n();
      },
      children: o
    }
  ) : /* @__PURE__ */ d("div", { className: "ws-node-run-error", children: o }) });
}
function Fu({
  preview: e,
  output: t,
  fallback: n,
  streaming: r,
  generating: o = !1,
  videoObjectFit: s = "contain",
  onMediaSize: i,
  showMediaCaption: a = !0
}) {
  const c = H(null), u = H(!0), l = a ? lr(e) : "", m = ir(t, e);
  return ce(() => {
    if (!r) {
      u.current = !0;
      return;
    }
    const I = c.current;
    !I || !u.current || (I.scrollTop = I.scrollHeight);
  }, [e.text, r]), !m && e.imageUrl ? /* @__PURE__ */ M(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          ii,
          {
            src: e.imageUrl,
            alt: l || "生成图片",
            onMediaSize: i
          }
        ),
        l ? /* @__PURE__ */ d("p", { children: l }) : null,
        /* @__PURE__ */ d(Os, { active: o })
      ]
    }
  ) : !m && e.videoUrl ? /* @__PURE__ */ M(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          xo,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            ariaLabel: l || "生成视频",
            objectFit: s,
            allowDragFromVideo: !0,
            onMediaSize: i
          },
          e.videoUrl
        ),
        l ? /* @__PURE__ */ d("p", { children: l }) : null,
        /* @__PURE__ */ d(Os, { active: o })
      ]
    }
  ) : !m && e.audioUrl ? /* @__PURE__ */ M(
    "div",
    {
      className: `ws-node-generated-media is-audio ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          Le,
          {
            fallback: /* @__PURE__ */ d(Ke, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ d(pc, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ d(Os, { active: o })
      ]
    }
  ) : !m && e.fileUrl ? /* @__PURE__ */ M("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ d(ui, { size: 16 }),
    /* @__PURE__ */ d("span", { children: l || "文件内容" })
  ] }) : /* @__PURE__ */ d(
    "div",
    {
      ref: c,
      className: "ws-node-generated-text ws-node-scroll-content nowheel",
      onScroll: (I) => {
        const N = I.currentTarget;
        u.current = N.scrollHeight - N.scrollTop - N.clientHeight < 12;
      },
      children: /* @__PURE__ */ d(
        ar,
        {
          output: t,
          fallback: e.text || n,
          streaming: r,
          mediaGridKind: Lo(e),
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function ii({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [o, s] = K(e);
  return ce(() => {
    if (!e || e === o)
      return;
    let i = !0;
    const a = new Image();
    return a.onload = () => {
      (a.decode?.() || Promise.resolve()).catch(() => {
      }).then(() => {
        i && s(e);
      });
    }, a.src = e, () => {
      i = !1, a.onload = null;
    };
  }, [o, e]), /* @__PURE__ */ d(
    "img",
    {
      src: o,
      alt: t,
      className: n,
      loading: "lazy",
      decoding: "async",
      onLoad: (i) => r?.(
        i.currentTarget.naturalWidth,
        i.currentTarget.naturalHeight
      )
    }
  );
}
function Os({ active: e }) {
  return e ? /* @__PURE__ */ M(
    "div",
    {
      className: "ws-node-media-generating nodrag nopan nowheel",
      role: "status",
      "aria-live": "polite",
      onPointerDown: (t) => t.stopPropagation(),
      onClick: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ d(Gt, { size: 18, className: "ws-spin" }),
        /* @__PURE__ */ d("span", { children: "生成中" })
      ]
    }
  ) : null;
}
function lr(e) {
  const t = String(e.text || "").trim();
  return !t || Yt(t) ? "" : t;
}
function A_(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, o = 340;
  let s = r, i = s / n;
  return i > o && (i = o, s = i * n), {
    width: Math.round(Ja(s, 150, r)),
    height: Math.round(Ja(i, 150, o))
  };
}
function Co(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, o) => {
      const s = A_(r, o);
      if (!s)
        return;
      const i = {
        width: s.width,
        height: s.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function Ja(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function T_() {
  return /* @__PURE__ */ M("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {})
  ] });
}
function M_(e) {
  return e.type === "storyboardFrame" ? "ws-minimap-storyboard-frame" : "";
}
function D_(e) {
  return e.type === "storyboardFrame" ? "transparent" : E_(e.data);
}
function E_(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function P_() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
const db = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: fh
}, Symbol.toStringTag, { value: "Module" }));
export {
  qt as A,
  cb as B,
  Ke as C,
  Si as D,
  ng as E,
  jr as F,
  db as G,
  gf as V,
  On as a,
  _i as b,
  Mc as c,
  Rm as d,
  X_ as e,
  Dp as f,
  sb as g,
  nb as h,
  Ac as i,
  rb as j,
  ob as k,
  ab as l,
  ln as m,
  ib as n,
  tb as o,
  Y_ as p,
  Z_ as q,
  _m as r,
  $p as s,
  J_ as t,
  Iy as u,
  Q_ as v,
  yf as w,
  eb as x,
  ap as y,
  ra as z
};
