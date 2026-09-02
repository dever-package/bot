import { a as E, j as d, F as Nn, u as Qf } from "./runtime-entry-9YhLBCWA.js";
import { d as ne, a as j, b as pe, e as A, m as xa, u as le, S as Fe, g as Qi } from "./_commonjsHelpers-C76sftkf.js";
import { h as ht, c as Wt, d as ep } from "./preloadable-BSZIYdQl.js";
import { a as to, N as tp, w as np, n as rp, g as op, B as Nc, E as sp, b as ip, c as ap, i as cp, M as dp, P as Ze, H as up } from "./normalize-BPDqImdR.js";
import { k as ka, q as Pd, s as lp, z as fp, h as pp, m as mp, aZ as gp, a_ as Ed, x as yp, ay as Fd, P as Od, L as ea, c as zd, J as hp, r as Sn, j as qs, w as wp, Q as Bd, a$ as _p, p as bp, i as Ip, C as Ta, b as Aa, aW as Np, X as $d, A as Sp, aj as vp, b0 as Cp, b1 as Rp, aT as xp, b2 as kp, l as Tp, W as Ap, a9 as Sc, a8 as vc, ac as Mp, b3 as Dp, e as jd, v as Pp } from "./vendor-icons-DgDZMD4Q.js";
import { t as U } from "./index-GiccNT9P.js";
import { p as no, s as He, q as Ep } from "./site-config-CnYw1vhW.js";
import { u as Fp } from "./use-body-appearance-CTGiTRxB.js";
import { ah as Pt, ai as P, aj as Ie, ak as Ld, al as Vd, am as Ud, an as nt, ao as Zr, ap as Ma, aq as Cc, ar as Kd, as as Nt, at as qd, au as Gd, $ as Da, av as Hd, _ as Pa, aw as Op, ax as zp, B as ze, ay as Wd, az as Bp, aA as Me, aB as $p, T as Yd, R as jp, Q as Lp, P as Vp, O as Up, aC as Jr, aD as Kp, aE as Xd, d as qp, aF as Gp, a1 as Ea, aG as Zd, aH as Sr, S as Fa, aI as Hp, b as jo, f as Wp, e as Yp, U as Xp, ac as Zp, aJ as Jd, aK as ps, p as Lo, i as Jp, aL as Qp, X as Qd, aM as eu, aN as tu, aO as Rc, aP as qr, C as Gr, aQ as Vo, aR as xs, aS as em, aT as tm, l as nm, aU as vt, aV as hr, aW as Mo, aX as Be, aY as nu, aZ as ta, a_ as rm, a$ as om, b0 as ms, b1 as wr, v as sm, b2 as Oa, b3 as ks, b4 as ru, A as ou, b5 as im, m as am, b6 as cm } from "./upload-asset-api-BHoUDUjk.js";
import { a as Uo, r as Wn, n as dm, e as za, g as um, i as lm, P as fm } from "./power-icon-Bx5F2rhr.js";
import { l as pm, p as mm, k as gm, d as su, o as ym, u as iu, w as au, c as hm, n as wm } from "./interaction-BSPeVZBK.js";
import { K as _m, o as bm, L as Ba, M as Im, N as cu, O as du, n as xc, Q as $a, y as uu, z as Nm, A as Sm, C as vm, B as lu, R as Cm } from "./space-sequence-card-BuVDhSHD.js";
import "./media-inspector-gallery-DkVtDPR_.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-CBs9fsl0.css", import.meta.url).href]);
function dn(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function fu(e) {
  return dn(e) === "media";
}
const Rm = { width: 720, height: 420 }, kc = { width: 360, height: 240 }, Tc = { width: 2400, height: 1600 }, pu = 48, Hr = 16;
function mu(e, t) {
  return e.filter((n) => n.groupId === t);
}
function gu(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? mu(e, n.id) : [n] : [];
}
function xm(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function km(e, t, n) {
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
function Ai(e, t, n) {
  const r = e.find((c) => c.id === t), o = r ? yu(e, r) : void 0;
  if (!r || !o)
    return n;
  const s = Ac(
    n.x,
    o.x + Hr,
    o.x + o.width - Hr - r.width
  ), i = Ac(
    n.y,
    o.y + pu,
    o.y + o.height - Hr - r.height
  );
  return s === n.x && i === n.y ? n : { x: s, y: i };
}
function na(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group" || yu(e, r))
    return e;
  const o = { ...r, ...n }, s = Tm(e, o);
  return (r.groupId || "") === s ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: s || void 0 } : i
  );
}
function Gt(e, t) {
  const n = new Map(e.map((s) => [s.id, s])), r = /* @__PURE__ */ new Set(), o = [];
  for (const s of t) {
    const i = s.logicalFrom || s.from, c = s.logicalTo || s.to, a = n.get(i), f = n.get(c);
    if (!a || !f)
      continue;
    const u = a.groupId !== f.groupId, h = u && a.type !== "group" && a.groupId ? a.groupId : a.id, S = u && f.type !== "group" && f.groupId ? f.groupId : f.id;
    if (!h || !S || h === S)
      continue;
    const N = `${i}\0${c}\0${dn(s)}`;
    r.has(N) || (r.add(N), o.push({ ...s, from: h, to: S, logicalFrom: i, logicalTo: c }));
  }
  return o;
}
function Tm(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.id !== t.id && n >= s.x + Hr && n <= s.x + s.width - Hr && r >= s.y + pu && r <= s.y + s.height - Hr
  ).sort(
    (s, i) => s.width * s.height - i.width * i.height
  )[0]?.id || "";
}
function yu(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (n) => n.id === t.groupId && n.type === "group" && n.group?.origin === "script"
    );
}
function Ac(e, t, n) {
  return Math.min(Math.max(e, t), Math.max(t, n));
}
const Am = [
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
function wS(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function _S() {
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
function hu(e) {
  const t = Pt(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(Dm).filter(Boolean) : [], r = Pt(t.settings), o = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(Om).filter(Boolean) : [];
  return {
    version: 3,
    clips: n,
    audioTracks: o,
    settings: {
      resolution: ke(r.resolution) || "auto",
      fps: vr(r.fps, 0, 120, 0)
    }
  };
}
function bS(e) {
  const t = e.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = e.clips.reduce((r, o, s) => s >= e.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function IS(e) {
  const t = e.clips.flatMap(
    (r, o) => r.blockingIssues.map(
      (s) => `${r.title || `镜头 ${o + 1}`}：${s}`
    )
  ), n = e.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function Mm(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function NS(e) {
  return e ? [
    Mm(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function Dm(e) {
  const t = Pt(e), n = ke(t.id);
  if (!n)
    return null;
  const r = Ts(
    t.visualVideo ?? t.visual_video
  ), o = Ts(
    t.originalAudioSource ?? t.original_audio_source
  ), s = Pt(
    t.transitionToNext ?? t.transition_to_next
  ), i = Pt(
    t.storyboardTransitionToNext ?? t.storyboard_transition_to_next
  ), c = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map(Fm).filter(Boolean) : [], a = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(Em).filter(Boolean) : [], f = Pm(i), u = _u(s.type), h = ke(t.sourceEdgeId ?? t.source_edge_id);
  return {
    id: n,
    title: ke(t.title) || r?.label || "镜头",
    ...h ? { sourceEdgeId: h } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: zm(t.duration),
    originalVolume: vr(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: c,
    subtitleTracks: a,
    useOriginalVideo: bu(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: $m(t.blockingIssues ?? t.blocking_issues),
    transitionToNext: {
      type: u,
      durationMs: u === "none" ? 0 : vr(
        s.durationMs ?? s.duration_ms,
        100,
        5e3,
        500
      )
    },
    ...f ? { storyboardTransitionToNext: f } : {}
  };
}
function Pm(e) {
  if (!Object.keys(e).length)
    return;
  const t = _u(e.type);
  return {
    type: t,
    durationMs: t === "none" ? 0 : vr(e.durationMs ?? e.duration_ms, 100, 5e3, 500)
  };
}
function Em(e) {
  const t = Pt(e), n = ke(t.id), r = ke(t.text);
  if (!n || !r)
    return null;
  const o = ke(t.source) === "speech" ? "speech" : "caption", s = ke(t.speechId ?? t.speech_id), i = P(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...s ? { speechId: s } : {},
    source: o
  };
}
function Fm(e) {
  const t = Pt(e), n = ke(t.id);
  if (!n)
    return null;
  const r = Ts(t.audio), o = ke(t.kind) === "narration" ? "narration" : "dialogue", s = ke(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    fit: wu(t.fit, "trim"),
    kind: o,
    ...s ? { characterId: s } : {},
    text: ke(t.text),
    volume: vr(t.volume, 0, 1, 1)
  };
}
function Om(e) {
  const t = Pt(e), n = ke(t.id);
  if (!n)
    return null;
  const r = Ts(t.audio), o = ke(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    kind: o,
    volume: vr(t.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: wu(t.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && bu(t.loop),
    fadeOut: vr(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function wu(e, t) {
  return ke(e) === "strict" ? "strict" : ke(e) === "trim" ? "trim" : t;
}
function zm(e) {
  const t = P(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Ts(e) {
  const t = Pt(e), n = P(t.assetId ?? t.asset_id), r = P(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const o = Bm(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: ke(t.label),
    ...P(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: P(t.mediaIndex ?? t.media_index) } : {},
    ...ke(t.mediaUrl ?? t.media_url) ? { mediaUrl: ke(t.mediaUrl ?? t.media_url) } : {},
    ...ke(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: ke(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function Bm(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Pt(r), s = ke(o.url), i = P(o.index);
    if (!s && i <= 0)
      continue;
    const c = i > 0 ? `index:${i}` : `url:${s}`;
    n.has(c) || (n.add(c), t.push({
      url: s,
      index: i > 0 ? i : 0,
      ...ke(o.usage) ? { usage: ke(o.usage) } : {}
    }));
  }
  return t;
}
function _u(e) {
  const t = ke(e);
  return Am.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function ke(e) {
  return String(e ?? "").trim();
}
function $m(e) {
  return Array.isArray(e) ? e.map(ke).filter(Boolean) : [];
}
function vr(e, t, n, r) {
  const o = Number(e);
  return Number.isFinite(o) ? Math.min(n, Math.max(t, o)) : r;
}
function bu(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
function $n(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function Qr(e) {
  const t = String(e.status || "").trim();
  if (!t)
    return !1;
  const n = to(t);
  return n === "pending" || n === "running" || n === "waiting";
}
function vn(e) {
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
    status: to(e?.status || n.status),
    error: Cn(e?.error || n.error),
    executed: Number(e?.executed || e?.output?.executed || 0),
    total: Number(e?.total || e?.output?.total || 0),
    single_node: !!e?.single_node,
    created_at: String(e?.created_at || ""),
    updated_at: String(e?.updated_at || ""),
    title: String(e?.title || ""),
    output: e?.output || n.output,
    approvals: Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [],
    interactions: Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [],
    node_results: Iu(
      e?.node_results || t.node_results
    ),
    pending_node: ja(
      e?.pending_node || t.pending_node
    ),
    execution_plan: Km(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(Hm).filter((r) => !!r) : []
  };
}
function ja(e) {
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
    status: to(e.status),
    error: Cn(e.error),
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
function Iu(e) {
  return Array.isArray(e) ? e.map(ja).filter((t) => !!t) : [];
}
function jm(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = Iu(e.node_results), o = n ? r.find((s) => s.node_key === n) : r[0];
  return o || ja(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function La(e) {
  return e ? Cu(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function Nu(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => to(
    n.status || n.result?.status
  ) === "fail");
  return Cu(
    La(t),
    e.output?.error,
    e.error
  );
}
function Lm(e, t = "节点运行失败") {
  return Va(
    La(e),
    t
  );
}
function Su(e, t = "画布运行失败") {
  return Va(Nu(e), t);
}
function Va(e, t = "运行失败") {
  const n = Cn(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function Vm(...e) {
  for (const t of e) {
    const n = Cn(t);
    if (n)
      return n;
  }
  return "";
}
const vu = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function Um(e) {
  return vu.has(Cn(e));
}
function Co(e) {
  const t = Cn(e);
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function Cu(...e) {
  let t = "";
  for (const n of e) {
    const r = Cn(n);
    if (r && (t ||= r, !vu.has(r)))
      return r;
  }
  return t;
}
function Cn(e) {
  if (typeof e == "string")
    return e.trim();
  if (e instanceof Error)
    return e.message.trim();
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e, n = Vm(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = Cn(t.code), o = Cn(t.detail);
  return [r, o].filter(Boolean).join(": ");
}
function Km(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(qm).filter((r) => !!r) : [], n = Array.isArray(e.edges) ? e.edges.map(Gm).filter((r) => !!r) : [];
  return {
    nodes: t,
    edges: n,
    incoming: Mc(e.incoming),
    outgoing: Mc(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function qm(e) {
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
function Gm(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function Mc(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const o = Array.isArray(r) ? r.map((s) => String(s || "")).filter(Boolean) : [];
    t.set(String(n), o);
  }
  return t;
}
function Hm(e) {
  const t = String(e?.node_key || ""), n = Number(e?.node_run_id || 0);
  return !t || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(e?.node_id || 0),
    node_key: t,
    node_type: String(e?.node_type || ""),
    status: to(e?.status),
    persists_result: !!e?.persists_result
  };
}
const _s = "primary_text", Wm = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), Ym = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), ro = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function Xm(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = String(r.key || "").trim(), s = String(r.type || "").trim().toLowerCase(), i = String(r.value_type || "string").trim().toLowerCase();
    !o || ro.has(o) || t.has(o) || !Wm.has(s) || i === "number" || (t.add(o), n.push(o === r.key ? r : { ...r, key: o }));
  }
  return n;
}
function Ru(e, t, n) {
  const r = n.trim(), o = Yn(t?.paramBindings);
  return Xm(e).filter(
    (s) => ku(o, s.key, r)
  );
}
function Zm(e, t, n) {
  return ku(
    Yn(e?.paramBindings),
    t,
    n
  );
}
function Jm(e) {
  if (e.length !== 1)
    return;
  const t = e[0], n = String(t.key || "").trim();
  return n && !ro.has(n) ? n : void 0;
}
function ra(e) {
  const t = Jm(e);
  return t ? { kind: "automatic", targetParamKey: t } : e.length > 1 ? { kind: "choose", params: e } : { kind: "unavailable" };
}
function Qm(e, t, n = !1) {
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
function eg(e, t, n) {
  const r = Yn(t?.paramBindings), o = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), s = [
    ...new Set(e.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !o.has(a));
  if (s.length !== 1)
    return;
  const i = s[0], c = ra(
    Ru(n, t, i)
  );
  return c.kind === "automatic" ? { sourceNodeId: i, targetParamKey: c.targetParamKey } : void 0;
}
function tg(e) {
  return oa(e.type) === "prompt" || oa(e.key) === "prompt" ? "提示词" : String(e.name || "").trim() || "文本参数";
}
function Br(e) {
  return e ? e.type === "agent" ? !0 : e.type === "power" ? Di(e.power?.kind, e.kind, e.outputType) : e.type === "asset" ? Di(e.asset?.kind, e.kind, e.outputType) : Di(e.kind, e.outputType) : !1;
}
function gs(e) {
  return !!(e?.type === "power" && e.composerDraft?.storyboardWorkType === "mv" && Uo(e.power, e.kind, e.outputType));
}
function Yn(e) {
  const t = Dc(e), n = [];
  for (const [r, o] of Object.entries(t)) {
    const s = r.trim(), i = Dc(o), c = String(
      i.sourceNodeId ?? i.source_node_id ?? ""
    ).trim(), a = String(
      i.sourceOutput ?? i.source_output ?? _s
    ).trim().toLowerCase();
    !s || ro.has(s) || !c || a !== _s || n.push([
      s,
      {
        sourceNodeId: c,
        sourceOutput: _s
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function ng(e) {
  const t = Yn(e);
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
function rg(e, t, n) {
  const r = t.trim(), o = n.trim();
  return !r || ro.has(r) || !o ? e : {
    ...e,
    paramBindings: {
      ...Yn(e.paramBindings) || {},
      [r]: {
        sourceNodeId: o,
        sourceOutput: _s
      }
    }
  };
}
function og(e, t, n) {
  const r = t.trim();
  if (!r)
    return e;
  const o = n.trim();
  return !o || ro.has(o) ? e : rg(
    As(e, r),
    o,
    r
  );
}
function sg(e, t, n = []) {
  const r = t.trim(), o = Yn(e?.paramBindings);
  if (!r || !o)
    return;
  const s = Object.entries(o).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (s.length === 0)
    return;
  const i = new Map(
    n.map((a) => [a.key.trim(), tg(a)])
  ), c = s.map(
    (a) => i.get(a) || "文本参数"
  );
  return {
    targetParamKeys: s,
    targetParamKey: s.length === 1 ? s[0] : void 0,
    label: c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`
  };
}
function Mi(e, t, n = []) {
  const r = t.trim();
  if (r && String(e?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const o = sg(e, r, n);
  return o ? { ...o, purpose: "param" } : void 0;
}
function ig(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = xu(e, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function xu(e, t) {
  const n = t.trim(), r = Yn(e.paramBindings);
  if (!n || !r)
    return e;
  const o = Object.fromEntries(
    Object.entries(r).filter(
      ([, s]) => s.sourceNodeId !== n
    )
  );
  return Object.keys(o).length === Object.keys(r).length ? e : cg(e, o);
}
function As(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = xu(e, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: o, ...s } = r;
  return s;
}
function ag(e, t) {
  if (t.size === 0)
    return e;
  let n = !1;
  const r = e.map((o) => {
    let s = o.composerDraft;
    if (!s?.paramBindings && !s?.storyboardLyricsSourceNodeId)
      return o;
    for (const i of t)
      s = As(s, i);
    return s === o.composerDraft ? o : (n = !0, { ...o, composerDraft: s });
  });
  return n ? r : e;
}
function oa(e) {
  return String(e || "").trim().toLowerCase();
}
function Di(...e) {
  const t = e.map(oa).find(Boolean) || "";
  return Ym.has(t);
}
function cg(e, t) {
  const { paramBindings: n, ...r } = e;
  return Object.keys(t).length > 0 ? { ...r, paramBindings: t } : r;
}
function ku(e, t, n) {
  const r = t.trim(), o = n.trim();
  if (!r || ro.has(r) || !o)
    return !1;
  const s = e?.[r];
  return !s || s.sourceNodeId === o;
}
function Dc(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const sa = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, dg = { width: 180, height: 180 }, ug = { width: 240, height: 160 }, lg = { width: 620, height: 360 };
function fg(e) {
  const t = he(e);
  return {
    project: _g(t.project),
    team: bg(t.team),
    release: Ig(t.release),
    assetCates: Mt(t.asset_cates).map(Ng),
    flows: Mt(t.flows).map(vg),
    canvasList: Mt(t.canvas_list).map(Gs),
    canvases: Rg(t.canvas),
    assets: Mt(he(t.assets).items).map(Ou),
    assistant: pg(t.assistant),
    initialCanvasId: P(t.active_canvas_id),
    initialAssetCateId: P(t.active_asset_cate_id)
  };
}
function Gs(e) {
  const t = he(e);
  return {
    id: P(t.id),
    projectId: P(t.project_id),
    assetCateId: P(t.asset_cate_id),
    name: x(t.name) || "第一幕",
    sort: P(t.sort),
    status: P(t.status),
    updatedAt: x(t.updated_at),
    deletedAt: x(t.deleted_at)
  };
}
function pg(e) {
  const t = he(e);
  return {
    available: !!t.available,
    reason: x(t.reason),
    releaseID: P(t.release_id),
    roleID: P(t.role_id),
    roleType: x(t.role_type),
    name: x(t.name) || "画布助手",
    assignment: x(t.assignment),
    agentID: P(t.agent_id),
    agentKey: x(t.agent_key),
    contextKey: x(t.context_key),
    openingEnabled: !!t.opening_enabled
  };
}
function Pc(e, t = 0, n = "第一幕") {
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
function Ua(e, t = 0) {
  const n = he(e), r = P(
    Ie(n.asset_cate_id, t)
  );
  return Tu({
    id: P(n.id),
    name: x(n.name) || "第一幕",
    sort: P(n.sort),
    status: P(n.status) || 1,
    assetCateId: r,
    nextNodeNo: Math.max(1, P(n.next_node_no)),
    nodes: Mt(n.nodes).map(kg).filter((o) => !!o),
    edges: Mt(n.edges).map(Kg).filter((o) => !!o),
    viewport: qg(n.viewport),
    updatedAt: x(n.updated_at)
  });
}
function Tu(e) {
  let t = Ka(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((o) => {
    if (!Au(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const s = t++, i = o.titleMode || "manual";
    return n = !0, {
      ...o,
      nodeNo: s,
      titleMode: i,
      ...i === "auto" && !o.storyboardItem ? { title: Mu(o, s) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function Ka(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function Au(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function Mu(e, t) {
  let n = "节点";
  if (e.type === "power") {
    const r = Wn(
      e.power,
      e.kind,
      e.outputType
    );
    n = r.outputType !== "general" && r.outputName || r.kindName;
  } else e.type === "agent" ? n = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (n = String(e.flow?.name || "流程").trim() || "流程");
  return `${n}-${t}`;
}
function mg(e) {
  const t = he(e);
  return {
    roles: Mt(t.roles).map(Sg),
    powers: Mt(t.powers).map(Pu),
    powerCategories: Mt(t.power_cates).map(dm),
    powerKinds: Mt(t.power_kinds).map(Cg),
    outputTypes: Mt(t.output_types).map(Fu)
  };
}
function jn(e) {
  return Ou(he(e));
}
function Du(e) {
  return e.assetCates.length > 0 ? e.assetCates : [sa];
}
function gg(e) {
  return Du(e)[0]?.id ?? 0;
}
function ia(e, t) {
  const n = e.length > 0 ? e : [sa];
  return n.find((r) => r.id === t) || n[0] || sa;
}
function Pi(e, t) {
  return ia(e.assetCates, t);
}
function yg(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => Gg(n).has(t)).slice(0, 4);
}
function hg(e) {
  return e.create_status !== 2;
}
function wg(e) {
  return e.createStatus !== 2;
}
function Hs(e, t, n, r, o) {
  const s = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, c = o?.asset, a = o?.flow, f = o?.functionOption, u = o?.power, h = o?.role, S = u ? Wn(u) : null, N = Number(c?.asset_cate_id || t.id), b = {
    asset: [
      c?.name || "资产引用",
      c ? Cc(c.kind) : Cc(t.kind),
      c && Kd(c.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      u?.name || Hg(t.kind),
      S?.outputName || S?.kindName || "能力节点",
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
  }, [C, F, q] = b[e], X = Bu(e, u);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: C,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: F,
    description: q,
    x: s,
    y: i,
    width: X.width,
    height: X.height,
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
function _g(e) {
  const t = he(e), n = he(t.team);
  return {
    id: P(t.id),
    body_id: P(t.body_id),
    team_id: P(t.team_id),
    release_id: P(t.release_id),
    name: x(t.name) || "未命名作品",
    description: x(t.description),
    mode: x(t.mode) || "team",
    team: {
      id: P(n.id),
      name: x(n.name),
      version: P(n.version)
    }
  };
}
function bg(e) {
  const t = he(e);
  return {
    id: P(t.id),
    name: x(t.name) || "自由团队",
    description: x(t.description)
  };
}
function Ig(e) {
  const t = he(e);
  return {
    id: P(t.id),
    team_id: P(t.team_id),
    version: P(t.version),
    status: x(t.status)
  };
}
function Ng(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    name: x(e.name) || "未命名资产",
    kind: x(e.kind) || "text",
    cardinality: x(e.cardinality) || "single",
    status: P(e.status),
    sort: P(e.sort)
  };
}
function Sg(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    role_type: x(e.role_type),
    role_key: x(e.role_key),
    name: x(e.name),
    agent_id: P(e.agent_id),
    assignment: x(e.assignment),
    create_status: Eu(e.create_status)
  };
}
function vg(e) {
  return {
    id: P(e.id),
    name: x(e.name),
    key: x(e.key),
    goal: x(e.goal),
    config: he(e.config),
    status: P(e.status),
    sort: P(e.sort),
    output_asset_cate_ids: ju(e.output_asset_cate_ids)
  };
}
function Pu(e) {
  const t = x(e.kind) || "text", n = Fu(he(e.output)), r = x(e.output_type) || "general";
  return {
    id: P(e.id),
    cate_id: P(e.cate_id),
    name: x(e.name) || x(e.key) || "未命名能力",
    key: x(e.key),
    icon: x(e.icon),
    description: x(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: Eu(e.create_status)
  };
}
function Eu(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Fu(e) {
  return {
    key: x(e.key),
    name: x(e.name),
    allowedKinds: bs(e.allowed_kinds),
    viewMode: x(e.view_mode),
    defaultWidth: P(e.default_width),
    defaultHeight: P(e.default_height),
    structured: !!e.structured,
    sort: P(e.sort)
  };
}
function Cg(e) {
  return {
    id: x(e.id),
    value: x(e.value) || x(e.name) || x(e.id)
  };
}
function Ou(e) {
  const t = qa(he(e.version)), n = Ga(e.versions);
  return {
    id: P(e.id),
    project_id: P(Ie(e.project_id, e.projectID)),
    body_id: P(Ie(e.body_id, e.bodyID)),
    team_id: P(Ie(e.team_id, e.teamID)),
    flow_id: P(Ie(e.flow_id, e.flowID)),
    canvas_id: P(Ie(e.canvas_id, e.canvasID)),
    asset_cate_id: P(
      Ie(e.asset_cate_id, e.assetCateID)
    ),
    node_key: x(Ie(e.node_key, e.nodeKey)),
    name: x(e.name),
    kind: x(e.kind) || "text",
    role: x(e.role),
    version_id: P(Ie(e.version_id, e.versionID)),
    status: x(e.status),
    sort: P(e.sort),
    created_at: x(Ie(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function qa(e) {
  const t = P(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: P(Ie(e.asset_id, e.assetID)),
      run_id: P(Ie(e.run_id, e.runID)),
      node_run_id: P(Ie(e.node_run_id, e.nodeRunID)),
      release_id: P(Ie(e.release_id, e.releaseID)),
      request_id: x(Ie(e.request_id, e.requestID)),
      node_key: x(Ie(e.node_key, e.nodeKey)),
      source: he(e.source),
      version: P(e.version),
      summary: x(e.summary),
      content: e.content,
      created_at: x(Ie(e.created_at, e.createdAt)),
      updated_at: x(Ie(e.updated_at, e.updatedAt))
    };
}
function Ga(e) {
  return Mt(e).map(qa).filter((t) => !!t);
}
function Rg(e) {
  const t = he(e), n = {};
  for (const [r, o] of Object.entries(t)) {
    const s = Ua(o), i = s.id || P(r);
    i > 0 && (n[String(i)] = { ...s, id: i });
  }
  return n;
}
function xg(e, t) {
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
function $r(e, t) {
  const n = String(e.id);
  return xg({ [n]: e }, t)[n];
}
function kg(e) {
  const t = x(e.id), n = x(e.type);
  if (!t || !n)
    return null;
  const r = x(e.run_error), o = Og(e.function_option), s = x(e.title), i = x(e.description), c = o?.key === "import", a = {
    id: t,
    nodeNo: P(e.node_no) || void 0,
    type: n,
    title: c && s === "导入" ? "引用" : s,
    titleMode: x(e.title_mode) === "manual" ? "manual" : x(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: x(e.subtitle),
    description: c && (!i || i === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : i,
    x: P(e.x),
    y: P(e.y),
    width: P(e.width),
    height: P(e.height),
    groupId: x(e.group_id),
    group: Ag(e.group),
    storyboardItem: Mg(e.storyboard_item),
    storyboardMaterializedSignature: x(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: Zr(
      e.storyboard_frame_plan_version
    ),
    assetCateId: P(e.asset_cate_id),
    outputType: x(e.output_type),
    count: e.count == null ? void 0 : P(e.count),
    functionOption: o,
    composerDraft: jg(e.composer_draft),
    resultRef: Ug(e.result_ref),
    resultOutput: e.result_output,
    resultView: Tg(e.result_view),
    runError: Co(r) ? "" : r,
    local: e.local !== !1
  }, f = x(e.kind), u = x(
    e.cardinality
  ), h = Dg(e.flow), S = Pg(e.role), N = Eg(e.asset), b = Fg(e.power);
  return f && (a.kind = f), u && (a.cardinality = u), h && (a.flow = h), S && (a.role = S), N && (a.asset = N), b && (a.power = b, a.outputType = a.outputType || b.outputType), a;
}
function Tg(e) {
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
function Ag(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return {
      origin: x(t.origin),
      sourceNodeId: x(t.source_node_id),
      syncKey: x(t.sync_key),
      layoutKey: x(t.layout_key)
    };
}
function Mg(e) {
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
      dependencyNodeIds: bs(t.dependency_node_ids),
      referenceNodeIds: bs(t.reference_node_ids),
      externalReferenceAssetIds: ju(t.external_reference_asset_ids),
      shotId: x(t.shot_id),
      shotImageMode: Pa(t.shot_image_mode),
      frameRole: Hd(t.frame_role),
      frameMediaItems: Da(t.frame_media_items),
      imageSequenceFrames: Gd(
        t.image_sequence_frames
      ),
      speechId: x(t.speech_id),
      speechIds: bs(t.speech_ids),
      characterId: x(t.character_id),
      speechKind: x(t.speech_kind),
      speakerMode: x(t.speaker_mode),
      startTime: Nt(t.start_time),
      shotDuration: Nt(t.shot_duration),
      requiredDurationValues: qd(
        t.required_duration_values
      ),
      continuityAnchor: x(t.continuity_anchor),
      optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true",
      sourceSignature: x(t.source_signature),
      resultSourceSignature: x(t.result_source_signature),
      stale: t.stale === !0 || t.stale === 1 || String(t.stale || "").toLowerCase() === "true"
    };
}
function Dg(e) {
  const t = he(e), n = P(t.id), r = x(t.key), o = x(t.name);
  if (!(!n && !r && !o))
    return {
      id: n,
      key: r,
      name: o,
      goal: x(t.goal)
    };
}
function Pg(e) {
  const t = he(e), n = P(t.id), r = x(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: x(t.role_type),
      agent_id: P(t.agent_id)
    };
}
function Eg(e) {
  const t = he(e), n = P(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: P(t.asset_cate_id),
      name: x(t.name),
      kind: x(t.kind),
      role: x(t.role),
      version_id: P(t.version_id),
      sort: 0
    };
}
function Fg(e) {
  const t = he(e), n = P(t.id), r = x(t.key);
  if (!(!n && !r))
    return Pu({
      ...t,
      id: n,
      key: r,
      name: x(t.name)
    });
}
function Og(e) {
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
function zu(e) {
  const t = he(e);
  if (!Object.keys(t).length)
    return;
  const n = x(t.storyboardGridLayout);
  return {
    prompt: x(t.prompt),
    promptContent: Vg(t.promptContent),
    paramValues: he(t.paramValues),
    paramBindings: Yn(t.paramBindings),
    selectedTargetId: P(t.selectedTargetId),
    videoComposition: hu(t.videoComposition),
    storyboardReferences: Ud(
      t.storyboardReferences
    ),
    storyboardWorkType: Lg(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: x(t.storyboardLyricsSourceNodeId),
    minShotDuration: Vd(t.minShotDuration),
    storyboardRangeStartMs: Fc(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: Fc(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: n ? Ld(n) : void 0,
    multiImageMode: $g(t.multiImageMode)
  };
}
function Ha(e) {
  return zu(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function zg(e) {
  const t = Ha(e), n = Bg(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function Ec(e) {
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
function SS(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function Bg(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function $g(e) {
  const t = x(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function jg(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return zu({
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
function Lg(e) {
  const t = x(e);
  return Ma(t) ? t : void 0;
}
function Fc(e, t) {
  const n = Nt(e);
  if (!(n == null || !Number.isInteger(n) || n < (t ? 0 : 1)))
    return n;
}
function Vg(e) {
  const t = he(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const o = he(r);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function Ug(e) {
  const t = he(e);
  if (Object.keys(t).length)
    return {
      run_id: P(t.run_id),
      request_id: x(t.request_id),
      flow_run_id: P(t.flow_run_id),
      node_run_id: P(t.node_run_id),
      asset_id: P(t.asset_id),
      version_id: P(t.version_id),
      release_id: P(t.release_id),
      role: x(t.role),
      status: x(t.status),
      updated_at: x(t.updated_at)
    };
}
function Kg(e) {
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
function qg(e) {
  const t = he(e), n = {};
  return t.x != null && (n.x = P(t.x)), t.y != null && (n.y = P(t.y)), t.zoom != null && (n.zoom = P(t.zoom)), n;
}
function Gg(e) {
  return new Set(e.output_asset_cate_ids);
}
function Hg(e) {
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
function Bu(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...Rm };
    case "power":
      return Ws(t);
    default:
      return { width: 250, height: 170 };
  }
}
function Ws(e) {
  if (za(e))
    return { ...ug };
  const t = Wg(e);
  return t || (Uo(e) ? { ...lg } : { ...dg });
}
function Wg(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function $u(e) {
  const t = Bu(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function bs(e) {
  return Array.isArray(e) ? e.map(x).filter(Boolean) : [];
}
function ju(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = P(r);
    !o || o <= 0 || n.has(o) || (n.add(o), t.push(o));
  }
  return t;
}
function Mt(e) {
  return Array.isArray(e) ? e.filter(nt) : [];
}
function he(e) {
  return nt(e) ? e : {};
}
function x(e) {
  return e == null ? "" : String(e).trim();
}
function Yg(e) {
  const t = new Map(e.nodes.map((o) => [o.id, o]));
  let n = !1;
  const r = e.nodes.map((o) => {
    const s = o.storyboardItem?.dependencyNodeIds || [];
    if (o.storyboardItem?.itemType !== "shot" || !o.storyboardItem.continuityAnchor || s.length !== 1)
      return o;
    const i = s[0], c = Xg(t.get(i)), a = (o.storyboardItem.referenceNodeIds || []).filter(
      (N) => N !== i
    ), f = o.composerDraft?.promptContent, u = f && {
      ...f,
      parts: f.parts.filter(
        (N) => N.type !== "reference" || N.ref_type !== "asset" || !c || Number(N.ref_id || 0) !== c
      )
    }, h = a.length !== (o.storyboardItem.referenceNodeIds || []).length, S = u?.parts.length !== f?.parts.length;
    return !h && !S ? o : (n = !0, {
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
function Xg(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function Lu(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(Zg),
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
function Zg(e) {
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
  if (vo(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), At(t, "group_id", e.groupId), e.group) {
    const i = {};
    At(i, "origin", e.group.origin), At(i, "source_node_id", e.group.sourceNodeId), At(i, "sync_key", e.group.syncKey), At(i, "layout_key", e.group.layoutKey), Object.keys(i).length > 0 && (t.group = i);
  }
  if (e.storyboardItem) {
    const i = e.storyboardItem, c = Pa(i.shotImageMode), a = Hd(i.frameRole), f = Da(
      i.frameMediaItems
    ), u = Gd(
      i.imageSequenceFrames
    ), h = qd(
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
        frame_media_items: f.map((S) => ({
          frame_role: S.frameRole,
          media_index: S.mediaIndex
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
  At(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), vo(
    t,
    "storyboard_frame_plan_version",
    Zr(e.storyboardFramePlanVersion)
  ), vo(t, "asset_cate_id", e.assetCateId), At(t, "kind", e.kind), At(t, "output_type", e.outputType), At(t, "cardinality", e.cardinality), vo(t, "count", e.count), e.flow && (t.flow = {
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
    output: ey(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = Qg(e.composerDraft);
  n && (t.composer_draft = n);
  const r = oy(e.resultRef);
  r && (t.result_ref = r), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && Vn(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = Jg(e.resultView);
  return s && (t.result_view = s), Co(e.runError) || At(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Jg(e) {
  if (!e)
    return;
  const t = Nt(e.width), n = Nt(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, o = Nt(e.offsetX), s = Nt(e.offsetY);
  return o != null && (r.offset_x = o), s != null && (r.offset_y = s), r;
}
function Qg(e) {
  if (!nt(e))
    return null;
  const t = {};
  At(t, "prompt", e.prompt);
  const n = ty(e.promptContent);
  n && Vn(n) && (t.prompt_content = n), vo(t, "selected_target_id", e.selectedTargetId);
  const r = ny(e.paramValues);
  r && (t.param_values = r);
  const o = ng(e.paramBindings);
  o && (t.param_bindings = o);
  const s = hu(e.videoComposition);
  s && Vn(s) && (t.video_composition = s);
  const i = Ud(
    e.storyboardReferences
  );
  i.length > 0 && Vn(i) && (t.storyboard_references = i), Ma(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), At(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const c = Vd(e.minShotDuration);
  c != null && (t.min_shot_duration = c);
  const a = Nt(e.storyboardRangeStartMs);
  a != null && Number.isInteger(a) && a >= 0 && (t.storyboard_range_start_ms = a);
  const f = Nt(e.storyboardRangeEndMs);
  return f != null && Number.isInteger(f) && f > 0 && (t.storyboard_range_end_ms = f), e.storyboardGridLayout && (t.storyboard_grid_layout = Ld(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function ey(e) {
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
function ty(e) {
  if (!(!nt(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function ny(e) {
  if (!nt(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    ry(r) || Vn(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function ry(e) {
  return nt(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function oy(e) {
  if (!nt(e))
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
    r != null && Vn(r) && (t[n] = r);
  }
  return Object.keys(t).length ? t : null;
}
function At(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n);
}
function vo(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Vn(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(Vn) : nt(e) ? Object.values(e).every(Vn) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Ms = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Ms || Object.keys(Ms).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ne = Ms.joinSiteApi, Se = Ms.request;
async function sy(e, t = 0, n = 0) {
  const r = await Se(Ne("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: n
  });
  return fg(
    no(r, "加载创作空间失败")
  );
}
async function bo(e) {
  const t = await Se(Ne("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), n = He(t, "加载分类画布失败"), r = n.assets || {}, o = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: Ua(n.canvas, e.assetCateId || 0),
    assets: o.map(jn),
    canvasList: Array.isArray(n.canvas_list) ? n.canvas_list.map(Gs) : []
  };
}
function Ko(e) {
  const t = nt(e) ? e : {}, n = nt(t.canvas) ? t.canvas : null;
  return {
    canvas: n && Array.isArray(n.nodes) ? Ua(n) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(Gs) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function iy(e) {
  const t = await Se(Ne("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return Ko(
    He(t, "创建画布失败")
  );
}
async function ay(e) {
  const t = await Se(Ne("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return Ko(
    He(t, "重命名画布失败")
  );
}
async function cy(e) {
  const t = await Se(
    Ne("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return Ko(
    He(t, "调整画布顺序失败")
  );
}
async function dy(e) {
  const t = await Se(Ne("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return Ko(
    He(t, "删除画布失败")
  );
}
async function uy(e) {
  const t = await Se(Ne("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = He(t, "加载已删除画布失败");
  return Array.isArray(n.items) ? n.items.map(Gs) : [];
}
async function ly(e) {
  const t = await Se(
    Ne("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return Ko(
    He(t, "恢复画布失败")
  );
}
async function fy(e) {
  const t = await Se(Ne("project/canvas_config"), "get", {
    project_id: e
  });
  return mg(
    no(t, "加载能力列表失败")
  );
}
async function py(e) {
  const t = await Se(
    Ne("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return Cy(
    no(t, "加载能力参数失败")
  );
}
async function my(e) {
  const t = await Se(
    Ne("workspace/canvas_execute"),
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
      canvas: Lu(Yg(e.canvas)),
      input: e.runInput || {}
    }
  );
  return He(t, "画布运行失败");
}
async function gy(e) {
  const t = await Se(
    Ne("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    }
  ), n = He(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function qo(e, t, n) {
  const r = He(e, t).asset;
  if (!r)
    throw new Error(n);
  return jn(r);
}
async function Ei(e) {
  const t = await Se(
    Ne("workspace/canvas_execution_list"),
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
  ), n = He(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function Vu(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), o = await Se(
    Ne("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    }
  );
  return He(o, "读取画布运行详情失败");
}
async function yy(e) {
  const t = await Se(Ne("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return no(t, "继续画布运行失败");
}
async function hy(e) {
  const t = await Se(Ne("run/status"), "get", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || "",
    view: "summary"
  });
  return no(t, "读取流程状态失败");
}
async function wy(e) {
  const t = await Se(Ne("run/stop"), "post", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || ""
  });
  return He(t, "停止画布运行失败");
}
async function _y(e, t) {
  const n = await Se(
    Ne("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), r = He(n, "停止全部画布运行失败");
  return {
    count: Number(r.count || 0),
    stoppedCount: Number(r.stopped_count || 0),
    failedCount: Number(r.failed_count || 0),
    items: Array.isArray(r.items) ? r.items : []
  };
}
async function by(e) {
  const t = await Se(Ne("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return no(t, "提交信息失败");
}
async function Iy(e) {
  const t = await Se(
    Ne("project/update_asset_version"),
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
  return qo(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function vS(e) {
  const t = await Se(
    Ne("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return qo(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function CS(e) {
  const t = await Se(
    Ne("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return qo(t, "确认分镜失败", "确认分镜结果为空");
}
async function RS(e) {
  const t = await Se(
    Ne("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return qo(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function xS(e) {
  const t = e.storyboard.shots.findIndex(
    (s) => s.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await Se(
    Ne("project/generate_storyboard_shot"),
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
  ), r = He(n, "生成镜头失败"), o = zp(r, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function kS(e) {
  const t = await Se(Ne("project/asset_detail"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    current_only: e.currentOnly ? 1 : 0
  }), n = He(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const o = Ga(n.versions);
  return {
    asset: jn(r),
    versions: o,
    versionTotal: Number(n.version_total || o.length),
    hasMore: !!n.has_more
  };
}
async function TS(e) {
  const t = await Se(Ne("project/asset_versions"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    page: e.page,
    page_size: e.pageSize || 20
  }), n = He(t, "读取资产版本失败"), r = Ga(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function AS(e) {
  const t = await Se(
    Ne("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    }
  ), n = He(t, "读取历史版本失败").version, r = qa(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function Ny(e) {
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
async function Uu(e, t) {
  const n = await Se(Ne("project/save_asset"), "post", {
    ...Ny(t),
    role: e
  });
  return qo(n, "保存资产失败", "保存资产结果为空");
}
function Sy(e) {
  return Uu("work", e);
}
function Oc(e) {
  return Uu("material", e);
}
async function vy(e) {
  const t = await Se(Ne("workspace/canvas"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId,
    base_revision: e.canvas.updatedAt || "",
    canvas: Lu(e.canvas)
  }), n = He(t, "保存画布失败");
  return {
    canvasId: Number(n.canvas_id || e.canvasId || 0),
    assetCateId: Number(n.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(n.updated_at || e.canvas.updatedAt || "")
  };
}
function Cy(e) {
  const t = nt(e) ? e : {}, n = nt(t.power) ? t.power : {}, r = nt(n.output) ? n.output : {}, o = Ty(
    t.storyboard_work_types
  ), s = Ay(
    t.storyboard_reference_purposes,
    o
  ), i = Op(
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
    sources: Ry(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: o,
    storyboard_reference_purposes: s,
    storyboard_min_shot_durations: i
  };
}
function Ry(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = nt(t) ? t : {}, r = nt(n.supported_options) ? Object.fromEntries(
      Object.entries(n.supported_options).map(([o, s]) => [o.trim(), Ro(s)]).filter(([o, s]) => o !== "" && s.length > 0)
    ) : void 0;
    return {
      ...n,
      supported_options: r && Object.keys(r).length > 0 ? r : void 0
    };
  }) : [];
}
const xy = /* @__PURE__ */ new Set(["image", "video", "audio"]), ky = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Ty(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = nt(n) ? n : {}, o = String(r.key || "").trim().toLowerCase();
    if (!Ma(o) || t.has(o))
      throw new Error("分镜作品类型注册信息无效");
    const s = Number(r.sort || 0);
    if (!Number.isInteger(s))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(o), {
      key: o,
      name: String(r.name || "").trim() || o,
      sort: s,
      required_reference_purposes: Ro(
        r.required_reference_purposes
      )
    };
  }).sort((n, r) => n.sort - r.sort);
}
function Ay(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((o) => o.key)), r = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const s = nt(o) ? o : {}, i = String(s.key || "").trim(), c = Ro(s.media_kinds), a = String(
      s.scope || ""
    ).trim(), f = Ro(
      s.work_types
    ), u = Ro(
      s.default_media_kinds
    ), h = String(s.material_type || "").trim(), S = Number(s.max_count || 0), N = Number(s.sort || 0);
    if (!i || r.has(i) || c.length === 0 || c.some(
      (b) => !xy.has(b)
    ) || !ky.has(a) || f.some((b) => !n.has(b)) || u.some((b) => !c.includes(b)) || a === "material" && h !== "character" && h !== "scene" && h !== "prop" || a !== "material" && h || !Number.isInteger(S) || S < 0 || !Number.isInteger(N))
      throw new Error("分镜参考用途注册信息无效");
    return r.add(i), {
      key: i,
      name: String(s.name || "").trim() || i,
      media_kinds: c,
      work_types: f,
      scope: a,
      material_type: h,
      default_media_kinds: u,
      max_count: S,
      sort: N
    };
  }).sort((o, s) => o.sort - s.sort);
}
function Ro(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const zc = 520, My = 8e3;
function Dy({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: o
}) {
  const s = ne(n), i = ne({}), c = ne({}), a = ne({}), f = ne(/* @__PURE__ */ new Map()), u = ne({}), h = ne(0), S = ne(null), [N, b] = j(0), [C, F] = j({});
  pe(() => {
    s.current = n;
  }, [n]);
  const q = A((z) => {
    const L = u.current[z];
    L != null && (window.clearTimeout(L), delete u.current[z]);
  }, []), X = A(
    (z, L = zc) => {
      if (!t || !e || typeof window > "u")
        return;
      q(z);
      const Y = h.current;
      u.current[z] = window.setTimeout(() => {
        delete u.current[z], S.current?.(z, Y)?.catch(() => {
        });
      }, L);
    },
    [q, t, e]
  ), ee = A(
    async (z, L, Y) => {
      if (L !== h.current || !t || !e)
        return;
      for (; f.current.has(z); )
        if (await f.current.get(z), L !== h.current)
          return;
      const ce = Y?.revision ?? i.current[z] ?? 0;
      if (ce <= (c.current[z] || 0))
        return;
      const ve = Y?.canvas || s.current[z];
      if (!ve)
        return;
      const de = (async () => {
        F((Re) => ({ ...Re, [z]: "saving" }));
        try {
          const Re = await vy({
            projectId: e,
            canvasId: ve.id,
            assetCateId: ve.assetCateId,
            canvas: ve
          });
          if (L !== h.current)
            return;
          c.current[z] = Math.max(
            c.current[z] || 0,
            ce
          ), a.current[z] = 0, (i.current[z] || 0) === ce ? (r((ye) => {
            const fe = ye[z], ct = Re.updatedAt || fe?.updatedAt;
            return !fe || fe.updatedAt === ct ? ye : {
              ...ye,
              [z]: { ...fe, updatedAt: ct }
            };
          }), F((ye) => ({
            ...ye,
            [z]: "saved"
          }))) : F((ye) => ({
            ...ye,
            [z]: "dirty"
          }));
        } catch (Re) {
          if (L !== h.current)
            return;
          const $e = (a.current[z] || 0) + 1;
          throw a.current[z] = $e, F((ye) => ({ ...ye, [z]: "error" })), $e === 1 && o(Re), X(
            z,
            Math.min(My, zc * 2 ** $e)
          ), Re;
        } finally {
          L === h.current && (i.current[z] || 0) > (c.current[z] || 0) && (a.current[z] || 0) === 0 && X(z);
        }
      })();
      f.current.set(z, de);
      try {
        await de;
      } finally {
        f.current.get(z) === de && f.current.delete(z);
      }
    },
    [t, o, e, X, r]
  );
  S.current = ee;
  const Z = A(
    async (z) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const L = String(z.id), Y = h.current, ce = (i.current[L] || 0) + 1;
      if (i.current[L] = ce, a.current[L] = 0, q(L), F((ve) => ({ ...ve, [L]: "dirty" })), await ee(L, Y, { canvas: z, revision: ce }), Y !== h.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [q, t, e, ee]
  ), se = A((z) => {
    const L = String(z);
    i.current[L] = (i.current[L] || 0) + 1, a.current[L] = 0, F((Y) => ({ ...Y, [L]: "dirty" })), b((Y) => Y + 1);
  }, []), M = A(
    (z) => {
      h.current += 1;
      for (const Y of Object.keys(u.current))
        q(Y);
      i.current = {}, c.current = {}, a.current = {}, f.current.clear();
      const L = {};
      for (const Y of Object.keys(z))
        L[Y] = "saved";
      F(L);
    },
    [q]
  ), ie = A(
    (z) => {
      const L = String(z.id);
      q(L);
      const Y = (i.current[L] || 0) + 1;
      i.current[L] = Y, c.current[L] = Y, a.current[L] = 0, F((ce) => ({ ...ce, [L]: "saved" }));
    },
    [q]
  ), D = A(
    (z) => {
      const L = String(z);
      q(L), delete i.current[L], delete c.current[L], delete a.current[L], F((Y) => {
        if (!Object.prototype.hasOwnProperty.call(Y, L))
          return Y;
        const ce = { ...Y };
        return delete ce[L], ce;
      });
    },
    [q]
  );
  return pe(() => {
    for (const [z, L] of Object.entries(i.current))
      L > (c.current[z] || 0) && X(z);
  }, [X, N]), pe(
    () => () => {
      h.current += 1;
      for (const z of Object.values(u.current))
        window.clearTimeout(z);
      u.current = {};
    },
    []
  ), {
    markCanvasDirty: se,
    flushCanvasSave: Z,
    adoptCanvasSnapshot: ie,
    forgetCanvasSnapshot: D,
    resetCanvasAutosave: M,
    canvasSaveStatus: C
  };
}
const Py = 6e4, Ey = 60;
class Fy {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = Oy(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, o = !1) {
    this.setScope(t, n);
    const s = this.scopeKey, i = this.catalogs.get(s) || { loadedAt: 0 };
    if (!o && i.value && Date.now() - i.loadedAt < Py)
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
    const r = this.scopeKey, o = zy(t), s = this.powerForms.get(o);
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
    for (; this.powerForms.size > Ey; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function Oy(e, t) {
  return `${e || 0}:${t || 0}`;
}
function zy(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function By(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function $y(e, t) {
  return String(t || "").trim() ? "" : String(e || "").trim();
}
function jy(e, t) {
  const n = new Set(t);
  return e.map(
    (r) => n.has(r.id) && r.runError ? { ...r, runError: "" } : r
  );
}
function Ly(e, t, n) {
  const r = new Map(t.map((a) => [a.id, a])), o = Vy(n), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
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
      (!u || !Ku(u)) && c(f);
    }
  };
  return c(e), [...s];
}
function Ku(e) {
  return e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Wa(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Vy(e) {
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
function Uy({
  members: e,
  hasResult: t
}) {
  const n = e.filter(Wa), r = n.filter(
    (o) => o.storyboardItem?.stale || !t(o)
  );
  return (r.length > 0 ? r : n).map(
    (o) => o.id
  );
}
function qu({
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
function Gu({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const o = e.filter(Wa), s = o.filter(
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
    status: Ky(n, i, f)
  };
}
function Ky(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function qy({
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
  return /* @__PURE__ */ E(Nn, { children: [
    /* @__PURE__ */ d("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ E(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (S) => S.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ E("button", { type: "button", onClick: f, children: [
            /* @__PURE__ */ d(ka, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "详情" })
          ] }) : null,
          o && u ? /* @__PURE__ */ E("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ d(Pd, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "编辑分镜" })
          ] }) : null,
          s && h ? /* @__PURE__ */ E("button", { type: "button", onClick: h, children: [
            /* @__PURE__ */ d(lp, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ E("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ d(fp, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ E("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ d(pp, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function Gy({
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
  onZoomChange: S,
  onOpenCanvasManager: N
}) {
  const b = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ E("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ d(ze, { label: b, children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: N,
        children: /* @__PURE__ */ d(mp, { size: 16 })
      }
    ) }),
    r ? /* @__PURE__ */ E(Nn, { children: [
      /* @__PURE__ */ d("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ d(ze, { label: o ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: o ? "is-active" : "",
          onClick: c,
          "aria-label": o ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ d(gp, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ d(ze, { label: s ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: a,
          "aria-label": s ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ d(Ed, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ d(ze, { label: "重置视图", children: /* @__PURE__ */ d("button", { type: "button", onClick: f, "aria-label": "重置视图", children: /* @__PURE__ */ d(yp, { size: 15 }) }) }),
      /* @__PURE__ */ E("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ d(ze, { label: "缩小", children: /* @__PURE__ */ d("button", { type: "button", onClick: h, "aria-label": "缩小", children: /* @__PURE__ */ d(Fd, { size: 15 }) }) }),
        /* @__PURE__ */ d(
          "input",
          {
            type: "range",
            min: "0.35",
            max: "1.45",
            step: "0.01",
            value: Math.max(0.35, Math.min(1.45, i)),
            onChange: (C) => S(Number(C.target.value)),
            "aria-label": "画布缩放"
          }
        ),
        /* @__PURE__ */ d(ze, { label: "放大", children: /* @__PURE__ */ d("button", { type: "button", onClick: u, "aria-label": "放大", children: /* @__PURE__ */ d(Od, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
function Hy(e, t, n) {
  return t && n?.interactionId === t ? n.nodes : e;
}
function Wy(e, t, n, r) {
  const o = n && e?.interactionId === n ? e.nodes : t;
  return {
    interactionId: n,
    nodes: typeof r == "function" ? r(o) : r
  };
}
function Yy(e, t) {
  const [n, r] = j(null), o = Hy(
    e,
    t,
    n
  ), s = A(
    (i) => {
      r(
        (c) => Wy(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: o, setFlowNodes: s };
}
function Xy(e, t) {
  return t && Ya(t.source, e) ? t.value : e;
}
function Bc(e, t, n) {
  return {
    source: t && Ya(t.source, e) ? t.source : e,
    value: n
  };
}
function Ya(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const Hu = [
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
], Ds = 140, Xa = 100, xo = 720, $c = { width: 280, height: 64 };
function Zy(e, t, n) {
  const r = Yu(n), o = e.find((s) => s.id === t);
  return !o || nh(o, r) ? e : e.map(
    (s) => s.id === t ? { ...s, ...r } : s
  );
}
function Jy(e, t, n) {
  const r = Do(n), o = e.find((s) => s.id === t);
  return !o || Ya(o.resultView, r) ? e : e.map(
    (s) => s.id === t ? { ...s, resultView: r } : s
  );
}
function Qy({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: o
}) {
  if (!t || !n || !o)
    return null;
  const s = e.type === "group", i = e.type === "power" && za(e.power, e.kind);
  return /* @__PURE__ */ d(Nn, { children: Hu.map((c) => /* @__PURE__ */ d(
    tp,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: s ? kc.width : i ? $c.width : Ds,
      minHeight: s ? kc.height : i ? $c.height : Xa,
      maxWidth: s ? Tc.width : xo,
      maxHeight: s ? Tc.height : xo,
      keepAspectRatio: !s && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (a, f) => o(e.id, Yu(f))
    },
    c.position
  )) });
}
function eh({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: o
}) {
  const s = ne(null);
  if (!t)
    return null;
  const i = (f, u) => {
    if (f.button !== 0)
      return;
    f.preventDefault(), f.stopPropagation();
    const h = Do(e), S = f.currentTarget.parentElement?.getBoundingClientRect().width || h.width;
    s.current = {
      pointerId: f.pointerId,
      startX: f.clientX,
      startY: f.clientY,
      startView: h,
      currentView: h,
      corner: u,
      scale: Math.max(0.01, S / h.width)
    }, f.currentTarget.setPointerCapture(f.pointerId), n?.();
  }, c = (f) => {
    const u = s.current;
    if (!u || u.pointerId !== f.pointerId)
      return;
    f.preventDefault(), f.stopPropagation();
    const h = th(
      u.startView,
      u.corner,
      (f.clientX - u.startX) / u.scale,
      (f.clientY - u.startY) / u.scale
    );
    u.currentView = h, r(h);
  }, a = (f) => {
    const u = s.current;
    !u || u.pointerId !== f.pointerId || (f.preventDefault(), f.stopPropagation(), s.current = null, f.currentTarget.hasPointerCapture(f.pointerId) && f.currentTarget.releasePointerCapture(f.pointerId), o(Do(u.currentView)));
  };
  return /* @__PURE__ */ d(Nn, { children: Hu.map((f) => /* @__PURE__ */ d(
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
function th(e, t, n, r) {
  const o = e.width / e.height, s = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * o, c = Wu(
    Math.abs(s - e.width) >= Math.abs(i - e.width) ? s : i,
    o
  ), a = c / o, f = Number(e.offsetX || 0), u = Number(e.offsetY || 0);
  return Do({
    width: c,
    height: a,
    offsetX: t.left ? f + e.width - c : f,
    offsetY: t.top ? u + (e.height - a) / 2 : u + (a - e.height) / 2
  });
}
function Wu(e, t) {
  const n = Math.max(Ds, Xa * t), r = Math.min(xo, xo * t);
  return n > r ? Math.min(xo, Math.max(Ds, e)) : Math.min(r, Math.max(n, e));
}
function Do(e) {
  const t = jc(e.width, Ds), n = jc(e.height, Xa), r = t / n, o = Wu(t, r);
  return {
    width: Math.round(o),
    height: Math.round(o / r),
    offsetX: Math.round(Lc(e.offsetX, 0)),
    offsetY: Math.round(Lc(e.offsetY, 0))
  };
}
function jc(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Lc(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Yu(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function nh(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function rh(e, t) {
  const n = e || Xu(), r = pm({
    type: "stream",
    output: t
  }), o = r.event, s = r.activity, i = ah(n.text, r.delta, t, o), c = ch(o, s) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, a = s && !s.anchorText ? { ...s, anchorText: i } : s, f = a ? mm(n.activities, a) : n.activities, u = gm(
    ym(n.document, r.output),
    su(r.output.document)
  ), h = iu(c) || n.interaction, S = au(c);
  return {
    started: !0,
    text: i,
    output: c,
    activities: f,
    document: u,
    interaction: h,
    suggestions: S.length > 0 ? S : n.suggestions,
    error: r.error || n.error
  };
}
function oh(e) {
  const t = sh(e);
  return {
    started: Object.keys(t).length > 0,
    text: Ps(t.text),
    output: t,
    activities: hm(t),
    document: su(t.document),
    interaction: iu(t),
    suggestions: au(t),
    error: Ps(t.error)
  };
}
function sh(e) {
  const t = wm(e);
  if (Ps(t.text))
    return t;
  const n = Wd(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function ih(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function Xu() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function ah(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && Ps(n.text) || e;
}
function ch(e, t) {
  return !(t || e === "start" || e === "delta");
}
function Ps(e) {
  return e == null ? "" : String(e);
}
function dh(e) {
  const t = Ie(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (i) => i.id === Number(t.id || 0)
  ), o = r ? Un(r, e.previousAsset) : e.previousAsset || null, s = Un(
    t,
    o
  );
  return o?.version?.content != null && Number(o.version.id || 0) === Number(s.version?.id || 0) ? Un(o, s) : s.version?.id ? s : null;
}
function uh(e, t) {
  const n = fh(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function lh(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function Un(e, t) {
  const n = Vc(e), r = t ? Vc(t) : null, o = [
    ...n.versions || [],
    ...r?.versions || []
  ], s = ph(
    [gh(n.version)].filter(
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
function jr(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((o) => [o.id, o])), r = e.map((o) => {
    const s = n.get(o.id);
    return s ? (n.delete(o.id), Un(s, o)) : o;
  });
  return [
    ...[...n.values()].map(
      (o) => Un(o)
    ),
    ...r
  ];
}
function fh(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function Vc(e) {
  const t = Uc(e.version), n = (e.versions || []).map(Uc).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function Uc(e) {
  if (!e)
    return;
  const t = Bp(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function ph(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (!s || Number(s.id || 0) <= 0)
      continue;
    const i = String(s.id), c = r.get(i);
    if (c !== void 0) {
      n[c] = mh(
        n[c],
        s
      );
      continue;
    }
    r.set(i, n.length), n.push(s);
  }
  let o = !1;
  return n.sort(
    (s, i) => Number(Fi(i)) - Number(Fi(s)) || Number(i.version || i.id || 0) - Number(s.version || s.id || 0)
  ).map((s) => Fi(s) ? o ? yh(s) : (o = !0, s) : s);
}
function mh(e, t) {
  const n = { ...e };
  for (const [r, o] of Object.entries(t))
    o !== void 0 && o !== "" && (n[r] = o);
  return n;
}
function Fi(e) {
  return !!(e.is_current || e.current);
}
function gh(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function yh(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function Za(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return pr(r, "execution_id", e?.execution_id), pr(r, "run_id", e?.run_id || n?.run_id), Oi(r, "request_id", e?.request_id), pr(r, "flow_run_id", e?.flow_run_id), pr(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), pr(r, "asset_id", t?.id), pr(r, "version_id", n?.id || t?.version_id), pr(
    r,
    "release_id",
    n?.release_id || e?.release_id
  ), Oi(r, "role", e?.role || t?.role), Oi(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function hh(e) {
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
function pr(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Oi(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const wh = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], _h = Object.fromEntries(
  wh.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function bh(e) {
  return _h[e] || "文本";
}
function Ih(e) {
  const t = new Map(e.nodes.map((i) => [i.id, i])), n = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), r = Nh(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), o = e.nodes.filter(Au).map((i) => {
    const c = r.get(i.id) || i.asset, a = i.groupId ? n.get(i.groupId) : void 0, f = a?.group?.sourceNodeId ? t.get(a.group.sourceNodeId) : void 0, u = e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || bh(Kc(i)),
      sourcePath: f?.title && a?.title ? `${f.title} / ${a.title}` : a?.title,
      nodeType: Kc(i),
      status: Sh(i, c, e.nodeHasResult(i)),
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
      nodeType: Zu(i.kind),
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
function Kc(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : Zu(e.power?.kind || e.kind);
}
function Zu(e) {
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
function Nh(e, t, n) {
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
function Sh(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function MS(e, t = []) {
  return {
    current: Ch([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: Ju(
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
function vh(e) {
  return e.map(
    (t) => ({
      id: t.role === "material" ? t.nodeId || t.key : String(t.assetId || t.key),
      title: t.title,
      kind: Ju(t.preview, t.nodeType),
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
function Ch(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = `${r.source}:${r.id}`;
    n.has(o) || (n.add(o), t.push(r));
  }
  return t;
}
function Ju(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const aa = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!aa || Object.keys(aa).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Rh = aa.joinSiteApi;
async function Qu(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return np({
    streamApi: xh(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function xh(e) {
  const t = new URL(Rh("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const el = "反馈已被新的运行替换";
function kh(e) {
  return e instanceof Error && e.message === el;
}
function _r(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function Th(e, t) {
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
function Ah(e, t, n) {
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
function Mh(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((s) => s.id === e.node.id) || e.node, o = _r(r).find(
    (s) => s.id === e.recordId
  );
  return o ? !(o.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function Dh(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: to(t?.status || e?.status || "running"),
    output: Ie(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(Oh).filter(Boolean),
    interactions: r.map(Eh).filter(Boolean),
    raw: e
  };
}
function Ph(e) {
  const t = e.interactions.find(
    (s) => !!(s.interaction?.id && s.interaction?.type)
  );
  if (t)
    return tl(t);
  const n = e.approvals.find(zh);
  if (!n?.id)
    return null;
  const r = Bh(n), o = Ja(r);
  return {
    approval: n,
    title: Me(r.title, n.title, "补充信息"),
    description: Me(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: o,
    values: Qa(r, o)
  };
}
function tl(e) {
  const t = e.interaction, n = Ja(t);
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
    values: Qa(t, n)
  };
}
function Eh(e) {
  const t = rp(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function Ja(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => $h(n, r)).filter((n) => !!n.key);
}
function Qa(e, t) {
  const n = _m(t), r = e.values && typeof e.values == "object" ? e.values : {}, o = {
    ...n,
    ...r
  }, s = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return s > 0 && (o.source_target_id = s), o;
}
function Fh(e, t) {
  const n = jh(e);
  if (!n)
    return null;
  const r = Ja(n);
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
    values: Qa(n, r)
  };
}
function Oh(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function zh(e) {
  return e.status === "pending" || e.decision === "pending";
}
function Bh(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function $h(e, t) {
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
    accepted_kinds: qc(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: qc(
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
function qc(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function jh(e) {
  const t = zi(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = zi(e?.interaction);
    return r && Me(r.type) ? r : null;
  }
  const n = zi(t.interaction, t.content?.interaction);
  return n && Me(n.type) ? n : null;
}
function zi(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
async function Lh(e) {
  return (await $p({
    teamID: e.teamID,
    projectID: e.projectID,
    canvasID: e.canvasID,
    files: e.files,
    ruleID: e.ruleID,
    onProgress: e.onProgress
  })).map(
    ({ sourceFile: n, uploadedFile: r, asset: o }) => Uh(r, n, o)
  );
}
function Vh(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : "file";
}
function Uh(e, t, n) {
  const r = String(
    e?.url || e?.open_url || e?.download || ""
  ), o = String(e?.kind || Vh(t));
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
function Kh({
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
  const [u, h, S] = op({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: r,
    targetY: o,
    targetPosition: i
  }), N = f || {}, b = !!N.isSelected, C = !!(N.isHighlighted || b), F = N.highlightColor || "#0ea5e9", q = b ? "var(--ws-edge-selected)" : C ? F : "var(--ws-edge)", X = b ? 2.8 : C ? 2.4 : 1.45, ee = C ? 0.96 : 0.62, Z = String(N.bindingLabel || "").trim(), se = !!N.bindingInteractive, M = !!Z, ie = M || b;
  return /* @__PURE__ */ E(Nn, { children: [
    C ? /* @__PURE__ */ d(
      Nc,
      {
        path: u,
        style: {
          stroke: F,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ d(
      Nc,
      {
        path: u,
        markerEnd: c,
        style: {
          ...a,
          stroke: q,
          strokeWidth: X,
          opacity: ee,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    ie ? /* @__PURE__ */ d(sp, { children: /* @__PURE__ */ E(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          Z ? "is-bound" : "",
          N.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${h}px, ${S}px)`
        },
        onMouseDown: (D) => {
          D.preventDefault(), D.stopPropagation();
        },
        children: [
          M ? se ? /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${Z}`,
              onClick: (D) => {
                D.preventDefault(), D.stopPropagation(), N.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ d(ea, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ d("span", { children: Z }),
                N.bindingShowChevron ? /* @__PURE__ */ d(zd, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ E("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ d(ea, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ d("span", { children: Z })
          ] }) : null,
          b ? /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (D) => {
                D.preventDefault(), D.stopPropagation(), N.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ d(hp, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    C ? /* @__PURE__ */ E(Nn, { children: [
      /* @__PURE__ */ d("circle", { r: "3", fill: F, children: /* @__PURE__ */ d(
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
const qh = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function Gh({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ d(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: qh,
      children: /* @__PURE__ */ E(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ d(Sn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(qs, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ d("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Bi({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [o, s] = j(!1), [i, c] = j(e), a = ne(null);
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
  ) : /* @__PURE__ */ d(ze, { label: r ? "双击重命名" : e, children: /* @__PURE__ */ d(
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
const Gc = 160, Hc = 72, Wc = 72, Es = 72, Po = 24, Eo = 24, Fo = 40, br = 2, Fs = { width: 180, height: 180 }, Hh = "storyboard-derived-layout-v7";
function Wh(e) {
  const t = e.groups.map((b) => ({
    ...b,
    size: Jh(b)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(ys), o = Qh(
    "workspace",
    r
  ), s = t.filter((b) => b.direction === "upstream").sort(ys), i = t.filter(
    (b) => b.direction === "downstream" && b.powerKind !== "audio"
  ).sort(ys), c = t.filter(
    (b) => b.direction === "downstream" && b.powerKind === "audio"
  ).sort(ys), a = i.reduce(
    (b, C) => Math.max(b, C.size.height),
    0
  ), f = i.length ? e.sourceNode.y - a - Wc : e.sourceNode.y, u = e.sourceNode.x - Gc;
  let h = f;
  for (const b of s)
    n.set(b.key, {
      bounds: {
        x: u - b.size.width,
        y: h,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), h += b.size.height + Wc;
  let S = e.sourceNode.x;
  for (const b of i)
    n.set(b.key, {
      bounds: {
        x: S,
        y: f,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), S += b.size.width + Hc;
  let N = e.sourceNode.x + e.sourceNode.width + Gc;
  for (const b of c)
    n.set(b.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), N += b.size.width + Hc;
  return n;
}
function Yh(e, t, n) {
  const r = t.filter((c) => c.groupId === e.id), o = n.kind === "audio", s = o ? n.width : Math.max(Fs.width, n.width), i = o ? n.height : Math.max(Fs.height, n.height);
  for (let c = 0; c < r.length + 100; c += 1) {
    const a = c % br, f = Math.floor(c / br), u = {
      x: e.x + Po + a * (s + Eo),
      y: e.y + Es + f * (i + Fo)
    };
    if (r.every(
      (h) => !ew(
        { ...u, width: n.width, height: n.height },
        h
      )
    ))
      return u;
  }
  return {
    x: e.x + Po,
    y: e.y + Es
  };
}
function Xh(e, t) {
  const n = t.some((s) => s.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : Fs.width,
      ...t.map((s) => s.width)
    ),
    height: Math.max(
      n ? 0 : Fs.height,
      ...t.map((s) => s.height)
    )
  }, o = /* @__PURE__ */ new Map();
  return t.forEach((s, i) => {
    const c = i % br, a = Math.floor(i / br);
    o.set(s.id, {
      x: e.x + Po + c * (r.width + Eo),
      y: e.y + Es + a * (r.height + Fo)
    });
  }), {
    ...nl(t.length, r),
    positions: o
  };
}
function Zh(e) {
  return Ws(e || void 0);
}
function Jh(e) {
  const t = Zh(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return nl(e.itemCount, t);
}
function nl(e, t) {
  const n = Math.max(1, Math.ceil(e / br));
  return {
    width: Po * 2 + t.width * br + Eo * (br - 1),
    height: Es + Po + n * t.height + (n - 1) * Fo
  };
}
function Qh(e, t) {
  return [
    Hh,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function ys(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function ew(e, t) {
  return !(e.x + e.width + Eo <= t.x || t.x + t.width + Eo <= e.x || e.y + e.height + Fo <= t.y || t.y + t.height + Fo <= e.y);
}
const tw = /^\[(?:\d{1,3}):\d{2}(?:[.:]\d{1,3})?\]\s*(.*)$/;
function nw(e) {
  if (typeof e != "string")
    return [];
  const t = [];
  for (const n of e.replace(/\r\n?/g, `
`).split(`
`)) {
    const o = n.trim().match(tw)?.[1]?.trim() || "";
    o && t.push(o);
  }
  return t;
}
function rw(e, t) {
  if (e.work_type !== "mv")
    return [];
  const n = nw(e.lyrics_lrc);
  return (t.lyric_line_indexes || []).map((r) => n[r - 1] || "").filter(Boolean);
}
function Ys(e, t) {
  const n = rw(e, t);
  return n.length ? `本镜对应歌词：${n.join(" / ")}；必须按歌词语义、情绪和节奏设计画面，不得生成歌词文字` : "";
}
const ow = [
  "characters",
  "scenes",
  "props"
], Yc = {
  character: "生成一张纯角色设定图，在同一张图内依次展示当前角色的正面全身、侧面全身、背面全身，以及面部和服装关键细节；各视角互不遮挡，必须保持同一人物的五官、发型、服装、体型和比例一致，采用清晰规范的角色设定图排版，不得拆分生成多张独立图片，不得出现其他人物、文字、水印或界面元素",
  scene: "生成一张纯场景参考图，采用能够完整说明空间关系的广角主视图，清晰展示固定空间的环境、结构、光线和关键区域；只生成一个完整画面，不得使用拼图、宫格或分栏排版，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop: "生成一张纯道具参考图，采用四分之三主视角，清晰展示当前道具的造型、比例、材质和关键细节；只生成一个完整画面，不得使用拼图、宫格、分栏或多视角排版，不得出现人物、手持者、文字、水印或界面元素"
}, ca = [
  $i("characters", "角色组", "character", 0),
  $i("scenes", "场景组", "scene", 1),
  $i("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ow,
    layoutIndex: 0,
    enabled: Yd,
    items: iw
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
    enabled: jp,
    items: sw
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: Lp,
    items: lw
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
    enabled: Vp,
    items: pw
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
    enabled: Up,
    items: mw
  }
];
function sw(e, t) {
  const n = Kp(e), r = Jr(t?.framePlanVersion) ? Xd(e.shots) : [];
  return e.shots.map((o, s) => {
    const i = Jr(t?.framePlanVersion) ? r[s] : void 0, c = Sw(
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
      prompt: Mw(
        e,
        o,
        c.externalReferences,
        t?.framePlanVersion,
        i
      ),
      ...c,
      paramValues: $w(
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
function iw(e, t) {
  return Jr(t?.framePlanVersion) ? cw(e) : aw(e);
}
function aw(e) {
  return e.shots.flatMap((t, n) => {
    if (t.continue_previous)
      return [];
    const r = ww(e, t, n);
    return [
      {
        type: "shot_image",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 参考图`,
        prompt: Cw(
          e,
          t,
          r.previousShot,
          r.externalReferences
        ),
        dependencyItems: r.dependencyItems,
        referenceItems: r.referenceItems,
        externalReferences: r.externalReferences,
        paramValues: ll(e),
        shotId: t.id
      }
    ];
  });
}
function cw(e) {
  const t = Xd(e.shots);
  return e.shots.flatMap((n, r) => {
    const o = t[r];
    if (o.nodeMode === "none")
      return [];
    const s = o.nodeMode === "last_frame" ? "end" : "start", i = _w(
      e,
      n,
      r,
      s
    ), c = uw(
      e,
      n,
      o.nodeMode,
      i
    );
    return [
      {
        type: "shot_image",
        id: n.id,
        title: dw(
          n.order || r + 1,
          o.nodeMode
        ),
        prompt: c.prompt,
        dependencyItems: i.dependencyItems,
        referenceItems: i.referenceItems,
        externalReferences: i.externalReferences,
        paramValues: ll(e),
        shotId: n.id,
        shotImageMode: o.nodeMode,
        frameMediaItems: o.frameMediaItems,
        imageSequenceFrames: c.frames
      }
    ];
  });
}
function dw(e, t) {
  return `镜头 ${e} ${Wp[t]}`;
}
function uw(e, t, n, r) {
  switch (n) {
    case "first_last": {
      const o = xw(e, t, r);
      return {
        prompt: kw(o),
        frames: o
      };
    }
    case "references":
      return {
        prompt: Rw(e, t, r)
      };
    case "last_frame":
      return {
        prompt: Os(
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
        prompt: Os(
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
function $i(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o) => Yd(o) && o.materials.some((s) => s.type === n),
    items: (o) => o.materials.filter((s) => s.type === n).map((s) => {
      const i = Ow(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: yw(
          o,
          s,
          i
        ),
        externalReferences: i
      };
    })
  };
}
function lw(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, o) => {
      const s = fw(e, r);
      return {
        type: "speech",
        id: r.id,
        title: gw(
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
function fw(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function pw(e) {
  return e.shots.flatMap((t, n) => {
    const r = qp(t);
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
function mw(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(Gp);
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
function gw(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = e.materials.find(
    (s) => s.type === "character" && s.id === t.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function yw(e, t, n) {
  const r = nc(n), o = t.prompt.trim();
  if (o)
    return Sr(
      e,
      `${r}${o}。${Yc[t.type]}`,
      t.type
    );
  const s = e.shots.filter((c) => c.material_ids.includes(t.id)).map((c) => c.description.trim()).filter(Boolean), i = s.length ? `相关镜头：${s.join("；")}` : "保持整部作品的统一视觉风格";
  return Sr(
    e,
    `${r}${Fa[t.type]}“${t.name}”的素材生成图。${i}。${Yc[t.type]}`,
    t.type
  );
}
function hw(e, t) {
  return rl(jo(e, t));
}
function rl(e) {
  return e.map((t) => ({
    type: t.type,
    id: t.id
  }));
}
function ww(e, t, n) {
  const r = hw(e, t), o = zw(e, t), s = t.match_previous ? Nw(e, n) : void 0;
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
function _w(e, t, n, r) {
  const o = Hp(
    e.shots,
    n,
    r
  ), s = new Set(o.materialIDs), i = jo(e, t).filter(
    (h) => s.has(h.id)
  ), c = rl(i), a = bw(
    e,
    o.referenceKeys,
    o.includeGlobalReferences,
    i
  ), f = o.anchorID, u = f ? { type: "shot_image", id: f } : void 0;
  return {
    anchorLabel: Iw(
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
function bw(e, t, n, r) {
  const o = new Set(
    r.flatMap((i) => i.reference_keys)
  );
  if (r.length)
    for (const i of Xs(e, "image"))
      o.add(i.key);
  const s = new Set(t);
  return Zs(
    e.references.filter(
      (i) => i.kind === "image" && !o.has(i.key) && (dl.image.has(i.purpose) ? n : s.has(i.key))
    )
  );
}
function Iw(e, t, n, r, o) {
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
function Nw(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function Sw(e, t, n, r, o) {
  if (Jr(r))
    return vw(
      e,
      t,
      n,
      o || Ea(t)
    );
  const s = cl(e, t), i = n > 0 ? e.shots[n - 1] : void 0;
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
function vw(e, t, n, r) {
  const o = cl(e, t), s = {
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
function Cw(e, t, n, r = []) {
  const o = jo(e, t), s = [
    `镜头 ${t.order} 的单张参考画面`,
    ...ec(
      r,
      n ? `前序镜头 ${n.order} 的参考画面` : "",
      o
    ),
    n ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留" : "",
    Ew(e, t),
    `入镜关键帧状态：${t.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    ...tc(o),
    t.description.trim(),
    t.camera_instruction.trim() ? `镜头语言：${t.camera_instruction.trim()}` : "",
    Ho(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return Sr(
    e,
    Go(s)
  );
}
function Os(e, t, n, r, o, s = []) {
  const i = jo(e, t), c = n === "end", a = [
    `镜头 ${t.order} 的单张${c ? "尾帧" : "首帧"}画面`,
    ...ec(
      s,
      r,
      o
    ),
    il(t, n, r),
    r ? ol(i) : "",
    sl(e, t),
    `镜头画面内容：${t.description.trim()}`,
    ...Tw(t, n),
    ...tc(i),
    Aw(t, n),
    Ho(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return Sr(
    e,
    Go(a)
  );
}
function Rw(e, t, n) {
  const r = jo(e, t), o = [
    `镜头 ${t.order} 的参考图组`,
    ...ec(
      n.externalReferences,
      n.anchorLabel,
      n.referenceMaterials
    ),
    n.anchorLabel ? il(t, "start", n.anchorLabel) : "",
    n.anchorLabel ? ol(r) : "",
    sl(e, t),
    `镜头画面内容：${t.description.trim()}`,
    `镜头起始状态：${t.continuity_state.entry.trim()}`,
    `镜头主要变化：${t.beat.trim()}`,
    `镜头结束状态：${t.continuity_state.exit.trim()}`,
    "根据维持本镜头人物、场景、道具、动作关系和构图所需的信息，生成 1 至 4 张相互补充的独立参考图片",
    "这些图片是并列的视觉参考，不是首尾帧或连续时间关键帧，不得暗示固定播放顺序",
    "每张图片只承担一种清晰参考目的，不得生成拼图、宫格、分栏、候选图、编号文字或标题",
    "整组必须保持人物身份、服装、关键道具、场景结构、光线、色彩和画风完全一致",
    ...tc(r),
    t.camera_instruction.trim() ? `镜头语言参考：${t.camera_instruction.trim()}` : "",
    Ho(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return Sr(
    e,
    Go(o)
  );
}
function ec(e, t, n) {
  const r = [
    ...e.map(ul),
    ...t ? [t] : [],
    ...n.map(
      (o) => `${Fa[o.type]}“${o.name}”`
    )
  ];
  return r.length ? [
    `参考素材用途：${r.join("、")}`,
    "必须分别识别并保留以上参考对象；具体图片编号以运行时追加的参考素材索引为准"
  ] : [];
}
function xw(e, t, n) {
  const r = Os(
    e,
    t,
    "start",
    n.anchorLabel,
    n.referenceMaterials,
    n.externalReferences
  ), o = Os(
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
function kw(e) {
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
function ol(e) {
  const t = e.map(
    (n) => `${Fa[n.type]}“${n.name}”`
  );
  return t.length ? `当前镜头对象清单：${t.join("、")}；锚点中未列出的对象不得继续保留` : "当前镜头对象清单为空；锚点中的人物、角色、动物和道具不得继续保留";
}
function sl(e, t) {
  const n = al(e, t);
  return [
    `故事目标：${e.summary.trim()}`,
    Ys(e, t),
    n.trim() ? `当前叙事阶段：${n.trim()}` : ""
  ].filter(Boolean).join("；");
}
function Tw(e, t) {
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
function Aw(e, t) {
  const n = e.camera_instruction.trim();
  return n ? t === "end" ? `尾帧构图：${n}；采用动作和运镜完成后的画面位置` : `首帧构图：${n}；采用动作和运镜开始前的画面位置` : "";
}
function il(e, t, n) {
  return n ? t === "start" ? "当前镜头要求匹配连续性参考帧；保持共同主体状态、光线、构图方向与空间关系，当前素材清单中不存在的对象不得继续保留" : e.continue_previous ? "以上一镜连续性参考帧为动作起点，推进本镜变化后形成当前尾帧；不得重复上一镜内容，除本镜明确动作造成的道具增减或状态变化外，不得改变人物、服装、场景光线和动作方向" : "以本镜头首帧为动作起点，只推进本镜变化并形成明确尾帧；保持人物身份、服装、道具、场景结构、光线和轴线一致" : "";
}
function tc(e) {
  const t = e.some(
    (n) => n.type === "character"
  );
  return [
    t ? "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致" : "当前镜头没有角色素材，不得生成清晰可识别的人物、歌手、演员、乐手、路人或人脸；故事目标、叙事阶段和外部参考中出现的人物也不得擅自带入画面。保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    t ? "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例" : "道具必须保持参考图中的原始尺寸比例"
  ];
}
function Mw(e, t, n = [], r, o) {
  if (Jr(r))
    return Dw(
      e,
      t,
      n,
      o || Ea(t)
    );
  const i = [
    `补充视觉要求：${t.video_prompt.trim() || Zd(t)}`,
    Ys(e, t),
    nc(n),
    t.continue_previous ? `使用上一镜头真实尾帧继续生成。连续性锚点：${t.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容` : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    Ho(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return Sr(
    e,
    Go(i)
  );
}
function Dw(e, t, n, r) {
  const s = [
    "约束优先级：真实输入帧与参考素材 > 起始和结束状态 > 动作推进与运镜 > 补充视觉要求；低优先级内容冲突时忽略低优先级内容",
    `补充视觉要求：${t.video_prompt.trim() || Zd(t)}`,
    Ys(e, t),
    nc(n),
    `起始状态：${t.continuity_state.entry.trim()}`,
    `动作推进：${t.beat.trim()}`,
    `结束状态：${t.continuity_state.exit.trim()}`,
    t.camera_instruction.trim() ? `运镜：${t.camera_instruction.trim()}` : "运镜：固定机位，保持构图和轴线稳定",
    Pw(t, r),
    Ho(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return Sr(
    e,
    Go(s)
  );
}
function Pw(e, t) {
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
function Ew(e, t) {
  const n = e.shots.findIndex((s) => s.id === t.id), r = al(e, t).trim(), o = e.shots[n + 1]?.transition.trim();
  return [
    `故事目标：${e.summary.trim()}`,
    Ys(e, t),
    r ? `当前叙事阶段：${r}` : "",
    `本镜变化：${t.beat.trim()}`,
    t.transition.trim() ? `从上一镜进入本镜：${t.transition.trim()}` : "",
    Fw(t, n),
    o ? `本镜结束需为下一镜建立：${o}` : ""
  ].filter(Boolean).join("；");
}
function al(e, t) {
  const n = e.shots.findIndex((r) => r.id === t.id);
  return n <= 0 ? e.storyline.setup : n >= e.shots.length - 1 ? e.storyline.payoff : e.storyline.development;
}
function Fw(e, t) {
  if (t <= 0)
    return "";
  const n = Zp[e.transition_type];
  return e.transition_type === "none" ? `进入本镜的剪辑方式：${n}` : `进入本镜的剪辑方式：${n}，时长 ${e.transition_duration_ms} 毫秒；这是后期剪辑信息，画面本身不要生成转场叠影`;
}
function Ow(e, t) {
  return Zs([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Xs(e, "image")
  ]);
}
function zw(e, t) {
  return Zs([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Xs(e, "image")
  ]);
}
function cl(e, t) {
  return Zs([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...Xs(e, "video")
  ]);
}
const dl = {
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
function Xs(e, t) {
  const n = dl[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function nc(e) {
  const t = e.map(ul);
  return t.length > 0 ? `参考素材：${t.join("；")}。` : "";
}
const Bw = {
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
function ul(e) {
  const t = Bw[e.purpose];
  return t ? `${e.label}（${t}）` : e.label;
}
function Zs(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function Go(e) {
  return e.map((t) => t.trim().replace(/[。！？!?；;，,：:]+$/g, "")).filter(Boolean).join("。");
}
function ll(e) {
  return { aspectRatio: e.aspect_ratio, resolution: "2k" };
}
function $w(e, t, n, r) {
  const o = r || Ea(t);
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration,
    ...Jr(n) && o.referenceMode ? { referenceMode: o.referenceMode } : {}
  };
}
function Ho(e) {
  return !Yp(e) || ![...Xp(e)][0] ? "" : "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
const Io = "storyboard-soundtrack";
function jw(e) {
  const t = new Map(
    (e.current?.clips || []).map((o) => [o.id, o])
  ), n = e.storyboard.shots.map(
    (o, s) => Kw({
      ...e,
      shot: o,
      index: s,
      current: t.get(o.id)
    })
  ), r = bm(
    n,
    (e.current?.clips || []).map((o) => o.id),
    (o) => o.id
  );
  return {
    version: 3,
    clips: Uw(
      r,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: Lw(
      e.storyboard,
      e.current?.audioTracks || []
    ),
    settings: {
      resolution: e.current?.settings.resolution || "auto",
      fps: e.current?.settings.fps ?? 0
    }
  };
}
function Lw(e, t) {
  const n = Jd(e), r = Vw(e), o = e.references.find(
    (S) => S.purpose === "soundtrack"
  );
  if (!o)
    return n ? [] : t.filter((S) => S.id !== Io);
  const s = n ? t.filter((S) => S.id === Io) : t, i = s.find(
    (S) => S.id === Io
  ), c = Number(o.asset_id || 0), a = Number(o.version_id || 0), f = {
    id: Io,
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
    (S) => S.id !== Io ? [S] : u ? [] : (u = !0, [f])
  );
  return u ? h : [...h, f];
}
function Vw(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, r = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && r != null && (t > 0 || n < r);
}
function Uw(e, t) {
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
    const h = u.transitionToNext.type === "none" ? 0 : Math.max(0, u.transitionToNext.durationMs), S = Math.min(
      h,
      r
    );
    return r -= S, S < 100 ? {
      ...u,
      transitionToNext: { type: "none", durationMs: 0 }
    } : (o += S, {
      ...u,
      transitionToNext: { ...u.transitionToNext, durationMs: S }
    });
  }), i = n - o - t;
  if (i <= 0)
    return s;
  const c = s.length - 1, a = s[c], f = a.duration - i / 1e3;
  return f <= 0 || (s[c] = { ...a, duration: f }), s;
}
function Kw(e) {
  const t = Jd(e.storyboard), n = zs(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), r = zs(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), o = da(n), s = t || r?.storyboardItem?.stale ? void 0 : da(r), i = !!e.current?.useOriginalVideo, c = [];
  n?.power ? o || c.push("镜头视频尚未生成") : c.push("未配置镜头视频能力");
  const a = new Map(
    (e.current?.speechTracks || []).map((C) => [C.id, C])
  ), f = t ? [] : e.shot.speech.filter((C) => C.text.trim()).map(
    (C) => Ww(
      e.nodes,
      e.sourceNodeId,
      C,
      a.get(C.id),
      c
    )
  ), u = t ? [] : Hw(e.nodes, e.sourceNodeId, e.shot.id), h = !i && s ? s : o, S = e.storyboard.shots[e.index + 1], N = S ? {
    type: S.transition_type,
    durationMs: S.transition_type === "none" ? 0 : S.transition_duration_ms
  } : { type: "none", durationMs: 0 }, b = qw(
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
    blockingIssues: Yw(c),
    transitionToNext: b,
    storyboardTransitionToNext: N
  };
}
function qw(e, t) {
  if (!e)
    return t;
  const n = e.storyboardTransitionToNext;
  return n && Gw(
    e.transitionToNext,
    n
  ) ? t : e.transitionToNext;
}
function Gw(e, t) {
  return e.type === t.type && e.durationMs === t.durationMs;
}
function Hw(e, t, n) {
  const r = zs(e, t, "subtitle", n), o = Pt(r?.resultOutput);
  return (Array.isArray(o.tracks) ? o.tracks : []).flatMap((i) => {
    const c = Pt(i), a = ps(c.id), f = ps(c.text);
    if (!a || !f)
      return [];
    const u = Xc(c.end_time ?? c.endTime), h = ps(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: f,
        startTime: Math.max(
          0,
          Xc(c.start_time ?? c.startTime)
        ),
        ...u > 0 ? { endTime: u } : {},
        ...h ? { speechId: h } : {},
        source: ps(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function Ww(e, t, n, r, o) {
  const s = zs(e, t, "speech", n.id), i = da(s);
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
function zs(e, t, n, r) {
  return e.find(
    (o) => o.storyboardItem?.sourceNodeId === t && o.storyboardItem.itemType === n && o.storyboardItem.itemId === r
  );
}
function da(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), o = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !o))
    return {
      assetId: r,
      versionId: o,
      label: e?.title || "素材"
    };
}
function Yw(e) {
  return [...new Set(e.filter(Boolean))];
}
function Xc(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function fl(e) {
  const t = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), n = String(e.composerDraft?.prompt || "").trim();
  return !!(t && n && n !== t);
}
function Xw(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!n || r.trim() === n)
    return null;
  const o = new Set(e.storyboardItem?.referenceNodeIds || []), s = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor
  } : void 0, i = t.filter((N) => o.has(N.id)).map(
    (N) => ml(N, s)
  ).filter((N) => !!N), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = du(
    e.composerDraft?.promptContent
  ).filter((N) => c.has(N.refId)), f = t.find(
    (N) => N.id === e.storyboardItem?.sourceNodeId
  ), h = ((f ? Lo([
    f.asset?.version?.content,
    f.resultOutput
  ]) : null)?.references || []).filter((N) => c.has(N.asset_id)).map(gl), S = [
    ...i,
    ...a,
    ...h
  ];
  return {
    ...e.composerDraft || {},
    prompt: n,
    promptContent: S.length ? Ba(n, S) : void 0,
    paramValues: wl(
      e.composerDraft?.paramValues,
      r,
      n
    )
  };
}
function Bs(e, t, n) {
  const r = Jc(n);
  return e.find(
    (o) => Number(o.id || 0) > 0 && String(o.kind || "").trim().toLowerCase() === t && Jc(o.outputType) === r
  ) || null;
}
function ua(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    if (n.type !== "power" || !Uo(
      n.power,
      n.kind,
      n.outputType
    ))
      continue;
    const r = Lo([
      n.asset?.version?.content,
      n.resultOutput
    ]);
    if (!r || !Jp(r))
      continue;
    const o = t.nodes.find((S) => S.id === n.id) || n, s = Zw(
      o,
      r
    ), i = String(
      o.storyboardMaterializedSignature || ""
    ), c = Jw(
      t.nodes,
      o.id
    ), u = (Zr(
      o.storyboardFramePlanVersion
    ) || 0) < eu || (i ? i !== s : !c), h = Qp(
      o.storyboardFramePlanVersion,
      u
    );
    t = u ? n_({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: h
    }) : e_({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: h
    }), t = Qw(
      t,
      o.id,
      s,
      h
    );
  }
  return t;
}
function Zw(e, t) {
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
function Jw(e, t) {
  return e.some(
    (n) => n.storyboardItem?.sourceNodeId === t || n.type === "group" && n.group?.origin === "script" && n.group.sourceNodeId === t
  );
}
function Qw(e, t, n, r) {
  const o = e.nodes.findIndex(
    (c) => c.id === t
  ), s = Zr(r);
  if (o < 0 || e.nodes[o].storyboardMaterializedSignature === n && Zr(
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
function e_(e) {
  const t = [...e.canvas.nodes];
  let n = !1, r = "";
  const o = ca.filter(
    (c) => c.enabled(e.storyboard)
  );
  for (const c of o) {
    const a = c.local ? null : Bs(e.powers, c.powerKind, c.outputType);
    for (const f of c.items(e.storyboard, {
      framePlanVersion: e.framePlanVersion
    })) {
      const u = t.findIndex(
        (b) => Oo(
          b,
          e.storyboardNode.id,
          f.type,
          f.id
        )
      );
      if (u < 0)
        continue;
      const h = pl(
        f,
        t,
        e.storyboardNode.id
      ), S = t[u], N = yl(
        S,
        S.groupId || "",
        h,
        c,
        a,
        { preserveStructure: !0 }
      );
      N !== S && (t[u] = N, n = !0);
    }
  }
  if (Qd(e.storyboard)) {
    const c = vl({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Bs(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    n = n || !!c?.changed, r = c?.node.id || "";
  }
  let s = Nl(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  s = Sl(s, t, e.storyboardNode.id), s = r ? Cl(
    s,
    t,
    e.storyboardNode.id,
    r,
    o
  ) : Rl(s, e.storyboardNode.id);
  const i = s !== e.canvas.edges;
  return n || i ? {
    ...e.canvas,
    nodes: n ? t : e.canvas.nodes,
    edges: s
  } : e.canvas;
}
function t_(e) {
  return JSON.stringify(
    e.nodes.filter(
      (t) => !!t.storyboardItem || t.type === "power" && Uo(t.power, t.kind, t.outputType)
    ).map((t) => [
      t.id,
      Number(t.resultRef?.asset_id || 0),
      Number(t.resultRef?.version_id || 0),
      Number(t.asset?.id || 0),
      Number(t.asset?.version_id || t.asset?.version?.id || 0)
    ])
  );
}
function n_(e) {
  const t = Zr(e.framePlanVersion) || eu, n = [...e.canvas.nodes], r = /* @__PURE__ */ new Set(), o = new Set(
    ca.map((b) => b.itemType)
  ), s = ca.filter(
    (b) => b.enabled(e.storyboard)
  ), i = Qd(
    e.storyboard
  );
  o.add("video_compose"), i && r.add(
    Is(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const c = s.map((b) => ({
    spec: b,
    items: b.items(e.storyboard, { framePlanVersion: t }),
    power: b.local ? null : Bs(e.powers, b.powerKind, b.outputType)
  }));
  for (const { items: b } of c)
    for (const C of b)
      r.add(
        Is(e.storyboardNode.id, C.type, C.id)
      );
  let a = !1;
  for (let b = n.length - 1; b >= 0; b -= 1) {
    const C = n[b].storyboardItem;
    !C || C.sourceNodeId !== e.storyboardNode.id || !o.has(C.itemType) || r.has(
      Is(
        C.sourceNodeId,
        C.itemType,
        C.itemId
      )
    ) || (n.splice(b, 1), a = !0);
  }
  const f = Wh({
    sourceNode: e.storyboardNode,
    groups: c.map(({ spec: b, items: C, power: F }) => ({
      key: b.key,
      layoutIndex: b.layoutIndex,
      itemCount: C.length,
      power: F,
      powerKind: b.powerKind,
      direction: b.direction
    }))
  });
  let u = Ka(n, e.canvas.nextNodeNo);
  a = a || u !== e.canvas.nextNodeNo;
  for (const { spec: b, items: C, power: F } of c) {
    const q = f.get(b.key);
    if (!q)
      continue;
    const X = i_({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: b,
      layout: q,
      assetCate: e.assetCate
    });
    a = a || X.changed;
    for (const ie of C) {
      const D = pl(
        ie,
        n,
        e.storyboardNode.id
      ), z = n.findIndex(
        (Y) => Oo(
          Y,
          e.storyboardNode.id,
          D.type,
          D.id
        )
      );
      if (z >= 0) {
        const Y = n[z], ce = yl(
          Y,
          X.node.id,
          D,
          b,
          F
        );
        ce !== Y && (n[z] = ce, a = !0);
        continue;
      }
      const L = a_({
        nodes: n,
        group: X.node,
        storyboardNode: e.storyboardNode,
        item: D,
        assetCate: e.assetCate,
        spec: b,
        power: F
      });
      L.nodeNo = u++, n.push(L), a = !0;
    }
    const ee = C.map(
      (ie) => n.find(
        (D) => D.groupId === X.node.id && Oo(
          D,
          e.storyboardNode.id,
          ie.type,
          ie.id
        )
      )
    ).filter((ie) => !!ie), Z = Xh(
      X.node,
      ee
    );
    for (const ie of ee) {
      const D = Z.positions.get(ie.id);
      if (!D || ie.x === D.x && ie.y === D.y)
        continue;
      const z = n.indexOf(ie);
      n[z] = { ...ie, ...D }, a = !0;
    }
    const se = n.findIndex((ie) => ie.id === X.node.id), M = n[se];
    (M.width !== Z.width || M.height !== Z.height) && (n[se] = {
      ...M,
      width: Z.width,
      height: Z.height
    }, a = !0);
  }
  const h = new Set(s.map((b) => b.key));
  for (let b = n.length - 1; b >= 0; b -= 1) {
    const C = n[b];
    C.type !== "group" || C.group?.origin !== "script" || C.group.sourceNodeId !== e.storyboardNode.id || !C.group.syncKey || h.has(
      C.group.syncKey
    ) || (n.splice(b, 1), a = !0);
  }
  const S = i ? vl({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Bs(e.powers, "video", "video_compose"),
    nextNodeNo: u
  }) : null;
  S && (u = S.nextNodeNo, a = a || S.changed);
  let N = Nl(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    s
  );
  return N = Sl(N, n, e.storyboardNode.id), N = S ? Cl(
    N,
    n,
    e.storyboardNode.id,
    S.node.id,
    s
  ) : Rl(N, e.storyboardNode.id), N !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: u, nodes: n, edges: N } : e.canvas;
}
function pl(e, t, n) {
  const r = (b) => (b || []).map(
    (C) => t.find(
      (F) => Oo(F, n, C.type, C.id)
    )
  ).filter((C) => !!C), o = r(e.dependencyItems), s = r(e.referenceItems), i = f_([...o, ...s]), c = e.externalReferences || [], a = {
    ...e,
    dependencyNodeIds: o.map((b) => b.id),
    referenceNodeIds: s.map((b) => b.id),
    sourceSignatureParts: [
      ...e.sourceSignatureParts || [],
      ...i.map(p_),
      ...c.map(s_)
    ]
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return a;
  const f = r_(
    e.prompt,
    s,
    c
  ), u = f === e.prompt ? a : { ...a, prompt: f }, h = c.map(
    gl
  );
  if (h.push(
    ...s.map((b) => ml(b, e)).filter((b) => !!b)
  ), !h.length)
    return u;
  const S = Ba(
    f,
    h
  ), N = Im(S);
  return cu(S) ? { ...a, prompt: N, promptContent: S } : { ...u, prompt: N };
}
function r_(e, t, n = []) {
  const r = [], o = /* @__PURE__ */ new Set();
  for (const s of n) {
    const i = xc(s.label), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  for (const s of t) {
    const i = xc(s.title), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function ml(e, t) {
  const n = Number(e.resultRef?.asset_id || e.asset?.id || 0), r = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!n || !r)
    return null;
  const o = Da(
    e.storyboardItem?.frameMediaItems
  ), s = Pa(
    e.storyboardItem?.shotImageMode
  ), i = o_(
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
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? s === "references" ? "reference" : tu(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function o_(e, t, n) {
  if (e !== "shot_image" || !n.length)
    return {};
  if (t?.type === "shot") {
    const r = n.find((s) => s.frameRole === "end") || n.find((s) => s.frameRole === "start");
    return {
      mediaItems: (t.continuityAnchor ? r ? [r] : [] : n).map((s) => ({
        url: "",
        index: s.mediaIndex,
        usage: tu(s.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = Rc(n, "end") || Rc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function gl(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function s_(e) {
  return [
    "asset",
    e.asset_id,
    e.version_id || 0,
    e.kind,
    e.purpose
  ].join(":");
}
function i_(e) {
  const t = rc(
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
  const n = e.layout.bounds, r = Hs("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = sc(
    e.nodes,
    `script-group-${yt(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function rc(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function a_(e) {
  const t = Hs(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = sc(
    e.nodes,
    `script-item-${yt(
      Is(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Ws({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${l_(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: e.item.prompt,
    promptContent: e.item.promptContent,
    paramValues: e.item.paramValues
  }, t.storyboardItem = _l(
    e.storyboardNode.id,
    e.item
  );
  const n = Yh(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function yl(e, t, n, r, o, s = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = i.sourceSignature || bl({
    ...n,
    prompt: i.generatedPrompt,
    promptContent: e.composerDraft?.promptContent
  }), a = String(e.composerDraft?.prompt || ""), f = !a.trim() || a === i.generatedPrompt, u = f ? n.prompt : a, h = u !== a, S = c_(
    e.composerDraft?.paramValues,
    a,
    u,
    n.paramValues
  ), N = S !== e.composerDraft?.paramValues, b = f ? n.promptContent : d_(
    a,
    e.composerDraft?.promptContent,
    n.promptContent
  ), C = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(b || null), F = _l(i.sourceNodeId, n), q = hl(e), X = i.resultSourceSignature || (q ? c : "");
  X && !r.local && (F.resultSourceSignature = X), F.stale = r.local ? !1 : !!(q && X !== F.sourceSignature);
  const ee = s.preserveStructure && e.titleMode === "manual" ? e.title : n.title, Z = e.title !== ee, se = s.preserveStructure ? e.groupId || "" : t, M = !e.power && !!o, ie = e.kind !== r.powerKind, D = e.outputType !== r.outputType, z = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === se && !h && !N && !C && !Z && !M && !ie && !D && !z && Il(i, F) ? e : {
    ...e,
    title: ee,
    kind: r.powerKind,
    outputType: r.outputType,
    ...M ? {
      power: o || void 0,
      subtitle: o?.output?.name || o?.name || e.subtitle
    } : {},
    description: h || M ? u : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: se,
    composerDraft: h || N || C ? {
      ...e.composerDraft || {},
      prompt: u,
      promptContent: b,
      paramValues: S
    } : e.composerDraft,
    storyboardItem: F
  };
}
function hl(e) {
  return Number(e.resultRef?.version_id || 0) > 0 || Number(e.asset?.version_id || e.asset?.version?.id || 0) > 0 || e.resultOutput != null;
}
function wl(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [o, s] of Object.entries(e))
    s === t && (r ||= { ...e }, r[o] = n);
  return r || e;
}
function c_(e, t, n, r) {
  let o = wl(
    e,
    t,
    n
  );
  for (const [s, i] of Object.entries(r || {}))
    o?.[s] !== i && (o = { ...o || {}, [s]: i });
  return o;
}
function d_(e, t, n) {
  return !n || !cu(n) ? t : Ba(
    e,
    du(n)
  );
}
function _l(e, t) {
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
    sourceSignature: bl(t),
    stale: !1
  };
}
function bl(e) {
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
function Il(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && mr(e.dependencyNodeIds, t.dependencyNodeIds) && mr(e.referenceNodeIds, t.referenceNodeIds) && mr(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && mr(e.frameMediaItems, t.frameMediaItems) && mr(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && mr(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && mr(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && !!e.optional == !!t.optional && e.sourceSignature === t.sourceSignature && e.resultSourceSignature === t.resultSourceSignature && !!e.stale == !!t.stale;
}
function Oo(e, t, n, r) {
  const o = e.storyboardItem;
  return !!(o && o.sourceNodeId === t && o.itemType === n && o.itemId === r);
}
function Nl(e, t, n, r) {
  const o = r.map((a) => ({
    spec: a,
    group: t.find(
      (f) => f.type === "group" && f.group?.origin === "script" && f.group.sourceNodeId === n && f.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), s = `script-edge-${yt(n)}-`, i = e.filter((a) => !a.id.startsWith(s));
  for (const { spec: a, group: f } of o) {
    const u = a.direction === "upstream", h = (a.sourceGroupKeys || []).map((N) => rc(t, n, N)).filter((N) => !!N), S = u ? [f] : h.length ? h : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of S) {
      const b = N.id, C = u ? n : f.id;
      i.push({
        id: ic(i, `${s}${a.key}-${yt(b)}`),
        from: b,
        to: C,
        logicalFrom: b,
        logicalTo: C,
        purpose: "structure",
        executionMode: u ? void 0 : "manual"
      });
    }
  }
  const c = Gt(t, i);
  return oc(e, c) ? e : c;
}
function Sl(e, t, n) {
  const r = `script-item-edge-${yt(n)}-`, o = e.filter((a) => !a.id.startsWith(r)), s = t.filter(
    (a) => a.storyboardItem?.sourceNodeId === n && (!!a.groupId || a.storyboardItem.itemType === "video_compose")
  ), i = new Map(s.map((a) => [a.id, a]));
  for (const a of s)
    for (const f of a.storyboardItem?.dependencyNodeIds || []) {
      const u = i.get(f);
      !u || u.id === a.id || o.push({
        id: ic(
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
  const c = Gt(t, o);
  return oc(e, c) ? e : c;
}
function vl(e) {
  const t = e.nodes.find(
    (c) => Oo(
      c,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = jw({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), r = u_(n), o = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceSignature: r,
    stale: !1
  };
  if (t) {
    const c = e.preservePosition ? { x: t.x, y: t.y } : Zc(e.nodes, e.storyboardNode), a = hl(t), f = t.storyboardItem?.resultSourceSignature || (a ? t.storyboardItem?.sourceSignature : "");
    f && (o.resultSourceSignature = f), o.stale = !!(a && f !== r);
    const u = !t.power && !!e.power, h = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), S = t.x !== c.x || t.y !== c.y;
    if (!u && !h && !S && t.kind === "video" && t.outputType === "video_compose" && Il(t.storyboardItem, o))
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
  const s = Zc(
    e.nodes,
    e.storyboardNode
  ), i = Hs(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return i.id = sc(
    e.nodes,
    `script-compose-${yt(e.storyboardNode.id)}`
  ), i.nodeNo = e.nextNodeNo, i.title = "视频合成", i.kind = "video", i.outputType = "video_compose", i.description = "按镜头顺序合成画面、原声和配音。", e.power || (i.subtitle = "未配置视频合成能力", i.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), i.composerDraft = { videoComposition: n }, i.storyboardItem = o, e.nodes.push(i), {
    node: i,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function u_(e) {
  const t = e.clips.map((n) => {
    const r = { ...n };
    return delete r.storyboardTransitionToNext, r;
  });
  return yt(JSON.stringify({ ...e, clips: t }));
}
function Zc(e, t) {
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
function Cl(e, t, n, r, o) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (u) => o.some((h) => h.key === u)
  ).map((u) => rc(t, n, u)).filter((u) => !!u), c = `script-compose-edge-${yt(n)}-`, a = e.filter((u) => !u.id.startsWith(c));
  for (const u of i.length ? i : t.filter((h) => h.id === n))
    a.push({
      id: ic(a, `${c}${yt(u.id)}`),
      from: u.id,
      to: r,
      logicalFrom: u.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const f = Gt(t, a);
  return oc(e, f) ? e : f;
}
function Rl(e, t) {
  const n = `script-compose-edge-${yt(t)}-`, r = e.filter((o) => !o.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function oc(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const o = n.get(r.id);
    return !!(o && r.from === o.from && r.to === o.to && (r.logicalFrom || "") === (o.logicalFrom || "") && (r.logicalTo || "") === (o.logicalTo || "") && (r.purpose || "") === (o.purpose || "") && (r.executionMode || "auto") === (o.executionMode || "auto") && (r.mediaUsage || "") === (o.mediaUsage || ""));
  });
}
function Is(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function sc(e, t) {
  return xl(new Set(e.map((n) => n.id)), t);
}
function ic(e, t) {
  return xl(new Set(e.map((n) => n.id)), t);
}
function xl(e, t) {
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
function Jc(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function l_(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function mr(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function f_(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => t.has(n.id) ? !1 : (t.add(n.id), !0));
}
function p_(e) {
  return [
    e.id,
    Number(e.resultRef?.version_id || 0),
    Number(e.asset?.version_id || e.asset?.version?.id || 0),
    e.storyboardItem?.sourceSignature || "",
    e.storyboardItem?.resultSourceSignature || ""
  ].join(":");
}
const m_ = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function kl(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return m_[n] || { section: "shots" };
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
const Qc = 52, ed = 72, g_ = 48, y_ = {
  width: 360,
  height: 52
};
function h_(e, t) {
  const n = Qs(e);
  return {
    frames: Al(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: Tl(e, n)
  };
}
function td(e) {
  return Qs(e);
}
function w_(e, t) {
  return Tl(e).get(t.id) || "";
}
function Tl(e, t = Qs(e)) {
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
function Al(e, t, n = Qs(e)) {
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
    ), u = N_(a);
    r.push({
      id: Js(o),
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
function Ml(e, t, n, r = new Map(t.map((o) => [o.id, o]))) {
  const o = e.workNodeIds.map((u) => r.get(u)).filter((u) => !!u), s = new Set(
    o.filter((u) => u.storyboardItem?.stale || !n(u)).map((u) => u.id)
  );
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const u of o)
      s.has(u.id) || u.storyboardItem?.itemType === "video_compose" || I_(u).some(
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
    (u) => !Wa(u)
  );
  return f ? {
    pendingNodeIds: a.map((u) => u.id),
    blockedReason: `“${f.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: a.map((u) => u.id),
    blockedReason: qu({
      targets: a,
      nodesByID: r,
      hasResult: n
    })
  };
}
function __(e, t, n) {
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
function nd(e, t) {
  return t ? {
    x: e.bounds.x,
    y: e.bounds.y,
    ...y_
  } : e.bounds;
}
function b_(e, t, n) {
  const r = Dl(t, n);
  if (r.x === 0 && r.y === 0)
    return e;
  const o = new Set(t.memberNodeIds);
  return e.map(
    (s) => o.has(s.id) ? { ...s, x: s.x + r.x, y: s.y + r.y } : s
  );
}
function Dl(e, t) {
  return {
    x: t.x - e.bounds.x,
    y: t.y - e.bounds.y
  };
}
function Js(e) {
  return `storyboard-frame:${e}`;
}
function I_(e) {
  return [
    ...e.storyboardItem?.dependencyNodeIds || [],
    ...e.storyboardItem?.referenceNodeIds || []
  ];
}
function Qs(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
function N_(e) {
  let t = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY, r = Number.NEGATIVE_INFINITY, o = Number.NEGATIVE_INFINITY;
  for (const s of e) {
    const i = rd(s.width, 180), c = rd(s.height, 180);
    t = Math.min(t, s.x), n = Math.min(n, s.y), r = Math.max(r, s.x + i), o = Math.max(o, s.y + c);
  }
  return {
    x: t - Qc,
    y: n - ed,
    width: r - t + Qc * 2,
    height: o - n + ed + g_
  };
}
function rd(e, t) {
  return Number.isFinite(e) && e > 0 ? e : t;
}
function S_({
  data: e
}) {
  const t = R_(e), n = e.running ? e.stopping ? "正在停止制作区执行" : e.currentNodeTitle ? `正在执行：${e.currentNodeTitle}` : "制作区正在执行" : e.runBlockedReason || (e.completedCount > 0 ? "只执行尚未完成或上次失败的内容" : "按依赖顺序生成制作区内容");
  return /* @__PURE__ */ E(
    "section",
    {
      className: `ws-storyboard-frame ${e.collapsed ? "is-collapsed" : ""}`,
      "aria-label": `${e.title} 分镜制作区`,
      children: [
        /* @__PURE__ */ E("header", { className: "ws-storyboard-frame-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-storyboard-frame-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(wp, { size: 15 }) }),
          /* @__PURE__ */ E("strong", { children: [
            e.title,
            " · 分镜制作区"
          ] }),
          /* @__PURE__ */ E("span", { className: "ws-storyboard-frame-progress", children: [
            e.groupCount,
            " 组 · ",
            e.completedCount,
            "/",
            e.workNodeCount,
            " ",
            "完成",
            e.executionStatus ? ` · ${e.executionStatus}` : "",
            e.currentNodeTitle ? ` · 正在执行：${e.currentNodeTitle}` : ""
          ] }),
          e.running ? /* @__PURE__ */ d(ze, { label: n, children: /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "nodrag nopan ws-storyboard-frame-run is-stop",
              "aria-label": "停止制作区执行",
              disabled: e.stopping || !e.onStop,
              onClick: e.onStop ? hs(e.onStop) : void 0,
              children: [
                e.stopping ? /* @__PURE__ */ d(Sn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Bd, { size: 13, fill: "currentColor" }),
                /* @__PURE__ */ d("span", { children: e.stopping ? "停止中" : "停止" })
              ]
            }
          ) }) : /* @__PURE__ */ d(ze, { label: n, children: /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "nodrag nopan ws-storyboard-frame-run",
              "aria-label": t,
              disabled: !!e.runBlockedReason,
              onClick: hs(e.onRun),
              children: [
                /* @__PURE__ */ d(qs, { size: 14, fill: "currentColor" }),
                /* @__PURE__ */ d("span", { children: t })
              ]
            }
          ) }),
          /* @__PURE__ */ d(ze, { label: "聚焦制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": "聚焦制作区",
              onClick: hs(e.onFocus),
              children: /* @__PURE__ */ d(_p, { size: 14 })
            }
          ) }),
          /* @__PURE__ */ d(ze, { label: e.collapsed ? "展开制作区" : "折叠制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": e.collapsed ? "展开制作区" : "折叠制作区",
              onClick: hs(e.onToggleCollapsed),
              children: e.collapsed ? /* @__PURE__ */ d(zd, { size: 15 }) : /* @__PURE__ */ d(bp, { size: 15 })
            }
          ) })
        ] }),
        e.collapsed ? null : /* @__PURE__ */ d("div", { className: "ws-storyboard-frame-surface", "aria-hidden": "true" })
      ]
    }
  );
}
const v_ = xa(
  S_,
  (e, t) => C_(e.data, t.data)
);
function C_(e, t) {
  return e === t || e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.title === t.title && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.stopping === t.stopping && e.executionStatus === t.executionStatus && e.currentNodeTitle === t.currentNodeTitle && e.runBlockedReason === t.runBlockedReason && e.onStop === t.onStop && e.collapsed === t.collapsed;
}
function R_(e) {
  return e.running ? "执行中" : e.workNodeCount > 0 && e.completedCount >= e.workNodeCount ? "已完成" : e.completedCount > 0 ? "继续执行" : "开始执行";
}
function hs(e) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), e();
  };
}
const Wr = /* @__PURE__ */ new Map(), x_ = 100;
function k_(e, t) {
  const n = String(t.runError || "").trim(), r = t.id, o = Number(t.resultRef?.execution_id || 0), s = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), c = A_(
    e,
    r,
    o,
    s,
    i
  ), [a, f] = j(n), [u, h] = j(!1);
  return pe(() => {
    if (f(n), !n || !c || !Um(n)) {
      h(!1);
      return;
    }
    let S = !0;
    return h(!0), T_({
      projectId: e,
      nodeId: r,
      executionId: o,
      requestId: s,
      runId: i,
      cacheKey: c,
      fallback: n
    }).then((N) => {
      S && N && f(N);
    }).catch(() => {
    }).finally(() => {
      S && h(!1);
    }), () => {
      S = !1;
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
function T_({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: o,
  cacheKey: s,
  fallback: i
}) {
  const c = Wr.get(s);
  if (c)
    return c;
  const a = Vu({
    projectId: e,
    executionId: n,
    requestId: r,
    runId: o
  }).then((f) => {
    const u = vn(f), h = [...u.node_results || []].reverse().find((N) => N.node_key === t), S = La(h) || Nu(u);
    return Va(S, i);
  });
  return Wr.set(s, a), M_(), a.catch(() => Wr.delete(s)), a;
}
function A_(e, t, n, r, o) {
  const s = n ? `execution:${n}` : r ? `request:${r}` : o ? `run:${o}` : "";
  return e > 0 && s ? `${e}:${s}:${t}` : "";
}
function M_() {
  for (; Wr.size > x_; ) {
    const e = Wr.keys().next().value;
    if (!e)
      return;
    Wr.delete(e);
  }
}
function Oe({
  label: e,
  overlay: t = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [o, s] = j(r <= 0);
  return pe(() => {
    if (r <= 0) {
      s(!0);
      return;
    }
    const i = window.setTimeout(() => s(!0), r);
    return () => window.clearTimeout(i);
  }, [r]), o ? /* @__PURE__ */ E(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ d(Sn, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: e })
      ]
    }
  ) : null;
}
function D_({
  space: e,
  canvases: t,
  cache: n
}) {
  const [r, o] = j([]), [s, i] = j([]), [c, a] = j([]), [f, u] = j(!1), h = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, S = ne(h), N = le(
    () => f || P_(t),
    [t, f]
  );
  pe(() => {
    S.current = h, o([]), i([]), a([]), u(!1);
  }, [h]);
  const b = A(
    async (C = !1) => {
      if (!e)
        return !1;
      const F = h;
      try {
        const q = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => fy(e.project.id),
          C
        );
        return S.current !== F ? !1 : (o(q.roles), i(q.powers), a(q.powerCategories), u(!0), !0);
      } catch (q) {
        return U.error(q instanceof Error ? q.message : "加载能力列表失败"), !1;
      }
    },
    [n, h, e]
  );
  return pe(() => {
    !e || !N || f || b();
  }, [b, f, N, e]), {
    roles: r,
    powers: s,
    powerCategories: c,
    loaded: f,
    required: N,
    load: b
  };
}
function P_(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : Uo(n.power, n.kind, n.outputType) ? !!Lo([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function ko(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function St(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function E_({
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
  onRun: S,
  runBlockedReason: N = "",
  children: b
}) {
  const [C, F] = j(!1), [q, X] = j(e.title), ee = ne(null), Z = i === "running" || i === "waiting", se = Z ? "分组正在执行" : c ? "制作区正在执行" : N || (n === 0 ? "分组内暂无可运行节点" : s > 0 ? `重新生成 ${s} 个已变更节点` : "运行分组"), M = !S || n === 0 || Z || c || !!N;
  pe(() => {
    C || X(e.title);
  }, [C, e.title]), pe(() => {
    C && (ee.current?.focus(), ee.current?.select());
  }, [C]);
  const ie = () => {
    const D = q.trim() || "未命名分组";
    F(!1), X(D), D !== e.title && u?.(D);
  };
  return /* @__PURE__ */ E(
    "div",
    {
      className: `ws-node-group-wrap ${a ? "is-selected" : ""} ${Z ? "is-running" : ""} ${i === "error" ? "is-error" : ""} ${f ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ E("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(Ip, { size: 15 }) }),
          C ? /* @__PURE__ */ d(
            "input",
            {
              ref: ee,
              className: "ws-node-group-title-input nodrag nowheel",
              value: q,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (D) => X(D.target.value),
              onBlur: ie,
              onKeyDown: (D) => {
                D.key === "Enter" ? (D.preventDefault(), ie()) : D.key === "Escape" && (D.preventDefault(), X(e.title), F(!1));
              }
            }
          ) : /* @__PURE__ */ d(
            ze,
            {
              label: f ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ d(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (D) => {
                    D.preventDefault(), D.stopPropagation(), !(f || !u) && F(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ d("span", { className: "ws-node-group-count", children: Z ? `${r}/${n}` : `${t} 个节点` }),
          i === "waiting" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待反馈" }) : i === "error" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: o > 0 ? `失败 ${o}` : "运行失败" }) : N ? /* @__PURE__ */ d(ze, { label: N, children: /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待前置" }) }) : c ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待调度" }) : n > 0 && r === n ? /* @__PURE__ */ E("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ d(Ta, { size: 12 }),
            "已完成"
          ] }) : null,
          h ? /* @__PURE__ */ d(ze, { label: "编辑分镜结构", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (D) => {
                D.preventDefault(), D.stopPropagation(), h();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ d(Pd, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ d(ze, { label: se, children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: M,
              onClick: (D) => {
                D.preventDefault(), D.stopPropagation(), S?.();
              },
              "aria-label": "运行分组",
              children: Z ? /* @__PURE__ */ d(Sn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(qs, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        b
      ]
    }
  );
}
function Pl({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: r,
  className: o = "",
  style: s,
  onOpen: i,
  onOpenIntent: c,
  openOnContentClick: a = !1,
  resizeControls: f,
  children: u,
  customContentIsPureMedia: h = !1,
  followContent: S = !1,
  followKey: N
}) {
  const b = ne(null), C = ne(!0), F = qr(e, n), q = u != null, X = h || !q && !F && El(n), ee = !!i && (!q || h), Z = [
    "ws-result-view",
    X ? "" : "nodrag",
    "nopan",
    "nowheel",
    X ? "has-pure-media" : "",
    o
  ].filter(Boolean).join(" ");
  return pe(() => {
    if (!S) {
      C.current = !0;
      return;
    }
    const D = b.current;
    D && C.current && (D.scrollTop = D.scrollHeight);
  }, [S, N]), /* @__PURE__ */ E(
    "div",
    {
      role: ee ? "button" : void 0,
      tabIndex: ee ? 0 : void 0,
      className: Z,
      style: s,
      onPointerDown: (D) => {
        (!X || B_(D)) && D.stopPropagation();
      },
      onClick: (D) => {
        D.stopPropagation(), !(!i || Ns(D.target, D.currentTarget) || z_(D)) && (D.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (D) => {
        D.stopPropagation(), !(!i || Ns(D.target, D.currentTarget) || D.key !== "Enter" && D.key !== " ") && (D.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            ref: b,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (D) => {
              !a || !i || Ns(D.target, D.currentTarget) || Fl(D, D.currentTarget) || (D.preventDefault(), D.stopPropagation(), i());
            },
            onScroll: (D) => {
              if (!S)
                return;
              const z = D.currentTarget;
              C.current = z.scrollHeight - z.scrollTop - z.clientHeight < 16;
            },
            children: q ? u : F ? /* @__PURE__ */ d(
              Gr,
              {
                output: e,
                fallback: t,
                mediaGridKind: Vo(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ d(F_, { preview: n, label: r ?? t })
          }
        ),
        f
      ]
    }
  );
}
function F_({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ E("figure", { className: "ws-result-view-media", children: [
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
  ] }) : e.videoUrl ? /* @__PURE__ */ E("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ d(
      xs,
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
  ] }) : e.audioUrl ? /* @__PURE__ */ E("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ d("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ d("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ E(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ d(Aa, { size: 16 }),
        /* @__PURE__ */ d("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ d(
    Gr,
    {
      output: O_(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function O_(e) {
  return e ? { text: e } : void 0;
}
function El(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Ns(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t && t.contains(n));
}
function z_(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  return t ? Fl(e, t) : !1;
}
function Fl(e, t) {
  if (t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function B_(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? em(n, e.clientY) : Ns(t, e.currentTarget);
}
const Ol = Wt(() => import("./space-agent-tools-AgKRiiTe.js")), ac = Wt(() => import("./space-asset-tools-1UAsVseW.js")), $_ = ht(
  Ol,
  (e) => e.AgentInteractionPanel
), j_ = $_.Component, zl = ht(
  Wt(() => import("./protected-5-nodes-body-work-space-space-add-node-menu-tsx-CHxIjx_Z.js")),
  (e) => e.AddNodeMenu
), L_ = zl.Component, V_ = zl.preload, Bl = ht(
  ac,
  (e) => e.AssetBrowser
), U_ = Bl.Component, K_ = Bl.preload, $l = ht(
  ac,
  (e) => e.AssetDetailDialog
), q_ = $l.Component, G_ = $l.preload, jl = ht(
  ac,
  (e) => e.AssetPickerDialog
), od = jl.Component, sd = jl.preload, Ll = ht(
  Wt(() => import("./space-run-history-CUqoMUv7.js")),
  (e) => e.CanvasRunHistoryDrawer
), H_ = Ll.Component, W_ = Ll.preload, Y_ = ht(
  Wt(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-qdc5fGCC.js")),
  (e) => e.SpaceCanvasManagerDialog
), X_ = Y_.Component, Z_ = ht(
  Wt(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-aqoasPSy.js")),
  (e) => e.CanvasParamBindingDialog
), J_ = Z_.Component, Vl = ht(
  Wt(() => import("./space-assistant-Bx0QFWq7.js")),
  (e) => e.SpaceAssistant
), Q_ = Vl.Component, eb = Vl.preload, tb = ht(
  Ol,
  (e) => e.CanvasAgentResultContent
), nb = tb.Component, Ul = ht(
  Wt(() => import("./node-detail-dialog-DTJ7ZDWy.js")),
  (e) => e.NodeDetailDialog
), rb = Ul.Component, zo = Ul.preload, Kl = ht(
  Wt(() => import("./space-node-settings-Di27tvds.js")),
  (e) => e.CanvasNodeSettings
), ob = Kl.Component, sb = Kl.preload, ib = ht(
  Wt(() => import("./space-storyboard-node-BE12-7nF.js")),
  (e) => e.StoryboardNodeContent
), ab = ib.Component, cb = ht(
  Wt(() => import("./space-video-compose-view-cwj_0-C-.js")),
  (e) => e.VideoComposeView
), db = cb.Component;
function ub({
  assistantName: e,
  onIntent: t,
  onOpen: n
}) {
  const r = `打开${e || "画布助手"}`;
  return /* @__PURE__ */ d("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ d(ze, { label: r, side: "left", children: /* @__PURE__ */ d(
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
      children: /* @__PURE__ */ d(Np, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
const Ss = 520, lb = 440, fb = 720, ql = "bot.canvasAssistant.width", Gl = "bot.canvasAssistant.open";
function Hl(e) {
  return Number.isFinite(e) ? Math.min(
    fb,
    Math.max(lb, Math.round(e))
  ) : Ss;
}
function pb(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function mb(e) {
  return e === "1";
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const la = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!la || Object.keys(la).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
function Ue(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: gb } = la;
function yb(...e) {
  for (const t of e) {
    const n = Ir(t);
    if (n)
      return n;
  }
  return null;
}
function $s(...e) {
  for (const t of e) {
    const n = Wl(t);
    if (Ve(n))
      return n;
  }
  return "";
}
function Wl(e) {
  const t = Be(e), n = Wo(t);
  if (n !== t)
    return Wl(n);
  const r = gb?.(t) ?? t, o = gr(r, /* @__PURE__ */ new Set());
  if (Ve(o))
    return o;
  if (r !== t) {
    const c = gr(t, /* @__PURE__ */ new Set());
    if (Ve(c))
      return c;
  }
  const s = ei(t);
  if (s)
    return ta?.(s) ?? s;
  const i = cc(e);
  return i !== t && Ve(i) ? i : "";
}
function gr(e, t) {
  const n = Be(e), r = Wo(n);
  if (r !== n)
    return gr(r, t);
  if (typeof n == "string") {
    const a = Xl(n);
    if (Ve(a))
      return a;
    const f = Mo(n);
    return f ? { text: f } : Hn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((f) => gr(f, t)).filter(Ve);
    return a.length > 0 ? a : "";
  }
  if (!Ue(n))
    return n;
  if (Cr(n)) {
    const a = tf(n);
    if (a !== void 0)
      return gr(a, t);
    const f = nf(n);
    if (f)
      return { text: f };
    const u = Ir(n) || vt(n);
    return u ? { rich: u } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), fc(n))
    return fa(n);
  if (Zl(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const f = gr(n[a], t);
    if (Ve(f))
      return f;
  }
  const o = dc(n);
  if (o) {
    const a = { rich: o };
    return ta?.(a) ?? a;
  }
  const s = vt(n);
  if (s)
    return { rich: s };
  const i = ei(n);
  if (i)
    return ta?.(i) ?? i;
  const c = Ct(n);
  if (c !== n)
    return gr(c, t);
  if (hb(n))
    return fa(n);
  if (ri(n)) {
    const a = Me(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return ti(n) ? n : "";
}
function hb(e) {
  return !!(Ue(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function fa(e) {
  const t = {}, n = Be(e.content);
  Ue(n) && ad(t, n), ad(t, e);
  const r = wb(e);
  return r && (t.text = r), !Ve(t) && n && typeof n == "object" ? n : ti(t) ? t : "";
}
function wb(e) {
  const t = Me(e.text);
  if (t)
    return t;
  const n = Be(e.content);
  return typeof n == "string" ? n.trim() : Ue(n) ? Me(n.text) : "";
}
function cc(e) {
  const t = Wo(e);
  if (t !== e)
    return cc(t);
  const n = ei(e);
  if (n)
    return n;
  const r = Xl(e);
  if (Ve(r))
    return r;
  const o = Be(e), s = vt(o);
  if (s)
    return { rich: s };
  const i = Ct(o);
  if (i !== o) {
    const c = vt(i);
    return c ? { rich: c } : i;
  }
  return o;
}
function ei(e) {
  const t = Ir(e);
  return t ? { rich: t } : null;
}
function Ir(e, t = /* @__PURE__ */ new Set()) {
  const n = Be(e), r = Wo(n);
  if (r !== n)
    return Ir(r, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = Ir(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!Ue(n) || t.has(n))
    return null;
  if (t.add(n), Cr(n))
    return Yl(n, t) || n;
  const o = n, s = [
    Ge(o, ["output", "content", "rich"]),
    Ge(o, ["output", "rich"]),
    Ge(o, ["content", "rich"]),
    o.content,
    o.rich,
    o.text,
    o.summary
  ];
  for (const i of s) {
    if (i === n)
      continue;
    const c = Ir(i, t);
    if (c)
      return c;
  }
  return null;
}
function Yl(e, t) {
  const n = js(e);
  for (const r of n) {
    const o = id(r, t);
    if (o)
      return o;
  }
  return id(n.join(""), t);
}
function id(e, t) {
  const n = String(e || "").trim();
  if (!Hn(n))
    return null;
  const r = nu(n);
  return r === n || r === e ? null : Ir(r, t);
}
function _b(e) {
  return js(e).join("");
}
function js(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => js(r, t));
  if (!Ue(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...js(e.content, t)), n;
}
function Xl(e) {
  const t = Ft(e);
  if (t)
    return { rich: t };
  const n = Be(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = Mo(n);
    return r ? { text: r } : "";
  }
  return "";
}
function Ft(e, t = /* @__PURE__ */ new Set()) {
  const n = Be(e);
  if (Cr(n))
    return Yl(n, t) || n;
  if (Array.isArray(n))
    return vt(lc(n));
  if (!Ue(n) || t.has(n))
    return null;
  t.add(n);
  const r = n, o = dc(r);
  if (o)
    return o;
  const s = [
    Ge(r, ["output", "content", "rich"]),
    Ge(r, ["output", "content"]),
    Ge(r, ["output", "rich"]),
    Ge(r, ["content", "output", "content", "rich"]),
    Ge(r, ["content", "output", "content"]),
    Ge(r, ["content", "rich"]),
    Ge(r, ["data", "output", "content", "rich"]),
    Ge(r, ["data", "output", "content"]),
    Ge(r, ["data", "content", "rich"]),
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
    const c = Ft(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(r)) {
    if (!rf(i) || !c || typeof c != "object")
      continue;
    const a = Ft(c, t);
    if (a)
      return a;
  }
  return null;
}
function dc(e) {
  if (Cr(e))
    return e;
  const t = Ue(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), r = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? vt({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || r === "rich_json") && e.rich != null ? Ft(e.rich) : (n === "rich_json" || r === "rich_json") && t?.rich != null ? Ft(t.rich) : null;
}
function Cr(e) {
  return !!(Ue(e) && e.type === "doc" && Array.isArray(e.content));
}
function ad(e, t) {
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
    Ve(t[n]) && (e[n] = n === "rich" ? bb(t[n]) : t[n]);
}
function bb(e) {
  return Ft(e) || vt(lc(e)) || vt(e) || e;
}
function ti(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Ve(n));
}
function Zl(e) {
  return !Ue(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => Ve(e[t]));
}
function Ve(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !Hn(t) && !Dt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Ve) : Ue(e) ? Ft(e) ? !0 : ri(e) ? !1 : ti(e) : !1;
}
function uc(e) {
  return Et(
    xn(e),
    e.description || e.title
  );
}
function Ib(e) {
  const t = [
    xn(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = Ft(n) || vt(cc(n)) || vt(Ct(n)) || vt(n);
    if (r)
      return r;
  }
  return null;
}
function Et(e, t = "") {
  const n = Ct(e), r = vt(n), o = r ? hr(r).trim() : "";
  if (o && !Dt(o))
    return o;
  const s = hr(n).trim();
  if (Dt(s))
    return "";
  const i = Mo(s);
  if (i)
    return i;
  if (s && !Hn(s))
    return s;
  if (pc(s)) {
    const u = hr(
      Ct(Be(s))
    ).trim();
    if (u && u !== s && !Dt(u))
      return u;
  }
  const c = String(t || "").trim();
  if (Dt(c))
    return "";
  const a = Mo(c);
  if (a)
    return a;
  if (!Hn(c))
    return c;
  const f = hr(
    Ct(Be(c))
  ).trim();
  return f && f !== c && !Dt(f) ? f : "";
}
function Dt(e) {
  const t = e.trim();
  return t ? Nb(t) || Sb(t) : !1;
}
function Nb(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function Sb(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function Xn(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = Ct(e);
  return Bo(n, r, t), !Gn(n) && r !== e && Bo(n, e, t), To(n) && Hn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= nm(e, "video").find(
    (o) => o.url === n.videoUrl
  )?.thumbnail), n;
}
function vb(e, t) {
  return {
    text: Me(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function Bo(e, t, n, r = /* @__PURE__ */ new Set(), o = 0) {
  if (o > 12 || t == null)
    return;
  if (typeof t == "string") {
    cd(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const f of t)
      if (Bo(e, f, n, r, o + 1), To(e))
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
  const s = t, i = Cb(e, s, n), c = Et(t, "");
  c && c !== i && !Rn(c) && (e.text ||= c);
  const a = Ur(s.url, s.src, s.href);
  if (a && a !== i && cd(e, a, n), e.imageUrl ||= Ur(
    s.image,
    s.image_url,
    s.imageUrl,
    at(s.images),
    at(s.imageUrls)
  ), e.videoUrl ||= Ur(
    s.video,
    s.video_url,
    s.videoUrl,
    at(s.videos),
    at(s.videoUrls)
  ), e.audioUrl ||= Ur(
    s.audio,
    s.audio_url,
    s.audioUrl,
    at(s.audios),
    at(s.audioUrls)
  ), e.fileUrl ||= Ur(
    s.file,
    s.file_url,
    s.fileUrl,
    at(s.files),
    at(s.fileUrls)
  ), !To(e)) {
    for (const f of ["output", "result", "content", "body", "data", "rich"])
      if (s[f] && typeof s[f] == "object" && (Bo(e, s[f], n, r, o + 1), To(e)))
        return;
  }
  if (!e.text && !Gn(e) && !Db(s) && ti(s))
    try {
      const f = JSON.stringify(t, null, 2);
      eo(f) || (e.text = f);
    } catch {
      const f = String(t);
      eo(f) || (e.text = f);
    }
}
function Cb(e, t, n) {
  const r = Jl(
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
  const o = Ur(...xb(t, r));
  return o ? (r === "image" && (e.imageUrl ||= o), r === "video" && (e.videoUrl ||= o), r === "audio" && (e.audioUrl ||= o), r === "file" && (e.fileUrl ||= o), o) : "";
}
function Rb(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return Jl(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function Jl(...e) {
  for (const t of e) {
    const n = ni(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function ni(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function xb(e, t) {
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
    Ge(e, ["attrs", "src"]),
    Ge(e, ["attrs", "url"]),
    Ge(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    at(e.images),
    at(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    at(e.videos),
    at(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    at(e.audios),
    at(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    at(e.files),
    at(e.fileUrls),
    ...n
  ];
}
function cd(e, t, n) {
  const r = t.trim();
  if (!r || Dt(r))
    return;
  if (pc(r)) {
    const c = Be(r);
    if (c !== r && (Bo(e, c, n), To(e)))
      return;
    const a = Et(c, "");
    a && !Rn(a) && (e.text ||= a);
    return;
  }
  const o = Mo(r);
  if (o) {
    e.text ||= o;
    return;
  }
  const s = hr(r);
  if (s && s !== r) {
    e.text ||= s;
    return;
  }
  const i = kb(r, n);
  if (i) {
    Ab(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (Rn(r)) {
    const c = ni(n);
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
function kb(e, t) {
  const n = Ql(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const f = ji(r[2]);
    if (f)
      return {
        kind: "image",
        url: f,
        caption: ws(e, r[0], r[1])
      };
  }
  const o = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (o) {
    const f = ji(o[1]);
    if (f)
      return {
        kind: "image",
        url: f,
        caption: ws(e, o[0], "")
      };
  }
  const s = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = s.exec(e); ) {
    const f = ji(i[2]), u = dd(f, n);
    if (u)
      return {
        kind: u,
        url: f,
        caption: ws(e, i[0], i[1])
      };
  }
  const c = Mb(e), a = dd(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: ws(e, c, "")
  } : null;
}
function Ql(e, t) {
  return ni(t) ? t : Tb(e) ? "image" : t;
}
function Tb(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Ab(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function dd(e, t) {
  if (!e || !Rn(e))
    return "";
  const n = ni(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function ws(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !Rn(r) ? r : String(n || "").trim();
}
function ji(e) {
  const t = ef(e);
  return Rn(t) ? t : "";
}
function Mb(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? ef(t[0]) : "";
}
function ef(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Db(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function Gn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !eo(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function To(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Pb(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (Ue(t)) {
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
        Ge(t, ["attrs", "src"]),
        Ge(t, ["attrs", "url"]),
        Ge(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function Ur(...e) {
  const t = Pb(...e);
  return Rn(t) ? t : "";
}
function at(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function Rn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function xn(e) {
  return Eb(
    tm(e.asset?.version?.content, e.resultOutput)
  );
}
function Eb(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = tf(n);
    if (r !== void 0)
      return r;
    const o = nf(n);
    if (o)
      return { text: o };
    const s = $s(n) || Ct(n);
    if (Ve(s) || mc(s))
      return s;
  }
  if (t !== void 0)
    return $s(t) || Ct(t);
}
function tf(e) {
  const t = Be(e), n = Cr(t) ? t : Ft(t);
  if (!n)
    return;
  const r = _b(n).trim();
  if (!Hn(r))
    return;
  const o = nu(r);
  if (o === r)
    return;
  const s = Ct(o);
  if (Ve(s) || mc(s))
    return s;
}
function nf(e) {
  const t = Be(e), n = Cr(t) ? t : Ft(t);
  return Wd(n);
}
function Ct(e) {
  const t = Be(e), n = Wo(t);
  if (n !== t)
    return Ct(n);
  if (Zl(t))
    return t;
  if (Ue(t) && fc(t)) {
    const s = fa(t);
    if (Ve(s))
      return s;
  }
  const r = ei(t);
  if (r)
    return r.rich;
  if (Cr(t))
    return t;
  const o = Ft(t);
  return o || lc(Ls(t, /* @__PURE__ */ new Set()));
}
function Ls(e, t) {
  if (!Ue(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, r = of(n);
  if (r !== void 0)
    return r;
  const o = Fb(n, t);
  if (o !== void 0)
    return o;
  for (const s of Ob) {
    const i = Ge(n, s);
    if (i === void 0 || i === e)
      continue;
    const c = Ls(
      Be(i),
      t
    );
    if (pa(c))
      return c;
  }
  if (ri(n))
    for (const s of ["output", "result", "data", "body"]) {
      if (n[s] === void 0 || n[s] === e)
        continue;
      const i = Ls(
        Be(n[s]),
        t
      );
      if (pa(i))
        return i;
    }
  return e;
}
function Fb(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!rf(n) || !r || typeof r != "object")
      continue;
    const o = Ls(Be(r), t);
    if (pa(o))
      return o;
  }
}
function rf(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const Ob = [
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
function of(e) {
  const t = dc(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Be(e.content);
    if (Ue(n)) {
      const r = of(n);
      if (r !== void 0)
        return r;
    }
  }
}
function lc(e) {
  const t = Be(e);
  return Ue(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function ri(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function pa(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !Hn(n) && !Dt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!Ue(e) || Ft(e) || vt(e))
    return !0;
  if (ri(e))
    return !1;
  const t = hr(e).trim();
  return !!(t && !eo(t));
}
function Ge(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ue(n) || !(r in n))
      return;
    n = n[r];
  }
  return n;
}
function Wo(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = zb(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function zb(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && /\s/.test(e[o] || ""); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const i = e.indexOf("```", s), c = i >= 0 ? e.slice(o, i) : e.slice(o), a = Bb(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    s = i + 3;
  }
}
function Bb(e, t = !1) {
  const n = e.trim(), r = rm(n);
  for (const o of om([n, r])) {
    const s = Be(o);
    if (s !== o && (t ? $b(s) : fc(s)))
      return s;
  }
  return null;
}
function $b(e) {
  if (!Ue(e))
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
function fc(e) {
  if (!Ue(e))
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
  ].some((n) => Ve(e[n]));
}
function pc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Hn(e) {
  const t = String(e || "").trim();
  return !!(t && (pc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function sf(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return Dt(e) ? "" : e;
  const t = hr(e).trim();
  if (t && Dt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return eo(n) ? "" : n;
  } catch {
    const n = String(e);
    return Dt(n) ? "" : n;
  }
}
function mc(e) {
  const t = sf(e).trim();
  return !!(t && !eo(t));
}
function eo(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || Dt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const ma = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!ma || Object.keys(ma).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const jb = ma.useTheme;
function Yo(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function $o(e) {
  return Yo(e) ? e : {};
}
function ae(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!Yo(n))
      return;
    n = n[r];
  }
  return n;
}
const af = {}, ud = [], Lb = [], ld = [], fd = /* @__PURE__ */ new Set(), Vb = 800;
function Ub(e) {
  const t = ne([]), n = ne(0), r = A(() => {
    n.current && (window.cancelAnimationFrame(n.current), n.current = 0);
    const s = t.current;
    t.current = [], s.length !== 0 && e(
      (i) => s.reduce((c, a) => a(c), i)
    );
  }, [e]), o = A(
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
  ), le(() => ({ enqueue: o, flush: r }), [o, r]);
}
function pd(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function cf(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const o of mu(e, r.id))
        n.add(o.id);
  return n;
}
function df(e) {
  return Object.values(e).some(St);
}
function Kb(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function qb(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function Gb(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((o) => {
    const s = Bf(o), i = o.x + s.width, c = o.y + s.height;
    return o.type === "group" ? r.left <= o.x && r.top <= o.y && r.right >= i && r.bottom >= c : r.left <= i && r.right >= o.x && r.top <= c && r.bottom >= o.y;
  }).map((o) => o.id);
}
function Hb(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const Wb = {
  workSpace: xa(GN, HN),
  storyboardFrame: v_
}, Yb = {
  animated: Kh
}, Xb = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, Zb = [18, 18], Jb = ["Control", "Meta"], Qb = {
  type: "animated",
  animated: !1
}, eI = { padding: 0.32, maxZoom: 0.72 };
function it(e) {
  const t = ne(e);
  return Qi(() => {
    t.current = e;
  }, [e]), A((...n) => t.current(...n), []);
}
function tI({
  onInitialLoadComplete: e
}) {
  const t = Qf(), n = Ep(), r = le(() => tS(), []), o = le(() => nS(), []), s = le(() => new Fy(), []), [i, c] = j(null), [a, f] = j(o), u = ne(o), [h, S] = j(0), N = ne(0), [b, C] = j(null), F = ne(null), [q, X] = j([]), ee = q[q.length - 1] || "", [Z, se] = j({}), M = ne(Z), [ie, D] = j(!1), [z, L] = j([]), [Y, ce] = j(!1), ve = ne(0), [de, Re] = j("create"), [$e, ye] = j(
    () => rS(r)
  ), [fe, ct] = j(!1), [Te, Yt] = j(
    () => oS()
  ), { resolvedTheme: Zn, setTheme: oo } = jb();
  Fp(n.site.appearance, Zn);
  const [Rt, wt] = j(null), [Jn, ft] = j(!0), xr = ne(!0), [me, Xt] = j({}), Zt = Ub(Xt), [kr, Jt] = j({}), [Ke, Ot] = j(null), [Qt, dt] = j(null), [si, zt] = j(), [xt, en] = j(
    null
  ), [We, Qe] = j(null), [un, ln] = j(!1), [Tr, Tn] = j(""), [Qn, Ar] = j(null), [Jo, Mr] = j(""), [Bt, $t] = j([]), [Qo, er] = j([]), [Dr, jt] = j(!1), [so, io] = j(""), [Lt, Vt] = j(!1), [fn, An] = j(1), [ao, tr] = j(!1), [Ut, pn] = j(() => /* @__PURE__ */ new Set()), [Ye, Xe] = j(!1), [_t, Ae] = j(null), [nr, Mn] = j(!1), je = ne(null), rr = ne(!1), Dn = ne(/* @__PURE__ */ new Set()), Pe = ne(/* @__PURE__ */ new Set()), Pn = ne(/* @__PURE__ */ new Set()), ue = ne([]), or = ne(!1), rt = ne(!1), ut = ne([0]), sr = ne(null), ir = ne(/* @__PURE__ */ new Map()), ot = ne(
    /* @__PURE__ */ new Map()
  ), pt = ne(/* @__PURE__ */ new Set()), mt = ne(null), {
    roles: En,
    powers: Le,
    powerCategories: ii,
    loaded: co,
    required: uo,
    load: es
  } = D_({
    space: i,
    canvases: Z,
    cache: s
  });
  pe(() => {
    M.current = Z;
  }, [Z]), pe(() => {
    N.current = h;
  }, [h]), pe(() => {
    u.current = a;
  }, [a]), pe(() => {
    ue.current = Bt;
  }, [Bt]);
  const lo = A((l) => {
    const m = ba(l);
    if (!m)
      return;
    const y = String(m.request_id || "").trim();
    y && (Qr(m) ? pt.current.add(y) : pt.current.delete(y));
    const _ = Gi(
      ue.current,
      [m]
    );
    ue.current = _, $t(_);
  }, []), fo = A(
    (l) => {
      const m = String(l?.request_id || "").trim();
      m && pt.current.delete(m);
    },
    []
  ), Fn = A((l) => {
    U.error(l instanceof Error ? l.message : "保存画布失败");
  }, []), {
    markCanvasDirty: On,
    flushCanvasSave: tn,
    adoptCanvasSnapshot: nn,
    forgetCanvasSnapshot: ai,
    resetCanvasAutosave: Pr,
    canvasSaveStatus: ar
  } = Dy({
    projectId: r,
    enabled: !!i,
    canvases: Z,
    setCanvases: se,
    onError: Fn
  }), kt = it(
    Si
  ), mn = it(
    Q
  );
  pe(() => {
    if (Pn.current.size === 0)
      return;
    const l = [...Pn.current];
    Pn.current.clear();
    for (const m of l)
      On(m);
  }, [Z, On]);
  const cr = A(async () => {
    if (!r) {
      Mr("缺少作品 ID"), ft(!1);
      return;
    }
    ft(!0), Mr("");
    try {
      const l = await sy(
        r,
        u.current,
        N.current
      ), m = lN(
        l.canvases || {},
        l.assets || []
      ), y = Number(l.initialCanvasId || 0) || Number(Object.values(m)[0]?.id || 0), _ = Number(l.initialAssetCateId || 0) || gg(l);
      c(l), M.current = m, se(m), Pr(m), u.current = y, f(y), N.current = _, S(_), Vr(y), C(null), F.current = null, ve.current += 1, D(!1), L([]), ce(!1), Dn.current = /* @__PURE__ */ new Set(), Pe.current = /* @__PURE__ */ new Set(), ue.current = [], $t([]), er([]), An(1), tr(!1), ut.current = [0], kt(r, l, m, "recovery", {
        canvasId: y
      });
    } catch (l) {
      Mr(l instanceof Error ? l.message : "加载创作空间失败");
    } finally {
      ft(!1);
    }
  }, [kt, r, Pr]), dr = A((l) => {
    en(l);
  }, []);
  pe(() => {
    cr();
  }, [cr]), pe(() => {
    Jn || !xr.current || (xr.current = !1, e());
  }, [Jn, e]);
  const gn = i?.assetCates, ts = le(() => i ? Du(i) : [], [i]), rn = ts.length > 1, te = le(
    () => i ? Pi(i, h) : null,
    [h, i]
  ), on = le(
    () => i && te ? yg(i, te.id) : [],
    [te, i]
  ), ns = le(() => En.filter(hg), [En]), rs = le(() => Le.filter(wg), [Le]), os = le(
    () => Le.some(
      (l) => Number(l.id || 0) > 0 && String(l.kind || "").trim().toLowerCase() === "video" && Wn(l).outputType === "lip_sync"
    ),
    [Le]
  ), V = le(() => {
    const l = i?.canvasList.find(
      (m) => m.id === a
    );
    return Z[String(a)] || Pc(
      l?.assetCateId || te?.id || 0,
      a,
      l?.name || "第一幕"
    );
  }, [a, te?.id, Z, i?.canvasList]), po = le(
    () => (i?.canvasList || []).filter((l) => l.assetCateId === te?.id).sort((l, m) => l.sort - m.sort || l.id - m.id),
    [te?.id, i?.canvasList]
  ), mo = A(
    async (l) => {
      const m = ve.current + 1;
      ve.current = m, ce(!0);
      try {
        const y = await uy({
          projectId: r,
          assetCateId: l
        });
        ve.current === m && L(y);
      } catch (y) {
        ve.current === m && (L([]), U.error(
          y instanceof Error ? y.message : "加载已删除画布失败"
        ));
      } finally {
        ve.current === m && ce(!1);
      }
    },
    [r]
  ), Er = A(() => {
    te && (D(!0), L([]), mo(te.id));
  }, [te, mo]), ci = le(
    () => Object.entries(Z).map(
      ([l, m]) => `${l}:${t_(m)}`
    ).join("|"),
    [Z]
  ), Ee = le(
    () => cI(V, kr),
    [V, kr]
  ), di = le(() => {
    const l = new Set(q);
    return Ee.nodes.filter((m) => l.has(m.id));
  }, [Ee.nodes, q]), ui = A(
    async (l) => {
      const m = await bo({
        projectId: r,
        canvasId: l
      }), y = Kr(
        $r(m.canvas, Le),
        m.assets
      );
      c(
        (v) => v && {
          ...v,
          assets: jr(v.assets, m.assets),
          canvasList: m.canvasList.length > 0 ? m.canvasList : v.canvasList
        }
      );
      const _ = String(l), w = {
        ...M.current,
        [_]: y
      };
      M.current = w, se(w), nn(y);
    },
    [nn, Le, r]
  ), li = A((l) => {
    const m = Hl(l);
    Yt(m), Dd(
      ql,
      String(m)
    );
  }, []), ss = A(
    (l) => {
      ye(l), l || ct(!1), Dd(
        `${Gl}:${r}`,
        l ? "1" : "0"
      );
    },
    [r]
  ), is = wr, qe = le(
    () => Ih({
      nodes: Ee.nodes,
      assets: i?.assets || [],
      canvasId: V.id,
      assetCateId: te?.id || 0,
      nodeOutput: xn,
      nodePreview: Rr,
      assetPreview: (l) => {
        const m = l.version?.content ?? l.name, y = Xn(
          m,
          String(l.kind || "")
        );
        return Gn(y) || (y.text = l.name), y;
      },
      nodeHasResult: Ht
    }),
    [V.id, te?.id, Ee.nodes, i?.assets]
  ), as = le(
    () => vh(qe),
    [qe]
  );
  pe(() => {
    !gn || uo && !co || se((l) => {
      let m = l;
      for (const [y, _] of Object.entries(l)) {
        const w = Number(_.assetCateId || 0), v = ua({
          canvas: _,
          assetCate: ia(gn, w),
          powers: Le
        }), k = vd(v, w);
        Cd(_, k) || (m === l && (m = { ...l }), m[y] = k, Pn.current.add(_.id || Number(y)));
      }
      return m;
    });
  }, [
    gn,
    co,
    uo,
    Le,
    ci
  ]);
  const go = A(
    (l = "") => {
      sd(), Tn(l), je.current = V.nodes.find((m) => m.id === l) || (je.current?.id === l ? je.current : null), wt(null), Re("create"), ln(!0);
    },
    [V.nodes]
  ), yn = A(
    (l, m) => {
      if (!Number.isInteger(l) || l <= 0)
        return;
      const y = (v) => {
        const k = String(l), $ = v[k];
        if (!$) return v;
        const O = vd(
          m($),
          $.assetCateId
        );
        return Cd($, O) ? v : (Pn.current.add(l), {
          ...v,
          [k]: O
        });
      }, _ = M.current, w = y(_);
      M.current = w, se((v) => {
        const k = v === _ ? w : y(v);
        return M.current = k, k;
      });
    },
    []
  ), gt = A(
    (l) => {
      te && yn(V.id, l);
    },
    [V.id, te, yn]
  ), sn = A(
    (l, m, y) => {
      u.current === l && Jt(
        (_) => dI(_, m, y)
      ), yn(l, (_) => {
        const w = _.assetCateId, v = {
          ..._,
          nodes: _.nodes.map(
            ($) => $.id === m ? { ...$, ...y } : $
          )
        };
        return gn ? ua({
          canvas: v,
          assetCate: ia(gn, w),
          powers: Le
        }) : v;
      });
    },
    [gn, Le, yn]
  ), et = A(
    (l, m) => {
      sn(V.id, l, m), u.current === V.id && Ot(
        (y) => y?.id === l ? { ...y, ...m } : y
      );
    },
    [V.id, sn]
  ), yo = A(
    (l, m, y) => {
      if (!ZI(m, y))
        return;
      const _ = xf(y), w = `${l}:${m.id}:${_}`;
      if (Dn.current.has(w))
        return;
      Dn.current.add(w);
      const v = m.title.trim(), k = M.current[String(l)];
      gy({
        projectId: r,
        nodeKey: m.id,
        versionId: _,
        prompt: XI(m, k)
      }).then(($) => {
        const O = $.title.trim();
        !O || O === v || $.versionId !== _ || yn(l, (K) => {
          const J = K.nodes.find(
            (oe) => oe.id === m.id
          );
          return !J || J.titleMode !== "auto" || J.title.trim() !== v || !Rf(J) ? K : {
            ...K,
            nodes: K.nodes.map(
              (oe) => oe.id === m.id ? { ...oe, title: O } : oe
            )
          };
        });
      }).catch(() => {
        Dn.current.delete(w);
      });
    },
    [r, yn]
  ), hn = A(
    async (l) => {
      l.canvasId && On(l.canvasId);
    },
    [On]
  ), cs = A(
    (l, m, y) => {
      const _ = {};
      gt((w) => {
        const v = w.nodes.map(
          (k) => k.id === l ? {
            ...k,
            composerDraft: Ha(m)
          } : k
        );
        return _.canvas = { ...w, nodes: v }, _.canvas;
      }), y?.save === "immediate" && _.canvas && tn(_.canvas).catch(() => {
      });
    },
    [tn, gt]
  ), ds = A(
    (l) => {
      gt((m) => {
        const y = m.edges.filter((_) => _.id !== l);
        return y.length === m.edges.length ? m : { ...m, edges: y };
      });
    },
    [gt]
  ), fi = A(
    (l, m) => {
      const y = pN(l);
      if (y) {
        G_(), Ot(null), zt(void 0), dt(y);
        return;
      }
      zo(), dt(null), zt(m), Ot(l);
    },
    []
  ), we = A(
    (l, m) => {
      Jt((y) => {
        const _ = V.nodes.find(
          (k) => k.id === l
        );
        if (!_)
          return y;
        const w = y[l] || {}, v = {
          ..._,
          ...w
        };
        return {
          ...y,
          [l]: {
            ...w,
            feedbackRequests: m(_r(v))
          }
        };
      });
    },
    [V.nodes]
  ), Kt = A((l) => {
    const m = new Set(l.filter(Boolean));
    if (m.size !== 0) {
      if (mt.current && m.has(mt.current.nodeId)) {
        const y = mt.current;
        mt.current = null, y.reject(new Error(el));
      }
      Ae(
        (y) => y && m.has(y.node.id) ? null : y
      ), Jt((y) => {
        const _ = { ...y };
        let w = !1;
        for (const v of m) {
          const k = _[v] || {};
          _[v] = {
            ...k,
            feedbackRequests: []
          }, w = !0;
        }
        return w ? _ : y;
      });
    }
  }, []), tt = A((l) => {
    !l || !l.id || c((m) => m && {
      ...m,
      assets: jr(m.assets, [l])
    });
  }, []), Fr = A(
    (l) => {
      if (!Qt)
        return;
      const m = V.nodes.find(
        (w) => w.id === Qt.nodeId
      );
      if (!m)
        return;
      const y = jn(l), _ = vs(
        m,
        y
      );
      tt(y), et(m.id, _);
    },
    [
      V.nodes,
      Qt,
      et,
      tt
    ]
  ), ur = A(
    ({ node: l, prompt: m }) => {
      const y = gc(l, m), _ = ga(
        _r(l),
        y
      );
      return we(
        l.id,
        (w) => ga(w, y)
      ), Mn(!1), new Promise((w, v) => {
        mt.current = {
          nodeId: l.id,
          recordId: y.id,
          resolve: w,
          reject: v
        }, Ae({
          node: { ...l, feedbackRequests: _ },
          recordId: y.id,
          prompt: m
        });
      });
    },
    [we]
  ), Tt = A(
    async (l) => {
      const m = mt.current;
      if (!(!m || nr)) {
        Mn(!0);
        try {
          await m.submit?.(l), we(
            m.nodeId,
            (y) => Ah(y, m.recordId, l)
          ), mt.current = null, Ae(null), m.resolve(l);
        } catch (y) {
          U.error(y instanceof Error ? y.message : "提交反馈失败");
        } finally {
          Mn(!1);
        }
      }
    },
    [we, nr]
  ), pi = A(() => {
    Ae(null);
  }, []), mi = A(
    (l, m) => {
      if (mt.current?.nodeId === l.id && mt.current.recordId === m.id && m.status === "pending") {
        Ae({
          node: l,
          recordId: m.id,
          prompt: m.prompt
        });
        return;
      }
      if (m.status === "pending") {
        const y = YI(
          ue.current,
          l,
          m
        );
        if (y) {
          Mn(!1), mt.current = {
            nodeId: l.id,
            recordId: m.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (_) => {
              await vf(
                r,
                y.run,
                y.pending,
                y.prompt,
                _
              ), U.success("已提交反馈，流程继续执行"), window.setTimeout(() => sr.current?.(), 0);
            }
          }, Ae({
            node: l,
            recordId: m.id,
            prompt: y.prompt
          });
          return;
        }
      }
      Ae({
        node: l,
        recordId: m.id,
        prompt: {
          ...m.prompt,
          values: m.values || m.prompt.values || {}
        }
      });
    },
    [r]
  ), zn = A(
    ({
      assetCate: l,
      startNode: m,
      canvas: y,
      nodes: _ = y.nodes,
      ...w
    }) => {
      if (!i)
        throw new Error("创作空间尚未加载");
      const v = y.id, k = (O) => {
        Xt((K) => u.current !== v ? K : typeof O == "function" ? O(K) : O);
      }, $ = {
        enqueue: (O) => Zt.enqueue(
          (K) => u.current === v ? O(K) : K
        ),
        flush: Zt.flush
      };
      return {
        projectId: r,
        canvasId: v,
        assetCate: l,
        space: i,
        startNode: m,
        ...w,
        nodes: _,
        edges: y.edges,
        viewport: y.viewport,
        canvasUpdatedAt: y.updatedAt,
        flushCanvasSave: tn,
        onNodeResult: et,
        onAssetCreated: tt,
        setRunningNode: k,
        runningNodeBatcher: $,
        requestFlowFeedback: ur,
        requestNodeTitle: (O, K) => yo(y.id, O, K)
      };
    },
    [
      r,
      tn,
      yo,
      ur,
      Zt,
      i,
      et,
      tt
    ]
  ), Bn = A(
    async (l) => {
      i && await kt(
        r,
        i,
        M.current,
        "recovery",
        {
          canvasId: l?.canvasId || u.current,
          runIds: [Number(l?.canvasRun?.run_id || 0)]
        }
      );
    },
    [kt, r, i]
  ), us = A(
    async (l) => {
      if (!i || !te)
        return;
      let m = null;
      try {
        Kt(
          Ly(
            l.id,
            Ee.nodes,
            Ee.edges
          )
        ), m = zn({
          assetCate: te,
          startNode: l,
          canvas: {
            ...V,
            nodes: Ee.nodes,
            edges: Ee.edges,
            viewport: V.viewport
          }
        }), await Vi(m), await hn(m), U.success("开始节点执行完成");
      } catch (y) {
        if (kh(y) || Co(y))
          return;
        const _ = y instanceof Error ? y.message : "开始节点执行失败";
        m?.setRunningNode?.((w) => ({
          ...w,
          [l.id]: {
            nodeId: l.id,
            title: l.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error"
          }
        })), U.error(_), window.setTimeout(() => {
          m?.setRunningNode?.(
            (w) => ko(w, l.id)
          );
        }, 1400);
      } finally {
        await Bn(m);
      }
    },
    [
      te,
      V,
      Ee.edges,
      Ee.nodes,
      Kt,
      zn,
      hn,
      Bn,
      i
    ]
  ), gi = A(
    async (l) => {
      if (!i || !te)
        return;
      const m = M.current[String(V.id)] || V, y = m.nodes.find(
        (O) => O.id === l
      );
      if (!y) {
        U.error("分镜脚本节点不存在");
        return;
      }
      const _ = Al(
        m.nodes,
        Ht
      ).find((O) => O.sourceNodeId === l);
      if (!_) {
        U.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const w = Ml(
        _,
        m.nodes,
        Ht
      );
      if (w.blockedReason) {
        U.error(w.blockedReason);
        return;
      }
      const v = Js(l), k = zn({
        assetCate: te,
        startNode: y,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: lo,
        canvas: m
      });
      Kt(w.pendingNodeIds), k.setRunningNode?.((O) => ({
        ...O,
        [v]: {
          nodeId: v,
          title: `${y.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let $ = 650;
      try {
        await Vi(k), U.success("制作区执行完成");
      } catch (O) {
        if (Co(O))
          $ = 0;
        else {
          $ = 1400;
          const K = O instanceof Error ? O.message : "制作区执行失败";
          k.setRunningNode?.((J) => ({
            ...J,
            [v]: {
              ...J[v] || {
                nodeId: v,
                title: `${y.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0
              },
              status: "error"
            }
          })), U.error(K);
        }
      } finally {
        fo(k.canvasRun);
        const O = new Set(
          (k.canvasRun?.node_results || []).filter((K) => kn(K) === "success").map((K) => K.node_key).filter(Boolean)
        );
        O.size > 0 && (gt(
          (K) => md({
            canvas: K,
            sourceNodeId: l,
            successfulNodeIds: O,
            assetCate: te,
            powers: Le
          })
        ), await hn(k)), window.setTimeout(() => {
          k.setRunningNode?.(
            (K) => ko(K, v)
          );
        }, $), await Bn(k);
      }
    },
    [
      V,
      te,
      Kt,
      zn,
      hn,
      Le,
      Bn,
      fo,
      lo,
      i,
      gt
    ]
  ), ls = A(
    async (l, m) => {
      if (!i || !te)
        return;
      const y = M.current[String(V.id)] || V, _ = y.nodes.find((re) => re.id === l.id) || l, w = lI({
        ..._,
        composerDraft: {
          ..._.composerDraft || {},
          ...l.composerDraft || {}
        }
      }), v = By(
        w.id,
        m?.targetNodeIds
      ), k = jy(
        y.nodes.map(
          (re) => re.id === w.id ? w : re
        ),
        v
      ), $ = new Map(
        k.map((re) => [re.id, re])
      ), O = v.map((re) => $.get(re)).filter((re) => !!re), K = (re) => {
        let De = re;
        for (const Ce of v)
          De[Ce] && (De === re && (De = { ...re }), delete De[Ce]);
        return De;
      }, J = Df(
        l.id,
        k,
        y.edges
      ), oe = zn({
        assetCate: te,
        startNode: w,
        singleNode: !0,
        targetNodeIds: m?.targetNodeIds,
        canvas: y,
        nodes: k,
        runInput: {
          _manual_input_context: J || void 0,
          _agent_turn_input: m?.agentInput,
          manual_node_id: l.id
        }
      });
      for (const re of O)
        et(re.id, { runError: "" });
      oe.setRunningNode?.((re) => {
        const De = { ...re };
        for (const Ce of O) {
          const _n = re[Ce.id];
          De[Ce.id] = {
            ..._n || {},
            nodeId: Ce.id,
            title: Ce.title,
            startedAt: _n?.startedAt || Date.now(),
            progress: Math.max(_n?.progress || 0, 8),
            status: "running",
            ...Ce.id === w.id && m?.agentInput ? { agent: Xu() } : {}
          };
        }
        return De;
      });
      try {
        await Vi(oe), await hn(oe);
      } catch (re) {
        if (Co(re)) {
          et(w.id, { runError: "" }), oe.setRunningNode?.(K);
          return;
        }
        throw et(w.id, {
          runError: re instanceof Error ? re.message : "节点运行失败"
        }), oe.setRunningNode?.((De) => ({
          ...De,
          [w.id]: {
            ...De[w.id] || {
              nodeId: w.id,
              title: w.title,
              startedAt: Date.now()
            },
            progress: 92,
            status: "error"
          }
        })), window.setTimeout(() => {
          oe.setRunningNode?.(K);
        }, 1400), re;
      } finally {
        await Bn(oe);
      }
    },
    [
      te,
      V,
      zn,
      hn,
      Bn,
      i,
      et
    ]
  ), yi = A(
    async (l) => {
      if (!te)
        throw new Error("当前分类不存在");
      return FN({
        node: l,
        projectId: r,
        canvasId: V.id,
        assetCate: te,
        inputContext: l.inputContext || null,
        onNodeResult: et,
        onAssetCreated: tt,
        onRunStartNode: us,
        onOpenImportPicker: go
      });
    },
    [
      V.id,
      te,
      go,
      r,
      us,
      et,
      tt
    ]
  );
  pe(() => {
    i && mn(Bt, V, i);
  }, [V, mn, Bt, i]);
  async function Or() {
    const l = M.current[String(u.current)] || V;
    if (!l.id)
      return !0;
    try {
      return await tn(l), !0;
    } catch {
      return !1;
    }
  }
  function lr() {
    X([]), Jt({}), Xt({}), Qe(null), wt(null), Ot(null), dt(null), zt(void 0), ln(!1), Tn(""), je.current = null, Ar(null), Vt(!1);
  }
  async function ho(l) {
    if (l === u.current) return !0;
    if (F.current != null)
      return !1;
    const m = i?.canvasList.find((w) => w.id === l);
    if (!m)
      return U.error("目标画布不存在"), !1;
    if (!await Or()) return !1;
    const y = String(l);
    if (!Object.prototype.hasOwnProperty.call(M.current, y)) {
      F.current = m.assetCateId, C(m.assetCateId);
      try {
        const w = await bo({
          projectId: r,
          canvasId: l
        }), v = Kr(
          $r(w.canvas, Le),
          w.assets
        );
        c(
          ($) => $ && {
            ...$,
            assets: jr($.assets, w.assets),
            canvasList: w.canvasList.length > 0 ? w.canvasList : $.canvasList
          }
        );
        const k = {
          ...M.current,
          [y]: v
        };
        M.current = k, se(k), nn(v);
      } catch (w) {
        return U.error(w instanceof Error ? w.message : "加载画布失败"), !1;
      } finally {
        F.current = null, C(null);
      }
    }
    if (u.current = l, f(l), N.current = m.assetCateId, S(m.assetCateId), Vr(l), lr(), !i)
      return !0;
    const _ = M.current[y] || Pc(m.assetCateId, l, m.name);
    return mn(Bt, _, i), kt(
      r,
      i,
      M.current,
      "recovery",
      { canvasId: l }
    ), !0;
  }
  async function fs(l) {
    const m = (i?.canvasList || []).filter((y) => y.assetCateId === l).sort((y, _) => y.sort - _.sort || y.id - _.id)[0];
    if (m) return ho(m.id);
    if (!i || F.current != null || !await Or()) return !1;
    F.current = l, C(l);
    try {
      const y = await bo({
        projectId: r,
        canvasId: 0,
        assetCateId: l
      }), _ = Kr(
        $r(y.canvas, Le),
        y.assets
      ), w = _.id, v = {
        ...M.current,
        [String(w)]: _
      };
      return M.current = v, se(v), nn(_), c(
        (k) => k && {
          ...k,
          assets: jr(k.assets, y.assets),
          canvasList: y.canvasList.length > 0 ? y.canvasList : k.canvasList
        }
      ), u.current = w, f(w), N.current = l, S(l), Vr(w), lr(), kt(r, i, v, "recovery", {
        canvasId: w
      }), !0;
    } catch (y) {
      return U.error(y instanceof Error ? y.message : "加载输出类型失败"), !1;
    } finally {
      F.current = null, C(null);
    }
  }
  async function hi(l) {
    if (te) {
      if (!await Or())
        throw new Error("当前画布保存失败，未创建新画布");
      try {
        const m = await iy({
          projectId: r,
          assetCateId: te.id,
          name: l
        }), y = m.canvas;
        if (!y?.id) throw new Error("新画布数据为空");
        const _ = $r(y, Le), w = {
          ...M.current,
          [String(y.id)]: _
        };
        M.current = w, se(w), nn(_), c(
          (v) => v && {
            ...v,
            canvasList: m.canvasList,
            initialCanvasId: y.id,
            initialAssetCateId: y.assetCateId
          }
        ), u.current = y.id, f(y.id), N.current = y.assetCateId, S(y.assetCateId), Vr(y.id), lr(), U.success("画布已创建");
      } catch (m) {
        throw U.error(m instanceof Error ? m.message : "创建画布失败"), m;
      }
    }
  }
  async function wi(l, m) {
    try {
      const y = await ay({ projectId: r, canvasId: l, name: m });
      c(
        (_) => _ && { ..._, canvasList: y.canvasList }
      ), se((_) => {
        const w = _[String(l)];
        if (!w) return _;
        const v = {
          ..._,
          [String(l)]: { ...w, name: m }
        };
        return M.current = v, v;
      }), U.success("画布已重命名");
    } catch (y) {
      throw U.error(y instanceof Error ? y.message : "重命名画布失败"), y;
    }
  }
  async function _i(l) {
    if (te)
      try {
        const m = await cy({
          projectId: r,
          assetCateId: te.id,
          canvasIds: l
        });
        c(
          (y) => y && { ...y, canvasList: m.canvasList }
        );
      } catch (m) {
        throw U.error(m instanceof Error ? m.message : "调整画布顺序失败"), m;
      }
  }
  async function bi(l) {
    try {
      const m = l === u.current, y = M.current[String(l)];
      y && await tn(y);
      const _ = await dy({ projectId: r, canvasId: l });
      if (ai(l), c(
        (w) => w && { ...w, canvasList: _.canvasList }
      ), M.current[String(l)]) {
        const w = { ...M.current };
        delete w[String(l)], M.current = w, se(w);
      }
      if (m && _.activeCanvasId) {
        const w = _.canvasList.find(
          (k) => k.id === _.activeCanvasId
        );
        let v = M.current[String(_.activeCanvasId)];
        if (!v) {
          const k = await bo({
            projectId: r,
            canvasId: _.activeCanvasId
          });
          v = Kr(
            $r(k.canvas, Le),
            k.assets
          );
          const $ = {
            ...M.current,
            [String(v.id)]: v
          };
          M.current = $, se($), c(
            (O) => O && {
              ...O,
              assets: jr(O.assets, k.assets),
              canvasList: _.canvasList
            }
          );
        }
        nn(v), u.current = v.id, f(v.id), N.current = w?.assetCateId || v.assetCateId, S(w?.assetCateId || v.assetCateId), Vr(v.id), lr(), i && kt(
          r,
          i,
          M.current,
          "recovery",
          { canvasId: v.id }
        );
      }
      mo(N.current), U.success("画布已删除");
    } catch (m) {
      throw U.error(m instanceof Error ? m.message : "删除画布失败"), m;
    }
  }
  async function Ii(l) {
    try {
      if (!await Or())
        throw new Error("当前画布保存失败，未恢复画布");
      const m = await ly({ projectId: r, canvasId: l });
      if (!m.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let y = m.canvas, _ = [], w = m.canvasList, v = "";
      try {
        const O = await bo({
          projectId: r,
          canvasId: m.canvas.id
        });
        y = O.canvas, _ = O.assets, O.canvasList.length > 0 && (w = O.canvasList);
      } catch (O) {
        v = O instanceof Error ? `画布已恢复，但资产加载失败：${O.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const k = Kr(
        $r(y, Le),
        _
      ), $ = {
        ...M.current,
        [String(k.id)]: k
      };
      M.current = $, se($), nn(k), c(
        (O) => O && {
          ...O,
          assets: jr(O.assets, _),
          canvasList: w,
          initialCanvasId: k.id,
          initialAssetCateId: k.assetCateId
        }
      ), u.current = k.id, f(k.id), N.current = k.assetCateId, S(k.assetCateId), Vr(k.id), L(
        (O) => O.filter((K) => K.id !== k.id)
      ), D(!1), lr(), i && kt(r, i, $, "recovery", {
        canvasId: k.id
      }), v ? U.warning(v) : U.success("画布已恢复");
    } catch (m) {
      throw U.error(m instanceof Error ? m.message : "恢复画布失败"), m;
    }
  }
  function wo(l) {
    Qe((m) => ({
      nodeId: l,
      nonce: (m?.nonce || 0) + 1
    }));
  }
  const Ni = A((l) => {
    Qe((m) => !m || m.nodeId !== l.nodeId || m.nonce !== l.nonce ? m : null);
  }, []);
  async function Si(l, m, y, _, w = {}) {
    if (!or.current) {
      or.current = !0;
      try {
        const v = w.canvasId ? y[String(w.canvasId)] : void 0, k = v ? ue.current.filter(
          (Ce) => Ki(Ce, v)
        ) : ue.current, $ = _ === "active" ? PI(k) : [], O = (w.runIds || []).filter((Ce) => Ce > 0), K = O.length > 0 ? O : _ === "active" ? $.map((Ce) => Number(Ce.run_id || 0)) : [], J = _ === "recovery" && K.length === 0;
        let oe = await Ei({
          projectId: l,
          scope: _,
          canvasId: w.canvasId,
          runIds: K,
          summaryOnly: J
        }), re = qi(oe.items);
        if (J) {
          const Ce = zI(re, y);
          Ce.length === 0 ? re = [] : (oe = await Ei({
            projectId: l,
            scope: _,
            canvasId: w.canvasId,
            runIds: Ce
          }), re = qi(oe.items));
        }
        if (_ === "active" && $.length > 0) {
          const Ce = new Set(re.map($n)), _n = $.filter(
            (lt) => !Ce.has($n(lt))
          );
          if (_n.length > 0) {
            const lt = await Promise.all(
              _n.map(async (_o) => {
                try {
                  const Jf = await Vu({
                    projectId: l,
                    executionId: Number(_o.execution_id || 0),
                    runId: Number(_o.run_id || 0),
                    requestId: String(_o.request_id || "")
                  });
                  return ba(Jf);
                } catch {
                  return null;
                }
              })
            );
            re = Gi(
              re,
              lt.filter(
                (_o) => !!_o
              )
            );
          }
        }
        const De = Gi(
          ue.current,
          re
        );
        ue.current = De, $t(De);
        for (const Ce of Object.values(y))
          mn(re, Ce, m);
      } catch {
      } finally {
        or.current = !1;
      }
    }
  }
  async function fr(l, m = 0) {
    if (rt.current)
      return;
    const y = ut.current[m] || 0;
    rt.current = !0, jt(!0), io("");
    try {
      const _ = await Ei({
        projectId: l,
        canvasId: u.current,
        scope: "history",
        beforeId: y,
        limit: 20
      });
      er(
        qi(_.items)
      ), An(m + 1), tr(_.hasMore);
      const w = ut.current.slice(0, m + 1);
      _.hasMore && _.beforeId > 0 && (w[m + 1] = _.beforeId), ut.current = w;
    } catch (_) {
      io(
        _ instanceof Error ? _.message : "读取画布运行记录失败"
      );
    } finally {
      rt.current = !1, jt(!1);
    }
  }
  const p = le(
    () => Nf(
      Bt.filter(
        (l) => Ki(l, V)
      )
    ),
    [V, Bt]
  ), g = p.length > 0, R = g || df(me);
  async function I(l) {
    const m = !l;
    if (m && (Ye || Ut.size > 0) || !m && l?.some(
      (_) => Ut.has($n(_))
    ))
      return;
    let y = [];
    m && Xe(!0);
    try {
      let _ = l || [], w = 0, v = _.length;
      if (m) {
        const O = await _y(
          r,
          u.current
        );
        _ = O.items.map(vn), w = O.failedCount, v = O.count;
      } else
        _ = EI(_);
      if (v === 0) {
        U.info("当前没有运行中的任务");
        return;
      }
      m || (y = _.map($n), pn((K) => {
        const J = new Set(K);
        for (const oe of y)
          J.add(oe);
        return J;
      }), _ = (await Promise.allSettled(
        _.map(
          (K) => wy({
            projectId: r,
            runId: Number(K.run_id || 0),
            requestId: String(K.request_id || "")
          })
        )
      )).flatMap((K, J) => {
        if (K.status === "rejected")
          return w += 1, [];
        const oe = vn(K.value);
        return [
          {
            ..._[J],
            status: oe.status,
            error: oe.error
          }
        ];
      }));
      const k = FI(_), $ = _.filter((O) => O.status === "canceled");
      if (k.size > 0) {
        const O = (/* @__PURE__ */ new Date()).toISOString(), K = (oe) => oe.map((re) => {
          const De = OI(k, re);
          return De ? { ...re, status: De, updated_at: O } : re;
        }), J = K(ue.current);
        ue.current = J, $t(J), er(K);
      }
      if ($.length > 0) {
        const O = new Set(
          $.flatMap((K) => {
            const J = Us(K), oe = Xo(K);
            return oe ? [...J, oe] : J;
          })
        );
        Xt((K) => {
          if (m && w === 0)
            return af;
          let J = K;
          for (const oe of O)
            J[oe] && (J === K && (J = { ...K }), delete J[oe]);
          return J;
        }), U.success(
          $.length === 1 ? "已停止运行" : `已停止 ${$.length} 个运行`
        );
      } else w === 0 && U.info("任务已经结束，无需停止");
      w > 0 && U.error(
        w === v ? "停止运行失败，请稍后重试" : `${w} 个运行停止失败，请稍后重试`
      ), Lt && fr(
        r,
        Math.max(0, fn - 1)
      ), window.setTimeout(() => sr.current?.(), 0);
    } catch (_) {
      U.error(_ instanceof Error ? _.message : "停止画布运行失败");
    } finally {
      y.length > 0 && pn((_) => {
        const w = new Set(_);
        for (const v of y)
          w.delete(v);
        return w;
      }), m && Xe(!1);
    }
  }
  function T() {
    dr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => I()
    });
  }
  function B(l) {
    dr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => I([l])
    });
  }
  sr.current = i ? () => {
    kt(
      r,
      i,
      M.current,
      "active",
      { canvasId: u.current }
    );
  } : null, pe(() => {
    if (!i || !g)
      return;
    const l = window.setInterval(() => {
      sr.current?.();
    }, mf);
    return () => window.clearInterval(l);
  }, [g, r, i]), pe(() => {
    const l = ir.current, m = ot.current, y = [];
    if (i)
      for (const w of p) {
        const v = w.run, k = String(v.request_id || "").trim();
        !k || pt.current.has(k) || y.push({
          key: `${r}:${k}`,
          canvasId: Number(v.canvas_id || u.current),
          requestId: k,
          run: v,
          managedNodeIds: w.managedNodeIds
        });
      }
    const _ = new Set(y.map((w) => w.key));
    for (const [w, v] of l)
      _.has(w) || (v.controller.abort(), l.delete(w), m.delete(w));
    for (const w of y) {
      const v = l.get(w.key);
      if (v) {
        v.managedNodeIds = w.managedNodeIds;
        for (const O of _a(w.run))
          v.finishedNodeIds.add(O);
        continue;
      }
      const k = new AbortController(), $ = {
        controller: k,
        managedNodeIds: w.managedNodeIds,
        finishedNodeIds: _a(w.run)
      };
      l.set(w.key, $), Qu({
        projectId: r,
        requestId: w.requestId,
        lastId: m.get(w.key) || "0-0",
        signal: k.signal,
        onFrame: (O) => {
          k.signal.aborted || u.current !== w.canvasId || (O.stream_id && m.set(w.key, O.stream_id), xI(
            { setRunningNode: Xt, runningNodeBatcher: Zt },
            O,
            $.managedNodeIds,
            $.finishedNodeIds
          ));
        }
      }).catch(() => {
        !k.signal.aborted && l.get(w.key) === $ && l.delete(w.key);
      });
    }
  }, [r, p, Zt, i]), pe(
    () => () => {
      for (const l of ir.current.values())
        l.controller.abort();
      ir.current.clear(), ot.current.clear();
    },
    []
  );
  function Q(l, m, y) {
    const _ = l.filter(
      (k) => Ki(k, m) && !Ia(k, m)
    );
    if (_.length === 0)
      return;
    const w = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set();
    for (const k of _) {
      const $ = new Set(
        Us(k).filter((K) => v.has(K) ? !1 : (v.add(K), !0))
      );
      if ($.size === 0)
        continue;
      const O = (k.node_results || []).filter((K) => {
        const J = K.node_key;
        return !J || !$.has(J) || w.has(J) ? !1 : (w.add(J), !0);
      });
      H(
        k,
        m,
        y,
        O,
        $
      );
    }
  }
  function H(l, m, y, _ = l.node_results || [], w) {
    const v = UI(l, m.nodes);
    if (!v)
      return;
    const k = Pi(y, m.assetCateId);
    if (!k)
      return;
    const $ = {
      projectId: r,
      canvasId: m.id,
      assetCate: k,
      space: y,
      startNode: v,
      nodes: m.nodes,
      edges: m.edges,
      viewport: m.viewport,
      onNodeResult: (K, J) => sn(m.id, K, J),
      onAssetCreated: tt,
      setRunningNode: Xt,
      requestFlowFeedback: ur,
      requestNodeTitle: (K, J) => yo(m.id, K, J),
      canvasRun: l
    }, O = _.filter((K) => {
      const J = KI(l, K);
      return !J || Pe.current.has(J) ? !1 : (Pe.current.add(J), !0);
    });
    Cf($, O), _f($, O), W($, l, v), Yr($, l, w), bf($, l, w);
  }
  function W(l, m, y) {
    if (m.single_node || String(m.status || "").trim().toLowerCase() !== "success" || !Lo(y.resultOutput))
      return;
    const _ = new Set(
      (m.node_results || []).filter((w) => kn(w) === "success").map((w) => w.node_key).filter(Boolean)
    );
    yn(
      l.canvasId,
      (w) => md({
        canvas: w,
        sourceNodeId: y.id,
        successfulNodeIds: _,
        assetCate: l.assetCate,
        powers: Le
      })
    );
  }
  function G(l, m, y) {
    if (!te)
      return null;
    const _ = Hs(
      l,
      te,
      V.nodes.length,
      m,
      y
    ), w = i ? Pi(i, Sa(_) || te.id) : te;
    l === "asset" && (_.cardinality = w.cardinality);
    const v = l === "asset" && y?.replaceSingleAssetNode ? Sa(_) || Number(w.id || 0) : 0, k = v ? Nd(
      V.nodes,
      V.edges,
      v,
      y?.connectFromNodeId
    ) : null, $ = k ? Sd(
      V.nodes,
      V.edges,
      v,
      y?.connectFromNodeId,
      k.id
    ) : /* @__PURE__ */ new Set(), O = k?.id || _.id, K = Rt?.connection;
    if (gt((J) => {
      let oe = J.edges;
      const re = v ? Nd(
        J.nodes,
        J.edges,
        v,
        y?.connectFromNodeId
      ) : null;
      if (re) {
        const Ce = Sd(
          J.nodes,
          J.edges,
          v,
          y?.connectFromNodeId,
          re.id
        );
        if (oe = J.edges.filter(
          (lt) => !Ce.has(lt.from) && !Ce.has(lt.to)
        ), K) {
          const lt = Id(
            K,
            re.id
          );
          oe = In(oe, lt.source, lt.target);
        } else y?.connectFromNodeId ? oe = In(
          oe,
          y.connectFromNodeId || "",
          re.id
        ) : y?.connectToNodeId && (oe = In(
          oe,
          re.id,
          y.connectToNodeId || ""
        ));
        const _n = J.nodes.filter((lt) => !Ce.has(lt.id)).map(
          (lt) => lt.id === re.id ? Yi(lt, _) : lt
        );
        return {
          ...J,
          nodes: _n,
          edges: Gt(_n, oe)
        };
      }
      if (K) {
        const Ce = Id(K, _.id);
        oe = In(oe, Ce.source, Ce.target);
      } else y?.connectFromNodeId ? oe = In(
        oe,
        y.connectFromNodeId || "",
        _.id
      ) : y?.connectToNodeId && (oe = In(oe, _.id, y.connectToNodeId || ""));
      const De = na(
        [...J.nodes, _],
        _.id,
        { x: _.x, y: _.y }
      );
      return {
        ...J,
        nodes: De,
        edges: Gt(De, oe)
      };
    }), k) {
      const J = Yi(k, _);
      Jt((oe) => {
        const re = { ...oe };
        for (const De of $)
          delete re[De];
        return re[k.id] = {
          ...re[k.id] || {},
          ...dN(J)
        }, re;
      });
    }
    return y?.selectCreated !== !1 && (X([O]), wo(O)), Re("create"), wt(null), k ? Yi(k, _) : _;
  }
  function _e(l, m) {
    if (!te)
      return;
    if (td(V.nodes).has(l.id)) {
      U.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const y = sN(
      l,
      te.id,
      V.nodes.length,
      m
    );
    gt((_) => {
      const w = na(
        [..._.nodes, y],
        y.id,
        { x: y.x, y: y.y }
      );
      return {
        ..._,
        nodes: w,
        edges: Gt(w, _.edges)
      };
    }), Jt((_) => {
      const w = _[l.id];
      return w ? { ..._, [y.id]: w } : _;
    }), X([y.id]), wo(y.id), wt(null), U.success("已复制节点");
  }
  function be(l, m = {}) {
    const y = cf(
      V.nodes,
      l
    );
    if (y.size === 0)
      return;
    const _ = td(V.nodes);
    if (!m.allowStoryboardFrame && [...y].some((w) => _.has(w))) {
      U.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    gt((w) => {
      const v = ag(
        w.nodes,
        y
      ).filter((k) => !y.has(k.id));
      return {
        ...w,
        nodes: v,
        edges: Gt(v, w.edges)
      };
    }), Jt(
      (w) => pd(w, y)
    ), Xt((w) => pd(w, y)), X([]), Qe(
      (w) => w && y.has(w.nodeId) ? null : w
    ), Ot(
      (w) => w && y.has(w.id) ? null : w
    ), dt(
      (w) => w && y.has(w.nodeId) ? null : w
    ), Tn(
      (w) => y.has(w) ? "" : w
    ), je.current && y.has(je.current.id) && (je.current = null), U.success(
      l.length > 1 || y.size > 1 ? `已删除 ${y.size} 个节点` : "已删除节点"
    );
  }
  function ge(l, m) {
    G("asset", m, { asset: l });
  }
  function xe(l, m, y) {
    if (!l)
      return;
    const _ = V.nodes.find((v) => v.id === l) || (y?.id === l ? y : je.current?.id === l ? je.current : null);
    if (!_)
      return;
    const w = $s(m.version?.content) || Ct(m.version?.content);
    et(
      l,
      Kn(
        {
          ..._,
          kind: m.kind || te.kind,
          assetCateId: Number(m.asset_cate_id || te.id || 0)
        },
        {
          output: w,
          asset: m
        },
        "引用资产"
      )
    ), st(l, w);
  }
  async function st(l, m) {
    if (!l)
      return;
    const y = V.edges.filter((_) => _.from === l).map((_) => V.nodes.find((w) => w.id === _.to)).filter(
      (_) => !!_ && _.type === "function" && _.functionOption?.key === "display"
    );
    if (y.length !== 0)
      for (const _ of y)
        et(
          _.id,
          Kn(_, { output: m }, "展示引用结果")
        );
  }
  function bt(l, m = Tr, y = je.current) {
    if (!m) {
      ge(l);
      return;
    }
    if (!(V.nodes.find((w) => w.id === m) || (y?.id === m ? y : je.current?.id === m ? je.current : null))) {
      ge(l), Tn(""), je.current = null;
      return;
    }
    xe(m, l, y);
  }
  async function an(l, m = Tr, y = je.current) {
    if (l.libraryType !== "material") {
      bt(
        jn(l),
        m,
        y
      );
      return;
    }
    if (!ms(l)) {
      U.error("该素材没有可用内容，无法引用");
      return;
    }
    const _ = Number(te?.id || 0), w = m || `new-${Date.now()}`;
    try {
      const v = await Oc({
        projectId: r,
        canvasId: V.id,
        assetCateId: _,
        name: l.name || "素材库资产",
        kind: l.kind,
        content: l.version?.content,
        nodeKey: m,
        requestId: `official-material:${l.id}:${w}`
      }), k = jn(v);
      tt(k), bt(k, m, y);
    } catch (v) {
      U.error(
        v instanceof Error ? v.message : "引用素材库资产失败"
      );
    }
  }
  function cn() {
    ln(!1), Tn(""), je.current = null;
  }
  function qt(l, m) {
    sd(), Ar({ nodeId: l, frameIndex: m }), wt(null), Re("create");
  }
  async function wn(l) {
    const m = Qn;
    if (!m || rr.current)
      return;
    const y = Ee.nodes.find(($) => $.id === m.nodeId);
    if (!y) {
      U.error("宫格节点不存在");
      return;
    }
    const _ = l.filter(
      ($) => $.kind === "image" && ms($)
    ), w = Number.isInteger(m.frameIndex);
    if (w && _.length === 0) {
      U.error("请选择一张图片");
      return;
    }
    if (!w && _.length === 0) {
      U.error("请至少选择一张图片");
      return;
    }
    if (!w && _.length > wr) {
      U.error(`一次最多导入 ${wr} 张图片`);
      return;
    }
    const v = Oa([
      y.asset?.version?.content,
      y.resultOutput
    ]), k = w ? uI(
      v,
      Number(m.frameIndex),
      _[0],
      y.title
    ) : uf(
      _,
      v,
      y.title
    );
    if (!k) {
      U.error("当前宫格内容不可编辑");
      return;
    }
    rr.current = !0;
    try {
      const $ = Number(y.asset?.id || 0), O = Number(
        y.asset?.version?.id || y.asset?.version_id || 0
      ), K = $ > 0 && O > 0 ? await Iy({
        projectId: r,
        assetId: $,
        versionId: O,
        content: k
      }) : await Oc({
        projectId: r,
        canvasId: V.id,
        assetCateId: Number(y.assetCateId || te?.id || 0),
        name: k.title || y.title || "宫格图片",
        kind: "collection",
        content: k,
        nodeKey: y.id,
        requestId: `storyboard-grid-import:${y.id}:${Date.now()}`
      }), J = Un(
        K,
        y.asset
      );
      tt(J), et(
        y.id,
        vs(y, J)
      ), U.success(w ? "宫格图片已替换" : "图片已导入宫格");
    } catch ($) {
      U.error($ instanceof Error ? $.message : "导入宫格图片失败");
    } finally {
      rr.current = !1;
    }
  }
  function vi(l, m) {
    G("power", m, { power: l });
  }
  function Ci(l = "") {
    go(l);
  }
  async function zr(l, m) {
    const y = await Lh({
      projectID: r,
      canvasID: V.id,
      teamID: Number(i?.project.team_id || 0),
      files: l,
      onProgress: m?.onProgress
    }), _ = [];
    for (const w of y) {
      const v = jn(w.asset);
      v.id && tt(v);
      const k = sm(w.asset);
      k.id && _.push(k);
    }
    return _;
  }
  function Ri(l, m) {
    G("agent", m, { role: l });
  }
  function xi(l, m) {
    G("flow", m, { flow: l });
  }
  function ki(l) {
    G("group", l);
  }
  function Ti(l, m) {
    const y = G("function", m, { functionOption: l });
    l.key === "import" && (je.current = y, Ci(y?.id || ""));
  }
  function jf(l, m, y) {
    V_(), Re("create"), wt({
      x: l.x,
      y: l.y,
      position: m,
      connection: y
    }), es();
  }
  function Lf() {
    oo(Zn === "dark" ? "light" : "dark");
  }
  const Vf = it((l) => {
    X(l), wt(null);
  }), Uf = it(jf), Kf = it(G), qf = it(_e), Gf = it(be), Hf = it(
    (l) => gt((m) => ({ ...m, nodes: l }))
  ), Wf = it(
    (l) => gt((m) => ({ ...m, edges: l }))
  ), Yf = it(
    (l) => gt((m) => m.nodes.length === 0 && m.edges.length === 0 ? m : { ...m, viewport: l })
  ), Xf = it(
    qt
  );
  if (Jn)
    return null;
  if (Jo || !i || !te)
    return /* @__PURE__ */ d("main", { className: `ws-page is-${Zn} ws-loading-screen`, children: /* @__PURE__ */ d("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ d("span", { children: Jo || "创作空间不存在" }) }) });
  const {
    launcherVisible: Zf,
    panelVisible: Ic
  } = pb(i.assistant.available, $e);
  return /* @__PURE__ */ E(
    "main",
    {
      className: `ws-page is-${Zn} is-${de}-view ${Ic ? "is-assistant-open" : ""} ${fe ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${Te}px`
      },
      children: [
        /* @__PURE__ */ d(
          iI,
          {
            activeCate: te,
            mode: de,
            interactive: de === "create",
            canvasCount: po.length,
            activeCanvasName: V.name,
            canvasManagerOpen: ie,
            onOpenCanvasManager: Er,
            nodes: Ee.nodes,
            edges: Ee.edges,
            viewport: V.viewport,
            canvasId: V.id,
            selectedNodeId: ee,
            selectedNodeIds: q,
            onSelectNodes: Vf,
            onOpenNodeMenu: Uf,
            onAddConfiguredNode: Kf,
            onCopyNode: qf,
            onDeleteNodes: Gf,
            onShowNodeDetail: fi,
            onNodesCommit: Hf,
            onEdgesCommit: Wf,
            onConnectedMediaEdgeRemove: ds,
            onViewportCommit: Yf,
            focusNodeRequest: We,
            onFocusNodeRequestConsumed: Ni,
            projectId: r,
            space: i,
            canvasReferenceItems: as,
            catalogCache: s,
            runningNodes: me,
            setRunningNode: Xt,
            onNodeResult: et,
            onNodeDraftChange: cs,
            onAssetCreated: tt,
            canvasRunRecords: Bt,
            stoppingCanvasRunKeys: Ut,
            onStopCanvasRun: B,
            onRunStoryboardFrame: gi,
            onRunFunctionNode: yi,
            onRunBackendNode: ls,
            onOpenStoryboardGridImport: Xf,
            onClearFeedbackRecords: Kt,
            requestConfirm: dr,
            onOpenFeedbackRecord: mi
          }
        ),
        /* @__PURE__ */ d(
          nI,
          {
            space: i,
            cates: ts,
            activeCate: te,
            canvases: po,
            activeCanvas: V,
            saveStatus: ar[String(V.id)] || "saved",
            hasAssetCates: rn,
            loadingCateId: b,
            onBack: () => t({ to: "/bot/work" }),
            onSelectCate: fs,
            onRefresh: cr,
            onOpenRunHistory: () => {
              Vt(!0), fr(r, 0);
            },
            onRunHistoryIntent: W_,
            canStopRuns: R,
            stoppingRuns: Ye || Ut.size > 0,
            onStopRuns: T,
            theme: Zn,
            onToggleTheme: Lf
          }
        ),
        ie ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ d(
              X_,
              {
                open: !0,
                canvases: po,
                deletedCanvases: z,
                deletedLoading: Y,
                activeCanvasId: V.id,
                disabled: b != null,
                onClose: () => D(!1),
                onSelect: ho,
                onCreate: hi,
                onRename: wi,
                onReorder: _i,
                onDelete: bi,
                onRestore: Ii
              }
            )
          }
        ) : null,
        Ic ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${Te}px`
                },
                children: /* @__PURE__ */ d(Oe, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ d(
              Q_,
              {
                assistant: i.assistant,
                project: i.project,
                team: i.team,
                activeAssetCateID: te.id,
                activeCanvas: V,
                selectedNodes: di,
                width: Te,
                expanded: fe,
                onWidthChange: li,
                onToggleExpanded: () => ct((l) => !l),
                onClose: () => ss(!1),
                onFlushCanvas: tn,
                onCanvasChanged: ui,
                onUploadAssets: zr
              }
            )
          }
        ) : null,
        Zf ? /* @__PURE__ */ d(
          ub,
          {
            assistantName: i.assistant.name,
            onIntent: eb,
            onOpen: () => ss(!0)
          }
        ) : null,
        Lt ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ d(
              H_,
              {
                open: !0,
                runs: Qo,
                loading: Dr,
                error: so,
                page: fn,
                hasNextPage: ao,
                onOpenChange: Vt,
                onRefresh: () => fr(r, 0),
                onPreviousPage: () => fr(
                  r,
                  Math.max(0, fn - 2)
                ),
                onNextPage: () => fr(r, fn),
                stoppingRunKeys: Ut,
                onStopRun: B,
                onLocateRun: (l) => {
                  const m = String(l.start_node_id || "");
                  if (!m)
                    return;
                  Vt(!1), (Number(l.canvas_id || 0) ? ho(Number(l.canvas_id)) : fs(Number(l.asset_cate_id || h))).then((_) => {
                    _ && window.requestAnimationFrame(() => wo(m));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ d(
          sI,
          {
            mode: de,
            onModeIntent: (l) => {
              l === "result" && K_();
            },
            onSelectMode: (l) => {
              Re(l), wt(null);
            }
          }
        ),
        un ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ d(
              od,
              {
                open: !0,
                teamID: i.project.team_id,
                scopeProjectID: i.project.id,
                title: "选择资产",
                description: "选择已有资产或上传本地文件，确认后引用到当前画布。",
                initialFilters: {
                  sourceType: "project",
                  projectID: i.project.id,
                  canvasID: V.id
                },
                confirmSelection: !0,
                contentMode: "full",
                validateAsset: (l) => ms(l) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: zr,
                onClose: cn,
                onConfirm: (l) => {
                  const m = l[0];
                  m && an(m);
                }
              }
            )
          }
        ) : null,
        Qn ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ d(
              od,
              {
                open: !0,
                teamID: i.project.team_id,
                scopeProjectID: i.project.id,
                title: Number.isInteger(Qn.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(Qn.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${is} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: i.project.id,
                  canvasID: V.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(Qn.frameIndex),
                maxSelection: is,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (l) => l.kind !== "image" ? "请选择图片资产。" : ms(l) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: zr,
                onClose: () => Ar(null),
                onConfirm: (l) => {
                  wn(l);
                }
              }
            )
          }
        ) : null,
        de === "result" ? /* @__PURE__ */ d("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ d(Fe, { fallback: /* @__PURE__ */ d(Oe, { label: "正在加载资产" }), children: /* @__PURE__ */ d(
          U_,
          {
            teamID: i.project.team_id,
            scopeProjectID: i.project.id,
            scopeCanvasID: V.id,
            onLocalUpload: zr,
            initialFilters: {
              sourceType: "project",
              projectID: i.project.id,
              canvasID: V.id,
              assetCateID: rn ? te.id : 0
            },
            headerAction: /* @__PURE__ */ d(ze, { label: "关闭资产", children: /* @__PURE__ */ E("button", { type: "button", onClick: () => Re("create"), children: [
              /* @__PURE__ */ d($d, { "aria-hidden": "true" }),
              /* @__PURE__ */ d("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        _t ? /* @__PURE__ */ d(
          $N,
          {
            prompt: _t.prompt,
            running: nr,
            readonly: Mh(
              _t,
              Ee.nodes,
              mt.current
            ),
            history: _r(
              Ee.nodes.find(
                (l) => l.id === _t.node.id
              ) || _t.node
            ),
            activeRecordId: _t.recordId,
            onSelectRecord: (l) => {
              const m = Ee.nodes.find(
                (y) => y.id === _t.node.id
              ) || _t.node;
              Ae({
                node: m,
                recordId: l.id,
                prompt: {
                  ...l.prompt,
                  values: l.values || l.prompt.values || {}
                }
              });
            },
            onClose: pi,
            onSubmit: Tt
          },
          `${_t.node.id}-${_t.recordId}`
        ) : null,
        xt ? /* @__PURE__ */ d(
          aI,
          {
            request: xt,
            onClose: () => en(null)
          }
        ) : null,
        Rt ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ d(
              L_,
              {
                menu: Rt,
                flows: on,
                powers: rs,
                powerCategories: ii,
                roles: ns,
                onClose: () => wt(null),
                onSelectFlow: (l) => xi(l, Rt.position),
                onSelectFunction: (l) => Ti(l, Rt.position),
                onSelectGroup: () => ki(Rt.position),
                onSelectRole: (l) => Ri(l, Rt.position),
                onSelectPower: (l) => vi(l, Rt.position)
              }
            )
          }
        ) : null,
        Ke ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ d(
              rb,
              {
                projectId: i.project.id,
                teamId: i.team.id,
                assetCateId: Number(
                  Ke.assetCateId || Ke.asset?.asset_cate_id || te?.id || 0
                ),
                node: Ke,
                storyboardFocus: si,
                canvasNodes: Ee.nodes,
                lipSyncAvailable: os,
                connectedMediaReferences: Mf(
                  Ee.nodes,
                  Ee.edges,
                  Ke.id
                ),
                canvasReferenceItems: as.filter(
                  (l) => l.source !== "current" || l.id !== Ke.id
                ),
                onNodeDraftChange: (l) => {
                  l && (cs(Ke.id, l), Ot(
                    (m) => m?.id === Ke.id ? { ...m, composerDraft: l } : m
                  ));
                },
                onConnectedMediaEdgeRemove: ds,
                onRunNode: ls,
                onAssetUpdated: (l) => {
                  const m = Un(
                    l,
                    Ke.asset
                  );
                  tt(m);
                  const y = vs(
                    Ke,
                    m
                  );
                  Ke.id.startsWith("asset-detail-") || et(Ke.id, y), Ot(
                    (_) => _?.id === Ke.id ? {
                      ..._,
                      ...y
                    } : _
                  );
                },
                onClose: () => {
                  Ot(null), zt(void 0);
                }
              }
            )
          }
        ) : null,
        Qt ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ d(
              q_,
              {
                teamID: i.project.team_id,
                assetID: Qt.assetID,
                layer: "nested",
                onAssetChanged: Fr,
                onClose: () => dt(null)
              }
            )
          }
        ) : null
      ]
    }
  );
}
function nI({
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
  onRunHistoryIntent: S,
  canStopRuns: N,
  stoppingRuns: b,
  onStopRuns: C,
  theme: F,
  onToggleTheme: q
}) {
  const X = Math.max(
    0,
    t.findIndex((ee) => ee.id === n.id)
  );
  return /* @__PURE__ */ E("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ E("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: a,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ d(Sp, { size: 18 })
        }
      ),
      /* @__PURE__ */ E("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ E("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ d("strong", { children: e.project.name }),
          r.length > 1 ? /* @__PURE__ */ E("span", { className: "ws-project-canvas-name", children: [
            /* @__PURE__ */ d("i", { children: "/" }),
            o.name || "第一幕"
          ] }) : null
        ] }),
        /* @__PURE__ */ d("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    i ? /* @__PURE__ */ E(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": X
        },
        children: [
          /* @__PURE__ */ d("span", { className: "ws-cate-indicator" }),
          t.map((ee) => /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: `ws-cate ${ee.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                f(ee.id);
              },
              children: [
                c === ee.id ? /* @__PURE__ */ d(Sn, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ d("span", { className: "ws-cate-name", children: ee.name })
              ]
            },
            ee.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ E("div", { className: `ws-top-actions ${N ? "has-running" : ""}`, children: [
      /* @__PURE__ */ d(rI, { status: s }),
      N ? /* @__PURE__ */ d(ze, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ E(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: b,
          onClick: C,
          children: [
            b ? /* @__PURE__ */ d(Sn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(Bd, { size: 13, fill: "currentColor" }),
            b ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ d(ze, { label: "查看画布运行记录", children: /* @__PURE__ */ E(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: S,
          onFocus: S,
          onClick: h,
          children: [
            /* @__PURE__ */ d(vp, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ E("button", { type: "button", className: "ws-action", onClick: q, children: [
        F === "dark" ? /* @__PURE__ */ d(Cp, { size: 15 }) : /* @__PURE__ */ d(Rp, { size: 15 }),
        F === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ E("button", { type: "button", className: "ws-action", onClick: u, children: [
        /* @__PURE__ */ d(Ta, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function rI({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ d(ze, { label: t, children: /* @__PURE__ */ E("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ d(Sn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(jd, { size: 14 }),
    t
  ] }) });
}
const oI = [
  { key: "create", label: "创作", icon: xp },
  { key: "result", label: "资产", icon: kp }
];
function sI({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ d("nav", { className: "ws-dock", "aria-label": "画布视角", children: oI.map((r) => {
    const o = r.icon;
    return /* @__PURE__ */ E(
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
const iI = xa(function({
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
  selectedNodeId: S,
  selectedNodeIds: N,
  onSelectNodes: b,
  onOpenNodeMenu: C,
  onAddConfiguredNode: F,
  onCopyNode: q,
  onDeleteNodes: X,
  onShowNodeDetail: ee,
  onNodesCommit: Z,
  onEdgesCommit: se,
  onConnectedMediaEdgeRemove: M,
  onViewportCommit: ie,
  focusNodeRequest: D,
  onFocusNodeRequestConsumed: z,
  projectId: L,
  space: Y,
  canvasReferenceItems: ce,
  catalogCache: ve,
  runningNodes: de,
  setRunningNode: Re,
  onNodeResult: $e,
  onNodeDraftChange: ye,
  onAssetCreated: fe,
  canvasRunRecords: ct,
  stoppingCanvasRunKeys: Te,
  onStopCanvasRun: Yt,
  onRunStoryboardFrame: Zn,
  onRunFunctionNode: oo,
  onRunBackendNode: Rt,
  onOpenStoryboardGridImport: wt,
  onClearFeedbackRecords: Jn,
  requestConfirm: ft,
  onOpenFeedbackRecord: xr
}) {
  const [me, Xt] = j(null), [Zt, kr] = j(""), [Jt, Ke] = j(""), [Ot, Qt] = j(""), [dt, si] = j(null), [zt, xt] = j(null), [en, We] = j(""), [Qe, un] = j(null), [ln, Tr] = j(() => /* @__PURE__ */ new Map()), [Tn, Qn] = j(!0), [Ar, Jo] = j(!1), [Mr, Bt] = j(() => /* @__PURE__ */ new Set()), [$t, Qo] = j(1), er = ne(1), Dr = ne(1), jt = ne(null), [so, io] = j(null), Lt = le(
    () => new Set(N),
    [N]
  ), Vt = ne(null), fn = ne(null), An = ne(!1), ao = ne(!1), tr = ne(!1), Ut = ne(null), pn = ne(!1), Ye = ne(f);
  Qi(() => {
    Ye.current = f;
  }, [f]);
  const Xe = A((p) => {
    const g = yr(p);
    er.current = g, jt.current != null && typeof window < "u" && window.cancelAnimationFrame(jt.current), jt.current = null, Dr.current = g, Ad(Vt.current, g), Qo(
      (R) => Math.abs(R - g) > 5e-3 ? g : R
    );
  }, []), _t = A((p) => {
    const g = yr(p);
    if (er.current = g, !(Math.abs(Dr.current - g) <= 5e-3) && jt.current == null) {
      if (typeof window > "u") {
        Dr.current = g, Qo(g);
        return;
      }
      jt.current = window.requestAnimationFrame(() => {
        jt.current = null;
        const R = er.current;
        Dr.current = R, Ad(Vt.current, R);
      });
    }
  }, []);
  pe(
    () => () => {
      jt.current != null && typeof window < "u" && window.cancelAnimationFrame(jt.current);
    },
    []
  );
  const Ae = A(
    (p, g = {}) => {
      const R = Ye.current;
      Ye.current = p, se(p);
      const I = new Set(
        p.filter((H) => dn(H) === "media").map((H) => {
          const W = It(H);
          return `${W.sourceNodeId}\0${W.targetNodeId}`;
        })
      ), T = /* @__PURE__ */ new Map();
      for (const H of R) {
        if (dn(H) !== "media")
          continue;
        const W = It(H), G = `${W.sourceNodeId}\0${W.targetNodeId}`;
        if (I.has(G))
          continue;
        const _e = T.get(W.targetNodeId) || /* @__PURE__ */ new Set();
        _e.add(W.sourceNodeId), T.set(W.targetNodeId, _e);
      }
      const B = new Map(g.draftByNodeId);
      for (const [H, W] of T) {
        const G = a.find((ge) => ge.id === H), _e = G?.composerDraft;
        let be = B.get(H) || _e;
        if (!(!G || !be)) {
          for (const ge of W)
            be = As(
              be,
              ge
            );
          be !== _e ? B.set(G.id, be) : B.delete(G.id);
        }
      }
      const Q = [...B].map(([H, W]) => ({
        nodeId: H,
        draft: W
      }));
      Q.forEach((H, W) => {
        ye(
          H.nodeId,
          H.draft,
          W === Q.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, se, ye]
  ), nr = A(
    (p) => {
      const g = Object.entries(p);
      if (g.length === 0)
        return;
      const R = new Map(g);
      let I = !1;
      const T = Ye.current.map((B) => {
        if (!R.has(B.id))
          return B;
        const Q = R.get(B.id) || void 0;
        return (B.mediaUsage || void 0) === Q ? B : (I = !0, { ...B, mediaUsage: Q });
      });
      I && Ae(T);
    },
    [Ae]
  ), Mn = A(
    (p) => {
      const g = Ye.current.filter((R) => R.id !== p);
      g.length !== Ye.current.length && (Ye.current = g, We((R) => R === p ? "" : R), M(p));
    },
    [M]
  ), je = A(
    (p, g) => {
      const R = Ye.current, I = R.filter((Q) => {
        const H = It(Q);
        return !(dn(Q) === "media" && H.sourceNodeId === p && H.targetNodeId === g);
      });
      if (I.length !== R.length) {
        We(""), Ae(I);
        return;
      }
      const T = a.find((Q) => Q.id === g);
      if (!T?.composerDraft)
        return;
      const B = As(
        T.composerDraft,
        p
      );
      B !== T.composerDraft && ye(g, B, { save: "immediate" });
    },
    [Ae, a, ye]
  ), rr = A(
    (p, g) => {
      if (Qt(""), !r)
        return;
      const R = Zy(a, p, g);
      R !== a && Z(R);
    },
    [r, a, Z]
  ), Dn = A(
    (p, g) => {
      if (Qt(""), !r)
        return;
      const R = Jy(a, p, g);
      R !== a && Z(R);
    },
    [r, a, Z]
  ), Pe = ne({
    onNodeResult: $e,
    onNodeDraftChange: ye,
    onAssetCreated: fe,
    onRunFunctionNode: oo,
    onOpenStoryboardGridImport: wt,
    onClearFeedbackRecords: Jn,
    onOpenFeedbackRecord: xr,
    onShowNodeDetail: ee,
    requestConfirm: ft,
    onRunBackendNode: Rt,
    onConnectedMediaUsagesChange: nr,
    onConnectedMediaEdgeRemove: Mn,
    onTextParamConnectionRemove: je,
    onNodeResizeStart: Qt,
    onNodeResizeEnd: rr,
    onResultViewResizeEnd: Dn
  });
  Qi(() => {
    Pe.current = {
      onNodeResult: $e,
      onNodeDraftChange: ye,
      onAssetCreated: fe,
      onRunFunctionNode: oo,
      onOpenStoryboardGridImport: wt,
      onClearFeedbackRecords: Jn,
      onOpenFeedbackRecord: xr,
      onShowNodeDetail: ee,
      requestConfirm: ft,
      onRunBackendNode: Rt,
      onConnectedMediaUsagesChange: nr,
      onConnectedMediaEdgeRemove: Mn,
      onTextParamConnectionRemove: je,
      onNodeResizeStart: Qt,
      onNodeResizeEnd: rr,
      onResultViewResizeEnd: Dn
    };
  }, [
    fe,
    Jn,
    ye,
    $e,
    xr,
    wt,
    Rt,
    oo,
    ee,
    Mn,
    je,
    ft,
    rr,
    Dn,
    nr
  ]);
  const Pn = le(
    () => ({
      onNodeResult: (p, g) => Pe.current.onNodeResult(p, g),
      onNodeDraftChange: (p, g, R) => Pe.current.onNodeDraftChange(p, g, R),
      onAssetCreated: (p) => Pe.current.onAssetCreated(p),
      onRunFunctionNode: (p) => Pe.current.onRunFunctionNode(p),
      onOpenStoryboardGridImport: (p, g) => Pe.current.onOpenStoryboardGridImport(p, g),
      onClearFeedbackRecords: (p) => Pe.current.onClearFeedbackRecords(p),
      onOpenFeedbackRecord: (p, g) => Pe.current.onOpenFeedbackRecord(p, g),
      onShowNodeDetail: (p, g) => Pe.current.onShowNodeDetail(p, g),
      requestConfirm: (p) => Pe.current.requestConfirm(p),
      onRunBackendNode: (p, g) => Pe.current.onRunBackendNode(p, g),
      onConnectedMediaUsagesChange: (p) => Pe.current.onConnectedMediaUsagesChange(p),
      onConnectedMediaEdgeRemove: (p) => Pe.current.onConnectedMediaEdgeRemove(p),
      onTextParamConnectionRemove: (p, g) => Pe.current.onTextParamConnectionRemove(
        p,
        g
      ),
      onNodeResizeStart: (p) => Pe.current.onNodeResizeStart(p),
      onNodeResizeEnd: (p, g) => Pe.current.onNodeResizeEnd(p, g),
      onResultViewResizeEnd: (p, g) => Pe.current.onResultViewResizeEnd(p, g)
    }),
    []
  ), ue = le(
    () => iN(a, f),
    [f, a]
  ), or = le(
    () => h_(
      a,
      (p) => ue.hasResultByNodeId.get(p.id) || !1
    ),
    [ue.hasResultByNodeId, a]
  ), rt = or.frames, ut = le(() => {
    const p = new Set(rt.map((g) => g.id));
    return new Set(
      [...Mr].filter(
        (g) => p.has(g)
      )
    );
  }, [Mr, rt]), sr = le(
    () => new Map(
      rt.map((p) => [
        p.id,
        Ml(
          p,
          a,
          (g) => ue.hasResultByNodeId.get(g.id) || !1,
          ue.nodeById
        )
      ])
    ),
    [
      ue.hasResultByNodeId,
      ue.nodeById,
      a,
      rt
    ]
  ), ir = le(() => {
    const p = /* @__PURE__ */ new Map();
    for (const g of ct) {
      if (!Xo(g))
        continue;
      const R = Number(g.canvas_id || 0);
      if (R > 0 && R !== h)
        continue;
      const I = String(g.start_node_id || "").trim();
      I && !p.has(I) && p.set(I, g);
    }
    return p;
  }, [h, ct]), ot = le(
    () => new Map(rt.map((p) => [p.id, p])),
    [rt]
  ), pt = or.sourceNodeIds, mt = or.sourceNodeIdByNodeId, En = le(() => {
    const p = /* @__PURE__ */ new Set();
    for (const g of rt)
      if (ut.has(g.id))
        for (const R of g.memberNodeIds)
          p.add(R);
    return p;
  }, [ut, rt]), Le = A(
    (p) => {
      const g = ot.get(p), R = Vt.current?.getBoundingClientRect();
      if (!g || !me || !R)
        return;
      const I = nd(
        g,
        ut.has(g.id)
      ), T = Math.max(1, R.width - 144), B = Math.max(1, R.height - 144), Q = Math.max(
        0.35,
        Math.min(
          0.9,
          T / I.width,
          B / I.height
        )
      );
      me.setCenter?.(
        I.x + I.width / 2,
        I.y + I.height / 2,
        { zoom: Q, duration: 320 }
      ), Xe(Q);
    },
    [
      ut,
      me,
      Xe,
      ot
    ]
  ), ii = A(
    (p) => {
      const g = ot.get(p);
      if (!g)
        return;
      const R = !ut.has(p);
      if (Bt((I) => {
        const T = new Set(I);
        return T.has(p) ? T.delete(p) : T.add(p), T;
      }), R) {
        const I = new Set(g.memberNodeIds);
        b(
          N.filter((T) => !I.has(T))
        ), kr(""), We(""), xt(null);
      }
    },
    [
      ut,
      b,
      N,
      ot
    ]
  ), co = it(Zn), uo = it(ft), es = it(Yt), lo = it(Le), fo = it(ii), Fn = le(
    () => a.map((p) => p.id).join("\0"),
    [a]
  ), On = le(
    () => new Set(
      Fn ? Fn.split("\0") : []
    ),
    [Fn]
  ), tn = le(
    () => Fn ? `${t.id}:${Fn}` : "",
    [t.id, Fn]
  ), nn = le(
    () => df(de),
    [de]
  ), ai = le(() => {
    const p = (I) => ue.hasResultByNodeId.get(I.id) || !1, g = a.filter((I) => !En.has(I.id)).map((I) => {
      const T = { x: I.x, y: I.y }, B = Lt.has(I.id), Q = B && N.length === 1 && Ca(I), H = I.type === "power" ? Wn(I.power, I.kind, I.outputType).viewMode : "", W = Q, G = W ? Y : null, _e = W || H === "storyboard" || H === "video_compose" ? ce : Lb, be = (H === "video_compose" || Q) && ue.incomingMediaReferencesByNodeId.get(I.id) || ld, ge = pt.has(I.id), xe = mt.get(I.id) || "", st = xe && ue.nodeById.get(xe) || null, bt = xe ? ir.get(xe) : void 0, an = !!(xe && (bt && Qr(bt) || St(
        de[Js(xe)]
      ))), cn = `ws-flow-node ws-flow-node-${I.type}`, qt = de[I.id] || null, wn = I.type === "group" && ue.groupMembersById.get(I.id) || ud, vi = I.type === "group" ? Gu({
        members: wn,
        runningNodes: de,
        groupState: qt,
        hasResult: p
      }) : null, Ci = I.type === "function" && I.functionOption?.key === "start" ? nn : !1, zr = ue.inputContextByNodeId.get(I.id) || null, Ri = an ? "制作区正在执行" : ue.runBlockedReasonByNodeId.get(I.id) || "", xi = {
        ...I,
        sourceNode: I,
        projectId: L,
        canvasId: h,
        space: G,
        catalogCache: ve,
        runningNode: qt,
        groupMembers: wn,
        groupRuntime: vi,
        canvasHasRunningNode: Ci,
        canvasReferenceItems: _e,
        connectedMediaReferences: be,
        interactive: r,
        structureLocked: ge,
        storyboardSourceNode: st,
        storyboardFrameRunning: an,
        runBlockedReason: Ri,
        showNodeSettings: Q,
        setRunningNode: Re,
        ...Pn,
        inputContext: zr
      }, ki = I.type === "group" ? 1 : I.groupId ? 3 : 2, Ti = Bf(I);
      return {
        id: I.id,
        type: "workSpace",
        position: T,
        data: xi,
        selected: B,
        className: cn,
        draggable: r && !ge,
        deletable: !ge,
        zIndex: ki,
        ...kd(Ti)
      };
    });
    return [...rt.map((I) => {
      const T = ut.has(I.id), B = nd(I, T), Q = sr.get(I.id), H = ir.get(
        I.sourceNodeId
      ), W = H && Qr(H) ? H : void 0, G = !!W || St(de[I.id]), _e = I.memberNodeIds.some(
        (cn) => St(de[cn])
      ), be = G ? "" : _e ? "制作区内有节点正在执行" : Q?.blockedReason || "", ge = MI(
        I,
        W,
        de,
        ue.nodeById
      ) || (G ? "准备执行" : ""), xe = !!(W && Te.has($n(W))), st = DI(
        H,
        de[I.id],
        xe
      ), bt = {
        type: "storyboardFrame",
        frameId: I.id,
        sourceNodeId: I.sourceNodeId,
        title: I.title,
        groupCount: I.groupCount,
        workNodeCount: I.workNodeCount,
        completedCount: I.completedCount,
        running: G,
        stopping: xe,
        executionStatus: st,
        currentNodeTitle: ge,
        runBlockedReason: be,
        collapsed: T,
        onRun: () => {
          const cn = Q?.pendingNodeIds.length || 0, qt = Math.max(0, I.workNodeCount - cn);
          uo({
            title: `执行“${I.title}”制作区？`,
            description: `将执行 ${cn} 个待处理节点${qt > 0 ? `，跳过 ${qt} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
            confirmText: "执行制作区",
            tone: "primary",
            onConfirm: () => co(I.sourceNodeId)
          });
        },
        onStop: W ? () => es(W) : void 0,
        onFocus: () => lo(I.id),
        onToggleCollapsed: () => fo(I.id)
      }, an = Lt.has(I.id);
      return {
        id: I.id,
        type: "storyboardFrame",
        position: { x: B.x, y: B.y },
        data: bt,
        selected: an,
        className: "ws-flow-node ws-flow-node-storyboard-frame",
        zIndex: 0,
        draggable: r,
        selectable: r,
        connectable: !1,
        deletable: !1,
        focusable: r,
        dragHandle: ".ws-storyboard-frame-header",
        ...kd(B)
      };
    }), ...g];
  }, [
    ut,
    ue,
    ir,
    En,
    r,
    pt,
    a,
    h,
    L,
    de,
    N.length,
    Lt,
    Re,
    Y,
    ve,
    ce,
    nn,
    lo,
    co,
    uo,
    Pn,
    rt,
    sr,
    mt,
    Te,
    es,
    fo
  ]), { flowNodes: Pr, setFlowNodes: ar } = Yy(
    ai,
    Jt || Ot
  ), kt = A(
    (p) => {
      r && (We(""), Ae(f.filter((g) => g.id !== p)));
    },
    [Ae, f, r]
  ), mn = A(
    (p) => {
      !r || !f.some((g) => g.id === p) || ft({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => kt(p)
      });
    },
    [kt, f, r, ft]
  ), cr = A(
    (p) => {
      if (!r || p.length === 0)
        return;
      const g = cf(a, p);
      if (g.size === 0)
        return;
      if ([...g].some(
        (T) => pt.has(T)
      )) {
        U.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const R = p.length === 1 ? p[0] : null, I = p.some((T) => T.type === "group");
      ft({
        title: R ? `删除「${R.title}」` : `删除 ${g.size} 个节点`,
        description: I ? "会同时删除组内节点，并移除与这些节点相连的连线。" : R ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          We(""), X(p);
        }
      });
    },
    [
      r,
      pt,
      a,
      X,
      ft
    ]
  ), dr = A(
    (p, g = []) => {
      if (!r || p.length === 0)
        return;
      const R = new Set(
        p.flatMap((W) => W.memberNodeIds)
      ), I = /* @__PURE__ */ new Set([
        ...R,
        ...g.map((W) => W.id)
      ]), T = a.filter((W) => I.has(W.id));
      if (T.length === 0)
        return;
      const B = p.length === 1 && g.every((W) => R.has(W.id)) ? p[0] : null, Q = T.filter(
        (W) => W.type === "group"
      ).length, H = T.length - Q;
      ft({
        title: B ? `删除「${B.title}」制作区` : `删除 ${T.length} 个节点`,
        description: B ? `将删除其中 ${Q} 个分组和 ${H} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          We(""), X(T, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, a, X, ft]
  ), gn = le(
    () => f.filter(
      (p) => On.has(p.from) && On.has(p.to) && !En.has(p.from) && !En.has(p.to)
    ).map((p) => {
      const g = It(p), R = ue.nodeById.get(
        g.sourceNodeId
      ), I = ue.nodeById.get(
        g.targetNodeId
      ), T = Mi(
        I?.composerDraft,
        g.sourceNodeId,
        ln.get(g.targetNodeId)
      ), B = !!(dn(p) === "media" && I?.type === "power" && I.power && (T || Br(R))), Q = ln.get(
        g.targetNodeId
      ), H = B && I && Q ? Li(
        I,
        Q,
        g.sourceNodeId
      ) : void 0, W = gs(I), G = B ? Qm(
        T,
        H,
        W
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
          purpose: dn(p),
          executionMode: p.executionMode,
          mediaUsage: p.mediaUsage,
          bindingLabel: G?.label,
          bindingInteractive: G?.interactive,
          bindingShowChevron: G?.showChevron,
          bindingInvalid: G?.invalid
        }
      };
    }),
    [
      ln,
      On,
      ue.nodeById,
      f,
      En
    ]
  );
  pe(() => {
    if (!me || !tn || D || u.zoom != null || typeof window > "u")
      return;
    const p = setTimeout(() => {
      me.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(p);
  }, [tn, me, D, u.zoom]), pe(() => {
    if (!me || !D || typeof window > "u")
      return;
    const p = a.find((I) => I.id === D.nodeId);
    if (!p) {
      z(D);
      return;
    }
    const g = rt.find(
      (I) => ut.has(I.id) && I.memberNodeIds.includes(p.id)
    );
    if (g) {
      const I = window.setTimeout(() => {
        Bt((T) => {
          const B = new Set(T);
          return B.delete(g.id), B;
        });
      }, 0);
      return () => window.clearTimeout(I);
    }
    const R = window.setTimeout(() => {
      const I = { x: p.x, y: p.y }, T = p.type === "power" ? 1.02 : 0.96;
      me.setCenter?.(
        I.x + (p.width || 180) / 2,
        I.y + (p.height || 180) / 2,
        { zoom: T, duration: 320 }
      ), Xe(T), z(D);
    }, 80);
    return () => window.clearTimeout(R);
  }, [
    ut,
    me,
    Xe,
    D,
    a,
    z,
    rt
  ]);
  const ts = A(
    (p) => {
      if (!r)
        return;
      const g = p.map((T) => {
        if (T.type !== "position" || !T.position)
          return T;
        const B = Ai(
          a,
          T.id,
          T.position
        );
        return B === T.position ? T : {
          ...T,
          position: B,
          ...T.positionAbsolute ? { positionAbsolute: B } : {}
        };
      });
      ar((T) => ip(g, T));
      const R = new Set(N);
      let I = !1;
      for (const T of p)
        T.type === "select" && (I = !0, T.selected ? (R.delete(T.id), R.add(T.id)) : R.delete(T.id));
      I && b([...R]);
    },
    [r, a, b, N, ar]
  ), rn = A(
    (p) => {
      const g = Number(p.composerDraft?.selectedTargetId || 0), R = Number(
        Y.release?.id || Y.project.release_id || 0
      );
      return ve.loadPowerForm(
        {
          projectId: L,
          releaseId: R,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        },
        () => py({
          projectId: L,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        })
      );
    },
    [ve, L, Y.project.release_id, Y.release?.id]
  ), te = le(() => {
    const p = new Set(
      f.flatMap((g) => {
        if (dn(g) !== "media")
          return [];
        const R = It(g), I = ue.nodeById.get(
          R.sourceNodeId
        ), T = ue.nodeById.get(
          R.targetNodeId
        );
        return T?.type === "power" && T.power && Br(I) ? [T.id] : [];
      })
    );
    for (const g of a)
      g.type === "power" && g.power && (Object.keys(g.composerDraft?.paramBindings || {}).length > 0 || g.composerDraft?.storyboardLyricsSourceNodeId) && p.add(g.id);
    return a.filter((g) => p.has(g.id));
  }, [ue.nodeById, f, a]);
  pe(() => {
    if (te.length === 0)
      return;
    let p = !1;
    return Promise.all(
      te.map(
        async (g) => {
          try {
            const R = await rn(g);
            return [g.id, R.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((g) => {
      p || Tr(
        new Map(
          g.filter(
            (R) => !!R
          )
        )
      );
    }), () => {
      p = !0;
    };
  }, [rn, te]);
  const on = A(
    (p, g, R) => {
      const I = a.some((H) => H.id === p), T = a.find((H) => H.id === g);
      if (!I || !T) {
        U.info("节点已变化，请重新连接");
        return;
      }
      const B = Nr(T);
      if (!Zm(
        B,
        R,
        p
      )) {
        U.info("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const Q = og(
        B,
        p,
        R
      );
      Ae(
        Gt(
          a,
          In(Ye.current, p, g)
        ),
        Q !== B ? { draftByNodeId: /* @__PURE__ */ new Map([[T.id, Q]]) } : void 0
      );
    },
    [Ae, a]
  ), ns = A(
    (p, g) => {
      const R = a.find((W) => W.id === p), I = a.find((W) => W.id === g);
      if (!I || !Br(R) || !gs(I)) {
        U.info("节点已变化，请重新连接");
        return;
      }
      const T = Nr(I), B = String(
        T.storyboardLyricsSourceNodeId || ""
      ).trim(), Q = ig(
        T,
        p
      ), H = Ye.current.filter((W) => {
        if (!B || B === p || dn(W) !== "media")
          return !0;
        const G = It(W);
        return !(G.sourceNodeId === B && G.targetNodeId === g);
      });
      H.length !== Ye.current.length && We(""), Ae(
        Gt(
          a,
          In(H, p, g)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[I.id, Q]]) }
      );
    },
    [Ae, a]
  );
  pe(() => {
    for (const p of te) {
      const g = ln.get(p.id);
      if (!g)
        continue;
      const R = f.flatMap((T) => {
        if (dn(T) !== "media")
          return [];
        const B = It(T);
        if (B.targetNodeId !== p.id)
          return [];
        const Q = ue.nodeById.get(
          B.sourceNodeId
        );
        return p.composerDraft?.storyboardLyricsSourceNodeId === B.sourceNodeId ? [] : Br(Q) ? [B.sourceNodeId] : [];
      }), I = eg(
        R,
        p.composerDraft,
        pf(p, g)
      );
      I && on(
        I.sourceNodeId,
        p.id,
        I.targetParamKey
      );
    }
  }, [
    ln,
    ue.nodeById,
    on,
    f,
    te
  ]);
  const rs = A(
    async (p) => {
      if (!r)
        return;
      const g = Ye.current.find(
        (H) => H.id === p
      );
      if (!g)
        return;
      const { sourceNodeId: R, targetNodeId: I } = It(g), T = a.find((H) => H.id === R), B = a.find((H) => H.id === I), Q = Mi(
        B?.composerDraft,
        R
      );
      if (!(B?.type !== "power" || !B.power || !Q && !Br(T)))
        try {
          const H = await rn(B), W = Li(
            B,
            H.params || [],
            R
          ), G = Mi(
            B.composerDraft,
            R,
            H.params || []
          ), _e = gs(B);
          if (Tr((ge) => {
            const xe = new Map(ge);
            return xe.set(I, H.params || []), xe;
          }), We(p), _e) {
            un({
              sourceNodeId: R,
              targetNodeId: I,
              sourceTitle: T?.title || "上游节点",
              targetTitle: B.title || B.power.name,
              params: W,
              selectedParamKey: G?.purpose === "param" ? G.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: G?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const be = ra(W);
          if (be.kind === "unavailable") {
            U.info("当前能力没有可用的文本参数");
            return;
          }
          if (be.kind === "automatic") {
            G?.targetParamKey !== be.targetParamKey && on(
              R,
              I,
              be.targetParamKey
            );
            return;
          }
          un({
            sourceNodeId: R,
            targetNodeId: I,
            sourceTitle: T?.title || "上游节点",
            targetTitle: B.title || B.power.name,
            params: be.params,
            selectedParamKey: G?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (H) {
          U.error(
            H instanceof Error ? H.message : "参数列表加载失败"
          );
        }
    },
    [on, r, rn, a]
  ), os = A(
    (p) => {
      rs(p);
    },
    [rs]
  ), V = le(() => {
    const p = ue.highlightedPathEdgesByNodeId.get(S) || fd, g = ue.highlightedPathEdgesByNodeId.get(Zt) || fd, R = /* @__PURE__ */ new Set([
      ...p,
      ...g
    ]), I = p.size > 0 ? S : g.size > 0 ? Zt : "";
    return gn.map((T) => {
      const B = _N(
        T,
        ue.nodeById,
        Zt,
        S,
        en,
        R,
        I
      ), Q = bN(T, B);
      return {
        ...Q,
        data: {
          ...Q.data,
          onDelete: mn,
          onEditBinding: os
        }
      };
    });
  }, [
    gn,
    ue,
    Zt,
    mn,
    os,
    en,
    S
  ]), po = le(
    () => dt ? [...V, dt] : V,
    [V, dt]
  ), mo = A(
    (p) => {
      if (!r)
        return;
      let g = "", R = !1;
      for (const B of p)
        B.type === "select" && (R = !0, B.selected && (g = B.id));
      R && We(g);
      const I = p.filter(
        (B) => B.type !== "select"
      );
      if (I.length === 0)
        return;
      const T = ap(I, V);
      Ae(uN(T));
    },
    [Ae, V, r]
  ), Er = A(
    async (p, g) => {
      if (Ye.current.some((G) => {
        const _e = It(G);
        return _e.sourceNodeId === p && _e.targetNodeId === g;
      }))
        return;
      const I = a.find((G) => G.id === g), T = a.find((G) => G.id === p), Q = gu(a, p).filter($a);
      let H, W;
      if (I?.type === "power" && I.power && Q.length > 0)
        try {
          const _e = (await rn(I)).params || [], be = Nr(I), ge = Mf(
            a,
            Ye.current,
            g
          ), xe = uu(
            _e,
            be
          ), st = Nm(
            _e,
            xe,
            [
              ...ge.map((wn) => wn.source),
              ...Q
            ]
          ), bt = Sm({
            node: I,
            content: be.promptContent,
            items: ce,
            connections: ge,
            params: _e,
            values: st,
            requestedMode: be.multiImageMode,
            additionalSources: Q
          }), an = bt.active ? bt.mode : void 0;
          if (bt.error) {
            U.error(bt.error);
            return;
          }
          const cn = vm(
            lu(_e, st)
          ), qt = Cm(
            ge,
            cn,
            Q,
            be.promptContent,
            ce,
            an
          );
          if (qt.error) {
            U.error(qt.error);
            return;
          }
          if (H = qt.usage, bt.active && an) {
            const wn = Ha({
              ...be,
              paramValues: st,
              multiImageMode: an
            });
            Ec(wn) !== Ec(be) && (W = wn);
          }
        } catch (G) {
          U.error(
            G instanceof Error ? `媒体用途加载失败，未建立连线：${G.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      else if (I?.type === "power" && I.power && Br(T))
        try {
          const G = await rn(I), _e = Li(
            I,
            G.params || [],
            p
          ), be = gs(I);
          if (Tr((xe) => {
            const st = new Map(xe);
            return st.set(g, G.params || []), st;
          }), be) {
            un({
              sourceNodeId: p,
              targetNodeId: g,
              sourceTitle: T?.title || "上游节点",
              targetTitle: I.title || I.power.name,
              params: _e,
              lyricsAvailable: !0,
              lyricsSelected: !1,
              editing: !1
            });
            return;
          }
          const ge = ra(_e);
          if (ge.kind === "unavailable") {
            U.info("当前能力没有可用的文本参数，未建立连线");
            return;
          }
          if (ge.kind === "automatic") {
            on(
              p,
              g,
              ge.targetParamKey
            );
            return;
          }
          un({
            sourceNodeId: p,
            targetNodeId: g,
            sourceTitle: T?.title || "上游节点",
            targetTitle: I.title || I.power.name,
            params: ge.params,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !1
          });
          return;
        } catch (G) {
          U.error(
            G instanceof Error ? `参数列表加载失败，未建立连线：${G.message}` : "参数列表加载失败，未建立连线"
          );
          return;
        }
      I && W && ye(I.id, W), Ae(
        Gt(
          a,
          In(
            Ye.current,
            p,
            g,
            H
          )
        )
      );
    },
    [
      ce,
      on,
      Ae,
      rn,
      a,
      ye
    ]
  ), ci = A(
    (p) => {
      const g = Qe;
      g && (un(null), on(
        g.sourceNodeId,
        g.targetNodeId,
        p
      ));
    },
    [on, Qe]
  ), Ee = A(() => {
    const p = Qe;
    p?.lyricsAvailable && (un(null), ns(
      p.sourceNodeId,
      p.targetNodeId
    ));
  }, [ns, Qe]), di = A(() => {
    un(null);
  }, []), ui = A(
    (p) => {
      r && (An.current = !0, !(!p.source || !p.target || p.source === p.target) && Er(
        p.source || "",
        p.target || ""
      ));
    },
    [Er, r]
  ), li = A(
    (p, g) => {
      if (!r)
        return;
      const R = String(g?.nodeId || "");
      R && (tr.current = !0, b([]), xt(null)), fn.current = R ? {
        nodeId: R,
        handleId: g?.handleId || null,
        handleType: g?.handleType || null
      } : null, An.current = !1, We("");
    },
    [r, b]
  ), ss = A(
    (p) => {
      if (!r) {
        fn.current = null, An.current = !1;
        return;
      }
      const g = fn.current;
      if (fn.current = null, g?.nodeId && typeof window < "u" && window.setTimeout(() => {
        tr.current = !1;
      }, 0), An.current) {
        An.current = !1;
        return;
      }
      if (!g?.nodeId)
        return;
      const R = SN(p);
      R && (ao.current = !0, C(
        R,
        So(me, R),
        g
      ));
    },
    [me, r, C]
  ), is = A(
    (p, g) => {
      r && (p.preventDefault(), p.stopPropagation(), xt(null), b([]), We(g.id));
    },
    [r, b]
  );
  pe(() => {
    if (!en || typeof window > "u")
      return;
    function p(g) {
      !r || !Rd(g) || (g.preventDefault(), mn(en));
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [r, mn, en]), pe(() => {
    if (N.length === 0 || en || typeof window > "u")
      return;
    function p(g) {
      if (!r || !Rd(g))
        return;
      const R = a.filter(
        (T) => Lt.has(T.id)
      ), I = N.map((T) => ot.get(T)).filter((T) => !!T);
      if (!(R.length === 0 && I.length === 0)) {
        if (g.preventDefault(), I.length > 0) {
          dr(I, R);
          return;
        }
        cr(R);
      }
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [
    r,
    a,
    cr,
    dr,
    en,
    N.length,
    N,
    Lt,
    ot
  ]);
  const qe = A((p) => {
    si(
      (g) => hN(g, p) ? g : p
    );
  }, []), as = A(
    (p) => {
      if (!r)
        return !1;
      const g = a.find(
        (I) => I.id === p.source
      ), R = a.find(
        (I) => I.id === p.target
      );
      return Na(g, R);
    },
    [r, a]
  ), go = A(
    (p, g) => {
      if (!r)
        return;
      const R = ot.get(g.id);
      if (R) {
        const G = Dl(
          R,
          g.position
        ), _e = new Set(R.memberNodeIds);
        ar(
          (be) => be.map((ge) => {
            if (!_e.has(ge.id))
              return ge;
            const xe = a.find((st) => st.id === ge.id);
            return xe ? {
              ...ge,
              position: {
                x: xe.x + G.x,
                y: xe.y + G.y
              }
            } : ge;
          })
        ), qe(null);
        return;
      }
      if (pt.has(g.id)) {
        qe(null);
        return;
      }
      const I = a.find((G) => G.id === g.id);
      if (!I) {
        qe(null);
        return;
      }
      const T = Ai(
        a,
        g.id,
        g.position
      ), B = T === g.position ? g : { ...g, position: T };
      if (I.type === "group") {
        const G = g.position.x - I.x, _e = g.position.y - I.y;
        ar(
          (be) => be.map((ge) => {
            const xe = a.find((st) => st.id === ge.id);
            return xe?.groupId !== I.id ? ge : {
              ...ge,
              position: {
                x: xe.x + G,
                y: xe.y + _e
              }
            };
          })
        ), qe(null);
        return;
      }
      if (V.some(
        (G) => G.source === g.id || G.target === g.id
      )) {
        qe(null);
        return;
      }
      const H = wN(
        B,
        Pr,
        a
      );
      if (!H) {
        qe(null);
        return;
      }
      const W = gN(
        I,
        H.domainNode
      );
      if (!W) {
        qe(null);
        return;
      }
      qe(yN(W));
    },
    [
      V,
      Pr,
      r,
      pt,
      a,
      ar,
      ot,
      qe
    ]
  ), yn = A(
    (p, g) => {
      if (!r) {
        Ke(""), qe(null);
        return;
      }
      const R = ot.get(g.id);
      if (R) {
        const Q = b_(
          a,
          R,
          g.position
        );
        Q !== a && Z(Q), Ke(""), qe(null);
        return;
      }
      if (pt.has(g.id)) {
        Ke(""), qe(null);
        return;
      }
      const I = a.find((Q) => Q.id === g.id);
      let T = !1;
      if (I) {
        const Q = Ai(
          a,
          g.id,
          g.position
        ), H = km(a, g.id, Q), W = na(
          H,
          g.id,
          Q
        );
        T = (I.groupId || "") !== (W.find((_e) => _e.id === I.id)?.groupId || ""), W !== a && Z(W);
        const G = Gt(W, f);
        Ff(f, G) || Ae(G);
      }
      if (Ke(""), T) {
        qe(null);
        return;
      }
      if (!dt) {
        qe(null);
        return;
      }
      V.some(
        (Q) => Q.source === dt.source && Q.target === dt.target
      ) || Er(
        dt.source,
        dt.target
      ), qe(null);
    },
    [
      f,
      Er,
      Ae,
      V,
      r,
      pt,
      Z,
      a,
      dt,
      ot,
      qe
    ]
  ), gt = A(
    (p) => {
      !r || p.button !== 2 || (pn.current = !1, Kb(p.target) && (Ut.current = {
        pointerId: p.pointerId,
        start: { x: p.clientX, y: p.clientY },
        baseNodeIds: p.ctrlKey || p.metaKey ? [...N] : [],
        moved: !1,
        contextMenuHandled: !1
      }, p.preventDefault(), p.stopPropagation(), p.currentTarget.setPointerCapture?.(p.pointerId)));
    },
    [r, N]
  ), sn = A(
    (p) => {
      C(p, So(me, p));
    },
    [me, C]
  ), et = A(
    (p) => {
      const g = Ut.current;
      !r || !g && !pn.current || (p.preventDefault(), p.stopPropagation(), pn.current = !1, g && (g.contextMenuHandled = !0));
    },
    [r]
  ), yo = A(
    (p) => {
      const g = Ut.current;
      if (!g || g.pointerId !== p.pointerId || !me || !Vt.current)
        return;
      const R = p.clientX - g.start.x, I = p.clientY - g.start.y;
      if (!g.moved && Math.hypot(R, I) < 5)
        return;
      g.moved = !0, p.preventDefault(), p.stopPropagation();
      const T = Vt.current.getBoundingClientRect();
      io(
        qb(
          g.start,
          {
            x: p.clientX,
            y: p.clientY
          },
          T
        )
      );
      const B = Gb(
        a,
        So(me, g.start),
        So(me, {
          x: p.clientX,
          y: p.clientY
        })
      );
      b(Hb(g.baseNodeIds, B)), We(""), xt(null);
    },
    [me, a, b]
  ), hn = A(
    (p) => {
      const g = Ut.current;
      !g || g.pointerId !== p.pointerId || (Ut.current = null, p.currentTarget.hasPointerCapture?.(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId), io(null), pn.current = !g.contextMenuHandled, p.preventDefault(), p.stopPropagation(), !g.moved && p.type === "pointerup" && sn({
        x: p.clientX,
        y: p.clientY
      }));
    },
    [sn]
  ), cs = A(
    (p) => {
      if (r) {
        if (ao.current) {
          ao.current = !1;
          return;
        }
        b([]), We(""), xt(null), !(!("detail" in p) || p.detail !== 2) && (p.preventDefault(), p.stopPropagation(), sn({ x: p.clientX, y: p.clientY }));
      }
    },
    [r, b, sn]
  ), ds = A(
    (p) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), pn.current) {
          pn.current = !1;
          return;
        }
        sn({ x: p.clientX, y: p.clientY });
      }
    },
    [r, sn]
  ), fi = A(
    (p, g) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), ot.has(g.id)) {
          We(""), Lt.has(g.id) || b([g.id]), xt({
            nodeId: g.id,
            x: p.clientX,
            y: p.clientY
          });
          return;
        }
        We(""), Lt.has(g.id) || b([g.id]), xt({
          nodeId: g.id,
          x: p.clientX,
          y: p.clientY
        });
      }
    },
    [r, b, Lt, ot]
  ), we = zt && a.find((p) => p.id === zt.nodeId) || null, Kt = zt && ot.get(zt.nodeId) || null, tt = !!(we && pt.has(we.id)), Fr = we && a.find(
    (p) => p.id === w_(a, we)
  ) || null, ur = we ? { x: we.x, y: we.y } : void 0;
  function Tt() {
    xt(null);
  }
  function pi() {
    if (!(!r || !we)) {
      if (tt) {
        U.info("脚本托管节点不能复制，请在分镜脚本中修改结构"), Tt();
        return;
      }
      q(
        we,
        ur ? { x: ur.x + 34, y: ur.y + 34 } : void 0
      ), Tt();
    }
  }
  function mi() {
    if (!r || !we && !Kt)
      return;
    if (Kt) {
      const g = Kt;
      Tt(), dr([g]);
      return;
    }
    if (!we)
      return;
    if (tt) {
      U.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"), Tt();
      return;
    }
    const p = we;
    Tt(), cr([p]);
  }
  function zn() {
    we && (ee(we), Tt());
  }
  function Bn() {
    Fr && (ee(
      Fr,
      kl(we)
    ), Tt());
  }
  function us() {
    if (!we)
      return;
    const p = Xw(we, a);
    if (!p) {
      Tt();
      return;
    }
    ye(we.id, p), U.success("已恢复脚本生成的提示词"), Tt();
  }
  const gi = A(
    (p) => {
      r && (p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "move"));
    },
    [r]
  ), ls = A(
    (p) => {
      if (!r || (p.preventDefault(), !me || !F)) return;
      const g = p.dataTransfer.getData(
        "application/shemic-nodetype"
      );
      if (!g) return;
      const R = p.dataTransfer.getData("application/shemic-detail"), I = R ? JSON.parse(R) : void 0, T = me.screenToFlowPosition ? me.screenToFlowPosition({
        x: p.clientX,
        y: p.clientY
      }) : So(me, {
        x: p.clientX,
        y: p.clientY
      });
      g === "asset" && I ? F("asset", T, { asset: I }) : g === "power" && I ? F("power", T, { power: I }) : g === "agent" && I ? F("agent", T, { role: I }) : g === "flow" && I ? F("flow", T, { flow: I }) : g === "function" && I ? F("function", T, { functionOption: I }) : F(g, T);
    },
    [me, r, F]
  ), yi = A(() => {
    me?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [me]), Or = A(
    (p) => {
      const g = yr(p);
      Xe(g), me?.zoomTo?.(g, { duration: 120 });
    },
    [me, Xe]
  ), lr = A(() => {
    const p = yr($t + 0.12);
    Xe(p), me?.zoomIn?.({ duration: 140 });
  }, [me, Xe, $t]), ho = A(() => {
    const p = yr($t - 0.12);
    Xe(p), me?.zoomOut?.({ duration: 140 });
  }, [me, Xe, $t]), fs = A(() => {
    if (r) {
      if (tr.current) {
        tr.current = !1;
        return;
      }
      We(""), xt(null);
    }
  }, [r]), hi = A(
    (p, g) => {
      r && Ke(g.id);
    },
    [r]
  ), wi = A((p, g) => {
    kr(g.id);
    const R = g.type === "workSpace" ? g.data.sourceNode : null;
    R && Ca(R) && sb();
  }, []), _i = A(() => {
    kr("");
  }, []), bi = A(
    (p) => {
      const g = p;
      Xt(g), u.x != null && u.y != null && u.zoom != null ? (g.setViewport?.({
        x: u.x,
        y: u.y,
        zoom: u.zoom
      }), Xe(u.zoom)) : Xe(g.getZoom?.() || 1);
    },
    [Xe, u.x, u.y, u.zoom]
  ), Ii = A(
    (p, g) => {
      _t(g.zoom);
    },
    [_t]
  ), wo = A(
    (p, g) => {
      Xe(g.zoom), ie({
        x: g.x,
        y: g.y,
        zoom: g.zoom
      });
    },
    [Xe, ie]
  ), Ni = A(() => {
    Qn((p) => !p);
  }, []), Si = A(() => {
    Jo((p) => !p);
  }, []), fr = [
    "ws-canvas-wrap",
    Jt ? "is-dragging" : "",
    so ? "is-selecting" : "",
    Ot ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ E(
    "section",
    {
      ref: Vt,
      className: fr,
      style: VN($t),
      onPointerDownCapture: gt,
      onPointerMoveCapture: yo,
      onPointerUpCapture: hn,
      onPointerCancelCapture: hn,
      onContextMenuCapture: et,
      children: [
        /* @__PURE__ */ d(
          cp,
          {
            nodes: Pr,
            edges: po,
            onlyRenderVisibleElements: !0,
            nodeTypes: Wb,
            edgeTypes: Yb,
            onNodesChange: ts,
            onEdgesChange: mo,
            onConnect: ui,
            onConnectStart: li,
            onConnectEnd: ss,
            isValidConnection: as,
            connectionLineStyle: Xb,
            onEdgeClick: is,
            onNodeClick: fs,
            onNodeContextMenu: fi,
            onNodeDragStart: hi,
            onNodeDrag: go,
            onNodeDragStop: yn,
            onDragOver: gi,
            onDrop: ls,
            onNodeMouseEnter: wi,
            onNodeMouseLeave: _i,
            onInit: bi,
            onMove: Ii,
            onMoveEnd: wo,
            onPaneClick: cs,
            onPaneContextMenu: ds,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: Jb,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: Ar,
            snapGrid: Zb,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: Qb,
            fitView: u.zoom == null,
            fitViewOptions: eI,
            children: r && Tn && a.length > 0 ? /* @__PURE__ */ d(
              dp,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeClassName: JN,
                nodeColor: QN
              }
            ) : null
          }
        ),
        so ? /* @__PURE__ */ d(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: so,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ d(
          Gy,
          {
            canvasCount: o,
            activeCanvasName: s,
            canvasManagerOpen: i,
            showViewTools: r,
            showMiniMap: Tn,
            snapToGrid: Ar,
            zoom: $t,
            onOpenCanvasManager: c,
            onToggleMiniMap: Ni,
            onToggleSnap: Si,
            onReset: yi,
            onZoomIn: lr,
            onZoomOut: ho,
            onZoomChange: Or
          }
        ),
        r && a.length === 0 ? /* @__PURE__ */ E("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ E("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ d(Ed, { size: 16 }),
            /* @__PURE__ */ d("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ d("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && zt && (we || Kt) ? /* @__PURE__ */ d(
          qy,
          {
            point: zt,
            canShowDetail: !!(we && Ht(we)),
            canCopy: !!(we && !tt),
            canDelete: !!(Kt || !tt),
            canEditStructure: !!(Fr && Fr.id !== we?.id),
            canResetStoryboardPrompt: !!(we && fl(we)),
            onClose: Tt,
            onCopy: pi,
            onDelete: mi,
            onDetail: zn,
            onEditStructure: Bn,
            onResetStoryboardPrompt: us
          }
        ) : null,
        Qe ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ d(
              J_,
              {
                sourceTitle: Qe.sourceTitle,
                targetTitle: Qe.targetTitle,
                params: Qe.params,
                selectedParamKey: Qe.selectedParamKey,
                lyricsAvailable: Qe.lyricsAvailable,
                lyricsSelected: Qe.lyricsSelected,
                editing: Qe.editing,
                onClose: di,
                onSelect: ci,
                onSelectLyrics: Ee
              }
            )
          }
        ) : null
      ]
    }
  );
});
function aI({
  request: e,
  onClose: t
}) {
  const [n, r] = j(!1);
  async function o() {
    if (n)
      return;
    r(!0);
    const s = e.onConfirm;
    t();
    try {
      Promise.resolve(s()).catch((i) => {
        U.error(i instanceof Error ? i.message : "操作失败");
      });
    } catch (i) {
      U.error(i instanceof Error ? i.message : "操作失败");
    }
  }
  return /* @__PURE__ */ d(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ E(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ E("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ d("h3", { children: e.title }),
              /* @__PURE__ */ d("p", { children: e.description })
            ] }),
            /* @__PURE__ */ E("div", { className: "ws-confirm-actions", children: [
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
function cI(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function dI(e, t, n) {
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
function md({
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
      nodes: __(
        s.nodes,
        t,
        n
      )
    };
    if (s = ua({
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
function uf(e, t, n, r = e.length) {
  const o = Math.min(
    wr,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: Me(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: o },
      (s, i) => e[i] ? ff(e[i], i) : lf(i)
    )
  };
}
function uI(e, t, n, r) {
  if (t < 0 || t >= wr || (e?.frames.length || 0) > wr)
    return null;
  const o = e || uf([], null, r, t + 1), s = Math.min(
    wr,
    Math.max(2, o.frames.length, t + 1)
  ), i = ff(n, t);
  return {
    ...o,
    frames: Array.from(
      { length: s },
      (c, a) => o.frames[a] || lf(a)
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
function lf(e) {
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
function ff(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: am(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function Kn(e, t, n) {
  const r = ae(t, "asset"), o = Yo(r) ? jn(r) : void 0, s = Ie(
    ae(t, "output"),
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result", "output"),
    ae(t, "result", "asset", "version", "content"),
    ae(t, "data", "output"),
    ae(t, "data", "content"),
    ae(t, "data", "result"),
    ae(t, "data")
  ), i = e.type === "agent" && s != null ? Be(s) : $s(s) || Ct(s), c = e.type === "power" && Wn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? Lo([
    s,
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result"),
    i
  ]) : null, a = e.type === "power" && um(e.power, e.kind, e.outputType) ? Oa([
    s,
    ae(t, "asset", "version", "content"),
    ae(t, "version", "content"),
    ae(t, "result"),
    i
  ]) : null, f = Me(
    String(ae(t, "asset", "kind") || ""),
    String(ae(t, "kind") || ""),
    oi(e, i)
  ), u = Xn(i, f), h = Et(i, ""), S = Me(
    a?.title,
    c?.title
  ), N = No(n), b = No(a?.summary) || No(c?.summary) || No(u.text) || No(h) || (N ? `已按提示生成：${N}` : "生成完成");
  return {
    ...S && e.titleMode === "auto" ? { title: S } : {},
    description: b,
    resultRef: Za(t),
    resultOutput: a || c || i,
    asset: o || e.asset,
    kind: o?.kind || e.power?.kind || e.kind
  };
}
function No(e) {
  const t = Me(e);
  return Rn(t) ? "" : t;
}
function vs(e, t) {
  const n = t.version?.content;
  return {
    ...Kn(
      e,
      {
        asset: t,
        output: n
      },
      Kd(n)
    ),
    asset: t
  };
}
function Nr(e) {
  return zg(e.composerDraft);
}
function Li(e, t, n) {
  return Ru(
    pf(e, t),
    Nr(e),
    n
  );
}
function pf(e, t) {
  const n = Nr(e), r = uu(t, n);
  return lu(t, r);
}
function lI(e) {
  const t = Nr(e);
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
function gc(e, t) {
  const n = Th(e, t);
  return {
    ...n,
    id: fI(e, t, n.id)
  };
}
function fI(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const o = String(t.interaction?.interaction?.id || "");
  if (o)
    return `${e.id}:${o}`;
  const s = ks({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return s ? `${e.id}:feedback:${Sf(s)}` : n;
}
function ga(e, t) {
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
const gd = 3600 * 1e3, mf = 2e3, pI = 3;
async function Vi(e) {
  const t = qI(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = !1, o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: Ka(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s);
  let i = await my({
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
  yd(e, vn(i));
  for (let c = 0; c < 8; c += 1) {
    const a = await mI(
      e,
      i,
      o,
      (h) => {
        const S = Cf(
          e,
          h,
          n
        );
        _f(e, h), r = r || S > 0;
      },
      () => r,
      (h) => {
        o = h;
      }
    );
    if (e.canvasRun = a, yd(e, a), Yr(e, a), Vs(
      e,
      a,
      r
    ) && (a.status === "running" || a.status === "pending")) {
      U.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const f = Number(a.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      kN(
        a,
        eN(a, f)
      )
    );
    const u = String(a.status || "").toLowerCase();
    if (u !== "waiting") {
      if (bf(e, a), u === "fail" || u === "error")
        throw new Error(Su(a));
      if (u === "canceled" || u === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await WI(e, a), i = {
      ...a,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
function yd(e, t) {
  const n = {
    ...t,
    canvas_id: Number(t.canvas_id || e.canvasId),
    asset_cate_id: Number(t.asset_cate_id || e.assetCate.id || 0),
    start_node_id: String(t.start_node_id || e.startNode.id),
    execution_scope: String(
      t.execution_scope || e.executionScope || ""
    )
  };
  e.canvasRun = n, e.onCanvasRunChange?.(n);
}
async function mI(e, t, n, r, o, s) {
  let i = Ao(
    e,
    vn(t)
  );
  if (i = ha(e, i), r(i.node_results || []), Yr(e, i), i.status !== "running" && i.status !== "pending" || !i.run_id && !i.request_id)
    return i;
  const c = String(i.request_id || ""), a = new AbortController(), f = Date.now() + gd;
  let u = !1, h = null;
  const S = window.setTimeout(() => {
    u = !0, a.abort();
  }, gd);
  try {
    const N = await II(
      e,
      c,
      n,
      (b) => {
        b.stream_id && s(b.stream_id);
        const C = SI(b, e);
        if (!C) {
          wf(e, b);
          return;
        }
        i = Ao(
          e,
          wa(i, C)
        ), r(i.node_results || []), Yr(e, i);
      },
      a.signal
    );
    N && (i = Ao(
      e,
      wa(i, N)
    ), Yr(e, i)), r(i.node_results || []);
  } catch (N) {
    h = N;
  } finally {
    window.clearTimeout(S), a.abort(), e.runningNodeBatcher?.flush();
  }
  if (i = ha(e, i), ya(e, i) && !Vs(
    e,
    i,
    o()
  ))
    try {
      i = await gI(
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
  if (!ya(e, i) || Vs(
    e,
    i,
    o()
  ))
    return i;
  throw h instanceof Error && !u ? h : new Error("画布仍在运行，请稍后刷新查看结果");
}
async function gI(e, t, n, r, o, s) {
  let i = t, c = 0;
  for (; ; ) {
    if (Date.now() >= s)
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    try {
      i = await hI(
        e,
        i,
        n,
        r
      ), c = 0;
    } catch (a) {
      if (c += 1, c >= pI)
        throw a;
    }
    if (!ya(e, i) || Vs(
      e,
      i,
      o()
    ))
      return i;
    await bI(
      Math.min(mf, s - Date.now())
    );
  }
}
function Vs(e, t, n) {
  return !!(e.singleNode && !yf(e) && n && !yI(t));
}
function yI(e) {
  return String(e.status || "").trim().toLowerCase() === "waiting" || hf(e) ? !0 : [
    e.pending_node,
    e.output,
    ...e.node_results || []
  ].some((r) => !!qn(r));
}
async function hI(e, t, n, r) {
  let o = t;
  const s = Number(o.run_id || 0), i = String(o.request_id || n || "");
  if (!s && !i)
    return o;
  const c = await hy({
    projectId: e.projectId,
    runId: s,
    requestId: i
  });
  return o = Ao(
    e,
    wa(o, vn(c))
  ), o = ha(e, o), r(o.node_results || []), Yr(e, o), o;
}
function ya(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : !gf(e, t);
}
function gf(e, t) {
  return jI(
    t
  ) ? !0 : e.singleNode ? (t.node_results || []).some(
    (n) => n.node_key === e.startNode.id && Zo(kn(n))
  ) : !1;
}
function ha(e, t) {
  return wI(e, t) ? {
    ...t,
    status: _I(t.node_results || [])
  } : t;
}
function wI(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : gf(e, t);
}
function _I(e) {
  for (const t of e) {
    const n = kn(t);
    if (n === "fail")
      return "fail";
    if (n === "canceled" || n === "cancelled")
      return "canceled";
  }
  return "success";
}
function bI(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function II(e, t, n, r, o) {
  let s = null;
  return await Qu({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: o,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if (NI(i))
          throw new Error(i.msg || "画布流返回失败");
        s = Ao(
          e,
          vn(i.output || {})
        );
      }
    }
  }), s;
}
function NI(e) {
  return Number(e.status || 0) === 2;
}
function Ao(e, t) {
  if (!e.singleNode || yf(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const o = hf(t), s = Ie(n?.output, t.output), i = {
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
    approval: Ie(n?.approval, o),
    interaction: Ie(
      n?.interaction,
      qn(n?.result),
      qn(t.pending_node),
      qn(t.output)
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
function yf(e) {
  return e.singleNode && e.startNode.type === "group";
}
function hf(e) {
  const t = $o(e.output), n = $o(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (o) => Yo(o) && (o.status === "pending" || o.decision === "pending")
  );
}
function SI(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return vn(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const o = vI(n, {
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
function vI(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, o = Yo(r) ? r : {}, s = jm(o, n);
  if (!s)
    return null;
  const i = s;
  return t.requireDisplayableResult && !RI(e, i, t.node) ? null : {
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
    approval: Ie(
      s.approval,
      CI(e, i)
    ),
    interaction: Ie(
      e.interaction,
      s.interaction,
      qn(s)
    ),
    persists_result: !!(e.persists_result || s.persists_result),
    agent_run_id: Number(
      e.agent_run_id || s.agent_run_id || o.agent_run_id || 0
    ),
    source_signature: s.source_signature
  };
}
function CI(e, t) {
  const n = $o(t.result), r = Ie(
    e.approval,
    t.approval,
    n.approval
  );
  if (r && typeof r == "object")
    return r;
  const o = Number(
    Ie(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return o > 0 ? { id: o } : void 0;
}
function qn(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const o of ["result", "pending_node"]) {
    const s = qn(n[o], t + 1);
    if (s)
      return s;
  }
  const r = Array.isArray(n.node_results) ? n.node_results : [];
  for (const o of r) {
    const s = qn(o, t + 1);
    if (s)
      return s;
  }
}
function RI(e, t, n) {
  return e.persists_result || String(e.node_type || "") !== "function" || String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ) === "display" ? !0 : !!(t.asset || t.version || ae(t, "asset", "version") || ae(t, "data", "asset") || ae(t, "data", "version"));
}
function wf(e, t) {
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
        const a = hd(n.output), f = String(n.node_type || "").toLowerCase(), u = f === "power", h = f === "agent", S = String(
          a.semantic_event || a.event || ""
        ).toLowerCase(), N = hd(a.meta), b = u && S === "status" && !!String(N.output_type || ""), C = b && !!(a.json && typeof a.json == "object"), F = u && (S === "audio_ready" || C || cm(a)), q = Number(N.generated_count || 0), X = b ? Math.max(
          c.generatedCount || 0,
          Number.isFinite(q) ? q : 0
        ) : c.generatedCount, ee = u && typeof a.text == "string" && (S === "delta" || !S) ? a.text : "", Z = F ? a : c.streamOutput;
        return {
          ...i,
          [o]: {
            ...c,
            progress: Math.max(c.progress, 72),
            streamText: ee ? `${c.streamText || ""}${ee}` : c.streamText,
            streamOutput: Z,
            streamStarted: c.streamStarted || !!ee || !!Z,
            ...b ? { streamStarted: !0, generatedCount: X } : {},
            agent: h ? rh(c.agent, a) : c.agent
          }
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s) : e.setRunningNode(s);
    }
  }
}
function xI(e, t, n, r) {
  const o = t.output || {}, s = String(o.event || ""), i = String(o.node_key || o.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (s === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    wf(e, t);
  }
}
function hd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function wa(e, t) {
  const n = [...e.node_results || []];
  for (const r of t.node_results || []) {
    const o = Ks(r), s = n.findIndex(
      (i) => Ks(i) === o
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
function _f(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => Zo(r.status)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => kI(e, r, n)
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
function kI(e, t, n) {
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
      agent: c?.type === "agent" ? oh(s.output) : a.agent
    }, r = !0);
  }
  return r ? o : t;
}
function bf(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((o) => {
      const s = Ui(
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
    const i = { ...o }, c = Ui(
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
        const c = Ui(
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
function Ui(e, t, n, r) {
  const o = Xo(t), s = new Set(
    AI(e, t).filter(
      (i) => i === o || !r || r.has(i)
    )
  );
  return Object.keys(n).filter((i) => s.has(i));
}
function TI(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const o = _a(t), s = /* @__PURE__ */ new Map(), i = Xo(t);
  let c = !1, a = "";
  for (const h of t.node_runs || []) {
    const S = String(h.node_key || "");
    if (!S || o.has(S) || n && !n.has(S))
      continue;
    c = !0;
    const N = String(h.status || "").trim().toLowerCase();
    N === "running" ? s.set(S, "running") : N === "waiting" ? s.set(S, "waiting") : N === "pending" && !a && (a = S);
  }
  const f = String(t.pending_node?.node_key || "");
  if (f && !o.has(f) && (!n || n.has(f)) && s.set(f, "waiting"), s.size === 0 && a && s.set(a, "running"), s.size === 0 && !c) {
    const h = $y(
      t.start_node_id,
      i
    );
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
    let S = !1;
    const N = { ...h };
    for (const [b, C] of s) {
      const F = e.nodes.find((ee) => ee.id === b), q = b === i;
      if (!F && !q)
        continue;
      const X = h[b];
      X?.status !== C && (N[b] = {
        nodeId: b,
        title: q ? `${e.startNode.title || "分镜脚本"}制作区` : F?.title || b,
        startedAt: X?.startedAt || (Number.isFinite(u) ? u : Date.now()),
        progress: C === "waiting" ? 92 : X?.progress || 0,
        status: C
      }, S = !0);
    }
    return S ? N : h;
  });
}
function AI(e, t) {
  const n = new Set(Us(t)), r = Xo(t);
  return r && n.add(r), e.singleNode && n.add(e.startNode.id), [...n];
}
function MI(e, t, n, r) {
  const o = new Set(
    e.memberNodeIds.filter(
      (i) => St(n[i])
    )
  );
  if (o.size === 0 && t) {
    for (const i of t.node_runs || []) {
      const c = String(i.status || "").trim().toLowerCase();
      (c === "running" || c === "waiting") && o.add(String(i.node_key || ""));
    }
    o.size === 0 && t.pending_node?.node_key && o.add(t.pending_node.node_key);
  }
  const s = [...o].filter(Boolean).map((i) => r.get(i)?.title || i).filter((i, c, a) => a.indexOf(i) === c);
  return s.length > 1 ? `${s[0]} 等 ${s.length} 个节点` : s[0] || "";
}
function DI(e, t, n) {
  if (n)
    return "停止中";
  const r = String(e?.status || "").trim().toLowerCase();
  if (St(t) || e && Qr(e))
    return t?.status === "waiting" || r === "waiting" ? "等待反馈" : "执行中";
  if (t?.status === "error")
    return "启动失败";
  switch (r) {
    case "success":
      return "已完成";
    case "fail":
    case "failed":
    case "error":
      return "执行失败";
    case "canceled":
    case "cancelled":
      return "已停止";
    default:
      return "";
  }
}
function Xo(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? Js(t) : "";
}
function Ki(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const r = Number(e.asset_cate_id || 0);
  return r === 0 || r === t.assetCateId;
}
function Us(e) {
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
function _a(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Zo(kn(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function PI(e) {
  return Nf(e).map((t) => t.run);
}
function EI(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    Qr(n) && t.set($n(n), n);
  return [...t.values()];
}
function FI(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const o of If(n))
        t.set(o, r);
  }
  return t;
}
function OI(e, t) {
  for (const n of If(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function If(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function Nf(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const s of Us(r))
      t.has(s) || (t.add(s), o.add(s));
    o.size !== 0 && Qr(r) && n.push({ run: r, managedNodeIds: o });
  }
  return n;
}
function qi(e) {
  return e.map(ba).filter((t) => !!t);
}
function ba(e) {
  const t = vn(e);
  return t.run_id || t.request_id ? t : null;
}
function zI(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Number(r.run_id || 0);
    o > 0 && !BI(r, t) && n.add(o);
  }
  return [...n];
}
function BI(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const s = t[String(n)];
    return s ? Ia(e, s) : !1;
  }
  const r = Number(e.asset_cate_id || 0);
  return (r ? Object.values(t).filter(
    (s) => s.assetCateId === r
  ) : Object.values(t)).some(
    (s) => Ia(e, s)
  );
}
function Ia(e, t) {
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
      if (a && (i += 1, !wd(a.resultRef, e, c)))
        return !1;
    }
    return i > 0;
  }
  const o = r.get(String(e.start_node_id || ""));
  return wd(o?.resultRef, e);
}
function wd(e, t, n) {
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
function Gi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set($n(r), r);
  for (const r of t)
    n.set($n(r), r);
  return [...n.values()].sort($I).slice(0, 50);
}
function $I(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = _d(t) - _d(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function _d(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function jI(e) {
  const t = LI(e);
  if (t.size === 0)
    return !1;
  const n = /* @__PURE__ */ new Set();
  for (const r of e.node_results || []) {
    const o = kn(r);
    if (o === "waiting" || o === "running" || o === "pending")
      return !1;
    Zo(o) && n.add(r.node_key);
  }
  for (const r of t)
    if (!n.has(r))
      return !1;
  return !0;
}
function LI(e) {
  const t = /* @__PURE__ */ new Set();
  for (const o of e.execution_plan?.nodes || [])
    VI(o) && t.add(o.id);
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
function VI(e) {
  return ["asset", "power", "agent", "flow"].includes(String(e.type || "")) ? !0 : e.type !== "function" ? !1 : e.function_key === "save" || e.function_key === "display";
}
function UI(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((o) => o.id === n);
    if (r)
      return r;
  }
  return t.find(RN) || t[0] || null;
}
function KI(e, t) {
  return [
    e.run_id || e.request_id || "",
    Ks(t)
  ].join(":");
}
function Zo(e) {
  const t = String(e || "").trim().toLowerCase();
  return t === "success" || t === "fail" || t === "canceled" || t === "cancelled";
}
function kn(e) {
  if (!e)
    return "";
  const t = String(
    e.status || ae(e.result, "status") || ""
  ).trim().toLowerCase();
  return t === "error" ? "fail" : t === "cancelled" ? "canceled" : t;
}
function qI(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function GI(e, t, n) {
  const r = typeof n == "string" ? n : ks(n), o = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${o}-${Sf(r)}`.slice(
    0,
    96
  );
}
function Sf(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function Yr(e, t, n) {
  HI(e, t), TI(e, t, n);
}
function HI(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((a) => a.id === n.node_key);
  if (!r)
    return;
  const o = yc(n, r);
  if (!o)
    return;
  const s = gc(r, o), i = _r(r), c = ga(
    i,
    s
  );
  if (ks(i) !== ks(c)) {
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
async function WI(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const o = yc(n, r);
  if (!o || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const s = await e.requestFlowFeedback({ node: r, prompt: o });
  return vf(
    e.projectId,
    t,
    n,
    o,
    s
  );
}
async function vf(e, t, n, r, o) {
  return r.interaction ? by({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: o
  }) : yy({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: o
  });
}
function YI(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const o = r.pending_node;
    if (!o || o.node_key !== t.id)
      continue;
    const s = yc(o, t);
    if (!s)
      continue;
    if (gc(t, s).id === n.id)
      return { run: r, pending: o, prompt: s };
  }
  return null;
}
function yc(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : qn(e);
  if (n?.interaction?.id)
    return tl({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const o = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, s = Ie(
      e.approval,
      ae(e.result, "approval"),
      ae(e.output, "approval")
    );
    s && !Array.isArray(o.approvals) && (o.approvals = [s]);
    const i = Dh(o);
    return Ph(i);
  }
  return Fh(
    kf(e),
    t.title
  );
}
function Cf(e, t, n) {
  let r = 0;
  const o = new Map(e.nodes.map((s) => [s.id, s]));
  for (const s of t) {
    const i = o.get(s.node_key), c = kn(s);
    if (!i || !Zo(c))
      continue;
    const a = Ks(s);
    if (c === "success" && a && n?.has(a))
      continue;
    const f = JI(e, i, s);
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
function XI(e, t) {
  const n = Nr(e).prompt.trim(), o = (t ? Df(e.id, t.nodes, t.edges) : null)?.text.trim() || "", s = [n, o ? `上游内容：
${o}` : ""].filter(Boolean).join(`

`);
  return Array.from(s).slice(0, Vb).join("");
}
function ZI(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || kn(t) !== "success" || xf(t) <= 0 || !Rf(e) ? !1 : Wn(e.power, e.kind, e.outputType).viewMode !== "storyboard";
}
function Rf(e) {
  const t = Number(e.nodeNo || 0);
  return t > 0 && e.title.trim() === Mu(e, t).trim();
}
function xf(e) {
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
function Ks(e) {
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
function JI(e, t, n) {
  const r = kf(n), o = kn(n);
  if (o === "fail")
    return Hi(t, {
      resultRef: Za(r),
      runError: Lm(n)
    });
  if (o === "canceled" || o === "cancelled")
    return Hi(t, {
      runError: ""
    });
  const s = dh({
    result: r,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), i = (c) => Hi(
    t,
    QI(
      t,
      c,
      n.source_signature
    )
  );
  return i(s ? {
    ...Kn(
      t,
      uh(r, s),
      "后端执行结果"
    ),
    runError: ""
  } : {
    ...Kn(t, r, "后端执行结果"),
    runError: ""
  });
}
function QI(e, t, n) {
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
function Hi(e, t) {
  const n = _r(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function kf(e) {
  const t = $o(e.result);
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
function eN(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? Su(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function tN(e) {
  const t = nN(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await Sy({
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
  return Un(n, r);
}
function nN(e) {
  return Math.max(0, Number(e || 0));
}
function Rr(e) {
  const t = xn(e), n = Xn(
    t,
    oi(e, t)
  );
  return Gn(n) || (n.text = Et(t, "")), n;
}
function oi(e, t) {
  const n = Rb(t);
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
function Cs(e) {
  const t = Rr(e);
  if (Gn(t))
    return t;
  const n = Xn(
    xn(e),
    String(e.kind || e.power?.kind || "")
  );
  return Gn(n) || (n.text = Et(xn(e), "")), n;
}
function hc(e) {
  return oN(e) || Ib(e);
}
function Ln(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : xn(e);
}
function Wi(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    Ln(e)
  ];
}
function rN(e) {
  const t = e.composerDraft?.paramValues || {};
  return Me(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function oN(e) {
  return yb(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function So(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function sN(e, t, n, r) {
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
function iN(e, t) {
  const n = Tf(e), r = Af(e, t, n), o = (s) => n.hasResultByNodeId.get(s.id) || !1;
  return {
    ...n,
    ...r,
    runBlockedReasonByNodeId: new Map(
      e.map((s) => [
        s.id,
        qu({
          targets: s.type === "group" ? n.groupMembersById.get(s.id) || [] : [s],
          nodesByID: n.nodeById,
          hasResult: o
        })
      ])
    ),
    highlightedPathEdgesByNodeId: IN(
      n.nodeById,
      t
    )
  };
}
function Tf(e) {
  const t = new Map(e.map((o) => [o.id, o])), n = new Map(
    e.map((o) => [o.id, Ht(o)])
  ), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o.groupId)
      continue;
    const s = r.get(o.groupId) || [];
    s.push(o), r.set(o.groupId, s);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function Af(e, t, n, r = "") {
  const { nodeById: o, groupMembersById: s, hasResultByNodeId: i } = n, c = (b) => {
    const C = o.get(b);
    return C ? C.type === "group" ? s.get(C.id) || [] : [C] : [];
  }, a = /* @__PURE__ */ new Set();
  for (const b of t) {
    const C = It(b);
    if (r && C.targetNodeId !== r)
      continue;
    const { sourceNodeId: F } = C;
    for (const q of c(F))
      a.add(q.id);
  }
  const f = /* @__PURE__ */ new Map();
  for (const b of e)
    if (a.has(b.id)) {
      const C = aN(
        b,
        i.get(b.id) || !1
      );
      C && bd(C).trim() !== "" && f.set(b.id, C);
    }
  const u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
  for (const b of t) {
    const { sourceNodeId: C, targetNodeId: F } = It(b);
    if (!(r && F !== r || !o.has(F)))
      for (const q of c(C)) {
        if (fu(b) && $a(q)) {
          const se = h.get(F) || [];
          se.push({ edge: b, source: q }), h.set(F, se);
        }
        const X = f.get(q.id), ee = S.get(F) || /* @__PURE__ */ new Set();
        if (!X || ee.has(q.id))
          continue;
        ee.add(q.id), S.set(F, ee);
        const Z = u.get(F) || [];
        Z.push(X), u.set(F, Z);
      }
  }
  const N = /* @__PURE__ */ new Map();
  for (const [b, C] of u)
    N.set(b, {
      sources: C,
      text: C.map(bd).join(`

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
function Mf(e, t, n) {
  const r = [];
  for (const o of t) {
    if (!fu(o))
      continue;
    const s = It(o);
    if (s.targetNodeId === n)
      for (const i of gu(
        e,
        s.sourceNodeId
      ))
        $a(i) && r.push({ edge: o, source: i });
  }
  return r;
}
function Df(e, t, n) {
  const r = Tf(t);
  return Af(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function aN(e, t) {
  if (!t)
    return null;
  const n = xn(e), r = oi(e, n), o = Xn(n, r);
  return Gn(o) || (o.text = Et(
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
function cN(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const o = t.sources[r];
    return n.nodeId === o.nodeId && n.title === o.title && n.type === o.type && n.kind === o.kind && n.output === o.output && n.resultRef === o.resultRef && n.preview.text === o.preview.text && n.preview.imageUrl === o.preview.imageUrl && n.preview.videoUrl === o.preview.videoUrl && n.preview.audioUrl === o.preview.audioUrl && n.preview.fileUrl === o.preview.fileUrl;
  });
}
function bd(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || sf(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Na(e, t) {
  return xm(e, t);
}
function Id(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function In(e, t, n, r) {
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
function Sa(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function va(e, t) {
  return e.type === "asset" && Sa(e) === t;
}
function Nd(e, t, n, r) {
  const o = new Map(e.map((s) => [s.id, s]));
  if (r)
    for (const s of t) {
      if (s.from !== r)
        continue;
      const i = o.get(s.to);
      if (i && va(i, n))
        return i;
    }
  return e.find((s) => va(s, n)) || null;
}
function Sd(e, t, n, r, o) {
  const s = /* @__PURE__ */ new Set();
  if (!r || !n)
    return s;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== r || c.to === o)
      continue;
    const a = i.get(c.to);
    a && va(a, n) && s.add(a.id);
  }
  return s;
}
function Yi(e, t) {
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
function dN(e) {
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
function uN(e) {
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
function vd(e, t) {
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
  return Tu({
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
function lN(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      Kr(r, t)
    ])
  );
}
function Kr(e, t) {
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
      (s) => fN(s, r, o)
    )
  };
}
function fN(e, t, n) {
  const r = Pf(e), o = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!o)
    return e;
  const s = vs(e, o), i = Number(s.resultRef?.run_id || 0), c = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...s,
    ...e.runError && i > c ? { runError: "" } : {},
    asset: o
  };
}
function Pf(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function pN(e) {
  if (e.type !== "function" || e.functionOption?.key !== "import")
    return null;
  const t = Pf(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function Cd(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Ef(e.nodes, t.nodes) && Ff(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Ef(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function mN(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.staleCount === t.staleCount && e.status === t.status;
}
function Ff(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n === o || n.id === o.id && n.from === o.from && n.to === o.to && (n.logicalFrom || "") === (o.logicalFrom || "") && (n.logicalTo || "") === (o.logicalTo || "") && (n.purpose || "") === (o.purpose || "") && (n.executionMode || "auto") === (o.executionMode || "auto") && (n.mediaUsage || "") === (o.mediaUsage || "");
  });
}
function gN(e, t) {
  return Na(e, t) ? { source: e.id, target: t.id } : Na(t, e) ? { source: t.id, target: e.id } : null;
}
function yN(e) {
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
function hN(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function wN(e, t, n) {
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
function _N(e, t, n, r, o, s, i) {
  const c = e.id === o, a = s.has(e.id), f = c || a || e.source === n || e.target === n || e.source === r || e.target === r, u = e.source === n || e.target === n ? n : r;
  return {
    highlighted: f,
    selected: c,
    highlightColor: f ? NN(
      t.get(
        a ? i : u
      )
    ) : "var(--ws-edge)"
  };
}
function bN(e, t) {
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
function IN(e, t) {
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
      u && Ku(u) || c.push(...n.get(f.to) || []);
    }
    s.size > 0 && r.set(o.id, s);
  }
  return r;
}
function NN(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function SN(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function vN(e) {
  return e instanceof HTMLElement ? !!e.closest("input, textarea, select, [contenteditable='true']") : !1;
}
function Rd(e) {
  return !e.repeat && (e.key === "Delete" || e.key === "Backspace") && !vN(e.target);
}
function CN(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ d(qs, { ...n }) : e === "import" ? /* @__PURE__ */ d(ea, { ...n }) : e === "display" ? /* @__PURE__ */ d(ka, { ...n }) : /* @__PURE__ */ d(jd, { ...n });
}
function RN(e) {
  return e.type !== "function" ? !1 : e.functionOption?.key === "start" || e.title === "开始";
}
function Of(e) {
  if (e.type !== "function")
    return !1;
  const t = e.functionOption?.key || "";
  return t === "import" || t === "save" || t === "display";
}
function wc(e) {
  return Of(e) && Ht(e);
}
function xN(e) {
  return {
    description: e
  };
}
function kN(e, t) {
  return {
    ...xN(t),
    resultRef: Za({
      ...$o(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const xd = { width: 620, height: 420 }, _c = 44;
function zf(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && Vo(t) === "image");
}
function kd(e, t) {
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
function Bf(e) {
  if (e.type === "function") {
    if (wc(e)) {
      if (!$u(e))
        return { width: e.width, height: e.height };
      const n = Td(e);
      return n ? {
        width: n.width,
        height: n.height + _c
      } : AN(e);
    }
    return { width: 128, height: 46 };
  }
  const t = Td(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Td(e) {
  if (!$u(e) || !TN(e))
    return null;
  const t = Rr(e);
  return !ru(
    Ln(e),
    Vo(t)
  ) || zf(e, t) ? null : {
    width: Math.max(e.width, xd.width),
    height: Math.max(e.height, xd.height)
  };
}
function TN(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Wn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function AN(e) {
  const t = Rr(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = Ws({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + _c
  };
}
function Je({
  id: e,
  type: t,
  position: n,
  className: r,
  style: o
}) {
  return /* @__PURE__ */ d(
    up,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: o,
      children: /* @__PURE__ */ d("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ d(Fd, { size: 12 }) : /* @__PURE__ */ d(Od, { size: 12 }) })
    }
  );
}
function bn({
  node: e,
  selected: t
}) {
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && wc(e), r = /* @__PURE__ */ d(
    Qy,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const o = St(e.runningNode);
    return /* @__PURE__ */ E(Nn, { children: [
      r,
      /* @__PURE__ */ d(
        Gh,
        {
          node: e,
          running: o,
          onRun: () => {
            o || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((s) => {
              U.error(
                s instanceof Error ? s.message : "流程运行失败"
              );
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !Ca(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ E(Nn, { children: [
    r,
    /* @__PURE__ */ d(
      Fe,
      {
        fallback: /* @__PURE__ */ d(Oe, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ d(ob, { node: e }, e.id)
      }
    )
  ] });
}
function Ca(e) {
  return e.type === "agent" ? !0 : e.type === "power" && !lm(e.power, e.kind, e.outputType);
}
function Lr({
  node: e,
  onShowNodeDetail: t
}) {
  if (!t || !Ht(e))
    return null;
  const n = !!Cs(e).videoUrl;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: [
        "ws-node-quick-view nodrag nopan",
        n ? "is-video-detail" : ""
      ].filter(Boolean).join(" "),
      "aria-label": "查看详情",
      onPointerEnter: zo,
      onFocus: zo,
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ d(ka, { size: 14 })
    }
  );
}
const MN = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function Xi({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = Do(
    e.resultView || MN
  ), [o, s] = j(null), i = Xy(
    r,
    o
  ), [c, a] = j(!1), f = e.type === "agent" ? t?.agent : void 0, u = ih(f);
  if (!Ht(e) && !u)
    return null;
  const h = Rr(e), S = uc(e), N = Me(
    Et(h.text, ""),
    Et(S, ""),
    Et(e.description, ""),
    e.title,
    "暂无结果"
  ), b = hc(e), C = Ln(e), F = Ve(C) ? C : b ? { rich: b } : N, q = El(h) ? h : vb(
    h,
    Xn(N, Ql(N, ""))
  ), X = e.interactive, ee = Ie(
    e.resultOutput,
    e.asset?.version?.content
  ), Z = e.type === "agent" ? async (se) => {
    if (!St(t))
      try {
        await e.onRunBackendNode(e, { agentInput: se });
      } catch (M) {
        U.error(
          M instanceof Error ? M.message : "智能体继续运行失败"
        );
      }
  } : void 0;
  return /* @__PURE__ */ d(Fe, { fallback: /* @__PURE__ */ d(Oe, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Pl,
    {
      output: F,
      fallback: N,
      preview: q,
      mediaLabel: Xr(q),
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
      onOpenIntent: zo,
      resizeControls: /* @__PURE__ */ d(
        eh,
        {
          value: i,
          enabled: X,
          onResizeStart: () => {
            s(
              (se) => Bc(
                r,
                se,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (se) => s(
            (M) => Bc(
              r,
              M,
              se
            )
          ),
          onResizeEnd: (se) => {
            a(!1), e.onResultViewResizeEnd(e.id, se), s(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ d(
        Fe,
        {
          fallback: /* @__PURE__ */ d(Oe, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ d(
            nb,
            {
              output: ee,
              runtime: f,
              fallback: N,
              running: St(t),
              onContinue: Z
            }
          )
        }
      ) : void 0
    }
  ) });
}
function DN({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = Rr(e), o = hc(e), s = Ln(e), i = Me(
    uc(e),
    Et(r.text, ""),
    Et(e.description, ""),
    "暂无内容"
  ), c = Ve(s) ? s : o ? { rich: o } : i, a = !qr(c, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), f = a && !r.audioUrl ? Rs(
    e,
    e.onNodeResult,
    _c
  ) : void 0;
  return /* @__PURE__ */ d(Fe, { fallback: /* @__PURE__ */ d(Oe, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    Pl,
    {
      output: c,
      fallback: i,
      preview: r,
      mediaLabel: Xr(r),
      className: `ws-node-function-result-card ${a ? "has-media" : ""}`,
      customContentIsPureMedia: a,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: zo,
      openOnContentClick: !0,
      children: a ? /* @__PURE__ */ d(
        $f,
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
function Zi({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = _r(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (s) => s.status === "pending"
  ).length, o = [...n].reverse().find((s) => s.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ E(
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
        /* @__PURE__ */ d(Dp, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ d("span", { children: n.length }) : null
      ]
    }
  );
}
function PN(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Ht(e) {
  if (!EN(e) || !PN(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = xn(e);
  if (t == null)
    return !1;
  const n = Xn(
    t,
    oi(e, t)
  );
  return Gn(n) || mc(t);
}
function EN(e) {
  return e.type !== "function" ? !0 : Of(e);
}
async function FN(e) {
  const t = e.node.functionOption?.key || "", n = ON(e.inputContext);
  if (t === "display") {
    if (n == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      Kn(
        e.node,
        { output: n },
        "展示上游结果"
      )
    ), U.success("已展示上游结果"), !0;
  }
  if (t === "save") {
    if (n == null)
      throw new Error("保存节点没有可保存的上游结果");
    const r = await tN({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: BN(e.node, e.inputContext),
      kind: lh(e.node),
      content: n,
      nodeKey: e.node.id,
      requestId: GI(
        "save",
        e.node.id,
        n
      ),
      source: zN(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(r), e.onNodeResult(
      e.node.id,
      Kn(
        e.node,
        {
          output: r.version?.content || n,
          asset: r
        },
        "保存上游结果"
      )
    ), U.success("资产已保存"), !0;
  }
  return t === "start" ? (await e.onRunStartNode(e.node), !0) : t === "import" ? (e.onOpenImportPicker(e.node.id), !0) : (e.onNodeResult(
    e.node.id,
    Kn(
      e.node,
      { output: "操作已应用" },
      "操作已应用"
    )
  ), U.success("操作已应用"), !0);
}
function bc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function ON(e) {
  const t = bc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function zN(e) {
  const t = bc(e);
  return hh(t);
}
function BN(e, t) {
  const n = bc(t);
  return Me(n?.title, e.title, "画布资产");
}
function $N({
  prompt: e,
  running: t,
  readonly: n,
  history: r,
  activeRecordId: o,
  onSelectRecord: s,
  onClose: i,
  onSubmit: c
}) {
  const a = le(
    () => LN(e),
    [e]
  );
  if (typeof document > "u")
    return null;
  const f = document.querySelector(".ws-page") || document.body;
  return ep(
    /* @__PURE__ */ d("div", { className: "ws-flow-feedback-backdrop", onMouseDown: i, children: /* @__PURE__ */ E(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (u) => u.stopPropagation(),
        children: [
          /* @__PURE__ */ E("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ E("div", { children: [
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
                children: /* @__PURE__ */ d($d, { size: 18 })
              }
            )
          ] }),
          r && r.length > 1 ? /* @__PURE__ */ d("div", { className: "ws-flow-feedback-tabs", children: r.map((u, h) => /* @__PURE__ */ E(
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
          /* @__PURE__ */ d("div", { className: "ws-flow-feedback-body custom-scrollbar", children: /* @__PURE__ */ d(Fe, { fallback: /* @__PURE__ */ d(Oe, { label: "正在加载交互表单" }), children: /* @__PURE__ */ d(
            j_,
            {
              interaction: a,
              disabled: t,
              readonly: n,
              hideHeader: !0,
              layout: "dialog",
              initialData: n ? e.values : void 0,
              onSubmit: (u) => c(
                jN(e, a, u.data)
              )
            }
          ) }) }),
          n ? /* @__PURE__ */ d("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: i,
              children: [
                /* @__PURE__ */ d(Ta, { size: 16 }),
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
function jN(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function LN(e) {
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
function yr(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function VN(e) {
  const t = yr(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Ad(e, t) {
  if (!e)
    return;
  const n = yr(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function UN(e) {
  return e.type === "function" && e.functionOption?.key === "start";
}
function KN(e) {
  return e.type === "function" && e.functionOption?.key === "start" ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function qN(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const o = Uy({
    members: n,
    hasResult: Ht
  });
  await r(t, { targetNodeIds: o });
}
function GN({ data: e, selected: t }) {
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
    onConnectedMediaEdgeRemove: S,
    onNodeDraftChange: N,
    onOpenStoryboardGridImport: b,
    onRunBackendNode: C,
    structureLocked: F,
    storyboardSourceNode: q
  } = e, X = n.type === "power" ? Wn(n.power, n.kind, n.outputType) : null, ee = X?.viewMode === "storyboard", Z = X?.viewMode === "storyboard_grid", se = X?.viewMode === "video_compose";
  if (n.type === "group") {
    const M = n.groupMembers, ie = n.storyboardFrameRunning, D = n.groupRuntime || Gu({
      members: M,
      runningNodes: af,
      groupState: s,
      hasResult: Ht
    }), z = n.runBlockedReason;
    let L;
    return !z && !ie && (L = () => {
      i((Y) => ({
        ...Y,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: 8,
          status: "running"
        }
      })), qN(
        n,
        r,
        M,
        C
      ).then(() => {
        i((Y) => ko(Y, n.id));
      }).catch((Y) => {
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
        })), U.error(
          Y instanceof Error ? Y.message : "分组运行失败"
        ), window.setTimeout(() => {
          i((ce) => ko(ce, n.id));
        }, 1400);
      });
    }), /* @__PURE__ */ d(Fe, { fallback: /* @__PURE__ */ d(Oe, { label: "正在加载分组" }), children: /* @__PURE__ */ E(
      E_,
      {
        node: n,
        memberCount: D.memberCount,
        runnableCount: D.runnableCount,
        completedCount: D.completedCount,
        failedCount: D.failedCount,
        staleCount: D.staleCount,
        status: D.status,
        frameRunning: ie,
        selected: t,
        managed: F,
        onRename: F ? void 0 : (Y) => a(n.id, { title: Y, titleMode: "manual" }),
        onEditStructure: q ? () => c(
          q,
          kl(n)
        ) : void 0,
        onRun: L,
        runBlockedReason: z,
        children: [
          /* @__PURE__ */ d(
            Je,
            {
              id: "input-0",
              type: "target",
              position: Ze.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ d(
            Je,
            {
              id: "output-0",
              type: "source",
              position: Ze.Right,
              className: "is-out"
            }
          ),
          /* @__PURE__ */ d(bn, { node: n, selected: t })
        ]
      }
    ) });
  }
  if (n.type === "agent") {
    const M = St(s) || s?.status === "success";
    return /* @__PURE__ */ E(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${M ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ d(
            Je,
            {
              id: "input-0",
              type: "target",
              position: Ze.Left,
              className: "is-in",
              style: { left: "4px" }
            }
          ),
          /* @__PURE__ */ d(
            Je,
            {
              id: "output-0",
              type: "source",
              position: Ze.Right,
              className: "is-out",
              style: { right: "4px" }
            }
          ),
          /* @__PURE__ */ E("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ d(Tp, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ d(
              Bi,
              {
                className: "ws-node-circle-title",
                title: n.title,
                onRename: a ? (ie) => a(n.id, { title: ie, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          M ? /* @__PURE__ */ E(
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
            Zi,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          /* @__PURE__ */ d(
            Xi,
            {
              node: n,
              runningNode: s,
              onShowNodeDetail: c
            }
          ),
          /* @__PURE__ */ d(bn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "flow") {
    const M = St(s) || s?.status === "success";
    return /* @__PURE__ */ E(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${M ? "is-running" : ""}`,
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
          M ? /* @__PURE__ */ E(
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
          /* @__PURE__ */ E("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ d(Ap, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ d(
              Bi,
              {
                className: "ws-node-flow-title",
                title: n.title,
                onRename: a ? (ie) => a(n.id, { title: ie, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ d(
            Je,
            {
              id: "input-0",
              type: "target",
              position: Ze.Left,
              className: "is-in",
              style: { left: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            Je,
            {
              id: "output-0",
              type: "source",
              position: Ze.Right,
              className: "is-out",
              style: { right: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            Zi,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          /* @__PURE__ */ d(Xi, { node: n, onShowNodeDetail: c }),
          /* @__PURE__ */ d(bn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "function") {
    const M = n.functionOption?.key || (n.title.includes("保存") ? "save" : ""), ie = M === "start", { onRunFunctionNode: D, requestConfirm: z } = n, L = St(s), Y = ie && n.canvasHasRunningNode, ce = L, ve = wc(n), de = ve ? { left: "0px", top: "19px" } : { left: "0px" }, Re = ve ? { left: "128px", right: "auto", top: "19px" } : { right: "0px" }, $e = (Te) => {
      i((Yt) => ({
        ...Yt,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: Te === "success" ? 100 : Te === "error" ? 92 : 0,
          status: Te
        }
      })), Te !== "running" && Te !== "waiting" && window.setTimeout(
        () => i((Yt) => ko(Yt, n.id)),
        Te === "success" ? 650 : 1200
      );
    }, ye = () => {
      const Te = !ie;
      Te && $e("running"), D(n).then(() => {
        Te && $e("success");
      }).catch((Yt) => {
        Te && $e("error"), U.error(Yt instanceof Error ? Yt.message : "执行出错");
      });
    }, fe = () => {
      if (!(ce || Y)) {
        if (UN(n)) {
          z({
            title: `执行「${n.title}」`,
            description: KN(n),
            confirmText: "执行",
            onConfirm: ye
          });
          return;
        }
        ye();
      }
    }, ct = (Te) => {
      Te.preventDefault(), Te.stopPropagation(), fe();
    };
    return /* @__PURE__ */ E(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${ce ? "is-running" : ""} ${ve ? "has-result-card" : ""} is-${M || "default"}`,
        children: [
          /* @__PURE__ */ E(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": ce || Y,
              onClick: ct,
              onKeyDown: (Te) => {
                Te.key !== "Enter" && Te.key !== " " || (Te.preventDefault(), Te.stopPropagation(), fe());
              },
              children: [
                /* @__PURE__ */ d("div", { className: "ws-node-function-icon", children: L ? /* @__PURE__ */ d(Sn, { size: 15, className: "ws-spin" }) : CN(M, ie) }),
                /* @__PURE__ */ d("span", { className: "ws-node-function-title", children: L ? s?.status === "waiting" ? "等待中" : "运行中" : n.title })
              ]
            }
          ),
          ve ? /* @__PURE__ */ d(
            DN,
            {
              node: n,
              running: ce,
              onShowNodeDetail: c
            }
          ) : null,
          /* @__PURE__ */ d(
            Lr,
            {
              node: n,
              onShowNodeDetail: c
            }
          ),
          /* @__PURE__ */ d(
            Je,
            {
              id: "input-0",
              type: "target",
              position: Ze.Left,
              className: "is-in",
              style: de
            }
          ),
          /* @__PURE__ */ d(
            Je,
            {
              id: "output-0",
              type: "source",
              position: Ze.Right,
              className: "is-out",
              style: Re
            }
          ),
          /* @__PURE__ */ d(
            Zi,
            {
              node: n,
              onOpenFeedbackRecord: f
            }
          ),
          ve ? null : /* @__PURE__ */ d(Xi, { node: n, onShowNodeDetail: c }),
          /* @__PURE__ */ d(bn, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "asset") {
    if (n.kind === "image") {
      const de = Cs(n), Re = Ln(n), $e = qr(Re, de), ye = Rs(n, a), fe = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        de.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ E("div", { className: fe, children: [
        /* @__PURE__ */ E("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(Sc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "图片资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-image-container ws-node-content-container", children: $e ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          Gr,
          {
            output: Re,
            fallback: de.text || n.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : de.imageUrl ? /* @__PURE__ */ d(
          Ra,
          {
            src: de.imageUrl,
            alt: n.title,
            className: "ws-node-image-raw",
            onMediaSize: ye
          }
        ) : /* @__PURE__ */ E("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(Sc, { size: 24 }),
          /* @__PURE__ */ d("span", { children: de.text || n.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ d(
          Je,
          {
            id: "input-0",
            type: "target",
            position: Ze.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          Je,
          {
            id: "output-0",
            type: "source",
            position: Ze.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Lr,
          {
            node: n,
            onShowNodeDetail: c
          }
        ),
        /* @__PURE__ */ d(bn, { node: n, selected: t })
      ] });
    }
    if (n.kind === "video") {
      const de = Cs(n), Re = Ln(n), $e = qr(Re, de), ye = Rs(n, a), fe = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        de.videoUrl || de.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ E("div", { className: fe, children: [
        /* @__PURE__ */ E("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(vc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "视频资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-video-container ws-node-content-container", children: $e ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          Gr,
          {
            output: Re,
            fallback: de.text || n.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : de.videoUrl ? /* @__PURE__ */ d(
          xs,
          {
            src: de.videoUrl,
            poster: de.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: n.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            onMediaSize: ye
          },
          de.videoUrl
        ) : de.imageUrl ? /* @__PURE__ */ d(
          Ra,
          {
            src: de.imageUrl,
            alt: n.title,
            className: "ws-node-video-raw",
            onMediaSize: ye
          }
        ) : /* @__PURE__ */ E("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(vc, { size: 24 }),
          /* @__PURE__ */ d("span", { children: de.text || n.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ d(
          Je,
          {
            id: "input-0",
            type: "target",
            position: Ze.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          Je,
          {
            id: "output-0",
            type: "source",
            position: Ze.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Lr,
          {
            node: n,
            onShowNodeDetail: c
          }
        ),
        /* @__PURE__ */ d(bn, { node: n, selected: t })
      ] });
    }
    const M = Cs(n), ie = hc(n), D = Ln(n), z = uc(n), L = Ve(D) ? D : ie ? { rich: ie } : z || M.text, Y = qr(L, M), ce = !!(M.imageUrl || M.videoUrl || M.audioUrl), ve = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      ce ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ E("div", { className: ve, children: [
      /* @__PURE__ */ E("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(Mp, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ d("span", { children: n.title })
      ] }),
      /* @__PURE__ */ d("div", { className: "ws-node-text-card", children: !Y && M.imageUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        "img",
        {
          src: M.imageUrl,
          alt: Xr(M) || n.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !Y && M.videoUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        xs,
        {
          src: M.videoUrl,
          poster: M.videoPosterUrl,
          ariaLabel: Xr(M) || n.title,
          objectFit: "cover",
          allowDragFromVideo: !0
        },
        M.videoUrl
      ) }) : !Y && M.audioUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ d(
        Fe,
        {
          fallback: /* @__PURE__ */ d(Oe, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ d(ou, { src: M.audioUrl })
        }
      ) }) : !Y && M.fileUrl ? /* @__PURE__ */ E("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ d(Aa, { size: 16 }),
        /* @__PURE__ */ d("span", { children: Xr(M) || "文件内容" })
      ] }) : /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
        Gr,
        {
          output: L,
          fallback: z || M.text || "暂无内容",
          mediaGridKind: Vo(M),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ d(
        Je,
        {
          id: "input-0",
          type: "target",
          position: Ze.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        Je,
        {
          id: "output-0",
          type: "source",
          position: Ze.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ d(
        Lr,
        {
          node: n,
          onShowNodeDetail: c
        }
      ),
      /* @__PURE__ */ d(bn, { node: n, selected: t })
    ] });
  }
  if (n.type === "power") {
    const M = St(s), ie = za(n.power, n.kind), D = Z ? Oa(
      M ? [s?.streamOutput, Wi(n)] : Wi(n)
    ) : null, z = Ht(n), L = M ? "running" : s?.status === "error" ? "error" : s?.status === "success" && !z ? "running" : z ? "complete" : "empty", Y = !!(!ee && !Z && !se && s?.streamStarted && (s.streamText || s.streamOutput) && s.status !== "success"), ce = Y ? s?.streamOutput ? Xn(s.streamOutput, "audio") : {
      text: s?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : Rr(n), ve = Y ? s?.streamOutput || { text: s?.streamText || "" } : Ln(n), de = ee || Z || se || Y || z, Re = !ee && !Z && !se && !!(ce.imageUrl || ce.videoUrl || ce.audioUrl || ce.fileUrl), $e = Rs(n, a), ye = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      M ? "is-running" : "",
      n.runError && !M ? "is-error" : "",
      ee ? "is-storyboard" : "",
      Z ? "is-storyboard-grid" : "",
      se ? "is-video-compose" : "",
      ie ? "is-audio" : "",
      de ? "has-content" : "",
      Re ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ E("div", { className: ye, children: [
      /* @__PURE__ */ E("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(
          fm,
          {
            power: n.power,
            kind: n.kind,
            outputType: n.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ d(
          Bi,
          {
            title: n.title,
            onRename: a && !F ? (fe) => a(n.id, { title: fe, titleMode: "manual" }) : void 0
          }
        ),
        fl(n) ? /* @__PURE__ */ d("span", { className: "ws-node-prompt-override-badge", children: "提示词已修改" }) : null
      ] }),
      /* @__PURE__ */ E("div", { className: "ws-node-power-card", children: [
        M ? /* @__PURE__ */ E("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
        se ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载视频合成" }),
            children: /* @__PURE__ */ d(
              db,
              {
                composition: n.composerDraft?.videoComposition,
                referenceItems: u.filter(
                  (fe) => fe.source !== "current" || fe.id !== n.id
                ),
                connectedMediaReferences: h,
                running: M,
                onChange: N ? (fe) => N(n.id, {
                  ...n.composerDraft || {},
                  videoComposition: fe
                }) : void 0,
                onConnectedMediaEdgeRemove: S,
                onRun: C ? (fe) => {
                  C({
                    ...n,
                    composerDraft: {
                      ...n.composerDraft || {},
                      videoComposition: fe
                    }
                  }).catch(
                    (ct) => U.error(
                      ct instanceof Error ? ct.message : "视频合成失败"
                    )
                  );
                } : void 0,
                onOpenDetail: c ? () => c(n) : void 0
              }
            )
          }
        ) : ee ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载分镜内容", compact: !0 }),
            children: /* @__PURE__ */ d(
              ab,
              {
                output: M ? s?.streamText || "" : Wi(n),
                status: L,
                started: !!s?.streamStarted,
                generatedShotCount: s?.generatedCount || 0,
                referenceItems: u.filter(
                  (fe) => fe.source !== "current" || fe.id !== n.id
                ),
                onOpenDetail: z && c ? () => c(n) : void 0
              }
            )
          }
        ) : Z ? /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载分镜宫格", compact: !0 }),
            children: /* @__PURE__ */ d(
              im,
              {
                grid: D,
                aspectRatio: rN(n),
                running: M,
                layout: n.composerDraft?.storyboardGridLayout,
                onLayoutChange: N ? (fe) => N(n.id, {
                  ...n.composerDraft || {},
                  storyboardGridLayout: fe
                }) : void 0,
                onImport: b ? () => b(n.id) : void 0,
                onFrameImport: b ? (fe, ct) => b(n.id, ct) : void 0,
                onSlotImport: b ? (fe) => b(n.id, fe) : void 0,
                onEdit: D && c ? () => c(n) : void 0
              }
            )
          }
        ) : de ? /* @__PURE__ */ d(
          $f,
          {
            preview: ce,
            output: ve,
            fallback: n.description,
            streaming: M && Y,
            generating: M && Re && !Y,
            videoObjectFit: "cover",
            onMediaSize: $e,
            compactMediaGrid: zf(
              n,
              ce
            )
          }
        ) : /* @__PURE__ */ d(ZN, {})
      ] }),
      n.runError && !M ? /* @__PURE__ */ d(
        YN,
        {
          projectId: o,
          node: n,
          onOpenDetail: c ? () => c(n) : void 0
        }
      ) : null,
      /* @__PURE__ */ d(
        Je,
        {
          id: "input-0",
          type: "target",
          position: Ze.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        Je,
        {
          id: "output-0",
          type: "source",
          position: Ze.Right,
          className: "is-out"
        }
      ),
      ee || Z || se ? null : /* @__PURE__ */ d(
        Lr,
        {
          node: n,
          onShowNodeDetail: c
        }
      ),
      /* @__PURE__ */ d(bn, { node: n, selected: t })
    ] });
  }
  return /* @__PURE__ */ E("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ d(
      Je,
      {
        id: "input-0",
        type: "target",
        position: Ze.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ d(
      Je,
      {
        id: "output-0",
        type: "source",
        position: Ze.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ d("div", { className: "ws-node-title", children: n.title }),
    /* @__PURE__ */ d("div", { className: "ws-node-desc", children: n.description }),
    /* @__PURE__ */ d(Lr, { node: n, onShowNodeDetail: c }),
    /* @__PURE__ */ d(bn, { node: n, selected: t })
  ] });
}
function HN(e, t) {
  return WN(e.data, t.data) && e.selected === t.selected;
}
function WN(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && Ef(e.groupMembers, t.groupMembers) && mN(e.groupRuntime, t.groupRuntime) && e.canvasHasRunningNode === t.canvasHasRunningNode && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && e.storyboardFrameRunning === t.storyboardFrameRunning && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && cN(e.inputContext, t.inputContext);
}
function YN({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = k_(e, t), o = /* @__PURE__ */ E(Nn, { children: [
    /* @__PURE__ */ d(Pp, { size: 14 }),
    /* @__PURE__ */ d("span", { children: r })
  ] });
  return /* @__PURE__ */ d(ze, { label: r, children: n ? /* @__PURE__ */ d(
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
function $f({
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
  const f = ne(null), u = ne(!0), h = c ? Xr(e) : "", S = qr(t, e), N = Vo(e), b = !!(a && ru(t, N));
  return pe(() => {
    if (!r) {
      u.current = !0;
      return;
    }
    const C = f.current;
    !C || !u.current || (C.scrollTop = C.scrollHeight);
  }, [e.text, r]), !S && e.imageUrl ? /* @__PURE__ */ E(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          Ra,
          {
            src: e.imageUrl,
            alt: h || "生成图片",
            onMediaSize: i
          }
        ),
        h ? /* @__PURE__ */ d("p", { children: h }) : null,
        /* @__PURE__ */ d(Ji, { active: o })
      ]
    }
  ) : !S && e.videoUrl ? /* @__PURE__ */ E(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          xs,
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
        /* @__PURE__ */ d(Ji, { active: o })
      ]
    }
  ) : !S && e.audioUrl ? /* @__PURE__ */ E(
    "div",
    {
      className: `ws-node-generated-media is-audio ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          Fe,
          {
            fallback: /* @__PURE__ */ d(Oe, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ d(ou, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ d(Ji, { active: o })
      ]
    }
  ) : !S && e.fileUrl ? /* @__PURE__ */ E("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ d(Aa, { size: 16 }),
    /* @__PURE__ */ d("span", { children: h || "文件内容" })
  ] }) : /* @__PURE__ */ d(
    "div",
    {
      ref: f,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${b ? "is-compact-media-grid" : ""}`,
      onScroll: (C) => {
        const F = C.currentTarget;
        u.current = F.scrollHeight - F.scrollTop - F.clientHeight < 12;
      },
      children: /* @__PURE__ */ d(
        Gr,
        {
          output: t,
          fallback: e.text || n,
          streaming: r,
          mediaGridKind: N,
          compactMediaGrid: b,
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function Ra({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [o, s] = j(e);
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
function Ji({ active: e }) {
  return e ? /* @__PURE__ */ E(
    "div",
    {
      className: "ws-node-media-generating nodrag nopan nowheel",
      role: "status",
      "aria-live": "polite",
      onPointerDown: (t) => t.stopPropagation(),
      onClick: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ d(Sn, { size: 18, className: "ws-spin" }),
        /* @__PURE__ */ d("span", { children: "生成中" })
      ]
    }
  ) : null;
}
function Xr(e) {
  const t = String(e.text || "").trim();
  return !t || Rn(t) ? "" : t;
}
function XN(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, o = 340;
  let s = r, i = s / n;
  return i > o && (i = o, s = i * n), {
    width: Math.round(Md(s, 150, r)),
    height: Math.round(Md(i, 150, o))
  };
}
function Rs(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, o) => {
      const s = XN(r, o);
      if (!s)
        return;
      const i = {
        width: s.width,
        height: s.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function Md(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function ZN() {
  return /* @__PURE__ */ E("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {})
  ] });
}
function JN(e) {
  return e.type === "storyboardFrame" ? "ws-minimap-storyboard-frame" : "";
}
function QN(e) {
  return e.type === "storyboardFrame" ? "transparent" : eS(e.data);
}
function eS(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function tS() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function nS() {
  return typeof window > "u" ? 0 : Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0
  );
}
function Vr(e) {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  e > 0 ? t.searchParams.set("canvas_id", String(e)) : t.searchParams.delete("canvas_id"), window.History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    t
  );
}
function rS(e) {
  if (typeof window > "u")
    return !1;
  try {
    return mb(
      window.localStorage.getItem(
        `${Gl}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function oS() {
  if (typeof window > "u")
    return Ss;
  try {
    return Hl(
      Number(
        window.localStorage.getItem(ql) || Ss
      )
    );
  } catch {
    return Ss;
  }
}
function Dd(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
const DS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: tI
}, Symbol.toStringTag, { value: "Module" }));
export {
  zg as A,
  Ec as B,
  Oe as C,
  St as D,
  MS as E,
  Ha as F,
  Lh as G,
  jn as H,
  DS as I,
  Am as V,
  Hl as a,
  Nu as b,
  tg as c,
  $n as d,
  Va as e,
  _S as f,
  py as g,
  ph as h,
  Qr as i,
  kS as j,
  CS as k,
  RS as l,
  Un as m,
  xS as n,
  AS as o,
  TS as p,
  vS as q,
  oh as r,
  Iy as s,
  wS as t,
  k_ as u,
  NS as v,
  bS as w,
  IS as x,
  Mm as y,
  SS as z
};
