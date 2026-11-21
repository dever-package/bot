import { a as U, j as f, F as Gt, u as Bf } from "./preloadable-CnUP9jgB.js";
import { a5 as Ta, a6 as Ro, a7 as Gn, a8 as wr, a9 as pn, aa as zf, ab as qd, ac as Tt, n as Oc, l as Qr, ad as Uf, ae as Gd, af as Wd, x as Ma, z as Fc, m as Hd, ag as Bc, ah as zc, ai as Lf, aj as $f, ak as Vf, al as jf, am as Di, an as Kf, ao as qf, ap as Gf, aq as Uc, ar as Wf, as as Lr, at as nr, au as Lc, av as Pi, aw as Hf, ax as Yd, y as Yf, A as qr, h as Jf, i as Jd, ay as Xf, az as Zf, aA as Qf, aB as Ei, aC as $c, aD as Hs, s as Vc, aE as jc, aF as ep, aG as tp, aH as np, aI as op, aJ as rp, aK as Kc, aL as sp, aM as Oi, aN as ip, aO as ap, F as ta, aP as cp, aQ as dp, aR as up, aS as lp, aT as fp, aU as na, aV as pp, aW as mp } from "./writing-reference-CGBoN4Mc.js";
import { m as Mo, l as Aa, q as Xd, j as gp, s as yp, t as hp, S as Zd, u as Fi, e as Qd, v as eu, r as Hn, c as wp, w as vp } from "./space-assistant-layout-B9KyeCM0.js";
import { p as jt, o as ci, g as Da, j as tu, k as bp, T as Np, U as Ip, V as Ys, W as es, X as Cp, l as nu, Y as Sp, Z as _p, _ as Rp, $ as oa, a0 as qc } from "./asset-preview-DonyTaaN.js";
import { n as kp, o as ou, p as Pa, S as Js, q as xp, r as Tp, f as Mp, s as Ap, l as ru, t as su, u as Qt, w as ir, x as Vs, y as Dp, z as ds, i as Nn, c as Pp, A as In, B as Bi, C as vr, D as ko, d as ht, E as iu, F as ar, G as jn, H as Gc, I as zi, J as Ep, K as Op, L as au, M as cu, N as Fp, O as Bp, P as zp, Q as du, R as Up, T as Lp, U as Ea, W as $p, X as Vp, Y as jp, Z as Kp } from "./space-story-setting-reference-CenSO-Ot.js";
import { o as qp, s as di, c as lr, C as fr, b as us, P as Xs, i as Gp, d as uu, e as Wp } from "./space-content-view-YfCrbd08.js";
import { E as Wc, F as Fs, d as lu, B as mt, G as Oe, H as Mt, e as Hp, I as fu, J as Yp, K as ls, L as wo, M as fs, N as ps, O as vo, p as Ve, l as Jp, s as At, P as ms, Q as pu, h as Xp, R as ra, S as Zp, T as Qp, U as Bs, V as bo, W as em, r as Oa, f as Zs, X as mu } from "./asset-audio-preview-CsYcyVm8.js";
import { e as Hc, j as Yc, s as tm, k as nm, l as om, S as rm, C as ke, m as sm, o as im, q as am, t as cm, A as Jc, v as dm, w as um, x as lm, y as gu, z as fm, B as pm, D as mm, E as ts, F as yu, p as gm, c as ym, G as hm, H as wm, u as vm, r as bm, I as Nm, W as Im, a as Cm, V as Sm, J as _m, K as Rm, b as km, L as xm, M as Tm } from "./node-detail-header-MEc7Zf1L.js";
import { n as hu, o as Mm, q as or, r as Am, t as Dm, m as sa, c as Pm, v as Em, x as Om, y as Fm, a as Bm, b as zm } from "./writing-run-labels-xukZ9QE8.js";
import { i as Vt, c as Fa, S as qn, o as wu } from "./space-node-runtime-694G12tD.js";
import { b as ne, a as K, d as ue, h as F, u as re, l as ns, S as xe, r as Ba, p as Um, o as vu } from "./file-kind-Cq3pESGF.js";
import { N as Lm, n as $m, g as Vm, B as Xc, E as jm, a as Km, b as qm, i as Gm, M as Wm, c as Hm, P as Ke, H as Ym } from "./interaction-SMvIaTBF.js";
import { k as za, q as bu, s as Jm, ag as Xm, h as Zm, m as Qm, aX as eg, aY as Nu, a4 as tg, aw as Iu, P as Cu, L as ia, c as ng, aZ as og, r as xo, j as Ua, i as rg, C as La, b as $a, a_ as sg, X as Su, A as ig, z as ag, ah as cg, a$ as dg, b0 as ug, aU as lg, b1 as fg, l as pg, W as mg, a8 as Zc, a9 as Qc, a7 as gg, b2 as yg, e as _u, x as Ru } from "./vendor-icons-B8sieP24.js";
import { t as hg, r as Gr } from "./asset-upload-progress-BKzeQB8G.js";
import { u as wg } from "./project-dialogs-R99LKmGe.js";
import { L as Va, a as vg, M as ku, y as bg, z as Ng, N as Ig, B as Cg, A as xu, O as Sg } from "./space-media-references-Be8W1aSO.js";
import { P as _g } from "./power-icon-BQMmKgyk.js";
import { n as Rg, i as kg } from "./text-content-save-actions-0xSf1irm.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-CoT07toq.css", import.meta.url).href]);
function xg(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, s = [e.asset?.version, ...e.asset?.versions || []].find(
    (r) => r && r.id === n && r.asset_id === t
  );
  return s ? Hc(e, s, {
    includeNodeResult: !1
  }) : Hc({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
const ed = 160, td = 72, nd = 72, Qs = 72, os = 24, rs = 24, ss = 40, No = 2, ei = { width: 180, height: 180 }, Tg = "storyboard-derived-layout-v7";
function Tu(e) {
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
  ), d = i.length ? e.sourceNode.y - a - nd : e.sourceNode.y, l = e.sourceNode.x - ed;
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
    }), y += I.size.height + nd;
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
    }), v += I.size.width + td;
  let b = e.sourceNode.x + e.sourceNode.width + ed;
  for (const I of c)
    n.set(I.key, {
      bounds: {
        x: b,
        y: e.sourceNode.y,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), b += I.size.width + td;
  return n;
}
function Mg(e, t, n) {
  const o = t.filter((c) => c.groupId === e.id), s = n.kind === "audio", r = s ? n.width : Math.max(ei.width, n.width), i = s ? n.height : Math.max(ei.height, n.height);
  for (let c = 0; c < o.length + 100; c += 1) {
    const a = c % No, d = Math.floor(c / No), l = {
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
function Mu(e, t) {
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
    const c = i % No, a = Math.floor(i / No);
    s.set(r.id, {
      x: e.x + os + c * (o.width + rs),
      y: e.y + Qs + a * (o.height + ss)
    });
  }), {
    ...Au(t.length, o),
    positions: s
  };
}
function Ag(e) {
  return Ta(e || void 0);
}
function Dg(e) {
  const t = Ag(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return Au(e.itemCount, t);
}
function Au(e, t) {
  const n = Math.max(1, Math.ceil(e / No));
  return {
    width: os * 2 + t.width * No + rs * (No - 1),
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
const Du = "storyboard-soundtrack", Og = 0.35;
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
    const c = Pu({
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
function Pu(e) {
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
  }), s = e.current?.storyboardBaseline, r = Da(e.storyboard), i = ca(
    o.clips,
    s?.clips || [],
    e.current?.clips || [],
    (a, d, l) => Bg(a, d, l, r)
  ), c = ca(
    o.audioTracks,
    s?.audioTracks || [],
    e.current?.audioTracks || [],
    (a, d, l) => aa(a, d, l, [
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
    audioTracks: r ? c.filter((a) => a.id === Du).map((a) => ({ ...a, volume: 1, kind: "music" })) : c,
    storyboardBaseline: {
      clips: o.clips.map(Eu),
      audioTracks: o.audioTracks
    }
  };
}
function Bg(e, t, n, o) {
  const s = aa(e, t, n, [
    "title",
    "visualVideo",
    "originalAudioSource",
    "duration",
    "originalVolume",
    "useOriginalVideo"
  ]);
  return s.speechTracks = o ? [] : ca(
    e.speechTracks,
    t?.speechTracks || [],
    n.speechTracks,
    (r, i, c) => aa(r, i, c, [
      "audio",
      "startTime",
      "sourceStart",
      "fit",
      "kind",
      "characterId",
      "text",
      "volume"
    ])
  ), s.subtitleTracks = e.subtitleTracks, Eu(s);
}
function Eu(e) {
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
    blockingIssues: ou(t)
  };
}
function aa(e, t, n, o) {
  if (!t) return e;
  const s = { ...e };
  for (const r of o)
    JSON.stringify(n[r]) !== JSON.stringify(t[r]) && (s[r] = n[r]);
  return s;
}
function ca(e, t, n, o) {
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
      id: Du,
      ...n > 0 && o > 0 ? {
        audio: { assetId: n, versionId: o, label: t.label || "主音轨" }
      } : {},
      startTime: 0,
      sourceStart: (e.storyboard_range_start_ms || 0) / 1e3,
      kind: "music",
      volume: Da(e) ? 1 : 0.35,
      fit: "trim",
      loop: !1,
      fadeOut: Lg(e) ? 0 : 1
    }
  ];
}
function Ug(e, t, n) {
  return tu(e) ? Ip(e).map(({ speech: o, startTime: s }) => {
    const r = ja(ui(n, t, "speech", o.id));
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
  ), n = ja(t), o = !!e.current?.useOriginalVideo, s = tu(e.storyboard), r = s ? e.shot.speech.filter((I) => I.kind === "dialogue" && I.text.trim()).map(
    (I) => qg(e.nodes, e.sourceNodeId, I)
  ) : [], i = bp(e.storyboard) ? Kg(e.nodes, e.sourceNodeId, e.shot.id) : [], c = n, a = e.storyboard.shots[e.index + 1], d = Np(e.storyboard), l = d && (e.shot.speech.length > 0 || (a?.speech.length ?? 0) > 0), y = a && !a.continue_previous && !l && !Da(e.storyboard) && a.handoff?.sound_lead_ms || 0, v = {
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
    blockingIssues: ou(b)
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
  const o = ui(e, t, "subtitle", n), s = Wc(o?.resultOutput);
  return (Array.isArray(s.tracks) ? s.tracks : []).flatMap((i) => {
    const c = Wc(i), a = Fs(c.id), d = Fs(c.text);
    if (!a || !d)
      return [];
    const l = od(c.end_time ?? c.endTime), y = Fs(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: d,
        startTime: Math.max(
          0,
          od(c.start_time ?? c.startTime)
        ),
        ...l > 0 ? { endTime: l } : {},
        ...y ? { speechId: y } : {},
        source: Fs(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function qg(e, t, n) {
  const o = ui(e, t, "speech", n.id), s = ja(o);
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
function ja(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), o = t && n ? t : Number(e?.asset?.id || 0), s = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!o || !s))
    return {
      assetId: o,
      versionId: s,
      label: e?.title || "素材"
    };
}
function od(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
const Ou = "invalidated";
function Ka(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, o = {};
  return mo(o, "execution_id", e?.execution_id), mo(o, "run_id", e?.run_id || n?.run_id), Ui(o, "request_id", e?.request_id), mo(o, "flow_run_id", e?.flow_run_id), mo(
    o,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), mo(o, "asset_id", e?.asset_id || t?.id), mo(
    o,
    "version_id",
    e?.version_id || n?.id || t?.version_id
  ), mo(
    o,
    "release_id",
    e?.release_id || n?.release_id
  ), Ui(o, "role", e?.role || t?.role), Ui(o, "status", e?.status), Object.keys(o).length > 0 && (o.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(o).length > 0 ? o : void 0;
}
function Gg(e, t, n, o = !0) {
  const s = o || e?.resultRef?.status === Ou || rd(e, n), r = e?.resultRef;
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
  return rd(e, n);
}
function rd(e, t) {
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
function mo(e, t, n) {
  const o = Number(n || 0);
  o > 0 && (e[t] = o);
}
function Ui(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
function sd(e) {
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
function id(e) {
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
function Li(e) {
  const t = e?.resultRef;
  return t?.execution_id ? `execution:${t.execution_id}` : t?.run_id ? `run:${t.run_id}` : "";
}
function da(e, t, n, o) {
  const s = new Map(t.map((y) => [y.id, y])), r = /* @__PURE__ */ new Set(), i = (y) => y.storyboardItem?.sourceNodeId === n;
  for (const y of e) {
    if (!i(y)) continue;
    const v = y.storyboardItem.itemType;
    if (!["character", "scene", "prop", "shot_image", "shot", "speech", "subtitle"].includes(v)) continue;
    const b = s.get(y.id);
    (!b || JSON.stringify(sd(y)) !== JSON.stringify(sd(b))) && r.add(y.id);
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
      for (const _ of c.get(b[R]) || [])
        I.has(_) || s.get(b[R])?.storyboardItem?.itemType === "shot_image" && s.get(_)?.storyboardItem?.itemType === "shot_image" || (I.add(_), !(v && Li(s.get(_)) === v) && (r.add(_), b.push(_)));
  };
  d(r);
  for (const y of o || []) {
    if (!y.storyboardItem) continue;
    const v = s.get(y.id);
    if (!v || id(y) === id(v)) continue;
    const b = Li(v), I = !Hg(y) || b !== Li(y) ? b : "";
    d([v.id], I);
  }
  let l = !1;
  return t.forEach((y, v) => {
    if (!r.has(y.id)) return;
    const b = Fu(y);
    b !== y && (t[v] = b, l = !0);
  }), l;
}
function Fu(e) {
  if (!e.asset && !e.resultRef && e.resultOutput == null) return e;
  const t = { ...e };
  if (delete t.asset, e.resultRef) {
    const { asset_id: n, version_id: o, ...s } = e.resultRef;
    t.resultRef = { ...s, status: Ou };
  }
  return delete t.resultOutput, delete t.resultView, t;
}
function Yg(e, t) {
  return e ? t ? "materialize" : "defer-materialize" : "refresh";
}
function Jg(e, t, n, o) {
  return !t || ua(e, t) !== ua(n, o);
}
function ua(e, t) {
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
  return !!e.storyboardItem && Mm(
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
  } : void 0, i = t.filter((b) => s.has(b.id)).map((b) => Uu(b, r, e.storyboardItem?.sourceNodeId)).filter((b) => !!b), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = Gn(
    e.composerDraft?.promptContent
  ).filter((b) => c.has(b.refId)), d = t.find(
    (b) => b.id === e.storyboardItem?.sourceNodeId
  ), y = ((d ? jt([
    d.asset?.version?.content,
    d.resultOutput
  ]) : null)?.references || []).filter((b) => c.has(b.asset_id)).map(Lu), v = [
    ...i,
    ...a,
    ...y
  ];
  return {
    ...e.composerDraft || {},
    prompt: "",
    promptContent: v.length ? wr("", v) : void 0,
    paramValues: ju(
      e.composerDraft?.paramValues,
      o,
      ""
    )
  };
}
function Cn(e, t, n) {
  const o = ld(n);
  return e.find(
    (s) => Number(s.id || 0) > 0 && String(s.kind || "").trim().toLowerCase() === t && ld(s.outputType) === o
  ) || null;
}
function ad(e) {
  return Bu(e, "materialize");
}
function $i(e) {
  return Bu(e, "refresh");
}
function Bu(e, t) {
  let n = e.canvas;
  const o = e.sourceNodeIds ? new Set(e.sourceNodeIds) : null;
  for (const s of e.canvas.nodes) {
    if (t === "materialize" && s.id !== e.sourceNodeId || t === "refresh" && o?.has(s.id) === !1)
      continue;
    if (s.type === "power" && s.outputType === "setting") {
      n = yy({ canvas: n, settingNode: s, assetCate: e.assetCate, powers: e.powers });
      continue;
    }
    if (s.type !== "power" || !Mo(
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
      n = dd({
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
    }) : dd({
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
function cd(e, t) {
  if (e?.outputType === "setting") {
    const r = di({ ...e, ...t });
    return !!(r && e.storyboardMaterializedSignature !== De(JSON.stringify(r)));
  }
  if (!e || e.type !== "power" || !Mo(e.power, e.kind, e.outputType))
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
  return De(ua(e, t));
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
function dd(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Map();
  t.forEach((c, a) => {
    const d = c.storyboardItem;
    d?.sourceNodeId === e.storyboardNode.id && n.set(
      pr(d.sourceNodeId, d.itemType, d.itemId),
      a
    );
  });
  let o = !1;
  const s = Pa(
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
    const a = c.local ? null : Cn(e.powers, c.powerKind, c.outputType);
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
      const y = zu(
        d,
        t,
        e.storyboardNode.id,
        s,
        e.storyboard
      ), v = t[l], b = Ga(
        v,
        v.groupId || "",
        y,
        c,
        a,
        { preserveStructure: !0, nodes: t }
      );
      b !== v && (t[l] = b, o = !0);
    }
    (c.itemType === "shot_image" || c.itemType === "shot") && (o = da(
      e.canvas.nodes,
      t,
      e.storyboardNode.id,
      e.previousNodes
    ) || o);
  }
  if (nu(e.storyboard)) {
    const c = Wu({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Cn(e.powers, "video", "video_compose"),
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
    Js.map((_) => _.itemType)
  ), r = Pa(
    n,
    e.canvas.edges,
    e.storyboardNode.id
  ), i = {
    framePlanVersion: t,
    settingItemKeys: new Set(r.keys())
  }, c = Js.filter(
    (_) => _.enabled(e.storyboard, i)
  ), a = nu(
    e.storyboard
  );
  s.add("video_compose"), a && o.add(
    pr(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const d = c.map((_) => ({
    spec: _,
    items: _.items(e.storyboard, i),
    power: _.local ? null : Cn(e.powers, _.powerKind, _.outputType)
  }));
  for (const { items: _ } of d)
    for (const M of _)
      o.add(
        pr(e.storyboardNode.id, M.type, M.id)
      );
  let l = !1;
  for (let _ = n.length - 1; _ >= 0; _ -= 1) {
    const M = n[_].storyboardItem;
    !M || M.sourceNodeId !== e.storyboardNode.id || !s.has(M.itemType) || o.has(
      pr(
        M.sourceNodeId,
        M.itemType,
        M.itemId
      )
    ) || (n.splice(_, 1), l = !0);
  }
  const y = Tu({
    sourceNode: e.storyboardNode,
    groups: d.map(({ spec: _, items: M, power: A }) => ({
      key: _.key,
      layoutIndex: _.layoutIndex,
      itemCount: M.length,
      power: A,
      powerKind: _.powerKind,
      direction: _.direction
    }))
  });
  let v = Ro(n, e.canvas.nextNodeNo);
  l = l || v !== e.canvas.nextNodeNo;
  for (const { spec: _, items: M, power: A } of d) {
    const O = y.get(_.key);
    if (!O)
      continue;
    const $ = $u({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: _,
      layout: O,
      assetCate: e.assetCate
    });
    l = l || $.changed;
    for (const he of M) {
      const V = zu(
        he,
        n,
        e.storyboardNode.id,
        r,
        e.storyboard
      ), X = n.findIndex(
        (Z) => yr(
          Z,
          e.storyboardNode.id,
          V.type,
          V.id
        )
      );
      if (X >= 0) {
        const Z = n[X], ge = Ga(
          Z,
          $.node.id,
          V,
          _,
          A,
          { nodes: n }
        );
        ge !== Z && (n[X] = ge, l = !0);
        continue;
      }
      const L = Vu({
        nodes: n,
        group: $.node,
        storyboardNode: e.storyboardNode,
        item: V,
        assetCate: e.assetCate,
        spec: _,
        power: A
      });
      L.nodeNo = v++, n.push(L), l = !0;
    }
    (_.itemType === "shot_image" || _.itemType === "shot") && (l = da(
      e.canvas.nodes,
      n,
      e.storyboardNode.id
    ) || l);
    const oe = M.map(
      (he) => n.find(
        (V) => V.groupId === $.node.id && yr(
          V,
          e.storyboardNode.id,
          he.type,
          he.id
        )
      )
    ).filter((he) => !!he), Y = Mu(
      $.node,
      oe
    );
    for (const he of oe) {
      const V = Y.positions.get(he.id);
      if (!V || he.x === V.x && he.y === V.y)
        continue;
      const X = n.indexOf(he);
      n[X] = { ...he, ...V }, l = !0;
    }
    const ie = n.findIndex((he) => he.id === $.node.id), P = n[ie];
    (P.width !== Y.width || P.height !== Y.height) && (n[ie] = {
      ...P,
      width: Y.width,
      height: Y.height
    }, l = !0);
  }
  const b = new Set(c.map((_) => _.key));
  for (let _ = n.length - 1; _ >= 0; _ -= 1) {
    const M = n[_];
    M.type !== "group" || M.group?.origin !== "script" || M.group.sourceNodeId !== e.storyboardNode.id || !M.group.syncKey || b.has(
      M.group.syncKey
    ) || (n.splice(_, 1), l = !0);
  }
  l = da(
    e.canvas.nodes,
    n,
    e.storyboardNode.id
  ) || l;
  const I = a ? Wu({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Cn(e.powers, "video", "video_compose"),
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
function zu(e, t, n, o, s) {
  const r = s.chapter_boundary, i = s.shots[0], c = r && e.shotId === i?.id && (r.connection === "continue" ? e.type === "shot" || e.type === "shot_image" && e.frameRole === "end" : e.type === "shot_image" && e.frameRole === "start");
  c && e.type === "shot" && (e = { ...e, sharedStartShotId: r.shot_id });
  const a = (O) => (O || []).map(
    ($) => t.find(
      (oe) => yr(oe, n, $.type, $.id)
    ) || o.get(xp($.type, $.id))
  ).filter(($) => !!$), d = (e.dependencyItems || []).map(
    (O) => a([O])[0]?.id || "script-item-" + De([n, O.type, O.id].join("\0"))
  ), l = a(e.referenceItems), y = l.map((O) => O.id);
  if (c && r) {
    const O = Sp(r.shot_id, "end"), $ = t.find(
      (Y) => yr(Y, r.node_id, "shot_image", O)
    ), oe = $?.id || "script-item-" + De([r.node_id, "shot_image", O].join("\0"));
    d.unshift(oe), y.unshift(oe), $ && l.unshift($);
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
  ), R = I === e.prompt ? b : { ...b, prompt: I }, _ = v.map(
    Lu
  );
  if (_.push(
    ...l.map((O) => Uu(O, e, n)).filter((O) => !!O)
  ), !_.length)
    return R;
  const M = wr(
    I,
    _
  ), A = zf(M);
  return qd(M) ? { ...b, prompt: A, promptContent: M } : { ...R, prompt: A };
}
function ny(e, t, n = []) {
  const o = [], s = /* @__PURE__ */ new Set();
  for (const r of n) {
    const i = Oc(r.label), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  for (const r of t) {
    const i = Oc(r.title), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  return [o.join(" "), e].filter(Boolean).join(" ").trim();
}
function Uu(e, t, n) {
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
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? i === "references" ? "reference" : oa(e.storyboardItem.frameRole) : void 0
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
          usage: r ? "firstFrame" : oa(c.frameRole)
        }))
      };
    }
    return {
      mediaItems: n.map((r) => ({
        url: "",
        index: r.mediaIndex,
        usage: oa(r.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = qc(n, "end") || qc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function Lu(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function $u(e) {
  const t = qa(
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
  const n = e.layout.bounds, o = pn("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return o.id = Ha(
    e.nodes,
    `script-group-${De(e.storyboardNode.id)}-${e.spec.key}`
  ), o.title = e.spec.title, o.width = n.width, o.height = n.height, o.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(o), { node: o, changed: !0 };
}
function qa(e, t, n) {
  return e.find(
    (o) => o.type === "group" && o.group?.origin === "script" && o.group.sourceNodeId === t && o.group.syncKey === n
  );
}
function Vu(e) {
  const t = pn(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = Ha(
    e.nodes,
    `script-item-${De(
      pr(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Ta({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${my(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: "",
    promptContent: Ku(
      "",
      void 0,
      e.item.promptContent
    ),
    paramValues: e.item.paramValues
  }, t.storyboardItem = qu(
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
function Ga(e, t, n, o, s, r = {}) {
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
  ), I = Ku(
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
  ), R = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(I || null), _ = qu(i.sourceNodeId, n), M = r.preserveStructure && e.titleMode === "manual" ? e.title : n.title, A = e.title !== M, O = i.generatedPrompt !== n.prompt, $ = r.preserveStructure ? e.groupId || "" : t, oe = !e.power && !!s, Y = e.kind !== o.powerKind, ie = e.outputType !== o.outputType, P = o.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === $ && !d && !y && !R && !A && !oe && !Y && !ie && !P && Gu(i, _) ? e : {
    ...e,
    title: M,
    kind: o.powerKind,
    outputType: o.outputType,
    ...oe ? {
      power: s || void 0,
      subtitle: s?.output?.name || s?.name || e.subtitle
    } : {},
    description: O || oe ? n.prompt : e.description,
    ...o.local ? { resultOutput: n.localOutput } : {},
    groupId: $,
    composerDraft: d || y || R ? {
      ...e.composerDraft || {},
      prompt: a,
      promptContent: I,
      paramValues: l
    } : e.composerDraft,
    storyboardItem: _
  };
}
function ju(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let o;
  for (const [s, r] of Object.entries(e))
    r === t && (o ||= { ...e }, o[s] = n);
  return o || e;
}
function ry(e, t, n, o, s, r = !1) {
  let i = ju(
    e,
    t,
    n
  );
  for (const [c, a] of Object.entries(o || {}))
    r && c === "voice" && String(e?.voice || "") !== String(s || "") || i?.[c] !== a && (i = { ...i || {}, [c]: a });
  return r && !o?.voice && s && e?.voice === s && (i = { ...i || {} }, delete i.voice), i;
}
function Ku(e, t, n, o, s = []) {
  const r = Gn(n), i = Gn(o);
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
  ), d = Gn(t), l = new Set(d.map($r)), y = d.flatMap((v) => {
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
  const o = n.find((a) => a.id === t.originID), s = o?.kind, r = o && (s === "image" || s === "video" || s === "audio") ? lu(xg(o), s) : [], i = (a, d) => {
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
  const n = new Set(e.storyboardItem?.referenceNodeIds || []), o = Gn(
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
    Gn(t.promptContent).map(
      (l) => l.refId
    )
  ), a = new Set(s?.externalReferenceAssetIds || []), d = Gn(o).filter(
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
function qu(e, t) {
  return {
    sourceNodeId: e,
    itemType: t.type,
    itemId: t.id,
    generatedPrompt: t.prompt,
    generatedInputs: {
      referenceContent: qd(t.promptContent) ? wr(
        "",
        Gn(t.promptContent)
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
function Gu(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && JSON.stringify(e.generatedInputs || null) === JSON.stringify(t.generatedInputs || null) && go(e.dependencyNodeIds, t.dependencyNodeIds) && go(e.referenceNodeIds, t.referenceNodeIds) && go(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && go(e.frameMediaItems, t.frameMediaItems) && go(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && go(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && go(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && e.sharedEndShotId === t.sharedEndShotId && e.sharedStartShotId === t.sharedStartShotId && !!e.optional == !!t.optional;
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
  ), r = `script-edge-${De(n)}-`, i = e.filter((a) => !a.id.startsWith(r));
  for (const { spec: a, group: d } of s) {
    const l = a.direction === "upstream", y = (a.sourceGroupKeys || []).map((b) => qa(t, n, b)).filter((b) => !!b), v = l ? [d] : y.length ? y : [t.find((b) => b.id === n)].filter(
      (b) => !!b
    );
    for (const b of v) {
      const I = b.id, R = l ? n : d.id;
      i.push({
        id: Ya(i, `${r}${a.key}-${De(I)}`),
        from: I,
        to: R,
        logicalFrom: I,
        logicalTo: R,
        purpose: "structure",
        executionMode: l ? void 0 : "manual"
      });
    }
  }
  const c = Tt(t, i);
  return Wa(e, c) ? e : c;
}
function ly(e, t, n, o) {
  const s = `script-item-edge-${De(n)}-`, r = e.filter((d) => !d.id.startsWith(s)), i = t.filter(
    (d) => d.storyboardItem?.sourceNodeId === n && (!!d.groupId || d.storyboardItem.itemType === "video_compose")
  ), c = new Map(
    [...o.values(), ...i].map((d) => [d.id, d])
  );
  for (const d of i)
    for (const l of d.storyboardItem?.dependencyNodeIds || []) {
      const y = c.get(l);
      !y || y.id === d.id || r.push({
        id: Ya(
          r,
          `${s}${De(y.id)}-${De(d.id)}`
        ),
        from: y.id,
        to: d.id,
        logicalFrom: y.id,
        logicalTo: d.id,
        purpose: "dependency",
        executionMode: y.groupId && y.groupId === d.groupId ? void 0 : "manual"
      });
    }
  const a = Tt(t, r);
  return Wa(e, a) ? e : a;
}
function Wu(e) {
  const t = e.nodes.find(
    (i) => yr(
      i,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = Pu({
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
    const i = e.preservePosition ? { x: t.x, y: t.y } : ud(e.nodes, e.storyboardNode), c = !t.power && !!e.power, a = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), d = t.x !== i.x || t.y !== i.y;
    if (!c && !a && !d && t.kind === "video" && t.outputType === "video_compose" && Gu(t.storyboardItem, o))
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
    }, y = t.composerDraft?.videoComposition, b = y && JSON.stringify([y.clips, y.audioTracks, y.settings]) !== JSON.stringify([n.clips, n.audioTracks, n.settings]) ? Fu(l) : l;
    return e.nodes[e.nodes.indexOf(t)] = b, {
      node: b,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const s = ud(
    e.nodes,
    e.storyboardNode
  ), r = pn(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return r.id = Ha(
    e.nodes,
    `script-compose-${De(e.storyboardNode.id)}`
  ), r.nodeNo = e.nextNodeNo, r.title = "视频合成", r.kind = "video", r.outputType = "video_compose", r.description = "按镜头顺序合成画面、原声和配音。", e.power || (r.subtitle = "未配置视频合成能力", r.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), r.composerDraft = { videoComposition: n }, r.storyboardItem = o, e.nodes.push(r), {
    node: r,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function ud(e, t) {
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
  ).map((l) => qa(t, n, l)).filter((l) => !!l), c = `script-compose-edge-${De(n)}-`, a = e.filter((l) => !l.id.startsWith(c));
  for (const l of i.length ? i : t.filter((y) => y.id === n))
    a.push({
      id: Ya(a, `${c}${De(l.id)}`),
      from: l.id,
      to: o,
      logicalFrom: l.id,
      logicalTo: o,
      purpose: "dependency",
      executionMode: "manual"
    });
  const d = Tt(t, a);
  return Wa(e, d) ? e : d;
}
function py(e, t) {
  const n = `script-compose-edge-${De(t)}-`, o = e.filter((s) => !s.id.startsWith(n));
  return o.length === e.length ? e : o;
}
function Wa(e, t) {
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
function Ha(e, t) {
  return Hu(new Set(e.map((n) => n.id)), t);
}
function Ya(e, t) {
  return Hu(new Set(e.map((n) => n.id)), t);
}
function Hu(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function De(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function ld(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function my(e) {
  return e.outputType === "speech" ? "语音合成" : e.powerKind === "image" ? "图片" : "视频";
}
function go(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function Ja(e) {
  return Aa(e.power, e.kind, e.outputType) && Qr(e, e.resultOutput)?.document || null;
}
function la(e, t) {
  const n = e.edges.find((o) => (o.logicalFrom || o.from) === t && e.nodes.some((s) => s.id === (o.logicalTo || o.to) && s.outputType === "setting"));
  return n ? e.nodes.find((o) => o.id === (n.logicalTo || n.to)) : void 0;
}
function gy(e) {
  if (la(e.canvas, e.storyNodeId)) return e.canvas;
  const t = e.canvas.nodes.find((s) => s.id === e.storyNodeId), n = Cn(e.powers, "text", "setting");
  if (!n) throw new Error("请先在后台配置设定能力");
  const o = pn(
    "power",
    e.assetCate,
    e.canvas.nodes.length,
    { x: t.x, y: t.y + t.height + 96 },
    { power: n }
  );
  return o.nodeNo = Ro(e.canvas.nodes, e.canvas.nextNodeNo), o.title = t.title + " · 设定", o.composerDraft = {
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
  const n = De(JSON.stringify(t));
  if (e.settingNode.storyboardMaterializedSignature === n) return e.canvas;
  const o = e.settingNode, s = e.canvas.nodes.filter((l) => !l.storyboardItem || l.storyboardItem.sourceNodeId !== o.id || t.materials.some((y) => y.id === l.storyboardItem.itemId && y.type === l.storyboardItem.itemType)), r = Js.filter((l) => ["character", "scene", "prop"].includes(l.itemType)), i = Cn(e.powers, "image", "general"), c = Tu({ sourceNode: o, groups: r.map((l) => ({ key: l.key, layoutIndex: l.layoutIndex, direction: l.direction, powerKind: l.powerKind, power: i, itemCount: t.materials.filter((y) => y.type === l.itemType).length })) });
  let a = Ro(s, e.canvas.nextNodeNo);
  for (const l of r) {
    const y = c.get(l.key), v = $u({ nodes: s, storyboardNode: o, spec: l, layout: y, assetCate: e.assetCate }).node;
    for (const R of t.materials.filter((_) => _.type === l.itemType)) {
      const _ = { id: R.id, type: R.type, title: R.name, prompt: R.prompt }, M = s.findIndex(($) => yr($, o.id, _.type, _.id)), A = M >= 0 ? Ga(s[M], v.id, _, l, i, { nodes: s }) : Vu({ nodes: s, group: v, storyboardNode: o, item: _, assetCate: e.assetCate, spec: l, power: i }), O = { ...A, title: R.name, storyboardItem: { ...A.storyboardItem, generatedInputs: { ...A.storyboardItem.generatedInputs, voice: R.voice } } };
      M >= 0 ? s[M] = O : (O.nodeNo = a++, s.push(O));
    }
    const b = s.filter((R) => R.groupId === v.id), I = Mu(v, b);
    for (const R of b) s[s.indexOf(R)] = { ...R, ...I.positions.get(R.id) };
  }
  s[s.findIndex((l) => l.id === o.id)] = { ...o, storyboardMaterializedSignature: n };
  const d = e.canvas.edges.filter((l) => s.some((y) => y.id === l.from) && s.some((y) => y.id === l.to));
  return { ...e.canvas, nextNodeNo: a, nodes: s, edges: Tt(s, d) };
}
function li(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    const o = Ja(n);
    if (!o) continue;
    const s = Number(n.asset?.id || n.resultRef?.asset_id), r = o.units.flatMap((_) => {
      const M = t.nodes.find(
        (O) => O.composerDraft?.promptContent?.parts.some(
          ($) => $.type === "reference" && $.ref_type === "asset" && $.ref_id === s && $.ref_content_selection?.kind === "unit" && $.ref_content_selection.ids.length === 1 && $.ref_content_selection.ids[0] === _.id
        )
      );
      if (!M) return [];
      const A = t.nodes.find(
        (O) => O.storyboardItem?.sourceNodeId === M.id && O.storyboardItem.itemType === "video_compose"
      );
      return [{ unit: _, board: M, composition: A }];
    }), i = Tp + De(n.id), c = t.nodes.find((_) => _.id === i);
    if (!c && r.length < 2) continue;
    const a = Cn(e.powers, "video", "video_compose"), d = c || pn(
      "power",
      e.assetCate,
      Ro(t.nodes, t.nextNodeNo),
      { x: Math.max(...r.map(({ board: _ }) => _.x + _.width)) + 360, y: n.y },
      a ? { power: a } : void 0
    ), l = c?.composerDraft?.videoComposition || Mp(), y = i + "-chapter-", v = t.edges.filter((_) => !_.id.startsWith(y));
    let b = !!c && JSON.stringify(l.clips.map((_) => _.id)) !== JSON.stringify(r.map(({ unit: _ }) => _.id));
    const I = r.map(({ unit: _, board: M, composition: A }) => {
      const O = y + De(_.id);
      A && v.push({ id: O, from: A.id, to: i, purpose: "dependency" });
      const $ = Number(A?.resultRef?.asset_id || A?.asset?.id || 0), oe = Number(A?.resultRef?.version_id || A?.asset?.version_id || 0), Y = $ && oe ? { assetId: $, versionId: oe, label: _.title } : void 0, ie = jt([M.asset?.version?.content, M.resultOutput]), P = l.clips.find((V) => V.id === _.id), he = ie?.target_duration || P?.duration || 0;
      return c && P?.duration !== he && (b = !0), c && JSON.stringify(P?.visualVideo) !== JSON.stringify(Y) && (!c.resultRef?.execution_id || c.resultRef.execution_id !== A?.resultRef?.execution_id) && (b = !0), {
        ...P,
        id: _.id,
        title: _.title,
        sourceEdgeId: O,
        visualVideo: Y,
        originalAudioSource: P?.originalAudioSource && JSON.stringify(P.originalAudioSource) !== JSON.stringify(P.visualVideo) ? P.originalAudioSource : Y,
        duration: he,
        originalVolume: P?.originalVolume ?? 1,
        speechTracks: P?.speechTracks || [],
        subtitleTracks: P?.subtitleTracks || [],
        useOriginalVideo: P?.useOriginalVideo ?? !0,
        blockingIssues: Y ? [] : ["等待本章视频生成"],
        transitionToNext: P?.transitionToNext || { type: "none", durationMs: 0 }
      };
    }), R = {
      ...d,
      id: i,
      title: c?.title || "全片合成",
      kind: "video",
      outputType: "video_compose",
      description: "按章节顺序合成整部视频。",
      composerDraft: { ...d.composerDraft, videoComposition: { ...l, clips: I } }
    };
    b && (delete R.asset, delete R.resultRef, delete R.resultOutput, delete R.resultView), !(c && JSON.stringify(c) === JSON.stringify(R) && JSON.stringify(t.edges) === JSON.stringify(v)) && (t = {
      ...t,
      nodes: c ? t.nodes.map((_) => _.id === i ? R : _) : [...t.nodes, R],
      edges: v,
      nextNodeNo: Ro([...t.nodes, R], t.nextNodeNo)
    });
  }
  return t;
}
function Vi(e, t) {
  if (Mo(e.power, e.kind, e.outputType))
    return e.composerDraft?.promptContent?.parts.find(
      (n) => n.type === "reference" && n.ref_type === "asset" && n.ref_id === t && n.ref_content_selection?.kind === "unit"
    );
}
function hy(e) {
  const t = e.canvas.nodes.find(
    (b) => b.id === e.storyNodeId
  ), n = t && Ja(t), o = Number(t?.asset?.id || t?.resultRef?.asset_id || 0), s = Number(
    t?.asset?.version_id || t?.asset?.version?.id || t?.resultRef?.version_id || 0
  );
  if (!t || !n || !o || !s)
    throw new Error("请先保存故事作品");
  const r = Cn(e.powers, "text", "storyboard");
  if (!r) throw new Error("请先配置分镜脚本能力");
  const i = n.units.filter(
    (b) => e.unitIds.includes(b.id)
  );
  if (!i.length || i.length !== new Set(e.unitIds).size || i.some((b) => !b.asset_id || !b.version_id || !b.has_body))
    throw new Error("请选择已生成正文的章节");
  const c = la(e.canvas, t.id) ? e.canvas : gy(e), a = [...c.nodes], d = [...c.edges], l = la(c, t.id);
  let y = Ro(a, c.nextNodeNo);
  for (const b of i) {
    let I = a.find((_) => {
      const M = Vi(_, o);
      return M?.type === "reference" && M.ref_content_selection?.ids.length === 1 && M.ref_content_selection.ids[0] === b.id;
    });
    I || (I = pn(
      "power",
      e.assetCate,
      y,
      {
        x: t.x + (t.width || 420) + 360,
        y: t.y + n.units.indexOf(b) * 460
      },
      { power: r }
    ), I.id = `chapter-${De(t.id)}-${De(b.id)}`, I.nodeNo = y++, I.title = b.title, I.titleMode = "manual", I.composerDraft = {
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
            (_) => _.type === "reference" && _.ref_type === "asset" && _.ref_id === o ? { ..._, ref_version_id: s } : _
          )
        }
      }
    };
    for (const _ of [t.id, ...l ? [l.id] : []]) {
      const M = `chapter-source-${De(_)}-${De(I.id)}`;
      d.some((A) => A.id === M) || d.push({ id: M, from: _, to: I.id, purpose: "structure" });
    }
  }
  const v = new Set(
    a.filter((b) => Vi(b, o)).map((b) => b.id)
  );
  for (let b = d.length - 1; b >= 0; b--) {
    const I = d[b];
    I.id.startsWith("chapter-next-") && v.has(I.from) && v.has(I.to) && d.splice(b, 1);
  }
  for (let b = 1; b < n.units.length; b++) {
    const I = n.units.slice(b - 1, b + 1).map(
      (_) => a.find((M) => {
        const A = Vi(M, o);
        return A?.type === "reference" && A.ref_content_selection?.ids[0] === _.id;
      })
    );
    if (!I[0] || !I[1]) continue;
    const R = `chapter-next-${De(I[0].id)}-${De(I[1].id)}`;
    d.some((_) => _.id === R) || d.push({
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
  if (!Mo(e.power, e.kind, e.outputType)) return "";
  const o = jt([
    e.asset?.version?.content,
    e.resultOutput
  ]), s = o?.screenplay?.source;
  if (!o || !s) return "";
  const r = t.find(
    (l) => Number(l.asset?.id || l.resultRef?.asset_id) === s.work_asset_id
  ), i = r && Ja(r);
  if (!r || !i) return "";
  const c = i.units.find((l) => l.id === s.unit_id);
  if (!c) return "来源章节已移除，已有分镜和视频保留";
  if (c.asset_id !== s.asset_id || c.version_id !== s.version_id)
    return "章节正文已更新，重做剧本后再制作；已有结果保留";
  const a = Ap(t, n, e.id), d = a && di(a);
  return d && (o.visual_mode !== d.visual_mode || o.aspect_ratio !== d.aspect_ratio || o.style_prompt !== d.style_prompt) ? "全片画风或画幅已更新，请重做剧本后再制作" : "";
}
const fd = 520, vy = 8e3;
function pd(e) {
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
  const R = F((V) => {
    const X = a.current[V];
    X != null && (window.clearTimeout(X), delete a.current[V]);
  }, []), _ = F(
    (V, X = fd) => {
      const L = i.current.get(V);
      if (!t || !e || !L || L.conflict || typeof window > "u")
        return;
      R(V);
      const Z = d.current;
      a.current[V] = window.setTimeout(() => {
        delete a.current[V], l.current?.(V, Z)?.catch(() => {
        });
      }, X);
    },
    [R, t, e]
  ), M = F(
    async (V, X, L) => {
      const Z = i.current.get(V);
      if (!Z || X !== d.current || !t || !e)
        return;
      const ge = () => X === d.current && i.current.get(V) === Z;
      if (Z.conflict)
        throw Z.conflict;
      for (; c.current.has(V); )
        if (await c.current.get(V), !ge())
          return;
      const ye = L?.revision ?? Z.revision;
      if (ye <= Z.savedRevision)
        return;
      const be = L?.canvas || r.current[V];
      if (!be)
        return;
      const fe = (async () => {
        I((we) => ({ ...we, [V]: "saving" }));
        try {
          const we = await Uf({
            projectId: e,
            canvasId: be.id,
            assetCateId: be.assetCateId,
            canvas: be,
            baseline: Z.baseline
          });
          if (!ge())
            return;
          Z.baseline = we.baseline, Z.savedRevision = ye, Z.retryCount = 0, Z.revision === ye ? (o((ce) => {
            const Be = ce[V], Ne = we.updatedAt || Be?.updatedAt;
            return !ge() || !Be || Be.updatedAt === Ne ? ce : {
              ...ce,
              [V]: { ...Be, updatedAt: Ne }
            };
          }), I((ce) => ({
            ...ce,
            [V]: "saved"
          }))) : I((ce) => ({
            ...ce,
            [V]: "dirty"
          }));
        } catch (we) {
          if (!ge())
            return;
          throw we instanceof Error && "code" in we && we.code === 409 ? (Z.conflict = we, R(V), I((Fe) => ({ ...Fe, [V]: "dirty" })), s(we), we) : (Z.retryCount += 1, I((Fe) => ({ ...Fe, [V]: "error" })), Z.retryCount === 1 && s(we), _(
            V,
            Math.min(vy, fd * 2 ** Z.retryCount)
          ), we);
        } finally {
          ge() && !Z.conflict && Z.revision > Z.savedRevision && Z.retryCount === 0 && _(V);
        }
      })();
      c.current.set(V, fe);
      try {
        await fe;
      } finally {
        c.current.get(V) === fe && c.current.delete(V);
      }
    },
    [R, t, s, e, _, o]
  );
  l.current = M;
  const A = F(
    async (V) => {
      const X = String(V.id), L = i.current.get(X);
      if (!L || !t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      if (L.conflict)
        throw s(L.conflict), L.conflict;
      const Z = d.current, ge = ++L.revision;
      if (L.retryCount = 0, R(X), I((ye) => ({ ...ye, [X]: "dirty" })), await M(X, Z, { canvas: V, revision: ge }), Z !== d.current || i.current.get(X) !== L)
        throw new Error("画布状态已更新，请重新运行");
    },
    [R, t, s, e, M]
  ), O = F((V) => {
    const X = String(V), L = i.current.get(X);
    L && (L.revision += 1, L.retryCount = 0, I((Z) => ({ ...Z, [X]: "dirty" })), L.conflict || v((Z) => Z + 1));
  }, []), $ = F((V) => {
    const X = i.current.get(V);
    return X != null && (c.current.has(V) || X.revision > X.savedRevision);
  }, []), oe = F(
    (V) => V == null ? [...i.current.keys()].some($) : $(String(V)),
    [$]
  ), Y = F(async () => {
    const V = d.current;
    for (; ; ) {
      const X = [...i.current.keys()].filter($);
      if (!X.length) return;
      if (await Promise.all(
        X.map(async (L) => {
          R(L), await M(L, V);
        })
      ), V !== d.current)
        throw new Error("画布状态已更新，请重试");
    }
  }, [R, $, M]), ie = F(
    (V) => {
      d.current += 1, r.current = V;
      for (const L of Object.keys(a.current))
        R(L);
      i.current.clear();
      const X = {};
      for (const [L, Z] of Object.entries(V))
        i.current.set(L, pd(Z)), X[L] = "saved";
      I(X);
    },
    [R]
  ), P = F(
    (V) => {
      const X = String(V.id);
      i.current.has(X) && (V.loadedBaseline == null || r.current[X] === V) || (R(X), r.current = { ...r.current, [X]: V }, i.current.set(X, pd(V)), I((L) => ({ ...L, [X]: "saved" })));
    },
    [R]
  ), he = F(
    (V) => {
      const X = String(V);
      R(X), i.current.delete(X), I((L) => {
        if (!Object.prototype.hasOwnProperty.call(L, X))
          return L;
        const Z = { ...L };
        return delete Z[X], Z;
      });
    },
    [R]
  );
  return ue(() => {
    for (const [V, X] of i.current)
      X.revision > X.savedRevision && _(V);
  }, [_, y]), ue(
    () => () => {
      d.current += 1;
      for (const V of Object.values(a.current))
        window.clearTimeout(V);
      a.current = {};
    },
    []
  ), {
    markCanvasDirty: O,
    flushCanvasSave: A,
    flushPendingCanvasSaves: Y,
    hasPendingCanvasSaves: oe,
    adoptCanvasSnapshot: P,
    forgetCanvasSnapshot: he,
    resetCanvasAutosave: ie,
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
function Yu(e) {
  if (e.kind === "media" && e.options.length === 1)
    return { kind: "media", key: e.options[0].key };
  if (e.kind === "text" && e.params.length === 1 && !e.lyricsAvailable)
    return { kind: "text", key: e.params[0].key };
  if (e.kind === "text" && e.params.length === 0 && e.lyricsAvailable)
    return { kind: "lyrics" };
}
function Ju(e, t, n, o) {
  const s = {
    projectId: t,
    releaseId: n,
    flowId: Number(o.flow?.id || 0),
    powerId: Number(o.power?.id || 0),
    powerKey: o.power?.key || "",
    targetId: Number(o.composerDraft?.selectedTargetId || 0)
  };
  return e.loadPowerForm(s, () => Hd(s));
}
function Xu(e, t) {
  return xu(t, ku(t, Ma(e.composerDraft)));
}
function fa(e, t, n) {
  return Dp(Xu(e, t), e.composerDraft, n);
}
function Zu(e, t, n) {
  return t.flatMap((o) => !ru(o) || (o.logicalTo || o.to) !== n ? [] : Gd(e, o.logicalFrom || o.from).filter(Va).map((s) => ({ edge: o, source: s })));
}
function mr({ source: e, target: t, nodes: n, edges: o, items: s, params: r, referenceOnly: i = !1 }) {
  if (!e || !t || !Wd(e, t))
    return { kind: "invalid", reason: "无法连接这两个节点，请检查节点和分组位置" };
  const c = o.filter((v) => (v.logicalTo || v.to) === t.id);
  if (su(e, t) === "structure") {
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
  const d = (e.type === "group" ? Gd(n, e.id) : [e]).filter(Va), l = ir(e), y = Aa(e.power, e.kind, e.outputType);
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
      const v = Ma(t.composerDraft), b = Zu(n, o, t.id), I = ku(r, v), R = bg(
        r,
        I,
        [...b.map(($) => $.source), ...d]
      ), _ = Ng({
        node: t,
        content: v.promptContent,
        items: s,
        connections: b,
        params: r,
        values: R,
        requestedMode: v.multiImageMode,
        additionalSources: d
      });
      if (_.error) return { kind: "invalid", reason: _.error };
      const M = _.active ? _.mode : void 0, A = Ig(
        b,
        Cg(xu(r, R)),
        d,
        v.promptContent,
        s,
        M
      );
      if (A.error) return { kind: "invalid", reason: A.error };
      const O = { ...v, paramValues: R, multiImageMode: M ?? v.multiImageMode };
      return {
        kind: "media",
        options: A.options.map(($) => ({ key: $.key, name: $.label })),
        draft: (R !== I || M) && Fc(O) !== Fc(v) ? O : void 0
      };
    }
    if (l) {
      if (!r) return { kind: "form" };
      const v = fa(t, r, e.id), b = Vs(t);
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
      (!l || !Qu(l)) && c(d);
    }
  };
  return c(e), [...r];
}
function Qu(e) {
  return !!(e.type === "function" && ds(e.functionOption?.key)?.stopsExecution);
}
function Xa(e) {
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
  const n = e.filter(Xa), o = n.filter(
    (s) => !t(s)
  );
  return (o.length > 0 ? o : n).map(
    (s) => s.id
  );
}
function el({
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
function Za({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: o
}) {
  const s = e.filter(Xa), r = s.map((d) => t[d.id]).filter((d) => !!d), c = n?.status === "running" || n?.status === "waiting" ? s.filter((d) => {
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
  return /* @__PURE__ */ U(Gt, { children: [
    /* @__PURE__ */ f("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ U(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (v) => v.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ U("button", { type: "button", onClick: d, children: [
            /* @__PURE__ */ f(za, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "详情" })
          ] }) : null,
          s && l ? /* @__PURE__ */ U("button", { type: "button", onClick: l, children: [
            /* @__PURE__ */ f(bu, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "编辑分镜" })
          ] }) : null,
          r && y ? /* @__PURE__ */ U("button", { type: "button", onClick: y, children: [
            /* @__PURE__ */ f(Jm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ U("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ f(Xm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "复制" })
          ] }) : null,
          o ? /* @__PURE__ */ U("button", { type: "button", className: "is-danger", onClick: a, children: [
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
  return /* @__PURE__ */ U("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ f(mt, { label: I, children: /* @__PURE__ */ f(
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
    o ? /* @__PURE__ */ U(Gt, { children: [
      /* @__PURE__ */ f("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ f(mt, { label: s ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: c,
          "aria-label": s ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ f(eg, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(mt, { label: r ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: r ? "is-active" : "",
          onClick: a,
          "aria-label": r ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ f(Nu, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(mt, { label: "重置视图", children: /* @__PURE__ */ f("button", { type: "button", onClick: d, "aria-label": "重置视图", children: /* @__PURE__ */ f(tg, { size: 15 }) }) }),
      /* @__PURE__ */ U("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ f(mt, { label: "缩小", children: /* @__PURE__ */ f("button", { type: "button", onClick: y, "aria-label": "缩小", children: /* @__PURE__ */ f(Iu, { size: 15 }) }) }),
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
        /* @__PURE__ */ f(mt, { label: "放大", children: /* @__PURE__ */ f("button", { type: "button", onClick: l, "aria-label": "放大", children: /* @__PURE__ */ f(Cu, { size: 15 }) }) })
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
function tl(e, t) {
  return e && t?.interactionId === e ? t : null;
}
function nl(e, t, n) {
  const o = tl(t, n);
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
  const s = nl(
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
  const [n, o] = K(null), s = re(
    () => nl(e, t, n),
    [e, t, n]
  );
  ue(() => {
    o(
      (i) => tl(t, i)
    );
  }, [t]);
  const r = F(
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
  return re(() => {
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
  return t && Qa(t.source, e) ? t.value : e;
}
function md(e, t, n) {
  return {
    source: t && Qa(t.source, e) ? t.source : e,
    value: n
  };
}
function Qa(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const ol = [
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
], ti = 140, ec = 100, Wr = 720, gd = { width: 280, height: 64 };
function jy(e, t, n) {
  const o = sl(n), s = e.find((r) => r.id === t);
  return !s || Hy(s, o) ? e : e.map(
    (r) => r.id === t ? { ...r, ...o } : r
  );
}
function Ky(e, t, n) {
  const o = is(n), s = e.find((r) => r.id === t);
  return !s || Qa(s.resultView, o) ? e : e.map(
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
  const r = e.type === "group", i = e.type === "power" && Xd(e.power, e.kind);
  return /* @__PURE__ */ f(Gt, { children: ol.map((c) => /* @__PURE__ */ f(
    Lm,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: r ? zc.width : i ? gd.width : ti,
      minHeight: r ? zc.height : i ? gd.height : ec,
      maxWidth: r ? Bc.width : Wr,
      maxHeight: r ? Bc.height : Wr,
      keepAspectRatio: !r && !i,
      onResizeStart: () => o?.(e.id),
      onResizeEnd: (a, d) => s(e.id, sl(d))
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
  return /* @__PURE__ */ f(Gt, { children: ol.map((d) => /* @__PURE__ */ f(
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
  const s = e.width / e.height, r = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * o) * s, c = rl(
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
function rl(e, t) {
  const n = Math.max(ti, ec * t), o = Math.min(Wr, Wr * t);
  return n > o ? Math.min(Wr, Math.max(ti, e)) : Math.min(o, Math.max(n, e));
}
function is(e) {
  const t = yd(e.width, ti), n = yd(e.height, ec), o = t / n, s = rl(t, o);
  return {
    width: Math.round(s),
    height: Math.round(s / o),
    offsetX: Math.round(hd(e.offsetX, 0)),
    offsetY: Math.round(hd(e.offsetY, 0))
  };
}
function yd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function hd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function sl(e) {
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
          Qt(a, "start") ? "start" : Qu(a) ? "stop" : "other"
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
const il = "反馈已被新的运行替换";
function Xy(e) {
  return e instanceof Error && e.message === il;
}
function Io(e) {
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
  const o = t.find((r) => r.id === e.node.id) || e.node, s = Io(o).find(
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
    output: Mt(t?.output, e?.output, e?.data?.output),
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
    return al(t);
  const n = e.approvals.find(ih);
  if (!n?.id)
    return null;
  const o = ah(n), s = tc(o);
  return {
    approval: n,
    title: Oe(o.title, n.title, "补充信息"),
    description: Oe(
      o.description,
      "补充信息后继续执行流程。"
    ),
    fields: s,
    values: nc(o, s)
  };
}
function al(e) {
  const t = e.interaction, n = tc(t);
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
    values: nc(t, n)
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
function tc(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, o) => ch(n, o)).filter((n) => !!n.key);
}
function nc(e, t) {
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
  const o = tc(n);
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
    values: nc(n, o)
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
    accepted_kinds: wd(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: wd(
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
function wd(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function dh(e) {
  const t = ji(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const o = ji(e?.interaction);
    return o && Oe(o.type) ? o : null;
  }
  const n = ji(t.interaction, t.content?.interaction);
  return n && Oe(n.type) ? n : null;
}
function ji(...e) {
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
  }), b = d || {}, I = !!b.isSelected, R = !!(b.isHighlighted || I), _ = b.highlightColor || "#0ea5e9", M = I ? "var(--ws-edge-selected)" : R ? _ : "var(--ws-edge)", A = I ? 2.8 : R ? 2.4 : 1.45, O = R ? 0.96 : 0.62, $ = String(b.bindingLabel || "").trim(), oe = !!b.bindingInteractive, Y = !!$, ie = Y || I;
  return /* @__PURE__ */ U(Gt, { children: [
    R ? /* @__PURE__ */ f(
      Xc,
      {
        path: l,
        style: {
          stroke: _,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ f(
      Xc,
      {
        path: l,
        markerEnd: c,
        style: {
          ...a,
          stroke: M,
          strokeWidth: A,
          opacity: O,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    ie ? /* @__PURE__ */ f(jm, { children: /* @__PURE__ */ U(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          $ ? "is-bound" : "",
          b.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${y}px, ${v}px)`
        },
        onMouseDown: (P) => {
          P.preventDefault(), P.stopPropagation();
        },
        children: [
          Y ? oe ? /* @__PURE__ */ U(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${$}`,
              onClick: (P) => {
                P.preventDefault(), P.stopPropagation(), b.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ f(ia, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ f("span", { children: $ }),
                b.bindingShowChevron ? /* @__PURE__ */ f(ng, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ U("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ f(ia, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ f("span", { children: $ })
          ] }) : null,
          I ? /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (P) => {
                P.preventDefault(), P.stopPropagation(), b.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ f(og, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    R ? /* @__PURE__ */ U(Gt, { children: [
      /* @__PURE__ */ f("circle", { r: "3", fill: _, children: /* @__PURE__ */ f(
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
      children: /* @__PURE__ */ U(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ f(xo, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(Ua, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ f("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Ki({
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
  ) : /* @__PURE__ */ f(mt, { label: o ? "双击重命名" : e, children: /* @__PURE__ */ f(
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
  o.type === "power" && Mo(
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
function cl(e) {
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
    frames: ul(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: dl(e, n)
  };
}
function vd(e) {
  return fi(e);
}
function yh(e, t) {
  return dl(e).get(t.id) || "";
}
function dl(e, t = fi(e)) {
  const n = rc(e), o = /* @__PURE__ */ new Map();
  for (const s of e) {
    let r = "";
    s.storyboardItem?.sourceNodeId ? r = sc(s, n) : s.type === "group" && s.group?.origin === "script" ? r = n.get(s.id) || "" : t.has(s.id) ? r = s.id : s.groupId && (r = n.get(s.groupId) || ""), r && o.set(s.id, r);
  }
  return o;
}
function ul(e, t, n = fi(e)) {
  const o = new Map(e.map((d) => [d.id, d])), s = rc(e), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const d of e) {
    const l = /* @__PURE__ */ new Set();
    n.has(d.id) && l.add(d.id);
    const y = s.get(d.id);
    y && l.add(y);
    const v = d.storyboardItem?.sourceNodeId ? sc(d, s) : "";
    if (v && l.add(v), d.groupId) {
      const b = s.get(d.groupId);
      b && l.add(b);
    }
    for (const b of l)
      qi(r, b, d);
    y && qi(i, y, d), v && !d.storyboardItem?.optional && qi(c, v, d);
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
      id: oc(d),
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
function qi(e, t, n) {
  const o = e.get(t);
  o ? o.push(n) : e.set(t, [n]);
}
function ll(e, t, n, o, s = new Map(t.map((r) => [r.id, r]))) {
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
    (l) => !Xa(l)
  );
  return d ? {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: `“${d.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: el({
      targets: c,
      nodesByID: s,
      hasResult: o
    })
  };
}
function oc(e) {
  return `storyboard-frame:${e}`;
}
function fi(e) {
  const t = rc(e), n = new Set(t.values());
  for (const o of e)
    o.storyboardMaterializedSignature && n.add(o.id), o.storyboardItem?.sourceNodeId && n.add(sc(o, t));
  return n;
}
function rc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    n.type !== "group" || n.group?.origin !== "script" || !n.group.sourceNodeId || t.set(
      n.id,
      n.group.sourceNodeId
    );
  return t;
}
function sc(e, t) {
  const n = e.storyboardItem?.sourceNodeId || "", o = t.get(e.groupId || "");
  return o && o === e.groupId ? o : n;
}
function hh(e, t) {
  const n = String(
    t.semantic_event || t.event || ""
  ).toLowerCase(), o = Hp(t.meta) ? t.meta : {}, s = n === "status", r = s && !!String(o.output_type || ""), i = r && !!(t.json && typeof t.json == "object" || o.storyboard_preview && typeof o.storyboard_preview == "object");
  let c = e.streamOutput;
  (n === "audio_ready" || i || fu(t)) && (c = t, s && "text" in t && (c = { ...t }, delete c.text));
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
  const [s, r] = K([]), [i, c] = K([]), [a, d] = K([]), [l, y] = K(!1), v = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, b = ne(v), I = re(
    () => l || vh(t),
    [t, l]
  );
  ue(() => {
    b.current = v, r([]), c([]), d([]), y(!1);
  }, [v]);
  const R = F(
    async (_ = !1) => {
      if (!e)
        return !1;
      const M = v;
      try {
        const A = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => Lf(e.project.id),
          _
        );
        return b.current !== M ? !1 : (r(A.roles), c(A.powers), d(A.powerCategories), y(!0), !0);
      } catch (A) {
        return b.current === M && o(A instanceof Error ? A.message : "加载能力列表失败"), !1;
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
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power || n.outputType === "setting" ? !0 : Mo(n.power, n.kind, n.outputType) ? !!jt([
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
  const [b, I] = K(!1), [R, _] = K(e.title), M = ne(null), A = r === "running" || r === "waiting", O = A ? "分组正在执行" : y || (n === 0 ? "分组内暂无可运行节点" : "运行分组"), $ = !l || n === 0 || A || !!y;
  ue(() => {
    b || _(e.title);
  }, [b, e.title]), ue(() => {
    b && (M.current?.focus(), M.current?.select());
  }, [b]);
  const oe = () => {
    const Y = R.trim() || "未命名分组";
    I(!1), _(Y), Y !== e.title && a?.(Y);
  };
  return /* @__PURE__ */ U(
    "div",
    {
      className: `ws-node-group-wrap ${i ? "is-selected" : ""} ${A ? "is-running" : ""} ${r === "error" ? "is-error" : ""} ${c ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ U("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ f("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(rg, { size: 15 }) }),
          b ? /* @__PURE__ */ f(
            "input",
            {
              ref: M,
              className: "ws-node-group-title-input nodrag nowheel",
              value: R,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (Y) => _(Y.target.value),
              onBlur: oe,
              onKeyDown: (Y) => {
                Y.key === "Enter" ? (Y.preventDefault(), oe()) : Y.key === "Escape" && (Y.preventDefault(), _(e.title), I(!1));
              }
            }
          ) : /* @__PURE__ */ f(
            mt,
            {
              label: c ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ f(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (Y) => {
                    Y.preventDefault(), Y.stopPropagation(), !(c || !a) && I(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ f("span", { className: "ws-node-group-count", children: A ? `${o}/${n}` : `${t} 个节点` }),
          r === "waiting" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待反馈" }) : r === "error" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: s > 0 ? `失败 ${s}` : "运行失败" }) : y ? /* @__PURE__ */ f(mt, { label: y, children: /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待前置" }) }) : n > 0 && o === n ? /* @__PURE__ */ U("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ f(La, { size: 12 }),
            "已完成"
          ] }) : null,
          d ? /* @__PURE__ */ f(mt, { label: "编辑分镜结构", children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (Y) => {
                Y.preventDefault(), Y.stopPropagation(), d();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ f(bu, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ f(mt, { label: O, children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: $,
              onClick: (Y) => {
                Y.preventDefault(), Y.stopPropagation(), l?.();
              },
              "aria-label": "运行分组",
              children: A ? /* @__PURE__ */ f(xo, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(Ua, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        v
      ]
    }
  );
}
function fl({
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
  const I = ne(null), R = ne(!0), _ = lr(e, n), M = l != null, A = y || !M && !_ && pl(n), O = !!i && (!M || y), $ = [
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
    const P = I.current;
    P && R.current && (P.scrollTop = P.scrollHeight);
  }, [v, b]), /* @__PURE__ */ U(
    "div",
    {
      role: O ? "button" : void 0,
      tabIndex: O ? 0 : void 0,
      className: $,
      style: r,
      onPointerDown: (P) => {
        (!A || Rh(P)) && P.stopPropagation();
      },
      onClick: (P) => {
        P.stopPropagation(), !(!i || js(P.target, P.currentTarget) || _h(P)) && (P.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (P) => {
        P.stopPropagation(), !(!i || js(P.target, P.currentTarget) || P.key !== "Enter" && P.key !== " ") && (P.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            ref: I,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (P) => {
              !a || !i || js(P.target, P.currentTarget) || ml(P, P.currentTarget) || (P.preventDefault(), P.stopPropagation(), i());
            },
            onScroll: (P) => {
              if (!v)
                return;
              const he = P.currentTarget;
              R.current = he.scrollHeight - he.scrollTop - he.clientHeight < 16;
            },
            children: M ? l : _ ? /* @__PURE__ */ f(
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
  return e.imageUrl ? /* @__PURE__ */ U("figure", { className: "ws-result-view-media", children: [
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
  ] }) : e.videoUrl ? /* @__PURE__ */ U("figure", { className: "ws-result-view-media", children: [
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
  ] }) : e.audioUrl ? /* @__PURE__ */ U("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ f("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ f("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ U(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ f($a, { size: 16 }),
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
function pl(e) {
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
  return t ? ml(e, t) : !1;
}
function ml(e, t) {
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
  return /* @__PURE__ */ f("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ f(mt, { label: o, side: "left", children: /* @__PURE__ */ f(
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
const pa = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!pa || Object.keys(pa).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const bd = ms(), Nd = ms(), Us = ms(), Id = ms(), Cd = ms();
function We(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: xh } = pa;
function Th(...e) {
  for (const t of e) {
    const n = Co(t);
    if (n)
      return n;
  }
  return null;
}
function ni(...e) {
  for (const t of e) {
    const n = gl(t);
    if (Ge(n))
      return n;
  }
  return "";
}
function gl(e) {
  const t = ls(bd, e);
  return t !== fs ? t : wo(
    bd,
    e,
    Mh(e)
  );
}
function Mh(e) {
  const t = Ve(e), n = gs(t);
  if (n !== t)
    return gl(n);
  const o = xh?.(t) ?? t, s = yo(o, /* @__PURE__ */ new Set());
  if (Ge(s))
    return s;
  if (o !== t) {
    const c = yo(t, /* @__PURE__ */ new Set());
    if (Ge(c))
      return c;
  }
  const r = pi(t);
  if (r)
    return ra?.(r) ?? r;
  const i = ic(e);
  return i !== t && Ge(i) ? i : "";
}
function yo(e, t) {
  const n = Ve(e), o = gs(n);
  if (o !== n)
    return yo(o, t);
  if (typeof n == "string") {
    const a = hl(n);
    if (Ge(a))
      return a;
    const d = ps(n);
    return d ? { text: d } : Xn(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((d) => yo(d, t)).filter(Ge);
    return a.length > 0 ? a : "";
  }
  if (!We(n))
    return n;
  if (Ao(n)) {
    const a = Il(n);
    if (a !== void 0)
      return yo(a, t);
    const d = Cl(n);
    if (d)
      return { text: d };
    const l = Co(n) || At(n);
    return l ? { rich: l } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), uc(n))
    return ma(n);
  if (wl(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const d = yo(n[a], t);
    if (Ge(d))
      return d;
  }
  const s = ac(n);
  if (s) {
    const a = { rich: s };
    return ra?.(a) ?? a;
  }
  const r = At(n);
  if (r)
    return { rich: r };
  const i = pi(n);
  if (i)
    return ra?.(i) ?? i;
  const c = Pt(n);
  if (c !== n)
    return yo(c, t);
  if (Ah(n))
    return ma(n);
  if (yi(n)) {
    const a = Oe(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return mi(n) ? n : "";
}
function Ah(e) {
  return !!(We(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function ma(e) {
  const t = {}, n = Ve(e.content);
  We(n) && _d(t, n), _d(t, e);
  const o = Dh(e);
  return o && (t.text = o), !Ge(t) && n && typeof n == "object" ? n : mi(t) ? t : "";
}
function Dh(e) {
  const t = Oe(e.text);
  if (t)
    return t;
  const n = Ve(e.content);
  return typeof n == "string" ? n.trim() : We(n) ? Oe(n.text) : "";
}
function ic(e) {
  const t = gs(e);
  if (t !== e)
    return ic(t);
  const n = pi(e);
  if (n)
    return n;
  const o = hl(e);
  if (Ge(o))
    return o;
  const s = Ve(e), r = At(s);
  if (r)
    return { rich: r };
  const i = Pt(s);
  if (i !== s) {
    const c = At(i);
    return c ? { rich: c } : i;
  }
  return s;
}
function pi(e) {
  const t = Co(e);
  return t ? { rich: t } : null;
}
function Co(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e), o = gs(n);
  if (o !== n)
    return Co(o, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = Co(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!We(n) || t.has(n))
    return null;
  if (t.add(n), Ao(n))
    return yl(n, t) || n;
  const s = n, r = [
    Xe(s, ["output", "content", "rich"]),
    Xe(s, ["output", "rich"]),
    Xe(s, ["content", "rich"]),
    s.content,
    s.rich,
    s.text,
    s.summary
  ];
  for (const i of r) {
    if (i === n)
      continue;
    const c = Co(i, t);
    if (c)
      return c;
  }
  return null;
}
function yl(e, t) {
  const n = oi(e);
  for (const o of n) {
    const s = Sd(o, t);
    if (s)
      return s;
  }
  return Sd(n.join(""), t);
}
function Sd(e, t) {
  const n = String(e || "").trim();
  if (!Xn(n))
    return null;
  const o = pu(n);
  return o === n || o === e ? null : Co(o, t);
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
function hl(e) {
  const t = Wt(e);
  if (t)
    return { rich: t };
  const n = Ve(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const o = ps(n);
    return o ? { text: o } : "";
  }
  return "";
}
function Wt(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e);
  if (Ao(n))
    return yl(n, t) || n;
  if (Array.isArray(n))
    return At(dc(n));
  if (!We(n) || t.has(n))
    return null;
  t.add(n);
  const o = n, s = ac(o);
  if (s)
    return s;
  const r = [
    Xe(o, ["output", "content", "rich"]),
    Xe(o, ["output", "content"]),
    Xe(o, ["output", "rich"]),
    Xe(o, ["content", "output", "content", "rich"]),
    Xe(o, ["content", "output", "content"]),
    Xe(o, ["content", "rich"]),
    Xe(o, ["data", "output", "content", "rich"]),
    Xe(o, ["data", "output", "content"]),
    Xe(o, ["data", "content", "rich"]),
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
    if (!Sl(i) || !c || typeof c != "object")
      continue;
    const a = Wt(c, t);
    if (a)
      return a;
  }
  return null;
}
function ac(e) {
  if (Ao(e))
    return e;
  const t = We(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), o = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? At({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || o === "rich_json") && e.rich != null ? Wt(e.rich) : (n === "rich_json" || o === "rich_json") && t?.rich != null ? Wt(t.rich) : null;
}
function Ao(e) {
  return !!(We(e) && e.type === "doc" && Array.isArray(e.content));
}
function _d(e, t) {
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
  return Wt(e) || At(dc(e)) || At(e) || e;
}
function mi(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Ge(n));
}
function wl(e) {
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
    return t.length > 0 && !Xn(t) && !qt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Ge) : We(e) ? Wt(e) ? !0 : yi(e) ? !1 : mi(e) : !1;
}
function cc(e) {
  return Kt(
    _n(e),
    e.description || e.title
  );
}
function Oh(e) {
  const t = [
    _n(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const o = Wt(n) || At(ic(n)) || At(Pt(n)) || At(n);
    if (o)
      return o;
  }
  return null;
}
function Kt(e, t = "") {
  const n = ls(Id, e), o = n !== fs ? n : wo(
    Id,
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
  if (!Xn(s))
    return s;
  const i = vo(
    Pt(Ve(s))
  ).trim();
  return i && i !== s && !qt(i) ? i : "";
}
function Fh(e) {
  const t = Pt(e), n = At(t), o = n ? vo(n).trim() : "";
  if (o && !qt(o))
    return o;
  const s = vo(t).trim();
  if (qt(s))
    return "";
  const r = ps(s);
  if (r)
    return r;
  if (s && !Xn(s))
    return s;
  if (lc(s)) {
    const i = vo(
      Pt(Ve(s))
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
function Jn(e, t) {
  const n = ls(Cd, e), o = n === fs ? /* @__PURE__ */ new Map() : n, s = o.get(t);
  if (s) return { ...s };
  const r = Uh(e, t);
  return o.set(t, r), wo(Cd, e, o), { ...r };
}
function Uh(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, o = Pt(e);
  return as(n, o, t), !Yn(n) && o !== e && as(n, e, t), Hr(n) && Xn(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Jp(e, "video").find(
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
    Rd(e, t, n);
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
  c && c !== i && !Sn(c) && (e.text ||= c);
  const a = cr(r.url, r.src, r.href);
  if (a && a !== i && Rd(e, a, n), e.imageUrl ||= cr(
    r.image,
    r.image_url,
    r.imageUrl,
    pt(r.images),
    pt(r.imageUrls)
  ), e.videoUrl ||= cr(
    r.video,
    r.video_url,
    r.videoUrl,
    pt(r.videos),
    pt(r.videoUrls)
  ), e.audioUrl ||= cr(
    r.audio,
    r.audio_url,
    r.audioUrl,
    pt(r.audios),
    pt(r.audioUrls)
  ), e.fileUrl ||= cr(
    r.file,
    r.file_url,
    r.fileUrl,
    pt(r.files),
    pt(r.fileUrls)
  ), !Hr(e)) {
    for (const d of ["output", "result", "content", "body", "data", "rich"])
      if (r[d] && typeof r[d] == "object" && (as(e, r[d], n, o, s + 1), Hr(e)))
        return;
  }
  if (!e.text && !Yn(e) && !Hh(r) && mi(r))
    try {
      const d = JSON.stringify(t, null, 2);
      hr(d) || (e.text = d);
    } catch {
      const d = String(t);
      hr(d) || (e.text = d);
    }
}
function $h(e, t, n) {
  const o = vl(
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
  return vl(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function vl(...e) {
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
    Xe(e, ["attrs", "src"]),
    Xe(e, ["attrs", "url"]),
    Xe(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    pt(e.images),
    pt(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    pt(e.videos),
    pt(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    pt(e.audios),
    pt(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    pt(e.files),
    pt(e.fileUrls),
    ...n
  ];
}
function Rd(e, t, n) {
  const o = t.trim();
  if (!o || qt(o))
    return;
  if (lc(o)) {
    const c = Ve(o);
    if (c !== o && (as(e, c, n), Hr(e)))
      return;
    const a = Kt(c, "");
    a && !Sn(a) && (e.text ||= a);
    return;
  }
  const s = ps(o);
  if (s) {
    e.text ||= s;
    return;
  }
  const r = vo(o);
  if (r && r !== o) {
    e.text ||= r;
    return;
  }
  const i = Kh(o, n);
  if (i) {
    Gh(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (Sn(o)) {
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
  const n = bl(e, t), o = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (o) {
    const d = Gi(o[2]);
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
    const d = Gi(s[1]);
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
    const d = Gi(i[2]), l = kd(d, n);
    if (l)
      return {
        kind: l,
        url: d,
        caption: Ls(e, i[0], i[1])
      };
  }
  const c = Wh(e), a = kd(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: Ls(e, c, "")
  } : null;
}
function bl(e, t) {
  return gi(t) ? t : qh(e) ? "image" : t;
}
function qh(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Gh(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function kd(e, t) {
  if (!e || !Sn(e))
    return "";
  const n = gi(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function Ls(e, t, n) {
  const o = e.replace(t, "").replace(/\s+/g, " ").trim();
  return o && o !== e.trim() && !Sn(o) ? o : String(n || "").trim();
}
function Gi(e) {
  const t = Nl(e);
  return Sn(t) ? t : "";
}
function Wh(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? Nl(t[0]) : "";
}
function Nl(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Hh(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function Yn(e) {
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
function cr(...e) {
  const t = Yh(...e);
  return Sn(t) ? t : "";
}
function pt(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function Sn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function _n(e) {
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
    const s = Il(n);
    if (s !== void 0)
      return wo(Us, n, s);
    const r = Cl(n);
    if (r)
      return wo(Us, n, {
        text: r
      });
    const i = ni(n) || Pt(n);
    if (Ge(i) || fc(i))
      return wo(Us, n, i);
  }
  if (t !== void 0)
    return ni(t) || Pt(t);
}
function Il(e) {
  const t = Ve(e), n = Ao(t) ? t : Wt(t);
  if (!n)
    return;
  const o = Ph(n).trim();
  if (!Xn(o))
    return;
  const s = pu(o);
  if (s === o)
    return;
  const r = Pt(s);
  if (Ge(r) || fc(r))
    return r;
}
function Cl(e) {
  const t = Ve(e), n = Ao(t) ? t : Wt(t);
  return Xp(n);
}
function Pt(e) {
  const t = ls(Nd, e);
  return t !== fs ? t : wo(
    Nd,
    e,
    Xh(e)
  );
}
function Xh(e) {
  const t = Ve(e), n = gs(t);
  if (n !== t)
    return Pt(n);
  if (wl(t))
    return t;
  if (We(t) && uc(t)) {
    const r = ma(t);
    if (Ge(r))
      return r;
  }
  const o = pi(t);
  if (o)
    return o.rich;
  if (Ao(t))
    return t;
  const s = Wt(t);
  return s || dc(ri(t, /* @__PURE__ */ new Set()));
}
function ri(e, t) {
  if (!We(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, o = _l(n);
  if (o !== void 0)
    return o;
  const s = Zh(n, t);
  if (s !== void 0)
    return s;
  for (const r of Qh) {
    const i = Xe(n, r);
    if (i === void 0 || i === e)
      continue;
    const c = ri(
      Ve(i),
      t
    );
    if (ga(c))
      return c;
  }
  if (yi(n))
    for (const r of ["output", "result", "data", "body"]) {
      if (n[r] === void 0 || n[r] === e)
        continue;
      const i = ri(
        Ve(n[r]),
        t
      );
      if (ga(i))
        return i;
    }
  return e;
}
function Zh(e, t) {
  for (const [n, o] of Object.entries(e)) {
    if (!Sl(n) || !o || typeof o != "object")
      continue;
    const s = ri(Ve(o), t);
    if (ga(s))
      return s;
  }
}
function Sl(e) {
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
function _l(e) {
  const t = ac(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Ve(e.content);
    if (We(n)) {
      const o = _l(n);
      if (o !== void 0)
        return o;
    }
  }
}
function dc(e) {
  const t = Ve(e);
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
function ga(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !Xn(n) && !qt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!We(e) || Wt(e) || At(e))
    return !0;
  if (yi(e))
    return !1;
  const t = vo(e).trim();
  return !!(t && !hr(t));
}
function Xe(e, t) {
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
    const r = Ve(s);
    if (r !== s && (t ? nw(r) : uc(r)))
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
function uc(e) {
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
function lc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Xn(e) {
  const t = String(e || "").trim();
  return !!(t && (lc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function Rl(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return qt(e) ? "" : e;
  const t = vo(e).trim();
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
function fc(e) {
  const t = Rl(e).trim();
  return !!(t && !hr(t));
}
function hr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || qt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const ya = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!ya || Object.keys(ya).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const ow = ya.useTheme;
function To(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function si(e) {
  return To(e) ? e : {};
}
function Ee(e, ...t) {
  let n = e;
  for (const o of t) {
    if (!To(n))
      return;
    n = n[o];
  }
  return n;
}
const rw = {}, Ks = [], sw = [], xd = [], iw = 800;
function aw(e) {
  const t = ne(/* @__PURE__ */ new Map()), n = ne(0), o = F(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
    const r = t.current;
    t.current = /* @__PURE__ */ new Map(), r.size !== 0 && e((i) => Nh(i, r));
  }, [e]), s = F(
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
  ), re(() => ({ enqueue: s, flush: o }), [s, o]);
}
function Td(e, t) {
  let n = null;
  for (const o of t)
    Object.prototype.hasOwnProperty.call(e, o) && (n ||= { ...e }, delete n[o]);
  return n || e;
}
function kl(e, t) {
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
    const r = Jl(s), i = s.x + r.width, c = s.y + r.height;
    return s.type === "group" ? o.left <= s.x && o.top <= s.y && o.right >= i && o.bottom >= c : o.left <= i && o.right >= s.x && o.top <= c && o.bottom >= s.y;
  }).map((s) => s.id);
}
function fw(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const pw = {
  workSpace: Ba(db, ef)
}, pc = Um(!1), mw = Ba(Ql, ef), gw = {
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
  }, [e]), re(() => $y(t), []);
}
function $b({
  onInitialLoadComplete: e
}) {
  const t = Bf(), [n, o] = K(""), s = hg(), r = re(() => vb(), []), i = re(() => bb(), []), c = re(() => new Sy(), []), [a, d] = K(null), [l, y] = K(i), v = ne(i), [b, I] = K(0), R = ne(0), [_, M] = K(null), A = ne(null), [O, $] = K([]), oe = O[O.length - 1] || "", [Y, ie] = K({}), P = ne(Y), [he, V] = K(!1), [X, L] = K([]), [Z, ge] = K(!1), ye = ne(0), [be, fe] = K("create"), [we, Fe] = K(
    () => Nb(r)
  ), [ce, Be] = K(!1), [Ne, Et] = K(
    () => Ib()
  ), { resolvedTheme: rt, setTheme: Zn } = ow();
  wg(s.site.appearance, rt);
  const [pe, He] = K(null), [de, st] = K(null), [Te, Rn] = K(null), [Qn, wt] = K(!0), Po = ne(!0), [Ce, Eo] = K({}), kn = ne(Ce);
  kn.current = Ce;
  const Oo = ne(/* @__PURE__ */ new Set()), Fo = aw(Eo), [mn, en] = K({}), [it, at] = K(null), [ys, St] = K(null), tn = it?.id || "", nn = ys?.id || "", ct = re(
    () => [tn, nn],
    [tn, nn]
  ), Le = F(
    (u) => {
      at(u), St(u);
    },
    []
  ), [gn, on] = K(null), [Bo, hs] = K(!1), je = ne(/* @__PURE__ */ new Set()), [xn, Tn] = K(null), [ws, zo] = K(), [Mn, Uo] = K(), [Lo, eo] = K(
    null
  ), [rn, An] = K(null), [vs, Ht] = K(!1), [sn, Yt] = K(""), [Jt, to] = K(null), [no, yn] = K(""), [dt, ze] = K([]), [gt, oo] = K([]), [et, Dn] = K(!1), [Nr, ro] = K(""), [$o, Pn] = K(!1), [_e, En] = K(1), [bs, ae] = K(!1), [hn, yt] = K(() => /* @__PURE__ */ new Set()), [Ns, Ot] = K(!1), [vt, Ft] = K(null), [On, wn] = K(!1), Re = ne(null), so = ne(!1), Bt = ne(/* @__PURE__ */ new Set()), io = ne(/* @__PURE__ */ new Set()), zt = ne(/* @__PURE__ */ new Set()), Ye = ne([]), Ir = ne(/* @__PURE__ */ new Set()), Ut = ne(null), _t = ne(new AbortController()), Cr = ne(new AbortController()), an = ne(Ny());
  ns(() => {
    const u = new AbortController();
    return Cr.current = u, () => u.abort();
  }, [l]), ue(() => {
    _t.current.signal.aborted && (_t.current = new AbortController());
    const u = _t.current, p = an.current;
    return () => {
      u.abort(), p.clear();
    };
  }, []);
  const Xt = ne([0]), ao = ne(null), Fn = ne(/* @__PURE__ */ new Map()), Vo = ne(
    /* @__PURE__ */ new Map()
  ), jo = ne(/* @__PURE__ */ new Set()), [
    Is,
    Ko
  ] = K(() => /* @__PURE__ */ new Set()), [
    qo,
    co
  ] = K({}), [Bn, Sr] = K({}), ut = ne(null), {
    roles: Go,
    powers: Me,
    powerCategories: Cs,
    loaded: Rt,
    load: Zt
  } = wh({
    space: a,
    canvases: Y,
    cache: c,
    onError: o
  });
  ue(() => {
    co({});
  }, [a?.project.id, a?.project.release_id, a?.release?.id]), ue(() => {
    P.current = Y;
  }, [Y]), ue(() => {
    R.current = b;
  }, [b]), ue(() => {
    v.current = l;
  }, [l]), ue(() => {
    Ye.current = dt;
  }, [dt]);
  const cn = F(
    (u, p) => {
      if (u = u.trim(), !u)
        return;
      const g = jo.current;
      if (g.has(u) === p)
        return;
      const N = new Set(g);
      p ? N.add(u) : N.delete(u), jo.current = N, Ko(N);
    },
    []
  ), bt = F(
    (u) => {
      const p = Bl(u);
      if (!p)
        return;
      const g = String(p.request_id || "").trim();
      g && cn(g, Nn(p));
      const N = Hi(
        Ye.current,
        [p]
      );
      Ye.current = N, ze(N);
    },
    [cn]
  ), dn = F(
    (u) => {
      const p = String(u?.request_id || "").trim();
      p && cn(p, !1);
    },
    [cn]
  ), _r = F((u) => {
    o(u instanceof Error ? u.message : "保存画布失败");
  }, []), {
    markCanvasDirty: zn,
    flushCanvasSave: kt,
    flushPendingCanvasSaves: Rr,
    hasPendingCanvasSaves: Un,
    adoptCanvasSnapshot: tt,
    forgetCanvasSnapshot: bi,
    resetCanvasAutosave: Ss,
    canvasSaveStatus: kr
  } = by({
    projectId: r,
    enabled: !!a,
    canvases: Y,
    setCanvases: ie,
    onError: _r
  }), Nt = Ue(
    of
  ), Wo = Ue(
    af
  );
  ue(() => {
    if (zt.current.size === 0)
      return;
    const u = [...zt.current];
    zt.current.clear();
    for (const p of u)
      zn(p);
  }, [Y, zn]);
  const xr = F(async () => {
    if (!r) {
      yn("缺少作品 ID"), wt(!1);
      return;
    }
    wt(!0), yn("");
    try {
      const u = await $f(
        r,
        v.current,
        R.current
      ), p = Rv(
        u.canvases || {},
        u.assets || []
      ), g = Number(u.initialCanvasId || 0) || Number(Object.values(p)[0]?.id || 0), N = Number(u.initialAssetCateId || 0) || Vf(u);
      d(u), P.current = p, ie(p), Ss(p), v.current = g, y(g), R.current = N, I(N), sr(g), M(null), A.current = null, ye.current += 1, V(!1), L([]), ge(!1), Bt.current = /* @__PURE__ */ new Set(), io.current = /* @__PURE__ */ new Set(), Ye.current = [], ze([]), jo.current = /* @__PURE__ */ new Set(), Ko(/* @__PURE__ */ new Set()), Ut.current = null, Dn(!1), oo([]), En(1), ae(!1), Xt.current = [0], Nt(r, u, p, "recovery", {
        canvasId: g
      });
    } catch (u) {
      yn(u instanceof Error ? u.message : "加载创作空间失败");
    } finally {
      wt(!1);
    }
  }, [Nt, r, Ss]);
  ue(() => {
    const u = (p) => {
      !Un() && zt.current.size === 0 || (p.preventDefault(), p.returnValue = "");
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [Un]);
  async function _s(u) {
    if (xt(R.current))
      try {
        for (const p of zt.current)
          zn(p);
        zt.current.clear(), await Rr(), await u();
      } catch (p) {
        _r(p);
      } finally {
        $e();
      }
  }
  const Tr = F((u) => {
    eo(u);
  }, []);
  ue(() => {
    xr();
  }, [xr]), ue(() => {
    Qn || !Po.current || (Po.current = !1, e());
  }, [Qn, e]);
  const Lt = a?.assetCates, Rs = re(() => a ? jf(a) : [], [a]), ks = Rs.length > 1, q = re(
    () => a ? Di(a, b) : null,
    [b, a]
  ), Ni = re(
    () => a && q ? Kf(a, q.id) : [],
    [q, a]
  ), Mr = re(() => Go.filter(qf), [Go]), Ar = re(() => Me.filter(Gf), [Me]), G = re(() => {
    const u = a?.canvasList.find(
      (p) => p.id === l
    );
    return Y[String(l)] || Uc(
      u?.assetCateId || q?.id || 0,
      l,
      u?.name || "第一幕"
    );
  }, [l, q?.id, Y, a?.canvasList]), un = re(
    () => (a?.canvasList || []).filter((u) => u.assetCateId === q?.id).sort((u, p) => u.sort - p.sort || u.id - p.id),
    [q?.id, a?.canvasList]
  ), Dr = F(
    async (u) => {
      const p = ye.current + 1;
      ye.current = p, ge(!0);
      try {
        const g = await Wf({
          projectId: r,
          assetCateId: u
        });
        ye.current === p && L(g);
      } catch (g) {
        ye.current === p && (L([]), o(
          g instanceof Error ? g.message : "加载已删除画布失败"
        ));
      } finally {
        ye.current === p && ge(!1);
      }
    },
    [r]
  ), Ii = F(() => {
    q && (V(!0), L([]), Dr(q.id));
  }, [q, Dr]), ve = re(
    () => Md(G, mn),
    [G, mn]
  ), Ci = re(() => {
    const u = new Set(O);
    return ve.nodes.filter((p) => u.has(p.id));
  }, [ve.nodes, O]), Si = F(
    async (u) => {
      const p = String(u), g = _t.current.signal;
      g.throwIfAborted();
      const N = P.current[p], w = () => zt.current.has(u) || Un(u);
      if (w())
        throw new Error("画布有未保存的修改，请保存后重新采用助手结果");
      const C = await Lr({
        projectId: r,
        canvasId: u
      });
      if (g.throwIfAborted(), w() || P.current[p] !== N)
        throw new Error("加载期间画布已修改，已保留本地草稿，请重新采用助手结果");
      const k = dr(
        nr(C.canvas, Me),
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
        ...P.current,
        [p]: k
      };
      P.current = S, ie(S), tt(k);
    },
    [tt, Un, Me, r]
  ), _i = F((u) => {
    const p = Qd(u);
    Et(p), Kd(
      eu,
      String(p)
    );
  }, []), Se = F(
    (u) => {
      Fe(u), u || Be(!1), Kd(
        `${Zd}:${r}`,
        u ? "1" : "0"
      );
    },
    [r]
  ), Ln = bo, uo = ne([]), lo = re(() => {
    const u = Am(
      {
        nodes: ve.nodes,
        assets: a?.assets || [],
        canvasId: G.id,
        assetCateId: q?.id || 0,
        nodeOutput: _n,
        nodePreview: Do,
        assetPreview: (p) => {
          const g = p.version?.content ?? p.name, N = Jn(
            g,
            String(p.kind || "")
          );
          return Yn(N) || (N.text = p.name), N;
        },
        nodeHasResult: Dt
      },
      uo.current
    );
    return uo.current = u, u;
  }, [G.id, q?.id, ve.nodes, a?.assets]), Ho = ne([]), lt = re(() => {
    const u = Dm(
      lo,
      Ho.current
    );
    return Ho.current = u, u;
  }, [lo]), xs = Number(a?.release?.id || a?.project.release_id || 0);
  ue(() => {
    if (!pe?.connection || !q || !Rt) return;
    const u = pe, p = pe.connection;
    if (u.canvasId !== ve.id) return;
    const g = p.handleType === "target";
    if (!ve.nodes.find((S) => S.id === p.nodeId)) return;
    const w = [
      ...Ar.map((S) => pn("power", q, ve.nodes.length, u.position, { power: S })),
      ...Mr.map((S) => pn("agent", q, ve.nodes.length, u.position, { role: S })),
      ...Pp.filter((S) => g ? S.key === "start" : S.key === "save" || S.key === "display").map(
        (S) => pn("function", q, ve.nodes.length, u.position, { functionOption: S })
      )
    ];
    let C = !1;
    async function k() {
      const S = [];
      let E;
      for (let j = 0; j < w.length && !C; j += 6) {
        const ee = await Promise.all(w.slice(j, j + 6).map(async (W) => {
          const J = Fd(ve, p, W, lt);
          let se, le = mr(J);
          if (le.kind === "form" && J.target) {
            try {
              se = (await Ju(c, r, xs, J.target)).params;
            } catch (Ae) {
              return E ||= Gr(Ae, "部分能力的参数读取失败"), null;
            }
            le = mr({ ...J, params: se });
          }
          return le.kind === "invalid" || le.kind === "form" ? null : {
            node: W,
            params: se,
            targetModelId: J.target?.composerDraft?.selectedTargetId,
            description: le.kind === "direct" ? le.description : le.kind === "media" ? "接收媒体素材" : "接收文本"
          };
        }));
        for (const W of ee) W && S.push(W);
      }
      C || st({ menu: u, candidates: S, warning: E });
    }
    return k(), () => {
      C = !0;
    };
  }, [q, ve, lt, c, xs, Ar, Mr, pe, Rt, r]);
  const Yo = F(
    (u = "") => {
      Yc(), Yt(u), Re.current = G.nodes.find((p) => p.id === u) || (Re.current?.id === u ? Re.current : null), He(null), fe("create"), Ht(!0);
    },
    [G.nodes]
  ), It = F(
    (u, p) => {
      if (!Number.isInteger(u) || u <= 0)
        return;
      const g = (C) => {
        const k = String(u), S = C[k];
        if (!S) return C;
        const E = _v(
          p(S),
          S.assetCateId
        );
        return Tv(S, E) ? C : (zt.current.add(u), {
          ...C,
          [k]: E
        });
      }, N = P.current, w = g(N);
      P.current = w, ie((C) => {
        const k = C === N ? w : g(C);
        return P.current = k, k;
      });
    },
    []
  ), Ct = F(
    (u) => {
      q && It(G.id, u);
    },
    [G.id, q, It]
  ), ln = F(
    (u, p, g) => {
      const w = P.current[String(u)]?.nodes.find(
        (k) => k.id === p
      );
      if (Lc(w, g)) return;
      const C = Yg(
        cd(w, g),
        Rt && !!Lt
      );
      C === "defer-materialize" && (co((k) => ({
        ...k,
        [`${u}:${p}`]: { canvasId: u, nodeId: p }
      })), Rt || Zt()), v.current === u && en(
        (k) => kw(k, p, g)
      ), It(u, (k) => {
        const S = k.assetCateId, E = {
          ...k,
          nodes: k.nodes.map(
            (W) => W.id === p ? { ...W, ...g } : W
          )
        };
        if (!Lt)
          return E;
        const j = {
          canvas: E,
          assetCate: Pi(Lt, S),
          powers: Me
        };
        if (C === "materialize")
          return ad({
            ...j,
            sourceNodeId: p
          });
        if (C === "defer-materialize")
          return E;
        const ee = ph(
          E.nodes,
          p
        );
        return ee.length ? $i({
          ...j,
          sourceNodeIds: ee,
          previousNodes: k.nodes
        }) : E;
      });
    },
    [
      Lt,
      Zt,
      Rt,
      Me,
      It
    ]
  );
  ue(() => {
    if (!Rt || !Lt)
      return;
    const u = new Map(Object.entries(qo));
    for (const p of Object.values(Y))
      for (const g of p.nodes)
        g.outputType === "setting" && cd(g, {}) && u.set(`${p.id}:${g.id}`, { canvasId: p.id, nodeId: g.id });
    if (u.size !== 0) {
      Object.keys(qo).length > 0 && co({});
      for (const { canvasId: p, nodeId: g } of u.values())
        It(
          p,
          (N) => ad({
            canvas: N,
            assetCate: Pi(Lt, N.assetCateId),
            powers: Me,
            sourceNodeId: g
          })
        );
    }
  }, [
    Y,
    Lt,
    qo,
    Rt,
    Me,
    It
  ]);
  const Ri = F(
    (u, p) => {
      const g = v.current;
      Sr((N) => ({
        ...N,
        [`${g}:${u}`]: { canvasId: g, nodeId: u, unitIds: p }
      })), Rt || Zt();
    },
    [Zt, Rt]
  );
  ue(() => {
    if (!Rt || !Lt || Object.keys(Bn).length === 0)
      return;
    const u = Object.values(Bn);
    Sr({});
    for (const { canvasId: p, nodeId: g, unitIds: N } of u)
      try {
        It(p, (w) => {
          const C = {
            canvas: w,
            storyNodeId: g,
            assetCate: Pi(Lt, w.assetCateId),
            powers: Me
          };
          return hy({ ...C, unitIds: N });
        });
      } catch (w) {
        o(Gr(w, "创建章节分镜失败"));
      }
  }, [
    Lt,
    Bn,
    Rt,
    Me,
    It
  ]);
  const Ze = F(
    (u, p) => {
      ln(G.id, u, p), v.current === G.id && Le(
        (g) => g?.id === u && !Lc(g, p) ? { ...g, ...p } : g
      );
    },
    [G.id, ln, Le]
  ), Pr = F(
    (u, p, g) => {
      if (!dv(p, g))
        return;
      const N = Number(g.version_id || 0), w = `${u}:${p.id}:${N}`;
      if (Bt.current.has(w))
        return;
      Bt.current.add(w);
      const C = p.title.trim(), k = P.current[String(u)];
      Hf({
        projectId: r,
        nodeKey: p.id,
        versionId: N,
        prompt: cv(p, k)
      }).then((S) => {
        const E = S.title.trim();
        !E || E === C || S.versionId !== N || It(u, (j) => {
          const ee = j.nodes.find(
            (W) => W.id === p.id
          );
          return !ee || ee.titleMode !== "auto" || ee.title.trim() !== C || !Yd(ee) ? j : {
            ...j,
            nodes: j.nodes.map(
              (W) => W.id === p.id ? { ...W, title: E } : W
            )
          };
        });
      }).catch(() => {
        Bt.current.delete(w);
      });
    },
    [r, It]
  ), $n = F(
    async (u) => {
      u.canvasId && zn(u.canvasId);
    },
    [zn]
  ), Ts = F(
    (u, p, g) => {
      const N = {};
      Ct((w) => {
        const C = w.nodes.map(
          (k) => k.id === u ? {
            ...k,
            composerDraft: Yf(p)
          } : k
        );
        return N.canvas = { ...w, nodes: C }, N.canvas;
      }), g?.save === "immediate" && N.canvas && kt(N.canvas).catch(() => {
      });
    },
    [kt, Ct]
  ), Ms = F(
    (u) => {
      Ct((p) => {
        const g = p.edges.filter((N) => N.id !== u);
        return g.length === p.edges.length ? p : { ...p, edges: g };
      });
    },
    [Ct]
  ), Er = Ue(
    (u, p, g) => {
      if (Aa(u.power, u.kind, u.outputType) && !Pm(
        Qr(u, u.resultOutput)?.document
      ))
        return;
      const N = !!(it && it.id !== u.id && Mo(
        it.power,
        it.kind,
        it.outputType
      )), w = xv(u);
      if (St(null), w) {
        mm(), N || (at(null), zo(void 0), Uo(void 0)), Tn(w);
        return;
      }
      if (ts(), Tn(null), N) {
        St(u);
        return;
      }
      zo(p), Uo(g), at(u);
    }
  ), ki = F((u) => {
    Le(
      (p) => p?.id === u.id && p !== u ? u : p
    );
  }, [Le]), As = Ue(
    (u, p, g) => {
      const N = G.id, w = ve.nodes.find((ee) => ee.id === u), C = g ?? w?.asset, k = C?.version, S = jt(k?.content), E = S ?? (w && jt(qs(w)));
      if (w && E?.screenplay && !E.shots.length) {
        const ee = N + ":" + u;
        if (je.current.has(ee)) return;
        je.current.add(ee), (async () => {
          v.current === N && await Ie(w);
        })().catch((W) => o(Gr(W, "剧本生成分镜失败"))).finally(() => je.current.delete(ee));
        return;
      }
      const j = k?.updated_at || k?.created_at;
      if (!S || !C?.id || !k?.id || k.id !== C.version_id || !j) {
        o("未读取到已保存的分镜版本，请刷新后再确认");
        return;
      }
      o(""), on({
        canvasId: N,
        nodeId: u,
        assetId: C.id,
        versionId: k.id,
        expectedUpdatedAt: j,
        document: S,
        onConfirmed: p
      });
    }
  ), Vn = gn?.canvasId === G.id ? gn : null;
  async function xi(u) {
    if (Bo || !Vn)
      return !1;
    const { canvasId: p, nodeId: g, assetId: N, versionId: w, expectedUpdatedAt: C, onConfirmed: k } = Vn;
    hs(!0);
    try {
      const S = await sp({
        projectId: r,
        assetId: N,
        versionId: w,
        expectedUpdatedAt: C,
        productionPlan: u
      });
      return h(p, g, S), k?.(S), on((E) => E === Vn ? null : E), !0;
    } catch (S) {
      return o(Gr(S, "确认分镜失败")), !1;
    } finally {
      hs(!1);
    }
  }
  const Jo = F(
    (u, p) => {
      en((g) => {
        const N = G.nodes.find(
          (k) => k.id === u
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
            feedbackRequests: p(Io(C))
          }
        };
      });
    },
    [G.nodes]
  ), fo = F((u) => {
    const p = new Set(u.filter(Boolean));
    if (p.size !== 0) {
      if (ut.current && p.has(ut.current.nodeId)) {
        const g = ut.current;
        ut.current = null, g.reject(new Error(il));
      }
      Ft(
        (g) => g && p.has(g.node.id) ? null : g
      ), en((g) => {
        const N = { ...g };
        let w = !1;
        for (const C of p) {
          const k = N[C] || {};
          N[C] = {
            ...k,
            feedbackRequests: []
          }, w = !0;
        }
        return w ? N : g;
      });
    }
  }, []), Je = F((u) => {
    !u || !u.id || d((p) => p && {
      ...p,
      assets: or(p.assets, [u])
    });
  }, []), m = F(
    (u, p) => {
      const g = sa(
        p,
        u.asset
      );
      Je(g);
      const N = ur(u, g);
      u.id.startsWith("asset-detail-") || Ze(u.id, N), Le(
        (w) => w?.id === u.id ? { ...w, ...N } : w
      );
    },
    [Ze, Je, Le]
  ), h = F(
    (u, p, g) => {
      const N = P.current[String(u)]?.nodes.find((w) => w.id === p);
      N && (v.current === u ? m(N, g) : (Je(g), ln(u, p, ur(N, g))));
    },
    [m, ln, Je]
  ), x = F(
    (u) => {
      if (!xn)
        return;
      const p = G.nodes.find(
        (w) => w.id === xn.nodeId
      );
      if (!p)
        return;
      const g = qr(u), N = ur(
        p,
        g
      );
      Je(g), Ze(p.id, N);
    },
    [
      G.nodes,
      xn,
      Ze,
      Je
    ]
  ), B = F(
    ({ node: u, prompt: p }) => {
      const g = mc(u, p), N = ha(
        Io(u),
        g
      );
      return Jo(
        u.id,
        (w) => ha(w, g)
      ), wn(!1), new Promise((w, C) => {
        ut.current = {
          nodeId: u.id,
          recordId: g.id,
          resolve: w,
          reject: C
        }, Ft({
          node: { ...u, feedbackRequests: N },
          recordId: g.id,
          prompt: p
        });
      });
    },
    [Jo]
  ), D = F(
    async (u) => {
      const p = ut.current;
      if (!(!p || On)) {
        wn(!0);
        try {
          await p.submit?.(u), Jo(
            p.nodeId,
            (g) => Qy(g, p.recordId, u)
          ), ut.current = null, Ft(null), p.resolve(u);
        } catch (g) {
          o(g instanceof Error ? g.message : "提交反馈失败");
        } finally {
          wn(!1);
        }
      }
    },
    [Jo, On]
  ), z = F(() => {
    Ft(null);
  }, []), te = F(
    (u, p) => {
      if (ut.current?.nodeId === u.id && ut.current.recordId === p.id && p.status === "pending") {
        Ft({
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
          wn(!1), ut.current = {
            nodeId: u.id,
            recordId: p.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (N) => {
              await Ul(
                r,
                g.run,
                g.pending,
                g.prompt,
                N
              ), window.setTimeout(() => ao.current?.(), 0);
            }
          }, Ft({
            node: u,
            recordId: p.id,
            prompt: g.prompt
          });
          return;
        }
      }
      Ft({
        node: u,
        recordId: p.id,
        prompt: {
          ...p.prompt,
          values: p.values || p.prompt.values || {}
        }
      });
    },
    [r]
  ), T = F(
    (u) => {
      const p = AbortSignal.any([
        _t.current.signal,
        Cr.current.signal
      ]), g = (w) => {
        Eo((C) => p.aborted || v.current !== u ? C : typeof w == "function" ? w(C) : w);
      }, N = {
        enqueue: (w, C) => Fo.enqueue(
          w,
          (k) => !p.aborted && v.current === u ? C(k) : k
        ),
        flush: Fo.flush
      };
      return {
        setRunningNode: g,
        getRunningNode: (w) => !p.aborted && v.current === u ? kn.current[w] : void 0,
        runningNodeBatcher: N,
        consumerSignal: p,
        subscribeRun: (w, C) => {
          const k = an.current.subscribe(
            r,
            u,
            w,
            C
          ), S = Ye.current.find(
            (E) => E.canvas_id === u && E.request_id === w && In(E.status)
          );
          return S && C(S), k;
        }
      };
    },
    [r, Fo]
  ), H = F(
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
        onCanvasRunChange: bt,
        appliedResultKeys: io.current,
        ownsNodeResult: (k, S) => Yi(
          Ye.current,
          C,
          k,
          S
        ),
        ...w,
        nodes: N,
        edges: g.edges,
        viewport: g.viewport,
        canvasUpdatedAt: g.updatedAt,
        flushCanvasSave: kt,
        onNodeResult: Ze,
        onAssetCreated: Je,
        ...T(C),
        requestFlowFeedback: B,
        requestNodeTitle: (k, S) => Pr(g.id, k, S)
      };
    },
    [
      r,
      bt,
      kt,
      Pr,
      B,
      T,
      a,
      Ze,
      Je
    ]
  ), Q = F(
    async (u) => {
      !a || u?.consumerSignal?.aborted || await Nt(
        r,
        a,
        P.current,
        "recovery",
        {
          canvasId: u?.canvasId || v.current,
          runIds: [Number(u?.canvasRun?.run_id || 0)]
        }
      );
    },
    [Nt, r, a]
  ), Pe = F(
    async (u) => {
      if (!a || !q)
        return;
      let p = null;
      try {
        fo(
          My(
            u.id,
            ve.nodes,
            ve.edges
          )
        ), p = H({
          assetCate: q,
          startNode: u,
          canvas: {
            ...G,
            nodes: ve.nodes,
            edges: ve.edges,
            viewport: G.viewport
          }
        }), await Wi(p), await $n(p);
      } catch (g) {
        if (p?.consumerSignal?.aborted || Xy(g) || Bi(g))
          return;
        const N = g instanceof Error ? g.message : "开始节点执行失败", w = p;
        if (w && !ot(
          w,
          w.canvasRun,
          u.id
        ))
          return;
        w?.setRunningNode?.(
          (C) => ot(
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
        dn(p?.canvasRun), await Q(p);
      }
    },
    [
      q,
      G,
      ve.edges,
      ve.nodes,
      fo,
      H,
      $n,
      Q,
      dn,
      a
    ]
  ), me = F(
    async (u) => {
      if (!a || !q)
        return;
      const p = P.current[String(G.id)] || G, g = p.nodes.find(
        (j) => j.id === u
      );
      if (!g) {
        o("分镜脚本节点不存在");
        return;
      }
      const N = (j) => Dt(j) && !ar(j, p.nodes), w = ul(
        p.nodes,
        N
      ).find((j) => j.sourceNodeId === u);
      if (!w) {
        o("当前分镜脚本尚未生成制作组");
        return;
      }
      const C = ll(
        w,
        p.nodes,
        p.edges,
        N
      );
      if (C.blockedReason) {
        o(C.blockedReason);
        return;
      }
      const k = oc(u), S = H({
        assetCate: q,
        startNode: g,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: bt,
        canvas: p
      });
      fo(C.pendingNodeIds), S.setRunningNode?.((j) => ({
        ...j,
        [k]: {
          nodeId: k,
          title: `${g.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let E = 650;
      try {
        await Wi(S);
      } catch (j) {
        if (S.consumerSignal?.aborted || Bi(j))
          E = 0;
        else if (ot(S, S.canvasRun, k)) {
          E = 1400;
          const ee = j instanceof Error ? j.message : "制作区执行失败";
          S.setRunningNode?.(
            (W) => ot(S, S.canvasRun, k) ? {
              ...W,
              [k]: {
                ...W[k] || {
                  nodeId: k,
                  title: `${g.title || "分镜脚本"}制作区`,
                  startedAt: Date.now(),
                  progress: 0
                },
                status: "error"
              }
            } : W
          ), o(ee);
        }
      } finally {
        dn(S.canvasRun), (S.canvasRun?.node_results || []).some(
          (ee) => ee.node_key && vr(ee) === "success"
        ) && !S.consumerSignal?.aborted && (Ct(
          (ee) => $i({
            canvas: ee,
            sourceNodeIds: [u],
            assetCate: q,
            powers: Me
          })
        ), await $n(S)), S.consumerSignal?.aborted || Jr(S, [k], E), await Q(S);
      }
    },
    [
      G,
      q,
      fo,
      H,
      $n,
      Me,
      Q,
      dn,
      bt,
      a,
      Ct
    ]
  ), Ie = F(
    async (u, p) => {
      if (!a || !q)
        return;
      const g = P.current[String(G.id)] || G, N = g.nodes.find((J) => J.id === u.id) || u, w = Tw({
        ...N,
        composerDraft: {
          ...N.composerDraft || {},
          ...u.composerDraft || {}
        }
      });
      if (Jf(w)) {
        const J = Qr(
          w,
          w.resultOutput
        );
        if (!J) throw new Error("请等待作品加载完成后再发送");
        if (Jd(J.document)) {
          Er(w);
          return;
        }
        if (be !== "create") throw new Error("当前作品只读，无法重新生成");
        const se = `${g.id}:${w.id}`;
        if (J.document.status === "running" || Vt(kn.current[w.id]) || Oo.current.has(se))
          throw new Error("当前灵感正在生成，请等待完成后再发送");
        Oo.current.add(se);
        try {
          const le = await tm({
            project_id: r,
            canvas_id: g.id,
            work_asset_id: J.work_asset_id,
            expected_work_version_id: J.work_version_id,
            expected_work_revision: J.work_revision,
            action: "generate_inspirations",
            instruction: w.composerDraft?.prompt || ""
          });
          ln(g.id, w.id, {
            resultOutput: { writing: le },
            runError: ""
          });
        } finally {
          Oo.current.delete(se);
        }
        return;
      }
      const C = ky(
        w.id,
        p?.targetNodeIds
      ), k = Ty(
        g.nodes.map(
          (J) => J.id === w.id ? w : J
        ),
        C
      ), S = new Map(
        k.map((J) => [J.id, J])
      ), E = C.map((J) => S.get(J)).filter((J) => !!J), j = (J) => {
        let se = J;
        for (const le of C)
          !se[le] || !ot(W, W.canvasRun, le) || (se === J && (se = { ...J }), delete se[le]);
        return se;
      }, ee = jl(
        u.id,
        k,
        g.edges
      ), W = H({
        assetCate: q,
        startNode: w,
        singleNode: !0,
        targetNodeIds: p?.targetNodeIds,
        onCanvasRunChange: bt,
        canvas: g,
        nodes: k,
        runInput: {
          _manual_input_context: ee || void 0,
          _agent_turn_input: p?.agentInput,
          _storyboard_action: p?.storyboardAction,
          manual_node_id: u.id
        }
      });
      for (const J of E)
        Ze(J.id, { runError: "" });
      W.setRunningNode?.((J) => {
        const se = { ...J };
        for (const le of E) {
          const Ae = J[le.id];
          se[le.id] = {
            ...Ae || {},
            ...Fa(Ae),
            nodeId: le.id,
            title: le.title,
            startedAt: Ae?.startedAt || Date.now(),
            progress: Math.max(Ae?.progress || 0, 8),
            status: "running",
            ...le.id === w.id && p?.agentInput ? { agent: nm() } : {}
          };
        }
        return se;
      });
      try {
        await Wi(W), await $n(W);
      } catch (J) {
        if (W.consumerSignal?.aborted || !ot(W, W.canvasRun, w.id))
          return;
        if (Bi(J)) {
          Ze(w.id, { runError: "" }), W.setRunningNode?.(j);
          return;
        }
        throw Ze(w.id, {
          runError: J instanceof Error ? J.message : "节点运行失败"
        }), W.setRunningNode?.(
          (se) => ot(W, W.canvasRun, w.id) ? {
            ...se,
            [w.id]: {
              ...se[w.id] || {
                nodeId: w.id,
                title: w.title,
                startedAt: Date.now()
              },
              progress: 92,
              status: "error"
            }
          } : se
        ), Jr(W, C, 1400), J;
      } finally {
        dn(W.canvasRun), await Q(W);
      }
      w.outputType === "setting" && W.canvasRun?.status === "success" && v.current === g.id && await me(w.id);
    },
    [
      q,
      G,
      H,
      $n,
      r,
      Q,
      dn,
      bt,
      a,
      me,
      Er,
      ln,
      Ze,
      be
    ]
  ), nt = F(
    async (u) => {
      if (!q)
        throw new Error("当前分类不存在");
      const p = T(G.id);
      let g;
      const N = (C) => {
        const k = g;
        g = {
          nodeId: u.id,
          title: u.title,
          startedAt: k?.startedAt || Date.now(),
          progress: C === "success" ? 100 : C === "error" ? 92 : 0,
          status: C
        };
        const S = g;
        p.setRunningNode(
          (E) => k && E[u.id] !== k ? E : { ...E, [u.id]: S }
        ), (C === "success" || C === "error") && window.setTimeout(
          () => p.setRunningNode(
            (E) => E[u.id] === S ? wu(E, u.id) : E
          ),
          C === "success" ? 650 : 1200
        );
      }, w = !wi(u);
      w && N("running");
      try {
        const C = await Zv({
          node: u,
          projectId: r,
          canvasId: G.id,
          assetCate: q,
          inputContext: u.inputContext || null,
          onNodeResult: Ze,
          onAssetCreated: Je,
          onRunStartNode: Pe,
          onOpenImportPicker: Yo
        });
        return w && N("success"), C;
      } catch (C) {
        throw w && N("error"), C;
      }
    },
    [
      G.id,
      q,
      T,
      Yo,
      r,
      Pe,
      Ze,
      Je
    ]
  );
  ue(() => {
    a && Wo(dt, G, a);
  }, [G, Wo, dt, a]);
  function xt(u) {
    return A.current != null ? !1 : (A.current = u, M(u), !0);
  }
  function $e() {
    A.current = null, M(null);
  }
  async function Qe() {
    const u = P.current[String(v.current)] || G;
    if (!u.id)
      return !0;
    try {
      return await kt(u), !0;
    } catch {
      return !1;
    }
  }
  function $t() {
    $([]), en({}), Eo({}), An(null), He(null), Rn(null), at(null), St(null), on(null), Tn(null), zo(void 0), Ht(!1), Yt(""), Re.current = null, to(null), Pn(!1), Ut.current = null, Xt.current = [0], oo([]), En(1), ae(!1), Dn(!1), ro("");
  }
  async function Xo(u) {
    if (u === v.current) return !0;
    if (A.current != null)
      return !1;
    const p = a?.canvasList.find((g) => g.id === u);
    if (!p)
      return o("目标画布不存在"), !1;
    if (!xt(p.assetCateId)) return !1;
    try {
      if (!await Qe()) return !1;
      const g = String(u);
      if (!Object.prototype.hasOwnProperty.call(P.current, g))
        try {
          const w = await Lr({
            projectId: r,
            canvasId: u
          }), C = dr(
            nr(w.canvas, Me),
            w.assets
          );
          d(
            (S) => S && {
              ...S,
              assets: or(S.assets, w.assets),
              canvasList: w.canvasList.length > 0 ? w.canvasList : S.canvasList
            }
          );
          const k = {
            ...P.current,
            [g]: C
          };
          P.current = k, ie(k), tt(C);
        } catch (w) {
          return o(w instanceof Error ? w.message : "加载画布失败"), !1;
        }
      if (v.current = u, y(u), R.current = p.assetCateId, I(p.assetCateId), sr(u), $t(), !a)
        return !0;
      const N = P.current[g] || Uc(p.assetCateId, u, p.name);
      return Wo(dt, N, a), Nt(
        r,
        a,
        P.current,
        "recovery",
        { canvasId: u }
      ), !0;
    } finally {
      $e();
    }
  }
  async function Or(u) {
    const p = (a?.canvasList || []).filter((g) => g.assetCateId === u).sort((g, N) => g.sort - N.sort || g.id - N.id)[0];
    if (p) return Xo(p.id);
    if (!a || A.current != null || !xt(u)) return !1;
    try {
      if (!await Qe()) return !1;
      const g = await Lr({
        projectId: r,
        canvasId: 0,
        assetCateId: u
      }), N = dr(
        nr(g.canvas, Me),
        g.assets
      ), w = N.id, C = {
        ...P.current,
        [String(w)]: N
      };
      return P.current = C, ie(C), tt(N), d(
        (k) => k && {
          ...k,
          assets: or(k.assets, g.assets),
          canvasList: g.canvasList.length > 0 ? g.canvasList : k.canvasList
        }
      ), v.current = w, y(w), R.current = u, I(u), sr(w), $t(), Nt(r, a, C, "recovery", {
        canvasId: w
      }), !0;
    } catch (g) {
      return o(
        g instanceof Error ? g.message : "加载输出类型失败"
      ), !1;
    } finally {
      $e();
    }
  }
  async function Fr(u) {
    if (q) {
      if (!xt(q.id))
        throw new Error("正在切换画布，请稍后重试");
      try {
        if (!await Qe())
          throw new Error("当前画布保存失败，未创建新画布");
        const p = await rp({
          projectId: r,
          assetCateId: q.id,
          name: u
        }), g = p.canvas;
        if (!g?.id) throw new Error("新画布数据为空");
        const N = nr(g, Me), w = {
          ...P.current,
          [String(g.id)]: N
        };
        P.current = w, ie(w), tt(N), d(
          (C) => C && {
            ...C,
            canvasList: p.canvasList,
            initialCanvasId: g.id,
            initialAssetCateId: g.assetCateId
          }
        ), v.current = g.id, y(g.id), R.current = g.assetCateId, I(g.assetCateId), sr(g.id), $t(), po();
      } catch (p) {
        throw o(p instanceof Error ? p.message : "创建画布失败"), p;
      } finally {
        $e();
      }
    }
  }
  async function Zo(u, p) {
    try {
      const g = await op({ projectId: r, canvasId: u, name: p });
      d(
        (N) => N && { ...N, canvasList: g.canvasList }
      ), ie((N) => {
        const w = N[String(u)];
        if (!w) return N;
        const C = {
          ...N,
          [String(u)]: { ...w, name: p }
        };
        return P.current = C, C;
      }), po();
    } catch (g) {
      throw o(g instanceof Error ? g.message : "重命名画布失败"), g;
    }
  }
  async function Ds(u) {
    if (q)
      try {
        const p = await np({
          projectId: r,
          assetCateId: q.id,
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
  async function Qo(u) {
    if (!xt(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      const p = u === v.current, g = P.current[String(u)];
      g && await kt(g);
      const N = await tp({ projectId: r, canvasId: u });
      if (bi(u), d(
        (w) => w && { ...w, canvasList: N.canvasList }
      ), P.current[String(u)]) {
        const w = { ...P.current };
        delete w[String(u)], P.current = w, ie(w);
      }
      if (p && N.activeCanvasId) {
        const w = N.canvasList.find(
          (k) => k.id === N.activeCanvasId
        );
        let C = P.current[String(N.activeCanvasId)];
        if (!C) {
          const k = await Lr({
            projectId: r,
            canvasId: N.activeCanvasId
          });
          C = dr(
            nr(k.canvas, Me),
            k.assets
          );
          const S = {
            ...P.current,
            [String(C.id)]: C
          };
          P.current = S, ie(S), d(
            (E) => E && {
              ...E,
              assets: or(E.assets, k.assets),
              canvasList: N.canvasList
            }
          );
        }
        tt(C), v.current = C.id, y(C.id), R.current = w?.assetCateId || C.assetCateId, I(w?.assetCateId || C.assetCateId), sr(C.id), $t(), a && Nt(
          r,
          a,
          P.current,
          "recovery",
          { canvasId: C.id }
        );
      }
      Dr(R.current), po();
    } catch (p) {
      throw o(p instanceof Error ? p.message : "删除画布失败"), p;
    } finally {
      $e();
    }
  }
  async function Ps(u) {
    if (!xt(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      if (!await Qe())
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
      const k = dr(
        nr(g, Me),
        N
      ), S = {
        ...P.current,
        [String(k.id)]: k
      };
      P.current = S, ie(S), tt(k), d(
        (E) => E && {
          ...E,
          assets: or(E.assets, N),
          canvasList: w,
          initialCanvasId: k.id,
          initialAssetCateId: k.assetCateId
        }
      ), v.current = k.id, y(k.id), R.current = k.assetCateId, I(k.assetCateId), sr(k.id), L(
        (E) => E.filter((j) => j.id !== k.id)
      ), V(!1), $t(), po(), a && Nt(r, a, S, "recovery", {
        canvasId: k.id
      }), C && o(C);
    } catch (p) {
      throw o(p instanceof Error ? p.message : "恢复画布失败"), p;
    } finally {
      $e();
    }
  }
  function po() {
    const u = Number(a?.project.team_id || 0);
    kg(u > 0 ? { teamID: u } : void 0);
  }
  function er(u) {
    An((p) => ({
      nodeId: u,
      nonce: (p?.nonce || 0) + 1
    }));
  }
  const nf = F((u) => {
    An((p) => !p || p.nodeId !== u.nodeId || p.nonce !== u.nonce ? p : null);
  }, []);
  async function of(u, p, g, N, w = {}) {
    const C = _t.current?.signal, k = JSON.stringify([
      u,
      w.canvasId || 0,
      N,
      N === "active" ? [] : [...new Set(w.runIds || [])].sort((E, j) => E - j)
    ]), S = Ir.current;
    if (!(C?.aborted || S.has(k))) {
      S.add(k);
      try {
        const E = w.canvasId ? g[String(w.canvasId)] : void 0, j = E ? Ye.current.filter(
          (ft) => $s(ft, E)
        ) : Ye.current, ee = N === "active" ? Hw(j) : [], W = [...new Set(
          (w.runIds?.length ? w.runIds : [
            ...ee,
            ...j.filter((ft) => ft.detailsPending)
          ].map((ft) => Number(ft.run_id || 0))).filter((ft) => ft > 0)
        )];
        if (N === "active" && W.length === 0) return;
        const J = {
          projectId: u,
          scope: N,
          canvasId: w.canvasId,
          runIds: W,
          summaryOnly: !0
        };
        let se;
        if (N === "recovery" && W.length === 0) {
          const ft = await jc({ ...J, limit: 50 }), Ff = await Oi(
            { ...J, scope: "active" },
            C
          );
          se = Hi(
            jr(ft.items),
            jr(Ff)
          );
        } else
          se = jr(
            await Oi(J, C)
          );
        const le = Zw(
          se,
          j,
          N === "recovery" ? g : void 0
        );
        if (le.length === 0 || C?.aborted) return;
        const Ae = new Set(le);
        Ti(
          u,
          se.filter((ft) => Ae.has(Number(ft.run_id || 0))).map((ft) => ({ ...ft, detailsPending: !0 })),
          g,
          p
        );
        const Ur = jr(
          await Oi(
            { ...J, runIds: le, summaryOnly: !1 },
            C
          )
        );
        if (C?.aborted) return;
        Ti(
          u,
          Ur,
          g,
          p
        );
      } catch {
      } finally {
        S.delete(k);
      }
    }
  }
  function Ti(u, p, g, N) {
    const w = Hi(
      Ye.current,
      p
    );
    Ye.current = w, ze(w);
    const C = new Map(w.map((S) => [ht(S), S])), k = p.map((S) => C.get(ht(S))).filter((S) => !!S);
    for (const S of Object.values(g))
      Wo(k, S, N);
    for (const S of k) {
      const E = Fn.current.get(
        `${u}:${String(S.request_id || "")}`
      );
      if (E) {
        for (const j of Xr(S))
          E.finishedNodeIds.add(j);
        In(S.status) && E.controller.abort();
      }
      an.current.publish(u, S);
    }
  }
  async function Br(u, p = 0) {
    const g = v.current, N = _t.current?.signal;
    if (Ut.current || N?.aborted) return;
    const w = {}, C = () => !N?.aborted && v.current === g && Ut.current === w, k = Xt.current[p] || 0;
    Ut.current = w, Dn(!0), ro("");
    try {
      const S = await jc({
        projectId: u,
        canvasId: g,
        scope: "history",
        beforeId: k,
        limit: 20
      });
      if (!C()) return;
      oo(
        jr(S.items)
      ), En(p + 1), ae(S.hasMore);
      const E = Xt.current.slice(0, p + 1);
      S.hasMore && S.beforeId > 0 && (E[p + 1] = S.beforeId), Xt.current = E;
    } catch (S) {
      if (!C()) return;
      ro(
        S instanceof Error ? S.message : "读取画布运行记录失败"
      );
    } finally {
      C() && (Ut.current = null, Dn(!1));
    }
  }
  const Mi = re(
    () => Fl(
      dt.filter(
        (u) => $s(u, G)
      )
    ),
    [G, dt]
  ), Cc = Mi.length > 0, Sc = Cc || dt.some(
    (u) => u.detailsPending && $s(u, G)
  ), rf = Cc || cw(Ce);
  async function _c(u) {
    const p = !u, g = v.current, N = P.current[String(g)], w = T(g).consumerSignal, C = () => !w.aborted && v.current === g;
    if (p && (Ns || hn.size > 0) || !p && u?.some(
      (S) => hn.has(ht(S))
    ))
      return;
    let k = [];
    p && Ot(!0);
    try {
      let S = u || [], E = 0, j = S.length;
      if (p) {
        const J = await up(r, g);
        S = J.items.map(ko), E = J.failedCount, j = J.count;
      } else
        S = Yw(S);
      if (j === 0)
        return;
      p || (k = S.map(ht), yt((se) => {
        const le = new Set(se);
        for (const Ae of k)
          le.add(Ae);
        return le;
      }), S = (await Promise.allSettled(
        S.map(
          (se) => lp({
            projectId: r,
            runId: Number(se.run_id || 0),
            requestId: String(se.request_id || "")
          })
        )
      )).flatMap((se, le) => {
        if (se.status === "rejected")
          return E += 1, [];
        const Ae = ko(se.value);
        return [
          {
            ...S[le],
            status: Ae.status,
            error: Ae.error
          }
        ];
      }));
      const ee = Jw(S), W = S.filter((J) => J.status === "canceled");
      if (ee.size > 0) {
        const J = (/* @__PURE__ */ new Date()).toISOString(), se = (Ae) => Ae.map((Ur) => {
          const ft = Xw(ee, Ur);
          return ft ? { ...Ur, status: ft, updated_at: J } : Ur;
        }), le = se(Ye.current);
        Ye.current = le, ze(le), C() && oo(se);
      }
      if (N && a)
        for (const J of W)
          kc(
            { ...J, canvas_id: g },
            N,
            a,
            []
          );
      E > 0 && C() && o(
        E === j ? "停止运行失败，请稍后重试" : `${E} 个运行停止失败，请稍后重试`
      ), $o && C() && Br(
        r,
        Math.max(0, _e - 1)
      ), window.setTimeout(() => {
        C() && ao.current?.();
      }, 0);
    } catch (S) {
      C() && o(
        S instanceof Error ? S.message : "停止画布运行失败"
      );
    } finally {
      k.length > 0 && yt((S) => {
        const E = new Set(S);
        for (const j of k)
          E.delete(j);
        return E;
      }), p && Ot(!1);
    }
  }
  function sf() {
    Tr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => _c()
    });
  }
  function Rc(u) {
    Tr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => _c([u])
    });
  }
  ao.current = a ? () => Nt(
    r,
    a,
    P.current,
    "active",
    { canvasId: v.current }
  ) : null, ue(() => {
    if (!a || !Sc)
      return;
    let u = !1, p = !1, g;
    const N = async () => {
      if (!(u || p)) {
        window.clearTimeout(g), p = !0;
        try {
          await ao.current?.();
        } finally {
          p = !1, u || (g = window.setTimeout(
            N,
            document.hidden ? 15e3 : wa
          ));
        }
      }
    }, w = () => {
      document.hidden || N();
    };
    return N(), window.addEventListener("online", w), window.addEventListener("focus", w), document.addEventListener("visibilitychange", w), () => {
      u = !0, window.clearTimeout(g), window.removeEventListener("online", w), window.removeEventListener("focus", w), document.removeEventListener("visibilitychange", w);
    };
  }, [l, Sc, r, a]), ue(() => {
    const u = Fn.current, p = Vo.current, g = [];
    if (a)
      for (const w of Mi) {
        const C = w.run, k = String(C.request_id || "").trim();
        !k || Is.has(k) || g.push({
          key: `${r}:${k}`,
          canvasId: Number(C.canvas_id || v.current),
          requestId: k,
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
        for (const ee of Xr(w.run))
          C.finishedNodeIds.add(ee);
        continue;
      }
      const k = new AbortController(), S = {
        controller: k,
        managedNodeIds: w.managedNodeIds,
        finishedNodeIds: Xr(w.run)
      };
      u.set(w.key, S);
      const E = {
        ...T(w.canvasId),
        canUpdateNode: (ee) => !k.signal.aborted && S.managedNodeIds.has(ee) && !S.finishedNodeIds.has(ee) && Yi(
          Ye.current,
          w.canvasId,
          w.run,
          ee
        )
      };
      (async () => {
        for (; !k.signal.aborted; ) {
          try {
            await yu({
              projectId: r,
              requestId: w.requestId,
              lastId: p.get(w.key) || "0-0",
              signal: k.signal,
              onFrame: (ee) => {
                if (k.signal.aborted || v.current !== w.canvasId) return;
                ee.stream_id && p.set(w.key, ee.stream_id), Yr(E, S.managedNodeIds, !1);
                const W = Lw(
                  E,
                  ee,
                  S.managedNodeIds,
                  S.finishedNodeIds
                );
                W && (w.run = gc(w.run, W), Ti(
                  r,
                  [w.run],
                  P.current,
                  a
                ));
              }
            });
            return;
          } catch {
            if (k.signal.aborted) return;
          }
          Yr(E, S.managedNodeIds, !0), await Al(wa, k.signal);
        }
      })().catch(() => {
      });
    }
  }, [
    Is,
    r,
    Mi,
    T,
    a
  ]), ue(
    () => () => {
      for (const u of Fn.current.values())
        u.controller.abort();
      Fn.current.clear(), Vo.current.clear();
    },
    []
  );
  function af(u, p, g) {
    const N = u.filter(
      (S) => $s(S, p)
    );
    if (N.length === 0)
      return;
    const w = new Map(p.nodes.map((S) => [S.id, S])), C = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set();
    for (const S of N) {
      const E = new Set(
        _o(S).filter((W) => k.has(W) ? !1 : (k.add(W), !0))
      );
      if (E.size === 0)
        continue;
      const ee = Na(
        S,
        p
      ) ? [] : (S.node_results || []).filter((W) => {
        const J = W.node_key;
        return !J || !E.has(J) || C.has(J) || Ia(w.get(J), S, W) ? !1 : (C.add(J), !0);
      });
      kc(
        S,
        p,
        g,
        ee,
        E
      );
    }
  }
  function kc(u, p, g, N = u.node_results || [], w) {
    const C = tv(u, p.nodes);
    if (!C)
      return;
    const k = Di(g, p.assetCateId);
    if (!k)
      return;
    const S = {
      projectId: r,
      canvasId: p.id,
      assetCate: k,
      space: g,
      startNode: C,
      nodes: p.nodes,
      edges: p.edges,
      viewport: p.viewport,
      onNodeResult: (E, j) => ln(p.id, E, j),
      onAssetCreated: Je,
      ...T(p.id),
      consumerSignal: _t.current?.signal,
      requestFlowFeedback: B,
      requestNodeTitle: (E, j) => Pr(p.id, E, j),
      canvasRun: u,
      appliedResultKeys: io.current,
      ownsNodeResult: (E, j) => Yi(
        Ye.current,
        p.id,
        E,
        j
      )
    };
    Ll(S, N), El(S, u.node_results || []), cf(S, u, C), Zr(S, u, w), yc(S, u, w);
  }
  function cf(u, p, g) {
    p.single_node || String(p.status || "").trim().toLowerCase() !== "success" || !jt(g.resultOutput) || It(
      u.canvasId,
      (N) => $i({
        canvas: N,
        sourceNodeIds: [g.id],
        assetCate: u.assetCate,
        powers: Me
      })
    );
  }
  function tr(u, p, g) {
    if (!q)
      return null;
    const N = pn(
      u,
      q,
      G.nodes.length,
      p,
      g
    ), w = a ? Di(a, _a(N) || q.id) : q;
    u === "asset" && (N.cardinality = w.cardinality);
    const C = u === "asset" && g?.replaceSingleAssetNode ? _a(N) || Number(w.id || 0) : 0, k = C ? Bd(
      G.nodes,
      G.edges,
      C,
      g?.connectFromNodeId
    ) : null, S = k ? zd(
      G.nodes,
      G.edges,
      C,
      g?.connectFromNodeId,
      k.id
    ) : /* @__PURE__ */ new Set(), E = k?.id || N.id;
    if (Ct((j) => {
      let ee = j.edges;
      const W = C ? Bd(
        j.nodes,
        j.edges,
        C,
        g?.connectFromNodeId
      ) : null;
      if (W) {
        const se = zd(
          j.nodes,
          j.edges,
          C,
          g?.connectFromNodeId,
          W.id
        );
        ee = j.edges.filter(
          (Ae) => !se.has(Ae.from) && !se.has(Ae.to)
        ), g?.connectFromNodeId ? ee = Kn(
          ee,
          g.connectFromNodeId || "",
          W.id,
          j.nodes
        ) : g?.connectToNodeId && (ee = Kn(
          ee,
          W.id,
          g.connectToNodeId || "",
          j.nodes
        ));
        const le = j.nodes.filter((Ae) => !se.has(Ae.id)).map(
          (Ae) => Ae.id === W.id ? Zi(Ae, N) : Ae
        );
        return {
          ...j,
          nodes: le,
          edges: Tt(le, ee)
        };
      }
      g?.connectFromNodeId ? ee = Kn(
        ee,
        g.connectFromNodeId || "",
        N.id,
        [...j.nodes, N]
      ) : g?.connectToNodeId && (ee = Kn(ee, N.id, g.connectToNodeId || "", [...j.nodes, N]));
      const J = Hs(
        [...j.nodes, N],
        N.id,
        { x: N.x, y: N.y }
      );
      return {
        ...j,
        nodes: J,
        edges: Tt(J, ee)
      };
    }), k) {
      const j = Zi(k, N);
      en((ee) => {
        const W = { ...ee };
        for (const J of S)
          delete W[J];
        return W[k.id] = {
          ...W[k.id] || {},
          ...Cv(j)
        }, W;
      });
    }
    return g?.selectCreated !== !1 && ($([E]), er(E)), fe("create"), He(null), k ? Zi(k, N) : N;
  }
  function df(u, p) {
    if (!q)
      return;
    if (vd(G.nodes).has(u.id)) {
      o("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const g = wv(
      u,
      q.id,
      G.nodes.length,
      p
    );
    Ct((N) => {
      const w = Hs(
        [...N.nodes, g],
        g.id,
        { x: g.x, y: g.y }
      );
      return {
        ...N,
        nodes: w,
        edges: Tt(w, N.edges)
      };
    }), en((N) => {
      const w = N[u.id];
      return w ? { ...N, [g.id]: w } : N;
    }), $([g.id]), er(g.id), He(null);
  }
  function uf(u, p = {}) {
    const g = kl(
      G.nodes,
      u
    );
    if (g.size === 0)
      return;
    const N = vd(G.nodes);
    if (!p.allowStoryboardFrame && [...g].some((w) => N.has(w))) {
      o(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      );
      return;
    }
    Ct((w) => {
      const C = Up(
        w.nodes,
        g
      ).filter((k) => !g.has(k.id));
      return li({
        canvas: { ...w, nodes: C, edges: Tt(C, w.edges) },
        assetCate: q,
        powers: Me
      });
    }), en(
      (w) => Td(w, g)
    ), Eo((w) => Td(w, g)), $([]), An(
      (w) => w && g.has(w.nodeId) ? null : w
    ), at(
      (w) => w && g.has(w.id) ? null : w
    ), St(
      (w) => w && (g.has(w.id) || it && g.has(it.id)) ? null : w
    ), Tn(
      (w) => w && g.has(w.nodeId) ? null : w
    ), Yt(
      (w) => g.has(w) ? "" : w
    ), Re.current && g.has(Re.current.id) && (Re.current = null);
  }
  function xc(u, p) {
    tr("asset", p, { asset: u });
  }
  function lf(u, p, g) {
    if (!u)
      return;
    const N = G.nodes.find((C) => C.id === u) || (g?.id === u ? g : Re.current?.id === u ? Re.current : null);
    if (!N)
      return;
    const w = ni(p.version?.content) || Pt(p.version?.content);
    Ze(
      u,
      Wn(
        {
          ...N,
          kind: p.kind || q.kind,
          assetCateId: Number(p.asset_cate_id || q.id || 0)
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
    const g = G.edges.filter((N) => N.from === u).map((N) => G.nodes.find((w) => w.id === N.to)).filter(
      (N) => !!N && Qt(N, "display")
    );
    if (g.length !== 0)
      for (const N of g)
        Ze(
          N.id,
          Wn(N, { output: p }, "展示引用结果")
        );
  }
  async function Tc(u, p = sn, g = Re.current) {
    if (!p) {
      xc(u);
      return;
    }
    const N = G.nodes.find((C) => C.id === p) || (g?.id === p ? g : Re.current?.id === p ? Re.current : null);
    if (!N) {
      xc(u), Yt(""), Re.current = null;
      return;
    }
    du(G.nodes, N.storyboardItem?.sourceNodeId || "") && (await kt(G), u = await fp({
      projectId: r,
      canvasId: G.id,
      nodeId: p,
      assetId: u.id,
      versionId: Number(u.version_id),
      requestId: crypto.randomUUID()
    }), Je(u)), lf(p, u, g), Mc();
  }
  async function pf(u, p = sn, g = Re.current) {
    if (!Bs(u)) {
      o("该素材没有可用内容，无法引用");
      return;
    }
    const N = Number(q?.id || 0), w = p || `new-${Date.now()}`;
    try {
      if (u.libraryType !== "material") {
        await Tc(qr(u), p, g);
        return;
      }
      const C = await Kc({
        projectId: r,
        canvasId: G.id,
        assetCateId: N,
        name: u.name || "素材库资产",
        kind: u.kind,
        content: u.version?.content,
        nodeKey: p,
        requestId: `official-material:${u.id}:${w}`
      }), k = qr(C);
      Je(k), await Tc(k, p, g);
    } catch (C) {
      o(
        C instanceof Error ? C.message : "引用素材库资产失败"
      );
    }
  }
  function Mc() {
    Ht(!1), Yt(""), Re.current = null;
  }
  function mf(u, p) {
    Yc(), to({ nodeId: u, frameIndex: p }), He(null), fe("create");
  }
  async function gf(u) {
    const p = Jt;
    if (!p || so.current)
      return;
    const g = ve.nodes.find((S) => S.id === p.nodeId);
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
    if (!w && N.length > bo) {
      o(`一次最多导入 ${bo} 张图片`);
      return;
    }
    const C = Oa([
      g.asset?.version?.content,
      g.resultOutput
    ]), k = w ? xw(
      C,
      Number(p.frameIndex),
      N[0],
      g.title
    ) : xl(
      N,
      C,
      g.title
    );
    if (!k) {
      o("当前宫格内容不可编辑");
      return;
    }
    so.current = !0;
    try {
      const S = Number(g.asset?.id || 0), E = Number(
        g.asset?.version?.id || g.asset?.version_id || 0
      ), j = S > 0 && E > 0 ? await Vc({
        projectId: r,
        assetId: S,
        versionId: E,
        content: k
      }) : await Kc({
        projectId: r,
        canvasId: G.id,
        assetCateId: Number(g.assetCateId || q?.id || 0),
        name: k.title || g.title || "宫格图片",
        kind: "collection",
        content: k,
        nodeKey: g.id,
        requestId: `storyboard-grid-import:${g.id}:${Date.now()}`
      }), ee = sa(
        j,
        g.asset
      );
      Je(ee), Ze(
        g.id,
        ur(g, ee)
      );
    } catch (S) {
      o(
        S instanceof Error ? S.message : "导入宫格图片失败"
      );
    } finally {
      so.current = !1;
    }
  }
  function yf(u, p) {
    tr("power", p, { power: u });
  }
  function hf(u = "") {
    Yo(u);
  }
  async function Es(u, p) {
    const { uploadSpaceFiles: g } = await import("./space-upload-B-1PIF2y.js").then((C) => C.c), N = await g({
      projectID: r,
      canvasID: G.id,
      teamID: Number(a?.project.team_id || 0),
      files: u,
      onProgress: p?.onProgress
    }), w = [];
    for (const C of N) {
      const k = qr(C.asset);
      k.id && Je(k);
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
    const g = v.current, w = P.current[String(g)].nodes.find((S) => S.id === u), C = di(w);
    if (!C) throw new Error("请先生成设定");
    const k = await Vc({ projectId: r, assetId: Number(w.resultRef?.asset_id || w.asset?.id), versionId: Number(w.resultRef?.version_id || w.asset?.version_id), requestId: crypto.randomUUID(), saveMode: "create_version", content: { ...C, materials: p } });
    Je(k), ln(g, u, { asset: k, resultRef: { asset_id: k.id, version_id: k.version_id }, resultOutput: k.version?.content }), await kt(P.current[String(g)]);
  }
  async function If() {
    const u = Cn(Me, "audio", "speech");
    if (!u) return [];
    const p = Number(a?.release?.id || a?.project.release_id || 0);
    return (await c.loadPowerForm(
      { projectId: r, releaseId: p, flowId: 0, powerId: u.id, powerKey: u.key, targetId: 0 },
      () => Hd({ projectId: r, powerId: u.id, powerKey: u.key })
    )).params.find((N) => N.key === "voice")?.options || [];
  }
  function Cf(u, p) {
    const g = tr("function", p, { functionOption: u });
    g && Qt(g, "import") && (Re.current = g, hf(g?.id || ""));
  }
  function Sf(u, p, g) {
    wm(), fe("create");
    const N = {
      x: u.x,
      y: u.y,
      position: p,
      canvasId: G.id,
      connection: g
    };
    He(N), Rn(null), Zt().then((w) => {
      !w && g && He((C) => C === N ? null : C);
    });
  }
  function Ac(u, p, g) {
    const N = P.current[String(u.canvasId)];
    if (!u.connection || !N || v.current !== u.canvasId) return;
    const w = Fd(Md(N, mn), u.connection, p.node, lt), { source: C, target: k } = w, S = mr({ ...w, params: p.params });
    if (S.kind === "invalid" || !C || !k) {
      o(S.kind === "invalid" ? S.reason : "节点已变化，请重新连接");
      return;
    }
    if (S.kind === "form" || p.params && k.composerDraft?.selectedTargetId !== p.targetModelId) {
      o("下游模型已变化，请重新选择引用节点");
      return;
    }
    const E = g || Yu(S);
    if (!E && S.kind !== "direct") {
      Rn({ menu: u, candidate: p, plan: S, sourceTitle: C.title, targetTitle: k.title });
      return;
    }
    const j = Sa(S, E, C, k);
    if (!j) {
      o("该用途已不可用，请重新连接");
      return;
    }
    const ee = w.nodes.find((W) => W.id === p.node.id);
    It(u.canvasId, (W) => {
      const J = [...W.nodes, ee].map(
        (le) => le.id === k.id && j.draft ? { ...le, composerDraft: j.draft } : le
      ), se = E?.kind === "lyrics" ? Kl(W.edges, C.id, k) : W.edges;
      return {
        ...W,
        nodes: J,
        edges: Tt(J, Kn(se, C.id, k.id, J, j.mediaUsage))
      };
    }), o(""), $([ee.id]), er(ee.id);
  }
  function Ai(u) {
    if (!pe || de?.menu !== pe) return;
    const p = de.candidates.find(({ node: g }) => (g.power || g.role || g.functionOption) === u);
    p && (He(null), Ac(pe, p));
  }
  const Dc = F(() => Rn(null), []);
  function Pc(u) {
    Te && (Dc(), Ac(Te.menu, Te.candidate, u));
  }
  function _f() {
    Zn(rt === "dark" ? "light" : "dark");
  }
  const Rf = Ue((u) => {
    $(u), He(null);
  }), kf = Ue(Sf), xf = Ue(df), Tf = Ue(uf), Mf = Ue(
    (u) => Ct((p) => ({ ...p, nodes: u }))
  ), Af = Ue(
    (u) => Ct((p) => ({ ...p, edges: u }))
  ), Df = Ue(
    (u) => Ct((p) => p.nodes.length === 0 && p.edges.length === 0 ? p : { ...p, viewport: u })
  ), Pf = Ue(
    mf
  );
  if (Qn)
    return null;
  if (no || !a || !q)
    return /* @__PURE__ */ f("main", { className: `ws-page is-${rt} ws-loading-screen`, children: /* @__PURE__ */ f("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ f("span", { children: no || "创作空间不存在" }) }) });
  const {
    launcherVisible: Ef,
    panelVisible: Ec
  } = yp(a.assistant.available, we), Os = pe?.connection ? ve.nodes.find((u) => u.id === pe.connection?.nodeId) : void 0, zr = de && de.menu === pe ? de.candidates : [], Of = Os ? de?.menu !== pe ? void 0 : zr.length === 0 ? de.warning ? "未能确认可用节点，关闭菜单后可重试。" : pe?.connection?.handleType === "target" ? "没有能为该节点提供输入的节点。" : "没有能接收该节点结果的节点。" : pe?.connection?.handleType !== "target" && !Qt(Os, "start") && !Dt(Os) ? "可以先连线，运行下游前请先生成上游结果。" : void 0 : "原节点已不存在，请重新选择。";
  return /* @__PURE__ */ U(
    "main",
    {
      className: `ws-page is-${rt} is-${be}-view ${Ec ? "is-assistant-open" : ""} ${ce ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${Ne}px`
      },
      children: [
        /* @__PURE__ */ f(
          qn,
          {
            message: n,
            onDismiss: () => o(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(
          _w,
          {
            activeCate: q,
            mode: be,
            interactive: be === "create",
            canvasCount: un.length,
            activeCanvasName: G.name,
            canvasManagerOpen: he,
            onOpenCanvasManager: Ii,
            nodes: ve.nodes,
            edges: ve.edges,
            viewport: G.viewport,
            canvasId: G.id,
            selectedNodeId: oe,
            selectedNodeIds: O,
            onSelectNodes: Rf,
            onOpenNodeMenu: kf,
            onCopyNode: xf,
            onDeleteNodes: Tf,
            onShowNodeDetail: Er,
            detailNodeIds: ct,
            onDetailNodeProjection: ki,
            onConfirmStoryboard: As,
            onStoryboardScriptSaved: h,
            onNodesCommit: Mf,
            onEdgesCommit: Af,
            onConnectedMediaEdgeRemove: Ms,
            onViewportCommit: Df,
            focusNodeRequest: rn,
            onFocusNodeRequestConsumed: nf,
            projectId: r,
            space: a,
            canvasReferenceItems: lt,
            catalogCache: c,
            runningNodes: Ce,
            onNodeResult: Ze,
            onNodeDraftChange: Ts,
            onAssetCreated: Je,
            canvasRunRecords: dt,
            stoppingCanvasRunKeys: hn,
            onStopCanvasRun: Rc,
            onCreateStoryboards: Ri,
            onSettingMaterials: Nf,
            onLoadVoiceOptions: If,
            onReplaceSettingImage: Yo,
            onRunStoryboardFrame: me,
            onRunFunctionNode: nt,
            onRunBackendNode: Ie,
            onOpenStoryboardGridImport: Pf,
            onClearFeedbackRecords: fo,
            requestConfirm: Tr,
            onOpenFeedbackRecord: te
          },
          G.id
        ),
        /* @__PURE__ */ f(
          Nw,
          {
            space: a,
            cates: Rs,
            activeCate: q,
            canvases: un,
            activeCanvas: G,
            saveStatus: kr[String(G.id)] || "saved",
            hasAssetCates: ks,
            loadingCateId: _,
            onBack: () => {
              _s(() => t({ to: "/bot/work" }));
            },
            onSelectCate: Or,
            onRefresh: () => {
              _s(xr);
            },
            onOpenRunHistory: () => {
              Pn(!0), Br(r, 0);
            },
            onRunHistoryIntent: om,
            canStopRuns: rf,
            stoppingRuns: Ns || hn.size > 0,
            onStopRuns: sf,
            theme: rt,
            onToggleTheme: _f
          }
        ),
        he ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ f(
              rm,
              {
                errorFeedback: /* @__PURE__ */ f(
                  qn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                open: !0,
                canvases: un,
                deletedCanvases: X,
                deletedLoading: Z,
                activeCanvasId: G.id,
                disabled: _ != null,
                onClose: () => V(!1),
                onSelect: Xo,
                onCreate: Fr,
                onRename: Zo,
                onReorder: Ds,
                onDelete: Qo,
                onRestore: Ps
              }
            )
          }
        ) : null,
        Ec ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${Ne}px`
                },
                children: /* @__PURE__ */ f(ke, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ f(
              sm,
              {
                assistant: a.assistant,
                project: a.project,
                team: a.team,
                activeAssetCateID: q.id,
                activeCanvas: G,
                selectedNodes: Ci,
                width: Ne,
                expanded: ce,
                onWidthChange: _i,
                onToggleExpanded: () => Be((u) => !u),
                onClose: () => Se(!1),
                onFlushCanvas: kt,
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
            onIntent: im,
            onOpen: () => Se(!0)
          }
        ) : null,
        $o ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ f(
              am,
              {
                open: !0,
                runs: gt,
                loading: et,
                error: Nr,
                page: _e,
                hasNextPage: bs,
                onOpenChange: Pn,
                onRefresh: () => Br(r, 0),
                onPreviousPage: () => Br(
                  r,
                  Math.max(0, _e - 2)
                ),
                onNextPage: () => Br(r, _e),
                stoppingRunKeys: hn,
                onStopRun: Rc,
                onLocateRun: (u) => {
                  const p = String(u.start_node_id || "");
                  if (!p)
                    return;
                  Pn(!1), (Number(u.canvas_id || 0) ? Xo(Number(u.canvas_id)) : Or(Number(u.asset_cate_id || b))).then((N) => {
                    N && window.requestAnimationFrame(() => er(p));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ f(
          Sw,
          {
            mode: be,
            onModeIntent: (u) => {
              u === "result" && cm();
            },
            onSelectMode: (u) => {
              fe(u), He(null);
            }
          }
        ),
        vs ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Jc,
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
                  canvasID: G.id
                },
                confirmSelection: !0,
                contentMode: "full",
                validateAsset: (u) => Bs(u) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: Es,
                onClose: Mc,
                onConfirm: (u) => {
                  const p = u[0];
                  p && pf(p);
                }
              }
            )
          }
        ) : null,
        Jt ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Jc,
              {
                notificationMode: "inline",
                open: !0,
                teamID: a.project.team_id,
                scopeProjectID: a.project.id,
                title: Number.isInteger(Jt.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(Jt.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${Ln} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: a.project.id,
                  canvasID: G.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(Jt.frameIndex),
                maxSelection: Ln,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (u) => u.kind !== "image" ? "请选择图片资产。" : Bs(u) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: Es,
                onClose: () => to(null),
                onConfirm: (u) => {
                  gf(u);
                }
              }
            )
          }
        ) : null,
        be === "result" ? /* @__PURE__ */ f("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载资产" }), children: /* @__PURE__ */ f(
          dm,
          {
            notificationMode: "inline",
            teamID: a.project.team_id,
            scopeProjectID: a.project.id,
            scopeCanvasID: G.id,
            onLocalUpload: Es,
            initialFilters: {
              sourceType: "project",
              projectID: a.project.id,
              canvasID: G.id,
              assetCateID: ks ? q.id : 0
            },
            headerAction: /* @__PURE__ */ f(mt, { label: "关闭资产", children: /* @__PURE__ */ U("button", { type: "button", onClick: () => fe("create"), children: [
              /* @__PURE__ */ f(Su, { "aria-hidden": "true" }),
              /* @__PURE__ */ f("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        vt ? /* @__PURE__ */ f(
          nb,
          {
            errorFeedback: /* @__PURE__ */ f(
              qn,
              {
                message: n,
                onDismiss: () => o("")
              }
            ),
            prompt: vt.prompt,
            running: On,
            readonly: eh(
              vt,
              ve.nodes,
              ut.current
            ),
            history: Io(
              ve.nodes.find(
                (u) => u.id === vt.node.id
              ) || vt.node
            ),
            activeRecordId: vt.recordId,
            onSelectRecord: (u) => {
              const p = ve.nodes.find(
                (g) => g.id === vt.node.id
              ) || vt.node;
              Ft({
                node: p,
                recordId: u.id,
                prompt: {
                  ...u.prompt,
                  values: u.values || u.prompt.values || {}
                }
              });
            },
            onClose: z,
            onSubmit: D
          },
          `${vt.node.id}-${vt.recordId}`
        ) : null,
        Lo ? /* @__PURE__ */ f(
          Rw,
          {
            onError: o,
            request: Lo,
            onClose: () => eo(null)
          }
        ) : null,
        Vn && !ci(Vn.document) ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载分镜确认", overlay: !0 }),
            children: /* @__PURE__ */ f(
              um,
              {
                errorFeedback: /* @__PURE__ */ f(
                  qn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                storyboard: Vn.document,
                submitting: Bo,
                onClose: () => on(null),
                onConfirm: xi
              }
            )
          }
        ) : null,
        pe ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ f(
              lm,
              {
                menu: pe,
                overDetail: !!(pe.connection && it),
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
                onSelectFunction: (u) => pe.connection ? Ai(u) : Cf(u, pe.position),
                onSelectGroup: () => bf(pe.position),
                onSelectRole: (u) => pe.connection ? Ai(u) : wf(u, pe.position),
                onSelectPower: (u) => pe.connection ? Ai(u) : yf(u, pe.position)
              }
            )
          }
        ) : null,
        Te && Te.menu.canvasId === G.id ? /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载用途选项", overlay: !0 }), children: /* @__PURE__ */ f(
          gu,
          {
            sourceTitle: Te.sourceTitle,
            targetTitle: Te.targetTitle,
            params: Te.plan.kind === "media" ? Te.plan.options : Te.plan.params,
            media: Te.plan.kind === "media",
            overDetail: !!it,
            lyricsAvailable: Te.plan.kind === "text" && Te.plan.lyricsAvailable,
            onClose: Dc,
            onSelect: (u) => Pc({ kind: Te.plan.kind, key: u }),
            onSelectLyrics: () => Pc({ kind: "lyrics" })
          }
        ) }) : null,
        [it, ys].map((u, p) => u ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              fm,
              {
                canvasId: G.id,
                layer: p ? "nested" : "default",
                projectId: a.project.id,
                teamId: a.team.id,
                assetCateId: Number(
                  u.assetCateId || u.asset?.asset_cate_id || q?.id || 0
                ),
                node: u,
                readonly: be !== "create",
                storyboardFocus: p ? void 0 : ws,
                storyboardInitialSectionId: p ? void 0 : Mn,
                storyboardWorkspace: u.storyboardWorkspace,
                canvasNodes: ve.nodes,
                canvasEdges: ve.edges,
                connectedMediaReferences: Zu(
                  ve.nodes,
                  ve.edges,
                  u.id
                ),
                canvasReferenceItems: lt.filter(
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
                  St(null), !p && (Tn(null), at(null), zo(void 0), Uo(void 0));
                }
              }
            )
          },
          u.id
        ) : null),
        xn ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              pm,
              {
                notificationMode: "inline",
                teamID: a.project.team_id,
                assetID: xn.assetID,
                layer: "nested",
                onAssetChanged: x,
                onClose: () => Tn(null)
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
  theme: _,
  onToggleTheme: M
}) {
  const A = Math.max(
    0,
    t.findIndex((O) => O.id === n.id)
  );
  return /* @__PURE__ */ U("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ U("div", { className: "ws-project-head", children: [
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
      /* @__PURE__ */ U("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ U("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ f("strong", { children: e.project.name }),
          o.length > 1 ? /* @__PURE__ */ U("span", { className: "ws-project-canvas-name", children: [
            /* @__PURE__ */ f("i", { children: "/" }),
            s.name || "第一幕"
          ] }) : null
        ] }),
        /* @__PURE__ */ f("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    i ? /* @__PURE__ */ U(
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
          t.map((O) => /* @__PURE__ */ U(
            "button",
            {
              type: "button",
              className: `ws-cate ${O.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                d(O.id);
              },
              children: [
                c === O.id ? /* @__PURE__ */ f(xo, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ f("span", { className: "ws-cate-name", children: O.name })
              ]
            },
            O.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ U("div", { className: `ws-top-actions ${b ? "has-running" : ""}`, children: [
      /* @__PURE__ */ f(Iw, { status: r }),
      b ? /* @__PURE__ */ f(mt, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ U(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: I,
          onClick: R,
          children: [
            I ? /* @__PURE__ */ f(xo, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(ag, { size: 13, fill: "currentColor" }),
            I ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ f(mt, { label: "查看画布运行记录", children: /* @__PURE__ */ U(
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
      /* @__PURE__ */ U("button", { type: "button", className: "ws-action", onClick: M, children: [
        _ === "dark" ? /* @__PURE__ */ f(dg, { size: 15 }) : /* @__PURE__ */ f(ug, { size: 15 }),
        _ === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ U("button", { type: "button", className: "ws-action", onClick: l, children: [
        /* @__PURE__ */ f(La, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function Iw({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ f(mt, { label: t, children: /* @__PURE__ */ U("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ f(xo, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(_u, { size: 14 }),
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
    return /* @__PURE__ */ U(
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
const _w = Ba(function({
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
  onCopyNode: _,
  onDeleteNodes: M,
  onShowNodeDetail: A,
  detailNodeIds: O,
  onDetailNodeProjection: $,
  onConfirmStoryboard: oe,
  onStoryboardScriptSaved: Y,
  onNodesCommit: ie,
  onEdgesCommit: P,
  onConnectedMediaEdgeRemove: he,
  onViewportCommit: V,
  focusNodeRequest: X,
  onFocusNodeRequestConsumed: L,
  projectId: Z,
  space: ge,
  canvasReferenceItems: ye,
  catalogCache: be,
  runningNodes: fe,
  onNodeResult: we,
  onNodeDraftChange: Fe,
  onAssetCreated: ce,
  canvasRunRecords: Be,
  stoppingCanvasRunKeys: Ne,
  onStopCanvasRun: Et,
  onCreateStoryboards: rt,
  onSettingMaterials: Zn,
  onLoadVoiceOptions: pe,
  onReplaceSettingImage: He,
  onRunStoryboardFrame: de,
  onRunFunctionNode: st,
  onRunBackendNode: Te,
  onOpenStoryboardGridImport: Rn,
  onClearFeedbackRecords: Qn,
  requestConfirm: wt,
  onOpenFeedbackRecord: Po
}) {
  const [Ce, Eo] = K(null), [kn, Oo] = K(""), [Fo, mn] = K(""), [en, it] = K(""), [at, ys] = K(null), [St, tn] = K(null), [nn, ct] = K(""), [Le, gn] = K(null), [on, Bo] = K(() => /* @__PURE__ */ new Map()), [hs, je] = K(""), [xn, Tn] = K(!1), [ws, zo] = K(!1), [Mn, Uo] = K(1), Lo = ne(1), eo = ne(1), rn = ne(null), [An, vs] = K(null), Ht = re(
    () => new Set(b),
    [b]
  ), sn = ne(null), Yt = ne(null), Jt = ne(!1), to = ne(!1), no = ne(!1), yn = ne(null), dt = ne(!1), ze = ne(d);
  ns(() => {
    ze.current = d;
  }, [d]);
  const gt = F((m) => {
    const h = ho(m);
    Lo.current = h, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current), rn.current = null, eo.current = h, Vd(sn.current, h), Uo(
      (x) => Math.abs(x - h) > 5e-3 ? h : x
    );
  }, []), oo = F((m) => {
    const h = ho(m);
    if (Lo.current = h, !(Math.abs(eo.current - h) <= 5e-3) && rn.current == null) {
      if (typeof window > "u") {
        eo.current = h, Uo(h);
        return;
      }
      rn.current = window.requestAnimationFrame(() => {
        rn.current = null;
        const x = Lo.current;
        eo.current = x, Vd(sn.current, x);
      });
    }
  }, []);
  ue(
    () => () => {
      Yt.current = null, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current);
    },
    []
  );
  const et = F(
    (m, h = {}) => {
      const x = ze.current;
      ze.current = m, P(m);
      const B = new Set(
        m.filter((T) => jn(T) === "media").map((T) => {
          const H = fn(T);
          return `${H.sourceNodeId}\0${H.targetNodeId}`;
        })
      ), D = /* @__PURE__ */ new Map();
      for (const T of x) {
        if (jn(T) !== "media")
          continue;
        const H = fn(T), Q = `${H.sourceNodeId}\0${H.targetNodeId}`;
        if (B.has(Q))
          continue;
        const Pe = D.get(H.targetNodeId) || /* @__PURE__ */ new Set();
        Pe.add(H.sourceNodeId), D.set(H.targetNodeId, Pe);
      }
      const z = new Map(h.draftByNodeId);
      for (const [T, H] of D) {
        const Q = a.find((Ie) => Ie.id === T), Pe = Q?.composerDraft;
        let me = z.get(T) || Pe;
        if (!(!Q || !me)) {
          for (const Ie of H)
            me = Gc(
              me,
              Ie
            );
          me !== Pe ? z.set(Q.id, me) : z.delete(Q.id);
        }
      }
      const te = [...z].map(([T, H]) => ({
        nodeId: T,
        draft: H
      }));
      te.forEach((T, H) => {
        Fe(
          T.nodeId,
          T.draft,
          H === te.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, P, Fe]
  ), Dn = F(
    (m) => {
      const h = Object.entries(m);
      if (h.length === 0)
        return;
      const x = new Map(h);
      let B = !1;
      const D = ze.current.map((z) => {
        if (!x.has(z.id))
          return z;
        const te = x.get(z.id) || void 0;
        return (z.mediaUsage || void 0) === te ? z : (B = !0, { ...z, mediaUsage: te });
      });
      B && et(D);
    },
    [et]
  ), Nr = F(
    (m) => {
      const h = ze.current.filter((x) => x.id !== m);
      h.length !== ze.current.length && (ze.current = h, ct((x) => x === m ? "" : x), he(m));
    },
    [he]
  ), ro = F(
    (m, h) => {
      const x = ze.current, B = x.filter((te) => {
        const T = fn(te);
        return !(jn(te) === "media" && T.sourceNodeId === m && T.targetNodeId === h);
      });
      if (B.length !== x.length) {
        ct(""), et(B);
        return;
      }
      const D = a.find((te) => te.id === h);
      if (!D?.composerDraft)
        return;
      const z = Gc(
        D.composerDraft,
        m
      );
      z !== D.composerDraft && Fe(h, z, { save: "immediate" });
    },
    [et, a, Fe]
  ), $o = F(
    (m, h) => {
      if (it(""), !o)
        return;
      const x = jy(a, m, h);
      x !== a && ie(x);
    },
    [o, a, ie]
  ), Pn = F(
    (m, h) => {
      if (it(""), !o)
        return;
      const x = Ky(a, m, h);
      x !== a && ie(x);
    },
    [o, a, ie]
  ), _e = ne({
    onSettingMaterials: Zn,
    onLoadVoiceOptions: pe,
    onReplaceSettingImage: He,
    onNodeResult: we,
    onNodeDraftChange: Fe,
    onAssetCreated: ce,
    onRunFunctionNode: st,
    onOpenStoryboardGridImport: Rn,
    onClearFeedbackRecords: Qn,
    onOpenFeedbackRecord: Po,
    onShowNodeDetail: A,
    onConfirmStoryboard: oe,
    onStoryboardScriptSaved: Y,
    requestConfirm: wt,
    onRunBackendNode: Te,
    onConnectedMediaUsagesChange: Dn,
    onConnectedMediaEdgeRemove: Nr,
    onTextParamConnectionRemove: ro,
    onNodeResizeStart: it,
    onNodeResizeEnd: $o,
    onResultViewResizeEnd: Pn
  });
  ns(() => {
    _e.current = {
      onSettingMaterials: Zn,
      onLoadVoiceOptions: pe,
      onReplaceSettingImage: He,
      onNodeResult: we,
      onNodeDraftChange: Fe,
      onAssetCreated: ce,
      onRunFunctionNode: st,
      onOpenStoryboardGridImport: Rn,
      onClearFeedbackRecords: Qn,
      onOpenFeedbackRecord: Po,
      onShowNodeDetail: A,
      onConfirmStoryboard: oe,
      onStoryboardScriptSaved: Y,
      requestConfirm: wt,
      onRunBackendNode: Te,
      onConnectedMediaUsagesChange: Dn,
      onConnectedMediaEdgeRemove: Nr,
      onTextParamConnectionRemove: ro,
      onNodeResizeStart: it,
      onNodeResizeEnd: $o,
      onResultViewResizeEnd: Pn
    };
  }, [
    Zn,
    pe,
    He,
    ce,
    Qn,
    Fe,
    we,
    Po,
    Rn,
    Te,
    st,
    A,
    oe,
    Y,
    Nr,
    ro,
    wt,
    $o,
    Pn,
    Dn
  ]);
  const En = re(
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
  ), bs = ne(void 0), ae = re(() => {
    const m = vv(
      a,
      d,
      bs.current
    );
    return bs.current = m, m;
  }, [d, a]), hn = re(
    () => gh(
      a,
      (m) => (ae.hasResultByNodeId.get(m.id) || !1) && !ar(m, a)
    ),
    [ae.hasResultByNodeId, a]
  ), yt = hn.frames, Ns = re(
    () => new Map(yt.map((m) => [m.id, m])),
    [yt]
  ), Ot = re(
    () => new Map(yt.map((m) => [m.sourceNodeId, m])),
    [yt]
  ), vt = re(
    () => new Map(
      yt.map((m) => [
        m.id,
        ll(
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
      yt
    ]
  ), Ft = re(() => {
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
  }, [y, Be]), { latestCanvasRunByStartNodeId: On, activeCanvasRunByStartNodeId: wn } = re(() => {
    const m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
    for (const x of Be) {
      const B = Number(x.canvas_id || 0);
      if (B > 0 && B !== y) continue;
      const D = String(x.start_node_id || "").trim();
      D && (m.has(D) || m.set(D, x), Nn(x) && !h.has(D) && h.set(D, x));
    }
    return { latestCanvasRunByStartNodeId: m, activeCanvasRunByStartNodeId: h };
  }, [y, Be]), Re = hn.sourceNodeIds, so = hn.sourceNodeIdByNodeId, Bt = re(
    () => new Set(
      yt.flatMap(
        (m) => m.memberNodeIds.filter(
          (h) => h !== m.sourceNodeId
        )
      )
    ),
    [yt]
  ), io = Ue(
    (m, h) => {
      const x = Ns.get(m), B = vt.get(m);
      if (!x || !B)
        return;
      const D = B.pendingNodeIds.length, z = Math.max(0, x.workNodeCount - D);
      wt({
        title: `执行“${x.title}”制作区？`,
        description: `将执行 ${D} 个待处理节点${z > 0 ? `，跳过 ${z} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => de(h)
      });
    }
  ), zt = Ue(
    (m) => {
      const h = Ft.get(m);
      h && Nn(h) && Et(h);
    }
  ), Ye = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && Zl({
      group: h,
      sourceNode: h,
      members: ae.groupMembersById.get(m) || Ks,
      runNode: Te,
      hasResult: (x) => Dt(x) && !ar(x, a),
      onError: je
    });
  }), Ir = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && Te(h).catch(
      (x) => je(
        x instanceof Error ? x.message : "节点运行失败"
      )
    );
  }), Ut = Ue((m) => {
    const h = wn.get(m);
    h && Et(h);
  }), _t = Ue((m) => {
    const h = ae.nodeById.get(m);
    h && A(h);
  }), Cr = Ue((m, h) => {
    o && R(h, Kr(Ce, h), { nodeId: m, handleType: "source" });
  }), an = re(
    () => a.map((m) => m.id).join("\0"),
    [a]
  ), Xt = re(
    () => new Set(
      an ? an.split("\0") : []
    ),
    [an]
  ), ao = re(
    () => an ? `${t.id}:${an}` : "",
    [t.id, an]
  ), Fn = Ue(
    (m, h) => /* @__PURE__ */ f(pc.Provider, { value: !0, children: /* @__PURE__ */ f(mw, { data: m, selected: h }) })
  ), [Vo] = K(Yy), jo = re(
    () => /* @__PURE__ */ new Set([...Xt, ...yt.map((m) => m.id)]),
    [Xt, yt]
  ), Is = re(() => {
    const m = Vo.reuse, h = [
      Z,
      y,
      ge,
      be,
      ye,
      o,
      En,
      ae,
      Ye,
      Ir,
      _t,
      Ut,
      rt
    ], x = (T) => (ae.hasResultByNodeId.get(T.id) || !1) && !ar(T, a), B = (T, H = !1) => {
      const Q = !H && Ht.has(T.id), Pe = ar(T, a) || wy(T, a, d), me = Q && b.length === 1 && ka(T), Ie = T.type === "power" ? Hn(T.power, T.kind, T.outputType).viewMode : "", nt = H || me, xt = nt ? ge : null, $e = nt || Ie === "storyboard" || Ie === "video_compose" ? ye : sw, Qe = (H || Ie === "video_compose" || me) && ae.incomingMediaReferencesByNodeId.get(T.id) || xd, $t = Re.has(T.id), Xo = so.get(T.id) || "", Or = Xo && ae.nodeById.get(Xo) || null, Fr = fe[T.id] || null, Zo = On.get(T.id), Ds = !!(Zo && Ne.has(ht(Zo))), Qo = T.type === "group" && ae.groupMembersById.get(T.id) || Ks, Ps = ae.inputContextByNodeId.get(T.id) || null, po = ae.runBlockedReasonByNodeId.get(T.id) || "";
      return m(
        H ? "embedded" : "node",
        T.id,
        [
          T,
          Z,
          y,
          xt,
          be,
          Fr,
          Zo,
          Ds,
          Qo,
          ...Qo.map((er) => fe[er.id]),
          $e,
          Qe,
          o,
          $t,
          Or,
          po,
          me,
          En,
          Ps,
          Ut,
          rt,
          Pe
        ],
        () => ({
          ...T,
          sourceNode: T,
          projectId: Z,
          canvasId: y,
          space: xt,
          catalogCache: be,
          runningNode: Fr,
          canvasRun: Zo,
          canvasRunStopping: Ds,
          onStopNodeCanvasRun: Ut,
          onCreateStoryboards: rt,
          settingUpdateReason: Pe,
          groupMembers: Qo,
          groupRuntime: T.type === "group" ? Za({
            members: Qo,
            runningNodes: fe,
            groupState: Fr,
            hasResult: x
          }) : null,
          canvasReferenceItems: $e,
          connectedMediaReferences: Qe,
          interactive: o,
          structureLocked: $t,
          storyboardSourceNode: Or,
          runBlockedReason: po,
          showNodeSettings: me,
          ...H ? { embedded: !0 } : {},
          ...En,
          inputContext: Ps
        })
      );
    }, D = (T) => {
      const H = vt.get(T.id), Q = Ft.get(T.sourceNodeId), Pe = !!(Q && Nn(Q) && Ne.has(ht(Q)));
      return m(
        "frame",
        T.id,
        [
          T,
          H,
          Q,
          fe[T.id],
          ...h,
          io,
          zt,
          Fn,
          Cr,
          ...T.memberNodeIds.flatMap((me) => {
            const Ie = On.get(me), nt = wn.get(me);
            return [
              fe[me],
              Ie,
              nt,
              !!(Ie && Ne.has(ht(Ie))),
              !!(nt && Ne.has(ht(nt)))
            ];
          }),
          Pe
        ],
        () => {
          const me = Q && Nn(Q) ? Q : void 0, Ie = !!me || Vt(fe[T.id]), nt = Ie ? "" : H?.blockedReason || "", xt = jw(
            T,
            me,
            fe,
            ae.nodeById
          ) || (Ie ? "准备执行" : "");
          return {
            frameId: T.id,
            sourceNodeId: T.sourceNodeId,
            groupCount: T.groupCount + Number(
              T.workNodeIds.some(
                ($e) => ae.nodeById.get($e)?.storyboardItem?.itemType === "video_compose"
              )
            ),
            workNodeCount: T.workNodeCount,
            completedCount: T.completedCount,
            running: Ie,
            stopping: Pe,
            executionStatus: Kw(
              Q,
              fe[T.id],
              Pe
            ),
            currentNodeTitle: xt,
            runBlockedReason: nt,
            groups: qw({
              frame: T,
              edges: d,
              nodeById: ae.nodeById,
              groupMembersById: ae.groupMembersById,
              runBlockedReasonByNodeId: ae.runBlockedReasonByNodeId,
              runningNodes: fe,
              activeRunByStartNodeId: wn,
              stoppingCanvasRunKeys: Ne,
              hasResult: x,
              onRunGroup: Ye,
              onRunNode: Ir,
              onStopRun: Ut,
              onOpenNode: _t,
              projectNode: ($e) => B($e, !0),
              reuse: m,
              projectionDependencies: ($e) => [
                ...h,
                ...$e.flatMap((Qe) => {
                  const $t = On.get(Qe.id);
                  return [
                    $t,
                    !!($t && Ne.has(ht($t))),
                    Re.has(Qe.id),
                    so.get(Qe.id)
                  ];
                })
              ]
            }),
            settingSource: (() => {
              const $e = d.filter((Qe) => (Qe.logicalTo || Qe.to) === T.sourceNodeId && Qe.executionMode !== "manual").map((Qe) => du(a, Qe.logicalFrom || Qe.from)).find(Boolean);
              return $e ? { title: $e.title, onOpen: () => _t($e.id) } : void 0;
            })(),
            renderNode: Fn,
            onReferenceResult: o ? Cr : void 0,
            onRun: () => io(T.id, T.sourceNodeId),
            onStop: me ? () => zt(T.sourceNodeId) : void 0
          };
        }
      );
    }, z = (T) => {
      const H = { x: T.x, y: T.y }, Q = Ht.has(T.id), Pe = B(T), me = Ot.get(T.id), Ie = me ? D(me) : void 0;
      return m(
        "flow",
        T.id,
        [Pe, Ie, Q, o],
        () => {
          const nt = Ie ? { ...Pe, storyboardWorkspace: Ie } : Pe, xt = T.type === "group" ? 1 : T.groupId ? 3 : 2, $e = Jl(T);
          return {
            id: T.id,
            type: "workSpace",
            position: H,
            data: nt,
            selected: Q,
            className: `ws-flow-node ws-flow-node-${T.type}`,
            draggable: o && (!nt.structureLocked || !!me),
            deletable: !nt.structureLocked,
            zIndex: xt,
            ...jv($e)
          };
        }
      );
    }, te = a.filter((T) => !Bt.has(T.id)).map(z);
    return Vo.retain(jo), te;
  }, [
    wn,
    On,
    ae,
    Ft,
    Bt,
    o,
    Vo,
    jo,
    Re,
    a,
    y,
    Z,
    fe,
    b.length,
    Ht,
    ge,
    be,
    ye,
    Ye,
    Ir,
    io,
    Fn,
    _t,
    Ut,
    rt,
    zt,
    En,
    Ot,
    vt,
    so,
    Ne
  ]), Ko = Uy(
    Is,
    pb
  ), qo = re(() => O.flatMap((m) => {
    if (!m) return [];
    for (const h of Ko) {
      const x = h.data;
      if (x.id === m) return [x];
      for (const B of x.storyboardWorkspace?.groups || []) {
        const D = B.results.find(
          (z) => z.nodeId === m
        );
        if (D) return [D.node];
      }
    }
    return [];
  }), [O, Ko]);
  ue(() => {
    for (const m of qo) $(m);
  }, [$, qo]);
  const { flowNodes: co, setFlowNodes: Bn } = zy(
    Ko,
    Fo || en
  ), Sr = F(
    (m) => {
      o && (ct(""), et(d.filter((h) => h.id !== m)));
    },
    [et, d, o]
  ), ut = F(
    (m) => {
      !o || !d.some((h) => h.id === m) || wt({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => Sr(m)
      });
    },
    [Sr, d, o, wt]
  ), Go = F(
    (m) => {
      if (!o || m.length === 0)
        return;
      const h = kl(a, m);
      if (h.size === 0)
        return;
      if ([...h].some(
        (D) => Re.has(D)
      )) {
        je(
          "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
        );
        return;
      }
      const x = m.length === 1 ? m[0] : null, B = m.some((D) => D.type === "group");
      wt({
        title: x ? `删除「${x.title}」` : `删除 ${h.size} 个节点`,
        description: B ? "会同时删除组内节点，并移除与这些节点相连的连线。" : x ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          ct(""), M(m);
        }
      });
    },
    [
      o,
      Re,
      a,
      M,
      wt
    ]
  ), Me = F(
    (m, h = []) => {
      if (!o || m.length === 0)
        return;
      const x = new Set(
        m.flatMap((H) => H.memberNodeIds)
      ), B = /* @__PURE__ */ new Set([
        ...x,
        ...h.map((H) => H.id)
      ]), D = a.filter((H) => B.has(H.id));
      if (D.length === 0)
        return;
      const z = m.length === 1 && h.every((H) => x.has(H.id)) ? m[0] : null, te = D.filter(
        (H) => H.type === "group"
      ).length, T = D.length - te;
      wt({
        title: z ? `删除「${z.title}」制作区` : `删除 ${D.length} 个节点`,
        description: z ? `将删除其中 ${te} 个分组和 ${T} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          ct(""), M(D, { allowStoryboardFrame: !0 });
        }
      });
    },
    [o, a, M, wt]
  ), Cs = re(
    () => d.filter(
      (m) => Xt.has(m.from) && Xt.has(m.to) && !Bt.has(m.from) && !Bt.has(m.to)
    ).map((m) => {
      const h = fn(m), x = ae.nodeById.get(
        h.sourceNodeId
      ), B = ae.nodeById.get(
        h.targetNodeId
      ), D = zi(
        B?.composerDraft,
        h.sourceNodeId,
        on.get(h.targetNodeId)
      ), z = !!(jn(m) === "media" && B?.type === "power" && B.power && (D || ir(x))), te = on.get(
        h.targetNodeId
      ), T = z && B && te ? fa(
        B,
        te,
        h.sourceNodeId
      ) : void 0, H = Vs(B), Q = z ? Ep(
        D,
        T,
        H
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
          purpose: jn(m),
          executionMode: m.executionMode,
          mediaUsage: m.mediaUsage,
          bindingLabel: Q?.label,
          bindingInteractive: Q?.interactive,
          bindingShowChevron: Q?.showChevron,
          bindingInvalid: Q?.invalid
        }
      };
    }),
    [
      on,
      Xt,
      ae.nodeById,
      d,
      Bt
    ]
  );
  ue(() => {
    if (!Ce || !ao || X || l.zoom != null || typeof window > "u")
      return;
    const m = setTimeout(() => {
      Ce.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(m);
  }, [ao, Ce, X, l.zoom]), ue(() => {
    if (!Ce || !X || typeof window > "u")
      return;
    const m = a.find(
      (D) => D.id === X.nodeId
    );
    if (!m) {
      L(X);
      return;
    }
    const h = Bt.has(m.id) ? yt.find(
      (D) => D.memberNodeIds.includes(m.id)
    ) : void 0, x = h && a.find((D) => D.id === h.sourceNodeId) || m, B = window.setTimeout(() => {
      const D = { x: x.x, y: x.y }, z = x.type === "power" ? 1.02 : 0.96;
      Ce.setCenter?.(
        D.x + (x.width || 180) / 2,
        D.y + (x.height || 180) / 2,
        { zoom: z, duration: 320 }
      ), gt(z), L(X);
    }, 80);
    return () => window.clearTimeout(B);
  }, [
    Ce,
    gt,
    X,
    Bt,
    a,
    L,
    yt
  ]);
  const Rt = F(
    (m) => {
      if (!o)
        return;
      const h = m.map((D) => {
        if (D.type !== "position" || !D.position)
          return D;
        const z = Ei(
          a,
          D.id,
          D.position
        );
        return z === D.position ? D : {
          ...D,
          position: z,
          ...D.positionAbsolute ? { positionAbsolute: z } : {}
        };
      });
      Bn((D) => Km(h, D));
      const x = new Set(b);
      let B = !1;
      for (const D of m)
        D.type === "select" && (B = !0, D.selected ? (x.delete(D.id), x.add(D.id)) : x.delete(D.id));
      B && I([...x]);
    },
    [o, a, I, b, Bn]
  ), Zt = F(
    (m) => Ju(
      be,
      Z,
      Number(ge.release?.id || ge.project.release_id || 0),
      m
    ),
    [be, Z, ge.project.release_id, ge.release?.id]
  ), cn = re(() => {
    const m = new Set(
      d.flatMap((h) => {
        if (jn(h) !== "media")
          return [];
        const x = fn(h), B = ae.nodeById.get(
          x.sourceNodeId
        ), D = ae.nodeById.get(
          x.targetNodeId
        );
        return D?.type === "power" && D.power && ir(B) ? [D.id] : [];
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
      m || Bo(
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
  const bt = F(
    (m, h, x) => {
      const B = a.some((T) => T.id === m), D = a.find((T) => T.id === h);
      if (!B || !D) {
        je("节点已变化，请重新连接");
        return;
      }
      const z = cs(D);
      if (!Op(
        z,
        x,
        m
      )) {
        je("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const te = au(
        z,
        m,
        x
      );
      et(
        Tt(
          a,
          Kn(ze.current, m, h, a)
        ),
        te !== z ? { draftByNodeId: /* @__PURE__ */ new Map([[D.id, te]]) } : void 0
      );
    },
    [et, a]
  ), dn = F(
    (m, h) => {
      const x = a.find((T) => T.id === m), B = a.find((T) => T.id === h);
      if (!B || !ir(x) || !Vs(B)) {
        je("节点已变化，请重新连接");
        return;
      }
      const D = cs(B), z = cu(
        D,
        m
      ), te = Kl(ze.current, m, B);
      te.length !== ze.current.length && ct(""), et(
        Tt(
          a,
          Kn(te, m, h, a)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[B.id, z]]) }
      );
    },
    [et, a]
  );
  ue(() => {
    for (const m of cn) {
      const h = on.get(m.id);
      if (!h)
        continue;
      const x = d.flatMap((D) => {
        if (jn(D) !== "media")
          return [];
        const z = fn(D);
        if (z.targetNodeId !== m.id)
          return [];
        const te = ae.nodeById.get(
          z.sourceNodeId
        );
        return m.composerDraft?.storyboardLyricsSourceNodeId === z.sourceNodeId ? [] : ir(te) ? [z.sourceNodeId] : [];
      }), B = Fp(
        x,
        m.composerDraft,
        Xu(m, h)
      );
      B && bt(
        B.sourceNodeId,
        m.id,
        B.targetParamKey
      );
    }
  }, [
    on,
    ae.nodeById,
    bt,
    d,
    cn
  ]);
  const _r = F(
    async (m) => {
      if (!o)
        return;
      const h = ze.current.find(
        (T) => T.id === m
      );
      if (!h)
        return;
      const { sourceNodeId: x, targetNodeId: B } = fn(h), D = a.find((T) => T.id === x), z = a.find((T) => T.id === B), te = zi(
        z?.composerDraft,
        x
      );
      if (!(z?.type !== "power" || !z.power || !te && !ir(D)))
        try {
          const T = await Zt(z), H = fa(
            z,
            T.params || [],
            x
          ), Q = zi(
            z.composerDraft,
            x,
            T.params || []
          ), Pe = Vs(z);
          if (Bo((Ie) => {
            const nt = new Map(Ie);
            return nt.set(B, T.params || []), nt;
          }), ct(m), Pe) {
            gn({
              sourceNodeId: x,
              targetNodeId: B,
              sourceTitle: D?.title || "上游节点",
              targetTitle: z.title || z.power.name,
              params: H,
              selectedParamKey: Q?.purpose === "param" ? Q.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: Q?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const me = Bp(H);
          if (me.kind === "unavailable") {
            je("当前能力没有可用的文本参数");
            return;
          }
          if (me.kind === "automatic") {
            Q?.targetParamKey !== me.targetParamKey && bt(
              x,
              B,
              me.targetParamKey
            );
            return;
          }
          gn({
            sourceNodeId: x,
            targetNodeId: B,
            sourceTitle: D?.title || "上游节点",
            targetTitle: z.title || z.power.name,
            params: me.params,
            selectedParamKey: Q?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (T) {
          je(
            T instanceof Error ? T.message : "参数列表加载失败"
          );
        }
    },
    [bt, o, Zt, a]
  ), zn = F(
    (m) => {
      _r(m);
    },
    [_r]
  ), [kt] = K(Jy), Rr = re(() => (kt.update(a, d), kt), [kt, a, d]), Un = ne([]), tt = re(() => {
    const m = new Map(
      Un.current.map((H) => [H.id, H])
    ), h = Rr.get(v), x = Rr.get(kn), B = /* @__PURE__ */ new Set([
      ...h,
      ...x
    ]), D = h.size > 0 ? v : x.size > 0 ? kn : "", z = Cs.map((H) => {
      const Q = Ov(
        H,
        ae.nodeById,
        kn,
        v,
        nn,
        B,
        D
      );
      return Fv(
        H,
        Q,
        ut,
        zn,
        m.get(H.id)
      );
    }), te = Un.current, T = z.length === te.length && z.every((H, Q) => H === te[Q]) ? te : z;
    return Un.current = T, T;
  }, [
    Cs,
    ae,
    Rr,
    kn,
    ut,
    zn,
    nn,
    v
  ]), bi = re(
    () => [...tt, ...at ? [at] : []],
    [tt, at]
  ), Ss = F(
    (m) => {
      if (!o)
        return;
      let h = "", x = !1;
      for (const z of m)
        z.type === "select" && (x = !0, z.selected && (h = z.id));
      x && ct(h);
      const B = m.filter(
        (z) => z.type !== "select"
      );
      if (B.length === 0)
        return;
      const D = qm(B, tt);
      et(
        zp(
          ze.current,
          new Set(tt.map((z) => z.id)),
          Sv(D)
        )
      );
    },
    [et, tt, o]
  ), kr = Ue((m, h, x) => {
    if (!a.some((D) => D.id === m) || !a.some((D) => D.id === h)) {
      je("节点已变化，请重新连接");
      return;
    }
    const B = Kn(ze.current, m, h, a, x.mediaUsage);
    et(
      Tt(a, B),
      x.draft ? { draftByNodeId: /* @__PURE__ */ new Map([[h, x.draft]]) } : void 0
    );
  }), Nt = Ue(
    async (m, h) => {
      const x = ze.current;
      if (x.some((Q) => (Q.logicalFrom || Q.from) === m && (Q.logicalTo || Q.to) === h)) return;
      const B = a.find((Q) => Q.id === m), D = a.find((Q) => Q.id === h), z = { source: B, target: D, nodes: a, edges: x, items: ye };
      let te = mr(z), T;
      if (D && te.kind === "form") {
        try {
          T = (await Zt(D)).params;
        } catch (Q) {
          je(Gr(Q, "参数读取失败，未建立连线"));
          return;
        }
        if (!sn.current) return;
        te = mr({ ...z, edges: ze.current, params: T });
      }
      if (te.kind === "invalid" || te.kind === "form" || !B || !D) {
        je(te.kind === "invalid" ? te.reason : "节点已变化，请重新连接");
        return;
      }
      te.kind === "text" && T && Bo((Q) => new Map(Q).set(D.id, T));
      const H = Yu(te);
      if (!H && te.kind !== "direct") {
        gn({
          sourceNodeId: m,
          targetNodeId: h,
          sourceTitle: B.title,
          targetTitle: D.title,
          params: te.kind === "text" ? te.params : te.options,
          mediaForm: te.kind === "media" ? T : void 0,
          mediaTargetModelId: te.kind === "media" ? D.composerDraft?.selectedTargetId : void 0,
          lyricsAvailable: te.kind === "text" && te.lyricsAvailable,
          lyricsSelected: !1,
          editing: !1
        });
        return;
      }
      if (H?.kind === "text")
        bt(m, h, H.key);
      else if (H?.kind === "lyrics")
        dn(m, h);
      else {
        const Q = Sa(te, H, B, D);
        Q && kr(m, h, Q);
      }
    }
  ), Wo = F(
    (m) => {
      const h = Le;
      if (h) {
        if (gn(null), h.mediaForm) {
          const x = a.find((te) => te.id === h.sourceNodeId), B = a.find((te) => te.id === h.targetNodeId);
          if (!x || !B || B.composerDraft?.selectedTargetId !== h.mediaTargetModelId) {
            je("节点或模型已变化，请重新连接");
            return;
          }
          const D = mr({ source: x, target: B, nodes: a, edges: ze.current, items: ye, params: h.mediaForm }), z = Sa(D, { kind: "media", key: m }, x, B);
          if (!z) {
            je(D.kind === "invalid" ? D.reason : "该用途已不可用，请重新连接");
            return;
          }
          kr(x.id, B.id, z);
          return;
        }
        bt(
          h.sourceNodeId,
          h.targetNodeId,
          m
        );
      }
    },
    [ye, kr, bt, a, Le]
  ), xr = F(() => {
    const m = Le;
    m?.lyricsAvailable && (gn(null), dn(
      m.sourceNodeId,
      m.targetNodeId
    ));
  }, [dn, Le]), _s = F(() => {
    gn(null);
  }, []), Tr = F(
    (m) => {
      o && (Jt.current = !0, !(!m.source || !m.target || m.source === m.target) && Nt(
        m.source || "",
        m.target || ""
      ));
    },
    [Nt, o]
  ), Lt = F(
    (m, h) => {
      if (!o)
        return;
      const x = String(h?.nodeId || "");
      x && (no.current = !0, I([]), tn(null)), Yt.current = x ? {
        nodeId: x,
        handleId: h?.handleId || null,
        handleType: h?.handleType || null
      } : null, Jt.current = !1, ct("");
    },
    [o, I]
  ), Rs = F(
    (m) => {
      if (!o) {
        Yt.current = null, Jt.current = !1;
        return;
      }
      const h = Yt.current;
      if (Yt.current = null, h?.nodeId && typeof window < "u" && window.setTimeout(() => {
        no.current = !1;
      }, 0), Jt.current) {
        Jt.current = !1;
        return;
      }
      if (!h?.nodeId)
        return;
      const x = zv(m);
      x && (to.current = !0, R(
        x,
        Kr(Ce, x),
        h
      ));
    },
    [Ce, o, R]
  ), ks = F(
    (m, h) => {
      o && (m.preventDefault(), m.stopPropagation(), tn(null), I([]), ct(h.id));
    },
    [o, I]
  );
  ue(() => {
    if (!nn || typeof window > "u")
      return;
    function m(h) {
      !o || !Ud(h) || (h.preventDefault(), ut(nn));
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [o, ut, nn]), ue(() => {
    if (b.length === 0 || nn || typeof window > "u")
      return;
    function m(h) {
      if (!o || !Ud(h))
        return;
      const x = a.filter(
        (D) => Ht.has(D.id)
      ), B = b.map((D) => Ot.get(D)).filter((D) => !!D);
      if (!(x.length === 0 && B.length === 0)) {
        if (h.preventDefault(), B.length > 0) {
          Me(B, x);
          return;
        }
        Go(x);
      }
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [
    o,
    a,
    Go,
    Me,
    nn,
    b.length,
    b,
    Ht,
    Ot
  ]);
  const q = F((m) => {
    ys(
      (h) => Pv(h, m) ? h : m
    );
  }, []), Ni = F(
    (m) => {
      if (!o)
        return !1;
      const h = a.find(
        (B) => B.id === m.source
      ), x = a.find(
        (B) => B.id === m.target
      );
      return Ca(h, x);
    },
    [o, a]
  ), Mr = F(
    (m, h) => {
      if (!o)
        return;
      if (Ot.has(h.id)) {
        q(null);
        return;
      }
      if (Re.has(h.id)) {
        q(null);
        return;
      }
      const x = ae.nodeById.get(h.id);
      if (!x) {
        q(null);
        return;
      }
      const B = Ei(
        a,
        h.id,
        h.position
      ), D = B === h.position ? h : { ...h, position: B };
      if (x.type === "group") {
        const H = h.position.x - x.x, Q = h.position.y - x.y;
        Bn(
          (Pe) => Pe.map((me) => {
            const Ie = ae.nodeById.get(me.id);
            return Ie?.groupId !== x.id ? me : {
              ...me,
              position: {
                x: Ie.x + H,
                y: Ie.y + Q
              }
            };
          })
        ), q(null);
        return;
      }
      if (tt.some(
        (H) => H.source === h.id || H.target === h.id
      )) {
        q(null);
        return;
      }
      const te = Ev(
        D,
        co,
        a
      );
      if (!te) {
        q(null);
        return;
      }
      const T = Av(
        x,
        te.domainNode
      );
      if (!T) {
        q(null);
        return;
      }
      q(Dv(T));
    },
    [
      ae.nodeById,
      tt,
      co,
      o,
      Re,
      a,
      Bn,
      Ot,
      q
    ]
  ), Ar = F(
    (m, h) => {
      if (!o) {
        mn(""), q(null);
        return;
      }
      if (Ot.has(h.id)) {
        const z = $c(
          a,
          h.id,
          h.position
        );
        z !== a && ie(z), mn(""), q(null);
        return;
      }
      if (Re.has(h.id)) {
        mn(""), q(null);
        return;
      }
      const x = a.find((z) => z.id === h.id);
      let B = !1;
      if (x) {
        const z = Ei(
          a,
          h.id,
          h.position
        ), te = $c(a, h.id, z), T = Hs(
          te,
          h.id,
          z
        );
        B = (x.groupId || "") !== (T.find((Q) => Q.id === x.id)?.groupId || ""), T !== a && ie(T);
        const H = Tt(T, d);
        Wl(d, H) || et(H);
      }
      if (mn(""), B) {
        q(null);
        return;
      }
      if (!at) {
        q(null);
        return;
      }
      tt.some(
        (z) => z.source === at.source && z.target === at.target
      ) || Nt(
        at.source,
        at.target
      ), q(null);
    },
    [
      d,
      Nt,
      et,
      tt,
      o,
      Re,
      ie,
      a,
      at,
      Ot,
      q
    ]
  ), G = F(
    (m) => {
      !o || m.button !== 2 || (dt.current = !1, dw(m.target) && (yn.current = {
        pointerId: m.pointerId,
        start: { x: m.clientX, y: m.clientY },
        baseNodeIds: m.ctrlKey || m.metaKey ? [...b] : [],
        moved: !1,
        contextMenuHandled: !1
      }, m.preventDefault(), m.stopPropagation(), m.currentTarget.setPointerCapture?.(m.pointerId)));
    },
    [o, b]
  ), un = F(
    (m) => {
      R(m, Kr(Ce, m));
    },
    [Ce, R]
  ), Dr = F(
    (m) => {
      const h = yn.current;
      !o || !h && !dt.current || (m.preventDefault(), m.stopPropagation(), dt.current = !1, h && (h.contextMenuHandled = !0));
    },
    [o]
  ), Ii = F(
    (m) => {
      const h = yn.current;
      if (!h || h.pointerId !== m.pointerId || !Ce || !sn.current)
        return;
      const x = m.clientX - h.start.x, B = m.clientY - h.start.y;
      if (!h.moved && Math.hypot(x, B) < 5)
        return;
      h.moved = !0, m.preventDefault(), m.stopPropagation();
      const D = sn.current.getBoundingClientRect();
      vs(
        uw(
          h.start,
          {
            x: m.clientX,
            y: m.clientY
          },
          D
        )
      );
      const z = lw(
        a,
        Kr(Ce, h.start),
        Kr(Ce, {
          x: m.clientX,
          y: m.clientY
        })
      );
      I(fw(h.baseNodeIds, z)), ct(""), tn(null);
    },
    [Ce, a, I]
  ), ve = F(
    (m) => {
      const h = yn.current;
      if (!h || h.pointerId !== m.pointerId)
        return;
      yn.current = null, m.currentTarget.hasPointerCapture?.(m.pointerId) && m.currentTarget.releasePointerCapture(m.pointerId), vs(null);
      const x = !h.moved && m.type === "pointerup";
      dt.current = !x && !h.contextMenuHandled, m.preventDefault(), m.stopPropagation(), x && h.contextMenuHandled && un({
        x: m.clientX,
        y: m.clientY
      });
    },
    [un]
  ), Ci = F(
    (m) => {
      if (o) {
        if (to.current) {
          to.current = !1;
          return;
        }
        I([]), ct(""), tn(null), !(!("detail" in m) || m.detail !== 2) && (m.preventDefault(), m.stopPropagation(), un({ x: m.clientX, y: m.clientY }));
      }
    },
    [o, I, un]
  ), Si = F(
    (m) => {
      if (o) {
        if (m.preventDefault(), m.stopPropagation(), dt.current) {
          dt.current = !1;
          return;
        }
        un({ x: m.clientX, y: m.clientY });
      }
    },
    [o, un]
  ), _i = F(
    (m, h) => {
      o && (m.preventDefault(), m.stopPropagation(), ct(""), Ht.has(h.id) || I([h.id]), tn({
        nodeId: h.id,
        x: m.clientX,
        y: m.clientY
      }));
    },
    [o, I, Ht]
  ), Se = St && a.find((m) => m.id === St.nodeId) || null, Ln = St && Ot.get(St.nodeId) || null, uo = !!(Se && Re.has(Se.id)), lo = Se && a.find(
    (m) => m.id === yh(a, Se)
  ) || null, Ho = Se ? { x: Se.x, y: Se.y } : void 0;
  function lt() {
    tn(null);
  }
  function xs() {
    if (!(!o || !Se)) {
      if (uo) {
        je("脚本托管节点不能复制，请在分镜脚本中修改结构"), lt();
        return;
      }
      _(
        Se,
        Ho ? { x: Ho.x + 34, y: Ho.y + 34 } : void 0
      ), lt();
    }
  }
  function Yo() {
    if (!o || !Se && !Ln)
      return;
    if (Ln) {
      const h = Ln;
      lt(), Me([h]);
      return;
    }
    if (!Se)
      return;
    if (uo) {
      je(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      ), lt();
      return;
    }
    const m = Se;
    lt(), Go([m]);
  }
  function It() {
    Se && (A(Se), lt());
  }
  function Ct() {
    lo && (A(
      lo,
      cl(Se)
    ), lt());
  }
  function ln() {
    if (!Se)
      return;
    const m = Zg(Se, a);
    if (!m) {
      lt();
      return;
    }
    Fe(Se.id, m), lt();
  }
  const Ri = F(() => {
    Ce?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [Ce]), Ze = F(
    (m) => {
      const h = ho(m);
      gt(h), Ce?.zoomTo?.(h, { duration: 120 });
    },
    [Ce, gt]
  ), Pr = F(() => {
    const m = ho(Mn + 0.12);
    gt(m), Ce?.zoomIn?.({ duration: 140 });
  }, [Ce, gt, Mn]), $n = F(() => {
    const m = ho(Mn - 0.12);
    gt(m), Ce?.zoomOut?.({ duration: 140 });
  }, [Ce, gt, Mn]), Ts = F(() => {
    if (o) {
      if (no.current) {
        no.current = !1;
        return;
      }
      ct(""), tn(null);
    }
  }, [o]), Ms = F(
    (m, h) => {
      o && mn(h.id);
    },
    [o]
  ), Er = F((m, h) => {
    Oo(h.id);
    const x = h.type === "workSpace" ? h.data.sourceNode : null;
    x && ka(x) && gm();
  }, []), ki = F(() => {
    Oo("");
  }, []), As = F(
    (m) => {
      const h = m;
      Eo(h), l.x != null && l.y != null && l.zoom != null ? (h.setViewport?.({
        x: l.x,
        y: l.y,
        zoom: l.zoom
      }), gt(l.zoom)) : gt(h.getZoom?.() || 1);
    },
    [gt, l.x, l.y, l.zoom]
  ), Vn = F(
    (m, h) => {
      oo(h.zoom);
    },
    [oo]
  ), xi = F(
    (m, h) => {
      gt(h.zoom), V({
        x: h.x,
        y: h.y,
        zoom: h.zoom
      });
    },
    [gt, V]
  ), Jo = F(() => {
    Tn((m) => !m);
  }, []), fo = F(() => {
    zo((m) => !m);
  }, []), Je = [
    "ws-canvas-wrap",
    Fo ? "is-dragging" : "",
    An ? "is-selecting" : "",
    en ? "is-resizing" : "",
    o ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ U(
    "section",
    {
      ref: sn,
      className: Je,
      style: sb(Mn),
      onPointerDownCapture: G,
      onPointerMoveCapture: Ii,
      onPointerUpCapture: ve,
      onPointerCancelCapture: ve,
      onContextMenuCapture: Dr,
      children: [
        /* @__PURE__ */ f(
          qn,
          {
            message: hs,
            onDismiss: () => je(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(ym, { root: sn, children: /* @__PURE__ */ f(
          Gm,
          {
            nodes: co,
            edges: bi,
            onlyRenderVisibleElements: !0,
            defaultViewport: l.x != null && l.y != null && l.zoom != null ? { x: l.x, y: l.y, zoom: l.zoom } : void 0,
            nodeTypes: pw,
            edgeTypes: gw,
            onNodesChange: Rt,
            onEdgesChange: Ss,
            onConnect: Tr,
            onConnectStart: Lt,
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
            onMove: Vn,
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
            children: o && xn && a.length > 0 ? /* @__PURE__ */ f(
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
        An ? /* @__PURE__ */ f(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: An,
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
            showMiniMap: xn,
            snapToGrid: ws,
            zoom: Mn,
            onOpenCanvasManager: c,
            onToggleMiniMap: Jo,
            onToggleSnap: fo,
            onReset: Ri,
            onZoomIn: Pr,
            onZoomOut: $n,
            onZoomChange: Ze
          }
        ),
        o && a.length === 0 ? /* @__PURE__ */ U("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ U("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ f(Nu, { size: 16 }),
            /* @__PURE__ */ f("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ f("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        o && St && (Se || Ln) ? /* @__PURE__ */ f(
          Ey,
          {
            point: St,
            canShowDetail: !!(Se && Dt(Se)),
            canCopy: !!(Se && !uo),
            canDelete: !!(Ln || !uo),
            canEditStructure: !!(lo && lo.id !== Se?.id),
            canResetStoryboardPrompt: !!(Se && Xg(Se)),
            onClose: lt,
            onCopy: xs,
            onDelete: Yo,
            onDetail: It,
            onEditStructure: Ct,
            onResetStoryboardPrompt: ln
          }
        ) : null,
        Le ? /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ f(
              gu,
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
                onSelect: Wo,
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
      children: /* @__PURE__ */ U(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (i) => i.stopPropagation(),
          children: [
            /* @__PURE__ */ U("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ f("h3", { children: e.title }),
              /* @__PURE__ */ f("p", { children: e.description })
            ] }),
            /* @__PURE__ */ U("div", { className: "ws-confirm-actions", children: [
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
function Md(e, t) {
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
function xl(e, t, n, o = e.length) {
  const s = Math.min(
    bo,
    Math.max(2, e.length, o)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: Oe(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: s },
      (r, i) => e[i] ? Ml(e[i], i) : Tl(i)
    )
  };
}
function xw(e, t, n, o) {
  if (t < 0 || t >= bo || (e?.frames.length || 0) > bo)
    return null;
  const s = e || xl([], null, o, t + 1), r = Math.min(
    bo,
    Math.max(2, s.frames.length, t + 1)
  ), i = Ml(n, t);
  return {
    ...s,
    frames: Array.from(
      { length: r },
      (c, a) => s.frames[a] || Tl(a)
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
function Tl(e) {
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
function Ml(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: lu(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function Wn(e, t, n) {
  const o = Ee(t, "asset"), s = To(o) ? qr(o) : void 0, r = Mt(
    Ee(t, "output"),
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result", "output"),
    Ee(t, "result", "asset", "version", "content"),
    Ee(t, "data", "output"),
    Ee(t, "data", "content"),
    Ee(t, "data", "result"),
    Ee(t, "data")
  ), i = e.type === "agent" && r != null ? Ve(r) : ni(r) || Pt(r), c = e.type === "power" && Hn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? jt([
    r,
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result"),
    i
  ]) : null, a = e.type === "power" && vp(e.power, e.kind, e.outputType) ? Oa([
    r,
    Ee(t, "asset", "version", "content"),
    Ee(t, "version", "content"),
    Ee(t, "result"),
    i
  ]) : null, d = Oe(
    String(Ee(t, "asset", "kind") || ""),
    String(Ee(t, "kind") || ""),
    hi(e, i)
  ), l = Jn(i, d), y = Kt(i, ""), v = e.type === "power" && Hn(e.power, e.kind, e.outputType).viewMode === "writing" ? [s?.version?.content, r, i].map(
    (_) => ap(_)?.document || ta(_)
  ).find(Boolean) : null, b = Oe(
    v?.title,
    a?.title,
    c?.title
  ), I = Vr(n), R = Vr(a?.summary) || Vr(c?.summary) || Vr(l.text) || Vr(y) || (I ? `已按提示生成：${I}` : "生成完成");
  return {
    ...b && e.titleMode === "auto" ? { title: b } : {},
    description: R,
    resultRef: Ka(t),
    resultOutput: a || c || i,
    asset: s || e.asset,
    kind: s?.kind || e.power?.kind || e.kind
  };
}
function Vr(e) {
  const t = Oe(e);
  return Sn(t) ? "" : t;
}
function ur(e, t) {
  const n = t.version?.content;
  return {
    ...Wn(
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
  return Ma(e.composerDraft);
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
function mc(e, t) {
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
  return r ? `${e.id}:feedback:${zl(r)}` : n;
}
function ha(e, t) {
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
const wa = 3e3, Aw = 80;
async function Wi(e) {
  e.consumerSignal?.throwIfAborted();
  const t = ov(e.startNode.id), n = /* @__PURE__ */ new Set();
  let o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: Ro(e.nodes),
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
  e.consumerSignal?.throwIfAborted(), va(e, ko(r));
  for (let i = 0; i < 8; i += 1) {
    const c = await Dw(
      e,
      r,
      o,
      (l) => {
        Ll(
          e,
          l,
          n
        ), El(e, l);
      },
      (l) => {
        o = l;
      }
    );
    e.canvasRun = c, va(e, c), Zr(e, c);
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
      if (yc(e, c), d === "fail" || d === "error")
        throw new Error(iu(c));
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
function va(e, t) {
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
  let r = ba(
    e,
    ko(t)
  );
  if (o(r.node_results || []), Zr(e, r), r.status !== "running" && r.status !== "pending")
    return r;
  const i = String(r.request_id || "");
  if (!i) return r;
  const c = new AbortController();
  let a = !1, d = n, l, y;
  const v = new Promise((A, O) => {
    l = A, y = O;
  }), b = () => {
    a || (a = !0, y(e.consumerSignal?.reason)), c.abort();
  }, I = (A) => {
    if (a || e.consumerSignal?.aborted) return;
    const O = gc(r, A);
    if (r = O.detailsPending ? O : ba(e, O), va(e, r), r.detailsPending) {
      Zr(e, r), In(r.status) && (Yr(e, _o(r), !1), yc(e, r), c.abort());
      return;
    }
    o(r.node_results || []), Zr(e, r), !(r.status === "running" || r.status === "pending") && (a = !0, l(r), c.abort());
  }, R = e.subscribeRun(i, I);
  e.consumerSignal?.addEventListener("abort", b, {
    once: !0
  }), e.consumerSignal?.aborted && b();
  const _ = {
    ...e,
    canUpdateNode: (A) => !c.signal.aborted && !e.consumerSignal?.aborted && !Xr(r).has(A) && ot(e, r, A)
  };
  (async () => {
    for (; !c.signal.aborted; ) {
      try {
        const A = await Pw(
          e,
          i,
          d,
          (O) => {
            if (a || e.consumerSignal?.aborted) return;
            O.stream_id && (d = O.stream_id, s(d)), Yr(
              _,
              _o(r),
              !1
            );
            const $ = Dl(O, e);
            if ($) I($);
            else {
              const oe = String(
                O.output?.node_key || O.output?.node_id || ""
              );
              (!oe || ot(e, r, oe)) && Pl(_, O);
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
        _,
        _o(r),
        !0
      ), await Al(
        wa,
        c.signal
      );
    }
  })().catch((A) => {
    c.signal.aborted && r.detailsPending && In(r.status) || a || (a = !0, y(A));
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
function Al(e, t) {
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
  return await yu({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: s,
    onFrame: (i) => {
      if (o(i), String(i.type || "").toLowerCase() === "result") {
        if (Ew(i))
          throw new Error(i.msg || "画布流返回失败");
        r = ba(
          e,
          ko(i.output || {})
        );
      }
    }
  }), r;
}
function Ew(e) {
  return Number(e.status || 0) === 2;
}
function ba(e, t) {
  if (!e.singleNode || Ow(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), o = String(t.status || n?.status || "");
  if (n && (o !== "waiting" || t.pending_node))
    return t;
  const s = Fw(t), r = Mt(n?.output, t.output), i = {
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
    approval: Mt(n?.approval, s),
    interaction: Mt(
      n?.interaction,
      So(n?.result),
      So(t.pending_node),
      So(t.output)
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
    (s) => To(s) && (s.status === "pending" || s.decision === "pending")
  );
}
function Dl(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return ko(e.output || {});
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
  const o = e.output, s = To(o) ? o : {}, r = Vp(s, n);
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
    approval: Mt(
      r.approval,
      zw(e, i)
    ),
    interaction: Mt(
      e.interaction,
      r.interaction,
      So(r)
    ),
    persists_result: !!(e.persists_result || r.persists_result),
    agent_run_id: Number(
      e.agent_run_id || r.agent_run_id || s.agent_run_id || 0
    ),
    runTiming: jp(
      Mt(e.run_timing, r.runTiming, s.run_timing)
    )
  };
}
function zw(e, t) {
  const n = si(t.result), o = Mt(
    e.approval,
    t.approval,
    n.approval
  );
  if (o && typeof o == "object")
    return o;
  const s = Number(
    Mt(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return s > 0 ? { id: s } : void 0;
}
function So(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const s of ["result", "pending_node"]) {
    const r = So(n[s], t + 1);
    if (r)
      return r;
  }
  const o = Array.isArray(n.node_results) ? n.node_results : [];
  for (const s of o) {
    const r = So(s, t + 1);
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
function Pl(e, t) {
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
            ...Fa(i),
            nodeId: s,
            title: String(n.node_name || n.node_key || s),
            startedAt: Ea({
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
        const c = Ad(n.output), a = String(n.node_type || "").toLowerCase(), d = a === "power", l = a === "agent", y = Ad(c.meta), v = Kp(
          Mt(
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
          agent: l ? Nm(i.agent, c) : i.agent
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s, r) : e.setRunningNode((i) => {
        const c = r(i[s]);
        return c === i[s] ? i : c ? { ...i, [s]: c } : wu(i, s);
      });
    }
  }
}
function Lw(e, t, n, o) {
  const s = Dl(t), r = t.output || {}, i = String(r.event || ""), c = String(r.node_key || r.node_id || "");
  return !c || n.size > 0 && !n.has(c) || o.has(c) ? s : i === "node_finished" ? (o.add(c), e.runningNodeBatcher?.flush(), s) : (Pl(e, t), s);
}
function Ad(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function gc(e, t) {
  if (e.request_id && t.request_id && e.request_id !== t.request_id || e.run_id && t.run_id && e.run_id !== t.run_id || In(e.status) && !In(t.status))
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
function El(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (o) => In(o.status) && ot(e, e.canvasRun, o.node_key)
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
      c && (c.status === "success" || c.status === "error") && ot(e, o, i) && s.set(i, c);
    }
    return r;
  }), window.setTimeout(() => {
    e.setRunningNode?.((r) => {
      let i = r;
      for (const [c, a] of s)
        r[c] !== a || !ot(e, o, c) || (i === r && (i = { ...r }), delete i[c]);
      return i;
    });
  }, n);
}
function $w(e, t, n) {
  let o = !1;
  const s = { ...t };
  for (const r of n) {
    const i = r.node_key;
    if (!ot(e, e.canvasRun, i)) continue;
    const c = e.nodes.find((d) => d.id === i);
    if (r.status === "canceled") {
      s[i] && (delete s[i], o = !0);
      continue;
    }
    if (r.status === "waiting") {
      s[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: Ea({
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
      agent: c?.type === "agent" ? bm(r.output) : a.agent
    }, o = !0);
  }
  return o ? s : t;
}
function yc(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((s) => {
      const r = Dd(
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
    const i = { ...s }, c = Dd(
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
    Ol(e, t).filter(
      (s) => s === br(t) || !n || n.has(s)
    ),
    o === "success" ? 650 : 1200,
    t
  );
}
function Dd(e, t, n, o) {
  const s = br(t), r = new Set(
    Ol(e, t).filter(
      (i) => i === s || !o || o.has(i)
    )
  );
  return Object.keys(n).filter(
    (i) => r.has(i) && ot(e, t, i)
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
      if (!ot(e, t, I)) continue;
      const _ = e.nodes.find(($) => $.id === I), M = I === c;
      if (!_ && !M)
        continue;
      const A = y[I], O = Ea({
        nodeRunTiming: i.get(I),
        runCreatedAt: t.created_at,
        currentStartedAt: A?.startedAt
      });
      A?.status === R && A.startedAt === O || (b[I] = {
        ...A,
        ...Fa(A),
        nodeId: I,
        title: M ? `${e.startNode.title || "分镜脚本"}制作区` : _?.title || I,
        startedAt: O,
        progress: R === "waiting" ? 92 : A?.progress || 0,
        status: R
      }, v = !0);
    }
    return v ? b : y;
  });
}
function Ol(e, t) {
  const n = new Set(_o(t)), o = br(t);
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
  if (Vt(t) || e && Nn(e))
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
  const _ = new Set(
    [...Pa([...n.values()], t, e.sourceNodeId).values()].map((O) => O.groupId)
  ), M = [.../* @__PURE__ */ new Set([...e.memberNodeIds, ..._])].map((O) => n.get(O)).filter(
    (O) => O?.type === "group" && O.group?.origin === "script" && (_.size === 0 || !["characters", "scenes", "props"].includes(O.group.syncKey || "") || _.has(O.id))
  ).map((O) => {
    const $ = o.get(O.id) || Ks;
    return Pd({
      executionNode: O,
      members: $,
      runBlockedReasonByNodeId: s,
      runningNodes: r,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => d(O.id),
      onStopRun: y,
      onOpenNode: v,
      projectNode: b,
      reuse: I,
      projectionDependencies: R
    });
  }), A = e.workNodeIds.map((O) => n.get(O)).find((O) => O?.storyboardItem?.itemType === "video_compose");
  return A && M.push(
    Pd({
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
  ), M;
}
function Pd({
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
  const b = s.get(e.id), I = !!(b && r.has(ht(b)));
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
      const R = Za({
        members: t,
        runningNodes: o,
        groupState: o[e.id],
        hasResult: i
      }), _ = String(b?.status || "").trim().toLowerCase(), M = b && R.status === "idle" ? _ === "waiting" ? "waiting" : "running" : R.status, A = M === "running" || M === "waiting", O = R.runnableCount === 0, $ = A ? "" : n.get(e.id) || (O ? "当前分组未配置可用能力" : "");
      return {
        id: e.id,
        title: e.title || "未命名分组",
        materialType: { characters: "character", scenes: "scene", props: "prop" }[e.group?.syncKey],
        memberCount: R.memberCount,
        runnableCount: R.runnableCount,
        completedCount: R.completedCount,
        failedCount: R.failedCount,
        status: M,
        runBlockedReason: $,
        stopping: I,
        results: t.map(
          (oe) => Gw(
            oe,
            o[oe.id],
            i(oe),
            d,
            l,
            y
          )
        ),
        onRun: !A && !$ ? c : void 0,
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
  return t ? oc(t) : "";
}
function $s(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const o = Number(e.asset_cate_id || 0);
  return o === 0 || o === t.assetCateId;
}
function _o(e) {
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
      (t) => In(vr(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function Hw(e) {
  return Fl(e).map((t) => t.run);
}
function Yw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    Nn(n) && t.set(ht(n), n);
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
function Fl(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e) {
    const s = /* @__PURE__ */ new Set();
    for (const r of _o(o))
      t.has(r) || (t.add(r), s.add(r));
    s.size !== 0 && Nn(o) && n.push({ run: o, managedNodeIds: s });
  }
  return n;
}
function jr(e) {
  return e.map(Bl).filter((t) => !!t);
}
function Bl(e) {
  const t = ko(e);
  return t.run_id || t.request_id ? t : null;
}
function Zw(e, t, n) {
  const o = new Map(t.map((r) => [ht(r), r])), s = /* @__PURE__ */ new Set();
  for (const r of e) {
    const i = Number(r.run_id || 0);
    if (!i || n && Lp(r, n))
      continue;
    const c = o.get(ht(r));
    !c?.detailsPending && n && Qw(r, n) || (!c || c.detailsPending || c.status !== r.status || c.executed !== r.executed || c.total !== r.total || c.error !== r.error || r.status === "waiting" && !c.pending_node) && s.add(i);
  }
  return [...s];
}
function Qw(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const r = t[String(n)];
    return r ? Na(e, r) : !1;
  }
  const o = Number(e.asset_cate_id || 0);
  return (o ? Object.values(t).filter(
    (r) => r.assetCateId === o
  ) : Object.values(t)).some(
    (r) => Na(e, r)
  );
}
function Na(e, t) {
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
      if (l && (a += 1, !Ia(l, e, d)))
        return !1;
    }
    return a > 0;
  }
  const s = String(e.start_node_id || ""), r = o.get(s), i = (e.node_results || []).find(
    (c) => c.node_key === s
  );
  return Ia(r, e, i);
}
function Ia(e, t, n) {
  const o = vr(n) || t.status;
  return Gg(
    e,
    t,
    n,
    e?.type !== "power" || o !== "success" || Dt(e)
  );
}
function Hi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e)
    n.set(ht(s), s);
  for (const s of t) {
    const r = ht(s), i = n.get(r);
    n.set(r, i ? gc(i, s) : s);
  }
  let o = 0;
  return [...n.values()].sort(ev).filter((s) => Nn(s) || s.detailsPending || o++ < 50);
}
function ev(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const o = Ed(t) - Ed(e);
  return o !== 0 ? o : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Ed(e) {
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
function Yi(e, t, n, o) {
  const s = e.find(
    (r) => r.canvas_id === t && _o(r).includes(o)
  );
  return s ? ii(s).some(
    (r) => ii(n).includes(r)
  ) : !0;
}
function ot(e, t, n) {
  const o = n === br(t || {}) ? e.startNode.id : n;
  return !t || !e.ownsNodeResult || e.ownsNodeResult(t, o);
}
function ov(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function rv(e, t, n) {
  const o = typeof n == "string" ? n : Zs(n), s = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${s}-${zl(o)}`.slice(
    0,
    96
  );
}
function zl(e) {
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
  if (!o || !ot(e, t, o.id))
    return;
  const s = hc(n, o);
  if (!s)
    return;
  const r = mc(o, s), i = Io(o), c = ha(
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
  const s = hc(n, o);
  if (!s || !e.requestFlowFeedback)
    throw new Error(`${o.title} 需要补充信息，请单独处理后继续`);
  const r = await e.requestFlowFeedback({ node: o, prompt: s });
  return Ul(
    e.projectId,
    t,
    n,
    s,
    r
  );
}
async function Ul(e, t, n, o, s) {
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
    const r = hc(s, t);
    if (!r)
      continue;
    if (mc(t, r).id === n.id)
      return { run: o, pending: s, prompt: r };
  }
  return null;
}
function hc(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : So(e);
  if (n?.interaction?.id)
    return al({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const s = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, r = Mt(
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
function Ll(e, t, n) {
  let o = 0;
  const s = new Map(e.nodes.map((r) => [r.id, r]));
  for (const r of t) {
    const i = s.get(r.node_key), c = vr(r);
    if (!i || !In(c) || !ot(e, e.canvasRun, r.node_key))
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
  const n = cs(e).prompt.trim(), s = (t ? jl(e.id, t.nodes, t.edges) : null)?.text.trim() || "", r = [n, s ? `上游内容：
${s}` : ""].filter(Boolean).join(`

`);
  return Array.from(r).slice(0, iw).join("");
}
function dv(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || vr(t) !== "success" || Number(t.version_id || 0) <= 0 || !Yd(e) ? !1 : !["storyboard", "writing"].includes(
    Hn(e.power, e.kind, e.outputType).viewMode
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
    const a = Wn(t, n, "后端执行结果");
    return r(
      Ji(t, {
        ...fu(a.resultOutput) ? { ...a, asset: void 0 } : { resultRef: Ka(n) },
        runError: $p(n)
      })
    );
  }
  if (o === "canceled")
    return r(
      Ji(t, { runError: "" })
    );
  const i = Om({
    result: n,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), c = (a) => Ji(t, a);
  return r(
    c(i ? {
      ...Wn(
        t,
        Fm(n, i),
        "后端执行结果"
      ),
      runError: ""
    } : {
      ...Wn(t, n, "后端执行结果"),
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
function Ji(e, t) {
  const n = Io(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function pv(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? iu(
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
  return sa(n, o);
}
function gv(e) {
  return Math.max(0, Number(e || 0));
}
function Do(e) {
  const t = _n(e), n = Jn(
    t,
    hi(e, t)
  );
  return Yn(n) || (n.text = Kt(t, "")), n;
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
function Xi(e) {
  const t = Do(e);
  if (Yn(t))
    return t;
  const n = Jn(
    _n(e),
    String(e.kind || e.power?.kind || "")
  );
  return Yn(n) || (n.text = Kt(_n(e), "")), n;
}
function wc(e) {
  return hv(e) || Oh(e);
}
function bn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : _n(e);
}
function qs(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    bn(e)
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
  const o = $l(e), s = Vl(
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
        el({
          targets: i.type === "group" ? o.groupMembersById.get(i.id) || [] : [i],
          nodesByID: o.nodeById,
          hasResult: r
        })
      ])
    )
  };
}
function $l(e) {
  const t = new Map(e.map((s) => [s.id, s])), n = new Map(
    e.map((s) => [s.id, Dt(s)])
  ), o = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!s.groupId)
      continue;
    const r = o.get(s.groupId) || [];
    r.push(s), o.set(s.groupId, r);
  }
  return { nodeById: t, groupMembersById: o, hasResultByNodeId: n };
}
function Vl(e, t, n, o = "", s) {
  const { nodeById: r, groupMembersById: i, hasResultByNodeId: c } = n, a = (R) => {
    const _ = r.get(R);
    return _ ? _.type === "group" ? i.get(_.id) || [] : [_] : [];
  }, d = /* @__PURE__ */ new Set();
  for (const R of t) {
    const _ = fn(R);
    if (o && _.targetNodeId !== o)
      continue;
    const { sourceNodeId: M } = _;
    for (const A of a(M))
      d.add(A.id);
  }
  const l = /* @__PURE__ */ new Map();
  for (const R of e)
    if (d.has(R.id)) {
      const _ = bv(
        R,
        c.get(R.id) || !1
      );
      _ && Od(_).trim() !== "" && l.set(R.id, _);
    }
  const y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
  for (const R of t) {
    const { sourceNodeId: _, targetNodeId: M } = fn(R);
    if (!(o && M !== o || !r.has(M)))
      for (const A of a(_)) {
        if (ru(R) && Va(A)) {
          const Y = v.get(M) || [];
          Y.push({ edge: R, source: A }), v.set(M, Y);
        }
        const O = l.get(A.id), $ = b.get(M) || /* @__PURE__ */ new Set();
        if (!O || $.has(A.id))
          continue;
        $.add(A.id), b.set(M, $);
        const oe = y.get(M) || [];
        oe.push(O), y.set(M, oe);
      }
  }
  const I = /* @__PURE__ */ new Map();
  for (const [R, _] of v) {
    const M = s?.incomingMediaReferencesByNodeId.get(R);
    if (!M) continue;
    const A = _.map((O, $) => {
      const oe = M[$];
      return oe?.edge === O.edge && oe.source === O.source ? oe : O;
    });
    v.set(
      R,
      A.length === M.length && A.every(
        (O, $) => O === M[$]
      ) ? M : A
    );
  }
  for (const [R, _] of y)
    I.set(R, {
      sources: _,
      text: _.map(Od).join(`

`)
    });
  return {
    inputContextByNodeId: I,
    incomingMediaReferencesByNodeId: v
  };
}
function fn(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function jl(e, t, n) {
  const o = $l(t);
  return Vl(
    t,
    n,
    o,
    e
  ).inputContextByNodeId.get(e) || null;
}
function bv(e, t) {
  if (!t)
    return null;
  const n = _n(e), o = hi(e, n), s = Jn(n, o);
  return Yn(s) || (s.text = Kt(
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
function Od(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || Rl(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Ca(e, t) {
  return Wd(e, t);
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
function Fd(e, t, n, o) {
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
function Sa(e, t, n, o) {
  if (e.kind === "direct" && !t) return {};
  if (e.kind === "media" && t?.kind === "media" && e.options.some(({ key: s }) => s === t.key))
    return { draft: e.draft, mediaUsage: t.key };
  if (e.kind === "text") {
    const s = cs(o);
    if (t?.kind === "lyrics" && e.lyricsAvailable)
      return { draft: cu(s, n.id) };
    if (t?.kind === "text" && e.params.some(({ key: r }) => r === t.key))
      return { draft: au(s, n.id, t.key) };
  }
}
function Kl(e, t, n) {
  const o = n.composerDraft?.storyboardLyricsSourceNodeId;
  return !o || o === t ? e : e.filter((s) => !(jn(s) === "media" && (s.logicalFrom || s.from) === o && (s.logicalTo || s.to) === n.id));
}
function Kn(e, t, n, o, s) {
  return !t || !n || t === n || e.some((i) => {
    const c = fn(i);
    return c.sourceNodeId === t && c.targetNodeId === n;
  }) ? e : [
    ...e,
    {
      id: `edge-${t}-${n}-${Date.now()}`,
      from: t,
      to: n,
      purpose: su(
        o.find((i) => i.id === t),
        o.find((i) => i.id === n)
      ),
      ...s ? { mediaUsage: s } : {}
    }
  ];
}
function _a(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function Ra(e, t) {
  return e.type === "asset" && _a(e) === t;
}
function Bd(e, t, n, o) {
  const s = new Map(e.map((r) => [r.id, r]));
  if (o)
    for (const r of t) {
      if (r.from !== o)
        continue;
      const i = s.get(r.to);
      if (i && Ra(i, n))
        return i;
    }
  return e.find((r) => Ra(r, n)) || null;
}
function zd(e, t, n, o, s) {
  const r = /* @__PURE__ */ new Set();
  if (!o || !n)
    return r;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== o || c.to === s)
      continue;
    const a = i.get(c.to);
    a && Ra(a, n) && r.add(a.id);
  }
  return r;
}
function Zi(e, t) {
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
  const o = ql(e), s = (o > 0 ? t.get(o) : void 0) || (!e.storyboardItem && (e.type === "power" || e.type === "agent" || e.type === "flow") ? n.get(e.id) : void 0);
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
function ql(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function xv(e) {
  if (!Qt(e, "import"))
    return null;
  const t = ql(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function Tv(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Gl(e.nodes, t.nodes) && Wl(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Gl(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => n === t[o]);
}
function Mv(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.status === t.status;
}
function Wl(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n === s || n.id === s.id && n.from === s.from && n.to === s.to && (n.logicalFrom || "") === (s.logicalFrom || "") && (n.logicalTo || "") === (s.logicalTo || "") && (n.purpose || "") === (s.purpose || "") && (n.executionMode || "auto") === (s.executionMode || "auto") && (n.mediaUsage || "") === (s.mediaUsage || "");
  });
}
function Av(e, t) {
  return Ca(e, t) ? { source: e.id, target: t.id } : Ca(t, e) ? { source: t.id, target: e.id } : null;
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
function Ud(e) {
  const t = e.target, n = t === document.body || t === document.documentElement || t instanceof Element && !!t.closest(".ws-canvas-wrap");
  return !e.defaultPrevented && !e.repeat && (e.key === "Delete" || e.key === "Backspace") && n && !Uv(t) && !(t instanceof Element && t.closest(
    '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="combobox"], [data-radix-popper-content-wrapper]'
  )) && !document.querySelector(
    '[role="dialog"][aria-modal="true"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]'
  );
}
function Lv(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ f(Ua, { ...n }) : e === "import" ? /* @__PURE__ */ f(ia, { ...n }) : e === "display" ? /* @__PURE__ */ f(za, { ...n }) : e === "save" ? /* @__PURE__ */ f(_u, { ...n }) : /* @__PURE__ */ f(Ru, { ...n });
}
function wi(e) {
  return Qt(e, "start");
}
function Hl(e) {
  return !!(e.type === "function" && ds(e.functionOption?.key)?.showsResult);
}
function vi(e) {
  return Hl(e) && Dt(e);
}
function $v(e) {
  return {
    description: e
  };
}
function Vv(e, t) {
  return {
    ...$v(t),
    resultRef: Ka({
      ...si(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Ld = { width: 620, height: 420 }, vc = 44;
function Yl(e, t) {
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
function Jl(e) {
  if (e.type === "power" && Hn(e.power, e.kind, e.outputType).viewMode === "writing" && na(e))
    return pp(bc(e));
  if (e.type === "function") {
    if (vi(e)) {
      if (!na(e))
        return { width: e.width, height: e.height };
      const n = $d(e);
      return n ? {
        width: n.width,
        height: n.height + vc
      } : qv(e);
    }
    return { width: 128, height: 46 };
  }
  const t = $d(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function bc(e, t = e.resultOutput) {
  const n = Qr(e, e.resultOutput), o = t === e.resultOutput ? null : Qr(e, t);
  return (o ? mp(n, o) : n)?.document || ta(e.asset?.version?.content) || ta(e.resultOutput);
}
function $d(e) {
  if (!na(e) || !Kv(e))
    return null;
  const t = Do(e);
  return !uu(
    bn(e),
    us(t)
  ) || Yl(e, t) ? null : {
    width: Math.max(e.width, Ld.width),
    height: Math.max(e.height, Ld.height)
  };
}
function Kv(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Hn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function qv(e) {
  const t = Do(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), o = Ta({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: o.width,
    height: o.height + vc
  };
}
const Gv = {
  agent: { input: { left: "4px" }, output: { right: "4px" } },
  flow: { input: { left: "11px" }, output: { right: "11px" } },
  function: { input: { left: "0px" }, output: { right: "0px" } }
};
function Xl(e) {
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
  return vu(pc) ? null : /* @__PURE__ */ f(
    Ym,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${o}`,
      style: s,
      children: /* @__PURE__ */ f("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ f(Iu, { size: 12 }) : /* @__PURE__ */ f(Cu, { size: 12 }) })
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
function vn({
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
    return /* @__PURE__ */ U(Gt, { children: [
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
  return e.type === "asset" || e.type === "group" || e.type === "function" || !ka(e) || !t || !e.showNodeSettings ? o : /* @__PURE__ */ U(Gt, { children: [
    o,
    /* @__PURE__ */ f(
      xe,
      {
        fallback: /* @__PURE__ */ f(ke, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ f(km, { node: e }, e.id)
      }
    )
  ] });
}
function ka(e) {
  if (e.type === "agent")
    return !0;
  if (e.type !== "power") return !1;
  const t = Hn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return t !== "video_compose" && !(t === "writing" && Jd(bc(e)));
}
function rr({
  node: e,
  onShowNodeDetail: t
}) {
  return !t || !Dt(e) ? null : /* @__PURE__ */ f(
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
      children: /* @__PURE__ */ f(za, { size: 14 })
    }
  );
}
const Hv = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function Qi({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const o = is(
    e.resultView || Hv
  ), [s, r] = K(null), i = Vy(
    o,
    s
  ), [c, a] = K(!1), d = e.type === "agent" ? t?.agent : void 0, l = xm(d);
  if (!Dt(e) && !l)
    return null;
  const y = Do(e), v = cc(e), b = Oe(
    Kt(y.text, ""),
    Kt(v, ""),
    Kt(e.description, ""),
    e.title,
    "暂无结果"
  ), I = wc(e), R = bn(e), _ = Ge(R) ? R : I ? { rich: I } : b, M = pl(y) ? y : Lh(
    y,
    Jn(b, bl(b, ""))
  ), A = e.interactive, O = Mt(
    e.resultOutput,
    e.asset?.version?.content
  ), $ = e.type === "agent" ? async (oe) => {
    if (!Vt(t))
      try {
        await e.onRunBackendNode(e, { agentInput: oe });
      } catch (Y) {
        e.onNodeResult(e.id, {
          runError: Y instanceof Error ? Y.message : "智能体继续运行失败"
        });
      }
  } : void 0;
  return /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    fl,
    {
      output: _,
      fallback: b,
      preview: M,
      mediaLabel: gr(M),
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
              (oe) => md(
                o,
                oe,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (oe) => r(
            (Y) => md(
              o,
              Y,
              oe
            )
          ),
          onResizeEnd: (oe) => {
            a(!1), e.onResultViewResizeEnd(e.id, oe), r(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ f(
        xe,
        {
          fallback: /* @__PURE__ */ f(ke, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ f(
            Tm,
            {
              output: O,
              runtime: d,
              fallback: b,
              running: Vt(t),
              onContinue: $
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
  const o = Do(e), s = wc(e), r = bn(e), i = Oe(
    cc(e),
    Kt(o.text, ""),
    Kt(e.description, ""),
    "暂无内容"
  ), c = Ge(r) ? r : s ? { rich: s } : i, a = !lr(c, o) && !!(o.imageUrl || o.videoUrl || o.audioUrl), d = a && !o.audioUrl ? Ws(
    e,
    e.onNodeResult,
    vc
  ) : void 0;
  return /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    fl,
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
        tf,
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
function ea({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = Io(e);
  if (!t || n.length === 0)
    return null;
  const o = n.filter(
    (r) => r.status === "pending"
  ).length, s = [...n].reverse().find((r) => r.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ U(
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
function Dt(e) {
  if (!Xv(e) || !Jv(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = _n(e);
  if (t == null)
    return !1;
  const n = Jn(
    t,
    hi(e, t)
  );
  return Yn(n) || fc(t);
}
function Xv(e) {
  return e.type !== "function" ? !0 : Hl(e);
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
      Wn(
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
      kind: Em(e.node),
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
      Wn(
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
function Nc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function Qv(e) {
  const t = Nc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function eb(e) {
  const t = Nc(e);
  return Wg(t);
}
function tb(e, t) {
  const n = Nc(t);
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
  const d = re(
    () => rb(t),
    [t]
  );
  if (typeof document > "u")
    return null;
  const l = document.querySelector(".ws-page") || document.body;
  return wp(
    /* @__PURE__ */ f("div", { className: "ws-flow-feedback-backdrop", onMouseDown: c, children: /* @__PURE__ */ U(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (y) => y.stopPropagation(),
        children: [
          /* @__PURE__ */ U("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ U("div", { children: [
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
                children: /* @__PURE__ */ f(Su, { size: 18 })
              }
            )
          ] }),
          s && s.length > 1 ? /* @__PURE__ */ f("div", { className: "ws-flow-feedback-tabs", children: s.map((y, v) => /* @__PURE__ */ U(
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
          /* @__PURE__ */ U("div", { className: "ws-flow-feedback-body custom-scrollbar", children: [
            e,
            /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载交互表单" }), children: /* @__PURE__ */ f(
              hm,
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
          o ? /* @__PURE__ */ f("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ U(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: c,
              children: [
                /* @__PURE__ */ f(La, { size: 16 }),
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
function ho(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function sb(e) {
  const t = ho(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Vd(e, t) {
  if (!e)
    return;
  const n = ho(t);
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
function Zl({
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
  const { ref: t, visible: n } = vm(), o = Hm();
  ns(() => {
    if (!n) return;
    const r = window.requestAnimationFrame(
      () => o(e.id)
    );
    return () => window.cancelAnimationFrame(r);
  }, [e.id, o, n]);
  const s = Xl(e.data);
  return /* @__PURE__ */ f(
    "div",
    {
      ref: t,
      style: { position: "relative", width: "100%", height: "100%" },
      children: n ? /* @__PURE__ */ f(Ql, { ...e }) : /* @__PURE__ */ U(Gt, { children: [
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
function Ql({
  data: e,
  selected: t
}) {
  const [n, o] = K(""), s = vu(pc), r = e, i = Xl(r), {
    sourceNode: c,
    projectId: a,
    runningNode: d,
    onShowNodeDetail: l,
    onConfirmStoryboard: y,
    onNodeResult: v,
    onOpenFeedbackRecord: b,
    canvasReferenceItems: I,
    connectedMediaReferences: R,
    onConnectedMediaEdgeRemove: _,
    onNodeDraftChange: M,
    onOpenStoryboardGridImport: A,
    onRunBackendNode: O,
    structureLocked: $,
    storyboardSourceNode: oe
  } = e, Y = r.type === "power" ? Hn(r.power, r.kind, r.outputType) : null, ie = Y?.viewMode === "writing", P = Y?.viewMode === "storyboard", he = Y?.viewMode === "setting", V = Y?.viewMode === "storyboard_grid", X = Y?.viewMode === "video_compose";
  if (r.type === "group") {
    const L = r.groupMembers, Z = r.groupRuntime || Za({
      members: L,
      runningNodes: rw,
      groupState: d,
      hasResult: Dt
    }), ge = r.runBlockedReason;
    let ye;
    return ge || (ye = () => Zl({
      group: r,
      sourceNode: c,
      members: L,
      runNode: O,
      hasResult: Dt,
      onError: o
    })), /* @__PURE__ */ U(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载分组" }), children: [
      /* @__PURE__ */ f(
        qn,
        {
          message: n,
          onDismiss: () => o("")
        }
      ),
      /* @__PURE__ */ U(
        Ih,
        {
          node: r,
          memberCount: Z.memberCount,
          runnableCount: Z.runnableCount,
          completedCount: Z.completedCount,
          failedCount: Z.failedCount,
          status: Z.status,
          selected: t,
          managed: $,
          onRename: $ ? void 0 : (be) => v(r.id, { title: be, titleMode: "manual" }),
          onEditStructure: oe ? () => l(
            oe,
            cl(r)
          ) : void 0,
          onRun: ye,
          runBlockedReason: ge,
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
            /* @__PURE__ */ f(vn, { node: r, selected: t })
          ]
        }
      )
    ] });
  }
  if (r.type === "agent") {
    const L = Vt(d) || d?.status === "success";
    return /* @__PURE__ */ U(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${L ? "is-running" : ""}`,
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
          /* @__PURE__ */ U("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ f(pg, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ f(
              Ki,
              {
                className: "ws-node-circle-title",
                title: r.title,
                onRename: v ? (Z) => v(r.id, { title: Z, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          L ? /* @__PURE__ */ U(
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
            ea,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          /* @__PURE__ */ f(
            Qi,
            {
              node: r,
              runningNode: d,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(vn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "flow") {
    const L = Vt(d) || d?.status === "success";
    return /* @__PURE__ */ U(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${L ? "is-running" : ""}`,
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
          L ? /* @__PURE__ */ U(
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
          /* @__PURE__ */ U("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ f(mg, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ f(
              Ki,
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
            ea,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          /* @__PURE__ */ f(Qi, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(vn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "function") {
    const L = r.functionOption?.key || "", Z = Qt(r, "start"), { onRunFunctionNode: ge, requestConfirm: ye } = r, be = Vt(d), fe = be, we = vi(r), Fe = () => {
      ge(r).catch((Ne) => {
        o(Ne instanceof Error ? Ne.message : "执行出错");
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
    }, Be = (Ne) => {
      Ne.preventDefault(), Ne.stopPropagation(), ce();
    };
    return /* @__PURE__ */ U(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${fe ? "is-running" : ""} ${we ? "has-result-card" : ""} is-${L || "default"}`,
        children: [
          /* @__PURE__ */ f(
            qn,
            {
              message: n,
              onDismiss: () => o("")
            }
          ),
          /* @__PURE__ */ U(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": fe,
              onClick: Be,
              onKeyDown: (Ne) => {
                Ne.key !== "Enter" && Ne.key !== " " || (Ne.preventDefault(), Ne.stopPropagation(), ce());
              },
              children: [
                /* @__PURE__ */ f("div", { className: "ws-node-function-icon", children: be ? /* @__PURE__ */ f(xo, { size: 15, className: "ws-spin" }) : Lv(L, Z) }),
                /* @__PURE__ */ f("span", { className: "ws-node-function-title", children: be ? d?.status === "waiting" ? "等待中" : "运行中" : r.title })
              ]
            }
          ),
          we ? /* @__PURE__ */ f(
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
            ea,
            {
              node: r,
              onOpenFeedbackRecord: b
            }
          ),
          we ? null : /* @__PURE__ */ f(Qi, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(vn, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "asset") {
    if (r.kind === "image") {
      const ce = Xi(r), Be = bn(r), Ne = lr(Be, ce), Et = Ws(r, v), rt = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ U("div", { className: rt, children: [
        /* @__PURE__ */ U("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(Zc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "图片资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-image-container ws-node-content-container", children: Ne ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          fr,
          {
            output: Be,
            fallback: ce.text || r.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : ce.imageUrl ? /* @__PURE__ */ f(
          xa,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-image-raw",
            onMediaSize: Et
          }
        ) : /* @__PURE__ */ U("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(Zc, { size: 24 }),
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
        /* @__PURE__ */ f(vn, { node: r, selected: t })
      ] });
    }
    if (r.kind === "video") {
      const ce = Xi(r), Be = bn(r), Ne = lr(Be, ce), Et = Ws(r, v), rt = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        ce.videoUrl || ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ U("div", { className: rt, children: [
        /* @__PURE__ */ U("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(Qc, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "视频资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-video-container ws-node-content-container", children: Ne ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
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
            onMediaSize: Et
          },
          ce.videoUrl
        ) : ce.imageUrl ? /* @__PURE__ */ f(
          xa,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-video-raw",
            onMediaSize: Et
          }
        ) : /* @__PURE__ */ U("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(Qc, { size: 24 }),
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
        /* @__PURE__ */ f(vn, { node: r, selected: t })
      ] });
    }
    const L = Xi(r), Z = wc(r), ge = bn(r), ye = cc(r), be = Ge(ge) ? ge : Z ? { rich: Z } : ye || L.text, fe = lr(be, L), we = !!(L.imageUrl || L.videoUrl || L.audioUrl), Fe = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      we ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ U("div", { className: Fe, children: [
      /* @__PURE__ */ U("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(gg, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ f("span", { children: r.title })
      ] }),
      /* @__PURE__ */ f("div", { className: "ws-node-text-card", children: !fe && L.imageUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        "img",
        {
          src: L.imageUrl,
          alt: gr(L) || r.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !fe && L.videoUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        Xs,
        {
          src: L.videoUrl,
          poster: L.videoPosterUrl,
          ariaLabel: gr(L) || r.title,
          objectFit: "cover",
          allowDragFromVideo: !0,
          playButtonOnly: !0
        },
        L.videoUrl
      ) }) : !fe && L.audioUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ f(
        xe,
        {
          fallback: /* @__PURE__ */ f(ke, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ f(mu, { src: L.audioUrl })
        }
      ) }) : !fe && L.fileUrl ? /* @__PURE__ */ U("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ f($a, { size: 16 }),
        /* @__PURE__ */ f("span", { children: gr(L) || "文件内容" })
      ] }) : /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
        fr,
        {
          output: be,
          fallback: ye || L.text || "暂无内容",
          mediaGridKind: us(L),
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
      /* @__PURE__ */ f(vn, { node: r, selected: t })
    ] });
  }
  if (r.type === "power") {
    const L = Vt(d), Z = Xd(r.power, r.kind), ge = V ? Oa(
      L ? [d?.streamOutput, qs(r)] : qs(r)
    ) : null, ye = Dt(r), be = L ? "running" : d?.status === "error" ? "error" : d?.status === "success" && !ye ? "running" : ye ? "complete" : "empty", fe = !!(!ie && !P && !V && !X && d?.streamStarted && (d.streamText || d.streamOutput) && d.status !== "success"), we = fe ? d?.streamOutput ? Jn(d.streamOutput, "audio") : {
      text: d?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : Do(r), Fe = fe ? d?.streamOutput || { text: d?.streamText || "" } : bn(r), ce = ie || P || V || X || fe || ye, Be = !ie && !P && !V && !X && !!(we.imageUrl || we.videoUrl || we.audioUrl || we.fileUrl), Ne = r.embedded ? void 0 : Ws(r, v), Et = ie ? bc(
      r,
      d?.streamOutput || r.resultOutput
    ) : null, rt = Et ? Et.status === "failed" : !!r.runError, Zn = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      ie ? "is-writing" : "",
      P ? "is-storyboard" : "",
      V ? "is-storyboard-grid" : "",
      X ? "is-video-compose" : "",
      Z ? "is-audio" : "",
      r.embedded ? "is-embedded" : "",
      ce ? "has-content" : "",
      Be ? "has-media" : ""
    ].filter(Boolean).join(" "), pe = (de) => /* @__PURE__ */ U("div", { className: "ws-node-floating-meta", children: [
      /* @__PURE__ */ U("div", { className: "ws-node-floating-label", children: [
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
          Ki,
          {
            className: "ws-node-floating-title",
            title: r.title,
            onRename: v && !$ ? (st) => v(r.id, { title: st, titleMode: "manual" }) : void 0
          }
        )
      ] }),
      de
    ] }), He = (de, st, Te) => /* @__PURE__ */ U(
      "div",
      {
        className: `${Zn}${Te ? " is-running" : rt ? " is-error" : ""}`,
        children: [
          /* @__PURE__ */ f(
            qn,
            {
              message: n,
              onDismiss: () => o("")
            }
          ),
          pe(st),
          /* @__PURE__ */ U("div", { className: "ws-node-power-card", children: [
            Te ? /* @__PURE__ */ U("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
          r.runError && !Te && !ie ? /* @__PURE__ */ f(
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
          ie || P || he || V || X ? null : /* @__PURE__ */ f(
            rr,
            {
              node: r,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(vn, { node: r, selected: t })
        ]
      }
    );
    return ie ? /* @__PURE__ */ f(
      xe,
      {
        fallback: He(
          /* @__PURE__ */ f(ke, { label: "正在加载创作工作区", compact: !0 }),
          null,
          L
        ),
        children: /* @__PURE__ */ f(
          Im,
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
            output: d?.streamOutput || bn(r),
            running: L,
            readonly: !r.interactive,
            onAssetUpdated: (de) => Wv(r, de),
            onOpenDetail: (de) => l(
              de ? { ...r, resultOutput: { writing: de } } : r
            )
          }
        )
      }
    ) : He(
      /* @__PURE__ */ f(Gt, { children: X ? /* @__PURE__ */ f(
        xe,
        {
          fallback: /* @__PURE__ */ f(ke, { label: "正在加载视频合成" }),
          children: /* @__PURE__ */ f(
            Sm,
            {
              composition: r.composerDraft?.videoComposition,
              referenceItems: I.filter(
                (de) => de.source !== "current" || de.id !== r.id
              ),
              connectedMediaReferences: R,
              running: L,
              onChange: M ? (de) => M(r.id, {
                ...r.composerDraft || {},
                videoComposition: de
              }) : void 0,
              onConnectedMediaEdgeRemove: _,
              onRun: O ? (de) => {
                O({
                  ...r,
                  composerDraft: {
                    ...r.composerDraft || {},
                    videoComposition: de
                  }
                }).catch(
                  (st) => o(
                    st instanceof Error ? st.message : "视频合成失败"
                  )
                );
              } : void 0,
              onOpenDetail: l ? () => l(r) : void 0
            }
          )
        }
      ) : he ? /* @__PURE__ */ f(xe, { fallback: /* @__PURE__ */ f(ke, { label: "正在加载设定" }), children: /* @__PURE__ */ f(
        _m,
        {
          workspace: r.storyboardWorkspace,
          readonly: !r.interactive,
          node: r,
          onOpenDetail: l ? () => l(r) : void 0
        }
      ) }) : P ? /* @__PURE__ */ U(
        xe,
        {
          fallback: /* @__PURE__ */ f(ke, { label: "正在加载分镜内容", compact: !0 }),
          children: [
            r.settingUpdateReason && /* @__PURE__ */ f("p", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
            /* @__PURE__ */ f(
              Rm,
              {
                output: L ? d?.streamOutput || d?.streamText || "" : qs(r),
                status: be,
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
                onOpenDetail: ye && l ? (de, st) => l(r, st, de) : void 0,
                onRegenerateScreenplay: r.interactive && !L ? () => {
                  r.onRunBackendNode(r.sourceNode, {
                    storyboardAction: "screenplay"
                  });
                } : void 0,
                onConfirm: r.interactive && ye ? () => y(r.id) : void 0
              }
            )
          ]
        }
      ) : V ? /* @__PURE__ */ f(
        xe,
        {
          fallback: /* @__PURE__ */ f(ke, { label: "正在加载分镜宫格", compact: !0 }),
          children: /* @__PURE__ */ f(
            Wp,
            {
              grid: ge,
              aspectRatio: yv(r),
              running: L,
              layout: r.composerDraft?.storyboardGridLayout,
              onLayoutChange: M ? (de) => M(r.id, {
                ...r.composerDraft || {},
                storyboardGridLayout: de
              }) : void 0,
              onImport: A ? () => A(r.id) : void 0,
              onFrameImport: A ? (de, st) => A(r.id, st) : void 0,
              onSlotImport: A ? (de) => A(r.id, de) : void 0,
              onEdit: ge && l ? () => l(r) : void 0
            }
          )
        }
      ) : /* @__PURE__ */ U(Gt, { children: [
        ce ? /* @__PURE__ */ f(
          tf,
          {
            preview: we,
            output: Fe,
            fallback: r.description,
            streaming: L && fe,
            videoObjectFit: r.embedded ? "contain" : "cover",
            onMediaSize: Ne,
            compactMediaGrid: Yl(
              r,
              we
            )
          }
        ) : /* @__PURE__ */ f(yb, {}),
        r.settingUpdateReason && /* @__PURE__ */ f("div", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
        /* @__PURE__ */ f(
          Gs,
          {
            active: L,
            message: d?.reconnecting ? "正在重新连接" : d?.statusText,
            compact: !0
          }
        )
      ] }) }),
      /* @__PURE__ */ f(
        Cm,
        {
          runTiming: r.runTiming,
          runningNode: d,
          showEstimate: !s
        }
      ),
      L
    );
  }
  return /* @__PURE__ */ U("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
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
    /* @__PURE__ */ f(vn, { node: r, selected: t })
  ] });
}
function ef(e, t) {
  return Ic(e.data, t.data) && e.selected === t.selected;
}
function Ic(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && e.canvasRun === t.canvasRun && e.canvasRunStopping === t.canvasRunStopping && Gl(e.groupMembers, t.groupMembers) && Mv(e.groupRuntime, t.groupRuntime) && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && ub(
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
    return n.nodeId === s.nodeId && n.status === s.status && Ic(n.node, s.node);
  });
}
function pb(e, t) {
  return e === t || e.id === t.id && e.type === t.type && e.position.x === t.position.x && e.position.y === t.position.y && e.selected === t.selected && e.className === t.className && e.draggable === t.draggable && e.deletable === t.deletable && e.selectable === t.selectable && e.connectable === t.connectable && e.focusable === t.focusable && e.zIndex === t.zIndex && e.dragHandle === t.dragHandle && e.initialWidth === t.initialWidth && e.initialHeight === t.initialHeight && e.style?.width === t.style?.width && e.style?.height === t.style?.height ? e === t ? !0 : Ic(
    e.data,
    t.data
  ) : !1;
}
function mb({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: o } = Bm(e, t), { summary: s } = zm(o), r = To(t.resultOutput) ? t.resultOutput : {}, i = To(r.meta) ? r.meta : {}, c = t.kind === "video" || t.power?.kind === "video" ? "条视频" : "张", a = i.partial === !0 && i.requested_count ? `本次已生成 ${Number(i.generated_count) || 0}/${Number(i.requested_count)} ${c} · ` : t.asset ? "本次失败，显示上次结果 · " : "", d = /* @__PURE__ */ U(Gt, { children: [
    /* @__PURE__ */ f(Ru, { size: 14 }),
    /* @__PURE__ */ U("span", { children: [
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
function tf({
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
  const d = ne(null), l = ne(!0), y = c ? gr(e) : "", v = lr(t, e), b = us(e), I = !!(a && uu(t, b));
  return ue(() => {
    if (!o) {
      l.current = !0;
      return;
    }
    const R = d.current;
    !R || !l.current || (R.scrollTop = R.scrollHeight);
  }, [e.text, o]), !v && e.imageUrl ? /* @__PURE__ */ U(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          xa,
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
  ) : !v && e.videoUrl ? /* @__PURE__ */ U(
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
  ) : !v && e.audioUrl ? /* @__PURE__ */ U(
    "div",
    {
      className: `ws-node-generated-media is-audio ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          xe,
          {
            fallback: /* @__PURE__ */ f(ke, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ f(mu, { src: e.audioUrl, autoPlay: o })
          }
        ),
        /* @__PURE__ */ f(Gs, { active: s })
      ]
    }
  ) : !v && e.fileUrl ? /* @__PURE__ */ U("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ f($a, { size: 16 }),
    /* @__PURE__ */ f("span", { children: y || "文件内容" })
  ] }) : /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${I ? "is-compact-media-grid" : ""}`,
      onScroll: (R) => {
        const _ = R.currentTarget;
        l.current = _.scrollHeight - _.scrollTop - _.clientHeight < 12;
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
function xa({
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
  return e ? /* @__PURE__ */ U(
    "div",
    {
      className: `ws-node-media-generating nodrag nopan nowheel ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      title: t,
      onPointerDown: (o) => o.stopPropagation(),
      onClick: (o) => o.stopPropagation(),
      children: [
        /* @__PURE__ */ f(xo, { size: n ? 12 : 18, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: t })
      ]
    }
  ) : null;
}
function gr(e) {
  const t = String(e.text || "").trim();
  return !t || Sn(t) ? "" : t;
}
function gb(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, o = 330, s = 340;
  let r = o, i = r / n;
  return i > s && (i = s, r = i * n), {
    width: Math.round(jd(r, 150, o)),
    height: Math.round(jd(i, 150, s))
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
function jd(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function yb() {
  return /* @__PURE__ */ U("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
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
        `${Zd}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function Ib() {
  if (typeof window > "u")
    return Fi;
  try {
    return Qd(
      Number(
        window.localStorage.getItem(eu) || Fi
      )
    );
  } catch {
    return Fi;
  }
}
function Kd(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
export {
  $b as WorkSpacePage
};
