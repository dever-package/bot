import { a as P, j as d, F as ln, b as Ct, c as Kt } from "./preloadable-Bomi5PEU.js";
import { d as re, a as V, b as pe, e as M, m as ha, u as ue, S as je, g as Vi } from "./_commonjsHelpers-61wyk6v6.js";
import { b as Vf } from "./file-kind-CYMG3EzQ.js";
import { a as Gr, N as Uf, w as Kf, n as qf, g as Gf, B as lc, E as Hf, b as Wf, c as Yf, i as Xf, M as Zf, P as et, H as Jf } from "./normalize-B1Hon0bU.js";
import { m as Qf, aZ as ep, a_ as Nd, x as tp, ay as vd, P as Sd, k as wa, q as Cd, s as np, z as rp, h as op, L as Ui, c as Rd, J as sp, r as fn, j as zs, w as ip, a$ as ap, p as cp, i as dp, C as _a, b as ba, aW as up, X as xd, A as lp, Q as fp, aj as pp, b0 as mp, b1 as gp, aT as yp, b2 as hp, e as kd, l as wp, W as _p, a9 as fc, a8 as pc, ac as bp, b3 as Ip, v as Np } from "./vendor-icons-DwjYEojZ.js";
import { t as L } from "./index-BqbNvFGg.js";
import { a as vp } from "./react-zN02Ae7w.js";
import { p as Hr, s as Ye, q as Sp } from "./site-config-C63CM9jT.js";
import { u as Cp } from "./use-body-appearance-RBVqJFik.js";
import { ah as Et, ai as D, aj as _e, ak as Td, al as Ad, am as Md, an as rt, ao as Ur, ap as Ia, aq as mc, ar as Dd, as as Nt, at as Pd, au as Ed, $ as Na, av as Fd, _ as va, aw as Rp, ax as xp, B as Ve, ay as Od, az as kp, aA as Me, aB as Tp, T as zd, R as Ap, Q as Mp, P as Dp, O as Pp, aC as Kr, aD as Ep, aE as Bd, c as Fp, aF as Op, a1 as Sa, aG as $d, aH as mr, f as Ca, aI as zp, e as Oo, S as Bp, d as $p, U as jp, ac as Lp, aJ as jd, aK as cs, p as zo, i as Vp, aL as Up, aM as Ld, X as Vd, aN as Ud, aO as gc, aP as zr, C as Br, aQ as Bo, aR as _s, aS as Kp, aT as qp, l as Gp, aU as vt, aV as ir, aW as xo, aX as Oe, aY as Kd, aZ as Ki, a_ as Hp, a$ as Wp, b0 as ds, b1 as cr, v as Yp, b2 as Ra, b3 as bs, b4 as qd, A as Gd, b5 as Xp, m as Zp, b6 as Jp } from "./upload-asset-api-DDv34zo1.js";
import { a as $o, r as Ln, n as Qp, e as xa, g as em, i as tm, P as nm } from "./power-icon-DzGqVPMs.js";
import { l as rm, p as om, k as sm, d as Hd, o as im, u as Wd, w as Yd, c as am, n as cm } from "./interaction-BSPeVZBK.js";
import { K as dm, o as um, L as ka, M as lm, N as Xd, O as Zd, n as yc, Q as Ta, y as Jd, z as fm, A as pm, C as mm, B as Qd, R as gm } from "./space-sequence-card-LI0YIDhg.js";
import "./media-inspector-gallery-B4td799W.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-BnOjdTf0.css", import.meta.url).href]);
function Qt(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function eu(e) {
  return Qt(e) === "media";
}
const ym = { width: 720, height: 420 }, hc = { width: 360, height: 240 }, wc = { width: 2400, height: 1600 }, tu = 48, $r = 16;
function nu(e, t) {
  return e.filter((n) => n.groupId === t);
}
function ru(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? nu(e, n.id) : [n] : [];
}
function hm(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function wm(e, t, n) {
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
function _i(e, t, n) {
  const r = e.find((c) => c.id === t), o = r ? ou(e, r) : void 0;
  if (!r || !o)
    return n;
  const s = _c(
    n.x,
    o.x + $r,
    o.x + o.width - $r - r.width
  ), i = _c(
    n.y,
    o.y + tu,
    o.y + o.height - $r - r.height
  );
  return s === n.x && i === n.y ? n : { x: s, y: i };
}
function qi(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group" || ou(e, r))
    return e;
  const o = { ...r, ...n }, s = _m(e, o);
  return (r.groupId || "") === s ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: s || void 0 } : i
  );
}
function Vt(e, t) {
  const n = new Map(e.map((s) => [s.id, s])), r = /* @__PURE__ */ new Set(), o = [];
  for (const s of t) {
    const i = s.logicalFrom || s.from, c = s.logicalTo || s.to, a = n.get(i), f = n.get(c);
    if (!a || !f)
      continue;
    const u = a.groupId !== f.groupId, h = u && a.type !== "group" && a.groupId ? a.groupId : a.id, v = u && f.type !== "group" && f.groupId ? f.groupId : f.id;
    if (!h || !v || h === v)
      continue;
    const N = `${i}\0${c}\0${Qt(s)}`;
    r.has(N) || (r.add(N), o.push({ ...s, from: h, to: v, logicalFrom: i, logicalTo: c }));
  }
  return o;
}
function _m(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.id !== t.id && n >= s.x + $r && n <= s.x + s.width - $r && r >= s.y + tu && r <= s.y + s.height - $r
  ).sort(
    (s, i) => s.width * s.height - i.width * i.height
  )[0]?.id || "";
}
function ou(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (n) => n.id === t.groupId && n.type === "group" && n.group?.origin === "script"
    );
}
function _c(e, t, n) {
  return Math.min(Math.max(e, t), Math.max(t, n));
}
const bm = [
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
function ov(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function sv() {
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
function su(e) {
  const t = Et(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(Nm).filter(Boolean) : [], r = Et(t.settings), o = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(Rm).filter(Boolean) : [];
  return {
    version: 3,
    clips: n,
    audioTracks: o,
    settings: {
      resolution: Te(r.resolution) || "auto",
      fps: gr(r.fps, 0, 120, 0)
    }
  };
}
function iv(e) {
  const t = e.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = e.clips.reduce((r, o, s) => s >= e.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function av(e) {
  const t = e.clips.flatMap(
    (r, o) => r.blockingIssues.map(
      (s) => `${r.title || `镜头 ${o + 1}`}：${s}`
    )
  ), n = e.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function Im(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function cv(e) {
  return e ? [
    Im(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function Nm(e) {
  const t = Et(e), n = Te(t.id);
  if (!n)
    return null;
  const r = Is(
    t.visualVideo ?? t.visual_video
  ), o = Is(
    t.originalAudioSource ?? t.original_audio_source
  ), s = Et(
    t.transitionToNext ?? t.transition_to_next
  ), i = Et(
    t.storyboardTransitionToNext ?? t.storyboard_transition_to_next
  ), c = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map(Cm).filter(Boolean) : [], a = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(Sm).filter(Boolean) : [], f = vm(i), u = au(s.type), h = Te(t.sourceEdgeId ?? t.source_edge_id);
  return {
    id: n,
    title: Te(t.title) || r?.label || "镜头",
    ...h ? { sourceEdgeId: h } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: xm(t.duration),
    originalVolume: gr(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: c,
    subtitleTracks: a,
    useOriginalVideo: cu(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: Tm(t.blockingIssues ?? t.blocking_issues),
    transitionToNext: {
      type: u,
      durationMs: u === "none" ? 0 : gr(
        s.durationMs ?? s.duration_ms,
        100,
        5e3,
        500
      )
    },
    ...f ? { storyboardTransitionToNext: f } : {}
  };
}
function vm(e) {
  if (!Object.keys(e).length)
    return;
  const t = au(e.type);
  return {
    type: t,
    durationMs: t === "none" ? 0 : gr(e.durationMs ?? e.duration_ms, 100, 5e3, 500)
  };
}
function Sm(e) {
  const t = Et(e), n = Te(t.id), r = Te(t.text);
  if (!n || !r)
    return null;
  const o = Te(t.source) === "speech" ? "speech" : "caption", s = Te(t.speechId ?? t.speech_id), i = D(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, D(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...s ? { speechId: s } : {},
    source: o
  };
}
function Cm(e) {
  const t = Et(e), n = Te(t.id);
  if (!n)
    return null;
  const r = Is(t.audio), o = Te(t.kind) === "narration" ? "narration" : "dialogue", s = Te(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, D(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, D(t.sourceStart ?? t.source_start)),
    fit: iu(t.fit, "trim"),
    kind: o,
    ...s ? { characterId: s } : {},
    text: Te(t.text),
    volume: gr(t.volume, 0, 1, 1)
  };
}
function Rm(e) {
  const t = Et(e), n = Te(t.id);
  if (!n)
    return null;
  const r = Is(t.audio), o = Te(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, D(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, D(t.sourceStart ?? t.source_start)),
    kind: o,
    volume: gr(t.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: iu(t.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && cu(t.loop),
    fadeOut: gr(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function iu(e, t) {
  return Te(e) === "strict" ? "strict" : Te(e) === "trim" ? "trim" : t;
}
function xm(e) {
  const t = D(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Is(e) {
  const t = Et(e), n = D(t.assetId ?? t.asset_id), r = D(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const o = km(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: Te(t.label),
    ...D(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: D(t.mediaIndex ?? t.media_index) } : {},
    ...Te(t.mediaUrl ?? t.media_url) ? { mediaUrl: Te(t.mediaUrl ?? t.media_url) } : {},
    ...Te(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: Te(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function km(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Et(r), s = Te(o.url), i = D(o.index);
    if (!s && i <= 0)
      continue;
    const c = i > 0 ? `index:${i}` : `url:${s}`;
    n.has(c) || (n.add(c), t.push({
      url: s,
      index: i > 0 ? i : 0,
      ...Te(o.usage) ? { usage: Te(o.usage) } : {}
    }));
  }
  return t;
}
function au(e) {
  const t = Te(e);
  return bm.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function Te(e) {
  return String(e ?? "").trim();
}
function Tm(e) {
  return Array.isArray(e) ? e.map(Te).filter(Boolean) : [];
}
function gr(e, t, n, r) {
  const o = Number(e);
  return Number.isFinite(o) ? Math.min(n, Math.max(t, o)) : r;
}
function cu(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
function ar(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function du(e) {
  const t = String(e.status || "").trim();
  if (!t)
    return !1;
  const n = Gr(t);
  return n === "pending" || n === "running" || n === "waiting";
}
function Bn(e) {
  const t = e?.output && typeof e.output == "object" ? e.output : {}, n = e?.run && typeof e.run == "object" ? e.run : {};
  return {
    execution_id: Number(e?.execution_id || 0),
    canvas_id: Number(e?.canvas_id || 0),
    run_id: Number(e?.run_id || n.id || 0),
    request_id: String(e?.request_id || n.request_id || ""),
    asset_cate_id: Number(e?.asset_cate_id || 0),
    start_node_id: String(e?.start_node_id || ""),
    execution_scope: String(
      e?.execution_scope || t.execution_scope || ""
    ),
    flow_run_id: Number(e?.flow_run_id || n.flow_run_id || 0),
    release_id: Number(e?.release_id || n.release_id || 0),
    status: Gr(e?.status || n.status),
    error: pn(e?.error || n.error),
    executed: Number(e?.executed || e?.output?.executed || 0),
    total: Number(e?.total || e?.output?.total || 0),
    single_node: !!e?.single_node,
    created_at: String(e?.created_at || ""),
    updated_at: String(e?.updated_at || ""),
    title: String(e?.title || ""),
    output: e?.output || n.output,
    approvals: Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [],
    interactions: Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [],
    node_results: uu(
      e?.node_results || t.node_results
    ),
    pending_node: Aa(
      e?.pending_node || t.pending_node
    ),
    execution_plan: Em(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(zm).filter((r) => !!r) : []
  };
}
function Aa(e) {
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
    status: Gr(e.status),
    error: pn(e.error),
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
function uu(e) {
  return Array.isArray(e) ? e.map(Aa).filter((t) => !!t) : [];
}
function Am(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = uu(e.node_results), o = n ? r.find((s) => s.node_key === n) : r[0];
  return o || Aa(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function Ma(e) {
  return e ? mu(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function lu(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => Gr(
    n.status || n.result?.status
  ) === "fail");
  return mu(
    Ma(t),
    e.output?.error,
    e.error
  );
}
function Mm(e, t = "节点运行失败") {
  return Da(
    Ma(e),
    t
  );
}
function fu(e, t = "画布运行失败") {
  return Da(lu(e), t);
}
function Da(e, t = "运行失败") {
  const n = pn(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function Dm(...e) {
  for (const t of e) {
    const n = pn(t);
    if (n)
      return n;
  }
  return "";
}
const pu = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function Pm(e) {
  return pu.has(pn(e));
}
function Io(e) {
  const t = pn(e);
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function mu(...e) {
  let t = "";
  for (const n of e) {
    const r = pn(n);
    if (r && (t ||= r, !pu.has(r)))
      return r;
  }
  return t;
}
function pn(e) {
  if (typeof e == "string")
    return e.trim();
  if (e instanceof Error)
    return e.message.trim();
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e, n = Dm(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = pn(t.code), o = pn(t.detail);
  return [r, o].filter(Boolean).join(": ");
}
function Em(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(Fm).filter((r) => !!r) : [], n = Array.isArray(e.edges) ? e.edges.map(Om).filter((r) => !!r) : [];
  return {
    nodes: t,
    edges: n,
    incoming: bc(e.incoming),
    outgoing: bc(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function Fm(e) {
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
function Om(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function bc(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const o = Array.isArray(r) ? r.map((s) => String(s || "")).filter(Boolean) : [];
    t.set(String(n), o);
  }
  return t;
}
function zm(e) {
  const t = String(e?.node_key || ""), n = Number(e?.node_run_id || 0);
  return !t || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(e?.node_id || 0),
    node_key: t,
    node_type: String(e?.node_type || ""),
    status: Gr(e?.status),
    persists_result: !!e?.persists_result
  };
}
const ps = "primary_text", Bm = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), $m = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), Wr = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function jm(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = String(r.key || "").trim(), s = String(r.type || "").trim().toLowerCase(), i = String(r.value_type || "string").trim().toLowerCase();
    !o || Wr.has(o) || t.has(o) || !Bm.has(s) || i === "number" || (t.add(o), n.push(o === r.key ? r : { ...r, key: o }));
  }
  return n;
}
function gu(e, t, n) {
  const r = n.trim(), o = Vn(t?.paramBindings);
  return jm(e).filter(
    (s) => hu(o, s.key, r)
  );
}
function Lm(e, t, n) {
  return hu(
    Vn(e?.paramBindings),
    t,
    n
  );
}
function Vm(e) {
  if (e.length !== 1)
    return;
  const t = e[0], n = String(t.key || "").trim();
  return n && !Wr.has(n) ? n : void 0;
}
function Gi(e) {
  const t = Vm(e);
  return t ? { kind: "automatic", targetParamKey: t } : e.length > 1 ? { kind: "choose", params: e } : { kind: "unavailable" };
}
function Um(e, t, n = !1) {
  const r = (t?.length || 0) + (n ? 1 : 0);
  if (e) {
    let o = r;
    (e.purpose === "storyboard_lyrics" && n || e.purpose !== "storyboard_lyrics" && e.targetParamKey && t?.some((i) => i.key === e.targetParamKey)) && (o -= 1);
    const s = !!(t && o > 0);
    return {
      label: e.label,
      interactive: s,
      showChevron: s,
      invalid: !1
    };
  }
  return t && r === 0 ? {
    label: "无效连接",
    interactive: !1,
    showChevron: !1,
    invalid: !0
  } : {
    label: "待绑定",
    interactive: !0,
    showChevron: !!(t && r > 1),
    invalid: !1
  };
}
function Km(e, t, n) {
  const r = Vn(t?.paramBindings), o = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), s = [
    ...new Set(e.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !o.has(a));
  if (s.length !== 1)
    return;
  const i = s[0], c = Gi(
    gu(n, t, i)
  );
  return c.kind === "automatic" ? { sourceNodeId: i, targetParamKey: c.targetParamKey } : void 0;
}
function qm(e) {
  return Hi(e.type) === "prompt" || Hi(e.key) === "prompt" ? "提示词" : String(e.name || "").trim() || "文本参数";
}
function Mr(e) {
  return e ? e.type === "agent" ? !0 : e.type === "power" ? Ii(e.power?.kind, e.kind, e.outputType) : e.type === "asset" ? Ii(e.asset?.kind, e.kind, e.outputType) : Ii(e.kind, e.outputType) : !1;
}
function us(e) {
  return !!(e?.type === "power" && e.composerDraft?.storyboardWorkType === "mv" && $o(e.power, e.kind, e.outputType));
}
function Vn(e) {
  const t = Ic(e), n = [];
  for (const [r, o] of Object.entries(t)) {
    const s = r.trim(), i = Ic(o), c = String(
      i.sourceNodeId ?? i.source_node_id ?? ""
    ).trim(), a = String(
      i.sourceOutput ?? i.source_output ?? ps
    ).trim().toLowerCase();
    !s || Wr.has(s) || !c || a !== ps || n.push([
      s,
      {
        sourceNodeId: c,
        sourceOutput: ps
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function Gm(e) {
  const t = Vn(e);
  if (t)
    return Object.fromEntries(
      Object.entries(t).map(([n, r]) => [
        n,
        {
          source_node_id: r.sourceNodeId,
          source_output: r.sourceOutput
        }
      ])
    );
}
function Hm(e, t, n) {
  const r = t.trim(), o = n.trim();
  return !r || Wr.has(r) || !o ? e : {
    ...e,
    paramBindings: {
      ...Vn(e.paramBindings) || {},
      [r]: {
        sourceNodeId: o,
        sourceOutput: ps
      }
    }
  };
}
function Wm(e, t, n) {
  const r = t.trim();
  if (!r)
    return e;
  const o = n.trim();
  return !o || Wr.has(o) ? e : Hm(
    Ns(e, r),
    o,
    r
  );
}
function Ym(e, t, n = []) {
  const r = t.trim(), o = Vn(e?.paramBindings);
  if (!r || !o)
    return;
  const s = Object.entries(o).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (s.length === 0)
    return;
  const i = new Map(
    n.map((a) => [a.key.trim(), qm(a)])
  ), c = s.map(
    (a) => i.get(a) || "文本参数"
  );
  return {
    targetParamKeys: s,
    targetParamKey: s.length === 1 ? s[0] : void 0,
    label: c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`
  };
}
function bi(e, t, n = []) {
  const r = t.trim();
  if (r && String(e?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const o = Ym(e, r, n);
  return o ? { ...o, purpose: "param" } : void 0;
}
function Xm(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = yu(e, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function yu(e, t) {
  const n = t.trim(), r = Vn(e.paramBindings);
  if (!n || !r)
    return e;
  const o = Object.fromEntries(
    Object.entries(r).filter(
      ([, s]) => s.sourceNodeId !== n
    )
  );
  return Object.keys(o).length === Object.keys(r).length ? e : Jm(e, o);
}
function Ns(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = yu(e, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: o, ...s } = r;
  return s;
}
function Zm(e, t) {
  if (t.size === 0)
    return e;
  let n = !1;
  const r = e.map((o) => {
    let s = o.composerDraft;
    if (!s?.paramBindings && !s?.storyboardLyricsSourceNodeId)
      return o;
    for (const i of t)
      s = Ns(s, i);
    return s === o.composerDraft ? o : (n = !0, { ...o, composerDraft: s });
  });
  return n ? r : e;
}
function Hi(e) {
  return String(e || "").trim().toLowerCase();
}
function Ii(...e) {
  const t = e.map(Hi).find(Boolean) || "";
  return $m.has(t);
}
function Jm(e, t) {
  const { paramBindings: n, ...r } = e;
  return Object.keys(t).length > 0 ? { ...r, paramBindings: t } : r;
}
function hu(e, t, n) {
  const r = t.trim(), o = n.trim();
  if (!r || Wr.has(r) || !o)
    return !1;
  const s = e?.[r];
  return !s || s.sourceNodeId === o;
}
function Ic(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const Wi = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, Qm = { width: 180, height: 180 }, eg = { width: 240, height: 160 }, tg = { width: 620, height: 360 };
function ng(e) {
  const t = he(e);
  return {
    project: dg(t.project),
    team: ug(t.team),
    release: lg(t.release),
    assetCates: Dt(t.asset_cates).map(fg),
    flows: Dt(t.flows).map(mg),
    canvasList: Dt(t.canvas_list).map(Bs),
    canvases: yg(t.canvas),
    assets: Dt(he(t.assets).items).map(Cu),
    assistant: rg(t.assistant),
    initialCanvasId: D(t.active_canvas_id),
    initialAssetCateId: D(t.active_asset_cate_id)
  };
}
function Bs(e) {
  const t = he(e);
  return {
    id: D(t.id),
    projectId: D(t.project_id),
    assetCateId: D(t.asset_cate_id),
    name: x(t.name) || "第一幕",
    sort: D(t.sort),
    status: D(t.status),
    updatedAt: x(t.updated_at),
    deletedAt: x(t.deleted_at)
  };
}
function rg(e) {
  const t = he(e);
  return {
    available: !!t.available,
    reason: x(t.reason),
    releaseID: D(t.release_id),
    roleID: D(t.role_id),
    roleType: x(t.role_type),
    name: x(t.name) || "画布助手",
    assignment: x(t.assignment),
    agentID: D(t.agent_id),
    agentKey: x(t.agent_key),
    contextKey: x(t.context_key),
    openingEnabled: !!t.opening_enabled
  };
}
function Nc(e, t = 0, n = "第一幕") {
  return {
    id: t,
    name: n,
    sort: 0,
    status: 1,
    assetCateId: e,
    nextNodeNo: 1,
    nodes: [],
    edges: [],
    viewport: {}
  };
}
function Pa(e, t = 0) {
  const n = he(e), r = D(
    _e(n.asset_cate_id, t)
  );
  return wu({
    id: D(n.id),
    name: x(n.name) || "第一幕",
    sort: D(n.sort),
    status: D(n.status) || 1,
    assetCateId: r,
    nextNodeNo: Math.max(1, D(n.next_node_no)),
    nodes: Dt(n.nodes).map(wg).filter((o) => !!o),
    edges: Dt(n.edges).map(Eg).filter((o) => !!o),
    viewport: Fg(n.viewport),
    updatedAt: x(n.updated_at)
  });
}
function wu(e) {
  let t = Ea(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((o) => {
    if (!_u(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const s = t++, i = o.titleMode || "manual";
    return n = !0, {
      ...o,
      nodeNo: s,
      titleMode: i,
      ...i === "auto" && !o.storyboardItem ? { title: bu(o, s) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function Ea(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function _u(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function bu(e, t) {
  let n = "节点";
  if (e.type === "power") {
    const r = Ln(
      e.power,
      e.kind,
      e.outputType
    );
    n = r.outputType !== "general" && r.outputName || r.kindName;
  } else e.type === "agent" ? n = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (n = String(e.flow?.name || "流程").trim() || "流程");
  return `${n}-${t}`;
}
function og(e) {
  const t = he(e);
  return {
    roles: Dt(t.roles).map(pg),
    powers: Dt(t.powers).map(Nu),
    powerCategories: Dt(t.power_cates).map(Qp),
    powerKinds: Dt(t.power_kinds).map(gg),
    outputTypes: Dt(t.output_types).map(Su)
  };
}
function dr(e) {
  return Cu(he(e));
}
function Iu(e) {
  return e.assetCates.length > 0 ? e.assetCates : [Wi];
}
function sg(e) {
  return Iu(e)[0]?.id ?? 0;
}
function Yi(e, t) {
  const n = e.length > 0 ? e : [Wi];
  return n.find((r) => r.id === t) || n[0] || Wi;
}
function Ni(e, t) {
  return Yi(e.assetCates, t);
}
function ig(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => Og(n).has(t)).slice(0, 4);
}
function ag(e) {
  return e.create_status !== 2;
}
function cg(e) {
  return e.createStatus !== 2;
}
function $s(e, t, n, r, o) {
  const s = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, c = o?.asset, a = o?.flow, f = o?.functionOption, u = o?.power, h = o?.role, v = u ? Ln(u) : null, N = Number(c?.asset_cate_id || t.id), _ = {
    asset: [
      c?.name || "资产引用",
      c ? mc(c.kind) : mc(t.kind),
      c && Dd(c.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      u?.name || zg(t.kind),
      v?.outputName || v?.kindName || "能力节点",
      u ? `调用 ${u.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      h?.name || "智能体节点",
      h?.role_type || "角色执行",
      h?.assignment || "调用团队角色或指定智能体完成一段任务。"
    ],
    flow: [
      a?.name || "流程节点",
      "团队流程",
      a?.goal || "执行一组团队预设流程。"
    ],
    function: [
      f?.label || "保存节点",
      "功能",
      f?.description || "开始、引用、保存、展示等功能节点。"
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。"
    ]
  }, [R, E, K] = _[e], Y = xu(e, u);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: R,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: E,
    description: K,
    x: s,
    y: i,
    width: Y.width,
    height: Y.height,
    assetCateId: N,
    kind: c?.kind || u?.kind || t.kind,
    outputType: u?.outputType,
    cardinality: t.cardinality,
    asset: c,
    flow: a,
    functionOption: f,
    power: u,
    role: h,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function dg(e) {
  const t = he(e), n = he(t.team);
  return {
    id: D(t.id),
    body_id: D(t.body_id),
    team_id: D(t.team_id),
    release_id: D(t.release_id),
    name: x(t.name) || "未命名作品",
    description: x(t.description),
    mode: x(t.mode) || "team",
    team: {
      id: D(n.id),
      name: x(n.name),
      version: D(n.version)
    }
  };
}
function ug(e) {
  const t = he(e);
  return {
    id: D(t.id),
    name: x(t.name) || "自由团队",
    description: x(t.description)
  };
}
function lg(e) {
  const t = he(e);
  return {
    id: D(t.id),
    team_id: D(t.team_id),
    version: D(t.version),
    status: x(t.status)
  };
}
function fg(e) {
  return {
    id: D(e.id),
    team_id: D(e.team_id),
    name: x(e.name) || "未命名资产",
    kind: x(e.kind) || "text",
    cardinality: x(e.cardinality) || "single",
    status: D(e.status),
    sort: D(e.sort)
  };
}
function pg(e) {
  return {
    id: D(e.id),
    team_id: D(e.team_id),
    role_type: x(e.role_type),
    role_key: x(e.role_key),
    name: x(e.name),
    agent_id: D(e.agent_id),
    assignment: x(e.assignment),
    create_status: vu(e.create_status)
  };
}
function mg(e) {
  return {
    id: D(e.id),
    name: x(e.name),
    key: x(e.key),
    goal: x(e.goal),
    config: he(e.config),
    status: D(e.status),
    sort: D(e.sort),
    output_asset_cate_ids: Tu(e.output_asset_cate_ids)
  };
}
function Nu(e) {
  const t = x(e.kind) || "text", n = Su(he(e.output)), r = x(e.output_type) || "general";
  return {
    id: D(e.id),
    cate_id: D(e.cate_id),
    name: x(e.name) || x(e.key) || "未命名能力",
    key: x(e.key),
    icon: x(e.icon),
    description: x(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: vu(e.create_status)
  };
}
function vu(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Su(e) {
  return {
    key: x(e.key),
    name: x(e.name),
    allowedKinds: ms(e.allowed_kinds),
    viewMode: x(e.view_mode),
    defaultWidth: D(e.default_width),
    defaultHeight: D(e.default_height),
    structured: !!e.structured,
    sort: D(e.sort)
  };
}
function gg(e) {
  return {
    id: x(e.id),
    value: x(e.value) || x(e.name) || x(e.id)
  };
}
function Cu(e) {
  const t = Fa(he(e.version)), n = Oa(e.versions);
  return {
    id: D(e.id),
    project_id: D(_e(e.project_id, e.projectID)),
    body_id: D(_e(e.body_id, e.bodyID)),
    team_id: D(_e(e.team_id, e.teamID)),
    flow_id: D(_e(e.flow_id, e.flowID)),
    canvas_id: D(_e(e.canvas_id, e.canvasID)),
    asset_cate_id: D(
      _e(e.asset_cate_id, e.assetCateID)
    ),
    node_key: x(_e(e.node_key, e.nodeKey)),
    name: x(e.name),
    kind: x(e.kind) || "text",
    role: x(e.role),
    version_id: D(_e(e.version_id, e.versionID)),
    status: x(e.status),
    sort: D(e.sort),
    created_at: x(_e(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function Fa(e) {
  const t = D(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: D(_e(e.asset_id, e.assetID)),
      run_id: D(_e(e.run_id, e.runID)),
      node_run_id: D(_e(e.node_run_id, e.nodeRunID)),
      release_id: D(_e(e.release_id, e.releaseID)),
      request_id: x(_e(e.request_id, e.requestID)),
      node_key: x(_e(e.node_key, e.nodeKey)),
      source: he(e.source),
      version: D(e.version),
      summary: x(e.summary),
      content: e.content,
      created_at: x(_e(e.created_at, e.createdAt)),
      updated_at: x(_e(e.updated_at, e.updatedAt))
    };
}
function Oa(e) {
  return Dt(e).map(Fa).filter((t) => !!t);
}
function yg(e) {
  const t = he(e), n = {};
  for (const [r, o] of Object.entries(t)) {
    const s = Pa(o), i = s.id || D(r);
    i > 0 && (n[String(i)] = { ...s, id: i });
  }
  return n;
}
function hg(e, t) {
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
      const c = s.outputType || s.power.outputType || i.outputType;
      return {
        ...s,
        outputType: c,
        power: {
          ...i,
          outputType: c,
          output: i.outputType === c ? i.output : s.power.output
        }
      };
    });
  return e;
}
function Dr(e, t) {
  const n = String(e.id);
  return hg({ [n]: e }, t)[n];
}
function wg(e) {
  const t = x(e.id), n = x(e.type);
  if (!t || !n)
    return null;
  const r = x(e.run_error), o = Rg(e.function_option), s = x(e.title), i = x(e.description), c = o?.key === "import", a = {
    id: t,
    nodeNo: D(e.node_no) || void 0,
    type: n,
    title: c && s === "导入" ? "引用" : s,
    titleMode: x(e.title_mode) === "manual" ? "manual" : x(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: x(e.subtitle),
    description: c && (!i || i === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : i,
    x: D(e.x),
    y: D(e.y),
    width: D(e.width),
    height: D(e.height),
    groupId: x(e.group_id),
    group: bg(e.group),
    storyboardItem: Ig(e.storyboard_item),
    storyboardMaterializedSignature: x(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: Ur(
      e.storyboard_frame_plan_version
    ),
    assetCateId: D(e.asset_cate_id),
    outputType: x(e.output_type),
    count: e.count == null ? void 0 : D(e.count),
    functionOption: o,
    composerDraft: Ag(e.composer_draft),
    resultRef: Pg(e.result_ref),
    resultOutput: e.result_output,
    resultView: _g(e.result_view),
    runError: Io(r) ? "" : r,
    local: e.local !== !1
  }, f = x(e.kind), u = x(
    e.cardinality
  ), h = Ng(e.flow), v = vg(e.role), N = Sg(e.asset), _ = Cg(e.power);
  return f && (a.kind = f), u && (a.cardinality = u), h && (a.flow = h), v && (a.role = v), N && (a.asset = N), _ && (a.power = _, a.outputType = a.outputType || _.outputType), a;
}
function _g(e) {
  const t = he(e), n = Nt(t.width), r = Nt(t.height);
  if (n == null || r == null || n <= 0 || r <= 0)
    return;
  const o = Nt(t.offset_x), s = Nt(t.offset_y);
  return {
    width: n,
    height: r,
    ...o == null ? {} : { offsetX: o },
    ...s == null ? {} : { offsetY: s }
  };
}
function bg(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return {
      origin: x(t.origin),
      sourceNodeId: x(t.source_node_id),
      syncKey: x(t.sync_key),
      layoutKey: x(t.layout_key)
    };
}
function Ig(e) {
  const t = he(e), n = x(t.source_node_id), r = x(t.item_type), o = x(t.item_id);
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
      generatedPrompt: x(t.generated_prompt),
      dependencyNodeIds: ms(t.dependency_node_ids),
      referenceNodeIds: ms(t.reference_node_ids),
      externalReferenceAssetIds: Tu(t.external_reference_asset_ids),
      shotId: x(t.shot_id),
      shotImageMode: va(t.shot_image_mode),
      frameRole: Fd(t.frame_role),
      frameMediaItems: Na(t.frame_media_items),
      imageSequenceFrames: Ed(
        t.image_sequence_frames
      ),
      speechId: x(t.speech_id),
      speechIds: ms(t.speech_ids),
      characterId: x(t.character_id),
      speechKind: x(t.speech_kind),
      speakerMode: x(t.speaker_mode),
      startTime: Nt(t.start_time),
      shotDuration: Nt(t.shot_duration),
      requiredDurationValues: Pd(
        t.required_duration_values
      ),
      continuityAnchor: x(t.continuity_anchor),
      optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true",
      sourceSignature: x(t.source_signature),
      resultSourceSignature: x(t.result_source_signature),
      stale: t.stale === !0 || t.stale === 1 || String(t.stale || "").toLowerCase() === "true"
    };
}
function Ng(e) {
  const t = he(e), n = D(t.id), r = x(t.key), o = x(t.name);
  if (!(!n && !r && !o))
    return {
      id: n,
      key: r,
      name: o,
      goal: x(t.goal)
    };
}
function vg(e) {
  const t = he(e), n = D(t.id), r = x(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: x(t.role_type),
      agent_id: D(t.agent_id)
    };
}
function Sg(e) {
  const t = he(e), n = D(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: D(t.asset_cate_id),
      name: x(t.name),
      kind: x(t.kind),
      role: x(t.role),
      version_id: D(t.version_id),
      sort: 0
    };
}
function Cg(e) {
  const t = he(e), n = D(t.id), r = x(t.key);
  if (!(!n && !r))
    return Nu({
      ...t,
      id: n,
      key: r,
      name: x(t.name)
    });
}
function Rg(e) {
  const t = he(e), n = x(t.key);
  if (!n)
    return;
  const r = x(t.label), o = x(t.description);
  return {
    key: n,
    label: n === "import" && (!r || r === "导入") ? "引用" : r,
    description: n === "import" && (!o || o === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : o
  };
}
function Ru(e) {
  const t = he(e);
  if (!Object.keys(t).length)
    return;
  const n = x(t.storyboardGridLayout);
  return {
    prompt: x(t.prompt),
    promptContent: Dg(t.promptContent),
    paramValues: he(t.paramValues),
    paramBindings: Vn(t.paramBindings),
    selectedTargetId: D(t.selectedTargetId),
    videoComposition: su(t.videoComposition),
    storyboardReferences: Md(
      t.storyboardReferences
    ),
    storyboardWorkType: Mg(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: x(t.storyboardLyricsSourceNodeId),
    minShotDuration: Ad(t.minShotDuration),
    storyboardRangeStartMs: Sc(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: Sc(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: n ? Td(n) : void 0,
    multiImageMode: Tg(t.multiImageMode)
  };
}
function za(e) {
  return Ru(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function xg(e) {
  const t = za(e), n = kg(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function vc(e) {
  return JSON.stringify([
    e.prompt,
    e.promptContent || null,
    e.paramValues || {},
    e.paramBindings || {},
    e.selectedTargetId || 0,
    e.storyboardReferences || [],
    e.storyboardWorkType || "",
    e.storyboardLyricsSourceNodeId || "",
    e.minShotDuration || "",
    e.storyboardRangeStartMs ?? "",
    e.storyboardRangeEndMs ?? "",
    e.storyboardGridLayout || "",
    e.multiImageMode || ""
  ]);
}
function dv(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function kg(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function Tg(e) {
  const t = x(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function Ag(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return Ru({
      prompt: t.prompt,
      promptContent: t.prompt_content,
      paramValues: t.param_values,
      paramBindings: t.param_bindings,
      selectedTargetId: t.selected_target_id,
      videoComposition: t.video_composition,
      storyboardReferences: t.storyboard_references,
      storyboardWorkType: t.storyboard_work_type,
      storyboardLyricsSourceNodeId: t.storyboard_lyrics_source_node_id,
      minShotDuration: t.min_shot_duration,
      storyboardRangeStartMs: t.storyboard_range_start_ms,
      storyboardRangeEndMs: t.storyboard_range_end_ms,
      storyboardGridLayout: t.storyboard_grid_layout,
      multiImageMode: t.multi_image_mode
    });
}
function Mg(e) {
  const t = x(e);
  return Ia(t) ? t : void 0;
}
function Sc(e, t) {
  const n = Nt(e);
  if (!(n == null || !Number.isInteger(n) || n < (t ? 0 : 1)))
    return n;
}
function Dg(e) {
  const t = he(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const o = he(r);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function Pg(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return {
      run_id: D(t.run_id),
      request_id: x(t.request_id),
      flow_run_id: D(t.flow_run_id),
      node_run_id: D(t.node_run_id),
      asset_id: D(t.asset_id),
      version_id: D(t.version_id),
      release_id: D(t.release_id),
      role: x(t.role),
      status: x(t.status),
      updated_at: x(t.updated_at)
    };
}
function Eg(e) {
  const t = x(e.from), n = x(e.to);
  if (!t || !n)
    return null;
  const r = x(e.purpose);
  return {
    id: x(e.id) || `edge-${t}-${n}`,
    from: t,
    to: n,
    logicalFrom: x(e.logical_from) || void 0,
    logicalTo: x(e.logical_to) || void 0,
    purpose: r === "media" || r === "structure" || r === "dependency" ? r : void 0,
    executionMode: x(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: x(e.media_usage) || void 0
  };
}
function Fg(e) {
  const t = he(e), n = {};
  return t.x != null && (n.x = D(t.x)), t.y != null && (n.y = D(t.y)), t.zoom != null && (n.zoom = D(t.zoom)), n;
}
function Og(e) {
  return new Set(e.output_asset_cate_ids);
}
function zg(e) {
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
function xu(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...ym };
    case "power":
      return js(t);
    default:
      return { width: 250, height: 170 };
  }
}
function js(e) {
  if (xa(e))
    return { ...eg };
  const t = Bg(e);
  return t || ($o(e) ? { ...tg } : { ...Qm });
}
function Bg(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function ku(e) {
  const t = xu(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function ms(e) {
  return Array.isArray(e) ? e.map(x).filter(Boolean) : [];
}
function Tu(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = D(r);
    !o || o <= 0 || n.has(o) || (n.add(o), t.push(o));
  }
  return t;
}
function Dt(e) {
  return Array.isArray(e) ? e.filter(rt) : [];
}
function he(e) {
  return rt(e) ? e : {};
}
function x(e) {
  return e == null ? "" : String(e).trim();
}
function $g(e) {
  const t = new Map(e.nodes.map((o) => [o.id, o]));
  let n = !1;
  const r = e.nodes.map((o) => {
    const s = o.storyboardItem?.dependencyNodeIds || [];
    if (o.storyboardItem?.itemType !== "shot" || !o.storyboardItem.continuityAnchor || s.length !== 1)
      return o;
    const i = s[0], c = jg(t.get(i)), a = (o.storyboardItem.referenceNodeIds || []).filter(
      (N) => N !== i
    ), f = o.composerDraft?.promptContent, u = f && {
      ...f,
      parts: f.parts.filter(
        (N) => N.type !== "reference" || N.ref_type !== "asset" || !c || Number(N.ref_id || 0) !== c
      )
    }, h = a.length !== (o.storyboardItem.referenceNodeIds || []).length, v = u?.parts.length !== f?.parts.length;
    return !h && !v ? o : (n = !0, {
      ...o,
      storyboardItem: {
        ...o.storyboardItem,
        referenceNodeIds: a
      },
      composerDraft: o.composerDraft ? { ...o.composerDraft, promptContent: u } : o.composerDraft
    });
  });
  return n ? { ...e, nodes: r } : e;
}
function jg(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function Au(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(Lg),
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
function Lg(e) {
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
  if (bo(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), Mt(t, "group_id", e.groupId), e.group) {
    const i = {};
    Mt(i, "origin", e.group.origin), Mt(i, "source_node_id", e.group.sourceNodeId), Mt(i, "sync_key", e.group.syncKey), Mt(i, "layout_key", e.group.layoutKey), Object.keys(i).length > 0 && (t.group = i);
  }
  if (e.storyboardItem) {
    const i = e.storyboardItem, c = va(i.shotImageMode), a = Fd(i.frameRole), f = Na(
      i.frameMediaItems
    ), u = Ed(
      i.imageSequenceFrames
    ), h = Pd(
      i.requiredDurationValues
    );
    t.storyboard_item = {
      source_node_id: i.sourceNodeId,
      item_type: i.itemType,
      item_id: i.itemId,
      ...i.generatedPrompt ? { generated_prompt: i.generatedPrompt } : {},
      dependency_node_ids: i.dependencyNodeIds || [],
      reference_node_ids: i.referenceNodeIds || [],
      external_reference_asset_ids: i.externalReferenceAssetIds || [],
      ...i.shotId ? { shot_id: i.shotId } : {},
      ...c ? { shot_image_mode: c } : {},
      ...a ? { frame_role: a } : {},
      ...f.length ? {
        frame_media_items: f.map((v) => ({
          frame_role: v.frameRole,
          media_index: v.mediaIndex
        }))
      } : {},
      ...u.length ? { image_sequence_frames: u } : {},
      ...i.speechId ? { speech_id: i.speechId } : {},
      ...i.speechIds?.length ? { speech_ids: i.speechIds } : {},
      ...i.characterId ? { character_id: i.characterId } : {},
      ...i.speechKind ? { speech_kind: i.speechKind } : {},
      ...i.speakerMode ? { speaker_mode: i.speakerMode } : {},
      ...Number.isFinite(i.startTime) ? { start_time: i.startTime } : {},
      ...Number.isFinite(i.shotDuration) ? { shot_duration: i.shotDuration } : {},
      ...h.length > 0 ? { required_duration_values: h } : {},
      ...i.continuityAnchor ? { continuity_anchor: i.continuityAnchor } : {},
      ...i.optional ? { optional: !0 } : {},
      ...i.sourceSignature ? { source_signature: i.sourceSignature } : {},
      ...i.resultSourceSignature ? { result_source_signature: i.resultSourceSignature } : {},
      ...i.stale ? { stale: !0 } : {}
    };
  }
  Mt(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), bo(
    t,
    "storyboard_frame_plan_version",
    Ur(e.storyboardFramePlanVersion)
  ), bo(t, "asset_cate_id", e.assetCateId), Mt(t, "kind", e.kind), Mt(t, "output_type", e.outputType), Mt(t, "cardinality", e.cardinality), bo(t, "count", e.count), e.flow && (t.flow = {
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
    output: Kg(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = Ug(e.composerDraft);
  n && (t.composer_draft = n);
  const r = Wg(e.resultRef);
  r && (t.result_ref = r), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && En(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = Vg(e.resultView);
  return s && (t.result_view = s), Io(e.runError) || Mt(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Vg(e) {
  if (!e)
    return;
  const t = Nt(e.width), n = Nt(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, o = Nt(e.offsetX), s = Nt(e.offsetY);
  return o != null && (r.offset_x = o), s != null && (r.offset_y = s), r;
}
function Ug(e) {
  if (!rt(e))
    return null;
  const t = {};
  Mt(t, "prompt", e.prompt);
  const n = qg(e.promptContent);
  n && En(n) && (t.prompt_content = n), bo(t, "selected_target_id", e.selectedTargetId);
  const r = Gg(e.paramValues);
  r && (t.param_values = r);
  const o = Gm(e.paramBindings);
  o && (t.param_bindings = o);
  const s = su(e.videoComposition);
  s && En(s) && (t.video_composition = s);
  const i = Md(
    e.storyboardReferences
  );
  i.length > 0 && En(i) && (t.storyboard_references = i), Ia(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), Mt(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const c = Ad(e.minShotDuration);
  c != null && (t.min_shot_duration = c);
  const a = Nt(e.storyboardRangeStartMs);
  a != null && Number.isInteger(a) && a >= 0 && (t.storyboard_range_start_ms = a);
  const f = Nt(e.storyboardRangeEndMs);
  return f != null && Number.isInteger(f) && f > 0 && (t.storyboard_range_end_ms = f), e.storyboardGridLayout && (t.storyboard_grid_layout = Td(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function Kg(e) {
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
function qg(e) {
  if (!(!rt(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function Gg(e) {
  if (!rt(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    Hg(r) || En(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function Hg(e) {
  return rt(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function Wg(e) {
  if (!rt(e))
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
    r != null && En(r) && (t[n] = r);
  }
  return Object.keys(t).length ? t : null;
}
function Mt(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n);
}
function bo(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function En(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(En) : rt(e) ? Object.values(e).every(En) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const vs = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!vs || Object.keys(vs).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const be = vs.joinSiteApi, Ie = vs.request;
async function Yg(e, t = 0, n = 0) {
  const r = await Ie(be("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: n
  });
  return ng(
    Hr(r, "加载创作空间失败")
  );
}
async function go(e) {
  const t = await Ie(be("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), n = Ye(t, "加载分类画布失败"), r = n.assets || {}, o = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: Pa(n.canvas, e.assetCateId || 0),
    assets: o.map(dr),
    canvasList: Array.isArray(n.canvas_list) ? n.canvas_list.map(Bs) : []
  };
}
function jo(e) {
  const t = rt(e) ? e : {}, n = rt(t.canvas) ? t.canvas : null;
  return {
    canvas: n && Array.isArray(n.nodes) ? Pa(n) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(Bs) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function Xg(e) {
  const t = await Ie(be("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return jo(
    Ye(t, "创建画布失败")
  );
}
async function Zg(e) {
  const t = await Ie(be("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return jo(
    Ye(t, "重命名画布失败")
  );
}
async function Jg(e) {
  const t = await Ie(
    be("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return jo(
    Ye(t, "调整画布顺序失败")
  );
}
async function Qg(e) {
  const t = await Ie(be("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return jo(
    Ye(t, "删除画布失败")
  );
}
async function ey(e) {
  const t = await Ie(be("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = Ye(t, "加载已删除画布失败");
  return Array.isArray(n.items) ? n.items.map(Bs) : [];
}
async function ty(e) {
  const t = await Ie(
    be("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return jo(
    Ye(t, "恢复画布失败")
  );
}
async function ny(e) {
  const t = await Ie(be("project/canvas_config"), "get", {
    project_id: e
  });
  return og(
    Hr(t, "加载能力列表失败")
  );
}
async function ry(e) {
  const t = await Ie(
    be("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return gy(
    Hr(t, "加载能力参数失败")
  );
}
async function oy(e) {
  const t = await Ie(
    be("workspace/canvas_execute"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      start_node_id: e.startNodeId,
      request_id: e.requestId || "",
      single_node: !!e.singleNode,
      target_node_ids: e.targetNodeIds || [],
      execution_scope: e.executionScope || "",
      canvas: Au($g(e.canvas)),
      input: e.runInput || {}
    }
  );
  return Ye(t, "画布运行失败");
}
async function sy(e) {
  const t = await Ie(
    be("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    }
  ), n = Ye(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function Lo(e, t, n) {
  const r = Ye(e, t).asset;
  if (!r)
    throw new Error(n);
  return dr(r);
}
async function vi(e) {
  const t = await Ie(
    be("workspace/canvas_execution_list"),
    "get",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId || 0,
      scope: e.scope,
      asset_cate_id: e.assetCateId || 0,
      run_ids: (e.runIds || []).filter((r) => r > 0).join(","),
      before_id: e.beforeId || 0,
      limit: e.limit || 20,
      summary_only: e.summaryOnly ? 1 : 0
    }
  ), n = Ye(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function Mu(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), o = await Ie(
    be("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    }
  );
  return Ye(o, "读取画布运行详情失败");
}
async function iy(e) {
  const t = await Ie(be("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return Hr(t, "继续画布运行失败");
}
async function ay(e) {
  const t = await Ie(be("run/status"), "get", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || "",
    view: "summary"
  });
  return Hr(t, "读取流程状态失败");
}
async function cy(e) {
  const t = await Ie(be("run/stop"), "post", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || ""
  });
  return Ye(t, "停止画布运行失败");
}
async function dy(e, t) {
  const n = await Ie(
    be("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), r = Ye(n, "停止全部画布运行失败");
  return {
    count: Number(r.count || 0),
    stoppedCount: Number(r.stopped_count || 0),
    failedCount: Number(r.failed_count || 0),
    items: Array.isArray(r.items) ? r.items : []
  };
}
async function uy(e) {
  const t = await Ie(be("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return Hr(t, "提交信息失败");
}
async function ly(e) {
  const t = await Ie(
    be("project/update_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      expected_updated_at: e.expectedUpdatedAt || "",
      request_id: e.requestId || "",
      save_mode: e.saveMode || "",
      content: e.content
    }
  );
  return Lo(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function uv(e) {
  const t = await Ie(
    be("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Lo(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function lv(e) {
  const t = await Ie(
    be("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return Lo(t, "确认分镜失败", "确认分镜结果为空");
}
async function fv(e) {
  const t = await Ie(
    be("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Lo(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function pv(e) {
  const t = e.storyboard.shots.findIndex(
    (s) => s.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await Ie(
    be("project/generate_storyboard_shot"),
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
  ), r = Ye(n, "生成镜头失败"), o = xp(r, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function mv(e) {
  const t = await Ie(be("project/asset_detail"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    current_only: e.currentOnly ? 1 : 0
  }), n = Ye(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const o = Oa(n.versions);
  return {
    asset: dr(r),
    versions: o,
    versionTotal: Number(n.version_total || o.length),
    hasMore: !!n.has_more
  };
}
async function gv(e) {
  const t = await Ie(be("project/asset_versions"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    page: e.page,
    page_size: e.pageSize || 20
  }), n = Ye(t, "读取资产版本失败"), r = Oa(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function yv(e) {
  const t = await Ie(
    be("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    }
  ), n = Ye(t, "读取历史版本失败").version, r = Fa(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function fy(e) {
  const t = {
    project_id: e.projectId,
    canvas_id: e.canvasId || 0,
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
async function Du(e, t) {
  const n = await Ie(be("project/save_asset"), "post", {
    ...fy(t),
    role: e
  });
  return Lo(n, "保存资产失败", "保存资产结果为空");
}
function py(e) {
  return Du("work", e);
}
function Cc(e) {
  return Du("material", e);
}
async function my(e) {
  const t = await Ie(be("workspace/canvas"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId,
    base_revision: e.canvas.updatedAt || "",
    canvas: Au(e.canvas)
  }), n = Ye(t, "保存画布失败");
  return {
    canvasId: Number(n.canvas_id || e.canvasId || 0),
    assetCateId: Number(n.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(n.updated_at || e.canvas.updatedAt || "")
  };
}
function gy(e) {
  const t = rt(e) ? e : {}, n = rt(t.power) ? t.power : {}, r = rt(n.output) ? n.output : {}, o = _y(
    t.storyboard_work_types
  ), s = by(
    t.storyboard_reference_purposes,
    o
  ), i = Rp(
    t.storyboard_min_shot_durations
  ), c = String(n.output_type || n.outputType || "").trim(), a = String(
    r.view_mode || r.viewMode || ""
  ).trim();
  if ((c === "storyboard" || a === "storyboard") && (o.length === 0 || s.length === 0 || i.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const f = new Set(
    s.map((u) => u.key)
  );
  if (o.some(
    (u) => u.required_reference_purposes.some(
      (h) => !f.has(h)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: yy(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: o,
    storyboard_reference_purposes: s,
    storyboard_min_shot_durations: i
  };
}
function yy(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = rt(t) ? t : {}, r = rt(n.supported_options) ? Object.fromEntries(
      Object.entries(n.supported_options).map(([o, s]) => [o.trim(), No(s)]).filter(([o, s]) => o !== "" && s.length > 0)
    ) : void 0;
    return {
      ...n,
      supported_options: r && Object.keys(r).length > 0 ? r : void 0
    };
  }) : [];
}
const hy = /* @__PURE__ */ new Set(["image", "video", "audio"]), wy = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function _y(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = rt(n) ? n : {}, o = String(r.key || "").trim().toLowerCase();
    if (!Ia(o) || t.has(o))
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
function by(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((o) => o.key)), r = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const s = rt(o) ? o : {}, i = String(s.key || "").trim(), c = No(s.media_kinds), a = String(
      s.scope || ""
    ).trim(), f = No(
      s.work_types
    ), u = No(
      s.default_media_kinds
    ), h = String(s.material_type || "").trim(), v = Number(s.max_count || 0), N = Number(s.sort || 0);
    if (!i || r.has(i) || c.length === 0 || c.some(
      (_) => !hy.has(_)
    ) || !wy.has(a) || f.some((_) => !n.has(_)) || u.some((_) => !c.includes(_)) || a === "material" && h !== "character" && h !== "scene" && h !== "prop" || a !== "material" && h || !Number.isInteger(v) || v < 0 || !Number.isInteger(N))
      throw new Error("分镜参考用途注册信息无效");
    return r.add(i), {
      key: i,
      name: String(s.name || "").trim() || i,
      media_kinds: c,
      work_types: f,
      scope: a,
      material_type: h,
      default_media_kinds: u,
      max_count: v,
      sort: N
    };
  }).sort((o, s) => o.sort - s.sort);
}
function No(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const Rc = 520, Iy = 8e3;
function Ny({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: o
}) {
  const s = re(n), i = re({}), c = re({}), a = re({}), f = re(/* @__PURE__ */ new Map()), u = re({}), h = re(0), v = re(null), [N, _] = V(0), [R, E] = V({});
  pe(() => {
    s.current = n;
  }, [n]);
  const K = M((z) => {
    const j = u.current[z];
    j != null && (window.clearTimeout(j), delete u.current[z]);
  }, []), Y = M(
    (z, j = Rc) => {
      if (!t || !e || typeof window > "u")
        return;
      K(z);
      const G = h.current;
      u.current[z] = window.setTimeout(() => {
        delete u.current[z], v.current?.(z, G)?.catch(() => {
        });
      }, j);
    },
    [K, t, e]
  ), te = M(
    async (z, j, G) => {
      if (j !== h.current || !t || !e)
        return;
      for (; f.current.has(z); )
        if (await f.current.get(z), j !== h.current)
          return;
      const ce = G?.revision ?? i.current[z] ?? 0;
      if (ce <= (c.current[z] || 0))
        return;
      const Ne = G?.canvas || s.current[z];
      if (!Ne)
        return;
      const de = (async () => {
        E((Ce) => ({ ...Ce, [z]: "saving" }));
        try {
          const Ce = await my({
            projectId: e,
            canvasId: Ne.id,
            assetCateId: Ne.assetCateId,
            canvas: Ne
          });
          if (j !== h.current)
            return;
          c.current[z] = Math.max(
            c.current[z] || 0,
            ce
          ), a.current[z] = 0, (i.current[z] || 0) === ce ? (r((me) => {
            const le = me[z], dt = Ce.updatedAt || le?.updatedAt;
            return !le || le.updatedAt === dt ? me : {
              ...me,
              [z]: { ...le, updatedAt: dt }
            };
          }), E((me) => ({
            ...me,
            [z]: "saved"
          }))) : E((me) => ({
            ...me,
            [z]: "dirty"
          }));
        } catch (Ce) {
          if (j !== h.current)
            return;
          const ze = (a.current[z] || 0) + 1;
          throw a.current[z] = ze, E((me) => ({ ...me, [z]: "error" })), ze === 1 && o(Ce), Y(
            z,
            Math.min(Iy, Rc * 2 ** ze)
          ), Ce;
        } finally {
          j === h.current && (i.current[z] || 0) > (c.current[z] || 0) && (a.current[z] || 0) === 0 && Y(z);
        }
      })();
      f.current.set(z, de);
      try {
        await de;
      } finally {
        f.current.get(z) === de && f.current.delete(z);
      }
    },
    [t, o, e, Y, r]
  );
  v.current = te;
  const X = M(
    async (z) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const j = String(z.id), G = h.current, ce = (i.current[j] || 0) + 1;
      if (i.current[j] = ce, a.current[j] = 0, K(j), E((Ne) => ({ ...Ne, [j]: "dirty" })), await te(j, G, { canvas: z, revision: ce }), G !== h.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [K, t, e, te]
  ), ie = M((z) => {
    const j = String(z);
    i.current[j] = (i.current[j] || 0) + 1, a.current[j] = 0, E((G) => ({ ...G, [j]: "dirty" })), _((G) => G + 1);
  }, []), C = M(
    (z) => {
      h.current += 1;
      for (const G of Object.keys(u.current))
        K(G);
      i.current = {}, c.current = {}, a.current = {}, f.current.clear();
      const j = {};
      for (const G of Object.keys(z))
        j[G] = "saved";
      E(j);
    },
    [K]
  ), oe = M(
    (z) => {
      const j = String(z.id);
      K(j);
      const G = (i.current[j] || 0) + 1;
      i.current[j] = G, c.current[j] = G, a.current[j] = 0, E((ce) => ({ ...ce, [j]: "saved" }));
    },
    [K]
  ), B = M(
    (z) => {
      const j = String(z);
      K(j), delete i.current[j], delete c.current[j], delete a.current[j], E((G) => {
        if (!Object.prototype.hasOwnProperty.call(G, j))
          return G;
        const ce = { ...G };
        return delete ce[j], ce;
      });
    },
    [K]
  );
  return pe(() => {
    for (const [z, j] of Object.entries(i.current))
      j > (c.current[z] || 0) && Y(z);
  }, [Y, N]), pe(
    () => () => {
      h.current += 1;
      for (const z of Object.values(u.current))
        window.clearTimeout(z);
      u.current = {};
    },
    []
  ), {
    markCanvasDirty: ie,
    flushCanvasSave: X,
    adoptCanvasSnapshot: oe,
    forgetCanvasSnapshot: B,
    resetCanvasAutosave: C,
    canvasSaveStatus: R
  };
}
const vy = 6e4, Sy = 60;
class Cy {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = Ry(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, o = !1) {
    this.setScope(t, n);
    const s = this.scopeKey, i = this.catalogs.get(s) || { loadedAt: 0 };
    if (!o && i.value && Date.now() - i.loadedAt < vy)
      return Promise.resolve(i.value);
    if (i.inFlight)
      return i.inFlight;
    const c = r().then((a) => (this.scopeKey === s && this.catalogs.set(s, { value: a, loadedAt: Date.now() }), a)).catch((a) => {
      throw this.scopeKey === s && this.catalogs.set(s, {
        value: i.value,
        loadedAt: i.loadedAt
      }), a;
    });
    return this.catalogs.set(s, { ...i, inFlight: c }), c;
  }
  loadPowerForm(t, n) {
    this.setScope(t.projectId, t.releaseId);
    const r = this.scopeKey, o = xy(t), s = this.powerForms.get(o);
    if (s?.value)
      return this.touchPowerForm(o, s), Promise.resolve(s.value);
    if (s?.inFlight)
      return s.inFlight;
    const i = n().then((c) => (this.scopeKey === r && (this.touchPowerForm(o, { value: c }), this.trimPowerForms()), c)).catch((c) => {
      throw this.scopeKey === r && this.powerForms.delete(o), c;
    });
    return this.touchPowerForm(o, { inFlight: i }), this.trimPowerForms(), i;
  }
  touchPowerForm(t, n) {
    this.powerForms.delete(t), this.powerForms.set(t, n);
  }
  trimPowerForms() {
    for (; this.powerForms.size > Sy; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function Ry(e, t) {
  return `${e || 0}:${t || 0}`;
}
function xy(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function ky(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function Ty(e, t) {
  const n = new Set(t);
  return e.map(
    (r) => n.has(r.id) && r.runError ? { ...r, runError: "" } : r
  );
}
function Ay(e, t, n) {
  const r = new Map(t.map((a) => [a.id, a])), o = My(n), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const a of t)
    a.groupId && i.set(a.groupId, [
      ...i.get(a.groupId) || [],
      a.id
    ]);
  const c = (a) => {
    for (const f of o.get(a) || []) {
      if (s.has(f))
        continue;
      s.add(f);
      const u = r.get(f);
      if (u?.type === "group")
        for (const h of i.get(u.id) || [])
          s.has(h) || (s.add(h), c(h));
      (!u || !Pu(u)) && c(f);
    }
  };
  return c(e), [...s];
}
function Pu(e) {
  return e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Ba(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function My(e) {
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
function Dy({
  members: e,
  hasResult: t
}) {
  const n = e.filter(Ba), r = n.filter(
    (o) => o.storyboardItem?.stale || !t(o)
  );
  return (r.length > 0 ? r : n).map(
    (o) => o.id
  );
}
function Eu({
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
    for (const c of i) {
      if (r.has(c))
        continue;
      const a = t.get(c);
      if (!a)
        return "前置素材节点不存在，请重新同步分镜脚本";
      const f = a.title || "未命名素材";
      if (!n(a))
        return a.storyboardItem?.stale ? `请先重新生成前置素材“${f}”` : `请先生成前置素材“${f}”`;
    }
  }
  return "";
}
function Fu({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const o = e.filter(Ba), s = o.filter(
    (u) => u.storyboardItem?.stale
  ).length, i = o.map((u) => t[u.id]).filter((u) => !!u), a = n?.status === "running" || n?.status === "waiting" ? o.filter((u) => {
    const h = t[u.id];
    return h?.status === "success" || !h && r(u);
  }).length : o.filter((u) => {
    const h = t[u.id];
    return h?.status === "success" ? !0 : h ? !1 : r(u);
  }).length, f = i.filter(
    (u) => u.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: o.length,
    completedCount: a,
    failedCount: f,
    staleCount: s,
    status: Py(n, i, f)
  };
}
function Py(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function Ey({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: r = !0,
  canEditStructure: o = !1,
  canResetStoryboardPrompt: s = !1,
  onClose: i,
  onCopy: c,
  onDelete: a,
  onDetail: f,
  onEditStructure: u,
  onResetStoryboardPrompt: h
}) {
  return /* @__PURE__ */ P(ln, { children: [
    /* @__PURE__ */ d("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ P(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (v) => v.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ P("button", { type: "button", onClick: f, children: [
            /* @__PURE__ */ d(wa, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "详情" })
          ] }) : null,
          o && u ? /* @__PURE__ */ P("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ d(Cd, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "编辑分镜" })
          ] }) : null,
          s && h ? /* @__PURE__ */ P("button", { type: "button", onClick: h, children: [
            /* @__PURE__ */ d(np, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ P("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ d(rp, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ P("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ d(op, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function Fy({
  canvasCount: e,
  activeCanvasName: t,
  canvasManagerOpen: n,
  showViewTools: r,
  showMiniMap: o,
  snapToGrid: s,
  zoom: i,
  onToggleMiniMap: c,
  onToggleSnap: a,
  onReset: f,
  onZoomIn: u,
  onZoomOut: h,
  onZoomChange: v,
  onOpenCanvasManager: N
}) {
  const _ = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ P("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ d(Ve, { label: _, children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: N,
        children: /* @__PURE__ */ d(Qf, { size: 16 })
      }
    ) }),
    r ? /* @__PURE__ */ P(ln, { children: [
      /* @__PURE__ */ d("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ d(Ve, { label: o ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: o ? "is-active" : "",
          onClick: c,
          "aria-label": o ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ d(ep, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ d(Ve, { label: s ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: a,
          "aria-label": s ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ d(Nd, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ d(Ve, { label: "重置视图", children: /* @__PURE__ */ d("button", { type: "button", onClick: f, "aria-label": "重置视图", children: /* @__PURE__ */ d(tp, { size: 15 }) }) }),
      /* @__PURE__ */ P("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ d(Ve, { label: "缩小", children: /* @__PURE__ */ d("button", { type: "button", onClick: h, "aria-label": "缩小", children: /* @__PURE__ */ d(vd, { size: 15 }) }) }),
        /* @__PURE__ */ d(
          "input",
          {
            type: "range",
            min: "0.35",
            max: "1.45",
            step: "0.01",
            value: Math.max(0.35, Math.min(1.45, i)),
            onChange: (R) => v(Number(R.target.value)),
            "aria-label": "画布缩放"
          }
        ),
        /* @__PURE__ */ d(Ve, { label: "放大", children: /* @__PURE__ */ d("button", { type: "button", onClick: u, "aria-label": "放大", children: /* @__PURE__ */ d(Sd, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
function Oy(e, t, n) {
  return t && n?.interactionId === t ? n.nodes : e;
}
function zy(e, t, n, r) {
  const o = n && e?.interactionId === n ? e.nodes : t;
  return {
    interactionId: n,
    nodes: typeof r == "function" ? r(o) : r
  };
}
function By(e, t) {
  const [n, r] = V(null), o = Oy(
    e,
    t,
    n
  ), s = M(
    (i) => {
      r(
        (c) => zy(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: o, setFlowNodes: s };
}
function $y(e, t) {
  return t && $a(t.source, e) ? t.value : e;
}
function xc(e, t, n) {
  return {
    source: t && $a(t.source, e) ? t.source : e,
    value: n
  };
}
function $a(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const Ou = [
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
], Ss = 140, ja = 100, vo = 720, kc = { width: 280, height: 64 };
function jy(e, t, n) {
  const r = Bu(n), o = e.find((s) => s.id === t);
  return !o || qy(o, r) ? e : e.map(
    (s) => s.id === t ? { ...s, ...r } : s
  );
}
function Ly(e, t, n) {
  const r = ko(n), o = e.find((s) => s.id === t);
  return !o || $a(o.resultView, r) ? e : e.map(
    (s) => s.id === t ? { ...s, resultView: r } : s
  );
}
function Vy({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: o
}) {
  if (!t || !n || !o)
    return null;
  const s = e.type === "group", i = e.type === "power" && xa(e.power, e.kind);
  return /* @__PURE__ */ d(ln, { children: Ou.map((c) => /* @__PURE__ */ d(
    Uf,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: s ? hc.width : i ? kc.width : Ss,
      minHeight: s ? hc.height : i ? kc.height : ja,
      maxWidth: s ? wc.width : vo,
      maxHeight: s ? wc.height : vo,
      keepAspectRatio: !s && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (a, f) => o(e.id, Bu(f))
    },
    c.position
  )) });
}
function Uy({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: o
}) {
  const s = re(null);
  if (!t)
    return null;
  const i = (f, u) => {
    if (f.button !== 0)
      return;
    f.preventDefault(), f.stopPropagation();
    const h = ko(e), v = f.currentTarget.parentElement?.getBoundingClientRect().width || h.width;
    s.current = {
      pointerId: f.pointerId,
      startX: f.clientX,
      startY: f.clientY,
      startView: h,
      currentView: h,
      corner: u,
      scale: Math.max(0.01, v / h.width)
    }, f.currentTarget.setPointerCapture(f.pointerId), n?.();
  }, c = (f) => {
    const u = s.current;
    if (!u || u.pointerId !== f.pointerId)
      return;
    f.preventDefault(), f.stopPropagation();
    const h = Ky(
      u.startView,
      u.corner,
      (f.clientX - u.startX) / u.scale,
      (f.clientY - u.startY) / u.scale
    );
    u.currentView = h, r(h);
  }, a = (f) => {
    const u = s.current;
    !u || u.pointerId !== f.pointerId || (f.preventDefault(), f.stopPropagation(), s.current = null, f.currentTarget.hasPointerCapture(f.pointerId) && f.currentTarget.releasePointerCapture(f.pointerId), o(ko(u.currentView)));
  };
  return /* @__PURE__ */ d(ln, { children: Ou.map((f) => /* @__PURE__ */ d(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${f.className} nodrag nopan nowheel`,
      onPointerDown: (u) => i(u, f),
      onPointerMove: c,
      onPointerUp: a,
      onPointerCancel: a,
      onClick: (u) => {
        u.preventDefault(), u.stopPropagation();
      }
    },
    f.position
  )) });
}
function Ky(e, t, n, r) {
  const o = e.width / e.height, s = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * o, c = zu(
    Math.abs(s - e.width) >= Math.abs(i - e.width) ? s : i,
    o
  ), a = c / o, f = Number(e.offsetX || 0), u = Number(e.offsetY || 0);
  return ko({
    width: c,
    height: a,
    offsetX: t.left ? f + e.width - c : f,
    offsetY: t.top ? u + (e.height - a) / 2 : u + (a - e.height) / 2
  });
}
function zu(e, t) {
  const n = Math.max(Ss, ja * t), r = Math.min(vo, vo * t);
  return n > r ? Math.min(vo, Math.max(Ss, e)) : Math.min(r, Math.max(n, e));
}
function ko(e) {
  const t = Tc(e.width, Ss), n = Tc(e.height, ja), r = t / n, o = zu(t, r);
  return {
    width: Math.round(o),
    height: Math.round(o / r),
    offsetX: Math.round(Ac(e.offsetX, 0)),
    offsetY: Math.round(Ac(e.offsetY, 0))
  };
}
function Tc(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Ac(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Bu(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function qy(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Gy(e, t) {
  const n = e || $u(), r = rm({
    type: "stream",
    output: t
  }), o = r.event, s = r.activity, i = Xy(n.text, r.delta, t, o), c = Zy(o, s) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, a = s && !s.anchorText ? { ...s, anchorText: i } : s, f = a ? om(n.activities, a) : n.activities, u = sm(
    im(n.document, r.output),
    Hd(r.output.document)
  ), h = Wd(c) || n.interaction, v = Yd(c);
  return {
    started: !0,
    text: i,
    output: c,
    activities: f,
    document: u,
    interaction: h,
    suggestions: v.length > 0 ? v : n.suggestions,
    error: r.error || n.error
  };
}
function Hy(e) {
  const t = Wy(e);
  return {
    started: Object.keys(t).length > 0,
    text: Cs(t.text),
    output: t,
    activities: am(t),
    document: Hd(t.document),
    interaction: Wd(t),
    suggestions: Yd(t),
    error: Cs(t.error)
  };
}
function Wy(e) {
  const t = cm(e);
  if (Cs(t.text))
    return t;
  const n = Od(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function Yy(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function $u() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function Xy(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && Cs(n.text) || e;
}
function Zy(e, t) {
  return !(t || e === "start" || e === "delta");
}
function Cs(e) {
  return e == null ? "" : String(e);
}
function Jy(e) {
  const t = _e(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (i) => i.id === Number(t.id || 0)
  ), o = r ? Fn(r, e.previousAsset) : e.previousAsset || null, s = Fn(
    t,
    o
  );
  return o?.version?.content != null && Number(o.version.id || 0) === Number(s.version?.id || 0) ? Fn(o, s) : s.version?.id ? s : null;
}
function Qy(e, t) {
  const n = th(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function eh(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function Fn(e, t) {
  const n = Mc(e), r = t ? Mc(t) : null, o = [
    ...n.versions || [],
    ...r?.versions || []
  ], s = nh(
    [oh(n.version)].filter(
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
function Pr(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((o) => [o.id, o])), r = e.map((o) => {
    const s = n.get(o.id);
    return s ? (n.delete(o.id), Fn(s, o)) : o;
  });
  return [
    ...[...n.values()].map(
      (o) => Fn(o)
    ),
    ...r
  ];
}
function th(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function Mc(e) {
  const t = Dc(e.version), n = (e.versions || []).map(Dc).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function Dc(e) {
  if (!e)
    return;
  const t = kp(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function nh(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (!s || Number(s.id || 0) <= 0)
      continue;
    const i = String(s.id), c = r.get(i);
    if (c !== void 0) {
      n[c] = rh(
        n[c],
        s
      );
      continue;
    }
    r.set(i, n.length), n.push(s);
  }
  let o = !1;
  return n.sort(
    (s, i) => Number(Si(i)) - Number(Si(s)) || Number(i.version || i.id || 0) - Number(s.version || s.id || 0)
  ).map((s) => Si(s) ? o ? sh(s) : (o = !0, s) : s);
}
function rh(e, t) {
  const n = { ...e };
  for (const [r, o] of Object.entries(t))
    o !== void 0 && o !== "" && (n[r] = o);
  return n;
}
function Si(e) {
  return !!(e.is_current || e.current);
}
function oh(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function sh(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function La(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return nr(r, "execution_id", e?.execution_id), nr(r, "run_id", e?.run_id || n?.run_id), Ci(r, "request_id", e?.request_id), nr(r, "flow_run_id", e?.flow_run_id), nr(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), nr(r, "asset_id", t?.id), nr(r, "version_id", n?.id || t?.version_id), nr(
    r,
    "release_id",
    n?.release_id || e?.release_id
  ), Ci(r, "role", e?.role || t?.role), Ci(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function ih(e) {
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
function nr(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Ci(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const ah = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], ch = Object.fromEntries(
  ah.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function dh(e) {
  return ch[e] || "文本";
}
function uh(e) {
  const t = new Map(e.nodes.map((i) => [i.id, i])), n = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), r = lh(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), o = e.nodes.filter(_u).map((i) => {
    const c = r.get(i.id) || i.asset, a = i.groupId ? n.get(i.groupId) : void 0, f = a?.group?.sourceNodeId ? t.get(a.group.sourceNodeId) : void 0, u = e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || dh(Pc(i)),
      sourcePath: f?.title && a?.title ? `${f.title} / ${a.title}` : a?.title,
      nodeType: Pc(i),
      status: fh(i, c, e.nodeHasResult(i)),
      preview: e.nodePreview(i),
      output: u,
      node: i,
      nodeId: i.id,
      nodeNo: i.nodeNo,
      groupId: i.groupId,
      groupTitle: a?.title,
      asset: c,
      assetId: c?.id,
      versionId: c?.version?.id || c?.version_id
    };
  }).filter((i) => !!(i.assetId && i.versionId));
  return [...e.assets.filter(
    (i) => Number(i.canvas_id || 0) === e.canvasId && Number(i.asset_cate_id || 0) === e.assetCateId && String(i.role || "material") === "work" && String(i.status || "") !== "archived"
  ).map(
    (i) => ({
      key: `asset:${i.id}`,
      role: "work",
      title: i.name || `作品 ${i.id}`,
      nodeType: ju(i.kind),
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
function Pc(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : ju(e.power?.kind || e.kind);
}
function ju(e) {
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
function lh(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (Number(o.canvas_id || 0) !== t || Number(o.asset_cate_id || 0) !== n || String(o.role || "") !== "material" || String(o.status || "") === "archived")
      continue;
    const s = String(
      o.node_key || o.version?.node_key || ""
    ).trim();
    s && !r.has(s) && r.set(s, o);
  }
  return r;
}
function fh(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function hv(e, t = []) {
  return {
    current: mh([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: Lu(
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
function ph(e) {
  return e.map(
    (t) => ({
      id: t.role === "material" ? t.nodeId || t.key : String(t.assetId || t.key),
      title: t.title,
      kind: Lu(t.preview, t.nodeType),
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
function mh(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = `${r.source}:${r.id}`;
    n.has(o) || (n.add(o), t.push(r));
  }
  return t;
}
function Lu(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Xi = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Xi || Object.keys(Xi).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const gh = Xi.joinSiteApi;
async function Vu(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return Kf({
    streamApi: yh(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function yh(e) {
  const t = new URL(gh("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const Uu = "反馈已被新的运行替换";
function hh(e) {
  return e instanceof Error && e.message === Uu;
}
function ur(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function wh(e, t) {
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
function _h(e, t, n) {
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
function bh(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((s) => s.id === e.node.id) || e.node, o = ur(r).find(
    (s) => s.id === e.recordId
  );
  return o ? !(o.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function Ih(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: Gr(t?.status || e?.status || "running"),
    output: _e(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(Ch).filter(Boolean),
    interactions: r.map(vh).filter(Boolean),
    raw: e
  };
}
function Nh(e) {
  const t = e.interactions.find(
    (s) => !!(s.interaction?.id && s.interaction?.type)
  );
  if (t)
    return Ku(t);
  const n = e.approvals.find(Rh);
  if (!n?.id)
    return null;
  const r = xh(n), o = Va(r);
  return {
    approval: n,
    title: Me(r.title, n.title, "补充信息"),
    description: Me(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: o,
    values: Ua(r, o)
  };
}
function Ku(e) {
  const t = e.interaction, n = Va(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: Me(t.title, "补充信息"),
    description: Me(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: Ua(t, n)
  };
}
function vh(e) {
  const t = qf(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function Va(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => kh(n, r)).filter((n) => !!n.key);
}
function Ua(e, t) {
  const n = dm(t), r = e.values && typeof e.values == "object" ? e.values : {}, o = {
    ...n,
    ...r
  }, s = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return s > 0 && (o.source_target_id = s), o;
}
function Sh(e, t) {
  const n = Th(e);
  if (!n)
    return null;
  const r = Va(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: Me(n.title, t, "补充信息"),
    description: Me(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: r,
    values: Ua(n, r)
  };
}
function Ch(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function Rh(e) {
  return e.status === "pending" || e.decision === "pending";
}
function xh(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function kh(e, t) {
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
    accepted_kinds: Ec(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: Ec(
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
function Ec(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function Th(e) {
  const t = Ri(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = Ri(e?.interaction);
    return r && Me(r.type) ? r : null;
  }
  const n = Ri(t.interaction, t.content?.interaction);
  return n && Me(n.type) ? n : null;
}
function Ri(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
async function Ah(e) {
  return (await Tp({
    teamID: e.teamID,
    projectID: e.projectID,
    canvasID: e.canvasID,
    files: e.files,
    ruleID: e.ruleID,
    onProgress: e.onProgress
  })).map(
    ({ sourceFile: n, uploadedFile: r, asset: o }) => Dh(r, n, o)
  );
}
function Mh(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : "file";
}
function Dh(e, t, n) {
  const r = String(
    e?.url || e?.open_url || e?.download || ""
  ), o = String(e?.kind || Mh(t));
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
function Ph({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: r,
  targetY: o,
  sourcePosition: s,
  targetPosition: i,
  markerEnd: c,
  style: a,
  data: f
}) {
  const [u, h, v] = Gf({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: r,
    targetY: o,
    targetPosition: i
  }), N = f || {}, _ = !!N.isSelected, R = !!(N.isHighlighted || _), E = N.highlightColor || "#0ea5e9", K = _ ? "var(--ws-edge-selected)" : R ? E : "var(--ws-edge)", Y = _ ? 2.8 : R ? 2.4 : 1.45, te = R ? 0.96 : 0.62, X = String(N.bindingLabel || "").trim(), ie = !!N.bindingInteractive, C = !!X, oe = C || _;
  return /* @__PURE__ */ P(ln, { children: [
    R ? /* @__PURE__ */ d(
      lc,
      {
        path: u,
        style: {
          stroke: E,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ d(
      lc,
      {
        path: u,
        markerEnd: c,
        style: {
          ...a,
          stroke: K,
          strokeWidth: Y,
          opacity: te,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    oe ? /* @__PURE__ */ d(Hf, { children: /* @__PURE__ */ P(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          X ? "is-bound" : "",
          N.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${h}px, ${v}px)`
        },
        onMouseDown: (B) => {
          B.preventDefault(), B.stopPropagation();
        },
        children: [
          C ? ie ? /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${X}`,
              onClick: (B) => {
                B.preventDefault(), B.stopPropagation(), N.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ d(Ui, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ d("span", { children: X }),
                N.bindingShowChevron ? /* @__PURE__ */ d(Rd, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ P("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ d(Ui, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ d("span", { children: X })
          ] }) : null,
          _ ? /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (B) => {
                B.preventDefault(), B.stopPropagation(), N.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ d(sp, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    R ? /* @__PURE__ */ P(ln, { children: [
      /* @__PURE__ */ d("circle", { r: "3", fill: E, children: /* @__PURE__ */ d(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: u
        }
      ) }),
      /* @__PURE__ */ d("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ d(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: u
        }
      ) })
    ] }) : null
  ] });
}
const Eh = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function Fh({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ d(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: Eh,
      children: /* @__PURE__ */ P(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ d(fn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(zs, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ d("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function xi({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [o, s] = V(!1), [i, c] = V(e), a = re(null);
  pe(() => {
    o || c(e);
  }, [o, e]), pe(() => {
    o && (a.current?.focus(), a.current?.select());
  }, [o]);
  const f = () => {
    const u = i.trim() || n;
    s(!1), c(u), u !== e && r?.(u);
  };
  return o && r ? /* @__PURE__ */ d(
    "input",
    {
      ref: a,
      className: `ws-canvas-node-title-input nodrag nowheel ${t || ""}`.trim(),
      value: i,
      maxLength: 64,
      "aria-label": "节点名称",
      onChange: (u) => c(u.target.value),
      onBlur: f,
      onPointerDown: (u) => u.stopPropagation(),
      onKeyDown: (u) => {
        u.stopPropagation(), u.key === "Enter" ? (u.preventDefault(), f()) : u.key === "Escape" && (u.preventDefault(), c(e), s(!1));
      }
    }
  ) : /* @__PURE__ */ d(Ve, { label: r ? "双击重命名" : e, children: /* @__PURE__ */ d(
    "span",
    {
      className: t,
      onDoubleClick: r ? (u) => {
        u.preventDefault(), u.stopPropagation(), s(!0);
      } : void 0,
      children: e || n
    }
  ) });
}
const Fc = 160, Oc = 72, zc = 72, Rs = 72, To = 24, Ao = 24, Mo = 40, lr = 2, xs = { width: 180, height: 180 }, Oh = "storyboard-derived-layout-v7";
function zh(e) {
  const t = e.groups.map((_) => ({
    ..._,
    size: Lh(_)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(ls), o = Vh(
    "workspace",
    r
  ), s = t.filter((_) => _.direction === "upstream").sort(ls), i = t.filter(
    (_) => _.direction === "downstream" && _.powerKind !== "audio"
  ).sort(ls), c = t.filter(
    (_) => _.direction === "downstream" && _.powerKind === "audio"
  ).sort(ls), a = i.reduce(
    (_, R) => Math.max(_, R.size.height),
    0
  ), f = i.length ? e.sourceNode.y - a - zc : e.sourceNode.y, u = e.sourceNode.x - Fc;
  let h = f;
  for (const _ of s)
    n.set(_.key, {
      bounds: {
        x: u - _.size.width,
        y: h,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), h += _.size.height + zc;
  let v = e.sourceNode.x;
  for (const _ of i)
    n.set(_.key, {
      bounds: {
        x: v,
        y: f,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), v += _.size.width + Oc;
  let N = e.sourceNode.x + e.sourceNode.width + Fc;
  for (const _ of c)
    n.set(_.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), N += _.size.width + Oc;
  return n;
}
function Bh(e, t, n) {
  const r = t.filter((c) => c.groupId === e.id), o = n.kind === "audio", s = o ? n.width : Math.max(xs.width, n.width), i = o ? n.height : Math.max(xs.height, n.height);
  for (let c = 0; c < r.length + 100; c += 1) {
    const a = c % lr, f = Math.floor(c / lr), u = {
      x: e.x + To + a * (s + Ao),
      y: e.y + Rs + f * (i + Mo)
    };
    if (r.every(
      (h) => !Uh(
        { ...u, width: n.width, height: n.height },
        h
      )
    ))
      return u;
  }
  return {
    x: e.x + To,
    y: e.y + Rs
  };
}
function $h(e, t) {
  const n = t.some((s) => s.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : xs.width,
      ...t.map((s) => s.width)
    ),
    height: Math.max(
      n ? 0 : xs.height,
      ...t.map((s) => s.height)
    )
  }, o = /* @__PURE__ */ new Map();
  return t.forEach((s, i) => {
    const c = i % lr, a = Math.floor(i / lr);
    o.set(s.id, {
      x: e.x + To + c * (r.width + Ao),
      y: e.y + Rs + a * (r.height + Mo)
    });
  }), {
    ...qu(t.length, r),
    positions: o
  };
}
function jh(e) {
  return js(e || void 0);
}
function Lh(e) {
  const t = jh(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return qu(e.itemCount, t);
}
function qu(e, t) {
  const n = Math.max(1, Math.ceil(e / lr));
  return {
    width: To * 2 + t.width * lr + Ao * (lr - 1),
    height: Rs + To + n * t.height + (n - 1) * Mo
  };
}
function Vh(e, t) {
  return [
    Oh,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function ls(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function Uh(e, t) {
  return !(e.x + e.width + Ao <= t.x || t.x + t.width + Ao <= e.x || e.y + e.height + Mo <= t.y || t.y + t.height + Mo <= e.y);
}
const Kh = /^\[(?:\d{1,3}):\d{2}(?:[.:]\d{1,3})?\]\s*(.*)$/;
function qh(e) {
  if (typeof e != "string")
    return [];
  const t = [];
  for (const n of e.replace(/\r\n?/g, `
`).split(`
`)) {
    const o = n.trim().match(Kh)?.[1]?.trim() || "";
    o && t.push(o);
  }
  return t;
}
function Gh(e, t) {
  if (e.work_type !== "mv")
    return [];
  const n = qh(e.lyrics_lrc);
  return (t.lyric_line_indexes || []).map((r) => n[r - 1] || "").filter(Boolean);
}
function Ls(e, t) {
  const n = Gh(e, t);
  return n.length ? `本镜对应歌词：${n.join(" / ")}；必须按歌词语义、情绪和节奏设计画面，不得生成歌词文字` : "";
}
const Hh = [
  "characters",
  "scenes",
  "props"
], Bc = {
  character: "生成一张纯角色设定图，在同一张图内依次展示当前角色的正面全身、侧面全身、背面全身，以及面部和服装关键细节；各视角互不遮挡，必须保持同一人物的五官、发型、服装、体型和比例一致，采用清晰规范的角色设定图排版，不得拆分生成多张独立图片，不得出现其他人物、文字、水印或界面元素",
  scene: "生成一张纯场景参考图，采用能够完整说明空间关系的广角主视图，清晰展示固定空间的环境、结构、光线和关键区域；只生成一个完整画面，不得使用拼图、宫格或分栏排版，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop: "生成一张纯道具参考图，采用四分之三主视角，清晰展示当前道具的造型、比例、材质和关键细节；只生成一个完整画面，不得使用拼图、宫格、分栏或多视角排版，不得出现人物、手持者、文字、水印或界面元素"
}, Zi = [
  ki("characters", "角色组", "character", 0),
  ki("scenes", "场景组", "scene", 1),
  ki("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: Hh,
    layoutIndex: 0,
    enabled: zd,
    items: Yh
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
    enabled: Ap,
    items: Wh
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: Mp,
    items: ew
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
    enabled: Dp,
    items: nw
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
    enabled: Pp,
    items: rw
  }
];
function Wh(e, t) {
  const n = Ep(e), r = Kr(t?.framePlanVersion) ? Bd(e.shots) : [];
  return e.shots.map((o, s) => {
    const i = Kr(t?.framePlanVersion) ? r[s] : void 0, c = fw(
      e,
      o,
      s,
      t?.framePlanVersion,
      i
    );
    return {
      type: "shot",
      id: o.id,
      title: `镜头 ${o.order || s + 1}`,
      prompt: bw(
        e,
        o,
        c.externalReferences,
        t?.framePlanVersion,
        i
      ),
      ...c,
      paramValues: kw(
        e,
        o,
        t?.framePlanVersion,
        i
      ),
      shotId: o.id,
      shotDuration: o.duration,
      requiredDurationValues: n,
      continuityAnchor: o.continuity_anchor
    };
  });
}
function Yh(e, t) {
  return Kr(t?.framePlanVersion) ? Zh(e) : Xh(e);
}
function Xh(e) {
  return e.shots.flatMap((t, n) => {
    if (t.continue_previous)
      return [];
    const r = aw(e, t, n);
    return [
      {
        type: "shot_image",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 参考图`,
        prompt: mw(
          e,
          t,
          r.previousShot,
          r.externalReferences
        ),
        dependencyItems: r.dependencyItems,
        referenceItems: r.referenceItems,
        externalReferences: r.externalReferences,
        paramValues: el(e),
        shotId: t.id
      }
    ];
  });
}
function Zh(e) {
  const t = Bd(e.shots);
  return e.shots.flatMap((n, r) => {
    const o = t[r];
    if (o.nodeMode === "none")
      return [];
    const s = o.nodeMode === "last_frame" ? "end" : "start", i = cw(
      e,
      n,
      r,
      s
    ), c = Qh(
      e,
      n,
      o.nodeMode,
      i
    );
    return [
      {
        type: "shot_image",
        id: n.id,
        title: Jh(
          n.order || r + 1,
          o.nodeMode
        ),
        prompt: c.prompt,
        dependencyItems: i.dependencyItems,
        referenceItems: i.referenceItems,
        externalReferences: i.externalReferences,
        paramValues: el(e),
        shotId: n.id,
        shotImageMode: o.nodeMode,
        frameMediaItems: o.frameMediaItems,
        imageSequenceFrames: c.frames
      }
    ];
  });
}
function Jh(e, t) {
  return `镜头 ${e} ${Bp[t]}`;
}
function Qh(e, t, n, r) {
  switch (n) {
    case "first_last": {
      const o = yw(e, t, r);
      return {
        prompt: hw(o),
        frames: o
      };
    }
    case "references":
      return {
        prompt: gw(e, t, r)
      };
    case "last_frame":
      return {
        prompt: ks(
          e,
          t,
          "end",
          r.anchorLabel,
          r.referenceMaterials,
          r.externalReferences
        )
      };
    default:
      return {
        prompt: ks(
          e,
          t,
          "start",
          r.anchorLabel,
          r.referenceMaterials,
          r.externalReferences
        )
      };
  }
}
function ki(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o) => zd(o) && o.materials.some((s) => s.type === n),
    items: (o) => o.materials.filter((s) => s.type === n).map((s) => {
      const i = Cw(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: sw(
          o,
          s,
          i
        ),
        externalReferences: i
      };
    })
  };
}
function ew(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, o) => {
      const s = tw(e, r);
      return {
        type: "speech",
        id: r.id,
        title: ow(
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
function tw(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function nw(e) {
  return e.shots.flatMap((t, n) => {
    const r = Fp(t);
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
function rw(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(Op);
    if (!r.length)
      return [];
    const o = r.map((c) => c.id), s = r[0]?.character_id, i = t.speech.filter((c) => c.text.trim()).map((c) => c.id);
    return [
      {
        type: "lip_sync",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 口型`,
        prompt: `同步镜头 ${t.order || n + 1} 的角色口型`,
        dependencyItems: [
          { type: "shot", id: t.id },
          ...i.map((c) => ({ type: "speech", id: c }))
        ],
        referenceItems: [
          { type: "shot", id: t.id },
          ...i.map((c) => ({ type: "speech", id: c }))
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
function ow(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = e.materials.find(
    (s) => s.type === "character" && s.id === t.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function sw(e, t, n) {
  const r = Ga(n), o = t.prompt.trim();
  if (o)
    return mr(
      e,
      `${r}${o}。${Bc[t.type]}`,
      t.type
    );
  const s = e.shots.filter((c) => c.material_ids.includes(t.id)).map((c) => c.description.trim()).filter(Boolean), i = s.length ? `相关镜头：${s.join("；")}` : "保持整部作品的统一视觉风格";
  return mr(
    e,
    `${r}${Ca[t.type]}“${t.name}”的素材生成图。${i}。${Bc[t.type]}`,
    t.type
  );
}
function iw(e, t) {
  return Gu(Oo(e, t));
}
function Gu(e) {
  return e.map((t) => ({
    type: t.type,
    id: t.id
  }));
}
function aw(e, t, n) {
  const r = iw(e, t), o = Rw(e, t), s = t.match_previous ? lw(e, n) : void 0;
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
function cw(e, t, n, r) {
  const o = zp(
    e.shots,
    n,
    r
  ), s = new Set(o.materialIDs), i = Oo(e, t).filter(
    (h) => s.has(h.id)
  ), c = Gu(i), a = dw(
    e,
    o.referenceKeys,
    o.includeGlobalReferences,
    i
  ), f = o.anchorID, u = f ? { type: "shot_image", id: f } : void 0;
  return {
    anchorLabel: uw(
      e,
      t,
      n,
      r,
      o
    ),
    dependencyItems: u ? [u] : [],
    referenceItems: [...u ? [u] : [], ...c],
    referenceMaterials: i,
    externalReferences: a
  };
}
function dw(e, t, n, r) {
  const o = new Set(
    r.flatMap((i) => i.reference_keys)
  );
  if (r.length)
    for (const i of Vs(e, "image"))
      o.add(i.key);
  const s = new Set(t);
  return Us(
    e.references.filter(
      (i) => i.kind === "image" && !o.has(i.key) && (Ju.image.has(i.purpose) ? n : s.has(i.key))
    )
  );
}
function uw(e, t, n, r, o) {
  const { anchorID: s, anchorFrameRole: i, anchorShotIndex: c } = o;
  if (!s)
    return "";
  if (s === t.id)
    return "本镜头首帧";
  const a = e.shots[c];
  if (!a)
    return "";
  const f = c === n - 1 ? "上一镜头" : "镜头", u = i === "end" ? "尾帧" : "连续性参考帧";
  return r === "start" ? `${f} ${a.order || c + 1} 的${u}` : `${f} ${a.order || c + 1} 的${u}规划图`;
}
function lw(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function fw(e, t, n, r, o) {
  if (Kr(r))
    return pw(
      e,
      t,
      n,
      o || Sa(t)
    );
  const s = Zu(e, t), i = n > 0 ? e.shots[n - 1] : void 0;
  if (t.continue_previous && i) {
    const c = { type: "shot", id: i.id };
    return {
      dependencyItems: [c],
      referenceItems: [c],
      externalReferences: s
    };
  }
  return {
    dependencyItems: [],
    referenceItems: [{ type: "shot_image", id: t.id }],
    externalReferences: s
  };
}
function pw(e, t, n, r) {
  const o = Zu(e, t), s = {
    type: "shot_image",
    id: t.id
  }, i = r.nodeMode === "none" ? [] : [s], c = n > 0 ? e.shots[n - 1] : void 0;
  if (t.continue_previous && c) {
    const a = { type: "shot", id: c.id };
    return {
      dependencyItems: [a],
      referenceItems: [a, ...i],
      externalReferences: o
    };
  }
  return {
    dependencyItems: [],
    referenceItems: i,
    externalReferences: o
  };
}
function mw(e, t, n, r = []) {
  const o = Oo(e, t), s = [
    `镜头 ${t.order} 的单张参考画面`,
    ...Ka(
      r,
      n ? `前序镜头 ${n.order} 的参考画面` : "",
      o
    ),
    n ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留" : "",
    vw(e, t),
    `入镜关键帧状态：${t.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    ...qa(o),
    t.description.trim(),
    t.camera_instruction.trim() ? `镜头语言：${t.camera_instruction.trim()}` : "",
    Uo(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return mr(
    e,
    Vo(s)
  );
}
function ks(e, t, n, r, o, s = []) {
  const i = Oo(e, t), c = n === "end", a = [
    `镜头 ${t.order} 的单张${c ? "尾帧" : "首帧"}画面`,
    ...Ka(
      s,
      r,
      o
    ),
    Yu(t, n, r),
    r ? Hu(i) : "",
    Wu(e, t),
    `镜头画面内容：${t.description.trim()}`,
    ...ww(t, n),
    ...qa(i),
    _w(t, n),
    Uo(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return mr(
    e,
    Vo(a)
  );
}
function gw(e, t, n) {
  const r = Oo(e, t), o = [
    `镜头 ${t.order} 的参考图组`,
    ...Ka(
      n.externalReferences,
      n.anchorLabel,
      n.referenceMaterials
    ),
    n.anchorLabel ? Yu(t, "start", n.anchorLabel) : "",
    n.anchorLabel ? Hu(r) : "",
    Wu(e, t),
    `镜头画面内容：${t.description.trim()}`,
    `镜头起始状态：${t.continuity_state.entry.trim()}`,
    `镜头主要变化：${t.beat.trim()}`,
    `镜头结束状态：${t.continuity_state.exit.trim()}`,
    "根据维持本镜头人物、场景、道具、动作关系和构图所需的信息，生成 1 至 4 张相互补充的独立参考图片",
    "这些图片是并列的视觉参考，不是首尾帧或连续时间关键帧，不得暗示固定播放顺序",
    "每张图片只承担一种清晰参考目的，不得生成拼图、宫格、分栏、候选图、编号文字或标题",
    "整组必须保持人物身份、服装、关键道具、场景结构、光线、色彩和画风完全一致",
    ...qa(r),
    t.camera_instruction.trim() ? `镜头语言参考：${t.camera_instruction.trim()}` : "",
    Uo(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return mr(
    e,
    Vo(o)
  );
}
function Ka(e, t, n) {
  const r = [
    ...e.map(Qu),
    ...t ? [t] : [],
    ...n.map(
      (o) => `${Ca[o.type]}“${o.name}”`
    )
  ];
  return r.length ? [
    `参考素材用途：${r.join("、")}`,
    "必须分别识别并保留以上参考对象；具体图片编号以运行时追加的参考素材索引为准"
  ] : [];
}
function yw(e, t, n) {
  const r = ks(
    e,
    t,
    "start",
    n.anchorLabel,
    n.referenceMaterials,
    n.externalReferences
  ), o = ks(
    e,
    t,
    "end",
    "",
    []
  );
  return [
    {
      title: "首帧",
      description: t.continuity_state.entry.trim(),
      prompt: r
    },
    {
      title: "尾帧",
      description: t.continuity_state.exit.trim(),
      prompt: o
    }
  ];
}
function hw(e) {
  return [
    "必须生成且只能生成 2 张按顺序排列的独立图片；不得合并为拼图、宫格或候选图，输出顺序不得交换",
    `第 1 张（首帧）：
${e[0]?.prompt || ""}`,
    "生成第 2 张时，必须把刚生成的第 1 张首帧作为一致性参考，只推进本镜头动作，不得复制首帧",
    `第 2 张（尾帧）：
${e[1]?.prompt || ""}`
  ].join(`

`);
}
function Hu(e) {
  const t = e.map(
    (n) => `${Ca[n.type]}“${n.name}”`
  );
  return t.length ? `当前镜头对象清单：${t.join("、")}；锚点中未列出的对象不得继续保留` : "当前镜头对象清单为空；锚点中的人物、角色、动物和道具不得继续保留";
}
function Wu(e, t) {
  const n = Xu(e, t);
  return [
    `故事目标：${e.summary.trim()}`,
    Ls(e, t),
    n.trim() ? `当前叙事阶段：${n.trim()}` : ""
  ].filter(Boolean).join("；");
}
function ww(e, t) {
  const n = e.continuity_state.entry.trim(), r = e.continuity_state.exit.trim(), o = e.beat.trim();
  return t === "start" ? [
    `目标首帧状态：${n}`,
    o ? `本镜动作将在首帧之后发生：${o}` : "",
    `不得提前表现尾帧状态：${r}`,
    "当前图片必须停在动作尚未开始的时刻，只表现起点状态"
  ].filter(Boolean) : [
    `起点状态：${n}`,
    o ? `必须完成的可见变化：${o}` : "",
    `目标尾帧状态：${r}`,
    "必须与第 1 张首帧存在可辨识的画面变化，至少让主体位置、姿态、动作、道具状态或镜头构图中的一项明确不同；第 1 张首帧只用于保持身份、画风和空间连续，不得直接复制"
  ].filter(Boolean);
}
function _w(e, t) {
  const n = e.camera_instruction.trim();
  return n ? t === "end" ? `尾帧构图：${n}；采用动作和运镜完成后的画面位置` : `首帧构图：${n}；采用动作和运镜开始前的画面位置` : "";
}
function Yu(e, t, n) {
  return n ? t === "start" ? "当前镜头要求匹配连续性参考帧；保持共同主体状态、光线、构图方向与空间关系，当前素材清单中不存在的对象不得继续保留" : e.continue_previous ? "以上一镜连续性参考帧为动作起点，推进本镜变化后形成当前尾帧；不得重复上一镜内容，除本镜明确动作造成的道具增减或状态变化外，不得改变人物、服装、场景光线和动作方向" : "以本镜头首帧为动作起点，只推进本镜变化并形成明确尾帧；保持人物身份、服装、道具、场景结构、光线和轴线一致" : "";
}
function qa(e) {
  const t = e.some(
    (n) => n.type === "character"
  );
  return [
    t ? "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致" : "当前镜头没有角色素材，不得生成清晰可识别的人物、歌手、演员、乐手、路人或人脸；故事目标、叙事阶段和外部参考中出现的人物也不得擅自带入画面。保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    t ? "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例" : "道具必须保持参考图中的原始尺寸比例"
  ];
}
function bw(e, t, n = [], r, o) {
  if (Kr(r))
    return Iw(
      e,
      t,
      n,
      o || Sa(t)
    );
  const i = [
    `补充视觉要求：${t.video_prompt.trim() || $d(t)}`,
    Ls(e, t),
    Ga(n),
    t.continue_previous ? `使用上一镜头真实尾帧继续生成。连续性锚点：${t.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容` : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    Uo(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return mr(
    e,
    Vo(i)
  );
}
function Iw(e, t, n, r) {
  const s = [
    "约束优先级：真实输入帧与参考素材 > 起始和结束状态 > 动作推进与运镜 > 补充视觉要求；低优先级内容冲突时忽略低优先级内容",
    `补充视觉要求：${t.video_prompt.trim() || $d(t)}`,
    Ls(e, t),
    Ga(n),
    `起始状态：${t.continuity_state.entry.trim()}`,
    `动作推进：${t.beat.trim()}`,
    `结束状态：${t.continuity_state.exit.trim()}`,
    t.camera_instruction.trim() ? `运镜：${t.camera_instruction.trim()}` : "运镜：固定机位，保持构图和轴线稳定",
    Nw(t, r),
    Uo(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return mr(
    e,
    Vo(s)
  );
}
function Nw(e, t) {
  const n = "不改变人物身份、服装、道具、场景、光线或动作方向";
  if (e.continue_previous) {
    const r = `严格使用从上一镜头真实视频提取的尾帧作为首帧。连续性锚点：${e.continuity_anchor}。动作从真实尾帧自然继续，不重复上一镜内容`;
    return t.nodeMode === "last_frame" ? `${r}；使用当前镜头单张尾帧作为尾帧，只补全两帧之间的连续动作，${n}` : `${r}，${n}`;
  }
  switch (t.nodeMode) {
    case "first_last":
      return `严格使用当前镜头首尾帧节点的第 1 张作为首帧、第 2 张作为尾帧，只补全两帧之间的连续动作，${n}`;
    case "references":
      return `当前镜头参考图组只作为并列视觉参考，不代表首帧、尾帧或时间顺序关键帧；根据文字描述生成完整动作，${n}`;
    case "none":
      return `当前镜头采用纯文本生成，不使用镜头图片参考；严格按照起始状态、动作推进和结束状态生成，${n}`;
    default:
      return `严格使用当前镜头单张首帧作为首帧，从该状态自然完成本镜动作，${n}`;
  }
}
function vw(e, t) {
  const n = e.shots.findIndex((s) => s.id === t.id), r = Xu(e, t).trim(), o = e.shots[n + 1]?.transition.trim();
  return [
    `故事目标：${e.summary.trim()}`,
    Ls(e, t),
    r ? `当前叙事阶段：${r}` : "",
    `本镜变化：${t.beat.trim()}`,
    t.transition.trim() ? `从上一镜进入本镜：${t.transition.trim()}` : "",
    Sw(t, n),
    o ? `本镜结束需为下一镜建立：${o}` : ""
  ].filter(Boolean).join("；");
}
function Xu(e, t) {
  const n = e.shots.findIndex((r) => r.id === t.id);
  return n <= 0 ? e.storyline.setup : n >= e.shots.length - 1 ? e.storyline.payoff : e.storyline.development;
}
function Sw(e, t) {
  if (t <= 0)
    return "";
  const n = Lp[e.transition_type];
  return e.transition_type === "none" ? `进入本镜的剪辑方式：${n}` : `进入本镜的剪辑方式：${n}，时长 ${e.transition_duration_ms} 毫秒；这是后期剪辑信息，画面本身不要生成转场叠影`;
}
function Cw(e, t) {
  return Us([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Vs(e, "image")
  ]);
}
function Rw(e, t) {
  return Us([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Vs(e, "image")
  ]);
}
function Zu(e, t) {
  return Us([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...Vs(e, "video")
  ]);
}
const Ju = {
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
function Vs(e, t) {
  const n = Ju[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function Ga(e) {
  const t = e.map(Qu);
  return t.length > 0 ? `参考素材：${t.join("；")}。` : "";
}
const xw = {
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
function Qu(e) {
  const t = xw[e.purpose];
  return t ? `${e.label}（${t}）` : e.label;
}
function Us(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function Vo(e) {
  return e.map((t) => t.trim().replace(/[。！？!?；;，,：:]+$/g, "")).filter(Boolean).join("。");
}
function el(e) {
  return { aspectRatio: e.aspect_ratio, resolution: "2k" };
}
function kw(e, t, n, r) {
  const o = r || Sa(t);
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration,
    ...Kr(n) && o.referenceMode ? { referenceMode: o.referenceMode } : {}
  };
}
function Uo(e) {
  return !$p(e) || ![...jp(e)][0] ? "" : "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
const yo = "storyboard-soundtrack";
function Tw(e) {
  const t = new Map(
    (e.current?.clips || []).map((o) => [o.id, o])
  ), n = e.storyboard.shots.map(
    (o, s) => Pw({
      ...e,
      shot: o,
      index: s,
      current: t.get(o.id)
    })
  ), r = um(
    n,
    (e.current?.clips || []).map((o) => o.id),
    (o) => o.id
  );
  return {
    version: 3,
    clips: Dw(
      r,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: Aw(
      e.storyboard,
      e.current?.audioTracks || []
    ),
    settings: {
      resolution: e.current?.settings.resolution || "auto",
      fps: e.current?.settings.fps ?? 0
    }
  };
}
function Aw(e, t) {
  const n = jd(e), r = Mw(e), o = e.references.find(
    (v) => v.purpose === "soundtrack"
  );
  if (!o)
    return n ? [] : t.filter((v) => v.id !== yo);
  const s = n ? t.filter((v) => v.id === yo) : t, i = s.find(
    (v) => v.id === yo
  ), c = Number(o.asset_id || 0), a = Number(o.version_id || 0), f = {
    id: yo,
    ...c > 0 && a > 0 ? {
      audio: {
        assetId: c,
        versionId: a,
        label: o.label || "主音轨"
      }
    } : {},
    startTime: i?.startTime ?? 0,
    sourceStart: e.storyboard_range_start_ms == null ? i?.sourceStart ?? 0 : e.storyboard_range_start_ms / 1e3,
    kind: "music",
    volume: n ? 1 : i?.volume ?? 0.35,
    fit: i?.fit ?? "trim",
    loop: i?.loop ?? !1,
    fadeOut: r ? 0 : i?.fadeOut ?? 1
  };
  let u = !1;
  const h = s.flatMap(
    (v) => v.id !== yo ? [v] : u ? [] : (u = !0, [f])
  );
  return u ? h : [...h, f];
}
function Mw(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, r = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && r != null && (t > 0 || n < r);
}
function Dw(e, t) {
  if (!t || t <= 0 || e.length === 0)
    return e;
  const n = Math.round(
    e.reduce((u, h) => u + h.duration, 0) * 1e3
  );
  let r = Math.max(
    0,
    n - t
  ), o = 0;
  const s = e.map((u) => {
    const h = u.transitionToNext.type === "none" ? 0 : Math.max(0, u.transitionToNext.durationMs), v = Math.min(
      h,
      r
    );
    return r -= v, v < 100 ? {
      ...u,
      transitionToNext: { type: "none", durationMs: 0 }
    } : (o += v, {
      ...u,
      transitionToNext: { ...u.transitionToNext, durationMs: v }
    });
  }), i = n - o - t;
  if (i <= 0)
    return s;
  const c = s.length - 1, a = s[c], f = a.duration - i / 1e3;
  return f <= 0 || (s[c] = { ...a, duration: f }), s;
}
function Pw(e) {
  const t = jd(e.storyboard), n = Ts(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), r = Ts(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), o = Ji(n), s = t || r?.storyboardItem?.stale ? void 0 : Ji(r), i = !!e.current?.useOriginalVideo, c = [];
  n?.power ? o || c.push("镜头视频尚未生成") : c.push("未配置镜头视频能力");
  const a = new Map(
    (e.current?.speechTracks || []).map((R) => [R.id, R])
  ), f = t ? [] : e.shot.speech.filter((R) => R.text.trim()).map(
    (R) => zw(
      e.nodes,
      e.sourceNodeId,
      R,
      a.get(R.id),
      c
    )
  ), u = t ? [] : Ow(e.nodes, e.sourceNodeId, e.shot.id), h = !i && s ? s : o, v = e.storyboard.shots[e.index + 1], N = v ? {
    type: v.transition_type,
    durationMs: v.transition_type === "none" ? 0 : v.transition_duration_ms
  } : { type: "none", durationMs: 0 }, _ = Ew(
    e.current,
    N
  );
  return {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...h ? { visualVideo: h } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: e.shot.duration,
    originalVolume: t ? 0 : e.current?.originalVolume ?? (f.length ? 0.45 : 1),
    speechTracks: f,
    subtitleTracks: u,
    useOriginalVideo: i,
    blockingIssues: Bw(c),
    transitionToNext: _,
    storyboardTransitionToNext: N
  };
}
function Ew(e, t) {
  if (!e)
    return t;
  const n = e.storyboardTransitionToNext;
  return n && Fw(
    e.transitionToNext,
    n
  ) ? t : e.transitionToNext;
}
function Fw(e, t) {
  return e.type === t.type && e.durationMs === t.durationMs;
}
function Ow(e, t, n) {
  const r = Ts(e, t, "subtitle", n), o = Et(r?.resultOutput);
  return (Array.isArray(o.tracks) ? o.tracks : []).flatMap((i) => {
    const c = Et(i), a = cs(c.id), f = cs(c.text);
    if (!a || !f)
      return [];
    const u = $c(c.end_time ?? c.endTime), h = cs(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: f,
        startTime: Math.max(
          0,
          $c(c.start_time ?? c.startTime)
        ),
        ...u > 0 ? { endTime: u } : {},
        ...h ? { speechId: h } : {},
        source: cs(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function zw(e, t, n, r, o) {
  const s = Ts(e, t, "speech", n.id), i = Ji(s);
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
function Ts(e, t, n, r) {
  return e.find(
    (o) => o.storyboardItem?.sourceNodeId === t && o.storyboardItem.itemType === n && o.storyboardItem.itemId === r
  );
}
function Ji(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), o = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !o))
    return {
      assetId: r,
      versionId: o,
      label: e?.title || "素材"
    };
}
function Bw(e) {
  return [...new Set(e.filter(Boolean))];
}
function $c(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function tl(e) {
  const t = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), n = String(e.composerDraft?.prompt || "").trim();
  return !!(t && n && n !== t);
}
function $w(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!n || r.trim() === n)
    return null;
  const o = new Set(e.storyboardItem?.referenceNodeIds || []), s = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor
  } : void 0, i = t.filter((N) => o.has(N.id)).map(
    (N) => rl(N, s)
  ).filter((N) => !!N), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = Zd(
    e.composerDraft?.promptContent
  ).filter((N) => c.has(N.refId)), f = t.find(
    (N) => N.id === e.storyboardItem?.sourceNodeId
  ), h = ((f ? zo([
    f.asset?.version?.content,
    f.resultOutput
  ]) : null)?.references || []).filter((N) => c.has(N.asset_id)).map(ol), v = [
    ...i,
    ...a,
    ...h
  ];
  return {
    ...e.composerDraft || {},
    prompt: n,
    promptContent: v.length ? ka(n, v) : void 0,
    paramValues: al(
      e.composerDraft?.paramValues,
      r,
      n
    )
  };
}
function As(e, t, n) {
  const r = Lc(n);
  return e.find(
    (o) => Number(o.id || 0) > 0 && String(o.kind || "").trim().toLowerCase() === t && Lc(o.outputType) === r
  ) || null;
}
function Qi(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    if (n.type !== "power" || !$o(
      n.power,
      n.kind,
      n.outputType
    ))
      continue;
    const r = zo([
      n.asset?.version?.content,
      n.resultOutput
    ]);
    if (!r || !Vp(r))
      continue;
    const o = t.nodes.find((v) => v.id === n.id) || n, s = jw(
      o,
      r
    ), i = String(
      o.storyboardMaterializedSignature || ""
    ), c = Lw(
      t.nodes,
      o.id
    ), u = (Ur(
      o.storyboardFramePlanVersion
    ) || 0) < Ld || (i ? i !== s : !c), h = Up(
      o.storyboardFramePlanVersion,
      u
    );
    t = u ? qw({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: h
    }) : Uw({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: h
    }), t = Vw(
      t,
      o.id,
      s,
      h
    );
  }
  return t;
}
function jw(e, t) {
  return yt(
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
function Lw(e, t) {
  return e.some(
    (n) => n.storyboardItem?.sourceNodeId === t || n.type === "group" && n.group?.origin === "script" && n.group.sourceNodeId === t
  );
}
function Vw(e, t, n, r) {
  const o = e.nodes.findIndex(
    (c) => c.id === t
  ), s = Ur(r);
  if (o < 0 || e.nodes[o].storyboardMaterializedSignature === n && Ur(
    e.nodes[o].storyboardFramePlanVersion
  ) === s)
    return e;
  const i = [...e.nodes];
  return i[o] = {
    ...i[o],
    storyboardMaterializedSignature: n,
    storyboardFramePlanVersion: s
  }, { ...e, nodes: i };
}
function Uw(e) {
  const t = [...e.canvas.nodes];
  let n = !1, r = "";
  const o = Zi.filter(
    (c) => c.enabled(e.storyboard)
  );
  for (const c of o) {
    const a = c.local ? null : As(e.powers, c.powerKind, c.outputType);
    for (const f of c.items(e.storyboard, {
      framePlanVersion: e.framePlanVersion
    })) {
      const u = t.findIndex(
        (_) => Do(
          _,
          e.storyboardNode.id,
          f.type,
          f.id
        )
      );
      if (u < 0)
        continue;
      const h = nl(
        f,
        t,
        e.storyboardNode.id
      ), v = t[u], N = sl(
        v,
        v.groupId || "",
        h,
        c,
        a,
        { preserveStructure: !0 }
      );
      N !== v && (t[u] = N, n = !0);
    }
  }
  if (Vd(e.storyboard)) {
    const c = pl({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: As(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    n = n || !!c?.changed, r = c?.node.id || "";
  }
  let s = ll(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  s = fl(s, t, e.storyboardNode.id), s = r ? ml(
    s,
    t,
    e.storyboardNode.id,
    r,
    o
  ) : gl(s, e.storyboardNode.id);
  const i = s !== e.canvas.edges;
  return n || i ? {
    ...e.canvas,
    nodes: n ? t : e.canvas.nodes,
    edges: s
  } : e.canvas;
}
function Kw(e) {
  return JSON.stringify(
    e.nodes.filter(
      (t) => !!t.storyboardItem || t.type === "power" && $o(t.power, t.kind, t.outputType)
    ).map((t) => [
      t.id,
      Number(t.resultRef?.asset_id || 0),
      Number(t.resultRef?.version_id || 0),
      Number(t.asset?.id || 0),
      Number(t.asset?.version_id || t.asset?.version?.id || 0)
    ])
  );
}
function qw(e) {
  const t = Ur(e.framePlanVersion) || Ld, n = [...e.canvas.nodes], r = /* @__PURE__ */ new Set(), o = new Set(
    Zi.map((_) => _.itemType)
  ), s = Zi.filter(
    (_) => _.enabled(e.storyboard)
  ), i = Vd(
    e.storyboard
  );
  o.add("video_compose"), i && r.add(
    gs(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const c = s.map((_) => ({
    spec: _,
    items: _.items(e.storyboard, { framePlanVersion: t }),
    power: _.local ? null : As(e.powers, _.powerKind, _.outputType)
  }));
  for (const { items: _ } of c)
    for (const R of _)
      r.add(
        gs(e.storyboardNode.id, R.type, R.id)
      );
  let a = !1;
  for (let _ = n.length - 1; _ >= 0; _ -= 1) {
    const R = n[_].storyboardItem;
    !R || R.sourceNodeId !== e.storyboardNode.id || !o.has(R.itemType) || r.has(
      gs(
        R.sourceNodeId,
        R.itemType,
        R.itemId
      )
    ) || (n.splice(_, 1), a = !0);
  }
  const f = zh({
    sourceNode: e.storyboardNode,
    groups: c.map(({ spec: _, items: R, power: E }) => ({
      key: _.key,
      layoutIndex: _.layoutIndex,
      itemCount: R.length,
      power: E,
      powerKind: _.powerKind,
      direction: _.direction
    }))
  });
  let u = Ea(n, e.canvas.nextNodeNo);
  a = a || u !== e.canvas.nextNodeNo;
  for (const { spec: _, items: R, power: E } of c) {
    const K = f.get(_.key);
    if (!K)
      continue;
    const Y = Yw({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: _,
      layout: K,
      assetCate: e.assetCate
    });
    a = a || Y.changed;
    for (const oe of R) {
      const B = nl(
        oe,
        n,
        e.storyboardNode.id
      ), z = n.findIndex(
        (G) => Do(
          G,
          e.storyboardNode.id,
          B.type,
          B.id
        )
      );
      if (z >= 0) {
        const G = n[z], ce = sl(
          G,
          Y.node.id,
          B,
          _,
          E
        );
        ce !== G && (n[z] = ce, a = !0);
        continue;
      }
      const j = Xw({
        nodes: n,
        group: Y.node,
        storyboardNode: e.storyboardNode,
        item: B,
        assetCate: e.assetCate,
        spec: _,
        power: E
      });
      j.nodeNo = u++, n.push(j), a = !0;
    }
    const te = R.map(
      (oe) => n.find(
        (B) => B.groupId === Y.node.id && Do(
          B,
          e.storyboardNode.id,
          oe.type,
          oe.id
        )
      )
    ).filter((oe) => !!oe), X = $h(
      Y.node,
      te
    );
    for (const oe of te) {
      const B = X.positions.get(oe.id);
      if (!B || oe.x === B.x && oe.y === B.y)
        continue;
      const z = n.indexOf(oe);
      n[z] = { ...oe, ...B }, a = !0;
    }
    const ie = n.findIndex((oe) => oe.id === Y.node.id), C = n[ie];
    (C.width !== X.width || C.height !== X.height) && (n[ie] = {
      ...C,
      width: X.width,
      height: X.height
    }, a = !0);
  }
  const h = new Set(s.map((_) => _.key));
  for (let _ = n.length - 1; _ >= 0; _ -= 1) {
    const R = n[_];
    R.type !== "group" || R.group?.origin !== "script" || R.group.sourceNodeId !== e.storyboardNode.id || !R.group.syncKey || h.has(
      R.group.syncKey
    ) || (n.splice(_, 1), a = !0);
  }
  const v = i ? pl({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: As(e.powers, "video", "video_compose"),
    nextNodeNo: u
  }) : null;
  v && (u = v.nextNodeNo, a = a || v.changed);
  let N = ll(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    s
  );
  return N = fl(N, n, e.storyboardNode.id), N = v ? ml(
    N,
    n,
    e.storyboardNode.id,
    v.node.id,
    s
  ) : gl(N, e.storyboardNode.id), N !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: u, nodes: n, edges: N } : e.canvas;
}
function nl(e, t, n) {
  const r = (_) => (_ || []).map(
    (R) => t.find(
      (E) => Do(E, n, R.type, R.id)
    )
  ).filter((R) => !!R), o = r(e.dependencyItems), s = r(e.referenceItems), i = t_([...o, ...s]), c = e.externalReferences || [], a = {
    ...e,
    dependencyNodeIds: o.map((_) => _.id),
    referenceNodeIds: s.map((_) => _.id),
    sourceSignatureParts: [
      ...e.sourceSignatureParts || [],
      ...i.map(n_),
      ...c.map(Ww)
    ]
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return a;
  const f = Gw(
    e.prompt,
    s,
    c
  ), u = f === e.prompt ? a : { ...a, prompt: f }, h = c.map(
    ol
  );
  if (h.push(
    ...s.map((_) => rl(_, e)).filter((_) => !!_)
  ), !h.length)
    return u;
  const v = ka(
    f,
    h
  ), N = lm(v);
  return Xd(v) ? { ...a, prompt: N, promptContent: v } : { ...u, prompt: N };
}
function Gw(e, t, n = []) {
  const r = [], o = /* @__PURE__ */ new Set();
  for (const s of n) {
    const i = yc(s.label), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  for (const s of t) {
    const i = yc(s.title), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function rl(e, t) {
  const n = Number(e.resultRef?.asset_id || e.asset?.id || 0), r = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!n || !r)
    return null;
  const o = Na(
    e.storyboardItem?.frameMediaItems
  ), s = va(
    e.storyboardItem?.shotImageMode
  ), i = Hw(
    e.storyboardItem?.itemType,
    t,
    o
  );
  return {
    refType: "asset",
    refId: n,
    versionId: r,
    label: e.title,
    ...i,
    ...!i.mediaIndex && !i.mediaItems ? {
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? s === "references" ? "reference" : Ud(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function Hw(e, t, n) {
  if (e !== "shot_image" || !n.length)
    return {};
  if (t?.type === "shot") {
    const r = n.find((s) => s.frameRole === "end") || n.find((s) => s.frameRole === "start");
    return {
      mediaItems: (t.continuityAnchor ? r ? [r] : [] : n).map((s) => ({
        url: "",
        index: s.mediaIndex,
        usage: Ud(s.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = gc(n, "end") || gc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function ol(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function Ww(e) {
  return [
    "asset",
    e.asset_id,
    e.version_id || 0,
    e.kind,
    e.purpose
  ].join(":");
}
function Yw(e) {
  const t = Ha(
    e.nodes,
    e.storyboardNode.id,
    e.spec.key
  );
  if (t) {
    const o = t.title !== e.spec.title;
    if (t.group?.layoutKey === e.layout.layoutKey && !o)
      return { node: t, changed: !1 };
    if (t.group?.layoutKey === e.layout.layoutKey) {
      const a = { ...t, title: e.spec.title };
      return e.nodes[e.nodes.indexOf(t)] = a, { node: a, changed: !0 };
    }
    const s = e.layout.bounds.x - t.x, i = e.layout.bounds.y - t.y;
    let c = t;
    for (const [a, f] of e.nodes.entries()) {
      if (f.id !== t.id && f.groupId !== t.id)
        continue;
      const u = {
        ...f,
        x: f.x + s,
        y: f.y + i,
        ...f.id === t.id ? {
          title: e.spec.title,
          width: e.layout.bounds.width,
          height: e.layout.bounds.height,
          group: {
            ...f.group || {},
            layoutKey: e.layout.layoutKey
          }
        } : {}
      };
      e.nodes[a] = u, f.id === t.id && (c = u);
    }
    return { node: c, changed: !0 };
  }
  const n = e.layout.bounds, r = $s("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = Ya(
    e.nodes,
    `script-group-${yt(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function Ha(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function Xw(e) {
  const t = $s(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = Ya(
    e.nodes,
    `script-item-${yt(
      gs(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    js({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${e_(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: e.item.prompt,
    promptContent: e.item.promptContent,
    paramValues: e.item.paramValues
  }, t.storyboardItem = cl(
    e.storyboardNode.id,
    e.item
  );
  const n = Bh(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function sl(e, t, n, r, o, s = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = i.sourceSignature || dl({
    ...n,
    prompt: i.generatedPrompt,
    promptContent: e.composerDraft?.promptContent
  }), a = String(e.composerDraft?.prompt || ""), f = !a.trim() || a === i.generatedPrompt, u = f ? n.prompt : a, h = u !== a, v = Zw(
    e.composerDraft?.paramValues,
    a,
    u,
    n.paramValues
  ), N = v !== e.composerDraft?.paramValues, _ = f ? n.promptContent : Jw(
    a,
    e.composerDraft?.promptContent,
    n.promptContent
  ), R = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(_ || null), E = cl(i.sourceNodeId, n), K = il(e), Y = i.resultSourceSignature || (K ? c : "");
  Y && !r.local && (E.resultSourceSignature = Y), E.stale = r.local ? !1 : !!(K && Y !== E.sourceSignature);
  const te = s.preserveStructure && e.titleMode === "manual" ? e.title : n.title, X = e.title !== te, ie = s.preserveStructure ? e.groupId || "" : t, C = !e.power && !!o, oe = e.kind !== r.powerKind, B = e.outputType !== r.outputType, z = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === ie && !h && !N && !R && !X && !C && !oe && !B && !z && ul(i, E) ? e : {
    ...e,
    title: te,
    kind: r.powerKind,
    outputType: r.outputType,
    ...C ? {
      power: o || void 0,
      subtitle: o?.output?.name || o?.name || e.subtitle
    } : {},
    description: h || C ? u : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: ie,
    composerDraft: h || N || R ? {
      ...e.composerDraft || {},
      prompt: u,
      promptContent: _,
      paramValues: v
    } : e.composerDraft,
    storyboardItem: E
  };
}
function il(e) {
  return Number(e.resultRef?.version_id || 0) > 0 || Number(e.asset?.version_id || e.asset?.version?.id || 0) > 0 || e.resultOutput != null;
}
function al(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [o, s] of Object.entries(e))
    s === t && (r ||= { ...e }, r[o] = n);
  return r || e;
}
function Zw(e, t, n, r) {
  let o = al(
    e,
    t,
    n
  );
  for (const [s, i] of Object.entries(r || {}))
    o?.[s] !== i && (o = { ...o || {}, [s]: i });
  return o;
}
function Jw(e, t, n) {
  return !n || !Xd(n) ? t : ka(
    e,
    Zd(n)
  );
}
function cl(e, t) {
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
    shotImageMode: t.shotImageMode,
    frameRole: t.frameRole,
    frameMediaItems: t.frameMediaItems,
    imageSequenceFrames: t.imageSequenceFrames,
    speechId: t.speechId,
    speechIds: t.speechIds,
    characterId: t.characterId,
    speechKind: t.speechKind,
    speakerMode: t.speakerMode,
    startTime: t.startTime,
    shotDuration: t.shotDuration,
    requiredDurationValues: t.requiredDurationValues,
    continuityAnchor: t.continuityAnchor,
    optional: t.optional,
    sourceSignature: dl(t),
    stale: !1
  };
}
function dl(e) {
  return yt(
    JSON.stringify([
      e.prompt,
      e.promptContent || null,
      e.paramValues || null,
      e.localOutput || null,
      e.sourceSignatureParts || [],
      e.shotId || "",
      e.shotImageMode || "",
      e.frameRole || "",
      e.frameMediaItems || [],
      e.imageSequenceFrames || [],
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
function ul(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && rr(e.dependencyNodeIds, t.dependencyNodeIds) && rr(e.referenceNodeIds, t.referenceNodeIds) && rr(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && rr(e.frameMediaItems, t.frameMediaItems) && rr(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && rr(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && rr(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && !!e.optional == !!t.optional && e.sourceSignature === t.sourceSignature && e.resultSourceSignature === t.resultSourceSignature && !!e.stale == !!t.stale;
}
function Do(e, t, n, r) {
  const o = e.storyboardItem;
  return !!(o && o.sourceNodeId === t && o.itemType === n && o.itemId === r);
}
function ll(e, t, n, r) {
  const o = r.map((a) => ({
    spec: a,
    group: t.find(
      (f) => f.type === "group" && f.group?.origin === "script" && f.group.sourceNodeId === n && f.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), s = `script-edge-${yt(n)}-`, i = e.filter((a) => !a.id.startsWith(s));
  for (const { spec: a, group: f } of o) {
    const u = a.direction === "upstream", h = (a.sourceGroupKeys || []).map((N) => Ha(t, n, N)).filter((N) => !!N), v = u ? [f] : h.length ? h : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of v) {
      const _ = N.id, R = u ? n : f.id;
      i.push({
        id: Xa(i, `${s}${a.key}-${yt(_)}`),
        from: _,
        to: R,
        logicalFrom: _,
        logicalTo: R,
        purpose: "structure",
        executionMode: u ? void 0 : "manual"
      });
    }
  }
  const c = Vt(t, i);
  return Wa(e, c) ? e : c;
}
function fl(e, t, n) {
  const r = `script-item-edge-${yt(n)}-`, o = e.filter((a) => !a.id.startsWith(r)), s = t.filter(
    (a) => a.storyboardItem?.sourceNodeId === n && (!!a.groupId || a.storyboardItem.itemType === "video_compose")
  ), i = new Map(s.map((a) => [a.id, a]));
  for (const a of s)
    for (const f of a.storyboardItem?.dependencyNodeIds || []) {
      const u = i.get(f);
      !u || u.id === a.id || o.push({
        id: Xa(
          o,
          `${r}${yt(u.id)}-${yt(a.id)}`
        ),
        from: u.id,
        to: a.id,
        logicalFrom: u.id,
        logicalTo: a.id,
        purpose: "dependency",
        executionMode: u.groupId && u.groupId === a.groupId ? void 0 : "manual"
      });
    }
  const c = Vt(t, o);
  return Wa(e, c) ? e : c;
}
function pl(e) {
  const t = e.nodes.find(
    (c) => Do(
      c,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = Tw({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), r = Qw(n), o = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceSignature: r,
    stale: !1
  };
  if (t) {
    const c = e.preservePosition ? { x: t.x, y: t.y } : jc(e.nodes, e.storyboardNode), a = il(t), f = t.storyboardItem?.resultSourceSignature || (a ? t.storyboardItem?.sourceSignature : "");
    f && (o.resultSourceSignature = f), o.stale = !!(a && f !== r);
    const u = !t.power && !!e.power, h = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), v = t.x !== c.x || t.y !== c.y;
    if (!u && !h && !v && t.kind === "video" && t.outputType === "video_compose" && ul(t.storyboardItem, o))
      return {
        node: t,
        changed: !1,
        nextNodeNo: e.nextNodeNo
      };
    const N = {
      ...t,
      x: c.x,
      y: c.y,
      kind: "video",
      outputType: "video_compose",
      ...u ? {
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
  const s = jc(
    e.nodes,
    e.storyboardNode
  ), i = $s(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return i.id = Ya(
    e.nodes,
    `script-compose-${yt(e.storyboardNode.id)}`
  ), i.nodeNo = e.nextNodeNo, i.title = "视频合成", i.kind = "video", i.outputType = "video_compose", i.description = "按镜头顺序合成画面、原声和配音。", e.power || (i.subtitle = "未配置视频合成能力", i.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), i.composerDraft = { videoComposition: n }, i.storyboardItem = o, e.nodes.push(i), {
    node: i,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function Qw(e) {
  const t = e.clips.map((n) => {
    const r = { ...n };
    return delete r.storyboardTransitionToNext, r;
  });
  return yt(JSON.stringify({ ...e, clips: t }));
}
function jc(e, t) {
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
function ml(e, t, n, r, o) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (u) => o.some((h) => h.key === u)
  ).map((u) => Ha(t, n, u)).filter((u) => !!u), c = `script-compose-edge-${yt(n)}-`, a = e.filter((u) => !u.id.startsWith(c));
  for (const u of i.length ? i : t.filter((h) => h.id === n))
    a.push({
      id: Xa(a, `${c}${yt(u.id)}`),
      from: u.id,
      to: r,
      logicalFrom: u.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const f = Vt(t, a);
  return Wa(e, f) ? e : f;
}
function gl(e, t) {
  const n = `script-compose-edge-${yt(t)}-`, r = e.filter((o) => !o.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function Wa(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const o = n.get(r.id);
    return !!(o && r.from === o.from && r.to === o.to && (r.logicalFrom || "") === (o.logicalFrom || "") && (r.logicalTo || "") === (o.logicalTo || "") && (r.purpose || "") === (o.purpose || "") && (r.executionMode || "auto") === (o.executionMode || "auto") && (r.mediaUsage || "") === (o.mediaUsage || ""));
  });
}
function gs(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function Ya(e, t) {
  return yl(new Set(e.map((n) => n.id)), t);
}
function Xa(e, t) {
  return yl(new Set(e.map((n) => n.id)), t);
}
function yl(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function yt(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function Lc(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function e_(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function rr(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function t_(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => t.has(n.id) ? !1 : (t.add(n.id), !0));
}
function n_(e) {
  return [
    e.id,
    Number(e.resultRef?.version_id || 0),
    Number(e.asset?.version_id || e.asset?.version?.id || 0),
    e.storyboardItem?.sourceSignature || "",
    e.storyboardItem?.resultSourceSignature || ""
  ].join(":");
}
const r_ = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function hl(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return r_[n] || { section: "shots" };
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
const Vc = 52, Uc = 72, o_ = 48, s_ = {
  width: 360,
  height: 52
};
function i_(e, t) {
  const n = qs(e);
  return {
    frames: _l(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: wl(e, n)
  };
}
function Kc(e) {
  return qs(e);
}
function a_(e, t) {
  return wl(e).get(t.id) || "";
}
function wl(e, t = qs(e)) {
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
function _l(e, t, n = qs(e)) {
  const r = [];
  for (const o of n) {
    const s = e.find((h) => h.id === o);
    if (!s)
      continue;
    const i = e.filter(
      (h) => h.type === "group" && h.group?.origin === "script" && h.group.sourceNodeId === o
    ), c = new Set(i.map((h) => h.id)), a = e.filter(
      (h) => h.id === o || h.group?.sourceNodeId === o || h.storyboardItem?.sourceNodeId === o || !!(h.groupId && c.has(h.groupId))
    );
    if (a.length <= 1)
      continue;
    const f = a.filter(
      (h) => h.storyboardItem?.sourceNodeId === o && !h.storyboardItem.optional
    ), u = l_(a);
    r.push({
      id: Ks(o),
      sourceNodeId: o,
      title: s.title || "分镜脚本",
      memberNodeIds: a.map((h) => h.id),
      workNodeIds: f.map((h) => h.id),
      groupCount: i.length,
      workNodeCount: f.length,
      completedCount: f.filter(
        (h) => !h.storyboardItem?.stale && t(h)
      ).length,
      bounds: u
    });
  }
  return r.sort(
    (o, s) => o.bounds.y - s.bounds.y || o.bounds.x - s.bounds.x
  );
}
function bl(e, t, n, r = new Map(t.map((o) => [o.id, o]))) {
  const o = e.workNodeIds.map((u) => r.get(u)).filter((u) => !!u), s = new Set(
    o.filter((u) => u.storyboardItem?.stale || !n(u)).map((u) => u.id)
  );
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const u of o)
      s.has(u.id) || u.storyboardItem?.itemType === "video_compose" || u_(u).some(
        (h) => s.has(h)
      ) && (s.add(u.id), i = !0);
  }
  const c = o.find(
    (u) => u.storyboardItem?.itemType === "video_compose"
  );
  s.size > 0 && c && s.add(c.id);
  const a = o.filter(
    (u) => s.has(u.id)
  );
  if (a.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const f = a.find(
    (u) => !Ba(u)
  );
  return f ? {
    pendingNodeIds: a.map((u) => u.id),
    blockedReason: `“${f.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: a.map((u) => u.id),
    blockedReason: Eu({
      targets: a,
      nodesByID: r,
      hasResult: n
    })
  };
}
function c_(e, t, n) {
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
function qc(e, t) {
  return t ? {
    x: e.bounds.x,
    y: e.bounds.y,
    ...s_
  } : e.bounds;
}
function d_(e, t, n) {
  const r = Il(t, n);
  if (r.x === 0 && r.y === 0)
    return e;
  const o = new Set(t.memberNodeIds);
  return e.map(
    (s) => o.has(s.id) ? { ...s, x: s.x + r.x, y: s.y + r.y } : s
  );
}
function Il(e, t) {
  return {
    x: t.x - e.bounds.x,
    y: t.y - e.bounds.y
  };
}
function Ks(e) {
  return `storyboard-frame:${e}`;
}
function u_(e) {
  return [
    ...e.storyboardItem?.dependencyNodeIds || [],
    ...e.storyboardItem?.referenceNodeIds || []
  ];
}
function qs(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
function l_(e) {
  let t = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY, r = Number.NEGATIVE_INFINITY, o = Number.NEGATIVE_INFINITY;
  for (const s of e) {
    const i = Gc(s.width, 180), c = Gc(s.height, 180);
    t = Math.min(t, s.x), n = Math.min(n, s.y), r = Math.max(r, s.x + i), o = Math.max(o, s.y + c);
  }
  return {
    x: t - Vc,
    y: n - Uc,
    width: r - t + Vc * 2,
    height: o - n + Uc + o_
  };
}
function Gc(e, t) {
  return Number.isFinite(e) && e > 0 ? e : t;
}
function f_({
  data: e
}) {
  const t = g_(e), n = e.running ? "制作区正在执行" : e.runBlockedReason || (e.completedCount > 0 ? "只执行尚未完成或上次失败的内容" : "按依赖顺序生成制作区内容");
  return /* @__PURE__ */ P(
    "section",
    {
      className: `ws-storyboard-frame ${e.collapsed ? "is-collapsed" : ""}`,
      "aria-label": `${e.title} 分镜制作区`,
      children: [
        /* @__PURE__ */ P("header", { className: "ws-storyboard-frame-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-storyboard-frame-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(ip, { size: 15 }) }),
          /* @__PURE__ */ P("strong", { children: [
            e.title,
            " · 分镜制作区"
          ] }),
          /* @__PURE__ */ P("span", { className: "ws-storyboard-frame-progress", children: [
            e.groupCount,
            " 组 · ",
            e.completedCount,
            "/",
            e.workNodeCount,
            " ",
            "完成"
          ] }),
          e.runActionEnabled ? /* @__PURE__ */ d(Ve, { label: n, children: /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: "nodrag nopan ws-storyboard-frame-run",
              "aria-label": t,
              disabled: e.running || !!e.runBlockedReason,
              onClick: Ti(e.onRun),
              children: [
                e.running ? /* @__PURE__ */ d(fn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(zs, { size: 14, fill: "currentColor" }),
                /* @__PURE__ */ d("span", { children: t })
              ]
            }
          ) }) : null,
          /* @__PURE__ */ d(Ve, { label: "聚焦制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": "聚焦制作区",
              onClick: Ti(e.onFocus),
              children: /* @__PURE__ */ d(ap, { size: 14 })
            }
          ) }),
          /* @__PURE__ */ d(Ve, { label: e.collapsed ? "展开制作区" : "折叠制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": e.collapsed ? "展开制作区" : "折叠制作区",
              onClick: Ti(e.onToggleCollapsed),
              children: e.collapsed ? /* @__PURE__ */ d(Rd, { size: 15 }) : /* @__PURE__ */ d(cp, { size: 15 })
            }
          ) })
        ] }),
        e.collapsed ? null : /* @__PURE__ */ d("div", { className: "ws-storyboard-frame-surface", "aria-hidden": "true" })
      ]
    }
  );
}
const p_ = ha(
  f_,
  (e, t) => m_(e.data, t.data)
);
function m_(e, t) {
  return e === t || e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.title === t.title && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.runBlockedReason === t.runBlockedReason && e.runActionEnabled === t.runActionEnabled && e.collapsed === t.collapsed;
}
function g_(e) {
  return e.running ? "生成中" : e.workNodeCount > 0 && e.completedCount >= e.workNodeCount ? "已完成" : e.completedCount > 0 ? "继续生成" : "开始生成";
}
function Ti(e) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), e();
  };
}
const jr = /* @__PURE__ */ new Map(), y_ = 100;
function h_(e, t) {
  const n = String(t.runError || "").trim(), r = t.id, o = Number(t.resultRef?.execution_id || 0), s = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), c = __(
    e,
    r,
    o,
    s,
    i
  ), [a, f] = V(n), [u, h] = V(!1);
  return pe(() => {
    if (f(n), !n || !c || !Pm(n)) {
      h(!1);
      return;
    }
    let v = !0;
    return h(!0), w_({
      projectId: e,
      nodeId: r,
      executionId: o,
      requestId: s,
      runId: i,
      cacheKey: c,
      fallback: n
    }).then((N) => {
      v && N && f(N);
    }).catch(() => {
    }).finally(() => {
      v && h(!1);
    }), () => {
      v = !1;
    };
  }, [
    o,
    n,
    r,
    e,
    c,
    s,
    i
  ]), { error: a || n, loading: u };
}
function w_({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: o,
  cacheKey: s,
  fallback: i
}) {
  const c = jr.get(s);
  if (c)
    return c;
  const a = Mu({
    projectId: e,
    executionId: n,
    requestId: r,
    runId: o
  }).then((f) => {
    const u = Bn(f), h = [...u.node_results || []].reverse().find((N) => N.node_key === t), v = Ma(h) || lu(u);
    return Da(v, i);
  });
  return jr.set(s, a), b_(), a.catch(() => jr.delete(s)), a;
}
function __(e, t, n, r, o) {
  const s = n ? `execution:${n}` : r ? `request:${r}` : o ? `run:${o}` : "";
  return e > 0 && s ? `${e}:${s}:${t}` : "";
}
function b_() {
  for (; jr.size > y_; ) {
    const e = jr.keys().next().value;
    if (!e)
      return;
    jr.delete(e);
  }
}
function Le({
  label: e,
  overlay: t = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [o, s] = V(r <= 0);
  return pe(() => {
    if (r <= 0) {
      s(!0);
      return;
    }
    const i = window.setTimeout(() => s(!0), r);
    return () => window.clearTimeout(i);
  }, [r]), o ? /* @__PURE__ */ P(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ d(fn, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: e })
      ]
    }
  ) : null;
}
function I_({
  space: e,
  canvases: t,
  cache: n
}) {
  const [r, o] = V([]), [s, i] = V([]), [c, a] = V([]), [f, u] = V(!1), h = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, v = re(h), N = ue(
    () => f || N_(t),
    [t, f]
  );
  pe(() => {
    v.current = h, o([]), i([]), a([]), u(!1);
  }, [h]);
  const _ = M(
    async (R = !1) => {
      if (!e)
        return !1;
      const E = h;
      try {
        const K = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => ny(e.project.id),
          R
        );
        return v.current !== E ? !1 : (o(K.roles), i(K.powers), a(K.powerCategories), u(!0), !0);
      } catch (K) {
        return L.error(K instanceof Error ? K.message : "加载能力列表失败"), !1;
      }
    },
    [n, h, e]
  );
  return pe(() => {
    !e || !N || f || _();
  }, [_, f, N, e]), {
    roles: r,
    powers: s,
    powerCategories: c,
    loaded: f,
    required: N,
    load: _
  };
}
function N_(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : $o(n.power, n.kind, n.outputType) ? !!zo([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function So(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function un(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function v_({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: r,
  failedCount: o,
  staleCount: s,
  status: i,
  frameRunning: c = !1,
  selected: a,
  managed: f = !1,
  onRename: u,
  onEditStructure: h,
  onRun: v,
  runBlockedReason: N = "",
  children: _
}) {
  const [R, E] = V(!1), [K, Y] = V(e.title), te = re(null), X = i === "running" || i === "waiting", ie = X ? "分组正在执行" : c ? "制作区正在执行" : N || (n === 0 ? "分组内暂无可运行节点" : s > 0 ? `重新生成 ${s} 个已变更节点` : "运行分组"), C = !v || n === 0 || X || c || !!N;
  pe(() => {
    R || Y(e.title);
  }, [R, e.title]), pe(() => {
    R && (te.current?.focus(), te.current?.select());
  }, [R]);
  const oe = () => {
    const B = K.trim() || "未命名分组";
    E(!1), Y(B), B !== e.title && u?.(B);
  };
  return /* @__PURE__ */ P(
    "div",
    {
      className: `ws-node-group-wrap ${a ? "is-selected" : ""} ${X ? "is-running" : ""} ${i === "error" ? "is-error" : ""} ${f ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ P("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(dp, { size: 15 }) }),
          R ? /* @__PURE__ */ d(
            "input",
            {
              ref: te,
              className: "ws-node-group-title-input nodrag nowheel",
              value: K,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (B) => Y(B.target.value),
              onBlur: oe,
              onKeyDown: (B) => {
                B.key === "Enter" ? (B.preventDefault(), oe()) : B.key === "Escape" && (B.preventDefault(), Y(e.title), E(!1));
              }
            }
          ) : /* @__PURE__ */ d(
            Ve,
            {
              label: f ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ d(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (B) => {
                    B.preventDefault(), B.stopPropagation(), !(f || !u) && E(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ d("span", { className: "ws-node-group-count", children: X ? `${r}/${n}` : `${t} 个节点` }),
          i === "waiting" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待反馈" }) : i === "error" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: o > 0 ? `失败 ${o}` : "运行失败" }) : N ? /* @__PURE__ */ d(Ve, { label: N, children: /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待前置" }) }) : c ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待调度" }) : n > 0 && r === n ? /* @__PURE__ */ P("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ d(_a, { size: 12 }),
            "已完成"
          ] }) : null,
          h ? /* @__PURE__ */ d(Ve, { label: "编辑分镜结构", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (B) => {
                B.preventDefault(), B.stopPropagation(), h();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ d(Cd, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ d(Ve, { label: ie, children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: C,
              onClick: (B) => {
                B.preventDefault(), B.stopPropagation(), v?.();
              },
              "aria-label": "运行分组",
              children: X ? /* @__PURE__ */ d(fn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(zs, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        _
      ]
    }
  );
}
function Nl({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: r,
  className: o = "",
  style: s,
  onOpen: i,
  onOpenIntent: c,
  resizeControls: a,
  children: f,
  customContentIsPureMedia: u = !1,
  followContent: h = !1,
  followKey: v
}) {
  const N = re(null), _ = re(!0), R = zr(e, n), E = f != null, K = u || !E && !R && vl(n), Y = !!i && (!E || u), te = [
    "ws-result-view",
    K ? "" : "nodrag",
    "nopan",
    "nowheel",
    K ? "has-pure-media" : "",
    o
  ].filter(Boolean).join(" ");
  return pe(() => {
    if (!h) {
      _.current = !0;
      return;
    }
    const C = N.current;
    C && _.current && (C.scrollTop = C.scrollHeight);
  }, [h, v]), /* @__PURE__ */ P(
    "div",
    {
      role: Y ? "button" : void 0,
      tabIndex: Y ? 0 : void 0,
      className: te,
      style: s,
      onPointerDown: (C) => {
        (!K || x_(C)) && C.stopPropagation();
      },
      onClick: (C) => {
        C.stopPropagation(), !(!i || ea(C.target, C.currentTarget) || R_(C)) && (C.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (C) => {
        C.stopPropagation(), !(!i || ea(C.target, C.currentTarget) || C.key !== "Enter" && C.key !== " ") && (C.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            ref: N,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onScroll: (C) => {
              if (!h)
                return;
              const oe = C.currentTarget;
              _.current = oe.scrollHeight - oe.scrollTop - oe.clientHeight < 16;
            },
            children: E ? f : R ? /* @__PURE__ */ d(
              Br,
              {
                output: e,
                fallback: t,
                mediaGridKind: Bo(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ d(S_, { preview: n, label: r ?? t })
          }
        ),
        a
      ]
    }
  );
}
function S_({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ P("figure", { className: "ws-result-view-media", children: [
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
  ] }) : e.videoUrl ? /* @__PURE__ */ P("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ d(
      _s,
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
  ] }) : e.audioUrl ? /* @__PURE__ */ P("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ d("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ d("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ P(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ d(ba, { size: 16 }),
        /* @__PURE__ */ d("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ d(
    Br,
    {
      output: C_(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function C_(e) {
  return e ? { text: e } : void 0;
}
function vl(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function ea(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t);
}
function R_(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  if (!t || t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function x_(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? Kp(n, e.clientY) : ea(t, e.currentTarget);
}
const Sl = Kt(() => import("./space-agent-tools-BczjTcah.js")), Cl = Kt(() => import("./space-asset-tools-CeDOwFNm.js")), k_ = Ct(
  Sl,
  (e) => e.AgentInteractionPanel
), T_ = k_.Component, Rl = Ct(
  Kt(() => import("./protected-5-nodes-body-work-space-space-add-node-menu-tsx-8fgQNe3_.js")),
  (e) => e.AddNodeMenu
), A_ = Rl.Component, M_ = Rl.preload, xl = Ct(
  Cl,
  (e) => e.AssetBrowser
), D_ = xl.Component, P_ = xl.preload, kl = Ct(
  Cl,
  (e) => e.AssetPickerDialog
), Hc = kl.Component, Wc = kl.preload, Tl = Ct(
  Kt(() => import("./space-run-history-Qe-hb6v7.js")),
  (e) => e.CanvasRunHistoryDrawer
), E_ = Tl.Component, F_ = Tl.preload, O_ = Ct(
  Kt(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-CnIEuy_f.js")),
  (e) => e.SpaceCanvasManagerDialog
), z_ = O_.Component, B_ = Ct(
  Kt(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-CbDBD6E2.js")),
  (e) => e.CanvasParamBindingDialog
), $_ = B_.Component, Al = Ct(
  Kt(() => import("./space-assistant-B1WBdLeP.js")),
  (e) => e.SpaceAssistant
), j_ = Al.Component, L_ = Al.preload, V_ = Ct(
  Sl,
  (e) => e.CanvasAgentResultContent
), U_ = V_.Component, Ml = Ct(
  Kt(() => import("./node-detail-dialog-D19a6g1t.js")),
  (e) => e.NodeDetailDialog
), K_ = Ml.Component, Po = Ml.preload, Dl = Ct(
  Kt(() => import("./space-node-settings-0qDXBmwD.js")),
  (e) => e.CanvasNodeSettings
), q_ = Dl.Component, G_ = Dl.preload, H_ = Ct(
  Kt(() => import("./space-storyboard-node-C9ib5w-T.js")),
  (e) => e.StoryboardNodeContent
), W_ = H_.Component, Y_ = Ct(
  Kt(() => import("./space-video-compose-view-L0c8IAzq.js")),
  (e) => e.VideoComposeView
), X_ = Y_.Component;
function Z_({
  assistantName: e,
  onIntent: t,
  onOpen: n
}) {
  const r = `打开${e || "画布助手"}`;
  return /* @__PURE__ */ d("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ d(Ve, { label: r, side: "left", children: /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: "ws-assistant-launcher-button",
      "aria-label": r,
      "aria-controls": "workspace-canvas-assistant",
      "aria-expanded": !1,
      onPointerEnter: t,
      onFocus: t,
      onClick: n,
      children: /* @__PURE__ */ d(up, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
const ys = 520, J_ = 440, Q_ = 720, Pl = "bot.canvasAssistant.width", El = "bot.canvasAssistant.open";
function Fl(e) {
  return Number.isFinite(e) ? Math.min(
    Q_,
    Math.max(J_, Math.round(e))
  ) : ys;
}
function eb(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function tb(e) {
  return e === "1";
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const ta = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!ta || Object.keys(ta).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
function Ke(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: nb } = ta;
function rb(...e) {
  for (const t of e) {
    const n = fr(t);
    if (n)
      return n;
  }
  return null;
}
function Ms(...e) {
  for (const t of e) {
    const n = Ol(t);
    if (Ue(n))
      return n;
  }
  return "";
}
function Ol(e) {
  const t = Oe(e), n = Ko(t);
  if (n !== t)
    return Ol(n);
  const r = nb?.(t) ?? t, o = or(r, /* @__PURE__ */ new Set());
  if (Ue(o))
    return o;
  if (r !== t) {
    const c = or(t, /* @__PURE__ */ new Set());
    if (Ue(c))
      return c;
  }
  const s = Gs(t);
  if (s)
    return Ki?.(s) ?? s;
  const i = Za(e);
  return i !== t && Ue(i) ? i : "";
}
function or(e, t) {
  const n = Oe(e), r = Ko(n);
  if (r !== n)
    return or(r, t);
  if (typeof n == "string") {
    const a = Bl(n);
    if (Ue(a))
      return a;
    const f = xo(n);
    return f ? { text: f } : jn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((f) => or(f, t)).filter(Ue);
    return a.length > 0 ? a : "";
  }
  if (!Ke(n))
    return n;
  if (yr(n)) {
    const a = Ul(n);
    if (a !== void 0)
      return or(a, t);
    const f = Kl(n);
    if (f)
      return { text: f };
    const u = fr(n) || vt(n);
    return u ? { rich: u } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), tc(n))
    return na(n);
  if ($l(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const f = or(n[a], t);
    if (Ue(f))
      return f;
  }
  const o = Ja(n);
  if (o) {
    const a = { rich: o };
    return Ki?.(a) ?? a;
  }
  const s = vt(n);
  if (s)
    return { rich: s };
  const i = Gs(n);
  if (i)
    return Ki?.(i) ?? i;
  const c = St(n);
  if (c !== n)
    return or(c, t);
  if (ob(n))
    return na(n);
  if (Ys(n)) {
    const a = Me(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return Hs(n) ? n : "";
}
function ob(e) {
  return !!(Ke(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function na(e) {
  const t = {}, n = Oe(e.content);
  Ke(n) && Xc(t, n), Xc(t, e);
  const r = sb(e);
  return r && (t.text = r), !Ue(t) && n && typeof n == "object" ? n : Hs(t) ? t : "";
}
function sb(e) {
  const t = Me(e.text);
  if (t)
    return t;
  const n = Oe(e.content);
  return typeof n == "string" ? n.trim() : Ke(n) ? Me(n.text) : "";
}
function Za(e) {
  const t = Ko(e);
  if (t !== e)
    return Za(t);
  const n = Gs(e);
  if (n)
    return n;
  const r = Bl(e);
  if (Ue(r))
    return r;
  const o = Oe(e), s = vt(o);
  if (s)
    return { rich: s };
  const i = St(o);
  if (i !== o) {
    const c = vt(i);
    return c ? { rich: c } : i;
  }
  return o;
}
function Gs(e) {
  const t = fr(e);
  return t ? { rich: t } : null;
}
function fr(e, t = /* @__PURE__ */ new Set()) {
  const n = Oe(e), r = Ko(n);
  if (r !== n)
    return fr(r, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = fr(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!Ke(n) || t.has(n))
    return null;
  if (t.add(n), yr(n))
    return zl(n, t) || n;
  const o = n, s = [
    We(o, ["output", "content", "rich"]),
    We(o, ["output", "rich"]),
    We(o, ["content", "rich"]),
    o.content,
    o.rich,
    o.text,
    o.summary
  ];
  for (const i of s) {
    if (i === n)
      continue;
    const c = fr(i, t);
    if (c)
      return c;
  }
  return null;
}
function zl(e, t) {
  const n = Ds(e);
  for (const r of n) {
    const o = Yc(r, t);
    if (o)
      return o;
  }
  return Yc(n.join(""), t);
}
function Yc(e, t) {
  const n = String(e || "").trim();
  if (!jn(n))
    return null;
  const r = Kd(n);
  return r === n || r === e ? null : fr(r, t);
}
function ib(e) {
  return Ds(e).join("");
}
function Ds(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => Ds(r, t));
  if (!Ke(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...Ds(e.content, t)), n;
}
function Bl(e) {
  const t = Ot(e);
  if (t)
    return { rich: t };
  const n = Oe(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = xo(n);
    return r ? { text: r } : "";
  }
  return "";
}
function Ot(e, t = /* @__PURE__ */ new Set()) {
  const n = Oe(e);
  if (yr(n))
    return zl(n, t) || n;
  if (Array.isArray(n))
    return vt(ec(n));
  if (!Ke(n) || t.has(n))
    return null;
  t.add(n);
  const r = n, o = Ja(r);
  if (o)
    return o;
  const s = [
    We(r, ["output", "content", "rich"]),
    We(r, ["output", "content"]),
    We(r, ["output", "rich"]),
    We(r, ["content", "output", "content", "rich"]),
    We(r, ["content", "output", "content"]),
    We(r, ["content", "rich"]),
    We(r, ["data", "output", "content", "rich"]),
    We(r, ["data", "output", "content"]),
    We(r, ["data", "content", "rich"]),
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
    const c = Ot(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(r)) {
    if (!ql(i) || !c || typeof c != "object")
      continue;
    const a = Ot(c, t);
    if (a)
      return a;
  }
  return null;
}
function Ja(e) {
  if (yr(e))
    return e;
  const t = Ke(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), r = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? vt({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || r === "rich_json") && e.rich != null ? Ot(e.rich) : (n === "rich_json" || r === "rich_json") && t?.rich != null ? Ot(t.rich) : null;
}
function yr(e) {
  return !!(Ke(e) && e.type === "doc" && Array.isArray(e.content));
}
function Xc(e, t) {
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
    Ue(t[n]) && (e[n] = n === "rich" ? ab(t[n]) : t[n]);
}
function ab(e) {
  return Ot(e) || vt(ec(e)) || vt(e) || e;
}
function Hs(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Ue(n));
}
function $l(e) {
  return !Ke(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => Ue(e[t]));
}
function Ue(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !jn(t) && !Pt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Ue) : Ke(e) ? Ot(e) ? !0 : Ys(e) ? !1 : Hs(e) : !1;
}
function Qa(e) {
  return Ft(
    gn(e),
    e.description || e.title
  );
}
function cb(e) {
  const t = [
    gn(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = Ot(n) || vt(Za(n)) || vt(St(n)) || vt(n);
    if (r)
      return r;
  }
  return null;
}
function Ft(e, t = "") {
  const n = St(e), r = vt(n), o = r ? ir(r).trim() : "";
  if (o && !Pt(o))
    return o;
  const s = ir(n).trim();
  if (Pt(s))
    return "";
  const i = xo(s);
  if (i)
    return i;
  if (s && !jn(s))
    return s;
  if (nc(s)) {
    const u = ir(
      St(Oe(s))
    ).trim();
    if (u && u !== s && !Pt(u))
      return u;
  }
  const c = String(t || "").trim();
  if (Pt(c))
    return "";
  const a = xo(c);
  if (a)
    return a;
  if (!jn(c))
    return c;
  const f = ir(
    St(Oe(c))
  ).trim();
  return f && f !== c && !Pt(f) ? f : "";
}
function Pt(e) {
  const t = e.trim();
  return t ? db(t) || ub(t) : !1;
}
function db(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function ub(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function Un(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = St(e);
  return Eo(n, r, t), !$n(n) && r !== e && Eo(n, e, t), Co(n) && jn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Gp(e, "video").find(
    (o) => o.url === n.videoUrl
  )?.thumbnail), n;
}
function lb(e, t) {
  return {
    text: Me(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function Eo(e, t, n, r = /* @__PURE__ */ new Set(), o = 0) {
  if (o > 12 || t == null)
    return;
  if (typeof t == "string") {
    Zc(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const f of t)
      if (Eo(e, f, n, r, o + 1), Co(e))
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
  const s = t, i = fb(e, s, n), c = Ft(t, "");
  c && c !== i && !mn(c) && (e.text ||= c);
  const a = Fr(s.url, s.src, s.href);
  if (a && a !== i && Zc(e, a, n), e.imageUrl ||= Fr(
    s.image,
    s.image_url,
    s.imageUrl,
    st(s.images),
    st(s.imageUrls)
  ), e.videoUrl ||= Fr(
    s.video,
    s.video_url,
    s.videoUrl,
    st(s.videos),
    st(s.videoUrls)
  ), e.audioUrl ||= Fr(
    s.audio,
    s.audio_url,
    s.audioUrl,
    st(s.audios),
    st(s.audioUrls)
  ), e.fileUrl ||= Fr(
    s.file,
    s.file_url,
    s.fileUrl,
    st(s.files),
    st(s.fileUrls)
  ), !Co(e)) {
    for (const f of ["output", "result", "content", "body", "data", "rich"])
      if (s[f] && typeof s[f] == "object" && (Eo(e, s[f], n, r, o + 1), Co(e)))
        return;
  }
  if (!e.text && !$n(e) && !_b(s) && Hs(s))
    try {
      const f = JSON.stringify(t, null, 2);
      qr(f) || (e.text = f);
    } catch {
      const f = String(t);
      qr(f) || (e.text = f);
    }
}
function fb(e, t, n) {
  const r = jl(
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
  const o = Fr(...mb(t, r));
  return o ? (r === "image" && (e.imageUrl ||= o), r === "video" && (e.videoUrl ||= o), r === "audio" && (e.audioUrl ||= o), r === "file" && (e.fileUrl ||= o), o) : "";
}
function pb(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return jl(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function jl(...e) {
  for (const t of e) {
    const n = Ws(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function Ws(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function mb(e, t) {
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
    We(e, ["attrs", "src"]),
    We(e, ["attrs", "url"]),
    We(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    st(e.images),
    st(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    st(e.videos),
    st(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    st(e.audios),
    st(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    st(e.files),
    st(e.fileUrls),
    ...n
  ];
}
function Zc(e, t, n) {
  const r = t.trim();
  if (!r || Pt(r))
    return;
  if (nc(r)) {
    const c = Oe(r);
    if (c !== r && (Eo(e, c, n), Co(e)))
      return;
    const a = Ft(c, "");
    a && !mn(a) && (e.text ||= a);
    return;
  }
  const o = xo(r);
  if (o) {
    e.text ||= o;
    return;
  }
  const s = ir(r);
  if (s && s !== r) {
    e.text ||= s;
    return;
  }
  const i = gb(r, n);
  if (i) {
    hb(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (mn(r)) {
    const c = Ws(n);
    if (c === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(r)) {
      e.imageUrl ||= r;
      return;
    }
    if (c === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(r)) {
      e.videoUrl ||= r;
      return;
    }
    if (c === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(r)) {
      e.audioUrl ||= r;
      return;
    }
    e.fileUrl ||= r;
    return;
  }
  e.text ||= r;
}
function gb(e, t) {
  const n = Ll(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const f = Ai(r[2]);
    if (f)
      return {
        kind: "image",
        url: f,
        caption: fs(e, r[0], r[1])
      };
  }
  const o = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (o) {
    const f = Ai(o[1]);
    if (f)
      return {
        kind: "image",
        url: f,
        caption: fs(e, o[0], "")
      };
  }
  const s = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = s.exec(e); ) {
    const f = Ai(i[2]), u = Jc(f, n);
    if (u)
      return {
        kind: u,
        url: f,
        caption: fs(e, i[0], i[1])
      };
  }
  const c = wb(e), a = Jc(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: fs(e, c, "")
  } : null;
}
function Ll(e, t) {
  return Ws(t) ? t : yb(e) ? "image" : t;
}
function yb(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function hb(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Jc(e, t) {
  if (!e || !mn(e))
    return "";
  const n = Ws(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function fs(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !mn(r) ? r : String(n || "").trim();
}
function Ai(e) {
  const t = Vl(e);
  return mn(t) ? t : "";
}
function wb(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? Vl(t[0]) : "";
}
function Vl(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function _b(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function $n(e) {
  const t = String(e.text || "").trim();
  return !!(t && !qr(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Co(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function bb(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (Ke(t)) {
      const n = Me(
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
        We(t, ["attrs", "src"]),
        We(t, ["attrs", "url"]),
        We(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function Fr(...e) {
  const t = bb(...e);
  return mn(t) ? t : "";
}
function st(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function mn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function gn(e) {
  return Ib(
    qp(e.asset?.version?.content, e.resultOutput)
  );
}
function Ib(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = Ul(n);
    if (r !== void 0)
      return r;
    const o = Kl(n);
    if (o)
      return { text: o };
    const s = Ms(n) || St(n);
    if (Ue(s) || rc(s))
      return s;
  }
  if (t !== void 0)
    return Ms(t) || St(t);
}
function Ul(e) {
  const t = Oe(e), n = yr(t) ? t : Ot(t);
  if (!n)
    return;
  const r = ib(n).trim();
  if (!jn(r))
    return;
  const o = Kd(r);
  if (o === r)
    return;
  const s = St(o);
  if (Ue(s) || rc(s))
    return s;
}
function Kl(e) {
  const t = Oe(e), n = yr(t) ? t : Ot(t);
  return Od(n);
}
function St(e) {
  const t = Oe(e), n = Ko(t);
  if (n !== t)
    return St(n);
  if ($l(t))
    return t;
  if (Ke(t) && tc(t)) {
    const s = na(t);
    if (Ue(s))
      return s;
  }
  const r = Gs(t);
  if (r)
    return r.rich;
  if (yr(t))
    return t;
  const o = Ot(t);
  return o || ec(Ps(t, /* @__PURE__ */ new Set()));
}
function Ps(e, t) {
  if (!Ke(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, r = Gl(n);
  if (r !== void 0)
    return r;
  const o = Nb(n, t);
  if (o !== void 0)
    return o;
  for (const s of vb) {
    const i = We(n, s);
    if (i === void 0 || i === e)
      continue;
    const c = Ps(
      Oe(i),
      t
    );
    if (ra(c))
      return c;
  }
  if (Ys(n))
    for (const s of ["output", "result", "data", "body"]) {
      if (n[s] === void 0 || n[s] === e)
        continue;
      const i = Ps(
        Oe(n[s]),
        t
      );
      if (ra(i))
        return i;
    }
  return e;
}
function Nb(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!ql(n) || !r || typeof r != "object")
      continue;
    const o = Ps(Oe(r), t);
    if (ra(o))
      return o;
  }
}
function ql(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const vb = [
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
function Gl(e) {
  const t = Ja(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Oe(e.content);
    if (Ke(n)) {
      const r = Gl(n);
      if (r !== void 0)
        return r;
    }
  }
}
function ec(e) {
  const t = Oe(e);
  return Ke(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function Ys(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function ra(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !jn(n) && !Pt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!Ke(e) || Ot(e) || vt(e))
    return !0;
  if (Ys(e))
    return !1;
  const t = ir(e).trim();
  return !!(t && !qr(t));
}
function We(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ke(n) || !(r in n))
      return;
    n = n[r];
  }
  return n;
}
function Ko(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Sb(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function Sb(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && /\s/.test(e[o] || ""); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const i = e.indexOf("```", s), c = i >= 0 ? e.slice(o, i) : e.slice(o), a = Cb(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    s = i + 3;
  }
}
function Cb(e, t = !1) {
  const n = e.trim(), r = Hp(n);
  for (const o of Wp([n, r])) {
    const s = Oe(o);
    if (s !== o && (t ? Rb(s) : tc(s)))
      return s;
  }
  return null;
}
function Rb(e) {
  if (!Ke(e))
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
function tc(e) {
  if (!Ke(e))
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
  ].some((n) => Ue(e[n]));
}
function nc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function jn(e) {
  const t = String(e || "").trim();
  return !!(t && (nc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function Hl(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return Pt(e) ? "" : e;
  const t = ir(e).trim();
  if (t && Pt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return qr(n) ? "" : n;
  } catch {
    const n = String(e);
    return Pt(n) ? "" : n;
  }
}
function rc(e) {
  const t = Hl(e).trim();
  return !!(t && !qr(t));
}
function qr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || Pt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const oa = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!oa || Object.keys(oa).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const xb = oa.useTheme;
function qo(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Fo(e) {
  return qo(e) ? e : {};
}
function ae(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!qo(n))
      return;
    n = n[r];
  }
  return n;
}
const Wl = {}, Qc = [], kb = [], ed = [], td = /* @__PURE__ */ new Set(), Tb = 800;
function Ab(e) {
  const t = re([]), n = re(0), r = M(() => {
    n.current && (window.cancelAnimationFrame(n.current), n.current = 0);
    const s = t.current;
    t.current = [], s.length !== 0 && e(
      (i) => s.reduce((c, a) => a(c), i)
    );
  }, [e]), o = M(
    (s) => {
      t.current.push(s), !n.current && (n.current = window.requestAnimationFrame(() => {
        n.current = 0, r();
      }));
    },
    [r]
  );
  return pe(
    () => () => {
      n.current && window.cancelAnimationFrame(n.current), t.current = [];
    },
    []
  ), ue(() => ({ enqueue: o, flush: r }), [o, r]);
}
function nd(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function Yl(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const o of nu(e, r.id))
        n.add(o.id);
  return n;
}
function Xl(e) {
  return Object.values(e).some(un);
}
function Mb(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function Db(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function Pb(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((o) => {
    const s = Rf(o), i = o.x + s.width, c = o.y + s.height;
    return o.type === "group" ? r.left <= o.x && r.top <= o.y && r.right >= i && r.bottom >= c : r.left <= i && r.right >= o.x && r.top <= c && r.bottom >= o.y;
  }).map((o) => o.id);
}
function Eb(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const Fb = {
  workSpace: ha(MN, DN),
  storyboardFrame: p_
}, Ob = {
  animated: Ph
}, zb = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, Bb = [18, 18], $b = ["Control", "Meta"], jb = {
  type: "animated",
  animated: !1
}, Lb = { padding: 0.32, maxZoom: 0.72 };
function gt(e) {
  const t = re(e);
  return Vi(() => {
    t.current = e;
  }, [e]), M((...n) => t.current(...n), []);
}
function Vb({
  onInitialLoadComplete: e
}) {
  const t = vp(), n = Sp(), r = ue(() => jN(), []), o = ue(() => LN(), []), s = ue(() => new Cy(), []), [i, c] = V(null), [a, f] = V(o), u = re(o), [h, v] = V(0), N = re(0), [_, R] = V(null), E = re(null), [K, Y] = V([]), te = K[K.length - 1] || "", [X, ie] = V({}), C = re(X), [oe, B] = V(!1), [z, j] = V([]), [G, ce] = V(!1), Ne = re(0), [de, Ce] = V("create"), [ze, me] = V(
    () => VN(r)
  ), [le, dt] = V(!1), [ke, Rt] = V(
    () => UN()
  ), { resolvedTheme: en, setTheme: Yr } = xb();
  Cp(n.site.appearance, en);
  const [Xe, ht] = V(null), [fe, Xr] = V(!0), Kn = re(!0), [wr, zt] = V({}), Bt = Ab(zt), [Zr, xt] = V({}), [Ae, tn] = V(null), [hn, wt] = V(), [qt, qe] = V(
    null
  ), [ut, kt] = V(null), [qn, Gn] = V(!1), [Jr, Hn] = V(""), [wn, Qr] = V(null), [eo, _r] = V(""), [lt, br] = V([]), [to, _n] = V([]), [Gt, Ir] = V(!1), [Ho, $t] = V(""), [nn, rn] = V(!1), [Ht, Nr] = V(1), [vr, bn] = V(!1), [jt, Ze] = V(() => /* @__PURE__ */ new Set()), [Je, no] = V(!1), [Re, Tt] = V(null), [Wn, In] = V(!1), Be = re(null), Yn = re(!1), De = re(/* @__PURE__ */ new Set()), Sr = re(/* @__PURE__ */ new Set()), ge = re(/* @__PURE__ */ new Set()), _t = re([]), ot = re(!1), ft = re(!1), Cr = re([0]), Qe = re(null), bt = re(/* @__PURE__ */ new Map()), ro = re(
    /* @__PURE__ */ new Map()
  ), nt = re(null), {
    roles: Wo,
    powers: $e,
    powerCategories: Yo,
    loaded: oo,
    required: so,
    load: Nn
  } = I_({
    space: i,
    canvases: X,
    cache: s
  });
  pe(() => {
    C.current = X;
  }, [X]), pe(() => {
    N.current = h;
  }, [h]), pe(() => {
    u.current = a;
  }, [a]), pe(() => {
    _t.current = lt;
  }, [lt]);
  const io = M((l) => {
    L.error(l instanceof Error ? l.message : "保存画布失败");
  }, []), {
    markCanvasDirty: Xn,
    flushCanvasSave: Wt,
    adoptCanvasSnapshot: on,
    forgetCanvasSnapshot: ao,
    resetCanvasAutosave: vn,
    canvasSaveStatus: Xo
  } = Ny({
    projectId: r,
    enabled: !!i,
    canvases: X,
    setCanvases: ie,
    onError: io
  }), pt = gt(
    pi
  ), Sn = gt(
    Z
  );
  pe(() => {
    if (ge.current.size === 0)
      return;
    const l = [...ge.current];
    ge.current.clear();
    for (const m of l)
      Xn(m);
  }, [X, Xn]);
  const Zn = M(async () => {
    if (!r) {
      _r("缺少作品 ID"), Xr(!1);
      return;
    }
    Xr(!0), _r("");
    try {
      const l = await Yg(
        r,
        u.current,
        N.current
      ), m = XI(
        l.canvases || {},
        l.assets || []
      ), y = Number(l.initialCanvasId || 0) || Number(Object.values(m)[0]?.id || 0), b = Number(l.initialAssetCateId || 0) || sg(l);
      c(l), C.current = m, ie(m), vn(m), u.current = y, f(y), N.current = b, v(b), Er(y), R(null), E.current = null, Ne.current += 1, B(!1), j([]), ce(!1), De.current = /* @__PURE__ */ new Set(), Sr.current = /* @__PURE__ */ new Set(), _t.current = [], br([]), _n([]), Nr(1), bn(!1), Cr.current = [0], pt(r, l, m, "recovery", {
        canvasId: y
      });
    } catch (l) {
      _r(l instanceof Error ? l.message : "加载创作空间失败");
    } finally {
      Xr(!1);
    }
  }, [pt, r, vn]), Rr = M((l) => {
    qe(l);
  }, []);
  pe(() => {
    Zn();
  }, [Zn]), pe(() => {
    fe || !Kn.current || (Kn.current = !1, e());
  }, [fe, e]);
  const Cn = i?.assetCates, Yt = ue(() => i ? Iu(i) : [], [i]), Rn = Yt.length > 1, Q = ue(
    () => i ? Ni(i, h) : null,
    [h, i]
  ), Zo = ue(
    () => i && Q ? ig(i, Q.id) : [],
    [Q, i]
  ), Jo = ue(() => Wo.filter(ag), [Wo]), Qo = ue(() => $e.filter(cg), [$e]), Lt = ue(
    () => $e.some(
      (l) => Number(l.id || 0) > 0 && String(l.kind || "").trim().toLowerCase() === "video" && Ln(l).outputType === "lip_sync"
    ),
    [$e]
  ), H = ue(() => {
    const l = i?.canvasList.find(
      (m) => m.id === a
    );
    return X[String(a)] || Nc(
      l?.assetCateId || Q?.id || 0,
      a,
      l?.name || "第一幕"
    );
  }, [a, Q?.id, X, i?.canvasList]), co = ue(
    () => (i?.canvasList || []).filter((l) => l.assetCateId === Q?.id).sort((l, m) => l.sort - m.sort || l.id - m.id),
    [Q?.id, i?.canvasList]
  ), xn = M(
    async (l) => {
      const m = Ne.current + 1;
      Ne.current = m, ce(!0);
      try {
        const y = await ey({
          projectId: r,
          assetCateId: l
        });
        Ne.current === m && j(y);
      } catch (y) {
        Ne.current === m && (j([]), L.error(
          y instanceof Error ? y.message : "加载已删除画布失败"
        ));
      } finally {
        Ne.current === m && ce(!1);
      }
    },
    [r]
  ), Js = M(() => {
    Q && (B(!0), j([]), xn(Q.id));
  }, [Q, xn]), Qs = ue(
    () => Object.entries(X).map(
      ([l, m]) => `${l}:${Kw(m)}`
    ).join("|"),
    [X]
  ), Ee = ue(
    () => Yb(H, Zr),
    [H, Zr]
  ), ei = ue(() => {
    const l = new Set(K);
    return Ee.nodes.filter((m) => l.has(m.id));
  }, [Ee.nodes, K]), ti = M(
    async (l) => {
      const m = await go({
        projectId: r,
        canvasId: l
      }), y = Or(
        Dr(m.canvas, $e),
        m.assets
      );
      c(
        (S) => S && {
          ...S,
          assets: Pr(S.assets, m.assets),
          canvasList: m.canvasList.length > 0 ? m.canvasList : S.canvasList
        }
      );
      const b = String(l), w = {
        ...C.current,
        [b]: y
      };
      C.current = w, ie(w), on(y);
    },
    [on, $e, r]
  ), ni = M((l) => {
    const m = Fl(l);
    Rt(m), Id(
      Pl,
      String(m)
    );
  }, []), es = M(
    (l) => {
      me(l), l || dt(!1), Id(
        `${El}:${r}`,
        l ? "1" : "0"
      );
    },
    [r]
  ), Ge = cr, ts = ue(
    () => uh({
      nodes: Ee.nodes,
      assets: i?.assets || [],
      canvasId: H.id,
      assetCateId: Q?.id || 0,
      nodeOutput: gn,
      nodePreview: hr,
      assetPreview: (l) => {
        const m = l.version?.content ?? l.name, y = Un(
          m,
          String(l.kind || "")
        );
        return $n(y) || (y.text = l.name), y;
      },
      nodeHasResult: Ut
    }),
    [H.id, Q?.id, Ee.nodes, i?.assets]
  ), ns = ue(
    () => ph(ts),
    [ts]
  );
  pe(() => {
    !Cn || so && !oo || ie((l) => {
      let m = l;
      for (const [y, b] of Object.entries(l)) {
        const w = Number(b.assetCateId || 0), S = Qi({
          canvas: b,
          assetCate: Yi(Cn, w),
          powers: $e
        }), A = pd(S, w);
        md(b, A) || (m === l && (m = { ...l }), m[y] = A, ge.current.add(b.id || Number(y)));
      }
      return m;
    });
  }, [
    Cn,
    oo,
    so,
    $e,
    Qs
  ]);
  const uo = M(
    (l = "") => {
      Wc(), Hn(l), Be.current = H.nodes.find((m) => m.id === l) || (Be.current?.id === l ? Be.current : null), ht(null), Ce("create"), Gn(!0);
    },
    [H.nodes]
  ), sn = M(
    (l, m) => {
      if (!Number.isInteger(l) || l <= 0)
        return;
      const y = (S) => {
        const A = String(l), $ = S[A];
        if (!$) return S;
        const F = pd(
          m($),
          $.assetCateId
        );
        return md($, F) ? S : (ge.current.add(l), {
          ...S,
          [A]: F
        });
      }, b = C.current, w = y(b);
      C.current = w, ie((S) => {
        const A = S === b ? w : y(S);
        return C.current = A, A;
      });
    },
    []
  ), He = M(
    (l) => {
      Q && sn(H.id, l);
    },
    [H.id, Q, sn]
  ), lo = M(
    (l, m, y) => {
      u.current === l && xt(
        (b) => Xb(b, m, y)
      ), sn(l, (b) => {
        const w = b.assetCateId, S = {
          ...b,
          nodes: b.nodes.map(
            ($) => $.id === m ? { ...$, ...y } : $
          )
        };
        return Cn ? Qi({
          canvas: S,
          assetCate: Yi(Cn, w),
          powers: $e
        }) : S;
      });
    },
    [Cn, $e, sn]
  ), it = M(
    (l, m) => {
      lo(H.id, l, m), u.current === H.id && tn(
        (y) => y?.id === l ? { ...y, ...m } : y
      );
    },
    [H.id, lo]
  ), xr = M(
    (l, m, y) => {
      if (!OI(m, y))
        return;
      const b = yf(y), w = `${l}:${m.id}:${b}`;
      if (De.current.has(w))
        return;
      De.current.add(w);
      const S = m.title.trim(), A = C.current[String(l)];
      sy({
        projectId: r,
        nodeKey: m.id,
        versionId: b,
        prompt: FI(m, A)
      }).then(($) => {
        const F = $.title.trim();
        !F || F === S || $.versionId !== b || sn(l, (U) => {
          const W = U.nodes.find(
            (se) => se.id === m.id
          );
          return !W || W.titleMode !== "auto" || W.title.trim() !== S || !gf(W) ? U : {
            ...U,
            nodes: U.nodes.map(
              (se) => se.id === m.id ? { ...se, title: F } : se
            )
          };
        });
      }).catch(() => {
        De.current.delete(w);
      });
    },
    [r, sn]
  ), kn = M(
    async (l) => {
      l.canvasId && Xn(l.canvasId);
    },
    [Xn]
  ), rs = M(
    (l, m, y) => {
      const b = {};
      He((w) => {
        const S = w.nodes.map(
          (A) => A.id === l ? {
            ...A,
            composerDraft: za(m)
          } : A
        );
        return b.canvas = { ...w, nodes: S }, b.canvas;
      }), y?.save === "immediate" && b.canvas && Wt(b.canvas).catch(() => {
      });
    },
    [Wt, He]
  ), os = M(
    (l) => {
      He((m) => {
        const y = m.edges.filter((b) => b.id !== l);
        return y.length === m.edges.length ? m : { ...m, edges: y };
      });
    },
    [He]
  ), xe = M(
    (l, m) => {
      Po(), wt(m), tn(l);
    },
    []
  ), Xt = M(
    (l, m) => {
      xt((y) => {
        const b = H.nodes.find(
          (A) => A.id === l
        );
        if (!b)
          return y;
        const w = y[l] || {}, S = {
          ...b,
          ...w
        };
        return {
          ...y,
          [l]: {
            ...w,
            feedbackRequests: m(ur(S))
          }
        };
      });
    },
    [H.nodes]
  ), Zt = M((l) => {
    const m = new Set(l.filter(Boolean));
    if (m.size !== 0) {
      if (nt.current && m.has(nt.current.nodeId)) {
        const y = nt.current;
        nt.current = null, y.reject(new Error(Uu));
      }
      Tt(
        (y) => y && m.has(y.node.id) ? null : y
      ), xt((y) => {
        const b = { ...y };
        let w = !1;
        for (const S of m) {
          const A = b[S] || {};
          b[S] = {
            ...A,
            feedbackRequests: []
          }, w = !0;
        }
        return w ? b : y;
      });
    }
  }, []), at = M((l) => {
    !l || !l.id || c((m) => m && {
      ...m,
      assets: Pr(m.assets, [l])
    });
  }, []), Jn = M(
    ({ node: l, prompt: m }) => {
      const y = oc(l, m), b = ia(
        ur(l),
        y
      );
      return Xt(
        l.id,
        (w) => ia(w, y)
      ), In(!1), new Promise((w, S) => {
        nt.current = {
          nodeId: l.id,
          recordId: y.id,
          resolve: w,
          reject: S
        }, Tt({
          node: { ...l, feedbackRequests: b },
          recordId: y.id,
          prompt: m
        });
      });
    },
    [Xt]
  ), At = M(
    async (l) => {
      const m = nt.current;
      if (!(!m || Wn)) {
        In(!0);
        try {
          await m.submit?.(l), Xt(
            m.nodeId,
            (y) => _h(y, m.recordId, l)
          ), nt.current = null, Tt(null), m.resolve(l);
        } catch (y) {
          L.error(y instanceof Error ? y.message : "提交反馈失败");
        } finally {
          In(!1);
        }
      }
    },
    [Xt, Wn]
  ), ri = M(() => {
    Tt(null);
  }, []), oi = M(
    (l, m) => {
      if (nt.current?.nodeId === l.id && nt.current.recordId === m.id && m.status === "pending") {
        Tt({
          node: l,
          recordId: m.id,
          prompt: m.prompt
        });
        return;
      }
      if (m.status === "pending") {
        const y = EI(
          _t.current,
          l,
          m
        );
        if (y) {
          In(!1), nt.current = {
            nodeId: l.id,
            recordId: m.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (b) => {
              await pf(
                r,
                y.run,
                y.pending,
                y.prompt,
                b
              ), L.success("已提交反馈，流程继续执行"), window.setTimeout(() => Qe.current?.(), 0);
            }
          }, Tt({
            node: l,
            recordId: m.id,
            prompt: y.prompt
          });
          return;
        }
      }
      Tt({
        node: l,
        recordId: m.id,
        prompt: {
          ...m.prompt,
          values: m.values || m.prompt.values || {}
        }
      });
    },
    [r]
  ), Tn = M(
    ({
      assetCate: l,
      startNode: m,
      canvas: y,
      nodes: b = y.nodes,
      ...w
    }) => {
      if (!i)
        throw new Error("创作空间尚未加载");
      const S = y.id, A = (F) => {
        zt((U) => u.current !== S ? U : typeof F == "function" ? F(U) : F);
      }, $ = {
        enqueue: (F) => Bt.enqueue(
          (U) => u.current === S ? F(U) : U
        ),
        flush: Bt.flush
      };
      return {
        projectId: r,
        canvasId: S,
        assetCate: l,
        space: i,
        startNode: m,
        ...w,
        nodes: b,
        edges: y.edges,
        viewport: y.viewport,
        canvasUpdatedAt: y.updatedAt,
        flushCanvasSave: Wt,
        onNodeResult: it,
        onAssetCreated: at,
        setRunningNode: A,
        runningNodeBatcher: $,
        requestFlowFeedback: Jn,
        requestNodeTitle: (F, U) => xr(y.id, F, U)
      };
    },
    [
      r,
      Wt,
      xr,
      Jn,
      Bt,
      i,
      it,
      at
    ]
  ), An = M(
    async (l) => {
      i && await pt(
        r,
        i,
        C.current,
        "recovery",
        {
          canvasId: l?.canvasId || u.current,
          runIds: [Number(l?.canvasRun?.run_id || 0)]
        }
      );
    },
    [pt, r, i]
  ), ss = M(
    async (l) => {
      if (!i || !Q)
        return;
      let m = null;
      try {
        Zt(
          Ay(
            l.id,
            Ee.nodes,
            Ee.edges
          )
        ), m = Tn({
          assetCate: Q,
          startNode: l,
          canvas: {
            ...H,
            nodes: Ee.nodes,
            edges: Ee.edges,
            viewport: H.viewport
          }
        }), await Di(m), await kn(m), L.success("开始节点执行完成");
      } catch (y) {
        if (hh(y) || Io(y))
          return;
        const b = y instanceof Error ? y.message : "开始节点执行失败";
        m?.setRunningNode?.((w) => ({
          ...w,
          [l.id]: {
            nodeId: l.id,
            title: l.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error"
          }
        })), L.error(b), window.setTimeout(() => {
          m?.setRunningNode?.(
            (w) => So(w, l.id)
          );
        }, 1400);
      } finally {
        await An(m);
      }
    },
    [
      Q,
      H,
      Ee.edges,
      Ee.nodes,
      Zt,
      Tn,
      kn,
      An,
      i
    ]
  ), si = M(
    async (l) => {
      if (!i || !Q)
        return;
      const m = C.current[String(H.id)] || H, y = m.nodes.find(
        (F) => F.id === l
      );
      if (!y) {
        L.error("分镜脚本节点不存在");
        return;
      }
      const b = _l(
        m.nodes,
        Ut
      ).find((F) => F.sourceNodeId === l);
      if (!b) {
        L.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const w = bl(
        b,
        m.nodes,
        Ut
      );
      if (w.blockedReason) {
        L.error(w.blockedReason);
        return;
      }
      const S = Ks(l), A = Tn({
        assetCate: Q,
        startNode: y,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        canvas: m
      });
      Zt(w.pendingNodeIds), A.setRunningNode?.((F) => ({
        ...F,
        [S]: {
          nodeId: S,
          title: `${y.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let $ = 650;
      try {
        await Di(A), L.success("制作区执行完成");
      } catch (F) {
        if (Io(F))
          $ = 0;
        else {
          $ = 1400;
          const U = F instanceof Error ? F.message : "制作区执行失败";
          A.setRunningNode?.((W) => ({
            ...W,
            [S]: {
              ...W[S] || {
                nodeId: S,
                title: `${y.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0
              },
              status: "error"
            }
          })), L.error(U);
        }
      } finally {
        const F = new Set(
          (A.canvasRun?.node_results || []).filter((U) => yn(U) === "success").map((U) => U.node_key).filter(Boolean)
        );
        F.size > 0 && (He(
          (U) => rd({
            canvas: U,
            sourceNodeId: l,
            successfulNodeIds: F,
            assetCate: Q,
            powers: $e
          })
        ), await kn(A)), window.setTimeout(() => {
          A.setRunningNode?.(
            (U) => So(U, S)
          );
        }, $), await An(A);
      }
    },
    [
      H,
      Q,
      Zt,
      Tn,
      kn,
      $e,
      An,
      i,
      He
    ]
  ), is = M(
    async (l, m) => {
      if (!i || !Q)
        return;
      const y = C.current[String(H.id)] || H, b = y.nodes.find((ne) => ne.id === l.id) || l, w = Jb({
        ...b,
        composerDraft: {
          ...b.composerDraft || {},
          ...l.composerDraft || {}
        }
      }), S = ky(
        w.id,
        m?.targetNodeIds
      ), A = Ty(
        y.nodes.map(
          (ne) => ne.id === w.id ? w : ne
        ),
        S
      ), $ = new Map(
        A.map((ne) => [ne.id, ne])
      ), F = S.map((ne) => $.get(ne)).filter((ne) => !!ne), U = (ne) => {
        let Pe = ne;
        for (const Se of S)
          Pe[Se] && (Pe === ne && (Pe = { ...ne }), delete Pe[Se]);
        return Pe;
      }, W = If(
        l.id,
        A,
        y.edges
      ), se = Tn({
        assetCate: Q,
        startNode: w,
        singleNode: !0,
        targetNodeIds: m?.targetNodeIds,
        canvas: y,
        nodes: A,
        runInput: {
          _manual_input_context: W || void 0,
          _agent_turn_input: m?.agentInput,
          manual_node_id: l.id
        }
      });
      for (const ne of F)
        it(ne.id, { runError: "" });
      se.setRunningNode?.((ne) => {
        const Pe = { ...ne };
        for (const Se of F) {
          const an = ne[Se.id];
          Pe[Se.id] = {
            ...an || {},
            nodeId: Se.id,
            title: Se.title,
            startedAt: an?.startedAt || Date.now(),
            progress: Math.max(an?.progress || 0, 8),
            status: "running",
            ...Se.id === w.id && m?.agentInput ? { agent: $u() } : {}
          };
        }
        return Pe;
      });
      try {
        await Di(se), await kn(se);
      } catch (ne) {
        if (Io(ne)) {
          it(w.id, { runError: "" }), se.setRunningNode?.(U);
          return;
        }
        throw it(w.id, {
          runError: ne instanceof Error ? ne.message : "节点运行失败"
        }), se.setRunningNode?.((Pe) => ({
          ...Pe,
          [w.id]: {
            ...Pe[w.id] || {
              nodeId: w.id,
              title: w.title,
              startedAt: Date.now()
            },
            progress: 92,
            status: "error"
          }
        })), window.setTimeout(() => {
          se.setRunningNode?.(U);
        }, 1400), ne;
      } finally {
        await An(se);
      }
    },
    [
      Q,
      H,
      Tn,
      kn,
      An,
      i,
      it
    ]
  ), ii = M(
    async (l) => {
      if (!Q)
        throw new Error("当前分类不存在");
      return bN({
        node: l,
        projectId: r,
        canvasId: H.id,
        assetCate: Q,
        inputContext: l.inputContext || null,
        onNodeResult: it,
        onAssetCreated: at,
        onRunStartNode: ss,
        onOpenImportPicker: uo
      });
    },
    [
      H.id,
      Q,
      uo,
      r,
      ss,
      it,
      at
    ]
  );
  pe(() => {
    i && Sn(lt, H, i);
  }, [H, Sn, lt, i]);
  async function kr() {
    const l = C.current[String(u.current)] || H;
    if (!l.id)
      return !0;
    try {
      return await Wt(l), !0;
    } catch {
      return !1;
    }
  }
  function Qn() {
    Y([]), xt({}), zt({}), kt(null), ht(null), tn(null), wt(void 0), Gn(!1), Hn(""), Be.current = null, Qr(null), rn(!1);
  }
  async function fo(l) {
    if (l === u.current) return !0;
    if (E.current != null)
      return !1;
    const m = i?.canvasList.find((w) => w.id === l);
    if (!m)
      return L.error("目标画布不存在"), !1;
    if (!await kr()) return !1;
    const y = String(l);
    if (!Object.prototype.hasOwnProperty.call(C.current, y)) {
      E.current = m.assetCateId, R(m.assetCateId);
      try {
        const w = await go({
          projectId: r,
          canvasId: l
        }), S = Or(
          Dr(w.canvas, $e),
          w.assets
        );
        c(
          ($) => $ && {
            ...$,
            assets: Pr($.assets, w.assets),
            canvasList: w.canvasList.length > 0 ? w.canvasList : $.canvasList
          }
        );
        const A = {
          ...C.current,
          [y]: S
        };
        C.current = A, ie(A), on(S);
      } catch (w) {
        return L.error(w instanceof Error ? w.message : "加载画布失败"), !1;
      } finally {
        E.current = null, R(null);
      }
    }
    if (u.current = l, f(l), N.current = m.assetCateId, v(m.assetCateId), Er(l), Qn(), !i)
      return !0;
    const b = C.current[y] || Nc(m.assetCateId, l, m.name);
    return Sn(lt, b, i), pt(
      r,
      i,
      C.current,
      "recovery",
      { canvasId: l }
    ), !0;
  }
  async function as(l) {
    const m = (i?.canvasList || []).filter((y) => y.assetCateId === l).sort((y, b) => y.sort - b.sort || y.id - b.id)[0];
    if (m) return fo(m.id);
    if (!i || E.current != null || !await kr()) return !1;
    E.current = l, R(l);
    try {
      const y = await go({
        projectId: r,
        canvasId: 0,
        assetCateId: l
      }), b = Or(
        Dr(y.canvas, $e),
        y.assets
      ), w = b.id, S = {
        ...C.current,
        [String(w)]: b
      };
      return C.current = S, ie(S), on(b), c(
        (A) => A && {
          ...A,
          assets: Pr(A.assets, y.assets),
          canvasList: y.canvasList.length > 0 ? y.canvasList : A.canvasList
        }
      ), u.current = w, f(w), N.current = l, v(l), Er(w), Qn(), pt(r, i, S, "recovery", {
        canvasId: w
      }), !0;
    } catch (y) {
      return L.error(y instanceof Error ? y.message : "加载输出类型失败"), !1;
    } finally {
      E.current = null, R(null);
    }
  }
  async function ai(l) {
    if (Q) {
      if (!await kr())
        throw new Error("当前画布保存失败，未创建新画布");
      try {
        const m = await Xg({
          projectId: r,
          assetCateId: Q.id,
          name: l
        }), y = m.canvas;
        if (!y?.id) throw new Error("新画布数据为空");
        const b = Dr(y, $e), w = {
          ...C.current,
          [String(y.id)]: b
        };
        C.current = w, ie(w), on(b), c(
          (S) => S && {
            ...S,
            canvasList: m.canvasList,
            initialCanvasId: y.id,
            initialAssetCateId: y.assetCateId
          }
        ), u.current = y.id, f(y.id), N.current = y.assetCateId, v(y.assetCateId), Er(y.id), Qn(), L.success("画布已创建");
      } catch (m) {
        throw L.error(m instanceof Error ? m.message : "创建画布失败"), m;
      }
    }
  }
  async function ci(l, m) {
    try {
      const y = await Zg({ projectId: r, canvasId: l, name: m });
      c(
        (b) => b && { ...b, canvasList: y.canvasList }
      ), ie((b) => {
        const w = b[String(l)];
        if (!w) return b;
        const S = {
          ...b,
          [String(l)]: { ...w, name: m }
        };
        return C.current = S, S;
      }), L.success("画布已重命名");
    } catch (y) {
      throw L.error(y instanceof Error ? y.message : "重命名画布失败"), y;
    }
  }
  async function di(l) {
    if (Q)
      try {
        const m = await Jg({
          projectId: r,
          assetCateId: Q.id,
          canvasIds: l
        });
        c(
          (y) => y && { ...y, canvasList: m.canvasList }
        );
      } catch (m) {
        throw L.error(m instanceof Error ? m.message : "调整画布顺序失败"), m;
      }
  }
  async function ui(l) {
    try {
      const m = l === u.current, y = C.current[String(l)];
      y && await Wt(y);
      const b = await Qg({ projectId: r, canvasId: l });
      if (ao(l), c(
        (w) => w && { ...w, canvasList: b.canvasList }
      ), C.current[String(l)]) {
        const w = { ...C.current };
        delete w[String(l)], C.current = w, ie(w);
      }
      if (m && b.activeCanvasId) {
        const w = b.canvasList.find(
          (A) => A.id === b.activeCanvasId
        );
        let S = C.current[String(b.activeCanvasId)];
        if (!S) {
          const A = await go({
            projectId: r,
            canvasId: b.activeCanvasId
          });
          S = Or(
            Dr(A.canvas, $e),
            A.assets
          );
          const $ = {
            ...C.current,
            [String(S.id)]: S
          };
          C.current = $, ie($), c(
            (F) => F && {
              ...F,
              assets: Pr(F.assets, A.assets),
              canvasList: b.canvasList
            }
          );
        }
        on(S), u.current = S.id, f(S.id), N.current = w?.assetCateId || S.assetCateId, v(w?.assetCateId || S.assetCateId), Er(S.id), Qn(), i && pt(
          r,
          i,
          C.current,
          "recovery",
          { canvasId: S.id }
        );
      }
      xn(N.current), L.success("画布已删除");
    } catch (m) {
      throw L.error(m instanceof Error ? m.message : "删除画布失败"), m;
    }
  }
  async function li(l) {
    try {
      if (!await kr())
        throw new Error("当前画布保存失败，未恢复画布");
      const m = await ty({ projectId: r, canvasId: l });
      if (!m.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let y = m.canvas, b = [], w = m.canvasList, S = "";
      try {
        const F = await go({
          projectId: r,
          canvasId: m.canvas.id
        });
        y = F.canvas, b = F.assets, F.canvasList.length > 0 && (w = F.canvasList);
      } catch (F) {
        S = F instanceof Error ? `画布已恢复，但资产加载失败：${F.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const A = Or(
        Dr(y, $e),
        b
      ), $ = {
        ...C.current,
        [String(A.id)]: A
      };
      C.current = $, ie($), on(A), c(
        (F) => F && {
          ...F,
          assets: Pr(F.assets, b),
          canvasList: w,
          initialCanvasId: A.id,
          initialAssetCateId: A.assetCateId
        }
      ), u.current = A.id, f(A.id), N.current = A.assetCateId, v(A.assetCateId), Er(A.id), j(
        (F) => F.filter((U) => U.id !== A.id)
      ), B(!1), Qn(), i && pt(r, i, $, "recovery", {
        canvasId: A.id
      }), S ? L.warning(S) : L.success("画布已恢复");
    } catch (m) {
      throw L.error(m instanceof Error ? m.message : "恢复画布失败"), m;
    }
  }
  function po(l) {
    kt((m) => ({
      nodeId: l,
      nonce: (m?.nonce || 0) + 1
    }));
  }
  const fi = M((l) => {
    kt((m) => !m || m.nodeId !== l.nodeId || m.nonce !== l.nonce ? m : null);
  }, []);
  async function pi(l, m, y, b, w = {}) {
    if (!ot.current) {
      ot.current = !0;
      try {
        const S = w.canvasId ? y[String(w.canvasId)] : void 0, A = S ? _t.current.filter(
          (Se) => Ei(Se, S)
        ) : _t.current, $ = b === "active" ? wI(A) : [], F = (w.runIds || []).filter((Se) => Se > 0), U = F.length > 0 ? F : b === "active" ? $.map((Se) => Number(Se.run_id || 0)) : [], W = b === "recovery" && U.length === 0;
        let se = await vi({
          projectId: l,
          scope: b,
          canvasId: w.canvasId,
          runIds: U,
          summaryOnly: W
        }), ne = Fi(se.items);
        if (W) {
          const Se = NI(ne, y);
          Se.length === 0 ? ne = [] : (se = await vi({
            projectId: l,
            scope: b,
            canvasId: w.canvasId,
            runIds: Se
          }), ne = Fi(se.items));
        }
        if (b === "active" && $.length > 0) {
          const Se = new Set(ne.map(ar)), an = $.filter(
            (ct) => !Se.has(ar(ct))
          );
          if (an.length > 0) {
            const ct = await Promise.all(
              an.map(async (mo) => {
                try {
                  const Lf = await Mu({
                    projectId: l,
                    executionId: Number(mo.execution_id || 0),
                    runId: Number(mo.run_id || 0),
                    requestId: String(mo.request_id || "")
                  });
                  return lf(Lf);
                } catch {
                  return null;
                }
              })
            );
            ne = ad(
              ne,
              ct.filter(
                (mo) => !!mo
              )
            );
          }
        }
        const Pe = ad(
          _t.current,
          ne
        );
        _t.current = Pe, br(Pe);
        for (const Se of Object.values(y))
          Sn(ne, Se, m);
      } catch {
      } finally {
        ot.current = !1;
      }
    }
  }
  async function er(l, m = 0) {
    if (ft.current)
      return;
    const y = Cr.current[m] || 0;
    ft.current = !0, Ir(!0), $t("");
    try {
      const b = await vi({
        projectId: l,
        canvasId: u.current,
        scope: "history",
        beforeId: y,
        limit: 20
      });
      _n(
        Fi(b.items)
      ), Nr(m + 1), bn(b.hasMore);
      const w = Cr.current.slice(0, m + 1);
      b.hasMore && b.beforeId > 0 && (w[m + 1] = b.beforeId), Cr.current = w;
    } catch (b) {
      $t(
        b instanceof Error ? b.message : "读取画布运行记录失败"
      );
    } finally {
      ft.current = !1, Ir(!1);
    }
  }
  const p = ue(
    () => uf(
      lt.filter(
        (l) => Ei(l, H)
      )
    ),
    [H, lt]
  ), g = p.length > 0, k = g || Xl(wr);
  async function I(l) {
    const m = !l;
    if (m && (Je || jt.size > 0) || !m && l?.some(
      (b) => jt.has(ar(b))
    ))
      return;
    let y = [];
    m && no(!0);
    try {
      let b = l || [], w = 0, S = b.length;
      if (m) {
        const F = await dy(
          r,
          u.current
        );
        b = F.items.map(Bn), w = F.failedCount, S = F.count;
      } else
        b = _I(b);
      if (S === 0) {
        L.info("当前没有运行中的任务");
        return;
      }
      m || (y = b.map(ar), Ze((U) => {
        const W = new Set(U);
        for (const se of y)
          W.add(se);
        return W;
      }), b = (await Promise.allSettled(
        b.map(
          (U) => cy({
            projectId: r,
            runId: Number(U.run_id || 0),
            requestId: String(U.request_id || "")
          })
        )
      )).flatMap((U, W) => {
        if (U.status === "rejected")
          return w += 1, [];
        const se = Bn(U.value);
        return [
          {
            ...b[W],
            status: se.status,
            error: se.error
          }
        ];
      }));
      const A = bI(b), $ = b.filter((F) => F.status === "canceled");
      if (A.size > 0) {
        const F = (/* @__PURE__ */ new Date()).toISOString(), U = (se) => se.map((ne) => {
          const Pe = II(A, ne);
          return Pe ? { ...ne, status: Pe, updated_at: F } : ne;
        }), W = U(_t.current);
        _t.current = W, br(W), _n(U);
      }
      if ($.length > 0) {
        const F = new Set(
          $.flatMap((U) => {
            const W = Fs(U), se = Xs(U);
            return se ? [...W, se] : W;
          })
        );
        zt((U) => {
          if (m && w === 0)
            return Wl;
          let W = U;
          for (const se of F)
            W[se] && (W === U && (W = { ...U }), delete W[se]);
          return W;
        }), L.success(
          $.length === 1 ? "已停止运行" : `已停止 ${$.length} 个运行`
        );
      } else w === 0 && L.info("任务已经结束，无需停止");
      w > 0 && L.error(
        w === S ? "停止运行失败，请稍后重试" : `${w} 个运行停止失败，请稍后重试`
      ), nn && er(
        r,
        Math.max(0, Ht - 1)
      ), window.setTimeout(() => Qe.current?.(), 0);
    } catch (b) {
      L.error(b instanceof Error ? b.message : "停止画布运行失败");
    } finally {
      y.length > 0 && Ze((b) => {
        const w = new Set(b);
        for (const S of y)
          w.delete(S);
        return w;
      }), m && no(!1);
    }
  }
  function T() {
    Rr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => I()
    });
  }
  function O(l) {
    Rr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => I([l])
    });
  }
  Qe.current = i ? () => {
    pt(
      r,
      i,
      C.current,
      "active",
      { canvasId: u.current }
    );
  } : null, pe(() => {
    if (!i || !g)
      return;
    const l = window.setInterval(() => {
      Qe.current?.();
    }, tf);
    return () => window.clearInterval(l);
  }, [g, r, i]), pe(() => {
    const l = bt.current, m = ro.current, y = [];
    if (i)
      for (const w of p) {
        const S = w.run, A = String(S.request_id || "").trim();
        A && y.push({
          key: `${r}:${A}`,
          canvasId: Number(S.canvas_id || u.current),
          requestId: A,
          run: S,
          managedNodeIds: w.managedNodeIds
        });
      }
    const b = new Set(y.map((w) => w.key));
    for (const [w, S] of l)
      b.has(w) || (S.controller.abort(), l.delete(w), m.delete(w));
    for (const w of y) {
      const S = l.get(w.key);
      if (S) {
        S.managedNodeIds = w.managedNodeIds;
        for (const F of ua(w.run))
          S.finishedNodeIds.add(F);
        continue;
      }
      const A = new AbortController(), $ = {
        controller: A,
        managedNodeIds: w.managedNodeIds,
        finishedNodeIds: ua(w.run)
      };
      l.set(w.key, $), Vu({
        projectId: r,
        requestId: w.requestId,
        lastId: m.get(w.key) || "0-0",
        signal: A.signal,
        onFrame: (F) => {
          A.signal.aborted || u.current !== w.canvasId || (F.stream_id && m.set(w.key, F.stream_id), mI(
            { setRunningNode: zt, runningNodeBatcher: Bt },
            F,
            $.managedNodeIds,
            $.finishedNodeIds
          ));
        }
      }).catch(() => {
        !A.signal.aborted && l.get(w.key) === $ && l.delete(w.key);
      });
    }
  }, [r, p, Bt, i]), pe(
    () => () => {
      for (const l of bt.current.values())
        l.controller.abort();
      bt.current.clear(), ro.current.clear();
    },
    []
  );
  function Z(l, m, y) {
    const b = l.filter(
      (A) => Ei(A, m) && !la(A, m)
    );
    if (b.length === 0)
      return;
    const w = /* @__PURE__ */ new Set(), S = /* @__PURE__ */ new Set();
    for (const A of b) {
      const $ = new Set(
        Fs(A).filter((U) => S.has(U) ? !1 : (S.add(U), !0))
      );
      if ($.size === 0)
        continue;
      const F = (A.node_results || []).filter((U) => {
        const W = U.node_key;
        return !W || !$.has(W) || w.has(W) ? !1 : (w.add(W), !0);
      });
      J(
        A,
        m,
        y,
        F,
        $
      );
    }
  }
  function J(l, m, y, b = l.node_results || [], w) {
    const S = kI(l, m.nodes);
    if (!S)
      return;
    const A = Ni(y, m.assetCateId);
    if (!A)
      return;
    const $ = {
      projectId: r,
      canvasId: m.id,
      assetCate: A,
      space: y,
      startNode: S,
      nodes: m.nodes,
      edges: m.edges,
      viewport: m.viewport,
      onNodeResult: (U, W) => lo(m.id, U, W),
      onAssetCreated: at,
      setRunningNode: zt,
      requestFlowFeedback: Jn,
      requestNodeTitle: (U, W) => xr(m.id, U, W),
      canvasRun: l
    }, F = b.filter((U) => {
      const W = TI(l, U);
      return !W || Sr.current.has(W) ? !1 : (Sr.current.add(W), !0);
    });
    mf($, F), af($, F), ee($, l, S), Lr($, l, w), cf($, l, w);
  }
  function ee(l, m, y) {
    if (m.single_node || String(m.status || "").trim().toLowerCase() !== "success" || !zo(y.resultOutput))
      return;
    const b = new Set(
      (m.node_results || []).filter((w) => yn(w) === "success").map((w) => w.node_key).filter(Boolean)
    );
    sn(
      l.canvasId,
      (w) => rd({
        canvas: w,
        sourceNodeId: y.id,
        successfulNodeIds: b,
        assetCate: l.assetCate,
        powers: $e
      })
    );
  }
  function q(l, m, y) {
    if (!Q)
      return null;
    const b = $s(
      l,
      Q,
      H.nodes.length,
      m,
      y
    ), w = i ? Ni(i, pa(b) || Q.id) : Q;
    l === "asset" && (b.cardinality = w.cardinality);
    const S = l === "asset" && y?.replaceSingleAssetNode ? pa(b) || Number(w.id || 0) : 0, A = S ? ld(
      H.nodes,
      H.edges,
      S,
      y?.connectFromNodeId
    ) : null, $ = A ? fd(
      H.nodes,
      H.edges,
      S,
      y?.connectFromNodeId,
      A.id
    ) : /* @__PURE__ */ new Set(), F = A?.id || b.id, U = Xe?.connection;
    if (He((W) => {
      let se = W.edges;
      const ne = S ? ld(
        W.nodes,
        W.edges,
        S,
        y?.connectFromNodeId
      ) : null;
      if (ne) {
        const Se = fd(
          W.nodes,
          W.edges,
          S,
          y?.connectFromNodeId,
          ne.id
        );
        if (se = W.edges.filter(
          (ct) => !Se.has(ct.from) && !Se.has(ct.to)
        ), U) {
          const ct = ud(
            U,
            ne.id
          );
          se = dn(se, ct.source, ct.target);
        } else y?.connectFromNodeId ? se = dn(
          se,
          y.connectFromNodeId || "",
          ne.id
        ) : y?.connectToNodeId && (se = dn(
          se,
          ne.id,
          y.connectToNodeId || ""
        ));
        const an = W.nodes.filter((ct) => !Se.has(ct.id)).map(
          (ct) => ct.id === ne.id ? Bi(ct, b) : ct
        );
        return {
          ...W,
          nodes: an,
          edges: Vt(an, se)
        };
      }
      if (U) {
        const Se = ud(U, b.id);
        se = dn(se, Se.source, Se.target);
      } else y?.connectFromNodeId ? se = dn(
        se,
        y.connectFromNodeId || "",
        b.id
      ) : y?.connectToNodeId && (se = dn(se, b.id, y.connectToNodeId || ""));
      const Pe = qi(
        [...W.nodes, b],
        b.id,
        { x: b.x, y: b.y }
      );
      return {
        ...W,
        nodes: Pe,
        edges: Vt(Pe, se)
      };
    }), A) {
      const W = Bi(A, b);
      xt((se) => {
        const ne = { ...se };
        for (const Pe of $)
          delete ne[Pe];
        return ne[A.id] = {
          ...ne[A.id] || {},
          ...WI(W)
        }, ne;
      });
    }
    return y?.selectCreated !== !1 && (Y([F]), po(F)), Ce("create"), ht(null), A ? Bi(A, b) : b;
  }
  function we(l, m) {
    if (!Q)
      return;
    if (Kc(H.nodes).has(l.id)) {
      L.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const y = KI(
      l,
      Q.id,
      H.nodes.length,
      m
    );
    He((b) => {
      const w = qi(
        [...b.nodes, y],
        y.id,
        { x: y.x, y: y.y }
      );
      return {
        ...b,
        nodes: w,
        edges: Vt(w, b.edges)
      };
    }), xt((b) => {
      const w = b[l.id];
      return w ? { ...b, [y.id]: w } : b;
    }), Y([y.id]), po(y.id), ht(null), L.success("已复制节点");
  }
  function ve(l, m = {}) {
    const y = Yl(
      H.nodes,
      l
    );
    if (y.size === 0)
      return;
    const b = Kc(H.nodes);
    if (!m.allowStoryboardFrame && [...y].some((w) => b.has(w))) {
      L.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    He((w) => {
      const S = Zm(
        w.nodes,
        y
      ).filter((A) => !y.has(A.id));
      return {
        ...w,
        nodes: S,
        edges: Vt(S, w.edges)
      };
    }), xt(
      (w) => nd(w, y)
    ), zt((w) => nd(w, y)), Y([]), kt(
      (w) => w && y.has(w.nodeId) ? null : w
    ), tn(
      (w) => w && y.has(w.id) ? null : w
    ), Hn(
      (w) => y.has(w) ? "" : w
    ), Be.current && y.has(Be.current.id) && (Be.current = null), L.success(
      l.length > 1 || y.size > 1 ? `已删除 ${y.size} 个节点` : "已删除节点"
    );
  }
  function ye(l, m) {
    q("asset", m, { asset: l });
  }
  function Fe(l, m, y) {
    if (!l)
      return;
    const b = H.nodes.find((S) => S.id === l) || (y?.id === l ? y : Be.current?.id === l ? Be.current : null);
    if (!b)
      return;
    const w = Ms(m.version?.content) || St(m.version?.content);
    it(
      l,
      On(
        {
          ...b,
          kind: m.kind || Q.kind,
          assetCateId: Number(m.asset_cate_id || Q.id || 0)
        },
        {
          output: w,
          asset: m
        },
        "引用资产"
      )
    ), mt(l, w);
  }
  async function mt(l, m) {
    if (!l)
      return;
    const y = H.edges.filter((b) => b.from === l).map((b) => H.nodes.find((w) => w.id === b.to)).filter(
      (b) => !!b && b.type === "function" && b.functionOption?.key === "display"
    );
    if (y.length !== 0)
      for (const b of y)
        it(
          b.id,
          On(b, { output: m }, "展示引用结果")
        );
  }
  function Jt(l, m = Jr, y = Be.current) {
    if (!m) {
      ye(l);
      return;
    }
    if (!(H.nodes.find((w) => w.id === m) || (y?.id === m ? y : Be.current?.id === m ? Be.current : null))) {
      ye(l), Hn(""), Be.current = null;
      return;
    }
    Fe(m, l, y);
  }
  async function tr(l, m = Jr, y = Be.current) {
    if (l.libraryType !== "material") {
      Jt(
        dr(l),
        m,
        y
      );
      return;
    }
    if (!ds(l)) {
      L.error("该素材没有可用内容，无法引用");
      return;
    }
    const b = Number(Q?.id || 0), w = m || `new-${Date.now()}`;
    try {
      const S = await Cc({
        projectId: r,
        canvasId: H.id,
        assetCateId: b,
        name: l.name || "素材库资产",
        kind: l.kind,
        content: l.version?.content,
        nodeKey: m,
        requestId: `official-material:${l.id}:${w}`
      }), A = dr(S);
      at(A), Jt(A, m, y);
    } catch (S) {
      L.error(
        S instanceof Error ? S.message : "引用素材库资产失败"
      );
    }
  }
  function Tr() {
    Gn(!1), Hn(""), Be.current = null;
  }
  function Mn(l, m) {
    Wc(), Qr({ nodeId: l, frameIndex: m }), ht(null), Ce("create");
  }
  async function Dn(l) {
    const m = wn;
    if (!m || Yn.current)
      return;
    const y = Ee.nodes.find(($) => $.id === m.nodeId);
    if (!y) {
      L.error("宫格节点不存在");
      return;
    }
    const b = l.filter(
      ($) => $.kind === "image" && ds($)
    ), w = Number.isInteger(m.frameIndex);
    if (w && b.length === 0) {
      L.error("请选择一张图片");
      return;
    }
    if (!w && b.length === 0) {
      L.error("请至少选择一张图片");
      return;
    }
    if (!w && b.length > cr) {
      L.error(`一次最多导入 ${cr} 张图片`);
      return;
    }
    const S = Ra([
      y.asset?.version?.content,
      y.resultOutput
    ]), A = w ? Zb(
      S,
      Number(m.frameIndex),
      b[0],
      y.title
    ) : Zl(
      b,
      S,
      y.title
    );
    if (!A) {
      L.error("当前宫格内容不可编辑");
      return;
    }
    Yn.current = !0;
    try {
      const $ = Number(y.asset?.id || 0), F = Number(
        y.asset?.version?.id || y.asset?.version_id || 0
      ), U = $ > 0 && F > 0 ? await ly({
        projectId: r,
        assetId: $,
        versionId: F,
        content: A
      }) : await Cc({
        projectId: r,
        canvasId: H.id,
        assetCateId: Number(y.assetCateId || Q?.id || 0),
        name: A.title || y.title || "宫格图片",
        kind: "collection",
        content: A,
        nodeKey: y.id,
        requestId: `storyboard-grid-import:${y.id}:${Date.now()}`
      }), W = Fn(
        U,
        y.asset
      );
      at(W), it(
        y.id,
        sa(y, W)
      ), L.success(w ? "宫格图片已替换" : "图片已导入宫格");
    } catch ($) {
      L.error($ instanceof Error ? $.message : "导入宫格图片失败");
    } finally {
      Yn.current = !1;
    }
  }
  function mi(l, m) {
    q("power", m, { power: l });
  }
  function gi(l = "") {
    uo(l);
  }
  async function Ar(l, m) {
    const y = await Ah({
      projectID: r,
      canvasID: H.id,
      teamID: Number(i?.project.team_id || 0),
      files: l,
      onProgress: m?.onProgress
    }), b = [];
    for (const w of y) {
      const S = dr(w.asset);
      S.id && at(S);
      const A = Yp(w.asset);
      A.id && b.push(A);
    }
    return b;
  }
  function yi(l, m) {
    q("agent", m, { role: l });
  }
  function hi(l, m) {
    q("flow", m, { flow: l });
  }
  function wi(l) {
    q("group", l);
  }
  function kf(l, m) {
    const y = q("function", m, { functionOption: l });
    l.key === "import" && (Be.current = y, gi(y?.id || ""));
  }
  function Tf(l, m, y) {
    M_(), Ce("create"), ht({
      x: l.x,
      y: l.y,
      position: m,
      connection: y
    }), Nn();
  }
  function Af() {
    Yr(en === "dark" ? "light" : "dark");
  }
  const Mf = gt((l) => {
    Y(l), ht(null);
  }), Df = gt(Tf), Pf = gt(q), Ef = gt(we), Ff = gt(ve), Of = gt(
    (l) => He((m) => ({ ...m, nodes: l }))
  ), zf = gt(
    (l) => He((m) => ({ ...m, edges: l }))
  ), Bf = gt(
    (l) => He((m) => m.nodes.length === 0 && m.edges.length === 0 ? m : { ...m, viewport: l })
  ), $f = gt(
    Mn
  );
  if (fe)
    return null;
  if (eo || !i || !Q)
    return /* @__PURE__ */ d("main", { className: `ws-page is-${en} ws-loading-screen`, children: /* @__PURE__ */ d("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ d("span", { children: eo || "创作空间不存在" }) }) });
  const {
    launcherVisible: jf,
    panelVisible: uc
  } = eb(i.assistant.available, ze);
  return /* @__PURE__ */ P(
    "main",
    {
      className: `ws-page is-${en} is-${de}-view ${uc ? "is-assistant-open" : ""} ${le ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${ke}px`
      },
      children: [
        /* @__PURE__ */ d(
          Hb,
          {
            activeCate: Q,
            mode: de,
            interactive: de === "create",
            canvasCount: co.length,
            activeCanvasName: H.name,
            canvasManagerOpen: oe,
            onOpenCanvasManager: Js,
            nodes: Ee.nodes,
            edges: Ee.edges,
            viewport: H.viewport,
            canvasId: H.id,
            selectedNodeId: te,
            selectedNodeIds: K,
            onSelectNodes: Mf,
            onOpenNodeMenu: Df,
            onAddConfiguredNode: Pf,
            onCopyNode: Ef,
            onDeleteNodes: Ff,
            onShowNodeDetail: xe,
            onNodesCommit: Of,
            onEdgesCommit: zf,
            onConnectedMediaEdgeRemove: os,
            onViewportCommit: Bf,
            focusNodeRequest: ut,
            onFocusNodeRequestConsumed: fi,
            projectId: r,
            space: i,
            canvasReferenceItems: ns,
            catalogCache: s,
            runningNodes: wr,
            setRunningNode: zt,
            onNodeResult: it,
            onNodeDraftChange: rs,
            onAssetCreated: at,
            onRunStoryboardFrame: si,
            onRunFunctionNode: ii,
            onRunBackendNode: is,
            onOpenStoryboardGridImport: $f,
            onClearFeedbackRecords: Zt,
            requestConfirm: Rr,
            onOpenFeedbackRecord: oi
          }
        ),
        /* @__PURE__ */ d(
          Ub,
          {
            space: i,
            cates: Yt,
            activeCate: Q,
            canvases: co,
            activeCanvas: H,
            saveStatus: Xo[String(H.id)] || "saved",
            hasAssetCates: Rn,
            loadingCateId: _,
            onBack: () => t({ to: "/bot/work" }),
            onSelectCate: as,
            onRefresh: Zn,
            onOpenRunHistory: () => {
              rn(!0), er(r, 0);
            },
            onRunHistoryIntent: F_,
            canStopRuns: k,
            stoppingRuns: Je || jt.size > 0,
            onStopRuns: T,
            theme: en,
            onToggleTheme: Af
          }
        ),
        oe ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ d(
              z_,
              {
                open: !0,
                canvases: co,
                deletedCanvases: z,
                deletedLoading: G,
                activeCanvasId: H.id,
                disabled: _ != null,
                onClose: () => B(!1),
                onSelect: fo,
                onCreate: ai,
                onRename: ci,
                onReorder: di,
                onDelete: ui,
                onRestore: li
              }
            )
          }
        ) : null,
        uc ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${ke}px`
                },
                children: /* @__PURE__ */ d(Le, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ d(
              j_,
              {
                assistant: i.assistant,
                project: i.project,
                team: i.team,
                activeAssetCateID: Q.id,
                activeCanvas: H,
                selectedNodes: ei,
                width: ke,
                expanded: le,
                onWidthChange: ni,
                onToggleExpanded: () => dt((l) => !l),
                onClose: () => es(!1),
                onFlushCanvas: Wt,
                onCanvasChanged: ti,
                onUploadAssets: Ar
              }
            )
          }
        ) : null,
        jf ? /* @__PURE__ */ d(
          Z_,
          {
            assistantName: i.assistant.name,
            onIntent: L_,
            onOpen: () => es(!0)
          }
        ) : null,
        nn ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ d(
              E_,
              {
                open: !0,
                runs: to,
                loading: Gt,
                error: Ho,
                page: Ht,
                hasNextPage: vr,
                onOpenChange: rn,
                onRefresh: () => er(r, 0),
                onPreviousPage: () => er(
                  r,
                  Math.max(0, Ht - 2)
                ),
                onNextPage: () => er(r, Ht),
                stoppingRunKeys: jt,
                onStopRun: O,
                onLocateRun: (l) => {
                  const m = String(l.start_node_id || "");
                  if (!m)
                    return;
                  rn(!1), (Number(l.canvas_id || 0) ? fo(Number(l.canvas_id)) : as(Number(l.asset_cate_id || h))).then((b) => {
                    b && window.requestAnimationFrame(() => po(m));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ d(
          Gb,
          {
            mode: de,
            onModeIntent: (l) => {
              l === "result" && P_();
            },
            onSelectMode: (l) => {
              Ce(l), ht(null);
            }
          }
        ),
        qn ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ d(
              Hc,
              {
                open: !0,
                teamID: i.project.team_id,
                scopeProjectID: i.project.id,
                title: "选择资产",
                description: "选择已有资产或上传本地文件，确认后引用到当前画布。",
                initialFilters: {
                  sourceType: "project",
                  projectID: i.project.id,
                  canvasID: H.id
                },
                confirmSelection: !0,
                contentMode: "full",
                validateAsset: (l) => ds(l) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: Ar,
                onClose: Tr,
                onConfirm: (l) => {
                  const m = l[0];
                  m && tr(m);
                }
              }
            )
          }
        ) : null,
        wn ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ d(
              Hc,
              {
                open: !0,
                teamID: i.project.team_id,
                scopeProjectID: i.project.id,
                title: Number.isInteger(wn.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(wn.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${Ge} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: i.project.id,
                  canvasID: H.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(wn.frameIndex),
                maxSelection: Ge,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (l) => l.kind !== "image" ? "请选择图片资产。" : ds(l) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: Ar,
                onClose: () => Qr(null),
                onConfirm: (l) => {
                  Dn(l);
                }
              }
            )
          }
        ) : null,
        de === "result" ? /* @__PURE__ */ d("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ d(je, { fallback: /* @__PURE__ */ d(Le, { label: "正在加载资产" }), children: /* @__PURE__ */ d(
          D_,
          {
            teamID: i.project.team_id,
            scopeProjectID: i.project.id,
            scopeCanvasID: H.id,
            onLocalUpload: Ar,
            initialFilters: {
              sourceType: "project",
              projectID: i.project.id,
              canvasID: H.id,
              assetCateID: Rn ? Q.id : 0
            },
            headerAction: /* @__PURE__ */ d(Ve, { label: "关闭资产", children: /* @__PURE__ */ P("button", { type: "button", onClick: () => Ce("create"), children: [
              /* @__PURE__ */ d(xd, { "aria-hidden": "true" }),
              /* @__PURE__ */ d("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        Re ? /* @__PURE__ */ d(
          SN,
          {
            prompt: Re.prompt,
            running: Wn,
            readonly: bh(
              Re,
              Ee.nodes,
              nt.current
            ),
            history: ur(
              Ee.nodes.find(
                (l) => l.id === Re.node.id
              ) || Re.node
            ),
            activeRecordId: Re.recordId,
            onSelectRecord: (l) => {
              const m = Ee.nodes.find(
                (y) => y.id === Re.node.id
              ) || Re.node;
              Tt({
                node: m,
                recordId: l.id,
                prompt: {
                  ...l.prompt,
                  values: l.values || l.prompt.values || {}
                }
              });
            },
            onClose: ri,
            onSubmit: At
          },
          `${Re.node.id}-${Re.recordId}`
        ) : null,
        qt ? /* @__PURE__ */ d(
          Wb,
          {
            request: qt,
            onClose: () => qe(null)
          }
        ) : null,
        Xe ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ d(
              A_,
              {
                menu: Xe,
                flows: Zo,
                powers: Qo,
                powerCategories: Yo,
                roles: Jo,
                onClose: () => ht(null),
                onSelectFlow: (l) => hi(l, Xe.position),
                onSelectFunction: (l) => kf(l, Xe.position),
                onSelectGroup: () => wi(Xe.position),
                onSelectRole: (l) => yi(l, Xe.position),
                onSelectPower: (l) => mi(l, Xe.position)
              }
            )
          }
        ) : null,
        Ae ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ d(
              K_,
              {
                projectId: i.project.id,
                teamId: i.team.id,
                assetCateId: Number(
                  Ae.assetCateId || Ae.asset?.asset_cate_id || Q?.id || 0
                ),
                node: Ae,
                storyboardFocus: hn,
                canvasNodes: Ee.nodes,
                lipSyncAvailable: Lt,
                connectedMediaReferences: bf(
                  Ee.nodes,
                  Ee.edges,
                  Ae.id
                ),
                canvasReferenceItems: ns.filter(
                  (l) => l.source !== "current" || l.id !== Ae.id
                ),
                onNodeDraftChange: (l) => {
                  l && (rs(Ae.id, l), tn(
                    (m) => m?.id === Ae.id ? { ...m, composerDraft: l } : m
                  ));
                },
                onConnectedMediaEdgeRemove: os,
                onRunNode: is,
                onAssetUpdated: (l) => {
                  const m = Fn(
                    l,
                    Ae.asset
                  );
                  at(m);
                  const y = sa(
                    Ae,
                    m
                  );
                  Ae.id.startsWith("asset-detail-") || it(Ae.id, y), tn(
                    (b) => b?.id === Ae.id ? {
                      ...b,
                      ...y
                    } : b
                  );
                },
                onClose: () => {
                  tn(null), wt(void 0);
                }
              }
            )
          }
        ) : null
      ]
    }
  );
}
function Ub({
  space: e,
  cates: t,
  activeCate: n,
  canvases: r,
  activeCanvas: o,
  saveStatus: s,
  hasAssetCates: i,
  loadingCateId: c,
  onBack: a,
  onSelectCate: f,
  onRefresh: u,
  onOpenRunHistory: h,
  onRunHistoryIntent: v,
  canStopRuns: N,
  stoppingRuns: _,
  onStopRuns: R,
  theme: E,
  onToggleTheme: K
}) {
  const Y = Math.max(
    0,
    t.findIndex((te) => te.id === n.id)
  );
  return /* @__PURE__ */ P("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ P("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: a,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ d(lp, { size: 18 })
        }
      ),
      /* @__PURE__ */ P("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ P("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ d("strong", { children: e.project.name }),
          r.length > 1 ? /* @__PURE__ */ P("span", { className: "ws-project-canvas-name", children: [
            /* @__PURE__ */ d("i", { children: "/" }),
            o.name || "第一幕"
          ] }) : null
        ] }),
        /* @__PURE__ */ d("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    i ? /* @__PURE__ */ P(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": Y
        },
        children: [
          /* @__PURE__ */ d("span", { className: "ws-cate-indicator" }),
          t.map((te) => /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: `ws-cate ${te.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                f(te.id);
              },
              children: [
                c === te.id ? /* @__PURE__ */ d(fn, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ d("span", { className: "ws-cate-name", children: te.name })
              ]
            },
            te.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ P("div", { className: `ws-top-actions ${N ? "has-running" : ""}`, children: [
      /* @__PURE__ */ d(Kb, { status: s }),
      N ? /* @__PURE__ */ d(Ve, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ P(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: _,
          onClick: R,
          children: [
            _ ? /* @__PURE__ */ d(fn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(fp, { size: 13, fill: "currentColor" }),
            _ ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ d(Ve, { label: "查看画布运行记录", children: /* @__PURE__ */ P(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: v,
          onFocus: v,
          onClick: h,
          children: [
            /* @__PURE__ */ d(pp, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ P("button", { type: "button", className: "ws-action", onClick: K, children: [
        E === "dark" ? /* @__PURE__ */ d(mp, { size: 15 }) : /* @__PURE__ */ d(gp, { size: 15 }),
        E === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ P("button", { type: "button", className: "ws-action", onClick: u, children: [
        /* @__PURE__ */ d(_a, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function Kb({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ d(Ve, { label: t, children: /* @__PURE__ */ P("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ d(fn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(kd, { size: 14 }),
    t
  ] }) });
}
const qb = [
  { key: "create", label: "创作", icon: yp },
  { key: "result", label: "资产", icon: hp }
];
function Gb({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ d("nav", { className: "ws-dock", "aria-label": "画布视角", children: qb.map((r) => {
    const o = r.icon;
    return /* @__PURE__ */ P(
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
const Hb = ha(function({
  activeCate: t,
  mode: n,
  interactive: r,
  canvasCount: o,
  activeCanvasName: s,
  canvasManagerOpen: i,
  onOpenCanvasManager: c,
  nodes: a,
  edges: f,
  viewport: u,
  canvasId: h,
  selectedNodeId: v,
  selectedNodeIds: N,
  onSelectNodes: _,
  onOpenNodeMenu: R,
  onAddConfiguredNode: E,
  onCopyNode: K,
  onDeleteNodes: Y,
  onShowNodeDetail: te,
  onNodesCommit: X,
  onEdgesCommit: ie,
  onConnectedMediaEdgeRemove: C,
  onViewportCommit: oe,
  focusNodeRequest: B,
  onFocusNodeRequestConsumed: z,
  projectId: j,
  space: G,
  canvasReferenceItems: ce,
  catalogCache: Ne,
  runningNodes: de,
  setRunningNode: Ce,
  onNodeResult: ze,
  onNodeDraftChange: me,
  onAssetCreated: le,
  onRunStoryboardFrame: dt,
  onRunFunctionNode: ke,
  onRunBackendNode: Rt,
  onOpenStoryboardGridImport: en,
  onClearFeedbackRecords: Yr,
  requestConfirm: Xe,
  onOpenFeedbackRecord: ht
}) {
  const [fe, Xr] = V(null), [Kn, wr] = V(""), [zt, Bt] = V(""), [Zr, xt] = V(""), [Ae, tn] = V(null), [hn, wt] = V(null), [qt, qe] = V(""), [ut, kt] = V(null), [qn, Gn] = V(() => /* @__PURE__ */ new Map()), [Jr, Hn] = V(!0), [wn, Qr] = V(!1), [eo, _r] = V(() => /* @__PURE__ */ new Set()), [lt, br] = V(1), to = re(1), _n = re(1), Gt = re(null), [Ir, Ho] = V(null), $t = ue(
    () => new Set(N),
    [N]
  ), nn = re(null), rn = re(null), Ht = re(!1), Nr = re(!1), vr = re(!1), bn = re(null), jt = re(!1), Ze = re(f);
  Vi(() => {
    Ze.current = f;
  }, [f]);
  const Je = M((p) => {
    const g = sr(p);
    to.current = g, Gt.current != null && typeof window < "u" && window.cancelAnimationFrame(Gt.current), Gt.current = null, _n.current = g, _d(nn.current, g), br(
      (k) => Math.abs(k - g) > 5e-3 ? g : k
    );
  }, []), no = M((p) => {
    const g = sr(p);
    if (to.current = g, !(Math.abs(_n.current - g) <= 5e-3) && Gt.current == null) {
      if (typeof window > "u") {
        _n.current = g, br(g);
        return;
      }
      Gt.current = window.requestAnimationFrame(() => {
        Gt.current = null;
        const k = to.current;
        _n.current = k, _d(nn.current, k);
      });
    }
  }, []);
  pe(
    () => () => {
      Gt.current != null && typeof window < "u" && window.cancelAnimationFrame(Gt.current);
    },
    []
  );
  const Re = M(
    (p, g = {}) => {
      const k = Ze.current;
      Ze.current = p, ie(p);
      const I = new Set(
        p.filter((J) => Qt(J) === "media").map((J) => {
          const ee = It(J);
          return `${ee.sourceNodeId}\0${ee.targetNodeId}`;
        })
      ), T = /* @__PURE__ */ new Map();
      for (const J of k) {
        if (Qt(J) !== "media")
          continue;
        const ee = It(J), q = `${ee.sourceNodeId}\0${ee.targetNodeId}`;
        if (I.has(q))
          continue;
        const we = T.get(ee.targetNodeId) || /* @__PURE__ */ new Set();
        we.add(ee.sourceNodeId), T.set(ee.targetNodeId, we);
      }
      const O = new Map(g.draftByNodeId);
      for (const [J, ee] of T) {
        const q = a.find((ye) => ye.id === J), we = q?.composerDraft;
        let ve = O.get(J) || we;
        if (!(!q || !ve)) {
          for (const ye of ee)
            ve = Ns(
              ve,
              ye
            );
          ve !== we ? O.set(q.id, ve) : O.delete(q.id);
        }
      }
      const Z = [...O].map(([J, ee]) => ({
        nodeId: J,
        draft: ee
      }));
      Z.forEach((J, ee) => {
        me(
          J.nodeId,
          J.draft,
          ee === Z.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, ie, me]
  ), Tt = M(
    (p) => {
      const g = Object.entries(p);
      if (g.length === 0)
        return;
      const k = new Map(g);
      let I = !1;
      const T = Ze.current.map((O) => {
        if (!k.has(O.id))
          return O;
        const Z = k.get(O.id) || void 0;
        return (O.mediaUsage || void 0) === Z ? O : (I = !0, { ...O, mediaUsage: Z });
      });
      I && Re(T);
    },
    [Re]
  ), Wn = M(
    (p) => {
      const g = Ze.current.filter((k) => k.id !== p);
      g.length !== Ze.current.length && (Ze.current = g, qe((k) => k === p ? "" : k), C(p));
    },
    [C]
  ), In = M(
    (p, g) => {
      const k = Ze.current, I = k.filter((Z) => {
        const J = It(Z);
        return !(Qt(Z) === "media" && J.sourceNodeId === p && J.targetNodeId === g);
      });
      if (I.length !== k.length) {
        qe(""), Re(I);
        return;
      }
      const T = a.find((Z) => Z.id === g);
      if (!T?.composerDraft)
        return;
      const O = Ns(
        T.composerDraft,
        p
      );
      O !== T.composerDraft && me(g, O, { save: "immediate" });
    },
    [Re, a, me]
  ), Be = M(
    (p, g) => {
      if (xt(""), !r)
        return;
      const k = jy(a, p, g);
      k !== a && X(k);
    },
    [r, a, X]
  ), Yn = M(
    (p, g) => {
      if (xt(""), !r)
        return;
      const k = Ly(a, p, g);
      k !== a && X(k);
    },
    [r, a, X]
  ), De = re({
    onNodeResult: ze,
    onNodeDraftChange: me,
    onAssetCreated: le,
    onRunFunctionNode: ke,
    onOpenStoryboardGridImport: en,
    onClearFeedbackRecords: Yr,
    onOpenFeedbackRecord: ht,
    onShowNodeDetail: te,
    requestConfirm: Xe,
    onRunBackendNode: Rt,
    onConnectedMediaUsagesChange: Tt,
    onConnectedMediaEdgeRemove: Wn,
    onTextParamConnectionRemove: In,
    onNodeResizeStart: xt,
    onNodeResizeEnd: Be,
    onResultViewResizeEnd: Yn
  });
  Vi(() => {
    De.current = {
      onNodeResult: ze,
      onNodeDraftChange: me,
      onAssetCreated: le,
      onRunFunctionNode: ke,
      onOpenStoryboardGridImport: en,
      onClearFeedbackRecords: Yr,
      onOpenFeedbackRecord: ht,
      onShowNodeDetail: te,
      requestConfirm: Xe,
      onRunBackendNode: Rt,
      onConnectedMediaUsagesChange: Tt,
      onConnectedMediaEdgeRemove: Wn,
      onTextParamConnectionRemove: In,
      onNodeResizeStart: xt,
      onNodeResizeEnd: Be,
      onResultViewResizeEnd: Yn
    };
  }, [
    le,
    Yr,
    me,
    ze,
    ht,
    en,
    Rt,
    ke,
    te,
    Wn,
    In,
    Xe,
    Be,
    Yn,
    Tt
  ]);
  const Sr = ue(
    () => ({
      onNodeResult: (p, g) => De.current.onNodeResult(p, g),
      onNodeDraftChange: (p, g, k) => De.current.onNodeDraftChange(p, g, k),
      onAssetCreated: (p) => De.current.onAssetCreated(p),
      onRunFunctionNode: (p) => De.current.onRunFunctionNode(p),
      onOpenStoryboardGridImport: (p, g) => De.current.onOpenStoryboardGridImport(p, g),
      onClearFeedbackRecords: (p) => De.current.onClearFeedbackRecords(p),
      onOpenFeedbackRecord: (p, g) => De.current.onOpenFeedbackRecord(p, g),
      onShowNodeDetail: (p, g) => De.current.onShowNodeDetail(p, g),
      requestConfirm: (p) => De.current.requestConfirm(p),
      onRunBackendNode: (p, g) => De.current.onRunBackendNode(p, g),
      onConnectedMediaUsagesChange: (p) => De.current.onConnectedMediaUsagesChange(p),
      onConnectedMediaEdgeRemove: (p) => De.current.onConnectedMediaEdgeRemove(p),
      onTextParamConnectionRemove: (p, g) => De.current.onTextParamConnectionRemove(
        p,
        g
      ),
      onNodeResizeStart: (p) => De.current.onNodeResizeStart(p),
      onNodeResizeEnd: (p, g) => De.current.onNodeResizeEnd(p, g),
      onResultViewResizeEnd: (p, g) => De.current.onResultViewResizeEnd(p, g)
    }),
    []
  ), ge = ue(
    () => qI(a, f),
    [f, a]
  ), _t = ue(
    () => i_(
      a,
      (p) => ge.hasResultByNodeId.get(p.id) || !1
    ),
    [ge.hasResultByNodeId, a]
  ), ot = _t.frames, ft = ue(() => {
    const p = new Set(ot.map((g) => g.id));
    return new Set(
      [...eo].filter(
        (g) => p.has(g)
      )
    );
  }, [eo, ot]), Cr = ue(
    () => new Map(
      ot.map((p) => [
        p.id,
        bl(
          p,
          a,
          (g) => ge.hasResultByNodeId.get(g.id) || !1,
          ge.nodeById
        ).blockedReason
      ])
    ),
    [
      ge.hasResultByNodeId,
      ge.nodeById,
      a,
      ot
    ]
  ), Qe = ue(
    () => new Map(ot.map((p) => [p.id, p])),
    [ot]
  ), bt = _t.sourceNodeIds, ro = _t.sourceNodeIdByNodeId, nt = ue(() => {
    const p = /* @__PURE__ */ new Set();
    for (const g of ot)
      if (ft.has(g.id))
        for (const k of g.memberNodeIds)
          p.add(k);
    return p;
  }, [ft, ot]), Wo = M(
    (p) => {
      const g = Qe.get(p), k = nn.current?.getBoundingClientRect();
      if (!g || !fe || !k)
        return;
      const I = qc(
        g,
        ft.has(g.id)
      ), T = Math.max(1, k.width - 144), O = Math.max(1, k.height - 144), Z = Math.max(
        0.35,
        Math.min(
          0.9,
          T / I.width,
          O / I.height
        )
      );
      fe.setCenter?.(
        I.x + I.width / 2,
        I.y + I.height / 2,
        { zoom: Z, duration: 320 }
      ), Je(Z);
    },
    [
      ft,
      fe,
      Je,
      Qe
    ]
  ), $e = M(
    (p) => {
      const g = Qe.get(p);
      if (!g)
        return;
      const k = !ft.has(p);
      if (_r((I) => {
        const T = new Set(I);
        return T.has(p) ? T.delete(p) : T.add(p), T;
      }), k) {
        const I = new Set(g.memberNodeIds);
        _(
          N.filter((T) => !I.has(T))
        ), wr(""), qe(""), wt(null);
      }
    },
    [
      ft,
      _,
      N,
      Qe
    ]
  ), Yo = gt(dt), oo = gt(Wo), so = gt($e), Nn = ue(
    () => a.map((p) => p.id).join("\0"),
    [a]
  ), io = ue(
    () => new Set(
      Nn ? Nn.split("\0") : []
    ),
    [Nn]
  ), Xn = ue(
    () => Nn ? `${t.id}:${Nn}` : "",
    [t.id, Nn]
  ), Wt = ue(
    () => Xl(de),
    [de]
  ), on = ue(() => {
    const p = (I) => ge.hasResultByNodeId.get(I.id) || !1, g = a.filter((I) => !nt.has(I.id)).map((I) => {
      const T = { x: I.x, y: I.y }, O = $t.has(I.id), Z = O && N.length === 1 && ga(I), J = I.type === "power" ? Ln(I.power, I.kind, I.outputType).viewMode : "", ee = Z, q = ee ? G : null, we = ee || J === "storyboard" || J === "video_compose" ? ce : kb, ve = (J === "video_compose" || Z) && ge.incomingMediaReferencesByNodeId.get(I.id) || ed, ye = bt.has(I.id), Fe = ro.get(I.id) || "", mt = Fe && ge.nodeById.get(Fe) || null, Jt = !!(Fe && un(
        de[Ks(Fe)]
      )), tr = `ws-flow-node ws-flow-node-${I.type}`, Tr = de[I.id] || null, Mn = I.type === "group" && ge.groupMembersById.get(I.id) || Qc, Dn = I.type === "group" ? Fu({
        members: Mn,
        runningNodes: de,
        groupState: Tr,
        hasResult: p
      }) : null, mi = I.type === "function" && I.functionOption?.key === "start" ? Wt : !1, gi = ge.inputContextByNodeId.get(I.id) || null, Ar = ge.runBlockedReasonByNodeId.get(I.id) || "", yi = {
        ...I,
        sourceNode: I,
        projectId: j,
        canvasId: h,
        space: q,
        catalogCache: Ne,
        runningNode: Tr,
        groupMembers: Mn,
        groupRuntime: Dn,
        canvasHasRunningNode: mi,
        canvasReferenceItems: we,
        connectedMediaReferences: ve,
        interactive: r,
        structureLocked: ye,
        storyboardSourceNode: mt,
        storyboardFrameRunning: Jt,
        runBlockedReason: Ar,
        showNodeSettings: Z,
        setRunningNode: Ce,
        ...Sr,
        inputContext: gi
      }, hi = I.type === "group" ? 1 : I.groupId ? 3 : 2, wi = Rf(I);
      return {
        id: I.id,
        type: "workSpace",
        position: T,
        data: yi,
        selected: O,
        className: tr,
        draggable: r && !ye,
        deletable: !ye,
        zIndex: hi,
        ...hd(wi)
      };
    });
    return [...ot.map((I) => {
      const T = ft.has(I.id), O = qc(I, T), Z = !1, J = "", ee = Z, q = {
        type: "storyboardFrame",
        frameId: I.id,
        sourceNodeId: I.sourceNodeId,
        title: I.title,
        groupCount: I.groupCount,
        workNodeCount: I.workNodeCount,
        completedCount: I.completedCount,
        running: ee,
        runBlockedReason: J,
        runActionEnabled: Z,
        collapsed: T,
        onRun: () => {
          Yo(I.sourceNodeId);
        },
        onFocus: () => oo(I.id),
        onToggleCollapsed: () => so(I.id)
      }, we = $t.has(I.id);
      return {
        id: I.id,
        type: "storyboardFrame",
        position: { x: O.x, y: O.y },
        data: q,
        selected: we,
        className: "ws-flow-node ws-flow-node-storyboard-frame",
        zIndex: 0,
        draggable: r,
        selectable: r,
        connectable: !1,
        deletable: !1,
        focusable: r,
        dragHandle: ".ws-storyboard-frame-header",
        ...hd(O)
      };
    }), ...g];
  }, [
    ft,
    ge,
    nt,
    r,
    bt,
    a,
    h,
    j,
    de,
    N.length,
    $t,
    Ce,
    G,
    Ne,
    ce,
    Wt,
    oo,
    Yo,
    Sr,
    ot,
    Cr,
    ro,
    so
  ]), { flowNodes: ao, setFlowNodes: vn } = By(
    on,
    zt || Zr
  ), Xo = M(
    (p) => {
      r && (qe(""), Re(f.filter((g) => g.id !== p)));
    },
    [Re, f, r]
  ), pt = M(
    (p) => {
      !r || !f.some((g) => g.id === p) || Xe({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => Xo(p)
      });
    },
    [Xo, f, r, Xe]
  ), Sn = M(
    (p) => {
      if (!r || p.length === 0)
        return;
      const g = Yl(a, p);
      if (g.size === 0)
        return;
      if ([...g].some(
        (T) => bt.has(T)
      )) {
        L.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const k = p.length === 1 ? p[0] : null, I = p.some((T) => T.type === "group");
      Xe({
        title: k ? `删除「${k.title}」` : `删除 ${g.size} 个节点`,
        description: I ? "会同时删除组内节点，并移除与这些节点相连的连线。" : k ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          qe(""), Y(p);
        }
      });
    },
    [
      r,
      bt,
      a,
      Y,
      Xe
    ]
  ), Zn = M(
    (p, g = []) => {
      if (!r || p.length === 0)
        return;
      const k = new Set(
        p.flatMap((ee) => ee.memberNodeIds)
      ), I = /* @__PURE__ */ new Set([
        ...k,
        ...g.map((ee) => ee.id)
      ]), T = a.filter((ee) => I.has(ee.id));
      if (T.length === 0)
        return;
      const O = p.length === 1 && g.every((ee) => k.has(ee.id)) ? p[0] : null, Z = T.filter(
        (ee) => ee.type === "group"
      ).length, J = T.length - Z;
      Xe({
        title: O ? `删除「${O.title}」制作区` : `删除 ${T.length} 个节点`,
        description: O ? `将删除其中 ${Z} 个分组和 ${J} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          qe(""), Y(T, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, a, Y, Xe]
  ), Rr = ue(
    () => f.filter(
      (p) => io.has(p.from) && io.has(p.to) && !nt.has(p.from) && !nt.has(p.to)
    ).map((p) => {
      const g = It(p), k = ge.nodeById.get(
        g.sourceNodeId
      ), I = ge.nodeById.get(
        g.targetNodeId
      ), T = bi(
        I?.composerDraft,
        g.sourceNodeId,
        qn.get(g.targetNodeId)
      ), O = !!(Qt(p) === "media" && I?.type === "power" && I.power && (T || Mr(k))), Z = qn.get(
        g.targetNodeId
      ), J = O && I && Z ? Mi(
        I,
        Z,
        g.sourceNodeId
      ) : void 0, ee = us(I), q = O ? Um(
        T,
        J,
        ee
      ) : void 0;
      return {
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
          purpose: Qt(p),
          executionMode: p.executionMode,
          mediaUsage: p.mediaUsage,
          bindingLabel: q?.label,
          bindingInteractive: q?.interactive,
          bindingShowChevron: q?.showChevron,
          bindingInvalid: q?.invalid
        }
      };
    }),
    [
      qn,
      io,
      ge.nodeById,
      f,
      nt
    ]
  );
  pe(() => {
    if (!fe || !Xn || B || u.zoom != null || typeof window > "u")
      return;
    const p = setTimeout(() => {
      fe.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(p);
  }, [Xn, fe, B, u.zoom]), pe(() => {
    if (!fe || !B || typeof window > "u")
      return;
    const p = a.find((I) => I.id === B.nodeId);
    if (!p) {
      z(B);
      return;
    }
    const g = ot.find(
      (I) => ft.has(I.id) && I.memberNodeIds.includes(p.id)
    );
    if (g) {
      const I = window.setTimeout(() => {
        _r((T) => {
          const O = new Set(T);
          return O.delete(g.id), O;
        });
      }, 0);
      return () => window.clearTimeout(I);
    }
    const k = window.setTimeout(() => {
      const I = { x: p.x, y: p.y }, T = p.type === "power" ? 1.02 : 0.96;
      fe.setCenter?.(
        I.x + (p.width || 180) / 2,
        I.y + (p.height || 180) / 2,
        { zoom: T, duration: 320 }
      ), Je(T), z(B);
    }, 80);
    return () => window.clearTimeout(k);
  }, [
    ft,
    fe,
    Je,
    B,
    a,
    z,
    ot
  ]);
  const Cn = M(
    (p) => {
      if (!r)
        return;
      const g = p.map((T) => {
        if (T.type !== "position" || !T.position)
          return T;
        const O = _i(
          a,
          T.id,
          T.position
        );
        return O === T.position ? T : {
          ...T,
          position: O,
          ...T.positionAbsolute ? { positionAbsolute: O } : {}
        };
      });
      vn((T) => Wf(g, T));
      const k = new Set(N);
      let I = !1;
      for (const T of p)
        T.type === "select" && (I = !0, T.selected ? (k.delete(T.id), k.add(T.id)) : k.delete(T.id));
      I && _([...k]);
    },
    [r, a, _, N, vn]
  ), Yt = M(
    (p) => {
      const g = Number(p.composerDraft?.selectedTargetId || 0), k = Number(
        G.release?.id || G.project.release_id || 0
      );
      return Ne.loadPowerForm(
        {
          projectId: j,
          releaseId: k,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        },
        () => ry({
          projectId: j,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        })
      );
    },
    [Ne, j, G.project.release_id, G.release?.id]
  ), Rn = ue(() => {
    const p = new Set(
      f.flatMap((g) => {
        if (Qt(g) !== "media")
          return [];
        const k = It(g), I = ge.nodeById.get(
          k.sourceNodeId
        ), T = ge.nodeById.get(
          k.targetNodeId
        );
        return T?.type === "power" && T.power && Mr(I) ? [T.id] : [];
      })
    );
    for (const g of a)
      g.type === "power" && g.power && (Object.keys(g.composerDraft?.paramBindings || {}).length > 0 || g.composerDraft?.storyboardLyricsSourceNodeId) && p.add(g.id);
    return a.filter((g) => p.has(g.id));
  }, [ge.nodeById, f, a]);
  pe(() => {
    if (Rn.length === 0)
      return;
    let p = !1;
    return Promise.all(
      Rn.map(
        async (g) => {
          try {
            const k = await Yt(g);
            return [g.id, k.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((g) => {
      p || Gn(
        new Map(
          g.filter(
            (k) => !!k
          )
        )
      );
    }), () => {
      p = !0;
    };
  }, [Yt, Rn]);
  const Q = M(
    (p, g, k) => {
      const I = a.some((J) => J.id === p), T = a.find((J) => J.id === g);
      if (!I || !T) {
        L.info("节点已变化，请重新连接");
        return;
      }
      const O = pr(T);
      if (!Lm(
        O,
        k,
        p
      )) {
        L.info("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const Z = Wm(
        O,
        p,
        k
      );
      Re(
        Vt(
          a,
          dn(Ze.current, p, g)
        ),
        Z !== O ? { draftByNodeId: /* @__PURE__ */ new Map([[T.id, Z]]) } : void 0
      );
    },
    [Re, a]
  ), Zo = M(
    (p, g) => {
      const k = a.find((ee) => ee.id === p), I = a.find((ee) => ee.id === g);
      if (!I || !Mr(k) || !us(I)) {
        L.info("节点已变化，请重新连接");
        return;
      }
      const T = pr(I), O = String(
        T.storyboardLyricsSourceNodeId || ""
      ).trim(), Z = Xm(
        T,
        p
      ), J = Ze.current.filter((ee) => {
        if (!O || O === p || Qt(ee) !== "media")
          return !0;
        const q = It(ee);
        return !(q.sourceNodeId === O && q.targetNodeId === g);
      });
      J.length !== Ze.current.length && qe(""), Re(
        Vt(
          a,
          dn(J, p, g)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[I.id, Z]]) }
      );
    },
    [Re, a]
  );
  pe(() => {
    for (const p of Rn) {
      const g = qn.get(p.id);
      if (!g)
        continue;
      const k = f.flatMap((T) => {
        if (Qt(T) !== "media")
          return [];
        const O = It(T);
        if (O.targetNodeId !== p.id)
          return [];
        const Z = ge.nodeById.get(
          O.sourceNodeId
        );
        return p.composerDraft?.storyboardLyricsSourceNodeId === O.sourceNodeId ? [] : Mr(Z) ? [O.sourceNodeId] : [];
      }), I = Km(
        k,
        p.composerDraft,
        ef(p, g)
      );
      I && Q(
        I.sourceNodeId,
        p.id,
        I.targetParamKey
      );
    }
  }, [
    qn,
    ge.nodeById,
    Q,
    f,
    Rn
  ]);
  const Jo = M(
    async (p) => {
      if (!r)
        return;
      const g = Ze.current.find(
        (J) => J.id === p
      );
      if (!g)
        return;
      const { sourceNodeId: k, targetNodeId: I } = It(g), T = a.find((J) => J.id === k), O = a.find((J) => J.id === I), Z = bi(
        O?.composerDraft,
        k
      );
      if (!(O?.type !== "power" || !O.power || !Z && !Mr(T)))
        try {
          const J = await Yt(O), ee = Mi(
            O,
            J.params || [],
            k
          ), q = bi(
            O.composerDraft,
            k,
            J.params || []
          ), we = us(O);
          if (Gn((ye) => {
            const Fe = new Map(ye);
            return Fe.set(I, J.params || []), Fe;
          }), qe(p), we) {
            kt({
              sourceNodeId: k,
              targetNodeId: I,
              sourceTitle: T?.title || "上游节点",
              targetTitle: O.title || O.power.name,
              params: ee,
              selectedParamKey: q?.purpose === "param" ? q.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: q?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const ve = Gi(ee);
          if (ve.kind === "unavailable") {
            L.info("当前能力没有可用的文本参数");
            return;
          }
          if (ve.kind === "automatic") {
            q?.targetParamKey !== ve.targetParamKey && Q(
              k,
              I,
              ve.targetParamKey
            );
            return;
          }
          kt({
            sourceNodeId: k,
            targetNodeId: I,
            sourceTitle: T?.title || "上游节点",
            targetTitle: O.title || O.power.name,
            params: ve.params,
            selectedParamKey: q?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (J) {
          L.error(
            J instanceof Error ? J.message : "参数列表加载失败"
          );
        }
    },
    [Q, r, Yt, a]
  ), Qo = M(
    (p) => {
      Jo(p);
    },
    [Jo]
  ), Lt = ue(() => {
    const p = ge.highlightedPathEdgesByNodeId.get(v) || td, g = ge.highlightedPathEdgesByNodeId.get(Kn) || td, k = /* @__PURE__ */ new Set([
      ...p,
      ...g
    ]), I = p.size > 0 ? v : g.size > 0 ? Kn : "";
    return Rr.map((T) => {
      const O = oN(
        T,
        ge.nodeById,
        Kn,
        v,
        qt,
        k,
        I
      ), Z = sN(T, O);
      return {
        ...Z,
        data: {
          ...Z.data,
          onDelete: pt,
          onEditBinding: Qo
        }
      };
    });
  }, [
    Rr,
    ge,
    Kn,
    pt,
    Qo,
    qt,
    v
  ]), H = ue(
    () => Ae ? [...Lt, Ae] : Lt,
    [Lt, Ae]
  ), co = M(
    (p) => {
      if (!r)
        return;
      let g = "", k = !1;
      for (const O of p)
        O.type === "select" && (k = !0, O.selected && (g = O.id));
      k && qe(g);
      const I = p.filter(
        (O) => O.type !== "select"
      );
      if (I.length === 0)
        return;
      const T = Yf(I, Lt);
      Re(YI(T));
    },
    [Re, Lt, r]
  ), xn = M(
    async (p, g) => {
      if (Ze.current.some((q) => {
        const we = It(q);
        return we.sourceNodeId === p && we.targetNodeId === g;
      }))
        return;
      const I = a.find((q) => q.id === g), T = a.find((q) => q.id === p), Z = ru(a, p).filter(Ta);
      let J, ee;
      if (I?.type === "power" && I.power && Z.length > 0)
        try {
          const we = (await Yt(I)).params || [], ve = pr(I), ye = bf(
            a,
            Ze.current,
            g
          ), Fe = Jd(
            we,
            ve
          ), mt = fm(
            we,
            Fe,
            [
              ...ye.map((Dn) => Dn.source),
              ...Z
            ]
          ), Jt = pm({
            node: I,
            content: ve.promptContent,
            items: ce,
            connections: ye,
            params: we,
            values: mt,
            requestedMode: ve.multiImageMode,
            additionalSources: Z
          }), tr = Jt.active ? Jt.mode : void 0;
          if (Jt.error) {
            L.error(Jt.error);
            return;
          }
          const Tr = mm(
            Qd(we, mt)
          ), Mn = gm(
            ye,
            Tr,
            Z,
            ve.promptContent,
            ce,
            tr
          );
          if (Mn.error) {
            L.error(Mn.error);
            return;
          }
          if (J = Mn.usage, Jt.active && tr) {
            const Dn = za({
              ...ve,
              paramValues: mt,
              multiImageMode: tr
            });
            vc(Dn) !== vc(ve) && (ee = Dn);
          }
        } catch (q) {
          L.error(
            q instanceof Error ? `媒体用途加载失败，未建立连线：${q.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      else if (I?.type === "power" && I.power && Mr(T))
        try {
          const q = await Yt(I), we = Mi(
            I,
            q.params || [],
            p
          ), ve = us(I);
          if (Gn((Fe) => {
            const mt = new Map(Fe);
            return mt.set(g, q.params || []), mt;
          }), ve) {
            kt({
              sourceNodeId: p,
              targetNodeId: g,
              sourceTitle: T?.title || "上游节点",
              targetTitle: I.title || I.power.name,
              params: we,
              lyricsAvailable: !0,
              lyricsSelected: !1,
              editing: !1
            });
            return;
          }
          const ye = Gi(we);
          if (ye.kind === "unavailable") {
            L.info("当前能力没有可用的文本参数，未建立连线");
            return;
          }
          if (ye.kind === "automatic") {
            Q(
              p,
              g,
              ye.targetParamKey
            );
            return;
          }
          kt({
            sourceNodeId: p,
            targetNodeId: g,
            sourceTitle: T?.title || "上游节点",
            targetTitle: I.title || I.power.name,
            params: ye.params,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !1
          });
          return;
        } catch (q) {
          L.error(
            q instanceof Error ? `参数列表加载失败，未建立连线：${q.message}` : "参数列表加载失败，未建立连线"
          );
          return;
        }
      I && ee && me(I.id, ee), Re(
        Vt(
          a,
          dn(
            Ze.current,
            p,
            g,
            J
          )
        )
      );
    },
    [
      ce,
      Q,
      Re,
      Yt,
      a,
      me
    ]
  ), Js = M(
    (p) => {
      const g = ut;
      g && (kt(null), Q(
        g.sourceNodeId,
        g.targetNodeId,
        p
      ));
    },
    [Q, ut]
  ), Qs = M(() => {
    const p = ut;
    p?.lyricsAvailable && (kt(null), Zo(
      p.sourceNodeId,
      p.targetNodeId
    ));
  }, [Zo, ut]), Ee = M(() => {
    kt(null);
  }, []), ei = M(
    (p) => {
      r && (Ht.current = !0, !(!p.source || !p.target || p.source === p.target) && xn(
        p.source || "",
        p.target || ""
      ));
    },
    [xn, r]
  ), ti = M(
    (p, g) => {
      if (!r)
        return;
      const k = String(g?.nodeId || "");
      k && (vr.current = !0, _([]), wt(null)), rn.current = k ? {
        nodeId: k,
        handleId: g?.handleId || null,
        handleType: g?.handleType || null
      } : null, Ht.current = !1, qe("");
    },
    [r, _]
  ), ni = M(
    (p) => {
      if (!r) {
        rn.current = null, Ht.current = !1;
        return;
      }
      const g = rn.current;
      if (rn.current = null, g?.nodeId && typeof window < "u" && window.setTimeout(() => {
        vr.current = !1;
      }, 0), Ht.current) {
        Ht.current = !1;
        return;
      }
      if (!g?.nodeId)
        return;
      const k = cN(p);
      k && (Nr.current = !0, R(
        k,
        wo(fe, k),
        g
      ));
    },
    [fe, r, R]
  ), es = M(
    (p, g) => {
      r && (p.preventDefault(), p.stopPropagation(), wt(null), _([]), qe(g.id));
    },
    [r, _]
  );
  pe(() => {
    if (!qt || typeof window > "u")
      return;
    function p(g) {
      !r || !gd(g) || (g.preventDefault(), pt(qt));
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [r, pt, qt]), pe(() => {
    if (N.length === 0 || qt || typeof window > "u")
      return;
    function p(g) {
      if (!r || !gd(g))
        return;
      const k = a.filter(
        (T) => $t.has(T.id)
      ), I = N.map((T) => Qe.get(T)).filter((T) => !!T);
      if (!(k.length === 0 && I.length === 0)) {
        if (g.preventDefault(), I.length > 0) {
          Zn(I, k);
          return;
        }
        Sn(k);
      }
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [
    r,
    a,
    Sn,
    Zn,
    qt,
    N.length,
    N,
    $t,
    Qe
  ]);
  const Ge = M((p) => {
    tn(
      (g) => nN(g, p) ? g : p
    );
  }, []), ts = M(
    (p) => {
      if (!r)
        return !1;
      const g = a.find(
        (I) => I.id === p.source
      ), k = a.find(
        (I) => I.id === p.target
      );
      return fa(g, k);
    },
    [r, a]
  ), ns = M(
    (p, g) => {
      if (!r)
        return;
      const k = Qe.get(g.id);
      if (k) {
        const q = Il(
          k,
          g.position
        ), we = new Set(k.memberNodeIds);
        vn(
          (ve) => ve.map((ye) => {
            if (!we.has(ye.id))
              return ye;
            const Fe = a.find((mt) => mt.id === ye.id);
            return Fe ? {
              ...ye,
              position: {
                x: Fe.x + q.x,
                y: Fe.y + q.y
              }
            } : ye;
          })
        ), Ge(null);
        return;
      }
      if (bt.has(g.id)) {
        Ge(null);
        return;
      }
      const I = a.find((q) => q.id === g.id);
      if (!I) {
        Ge(null);
        return;
      }
      const T = _i(
        a,
        g.id,
        g.position
      ), O = T === g.position ? g : { ...g, position: T };
      if (I.type === "group") {
        const q = g.position.x - I.x, we = g.position.y - I.y;
        vn(
          (ve) => ve.map((ye) => {
            const Fe = a.find((mt) => mt.id === ye.id);
            return Fe?.groupId !== I.id ? ye : {
              ...ye,
              position: {
                x: Fe.x + q,
                y: Fe.y + we
              }
            };
          })
        ), Ge(null);
        return;
      }
      if (Lt.some(
        (q) => q.source === g.id || q.target === g.id
      )) {
        Ge(null);
        return;
      }
      const J = rN(
        O,
        ao,
        a
      );
      if (!J) {
        Ge(null);
        return;
      }
      const ee = eN(
        I,
        J.domainNode
      );
      if (!ee) {
        Ge(null);
        return;
      }
      Ge(tN(ee));
    },
    [
      Lt,
      ao,
      r,
      bt,
      a,
      vn,
      Qe,
      Ge
    ]
  ), uo = M(
    (p, g) => {
      if (!r) {
        Bt(""), Ge(null);
        return;
      }
      const k = Qe.get(g.id);
      if (k) {
        const Z = d_(
          a,
          k,
          g.position
        );
        Z !== a && X(Z), Bt(""), Ge(null);
        return;
      }
      if (bt.has(g.id)) {
        Bt(""), Ge(null);
        return;
      }
      const I = a.find((Z) => Z.id === g.id);
      let T = !1;
      if (I) {
        const Z = _i(
          a,
          g.id,
          g.position
        ), J = wm(a, g.id, Z), ee = qi(
          J,
          g.id,
          Z
        );
        T = (I.groupId || "") !== (ee.find((we) => we.id === I.id)?.groupId || ""), ee !== a && X(ee);
        const q = Vt(ee, f);
        vf(f, q) || Re(q);
      }
      if (Bt(""), T) {
        Ge(null);
        return;
      }
      if (!Ae) {
        Ge(null);
        return;
      }
      Lt.some(
        (Z) => Z.source === Ae.source && Z.target === Ae.target
      ) || xn(
        Ae.source,
        Ae.target
      ), Ge(null);
    },
    [
      f,
      xn,
      Re,
      Lt,
      r,
      bt,
      X,
      a,
      Ae,
      Qe,
      Ge
    ]
  ), sn = M(
    (p) => {
      !r || p.button !== 2 || (jt.current = !1, Mb(p.target) && (bn.current = {
        pointerId: p.pointerId,
        start: { x: p.clientX, y: p.clientY },
        baseNodeIds: p.ctrlKey || p.metaKey ? [...N] : [],
        moved: !1,
        contextMenuHandled: !1
      }, p.preventDefault(), p.stopPropagation(), p.currentTarget.setPointerCapture?.(p.pointerId)));
    },
    [r, N]
  ), He = M(
    (p) => {
      R(p, wo(fe, p));
    },
    [fe, R]
  ), lo = M(
    (p) => {
      const g = bn.current;
      !r || !g && !jt.current || (p.preventDefault(), p.stopPropagation(), jt.current = !1, g && (g.contextMenuHandled = !0));
    },
    [r]
  ), it = M(
    (p) => {
      const g = bn.current;
      if (!g || g.pointerId !== p.pointerId || !fe || !nn.current)
        return;
      const k = p.clientX - g.start.x, I = p.clientY - g.start.y;
      if (!g.moved && Math.hypot(k, I) < 5)
        return;
      g.moved = !0, p.preventDefault(), p.stopPropagation();
      const T = nn.current.getBoundingClientRect();
      Ho(
        Db(
          g.start,
          {
            x: p.clientX,
            y: p.clientY
          },
          T
        )
      );
      const O = Pb(
        a,
        wo(fe, g.start),
        wo(fe, {
          x: p.clientX,
          y: p.clientY
        })
      );
      _(Eb(g.baseNodeIds, O)), qe(""), wt(null);
    },
    [fe, a, _]
  ), xr = M(
    (p) => {
      const g = bn.current;
      !g || g.pointerId !== p.pointerId || (bn.current = null, p.currentTarget.hasPointerCapture?.(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId), Ho(null), jt.current = !g.contextMenuHandled, p.preventDefault(), p.stopPropagation(), !g.moved && p.type === "pointerup" && He({
        x: p.clientX,
        y: p.clientY
      }));
    },
    [He]
  ), kn = M(
    (p) => {
      if (r) {
        if (Nr.current) {
          Nr.current = !1;
          return;
        }
        _([]), qe(""), wt(null), !(!("detail" in p) || p.detail !== 2) && (p.preventDefault(), p.stopPropagation(), He({ x: p.clientX, y: p.clientY }));
      }
    },
    [r, _, He]
  ), rs = M(
    (p) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), jt.current) {
          jt.current = !1;
          return;
        }
        He({ x: p.clientX, y: p.clientY });
      }
    },
    [r, He]
  ), os = M(
    (p, g) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), Qe.has(g.id)) {
          qe(""), $t.has(g.id) || _([g.id]), wt({
            nodeId: g.id,
            x: p.clientX,
            y: p.clientY
          });
          return;
        }
        qe(""), $t.has(g.id) || _([g.id]), wt({
          nodeId: g.id,
          x: p.clientX,
          y: p.clientY
        });
      }
    },
    [r, _, $t, Qe]
  ), xe = hn && a.find((p) => p.id === hn.nodeId) || null, Xt = hn && Qe.get(hn.nodeId) || null, Zt = !!(xe && bt.has(xe.id)), at = xe && a.find(
    (p) => p.id === a_(a, xe)
  ) || null, Jn = xe ? { x: xe.x, y: xe.y } : void 0;
  function At() {
    wt(null);
  }
  function ri() {
    if (!(!r || !xe)) {
      if (Zt) {
        L.info("脚本托管节点不能复制，请在分镜脚本中修改结构"), At();
        return;
      }
      K(
        xe,
        Jn ? { x: Jn.x + 34, y: Jn.y + 34 } : void 0
      ), At();
    }
  }
  function oi() {
    if (!r || !xe && !Xt)
      return;
    if (Xt) {
      const g = Xt;
      At(), Zn([g]);
      return;
    }
    if (!xe)
      return;
    if (Zt) {
      L.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"), At();
      return;
    }
    const p = xe;
    At(), Sn([p]);
  }
  function Tn() {
    xe && (te(xe), At());
  }
  function An() {
    at && (te(
      at,
      hl(xe)
    ), At());
  }
  function ss() {
    if (!xe)
      return;
    const p = $w(xe, a);
    if (!p) {
      At();
      return;
    }
    me(xe.id, p), L.success("已恢复脚本生成的提示词"), At();
  }
  const si = M(
    (p) => {
      r && (p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "move"));
    },
    [r]
  ), is = M(
    (p) => {
      if (!r || (p.preventDefault(), !fe || !E)) return;
      const g = p.dataTransfer.getData(
        "application/shemic-nodetype"
      );
      if (!g) return;
      const k = p.dataTransfer.getData("application/shemic-detail"), I = k ? JSON.parse(k) : void 0, T = fe.screenToFlowPosition ? fe.screenToFlowPosition({
        x: p.clientX,
        y: p.clientY
      }) : wo(fe, {
        x: p.clientX,
        y: p.clientY
      });
      g === "asset" && I ? E("asset", T, { asset: I }) : g === "power" && I ? E("power", T, { power: I }) : g === "agent" && I ? E("agent", T, { role: I }) : g === "flow" && I ? E("flow", T, { flow: I }) : g === "function" && I ? E("function", T, { functionOption: I }) : E(g, T);
    },
    [fe, r, E]
  ), ii = M(() => {
    fe?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [fe]), kr = M(
    (p) => {
      const g = sr(p);
      Je(g), fe?.zoomTo?.(g, { duration: 120 });
    },
    [fe, Je]
  ), Qn = M(() => {
    const p = sr(lt + 0.12);
    Je(p), fe?.zoomIn?.({ duration: 140 });
  }, [fe, Je, lt]), fo = M(() => {
    const p = sr(lt - 0.12);
    Je(p), fe?.zoomOut?.({ duration: 140 });
  }, [fe, Je, lt]), as = M(() => {
    if (r) {
      if (vr.current) {
        vr.current = !1;
        return;
      }
      qe(""), wt(null);
    }
  }, [r]), ai = M(
    (p, g) => {
      r && Bt(g.id);
    },
    [r]
  ), ci = M((p, g) => {
    wr(g.id);
    const k = g.type === "workSpace" ? g.data.sourceNode : null;
    k && ga(k) && G_();
  }, []), di = M(() => {
    wr("");
  }, []), ui = M(
    (p) => {
      const g = p;
      Xr(g), u.x != null && u.y != null && u.zoom != null ? (g.setViewport?.({
        x: u.x,
        y: u.y,
        zoom: u.zoom
      }), Je(u.zoom)) : Je(g.getZoom?.() || 1);
    },
    [Je, u.x, u.y, u.zoom]
  ), li = M(
    (p, g) => {
      no(g.zoom);
    },
    [no]
  ), po = M(
    (p, g) => {
      Je(g.zoom), oe({
        x: g.x,
        y: g.y,
        zoom: g.zoom
      });
    },
    [Je, oe]
  ), fi = M(() => {
    Hn((p) => !p);
  }, []), pi = M(() => {
    Qr((p) => !p);
  }, []), er = [
    "ws-canvas-wrap",
    zt ? "is-dragging" : "",
    Ir ? "is-selecting" : "",
    Zr ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ P(
    "section",
    {
      ref: nn,
      className: er,
      style: xN(lt),
      onPointerDownCapture: sn,
      onPointerMoveCapture: it,
      onPointerUpCapture: xr,
      onPointerCancelCapture: xr,
      onContextMenuCapture: lo,
      children: [
        /* @__PURE__ */ d(
          Xf,
          {
            nodes: ao,
            edges: H,
            onlyRenderVisibleElements: !0,
            nodeTypes: Fb,
            edgeTypes: Ob,
            onNodesChange: Cn,
            onEdgesChange: co,
            onConnect: ei,
            onConnectStart: ti,
            onConnectEnd: ni,
            isValidConnection: ts,
            connectionLineStyle: zb,
            onEdgeClick: es,
            onNodeClick: as,
            onNodeContextMenu: os,
            onNodeDragStart: ai,
            onNodeDrag: ns,
            onNodeDragStop: uo,
            onDragOver: si,
            onDrop: is,
            onNodeMouseEnter: ci,
            onNodeMouseLeave: di,
            onInit: ui,
            onMove: li,
            onMoveEnd: po,
            onPaneClick: kn,
            onPaneContextMenu: rs,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: $b,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: wn,
            snapGrid: Bb,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: jb,
            fitView: u.zoom == null,
            fitViewOptions: Lb,
            children: r && Jr && a.length > 0 ? /* @__PURE__ */ d(
              Zf,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeClassName: zN,
                nodeColor: BN
              }
            ) : null
          }
        ),
        Ir ? /* @__PURE__ */ d(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: Ir,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ d(
          Fy,
          {
            canvasCount: o,
            activeCanvasName: s,
            canvasManagerOpen: i,
            showViewTools: r,
            showMiniMap: Jr,
            snapToGrid: wn,
            zoom: lt,
            onOpenCanvasManager: c,
            onToggleMiniMap: fi,
            onToggleSnap: pi,
            onReset: ii,
            onZoomIn: Qn,
            onZoomOut: fo,
            onZoomChange: kr
          }
        ),
        r && a.length === 0 ? /* @__PURE__ */ P("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ P("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ d(Nd, { size: 16 }),
            /* @__PURE__ */ d("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ d("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && hn && (xe || Xt) ? /* @__PURE__ */ d(
          Ey,
          {
            point: hn,
            canShowDetail: !!(xe && Ut(xe)),
            canCopy: !!(xe && !Zt),
            canDelete: !!(Xt || !Zt),
            canEditStructure: !!(at && at.id !== xe?.id),
            canResetStoryboardPrompt: !!(xe && tl(xe)),
            onClose: At,
            onCopy: ri,
            onDelete: oi,
            onDetail: Tn,
            onEditStructure: An,
            onResetStoryboardPrompt: ss
          }
        ) : null,
        ut ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ d(
              $_,
              {
                sourceTitle: ut.sourceTitle,
                targetTitle: ut.targetTitle,
                params: ut.params,
                selectedParamKey: ut.selectedParamKey,
                lyricsAvailable: ut.lyricsAvailable,
                lyricsSelected: ut.lyricsSelected,
                editing: ut.editing,
                onClose: Ee,
                onSelect: Js,
                onSelectLyrics: Qs
              }
            )
          }
        ) : null
      ]
    }
  );
});
function Wb({
  request: e,
  onClose: t
}) {
  const [n, r] = V(!1);
  async function o() {
    if (n)
      return;
    r(!0);
    const s = e.onConfirm;
    t();
    try {
      Promise.resolve(s()).catch((i) => {
        L.error(i instanceof Error ? i.message : "操作失败");
      });
    } catch (i) {
      L.error(i instanceof Error ? i.message : "操作失败");
    }
  }
  return /* @__PURE__ */ d(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ P(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ P("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ d("h3", { children: e.title }),
              /* @__PURE__ */ d("p", { children: e.description })
            ] }),
            /* @__PURE__ */ P("div", { className: "ws-confirm-actions", children: [
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
function Yb(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function Xb(e, t, n) {
  const r = e[t];
  if (!r)
    return e;
  const o = Object.keys(n);
  if (!o.some(
    (c) => Object.prototype.hasOwnProperty.call(r, c)
  ))
    return e;
  const s = { ...r };
  for (const c of o)
    delete s[c];
  const i = { ...e };
  return Object.keys(s).length === 0 ? delete i[t] : i[t] = s, i;
}
function rd({
  canvas: e,
  sourceNodeId: t,
  successfulNodeIds: n,
  assetCate: r,
  powers: o
}) {
  let s = e;
  const i = Math.max(2, n.size + 1);
  for (let c = 0; c < i; c += 1) {
    const a = {
      ...s,
      nodes: c_(
        s.nodes,
        t,
        n
      )
    };
    if (s = Qi({
      canvas: a,
      assetCate: r,
      powers: o
    }), !s.nodes.some((u) => {
      const h = u.storyboardItem;
      return !h || h.sourceNodeId !== t || !n.has(u.id) ? !1 : !!(h.stale || h.sourceSignature && h.resultSourceSignature !== h.sourceSignature);
    }))
      break;
  }
  return s;
}
function Zl(e, t, n, r = e.length) {
  const o = Math.min(
    cr,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: Me(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: o },
      (s, i) => e[i] ? Ql(e[i], i) : Jl(i)
    )
  };
}
function Zb(e, t, n, r) {
  if (t < 0 || t >= cr || (e?.frames.length || 0) > cr)
    return null;
  const o = e || Zl([], null, r, t + 1), s = Math.min(
    cr,
    Math.max(2, o.frames.length, t + 1)
  ), i = Ql(n, t);
  return {
    ...o,
    frames: Array.from(
      { length: s },
      (c, a) => o.frames[a] || Jl(a)
    ).map(
      (c, a) => a === t ? {
        ...c,
        image: i.image,
        status: "success",
        error: "",
        assetID: i.assetID,
        assetVersionID: i.assetVersionID
      } : c
    )
  };
}
function Jl(e) {
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
function Ql(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: Zp(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function On(e, t, n) {
  const r = ae(t, "asset"), o = qo(r) ? dr(r) : void 0, s = _e(
    ae(t, "output"),
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result", "output"),
    ae(t, "result", "asset", "version", "content"),
    ae(t, "data", "output"),
    ae(t, "data", "content"),
    ae(t, "data", "result"),
    ae(t, "data")
  ), i = e.type === "agent" && s != null ? Oe(s) : Ms(s) || St(s), c = e.type === "power" && Ln(e.power, e.kind, e.outputType).viewMode === "storyboard" ? zo([
    s,
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result"),
    i
  ]) : null, a = e.type === "power" && em(e.power, e.kind, e.outputType) ? Ra([
    s,
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result"),
    i
  ]) : null, f = Me(
    String(ae(t, "asset", "kind") || ""),
    String(ae(t, "kind") || ""),
    Zs(e, i)
  ), u = Un(i, f), h = Ft(i, ""), v = Me(
    a?.title,
    c?.title
  ), N = ho(n), _ = ho(a?.summary) || ho(c?.summary) || ho(u.text) || ho(h) || (N ? `已按提示生成：${N}` : "生成完成");
  return {
    ...v && e.titleMode === "auto" ? { title: v } : {},
    description: _,
    resultRef: La(t),
    resultOutput: a || c || i,
    asset: o || e.asset,
    kind: o?.kind || e.power?.kind || e.kind
  };
}
function ho(e) {
  const t = Me(e);
  return mn(t) ? "" : t;
}
function sa(e, t) {
  const n = t.version?.content;
  return {
    ...On(
      e,
      {
        asset: t,
        output: n
      },
      Dd(n)
    ),
    asset: t
  };
}
function pr(e) {
  return xg(e.composerDraft);
}
function Mi(e, t, n) {
  return gu(
    ef(e, t),
    pr(e),
    n
  );
}
function ef(e, t) {
  const n = pr(e), r = Jd(t, n);
  return Qd(t, r);
}
function Jb(e) {
  const t = pr(e);
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
function oc(e, t) {
  const n = wh(e, t);
  return {
    ...n,
    id: Qb(e, t, n.id)
  };
}
function Qb(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const o = String(t.interaction?.interaction?.id || "");
  if (o)
    return `${e.id}:${o}`;
  const s = bs({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return s ? `${e.id}:feedback:${ff(s)}` : n;
}
function ia(e, t) {
  const n = Number(t.prompt?.approval?.id || 0), r = e.findIndex(
    (o) => o.id === t.id || n > 0 && Number(o.prompt?.approval?.id || 0) === n
  );
  return r < 0 ? [...e, t] : e.map((o, s) => {
    if (s !== r)
      return o;
    const i = o.status === "submitted", c = o.values || o.prompt?.values || t.values;
    return {
      ...o,
      title: t.title,
      description: t.description,
      prompt: {
        ...t.prompt,
        values: c || t.prompt.values || {}
      },
      values: o.values,
      status: i ? o.status : t.status,
      submittedAt: o.submittedAt
    };
  });
}
const od = 3600 * 1e3, tf = 2e3, eI = 3;
async function Di(e) {
  const t = AI(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = !1, o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: Ea(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s);
  let i = await oy({
    projectId: e.projectId,
    canvasId: e.canvasId,
    assetCateId: Number(e.assetCate.id || 0),
    startNodeId: e.startNode.id,
    requestId: t,
    singleNode: e.singleNode,
    targetNodeIds: e.targetNodeIds,
    executionScope: e.executionScope,
    canvas: s,
    runInput: {
      ...e.runInput || {},
      start_node_id: e.startNode.id
    }
  });
  for (let c = 0; c < 8; c += 1) {
    const a = await tI(
      e,
      i,
      o,
      (h) => {
        const v = mf(
          e,
          h,
          n
        );
        af(e, h), r = r || v > 0;
      },
      () => r,
      (h) => {
        o = h;
      }
    );
    if (e.canvasRun = a, Lr(e, a), Es(
      e,
      a,
      r
    ) && (a.status === "running" || a.status === "pending")) {
      L.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const f = Number(a.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      pN(
        a,
        $I(a, f)
      )
    );
    const u = String(a.status || "").toLowerCase();
    if (u !== "waiting") {
      if (cf(e, a), u === "fail" || u === "error")
        throw new Error(fu(a));
      if (u === "canceled" || u === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await PI(e, a), i = {
      ...a,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
async function tI(e, t, n, r, o, s) {
  let i = Ro(
    e,
    Bn(t)
  );
  if (i = ca(e, i), r(i.node_results || []), Lr(e, i), i.status !== "running" && i.status !== "pending" || !i.run_id && !i.request_id)
    return i;
  const c = String(i.request_id || ""), a = new AbortController(), f = Date.now() + od;
  let u = !1, h = null;
  const v = window.setTimeout(() => {
    u = !0, a.abort();
  }, od);
  try {
    const N = await cI(
      e,
      c,
      n,
      (_) => {
        _.stream_id && s(_.stream_id);
        const R = uI(_, e);
        if (!R) {
          sf(e, _);
          return;
        }
        i = Ro(
          e,
          da(i, R)
        ), r(i.node_results || []), Lr(e, i);
      },
      a.signal
    );
    N && (i = Ro(
      e,
      da(i, N)
    ), Lr(e, i)), r(i.node_results || []);
  } catch (N) {
    h = N;
  } finally {
    window.clearTimeout(v), a.abort(), e.runningNodeBatcher?.flush();
  }
  if (i = ca(e, i), aa(e, i) && !Es(
    e,
    i,
    o()
  ))
    try {
      i = await nI(
        e,
        i,
        c,
        r,
        o,
        f
      );
    } catch (N) {
      throw h instanceof Error && !u ? h : N;
    }
  if (!aa(e, i) || Es(
    e,
    i,
    o()
  ))
    return i;
  throw h instanceof Error && !u ? h : new Error("画布仍在运行，请稍后刷新查看结果");
}
async function nI(e, t, n, r, o, s) {
  let i = t, c = 0;
  for (; ; ) {
    if (Date.now() >= s)
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    try {
      i = await oI(
        e,
        i,
        n,
        r
      ), c = 0;
    } catch (a) {
      if (c += 1, c >= eI)
        throw a;
    }
    if (!aa(e, i) || Es(
      e,
      i,
      o()
    ))
      return i;
    await aI(
      Math.min(tf, s - Date.now())
    );
  }
}
function Es(e, t, n) {
  return !!(e.singleNode && !rf(e) && n && !rI(t));
}
function rI(e) {
  return String(e.status || "").trim().toLowerCase() === "waiting" || of(e) ? !0 : [
    e.pending_node,
    e.output,
    ...e.node_results || []
  ].some((r) => !!zn(r));
}
async function oI(e, t, n, r) {
  let o = t;
  const s = Number(o.run_id || 0), i = String(o.request_id || n || "");
  if (!s && !i)
    return o;
  const c = await ay({
    projectId: e.projectId,
    runId: s,
    requestId: i
  });
  return o = Ro(
    e,
    da(o, Bn(c))
  ), o = ca(e, o), r(o.node_results || []), Lr(e, o), o;
}
function aa(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : !nf(e, t);
}
function nf(e, t) {
  return CI(
    t
  ) ? !0 : e.singleNode ? (t.node_results || []).some(
    (n) => n.node_key === e.startNode.id && Go(yn(n))
  ) : !1;
}
function ca(e, t) {
  return sI(e, t) ? {
    ...t,
    status: iI(t.node_results || [])
  } : t;
}
function sI(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : nf(e, t);
}
function iI(e) {
  for (const t of e) {
    const n = yn(t);
    if (n === "fail")
      return "fail";
    if (n === "canceled" || n === "cancelled")
      return "canceled";
  }
  return "success";
}
function aI(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function cI(e, t, n, r, o) {
  let s = null;
  return await Vu({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: o,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if (dI(i))
          throw new Error(i.msg || "画布流返回失败");
        s = Ro(
          e,
          Bn(i.output || {})
        );
      }
    }
  }), s;
}
function dI(e) {
  return Number(e.status || 0) === 2;
}
function Ro(e, t) {
  if (!e.singleNode || rf(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const o = of(t), s = _e(n?.output, t.output), i = {
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
    approval: _e(n?.approval, o),
    interaction: _e(
      n?.interaction,
      zn(n?.result),
      zn(t.pending_node),
      zn(t.output)
    ),
    persists_result: !!n?.persists_result,
    agent_run_id: Number(n?.agent_run_id || 0)
  }, c = [
    ...(t.node_results || []).filter(
      (a) => a.node_key !== e.startNode.id
    ),
    i
  ];
  return {
    ...t,
    node_results: c,
    pending_node: r === "waiting" ? {
      ...i,
      status: "waiting",
      approval: i.approval,
      interaction: i.interaction
    } : t.pending_node
  };
}
function rf(e) {
  return e.singleNode && e.startNode.type === "group";
}
function of(e) {
  const t = Fo(e.output), n = Fo(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (o) => qo(o) && (o.status === "pending" || o.decision === "pending")
  );
}
function uI(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return Bn(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const o = lI(n, {
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
function lI(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, o = qo(r) ? r : {}, s = Am(o, n);
  if (!s)
    return null;
  const i = s;
  return t.requireDisplayableResult && !pI(e, i, t.node) ? null : {
    ...s,
    node_key: n,
    execution_id: Number(
      e.execution_id || s.execution_id || o.execution_id || 0
    ),
    node_type: String(e.node_type || s.node_type || ""),
    node_run_id: Number(e.node_run_id || s.node_run_id || 0),
    run_id: Number(e.run_id || s.run_id || o.run_id || 0),
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
    error: String(e.error || s.error || o.error || ""),
    output: s.output ?? o.output ?? r,
    asset: s.asset ?? o.asset,
    version: s.version ?? o.version ?? s.asset?.version,
    result: s.result ?? s,
    approval: _e(
      s.approval,
      fI(e, i)
    ),
    interaction: _e(
      e.interaction,
      s.interaction,
      zn(s)
    ),
    persists_result: !!(e.persists_result || s.persists_result),
    agent_run_id: Number(
      e.agent_run_id || s.agent_run_id || o.agent_run_id || 0
    ),
    source_signature: s.source_signature
  };
}
function fI(e, t) {
  const n = Fo(t.result), r = _e(
    e.approval,
    t.approval,
    n.approval
  );
  if (r && typeof r == "object")
    return r;
  const o = Number(
    _e(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return o > 0 ? { id: o } : void 0;
}
function zn(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const o of ["result", "pending_node"]) {
    const s = zn(n[o], t + 1);
    if (s)
      return s;
  }
  const r = Array.isArray(n.node_results) ? n.node_results : [];
  for (const o of r) {
    const s = zn(o, t + 1);
    if (s)
      return s;
  }
}
function pI(e, t, n) {
  return e.persists_result || String(e.node_type || "") !== "function" || String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ) === "display" ? !0 : !!(t.asset || t.version || ae(t, "asset", "version") || ae(t, "data", "asset") || ae(t, "data", "version"));
}
function sf(e, t) {
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
        const c = i[o];
        if (!c || c.status !== "running")
          return i;
        const a = sd(n.output), f = String(n.node_type || "").toLowerCase(), u = f === "power", h = f === "agent", v = String(
          a.semantic_event || a.event || ""
        ).toLowerCase(), N = sd(a.meta), _ = u && v === "status" && !!String(N.output_type || ""), R = _ && !!(a.json && typeof a.json == "object"), E = u && (v === "audio_ready" || R || Jp(a)), K = Number(N.generated_count || 0), Y = _ ? Math.max(
          c.generatedCount || 0,
          Number.isFinite(K) ? K : 0
        ) : c.generatedCount, te = u && typeof a.text == "string" && (v === "delta" || !v) ? a.text : "", X = E ? a : c.streamOutput;
        return {
          ...i,
          [o]: {
            ...c,
            progress: Math.max(c.progress, 72),
            streamText: te ? `${c.streamText || ""}${te}` : c.streamText,
            streamOutput: X,
            streamStarted: c.streamStarted || !!te || !!X,
            ..._ ? { streamStarted: !0, generatedCount: Y } : {},
            agent: h ? Gy(c.agent, a) : c.agent
          }
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s) : e.setRunningNode(s);
    }
  }
}
function mI(e, t, n, r) {
  const o = t.output || {}, s = String(o.event || ""), i = String(o.node_key || o.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (s === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    sf(e, t);
  }
}
function sd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function da(e, t) {
  const n = [...e.node_results || []];
  for (const r of t.node_results || []) {
    const o = Os(r), s = n.findIndex(
      (i) => Os(i) === o
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
function af(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => Go(r.status)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => gI(e, r, n)
  ), window.setTimeout(() => {
    e.setRunningNode?.((r) => {
      let o = !1, s = r;
      for (const i of n) {
        const c = i.node_key, a = s[c];
        !a || a.status === "running" || (s === r && (s = { ...r }), delete s[c], o = !0);
      }
      return o ? s : r;
    });
  }, 650));
}
function gI(e, t, n) {
  let r = !1;
  const o = { ...t };
  for (const s of n) {
    const i = s.node_key, c = e.nodes.find((f) => f.id === i);
    if (s.status === "canceled") {
      o[i] && (delete o[i], r = !0);
      continue;
    }
    if (s.status === "waiting") {
      o[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: t[i]?.startedAt || Date.now(),
        progress: 92,
        status: "waiting"
      }, r = !0;
      continue;
    }
    const a = o[i];
    a && (o[i] = {
      ...a,
      progress: 100,
      status: s.status === "success" ? "success" : "error",
      agent: c?.type === "agent" ? Hy(s.output) : a.agent
    }, r = !0);
  }
  return r ? o : t;
}
function cf(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((o) => {
      const s = Pi(
        e,
        t,
        o,
        n
      );
      if (s.length === 0)
        return o;
      const i = { ...o };
      for (const c of s)
        delete i[c];
      return i;
    });
    return;
  }
  const r = t.status === "success" ? "success" : "error";
  e.setRunningNode((o) => {
    let s = !1;
    const i = { ...o }, c = Pi(
      e,
      t,
      o,
      n
    );
    for (const a of c) {
      const f = i[a];
      f && (i[a] = {
        ...f,
        progress: r === "success" ? 100 : Math.max(f.progress, 92),
        status: r
      }, s = !0);
    }
    return s ? i : o;
  }), window.setTimeout(
    () => {
      e.setRunningNode?.((o) => {
        let s = !1, i = o;
        const c = Pi(
          e,
          t,
          o,
          n
        );
        for (const a of c) {
          const f = i[a];
          !f || f.status === "running" || (i === o && (i = { ...o }), delete i[a], s = !0);
        }
        return s ? i : o;
      });
    },
    r === "success" ? 650 : 1200
  );
}
function Pi(e, t, n, r) {
  const o = Xs(t), s = new Set(
    hI(e, t).filter(
      (i) => i === o || !r || r.has(i)
    )
  );
  return Object.keys(n).filter((i) => s.has(i));
}
function yI(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const o = ua(t), s = /* @__PURE__ */ new Map(), i = Xs(t);
  let c = !1, a = "";
  for (const h of t.node_runs || []) {
    const v = String(h.node_key || "");
    if (!v || o.has(v) || n && !n.has(v))
      continue;
    c = !0;
    const N = String(h.status || "").trim().toLowerCase();
    N === "running" ? s.set(v, "running") : N === "waiting" ? s.set(v, "waiting") : N === "pending" && !a && (a = v);
  }
  const f = String(t.pending_node?.node_key || "");
  if (f && !o.has(f) && (!n || n.has(f)) && s.set(f, "waiting"), s.size === 0 && a && s.set(a, "running"), s.size === 0 && !c) {
    const h = String(t.start_node_id || "");
    h && !o.has(h) && (!n || n.has(h)) && s.set(
      h,
      r === "waiting" ? "waiting" : "running"
    );
  }
  if (i && s.set(
    i,
    r === "waiting" ? "waiting" : "running"
  ), s.size === 0)
    return;
  const u = Date.parse(String(t.created_at || ""));
  e.setRunningNode((h) => {
    let v = !1;
    const N = { ...h };
    for (const [_, R] of s) {
      const E = e.nodes.find((te) => te.id === _), K = _ === i;
      if (!E && !K)
        continue;
      const Y = h[_];
      Y?.status !== R && (N[_] = {
        nodeId: _,
        title: K ? `${e.startNode.title || "分镜脚本"}制作区` : E?.title || _,
        startedAt: Y?.startedAt || (Number.isFinite(u) ? u : Date.now()),
        progress: R === "waiting" ? 92 : Y?.progress || 0,
        status: R
      }, v = !0);
    }
    return v ? N : h;
  });
}
function hI(e, t) {
  const n = new Set(Fs(t)), r = Xs(t);
  return r && n.add(r), e.singleNode && n.add(e.startNode.id), [...n];
}
function Xs(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? Ks(t) : "";
}
function Ei(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const r = Number(e.asset_cate_id || 0);
  return r === 0 || r === t.assetCateId;
}
function Fs(e) {
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
function ua(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Go(yn(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function wI(e) {
  return uf(e).map((t) => t.run);
}
function _I(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    du(n) && t.set(ar(n), n);
  return [...t.values()];
}
function bI(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const o of df(n))
        t.set(o, r);
  }
  return t;
}
function II(e, t) {
  for (const n of df(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function df(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function uf(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const s of Fs(r))
      t.has(s) || (t.add(s), o.add(s));
    o.size !== 0 && du(r) && n.push({ run: r, managedNodeIds: o });
  }
  return n;
}
function Fi(e) {
  return e.map(lf).filter((t) => !!t);
}
function lf(e) {
  const t = Bn(e);
  return t.run_id || t.request_id ? t : null;
}
function NI(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Number(r.run_id || 0);
    o > 0 && !vI(r, t) && n.add(o);
  }
  return [...n];
}
function vI(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const s = t[String(n)];
    return s ? la(e, s) : !1;
  }
  const r = Number(e.asset_cate_id || 0);
  return (r ? Object.values(t).filter(
    (s) => s.assetCateId === r
  ) : Object.values(t)).some(
    (s) => la(e, s)
  );
}
function la(e, t) {
  const n = String(e.status || "").trim().toLowerCase();
  if (!["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
    n
  ))
    return !1;
  const r = new Map(t.nodes.map((s) => [s.id, s]));
  if (!e.single_node) {
    const s = (e.node_results || []).filter(
      (c) => c.node_key
    );
    if (s.length === 0)
      return !1;
    let i = 0;
    for (const c of s) {
      const a = r.get(c.node_key);
      if (a && (i += 1, !id(a.resultRef, e, c)))
        return !1;
    }
    return i > 0;
  }
  const o = r.get(String(e.start_node_id || ""));
  return id(o?.resultRef, e);
}
function id(e, t, n) {
  if (!e)
    return !1;
  const r = Number(t.execution_id || 0), o = Number(e.execution_id || 0);
  if (r > 0 && o > 0 && o >= r)
    return !0;
  const s = Number(t.run_id || 0), i = Number(e.run_id || 0);
  if (s > 0 && i > 0 && i >= s)
    return !0;
  const c = Number(n?.node_run_id || 0), a = Number(e.node_run_id || 0);
  if (c > 0 && a > 0 && a >= c)
    return !0;
  const f = String(n?.request_id || t.request_id || "");
  return !!(f && e.request_id === f);
}
function ad(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(ar(r), r);
  for (const r of t)
    n.set(ar(r), r);
  return [...n.values()].sort(SI).slice(0, 50);
}
function SI(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = cd(t) - cd(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function cd(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function CI(e) {
  const t = RI(e);
  if (t.size === 0)
    return !1;
  const n = /* @__PURE__ */ new Set();
  for (const r of e.node_results || []) {
    const o = yn(r);
    if (o === "waiting" || o === "running" || o === "pending")
      return !1;
    Go(o) && n.add(r.node_key);
  }
  for (const r of t)
    if (!n.has(r))
      return !1;
  return !0;
}
function RI(e) {
  const t = /* @__PURE__ */ new Set();
  for (const o of e.execution_plan?.nodes || [])
    xI(o) && t.add(o.id);
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
function xI(e) {
  return ["asset", "power", "agent", "flow"].includes(String(e.type || "")) ? !0 : e.type !== "function" ? !1 : e.function_key === "save" || e.function_key === "display";
}
function kI(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((o) => o.id === n);
    if (r)
      return r;
  }
  return t.find(lN) || t[0] || null;
}
function TI(e, t) {
  return [
    e.run_id || e.request_id || "",
    Os(t)
  ].join(":");
}
function Go(e) {
  const t = String(e || "").trim().toLowerCase();
  return t === "success" || t === "fail" || t === "canceled" || t === "cancelled";
}
function yn(e) {
  if (!e)
    return "";
  const t = String(
    e.status || ae(e.result, "status") || ""
  ).trim().toLowerCase();
  return t === "error" ? "fail" : t === "cancelled" ? "canceled" : t;
}
function AI(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function MI(e, t, n) {
  const r = typeof n == "string" ? n : bs(n), o = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${o}-${ff(r)}`.slice(
    0,
    96
  );
}
function ff(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function Lr(e, t, n) {
  DI(e, t), yI(e, t, n);
}
function DI(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((a) => a.id === n.node_key);
  if (!r)
    return;
  const o = sc(n, r);
  if (!o)
    return;
  const s = oc(r, o), i = ur(r), c = ia(
    i,
    s
  );
  if (bs(i) !== bs(c)) {
    const a = {
      ...r,
      feedbackRequests: c
    };
    e.nodes = e.nodes.map(
      (f) => f.id === r.id ? a : f
    ), e.onNodeResult(r.id, { feedbackRequests: c });
  }
  e.setRunningNode?.((a) => ({
    ...a,
    [r.id]: {
      nodeId: r.id,
      title: r.title,
      startedAt: a[r.id]?.startedAt || Date.now(),
      progress: 92,
      status: "waiting"
    }
  }));
}
async function PI(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const o = sc(n, r);
  if (!o || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const s = await e.requestFlowFeedback({ node: r, prompt: o });
  return pf(
    e.projectId,
    t,
    n,
    o,
    s
  );
}
async function pf(e, t, n, r, o) {
  return r.interaction ? uy({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: o
  }) : iy({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: o
  });
}
function EI(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const o = r.pending_node;
    if (!o || o.node_key !== t.id)
      continue;
    const s = sc(o, t);
    if (!s)
      continue;
    if (oc(t, s).id === n.id)
      return { run: r, pending: o, prompt: s };
  }
  return null;
}
function sc(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : zn(e);
  if (n?.interaction?.id)
    return Ku({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const o = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, s = _e(
      e.approval,
      ae(e.result, "approval"),
      ae(e.output, "approval")
    );
    s && !Array.isArray(o.approvals) && (o.approvals = [s]);
    const i = Ih(o);
    return Nh(i);
  }
  return Sh(
    hf(e),
    t.title
  );
}
function mf(e, t, n) {
  let r = 0;
  const o = new Map(e.nodes.map((s) => [s.id, s]));
  for (const s of t) {
    const i = o.get(s.node_key), c = yn(s);
    if (!i || !Go(c))
      continue;
    const a = Os(s);
    if (c === "success" && a && n?.has(a))
      continue;
    const f = zI(e, i, s);
    e.onNodeResult(i.id, f), a && n?.add(a), c === "success" && (r += 1);
    const u = {
      ...i,
      ...f
    };
    o.set(i.id, u), e.nodes = e.nodes.map(
      (h) => h.id === i.id ? u : h
    ), c === "success" && f.asset && e.onAssetCreated(f.asset), c === "success" && e.requestNodeTitle?.(u, s);
  }
  return r;
}
function FI(e, t) {
  const n = pr(e).prompt.trim(), o = (t ? If(e.id, t.nodes, t.edges) : null)?.text.trim() || "", s = [n, o ? `上游内容：
${o}` : ""].filter(Boolean).join(`

`);
  return Array.from(s).slice(0, Tb).join("");
}
function OI(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || yn(t) !== "success" || yf(t) <= 0 || !gf(e) ? !1 : Ln(e.power, e.kind, e.outputType).viewMode !== "storyboard";
}
function gf(e) {
  const t = Number(e.nodeNo || 0);
  return t > 0 && e.title.trim() === bu(e, t).trim();
}
function yf(e) {
  const t = [
    ae(e, "version_id"),
    ae(e, "versionId"),
    ae(e, "version", "id"),
    ae(e, "asset", "version_id"),
    ae(e, "asset", "versionId"),
    ae(e, "asset", "version", "id"),
    ae(e, "result", "version_id"),
    ae(e, "result", "versionId"),
    ae(e, "result", "version", "id"),
    ae(e, "result", "asset", "version_id"),
    ae(e, "result", "asset", "version", "id"),
    ae(e, "output", "version_id"),
    ae(e, "output", "version", "id"),
    ae(e, "output", "asset", "version_id"),
    ae(e, "output", "asset", "version", "id"),
    ae(e, "data", "version_id"),
    ae(e, "data", "version", "id"),
    ae(e, "data", "asset", "version_id"),
    ae(e, "data", "asset", "version", "id")
  ];
  for (const n of t) {
    const r = Number(n || 0);
    if (Number.isInteger(r) && r > 0)
      return r;
  }
  return 0;
}
function Os(e) {
  return [
    e.node_key,
    e.execution_id || "",
    e.request_id || "",
    e.node_run_id || "",
    e.child_run_id || "",
    e.status || "",
    e.source_signature || "",
    Number(
      e.version?.id || e.asset?.version?.id || ae(e.result, "version", "id") || 0
    ),
    Number(
      e.asset?.id || ae(e.result, "asset", "id") || 0
    )
  ].join(":");
}
function zI(e, t, n) {
  const r = hf(n), o = yn(n);
  if (o === "fail")
    return Oi(t, {
      resultRef: La(r),
      runError: Mm(n)
    });
  if (o === "canceled" || o === "cancelled")
    return Oi(t, {
      runError: ""
    });
  const s = Jy({
    result: r,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), i = (c) => Oi(
    t,
    BI(
      t,
      c,
      n.source_signature
    )
  );
  return i(s ? {
    ...On(
      t,
      Qy(r, s),
      "后端执行结果"
    ),
    runError: ""
  } : {
    ...On(t, r, "后端执行结果"),
    runError: ""
  });
}
function BI(e, t, n) {
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
function Oi(e, t) {
  const n = ur(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function hf(e) {
  const t = Fo(e.result);
  return {
    ...t,
    execution_id: e.execution_id || t.execution_id,
    run_id: e.run_id || t.run_id,
    request_id: e.request_id || t.request_id,
    node_run_id: e.node_run_id || t.node_run_id,
    child_run_id: e.child_run_id || t.child_run_id,
    child_request_id: e.child_request_id || t.child_request_id,
    status: e.status || t.status,
    error: e.error || t.error,
    output: e.output ?? t.output,
    asset: e.asset || t.asset,
    version: e.version || t.version || e.asset?.version,
    agent_run_id: e.agent_run_id || t.agent_run_id
  };
}
function $I(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? fu(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function jI(e) {
  const t = LI(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await py({
    projectId: e.projectId,
    canvasId: e.canvasId,
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
  return Fn(n, r);
}
function LI(e) {
  return Math.max(0, Number(e || 0));
}
function hr(e) {
  const t = gn(e), n = Un(
    t,
    Zs(e, t)
  );
  return $n(n) || (n.text = Ft(t, "")), n;
}
function Zs(e, t) {
  const n = pb(t);
  return e.type === "power" ? Me(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : Me(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function hs(e) {
  const t = hr(e);
  if ($n(t))
    return t;
  const n = Un(
    gn(e),
    String(e.kind || e.power?.kind || "")
  );
  return $n(n) || (n.text = Ft(gn(e), "")), n;
}
function ic(e) {
  return UI(e) || cb(e);
}
function Pn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : gn(e);
}
function zi(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    Pn(e)
  ];
}
function VI(e) {
  const t = e.composerDraft?.paramValues || {};
  return Me(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function UI(e) {
  return rb(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function wo(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function KI(e, t, n, r) {
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
    storyboardFramePlanVersion: void 0,
    composerDraft: e.composerDraft ? { ...e.composerDraft, paramBindings: void 0 } : void 0,
    local: !0
  };
}
function qI(e, t) {
  const n = wf(e), r = _f(e, t, n), o = (s) => n.hasResultByNodeId.get(s.id) || !1;
  return {
    ...n,
    ...r,
    runBlockedReasonByNodeId: new Map(
      e.map((s) => [
        s.id,
        Eu({
          targets: s.type === "group" ? n.groupMembersById.get(s.id) || [] : [s],
          nodesByID: n.nodeById,
          hasResult: o
        })
      ])
    ),
    highlightedPathEdgesByNodeId: iN(
      n.nodeById,
      t
    )
  };
}
function wf(e) {
  const t = new Map(e.map((o) => [o.id, o])), n = new Map(
    e.map((o) => [o.id, Ut(o)])
  ), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o.groupId)
      continue;
    const s = r.get(o.groupId) || [];
    s.push(o), r.set(o.groupId, s);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function _f(e, t, n, r = "") {
  const { nodeById: o, groupMembersById: s, hasResultByNodeId: i } = n, c = (_) => {
    const R = o.get(_);
    return R ? R.type === "group" ? s.get(R.id) || [] : [R] : [];
  }, a = /* @__PURE__ */ new Set();
  for (const _ of t) {
    const R = It(_);
    if (r && R.targetNodeId !== r)
      continue;
    const { sourceNodeId: E } = R;
    for (const K of c(E))
      a.add(K.id);
  }
  const f = /* @__PURE__ */ new Map();
  for (const _ of e)
    if (a.has(_.id)) {
      const R = GI(
        _,
        i.get(_.id) || !1
      );
      R && dd(R).trim() !== "" && f.set(_.id, R);
    }
  const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  for (const _ of t) {
    const { sourceNodeId: R, targetNodeId: E } = It(_);
    if (!(r && E !== r || !o.has(E)))
      for (const K of c(R)) {
        if (eu(_) && Ta(K)) {
          const ie = h.get(E) || [];
          ie.push({ edge: _, source: K }), h.set(E, ie);
        }
        const Y = f.get(K.id), te = v.get(E) || /* @__PURE__ */ new Set();
        if (!Y || te.has(K.id))
          continue;
        te.add(K.id), v.set(E, te);
        const X = u.get(E) || [];
        X.push(Y), u.set(E, X);
      }
  }
  const N = /* @__PURE__ */ new Map();
  for (const [_, R] of u)
    N.set(_, {
      sources: R,
      text: R.map(dd).join(`

`)
    });
  return {
    inputContextByNodeId: N,
    incomingMediaReferencesByNodeId: h
  };
}
function It(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function bf(e, t, n) {
  const r = [];
  for (const o of t) {
    if (!eu(o))
      continue;
    const s = It(o);
    if (s.targetNodeId === n)
      for (const i of ru(
        e,
        s.sourceNodeId
      ))
        Ta(i) && r.push({ edge: o, source: i });
  }
  return r;
}
function If(e, t, n) {
  const r = wf(t);
  return _f(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function GI(e, t) {
  if (!t)
    return null;
  const n = gn(e), r = Zs(e, n), o = Un(n, r);
  return $n(o) || (o.text = Ft(
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
function HI(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const o = t.sources[r];
    return n.nodeId === o.nodeId && n.title === o.title && n.type === o.type && n.kind === o.kind && n.output === o.output && n.resultRef === o.resultRef && n.preview.text === o.preview.text && n.preview.imageUrl === o.preview.imageUrl && n.preview.videoUrl === o.preview.videoUrl && n.preview.audioUrl === o.preview.audioUrl && n.preview.fileUrl === o.preview.fileUrl;
  });
}
function dd(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || Hl(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function fa(e, t) {
  return hm(e, t);
}
function ud(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function dn(e, t, n, r) {
  return !t || !n || t === n || e.some((s) => {
    const i = It(s);
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
function pa(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function ma(e, t) {
  return e.type === "asset" && pa(e) === t;
}
function ld(e, t, n, r) {
  const o = new Map(e.map((s) => [s.id, s]));
  if (r)
    for (const s of t) {
      if (s.from !== r)
        continue;
      const i = o.get(s.to);
      if (i && ma(i, n))
        return i;
    }
  return e.find((s) => ma(s, n)) || null;
}
function fd(e, t, n, r, o) {
  const s = /* @__PURE__ */ new Set();
  if (!r || !n)
    return s;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== r || c.to === o)
      continue;
    const a = i.get(c.to);
    a && ma(a, n) && s.add(a.id);
  }
  return s;
}
function Bi(e, t) {
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
function WI(e) {
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
function YI(e) {
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
function pd(e, t) {
  const n = new Set(e.nodes.map((i) => i.id));
  let r = !1;
  const o = e.nodes.map((i) => {
    const c = Number(i.assetCateId ?? t), a = i.local !== !1;
    return i.assetCateId === c && i.local === a ? i : (r = !0, {
      ...i,
      assetCateId: c,
      local: a
    });
  }), s = e.edges.filter(
    (i) => n.has(i.from) && n.has(i.to)
  );
  return wu({
    id: e.id,
    name: e.name,
    sort: e.sort,
    status: e.status,
    assetCateId: t,
    nextNodeNo: e.nextNodeNo,
    nodes: r ? o : e.nodes,
    edges: s.length === e.edges.length ? e.edges : s,
    viewport: e.viewport || {},
    updatedAt: e.updatedAt
  });
}
function XI(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      Or(r, t)
    ])
  );
}
function Or(e, t) {
  if (!t.length)
    return e;
  const n = t.filter(
    (s) => Number(s.canvas_id || 0) === e.id
  ), r = new Map(t.map((s) => [s.id, s])), o = new Map(
    n.filter(
      (s) => String(s.role || "") === "material" && String(s.status || "") !== "archived" && String(s.node_key || s.version?.node_key || "").trim()
    ).map((s) => [
      String(s.node_key || s.version?.node_key || "").trim(),
      s
    ])
  );
  return {
    ...e,
    nodes: e.nodes.map(
      (s) => ZI(s, r, o)
    )
  };
}
function ZI(e, t, n) {
  const r = JI(e), o = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!o)
    return e;
  const s = sa(e, o), i = Number(s.resultRef?.run_id || 0), c = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...s,
    ...e.runError && i > c ? { runError: "" } : {},
    asset: o
  };
}
function JI(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function md(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Nf(e.nodes, t.nodes) && vf(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Nf(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function QI(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.staleCount === t.staleCount && e.status === t.status;
}
function vf(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n === o || n.id === o.id && n.from === o.from && n.to === o.to && (n.logicalFrom || "") === (o.logicalFrom || "") && (n.logicalTo || "") === (o.logicalTo || "") && (n.purpose || "") === (o.purpose || "") && (n.executionMode || "auto") === (o.executionMode || "auto") && (n.mediaUsage || "") === (o.mediaUsage || "");
  });
}
function eN(e, t) {
  return fa(e, t) ? { source: e.id, target: t.id } : fa(t, e) ? { source: t.id, target: e.id } : null;
}
function tN(e) {
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
function nN(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function rN(e, t, n) {
  const o = new Map(n.map((i) => [i.id, i]));
  let s = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const c = o.get(i.id);
    if (!c)
      continue;
    const a = i.position.x - e.position.x, f = i.position.y - e.position.y, u = Math.sqrt(a * a + f * f);
    u < 150 && (!s || u < s.distance) && (s = { distance: u, domainNode: c });
  }
  return s;
}
function oN(e, t, n, r, o, s, i) {
  const c = e.id === o, a = s.has(e.id), f = c || a || e.source === n || e.target === n || e.source === r || e.target === r, u = e.source === n || e.target === n ? n : r;
  return {
    highlighted: f,
    selected: c,
    highlightColor: f ? aN(
      t.get(
        a ? i : u
      )
    ) : "var(--ws-edge)"
  };
}
function sN(e, t) {
  return {
    ...e,
    data: {
      ...e.data,
      isHighlighted: t.highlighted,
      isSelected: t.selected,
      highlightColor: t.highlightColor
    }
  };
}
function iN(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of t) {
    const s = n.get(o.from);
    s ? s.push(o) : n.set(o.from, [o]);
  }
  const r = /* @__PURE__ */ new Map();
  for (const o of e.values()) {
    if (o.type !== "function" || o.functionOption?.key !== "start")
      continue;
    const s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set([o.id]), c = [...n.get(o.id) || []];
    for (let a = 0; a < c.length; a += 1) {
      const f = c[a];
      if (!f || s.has(f.id) || (s.add(f.id), i.has(f.to)))
        continue;
      i.add(f.to);
      const u = e.get(f.to);
      u && Pu(u) || c.push(...n.get(f.to) || []);
    }
    s.size > 0 && r.set(o.id, s);
  }
  return r;
}
function aN(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function cN(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function dN(e) {
  return e instanceof HTMLElement ? !!e.closest("input, textarea, select, [contenteditable='true']") : !1;
}
function gd(e) {
  return !e.repeat && (e.key === "Delete" || e.key === "Backspace") && !dN(e.target);
}
function uN(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ d(zs, { ...n }) : e === "import" ? /* @__PURE__ */ d(Ui, { ...n }) : e === "display" ? /* @__PURE__ */ d(wa, { ...n }) : /* @__PURE__ */ d(kd, { ...n });
}
function lN(e) {
  return e.type !== "function" ? !1 : e.functionOption?.key === "start" || e.title === "开始";
}
function Sf(e) {
  if (e.type !== "function")
    return !1;
  const t = e.functionOption?.key || "";
  return t === "import" || t === "save" || t === "display";
}
function ac(e) {
  return Sf(e) && Ut(e);
}
function fN(e) {
  return {
    description: e
  };
}
function pN(e, t) {
  return {
    ...fN(t),
    resultRef: La({
      ...Fo(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const yd = { width: 620, height: 420 }, cc = 44;
function Cf(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && Bo(t) === "image");
}
function hd(e, t) {
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
function Rf(e) {
  if (e.type === "function") {
    if (ac(e)) {
      if (!ku(e))
        return { width: e.width, height: e.height };
      const n = wd(e);
      return n ? {
        width: n.width,
        height: n.height + cc
      } : gN(e);
    }
    return { width: 128, height: 46 };
  }
  const t = wd(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function wd(e) {
  if (!ku(e) || !mN(e))
    return null;
  const t = hr(e);
  return !qd(
    Pn(e),
    Bo(t)
  ) || Cf(e, t) ? null : {
    width: Math.max(e.width, yd.width),
    height: Math.max(e.height, yd.height)
  };
}
function mN(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Ln(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function gN(e) {
  const t = hr(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = js({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + cc
  };
}
function tt({
  id: e,
  type: t,
  position: n,
  className: r,
  style: o
}) {
  return /* @__PURE__ */ d(
    Jf,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: o,
      children: /* @__PURE__ */ d("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ d(vd, { size: 12 }) : /* @__PURE__ */ d(Sd, { size: 12 }) })
    }
  );
}
function cn({
  node: e,
  selected: t
}) {
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && ac(e), r = /* @__PURE__ */ d(
    Vy,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const o = un(e.runningNode);
    return /* @__PURE__ */ P(ln, { children: [
      r,
      /* @__PURE__ */ d(
        Fh,
        {
          node: e,
          running: o,
          onRun: () => {
            o || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((s) => {
              L.error(
                s instanceof Error ? s.message : "流程运行失败"
              );
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !ga(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ P(ln, { children: [
    r,
    /* @__PURE__ */ d(
      je,
      {
        fallback: /* @__PURE__ */ d(Le, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ d(q_, { node: e }, e.id)
      }
    )
  ] });
}
function ga(e) {
  return e.type === "agent" ? !0 : e.type === "power" && !tm(e.power, e.kind, e.outputType);
}
function _o({
  node: e,
  onShowNodeDetail: t
}) {
  if (!t || !Ut(e))
    return null;
  const n = !!hs(e).videoUrl;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: [
        "ws-node-quick-view nodrag nopan",
        n ? "is-video-detail" : ""
      ].filter(Boolean).join(" "),
      "aria-label": "查看详情",
      onPointerEnter: Po,
      onFocus: Po,
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ d(wa, { size: 14 })
    }
  );
}
const yN = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function $i({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = ko(
    e.resultView || yN
  ), [o, s] = V(null), i = $y(
    r,
    o
  ), [c, a] = V(!1), f = e.type === "agent" ? t?.agent : void 0, u = Yy(f);
  if (!Ut(e) && !u)
    return null;
  const h = hr(e), v = Qa(e), N = Me(
    Ft(h.text, ""),
    Ft(v, ""),
    Ft(e.description, ""),
    e.title,
    "暂无结果"
  ), _ = ic(e), R = Pn(e), E = Ue(R) ? R : _ ? { rich: _ } : N, K = vl(h) ? h : lb(
    h,
    Un(N, Ll(N, ""))
  ), Y = e.interactive, te = _e(
    e.resultOutput,
    e.asset?.version?.content
  ), X = e.type === "agent" ? async (ie) => {
    if (!un(t))
      try {
        await e.onRunBackendNode(e, { agentInput: ie });
      } catch (C) {
        L.error(
          C instanceof Error ? C.message : "智能体继续运行失败"
        );
      }
  } : void 0;
  return /* @__PURE__ */ d(je, { fallback: /* @__PURE__ */ d(Le, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Nl,
    {
      output: E,
      fallback: N,
      preview: K,
      mediaLabel: Vr(K),
      className: `ws-agent-result-bubble ${c ? "is-resizing" : ""}`,
      followContent: !!(t && t.status !== "error"),
      followKey: f,
      style: {
        width: i.width,
        height: i.height,
        left: `calc(100% + 12px + ${Number(i.offsetX || 0)}px)`,
        top: `calc(50% + ${Number(i.offsetY || 0)}px)`
      },
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Po,
      resizeControls: /* @__PURE__ */ d(
        Uy,
        {
          value: i,
          enabled: Y,
          onResizeStart: () => {
            s(
              (ie) => xc(
                r,
                ie,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (ie) => s(
            (C) => xc(
              r,
              C,
              ie
            )
          ),
          onResizeEnd: (ie) => {
            a(!1), e.onResultViewResizeEnd(e.id, ie), s(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ d(
        je,
        {
          fallback: /* @__PURE__ */ d(Le, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ d(
            U_,
            {
              output: te,
              runtime: f,
              fallback: N,
              running: un(t),
              onContinue: X
            }
          )
        }
      ) : void 0
    }
  ) });
}
function hN({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = hr(e), o = ic(e), s = Pn(e), i = Me(
    Qa(e),
    Ft(r.text, ""),
    Ft(e.description, ""),
    "暂无内容"
  ), c = Ue(s) ? s : o ? { rich: o } : i, a = !zr(c, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), f = a && !r.audioUrl ? ws(
    e,
    e.onNodeResult,
    cc
  ) : void 0;
  return /* @__PURE__ */ d(je, { fallback: /* @__PURE__ */ d(Le, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Nl,
    {
      output: c,
      fallback: i,
      preview: r,
      mediaLabel: Vr(r),
      className: `ws-node-function-result-card ${a ? "has-media" : ""}`,
      customContentIsPureMedia: a,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Po,
      children: a ? /* @__PURE__ */ d(
        xf,
        {
          preview: r,
          output: c,
          fallback: i,
          generating: t,
          showMediaCaption: !1,
          onMediaSize: f
        }
      ) : void 0
    }
  ) });
}
function ji({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = ur(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (s) => s.status === "pending"
  ).length, o = [...n].reverse().find((s) => s.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ P(
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
        /* @__PURE__ */ d(Ip, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ d("span", { children: n.length }) : null
      ]
    }
  );
}
function wN(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Ut(e) {
  if (!_N(e) || !wN(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = gn(e);
  if (t == null)
    return !1;
  const n = Un(
    t,
    Zs(e, t)
  );
  return $n(n) || rc(t);
}
function _N(e) {
  return e.type !== "function" ? !0 : Sf(e);
}
async function bN(e) {
  const t = e.node.functionOption?.key || "", n = IN(e.inputContext);
  if (t === "display") {
    if (n == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      On(
        e.node,
        { output: n },
        "展示上游结果"
      )
    ), L.success("已展示上游结果"), !0;
  }
  if (t === "save") {
    if (n == null)
      throw new Error("保存节点没有可保存的上游结果");
    const r = await jI({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: vN(e.node, e.inputContext),
      kind: eh(e.node),
      content: n,
      nodeKey: e.node.id,
      requestId: MI(
        "save",
        e.node.id,
        n
      ),
      source: NN(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(r), e.onNodeResult(
      e.node.id,
      On(
        e.node,
        {
          output: r.version?.content || n,
          asset: r
        },
        "保存上游结果"
      )
    ), L.success("资产已保存"), !0;
  }
  return t === "start" ? (await e.onRunStartNode(e.node), !0) : t === "import" ? (e.onOpenImportPicker(e.node.id), !0) : (e.onNodeResult(
    e.node.id,
    On(
      e.node,
      { output: "操作已应用" },
      "操作已应用"
    )
  ), L.success("操作已应用"), !0);
}
function dc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function IN(e) {
  const t = dc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function NN(e) {
  const t = dc(e);
  return ih(t);
}
function vN(e, t) {
  const n = dc(t);
  return Me(n?.title, e.title, "画布资产");
}
function SN({
  prompt: e,
  running: t,
  readonly: n,
  history: r,
  activeRecordId: o,
  onSelectRecord: s,
  onClose: i,
  onSubmit: c
}) {
  const a = ue(
    () => RN(e),
    [e]
  );
  if (typeof document > "u")
    return null;
  const f = document.querySelector(".ws-page") || document.body;
  return Vf(
    /* @__PURE__ */ d("div", { className: "ws-flow-feedback-backdrop", onMouseDown: i, children: /* @__PURE__ */ P(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (u) => u.stopPropagation(),
        children: [
          /* @__PURE__ */ P("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ P("div", { children: [
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
                children: /* @__PURE__ */ d(xd, { size: 18 })
              }
            )
          ] }),
          r && r.length > 1 ? /* @__PURE__ */ d("div", { className: "ws-flow-feedback-tabs", children: r.map((u, h) => /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: u.id === o ? "is-active" : "",
              onClick: () => s?.(u),
              children: [
                /* @__PURE__ */ d("span", { children: h + 1 }),
                u.status === "pending" ? "待反馈" : "已提交"
              ]
            },
            u.id
          )) }) : null,
          /* @__PURE__ */ d("div", { className: "ws-flow-feedback-body custom-scrollbar", children: /* @__PURE__ */ d(je, { fallback: /* @__PURE__ */ d(Le, { label: "正在加载交互表单" }), children: /* @__PURE__ */ d(
            T_,
            {
              interaction: a,
              disabled: t,
              readonly: n,
              hideHeader: !0,
              layout: "dialog",
              initialData: n ? e.values : void 0,
              onSubmit: (u) => c(
                CN(e, a, u.data)
              )
            }
          ) }) }),
          n ? /* @__PURE__ */ d("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: i,
              children: [
                /* @__PURE__ */ d(_a, { size: 16 }),
                /* @__PURE__ */ d("span", { children: "知道了" })
              ]
            }
          ) }) : null
        ]
      }
    ) }),
    f
  );
}
function CN(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function RN(e) {
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
function sr(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function xN(e) {
  const t = sr(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function _d(e, t) {
  if (!e)
    return;
  const n = sr(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function kN(e) {
  return e.type === "function" && e.functionOption?.key === "start";
}
function TN(e) {
  return e.type === "function" && e.functionOption?.key === "start" ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function AN(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const o = Dy({
    members: n,
    hasResult: Ut
  });
  await r(t, { targetNodeIds: o });
}
function MN({ data: e, selected: t }) {
  const n = e, {
    sourceNode: r,
    projectId: o,
    runningNode: s,
    setRunningNode: i,
    onShowNodeDetail: c,
    onNodeResult: a,
    onOpenFeedbackRecord: f,
    canvasReferenceItems: u,
    connectedMediaReferences: h,
    onConnectedMediaEdgeRemove: v,
    onNodeDraftChange: N,
    onOpenStoryboardGridImport: _,
    onRunBackendNode: R,
    structureLocked: E,
    storyboardSourceNode: K
  } = e, Y = n.type === "power" ? Ln(n.power, n.kind, n.outputType) : null, te = Y?.viewMode === "storyboard", X = Y?.viewMode === "storyboard_grid", ie = Y?.viewMode === "video_compose";
  if (n.type === "group") {
    const C = n.groupMembers, oe = n.storyboardFrameRunning, B = n.groupRuntime || Fu({
      members: C,
      runningNodes: Wl,
      groupState: s,
      hasResult: Ut
    }), z = n.runBlockedReason;
    let j;
    return !z && !oe && (j = () => {
      i((G) => ({
        ...G,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: 8,
          status: "running"
        }
      })), AN(
        n,
        r,
        C,
        R
      ).then(() => {
        i((G) => So(G, n.id));
      }).catch((G) => {
        i((ce) => ({
          ...ce,
          [n.id]: {
            ...ce[n.id] || {
              nodeId: n.id,
              title: n.title,
              startedAt: Date.now(),
              progress: 8
            },
            status: "error"
          }
        })), L.error(
          G instanceof Error ? G.message : "分组运行失败"
        ), window.setTimeout(() => {
          i((ce) => So(ce, n.id));
        }, 1400);
      });
    }), /* @__PURE__ */ d(je, { fallback: /* @__PURE__ */ d(Le, { label: "正在加载分组" }), children: /* @__PURE__ */ P(
      v_,
      {
        node: n,
        memberCount: B.memberCount,
        runnableCount: B.runnableCount,
        completedCount: B.completedCount,
        failedCount: B.failedCount,
        staleCount: B.staleCount,
        status: B.status,
        frameRunning: oe,
        selected: t,
        managed: E,
        onRename: E ? void 0 : (G) => a(n.id, { title: G, titleMode: "manual" }),
        onEditStructure: K ? () => c(
          K,
          hl(n)
        ) : void 0,
        onRun: j,
        runBlockedReason: z,
        children: [
          /* @__PURE__ */ d(
            tt,
            {
              id: "input-0",
              type: "target",
              position: et.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ d(
            tt,
            {
              id: "output-0",
              type: "source",
              position: et.Right,
              className: "is-out"
            }
          ),
          /* @__PURE__ */ d(cn, { node: n, selected: t })
        ]
      }
    ) });
  }
  if (n.type === "agent") {
    const C = un(s) || s?.status === "success";
    return /* @__PURE__ */ P(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${C ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ d(
            tt,
            {
              id: "input-0",
              type: "target",
              position: et.Left,
              className: "is-in",
              style: { left: "4px" }
            }
          ),
          /* @__PURE__ */ d(
            tt,
            {
              id: "output-0",
              type: "source",
              position: et.Right,
              className: "is-out",
              style: { right: "4px" }
            }
          ),
          /* @__PURE__ */ P("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ d(wp, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ d(
              xi,
              {
                className: "ws-node-circle-title",
                title: n.title,
                onRename: a ? (oe) => a(n.id, { title: oe, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          C ? /* @__PURE__ */ P(
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
            ji,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          /* @__PURE__ */ d(
            $i,
            {
              node: n,
              runningNode: s,
              onShowNodeDetail: c
            }
          ),
          /* @__PURE__ */ d(cn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "flow") {
    const C = un(s) || s?.status === "success";
    return /* @__PURE__ */ P(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${C ? "is-running" : ""}`,
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
          C ? /* @__PURE__ */ P(
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
          /* @__PURE__ */ P("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ d(_p, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ d(
              xi,
              {
                className: "ws-node-flow-title",
                title: n.title,
                onRename: a ? (oe) => a(n.id, { title: oe, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ d(
            tt,
            {
              id: "input-0",
              type: "target",
              position: et.Left,
              className: "is-in",
              style: { left: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            tt,
            {
              id: "output-0",
              type: "source",
              position: et.Right,
              className: "is-out",
              style: { right: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            ji,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          /* @__PURE__ */ d($i, { node: n, onShowNodeDetail: c }),
          /* @__PURE__ */ d(cn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "function") {
    const C = n.functionOption?.key || (n.title.includes("保存") ? "save" : ""), oe = C === "start", { onRunFunctionNode: B, requestConfirm: z } = n, j = un(s), G = oe && n.canvasHasRunningNode, ce = j, Ne = ac(n), de = Ne ? { left: "0px", top: "19px" } : { left: "0px" }, Ce = Ne ? { left: "128px", right: "auto", top: "19px" } : { right: "0px" }, ze = (ke) => {
      i((Rt) => ({
        ...Rt,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: ke === "success" ? 100 : ke === "error" ? 92 : 0,
          status: ke
        }
      })), ke !== "running" && ke !== "waiting" && window.setTimeout(
        () => i((Rt) => So(Rt, n.id)),
        ke === "success" ? 650 : 1200
      );
    }, me = () => {
      const ke = !oe;
      ke && ze("running"), B(n).then(() => {
        ke && ze("success");
      }).catch((Rt) => {
        ke && ze("error"), L.error(Rt instanceof Error ? Rt.message : "执行出错");
      });
    }, le = () => {
      if (!(ce || G)) {
        if (kN(n)) {
          z({
            title: `执行「${n.title}」`,
            description: TN(n),
            confirmText: "执行",
            onConfirm: me
          });
          return;
        }
        me();
      }
    }, dt = (ke) => {
      ke.preventDefault(), ke.stopPropagation(), le();
    };
    return /* @__PURE__ */ P(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${ce ? "is-running" : ""} ${Ne ? "has-result-card" : ""} is-${C || "default"}`,
        children: [
          /* @__PURE__ */ P(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": ce || G,
              onClick: dt,
              onKeyDown: (ke) => {
                ke.key !== "Enter" && ke.key !== " " || (ke.preventDefault(), ke.stopPropagation(), le());
              },
              children: [
                /* @__PURE__ */ d("div", { className: "ws-node-function-icon", children: j ? /* @__PURE__ */ d(fn, { size: 15, className: "ws-spin" }) : uN(C, oe) }),
                /* @__PURE__ */ d("span", { className: "ws-node-function-title", children: j ? s?.status === "waiting" ? "等待中" : "运行中" : n.title })
              ]
            }
          ),
          Ne ? /* @__PURE__ */ d(
            hN,
            {
              node: n,
              running: ce,
              onShowNodeDetail: c
            }
          ) : null,
          /* @__PURE__ */ d(
            tt,
            {
              id: "input-0",
              type: "target",
              position: et.Left,
              className: "is-in",
              style: de
            }
          ),
          /* @__PURE__ */ d(
            tt,
            {
              id: "output-0",
              type: "source",
              position: et.Right,
              className: "is-out",
              style: Ce
            }
          ),
          /* @__PURE__ */ d(
            ji,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          Ne ? null : /* @__PURE__ */ d($i, { node: n, onShowNodeDetail: c }),
          /* @__PURE__ */ d(cn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "asset") {
    if (n.kind === "image") {
      const de = hs(n), Ce = Pn(n), ze = zr(Ce, de), me = ws(n, a), le = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        de.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ P("div", { className: le, children: [
        /* @__PURE__ */ P("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(fc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "图片资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-image-container ws-node-content-container", children: ze ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          Br,
          {
            output: Ce,
            fallback: de.text || n.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : de.imageUrl ? /* @__PURE__ */ d(
          ya,
          {
            src: de.imageUrl,
            alt: n.title,
            className: "ws-node-image-raw",
            onMediaSize: me
          }
        ) : /* @__PURE__ */ P("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(fc, { size: 24 }),
          /* @__PURE__ */ d("span", { children: de.text || n.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ d(
          tt,
          {
            id: "input-0",
            type: "target",
            position: et.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          tt,
          {
            id: "output-0",
            type: "source",
            position: et.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          _o,
          {
            node: n,
            onShowNodeDetail: c
          }
        ),
        /* @__PURE__ */ d(cn, { node: n, selected: t })
      ] });
    }
    if (n.kind === "video") {
      const de = hs(n), Ce = Pn(n), ze = zr(Ce, de), me = ws(n, a), le = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        de.videoUrl || de.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ P("div", { className: le, children: [
        /* @__PURE__ */ P("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(pc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "视频资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-video-container ws-node-content-container", children: ze ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          Br,
          {
            output: Ce,
            fallback: de.text || n.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : de.videoUrl ? /* @__PURE__ */ d(
          _s,
          {
            src: de.videoUrl,
            poster: de.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: n.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            onMediaSize: me
          },
          de.videoUrl
        ) : de.imageUrl ? /* @__PURE__ */ d(
          ya,
          {
            src: de.imageUrl,
            alt: n.title,
            className: "ws-node-video-raw",
            onMediaSize: me
          }
        ) : /* @__PURE__ */ P("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(pc, { size: 24 }),
          /* @__PURE__ */ d("span", { children: de.text || n.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ d(
          tt,
          {
            id: "input-0",
            type: "target",
            position: et.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          tt,
          {
            id: "output-0",
            type: "source",
            position: et.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          _o,
          {
            node: n,
            onShowNodeDetail: c
          }
        ),
        /* @__PURE__ */ d(cn, { node: n, selected: t })
      ] });
    }
    const C = hs(n), oe = ic(n), B = Pn(n), z = Qa(n), j = Ue(B) ? B : oe ? { rich: oe } : z || C.text, G = zr(j, C), ce = !!(C.imageUrl || C.videoUrl || C.audioUrl), Ne = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      ce ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ P("div", { className: Ne, children: [
      /* @__PURE__ */ P("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(bp, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ d("span", { children: n.title })
      ] }),
      /* @__PURE__ */ d("div", { className: "ws-node-text-card", children: !G && C.imageUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        "img",
        {
          src: C.imageUrl,
          alt: Vr(C) || n.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !G && C.videoUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        _s,
        {
          src: C.videoUrl,
          poster: C.videoPosterUrl,
          ariaLabel: Vr(C) || n.title,
          objectFit: "cover",
          allowDragFromVideo: !0
        },
        C.videoUrl
      ) }) : !G && C.audioUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ d(
        je,
        {
          fallback: /* @__PURE__ */ d(Le, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ d(Gd, { src: C.audioUrl })
        }
      ) }) : !G && C.fileUrl ? /* @__PURE__ */ P("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ d(ba, { size: 16 }),
        /* @__PURE__ */ d("span", { children: Vr(C) || "文件内容" })
      ] }) : /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
        Br,
        {
          output: j,
          fallback: z || C.text || "暂无内容",
          mediaGridKind: Bo(C),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ d(
        tt,
        {
          id: "input-0",
          type: "target",
          position: et.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        tt,
        {
          id: "output-0",
          type: "source",
          position: et.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ d(
        _o,
        {
          node: n,
          onShowNodeDetail: c
        }
      ),
      /* @__PURE__ */ d(cn, { node: n, selected: t })
    ] });
  }
  if (n.type === "power") {
    const C = un(s), oe = xa(n.power, n.kind), B = X ? Ra(
      C ? [s?.streamOutput, zi(n)] : zi(n)
    ) : null, z = Ut(n), j = C ? "running" : s?.status === "error" ? "error" : s?.status === "success" && !z ? "running" : z ? "complete" : "empty", G = !!(!te && !X && !ie && s?.streamStarted && (s.streamText || s.streamOutput) && s.status !== "success"), ce = G ? s?.streamOutput ? Un(s.streamOutput, "audio") : {
      text: s?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : hr(n), Ne = G ? s?.streamOutput || { text: s?.streamText || "" } : Pn(n), de = te || X || ie || G || z, Ce = !te && !X && !ie && !!(ce.imageUrl || ce.videoUrl || ce.audioUrl || ce.fileUrl), ze = ws(n, a), me = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      C ? "is-running" : "",
      n.runError && !C ? "is-error" : "",
      te ? "is-storyboard" : "",
      X ? "is-storyboard-grid" : "",
      ie ? "is-video-compose" : "",
      oe ? "is-audio" : "",
      de ? "has-content" : "",
      Ce ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ P("div", { className: me, children: [
      /* @__PURE__ */ P("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(
          nm,
          {
            power: n.power,
            kind: n.kind,
            outputType: n.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ d(
          xi,
          {
            title: n.title,
            onRename: a && !E ? (le) => a(n.id, { title: le, titleMode: "manual" }) : void 0
          }
        ),
        tl(n) ? /* @__PURE__ */ d("span", { className: "ws-node-prompt-override-badge", children: "提示词已修改" }) : null
      ] }),
      /* @__PURE__ */ P("div", { className: "ws-node-power-card", children: [
        C ? /* @__PURE__ */ P("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
        ie ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载视频合成" }),
            children: /* @__PURE__ */ d(
              X_,
              {
                composition: n.composerDraft?.videoComposition,
                referenceItems: u.filter(
                  (le) => le.source !== "current" || le.id !== n.id
                ),
                connectedMediaReferences: h,
                running: C,
                onChange: N ? (le) => N(n.id, {
                  ...n.composerDraft || {},
                  videoComposition: le
                }) : void 0,
                onConnectedMediaEdgeRemove: v,
                onRun: R ? (le) => {
                  R({
                    ...n,
                    composerDraft: {
                      ...n.composerDraft || {},
                      videoComposition: le
                    }
                  }).catch(
                    (dt) => L.error(
                      dt instanceof Error ? dt.message : "视频合成失败"
                    )
                  );
                } : void 0,
                onOpenDetail: c ? () => c(n) : void 0
              }
            )
          }
        ) : te ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载分镜内容", compact: !0 }),
            children: /* @__PURE__ */ d(
              W_,
              {
                output: C ? s?.streamText || "" : zi(n),
                status: j,
                started: !!s?.streamStarted,
                generatedShotCount: s?.generatedCount || 0,
                referenceItems: u.filter(
                  (le) => le.source !== "current" || le.id !== n.id
                ),
                onOpenDetail: z && c ? () => c(n) : void 0
              }
            )
          }
        ) : X ? /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载分镜宫格", compact: !0 }),
            children: /* @__PURE__ */ d(
              Xp,
              {
                grid: B,
                aspectRatio: VI(n),
                running: C,
                layout: n.composerDraft?.storyboardGridLayout,
                onLayoutChange: N ? (le) => N(n.id, {
                  ...n.composerDraft || {},
                  storyboardGridLayout: le
                }) : void 0,
                onImport: _ ? () => _(n.id) : void 0,
                onFrameImport: _ ? (le, dt) => _(n.id, dt) : void 0,
                onSlotImport: _ ? (le) => _(n.id, le) : void 0,
                onEdit: B && c ? () => c(n) : void 0
              }
            )
          }
        ) : de ? /* @__PURE__ */ d(
          xf,
          {
            preview: ce,
            output: Ne,
            fallback: n.description,
            streaming: C && G,
            generating: C && Ce && !G,
            videoObjectFit: "cover",
            onMediaSize: ze,
            compactMediaGrid: Cf(
              n,
              ce
            )
          }
        ) : /* @__PURE__ */ d(ON, {})
      ] }),
      n.runError && !C ? /* @__PURE__ */ d(
        EN,
        {
          projectId: o,
          node: n,
          onOpenDetail: c ? () => c(n) : void 0
        }
      ) : null,
      /* @__PURE__ */ d(
        tt,
        {
          id: "input-0",
          type: "target",
          position: et.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        tt,
        {
          id: "output-0",
          type: "source",
          position: et.Right,
          className: "is-out"
        }
      ),
      te || X || ie ? null : /* @__PURE__ */ d(
        _o,
        {
          node: n,
          onShowNodeDetail: c
        }
      ),
      /* @__PURE__ */ d(cn, { node: n, selected: t })
    ] });
  }
  return /* @__PURE__ */ P("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ d(
      tt,
      {
        id: "input-0",
        type: "target",
        position: et.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ d(
      tt,
      {
        id: "output-0",
        type: "source",
        position: et.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ d("div", { className: "ws-node-title", children: n.title }),
    /* @__PURE__ */ d("div", { className: "ws-node-desc", children: n.description }),
    /* @__PURE__ */ d(_o, { node: n, onShowNodeDetail: c }),
    /* @__PURE__ */ d(cn, { node: n, selected: t })
  ] });
}
function DN(e, t) {
  return PN(e.data, t.data) && e.selected === t.selected;
}
function PN(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && Nf(e.groupMembers, t.groupMembers) && QI(e.groupRuntime, t.groupRuntime) && e.canvasHasRunningNode === t.canvasHasRunningNode && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && e.storyboardFrameRunning === t.storyboardFrameRunning && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && HI(e.inputContext, t.inputContext);
}
function EN({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = h_(e, t), o = /* @__PURE__ */ P(ln, { children: [
    /* @__PURE__ */ d(Np, { size: 14 }),
    /* @__PURE__ */ d("span", { children: r })
  ] });
  return /* @__PURE__ */ d(Ve, { label: r, children: n ? /* @__PURE__ */ d(
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
function xf({
  preview: e,
  output: t,
  fallback: n,
  streaming: r,
  generating: o = !1,
  videoObjectFit: s = "contain",
  onMediaSize: i,
  showMediaCaption: c = !0,
  compactMediaGrid: a = !1
}) {
  const f = re(null), u = re(!0), h = c ? Vr(e) : "", v = zr(t, e), N = Bo(e), _ = !!(a && qd(t, N));
  return pe(() => {
    if (!r) {
      u.current = !0;
      return;
    }
    const R = f.current;
    !R || !u.current || (R.scrollTop = R.scrollHeight);
  }, [e.text, r]), !v && e.imageUrl ? /* @__PURE__ */ P(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          ya,
          {
            src: e.imageUrl,
            alt: h || "生成图片",
            onMediaSize: i
          }
        ),
        h ? /* @__PURE__ */ d("p", { children: h }) : null,
        /* @__PURE__ */ d(Li, { active: o })
      ]
    }
  ) : !v && e.videoUrl ? /* @__PURE__ */ P(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          _s,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            ariaLabel: h || "生成视频",
            objectFit: s,
            allowDragFromVideo: !0,
            onMediaSize: i
          },
          e.videoUrl
        ),
        h ? /* @__PURE__ */ d("p", { children: h }) : null,
        /* @__PURE__ */ d(Li, { active: o })
      ]
    }
  ) : !v && e.audioUrl ? /* @__PURE__ */ P(
    "div",
    {
      className: `ws-node-generated-media is-audio ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          je,
          {
            fallback: /* @__PURE__ */ d(Le, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ d(Gd, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ d(Li, { active: o })
      ]
    }
  ) : !v && e.fileUrl ? /* @__PURE__ */ P("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ d(ba, { size: 16 }),
    /* @__PURE__ */ d("span", { children: h || "文件内容" })
  ] }) : /* @__PURE__ */ d(
    "div",
    {
      ref: f,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${_ ? "is-compact-media-grid" : ""}`,
      onScroll: (R) => {
        const E = R.currentTarget;
        u.current = E.scrollHeight - E.scrollTop - E.clientHeight < 12;
      },
      children: /* @__PURE__ */ d(
        Br,
        {
          output: t,
          fallback: e.text || n,
          streaming: r,
          mediaGridKind: N,
          compactMediaGrid: _,
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function ya({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [o, s] = V(e);
  return pe(() => {
    if (!e || e === o)
      return;
    let i = !0;
    const c = new Image();
    return c.onload = () => {
      (c.decode?.() || Promise.resolve()).catch(() => {
      }).then(() => {
        i && s(e);
      });
    }, c.src = e, () => {
      i = !1, c.onload = null;
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
function Li({ active: e }) {
  return e ? /* @__PURE__ */ P(
    "div",
    {
      className: "ws-node-media-generating nodrag nopan nowheel",
      role: "status",
      "aria-live": "polite",
      onPointerDown: (t) => t.stopPropagation(),
      onClick: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ d(fn, { size: 18, className: "ws-spin" }),
        /* @__PURE__ */ d("span", { children: "生成中" })
      ]
    }
  ) : null;
}
function Vr(e) {
  const t = String(e.text || "").trim();
  return !t || mn(t) ? "" : t;
}
function FN(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, o = 340;
  let s = r, i = s / n;
  return i > o && (i = o, s = i * n), {
    width: Math.round(bd(s, 150, r)),
    height: Math.round(bd(i, 150, o))
  };
}
function ws(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, o) => {
      const s = FN(r, o);
      if (!s)
        return;
      const i = {
        width: s.width,
        height: s.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function bd(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function ON() {
  return /* @__PURE__ */ P("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {})
  ] });
}
function zN(e) {
  return e.type === "storyboardFrame" ? "ws-minimap-storyboard-frame" : "";
}
function BN(e) {
  return e.type === "storyboardFrame" ? "transparent" : $N(e.data);
}
function $N(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function jN() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function LN() {
  return typeof window > "u" ? 0 : Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0
  );
}
function Er(e) {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  e > 0 ? t.searchParams.set("canvas_id", String(e)) : t.searchParams.delete("canvas_id"), window.history.replaceState(window.history.state, "", t);
}
function VN(e) {
  if (typeof window > "u")
    return !1;
  try {
    return tb(
      window.localStorage.getItem(
        `${El}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function UN() {
  if (typeof window > "u")
    return ys;
  try {
    return Fl(
      Number(
        window.localStorage.getItem(Pl) || ys
      )
    );
  } catch {
    return ys;
  }
}
function Id(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
const wv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: Vb
}, Symbol.toStringTag, { value: "Module" }));
export {
  xg as A,
  vc as B,
  Le as C,
  un as D,
  hv as E,
  za as F,
  Ah as G,
  dr as H,
  wv as I,
  bm as V,
  Fl as a,
  lu as b,
  qm as c,
  ar as d,
  Da as e,
  sv as f,
  ry as g,
  nh as h,
  du as i,
  mv as j,
  lv as k,
  fv as l,
  Fn as m,
  pv as n,
  yv as o,
  gv as p,
  uv as q,
  Hy as r,
  ly as s,
  ov as t,
  h_ as u,
  cv as v,
  iv as w,
  av as x,
  Im as y,
  dv as z
};
