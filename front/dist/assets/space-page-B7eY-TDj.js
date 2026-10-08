import { a as O, j as l, F as Nn, b as _p } from "./react-CDpwMNlY.js";
import { e as te, a as $, b as ue, h as M, u as ae, A as bp, S as Oe, l as fa, q as Wd, o as Ip, n as Yd } from "./file-kind-DFeonxO2.js";
import { d as ft, c as Lt, a as Np } from "./preloadable-B6OSmL0f.js";
import { c as vp, d as Sp, a as yo, e as Cp, N as Rp, w as kp, n as xp, g as Ap, B as Vc, E as Tp, b as Mp, f as Dp, i as Pp, M as Ep, P as nt, H as Fp } from "./normalize-EUxZD5hh.js";
import { k as Ua, q as Xd, s as Op, w as Bp, h as zp, m as $p, aY as jp, aZ as Zd, K as Vp, ay as Jd, P as Qd, L as pa, c as Lp, z as Up, r as Yn, j as Ka, Q as Kp, i as qp, C as qa, b as Ga, aV as Gp, X as eu, A as Hp, H as Wp, aj as Yp, a_ as Xp, a$ as Zp, aS as Jp, b0 as Qp, l as em, W as tm, a9 as Lc, a8 as Uc, ac as nm, b1 as rm, e as tu, I as nu } from "./vendor-icons-Cz5zFzlk.js";
import { t as j } from "./index-CVhTq79S.js";
import { q as ho, s as Ze, t as om, k as sm } from "./site-config-cvPYHSmK.js";
import { u as im } from "./use-body-appearance-DOsfYA-9.js";
import { ab as zt, ac as E, ad as he, ae as ru, af as ou, ag as su, ah as it, ai as xr, aj as Ha, ak as Kc, al as iu, am as Ct, an as au, ao as cu, O as Wa, ap as du, N as Ya, p as vn, i as si, aq as am, ar as cm, B as ot, as as uu, at as dm, au as De, av as lu, aw as um, ax as lm, ay as fm, az as pm, aA as Ho, aB as mm, aC as fu, b as gm, aD as ym, Q as pu, aE as hm, s as mu, d as wm, aF as gu, aG as vs, aH as yu, aI as _m, aJ as hu, aK as wu, aL as qc, aM as so, C as io, aN as ts, aO as $s, aP as bm, aQ as Im, h as Nm, aR as Rt, aS as Nr, aT as Wo, aU as Ve, aV as _u, aW as ma, aX as vm, aY as Sm, aZ as Ss, a_ as vr, a$ as Xa, b0 as js, A as bu, b1 as Cm, j as Rm, b2 as km, b3 as Iu } from "./node-detail-content-DEcv8fc7.js";
import { a as Mr, r as Jn, n as xm, e as Za, g as Am, i as Tm, P as Mm } from "./power-icon-Dfs_ppQs.js";
import { l as Dm, p as Pm, k as Em, d as Nu, o as Fm, u as vu, w as Su, c as Om, n as Bm } from "./runtime-Gq7KG82o.js";
import { n as zm, i as $m } from "./asset-api-nw012__Q.js";
import { L as jm, M as Ja, N as ns, O as ii, o as Vm, Q as Cu, n as Gc, R as Qa, T as Ru, B as Lm, C as Um, E as Km, D as ku, U as qm } from "./space-sequence-card-B8s1aEtn.js";
import "./media-inspector-gallery-Ci5KbK6m.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-D3GR_Cqb.css", import.meta.url).href]);
function rn(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function xu(e) {
  return rn(e) === "media";
}
function Gm(e, t, n) {
  const r = new Map(n.map((s) => [s.id, s])), o = new Set(e.map((s) => s.id));
  return [
    ...e.flatMap((s) => {
      if (!t.has(s.id))
        return [s];
      const i = r.get(s.id);
      return i ? [i] : [];
    }),
    ...n.filter((s) => !o.has(s.id))
  ];
}
const Hm = { width: 720, height: 420 }, Hc = { width: 360, height: 240 }, Wc = { width: 2400, height: 1600 }, Au = 48, ao = 16;
function Tu(e, t) {
  return e.filter((n) => n.groupId === t);
}
function Mu(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? Tu(e, n.id) : [n] : [];
}
function Wm(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function Yc(e, t, n) {
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
function Vi(e, t, n) {
  const r = e.find((c) => c.id === t), o = r ? Du(e, r) : void 0;
  if (!r || !o)
    return n;
  const s = Xc(
    n.x,
    o.x + ao,
    o.x + o.width - ao - r.width
  ), i = Xc(
    n.y,
    o.y + Au,
    o.y + o.height - ao - r.height
  );
  return s === n.x && i === n.y ? n : { x: s, y: i };
}
function ga(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group" || Du(e, r))
    return e;
  const o = { ...r, ...n }, s = Ym(e, o);
  return (r.groupId || "") === s ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: s || void 0 } : i
  );
}
function Jt(e, t) {
  const n = new Map(e.map((s) => [s.id, s])), r = /* @__PURE__ */ new Set(), o = [];
  for (const s of t) {
    const i = s.logicalFrom || s.from, c = s.logicalTo || s.to, a = n.get(i), d = n.get(c);
    if (!a || !d)
      continue;
    const f = a.groupId !== d.groupId, h = f && a.type !== "group" && a.groupId ? a.groupId : a.id, I = f && d.type !== "group" && d.groupId ? d.groupId : d.id;
    if (!h || !I || h === I)
      continue;
    const N = `${i}\0${c}\0${rn(s)}`;
    r.has(N) || (r.add(N), o.push({ ...s, from: h, to: I, logicalFrom: i, logicalTo: c }));
  }
  return o;
}
function Ym(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.id !== t.id && n >= s.x + ao && n <= s.x + s.width - ao && r >= s.y + Au && r <= s.y + s.height - ao
  ).sort(
    (s, i) => s.width * s.height - i.width * i.height
  )[0]?.id || "";
}
function Du(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (n) => n.id === t.groupId && n.type === "group" && n.group?.origin === "script"
    );
}
function Xc(e, t, n) {
  return Math.min(Math.max(e, t), Math.max(t, n));
}
const Xm = [
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
function Uv(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function Kv() {
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
function Pu(e) {
  const t = zt(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(Jm).filter(Boolean) : [], r = zt(t.settings), o = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(ng).filter(Boolean) : [];
  return {
    version: 3,
    clips: n,
    audioTracks: o,
    settings: {
      resolution: Ae(r.resolution) || "auto",
      fps: Ar(r.fps, 0, 120, 0)
    }
  };
}
function qv(e) {
  const t = e.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = e.clips.reduce((r, o, s) => s >= e.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function Gv(e) {
  const t = e.clips.flatMap(
    (r, o) => r.blockingIssues.map(
      (s) => `${r.title || `镜头 ${o + 1}`}：${s}`
    )
  ), n = e.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function Zm(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function Hv(e) {
  return e ? [
    Zm(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function Jm(e) {
  const t = zt(e), n = Ae(t.id);
  if (!n)
    return null;
  const r = Vs(
    t.visualVideo ?? t.visual_video
  ), o = Vs(
    t.originalAudioSource ?? t.original_audio_source
  ), s = zt(
    t.transitionToNext ?? t.transition_to_next
  ), i = zt(
    t.storyboardTransitionToNext ?? t.storyboard_transition_to_next
  ), c = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map(tg).filter(Boolean) : [], a = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(eg).filter(Boolean) : [], d = Qm(i), f = Fu(s.type), h = Ae(t.sourceEdgeId ?? t.source_edge_id);
  return {
    id: n,
    title: Ae(t.title) || r?.label || "镜头",
    ...h ? { sourceEdgeId: h } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: rg(t.duration),
    originalVolume: Ar(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: c,
    subtitleTracks: a,
    useOriginalVideo: Ou(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: sg(t.blockingIssues ?? t.blocking_issues),
    transitionToNext: {
      type: f,
      durationMs: f === "none" ? 0 : Ar(
        s.durationMs ?? s.duration_ms,
        100,
        5e3,
        500
      )
    },
    ...d ? { storyboardTransitionToNext: d } : {}
  };
}
function Qm(e) {
  if (!Object.keys(e).length)
    return;
  const t = Fu(e.type);
  return {
    type: t,
    durationMs: t === "none" ? 0 : Ar(e.durationMs ?? e.duration_ms, 100, 5e3, 500)
  };
}
function eg(e) {
  const t = zt(e), n = Ae(t.id), r = Ae(t.text);
  if (!n || !r)
    return null;
  const o = Ae(t.source) === "speech" ? "speech" : "caption", s = Ae(t.speechId ?? t.speech_id), i = E(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, E(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...s ? { speechId: s } : {},
    source: o
  };
}
function tg(e) {
  const t = zt(e), n = Ae(t.id);
  if (!n)
    return null;
  const r = Vs(t.audio), o = Ae(t.kind) === "narration" ? "narration" : "dialogue", s = Ae(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, E(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, E(t.sourceStart ?? t.source_start)),
    fit: Eu(t.fit, "trim"),
    kind: o,
    ...s ? { characterId: s } : {},
    text: Ae(t.text),
    volume: Ar(t.volume, 0, 1, 1)
  };
}
function ng(e) {
  const t = zt(e), n = Ae(t.id);
  if (!n)
    return null;
  const r = Vs(t.audio), o = Ae(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, E(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, E(t.sourceStart ?? t.source_start)),
    kind: o,
    volume: Ar(t.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: Eu(t.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && Ou(t.loop),
    fadeOut: Ar(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function Eu(e, t) {
  return Ae(e) === "strict" ? "strict" : Ae(e) === "trim" ? "trim" : t;
}
function rg(e) {
  const t = E(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Vs(e) {
  const t = zt(e), n = E(t.assetId ?? t.asset_id), r = E(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const o = og(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: Ae(t.label),
    ...E(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: E(t.mediaIndex ?? t.media_index) } : {},
    ...Ae(t.mediaUrl ?? t.media_url) ? { mediaUrl: Ae(t.mediaUrl ?? t.media_url) } : {},
    ...Ae(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: Ae(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function og(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = zt(r), s = Ae(o.url), i = E(o.index);
    if (!s && i <= 0)
      continue;
    const c = i > 0 ? `index:${i}` : `url:${s}`;
    n.has(c) || (n.add(c), t.push({
      url: s,
      index: i > 0 ? i : 0,
      ...Ae(o.usage) ? { usage: Ae(o.usage) } : {}
    }));
  }
  return t;
}
function Fu(e) {
  const t = Ae(e);
  return Xm.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function Ae(e) {
  return String(e ?? "").trim();
}
function sg(e) {
  return Array.isArray(e) ? e.map(Ae).filter(Boolean) : [];
}
function Ar(e, t, n, r) {
  const o = Number(e);
  return Number.isFinite(o) ? Math.min(n, Math.max(t, o)) : r;
}
function Ou(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
function ai(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return;
  const t = e, n = jo(t.started_at ?? t.startedAt);
  if (n == null)
    return;
  const r = jo(t.finished_at ?? t.finishedAt);
  return {
    startedAt: n,
    ...r != null && r >= n ? { finishedAt: r } : {}
  };
}
function Bu(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.round(t) : void 0;
}
function ec({
  nodeRunTiming: e,
  runCreatedAt: t,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return jo(e?.startedAt) ?? jo(t) ?? jo(n) ?? r;
}
function Cs(e) {
  const t = Math.max(0, Math.floor(e / 1e3)), n = t % 60, r = Math.floor(t / 60), o = r % 60, s = Math.floor(r / 60);
  return s > 0 ? `${s}:${Rs(o)}:${Rs(n)}` : `${Rs(r)}:${Rs(n)}`;
}
function ig(e, t, n) {
  const r = Cs(e);
  if (!t)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const o = Bu(n);
  if (!o)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const s = e >= o ? `已超预计 ${Cs(e - o)}` : `剩余约 ${Cs(o - e)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: s,
    tooltip: `已运行 ${r}，历史平均约 ${Cs(o)}，${s}`
  };
}
function jo(e) {
  if (typeof e == "number" && Number.isFinite(e) && e > 0)
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim())
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function Rs(e) {
  return String(e).padStart(2, "0");
}
function In(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function Un(e) {
  const t = String(e.status || "").trim();
  return t ? vp(t) || Sp(t) : !1;
}
function Qn(e) {
  if (!e)
    return "";
  const t = String(
    e.status || e.result?.status || ""
  ).trim();
  return t ? yo(t) : "";
}
function rs(e) {
  const t = String(e || "").trim();
  return !!t && Cp(t);
}
function Sn(e) {
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
    status: yo(e?.status || n.status),
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
    node_results: zu(
      e?.node_results || t.node_results
    ),
    pending_node: tc(
      e?.pending_node || t.pending_node
    ),
    execution_plan: lg(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(mg).filter((r) => !!r) : []
  };
}
function tc(e) {
  if (!e || typeof e != "object")
    return null;
  const t = String(e.node_key || "");
  return t ? {
    node_key: t,
    execution_id: Number(e.execution_id || 0),
    node_type: String(e.node_type || ""),
    function_key: String(e.function_key || ""),
    node_run_id: Number(e.node_run_id || 0),
    run_id: Number(e.run_id || 0),
    request_id: String(e.request_id || ""),
    flow_run_id: Number(e.flow_run_id || 0),
    release_id: Number(e.release_id || 0),
    child_run_id: Number(e.child_run_id || 0),
    child_request_id: String(e.child_request_id || ""),
    asset_id: Number(e.asset_id || 0),
    version_id: Number(e.version_id || 0),
    status: yo(e.status || e.result?.status),
    error: Cn(e.error),
    output: e.output,
    asset: e.asset,
    version: e.version,
    result: e.result,
    approval: e.approval,
    interaction: e.interaction,
    persists_result: !!e.persists_result,
    agent_run_id: Number(e.agent_run_id || 0),
    runTiming: ai(e.run_timing)
  } : null;
}
function zu(e) {
  return Array.isArray(e) ? e.map(tc).filter((t) => !!t) : [];
}
function ag(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = zu(e.node_results), o = n ? r.find((s) => s.node_key === n) : r[0];
  return o || tc(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function nc(e) {
  return e ? Lu(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function $u(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => yo(
    n.status || n.result?.status
  ) === "fail");
  return Lu(
    nc(t),
    e.output?.error,
    e.error
  );
}
function cg(e, t = "节点运行失败") {
  return rc(
    nc(e),
    t
  );
}
function ju(e, t = "画布运行失败") {
  return rc($u(e), t);
}
function rc(e, t = "运行失败") {
  const n = Cn(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function dg(...e) {
  for (const t of e) {
    const n = Cn(t);
    if (n)
      return n;
  }
  return "";
}
const Vu = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function ug(e) {
  return Vu.has(Cn(e));
}
function Vo(e) {
  const t = Cn(e);
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function Lu(...e) {
  let t = "";
  for (const n of e) {
    const r = Cn(n);
    if (r && (t ||= r, !Vu.has(r)))
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
  const t = e, n = dg(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = Cn(t.code), o = Cn(t.detail);
  return [r, o].filter(Boolean).join(": ");
}
function lg(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(fg).filter((r) => !!r) : [], n = Array.isArray(e.edges) ? e.edges.map(pg).filter((r) => !!r) : [];
  return {
    nodes: t,
    edges: n,
    incoming: Zc(e.incoming),
    outgoing: Zc(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function fg(e) {
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
function pg(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function Zc(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const o = Array.isArray(r) ? r.map((s) => String(s || "")).filter(Boolean) : [];
    t.set(String(n), o);
  }
  return t;
}
function mg(e) {
  const t = String(e?.node_key || ""), n = Number(e?.node_run_id || 0);
  return !t || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(e?.node_id || 0),
    node_key: t,
    node_type: String(e?.node_type || ""),
    status: yo(e?.status),
    persists_result: !!e?.persists_result,
    runTiming: ai(e?.run_timing)
  };
}
const Ms = "primary_text", gg = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), yg = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), wo = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function hg(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = String(r.key || "").trim(), s = String(r.type || "").trim().toLowerCase(), i = String(r.value_type || "string").trim().toLowerCase();
    !o || wo.has(o) || t.has(o) || !gg.has(s) || i === "number" || (t.add(o), n.push(o === r.key ? r : { ...r, key: o }));
  }
  return n;
}
function Uu(e, t, n) {
  const r = n.trim(), o = er(t?.paramBindings);
  return hg(e).filter(
    (s) => qu(o, s.key, r)
  );
}
function wg(e, t, n) {
  return qu(
    er(e?.paramBindings),
    t,
    n
  );
}
function _g(e) {
  if (e.length !== 1)
    return;
  const t = e[0], n = String(t.key || "").trim();
  return n && !wo.has(n) ? n : void 0;
}
function ya(e) {
  const t = _g(e);
  return t ? { kind: "automatic", targetParamKey: t } : e.length > 1 ? { kind: "choose", params: e } : { kind: "unavailable" };
}
function bg(e, t, n = !1) {
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
function Ig(e, t, n) {
  const r = er(t?.paramBindings), o = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), s = [
    ...new Set(e.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !o.has(a));
  if (s.length !== 1)
    return;
  const i = s[0], c = ya(
    Uu(n, t, i)
  );
  return c.kind === "automatic" ? { sourceNodeId: i, targetParamKey: c.targetParamKey } : void 0;
}
function Ng(e) {
  return ha(e.type) === "prompt" || ha(e.key) === "prompt" ? "提示词" : String(e.name || "").trim() || "文本参数";
}
function Jr(e) {
  return e ? e.type === "agent" ? !0 : e.type === "power" ? Ui(e.power?.kind, e.kind, e.outputType) : e.type === "asset" ? Ui(e.asset?.kind, e.kind, e.outputType) : Ui(e.kind, e.outputType) : !1;
}
function ks(e) {
  return !!(e?.type === "power" && e.composerDraft?.storyboardWorkType === "mv" && Mr(e.power, e.kind, e.outputType));
}
function er(e) {
  const t = Jc(e), n = [];
  for (const [r, o] of Object.entries(t)) {
    const s = r.trim(), i = Jc(o), c = String(
      i.sourceNodeId ?? i.source_node_id ?? ""
    ).trim(), a = String(
      i.sourceOutput ?? i.source_output ?? Ms
    ).trim().toLowerCase();
    !s || wo.has(s) || !c || a !== Ms || n.push([
      s,
      {
        sourceNodeId: c,
        sourceOutput: Ms
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function vg(e) {
  const t = er(e);
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
function Sg(e, t, n) {
  const r = t.trim(), o = n.trim();
  return !r || wo.has(r) || !o ? e : {
    ...e,
    paramBindings: {
      ...er(e.paramBindings) || {},
      [r]: {
        sourceNodeId: o,
        sourceOutput: Ms
      }
    }
  };
}
function Cg(e, t, n) {
  const r = t.trim();
  if (!r)
    return e;
  const o = n.trim();
  return !o || wo.has(o) ? e : Sg(
    Ls(e, r),
    o,
    r
  );
}
function Rg(e, t, n = []) {
  const r = t.trim(), o = er(e?.paramBindings);
  if (!r || !o)
    return;
  const s = Object.entries(o).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (s.length === 0)
    return;
  const i = new Map(
    n.map((a) => [a.key.trim(), Ng(a)])
  ), c = s.map(
    (a) => i.get(a) || "文本参数"
  );
  return {
    targetParamKeys: s,
    targetParamKey: s.length === 1 ? s[0] : void 0,
    label: c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`
  };
}
function Li(e, t, n = []) {
  const r = t.trim();
  if (r && String(e?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const o = Rg(e, r, n);
  return o ? { ...o, purpose: "param" } : void 0;
}
function kg(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = Ku(e, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function Ku(e, t) {
  const n = t.trim(), r = er(e.paramBindings);
  if (!n || !r)
    return e;
  const o = Object.fromEntries(
    Object.entries(r).filter(
      ([, s]) => s.sourceNodeId !== n
    )
  );
  return Object.keys(o).length === Object.keys(r).length ? e : Ag(e, o);
}
function Ls(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = Ku(e, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: o, ...s } = r;
  return s;
}
function xg(e, t) {
  if (t.size === 0)
    return e;
  let n = !1;
  const r = e.map((o) => {
    let s = o.composerDraft;
    if (!s?.paramBindings && !s?.storyboardLyricsSourceNodeId)
      return o;
    for (const i of t)
      s = Ls(s, i);
    return s === o.composerDraft ? o : (n = !0, { ...o, composerDraft: s });
  });
  return n ? r : e;
}
function ha(e) {
  return String(e || "").trim().toLowerCase();
}
function Ui(...e) {
  const t = e.map(ha).find(Boolean) || "";
  return yg.has(t);
}
function Ag(e, t) {
  const { paramBindings: n, ...r } = e;
  return Object.keys(t).length > 0 ? { ...r, paramBindings: t } : r;
}
function qu(e, t, n) {
  const r = t.trim(), o = n.trim();
  if (!r || wo.has(r) || !o)
    return !1;
  const s = e?.[r];
  return !s || s.sourceNodeId === o;
}
function Jc(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const Gu = [
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
], Tg = new Map(
  Gu.map((e) => [e.key, e])
), Wv = Gu.map(({ key: e, label: t, description: n }) => ({
  key: e,
  label: t,
  description: n
}));
function tr(e) {
  return Tg.get(
    String(e || "").trim()
  );
}
function Mg(e, t = "") {
  const n = Pg(e), r = Po(n.key), o = tr(
    r || Dg(t)
  );
  if (!o)
    return r ? {
      key: r,
      label: Po(n.label),
      description: Po(n.description)
    } : void 0;
  const s = Po(n.label), i = Po(n.description);
  return {
    key: o.key,
    label: o.key === "import" && s === "导入" ? o.label : s || o.label,
    description: o.key === "import" && i === "导入资产并连接到当前节点。" ? o.description : i || o.description
  };
}
function po(e, t) {
  if (e.type !== "function")
    return !1;
  const n = tr(e.functionOption?.key);
  return !!(n && (!t || n.key === t));
}
function Dg(e) {
  const t = e.trim();
  return t === "开始" ? "start" : t === "导入" || t === "引用" ? "import" : t === "展示" ? "display" : t.includes("保存") ? "save" : "";
}
function Pg(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function Po(e) {
  return typeof e == "string" ? e.trim() : "";
}
const wa = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, Eg = { width: 180, height: 180 }, Fg = { width: 240, height: 160 }, Qc = { width: 620, height: 360 }, _a = { width: 800, height: 460 };
function Og(e) {
  const t = Ie(e);
  return {
    project: Ug(t.project),
    team: Kg(t.team),
    release: qg(t.release),
    assetCates: Ot(t.asset_cates).map(Gg),
    flows: Ot(t.flows).map(Wg),
    canvasList: Ot(t.canvas_list).map(ci),
    canvases: Xg(t.canvas),
    assets: Ot(Ie(t.assets).items).map(nl),
    assistant: Bg(t.assistant),
    initialCanvasId: E(t.active_canvas_id),
    initialAssetCateId: E(t.active_asset_cate_id)
  };
}
function ci(e) {
  const t = Ie(e);
  return {
    id: E(t.id),
    projectId: E(t.project_id),
    assetCateId: E(t.asset_cate_id),
    name: A(t.name) || "第一幕",
    sort: E(t.sort),
    status: E(t.status),
    updatedAt: A(t.updated_at),
    deletedAt: A(t.deleted_at)
  };
}
function Bg(e) {
  const t = Ie(e);
  return {
    available: !!t.available,
    reason: A(t.reason),
    releaseID: E(t.release_id),
    roleID: E(t.role_id),
    roleType: A(t.role_type),
    name: A(t.name) || "画布助手",
    assignment: A(t.assignment),
    agentID: E(t.agent_id),
    agentKey: A(t.agent_key),
    contextKey: A(t.context_key),
    openingEnabled: !!t.opening_enabled
  };
}
function ed(e, t = 0, n = "第一幕") {
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
function oc(e, t = 0) {
  const n = Ie(e), r = E(
    he(n.asset_cate_id, t)
  );
  return Hu({
    id: E(n.id),
    name: A(n.name) || "第一幕",
    sort: E(n.sort),
    status: E(n.status) || 1,
    assetCateId: r,
    nextNodeNo: Math.max(1, E(n.next_node_no)),
    nodes: Ot(n.nodes).map(Jg).filter((o) => !!o),
    edges: Ot(n.edges).map(py).filter((o) => !!o),
    viewport: my(n.viewport),
    updatedAt: A(n.updated_at)
  });
}
function Hu(e) {
  let t = sc(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((o) => {
    if (!Wu(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const s = t++, i = o.titleMode || "manual";
    return n = !0, {
      ...o,
      nodeNo: s,
      titleMode: i,
      ...i === "auto" && !o.storyboardItem ? { title: Yu(o, s) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function sc(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function Wu(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function Yu(e, t) {
  let n = "节点";
  return e.type === "power" ? n = e.power?.name.trim() || Zu(e) : e.type === "agent" ? n = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (n = String(e.flow?.name || "流程").trim() || "流程"), `${n}-${t}`;
}
function Xu(e) {
  const t = Number(e.nodeNo || 0);
  if (t <= 0)
    return !1;
  const n = e.title.trim();
  return n === Yu(e, t).trim() ? !0 : e.type === "power" && n === `${Zu(e)}-${t}`.trim();
}
function Zu(e) {
  const t = Jn(
    e.power,
    e.kind,
    e.outputType
  );
  return t.outputType !== "general" && t.outputName || t.kindName;
}
function zg(e) {
  const t = Ie(e);
  return {
    roles: Ot(t.roles).map(Hg),
    powers: Ot(t.powers).map(Qu),
    powerCategories: Ot(t.power_cates).map(xm),
    powerKinds: Ot(t.power_kinds).map(Yg),
    outputTypes: Ot(t.output_types).map(tl)
  };
}
function Kn(e) {
  return nl(Ie(e));
}
function Ju(e) {
  return e.assetCates.length > 0 ? e.assetCates : [wa];
}
function $g(e) {
  return Ju(e)[0]?.id ?? 0;
}
function ba(e, t) {
  const n = e.length > 0 ? e : [wa];
  return n.find((r) => r.id === t) || n[0] || wa;
}
function Ki(e, t) {
  return ba(e.assetCates, t);
}
function jg(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => gy(n).has(t)).slice(0, 4);
}
function Vg(e) {
  return e.create_status !== 2;
}
function Lg(e) {
  return e.createStatus !== 2;
}
function di(e, t, n, r, o) {
  const s = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, c = o?.asset, a = o?.flow, d = o?.functionOption, f = o?.power, h = o?.role, I = f ? Jn(f) : null, N = Number(c?.asset_cate_id || t.id), b = {
    asset: [
      c?.name || "资产引用",
      c ? Kc(c.kind) : Kc(t.kind),
      c && iu(c.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      f?.name || yy(t.kind),
      I?.outputName || I?.kindName || "能力节点",
      f ? `调用 ${f.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
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
      d?.label || "保存节点",
      "功能",
      d?.description || "开始、引用、保存、展示等功能节点。"
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。"
    ]
  }, [R, P, V] = b[e], G = ol(e, f);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: R,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: P,
    description: V,
    x: s,
    y: i,
    width: G.width,
    height: G.height,
    assetCateId: N,
    kind: c?.kind || f?.kind || t.kind,
    outputType: f?.outputType,
    cardinality: t.cardinality,
    asset: c,
    flow: a,
    functionOption: d,
    power: f,
    role: h,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function Ug(e) {
  const t = Ie(e), n = Ie(t.team);
  return {
    id: E(t.id),
    body_id: E(t.body_id),
    team_id: E(t.team_id),
    release_id: E(t.release_id),
    name: A(t.name) || "未命名作品",
    description: A(t.description),
    mode: A(t.mode) || "team",
    team: {
      id: E(n.id),
      name: A(n.name),
      version: E(n.version)
    }
  };
}
function Kg(e) {
  const t = Ie(e);
  return {
    id: E(t.id),
    name: A(t.name) || "自由团队",
    description: A(t.description)
  };
}
function qg(e) {
  const t = Ie(e);
  return {
    id: E(t.id),
    team_id: E(t.team_id),
    version: E(t.version),
    status: A(t.status)
  };
}
function Gg(e) {
  return {
    id: E(e.id),
    team_id: E(e.team_id),
    name: A(e.name) || "未命名资产",
    kind: A(e.kind) || "text",
    cardinality: A(e.cardinality) || "single",
    status: E(e.status),
    sort: E(e.sort)
  };
}
function Hg(e) {
  return {
    id: E(e.id),
    team_id: E(e.team_id),
    role_type: A(e.role_type),
    role_key: A(e.role_key),
    name: A(e.name),
    agent_id: E(e.agent_id),
    assignment: A(e.assignment),
    create_status: el(e.create_status)
  };
}
function Wg(e) {
  return {
    id: E(e.id),
    name: A(e.name),
    key: A(e.key),
    goal: A(e.goal),
    config: Ie(e.config),
    status: E(e.status),
    sort: E(e.sort),
    output_asset_cate_ids: il(e.output_asset_cate_ids)
  };
}
function Qu(e) {
  const t = A(e.kind) || "text", n = tl(Ie(e.output)), r = A(e.output_type) || "general";
  return {
    id: E(e.id),
    cate_id: E(e.cate_id),
    name: A(e.name) || A(e.key) || "未命名能力",
    key: A(e.key),
    icon: A(e.icon),
    description: A(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: el(e.create_status)
  };
}
function el(e) {
  return Number(e) === 2 ? 2 : 1;
}
function tl(e) {
  return {
    key: A(e.key),
    name: A(e.name),
    allowedKinds: Ds(e.allowed_kinds),
    viewMode: A(e.view_mode),
    defaultWidth: E(e.default_width),
    defaultHeight: E(e.default_height),
    structured: !!e.structured,
    sort: E(e.sort)
  };
}
function Yg(e) {
  return {
    id: A(e.id),
    value: A(e.value) || A(e.name) || A(e.id)
  };
}
function nl(e) {
  const t = ic(Ie(e.version)), n = ac(e.versions);
  return {
    id: E(e.id),
    project_id: E(he(e.project_id, e.projectID)),
    body_id: E(he(e.body_id, e.bodyID)),
    team_id: E(he(e.team_id, e.teamID)),
    flow_id: E(he(e.flow_id, e.flowID)),
    canvas_id: E(he(e.canvas_id, e.canvasID)),
    asset_cate_id: E(
      he(e.asset_cate_id, e.assetCateID)
    ),
    node_key: A(he(e.node_key, e.nodeKey)),
    name: A(e.name),
    kind: A(e.kind) || "text",
    role: A(e.role),
    version_id: E(he(e.version_id, e.versionID)),
    status: A(e.status),
    sort: E(e.sort),
    created_at: A(he(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function ic(e) {
  const t = E(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: E(he(e.asset_id, e.assetID)),
      run_id: E(he(e.run_id, e.runID)),
      node_run_id: E(he(e.node_run_id, e.nodeRunID)),
      release_id: E(he(e.release_id, e.releaseID)),
      request_id: A(he(e.request_id, e.requestID)),
      node_key: A(he(e.node_key, e.nodeKey)),
      source: Ie(e.source),
      version: E(e.version),
      summary: A(e.summary),
      content: e.content,
      created_at: A(he(e.created_at, e.createdAt)),
      updated_at: A(he(e.updated_at, e.updatedAt))
    };
}
function ac(e) {
  return Ot(e).map(ic).filter((t) => !!t);
}
function Xg(e) {
  const t = Ie(e), n = {};
  for (const [r, o] of Object.entries(t)) {
    const s = oc(o), i = s.id || E(r);
    i > 0 && (n[String(i)] = { ...s, id: i });
  }
  return n;
}
function Zg(e, t) {
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
function Qr(e, t) {
  const n = String(e.id);
  return Zg({ [n]: e }, t)[n];
}
function Jg(e) {
  const t = A(e.id), n = A(e.type);
  if (!t || !n)
    return null;
  const r = A(e.run_error), o = A(e.title), s = Mg(
    e.function_option,
    o
  ), i = A(e.description), c = s?.key === "import", a = {
    id: t,
    nodeNo: E(e.node_no) || void 0,
    type: n,
    title: c && o === "导入" ? "引用" : o,
    titleMode: A(e.title_mode) === "manual" ? "manual" : A(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: A(e.subtitle),
    description: c && (!i || i === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : i,
    x: E(e.x),
    y: E(e.y),
    width: E(e.width),
    height: E(e.height),
    groupId: A(e.group_id),
    group: ey(e.group),
    storyboardItem: ty(e.storyboard_item),
    storyboardMaterializedSignature: A(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: xr(
      e.storyboard_frame_plan_version
    ),
    assetCateId: E(e.asset_cate_id),
    outputType: A(e.output_type),
    count: e.count == null ? void 0 : E(e.count),
    functionOption: s,
    composerDraft: dy(e.composer_draft),
    resultRef: fy(e.result_ref),
    runTiming: ai(e.run_timing),
    resultOutput: e.result_output,
    resultView: Qg(e.result_view),
    runError: Vo(r) ? "" : r,
    local: e.local !== !1
  }, d = A(e.kind), f = A(
    e.cardinality
  ), h = ny(e.flow), I = ry(e.role), N = oy(e.asset), b = sy(e.power);
  return d && (a.kind = d), f && (a.cardinality = f), h && (a.flow = h), I && (a.role = I), N && (a.asset = N), b && (a.power = b, a.outputType = a.outputType || b.outputType, Mr(b) && a.width === Qc.width && a.height === Qc.height && (a.width = _a.width, a.height = _a.height)), a;
}
function Qg(e) {
  const t = Ie(e), n = Ct(t.width), r = Ct(t.height);
  if (n == null || r == null || n <= 0 || r <= 0)
    return;
  const o = Ct(t.offset_x), s = Ct(t.offset_y);
  return {
    width: n,
    height: r,
    ...o == null ? {} : { offsetX: o },
    ...s == null ? {} : { offsetY: s }
  };
}
function ey(e) {
  const t = Ie(e);
  if (Object.keys(t).length)
    return {
      origin: A(t.origin),
      sourceNodeId: A(t.source_node_id),
      syncKey: A(t.sync_key),
      layoutKey: A(t.layout_key)
    };
}
function ty(e) {
  const t = Ie(e), n = A(t.source_node_id), r = A(t.item_type), o = A(t.item_id);
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
      generatedPrompt: A(t.generated_prompt),
      dependencyNodeIds: Ds(t.dependency_node_ids),
      referenceNodeIds: Ds(t.reference_node_ids),
      externalReferenceAssetIds: il(t.external_reference_asset_ids),
      shotId: A(t.shot_id),
      shotImageMode: Ya(t.shot_image_mode),
      frameRole: du(t.frame_role),
      frameMediaItems: Wa(t.frame_media_items),
      imageSequenceFrames: cu(
        t.image_sequence_frames
      ),
      speechId: A(t.speech_id),
      speechIds: Ds(t.speech_ids),
      characterId: A(t.character_id),
      speechKind: A(t.speech_kind),
      speakerMode: A(t.speaker_mode),
      startTime: Ct(t.start_time),
      shotDuration: Ct(t.shot_duration),
      requiredDurationValues: au(
        t.required_duration_values
      ),
      continuityAnchor: A(t.continuity_anchor),
      optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true"
    };
}
function ny(e) {
  const t = Ie(e), n = E(t.id), r = A(t.key), o = A(t.name);
  if (!(!n && !r && !o))
    return {
      id: n,
      key: r,
      name: o,
      goal: A(t.goal)
    };
}
function ry(e) {
  const t = Ie(e), n = E(t.id), r = A(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: A(t.role_type),
      agent_id: E(t.agent_id)
    };
}
function oy(e) {
  const t = Ie(e), n = E(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: E(t.asset_cate_id),
      name: A(t.name),
      kind: A(t.kind),
      role: A(t.role),
      version_id: E(t.version_id),
      sort: 0
    };
}
function sy(e) {
  const t = Ie(e), n = E(t.id), r = A(t.key);
  if (!(!n && !r))
    return Qu({
      ...t,
      id: n,
      key: r,
      name: A(t.name)
    });
}
function rl(e) {
  const t = Ie(e);
  if (!Object.keys(t).length)
    return;
  const n = A(t.storyboardGridLayout);
  return {
    prompt: A(t.prompt),
    promptContent: ly(t.promptContent),
    paramValues: Ie(t.paramValues),
    paramBindings: er(t.paramBindings),
    selectedTargetId: E(t.selectedTargetId),
    videoComposition: Pu(t.videoComposition),
    storyboardReferences: su(
      t.storyboardReferences
    ),
    storyboardWorkType: uy(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: A(t.storyboardLyricsSourceNodeId),
    minShotDuration: ou(t.minShotDuration),
    storyboardRangeStartMs: nd(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: nd(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: n ? ru(n) : void 0,
    multiImageMode: cy(t.multiImageMode)
  };
}
function cc(e) {
  return rl(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function iy(e) {
  const t = cc(e), n = ay(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function td(e) {
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
function Yv(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function ay(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function cy(e) {
  const t = A(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function dy(e) {
  const t = Ie(e);
  if (Object.keys(t).length)
    return rl({
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
function uy(e) {
  const t = A(e);
  return Ha(t) ? t : void 0;
}
function nd(e, t) {
  const n = Ct(e);
  if (!(n == null || !Number.isInteger(n) || n < (t ? 0 : 1)))
    return n;
}
function ly(e) {
  const t = Ie(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const o = Ie(r);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function fy(e) {
  const t = Ie(e);
  if (Object.keys(t).length)
    return {
      run_id: E(t.run_id),
      request_id: A(t.request_id),
      flow_run_id: E(t.flow_run_id),
      node_run_id: E(t.node_run_id),
      asset_id: E(t.asset_id),
      version_id: E(t.version_id),
      release_id: E(t.release_id),
      role: A(t.role),
      status: A(t.status),
      updated_at: A(t.updated_at)
    };
}
function py(e) {
  const t = A(e.from), n = A(e.to);
  if (!t || !n)
    return null;
  const r = A(e.purpose);
  return {
    id: A(e.id) || `edge-${t}-${n}`,
    from: t,
    to: n,
    logicalFrom: A(e.logical_from) || void 0,
    logicalTo: A(e.logical_to) || void 0,
    purpose: r === "media" || r === "structure" || r === "dependency" ? r : void 0,
    executionMode: A(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: A(e.media_usage) || void 0
  };
}
function my(e) {
  const t = Ie(e), n = {};
  return t.x != null && (n.x = E(t.x)), t.y != null && (n.y = E(t.y)), t.zoom != null && (n.zoom = E(t.zoom)), n;
}
function gy(e) {
  return new Set(e.output_asset_cate_ids);
}
function yy(e) {
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
function ol(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...Hm };
    case "power":
      return ui(t);
    default:
      return { width: 250, height: 170 };
  }
}
function ui(e) {
  if (Za(e))
    return { ...Fg };
  if (Mr(e))
    return { ..._a };
  const t = hy(e);
  return t || { ...Eg };
}
function hy(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function sl(e) {
  const t = ol(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function Ds(e) {
  return Array.isArray(e) ? e.map(A).filter(Boolean) : [];
}
function il(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = E(r);
    !o || o <= 0 || n.has(o) || (n.add(o), t.push(o));
  }
  return t;
}
function Ot(e) {
  return Array.isArray(e) ? e.filter(it) : [];
}
function Ie(e) {
  return it(e) ? e : {};
}
function A(e) {
  return e == null ? "" : String(e).trim();
}
function wy(e) {
  const t = new Map(e.nodes.map((o) => [o.id, o]));
  let n = !1;
  const r = e.nodes.map((o) => {
    const s = o.storyboardItem?.dependencyNodeIds || [];
    if (o.storyboardItem?.itemType !== "shot" || !o.storyboardItem.continuityAnchor || s.length !== 1)
      return o;
    const i = s[0], c = _y(t.get(i)), a = (o.storyboardItem.referenceNodeIds || []).filter(
      (N) => N !== i
    ), d = o.composerDraft?.promptContent, f = d && {
      ...d,
      parts: d.parts.filter(
        (N) => N.type !== "reference" || N.ref_type !== "asset" || !c || Number(N.ref_id || 0) !== c
      )
    }, h = a.length !== (o.storyboardItem.referenceNodeIds || []).length, I = f?.parts.length !== d?.parts.length;
    return !h && !I ? o : (n = !0, {
      ...o,
      storyboardItem: {
        ...o.storyboardItem,
        referenceNodeIds: a
      },
      composerDraft: o.composerDraft ? { ...o.composerDraft, promptContent: f } : o.composerDraft
    });
  });
  return n ? { ...e, nodes: r } : e;
}
function _y(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function al(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(by),
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
function by(e) {
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
  if ($o(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), Ft(t, "group_id", e.groupId), e.group) {
    const i = {};
    Ft(i, "origin", e.group.origin), Ft(i, "source_node_id", e.group.sourceNodeId), Ft(i, "sync_key", e.group.syncKey), Ft(i, "layout_key", e.group.layoutKey), Object.keys(i).length > 0 && (t.group = i);
  }
  if (e.storyboardItem) {
    const i = e.storyboardItem, c = Ya(i.shotImageMode), a = du(i.frameRole), d = Wa(
      i.frameMediaItems
    ), f = cu(
      i.imageSequenceFrames
    ), h = au(
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
      ...d.length ? {
        frame_media_items: d.map((I) => ({
          frame_role: I.frameRole,
          media_index: I.mediaIndex
        }))
      } : {},
      ...f.length ? { image_sequence_frames: f } : {},
      ...i.speechId ? { speech_id: i.speechId } : {},
      ...i.speechIds?.length ? { speech_ids: i.speechIds } : {},
      ...i.characterId ? { character_id: i.characterId } : {},
      ...i.speechKind ? { speech_kind: i.speechKind } : {},
      ...i.speakerMode ? { speaker_mode: i.speakerMode } : {},
      ...Number.isFinite(i.startTime) ? { start_time: i.startTime } : {},
      ...Number.isFinite(i.shotDuration) ? { shot_duration: i.shotDuration } : {},
      ...h.length > 0 ? { required_duration_values: h } : {},
      ...i.continuityAnchor ? { continuity_anchor: i.continuityAnchor } : {},
      ...i.optional ? { optional: !0 } : {}
    };
  }
  Ft(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), $o(
    t,
    "storyboard_frame_plan_version",
    xr(e.storyboardFramePlanVersion)
  ), $o(t, "asset_cate_id", e.assetCateId), Ft(t, "kind", e.kind), Ft(t, "output_type", e.outputType), Ft(t, "cardinality", e.cardinality), $o(t, "count", e.count), e.flow && (t.flow = {
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
    output: vy(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = Ny(e.composerDraft);
  n && (t.composer_draft = n);
  const r = ky(e.resultRef);
  r && (t.result_ref = r), e.runTiming?.startedAt && e.runTiming.finishedAt && (t.run_timing = {
    started_at: e.runTiming.startedAt,
    finished_at: e.runTiming.finishedAt
  }), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && Gn(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = Iy(e.resultView);
  return s && (t.result_view = s), Vo(e.runError) || Ft(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function Iy(e) {
  if (!e)
    return;
  const t = Ct(e.width), n = Ct(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, o = Ct(e.offsetX), s = Ct(e.offsetY);
  return o != null && (r.offset_x = o), s != null && (r.offset_y = s), r;
}
function Ny(e) {
  if (!it(e))
    return null;
  const t = {};
  Ft(t, "prompt", e.prompt);
  const n = Sy(e.promptContent);
  n && Gn(n) && (t.prompt_content = n), $o(t, "selected_target_id", e.selectedTargetId);
  const r = Cy(e.paramValues);
  r && (t.param_values = r);
  const o = vg(e.paramBindings);
  o && (t.param_bindings = o);
  const s = Pu(e.videoComposition);
  s && Gn(s) && (t.video_composition = s);
  const i = su(
    e.storyboardReferences
  );
  i.length > 0 && Gn(i) && (t.storyboard_references = i), Ha(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), Ft(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const c = ou(e.minShotDuration);
  c != null && (t.min_shot_duration = c);
  const a = Ct(e.storyboardRangeStartMs);
  a != null && Number.isInteger(a) && a >= 0 && (t.storyboard_range_start_ms = a);
  const d = Ct(e.storyboardRangeEndMs);
  return d != null && Number.isInteger(d) && d > 0 && (t.storyboard_range_end_ms = d), e.storyboardGridLayout && (t.storyboard_grid_layout = ru(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function vy(e) {
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
function Sy(e) {
  if (!(!it(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function Cy(e) {
  if (!it(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    Ry(r) || Gn(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function Ry(e) {
  return it(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function ky(e) {
  if (!it(e))
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
    r != null && Gn(r) && (t[n] = r);
  }
  return Object.keys(t).length ? t : null;
}
function Ft(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n);
}
function $o(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Gn(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(Gn) : it(e) ? Object.values(e).every(Gn) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Us = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Us || Object.keys(Us).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Re = Us.joinSiteApi, ke = Us.request;
async function xy(e, t = 0, n = 0) {
  const r = await ke(Re("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: n
  });
  return Og(
    ho(r, "加载创作空间失败")
  );
}
async function Eo(e) {
  const t = await ke(Re("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), n = Ze(t, "加载分类画布失败"), r = n.assets || {}, o = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: oc(n.canvas, e.assetCateId || 0),
    assets: o.map(Kn),
    canvasList: Array.isArray(n.canvas_list) ? n.canvas_list.map(ci) : []
  };
}
function os(e) {
  const t = it(e) ? e : {}, n = it(t.canvas) ? t.canvas : null;
  return {
    canvas: n && Array.isArray(n.nodes) ? oc(n) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(ci) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function Ay(e) {
  const t = await ke(Re("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return os(
    Ze(t, "创建画布失败")
  );
}
async function Ty(e) {
  const t = await ke(Re("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return os(
    Ze(t, "重命名画布失败")
  );
}
async function My(e) {
  const t = await ke(
    Re("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return os(
    Ze(t, "调整画布顺序失败")
  );
}
async function Dy(e) {
  const t = await ke(Re("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return os(
    Ze(t, "删除画布失败")
  );
}
async function Py(e) {
  const t = await ke(Re("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = Ze(t, "加载已删除画布失败");
  return Array.isArray(n.items) ? n.items.map(ci) : [];
}
async function Ey(e) {
  const t = await ke(
    Re("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return os(
    Ze(t, "恢复画布失败")
  );
}
async function Fy(e) {
  const t = await ke(Re("project/canvas_config"), "get", {
    project_id: e
  });
  return zg(
    ho(t, "加载能力列表失败")
  );
}
async function Oy(e) {
  const t = await ke(
    Re("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return Yy(
    ho(t, "加载能力参数失败")
  );
}
async function By(e) {
  const t = al(wy(e.canvas)), n = e.canvas.nodes.find(
    (a) => a.id === e.startNodeId
  ), r = n?.group?.origin === "script" ? n.group : e.canvas.nodes.find((a) => a.id === n?.groupId)?.group, o = e.executionScope === "storyboard_frame" ? n?.id : n?.storyboardItem?.sourceNodeId || (r?.origin === "script" ? r.sourceNodeId : void 0), s = e.canvas.nodes.find(
    (a) => a.id === o
  ), i = [
    s?.asset?.version?.content,
    s?.resultOutput
  ].find((a) => {
    const d = vn(a);
    return d && si(d);
  });
  if (i != null) {
    const a = t.nodes.find((d) => d.id === o);
    a && (a.result_output = i);
  }
  const c = await ke(
    Re("workspace/canvas_execute"),
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
      canvas: t,
      input: e.runInput || {}
    }
  );
  return Ze(c, "画布运行失败");
}
async function zy(e) {
  const t = await ke(
    Re("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    }
  ), n = Ze(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function ss(e, t, n) {
  const r = Ze(e, t).asset;
  if (!r)
    throw new Error(n);
  return Kn(r);
}
async function qi(e) {
  const t = await ke(
    Re("workspace/canvas_execution_list"),
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
  ), n = Ze(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function cl(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), o = await ke(
    Re("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    }
  );
  return Ze(o, "读取画布运行详情失败");
}
async function $y(e) {
  const t = await ke(Re("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return ho(t, "继续画布运行失败");
}
async function jy(e) {
  const t = await ke(Re("run/status"), "get", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || "",
    view: "summary"
  });
  return ho(t, "读取流程状态失败");
}
async function Vy(e) {
  const t = await ke(Re("run/stop"), "post", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || ""
  });
  return Ze(t, "停止画布运行失败");
}
async function Ly(e, t) {
  const n = await ke(
    Re("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), r = Ze(n, "停止全部画布运行失败");
  return {
    count: Number(r.count || 0),
    stoppedCount: Number(r.stopped_count || 0),
    failedCount: Number(r.failed_count || 0),
    items: Array.isArray(r.items) ? r.items : []
  };
}
async function Uy(e) {
  const t = await ke(Re("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return ho(t, "提交信息失败");
}
async function Ky(e) {
  const t = await ke(
    Re("project/update_asset_version"),
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
  return ss(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function Xv(e) {
  const t = await ke(
    Re("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return ss(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function qy(e) {
  const t = await ke(
    Re("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return ss(t, "确认分镜失败", "确认分镜结果为空");
}
async function Zv(e) {
  const t = await ke(
    Re("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return ss(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function Jv(e) {
  const t = e.storyboard.shots.findIndex(
    (s) => s.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await ke(
    Re("project/generate_storyboard_shot"),
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
  ), r = Ze(n, "生成镜头失败"), o = cm(r, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function Qv(e) {
  const t = await ke(Re("project/asset_detail"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    current_only: e.currentOnly ? 1 : 0
  }), n = Ze(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const o = ac(n.versions);
  return {
    asset: Kn(r),
    versions: o,
    versionTotal: Number(n.version_total || o.length),
    hasMore: !!n.has_more
  };
}
async function eS(e) {
  const t = await ke(Re("project/asset_versions"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    page: e.page,
    page_size: e.pageSize || 20
  }), n = Ze(t, "读取资产版本失败"), r = ac(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function tS(e) {
  const t = await ke(
    Re("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    }
  ), n = Ze(t, "读取历史版本失败").version, r = ic(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function Gy(e) {
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
async function dl(e, t) {
  const n = await ke(Re("project/save_asset"), "post", {
    ...Gy(t),
    role: e
  });
  return ss(n, "保存资产失败", "保存资产结果为空");
}
function Hy(e) {
  return dl("work", e);
}
function rd(e) {
  return dl("material", e);
}
async function Wy(e) {
  const t = await ke(Re("workspace/canvas"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId,
    base_revision: e.canvas.updatedAt || "",
    canvas: al(e.canvas)
  }), n = Ze(t, "保存画布失败");
  return {
    canvasId: Number(n.canvas_id || e.canvasId || 0),
    assetCateId: Number(n.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(n.updated_at || e.canvas.updatedAt || "")
  };
}
function Yy(e) {
  const t = it(e) ? e : {}, n = it(t.power) ? t.power : {}, r = it(n.output) ? n.output : {}, o = Qy(
    t.storyboard_work_types
  ), s = eh(
    t.storyboard_reference_purposes,
    o
  ), i = am(
    t.storyboard_min_shot_durations
  ), c = String(n.output_type || n.outputType || "").trim(), a = String(
    r.view_mode || r.viewMode || ""
  ).trim();
  if ((c === "storyboard" || a === "storyboard") && (o.length === 0 || s.length === 0 || i.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const d = new Set(
    s.map((f) => f.key)
  );
  if (o.some(
    (f) => f.required_reference_purposes.some(
      (h) => !d.has(h)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: Xy(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: o,
    storyboard_reference_purposes: s,
    storyboard_min_shot_durations: i
  };
}
function Xy(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = it(t) ? t : {}, r = it(n.supported_options) ? Object.fromEntries(
      Object.entries(n.supported_options).map(([o, s]) => [o.trim(), Lo(s)]).filter(([o, s]) => o !== "" && s.length > 0)
    ) : void 0;
    return {
      ...n,
      supported_options: r && Object.keys(r).length > 0 ? r : void 0
    };
  }) : [];
}
const Zy = /* @__PURE__ */ new Set(["image", "video", "audio"]), Jy = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Qy(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = it(n) ? n : {}, o = String(r.key || "").trim().toLowerCase();
    if (!Ha(o) || t.has(o))
      throw new Error("分镜作品类型注册信息无效");
    const s = Number(r.sort || 0);
    if (!Number.isInteger(s))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(o), {
      key: o,
      name: String(r.name || "").trim() || o,
      sort: s,
      required_reference_purposes: Lo(
        r.required_reference_purposes
      )
    };
  }).sort((n, r) => n.sort - r.sort);
}
function eh(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((o) => o.key)), r = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const s = it(o) ? o : {}, i = String(s.key || "").trim(), c = Lo(s.media_kinds), a = String(
      s.scope || ""
    ).trim(), d = Lo(
      s.work_types
    ), f = Lo(
      s.default_media_kinds
    ), h = String(s.material_type || "").trim(), I = Number(s.max_count || 0), N = Number(s.sort || 0);
    if (!i || r.has(i) || c.length === 0 || c.some(
      (b) => !Zy.has(b)
    ) || !Jy.has(a) || d.some((b) => !n.has(b)) || f.some((b) => !c.includes(b)) || a === "material" && h !== "character" && h !== "scene" && h !== "prop" || a !== "material" && h || !Number.isInteger(I) || I < 0 || !Number.isInteger(N))
      throw new Error("分镜参考用途注册信息无效");
    return r.add(i), {
      key: i,
      name: String(s.name || "").trim() || i,
      media_kinds: c,
      work_types: d,
      scope: a,
      material_type: h,
      default_media_kinds: f,
      max_count: I,
      sort: N
    };
  }).sort((o, s) => o.sort - s.sort);
}
function Lo(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const od = 520, th = 8e3;
function nh({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: o
}) {
  const s = te(n), i = te({}), c = te({}), a = te({}), d = te(/* @__PURE__ */ new Map()), f = te({}), h = te(0), I = te(null), [N, b] = $(0), [R, P] = $({});
  ue(() => {
    s.current = n;
  }, [n]);
  const V = M((B) => {
    const U = f.current[B];
    U != null && (window.clearTimeout(U), delete f.current[B]);
  }, []), G = M(
    (B, U = od) => {
      if (!t || !e || typeof window > "u")
        return;
      V(B);
      const re = h.current;
      f.current[B] = window.setTimeout(() => {
        delete f.current[B], I.current?.(B, re)?.catch(() => {
        });
      }, U);
    },
    [V, t, e]
  ), ee = M(
    async (B, U, re) => {
      if (U !== h.current || !t || !e)
        return;
      for (; d.current.has(B); )
        if (await d.current.get(B), U !== h.current)
          return;
      const le = re?.revision ?? i.current[B] ?? 0;
      if (le <= (c.current[B] || 0))
        return;
      const fe = re?.canvas || s.current[B];
      if (!fe)
        return;
      const _e = (async () => {
        P((Ne) => ({ ...Ne, [B]: "saving" }));
        try {
          const Ne = await Wy({
            projectId: e,
            canvasId: fe.id,
            assetCateId: fe.assetCateId,
            canvas: fe
          });
          if (U !== h.current)
            return;
          c.current[B] = Math.max(
            c.current[B] || 0,
            le
          ), a.current[B] = 0, (i.current[B] || 0) === le ? (r((me) => {
            const ze = me[B], Ke = Ne.updatedAt || ze?.updatedAt;
            return !ze || ze.updatedAt === Ke ? me : {
              ...me,
              [B]: { ...ze, updatedAt: Ke }
            };
          }), P((me) => ({
            ...me,
            [B]: "saved"
          }))) : P((me) => ({
            ...me,
            [B]: "dirty"
          }));
        } catch (Ne) {
          if (U !== h.current)
            return;
          const pe = (a.current[B] || 0) + 1;
          throw a.current[B] = pe, P((me) => ({ ...me, [B]: "error" })), pe === 1 && o(Ne), G(
            B,
            Math.min(th, od * 2 ** pe)
          ), Ne;
        } finally {
          U === h.current && (i.current[B] || 0) > (c.current[B] || 0) && (a.current[B] || 0) === 0 && G(B);
        }
      })();
      d.current.set(B, _e);
      try {
        await _e;
      } finally {
        d.current.get(B) === _e && d.current.delete(B);
      }
    },
    [t, o, e, G, r]
  );
  I.current = ee;
  const se = M(
    async (B) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const U = String(B.id), re = h.current, le = (i.current[U] || 0) + 1;
      if (i.current[U] = le, a.current[U] = 0, V(U), P((fe) => ({ ...fe, [U]: "dirty" })), await ee(U, re, { canvas: B, revision: le }), re !== h.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [V, t, e, ee]
  ), ie = M((B) => {
    const U = String(B);
    i.current[U] = (i.current[U] || 0) + 1, a.current[U] = 0, P((re) => ({ ...re, [U]: "dirty" })), b((re) => re + 1);
  }, []), L = M(
    (B) => {
      h.current += 1;
      for (const re of Object.keys(f.current))
        V(re);
      i.current = {}, c.current = {}, a.current = {}, d.current.clear();
      const U = {};
      for (const re of Object.keys(B))
        U[re] = "saved";
      P(U);
    },
    [V]
  ), X = M(
    (B) => {
      const U = String(B.id);
      V(U);
      const re = (i.current[U] || 0) + 1;
      i.current[U] = re, c.current[U] = re, a.current[U] = 0, P((le) => ({ ...le, [U]: "saved" }));
    },
    [V]
  ), T = M(
    (B) => {
      const U = String(B);
      V(U), delete i.current[U], delete c.current[U], delete a.current[U], P((re) => {
        if (!Object.prototype.hasOwnProperty.call(re, U))
          return re;
        const le = { ...re };
        return delete le[U], le;
      });
    },
    [V]
  );
  return ue(() => {
    for (const [B, U] of Object.entries(i.current))
      U > (c.current[B] || 0) && G(B);
  }, [G, N]), ue(
    () => () => {
      h.current += 1;
      for (const B of Object.values(f.current))
        window.clearTimeout(B);
      f.current = {};
    },
    []
  ), {
    markCanvasDirty: ie,
    flushCanvasSave: se,
    adoptCanvasSnapshot: X,
    forgetCanvasSnapshot: T,
    resetCanvasAutosave: L,
    canvasSaveStatus: R
  };
}
const rh = 6e4, oh = 60;
class sh {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = ih(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, o = !1) {
    this.setScope(t, n);
    const s = this.scopeKey, i = this.catalogs.get(s) || { loadedAt: 0 };
    if (!o && i.value && Date.now() - i.loadedAt < rh)
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
    const r = this.scopeKey, o = ah(t), s = this.powerForms.get(o);
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
    for (; this.powerForms.size > oh; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function ih(e, t) {
  return `${e || 0}:${t || 0}`;
}
function ah(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function ch(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function dh(e, t) {
  return String(t || "").trim() ? "" : String(e || "").trim();
}
function uh(e, t) {
  const n = new Set(t);
  return e.map(
    (r) => n.has(r.id) && r.runError ? { ...r, runError: "" } : r
  );
}
function lh(e, t, n) {
  const r = new Map(t.map((a) => [a.id, a])), o = fh(n), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const a of t)
    a.groupId && i.set(a.groupId, [
      ...i.get(a.groupId) || [],
      a.id
    ]);
  const c = (a) => {
    for (const d of o.get(a) || []) {
      if (s.has(d))
        continue;
      s.add(d);
      const f = r.get(d);
      if (f?.type === "group")
        for (const h of i.get(f.id) || [])
          s.has(h) || (s.add(h), c(h));
      (!f || !ul(f)) && c(d);
    }
  };
  return c(e), [...s];
}
function ul(e) {
  return !!(e.type === "function" && tr(e.functionOption?.key)?.stopsExecution);
}
function dc(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : !!(e.type === "function" && tr(e.functionOption?.key)?.runsInBackend);
}
function fh(e) {
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
function ph({
  members: e,
  hasResult: t
}) {
  const n = e.filter(dc), r = n.filter(
    (o) => !t(o)
  );
  return (r.length > 0 ? r : n).map(
    (o) => o.id
  );
}
function ll({
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
      const d = a.title || "未命名素材";
      if (!n(a))
        return `请先生成前置素材“${d}”`;
    }
  }
  return "";
}
function uc({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const o = e.filter(dc), s = o.map((d) => t[d.id]).filter((d) => !!d), c = n?.status === "running" || n?.status === "waiting" ? o.filter((d) => {
    const f = t[d.id];
    return f?.status === "success" || !f && r(d);
  }).length : o.filter((d) => {
    const f = t[d.id];
    return f?.status === "success" ? !0 : f ? !1 : r(d);
  }).length, a = s.filter(
    (d) => d.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: o.length,
    completedCount: c,
    failedCount: a,
    status: mh(n, s, a)
  };
}
function mh(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function gh({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: r = !0,
  canEditStructure: o = !1,
  canResetStoryboardPrompt: s = !1,
  onClose: i,
  onCopy: c,
  onDelete: a,
  onDetail: d,
  onEditStructure: f,
  onResetStoryboardPrompt: h
}) {
  return /* @__PURE__ */ O(Nn, { children: [
    /* @__PURE__ */ l("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ O(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (I) => I.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ O("button", { type: "button", onClick: d, children: [
            /* @__PURE__ */ l(Ua, { size: 15 }),
            /* @__PURE__ */ l("span", { children: "详情" })
          ] }) : null,
          o && f ? /* @__PURE__ */ O("button", { type: "button", onClick: f, children: [
            /* @__PURE__ */ l(Xd, { size: 15 }),
            /* @__PURE__ */ l("span", { children: "编辑分镜" })
          ] }) : null,
          s && h ? /* @__PURE__ */ O("button", { type: "button", onClick: h, children: [
            /* @__PURE__ */ l(Op, { size: 15 }),
            /* @__PURE__ */ l("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ O("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ l(Bp, { size: 15 }),
            /* @__PURE__ */ l("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ O("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ l(zp, { size: 15 }),
            /* @__PURE__ */ l("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function yh({
  canvasCount: e,
  activeCanvasName: t,
  canvasManagerOpen: n,
  showViewTools: r,
  showMiniMap: o,
  snapToGrid: s,
  zoom: i,
  onToggleMiniMap: c,
  onToggleSnap: a,
  onReset: d,
  onZoomIn: f,
  onZoomOut: h,
  onZoomChange: I,
  onOpenCanvasManager: N
}) {
  const b = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ O("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ l(ot, { label: b, children: /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: N,
        children: /* @__PURE__ */ l($p, { size: 16 })
      }
    ) }),
    r ? /* @__PURE__ */ O(Nn, { children: [
      /* @__PURE__ */ l("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ l(ot, { label: o ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: o ? "is-active" : "",
          onClick: c,
          "aria-label": o ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ l(jp, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ l(ot, { label: s ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: a,
          "aria-label": s ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ l(Zd, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ l(ot, { label: "重置视图", children: /* @__PURE__ */ l("button", { type: "button", onClick: d, "aria-label": "重置视图", children: /* @__PURE__ */ l(Vp, { size: 15 }) }) }),
      /* @__PURE__ */ O("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ l(ot, { label: "缩小", children: /* @__PURE__ */ l("button", { type: "button", onClick: h, "aria-label": "缩小", children: /* @__PURE__ */ l(Jd, { size: 15 }) }) }),
        /* @__PURE__ */ l(
          "input",
          {
            type: "range",
            min: "0.35",
            max: "1.45",
            step: "0.01",
            value: Math.max(0.35, Math.min(1.45, i)),
            onChange: (R) => I(Number(R.target.value)),
            "aria-label": "画布缩放"
          }
        ),
        /* @__PURE__ */ l(ot, { label: "放大", children: /* @__PURE__ */ l("button", { type: "button", onClick: f, "aria-label": "放大", children: /* @__PURE__ */ l(Qd, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
function hh(e, t, n) {
  return t && n?.interactionId === t ? n.nodes : e;
}
function wh(e, t, n, r) {
  if (!n)
    return e;
  const o = e?.interactionId === n ? e.nodes : t;
  return {
    interactionId: n,
    nodes: typeof r == "function" ? r(o) : r
  };
}
function _h(e, t) {
  const [n, r] = $(null), o = hh(
    e,
    t,
    n
  ), s = M(
    (i) => {
      r(
        (c) => wh(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: o, setFlowNodes: s };
}
function bh(e, t) {
  const n = te([]);
  return ae(() => {
    const r = Ih(
      e,
      n.current,
      t
    );
    return n.current = r, r;
  }, [t, e]);
}
function Ih(e, t, n) {
  const r = new Map(t.map((s) => [s.id, s])), o = e.map((s) => {
    const i = r.get(s.id);
    return i && n(i, s) ? i : s;
  });
  return t.length === o.length && o.every((s, i) => s === t[i]) ? t : o;
}
function Nh(e) {
  return (...t) => e.current(...t);
}
function vh(e, t) {
  return t && lc(t.source, e) ? t.value : e;
}
function sd(e, t, n) {
  return {
    source: t && lc(t.source, e) ? t.source : e,
    value: n
  };
}
function lc(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const fl = [
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
], Ks = 140, fc = 100, Uo = 720, id = { width: 280, height: 64 };
function Sh(e, t, n) {
  const r = ml(n), o = e.find((s) => s.id === t);
  return !o || Ah(o, r) ? e : e.map(
    (s) => s.id === t ? { ...s, ...r } : s
  );
}
function Ch(e, t, n) {
  const r = Yo(n), o = e.find((s) => s.id === t);
  return !o || lc(o.resultView, r) ? e : e.map(
    (s) => s.id === t ? { ...s, resultView: r } : s
  );
}
function Rh({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: o
}) {
  if (!t || !n || !o)
    return null;
  const s = e.type === "group", i = e.type === "power" && Za(e.power, e.kind);
  return /* @__PURE__ */ l(Nn, { children: fl.map((c) => /* @__PURE__ */ l(
    Rp,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: s ? Hc.width : i ? id.width : Ks,
      minHeight: s ? Hc.height : i ? id.height : fc,
      maxWidth: s ? Wc.width : Uo,
      maxHeight: s ? Wc.height : Uo,
      keepAspectRatio: !s && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (a, d) => o(e.id, ml(d))
    },
    c.position
  )) });
}
function kh({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: o
}) {
  const s = te(null);
  if (!t)
    return null;
  const i = (d, f) => {
    if (d.button !== 0)
      return;
    d.preventDefault(), d.stopPropagation();
    const h = Yo(e), I = d.currentTarget.parentElement?.getBoundingClientRect().width || h.width;
    s.current = {
      pointerId: d.pointerId,
      startX: d.clientX,
      startY: d.clientY,
      startView: h,
      currentView: h,
      corner: f,
      scale: Math.max(0.01, I / h.width)
    }, d.currentTarget.setPointerCapture(d.pointerId), n?.();
  }, c = (d) => {
    const f = s.current;
    if (!f || f.pointerId !== d.pointerId)
      return;
    d.preventDefault(), d.stopPropagation();
    const h = xh(
      f.startView,
      f.corner,
      (d.clientX - f.startX) / f.scale,
      (d.clientY - f.startY) / f.scale
    );
    f.currentView = h, r(h);
  }, a = (d) => {
    const f = s.current;
    !f || f.pointerId !== d.pointerId || (d.preventDefault(), d.stopPropagation(), s.current = null, d.currentTarget.hasPointerCapture(d.pointerId) && d.currentTarget.releasePointerCapture(d.pointerId), o(Yo(f.currentView)));
  };
  return /* @__PURE__ */ l(Nn, { children: fl.map((d) => /* @__PURE__ */ l(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${d.className} nodrag nopan nowheel`,
      onPointerDown: (f) => i(f, d),
      onPointerMove: c,
      onPointerUp: a,
      onPointerCancel: a,
      onClick: (f) => {
        f.preventDefault(), f.stopPropagation();
      }
    },
    d.position
  )) });
}
function xh(e, t, n, r) {
  const o = e.width / e.height, s = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * o, c = pl(
    Math.abs(s - e.width) >= Math.abs(i - e.width) ? s : i,
    o
  ), a = c / o, d = Number(e.offsetX || 0), f = Number(e.offsetY || 0);
  return Yo({
    width: c,
    height: a,
    offsetX: t.left ? d + e.width - c : d,
    offsetY: t.top ? f + (e.height - a) / 2 : f + (a - e.height) / 2
  });
}
function pl(e, t) {
  const n = Math.max(Ks, fc * t), r = Math.min(Uo, Uo * t);
  return n > r ? Math.min(Uo, Math.max(Ks, e)) : Math.min(r, Math.max(n, e));
}
function Yo(e) {
  const t = ad(e.width, Ks), n = ad(e.height, fc), r = t / n, o = pl(t, r);
  return {
    width: Math.round(o),
    height: Math.round(o / r),
    offsetX: Math.round(cd(e.offsetX, 0)),
    offsetY: Math.round(cd(e.offsetY, 0))
  };
}
function ad(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function cd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function ml(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function Ah(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Th(e, t) {
  const n = e || gl(), r = Dm({
    type: "stream",
    output: t
  }), o = r.event, s = r.activity, i = Eh(n.text, r.delta, t, o), c = Fh(o, s) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, a = s && !s.anchorText ? { ...s, anchorText: i } : s, d = a ? Pm(n.activities, a) : n.activities, f = Em(
    Fm(n.document, r.output),
    Nu(r.output.document)
  ), h = vu(c) || n.interaction, I = Su(c);
  return {
    started: !0,
    text: i,
    output: c,
    activities: d,
    document: f,
    interaction: h,
    suggestions: I.length > 0 ? I : n.suggestions,
    error: r.error || n.error
  };
}
function Mh(e) {
  const t = Dh(e);
  return {
    started: Object.keys(t).length > 0,
    text: qs(t.text),
    output: t,
    activities: Om(t),
    document: Nu(t.document),
    interaction: vu(t),
    suggestions: Su(t),
    error: qs(t.error)
  };
}
function Dh(e) {
  const t = Bm(e);
  if (qs(t.text))
    return t;
  const n = uu(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function Ph(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function gl() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function Eh(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && qs(n.text) || e;
}
function Fh(e, t) {
  return !(t || e === "start" || e === "delta");
}
function qs(e) {
  return e == null ? "" : String(e);
}
function Oh(e) {
  const t = he(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (i) => i.id === Number(t.id || 0)
  ), o = r ? Hn(r, e.previousAsset) : e.previousAsset || null, s = Hn(
    t,
    o
  );
  return o?.version?.content != null && Number(o.version.id || 0) === Number(s.version?.id || 0) ? Hn(o, s) : s.version?.id ? s : null;
}
function Bh(e, t) {
  const n = $h(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function zh(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function Hn(e, t) {
  const n = dd(e), r = t ? dd(t) : null, o = [
    ...n.versions || [],
    ...r?.versions || []
  ], s = jh(
    [Lh(n.version)].filter(
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
function eo(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((o) => [o.id, o])), r = e.map((o) => {
    const s = n.get(o.id);
    return s ? (n.delete(o.id), Hn(s, o)) : o;
  });
  return [
    ...[...n.values()].map(
      (o) => Hn(o)
    ),
    ...r
  ];
}
function $h(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function dd(e) {
  const t = ud(e.version), n = (e.versions || []).map(ud).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function ud(e) {
  if (!e)
    return;
  const t = dm(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function jh(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (!s || Number(s.id || 0) <= 0)
      continue;
    const i = String(s.id), c = r.get(i);
    if (c !== void 0) {
      n[c] = Vh(
        n[c],
        s
      );
      continue;
    }
    r.set(i, n.length), n.push(s);
  }
  let o = !1;
  return n.sort(
    (s, i) => Number(Gi(i)) - Number(Gi(s)) || Number(i.version || i.id || 0) - Number(s.version || s.id || 0)
  ).map((s) => Gi(s) ? o ? Uh(s) : (o = !0, s) : s);
}
function Vh(e, t) {
  const n = { ...e };
  for (const [r, o] of Object.entries(t))
    o !== void 0 && o !== "" && (n[r] = o);
  return n;
}
function Gi(e) {
  return !!(e.is_current || e.current);
}
function Lh(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Uh(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function pc(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return wr(r, "execution_id", e?.execution_id), wr(r, "run_id", e?.run_id || n?.run_id), Hi(r, "request_id", e?.request_id), wr(r, "flow_run_id", e?.flow_run_id), wr(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), wr(r, "asset_id", e?.asset_id || t?.id), wr(
    r,
    "version_id",
    e?.version_id || n?.id || t?.version_id
  ), wr(
    r,
    "release_id",
    e?.release_id || n?.release_id
  ), Hi(r, "role", e?.role || t?.role), Hi(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function Ia(e, t, n) {
  const r = e?.resultRef;
  if (r) {
    const o = Number(t.execution_id || 0), s = Number(r.execution_id || 0);
    if (o > 0 && s > 0 && s >= o)
      return !0;
    const i = Number(t.run_id || 0), c = Number(r.run_id || 0);
    if (i > 0 && c > 0 && c >= i)
      return !0;
    const a = Number(n?.node_run_id || 0), d = Number(r.node_run_id || 0);
    if (a > 0 && d > 0 && d >= a)
      return !0;
    const f = String(n?.request_id || t.request_id || "");
    if (f && r.request_id === f)
      return !0;
  }
  return Kh(e, n);
}
function Kh(e, t) {
  if (String(t?.status || "").trim().toLowerCase() !== "success")
    return !1;
  const n = Number(
    e?.asset?.id || e?.resultRef?.asset_id || 0
  ), r = Number(
    e?.asset?.version_id || e?.asset?.version?.id || e?.resultRef?.version_id || 0
  ), o = Number(t?.asset_id || 0), s = Number(t?.version_id || 0);
  return n > 0 && n === o && r > 0 && s > 0 && r !== s;
}
function qh(e) {
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
function wr(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Hi(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const Gh = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], Hh = Object.fromEntries(
  Gh.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Wh(e) {
  return Hh[e] || "文本";
}
function Yh(e) {
  const t = new Map(e.nodes.map((i) => [i.id, i])), n = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), r = Xh(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), o = e.nodes.filter(Wu).map((i) => {
    const c = r.get(i.id) || i.asset, a = i.groupId ? n.get(i.groupId) : void 0, d = a?.group?.sourceNodeId ? t.get(a.group.sourceNodeId) : void 0, f = e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || Wh(ld(i)),
      sourcePath: d?.title && a?.title ? `${d.title} / ${a.title}` : a?.title,
      nodeType: ld(i),
      status: Zh(i, c, e.nodeHasResult(i)),
      preview: e.nodePreview(i),
      output: f,
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
      nodeType: yl(i.kind),
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
function ld(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : yl(e.power?.kind || e.kind);
}
function yl(e) {
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
function Xh(e, t, n) {
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
function Zh(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function nS(e, t = []) {
  return {
    current: Qh([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: hl(
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
function Jh(e) {
  return e.map(
    (t) => ({
      id: t.role === "material" ? t.nodeId || t.key : String(t.assetId || t.key),
      title: t.title,
      kind: hl(t.preview, t.nodeType),
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
function Qh(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = `${r.source}:${r.id}`;
    n.has(o) || (n.add(o), t.push(r));
  }
  return t;
}
function hl(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Na = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Na || Object.keys(Na).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ew = Na.joinSiteApi;
async function wl(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return kp({
    streamApi: tw(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function tw(e) {
  const t = new URL(ew("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const _l = "反馈已被新的运行替换";
function nw(e) {
  return e instanceof Error && e.message === _l;
}
function Sr(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function rw(e, t) {
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
function ow(e, t, n) {
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
function sw(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((s) => s.id === e.node.id) || e.node, o = Sr(r).find(
    (s) => s.id === e.recordId
  );
  return o ? !(o.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function iw(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: yo(t?.status || e?.status || "running"),
    output: he(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(uw).filter(Boolean),
    interactions: r.map(cw).filter(Boolean),
    raw: e
  };
}
function aw(e) {
  const t = e.interactions.find(
    (s) => !!(s.interaction?.id && s.interaction?.type)
  );
  if (t)
    return bl(t);
  const n = e.approvals.find(lw);
  if (!n?.id)
    return null;
  const r = fw(n), o = mc(r);
  return {
    approval: n,
    title: De(r.title, n.title, "补充信息"),
    description: De(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: o,
    values: gc(r, o)
  };
}
function bl(e) {
  const t = e.interaction, n = mc(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: De(t.title, "补充信息"),
    description: De(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: gc(t, n)
  };
}
function cw(e) {
  const t = xp(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function mc(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => pw(n, r)).filter((n) => !!n.key);
}
function gc(e, t) {
  const n = jm(t), r = e.values && typeof e.values == "object" ? e.values : {}, o = {
    ...n,
    ...r
  }, s = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return s > 0 && (o.source_target_id = s), o;
}
function dw(e, t) {
  const n = mw(e);
  if (!n)
    return null;
  const r = mc(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: De(n.title, t, "补充信息"),
    description: De(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: r,
    values: gc(n, r)
  };
}
function uw(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function lw(e) {
  return e.status === "pending" || e.decision === "pending";
}
function fw(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function pw(e, t) {
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
    accepted_kinds: fd(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: fd(
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
function fd(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function mw(e) {
  const t = Wi(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = Wi(e?.interaction);
    return r && De(r.type) ? r : null;
  }
  const n = Wi(t.interaction, t.content?.interaction);
  return n && De(n.type) ? n : null;
}
function Wi(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
function gw({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: r,
  targetY: o,
  sourcePosition: s,
  targetPosition: i,
  markerEnd: c,
  style: a,
  data: d
}) {
  const [f, h, I] = Ap({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: r,
    targetY: o,
    targetPosition: i
  }), N = d || {}, b = !!N.isSelected, R = !!(N.isHighlighted || b), P = N.highlightColor || "#0ea5e9", V = b ? "var(--ws-edge-selected)" : R ? P : "var(--ws-edge)", G = b ? 2.8 : R ? 2.4 : 1.45, ee = R ? 0.96 : 0.62, se = String(N.bindingLabel || "").trim(), ie = !!N.bindingInteractive, L = !!se, X = L || b;
  return /* @__PURE__ */ O(Nn, { children: [
    R ? /* @__PURE__ */ l(
      Vc,
      {
        path: f,
        style: {
          stroke: P,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ l(
      Vc,
      {
        path: f,
        markerEnd: c,
        style: {
          ...a,
          stroke: V,
          strokeWidth: G,
          opacity: ee,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    X ? /* @__PURE__ */ l(Tp, { children: /* @__PURE__ */ O(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          se ? "is-bound" : "",
          N.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${h}px, ${I}px)`
        },
        onMouseDown: (T) => {
          T.preventDefault(), T.stopPropagation();
        },
        children: [
          L ? ie ? /* @__PURE__ */ O(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${se}`,
              onClick: (T) => {
                T.preventDefault(), T.stopPropagation(), N.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ l(pa, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { children: se }),
                N.bindingShowChevron ? /* @__PURE__ */ l(Lp, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ O("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ l(pa, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ l("span", { children: se })
          ] }) : null,
          b ? /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (T) => {
                T.preventDefault(), T.stopPropagation(), N.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ l(Up, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    R ? /* @__PURE__ */ O(Nn, { children: [
      /* @__PURE__ */ l("circle", { r: "3", fill: P, children: /* @__PURE__ */ l(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: f
        }
      ) }),
      /* @__PURE__ */ l("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ l(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: f
        }
      ) })
    ] }) : null
  ] });
}
const yw = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function hw({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ l(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: yw,
      children: /* @__PURE__ */ O(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ l(Yn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ l(Ka, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ l("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Yi({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [o, s] = $(!1), [i, c] = $(e), a = te(null);
  ue(() => {
    o || c(e);
  }, [o, e]), ue(() => {
    o && (a.current?.focus(), a.current?.select());
  }, [o]);
  const d = () => {
    const f = i.trim() || n;
    s(!1), c(f), f !== e && r?.(f);
  };
  return o && r ? /* @__PURE__ */ l(
    "input",
    {
      ref: a,
      className: `ws-canvas-node-title-input nodrag nowheel ${t || ""}`.trim(),
      value: i,
      maxLength: 64,
      "aria-label": "节点名称",
      onChange: (f) => c(f.target.value),
      onBlur: d,
      onPointerDown: (f) => f.stopPropagation(),
      onKeyDown: (f) => {
        f.stopPropagation(), f.key === "Enter" ? (f.preventDefault(), d()) : f.key === "Escape" && (f.preventDefault(), c(e), s(!1));
      }
    }
  ) : /* @__PURE__ */ l(ot, { label: r ? "双击重命名" : e, children: /* @__PURE__ */ l(
    "span",
    {
      className: t,
      onDoubleClick: r ? (f) => {
        f.preventDefault(), f.stopPropagation(), s(!0);
      } : void 0,
      children: e || n
    }
  ) });
}
const pd = 160, md = 72, gd = 72, Gs = 72, Xo = 24, Zo = 24, Jo = 40, Cr = 2, Hs = { width: 180, height: 180 }, ww = "storyboard-derived-layout-v7";
function _w(e) {
  const t = e.groups.map((b) => ({
    ...b,
    size: vw(b)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(xs), o = Sw(
    "workspace",
    r
  ), s = t.filter((b) => b.direction === "upstream").sort(xs), i = t.filter(
    (b) => b.direction === "downstream" && b.powerKind !== "audio"
  ).sort(xs), c = t.filter(
    (b) => b.direction === "downstream" && b.powerKind === "audio"
  ).sort(xs), a = i.reduce(
    (b, R) => Math.max(b, R.size.height),
    0
  ), d = i.length ? e.sourceNode.y - a - gd : e.sourceNode.y, f = e.sourceNode.x - pd;
  let h = d;
  for (const b of s)
    n.set(b.key, {
      bounds: {
        x: f - b.size.width,
        y: h,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), h += b.size.height + gd;
  let I = e.sourceNode.x;
  for (const b of i)
    n.set(b.key, {
      bounds: {
        x: I,
        y: d,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), I += b.size.width + md;
  let N = e.sourceNode.x + e.sourceNode.width + pd;
  for (const b of c)
    n.set(b.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: b.size.width,
        height: b.size.height
      },
      layoutKey: `${o}:${b.key}`
    }), N += b.size.width + md;
  return n;
}
function bw(e, t, n) {
  const r = t.filter((c) => c.groupId === e.id), o = n.kind === "audio", s = o ? n.width : Math.max(Hs.width, n.width), i = o ? n.height : Math.max(Hs.height, n.height);
  for (let c = 0; c < r.length + 100; c += 1) {
    const a = c % Cr, d = Math.floor(c / Cr), f = {
      x: e.x + Xo + a * (s + Zo),
      y: e.y + Gs + d * (i + Jo)
    };
    if (r.every(
      (h) => !Cw(
        { ...f, width: n.width, height: n.height },
        h
      )
    ))
      return f;
  }
  return {
    x: e.x + Xo,
    y: e.y + Gs
  };
}
function Iw(e, t) {
  const n = t.some((s) => s.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : Hs.width,
      ...t.map((s) => s.width)
    ),
    height: Math.max(
      n ? 0 : Hs.height,
      ...t.map((s) => s.height)
    )
  }, o = /* @__PURE__ */ new Map();
  return t.forEach((s, i) => {
    const c = i % Cr, a = Math.floor(i / Cr);
    o.set(s.id, {
      x: e.x + Xo + c * (r.width + Zo),
      y: e.y + Gs + a * (r.height + Jo)
    });
  }), {
    ...Il(t.length, r),
    positions: o
  };
}
function Nw(e) {
  return ui(e || void 0);
}
function vw(e) {
  const t = Nw(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return Il(e.itemCount, t);
}
function Il(e, t) {
  const n = Math.max(1, Math.ceil(e / Cr));
  return {
    width: Xo * 2 + t.width * Cr + Zo * (Cr - 1),
    height: Gs + Xo + n * t.height + (n - 1) * Jo
  };
}
function Sw(e, t) {
  return [
    ww,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function xs(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function Cw(e, t) {
  return !(e.x + e.width + Zo <= t.x || t.x + t.width + Zo <= e.x || e.y + e.height + Jo <= t.y || t.y + t.height + Jo <= e.y);
}
const Rw = [
  "characters",
  "scenes",
  "props"
], va = [
  Xi("characters", "角色组", "character", 0),
  Xi("scenes", "场景组", "scene", 1),
  Xi("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: Rw,
    layoutIndex: 0,
    enabled: lu,
    items: xw
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
    enabled: um,
    items: kw
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: lm,
    items: Pw
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
    enabled: fm,
    items: Fw
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
    enabled: pm,
    items: Ow
  }
];
function kw(e, t) {
  const n = mm(e), r = Ho(t?.framePlanVersion) ? fu(e.shots) : [];
  return e.shots.map((o, s) => {
    const i = Ho(t?.framePlanVersion) ? r[s] : void 0, c = qw(
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
      prompt: Zw(
        e,
        o,
        c.externalReferences,
        t?.framePlanVersion
      ),
      ...c,
      paramValues: e_(
        e,
        o,
        t?.framePlanVersion,
        i
      ),
      shotId: o.id,
      shotImageMode: i?.mode,
      shotDuration: o.duration,
      requiredDurationValues: n,
      continuityAnchor: o.continuity_anchor
    };
  });
}
function xw(e, t) {
  return Ho(t?.framePlanVersion) ? Tw(e) : Aw(e);
}
function Aw(e) {
  return e.shots.flatMap((t, n) => {
    if (t.continue_previous)
      return [];
    const r = jw(e, t, n);
    return [
      {
        type: "shot_image",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 参考图`,
        prompt: Hw(
          e,
          t,
          r.previousShot,
          r.externalReferences
        ),
        dependencyItems: r.dependencyItems,
        referenceItems: r.referenceItems,
        externalReferences: r.externalReferences,
        paramValues: Cl(e),
        shotId: t.id
      }
    ];
  });
}
function Tw(e) {
  const t = fu(e.shots);
  return e.shots.flatMap((n, r) => {
    const o = t[r];
    if (o.nodeMode === "none")
      return [];
    const s = o.nodeMode === "last_frame" ? "end" : "start", i = Vw(
      e,
      n,
      r,
      s
    ), c = Dw(
      e,
      n,
      o.nodeMode,
      i
    );
    return [
      {
        type: "shot_image",
        id: n.id,
        title: Mw(
          n.order || r + 1,
          o.nodeMode
        ),
        prompt: c.prompt,
        dependencyItems: i.dependencyItems,
        referenceItems: i.referenceItems,
        externalReferences: i.externalReferences,
        paramValues: Cl(e),
        shotId: n.id,
        shotImageMode: o.nodeMode,
        frameMediaItems: o.frameMediaItems,
        imageSequenceFrames: c.frames
      }
    ];
  });
}
function Mw(e, t) {
  return `镜头 ${e} ${wm[t]}`;
}
function Dw(e, t, n, r) {
  switch (n) {
    case "first_last": {
      const o = Yw(e, t);
      return {
        prompt: Xw(o),
        frames: o
      };
    }
    case "references":
      return {
        prompt: Ww(e, t)
      };
    case "last_frame":
      return {
        prompt: yd(
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
        prompt: yd(
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
function Xi(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o) => lu(o) && o.materials.some((s) => s.type === n),
    items: (o) => o.materials.filter((s) => s.type === n).map((s) => {
      const i = Jw(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: zw(s),
        externalReferences: i
      };
    })
  };
}
function Pw(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, o) => {
      const s = Ew(e, r);
      return {
        type: "speech",
        id: r.id,
        title: Bw(
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
function Ew(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function Fw(e) {
  return e.shots.flatMap((t, n) => {
    const r = gm(t);
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
function Ow(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(ym);
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
function Bw(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = e.materials.find(
    (s) => s.type === "character" && s.id === t.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function zw(e) {
  return e.prompt.trim() || `${e.name}素材`;
}
function $w(e, t) {
  return Nl(
    mu(e, t)
  );
}
function Nl(e) {
  return e.map((t) => ({
    type: t.type,
    id: t.id
  }));
}
function jw(e, t, n) {
  const r = $w(e, t), o = Qw(e, t), s = t.match_previous ? Kw(e, n) : void 0;
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
function Vw(e, t, n, r) {
  const o = hm(
    e.shots,
    n,
    r
  ), s = new Set(o.materialIDs), i = mu(e, t).filter(
    (h) => s.has(h.id)
  ), c = Nl(i), a = Lw(
    e,
    o.referenceKeys,
    o.includeGlobalReferences,
    i
  ), d = o.anchorID, f = d ? { type: "shot_image", id: d } : void 0;
  return {
    anchorLabel: Uw(
      e,
      t,
      n,
      r,
      o
    ),
    dependencyItems: f ? [f] : [],
    referenceItems: [...f ? [f] : [], ...c],
    referenceMaterials: i,
    externalReferences: a
  };
}
function Lw(e, t, n, r) {
  const o = new Set(
    r.flatMap((i) => i.reference_keys)
  );
  if (r.length)
    for (const i of li(e, "image"))
      o.add(i.key);
  const s = new Set(t);
  return fi(
    e.references.filter(
      (i) => i.kind === "image" && !o.has(i.key) && (Sl.image.has(i.purpose) ? n : s.has(i.key))
    )
  );
}
function Uw(e, t, n, r, o) {
  const { anchorID: s, anchorFrameRole: i, anchorShotIndex: c } = o;
  if (!s)
    return "";
  if (s === t.id)
    return "本镜头首帧";
  const a = e.shots[c];
  if (!a)
    return "";
  const d = c === n - 1 ? "上一镜头" : "镜头", f = i === "end" ? "尾帧" : "连续性参考帧";
  return r === "start" ? `${d} ${a.order || c + 1} 的${f}` : `${d} ${a.order || c + 1} 的${f}规划图`;
}
function Kw(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function qw(e, t, n, r, o) {
  if (Ho(r))
    return Gw(
      e,
      t,
      n,
      o || pu(t)
    );
  const s = vl(e, t), i = n > 0 ? e.shots[n - 1] : void 0;
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
function Gw(e, t, n, r) {
  const o = vl(e, t), s = {
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
function Hw(e, t, n, r = []) {
  return Ws(t, "start");
}
function yd(e, t, n, r, o, s = []) {
  return Ws(t, n);
}
function Ww(e, t, n) {
  return yc([
    `镜头画面：${t.description.trim()}`,
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `起始状态：${t.continuity_state.entry.trim()}`,
    t.start_framing?.trim() ? `静态构图：${t.start_framing.trim()}` : ""
  ]);
}
function Yw(e, t, n) {
  const r = Ws(t, "start"), o = Ws(t, "end");
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
function Xw(e) {
  return [
    `首帧：${e[0]?.prompt || ""}`,
    `尾帧：${e[1]?.prompt || ""}`
  ].join(`

`);
}
function Ws(e, t) {
  const n = t === "end" ? e.continuity_state.exit.trim() : e.continuity_state.entry.trim();
  return yc([
    `镜头画面：${e.description.trim()}`,
    e.spatial_layout.trim() ? `空间关系：${e.spatial_layout.trim()}` : "",
    `${t === "end" ? "尾帧" : "首帧"}状态：${n}`,
    (t === "end" ? e.end_framing : e.start_framing)?.trim() ? `静态构图：${(t === "end" ? e.end_framing : e.start_framing)?.trim()}` : ""
  ]);
}
function Zw(e, t, n = [], r, o) {
  return yc([
    `画面内容：${t.description.trim()}`,
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `起始状态：${t.continuity_state.entry.trim()}`,
    t.start_framing?.trim() ? `起始构图：${t.start_framing.trim()}` : "",
    `动作推进：${t.beat.trim()}`,
    `结束状态：${t.continuity_state.exit.trim()}`,
    t.end_framing?.trim() ? `结束构图：${t.end_framing.trim()}` : "",
    t.camera_instruction.trim() ? `运镜：${t.camera_instruction.trim()}` : "",
    t.video_prompt.trim() ? `补充视觉要求：${t.video_prompt.trim()}` : ""
  ]);
}
function yc(e) {
  return e.filter(Boolean).join(`
`);
}
function Jw(e, t) {
  return fi([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...li(e, "image")
  ]);
}
function Qw(e, t) {
  return fi([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...li(e, "image")
  ]);
}
function vl(e, t) {
  return fi([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...li(e, "video")
  ]);
}
const Sl = {
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
function li(e, t) {
  const n = Sl[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function fi(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function Cl(e) {
  return { aspectRatio: e.aspect_ratio };
}
function e_(e, t, n, r) {
  const o = r || pu(t);
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration,
    ...Ho(n) && o.referenceMode ? { referenceMode: o.referenceMode } : {}
  };
}
function Ko(e, t) {
  const n = String(e || "");
  return n.trim() && n.trim() === String(t || "").trim() ? "" : n;
}
function t_(e, t) {
  return !!Ko(e, t).trim();
}
function n_(e, t, n) {
  if (!t?.trim())
    return e;
  const r = Ko(e.prompt, t), o = e.promptContent, s = Ja(o), i = o?.parts.filter((I) => I.type === "text").map((I) => I.text).join(""), c = [s, i].some(
    (I) => !!I?.trim() && !Ko(I, t)
  ), a = c ? ns(
    r,
    ii(o)
  ) : o, d = c && !a?.parts.length ? void 0 : a;
  let f = e.paramValues;
  const h = n ? f?.[n] : void 0;
  if (n && typeof h == "string") {
    const I = Ko(h, t);
    I !== h && (f = { ...f, [n]: I });
  }
  return r === e.prompt && d === o && f === e.paramValues ? e : { ...e, prompt: r, promptContent: d, paramValues: f };
}
function rS(e, t, n) {
  const r = n_(
    e,
    t,
    n
  ), o = String(t || "");
  if (!o.trim())
    return r;
  const s = Ja(
    r.promptContent
  ), i = r.promptContent?.parts.filter((f) => f.type === "text").map((f) => f.text).join(""), c = r.prompt?.trim() ? r.prompt : i?.trim() ? s : o;
  let a = r.paramValues;
  n && a?.[n] !== c && (a = { ...a || {}, [n]: c });
  const d = r.promptContent ? ns(
    c,
    ii(r.promptContent)
  ) : r.promptContent;
  return c === r.prompt && d === r.promptContent && a === r.paramValues ? r : { ...r, prompt: c, promptContent: d, paramValues: a };
}
const Fo = "storyboard-soundtrack";
function r_(e) {
  const t = new Map(
    (e.current?.clips || []).map((o) => [o.id, o])
  ), n = e.storyboard.shots.map(
    (o, s) => a_({
      ...e,
      shot: o,
      index: s,
      current: t.get(o.id)
    })
  ), r = Vm(
    n,
    (e.current?.clips || []).map((o) => o.id),
    (o) => o.id
  );
  return {
    version: 3,
    clips: i_(
      r,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: o_(
      e.storyboard,
      e.current?.audioTracks || []
    ),
    settings: {
      resolution: e.current?.settings.resolution || "auto",
      fps: e.current?.settings.fps ?? 0
    }
  };
}
function o_(e, t) {
  const n = gu(e), r = s_(e), o = e.references.find(
    (I) => I.purpose === "soundtrack"
  );
  if (!o)
    return n ? [] : t.filter((I) => I.id !== Fo);
  const s = n ? t.filter((I) => I.id === Fo) : t, i = s.find(
    (I) => I.id === Fo
  ), c = Number(o.asset_id || 0), a = Number(o.version_id || 0), d = {
    id: Fo,
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
  let f = !1;
  const h = s.flatMap(
    (I) => I.id !== Fo ? [I] : f ? [] : (f = !0, [d])
  );
  return f ? h : [...h, d];
}
function s_(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, r = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && r != null && (t > 0 || n < r);
}
function i_(e, t) {
  if (!t || t <= 0 || e.length === 0)
    return e;
  const n = Math.round(
    e.reduce((f, h) => f + h.duration, 0) * 1e3
  );
  let r = Math.max(
    0,
    n - t
  ), o = 0;
  const s = e.map((f) => {
    const h = f.transitionToNext.type === "none" ? 0 : Math.max(0, f.transitionToNext.durationMs), I = Math.min(
      h,
      r
    );
    return r -= I, I < 100 ? {
      ...f,
      transitionToNext: { type: "none", durationMs: 0 }
    } : (o += I, {
      ...f,
      transitionToNext: { ...f.transitionToNext, durationMs: I }
    });
  }), i = n - o - t;
  if (i <= 0)
    return s;
  const c = s.length - 1, a = s[c], d = a.duration - i / 1e3;
  return d <= 0 || (s[c] = { ...a, duration: d }), s;
}
function a_(e) {
  const t = gu(e.storyboard), n = Ys(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), r = Ys(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), o = Sa(n), s = t ? void 0 : Sa(r), i = !!e.current?.useOriginalVideo, c = [];
  n?.power ? o || c.push("镜头视频尚未生成") : c.push("未配置镜头视频能力");
  const a = new Map(
    (e.current?.speechTracks || []).map((R) => [R.id, R])
  ), d = t ? [] : e.shot.speech.filter((R) => R.text.trim()).map(
    (R) => l_(
      e.nodes,
      e.sourceNodeId,
      R,
      a.get(R.id),
      c
    )
  ), f = t ? [] : u_(e.nodes, e.sourceNodeId, e.shot.id), h = !i && s ? s : o, I = e.storyboard.shots[e.index + 1], N = I ? {
    type: I.transition_type,
    durationMs: I.transition_type === "none" ? 0 : I.transition_duration_ms
  } : { type: "none", durationMs: 0 }, b = c_(
    e.current,
    N
  );
  return {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...h ? { visualVideo: h } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: e.shot.duration,
    originalVolume: t ? 0 : e.current?.originalVolume ?? (d.length ? 0.45 : 1),
    speechTracks: d,
    subtitleTracks: f,
    useOriginalVideo: i,
    blockingIssues: f_(c),
    transitionToNext: b,
    storyboardTransitionToNext: N
  };
}
function c_(e, t) {
  if (!e)
    return t;
  const n = e.storyboardTransitionToNext;
  return n && d_(
    e.transitionToNext,
    n
  ) ? t : e.transitionToNext;
}
function d_(e, t) {
  return e.type === t.type && e.durationMs === t.durationMs;
}
function u_(e, t, n) {
  const r = Ys(e, t, "subtitle", n), o = zt(r?.resultOutput);
  return (Array.isArray(o.tracks) ? o.tracks : []).flatMap((i) => {
    const c = zt(i), a = vs(c.id), d = vs(c.text);
    if (!a || !d)
      return [];
    const f = hd(c.end_time ?? c.endTime), h = vs(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: d,
        startTime: Math.max(
          0,
          hd(c.start_time ?? c.startTime)
        ),
        ...f > 0 ? { endTime: f } : {},
        ...h ? { speechId: h } : {},
        source: vs(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function l_(e, t, n, r, o) {
  const s = Ys(e, t, "speech", n.id), i = Sa(s);
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
function Ys(e, t, n, r) {
  return e.find(
    (o) => o.storyboardItem?.sourceNodeId === t && o.storyboardItem.itemType === n && o.storyboardItem.itemId === r
  );
}
function Sa(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), o = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !o))
    return {
      assetId: r,
      versionId: o,
      label: e?.title || "素材"
    };
}
function f_(e) {
  return [...new Set(e.filter(Boolean))];
}
function hd(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function p_(e, t) {
  return e ? t ? "materialize" : "defer-materialize" : "refresh";
}
function m_(e, t, n, r) {
  return !t || Ca(e, t) !== Ca(n, r);
}
function Ca(e, t) {
  return JSON.stringify([
    e.id,
    Number(e.resultRef?.asset_id || e.asset?.id || 0),
    Number(
      e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
    ),
    t.workflow.status,
    t.workflow.confirmed_at,
    t.production_plan,
    t.materials.map((n) => [n.type, n.id]),
    t.shots.map((n) => n.id)
  ]);
}
function g_(e) {
  return !!e.storyboardItem && t_(
    e.composerDraft?.prompt,
    e.storyboardItem?.generatedPrompt
  );
}
function y_(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!r.trim() || r.trim() === n)
    return null;
  const o = new Set(e.storyboardItem?.referenceNodeIds || []), s = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor
  } : void 0, i = t.filter((N) => o.has(N.id)).map((N) => xl(N, s)).filter((N) => !!N), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = ii(
    e.composerDraft?.promptContent
  ).filter((N) => c.has(N.refId)), d = t.find(
    (N) => N.id === e.storyboardItem?.sourceNodeId
  ), h = ((d ? vn([
    d.asset?.version?.content,
    d.resultOutput
  ]) : null)?.references || []).filter((N) => c.has(N.asset_id)).map(Al), I = [
    ...i,
    ...a,
    ...h
  ];
  return {
    ...e.composerDraft || {},
    prompt: "",
    promptContent: I.length ? ns("", I) : void 0,
    paramValues: Ml(
      e.composerDraft?.paramValues,
      r,
      ""
    )
  };
}
function Xs(e, t, n) {
  const r = Id(n);
  return e.find(
    (o) => Number(o.id || 0) > 0 && String(o.kind || "").trim().toLowerCase() === t && Id(o.outputType) === r
  ) || null;
}
function wd(e) {
  return Rl(e, "materialize");
}
function Zi(e) {
  return Rl(e, "refresh");
}
function Rl(e, t) {
  let n = e.canvas;
  const r = e.sourceNodeIds ? new Set(e.sourceNodeIds) : null;
  for (const o of e.canvas.nodes) {
    if (t === "materialize" && o.id !== e.sourceNodeId || t === "refresh" && r?.has(o.id) === !1 || o.type !== "power" || !Mr(
      o.power,
      o.kind,
      o.outputType
    ))
      continue;
    const s = vn([
      o.asset?.version?.content,
      o.resultOutput
    ]);
    if (!s || !si(s))
      continue;
    const i = n.nodes.find((h) => h.id === o.id) || o;
    if (t === "refresh") {
      n = _d({
        canvas: n,
        storyboardNode: i,
        storyboard: s,
        assetCate: e.assetCate,
        powers: e.powers,
        framePlanVersion: xr(
          i.storyboardFramePlanVersion
        )
      });
      continue;
    }
    const c = w_(
      i,
      s
    ), a = xr(
      i.storyboardFramePlanVersion
    ) || 0, d = i.storyboardMaterializedSignature !== c || a < yu, f = _m(
      i.storyboardFramePlanVersion,
      d
    );
    n = d ? b_({
      canvas: n,
      storyboardNode: i,
      storyboard: s,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: f
    }) : _d({
      canvas: n,
      storyboardNode: i,
      storyboard: s,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: f
    }), n = __(
      n,
      i.id,
      c,
      f
    );
  }
  return n;
}
function h_(e, t) {
  if (!e || e.type !== "power" || !Mr(e.power, e.kind, e.outputType))
    return !1;
  const n = { ...e, ...t }, r = vn([
    n.asset?.version?.content,
    n.resultOutput
  ]);
  if (!r || !si(r))
    return !1;
  const o = vn([
    e.asset?.version?.content,
    e.resultOutput
  ]);
  return m_(
    e,
    o,
    n,
    r
  );
}
function w_(e, t) {
  return $t(Ca(e, t));
}
function __(e, t, n, r) {
  const o = e.nodes.findIndex(
    (c) => c.id === t
  ), s = xr(r);
  if (o < 0 || e.nodes[o].storyboardMaterializedSignature === n && xr(
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
function _d(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Map();
  t.forEach((s, i) => {
    const c = s.storyboardItem;
    c?.sourceNodeId === e.storyboardNode.id && n.set(
      co(c.sourceNodeId, c.itemType, c.itemId),
      i
    );
  });
  let r = !1;
  const o = va.filter(
    (s) => s.enabled(e.storyboard)
  );
  for (const s of o) {
    const i = s.local ? null : Xs(e.powers, s.powerKind, s.outputType);
    for (const c of s.items(e.storyboard, {
      framePlanVersion: e.framePlanVersion
    })) {
      const a = n.get(
        co(
          e.storyboardNode.id,
          c.type,
          c.id
        )
      ) ?? -1;
      if (a < 0)
        continue;
      const d = kl(
        c,
        t,
        e.storyboardNode.id
      ), f = t[a], h = Tl(
        f,
        f.groupId || "",
        d,
        s,
        i,
        { preserveStructure: !0 }
      );
      h !== f && (t[a] = h, r = !0);
    }
  }
  if (hu(e.storyboard)) {
    const s = Fl({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Xs(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    r = r || !!s?.changed;
  }
  return r ? { ...e.canvas, nodes: t } : e.canvas;
}
function b_(e) {
  const t = xr(e.framePlanVersion) || yu, n = [...e.canvas.nodes], r = /* @__PURE__ */ new Set(), o = new Set(
    va.map((b) => b.itemType)
  ), s = va.filter(
    (b) => b.enabled(e.storyboard)
  ), i = hu(
    e.storyboard
  );
  o.add("video_compose"), i && r.add(
    co(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const c = s.map((b) => ({
    spec: b,
    items: b.items(e.storyboard, { framePlanVersion: t }),
    power: b.local ? null : Xs(e.powers, b.powerKind, b.outputType)
  }));
  for (const { items: b } of c)
    for (const R of b)
      r.add(
        co(e.storyboardNode.id, R.type, R.id)
      );
  let a = !1;
  for (let b = n.length - 1; b >= 0; b -= 1) {
    const R = n[b].storyboardItem;
    !R || R.sourceNodeId !== e.storyboardNode.id || !o.has(R.itemType) || r.has(
      co(
        R.sourceNodeId,
        R.itemType,
        R.itemId
      )
    ) || (n.splice(b, 1), a = !0);
  }
  const d = _w({
    sourceNode: e.storyboardNode,
    groups: c.map(({ spec: b, items: R, power: P }) => ({
      key: b.key,
      layoutIndex: b.layoutIndex,
      itemCount: R.length,
      power: P,
      powerKind: b.powerKind,
      direction: b.direction
    }))
  });
  let f = sc(n, e.canvas.nextNodeNo);
  a = a || f !== e.canvas.nextNodeNo;
  for (const { spec: b, items: R, power: P } of c) {
    const V = d.get(b.key);
    if (!V)
      continue;
    const G = v_({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: b,
      layout: V,
      assetCate: e.assetCate
    });
    a = a || G.changed;
    for (const X of R) {
      const T = kl(
        X,
        n,
        e.storyboardNode.id
      ), B = n.findIndex(
        (re) => Zs(
          re,
          e.storyboardNode.id,
          T.type,
          T.id
        )
      );
      if (B >= 0) {
        const re = n[B], le = Tl(
          re,
          G.node.id,
          T,
          b,
          P
        );
        le !== re && (n[B] = le, a = !0);
        continue;
      }
      const U = S_({
        nodes: n,
        group: G.node,
        storyboardNode: e.storyboardNode,
        item: T,
        assetCate: e.assetCate,
        spec: b,
        power: P
      });
      U.nodeNo = f++, n.push(U), a = !0;
    }
    const ee = R.map(
      (X) => n.find(
        (T) => T.groupId === G.node.id && Zs(
          T,
          e.storyboardNode.id,
          X.type,
          X.id
        )
      )
    ).filter((X) => !!X), se = Iw(
      G.node,
      ee
    );
    for (const X of ee) {
      const T = se.positions.get(X.id);
      if (!T || X.x === T.x && X.y === T.y)
        continue;
      const B = n.indexOf(X);
      n[B] = { ...X, ...T }, a = !0;
    }
    const ie = n.findIndex((X) => X.id === G.node.id), L = n[ie];
    (L.width !== se.width || L.height !== se.height) && (n[ie] = {
      ...L,
      width: se.width,
      height: se.height
    }, a = !0);
  }
  const h = new Set(s.map((b) => b.key));
  for (let b = n.length - 1; b >= 0; b -= 1) {
    const R = n[b];
    R.type !== "group" || R.group?.origin !== "script" || R.group.sourceNodeId !== e.storyboardNode.id || !R.group.syncKey || h.has(
      R.group.syncKey
    ) || (n.splice(b, 1), a = !0);
  }
  const I = i ? Fl({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Xs(e.powers, "video", "video_compose"),
    nextNodeNo: f
  }) : null;
  I && (f = I.nextNodeNo, a = a || I.changed);
  let N = R_(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    s
  );
  return N = k_(N, n, e.storyboardNode.id), N = I ? x_(
    N,
    n,
    e.storyboardNode.id,
    I.node.id,
    s
  ) : A_(N, e.storyboardNode.id), N !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: f, nodes: n, edges: N } : e.canvas;
}
function kl(e, t, n) {
  const r = (N) => (N || []).map(
    (b) => t.find(
      (R) => Zs(R, n, b.type, b.id)
    )
  ).filter((b) => !!b), o = r(e.dependencyItems), s = r(e.referenceItems), i = e.externalReferences || [], c = {
    ...e,
    dependencyNodeIds: o.map((N) => N.id),
    referenceNodeIds: s.map((N) => N.id)
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return c;
  const a = I_(
    e.prompt,
    s,
    i
  ), d = a === e.prompt ? c : { ...c, prompt: a }, f = i.map(
    Al
  );
  if (f.push(
    ...s.map((N) => xl(N, e)).filter((N) => !!N)
  ), !f.length)
    return d;
  const h = ns(
    a,
    f
  ), I = Ja(h);
  return Cu(h) ? { ...c, prompt: I, promptContent: h } : { ...d, prompt: I };
}
function I_(e, t, n = []) {
  const r = [], o = /* @__PURE__ */ new Set();
  for (const s of n) {
    const i = Gc(s.label), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  for (const s of t) {
    const i = Gc(s.title), c = i ? `@${i}` : "";
    !c || o.has(c) || e.includes(c) || (o.add(c), r.push(c));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function xl(e, t) {
  const n = Number(e.resultRef?.asset_id || e.asset?.id || 0), r = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!n || !r)
    return null;
  const o = Wa(
    e.storyboardItem?.frameMediaItems
  ), s = Ya(
    e.storyboardItem?.shotImageMode
  ), i = N_(
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
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? s === "references" ? "reference" : wu(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function N_(e, t, n) {
  if (e !== "shot_image" || !n.length)
    return {};
  if (t?.type === "shot") {
    const r = n.find((s) => s.frameRole === "end") || n.find((s) => s.frameRole === "start");
    return {
      mediaItems: (t.continuityAnchor ? r ? [r] : [] : n).map((s) => ({
        url: "",
        index: s.mediaIndex,
        usage: wu(s.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = qc(n, "end") || qc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function Al(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function v_(e) {
  const t = hc(
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
    for (const [a, d] of e.nodes.entries()) {
      if (d.id !== t.id && d.groupId !== t.id)
        continue;
      const f = {
        ...d,
        x: d.x + s,
        y: d.y + i,
        ...d.id === t.id ? {
          title: e.spec.title,
          width: e.layout.bounds.width,
          height: e.layout.bounds.height,
          group: {
            ...d.group || {},
            layoutKey: e.layout.layoutKey
          }
        } : {}
      };
      e.nodes[a] = f, d.id === t.id && (c = f);
    }
    return { node: c, changed: !0 };
  }
  const n = e.layout.bounds, r = di("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = _c(
    e.nodes,
    `script-group-${$t(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function hc(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function S_(e) {
  const t = di(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = _c(
    e.nodes,
    `script-item-${$t(
      co(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    ui({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${T_(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: "",
    promptContent: Dl(
      "",
      void 0,
      e.item.promptContent
    ),
    paramValues: e.item.paramValues
  }, t.storyboardItem = Pl(
    e.storyboardNode.id,
    e.item
  );
  const n = bw(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function Tl(e, t, n, r, o, s = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = String(e.composerDraft?.prompt || ""), a = Ko(
    c,
    i.generatedPrompt
  ), d = a !== c, f = a !== c, h = C_(
    e.composerDraft?.paramValues,
    c,
    a,
    n.paramValues
  ), I = h !== e.composerDraft?.paramValues, N = Dl(
    a,
    d ? void 0 : e.composerDraft?.promptContent,
    n.promptContent
  ), b = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(N || null), R = Pl(i.sourceNodeId, n), P = s.preserveStructure && e.titleMode === "manual" ? e.title : n.title, V = e.title !== P, G = i.generatedPrompt !== n.prompt, ee = s.preserveStructure ? e.groupId || "" : t, se = !e.power && !!o, ie = e.kind !== r.powerKind, L = e.outputType !== r.outputType, X = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === ee && !f && !I && !b && !V && !se && !ie && !L && !X && El(i, R) ? e : {
    ...e,
    title: P,
    kind: r.powerKind,
    outputType: r.outputType,
    ...se ? {
      power: o || void 0,
      subtitle: o?.output?.name || o?.name || e.subtitle
    } : {},
    description: G || se ? n.prompt : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: ee,
    composerDraft: f || I || b ? {
      ...e.composerDraft || {},
      prompt: a,
      promptContent: N,
      paramValues: h
    } : e.composerDraft,
    storyboardItem: R
  };
}
function Ml(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [o, s] of Object.entries(e))
    s === t && (r ||= { ...e }, r[o] = n);
  return r || e;
}
function C_(e, t, n, r) {
  let o = Ml(
    e,
    t,
    n
  );
  for (const [s, i] of Object.entries(r || {}))
    o?.[s] !== i && (o = { ...o || {}, [s]: i });
  return o;
}
function Dl(e, t, n) {
  return !n || !Cu(n) ? t : ns(
    e,
    ii(n)
  );
}
function Pl(e, t) {
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
    optional: t.optional
  };
}
function El(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && _r(e.dependencyNodeIds, t.dependencyNodeIds) && _r(e.referenceNodeIds, t.referenceNodeIds) && _r(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && _r(e.frameMediaItems, t.frameMediaItems) && _r(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && _r(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && _r(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && !!e.optional == !!t.optional;
}
function Zs(e, t, n, r) {
  const o = e.storyboardItem;
  return !!(o && o.sourceNodeId === t && o.itemType === n && o.itemId === r);
}
function R_(e, t, n, r) {
  const o = r.map((a) => ({
    spec: a,
    group: t.find(
      (d) => d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId === n && d.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), s = `script-edge-${$t(n)}-`, i = e.filter((a) => !a.id.startsWith(s));
  for (const { spec: a, group: d } of o) {
    const f = a.direction === "upstream", h = (a.sourceGroupKeys || []).map((N) => hc(t, n, N)).filter((N) => !!N), I = f ? [d] : h.length ? h : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of I) {
      const b = N.id, R = f ? n : d.id;
      i.push({
        id: bc(i, `${s}${a.key}-${$t(b)}`),
        from: b,
        to: R,
        logicalFrom: b,
        logicalTo: R,
        purpose: "structure",
        executionMode: f ? void 0 : "manual"
      });
    }
  }
  const c = Jt(t, i);
  return wc(e, c) ? e : c;
}
function k_(e, t, n) {
  const r = `script-item-edge-${$t(n)}-`, o = e.filter((a) => !a.id.startsWith(r)), s = t.filter(
    (a) => a.storyboardItem?.sourceNodeId === n && (!!a.groupId || a.storyboardItem.itemType === "video_compose")
  ), i = new Map(s.map((a) => [a.id, a]));
  for (const a of s)
    for (const d of a.storyboardItem?.dependencyNodeIds || []) {
      const f = i.get(d);
      !f || f.id === a.id || o.push({
        id: bc(
          o,
          `${r}${$t(f.id)}-${$t(a.id)}`
        ),
        from: f.id,
        to: a.id,
        logicalFrom: f.id,
        logicalTo: a.id,
        purpose: "dependency",
        executionMode: f.groupId && f.groupId === a.groupId ? void 0 : "manual"
      });
    }
  const c = Jt(t, o);
  return wc(e, c) ? e : c;
}
function Fl(e) {
  const t = e.nodes.find(
    (i) => Zs(
      i,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = r_({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), r = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: ""
  };
  if (t) {
    const i = e.preservePosition ? { x: t.x, y: t.y } : bd(e.nodes, e.storyboardNode), c = !t.power && !!e.power, a = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), d = t.x !== i.x || t.y !== i.y;
    if (!c && !a && !d && t.kind === "video" && t.outputType === "video_compose" && El(t.storyboardItem, r))
      return {
        node: t,
        changed: !1,
        nextNodeNo: e.nextNodeNo
      };
    const f = {
      ...t,
      x: i.x,
      y: i.y,
      kind: "video",
      outputType: "video_compose",
      ...c ? {
        power: e.power || void 0,
        subtitle: e.power?.output?.name || e.power?.name || "视频合成",
        description: "按镜头顺序合成画面、原声和配音。"
      } : {},
      composerDraft: {
        ...t.composerDraft || {},
        videoComposition: n
      },
      storyboardItem: r
    };
    return e.nodes[e.nodes.indexOf(t)] = f, {
      node: f,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const o = bd(
    e.nodes,
    e.storyboardNode
  ), s = di(
    "power",
    e.assetCate,
    e.nodes.length,
    o,
    e.power ? { power: e.power } : void 0
  );
  return s.id = _c(
    e.nodes,
    `script-compose-${$t(e.storyboardNode.id)}`
  ), s.nodeNo = e.nextNodeNo, s.title = "视频合成", s.kind = "video", s.outputType = "video_compose", s.description = "按镜头顺序合成画面、原声和配音。", e.power || (s.subtitle = "未配置视频合成能力", s.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), s.composerDraft = { videoComposition: n }, s.storyboardItem = r, e.nodes.push(s), {
    node: s,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function bd(e, t) {
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
function x_(e, t, n, r, o) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (f) => o.some((h) => h.key === f)
  ).map((f) => hc(t, n, f)).filter((f) => !!f), c = `script-compose-edge-${$t(n)}-`, a = e.filter((f) => !f.id.startsWith(c));
  for (const f of i.length ? i : t.filter((h) => h.id === n))
    a.push({
      id: bc(a, `${c}${$t(f.id)}`),
      from: f.id,
      to: r,
      logicalFrom: f.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const d = Jt(t, a);
  return wc(e, d) ? e : d;
}
function A_(e, t) {
  const n = `script-compose-edge-${$t(t)}-`, r = e.filter((o) => !o.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function wc(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const o = n.get(r.id);
    return !!(o && r.from === o.from && r.to === o.to && (r.logicalFrom || "") === (o.logicalFrom || "") && (r.logicalTo || "") === (o.logicalTo || "") && (r.purpose || "") === (o.purpose || "") && (r.executionMode || "auto") === (o.executionMode || "auto") && (r.mediaUsage || "") === (o.mediaUsage || ""));
  });
}
function co(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function _c(e, t) {
  return Ol(new Set(e.map((n) => n.id)), t);
}
function bc(e, t) {
  return Ol(new Set(e.map((n) => n.id)), t);
}
function Ol(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function $t(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function Id(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function T_(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function _r(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function M_(e, t) {
  const n = /* @__PURE__ */ new Set(), r = e.find((s) => s.id === t);
  if (!r)
    return [];
  r.type === "power" && Mr(
    r.power,
    r.kind,
    r.outputType
  ) && n.add(r.id), r.storyboardItem?.sourceNodeId && n.add(r.storyboardItem.sourceNodeId);
  const o = Number(
    r.resultRef?.asset_id || r.asset?.id || 0
  );
  for (const s of e) {
    const i = s.storyboardItem;
    i && (i.referenceNodeIds?.includes(t) || i.dependencyNodeIds?.includes(t) || o > 0 && i.externalReferenceAssetIds?.includes(o)) && n.add(i.sourceNodeId);
  }
  return [...n];
}
const D_ = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function Bl(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return D_[n] || { section: "shots" };
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
function P_(e, t) {
  const n = mi(e);
  return {
    frames: $l(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: zl(e, n)
  };
}
function Nd(e) {
  return mi(e);
}
function E_(e, t) {
  return zl(e).get(t.id) || "";
}
function zl(e, t = mi(e)) {
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
function $l(e, t, n = mi(e)) {
  const r = new Map(e.map((d) => [d.id, d])), o = /* @__PURE__ */ new Map();
  for (const d of e)
    d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId && o.set(d.id, d.group.sourceNodeId);
  const s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const d of e) {
    const f = /* @__PURE__ */ new Set();
    if (n.has(d.id) && f.add(d.id), d.group?.sourceNodeId && f.add(d.group.sourceNodeId), d.storyboardItem?.sourceNodeId && f.add(d.storyboardItem.sourceNodeId), d.groupId) {
      const h = o.get(d.groupId);
      h && f.add(h);
    }
    for (const h of f)
      Ji(s, h, d);
    d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId && Ji(
      i,
      d.group.sourceNodeId,
      d
    ), d.storyboardItem?.sourceNodeId && !d.storyboardItem.optional && Ji(
      c,
      d.storyboardItem.sourceNodeId,
      d
    );
  }
  const a = [];
  for (const d of n) {
    const f = r.get(d);
    if (!f)
      continue;
    const h = s.get(d) || [];
    if (h.length <= 1)
      continue;
    const I = i.get(d) || [], N = c.get(d) || [];
    a.push({
      id: pi(d),
      sourceNodeId: d,
      title: f.title || "分镜脚本",
      memberNodeIds: h.map((b) => b.id),
      workNodeIds: N.map((b) => b.id),
      groupCount: I.length,
      workNodeCount: N.length,
      completedCount: N.filter(t).length
    });
  }
  return a;
}
function Ji(e, t, n) {
  const r = e.get(t);
  r ? r.push(n) : e.set(t, [n]);
}
function jl(e, t, n, r = new Map(t.map((o) => [o.id, o]))) {
  const s = e.workNodeIds.map((c) => r.get(c)).filter((c) => !!c).filter((c) => !n(c));
  if (s.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const i = s.find(
    (c) => !dc(c)
  );
  return i ? {
    pendingNodeIds: s.map((c) => c.id),
    blockedReason: `“${i.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: s.map((c) => c.id),
    blockedReason: ll({
      targets: s,
      nodesByID: r,
      hasResult: n
    })
  };
}
function pi(e) {
  return `storyboard-frame:${e}`;
}
function mi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
const uo = /* @__PURE__ */ new Map(), F_ = 100;
function O_(e, t) {
  const n = String(t.runError || "").trim(), r = t.id, o = Number(t.resultRef?.execution_id || 0), s = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), c = z_(
    e,
    r,
    o,
    s,
    i
  ), [a, d] = $(n), [f, h] = $(!1);
  return ue(() => {
    if (d(n), !n || !c || !ug(n)) {
      h(!1);
      return;
    }
    let I = !0;
    return h(!0), B_({
      projectId: e,
      nodeId: r,
      executionId: o,
      requestId: s,
      runId: i,
      cacheKey: c,
      fallback: n
    }).then((N) => {
      I && N && d(N);
    }).catch(() => {
    }).finally(() => {
      I && h(!1);
    }), () => {
      I = !1;
    };
  }, [
    o,
    n,
    r,
    e,
    c,
    s,
    i
  ]), { error: a || n, loading: f };
}
function B_({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: o,
  cacheKey: s,
  fallback: i
}) {
  const c = uo.get(s);
  if (c)
    return c;
  const a = cl({
    projectId: e,
    executionId: n,
    requestId: r,
    runId: o
  }).then((d) => {
    const f = Sn(d), h = [...f.node_results || []].reverse().find((N) => N.node_key === t), I = nc(h) || $u(f);
    return rc(I, i);
  });
  return uo.set(s, a), $_(), a.catch(() => uo.delete(s)), a;
}
function z_(e, t, n, r, o) {
  const s = n ? `execution:${n}` : r ? `request:${r}` : o ? `run:${o}` : "";
  return e > 0 && s ? `${e}:${s}:${t}` : "";
}
function $_() {
  for (; uo.size > F_; ) {
    const e = uo.keys().next().value;
    if (!e)
      return;
    uo.delete(e);
  }
}
function mo(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function _t(e) {
  return e?.status === "running" || e?.status === "waiting";
}
const As = /* @__PURE__ */ new Set();
let Ra = Date.now(), Oo;
function j_(e) {
  return As.add(e), Oo == null && typeof window < "u" && (Ra = Date.now(), Oo = window.setInterval(() => {
    Ra = Date.now(), As.forEach((t) => t());
  }, 1e3)), () => {
    As.delete(e), As.size === 0 && Oo != null && (window.clearInterval(Oo), Oo = void 0);
  };
}
function V_() {
  return () => {
  };
}
function vd() {
  return Ra;
}
function L_({
  runTiming: e,
  runningNode: t,
  showEstimate: n = !0
}) {
  const r = _t(t), o = r ? { startedAt: t?.startedAt || 0, finishedAt: void 0 } : U_(t) || e, s = bp(
    r && o?.startedAt ? j_ : V_,
    vd,
    vd
  );
  if (!o?.startedAt || !r && (!o.finishedAt || o.finishedAt < o.startedAt))
    return null;
  const i = Math.max(
    0,
    (r ? s : o.finishedAt || o.startedAt) - o.startedAt
  ), c = ig(
    i,
    r,
    t?.estimatedDurationMs
  ), a = n ? c.tooltip : c.elapsed;
  return /* @__PURE__ */ l(ot, { label: a, side: "top", sideOffset: 6, children: /* @__PURE__ */ O(
    "span",
    {
      className: `ws-node-run-timing${r ? " is-active" : ""}`,
      "aria-label": a,
      children: [
        /* @__PURE__ */ l(Kp, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ l("span", { children: c.elapsed })
      ]
    }
  ) });
}
function U_(e) {
  if (!(!e?.startedAt || !e.finishedAt))
    return {
      startedAt: e.startedAt,
      finishedAt: e.finishedAt
    };
}
function Be({
  label: e,
  overlay: t = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [o, s] = $(r <= 0);
  return ue(() => {
    if (r <= 0) {
      s(!0);
      return;
    }
    const i = window.setTimeout(() => s(!0), r);
    return () => window.clearTimeout(i);
  }, [r]), o ? /* @__PURE__ */ O(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ l(Yn, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ l("span", { children: e })
      ]
    }
  ) : null;
}
function K_({
  space: e,
  canvases: t,
  cache: n
}) {
  const [r, o] = $([]), [s, i] = $([]), [c, a] = $([]), [d, f] = $(!1), h = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, I = te(h), N = ae(
    () => d || q_(t),
    [t, d]
  );
  ue(() => {
    I.current = h, o([]), i([]), a([]), f(!1);
  }, [h]);
  const b = M(
    async (R = !1) => {
      if (!e)
        return !1;
      const P = h;
      try {
        const V = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => Fy(e.project.id),
          R
        );
        return I.current !== P ? !1 : (o(V.roles), i(V.powers), a(V.powerCategories), f(!0), !0);
      } catch (V) {
        return j.error(V instanceof Error ? V.message : "加载能力列表失败"), !1;
      }
    },
    [n, h, e]
  );
  return ue(() => {
    !e || !N || d || b();
  }, [b, d, N, e]), {
    roles: r,
    powers: s,
    powerCategories: c,
    loaded: d,
    required: N,
    load: b
  };
}
function q_(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : Mr(n.power, n.kind, n.outputType) ? !!vn([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function G_(e, t, n) {
  const r = e.get(t);
  e.set(
    t,
    r ? (o) => n(r(o)) : n
  );
}
function H_(e, t) {
  let n = e;
  for (const [r, o] of t) {
    const s = e[r], i = o(s);
    i !== s && (n === e && (n = { ...e }), i ? n[r] = i : delete n[r]);
  }
  return n;
}
function W_({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: r,
  failedCount: o,
  status: s,
  frameRunning: i = !1,
  selected: c,
  managed: a = !1,
  onRename: d,
  onEditStructure: f,
  onRun: h,
  runBlockedReason: I = "",
  children: N
}) {
  const [b, R] = $(!1), [P, V] = $(e.title), G = te(null), ee = s === "running" || s === "waiting", se = ee ? "分组正在执行" : i ? "制作区正在执行" : I || (n === 0 ? "分组内暂无可运行节点" : "运行分组"), ie = !h || n === 0 || ee || i || !!I;
  ue(() => {
    b || V(e.title);
  }, [b, e.title]), ue(() => {
    b && (G.current?.focus(), G.current?.select());
  }, [b]);
  const L = () => {
    const X = P.trim() || "未命名分组";
    R(!1), V(X), X !== e.title && d?.(X);
  };
  return /* @__PURE__ */ O(
    "div",
    {
      className: `ws-node-group-wrap ${c ? "is-selected" : ""} ${ee ? "is-running" : ""} ${s === "error" ? "is-error" : ""} ${a ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ O("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ l("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ l(qp, { size: 15 }) }),
          b ? /* @__PURE__ */ l(
            "input",
            {
              ref: G,
              className: "ws-node-group-title-input nodrag nowheel",
              value: P,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (X) => V(X.target.value),
              onBlur: L,
              onKeyDown: (X) => {
                X.key === "Enter" ? (X.preventDefault(), L()) : X.key === "Escape" && (X.preventDefault(), V(e.title), R(!1));
              }
            }
          ) : /* @__PURE__ */ l(
            ot,
            {
              label: a ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ l(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (X) => {
                    X.preventDefault(), X.stopPropagation(), !(a || !d) && R(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ l("span", { className: "ws-node-group-count", children: ee ? `${r}/${n}` : `${t} 个节点` }),
          s === "waiting" ? /* @__PURE__ */ l("span", { className: "ws-node-group-status", children: "等待反馈" }) : s === "error" ? /* @__PURE__ */ l("span", { className: "ws-node-group-status", children: o > 0 ? `失败 ${o}` : "运行失败" }) : I ? /* @__PURE__ */ l(ot, { label: I, children: /* @__PURE__ */ l("span", { className: "ws-node-group-status", children: "等待前置" }) }) : i ? /* @__PURE__ */ l("span", { className: "ws-node-group-status", children: "等待调度" }) : n > 0 && r === n ? /* @__PURE__ */ O("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ l(qa, { size: 12 }),
            "已完成"
          ] }) : null,
          f ? /* @__PURE__ */ l(ot, { label: "编辑分镜结构", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (X) => {
                X.preventDefault(), X.stopPropagation(), f();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ l(Xd, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ l(ot, { label: se, children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: ie,
              onClick: (X) => {
                X.preventDefault(), X.stopPropagation(), h?.();
              },
              "aria-label": "运行分组",
              children: ee ? /* @__PURE__ */ l(Yn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ l(Ka, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ l("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        N
      ]
    }
  );
}
function Vl({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: r,
  className: o = "",
  style: s,
  onOpen: i,
  onOpenIntent: c,
  openOnContentClick: a = !1,
  resizeControls: d,
  children: f,
  customContentIsPureMedia: h = !1,
  followContent: I = !1,
  followKey: N
}) {
  const b = te(null), R = te(!0), P = so(e, n), V = f != null, G = h || !V && !P && Ll(n), ee = !!i && (!V || h), se = [
    "ws-result-view",
    G ? "" : "nodrag",
    "nopan",
    "nowheel",
    G ? "has-pure-media" : "",
    o
  ].filter(Boolean).join(" ");
  return ue(() => {
    if (!I) {
      R.current = !0;
      return;
    }
    const T = b.current;
    T && R.current && (T.scrollTop = T.scrollHeight);
  }, [I, N]), /* @__PURE__ */ O(
    "div",
    {
      role: ee ? "button" : void 0,
      tabIndex: ee ? 0 : void 0,
      className: se,
      style: s,
      onPointerDown: (T) => {
        (!G || J_(T)) && T.stopPropagation();
      },
      onClick: (T) => {
        T.stopPropagation(), !(!i || Ps(T.target, T.currentTarget) || Z_(T)) && (T.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (T) => {
        T.stopPropagation(), !(!i || Ps(T.target, T.currentTarget) || T.key !== "Enter" && T.key !== " ") && (T.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ l(
          "div",
          {
            ref: b,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (T) => {
              !a || !i || Ps(T.target, T.currentTarget) || Ul(T, T.currentTarget) || (T.preventDefault(), T.stopPropagation(), i());
            },
            onScroll: (T) => {
              if (!I)
                return;
              const B = T.currentTarget;
              R.current = B.scrollHeight - B.scrollTop - B.clientHeight < 16;
            },
            children: V ? f : P ? /* @__PURE__ */ l(
              io,
              {
                output: e,
                fallback: t,
                mediaGridKind: ts(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ l(Y_, { preview: n, label: r ?? t })
          }
        ),
        d
      ]
    }
  );
}
function Y_({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ O("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ l(
      "img",
      {
        src: e.imageUrl,
        alt: t || "图片结果",
        loading: "lazy",
        decoding: "async"
      }
    ),
    t ? /* @__PURE__ */ l("figcaption", { children: t }) : null
  ] }) : e.videoUrl ? /* @__PURE__ */ O("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ l(
      $s,
      {
        src: e.videoUrl,
        poster: e.videoPosterUrl,
        ariaLabel: t || "视频结果",
        objectFit: "contain",
        allowDragFromVideo: !0
      },
      e.videoUrl
    ),
    t ? /* @__PURE__ */ l("figcaption", { children: t }) : null
  ] }) : e.audioUrl ? /* @__PURE__ */ O("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ l("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ l("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ O(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ l(Ga, { size: 16 }),
        /* @__PURE__ */ l("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ l(
    io,
    {
      output: X_(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function X_(e) {
  return e ? { text: e } : void 0;
}
function Ll(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Ps(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t && t.contains(n));
}
function Z_(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  return t ? Ul(e, t) : !1;
}
function Ul(e, t) {
  if (t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function J_(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? bm(n, e.clientY) : Ps(t, e.currentTarget);
}
const Kl = Lt(() => import("./space-agent-tools-Cv50aQJh.js")), Ic = Lt(() => import("./space-asset-tools-u-6wbU6J.js")), Q_ = ft(
  Kl,
  (e) => e.AgentInteractionPanel
), eb = Q_.Component, ql = ft(
  Lt(() => import("./protected-5-nodes-body-work-space-space-add-node-menu-tsx-DSetxnPx.js")),
  (e) => e.AddNodeMenu
), tb = ql.Component, nb = ql.preload, Gl = ft(
  Ic,
  (e) => e.AssetBrowser
), rb = Gl.Component, ob = Gl.preload, Hl = ft(
  Ic,
  (e) => e.AssetDetailDialog
), sb = Hl.Component, ib = Hl.preload, Wl = ft(
  Ic,
  (e) => e.AssetPickerDialog
), Sd = Wl.Component, Cd = Wl.preload, Yl = ft(
  Lt(() => import("./space-run-history-hf5_izc6.js")),
  (e) => e.CanvasRunHistoryDrawer
), ab = Yl.Component, cb = Yl.preload, db = ft(
  Lt(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-Binx3nN1.js")),
  (e) => e.SpaceCanvasManagerDialog
), ub = db.Component, lb = ft(
  Lt(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-4ZaPl6uh.js")),
  (e) => e.CanvasParamBindingDialog
), fb = lb.Component, Xl = ft(
  Lt(() => import("./space-assistant-D2iYQ-Fu.js")),
  (e) => e.SpaceAssistant
), pb = Xl.Component, mb = Xl.preload, gb = ft(
  Kl,
  (e) => e.CanvasAgentResultContent
), yb = gb.Component, Zl = ft(
  Lt(() => import("./node-detail-dialog-CFpgIO_c.js")),
  (e) => e.NodeDetailDialog
), hb = Zl.Component, Qo = Zl.preload, Jl = ft(
  Lt(() => import("./space-node-settings-D252aX1n.js")),
  (e) => e.CanvasNodeSettings
), wb = Jl.Component, _b = Jl.preload, bb = ft(
  Lt(() => import("./space-storyboard-node-CtDAXPV1.js")),
  (e) => e.StoryboardNodeContent
), Ib = bb.Component, Nb = ft(
  Lt(() => import("./space-storyboard-confirm-dialog-F_zhiFye.js").then((e) => e.a)),
  (e) => e.StoryboardConfirmDialog
), vb = Nb.Component, Sb = ft(
  Lt(() => import("./space-video-compose-view-CFMmQesX.js")),
  (e) => e.VideoComposeView
), Cb = Sb.Component;
function Rb({
  assistantName: e,
  onIntent: t,
  onOpen: n
}) {
  const r = `打开${e || "画布助手"}`;
  return /* @__PURE__ */ l("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ l(ot, { label: r, side: "left", children: /* @__PURE__ */ l(
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
      children: /* @__PURE__ */ l(Gp, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
const Es = 520, kb = 440, xb = 720, Ql = "bot.canvasAssistant.width", ef = "bot.canvasAssistant.open";
function tf(e) {
  return Number.isFinite(e) ? Math.min(
    xb,
    Math.max(kb, Math.round(e))
  ) : Es;
}
function Ab(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function Tb(e) {
  return e === "1";
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const ka = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!ka || Object.keys(ka).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
function Ue(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: Mb } = ka;
function Db(...e) {
  for (const t of e) {
    const n = Rr(t);
    if (n)
      return n;
  }
  return null;
}
function Js(...e) {
  for (const t of e) {
    const n = nf(t);
    if (Le(n))
      return n;
  }
  return "";
}
function nf(e) {
  const t = Ve(e), n = is(t);
  if (n !== t)
    return nf(n);
  const r = Mb?.(t) ?? t, o = br(r, /* @__PURE__ */ new Set());
  if (Le(o))
    return o;
  if (r !== t) {
    const c = br(t, /* @__PURE__ */ new Set());
    if (Le(c))
      return c;
  }
  const s = gi(t);
  if (s)
    return ma?.(s) ?? s;
  const i = Nc(e);
  return i !== t && Le(i) ? i : "";
}
function br(e, t) {
  const n = Ve(e), r = is(n);
  if (r !== n)
    return br(r, t);
  if (typeof n == "string") {
    const a = of(n);
    if (Le(a))
      return a;
    const d = Wo(n);
    return d ? { text: d } : Zn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((d) => br(d, t)).filter(Le);
    return a.length > 0 ? a : "";
  }
  if (!Ue(n))
    return n;
  if (Dr(n)) {
    const a = uf(n);
    if (a !== void 0)
      return br(a, t);
    const d = lf(n);
    if (d)
      return { text: d };
    const f = Rr(n) || Rt(n);
    return f ? { rich: f } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), Rc(n))
    return xa(n);
  if (sf(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const d = br(n[a], t);
    if (Le(d))
      return d;
  }
  const o = vc(n);
  if (o) {
    const a = { rich: o };
    return ma?.(a) ?? a;
  }
  const s = Rt(n);
  if (s)
    return { rich: s };
  const i = gi(n);
  if (i)
    return ma?.(i) ?? i;
  const c = kt(n);
  if (c !== n)
    return br(c, t);
  if (Pb(n))
    return xa(n);
  if (wi(n)) {
    const a = De(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return yi(n) ? n : "";
}
function Pb(e) {
  return !!(Ue(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function xa(e) {
  const t = {}, n = Ve(e.content);
  Ue(n) && kd(t, n), kd(t, e);
  const r = Eb(e);
  return r && (t.text = r), !Le(t) && n && typeof n == "object" ? n : yi(t) ? t : "";
}
function Eb(e) {
  const t = De(e.text);
  if (t)
    return t;
  const n = Ve(e.content);
  return typeof n == "string" ? n.trim() : Ue(n) ? De(n.text) : "";
}
function Nc(e) {
  const t = is(e);
  if (t !== e)
    return Nc(t);
  const n = gi(e);
  if (n)
    return n;
  const r = of(e);
  if (Le(r))
    return r;
  const o = Ve(e), s = Rt(o);
  if (s)
    return { rich: s };
  const i = kt(o);
  if (i !== o) {
    const c = Rt(i);
    return c ? { rich: c } : i;
  }
  return o;
}
function gi(e) {
  const t = Rr(e);
  return t ? { rich: t } : null;
}
function Rr(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e), r = is(n);
  if (r !== n)
    return Rr(r, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = Rr(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!Ue(n) || t.has(n))
    return null;
  if (t.add(n), Dr(n))
    return rf(n, t) || n;
  const o = n, s = [
    Xe(o, ["output", "content", "rich"]),
    Xe(o, ["output", "rich"]),
    Xe(o, ["content", "rich"]),
    o.content,
    o.rich,
    o.text,
    o.summary
  ];
  for (const i of s) {
    if (i === n)
      continue;
    const c = Rr(i, t);
    if (c)
      return c;
  }
  return null;
}
function rf(e, t) {
  const n = Qs(e);
  for (const r of n) {
    const o = Rd(r, t);
    if (o)
      return o;
  }
  return Rd(n.join(""), t);
}
function Rd(e, t) {
  const n = String(e || "").trim();
  if (!Zn(n))
    return null;
  const r = _u(n);
  return r === n || r === e ? null : Rr(r, t);
}
function Fb(e) {
  return Qs(e).join("");
}
function Qs(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => Qs(r, t));
  if (!Ue(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...Qs(e.content, t)), n;
}
function of(e) {
  const t = Vt(e);
  if (t)
    return { rich: t };
  const n = Ve(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = Wo(n);
    return r ? { text: r } : "";
  }
  return "";
}
function Vt(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e);
  if (Dr(n))
    return rf(n, t) || n;
  if (Array.isArray(n))
    return Rt(Cc(n));
  if (!Ue(n) || t.has(n))
    return null;
  t.add(n);
  const r = n, o = vc(r);
  if (o)
    return o;
  const s = [
    Xe(r, ["output", "content", "rich"]),
    Xe(r, ["output", "content"]),
    Xe(r, ["output", "rich"]),
    Xe(r, ["content", "output", "content", "rich"]),
    Xe(r, ["content", "output", "content"]),
    Xe(r, ["content", "rich"]),
    Xe(r, ["data", "output", "content", "rich"]),
    Xe(r, ["data", "output", "content"]),
    Xe(r, ["data", "content", "rich"]),
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
    const c = Vt(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(r)) {
    if (!ff(i) || !c || typeof c != "object")
      continue;
    const a = Vt(c, t);
    if (a)
      return a;
  }
  return null;
}
function vc(e) {
  if (Dr(e))
    return e;
  const t = Ue(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), r = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? Rt({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || r === "rich_json") && e.rich != null ? Vt(e.rich) : (n === "rich_json" || r === "rich_json") && t?.rich != null ? Vt(t.rich) : null;
}
function Dr(e) {
  return !!(Ue(e) && e.type === "doc" && Array.isArray(e.content));
}
function kd(e, t) {
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
    Le(t[n]) && (e[n] = n === "rich" ? Ob(t[n]) : t[n]);
}
function Ob(e) {
  return Vt(e) || Rt(Cc(e)) || Rt(e) || e;
}
function yi(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Le(n));
}
function sf(e) {
  return !Ue(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => Le(e[t]));
}
function Le(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !Zn(t) && !Bt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Le) : Ue(e) ? Vt(e) ? !0 : wi(e) ? !1 : yi(e) : !1;
}
function Sc(e) {
  return jt(
    kn(e),
    e.description || e.title
  );
}
function Bb(e) {
  const t = [
    kn(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = Vt(n) || Rt(Nc(n)) || Rt(kt(n)) || Rt(n);
    if (r)
      return r;
  }
  return null;
}
function jt(e, t = "") {
  const n = kt(e), r = Rt(n), o = r ? Nr(r).trim() : "";
  if (o && !Bt(o))
    return o;
  const s = Nr(n).trim();
  if (Bt(s))
    return "";
  const i = Wo(s);
  if (i)
    return i;
  if (s && !Zn(s))
    return s;
  if (kc(s)) {
    const f = Nr(
      kt(Ve(s))
    ).trim();
    if (f && f !== s && !Bt(f))
      return f;
  }
  const c = String(t || "").trim();
  if (Bt(c))
    return "";
  const a = Wo(c);
  if (a)
    return a;
  if (!Zn(c))
    return c;
  const d = Nr(
    kt(Ve(c))
  ).trim();
  return d && d !== c && !Bt(d) ? d : "";
}
function Bt(e) {
  const t = e.trim();
  return t ? zb(t) || $b(t) : !1;
}
function zb(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function $b(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function nr(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = kt(e);
  return es(n, r, t), !Xn(n) && r !== e && es(n, e, t), qo(n) && Zn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Nm(e, "video").find(
    (o) => o.url === n.videoUrl
  )?.thumbnail), n;
}
function jb(e, t) {
  return {
    text: De(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function es(e, t, n, r = /* @__PURE__ */ new Set(), o = 0) {
  if (o > 12 || t == null)
    return;
  if (typeof t == "string") {
    xd(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const d of t)
      if (es(e, d, n, r, o + 1), qo(e))
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
  const s = t, i = Vb(e, s, n), c = jt(t, "");
  c && c !== i && !Rn(c) && (e.text ||= c);
  const a = ro(s.url, s.src, s.href);
  if (a && a !== i && xd(e, a, n), e.imageUrl ||= ro(
    s.image,
    s.image_url,
    s.imageUrl,
    at(s.images),
    at(s.imageUrls)
  ), e.videoUrl ||= ro(
    s.video,
    s.video_url,
    s.videoUrl,
    at(s.videos),
    at(s.videoUrls)
  ), e.audioUrl ||= ro(
    s.audio,
    s.audio_url,
    s.audioUrl,
    at(s.audios),
    at(s.audioUrls)
  ), e.fileUrl ||= ro(
    s.file,
    s.file_url,
    s.fileUrl,
    at(s.files),
    at(s.fileUrls)
  ), !qo(e)) {
    for (const d of ["output", "result", "content", "body", "data", "rich"])
      if (s[d] && typeof s[d] == "object" && (es(e, s[d], n, r, o + 1), qo(e)))
        return;
  }
  if (!e.text && !Xn(e) && !Wb(s) && yi(s))
    try {
      const d = JSON.stringify(t, null, 2);
      go(d) || (e.text = d);
    } catch {
      const d = String(t);
      go(d) || (e.text = d);
    }
}
function Vb(e, t, n) {
  const r = af(
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
  const o = ro(...Ub(t, r));
  return o ? (r === "image" && (e.imageUrl ||= o), r === "video" && (e.videoUrl ||= o), r === "audio" && (e.audioUrl ||= o), r === "file" && (e.fileUrl ||= o), o) : "";
}
function Lb(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return af(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function af(...e) {
  for (const t of e) {
    const n = hi(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function hi(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function Ub(e, t) {
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
    Xe(e, ["attrs", "src"]),
    Xe(e, ["attrs", "url"]),
    Xe(e, ["attrs", "href"])
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
function xd(e, t, n) {
  const r = t.trim();
  if (!r || Bt(r))
    return;
  if (kc(r)) {
    const c = Ve(r);
    if (c !== r && (es(e, c, n), qo(e)))
      return;
    const a = jt(c, "");
    a && !Rn(a) && (e.text ||= a);
    return;
  }
  const o = Wo(r);
  if (o) {
    e.text ||= o;
    return;
  }
  const s = Nr(r);
  if (s && s !== r) {
    e.text ||= s;
    return;
  }
  const i = Kb(r, n);
  if (i) {
    Gb(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (Rn(r)) {
    const c = hi(n);
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
function Kb(e, t) {
  const n = cf(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const d = Qi(r[2]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: Ts(e, r[0], r[1])
      };
  }
  const o = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (o) {
    const d = Qi(o[1]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: Ts(e, o[0], "")
      };
  }
  const s = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = s.exec(e); ) {
    const d = Qi(i[2]), f = Ad(d, n);
    if (f)
      return {
        kind: f,
        url: d,
        caption: Ts(e, i[0], i[1])
      };
  }
  const c = Hb(e), a = Ad(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: Ts(e, c, "")
  } : null;
}
function cf(e, t) {
  return hi(t) ? t : qb(e) ? "image" : t;
}
function qb(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Gb(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Ad(e, t) {
  if (!e || !Rn(e))
    return "";
  const n = hi(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function Ts(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !Rn(r) ? r : String(n || "").trim();
}
function Qi(e) {
  const t = df(e);
  return Rn(t) ? t : "";
}
function Hb(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? df(t[0]) : "";
}
function df(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Wb(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function Xn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !go(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function qo(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Yb(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (Ue(t)) {
      const n = De(
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
        Xe(t, ["attrs", "src"]),
        Xe(t, ["attrs", "url"]),
        Xe(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function ro(...e) {
  const t = Yb(...e);
  return Rn(t) ? t : "";
}
function at(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function Rn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function kn(e) {
  return Xb(
    Im(e.asset?.version?.content, e.resultOutput)
  );
}
function Xb(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = uf(n);
    if (r !== void 0)
      return r;
    const o = lf(n);
    if (o)
      return { text: o };
    const s = Js(n) || kt(n);
    if (Le(s) || xc(s))
      return s;
  }
  if (t !== void 0)
    return Js(t) || kt(t);
}
function uf(e) {
  const t = Ve(e), n = Dr(t) ? t : Vt(t);
  if (!n)
    return;
  const r = Fb(n).trim();
  if (!Zn(r))
    return;
  const o = _u(r);
  if (o === r)
    return;
  const s = kt(o);
  if (Le(s) || xc(s))
    return s;
}
function lf(e) {
  const t = Ve(e), n = Dr(t) ? t : Vt(t);
  return uu(n);
}
function kt(e) {
  const t = Ve(e), n = is(t);
  if (n !== t)
    return kt(n);
  if (sf(t))
    return t;
  if (Ue(t) && Rc(t)) {
    const s = xa(t);
    if (Le(s))
      return s;
  }
  const r = gi(t);
  if (r)
    return r.rich;
  if (Dr(t))
    return t;
  const o = Vt(t);
  return o || Cc(ei(t, /* @__PURE__ */ new Set()));
}
function ei(e, t) {
  if (!Ue(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, r = pf(n);
  if (r !== void 0)
    return r;
  const o = Zb(n, t);
  if (o !== void 0)
    return o;
  for (const s of Jb) {
    const i = Xe(n, s);
    if (i === void 0 || i === e)
      continue;
    const c = ei(
      Ve(i),
      t
    );
    if (Aa(c))
      return c;
  }
  if (wi(n))
    for (const s of ["output", "result", "data", "body"]) {
      if (n[s] === void 0 || n[s] === e)
        continue;
      const i = ei(
        Ve(n[s]),
        t
      );
      if (Aa(i))
        return i;
    }
  return e;
}
function Zb(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!ff(n) || !r || typeof r != "object")
      continue;
    const o = ei(Ve(r), t);
    if (Aa(o))
      return o;
  }
}
function ff(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const Jb = [
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
function pf(e) {
  const t = vc(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Ve(e.content);
    if (Ue(n)) {
      const r = pf(n);
      if (r !== void 0)
        return r;
    }
  }
}
function Cc(e) {
  const t = Ve(e);
  return Ue(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function wi(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function Aa(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !Zn(n) && !Bt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!Ue(e) || Vt(e) || Rt(e))
    return !0;
  if (wi(e))
    return !1;
  const t = Nr(e).trim();
  return !!(t && !go(t));
}
function Xe(e, t) {
  let n = e;
  for (const r of t) {
    if (!Ue(n) || !(r in n))
      return;
    n = n[r];
  }
  return n;
}
function is(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Qb(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function Qb(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && /\s/.test(e[o] || ""); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const i = e.indexOf("```", s), c = i >= 0 ? e.slice(o, i) : e.slice(o), a = eI(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    s = i + 3;
  }
}
function eI(e, t = !1) {
  const n = e.trim(), r = vm(n);
  for (const o of Sm([n, r])) {
    const s = Ve(o);
    if (s !== o && (t ? tI(s) : Rc(s)))
      return s;
  }
  return null;
}
function tI(e) {
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
function Rc(e) {
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
  ].some((n) => Le(e[n]));
}
function kc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Zn(e) {
  const t = String(e || "").trim();
  return !!(t && (kc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function mf(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return Bt(e) ? "" : e;
  const t = Nr(e).trim();
  if (t && Bt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return go(n) ? "" : n;
  } catch {
    const n = String(e);
    return Bt(n) ? "" : n;
  }
}
function xc(e) {
  const t = mf(e).trim();
  return !!(t && !go(t));
}
function go(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || Bt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const Ta = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!Ta || Object.keys(Ta).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const nI = Ta.useTheme;
function as(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function ti(e) {
  return as(e) ? e : {};
}
function Me(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!as(n))
      return;
    n = n[r];
  }
  return n;
}
const gf = {}, Fs = [], rI = [], Td = [], Md = /* @__PURE__ */ new Set(), oI = 800;
function sI(e) {
  const t = te(/* @__PURE__ */ new Map()), n = te(0), r = M(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
    const s = t.current;
    t.current = /* @__PURE__ */ new Map(), s.size !== 0 && e((i) => H_(i, s));
  }, [e]), o = M(
    (s, i) => {
      G_(t.current, s, i), !n.current && (n.current = window.setTimeout(() => {
        n.current = 0, r();
      }, AI));
    },
    [r]
  );
  return ue(
    () => () => {
      n.current && window.clearTimeout(n.current), t.current = /* @__PURE__ */ new Map();
    },
    []
  ), ae(() => ({ enqueue: o, flush: r }), [o, r]);
}
function Dd(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function yf(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const o of Tu(e, r.id))
        n.add(o.id);
  return n;
}
function hf(e) {
  return Object.values(e).some(_t);
}
function iI(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function aI(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function cI(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((o) => {
    const s = Uf(o), i = o.x + s.width, c = o.y + s.height;
    return o.type === "group" ? r.left <= o.x && r.top <= o.y && r.right >= i && r.bottom >= c : r.left <= i && r.right >= o.x && r.top <= c && r.bottom >= o.y;
  }).map((o) => o.id);
}
function dI(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const uI = {
  workSpace: Wd(qf, gv)
}, Ac = Ip(!1), lI = {
  animated: gw
}, fI = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, pI = [18, 18], mI = ["Control", "Meta"], gI = {
  type: "animated",
  animated: !1
}, yI = { padding: 0.32, maxZoom: 0.72 };
function Ye(e) {
  const t = te(e);
  return fa(() => {
    t.current = e;
  }, [e]), ae(() => Nh(t), []);
}
function hI({
  onInitialLoadComplete: e
}) {
  const t = _p(), n = om(), r = ae(() => Cv(), []), o = ae(() => Rv(), []), s = ae(() => new sh(), []), [i, c] = $(null), [a, d] = $(o), f = te(o), [h, I] = $(0), N = te(0), [b, R] = $(null), P = te(null), [V, G] = $([]), ee = V[V.length - 1] || "", [se, ie] = $({}), L = te(se), [X, T] = $(!1), [B, U] = $([]), [re, le] = $(!1), fe = te(0), [_e, Ne] = $("create"), [pe, me] = $(
    () => kv(r)
  ), [ze, Ke] = $(!1), [ce, pt] = $(
    () => xv()
  ), { resolvedTheme: ve, setTheme: xt } = nI();
  im(n.site.appearance, ve);
  const [Ut, Kt] = $(null), [rr, on] = $(!0), Er = te(!0), [xn, qe] = $({}), or = te(xn);
  or.current = xn;
  const ge = sI(qe), [ds, At] = $({}), [ct, Tt] = $(null), [An, Tn] = $(null), sr = te(null), [Mt, us] = $(!1), [Dt, bt] = $(null), [sn, Ge] = $(), [mt, qt] = $(), [Mn, Fr] = $(
    null
  ), [ls, Or] = $(null), [fs, _o] = $(!1), [an, Dn] = $(""), [cn, Pn] = $(null), [Gt, ir] = $(""), [Ht, Pt] = $([]), [ar, En] = $([]), [cr, Br] = $(!1), [zr, Fn] = $(""), [dn, $e] = $(!1), [Je, bo] = $(1), [Qe, $r] = $(!1), [un, jr] = $(() => /* @__PURE__ */ new Set()), [Vr, Lr] = $(!1), [Se, Wt] = $(null), [de, On] = $(!1), xe = te(null), Io = te(!1), gt = te(/* @__PURE__ */ new Set()), dr = te(/* @__PURE__ */ new Set()), ln = te(/* @__PURE__ */ new Set()), dt = te([]), It = te(!1), Ur = te(!1), Et = te([0]), ur = te(null), Kr = te(/* @__PURE__ */ new Map()), No = te(
    /* @__PURE__ */ new Map()
  ), lr = te(/* @__PURE__ */ new Set()), [
    qr,
    vo
  ] = $(() => /* @__PURE__ */ new Set()), [
    en,
    fr
  ] = $({}), yt = te(null), {
    roles: So,
    powers: je,
    powerCategories: Ii,
    loaded: fn,
    load: pr
  } = K_({
    space: i,
    canvases: se,
    cache: s
  });
  ue(() => {
    fr({});
  }, [i?.project.id, i?.project.release_id, i?.release?.id]), ue(() => {
    L.current = se;
  }, [se]), ue(() => {
    N.current = h;
  }, [h]), ue(() => {
    f.current = a;
  }, [a]), ue(() => {
    dt.current = Ht;
  }, [Ht]);
  const Bn = M(
    (u, m) => {
      if (u = u.trim(), !u)
        return;
      const y = lr.current;
      if (y.has(u) === m)
        return;
      const w = new Set(y);
      m ? w.add(u) : w.delete(u), lr.current = w, vo(w);
    },
    []
  ), pn = M(
    (u) => {
      const m = Oa(u);
      if (!m)
        return;
      const y = String(m.request_id || "").trim();
      y && Bn(y, Un(m));
      const w = sa(
        dt.current,
        [m]
      );
      dt.current = w, Pt(w);
    },
    [Bn]
  ), mr = M(
    (u) => {
      const m = String(u?.request_id || "").trim();
      m && Bn(m, !1);
    },
    [Bn]
  ), Gr = M((u) => {
    j.error(u instanceof Error ? u.message : "保存画布失败");
  }, []), {
    markCanvasDirty: zn,
    flushCanvasSave: Yt,
    adoptCanvasSnapshot: tn,
    forgetCanvasSnapshot: Ni,
    resetCanvasAutosave: nn,
    canvasSaveStatus: gr
  } = nh({
    projectId: r,
    enabled: !!i,
    canvases: se,
    setCanvases: ie,
    onError: Gr
  }), et = Ye(
    Te
  ), yr = Ye(
    zi
  );
  ue(() => {
    if (ln.current.size === 0)
      return;
    const u = [...ln.current];
    ln.current.clear();
    for (const m of u)
      zn(m);
  }, [se, zn]);
  const Hr = M(async () => {
    if (!r) {
      ir("缺少作品 ID"), on(!1);
      return;
    }
    on(!0), ir("");
    try {
      const u = await xy(
        r,
        f.current,
        N.current
      ), m = PN(
        u.canvases || {},
        u.assets || []
      ), y = Number(u.initialCanvasId || 0) || Number(Object.values(m)[0]?.id || 0), w = Number(u.initialAssetCateId || 0) || $g(u);
      c(u), L.current = m, ie(m), nn(m), f.current = y, d(y), N.current = w, I(w), no(y), R(null), P.current = null, fe.current += 1, T(!1), U([]), le(!1), gt.current = /* @__PURE__ */ new Set(), dr.current = /* @__PURE__ */ new Set(), dt.current = [], Pt([]), lr.current = /* @__PURE__ */ new Set(), vo(/* @__PURE__ */ new Set()), En([]), bo(1), $r(!1), Et.current = [0], et(r, u, m, "recovery", {
        canvasId: y
      });
    } catch (u) {
      ir(u instanceof Error ? u.message : "加载创作空间失败");
    } finally {
      on(!1);
    }
  }, [et, r, nn]), Wr = M((u) => {
    Fr(u);
  }, []);
  ue(() => {
    Hr();
  }, [Hr]), ue(() => {
    rr || !Er.current || (Er.current = !1, e());
  }, [rr, e]);
  const st = i?.assetCates, ps = ae(() => i ? Ju(i) : [], [i]), ms = ps.length > 1, ne = ae(
    () => i ? Ki(i, h) : null,
    [h, i]
  ), vi = ae(
    () => i && ne ? jg(i, ne.id) : [],
    [ne, i]
  ), Si = ae(() => So.filter(Vg), [So]), Ci = ae(() => je.filter(Lg), [je]), Ri = ae(
    () => je.some(
      (u) => Number(u.id || 0) > 0 && String(u.kind || "").trim().toLowerCase() === "video" && Jn(u).outputType === "lip_sync"
    ),
    [je]
  ), H = ae(() => {
    const u = i?.canvasList.find(
      (m) => m.id === a
    );
    return se[String(a)] || ed(
      u?.assetCateId || ne?.id || 0,
      a,
      u?.name || "第一幕"
    );
  }, [a, ne?.id, se, i?.canvasList]), Co = ae(
    () => (i?.canvasList || []).filter((u) => u.assetCateId === ne?.id).sort((u, m) => u.sort - m.sort || u.id - m.id),
    [ne?.id, i?.canvasList]
  ), Ro = M(
    async (u) => {
      const m = fe.current + 1;
      fe.current = m, le(!0);
      try {
        const y = await Py({
          projectId: r,
          assetCateId: u
        });
        fe.current === m && U(y);
      } catch (y) {
        fe.current === m && (U([]), j.error(
          y instanceof Error ? y.message : "加载已删除画布失败"
        ));
      } finally {
        fe.current === m && le(!1);
      }
    },
    [r]
  ), tt = M(() => {
    ne && (T(!0), U([]), Ro(ne.id));
  }, [ne, Ro]), Pe = ae(
    () => SI(H, ds),
    [H, ds]
  ), ki = ae(() => {
    const u = new Set(V);
    return Pe.nodes.filter((m) => u.has(m.id));
  }, [Pe.nodes, V]), xi = M(
    async (u) => {
      const m = await Eo({
        projectId: r,
        canvasId: u
      }), y = oo(
        Qr(m.canvas, je),
        m.assets
      );
      c(
        (C) => C && {
          ...C,
          assets: eo(C.assets, m.assets),
          canvasList: m.canvasList.length > 0 ? m.canvasList : C.canvasList
        }
      );
      const w = String(u), _ = {
        ...L.current,
        [w]: y
      };
      L.current = _, ie(_), tn(y);
    },
    [tn, je, r]
  ), Ai = M((u) => {
    const m = tf(u);
    pt(m), Hd(
      Ql,
      String(m)
    );
  }, []), mn = M(
    (u) => {
      me(u), u || Ke(!1), Hd(
        `${ef}:${r}`,
        u ? "1" : "0"
      );
    },
    [r]
  ), gs = vr, ys = ae(
    () => Yh({
      nodes: Pe.nodes,
      assets: i?.assets || [],
      canvasId: H.id,
      assetCateId: ne?.id || 0,
      nodeOutput: kn,
      nodePreview: Pr,
      assetPreview: (u) => {
        const m = u.version?.content ?? u.name, y = nr(
          m,
          String(u.kind || "")
        );
        return Xn(y) || (y.text = u.name), y;
      },
      nodeHasResult: Qt
    }),
    [H.id, ne?.id, Pe.nodes, i?.assets]
  ), ko = ae(
    () => Jh(ys),
    [ys]
  ), xo = M(
    (u = "") => {
      Cd(), Dn(u), xe.current = H.nodes.find((m) => m.id === u) || (xe.current?.id === u ? xe.current : null), Kt(null), Ne("create"), _o(!0);
    },
    [H.nodes]
  ), Xt = M(
    (u, m) => {
      if (!Number.isInteger(u) || u <= 0)
        return;
      const y = (C) => {
        const k = String(u), z = C[k];
        if (!z) return C;
        const F = DN(
          m(z),
          z.assetCateId
        );
        return ON(z, F) ? C : (ln.current.add(u), {
          ...C,
          [k]: F
        });
      }, w = L.current, _ = y(w);
      L.current = _, ie((C) => {
        const k = C === w ? _ : y(C);
        return L.current = k, k;
      });
    },
    []
  ), ht = M(
    (u) => {
      ne && Xt(H.id, u);
    },
    [H.id, ne, Xt]
  ), Ce = M(
    (u, m, y) => {
      const _ = L.current[String(u)]?.nodes.find(
        (k) => k.id === m
      ), C = p_(
        h_(_, y),
        fn && !!st
      );
      C === "defer-materialize" && (fr((k) => ({
        ...k,
        [`${u}:${m}`]: { canvasId: u, nodeId: m }
      })), fn || pr()), f.current === u && At(
        (k) => CI(k, m, y)
      ), Xt(u, (k) => {
        const z = k.assetCateId, F = {
          ...k,
          nodes: k.nodes.map(
            (Z) => Z.id === m ? { ...Z, ...y } : Z
          )
        };
        if (!st)
          return F;
        const q = {
          canvas: F,
          assetCate: ba(st, z),
          powers: je
        };
        if (C === "materialize")
          return wd({
            ...q,
            sourceNodeId: m
          });
        if (C === "defer-materialize")
          return F;
        const Y = M_(
          F.nodes,
          m
        );
        return Y.length ? Zi({
          ...q,
          sourceNodeIds: Y
        }) : F;
      });
    },
    [
      st,
      pr,
      fn,
      je,
      Xt
    ]
  );
  ue(() => {
    if (!fn || !st || Object.keys(en).length === 0)
      return;
    const u = Object.values(en);
    fr({});
    for (const { canvasId: m, nodeId: y } of u)
      Xt(
        m,
        (w) => wd({
          canvas: w,
          assetCate: ba(st, w.assetCateId),
          powers: je,
          sourceNodeId: y
        })
      );
  }, [
    st,
    en,
    fn,
    je,
    Xt
  ]);
  const Ee = M(
    (u, m) => {
      Ce(H.id, u, m), f.current === H.id && Tt(
        (y) => y?.id === u ? { ...y, ...m } : y
      );
    },
    [H.id, Ce]
  ), $n = M(
    (u, m, y) => {
      if (!hN(m, y))
        return;
      const w = Number(y.version_id || 0), _ = `${u}:${m.id}:${w}`;
      if (gt.current.has(_))
        return;
      gt.current.add(_);
      const C = m.title.trim(), k = L.current[String(u)];
      zy({
        projectId: r,
        nodeKey: m.id,
        versionId: w,
        prompt: yN(m, k)
      }).then((z) => {
        const F = z.title.trim();
        !F || F === C || z.versionId !== w || Xt(u, (q) => {
          const Y = q.nodes.find(
            (Z) => Z.id === m.id
          );
          return !Y || Y.titleMode !== "auto" || Y.title.trim() !== C || !Xu(Y) ? q : {
            ...q,
            nodes: q.nodes.map(
              (Z) => Z.id === m.id ? { ...Z, title: F } : Z
            )
          };
        });
      }).catch(() => {
        gt.current.delete(_);
      });
    },
    [r, Xt]
  ), Zt = M(
    async (u) => {
      u.canvasId && zn(u.canvasId);
    },
    [zn]
  ), Yr = M(
    (u, m, y) => {
      const w = {};
      ht((_) => {
        const C = _.nodes.map(
          (k) => k.id === u ? {
            ...k,
            composerDraft: cc(m)
          } : k
        );
        return w.canvas = { ..._, nodes: C }, w.canvas;
      }), y?.save === "immediate" && w.canvas && Yt(w.canvas).catch(() => {
      });
    },
    [Yt, ht]
  ), Nt = M(
    (u) => {
      ht((m) => {
        const y = m.edges.filter((w) => w.id !== u);
        return y.length === m.edges.length ? m : { ...m, edges: y };
      });
    },
    [ht]
  ), hs = M(
    (u, m, y) => {
      const w = FN(u);
      if (w) {
        ib(), Tt(null), Ge(void 0), qt(void 0), bt(w);
        return;
      }
      Qo(), bt(null), Ge(m), qt(y), Tt(u);
    },
    []
  ), Ti = M((u) => {
    Tt(
      (m) => m?.id === u.id && m !== u ? u : m
    );
  }, []), ws = Ye((u) => {
    Tn({ canvasId: H.id, nodeId: u });
  }), vt = An?.canvasId === H.id ? Pe.nodes.find((u) => u.id === An.nodeId) : void 0, Ao = vt ? vn(Bs(vt)) : null;
  async function Mi(u) {
    if (Mt || !vt)
      return !1;
    const m = Number(
      vt.asset?.id || vt.resultRef?.asset_id || 0
    ), y = Number(
      vt.asset?.version_id || vt.asset?.version?.id || vt.resultRef?.version_id || 0
    );
    if (!m || !y)
      return j.error("当前分镜尚未保存，不能确认"), !1;
    us(!0);
    try {
      const w = await qy({
        projectId: r,
        assetId: m,
        versionId: y,
        productionPlan: u
      });
      return _s(vt, w), Tn(null), j.success("分镜已确认，制作组将按当前版本同步"), !0;
    } catch (w) {
      return j.error(sm(w, "确认分镜失败")), !1;
    } finally {
      us(!1);
    }
  }
  const Xr = M(
    (u, m) => {
      At((y) => {
        const w = H.nodes.find(
          (k) => k.id === u
        );
        if (!w)
          return y;
        const _ = y[u] || {}, C = {
          ...w,
          ..._
        };
        return {
          ...y,
          [u]: {
            ..._,
            feedbackRequests: m(Sr(C))
          }
        };
      });
    },
    [H.nodes]
  ), hr = M((u) => {
    const m = new Set(u.filter(Boolean));
    if (m.size !== 0) {
      if (yt.current && m.has(yt.current.nodeId)) {
        const y = yt.current;
        yt.current = null, y.reject(new Error(_l));
      }
      Wt(
        (y) => y && m.has(y.node.id) ? null : y
      ), At((y) => {
        const w = { ...y };
        let _ = !1;
        for (const C of m) {
          const k = w[C] || {};
          w[C] = {
            ...k,
            feedbackRequests: []
          }, _ = !0;
        }
        return _ ? w : y;
      });
    }
  }, []), ut = M((u) => {
    !u || !u.id || c((m) => m && {
      ...m,
      assets: eo(m.assets, [u])
    });
  }, []), _s = M(
    (u, m) => {
      const y = Hn(
        m,
        u.asset
      );
      ut(y);
      const w = Os(u, y);
      u.id.startsWith("asset-detail-") || Ee(u.id, w), Tt(
        (_) => _?.id === u.id ? { ..._, ...w } : _
      );
    },
    [Ee, ut]
  ), Di = M(
    (u) => {
      if (!Dt)
        return;
      const m = H.nodes.find(
        (_) => _.id === Dt.nodeId
      );
      if (!m)
        return;
      const y = Kn(u), w = Os(
        m,
        y
      );
      ut(y), Ee(m.id, w);
    },
    [
      H.nodes,
      Dt,
      Ee,
      ut
    ]
  ), To = M(
    ({ node: u, prompt: m }) => {
      const y = Tc(u, m), w = Ma(
        Sr(u),
        y
      );
      return Xr(
        u.id,
        (_) => Ma(_, y)
      ), On(!1), new Promise((_, C) => {
        yt.current = {
          nodeId: u.id,
          recordId: y.id,
          resolve: _,
          reject: C
        }, Wt({
          node: { ...u, feedbackRequests: w },
          recordId: y.id,
          prompt: m
        });
      });
    },
    [Xr]
  ), Pi = M(
    async (u) => {
      const m = yt.current;
      if (!(!m || de)) {
        On(!0);
        try {
          await m.submit?.(u), Xr(
            m.nodeId,
            (y) => ow(y, m.recordId, u)
          ), yt.current = null, Wt(null), m.resolve(u);
        } catch (y) {
          j.error(y instanceof Error ? y.message : "提交反馈失败");
        } finally {
          On(!1);
        }
      }
    },
    [Xr, de]
  ), Ei = M(() => {
    Wt(null);
  }, []), Fi = M(
    (u, m) => {
      if (yt.current?.nodeId === u.id && yt.current.recordId === m.id && m.status === "pending") {
        Wt({
          node: u,
          recordId: m.id,
          prompt: m.prompt
        });
        return;
      }
      if (m.status === "pending") {
        const y = gN(
          dt.current,
          u,
          m
        );
        if (y) {
          On(!1), yt.current = {
            nodeId: u.id,
            recordId: m.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (w) => {
              await Df(
                r,
                y.run,
                y.pending,
                y.prompt,
                w
              ), j.success("已提交反馈，流程继续执行"), window.setTimeout(() => ur.current?.(), 0);
            }
          }, Wt({
            node: u,
            recordId: m.id,
            prompt: y.prompt
          });
          return;
        }
      }
      Wt({
        node: u,
        recordId: m.id,
        prompt: {
          ...m.prompt,
          values: m.values || m.prompt.values || {}
        }
      });
    },
    [r]
  ), jn = M(
    ({
      assetCate: u,
      startNode: m,
      canvas: y,
      nodes: w = y.nodes,
      ..._
    }) => {
      if (!i)
        throw new Error("创作空间尚未加载");
      const C = y.id, k = (F) => {
        qe((q) => f.current !== C ? q : typeof F == "function" ? F(q) : F);
      }, z = {
        enqueue: (F, q) => ge.enqueue(
          F,
          (Y) => f.current === C ? q(Y) : Y
        ),
        flush: ge.flush
      };
      return {
        projectId: r,
        canvasId: C,
        assetCate: u,
        space: i,
        startNode: m,
        ..._,
        nodes: w,
        edges: y.edges,
        viewport: y.viewport,
        canvasUpdatedAt: y.updatedAt,
        flushCanvasSave: Yt,
        onNodeResult: Ee,
        onAssetCreated: ut,
        setRunningNode: k,
        getRunningNode: (F) => or.current[F],
        runningNodeBatcher: z,
        requestFlowFeedback: To,
        requestNodeTitle: (F, q) => $n(y.id, F, q)
      };
    },
    [
      r,
      Yt,
      $n,
      To,
      ge,
      i,
      Ee,
      ut
    ]
  ), Vn = M(
    async (u) => {
      i && await et(
        r,
        i,
        L.current,
        "recovery",
        {
          canvasId: u?.canvasId || f.current,
          runIds: [Number(u?.canvasRun?.run_id || 0)]
        }
      );
    },
    [et, r, i]
  ), bs = M(
    async (u) => {
      if (!i || !ne)
        return;
      let m = null;
      try {
        hr(
          lh(
            u.id,
            Pe.nodes,
            Pe.edges
          )
        ), m = jn({
          assetCate: ne,
          startNode: u,
          canvas: {
            ...H,
            nodes: Pe.nodes,
            edges: Pe.edges,
            viewport: H.viewport
          }
        }), await ta(m), await Zt(m), j.success("开始节点执行完成");
      } catch (y) {
        if (nw(y) || Vo(y))
          return;
        const w = y instanceof Error ? y.message : "开始节点执行失败";
        m?.setRunningNode?.((_) => ({
          ..._,
          [u.id]: {
            nodeId: u.id,
            title: u.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error"
          }
        })), j.error(w), window.setTimeout(() => {
          m?.setRunningNode?.(
            (_) => mo(_, u.id)
          );
        }, 1400);
      } finally {
        await Vn(m);
      }
    },
    [
      ne,
      H,
      Pe.edges,
      Pe.nodes,
      hr,
      jn,
      Zt,
      Vn,
      i
    ]
  ), Oi = M(
    async (u) => {
      if (!i || !ne)
        return;
      const m = L.current[String(H.id)] || H, y = m.nodes.find(
        (F) => F.id === u
      );
      if (!y) {
        j.error("分镜脚本节点不存在");
        return;
      }
      const w = $l(
        m.nodes,
        Qt
      ).find((F) => F.sourceNodeId === u);
      if (!w) {
        j.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const _ = jl(
        w,
        m.nodes,
        Qt
      );
      if (_.blockedReason) {
        j.error(_.blockedReason);
        return;
      }
      const C = pi(u), k = jn({
        assetCate: ne,
        startNode: y,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: pn,
        canvas: m
      });
      hr(_.pendingNodeIds), k.setRunningNode?.((F) => ({
        ...F,
        [C]: {
          nodeId: C,
          title: `${y.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let z = 650;
      try {
        await ta(k), j.success("制作区执行完成");
      } catch (F) {
        if (Vo(F))
          z = 0;
        else {
          z = 1400;
          const q = F instanceof Error ? F.message : "制作区执行失败";
          k.setRunningNode?.((Y) => ({
            ...Y,
            [C]: {
              ...Y[C] || {
                nodeId: C,
                title: `${y.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0
              },
              status: "error"
            }
          })), j.error(q);
        }
      } finally {
        mr(k.canvasRun), (k.canvasRun?.node_results || []).some(
          (q) => q.node_key && Qn(q) === "success"
        ) && (ht(
          (q) => Zi({
            canvas: q,
            sourceNodeIds: [u],
            assetCate: ne,
            powers: je
          })
        ), await Zt(k)), window.setTimeout(() => {
          k.setRunningNode?.(
            (q) => mo(q, C)
          );
        }, z), await Vn(k);
      }
    },
    [
      H,
      ne,
      hr,
      jn,
      Zt,
      je,
      Vn,
      mr,
      pn,
      i,
      ht
    ]
  ), Is = M(
    async (u, m) => {
      if (!i || !ne)
        return;
      const y = L.current[String(H.id)] || H, w = y.nodes.find((Q) => Q.id === u.id) || u, _ = kI({
        ...w,
        composerDraft: {
          ...w.composerDraft || {},
          ...u.composerDraft || {}
        }
      }), C = ch(
        _.id,
        m?.targetNodeIds
      ), k = uh(
        y.nodes.map(
          (Q) => Q.id === _.id ? _ : Q
        ),
        C
      ), z = new Map(
        k.map((Q) => [Q.id, Q])
      ), F = C.map((Q) => z.get(Q)).filter((Q) => !!Q), q = (Q) => {
        let Fe = Q;
        for (const be of C)
          Fe[be] && (Fe === Q && (Fe = { ...Q }), delete Fe[be]);
        return Fe;
      }, Y = Bf(
        u.id,
        k,
        y.edges
      ), Z = jn({
        assetCate: ne,
        startNode: _,
        singleNode: !0,
        targetNodeIds: m?.targetNodeIds,
        onCanvasRunChange: pn,
        canvas: y,
        nodes: k,
        runInput: {
          _manual_input_context: Y || void 0,
          _agent_turn_input: m?.agentInput,
          manual_node_id: u.id
        }
      });
      for (const Q of F)
        Ee(Q.id, { runError: "" });
      Z.setRunningNode?.((Q) => {
        const Fe = { ...Q };
        for (const be of F) {
          const wn = Q[be.id];
          Fe[be.id] = {
            ...wn || {},
            nodeId: be.id,
            title: be.title,
            startedAt: wn?.startedAt || Date.now(),
            progress: Math.max(wn?.progress || 0, 8),
            status: "running",
            ...be.id === _.id && m?.agentInput ? { agent: gl() } : {}
          };
        }
        return Fe;
      });
      try {
        await ta(Z), await Zt(Z);
      } catch (Q) {
        if (Vo(Q)) {
          Ee(_.id, { runError: "" }), Z.setRunningNode?.(q);
          return;
        }
        throw Ee(_.id, {
          runError: Q instanceof Error ? Q.message : "节点运行失败"
        }), Z.setRunningNode?.((Fe) => ({
          ...Fe,
          [_.id]: {
            ...Fe[_.id] || {
              nodeId: _.id,
              title: _.title,
              startedAt: Date.now()
            },
            progress: 92,
            status: "error"
          }
        })), window.setTimeout(() => {
          Z.setRunningNode?.(q);
        }, 1400), Q;
      } finally {
        mr(Z.canvasRun), await Vn(Z);
      }
    },
    [
      ne,
      H,
      jn,
      Zt,
      Vn,
      mr,
      pn,
      i,
      Ee
    ]
  ), Bi = M(
    async (u) => {
      if (!ne)
        throw new Error("当前分类不存在");
      return ov({
        node: u,
        projectId: r,
        canvasId: H.id,
        assetCate: ne,
        inputContext: u.inputContext || null,
        onNodeResult: Ee,
        onAssetCreated: ut,
        onRunStartNode: bs,
        onOpenImportPicker: xo
      });
    },
    [
      H.id,
      ne,
      xo,
      r,
      bs,
      Ee,
      ut
    ]
  );
  ue(() => {
    i && yr(Ht, H, i);
  }, [H, yr, Ht, i]);
  async function p() {
    const u = L.current[String(f.current)] || H;
    if (!u.id)
      return !0;
    try {
      return await Yt(u), !0;
    } catch {
      return !1;
    }
  }
  function g() {
    G([]), At({}), qe({}), Or(null), Kt(null), Tt(null), Tn(null), bt(null), Ge(void 0), _o(!1), Dn(""), xe.current = null, Pn(null), $e(!1);
  }
  async function S(u) {
    if (u === f.current) return !0;
    if (P.current != null)
      return !1;
    const m = i?.canvasList.find((_) => _.id === u);
    if (!m)
      return j.error("目标画布不存在"), !1;
    if (!await p()) return !1;
    const y = String(u);
    if (!Object.prototype.hasOwnProperty.call(L.current, y)) {
      P.current = m.assetCateId, R(m.assetCateId);
      try {
        const _ = await Eo({
          projectId: r,
          canvasId: u
        }), C = oo(
          Qr(_.canvas, je),
          _.assets
        );
        c(
          (z) => z && {
            ...z,
            assets: eo(z.assets, _.assets),
            canvasList: _.canvasList.length > 0 ? _.canvasList : z.canvasList
          }
        );
        const k = {
          ...L.current,
          [y]: C
        };
        L.current = k, ie(k), tn(C);
      } catch (_) {
        return j.error(_ instanceof Error ? _.message : "加载画布失败"), !1;
      } finally {
        P.current = null, R(null);
      }
    }
    if (f.current = u, d(u), N.current = m.assetCateId, I(m.assetCateId), no(u), g(), !i)
      return !0;
    const w = L.current[y] || ed(m.assetCateId, u, m.name);
    return yr(Ht, w, i), et(
      r,
      i,
      L.current,
      "recovery",
      { canvasId: u }
    ), !0;
  }
  async function x(u) {
    const m = (i?.canvasList || []).filter((y) => y.assetCateId === u).sort((y, w) => y.sort - w.sort || y.id - w.id)[0];
    if (m) return S(m.id);
    if (!i || P.current != null || !await p()) return !1;
    P.current = u, R(u);
    try {
      const y = await Eo({
        projectId: r,
        canvasId: 0,
        assetCateId: u
      }), w = oo(
        Qr(y.canvas, je),
        y.assets
      ), _ = w.id, C = {
        ...L.current,
        [String(_)]: w
      };
      return L.current = C, ie(C), tn(w), c(
        (k) => k && {
          ...k,
          assets: eo(k.assets, y.assets),
          canvasList: y.canvasList.length > 0 ? y.canvasList : k.canvasList
        }
      ), f.current = _, d(_), N.current = u, I(u), no(_), g(), et(r, i, C, "recovery", {
        canvasId: _
      }), !0;
    } catch (y) {
      return j.error(y instanceof Error ? y.message : "加载输出类型失败"), !1;
    } finally {
      P.current = null, R(null);
    }
  }
  async function D(u) {
    if (ne) {
      if (!await p())
        throw new Error("当前画布保存失败，未创建新画布");
      try {
        const m = await Ay({
          projectId: r,
          assetCateId: ne.id,
          name: u
        }), y = m.canvas;
        if (!y?.id) throw new Error("新画布数据为空");
        const w = Qr(y, je), _ = {
          ...L.current,
          [String(y.id)]: w
        };
        L.current = _, ie(_), tn(w), c(
          (C) => C && {
            ...C,
            canvasList: m.canvasList,
            initialCanvasId: y.id,
            initialAssetCateId: y.assetCateId
          }
        ), f.current = y.id, d(y.id), N.current = y.assetCateId, I(y.assetCateId), no(y.id), g(), J(), j.success("画布已创建");
      } catch (m) {
        throw j.error(m instanceof Error ? m.message : "创建画布失败"), m;
      }
    }
  }
  async function v(u, m) {
    try {
      const y = await Ty({ projectId: r, canvasId: u, name: m });
      c(
        (w) => w && { ...w, canvasList: y.canvasList }
      ), ie((w) => {
        const _ = w[String(u)];
        if (!_) return w;
        const C = {
          ...w,
          [String(u)]: { ..._, name: m }
        };
        return L.current = C, C;
      }), J(), j.success("画布已重命名");
    } catch (y) {
      throw j.error(y instanceof Error ? y.message : "重命名画布失败"), y;
    }
  }
  async function oe(u) {
    if (ne)
      try {
        const m = await My({
          projectId: r,
          assetCateId: ne.id,
          canvasIds: u
        });
        c(
          (y) => y && { ...y, canvasList: m.canvasList }
        );
      } catch (m) {
        throw j.error(m instanceof Error ? m.message : "调整画布顺序失败"), m;
      }
  }
  async function W(u) {
    try {
      const m = u === f.current, y = L.current[String(u)];
      y && await Yt(y);
      const w = await Dy({ projectId: r, canvasId: u });
      if (Ni(u), c(
        (_) => _ && { ..._, canvasList: w.canvasList }
      ), L.current[String(u)]) {
        const _ = { ...L.current };
        delete _[String(u)], L.current = _, ie(_);
      }
      if (m && w.activeCanvasId) {
        const _ = w.canvasList.find(
          (k) => k.id === w.activeCanvasId
        );
        let C = L.current[String(w.activeCanvasId)];
        if (!C) {
          const k = await Eo({
            projectId: r,
            canvasId: w.activeCanvasId
          });
          C = oo(
            Qr(k.canvas, je),
            k.assets
          );
          const z = {
            ...L.current,
            [String(C.id)]: C
          };
          L.current = z, ie(z), c(
            (F) => F && {
              ...F,
              assets: eo(F.assets, k.assets),
              canvasList: w.canvasList
            }
          );
        }
        tn(C), f.current = C.id, d(C.id), N.current = _?.assetCateId || C.assetCateId, I(_?.assetCateId || C.assetCateId), no(C.id), g(), i && et(
          r,
          i,
          L.current,
          "recovery",
          { canvasId: C.id }
        );
      }
      Ro(N.current), J(), j.success("画布已删除");
    } catch (m) {
      throw j.error(m instanceof Error ? m.message : "删除画布失败"), m;
    }
  }
  async function K(u) {
    try {
      if (!await p())
        throw new Error("当前画布保存失败，未恢复画布");
      const m = await Ey({ projectId: r, canvasId: u });
      if (!m.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let y = m.canvas, w = [], _ = m.canvasList, C = "";
      try {
        const F = await Eo({
          projectId: r,
          canvasId: m.canvas.id
        });
        y = F.canvas, w = F.assets, F.canvasList.length > 0 && (_ = F.canvasList);
      } catch (F) {
        C = F instanceof Error ? `画布已恢复，但资产加载失败：${F.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const k = oo(
        Qr(y, je),
        w
      ), z = {
        ...L.current,
        [String(k.id)]: k
      };
      L.current = z, ie(z), tn(k), c(
        (F) => F && {
          ...F,
          assets: eo(F.assets, w),
          canvasList: _,
          initialCanvasId: k.id,
          initialAssetCateId: k.assetCateId
        }
      ), f.current = k.id, d(k.id), N.current = k.assetCateId, I(k.assetCateId), no(k.id), U(
        (F) => F.filter((q) => q.id !== k.id)
      ), T(!1), g(), J(), i && et(r, i, z, "recovery", {
        canvasId: k.id
      }), C ? j.warning(C) : j.success("画布已恢复");
    } catch (m) {
      throw j.error(m instanceof Error ? m.message : "恢复画布失败"), m;
    }
  }
  function J() {
    const u = Number(i?.project.team_id || 0);
    $m(u > 0 ? { teamID: u } : void 0);
  }
  function we(u) {
    Or((m) => ({
      nodeId: u,
      nonce: (m?.nonce || 0) + 1
    }));
  }
  const ye = M((u) => {
    Or((m) => !m || m.nodeId !== u.nodeId || m.nonce !== u.nonce ? m : null);
  }, []);
  async function Te(u, m, y, w, _ = {}) {
    if (!It.current) {
      It.current = !0;
      try {
        const C = _.canvasId ? y[String(_.canvasId)] : void 0, k = C ? dt.current.filter(
          (be) => ra(be, C)
        ) : dt.current, z = w === "active" ? QI(k).filter(
          (be) => !lr.current.has(
            String(be.request_id || "").trim()
          )
        ) : [], F = (_.runIds || []).filter((be) => be > 0), q = F.length > 0 ? F : w === "active" ? z.map((be) => Number(be.run_id || 0)) : [];
        if (w === "active" && q.length === 0)
          return;
        const Y = w === "recovery" && q.length === 0;
        let Z = await qi({
          projectId: u,
          scope: w,
          canvasId: _.canvasId,
          runIds: q,
          summaryOnly: Y
        }), Q = oa(Z.items);
        if (Y) {
          const be = rN(Q, y);
          be.length === 0 ? Q = [] : (Z = await qi({
            projectId: u,
            scope: w,
            canvasId: _.canvasId,
            runIds: be
          }), Q = oa(Z.items));
        }
        if (w === "active" && z.length > 0) {
          const be = new Set(Q.map(In)), wn = z.filter(
            (lt) => !be.has(In(lt))
          );
          if (wn.length > 0) {
            const lt = await Promise.all(
              wn.map(async (Do) => {
                try {
                  const wp = await cl({
                    projectId: u,
                    executionId: Number(Do.execution_id || 0),
                    runId: Number(Do.run_id || 0),
                    requestId: String(Do.request_id || "")
                  });
                  return Oa(wp);
                } catch {
                  return null;
                }
              })
            );
            Q = sa(
              Q,
              lt.filter(
                (Do) => !!Do
              )
            );
          }
        }
        const Fe = sa(
          dt.current,
          Q
        );
        dt.current = Fe, Pt(Fe);
        for (const be of Object.values(y))
          yr(Q, be, m);
      } catch {
      } finally {
        It.current = !1;
      }
    }
  }
  async function He(u, m = 0) {
    if (Ur.current)
      return;
    const y = Et.current[m] || 0;
    Ur.current = !0, Br(!0), Fn("");
    try {
      const w = await qi({
        projectId: u,
        canvasId: f.current,
        scope: "history",
        beforeId: y,
        limit: 20
      });
      En(
        oa(w.items)
      ), bo(m + 1), $r(w.hasMore);
      const _ = Et.current.slice(0, m + 1);
      w.hasMore && w.beforeId > 0 && (_[m + 1] = w.beforeId), Et.current = _;
    } catch (w) {
      Fn(
        w instanceof Error ? w.message : "读取画布运行记录失败"
      );
    } finally {
      Ur.current = !1, Br(!1);
    }
  }
  const We = ae(
    () => Tf(
      Ht.filter(
        (u) => ra(u, H)
      )
    ),
    [H, Ht]
  ), wt = We.length > 0, Ln = We.some((u) => {
    const m = String(u.run.request_id || "").trim();
    return !m || !qr.has(m);
  }), Zr = wt || hf(xn);
  async function gn(u) {
    const m = !u;
    if (m && (Vr || un.size > 0) || !m && u?.some(
      (w) => un.has(In(w))
    ))
      return;
    let y = [];
    m && Lr(!0);
    try {
      let w = u || [], _ = 0, C = w.length;
      if (m) {
        const F = await Ly(
          r,
          f.current
        );
        w = F.items.map(Sn), _ = F.failedCount, C = F.count;
      } else
        w = eN(w);
      if (C === 0) {
        j.info("当前没有运行中的任务");
        return;
      }
      m || (y = w.map(In), jr((q) => {
        const Y = new Set(q);
        for (const Z of y)
          Y.add(Z);
        return Y;
      }), w = (await Promise.allSettled(
        w.map(
          (q) => Vy({
            projectId: r,
            runId: Number(q.run_id || 0),
            requestId: String(q.request_id || "")
          })
        )
      )).flatMap((q, Y) => {
        if (q.status === "rejected")
          return _ += 1, [];
        const Z = Sn(q.value);
        return [
          {
            ...w[Y],
            status: Z.status,
            error: Z.error
          }
        ];
      }));
      const k = tN(w), z = w.filter((F) => F.status === "canceled");
      if (k.size > 0) {
        const F = (/* @__PURE__ */ new Date()).toISOString(), q = (Z) => Z.map((Q) => {
          const Fe = nN(k, Q);
          return Fe ? { ...Q, status: Fe, updated_at: F } : Q;
        }), Y = q(dt.current);
        dt.current = Y, Pt(Y), En(q);
      }
      if (z.length > 0) {
        const F = new Set(
          z.flatMap((q) => {
            const Y = ri(q), Z = cs(q);
            return Z ? [...Y, Z] : Y;
          })
        );
        qe((q) => {
          if (m && _ === 0)
            return gf;
          let Y = q;
          for (const Z of F)
            Y[Z] && (Y === q && (Y = { ...q }), delete Y[Z]);
          return Y;
        }), j.success(
          z.length === 1 ? "已停止运行" : `已停止 ${z.length} 个运行`
        );
      } else _ === 0 && j.info("任务已经结束，无需停止");
      _ > 0 && j.error(
        _ === C ? "停止运行失败，请稍后重试" : `${_} 个运行停止失败，请稍后重试`
      ), dn && He(
        r,
        Math.max(0, Je - 1)
      ), window.setTimeout(() => ur.current?.(), 0);
    } catch (w) {
      j.error(w instanceof Error ? w.message : "停止画布运行失败");
    } finally {
      y.length > 0 && jr((w) => {
        const _ = new Set(w);
        for (const C of y)
          _.delete(C);
        return _;
      }), m && Lr(!1);
    }
  }
  function yn() {
    Wr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => gn()
    });
  }
  function Mo(u) {
    Wr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => gn([u])
    });
  }
  ur.current = i ? () => {
    et(
      r,
      i,
      L.current,
      "active",
      { canvasId: f.current }
    );
  } : null, ue(() => {
    if (!i || !Ln)
      return;
    const u = window.setInterval(() => {
      ur.current?.();
    }, Nf);
    return () => window.clearInterval(u);
  }, [Ln, r, i]), ue(() => {
    const u = Kr.current, m = No.current, y = [];
    if (i)
      for (const _ of We) {
        const C = _.run, k = String(C.request_id || "").trim();
        !k || qr.has(k) || y.push({
          key: `${r}:${k}`,
          canvasId: Number(C.canvas_id || f.current),
          requestId: k,
          run: C,
          managedNodeIds: _.managedNodeIds
        });
      }
    const w = new Set(y.map((_) => _.key));
    for (const [_, C] of u)
      w.has(_) || (C.controller.abort(), u.delete(_), m.delete(_));
    for (const _ of y) {
      const C = u.get(_.key);
      if (C) {
        C.managedNodeIds = _.managedNodeIds;
        for (const F of Fa(_.run))
          C.finishedNodeIds.add(F);
        continue;
      }
      const k = new AbortController(), z = {
        controller: k,
        managedNodeIds: _.managedNodeIds,
        finishedNodeIds: Fa(_.run)
      };
      u.set(_.key, z), wl({
        projectId: r,
        requestId: _.requestId,
        lastId: m.get(_.key) || "0-0",
        signal: k.signal,
        onFrame: (F) => {
          k.signal.aborted || f.current !== _.canvasId || (F.stream_id && m.set(_.key, F.stream_id), KI(
            { setRunningNode: qe, runningNodeBatcher: ge },
            F,
            z.managedNodeIds,
            z.finishedNodeIds
          ));
        }
      }).catch(() => {
        !k.signal.aborted && u.get(_.key) === z && u.delete(_.key);
      });
    }
  }, [
    qr,
    r,
    We,
    ge,
    i
  ]), ue(
    () => () => {
      for (const u of Kr.current.values())
        u.controller.abort();
      Kr.current.clear(), No.current.clear();
    },
    []
  );
  function zi(u, m, y) {
    const w = u.filter(
      (z) => ra(z, m)
    );
    if (w.length === 0)
      return;
    const _ = new Map(m.nodes.map((z) => [z.id, z])), C = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set();
    for (const z of w) {
      const F = new Set(
        ri(z).filter((Z) => k.has(Z) ? !1 : (k.add(Z), !0))
      );
      if (F.size === 0)
        continue;
      const Y = Ba(
        z,
        m
      ) ? [] : (z.node_results || []).filter((Z) => {
        const Q = Z.node_key;
        return !Q || !F.has(Q) || C.has(Q) || Ia(_.get(Q), z, Z) ? !1 : (C.add(Q), !0);
      });
      $i(
        z,
        m,
        y,
        Y,
        F
      );
    }
  }
  function $i(u, m, y, w = u.node_results || [], _) {
    const C = dN(u, m.nodes);
    if (!C)
      return;
    const k = Ki(y, m.assetCateId);
    if (!k)
      return;
    const z = {
      projectId: r,
      canvasId: m.id,
      assetCate: k,
      space: y,
      startNode: C,
      nodes: m.nodes,
      edges: m.edges,
      viewport: m.viewport,
      onNodeResult: (q, Y) => Ce(m.id, q, Y),
      onAssetCreated: ut,
      setRunningNode: qe,
      getRunningNode: (q) => or.current[q],
      requestFlowFeedback: To,
      requestNodeTitle: (q, Y) => $n(m.id, q, Y),
      canvasRun: u
    }, F = w.filter((q) => {
      const Y = uN(u, q);
      return !Y || dr.current.has(Y) ? !1 : (dr.current.add(Y), !0);
    });
    Pf(z, F), kf(z, F), ji(z, u, C), lo(z, u, _), xf(z, u, _);
  }
  function ji(u, m, y) {
    m.single_node || String(m.status || "").trim().toLowerCase() !== "success" || !vn(y.resultOutput) || Xt(
      u.canvasId,
      (w) => Zi({
        canvas: w,
        sourceNodeIds: [y.id],
        assetCate: u.assetCate,
        powers: je
      })
    );
  }
  function hn(u, m, y) {
    if (!ne)
      return null;
    const w = di(
      u,
      ne,
      H.nodes.length,
      m,
      y
    ), _ = i ? Ki(i, $a(w) || ne.id) : ne;
    u === "asset" && (w.cardinality = _.cardinality);
    const C = u === "asset" && y?.replaceSingleAssetNode ? $a(w) || Number(_.id || 0) : 0, k = C ? jd(
      H.nodes,
      H.edges,
      C,
      y?.connectFromNodeId
    ) : null, z = k ? Vd(
      H.nodes,
      H.edges,
      C,
      y?.connectFromNodeId,
      k.id
    ) : /* @__PURE__ */ new Set(), F = k?.id || w.id, q = Ut?.connection;
    if (ht((Y) => {
      let Z = Y.edges;
      const Q = C ? jd(
        Y.nodes,
        Y.edges,
        C,
        y?.connectFromNodeId
      ) : null;
      if (Q) {
        const be = Vd(
          Y.nodes,
          Y.edges,
          C,
          y?.connectFromNodeId,
          Q.id
        );
        if (Z = Y.edges.filter(
          (lt) => !be.has(lt.from) && !be.has(lt.to)
        ), q) {
          const lt = $d(
            q,
            Q.id
          );
          Z = bn(Z, lt.source, lt.target);
        } else y?.connectFromNodeId ? Z = bn(
          Z,
          y.connectFromNodeId || "",
          Q.id
        ) : y?.connectToNodeId && (Z = bn(
          Z,
          Q.id,
          y.connectToNodeId || ""
        ));
        const wn = Y.nodes.filter((lt) => !be.has(lt.id)).map(
          (lt) => lt.id === Q.id ? ca(lt, w) : lt
        );
        return {
          ...Y,
          nodes: wn,
          edges: Jt(wn, Z)
        };
      }
      if (q) {
        const be = $d(q, w.id);
        Z = bn(Z, be.source, be.target);
      } else y?.connectFromNodeId ? Z = bn(
        Z,
        y.connectFromNodeId || "",
        w.id
      ) : y?.connectToNodeId && (Z = bn(Z, w.id, y.connectToNodeId || ""));
      const Fe = ga(
        [...Y.nodes, w],
        w.id,
        { x: w.x, y: w.y }
      );
      return {
        ...Y,
        nodes: Fe,
        edges: Jt(Fe, Z)
      };
    }), k) {
      const Y = ca(k, w);
      At((Z) => {
        const Q = { ...Z };
        for (const Fe of z)
          delete Q[Fe];
        return Q[k.id] = {
          ...Q[k.id] || {},
          ...TN(Y)
        }, Q;
      });
    }
    return y?.selectCreated !== !1 && (G([F]), we(F)), Ne("create"), Kt(null), k ? ca(k, w) : w;
  }
  function Bc(u, m) {
    if (!ne)
      return;
    if (Nd(H.nodes).has(u.id)) {
      j.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const y = RN(
      u,
      ne.id,
      H.nodes.length,
      m
    );
    ht((w) => {
      const _ = ga(
        [...w.nodes, y],
        y.id,
        { x: y.x, y: y.y }
      );
      return {
        ...w,
        nodes: _,
        edges: Jt(_, w.edges)
      };
    }), At((w) => {
      const _ = w[u.id];
      return _ ? { ...w, [y.id]: _ } : w;
    }), G([y.id]), we(y.id), Kt(null), j.success("已复制节点");
  }
  function Hf(u, m = {}) {
    const y = yf(
      H.nodes,
      u
    );
    if (y.size === 0)
      return;
    const w = Nd(H.nodes);
    if (!m.allowStoryboardFrame && [...y].some((_) => w.has(_))) {
      j.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    ht((_) => {
      const C = xg(
        _.nodes,
        y
      ).filter((k) => !y.has(k.id));
      return {
        ..._,
        nodes: C,
        edges: Jt(C, _.edges)
      };
    }), At(
      (_) => Dd(_, y)
    ), qe((_) => Dd(_, y)), G([]), Or(
      (_) => _ && y.has(_.nodeId) ? null : _
    ), Tt(
      (_) => _ && y.has(_.id) ? null : _
    ), bt(
      (_) => _ && y.has(_.nodeId) ? null : _
    ), Dn(
      (_) => y.has(_) ? "" : _
    ), xe.current && y.has(xe.current.id) && (xe.current = null), j.success(
      u.length > 1 || y.size > 1 ? `已删除 ${y.size} 个节点` : "已删除节点"
    );
  }
  function zc(u, m) {
    hn("asset", m, { asset: u });
  }
  function Wf(u, m, y) {
    if (!u)
      return;
    const w = H.nodes.find((C) => C.id === u) || (y?.id === u ? y : xe.current?.id === u ? xe.current : null);
    if (!w)
      return;
    const _ = Js(m.version?.content) || kt(m.version?.content);
    Ee(
      u,
      Tr(
        {
          ...w,
          kind: m.kind || ne.kind,
          assetCateId: Number(m.asset_cate_id || ne.id || 0)
        },
        {
          output: _,
          asset: m
        },
        "引用资产"
      )
    ), Yf(u, _);
  }
  async function Yf(u, m) {
    if (!u)
      return;
    const y = H.edges.filter((w) => w.from === u).map((w) => H.nodes.find((_) => _.id === w.to)).filter(
      (w) => !!w && po(w, "display")
    );
    if (y.length !== 0)
      for (const w of y)
        Ee(
          w.id,
          Tr(w, { output: m }, "展示引用结果")
        );
  }
  function $c(u, m = an, y = xe.current) {
    if (!m) {
      zc(u);
      return;
    }
    if (!(H.nodes.find((_) => _.id === m) || (y?.id === m ? y : xe.current?.id === m ? xe.current : null))) {
      zc(u), Dn(""), xe.current = null;
      return;
    }
    Wf(m, u, y);
  }
  async function Xf(u, m = an, y = xe.current) {
    if (u.libraryType !== "material") {
      $c(
        Kn(u),
        m,
        y
      );
      return;
    }
    if (!Ss(u)) {
      j.error("该素材没有可用内容，无法引用");
      return;
    }
    const w = Number(ne?.id || 0), _ = m || `new-${Date.now()}`;
    try {
      const C = await rd({
        projectId: r,
        canvasId: H.id,
        assetCateId: w,
        name: u.name || "素材库资产",
        kind: u.kind,
        content: u.version?.content,
        nodeKey: m,
        requestId: `official-material:${u.id}:${_}`
      }), k = Kn(C);
      ut(k), $c(k, m, y);
    } catch (C) {
      j.error(
        C instanceof Error ? C.message : "引用素材库资产失败"
      );
    }
  }
  function Zf() {
    _o(!1), Dn(""), xe.current = null;
  }
  function Jf(u, m) {
    Cd(), Pn({ nodeId: u, frameIndex: m }), Kt(null), Ne("create");
  }
  async function Qf(u) {
    const m = cn;
    if (!m || Io.current)
      return;
    const y = Pe.nodes.find((z) => z.id === m.nodeId);
    if (!y) {
      j.error("宫格节点不存在");
      return;
    }
    const w = u.filter(
      (z) => z.kind === "image" && Ss(z)
    ), _ = Number.isInteger(m.frameIndex);
    if (_ && w.length === 0) {
      j.error("请选择一张图片");
      return;
    }
    if (!_ && w.length === 0) {
      j.error("请至少选择一张图片");
      return;
    }
    if (!_ && w.length > vr) {
      j.error(`一次最多导入 ${vr} 张图片`);
      return;
    }
    const C = Xa([
      y.asset?.version?.content,
      y.resultOutput
    ]), k = _ ? RI(
      C,
      Number(m.frameIndex),
      w[0],
      y.title
    ) : wf(
      w,
      C,
      y.title
    );
    if (!k) {
      j.error("当前宫格内容不可编辑");
      return;
    }
    Io.current = !0;
    try {
      const z = Number(y.asset?.id || 0), F = Number(
        y.asset?.version?.id || y.asset?.version_id || 0
      ), q = z > 0 && F > 0 ? await Ky({
        projectId: r,
        assetId: z,
        versionId: F,
        content: k
      }) : await rd({
        projectId: r,
        canvasId: H.id,
        assetCateId: Number(y.assetCateId || ne?.id || 0),
        name: k.title || y.title || "宫格图片",
        kind: "collection",
        content: k,
        nodeKey: y.id,
        requestId: `storyboard-grid-import:${y.id}:${Date.now()}`
      }), Y = Hn(
        q,
        y.asset
      );
      ut(Y), Ee(
        y.id,
        Os(y, Y)
      ), j.success(_ ? "宫格图片已替换" : "图片已导入宫格");
    } catch (z) {
      j.error(z instanceof Error ? z.message : "导入宫格图片失败");
    } finally {
      Io.current = !1;
    }
  }
  function ep(u, m) {
    hn("power", m, { power: u });
  }
  function tp(u = "") {
    xo(u);
  }
  async function Ns(u, m) {
    const { uploadSpaceFiles: y } = await import("./space-upload-CiyhICGY.js").then((C) => C.c), w = await y({
      projectID: r,
      canvasID: H.id,
      teamID: Number(i?.project.team_id || 0),
      files: u,
      onProgress: m?.onProgress
    }), _ = [];
    for (const C of w) {
      const k = Kn(C.asset);
      k.id && ut(k);
      const z = zm(C.asset);
      z.id && _.push(z);
    }
    return _;
  }
  function np(u, m) {
    hn("agent", m, { role: u });
  }
  function rp(u, m) {
    hn("flow", m, { flow: u });
  }
  function op(u) {
    hn("group", u);
  }
  function sp(u, m) {
    const y = hn("function", m, { functionOption: u });
    y && po(y, "import") && (xe.current = y, tp(y?.id || ""));
  }
  function ip(u, m, y) {
    nb(), Ne("create"), Kt({
      x: u.x,
      y: u.y,
      position: m,
      connection: y
    }), pr();
  }
  function ap() {
    xt(ve === "dark" ? "light" : "dark");
  }
  const cp = Ye((u) => {
    G(u), Kt(null);
  }), dp = Ye(ip), up = Ye(hn), lp = Ye(Bc), fp = Ye(Hf), pp = Ye(
    (u) => ht((m) => ({ ...m, nodes: u }))
  ), mp = Ye(
    (u) => ht((m) => ({ ...m, edges: u }))
  ), gp = Ye(
    (u) => ht((m) => m.nodes.length === 0 && m.edges.length === 0 ? m : { ...m, viewport: u })
  ), yp = Ye(
    Jf
  );
  if (rr)
    return null;
  if (Gt || !i || !ne)
    return /* @__PURE__ */ l("main", { className: `ws-page is-${ve} ws-loading-screen`, children: /* @__PURE__ */ l("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ l("span", { children: Gt || "创作空间不存在" }) }) });
  const {
    launcherVisible: hp,
    panelVisible: jc
  } = Ab(i.assistant.available, pe);
  return /* @__PURE__ */ O(
    "main",
    {
      ref: sr,
      className: `ws-page is-${ve} is-${_e}-view ${jc ? "is-assistant-open" : ""} ${ze ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${ce}px`
      },
      children: [
        /* @__PURE__ */ l(
          NI,
          {
            activeCate: ne,
            mode: _e,
            interactive: _e === "create",
            canvasCount: Co.length,
            activeCanvasName: H.name,
            canvasManagerOpen: X,
            onOpenCanvasManager: tt,
            nodes: Pe.nodes,
            edges: Pe.edges,
            viewport: H.viewport,
            canvasId: H.id,
            selectedNodeId: ee,
            selectedNodeIds: V,
            onSelectNodes: cp,
            onOpenNodeMenu: dp,
            onAddConfiguredNode: up,
            onCopyNode: lp,
            onDeleteNodes: fp,
            onShowNodeDetail: hs,
            detailNodeId: ct?.id || "",
            onDetailNodeProjection: Ti,
            onConfirmStoryboard: ws,
            onNodesCommit: pp,
            onEdgesCommit: mp,
            onConnectedMediaEdgeRemove: Nt,
            onViewportCommit: gp,
            focusNodeRequest: ls,
            onFocusNodeRequestConsumed: ye,
            projectId: r,
            space: i,
            canvasReferenceItems: ko,
            catalogCache: s,
            runningNodes: xn,
            setRunningNode: qe,
            onNodeResult: Ee,
            onNodeDraftChange: Yr,
            onAssetCreated: ut,
            canvasRunRecords: Ht,
            stoppingCanvasRunKeys: un,
            onStopCanvasRun: Mo,
            onRunStoryboardFrame: Oi,
            onRunFunctionNode: Bi,
            onRunBackendNode: Is,
            onOpenStoryboardGridImport: yp,
            onClearFeedbackRecords: hr,
            requestConfirm: Wr,
            onOpenFeedbackRecord: Fi
          }
        ),
        /* @__PURE__ */ l(
          wI,
          {
            space: i,
            cates: ps,
            activeCate: ne,
            canvases: Co,
            activeCanvas: H,
            saveStatus: gr[String(H.id)] || "saved",
            hasAssetCates: ms,
            loadingCateId: b,
            onBack: () => t({ to: "/bot/work" }),
            onSelectCate: x,
            onRefresh: Hr,
            onOpenRunHistory: () => {
              $e(!0), He(r, 0);
            },
            onRunHistoryIntent: cb,
            canStopRuns: Zr,
            stoppingRuns: Vr || un.size > 0,
            onStopRuns: yn,
            theme: ve,
            onToggleTheme: ap
          }
        ),
        X ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ l(
              ub,
              {
                open: !0,
                canvases: Co,
                deletedCanvases: B,
                deletedLoading: re,
                activeCanvasId: H.id,
                disabled: b != null,
                onClose: () => T(!1),
                onSelect: S,
                onCreate: D,
                onRename: v,
                onReorder: oe,
                onDelete: W,
                onRestore: K
              }
            )
          }
        ) : null,
        jc ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${ce}px`
                },
                children: /* @__PURE__ */ l(Be, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ l(
              pb,
              {
                assistant: i.assistant,
                project: i.project,
                team: i.team,
                activeAssetCateID: ne.id,
                activeCanvas: H,
                selectedNodes: ki,
                width: ce,
                expanded: ze,
                onWidthChange: Ai,
                onToggleExpanded: () => Ke((u) => !u),
                onClose: () => mn(!1),
                onFlushCanvas: Yt,
                onCanvasChanged: xi,
                onUploadAssets: Ns
              }
            )
          }
        ) : null,
        hp ? /* @__PURE__ */ l(
          Rb,
          {
            assistantName: i.assistant.name,
            onIntent: mb,
            onOpen: () => mn(!0)
          }
        ) : null,
        dn ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ l(
              ab,
              {
                open: !0,
                runs: ar,
                loading: cr,
                error: zr,
                page: Je,
                hasNextPage: Qe,
                onOpenChange: $e,
                onRefresh: () => He(r, 0),
                onPreviousPage: () => He(
                  r,
                  Math.max(0, Je - 2)
                ),
                onNextPage: () => He(r, Je),
                stoppingRunKeys: un,
                onStopRun: Mo,
                onLocateRun: (u) => {
                  const m = String(u.start_node_id || "");
                  if (!m)
                    return;
                  $e(!1), (Number(u.canvas_id || 0) ? S(Number(u.canvas_id)) : x(Number(u.asset_cate_id || h))).then((w) => {
                    w && window.requestAnimationFrame(() => we(m));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ l(
          II,
          {
            mode: _e,
            onModeIntent: (u) => {
              u === "result" && ob();
            },
            onSelectMode: (u) => {
              Ne(u), Kt(null);
            }
          }
        ),
        fs ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ l(
              Sd,
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
                validateAsset: (u) => Ss(u) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: Ns,
                onClose: Zf,
                onConfirm: (u) => {
                  const m = u[0];
                  m && Xf(m);
                }
              }
            )
          }
        ) : null,
        cn ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ l(
              Sd,
              {
                open: !0,
                teamID: i.project.team_id,
                scopeProjectID: i.project.id,
                title: Number.isInteger(cn.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(cn.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${gs} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: i.project.id,
                  canvasID: H.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(cn.frameIndex),
                maxSelection: gs,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (u) => u.kind !== "image" ? "请选择图片资产。" : Ss(u) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: Ns,
                onClose: () => Pn(null),
                onConfirm: (u) => {
                  Qf(u);
                }
              }
            )
          }
        ) : null,
        _e === "result" ? /* @__PURE__ */ l("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ l(Oe, { fallback: /* @__PURE__ */ l(Be, { label: "正在加载资产" }), children: /* @__PURE__ */ l(
          rb,
          {
            teamID: i.project.team_id,
            scopeProjectID: i.project.id,
            scopeCanvasID: H.id,
            onLocalUpload: Ns,
            initialFilters: {
              sourceType: "project",
              projectID: i.project.id,
              canvasID: H.id,
              assetCateID: ms ? ne.id : 0
            },
            headerAction: /* @__PURE__ */ l(ot, { label: "关闭资产", children: /* @__PURE__ */ O("button", { type: "button", onClick: () => Ne("create"), children: [
              /* @__PURE__ */ l(eu, { "aria-hidden": "true" }),
              /* @__PURE__ */ l("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        Se ? /* @__PURE__ */ l(
          cv,
          {
            prompt: Se.prompt,
            running: de,
            readonly: sw(
              Se,
              Pe.nodes,
              yt.current
            ),
            history: Sr(
              Pe.nodes.find(
                (u) => u.id === Se.node.id
              ) || Se.node
            ),
            activeRecordId: Se.recordId,
            onSelectRecord: (u) => {
              const m = Pe.nodes.find(
                (y) => y.id === Se.node.id
              ) || Se.node;
              Wt({
                node: m,
                recordId: u.id,
                prompt: {
                  ...u.prompt,
                  values: u.values || u.prompt.values || {}
                }
              });
            },
            onClose: Ei,
            onSubmit: Pi
          },
          `${Se.node.id}-${Se.recordId}`
        ) : null,
        Mn ? /* @__PURE__ */ l(
          vI,
          {
            request: Mn,
            onClose: () => Fr(null)
          }
        ) : null,
        vt && Ao && !si(Ao) ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载分镜确认", overlay: !0 }),
            children: /* @__PURE__ */ l(
              vb,
              {
                storyboard: Ao,
                lipSyncAvailable: Ri,
                submitting: Mt,
                portalContainer: sr.current,
                onClose: () => Tn(null),
                onEditIssue: (u) => {
                  Tn(null), hs(vt, {
                    shotId: u.shotId,
                    materialId: u.materialId
                  });
                },
                onConfirm: Mi
              }
            )
          }
        ) : null,
        Ut ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ l(
              tb,
              {
                menu: Ut,
                flows: vi,
                powers: Ci,
                powerCategories: Ii,
                roles: Si,
                onClose: () => Kt(null),
                onSelectFlow: (u) => rp(u, Ut.position),
                onSelectFunction: (u) => sp(u, Ut.position),
                onSelectGroup: () => op(Ut.position),
                onSelectRole: (u) => np(u, Ut.position),
                onSelectPower: (u) => ep(u, Ut.position)
              }
            )
          }
        ) : null,
        ct ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ l(
              hb,
              {
                projectId: i.project.id,
                teamId: i.team.id,
                assetCateId: Number(
                  ct.assetCateId || ct.asset?.asset_cate_id || ne?.id || 0
                ),
                node: ct,
                storyboardFocus: sn,
                storyboardInitialSectionId: mt,
                storyboardWorkspace: ct.storyboardWorkspace,
                canvasNodes: Pe.nodes,
                connectedMediaReferences: Of(
                  Pe.nodes,
                  Pe.edges,
                  ct.id
                ),
                canvasReferenceItems: ko.filter(
                  (u) => u.source !== "current" || u.id !== ct.id
                ),
                onNodeDraftChange: (u) => {
                  u && (Yr(ct.id, u), Tt(
                    (m) => m?.id === ct.id ? { ...m, composerDraft: u } : m
                  ));
                },
                onConnectedMediaEdgeRemove: Nt,
                onRunNode: Is,
                onAssetUpdated: (u) => _s(ct, u),
                onConfirmStoryboard: () => ws(ct.id),
                onClose: () => {
                  Tt(null), Ge(void 0), qt(void 0);
                }
              }
            )
          }
        ) : null,
        Dt ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ l(
              sb,
              {
                teamID: i.project.team_id,
                assetID: Dt.assetID,
                layer: "nested",
                onAssetChanged: Di,
                onClose: () => bt(null)
              }
            )
          }
        ) : null
      ]
    }
  );
}
function wI({
  space: e,
  cates: t,
  activeCate: n,
  canvases: r,
  activeCanvas: o,
  saveStatus: s,
  hasAssetCates: i,
  loadingCateId: c,
  onBack: a,
  onSelectCate: d,
  onRefresh: f,
  onOpenRunHistory: h,
  onRunHistoryIntent: I,
  canStopRuns: N,
  stoppingRuns: b,
  onStopRuns: R,
  theme: P,
  onToggleTheme: V
}) {
  const G = Math.max(
    0,
    t.findIndex((ee) => ee.id === n.id)
  );
  return /* @__PURE__ */ O("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ O("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: a,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ l(Hp, { size: 18 })
        }
      ),
      /* @__PURE__ */ O("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ O("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ l("strong", { children: e.project.name }),
          r.length > 1 ? /* @__PURE__ */ O("span", { className: "ws-project-canvas-name", children: [
            /* @__PURE__ */ l("i", { children: "/" }),
            o.name || "第一幕"
          ] }) : null
        ] }),
        /* @__PURE__ */ l("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    i ? /* @__PURE__ */ O(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": G
        },
        children: [
          /* @__PURE__ */ l("span", { className: "ws-cate-indicator" }),
          t.map((ee) => /* @__PURE__ */ O(
            "button",
            {
              type: "button",
              className: `ws-cate ${ee.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                d(ee.id);
              },
              children: [
                c === ee.id ? /* @__PURE__ */ l(Yn, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ l("span", { className: "ws-cate-name", children: ee.name })
              ]
            },
            ee.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ O("div", { className: `ws-top-actions ${N ? "has-running" : ""}`, children: [
      /* @__PURE__ */ l(_I, { status: s }),
      N ? /* @__PURE__ */ l(ot, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ O(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: b,
          onClick: R,
          children: [
            b ? /* @__PURE__ */ l(Yn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ l(Wp, { size: 13, fill: "currentColor" }),
            b ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ l(ot, { label: "查看画布运行记录", children: /* @__PURE__ */ O(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: I,
          onFocus: I,
          onClick: h,
          children: [
            /* @__PURE__ */ l(Yp, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ O("button", { type: "button", className: "ws-action", onClick: V, children: [
        P === "dark" ? /* @__PURE__ */ l(Xp, { size: 15 }) : /* @__PURE__ */ l(Zp, { size: 15 }),
        P === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ O("button", { type: "button", className: "ws-action", onClick: f, children: [
        /* @__PURE__ */ l(qa, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function _I({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ l(ot, { label: t, children: /* @__PURE__ */ O("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ l(Yn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ l(tu, { size: 14 }),
    t
  ] }) });
}
const bI = [
  { key: "create", label: "创作", icon: Jp },
  { key: "result", label: "资产", icon: Qp }
];
function II({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ l("nav", { className: "ws-dock", "aria-label": "画布视角", children: bI.map((r) => {
    const o = r.icon;
    return /* @__PURE__ */ O(
      "button",
      {
        type: "button",
        className: `ws-dock-button ${r.key === e ? "is-active" : ""}`,
        onPointerEnter: () => t(r.key),
        onFocus: () => t(r.key),
        onClick: () => n(r.key),
        children: [
          /* @__PURE__ */ l(o, { size: 20 }),
          r.label
        ]
      },
      r.key
    );
  }) });
}
const NI = Wd(function({
  activeCate: t,
  mode: n,
  interactive: r,
  canvasCount: o,
  activeCanvasName: s,
  canvasManagerOpen: i,
  onOpenCanvasManager: c,
  nodes: a,
  edges: d,
  viewport: f,
  canvasId: h,
  selectedNodeId: I,
  selectedNodeIds: N,
  onSelectNodes: b,
  onOpenNodeMenu: R,
  onAddConfiguredNode: P,
  onCopyNode: V,
  onDeleteNodes: G,
  onShowNodeDetail: ee,
  detailNodeId: se,
  onDetailNodeProjection: ie,
  onConfirmStoryboard: L,
  onNodesCommit: X,
  onEdgesCommit: T,
  onConnectedMediaEdgeRemove: B,
  onViewportCommit: U,
  focusNodeRequest: re,
  onFocusNodeRequestConsumed: le,
  projectId: fe,
  space: _e,
  canvasReferenceItems: Ne,
  catalogCache: pe,
  runningNodes: me,
  setRunningNode: ze,
  onNodeResult: Ke,
  onNodeDraftChange: ce,
  onAssetCreated: pt,
  canvasRunRecords: ve,
  stoppingCanvasRunKeys: xt,
  onStopCanvasRun: Ut,
  onRunStoryboardFrame: Kt,
  onRunFunctionNode: rr,
  onRunBackendNode: on,
  onOpenStoryboardGridImport: Er,
  onClearFeedbackRecords: xn,
  requestConfirm: qe,
  onOpenFeedbackRecord: or
}) {
  const [ge, ds] = $(null), [At, ct] = $(""), [Tt, An] = $(""), [Tn, sr] = $(""), [Mt, us] = $(null), [Dt, bt] = $(null), [sn, Ge] = $(""), [mt, qt] = $(null), [Mn, Fr] = $(() => /* @__PURE__ */ new Map()), [ls, Or] = $(!1), [fs, _o] = $(!1), [an, Dn] = $(1), cn = te(1), Pn = te(1), Gt = te(null), [ir, Ht] = $(null), Pt = ae(
    () => new Set(N),
    [N]
  ), ar = te(null), En = te(null), cr = te(!1), Br = te(!1), zr = te(!1), Fn = te(null), dn = te(!1), $e = te(d);
  fa(() => {
    $e.current = d;
  }, [d]);
  const Je = M((p) => {
    const g = Ir(p);
    cn.current = g, Gt.current != null && typeof window < "u" && window.cancelAnimationFrame(Gt.current), Gt.current = null, Pn.current = g, qd(ar.current, g), Dn(
      (S) => Math.abs(S - g) > 5e-3 ? g : S
    );
  }, []), bo = M((p) => {
    const g = Ir(p);
    if (cn.current = g, !(Math.abs(Pn.current - g) <= 5e-3) && Gt.current == null) {
      if (typeof window > "u") {
        Pn.current = g, Dn(g);
        return;
      }
      Gt.current = window.requestAnimationFrame(() => {
        Gt.current = null;
        const S = cn.current;
        Pn.current = S, qd(ar.current, S);
      });
    }
  }, []);
  ue(
    () => () => {
      Gt.current != null && typeof window < "u" && window.cancelAnimationFrame(Gt.current);
    },
    []
  );
  const Qe = M(
    (p, g = {}) => {
      const S = $e.current;
      $e.current = p, T(p);
      const x = new Set(
        p.filter((W) => rn(W) === "media").map((W) => {
          const K = St(W);
          return `${K.sourceNodeId}\0${K.targetNodeId}`;
        })
      ), D = /* @__PURE__ */ new Map();
      for (const W of S) {
        if (rn(W) !== "media")
          continue;
        const K = St(W), J = `${K.sourceNodeId}\0${K.targetNodeId}`;
        if (x.has(J))
          continue;
        const we = D.get(K.targetNodeId) || /* @__PURE__ */ new Set();
        we.add(K.sourceNodeId), D.set(K.targetNodeId, we);
      }
      const v = new Map(g.draftByNodeId);
      for (const [W, K] of D) {
        const J = a.find((Te) => Te.id === W), we = J?.composerDraft;
        let ye = v.get(W) || we;
        if (!(!J || !ye)) {
          for (const Te of K)
            ye = Ls(
              ye,
              Te
            );
          ye !== we ? v.set(J.id, ye) : v.delete(J.id);
        }
      }
      const oe = [...v].map(([W, K]) => ({
        nodeId: W,
        draft: K
      }));
      oe.forEach((W, K) => {
        ce(
          W.nodeId,
          W.draft,
          K === oe.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, T, ce]
  ), $r = M(
    (p) => {
      const g = Object.entries(p);
      if (g.length === 0)
        return;
      const S = new Map(g);
      let x = !1;
      const D = $e.current.map((v) => {
        if (!S.has(v.id))
          return v;
        const oe = S.get(v.id) || void 0;
        return (v.mediaUsage || void 0) === oe ? v : (x = !0, { ...v, mediaUsage: oe });
      });
      x && Qe(D);
    },
    [Qe]
  ), un = M(
    (p) => {
      const g = $e.current.filter((S) => S.id !== p);
      g.length !== $e.current.length && ($e.current = g, Ge((S) => S === p ? "" : S), B(p));
    },
    [B]
  ), jr = M(
    (p, g) => {
      const S = $e.current, x = S.filter((oe) => {
        const W = St(oe);
        return !(rn(oe) === "media" && W.sourceNodeId === p && W.targetNodeId === g);
      });
      if (x.length !== S.length) {
        Ge(""), Qe(x);
        return;
      }
      const D = a.find((oe) => oe.id === g);
      if (!D?.composerDraft)
        return;
      const v = Ls(
        D.composerDraft,
        p
      );
      v !== D.composerDraft && ce(g, v, { save: "immediate" });
    },
    [Qe, a, ce]
  ), Vr = M(
    (p, g) => {
      if (sr(""), !r)
        return;
      const S = Sh(a, p, g);
      S !== a && X(S);
    },
    [r, a, X]
  ), Lr = M(
    (p, g) => {
      if (sr(""), !r)
        return;
      const S = Ch(a, p, g);
      S !== a && X(S);
    },
    [r, a, X]
  ), Se = te({
    onNodeResult: Ke,
    onNodeDraftChange: ce,
    onAssetCreated: pt,
    onRunFunctionNode: rr,
    onOpenStoryboardGridImport: Er,
    onClearFeedbackRecords: xn,
    onOpenFeedbackRecord: or,
    onShowNodeDetail: ee,
    onConfirmStoryboard: L,
    requestConfirm: qe,
    onRunBackendNode: on,
    onConnectedMediaUsagesChange: $r,
    onConnectedMediaEdgeRemove: un,
    onTextParamConnectionRemove: jr,
    onNodeResizeStart: sr,
    onNodeResizeEnd: Vr,
    onResultViewResizeEnd: Lr
  });
  fa(() => {
    Se.current = {
      onNodeResult: Ke,
      onNodeDraftChange: ce,
      onAssetCreated: pt,
      onRunFunctionNode: rr,
      onOpenStoryboardGridImport: Er,
      onClearFeedbackRecords: xn,
      onOpenFeedbackRecord: or,
      onShowNodeDetail: ee,
      onConfirmStoryboard: L,
      requestConfirm: qe,
      onRunBackendNode: on,
      onConnectedMediaUsagesChange: $r,
      onConnectedMediaEdgeRemove: un,
      onTextParamConnectionRemove: jr,
      onNodeResizeStart: sr,
      onNodeResizeEnd: Vr,
      onResultViewResizeEnd: Lr
    };
  }, [
    pt,
    xn,
    ce,
    Ke,
    or,
    Er,
    on,
    rr,
    ee,
    L,
    un,
    jr,
    qe,
    Vr,
    Lr,
    $r
  ]);
  const Wt = ae(
    () => ({
      onNodeResult: (p, g) => Se.current.onNodeResult(p, g),
      onNodeDraftChange: (p, g, S) => Se.current.onNodeDraftChange(p, g, S),
      onAssetCreated: (p) => Se.current.onAssetCreated(p),
      onRunFunctionNode: (p) => Se.current.onRunFunctionNode(p),
      onOpenStoryboardGridImport: (p, g) => Se.current.onOpenStoryboardGridImport(p, g),
      onClearFeedbackRecords: (p) => Se.current.onClearFeedbackRecords(p),
      onOpenFeedbackRecord: (p, g) => Se.current.onOpenFeedbackRecord(p, g),
      onShowNodeDetail: (p, g, S) => Se.current.onShowNodeDetail(
        p,
        g,
        S
      ),
      onConfirmStoryboard: (p) => Se.current.onConfirmStoryboard(p),
      requestConfirm: (p) => Se.current.requestConfirm(p),
      onRunBackendNode: (p, g) => Se.current.onRunBackendNode(p, g),
      onConnectedMediaUsagesChange: (p) => Se.current.onConnectedMediaUsagesChange(p),
      onConnectedMediaEdgeRemove: (p) => Se.current.onConnectedMediaEdgeRemove(p),
      onTextParamConnectionRemove: (p, g) => Se.current.onTextParamConnectionRemove(
        p,
        g
      ),
      onNodeResizeStart: (p) => Se.current.onNodeResizeStart(p),
      onNodeResizeEnd: (p, g) => Se.current.onNodeResizeEnd(p, g),
      onResultViewResizeEnd: (p, g) => Se.current.onResultViewResizeEnd(p, g)
    }),
    []
  ), de = ae(
    () => kN(a, d),
    [d, a]
  ), On = ae(
    () => P_(
      a,
      (p) => de.hasResultByNodeId.get(p.id) || !1
    ),
    [de.hasResultByNodeId, a]
  ), xe = On.frames, Io = ae(
    () => new Map(xe.map((p) => [p.id, p])),
    [xe]
  ), gt = ae(
    () => new Map(xe.map((p) => [p.sourceNodeId, p])),
    [xe]
  ), dr = ae(
    () => new Map(
      xe.map((p) => [
        p.id,
        jl(
          p,
          a,
          (g) => de.hasResultByNodeId.get(g.id) || !1,
          de.nodeById
        )
      ])
    ),
    [
      de.hasResultByNodeId,
      de.nodeById,
      a,
      xe
    ]
  ), ln = ae(() => {
    const p = /* @__PURE__ */ new Map();
    for (const g of ve) {
      if (!cs(g))
        continue;
      const S = Number(g.canvas_id || 0);
      if (S > 0 && S !== h)
        continue;
      const x = String(g.start_node_id || "").trim();
      x && !p.has(x) && p.set(x, g);
    }
    return p;
  }, [h, ve]), dt = ae(() => {
    const p = /* @__PURE__ */ new Map();
    for (const g of ve) {
      const S = Number(g.canvas_id || 0);
      if (!Un(g) || S > 0 && S !== h)
        continue;
      const x = String(g.start_node_id || "").trim();
      x && !p.has(x) && p.set(x, g);
    }
    return p;
  }, [h, ve]), It = On.sourceNodeIds, Ur = On.sourceNodeIdByNodeId, Et = ae(
    () => new Set(
      xe.flatMap(
        (p) => p.memberNodeIds.filter(
          (g) => g !== p.sourceNodeId
        )
      )
    ),
    [xe]
  ), ur = Ye(
    (p, g) => {
      const S = Io.get(p), x = dr.get(p);
      if (!S || !x)
        return;
      const D = x.pendingNodeIds.length, v = Math.max(0, S.workNodeCount - D);
      qe({
        title: `执行“${S.title}”制作区？`,
        description: `将执行 ${D} 个待处理节点${v > 0 ? `，跳过 ${v} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => Kt(g)
      });
    }
  ), Kr = Ye(
    (p) => {
      const g = ln.get(p);
      g && Un(g) && Ut(g);
    }
  ), No = Ye((p) => {
    const g = de.nodeById.get(p);
    g && Kf({
      group: g,
      sourceNode: g,
      members: de.groupMembersById.get(p) || Fs,
      setRunningNode: ze,
      runNode: on
    });
  }), lr = Ye((p) => {
    const g = de.nodeById.get(p);
    g && on(g).catch(
      (S) => j.error(S instanceof Error ? S.message : "节点运行失败")
    );
  }), qr = Ye((p) => {
    const g = dt.get(p);
    g && Ut(g);
  }), vo = Ye((p) => {
    const g = de.nodeById.get(p);
    g && ee(g);
  }), en = ae(
    () => a.map((p) => p.id).join("\0"),
    [a]
  ), fr = ae(
    () => new Set(
      en ? en.split("\0") : []
    ),
    [en]
  ), yt = ae(
    () => en ? `${t.id}:${en}` : "",
    [t.id, en]
  ), So = ae(
    () => hf(me),
    [me]
  ), je = Ye(
    (p, g) => /* @__PURE__ */ l(Ac.Provider, { value: !0, children: /* @__PURE__ */ l(qf, { data: p, selected: g }) })
  ), Ii = ae(() => {
    const p = (v) => de.hasResultByNodeId.get(v.id) || !1, g = (v, oe = !1) => {
      const K = !oe && Pt.has(v.id) && N.length === 1 && Va(v), J = v.type === "power" ? Jn(v.power, v.kind, v.outputType).viewMode : "", we = oe || K, ye = we ? _e : null, Te = we || J === "storyboard" || J === "video_compose" ? Ne : rI, He = (oe || J === "video_compose" || K) && de.incomingMediaReferencesByNodeId.get(v.id) || Td, We = It.has(v.id), wt = Ur.get(v.id) || "", Ln = wt && de.nodeById.get(wt) || null, Zr = wt ? ln.get(wt) : void 0, gn = !!(wt && (Zr && Un(Zr) || _t(
        me[pi(wt)]
      ))), yn = me[v.id] || null, Mo = v.type === "group" && de.groupMembersById.get(v.id) || Fs, zi = v.type === "group" ? uc({
        members: Mo,
        runningNodes: me,
        groupState: yn,
        hasResult: p
      }) : null, $i = bi(v) ? So : !1, ji = de.inputContextByNodeId.get(v.id) || null, hn = gn ? "制作区正在执行" : de.runBlockedReasonByNodeId.get(v.id) || "";
      return {
        ...v,
        sourceNode: v,
        projectId: fe,
        canvasId: h,
        space: ye,
        catalogCache: pe,
        runningNode: yn,
        groupMembers: Mo,
        groupRuntime: zi,
        canvasHasRunningNode: $i,
        canvasReferenceItems: Te,
        connectedMediaReferences: He,
        interactive: r,
        structureLocked: We,
        storyboardSourceNode: Ln,
        storyboardFrameRunning: gn,
        runBlockedReason: hn,
        showNodeSettings: K,
        ...oe ? { embedded: !0 } : {},
        setRunningNode: ze,
        ...Wt,
        inputContext: ji
      };
    }, S = (v) => {
      const oe = dr.get(v.id), W = ln.get(
        v.sourceNodeId
      ), K = W && Un(W) ? W : void 0, J = !!K || _t(me[v.id]), we = v.memberNodeIds.some(
        (We) => _t(me[We])
      ), ye = J ? "" : we ? "制作区内有节点正在执行" : oe?.blockedReason || "", Te = WI(
        v,
        K,
        me,
        de.nodeById
      ) || (J ? "准备执行" : ""), He = !!(K && xt.has(In(K)));
      return {
        frameId: v.id,
        sourceNodeId: v.sourceNodeId,
        groupCount: v.groupCount + Number(
          v.workNodeIds.some(
            (We) => de.nodeById.get(We)?.storyboardItem?.itemType === "video_compose"
          )
        ),
        workNodeCount: v.workNodeCount,
        completedCount: v.completedCount,
        running: J,
        stopping: He,
        executionStatus: YI(
          W,
          me[v.id],
          He
        ),
        currentNodeTitle: Te,
        runBlockedReason: ye,
        groups: XI({
          frame: v,
          nodeById: de.nodeById,
          groupMembersById: de.groupMembersById,
          runBlockedReasonByNodeId: de.runBlockedReasonByNodeId,
          runningNodes: me,
          frameRunning: J,
          activeRunByStartNodeId: dt,
          stoppingCanvasRunKeys: xt,
          hasResult: p,
          onRunGroup: No,
          onRunNode: lr,
          onStopRun: qr,
          onOpenNode: vo,
          projectNode: (We) => g(We, !0)
        }),
        renderNode: je,
        onRun: () => ur(v.id, v.sourceNodeId),
        onStop: K ? () => Kr(v.sourceNodeId) : void 0
      };
    }, x = (v) => {
      const oe = { x: v.x, y: v.y }, W = Pt.has(v.id), K = g(v), J = gt.get(v.id);
      J && (K.storyboardWorkspace = S(J));
      const we = v.type === "group" ? 1 : v.groupId ? 3 : 2, ye = Uf(v);
      return {
        id: v.id,
        type: "workSpace",
        position: oe,
        data: K,
        selected: W,
        className: `ws-flow-node ws-flow-node-${v.type}`,
        draggable: r && (!K.structureLocked || !!J),
        deletable: !K.structureLocked,
        zIndex: we,
        ...ZN(ye)
      };
    };
    return a.filter((v) => !Et.has(v.id)).map(x);
  }, [
    dt,
    de,
    ln,
    Et,
    r,
    It,
    a,
    h,
    fe,
    me,
    N.length,
    Pt,
    ze,
    _e,
    pe,
    Ne,
    So,
    No,
    lr,
    ur,
    je,
    vo,
    qr,
    Kr,
    Wt,
    gt,
    dr,
    Ur,
    xt
  ]), fn = bh(
    Ii,
    _v
  ), pr = ae(() => {
    if (se)
      for (const p of fn) {
        const g = p.data;
        if (g.id === se) return g;
        for (const S of g.storyboardWorkspace?.groups || []) {
          const x = S.results.find(
            (D) => D.nodeId === se
          );
          if (x) return x.node;
        }
      }
  }, [se, fn]);
  ue(() => {
    pr && ie(pr);
  }, [ie, pr]);
  const { flowNodes: Bn, setFlowNodes: pn } = _h(
    fn,
    Tt || Tn
  ), mr = M(
    (p) => {
      r && (Ge(""), Qe(d.filter((g) => g.id !== p)));
    },
    [Qe, d, r]
  ), Gr = M(
    (p) => {
      !r || !d.some((g) => g.id === p) || qe({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => mr(p)
      });
    },
    [mr, d, r, qe]
  ), zn = M(
    (p) => {
      if (!r || p.length === 0)
        return;
      const g = yf(a, p);
      if (g.size === 0)
        return;
      if ([...g].some(
        (D) => It.has(D)
      )) {
        j.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const S = p.length === 1 ? p[0] : null, x = p.some((D) => D.type === "group");
      qe({
        title: S ? `删除「${S.title}」` : `删除 ${g.size} 个节点`,
        description: x ? "会同时删除组内节点，并移除与这些节点相连的连线。" : S ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          Ge(""), G(p);
        }
      });
    },
    [
      r,
      It,
      a,
      G,
      qe
    ]
  ), Yt = M(
    (p, g = []) => {
      if (!r || p.length === 0)
        return;
      const S = new Set(
        p.flatMap((K) => K.memberNodeIds)
      ), x = /* @__PURE__ */ new Set([
        ...S,
        ...g.map((K) => K.id)
      ]), D = a.filter((K) => x.has(K.id));
      if (D.length === 0)
        return;
      const v = p.length === 1 && g.every((K) => S.has(K.id)) ? p[0] : null, oe = D.filter(
        (K) => K.type === "group"
      ).length, W = D.length - oe;
      qe({
        title: v ? `删除「${v.title}」制作区` : `删除 ${D.length} 个节点`,
        description: v ? `将删除其中 ${oe} 个分组和 ${W} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          Ge(""), G(D, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, a, G, qe]
  ), tn = ae(
    () => d.filter(
      (p) => fr.has(p.from) && fr.has(p.to) && !Et.has(p.from) && !Et.has(p.to)
    ).map((p) => {
      const g = St(p), S = de.nodeById.get(
        g.sourceNodeId
      ), x = de.nodeById.get(
        g.targetNodeId
      ), D = Li(
        x?.composerDraft,
        g.sourceNodeId,
        Mn.get(g.targetNodeId)
      ), v = !!(rn(p) === "media" && x?.type === "power" && x.power && (D || Jr(S))), oe = Mn.get(
        g.targetNodeId
      ), W = v && x && oe ? ea(
        x,
        oe,
        g.sourceNodeId
      ) : void 0, K = ks(x), J = v ? bg(
        D,
        W,
        K
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
          purpose: rn(p),
          executionMode: p.executionMode,
          mediaUsage: p.mediaUsage,
          bindingLabel: J?.label,
          bindingInteractive: J?.interactive,
          bindingShowChevron: J?.showChevron,
          bindingInvalid: J?.invalid
        }
      };
    }),
    [
      Mn,
      fr,
      de.nodeById,
      d,
      Et
    ]
  );
  ue(() => {
    if (!ge || !yt || re || f.zoom != null || typeof window > "u")
      return;
    const p = setTimeout(() => {
      ge.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(p);
  }, [yt, ge, re, f.zoom]), ue(() => {
    if (!ge || !re || typeof window > "u")
      return;
    const p = a.find(
      (D) => D.id === re.nodeId
    );
    if (!p) {
      le(re);
      return;
    }
    const g = Et.has(p.id) ? xe.find(
      (D) => D.memberNodeIds.includes(p.id)
    ) : void 0, S = g && a.find((D) => D.id === g.sourceNodeId) || p, x = window.setTimeout(() => {
      const D = { x: S.x, y: S.y }, v = S.type === "power" ? 1.02 : 0.96;
      ge.setCenter?.(
        D.x + (S.width || 180) / 2,
        D.y + (S.height || 180) / 2,
        { zoom: v, duration: 320 }
      ), Je(v), le(re);
    }, 80);
    return () => window.clearTimeout(x);
  }, [
    ge,
    Je,
    re,
    Et,
    a,
    le,
    xe
  ]);
  const Ni = M(
    (p) => {
      if (!r)
        return;
      const g = p.map((D) => {
        if (D.type !== "position" || !D.position)
          return D;
        const v = Vi(
          a,
          D.id,
          D.position
        );
        return v === D.position ? D : {
          ...D,
          position: v,
          ...D.positionAbsolute ? { positionAbsolute: v } : {}
        };
      });
      pn((D) => Mp(g, D));
      const S = new Set(N);
      let x = !1;
      for (const D of p)
        D.type === "select" && (x = !0, D.selected ? (S.delete(D.id), S.add(D.id)) : S.delete(D.id));
      x && b([...S]);
    },
    [r, a, b, N, pn]
  ), nn = M(
    (p) => {
      const g = Number(p.composerDraft?.selectedTargetId || 0), S = Number(
        _e.release?.id || _e.project.release_id || 0
      );
      return pe.loadPowerForm(
        {
          projectId: fe,
          releaseId: S,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        },
        () => Oy({
          projectId: fe,
          flowId: Number(p.flow?.id || 0),
          powerId: Number(p.power?.id || 0),
          powerKey: p.power?.key || "",
          targetId: g
        })
      );
    },
    [pe, fe, _e.project.release_id, _e.release?.id]
  ), gr = ae(() => {
    const p = new Set(
      d.flatMap((g) => {
        if (rn(g) !== "media")
          return [];
        const S = St(g), x = de.nodeById.get(
          S.sourceNodeId
        ), D = de.nodeById.get(
          S.targetNodeId
        );
        return D?.type === "power" && D.power && Jr(x) ? [D.id] : [];
      })
    );
    for (const g of a)
      g.type === "power" && g.power && (Object.keys(g.composerDraft?.paramBindings || {}).length > 0 || g.composerDraft?.storyboardLyricsSourceNodeId) && p.add(g.id);
    return a.filter((g) => p.has(g.id));
  }, [de.nodeById, d, a]);
  ue(() => {
    if (gr.length === 0)
      return;
    let p = !1;
    return Promise.all(
      gr.map(
        async (g) => {
          try {
            const S = await nn(g);
            return [g.id, S.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((g) => {
      p || Fr(
        new Map(
          g.filter(
            (S) => !!S
          )
        )
      );
    }), () => {
      p = !0;
    };
  }, [nn, gr]);
  const et = M(
    (p, g, S) => {
      const x = a.some((W) => W.id === p), D = a.find((W) => W.id === g);
      if (!x || !D) {
        j.info("节点已变化，请重新连接");
        return;
      }
      const v = kr(D);
      if (!wg(
        v,
        S,
        p
      )) {
        j.info("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const oe = Cg(
        v,
        p,
        S
      );
      Qe(
        Jt(
          a,
          bn($e.current, p, g)
        ),
        oe !== v ? { draftByNodeId: /* @__PURE__ */ new Map([[D.id, oe]]) } : void 0
      );
    },
    [Qe, a]
  ), yr = M(
    (p, g) => {
      const S = a.find((K) => K.id === p), x = a.find((K) => K.id === g);
      if (!x || !Jr(S) || !ks(x)) {
        j.info("节点已变化，请重新连接");
        return;
      }
      const D = kr(x), v = String(
        D.storyboardLyricsSourceNodeId || ""
      ).trim(), oe = kg(
        D,
        p
      ), W = $e.current.filter((K) => {
        if (!v || v === p || rn(K) !== "media")
          return !0;
        const J = St(K);
        return !(J.sourceNodeId === v && J.targetNodeId === g);
      });
      W.length !== $e.current.length && Ge(""), Qe(
        Jt(
          a,
          bn(W, p, g)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[x.id, oe]]) }
      );
    },
    [Qe, a]
  );
  ue(() => {
    for (const p of gr) {
      const g = Mn.get(p.id);
      if (!g)
        continue;
      const S = d.flatMap((D) => {
        if (rn(D) !== "media")
          return [];
        const v = St(D);
        if (v.targetNodeId !== p.id)
          return [];
        const oe = de.nodeById.get(
          v.sourceNodeId
        );
        return p.composerDraft?.storyboardLyricsSourceNodeId === v.sourceNodeId ? [] : Jr(oe) ? [v.sourceNodeId] : [];
      }), x = Ig(
        S,
        p.composerDraft,
        If(p, g)
      );
      x && et(
        x.sourceNodeId,
        p.id,
        x.targetParamKey
      );
    }
  }, [
    Mn,
    de.nodeById,
    et,
    d,
    gr
  ]);
  const Hr = M(
    async (p) => {
      if (!r)
        return;
      const g = $e.current.find(
        (W) => W.id === p
      );
      if (!g)
        return;
      const { sourceNodeId: S, targetNodeId: x } = St(g), D = a.find((W) => W.id === S), v = a.find((W) => W.id === x), oe = Li(
        v?.composerDraft,
        S
      );
      if (!(v?.type !== "power" || !v.power || !oe && !Jr(D)))
        try {
          const W = await nn(v), K = ea(
            v,
            W.params || [],
            S
          ), J = Li(
            v.composerDraft,
            S,
            W.params || []
          ), we = ks(v);
          if (Fr((Te) => {
            const He = new Map(Te);
            return He.set(x, W.params || []), He;
          }), Ge(p), we) {
            qt({
              sourceNodeId: S,
              targetNodeId: x,
              sourceTitle: D?.title || "上游节点",
              targetTitle: v.title || v.power.name,
              params: K,
              selectedParamKey: J?.purpose === "param" ? J.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: J?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const ye = ya(K);
          if (ye.kind === "unavailable") {
            j.info("当前能力没有可用的文本参数");
            return;
          }
          if (ye.kind === "automatic") {
            J?.targetParamKey !== ye.targetParamKey && et(
              S,
              x,
              ye.targetParamKey
            );
            return;
          }
          qt({
            sourceNodeId: S,
            targetNodeId: x,
            sourceTitle: D?.title || "上游节点",
            targetTitle: v.title || v.power.name,
            params: ye.params,
            selectedParamKey: J?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (W) {
          j.error(
            W instanceof Error ? W.message : "参数列表加载失败"
          );
        }
    },
    [et, r, nn, a]
  ), Wr = M(
    (p) => {
      Hr(p);
    },
    [Hr]
  ), st = ae(() => {
    const p = de.highlightedPathEdgesByNodeId.get(I) || Md, g = de.highlightedPathEdgesByNodeId.get(At) || Md, S = /* @__PURE__ */ new Set([
      ...p,
      ...g
    ]), x = p.size > 0 ? I : g.size > 0 ? At : "";
    return tn.map((D) => {
      const v = LN(
        D,
        de.nodeById,
        At,
        I,
        sn,
        S,
        x
      ), oe = UN(D, v);
      return {
        ...oe,
        data: {
          ...oe.data,
          onDelete: Gr,
          onEditBinding: Wr
        }
      };
    });
  }, [
    tn,
    de,
    At,
    Gr,
    Wr,
    sn,
    I
  ]), ps = ae(
    () => [...st, ...Mt ? [Mt] : []],
    [st, Mt]
  ), ms = M(
    (p) => {
      if (!r)
        return;
      let g = "", S = !1;
      for (const v of p)
        v.type === "select" && (S = !0, v.selected && (g = v.id));
      S && Ge(g);
      const x = p.filter(
        (v) => v.type !== "select"
      );
      if (x.length === 0)
        return;
      const D = Dp(x, st);
      Qe(
        Gm(
          $e.current,
          new Set(st.map((v) => v.id)),
          MN(D)
        )
      );
    },
    [Qe, st, r]
  ), ne = M(
    async (p, g) => {
      if ($e.current.some((J) => {
        const we = St(J);
        return we.sourceNodeId === p && we.targetNodeId === g;
      }))
        return;
      const x = a.find((J) => J.id === g), D = a.find((J) => J.id === p), oe = Mu(a, p).filter(Qa);
      let W, K;
      if (x?.type === "power" && x.power && oe.length > 0)
        try {
          const we = (await nn(x)).params || [], ye = kr(x), Te = Of(
            a,
            $e.current,
            g
          ), He = Ru(
            we,
            ye
          ), We = Lm(
            we,
            He,
            [
              ...Te.map((yn) => yn.source),
              ...oe
            ]
          ), wt = Um({
            node: x,
            content: ye.promptContent,
            items: Ne,
            connections: Te,
            params: we,
            values: We,
            requestedMode: ye.multiImageMode,
            additionalSources: oe
          }), Ln = wt.active ? wt.mode : void 0;
          if (wt.error) {
            j.error(wt.error);
            return;
          }
          const Zr = Km(
            ku(we, We)
          ), gn = qm(
            Te,
            Zr,
            oe,
            ye.promptContent,
            Ne,
            Ln
          );
          if (gn.error) {
            j.error(gn.error);
            return;
          }
          if (W = gn.usage, wt.active && Ln) {
            const yn = cc({
              ...ye,
              paramValues: We,
              multiImageMode: Ln
            });
            td(yn) !== td(ye) && (K = yn);
          }
        } catch (J) {
          j.error(
            J instanceof Error ? `媒体用途加载失败，未建立连线：${J.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      else if (x?.type === "power" && x.power && Jr(D))
        try {
          const J = await nn(x), we = ea(
            x,
            J.params || [],
            p
          ), ye = ks(x);
          if (Fr((He) => {
            const We = new Map(He);
            return We.set(g, J.params || []), We;
          }), ye) {
            qt({
              sourceNodeId: p,
              targetNodeId: g,
              sourceTitle: D?.title || "上游节点",
              targetTitle: x.title || x.power.name,
              params: we,
              lyricsAvailable: !0,
              lyricsSelected: !1,
              editing: !1
            });
            return;
          }
          const Te = ya(we);
          if (Te.kind === "unavailable") {
            j.info("当前能力没有可用的文本参数，未建立连线");
            return;
          }
          if (Te.kind === "automatic") {
            et(
              p,
              g,
              Te.targetParamKey
            );
            return;
          }
          qt({
            sourceNodeId: p,
            targetNodeId: g,
            sourceTitle: D?.title || "上游节点",
            targetTitle: x.title || x.power.name,
            params: Te.params,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !1
          });
          return;
        } catch (J) {
          j.error(
            J instanceof Error ? `参数列表加载失败，未建立连线：${J.message}` : "参数列表加载失败，未建立连线"
          );
          return;
        }
      x && K && ce(x.id, K), Qe(
        Jt(
          a,
          bn(
            $e.current,
            p,
            g,
            W
          )
        )
      );
    },
    [
      Ne,
      et,
      Qe,
      nn,
      a,
      ce
    ]
  ), vi = M(
    (p) => {
      const g = mt;
      g && (qt(null), et(
        g.sourceNodeId,
        g.targetNodeId,
        p
      ));
    },
    [et, mt]
  ), Si = M(() => {
    const p = mt;
    p?.lyricsAvailable && (qt(null), yr(
      p.sourceNodeId,
      p.targetNodeId
    ));
  }, [yr, mt]), Ci = M(() => {
    qt(null);
  }, []), Ri = M(
    (p) => {
      r && (cr.current = !0, !(!p.source || !p.target || p.source === p.target) && ne(
        p.source || "",
        p.target || ""
      ));
    },
    [ne, r]
  ), H = M(
    (p, g) => {
      if (!r)
        return;
      const S = String(g?.nodeId || "");
      S && (zr.current = !0, b([]), bt(null)), En.current = S ? {
        nodeId: S,
        handleId: g?.handleId || null,
        handleType: g?.handleType || null
      } : null, cr.current = !1, Ge("");
    },
    [r, b]
  ), Co = M(
    (p) => {
      if (!r) {
        En.current = null, cr.current = !1;
        return;
      }
      const g = En.current;
      if (En.current = null, g?.nodeId && typeof window < "u" && window.setTimeout(() => {
        zr.current = !1;
      }, 0), cr.current) {
        cr.current = !1;
        return;
      }
      if (!g?.nodeId)
        return;
      const S = GN(p);
      S && (Br.current = !0, R(
        S,
        zo(ge, S),
        g
      ));
    },
    [ge, r, R]
  ), Ro = M(
    (p, g) => {
      r && (p.preventDefault(), p.stopPropagation(), bt(null), b([]), Ge(g.id));
    },
    [r, b]
  );
  ue(() => {
    if (!sn || typeof window > "u")
      return;
    function p(g) {
      !r || !Ld(g) || (g.preventDefault(), Gr(sn));
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [r, Gr, sn]), ue(() => {
    if (N.length === 0 || sn || typeof window > "u")
      return;
    function p(g) {
      if (!r || !Ld(g))
        return;
      const S = a.filter(
        (D) => Pt.has(D.id)
      ), x = N.map((D) => gt.get(D)).filter((D) => !!D);
      if (!(S.length === 0 && x.length === 0)) {
        if (g.preventDefault(), x.length > 0) {
          Yt(x, S);
          return;
        }
        zn(S);
      }
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [
    r,
    a,
    zn,
    Yt,
    sn,
    N.length,
    N,
    Pt,
    gt
  ]);
  const tt = M((p) => {
    us(
      (g) => jN(g, p) ? g : p
    );
  }, []), Pe = M(
    (p) => {
      if (!r)
        return !1;
      const g = a.find(
        (x) => x.id === p.source
      ), S = a.find(
        (x) => x.id === p.target
      );
      return za(g, S);
    },
    [r, a]
  ), ki = M(
    (p, g) => {
      if (!r)
        return;
      if (gt.has(g.id)) {
        tt(null);
        return;
      }
      if (It.has(g.id)) {
        tt(null);
        return;
      }
      const S = a.find((K) => K.id === g.id);
      if (!S) {
        tt(null);
        return;
      }
      const x = Vi(
        a,
        g.id,
        g.position
      ), D = x === g.position ? g : { ...g, position: x };
      if (S.type === "group") {
        const K = g.position.x - S.x, J = g.position.y - S.y;
        pn(
          (we) => we.map((ye) => {
            const Te = a.find((He) => He.id === ye.id);
            return Te?.groupId !== S.id ? ye : {
              ...ye,
              position: {
                x: Te.x + K,
                y: Te.y + J
              }
            };
          })
        ), tt(null);
        return;
      }
      if (st.some(
        (K) => K.source === g.id || K.target === g.id
      )) {
        tt(null);
        return;
      }
      const oe = VN(
        D,
        Bn,
        a
      );
      if (!oe) {
        tt(null);
        return;
      }
      const W = zN(
        S,
        oe.domainNode
      );
      if (!W) {
        tt(null);
        return;
      }
      tt($N(W));
    },
    [
      st,
      Bn,
      r,
      It,
      a,
      pn,
      gt,
      tt
    ]
  ), xi = M(
    (p, g) => {
      if (!r) {
        An(""), tt(null);
        return;
      }
      if (gt.has(g.id)) {
        const v = Yc(
          a,
          g.id,
          g.position
        );
        v !== a && X(v), An(""), tt(null);
        return;
      }
      if (It.has(g.id)) {
        An(""), tt(null);
        return;
      }
      const S = a.find((v) => v.id === g.id);
      let x = !1;
      if (S) {
        const v = Vi(
          a,
          g.id,
          g.position
        ), oe = Yc(a, g.id, v), W = ga(
          oe,
          g.id,
          v
        );
        x = (S.groupId || "") !== (W.find((J) => J.id === S.id)?.groupId || ""), W !== a && X(W);
        const K = Jt(W, d);
        jf(d, K) || Qe(K);
      }
      if (An(""), x) {
        tt(null);
        return;
      }
      if (!Mt) {
        tt(null);
        return;
      }
      st.some(
        (v) => v.source === Mt.source && v.target === Mt.target
      ) || ne(
        Mt.source,
        Mt.target
      ), tt(null);
    },
    [
      d,
      ne,
      Qe,
      st,
      r,
      It,
      X,
      a,
      Mt,
      gt,
      tt
    ]
  ), Ai = M(
    (p) => {
      !r || p.button !== 2 || (dn.current = !1, iI(p.target) && (Fn.current = {
        pointerId: p.pointerId,
        start: { x: p.clientX, y: p.clientY },
        baseNodeIds: p.ctrlKey || p.metaKey ? [...N] : [],
        moved: !1,
        contextMenuHandled: !1
      }, p.preventDefault(), p.stopPropagation(), p.currentTarget.setPointerCapture?.(p.pointerId)));
    },
    [r, N]
  ), mn = M(
    (p) => {
      R(p, zo(ge, p));
    },
    [ge, R]
  ), gs = M(
    (p) => {
      const g = Fn.current;
      !r || !g && !dn.current || (p.preventDefault(), p.stopPropagation(), dn.current = !1, g && (g.contextMenuHandled = !0));
    },
    [r]
  ), ys = M(
    (p) => {
      const g = Fn.current;
      if (!g || g.pointerId !== p.pointerId || !ge || !ar.current)
        return;
      const S = p.clientX - g.start.x, x = p.clientY - g.start.y;
      if (!g.moved && Math.hypot(S, x) < 5)
        return;
      g.moved = !0, p.preventDefault(), p.stopPropagation();
      const D = ar.current.getBoundingClientRect();
      Ht(
        aI(
          g.start,
          {
            x: p.clientX,
            y: p.clientY
          },
          D
        )
      );
      const v = cI(
        a,
        zo(ge, g.start),
        zo(ge, {
          x: p.clientX,
          y: p.clientY
        })
      );
      b(dI(g.baseNodeIds, v)), Ge(""), bt(null);
    },
    [ge, a, b]
  ), ko = M(
    (p) => {
      const g = Fn.current;
      !g || g.pointerId !== p.pointerId || (Fn.current = null, p.currentTarget.hasPointerCapture?.(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId), Ht(null), dn.current = !g.contextMenuHandled, p.preventDefault(), p.stopPropagation(), !g.moved && p.type === "pointerup" && mn({
        x: p.clientX,
        y: p.clientY
      }));
    },
    [mn]
  ), xo = M(
    (p) => {
      if (r) {
        if (Br.current) {
          Br.current = !1;
          return;
        }
        b([]), Ge(""), bt(null), !(!("detail" in p) || p.detail !== 2) && (p.preventDefault(), p.stopPropagation(), mn({ x: p.clientX, y: p.clientY }));
      }
    },
    [r, b, mn]
  ), Xt = M(
    (p) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), dn.current) {
          dn.current = !1;
          return;
        }
        mn({ x: p.clientX, y: p.clientY });
      }
    },
    [r, mn]
  ), ht = M(
    (p, g) => {
      r && (p.preventDefault(), p.stopPropagation(), Ge(""), Pt.has(g.id) || b([g.id]), bt({
        nodeId: g.id,
        x: p.clientX,
        y: p.clientY
      }));
    },
    [r, b, Pt]
  ), Ce = Dt && a.find((p) => p.id === Dt.nodeId) || null, Ee = Dt && gt.get(Dt.nodeId) || null, $n = !!(Ce && It.has(Ce.id)), Zt = Ce && a.find(
    (p) => p.id === E_(a, Ce)
  ) || null, Yr = Ce ? { x: Ce.x, y: Ce.y } : void 0;
  function Nt() {
    bt(null);
  }
  function hs() {
    if (!(!r || !Ce)) {
      if ($n) {
        j.info("脚本托管节点不能复制，请在分镜脚本中修改结构"), Nt();
        return;
      }
      V(
        Ce,
        Yr ? { x: Yr.x + 34, y: Yr.y + 34 } : void 0
      ), Nt();
    }
  }
  function Ti() {
    if (!r || !Ce && !Ee)
      return;
    if (Ee) {
      const g = Ee;
      Nt(), Yt([g]);
      return;
    }
    if (!Ce)
      return;
    if ($n) {
      j.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"), Nt();
      return;
    }
    const p = Ce;
    Nt(), zn([p]);
  }
  function ws() {
    Ce && (ee(Ce), Nt());
  }
  function vt() {
    Zt && (ee(
      Zt,
      Bl(Ce)
    ), Nt());
  }
  function Ao() {
    if (!Ce)
      return;
    const p = y_(Ce, a);
    if (!p) {
      Nt();
      return;
    }
    ce(Ce.id, p), j.success("已恢复脚本生成的提示词"), Nt();
  }
  const Mi = M(
    (p) => {
      r && (p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "move"));
    },
    [r]
  ), Xr = M(
    (p) => {
      if (!r || (p.preventDefault(), !ge || !P)) return;
      const g = p.dataTransfer.getData(
        "application/shemic-nodetype"
      );
      if (!g) return;
      const S = p.dataTransfer.getData("application/shemic-detail"), x = S ? JSON.parse(S) : void 0, D = ge.screenToFlowPosition ? ge.screenToFlowPosition({
        x: p.clientX,
        y: p.clientY
      }) : zo(ge, {
        x: p.clientX,
        y: p.clientY
      });
      g === "asset" && x ? P("asset", D, { asset: x }) : g === "power" && x ? P("power", D, { power: x }) : g === "agent" && x ? P("agent", D, { role: x }) : g === "flow" && x ? P("flow", D, { flow: x }) : g === "function" && x ? P("function", D, { functionOption: x }) : P(g, D);
    },
    [ge, r, P]
  ), hr = M(() => {
    ge?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [ge]), ut = M(
    (p) => {
      const g = Ir(p);
      Je(g), ge?.zoomTo?.(g, { duration: 120 });
    },
    [ge, Je]
  ), _s = M(() => {
    const p = Ir(an + 0.12);
    Je(p), ge?.zoomIn?.({ duration: 140 });
  }, [ge, Je, an]), Di = M(() => {
    const p = Ir(an - 0.12);
    Je(p), ge?.zoomOut?.({ duration: 140 });
  }, [ge, Je, an]), To = M(() => {
    if (r) {
      if (zr.current) {
        zr.current = !1;
        return;
      }
      Ge(""), bt(null);
    }
  }, [r]), Pi = M(
    (p, g) => {
      r && An(g.id);
    },
    [r]
  ), Ei = M((p, g) => {
    ct(g.id);
    const S = g.type === "workSpace" ? g.data.sourceNode : null;
    S && Va(S) && _b();
  }, []), Fi = M(() => {
    ct("");
  }, []), jn = M(
    (p) => {
      const g = p;
      ds(g), f.x != null && f.y != null && f.zoom != null ? (g.setViewport?.({
        x: f.x,
        y: f.y,
        zoom: f.zoom
      }), Je(f.zoom)) : Je(g.getZoom?.() || 1);
    },
    [Je, f.x, f.y, f.zoom]
  ), Vn = M(
    (p, g) => {
      bo(g.zoom);
    },
    [bo]
  ), bs = M(
    (p, g) => {
      Je(g.zoom), U({
        x: g.x,
        y: g.y,
        zoom: g.zoom
      });
    },
    [Je, U]
  ), Oi = M(() => {
    Or((p) => !p);
  }, []), Is = M(() => {
    _o((p) => !p);
  }, []), Bi = [
    "ws-canvas-wrap",
    Tt ? "is-dragging" : "",
    ir ? "is-selecting" : "",
    Tn ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ O(
    "section",
    {
      ref: ar,
      className: Bi,
      style: lv(an),
      onPointerDownCapture: Ai,
      onPointerMoveCapture: ys,
      onPointerUpCapture: ko,
      onPointerCancelCapture: ko,
      onContextMenuCapture: gs,
      children: [
        /* @__PURE__ */ l(
          Pp,
          {
            nodes: Bn,
            edges: ps,
            onlyRenderVisibleElements: !0,
            nodeTypes: uI,
            edgeTypes: lI,
            onNodesChange: Ni,
            onEdgesChange: ms,
            onConnect: Ri,
            onConnectStart: H,
            onConnectEnd: Co,
            isValidConnection: Pe,
            connectionLineStyle: fI,
            onEdgeClick: Ro,
            onNodeClick: To,
            onNodeContextMenu: ht,
            onNodeDragStart: Pi,
            onNodeDrag: ki,
            onNodeDragStop: xi,
            onDragOver: Mi,
            onDrop: Xr,
            onNodeMouseEnter: Ei,
            onNodeMouseLeave: Fi,
            onInit: jn,
            onMove: Vn,
            onMoveEnd: bs,
            onPaneClick: xo,
            onPaneContextMenu: Xt,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: mI,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: fs,
            snapGrid: pI,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: gI,
            fitView: f.zoom == null,
            fitViewOptions: yI,
            children: r && ls && a.length > 0 ? /* @__PURE__ */ l(
              Ep,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeColor: vv
              }
            ) : null
          }
        ),
        ir ? /* @__PURE__ */ l(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: ir,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ l(
          yh,
          {
            canvasCount: o,
            activeCanvasName: s,
            canvasManagerOpen: i,
            showViewTools: r,
            showMiniMap: ls,
            snapToGrid: fs,
            zoom: an,
            onOpenCanvasManager: c,
            onToggleMiniMap: Oi,
            onToggleSnap: Is,
            onReset: hr,
            onZoomIn: _s,
            onZoomOut: Di,
            onZoomChange: ut
          }
        ),
        r && a.length === 0 ? /* @__PURE__ */ O("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ O("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ l(Zd, { size: 16 }),
            /* @__PURE__ */ l("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ l("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && Dt && (Ce || Ee) ? /* @__PURE__ */ l(
          gh,
          {
            point: Dt,
            canShowDetail: !!(Ce && Qt(Ce)),
            canCopy: !!(Ce && !$n),
            canDelete: !!(Ee || !$n),
            canEditStructure: !!(Zt && Zt.id !== Ce?.id),
            canResetStoryboardPrompt: !!(Ce && g_(Ce)),
            onClose: Nt,
            onCopy: hs,
            onDelete: Ti,
            onDetail: ws,
            onEditStructure: vt,
            onResetStoryboardPrompt: Ao
          }
        ) : null,
        mt ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ l(
              fb,
              {
                sourceTitle: mt.sourceTitle,
                targetTitle: mt.targetTitle,
                params: mt.params,
                selectedParamKey: mt.selectedParamKey,
                lyricsAvailable: mt.lyricsAvailable,
                lyricsSelected: mt.lyricsSelected,
                editing: mt.editing,
                onClose: Ci,
                onSelect: vi,
                onSelectLyrics: Si
              }
            )
          }
        ) : null
      ]
    }
  );
});
function vI({
  request: e,
  onClose: t
}) {
  const [n, r] = $(!1);
  async function o() {
    if (n)
      return;
    r(!0);
    const s = e.onConfirm;
    t();
    try {
      Promise.resolve(s()).catch((i) => {
        j.error(i instanceof Error ? i.message : "操作失败");
      });
    } catch (i) {
      j.error(i instanceof Error ? i.message : "操作失败");
    }
  }
  return /* @__PURE__ */ l(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ O(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ O("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ l("h3", { children: e.title }),
              /* @__PURE__ */ l("p", { children: e.description })
            ] }),
            /* @__PURE__ */ O("div", { className: "ws-confirm-actions", children: [
              /* @__PURE__ */ l("button", { type: "button", disabled: n, onClick: t, children: "取消" }),
              /* @__PURE__ */ l(
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
function SI(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function CI(e, t, n) {
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
function wf(e, t, n, r = e.length) {
  const o = Math.min(
    vr,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: De(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: o },
      (s, i) => e[i] ? bf(e[i], i) : _f(i)
    )
  };
}
function RI(e, t, n, r) {
  if (t < 0 || t >= vr || (e?.frames.length || 0) > vr)
    return null;
  const o = e || wf([], null, r, t + 1), s = Math.min(
    vr,
    Math.max(2, o.frames.length, t + 1)
  ), i = bf(n, t);
  return {
    ...o,
    frames: Array.from(
      { length: s },
      (c, a) => o.frames[a] || _f(a)
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
function _f(e) {
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
function bf(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: Rm(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function Tr(e, t, n) {
  const r = Me(t, "asset"), o = as(r) ? Kn(r) : void 0, s = he(
    Me(t, "output"),
    Me(t, "asset", "version", "content"),
    Me(t, "version", "content"),
    Me(t, "result", "output"),
    Me(t, "result", "asset", "version", "content"),
    Me(t, "data", "output"),
    Me(t, "data", "content"),
    Me(t, "data", "result"),
    Me(t, "data")
  ), i = e.type === "agent" && s != null ? Ve(s) : Js(s) || kt(s), c = e.type === "power" && Jn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? vn([
    s,
    Me(t, "asset", "version", "content"),
    Me(t, "version", "content"),
    Me(t, "result"),
    i
  ]) : null, a = e.type === "power" && Am(e.power, e.kind, e.outputType) ? Xa([
    s,
    Me(t, "asset", "version", "content"),
    Me(t, "version", "content"),
    Me(t, "result"),
    i
  ]) : null, d = De(
    String(Me(t, "asset", "kind") || ""),
    String(Me(t, "kind") || ""),
    _i(e, i)
  ), f = nr(i, d), h = jt(i, ""), I = De(
    a?.title,
    c?.title
  ), N = Bo(n), b = Bo(a?.summary) || Bo(c?.summary) || Bo(f.text) || Bo(h) || (N ? `已按提示生成：${N}` : "生成完成");
  return {
    ...I && e.titleMode === "auto" ? { title: I } : {},
    description: b,
    resultRef: pc(t),
    resultOutput: a || c || i,
    asset: o || e.asset,
    kind: o?.kind || e.power?.kind || e.kind
  };
}
function Bo(e) {
  const t = De(e);
  return Rn(t) ? "" : t;
}
function Os(e, t) {
  const n = t.version?.content;
  return {
    ...Tr(
      e,
      {
        asset: t,
        output: n
      },
      iu(n)
    ),
    asset: t
  };
}
function kr(e) {
  return iy(e.composerDraft);
}
function ea(e, t, n) {
  return Uu(
    If(e, t),
    kr(e),
    n
  );
}
function If(e, t) {
  const n = kr(e), r = Ru(t, n);
  return ku(t, r);
}
function kI(e) {
  const t = kr(e);
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
function Tc(e, t) {
  const n = rw(e, t);
  return {
    ...n,
    id: xI(e, t, n.id)
  };
}
function xI(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const o = String(t.interaction?.interaction?.id || "");
  if (o)
    return `${e.id}:${o}`;
  const s = js({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return s ? `${e.id}:feedback:${Mf(s)}` : n;
}
function Ma(e, t) {
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
const Pd = 3600 * 1e3, Nf = 2e3, AI = 80, TI = 3;
async function ta(e) {
  const t = lN(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = !1, o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: sc(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s);
  let i = await By({
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
  Ed(e, Sn(i));
  for (let c = 0; c < 8; c += 1) {
    const a = await MI(
      e,
      i,
      o,
      (h) => {
        const I = Pf(
          e,
          h,
          n
        );
        kf(e, h), r = r || I > 0;
      },
      () => r,
      (h) => {
        o = h;
      }
    );
    if (e.canvasRun = a, Ed(e, a), lo(e, a), ni(
      e,
      a,
      r
    ) && (a.status === "running" || a.status === "pending")) {
      j.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const d = Number(a.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      XN(
        a,
        IN(a, d)
      )
    );
    const f = String(a.status || "").toLowerCase();
    if (f !== "waiting") {
      if (xf(e, a), f === "fail" || f === "error")
        throw new Error(ju(a));
      if (f === "canceled" || f === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await mN(e, a), i = {
      ...a,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
function Ed(e, t) {
  const n = {
    ...t,
    canvas_id: Number(t.canvas_id || e.canvasId),
    asset_cate_id: Number(t.asset_cate_id || e.assetCate.id || 0),
    start_node_id: String(t.start_node_id || e.startNode.id),
    execution_scope: String(t.execution_scope || e.executionScope || "")
  };
  e.canvasRun = n, e.onCanvasRunChange?.(n);
}
async function MI(e, t, n, r, o, s) {
  let i = Go(
    e,
    Sn(t)
  );
  if (i = Pa(e, i), r(i.node_results || []), lo(e, i), i.status !== "running" && i.status !== "pending" || !i.run_id && !i.request_id)
    return i;
  const c = String(i.request_id || ""), a = new AbortController(), d = Date.now() + Pd;
  let f = !1, h = null;
  const I = window.setTimeout(() => {
    f = !0, a.abort();
  }, Pd);
  try {
    const N = await zI(
      e,
      c,
      n,
      (b) => {
        b.stream_id && s(b.stream_id);
        const R = jI(b, e);
        if (!R) {
          Rf(e, b);
          return;
        }
        i = Go(
          e,
          Ea(i, R)
        ), r(i.node_results || []), lo(e, i);
      },
      a.signal
    );
    N && (i = Go(
      e,
      Ea(i, N)
    ), lo(e, i)), r(i.node_results || []);
  } catch (N) {
    h = N;
  } finally {
    window.clearTimeout(I), a.abort(), e.runningNodeBatcher?.flush();
  }
  if (i = Pa(e, i), Da(e, i) && !ni(
    e,
    i,
    o()
  ))
    try {
      i = await DI(
        e,
        i,
        c,
        r,
        o,
        d
      );
    } catch (N) {
      throw h instanceof Error && !f ? h : N;
    }
  if (!Da(e, i) || ni(
    e,
    i,
    o()
  ))
    return i;
  throw h instanceof Error && !f ? h : new Error("画布仍在运行，请稍后刷新查看结果");
}
async function DI(e, t, n, r, o, s) {
  let i = t, c = 0;
  for (; ; ) {
    if (Date.now() >= s)
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    try {
      i = await EI(
        e,
        i,
        n,
        r
      ), c = 0;
    } catch (a) {
      if (c += 1, c >= TI)
        throw a;
    }
    if (!Da(e, i) || ni(
      e,
      i,
      o()
    ))
      return i;
    await BI(
      Math.min(Nf, s - Date.now())
    );
  }
}
function ni(e, t, n) {
  return !!(e.singleNode && !Sf(e) && n && !PI(t));
}
function PI(e) {
  return String(e.status || "").trim().toLowerCase() === "waiting" || Cf(e) ? !0 : [
    e.pending_node,
    e.output,
    ...e.node_results || []
  ].some((r) => !!Wn(r));
}
async function EI(e, t, n, r) {
  let o = t;
  const s = Number(o.run_id || 0), i = String(o.request_id || n || "");
  if (!s && !i)
    return o;
  const c = await jy({
    projectId: e.projectId,
    runId: s,
    requestId: i
  });
  return o = Go(
    e,
    Ea(o, Sn(c))
  ), o = Pa(e, o), r(o.node_results || []), lo(e, o), o;
}
function Da(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : !vf(e, t);
}
function vf(e, t) {
  return iN(
    t
  ) ? !0 : e.singleNode ? (t.node_results || []).some(
    (n) => n.node_key === e.startNode.id && rs(Qn(n))
  ) : !1;
}
function Pa(e, t) {
  return FI(e, t) ? {
    ...t,
    status: OI(t.node_results || [])
  } : t;
}
function FI(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : vf(e, t);
}
function OI(e) {
  for (const t of e) {
    const n = Qn(t);
    if (n === "fail")
      return "fail";
    if (n === "canceled")
      return "canceled";
  }
  return "success";
}
function BI(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function zI(e, t, n, r, o) {
  let s = null;
  return await wl({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: o,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if ($I(i))
          throw new Error(i.msg || "画布流返回失败");
        s = Go(
          e,
          Sn(i.output || {})
        );
      }
    }
  }), s;
}
function $I(e) {
  return Number(e.status || 0) === 2;
}
function Go(e, t) {
  if (!e.singleNode || Sf(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const o = Cf(t), s = he(n?.output, t.output), i = {
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
    approval: he(n?.approval, o),
    interaction: he(
      n?.interaction,
      Wn(n?.result),
      Wn(t.pending_node),
      Wn(t.output)
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
function Sf(e) {
  return e.singleNode && e.startNode.type === "group";
}
function Cf(e) {
  const t = ti(e.output), n = ti(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (o) => as(o) && (o.status === "pending" || o.decision === "pending")
  );
}
function jI(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return Sn(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const o = VI(n, {
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
function VI(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, o = as(r) ? r : {}, s = ag(o, n);
  if (!s)
    return null;
  const i = s;
  return t.requireDisplayableResult && !UI(e, i, t.node) ? null : {
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
    approval: he(
      s.approval,
      LI(e, i)
    ),
    interaction: he(
      e.interaction,
      s.interaction,
      Wn(s)
    ),
    persists_result: !!(e.persists_result || s.persists_result),
    agent_run_id: Number(
      e.agent_run_id || s.agent_run_id || o.agent_run_id || 0
    ),
    runTiming: ai(
      he(e.run_timing, s.runTiming, o.run_timing)
    )
  };
}
function LI(e, t) {
  const n = ti(t.result), r = he(
    e.approval,
    t.approval,
    n.approval
  );
  if (r && typeof r == "object")
    return r;
  const o = Number(
    he(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return o > 0 ? { id: o } : void 0;
}
function Wn(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const o of ["result", "pending_node"]) {
    const s = Wn(n[o], t + 1);
    if (s)
      return s;
  }
  const r = Array.isArray(n.node_results) ? n.node_results : [];
  for (const o of r) {
    const s = Wn(o, t + 1);
    if (s)
      return s;
  }
}
function UI(e, t, n) {
  if (e.persists_result || String(e.node_type || "") !== "function")
    return !0;
  const o = String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ), s = tr(o);
  return s?.runsInBackend && !s.persistsResult ? !0 : !!(t.asset || t.version || Me(t, "asset", "version") || Me(t, "data", "asset") || Me(t, "data", "version"));
}
function Rf(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.output || {}, r = String(n.event || ""), o = String(n.node_key || n.node_id || "");
  if (o) {
    if (r !== "node_output" && e.runningNodeBatcher?.flush(), r === "node_started") {
      e.setRunningNode((s) => {
        const i = s[o];
        return {
          ...s,
          [o]: {
            ...i,
            nodeId: o,
            title: String(n.node_name || n.node_key || o),
            startedAt: ec({
              currentStartedAt: i?.startedAt
            }),
            status: "running",
            progress: Math.max(i?.progress || 0, 18)
          }
        };
      });
      return;
    }
    if (r === "node_output") {
      const s = (i) => {
        if (!i || i.status !== "running")
          return i;
        const c = Fd(n.output), a = String(n.node_type || "").toLowerCase(), d = a === "power", f = a === "agent", h = String(
          c.semantic_event || c.event || ""
        ).toLowerCase(), I = Fd(c.meta), N = Bu(
          he(
            I.estimated_duration_ms,
            I.estimatedDurationMs
          )
        ), b = d && h === "status" && !!String(I.output_type || ""), R = b && !!(c.json && typeof c.json == "object"), P = d && (h === "audio_ready" || R || km(c)), V = Number(I.generated_count || 0), G = Number(I.target_count || 0), ee = b ? Math.max(
          i.generatedCount || 0,
          Number.isFinite(V) ? V : 0
        ) : i.generatedCount, se = b && Number.isInteger(G) && G > 0 ? G : i.targetCount, ie = d && typeof c.text == "string" && (h === "delta" || !h) ? c.text : "", L = P ? c : i.streamOutput;
        return {
          ...i,
          progress: Math.max(i.progress, 72),
          streamText: ie ? `${i.streamText || ""}${ie}` : i.streamText,
          streamOutput: L,
          estimatedDurationMs: N || i.estimatedDurationMs,
          streamStarted: i.streamStarted || !!ie || !!L,
          ...b ? { streamStarted: !0, generatedCount: ee, targetCount: se } : {},
          agent: f ? Th(i.agent, c) : i.agent
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(o, s) : e.setRunningNode((i) => {
        const c = s(i[o]);
        return c === i[o] ? i : c ? { ...i, [o]: c } : mo(i, o);
      });
    }
  }
}
function KI(e, t, n, r) {
  const o = t.output || {}, s = String(o.event || ""), i = String(o.node_key || o.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (s === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    Rf(e, t);
  }
}
function Fd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Ea(e, t) {
  const n = [...e.node_results || []];
  for (const r of t.node_results || []) {
    const o = oi(r), s = n.findIndex(
      (i) => oi(i) === o
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
function kf(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => rs(r.status)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => qI(e, r, n)
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
function qI(e, t, n) {
  let r = !1;
  const o = { ...t };
  for (const s of n) {
    const i = s.node_key, c = e.nodes.find((d) => d.id === i);
    if (s.status === "canceled") {
      o[i] && (delete o[i], r = !0);
      continue;
    }
    if (s.status === "waiting") {
      o[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: ec({
          nodeRunTiming: s.runTiming,
          currentStartedAt: t[i]?.startedAt
        }),
        progress: 92,
        status: "waiting"
      }, r = !0;
      continue;
    }
    const a = o[i];
    a && (o[i] = {
      ...a,
      startedAt: s.runTiming?.startedAt || a.startedAt,
      finishedAt: s.runTiming?.finishedAt || Date.now(),
      progress: 100,
      status: s.status === "success" ? "success" : "error",
      agent: c?.type === "agent" ? Mh(s.output) : a.agent
    }, r = !0);
  }
  return r ? o : t;
}
function xf(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((o) => {
      const s = na(
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
    const i = { ...o }, c = na(
      e,
      t,
      o,
      n
    );
    for (const a of c) {
      const d = i[a];
      d && (i[a] = {
        ...d,
        progress: r === "success" ? 100 : Math.max(d.progress, 92),
        status: r
      }, s = !0);
    }
    return s ? i : o;
  }), window.setTimeout(
    () => {
      e.setRunningNode?.((o) => {
        let s = !1, i = o;
        const c = na(
          e,
          t,
          o,
          n
        );
        for (const a of c) {
          const d = i[a];
          !d || d.status === "running" || (i === o && (i = { ...o }), delete i[a], s = !0);
        }
        return s ? i : o;
      });
    },
    r === "success" ? 650 : 1200
  );
}
function na(e, t, n, r) {
  const o = cs(t), s = new Set(
    HI(e, t).filter(
      (i) => i === o || !r || r.has(i)
    )
  );
  return Object.keys(n).filter((i) => s.has(i));
}
function GI(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const o = Fa(t), s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const h of t.node_runs || [])
    h.node_key && h.runTiming && i.set(String(h.node_key), h.runTiming);
  for (const h of t.node_results || [])
    h.node_key && h.runTiming && i.set(h.node_key, h.runTiming);
  const c = cs(t);
  let a = !1, d = "";
  for (const h of t.node_runs || []) {
    const I = String(h.node_key || "");
    if (!I || o.has(I) || n && !n.has(I))
      continue;
    a = !0;
    const N = String(h.status || "").trim().toLowerCase();
    N === "running" ? s.set(I, "running") : N === "waiting" ? s.set(I, "waiting") : N === "pending" && !d && (d = I);
  }
  const f = String(t.pending_node?.node_key || "");
  if (f && !o.has(f) && (!n || n.has(f)) && s.set(f, "waiting"), s.size === 0 && d && s.set(d, "running"), s.size === 0 && !a) {
    const h = dh(
      t.start_node_id,
      c
    );
    h && !o.has(h) && (!n || n.has(h)) && s.set(
      h,
      r === "waiting" ? "waiting" : "running"
    );
  }
  c && s.set(
    c,
    r === "waiting" ? "waiting" : "running"
  ), s.size !== 0 && e.setRunningNode((h) => {
    let I = !1;
    const N = { ...h };
    for (const [b, R] of s) {
      const P = e.nodes.find((se) => se.id === b), V = b === c;
      if (!P && !V)
        continue;
      const G = h[b], ee = ec({
        nodeRunTiming: i.get(b),
        runCreatedAt: t.created_at,
        currentStartedAt: G?.startedAt
      });
      G?.status === R && G.startedAt === ee || (N[b] = {
        ...G,
        nodeId: b,
        title: V ? `${e.startNode.title || "分镜脚本"}制作区` : P?.title || b,
        startedAt: ee,
        progress: R === "waiting" ? 92 : G?.progress || 0,
        status: R
      }, I = !0);
    }
    return I ? N : h;
  });
}
function HI(e, t) {
  const n = new Set(ri(t)), r = cs(t);
  return r && n.add(r), e.singleNode && n.add(e.startNode.id), [...n];
}
function WI(e, t, n, r) {
  const o = new Set(
    e.memberNodeIds.filter(
      (i) => _t(n[i])
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
function YI(e, t, n) {
  if (n)
    return "停止中";
  const r = String(e?.status || "").trim().toLowerCase();
  if (_t(t) || e && Un(e))
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
function XI({
  frame: e,
  nodeById: t,
  groupMembersById: n,
  runBlockedReasonByNodeId: r,
  runningNodes: o,
  frameRunning: s,
  activeRunByStartNodeId: i,
  stoppingCanvasRunKeys: c,
  hasResult: a,
  onRunGroup: d,
  onRunNode: f,
  onStopRun: h,
  onOpenNode: I,
  projectNode: N
}) {
  const b = e.memberNodeIds.map((P) => t.get(P)).filter(
    (P) => P?.type === "group" && P.group?.origin === "script"
  ).map((P) => {
    const V = n.get(P.id) || Fs;
    return Od({
      executionNode: P,
      members: V,
      runBlockedReasonByNodeId: r,
      runningNodes: o,
      frameRunning: s,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => d(P.id),
      onStopRun: h,
      onOpenNode: I,
      projectNode: N
    });
  }), R = e.workNodeIds.map((P) => t.get(P)).find((P) => P?.storyboardItem?.itemType === "video_compose");
  return R && b.push(
    Od({
      executionNode: R,
      members: [R],
      runBlockedReasonByNodeId: r,
      runningNodes: o,
      frameRunning: s,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => f(R.id),
      onStopRun: h,
      onOpenNode: I,
      projectNode: N
    })
  ), b;
}
function Od({
  executionNode: e,
  members: t,
  runBlockedReasonByNodeId: n,
  runningNodes: r,
  frameRunning: o,
  activeRunByStartNodeId: s,
  stoppingCanvasRunKeys: i,
  hasResult: c,
  onRun: a,
  onStopRun: d,
  onOpenNode: f,
  projectNode: h
}) {
  const I = uc({
    members: t,
    runningNodes: r,
    groupState: r[e.id],
    hasResult: c
  }), N = s.get(e.id), b = String(N?.status || "").trim().toLowerCase(), R = N && I.status === "idle" ? b === "waiting" ? "waiting" : "running" : I.status, P = R === "running" || R === "waiting", V = I.runnableCount === 0, G = P ? "" : o ? "制作区正在执行" : n.get(e.id) || (V ? "当前分组未配置可用能力" : "");
  return {
    id: e.id,
    title: e.title || "未命名分组",
    memberCount: I.memberCount,
    runnableCount: I.runnableCount,
    completedCount: I.completedCount,
    failedCount: I.failedCount,
    status: R,
    runBlockedReason: G,
    stopping: !!(N && i.has(In(N))),
    results: t.map(
      (ee) => ZI(
        ee,
        r[ee.id],
        c(ee),
        f,
        h
      )
    ),
    onRun: !P && !G ? a : void 0,
    onStop: N ? () => d(e.id) : void 0
  };
}
function ZI(e, t, n, r, o) {
  const s = JI(t, n);
  return {
    nodeId: e.id,
    status: s,
    node: o(e),
    onOpen: () => r(e.id)
  };
}
function JI(e, t) {
  return e?.status === "running" ? "running" : e?.status === "waiting" ? "waiting" : e?.status === "error" ? "error" : t ? "complete" : "pending";
}
function cs(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? pi(t) : "";
}
function ra(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const r = Number(e.asset_cate_id || 0);
  return r === 0 || r === t.assetCateId;
}
function ri(e) {
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
function Fa(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => rs(Qn(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function QI(e) {
  return Tf(e).map((t) => t.run);
}
function eN(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    Un(n) && t.set(In(n), n);
  return [...t.values()];
}
function tN(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const o of Af(n))
        t.set(o, r);
  }
  return t;
}
function nN(e, t) {
  for (const n of Af(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function Af(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function Tf(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const s of ri(r))
      t.has(s) || (t.add(s), o.add(s));
    o.size !== 0 && Un(r) && n.push({ run: r, managedNodeIds: o });
  }
  return n;
}
function oa(e) {
  return e.map(Oa).filter((t) => !!t);
}
function Oa(e) {
  const t = Sn(e);
  return t.run_id || t.request_id ? t : null;
}
function rN(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Number(r.run_id || 0);
    o > 0 && !oN(r, t) && n.add(o);
  }
  return [...n];
}
function oN(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const s = t[String(n)];
    return s ? Ba(e, s) : !1;
  }
  const r = Number(e.asset_cate_id || 0);
  return (r ? Object.values(t).filter(
    (s) => s.assetCateId === r
  ) : Object.values(t)).some(
    (s) => Ba(e, s)
  );
}
function Ba(e, t) {
  const n = String(e.status || "").trim().toLowerCase();
  if (!["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
    n
  ))
    return !1;
  const r = new Map(t.nodes.map((c) => [c.id, c]));
  if (!e.single_node) {
    const c = (e.node_results || []).filter(
      (d) => d.node_key
    );
    if (c.length === 0)
      return !1;
    let a = 0;
    for (const d of c) {
      const f = r.get(d.node_key);
      if (f && (a += 1, !Ia(f, e, d)))
        return !1;
    }
    return a > 0;
  }
  const o = String(e.start_node_id || ""), s = r.get(o), i = (e.node_results || []).find(
    (c) => c.node_key === o
  );
  return Ia(s, e, i);
}
function sa(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(In(r), r);
  for (const r of t)
    n.set(In(r), r);
  return [...n.values()].sort(sN).slice(0, 50);
}
function sN(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = Bd(t) - Bd(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Bd(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function iN(e) {
  const t = aN(e);
  if (t.size === 0)
    return !1;
  const n = /* @__PURE__ */ new Set();
  for (const r of e.node_results || []) {
    const o = Qn(r);
    if (o === "waiting" || o === "running" || o === "pending")
      return !1;
    rs(o) && n.add(r.node_key);
  }
  for (const r of t)
    if (!n.has(r))
      return !1;
  return !0;
}
function aN(e) {
  const t = /* @__PURE__ */ new Set();
  for (const o of e.execution_plan?.nodes || [])
    cN(o) && t.add(o.id);
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
function cN(e) {
  return ["asset", "power", "agent", "flow"].includes(String(e.type || "")) ? !0 : !!(e.type === "function" && tr(e.function_key)?.runsInBackend);
}
function dN(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((o) => o.id === n);
    if (r)
      return r;
  }
  return t.find(bi) || t[0] || null;
}
function uN(e, t) {
  return [
    e.run_id || e.request_id || "",
    oi(t)
  ].join(":");
}
function lN(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function fN(e, t, n) {
  const r = typeof n == "string" ? n : js(n), o = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${o}-${Mf(r)}`.slice(
    0,
    96
  );
}
function Mf(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function lo(e, t, n) {
  pN(e, t), GI(e, t, n);
}
function pN(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((a) => a.id === n.node_key);
  if (!r)
    return;
  const o = Mc(n, r);
  if (!o)
    return;
  const s = Tc(r, o), i = Sr(r), c = Ma(
    i,
    s
  );
  if (js(i) !== js(c)) {
    const a = {
      ...r,
      feedbackRequests: c
    };
    e.nodes = e.nodes.map(
      (d) => d.id === r.id ? a : d
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
async function mN(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const o = Mc(n, r);
  if (!o || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const s = await e.requestFlowFeedback({ node: r, prompt: o });
  return Df(
    e.projectId,
    t,
    n,
    o,
    s
  );
}
async function Df(e, t, n, r, o) {
  return r.interaction ? Uy({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: o
  }) : $y({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: o
  });
}
function gN(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const o = r.pending_node;
    if (!o || o.node_key !== t.id)
      continue;
    const s = Mc(o, t);
    if (!s)
      continue;
    if (Tc(t, s).id === n.id)
      return { run: r, pending: o, prompt: s };
  }
  return null;
}
function Mc(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : Wn(e);
  if (n?.interaction?.id)
    return bl({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const o = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, s = he(
      e.approval,
      Me(e.result, "approval"),
      Me(e.output, "approval")
    );
    s && !Array.isArray(o.approvals) && (o.approvals = [s]);
    const i = iw(o);
    return aw(i);
  }
  return dw(e, t.title);
}
function Pf(e, t, n) {
  let r = 0;
  const o = new Map(e.nodes.map((s) => [s.id, s]));
  for (const s of t) {
    const i = o.get(s.node_key), c = Qn(s);
    if (!i || !rs(c))
      continue;
    const a = oi(s);
    if (c === "success" && a && n?.has(a) && (!s.runTiming || i.runTiming?.finishedAt === s.runTiming.finishedAt))
      continue;
    const d = wN(e, i, s);
    e.onNodeResult(i.id, d), a && n?.add(a), c === "success" && (r += 1);
    const f = {
      ...i,
      ...d
    };
    o.set(i.id, f), e.nodes = e.nodes.map(
      (h) => h.id === i.id ? f : h
    ), c === "success" && d.asset && e.onAssetCreated(d.asset), c === "success" && e.requestNodeTitle?.(f, s);
  }
  return r;
}
function yN(e, t) {
  const n = kr(e).prompt.trim(), o = (t ? Bf(e.id, t.nodes, t.edges) : null)?.text.trim() || "", s = [n, o ? `上游内容：
${o}` : ""].filter(Boolean).join(`

`);
  return Array.from(s).slice(0, oI).join("");
}
function hN(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || Qn(t) !== "success" || Number(t.version_id || 0) <= 0 || !Xu(e) ? !1 : Jn(e.power, e.kind, e.outputType).viewMode !== "storyboard";
}
function oi(e) {
  return [
    e.node_key,
    e.execution_id || "",
    e.request_id || "",
    e.node_run_id || "",
    e.child_run_id || "",
    e.status || "",
    e.version_id || "",
    e.asset_id || ""
  ].join(":");
}
function wN(e, t, n) {
  const r = Qn(n), o = _N(n.runTiming) || bN(e, n.node_key), s = (a) => o ? { ...a, runTiming: o } : a;
  if (r === "fail")
    return s(
      ia(t, {
        resultRef: pc(n),
        runError: cg(n)
      })
    );
  if (r === "canceled")
    return s(
      ia(t, { runError: "" })
    );
  const i = Oh({
    result: n,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), c = (a) => ia(t, a);
  return s(
    c(i ? {
      ...Tr(
        t,
        Bh(n, i),
        "后端执行结果"
      ),
      runError: ""
    } : {
      ...Tr(t, n, "后端执行结果"),
      runError: ""
    })
  );
}
function _N(e) {
  if (!(!e?.startedAt || !e.finishedAt || e.finishedAt < e.startedAt))
    return e;
}
function bN(e, t) {
  const n = e.getRunningNode?.(t);
  if (n?.startedAt)
    return {
      startedAt: n.startedAt,
      finishedAt: n.finishedAt || Date.now()
    };
}
function ia(e, t) {
  const n = Sr(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function IN(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? ju(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function NN(e) {
  const t = vN(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await Hy({
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
  return Hn(n, r);
}
function vN(e) {
  return Math.max(0, Number(e || 0));
}
function Pr(e) {
  const t = kn(e), n = nr(
    t,
    _i(e, t)
  );
  return Xn(n) || (n.text = jt(t, "")), n;
}
function _i(e, t) {
  const n = Lb(t);
  return e.type === "power" ? De(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : De(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function aa(e) {
  const t = Pr(e);
  if (Xn(t))
    return t;
  const n = nr(
    kn(e),
    String(e.kind || e.power?.kind || "")
  );
  return Xn(n) || (n.text = jt(kn(e), "")), n;
}
function Dc(e) {
  return CN(e) || Bb(e);
}
function qn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : kn(e);
}
function Bs(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    qn(e)
  ];
}
function SN(e) {
  const t = e.composerDraft?.paramValues || {};
  return De(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function CN(e) {
  return Db(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function zo(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function RN(e, t, n, r) {
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
function kN(e, t) {
  const n = Ef(e), r = Ff(e, t, n), o = (s) => n.hasResultByNodeId.get(s.id) || !1;
  return {
    ...n,
    ...r,
    runBlockedReasonByNodeId: new Map(
      e.map((s) => [
        s.id,
        ll({
          targets: s.type === "group" ? n.groupMembersById.get(s.id) || [] : [s],
          nodesByID: n.nodeById,
          hasResult: o
        })
      ])
    ),
    highlightedPathEdgesByNodeId: KN(
      n.nodeById,
      t
    )
  };
}
function Ef(e) {
  const t = new Map(e.map((o) => [o.id, o])), n = new Map(
    e.map((o) => [o.id, Qt(o)])
  ), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o.groupId)
      continue;
    const s = r.get(o.groupId) || [];
    s.push(o), r.set(o.groupId, s);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function Ff(e, t, n, r = "") {
  const { nodeById: o, groupMembersById: s, hasResultByNodeId: i } = n, c = (b) => {
    const R = o.get(b);
    return R ? R.type === "group" ? s.get(R.id) || [] : [R] : [];
  }, a = /* @__PURE__ */ new Set();
  for (const b of t) {
    const R = St(b);
    if (r && R.targetNodeId !== r)
      continue;
    const { sourceNodeId: P } = R;
    for (const V of c(P))
      a.add(V.id);
  }
  const d = /* @__PURE__ */ new Map();
  for (const b of e)
    if (a.has(b.id)) {
      const R = xN(
        b,
        i.get(b.id) || !1
      );
      R && zd(R).trim() !== "" && d.set(b.id, R);
    }
  const f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (const b of t) {
    const { sourceNodeId: R, targetNodeId: P } = St(b);
    if (!(r && P !== r || !o.has(P)))
      for (const V of c(R)) {
        if (xu(b) && Qa(V)) {
          const ie = h.get(P) || [];
          ie.push({ edge: b, source: V }), h.set(P, ie);
        }
        const G = d.get(V.id), ee = I.get(P) || /* @__PURE__ */ new Set();
        if (!G || ee.has(V.id))
          continue;
        ee.add(V.id), I.set(P, ee);
        const se = f.get(P) || [];
        se.push(G), f.set(P, se);
      }
  }
  const N = /* @__PURE__ */ new Map();
  for (const [b, R] of f)
    N.set(b, {
      sources: R,
      text: R.map(zd).join(`

`)
    });
  return {
    inputContextByNodeId: N,
    incomingMediaReferencesByNodeId: h
  };
}
function St(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function Of(e, t, n) {
  const r = [];
  for (const o of t) {
    if (!xu(o))
      continue;
    const s = St(o);
    if (s.targetNodeId === n)
      for (const i of Mu(
        e,
        s.sourceNodeId
      ))
        Qa(i) && r.push({ edge: o, source: i });
  }
  return r;
}
function Bf(e, t, n) {
  const r = Ef(t);
  return Ff(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function xN(e, t) {
  if (!t)
    return null;
  const n = kn(e), r = _i(e, n), o = nr(n, r);
  return Xn(o) || (o.text = jt(
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
function AN(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const o = t.sources[r];
    return n.nodeId === o.nodeId && n.title === o.title && n.type === o.type && n.kind === o.kind && n.output === o.output && n.resultRef === o.resultRef && n.preview.text === o.preview.text && n.preview.imageUrl === o.preview.imageUrl && n.preview.videoUrl === o.preview.videoUrl && n.preview.audioUrl === o.preview.audioUrl && n.preview.fileUrl === o.preview.fileUrl;
  });
}
function zd(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || mf(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function za(e, t) {
  return Wm(e, t);
}
function $d(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function bn(e, t, n, r) {
  return !t || !n || t === n || e.some((s) => {
    const i = St(s);
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
function $a(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function ja(e, t) {
  return e.type === "asset" && $a(e) === t;
}
function jd(e, t, n, r) {
  const o = new Map(e.map((s) => [s.id, s]));
  if (r)
    for (const s of t) {
      if (s.from !== r)
        continue;
      const i = o.get(s.to);
      if (i && ja(i, n))
        return i;
    }
  return e.find((s) => ja(s, n)) || null;
}
function Vd(e, t, n, r, o) {
  const s = /* @__PURE__ */ new Set();
  if (!r || !n)
    return s;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== r || c.to === o)
      continue;
    const a = i.get(c.to);
    a && ja(a, n) && s.add(a.id);
  }
  return s;
}
function ca(e, t) {
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
function TN(e) {
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
function MN(e) {
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
function DN(e, t) {
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
  return Hu({
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
function PN(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      oo(r, t)
    ])
  );
}
function oo(e, t) {
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
      (s) => EN(s, r, o)
    )
  };
}
function EN(e, t, n) {
  const r = zf(e), o = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!o)
    return e;
  const s = Os(e, o), i = Number(s.resultRef?.run_id || 0), c = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...s,
    ...e.runError && i > c ? { runError: "" } : {},
    asset: o
  };
}
function zf(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function FN(e) {
  if (!po(e, "import"))
    return null;
  const t = zf(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function ON(e, t) {
  return e === t || e.assetCateId === t.assetCateId && $f(e.nodes, t.nodes) && jf(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function $f(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function BN(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.status === t.status;
}
function jf(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n === o || n.id === o.id && n.from === o.from && n.to === o.to && (n.logicalFrom || "") === (o.logicalFrom || "") && (n.logicalTo || "") === (o.logicalTo || "") && (n.purpose || "") === (o.purpose || "") && (n.executionMode || "auto") === (o.executionMode || "auto") && (n.mediaUsage || "") === (o.mediaUsage || "");
  });
}
function zN(e, t) {
  return za(e, t) ? { source: e.id, target: t.id } : za(t, e) ? { source: t.id, target: e.id } : null;
}
function $N(e) {
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
function jN(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function VN(e, t, n) {
  const o = new Map(n.map((i) => [i.id, i]));
  let s = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const c = o.get(i.id);
    if (!c)
      continue;
    const a = i.position.x - e.position.x, d = i.position.y - e.position.y, f = Math.sqrt(a * a + d * d);
    f < 150 && (!s || f < s.distance) && (s = { distance: f, domainNode: c });
  }
  return s;
}
function LN(e, t, n, r, o, s, i) {
  const c = e.id === o, a = s.has(e.id), d = c || a || e.source === n || e.target === n || e.source === r || e.target === r, f = e.source === n || e.target === n ? n : r;
  return {
    highlighted: d,
    selected: c,
    highlightColor: d ? qN(
      t.get(
        a ? i : f
      )
    ) : "var(--ws-edge)"
  };
}
function UN(e, t) {
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
function KN(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of t) {
    const s = n.get(o.from);
    s ? s.push(o) : n.set(o.from, [o]);
  }
  const r = /* @__PURE__ */ new Map();
  for (const o of e.values()) {
    if (!po(o, "start"))
      continue;
    const s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set([o.id]), c = [...n.get(o.id) || []];
    for (let a = 0; a < c.length; a += 1) {
      const d = c[a];
      if (!d || s.has(d.id) || (s.add(d.id), i.has(d.to)))
        continue;
      i.add(d.to);
      const f = e.get(d.to);
      f && ul(f) || c.push(...n.get(d.to) || []);
    }
    s.size > 0 && r.set(o.id, s);
  }
  return r;
}
function qN(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function GN(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function HN(e) {
  return e instanceof HTMLElement ? !!e.closest("input, textarea, select, [contenteditable='true']") : !1;
}
function Ld(e) {
  return !e.repeat && (e.key === "Delete" || e.key === "Backspace") && !HN(e.target);
}
function WN(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ l(Ka, { ...n }) : e === "import" ? /* @__PURE__ */ l(pa, { ...n }) : e === "display" ? /* @__PURE__ */ l(Ua, { ...n }) : e === "save" ? /* @__PURE__ */ l(tu, { ...n }) : /* @__PURE__ */ l(nu, { ...n });
}
function bi(e) {
  return po(e, "start");
}
function Vf(e) {
  return !!(e.type === "function" && tr(e.functionOption?.key)?.showsResult);
}
function Pc(e) {
  return Vf(e) && Qt(e);
}
function YN(e) {
  return {
    description: e
  };
}
function XN(e, t) {
  return {
    ...YN(t),
    resultRef: pc({
      ...ti(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Ud = { width: 620, height: 420 }, Ec = 44;
function Lf(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && ts(t) === "image");
}
function ZN(e, t) {
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
function Uf(e) {
  if (e.type === "function") {
    if (Pc(e)) {
      if (!sl(e))
        return { width: e.width, height: e.height };
      const n = Kd(e);
      return n ? {
        width: n.width,
        height: n.height + Ec
      } : QN(e);
    }
    return { width: 128, height: 46 };
  }
  const t = Kd(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Kd(e) {
  if (!sl(e) || !JN(e))
    return null;
  const t = Pr(e);
  return !Iu(
    qn(e),
    ts(t)
  ) || Lf(e, t) ? null : {
    width: Math.max(e.width, Ud.width),
    height: Math.max(e.height, Ud.height)
  };
}
function JN(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Jn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function QN(e) {
  const t = Pr(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = ui({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + Ec
  };
}
function rt({
  id: e,
  type: t,
  position: n,
  className: r,
  style: o
}) {
  return Yd(Ac) ? null : /* @__PURE__ */ l(
    Fp,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: o,
      children: /* @__PURE__ */ l("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ l(Jd, { size: 12 }) : /* @__PURE__ */ l(Qd, { size: 12 }) })
    }
  );
}
function _n({
  node: e,
  selected: t
}) {
  if (e.embedded) return null;
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && Pc(e), r = /* @__PURE__ */ l(
    Rh,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const o = _t(e.runningNode);
    return /* @__PURE__ */ O(Nn, { children: [
      r,
      /* @__PURE__ */ l(
        hw,
        {
          node: e,
          running: o,
          onRun: () => {
            o || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((s) => {
              j.error(
                s instanceof Error ? s.message : "流程运行失败"
              );
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !Va(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ O(Nn, { children: [
    r,
    /* @__PURE__ */ l(
      Oe,
      {
        fallback: /* @__PURE__ */ l(Be, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ l(wb, { node: e }, e.id)
      }
    )
  ] });
}
function Va(e) {
  return e.type === "agent" ? !0 : e.type === "power" && !Tm(e.power, e.kind, e.outputType);
}
function to({
  node: e,
  onShowNodeDetail: t
}) {
  return !t || !Qt(e) ? null : /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "ws-node-quick-view nodrag nopan",
      "aria-label": "查看详情",
      onPointerEnter: Qo,
      onFocus: Qo,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ l(Ua, { size: 14 })
    }
  );
}
const ev = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function da({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = Yo(
    e.resultView || ev
  ), [o, s] = $(null), i = vh(
    r,
    o
  ), [c, a] = $(!1), d = e.type === "agent" ? t?.agent : void 0, f = Ph(d);
  if (!Qt(e) && !f)
    return null;
  const h = Pr(e), I = Sc(e), N = De(
    jt(h.text, ""),
    jt(I, ""),
    jt(e.description, ""),
    e.title,
    "暂无结果"
  ), b = Dc(e), R = qn(e), P = Le(R) ? R : b ? { rich: b } : N, V = Ll(h) ? h : jb(
    h,
    nr(N, cf(N, ""))
  ), G = e.interactive, ee = he(
    e.resultOutput,
    e.asset?.version?.content
  ), se = e.type === "agent" ? async (ie) => {
    if (!_t(t))
      try {
        await e.onRunBackendNode(e, { agentInput: ie });
      } catch (L) {
        j.error(
          L instanceof Error ? L.message : "智能体继续运行失败"
        );
      }
  } : void 0;
  return /* @__PURE__ */ l(Oe, { fallback: /* @__PURE__ */ l(Be, { label: "正在加载节点结果" }), children: /* @__PURE__ */ l(
    Vl,
    {
      output: P,
      fallback: N,
      preview: V,
      mediaLabel: fo(V),
      className: `ws-agent-result-bubble ${c ? "is-resizing" : ""}`,
      followContent: !!(t && t.status !== "error"),
      followKey: d,
      style: {
        width: i.width,
        height: i.height,
        left: `calc(100% + 12px + ${Number(i.offsetX || 0)}px)`,
        top: `calc(50% + ${Number(i.offsetY || 0)}px)`
      },
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Qo,
      resizeControls: /* @__PURE__ */ l(
        kh,
        {
          value: i,
          enabled: G,
          onResizeStart: () => {
            s(
              (ie) => sd(
                r,
                ie,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (ie) => s(
            (L) => sd(
              r,
              L,
              ie
            )
          ),
          onResizeEnd: (ie) => {
            a(!1), e.onResultViewResizeEnd(e.id, ie), s(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ l(
        Oe,
        {
          fallback: /* @__PURE__ */ l(Be, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ l(
            yb,
            {
              output: ee,
              runtime: d,
              fallback: N,
              running: _t(t),
              onContinue: se
            }
          )
        }
      ) : void 0
    }
  ) });
}
function tv({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = Pr(e), o = Dc(e), s = qn(e), i = De(
    Sc(e),
    jt(r.text, ""),
    jt(e.description, ""),
    "暂无内容"
  ), c = Le(s) ? s : o ? { rich: o } : i, a = !so(c, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), d = a && !r.audioUrl ? zs(
    e,
    e.onNodeResult,
    Ec
  ) : void 0;
  return /* @__PURE__ */ l(Oe, { fallback: /* @__PURE__ */ l(Be, { label: "正在加载节点结果" }), children: /* @__PURE__ */ l(
    Vl,
    {
      output: c,
      fallback: i,
      preview: r,
      mediaLabel: fo(r),
      className: `ws-node-function-result-card ${a ? "has-media" : ""}`,
      customContentIsPureMedia: a,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Qo,
      openOnContentClick: !0,
      children: a ? /* @__PURE__ */ l(
        Gf,
        {
          preview: r,
          output: c,
          fallback: i,
          generating: t,
          showMediaCaption: !1,
          onMediaSize: d
        }
      ) : void 0
    }
  ) });
}
function ua({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = Sr(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (s) => s.status === "pending"
  ).length, o = [...n].reverse().find((s) => s.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ O(
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
        /* @__PURE__ */ l(rm, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ l("span", { children: n.length }) : null
      ]
    }
  );
}
function nv(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Qt(e) {
  if (!rv(e) || !nv(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = kn(e);
  if (t == null)
    return !1;
  const n = nr(
    t,
    _i(e, t)
  );
  return Xn(n) || xc(t);
}
function rv(e) {
  return e.type !== "function" ? !0 : Vf(e);
}
async function ov(e) {
  const t = tr(e.node.functionOption?.key);
  if (!t)
    throw new Error(
      `不支持的画布功能：${e.node.functionOption?.key || e.node.title || "未配置"}`
    );
  const n = t.key, r = sv(e.inputContext);
  if (n === "display") {
    if (r == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      Tr(
        e.node,
        { output: r },
        "展示上游结果"
      )
    ), j.success("已展示上游结果"), !0;
  }
  if (n === "save") {
    if (r == null)
      throw new Error("保存节点没有可保存的上游结果");
    const o = await NN({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: av(e.node, e.inputContext),
      kind: zh(e.node),
      content: r,
      nodeKey: e.node.id,
      requestId: fN(
        "save",
        e.node.id,
        r
      ),
      source: iv(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(o), e.onNodeResult(
      e.node.id,
      Tr(
        e.node,
        {
          output: o.version?.content || r,
          asset: o
        },
        "保存上游结果"
      )
    ), j.success("资产已保存"), !0;
  }
  if (n === "start")
    return await e.onRunStartNode(e.node), !0;
  if (n === "import")
    return e.onOpenImportPicker(e.node.id), !0;
  throw new Error(`不支持的画布功能：${n}`);
}
function Fc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function sv(e) {
  const t = Fc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function iv(e) {
  const t = Fc(e);
  return qh(t);
}
function av(e, t) {
  const n = Fc(t);
  return De(n?.title, e.title, "画布资产");
}
function cv({
  prompt: e,
  running: t,
  readonly: n,
  history: r,
  activeRecordId: o,
  onSelectRecord: s,
  onClose: i,
  onSubmit: c
}) {
  const a = ae(
    () => uv(e),
    [e]
  );
  if (typeof document > "u")
    return null;
  const d = document.querySelector(".ws-page") || document.body;
  return Np(
    /* @__PURE__ */ l("div", { className: "ws-flow-feedback-backdrop", onMouseDown: i, children: /* @__PURE__ */ O(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (f) => f.stopPropagation(),
        children: [
          /* @__PURE__ */ O("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ O("div", { children: [
              /* @__PURE__ */ l("strong", { children: e.title || "补充信息" }),
              n ? /* @__PURE__ */ l("span", { children: "已提交的反馈记录，可查看之前填写的内容。" }) : e.description ? /* @__PURE__ */ l("span", { children: e.description }) : null
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "ws-flow-feedback-close",
                disabled: t,
                onClick: i,
                "aria-label": "关闭",
                children: /* @__PURE__ */ l(eu, { size: 18 })
              }
            )
          ] }),
          r && r.length > 1 ? /* @__PURE__ */ l("div", { className: "ws-flow-feedback-tabs", children: r.map((f, h) => /* @__PURE__ */ O(
            "button",
            {
              type: "button",
              className: f.id === o ? "is-active" : "",
              onClick: () => s?.(f),
              children: [
                /* @__PURE__ */ l("span", { children: h + 1 }),
                f.status === "pending" ? "待反馈" : "已提交"
              ]
            },
            f.id
          )) }) : null,
          /* @__PURE__ */ l("div", { className: "ws-flow-feedback-body custom-scrollbar", children: /* @__PURE__ */ l(Oe, { fallback: /* @__PURE__ */ l(Be, { label: "正在加载交互表单" }), children: /* @__PURE__ */ l(
            eb,
            {
              interaction: a,
              disabled: t,
              readonly: n,
              hideHeader: !0,
              layout: "dialog",
              initialData: n ? e.values : void 0,
              onSubmit: (f) => c(
                dv(e, a, f.data)
              )
            }
          ) }) }),
          n ? /* @__PURE__ */ l("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ O(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: i,
              children: [
                /* @__PURE__ */ l(qa, { size: 16 }),
                /* @__PURE__ */ l("span", { children: "知道了" })
              ]
            }
          ) }) : null
        ]
      }
    ) }),
    d
  );
}
function dv(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function uv(e) {
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
function Ir(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function lv(e) {
  const t = Ir(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function qd(e, t) {
  if (!e)
    return;
  const n = Ir(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function fv(e) {
  return bi(e);
}
function pv(e) {
  return bi(e) ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function mv(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const o = ph({
    members: n,
    hasResult: Qt
  });
  await r(t, { targetNodeIds: o });
}
function Kf({
  group: e,
  sourceNode: t,
  members: n,
  setRunningNode: r,
  runNode: o
}) {
  r((s) => ({
    ...s,
    [e.id]: {
      nodeId: e.id,
      title: e.title,
      startedAt: Date.now(),
      progress: 8,
      status: "running"
    }
  })), mv(e, t, n, o).then(() => {
    r((s) => mo(s, e.id));
  }).catch((s) => {
    r((i) => ({
      ...i,
      [e.id]: {
        ...i[e.id] || {
          nodeId: e.id,
          title: e.title,
          startedAt: Date.now(),
          progress: 8
        },
        status: "error"
      }
    })), j.error(s instanceof Error ? s.message : "分组运行失败"), window.setTimeout(() => {
      r((i) => mo(i, e.id));
    }, 1400);
  });
}
function qf({
  data: e,
  selected: t
}) {
  const n = Yd(Ac), r = e, {
    sourceNode: o,
    projectId: s,
    runningNode: i,
    setRunningNode: c,
    onShowNodeDetail: a,
    onConfirmStoryboard: d,
    onNodeResult: f,
    onOpenFeedbackRecord: h,
    canvasReferenceItems: I,
    connectedMediaReferences: N,
    onConnectedMediaEdgeRemove: b,
    onNodeDraftChange: R,
    onOpenStoryboardGridImport: P,
    onRunBackendNode: V,
    structureLocked: G,
    storyboardSourceNode: ee
  } = e, se = r.type === "power" ? Jn(r.power, r.kind, r.outputType) : null, ie = se?.viewMode === "storyboard", L = se?.viewMode === "storyboard_grid", X = se?.viewMode === "video_compose";
  if (r.type === "group") {
    const T = r.groupMembers, B = r.storyboardFrameRunning, U = r.groupRuntime || uc({
      members: T,
      runningNodes: gf,
      groupState: i,
      hasResult: Qt
    }), re = r.runBlockedReason;
    let le;
    return !re && !B && (le = () => Kf({
      group: r,
      sourceNode: o,
      members: T,
      setRunningNode: c,
      runNode: V
    })), /* @__PURE__ */ l(Oe, { fallback: /* @__PURE__ */ l(Be, { label: "正在加载分组" }), children: /* @__PURE__ */ O(
      W_,
      {
        node: r,
        memberCount: U.memberCount,
        runnableCount: U.runnableCount,
        completedCount: U.completedCount,
        failedCount: U.failedCount,
        status: U.status,
        frameRunning: B,
        selected: t,
        managed: G,
        onRename: G ? void 0 : (fe) => f(r.id, { title: fe, titleMode: "manual" }),
        onEditStructure: ee ? () => a(
          ee,
          Bl(r)
        ) : void 0,
        onRun: le,
        runBlockedReason: re,
        children: [
          /* @__PURE__ */ l(
            rt,
            {
              id: "input-0",
              type: "target",
              position: nt.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ l(
            rt,
            {
              id: "output-0",
              type: "source",
              position: nt.Right,
              className: "is-out"
            }
          ),
          /* @__PURE__ */ l(_n, { node: r, selected: t })
        ]
      }
    ) });
  }
  if (r.type === "agent") {
    const T = _t(i) || i?.status === "success";
    return /* @__PURE__ */ O(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${T ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ l(
            rt,
            {
              id: "input-0",
              type: "target",
              position: nt.Left,
              className: "is-in",
              style: { left: "4px" }
            }
          ),
          /* @__PURE__ */ l(
            rt,
            {
              id: "output-0",
              type: "source",
              position: nt.Right,
              className: "is-out",
              style: { right: "4px" }
            }
          ),
          /* @__PURE__ */ O("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ l("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ l(em, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ l(
              Yi,
              {
                className: "ws-node-circle-title",
                title: r.title,
                onRename: f ? (B) => f(r.id, { title: B, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          T ? /* @__PURE__ */ O(
            "svg",
            {
              className: "ws-node-running-border is-spin is-circle is-agent",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ l(
                  "circle",
                  {
                    className: "ws-node-running-track",
                    cx: "50",
                    cy: "50",
                    r: "47",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ l(
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
          /* @__PURE__ */ l(
            ua,
            {
              node: r,
              onOpenFeedbackRecord: h
            }
          ),
          /* @__PURE__ */ l(
            da,
            {
              node: r,
              runningNode: i,
              onShowNodeDetail: a
            }
          ),
          /* @__PURE__ */ l(_n, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "flow") {
    const T = _t(i) || i?.status === "success";
    return /* @__PURE__ */ O(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${T ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ l(
            "svg",
            {
              className: "ws-hexagon-svg",
              viewBox: "0 0 100 100",
              fill: "currentColor",
              children: /* @__PURE__ */ l(
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
          T ? /* @__PURE__ */ O(
            "svg",
            {
              className: "ws-node-running-border is-spin is-hexagon",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ l(
                  "polygon",
                  {
                    className: "ws-node-running-track",
                    points: "50,5 92,28 92,72 50,95 8,72 8,28",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ l(
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
          /* @__PURE__ */ O("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ l("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ l(tm, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ l(
              Yi,
              {
                className: "ws-node-flow-title",
                title: r.title,
                onRename: f ? (B) => f(r.id, { title: B, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ l(
            rt,
            {
              id: "input-0",
              type: "target",
              position: nt.Left,
              className: "is-in",
              style: { left: "11px" }
            }
          ),
          /* @__PURE__ */ l(
            rt,
            {
              id: "output-0",
              type: "source",
              position: nt.Right,
              className: "is-out",
              style: { right: "11px" }
            }
          ),
          /* @__PURE__ */ l(
            ua,
            {
              node: r,
              onOpenFeedbackRecord: h
            }
          ),
          /* @__PURE__ */ l(da, { node: r, onShowNodeDetail: a }),
          /* @__PURE__ */ l(_n, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "function") {
    const T = r.functionOption?.key || "", B = po(r, "start"), { onRunFunctionNode: U, requestConfirm: re } = r, le = _t(i), fe = B && r.canvasHasRunningNode, _e = le, Ne = Pc(r), pe = Ne ? { left: "0px", top: "19px" } : { left: "0px" }, me = Ne ? { left: "128px", right: "auto", top: "19px" } : { right: "0px" }, ze = (ve) => {
      c((xt) => ({
        ...xt,
        [r.id]: {
          nodeId: r.id,
          title: r.title,
          startedAt: Date.now(),
          progress: ve === "success" ? 100 : ve === "error" ? 92 : 0,
          status: ve
        }
      })), ve !== "running" && ve !== "waiting" && window.setTimeout(
        () => c((xt) => mo(xt, r.id)),
        ve === "success" ? 650 : 1200
      );
    }, Ke = () => {
      const ve = !B;
      ve && ze("running"), U(r).then(() => {
        ve && ze("success");
      }).catch((xt) => {
        ve && ze("error"), j.error(xt instanceof Error ? xt.message : "执行出错");
      });
    }, ce = () => {
      if (!(_e || fe)) {
        if (fv(r)) {
          re({
            title: `执行「${r.title}」`,
            description: pv(r),
            confirmText: "执行",
            onConfirm: Ke
          });
          return;
        }
        Ke();
      }
    }, pt = (ve) => {
      ve.preventDefault(), ve.stopPropagation(), ce();
    };
    return /* @__PURE__ */ O(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${_e ? "is-running" : ""} ${Ne ? "has-result-card" : ""} is-${T || "default"}`,
        children: [
          /* @__PURE__ */ O(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": _e || fe,
              onClick: pt,
              onKeyDown: (ve) => {
                ve.key !== "Enter" && ve.key !== " " || (ve.preventDefault(), ve.stopPropagation(), ce());
              },
              children: [
                /* @__PURE__ */ l("div", { className: "ws-node-function-icon", children: le ? /* @__PURE__ */ l(Yn, { size: 15, className: "ws-spin" }) : WN(T, B) }),
                /* @__PURE__ */ l("span", { className: "ws-node-function-title", children: le ? i?.status === "waiting" ? "等待中" : "运行中" : r.title })
              ]
            }
          ),
          Ne ? /* @__PURE__ */ l(
            tv,
            {
              node: r,
              running: _e,
              onShowNodeDetail: a
            }
          ) : null,
          /* @__PURE__ */ l(
            to,
            {
              node: r,
              onShowNodeDetail: a
            }
          ),
          /* @__PURE__ */ l(
            rt,
            {
              id: "input-0",
              type: "target",
              position: nt.Left,
              className: "is-in",
              style: pe
            }
          ),
          /* @__PURE__ */ l(
            rt,
            {
              id: "output-0",
              type: "source",
              position: nt.Right,
              className: "is-out",
              style: me
            }
          ),
          /* @__PURE__ */ l(
            ua,
            {
              node: r,
              onOpenFeedbackRecord: h
            }
          ),
          Ne ? null : /* @__PURE__ */ l(da, { node: r, onShowNodeDetail: a }),
          /* @__PURE__ */ l(_n, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "asset") {
    if (r.kind === "image") {
      const pe = aa(r), me = qn(r), ze = so(me, pe), Ke = zs(r, f), ce = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        pe.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ O("div", { className: ce, children: [
        /* @__PURE__ */ O("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ l(Lc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ l("span", { children: r.title || "图片资产" })
        ] }),
        /* @__PURE__ */ l("div", { className: "ws-node-image-container ws-node-content-container", children: ze ? /* @__PURE__ */ l("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ l(
          io,
          {
            output: me,
            fallback: pe.text || r.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : pe.imageUrl ? /* @__PURE__ */ l(
          La,
          {
            src: pe.imageUrl,
            alt: r.title,
            className: "ws-node-image-raw",
            onMediaSize: Ke
          }
        ) : /* @__PURE__ */ O("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ l(Lc, { size: 24 }),
          /* @__PURE__ */ l("span", { children: pe.text || r.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ l(
          rt,
          {
            id: "input-0",
            type: "target",
            position: nt.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ l(
          rt,
          {
            id: "output-0",
            type: "source",
            position: nt.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ l(
          to,
          {
            node: r,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ l(_n, { node: r, selected: t })
      ] });
    }
    if (r.kind === "video") {
      const pe = aa(r), me = qn(r), ze = so(me, pe), Ke = zs(r, f), ce = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        pe.videoUrl || pe.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ O("div", { className: ce, children: [
        /* @__PURE__ */ O("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ l(Uc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ l("span", { children: r.title || "视频资产" })
        ] }),
        /* @__PURE__ */ l("div", { className: "ws-node-video-container ws-node-content-container", children: ze ? /* @__PURE__ */ l("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ l(
          io,
          {
            output: me,
            fallback: pe.text || r.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : pe.videoUrl ? /* @__PURE__ */ l(
          $s,
          {
            src: pe.videoUrl,
            poster: pe.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: r.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: Ke
          },
          pe.videoUrl
        ) : pe.imageUrl ? /* @__PURE__ */ l(
          La,
          {
            src: pe.imageUrl,
            alt: r.title,
            className: "ws-node-video-raw",
            onMediaSize: Ke
          }
        ) : /* @__PURE__ */ O("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ l(Uc, { size: 24 }),
          /* @__PURE__ */ l("span", { children: pe.text || r.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ l(
          rt,
          {
            id: "input-0",
            type: "target",
            position: nt.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ l(
          rt,
          {
            id: "output-0",
            type: "source",
            position: nt.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ l(
          to,
          {
            node: r,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ l(_n, { node: r, selected: t })
      ] });
    }
    const T = aa(r), B = Dc(r), U = qn(r), re = Sc(r), le = Le(U) ? U : B ? { rich: B } : re || T.text, fe = so(le, T), _e = !!(T.imageUrl || T.videoUrl || T.audioUrl), Ne = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      _e ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ O("div", { className: Ne, children: [
      /* @__PURE__ */ O("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ l(nm, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ l("span", { children: r.title })
      ] }),
      /* @__PURE__ */ l("div", { className: "ws-node-text-card", children: !fe && T.imageUrl ? /* @__PURE__ */ l("div", { className: "ws-node-text-media", children: /* @__PURE__ */ l(
        "img",
        {
          src: T.imageUrl,
          alt: fo(T) || r.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !fe && T.videoUrl ? /* @__PURE__ */ l("div", { className: "ws-node-text-media", children: /* @__PURE__ */ l(
        $s,
        {
          src: T.videoUrl,
          poster: T.videoPosterUrl,
          ariaLabel: fo(T) || r.title,
          objectFit: "cover",
          allowDragFromVideo: !0,
          playButtonOnly: !0
        },
        T.videoUrl
      ) }) : !fe && T.audioUrl ? /* @__PURE__ */ l("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ l(
        Oe,
        {
          fallback: /* @__PURE__ */ l(Be, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ l(bu, { src: T.audioUrl })
        }
      ) }) : !fe && T.fileUrl ? /* @__PURE__ */ O("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ l(Ga, { size: 16 }),
        /* @__PURE__ */ l("span", { children: fo(T) || "文件内容" })
      ] }) : /* @__PURE__ */ l("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ l(
        io,
        {
          output: le,
          fallback: re || T.text || "暂无内容",
          mediaGridKind: ts(T),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ l(
        rt,
        {
          id: "input-0",
          type: "target",
          position: nt.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ l(
        rt,
        {
          id: "output-0",
          type: "source",
          position: nt.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ l(
        to,
        {
          node: r,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ l(_n, { node: r, selected: t })
    ] });
  }
  if (r.type === "power") {
    const T = _t(i), B = Za(r.power, r.kind), U = L ? Xa(
      T ? [i?.streamOutput, Bs(r)] : Bs(r)
    ) : null, re = Qt(r), le = T ? "running" : i?.status === "error" ? "error" : i?.status === "success" && !re ? "running" : re ? "complete" : "empty", fe = !!(!ie && !L && !X && i?.streamStarted && (i.streamText || i.streamOutput) && i.status !== "success"), _e = fe ? i?.streamOutput ? nr(i.streamOutput, "audio") : {
      text: i?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : Pr(r), Ne = fe ? i?.streamOutput || { text: i?.streamText || "" } : qn(r), pe = ie || L || X || fe || re, me = !ie && !L && !X && !!(_e.imageUrl || _e.videoUrl || _e.audioUrl || _e.fileUrl), ze = r.embedded ? void 0 : zs(r, f), Ke = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      T ? "is-running" : "",
      r.runError && !T ? "is-error" : "",
      ie ? "is-storyboard" : "",
      L ? "is-storyboard-grid" : "",
      X ? "is-video-compose" : "",
      B ? "is-audio" : "",
      r.embedded ? "is-embedded" : "",
      pe ? "has-content" : "",
      me ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ O("div", { className: Ke, children: [
      /* @__PURE__ */ O("div", { className: "ws-node-floating-meta", children: [
        /* @__PURE__ */ O("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ l(
            Mm,
            {
              power: r.power,
              kind: r.kind,
              outputType: r.outputType,
              size: 13,
              className: "ws-icon-violet"
            }
          ),
          /* @__PURE__ */ l(
            Yi,
            {
              className: "ws-node-floating-title",
              title: r.title,
              onRename: f && !G ? (ce) => f(r.id, { title: ce, titleMode: "manual" }) : void 0
            }
          )
        ] }),
        /* @__PURE__ */ l(
          L_,
          {
            runTiming: r.runTiming,
            runningNode: i,
            showEstimate: !n
          }
        )
      ] }),
      /* @__PURE__ */ O("div", { className: "ws-node-power-card", children: [
        T ? /* @__PURE__ */ O("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
          /* @__PURE__ */ l(
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
          /* @__PURE__ */ l(
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
        X ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载视频合成" }),
            children: /* @__PURE__ */ l(
              Cb,
              {
                composition: r.composerDraft?.videoComposition,
                referenceItems: I.filter(
                  (ce) => ce.source !== "current" || ce.id !== r.id
                ),
                connectedMediaReferences: N,
                running: T,
                onChange: R ? (ce) => R(r.id, {
                  ...r.composerDraft || {},
                  videoComposition: ce
                }) : void 0,
                onConnectedMediaEdgeRemove: b,
                onRun: V ? (ce) => {
                  V({
                    ...r,
                    composerDraft: {
                      ...r.composerDraft || {},
                      videoComposition: ce
                    }
                  }).catch(
                    (pt) => j.error(
                      pt instanceof Error ? pt.message : "视频合成失败"
                    )
                  );
                } : void 0,
                onOpenDetail: a ? () => a(r) : void 0
              }
            )
          }
        ) : ie ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载分镜内容", compact: !0 }),
            children: /* @__PURE__ */ l(
              Ib,
              {
                output: T ? i?.streamText || "" : Bs(r),
                status: le,
                generatedShotCount: i?.generatedCount || 0,
                targetShotCount: i?.targetCount || 0,
                workspace: r.storyboardWorkspace,
                referenceItems: I.filter(
                  (ce) => ce.source !== "current" || ce.id !== r.id
                ),
                onOpenDetail: re && a ? (ce, pt) => a(r, pt, ce) : void 0,
                onConfirm: r.interactive && re ? () => d(r.id) : void 0
              }
            )
          }
        ) : L ? /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载分镜宫格", compact: !0 }),
            children: /* @__PURE__ */ l(
              Cm,
              {
                grid: U,
                aspectRatio: SN(r),
                running: T,
                layout: r.composerDraft?.storyboardGridLayout,
                onLayoutChange: R ? (ce) => R(r.id, {
                  ...r.composerDraft || {},
                  storyboardGridLayout: ce
                }) : void 0,
                onImport: P ? () => P(r.id) : void 0,
                onFrameImport: P ? (ce, pt) => P(r.id, pt) : void 0,
                onSlotImport: P ? (ce) => P(r.id, ce) : void 0,
                onEdit: U && a ? () => a(r) : void 0
              }
            )
          }
        ) : pe ? /* @__PURE__ */ l(
          Gf,
          {
            preview: _e,
            output: Ne,
            fallback: r.description,
            streaming: T && fe,
            generating: T && me && !fe,
            videoObjectFit: "cover",
            onMediaSize: ze,
            compactMediaGrid: Lf(
              r,
              _e
            )
          }
        ) : /* @__PURE__ */ l(Nv, {})
      ] }),
      r.runError && !T ? /* @__PURE__ */ l(
        bv,
        {
          projectId: s,
          node: r,
          onOpenDetail: a ? () => a(r) : void 0
        }
      ) : null,
      /* @__PURE__ */ l(
        rt,
        {
          id: "input-0",
          type: "target",
          position: nt.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ l(
        rt,
        {
          id: "output-0",
          type: "source",
          position: nt.Right,
          className: "is-out"
        }
      ),
      ie || L || X ? null : /* @__PURE__ */ l(
        to,
        {
          node: r,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ l(_n, { node: r, selected: t })
    ] });
  }
  return /* @__PURE__ */ O("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ l(
      rt,
      {
        id: "input-0",
        type: "target",
        position: nt.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ l(
      rt,
      {
        id: "output-0",
        type: "source",
        position: nt.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ l("div", { className: "ws-node-title", children: r.title }),
    /* @__PURE__ */ l("div", { className: "ws-node-desc", children: r.description }),
    /* @__PURE__ */ l(to, { node: r, onShowNodeDetail: a }),
    /* @__PURE__ */ l(_n, { node: r, selected: t })
  ] });
}
function gv(e, t) {
  return Oc(e.data, t.data) && e.selected === t.selected;
}
function Oc(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && $f(e.groupMembers, t.groupMembers) && BN(e.groupRuntime, t.groupRuntime) && e.canvasHasRunningNode === t.canvasHasRunningNode && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && e.storyboardFrameRunning === t.storyboardFrameRunning && yv(
    e.storyboardWorkspace,
    t.storyboardWorkspace
  ) && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && AN(e.inputContext, t.inputContext);
}
function yv(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.stopping === t.stopping && e.executionStatus === t.executionStatus && e.currentNodeTitle === t.currentNodeTitle && e.runBlockedReason === t.runBlockedReason && !!e.onStop == !!t.onStop && hv(e.groups, t.groups);
}
function hv(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n.id === o.id && n.title === o.title && n.memberCount === o.memberCount && n.runnableCount === o.runnableCount && n.completedCount === o.completedCount && n.failedCount === o.failedCount && n.status === o.status && n.runBlockedReason === o.runBlockedReason && n.stopping === o.stopping && !!n.onRun == !!o.onRun && !!n.onStop == !!o.onStop && wv(n.results, o.results);
  });
}
function wv(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n.nodeId === o.nodeId && n.status === o.status && Oc(n.node, o.node);
  });
}
function _v(e, t) {
  return e === t || e.id === t.id && e.type === t.type && e.position.x === t.position.x && e.position.y === t.position.y && e.selected === t.selected && e.className === t.className && e.draggable === t.draggable && e.deletable === t.deletable && e.selectable === t.selectable && e.connectable === t.connectable && e.focusable === t.focusable && e.zIndex === t.zIndex && e.dragHandle === t.dragHandle && e.initialWidth === t.initialWidth && e.initialHeight === t.initialHeight && e.style?.width === t.style?.width && e.style?.height === t.style?.height ? e === t ? !0 : Oc(
    e.data,
    t.data
  ) : !1;
}
function bv({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = O_(e, t), o = /* @__PURE__ */ O(Nn, { children: [
    /* @__PURE__ */ l(nu, { size: 14 }),
    /* @__PURE__ */ l("span", { children: r })
  ] });
  return /* @__PURE__ */ l(ot, { label: r, children: n ? /* @__PURE__ */ l(
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
  ) : /* @__PURE__ */ l("div", { className: "ws-node-run-error", children: o }) });
}
function Gf({
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
  const d = te(null), f = te(!0), h = c ? fo(e) : "", I = so(t, e), N = ts(e), b = !!(a && Iu(t, N));
  return ue(() => {
    if (!r) {
      f.current = !0;
      return;
    }
    const R = d.current;
    !R || !f.current || (R.scrollTop = R.scrollHeight);
  }, [e.text, r]), !I && e.imageUrl ? /* @__PURE__ */ O(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ l(
          La,
          {
            src: e.imageUrl,
            alt: h || "生成图片",
            onMediaSize: i
          }
        ),
        h ? /* @__PURE__ */ l("p", { children: h }) : null,
        /* @__PURE__ */ l(la, { active: o })
      ]
    }
  ) : !I && e.videoUrl ? /* @__PURE__ */ O(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ l(
          $s,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            ariaLabel: h || "生成视频",
            objectFit: s,
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: i
          },
          e.videoUrl
        ),
        h ? /* @__PURE__ */ l("p", { children: h }) : null,
        /* @__PURE__ */ l(la, { active: o })
      ]
    }
  ) : !I && e.audioUrl ? /* @__PURE__ */ O(
    "div",
    {
      className: `ws-node-generated-media is-audio ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ l(
          Oe,
          {
            fallback: /* @__PURE__ */ l(Be, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ l(bu, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ l(la, { active: o })
      ]
    }
  ) : !I && e.fileUrl ? /* @__PURE__ */ O("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ l(Ga, { size: 16 }),
    /* @__PURE__ */ l("span", { children: h || "文件内容" })
  ] }) : /* @__PURE__ */ l(
    "div",
    {
      ref: d,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${b ? "is-compact-media-grid" : ""}`,
      onScroll: (R) => {
        const P = R.currentTarget;
        f.current = P.scrollHeight - P.scrollTop - P.clientHeight < 12;
      },
      children: /* @__PURE__ */ l(
        io,
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
function La({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [o, s] = $(e);
  return ue(() => {
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
  }, [o, e]), /* @__PURE__ */ l(
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
function la({ active: e }) {
  return e ? /* @__PURE__ */ O(
    "div",
    {
      className: "ws-node-media-generating nodrag nopan nowheel",
      role: "status",
      "aria-live": "polite",
      onPointerDown: (t) => t.stopPropagation(),
      onClick: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ l(Yn, { size: 18, className: "ws-spin" }),
        /* @__PURE__ */ l("span", { children: "生成中" })
      ]
    }
  ) : null;
}
function fo(e) {
  const t = String(e.text || "").trim();
  return !t || Rn(t) ? "" : t;
}
function Iv(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, o = 340;
  let s = r, i = s / n;
  return i > o && (i = o, s = i * n), {
    width: Math.round(Gd(s, 150, r)),
    height: Math.round(Gd(i, 150, o))
  };
}
function zs(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, o) => {
      const s = Iv(r, o);
      if (!s)
        return;
      const i = {
        width: s.width,
        height: s.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function Gd(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function Nv() {
  return /* @__PURE__ */ O("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ l("span", {}),
    /* @__PURE__ */ l("span", {}),
    /* @__PURE__ */ l("span", {})
  ] });
}
function vv(e) {
  return Sv(e.data);
}
function Sv(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function Cv() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function Rv() {
  return typeof window > "u" ? 0 : Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0
  );
}
function no(e) {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  e > 0 ? t.searchParams.set("canvas_id", String(e)) : t.searchParams.delete("canvas_id"), window.History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    t
  );
}
function kv(e) {
  if (typeof window > "u")
    return !1;
  try {
    return Tb(
      window.localStorage.getItem(
        `${ef}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function xv() {
  if (typeof window > "u")
    return Es;
  try {
    return tf(
      Number(
        window.localStorage.getItem(Ql) || Es
      )
    );
  } catch {
    return Es;
  }
}
function Hd(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
const oS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: hI
}, Symbol.toStringTag, { value: "Module" }));
export {
  Zm as A,
  Yv as B,
  wb as C,
  iy as D,
  rS as E,
  cc as F,
  td as G,
  _t as H,
  nS as I,
  Kn as J,
  oS as K,
  Xm as V,
  Ng as a,
  tf as b,
  Wv as c,
  $u as d,
  In as e,
  rc as f,
  Be as g,
  Kv as h,
  Un as i,
  Oy as j,
  jh as k,
  Qv as l,
  Hn as m,
  Zv as n,
  Jv as o,
  _b as p,
  tS as q,
  Mh as r,
  Ky as s,
  eS as t,
  O_ as u,
  Xv as v,
  Uv as w,
  Hv as x,
  qv as y,
  Gv as z
};
