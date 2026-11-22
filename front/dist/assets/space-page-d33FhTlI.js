import { a as L, j as f, F as Gt, u as Bf } from "./preloadable-R-5sHdlM.js";
import { a5 as Ma, a6 as xo, a7 as Wn, a8 as wr, a9 as mn, aa as zf, ab as Wd, ac as Mt, n as Bc, l as Qr, ad as Uf, ae as Hd, af as Yd, x as Aa, z as zc, m as Jd, ag as Uc, ah as Lc, ai as Lf, aj as $f, ak as Vf, al as jf, am as Pi, an as Kf, ao as qf, ap as Gf, aq as $c, ar as Wf, as as Lr, at as nr, au as Vc, av as Ei, aw as Hf, ax as Xd, y as Yf, A as qr, h as Jf, i as Zd, ay as Xf, az as Zf, aA as Qf, aB as Oi, aC as jc, aD as Hs, s as Kc, aE as qc, aF as ep, aG as tp, aH as np, aI as op, aJ as rp, aK as Gc, aL as sp, aM as Fi, aN as ip, aO as ap, F as na, aP as cp, aQ as dp, aR as up, aS as lp, aT as fp, aU as oa, aV as pp, aW as mp } from "./writing-reference-DlogpT9K.js";
import { m as Do, l as Da, q as Qd, j as gp, s as yp, t as hp, S as eu, u as Bi, e as tu, v as nu, r as Yn, c as wp, w as vp } from "./space-assistant-layout-B9KyeCM0.js";
import { p as jt, o as ci, g as Pa, j as ou, k as bp, T as Np, U as Ip, V as Ys, W as es, X as Cp, l as ru, Y as Sp, Z as _p, _ as Rp, $ as ra, a0 as Wc } from "./asset-preview-DpK5-z_L.js";
import { n as kp, o as su, p as Ea, S as Js, q as xp, r as Tp, f as Mp, s as Ap, l as iu, t as au, u as Qt, w as ir, x as Vs, y as Dp, z as ds, i as In, c as Pp, A as Cn, B as zi, C as vr, D as To, d as wt, E as cu, F as ar, G as Kn, H as Hc, I as Ui, J as Ep, K as Op, L as du, M as uu, N as Fp, O as Bp, P as zp, Q as lu, R as Up, T as Lp, U as Oa, W as $p, X as Vp, Y as jp, Z as Kp } from "./space-story-setting-reference-B-1GhfJK.js";
import { o as qp, s as di, c as lr, C as fr, b as us, P as Xs, i as Gp, d as fu, e as Wp } from "./space-content-view-BQ0Psq2a.js";
import { E as Yc, F as Fs, d as pu, B as gt, G as Oe, H as At, e as Hp, I as mu, J as Yp, K as ls, L as bo, M as fs, N as ps, O as No, p as $e, l as Jp, s as Dt, P as ms, Q as gu, h as Xp, R as sa, S as Zp, T as Qp, U as Bs, V as Io, W as em, t as Fa, f as Zs, X as yu } from "./asset-audio-preview-Du5K0btg.js";
import { e as Jc, l as hu, o as tm, q as or, t as nm, v as om, w as Xc, m as ia, s as rm, x as sm, S as im, C as xe, y as am, z as cm, B as dm, D as um, A as Zc, E as lm, F as fm, G as pm, H as wu, I as mm, J as gm, K as ym, L as ts, M as hm, O as vu, p as wm, P as vm, Q as bm, R as Nm, T as Im, W as Cm, a as Sm, V as _m, U as Rm, X as km, b as xm, Y as Tm, u as Mm, c as Am } from "./node-detail-header-_ds1F0v7.js";
import { i as Vt, c as Ba, S as Gn, o as bu } from "./space-node-runtime-mQKAQcW3.js";
import { j as Dm, c as Pm, C as Em, a as Om, r as Fm, k as Bm, l as zm } from "./writing-run-labels-C7uoY0ZO.js";
import { b as ne, a as K, d as ue, h as O, u as se, l as ns, S as Te, r as za, p as Um, o as Nu } from "./file-kind-Cq3pESGF.js";
import { N as Lm, n as $m, g as Vm, B as Qc, E as jm, a as Km, b as qm, i as Gm, M as Wm, c as Hm, P as Ke, H as Ym } from "./interaction-D704R7sS.js";
import { k as Ua, q as Iu, s as Jm, ag as Xm, h as Zm, m as Qm, aX as eg, aY as Cu, a4 as tg, au as Su, P as _u, L as aa, c as ng, aZ as og, r as Mo, j as La, i as rg, C as $a, b as Va, a_ as sg, X as Ru, A as ig, z as ag, ah as cg, a$ as dg, b0 as ug, aU as lg, b1 as fg, l as pg, W as mg, a8 as ed, a9 as td, a7 as gg, b2 as yg, e as ku, x as xu } from "./vendor-icons-IZIW7U43.js";
import { t as hg, r as Gr } from "./asset-upload-progress-BKzeQB8G.js";
import { u as wg } from "./project-dialogs-CeUQDO8B.js";
import { L as ja, a as vg, M as Tu, y as bg, z as Ng, N as Ig, B as Cg, A as Mu, O as Sg } from "./space-media-references-_pbyPR9I.js";
import { P as _g } from "./power-icon-DnoEnQhv.js";
import { n as Rg, i as kg } from "./text-content-save-actions-BEz7xJXA.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-CoT07toq.css", import.meta.url).href]);
function xg(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, s = [e.asset?.version, ...e.asset?.versions || []].find(
    (r) => r && r.id === n && r.asset_id === t
  );
  return s ? Jc(e, s, {
    includeNodeResult: !1
  }) : Jc({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
const nd = 160, od = 72, rd = 72, Qs = 72, os = 24, rs = 24, ss = 40, Co = 2, ei = { width: 180, height: 180 }, Tg = "storyboard-derived-layout-v7";
function Au(e) {
  const t = e.groups.map((I) => ({
    ...I,
    size: Dg(I)
  })), n = /* @__PURE__ */ new Map(), o = [...t].sort(zs), s = Pg(
    "workspace",
    o
  ), r = t.filter((I) => I.direction === "upstream").sort(zs), i = t.filter(
    (I) => I.direction === "downstream" && I.powerKind !== "audio"
  ).sort(zs), c = t.filter(
    (I) => I.direction === "downstream" && I.powerKind === "audio"
  ).sort(zs), a = i.reduce(
    (I, R) => Math.max(I, R.size.height),
    0
  ), d = i.length ? e.sourceNode.y - a - rd : e.sourceNode.y, l = e.sourceNode.x - nd;
  let y = d;
  for (const I of r)
    n.set(I.key, {
      bounds: {
        x: l - I.size.width,
        y,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), y += I.size.height + rd;
  let v = e.sourceNode.x;
  for (const I of i)
    n.set(I.key, {
      bounds: {
        x: v,
        y: d,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), v += I.size.width + od;
  let b = e.sourceNode.x + e.sourceNode.width + nd;
  for (const I of c)
    n.set(I.key, {
      bounds: {
        x: b,
        y: e.sourceNode.y,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), b += I.size.width + od;
  return n;
}
function Mg(e, t, n) {
  const o = t.filter((c) => c.groupId === e.id), s = n.kind === "audio", r = s ? n.width : Math.max(ei.width, n.width), i = s ? n.height : Math.max(ei.height, n.height);
  for (let c = 0; c < o.length + 100; c += 1) {
    const a = c % Co, d = Math.floor(c / Co), l = {
      x: e.x + os + a * (r + rs),
      y: e.y + Qs + d * (i + ss)
    };
    if (o.every(
      (y) => !Eg(
        { ...l, width: n.width, height: n.height },
        y
      )
    ))
      return l;
  }
  return {
    x: e.x + os,
    y: e.y + Qs
  };
}
function Du(e, t) {
  const n = t.some((r) => r.kind === "audio"), o = {
    width: Math.max(
      n ? 0 : ei.width,
      ...t.map((r) => r.width)
    ),
    height: Math.max(
      n ? 0 : ei.height,
      ...t.map((r) => r.height)
    )
  }, s = /* @__PURE__ */ new Map();
  return t.forEach((r, i) => {
    const c = i % Co, a = Math.floor(i / Co);
    s.set(r.id, {
      x: e.x + os + c * (o.width + rs),
      y: e.y + Qs + a * (o.height + ss)
    });
  }), {
    ...Pu(t.length, o),
    positions: s
  };
}
function Ag(e) {
  return Ma(e || void 0);
}
function Dg(e) {
  const t = Ag(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return Pu(e.itemCount, t);
}
function Pu(e, t) {
  const n = Math.max(1, Math.ceil(e / Co));
  return {
    width: os * 2 + t.width * Co + rs * (Co - 1),
    height: Qs + os + n * t.height + (n - 1) * ss
  };
}
function Pg(e, t) {
  return [
    Tg,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function zs(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function Eg(e, t) {
  return !(e.x + e.width + rs <= t.x || t.x + t.width + rs <= e.x || e.y + e.height + ss <= t.y || t.y + t.height + ss <= e.y);
}
const Eu = "storyboard-soundtrack", Og = 0.35;
function Fg(e) {
  let t = !1;
  const n = e.map((o) => {
    if (o.storyboardItem?.itemType !== "video_compose" || !o.composerDraft?.videoComposition?.storyboardBaseline)
      return o;
    const s = o.storyboardItem.sourceNodeId, r = e.find((a) => a.id === s);
    if (!r) return o;
    const i = jt([
      r.asset?.version?.content,
      r.resultOutput
    ]);
    if (!i || !ci(i)) return o;
    const c = Ou({
      storyboard: i,
      sourceNodeId: s,
      nodes: e,
      current: o.composerDraft.videoComposition
    });
    return JSON.stringify(c) === JSON.stringify(o.composerDraft.videoComposition) ? o : (t = !0, {
      ...o,
      composerDraft: { ...o.composerDraft, videoComposition: c }
    });
  });
  return t ? n : e;
}
function Ou(e) {
  const t = new Map(
    (e.current?.clips || []).map((a) => [a.id, a])
  ), n = e.storyboard.shots.map(
    (a, d) => Vg({
      ...e,
      shot: a,
      index: d,
      current: t.get(a.id)
    })
  ), o = kp({
    version: 3,
    clips: $g(
      n,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: [
      ...zg(e.storyboard),
      ...Ug(e.storyboard, e.sourceNodeId, e.nodes)
    ],
    settings: e.current?.settings || { resolution: "auto", fps: 0 }
  }), s = e.current?.storyboardBaseline, r = Pa(e.storyboard), i = da(
    o.clips,
    s?.clips || [],
    e.current?.clips || [],
    (a, d, l) => Bg(a, d, l, r)
  ), c = da(
    o.audioTracks,
    s?.audioTracks || [],
    e.current?.audioTracks || [],
    (a, d, l) => ca(a, d, l, [
      "audio",
      "startTime",
      "sourceStart",
      "kind",
      "volume",
      "fit",
      "loop",
      "fadeOut"
    ])
  );
  return {
    ...o,
    clips: r ? i.map((a) => ({
      ...a,
      originalVolume: 0,
      speechTracks: [],
      subtitleTracks: []
    })) : i,
    audioTracks: r ? c.filter((a) => a.id === Eu).map((a) => ({ ...a, volume: 1, kind: "music" })) : c,
    storyboardBaseline: {
      clips: o.clips.map(Fu),
      audioTracks: o.audioTracks
    }
  };
}
function Bg(e, t, n, o) {
  const s = ca(e, t, n, [
    "title",
    "visualVideo",
    "originalAudioSource",
    "duration",
    "originalVolume",
    "useOriginalVideo"
  ]);
  return s.speechTracks = o ? [] : da(
    e.speechTracks,
    t?.speechTracks || [],
    n.speechTracks,
    (r, i, c) => ca(r, i, c, [
      "audio",
      "startTime",
      "sourceStart",
      "fit",
      "kind",
      "characterId",
      "text",
      "volume"
    ])
  ), s.subtitleTracks = e.subtitleTracks, Fu(s);
}
function Fu(e) {
  const t = {
    ...e,
    subtitleTracks: jg(
      e.subtitleTracks,
      e.speechTracks,
      e.duration
    )
  };
  return {
    ...t,
    blockingIssues: su(t)
  };
}
function ca(e, t, n, o) {
  if (!t) return e;
  const s = { ...e };
  for (const r of o)
    JSON.stringify(n[r]) !== JSON.stringify(t[r]) && (s[r] = n[r]);
  return s;
}
function da(e, t, n, o) {
  const s = new Map(t.map((d) => [d.id, d])), r = new Map(n.map((d) => [d.id, d])), i = new Set(e.map((d) => d.id)), c = e.flatMap((d) => {
    const l = s.get(d.id), y = r.get(d.id);
    return l && !y ? [] : [o(d, l, y || d)];
  }), a = n.filter(
    (d) => !s.has(d.id) && !i.has(d.id)
  );
  return qp(
    [...c, ...a],
    n.map((d) => d.id),
    (d) => d.id
  );
}
function zg(e) {
  const t = e.references.find(
    (s) => s.purpose === "soundtrack"
  );
  if (!t) return [];
  const n = Number(t.asset_id || 0), o = Number(t.version_id || 0);
  return [
    {
      id: Eu,
      ...n > 0 && o > 0 ? {
        audio: { assetId: n, versionId: o, label: t.label || "主音轨" }
      } : {},
      startTime: 0,
      sourceStart: (e.storyboard_range_start_ms || 0) / 1e3,
      kind: "music",
      volume: Pa(e) ? 1 : 0.35,
      fit: "trim",
      loop: !1,
      fadeOut: Lg(e) ? 0 : 1
    }
  ];
}
function Ug(e, t, n) {
  return ou(e) ? Ip(e).map(({ speech: o, startTime: s }) => {
    const r = Ka(ui(n, t, "speech", o.id));
    return {
      id: o.id,
      ...r ? { audio: r } : {},
      startTime: s,
      sourceStart: 0,
      kind: "narration",
      volume: 1,
      fit: "strict",
      loop: !1,
      fadeOut: 0
    };
  }) : [];
}
function Lg(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, o = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && o != null && (t > 0 || n < o);
}
function $g(e, t) {
  if (!t || t <= 0 || e.length === 0)
    return e;
  const n = Math.round(
    e.reduce((a, d) => a + d.duration, 0) * 1e3
  ), o = e.reduce((a, d, l) => a + (l < e.length - 1 && d.transitionToNext.type !== "none" ? d.transitionToNext.durationMs : 0), 0), s = n - o - t;
  if (s <= 0)
    return e;
  const r = e.length - 1, i = e[r], c = i.duration - s / 1e3;
  return c <= 0 ? e : [...e.slice(0, r), { ...i, duration: c }];
}
function Vg(e) {
  const t = ui(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), n = Ka(t), o = !!e.current?.useOriginalVideo, s = ou(e.storyboard), r = s ? e.shot.speech.filter((I) => I.kind === "dialogue" && I.text.trim()).map(
    (I) => qg(e.nodes, e.sourceNodeId, I)
  ) : [], i = bp(e.storyboard) ? Kg(e.nodes, e.sourceNodeId, e.shot.id) : [], c = n, a = e.storyboard.shots[e.index + 1], d = Np(e.storyboard), l = d && (e.shot.speech.length > 0 || (a?.speech.length ?? 0) > 0), y = a && !a.continue_previous && !l && !Pa(e.storyboard) && a.handoff?.sound_lead_ms || 0, v = {
    type: "none",
    durationMs: 0,
    ...y > 0 ? { soundLeadMs: y } : {}
  }, b = {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...c ? { visualVideo: c } : {},
    ...n ? { originalAudioSource: n } : {},
    duration: e.shot.duration,
    // The shot contains ambience and effects; separate speech is mixed above them.
    originalVolume: d ? 1 : s ? Og : 0,
    speechTracks: r,
    subtitleTracks: i,
    useOriginalVideo: o,
    blockingIssues: [],
    transitionToNext: v
  };
  return {
    ...b,
    blockingIssues: su(b)
  };
}
function jg(e, t, n) {
  return e.map((o) => {
    if (!o.speechId || t.some((c) => c.id === o.speechId))
      return o;
    const { speechId: s, ...r } = o, i = Math.min(
      n,
      ...e.filter((c) => c.startTime > o.startTime).map((c) => c.startTime)
    );
    return { ...r, endTime: o.endTime ?? i };
  });
}
function Kg(e, t, n) {
  const o = ui(e, t, "subtitle", n), s = Yc(o?.resultOutput);
  return (Array.isArray(s.tracks) ? s.tracks : []).flatMap((i) => {
    const c = Yc(i), a = Fs(c.id), d = Fs(c.text);
    if (!a || !d)
      return [];
    const l = sd(c.end_time ?? c.endTime), y = Fs(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: d,
        startTime: Math.max(
          0,
          sd(c.start_time ?? c.startTime)
        ),
        ...l > 0 ? { endTime: l } : {},
        ...y ? { speechId: y } : {},
        source: Fs(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function qg(e, t, n) {
  const o = ui(e, t, "speech", n.id), s = Ka(o);
  return {
    id: n.id,
    ...s ? { audio: s } : {},
    startTime: n.start_time,
    sourceStart: 0,
    fit: "strict",
    kind: n.kind,
    ...n.character_id ? { characterId: n.character_id } : {},
    text: n.text,
    volume: 1
  };
}
function ui(e, t, n, o) {
  return e.find(
    (s) => s.storyboardItem?.sourceNodeId === t && s.storyboardItem.itemType === n && s.storyboardItem.itemId === o
  );
}
function Ka(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), o = t && n ? t : Number(e?.asset?.id || 0), s = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!o || !s))
    return {
      assetId: o,
      versionId: s,
      label: e?.title || "素材"
    };
}
function sd(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
const Bu = "invalidated";
function qa(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, o = {};
  return yo(o, "execution_id", e?.execution_id), yo(o, "run_id", e?.run_id || n?.run_id), Li(o, "request_id", e?.request_id), yo(o, "flow_run_id", e?.flow_run_id), yo(
    o,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), yo(o, "asset_id", e?.asset_id || t?.id), yo(
    o,
    "version_id",
    e?.version_id || n?.id || t?.version_id
  ), yo(
    o,
    "release_id",
    e?.release_id || n?.release_id
  ), Li(o, "role", e?.role || t?.role), Li(o, "status", e?.status), Object.keys(o).length > 0 && (o.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(o).length > 0 ? o : void 0;
}
function Gg(e, t, n, o = !0) {
  const s = o || e?.resultRef?.status === Bu || id(e, n), r = e?.resultRef;
  if (r) {
    const i = Number(t.execution_id || 0), c = Number(r.execution_id || 0);
    if (i > 0 && c > 0 && c >= i)
      return c > i || s;
    const a = Number(t.run_id || 0), d = Number(r.run_id || 0);
    if (a > 0 && d > 0 && d >= a)
      return d > a || s;
    const l = Number(n?.node_run_id || 0), y = Number(r.node_run_id || 0);
    if (l > 0 && y > 0 && y >= l)
      return y > l || s;
    const v = String(n?.request_id || t.request_id || "");
    if (v && r.request_id === v)
      return s;
  }
  return id(e, n);
}
function id(e, t) {
  if (String(t?.status || "").trim().toLowerCase() !== "success")
    return !1;
  const n = Number(
    e?.asset?.id || e?.resultRef?.asset_id || 0
  ), o = Number(
    e?.asset?.version_id || e?.asset?.version?.id || e?.resultRef?.version_id || 0
  ), s = Number(t?.asset_id || 0), r = Number(t?.version_id || 0);
  return n > 0 && n === s && o > 0 && r > 0 && o !== r;
}
function Wg(e) {
  const t = e?.resultRef;
  if (!e || !t)
    return null;
  const n = Number(t.asset_id || 0), o = String(t.node_run_id ? e.nodeId : "").trim();
  return {
    sourceRunId: Number(t.run_id || 0),
    sourceNodeRunId: Number(t.node_run_id || 0),
    sourceAssetId: n,
    sourceVersionId: Number(t.version_id || 0),
    sourceReleaseId: Number(t.release_id || 0),
    sourceRequestId: String(t.request_id || ""),
    sourceNodeKey: o,
    sourceNodeType: String(e.type || ""),
    sourceStatus: String(t.status || ""),
    sourceKey: o || (n > 0 ? `asset:${n}` : "") || ""
  };
}
function yo(e, t, n) {
  const o = Number(n || 0);
  o > 0 && (e[t] = o);
}
function Li(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
function ad(e) {
  const t = e.storyboardItem, { prompt: n, ...o } = e.composerDraft?.paramValues || {}, s = [
    o,
    e.composerDraft?.selectedTargetId,
    t.shotImageMode,
    t.sharedEndShotId || "",
    t.sharedStartShotId || "",
    t.referenceNodeIds || [],
    t.dependencyNodeIds || [],
    t.externalReferenceAssetIds || [],
    t.generatedInputs?.visualContext || "",
    (e.composerDraft?.promptContent?.parts || []).flatMap(
      (r) => r.type === "reference" && !(r.ref_origin === "storyboard" && r.ref_origin_id) ? [[r.ref_type, r.ref_id, r.ref_version_id, r.usage, r.ref_media_index, r.ref_media_url, r.ref_media_items, r.ref_media_excluded]] : []
    ),
    t.generatedPrompt,
    t.continuityAnchor || "",
    t.itemType === "shot" && t.shotDuration || 0,
    // 只比较手动改写；打开参数面板把生成提示词写回草稿不算改动。
    hu(e.composerDraft?.prompt, t.generatedPrompt).trim()
  ];
  return t.itemType === "shot_image" ? [
    ...s,
    t.frameMediaItems || [],
    t.imageSequenceFrames || []
  ] : s;
}
function cd(e) {
  const t = e.resultRef?.asset_id || e.asset?.id, n = e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id;
  return JSON.stringify(t && n ? [t, n] : [
    e.asset?.version?.content,
    e.resultOutput
  ]);
}
function Hg(e) {
  const t = e.resultRef?.asset_id || e.asset?.id, n = e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id;
  return t && n ? `${t}:${n}` : "";
}
function $i(e) {
  const t = e?.resultRef;
  return t?.execution_id ? `execution:${t.execution_id}` : t?.run_id ? `run:${t.run_id}` : "";
}
function ua(e, t, n, o) {
  const s = new Map(t.map((y) => [y.id, y])), r = /* @__PURE__ */ new Set(), i = (y) => y.storyboardItem?.sourceNodeId === n;
  for (const y of e) {
    if (!i(y)) continue;
    const v = y.storyboardItem.itemType;
    if (!["character", "scene", "prop", "shot_image", "shot", "speech", "subtitle"].includes(v)) continue;
    const b = s.get(y.id);
    (!b || JSON.stringify(ad(y)) !== JSON.stringify(ad(b))) && r.add(y.id);
  }
  const c = /* @__PURE__ */ new Map();
  for (const y of [...e, ...t]) {
    const v = y.storyboardItem;
    if (v)
      for (const b of [
        ...v.referenceNodeIds || [],
        ...v.dependencyNodeIds || []
      ]) {
        const I = c.get(b) || /* @__PURE__ */ new Set();
        I.add(y.id), c.set(b, I);
      }
  }
  const a = t.filter(
    (y) => y.storyboardItem?.itemType === "video_compose"
  );
  for (const y of [...e, ...t]) {
    if (!["shot", "speech", "subtitle"].includes(y.storyboardItem?.itemType || "")) continue;
    const v = c.get(y.id) || /* @__PURE__ */ new Set();
    a.filter(
      (b) => b.storyboardItem.sourceNodeId === y.storyboardItem.sourceNodeId
    ).forEach((b) => v.add(b.id)), c.set(y.id, v);
  }
  const d = (y, v = "") => {
    const b = [...y], I = new Set(b);
    for (let R = 0; R < b.length; R += 1)
      for (const k of c.get(b[R]) || [])
        I.has(k) || s.get(b[R])?.storyboardItem?.itemType === "shot_image" && s.get(k)?.storyboardItem?.itemType === "shot_image" || (I.add(k), !(v && $i(s.get(k)) === v) && (r.add(k), b.push(k)));
  };
  d(r);
  for (const y of o || []) {
    if (!y.storyboardItem) continue;
    const v = s.get(y.id);
    if (!v || cd(y) === cd(v)) continue;
    const b = $i(v), I = !Hg(y) || b !== $i(y) ? b : "";
    d([v.id], I);
  }
  let l = !1;
  return t.forEach((y, v) => {
    if (!r.has(y.id)) return;
    const b = zu(y);
    b !== y && (t[v] = b, l = !0);
  }), l;
}
function zu(e) {
  if (!e.asset && !e.resultRef && e.resultOutput == null) return e;
  const t = { ...e };
  if (delete t.asset, e.resultRef) {
    const { asset_id: n, version_id: o, ...s } = e.resultRef;
    t.resultRef = { ...s, status: Bu };
  }
  return delete t.resultOutput, delete t.resultView, t;
}
function Yg(e, t) {
  return e ? t ? "materialize" : "defer-materialize" : "refresh";
}
function Jg(e, t, n, o) {
  return !t || la(e, t) !== la(n, o);
}
function la(e, t) {
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
    t.shots.map((n) => [
      n.id,
      n.shot_image_mode,
      n.shared_end_shot_id,
      n.material_ids,
      n.continue_previous,
      n.match_previous,
      n.continuity_state,
      n.start_framing,
      n.end_framing
    ])
  ]);
}
function Xg(e) {
  return !!e.storyboardItem && tm(
    e.composerDraft?.prompt,
    e.storyboardItem?.generatedPrompt
  );
}
function Zg(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), o = String(e.composerDraft?.prompt || "");
  if (!o.trim() || o.trim() === n)
    return null;
  const s = new Set(e.storyboardItem?.referenceNodeIds || []), r = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor,
    sharedEndShotId: e.storyboardItem.sharedEndShotId,
    sharedStartShotId: e.storyboardItem.sharedStartShotId,
    shotId: e.storyboardItem.shotId
  } : void 0, i = t.filter((b) => s.has(b.id)).map((b) => $u(b, r, e.storyboardItem?.sourceNodeId)).filter((b) => !!b), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = Wn(
    e.composerDraft?.promptContent
  ).filter((b) => c.has(b.refId)), d = t.find(
    (b) => b.id === e.storyboardItem?.sourceNodeId
  ), y = ((d ? jt([
    d.asset?.version?.content,
    d.resultOutput
  ]) : null)?.references || []).filter((b) => c.has(b.asset_id)).map(Vu), v = [
    ...i,
    ...a,
    ...y
  ];
  return {
    ...e.composerDraft || {},
    prompt: "",
    promptContent: v.length ? wr("", v) : void 0,
    paramValues: qu(
      e.composerDraft?.paramValues,
      o,
      ""
    )
  };
}
function Sn(e, t, n) {
  const o = pd(n);
  return e.find(
    (s) => Number(s.id || 0) > 0 && String(s.kind || "").trim().toLowerCase() === t && pd(s.outputType) === o
  ) || null;
}
function dd(e) {
  return Uu(e, "materialize");
}
function Vi(e) {
  return Uu(e, "refresh");
}
function Uu(e, t) {
  let n = e.canvas;
  const o = e.sourceNodeIds ? new Set(e.sourceNodeIds) : null;
  for (const s of e.canvas.nodes) {
    if (t === "materialize" && s.id !== e.sourceNodeId || t === "refresh" && o?.has(s.id) === !1)
      continue;
    if (s.type === "power" && s.outputType === "setting") {
      n = yy({ canvas: n, settingNode: s, assetCate: e.assetCate, powers: e.powers });
      continue;
    }
    if (s.type !== "power" || !Do(
      s.power,
      s.kind,
      s.outputType
    ))
      continue;
    const r = jt([
      s.asset?.version?.content,
      s.resultOutput
    ]);
    if (!r || !ci(r))
      continue;
    const i = n.nodes.find((y) => y.id === s.id) || s;
    if (t === "refresh" && (i.storyboardFramePlanVersion || 0) >= Ys) {
      n = ld({
        canvas: n,
        previousNodes: e.previousNodes,
        storyboardNode: i,
        storyboard: r,
        assetCate: e.assetCate,
        powers: e.powers,
        framePlanVersion: es(
          i.storyboardFramePlanVersion
        )
      });
      continue;
    }
    const c = Qg(
      i,
      r
    ), a = es(
      i.storyboardFramePlanVersion
    ) || 0, d = i.storyboardMaterializedSignature !== c || a < Ys, l = Cp(
      i.storyboardFramePlanVersion,
      d
    );
    n = d ? ty({
      canvas: n,
      storyboardNode: i,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: l
    }) : ld({
      canvas: n,
      storyboardNode: i,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: l
    }), n = ey(
      n,
      i.id,
      c,
      l
    );
  }
  return li({ canvas: n, assetCate: e.assetCate, powers: e.powers });
}
function ud(e, t) {
  if (e?.outputType === "setting") {
    const r = di({ ...e, ...t });
    return !!(r && e.storyboardMaterializedSignature !== Pe(JSON.stringify(r)));
  }
  if (!e || e.type !== "power" || !Do(e.power, e.kind, e.outputType))
    return !1;
  const n = { ...e, ...t }, o = jt([
    n.asset?.version?.content,
    n.resultOutput
  ]);
  if (!o || !ci(o))
    return !1;
  const s = jt([
    e.asset?.version?.content,
    e.resultOutput
  ]);
  return (e.storyboardFramePlanVersion || 0) < Ys || Jg(
    e,
    s,
    n,
    o
  );
}
function Qg(e, t) {
  return Pe(la(e, t));
}
function ey(e, t, n, o) {
  const s = e.nodes.findIndex(
    (c) => c.id === t
  ), r = es(o);
  if (s < 0 || e.nodes[s].storyboardMaterializedSignature === n && es(
    e.nodes[s].storyboardFramePlanVersion
  ) === r)
    return e;
  const i = [...e.nodes];
  return i[s] = {
    ...i[s],
    storyboardMaterializedSignature: n,
    storyboardFramePlanVersion: r
  }, { ...e, nodes: i };
}
function ld(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Map();
  t.forEach((c, a) => {
    const d = c.storyboardItem;
    d?.sourceNodeId === e.storyboardNode.id && n.set(
      pr(d.sourceNodeId, d.itemType, d.itemId),
      a
    );
  });
  let o = !1;
  const s = Ea(
    t,
    e.canvas.edges,
    e.storyboardNode.id
  ), r = {
    framePlanVersion: e.framePlanVersion,
    settingItemKeys: new Set(s.keys())
  }, i = Js.filter(
    (c) => c.enabled(e.storyboard, r)
  );
  for (const c of i) {
    const a = c.local ? null : Sn(e.powers, c.powerKind, c.outputType);
    for (const d of c.items(e.storyboard, r)) {
      const l = n.get(
        pr(
          e.storyboardNode.id,
          d.type,
          d.id
        )
      ) ?? -1;
      if (l < 0)
        continue;
      const y = Lu(
        d,
        t,
        e.storyboardNode.id,
        s,
        e.storyboard
      ), v = t[l], b = Wa(
        v,
        v.groupId || "",
        y,
        c,
        a,
        { preserveStructure: !0, nodes: t }
      );
      b !== v && (t[l] = b, o = !0);
    }
    (c.itemType === "shot_image" || c.itemType === "shot") && (o = ua(
      e.canvas.nodes,
      t,
      e.storyboardNode.id,
      e.previousNodes
    ) || o);
  }
  if (ru(e.storyboard)) {
    const c = Yu({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Sn(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    o = o || !!c?.changed;
  }
  return o ? { ...e.canvas, nodes: t } : e.canvas;
}
function ty(e) {
  const t = es(e.framePlanVersion) || Ys, n = [...e.canvas.nodes], o = /* @__PURE__ */ new Set(), s = new Set(
    Js.map((k) => k.itemType)
  ), r = Ea(
    n,
    e.canvas.edges,
    e.storyboardNode.id
  ), i = {
    framePlanVersion: t,
    settingItemKeys: new Set(r.keys())
  }, c = Js.filter(
    (k) => k.enabled(e.storyboard, i)
  ), a = ru(
    e.storyboard
  );
  s.add("video_compose"), a && o.add(
    pr(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const d = c.map((k) => ({
    spec: k,
    items: k.items(e.storyboard, i),
    power: k.local ? null : Sn(e.powers, k.powerKind, k.outputType)
  }));
  for (const { items: k } of d)
    for (const D of k)
      o.add(
        pr(e.storyboardNode.id, D.type, D.id)
      );
  let l = !1;
  for (let k = n.length - 1; k >= 0; k -= 1) {
    const D = n[k].storyboardItem;
    !D || D.sourceNodeId !== e.storyboardNode.id || !s.has(D.itemType) || o.has(
      pr(
        D.sourceNodeId,
        D.itemType,
        D.itemId
      )
    ) || (n.splice(k, 1), l = !0);
  }
  const y = Au({
    sourceNode: e.storyboardNode,
    groups: d.map(({ spec: k, items: D, power: A }) => ({
      key: k.key,
      layoutIndex: k.layoutIndex,
      itemCount: D.length,
      power: A,
      powerKind: k.powerKind,
      direction: k.direction
    }))
  });
  let v = xo(n, e.canvas.nextNodeNo);
  l = l || v !== e.canvas.nextNodeNo;
  for (const { spec: k, items: D, power: A } of d) {
    const T = y.get(k.key);
    if (!T)
      continue;
    const V = ju({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: k,
      layout: T,
      assetCate: e.assetCate
    });
    l = l || V.changed;
    for (const ge of D) {
      const $ = Lu(
        ge,
        n,
        e.storyboardNode.id,
        r,
        e.storyboard
      ), q = n.findIndex(
        (Z) => yr(
          Z,
          e.storyboardNode.id,
          $.type,
          $.id
        )
      );
      if (q >= 0) {
        const Z = n[q], me = Wa(
          Z,
          V.node.id,
          $,
          k,
          A,
          { nodes: n }
        );
        me !== Z && (n[q] = me, l = !0);
        continue;
      }
      const z = Ku({
        nodes: n,
        group: V.node,
        storyboardNode: e.storyboardNode,
        item: $,
        assetCate: e.assetCate,
        spec: k,
        power: A
      });
      z.nodeNo = v++, n.push(z), l = !0;
    }
    (k.itemType === "shot_image" || k.itemType === "shot") && (l = ua(
      e.canvas.nodes,
      n,
      e.storyboardNode.id
    ) || l);
    const te = D.map(
      (ge) => n.find(
        ($) => $.groupId === V.node.id && yr(
          $,
          e.storyboardNode.id,
          ge.type,
          ge.id
        )
      )
    ).filter((ge) => !!ge), G = Du(
      V.node,
      te
    );
    for (const ge of te) {
      const $ = G.positions.get(ge.id);
      if (!$ || ge.x === $.x && ge.y === $.y)
        continue;
      const q = n.indexOf(ge);
      n[q] = { ...ge, ...$ }, l = !0;
    }
    const re = n.findIndex((ge) => ge.id === V.node.id), F = n[re];
    (F.width !== G.width || F.height !== G.height) && (n[re] = {
      ...F,
      width: G.width,
      height: G.height
    }, l = !0);
  }
  const b = new Set(c.map((k) => k.key));
  for (let k = n.length - 1; k >= 0; k -= 1) {
    const D = n[k];
    D.type !== "group" || D.group?.origin !== "script" || D.group.sourceNodeId !== e.storyboardNode.id || !D.group.syncKey || b.has(
      D.group.syncKey
    ) || (n.splice(k, 1), l = !0);
  }
  l = ua(
    e.canvas.nodes,
    n,
    e.storyboardNode.id
  ) || l;
  const I = a ? Yu({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Sn(e.powers, "video", "video_compose"),
    nextNodeNo: v
  }) : null;
  I && (v = I.nextNodeNo, l = l || I.changed);
  let R = uy(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    c
  );
  return R = ly(
    R,
    n,
    e.storyboardNode.id,
    r
  ), R = I ? fy(
    R,
    n,
    e.storyboardNode.id,
    I.node.id,
    c
  ) : py(R, e.storyboardNode.id), R !== e.canvas.edges && (l = !0), li({
    canvas: l ? { ...e.canvas, nextNodeNo: v, nodes: n, edges: R } : e.canvas,
    assetCate: e.assetCate,
    powers: e.powers
  });
}
function Lu(e, t, n, o, s) {
  const r = s.chapter_boundary, i = s.shots[0], c = r && e.shotId === i?.id && (r.connection === "continue" ? e.type === "shot" || e.type === "shot_image" && e.frameRole === "end" : e.type === "shot_image" && e.frameRole === "start");
  c && e.type === "shot" && (e = { ...e, sharedStartShotId: r.shot_id });
  const a = (T) => (T || []).map(
    (V) => t.find(
      (te) => yr(te, n, V.type, V.id)
    ) || o.get(xp(V.type, V.id))
  ).filter((V) => !!V), d = (e.dependencyItems || []).map(
    (T) => a([T])[0]?.id || "script-item-" + Pe([n, T.type, T.id].join("\0"))
  ), l = a(e.referenceItems), y = l.map((T) => T.id);
  if (c && r) {
    const T = Sp(r.shot_id, "end"), V = t.find(
      (G) => yr(G, r.node_id, "shot_image", T)
    ), te = V?.id || "script-item-" + Pe([r.node_id, "shot_image", T].join("\0"));
    d.unshift(te), y.unshift(te), V && l.unshift(V);
  }
  const v = e.externalReferences || [], b = {
    ...e,
    dependencyNodeIds: d,
    referenceNodeIds: y
  };
  if (!["character", "scene", "prop", "shot_image", "shot"].includes(e.type))
    return b;
  const I = ny(
    e.prompt,
    l,
    v
  ), R = I === e.prompt ? b : { ...b, prompt: I }, k = v.map(
    Vu
  );
  if (k.push(
    ...l.map((T) => $u(T, e, n)).filter((T) => !!T)
  ), !k.length)
    return R;
  const D = wr(
    I,
    k
  ), A = zf(D);
  return Wd(D) ? { ...b, prompt: A, promptContent: D } : { ...R, prompt: A };
}
function ny(e, t, n = []) {
  const o = [], s = /* @__PURE__ */ new Set();
  for (const r of n) {
    const i = Bc(r.label), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  for (const r of t) {
    const i = Bc(r.title), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  return [o.join(" "), e].filter(Boolean).join(" ").trim();
}
function $u(e, t, n) {
  const o = Number(e.resultRef?.asset_id || e.asset?.id || 0), s = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!o || !s)
    return null;
  const r = _p(
    e.storyboardItem?.frameMediaItems
  ), i = Rp(
    e.storyboardItem?.shotImageMode
  ), c = oy(
    e.storyboardItem?.itemType,
    t,
    r,
    e.storyboardItem?.shotId || e.storyboardItem?.itemId,
    e.storyboardItem?.sourceNodeId !== n
  );
  return {
    refType: "asset",
    refId: o,
    versionId: s,
    label: e.title,
    origin: "storyboard",
    originID: e.id,
    ...c,
    ...!c.mediaIndex && !c.mediaItems ? {
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? i === "references" ? "reference" : ra(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function oy(e, t, n, o, s = !1) {
  if (e !== "shot_image" || !n.length)
    return {};
  if (t?.type === "shot" && t.sharedEndShotId) {
    const r = n.find((i) => i.frameRole === "start");
    return {
      mediaItems: r ? [
        {
          url: "",
          index: r.mediaIndex,
          usage: o === t.sharedEndShotId ? "lastFrame" : "firstFrame"
        }
      ] : []
    };
  }
  if (t?.type === "shot") {
    if (t.sharedStartShotId) {
      const r = o === t.sharedStartShotId && (s || o !== t.shotId);
      return {
        mediaItems: (r ? n.filter((c) => c.frameRole === "end") : n).map((c) => ({
          url: "",
          index: c.mediaIndex,
          usage: r ? "firstFrame" : ra(c.frameRole)
        }))
      };
    }
    return {
      mediaItems: n.map((r) => ({
        url: "",
        index: r.mediaIndex,
        usage: ra(r.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = Wc(n, "end") || Wc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function Vu(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function ju(e) {
  const t = Ga(
    e.nodes,
    e.storyboardNode.id,
    e.spec.key
  );
  if (t) {
    const s = t.title !== e.spec.title;
    if (t.group?.layoutKey === e.layout.layoutKey && !s)
      return { node: t, changed: !1 };
    if (t.group?.layoutKey === e.layout.layoutKey) {
      const a = { ...t, title: e.spec.title };
      return e.nodes[e.nodes.indexOf(t)] = a, { node: a, changed: !0 };
    }
    const r = e.layout.bounds.x - t.x, i = e.layout.bounds.y - t.y;
    let c = t;
    for (const [a, d] of e.nodes.entries()) {
      if (d.id !== t.id && d.groupId !== t.id)
        continue;
      const l = {
        ...d,
        x: d.x + r,
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
      e.nodes[a] = l, d.id === t.id && (c = l);
    }
    return { node: c, changed: !0 };
  }
  const n = e.layout.bounds, o = mn("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return o.id = Ya(
    e.nodes,
    `script-group-${Pe(e.storyboardNode.id)}-${e.spec.key}`
  ), o.title = e.spec.title, o.width = n.width, o.height = n.height, o.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(o), { node: o, changed: !0 };
}
function Ga(e, t, n) {
  return e.find(
    (o) => o.type === "group" && o.group?.origin === "script" && o.group.sourceNodeId === t && o.group.syncKey === n
  );
}
function Ku(e) {
  const t = mn(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = Ya(
    e.nodes,
    `script-item-${Pe(
      pr(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Ma({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${my(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: "",
    promptContent: Gu(
      "",
      void 0,
      e.item.promptContent
    ),
    paramValues: e.item.paramValues
  }, t.storyboardItem = Wu(
    e.storyboardNode.id,
    e.item
  );
  const n = Mg(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function Wa(e, t, n, o, s, r = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = String(e.composerDraft?.prompt || ""), a = hu(
    c,
    i.generatedPrompt
  ), d = a !== c, l = ry(
    e.composerDraft?.paramValues,
    c,
    a,
    n.paramValues,
    n.type === "speech" ? i.generatedInputs?.voice : void 0,
    n.type === "speech"
  ), y = l !== e.composerDraft?.paramValues, v = r.nodes || [], b = ay(
    e,
    v
  ), I = Gu(
    a,
    b,
    n.promptContent,
    cy(
      e,
      n,
      v,
      b
    ),
    v
  ), R = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(I || null), k = Wu(i.sourceNodeId, n), D = r.preserveStructure && e.titleMode === "manual" ? e.title : n.title, A = e.title !== D, T = i.generatedPrompt !== n.prompt, V = r.preserveStructure ? e.groupId || "" : t, te = !e.power && !!s, G = e.kind !== o.powerKind, re = e.outputType !== o.outputType, F = o.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === V && !d && !y && !R && !A && !te && !G && !re && !F && Hu(i, k) ? e : {
    ...e,
    title: D,
    kind: o.powerKind,
    outputType: o.outputType,
    ...te ? {
      power: s || void 0,
      subtitle: s?.output?.name || s?.name || e.subtitle
    } : {},
    description: T || te ? n.prompt : e.description,
    ...o.local ? { resultOutput: n.localOutput } : {},
    groupId: V,
    composerDraft: d || y || R ? {
      ...e.composerDraft || {},
      prompt: a,
      promptContent: I,
      paramValues: l
    } : e.composerDraft,
    storyboardItem: k
  };
}
function qu(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let o;
  for (const [s, r] of Object.entries(e))
    r === t && (o ||= { ...e }, o[s] = n);
  return o || e;
}
function ry(e, t, n, o, s, r = !1) {
  let i = qu(
    e,
    t,
    n
  );
  for (const [c, a] of Object.entries(o || {}))
    r && c === "voice" && String(e?.voice || "") !== String(s || "") || i?.[c] !== a && (i = { ...i || {}, [c]: a });
  return r && !o?.voice && s && e?.voice === s && (i = { ...i || {} }, delete i.voice), i;
}
function Gu(e, t, n, o, s = []) {
  const r = Wn(n), i = Wn(o);
  if (!r.length && !i.length)
    return t;
  const c = new Map(
    i.map((v) => [
      $r(v),
      v
    ])
  ), a = new Map(
    r.map((v) => [
      $r(v),
      v
    ])
  ), d = Wn(t), l = new Set(d.map($r)), y = d.flatMap((v) => {
    const b = $r(v), I = c.get(b);
    if (!I)
      return [v];
    const R = a.get(b);
    return R ? [
      sy(v, I, R, s)
    ] : dy(v, I) ? [] : [v];
  });
  for (const v of r) {
    const b = $r(v);
    !l.has(b) && !c.has(b) && !d.some(
      (I) => I.refType === v.refType && I.refId === v.refId
    ) && y.push(v);
  }
  return wr(e, y);
}
function $r(e) {
  return JSON.stringify([
    e.refType,
    e.origin === "storyboard" && e.originID ? null : e.refId,
    e.origin || "",
    e.originID || ""
  ]);
}
function sy(e, t, n, o) {
  if (e.refId !== t.refId && e.refId !== n.refId)
    return e;
  let s = n;
  for (const r of [
    "usage",
    "purpose",
    "mediaURL",
    "mediaIndex",
    "mediaItems",
    "contentSelection"
  ])
    JSON.stringify(e[r] ?? null) !== JSON.stringify(t[r] ?? null) && (s = { ...s, [r]: e[r] });
  return e.contentSelection ? { ...s, versionId: e.versionId } : iy(e, s, o);
}
function iy(e, t, n) {
  if (e.refId === t.refId && e.versionId === t.versionId || !t.mediaURL && !t.mediaIndex && !t.mediaItems?.length)
    return t;
  const o = n.find((a) => a.id === t.originID), s = o?.kind, r = o && (s === "image" || s === "video" || s === "audio") ? pu(xg(o), s) : [], i = (a, d) => {
    const l = d && d > 0 ? d - 1 : r.indexOf(a || "");
    return r[l] ? { url: r[l], index: l + 1 } : null;
  };
  if (t.mediaItems?.length) {
    const a = t.mediaItems.map((d) => {
      const l = i(d.url, d.index);
      return l ? { ...d, ...l } : null;
    });
    return a.every((d) => d !== null) ? {
      ...t,
      mediaURL: void 0,
      mediaIndex: void 0,
      mediaItems: a,
      mediaCount: r.length
    } : e;
  }
  const c = i(t.mediaURL, t.mediaIndex);
  return c ? {
    ...t,
    mediaURL: c.url,
    mediaIndex: c.index,
    mediaCount: r.length
  } : e;
}
function ay(e, t) {
  if (e.storyboardItem?.generatedInputs)
    return e.composerDraft?.promptContent;
  const n = new Set(e.storyboardItem?.referenceNodeIds || []), o = Wn(
    e.composerDraft?.promptContent
  );
  let s = !1;
  const r = o.map((i) => {
    if (i.originID)
      return i;
    const c = t.find(
      (a) => n.has(a.id) && Number(a.resultRef?.asset_id || a.asset?.id || 0) === i.refId
    );
    return c ? (s = !0, { ...i, origin: "storyboard", originID: c.id }) : i;
  });
  return s ? wr(
    String(e.composerDraft?.prompt || ""),
    r
  ) : e.composerDraft?.promptContent;
}
function cy(e, t, n, o) {
  const s = e.storyboardItem;
  if (s?.generatedInputs)
    return s.generatedInputs.referenceContent;
  const r = new Set(s?.referenceNodeIds || []), i = /* @__PURE__ */ new Set([
    ...s?.externalReferenceAssetIds || [],
    ...n.filter((l) => r.has(l.id)).map(
      (l) => Number(l.resultRef?.asset_id || l.asset?.id || 0)
    )
  ]), c = new Set(
    Wn(t.promptContent).map(
      (l) => l.refId
    )
  ), a = new Set(s?.externalReferenceAssetIds || []), d = Wn(o).filter(
    (l) => i.has(l.refId) && !c.has(l.refId)
  ).map(
    (l) => a.has(l.refId) ? {
      ...l,
      usage: void 0,
      purpose: void 0,
      mediaURL: void 0,
      mediaIndex: void 0,
      mediaItems: void 0,
      contentSelection: void 0
    } : l
  );
  return d.length ? wr("", d) : void 0;
}
function dy(e, t) {
  const n = (o) => [
    o.refId,
    o.contentSelection ? o.versionId || 0 : null,
    o.mediaURL || "",
    o.mediaIndex || 0,
    o.mediaItems || [],
    o.contentSelection || null,
    o.usage || "",
    o.purpose || ""
  ];
  return JSON.stringify(n(e)) === JSON.stringify(n(t));
}
function Wu(e, t) {
  return {
    sourceNodeId: e,
    itemType: t.type,
    itemId: t.id,
    generatedPrompt: t.prompt,
    generatedInputs: {
      referenceContent: Wd(t.promptContent) ? wr(
        "",
        Wn(t.promptContent)
      ) : void 0,
      visualContext: t.visualContext,
      voice: t.type === "speech" ? String(t.paramValues?.voice || "") : void 0
    },
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
    sharedEndShotId: t.sharedEndShotId,
    sharedStartShotId: t.sharedStartShotId,
    optional: t.optional
  };
}
function Hu(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && JSON.stringify(e.generatedInputs || null) === JSON.stringify(t.generatedInputs || null) && ho(e.dependencyNodeIds, t.dependencyNodeIds) && ho(e.referenceNodeIds, t.referenceNodeIds) && ho(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && ho(e.frameMediaItems, t.frameMediaItems) && ho(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && ho(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && ho(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && e.sharedEndShotId === t.sharedEndShotId && e.sharedStartShotId === t.sharedStartShotId && !!e.optional == !!t.optional;
}
function yr(e, t, n, o) {
  const s = e.storyboardItem;
  return !!(s && s.sourceNodeId === t && s.itemType === n && s.itemId === o);
}
function uy(e, t, n, o) {
  const s = o.map((a) => ({
    spec: a,
    group: t.find(
      (d) => d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId === n && d.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), r = `script-edge-${Pe(n)}-`, i = e.filter((a) => !a.id.startsWith(r));
  for (const { spec: a, group: d } of s) {
    const l = a.direction === "upstream", y = (a.sourceGroupKeys || []).map((b) => Ga(t, n, b)).filter((b) => !!b), v = l ? [d] : y.length ? y : [t.find((b) => b.id === n)].filter(
      (b) => !!b
    );
    for (const b of v) {
      const I = b.id, R = l ? n : d.id;
      i.push({
        id: Ja(i, `${r}${a.key}-${Pe(I)}`),
        from: I,
        to: R,
        logicalFrom: I,
        logicalTo: R,
        purpose: "structure",
        executionMode: l ? void 0 : "manual"
      });
    }
  }
  const c = Mt(t, i);
  return Ha(e, c) ? e : c;
}
function ly(e, t, n, o) {
  const s = `script-item-edge-${Pe(n)}-`, r = e.filter((d) => !d.id.startsWith(s)), i = t.filter(
    (d) => d.storyboardItem?.sourceNodeId === n && (!!d.groupId || d.storyboardItem.itemType === "video_compose")
  ), c = new Map(
    [...o.values(), ...i].map((d) => [d.id, d])
  );
  for (const d of i)
    for (const l of d.storyboardItem?.dependencyNodeIds || []) {
      const y = c.get(l);
      !y || y.id === d.id || r.push({
        id: Ja(
          r,
          `${s}${Pe(y.id)}-${Pe(d.id)}`
        ),
        from: y.id,
        to: d.id,
        logicalFrom: y.id,
        logicalTo: d.id,
        purpose: "dependency",
        executionMode: y.groupId && y.groupId === d.groupId ? void 0 : "manual"
      });
    }
  const a = Mt(t, r);
  return Ha(e, a) ? e : a;
}
function Yu(e) {
  const t = e.nodes.find(
    (i) => yr(
      i,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = Ou({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), o = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: ""
  };
  if (t) {
    const i = e.preservePosition ? { x: t.x, y: t.y } : fd(e.nodes, e.storyboardNode), c = !t.power && !!e.power, a = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), d = t.x !== i.x || t.y !== i.y;
    if (!c && !a && !d && t.kind === "video" && t.outputType === "video_compose" && Hu(t.storyboardItem, o))
      return {
        node: t,
        changed: !1,
        nextNodeNo: e.nextNodeNo
      };
    const l = {
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
      storyboardItem: o
    }, y = t.composerDraft?.videoComposition, b = y && JSON.stringify([y.clips, y.audioTracks, y.settings]) !== JSON.stringify([n.clips, n.audioTracks, n.settings]) ? zu(l) : l;
    return e.nodes[e.nodes.indexOf(t)] = b, {
      node: b,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const s = fd(
    e.nodes,
    e.storyboardNode
  ), r = mn(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return r.id = Ya(
    e.nodes,
    `script-compose-${Pe(e.storyboardNode.id)}`
  ), r.nodeNo = e.nextNodeNo, r.title = "视频合成", r.kind = "video", r.outputType = "video_compose", r.description = "按镜头顺序合成画面、原声和配音。", e.power || (r.subtitle = "未配置视频合成能力", r.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), r.composerDraft = { videoComposition: n }, r.storyboardItem = o, e.nodes.push(r), {
    node: r,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function fd(e, t) {
  const n = e.filter(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t.id
  ), o = n.reduce(
    (r, i) => Math.max(r, i.x + i.width),
    t.x + t.width + 160
  ), s = n.reduce(
    (r, i) => Math.min(r, i.y),
    t.y
  );
  return { x: o + 72, y: s };
}
function fy(e, t, n, o, s) {
  const i = ["shots", "speech", "subtitles"].filter(
    (l) => s.some((y) => y.key === l)
  ).map((l) => Ga(t, n, l)).filter((l) => !!l), c = `script-compose-edge-${Pe(n)}-`, a = e.filter((l) => !l.id.startsWith(c));
  for (const l of i.length ? i : t.filter((y) => y.id === n))
    a.push({
      id: Ja(a, `${c}${Pe(l.id)}`),
      from: l.id,
      to: o,
      logicalFrom: l.id,
      logicalTo: o,
      purpose: "dependency",
      executionMode: "manual"
    });
  const d = Mt(t, a);
  return Ha(e, d) ? e : d;
}
function py(e, t) {
  const n = `script-compose-edge-${Pe(t)}-`, o = e.filter((s) => !s.id.startsWith(n));
  return o.length === e.length ? e : o;
}
function Ha(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((o) => [o.id, o]));
  return e.every((o) => {
    const s = n.get(o.id);
    return !!(s && o.from === s.from && o.to === s.to && (o.logicalFrom || "") === (s.logicalFrom || "") && (o.logicalTo || "") === (s.logicalTo || "") && (o.purpose || "") === (s.purpose || "") && (o.executionMode || "auto") === (s.executionMode || "auto") && (o.mediaUsage || "") === (s.mediaUsage || ""));
  });
}
function pr(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function Ya(e, t) {
  return Ju(new Set(e.map((n) => n.id)), t);
}
function Ja(e, t) {
  return Ju(new Set(e.map((n) => n.id)), t);
}
function Ju(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function Pe(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function pd(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function my(e) {
  return e.outputType === "speech" ? "语音合成" : e.powerKind === "image" ? "图片" : "视频";
}
function ho(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function Xa(e) {
  return Da(e.power, e.kind, e.outputType) && Qr(e, e.resultOutput)?.document || null;
}
function fa(e, t) {
  const n = e.edges.find((o) => (o.logicalFrom || o.from) === t && e.nodes.some((s) => s.id === (o.logicalTo || o.to) && s.outputType === "setting"));
  return n ? e.nodes.find((o) => o.id === (n.logicalTo || n.to)) : void 0;
}
function gy(e) {
  if (fa(e.canvas, e.storyNodeId)) return e.canvas;
  const t = e.canvas.nodes.find((s) => s.id === e.storyNodeId), n = Sn(e.powers, "text", "setting");
  if (!n) throw new Error("请先在后台配置设定能力");
  const o = mn(
    "power",
    e.assetCate,
    e.canvas.nodes.length,
    { x: t.x, y: t.y + t.height + 96 },
    { power: n }
  );
  return o.nodeNo = xo(e.canvas.nodes, e.canvas.nextNodeNo), o.title = t.title + " · 设定", o.composerDraft = {
    prompt: "根据故事大纲的角色、场景和道具生成全片共用设定，保留原有实体名称与身份。",
    promptContent: { version: 1, parts: [
      { type: "text", text: "根据故事大纲的角色、场景和道具生成全片共用设定，保留原有实体名称与身份。" },
      { type: "reference", ref_type: "asset", ref_id: Number(t.resultRef?.asset_id || t.asset?.id), ref_version_id: Number(t.resultRef?.version_id || t.asset?.version_id), label: t.title }
    ] }
  }, {
    ...e.canvas,
    nextNodeNo: o.nodeNo + 1,
    nodes: [...e.canvas.nodes, o],
    edges: [...e.canvas.edges, { id: crypto.randomUUID(), from: t.id, to: o.id, purpose: "media" }]
  };
}
function yy(e) {
  const t = di(e.settingNode);
  if (!t) return e.canvas;
  const n = Pe(JSON.stringify(t));
  if (e.settingNode.storyboardMaterializedSignature === n) return e.canvas;
  const o = e.settingNode, s = e.canvas.nodes.filter((l) => !l.storyboardItem || l.storyboardItem.sourceNodeId !== o.id || t.materials.some((y) => y.id === l.storyboardItem.itemId && y.type === l.storyboardItem.itemType)), r = Js.filter((l) => ["character", "scene", "prop"].includes(l.itemType)), i = Sn(e.powers, "image", "general"), c = Au({ sourceNode: o, groups: r.map((l) => ({ key: l.key, layoutIndex: l.layoutIndex, direction: l.direction, powerKind: l.powerKind, power: i, itemCount: t.materials.filter((y) => y.type === l.itemType).length })) });
  let a = xo(s, e.canvas.nextNodeNo);
  for (const l of r) {
    const y = c.get(l.key), v = ju({ nodes: s, storyboardNode: o, spec: l, layout: y, assetCate: e.assetCate }).node;
    for (const R of t.materials.filter((k) => k.type === l.itemType)) {
      const k = { id: R.id, type: R.type, title: R.name, prompt: R.prompt }, D = s.findIndex((V) => yr(V, o.id, k.type, k.id)), A = D >= 0 ? Wa(s[D], v.id, k, l, i, { nodes: s }) : Ku({ nodes: s, group: v, storyboardNode: o, item: k, assetCate: e.assetCate, spec: l, power: i }), T = { ...A, title: R.name, storyboardItem: { ...A.storyboardItem, generatedInputs: { ...A.storyboardItem.generatedInputs, voice: R.voice } } };
      D >= 0 ? s[D] = T : (T.nodeNo = a++, s.push(T));
    }
    const b = s.filter((R) => R.groupId === v.id), I = Du(v, b);
    for (const R of b) s[s.indexOf(R)] = { ...R, ...I.positions.get(R.id) };
  }
  s[s.findIndex((l) => l.id === o.id)] = { ...o, storyboardMaterializedSignature: n };
  const d = e.canvas.edges.filter((l) => s.some((y) => y.id === l.from) && s.some((y) => y.id === l.to));
  return { ...e.canvas, nextNodeNo: a, nodes: s, edges: Mt(s, d) };
}
function li(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    const o = Xa(n);
    if (!o) continue;
    const s = Number(n.asset?.id || n.resultRef?.asset_id), r = o.units.flatMap((T) => {
      const V = t.nodes.find(
        (G) => G.composerDraft?.promptContent?.parts.some(
          (re) => re.type === "reference" && re.ref_type === "asset" && re.ref_id === s && re.ref_content_selection?.kind === "unit" && re.ref_content_selection.ids.length === 1 && re.ref_content_selection.ids[0] === T.id
        )
      );
      if (!V) return [];
      const te = t.nodes.find(
        (G) => G.storyboardItem?.sourceNodeId === V.id && G.storyboardItem.itemType === "video_compose"
      );
      return [{ unit: T, board: V, composition: te }];
    }), i = Tp + Pe(n.id), c = t.nodes.find((T) => T.id === i);
    if (!c && r.length < 2) continue;
    const a = Sn(e.powers, "video", "video_compose"), d = c || mn(
      "power",
      e.assetCate,
      xo(t.nodes, t.nextNodeNo),
      { x: Math.max(...r.map(({ board: T }) => T.x + T.width)) + 360, y: n.y },
      a ? { power: a } : void 0
    ), l = c?.composerDraft?.videoComposition || Mp(), y = i + "-chapter-", v = (T) => T.sourceEdgeId?.startsWith(y), b = t.edges.filter((T) => !T.id.startsWith(y));
    let I = !!c && JSON.stringify(l.clips.filter(v).map((T) => T.id)) !== JSON.stringify(r.map(({ unit: T }) => T.id));
    const R = r.map(({ unit: T, board: V, composition: te }) => {
      const G = y + Pe(T.id);
      te && b.push({ id: G, from: te.id, to: i, purpose: "dependency" });
      const re = Number(te?.resultRef?.asset_id || te?.asset?.id || 0), F = Number(te?.resultRef?.version_id || te?.asset?.version_id || 0), ge = re && F ? { assetId: re, versionId: F, label: T.title } : void 0, $ = jt([V.asset?.version?.content, V.resultOutput]), q = l.clips.find((Z) => Z.id === T.id), z = $?.target_duration || q?.duration || 0;
      return c && q?.duration !== z && (I = !0), c && JSON.stringify(q?.visualVideo) !== JSON.stringify(ge) && (!c.resultRef?.execution_id || c.resultRef.execution_id !== te?.resultRef?.execution_id) && (I = !0), {
        ...q,
        id: T.id,
        title: T.title,
        sourceEdgeId: G,
        visualVideo: ge,
        originalAudioSource: q?.originalAudioSource && JSON.stringify(q.originalAudioSource) !== JSON.stringify(q.visualVideo) ? q.originalAudioSource : ge,
        duration: z,
        originalVolume: q?.originalVolume ?? 1,
        speechTracks: q?.speechTracks || [],
        subtitleTracks: q?.subtitleTracks || [],
        useOriginalVideo: q?.useOriginalVideo ?? !0,
        blockingIssues: ge ? [] : ["等待本章视频生成"],
        transitionToNext: q?.transitionToNext || { type: "none", durationMs: 0 }
      };
    }), k = [];
    let D = 0;
    for (const T of l.clips)
      v(T) ? D < R.length && k.push(R[D++]) : k.push(T);
    k.push(...R.slice(D));
    const A = {
      ...d,
      id: i,
      title: c?.title || "全片合成",
      kind: "video",
      outputType: "video_compose",
      description: "按章节顺序合成整部视频。",
      composerDraft: { ...d.composerDraft, videoComposition: { ...l, clips: k } }
    };
    I && (delete A.asset, delete A.resultRef, delete A.resultOutput, delete A.resultView), !(c && JSON.stringify(c) === JSON.stringify(A) && JSON.stringify(t.edges) === JSON.stringify(b)) && (t = {
      ...t,
      nodes: c ? t.nodes.map((T) => T.id === i ? A : T) : [...t.nodes, A],
      edges: b,
      nextNodeNo: xo([...t.nodes, A], t.nextNodeNo)
    });
  }
  return t;
}
function ji(e, t) {
  if (Do(e.power, e.kind, e.outputType))
    return e.composerDraft?.promptContent?.parts.find(
      (n) => n.type === "reference" && n.ref_type === "asset" && n.ref_id === t && n.ref_content_selection?.kind === "unit"
    );
}
function hy(e) {
  const t = e.canvas.nodes.find(
    (b) => b.id === e.storyNodeId
  ), n = t && Xa(t), o = Number(t?.asset?.id || t?.resultRef?.asset_id || 0), s = Number(
    t?.asset?.version_id || t?.asset?.version?.id || t?.resultRef?.version_id || 0
  );
  if (!t || !n || !o || !s)
    throw new Error("请先保存故事作品");
  const r = Sn(e.powers, "text", "storyboard");
  if (!r) throw new Error("请先配置分镜脚本能力");
  const i = n.units.filter(
    (b) => e.unitIds.includes(b.id)
  );
  if (!i.length || i.length !== new Set(e.unitIds).size || i.some((b) => !b.asset_id || !b.version_id || !b.has_body))
    throw new Error("请选择已生成正文的章节");
  const c = fa(e.canvas, t.id) ? e.canvas : gy(e), a = [...c.nodes], d = [...c.edges], l = fa(c, t.id);
  let y = xo(a, c.nextNodeNo);
  for (const b of i) {
    let I = a.find((k) => {
      const D = ji(k, o);
      return D?.type === "reference" && D.ref_content_selection?.ids.length === 1 && D.ref_content_selection.ids[0] === b.id;
    });
    I || (I = mn(
      "power",
      e.assetCate,
      y,
      {
        x: t.x + (t.width || 420) + 360,
        y: t.y + n.units.indexOf(b) * 460
      },
      { power: r }
    ), I.id = `chapter-${Pe(t.id)}-${Pe(b.id)}`, I.nodeNo = y++, I.title = b.title, I.titleMode = "manual", I.composerDraft = {
      prompt: "将本章正文改编为场景剧本，再按剧本生成分镜。",
      promptContent: {
        version: 1,
        parts: [
          {
            type: "text",
            text: "将本章正文改编为场景剧本，再按剧本生成分镜。"
          },
          {
            type: "reference",
            ref_type: "asset",
            ref_id: o,
            ref_version_id: s,
            label: b.title,
            ref_content_selection: { kind: "unit", ids: [b.id] }
          }
        ]
      }
    }, a.push(I));
    const R = a.indexOf(I);
    a[R] = {
      ...I,
      composerDraft: {
        ...I.composerDraft,
        promptContent: {
          version: 1,
          parts: I.composerDraft.promptContent.parts.map(
            (k) => k.type === "reference" && k.ref_type === "asset" && k.ref_id === o ? { ...k, ref_version_id: s } : k
          )
        }
      }
    };
    for (const k of [t.id, ...l ? [l.id] : []]) {
      const D = `chapter-source-${Pe(k)}-${Pe(I.id)}`;
      d.some((A) => A.id === D) || d.push({ id: D, from: k, to: I.id, purpose: "structure" });
    }
  }
  const v = new Set(
    a.filter((b) => ji(b, o)).map((b) => b.id)
  );
  for (let b = d.length - 1; b >= 0; b--) {
    const I = d[b];
    I.id.startsWith("chapter-next-") && v.has(I.from) && v.has(I.to) && d.splice(b, 1);
  }
  for (let b = 1; b < n.units.length; b++) {
    const I = n.units.slice(b - 1, b + 1).map(
      (k) => a.find((D) => {
        const A = ji(D, o);
        return A?.type === "reference" && A.ref_content_selection?.ids[0] === k.id;
      })
    );
    if (!I[0] || !I[1]) continue;
    const R = `chapter-next-${Pe(I[0].id)}-${Pe(I[1].id)}`;
    d.some((k) => k.id === R) || d.push({
      id: R,
      from: I[0].id,
      to: I[1].id,
      purpose: "structure"
    });
  }
  return li({
    ...e,
    canvas: { ...c, nodes: a, edges: d, nextNodeNo: y }
  });
}
function wy(e, t, n) {
  if (!Do(e.power, e.kind, e.outputType)) return "";
  const o = jt([
    e.asset?.version?.content,
    e.resultOutput
  ]), s = o?.screenplay?.source;
  if (!o || !s) return "";
  const r = t.find(
    (l) => Number(l.asset?.id || l.resultRef?.asset_id) === s.work_asset_id
  ), i = r && Xa(r);
  if (!r || !i) return "";
  const c = i.units.find((l) => l.id === s.unit_id);
  if (!c) return "来源章节已移除，已有分镜和视频保留";
  if (c.asset_id !== s.asset_id || c.version_id !== s.version_id)
    return "章节正文已更新，重做剧本后再制作；已有结果保留";
  const a = Ap(t, n, e.id), d = a && di(a);
  return d && (o.visual_mode !== d.visual_mode || o.aspect_ratio !== d.aspect_ratio || o.style_prompt !== d.style_prompt) ? "全片画风或画幅已更新，请重做剧本后再制作" : "";
}
const md = 520, vy = 8e3;
function gd(e) {
  return {
    baseline: e.loadedBaseline ?? "",
    revision: 0,
    savedRevision: 0,
    retryCount: 0
  };
}
function by({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: o,
  onError: s
}) {
  const r = ne(n), i = ne(/* @__PURE__ */ new Map()), c = ne(/* @__PURE__ */ new Map()), a = ne({}), d = ne(0), l = ne(null), [y, v] = K(0), [b, I] = K({});
  ue(() => {
    r.current = n;
  }, [n]);
  const R = O(($) => {
    const q = a.current[$];
    q != null && (window.clearTimeout(q), delete a.current[$]);
  }, []), k = O(
    ($, q = md) => {
      const z = i.current.get($);
      if (!t || !e || !z || z.conflict || typeof window > "u")
        return;
      R($);
      const Z = d.current;
      a.current[$] = window.setTimeout(() => {
        delete a.current[$], l.current?.($, Z)?.catch(() => {
        });
      }, q);
    },
    [R, t, e]
  ), D = O(
    async ($, q, z) => {
      const Z = i.current.get($);
      if (!Z || q !== d.current || !t || !e)
        return;
      const me = () => q === d.current && i.current.get($) === Z;
      if (Z.conflict)
        throw Z.conflict;
      for (; c.current.has($); )
        if (await c.current.get($), !me())
          return;
      const ye = z?.revision ?? Z.revision;
      if (ye <= Z.savedRevision)
        return;
      const ve = z?.canvas || r.current[$];
      if (!ve)
        return;
      const fe = (async () => {
        I((he) => ({ ...he, [$]: "saving" }));
        try {
          const he = await Uf({
            projectId: e,
            canvasId: ve.id,
            assetCateId: ve.assetCateId,
            canvas: ve,
            baseline: Z.baseline
          });
          if (!me())
            return;
          Z.baseline = he.baseline, Z.savedRevision = ye, Z.retryCount = 0, Z.revision === ye ? (o((ce) => {
            const Be = ce[$], be = he.updatedAt || Be?.updatedAt;
            return !me() || !Be || Be.updatedAt === be ? ce : {
              ...ce,
              [$]: { ...Be, updatedAt: be }
            };
          }), I((ce) => ({
            ...ce,
            [$]: "saved"
          }))) : I((ce) => ({
            ...ce,
            [$]: "dirty"
          }));
        } catch (he) {
          if (!me())
            return;
          throw he instanceof Error && "code" in he && he.code === 409 ? (Z.conflict = he, R($), I((Fe) => ({ ...Fe, [$]: "dirty" })), s(he), he) : (Z.retryCount += 1, I((Fe) => ({ ...Fe, [$]: "error" })), Z.retryCount === 1 && s(he), k(
            $,
            Math.min(vy, md * 2 ** Z.retryCount)
          ), he);
        } finally {
          me() && !Z.conflict && Z.revision > Z.savedRevision && Z.retryCount === 0 && k($);
        }
      })();
      c.current.set($, fe);
      try {
        await fe;
      } finally {
        c.current.get($) === fe && c.current.delete($);
      }
    },
    [R, t, s, e, k, o]
  );
  l.current = D;
  const A = O(
    async ($) => {
      const q = String($.id), z = i.current.get(q);
      if (!z || !t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      if (z.conflict)
        throw s(z.conflict), z.conflict;
      const Z = d.current, me = ++z.revision;
      if (z.retryCount = 0, R(q), I((ye) => ({ ...ye, [q]: "dirty" })), await D(q, Z, { canvas: $, revision: me }), Z !== d.current || i.current.get(q) !== z)
        throw new Error("画布状态已更新，请重新运行");
    },
    [R, t, s, e, D]
  ), T = O(($) => {
    const q = String($), z = i.current.get(q);
    z && (z.revision += 1, z.retryCount = 0, I((Z) => ({ ...Z, [q]: "dirty" })), z.conflict || v((Z) => Z + 1));
  }, []), V = O(($) => {
    const q = i.current.get($);
    return q != null && (c.current.has($) || q.revision > q.savedRevision);
  }, []), te = O(
    ($) => $ == null ? [...i.current.keys()].some(V) : V(String($)),
    [V]
  ), G = O(async () => {
    const $ = d.current;
    for (; ; ) {
      const q = [...i.current.keys()].filter(V);
      if (!q.length) return;
      if (await Promise.all(
        q.map(async (z) => {
          R(z), await D(z, $);
        })
      ), $ !== d.current)
        throw new Error("画布状态已更新，请重试");
    }
  }, [R, V, D]), re = O(
    ($) => {
      d.current += 1, r.current = $;
      for (const z of Object.keys(a.current))
        R(z);
      i.current.clear();
      const q = {};
      for (const [z, Z] of Object.entries($))
        i.current.set(z, gd(Z)), q[z] = "saved";
      I(q);
    },
    [R]
  ), F = O(
    ($) => {
      const q = String($.id);
      i.current.has(q) && ($.loadedBaseline == null || r.current[q] === $) || (R(q), r.current = { ...r.current, [q]: $ }, i.current.set(q, gd($)), I((z) => ({ ...z, [q]: "saved" })));
    },
    [R]
  ), ge = O(
    ($) => {
      const q = String($);
      R(q), i.current.delete(q), I((z) => {
        if (!Object.prototype.hasOwnProperty.call(z, q))
          return z;
        const Z = { ...z };
        return delete Z[q], Z;
      });
    },
    [R]
  );
  return ue(() => {
    for (const [$, q] of i.current)
      q.revision > q.savedRevision && k($);
  }, [k, y]), ue(
    () => () => {
      d.current += 1;
      for (const $ of Object.values(a.current))
        window.clearTimeout($);
      a.current = {};
    },
    []
  ), {
    markCanvasDirty: T,
    flushCanvasSave: A,
    flushPendingCanvasSaves: G,
    hasPendingCanvasSaves: te,
    adoptCanvasSnapshot: F,
    forgetCanvasSnapshot: ge,
    resetCanvasAutosave: re,
    canvasSaveStatus: b
  };
}
function Ny() {
  const e = /* @__PURE__ */ new Map(), t = (n, o, s) => JSON.stringify([n, o, s]);
  return {
    subscribe(n, o, s, r) {
      const i = t(n, o, s), c = e.get(i) || /* @__PURE__ */ new Set();
      return c.add(r), e.set(i, c), () => {
        c.delete(r), c.size === 0 && e.delete(i);
      };
    },
    publish(n, o) {
      const s = t(
        n,
        Number(o.canvas_id || 0),
        String(o.request_id || "")
      );
      for (const r of e.get(s) || []) r(o);
    },
    clear() {
      e.clear();
    }
  };
}
const Iy = 6e4, Cy = 60;
class Sy {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const o = _y(t, n);
    this.scopeKey !== o && (this.scopeKey = o, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, o, s = !1) {
    this.setScope(t, n);
    const r = this.scopeKey, i = this.catalogs.get(r) || { loadedAt: 0 };
    if (!s && i.value && Date.now() - i.loadedAt < Iy)
      return Promise.resolve(i.value);
    if (i.inFlight)
      return i.inFlight;
    const c = o().then((a) => (this.scopeKey === r && this.catalogs.set(r, { value: a, loadedAt: Date.now() }), a)).catch((a) => {
      throw this.scopeKey === r && this.catalogs.set(r, {
        value: i.value,
        loadedAt: i.loadedAt
      }), a;
    });
    return this.catalogs.set(r, { ...i, inFlight: c }), c;
  }
  loadPowerForm(t, n) {
    this.setScope(t.projectId, t.releaseId);
    const o = this.scopeKey, s = Ry(t), r = this.powerForms.get(s);
    if (r?.value)
      return this.touchPowerForm(s, r), Promise.resolve(r.value);
    if (r?.inFlight)
      return r.inFlight;
    const i = n().then((c) => (this.scopeKey === o && (this.touchPowerForm(s, { value: c }), this.trimPowerForms()), c)).catch((c) => {
      throw this.scopeKey === o && this.powerForms.delete(s), c;
    });
    return this.touchPowerForm(s, { inFlight: i }), this.trimPowerForms(), i;
  }
  touchPowerForm(t, n) {
    this.powerForms.delete(t), this.powerForms.set(t, n);
  }
  trimPowerForms() {
    for (; this.powerForms.size > Cy; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function _y(e, t) {
  return `${e || 0}:${t || 0}`;
}
function Ry(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function Xu(e) {
  if (e.kind === "media" && e.options.length === 1)
    return { kind: "media", key: e.options[0].key };
  if (e.kind === "text" && e.params.length === 1 && !e.lyricsAvailable)
    return { kind: "text", key: e.params[0].key };
  if (e.kind === "text" && e.params.length === 0 && e.lyricsAvailable)
    return { kind: "lyrics" };
}
function Zu(e, t, n, o) {
  const s = {
    projectId: t,
    releaseId: n,
    flowId: Number(o.flow?.id || 0),
    powerId: Number(o.power?.id || 0),
    powerKey: o.power?.key || "",
    targetId: Number(o.composerDraft?.selectedTargetId || 0)
  };
  return e.loadPowerForm(s, () => Jd(s));
}
function Qu(e, t) {
  return Mu(t, Tu(t, Aa(e.composerDraft)));
}
function pa(e, t, n) {
  return Dp(Qu(e, t), e.composerDraft, n);
}
function el(e, t, n) {
  return t.flatMap((o) => !iu(o) || (o.logicalTo || o.to) !== n ? [] : Hd(e, o.logicalFrom || o.from).filter(ja).map((s) => ({ edge: o, source: s })));
}
function mr({ source: e, target: t, nodes: n, edges: o, items: s, params: r, referenceOnly: i = !1 }) {
  if (!e || !t || !Yd(e, t))
    return { kind: "invalid", reason: "无法连接这两个节点，请检查节点和分组位置" };
  const c = o.filter((v) => (v.logicalTo || v.to) === t.id);
  if (au(e, t) === "structure") {
    const v = e.outputType === "storyboard";
    return c.some((b) => {
      const I = b.logicalFrom || b.from;
      return I !== e.id && n.some((R) => R.id === I && R.outputType === e.outputType);
    }) ? { kind: "invalid", reason: v ? "一个分镜只能接续一个前章分镜" : "一个分镜只能引用一份共用设定" } : { kind: "direct", description: v ? "接续前章分镜" : "复用角色、场景、道具" };
  }
  if (t.type === "group" || Qt(e, "start") && (t.type === "power" || t.type === "agent" || t.type === "flow"))
    return { kind: "direct" };
  if (e.outputType === "setting" || e.outputType === "storyboard")
    return { kind: "invalid", reason: "此节点输出的是结构化内容，不能当作普通文本或媒体引用" };
  const d = (e.type === "group" ? Hd(n, e.id) : [e]).filter(ja), l = ir(e), y = Da(e.power, e.kind, e.outputType);
  if (Qt(t, "display") || Qt(t, "save")) {
    if (c.some((v) => (v.logicalFrom || v.from) !== e.id))
      return { kind: "invalid", reason: "此功能节点只能接收一个上游结果" };
    if (l || y || d.length || e.type === "group") return { kind: "direct" };
  }
  if (t.type === "agent" && t.role?.agent_id && (l || y || !i && d.length))
    return { kind: "direct" };
  if (!i && t.type === "flow" && (l || y)) return { kind: "direct" };
  if (t.type === "power" && t.power) {
    if (t.outputType === "video_compose")
      return d.length && d.every((v) => vg(v) === "video") ? { kind: "direct", description: "用作视频片段" } : { kind: "invalid", reason: "视频合成只接收连线导入的视频片段" };
    if (t.outputType === "setting" && y)
      return { kind: "direct", description: "提取作品中的设定" };
    if (!i && y) return { kind: "direct" };
    if (d.length) {
      if (!r) return { kind: "form" };
      const v = Aa(t.composerDraft), b = el(n, o, t.id), I = Tu(r, v), R = bg(
        r,
        I,
        [...b.map((V) => V.source), ...d]
      ), k = Ng({
        node: t,
        content: v.promptContent,
        items: s,
        connections: b,
        params: r,
        values: R,
        requestedMode: v.multiImageMode,
        additionalSources: d
      });
      if (k.error) return { kind: "invalid", reason: k.error };
      const D = k.active ? k.mode : void 0, A = Ig(
        b,
        Cg(Mu(r, R)),
        d,
        v.promptContent,
        s,
        D
      );
      if (A.error) return { kind: "invalid", reason: A.error };
      const T = { ...v, paramValues: R, multiImageMode: D ?? v.multiImageMode };
      return {
        kind: "media",
        options: A.options.map((V) => ({ key: V.key, name: V.label })),
        draft: (R !== I || D) && zc(T) !== zc(v) ? T : void 0
      };
    }
    if (l) {
      if (!r) return { kind: "form" };
      const v = pa(t, r, e.id), b = Vs(t);
      return v.length || b ? { kind: "text", params: v, lyricsAvailable: b } : { kind: "invalid", reason: "下游没有空闲且生效的文本参数" };
    }
  }
  return !i && (e.type === "group" || Qt(e, "import")) ? { kind: "direct" } : { kind: "invalid", reason: "下游没有能接收该节点结果的输入" };
}
function ky(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function xy(e, t) {
  return String(t || "").trim() ? "" : String(e || "").trim();
}
function Ty(e, t) {
  const n = new Set(t);
  return e.map(
    (o) => n.has(o.id) && o.runError ? { ...o, runError: "" } : o
  );
}
function My(e, t, n) {
  const o = new Map(t.map((a) => [a.id, a])), s = Ay(n), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const a of t)
    a.groupId && i.set(a.groupId, [
      ...i.get(a.groupId) || [],
      a.id
    ]);
  const c = (a) => {
    for (const d of s.get(a) || []) {
      if (r.has(d))
        continue;
      r.add(d);
      const l = o.get(d);
      if (l?.type === "group")
        for (const y of i.get(l.id) || [])
          r.has(y) || (r.add(y), c(y));
      (!l || !tl(l)) && c(d);
    }
  };
  return c(e), [...r];
}
function tl(e) {
  return !!(e.type === "function" && ds(e.functionOption?.key)?.stopsExecution);
}
function Za(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : !!(e.type === "function" && ds(e.functionOption?.key)?.runsInBackend);
}
function Ay(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.from || !n.to || n.executionMode === "manual")
      continue;
    const o = n.logicalFrom || n.from, s = n.logicalTo || n.to;
    t.set(o, [
      ...t.get(o) || [],
      s
    ]);
  }
  return t;
}
function Dy({
  members: e,
  hasResult: t
}) {
  const n = e.filter(Za), o = n.filter(
    (s) => !t(s)
  );
  return (o.length > 0 ? o : n).map(
    (s) => s.id
  );
}
function nl({
  targets: e,
  nodesByID: t,
  hasResult: n
}) {
  const o = new Set(e.map((s) => s.id));
  for (const s of e) {
    const r = s.storyboardItem;
    if (!r)
      continue;
    const i = /* @__PURE__ */ new Set([
      ...r.dependencyNodeIds || [],
      ...r.referenceNodeIds || []
    ]);
    for (const c of i) {
      if (o.has(c))
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
function Qa({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: o
}) {
  const s = e.filter(Za), r = s.map((d) => t[d.id]).filter((d) => !!d), c = n?.status === "running" || n?.status === "waiting" ? s.filter((d) => {
    const l = t[d.id];
    return l?.status === "success" || !l && o(d);
  }).length : s.filter((d) => {
    const l = t[d.id];
    return l?.status === "success" ? !0 : l ? !1 : o(d);
  }).length, a = r.filter(
    (d) => d.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: s.length,
    completedCount: c,
    failedCount: a,
    status: Py(n, r, a)
  };
}
function Py(e, t, n) {
  return t.some((o) => o.status === "running") ? "running" : e?.status === "waiting" || t.some((o) => o.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function Ey({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: o = !0,
  canEditStructure: s = !1,
  canResetStoryboardPrompt: r = !1,
  onClose: i,
  onCopy: c,
  onDelete: a,
  onDetail: d,
  onEditStructure: l,
  onResetStoryboardPrompt: y
}) {
  return /* @__PURE__ */ L(Gt, { children: [
    /* @__PURE__ */ f("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ L(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (v) => v.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ L("button", { type: "button", onClick: d, children: [
            /* @__PURE__ */ f(Ua, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "详情" })
          ] }) : null,
          s && l ? /* @__PURE__ */ L("button", { type: "button", onClick: l, children: [
            /* @__PURE__ */ f(Iu, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "编辑分镜" })
          ] }) : null,
          r && y ? /* @__PURE__ */ L("button", { type: "button", onClick: y, children: [
            /* @__PURE__ */ f(Jm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ L("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ f(Xm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "复制" })
          ] }) : null,
          o ? /* @__PURE__ */ L("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ f(Zm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function Oy({
  canvasCount: e,
  activeCanvasName: t,
  canvasManagerOpen: n,
  showViewTools: o,
  showMiniMap: s,
  snapToGrid: r,
  zoom: i,
  onToggleMiniMap: c,
  onToggleSnap: a,
  onReset: d,
  onZoomIn: l,
  onZoomOut: y,
  onZoomChange: v,
  onOpenCanvasManager: b
}) {
  const I = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ L("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ f(gt, { label: I, children: /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: b,
        children: /* @__PURE__ */ f(Qm, { size: 16 })
      }
    ) }),
    o ? /* @__PURE__ */ L(Gt, { children: [
      /* @__PURE__ */ f("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ f(gt, { label: s ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: c,
          "aria-label": s ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ f(eg, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(gt, { label: r ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: r ? "is-active" : "",
          onClick: a,
          "aria-label": r ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ f(Cu, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(gt, { label: "重置视图", children: /* @__PURE__ */ f("button", { type: "button", onClick: d, "aria-label": "重置视图", children: /* @__PURE__ */ f(tg, { size: 15 }) }) }),
      /* @__PURE__ */ L("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ f(gt, { label: "缩小", children: /* @__PURE__ */ f("button", { type: "button", onClick: y, "aria-label": "缩小", children: /* @__PURE__ */ f(Su, { size: 15 }) }) }),
        /* @__PURE__ */ f(
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
        /* @__PURE__ */ f(gt, { label: "放大", children: /* @__PURE__ */ f("button", { type: "button", onClick: l, "aria-label": "放大", children: /* @__PURE__ */ f(_u, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
const Fy = [
  "position",
  "measured",
  "width",
  "height",
  "dragging",
  "resizing"
];
function ol(e, t) {
  return e && t?.interactionId === e ? t : null;
}
function rl(e, t, n) {
  const o = ol(t, n);
  if (!o)
    return e;
  const s = new Map(o.baseNodes.map((c) => [c.id, c])), r = new Map(o.nodes.map((c) => [c.id, c])), i = e.map((c) => {
    const a = s.get(c.id), d = r.get(c.id);
    if (!a || !d)
      return c;
    if (c === a)
      return d;
    let l = c;
    for (const y of Fy)
      d[y] === a[y] || d[y] === c[y] || (l === c && (l = { ...c }), Object.assign(l, { [y]: d[y] }));
    return l;
  });
  return i.every((c, a) => c === e[a]) ? e : i.length === o.nodes.length && i.every((c, a) => c === o.nodes[a]) ? o.nodes : i;
}
function By(e, t, n, o) {
  if (!n)
    return e;
  const s = rl(
    t,
    n,
    e
  );
  return {
    interactionId: n,
    baseNodes: t,
    nodes: typeof o == "function" ? o(s) : o
  };
}
function zy(e, t) {
  const [n, o] = K(null), s = se(
    () => rl(e, t, n),
    [e, t, n]
  );
  ue(() => {
    o(
      (i) => ol(t, i)
    );
  }, [t]);
  const r = O(
    (i) => {
      o(
        (c) => By(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: s, setFlowNodes: r };
}
function Uy(e, t) {
  const n = ne([]);
  return se(() => {
    const o = Ly(
      e,
      n.current,
      t
    );
    return n.current = o, o;
  }, [t, e]);
}
function Ly(e, t, n) {
  const o = new Map(t.map((r) => [r.id, r])), s = e.map((r) => {
    const i = o.get(r.id);
    return i && n(i, r) ? i : r;
  });
  return t.length === s.length && s.every((r, i) => r === t[i]) ? t : s;
}
function $y(e) {
  return (...t) => e.current(...t);
}
function Vy(e, t) {
  return t && ec(t.source, e) ? t.value : e;
}
function yd(e, t, n) {
  return {
    source: t && ec(t.source, e) ? t.source : e,
    value: n
  };
}
function ec(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const sl = [
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
], ti = 140, tc = 100, Wr = 720, hd = { width: 280, height: 64 };
function jy(e, t, n) {
  const o = al(n), s = e.find((r) => r.id === t);
  return !s || Hy(s, o) ? e : e.map(
    (r) => r.id === t ? { ...r, ...o } : r
  );
}
function Ky(e, t, n) {
  const o = is(n), s = e.find((r) => r.id === t);
  return !s || ec(s.resultView, o) ? e : e.map(
    (r) => r.id === t ? { ...r, resultView: o } : r
  );
}
function qy({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: o,
  onResizeEnd: s
}) {
  if (!t || !n || !s)
    return null;
  const r = e.type === "group", i = e.type === "power" && Qd(e.power, e.kind);
  return /* @__PURE__ */ f(Gt, { children: sl.map((c) => /* @__PURE__ */ f(
    Lm,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: r ? Lc.width : i ? hd.width : ti,
      minHeight: r ? Lc.height : i ? hd.height : tc,
      maxWidth: r ? Uc.width : Wr,
      maxHeight: r ? Uc.height : Wr,
      keepAspectRatio: !r && !i,
      onResizeStart: () => o?.(e.id),
      onResizeEnd: (a, d) => s(e.id, al(d))
    },
    c.position
  )) });
}
function Gy({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: o,
  onResizeEnd: s
}) {
  const r = ne(null);
  if (!t)
    return null;
  const i = (d, l) => {
    if (d.button !== 0)
      return;
    d.preventDefault(), d.stopPropagation();
    const y = is(e), v = d.currentTarget.parentElement?.getBoundingClientRect().width || y.width;
    r.current = {
      pointerId: d.pointerId,
      startX: d.clientX,
      startY: d.clientY,
      startView: y,
      currentView: y,
      corner: l,
      scale: Math.max(0.01, v / y.width)
    }, d.currentTarget.setPointerCapture(d.pointerId), n?.();
  }, c = (d) => {
    const l = r.current;
    if (!l || l.pointerId !== d.pointerId)
      return;
    d.preventDefault(), d.stopPropagation();
    const y = Wy(
      l.startView,
      l.corner,
      (d.clientX - l.startX) / l.scale,
      (d.clientY - l.startY) / l.scale
    );
    l.currentView = y, o(y);
  }, a = (d) => {
    const l = r.current;
    !l || l.pointerId !== d.pointerId || (d.preventDefault(), d.stopPropagation(), r.current = null, d.currentTarget.hasPointerCapture(d.pointerId) && d.currentTarget.releasePointerCapture(d.pointerId), s(is(l.currentView)));
  };
  return /* @__PURE__ */ f(Gt, { children: sl.map((d) => /* @__PURE__ */ f(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${d.className} nodrag nopan nowheel`,
      onPointerDown: (l) => i(l, d),
      onPointerMove: c,
      onPointerUp: a,
      onPointerCancel: a,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
      }
    },
    d.position
  )) });
}
function Wy(e, t, n, o) {
  const s = e.width / e.height, r = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * o) * s, c = il(
    Math.abs(r - e.width) >= Math.abs(i - e.width) ? r : i,
    s
  ), a = c / s, d = Number(e.offsetX || 0), l = Number(e.offsetY || 0);
  return is({
    width: c,
    height: a,
    offsetX: t.left ? d + e.width - c : d,
    offsetY: t.top ? l + (e.height - a) / 2 : l + (a - e.height) / 2
  });
}
function il(e, t) {
  const n = Math.max(ti, tc * t), o = Math.min(Wr, Wr * t);
  return n > o ? Math.min(Wr, Math.max(ti, e)) : Math.min(o, Math.max(n, e));
}
function is(e) {
  const t = wd(e.width, ti), n = wd(e.height, tc), o = t / n, s = il(t, o);
  return {
    width: Math.round(s),
    height: Math.round(s / o),
    offsetX: Math.round(vd(e.offsetX, 0)),
    offsetY: Math.round(vd(e.offsetY, 0))
  };
}
function wd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function vd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function al(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function Hy(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Yy() {
  const e = /* @__PURE__ */ new Map();
  let t;
  function n(o, s, r, i) {
    let c = e.get(o);
    c || (c = /* @__PURE__ */ new Map(), e.set(o, c));
    const a = c.get(s);
    if (a && a.dependencies.length === r.length && r.every(
      (l, y) => Object.is(l, a.dependencies[y])
    ))
      return a.value;
    const d = i();
    return c.set(s, { dependencies: r, value: d }), d;
  }
  return {
    reuse: n,
    retain(o) {
      if (o !== t) {
        t = o;
        for (const s of e.values())
          for (const r of s.keys())
            o.has(r) || s.delete(r);
      }
    }
  };
}
function Jy() {
  let e;
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  return {
    update(o, s) {
      const r = new Map(
        o.map((a) => [
          a.id,
          Qt(a, "start") ? "start" : tl(a) ? "stop" : "other"
        ])
      ), i = e;
      if (i && r.size === i.semantics.size && [...r].every(
        ([a, d]) => i.semantics.get(a) === d
      ) && s.length === i.edges.length && s.every((a, d) => {
        const l = i.edges[d];
        return a.id === l.id && a.from === l.from && a.to === l.to;
      }))
        return;
      const c = /* @__PURE__ */ new Map();
      for (const a of s) {
        const d = c.get(a.from) || [];
        d.push({ id: a.id, to: a.to }), c.set(a.from, d);
      }
      e = {
        semantics: r,
        edges: s.map(({ id: a, from: d, to: l }) => ({ id: a, from: d, to: l })),
        outgoing: c
      }, t.clear();
    },
    get(o) {
      if (!e || e.semantics.get(o) !== "start") return n;
      const s = t.get(o);
      if (s)
        return t.delete(o), t.set(o, s), s;
      const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set([o]), c = [...e.outgoing.get(o) || []];
      for (let a = 0; a < c.length; a += 1) {
        const d = c[a];
        r.has(d.id) || (r.add(d.id), !i.has(d.to) && (i.add(d.to), e.semantics.get(d.to) !== "stop" && c.push(...e.outgoing.get(d.to) || [])));
      }
      return t.size >= 2 && t.delete(t.keys().next().value), t.set(o, r), r;
    }
  };
}
const cl = "反馈已被新的运行替换";
function Xy(e) {
  return e instanceof Error && e.message === cl;
}
function So(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function Zy(e, t) {
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
function Qy(e, t, n) {
  return e.map(
    (o) => o.id === t ? {
      ...o,
      values: n,
      prompt: {
        ...o.prompt,
        values: n
      },
      status: "submitted",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    } : o
  );
}
function eh(e, t, n) {
  if (!e)
    return !1;
  const o = t.find((r) => r.id === e.node.id) || e.node, s = So(o).find(
    (r) => r.id === e.recordId
  );
  return s ? !(s.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function th(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], o = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: gp(t?.status || e?.status || "running"),
    output: At(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(sh).filter(Boolean),
    interactions: o.map(oh).filter(Boolean),
    raw: e
  };
}
function nh(e) {
  const t = e.interactions.find(
    (r) => !!(r.interaction?.id && r.interaction?.type)
  );
  if (t)
    return dl(t);
  const n = e.approvals.find(ih);
  if (!n?.id)
    return null;
  const o = ah(n), s = nc(o);
  return {
    approval: n,
    title: Oe(o.title, n.title, "补充信息"),
    description: Oe(
      o.description,
      "补充信息后继续执行流程。"
    ),
    fields: s,
    values: oc(o, s)
  };
}
function dl(e) {
  const t = e.interaction, n = nc(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: Oe(t.title, "补充信息"),
    description: Oe(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: oc(t, n)
  };
}
function oh(e) {
  const t = $m(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function nc(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, o) => ch(n, o)).filter((n) => !!n.key);
}
function oc(e, t) {
  const n = Sg(t), o = e.values && typeof e.values == "object" ? e.values : {}, s = {
    ...n,
    ...o
  }, r = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return r > 0 && (s.source_target_id = r), s;
}
function rh(e, t) {
  const n = dh(e);
  if (!n)
    return null;
  const o = nc(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: Oe(n.title, t, "补充信息"),
    description: Oe(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: o,
    values: oc(n, o)
  };
}
function sh(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function ih(e) {
  return e.status === "pending" || e.decision === "pending";
}
function ah(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function ch(e, t) {
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
    max_items: Number(e?.max_items || 0),
    option_filter_key: String(e?.option_filter_key || ""),
    accepted_kinds: bd(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: bd(
      e?.asset_kinds ?? e?.assetKinds
    ),
    required: !!e?.required,
    sort: Number(e?.sort || t + 1),
    options: n.map((o, s) => ({
      id: Number(o?.id || s + 1),
      name: String(o?.name || o?.label || o?.value || ""),
      group: String(o?.group || ""),
      value: String(
        o?.value || o?.id || o?.label || o?.name || ""
      ),
      native_value: String(o?.native_value || o?.nativeValue || ""),
      preview_url: String(o?.preview_url || o?.previewUrl || ""),
      sort: Number(o?.sort || s + 1)
    }))
  };
}
function bd(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function dh(e) {
  const t = Ki(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const o = Ki(e?.interaction);
    return o && Oe(o.type) ? o : null;
  }
  const n = Ki(t.interaction, t.content?.interaction);
  return n && Oe(n.type) ? n : null;
}
function Ki(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
function uh({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: o,
  targetY: s,
  sourcePosition: r,
  targetPosition: i,
  markerEnd: c,
  style: a,
  data: d
}) {
  const [l, y, v] = Vm({
    sourceX: t,
    sourceY: n,
    sourcePosition: r,
    targetX: o,
    targetY: s,
    targetPosition: i
  }), b = d || {}, I = !!b.isSelected, R = !!(b.isHighlighted || I), k = b.highlightColor || "#0ea5e9", D = I ? "var(--ws-edge-selected)" : R ? k : "var(--ws-edge)", A = I ? 2.8 : R ? 2.4 : 1.45, T = R ? 0.96 : 0.62, V = String(b.bindingLabel || "").trim(), te = !!b.bindingInteractive, G = !!V, re = G || I;
  return /* @__PURE__ */ L(Gt, { children: [
    R ? /* @__PURE__ */ f(
      Qc,
      {
        path: l,
        style: {
          stroke: k,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ f(
      Qc,
      {
        path: l,
        markerEnd: c,
        style: {
          ...a,
          stroke: D,
          strokeWidth: A,
          opacity: T,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    re ? /* @__PURE__ */ f(jm, { children: /* @__PURE__ */ L(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          V ? "is-bound" : "",
          b.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${y}px, ${v}px)`
        },
        onMouseDown: (F) => {
          F.preventDefault(), F.stopPropagation();
        },
        children: [
          G ? te ? /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${V}`,
              onClick: (F) => {
                F.preventDefault(), F.stopPropagation(), b.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ f(aa, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ f("span", { children: V }),
                b.bindingShowChevron ? /* @__PURE__ */ f(ng, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ L("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ f(aa, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ f("span", { children: V })
          ] }) : null,
          I ? /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (F) => {
                F.preventDefault(), F.stopPropagation(), b.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ f(og, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    R ? /* @__PURE__ */ L(Gt, { children: [
      /* @__PURE__ */ f("circle", { r: "3", fill: k, children: /* @__PURE__ */ f(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: l
        }
      ) }),
      /* @__PURE__ */ f("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ f(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: l
        }
      ) })
    ] }) : null
  ] });
}
const lh = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function fh({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ f(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: lh,
      children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ f(Mo, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(La, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ f("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function qi({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: o
}) {
  const [s, r] = K(!1), [i, c] = K(e), a = ne(null);
  ue(() => {
    s || c(e);
  }, [s, e]), ue(() => {
    s && (a.current?.focus(), a.current?.select());
  }, [s]);
  const d = () => {
    const l = i.trim() || n;
    r(!1), c(l), l !== e && o?.(l);
  };
  return s && o ? /* @__PURE__ */ f(
    "input",
    {
      ref: a,
      className: `ws-canvas-node-title-input nodrag nowheel ${t || ""}`.trim(),
      value: i,
      maxLength: 64,
      "aria-label": "节点名称",
      onChange: (l) => c(l.target.value),
      onBlur: d,
      onPointerDown: (l) => l.stopPropagation(),
      onKeyDown: (l) => {
        l.stopPropagation(), l.key === "Enter" ? (l.preventDefault(), d()) : l.key === "Escape" && (l.preventDefault(), c(e), r(!1));
      }
    }
  ) : /* @__PURE__ */ f(gt, { label: o ? "双击重命名" : e, children: /* @__PURE__ */ f(
    "span",
    {
      className: t,
      onDoubleClick: o ? (l) => {
        l.preventDefault(), l.stopPropagation(), r(!0);
      } : void 0,
      children: e || n
    }
  ) });
}
function ph(e, t) {
  const n = /* @__PURE__ */ new Set(), o = e.find((r) => r.id === t);
  if (!o)
    return [];
  o.type === "power" && Do(
    o.power,
    o.kind,
    o.outputType
  ) && n.add(o.id), o.storyboardItem?.sourceNodeId && n.add(o.storyboardItem.sourceNodeId);
  const s = Number(
    o.resultRef?.asset_id || o.asset?.id || 0
  );
  for (const r of e) {
    const i = r.storyboardItem;
    i && (i.referenceNodeIds?.includes(t) || i.dependencyNodeIds?.includes(t) || s > 0 && i.externalReferenceAssetIds?.includes(s)) && n.add(i.sourceNodeId);
  }
  return [...n];
}
const mh = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function ul(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return mh[n] || { section: "shots" };
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
function gh(e, t) {
  const n = fi(e);
  return {
    frames: fl(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: ll(e, n)
  };
}
function Nd(e) {
  return fi(e);
}
function yh(e, t) {
  return ll(e).get(t.id) || "";
}
function ll(e, t = fi(e)) {
  const n = sc(e), o = /* @__PURE__ */ new Map();
  for (const s of e) {
    let r = "";
    s.storyboardItem?.sourceNodeId ? r = ic(s, n) : s.type === "group" && s.group?.origin === "script" ? r = n.get(s.id) || "" : t.has(s.id) ? r = s.id : s.groupId && (r = n.get(s.groupId) || ""), r && o.set(s.id, r);
  }
  return o;
}
function fl(e, t, n = fi(e)) {
  const o = new Map(e.map((d) => [d.id, d])), s = sc(e), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const d of e) {
    const l = /* @__PURE__ */ new Set();
    n.has(d.id) && l.add(d.id);
    const y = s.get(d.id);
    y && l.add(y);
    const v = d.storyboardItem?.sourceNodeId ? ic(d, s) : "";
    if (v && l.add(v), d.groupId) {
      const b = s.get(d.groupId);
      b && l.add(b);
    }
    for (const b of l)
      Gi(r, b, d);
    y && Gi(i, y, d), v && !d.storyboardItem?.optional && Gi(c, v, d);
  }
  const a = [];
  for (const d of n) {
    const l = o.get(d);
    if (!l)
      continue;
    const y = r.get(d) || [];
    if (y.length <= 1)
      continue;
    const v = i.get(d) || [], b = c.get(d) || [];
    a.push({
      id: rc(d),
      sourceNodeId: d,
      title: l.title || "分镜脚本",
      memberNodeIds: y.map((I) => I.id),
      workNodeIds: b.map((I) => I.id),
      groupCount: v.length,
      workNodeCount: b.length,
      completedCount: b.filter(t).length
    });
  }
  return a;
}
function Gi(e, t, n) {
  const o = e.get(t);
  o ? o.push(n) : e.set(t, [n]);
}
function pl(e, t, n, o, s = new Map(t.map((r) => [r.id, r]))) {
  const r = e.workNodeIds.map((l) => s.get(l)).filter((l) => !!l), i = r.find((l) => l.storyboardItem?.itemType === "video_compose");
  if (i) {
    const l = new Map(n.map((y) => [y.id, y]));
    for (const y of t) {
      if (y.outputType !== "video_compose" || y.storyboardItem || o(y)) continue;
      const v = (y.composerDraft?.videoComposition?.clips || []).map((b) => {
        const I = l.get(b.sourceEdgeId || "");
        return I && (I.logicalTo || I.to) === y.id ? s.get(I.logicalFrom || I.from) : void 0;
      });
      v.includes(i) && v.every((b) => b && (b === i || o(b))) && r.push(y);
    }
  }
  const c = r.filter((l) => !o(l)), a = new Set(c.map((l) => l.id));
  for (const l of [...c])
    for (const y of [
      ...l.storyboardItem?.referenceNodeIds || [],
      ...l.storyboardItem?.dependencyNodeIds || []
    ]) {
      const v = s.get(y), b = v?.groupId && s.get(v.groupId);
      v && b && s.get(v.storyboardItem?.sourceNodeId || "")?.outputType === "setting" && !o(v) && !a.has(y) && (a.add(y), c.push(v));
    }
  if (c.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const d = c.find(
    (l) => !Za(l)
  );
  return d ? {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: `“${d.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: nl({
      targets: c,
      nodesByID: s,
      hasResult: o
    })
  };
}
function rc(e) {
  return `storyboard-frame:${e}`;
}
function fi(e) {
  const t = sc(e), n = new Set(t.values());
  for (const o of e)
    o.storyboardMaterializedSignature && n.add(o.id), o.storyboardItem?.sourceNodeId && n.add(ic(o, t));
  return n;
}
function sc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    n.type !== "group" || n.group?.origin !== "script" || !n.group.sourceNodeId || t.set(
      n.id,
      n.group.sourceNodeId
    );
  return t;
}
function ic(e, t) {
  const n = e.storyboardItem?.sourceNodeId || "", o = t.get(e.groupId || "");
  return o && o === e.groupId ? o : n;
}
function hh(e, t) {
  const n = String(
    t.semantic_event || t.event || ""
  ).toLowerCase(), o = Hp(t.meta) ? t.meta : {}, s = n === "status", r = s && !!String(o.output_type || ""), i = r && !!(t.json && typeof t.json == "object" || o.storyboard_preview && typeof o.storyboard_preview == "object");
  let c = e.streamOutput;
  (n === "audio_ready" || i || mu(t)) && (c = t, s && "text" in t && (c = { ...t }, delete c.text));
  const a = typeof t.text == "string" && (n === "delta" || !n) ? t.text : "", d = Number(o.generated_count), l = Number(o.target_count);
  return {
    ...e,
    streamText: a ? `${e.streamText || ""}${a}` : e.streamText,
    streamOutput: c,
    streamStarted: e.streamStarted || !!a || !!c || r,
    ...s ? {
      statusText: typeof t.text == "string" && t.text.trim() ? t.text.trim() : e.statusText,
      executionPhase: typeof o.execution_phase == "string" ? o.execution_phase : e.executionPhase,
      queuePosition: typeof o.queue_position == "number" && Number.isInteger(o.queue_position) && o.queue_position >= 0 ? o.queue_position : e.queuePosition,
      generatedCount: Number.isInteger(d) && d >= 0 ? Math.max(e.generatedCount || 0, d) : e.generatedCount,
      targetCount: Number.isInteger(l) && l > 0 ? l : e.targetCount
    } : {}
  };
}
function wh({
  space: e,
  canvases: t,
  cache: n,
  onError: o
}) {
  const [s, r] = K([]), [i, c] = K([]), [a, d] = K([]), [l, y] = K(!1), v = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, b = ne(v), I = se(
    () => l || vh(t),
    [t, l]
  );
  ue(() => {
    b.current = v, r([]), c([]), d([]), y(!1);
  }, [v]);
  const R = O(
    async (k = !1) => {
      if (!e)
        return !1;
      const D = v;
      try {
        const A = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => Lf(e.project.id),
          k
        );
        return b.current !== D ? !1 : (r(A.roles), c(A.powers), d(A.powerCategories), y(!0), !0);
      } catch (A) {
        return b.current === D && o(A instanceof Error ? A.message : "加载能力列表失败"), !1;
      }
    },
    [n, o, v, e]
  );
  return ue(() => {
    !e || !I || l || R();
  }, [R, l, I, e]), {
    roles: s,
    powers: i,
    powerCategories: a,
    loaded: l,
    required: I,
    load: R
  };
}
function vh(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power || n.outputType === "setting" ? !0 : Do(n.power, n.kind, n.outputType) ? !!jt([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function bh(e, t, n) {
  const o = e.get(t);
  e.set(
    t,
    o ? (s) => n(o(s)) : n
  );
}
function Nh(e, t) {
  let n = e;
  for (const [o, s] of t) {
    const r = e[o], i = s(r);
    i !== r && (n === e && (n = { ...e }), i ? n[o] = i : delete n[o]);
  }
  return n;
}
function Ih({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: o,
  failedCount: s,
  status: r,
  selected: i,
  managed: c = !1,
  onRename: a,
  onEditStructure: d,
  onRun: l,
  runBlockedReason: y = "",
  children: v
}) {
  const [b, I] = K(!1), [R, k] = K(e.title), D = ne(null), A = r === "running" || r === "waiting", T = A ? "分组正在执行" : y || (n === 0 ? "分组内暂无可运行节点" : "运行分组"), V = !l || n === 0 || A || !!y;
  ue(() => {
    b || k(e.title);
  }, [b, e.title]), ue(() => {
    b && (D.current?.focus(), D.current?.select());
  }, [b]);
  const te = () => {
    const G = R.trim() || "未命名分组";
    I(!1), k(G), G !== e.title && a?.(G);
  };
  return /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-group-wrap ${i ? "is-selected" : ""} ${A ? "is-running" : ""} ${r === "error" ? "is-error" : ""} ${c ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ L("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ f("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(rg, { size: 15 }) }),
          b ? /* @__PURE__ */ f(
            "input",
            {
              ref: D,
              className: "ws-node-group-title-input nodrag nowheel",
              value: R,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (G) => k(G.target.value),
              onBlur: te,
              onKeyDown: (G) => {
                G.key === "Enter" ? (G.preventDefault(), te()) : G.key === "Escape" && (G.preventDefault(), k(e.title), I(!1));
              }
            }
          ) : /* @__PURE__ */ f(
            gt,
            {
              label: c ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ f(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (G) => {
                    G.preventDefault(), G.stopPropagation(), !(c || !a) && I(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ f("span", { className: "ws-node-group-count", children: A ? `${o}/${n}` : `${t} 个节点` }),
          r === "waiting" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待反馈" }) : r === "error" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: s > 0 ? `失败 ${s}` : "运行失败" }) : y ? /* @__PURE__ */ f(gt, { label: y, children: /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待前置" }) }) : n > 0 && o === n ? /* @__PURE__ */ L("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ f($a, { size: 12 }),
            "已完成"
          ] }) : null,
          d ? /* @__PURE__ */ f(gt, { label: "编辑分镜结构", children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (G) => {
                G.preventDefault(), G.stopPropagation(), d();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ f(Iu, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ f(gt, { label: T, children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: V,
              onClick: (G) => {
                G.preventDefault(), G.stopPropagation(), l?.();
              },
              "aria-label": "运行分组",
              children: A ? /* @__PURE__ */ f(Mo, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(La, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        v
      ]
    }
  );
}
function ml({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: o,
  className: s = "",
  style: r,
  onOpen: i,
  onOpenIntent: c,
  openOnContentClick: a = !1,
  resizeControls: d,
  children: l,
  customContentIsPureMedia: y = !1,
  followContent: v = !1,
  followKey: b
}) {
  const I = ne(null), R = ne(!0), k = lr(e, n), D = l != null, A = y || !D && !k && gl(n), T = !!i && (!D || y), V = [
    "ws-result-view",
    A ? "" : "nodrag",
    "nopan",
    "nowheel",
    A ? "has-pure-media" : "",
    s
  ].filter(Boolean).join(" ");
  return ue(() => {
    if (!v) {
      R.current = !0;
      return;
    }
    const F = I.current;
    F && R.current && (F.scrollTop = F.scrollHeight);
  }, [v, b]), /* @__PURE__ */ L(
    "div",
    {
      role: T ? "button" : void 0,
      tabIndex: T ? 0 : void 0,
      className: V,
      style: r,
      onPointerDown: (F) => {
        (!A || Rh(F)) && F.stopPropagation();
      },
      onClick: (F) => {
        F.stopPropagation(), !(!i || js(F.target, F.currentTarget) || _h(F)) && (F.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (F) => {
        F.stopPropagation(), !(!i || js(F.target, F.currentTarget) || F.key !== "Enter" && F.key !== " ") && (F.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            ref: I,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (F) => {
              !a || !i || js(F.target, F.currentTarget) || yl(F, F.currentTarget) || (F.preventDefault(), F.stopPropagation(), i());
            },
            onScroll: (F) => {
              if (!v)
                return;
              const ge = F.currentTarget;
              R.current = ge.scrollHeight - ge.scrollTop - ge.clientHeight < 16;
            },
            children: D ? l : k ? /* @__PURE__ */ f(
              fr,
              {
                output: e,
                fallback: t,
                mediaGridKind: us(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ f(Ch, { preview: n, label: o ?? t })
          }
        ),
        d
      ]
    }
  );
}
function Ch({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ L("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ f(
      "img",
      {
        src: e.imageUrl,
        alt: t || "图片结果",
        loading: "lazy",
        decoding: "async"
      }
    ),
    t ? /* @__PURE__ */ f("figcaption", { children: t }) : null
  ] }) : e.videoUrl ? /* @__PURE__ */ L("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ f(
      Xs,
      {
        src: e.videoUrl,
        poster: e.videoPosterUrl,
        ariaLabel: t || "视频结果",
        objectFit: "contain",
        allowDragFromVideo: !0
      },
      e.videoUrl
    ),
    t ? /* @__PURE__ */ f("figcaption", { children: t }) : null
  ] }) : e.audioUrl ? /* @__PURE__ */ L("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ f("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ f("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ L(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ f(Va, { size: 16 }),
        /* @__PURE__ */ f("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ f(
    fr,
    {
      output: Sh(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function Sh(e) {
  return e ? { text: e } : void 0;
}
function gl(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function js(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t && t.contains(n));
}
function _h(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  return t ? yl(e, t) : !1;
}
function yl(e, t) {
  if (t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function Rh(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? Gp(n, e.clientY) : js(t, e.currentTarget);
}
function kh({
  assistantName: e,
  onIntent: t,
  onOpen: n
}) {
  const o = `打开${e || "画布助手"}`;
  return /* @__PURE__ */ f("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ f(gt, { label: o, side: "left", children: /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "ws-assistant-launcher-button",
      "aria-label": o,
      "aria-controls": "workspace-canvas-assistant",
      "aria-expanded": !1,
      onPointerEnter: t,
      onFocus: t,
      onClick: n,
      children: /* @__PURE__ */ f(sg, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const ma = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!ma || Object.keys(ma).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const Id = ms(), Cd = ms(), Us = ms(), Sd = ms(), _d = ms();
function We(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: xh } = ma;
function Th(...e) {
  for (const t of e) {
    const n = _o(t);
    if (n)
      return n;
  }
  return null;
}
function ni(...e) {
  for (const t of e) {
    const n = hl(t);
    if (Ge(n))
      return n;
  }
  return "";
}
function hl(e) {
  const t = ls(Id, e);
  return t !== fs ? t : bo(
    Id,
    e,
    Mh(e)
  );
}
function Mh(e) {
  const t = $e(e), n = gs(t);
  if (n !== t)
    return hl(n);
  const o = xh?.(t) ?? t, s = wo(o, /* @__PURE__ */ new Set());
  if (Ge(s))
    return s;
  if (o !== t) {
    const c = wo(t, /* @__PURE__ */ new Set());
    if (Ge(c))
      return c;
  }
  const r = pi(t);
  if (r)
    return sa?.(r) ?? r;
  const i = ac(e);
  return i !== t && Ge(i) ? i : "";
}
function wo(e, t) {
  const n = $e(e), o = gs(n);
  if (o !== n)
    return wo(o, t);
  if (typeof n == "string") {
    const a = vl(n);
    if (Ge(a))
      return a;
    const d = ps(n);
    return d ? { text: d } : Zn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((d) => wo(d, t)).filter(Ge);
    return a.length > 0 ? a : "";
  }
  if (!We(n))
    return n;
  if (Po(n)) {
    const a = Sl(n);
    if (a !== void 0)
      return wo(a, t);
    const d = _l(n);
    if (d)
      return { text: d };
    const l = _o(n) || Dt(n);
    return l ? { rich: l } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), lc(n))
    return ga(n);
  if (bl(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const d = wo(n[a], t);
    if (Ge(d))
      return d;
  }
  const s = cc(n);
  if (s) {
    const a = { rich: s };
    return sa?.(a) ?? a;
  }
  const r = Dt(n);
  if (r)
    return { rich: r };
  const i = pi(n);
  if (i)
    return sa?.(i) ?? i;
  const c = Et(n);
  if (c !== n)
    return wo(c, t);
  if (Ah(n))
    return ga(n);
  if (yi(n)) {
    const a = Oe(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return mi(n) ? n : "";
}
function Ah(e) {
  return !!(We(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function ga(e) {
  const t = {}, n = $e(e.content);
  We(n) && kd(t, n), kd(t, e);
  const o = Dh(e);
  return o && (t.text = o), !Ge(t) && n && typeof n == "object" ? n : mi(t) ? t : "";
}
function Dh(e) {
  const t = Oe(e.text);
  if (t)
    return t;
  const n = $e(e.content);
  return typeof n == "string" ? n.trim() : We(n) ? Oe(n.text) : "";
}
function ac(e) {
  const t = gs(e);
  if (t !== e)
    return ac(t);
  const n = pi(e);
  if (n)
    return n;
  const o = vl(e);
  if (Ge(o))
    return o;
  const s = $e(e), r = Dt(s);
  if (r)
    return { rich: r };
  const i = Et(s);
  if (i !== s) {
    const c = Dt(i);
    return c ? { rich: c } : i;
  }
  return s;
}
function pi(e) {
  const t = _o(e);
  return t ? { rich: t } : null;
}
function _o(e, t = /* @__PURE__ */ new Set()) {
  const n = $e(e), o = gs(n);
  if (o !== n)
    return _o(o, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = _o(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!We(n) || t.has(n))
    return null;
  if (t.add(n), Po(n))
    return wl(n, t) || n;
  const s = n, r = [
    et(s, ["output", "content", "rich"]),
    et(s, ["output", "rich"]),
    et(s, ["content", "rich"]),
    s.content,
    s.rich,
    s.text,
    s.summary
  ];
  for (const i of r) {
    if (i === n)
      continue;
    const c = _o(i, t);
    if (c)
      return c;
  }
  return null;
}
function wl(e, t) {
  const n = oi(e);
  for (const o of n) {
    const s = Rd(o, t);
    if (s)
      return s;
  }
  return Rd(n.join(""), t);
}
function Rd(e, t) {
  const n = String(e || "").trim();
  if (!Zn(n))
    return null;
  const o = gu(n);
  return o === n || o === e ? null : _o(o, t);
}
function Ph(e) {
  return oi(e).join("");
}
function oi(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((o) => oi(o, t));
  if (!We(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...oi(e.content, t)), n;
}
function vl(e) {
  const t = Wt(e);
  if (t)
    return { rich: t };
  const n = $e(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const o = ps(n);
    return o ? { text: o } : "";
  }
  return "";
}
function Wt(e, t = /* @__PURE__ */ new Set()) {
  const n = $e(e);
  if (Po(n))
    return wl(n, t) || n;
  if (Array.isArray(n))
    return Dt(uc(n));
  if (!We(n) || t.has(n))
    return null;
  t.add(n);
  const o = n, s = cc(o);
  if (s)
    return s;
  const r = [
    et(o, ["output", "content", "rich"]),
    et(o, ["output", "content"]),
    et(o, ["output", "rich"]),
    et(o, ["content", "output", "content", "rich"]),
    et(o, ["content", "output", "content"]),
    et(o, ["content", "rich"]),
    et(o, ["data", "output", "content", "rich"]),
    et(o, ["data", "output", "content"]),
    et(o, ["data", "content", "rich"]),
    o.rich,
    o.output,
    o.result,
    o.content,
    o.data,
    o.value,
    o.json,
    o.text,
    o.message
  ];
  for (const i of r) {
    if (i == null || i === n)
      continue;
    const c = Wt(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(o)) {
    if (!Rl(i) || !c || typeof c != "object")
      continue;
    const a = Wt(c, t);
    if (a)
      return a;
  }
  return null;
}
function cc(e) {
  if (Po(e))
    return e;
  const t = We(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), o = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? Dt({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || o === "rich_json") && e.rich != null ? Wt(e.rich) : (n === "rich_json" || o === "rich_json") && t?.rich != null ? Wt(t.rich) : null;
}
function Po(e) {
  return !!(We(e) && e.type === "doc" && Array.isArray(e.content));
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
    Ge(t[n]) && (e[n] = n === "rich" ? Eh(t[n]) : t[n]);
}
function Eh(e) {
  return Wt(e) || Dt(uc(e)) || Dt(e) || e;
}
function mi(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Ge(n));
}
function bl(e) {
  return !We(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => Ge(e[t]));
}
function Ge(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !Zn(t) && !qt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Ge) : We(e) ? Wt(e) ? !0 : yi(e) ? !1 : mi(e) : !1;
}
function dc(e) {
  return Kt(
    Rn(e),
    e.description || e.title
  );
}
function Oh(e) {
  const t = [
    Rn(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const o = Wt(n) || Dt(ac(n)) || Dt(Et(n)) || Dt(n);
    if (o)
      return o;
  }
  return null;
}
function Kt(e, t = "") {
  const n = ls(Sd, e), o = n !== fs ? n : bo(
    Sd,
    e,
    Fh(e)
  );
  if (o !== null) return o;
  const s = String(t || "").trim();
  if (qt(s))
    return "";
  const r = ps(s);
  if (r)
    return r;
  if (!Zn(s))
    return s;
  const i = No(
    Et($e(s))
  ).trim();
  return i && i !== s && !qt(i) ? i : "";
}
function Fh(e) {
  const t = Et(e), n = Dt(t), o = n ? No(n).trim() : "";
  if (o && !qt(o))
    return o;
  const s = No(t).trim();
  if (qt(s))
    return "";
  const r = ps(s);
  if (r)
    return r;
  if (s && !Zn(s))
    return s;
  if (fc(s)) {
    const i = No(
      Et($e(s))
    ).trim();
    if (i && i !== s && !qt(i))
      return i;
  }
  return null;
}
function qt(e) {
  const t = e.trim();
  return t ? Bh(t) || zh(t) : !1;
}
function Bh(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function zh(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function Xn(e, t) {
  const n = ls(_d, e), o = n === fs ? /* @__PURE__ */ new Map() : n, s = o.get(t);
  if (s) return { ...s };
  const r = Uh(e, t);
  return o.set(t, r), bo(_d, e, o), { ...r };
}
function Uh(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, o = Et(e);
  return as(n, o, t), !Jn(n) && o !== e && as(n, e, t), Hr(n) && Zn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Jp(e, "video").find(
    (s) => s.url === n.videoUrl
  )?.thumbnail), n;
}
function Lh(e, t) {
  return {
    text: Oe(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function as(e, t, n, o = /* @__PURE__ */ new Set(), s = 0) {
  if (s > 12 || t == null)
    return;
  if (typeof t == "string") {
    xd(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const d of t)
      if (as(e, d, n, o, s + 1), Hr(e))
        return;
    return;
  }
  if (typeof t != "object") {
    e.text = String(t);
    return;
  }
  if (o.has(t))
    return;
  o.add(t);
  const r = t, i = $h(e, r, n), c = Kt(t, "");
  c && c !== i && !_n(c) && (e.text ||= c);
  const a = cr(r.url, r.src, r.href);
  if (a && a !== i && xd(e, a, n), e.imageUrl ||= cr(
    r.image,
    r.image_url,
    r.imageUrl,
    mt(r.images),
    mt(r.imageUrls)
  ), e.videoUrl ||= cr(
    r.video,
    r.video_url,
    r.videoUrl,
    mt(r.videos),
    mt(r.videoUrls)
  ), e.audioUrl ||= cr(
    r.audio,
    r.audio_url,
    r.audioUrl,
    mt(r.audios),
    mt(r.audioUrls)
  ), e.fileUrl ||= cr(
    r.file,
    r.file_url,
    r.fileUrl,
    mt(r.files),
    mt(r.fileUrls)
  ), !Hr(e)) {
    for (const d of ["output", "result", "content", "body", "data", "rich"])
      if (r[d] && typeof r[d] == "object" && (as(e, r[d], n, o, s + 1), Hr(e)))
        return;
  }
  if (!e.text && !Jn(e) && !Hh(r) && mi(r))
    try {
      const d = JSON.stringify(t, null, 2);
      hr(d) || (e.text = d);
    } catch {
      const d = String(t);
      hr(d) || (e.text = d);
    }
}
function $h(e, t, n) {
  const o = Nl(
    n,
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
  if (!o)
    return "";
  const s = cr(...jh(t, o));
  return s ? (o === "image" && (e.imageUrl ||= s), o === "video" && (e.videoUrl ||= s), o === "audio" && (e.audioUrl ||= s), o === "file" && (e.fileUrl ||= s), s) : "";
}
function Vh(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return Nl(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function Nl(...e) {
  for (const t of e) {
    const n = gi(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function gi(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function jh(e, t) {
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
    et(e, ["attrs", "src"]),
    et(e, ["attrs", "url"]),
    et(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    mt(e.images),
    mt(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    mt(e.videos),
    mt(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    mt(e.audios),
    mt(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    mt(e.files),
    mt(e.fileUrls),
    ...n
  ];
}
function xd(e, t, n) {
  const o = t.trim();
  if (!o || qt(o))
    return;
  if (fc(o)) {
    const c = $e(o);
    if (c !== o && (as(e, c, n), Hr(e)))
      return;
    const a = Kt(c, "");
    a && !_n(a) && (e.text ||= a);
    return;
  }
  const s = ps(o);
  if (s) {
    e.text ||= s;
    return;
  }
  const r = No(o);
  if (r && r !== o) {
    e.text ||= r;
    return;
  }
  const i = Kh(o, n);
  if (i) {
    Gh(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (_n(o)) {
    const c = gi(n);
    if (c === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(o)) {
      e.imageUrl ||= o;
      return;
    }
    if (c === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(o)) {
      e.videoUrl ||= o;
      return;
    }
    if (c === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(o)) {
      e.audioUrl ||= o;
      return;
    }
    e.fileUrl ||= o;
    return;
  }
  e.text ||= o;
}
function Kh(e, t) {
  const n = Il(e, t), o = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (o) {
    const d = Wi(o[2]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: Ls(e, o[0], o[1])
      };
  }
  const s = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (s) {
    const d = Wi(s[1]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: Ls(e, s[0], "")
      };
  }
  const r = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = r.exec(e); ) {
    const d = Wi(i[2]), l = Td(d, n);
    if (l)
      return {
        kind: l,
        url: d,
        caption: Ls(e, i[0], i[1])
      };
  }
  const c = Wh(e), a = Td(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: Ls(e, c, "")
  } : null;
}
function Il(e, t) {
  return gi(t) ? t : qh(e) ? "image" : t;
}
function qh(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Gh(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Td(e, t) {
  if (!e || !_n(e))
    return "";
  const n = gi(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function Ls(e, t, n) {
  const o = e.replace(t, "").replace(/\s+/g, " ").trim();
  return o && o !== e.trim() && !_n(o) ? o : String(n || "").trim();
}
function Wi(e) {
  const t = Cl(e);
  return _n(t) ? t : "";
}
function Wh(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? Cl(t[0]) : "";
}
function Cl(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Hh(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function Jn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !hr(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Hr(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Yh(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (We(t)) {
      const n = Oe(
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
        et(t, ["attrs", "src"]),
        et(t, ["attrs", "url"]),
        et(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function cr(...e) {
  const t = Yh(...e);
  return _n(t) ? t : "";
}
function mt(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function _n(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function Rn(e) {
  return Jh(
    Yp(e.asset?.version?.content, e.resultOutput)
  );
}
function Jh(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const o = ls(Us, n);
    if (o !== fs) return o;
    const s = Sl(n);
    if (s !== void 0)
      return bo(Us, n, s);
    const r = _l(n);
    if (r)
      return bo(Us, n, {
        text: r
      });
    const i = ni(n) || Et(n);
    if (Ge(i) || pc(i))
      return bo(Us, n, i);
  }
  if (t !== void 0)
    return ni(t) || Et(t);
}
function Sl(e) {
  const t = $e(e), n = Po(t) ? t : Wt(t);
  if (!n)
    return;
  const o = Ph(n).trim();
  if (!Zn(o))
    return;
  const s = gu(o);
  if (s === o)
    return;
  const r = Et(s);
  if (Ge(r) || pc(r))
    return r;
}
function _l(e) {
  const t = $e(e), n = Po(t) ? t : Wt(t);
  return Xp(n);
}
function Et(e) {
  const t = ls(Cd, e);
  return t !== fs ? t : bo(
    Cd,
    e,
    Xh(e)
  );
}
function Xh(e) {
  const t = $e(e), n = gs(t);
  if (n !== t)
    return Et(n);
  if (bl(t))
    return t;
  if (We(t) && lc(t)) {
    const r = ga(t);
    if (Ge(r))
      return r;
  }
  const o = pi(t);
  if (o)
    return o.rich;
  if (Po(t))
    return t;
  const s = Wt(t);
  return s || uc(ri(t, /* @__PURE__ */ new Set()));
}
function ri(e, t) {
  if (!We(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, o = kl(n);
  if (o !== void 0)
    return o;
  const s = Zh(n, t);
  if (s !== void 0)
    return s;
  for (const r of Qh) {
    const i = et(n, r);
    if (i === void 0 || i === e)
      continue;
    const c = ri(
      $e(i),
      t
    );
    if (ya(c))
      return c;
  }
  if (yi(n))
    for (const r of ["output", "result", "data", "body"]) {
      if (n[r] === void 0 || n[r] === e)
        continue;
      const i = ri(
        $e(n[r]),
        t
      );
      if (ya(i))
        return i;
    }
  return e;
}
function Zh(e, t) {
  for (const [n, o] of Object.entries(e)) {
    if (!Rl(n) || !o || typeof o != "object")
      continue;
    const s = ri($e(o), t);
    if (ya(s))
      return s;
  }
}
function Rl(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const Qh = [
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
function kl(e) {
  const t = cc(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = $e(e.content);
    if (We(n)) {
      const o = kl(n);
      if (o !== void 0)
        return o;
    }
  }
}
function uc(e) {
  const t = $e(e);
  return We(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function yi(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function ya(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !Zn(n) && !qt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!We(e) || Wt(e) || Dt(e))
    return !0;
  if (yi(e))
    return !1;
  const t = No(e).trim();
  return !!(t && !hr(t));
}
function et(e, t) {
  let n = e;
  for (const o of t) {
    if (!We(n) || !(o in n))
      return;
    n = n[o];
  }
  return n;
}
function gs(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const o = ew(t, n);
    if (o !== void 0)
      return o;
  }
  return e;
}
function ew(e, t) {
  const n = `\`\`\`${t}`, o = e.toLowerCase().indexOf(n);
  if (o < 0)
    return;
  let s = o + n.length;
  for (; s < e.length && /\s/.test(e[s] || ""); )
    s += 1;
  let r = s;
  for (; r < e.length; ) {
    const i = e.indexOf("```", r), c = i >= 0 ? e.slice(s, i) : e.slice(s), a = tw(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    r = i + 3;
  }
}
function tw(e, t = !1) {
  const n = e.trim(), o = Zp(n);
  for (const s of Qp([n, o])) {
    const r = $e(s);
    if (r !== s && (t ? nw(r) : lc(r)))
      return r;
  }
  return null;
}
function nw(e) {
  if (!We(e))
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
function lc(e) {
  if (!We(e))
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
  ].some((n) => Ge(e[n]));
}
function fc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Zn(e) {
  const t = String(e || "").trim();
  return !!(t && (fc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function xl(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return qt(e) ? "" : e;
  const t = No(e).trim();
  if (t && qt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return hr(n) ? "" : n;
  } catch {
    const n = String(e);
    return qt(n) ? "" : n;
  }
}
function pc(e) {
  const t = xl(e).trim();
  return !!(t && !hr(t));
}
function hr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || qt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const ha = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!ha || Object.keys(ha).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const ow = ha.useTheme;
function Ao(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function si(e) {
  return Ao(e) ? e : {};
}
function Ee(e, ...t) {
  let n = e;
  for (const o of t) {
    if (!Ao(n))
      return;
    n = n[o];
  }
  return n;
}
const rw = {}, Ks = [], sw = [], Md = [], iw = 800;
function aw(e) {
  const t = ne(/* @__PURE__ */ new Map()), n = ne(0), o = O(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
    const r = t.current;
    t.current = /* @__PURE__ */ new Map(), r.size !== 0 && e((i) => Nh(i, r));
  }, [e]), s = O(
    (r, i) => {
      bh(t.current, r, i), !n.current && (n.current = window.setTimeout(() => {
        n.current = 0, o();
      }, Aw));
    },
    [o]
  );
  return ue(
    () => () => {
      n.current && window.clearTimeout(n.current), t.current = /* @__PURE__ */ new Map();
    },
    []
  ), se(() => ({ enqueue: s, flush: o }), [s, o]);
}
function Ad(e, t) {
  let n = null;
  for (const o of t)
    Object.prototype.hasOwnProperty.call(e, o) && (n ||= { ...e }, delete n[o]);
  return n || e;
}
function Tl(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const o of t)
    if (n.add(o.id), o.type === "group")
      for (const s of dp(e, o.id))
        n.add(s.id);
  return n;
}
function cw(e) {
  return Object.values(e).some(Vt);
}
function dw(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function uw(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function lw(e, t, n) {
  const o = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((s) => {
    const r = Xl(s), i = s.x + r.width, c = s.y + r.height;
    return s.type === "group" ? o.left <= s.x && o.top <= s.y && o.right >= i && o.bottom >= c : o.left <= i && o.right >= s.x && o.top <= c && o.bottom >= s.y;
  }).map((s) => s.id);
}
function fw(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const pw = {
  workSpace: za(db, tf)
}, mc = Um(!1), mw = za(ef, tf), gw = {
  animated: uh
}, yw = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, hw = [18, 18], ww = ["Control", "Meta"], vw = {
  type: "animated",
  animated: !1
}, bw = { padding: 0.32, maxZoom: 0.72 };
function Ue(e) {
  const t = ne(e);
  return ns(() => {
    t.current = e;
  }, [e]), se(() => $y(t), []);
}
function $b({
  onInitialLoadComplete: e
}) {
  const t = Bf(), [n, o] = K(""), s = hg(), r = se(() => vb(), []), i = se(() => bb(), []), c = se(() => new Sy(), []), [a, d] = K(null), [l, y] = K(i), v = ne(i), [b, I] = K(0), R = ne(0), [k, D] = K(null), A = ne(null), [T, V] = K([]), te = T[T.length - 1] || "", [G, re] = K({}), F = ne(G), [ge, $] = K(!1), [q, z] = K([]), [Z, me] = K(!1), ye = ne(0), [ve, fe] = K("create"), [he, Fe] = K(
    () => Nb(r)
  ), [ce, Be] = K(!1), [be, Ot] = K(
    () => Ib()
  ), { resolvedTheme: st, setTheme: Qn } = ow();
  wg(s.site.appearance, st);
  const [pe, He] = K(null), [de, it] = K(null), [Me, kn] = K(null), [eo, vt] = K(!0), Oo = ne(!0), [Ce, Fo] = K({}), xn = ne(Ce);
  xn.current = Ce;
  const Bo = ne(/* @__PURE__ */ new Set()), zo = aw(Fo), [gn, en] = K({}), [at, ct] = K(null), [ys, _t] = K(null), tn = at?.id || "", nn = ys?.id || "", dt = se(
    () => [tn, nn],
    [tn, nn]
  ), Le = O(
    (u) => {
      ct(u), _t(u);
    },
    []
  ), [yn, on] = K(null), [Uo, hs] = K(!1), Ve = ne(/* @__PURE__ */ new Set()), [Tn, Mn] = K(null), [ws, Lo] = K(), [An, $o] = K(), [Vo, to] = K(
    null
  ), [rn, Dn] = K(null), [vs, Ht] = K(!1), [sn, Yt] = K(""), [Jt, no] = K(null), [oo, hn] = K(""), [ut, ze] = K([]), [yt, ro] = K([]), [nt, Pn] = K(!1), [Nr, so] = K(""), [jo, En] = K(!1), [_e, On] = K(1), [bs, ae] = K(!1), [wn, ht] = K(() => /* @__PURE__ */ new Set()), [Ns, Ft] = K(!1), [bt, Bt] = K(null), [Fn, vn] = K(!1), Re = ne(null), io = ne(!1), zt = ne(/* @__PURE__ */ new Set()), ao = ne(/* @__PURE__ */ new Set()), Ut = ne(/* @__PURE__ */ new Set()), Ye = ne([]), Ir = ne(/* @__PURE__ */ new Set()), Lt = ne(null), Rt = ne(new AbortController()), Cr = ne(new AbortController()), an = ne(Ny());
  ns(() => {
    const u = new AbortController();
    return Cr.current = u, () => u.abort();
  }, [l]), ue(() => {
    Rt.current.signal.aborted && (Rt.current = new AbortController());
    const u = Rt.current, p = an.current;
    return () => {
      u.abort(), p.clear();
    };
  }, []);
  const Xt = ne([0]), co = ne(null), Bn = ne(/* @__PURE__ */ new Map()), Ko = ne(
    /* @__PURE__ */ new Map()
  ), qo = ne(/* @__PURE__ */ new Set()), [
    Is,
    Go
  ] = K(() => /* @__PURE__ */ new Set()), [
    Wo,
    uo
  ] = K({}), [zn, Sr] = K({}), lt = ne(null), {
    roles: Ho,
    powers: Ae,
    powerCategories: Cs,
    loaded: kt,
    load: Zt
  } = wh({
    space: a,
    canvases: G,
    cache: c,
    onError: o
  });
  ue(() => {
    uo({});
  }, [a?.project.id, a?.project.release_id, a?.release?.id]), ue(() => {
    F.current = G;
  }, [G]), ue(() => {
    R.current = b;
  }, [b]), ue(() => {
    v.current = l;
  }, [l]), ue(() => {
    Ye.current = ut;
  }, [ut]);
  const cn = O(
    (u, p) => {
      if (u = u.trim(), !u)
        return;
      const g = qo.current;
      if (g.has(u) === p)
        return;
      const N = new Set(g);
      p ? N.add(u) : N.delete(u), qo.current = N, Go(N);
    },
    []
  ), Nt = O(
    (u) => {
      const p = Ul(u);
      if (!p)
        return;
      const g = String(p.request_id || "").trim();
      g && cn(g, In(p));
      const N = Yi(
        Ye.current,
        [p]
      );
      Ye.current = N, ze(N);
    },
    [cn]
  ), dn = O(
    (u) => {
      const p = String(u?.request_id || "").trim();
      p && cn(p, !1);
    },
    [cn]
  ), _r = O((u) => {
    o(u instanceof Error ? u.message : "保存画布失败");
  }, []), {
    markCanvasDirty: Un,
    flushCanvasSave: xt,
    flushPendingCanvasSaves: Rr,
    hasPendingCanvasSaves: Ln,
    adoptCanvasSnapshot: ot,
    forgetCanvasSnapshot: bi,
    resetCanvasAutosave: Ss,
    canvasSaveStatus: kr
  } = by({
    projectId: r,
    enabled: !!a,
    canvases: G,
    setCanvases: re,
    onError: _r
  }), It = Ue(
    of
  ), Yo = Ue(
    af
  );
  ue(() => {
    if (Ut.current.size === 0)
      return;
    const u = [...Ut.current];
    Ut.current.clear();
    for (const p of u)
      Un(p);
  }, [G, Un]);
  const xr = O(async () => {
    if (!r) {
      hn("缺少作品 ID"), vt(!1);
      return;
    }
    vt(!0), hn("");
    try {
      const u = await $f(
        r,
        v.current,
        R.current
      ), p = Rv(
        u.canvases || {},
        u.assets || []
      ), g = Number(u.initialCanvasId || 0) || Number(Object.values(p)[0]?.id || 0), N = Number(u.initialAssetCateId || 0) || Vf(u);
      d(u), F.current = p, re(p), Ss(p), v.current = g, y(g), R.current = N, I(N), sr(g), D(null), A.current = null, ye.current += 1, $(!1), z([]), me(!1), zt.current = /* @__PURE__ */ new Set(), ao.current = /* @__PURE__ */ new Set(), Ye.current = [], ze([]), qo.current = /* @__PURE__ */ new Set(), Go(/* @__PURE__ */ new Set()), Lt.current = null, Pn(!1), ro([]), On(1), ae(!1), Xt.current = [0], It(r, u, p, "recovery", {
        canvasId: g
      });
    } catch (u) {
      hn(u instanceof Error ? u.message : "加载创作空间失败");
    } finally {
      vt(!1);
    }
  }, [It, r, Ss]);
  ue(() => {
    const u = (p) => {
      !Ln() && Ut.current.size === 0 || (p.preventDefault(), p.returnValue = "");
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [Ln]);
  async function _s(u) {
    if (Xe(R.current))
      try {
        for (const p of Ut.current)
          Un(p);
        Ut.current.clear(), await Rr(), await u();
      } catch (p) {
        _r(p);
      } finally {
        Tt();
      }
  }
  const Tr = O((u) => {
    to(u);
  }, []);
  ue(() => {
    xr();
  }, [xr]), ue(() => {
    eo || !Oo.current || (Oo.current = !1, e());
  }, [eo, e]);
  const $t = a?.assetCates, Rs = se(() => a ? jf(a) : [], [a]), ks = Rs.length > 1, W = se(
    () => a ? Pi(a, b) : null,
    [b, a]
  ), Ni = se(
    () => a && W ? Kf(a, W.id) : [],
    [W, a]
  ), Mr = se(() => Ho.filter(qf), [Ho]), Ar = se(() => Ae.filter(Gf), [Ae]), H = se(() => {
    const u = a?.canvasList.find(
      (p) => p.id === l
    );
    return G[String(l)] || $c(
      u?.assetCateId || W?.id || 0,
      l,
      u?.name || "第一幕"
    );
  }, [l, W?.id, G, a?.canvasList]), un = se(
    () => (a?.canvasList || []).filter((u) => u.assetCateId === W?.id).sort((u, p) => u.sort - p.sort || u.id - p.id),
    [W?.id, a?.canvasList]
  ), Dr = O(
    async (u) => {
      const p = ye.current + 1;
      ye.current = p, me(!0);
      try {
        const g = await Wf({
          projectId: r,
          assetCateId: u
        });
        ye.current === p && z(g);
      } catch (g) {
        ye.current === p && (z([]), o(
          g instanceof Error ? g.message : "加载已删除画布失败"
        ));
      } finally {
        ye.current === p && me(!1);
      }
    },
    [r]
  ), Ii = O(() => {
    W && ($(!0), z([]), Dr(W.id));
  }, [W, Dr]), we = se(
    () => Dd(H, gn),
    [H, gn]
  ), Ci = se(() => {
    const u = new Set(T);
    return we.nodes.filter((p) => u.has(p.id));
  }, [we.nodes, T]), Si = O(
    async (u) => {
      const p = String(u), g = Rt.current.signal;
      g.throwIfAborted();
      const N = F.current[p], w = () => Ut.current.has(u) || Ln(u);
      if (w())
        throw new Error("画布有未保存的修改，请保存后重新采用助手结果");
      const C = await Lr({
        projectId: r,
        canvasId: u
      });
      if (g.throwIfAborted(), w() || F.current[p] !== N)
        throw new Error("加载期间画布已修改，已保留本地草稿，请重新采用助手结果");
      const _ = dr(
        nr(C.canvas, Ae),
        C.assets
      );
      d(
        (E) => E && {
          ...E,
          assets: or(E.assets, C.assets),
          canvasList: C.canvasList.length > 0 ? C.canvasList : E.canvasList
        }
      );
      const S = {
        ...F.current,
        [p]: _
      };
      F.current = S, re(S), ot(_);
    },
    [ot, Ln, Ae, r]
  ), _i = O((u) => {
    const p = tu(u);
    Ot(p), Gd(
      nu,
      String(p)
    );
  }, []), Se = O(
    (u) => {
      Fe(u), u || Be(!1), Gd(
        `${eu}:${r}`,
        u ? "1" : "0"
      );
    },
    [r]
  ), $n = Io, lo = ne([]), fo = se(() => {
    const u = nm(
      {
        nodes: we.nodes,
        assets: a?.assets || [],
        canvasId: H.id,
        assetCateId: W?.id || 0,
        nodeOutput: Rn,
        nodePreview: Eo,
        assetPreview: (p) => {
          const g = p.version?.content ?? p.name, N = Xn(
            g,
            String(p.kind || "")
          );
          return Jn(N) || (N.text = p.name), N;
        },
        nodeHasResult: Pt
      },
      lo.current
    );
    return lo.current = u, u;
  }, [H.id, W?.id, we.nodes, a?.assets]), Jo = ne([]), ft = se(() => {
    const u = om(
      fo,
      Jo.current
    );
    return Jo.current = u, u;
  }, [fo]), xs = Number(a?.release?.id || a?.project.release_id || 0);
  ue(() => {
    if (!pe?.connection || !W || !kt) return;
    const u = pe, p = pe.connection;
    if (u.canvasId !== we.id) return;
    const g = p.handleType === "target";
    if (!we.nodes.find((S) => S.id === p.nodeId)) return;
    const w = [
      ...Ar.map((S) => mn("power", W, we.nodes.length, u.position, { power: S })),
      ...Mr.map((S) => mn("agent", W, we.nodes.length, u.position, { role: S })),
      ...Pp.filter((S) => g ? S.key === "start" : S.key === "save" || S.key === "display").map(
        (S) => mn("function", W, we.nodes.length, u.position, { functionOption: S })
      )
    ];
    let C = !1;
    async function _() {
      const S = [];
      let E;
      for (let j = 0; j < w.length && !C; j += 6) {
        const Q = await Promise.all(w.slice(j, j + 6).map(async (Y) => {
          const X = zd(we, p, Y, ft);
          let ie, le = mr(X);
          if (le.kind === "form" && X.target) {
            try {
              ie = (await Zu(c, r, xs, X.target)).params;
            } catch (De) {
              return E ||= Gr(De, "部分能力的参数读取失败"), null;
            }
            le = mr({ ...X, params: ie });
          }
          return le.kind === "invalid" || le.kind === "form" ? null : {
            node: Y,
            params: ie,
            targetModelId: X.target?.composerDraft?.selectedTargetId,
            description: le.kind === "direct" ? le.description : le.kind === "media" ? "接收媒体素材" : "接收文本"
          };
        }));
        for (const Y of Q) Y && S.push(Y);
      }
      C || it({ menu: u, candidates: S, warning: E });
    }
    return _(), () => {
      C = !0;
    };
  }, [W, we, ft, c, xs, Ar, Mr, pe, kt, r]);
  const Xo = O(
    (u = "") => {
      Xc(), Yt(u), Re.current = H.nodes.find((p) => p.id === u) || (Re.current?.id === u ? Re.current : null), He(null), fe("create"), Ht(!0);
    },
    [H.nodes]
  ), Ct = O(
    (u, p) => {
      if (!Number.isInteger(u) || u <= 0)
        return;
      const g = (C) => {
        const _ = String(u), S = C[_];
        if (!S) return C;
        const E = _v(
          p(S),
          S.assetCateId
        );
        return Tv(S, E) ? C : (Ut.current.add(u), {
          ...C,
          [_]: E
        });
      }, N = F.current, w = g(N);
      F.current = w, re((C) => {
        const _ = C === N ? w : g(C);
        return F.current = _, _;
      });
    },
    []
  ), St = O(
    (u) => {
      W && Ct(H.id, u);
    },
    [H.id, W, Ct]
  ), ln = O(
    (u, p, g) => {
      const w = F.current[String(u)]?.nodes.find(
        (_) => _.id === p
      );
      if (Vc(w, g)) return;
      const C = Yg(
        ud(w, g),
        kt && !!$t
      );
      C === "defer-materialize" && (uo((_) => ({
        ..._,
        [`${u}:${p}`]: { canvasId: u, nodeId: p }
      })), kt || Zt()), v.current === u && en(
        (_) => kw(_, p, g)
      ), Ct(u, (_) => {
        const S = _.assetCateId, E = {
          ..._,
          nodes: _.nodes.map(
            (Y) => Y.id === p ? { ...Y, ...g } : Y
          )
        };
        if (!$t)
          return E;
        const j = {
          canvas: E,
          assetCate: Ei($t, S),
          powers: Ae
        };
        if (C === "materialize")
          return dd({
            ...j,
            sourceNodeId: p
          });
        if (C === "defer-materialize")
          return E;
        const Q = ph(
          E.nodes,
          p
        );
        return Q.length ? Vi({
          ...j,
          sourceNodeIds: Q,
          previousNodes: _.nodes
        }) : E;
      });
    },
    [
      $t,
      Zt,
      kt,
      Ae,
      Ct
    ]
  );
  ue(() => {
    if (!kt || !$t)
      return;
    const u = new Map(Object.entries(Wo));
    for (const p of Object.values(G))
      for (const g of p.nodes)
        g.outputType === "setting" && ud(g, {}) && u.set(`${p.id}:${g.id}`, { canvasId: p.id, nodeId: g.id });
    if (u.size !== 0) {
      Object.keys(Wo).length > 0 && uo({});
      for (const { canvasId: p, nodeId: g } of u.values())
        Ct(
          p,
          (N) => dd({
            canvas: N,
            assetCate: Ei($t, N.assetCateId),
            powers: Ae,
            sourceNodeId: g
          })
        );
    }
  }, [
    G,
    $t,
    Wo,
    kt,
    Ae,
    Ct
  ]);
  const Ri = O(
    (u, p) => {
      const g = v.current;
      Sr((N) => ({
        ...N,
        [`${g}:${u}`]: { canvasId: g, nodeId: u, unitIds: p }
      })), kt || Zt();
    },
    [Zt, kt]
  );
  ue(() => {
    if (!kt || !$t || Object.keys(zn).length === 0)
      return;
    const u = Object.values(zn);
    Sr({});
    for (const { canvasId: p, nodeId: g, unitIds: N } of u)
      try {
        Ct(p, (w) => {
          const C = {
            canvas: w,
            storyNodeId: g,
            assetCate: Ei($t, w.assetCateId),
            powers: Ae
          };
          return hy({ ...C, unitIds: N });
        });
      } catch (w) {
        o(Gr(w, "创建章节分镜失败"));
      }
  }, [
    $t,
    zn,
    kt,
    Ae,
    Ct
  ]);
  const tt = O(
    (u, p) => {
      ln(H.id, u, p), v.current === H.id && Le(
        (g) => g?.id === u && !Vc(g, p) ? { ...g, ...p } : g
      );
    },
    [H.id, ln, Le]
  ), Pr = O(
    (u, p, g) => {
      if (!dv(p, g))
        return;
      const N = Number(g.version_id || 0), w = `${u}:${p.id}:${N}`;
      if (zt.current.has(w))
        return;
      zt.current.add(w);
      const C = p.title.trim(), _ = F.current[String(u)];
      Hf({
        projectId: r,
        nodeKey: p.id,
        versionId: N,
        prompt: cv(p, _)
      }).then((S) => {
        const E = S.title.trim();
        !E || E === C || S.versionId !== N || Ct(u, (j) => {
          const Q = j.nodes.find(
            (Y) => Y.id === p.id
          );
          return !Q || Q.titleMode !== "auto" || Q.title.trim() !== C || !Xd(Q) ? j : {
            ...j,
            nodes: j.nodes.map(
              (Y) => Y.id === p.id ? { ...Y, title: E } : Y
            )
          };
        });
      }).catch(() => {
        zt.current.delete(w);
      });
    },
    [r, Ct]
  ), Vn = O(
    async (u) => {
      u.canvasId && Un(u.canvasId);
    },
    [Un]
  ), Ts = O(
    (u, p, g) => {
      const N = {};
      St((w) => {
        const C = w.nodes.map(
          (_) => _.id === u ? {
            ..._,
            composerDraft: Yf(p)
          } : _
        );
        return N.canvas = { ...w, nodes: C }, N.canvas;
      }), g?.save === "immediate" && N.canvas && xt(N.canvas).catch(() => {
      });
    },
    [xt, St]
  ), Ms = O(
    (u) => {
      St((p) => {
        const g = p.edges.filter((N) => N.id !== u);
        return g.length === p.edges.length ? p : { ...p, edges: g };
      });
    },
    [St]
  ), Er = Ue(
    (u, p, g) => {
      if (Da(u.power, u.kind, u.outputType) && !Pm(
        Qr(u, u.resultOutput)?.document
      ))
        return;
      const N = !!(at && at.id !== u.id && Do(
        at.power,
        at.kind,
        at.outputType
      )), w = xv(u);
      if (_t(null), w) {
        ym(), N || (ct(null), Lo(void 0), $o(void 0)), Mn(w);
        return;
      }
      if (ts(), Mn(null), N) {
        _t(u);
        return;
      }
      Lo(p), $o(g), ct(u);
    }
  ), ki = O((u) => {
    Le(
      (p) => p?.id === u.id && p !== u ? u : p
    );
  }, [Le]), As = Ue(
    (u, p, g) => {
      const N = H.id, w = we.nodes.find((Q) => Q.id === u), C = g ?? w?.asset, _ = C?.version, S = jt(_?.content), E = S ?? (w && jt(qs(w)));
      if (w && E?.screenplay && !E.shots.length) {
        const Q = N + ":" + u;
        if (Ve.current.has(Q)) return;
        Ve.current.add(Q), (async () => {
          v.current === N && await Ie(w);
        })().catch((Y) => o(Gr(Y, "剧本生成分镜失败"))).finally(() => Ve.current.delete(Q));
        return;
      }
      const j = _?.updated_at || _?.created_at;
      if (!S || !C?.id || !_?.id || _.id !== C.version_id || !j) {
        o("未读取到已保存的分镜版本，请刷新后再确认");
        return;
      }
      o(""), on({
        canvasId: N,
        nodeId: u,
        assetId: C.id,
        versionId: _.id,
        expectedUpdatedAt: j,
        document: S,
        onConfirmed: p
      });
    }
  ), jn = yn?.canvasId === H.id ? yn : null;
  async function xi(u) {
    if (Uo || !jn)
      return !1;
    const { canvasId: p, nodeId: g, assetId: N, versionId: w, expectedUpdatedAt: C, onConfirmed: _ } = jn;
    hs(!0);
    try {
      const S = await sp({
        projectId: r,
        assetId: N,
        versionId: w,
        expectedUpdatedAt: C,
        productionPlan: u
      });
      return h(p, g, S), _?.(S), on((E) => E === jn ? null : E), !0;
    } catch (S) {
      return o(Gr(S, "确认分镜失败")), !1;
    } finally {
      hs(!1);
    }
  }
  const Zo = O(
    (u, p) => {
      en((g) => {
        const N = H.nodes.find(
          (_) => _.id === u
        );
        if (!N)
          return g;
        const w = g[u] || {}, C = {
          ...N,
          ...w
        };
        return {
          ...g,
          [u]: {
            ...w,
            feedbackRequests: p(So(C))
          }
        };
      });
    },
    [H.nodes]
  ), po = O((u) => {
    const p = new Set(u.filter(Boolean));
    if (p.size !== 0) {
      if (lt.current && p.has(lt.current.nodeId)) {
        const g = lt.current;
        lt.current = null, g.reject(new Error(cl));
      }
      Bt(
        (g) => g && p.has(g.node.id) ? null : g
      ), en((g) => {
        const N = { ...g };
        let w = !1;
        for (const C of p) {
          const _ = N[C] || {};
          N[C] = {
            ..._,
            feedbackRequests: []
          }, w = !0;
        }
        return w ? N : g;
      });
    }
  }, []), Je = O((u) => {
    !u || !u.id || d((p) => p && {
      ...p,
      assets: or(p.assets, [u])
    });
  }, []), m = O(
    (u, p) => {
      const g = ia(
        p,
        u.asset
      );
      Je(g);
      const N = ur(u, g);
      u.id.startsWith("asset-detail-") || tt(u.id, N), Le(
        (w) => w?.id === u.id ? { ...w, ...N } : w
      );
    },
    [tt, Je, Le]
  ), h = O(
    (u, p, g) => {
      const N = F.current[String(u)]?.nodes.find((w) => w.id === p);
      N && (v.current === u ? m(N, g) : (Je(g), ln(u, p, ur(N, g))));
    },
    [m, ln, Je]
  ), x = O(
    (u) => {
      if (!Tn)
        return;
      const p = H.nodes.find(
        (w) => w.id === Tn.nodeId
      );
      if (!p)
        return;
      const g = qr(u), N = ur(
        p,
        g
      );
      Je(g), tt(p.id, N);
    },
    [
      H.nodes,
      Tn,
      tt,
      Je
    ]
  ), B = O(
    ({ node: u, prompt: p }) => {
      const g = gc(u, p), N = wa(
        So(u),
        g
      );
      return Zo(
        u.id,
        (w) => wa(w, g)
      ), vn(!1), new Promise((w, C) => {
        lt.current = {
          nodeId: u.id,
          recordId: g.id,
          resolve: w,
          reject: C
        }, Bt({
          node: { ...u, feedbackRequests: N },
          recordId: g.id,
          prompt: p
        });
      });
    },
    [Zo]
  ), P = O(
    async (u) => {
      const p = lt.current;
      if (!(!p || Fn)) {
        vn(!0);
        try {
          await p.submit?.(u), Zo(
            p.nodeId,
            (g) => Qy(g, p.recordId, u)
          ), lt.current = null, Bt(null), p.resolve(u);
        } catch (g) {
          o(g instanceof Error ? g.message : "提交反馈失败");
        } finally {
          vn(!1);
        }
      }
    },
    [Zo, Fn]
  ), U = O(() => {
    Bt(null);
  }, []), ee = O(
    (u, p) => {
      if (lt.current?.nodeId === u.id && lt.current.recordId === p.id && p.status === "pending") {
        Bt({
          node: u,
          recordId: p.id,
          prompt: p.prompt
        });
        return;
      }
      if (p.status === "pending") {
        const g = av(
          Ye.current,
          u,
          p
        );
        if (g) {
          vn(!1), lt.current = {
            nodeId: u.id,
            recordId: p.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (N) => {
              await $l(
                r,
                g.run,
                g.pending,
                g.prompt,
                N
              ), window.setTimeout(() => co.current?.(), 0);
            }
          }, Bt({
            node: u,
            recordId: p.id,
            prompt: g.prompt
          });
          return;
        }
      }
      Bt({
        node: u,
        recordId: p.id,
        prompt: {
          ...p.prompt,
          values: p.values || p.prompt.values || {}
        }
      });
    },
    [r]
  ), J = O(
    (u) => {
      const p = AbortSignal.any([
        Rt.current.signal,
        Cr.current.signal
      ]), g = (w) => {
        Fo((C) => p.aborted || v.current !== u ? C : typeof w == "function" ? w(C) : w);
      }, N = {
        enqueue: (w, C) => zo.enqueue(
          w,
          (_) => !p.aborted && v.current === u ? C(_) : _
        ),
        flush: zo.flush
      };
      return {
        setRunningNode: g,
        getRunningNode: (w) => !p.aborted && v.current === u ? xn.current[w] : void 0,
        runningNodeBatcher: N,
        consumerSignal: p,
        subscribeRun: (w, C) => {
          const _ = an.current.subscribe(
            r,
            u,
            w,
            C
          ), S = Ye.current.find(
            (E) => E.canvas_id === u && E.request_id === w && Cn(E.status)
          );
          return S && C(S), _;
        }
      };
    },
    [r, zo]
  ), M = O(
    ({
      assetCate: u,
      startNode: p,
      canvas: g,
      nodes: N = g.nodes,
      ...w
    }) => {
      if (!a)
        throw new Error("创作空间尚未加载");
      const C = g.id;
      return {
        projectId: r,
        canvasId: C,
        assetCate: u,
        space: a,
        startNode: p,
        onCanvasRunChange: Nt,
        appliedResultKeys: ao.current,
        ownsNodeResult: (_, S) => Ji(
          Ye.current,
          C,
          _,
          S
        ),
        ...w,
        nodes: N,
        edges: g.edges,
        viewport: g.viewport,
        canvasUpdatedAt: g.updatedAt,
        flushCanvasSave: xt,
        onNodeResult: tt,
        onAssetCreated: Je,
        ...J(C),
        requestFlowFeedback: B,
        requestNodeTitle: (_, S) => Pr(g.id, _, S)
      };
    },
    [
      r,
      Nt,
      xt,
      Pr,
      B,
      J,
      a,
      tt,
      Je
    ]
  ), oe = O(
    async (u) => {
      !a || u?.consumerSignal?.aborted || await It(
        r,
        a,
        F.current,
        "recovery",
        {
          canvasId: u?.canvasId || v.current,
          runIds: [Number(u?.canvasRun?.run_id || 0)]
        }
      );
    },
    [It, r, a]
  ), ke = O(
    async (u) => {
      if (!a || !W)
        return;
      let p = null;
      try {
        po(
          My(
            u.id,
            we.nodes,
            we.edges
          )
        ), p = M({
          assetCate: W,
          startNode: u,
          canvas: {
            ...H,
            nodes: we.nodes,
            edges: we.edges,
            viewport: H.viewport
          }
        }), await Hi(p), await Vn(p);
      } catch (g) {
        if (p?.consumerSignal?.aborted || Xy(g) || zi(g))
          return;
        const N = g instanceof Error ? g.message : "开始节点执行失败", w = p;
        if (w && !rt(
          w,
          w.canvasRun,
          u.id
        ))
          return;
        w?.setRunningNode?.(
          (C) => rt(
            w,
            w.canvasRun,
            u.id
          ) ? {
            ...C,
            [u.id]: {
              nodeId: u.id,
              title: u.title,
              startedAt: Date.now(),
              progress: 92,
              status: "error"
            }
          } : C
        ), o(N), w && Jr(w, [u.id], 1400);
      } finally {
        dn(p?.canvasRun), await oe(p);
      }
    },
    [
      W,
      H,
      we.edges,
      we.nodes,
      po,
      M,
      Vn,
      oe,
      dn,
      a
    ]
  ), Ne = O(
    async (u) => {
      if (!a || !W)
        return;
      const p = F.current[String(H.id)] || H, g = p.nodes.find(
        (j) => j.id === u
      );
      if (!g) {
        o("分镜脚本节点不存在");
        return;
      }
      const N = (j) => Pt(j) && !ar(j, p.nodes), w = fl(
        p.nodes,
        N
      ).find((j) => j.sourceNodeId === u);
      if (!w) {
        o("当前分镜脚本尚未生成制作组");
        return;
      }
      const C = pl(
        w,
        p.nodes,
        p.edges,
        N
      );
      if (C.blockedReason) {
        o(C.blockedReason);
        return;
      }
      const _ = rc(u), S = M({
        assetCate: W,
        startNode: g,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: Nt,
        canvas: p
      });
      po(C.pendingNodeIds), S.setRunningNode?.((j) => ({
        ...j,
        [_]: {
          nodeId: _,
          title: `${g.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let E = 650;
      try {
        await Hi(S);
      } catch (j) {
        if (S.consumerSignal?.aborted || zi(j))
          E = 0;
        else if (rt(S, S.canvasRun, _)) {
          E = 1400;
          const Q = j instanceof Error ? j.message : "制作区执行失败";
          S.setRunningNode?.(
            (Y) => rt(S, S.canvasRun, _) ? {
              ...Y,
              [_]: {
                ...Y[_] || {
                  nodeId: _,
                  title: `${g.title || "分镜脚本"}制作区`,
                  startedAt: Date.now(),
                  progress: 0
                },
                status: "error"
              }
            } : Y
          ), o(Q);
        }
      } finally {
        dn(S.canvasRun), (S.canvasRun?.node_results || []).some(
          (Q) => Q.node_key && vr(Q) === "success"
        ) && !S.consumerSignal?.aborted && (St(
          (Q) => Vi({
            canvas: Q,
            sourceNodeIds: [u],
            assetCate: W,
            powers: Ae
          })
        ), await Vn(S)), S.consumerSignal?.aborted || Jr(S, [_], E), await oe(S);
      }
    },
    [
      H,
      W,
      po,
      M,
      Vn,
      Ae,
      oe,
      dn,
      Nt,
      a,
      St
    ]
  ), Ie = O(
    async (u, p) => {
      if (!a || !W)
        return;
      const g = F.current[String(H.id)] || H, N = g.nodes.find((X) => X.id === u.id) || u, w = Tw({
        ...N,
        composerDraft: {
          ...N.composerDraft || {},
          ...u.composerDraft || {}
        }
      });
      if (Jf(w)) {
        const X = Qr(
          w,
          w.resultOutput
        );
        if (!X) throw new Error("请等待作品加载完成后再发送");
        if (Zd(X.document)) {
          Er(w);
          return;
        }
        if (ve !== "create") throw new Error("当前作品只读，无法重新生成");
        const ie = `${g.id}:${w.id}`;
        if (X.document.status === "running" || Vt(xn.current[w.id]) || Bo.current.has(ie))
          throw new Error("当前灵感正在生成，请等待完成后再发送");
        Bo.current.add(ie);
        try {
          const le = await rm({
            project_id: r,
            canvas_id: g.id,
            work_asset_id: X.work_asset_id,
            expected_work_version_id: X.work_version_id,
            expected_work_revision: X.work_revision,
            action: "generate_inspirations",
            instruction: w.composerDraft?.prompt || ""
          });
          ln(g.id, w.id, {
            resultOutput: { writing: le },
            runError: ""
          });
        } finally {
          Bo.current.delete(ie);
        }
        return;
      }
      const C = ky(
        w.id,
        p?.targetNodeIds
      ), _ = Ty(
        g.nodes.map(
          (X) => X.id === w.id ? w : X
        ),
        C
      ), S = new Map(
        _.map((X) => [X.id, X])
      ), E = C.map((X) => S.get(X)).filter((X) => !!X), j = (X) => {
        let ie = X;
        for (const le of C)
          !ie[le] || !rt(Y, Y.canvasRun, le) || (ie === X && (ie = { ...X }), delete ie[le]);
        return ie;
      }, Q = ql(
        u.id,
        _,
        g.edges
      ), Y = M({
        assetCate: W,
        startNode: w,
        singleNode: !0,
        targetNodeIds: p?.targetNodeIds,
        onCanvasRunChange: Nt,
        canvas: g,
        nodes: _,
        runInput: {
          _manual_input_context: Q || void 0,
          _agent_turn_input: p?.agentInput,
          _storyboard_action: p?.storyboardAction,
          manual_node_id: u.id
        }
      });
      for (const X of E)
        tt(X.id, { runError: "" });
      Y.setRunningNode?.((X) => {
        const ie = { ...X };
        for (const le of E) {
          const De = X[le.id];
          ie[le.id] = {
            ...De || {},
            ...Ba(De),
            nodeId: le.id,
            title: le.title,
            startedAt: De?.startedAt || Date.now(),
            progress: Math.max(De?.progress || 0, 8),
            status: "running",
            ...le.id === w.id && p?.agentInput ? { agent: Dm() } : {}
          };
        }
        return ie;
      });
      try {
        await Hi(Y), await Vn(Y);
      } catch (X) {
        if (Y.consumerSignal?.aborted || !rt(Y, Y.canvasRun, w.id))
          return;
        if (zi(X)) {
          tt(w.id, { runError: "" }), Y.setRunningNode?.(j);
          return;
        }
        throw tt(w.id, {
          runError: X instanceof Error ? X.message : "节点运行失败"
        }), Y.setRunningNode?.(
          (ie) => rt(Y, Y.canvasRun, w.id) ? {
            ...ie,
            [w.id]: {
              ...ie[w.id] || {
                nodeId: w.id,
                title: w.title,
                startedAt: Date.now()
              },
              progress: 92,
              status: "error"
            }
          } : ie
        ), Jr(Y, C, 1400), X;
      } finally {
        dn(Y.canvasRun), await oe(Y);
      }
      w.outputType === "setting" && Y.canvasRun?.status === "success" && v.current === g.id && await Ne(w.id);
    },
    [
      W,
      H,
      M,
      Vn,
      r,
      oe,
      dn,
      Nt,
      a,
      Ne,
      Er,
      ln,
      tt,
      ve
    ]
  ), je = O(
    async (u) => {
      if (!W)
        throw new Error("当前分类不存在");
      const p = J(H.id);
      let g;
      const N = (C) => {
        const _ = g;
        g = {
          nodeId: u.id,
          title: u.title,
          startedAt: _?.startedAt || Date.now(),
          progress: C === "success" ? 100 : C === "error" ? 92 : 0,
          status: C
        };
        const S = g;
        p.setRunningNode(
          (E) => _ && E[u.id] !== _ ? E : { ...E, [u.id]: S }
        ), (C === "success" || C === "error") && window.setTimeout(
          () => p.setRunningNode(
            (E) => E[u.id] === S ? bu(E, u.id) : E
          ),
          C === "success" ? 650 : 1200
        );
      }, w = !wi(u);
      w && N("running");
      try {
        const C = await Zv({
          node: u,
          projectId: r,
          canvasId: H.id,
          assetCate: W,
          inputContext: u.inputContext || null,
          onNodeResult: tt,
          onAssetCreated: Je,
          onRunStartNode: ke,
          onOpenImportPicker: Xo
        });
        return w && N("success"), C;
      } catch (C) {
        throw w && N("error"), C;
      }
    },
    [
      H.id,
      W,
      J,
      Xo,
      r,
      ke,
      tt,
      Je
    ]
  );
  ue(() => {
    a && Yo(ut, H, a);
  }, [H, Yo, ut, a]);
  function Xe(u) {
    return A.current != null ? !1 : (A.current = u, D(u), !0);
  }
  function Tt() {
    A.current = null, D(null);
  }
  async function Ze() {
    const u = F.current[String(v.current)] || H;
    if (!u.id)
      return !0;
    try {
      return await xt(u), !0;
    } catch {
      return !1;
    }
  }
  function Qe() {
    V([]), en({}), Fo({}), Dn(null), He(null), kn(null), ct(null), _t(null), on(null), Mn(null), Lo(void 0), Ht(!1), Yt(""), Re.current = null, no(null), En(!1), Lt.current = null, Xt.current = [0], ro([]), On(1), ae(!1), Pn(!1), so("");
  }
  async function fn(u) {
    if (u === v.current) return !0;
    if (A.current != null)
      return !1;
    const p = a?.canvasList.find((g) => g.id === u);
    if (!p)
      return o("目标画布不存在"), !1;
    if (!Xe(p.assetCateId)) return !1;
    try {
      if (!await Ze()) return !1;
      const g = String(u);
      if (!Object.prototype.hasOwnProperty.call(F.current, g))
        try {
          const w = await Lr({
            projectId: r,
            canvasId: u
          }), C = dr(
            nr(w.canvas, Ae),
            w.assets
          );
          d(
            (S) => S && {
              ...S,
              assets: or(S.assets, w.assets),
              canvasList: w.canvasList.length > 0 ? w.canvasList : S.canvasList
            }
          );
          const _ = {
            ...F.current,
            [g]: C
          };
          F.current = _, re(_), ot(C);
        } catch (w) {
          return o(w instanceof Error ? w.message : "加载画布失败"), !1;
        }
      if (v.current = u, y(u), R.current = p.assetCateId, I(p.assetCateId), sr(u), Qe(), !a)
        return !0;
      const N = F.current[g] || $c(p.assetCateId, u, p.name);
      return Yo(ut, N, a), It(
        r,
        a,
        F.current,
        "recovery",
        { canvasId: u }
      ), !0;
    } finally {
      Tt();
    }
  }
  async function Or(u) {
    const p = (a?.canvasList || []).filter((g) => g.assetCateId === u).sort((g, N) => g.sort - N.sort || g.id - N.id)[0];
    if (p) return fn(p.id);
    if (!a || A.current != null || !Xe(u)) return !1;
    try {
      if (!await Ze()) return !1;
      const g = await Lr({
        projectId: r,
        canvasId: 0,
        assetCateId: u
      }), N = dr(
        nr(g.canvas, Ae),
        g.assets
      ), w = N.id, C = {
        ...F.current,
        [String(w)]: N
      };
      return F.current = C, re(C), ot(N), d(
        (_) => _ && {
          ..._,
          assets: or(_.assets, g.assets),
          canvasList: g.canvasList.length > 0 ? g.canvasList : _.canvasList
        }
      ), v.current = w, y(w), R.current = u, I(u), sr(w), Qe(), It(r, a, C, "recovery", {
        canvasId: w
      }), !0;
    } catch (g) {
      return o(
        g instanceof Error ? g.message : "加载输出类型失败"
      ), !1;
    } finally {
      Tt();
    }
  }
  async function Ds(u) {
    if (W) {
      if (!Xe(W.id))
        throw new Error("正在切换画布，请稍后重试");
      try {
        if (!await Ze())
          throw new Error("当前画布保存失败，未创建新画布");
        const p = await rp({
          projectId: r,
          assetCateId: W.id,
          name: u
        }), g = p.canvas;
        if (!g?.id) throw new Error("新画布数据为空");
        const N = nr(g, Ae), w = {
          ...F.current,
          [String(g.id)]: N
        };
        F.current = w, re(w), ot(N), d(
          (C) => C && {
            ...C,
            canvasList: p.canvasList,
            initialCanvasId: g.id,
            initialAssetCateId: g.assetCateId
          }
        ), v.current = g.id, y(g.id), R.current = g.assetCateId, I(g.assetCateId), sr(g.id), Qe(), mo();
      } catch (p) {
        throw o(p instanceof Error ? p.message : "创建画布失败"), p;
      } finally {
        Tt();
      }
    }
  }
  async function Fr(u, p) {
    try {
      const g = await op({ projectId: r, canvasId: u, name: p });
      d(
        (N) => N && { ...N, canvasList: g.canvasList }
      ), re((N) => {
        const w = N[String(u)];
        if (!w) return N;
        const C = {
          ...N,
          [String(u)]: { ...w, name: p }
        };
        return F.current = C, C;
      }), mo();
    } catch (g) {
      throw o(g instanceof Error ? g.message : "重命名画布失败"), g;
    }
  }
  async function Qo(u) {
    if (W)
      try {
        const p = await np({
          projectId: r,
          assetCateId: W.id,
          canvasIds: u
        });
        d(
          (g) => g && { ...g, canvasList: p.canvasList }
        );
      } catch (p) {
        throw o(
          p instanceof Error ? p.message : "调整画布顺序失败"
        ), p;
      }
  }
  async function Ps(u) {
    if (!Xe(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      const p = u === v.current, g = F.current[String(u)];
      g && await xt(g);
      const N = await tp({ projectId: r, canvasId: u });
      if (bi(u), d(
        (w) => w && { ...w, canvasList: N.canvasList }
      ), F.current[String(u)]) {
        const w = { ...F.current };
        delete w[String(u)], F.current = w, re(w);
      }
      if (p && N.activeCanvasId) {
        const w = N.canvasList.find(
          (_) => _.id === N.activeCanvasId
        );
        let C = F.current[String(N.activeCanvasId)];
        if (!C) {
          const _ = await Lr({
            projectId: r,
            canvasId: N.activeCanvasId
          });
          C = dr(
            nr(_.canvas, Ae),
            _.assets
          );
          const S = {
            ...F.current,
            [String(C.id)]: C
          };
          F.current = S, re(S), d(
            (E) => E && {
              ...E,
              assets: or(E.assets, _.assets),
              canvasList: N.canvasList
            }
          );
        }
        ot(C), v.current = C.id, y(C.id), R.current = w?.assetCateId || C.assetCateId, I(w?.assetCateId || C.assetCateId), sr(C.id), Qe(), a && It(
          r,
          a,
          F.current,
          "recovery",
          { canvasId: C.id }
        );
      }
      Dr(R.current), mo();
    } catch (p) {
      throw o(p instanceof Error ? p.message : "删除画布失败"), p;
    } finally {
      Tt();
    }
  }
  async function er(u) {
    if (!Xe(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      if (!await Ze())
        throw new Error("当前画布保存失败，未恢复画布");
      const p = await ep({ projectId: r, canvasId: u });
      if (!p.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let g = p.canvas, N = [], w = p.canvasList, C = "";
      try {
        const E = await Lr({
          projectId: r,
          canvasId: p.canvas.id
        });
        g = E.canvas, N = E.assets, E.canvasList.length > 0 && (w = E.canvasList);
      } catch (E) {
        C = E instanceof Error ? `画布已恢复，但资产加载失败：${E.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const _ = dr(
        nr(g, Ae),
        N
      ), S = {
        ...F.current,
        [String(_.id)]: _
      };
      F.current = S, re(S), ot(_), d(
        (E) => E && {
          ...E,
          assets: or(E.assets, N),
          canvasList: w,
          initialCanvasId: _.id,
          initialAssetCateId: _.assetCateId
        }
      ), v.current = _.id, y(_.id), R.current = _.assetCateId, I(_.assetCateId), sr(_.id), z(
        (E) => E.filter((j) => j.id !== _.id)
      ), $(!1), Qe(), mo(), a && It(r, a, S, "recovery", {
        canvasId: _.id
      }), C && o(C);
    } catch (p) {
      throw o(p instanceof Error ? p.message : "恢复画布失败"), p;
    } finally {
      Tt();
    }
  }
  function mo() {
    const u = Number(a?.project.team_id || 0);
    kg(u > 0 ? { teamID: u } : void 0);
  }
  function go(u) {
    Dn((p) => ({
      nodeId: u,
      nonce: (p?.nonce || 0) + 1
    }));
  }
  const Ti = O((u) => {
    Dn((p) => !p || p.nodeId !== u.nodeId || p.nonce !== u.nonce ? p : null);
  }, []);
  async function of(u, p, g, N, w = {}) {
    const C = Rt.current?.signal, _ = JSON.stringify([
      u,
      w.canvasId || 0,
      N,
      N === "active" ? [] : [...new Set(w.runIds || [])].sort((E, j) => E - j)
    ]), S = Ir.current;
    if (!(C?.aborted || S.has(_))) {
      S.add(_);
      try {
        const E = w.canvasId ? g[String(w.canvasId)] : void 0, j = E ? Ye.current.filter(
          (pt) => $s(pt, E)
        ) : Ye.current, Q = N === "active" ? Hw(j) : [], Y = [...new Set(
          (w.runIds?.length ? w.runIds : [
            ...Q,
            ...j.filter((pt) => pt.detailsPending)
          ].map((pt) => Number(pt.run_id || 0))).filter((pt) => pt > 0)
        )];
        if (N === "active" && Y.length === 0) return;
        const X = {
          projectId: u,
          scope: N,
          canvasId: w.canvasId,
          runIds: Y,
          summaryOnly: !0
        };
        let ie;
        if (N === "recovery" && Y.length === 0) {
          const pt = await qc({ ...X, limit: 50 }), Ff = await Fi(
            { ...X, scope: "active" },
            C
          );
          ie = Yi(
            jr(pt.items),
            jr(Ff)
          );
        } else
          ie = jr(
            await Fi(X, C)
          );
        const le = Zw(
          ie,
          j,
          N === "recovery" ? g : void 0
        );
        if (le.length === 0 || C?.aborted) return;
        const De = new Set(le);
        Mi(
          u,
          ie.filter((pt) => De.has(Number(pt.run_id || 0))).map((pt) => ({ ...pt, detailsPending: !0 })),
          g,
          p
        );
        const Ur = jr(
          await Fi(
            { ...X, runIds: le, summaryOnly: !1 },
            C
          )
        );
        if (C?.aborted) return;
        Mi(
          u,
          Ur,
          g,
          p
        );
      } catch {
      } finally {
        S.delete(_);
      }
    }
  }
  function Mi(u, p, g, N) {
    const w = Yi(
      Ye.current,
      p
    );
    Ye.current = w, ze(w);
    const C = new Map(w.map((S) => [wt(S), S])), _ = p.map((S) => C.get(wt(S))).filter((S) => !!S);
    for (const S of Object.values(g))
      Yo(_, S, N);
    for (const S of _) {
      const E = Bn.current.get(
        `${u}:${String(S.request_id || "")}`
      );
      if (E) {
        for (const j of Xr(S))
          E.finishedNodeIds.add(j);
        Cn(S.status) && E.controller.abort();
      }
      an.current.publish(u, S);
    }
  }
  async function Br(u, p = 0) {
    const g = v.current, N = Rt.current?.signal;
    if (Lt.current || N?.aborted) return;
    const w = {}, C = () => !N?.aborted && v.current === g && Lt.current === w, _ = Xt.current[p] || 0;
    Lt.current = w, Pn(!0), so("");
    try {
      const S = await qc({
        projectId: u,
        canvasId: g,
        scope: "history",
        beforeId: _,
        limit: 20
      });
      if (!C()) return;
      ro(
        jr(S.items)
      ), On(p + 1), ae(S.hasMore);
      const E = Xt.current.slice(0, p + 1);
      S.hasMore && S.beforeId > 0 && (E[p + 1] = S.beforeId), Xt.current = E;
    } catch (S) {
      if (!C()) return;
      so(
        S instanceof Error ? S.message : "读取画布运行记录失败"
      );
    } finally {
      C() && (Lt.current = null, Pn(!1));
    }
  }
  const Ai = se(
    () => zl(
      ut.filter(
        (u) => $s(u, H)
      )
    ),
    [H, ut]
  ), _c = Ai.length > 0, Rc = _c || ut.some(
    (u) => u.detailsPending && $s(u, H)
  ), rf = _c || cw(Ce);
  async function kc(u) {
    const p = !u, g = v.current, N = F.current[String(g)], w = J(g).consumerSignal, C = () => !w.aborted && v.current === g;
    if (p && (Ns || wn.size > 0) || !p && u?.some(
      (S) => wn.has(wt(S))
    ))
      return;
    let _ = [];
    p && Ft(!0);
    try {
      let S = u || [], E = 0, j = S.length;
      if (p) {
        const X = await up(r, g);
        S = X.items.map(To), E = X.failedCount, j = X.count;
      } else
        S = Yw(S);
      if (j === 0)
        return;
      p || (_ = S.map(wt), ht((ie) => {
        const le = new Set(ie);
        for (const De of _)
          le.add(De);
        return le;
      }), S = (await Promise.allSettled(
        S.map(
          (ie) => lp({
            projectId: r,
            runId: Number(ie.run_id || 0),
            requestId: String(ie.request_id || "")
          })
        )
      )).flatMap((ie, le) => {
        if (ie.status === "rejected")
          return E += 1, [];
        const De = To(ie.value);
        return [
          {
            ...S[le],
            status: De.status,
            error: De.error
          }
        ];
      }));
      const Q = Jw(S), Y = S.filter((X) => X.status === "canceled");
      if (Q.size > 0) {
        const X = (/* @__PURE__ */ new Date()).toISOString(), ie = (De) => De.map((Ur) => {
          const pt = Xw(Q, Ur);
          return pt ? { ...Ur, status: pt, updated_at: X } : Ur;
        }), le = ie(Ye.current);
        Ye.current = le, ze(le), C() && ro(ie);
      }
      if (N && a)
        for (const X of Y)
          Tc(
            { ...X, canvas_id: g },
            N,
            a,
            []
          );
      E > 0 && C() && o(
        E === j ? "停止运行失败，请稍后重试" : `${E} 个运行停止失败，请稍后重试`
      ), jo && C() && Br(
        r,
        Math.max(0, _e - 1)
      ), window.setTimeout(() => {
        C() && co.current?.();
      }, 0);
    } catch (S) {
      C() && o(
        S instanceof Error ? S.message : "停止画布运行失败"
      );
    } finally {
      _.length > 0 && ht((S) => {
        const E = new Set(S);
        for (const j of _)
          E.delete(j);
        return E;
      }), p && Ft(!1);
    }
  }
  function sf() {
    Tr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => kc()
    });
  }
  function xc(u) {
    Tr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => kc([u])
    });
  }
  co.current = a ? () => It(
    r,
    a,
    F.current,
    "active",
    { canvasId: v.current }
  ) : null, ue(() => {
    if (!a || !Rc)
      return;
    let u = !1, p = !1, g;
    const N = async () => {
      if (!(u || p)) {
        window.clearTimeout(g), p = !0;
        try {
          await co.current?.();
        } finally {
          p = !1, u || (g = window.setTimeout(
            N,
            document.hidden ? 15e3 : va
          ));
        }
      }
    }, w = () => {
      document.hidden || N();
    };
    return N(), window.addEventListener("online", w), window.addEventListener("focus", w), document.addEventListener("visibilitychange", w), () => {
      u = !0, window.clearTimeout(g), window.removeEventListener("online", w), window.removeEventListener("focus", w), document.removeEventListener("visibilitychange", w);
    };
  }, [l, Rc, r, a]), ue(() => {
    const u = Bn.current, p = Ko.current, g = [];
    if (a)
      for (const w of Ai) {
        const C = w.run, _ = String(C.request_id || "").trim();
        !_ || Is.has(_) || g.push({
          key: `${r}:${_}`,
          canvasId: Number(C.canvas_id || v.current),
          requestId: _,
          run: C,
          managedNodeIds: w.managedNodeIds
        });
      }
    const N = new Set(g.map((w) => w.key));
    for (const [w, C] of u)
      N.has(w) || (C.controller.abort(), u.delete(w), p.delete(w));
    for (const w of g) {
      const C = u.get(w.key);
      if (C) {
        C.managedNodeIds = w.managedNodeIds;
        for (const Q of Xr(w.run))
          C.finishedNodeIds.add(Q);
        continue;
      }
      const _ = new AbortController(), S = {
        controller: _,
        managedNodeIds: w.managedNodeIds,
        finishedNodeIds: Xr(w.run)
      };
      u.set(w.key, S);
      const E = {
        ...J(w.canvasId),
        canUpdateNode: (Q) => !_.signal.aborted && S.managedNodeIds.has(Q) && !S.finishedNodeIds.has(Q) && Ji(
          Ye.current,
          w.canvasId,
          w.run,
          Q
        )
      };
      (async () => {
        for (; !_.signal.aborted; ) {
          try {
            await vu({
              projectId: r,
              requestId: w.requestId,
              lastId: p.get(w.key) || "0-0",
              signal: _.signal,
              onFrame: (Q) => {
                if (_.signal.aborted || v.current !== w.canvasId) return;
                Q.stream_id && p.set(w.key, Q.stream_id), Yr(E, S.managedNodeIds, !1);
                const Y = Lw(
                  E,
                  Q,
                  S.managedNodeIds,
                  S.finishedNodeIds
                );
                Y && (w.run = yc(w.run, Y), Mi(
                  r,
                  [w.run],
                  F.current,
                  a
                ));
              }
            });
            return;
          } catch {
            if (_.signal.aborted) return;
          }
          Yr(E, S.managedNodeIds, !0), await Pl(va, _.signal);
        }
      })().catch(() => {
      });
    }
  }, [
    Is,
    r,
    Ai,
    J,
    a
  ]), ue(
    () => () => {
      for (const u of Bn.current.values())
        u.controller.abort();
      Bn.current.clear(), Ko.current.clear();
    },
    []
  );
  function af(u, p, g) {
    const N = u.filter(
      (S) => $s(S, p)
    );
    if (N.length === 0)
      return;
    const w = new Map(p.nodes.map((S) => [S.id, S])), C = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
    for (const S of N) {
      const E = new Set(
        ko(S).filter((Y) => _.has(Y) ? !1 : (_.add(Y), !0))
      );
      if (E.size === 0)
        continue;
      const Q = Ia(
        S,
        p
      ) ? [] : (S.node_results || []).filter((Y) => {
        const X = Y.node_key;
        return !X || !E.has(X) || C.has(X) || Ca(w.get(X), S, Y) ? !1 : (C.add(X), !0);
      });
      Tc(
        S,
        p,
        g,
        Q,
        E
      );
    }
  }
  function Tc(u, p, g, N = u.node_results || [], w) {
    const C = tv(u, p.nodes);
    if (!C)
      return;
    const _ = Pi(g, p.assetCateId);
    if (!_)
      return;
    const S = {
      projectId: r,
      canvasId: p.id,
      assetCate: _,
      space: g,
      startNode: C,
      nodes: p.nodes,
      edges: p.edges,
      viewport: p.viewport,
      onNodeResult: (E, j) => ln(p.id, E, j),
      onAssetCreated: Je,
      ...J(p.id),
      consumerSignal: Rt.current?.signal,
      requestFlowFeedback: B,
      requestNodeTitle: (E, j) => Pr(p.id, E, j),
      canvasRun: u,
      appliedResultKeys: ao.current,
      ownsNodeResult: (E, j) => Ji(
        Ye.current,
        p.id,
        E,
        j
      )
    };
    Vl(S, N), Fl(S, u.node_results || []), cf(S, u, C), Zr(S, u, w), hc(S, u, w);
  }
  function cf(u, p, g) {
    p.single_node || String(p.status || "").trim().toLowerCase() !== "success" || !jt(g.resultOutput) || Ct(
      u.canvasId,
      (N) => Vi({
        canvas: N,
        sourceNodeIds: [g.id],
        assetCate: u.assetCate,
        powers: Ae
      })
    );
  }
  function tr(u, p, g) {
    if (!W)
      return null;
    const N = mn(
      u,
      W,
      H.nodes.length,
      p,
      g
    ), w = a ? Pi(a, Ra(N) || W.id) : W;
    u === "asset" && (N.cardinality = w.cardinality);
    const C = u === "asset" && g?.replaceSingleAssetNode ? Ra(N) || Number(w.id || 0) : 0, _ = C ? Ud(
      H.nodes,
      H.edges,
      C,
      g?.connectFromNodeId
    ) : null, S = _ ? Ld(
      H.nodes,
      H.edges,
      C,
      g?.connectFromNodeId,
      _.id
    ) : /* @__PURE__ */ new Set(), E = _?.id || N.id;
    if (St((j) => {
      let Q = j.edges;
      const Y = C ? Ud(
        j.nodes,
        j.edges,
        C,
        g?.connectFromNodeId
      ) : null;
      if (Y) {
        const ie = Ld(
          j.nodes,
          j.edges,
          C,
          g?.connectFromNodeId,
          Y.id
        );
        Q = j.edges.filter(
          (De) => !ie.has(De.from) && !ie.has(De.to)
        ), g?.connectFromNodeId ? Q = qn(
          Q,
          g.connectFromNodeId || "",
          Y.id,
          j.nodes
        ) : g?.connectToNodeId && (Q = qn(
          Q,
          Y.id,
          g.connectToNodeId || "",
          j.nodes
        ));
        const le = j.nodes.filter((De) => !ie.has(De.id)).map(
          (De) => De.id === Y.id ? Qi(De, N) : De
        );
        return {
          ...j,
          nodes: le,
          edges: Mt(le, Q)
        };
      }
      g?.connectFromNodeId ? Q = qn(
        Q,
        g.connectFromNodeId || "",
        N.id,
        [...j.nodes, N]
      ) : g?.connectToNodeId && (Q = qn(Q, N.id, g.connectToNodeId || "", [...j.nodes, N]));
      const X = Hs(
        [...j.nodes, N],
        N.id,
        { x: N.x, y: N.y }
      );
      return {
        ...j,
        nodes: X,
        edges: Mt(X, Q)
      };
    }), _) {
      const j = Qi(_, N);
      en((Q) => {
        const Y = { ...Q };
        for (const X of S)
          delete Y[X];
        return Y[_.id] = {
          ...Y[_.id] || {},
          ...Cv(j)
        }, Y;
      });
    }
    return g?.selectCreated !== !1 && (V([E]), go(E)), fe("create"), He(null), _ ? Qi(_, N) : N;
  }
  function df(u, p) {
    if (!W)
      return;
    if (Nd(H.nodes).has(u.id)) {
      o("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const g = wv(
      u,
      W.id,
      H.nodes.length,
      p
    );
    St((N) => {
      const w = Hs(
        [...N.nodes, g],
        g.id,
        { x: g.x, y: g.y }
      );
      return {
        ...N,
        nodes: w,
        edges: Mt(w, N.edges)
      };
    }), en((N) => {
      const w = N[u.id];
      return w ? { ...N, [g.id]: w } : N;
    }), V([g.id]), go(g.id), He(null);
  }
  function uf(u, p = {}) {
    const g = Tl(
      H.nodes,
      u
    );
    if (g.size === 0)
      return;
    const N = Nd(H.nodes);
    if (!p.allowStoryboardFrame && [...g].some((w) => N.has(w))) {
      o(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      );
      return;
    }
    St((w) => {
      const C = Up(
        w.nodes,
        g
      ).filter((_) => !g.has(_.id));
      return li({
        canvas: { ...w, nodes: C, edges: Mt(C, w.edges) },
        assetCate: W,
        powers: Ae
      });
    }), en(
      (w) => Ad(w, g)
    ), Fo((w) => Ad(w, g)), V([]), Dn(
      (w) => w && g.has(w.nodeId) ? null : w
    ), ct(
      (w) => w && g.has(w.id) ? null : w
    ), _t(
      (w) => w && (g.has(w.id) || at && g.has(at.id)) ? null : w
    ), Mn(
      (w) => w && g.has(w.nodeId) ? null : w
    ), Yt(
      (w) => g.has(w) ? "" : w
    ), Re.current && g.has(Re.current.id) && (Re.current = null);
  }
  function Mc(u, p) {
    tr("asset", p, { asset: u });
  }
  function lf(u, p, g) {
    if (!u)
      return;
    const N = H.nodes.find((C) => C.id === u) || (g?.id === u ? g : Re.current?.id === u ? Re.current : null);
    if (!N)
      return;
    const w = ni(p.version?.content) || Et(p.version?.content);
    tt(
      u,
      Hn(
        {
          ...N,
          kind: p.kind || W.kind,
          assetCateId: Number(p.asset_cate_id || W.id || 0)
        },
        {
          output: w,
          asset: p
        },
        "引用资产"
      )
    ), ff(u, w);
  }
  async function ff(u, p) {
    if (!u)
      return;
    const g = H.edges.filter((N) => N.from === u).map((N) => H.nodes.find((w) => w.id === N.to)).filter(
      (N) => !!N && Qt(N, "display")
    );
    if (g.length !== 0)
      for (const N of g)
        tt(
          N.id,
          Hn(N, { output: p }, "展示引用结果")
        );
  }
  async function Ac(u, p = sn, g = Re.current) {
    if (!p) {
      Mc(u);
      return;
    }
    const N = H.nodes.find((C) => C.id === p) || (g?.id === p ? g : Re.current?.id === p ? Re.current : null);
    if (!N) {
      Mc(u), Yt(""), Re.current = null;
      return;
    }
    lu(H.nodes, N.storyboardItem?.sourceNodeId || "") && (await xt(H), u = await fp({
      projectId: r,
      canvasId: H.id,
      nodeId: p,
      assetId: u.id,
      versionId: Number(u.version_id),
      requestId: crypto.randomUUID()
    }), Je(u)), lf(p, u, g), Dc();
  }
  async function pf(u, p = sn, g = Re.current) {
    if (!Bs(u)) {
      o("该素材没有可用内容，无法引用");
      return;
    }
    const N = Number(W?.id || 0), w = p || `new-${Date.now()}`;
    try {
      if (u.libraryType !== "material") {
        await Ac(qr(u), p, g);
        return;
      }
      const C = await Gc({
        projectId: r,
        canvasId: H.id,
        assetCateId: N,
        name: u.name || "素材库资产",
        kind: u.kind,
        content: u.version?.content,
        nodeKey: p,
        requestId: `official-material:${u.id}:${w}`
      }), _ = qr(C);
      Je(_), await Ac(_, p, g);
    } catch (C) {
      o(
        C instanceof Error ? C.message : "引用素材库资产失败"
      );
    }
  }
  function Dc() {
    Ht(!1), Yt(""), Re.current = null;
  }
  function mf(u, p) {
    Xc(), no({ nodeId: u, frameIndex: p }), He(null), fe("create");
  }
  async function gf(u) {
    const p = Jt;
    if (!p || io.current)
      return;
    const g = we.nodes.find((S) => S.id === p.nodeId);
    if (!g) {
      o("宫格节点不存在");
      return;
    }
    const N = u.filter(
      (S) => S.kind === "image" && Bs(S)
    ), w = Number.isInteger(p.frameIndex);
    if (w && N.length === 0) {
      o("请选择一张图片");
      return;
    }
    if (!w && N.length === 0) {
      o("请至少选择一张图片");
      return;
    }
    if (!w && N.length > Io) {
      o(`一次最多导入 ${Io} 张图片`);
      return;
    }
    const C = Fa([
      g.asset?.version?.content,
      g.resultOutput
    ]), _ = w ? xw(
      C,
      Number(p.frameIndex),
      N[0],
      g.title
    ) : Ml(
      N,
      C,
      g.title
    );
    if (!_) {
      o("当前宫格内容不可编辑");
      return;
    }
    io.current = !0;
    try {
      const S = Number(g.asset?.id || 0), E = Number(
        g.asset?.version?.id || g.asset?.version_id || 0
      ), j = S > 0 && E > 0 ? await Kc({
        projectId: r,
        assetId: S,
        versionId: E,
        content: _
      }) : await Gc({
        projectId: r,
        canvasId: H.id,
        assetCateId: Number(g.assetCateId || W?.id || 0),
        name: _.title || g.title || "宫格图片",
        kind: "collection",
        content: _,
        nodeKey: g.id,
        requestId: `storyboard-grid-import:${g.id}:${Date.now()}`
      }), Q = ia(
        j,
        g.asset
      );
      Je(Q), tt(
        g.id,
        ur(g, Q)
      );
    } catch (S) {
      o(
        S instanceof Error ? S.message : "导入宫格图片失败"
      );
    } finally {
      io.current = !1;
    }
  }
  function yf(u, p) {
    tr("power", p, { power: u });
  }
  function hf(u = "") {
    Xo(u);
  }
  async function Es(u, p) {
    const { uploadSpaceFiles: g } = await import("./space-upload-B-1PIF2y.js").then((C) => C.c), N = await g({
      projectID: r,
      canvasID: H.id,
      teamID: Number(a?.project.team_id || 0),
      files: u,
      onProgress: p?.onProgress
    }), w = [];
    for (const C of N) {
      const _ = qr(C.asset);
      _.id && Je(_);
      const S = Rg(C.asset);
      S.id && w.push(S);
    }
    return w;
  }
  function wf(u, p) {
    tr("agent", p, { role: u });
  }
  function vf(u, p) {
    tr("flow", p, { flow: u });
  }
  function bf(u) {
    tr("group", u);
  }
  async function Nf(u, p) {
    const g = v.current, w = F.current[String(g)].nodes.find((S) => S.id === u), C = di(w);
    if (!C) throw new Error("请先生成设定");
    const _ = await Kc({ projectId: r, assetId: Number(w.resultRef?.asset_id || w.asset?.id), versionId: Number(w.resultRef?.version_id || w.asset?.version_id), requestId: crypto.randomUUID(), saveMode: "create_version", content: { ...C, materials: p } });
    Je(_), ln(g, u, { asset: _, resultRef: { asset_id: _.id, version_id: _.version_id }, resultOutput: _.version?.content }), await xt(F.current[String(g)]);
  }
  async function If() {
    const u = Sn(Ae, "audio", "speech");
    if (!u) return [];
    const p = Number(a?.release?.id || a?.project.release_id || 0);
    return (await c.loadPowerForm(
      { projectId: r, releaseId: p, flowId: 0, powerId: u.id, powerKey: u.key, targetId: 0 },
      () => Jd({ projectId: r, powerId: u.id, powerKey: u.key })
    )).params.find((N) => N.key === "voice")?.options || [];
  }
  function Cf(u, p) {
    const g = tr("function", p, { functionOption: u });
    g && Qt(g, "import") && (Re.current = g, hf(g?.id || ""));
  }
  function Sf(u, p, g) {
    bm(), fe("create");
    const N = {
      x: u.x,
      y: u.y,
      position: p,
      canvasId: H.id,
      connection: g
    };
    He(N), kn(null), Zt().then((w) => {
      !w && g && He((C) => C === N ? null : C);
    });
  }
  function Pc(u, p, g) {
    const N = F.current[String(u.canvasId)];
    if (!u.connection || !N || v.current !== u.canvasId) return;
    const w = zd(Dd(N, gn), u.connection, p.node, ft), { source: C, target: _ } = w, S = mr({ ...w, params: p.params });
    if (S.kind === "invalid" || !C || !_) {
      o(S.kind === "invalid" ? S.reason : "节点已变化，请重新连接");
      return;
    }
    if (S.kind === "form" || p.params && _.composerDraft?.selectedTargetId !== p.targetModelId) {
      o("下游模型已变化，请重新选择引用节点");
      return;
    }
    const E = g || Xu(S);
    if (!E && S.kind !== "direct") {
      kn({ menu: u, candidate: p, plan: S, sourceTitle: C.title, targetTitle: _.title });
      return;
    }
    const j = _a(S, E, C, _);
    if (!j) {
      o("该用途已不可用，请重新连接");
      return;
    }
    const Q = w.nodes.find((Y) => Y.id === p.node.id);
    Ct(u.canvasId, (Y) => {
      const X = [...Y.nodes, Q].map(
        (le) => le.id === _.id && j.draft ? { ...le, composerDraft: j.draft } : le
      ), ie = E?.kind === "lyrics" ? Gl(Y.edges, C.id, _) : Y.edges;
      return {
        ...Y,
        nodes: X,
        edges: Mt(X, qn(ie, C.id, _.id, X, j.mediaUsage))
      };
    }), o(""), V([Q.id]), go(Q.id);
  }
  function Di(u) {
    if (!pe || de?.menu !== pe) return;
    const p = de.candidates.find(({ node: g }) => (g.power || g.role || g.functionOption) === u);
    p && (He(null), Pc(pe, p));
  }
  const Ec = O(() => kn(null), []);
  function Oc(u) {
    Me && (Ec(), Pc(Me.menu, Me.candidate, u));
  }
  function _f() {
    Qn(st === "dark" ? "light" : "dark");
  }
  const Rf = Ue((u) => {
    V(u), He(null);
  }), kf = Ue(Sf), xf = Ue(df), Tf = Ue(uf), Mf = Ue(
    (u) => St((p) => ({ ...p, nodes: u }))
  ), Af = Ue(
    (u) => St((p) => ({ ...p, edges: u }))
  ), Df = Ue(
    (u) => St((p) => p.nodes.length === 0 && p.edges.length === 0 ? p : { ...p, viewport: u })
  ), Pf = Ue(
    mf
  );
  if (eo)
    return null;
  if (oo || !a || !W)
    return /* @__PURE__ */ f("main", { className: `ws-page is-${st} ws-loading-screen`, children: /* @__PURE__ */ f("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ f("span", { children: oo || "创作空间不存在" }) }) });
  const {
    launcherVisible: Ef,
    panelVisible: Fc
  } = yp(a.assistant.available, he), Os = pe?.connection ? we.nodes.find((u) => u.id === pe.connection?.nodeId) : void 0, zr = de && de.menu === pe ? de.candidates : [], Of = Os ? de?.menu !== pe ? void 0 : zr.length === 0 ? de.warning ? "未能确认可用节点，关闭菜单后可重试。" : pe?.connection?.handleType === "target" ? "没有能为该节点提供输入的节点。" : "没有能接收该节点结果的节点。" : pe?.connection?.handleType !== "target" && !Qt(Os, "start") && !Pt(Os) ? "可以先连线，运行下游前请先生成上游结果。" : void 0 : "原节点已不存在，请重新选择。";
  return /* @__PURE__ */ L(
    "main",
    {
      className: `ws-page is-${st} is-${ve}-view ${Fc ? "is-assistant-open" : ""} ${ce ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${be}px`
      },
      children: [
        /* @__PURE__ */ f(
          Gn,
          {
            message: n,
            onDismiss: () => o(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(
          _w,
          {
            activeCate: W,
            mode: ve,
            interactive: ve === "create",
            canvasCount: un.length,
            activeCanvasName: H.name,
            canvasManagerOpen: ge,
            onOpenCanvasManager: Ii,
            nodes: we.nodes,
            edges: we.edges,
            viewport: H.viewport,
            canvasId: H.id,
            selectedNodeId: te,
            selectedNodeIds: T,
            onSelectNodes: Rf,
            onOpenNodeMenu: kf,
            onCopyNode: xf,
            onDeleteNodes: Tf,
            onShowNodeDetail: Er,
            detailNodeIds: dt,
            onDetailNodeProjection: ki,
            onConfirmStoryboard: As,
            onStoryboardScriptSaved: h,
            onNodesCommit: Mf,
            onEdgesCommit: Af,
            onConnectedMediaEdgeRemove: Ms,
            onViewportCommit: Df,
            focusNodeRequest: rn,
            onFocusNodeRequestConsumed: Ti,
            projectId: r,
            space: a,
            canvasReferenceItems: ft,
            catalogCache: c,
            runningNodes: Ce,
            onNodeResult: tt,
            onNodeDraftChange: Ts,
            onAssetCreated: Je,
            canvasRunRecords: ut,
            stoppingCanvasRunKeys: wn,
            onStopCanvasRun: xc,
            onCreateStoryboards: Ri,
            onSettingMaterials: Nf,
            onLoadVoiceOptions: If,
            onReplaceSettingImage: Xo,
            onRunStoryboardFrame: Ne,
            onRunFunctionNode: je,
            onRunBackendNode: Ie,
            onOpenStoryboardGridImport: Pf,
            onClearFeedbackRecords: po,
            requestConfirm: Tr,
            onOpenFeedbackRecord: ee
          },
          H.id
        ),
        /* @__PURE__ */ f(
          Nw,
          {
            space: a,
            cates: Rs,
            activeCate: W,
            canvases: un,
            activeCanvas: H,
            saveStatus: kr[String(H.id)] || "saved",
            hasAssetCates: ks,
            loadingCateId: k,
            onBack: () => {
              _s(() => t({ to: "/bot/work" }));
            },
            onSelectCate: Or,
            onRefresh: () => {
              _s(xr);
            },
            onOpenRunHistory: () => {
              En(!0), Br(r, 0);
            },
            onRunHistoryIntent: sm,
            canStopRuns: rf,
            stoppingRuns: Ns || wn.size > 0,
            onStopRuns: sf,
            theme: st,
            onToggleTheme: _f
          }
        ),
        ge ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ f(
              im,
              {
                errorFeedback: /* @__PURE__ */ f(
                  Gn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                open: !0,
                canvases: un,
                deletedCanvases: q,
                deletedLoading: Z,
                activeCanvasId: H.id,
                disabled: k != null,
                onClose: () => $(!1),
                onSelect: fn,
                onCreate: Ds,
                onRename: Fr,
                onReorder: Qo,
                onDelete: Ps,
                onRestore: er
              }
            )
          }
        ) : null,
        Fc ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${be}px`
                },
                children: /* @__PURE__ */ f(xe, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ f(
              am,
              {
                assistant: a.assistant,
                project: a.project,
                team: a.team,
                activeAssetCateID: W.id,
                activeCanvas: H,
                selectedNodes: Ci,
                width: be,
                expanded: ce,
                onWidthChange: _i,
                onToggleExpanded: () => Be((u) => !u),
                onClose: () => Se(!1),
                onFlushCanvas: xt,
                onCanvasChanged: Si,
                onUploadAssets: Es
              }
            )
          }
        ) : null,
        Ef ? /* @__PURE__ */ f(
          kh,
          {
            assistantName: a.assistant.name,
            onIntent: cm,
            onOpen: () => Se(!0)
          }
        ) : null,
        jo ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ f(
              dm,
              {
                open: !0,
                runs: yt,
                loading: nt,
                error: Nr,
                page: _e,
                hasNextPage: bs,
                onOpenChange: En,
                onRefresh: () => Br(r, 0),
                onPreviousPage: () => Br(
                  r,
                  Math.max(0, _e - 2)
                ),
                onNextPage: () => Br(r, _e),
                stoppingRunKeys: wn,
                onStopRun: xc,
                onLocateRun: (u) => {
                  const p = String(u.start_node_id || "");
                  if (!p)
                    return;
                  En(!1), (Number(u.canvas_id || 0) ? fn(Number(u.canvas_id)) : Or(Number(u.asset_cate_id || b))).then((N) => {
                    N && window.requestAnimationFrame(() => go(p));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ f(
          Sw,
          {
            mode: ve,
            onModeIntent: (u) => {
              u === "result" && um();
            },
            onSelectMode: (u) => {
              fe(u), He(null);
            }
          }
        ),
        vs ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Zc,
              {
                notificationMode: "inline",
                open: !0,
                teamID: a.project.team_id,
                scopeProjectID: a.project.id,
                title: "选择资产",
                description: "选择已有资产或上传本地文件，确认后引用到当前画布。",
                initialFilters: {
                  sourceType: "project",
                  projectID: a.project.id,
                  canvasID: H.id
                },
                confirmSelection: !0,
                contentMode: "full",
                validateAsset: (u) => Bs(u) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: Es,
                onClose: Dc,
                onConfirm: (u) => {
                  const p = u[0];
                  p && pf(p);
                }
              }
            )
          }
        ) : null,
        Jt ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Zc,
              {
                notificationMode: "inline",
                open: !0,
                teamID: a.project.team_id,
                scopeProjectID: a.project.id,
                title: Number.isInteger(Jt.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(Jt.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${$n} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: a.project.id,
                  canvasID: H.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(Jt.frameIndex),
                maxSelection: $n,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (u) => u.kind !== "image" ? "请选择图片资产。" : Bs(u) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: Es,
                onClose: () => no(null),
                onConfirm: (u) => {
                  gf(u);
                }
              }
            )
          }
        ) : null,
        ve === "result" ? /* @__PURE__ */ f("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载资产" }), children: /* @__PURE__ */ f(
          lm,
          {
            notificationMode: "inline",
            teamID: a.project.team_id,
            scopeProjectID: a.project.id,
            scopeCanvasID: H.id,
            onLocalUpload: Es,
            initialFilters: {
              sourceType: "project",
              projectID: a.project.id,
              canvasID: H.id,
              assetCateID: ks ? W.id : 0
            },
            headerAction: /* @__PURE__ */ f(gt, { label: "关闭资产", children: /* @__PURE__ */ L("button", { type: "button", onClick: () => fe("create"), children: [
              /* @__PURE__ */ f(Ru, { "aria-hidden": "true" }),
              /* @__PURE__ */ f("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        bt ? /* @__PURE__ */ f(
          nb,
          {
            errorFeedback: /* @__PURE__ */ f(
              Gn,
              {
                message: n,
                onDismiss: () => o("")
              }
            ),
            prompt: bt.prompt,
            running: Fn,
            readonly: eh(
              bt,
              we.nodes,
              lt.current
            ),
            history: So(
              we.nodes.find(
                (u) => u.id === bt.node.id
              ) || bt.node
            ),
            activeRecordId: bt.recordId,
            onSelectRecord: (u) => {
              const p = we.nodes.find(
                (g) => g.id === bt.node.id
              ) || bt.node;
              Bt({
                node: p,
                recordId: u.id,
                prompt: {
                  ...u.prompt,
                  values: u.values || u.prompt.values || {}
                }
              });
            },
            onClose: U,
            onSubmit: P
          },
          `${bt.node.id}-${bt.recordId}`
        ) : null,
        Vo ? /* @__PURE__ */ f(
          Rw,
          {
            onError: o,
            request: Vo,
            onClose: () => to(null)
          }
        ) : null,
        jn && !ci(jn.document) ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载分镜确认", overlay: !0 }),
            children: /* @__PURE__ */ f(
              fm,
              {
                errorFeedback: /* @__PURE__ */ f(
                  Gn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                storyboard: jn.document,
                submitting: Uo,
                onClose: () => on(null),
                onConfirm: xi
              }
            )
          }
        ) : null,
        pe ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ f(
              pm,
              {
                menu: pe,
                overDetail: !!(pe.connection && at),
                flows: pe.connection ? [] : Ni,
                powers: pe.connection ? zr.flatMap(({ node: u }) => u.power ? [u.power] : []) : Ar,
                powerCategories: Cs,
                roles: pe.connection ? zr.flatMap(({ node: u }) => u.role ? [u.role] : []) : Mr,
                reference: pe.connection ? {
                  loading: !!(Os && de?.menu !== pe),
                  notice: Of,
                  warning: de?.menu === pe ? de.warning : void 0,
                  functions: zr.flatMap(({ node: u }) => u.functionOption ? [u.functionOption] : []),
                  describePower: (u) => zr.find(({ node: p }) => p.power === u)?.description
                } : void 0,
                onClose: () => He(null),
                onSelectFlow: (u) => vf(u, pe.position),
                onSelectFunction: (u) => pe.connection ? Di(u) : Cf(u, pe.position),
                onSelectGroup: () => bf(pe.position),
                onSelectRole: (u) => pe.connection ? Di(u) : wf(u, pe.position),
                onSelectPower: (u) => pe.connection ? Di(u) : yf(u, pe.position)
              }
            )
          }
        ) : null,
        Me && Me.menu.canvasId === H.id ? /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载用途选项", overlay: !0 }), children: /* @__PURE__ */ f(
          wu,
          {
            sourceTitle: Me.sourceTitle,
            targetTitle: Me.targetTitle,
            params: Me.plan.kind === "media" ? Me.plan.options : Me.plan.params,
            media: Me.plan.kind === "media",
            overDetail: !!at,
            lyricsAvailable: Me.plan.kind === "text" && Me.plan.lyricsAvailable,
            onClose: Ec,
            onSelect: (u) => Oc({ kind: Me.plan.kind, key: u }),
            onSelectLyrics: () => Oc({ kind: "lyrics" })
          }
        ) }) : null,
        [at, ys].map((u, p) => u ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              mm,
              {
                canvasId: H.id,
                layer: p ? "nested" : "default",
                projectId: a.project.id,
                teamId: a.team.id,
                assetCateId: Number(
                  u.assetCateId || u.asset?.asset_cate_id || W?.id || 0
                ),
                node: u,
                readonly: ve !== "create",
                storyboardFocus: p ? void 0 : ws,
                storyboardInitialSectionId: p ? void 0 : An,
                storyboardWorkspace: u.storyboardWorkspace,
                canvasNodes: we.nodes,
                canvasEdges: we.edges,
                connectedMediaReferences: el(
                  we.nodes,
                  we.edges,
                  u.id
                ),
                canvasReferenceItems: ft.filter(
                  (g) => g.source !== "current" || g.id !== u.id
                ),
                onNodeDraftChange: (g) => {
                  g && (Ts(u.id, g), Le(
                    (N) => N?.id === u.id ? { ...N, composerDraft: g } : N
                  ));
                },
                onConnectedMediaEdgeRemove: Ms,
                onRunNode: Ie,
                onAssetUpdated: (g) => m(u, g),
                onConfirmStoryboard: (g, N) => As(u.id, N, g),
                onClose: () => {
                  _t(null), !p && (Mn(null), ct(null), Lo(void 0), $o(void 0));
                }
              }
            )
          },
          u.id
        ) : null),
        Tn ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              gm,
              {
                notificationMode: "inline",
                teamID: a.project.team_id,
                assetID: Tn.assetID,
                layer: "nested",
                onAssetChanged: x,
                onClose: () => Mn(null)
              }
            )
          }
        ) : null
      ]
    }
  );
}
function Nw({
  space: e,
  cates: t,
  activeCate: n,
  canvases: o,
  activeCanvas: s,
  saveStatus: r,
  hasAssetCates: i,
  loadingCateId: c,
  onBack: a,
  onSelectCate: d,
  onRefresh: l,
  onOpenRunHistory: y,
  onRunHistoryIntent: v,
  canStopRuns: b,
  stoppingRuns: I,
  onStopRuns: R,
  theme: k,
  onToggleTheme: D
}) {
  const A = Math.max(
    0,
    t.findIndex((T) => T.id === n.id)
  );
  return /* @__PURE__ */ L("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ L("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: a,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ f(ig, { size: 18 })
        }
      ),
      /* @__PURE__ */ L("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ L("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ f("strong", { children: e.project.name }),
          o.length > 1 ? /* @__PURE__ */ L("span", { className: "ws-project-canvas-name", children: [
            /* @__PURE__ */ f("i", { children: "/" }),
            s.name || "第一幕"
          ] }) : null
        ] }),
        /* @__PURE__ */ f("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    i ? /* @__PURE__ */ L(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": A
        },
        children: [
          /* @__PURE__ */ f("span", { className: "ws-cate-indicator" }),
          t.map((T) => /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: `ws-cate ${T.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                d(T.id);
              },
              children: [
                c === T.id ? /* @__PURE__ */ f(Mo, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ f("span", { className: "ws-cate-name", children: T.name })
              ]
            },
            T.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ L("div", { className: `ws-top-actions ${b ? "has-running" : ""}`, children: [
      /* @__PURE__ */ f(Iw, { status: r }),
      b ? /* @__PURE__ */ f(gt, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: I,
          onClick: R,
          children: [
            I ? /* @__PURE__ */ f(Mo, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(ag, { size: 13, fill: "currentColor" }),
            I ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ f(gt, { label: "查看画布运行记录", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: v,
          onFocus: v,
          onClick: y,
          children: [
            /* @__PURE__ */ f(cg, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: D, children: [
        k === "dark" ? /* @__PURE__ */ f(dg, { size: 15 }) : /* @__PURE__ */ f(ug, { size: 15 }),
        k === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: l, children: [
        /* @__PURE__ */ f($a, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function Iw({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ f(gt, { label: t, children: /* @__PURE__ */ L("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ f(Mo, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(ku, { size: 14 }),
    t
  ] }) });
}
const Cw = [
  { key: "create", label: "创作", icon: lg },
  { key: "result", label: "资产", icon: fg }
];
function Sw({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ f("nav", { className: "ws-dock", "aria-label": "画布视角", children: Cw.map((o) => {
    const s = o.icon;
    return /* @__PURE__ */ L(
      "button",
      {
        type: "button",
        className: `ws-dock-button ${o.key === e ? "is-active" : ""}`,
        onPointerEnter: () => t(o.key),
        onFocus: () => t(o.key),
        onClick: () => n(o.key),
        children: [
          /* @__PURE__ */ f(s, { size: 20 }),
          o.label
        ]
      },
      o.key
    );
  }) });
}
const _w = za(function({
  activeCate: t,
  mode: n,
  interactive: o,
  canvasCount: s,
  activeCanvasName: r,
  canvasManagerOpen: i,
  onOpenCanvasManager: c,
  nodes: a,
  edges: d,
  viewport: l,
  canvasId: y,
  selectedNodeId: v,
  selectedNodeIds: b,
  onSelectNodes: I,
  onOpenNodeMenu: R,
  onCopyNode: k,
  onDeleteNodes: D,
  onShowNodeDetail: A,
  detailNodeIds: T,
  onDetailNodeProjection: V,
  onConfirmStoryboard: te,
  onStoryboardScriptSaved: G,
  onNodesCommit: re,
  onEdgesCommit: F,
  onConnectedMediaEdgeRemove: ge,
  onViewportCommit: $,
  focusNodeRequest: q,
  onFocusNodeRequestConsumed: z,
  projectId: Z,
  space: me,
  canvasReferenceItems: ye,
  catalogCache: ve,
  runningNodes: fe,
  onNodeResult: he,
  onNodeDraftChange: Fe,
  onAssetCreated: ce,
  canvasRunRecords: Be,
  stoppingCanvasRunKeys: be,
  onStopCanvasRun: Ot,
  onCreateStoryboards: st,
  onSettingMaterials: Qn,
  onLoadVoiceOptions: pe,
  onReplaceSettingImage: He,
  onRunStoryboardFrame: de,
  onRunFunctionNode: it,
  onRunBackendNode: Me,
  onOpenStoryboardGridImport: kn,
  onClearFeedbackRecords: eo,
  requestConfirm: vt,
  onOpenFeedbackRecord: Oo
}) {
  const [Ce, Fo] = K(null), [xn, Bo] = K(""), [zo, gn] = K(""), [en, at] = K(""), [ct, ys] = K(null), [_t, tn] = K(null), [nn, dt] = K(""), [Le, yn] = K(null), [on, Uo] = K(() => /* @__PURE__ */ new Map()), [hs, Ve] = K(""), [Tn, Mn] = K(!1), [ws, Lo] = K(!1), [An, $o] = K(1), Vo = ne(1), to = ne(1), rn = ne(null), [Dn, vs] = K(null), Ht = se(
    () => new Set(b),
    [b]
  ), sn = ne(null), Yt = ne(null), Jt = ne(!1), no = ne(!1), oo = ne(!1), hn = ne(null), ut = ne(!1), ze = ne(d);
  ns(() => {
    ze.current = d;
  }, [d]);
  const yt = O((m) => {
    const h = vo(m);
    Vo.current = h, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current), rn.current = null, to.current = h, Kd(sn.current, h), $o(
      (x) => Math.abs(x - h) > 5e-3 ? h : x
    );
  }, []), ro = O((m) => {
    const h = vo(m);
    if (Vo.current = h, !(Math.abs(to.current - h) <= 5e-3) && rn.current == null) {
      if (typeof window > "u") {
        to.current = h, $o(h);
        return;
      }
      rn.current = window.requestAnimationFrame(() => {
        rn.current = null;
        const x = Vo.current;
        to.current = x, Kd(sn.current, x);
      });
    }
  }, []);
  ue(
    () => () => {
      Yt.current = null, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current);
    },
    []
  );
  const nt = O(
    (m, h = {}) => {
      const x = ze.current;
      ze.current = m, F(m);
      const B = new Set(
        m.filter((J) => Kn(J) === "media").map((J) => {
          const M = pn(J);
          return `${M.sourceNodeId}\0${M.targetNodeId}`;
        })
      ), P = /* @__PURE__ */ new Map();
      for (const J of x) {
        if (Kn(J) !== "media")
          continue;
        const M = pn(J), oe = `${M.sourceNodeId}\0${M.targetNodeId}`;
        if (B.has(oe))
          continue;
        const ke = P.get(M.targetNodeId) || /* @__PURE__ */ new Set();
        ke.add(M.sourceNodeId), P.set(M.targetNodeId, ke);
      }
      const U = new Map(h.draftByNodeId);
      for (const [J, M] of P) {
        const oe = a.find((Ie) => Ie.id === J), ke = oe?.composerDraft;
        let Ne = U.get(J) || ke;
        if (!(!oe || !Ne)) {
          for (const Ie of M)
            Ne = Hc(
              Ne,
              Ie
            );
          Ne !== ke ? U.set(oe.id, Ne) : U.delete(oe.id);
        }
      }
      const ee = [...U].map(([J, M]) => ({
        nodeId: J,
        draft: M
      }));
      ee.forEach((J, M) => {
        Fe(
          J.nodeId,
          J.draft,
          M === ee.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, F, Fe]
  ), Pn = O(
    (m) => {
      const h = Object.entries(m);
      if (h.length === 0)
        return;
      const x = new Map(h);
      let B = !1;
      const P = ze.current.map((U) => {
        if (!x.has(U.id))
          return U;
        const ee = x.get(U.id) || void 0;
        return (U.mediaUsage || void 0) === ee ? U : (B = !0, { ...U, mediaUsage: ee });
      });
      B && nt(P);
    },
    [nt]
  ), Nr = O(
    (m) => {
      const h = ze.current.filter((x) => x.id !== m);
      h.length !== ze.current.length && (ze.current = h, dt((x) => x === m ? "" : x), ge(m));
    },
    [ge]
  ), so = O(
    (m, h) => {
      const x = ze.current, B = x.filter((ee) => {
        const J = pn(ee);
        return !(Kn(ee) === "media" && J.sourceNodeId === m && J.targetNodeId === h);
      });
      if (B.length !== x.length) {
        dt(""), nt(B);
        return;
      }
      const P = a.find((ee) => ee.id === h);
      if (!P?.composerDraft)
        return;
      const U = Hc(
        P.composerDraft,
        m
      );
      U !== P.composerDraft && Fe(h, U, { save: "immediate" });
    },
    [nt, a, Fe]
  ), jo = O(
    (m, h) => {
      if (at(""), !o)
        return;
      const x = jy(a, m, h);
      x !== a && re(x);
    },
    [o, a, re]
  ), En = O(
    (m, h) => {
      if (at(""), !o)
        return;
      const x = Ky(a, m, h);
      x !== a && re(x);
    },
    [o, a, re]
  ), _e = ne({
    onSettingMaterials: Qn,
    onLoadVoiceOptions: pe,
    onReplaceSettingImage: He,
    onNodeResult: he,
    onNodeDraftChange: Fe,
    onAssetCreated: ce,
    onRunFunctionNode: it,
    onOpenStoryboardGridImport: kn,
    onClearFeedbackRecords: eo,
    onOpenFeedbackRecord: Oo,
    onShowNodeDetail: A,
    onConfirmStoryboard: te,
    onStoryboardScriptSaved: G,
    requestConfirm: vt,
    onRunBackendNode: Me,
    onConnectedMediaUsagesChange: Pn,
    onConnectedMediaEdgeRemove: Nr,
    onTextParamConnectionRemove: so,
    onNodeResizeStart: at,
    onNodeResizeEnd: jo,
    onResultViewResizeEnd: En
  });
  ns(() => {
    _e.current = {
      onSettingMaterials: Qn,
      onLoadVoiceOptions: pe,
      onReplaceSettingImage: He,
      onNodeResult: he,
      onNodeDraftChange: Fe,
      onAssetCreated: ce,
      onRunFunctionNode: it,
      onOpenStoryboardGridImport: kn,
      onClearFeedbackRecords: eo,
      onOpenFeedbackRecord: Oo,
      onShowNodeDetail: A,
      onConfirmStoryboard: te,
      onStoryboardScriptSaved: G,
      requestConfirm: vt,
      onRunBackendNode: Me,
      onConnectedMediaUsagesChange: Pn,
      onConnectedMediaEdgeRemove: Nr,
      onTextParamConnectionRemove: so,
      onNodeResizeStart: at,
      onNodeResizeEnd: jo,
      onResultViewResizeEnd: En
    };
  }, [
    Qn,
    pe,
    He,
    ce,
    eo,
    Fe,
    he,
    Oo,
    kn,
    Me,
    it,
    A,
    te,
    G,
    Nr,
    so,
    vt,
    jo,
    En,
    Pn
  ]);
  const On = se(
    () => ({
      onSettingMaterials: (m, h) => _e.current.onSettingMaterials(m, h),
      onLoadVoiceOptions: () => _e.current.onLoadVoiceOptions(),
      onReplaceSettingImage: (m) => _e.current.onReplaceSettingImage(m),
      onNodeResult: (m, h) => _e.current.onNodeResult(m, h),
      onNodeDraftChange: (m, h, x) => _e.current.onNodeDraftChange(m, h, x),
      onAssetCreated: (m) => _e.current.onAssetCreated(m),
      onRunFunctionNode: (m) => _e.current.onRunFunctionNode(m),
      onOpenStoryboardGridImport: (m, h) => _e.current.onOpenStoryboardGridImport(m, h),
      onClearFeedbackRecords: (m) => _e.current.onClearFeedbackRecords(m),
      onOpenFeedbackRecord: (m, h) => _e.current.onOpenFeedbackRecord(m, h),
      onShowNodeDetail: (m, h, x) => _e.current.onShowNodeDetail(
        m,
        h,
        x
      ),
      onConfirmStoryboard: (m) => _e.current.onConfirmStoryboard(m),
      onStoryboardScriptSaved: (m, h, x) => _e.current.onStoryboardScriptSaved(m, h, x),
      requestConfirm: (m) => _e.current.requestConfirm(m),
      onRunBackendNode: (m, h) => _e.current.onRunBackendNode(m, h),
      onConnectedMediaUsagesChange: (m) => _e.current.onConnectedMediaUsagesChange(m),
      onConnectedMediaEdgeRemove: (m) => _e.current.onConnectedMediaEdgeRemove(m),
      onTextParamConnectionRemove: (m, h) => _e.current.onTextParamConnectionRemove(
        m,
        h
      ),
      onNodeResizeStart: (m) => _e.current.onNodeResizeStart(m),
      onNodeResizeEnd: (m, h) => _e.current.onNodeResizeEnd(m, h),
      onResultViewResizeEnd: (m, h) => _e.current.onResultViewResizeEnd(m, h)
    }),
    []
  ), bs = ne(void 0), ae = se(() => {
    const m = vv(
      a,
      d,
      bs.current
    );
    return bs.current = m, m;
  }, [d, a]), wn = se(
    () => gh(
      a,
      (m) => (ae.hasResultByNodeId.get(m.id) || !1) && !ar(m, a)
    ),
    [ae.hasResultByNodeId, a]
  ), ht = wn.frames, Ns = se(
    () => new Map(ht.map((m) => [m.id, m])),
    [ht]
  ), Ft = se(
    () => new Map(ht.map((m) => [m.sourceNodeId, m])),
    [ht]
  ), bt = se(
    () => new Map(
      ht.map((m) => [
        m.id,
        pl(
          m,
          a,
          d,
          (h) => (ae.hasResultByNodeId.get(h.id) || !1) && !ar(h, a),
          ae.nodeById
        )
      ])
    ),
    [
      ae.hasResultByNodeId,
      ae.nodeById,
      d,
      a,
      ht
    ]
  ), Bt = se(() => {
    const m = /* @__PURE__ */ new Map();
    for (const h of Be) {
      if (!br(h))
        continue;
      const x = Number(h.canvas_id || 0);
      if (x > 0 && x !== y)
        continue;
      const B = String(h.start_node_id || "").trim();
      B && !m.has(B) && m.set(B, h);
    }
    return m;
  }, [y, Be]), { latestCanvasRunByStartNodeId: Fn, activeCanvasRunByStartNodeId: vn } = se(() => {
    const m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    for (const x of Be) {
      const B = Number(x.canvas_id || 0);
      if (B > 0 && B !== y) continue;
      const P = String(x.start_node_id || "").trim();
      P && (m.has(P) || m.set(P, x), In(x) && !h.has(P) && h.set(P, x));
    }
    return { latestCanvasRunByStartNodeId: m, activeCanvasRunByStartNodeId: h };
  }, [y, Be]), Re = wn.sourceNodeIds, io = wn.sourceNodeIdByNodeId, zt = se(
    () => new Set(
      ht.flatMap(
        (m) => m.memberNodeIds.filter(
          (h) => h !== m.sourceNodeId
        )
      )
    ),
    [ht]
  ), ao = Ue(
    (m, h) => {
      const x = Ns.get(m), B = bt.get(m);
      if (!x || !B)
        return;
      const P = B.pendingNodeIds.length, U = Math.max(0, x.workNodeCount - P);
      vt({
        title: `执行“${x.title}”制作区？`,
        description: `将执行 ${P} 个待处理节点${U > 0 ? `，跳过 ${U} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => de(h)
      });
    }
  ), Ut = Ue(
    (m) => {
      const h = Bt.get(m);
      h && In(h) && Ot(h);
    }
  ), Ye = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && Ql({
      group: h,
      sourceNode: h,
      members: ae.groupMembersById.get(m) || Ks,
      runNode: Me,
      hasResult: (x) => Pt(x) && !ar(x, a),
      onError: Ve
    });
  }), Ir = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && Me(h).catch(
      (x) => Ve(
        x instanceof Error ? x.message : "节点运行失败"
      )
    );
  }), Lt = Ue((m) => {
    const h = vn.get(m);
    h && Ot(h);
  }), Rt = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && A(h);
  }), Cr = Ue((m, h) => {
    o && R(h, Kr(Ce, h), { nodeId: m, handleType: "source" });
  }), an = se(
    () => a.map((m) => m.id).join("\0"),
    [a]
  ), Xt = se(
    () => new Set(
      an ? an.split("\0") : []
    ),
    [an]
  ), co = se(
    () => an ? `${t.id}:${an}` : "",
    [t.id, an]
  ), Bn = Ue(
    (m, h) => /* @__PURE__ */ f(mc.Provider, { value: !0, children: /* @__PURE__ */ f(mw, { data: m, selected: h }) })
  ), [Ko] = K(Yy), qo = se(
    () => /* @__PURE__ */ new Set([...Xt, ...ht.map((m) => m.id)]),
    [Xt, ht]
  ), Is = se(() => {
    const m = Ko.reuse, h = me?.project.team_id || 0, x = [
      Z,
      y,
      me,
      ve,
      ye,
      o,
      On,
      ae,
      Ye,
      Ir,
      Rt,
      Lt,
      st
    ], B = (M) => (ae.hasResultByNodeId.get(M.id) || !1) && !ar(M, a), P = (M, oe = !1) => {
      const ke = !oe && Ht.has(M.id), Ne = ar(M, a) || wy(M, a, d), Ie = ke && b.length === 1 && xa(M), je = M.type === "power" ? Yn(M.power, M.kind, M.outputType).viewMode : "", Xe = oe || Ie, Tt = Xe ? me : null, Ze = Xe || je === "storyboard" || je === "video_compose" ? ye : sw, Qe = (oe || je === "video_compose" || Ie) && ae.incomingMediaReferencesByNodeId.get(M.id) || Md, fn = Re.has(M.id), Or = io.get(M.id) || "", Ds = Or && ae.nodeById.get(Or) || null, Fr = fe[M.id] || null, Qo = Fn.get(M.id), Ps = !!(Qo && be.has(wt(Qo))), er = M.type === "group" && ae.groupMembersById.get(M.id) || Ks, mo = ae.inputContextByNodeId.get(M.id) || null, go = ae.runBlockedReasonByNodeId.get(M.id) || "";
      return m(
        oe ? "embedded" : "node",
        M.id,
        [
          M,
          Z,
          y,
          h,
          Tt,
          ve,
          Fr,
          Qo,
          Ps,
          er,
          ...er.map((Ti) => fe[Ti.id]),
          Ze,
          Qe,
          o,
          fn,
          Ds,
          go,
          Ie,
          On,
          mo,
          Lt,
          st,
          Ne
        ],
        () => ({
          ...M,
          sourceNode: M,
          projectId: Z,
          canvasId: y,
          teamId: h,
          space: Tt,
          catalogCache: ve,
          runningNode: Fr,
          canvasRun: Qo,
          canvasRunStopping: Ps,
          onStopNodeCanvasRun: Lt,
          onCreateStoryboards: st,
          settingUpdateReason: Ne,
          groupMembers: er,
          groupRuntime: M.type === "group" ? Qa({
            members: er,
            runningNodes: fe,
            groupState: Fr,
            hasResult: B
          }) : null,
          canvasReferenceItems: Ze,
          connectedMediaReferences: Qe,
          interactive: o,
          structureLocked: fn,
          storyboardSourceNode: Ds,
          runBlockedReason: go,
          showNodeSettings: Ie,
          ...oe ? { embedded: !0 } : {},
          ...On,
          inputContext: mo
        })
      );
    }, U = (M) => {
      const oe = bt.get(M.id), ke = Bt.get(M.sourceNodeId), Ne = !!(ke && In(ke) && be.has(wt(ke)));
      return m(
        "frame",
        M.id,
        [
          M,
          oe,
          ke,
          fe[M.id],
          ...x,
          ao,
          Ut,
          Bn,
          Cr,
          ...M.memberNodeIds.flatMap((Ie) => {
            const je = Fn.get(Ie), Xe = vn.get(Ie);
            return [
              fe[Ie],
              je,
              Xe,
              !!(je && be.has(wt(je))),
              !!(Xe && be.has(wt(Xe)))
            ];
          }),
          Ne
        ],
        () => {
          const Ie = ke && In(ke) ? ke : void 0, je = !!Ie || Vt(fe[M.id]), Xe = je ? "" : oe?.blockedReason || "", Tt = jw(
            M,
            Ie,
            fe,
            ae.nodeById
          ) || (je ? "准备执行" : "");
          return {
            frameId: M.id,
            sourceNodeId: M.sourceNodeId,
            groupCount: M.groupCount + Number(
              M.workNodeIds.some(
                (Ze) => ae.nodeById.get(Ze)?.storyboardItem?.itemType === "video_compose"
              )
            ),
            workNodeCount: M.workNodeCount,
            completedCount: M.completedCount,
            running: je,
            stopping: Ne,
            executionStatus: Kw(
              ke,
              fe[M.id],
              Ne
            ),
            currentNodeTitle: Tt,
            runBlockedReason: Xe,
            groups: qw({
              frame: M,
              edges: d,
              nodeById: ae.nodeById,
              groupMembersById: ae.groupMembersById,
              runBlockedReasonByNodeId: ae.runBlockedReasonByNodeId,
              runningNodes: fe,
              activeRunByStartNodeId: vn,
              stoppingCanvasRunKeys: be,
              hasResult: B,
              onRunGroup: Ye,
              onRunNode: Ir,
              onStopRun: Lt,
              onOpenNode: Rt,
              projectNode: (Ze) => P(Ze, !0),
              reuse: m,
              projectionDependencies: (Ze) => [
                ...x,
                ...Ze.flatMap((Qe) => {
                  const fn = Fn.get(Qe.id);
                  return [
                    fn,
                    !!(fn && be.has(wt(fn))),
                    Re.has(Qe.id),
                    io.get(Qe.id)
                  ];
                })
              ]
            }),
            settingSource: (() => {
              const Ze = d.filter((Qe) => (Qe.logicalTo || Qe.to) === M.sourceNodeId && Qe.executionMode !== "manual").map((Qe) => lu(a, Qe.logicalFrom || Qe.from)).find(Boolean);
              return Ze ? { title: Ze.title, onOpen: () => Rt(Ze.id) } : void 0;
            })(),
            renderNode: Bn,
            onReferenceResult: o ? Cr : void 0,
            onRun: () => ao(M.id, M.sourceNodeId),
            onStop: Ie ? () => Ut(M.sourceNodeId) : void 0
          };
        }
      );
    }, ee = (M) => {
      const oe = { x: M.x, y: M.y }, ke = Ht.has(M.id), Ne = P(M), Ie = Ft.get(M.id), je = Ie ? U(Ie) : void 0;
      return m(
        "flow",
        M.id,
        [Ne, je, ke, o],
        () => {
          const Xe = je ? { ...Ne, storyboardWorkspace: je } : Ne, Tt = M.type === "group" ? 1 : M.groupId ? 3 : 2, Ze = Xl(M);
          return {
            id: M.id,
            type: "workSpace",
            position: oe,
            data: Xe,
            selected: ke,
            className: `ws-flow-node ws-flow-node-${M.type}`,
            draggable: o && (!Xe.structureLocked || !!Ie),
            deletable: !Xe.structureLocked,
            zIndex: Tt,
            ...jv(Ze)
          };
        }
      );
    }, J = a.filter((M) => !zt.has(M.id)).map(ee);
    return Ko.retain(qo), J;
  }, [
    vn,
    Fn,
    ae,
    Bt,
    zt,
    o,
    Ko,
    qo,
    Re,
    a,
    y,
    Z,
    fe,
    b.length,
    Ht,
    me,
    ve,
    ye,
    Ye,
    Ir,
    ao,
    Bn,
    Rt,
    Lt,
    st,
    Ut,
    On,
    Ft,
    bt,
    io,
    be
  ]), Go = Uy(
    Is,
    pb
  ), Wo = se(() => T.flatMap((m) => {
    if (!m) return [];
    for (const h of Go) {
      const x = h.data;
      if (x.id === m) return [x];
      for (const B of x.storyboardWorkspace?.groups || []) {
        const P = B.results.find(
          (U) => U.nodeId === m
        );
        if (P) return [P.node];
      }
    }
    return [];
  }), [T, Go]);
  ue(() => {
    for (const m of Wo) V(m);
  }, [V, Wo]);
  const { flowNodes: uo, setFlowNodes: zn } = zy(
    Go,
    zo || en
  ), Sr = O(
    (m) => {
      o && (dt(""), nt(d.filter((h) => h.id !== m)));
    },
    [nt, d, o]
  ), lt = O(
    (m) => {
      !o || !d.some((h) => h.id === m) || vt({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => Sr(m)
      });
    },
    [Sr, d, o, vt]
  ), Ho = O(
    (m) => {
      if (!o || m.length === 0)
        return;
      const h = Tl(a, m);
      if (h.size === 0)
        return;
      if ([...h].some(
        (P) => Re.has(P)
      )) {
        Ve(
          "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
        );
        return;
      }
      const x = m.length === 1 ? m[0] : null, B = m.some((P) => P.type === "group");
      vt({
        title: x ? `删除「${x.title}」` : `删除 ${h.size} 个节点`,
        description: B ? "会同时删除组内节点，并移除与这些节点相连的连线。" : x ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          dt(""), D(m);
        }
      });
    },
    [
      o,
      Re,
      a,
      D,
      vt
    ]
  ), Ae = O(
    (m, h = []) => {
      if (!o || m.length === 0)
        return;
      const x = new Set(
        m.flatMap((M) => M.memberNodeIds)
      ), B = /* @__PURE__ */ new Set([
        ...x,
        ...h.map((M) => M.id)
      ]), P = a.filter((M) => B.has(M.id));
      if (P.length === 0)
        return;
      const U = m.length === 1 && h.every((M) => x.has(M.id)) ? m[0] : null, ee = P.filter(
        (M) => M.type === "group"
      ).length, J = P.length - ee;
      vt({
        title: U ? `删除「${U.title}」制作区` : `删除 ${P.length} 个节点`,
        description: U ? `将删除其中 ${ee} 个分组和 ${J} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          dt(""), D(P, { allowStoryboardFrame: !0 });
        }
      });
    },
    [o, a, D, vt]
  ), Cs = se(
    () => d.filter(
      (m) => Xt.has(m.from) && Xt.has(m.to) && !zt.has(m.from) && !zt.has(m.to)
    ).map((m) => {
      const h = pn(m), x = ae.nodeById.get(
        h.sourceNodeId
      ), B = ae.nodeById.get(
        h.targetNodeId
      ), P = Ui(
        B?.composerDraft,
        h.sourceNodeId,
        on.get(h.targetNodeId)
      ), U = !!(Kn(m) === "media" && B?.type === "power" && B.power && (P || ir(x))), ee = on.get(
        h.targetNodeId
      ), J = U && B && ee ? pa(
        B,
        ee,
        h.sourceNodeId
      ) : void 0, M = Vs(B), oe = U ? Ep(
        P,
        J,
        M
      ) : void 0;
      return {
        id: m.id,
        source: m.from,
        sourceHandle: "output-0",
        target: m.to,
        targetHandle: "input-0",
        type: "animated",
        animated: !1,
        data: {
          physicalFrom: m.from,
          physicalTo: m.to,
          logicalFrom: m.logicalFrom,
          logicalTo: m.logicalTo,
          purpose: Kn(m),
          executionMode: m.executionMode,
          mediaUsage: m.mediaUsage,
          bindingLabel: oe?.label,
          bindingInteractive: oe?.interactive,
          bindingShowChevron: oe?.showChevron,
          bindingInvalid: oe?.invalid
        }
      };
    }),
    [
      on,
      Xt,
      ae.nodeById,
      d,
      zt
    ]
  );
  ue(() => {
    if (!Ce || !co || q || l.zoom != null || typeof window > "u")
      return;
    const m = setTimeout(() => {
      Ce.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(m);
  }, [co, Ce, q, l.zoom]), ue(() => {
    if (!Ce || !q || typeof window > "u")
      return;
    const m = a.find(
      (P) => P.id === q.nodeId
    );
    if (!m) {
      z(q);
      return;
    }
    const h = zt.has(m.id) ? ht.find(
      (P) => P.memberNodeIds.includes(m.id)
    ) : void 0, x = h && a.find((P) => P.id === h.sourceNodeId) || m, B = window.setTimeout(() => {
      const P = { x: x.x, y: x.y }, U = x.type === "power" ? 1.02 : 0.96;
      Ce.setCenter?.(
        P.x + (x.width || 180) / 2,
        P.y + (x.height || 180) / 2,
        { zoom: U, duration: 320 }
      ), yt(U), z(q);
    }, 80);
    return () => window.clearTimeout(B);
  }, [
    Ce,
    yt,
    q,
    zt,
    a,
    z,
    ht
  ]);
  const kt = O(
    (m) => {
      if (!o)
        return;
      const h = m.map((P) => {
        if (P.type !== "position" || !P.position)
          return P;
        const U = Oi(
          a,
          P.id,
          P.position
        );
        return U === P.position ? P : {
          ...P,
          position: U,
          ...P.positionAbsolute ? { positionAbsolute: U } : {}
        };
      });
      zn((P) => Km(h, P));
      const x = new Set(b);
      let B = !1;
      for (const P of m)
        P.type === "select" && (B = !0, P.selected ? (x.delete(P.id), x.add(P.id)) : x.delete(P.id));
      B && I([...x]);
    },
    [o, a, I, b, zn]
  ), Zt = O(
    (m) => Zu(
      ve,
      Z,
      Number(me.release?.id || me.project.release_id || 0),
      m
    ),
    [ve, Z, me.project.release_id, me.release?.id]
  ), cn = se(() => {
    const m = new Set(
      d.flatMap((h) => {
        if (Kn(h) !== "media")
          return [];
        const x = pn(h), B = ae.nodeById.get(
          x.sourceNodeId
        ), P = ae.nodeById.get(
          x.targetNodeId
        );
        return P?.type === "power" && P.power && ir(B) ? [P.id] : [];
      })
    );
    for (const h of a)
      h.type === "power" && h.power && (Object.keys(h.composerDraft?.paramBindings || {}).length > 0 || h.composerDraft?.storyboardLyricsSourceNodeId) && m.add(h.id);
    return a.filter((h) => m.has(h.id));
  }, [ae.nodeById, d, a]);
  ue(() => {
    if (cn.length === 0)
      return;
    let m = !1;
    return Promise.all(
      cn.map(
        async (h) => {
          try {
            const x = await Zt(h);
            return [h.id, x.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((h) => {
      m || Uo(
        new Map(
          h.filter(
            (x) => !!x
          )
        )
      );
    }), () => {
      m = !0;
    };
  }, [Zt, cn]);
  const Nt = O(
    (m, h, x) => {
      const B = a.some((J) => J.id === m), P = a.find((J) => J.id === h);
      if (!B || !P) {
        Ve("节点已变化，请重新连接");
        return;
      }
      const U = cs(P);
      if (!Op(
        U,
        x,
        m
      )) {
        Ve("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const ee = du(
        U,
        m,
        x
      );
      nt(
        Mt(
          a,
          qn(ze.current, m, h, a)
        ),
        ee !== U ? { draftByNodeId: /* @__PURE__ */ new Map([[P.id, ee]]) } : void 0
      );
    },
    [nt, a]
  ), dn = O(
    (m, h) => {
      const x = a.find((J) => J.id === m), B = a.find((J) => J.id === h);
      if (!B || !ir(x) || !Vs(B)) {
        Ve("节点已变化，请重新连接");
        return;
      }
      const P = cs(B), U = uu(
        P,
        m
      ), ee = Gl(ze.current, m, B);
      ee.length !== ze.current.length && dt(""), nt(
        Mt(
          a,
          qn(ee, m, h, a)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[B.id, U]]) }
      );
    },
    [nt, a]
  );
  ue(() => {
    for (const m of cn) {
      const h = on.get(m.id);
      if (!h)
        continue;
      const x = d.flatMap((P) => {
        if (Kn(P) !== "media")
          return [];
        const U = pn(P);
        if (U.targetNodeId !== m.id)
          return [];
        const ee = ae.nodeById.get(
          U.sourceNodeId
        );
        return m.composerDraft?.storyboardLyricsSourceNodeId === U.sourceNodeId ? [] : ir(ee) ? [U.sourceNodeId] : [];
      }), B = Fp(
        x,
        m.composerDraft,
        Qu(m, h)
      );
      B && Nt(
        B.sourceNodeId,
        m.id,
        B.targetParamKey
      );
    }
  }, [
    on,
    ae.nodeById,
    Nt,
    d,
    cn
  ]);
  const _r = O(
    async (m) => {
      if (!o)
        return;
      const h = ze.current.find(
        (J) => J.id === m
      );
      if (!h)
        return;
      const { sourceNodeId: x, targetNodeId: B } = pn(h), P = a.find((J) => J.id === x), U = a.find((J) => J.id === B), ee = Ui(
        U?.composerDraft,
        x
      );
      if (!(U?.type !== "power" || !U.power || !ee && !ir(P)))
        try {
          const J = await Zt(U), M = pa(
            U,
            J.params || [],
            x
          ), oe = Ui(
            U.composerDraft,
            x,
            J.params || []
          ), ke = Vs(U);
          if (Uo((Ie) => {
            const je = new Map(Ie);
            return je.set(B, J.params || []), je;
          }), dt(m), ke) {
            yn({
              sourceNodeId: x,
              targetNodeId: B,
              sourceTitle: P?.title || "上游节点",
              targetTitle: U.title || U.power.name,
              params: M,
              selectedParamKey: oe?.purpose === "param" ? oe.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: oe?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const Ne = Bp(M);
          if (Ne.kind === "unavailable") {
            Ve("当前能力没有可用的文本参数");
            return;
          }
          if (Ne.kind === "automatic") {
            oe?.targetParamKey !== Ne.targetParamKey && Nt(
              x,
              B,
              Ne.targetParamKey
            );
            return;
          }
          yn({
            sourceNodeId: x,
            targetNodeId: B,
            sourceTitle: P?.title || "上游节点",
            targetTitle: U.title || U.power.name,
            params: Ne.params,
            selectedParamKey: oe?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (J) {
          Ve(
            J instanceof Error ? J.message : "参数列表加载失败"
          );
        }
    },
    [Nt, o, Zt, a]
  ), Un = O(
    (m) => {
      _r(m);
    },
    [_r]
  ), [xt] = K(Jy), Rr = se(() => (xt.update(a, d), xt), [xt, a, d]), Ln = ne([]), ot = se(() => {
    const m = new Map(
      Ln.current.map((M) => [M.id, M])
    ), h = Rr.get(v), x = Rr.get(xn), B = /* @__PURE__ */ new Set([
      ...h,
      ...x
    ]), P = h.size > 0 ? v : x.size > 0 ? xn : "", U = Cs.map((M) => {
      const oe = Ov(
        M,
        ae.nodeById,
        xn,
        v,
        nn,
        B,
        P
      );
      return Fv(
        M,
        oe,
        lt,
        Un,
        m.get(M.id)
      );
    }), ee = Ln.current, J = U.length === ee.length && U.every((M, oe) => M === ee[oe]) ? ee : U;
    return Ln.current = J, J;
  }, [
    Cs,
    ae,
    Rr,
    xn,
    lt,
    Un,
    nn,
    v
  ]), bi = se(
    () => [...ot, ...ct ? [ct] : []],
    [ot, ct]
  ), Ss = O(
    (m) => {
      if (!o)
        return;
      let h = "", x = !1;
      for (const U of m)
        U.type === "select" && (x = !0, U.selected && (h = U.id));
      x && dt(h);
      const B = m.filter(
        (U) => U.type !== "select"
      );
      if (B.length === 0)
        return;
      const P = qm(B, ot);
      nt(
        zp(
          ze.current,
          new Set(ot.map((U) => U.id)),
          Sv(P)
        )
      );
    },
    [nt, ot, o]
  ), kr = Ue((m, h, x) => {
    if (!a.some((P) => P.id === m) || !a.some((P) => P.id === h)) {
      Ve("节点已变化，请重新连接");
      return;
    }
    const B = qn(ze.current, m, h, a, x.mediaUsage);
    nt(
      Mt(a, B),
      x.draft ? { draftByNodeId: /* @__PURE__ */ new Map([[h, x.draft]]) } : void 0
    );
  }), It = Ue(
    async (m, h) => {
      const x = ze.current;
      if (x.some((oe) => (oe.logicalFrom || oe.from) === m && (oe.logicalTo || oe.to) === h)) return;
      const B = a.find((oe) => oe.id === m), P = a.find((oe) => oe.id === h), U = { source: B, target: P, nodes: a, edges: x, items: ye };
      let ee = mr(U), J;
      if (P && ee.kind === "form") {
        try {
          J = (await Zt(P)).params;
        } catch (oe) {
          Ve(Gr(oe, "参数读取失败，未建立连线"));
          return;
        }
        if (!sn.current) return;
        ee = mr({ ...U, edges: ze.current, params: J });
      }
      if (ee.kind === "invalid" || ee.kind === "form" || !B || !P) {
        Ve(ee.kind === "invalid" ? ee.reason : "节点已变化，请重新连接");
        return;
      }
      ee.kind === "text" && J && Uo((oe) => new Map(oe).set(P.id, J));
      const M = Xu(ee);
      if (!M && ee.kind !== "direct") {
        yn({
          sourceNodeId: m,
          targetNodeId: h,
          sourceTitle: B.title,
          targetTitle: P.title,
          params: ee.kind === "text" ? ee.params : ee.options,
          mediaForm: ee.kind === "media" ? J : void 0,
          mediaTargetModelId: ee.kind === "media" ? P.composerDraft?.selectedTargetId : void 0,
          lyricsAvailable: ee.kind === "text" && ee.lyricsAvailable,
          lyricsSelected: !1,
          editing: !1
        });
        return;
      }
      if (M?.kind === "text")
        Nt(m, h, M.key);
      else if (M?.kind === "lyrics")
        dn(m, h);
      else {
        const oe = _a(ee, M, B, P);
        oe && kr(m, h, oe);
      }
    }
  ), Yo = O(
    (m) => {
      const h = Le;
      if (h) {
        if (yn(null), h.mediaForm) {
          const x = a.find((ee) => ee.id === h.sourceNodeId), B = a.find((ee) => ee.id === h.targetNodeId);
          if (!x || !B || B.composerDraft?.selectedTargetId !== h.mediaTargetModelId) {
            Ve("节点或模型已变化，请重新连接");
            return;
          }
          const P = mr({ source: x, target: B, nodes: a, edges: ze.current, items: ye, params: h.mediaForm }), U = _a(P, { kind: "media", key: m }, x, B);
          if (!U) {
            Ve(P.kind === "invalid" ? P.reason : "该用途已不可用，请重新连接");
            return;
          }
          kr(x.id, B.id, U);
          return;
        }
        Nt(
          h.sourceNodeId,
          h.targetNodeId,
          m
        );
      }
    },
    [ye, kr, Nt, a, Le]
  ), xr = O(() => {
    const m = Le;
    m?.lyricsAvailable && (yn(null), dn(
      m.sourceNodeId,
      m.targetNodeId
    ));
  }, [dn, Le]), _s = O(() => {
    yn(null);
  }, []), Tr = O(
    (m) => {
      o && (Jt.current = !0, !(!m.source || !m.target || m.source === m.target) && It(
        m.source || "",
        m.target || ""
      ));
    },
    [It, o]
  ), $t = O(
    (m, h) => {
      if (!o)
        return;
      const x = String(h?.nodeId || "");
      x && (oo.current = !0, I([]), tn(null)), Yt.current = x ? {
        nodeId: x,
        handleId: h?.handleId || null,
        handleType: h?.handleType || null
      } : null, Jt.current = !1, dt("");
    },
    [o, I]
  ), Rs = O(
    (m) => {
      if (!o) {
        Yt.current = null, Jt.current = !1;
        return;
      }
      const h = Yt.current;
      if (Yt.current = null, h?.nodeId && typeof window < "u" && window.setTimeout(() => {
        oo.current = !1;
      }, 0), Jt.current) {
        Jt.current = !1;
        return;
      }
      if (!h?.nodeId)
        return;
      const x = zv(m);
      x && (no.current = !0, R(
        x,
        Kr(Ce, x),
        h
      ));
    },
    [Ce, o, R]
  ), ks = O(
    (m, h) => {
      o && (m.preventDefault(), m.stopPropagation(), tn(null), I([]), dt(h.id));
    },
    [o, I]
  );
  ue(() => {
    if (!nn || typeof window > "u")
      return;
    function m(h) {
      !o || !$d(h) || (h.preventDefault(), lt(nn));
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [o, lt, nn]), ue(() => {
    if (b.length === 0 || nn || typeof window > "u")
      return;
    function m(h) {
      if (!o || !$d(h))
        return;
      const x = a.filter(
        (P) => Ht.has(P.id)
      ), B = b.map((P) => Ft.get(P)).filter((P) => !!P);
      if (!(x.length === 0 && B.length === 0)) {
        if (h.preventDefault(), B.length > 0) {
          Ae(B, x);
          return;
        }
        Ho(x);
      }
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [
    o,
    a,
    Ho,
    Ae,
    nn,
    b.length,
    b,
    Ht,
    Ft
  ]);
  const W = O((m) => {
    ys(
      (h) => Pv(h, m) ? h : m
    );
  }, []), Ni = O(
    (m) => {
      if (!o)
        return !1;
      const h = a.find(
        (B) => B.id === m.source
      ), x = a.find(
        (B) => B.id === m.target
      );
      return Sa(h, x);
    },
    [o, a]
  ), Mr = O(
    (m, h) => {
      if (!o)
        return;
      if (Ft.has(h.id)) {
        W(null);
        return;
      }
      if (Re.has(h.id)) {
        W(null);
        return;
      }
      const x = ae.nodeById.get(h.id);
      if (!x) {
        W(null);
        return;
      }
      const B = Oi(
        a,
        h.id,
        h.position
      ), P = B === h.position ? h : { ...h, position: B };
      if (x.type === "group") {
        const M = h.position.x - x.x, oe = h.position.y - x.y;
        zn(
          (ke) => ke.map((Ne) => {
            const Ie = ae.nodeById.get(Ne.id);
            return Ie?.groupId !== x.id ? Ne : {
              ...Ne,
              position: {
                x: Ie.x + M,
                y: Ie.y + oe
              }
            };
          })
        ), W(null);
        return;
      }
      if (ot.some(
        (M) => M.source === h.id || M.target === h.id
      )) {
        W(null);
        return;
      }
      const ee = Ev(
        P,
        uo,
        a
      );
      if (!ee) {
        W(null);
        return;
      }
      const J = Av(
        x,
        ee.domainNode
      );
      if (!J) {
        W(null);
        return;
      }
      W(Dv(J));
    },
    [
      ae.nodeById,
      ot,
      uo,
      o,
      Re,
      a,
      zn,
      Ft,
      W
    ]
  ), Ar = O(
    (m, h) => {
      if (!o) {
        gn(""), W(null);
        return;
      }
      if (Ft.has(h.id)) {
        const U = jc(
          a,
          h.id,
          h.position
        );
        U !== a && re(U), gn(""), W(null);
        return;
      }
      if (Re.has(h.id)) {
        gn(""), W(null);
        return;
      }
      const x = a.find((U) => U.id === h.id);
      let B = !1;
      if (x) {
        const U = Oi(
          a,
          h.id,
          h.position
        ), ee = jc(a, h.id, U), J = Hs(
          ee,
          h.id,
          U
        );
        B = (x.groupId || "") !== (J.find((oe) => oe.id === x.id)?.groupId || ""), J !== a && re(J);
        const M = Mt(J, d);
        Hl(d, M) || nt(M);
      }
      if (gn(""), B) {
        W(null);
        return;
      }
      if (!ct) {
        W(null);
        return;
      }
      ot.some(
        (U) => U.source === ct.source && U.target === ct.target
      ) || It(
        ct.source,
        ct.target
      ), W(null);
    },
    [
      d,
      It,
      nt,
      ot,
      o,
      Re,
      re,
      a,
      ct,
      Ft,
      W
    ]
  ), H = O(
    (m) => {
      !o || m.button !== 2 || (ut.current = !1, dw(m.target) && (hn.current = {
        pointerId: m.pointerId,
        start: { x: m.clientX, y: m.clientY },
        baseNodeIds: m.ctrlKey || m.metaKey ? [...b] : [],
        moved: !1,
        contextMenuHandled: !1
      }, m.preventDefault(), m.stopPropagation(), m.currentTarget.setPointerCapture?.(m.pointerId)));
    },
    [o, b]
  ), un = O(
    (m) => {
      R(m, Kr(Ce, m));
    },
    [Ce, R]
  ), Dr = O(
    (m) => {
      const h = hn.current;
      !o || !h && !ut.current || (m.preventDefault(), m.stopPropagation(), ut.current = !1, h && (h.contextMenuHandled = !0));
    },
    [o]
  ), Ii = O(
    (m) => {
      const h = hn.current;
      if (!h || h.pointerId !== m.pointerId || !Ce || !sn.current)
        return;
      const x = m.clientX - h.start.x, B = m.clientY - h.start.y;
      if (!h.moved && Math.hypot(x, B) < 5)
        return;
      h.moved = !0, m.preventDefault(), m.stopPropagation();
      const P = sn.current.getBoundingClientRect();
      vs(
        uw(
          h.start,
          {
            x: m.clientX,
            y: m.clientY
          },
          P
        )
      );
      const U = lw(
        a,
        Kr(Ce, h.start),
        Kr(Ce, {
          x: m.clientX,
          y: m.clientY
        })
      );
      I(fw(h.baseNodeIds, U)), dt(""), tn(null);
    },
    [Ce, a, I]
  ), we = O(
    (m) => {
      const h = hn.current;
      if (!h || h.pointerId !== m.pointerId)
        return;
      hn.current = null, m.currentTarget.hasPointerCapture?.(m.pointerId) && m.currentTarget.releasePointerCapture(m.pointerId), vs(null);
      const x = !h.moved && m.type === "pointerup";
      ut.current = !x && !h.contextMenuHandled, m.preventDefault(), m.stopPropagation(), x && h.contextMenuHandled && un({
        x: m.clientX,
        y: m.clientY
      });
    },
    [un]
  ), Ci = O(
    (m) => {
      if (o) {
        if (no.current) {
          no.current = !1;
          return;
        }
        I([]), dt(""), tn(null), !(!("detail" in m) || m.detail !== 2) && (m.preventDefault(), m.stopPropagation(), un({ x: m.clientX, y: m.clientY }));
      }
    },
    [o, I, un]
  ), Si = O(
    (m) => {
      if (o) {
        if (m.preventDefault(), m.stopPropagation(), ut.current) {
          ut.current = !1;
          return;
        }
        un({ x: m.clientX, y: m.clientY });
      }
    },
    [o, un]
  ), _i = O(
    (m, h) => {
      o && (m.preventDefault(), m.stopPropagation(), dt(""), Ht.has(h.id) || I([h.id]), tn({
        nodeId: h.id,
        x: m.clientX,
        y: m.clientY
      }));
    },
    [o, I, Ht]
  ), Se = _t && a.find((m) => m.id === _t.nodeId) || null, $n = _t && Ft.get(_t.nodeId) || null, lo = !!(Se && Re.has(Se.id)), fo = Se && a.find(
    (m) => m.id === yh(a, Se)
  ) || null, Jo = Se ? { x: Se.x, y: Se.y } : void 0;
  function ft() {
    tn(null);
  }
  function xs() {
    if (!(!o || !Se)) {
      if (lo) {
        Ve("脚本托管节点不能复制，请在分镜脚本中修改结构"), ft();
        return;
      }
      k(
        Se,
        Jo ? { x: Jo.x + 34, y: Jo.y + 34 } : void 0
      ), ft();
    }
  }
  function Xo() {
    if (!o || !Se && !$n)
      return;
    if ($n) {
      const h = $n;
      ft(), Ae([h]);
      return;
    }
    if (!Se)
      return;
    if (lo) {
      Ve(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      ), ft();
      return;
    }
    const m = Se;
    ft(), Ho([m]);
  }
  function Ct() {
    Se && (A(Se), ft());
  }
  function St() {
    fo && (A(
      fo,
      ul(Se)
    ), ft());
  }
  function ln() {
    if (!Se)
      return;
    const m = Zg(Se, a);
    if (!m) {
      ft();
      return;
    }
    Fe(Se.id, m), ft();
  }
  const Ri = O(() => {
    Ce?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [Ce]), tt = O(
    (m) => {
      const h = vo(m);
      yt(h), Ce?.zoomTo?.(h, { duration: 120 });
    },
    [Ce, yt]
  ), Pr = O(() => {
    const m = vo(An + 0.12);
    yt(m), Ce?.zoomIn?.({ duration: 140 });
  }, [Ce, yt, An]), Vn = O(() => {
    const m = vo(An - 0.12);
    yt(m), Ce?.zoomOut?.({ duration: 140 });
  }, [Ce, yt, An]), Ts = O(() => {
    if (o) {
      if (oo.current) {
        oo.current = !1;
        return;
      }
      dt(""), tn(null);
    }
  }, [o]), Ms = O(
    (m, h) => {
      o && gn(h.id);
    },
    [o]
  ), Er = O((m, h) => {
    Bo(h.id);
    const x = h.type === "workSpace" ? h.data.sourceNode : null;
    x && xa(x) && wm();
  }, []), ki = O(() => {
    Bo("");
  }, []), As = O(
    (m) => {
      const h = m;
      Fo(h), l.x != null && l.y != null && l.zoom != null ? (h.setViewport?.({
        x: l.x,
        y: l.y,
        zoom: l.zoom
      }), yt(l.zoom)) : yt(h.getZoom?.() || 1);
    },
    [yt, l.x, l.y, l.zoom]
  ), jn = O(
    (m, h) => {
      ro(h.zoom);
    },
    [ro]
  ), xi = O(
    (m, h) => {
      yt(h.zoom), $({
        x: h.x,
        y: h.y,
        zoom: h.zoom
      });
    },
    [yt, $]
  ), Zo = O(() => {
    Mn((m) => !m);
  }, []), po = O(() => {
    Lo((m) => !m);
  }, []), Je = [
    "ws-canvas-wrap",
    zo ? "is-dragging" : "",
    Dn ? "is-selecting" : "",
    en ? "is-resizing" : "",
    o ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ L(
    "section",
    {
      ref: sn,
      className: Je,
      style: sb(An),
      onPointerDownCapture: H,
      onPointerMoveCapture: Ii,
      onPointerUpCapture: we,
      onPointerCancelCapture: we,
      onContextMenuCapture: Dr,
      children: [
        /* @__PURE__ */ f(
          Gn,
          {
            message: hs,
            onDismiss: () => Ve(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(Em, { root: sn, children: /* @__PURE__ */ f(
          Gm,
          {
            nodes: uo,
            edges: bi,
            onlyRenderVisibleElements: !0,
            defaultViewport: l.x != null && l.y != null && l.zoom != null ? { x: l.x, y: l.y, zoom: l.zoom } : void 0,
            nodeTypes: pw,
            edgeTypes: gw,
            onNodesChange: kt,
            onEdgesChange: Ss,
            onConnect: Tr,
            onConnectStart: $t,
            onConnectEnd: Rs,
            isValidConnection: Ni,
            connectionLineStyle: yw,
            onEdgeClick: ks,
            onNodeClick: Ts,
            onNodeContextMenu: _i,
            onNodeDragStart: Ms,
            onNodeDrag: Mr,
            onNodeDragStop: Ar,
            onNodeMouseEnter: Er,
            onNodeMouseLeave: ki,
            onInit: As,
            onMove: jn,
            onMoveEnd: xi,
            onPaneClick: Ci,
            onPaneContextMenu: Si,
            nodesDraggable: o,
            nodesConnectable: o,
            nodesFocusable: o,
            edgesFocusable: o,
            elementsSelectable: o,
            deleteKeyCode: null,
            multiSelectionKeyCode: ww,
            panOnDrag: o,
            panOnScroll: !1,
            zoomOnScroll: o,
            zoomOnPinch: o,
            snapToGrid: ws,
            snapGrid: hw,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: vw,
            fitView: l.zoom == null,
            fitViewOptions: bw,
            children: o && Tn && a.length > 0 ? /* @__PURE__ */ f(
              Wm,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeColor: hb
              }
            ) : null
          }
        ) }),
        Dn ? /* @__PURE__ */ f(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: Dn,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ f(
          Oy,
          {
            canvasCount: s,
            activeCanvasName: r,
            canvasManagerOpen: i,
            showViewTools: o,
            showMiniMap: Tn,
            snapToGrid: ws,
            zoom: An,
            onOpenCanvasManager: c,
            onToggleMiniMap: Zo,
            onToggleSnap: po,
            onReset: Ri,
            onZoomIn: Pr,
            onZoomOut: Vn,
            onZoomChange: tt
          }
        ),
        o && a.length === 0 ? /* @__PURE__ */ L("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ L("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ f(Cu, { size: 16 }),
            /* @__PURE__ */ f("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ f("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        o && _t && (Se || $n) ? /* @__PURE__ */ f(
          Ey,
          {
            point: _t,
            canShowDetail: !!(Se && Pt(Se)),
            canCopy: !!(Se && !lo),
            canDelete: !!($n || !lo),
            canEditStructure: !!(fo && fo.id !== Se?.id),
            canResetStoryboardPrompt: !!(Se && Xg(Se)),
            onClose: ft,
            onCopy: xs,
            onDelete: Xo,
            onDetail: Ct,
            onEditStructure: St,
            onResetStoryboardPrompt: ln
          }
        ) : null,
        Le ? /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ f(
              wu,
              {
                sourceTitle: Le.sourceTitle,
                targetTitle: Le.targetTitle,
                params: Le.params,
                media: !!Le.mediaForm,
                selectedParamKey: Le.selectedParamKey,
                lyricsAvailable: Le.lyricsAvailable,
                lyricsSelected: Le.lyricsSelected,
                editing: Le.editing,
                onClose: _s,
                onSelect: Yo,
                onSelectLyrics: xr
              }
            )
          }
        ) : null
      ]
    }
  );
});
function Rw({
  request: e,
  onClose: t,
  onError: n
}) {
  const [o, s] = K(!1);
  async function r() {
    if (o)
      return;
    s(!0);
    const i = e.onConfirm;
    t();
    try {
      Promise.resolve(i()).catch((c) => {
        n(c instanceof Error ? c.message : "操作失败");
      });
    } catch (c) {
      n(c instanceof Error ? c.message : "操作失败");
    }
  }
  return /* @__PURE__ */ f(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ L(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (i) => i.stopPropagation(),
          children: [
            /* @__PURE__ */ L("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ f("h3", { children: e.title }),
              /* @__PURE__ */ f("p", { children: e.description })
            ] }),
            /* @__PURE__ */ L("div", { className: "ws-confirm-actions", children: [
              /* @__PURE__ */ f("button", { type: "button", disabled: o, onClick: t, children: "取消" }),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: e.tone === "danger" ? "is-danger" : "is-primary",
                  disabled: o,
                  onClick: () => {
                    r();
                  },
                  children: o ? "处理中..." : e.confirmText || "确认"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function Dd(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const o = t[n.id];
      return o ? { ...n, ...o } : n;
    })
  };
}
function kw(e, t, n) {
  const o = e[t];
  if (!o)
    return e;
  const s = Object.keys(n);
  if (!s.some(
    (c) => Object.prototype.hasOwnProperty.call(o, c)
  ))
    return e;
  const r = { ...o };
  for (const c of s)
    delete r[c];
  const i = { ...e };
  return Object.keys(r).length === 0 ? delete i[t] : i[t] = r, i;
}
function Ml(e, t, n, o = e.length) {
  const s = Math.min(
    Io,
    Math.max(2, e.length, o)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: Oe(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: s },
      (r, i) => e[i] ? Dl(e[i], i) : Al(i)
    )
  };
}
function xw(e, t, n, o) {
  if (t < 0 || t >= Io || (e?.frames.length || 0) > Io)
    return null;
  const s = e || Ml([], null, o, t + 1), r = Math.min(
    Io,
    Math.max(2, s.frames.length, t + 1)
  ), i = Dl(n, t);
  return {
    ...s,
    frames: Array.from(
      { length: r },
      (c, a) => s.frames[a] || Al(a)
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
function Al(e) {
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
function Dl(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: pu(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function Hn(e, t, n) {
  const o = Ee(t, "asset"), s = Ao(o) ? qr(o) : void 0, r = At(
    Ee(t, "output"),
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result", "output"),
    Ee(t, "result", "asset", "version", "content"),
    Ee(t, "data", "output"),
    Ee(t, "data", "content"),
    Ee(t, "data", "result"),
    Ee(t, "data")
  ), i = e.type === "agent" && r != null ? $e(r) : ni(r) || Et(r), c = e.type === "power" && Yn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? jt([
    r,
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result"),
    i
  ]) : null, a = e.type === "power" && vp(e.power, e.kind, e.outputType) ? Fa([
    r,
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result"),
    i
  ]) : null, d = Oe(
    String(Ee(t, "asset", "kind") || ""),
    String(Ee(t, "kind") || ""),
    hi(e, i)
  ), l = Xn(i, d), y = Kt(i, ""), v = e.type === "power" && Yn(e.power, e.kind, e.outputType).viewMode === "writing" ? [s?.version?.content, r, i].map(
    (k) => ap(k)?.document || na(k)
  ).find(Boolean) : null, b = Oe(
    v?.title,
    a?.title,
    c?.title
  ), I = Vr(n), R = Vr(a?.summary) || Vr(c?.summary) || Vr(l.text) || Vr(y) || (I ? `已按提示生成：${I}` : "生成完成");
  return {
    ...b && e.titleMode === "auto" ? { title: b } : {},
    description: R,
    resultRef: qa(t),
    resultOutput: a || c || i,
    asset: s || e.asset,
    kind: s?.kind || e.power?.kind || e.kind
  };
}
function Vr(e) {
  const t = Oe(e);
  return _n(t) ? "" : t;
}
function ur(e, t) {
  const n = t.version?.content;
  return {
    ...Hn(
      e,
      {
        asset: t,
        output: n
      },
      em(n)
    ),
    asset: t
  };
}
function cs(e) {
  return Aa(e.composerDraft);
}
function Tw(e) {
  const t = cs(e);
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
  const n = Zy(e, t);
  return {
    ...n,
    id: Mw(e, t, n.id)
  };
}
function Mw(e, t, n) {
  const o = Number(t.approval?.id || 0);
  if (o > 0)
    return `${e.id}:${o}`;
  const s = String(t.interaction?.interaction?.id || "");
  if (s)
    return `${e.id}:${s}`;
  const r = Zs({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return r ? `${e.id}:feedback:${Ll(r)}` : n;
}
function wa(e, t) {
  const n = Number(t.prompt?.approval?.id || 0), o = e.findIndex(
    (s) => s.id === t.id || n > 0 && Number(s.prompt?.approval?.id || 0) === n
  );
  return o < 0 ? [...e, t] : e.map((s, r) => {
    if (r !== o)
      return s;
    const i = s.status === "submitted", c = s.values || s.prompt?.values || t.values;
    return {
      ...s,
      title: t.title,
      description: t.description,
      prompt: {
        ...t.prompt,
        values: c || t.prompt.values || {}
      },
      values: s.values,
      status: i ? s.status : t.status,
      submittedAt: s.submittedAt
    };
  });
}
const va = 3e3, Aw = 80;
async function Hi(e) {
  e.consumerSignal?.throwIfAborted();
  const t = ov(e.startNode.id), n = /* @__PURE__ */ new Set();
  let o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: xo(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s), e.consumerSignal?.throwIfAborted();
  let r = await Qf({
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
  e.consumerSignal?.throwIfAborted(), ba(e, To(r));
  for (let i = 0; i < 8; i += 1) {
    const c = await Dw(
      e,
      r,
      o,
      (l) => {
        Vl(
          e,
          l,
          n
        ), Fl(e, l);
      },
      (l) => {
        o = l;
      }
    );
    e.canvasRun = c, ba(e, c), Zr(e, c);
    const a = Number(c.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      Vv(
        c,
        pv(c, a)
      )
    );
    const d = String(c.status || "").toLowerCase();
    if (d !== "waiting") {
      if (hc(e, c), d === "fail" || d === "error")
        throw new Error(cu(c));
      if (d === "canceled" || d === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await iv(e, c), r = {
      ...c,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
function ba(e, t) {
  const n = {
    ...t,
    canvas_id: Number(t.canvas_id || e.canvasId),
    asset_cate_id: Number(t.asset_cate_id || e.assetCate.id || 0),
    start_node_id: String(t.start_node_id || e.startNode.id),
    execution_scope: String(t.execution_scope || e.executionScope || "")
  };
  e.canvasRun = n, e.onCanvasRunChange?.(n);
}
async function Dw(e, t, n, o, s) {
  e.consumerSignal?.throwIfAborted();
  let r = Na(
    e,
    To(t)
  );
  if (o(r.node_results || []), Zr(e, r), r.status !== "running" && r.status !== "pending")
    return r;
  const i = String(r.request_id || "");
  if (!i) return r;
  const c = new AbortController();
  let a = !1, d = n, l, y;
  const v = new Promise((A, T) => {
    l = A, y = T;
  }), b = () => {
    a || (a = !0, y(e.consumerSignal?.reason)), c.abort();
  }, I = (A) => {
    if (a || e.consumerSignal?.aborted) return;
    const T = yc(r, A);
    if (r = T.detailsPending ? T : Na(e, T), ba(e, r), r.detailsPending) {
      Zr(e, r), Cn(r.status) && (Yr(e, ko(r), !1), hc(e, r), c.abort());
      return;
    }
    o(r.node_results || []), Zr(e, r), !(r.status === "running" || r.status === "pending") && (a = !0, l(r), c.abort());
  }, R = e.subscribeRun(i, I);
  e.consumerSignal?.addEventListener("abort", b, {
    once: !0
  }), e.consumerSignal?.aborted && b();
  const k = {
    ...e,
    canUpdateNode: (A) => !c.signal.aborted && !e.consumerSignal?.aborted && !Xr(r).has(A) && rt(e, r, A)
  };
  (async () => {
    for (; !c.signal.aborted; ) {
      try {
        const A = await Pw(
          e,
          i,
          d,
          (T) => {
            if (a || e.consumerSignal?.aborted) return;
            T.stream_id && (d = T.stream_id, s(d)), Yr(
              k,
              ko(r),
              !1
            );
            const V = El(T, e);
            if (V) I(V);
            else {
              const te = String(
                T.output?.node_key || T.output?.node_id || ""
              );
              (!te || rt(e, r, te)) && Ol(k, T);
            }
          },
          c.signal
        );
        A && I(A);
      } catch {
        if (c.signal.aborted) return;
      }
      if (c.signal.aborted) return;
      Yr(
        k,
        ko(r),
        !0
      ), await Pl(
        va,
        c.signal
      );
    }
  })().catch((A) => {
    c.signal.aborted && r.detailsPending && Cn(r.status) || a || (a = !0, y(A));
  });
  try {
    return await v;
  } finally {
    R(), e.consumerSignal?.removeEventListener("abort", b), c.abort(), e.consumerSignal?.aborted || e.runningNodeBatcher?.flush();
  }
}
function Yr(e, t, n) {
  const o = [...t];
  e.setRunningNode?.((s) => {
    let r = s;
    for (const i of o) {
      const c = s[i];
      !c || e.canUpdateNode?.(i) === !1 || c.status !== "running" || !!c.reconnecting === n || (r === s && (r = { ...s }), r[i] = { ...c, reconnecting: n });
    }
    return r;
  });
}
function Pl(e, t) {
  return new Promise((n, o) => {
    const s = () => {
      window.clearTimeout(r), t?.removeEventListener("abort", s), o(t?.reason);
    }, r = window.setTimeout(() => {
      t?.removeEventListener("abort", s), n();
    }, e);
    t?.addEventListener("abort", s, { once: !0 }), t?.aborted && s();
  });
}
async function Pw(e, t, n, o, s) {
  let r = null;
  return await vu({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: s,
    onFrame: (i) => {
      if (o(i), String(i.type || "").toLowerCase() === "result") {
        if (Ew(i))
          throw new Error(i.msg || "画布流返回失败");
        r = Na(
          e,
          To(i.output || {})
        );
      }
    }
  }), r;
}
function Ew(e) {
  return Number(e.status || 0) === 2;
}
function Na(e, t) {
  if (!e.singleNode || Ow(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), o = String(t.status || n?.status || "");
  if (n && (o !== "waiting" || t.pending_node))
    return t;
  const s = Fw(t), r = At(n?.output, t.output), i = {
    execution_id: Number(t.execution_id || n?.execution_id || 0),
    node_key: e.startNode.id,
    node_type: e.startNode.type,
    node_run_id: Number(n?.node_run_id || 0),
    run_id: Number(t.run_id || n?.run_id || 0),
    request_id: String(t.request_id || n?.request_id || ""),
    status: o || "success",
    error: n?.error || t.error,
    output: r,
    asset: n?.asset,
    version: n?.version,
    result: {
      ...n?.result || {},
      run_id: t.run_id,
      request_id: t.request_id,
      flow_run_id: t.flow_run_id,
      release_id: t.release_id,
      status: o || "success",
      error: n?.error || t.error,
      output: r,
      approval: s
    },
    approval: At(n?.approval, s),
    interaction: At(
      n?.interaction,
      Ro(n?.result),
      Ro(t.pending_node),
      Ro(t.output)
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
    pending_node: o === "waiting" ? {
      ...i,
      status: "waiting",
      approval: i.approval,
      interaction: i.interaction
    } : t.pending_node
  };
}
function Ow(e) {
  return e.singleNode && e.startNode.type === "group";
}
function Fw(e) {
  const t = si(e.output), n = si(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (s) => Ao(s) && (s.status === "pending" || s.decision === "pending")
  );
}
function El(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return To(e.output || {});
  const n = e.output || {}, o = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && o !== "waiting" || o !== "node_finished" && o !== "waiting")
    return null;
  const s = Bw(n, {
    requireDisplayableResult: o !== "waiting",
    node: t?.nodes.find(
      (r) => r.id === String(n.node_key || n.node_id || "")
    )
  });
  return s ? {
    execution_id: Number(n.execution_id || 0),
    request_id: String(e.request_id || n.parent_request_id || ""),
    run_id: Number(n.parent_run_id || n.run_id || 0),
    flow_run_id: Number(n.parent_flow_run_id || n.flow_run_id || 0),
    release_id: Number(n.release_id || 0),
    status: o === "waiting" ? "waiting" : "running",
    node_results: [s],
    pending_node: o === "waiting" ? s : null
  } : null;
}
function Bw(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const o = e.output, s = Ao(o) ? o : {}, r = Vp(s, n);
  if (!r)
    return null;
  const i = r;
  return t.requireDisplayableResult && !Uw(e, i, t.node) ? null : {
    ...r,
    node_key: n,
    execution_id: Number(
      e.execution_id || r.execution_id || s.execution_id || 0
    ),
    node_type: String(e.node_type || r.node_type || ""),
    node_run_id: Number(e.node_run_id || r.node_run_id || 0),
    run_id: Number(e.run_id || r.run_id || s.run_id || 0),
    request_id: String(
      e.request_id || r.request_id || s.request_id || ""
    ),
    child_run_id: Number(
      e.child_run_id || r.child_run_id || s.child_run_id || 0
    ),
    child_request_id: String(
      e.child_request_id || r.child_request_id || s.child_request_id || ""
    ),
    status: String(e.status || r.status || ""),
    error: String(e.error || r.error || s.error || ""),
    output: r.output ?? s.output ?? o,
    asset: r.asset ?? s.asset,
    version: r.version ?? s.version ?? r.asset?.version,
    result: r.result ?? r,
    approval: At(
      r.approval,
      zw(e, i)
    ),
    interaction: At(
      e.interaction,
      r.interaction,
      Ro(r)
    ),
    persists_result: !!(e.persists_result || r.persists_result),
    agent_run_id: Number(
      e.agent_run_id || r.agent_run_id || s.agent_run_id || 0
    ),
    runTiming: jp(
      At(e.run_timing, r.runTiming, s.run_timing)
    )
  };
}
function zw(e, t) {
  const n = si(t.result), o = At(
    e.approval,
    t.approval,
    n.approval
  );
  if (o && typeof o == "object")
    return o;
  const s = Number(
    At(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return s > 0 ? { id: s } : void 0;
}
function Ro(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const s of ["result", "pending_node"]) {
    const r = Ro(n[s], t + 1);
    if (r)
      return r;
  }
  const o = Array.isArray(n.node_results) ? n.node_results : [];
  for (const s of o) {
    const r = Ro(s, t + 1);
    if (r)
      return r;
  }
}
function Uw(e, t, n) {
  if (e.persists_result || String(e.node_type || "") !== "function")
    return !0;
  const s = String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ), r = ds(s);
  return r?.runsInBackend && !r.persistsResult ? !0 : !!(t.asset || t.version || Ee(t, "asset", "version") || Ee(t, "data", "asset") || Ee(t, "data", "version"));
}
function Ol(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.output || {}, o = String(n.event || ""), s = String(n.node_key || n.node_id || "");
  if (s) {
    if (o !== "node_output" && e.runningNodeBatcher?.flush(), o === "node_started") {
      e.setRunningNode((r) => {
        if (e.canUpdateNode?.(s) === !1) return r;
        const i = r[s];
        return {
          ...r,
          [s]: {
            ...i,
            ...Ba(i),
            nodeId: s,
            title: String(n.node_name || n.node_key || s),
            startedAt: Oa({
              currentStartedAt: i?.startedAt
            }),
            status: "running",
            progress: Math.max(i?.progress || 0, 18)
          }
        };
      });
      return;
    }
    if (o === "node_output") {
      const r = (i) => {
        if (!i || i.status !== "running" || e.canUpdateNode?.(s) === !1)
          return i;
        const c = Pd(n.output), a = String(n.node_type || "").toLowerCase(), d = a === "power", l = a === "agent", y = Pd(c.meta), v = Kp(
          At(
            y.estimated_duration_ms,
            y.estimatedDurationMs
          )
        ), b = {
          ...i,
          progress: Math.max(i.progress, 72),
          estimatedDurationMs: v || i.estimatedDurationMs
        };
        return {
          ...d ? hh(b, c) : b,
          agent: l ? Bm(i.agent, c) : i.agent
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s, r) : e.setRunningNode((i) => {
        const c = r(i[s]);
        return c === i[s] ? i : c ? { ...i, [s]: c } : bu(i, s);
      });
    }
  }
}
function Lw(e, t, n, o) {
  const s = El(t), r = t.output || {}, i = String(r.event || ""), c = String(r.node_key || r.node_id || "");
  return !c || n.size > 0 && !n.has(c) || o.has(c) ? s : i === "node_finished" ? (o.add(c), e.runningNodeBatcher?.flush(), s) : (Ol(e, t), s);
}
function Pd(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function yc(e, t) {
  if (e.request_id && t.request_id && e.request_id !== t.request_id || e.run_id && t.run_id && e.run_id !== t.run_id || Cn(e.status) && !Cn(t.status))
    return e;
  const n = [...e.node_results || []], o = /* @__PURE__ */ new Map();
  n.forEach((s, r) => {
    const i = ai(s);
    o.has(i) || o.set(i, r);
  });
  for (const s of t.node_results || []) {
    const r = ai(s), i = o.get(r);
    i !== void 0 ? n[i] = s : (o.set(r, n.length), n.push(s));
  }
  return {
    ...e,
    ...t,
    execution_scope: t.execution_scope || e.execution_scope,
    detailsPending: !!t.detailsPending,
    node_runs: t.node_runs?.length ? t.node_runs : e.node_runs,
    execution_plan: t.execution_plan || e.execution_plan,
    node_results: n,
    pending_node: t.status === "waiting" ? t.pending_node || e.pending_node : t.pending_node || null
  };
}
function Fl(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (o) => Cn(o.status) && rt(e, e.canvasRun, o.node_key)
  );
  n.length !== 0 && (e.setRunningNode(
    (o) => $w(e, o, n)
  ), Jr(
    e,
    n.map((o) => o.node_key),
    650
  ));
}
function Jr(e, t, n, o = e.canvasRun) {
  const s = /* @__PURE__ */ new Map();
  e.setRunningNode?.((r) => {
    for (const i of t) {
      const c = r[i];
      c && (c.status === "success" || c.status === "error") && rt(e, o, i) && s.set(i, c);
    }
    return r;
  }), window.setTimeout(() => {
    e.setRunningNode?.((r) => {
      let i = r;
      for (const [c, a] of s)
        r[c] !== a || !rt(e, o, c) || (i === r && (i = { ...r }), delete i[c]);
      return i;
    });
  }, n);
}
function $w(e, t, n) {
  let o = !1;
  const s = { ...t };
  for (const r of n) {
    const i = r.node_key;
    if (!rt(e, e.canvasRun, i)) continue;
    const c = e.nodes.find((d) => d.id === i);
    if (r.status === "canceled") {
      s[i] && (delete s[i], o = !0);
      continue;
    }
    if (r.status === "waiting") {
      s[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: Oa({
          nodeRunTiming: r.runTiming,
          currentStartedAt: t[i]?.startedAt
        }),
        progress: 92,
        status: "waiting"
      }, o = !0;
      continue;
    }
    const a = s[i];
    a && (s[i] = {
      ...a,
      startedAt: r.runTiming?.startedAt || a.startedAt,
      finishedAt: r.runTiming?.finishedAt || Date.now(),
      progress: 100,
      status: r.status === "success" ? "success" : "error",
      reconnecting: !1,
      agent: c?.type === "agent" ? Fm(r.output) : a.agent
    }, o = !0);
  }
  return o ? s : t;
}
function hc(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((s) => {
      const r = Ed(
        e,
        t,
        s,
        n
      );
      if (r.length === 0)
        return s;
      const i = { ...s };
      for (const c of r)
        delete i[c];
      return i;
    });
    return;
  }
  const o = t.status === "success" ? "success" : "error";
  e.setRunningNode((s) => {
    let r = !1;
    const i = { ...s }, c = Ed(
      e,
      t,
      s,
      n
    );
    for (const a of c) {
      const d = i[a];
      d && (i[a] = {
        ...d,
        progress: o === "success" ? 100 : Math.max(d.progress, 92),
        status: o,
        reconnecting: !1
      }, r = !0);
    }
    return r ? i : s;
  }), Jr(
    e,
    Bl(e, t).filter(
      (s) => s === br(t) || !n || n.has(s)
    ),
    o === "success" ? 650 : 1200,
    t
  );
}
function Ed(e, t, n, o) {
  const s = br(t), r = new Set(
    Bl(e, t).filter(
      (i) => i === s || !o || o.has(i)
    )
  );
  return Object.keys(n).filter(
    (i) => r.has(i) && rt(e, t, i)
  );
}
function Vw(e, t, n) {
  if (!e.setRunningNode)
    return;
  const o = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(o))
    return;
  const s = Xr(t), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const y of t.node_runs || [])
    y.node_key && y.runTiming && i.set(String(y.node_key), y.runTiming);
  for (const y of t.node_results || [])
    y.node_key && y.runTiming && i.set(y.node_key, y.runTiming);
  const c = br(t);
  let a = !1, d = "";
  for (const y of t.node_runs || []) {
    const v = String(y.node_key || "");
    if (!v || s.has(v) || n && !n.has(v))
      continue;
    a = !0;
    const b = String(y.status || "").trim().toLowerCase();
    b === "running" ? r.set(v, "running") : b === "waiting" ? r.set(v, "waiting") : b === "pending" && !d && (d = v);
  }
  const l = String(t.pending_node?.node_key || "");
  if (l && !s.has(l) && (!n || n.has(l)) && r.set(l, "waiting"), r.size === 0 && d && r.set(d, "running"), r.size === 0 && !a) {
    const y = xy(
      t.start_node_id,
      c
    );
    y && !s.has(y) && (!n || n.has(y)) && r.set(
      y,
      o === "waiting" ? "waiting" : "running"
    );
  }
  c && r.set(
    c,
    o === "waiting" ? "waiting" : "running"
  ), r.size !== 0 && e.setRunningNode((y) => {
    let v = !1;
    const b = { ...y };
    for (const [I, R] of r) {
      if (!rt(e, t, I)) continue;
      const k = e.nodes.find((V) => V.id === I), D = I === c;
      if (!k && !D)
        continue;
      const A = y[I], T = Oa({
        nodeRunTiming: i.get(I),
        runCreatedAt: t.created_at,
        currentStartedAt: A?.startedAt
      });
      A?.status === R && A.startedAt === T || (b[I] = {
        ...A,
        ...Ba(A),
        nodeId: I,
        title: D ? `${e.startNode.title || "分镜脚本"}制作区` : k?.title || I,
        startedAt: T,
        progress: R === "waiting" ? 92 : A?.progress || 0,
        status: R
      }, v = !0);
    }
    return v ? b : y;
  });
}
function Bl(e, t) {
  const n = new Set(ko(t)), o = br(t);
  return o && n.add(o), e.singleNode && n.add(e.startNode.id), [...n];
}
function jw(e, t, n, o) {
  const s = new Set(
    e.memberNodeIds.filter(
      (i) => Vt(n[i])
    )
  );
  if (s.size === 0 && t) {
    for (const i of t.node_runs || []) {
      const c = String(i.status || "").trim().toLowerCase();
      (c === "running" || c === "waiting") && s.add(String(i.node_key || ""));
    }
    s.size === 0 && t.pending_node?.node_key && s.add(t.pending_node.node_key);
  }
  const r = [...s].filter(Boolean).map((i) => o.get(i)?.title || i).filter((i, c, a) => a.indexOf(i) === c);
  return r.length > 1 ? `${r[0]} 等 ${r.length} 个节点` : r[0] || "";
}
function Kw(e, t, n) {
  if (n)
    return "停止中";
  const o = String(e?.status || "").trim().toLowerCase();
  if (Vt(t) || e && In(e))
    return t?.status === "waiting" || o === "waiting" ? "等待反馈" : "执行中";
  if (t?.status === "error")
    return "启动失败";
  switch (o) {
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
function qw({
  frame: e,
  edges: t,
  nodeById: n,
  groupMembersById: o,
  runBlockedReasonByNodeId: s,
  runningNodes: r,
  activeRunByStartNodeId: i,
  stoppingCanvasRunKeys: c,
  hasResult: a,
  onRunGroup: d,
  onRunNode: l,
  onStopRun: y,
  onOpenNode: v,
  projectNode: b,
  reuse: I,
  projectionDependencies: R
}) {
  const k = new Set(
    [...Ea([...n.values()], t, e.sourceNodeId).values()].map((T) => T.groupId)
  ), D = [.../* @__PURE__ */ new Set([...e.memberNodeIds, ...k])].map((T) => n.get(T)).filter(
    (T) => T?.type === "group" && T.group?.origin === "script" && (k.size === 0 || !["characters", "scenes", "props"].includes(T.group.syncKey || "") || k.has(T.id))
  ).map((T) => {
    const V = o.get(T.id) || Ks;
    return Od({
      executionNode: T,
      members: V,
      runBlockedReasonByNodeId: s,
      runningNodes: r,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => d(T.id),
      onStopRun: y,
      onOpenNode: v,
      projectNode: b,
      reuse: I,
      projectionDependencies: R
    });
  }), A = e.workNodeIds.map((T) => n.get(T)).find((T) => T?.storyboardItem?.itemType === "video_compose");
  return A && D.push(
    Od({
      executionNode: A,
      members: [A],
      runBlockedReasonByNodeId: s,
      runningNodes: r,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => l(A.id),
      onStopRun: y,
      onOpenNode: v,
      projectNode: b,
      reuse: I,
      projectionDependencies: R
    })
  ), D;
}
function Od({
  executionNode: e,
  members: t,
  runBlockedReasonByNodeId: n,
  runningNodes: o,
  activeRunByStartNodeId: s,
  stoppingCanvasRunKeys: r,
  hasResult: i,
  onRun: c,
  onStopRun: a,
  onOpenNode: d,
  projectNode: l,
  reuse: y,
  projectionDependencies: v
}) {
  const b = s.get(e.id), I = !!(b && r.has(wt(b)));
  return y(
    "group",
    e.id,
    [
      e,
      ...t,
      t.length,
      b,
      I,
      n.get(e.id),
      o[e.id],
      ...t.flatMap((R) => [o[R.id], i(R)]),
      a,
      d,
      ...v(t)
    ],
    () => {
      const R = Qa({
        members: t,
        runningNodes: o,
        groupState: o[e.id],
        hasResult: i
      }), k = String(b?.status || "").trim().toLowerCase(), D = b && R.status === "idle" ? k === "waiting" ? "waiting" : "running" : R.status, A = D === "running" || D === "waiting", T = R.runnableCount === 0, V = A ? "" : n.get(e.id) || (T ? "当前分组未配置可用能力" : "");
      return {
        id: e.id,
        title: e.title || "未命名分组",
        materialType: { characters: "character", scenes: "scene", props: "prop" }[e.group?.syncKey],
        memberCount: R.memberCount,
        runnableCount: R.runnableCount,
        completedCount: R.completedCount,
        failedCount: R.failedCount,
        status: D,
        runBlockedReason: V,
        stopping: I,
        results: t.map(
          (te) => Gw(
            te,
            o[te.id],
            i(te),
            d,
            l,
            y
          )
        ),
        onRun: !A && !V ? c : void 0,
        onStop: b ? () => a(e.id) : void 0
      };
    }
  );
}
function Gw(e, t, n, o, s, r) {
  const i = s(e), c = Ww(t, n);
  return r("result", e.id, [i, c, o], () => ({
    nodeId: e.id,
    status: c,
    node: i,
    onOpen: () => o(e.id)
  }));
}
function Ww(e, t) {
  return e?.status === "running" ? "running" : e?.status === "waiting" ? "waiting" : e?.status === "error" ? "error" : t ? "complete" : "pending";
}
function br(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? rc(t) : "";
}
function $s(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const o = Number(e.asset_cate_id || 0);
  return o === 0 || o === t.assetCateId;
}
function ko(e) {
  const t = /* @__PURE__ */ new Set(), n = String(e.start_node_id || "");
  n && t.add(n);
  for (const o of e.target_node_ids || [])
    t.add(o);
  for (const o of e.node_runs || [])
    o.node_key && t.add(o.node_key);
  for (const o of e.node_results || [])
    o.node_key && t.add(o.node_key);
  for (const o of e.execution_plan?.nodes || [])
    o.id && t.add(o.id);
  return [...t];
}
function Xr(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Cn(vr(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function Hw(e) {
  return zl(e).map((t) => t.run);
}
function Yw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    In(n) && t.set(wt(n), n);
  return [...t.values()];
}
function Jw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const o = String(n.status || "").trim();
    if (o)
      for (const s of ii(n))
        t.set(s, o);
  }
  return t;
}
function Xw(e, t) {
  for (const n of ii(t)) {
    const o = e.get(n);
    if (o)
      return o;
  }
  return "";
}
function ii(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function zl(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e) {
    const s = /* @__PURE__ */ new Set();
    for (const r of ko(o))
      t.has(r) || (t.add(r), s.add(r));
    s.size !== 0 && In(o) && n.push({ run: o, managedNodeIds: s });
  }
  return n;
}
function jr(e) {
  return e.map(Ul).filter((t) => !!t);
}
function Ul(e) {
  const t = To(e);
  return t.run_id || t.request_id ? t : null;
}
function Zw(e, t, n) {
  const o = new Map(t.map((r) => [wt(r), r])), s = /* @__PURE__ */ new Set();
  for (const r of e) {
    const i = Number(r.run_id || 0);
    if (!i || n && Lp(r, n))
      continue;
    const c = o.get(wt(r));
    !c?.detailsPending && n && Qw(r, n) || (!c || c.detailsPending || c.status !== r.status || c.executed !== r.executed || c.total !== r.total || c.error !== r.error || r.status === "waiting" && !c.pending_node) && s.add(i);
  }
  return [...s];
}
function Qw(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const r = t[String(n)];
    return r ? Ia(e, r) : !1;
  }
  const o = Number(e.asset_cate_id || 0);
  return (o ? Object.values(t).filter(
    (r) => r.assetCateId === o
  ) : Object.values(t)).some(
    (r) => Ia(e, r)
  );
}
function Ia(e, t) {
  const n = String(e.status || "").trim().toLowerCase();
  if (!["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
    n
  ))
    return !1;
  const o = new Map(t.nodes.map((c) => [c.id, c]));
  if (!e.single_node || o.get(String(e.start_node_id || ""))?.type === "group") {
    const c = (e.node_results || []).filter(
      (d) => d.node_key
    );
    if (c.length === 0)
      return !1;
    let a = 0;
    for (const d of c) {
      const l = o.get(d.node_key);
      if (l && (a += 1, !Ca(l, e, d)))
        return !1;
    }
    return a > 0;
  }
  const s = String(e.start_node_id || ""), r = o.get(s), i = (e.node_results || []).find(
    (c) => c.node_key === s
  );
  return Ca(r, e, i);
}
function Ca(e, t, n) {
  const o = vr(n) || t.status;
  return Gg(
    e,
    t,
    n,
    e?.type !== "power" || o !== "success" || Pt(e)
  );
}
function Yi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e)
    n.set(wt(s), s);
  for (const s of t) {
    const r = wt(s), i = n.get(r);
    n.set(r, i ? yc(i, s) : s);
  }
  let o = 0;
  return [...n.values()].sort(ev).filter((s) => In(s) || s.detailsPending || o++ < 50);
}
function ev(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const o = Fd(t) - Fd(e);
  return o !== 0 ? o : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Fd(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function tv(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const o = t.find((s) => s.id === n);
    if (o)
      return o;
  }
  return t.find(wi) || t[0] || null;
}
function nv(e, t) {
  return [
    e.run_id || e.request_id || "",
    ai(t)
  ].join(":");
}
function Ji(e, t, n, o) {
  const s = e.find(
    (r) => r.canvas_id === t && ko(r).includes(o)
  );
  return s ? ii(s).some(
    (r) => ii(n).includes(r)
  ) : !0;
}
function rt(e, t, n) {
  const o = n === br(t || {}) ? e.startNode.id : n;
  return !t || !e.ownsNodeResult || e.ownsNodeResult(t, o);
}
function ov(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function rv(e, t, n) {
  const o = typeof n == "string" ? n : Zs(n), s = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${s}-${Ll(o)}`.slice(
    0,
    96
  );
}
function Ll(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function Zr(e, t, n) {
  sv(e, t), Vw(e, t, n);
}
function sv(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const o = e.nodes.find((a) => a.id === n.node_key);
  if (!o || !rt(e, t, o.id))
    return;
  const s = wc(n, o);
  if (!s)
    return;
  const r = gc(o, s), i = So(o), c = wa(
    i,
    r
  );
  if (Zs(i) !== Zs(c)) {
    const a = {
      ...o,
      feedbackRequests: c
    };
    e.nodes = e.nodes.map(
      (d) => d.id === o.id ? a : d
    ), e.onNodeResult(o.id, { feedbackRequests: c });
  }
  e.setRunningNode?.((a) => ({
    ...a,
    [o.id]: {
      nodeId: o.id,
      title: o.title,
      startedAt: a[o.id]?.startedAt || Date.now(),
      progress: 92,
      status: "waiting"
    }
  }));
}
async function iv(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const o = e.nodes.find((i) => i.id === n.node_key);
  if (!o)
    throw new Error("画布运行等待节点不存在");
  const s = wc(n, o);
  if (!s || !e.requestFlowFeedback)
    throw new Error(`${o.title} 需要补充信息，请单独处理后继续`);
  const r = await e.requestFlowFeedback({ node: o, prompt: s });
  return $l(
    e.projectId,
    t,
    n,
    s,
    r
  );
}
async function $l(e, t, n, o, s) {
  return o.interaction ? Xf({
    projectId: e,
    runId: Number(o.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(o.interaction.nodeRunId || 0),
    interactionId: String(o.interaction.interaction.id || ""),
    data: s
  }) : Zf({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(o.approval.id || 0),
    feedback: s
  });
}
function av(e, t, n) {
  for (const o of e) {
    if (String(o.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const s = o.pending_node;
    if (!s || s.node_key !== t.id)
      continue;
    const r = wc(s, t);
    if (!r)
      continue;
    if (gc(t, r).id === n.id)
      return { run: o, pending: s, prompt: r };
  }
  return null;
}
function wc(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : Ro(e);
  if (n?.interaction?.id)
    return dl({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const s = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, r = At(
      e.approval,
      Ee(e.result, "approval"),
      Ee(e.output, "approval")
    );
    r && !Array.isArray(s.approvals) && (s.approvals = [r]);
    const i = th(s);
    return nh(i);
  }
  return rh(e, t.title);
}
function Vl(e, t, n) {
  let o = 0;
  const s = new Map(e.nodes.map((r) => [r.id, r]));
  for (const r of t) {
    const i = s.get(r.node_key), c = vr(r);
    if (!i || !Cn(c) || !rt(e, e.canvasRun, r.node_key))
      continue;
    const a = ai(r), d = e.canvasRun ? [e.projectId, e.canvasId, nv(e.canvasRun, r), r.runTiming?.finishedAt || ""].join(":") : "";
    if (d && e.appliedResultKeys?.has(d) || c === "success" && a && n?.has(a) && (!r.runTiming || i.runTiming?.finishedAt === r.runTiming.finishedAt))
      continue;
    const l = uv(e, i, r);
    e.onNodeResult(i.id, l), d && e.appliedResultKeys?.add(d), a && n?.add(a), c === "success" && (o += 1);
    const y = {
      ...i,
      ...l
    };
    s.set(i.id, y), e.nodes = e.nodes.map(
      (v) => v.id === i.id ? y : v
    ), c === "success" && l.asset && e.onAssetCreated(l.asset), c === "success" && e.requestNodeTitle?.(y, r);
  }
  return o;
}
function cv(e, t) {
  const n = cs(e).prompt.trim(), s = (t ? ql(e.id, t.nodes, t.edges) : null)?.text.trim() || "", r = [n, s ? `上游内容：
${s}` : ""].filter(Boolean).join(`

`);
  return Array.from(r).slice(0, iw).join("");
}
function dv(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || vr(t) !== "success" || Number(t.version_id || 0) <= 0 || !Xd(e) ? !1 : !["storyboard", "writing"].includes(
    Yn(e.power, e.kind, e.outputType).viewMode
  );
}
function ai(e) {
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
function uv(e, t, n) {
  const o = vr(n), s = lv(n.runTiming) || fv(e, n.node_key), r = (a) => s ? { ...a, runTiming: s } : a;
  if (o === "fail") {
    const a = Hn(t, n, "后端执行结果");
    return r(
      Xi(t, {
        ...mu(a.resultOutput) ? { ...a, asset: void 0 } : { resultRef: qa(n) },
        runError: $p(n)
      })
    );
  }
  if (o === "canceled")
    return r(
      Xi(t, { runError: "" })
    );
  const i = Nm({
    result: n,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), c = (a) => Xi(t, a);
  return r(
    c(i ? {
      ...Hn(
        t,
        Im(n, i),
        "后端执行结果"
      ),
      runError: ""
    } : {
      ...Hn(t, n, "后端执行结果"),
      runError: ""
    })
  );
}
function lv(e) {
  if (!(!e?.startedAt || !e.finishedAt || e.finishedAt < e.startedAt))
    return e;
}
function fv(e, t) {
  const n = e.getRunningNode?.(t);
  if (n?.startedAt)
    return {
      startedAt: n.startedAt,
      finishedAt: n.finishedAt || Date.now()
    };
}
function Xi(e, t) {
  const n = So(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function pv(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? cu(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function mv(e) {
  const t = gv(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await cp({
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
  }), o = e.previousAsset || e.previousAssets?.find((s) => s.id === n.id) || null;
  return ia(n, o);
}
function gv(e) {
  return Math.max(0, Number(e || 0));
}
function Eo(e) {
  const t = Rn(e), n = Xn(
    t,
    hi(e, t)
  );
  return Jn(n) || (n.text = Kt(t, "")), n;
}
function hi(e, t) {
  const n = Vh(t);
  return e.type === "power" ? Oe(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : Oe(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function Zi(e) {
  const t = Eo(e);
  if (Jn(t))
    return t;
  const n = Xn(
    Rn(e),
    String(e.kind || e.power?.kind || "")
  );
  return Jn(n) || (n.text = Kt(Rn(e), "")), n;
}
function vc(e) {
  return hv(e) || Oh(e);
}
function Nn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : Rn(e);
}
function qs(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    Nn(e)
  ];
}
function yv(e) {
  const t = e.composerDraft?.paramValues || {};
  return Oe(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function hv(e) {
  return Th(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function Kr(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function wv(e, t, n, o) {
  const s = o?.x ?? e.x + 34, r = o?.y ?? e.y + 34;
  return {
    ...e,
    id: `local-${e.type}-${Date.now()}-${n}`,
    nodeNo: void 0,
    title: `${e.title} 副本`,
    titleMode: "manual",
    x: s,
    y: r,
    assetCateId: e.assetCateId || t,
    group: e.type === "group" && e.group?.origin === "script" ? { origin: "manual" } : e.group,
    storyboardItem: void 0,
    storyboardMaterializedSignature: void 0,
    storyboardFramePlanVersion: void 0,
    composerDraft: e.composerDraft ? { ...e.composerDraft, paramBindings: void 0 } : void 0,
    local: !0
  };
}
function vv(e, t, n) {
  const o = jl(e), s = Kl(
    e,
    t,
    o,
    "",
    n
  ), r = (i) => o.hasResultByNodeId.get(i.id) || !1;
  return {
    ...o,
    ...s,
    runBlockedReasonByNodeId: new Map(
      e.map((i) => [
        i.id,
        nl({
          targets: i.type === "group" ? o.groupMembersById.get(i.id) || [] : [i],
          nodesByID: o.nodeById,
          hasResult: r
        })
      ])
    )
  };
}
function jl(e) {
  const t = new Map(e.map((s) => [s.id, s])), n = new Map(
    e.map((s) => [s.id, Pt(s)])
  ), o = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!s.groupId)
      continue;
    const r = o.get(s.groupId) || [];
    r.push(s), o.set(s.groupId, r);
  }
  return { nodeById: t, groupMembersById: o, hasResultByNodeId: n };
}
function Kl(e, t, n, o = "", s) {
  const { nodeById: r, groupMembersById: i, hasResultByNodeId: c } = n, a = (R) => {
    const k = r.get(R);
    return k ? k.type === "group" ? i.get(k.id) || [] : [k] : [];
  }, d = /* @__PURE__ */ new Set();
  for (const R of t) {
    const k = pn(R);
    if (o && k.targetNodeId !== o)
      continue;
    const { sourceNodeId: D } = k;
    for (const A of a(D))
      d.add(A.id);
  }
  const l = /* @__PURE__ */ new Map();
  for (const R of e)
    if (d.has(R.id)) {
      const k = bv(
        R,
        c.get(R.id) || !1
      );
      k && Bd(k).trim() !== "" && l.set(R.id, k);
    }
  const y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  for (const R of t) {
    const { sourceNodeId: k, targetNodeId: D } = pn(R);
    if (!(o && D !== o || !r.has(D)))
      for (const A of a(k)) {
        if (iu(R) && ja(A)) {
          const G = v.get(D) || [];
          G.push({ edge: R, source: A }), v.set(D, G);
        }
        const T = l.get(A.id), V = b.get(D) || /* @__PURE__ */ new Set();
        if (!T || V.has(A.id))
          continue;
        V.add(A.id), b.set(D, V);
        const te = y.get(D) || [];
        te.push(T), y.set(D, te);
      }
  }
  const I = /* @__PURE__ */ new Map();
  for (const [R, k] of v) {
    const D = s?.incomingMediaReferencesByNodeId.get(R);
    if (!D) continue;
    const A = k.map((T, V) => {
      const te = D[V];
      return te?.edge === T.edge && te.source === T.source ? te : T;
    });
    v.set(
      R,
      A.length === D.length && A.every(
        (T, V) => T === D[V]
      ) ? D : A
    );
  }
  for (const [R, k] of y)
    I.set(R, {
      sources: k,
      text: k.map(Bd).join(`

`)
    });
  return {
    inputContextByNodeId: I,
    incomingMediaReferencesByNodeId: v
  };
}
function pn(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function ql(e, t, n) {
  const o = jl(t);
  return Kl(
    t,
    n,
    o,
    e
  ).inputContextByNodeId.get(e) || null;
}
function bv(e, t) {
  if (!t)
    return null;
  const n = Rn(e), o = hi(e, n), s = Xn(n, o);
  return Jn(s) || (s.text = Kt(
    n,
    e.description || e.title
  )), {
    nodeId: e.id,
    title: e.title,
    type: e.type,
    kind: o,
    output: n,
    preview: s,
    resultRef: e.resultRef
  };
}
function Nv(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, o) => {
    const s = t.sources[o];
    return n.nodeId === s.nodeId && n.title === s.title && n.type === s.type && n.kind === s.kind && n.output === s.output && n.resultRef === s.resultRef && n.preview.text === s.preview.text && n.preview.imageUrl === s.preview.imageUrl && n.preview.videoUrl === s.preview.videoUrl && n.preview.audioUrl === s.preview.audioUrl && n.preview.fileUrl === s.preview.fileUrl;
  });
}
function Bd(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || xl(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Sa(e, t) {
  return Yd(e, t);
}
function Iv(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function zd(e, t, n, o) {
  const s = Hs([...e.nodes, n], n.id, n), r = Iv(t, n.id);
  return {
    source: s.find((i) => i.id === r.source),
    target: s.find((i) => i.id === r.target),
    nodes: s,
    edges: e.edges,
    items: o,
    referenceOnly: !0
  };
}
function _a(e, t, n, o) {
  if (e.kind === "direct" && !t) return {};
  if (e.kind === "media" && t?.kind === "media" && e.options.some(({ key: s }) => s === t.key))
    return { draft: e.draft, mediaUsage: t.key };
  if (e.kind === "text") {
    const s = cs(o);
    if (t?.kind === "lyrics" && e.lyricsAvailable)
      return { draft: uu(s, n.id) };
    if (t?.kind === "text" && e.params.some(({ key: r }) => r === t.key))
      return { draft: du(s, n.id, t.key) };
  }
}
function Gl(e, t, n) {
  const o = n.composerDraft?.storyboardLyricsSourceNodeId;
  return !o || o === t ? e : e.filter((s) => !(Kn(s) === "media" && (s.logicalFrom || s.from) === o && (s.logicalTo || s.to) === n.id));
}
function qn(e, t, n, o, s) {
  return !t || !n || t === n || e.some((i) => {
    const c = pn(i);
    return c.sourceNodeId === t && c.targetNodeId === n;
  }) ? e : [
    ...e,
    {
      id: `edge-${t}-${n}-${Date.now()}`,
      from: t,
      to: n,
      purpose: au(
        o.find((i) => i.id === t),
        o.find((i) => i.id === n)
      ),
      ...s ? { mediaUsage: s } : {}
    }
  ];
}
function Ra(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function ka(e, t) {
  return e.type === "asset" && Ra(e) === t;
}
function Ud(e, t, n, o) {
  const s = new Map(e.map((r) => [r.id, r]));
  if (o)
    for (const r of t) {
      if (r.from !== o)
        continue;
      const i = s.get(r.to);
      if (i && ka(i, n))
        return i;
    }
  return e.find((r) => ka(r, n)) || null;
}
function Ld(e, t, n, o, s) {
  const r = /* @__PURE__ */ new Set();
  if (!o || !n)
    return r;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== o || c.to === s)
      continue;
    const a = i.get(c.to);
    a && ka(a, n) && r.add(a.id);
  }
  return r;
}
function Qi(e, t) {
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
function Cv(e) {
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
function Sv(e) {
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
function _v(e, t) {
  const n = new Set(e.nodes.map((i) => i.id));
  let o = !1;
  const s = e.nodes.map((i) => {
    const c = Number(i.assetCateId ?? t), a = i.local !== !1;
    return i.assetCateId === c && i.local === a ? i : (o = !0, {
      ...i,
      assetCateId: c,
      local: a
    });
  }), r = e.edges.filter(
    (i) => n.has(i.from) && n.has(i.to)
  );
  return ip({
    id: e.id,
    name: e.name,
    sort: e.sort,
    status: e.status,
    assetCateId: t,
    nextNodeNo: e.nextNodeNo,
    nodes: o ? s : e.nodes,
    edges: r.length === e.edges.length ? e.edges : r,
    viewport: e.viewport || {},
    updatedAt: e.updatedAt
  });
}
function Rv(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, o]) => [
      n,
      dr(o, t)
    ])
  );
}
function dr(e, t) {
  const n = t.filter(
    (c) => Number(c.canvas_id || 0) === e.id
  ), o = new Map(t.map((c) => [c.id, c])), s = new Map(
    n.filter(
      (c) => String(c.role || "") === "material" && String(c.status || "") !== "archived" && String(c.node_key || c.version?.node_key || "").trim()
    ).map((c) => [
      String(c.node_key || c.version?.node_key || "").trim(),
      c
    ])
  ), r = t.length ? e.nodes.map((c) => kv(c, o, s)) : e.nodes, i = Fg(r);
  return i === e.nodes ? e : { ...e, nodes: i };
}
function kv(e, t, n) {
  const o = bc(e), s = (o > 0 ? t.get(o) : void 0) || (!e.storyboardItem && (e.type === "power" || e.type === "agent" || e.type === "flow") ? n.get(e.id) : void 0);
  if (!s)
    return e;
  const r = ur(e, s), i = Number(r.resultRef?.run_id || 0), c = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...r,
    ...e.runError && i > c ? { runError: "" } : {},
    asset: s
  };
}
function bc(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function xv(e) {
  if (!Qt(e, "import"))
    return null;
  const t = bc(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function Tv(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Wl(e.nodes, t.nodes) && Hl(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Wl(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => n === t[o]);
}
function Mv(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.status === t.status;
}
function Hl(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n === s || n.id === s.id && n.from === s.from && n.to === s.to && (n.logicalFrom || "") === (s.logicalFrom || "") && (n.logicalTo || "") === (s.logicalTo || "") && (n.purpose || "") === (s.purpose || "") && (n.executionMode || "auto") === (s.executionMode || "auto") && (n.mediaUsage || "") === (s.mediaUsage || "");
  });
}
function Av(e, t) {
  return Sa(e, t) ? { source: e.id, target: t.id } : Sa(t, e) ? { source: t.id, target: e.id } : null;
}
function Dv(e) {
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
function Pv(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function Ev(e, t, n) {
  const s = new Map(n.map((i) => [i.id, i]));
  let r = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const c = s.get(i.id);
    if (!c)
      continue;
    const a = i.position.x - e.position.x, d = i.position.y - e.position.y, l = Math.sqrt(a * a + d * d);
    l < 150 && (!r || l < r.distance) && (r = { distance: l, domainNode: c });
  }
  return r;
}
function Ov(e, t, n, o, s, r, i) {
  const c = e.id === s, a = r.has(e.id), d = c || a || e.source === n || e.target === n || e.source === o || e.target === o, l = e.source === n || e.target === n ? n : o;
  return {
    highlighted: d,
    selected: c,
    highlightColor: d ? Bv(
      t.get(
        a ? i : l
      )
    ) : "var(--ws-edge)"
  };
}
function Fv(e, t, n, o, s) {
  const r = {
    ...e,
    data: {
      ...e.data,
      isHighlighted: t.highlighted,
      isSelected: t.selected,
      highlightColor: t.highlightColor,
      onDelete: n,
      onEditBinding: o
    }
  };
  if (!s) return r;
  const i = Object.keys(s), c = Object.keys(r), a = Object.keys(s.data || {}).length === Object.keys(r.data || {}).length && Object.entries(r.data || {}).every(
    ([d, l]) => s.data?.[d] === l
  );
  return i.length === c.length && a && c.every(
    (d) => d === "data" || s[d] === r[d]
  ) ? s : r;
}
function Bv(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function zv(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function Uv(e) {
  return e instanceof HTMLElement ? !!(e.isContentEditable || e.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) : !1;
}
function $d(e) {
  const t = e.target, n = t === document.body || t === document.documentElement || t instanceof Element && !!t.closest(".ws-canvas-wrap");
  return !e.defaultPrevented && !e.repeat && (e.key === "Delete" || e.key === "Backspace") && n && !Uv(t) && !(t instanceof Element && t.closest(
    '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="combobox"], [data-radix-popper-content-wrapper]'
  )) && !document.querySelector(
    '[role="dialog"][aria-modal="true"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]'
  );
}
function Lv(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ f(La, { ...n }) : e === "import" ? /* @__PURE__ */ f(aa, { ...n }) : e === "display" ? /* @__PURE__ */ f(Ua, { ...n }) : e === "save" ? /* @__PURE__ */ f(ku, { ...n }) : /* @__PURE__ */ f(xu, { ...n });
}
function wi(e) {
  return Qt(e, "start");
}
function Yl(e) {
  return !!(e.type === "function" && ds(e.functionOption?.key)?.showsResult);
}
function vi(e) {
  return Yl(e) && Pt(e);
}
function $v(e) {
  return {
    description: e
  };
}
function Vv(e, t) {
  return {
    ...$v(t),
    resultRef: qa({
      ...si(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Vd = { width: 620, height: 420 }, Nc = 44;
function Jl(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && us(t) === "image");
}
function jv(e, t) {
  return {
    initialWidth: e.width,
    initialHeight: e.height,
    measured: { width: e.width, height: e.height },
    style: {
      ...t,
      width: e.width,
      height: e.height
    }
  };
}
function Xl(e) {
  if (e.type === "power" && Yn(e.power, e.kind, e.outputType).viewMode === "writing" && oa(e))
    return pp(Ic(e));
  if (e.type === "function") {
    if (vi(e)) {
      if (!oa(e))
        return { width: e.width, height: e.height };
      const n = jd(e);
      return n ? {
        width: n.width,
        height: n.height + Nc
      } : qv(e);
    }
    return { width: 128, height: 46 };
  }
  const t = jd(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Ic(e, t = e.resultOutput) {
  const n = Qr(e, e.resultOutput), o = t === e.resultOutput ? null : Qr(e, t);
  return (o ? mp(n, o) : n)?.document || na(e.asset?.version?.content) || na(e.resultOutput);
}
function jd(e) {
  if (!oa(e) || !Kv(e))
    return null;
  const t = Eo(e);
  return !fu(
    Nn(e),
    us(t)
  ) || Jl(e, t) ? null : {
    width: Math.max(e.width, Vd.width),
    height: Math.max(e.height, Vd.height)
  };
}
function Kv(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Yn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function qv(e) {
  const t = Eo(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), o = Ma({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: o.width,
    height: o.height + Nc
  };
}
const Gv = {
  agent: { input: { left: "4px" }, output: { right: "4px" } },
  flow: { input: { left: "11px" }, output: { right: "11px" } },
  function: { input: { left: "0px" }, output: { right: "0px" } }
};
function Zl(e) {
  return e.type === "function" && vi(e) ? {
    input: { left: "0px", top: "19px" },
    output: { left: "128px", right: "auto", top: "19px" }
  } : Gv[e.type];
}
function qe({
  id: e,
  type: t,
  position: n,
  className: o,
  style: s
}) {
  return Nu(mc) ? null : /* @__PURE__ */ f(
    Ym,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${o}`,
      style: s,
      children: /* @__PURE__ */ f("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ f(Su, { size: 12 }) : /* @__PURE__ */ f(_u, { size: 12 }) })
    }
  );
}
function Wv(e, t) {
  e.onAssetCreated(t), e.onNodeResult(e.id, {
    ...ur(e, t),
    resultRef: {
      ...e.resultRef,
      asset_id: t.id,
      version_id: t.version_id
    },
    ...t.version_id > (e.asset?.version_id || e.resultRef?.version_id || 0) ? { runError: "" } : {}
  });
}
function bn({
  node: e,
  selected: t
}) {
  if (e.embedded) return null;
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && vi(e), o = /* @__PURE__ */ f(
    qy,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const s = Vt(e.runningNode);
    return /* @__PURE__ */ L(Gt, { children: [
      o,
      /* @__PURE__ */ f(
        fh,
        {
          node: e,
          running: s,
          onRun: () => {
            s || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((r) => {
              e.onNodeResult(e.id, {
                runError: r instanceof Error ? r.message : "流程运行失败"
              });
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !xa(e) || !t || !e.showNodeSettings ? o : /* @__PURE__ */ L(Gt, { children: [
    o,
    /* @__PURE__ */ f(
      Te,
      {
        fallback: /* @__PURE__ */ f(xe, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ f(xm, { node: e }, e.id)
      }
    )
  ] });
}
function xa(e) {
  if (e.type === "agent")
    return !0;
  if (e.type !== "power") return !1;
  const t = Yn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return t !== "video_compose" && !(t === "writing" && Zd(Ic(e)));
}
function rr({
  node: e,
  onShowNodeDetail: t
}) {
  return !t || !Pt(e) ? null : /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "ws-node-quick-view nodrag nopan",
      "aria-label": "查看详情",
      onPointerEnter: ts,
      onFocus: ts,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ f(Ua, { size: 14 })
    }
  );
}
const Hv = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function ea({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const o = is(
    e.resultView || Hv
  ), [s, r] = K(null), i = Vy(
    o,
    s
  ), [c, a] = K(!1), d = e.type === "agent" ? t?.agent : void 0, l = zm(d);
  if (!Pt(e) && !l)
    return null;
  const y = Eo(e), v = dc(e), b = Oe(
    Kt(y.text, ""),
    Kt(v, ""),
    Kt(e.description, ""),
    e.title,
    "暂无结果"
  ), I = vc(e), R = Nn(e), k = Ge(R) ? R : I ? { rich: I } : b, D = gl(y) ? y : Lh(
    y,
    Xn(b, Il(b, ""))
  ), A = e.interactive, T = At(
    e.resultOutput,
    e.asset?.version?.content
  ), V = e.type === "agent" ? async (te) => {
    if (!Vt(t))
      try {
        await e.onRunBackendNode(e, { agentInput: te });
      } catch (G) {
        e.onNodeResult(e.id, {
          runError: G instanceof Error ? G.message : "智能体继续运行失败"
        });
      }
  } : void 0;
  return /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    ml,
    {
      output: k,
      fallback: b,
      preview: D,
      mediaLabel: gr(D),
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
      onOpenIntent: ts,
      resizeControls: /* @__PURE__ */ f(
        Gy,
        {
          value: i,
          enabled: A,
          onResizeStart: () => {
            r(
              (te) => yd(
                o,
                te,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (te) => r(
            (G) => yd(
              o,
              G,
              te
            )
          ),
          onResizeEnd: (te) => {
            a(!1), e.onResultViewResizeEnd(e.id, te), r(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ f(
        Te,
        {
          fallback: /* @__PURE__ */ f(xe, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ f(
            Tm,
            {
              output: T,
              runtime: d,
              fallback: b,
              running: Vt(t),
              onContinue: V
            }
          )
        }
      ) : void 0
    }
  ) });
}
function Yv({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const o = Eo(e), s = vc(e), r = Nn(e), i = Oe(
    dc(e),
    Kt(o.text, ""),
    Kt(e.description, ""),
    "暂无内容"
  ), c = Ge(r) ? r : s ? { rich: s } : i, a = !lr(c, o) && !!(o.imageUrl || o.videoUrl || o.audioUrl), d = a && !o.audioUrl ? Ws(
    e,
    e.onNodeResult,
    Nc
  ) : void 0;
  return /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    ml,
    {
      output: c,
      fallback: i,
      preview: o,
      mediaLabel: gr(o),
      className: `ws-node-function-result-card ${a ? "has-media" : ""}`,
      customContentIsPureMedia: a,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: ts,
      openOnContentClick: !0,
      children: a ? /* @__PURE__ */ f(
        nf,
        {
          preview: o,
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
function ta({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = So(e);
  if (!t || n.length === 0)
    return null;
  const o = n.filter(
    (r) => r.status === "pending"
  ).length, s = [...n].reverse().find((r) => r.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ L(
    "button",
    {
      type: "button",
      className: `ws-node-feedback-beacon nodrag nopan ${o > 0 ? "is-pending" : "is-done"}`,
      "aria-label": o > 0 ? "继续填写反馈" : "查看反馈记录",
      onMouseDown: (r) => r.stopPropagation(),
      onClick: (r) => {
        r.preventDefault(), r.stopPropagation(), t(e, s);
      },
      children: [
        /* @__PURE__ */ f(yg, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ f("span", { children: n.length }) : null
      ]
    }
  );
}
function Jv(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Pt(e) {
  if (!Xv(e) || !Jv(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = Rn(e);
  if (t == null)
    return !1;
  const n = Xn(
    t,
    hi(e, t)
  );
  return Jn(n) || pc(t);
}
function Xv(e) {
  return e.type !== "function" ? !0 : Yl(e);
}
async function Zv(e) {
  const t = ds(e.node.functionOption?.key);
  if (!t)
    throw new Error(
      `不支持的画布功能：${e.node.functionOption?.key || e.node.title || "未配置"}`
    );
  const n = t.key, o = Qv(e.inputContext);
  if (n === "display") {
    if (o == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      Hn(
        e.node,
        { output: o },
        "展示上游结果"
      )
    ), !0;
  }
  if (n === "save") {
    if (o == null)
      throw new Error("保存节点没有可保存的上游结果");
    const s = await mv({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: tb(e.node, e.inputContext),
      kind: hm(e.node),
      content: o,
      nodeKey: e.node.id,
      requestId: rv(
        "save",
        e.node.id,
        o
      ),
      source: eb(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(s), e.onNodeResult(
      e.node.id,
      Hn(
        e.node,
        {
          output: s.version?.content || o,
          asset: s
        },
        "保存上游结果"
      )
    ), !0;
  }
  if (n === "start")
    return await e.onRunStartNode(e.node), !0;
  if (n === "import")
    return e.onOpenImportPicker(e.node.id), !0;
  throw new Error(`不支持的画布功能：${n}`);
}
function Cc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function Qv(e) {
  const t = Cc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function eb(e) {
  const t = Cc(e);
  return Wg(t);
}
function tb(e, t) {
  const n = Cc(t);
  return Oe(n?.title, e.title, "画布资产");
}
function nb({
  errorFeedback: e,
  prompt: t,
  running: n,
  readonly: o,
  history: s,
  activeRecordId: r,
  onSelectRecord: i,
  onClose: c,
  onSubmit: a
}) {
  const d = se(
    () => rb(t),
    [t]
  );
  if (typeof document > "u")
    return null;
  const l = document.querySelector(".ws-page") || document.body;
  return wp(
    /* @__PURE__ */ f("div", { className: "ws-flow-feedback-backdrop", onMouseDown: c, children: /* @__PURE__ */ L(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (y) => y.stopPropagation(),
        children: [
          /* @__PURE__ */ L("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ L("div", { children: [
              /* @__PURE__ */ f("strong", { children: t.title || "补充信息" }),
              o ? /* @__PURE__ */ f("span", { children: "已提交的反馈记录，可查看之前填写的内容。" }) : t.description ? /* @__PURE__ */ f("span", { children: t.description }) : null
            ] }),
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "ws-flow-feedback-close",
                disabled: n,
                onClick: c,
                "aria-label": "关闭",
                children: /* @__PURE__ */ f(Ru, { size: 18 })
              }
            )
          ] }),
          s && s.length > 1 ? /* @__PURE__ */ f("div", { className: "ws-flow-feedback-tabs", children: s.map((y, v) => /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: y.id === r ? "is-active" : "",
              onClick: () => i?.(y),
              children: [
                /* @__PURE__ */ f("span", { children: v + 1 }),
                y.status === "pending" ? "待反馈" : "已提交"
              ]
            },
            y.id
          )) }) : null,
          /* @__PURE__ */ L("div", { className: "ws-flow-feedback-body custom-scrollbar", children: [
            e,
            /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载交互表单" }), children: /* @__PURE__ */ f(
              vm,
              {
                interaction: d,
                disabled: n,
                readonly: o,
                hideHeader: !0,
                layout: "dialog",
                initialData: o ? t.values : void 0,
                onSubmit: (y) => a(
                  ob(t, d, y.data)
                )
              }
            ) })
          ] }),
          o ? /* @__PURE__ */ f("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: c,
              children: [
                /* @__PURE__ */ f($a, { size: 16 }),
                /* @__PURE__ */ f("span", { children: "知道了" })
              ]
            }
          ) }) : null
        ]
      }
    ) }),
    l
  );
}
function ob(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function rb(e) {
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
function vo(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function sb(e) {
  const t = vo(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Kd(e, t) {
  if (!e)
    return;
  const n = vo(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function ib(e) {
  return wi(e);
}
function ab(e) {
  return wi(e) ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function cb(e, t, n, o, s) {
  if (e.group?.origin !== "script") {
    await o(t);
    return;
  }
  const r = Dy({
    members: n,
    hasResult: s
  });
  await o(t, { targetNodeIds: r });
}
function Ql({
  group: e,
  sourceNode: t,
  members: n,
  runNode: o,
  hasResult: s,
  onError: r
}) {
  cb(e, t, n, o, s).catch(
    (i) => {
      r(i instanceof Error ? i.message : "分组运行失败");
    }
  );
}
function db(e) {
  const { ref: t, visible: n } = Om(), o = Hm();
  ns(() => {
    if (!n) return;
    const r = window.requestAnimationFrame(
      () => o(e.id)
    );
    return () => window.cancelAnimationFrame(r);
  }, [e.id, o, n]);
  const s = Zl(e.data);
  return /* @__PURE__ */ f(
    "div",
    {
      ref: t,
      style: { position: "relative", width: "100%", height: "100%" },
      children: n ? /* @__PURE__ */ f(ef, { ...e }) : /* @__PURE__ */ L(Gt, { children: [
        /* @__PURE__ */ f(
          qe,
          {
            id: "input-0",
            type: "target",
            position: Ke.Left,
            className: "is-in",
            style: s?.input
          }
        ),
        /* @__PURE__ */ f(
          qe,
          {
            id: "output-0",
            type: "source",
            position: Ke.Right,
            className: "is-out",
            style: s?.output
          }
        )
      ] })
    }
  );
}
function ef({
  data: e,
  selected: t
}) {
  const [n, o] = K(""), s = Nu(mc), r = e, i = Zl(r), {
    sourceNode: c,
    projectId: a,
    runningNode: d,
    onShowNodeDetail: l,
    onConfirmStoryboard: y,
    onNodeResult: v,
    onOpenFeedbackRecord: b,
    canvasReferenceItems: I,
    connectedMediaReferences: R,
    onConnectedMediaEdgeRemove: k,
    onNodeDraftChange: D,
    onOpenStoryboardGridImport: A,
    onRunBackendNode: T,
    structureLocked: V,
    storyboardSourceNode: te
  } = e, G = r.type === "power" ? Yn(r.power, r.kind, r.outputType) : null, re = G?.viewMode === "writing", F = G?.viewMode === "storyboard", ge = G?.viewMode === "setting", $ = G?.viewMode === "storyboard_grid", q = G?.viewMode === "video_compose";
  if (r.type === "group") {
    const z = r.groupMembers, Z = r.groupRuntime || Qa({
      members: z,
      runningNodes: rw,
      groupState: d,
      hasResult: Pt
    }), me = r.runBlockedReason;
    let ye;
    return me || (ye = () => Ql({
      group: r,
      sourceNode: c,
      members: z,
      runNode: T,
      hasResult: Pt,
      onError: o
    })), /* @__PURE__ */ L(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载分组" }), children: [
      /* @__PURE__ */ f(
        Gn,
        {
          message: n,
          onDismiss: () => o("")
        }
      ),
      /* @__PURE__ */ L(
        Ih,
        {
          node: r,
          memberCount: Z.memberCount,
          runnableCount: Z.runnableCount,
          completedCount: Z.completedCount,
          failedCount: Z.failedCount,
          status: Z.status,
          selected: t,
          managed: V,
          onRename: V ? void 0 : (ve) => v(r.id, { title: ve, titleMode: "manual" }),
          onEditStructure: te ? () => l(
            te,
            ul(r)
          ) : void 0,
          onRun: ye,
          runBlockedReason: me,
          children: [
            /* @__PURE__ */ f(
              qe,
              {
                id: "input-0",
                type: "target",
                position: Ke.Left,
                className: "is-in"
              }
            ),
            /* @__PURE__ */ f(
              qe,
              {
                id: "output-0",
                type: "source",
                position: Ke.Right,
                className: "is-out"
              }
            ),
            /* @__PURE__ */ f(bn, { node: r, selected: t })
          ]
        }
      )
    ] });
  }
  if (r.type === "agent") {
    const z = Vt(d) || d?.status === "success";
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${z ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ f(
            qe,
            {
              id: "input-0",
              type: "target",
              position: Ke.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            qe,
            {
              id: "output-0",
              type: "source",
              position: Ke.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ L("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ f(pg, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ f(
              qi,
              {
                className: "ws-node-circle-title",
                title: r.title,
                onRename: v ? (Z) => v(r.id, { title: Z, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          z ? /* @__PURE__ */ L(
            "svg",
            {
              className: "ws-node-running-border is-spin is-circle is-agent",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ f(
                  "circle",
                  {
                    className: "ws-node-running-track",
                    cx: "50",
                    cy: "50",
                    r: "47",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ f(
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
          /* @__PURE__ */ f(
            ta,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          /* @__PURE__ */ f(
            ea,
            {
              node: r,
              runningNode: d,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(bn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "flow") {
    const z = Vt(d) || d?.status === "success";
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${z ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ f(
            "svg",
            {
              className: "ws-hexagon-svg",
              viewBox: "0 0 100 100",
              fill: "currentColor",
              children: /* @__PURE__ */ f(
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
          z ? /* @__PURE__ */ L(
            "svg",
            {
              className: "ws-node-running-border is-spin is-hexagon",
              "aria-hidden": "true",
              viewBox: "0 0 100 100",
              preserveAspectRatio: "none",
              children: [
                /* @__PURE__ */ f(
                  "polygon",
                  {
                    className: "ws-node-running-track",
                    points: "50,5 92,28 92,72 50,95 8,72 8,28",
                    pathLength: "100"
                  }
                ),
                /* @__PURE__ */ f(
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
          /* @__PURE__ */ L("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ f(mg, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ f(
              qi,
              {
                className: "ws-node-flow-title",
                title: r.title,
                onRename: v ? (Z) => v(r.id, { title: Z, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ f(
            qe,
            {
              id: "input-0",
              type: "target",
              position: Ke.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            qe,
            {
              id: "output-0",
              type: "source",
              position: Ke.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            ta,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          /* @__PURE__ */ f(ea, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(bn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "function") {
    const z = r.functionOption?.key || "", Z = Qt(r, "start"), { onRunFunctionNode: me, requestConfirm: ye } = r, ve = Vt(d), fe = ve, he = vi(r), Fe = () => {
      me(r).catch((be) => {
        o(be instanceof Error ? be.message : "执行出错");
      });
    }, ce = () => {
      if (!fe) {
        if (ib(r)) {
          ye({
            title: `执行「${r.title}」`,
            description: ab(r),
            confirmText: "执行",
            onConfirm: Fe
          });
          return;
        }
        Fe();
      }
    }, Be = (be) => {
      be.preventDefault(), be.stopPropagation(), ce();
    };
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${fe ? "is-running" : ""} ${he ? "has-result-card" : ""} is-${z || "default"}`,
        children: [
          /* @__PURE__ */ f(
            Gn,
            {
              message: n,
              onDismiss: () => o("")
            }
          ),
          /* @__PURE__ */ L(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": fe,
              onClick: Be,
              onKeyDown: (be) => {
                be.key !== "Enter" && be.key !== " " || (be.preventDefault(), be.stopPropagation(), ce());
              },
              children: [
                /* @__PURE__ */ f("div", { className: "ws-node-function-icon", children: ve ? /* @__PURE__ */ f(Mo, { size: 15, className: "ws-spin" }) : Lv(z, Z) }),
                /* @__PURE__ */ f("span", { className: "ws-node-function-title", children: ve ? d?.status === "waiting" ? "等待中" : "运行中" : r.title })
              ]
            }
          ),
          he ? /* @__PURE__ */ f(
            Yv,
            {
              node: r,
              running: fe,
              onShowNodeDetail: l
            }
          ) : null,
          /* @__PURE__ */ f(
            rr,
            {
              node: r,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(
            qe,
            {
              id: "input-0",
              type: "target",
              position: Ke.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            qe,
            {
              id: "output-0",
              type: "source",
              position: Ke.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            ta,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          he ? null : /* @__PURE__ */ f(ea, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(bn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "asset") {
    if (r.kind === "image") {
      const ce = Zi(r), Be = Nn(r), be = lr(Be, ce), Ot = Ws(r, v), st = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: st, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(ed, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "图片资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-image-container ws-node-content-container", children: be ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          fr,
          {
            output: Be,
            fallback: ce.text || r.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : ce.imageUrl ? /* @__PURE__ */ f(
          Ta,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-image-raw",
            onMediaSize: Ot
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(ed, { size: 24 }),
          /* @__PURE__ */ f("span", { children: ce.text || r.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ f(
          qe,
          {
            id: "input-0",
            type: "target",
            position: Ke.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          qe,
          {
            id: "output-0",
            type: "source",
            position: Ke.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ f(
          rr,
          {
            node: r,
            onShowNodeDetail: l
          }
        ),
        /* @__PURE__ */ f(bn, { node: r, selected: t })
      ] });
    }
    if (r.kind === "video") {
      const ce = Zi(r), Be = Nn(r), be = lr(Be, ce), Ot = Ws(r, v), st = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        ce.videoUrl || ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: st, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(td, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "视频资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-video-container ws-node-content-container", children: be ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          fr,
          {
            output: Be,
            fallback: ce.text || r.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : ce.videoUrl ? /* @__PURE__ */ f(
          Xs,
          {
            src: ce.videoUrl,
            poster: ce.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: r.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: Ot
          },
          ce.videoUrl
        ) : ce.imageUrl ? /* @__PURE__ */ f(
          Ta,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-video-raw",
            onMediaSize: Ot
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(td, { size: 24 }),
          /* @__PURE__ */ f("span", { children: ce.text || r.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ f(
          qe,
          {
            id: "input-0",
            type: "target",
            position: Ke.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          qe,
          {
            id: "output-0",
            type: "source",
            position: Ke.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ f(
          rr,
          {
            node: r,
            onShowNodeDetail: l
          }
        ),
        /* @__PURE__ */ f(bn, { node: r, selected: t })
      ] });
    }
    const z = Zi(r), Z = vc(r), me = Nn(r), ye = dc(r), ve = Ge(me) ? me : Z ? { rich: Z } : ye || z.text, fe = lr(ve, z), he = !!(z.imageUrl || z.videoUrl || z.audioUrl), Fe = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      he ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ L("div", { className: Fe, children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(gg, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ f("span", { children: r.title })
      ] }),
      /* @__PURE__ */ f("div", { className: "ws-node-text-card", children: !fe && z.imageUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        "img",
        {
          src: z.imageUrl,
          alt: gr(z) || r.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !fe && z.videoUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        Xs,
        {
          src: z.videoUrl,
          poster: z.videoPosterUrl,
          ariaLabel: gr(z) || r.title,
          objectFit: "cover",
          allowDragFromVideo: !0,
          playButtonOnly: !0
        },
        z.videoUrl
      ) }) : !fe && z.audioUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ f(
        Te,
        {
          fallback: /* @__PURE__ */ f(xe, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ f(yu, { src: z.audioUrl })
        }
      ) }) : !fe && z.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ f(Va, { size: 16 }),
        /* @__PURE__ */ f("span", { children: gr(z) || "文件内容" })
      ] }) : /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
        fr,
        {
          output: ve,
          fallback: ye || z.text || "暂无内容",
          mediaGridKind: us(z),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ f(
        qe,
        {
          id: "input-0",
          type: "target",
          position: Ke.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ f(
        qe,
        {
          id: "output-0",
          type: "source",
          position: Ke.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ f(
        rr,
        {
          node: r,
          onShowNodeDetail: l
        }
      ),
      /* @__PURE__ */ f(bn, { node: r, selected: t })
    ] });
  }
  if (r.type === "power") {
    const z = Vt(d), Z = Qd(r.power, r.kind), me = $ ? Fa(
      z ? [d?.streamOutput, qs(r)] : qs(r)
    ) : null, ye = Pt(r), ve = z ? "running" : d?.status === "error" ? "error" : d?.status === "success" && !ye ? "running" : ye ? "complete" : "empty", fe = !!(!re && !F && !$ && !q && d?.streamStarted && (d.streamText || d.streamOutput) && d.status !== "success"), he = fe ? d?.streamOutput ? Xn(d.streamOutput, "audio") : {
      text: d?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : Eo(r), Fe = fe ? d?.streamOutput || { text: d?.streamText || "" } : Nn(r), ce = re || F || $ || q || fe || ye, Be = !re && !F && !$ && !q && !!(he.imageUrl || he.videoUrl || he.audioUrl || he.fileUrl), be = r.embedded ? void 0 : Ws(r, v), Ot = re ? Ic(
      r,
      d?.streamOutput || r.resultOutput
    ) : null, st = Ot ? Ot.status === "failed" : !!r.runError, Qn = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      re ? "is-writing" : "",
      F ? "is-storyboard" : "",
      $ ? "is-storyboard-grid" : "",
      q ? "is-video-compose" : "",
      Z ? "is-audio" : "",
      r.embedded ? "is-embedded" : "",
      ce ? "has-content" : "",
      Be ? "has-media" : ""
    ].filter(Boolean).join(" "), pe = (de) => /* @__PURE__ */ L("div", { className: "ws-node-floating-meta", children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(
          _g,
          {
            power: r.power,
            kind: r.kind,
            outputType: r.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ f(
          qi,
          {
            className: "ws-node-floating-title",
            title: r.title,
            onRename: v && !V ? (it) => v(r.id, { title: it, titleMode: "manual" }) : void 0
          }
        )
      ] }),
      de
    ] }), He = (de, it, Me) => /* @__PURE__ */ L(
      "div",
      {
        className: `${Qn}${Me ? " is-running" : st ? " is-error" : ""}`,
        children: [
          /* @__PURE__ */ f(
            Gn,
            {
              message: n,
              onDismiss: () => o("")
            }
          ),
          pe(it),
          /* @__PURE__ */ L("div", { className: "ws-node-power-card", children: [
            Me ? /* @__PURE__ */ L("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
              /* @__PURE__ */ f(
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
              /* @__PURE__ */ f(
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
            de
          ] }),
          r.runError && !Me && !re ? /* @__PURE__ */ f(
            mb,
            {
              projectId: a,
              node: r,
              onOpenDetail: l ? () => l(r) : void 0
            }
          ) : null,
          /* @__PURE__ */ f(
            qe,
            {
              id: "input-0",
              type: "target",
              position: Ke.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ f(
            qe,
            {
              id: "output-0",
              type: "source",
              position: Ke.Right,
              className: "is-out"
            }
          ),
          re || F || ge || $ || q ? null : /* @__PURE__ */ f(
            rr,
            {
              node: r,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(bn, { node: r, selected: t })
        ]
      }
    );
    return re ? /* @__PURE__ */ f(
      Te,
      {
        fallback: He(
          /* @__PURE__ */ f(xe, { label: "正在加载创作工作区", compact: !0 }),
          null,
          z
        ),
        children: /* @__PURE__ */ f(
          Cm,
          {
            renderFrame: He,
            canvasRun: r.canvasRun,
            canvasRunStopping: r.canvasRunStopping,
            runningNode: d,
            onStopCanvasRun: () => r.onStopNodeCanvasRun(r.id),
            onCreateStoryboards: (de) => r.onCreateStoryboards(r.id, de),
            projectId: a,
            canvasId: r.canvasId,
            node: r,
            output: d?.streamOutput || Nn(r),
            running: z,
            readonly: !r.interactive,
            onAssetUpdated: (de) => Wv(r, de),
            onOpenDetail: (de) => l(
              de ? { ...r, resultOutput: { writing: de } } : r
            )
          }
        )
      }
    ) : He(
      /* @__PURE__ */ f(Gt, { children: q ? /* @__PURE__ */ f(
        Te,
        {
          fallback: /* @__PURE__ */ f(xe, { label: "正在加载视频合成" }),
          children: /* @__PURE__ */ f(
            _m,
            {
              teamId: r.teamId,
              projectId: a,
              canvasId: r.canvasId,
              outputAssetId: bc(r),
              composition: r.composerDraft?.videoComposition,
              referenceItems: I.filter(
                (de) => de.source !== "current" || de.id !== r.id
              ),
              connectedMediaReferences: R,
              running: z,
              onChange: D ? (de) => D(r.id, {
                ...r.composerDraft || {},
                videoComposition: de
              }) : void 0,
              onConnectedMediaEdgeRemove: k,
              onRun: T ? (de) => {
                T({
                  ...r,
                  composerDraft: {
                    ...r.composerDraft || {},
                    videoComposition: de
                  }
                }).catch(
                  (it) => o(
                    it instanceof Error ? it.message : "视频合成失败"
                  )
                );
              } : void 0,
              onOpenDetail: l ? () => l(r) : void 0
            }
          )
        }
      ) : ge ? /* @__PURE__ */ f(Te, { fallback: /* @__PURE__ */ f(xe, { label: "正在加载设定" }), children: /* @__PURE__ */ f(
        Rm,
        {
          workspace: r.storyboardWorkspace,
          readonly: !r.interactive,
          node: r,
          onOpenDetail: l ? () => l(r) : void 0
        }
      ) }) : F ? /* @__PURE__ */ L(
        Te,
        {
          fallback: /* @__PURE__ */ f(xe, { label: "正在加载分镜内容", compact: !0 }),
          children: [
            r.settingUpdateReason && /* @__PURE__ */ f("p", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
            /* @__PURE__ */ f(
              km,
              {
                output: z ? d?.streamOutput || d?.streamText || "" : qs(r),
                status: ve,
                completedShotCount: Number(
                  d?.streamOutput?.meta?.completed_count || 0
                ),
                targetShotCount: d?.targetCount || 0,
                workspace: r.storyboardWorkspace,
                scriptEditContext: r.interactive && ye ? {
                  projectId: a,
                  canvasId: r.canvasId,
                  node: c,
                  onSaved: (de) => r.onStoryboardScriptSaved(r.canvasId, r.id, de)
                } : void 0,
                onOpenDetail: ye && l ? (de, it) => l(r, it, de) : void 0,
                onRegenerateScreenplay: r.interactive && !z ? () => {
                  r.onRunBackendNode(r.sourceNode, {
                    storyboardAction: "screenplay"
                  });
                } : void 0,
                onConfirm: r.interactive && ye ? () => y(r.id) : void 0
              }
            )
          ]
        }
      ) : $ ? /* @__PURE__ */ f(
        Te,
        {
          fallback: /* @__PURE__ */ f(xe, { label: "正在加载分镜宫格", compact: !0 }),
          children: /* @__PURE__ */ f(
            Wp,
            {
              grid: me,
              aspectRatio: yv(r),
              running: z,
              layout: r.composerDraft?.storyboardGridLayout,
              onLayoutChange: D ? (de) => D(r.id, {
                ...r.composerDraft || {},
                storyboardGridLayout: de
              }) : void 0,
              onImport: A ? () => A(r.id) : void 0,
              onFrameImport: A ? (de, it) => A(r.id, it) : void 0,
              onSlotImport: A ? (de) => A(r.id, de) : void 0,
              onEdit: me && l ? () => l(r) : void 0
            }
          )
        }
      ) : /* @__PURE__ */ L(Gt, { children: [
        ce ? /* @__PURE__ */ f(
          nf,
          {
            preview: he,
            output: Fe,
            fallback: r.description,
            streaming: z && fe,
            videoObjectFit: r.embedded ? "contain" : "cover",
            onMediaSize: be,
            compactMediaGrid: Jl(
              r,
              he
            )
          }
        ) : /* @__PURE__ */ f(yb, {}),
        r.settingUpdateReason && /* @__PURE__ */ f("div", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
        /* @__PURE__ */ f(
          Gs,
          {
            active: z,
            message: d?.reconnecting ? "正在重新连接" : d?.statusText,
            compact: !0
          }
        )
      ] }) }),
      /* @__PURE__ */ f(
        Sm,
        {
          runTiming: r.runTiming,
          runningNode: d,
          showEstimate: !s
        }
      ),
      z
    );
  }
  return /* @__PURE__ */ L("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ f(
      qe,
      {
        id: "input-0",
        type: "target",
        position: Ke.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ f(
      qe,
      {
        id: "output-0",
        type: "source",
        position: Ke.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ f("div", { className: "ws-node-title", children: r.title }),
    /* @__PURE__ */ f("div", { className: "ws-node-desc", children: r.description }),
    /* @__PURE__ */ f(rr, { node: r, onShowNodeDetail: l }),
    /* @__PURE__ */ f(bn, { node: r, selected: t })
  ] });
}
function tf(e, t) {
  return Sc(e.data, t.data) && e.selected === t.selected;
}
function Sc(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.teamId === t.teamId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && e.canvasRun === t.canvasRun && e.canvasRunStopping === t.canvasRunStopping && Wl(e.groupMembers, t.groupMembers) && Mv(e.groupRuntime, t.groupRuntime) && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && ub(
    e.storyboardWorkspace,
    t.storyboardWorkspace
  ) && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && Nv(e.inputContext, t.inputContext);
}
function ub(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.stopping === t.stopping && e.executionStatus === t.executionStatus && e.currentNodeTitle === t.currentNodeTitle && e.settingSource?.title === t.settingSource?.title && e.settingSource?.onOpen === t.settingSource?.onOpen && e.onReferenceResult === t.onReferenceResult && e.runBlockedReason === t.runBlockedReason && !!e.onStop == !!t.onStop && lb(e.groups, t.groups);
}
function lb(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n.id === s.id && n.title === s.title && n.materialType === s.materialType && n.memberCount === s.memberCount && n.runnableCount === s.runnableCount && n.completedCount === s.completedCount && n.failedCount === s.failedCount && n.status === s.status && n.runBlockedReason === s.runBlockedReason && n.stopping === s.stopping && !!n.onRun == !!s.onRun && !!n.onStop == !!s.onStop && fb(n.results, s.results);
  });
}
function fb(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n.nodeId === s.nodeId && n.status === s.status && Sc(n.node, s.node);
  });
}
function pb(e, t) {
  return e === t || e.id === t.id && e.type === t.type && e.position.x === t.position.x && e.position.y === t.position.y && e.selected === t.selected && e.className === t.className && e.draggable === t.draggable && e.deletable === t.deletable && e.selectable === t.selectable && e.connectable === t.connectable && e.focusable === t.focusable && e.zIndex === t.zIndex && e.dragHandle === t.dragHandle && e.initialWidth === t.initialWidth && e.initialHeight === t.initialHeight && e.style?.width === t.style?.width && e.style?.height === t.style?.height ? e === t ? !0 : Sc(
    e.data,
    t.data
  ) : !1;
}
function mb({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: o } = Mm(e, t), { summary: s } = Am(o), r = Ao(t.resultOutput) ? t.resultOutput : {}, i = Ao(r.meta) ? r.meta : {}, c = t.kind === "video" || t.power?.kind === "video" ? "条视频" : "张", a = i.partial === !0 && i.requested_count ? `本次已生成 ${Number(i.generated_count) || 0}/${Number(i.requested_count)} ${c} · ` : t.asset ? "本次失败，显示上次结果 · " : "", d = /* @__PURE__ */ L(Gt, { children: [
    /* @__PURE__ */ f(xu, { size: 14 }),
    /* @__PURE__ */ L("span", { children: [
      a,
      s
    ] })
  ] });
  return n ? /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "ws-node-run-error is-action nodrag nowheel",
      "aria-label": `打开错误详情：${s}`,
      onClick: (l) => {
        l.stopPropagation(), n();
      },
      children: d
    }
  ) : /* @__PURE__ */ f("div", { className: "ws-node-run-error", children: d });
}
function nf({
  preview: e,
  output: t,
  fallback: n,
  streaming: o,
  generating: s = !1,
  videoObjectFit: r = "contain",
  onMediaSize: i,
  showMediaCaption: c = !0,
  compactMediaGrid: a = !1
}) {
  const d = ne(null), l = ne(!0), y = c ? gr(e) : "", v = lr(t, e), b = us(e), I = !!(a && fu(t, b));
  return ue(() => {
    if (!o) {
      l.current = !0;
      return;
    }
    const R = d.current;
    !R || !l.current || (R.scrollTop = R.scrollHeight);
  }, [e.text, o]), !v && e.imageUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Ta,
          {
            src: e.imageUrl,
            alt: y || "生成图片",
            onMediaSize: i
          }
        ),
        y ? /* @__PURE__ */ f("p", { children: y }) : null,
        /* @__PURE__ */ f(Gs, { active: s })
      ]
    }
  ) : !v && e.videoUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Xs,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            ariaLabel: y || "生成视频",
            objectFit: r,
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: i
          },
          e.videoUrl
        ),
        y ? /* @__PURE__ */ f("p", { children: y }) : null,
        /* @__PURE__ */ f(Gs, { active: s })
      ]
    }
  ) : !v && e.audioUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media is-audio ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Te,
          {
            fallback: /* @__PURE__ */ f(xe, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ f(yu, { src: e.audioUrl, autoPlay: o })
          }
        ),
        /* @__PURE__ */ f(Gs, { active: s })
      ]
    }
  ) : !v && e.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ f(Va, { size: 16 }),
    /* @__PURE__ */ f("span", { children: y || "文件内容" })
  ] }) : /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${I ? "is-compact-media-grid" : ""}`,
      onScroll: (R) => {
        const k = R.currentTarget;
        l.current = k.scrollHeight - k.scrollTop - k.clientHeight < 12;
      },
      children: /* @__PURE__ */ f(
        fr,
        {
          output: t,
          fallback: e.text || n,
          streaming: o,
          mediaGridKind: b,
          compactMediaGrid: I,
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function Ta({
  src: e,
  alt: t,
  className: n,
  onMediaSize: o
}) {
  const [s, r] = K(e);
  return ue(() => {
    if (!e || e === s)
      return;
    let i = !0;
    const c = new Image();
    return c.onload = () => {
      (c.decode?.() || Promise.resolve()).catch(() => {
      }).then(() => {
        i && r(e);
      });
    }, c.src = e, () => {
      i = !1, c.onload = null;
    };
  }, [s, e]), /* @__PURE__ */ f(
    "img",
    {
      src: s,
      alt: t,
      className: n,
      loading: "lazy",
      decoding: "async",
      onLoad: (i) => o?.(
        i.currentTarget.naturalWidth,
        i.currentTarget.naturalHeight
      )
    }
  );
}
function Gs({
  active: e,
  message: t = "生成中",
  compact: n = !1
}) {
  return e ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-media-generating nodrag nopan nowheel ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      title: t,
      onPointerDown: (o) => o.stopPropagation(),
      onClick: (o) => o.stopPropagation(),
      children: [
        /* @__PURE__ */ f(Mo, { size: n ? 12 : 18, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: t })
      ]
    }
  ) : null;
}
function gr(e) {
  const t = String(e.text || "").trim();
  return !t || _n(t) ? "" : t;
}
function gb(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, o = 330, s = 340;
  let r = o, i = r / n;
  return i > s && (i = s, r = i * n), {
    width: Math.round(qd(r, 150, o)),
    height: Math.round(qd(i, 150, s))
  };
}
function Ws(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (o, s) => {
      const r = gb(o, s);
      if (!r)
        return;
      const i = {
        width: r.width,
        height: r.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function qd(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function yb() {
  return /* @__PURE__ */ L("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {})
  ] });
}
function hb(e) {
  return wb(e.data);
}
function wb(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function vb() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function bb() {
  return typeof window > "u" ? 0 : Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0
  );
}
function sr(e) {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  e > 0 ? t.searchParams.set("canvas_id", String(e)) : t.searchParams.delete("canvas_id"), window.History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    t
  );
}
function Nb(e) {
  if (typeof window > "u")
    return !1;
  try {
    return hp(
      window.localStorage.getItem(
        `${eu}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function Ib() {
  if (typeof window > "u")
    return Bi;
  try {
    return tu(
      Number(
        window.localStorage.getItem(nu) || Bi
      )
    );
  } catch {
    return Bi;
  }
}
function Gd(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
export {
  $b as WorkSpacePage
};
