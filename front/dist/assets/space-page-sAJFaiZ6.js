import { a as L, j as f, F as qt, u as jf } from "./preloadable-CbkzeflN.js";
import { a9 as Pa, aa as Mo, x as Yn, y as wr, ab as pn, z as Kf, ac as Zd, ad as Tt, n as $c, l as Qr, ae as qf, af as Qd, ag as eu, B as Ea, D as Vc, m as tu, ah as jc, ai as Kc, aj as Gf, ak as Wf, al as Hf, am as Yf, an as Oi, ao as Jf, ap as Xf, aq as Zf, ar as qc, as as Qf, at as Lr, au as nr, av as Gc, aw as Oa, ax as Fi, ay as ep, az as nu, C as tp, E as qr, h as np, i as ou, aA as op, aB as rp, aC as sp, aD as Bi, aE as Wc, aF as Js, s as Hc, aG as Yc, aH as ip, aI as ap, aJ as cp, aK as dp, aL as up, aM as Jc, aN as lp, aO as zi, aP as fp, aQ as pp, J as sa, aR as mp, aS as Xc, aT as gp, aU as yp, aV as hp, aW as wp, aX as vp, aY as bp, aZ as Np } from "./writing-reference-DgnCfuWu.js";
import { m as Eo, l as Fa, q as ru, j as Ip, s as Cp, t as Sp, S as su, u as Ui, e as iu, v as au, r as Xn, c as _p, w as Rp } from "./space-assistant-layout-B9KyeCM0.js";
import { p as Vt, y as ui, o as cu, u as du, v as kp, X as xp, Y as Tp, Z as Mp, _ as Zc, $ as zs, a0 as Xs, a1 as es, a2 as Ap, w as uu, a3 as Dp, a4 as Pp, a5 as Ep, a6 as ia, a7 as Qc, a as lu, a8 as Fe, a9 as Mt, i as Op, aa as fu, ab as Fp, ac as ds, ad as Io, ae as us, e as Ve, j as Bp, af as ls, ag as pu, f as zp, ah as aa, ai as Up, aj as Lp, ak as Co, L as Ba, d as Zs, al as mu } from "./asset-audio-preview-DlcU6JQ0.js";
import { n as $p, o as gu, p as za, S as Qs, q as Vp, r as jp, f as Kp, s as qp, l as yu, t as hu, u as Qt, w as ir, x as Ks, y as Gp, z as fs, i as Sn, c as Wp, A as _n, B as Li, C as vr, D as Ao, d as ht, E as wu, F as ar, G as Gn, H as ed, I as $i, J as Hp, K as Yp, L as vu, M as bu, N as Jp, O as Xp, P as Zp, Q as Nu, R as Qp, T as em, U as Ua, W as tm, X as nm, Y as om, Z as rm } from "./space-story-setting-reference-Dmqa_708.js";
import { o as sm, s as li, c as lr, C as fr, b as ps, P as ei, i as im, d as Iu, e as am } from "./space-content-view-BelgOwBR.js";
import { e as td, h as La, q as or, t as cm, v as dm, w as nd, m as ca, s as um, x as lm, S as fm, C as De, y as pm, z as mm, B as gm, D as ym, A as od, E as hm, F as wm, G as vm, H as Cu, I as bm, J as Nm, K as Im, L as Cm, M as ts, O as Sm, P as Su, p as _m, Q as Rm, R as km, T as xm, U as Tm, W as Mm, a as Am, V as Dm, X as Pm, Y as Em, b as Om, Z as Fm, u as Bm, c as zm } from "./node-detail-header-YT4Fy3hu.js";
import { i as $t, c as $a, S as Hn, o as _u } from "./space-node-runtime-CTTiHQ3e.js";
import { j as Um, c as Lm, C as $m, a as Vm, r as jm, k as Km, l as qm } from "./writing-run-labels-BAOiEHWx.js";
import { b as ne, a as K, d as ue, h as O, u as se, l as ns, S as Pe, r as Va, p as Gm, o as Ru } from "./file-kind-X0KKJPkQ.js";
import { N as Wm, n as Hm, g as Ym, B as rd, E as Jm, a as Xm, b as Zm, i as Qm, M as eg, c as tg, P as qe, H as ng } from "./interaction-B8o82vSU.js";
import { k as ja, q as ku, s as sd, ag as og, h as rg, m as sg, aX as ig, aY as xu, a4 as ag, au as Tu, P as Mu, L as da, c as cg, aZ as dg, r as Do, j as Ka, i as ug, C as qa, b as Ga, a_ as lg, X as Au, A as fg, z as pg, ah as mg, a$ as gg, b0 as yg, aU as hg, b1 as wg, l as vg, W as bg, a8 as id, a9 as ad, a7 as Ng, b2 as Ig, e as Du, x as Pu } from "./vendor-icons-B1zF1_4n.js";
import { t as Cg, r as Gr } from "./asset-upload-progress-DID-32U3.js";
import { u as Sg } from "./project-dialogs-DOsNg_vu.js";
import { N as Wa, a as _g, O as Eu, A as Rg, B as kg, Q as xg, D as Tg, C as Ou, R as Mg } from "./space-media-references-DvDILtpP.js";
import { P as Ag } from "./power-icon-D3f9lTzM.js";
import { B as mt, x as ms, y as So, s as At, z as Us, C as Dg } from "./asset-preview-B63J-8X6.js";
import { n as Pg, i as Eg } from "./text-content-save-actions-DDFA390i.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-BJE8fROO.css", import.meta.url).href]);
function Og(e) {
  const t = e.resultRef?.asset_id ?? e.asset?.id, n = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, s = [e.asset?.version, ...e.asset?.versions || []].find(
    (r) => r && r.id === n && r.asset_id === t
  );
  return s ? td(e, s, {
    includeNodeResult: !1
  }) : td({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
const cd = 160, dd = 72, ud = 72, ti = 72, os = 24, rs = 24, ss = 40, _o = 2, ni = { width: 180, height: 180 }, Fg = "storyboard-derived-layout-v7";
function Fu(e) {
  const t = e.groups.map((I) => ({
    ...I,
    size: Ug(I)
  })), n = /* @__PURE__ */ new Map(), o = [...t].sort(Ls), s = Lg(
    "workspace",
    o
  ), r = t.filter((I) => I.direction === "upstream").sort(Ls), i = t.filter(
    (I) => I.direction === "downstream" && I.powerKind !== "audio"
  ).sort(Ls), c = t.filter(
    (I) => I.direction === "downstream" && I.powerKind === "audio"
  ).sort(Ls), a = i.reduce(
    (I, R) => Math.max(I, R.size.height),
    0
  ), u = i.length ? e.sourceNode.y - a - ud : e.sourceNode.y, l = e.sourceNode.x - cd;
  let y = u;
  for (const I of r)
    n.set(I.key, {
      bounds: {
        x: l - I.size.width,
        y,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), y += I.size.height + ud;
  let v = e.sourceNode.x;
  for (const I of i)
    n.set(I.key, {
      bounds: {
        x: v,
        y: u,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), v += I.size.width + dd;
  let N = e.sourceNode.x + e.sourceNode.width + cd;
  for (const I of c)
    n.set(I.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: I.size.width,
        height: I.size.height
      },
      layoutKey: `${s}:${I.key}`
    }), N += I.size.width + dd;
  return n;
}
function Bg(e, t, n) {
  const o = t.filter((c) => c.groupId === e.id), s = n.kind === "audio", r = s ? n.width : Math.max(ni.width, n.width), i = s ? n.height : Math.max(ni.height, n.height);
  for (let c = 0; c < o.length + 100; c += 1) {
    const a = c % _o, u = Math.floor(c / _o), l = {
      x: e.x + os + a * (r + rs),
      y: e.y + ti + u * (i + ss)
    };
    if (o.every(
      (y) => !$g(
        { ...l, width: n.width, height: n.height },
        y
      )
    ))
      return l;
  }
  return {
    x: e.x + os,
    y: e.y + ti
  };
}
function Bu(e, t) {
  const n = t.some((r) => r.kind === "audio"), o = {
    width: Math.max(
      n ? 0 : ni.width,
      ...t.map((r) => r.width)
    ),
    height: Math.max(
      n ? 0 : ni.height,
      ...t.map((r) => r.height)
    )
  }, s = /* @__PURE__ */ new Map();
  return t.forEach((r, i) => {
    const c = i % _o, a = Math.floor(i / _o);
    s.set(r.id, {
      x: e.x + os + c * (o.width + rs),
      y: e.y + ti + a * (o.height + ss)
    });
  }), {
    ...zu(t.length, o),
    positions: s
  };
}
function zg(e) {
  return Pa(e || void 0);
}
function Ug(e) {
  const t = zg(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return zu(e.itemCount, t);
}
function zu(e, t) {
  const n = Math.max(1, Math.ceil(e / _o));
  return {
    width: os * 2 + t.width * _o + rs * (_o - 1),
    height: ti + os + n * t.height + (n - 1) * ss
  };
}
function Lg(e, t) {
  return [
    Fg,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function Ls(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function $g(e, t) {
  return !(e.x + e.width + rs <= t.x || t.x + t.width + rs <= e.x || e.y + e.height + ss <= t.y || t.y + t.height + ss <= e.y);
}
const Uu = "storyboard-soundtrack", Vg = 0.35;
function jg(e) {
  let t = !1;
  const n = e.map((o) => {
    if (o.storyboardItem?.itemType !== "video_compose" || !o.composerDraft?.videoComposition?.storyboardBaseline)
      return o;
    const s = o.storyboardItem.sourceNodeId, r = e.find((a) => a.id === s);
    if (!r) return o;
    const i = Vt([
      r.asset?.version?.content,
      r.resultOutput
    ]);
    if (!i || !ui(i)) return o;
    const c = Lu({
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
function Lu(e) {
  const t = new Map(
    (e.current?.clips || []).map((a) => [a.id, a])
  ), n = e.storyboard.shots.map(
    (a, u) => Yg({
      ...e,
      shot: a,
      index: u,
      current: t.get(a.id)
    })
  ), o = $p({
    version: 3,
    clips: Hg(
      n,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: [
      ...qg(e.storyboard),
      ...Gg(e.storyboard, e.sourceNodeId, e.nodes)
    ],
    settings: e.current?.settings || { resolution: "auto", fps: 0 }
  }), s = e.current?.storyboardBaseline, r = cu(e.storyboard), i = la(
    o.clips,
    s?.clips || [],
    e.current?.clips || [],
    (a, u, l) => Kg(a, u, l, r)
  ), c = la(
    o.audioTracks,
    s?.audioTracks || [],
    e.current?.audioTracks || [],
    (a, u, l) => ua(a, u, l, [
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
    audioTracks: r ? c.filter((a) => a.id === Uu).map((a) => ({ ...a, volume: 1, kind: "music" })) : c,
    storyboardBaseline: {
      clips: o.clips.map($u),
      audioTracks: o.audioTracks
    }
  };
}
function Kg(e, t, n, o) {
  const s = ua(e, t, n, [
    "title",
    "visualVideo",
    "originalAudioSource",
    "duration",
    "originalVolume",
    "useOriginalVideo"
  ]);
  return s.speechTracks = o ? [] : la(
    e.speechTracks,
    t?.speechTracks || [],
    n.speechTracks,
    (r, i, c) => ua(r, i, c, [
      "audio",
      "startTime",
      "sourceStart",
      "fit",
      "kind",
      "characterId",
      "text",
      "volume"
    ])
  ), s.subtitleTracks = e.subtitleTracks, $u(s);
}
function $u(e) {
  const t = {
    ...e,
    subtitleTracks: Jg(
      e.subtitleTracks,
      e.speechTracks,
      e.duration
    )
  };
  return {
    ...t,
    blockingIssues: gu(t)
  };
}
function ua(e, t, n, o) {
  if (!t) return e;
  const s = { ...e };
  for (const r of o)
    JSON.stringify(n[r]) !== JSON.stringify(t[r]) && (s[r] = n[r]);
  return s;
}
function la(e, t, n, o) {
  const s = new Map(t.map((u) => [u.id, u])), r = new Map(n.map((u) => [u.id, u])), i = new Set(e.map((u) => u.id)), c = e.flatMap((u) => {
    const l = s.get(u.id), y = r.get(u.id);
    return l && !y ? [] : [o(u, l, y || u)];
  }), a = n.filter(
    (u) => !s.has(u.id) && !i.has(u.id)
  );
  return sm(
    [...c, ...a],
    n.map((u) => u.id),
    (u) => u.id
  );
}
function qg(e) {
  const t = e.references.find(
    (s) => s.purpose === "soundtrack"
  );
  if (!t) return [];
  const n = Number(t.asset_id || 0), o = Number(t.version_id || 0);
  return [
    {
      id: Uu,
      ...n > 0 && o > 0 ? {
        audio: { assetId: n, versionId: o, label: t.label || "主音轨" }
      } : {},
      startTime: 0,
      sourceStart: (e.storyboard_range_start_ms || 0) / 1e3,
      kind: "music",
      volume: cu(e) ? 1 : 0.35,
      fit: "trim",
      loop: !1,
      fadeOut: Wg(e) ? 0 : 1
    }
  ];
}
function Gg(e, t, n) {
  return du(e) ? Mp(e).map(({ speech: o, startTime: s }) => {
    const r = Ha(fi(n, t, "speech", o.id));
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
function Wg(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, o = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && o != null && (t > 0 || n < o);
}
function Hg(e, t) {
  if (!t || t <= 0 || e.length === 0)
    return e;
  const n = Math.round(
    e.reduce((a, u) => a + u.duration, 0) * 1e3
  ), o = e.reduce((a, u, l) => a + (l < e.length - 1 && u.transitionToNext.type !== "none" ? u.transitionToNext.durationMs : 0), 0), s = n - o - t;
  if (s <= 0)
    return e;
  const r = e.length - 1, i = e[r], c = i.duration - s / 1e3;
  return c <= 0 ? e : [...e.slice(0, r), { ...i, duration: c }];
}
function Yg(e) {
  const t = fi(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), n = Ha(t), o = !!e.current?.useOriginalVideo, s = du(e.storyboard), r = s ? e.shot.speech.filter((v) => v.kind === "dialogue" && v.text.trim()).map(
    (v) => Zg(e.nodes, e.sourceNodeId, v)
  ) : [], i = kp(e.storyboard) ? Xg(e.nodes, e.sourceNodeId, e.shot.id) : [], c = n, a = xp(e.storyboard), u = Tp(e.storyboard, e.index), l = {
    type: "none",
    durationMs: 0,
    ...u > 0 ? { soundLeadMs: u } : {}
  }, y = {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...c ? { visualVideo: c } : {},
    ...n ? { originalAudioSource: n } : {},
    duration: e.shot.duration,
    // The shot contains ambience and effects; separate speech is mixed above them.
    originalVolume: a ? 1 : s ? Vg : 0,
    speechTracks: r,
    subtitleTracks: i,
    useOriginalVideo: o,
    blockingIssues: [],
    transitionToNext: l
  };
  return {
    ...y,
    blockingIssues: gu(y)
  };
}
function Jg(e, t, n) {
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
function Xg(e, t, n) {
  const o = fi(e, t, "subtitle", n), s = Zc(o?.resultOutput);
  return (Array.isArray(s.tracks) ? s.tracks : []).flatMap((i) => {
    const c = Zc(i), a = zs(c.id), u = zs(c.text);
    if (!a || !u)
      return [];
    const l = ld(c.end_time ?? c.endTime), y = zs(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: u,
        startTime: Math.max(
          0,
          ld(c.start_time ?? c.startTime)
        ),
        ...l > 0 ? { endTime: l } : {},
        ...y ? { speechId: y } : {},
        source: zs(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function Zg(e, t, n) {
  const o = fi(e, t, "speech", n.id), s = Ha(o);
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
function fi(e, t, n, o) {
  return e.find(
    (s) => s.storyboardItem?.sourceNodeId === t && s.storyboardItem.itemType === n && s.storyboardItem.itemId === o
  );
}
function Ha(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), o = t && n ? t : Number(e?.asset?.id || 0), s = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!o || !s))
    return {
      assetId: o,
      versionId: s,
      label: e?.title || "素材"
    };
}
function ld(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
const Vu = "invalidated";
function Ya(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, o = {};
  return wo(o, "execution_id", e?.execution_id), wo(o, "run_id", e?.run_id || n?.run_id), Vi(o, "request_id", e?.request_id), wo(o, "flow_run_id", e?.flow_run_id), wo(
    o,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), wo(o, "asset_id", e?.asset_id || t?.id), wo(
    o,
    "version_id",
    e?.version_id || n?.id || t?.version_id
  ), wo(
    o,
    "release_id",
    e?.release_id || n?.release_id
  ), Vi(o, "role", e?.role || t?.role), Vi(o, "status", e?.status), Object.keys(o).length > 0 && (o.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(o).length > 0 ? o : void 0;
}
function Qg(e, t, n, o = !0) {
  const s = o || e?.resultRef?.status === Vu || fd(e, n), r = e?.resultRef;
  if (r) {
    const i = Number(t.execution_id || 0), c = Number(r.execution_id || 0);
    if (i > 0 && c > 0 && c >= i)
      return c > i || s;
    const a = Number(t.run_id || 0), u = Number(r.run_id || 0);
    if (a > 0 && u > 0 && u >= a)
      return u > a || s;
    const l = Number(n?.node_run_id || 0), y = Number(r.node_run_id || 0);
    if (l > 0 && y > 0 && y >= l)
      return y > l || s;
    const v = String(n?.request_id || t.request_id || "");
    if (v && r.request_id === v)
      return s;
  }
  return fd(e, n);
}
function fd(e, t) {
  if (String(t?.status || "").trim().toLowerCase() !== "success")
    return !1;
  const n = Number(
    e?.asset?.id || e?.resultRef?.asset_id || 0
  ), o = Number(
    e?.asset?.version_id || e?.asset?.version?.id || e?.resultRef?.version_id || 0
  ), s = Number(t?.asset_id || 0), r = Number(t?.version_id || 0);
  return n > 0 && n === s && o > 0 && r > 0 && o !== r;
}
function ey(e) {
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
function wo(e, t, n) {
  const o = Number(n || 0);
  o > 0 && (e[t] = o);
}
function Vi(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
function pd(e) {
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
    La(e.composerDraft, t).trim()
  ];
  return t.itemType === "shot_image" ? [
    ...s,
    t.frameMediaItems || [],
    t.imageSequenceFrames || []
  ] : s;
}
function md(e) {
  const t = e.resultRef?.asset_id || e.asset?.id, n = e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id;
  return JSON.stringify(t && n ? [t, n] : [
    e.asset?.version?.content,
    e.resultOutput
  ]);
}
function ty(e) {
  const t = e.resultRef?.asset_id || e.asset?.id, n = e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id;
  return t && n ? `${t}:${n}` : "";
}
function ji(e) {
  const t = e?.resultRef;
  return t?.execution_id ? `execution:${t.execution_id}` : t?.run_id ? `run:${t.run_id}` : "";
}
function fa(e, t, n, o) {
  const s = new Map(t.map((y) => [y.id, y])), r = /* @__PURE__ */ new Set(), i = (y) => y.storyboardItem?.sourceNodeId === n;
  for (const y of e) {
    if (!i(y)) continue;
    const v = y.storyboardItem.itemType;
    if (!["character", "scene", "prop", "shot_image", "shot", "speech", "subtitle"].includes(v)) continue;
    const N = s.get(y.id);
    (!N || JSON.stringify(pd(y)) !== JSON.stringify(pd(N))) && r.add(y.id);
  }
  const c = /* @__PURE__ */ new Map();
  for (const y of [...e, ...t]) {
    const v = y.storyboardItem;
    if (v)
      for (const N of [
        ...v.referenceNodeIds || [],
        ...v.dependencyNodeIds || []
      ]) {
        const I = c.get(N) || /* @__PURE__ */ new Set();
        I.add(y.id), c.set(N, I);
      }
  }
  const a = t.filter(
    (y) => y.storyboardItem?.itemType === "video_compose"
  );
  for (const y of [...e, ...t]) {
    if (!["shot", "speech", "subtitle"].includes(y.storyboardItem?.itemType || "")) continue;
    const v = c.get(y.id) || /* @__PURE__ */ new Set();
    a.filter(
      (N) => N.storyboardItem.sourceNodeId === y.storyboardItem.sourceNodeId
    ).forEach((N) => v.add(N.id)), c.set(y.id, v);
  }
  const u = (y, v = "") => {
    const N = [...y], I = new Set(N);
    for (let R = 0; R < N.length; R += 1)
      for (const x of c.get(N[R]) || [])
        I.has(x) || s.get(N[R])?.storyboardItem?.itemType === "shot_image" && s.get(x)?.storyboardItem?.itemType === "shot_image" || (I.add(x), !(v && ji(s.get(x)) === v) && (r.add(x), N.push(x)));
  };
  u(r);
  for (const y of o || []) {
    if (!y.storyboardItem) continue;
    const v = s.get(y.id);
    if (!v || md(y) === md(v)) continue;
    const N = ji(v), I = !ty(y) || N !== ji(y) ? N : "";
    u([v.id], I);
  }
  let l = !1;
  return t.forEach((y, v) => {
    if (!r.has(y.id)) return;
    const N = ju(y);
    N !== y && (t[v] = N, l = !0);
  }), l;
}
function ju(e) {
  if (!e.asset && !e.resultRef && e.resultOutput == null) return e;
  const t = { ...e };
  if (delete t.asset, e.resultRef) {
    const { asset_id: n, version_id: o, ...s } = e.resultRef;
    t.resultRef = { ...s, status: Vu };
  }
  return delete t.resultOutput, delete t.resultView, t;
}
function ny(e, t) {
  return e ? t ? "materialize" : "defer-materialize" : "refresh";
}
function oy(e, t, n, o) {
  return !t || pa(e, t) !== pa(n, o);
}
function pa(e, t) {
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
function Ku(e) {
  return !!e.storyboardItem && !!La(e.composerDraft, e.storyboardItem).trim();
}
function ry(e, t) {
  const n = String(e.composerDraft?.prompt || "");
  if (!Ku(e))
    return null;
  const o = new Set(e.storyboardItem?.referenceNodeIds || []), s = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor,
    sharedEndShotId: e.storyboardItem.sharedEndShotId,
    sharedStartShotId: e.storyboardItem.sharedStartShotId,
    shotId: e.storyboardItem.shotId
  } : void 0, r = t.filter((v) => o.has(v.id)).map((v) => Wu(v, s, e.storyboardItem?.sourceNodeId)).filter((v) => !!v), i = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), c = Yn(
    e.composerDraft?.promptContent
  ).filter((v) => i.has(v.refId)), a = t.find(
    (v) => v.id === e.storyboardItem?.sourceNodeId
  ), l = ((a ? Vt([
    a.asset?.version?.content,
    a.resultOutput
  ]) : null)?.references || []).filter((v) => i.has(v.asset_id)).map(Hu), y = [
    ...r,
    ...c,
    ...l
  ];
  return {
    ...e.composerDraft || {},
    prompt: "",
    storyboardPromptOverride: void 0,
    promptContent: y.length ? wr("", y) : void 0,
    paramValues: Xu(
      e.composerDraft?.paramValues,
      n,
      ""
    )
  };
}
function Rn(e, t, n) {
  const o = vd(n);
  return e.find(
    (s) => Number(s.id || 0) > 0 && String(s.kind || "").trim().toLowerCase() === t && vd(s.outputType) === o
  ) || null;
}
function gd(e) {
  return qu(e, "materialize");
}
function Ki(e) {
  return qu(e, "refresh");
}
function qu(e, t) {
  let n = e.canvas;
  const o = e.sourceNodeIds ? new Set(e.sourceNodeIds) : null;
  for (const s of e.canvas.nodes) {
    if (t === "materialize" && s.id !== e.sourceNodeId || t === "refresh" && o?.has(s.id) === !1)
      continue;
    if (s.type === "power" && s.outputType === "setting") {
      n = Ny({ canvas: n, settingNode: s, assetCate: e.assetCate, powers: e.powers });
      continue;
    }
    if (s.type !== "power" || !Eo(
      s.power,
      s.kind,
      s.outputType
    ))
      continue;
    const r = Vt([
      s.asset?.version?.content,
      s.resultOutput
    ]);
    if (!r || !ui(r))
      continue;
    const i = n.nodes.find((y) => y.id === s.id) || s;
    if (t === "refresh" && (i.storyboardFramePlanVersion || 0) >= Xs) {
      n = hd({
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
    const c = sy(
      i,
      r
    ), a = es(
      i.storyboardFramePlanVersion
    ) || 0, u = i.storyboardMaterializedSignature !== c || a < Xs, l = Ap(
      i.storyboardFramePlanVersion,
      u
    );
    n = u ? ay({
      canvas: n,
      storyboardNode: i,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: l
    }) : hd({
      canvas: n,
      storyboardNode: i,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: l
    }), n = iy(
      n,
      i.id,
      c,
      l
    );
  }
  return pi({ canvas: n, assetCate: e.assetCate, powers: e.powers });
}
function yd(e, t) {
  if (e?.outputType === "setting") {
    const r = li({ ...e, ...t });
    return !!(r && e.storyboardMaterializedSignature !== Ee(JSON.stringify(r)));
  }
  if (!e || e.type !== "power" || !Eo(e.power, e.kind, e.outputType))
    return !1;
  const n = { ...e, ...t }, o = Vt([
    n.asset?.version?.content,
    n.resultOutput
  ]);
  if (!o || !ui(o))
    return !1;
  const s = Vt([
    e.asset?.version?.content,
    e.resultOutput
  ]);
  return (e.storyboardFramePlanVersion || 0) < Xs || oy(
    e,
    s,
    n,
    o
  );
}
function sy(e, t) {
  return Ee(pa(e, t));
}
function iy(e, t, n, o) {
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
function hd(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Map();
  t.forEach((a, u) => {
    const l = a.storyboardItem;
    l?.sourceNodeId === e.storyboardNode.id && n.set(
      pr(l.sourceNodeId, l.itemType, l.itemId),
      u
    );
  });
  let o = !1;
  const s = za(
    t,
    e.canvas.edges,
    e.storyboardNode.id
  ), r = {
    framePlanVersion: e.framePlanVersion,
    settingItemKeys: new Set(s.keys())
  }, i = Qs.filter(
    (a) => a.enabled(e.storyboard, r)
  );
  for (const a of i) {
    const u = a.local ? null : Rn(e.powers, a.powerKind, a.outputType);
    for (const l of a.items(e.storyboard, r)) {
      const y = n.get(
        pr(
          e.storyboardNode.id,
          l.type,
          l.id
        )
      ) ?? -1;
      if (y < 0)
        continue;
      const v = Gu(
        l,
        t,
        e.storyboardNode.id,
        s,
        e.storyboard
      ), N = t[y], I = Xa(
        N,
        N.groupId || "",
        v,
        a,
        u,
        { preserveStructure: !0, nodes: t }
      );
      I !== N && (t[y] = I, o = !0);
    }
    (a.itemType === "shot_image" || a.itemType === "shot") && (o = fa(
      e.canvas.nodes,
      t,
      e.storyboardNode.id,
      e.previousNodes
    ) || o);
  }
  if (uu(e.storyboard)) {
    const a = nl({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Rn(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    o = o || !!a?.changed;
  }
  if (!o) return e.canvas;
  const c = tl(e.canvas.edges, t, e.storyboardNode.id, s);
  return { ...e.canvas, nodes: t, edges: c };
}
function ay(e) {
  const t = es(e.framePlanVersion) || Xs, n = [...e.canvas.nodes], o = /* @__PURE__ */ new Set(), s = new Set(
    Qs.map((x) => x.itemType)
  ), r = za(
    n,
    e.canvas.edges,
    e.storyboardNode.id
  ), i = {
    framePlanVersion: t,
    settingItemKeys: new Set(r.keys())
  }, c = Qs.filter(
    (x) => x.enabled(e.storyboard, i)
  ), a = uu(
    e.storyboard
  );
  s.add("video_compose"), a && o.add(
    pr(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const u = c.map((x) => ({
    spec: x,
    items: x.items(e.storyboard, i),
    power: x.local ? null : Rn(e.powers, x.powerKind, x.outputType)
  }));
  for (const { items: x } of u)
    for (const P of x)
      o.add(
        pr(e.storyboardNode.id, P.type, P.id)
      );
  let l = !1;
  for (let x = n.length - 1; x >= 0; x -= 1) {
    const P = n[x].storyboardItem;
    !P || P.sourceNodeId !== e.storyboardNode.id || !s.has(P.itemType) || o.has(
      pr(
        P.sourceNodeId,
        P.itemType,
        P.itemId
      )
    ) || (n.splice(x, 1), l = !0);
  }
  const y = Fu({
    sourceNode: e.storyboardNode,
    groups: u.map(({ spec: x, items: P, power: D }) => ({
      key: x.key,
      layoutIndex: x.layoutIndex,
      itemCount: P.length,
      power: D,
      powerKind: x.powerKind,
      direction: x.direction
    }))
  });
  let v = Mo(n, e.canvas.nextNodeNo);
  l = l || v !== e.canvas.nextNodeNo;
  for (const { spec: x, items: P, power: D } of u) {
    const T = y.get(x.key);
    if (!T)
      continue;
    const V = Yu({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: x,
      layout: T,
      assetCate: e.assetCate
    });
    l = l || V.changed;
    for (const ge of P) {
      const $ = Gu(
        ge,
        n,
        e.storyboardNode.id,
        r,
        e.storyboard
      ), q = n.findIndex(
        (Q) => yr(
          Q,
          e.storyboardNode.id,
          $.type,
          $.id
        )
      );
      if (q >= 0) {
        const Q = n[q], me = Xa(
          Q,
          V.node.id,
          $,
          x,
          D,
          { nodes: n }
        );
        me !== Q && (n[q] = me, l = !0);
        continue;
      }
      const z = Ju({
        nodes: n,
        group: V.node,
        storyboardNode: e.storyboardNode,
        item: $,
        assetCate: e.assetCate,
        spec: x,
        power: D
      });
      z.nodeNo = v++, n.push(z), l = !0;
    }
    (x.itemType === "shot_image" || x.itemType === "shot") && (l = fa(
      e.canvas.nodes,
      n,
      e.storyboardNode.id
    ) || l);
    const te = P.map(
      (ge) => n.find(
        ($) => $.groupId === V.node.id && yr(
          $,
          e.storyboardNode.id,
          ge.type,
          ge.id
        )
      )
    ).filter((ge) => !!ge), G = Bu(
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
  const N = new Set(c.map((x) => x.key));
  for (let x = n.length - 1; x >= 0; x -= 1) {
    const P = n[x];
    P.type !== "group" || P.group?.origin !== "script" || P.group.sourceNodeId !== e.storyboardNode.id || !P.group.syncKey || N.has(
      P.group.syncKey
    ) || (n.splice(x, 1), l = !0);
  }
  l = fa(
    e.canvas.nodes,
    n,
    e.storyboardNode.id
  ) || l;
  const I = a ? nl({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Rn(e.powers, "video", "video_compose"),
    nextNodeNo: v
  }) : null;
  I && (v = I.nextNodeNo, l = l || I.changed);
  let R = yy(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    c
  );
  return R = tl(
    R,
    n,
    e.storyboardNode.id,
    r
  ), R = I ? hy(
    R,
    n,
    e.storyboardNode.id,
    I.node.id,
    c
  ) : wy(R, e.storyboardNode.id), R !== e.canvas.edges && (l = !0), pi({
    canvas: l ? { ...e.canvas, nextNodeNo: v, nodes: n, edges: R } : e.canvas,
    assetCate: e.assetCate,
    powers: e.powers
  });
}
function Gu(e, t, n, o, s) {
  const r = s.chapter_boundary, i = s.shots[0], c = r && e.shotId === i?.id && (r.connection === "continue" ? e.type === "shot" || e.type === "shot_image" && e.frameRole === "end" : e.type === "shot_image" && e.frameRole === "start");
  c && e.type === "shot" && (e = { ...e, sharedStartShotId: r.shot_id });
  const a = (T) => (T || []).map(
    (V) => t.find(
      (te) => yr(te, n, V.type, V.id)
    ) || o.get(Vp(V.type, V.id))
  ).filter((V) => !!V), u = (e.dependencyItems || []).map(
    (T) => a([T])[0]?.id || "script-item-" + Ee([n, T.type, T.id].join("\0"))
  ), l = a(e.referenceItems), y = l.map((T) => T.id);
  if (c && r) {
    const T = Dp(r.shot_id, "end"), V = t.find(
      (G) => yr(G, r.node_id, "shot_image", T)
    ), te = V?.id || "script-item-" + Ee([r.node_id, "shot_image", T].join("\0"));
    u.unshift(te), y.unshift(te), V && l.unshift(V);
  }
  const v = e.externalReferences || [], N = {
    ...e,
    dependencyNodeIds: u,
    referenceNodeIds: y
  };
  if (!["character", "scene", "prop", "shot_image", "shot"].includes(e.type))
    return N;
  const I = cy(
    e.prompt,
    l,
    v
  ), R = I === e.prompt ? N : { ...N, prompt: I }, x = v.map(
    Hu
  );
  if (x.push(
    ...l.map((T) => Wu(T, e, n)).filter((T) => !!T)
  ), !x.length)
    return R;
  const P = wr(
    I,
    x
  ), D = Kf(P);
  return Zd(P) ? { ...N, prompt: D, promptContent: P } : { ...R, prompt: D };
}
function cy(e, t, n = []) {
  const o = [], s = /* @__PURE__ */ new Set();
  for (const r of n) {
    const i = $c(r.label), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  for (const r of t) {
    const i = $c(r.title), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), o.push(c));
  }
  return [o.join(" "), e].filter(Boolean).join(" ").trim();
}
function Wu(e, t, n) {
  const o = Number(e.resultRef?.asset_id || e.asset?.id || 0), s = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!o || !s)
    return null;
  const r = Pp(
    e.storyboardItem?.frameMediaItems
  ), i = Ep(
    e.storyboardItem?.shotImageMode
  ), c = dy(
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
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? i === "references" ? "reference" : ia(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function dy(e, t, n, o, s = !1) {
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
          usage: r ? "firstFrame" : ia(c.frameRole)
        }))
      };
    }
    return {
      mediaItems: n.map((r) => ({
        url: "",
        index: r.mediaIndex,
        usage: ia(r.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const r = Qc(n, "end") || Qc(n, "start");
    return r ? { mediaIndex: r } : {};
  }
  return {};
}
function Hu(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function Yu(e) {
  const t = Ja(
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
    for (const [a, u] of e.nodes.entries()) {
      if (u.id !== t.id && u.groupId !== t.id)
        continue;
      const l = {
        ...u,
        x: u.x + r,
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
      e.nodes[a] = l, u.id === t.id && (c = l);
    }
    return { node: c, changed: !0 };
  }
  const n = e.layout.bounds, o = pn("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return o.id = Qa(
    e.nodes,
    `script-group-${Ee(e.storyboardNode.id)}-${e.spec.key}`
  ), o.title = e.spec.title, o.width = n.width, o.height = n.height, o.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(o), { node: o, changed: !0 };
}
function Ja(e, t, n) {
  return e.find(
    (o) => o.type === "group" && o.group?.origin === "script" && o.group.sourceNodeId === t && o.group.syncKey === n
  );
}
function Ju(e) {
  const t = pn(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = Qa(
    e.nodes,
    `script-item-${Ee(
      pr(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Pa({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${vy(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: "",
    promptContent: Zu(
      "",
      void 0,
      e.item.promptContent
    ),
    paramValues: e.item.paramValues
  }, t.storyboardItem = Qu(
    e.storyboardNode.id,
    e.item
  );
  const n = Bg(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function Xa(e, t, n, o, s, r = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = String(e.composerDraft?.prompt || ""), a = La(e.composerDraft, i), u = a !== c, l = uy(
    e.composerDraft?.paramValues,
    c,
    a,
    n.paramValues,
    n.type === "speech" ? i.generatedInputs?.voice : void 0,
    n.type === "speech"
  ), y = l !== e.composerDraft?.paramValues, v = r.nodes || [], N = py(
    e,
    v
  ), I = Zu(
    a,
    N,
    n.promptContent,
    my(
      e,
      n,
      v,
      N
    ),
    v
  ), R = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(I || null), x = Qu(i.sourceNodeId, n), P = r.preserveStructure && e.titleMode === "manual" ? e.title : n.title, D = e.title !== P, T = i.generatedPrompt !== n.prompt, V = r.preserveStructure ? e.groupId || "" : t, te = !e.power && !!s, G = e.kind !== o.powerKind, re = e.outputType !== o.outputType, F = o.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === V && !u && !y && !R && !D && !te && !G && !re && !F && el(i, x) ? e : {
    ...e,
    title: P,
    kind: o.powerKind,
    outputType: o.outputType,
    ...te ? {
      power: s || void 0,
      subtitle: s?.output?.name || s?.name || e.subtitle
    } : {},
    description: T || te ? n.prompt : e.description,
    ...o.local ? { resultOutput: n.localOutput } : {},
    groupId: V,
    composerDraft: u || y || R ? {
      ...e.composerDraft || {},
      prompt: a,
      promptContent: I,
      paramValues: l
    } : e.composerDraft,
    storyboardItem: x
  };
}
function Xu(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let o;
  for (const [s, r] of Object.entries(e))
    r === t && (o ||= { ...e }, o[s] = n);
  return o || e;
}
function uy(e, t, n, o, s, r = !1) {
  let i = Xu(
    e,
    t,
    n
  );
  for (const [c, a] of Object.entries(o || {}))
    r && c === "voice" && String(e?.voice || "") !== String(s || "") || i?.[c] !== a && (i = { ...i || {}, [c]: a });
  return r && !o?.voice && s && e?.voice === s && (i = { ...i || {} }, delete i.voice), i;
}
function Zu(e, t, n, o, s = []) {
  const r = Yn(n), i = Yn(o);
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
  ), u = Yn(t), l = new Set(u.map($r)), y = u.flatMap((v) => {
    const N = $r(v), I = c.get(N);
    if (!I)
      return [v];
    const R = a.get(N);
    return R ? [
      ly(v, I, R, s)
    ] : gy(v, I) ? [] : [v];
  });
  for (const v of r) {
    const N = $r(v);
    !l.has(N) && !c.has(N) && !u.some(
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
function ly(e, t, n, o) {
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
  return e.contentSelection ? { ...s, versionId: e.versionId } : fy(e, s, o);
}
function fy(e, t, n) {
  if (e.refId === t.refId && e.versionId === t.versionId || !t.mediaURL && !t.mediaIndex && !t.mediaItems?.length)
    return t;
  const o = n.find((a) => a.id === t.originID), s = o?.kind, r = o && (s === "image" || s === "video" || s === "audio") ? lu(Og(o), s) : [], i = (a, u) => {
    const l = u && u > 0 ? u - 1 : r.indexOf(a || "");
    return r[l] ? { url: r[l], index: l + 1 } : null;
  };
  if (t.mediaItems?.length) {
    const a = t.mediaItems.map((u) => {
      const l = i(u.url, u.index);
      return l ? { ...u, ...l } : null;
    });
    return a.every((u) => u !== null) ? {
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
function py(e, t) {
  if (e.storyboardItem?.generatedInputs)
    return e.composerDraft?.promptContent;
  const n = new Set(e.storyboardItem?.referenceNodeIds || []), o = Yn(
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
function my(e, t, n, o) {
  const s = e.storyboardItem;
  if (s?.generatedInputs)
    return s.generatedInputs.referenceContent;
  const r = new Set(s?.referenceNodeIds || []), i = /* @__PURE__ */ new Set([
    ...s?.externalReferenceAssetIds || [],
    ...n.filter((l) => r.has(l.id)).map(
      (l) => Number(l.resultRef?.asset_id || l.asset?.id || 0)
    )
  ]), c = new Set(
    Yn(t.promptContent).map(
      (l) => l.refId
    )
  ), a = new Set(s?.externalReferenceAssetIds || []), u = Yn(o).filter(
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
  return u.length ? wr("", u) : void 0;
}
function gy(e, t) {
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
function Qu(e, t) {
  return {
    sourceNodeId: e,
    itemType: t.type,
    itemId: t.id,
    generatedPrompt: t.prompt,
    generatedInputs: {
      referenceContent: Zd(t.promptContent) ? wr(
        "",
        Yn(t.promptContent)
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
function el(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && JSON.stringify(e.generatedInputs || null) === JSON.stringify(t.generatedInputs || null) && vo(e.dependencyNodeIds, t.dependencyNodeIds) && vo(e.referenceNodeIds, t.referenceNodeIds) && vo(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && vo(e.frameMediaItems, t.frameMediaItems) && vo(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && vo(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && vo(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && e.sharedEndShotId === t.sharedEndShotId && e.sharedStartShotId === t.sharedStartShotId && !!e.optional == !!t.optional;
}
function yr(e, t, n, o) {
  const s = e.storyboardItem;
  return !!(s && s.sourceNodeId === t && s.itemType === n && s.itemId === o);
}
function yy(e, t, n, o) {
  const s = o.map((a) => ({
    spec: a,
    group: t.find(
      (u) => u.type === "group" && u.group?.origin === "script" && u.group.sourceNodeId === n && u.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), r = `script-edge-${Ee(n)}-`, i = e.filter((a) => !a.id.startsWith(r));
  for (const { spec: a, group: u } of s) {
    const l = a.direction === "upstream", y = (a.sourceGroupKeys || []).map((N) => Ja(t, n, N)).filter((N) => !!N), v = l ? [u] : y.length ? y : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of v) {
      const I = N.id, R = l ? n : u.id;
      i.push({
        id: ec(i, `${r}${a.key}-${Ee(I)}`),
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
  return Za(e, c) ? e : c;
}
function tl(e, t, n, o) {
  const s = `script-item-edge-${Ee(n)}-`, r = e.filter((u) => !u.id.startsWith(s)), i = t.filter(
    (u) => u.storyboardItem?.sourceNodeId === n && (!!u.groupId || u.storyboardItem.itemType === "video_compose")
  ), c = new Map(
    [...o.values(), ...i].map((u) => [u.id, u])
  );
  for (const u of i)
    for (const l of u.storyboardItem?.dependencyNodeIds || []) {
      const y = c.get(l);
      !y || y.id === u.id || r.push({
        id: ec(
          r,
          `${s}${Ee(y.id)}-${Ee(u.id)}`
        ),
        from: y.id,
        to: u.id,
        logicalFrom: y.id,
        logicalTo: u.id,
        purpose: "dependency",
        executionMode: y.groupId && y.groupId === u.groupId ? void 0 : "manual"
      });
    }
  const a = Tt(t, r);
  return Za(e, a) ? e : a;
}
function nl(e) {
  const t = e.nodes.find(
    (i) => yr(
      i,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = Lu({
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
    const i = e.preservePosition ? { x: t.x, y: t.y } : wd(e.nodes, e.storyboardNode), c = !t.power && !!e.power, a = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), u = t.x !== i.x || t.y !== i.y;
    if (!c && !a && !u && t.kind === "video" && t.outputType === "video_compose" && el(t.storyboardItem, o))
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
    }, y = t.composerDraft?.videoComposition, N = y && JSON.stringify([y.clips, y.audioTracks, y.settings]) !== JSON.stringify([n.clips, n.audioTracks, n.settings]) ? ju(l) : l;
    return e.nodes[e.nodes.indexOf(t)] = N, {
      node: N,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const s = wd(
    e.nodes,
    e.storyboardNode
  ), r = pn(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return r.id = Qa(
    e.nodes,
    `script-compose-${Ee(e.storyboardNode.id)}`
  ), r.nodeNo = e.nextNodeNo, r.title = "视频合成", r.kind = "video", r.outputType = "video_compose", r.description = "按镜头顺序合成画面、原声和配音。", e.power || (r.subtitle = "未配置视频合成能力", r.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), r.composerDraft = { videoComposition: n }, r.storyboardItem = o, e.nodes.push(r), {
    node: r,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function wd(e, t) {
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
function hy(e, t, n, o, s) {
  const i = ["shots", "speech", "subtitles"].filter(
    (l) => s.some((y) => y.key === l)
  ).map((l) => Ja(t, n, l)).filter((l) => !!l), c = `script-compose-edge-${Ee(n)}-`, a = e.filter((l) => !l.id.startsWith(c));
  for (const l of i.length ? i : t.filter((y) => y.id === n))
    a.push({
      id: ec(a, `${c}${Ee(l.id)}`),
      from: l.id,
      to: o,
      logicalFrom: l.id,
      logicalTo: o,
      purpose: "dependency",
      executionMode: "manual"
    });
  const u = Tt(t, a);
  return Za(e, u) ? e : u;
}
function wy(e, t) {
  const n = `script-compose-edge-${Ee(t)}-`, o = e.filter((s) => !s.id.startsWith(n));
  return o.length === e.length ? e : o;
}
function Za(e, t) {
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
function Qa(e, t) {
  return ol(new Set(e.map((n) => n.id)), t);
}
function ec(e, t) {
  return ol(new Set(e.map((n) => n.id)), t);
}
function ol(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function Ee(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function vd(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function vy(e) {
  return e.outputType === "speech" ? "语音合成" : e.powerKind === "image" ? "图片" : "视频";
}
function vo(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function tc(e) {
  return Fa(e.power, e.kind, e.outputType) && Qr(e, e.resultOutput)?.document || null;
}
function ma(e, t) {
  const n = e.edges.find((o) => (o.logicalFrom || o.from) === t && e.nodes.some((s) => s.id === (o.logicalTo || o.to) && s.outputType === "setting"));
  return n ? e.nodes.find((o) => o.id === (n.logicalTo || n.to)) : void 0;
}
function by(e) {
  if (ma(e.canvas, e.storyNodeId)) return e.canvas;
  const t = e.canvas.nodes.find((s) => s.id === e.storyNodeId), n = Rn(e.powers, "text", "setting");
  if (!n) throw new Error("请先在后台配置设定能力");
  const o = pn(
    "power",
    e.assetCate,
    e.canvas.nodes.length,
    { x: t.x, y: t.y + t.height + 96 },
    { power: n }
  );
  return o.nodeNo = Mo(e.canvas.nodes, e.canvas.nextNodeNo), o.title = t.title + " · 设定", o.composerDraft = {
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
function Ny(e) {
  const t = li(e.settingNode);
  if (!t) return e.canvas;
  const n = Ee(JSON.stringify(t));
  if (e.settingNode.storyboardMaterializedSignature === n) return e.canvas;
  const o = e.settingNode, s = e.canvas.nodes.filter((l) => !l.storyboardItem || l.storyboardItem.sourceNodeId !== o.id || t.materials.some((y) => y.id === l.storyboardItem.itemId && y.type === l.storyboardItem.itemType)), r = Qs.filter((l) => ["character", "scene", "prop"].includes(l.itemType)), i = Rn(e.powers, "image", "general"), c = Fu({ sourceNode: o, groups: r.map((l) => ({ key: l.key, layoutIndex: l.layoutIndex, direction: l.direction, powerKind: l.powerKind, power: i, itemCount: t.materials.filter((y) => y.type === l.itemType).length })) });
  let a = Mo(s, e.canvas.nextNodeNo);
  for (const l of r) {
    const y = c.get(l.key), v = Yu({ nodes: s, storyboardNode: o, spec: l, layout: y, assetCate: e.assetCate }).node;
    for (const R of t.materials.filter((x) => x.type === l.itemType)) {
      const x = { id: R.id, type: R.type, title: R.name, prompt: R.prompt }, P = s.findIndex((V) => yr(V, o.id, x.type, x.id)), D = P >= 0 ? Xa(s[P], v.id, x, l, i, { nodes: s }) : Ju({ nodes: s, group: v, storyboardNode: o, item: x, assetCate: e.assetCate, spec: l, power: i }), T = { ...D, title: R.name, storyboardItem: { ...D.storyboardItem, generatedInputs: { ...D.storyboardItem.generatedInputs, voice: R.voice } } };
      P >= 0 ? s[P] = T : (T.nodeNo = a++, s.push(T));
    }
    const N = s.filter((R) => R.groupId === v.id), I = Bu(v, N);
    for (const R of N) s[s.indexOf(R)] = { ...R, ...I.positions.get(R.id) };
  }
  s[s.findIndex((l) => l.id === o.id)] = { ...o, storyboardMaterializedSignature: n };
  const u = e.canvas.edges.filter((l) => s.some((y) => y.id === l.from) && s.some((y) => y.id === l.to));
  return { ...e.canvas, nextNodeNo: a, nodes: s, edges: Tt(s, u) };
}
function pi(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    const o = tc(n);
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
    }), i = jp + Ee(n.id), c = t.nodes.find((T) => T.id === i);
    if (!c && r.length < 2) continue;
    const a = Rn(e.powers, "video", "video_compose"), u = c || pn(
      "power",
      e.assetCate,
      Mo(t.nodes, t.nextNodeNo),
      { x: Math.max(...r.map(({ board: T }) => T.x + T.width)) + 360, y: n.y },
      a ? { power: a } : void 0
    ), l = c?.composerDraft?.videoComposition || Kp(), y = i + "-chapter-", v = (T) => T.sourceEdgeId?.startsWith(y), N = t.edges.filter((T) => !T.id.startsWith(y));
    let I = !!c && JSON.stringify(l.clips.filter(v).map((T) => T.id)) !== JSON.stringify(r.map(({ unit: T }) => T.id));
    const R = r.map(({ unit: T, board: V, composition: te }) => {
      const G = y + Ee(T.id);
      te && N.push({ id: G, from: te.id, to: i, purpose: "dependency" });
      const re = Number(te?.resultRef?.asset_id || te?.asset?.id || 0), F = Number(te?.resultRef?.version_id || te?.asset?.version_id || 0), ge = re && F ? { assetId: re, versionId: F, label: T.title } : void 0, $ = Vt([V.asset?.version?.content, V.resultOutput]), q = l.clips.find((Q) => Q.id === T.id), z = $?.target_duration || q?.duration || 0;
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
    }), x = [];
    let P = 0;
    for (const T of l.clips)
      v(T) ? P < R.length && x.push(R[P++]) : x.push(T);
    x.push(...R.slice(P));
    const D = {
      ...u,
      id: i,
      title: c?.title || "全片合成",
      kind: "video",
      outputType: "video_compose",
      description: "按章节顺序合成整部视频。",
      composerDraft: { ...u.composerDraft, videoComposition: { ...l, clips: x } }
    };
    I && (delete D.asset, delete D.resultRef, delete D.resultOutput, delete D.resultView), !(c && JSON.stringify(c) === JSON.stringify(D) && JSON.stringify(t.edges) === JSON.stringify(N)) && (t = {
      ...t,
      nodes: c ? t.nodes.map((T) => T.id === i ? D : T) : [...t.nodes, D],
      edges: N,
      nextNodeNo: Mo([...t.nodes, D], t.nextNodeNo)
    });
  }
  return t;
}
function qi(e, t) {
  if (Eo(e.power, e.kind, e.outputType))
    return e.composerDraft?.promptContent?.parts.find(
      (n) => n.type === "reference" && n.ref_type === "asset" && n.ref_id === t && n.ref_content_selection?.kind === "unit"
    );
}
function Iy(e) {
  const t = e.canvas.nodes.find(
    (N) => N.id === e.storyNodeId
  ), n = t && tc(t), o = Number(t?.asset?.id || t?.resultRef?.asset_id || 0), s = Number(
    t?.asset?.version_id || t?.asset?.version?.id || t?.resultRef?.version_id || 0
  );
  if (!t || !n || !o || !s)
    throw new Error("请先保存故事作品");
  const r = Rn(e.powers, "text", "storyboard");
  if (!r) throw new Error("请先配置分镜脚本能力");
  const i = n.units.filter(
    (N) => e.unitIds.includes(N.id)
  );
  if (!i.length || i.length !== new Set(e.unitIds).size || i.some((N) => !N.asset_id || !N.version_id || !N.has_body))
    throw new Error("请选择已生成正文的章节");
  const c = ma(e.canvas, t.id) ? e.canvas : by(e), a = [...c.nodes], u = [...c.edges], l = ma(c, t.id);
  let y = Mo(a, c.nextNodeNo);
  for (const N of i) {
    let I = a.find((x) => {
      const P = qi(x, o);
      return P?.type === "reference" && P.ref_content_selection?.ids.length === 1 && P.ref_content_selection.ids[0] === N.id;
    });
    I || (I = pn(
      "power",
      e.assetCate,
      y,
      {
        x: t.x + (t.width || 420) + 360,
        y: t.y + n.units.indexOf(N) * 460
      },
      { power: r }
    ), I.id = `chapter-${Ee(t.id)}-${Ee(N.id)}`, I.nodeNo = y++, I.title = N.title, I.titleMode = "manual", I.composerDraft = {
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
            label: N.title,
            ref_content_selection: { kind: "unit", ids: [N.id] }
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
            (x) => x.type === "reference" && x.ref_type === "asset" && x.ref_id === o ? { ...x, ref_version_id: s } : x
          )
        }
      }
    };
    for (const x of [t.id, ...l ? [l.id] : []]) {
      const P = `chapter-source-${Ee(x)}-${Ee(I.id)}`;
      u.some((D) => D.id === P) || u.push({ id: P, from: x, to: I.id, purpose: "structure" });
    }
  }
  const v = new Set(
    a.filter((N) => qi(N, o)).map((N) => N.id)
  );
  for (let N = u.length - 1; N >= 0; N--) {
    const I = u[N];
    I.id.startsWith("chapter-next-") && v.has(I.from) && v.has(I.to) && u.splice(N, 1);
  }
  for (let N = 1; N < n.units.length; N++) {
    const I = n.units.slice(N - 1, N + 1).map(
      (x) => a.find((P) => {
        const D = qi(P, o);
        return D?.type === "reference" && D.ref_content_selection?.ids[0] === x.id;
      })
    );
    if (!I[0] || !I[1]) continue;
    const R = `chapter-next-${Ee(I[0].id)}-${Ee(I[1].id)}`;
    u.some((x) => x.id === R) || u.push({
      id: R,
      from: I[0].id,
      to: I[1].id,
      purpose: "structure"
    });
  }
  return pi({
    ...e,
    canvas: { ...c, nodes: a, edges: u, nextNodeNo: y }
  });
}
function Cy(e, t, n) {
  if (!Eo(e.power, e.kind, e.outputType)) return "";
  const o = Vt([
    e.asset?.version?.content,
    e.resultOutput
  ]), s = o?.screenplay?.source;
  if (!o || !s) return "";
  const r = t.find(
    (l) => Number(l.asset?.id || l.resultRef?.asset_id) === s.work_asset_id
  ), i = r && tc(r);
  if (!r || !i) return "";
  const c = i.units.find((l) => l.id === s.unit_id);
  if (!c) return "来源章节已移除，已有分镜和视频保留";
  if (c.asset_id !== s.asset_id || c.version_id !== s.version_id)
    return "章节正文已更新，重做剧本后再制作；已有结果保留";
  const a = qp(t, n, e.id), u = a && li(a);
  return u && (o.visual_mode !== u.visual_mode || o.aspect_ratio !== u.aspect_ratio || o.style_prompt !== u.style_prompt) ? "全片画风或画幅已更新，请重做剧本后再制作" : "";
}
const bd = 520, Sy = 8e3;
function Nd(e) {
  return {
    baseline: e.loadedBaseline ?? "",
    revision: 0,
    savedRevision: 0,
    retryCount: 0
  };
}
function _y({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: o,
  onError: s
}) {
  const r = ne(n), i = ne(/* @__PURE__ */ new Map()), c = ne(/* @__PURE__ */ new Map()), a = ne({}), u = ne(0), l = ne(null), [y, v] = K(0), [N, I] = K({});
  ue(() => {
    r.current = n;
  }, [n]);
  const R = O(($) => {
    const q = a.current[$];
    q != null && (window.clearTimeout(q), delete a.current[$]);
  }, []), x = O(
    ($, q = bd) => {
      const z = i.current.get($);
      if (!t || !e || !z || z.conflict || typeof window > "u")
        return;
      R($);
      const Q = u.current;
      a.current[$] = window.setTimeout(() => {
        delete a.current[$], l.current?.($, Q)?.catch(() => {
        });
      }, q);
    },
    [R, t, e]
  ), P = O(
    async ($, q, z) => {
      const Q = i.current.get($);
      if (!Q || q !== u.current || !t || !e)
        return;
      const me = () => q === u.current && i.current.get($) === Q;
      if (Q.conflict)
        throw Q.conflict;
      for (; c.current.has($); )
        if (await c.current.get($), !me())
          return;
      const ye = z?.revision ?? Q.revision;
      if (ye <= Q.savedRevision)
        return;
      const ve = z?.canvas || r.current[$];
      if (!ve)
        return;
      const fe = (async () => {
        I((he) => ({ ...he, [$]: "saving" }));
        try {
          const he = await qf({
            projectId: e,
            canvasId: ve.id,
            assetCateId: ve.assetCateId,
            canvas: ve,
            baseline: Q.baseline
          });
          if (!me())
            return;
          Q.baseline = he.baseline, Q.savedRevision = ye, Q.retryCount = 0, Q.revision === ye ? (o((ce) => {
            const ze = ce[$], be = he.updatedAt || ze?.updatedAt;
            return !me() || !ze || ze.updatedAt === be ? ce : {
              ...ce,
              [$]: { ...ze, updatedAt: be }
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
          throw he instanceof Error && "code" in he && he.code === 409 ? (Q.conflict = he, R($), I((Be) => ({ ...Be, [$]: "dirty" })), s(he), he) : (Q.retryCount += 1, I((Be) => ({ ...Be, [$]: "error" })), Q.retryCount === 1 && s(he), x(
            $,
            Math.min(Sy, bd * 2 ** Q.retryCount)
          ), he);
        } finally {
          me() && !Q.conflict && Q.revision > Q.savedRevision && Q.retryCount === 0 && x($);
        }
      })();
      c.current.set($, fe);
      try {
        await fe;
      } finally {
        c.current.get($) === fe && c.current.delete($);
      }
    },
    [R, t, s, e, x, o]
  );
  l.current = P;
  const D = O(
    async ($) => {
      const q = String($.id), z = i.current.get(q);
      if (!z || !t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      if (z.conflict)
        throw s(z.conflict), z.conflict;
      const Q = u.current, me = ++z.revision;
      if (z.retryCount = 0, R(q), I((ye) => ({ ...ye, [q]: "dirty" })), await P(q, Q, { canvas: $, revision: me }), Q !== u.current || i.current.get(q) !== z)
        throw new Error("画布状态已更新，请重新运行");
    },
    [R, t, s, e, P]
  ), T = O(($) => {
    const q = String($), z = i.current.get(q);
    z && (z.revision += 1, z.retryCount = 0, I((Q) => ({ ...Q, [q]: "dirty" })), z.conflict || v((Q) => Q + 1));
  }, []), V = O(($) => {
    const q = i.current.get($);
    return q != null && (c.current.has($) || q.revision > q.savedRevision);
  }, []), te = O(
    ($) => $ == null ? [...i.current.keys()].some(V) : V(String($)),
    [V]
  ), G = O(async () => {
    const $ = u.current;
    for (; ; ) {
      const q = [...i.current.keys()].filter(V);
      if (!q.length) return;
      if (await Promise.all(
        q.map(async (z) => {
          R(z), await P(z, $);
        })
      ), $ !== u.current)
        throw new Error("画布状态已更新，请重试");
    }
  }, [R, V, P]), re = O(
    ($) => {
      u.current += 1, r.current = $;
      for (const z of Object.keys(a.current))
        R(z);
      i.current.clear();
      const q = {};
      for (const [z, Q] of Object.entries($))
        i.current.set(z, Nd(Q)), q[z] = "saved";
      I(q);
    },
    [R]
  ), F = O(
    ($) => {
      const q = String($.id);
      i.current.has(q) && ($.loadedBaseline == null || r.current[q] === $) || (R(q), r.current = { ...r.current, [q]: $ }, i.current.set(q, Nd($)), I((z) => ({ ...z, [q]: "saved" })));
    },
    [R]
  ), ge = O(
    ($) => {
      const q = String($);
      R(q), i.current.delete(q), I((z) => {
        if (!Object.prototype.hasOwnProperty.call(z, q))
          return z;
        const Q = { ...z };
        return delete Q[q], Q;
      });
    },
    [R]
  );
  return ue(() => {
    for (const [$, q] of i.current)
      q.revision > q.savedRevision && x($);
  }, [x, y]), ue(
    () => () => {
      u.current += 1;
      for (const $ of Object.values(a.current))
        window.clearTimeout($);
      a.current = {};
    },
    []
  ), {
    markCanvasDirty: T,
    flushCanvasSave: D,
    flushPendingCanvasSaves: G,
    hasPendingCanvasSaves: te,
    adoptCanvasSnapshot: F,
    forgetCanvasSnapshot: ge,
    resetCanvasAutosave: re,
    canvasSaveStatus: N
  };
}
function Ry() {
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
const ky = 6e4, xy = 60;
class Ty {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const o = My(t, n);
    this.scopeKey !== o && (this.scopeKey = o, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, o, s = !1) {
    this.setScope(t, n);
    const r = this.scopeKey, i = this.catalogs.get(r) || { loadedAt: 0 };
    if (!s && i.value && Date.now() - i.loadedAt < ky)
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
    const o = this.scopeKey, s = Ay(t), r = this.powerForms.get(s);
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
    for (; this.powerForms.size > xy; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function My(e, t) {
  return `${e || 0}:${t || 0}`;
}
function Ay(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function rl(e) {
  if (e.kind === "media" && e.options.length === 1)
    return { kind: "media", key: e.options[0].key };
  if (e.kind === "text" && e.params.length === 1 && !e.lyricsAvailable)
    return { kind: "text", key: e.params[0].key };
  if (e.kind === "text" && e.params.length === 0 && e.lyricsAvailable)
    return { kind: "lyrics" };
}
function sl(e, t, n, o) {
  const s = {
    projectId: t,
    releaseId: n,
    flowId: Number(o.flow?.id || 0),
    powerId: Number(o.power?.id || 0),
    powerKey: o.power?.key || "",
    targetId: Number(o.composerDraft?.selectedTargetId || 0)
  };
  return e.loadPowerForm(s, () => tu(s));
}
function il(e, t) {
  return Ou(t, Eu(t, Ea(e.composerDraft)));
}
function ga(e, t, n) {
  return Gp(il(e, t), e.composerDraft, n);
}
function al(e, t, n) {
  return t.flatMap((o) => !yu(o) || (o.logicalTo || o.to) !== n ? [] : Qd(e, o.logicalFrom || o.from).filter(Wa).map((s) => ({ edge: o, source: s })));
}
function mr({ source: e, target: t, nodes: n, edges: o, items: s, params: r, referenceOnly: i = !1 }) {
  if (!e || !t || !eu(e, t))
    return { kind: "invalid", reason: "无法连接这两个节点，请检查节点和分组位置" };
  const c = o.filter((v) => (v.logicalTo || v.to) === t.id);
  if (hu(e, t) === "structure") {
    const v = e.outputType === "storyboard";
    return c.some((N) => {
      const I = N.logicalFrom || N.from;
      return I !== e.id && n.some((R) => R.id === I && R.outputType === e.outputType);
    }) ? { kind: "invalid", reason: v ? "一个分镜只能接续一个前章分镜" : "一个分镜只能引用一份共用设定" } : { kind: "direct", description: v ? "接续前章分镜" : "复用角色、场景、道具" };
  }
  if (t.type === "group" || Qt(e, "start") && (t.type === "power" || t.type === "agent" || t.type === "flow"))
    return { kind: "direct" };
  if (e.outputType === "setting" || e.outputType === "storyboard")
    return { kind: "invalid", reason: "此节点输出的是结构化内容，不能当作普通文本或媒体引用" };
  const u = (e.type === "group" ? Qd(n, e.id) : [e]).filter(Wa), l = ir(e), y = Fa(e.power, e.kind, e.outputType);
  if (Qt(t, "display") || Qt(t, "save")) {
    if (c.some((v) => (v.logicalFrom || v.from) !== e.id))
      return { kind: "invalid", reason: "此功能节点只能接收一个上游结果" };
    if (l || y || u.length || e.type === "group") return { kind: "direct" };
  }
  if (t.type === "agent" && t.role?.agent_id && (l || y || !i && u.length))
    return { kind: "direct" };
  if (!i && t.type === "flow" && (l || y)) return { kind: "direct" };
  if (t.type === "power" && t.power) {
    if (t.outputType === "video_compose")
      return u.length && u.every((v) => _g(v) === "video") ? { kind: "direct", description: "用作视频片段" } : { kind: "invalid", reason: "视频合成只接收连线导入的视频片段" };
    if (t.outputType === "setting" && y)
      return { kind: "direct", description: "提取作品中的设定" };
    if (!i && y) return { kind: "direct" };
    if (u.length) {
      if (!r) return { kind: "form" };
      const v = Ea(t.composerDraft), N = al(n, o, t.id), I = Eu(r, v), R = Rg(
        r,
        I,
        [...N.map((V) => V.source), ...u]
      ), x = kg({
        node: t,
        content: v.promptContent,
        items: s,
        connections: N,
        params: r,
        values: R,
        requestedMode: v.multiImageMode,
        additionalSources: u
      });
      if (x.error) return { kind: "invalid", reason: x.error };
      const P = x.active ? x.mode : void 0, D = xg(
        N,
        Tg(Ou(r, R)),
        u,
        v.promptContent,
        s,
        P
      );
      if (D.error) return { kind: "invalid", reason: D.error };
      const T = { ...v, paramValues: R, multiImageMode: P ?? v.multiImageMode };
      return {
        kind: "media",
        options: D.options.map((V) => ({ key: V.key, name: V.label })),
        draft: (R !== I || P) && Vc(T) !== Vc(v) ? T : void 0
      };
    }
    if (l) {
      if (!r) return { kind: "form" };
      const v = ga(t, r, e.id), N = Ks(t);
      return v.length || N ? { kind: "text", params: v, lyricsAvailable: N } : { kind: "invalid", reason: "下游没有空闲且生效的文本参数" };
    }
  }
  return !i && (e.type === "group" || Qt(e, "import")) ? { kind: "direct" } : { kind: "invalid", reason: "下游没有能接收该节点结果的输入" };
}
function Dy(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function Py(e, t) {
  return String(t || "").trim() ? "" : String(e || "").trim();
}
function Ey(e, t) {
  const n = new Set(t);
  return e.map(
    (o) => n.has(o.id) && o.runError ? { ...o, runError: "" } : o
  );
}
function Oy(e, t, n) {
  const o = new Map(t.map((a) => [a.id, a])), s = Fy(n), r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const a of t)
    a.groupId && i.set(a.groupId, [
      ...i.get(a.groupId) || [],
      a.id
    ]);
  const c = (a) => {
    for (const u of s.get(a) || []) {
      if (r.has(u))
        continue;
      r.add(u);
      const l = o.get(u);
      if (l?.type === "group")
        for (const y of i.get(l.id) || [])
          r.has(y) || (r.add(y), c(y));
      (!l || !cl(l)) && c(u);
    }
  };
  return c(e), [...r];
}
function cl(e) {
  return !!(e.type === "function" && fs(e.functionOption?.key)?.stopsExecution);
}
function nc(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : !!(e.type === "function" && fs(e.functionOption?.key)?.runsInBackend);
}
function Fy(e) {
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
function By({
  members: e,
  hasResult: t
}) {
  const n = e.filter(nc), o = n.filter(
    (s) => !t(s)
  );
  return (o.length > 0 ? o : n).map(
    (s) => s.id
  );
}
function dl({
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
      const u = a.title || "未命名素材";
      if (!n(a))
        return `请先生成前置素材“${u}”`;
    }
  }
  return "";
}
function oc({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: o
}) {
  const s = e.filter(nc), r = s.map((u) => t[u.id]).filter((u) => !!u), c = n?.status === "running" || n?.status === "waiting" ? s.filter((u) => {
    const l = t[u.id];
    return l?.status === "success" || !l && o(u);
  }).length : s.filter((u) => {
    const l = t[u.id];
    return l?.status === "success" ? !0 : l ? !1 : o(u);
  }).length, a = r.filter(
    (u) => u.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: s.length,
    completedCount: c,
    failedCount: a,
    status: zy(n, r, a)
  };
}
function zy(e, t, n) {
  return t.some((o) => o.status === "running") ? "running" : e?.status === "waiting" || t.some((o) => o.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function Uy({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: o = !0,
  canEditStructure: s = !1,
  canResetStoryboardPrompt: r = !1,
  onClose: i,
  onCopy: c,
  onDelete: a,
  onDetail: u,
  onEditStructure: l,
  onResetStoryboardPrompt: y,
  onRestoreAutoSize: v
}) {
  return /* @__PURE__ */ L(qt, { children: [
    /* @__PURE__ */ f("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ L(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (N) => N.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ L("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ f(ja, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "详情" })
          ] }) : null,
          s && l ? /* @__PURE__ */ L("button", { type: "button", onClick: l, children: [
            /* @__PURE__ */ f(ku, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "编辑分镜" })
          ] }) : null,
          r && y ? /* @__PURE__ */ L("button", { type: "button", onClick: y, children: [
            /* @__PURE__ */ f(sd, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "恢复脚本提示词" })
          ] }) : null,
          v ? /* @__PURE__ */ L("button", { type: "button", onClick: v, children: [
            /* @__PURE__ */ f(sd, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "恢复自动尺寸" })
          ] }) : null,
          n ? /* @__PURE__ */ L("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ f(og, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "复制" })
          ] }) : null,
          o ? /* @__PURE__ */ L("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ f(rg, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function Ly({
  canvasCount: e,
  activeCanvasName: t,
  canvasManagerOpen: n,
  showViewTools: o,
  showMiniMap: s,
  snapToGrid: r,
  zoom: i,
  onToggleMiniMap: c,
  onToggleSnap: a,
  onReset: u,
  onZoomIn: l,
  onZoomOut: y,
  onZoomChange: v,
  onOpenCanvasManager: N
}) {
  const I = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ L("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ f(mt, { label: I, children: /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: N,
        children: /* @__PURE__ */ f(sg, { size: 16 })
      }
    ) }),
    o ? /* @__PURE__ */ L(qt, { children: [
      /* @__PURE__ */ f("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ f(mt, { label: s ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: c,
          "aria-label": s ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ f(ig, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(mt, { label: r ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: r ? "is-active" : "",
          onClick: a,
          "aria-label": r ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ f(xu, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(mt, { label: "重置视图", children: /* @__PURE__ */ f("button", { type: "button", onClick: u, "aria-label": "重置视图", children: /* @__PURE__ */ f(ag, { size: 15 }) }) }),
      /* @__PURE__ */ L("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ f(mt, { label: "缩小", children: /* @__PURE__ */ f("button", { type: "button", onClick: y, "aria-label": "缩小", children: /* @__PURE__ */ f(Tu, { size: 15 }) }) }),
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
        /* @__PURE__ */ f(mt, { label: "放大", children: /* @__PURE__ */ f("button", { type: "button", onClick: l, "aria-label": "放大", children: /* @__PURE__ */ f(Mu, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
const $y = [
  "position",
  "measured",
  "width",
  "height",
  "dragging",
  "resizing"
];
function ul(e, t) {
  return e && t?.interactionId === e ? t : null;
}
function ll(e, t, n) {
  const o = ul(t, n);
  if (!o)
    return e;
  const s = new Map(o.baseNodes.map((c) => [c.id, c])), r = new Map(o.nodes.map((c) => [c.id, c])), i = e.map((c) => {
    const a = s.get(c.id), u = r.get(c.id);
    if (!a || !u)
      return c;
    if (c === a)
      return u;
    let l = c;
    for (const y of $y)
      u[y] === a[y] || u[y] === c[y] || (l === c && (l = { ...c }), Object.assign(l, { [y]: u[y] }));
    return l;
  });
  return i.every((c, a) => c === e[a]) ? e : i.length === o.nodes.length && i.every((c, a) => c === o.nodes[a]) ? o.nodes : i;
}
function Vy(e, t, n, o) {
  if (!n)
    return e;
  const s = ll(
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
function jy(e, t) {
  const [n, o] = K(null), s = se(
    () => ll(e, t, n),
    [e, t, n]
  );
  ue(() => {
    o(
      (i) => ul(t, i)
    );
  }, [t]);
  const r = O(
    (i) => {
      o(
        (c) => Vy(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: s, setFlowNodes: r };
}
function Ky(e, t) {
  const n = ne([]);
  return se(() => {
    const o = qy(
      e,
      n.current,
      t
    );
    return n.current = o, o;
  }, [t, e]);
}
function qy(e, t, n) {
  const o = new Map(t.map((r) => [r.id, r])), s = e.map((r) => {
    const i = o.get(r.id);
    return i && n(i, r) ? i : r;
  });
  return t.length === s.length && s.every((r, i) => r === t[i]) ? t : s;
}
function Gy(e) {
  return (...t) => e.current(...t);
}
function Wy(e, t) {
  return t && rc(t.source, e) ? t.value : e;
}
function Id(e, t, n) {
  return {
    source: t && rc(t.source, e) ? t.source : e,
    value: n
  };
}
function rc(e, t) {
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
], oi = 140, sc = 100, Wr = 720, Cd = { width: 280, height: 64 };
function Hy(e, t, n, o) {
  const s = ml(n);
  return Qy(o, s) ? e : e.map(
    (r) => r.id === t ? { ...r, ...s, sizeMode: "manual" } : r
  );
}
function Yy(e, t, n) {
  const o = is(n), s = e.find((r) => r.id === t);
  return !s || rc(s.resultView, o) ? e : e.map(
    (r) => r.id === t ? { ...r, resultView: o } : r
  );
}
function Jy({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: o,
  onResizeEnd: s
}) {
  if (!t || !n || !s)
    return null;
  const r = e.type === "group", i = e.type === "power" && ru(e.power, e.kind);
  return /* @__PURE__ */ f(qt, { children: fl.map((c) => /* @__PURE__ */ f(
    Wm,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: r ? Kc.width : i ? Cd.width : oi,
      minHeight: r ? Kc.height : i ? Cd.height : sc,
      maxWidth: r ? jc.width : Wr,
      maxHeight: r ? jc.height : Wr,
      keepAspectRatio: !r && !i,
      onResizeStart: () => o?.(e.id),
      onResizeEnd: (a, u) => s(e.id, ml(u))
    },
    c.position
  )) });
}
function Xy({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: o,
  onResizeEnd: s
}) {
  const r = ne(null);
  if (!t)
    return null;
  const i = (u, l) => {
    if (u.button !== 0)
      return;
    u.preventDefault(), u.stopPropagation();
    const y = is(e), v = u.currentTarget.parentElement?.getBoundingClientRect().width || y.width;
    r.current = {
      pointerId: u.pointerId,
      startX: u.clientX,
      startY: u.clientY,
      startView: y,
      currentView: y,
      corner: l,
      scale: Math.max(0.01, v / y.width)
    }, u.currentTarget.setPointerCapture(u.pointerId), n?.();
  }, c = (u) => {
    const l = r.current;
    if (!l || l.pointerId !== u.pointerId)
      return;
    u.preventDefault(), u.stopPropagation();
    const y = Zy(
      l.startView,
      l.corner,
      (u.clientX - l.startX) / l.scale,
      (u.clientY - l.startY) / l.scale
    );
    l.currentView = y, o(y);
  }, a = (u) => {
    const l = r.current;
    !l || l.pointerId !== u.pointerId || (u.preventDefault(), u.stopPropagation(), r.current = null, u.currentTarget.hasPointerCapture(u.pointerId) && u.currentTarget.releasePointerCapture(u.pointerId), s(is(l.currentView)));
  };
  return /* @__PURE__ */ f(qt, { children: fl.map((u) => /* @__PURE__ */ f(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${u.className} nodrag nopan nowheel`,
      onPointerDown: (l) => i(l, u),
      onPointerMove: c,
      onPointerUp: a,
      onPointerCancel: a,
      onClick: (l) => {
        l.preventDefault(), l.stopPropagation();
      }
    },
    u.position
  )) });
}
function Zy(e, t, n, o) {
  const s = e.width / e.height, r = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * o) * s, c = pl(
    Math.abs(r - e.width) >= Math.abs(i - e.width) ? r : i,
    s
  ), a = c / s, u = Number(e.offsetX || 0), l = Number(e.offsetY || 0);
  return is({
    width: c,
    height: a,
    offsetX: t.left ? u + e.width - c : u,
    offsetY: t.top ? l + (e.height - a) / 2 : l + (a - e.height) / 2
  });
}
function pl(e, t) {
  const n = Math.max(oi, sc * t), o = Math.min(Wr, Wr * t);
  return n > o ? Math.min(Wr, Math.max(oi, e)) : Math.min(o, Math.max(n, e));
}
function is(e) {
  const t = Sd(e.width, oi), n = Sd(e.height, sc), o = t / n, s = pl(t, o);
  return {
    width: Math.round(s),
    height: Math.round(s / o),
    offsetX: Math.round(_d(e.offsetX, 0)),
    offsetY: Math.round(_d(e.offsetY, 0))
  };
}
function Sd(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function _d(e, t) {
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
function Qy(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function eh() {
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
    const u = i();
    return c.set(s, { dependencies: r, value: u }), u;
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
function th() {
  let e;
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  return {
    update(o, s) {
      const r = new Map(
        o.map((a) => [
          a.id,
          Qt(a, "start") ? "start" : cl(a) ? "stop" : "other"
        ])
      ), i = e;
      if (i && r.size === i.semantics.size && [...r].every(
        ([a, u]) => i.semantics.get(a) === u
      ) && s.length === i.edges.length && s.every((a, u) => {
        const l = i.edges[u];
        return a.id === l.id && a.from === l.from && a.to === l.to;
      }))
        return;
      const c = /* @__PURE__ */ new Map();
      for (const a of s) {
        const u = c.get(a.from) || [];
        u.push({ id: a.id, to: a.to }), c.set(a.from, u);
      }
      e = {
        semantics: r,
        edges: s.map(({ id: a, from: u, to: l }) => ({ id: a, from: u, to: l })),
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
        const u = c[a];
        r.has(u.id) || (r.add(u.id), !i.has(u.to) && (i.add(u.to), e.semantics.get(u.to) !== "stop" && c.push(...e.outgoing.get(u.to) || [])));
      }
      return t.size >= 2 && t.delete(t.keys().next().value), t.set(o, r), r;
    }
  };
}
const gl = "反馈已被新的运行替换";
function nh(e) {
  return e instanceof Error && e.message === gl;
}
function Ro(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function oh(e, t) {
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
function rh(e, t, n) {
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
function sh(e, t, n) {
  if (!e)
    return !1;
  const o = t.find((r) => r.id === e.node.id) || e.node, s = Ro(o).find(
    (r) => r.id === e.recordId
  );
  return s ? !(s.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function ih(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], o = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: Ip(t?.status || e?.status || "running"),
    output: Mt(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(uh).filter(Boolean),
    interactions: o.map(ch).filter(Boolean),
    raw: e
  };
}
function ah(e) {
  const t = e.interactions.find(
    (r) => !!(r.interaction?.id && r.interaction?.type)
  );
  if (t)
    return yl(t);
  const n = e.approvals.find(lh);
  if (!n?.id)
    return null;
  const o = fh(n), s = ic(o);
  return {
    approval: n,
    title: Fe(o.title, n.title, "补充信息"),
    description: Fe(
      o.description,
      "补充信息后继续执行流程。"
    ),
    fields: s,
    values: ac(o, s)
  };
}
function yl(e) {
  const t = e.interaction, n = ic(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: Fe(t.title, "补充信息"),
    description: Fe(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: ac(t, n)
  };
}
function ch(e) {
  const t = Hm(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function ic(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, o) => ph(n, o)).filter((n) => !!n.key);
}
function ac(e, t) {
  const n = Mg(t), o = e.values && typeof e.values == "object" ? e.values : {}, s = {
    ...n,
    ...o
  }, r = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return r > 0 && (s.source_target_id = r), s;
}
function dh(e, t) {
  const n = mh(e);
  if (!n)
    return null;
  const o = ic(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: Fe(n.title, t, "补充信息"),
    description: Fe(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: o,
    values: ac(n, o)
  };
}
function uh(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function lh(e) {
  return e.status === "pending" || e.decision === "pending";
}
function fh(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function ph(e, t) {
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
    accepted_kinds: Rd(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: Rd(
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
function Rd(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function mh(e) {
  const t = Gi(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const o = Gi(e?.interaction);
    return o && Fe(o.type) ? o : null;
  }
  const n = Gi(t.interaction, t.content?.interaction);
  return n && Fe(n.type) ? n : null;
}
function Gi(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
function gh({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: o,
  targetY: s,
  sourcePosition: r,
  targetPosition: i,
  markerEnd: c,
  style: a,
  data: u
}) {
  const [l, y, v] = Ym({
    sourceX: t,
    sourceY: n,
    sourcePosition: r,
    targetX: o,
    targetY: s,
    targetPosition: i
  }), N = u || {}, I = !!N.isSelected, R = !!(N.isHighlighted || I), x = N.highlightColor || "#0ea5e9", P = I ? "var(--ws-edge-selected)" : R ? x : "var(--ws-edge)", D = I ? 2.8 : R ? 2.4 : 1.45, T = R ? 0.96 : 0.62, V = String(N.bindingLabel || "").trim(), te = !!N.bindingInteractive, G = !!V, re = G || I;
  return /* @__PURE__ */ L(qt, { children: [
    R ? /* @__PURE__ */ f(
      rd,
      {
        path: l,
        style: {
          stroke: x,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ f(
      rd,
      {
        path: l,
        markerEnd: c,
        style: {
          ...a,
          stroke: P,
          strokeWidth: D,
          opacity: T,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    re ? /* @__PURE__ */ f(Jm, { children: /* @__PURE__ */ L(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          V ? "is-bound" : "",
          N.bindingInvalid ? "is-invalid" : ""
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
                F.preventDefault(), F.stopPropagation(), N.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ f(da, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ f("span", { children: V }),
                N.bindingShowChevron ? /* @__PURE__ */ f(cg, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ L("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ f(da, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ f("span", { children: V })
          ] }) : null,
          I ? /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (F) => {
                F.preventDefault(), F.stopPropagation(), N.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ f(dg, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    R ? /* @__PURE__ */ L(qt, { children: [
      /* @__PURE__ */ f("circle", { r: "3", fill: x, children: /* @__PURE__ */ f(
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
const yh = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function hh({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ f(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: yh,
      children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ f(Do, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(Ka, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ f("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Wi({
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
  const u = () => {
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
      onBlur: u,
      onPointerDown: (l) => l.stopPropagation(),
      onKeyDown: (l) => {
        l.stopPropagation(), l.key === "Enter" ? (l.preventDefault(), u()) : l.key === "Escape" && (l.preventDefault(), c(e), r(!1));
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
function wh(e, t) {
  const n = /* @__PURE__ */ new Set(), o = e.find((r) => r.id === t);
  if (!o)
    return [];
  o.type === "power" && Eo(
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
const vh = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function hl(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return vh[n] || { section: "shots" };
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
function bh(e, t) {
  const n = mi(e);
  return {
    frames: vl(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: wl(e, n)
  };
}
function kd(e) {
  return mi(e);
}
function Nh(e, t) {
  return wl(e).get(t.id) || "";
}
function wl(e, t = mi(e)) {
  const n = dc(e), o = /* @__PURE__ */ new Map();
  for (const s of e) {
    let r = "";
    s.storyboardItem?.sourceNodeId ? r = uc(s, n) : s.type === "group" && s.group?.origin === "script" ? r = n.get(s.id) || "" : t.has(s.id) ? r = s.id : s.groupId && (r = n.get(s.groupId) || ""), r && o.set(s.id, r);
  }
  return o;
}
function vl(e, t, n = mi(e)) {
  const o = new Map(e.map((u) => [u.id, u])), s = dc(e), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const u of e) {
    const l = /* @__PURE__ */ new Set();
    n.has(u.id) && l.add(u.id);
    const y = s.get(u.id);
    y && l.add(y);
    const v = u.storyboardItem?.sourceNodeId ? uc(u, s) : "";
    if (v && l.add(v), u.groupId) {
      const N = s.get(u.groupId);
      N && l.add(N);
    }
    for (const N of l)
      Hi(r, N, u);
    y && Hi(i, y, u), v && !u.storyboardItem?.optional && Hi(c, v, u);
  }
  const a = [];
  for (const u of n) {
    const l = o.get(u);
    if (!l)
      continue;
    const y = r.get(u) || [];
    if (y.length <= 1)
      continue;
    const v = i.get(u) || [], N = c.get(u) || [];
    a.push({
      id: cc(u),
      sourceNodeId: u,
      title: l.title || "分镜脚本",
      memberNodeIds: y.map((I) => I.id),
      workNodeIds: N.map((I) => I.id),
      groupCount: v.length,
      workNodeCount: N.length,
      completedCount: N.filter(t).length
    });
  }
  return a;
}
function Hi(e, t, n) {
  const o = e.get(t);
  o ? o.push(n) : e.set(t, [n]);
}
function bl(e, t, n, o, s = new Map(t.map((r) => [r.id, r]))) {
  const r = e.workNodeIds.map((l) => s.get(l)).filter((l) => !!l), i = r.find((l) => l.storyboardItem?.itemType === "video_compose");
  if (i) {
    const l = new Map(n.map((y) => [y.id, y]));
    for (const y of t) {
      if (y.outputType !== "video_compose" || y.storyboardItem || o(y)) continue;
      const v = (y.composerDraft?.videoComposition?.clips || []).map((N) => {
        const I = l.get(N.sourceEdgeId || "");
        return I && (I.logicalTo || I.to) === y.id ? s.get(I.logicalFrom || I.from) : void 0;
      });
      v.includes(i) && v.every((N) => N && (N === i || o(N))) && r.push(y);
    }
  }
  const c = r.filter((l) => !o(l)), a = new Set(c.map((l) => l.id));
  for (const l of [...c])
    for (const y of [
      ...l.storyboardItem?.referenceNodeIds || [],
      ...l.storyboardItem?.dependencyNodeIds || []
    ]) {
      const v = s.get(y), N = v?.groupId && s.get(v.groupId);
      v && N && s.get(v.storyboardItem?.sourceNodeId || "")?.outputType === "setting" && !o(v) && !a.has(y) && (a.add(y), c.push(v));
    }
  if (c.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const u = c.find(
    (l) => !nc(l)
  );
  return u ? {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: `“${u.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: dl({
      targets: c,
      nodesByID: s,
      hasResult: o
    })
  };
}
function cc(e) {
  return `storyboard-frame:${e}`;
}
function mi(e) {
  const t = dc(e), n = new Set(t.values());
  for (const o of e)
    o.storyboardMaterializedSignature && n.add(o.id), o.storyboardItem?.sourceNodeId && n.add(uc(o, t));
  return n;
}
function dc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    n.type !== "group" || n.group?.origin !== "script" || !n.group.sourceNodeId || t.set(
      n.id,
      n.group.sourceNodeId
    );
  return t;
}
function uc(e, t) {
  const n = e.storyboardItem?.sourceNodeId || "", o = t.get(e.groupId || "");
  return o && o === e.groupId ? o : n;
}
function Ih(e, t) {
  const n = String(
    t.semantic_event || t.event || ""
  ).toLowerCase(), o = Op(t.meta) ? t.meta : {}, s = n === "status", r = s && !!String(o.output_type || ""), i = r && !!(t.json && typeof t.json == "object" || o.storyboard_preview && typeof o.storyboard_preview == "object");
  let c = e.streamOutput;
  (n === "audio_ready" || i || fu(t)) && (c = t, s && "text" in t && (c = { ...t }, delete c.text));
  const a = typeof t.text == "string" && (n === "delta" || !n) ? t.text : "", u = Number(o.generated_count), l = Number(o.target_count);
  return {
    ...e,
    streamText: a ? `${e.streamText || ""}${a}` : e.streamText,
    streamOutput: c,
    streamStarted: e.streamStarted || !!a || !!c || r,
    ...s ? {
      statusText: typeof t.text == "string" && t.text.trim() ? t.text.trim() : e.statusText,
      executionPhase: typeof o.execution_phase == "string" ? o.execution_phase : e.executionPhase,
      queuePosition: typeof o.queue_position == "number" && Number.isInteger(o.queue_position) && o.queue_position >= 0 ? o.queue_position : e.queuePosition,
      generatedCount: Number.isInteger(u) && u >= 0 ? Math.max(e.generatedCount || 0, u) : e.generatedCount,
      targetCount: Number.isInteger(l) && l > 0 ? l : e.targetCount
    } : {}
  };
}
function Ch({
  space: e,
  canvases: t,
  cache: n,
  onError: o
}) {
  const [s, r] = K([]), [i, c] = K([]), [a, u] = K([]), [l, y] = K(!1), v = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, N = ne(v), I = se(
    () => l || Sh(t),
    [t, l]
  );
  ue(() => {
    N.current = v, r([]), c([]), u([]), y(!1);
  }, [v]);
  const R = O(
    async (x = !1) => {
      if (!e)
        return !1;
      const P = v;
      try {
        const D = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => Gf(e.project.id),
          x
        );
        return N.current !== P ? !1 : (r(D.roles), c(D.powers), u(D.powerCategories), y(!0), !0);
      } catch (D) {
        return N.current === P && o(D instanceof Error ? D.message : "加载能力列表失败"), !1;
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
function Sh(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power || n.outputType === "setting" ? !0 : Eo(n.power, n.kind, n.outputType) ? !!Vt([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function _h(e, t, n) {
  const o = e.get(t);
  e.set(
    t,
    o ? (s) => n(o(s)) : n
  );
}
function Rh(e, t) {
  let n = e;
  for (const [o, s] of t) {
    const r = e[o], i = s(r);
    i !== r && (n === e && (n = { ...e }), i ? n[o] = i : delete n[o]);
  }
  return n;
}
function kh({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: o,
  failedCount: s,
  status: r,
  selected: i,
  managed: c = !1,
  onRename: a,
  onEditStructure: u,
  onRun: l,
  runBlockedReason: y = "",
  children: v
}) {
  const [N, I] = K(!1), [R, x] = K(e.title), P = ne(null), D = r === "running" || r === "waiting", T = D ? "分组正在执行" : y || (n === 0 ? "分组内暂无可运行节点" : "运行分组"), V = !l || n === 0 || D || !!y;
  ue(() => {
    N || x(e.title);
  }, [N, e.title]), ue(() => {
    N && (P.current?.focus(), P.current?.select());
  }, [N]);
  const te = () => {
    const G = R.trim() || "未命名分组";
    I(!1), x(G), G !== e.title && a?.(G);
  };
  return /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-group-wrap ${i ? "is-selected" : ""} ${D ? "is-running" : ""} ${r === "error" ? "is-error" : ""} ${c ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ L("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ f("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(ug, { size: 15 }) }),
          N ? /* @__PURE__ */ f(
            "input",
            {
              ref: P,
              className: "ws-node-group-title-input nodrag nowheel",
              value: R,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (G) => x(G.target.value),
              onBlur: te,
              onKeyDown: (G) => {
                G.key === "Enter" ? (G.preventDefault(), te()) : G.key === "Escape" && (G.preventDefault(), x(e.title), I(!1));
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
                  onDoubleClick: (G) => {
                    G.preventDefault(), G.stopPropagation(), !(c || !a) && I(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ f("span", { className: "ws-node-group-count", children: D ? `${o}/${n}` : `${t} 个节点` }),
          r === "waiting" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待反馈" }) : r === "error" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: s > 0 ? `失败 ${s}` : "运行失败" }) : y ? /* @__PURE__ */ f(mt, { label: y, children: /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待前置" }) }) : n > 0 && o === n ? /* @__PURE__ */ L("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ f(qa, { size: 12 }),
            "已完成"
          ] }) : null,
          u ? /* @__PURE__ */ f(mt, { label: "编辑分镜结构", children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (G) => {
                G.preventDefault(), G.stopPropagation(), u();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ f(ku, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ f(mt, { label: T, children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: V,
              onClick: (G) => {
                G.preventDefault(), G.stopPropagation(), l?.();
              },
              "aria-label": "运行分组",
              children: D ? /* @__PURE__ */ f(Do, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(Ka, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        v
      ]
    }
  );
}
function Nl({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: o,
  className: s = "",
  style: r,
  onOpen: i,
  onOpenIntent: c,
  openOnContentClick: a = !1,
  resizeControls: u,
  children: l,
  customContentIsPureMedia: y = !1,
  followContent: v = !1,
  followKey: N
}) {
  const I = ne(null), R = ne(!0), x = lr(e, n), P = l != null, D = y || !P && !x && Il(n), T = !!i && (!P || y), V = [
    "ws-result-view",
    D ? "" : "nodrag",
    "nopan",
    "nowheel",
    D ? "has-pure-media" : "",
    s
  ].filter(Boolean).join(" ");
  return ue(() => {
    if (!v) {
      R.current = !0;
      return;
    }
    const F = I.current;
    F && R.current && (F.scrollTop = F.scrollHeight);
  }, [v, N]), /* @__PURE__ */ L(
    "div",
    {
      role: T ? "button" : void 0,
      tabIndex: T ? 0 : void 0,
      className: V,
      style: r,
      onPointerDown: (F) => {
        (!D || Ah(F)) && F.stopPropagation();
      },
      onClick: (F) => {
        F.stopPropagation(), !(!i || qs(F.target, F.currentTarget) || Mh(F)) && (F.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (F) => {
        F.stopPropagation(), !(!i || qs(F.target, F.currentTarget) || F.key !== "Enter" && F.key !== " ") && (F.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            ref: I,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (F) => {
              !a || !i || qs(F.target, F.currentTarget) || Cl(F, F.currentTarget) || (F.preventDefault(), F.stopPropagation(), i());
            },
            onScroll: (F) => {
              if (!v)
                return;
              const ge = F.currentTarget;
              R.current = ge.scrollHeight - ge.scrollTop - ge.clientHeight < 16;
            },
            children: P ? l : x ? /* @__PURE__ */ f(
              fr,
              {
                output: e,
                fallback: t,
                mediaGridKind: ps(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ f(xh, { preview: n, label: o ?? t })
          }
        ),
        u
      ]
    }
  );
}
function xh({
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
      ei,
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
        /* @__PURE__ */ f(Ga, { size: 16 }),
        /* @__PURE__ */ f("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ f(
    fr,
    {
      output: Th(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function Th(e) {
  return e ? { text: e } : void 0;
}
function Il(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function qs(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t && t.contains(n));
}
function Mh(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  return t ? Cl(e, t) : !1;
}
function Cl(e, t) {
  if (t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function Ah(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? im(n, e.clientY) : qs(t, e.currentTarget);
}
function Dh({
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
      children: /* @__PURE__ */ f(lg, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const ya = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!ya || Object.keys(ya).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const xd = ls(), Td = ls(), $s = ls(), Md = ls(), Ad = ls();
function He(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: Ph } = ya;
function Eh(...e) {
  for (const t of e) {
    const n = ko(t);
    if (n)
      return n;
  }
  return null;
}
function ri(...e) {
  for (const t of e) {
    const n = Sl(t);
    if (We(n))
      return n;
  }
  return "";
}
function Sl(e) {
  const t = ds(xd, e);
  return t !== us ? t : Io(
    xd,
    e,
    Oh(e)
  );
}
function Oh(e) {
  const t = Ve(e), n = gs(t);
  if (n !== t)
    return Sl(n);
  const o = Ph?.(t) ?? t, s = bo(o, /* @__PURE__ */ new Set());
  if (We(s))
    return s;
  if (o !== t) {
    const c = bo(t, /* @__PURE__ */ new Set());
    if (We(c))
      return c;
  }
  const r = gi(t);
  if (r)
    return aa?.(r) ?? r;
  const i = lc(e);
  return i !== t && We(i) ? i : "";
}
function bo(e, t) {
  const n = Ve(e), o = gs(n);
  if (o !== n)
    return bo(o, t);
  if (typeof n == "string") {
    const a = Rl(n);
    if (We(a))
      return a;
    const u = ms(n);
    return u ? { text: u } : eo(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((u) => bo(u, t)).filter(We);
    return a.length > 0 ? a : "";
  }
  if (!He(n))
    return n;
  if (Oo(n)) {
    const a = Al(n);
    if (a !== void 0)
      return bo(a, t);
    const u = Dl(n);
    if (u)
      return { text: u };
    const l = ko(n) || At(n);
    return l ? { rich: l } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), gc(n))
    return ha(n);
  if (kl(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const u = bo(n[a], t);
    if (We(u))
      return u;
  }
  const s = fc(n);
  if (s) {
    const a = { rich: s };
    return aa?.(a) ?? a;
  }
  const r = At(n);
  if (r)
    return { rich: r };
  const i = gi(n);
  if (i)
    return aa?.(i) ?? i;
  const c = Pt(n);
  if (c !== n)
    return bo(c, t);
  if (Fh(n))
    return ha(n);
  if (wi(n)) {
    const a = Fe(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return yi(n) ? n : "";
}
function Fh(e) {
  return !!(He(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function ha(e) {
  const t = {}, n = Ve(e.content);
  He(n) && Pd(t, n), Pd(t, e);
  const o = Bh(e);
  return o && (t.text = o), !We(t) && n && typeof n == "object" ? n : yi(t) ? t : "";
}
function Bh(e) {
  const t = Fe(e.text);
  if (t)
    return t;
  const n = Ve(e.content);
  return typeof n == "string" ? n.trim() : He(n) ? Fe(n.text) : "";
}
function lc(e) {
  const t = gs(e);
  if (t !== e)
    return lc(t);
  const n = gi(e);
  if (n)
    return n;
  const o = Rl(e);
  if (We(o))
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
function gi(e) {
  const t = ko(e);
  return t ? { rich: t } : null;
}
function ko(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e), o = gs(n);
  if (o !== n)
    return ko(o, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = ko(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!He(n) || t.has(n))
    return null;
  if (t.add(n), Oo(n))
    return _l(n, t) || n;
  const s = n, r = [
    Qe(s, ["output", "content", "rich"]),
    Qe(s, ["output", "rich"]),
    Qe(s, ["content", "rich"]),
    s.content,
    s.rich,
    s.text,
    s.summary
  ];
  for (const i of r) {
    if (i === n)
      continue;
    const c = ko(i, t);
    if (c)
      return c;
  }
  return null;
}
function _l(e, t) {
  const n = si(e);
  for (const o of n) {
    const s = Dd(o, t);
    if (s)
      return s;
  }
  return Dd(n.join(""), t);
}
function Dd(e, t) {
  const n = String(e || "").trim();
  if (!eo(n))
    return null;
  const o = pu(n);
  return o === n || o === e ? null : ko(o, t);
}
function zh(e) {
  return si(e).join("");
}
function si(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((o) => si(o, t));
  if (!He(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...si(e.content, t)), n;
}
function Rl(e) {
  const t = Gt(e);
  if (t)
    return { rich: t };
  const n = Ve(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const o = ms(n);
    return o ? { text: o } : "";
  }
  return "";
}
function Gt(e, t = /* @__PURE__ */ new Set()) {
  const n = Ve(e);
  if (Oo(n))
    return _l(n, t) || n;
  if (Array.isArray(n))
    return At(mc(n));
  if (!He(n) || t.has(n))
    return null;
  t.add(n);
  const o = n, s = fc(o);
  if (s)
    return s;
  const r = [
    Qe(o, ["output", "content", "rich"]),
    Qe(o, ["output", "content"]),
    Qe(o, ["output", "rich"]),
    Qe(o, ["content", "output", "content", "rich"]),
    Qe(o, ["content", "output", "content"]),
    Qe(o, ["content", "rich"]),
    Qe(o, ["data", "output", "content", "rich"]),
    Qe(o, ["data", "output", "content"]),
    Qe(o, ["data", "content", "rich"]),
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
    const c = Gt(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(o)) {
    if (!Pl(i) || !c || typeof c != "object")
      continue;
    const a = Gt(c, t);
    if (a)
      return a;
  }
  return null;
}
function fc(e) {
  if (Oo(e))
    return e;
  const t = He(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), o = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? At({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || o === "rich_json") && e.rich != null ? Gt(e.rich) : (n === "rich_json" || o === "rich_json") && t?.rich != null ? Gt(t.rich) : null;
}
function Oo(e) {
  return !!(He(e) && e.type === "doc" && Array.isArray(e.content));
}
function Pd(e, t) {
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
    We(t[n]) && (e[n] = n === "rich" ? Uh(t[n]) : t[n]);
}
function Uh(e) {
  return Gt(e) || At(mc(e)) || At(e) || e;
}
function yi(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : We(n));
}
function kl(e) {
  return !He(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => We(e[t]));
}
function We(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !eo(t) && !Kt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(We) : He(e) ? Gt(e) ? !0 : wi(e) ? !1 : yi(e) : !1;
}
function pc(e) {
  return jt(
    xn(e),
    e.description || e.title
  );
}
function Lh(e) {
  const t = [
    xn(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const o = Gt(n) || At(lc(n)) || At(Pt(n)) || At(n);
    if (o)
      return o;
  }
  return null;
}
function jt(e, t = "") {
  const n = ds(Md, e), o = n !== us ? n : Io(
    Md,
    e,
    $h(e)
  );
  if (o !== null) return o;
  const s = String(t || "").trim();
  if (Kt(s))
    return "";
  const r = ms(s);
  if (r)
    return r;
  if (!eo(s))
    return s;
  const i = So(
    Pt(Ve(s))
  ).trim();
  return i && i !== s && !Kt(i) ? i : "";
}
function $h(e) {
  const t = Pt(e), n = At(t), o = n ? So(n).trim() : "";
  if (o && !Kt(o))
    return o;
  const s = So(t).trim();
  if (Kt(s))
    return "";
  const r = ms(s);
  if (r)
    return r;
  if (s && !eo(s))
    return s;
  if (yc(s)) {
    const i = So(
      Pt(Ve(s))
    ).trim();
    if (i && i !== s && !Kt(i))
      return i;
  }
  return null;
}
function Kt(e) {
  const t = e.trim();
  return t ? Vh(t) || jh(t) : !1;
}
function Vh(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function jh(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function Qn(e, t) {
  const n = ds(Ad, e), o = n === us ? /* @__PURE__ */ new Map() : n, s = o.get(t);
  if (s) return { ...s };
  const r = Kh(e, t);
  return o.set(t, r), Io(Ad, e, o), { ...r };
}
function Kh(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, o = Pt(e);
  return as(n, o, t), !Zn(n) && o !== e && as(n, e, t), Hr(n) && eo(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Bp(e, "video").find(
    (s) => s.url === n.videoUrl
  )?.thumbnail), n;
}
function qh(e, t) {
  return {
    text: Fe(e.text, t.text),
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
    Ed(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const u of t)
      if (as(e, u, n, o, s + 1), Hr(e))
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
  const r = t, i = Gh(e, r, n), c = jt(t, "");
  c && c !== i && !kn(c) && (e.text ||= c);
  const a = cr(r.url, r.src, r.href);
  if (a && a !== i && Ed(e, a, n), e.imageUrl ||= cr(
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
    for (const u of ["output", "result", "content", "body", "data", "rich"])
      if (r[u] && typeof r[u] == "object" && (as(e, r[u], n, o, s + 1), Hr(e)))
        return;
  }
  if (!e.text && !Zn(e) && !Qh(r) && yi(r))
    try {
      const u = JSON.stringify(t, null, 2);
      hr(u) || (e.text = u);
    } catch {
      const u = String(t);
      hr(u) || (e.text = u);
    }
}
function Gh(e, t, n) {
  const o = xl(
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
  const s = cr(...Hh(t, o));
  return s ? (o === "image" && (e.imageUrl ||= s), o === "video" && (e.videoUrl ||= s), o === "audio" && (e.audioUrl ||= s), o === "file" && (e.fileUrl ||= s), s) : "";
}
function Wh(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return xl(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function xl(...e) {
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
function Hh(e, t) {
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
    Qe(e, ["attrs", "src"]),
    Qe(e, ["attrs", "url"]),
    Qe(e, ["attrs", "href"])
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
function Ed(e, t, n) {
  const o = t.trim();
  if (!o || Kt(o))
    return;
  if (yc(o)) {
    const c = Ve(o);
    if (c !== o && (as(e, c, n), Hr(e)))
      return;
    const a = jt(c, "");
    a && !kn(a) && (e.text ||= a);
    return;
  }
  const s = ms(o);
  if (s) {
    e.text ||= s;
    return;
  }
  const r = So(o);
  if (r && r !== o) {
    e.text ||= r;
    return;
  }
  const i = Yh(o, n);
  if (i) {
    Xh(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (kn(o)) {
    const c = hi(n);
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
function Yh(e, t) {
  const n = Tl(e, t), o = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (o) {
    const u = Yi(o[2]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: Vs(e, o[0], o[1])
      };
  }
  const s = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (s) {
    const u = Yi(s[1]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: Vs(e, s[0], "")
      };
  }
  const r = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = r.exec(e); ) {
    const u = Yi(i[2]), l = Od(u, n);
    if (l)
      return {
        kind: l,
        url: u,
        caption: Vs(e, i[0], i[1])
      };
  }
  const c = Zh(e), a = Od(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: Vs(e, c, "")
  } : null;
}
function Tl(e, t) {
  return hi(t) ? t : Jh(e) ? "image" : t;
}
function Jh(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Xh(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Od(e, t) {
  if (!e || !kn(e))
    return "";
  const n = hi(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function Vs(e, t, n) {
  const o = e.replace(t, "").replace(/\s+/g, " ").trim();
  return o && o !== e.trim() && !kn(o) ? o : String(n || "").trim();
}
function Yi(e) {
  const t = Ml(e);
  return kn(t) ? t : "";
}
function Zh(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? Ml(t[0]) : "";
}
function Ml(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Qh(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function Zn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !hr(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Hr(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function ew(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (He(t)) {
      const n = Fe(
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
        Qe(t, ["attrs", "src"]),
        Qe(t, ["attrs", "url"]),
        Qe(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function cr(...e) {
  const t = ew(...e);
  return kn(t) ? t : "";
}
function pt(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function kn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function xn(e) {
  return tw(
    Fp(e.asset?.version?.content, e.resultOutput)
  );
}
function tw(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const o = ds($s, n);
    if (o !== us) return o;
    const s = Al(n);
    if (s !== void 0)
      return Io($s, n, s);
    const r = Dl(n);
    if (r)
      return Io($s, n, {
        text: r
      });
    const i = ri(n) || Pt(n);
    if (We(i) || hc(i))
      return Io($s, n, i);
  }
  if (t !== void 0)
    return ri(t) || Pt(t);
}
function Al(e) {
  const t = Ve(e), n = Oo(t) ? t : Gt(t);
  if (!n)
    return;
  const o = zh(n).trim();
  if (!eo(o))
    return;
  const s = pu(o);
  if (s === o)
    return;
  const r = Pt(s);
  if (We(r) || hc(r))
    return r;
}
function Dl(e) {
  const t = Ve(e), n = Oo(t) ? t : Gt(t);
  return zp(n);
}
function Pt(e) {
  const t = ds(Td, e);
  return t !== us ? t : Io(
    Td,
    e,
    nw(e)
  );
}
function nw(e) {
  const t = Ve(e), n = gs(t);
  if (n !== t)
    return Pt(n);
  if (kl(t))
    return t;
  if (He(t) && gc(t)) {
    const r = ha(t);
    if (We(r))
      return r;
  }
  const o = gi(t);
  if (o)
    return o.rich;
  if (Oo(t))
    return t;
  const s = Gt(t);
  return s || mc(ii(t, /* @__PURE__ */ new Set()));
}
function ii(e, t) {
  if (!He(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, o = El(n);
  if (o !== void 0)
    return o;
  const s = ow(n, t);
  if (s !== void 0)
    return s;
  for (const r of rw) {
    const i = Qe(n, r);
    if (i === void 0 || i === e)
      continue;
    const c = ii(
      Ve(i),
      t
    );
    if (wa(c))
      return c;
  }
  if (wi(n))
    for (const r of ["output", "result", "data", "body"]) {
      if (n[r] === void 0 || n[r] === e)
        continue;
      const i = ii(
        Ve(n[r]),
        t
      );
      if (wa(i))
        return i;
    }
  return e;
}
function ow(e, t) {
  for (const [n, o] of Object.entries(e)) {
    if (!Pl(n) || !o || typeof o != "object")
      continue;
    const s = ii(Ve(o), t);
    if (wa(s))
      return s;
  }
}
function Pl(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const rw = [
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
function El(e) {
  const t = fc(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Ve(e.content);
    if (He(n)) {
      const o = El(n);
      if (o !== void 0)
        return o;
    }
  }
}
function mc(e) {
  const t = Ve(e);
  return He(t) && !t.type && Array.isArray(t.content) ? {
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
function wa(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !eo(n) && !Kt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!He(e) || Gt(e) || At(e))
    return !0;
  if (wi(e))
    return !1;
  const t = So(e).trim();
  return !!(t && !hr(t));
}
function Qe(e, t) {
  let n = e;
  for (const o of t) {
    if (!He(n) || !(o in n))
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
    const o = sw(t, n);
    if (o !== void 0)
      return o;
  }
  return e;
}
function sw(e, t) {
  const n = `\`\`\`${t}`, o = e.toLowerCase().indexOf(n);
  if (o < 0)
    return;
  let s = o + n.length;
  for (; s < e.length && /\s/.test(e[s] || ""); )
    s += 1;
  let r = s;
  for (; r < e.length; ) {
    const i = e.indexOf("```", r), c = i >= 0 ? e.slice(s, i) : e.slice(s), a = iw(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    r = i + 3;
  }
}
function iw(e, t = !1) {
  const n = e.trim(), o = Up(n);
  for (const s of Lp([n, o])) {
    const r = Ve(s);
    if (r !== s && (t ? aw(r) : gc(r)))
      return r;
  }
  return null;
}
function aw(e) {
  if (!He(e))
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
function gc(e) {
  if (!He(e))
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
  ].some((n) => We(e[n]));
}
function yc(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function eo(e) {
  const t = String(e || "").trim();
  return !!(t && (yc(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function Ol(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return Kt(e) ? "" : e;
  const t = So(e).trim();
  if (t && Kt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return hr(n) ? "" : n;
  } catch {
    const n = String(e);
    return Kt(n) ? "" : n;
  }
}
function hc(e) {
  const t = Ol(e).trim();
  return !!(t && !hr(t));
}
function hr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || Kt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const va = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!va || Object.keys(va).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const cw = va.useTheme;
function Po(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function ai(e) {
  return Po(e) ? e : {};
}
function Oe(e, ...t) {
  let n = e;
  for (const o of t) {
    if (!Po(n))
      return;
    n = n[o];
  }
  return n;
}
const dw = {}, Gs = [], uw = [], Fd = [], lw = 800;
function fw(e) {
  const t = ne(/* @__PURE__ */ new Map()), n = ne(0), o = O(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
    const r = t.current;
    t.current = /* @__PURE__ */ new Map(), r.size !== 0 && e((i) => Rh(i, r));
  }, [e]), s = O(
    (r, i) => {
      _h(t.current, r, i), !n.current && (n.current = window.setTimeout(() => {
        n.current = 0, o();
      }, Fw));
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
function Bd(e, t) {
  let n = null;
  for (const o of t)
    Object.prototype.hasOwnProperty.call(e, o) && (n ||= { ...e }, delete n[o]);
  return n || e;
}
function Fl(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const o of t)
    if (n.add(o.id), o.type === "group")
      for (const s of yp(e, o.id))
        n.add(s.id);
  return n;
}
function pw(e) {
  return Object.values(e).some($t);
}
function mw(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function gw(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function yw(e, t, n) {
  const o = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((s) => {
    const r = Ma(s), i = s.x + r.width, c = s.y + r.height;
    return s.type === "group" ? o.left <= s.x && o.top <= s.y && o.right >= i && o.bottom >= c : o.left <= i && o.right >= s.x && o.top <= c && o.bottom >= s.y;
  }).map((s) => s.id);
}
function hw(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const ww = {
  workSpace: Va(gb, df)
}, wc = Gm(!1), vw = Va(cf, df), bw = {
  animated: gh
}, Nw = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, Iw = [18, 18], Cw = ["Control", "Meta"], Sw = {
  type: "animated",
  animated: !1
}, _w = { padding: 0.32, maxZoom: 0.72 };
function Le(e) {
  const t = ne(e);
  return ns(() => {
    t.current = e;
  }, [e]), se(() => Gy(t), []);
}
function Wb({
  onInitialLoadComplete: e
}) {
  const t = jf(), [n, o] = K(""), s = Cg(), r = se(() => _b(), []), i = se(() => Rb(), []), c = se(() => new Ty(), []), [a, u] = K(null), [l, y] = K(i), v = ne(i), [N, I] = K(0), R = ne(0), [x, P] = K(null), D = ne(null), [T, V] = K([]), te = T[T.length - 1] || "", [G, re] = K({}), F = ne(G), [ge, $] = K(!1), [q, z] = K([]), [Q, me] = K(!1), ye = ne(0), [ve, fe] = K("create"), [he, Be] = K(
    () => kb(r)
  ), [ce, ze] = K(!1), [be, Et] = K(
    () => xb()
  ), { resolvedTheme: st, setTheme: to } = cw();
  Sg(s.site.appearance, st);
  const [pe, Ye] = K(null), [de, it] = K(null), [Te, Tn] = K(null), [no, wt] = K(!0), Bo = ne(!0), [Ce, zo] = K({}), Mn = ne(Ce);
  Mn.current = Ce;
  const Uo = ne(/* @__PURE__ */ new Set()), Lo = fw(zo), [mn, en] = K({}), [at, ct] = K(null), [ys, _t] = K(null), tn = at?.id || "", nn = ys?.id || "", dt = se(
    () => [tn, nn],
    [tn, nn]
  ), $e = O(
    (d) => {
      ct(d), _t(d);
    },
    []
  ), [gn, on] = K(null), [$o, hs] = K(!1), je = ne(/* @__PURE__ */ new Set()), [An, Dn] = K(null), [ws, Vo] = K(), [Pn, jo] = K(), [Ko, oo] = K(
    null
  ), [rn, En] = K(null), [vs, Wt] = K(!1), [sn, Ht] = K(""), [Yt, ro] = K(null), [so, yn] = K(""), [ut, Ue] = K([]), [gt, io] = K([]), [tt, On] = K(!1), [Nr, ao] = K(""), [qo, Fn] = K(!1), [_e, Bn] = K(1), [bs, ae] = K(!1), [hn, yt] = K(() => /* @__PURE__ */ new Set()), [Ns, Ot] = K(!1), [vt, Ft] = K(null), [zn, wn] = K(!1), Re = ne(null), co = ne(!1), Bt = ne(/* @__PURE__ */ new Set()), uo = ne(/* @__PURE__ */ new Set()), zt = ne(/* @__PURE__ */ new Set()), Je = ne([]), Ir = ne(/* @__PURE__ */ new Set()), Ut = ne(null), Rt = ne(new AbortController()), Cr = ne(new AbortController()), an = ne(Ry());
  ns(() => {
    const d = new AbortController();
    return Cr.current = d, () => d.abort();
  }, [l]), ue(() => {
    Rt.current.signal.aborted && (Rt.current = new AbortController());
    const d = Rt.current, p = an.current;
    return () => {
      d.abort(), p.clear();
    };
  }, []);
  const Jt = ne([0]), lo = ne(null), Un = ne(/* @__PURE__ */ new Map()), Go = ne(
    /* @__PURE__ */ new Map()
  ), Wo = ne(/* @__PURE__ */ new Set()), [
    Is,
    Ho
  ] = K(() => /* @__PURE__ */ new Set()), [
    Yo,
    fo
  ] = K({}), [Ln, Sr] = K({}), lt = ne(null), {
    roles: Jo,
    powers: Me,
    powerCategories: Cs,
    loaded: kt,
    load: Xt
  } = Ch({
    space: a,
    canvases: G,
    cache: c,
    onError: o
  });
  ue(() => {
    fo({});
  }, [a?.project.id, a?.project.release_id, a?.release?.id]), ue(() => {
    F.current = G;
  }, [G]), ue(() => {
    R.current = N;
  }, [N]), ue(() => {
    v.current = l;
  }, [l]), ue(() => {
    Je.current = ut;
  }, [ut]);
  const cn = O(
    (d, p) => {
      if (d = d.trim(), !d)
        return;
      const g = Wo.current;
      if (g.has(d) === p)
        return;
      const b = new Set(g);
      p ? b.add(d) : b.delete(d), Wo.current = b, Ho(b);
    },
    []
  ), bt = O(
    (d) => {
      const p = Gl(d);
      if (!p)
        return;
      const g = String(p.request_id || "").trim();
      g && cn(g, Sn(p));
      const b = Xi(
        Je.current,
        [p]
      );
      Je.current = b, Ue(b);
    },
    [cn]
  ), dn = O(
    (d) => {
      const p = String(d?.request_id || "").trim();
      p && cn(p, !1);
    },
    [cn]
  ), _r = O((d) => {
    o(d instanceof Error ? d.message : "保存画布失败");
  }, []), {
    markCanvasDirty: $n,
    flushCanvasSave: xt,
    flushPendingCanvasSaves: Rr,
    hasPendingCanvasSaves: Vn,
    adoptCanvasSnapshot: nt,
    forgetCanvasSnapshot: Ii,
    resetCanvasAutosave: Ss,
    canvasSaveStatus: kr
  } = _y({
    projectId: r,
    enabled: !!a,
    canvases: G,
    setCanvases: re,
    onError: _r
  }), Nt = Le(
    Ai
  ), Xo = Le(
    pf
  );
  ue(() => {
    if (zt.current.size === 0)
      return;
    const d = [...zt.current];
    zt.current.clear();
    for (const p of d)
      $n(p);
  }, [G, $n]);
  const xr = O(async () => {
    if (!r) {
      yn("缺少作品 ID"), wt(!1);
      return;
    }
    wt(!0), yn("");
    try {
      const d = await Wf(
        r,
        v.current,
        R.current
      ), p = Av(
        d.canvases || {},
        d.assets || []
      ), g = Number(d.initialCanvasId || 0) || Number(Object.values(p)[0]?.id || 0), b = Number(d.initialAssetCateId || 0) || Hf(d);
      u(d), F.current = p, re(p), Ss(p), v.current = g, y(g), R.current = b, I(b), sr(g), P(null), D.current = null, ye.current += 1, $(!1), z([]), me(!1), Bt.current = /* @__PURE__ */ new Set(), uo.current = /* @__PURE__ */ new Set(), Je.current = [], Ue([]), Wo.current = /* @__PURE__ */ new Set(), Ho(/* @__PURE__ */ new Set()), Ut.current = null, On(!1), io([]), Bn(1), ae(!1), Jt.current = [0], Nt(r, d, p, "recovery", {
        canvasId: g
      });
    } catch (d) {
      yn(d instanceof Error ? d.message : "加载创作空间失败");
    } finally {
      wt(!1);
    }
  }, [Nt, r, Ss]);
  ue(() => {
    const d = (p) => {
      !Vn() && zt.current.size === 0 || (p.preventDefault(), p.returnValue = "");
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [Vn]);
  async function _s(d) {
    if (xe(R.current))
      try {
        for (const p of zt.current)
          $n(p);
        zt.current.clear(), await Rr(), await d();
      } catch (p) {
        _r(p);
      } finally {
        Ze();
      }
  }
  const Tr = O((d) => {
    oo(d);
  }, []);
  ue(() => {
    xr();
  }, [xr]), ue(() => {
    no || !Bo.current || (Bo.current = !1, e());
  }, [no, e]);
  const Lt = a?.assetCates, Rs = se(() => a ? Yf(a) : [], [a]), ks = Rs.length > 1, W = se(
    () => a ? Oi(a, N) : null,
    [N, a]
  ), Ci = se(
    () => a && W ? Jf(a, W.id) : [],
    [W, a]
  ), Mr = se(() => Jo.filter(Xf), [Jo]), Ar = se(() => Me.filter(Zf), [Me]), H = se(() => {
    const d = a?.canvasList.find(
      (p) => p.id === l
    );
    return G[String(l)] || qc(
      d?.assetCateId || W?.id || 0,
      l,
      d?.name || "第一幕"
    );
  }, [l, W?.id, G, a?.canvasList]), un = se(
    () => (a?.canvasList || []).filter((d) => d.assetCateId === W?.id).sort((d, p) => d.sort - p.sort || d.id - p.id),
    [W?.id, a?.canvasList]
  ), Dr = O(
    async (d) => {
      const p = ye.current + 1;
      ye.current = p, me(!0);
      try {
        const g = await Qf({
          projectId: r,
          assetCateId: d
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
  ), Si = O(() => {
    W && ($(!0), z([]), Dr(W.id));
  }, [W, Dr]), we = se(
    () => zd(H, mn),
    [H, mn]
  ), _i = se(() => {
    const d = new Set(T);
    return we.nodes.filter((p) => d.has(p.id));
  }, [we.nodes, T]), Ri = O(
    async (d) => {
      const p = String(d), g = Rt.current.signal;
      g.throwIfAborted();
      const b = F.current[p], h = () => zt.current.has(d) || Vn(d);
      if (h())
        throw new Error("画布有未保存的修改，请保存后重新采用助手结果");
      const C = await Lr({
        projectId: r,
        canvasId: d
      });
      if (g.throwIfAborted(), h() || F.current[p] !== b)
        throw new Error("加载期间画布已修改，已保留本地草稿，请重新采用助手结果");
      const _ = dr(
        nr(C.canvas, Me),
        C.assets
      );
      u(
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
      F.current = S, re(S), nt(_);
    },
    [nt, Vn, Me, r]
  ), ki = O((d) => {
    const p = iu(d);
    Et(p), Xd(
      au,
      String(p)
    );
  }, []), Ne = O(
    (d) => {
      Be(d), d || ze(!1), Xd(
        `${su}:${r}`,
        d ? "1" : "0"
      );
    },
    [r]
  ), jn = Co, po = ne([]), mo = se(() => {
    const d = cm(
      {
        nodes: we.nodes,
        assets: a?.assets || [],
        canvasId: H.id,
        assetCateId: W?.id || 0,
        nodeOutput: xn,
        nodePreview: Fo,
        assetPreview: (p) => {
          const g = p.version?.content ?? p.name, b = Qn(
            g,
            String(p.kind || "")
          );
          return Zn(b) || (b.text = p.name), b;
        },
        nodeHasResult: Dt
      },
      po.current
    );
    return po.current = d, d;
  }, [H.id, W?.id, we.nodes, a?.assets]), go = ne([]), vn = se(() => {
    const d = dm(
      mo,
      go.current
    );
    return go.current = d, d;
  }, [mo]), It = Number(a?.release?.id || a?.project.release_id || 0);
  ue(() => {
    if (!pe?.connection || !W || !kt) return;
    const d = pe, p = pe.connection;
    if (d.canvasId !== we.id) return;
    const g = p.handleType === "target";
    if (!we.nodes.find((S) => S.id === p.nodeId)) return;
    const h = [
      ...Ar.map((S) => pn("power", W, we.nodes.length, d.position, { power: S })),
      ...Mr.map((S) => pn("agent", W, we.nodes.length, d.position, { role: S })),
      ...Wp.filter((S) => g ? S.key === "start" : S.key === "save" || S.key === "display").map(
        (S) => pn("function", W, we.nodes.length, d.position, { functionOption: S })
      )
    ];
    let C = !1;
    async function _() {
      const S = [];
      let E;
      for (let j = 0; j < h.length && !C; j += 6) {
        const ee = await Promise.all(h.slice(j, j + 6).map(async (Y) => {
          const J = Kd(we, p, Y, vn);
          let ie, le = mr(J);
          if (le.kind === "form" && J.target) {
            try {
              ie = (await sl(c, r, It, J.target)).params;
            } catch (Ae) {
              return E ||= Gr(Ae, "部分能力的参数读取失败"), null;
            }
            le = mr({ ...J, params: ie });
          }
          return le.kind === "invalid" || le.kind === "form" ? null : {
            node: Y,
            params: ie,
            targetModelId: J.target?.composerDraft?.selectedTargetId,
            description: le.kind === "direct" ? le.description : le.kind === "media" ? "接收媒体素材" : "接收文本"
          };
        }));
        for (const Y of ee) Y && S.push(Y);
      }
      C || it({ menu: d, candidates: S, warning: E });
    }
    return _(), () => {
      C = !0;
    };
  }, [W, we, vn, c, It, Ar, Mr, pe, kt, r]);
  const Zo = O(
    (d = "") => {
      nd(), Ht(d), Re.current = H.nodes.find((p) => p.id === d) || (Re.current?.id === d ? Re.current : null), Ye(null), fe("create"), Wt(!0);
    },
    [H.nodes]
  ), Ct = O(
    (d, p) => {
      if (!Number.isInteger(d) || d <= 0)
        return;
      const g = (C) => {
        const _ = String(d), S = C[_];
        if (!S) return C;
        const E = Mv(
          p(S),
          S.assetCateId
        );
        return Ev(S, E) ? C : (zt.current.add(d), {
          ...C,
          [_]: E
        });
      }, b = F.current, h = g(b);
      F.current = h, re((C) => {
        const _ = C === b ? h : g(C);
        return F.current = _, _;
      });
    },
    []
  ), St = O(
    (d) => {
      W && Ct(H.id, d);
    },
    [H.id, W, Ct]
  ), ln = O(
    (d, p, g) => {
      const h = F.current[String(d)]?.nodes.find(
        (_) => _.id === p
      );
      if (Gc(h, g) || g.sizeMode === "auto" && (!h || !Oa(h)))
        return !1;
      const C = ny(
        yd(h, g),
        kt && !!Lt
      );
      return C === "defer-materialize" && (fo((_) => ({
        ..._,
        [`${d}:${p}`]: { canvasId: d, nodeId: p }
      })), kt || Xt()), v.current === d && en(
        (_) => Dw(_, p, g)
      ), Ct(d, (_) => {
        const S = _.assetCateId, E = {
          ..._,
          nodes: _.nodes.map(
            (Y) => Y.id === p ? { ...Y, ...g } : Y
          )
        };
        if (!Lt)
          return E;
        const j = {
          canvas: E,
          assetCate: Fi(Lt, S),
          powers: Me
        };
        if (C === "materialize")
          return gd({
            ...j,
            sourceNodeId: p
          });
        if (C === "defer-materialize")
          return E;
        const ee = wh(
          E.nodes,
          p
        );
        return ee.length ? Ki({
          ...j,
          sourceNodeIds: ee,
          previousNodes: _.nodes
        }) : E;
      }), !0;
    },
    [
      Lt,
      Xt,
      kt,
      Me,
      Ct
    ]
  );
  ue(() => {
    if (!kt || !Lt)
      return;
    const d = new Map(Object.entries(Yo));
    for (const p of Object.values(G))
      for (const g of p.nodes)
        g.outputType === "setting" && yd(g, {}) && d.set(`${p.id}:${g.id}`, { canvasId: p.id, nodeId: g.id });
    if (d.size !== 0) {
      Object.keys(Yo).length > 0 && fo({});
      for (const { canvasId: p, nodeId: g } of d.values())
        Ct(
          p,
          (b) => gd({
            canvas: b,
            assetCate: Fi(Lt, b.assetCateId),
            powers: Me,
            sourceNodeId: g
          })
        );
    }
  }, [
    G,
    Lt,
    Yo,
    kt,
    Me,
    Ct
  ]);
  const xi = O(
    (d, p) => {
      const g = v.current;
      Sr((b) => ({
        ...b,
        [`${g}:${d}`]: { canvasId: g, nodeId: d, unitIds: p }
      })), kt || Xt();
    },
    [Xt, kt]
  );
  ue(() => {
    if (!kt || !Lt || Object.keys(Ln).length === 0)
      return;
    const d = Object.values(Ln);
    Sr({});
    for (const { canvasId: p, nodeId: g, unitIds: b } of d)
      try {
        Ct(p, (h) => {
          const C = {
            canvas: h,
            storyNodeId: g,
            assetCate: Fi(Lt, h.assetCateId),
            powers: Me
          };
          return Iy({ ...C, unitIds: b });
        });
      } catch (h) {
        o(Gr(h, "创建章节分镜失败"));
      }
  }, [
    Lt,
    Ln,
    kt,
    Me,
    Ct
  ]);
  const et = O(
    (d, p) => {
      ln(H.id, d, p) && v.current === H.id && $e(
        (g) => g?.id === d && !Gc(g, p) ? { ...g, ...p } : g
      );
    },
    [H.id, ln, $e]
  ), Pr = O(
    (d, p, g) => {
      if (!mv(p, g))
        return;
      const b = Number(g.version_id || 0), h = `${d}:${p.id}:${b}`;
      if (Bt.current.has(h))
        return;
      Bt.current.add(h);
      const C = p.title.trim(), _ = F.current[String(d)];
      ep({
        projectId: r,
        nodeKey: p.id,
        versionId: b,
        prompt: pv(p, _)
      }).then((S) => {
        const E = S.title.trim();
        !E || E === C || S.versionId !== b || Ct(d, (j) => {
          const ee = j.nodes.find(
            (Y) => Y.id === p.id
          );
          return !ee || ee.titleMode !== "auto" || ee.title.trim() !== C || !nu(ee) ? j : {
            ...j,
            nodes: j.nodes.map(
              (Y) => Y.id === p.id ? { ...Y, title: E } : Y
            )
          };
        });
      }).catch(() => {
        Bt.current.delete(h);
      });
    },
    [r, Ct]
  ), Kn = O(
    async (d) => {
      d.canvasId && $n(d.canvasId);
    },
    [$n]
  ), xs = O(
    (d, p, g) => {
      const b = {};
      St((h) => {
        const C = h.nodes.map(
          (_) => _.id === d ? {
            ..._,
            composerDraft: tp(p)
          } : _
        );
        return b.canvas = { ...h, nodes: C }, b.canvas;
      }), g?.save === "immediate" && b.canvas && xt(b.canvas).catch(() => {
      });
    },
    [xt, St]
  ), Ts = O(
    (d) => {
      St((p) => {
        const g = p.edges.filter((b) => b.id !== d);
        return g.length === p.edges.length ? p : { ...p, edges: g };
      });
    },
    [St]
  ), Er = Le(
    (d, p, g) => {
      if (Fa(d.power, d.kind, d.outputType) && !Lm(
        Qr(d, d.resultOutput)?.document
      ))
        return;
      const b = !!(at && at.id !== d.id && Eo(
        at.power,
        at.kind,
        at.outputType
      )), h = Pv(d);
      if (_t(null), h) {
        Cm(), b || (ct(null), Vo(void 0), jo(void 0)), Dn(h);
        return;
      }
      if (ts(), Dn(null), b) {
        _t(d);
        return;
      }
      Vo(p), jo(g), ct(d);
    }
  ), Ms = (d) => {
    _t(null), !d && (Dn(null), ct(null), Vo(void 0), jo(void 0));
  }, Ti = O((d) => {
    $e(
      (p) => p?.id === d.id && p !== d ? d : p
    );
  }, [$e]), As = Le(
    (d, p, g) => {
      const b = H.id, h = we.nodes.find((ee) => ee.id === d), C = g ?? h?.asset, _ = C?.version, S = Vt(_?.content), E = S ?? (h && Vt(Ws(h)));
      if (h && E?.screenplay && !E.shots.length) {
        const ee = b + ":" + d;
        if (je.current.has(ee)) return;
        je.current.add(ee), (async () => {
          v.current === b && await Ie(h);
        })().catch((Y) => o(Gr(Y, "剧本生成分镜失败"))).finally(() => je.current.delete(ee));
        return;
      }
      const j = _?.updated_at || _?.created_at;
      if (!S || !C?.id || !_?.id || _.id !== C.version_id || !j) {
        o("未读取到已保存的分镜版本，请刷新后再确认");
        return;
      }
      o(""), on({
        canvasId: b,
        nodeId: d,
        assetId: C.id,
        versionId: _.id,
        expectedUpdatedAt: j,
        document: S,
        onConfirmed: p
      });
    }
  ), qn = gn?.canvasId === H.id ? gn : null;
  async function Mi(d) {
    if ($o || !qn)
      return !1;
    const { canvasId: p, nodeId: g, assetId: b, versionId: h, expectedUpdatedAt: C, onConfirmed: _ } = qn;
    hs(!0);
    try {
      const S = await lp({
        projectId: r,
        assetId: b,
        versionId: h,
        expectedUpdatedAt: C,
        productionPlan: d
      });
      return m(p, g, S), _?.(S), on((E) => E === qn ? null : E), !0;
    } catch (S) {
      return o(Gr(S, "确认分镜失败")), !1;
    } finally {
      hs(!1);
    }
  }
  const Qo = O(
    (d, p) => {
      en((g) => {
        const b = H.nodes.find(
          (_) => _.id === d
        );
        if (!b)
          return g;
        const h = g[d] || {}, C = {
          ...b,
          ...h
        };
        return {
          ...g,
          [d]: {
            ...h,
            feedbackRequests: p(Ro(C))
          }
        };
      });
    },
    [H.nodes]
  ), yo = O((d) => {
    const p = new Set(d.filter(Boolean));
    if (p.size !== 0) {
      if (lt.current && p.has(lt.current.nodeId)) {
        const g = lt.current;
        lt.current = null, g.reject(new Error(gl));
      }
      Ft(
        (g) => g && p.has(g.node.id) ? null : g
      ), en((g) => {
        const b = { ...g };
        let h = !1;
        for (const C of p) {
          const _ = b[C] || {};
          b[C] = {
            ..._,
            feedbackRequests: []
          }, h = !0;
        }
        return h ? b : g;
      });
    }
  }, []), Xe = O((d) => {
    !d || !d.id || u((p) => p && {
      ...p,
      assets: or(p.assets, [d])
    });
  }, []), Or = O(
    (d, p) => {
      const g = ca(
        p,
        d.asset
      );
      Xe(g);
      const b = ur(d, g);
      d.id.startsWith("asset-detail-") || et(d.id, b), $e(
        (h) => h?.id === d.id ? { ...h, ...b } : h
      );
    },
    [et, Xe, $e]
  ), m = O(
    (d, p, g) => {
      const b = F.current[String(d)]?.nodes.find((h) => h.id === p);
      b && (v.current === d ? Or(b, g) : (Xe(g), ln(d, p, ur(b, g))));
    },
    [Or, ln, Xe]
  ), w = O(
    (d) => {
      if (!An)
        return;
      const p = H.nodes.find(
        (h) => h.id === An.nodeId
      );
      if (!p)
        return;
      const g = qr(d), b = ur(
        p,
        g
      );
      Xe(g), et(p.id, b);
    },
    [
      H.nodes,
      An,
      et,
      Xe
    ]
  ), k = O(
    ({ node: d, prompt: p }) => {
      const g = vc(d, p), b = ba(
        Ro(d),
        g
      );
      return Qo(
        d.id,
        (h) => ba(h, g)
      ), wn(!1), new Promise((h, C) => {
        lt.current = {
          nodeId: d.id,
          recordId: g.id,
          resolve: h,
          reject: C
        }, Ft({
          node: { ...d, feedbackRequests: b },
          recordId: g.id,
          prompt: p
        });
      });
    },
    [Qo]
  ), B = O(
    async (d) => {
      const p = lt.current;
      if (!(!p || zn)) {
        wn(!0);
        try {
          await p.submit?.(d), Qo(
            p.nodeId,
            (g) => rh(g, p.recordId, d)
          ), lt.current = null, Ft(null), p.resolve(d);
        } catch (g) {
          o(g instanceof Error ? g.message : "提交反馈失败");
        } finally {
          wn(!1);
        }
      }
    },
    [Qo, zn]
  ), A = O(() => {
    Ft(null);
  }, []), U = O(
    (d, p) => {
      if (lt.current?.nodeId === d.id && lt.current.recordId === p.id && p.status === "pending") {
        Ft({
          node: d,
          recordId: p.id,
          prompt: p.prompt
        });
        return;
      }
      if (p.status === "pending") {
        const g = fv(
          Je.current,
          d,
          p
        );
        if (g) {
          wn(!1), lt.current = {
            nodeId: d.id,
            recordId: p.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (b) => {
              await Hl(
                r,
                g.run,
                g.pending,
                g.prompt,
                b
              ), window.setTimeout(() => lo.current?.(), 0);
            }
          }, Ft({
            node: d,
            recordId: p.id,
            prompt: g.prompt
          });
          return;
        }
      }
      Ft({
        node: d,
        recordId: p.id,
        prompt: {
          ...p.prompt,
          values: p.values || p.prompt.values || {}
        }
      });
    },
    [r]
  ), X = O(
    (d) => {
      const p = AbortSignal.any([
        Rt.current.signal,
        Cr.current.signal
      ]), g = (h) => {
        zo((C) => p.aborted || v.current !== d ? C : typeof h == "function" ? h(C) : h);
      }, b = {
        enqueue: (h, C) => Lo.enqueue(
          h,
          (_) => !p.aborted && v.current === d ? C(_) : _
        ),
        flush: Lo.flush
      };
      return {
        setRunningNode: g,
        getRunningNode: (h) => !p.aborted && v.current === d ? Mn.current[h] : void 0,
        runningNodeBatcher: b,
        consumerSignal: p,
        subscribeRun: (h, C) => {
          const _ = an.current.subscribe(
            r,
            d,
            h,
            C
          ), S = Je.current.find(
            (E) => E.canvas_id === d && E.request_id === h && _n(E.status)
          );
          return S && C(S), _;
        }
      };
    },
    [r, Lo]
  ), Z = O(
    ({
      assetCate: d,
      startNode: p,
      canvas: g,
      nodes: b = g.nodes,
      ...h
    }) => {
      if (!a)
        throw new Error("创作空间尚未加载");
      const C = g.id;
      return {
        projectId: r,
        canvasId: C,
        assetCate: d,
        space: a,
        startNode: p,
        onCanvasRunChange: bt,
        appliedResultKeys: uo.current,
        ownsNodeResult: (_, S) => Zi(
          Je.current,
          C,
          _,
          S
        ),
        ...h,
        nodes: b,
        edges: g.edges,
        viewport: g.viewport,
        canvasUpdatedAt: g.updatedAt,
        flushCanvasSave: xt,
        onNodeResult: et,
        onAssetCreated: Xe,
        ...X(C),
        requestFlowFeedback: k,
        requestNodeTitle: (_, S) => Pr(g.id, _, S)
      };
    },
    [
      r,
      bt,
      xt,
      Pr,
      k,
      X,
      a,
      et,
      Xe
    ]
  ), M = O(
    async (d) => {
      !a || d?.consumerSignal?.aborted || await Nt(
        r,
        a,
        F.current,
        "recovery",
        {
          canvasId: d?.canvasId || v.current,
          runIds: [Number(d?.canvasRun?.run_id || 0)]
        }
      );
    },
    [Nt, r, a]
  ), oe = O(
    async (d) => {
      if (!a || !W)
        return;
      let p = null;
      try {
        yo(
          Oy(
            d.id,
            we.nodes,
            we.edges
          )
        ), p = Z({
          assetCate: W,
          startNode: d,
          canvas: {
            ...H,
            nodes: we.nodes,
            edges: we.edges,
            viewport: H.viewport
          }
        }), await Ji(p), await Kn(p);
      } catch (g) {
        if (p?.consumerSignal?.aborted || nh(g) || Li(g))
          return;
        const b = g instanceof Error ? g.message : "开始节点执行失败", h = p;
        if (h && !rt(
          h,
          h.canvasRun,
          d.id
        ))
          return;
        h?.setRunningNode?.(
          (C) => rt(
            h,
            h.canvasRun,
            d.id
          ) ? {
            ...C,
            [d.id]: {
              nodeId: d.id,
              title: d.title,
              startedAt: Date.now(),
              progress: 92,
              status: "error"
            }
          } : C
        ), o(b), h && Jr(h, [d.id], 1400);
      } finally {
        dn(p?.canvasRun), await M(p);
      }
    },
    [
      W,
      H,
      we.edges,
      we.nodes,
      yo,
      Z,
      Kn,
      M,
      dn,
      a
    ]
  ), ke = O(
    async (d) => {
      if (!a || !W)
        return;
      const p = F.current[String(H.id)] || H, g = p.nodes.find(
        (j) => j.id === d
      );
      if (!g) {
        o("分镜脚本节点不存在");
        return;
      }
      const b = (j) => Dt(j) && !ar(j, p.nodes), h = vl(
        p.nodes,
        b
      ).find((j) => j.sourceNodeId === d);
      if (!h) {
        o("当前分镜脚本尚未生成制作组");
        return;
      }
      const C = bl(
        h,
        p.nodes,
        p.edges,
        b
      );
      if (C.blockedReason) {
        o(C.blockedReason);
        return;
      }
      const _ = cc(d), S = Z({
        assetCate: W,
        startNode: g,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: bt,
        canvas: p
      });
      yo(C.pendingNodeIds), S.setRunningNode?.((j) => ({
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
        await Ji(S);
      } catch (j) {
        if (S.consumerSignal?.aborted || Li(j))
          E = 0;
        else if (rt(S, S.canvasRun, _)) {
          E = 1400;
          const ee = j instanceof Error ? j.message : "制作区执行失败";
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
          ), o(ee);
        }
      } finally {
        dn(S.canvasRun), (S.canvasRun?.node_results || []).some(
          (ee) => ee.node_key && vr(ee) === "success"
        ) && !S.consumerSignal?.aborted && (St(
          (ee) => Ki({
            canvas: ee,
            sourceNodeIds: [d],
            assetCate: W,
            powers: Me
          })
        ), await Kn(S)), S.consumerSignal?.aborted || Jr(S, [_], E), await M(S);
      }
    },
    [
      H,
      W,
      yo,
      Z,
      Kn,
      Me,
      M,
      dn,
      bt,
      a,
      St
    ]
  ), Ie = O(
    async (d, p) => {
      if (!a || !W)
        return;
      const g = F.current[String(H.id)] || H, b = g.nodes.find((J) => J.id === d.id) || d, h = Ew({
        ...b,
        composerDraft: {
          ...b.composerDraft || {},
          ...d.composerDraft || {}
        }
      });
      if (np(h)) {
        const J = Qr(
          h,
          h.resultOutput
        );
        if (!J) throw new Error("请等待作品加载完成后再发送");
        if (ou(J.document)) {
          Er(h);
          return;
        }
        if (ve !== "create") throw new Error("当前作品只读，无法重新生成");
        const ie = `${g.id}:${h.id}`;
        if (J.document.status === "running" || $t(Mn.current[h.id]) || Uo.current.has(ie))
          throw new Error("当前灵感正在生成，请等待完成后再发送");
        Uo.current.add(ie);
        try {
          const le = await um({
            project_id: r,
            canvas_id: g.id,
            work_asset_id: J.work_asset_id,
            expected_work_version_id: J.work_version_id,
            expected_work_revision: J.work_revision,
            action: "generate_inspirations",
            instruction: h.composerDraft?.prompt || ""
          });
          ln(g.id, h.id, {
            resultOutput: { writing: le },
            runError: ""
          });
        } finally {
          Uo.current.delete(ie);
        }
        return;
      }
      const C = Dy(
        h.id,
        p?.targetNodeIds
      ), _ = Ey(
        g.nodes.map(
          (J) => J.id === h.id ? h : J
        ),
        C
      ), S = new Map(
        _.map((J) => [J.id, J])
      ), E = C.map((J) => S.get(J)).filter((J) => !!J), j = (J) => {
        let ie = J;
        for (const le of C)
          !ie[le] || !rt(Y, Y.canvasRun, le) || (ie === J && (ie = { ...J }), delete ie[le]);
        return ie;
      }, ee = Zl(
        d.id,
        _,
        g.edges
      ), Y = Z({
        assetCate: W,
        startNode: h,
        singleNode: !0,
        targetNodeIds: p?.targetNodeIds,
        onCanvasRunChange: bt,
        canvas: g,
        nodes: _,
        runInput: {
          _manual_input_context: ee || void 0,
          _agent_turn_input: p?.agentInput,
          _storyboard_action: p?.storyboardAction,
          manual_node_id: d.id
        }
      });
      for (const J of E)
        et(J.id, { runError: "" });
      Y.setRunningNode?.((J) => {
        const ie = { ...J };
        for (const le of E) {
          const Ae = J[le.id];
          ie[le.id] = {
            ...Ae || {},
            ...$a(Ae),
            nodeId: le.id,
            title: le.title,
            startedAt: Ae?.startedAt || Date.now(),
            progress: Math.max(Ae?.progress || 0, 8),
            status: "running",
            ...le.id === h.id && p?.agentInput ? { agent: Um() } : {}
          };
        }
        return ie;
      });
      try {
        await Ji(Y), await Kn(Y);
      } catch (J) {
        if (Y.consumerSignal?.aborted || !rt(Y, Y.canvasRun, h.id))
          return;
        if (Li(J)) {
          et(h.id, { runError: "" }), Y.setRunningNode?.(j);
          return;
        }
        throw et(h.id, {
          runError: J instanceof Error ? J.message : "节点运行失败"
        }), Y.setRunningNode?.(
          (ie) => rt(Y, Y.canvasRun, h.id) ? {
            ...ie,
            [h.id]: {
              ...ie[h.id] || {
                nodeId: h.id,
                title: h.title,
                startedAt: Date.now()
              },
              progress: 92,
              status: "error"
            }
          } : ie
        ), Jr(Y, C, 1400), J;
      } finally {
        dn(Y.canvasRun), await M(Y);
      }
      h.outputType === "setting" && Y.canvasRun?.status === "success" && v.current === g.id && await ke(h.id);
    },
    [
      W,
      H,
      Z,
      Kn,
      r,
      M,
      dn,
      bt,
      a,
      ke,
      Er,
      ln,
      et,
      ve
    ]
  ), Se = O(
    async (d) => {
      if (!W)
        throw new Error("当前分类不存在");
      const p = X(H.id);
      let g;
      const b = (C) => {
        const _ = g;
        g = {
          nodeId: d.id,
          title: d.title,
          startedAt: _?.startedAt || Date.now(),
          progress: C === "success" ? 100 : C === "error" ? 92 : 0,
          status: C
        };
        const S = g;
        p.setRunningNode(
          (E) => _ && E[d.id] !== _ ? E : { ...E, [d.id]: S }
        ), (C === "success" || C === "error") && window.setTimeout(
          () => p.setRunningNode(
            (E) => E[d.id] === S ? _u(E, d.id) : E
          ),
          C === "success" ? 650 : 1200
        );
      }, h = !bi(d);
      h && b("running");
      try {
        const C = await rb({
          node: d,
          projectId: r,
          canvasId: H.id,
          assetCate: W,
          inputContext: d.inputContext || null,
          onNodeResult: et,
          onAssetCreated: Xe,
          onRunStartNode: oe,
          onOpenImportPicker: Zo
        });
        return h && b("success"), C;
      } catch (C) {
        throw h && b("error"), C;
      }
    },
    [
      H.id,
      W,
      X,
      Zo,
      r,
      oe,
      et,
      Xe
    ]
  );
  ue(() => {
    a && Xo(ut, H, a);
  }, [H, Xo, ut, a]);
  function xe(d) {
    return D.current != null ? !1 : (D.current = d, P(d), !0);
  }
  function Ze() {
    D.current = null, P(null);
  }
  async function Zt() {
    const d = F.current[String(v.current)] || H;
    if (!d.id)
      return !0;
    try {
      return await xt(d), !0;
    } catch {
      return !1;
    }
  }
  function Ke() {
    V([]), en({}), zo({}), En(null), Ye(null), Tn(null), ct(null), _t(null), on(null), Dn(null), Vo(void 0), Wt(!1), Ht(""), Re.current = null, ro(null), Fn(!1), Ut.current = null, Jt.current = [0], io([]), Bn(1), ae(!1), On(!1), ao("");
  }
  async function ot(d) {
    if (d === v.current) return !0;
    if (D.current != null)
      return !1;
    const p = a?.canvasList.find((g) => g.id === d);
    if (!p)
      return o("目标画布不存在"), !1;
    if (!xe(p.assetCateId)) return !1;
    try {
      if (!await Zt()) return !1;
      const g = String(d);
      if (!Object.prototype.hasOwnProperty.call(F.current, g))
        try {
          const h = await Lr({
            projectId: r,
            canvasId: d
          }), C = dr(
            nr(h.canvas, Me),
            h.assets
          );
          u(
            (S) => S && {
              ...S,
              assets: or(S.assets, h.assets),
              canvasList: h.canvasList.length > 0 ? h.canvasList : S.canvasList
            }
          );
          const _ = {
            ...F.current,
            [g]: C
          };
          F.current = _, re(_), nt(C);
        } catch (h) {
          return o(h instanceof Error ? h.message : "加载画布失败"), !1;
        }
      if (v.current = d, y(d), R.current = p.assetCateId, I(p.assetCateId), sr(d), Ke(), !a)
        return !0;
      const b = F.current[g] || qc(p.assetCateId, d, p.name);
      return Xo(ut, b, a), Nt(
        r,
        a,
        F.current,
        "recovery",
        { canvasId: d }
      ), !0;
    } finally {
      Ze();
    }
  }
  async function bn(d) {
    const p = (a?.canvasList || []).filter((g) => g.assetCateId === d).sort((g, b) => g.sort - b.sort || g.id - b.id)[0];
    if (p) return ot(p.id);
    if (!a || D.current != null || !xe(d)) return !1;
    try {
      if (!await Zt()) return !1;
      const g = await Lr({
        projectId: r,
        canvasId: 0,
        assetCateId: d
      }), b = dr(
        nr(g.canvas, Me),
        g.assets
      ), h = b.id, C = {
        ...F.current,
        [String(h)]: b
      };
      return F.current = C, re(C), nt(b), u(
        (_) => _ && {
          ..._,
          assets: or(_.assets, g.assets),
          canvasList: g.canvasList.length > 0 ? g.canvasList : _.canvasList
        }
      ), v.current = h, y(h), R.current = d, I(d), sr(h), Ke(), Nt(r, a, C, "recovery", {
        canvasId: h
      }), !0;
    } catch (g) {
      return o(
        g instanceof Error ? g.message : "加载输出类型失败"
      ), !1;
    } finally {
      Ze();
    }
  }
  async function Ds(d) {
    if (W) {
      if (!xe(W.id))
        throw new Error("正在切换画布，请稍后重试");
      try {
        if (!await Zt())
          throw new Error("当前画布保存失败，未创建新画布");
        const p = await up({
          projectId: r,
          assetCateId: W.id,
          name: d
        }), g = p.canvas;
        if (!g?.id) throw new Error("新画布数据为空");
        const b = nr(g, Me), h = {
          ...F.current,
          [String(g.id)]: b
        };
        F.current = h, re(h), nt(b), u(
          (C) => C && {
            ...C,
            canvasList: p.canvasList,
            initialCanvasId: g.id,
            initialAssetCateId: g.assetCateId
          }
        ), v.current = g.id, y(g.id), R.current = g.assetCateId, I(g.assetCateId), sr(g.id), Ke(), Nn();
      } catch (p) {
        throw o(p instanceof Error ? p.message : "创建画布失败"), p;
      } finally {
        Ze();
      }
    }
  }
  async function Ps(d, p) {
    try {
      const g = await dp({ projectId: r, canvasId: d, name: p });
      u(
        (b) => b && { ...b, canvasList: g.canvasList }
      ), re((b) => {
        const h = b[String(d)];
        if (!h) return b;
        const C = {
          ...b,
          [String(d)]: { ...h, name: p }
        };
        return F.current = C, C;
      }), Nn();
    } catch (g) {
      throw o(g instanceof Error ? g.message : "重命名画布失败"), g;
    }
  }
  async function Fr(d) {
    if (W)
      try {
        const p = await cp({
          projectId: r,
          assetCateId: W.id,
          canvasIds: d
        });
        u(
          (g) => g && { ...g, canvasList: p.canvasList }
        );
      } catch (p) {
        throw o(
          p instanceof Error ? p.message : "调整画布顺序失败"
        ), p;
      }
  }
  async function er(d) {
    if (!xe(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      const p = d === v.current, g = F.current[String(d)];
      g && await xt(g);
      const b = await ap({ projectId: r, canvasId: d });
      if (Ii(d), u(
        (h) => h && { ...h, canvasList: b.canvasList }
      ), F.current[String(d)]) {
        const h = { ...F.current };
        delete h[String(d)], F.current = h, re(h);
      }
      if (p && b.activeCanvasId) {
        const h = b.canvasList.find(
          (_) => _.id === b.activeCanvasId
        );
        let C = F.current[String(b.activeCanvasId)];
        if (!C) {
          const _ = await Lr({
            projectId: r,
            canvasId: b.activeCanvasId
          });
          C = dr(
            nr(_.canvas, Me),
            _.assets
          );
          const S = {
            ...F.current,
            [String(C.id)]: C
          };
          F.current = S, re(S), u(
            (E) => E && {
              ...E,
              assets: or(E.assets, _.assets),
              canvasList: b.canvasList
            }
          );
        }
        nt(C), v.current = C.id, y(C.id), R.current = h?.assetCateId || C.assetCateId, I(h?.assetCateId || C.assetCateId), sr(C.id), Ke(), a && Nt(
          r,
          a,
          F.current,
          "recovery",
          { canvasId: C.id }
        );
      }
      Dr(R.current), Nn();
    } catch (p) {
      throw o(p instanceof Error ? p.message : "删除画布失败"), p;
    } finally {
      Ze();
    }
  }
  async function Es(d) {
    if (!xe(R.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      if (!await Zt())
        throw new Error("当前画布保存失败，未恢复画布");
      const p = await ip({ projectId: r, canvasId: d });
      if (!p.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let g = p.canvas, b = [], h = p.canvasList, C = "";
      try {
        const E = await Lr({
          projectId: r,
          canvasId: p.canvas.id
        });
        g = E.canvas, b = E.assets, E.canvasList.length > 0 && (h = E.canvasList);
      } catch (E) {
        C = E instanceof Error ? `画布已恢复，但资产加载失败：${E.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const _ = dr(
        nr(g, Me),
        b
      ), S = {
        ...F.current,
        [String(_.id)]: _
      };
      F.current = S, re(S), nt(_), u(
        (E) => E && {
          ...E,
          assets: or(E.assets, b),
          canvasList: h,
          initialCanvasId: _.id,
          initialAssetCateId: _.assetCateId
        }
      ), v.current = _.id, y(_.id), R.current = _.assetCateId, I(_.assetCateId), sr(_.id), z(
        (E) => E.filter((j) => j.id !== _.id)
      ), $(!1), Ke(), Nn(), a && Nt(r, a, S, "recovery", {
        canvasId: _.id
      }), C && o(C);
    } catch (p) {
      throw o(p instanceof Error ? p.message : "恢复画布失败"), p;
    } finally {
      Ze();
    }
  }
  function Nn() {
    const d = Number(a?.project.team_id || 0);
    Eg(d > 0 ? { teamID: d } : void 0);
  }
  function ho(d) {
    En((p) => ({
      nodeId: d,
      nonce: (p?.nonce || 0) + 1
    }));
  }
  const Os = O((d) => {
    En((p) => !p || p.nodeId !== d.nodeId || p.nonce !== d.nonce ? p : null);
  }, []);
  async function Ai(d, p, g, b, h = {}) {
    const C = Rt.current?.signal, _ = JSON.stringify([
      d,
      h.canvasId || 0,
      b,
      b === "active" ? [] : [...new Set(h.runIds || [])].sort((E, j) => E - j)
    ]), S = Ir.current;
    if (!(C?.aborted || S.has(_))) {
      S.add(_);
      try {
        const E = h.canvasId ? g[String(h.canvasId)] : void 0, j = E ? Je.current.filter(
          (ft) => js(ft, E)
        ) : Je.current, ee = b === "active" ? Qw(j) : [], Y = [...new Set(
          (h.runIds?.length ? h.runIds : [
            ...ee,
            ...j.filter((ft) => ft.detailsPending)
          ].map((ft) => Number(ft.run_id || 0))).filter((ft) => ft > 0)
        )];
        if (b === "active" && Y.length === 0) return;
        const J = {
          projectId: d,
          scope: b,
          canvasId: h.canvasId,
          runIds: Y,
          summaryOnly: !0
        };
        let ie;
        if (b === "recovery" && Y.length === 0) {
          const ft = await Yc({ ...J, limit: 50 }), Vf = await zi(
            { ...J, scope: "active" },
            C
          );
          ie = Xi(
            jr(ft.items),
            jr(Vf)
          );
        } else
          ie = jr(
            await zi(J, C)
          );
        const le = ov(
          ie,
          j,
          b === "recovery" ? g : void 0
        );
        if (le.length === 0 || C?.aborted) return;
        const Ae = new Set(le);
        Di(
          d,
          ie.filter((ft) => Ae.has(Number(ft.run_id || 0))).map((ft) => ({ ...ft, detailsPending: !0 })),
          g,
          p
        );
        const Ur = jr(
          await zi(
            { ...J, runIds: le, summaryOnly: !1 },
            C
          )
        );
        if (C?.aborted) return;
        Di(
          d,
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
  function Di(d, p, g, b) {
    const h = Xi(
      Je.current,
      p
    );
    Je.current = h, Ue(h);
    const C = new Map(h.map((S) => [ht(S), S])), _ = p.map((S) => C.get(ht(S))).filter((S) => !!S);
    for (const S of Object.values(g))
      Xo(_, S, b);
    for (const S of _) {
      const E = Un.current.get(
        `${d}:${String(S.request_id || "")}`
      );
      if (E) {
        for (const j of Xr(S))
          E.finishedNodeIds.add(j);
        _n(S.status) && E.controller.abort();
      }
      an.current.publish(d, S);
    }
  }
  async function Br(d, p = 0) {
    const g = v.current, b = Rt.current?.signal;
    if (Ut.current || b?.aborted) return;
    const h = {}, C = () => !b?.aborted && v.current === g && Ut.current === h, _ = Jt.current[p] || 0;
    Ut.current = h, On(!0), ao("");
    try {
      const S = await Yc({
        projectId: d,
        canvasId: g,
        scope: "history",
        beforeId: _,
        limit: 20
      });
      if (!C()) return;
      io(
        jr(S.items)
      ), Bn(p + 1), ae(S.hasMore);
      const E = Jt.current.slice(0, p + 1);
      S.hasMore && S.beforeId > 0 && (E[p + 1] = S.beforeId), Jt.current = E;
    } catch (S) {
      if (!C()) return;
      ao(
        S instanceof Error ? S.message : "读取画布运行记录失败"
      );
    } finally {
      C() && (Ut.current = null, On(!1));
    }
  }
  const Pi = se(
    () => ql(
      ut.filter(
        (d) => js(d, H)
      )
    ),
    [H, ut]
  ), Tc = Pi.length > 0, Mc = Tc || ut.some(
    (d) => d.detailsPending && js(d, H)
  ), lf = Tc || pw(Ce);
  async function Ac(d) {
    const p = !d, g = v.current, b = F.current[String(g)], h = X(g).consumerSignal, C = () => !h.aborted && v.current === g;
    if (p && (Ns || hn.size > 0) || !p && d?.some(
      (S) => hn.has(ht(S))
    ))
      return;
    let _ = [];
    p && Ot(!0);
    try {
      let S = d || [], E = 0, j = S.length;
      if (p) {
        const J = await wp(r, g);
        S = J.items.map(Ao), E = J.failedCount, j = J.count;
      } else
        S = ev(S);
      if (j === 0)
        return;
      p || (_ = S.map(ht), yt((ie) => {
        const le = new Set(ie);
        for (const Ae of _)
          le.add(Ae);
        return le;
      }), S = (await Promise.allSettled(
        S.map(
          (ie) => vp({
            projectId: r,
            runId: Number(ie.run_id || 0),
            requestId: String(ie.request_id || "")
          })
        )
      )).flatMap((ie, le) => {
        if (ie.status === "rejected")
          return E += 1, [];
        const Ae = Ao(ie.value);
        return [
          {
            ...S[le],
            status: Ae.status,
            error: Ae.error
          }
        ];
      }));
      const ee = tv(S), Y = S.filter((J) => J.status === "canceled");
      if (ee.size > 0) {
        const J = (/* @__PURE__ */ new Date()).toISOString(), ie = (Ae) => Ae.map((Ur) => {
          const ft = nv(ee, Ur);
          return ft ? { ...Ur, status: ft, updated_at: J } : Ur;
        }), le = ie(Je.current);
        Je.current = le, Ue(le), C() && io(ie);
      }
      if (b && a)
        for (const J of Y)
          Pc(
            { ...J, canvas_id: g },
            b,
            a,
            []
          );
      E > 0 && C() && o(
        E === j ? "停止运行失败，请稍后重试" : `${E} 个运行停止失败，请稍后重试`
      ), qo && C() && Br(
        r,
        Math.max(0, _e - 1)
      ), window.setTimeout(() => {
        C() && lo.current?.();
      }, 0);
    } catch (S) {
      C() && o(
        S instanceof Error ? S.message : "停止画布运行失败"
      );
    } finally {
      _.length > 0 && yt((S) => {
        const E = new Set(S);
        for (const j of _)
          E.delete(j);
        return E;
      }), p && Ot(!1);
    }
  }
  function ff() {
    Tr({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => Ac()
    });
  }
  function Dc(d) {
    Tr({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => Ac([d])
    });
  }
  lo.current = a ? () => Nt(
    r,
    a,
    F.current,
    "active",
    { canvasId: v.current }
  ) : null, ue(() => {
    if (!a || !Mc)
      return;
    let d = !1, p = !1, g;
    const b = async () => {
      if (!(d || p)) {
        window.clearTimeout(g), p = !0;
        try {
          await lo.current?.();
        } finally {
          p = !1, d || (g = window.setTimeout(
            b,
            document.hidden ? 15e3 : Na
          ));
        }
      }
    }, h = () => {
      document.hidden || b();
    };
    return b(), window.addEventListener("online", h), window.addEventListener("focus", h), document.addEventListener("visibilitychange", h), () => {
      d = !0, window.clearTimeout(g), window.removeEventListener("online", h), window.removeEventListener("focus", h), document.removeEventListener("visibilitychange", h);
    };
  }, [l, Mc, r, a]), ue(() => {
    const d = Un.current, p = Go.current, g = [];
    if (a)
      for (const h of Pi) {
        const C = h.run, _ = String(C.request_id || "").trim();
        !_ || Is.has(_) || g.push({
          key: `${r}:${_}`,
          canvasId: Number(C.canvas_id || v.current),
          requestId: _,
          run: C,
          managedNodeIds: h.managedNodeIds
        });
      }
    const b = new Set(g.map((h) => h.key));
    for (const [h, C] of d)
      b.has(h) || (C.controller.abort(), d.delete(h), p.delete(h));
    for (const h of g) {
      const C = d.get(h.key);
      if (C) {
        C.managedNodeIds = h.managedNodeIds;
        for (const ee of Xr(h.run))
          C.finishedNodeIds.add(ee);
        continue;
      }
      const _ = new AbortController(), S = {
        controller: _,
        managedNodeIds: h.managedNodeIds,
        finishedNodeIds: Xr(h.run)
      };
      d.set(h.key, S);
      const E = {
        ...X(h.canvasId),
        canUpdateNode: (ee) => !_.signal.aborted && S.managedNodeIds.has(ee) && !S.finishedNodeIds.has(ee) && Zi(
          Je.current,
          h.canvasId,
          h.run,
          ee
        )
      };
      (async () => {
        for (; !_.signal.aborted; ) {
          try {
            await Su({
              projectId: r,
              requestId: h.requestId,
              lastId: p.get(h.key) || "0-0",
              signal: _.signal,
              onFrame: (ee) => {
                if (_.signal.aborted || v.current !== h.canvasId) return;
                ee.stream_id && p.set(h.key, ee.stream_id), Yr(E, S.managedNodeIds, !1);
                const Y = qw(
                  E,
                  ee,
                  S.managedNodeIds,
                  S.finishedNodeIds
                );
                Y && (h.run = bc(h.run, Y), Di(
                  r,
                  [h.run],
                  F.current,
                  a
                ));
              }
            });
            return;
          } catch {
            if (_.signal.aborted) return;
          }
          Yr(E, S.managedNodeIds, !0), await Ll(Na, _.signal);
        }
      })().catch(() => {
      });
    }
  }, [
    Is,
    r,
    Pi,
    X,
    a
  ]), ue(
    () => () => {
      for (const d of Un.current.values())
        d.controller.abort();
      Un.current.clear(), Go.current.clear();
    },
    []
  );
  function pf(d, p, g) {
    const b = d.filter(
      (S) => js(S, p)
    );
    if (b.length === 0)
      return;
    const h = new Map(p.nodes.map((S) => [S.id, S])), C = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set();
    for (const S of b) {
      const E = new Set(
        To(S).filter((Y) => _.has(Y) ? !1 : (_.add(Y), !0))
      );
      if (E.size === 0)
        continue;
      const ee = Sa(
        S,
        p
      ) ? [] : (S.node_results || []).filter((Y) => {
        const J = Y.node_key;
        return !J || !E.has(J) || C.has(J) || _a(h.get(J), S, Y) ? !1 : (C.add(J), !0);
      });
      Pc(
        S,
        p,
        g,
        ee,
        E
      );
    }
  }
  function Pc(d, p, g, b = d.node_results || [], h) {
    const C = iv(d, p.nodes);
    if (!C)
      return;
    const _ = Oi(g, p.assetCateId);
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
      onAssetCreated: Xe,
      ...X(p.id),
      consumerSignal: Rt.current?.signal,
      requestFlowFeedback: k,
      requestNodeTitle: (E, j) => Pr(p.id, E, j),
      canvasRun: d,
      appliedResultKeys: uo.current,
      ownsNodeResult: (E, j) => Zi(
        Je.current,
        p.id,
        E,
        j
      )
    };
    Yl(S, b), jl(S, d.node_results || []), mf(S, d, C), Zr(S, d, h), Nc(S, d, h);
  }
  function mf(d, p, g) {
    p.single_node || String(p.status || "").trim().toLowerCase() !== "success" || !Vt(g.resultOutput) || Ct(
      d.canvasId,
      (b) => Ki({
        canvas: b,
        sourceNodeIds: [g.id],
        assetCate: d.assetCate,
        powers: Me
      })
    );
  }
  function tr(d, p, g) {
    if (!W)
      return null;
    const b = pn(
      d,
      W,
      H.nodes.length,
      p,
      g
    ), h = a ? Oi(a, xa(b) || W.id) : W;
    d === "asset" && (b.cardinality = h.cardinality);
    const C = d === "asset" && g?.replaceSingleAssetNode ? xa(b) || Number(h.id || 0) : 0, _ = C ? qd(
      H.nodes,
      H.edges,
      C,
      g?.connectFromNodeId
    ) : null, S = _ ? Gd(
      H.nodes,
      H.edges,
      C,
      g?.connectFromNodeId,
      _.id
    ) : /* @__PURE__ */ new Set(), E = _?.id || b.id;
    if (St((j) => {
      let ee = j.edges;
      const Y = C ? qd(
        j.nodes,
        j.edges,
        C,
        g?.connectFromNodeId
      ) : null;
      if (Y) {
        const ie = Gd(
          j.nodes,
          j.edges,
          C,
          g?.connectFromNodeId,
          Y.id
        );
        ee = j.edges.filter(
          (Ae) => !ie.has(Ae.from) && !ie.has(Ae.to)
        ), g?.connectFromNodeId ? ee = Wn(
          ee,
          g.connectFromNodeId || "",
          Y.id,
          j.nodes
        ) : g?.connectToNodeId && (ee = Wn(
          ee,
          Y.id,
          g.connectToNodeId || "",
          j.nodes
        ));
        const le = j.nodes.filter((Ae) => !ie.has(Ae.id)).map(
          (Ae) => Ae.id === Y.id ? ta(Ae, b) : Ae
        );
        return {
          ...j,
          nodes: le,
          edges: Tt(le, ee)
        };
      }
      g?.connectFromNodeId ? ee = Wn(
        ee,
        g.connectFromNodeId || "",
        b.id,
        [...j.nodes, b]
      ) : g?.connectToNodeId && (ee = Wn(ee, b.id, g.connectToNodeId || "", [...j.nodes, b]));
      const J = Js(
        [...j.nodes, b],
        b.id,
        { x: b.x, y: b.y }
      );
      return {
        ...j,
        nodes: J,
        edges: Tt(J, ee)
      };
    }), _) {
      const j = ta(_, b);
      en((ee) => {
        const Y = { ...ee };
        for (const J of S)
          delete Y[J];
        return Y[_.id] = {
          ...Y[_.id] || {},
          ...xv(j)
        }, Y;
      });
    }
    return g?.selectCreated !== !1 && (V([E]), ho(E)), fe("create"), Ye(null), _ ? ta(_, b) : b;
  }
  function gf(d, p) {
    if (!W)
      return;
    if (kd(H.nodes).has(d.id)) {
      o("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const g = Cv(
      d,
      W.id,
      H.nodes.length,
      p
    );
    St((b) => {
      const h = Js(
        [...b.nodes, g],
        g.id,
        { x: g.x, y: g.y }
      );
      return {
        ...b,
        nodes: h,
        edges: Tt(h, b.edges)
      };
    }), en((b) => {
      const h = b[d.id];
      return h ? { ...b, [g.id]: h } : b;
    }), V([g.id]), ho(g.id), Ye(null);
  }
  function yf(d, p = {}) {
    const g = Fl(
      H.nodes,
      d
    );
    if (g.size === 0)
      return;
    const b = kd(H.nodes);
    if (!p.allowStoryboardFrame && [...g].some((h) => b.has(h))) {
      o(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      );
      return;
    }
    St((h) => {
      const C = Qp(
        h.nodes,
        g
      ).filter((_) => !g.has(_.id));
      return pi({
        canvas: { ...h, nodes: C, edges: Tt(C, h.edges) },
        assetCate: W,
        powers: Me
      });
    }), en(
      (h) => Bd(h, g)
    ), zo((h) => Bd(h, g)), V([]), En(
      (h) => h && g.has(h.nodeId) ? null : h
    ), ct(
      (h) => h && g.has(h.id) ? null : h
    ), _t(
      (h) => h && (g.has(h.id) || at && g.has(at.id)) ? null : h
    ), Dn(
      (h) => h && g.has(h.nodeId) ? null : h
    ), Ht(
      (h) => g.has(h) ? "" : h
    ), Re.current && g.has(Re.current.id) && (Re.current = null);
  }
  function Ec(d, p) {
    tr("asset", p, { asset: d });
  }
  function hf(d, p, g) {
    if (!d)
      return;
    const b = H.nodes.find((C) => C.id === d) || (g?.id === d ? g : Re.current?.id === d ? Re.current : null);
    if (!b)
      return;
    const h = ri(p.version?.content) || Pt(p.version?.content);
    et(
      d,
      Jn(
        {
          ...b,
          kind: p.kind || W.kind,
          assetCateId: Number(p.asset_cate_id || W.id || 0)
        },
        {
          output: h,
          asset: p
        },
        "引用资产"
      )
    ), wf(d, h);
  }
  async function wf(d, p) {
    if (!d)
      return;
    const g = H.edges.filter((b) => b.from === d).map((b) => H.nodes.find((h) => h.id === b.to)).filter(
      (b) => !!b && Qt(b, "display")
    );
    if (g.length !== 0)
      for (const b of g)
        et(
          b.id,
          Jn(b, { output: p }, "展示引用结果")
        );
  }
  async function Oc(d, p = sn, g = Re.current) {
    if (!p) {
      Ec(d);
      return;
    }
    const b = H.nodes.find((C) => C.id === p) || (g?.id === p ? g : Re.current?.id === p ? Re.current : null);
    if (!b) {
      Ec(d), Ht(""), Re.current = null;
      return;
    }
    Nu(H.nodes, b.storyboardItem?.sourceNodeId || "") && (await xt(H), d = await bp({
      projectId: r,
      canvasId: H.id,
      nodeId: p,
      assetId: d.id,
      versionId: Number(d.version_id),
      requestId: crypto.randomUUID()
    }), Xe(d)), hf(p, d, g), Fc();
  }
  async function vf(d, p = sn, g = Re.current) {
    if (!Us(d)) {
      o("该素材没有可用内容，无法引用");
      return;
    }
    const b = Number(W?.id || 0), h = p || `new-${Date.now()}`;
    try {
      if (d.libraryType !== "material") {
        await Oc(qr(d), p, g);
        return;
      }
      const C = await Jc({
        projectId: r,
        canvasId: H.id,
        assetCateId: b,
        name: d.name || "素材库资产",
        kind: d.kind,
        content: d.version?.content,
        nodeKey: p,
        requestId: `official-material:${d.id}:${h}`
      }), _ = qr(C);
      Xe(_), await Oc(_, p, g);
    } catch (C) {
      o(
        C instanceof Error ? C.message : "引用素材库资产失败"
      );
    }
  }
  function Fc() {
    Wt(!1), Ht(""), Re.current = null;
  }
  function bf(d, p) {
    nd(), ro({ nodeId: d, frameIndex: p }), Ye(null), fe("create");
  }
  async function Nf(d) {
    const p = Yt;
    if (!p || co.current)
      return;
    const g = we.nodes.find((S) => S.id === p.nodeId);
    if (!g) {
      o("宫格节点不存在");
      return;
    }
    const b = d.filter(
      (S) => S.kind === "image" && Us(S)
    ), h = Number.isInteger(p.frameIndex);
    if (h && b.length === 0) {
      o("请选择一张图片");
      return;
    }
    if (!h && b.length === 0) {
      o("请至少选择一张图片");
      return;
    }
    if (!h && b.length > Co) {
      o(`一次最多导入 ${Co} 张图片`);
      return;
    }
    const C = Ba([
      g.asset?.version?.content,
      g.resultOutput
    ]), _ = h ? Pw(
      C,
      Number(p.frameIndex),
      b[0],
      g.title
    ) : Bl(
      b,
      C,
      g.title
    );
    if (!_) {
      o("当前宫格内容不可编辑");
      return;
    }
    co.current = !0;
    try {
      const S = Number(g.asset?.id || 0), E = Number(
        g.asset?.version?.id || g.asset?.version_id || 0
      ), j = S > 0 && E > 0 ? await Hc({
        projectId: r,
        assetId: S,
        versionId: E,
        content: _
      }) : await Jc({
        projectId: r,
        canvasId: H.id,
        assetCateId: Number(g.assetCateId || W?.id || 0),
        name: _.title || g.title || "宫格图片",
        kind: "collection",
        content: _,
        nodeKey: g.id,
        requestId: `storyboard-grid-import:${g.id}:${Date.now()}`
      }), ee = ca(
        j,
        g.asset
      );
      Xe(ee), et(
        g.id,
        ur(g, ee)
      );
    } catch (S) {
      o(
        S instanceof Error ? S.message : "导入宫格图片失败"
      );
    } finally {
      co.current = !1;
    }
  }
  function If(d, p) {
    tr("power", p, { power: d });
  }
  function Cf(d = "") {
    Zo(d);
  }
  async function Fs(d, p) {
    const { uploadSpaceFiles: g } = await import("./space-upload-DC6G8tEj.js").then((C) => C.c), b = await g({
      projectID: r,
      canvasID: H.id,
      teamID: Number(a?.project.team_id || 0),
      files: d,
      onProgress: p?.onProgress
    }), h = [];
    for (const C of b) {
      const _ = qr(C.asset);
      _.id && Xe(_);
      const S = Pg(C.asset);
      S.id && h.push(S);
    }
    return h;
  }
  function Sf(d, p) {
    tr("agent", p, { role: d });
  }
  function _f(d, p) {
    tr("flow", p, { flow: d });
  }
  function Rf(d) {
    tr("group", d);
  }
  async function kf(d, p) {
    const g = v.current, h = F.current[String(g)].nodes.find((S) => S.id === d), C = li(h);
    if (!C) throw new Error("请先生成设定");
    const _ = await Hc({ projectId: r, assetId: Number(h.resultRef?.asset_id || h.asset?.id), versionId: Number(h.resultRef?.version_id || h.asset?.version_id), requestId: crypto.randomUUID(), saveMode: "create_version", content: { ...C, materials: p } });
    Xe(_), ln(g, d, { asset: _, resultRef: { asset_id: _.id, version_id: _.version_id }, resultOutput: _.version?.content }), await xt(F.current[String(g)]);
  }
  async function xf() {
    const d = Rn(Me, "audio", "speech");
    if (!d) return [];
    const p = Number(a?.release?.id || a?.project.release_id || 0);
    return (await c.loadPowerForm(
      { projectId: r, releaseId: p, flowId: 0, powerId: d.id, powerKey: d.key, targetId: 0 },
      () => tu({ projectId: r, powerId: d.id, powerKey: d.key })
    )).params.find((b) => b.key === "voice")?.options || [];
  }
  function Tf(d, p) {
    const g = tr("function", p, { functionOption: d });
    g && Qt(g, "import") && (Re.current = g, Cf(g?.id || ""));
  }
  function Mf(d, p, g) {
    km(), fe("create");
    const b = {
      x: d.x,
      y: d.y,
      position: p,
      canvasId: H.id,
      connection: g
    };
    Ye(b), Tn(null), Xt().then((h) => {
      !h && g && Ye((C) => C === b ? null : C);
    });
  }
  function Bc(d, p, g) {
    const b = F.current[String(d.canvasId)];
    if (!d.connection || !b || v.current !== d.canvasId) return;
    const h = Kd(zd(b, mn), d.connection, p.node, vn), { source: C, target: _ } = h, S = mr({ ...h, params: p.params });
    if (S.kind === "invalid" || !C || !_) {
      o(S.kind === "invalid" ? S.reason : "节点已变化，请重新连接");
      return;
    }
    if (S.kind === "form" || p.params && _.composerDraft?.selectedTargetId !== p.targetModelId) {
      o("下游模型已变化，请重新选择引用节点");
      return;
    }
    const E = g || rl(S);
    if (!E && S.kind !== "direct") {
      Tn({ menu: d, candidate: p, plan: S, sourceTitle: C.title, targetTitle: _.title });
      return;
    }
    const j = ka(S, E, C, _);
    if (!j) {
      o("该用途已不可用，请重新连接");
      return;
    }
    const ee = h.nodes.find((Y) => Y.id === p.node.id);
    Ct(d.canvasId, (Y) => {
      const J = [...Y.nodes, ee].map(
        (le) => le.id === _.id && j.draft ? { ...le, composerDraft: j.draft } : le
      ), ie = E?.kind === "lyrics" ? Ql(Y.edges, C.id, _) : Y.edges;
      return {
        ...Y,
        nodes: J,
        edges: Tt(J, Wn(ie, C.id, _.id, J, j.mediaUsage))
      };
    }), o(""), V([ee.id]), ho(ee.id);
  }
  function Ei(d) {
    if (!pe || de?.menu !== pe) return;
    const p = de.candidates.find(({ node: g }) => (g.power || g.role || g.functionOption) === d);
    p && (Ye(null), Bc(pe, p));
  }
  const zc = O(() => Tn(null), []);
  function Uc(d) {
    Te && (zc(), Bc(Te.menu, Te.candidate, d));
  }
  function Af() {
    to(st === "dark" ? "light" : "dark");
  }
  const Df = Le((d) => {
    V(d), Ye(null);
  }), Pf = Le(Mf), Ef = Le(gf), Of = Le(yf), Ff = Le(
    (d) => St((p) => ({ ...p, nodes: d }))
  ), Bf = Le(
    (d) => St((p) => ({ ...p, edges: d }))
  ), zf = Le(
    (d) => St((p) => p.nodes.length === 0 && p.edges.length === 0 ? p : { ...p, viewport: d })
  ), Uf = Le(
    bf
  );
  if (no)
    return null;
  if (so || !a || !W)
    return /* @__PURE__ */ f("main", { className: `ws-page is-${st} ws-loading-screen`, children: /* @__PURE__ */ f("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ f("span", { children: so || "创作空间不存在" }) }) });
  const {
    launcherVisible: Lf,
    panelVisible: Lc
  } = Cp(a.assistant.available, he), Bs = pe?.connection ? we.nodes.find((d) => d.id === pe.connection?.nodeId) : void 0, zr = de && de.menu === pe ? de.candidates : [], $f = Bs ? de?.menu !== pe ? void 0 : zr.length === 0 ? de.warning ? "未能确认可用节点，关闭菜单后可重试。" : pe?.connection?.handleType === "target" ? "没有能为该节点提供输入的节点。" : "没有能接收该节点结果的节点。" : pe?.connection?.handleType !== "target" && !Qt(Bs, "start") && !Dt(Bs) ? "可以先连线，运行下游前请先生成上游结果。" : void 0 : "原节点已不存在，请重新选择。";
  return /* @__PURE__ */ L(
    "main",
    {
      className: `ws-page is-${st} is-${ve}-view ${Lc ? "is-assistant-open" : ""} ${ce ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${be}px`
      },
      children: [
        /* @__PURE__ */ f(
          Hn,
          {
            message: n,
            onDismiss: () => o(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(
          Mw,
          {
            activeCate: W,
            mode: ve,
            interactive: ve === "create",
            canvasCount: un.length,
            activeCanvasName: H.name,
            canvasManagerOpen: ge,
            onOpenCanvasManager: Si,
            nodes: we.nodes,
            edges: we.edges,
            viewport: H.viewport,
            canvasId: H.id,
            selectedNodeId: te,
            selectedNodeIds: T,
            onSelectNodes: Df,
            onOpenNodeMenu: Pf,
            onCopyNode: Ef,
            onDeleteNodes: Of,
            onShowNodeDetail: Er,
            detailNodeIds: dt,
            onDetailNodeProjection: Ti,
            onConfirmStoryboard: As,
            onStoryboardScriptSaved: m,
            onNodesCommit: Ff,
            onEdgesCommit: Bf,
            onConnectedMediaEdgeRemove: Ts,
            onViewportCommit: zf,
            focusNodeRequest: rn,
            onFocusNodeRequestConsumed: Os,
            projectId: r,
            space: a,
            canvasReferenceItems: vn,
            catalogCache: c,
            runningNodes: Ce,
            onNodeResult: et,
            onNodeDraftChange: xs,
            onAssetCreated: Xe,
            canvasRunRecords: ut,
            stoppingCanvasRunKeys: hn,
            onStopCanvasRun: Dc,
            onCreateStoryboards: xi,
            onSettingMaterials: kf,
            onLoadVoiceOptions: xf,
            onReplaceSettingImage: Zo,
            onRunStoryboardFrame: ke,
            onRunFunctionNode: Se,
            onRunBackendNode: Ie,
            onOpenStoryboardGridImport: Uf,
            onClearFeedbackRecords: yo,
            requestConfirm: Tr,
            onOpenFeedbackRecord: U
          },
          H.id
        ),
        /* @__PURE__ */ f(
          Rw,
          {
            space: a,
            cates: Rs,
            activeCate: W,
            canvases: un,
            activeCanvas: H,
            saveStatus: kr[String(H.id)] || "saved",
            hasAssetCates: ks,
            loadingCateId: x,
            onBack: () => {
              _s(() => t({ to: "/bot/work" }));
            },
            onSelectCate: bn,
            onRefresh: () => {
              _s(xr);
            },
            onOpenRunHistory: () => {
              Fn(!0), Br(r, 0);
            },
            onRunHistoryIntent: lm,
            canStopRuns: lf,
            stoppingRuns: Ns || hn.size > 0,
            onStopRuns: ff,
            theme: st,
            onToggleTheme: Af
          }
        ),
        ge ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ f(
              fm,
              {
                errorFeedback: /* @__PURE__ */ f(
                  Hn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                open: !0,
                canvases: un,
                deletedCanvases: q,
                deletedLoading: Q,
                activeCanvasId: H.id,
                disabled: x != null,
                onClose: () => $(!1),
                onSelect: ot,
                onCreate: Ds,
                onRename: Ps,
                onReorder: Fr,
                onDelete: er,
                onRestore: Es
              }
            )
          }
        ) : null,
        Lc ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${be}px`
                },
                children: /* @__PURE__ */ f(De, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ f(
              pm,
              {
                assistant: a.assistant,
                project: a.project,
                team: a.team,
                activeAssetCateID: W.id,
                activeCanvas: H,
                selectedNodes: _i,
                width: be,
                expanded: ce,
                onWidthChange: ki,
                onToggleExpanded: () => ze((d) => !d),
                onClose: () => Ne(!1),
                onFlushCanvas: xt,
                onCanvasChanged: Ri,
                onUploadAssets: Fs
              }
            )
          }
        ) : null,
        Lf ? /* @__PURE__ */ f(
          Dh,
          {
            assistantName: a.assistant.name,
            onIntent: mm,
            onOpen: () => Ne(!0)
          }
        ) : null,
        qo ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ f(
              gm,
              {
                open: !0,
                runs: gt,
                loading: tt,
                error: Nr,
                page: _e,
                hasNextPage: bs,
                onOpenChange: Fn,
                onRefresh: () => Br(r, 0),
                onPreviousPage: () => Br(
                  r,
                  Math.max(0, _e - 2)
                ),
                onNextPage: () => Br(r, _e),
                stoppingRunKeys: hn,
                onStopRun: Dc,
                onLocateRun: (d) => {
                  const p = String(d.start_node_id || "");
                  if (!p)
                    return;
                  Fn(!1), (Number(d.canvas_id || 0) ? ot(Number(d.canvas_id)) : bn(Number(d.asset_cate_id || N))).then((b) => {
                    b && window.requestAnimationFrame(() => ho(p));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ f(
          Tw,
          {
            mode: ve,
            onModeIntent: (d) => {
              d === "result" && ym();
            },
            onSelectMode: (d) => {
              fe(d), Ye(null);
            }
          }
        ),
        vs ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              od,
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
                validateAsset: (d) => Us(d) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: Fs,
                onClose: Fc,
                onConfirm: (d) => {
                  const p = d[0];
                  p && vf(p);
                }
              }
            )
          }
        ) : null,
        Yt ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              od,
              {
                notificationMode: "inline",
                open: !0,
                teamID: a.project.team_id,
                scopeProjectID: a.project.id,
                title: Number.isInteger(Yt.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(Yt.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${jn} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: a.project.id,
                  canvasID: H.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(Yt.frameIndex),
                maxSelection: jn,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (d) => d.kind !== "image" ? "请选择图片资产。" : Us(d) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: Fs,
                onClose: () => ro(null),
                onConfirm: (d) => {
                  Nf(d);
                }
              }
            )
          }
        ) : null,
        ve === "result" ? /* @__PURE__ */ f("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载资产" }), children: /* @__PURE__ */ f(
          hm,
          {
            notificationMode: "inline",
            teamID: a.project.team_id,
            scopeProjectID: a.project.id,
            scopeCanvasID: H.id,
            onLocalUpload: Fs,
            initialFilters: {
              sourceType: "project",
              projectID: a.project.id,
              canvasID: H.id,
              assetCateID: ks ? W.id : 0
            },
            headerAction: /* @__PURE__ */ f(mt, { label: "关闭资产", children: /* @__PURE__ */ L("button", { type: "button", onClick: () => fe("create"), children: [
              /* @__PURE__ */ f(Au, { "aria-hidden": "true" }),
              /* @__PURE__ */ f("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        vt ? /* @__PURE__ */ f(
          cb,
          {
            errorFeedback: /* @__PURE__ */ f(
              Hn,
              {
                message: n,
                onDismiss: () => o("")
              }
            ),
            prompt: vt.prompt,
            running: zn,
            readonly: sh(
              vt,
              we.nodes,
              lt.current
            ),
            history: Ro(
              we.nodes.find(
                (d) => d.id === vt.node.id
              ) || vt.node
            ),
            activeRecordId: vt.recordId,
            onSelectRecord: (d) => {
              const p = we.nodes.find(
                (g) => g.id === vt.node.id
              ) || vt.node;
              Ft({
                node: p,
                recordId: d.id,
                prompt: {
                  ...d.prompt,
                  values: d.values || d.prompt.values || {}
                }
              });
            },
            onClose: A,
            onSubmit: B
          },
          `${vt.node.id}-${vt.recordId}`
        ) : null,
        Ko ? /* @__PURE__ */ f(
          Aw,
          {
            onError: o,
            request: Ko,
            onClose: () => oo(null)
          }
        ) : null,
        qn && !ui(qn.document) ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载分镜确认", overlay: !0 }),
            children: /* @__PURE__ */ f(
              wm,
              {
                errorFeedback: /* @__PURE__ */ f(
                  Hn,
                  {
                    message: n,
                    onDismiss: () => o("")
                  }
                ),
                storyboard: qn.document,
                submitting: $o,
                onClose: () => on(null),
                onConfirm: Mi
              }
            )
          }
        ) : null,
        pe ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ f(
              vm,
              {
                menu: pe,
                overDetail: !!(pe.connection && at),
                flows: pe.connection ? [] : Ci,
                powers: pe.connection ? zr.flatMap(({ node: d }) => d.power ? [d.power] : []) : Ar,
                powerCategories: Cs,
                roles: pe.connection ? zr.flatMap(({ node: d }) => d.role ? [d.role] : []) : Mr,
                reference: pe.connection ? {
                  loading: !!(Bs && de?.menu !== pe),
                  notice: $f,
                  warning: de?.menu === pe ? de.warning : void 0,
                  functions: zr.flatMap(({ node: d }) => d.functionOption ? [d.functionOption] : []),
                  describePower: (d) => zr.find(({ node: p }) => p.power === d)?.description
                } : void 0,
                onClose: () => Ye(null),
                onSelectFlow: (d) => _f(d, pe.position),
                onSelectFunction: (d) => pe.connection ? Ei(d) : Tf(d, pe.position),
                onSelectGroup: () => Rf(pe.position),
                onSelectRole: (d) => pe.connection ? Ei(d) : Sf(d, pe.position),
                onSelectPower: (d) => pe.connection ? Ei(d) : If(d, pe.position)
              }
            )
          }
        ) : null,
        Te && Te.menu.canvasId === H.id ? /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载用途选项", overlay: !0 }), children: /* @__PURE__ */ f(
          Cu,
          {
            sourceTitle: Te.sourceTitle,
            targetTitle: Te.targetTitle,
            params: Te.plan.kind === "media" ? Te.plan.options : Te.plan.params,
            media: Te.plan.kind === "media",
            overDetail: !!at,
            lyricsAvailable: Te.plan.kind === "text" && Te.plan.lyricsAvailable,
            onClose: zc,
            onSelect: (d) => Uc({ kind: Te.plan.kind, key: d }),
            onSelectLyrics: () => Uc({ kind: "lyrics" })
          }
        ) }) : null,
        [at, ys].map((d, p) => d ? /* @__PURE__ */ f(
          bm,
          {
            onError: () => {
              Ms(!!p), o("节点详情加载失败。请保存画布改动后刷新页面，再打开详情。");
            },
            children: /* @__PURE__ */ f(
              Nm,
              {
                canvasId: H.id,
                layer: p ? "nested" : "default",
                projectId: a.project.id,
                teamId: a.team.id,
                assetCateId: Number(
                  d.assetCateId || d.asset?.asset_cate_id || W?.id || 0
                ),
                node: d,
                readonly: ve !== "create",
                storyboardFocus: p ? void 0 : ws,
                storyboardInitialSectionId: p ? void 0 : Pn,
                storyboardWorkspace: d.storyboardWorkspace,
                canvasNodes: we.nodes,
                canvasEdges: we.edges,
                connectedMediaReferences: al(
                  we.nodes,
                  we.edges,
                  d.id
                ),
                canvasReferenceItems: vn.filter(
                  (g) => g.source !== "current" || g.id !== d.id
                ),
                onNodeDraftChange: (g) => {
                  g && (xs(d.id, g), $e(
                    (b) => b?.id === d.id ? { ...b, composerDraft: g } : b
                  ));
                },
                onConnectedMediaEdgeRemove: Ts,
                onRunNode: Ie,
                onAssetUpdated: (g) => Or(d, g),
                onConfirmStoryboard: (g, b) => As(d.id, b, g),
                onClose: () => Ms(!!p)
              }
            )
          },
          d.id
        ) : null),
        An ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Im,
              {
                notificationMode: "inline",
                teamID: a.project.team_id,
                assetID: An.assetID,
                layer: "nested",
                onAssetChanged: w,
                onClose: () => Dn(null)
              }
            )
          }
        ) : null
      ]
    }
  );
}
function Rw({
  space: e,
  cates: t,
  activeCate: n,
  canvases: o,
  activeCanvas: s,
  saveStatus: r,
  hasAssetCates: i,
  loadingCateId: c,
  onBack: a,
  onSelectCate: u,
  onRefresh: l,
  onOpenRunHistory: y,
  onRunHistoryIntent: v,
  canStopRuns: N,
  stoppingRuns: I,
  onStopRuns: R,
  theme: x,
  onToggleTheme: P
}) {
  const D = Math.max(
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
          children: /* @__PURE__ */ f(fg, { size: 18 })
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
          "--ws-cate-active": D
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
                u(T.id);
              },
              children: [
                c === T.id ? /* @__PURE__ */ f(Do, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ f("span", { className: "ws-cate-name", children: T.name })
              ]
            },
            T.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ L("div", { className: `ws-top-actions ${N ? "has-running" : ""}`, children: [
      /* @__PURE__ */ f(kw, { status: r }),
      N ? /* @__PURE__ */ f(mt, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: I,
          onClick: R,
          children: [
            I ? /* @__PURE__ */ f(Do, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(pg, { size: 13, fill: "currentColor" }),
            I ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ f(mt, { label: "查看画布运行记录", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: v,
          onFocus: v,
          onClick: y,
          children: [
            /* @__PURE__ */ f(mg, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: P, children: [
        x === "dark" ? /* @__PURE__ */ f(gg, { size: 15 }) : /* @__PURE__ */ f(yg, { size: 15 }),
        x === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: l, children: [
        /* @__PURE__ */ f(qa, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function kw({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ f(mt, { label: t, children: /* @__PURE__ */ L("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ f(Do, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(Du, { size: 14 }),
    t
  ] }) });
}
const xw = [
  { key: "create", label: "创作", icon: hg },
  { key: "result", label: "资产", icon: wg }
];
function Tw({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ f("nav", { className: "ws-dock", "aria-label": "画布视角", children: xw.map((o) => {
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
const Mw = Va(function({
  activeCate: t,
  mode: n,
  interactive: o,
  canvasCount: s,
  activeCanvasName: r,
  canvasManagerOpen: i,
  onOpenCanvasManager: c,
  nodes: a,
  edges: u,
  viewport: l,
  canvasId: y,
  selectedNodeId: v,
  selectedNodeIds: N,
  onSelectNodes: I,
  onOpenNodeMenu: R,
  onCopyNode: x,
  onDeleteNodes: P,
  onShowNodeDetail: D,
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
  projectId: Q,
  space: me,
  canvasReferenceItems: ye,
  catalogCache: ve,
  runningNodes: fe,
  onNodeResult: he,
  onNodeDraftChange: Be,
  onAssetCreated: ce,
  canvasRunRecords: ze,
  stoppingCanvasRunKeys: be,
  onStopCanvasRun: Et,
  onCreateStoryboards: st,
  onSettingMaterials: to,
  onLoadVoiceOptions: pe,
  onReplaceSettingImage: Ye,
  onRunStoryboardFrame: de,
  onRunFunctionNode: it,
  onRunBackendNode: Te,
  onOpenStoryboardGridImport: Tn,
  onClearFeedbackRecords: no,
  requestConfirm: wt,
  onOpenFeedbackRecord: Bo
}) {
  const [Ce, zo] = K(null), [Mn, Uo] = K(""), [Lo, mn] = K(""), [en, at] = K(""), [ct, ys] = K(null), [_t, tn] = K(null), [nn, dt] = K(""), [$e, gn] = K(null), [on, $o] = K(() => /* @__PURE__ */ new Map()), [hs, je] = K(""), [An, Dn] = K(!1), [ws, Vo] = K(!1), [Pn, jo] = K(1), Ko = ne(1), oo = ne(1), rn = ne(null), [En, vs] = K(null), Wt = se(
    () => new Set(N),
    [N]
  ), sn = ne(null), Ht = ne(null), Yt = ne(!1), ro = ne(!1), so = ne(!1), yn = ne(null), ut = ne(!1), Ue = ne(u);
  ns(() => {
    Ue.current = u;
  }, [u]);
  const gt = O((m) => {
    const w = No(m);
    Ko.current = w, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current), rn.current = null, oo.current = w, Yd(sn.current, w), jo(
      (k) => Math.abs(k - w) > 5e-3 ? w : k
    );
  }, []), io = O((m) => {
    const w = No(m);
    if (Ko.current = w, !(Math.abs(oo.current - w) <= 5e-3) && rn.current == null) {
      if (typeof window > "u") {
        oo.current = w, jo(w);
        return;
      }
      rn.current = window.requestAnimationFrame(() => {
        rn.current = null;
        const k = Ko.current;
        oo.current = k, Yd(sn.current, k);
      });
    }
  }, []);
  ue(
    () => () => {
      Ht.current = null, rn.current != null && typeof window < "u" && window.cancelAnimationFrame(rn.current);
    },
    []
  );
  const tt = O(
    (m, w = {}) => {
      const k = Ue.current;
      Ue.current = m, F(m);
      const B = new Set(
        m.filter((Z) => Gn(Z) === "media").map((Z) => {
          const M = fn(Z);
          return `${M.sourceNodeId}\0${M.targetNodeId}`;
        })
      ), A = /* @__PURE__ */ new Map();
      for (const Z of k) {
        if (Gn(Z) !== "media")
          continue;
        const M = fn(Z), oe = `${M.sourceNodeId}\0${M.targetNodeId}`;
        if (B.has(oe))
          continue;
        const ke = A.get(M.targetNodeId) || /* @__PURE__ */ new Set();
        ke.add(M.sourceNodeId), A.set(M.targetNodeId, ke);
      }
      const U = new Map(w.draftByNodeId);
      for (const [Z, M] of A) {
        const oe = a.find((Se) => Se.id === Z), ke = oe?.composerDraft;
        let Ie = U.get(Z) || ke;
        if (!(!oe || !Ie)) {
          for (const Se of M)
            Ie = ed(
              Ie,
              Se
            );
          Ie !== ke ? U.set(oe.id, Ie) : U.delete(oe.id);
        }
      }
      const X = [...U].map(([Z, M]) => ({
        nodeId: Z,
        draft: M
      }));
      X.forEach((Z, M) => {
        Be(
          Z.nodeId,
          Z.draft,
          M === X.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, F, Be]
  ), On = O(
    (m) => {
      const w = Object.entries(m);
      if (w.length === 0)
        return;
      const k = new Map(w);
      let B = !1;
      const A = Ue.current.map((U) => {
        if (!k.has(U.id))
          return U;
        const X = k.get(U.id) || void 0;
        return (U.mediaUsage || void 0) === X ? U : (B = !0, { ...U, mediaUsage: X });
      });
      B && tt(A);
    },
    [tt]
  ), Nr = O(
    (m) => {
      const w = Ue.current.filter((k) => k.id !== m);
      w.length !== Ue.current.length && (Ue.current = w, dt((k) => k === m ? "" : k), ge(m));
    },
    [ge]
  ), ao = O(
    (m, w) => {
      const k = Ue.current, B = k.filter((X) => {
        const Z = fn(X);
        return !(Gn(X) === "media" && Z.sourceNodeId === m && Z.targetNodeId === w);
      });
      if (B.length !== k.length) {
        dt(""), tt(B);
        return;
      }
      const A = a.find((X) => X.id === w);
      if (!A?.composerDraft)
        return;
      const U = ed(
        A.composerDraft,
        m
      );
      U !== A.composerDraft && Be(w, U, { save: "immediate" });
    },
    [tt, a, Be]
  ), qo = O(
    (m, w) => {
      if (at(""), !o)
        return;
      const k = a.find((A) => A.id === m);
      if (!k)
        return;
      const B = Hy(a, m, w, {
        x: k.x,
        y: k.y,
        ...Ma(k)
      });
      B !== a && re(B);
    },
    [o, a, re]
  ), Fn = O(
    (m, w) => {
      if (at(""), !o)
        return;
      const k = Yy(a, m, w);
      k !== a && re(k);
    },
    [o, a, re]
  ), _e = ne({
    onSettingMaterials: to,
    onLoadVoiceOptions: pe,
    onReplaceSettingImage: Ye,
    onNodeResult: he,
    onNodeDraftChange: Be,
    onAssetCreated: ce,
    onRunFunctionNode: it,
    onOpenStoryboardGridImport: Tn,
    onClearFeedbackRecords: no,
    onOpenFeedbackRecord: Bo,
    onShowNodeDetail: D,
    onConfirmStoryboard: te,
    onStoryboardScriptSaved: G,
    requestConfirm: wt,
    onRunBackendNode: Te,
    onConnectedMediaUsagesChange: On,
    onConnectedMediaEdgeRemove: Nr,
    onTextParamConnectionRemove: ao,
    onNodeResizeStart: at,
    onNodeResizeEnd: qo,
    onResultViewResizeEnd: Fn
  });
  ns(() => {
    _e.current = {
      onSettingMaterials: to,
      onLoadVoiceOptions: pe,
      onReplaceSettingImage: Ye,
      onNodeResult: he,
      onNodeDraftChange: Be,
      onAssetCreated: ce,
      onRunFunctionNode: it,
      onOpenStoryboardGridImport: Tn,
      onClearFeedbackRecords: no,
      onOpenFeedbackRecord: Bo,
      onShowNodeDetail: D,
      onConfirmStoryboard: te,
      onStoryboardScriptSaved: G,
      requestConfirm: wt,
      onRunBackendNode: Te,
      onConnectedMediaUsagesChange: On,
      onConnectedMediaEdgeRemove: Nr,
      onTextParamConnectionRemove: ao,
      onNodeResizeStart: at,
      onNodeResizeEnd: qo,
      onResultViewResizeEnd: Fn
    };
  }, [
    to,
    pe,
    Ye,
    ce,
    no,
    Be,
    he,
    Bo,
    Tn,
    Te,
    it,
    D,
    te,
    G,
    Nr,
    ao,
    wt,
    qo,
    Fn,
    On
  ]);
  const Bn = se(
    () => ({
      onSettingMaterials: (m, w) => _e.current.onSettingMaterials(m, w),
      onLoadVoiceOptions: () => _e.current.onLoadVoiceOptions(),
      onReplaceSettingImage: (m) => _e.current.onReplaceSettingImage(m),
      onNodeResult: (m, w) => _e.current.onNodeResult(m, w),
      onNodeDraftChange: (m, w, k) => _e.current.onNodeDraftChange(m, w, k),
      onAssetCreated: (m) => _e.current.onAssetCreated(m),
      onRunFunctionNode: (m) => _e.current.onRunFunctionNode(m),
      onOpenStoryboardGridImport: (m, w) => _e.current.onOpenStoryboardGridImport(m, w),
      onClearFeedbackRecords: (m) => _e.current.onClearFeedbackRecords(m),
      onOpenFeedbackRecord: (m, w) => _e.current.onOpenFeedbackRecord(m, w),
      onShowNodeDetail: (m, w, k) => _e.current.onShowNodeDetail(
        m,
        w,
        k
      ),
      onConfirmStoryboard: (m) => _e.current.onConfirmStoryboard(m),
      onStoryboardScriptSaved: (m, w, k) => _e.current.onStoryboardScriptSaved(m, w, k),
      requestConfirm: (m) => _e.current.requestConfirm(m),
      onRunBackendNode: (m, w) => _e.current.onRunBackendNode(m, w),
      onConnectedMediaUsagesChange: (m) => _e.current.onConnectedMediaUsagesChange(m),
      onConnectedMediaEdgeRemove: (m) => _e.current.onConnectedMediaEdgeRemove(m),
      onTextParamConnectionRemove: (m, w) => _e.current.onTextParamConnectionRemove(
        m,
        w
      ),
      onNodeResizeStart: (m) => _e.current.onNodeResizeStart(m),
      onNodeResizeEnd: (m, w) => _e.current.onNodeResizeEnd(m, w),
      onResultViewResizeEnd: (m, w) => _e.current.onResultViewResizeEnd(m, w)
    }),
    []
  ), bs = ne(void 0), ae = se(() => {
    const m = Sv(
      a,
      u,
      bs.current
    );
    return bs.current = m, m;
  }, [u, a]), hn = se(
    () => bh(
      a,
      (m) => (ae.hasResultByNodeId.get(m.id) || !1) && !ar(m, a)
    ),
    [ae.hasResultByNodeId, a]
  ), yt = hn.frames, Ns = se(
    () => new Map(yt.map((m) => [m.id, m])),
    [yt]
  ), Ot = se(
    () => new Map(yt.map((m) => [m.sourceNodeId, m])),
    [yt]
  ), vt = se(
    () => new Map(
      yt.map((m) => [
        m.id,
        bl(
          m,
          a,
          u,
          (w) => (ae.hasResultByNodeId.get(w.id) || !1) && !ar(w, a),
          ae.nodeById
        )
      ])
    ),
    [
      ae.hasResultByNodeId,
      ae.nodeById,
      u,
      a,
      yt
    ]
  ), Ft = se(() => {
    const m = /* @__PURE__ */ new Map();
    for (const w of ze) {
      if (!br(w))
        continue;
      const k = Number(w.canvas_id || 0);
      if (k > 0 && k !== y)
        continue;
      const B = String(w.start_node_id || "").trim();
      B && !m.has(B) && m.set(B, w);
    }
    return m;
  }, [y, ze]), { latestCanvasRunByStartNodeId: zn, activeCanvasRunByStartNodeId: wn } = se(() => {
    const m = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
    for (const k of ze) {
      const B = Number(k.canvas_id || 0);
      if (B > 0 && B !== y) continue;
      const A = String(k.start_node_id || "").trim();
      A && (m.has(A) || m.set(A, k), Sn(k) && !w.has(A) && w.set(A, k));
    }
    return { latestCanvasRunByStartNodeId: m, activeCanvasRunByStartNodeId: w };
  }, [y, ze]), Re = hn.sourceNodeIds, co = hn.sourceNodeIdByNodeId, Bt = se(
    () => new Set(
      yt.flatMap(
        (m) => m.memberNodeIds.filter(
          (w) => w !== m.sourceNodeId
        )
      )
    ),
    [yt]
  ), uo = Le(
    (m, w) => {
      const k = Ns.get(m), B = vt.get(m);
      if (!k || !B)
        return;
      const A = B.pendingNodeIds.length, U = Math.max(0, k.workNodeCount - A);
      wt({
        title: `执行“${k.title}”制作区？`,
        description: `将执行 ${A} 个待处理节点${U > 0 ? `，跳过 ${U} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => de(w)
      });
    }
  ), zt = Le(
    (m) => {
      const w = Ft.get(m);
      w && Sn(w) && Et(w);
    }
  ), Je = Le((m) => {
    const w = ae.nodeById.get(m);
    w && af({
      group: w,
      sourceNode: w,
      members: ae.groupMembersById.get(m) || Gs,
      runNode: Te,
      hasResult: (k) => Dt(k) && !ar(k, a),
      onError: je
    });
  }), Ir = Le((m) => {
    const w = ae.nodeById.get(m);
    w && Te(w).catch(
      (k) => je(
        k instanceof Error ? k.message : "节点运行失败"
      )
    );
  }), Ut = Le((m) => {
    const w = wn.get(m);
    w && Et(w);
  }), Rt = Le((m) => {
    const w = ae.nodeById.get(m);
    w && D(w);
  }), Cr = Le((m, w) => {
    o && R(w, Kr(Ce, w), { nodeId: m, handleType: "source" });
  }), an = se(
    () => a.map((m) => m.id).join("\0"),
    [a]
  ), Jt = se(
    () => new Set(
      an ? an.split("\0") : []
    ),
    [an]
  ), lo = se(
    () => an ? `${t.id}:${an}` : "",
    [t.id, an]
  ), Un = Le(
    (m, w) => /* @__PURE__ */ f(wc.Provider, { value: !0, children: /* @__PURE__ */ f(vw, { data: m, selected: w }) })
  ), [Go] = K(eh), Wo = se(
    () => /* @__PURE__ */ new Set([...Jt, ...yt.map((m) => m.id)]),
    [Jt, yt]
  ), Is = se(() => {
    const m = Go.reuse, w = me?.project.team_id || 0, k = [
      Q,
      y,
      me,
      ve,
      ye,
      o,
      Bn,
      ae,
      Je,
      Ir,
      Rt,
      Ut,
      st
    ], B = (M) => (ae.hasResultByNodeId.get(M.id) || !1) && !ar(M, a), A = (M, oe = !1) => {
      const ke = !oe && Wt.has(M.id), Ie = ar(M, a) || Cy(M, a, u), Se = ke && N.length === 1 && Aa(M), xe = M.type === "power" ? Xn(M.power, M.kind, M.outputType).viewMode : "", Ze = oe || Se, Zt = Ze ? me : null, Ke = Ze || xe === "storyboard" || xe === "video_compose" ? ye : uw, ot = (oe || xe === "video_compose" || Se) && ae.incomingMediaReferencesByNodeId.get(M.id) || Fd, bn = Re.has(M.id), Ds = co.get(M.id) || "", Ps = Ds && ae.nodeById.get(Ds) || null, Fr = fe[M.id] || null, er = zn.get(M.id), Es = !!(er && be.has(ht(er))), Nn = M.type === "group" && ae.groupMembersById.get(M.id) || Gs, ho = ae.inputContextByNodeId.get(M.id) || null, Os = ae.runBlockedReasonByNodeId.get(M.id) || "";
      return m(
        oe ? "embedded" : "node",
        M.id,
        [
          M,
          Q,
          y,
          w,
          Zt,
          ve,
          Fr,
          er,
          Es,
          Nn,
          ...Nn.map((Ai) => fe[Ai.id]),
          Ke,
          ot,
          o,
          bn,
          Ps,
          Os,
          Se,
          Bn,
          ho,
          Ut,
          st,
          Ie
        ],
        () => ({
          ...M,
          sourceNode: M,
          projectId: Q,
          canvasId: y,
          teamId: w,
          space: Zt,
          catalogCache: ve,
          runningNode: Fr,
          canvasRun: er,
          canvasRunStopping: Es,
          onStopNodeCanvasRun: Ut,
          onCreateStoryboards: st,
          settingUpdateReason: Ie,
          groupMembers: Nn,
          groupRuntime: M.type === "group" ? oc({
            members: Nn,
            runningNodes: fe,
            groupState: Fr,
            hasResult: B
          }) : null,
          canvasReferenceItems: Ke,
          connectedMediaReferences: ot,
          interactive: o,
          structureLocked: bn,
          storyboardSourceNode: Ps,
          runBlockedReason: Os,
          showNodeSettings: Se,
          ...oe ? { embedded: !0 } : {},
          ...Bn,
          inputContext: ho
        })
      );
    }, U = (M) => {
      const oe = vt.get(M.id), ke = Ft.get(M.sourceNodeId), Ie = !!(ke && Sn(ke) && be.has(ht(ke)));
      return m(
        "frame",
        M.id,
        [
          M,
          oe,
          ke,
          fe[M.id],
          ...k,
          uo,
          zt,
          Un,
          Cr,
          ...M.memberNodeIds.flatMap((Se) => {
            const xe = zn.get(Se), Ze = wn.get(Se);
            return [
              fe[Se],
              xe,
              Ze,
              !!(xe && be.has(ht(xe))),
              !!(Ze && be.has(ht(Ze)))
            ];
          }),
          Ie
        ],
        () => {
          const Se = ke && Sn(ke) ? ke : void 0, xe = !!Se || $t(fe[M.id]), Ze = xe ? "" : oe?.blockedReason || "", Zt = Hw(
            M,
            Se,
            fe,
            ae.nodeById
          ) || (xe ? "准备执行" : "");
          return {
            frameId: M.id,
            sourceNodeId: M.sourceNodeId,
            groupCount: M.groupCount + Number(
              M.workNodeIds.some(
                (Ke) => ae.nodeById.get(Ke)?.storyboardItem?.itemType === "video_compose"
              )
            ),
            workNodeCount: M.workNodeCount,
            completedCount: M.completedCount,
            running: xe,
            stopping: Ie,
            executionStatus: Yw(
              ke,
              fe[M.id],
              Ie
            ),
            currentNodeTitle: Zt,
            runBlockedReason: Ze,
            groups: Jw({
              frame: M,
              edges: u,
              nodeById: ae.nodeById,
              groupMembersById: ae.groupMembersById,
              runBlockedReasonByNodeId: ae.runBlockedReasonByNodeId,
              runningNodes: fe,
              activeRunByStartNodeId: wn,
              stoppingCanvasRunKeys: be,
              hasResult: B,
              onRunGroup: Je,
              onRunNode: Ir,
              onStopRun: Ut,
              onOpenNode: Rt,
              projectNode: (Ke) => A(Ke, !0),
              reuse: m,
              projectionDependencies: (Ke) => [
                ...k,
                ...Ke.flatMap((ot) => {
                  const bn = zn.get(ot.id);
                  return [
                    bn,
                    !!(bn && be.has(ht(bn))),
                    Re.has(ot.id),
                    co.get(ot.id)
                  ];
                })
              ]
            }),
            settingSource: (() => {
              const Ke = u.filter((ot) => (ot.logicalTo || ot.to) === M.sourceNodeId && ot.executionMode !== "manual").map((ot) => Nu(a, ot.logicalFrom || ot.from)).find(Boolean);
              return Ke ? { title: Ke.title, onOpen: () => Rt(Ke.id) } : void 0;
            })(),
            renderNode: Un,
            onReferenceResult: o ? Cr : void 0,
            onRun: () => uo(M.id, M.sourceNodeId),
            onStop: Se ? () => zt(M.sourceNodeId) : void 0
          };
        }
      );
    }, X = (M) => {
      const oe = { x: M.x, y: M.y }, ke = Wt.has(M.id), Ie = A(M), Se = Ot.get(M.id), xe = Se ? U(Se) : void 0;
      return m(
        "flow",
        M.id,
        [Ie, xe, ke, o],
        () => {
          const Ze = xe ? { ...Ie, storyboardWorkspace: xe } : Ie, Zt = M.type === "group" ? 1 : M.groupId ? 3 : 2, Ke = Ma(M);
          return {
            id: M.id,
            type: "workSpace",
            position: oe,
            data: Ze,
            selected: ke,
            className: `ws-flow-node ws-flow-node-${M.type}`,
            draggable: o && (!Ze.structureLocked || !!Se),
            deletable: !Ze.structureLocked,
            zIndex: Zt,
            ...Hv(Ke)
          };
        }
      );
    }, Z = a.filter((M) => !Bt.has(M.id)).map(X);
    return Go.retain(Wo), Z;
  }, [
    wn,
    zn,
    ae,
    Ft,
    Bt,
    o,
    Go,
    Wo,
    Re,
    a,
    y,
    Q,
    fe,
    N.length,
    Wt,
    me,
    ve,
    ye,
    Je,
    Ir,
    uo,
    Un,
    Rt,
    Ut,
    st,
    zt,
    Bn,
    Ot,
    vt,
    co,
    be
  ]), Ho = Ky(
    Is,
    vb
  ), Yo = se(() => T.flatMap((m) => {
    if (!m) return [];
    for (const w of Ho) {
      const k = w.data;
      if (k.id === m) return [k];
      for (const B of k.storyboardWorkspace?.groups || []) {
        const A = B.results.find(
          (U) => U.nodeId === m
        );
        if (A) return [A.node];
      }
    }
    return [];
  }), [T, Ho]);
  ue(() => {
    for (const m of Yo) V(m);
  }, [V, Yo]);
  const { flowNodes: fo, setFlowNodes: Ln } = jy(
    Ho,
    Lo || en
  ), Sr = O(
    (m) => {
      o && (dt(""), tt(u.filter((w) => w.id !== m)));
    },
    [tt, u, o]
  ), lt = O(
    (m) => {
      !o || !u.some((w) => w.id === m) || wt({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => Sr(m)
      });
    },
    [Sr, u, o, wt]
  ), Jo = O(
    (m) => {
      if (!o || m.length === 0)
        return;
      const w = Fl(a, m);
      if (w.size === 0)
        return;
      if ([...w].some(
        (A) => Re.has(A)
      )) {
        je(
          "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
        );
        return;
      }
      const k = m.length === 1 ? m[0] : null, B = m.some((A) => A.type === "group");
      wt({
        title: k ? `删除「${k.title}」` : `删除 ${w.size} 个节点`,
        description: B ? "会同时删除组内节点，并移除与这些节点相连的连线。" : k ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          dt(""), P(m);
        }
      });
    },
    [
      o,
      Re,
      a,
      P,
      wt
    ]
  ), Me = O(
    (m, w = []) => {
      if (!o || m.length === 0)
        return;
      const k = new Set(
        m.flatMap((M) => M.memberNodeIds)
      ), B = /* @__PURE__ */ new Set([
        ...k,
        ...w.map((M) => M.id)
      ]), A = a.filter((M) => B.has(M.id));
      if (A.length === 0)
        return;
      const U = m.length === 1 && w.every((M) => k.has(M.id)) ? m[0] : null, X = A.filter(
        (M) => M.type === "group"
      ).length, Z = A.length - X;
      wt({
        title: U ? `删除「${U.title}」制作区` : `删除 ${A.length} 个节点`,
        description: U ? `将删除其中 ${X} 个分组和 ${Z} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          dt(""), P(A, { allowStoryboardFrame: !0 });
        }
      });
    },
    [o, a, P, wt]
  ), Cs = se(
    () => u.filter(
      (m) => Jt.has(m.from) && Jt.has(m.to) && !Bt.has(m.from) && !Bt.has(m.to)
    ).map((m) => {
      const w = fn(m), k = ae.nodeById.get(
        w.sourceNodeId
      ), B = ae.nodeById.get(
        w.targetNodeId
      ), A = $i(
        B?.composerDraft,
        w.sourceNodeId,
        on.get(w.targetNodeId)
      ), U = !!(Gn(m) === "media" && B?.type === "power" && B.power && (A || ir(k))), X = on.get(
        w.targetNodeId
      ), Z = U && B && X ? ga(
        B,
        X,
        w.sourceNodeId
      ) : void 0, M = Ks(B), oe = U ? Hp(
        A,
        Z,
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
          purpose: Gn(m),
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
      Jt,
      ae.nodeById,
      u,
      Bt
    ]
  );
  ue(() => {
    if (!Ce || !lo || q || l.zoom != null || typeof window > "u")
      return;
    const m = setTimeout(() => {
      Ce.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(m);
  }, [lo, Ce, q, l.zoom]), ue(() => {
    if (!Ce || !q || typeof window > "u")
      return;
    const m = a.find(
      (A) => A.id === q.nodeId
    );
    if (!m) {
      z(q);
      return;
    }
    const w = Bt.has(m.id) ? yt.find(
      (A) => A.memberNodeIds.includes(m.id)
    ) : void 0, k = w && a.find((A) => A.id === w.sourceNodeId) || m, B = window.setTimeout(() => {
      const A = { x: k.x, y: k.y }, U = k.type === "power" ? 1.02 : 0.96;
      Ce.setCenter?.(
        A.x + (k.width || 180) / 2,
        A.y + (k.height || 180) / 2,
        { zoom: U, duration: 320 }
      ), gt(U), z(q);
    }, 80);
    return () => window.clearTimeout(B);
  }, [
    Ce,
    gt,
    q,
    Bt,
    a,
    z,
    yt
  ]);
  const kt = O(
    (m) => {
      if (!o)
        return;
      const w = m.map((A) => {
        if (A.type !== "position" || !A.position)
          return A;
        const U = Bi(
          a,
          A.id,
          A.position
        );
        return U === A.position ? A : {
          ...A,
          position: U,
          ...A.positionAbsolute ? { positionAbsolute: U } : {}
        };
      });
      Ln((A) => Xm(w, A));
      const k = new Set(N);
      let B = !1;
      for (const A of m)
        A.type === "select" && (B = !0, A.selected ? (k.delete(A.id), k.add(A.id)) : k.delete(A.id));
      B && I([...k]);
    },
    [o, a, I, N, Ln]
  ), Xt = O(
    (m) => sl(
      ve,
      Q,
      Number(me.release?.id || me.project.release_id || 0),
      m
    ),
    [ve, Q, me.project.release_id, me.release?.id]
  ), cn = se(() => {
    const m = new Set(
      u.flatMap((w) => {
        if (Gn(w) !== "media")
          return [];
        const k = fn(w), B = ae.nodeById.get(
          k.sourceNodeId
        ), A = ae.nodeById.get(
          k.targetNodeId
        );
        return A?.type === "power" && A.power && ir(B) ? [A.id] : [];
      })
    );
    for (const w of a)
      w.type === "power" && w.power && (Object.keys(w.composerDraft?.paramBindings || {}).length > 0 || w.composerDraft?.storyboardLyricsSourceNodeId) && m.add(w.id);
    return a.filter((w) => m.has(w.id));
  }, [ae.nodeById, u, a]);
  ue(() => {
    if (cn.length === 0)
      return;
    let m = !1;
    return Promise.all(
      cn.map(
        async (w) => {
          try {
            const k = await Xt(w);
            return [w.id, k.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((w) => {
      m || $o(
        new Map(
          w.filter(
            (k) => !!k
          )
        )
      );
    }), () => {
      m = !0;
    };
  }, [Xt, cn]);
  const bt = O(
    (m, w, k) => {
      const B = a.some((Z) => Z.id === m), A = a.find((Z) => Z.id === w);
      if (!B || !A) {
        je("节点已变化，请重新连接");
        return;
      }
      const U = cs(A);
      if (!Yp(
        U,
        k,
        m
      )) {
        je("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const X = vu(
        U,
        m,
        k
      );
      tt(
        Tt(
          a,
          Wn(Ue.current, m, w, a)
        ),
        X !== U ? { draftByNodeId: /* @__PURE__ */ new Map([[A.id, X]]) } : void 0
      );
    },
    [tt, a]
  ), dn = O(
    (m, w) => {
      const k = a.find((Z) => Z.id === m), B = a.find((Z) => Z.id === w);
      if (!B || !ir(k) || !Ks(B)) {
        je("节点已变化，请重新连接");
        return;
      }
      const A = cs(B), U = bu(
        A,
        m
      ), X = Ql(Ue.current, m, B);
      X.length !== Ue.current.length && dt(""), tt(
        Tt(
          a,
          Wn(X, m, w, a)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[B.id, U]]) }
      );
    },
    [tt, a]
  );
  ue(() => {
    for (const m of cn) {
      const w = on.get(m.id);
      if (!w)
        continue;
      const k = u.flatMap((A) => {
        if (Gn(A) !== "media")
          return [];
        const U = fn(A);
        if (U.targetNodeId !== m.id)
          return [];
        const X = ae.nodeById.get(
          U.sourceNodeId
        );
        return m.composerDraft?.storyboardLyricsSourceNodeId === U.sourceNodeId ? [] : ir(X) ? [U.sourceNodeId] : [];
      }), B = Jp(
        k,
        m.composerDraft,
        il(m, w)
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
    u,
    cn
  ]);
  const _r = O(
    async (m) => {
      if (!o)
        return;
      const w = Ue.current.find(
        (Z) => Z.id === m
      );
      if (!w)
        return;
      const { sourceNodeId: k, targetNodeId: B } = fn(w), A = a.find((Z) => Z.id === k), U = a.find((Z) => Z.id === B), X = $i(
        U?.composerDraft,
        k
      );
      if (!(U?.type !== "power" || !U.power || !X && !ir(A)))
        try {
          const Z = await Xt(U), M = ga(
            U,
            Z.params || [],
            k
          ), oe = $i(
            U.composerDraft,
            k,
            Z.params || []
          ), ke = Ks(U);
          if ($o((Se) => {
            const xe = new Map(Se);
            return xe.set(B, Z.params || []), xe;
          }), dt(m), ke) {
            gn({
              sourceNodeId: k,
              targetNodeId: B,
              sourceTitle: A?.title || "上游节点",
              targetTitle: U.title || U.power.name,
              params: M,
              selectedParamKey: oe?.purpose === "param" ? oe.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: oe?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const Ie = Xp(M);
          if (Ie.kind === "unavailable") {
            je("当前能力没有可用的文本参数");
            return;
          }
          if (Ie.kind === "automatic") {
            oe?.targetParamKey !== Ie.targetParamKey && bt(
              k,
              B,
              Ie.targetParamKey
            );
            return;
          }
          gn({
            sourceNodeId: k,
            targetNodeId: B,
            sourceTitle: A?.title || "上游节点",
            targetTitle: U.title || U.power.name,
            params: Ie.params,
            selectedParamKey: oe?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (Z) {
          je(
            Z instanceof Error ? Z.message : "参数列表加载失败"
          );
        }
    },
    [bt, o, Xt, a]
  ), $n = O(
    (m) => {
      _r(m);
    },
    [_r]
  ), [xt] = K(th), Rr = se(() => (xt.update(a, u), xt), [xt, a, u]), Vn = ne([]), nt = se(() => {
    const m = new Map(
      Vn.current.map((M) => [M.id, M])
    ), w = Rr.get(v), k = Rr.get(Mn), B = /* @__PURE__ */ new Set([
      ...w,
      ...k
    ]), A = w.size > 0 ? v : k.size > 0 ? Mn : "", U = Cs.map((M) => {
      const oe = Lv(
        M,
        ae.nodeById,
        Mn,
        v,
        nn,
        B,
        A
      );
      return $v(
        M,
        oe,
        lt,
        $n,
        m.get(M.id)
      );
    }), X = Vn.current, Z = U.length === X.length && U.every((M, oe) => M === X[oe]) ? X : U;
    return Vn.current = Z, Z;
  }, [
    Cs,
    ae,
    Rr,
    Mn,
    lt,
    $n,
    nn,
    v
  ]), Ii = se(
    () => [...nt, ...ct ? [ct] : []],
    [nt, ct]
  ), Ss = O(
    (m) => {
      if (!o)
        return;
      let w = "", k = !1;
      for (const U of m)
        U.type === "select" && (k = !0, U.selected && (w = U.id));
      k && dt(w);
      const B = m.filter(
        (U) => U.type !== "select"
      );
      if (B.length === 0)
        return;
      const A = Zm(B, nt);
      tt(
        Zp(
          Ue.current,
          new Set(nt.map((U) => U.id)),
          Tv(A)
        )
      );
    },
    [tt, nt, o]
  ), kr = Le((m, w, k) => {
    if (!a.some((A) => A.id === m) || !a.some((A) => A.id === w)) {
      je("节点已变化，请重新连接");
      return;
    }
    const B = Wn(Ue.current, m, w, a, k.mediaUsage);
    tt(
      Tt(a, B),
      k.draft ? { draftByNodeId: /* @__PURE__ */ new Map([[w, k.draft]]) } : void 0
    );
  }), Nt = Le(
    async (m, w) => {
      const k = Ue.current;
      if (k.some((oe) => (oe.logicalFrom || oe.from) === m && (oe.logicalTo || oe.to) === w)) return;
      const B = a.find((oe) => oe.id === m), A = a.find((oe) => oe.id === w), U = { source: B, target: A, nodes: a, edges: k, items: ye };
      let X = mr(U), Z;
      if (A && X.kind === "form") {
        try {
          Z = (await Xt(A)).params;
        } catch (oe) {
          je(Gr(oe, "参数读取失败，未建立连线"));
          return;
        }
        if (!sn.current) return;
        X = mr({ ...U, edges: Ue.current, params: Z });
      }
      if (X.kind === "invalid" || X.kind === "form" || !B || !A) {
        je(X.kind === "invalid" ? X.reason : "节点已变化，请重新连接");
        return;
      }
      X.kind === "text" && Z && $o((oe) => new Map(oe).set(A.id, Z));
      const M = rl(X);
      if (!M && X.kind !== "direct") {
        gn({
          sourceNodeId: m,
          targetNodeId: w,
          sourceTitle: B.title,
          targetTitle: A.title,
          params: X.kind === "text" ? X.params : X.options,
          mediaForm: X.kind === "media" ? Z : void 0,
          mediaTargetModelId: X.kind === "media" ? A.composerDraft?.selectedTargetId : void 0,
          lyricsAvailable: X.kind === "text" && X.lyricsAvailable,
          lyricsSelected: !1,
          editing: !1
        });
        return;
      }
      if (M?.kind === "text")
        bt(m, w, M.key);
      else if (M?.kind === "lyrics")
        dn(m, w);
      else {
        const oe = ka(X, M, B, A);
        oe && kr(m, w, oe);
      }
    }
  ), Xo = O(
    (m) => {
      const w = $e;
      if (w) {
        if (gn(null), w.mediaForm) {
          const k = a.find((X) => X.id === w.sourceNodeId), B = a.find((X) => X.id === w.targetNodeId);
          if (!k || !B || B.composerDraft?.selectedTargetId !== w.mediaTargetModelId) {
            je("节点或模型已变化，请重新连接");
            return;
          }
          const A = mr({ source: k, target: B, nodes: a, edges: Ue.current, items: ye, params: w.mediaForm }), U = ka(A, { kind: "media", key: m }, k, B);
          if (!U) {
            je(A.kind === "invalid" ? A.reason : "该用途已不可用，请重新连接");
            return;
          }
          kr(k.id, B.id, U);
          return;
        }
        bt(
          w.sourceNodeId,
          w.targetNodeId,
          m
        );
      }
    },
    [ye, kr, bt, a, $e]
  ), xr = O(() => {
    const m = $e;
    m?.lyricsAvailable && (gn(null), dn(
      m.sourceNodeId,
      m.targetNodeId
    ));
  }, [dn, $e]), _s = O(() => {
    gn(null);
  }, []), Tr = O(
    (m) => {
      o && (Yt.current = !0, !(!m.source || !m.target || m.source === m.target) && Nt(
        m.source || "",
        m.target || ""
      ));
    },
    [Nt, o]
  ), Lt = O(
    (m, w) => {
      if (!o)
        return;
      const k = String(w?.nodeId || "");
      k && (so.current = !0, I([]), tn(null)), Ht.current = k ? {
        nodeId: k,
        handleId: w?.handleId || null,
        handleType: w?.handleType || null
      } : null, Yt.current = !1, dt("");
    },
    [o, I]
  ), Rs = O(
    (m) => {
      if (!o) {
        Ht.current = null, Yt.current = !1;
        return;
      }
      const w = Ht.current;
      if (Ht.current = null, w?.nodeId && typeof window < "u" && window.setTimeout(() => {
        so.current = !1;
      }, 0), Yt.current) {
        Yt.current = !1;
        return;
      }
      if (!w?.nodeId)
        return;
      const k = jv(m);
      k && (ro.current = !0, R(
        k,
        Kr(Ce, k),
        w
      ));
    },
    [Ce, o, R]
  ), ks = O(
    (m, w) => {
      o && (m.preventDefault(), m.stopPropagation(), tn(null), I([]), dt(w.id));
    },
    [o, I]
  );
  ue(() => {
    if (!nn || typeof window > "u")
      return;
    function m(w) {
      !o || !Wd(w) || (w.preventDefault(), lt(nn));
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [o, lt, nn]), ue(() => {
    if (N.length === 0 || nn || typeof window > "u")
      return;
    function m(w) {
      if (!o || !Wd(w))
        return;
      const k = a.filter(
        (A) => Wt.has(A.id)
      ), B = N.map((A) => Ot.get(A)).filter((A) => !!A);
      if (!(k.length === 0 && B.length === 0)) {
        if (w.preventDefault(), B.length > 0) {
          Me(B, k);
          return;
        }
        Jo(k);
      }
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [
    o,
    a,
    Jo,
    Me,
    nn,
    N.length,
    N,
    Wt,
    Ot
  ]);
  const W = O((m) => {
    ys(
      (w) => zv(w, m) ? w : m
    );
  }, []), Ci = O(
    (m) => {
      if (!o)
        return !1;
      const w = a.find(
        (B) => B.id === m.source
      ), k = a.find(
        (B) => B.id === m.target
      );
      return Ra(w, k);
    },
    [o, a]
  ), Mr = O(
    (m, w) => {
      if (!o)
        return;
      if (Ot.has(w.id)) {
        W(null);
        return;
      }
      if (Re.has(w.id)) {
        W(null);
        return;
      }
      const k = ae.nodeById.get(w.id);
      if (!k) {
        W(null);
        return;
      }
      const B = Bi(
        a,
        w.id,
        w.position
      ), A = B === w.position ? w : { ...w, position: B };
      if (k.type === "group") {
        const M = w.position.x - k.x, oe = w.position.y - k.y;
        Ln(
          (ke) => ke.map((Ie) => {
            const Se = ae.nodeById.get(Ie.id);
            return Se?.groupId !== k.id ? Ie : {
              ...Ie,
              position: {
                x: Se.x + M,
                y: Se.y + oe
              }
            };
          })
        ), W(null);
        return;
      }
      if (nt.some(
        (M) => M.source === w.id || M.target === w.id
      )) {
        W(null);
        return;
      }
      const X = Uv(
        A,
        fo,
        a
      );
      if (!X) {
        W(null);
        return;
      }
      const Z = Fv(
        k,
        X.domainNode
      );
      if (!Z) {
        W(null);
        return;
      }
      W(Bv(Z));
    },
    [
      ae.nodeById,
      nt,
      fo,
      o,
      Re,
      a,
      Ln,
      Ot,
      W
    ]
  ), Ar = O(
    (m, w) => {
      if (!o) {
        mn(""), W(null);
        return;
      }
      if (Ot.has(w.id)) {
        const U = Wc(
          a,
          w.id,
          w.position
        );
        U !== a && re(U), mn(""), W(null);
        return;
      }
      if (Re.has(w.id)) {
        mn(""), W(null);
        return;
      }
      const k = a.find((U) => U.id === w.id);
      let B = !1;
      if (k) {
        const U = Bi(
          a,
          w.id,
          w.position
        ), X = Wc(a, w.id, U), Z = Js(
          X,
          w.id,
          U
        );
        B = (k.groupId || "") !== (Z.find((oe) => oe.id === k.id)?.groupId || ""), Z !== a && re(Z);
        const M = Tt(Z, u);
        tf(u, M) || tt(M);
      }
      if (mn(""), B) {
        W(null);
        return;
      }
      if (!ct) {
        W(null);
        return;
      }
      nt.some(
        (U) => U.source === ct.source && U.target === ct.target
      ) || Nt(
        ct.source,
        ct.target
      ), W(null);
    },
    [
      u,
      Nt,
      tt,
      nt,
      o,
      Re,
      re,
      a,
      ct,
      Ot,
      W
    ]
  ), H = O(
    (m) => {
      !o || m.button !== 2 || (ut.current = !1, mw(m.target) && (yn.current = {
        pointerId: m.pointerId,
        start: { x: m.clientX, y: m.clientY },
        baseNodeIds: m.ctrlKey || m.metaKey ? [...N] : [],
        moved: !1,
        contextMenuHandled: !1
      }, m.preventDefault(), m.stopPropagation(), m.currentTarget.setPointerCapture?.(m.pointerId)));
    },
    [o, N]
  ), un = O(
    (m) => {
      R(m, Kr(Ce, m));
    },
    [Ce, R]
  ), Dr = O(
    (m) => {
      const w = yn.current;
      !o || !w && !ut.current || (m.preventDefault(), m.stopPropagation(), ut.current = !1, w && (w.contextMenuHandled = !0));
    },
    [o]
  ), Si = O(
    (m) => {
      const w = yn.current;
      if (!w || w.pointerId !== m.pointerId || !Ce || !sn.current)
        return;
      const k = m.clientX - w.start.x, B = m.clientY - w.start.y;
      if (!w.moved && Math.hypot(k, B) < 5)
        return;
      w.moved = !0, m.preventDefault(), m.stopPropagation();
      const A = sn.current.getBoundingClientRect();
      vs(
        gw(
          w.start,
          {
            x: m.clientX,
            y: m.clientY
          },
          A
        )
      );
      const U = yw(
        a,
        Kr(Ce, w.start),
        Kr(Ce, {
          x: m.clientX,
          y: m.clientY
        })
      );
      I(hw(w.baseNodeIds, U)), dt(""), tn(null);
    },
    [Ce, a, I]
  ), we = O(
    (m) => {
      const w = yn.current;
      if (!w || w.pointerId !== m.pointerId)
        return;
      yn.current = null, m.currentTarget.hasPointerCapture?.(m.pointerId) && m.currentTarget.releasePointerCapture(m.pointerId), vs(null);
      const k = !w.moved && m.type === "pointerup";
      ut.current = !k && !w.contextMenuHandled, m.preventDefault(), m.stopPropagation(), k && w.contextMenuHandled && un({
        x: m.clientX,
        y: m.clientY
      });
    },
    [un]
  ), _i = O(
    (m) => {
      if (o) {
        if (ro.current) {
          ro.current = !1;
          return;
        }
        I([]), dt(""), tn(null), !(!("detail" in m) || m.detail !== 2) && (m.preventDefault(), m.stopPropagation(), un({ x: m.clientX, y: m.clientY }));
      }
    },
    [o, I, un]
  ), Ri = O(
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
  ), ki = O(
    (m, w) => {
      o && (m.preventDefault(), m.stopPropagation(), dt(""), Wt.has(w.id) || I([w.id]), tn({
        nodeId: w.id,
        x: m.clientX,
        y: m.clientY
      }));
    },
    [o, I, Wt]
  ), Ne = _t && a.find((m) => m.id === _t.nodeId) || null, jn = _t && Ot.get(_t.nodeId) || null, po = !!(Ne && Re.has(Ne.id)), mo = Ne && Yv(Ne), go = Ne && a.find(
    (m) => m.id === Nh(a, Ne)
  ) || null, vn = Ne ? { x: Ne.x, y: Ne.y } : void 0;
  function It() {
    tn(null);
  }
  function Zo() {
    mo && (re(
      a.map((m) => m.id === mo.id ? mo : m)
    ), It());
  }
  function Ct() {
    if (!(!o || !Ne)) {
      if (po) {
        je("脚本托管节点不能复制，请在分镜脚本中修改结构"), It();
        return;
      }
      x(
        Ne,
        vn ? { x: vn.x + 34, y: vn.y + 34 } : void 0
      ), It();
    }
  }
  function St() {
    if (!o || !Ne && !jn)
      return;
    if (jn) {
      const w = jn;
      It(), Me([w]);
      return;
    }
    if (!Ne)
      return;
    if (po) {
      je(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      ), It();
      return;
    }
    const m = Ne;
    It(), Jo([m]);
  }
  function ln() {
    Ne && (D(Ne), It());
  }
  function xi() {
    go && (D(
      go,
      hl(Ne)
    ), It());
  }
  function et() {
    if (!Ne)
      return;
    const m = ry(Ne, a);
    if (!m) {
      It();
      return;
    }
    Be(Ne.id, m), It();
  }
  const Pr = O(() => {
    Ce?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [Ce]), Kn = O(
    (m) => {
      const w = No(m);
      gt(w), Ce?.zoomTo?.(w, { duration: 120 });
    },
    [Ce, gt]
  ), xs = O(() => {
    const m = No(Pn + 0.12);
    gt(m), Ce?.zoomIn?.({ duration: 140 });
  }, [Ce, gt, Pn]), Ts = O(() => {
    const m = No(Pn - 0.12);
    gt(m), Ce?.zoomOut?.({ duration: 140 });
  }, [Ce, gt, Pn]), Er = O(() => {
    if (o) {
      if (so.current) {
        so.current = !1;
        return;
      }
      dt(""), tn(null);
    }
  }, [o]), Ms = O(
    (m, w) => {
      o && mn(w.id);
    },
    [o]
  ), Ti = O((m, w) => {
    Uo(w.id);
    const k = w.type === "workSpace" ? w.data.sourceNode : null;
    k && Aa(k) && _m();
  }, []), As = O(() => {
    Uo("");
  }, []), qn = O(
    (m) => {
      const w = m;
      zo(w), l.x != null && l.y != null && l.zoom != null ? (w.setViewport?.({
        x: l.x,
        y: l.y,
        zoom: l.zoom
      }), gt(l.zoom)) : gt(w.getZoom?.() || 1);
    },
    [gt, l.x, l.y, l.zoom]
  ), Mi = O(
    (m, w) => {
      io(w.zoom);
    },
    [io]
  ), Qo = O(
    (m, w) => {
      gt(w.zoom), $({
        x: w.x,
        y: w.y,
        zoom: w.zoom
      });
    },
    [gt, $]
  ), yo = O(() => {
    Dn((m) => !m);
  }, []), Xe = O(() => {
    Vo((m) => !m);
  }, []), Or = [
    "ws-canvas-wrap",
    Lo ? "is-dragging" : "",
    En ? "is-selecting" : "",
    en ? "is-resizing" : "",
    o ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ L(
    "section",
    {
      ref: sn,
      className: Or,
      style: lb(Pn),
      onPointerDownCapture: H,
      onPointerMoveCapture: Si,
      onPointerUpCapture: we,
      onPointerCancelCapture: we,
      onContextMenuCapture: Dr,
      children: [
        /* @__PURE__ */ f(
          Hn,
          {
            message: hs,
            onDismiss: () => je(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f($m, { root: sn, children: /* @__PURE__ */ f(
          Qm,
          {
            nodes: fo,
            edges: Ii,
            onlyRenderVisibleElements: !0,
            defaultViewport: l.x != null && l.y != null && l.zoom != null ? { x: l.x, y: l.y, zoom: l.zoom } : void 0,
            nodeTypes: ww,
            edgeTypes: bw,
            onNodesChange: kt,
            onEdgesChange: Ss,
            onConnect: Tr,
            onConnectStart: Lt,
            onConnectEnd: Rs,
            isValidConnection: Ci,
            connectionLineStyle: Nw,
            onEdgeClick: ks,
            onNodeClick: Er,
            onNodeContextMenu: ki,
            onNodeDragStart: Ms,
            onNodeDrag: Mr,
            onNodeDragStop: Ar,
            onNodeMouseEnter: Ti,
            onNodeMouseLeave: As,
            onInit: qn,
            onMove: Mi,
            onMoveEnd: Qo,
            onPaneClick: _i,
            onPaneContextMenu: Ri,
            nodesDraggable: o,
            nodesConnectable: o,
            nodesFocusable: o,
            edgesFocusable: o,
            elementsSelectable: o,
            deleteKeyCode: null,
            multiSelectionKeyCode: Cw,
            panOnDrag: o,
            panOnScroll: !1,
            zoomOnScroll: o,
            zoomOnPinch: o,
            snapToGrid: ws,
            snapGrid: Iw,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: Sw,
            fitView: l.zoom == null,
            fitViewOptions: _w,
            children: o && An && a.length > 0 ? /* @__PURE__ */ f(
              eg,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeColor: Cb
              }
            ) : null
          }
        ) }),
        En ? /* @__PURE__ */ f(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: En,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ f(
          Ly,
          {
            canvasCount: s,
            activeCanvasName: r,
            canvasManagerOpen: i,
            showViewTools: o,
            showMiniMap: An,
            snapToGrid: ws,
            zoom: Pn,
            onOpenCanvasManager: c,
            onToggleMiniMap: yo,
            onToggleSnap: Xe,
            onReset: Pr,
            onZoomIn: xs,
            onZoomOut: Ts,
            onZoomChange: Kn
          }
        ),
        o && a.length === 0 ? /* @__PURE__ */ L("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ L("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ f(xu, { size: 16 }),
            /* @__PURE__ */ f("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ f("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        o && _t && (Ne || jn) ? /* @__PURE__ */ f(
          Uy,
          {
            point: _t,
            canShowDetail: !!(Ne && Dt(Ne)),
            canCopy: !!(Ne && !po),
            canDelete: !!(jn || !po),
            canEditStructure: !!(go && go.id !== Ne?.id),
            canResetStoryboardPrompt: !!(Ne && Ku(Ne)),
            onClose: It,
            onCopy: Ct,
            onDelete: St,
            onDetail: ln,
            onEditStructure: xi,
            onResetStoryboardPrompt: et,
            onRestoreAutoSize: mo ? Zo : void 0
          }
        ) : null,
        $e ? /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ f(
              Cu,
              {
                sourceTitle: $e.sourceTitle,
                targetTitle: $e.targetTitle,
                params: $e.params,
                media: !!$e.mediaForm,
                selectedParamKey: $e.selectedParamKey,
                lyricsAvailable: $e.lyricsAvailable,
                lyricsSelected: $e.lyricsSelected,
                editing: $e.editing,
                onClose: _s,
                onSelect: Xo,
                onSelectLyrics: xr
              }
            )
          }
        ) : null
      ]
    }
  );
});
function Aw({
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
function zd(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const o = t[n.id];
      return o ? { ...n, ...o } : n;
    })
  };
}
function Dw(e, t, n) {
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
function Bl(e, t, n, o = e.length) {
  const s = Math.min(
    Co,
    Math.max(2, e.length, o)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: Fe(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: s },
      (r, i) => e[i] ? Ul(e[i], i) : zl(i)
    )
  };
}
function Pw(e, t, n, o) {
  if (t < 0 || t >= Co || (e?.frames.length || 0) > Co)
    return null;
  const s = e || Bl([], null, o, t + 1), r = Math.min(
    Co,
    Math.max(2, s.frames.length, t + 1)
  ), i = Ul(n, t);
  return {
    ...s,
    frames: Array.from(
      { length: r },
      (c, a) => s.frames[a] || zl(a)
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
function zl(e) {
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
function Ul(e, t) {
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
function Jn(e, t, n) {
  const o = Oe(t, "asset"), s = Po(o) ? qr(o) : void 0, r = Mt(
    Oe(t, "output"),
    Oe(t, "asset", "version", "content"),
    Oe(t, "version", "content"),
    Oe(t, "result", "output"),
    Oe(t, "result", "asset", "version", "content"),
    Oe(t, "data", "output"),
    Oe(t, "data", "content"),
    Oe(t, "data", "result"),
    Oe(t, "data")
  ), i = e.type === "agent" && r != null ? Ve(r) : ri(r) || Pt(r), c = e.type === "power" && Xn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? Vt([
    r,
    Oe(t, "asset", "version", "content"),
    Oe(t, "version", "content"),
    Oe(t, "result"),
    i
  ]) : null, a = e.type === "power" && Rp(e.power, e.kind, e.outputType) ? Ba([
    r,
    Oe(t, "asset", "version", "content"),
    Oe(t, "version", "content"),
    Oe(t, "result"),
    i
  ]) : null, u = Fe(
    String(Oe(t, "asset", "kind") || ""),
    String(Oe(t, "kind") || ""),
    vi(e, i)
  ), l = Qn(i, u), y = jt(i, ""), v = e.type === "power" && Xn(e.power, e.kind, e.outputType).viewMode === "writing" ? [s?.version?.content, r, i].map(
    (x) => pp(x)?.document || sa(x)
  ).find(Boolean) : null, N = Fe(
    v?.title,
    a?.title,
    c?.title
  ), I = Vr(n), R = Vr(a?.summary) || Vr(c?.summary) || Vr(l.text) || Vr(y) || (I ? `已按提示生成：${I}` : "生成完成");
  return {
    ...N && e.titleMode === "auto" ? { title: N } : {},
    description: R,
    resultRef: Ya(t),
    resultOutput: a || c || i,
    asset: s || e.asset,
    kind: s?.kind || e.power?.kind || e.kind
  };
}
function Vr(e) {
  const t = Fe(e);
  return kn(t) ? "" : t;
}
function ur(e, t) {
  const n = t.version?.content;
  return {
    ...Jn(
      e,
      {
        asset: t,
        output: n
      },
      Dg(n)
    ),
    asset: t
  };
}
function cs(e) {
  return Ea(e.composerDraft);
}
function Ew(e) {
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
function vc(e, t) {
  const n = oh(e, t);
  return {
    ...n,
    id: Ow(e, t, n.id)
  };
}
function Ow(e, t, n) {
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
  return r ? `${e.id}:feedback:${Wl(r)}` : n;
}
function ba(e, t) {
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
const Na = 3e3, Fw = 80;
async function Ji(e) {
  e.consumerSignal?.throwIfAborted();
  const t = cv(e.startNode.id), n = /* @__PURE__ */ new Set();
  let o = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: Mo(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s), e.consumerSignal?.throwIfAborted();
  let r = await sp({
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
  e.consumerSignal?.throwIfAborted(), Ia(e, Ao(r));
  for (let i = 0; i < 8; i += 1) {
    const c = await Bw(
      e,
      r,
      o,
      (l) => {
        Yl(
          e,
          l,
          n
        ), jl(e, l);
      },
      (l) => {
        o = l;
      }
    );
    e.canvasRun = c, Ia(e, c), Zr(e, c);
    const a = Number(c.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      Wv(
        c,
        wv(c, a)
      )
    );
    const u = String(c.status || "").toLowerCase();
    if (u !== "waiting") {
      if (Nc(e, c), u === "fail" || u === "error")
        throw new Error(wu(c));
      if (u === "canceled" || u === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await lv(e, c), r = {
      ...c,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
function Ia(e, t) {
  const n = {
    ...t,
    canvas_id: Number(t.canvas_id || e.canvasId),
    asset_cate_id: Number(t.asset_cate_id || e.assetCate.id || 0),
    start_node_id: String(t.start_node_id || e.startNode.id),
    execution_scope: String(t.execution_scope || e.executionScope || "")
  };
  e.canvasRun = n, e.onCanvasRunChange?.(n);
}
async function Bw(e, t, n, o, s) {
  e.consumerSignal?.throwIfAborted();
  let r = Ca(
    e,
    Ao(t)
  );
  if (o(r.node_results || []), Zr(e, r), r.status !== "running" && r.status !== "pending")
    return r;
  const i = String(r.request_id || "");
  if (!i) return r;
  const c = new AbortController();
  let a = !1, u = n, l, y;
  const v = new Promise((D, T) => {
    l = D, y = T;
  }), N = () => {
    a || (a = !0, y(e.consumerSignal?.reason)), c.abort();
  }, I = (D) => {
    if (a || e.consumerSignal?.aborted) return;
    const T = bc(r, D);
    if (r = T.detailsPending ? T : Ca(e, T), Ia(e, r), r.detailsPending) {
      Zr(e, r), _n(r.status) && (Yr(e, To(r), !1), Nc(e, r), c.abort());
      return;
    }
    o(r.node_results || []), Zr(e, r), !(r.status === "running" || r.status === "pending") && (a = !0, l(r), c.abort());
  }, R = e.subscribeRun(i, I);
  e.consumerSignal?.addEventListener("abort", N, {
    once: !0
  }), e.consumerSignal?.aborted && N();
  const x = {
    ...e,
    canUpdateNode: (D) => !c.signal.aborted && !e.consumerSignal?.aborted && !Xr(r).has(D) && rt(e, r, D)
  };
  (async () => {
    for (; !c.signal.aborted; ) {
      try {
        const D = await zw(
          e,
          i,
          u,
          (T) => {
            if (a || e.consumerSignal?.aborted) return;
            T.stream_id && (u = T.stream_id, s(u)), Yr(
              x,
              To(r),
              !1
            );
            const V = $l(T, e);
            if (V) I(V);
            else {
              const te = String(
                T.output?.node_key || T.output?.node_id || ""
              );
              (!te || rt(e, r, te)) && Vl(x, T);
            }
          },
          c.signal
        );
        D && I(D);
      } catch {
        if (c.signal.aborted) return;
      }
      if (c.signal.aborted) return;
      Yr(
        x,
        To(r),
        !0
      ), await Ll(
        Na,
        c.signal
      );
    }
  })().catch((D) => {
    c.signal.aborted && r.detailsPending && _n(r.status) || a || (a = !0, y(D));
  });
  try {
    return await v;
  } finally {
    R(), e.consumerSignal?.removeEventListener("abort", N), c.abort(), e.consumerSignal?.aborted || e.runningNodeBatcher?.flush();
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
function Ll(e, t) {
  return new Promise((n, o) => {
    const s = () => {
      window.clearTimeout(r), t?.removeEventListener("abort", s), o(t?.reason);
    }, r = window.setTimeout(() => {
      t?.removeEventListener("abort", s), n();
    }, e);
    t?.addEventListener("abort", s, { once: !0 }), t?.aborted && s();
  });
}
async function zw(e, t, n, o, s) {
  let r = null;
  return await Su({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: s,
    onFrame: (i) => {
      if (o(i), String(i.type || "").toLowerCase() === "result") {
        if (Uw(i))
          throw new Error(i.msg || "画布流返回失败");
        r = Ca(
          e,
          Ao(i.output || {})
        );
      }
    }
  }), r;
}
function Uw(e) {
  return Number(e.status || 0) === 2;
}
function Ca(e, t) {
  if (!e.singleNode || Lw(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), o = String(t.status || n?.status || "");
  if (n && (o !== "waiting" || t.pending_node))
    return t;
  const s = $w(t), r = Mt(n?.output, t.output), i = {
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
      xo(n?.result),
      xo(t.pending_node),
      xo(t.output)
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
function Lw(e) {
  return e.singleNode && e.startNode.type === "group";
}
function $w(e) {
  const t = ai(e.output), n = ai(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (s) => Po(s) && (s.status === "pending" || s.decision === "pending")
  );
}
function $l(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return Ao(e.output || {});
  const n = e.output || {}, o = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && o !== "waiting" || o !== "node_finished" && o !== "waiting")
    return null;
  const s = Vw(n, {
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
function Vw(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const o = e.output, s = Po(o) ? o : {}, r = nm(s, n);
  if (!r)
    return null;
  const i = r;
  return t.requireDisplayableResult && !Kw(e, i, t.node) ? null : {
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
      jw(e, i)
    ),
    interaction: Mt(
      e.interaction,
      r.interaction,
      xo(r)
    ),
    persists_result: !!(e.persists_result || r.persists_result),
    agent_run_id: Number(
      e.agent_run_id || r.agent_run_id || s.agent_run_id || 0
    ),
    runTiming: om(
      Mt(e.run_timing, r.runTiming, s.run_timing)
    )
  };
}
function jw(e, t) {
  const n = ai(t.result), o = Mt(
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
function xo(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const s of ["result", "pending_node"]) {
    const r = xo(n[s], t + 1);
    if (r)
      return r;
  }
  const o = Array.isArray(n.node_results) ? n.node_results : [];
  for (const s of o) {
    const r = xo(s, t + 1);
    if (r)
      return r;
  }
}
function Kw(e, t, n) {
  if (e.persists_result || String(e.node_type || "") !== "function")
    return !0;
  const s = String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ), r = fs(s);
  return r?.runsInBackend && !r.persistsResult ? !0 : !!(t.asset || t.version || Oe(t, "asset", "version") || Oe(t, "data", "asset") || Oe(t, "data", "version"));
}
function Vl(e, t) {
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
            ...$a(i),
            nodeId: s,
            title: String(n.node_name || n.node_key || s),
            startedAt: Ua({
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
        const c = Ud(n.output), a = String(n.node_type || "").toLowerCase(), u = a === "power", l = a === "agent", y = Ud(c.meta), v = rm(
          Mt(
            y.estimated_duration_ms,
            y.estimatedDurationMs
          )
        ), N = {
          ...i,
          progress: Math.max(i.progress, 72),
          estimatedDurationMs: v || i.estimatedDurationMs
        };
        return {
          ...u ? Ih(N, c) : N,
          agent: l ? Km(i.agent, c) : i.agent
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s, r) : e.setRunningNode((i) => {
        const c = r(i[s]);
        return c === i[s] ? i : c ? { ...i, [s]: c } : _u(i, s);
      });
    }
  }
}
function qw(e, t, n, o) {
  const s = $l(t), r = t.output || {}, i = String(r.event || ""), c = String(r.node_key || r.node_id || "");
  return !c || n.size > 0 && !n.has(c) || o.has(c) ? s : i === "node_finished" ? (o.add(c), e.runningNodeBatcher?.flush(), s) : (Vl(e, t), s);
}
function Ud(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function bc(e, t) {
  if (e.request_id && t.request_id && e.request_id !== t.request_id || e.run_id && t.run_id && e.run_id !== t.run_id || _n(e.status) && !_n(t.status))
    return e;
  const n = [...e.node_results || []], o = /* @__PURE__ */ new Map();
  n.forEach((s, r) => {
    const i = di(s);
    o.has(i) || o.set(i, r);
  });
  for (const s of t.node_results || []) {
    const r = di(s), i = o.get(r);
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
function jl(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (o) => _n(o.status) && rt(e, e.canvasRun, o.node_key)
  );
  n.length !== 0 && (e.setRunningNode(
    (o) => Gw(e, o, n)
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
function Gw(e, t, n) {
  let o = !1;
  const s = { ...t };
  for (const r of n) {
    const i = r.node_key;
    if (!rt(e, e.canvasRun, i)) continue;
    const c = e.nodes.find((u) => u.id === i);
    if (r.status === "canceled") {
      s[i] && (delete s[i], o = !0);
      continue;
    }
    if (r.status === "waiting") {
      s[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: Ua({
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
      agent: c?.type === "agent" ? jm(r.output) : a.agent
    }, o = !0);
  }
  return o ? s : t;
}
function Nc(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((s) => {
      const r = Ld(
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
    const i = { ...s }, c = Ld(
      e,
      t,
      s,
      n
    );
    for (const a of c) {
      const u = i[a];
      u && (i[a] = {
        ...u,
        progress: o === "success" ? 100 : Math.max(u.progress, 92),
        status: o,
        reconnecting: !1
      }, r = !0);
    }
    return r ? i : s;
  }), Jr(
    e,
    Kl(e, t).filter(
      (s) => s === br(t) || !n || n.has(s)
    ),
    o === "success" ? 650 : 1200,
    t
  );
}
function Ld(e, t, n, o) {
  const s = br(t), r = new Set(
    Kl(e, t).filter(
      (i) => i === s || !o || o.has(i)
    )
  );
  return Object.keys(n).filter(
    (i) => r.has(i) && rt(e, t, i)
  );
}
function Ww(e, t, n) {
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
  let a = !1, u = "";
  for (const y of t.node_runs || []) {
    const v = String(y.node_key || "");
    if (!v || s.has(v) || n && !n.has(v))
      continue;
    a = !0;
    const N = String(y.status || "").trim().toLowerCase();
    N === "running" ? r.set(v, "running") : N === "waiting" ? r.set(v, "waiting") : N === "pending" && !u && (u = v);
  }
  const l = String(t.pending_node?.node_key || "");
  if (l && !s.has(l) && (!n || n.has(l)) && r.set(l, "waiting"), r.size === 0 && u && r.set(u, "running"), r.size === 0 && !a) {
    const y = Py(
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
    const N = { ...y };
    for (const [I, R] of r) {
      if (!rt(e, t, I)) continue;
      const x = e.nodes.find((V) => V.id === I), P = I === c;
      if (!x && !P)
        continue;
      const D = y[I], T = Ua({
        nodeRunTiming: i.get(I),
        runCreatedAt: t.created_at,
        currentStartedAt: D?.startedAt
      });
      D?.status === R && D.startedAt === T || (N[I] = {
        ...D,
        ...$a(D),
        nodeId: I,
        title: P ? `${e.startNode.title || "分镜脚本"}制作区` : x?.title || I,
        startedAt: T,
        progress: R === "waiting" ? 92 : D?.progress || 0,
        status: R
      }, v = !0);
    }
    return v ? N : y;
  });
}
function Kl(e, t) {
  const n = new Set(To(t)), o = br(t);
  return o && n.add(o), e.singleNode && n.add(e.startNode.id), [...n];
}
function Hw(e, t, n, o) {
  const s = new Set(
    e.memberNodeIds.filter(
      (i) => $t(n[i])
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
function Yw(e, t, n) {
  if (n)
    return "停止中";
  const o = String(e?.status || "").trim().toLowerCase();
  if ($t(t) || e && Sn(e))
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
function Jw({
  frame: e,
  edges: t,
  nodeById: n,
  groupMembersById: o,
  runBlockedReasonByNodeId: s,
  runningNodes: r,
  activeRunByStartNodeId: i,
  stoppingCanvasRunKeys: c,
  hasResult: a,
  onRunGroup: u,
  onRunNode: l,
  onStopRun: y,
  onOpenNode: v,
  projectNode: N,
  reuse: I,
  projectionDependencies: R
}) {
  const x = new Set(
    [...za([...n.values()], t, e.sourceNodeId).values()].map((T) => T.groupId)
  ), P = [.../* @__PURE__ */ new Set([...e.memberNodeIds, ...x])].map((T) => n.get(T)).filter(
    (T) => T?.type === "group" && T.group?.origin === "script" && (x.size === 0 || !["characters", "scenes", "props"].includes(T.group.syncKey || "") || x.has(T.id))
  ).map((T) => {
    const V = o.get(T.id) || Gs;
    return $d({
      executionNode: T,
      members: V,
      runBlockedReasonByNodeId: s,
      runningNodes: r,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => u(T.id),
      onStopRun: y,
      onOpenNode: v,
      projectNode: N,
      reuse: I,
      projectionDependencies: R
    });
  }), D = e.workNodeIds.map((T) => n.get(T)).find((T) => T?.storyboardItem?.itemType === "video_compose");
  return D && P.push(
    $d({
      executionNode: D,
      members: [D],
      runBlockedReasonByNodeId: s,
      runningNodes: r,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => l(D.id),
      onStopRun: y,
      onOpenNode: v,
      projectNode: N,
      reuse: I,
      projectionDependencies: R
    })
  ), P;
}
function $d({
  executionNode: e,
  members: t,
  runBlockedReasonByNodeId: n,
  runningNodes: o,
  activeRunByStartNodeId: s,
  stoppingCanvasRunKeys: r,
  hasResult: i,
  onRun: c,
  onStopRun: a,
  onOpenNode: u,
  projectNode: l,
  reuse: y,
  projectionDependencies: v
}) {
  const N = s.get(e.id), I = !!(N && r.has(ht(N)));
  return y(
    "group",
    e.id,
    [
      e,
      ...t,
      t.length,
      N,
      I,
      n.get(e.id),
      o[e.id],
      ...t.flatMap((R) => [o[R.id], i(R)]),
      a,
      u,
      ...v(t)
    ],
    () => {
      const R = oc({
        members: t,
        runningNodes: o,
        groupState: o[e.id],
        hasResult: i
      }), x = String(N?.status || "").trim().toLowerCase(), P = N && R.status === "idle" ? x === "waiting" ? "waiting" : "running" : R.status, D = P === "running" || P === "waiting", T = R.runnableCount === 0, V = D ? "" : n.get(e.id) || (T ? "当前分组未配置可用能力" : "");
      return {
        id: e.id,
        title: e.title || "未命名分组",
        materialType: { characters: "character", scenes: "scene", props: "prop" }[e.group?.syncKey],
        memberCount: R.memberCount,
        runnableCount: R.runnableCount,
        completedCount: R.completedCount,
        failedCount: R.failedCount,
        status: P,
        runBlockedReason: V,
        stopping: I,
        results: t.map(
          (te) => Xw(
            te,
            o[te.id],
            i(te),
            u,
            l,
            y
          )
        ),
        onRun: !D && !V ? c : void 0,
        onStop: N ? () => a(e.id) : void 0
      };
    }
  );
}
function Xw(e, t, n, o, s, r) {
  const i = s(e), c = Zw(t, n);
  return r("result", e.id, [i, c, o], () => ({
    nodeId: e.id,
    status: c,
    node: i,
    onOpen: () => o(e.id)
  }));
}
function Zw(e, t) {
  return e?.status === "running" ? "running" : e?.status === "waiting" ? "waiting" : e?.status === "error" ? "error" : t ? "complete" : "pending";
}
function br(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? cc(t) : "";
}
function js(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const o = Number(e.asset_cate_id || 0);
  return o === 0 || o === t.assetCateId;
}
function To(e) {
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
      (t) => _n(vr(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function Qw(e) {
  return ql(e).map((t) => t.run);
}
function ev(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    Sn(n) && t.set(ht(n), n);
  return [...t.values()];
}
function tv(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const o = String(n.status || "").trim();
    if (o)
      for (const s of ci(n))
        t.set(s, o);
  }
  return t;
}
function nv(e, t) {
  for (const n of ci(t)) {
    const o = e.get(n);
    if (o)
      return o;
  }
  return "";
}
function ci(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function ql(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e) {
    const s = /* @__PURE__ */ new Set();
    for (const r of To(o))
      t.has(r) || (t.add(r), s.add(r));
    s.size !== 0 && Sn(o) && n.push({ run: o, managedNodeIds: s });
  }
  return n;
}
function jr(e) {
  return e.map(Gl).filter((t) => !!t);
}
function Gl(e) {
  const t = Ao(e);
  return t.run_id || t.request_id ? t : null;
}
function ov(e, t, n) {
  const o = new Map(t.map((r) => [ht(r), r])), s = /* @__PURE__ */ new Set();
  for (const r of e) {
    const i = Number(r.run_id || 0);
    if (!i || n && em(r, n))
      continue;
    const c = o.get(ht(r));
    !c?.detailsPending && n && rv(r, n) || (!c || c.detailsPending || c.status !== r.status || c.executed !== r.executed || c.total !== r.total || c.error !== r.error || r.status === "waiting" && !c.pending_node) && s.add(i);
  }
  return [...s];
}
function rv(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const r = t[String(n)];
    return r ? Sa(e, r) : !1;
  }
  const o = Number(e.asset_cate_id || 0);
  return (o ? Object.values(t).filter(
    (r) => r.assetCateId === o
  ) : Object.values(t)).some(
    (r) => Sa(e, r)
  );
}
function Sa(e, t) {
  const n = String(e.status || "").trim().toLowerCase();
  if (!["success", "fail", "failed", "error", "canceled", "cancelled"].includes(
    n
  ))
    return !1;
  const o = new Map(t.nodes.map((c) => [c.id, c]));
  if (!e.single_node || o.get(String(e.start_node_id || ""))?.type === "group") {
    const c = (e.node_results || []).filter(
      (u) => u.node_key
    );
    if (c.length === 0)
      return !1;
    let a = 0;
    for (const u of c) {
      const l = o.get(u.node_key);
      if (l && (a += 1, !_a(l, e, u)))
        return !1;
    }
    return a > 0;
  }
  const s = String(e.start_node_id || ""), r = o.get(s), i = (e.node_results || []).find(
    (c) => c.node_key === s
  );
  return _a(r, e, i);
}
function _a(e, t, n) {
  const o = vr(n) || t.status;
  return Qg(
    e,
    t,
    n,
    e?.type !== "power" || o !== "success" || Dt(e)
  );
}
function Xi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e)
    n.set(ht(s), s);
  for (const s of t) {
    const r = ht(s), i = n.get(r);
    n.set(r, i ? bc(i, s) : s);
  }
  let o = 0;
  return [...n.values()].sort(sv).filter((s) => Sn(s) || s.detailsPending || o++ < 50);
}
function sv(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const o = Vd(t) - Vd(e);
  return o !== 0 ? o : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Vd(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function iv(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const o = t.find((s) => s.id === n);
    if (o)
      return o;
  }
  return t.find(bi) || t[0] || null;
}
function av(e, t) {
  return [
    e.run_id || e.request_id || "",
    di(t)
  ].join(":");
}
function Zi(e, t, n, o) {
  const s = e.find(
    (r) => r.canvas_id === t && To(r).includes(o)
  );
  return s ? ci(s).some(
    (r) => ci(n).includes(r)
  ) : !0;
}
function rt(e, t, n) {
  const o = n === br(t || {}) ? e.startNode.id : n;
  return !t || !e.ownsNodeResult || e.ownsNodeResult(t, o);
}
function cv(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function dv(e, t, n) {
  const o = typeof n == "string" ? n : Zs(n), s = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${s}-${Wl(o)}`.slice(
    0,
    96
  );
}
function Wl(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function Zr(e, t, n) {
  uv(e, t), Ww(e, t, n);
}
function uv(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const o = e.nodes.find((a) => a.id === n.node_key);
  if (!o || !rt(e, t, o.id))
    return;
  const s = Ic(n, o);
  if (!s)
    return;
  const r = vc(o, s), i = Ro(o), c = ba(
    i,
    r
  );
  if (Zs(i) !== Zs(c)) {
    const a = {
      ...o,
      feedbackRequests: c
    };
    e.nodes = e.nodes.map(
      (u) => u.id === o.id ? a : u
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
async function lv(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const o = e.nodes.find((i) => i.id === n.node_key);
  if (!o)
    throw new Error("画布运行等待节点不存在");
  const s = Ic(n, o);
  if (!s || !e.requestFlowFeedback)
    throw new Error(`${o.title} 需要补充信息，请单独处理后继续`);
  const r = await e.requestFlowFeedback({ node: o, prompt: s });
  return Hl(
    e.projectId,
    t,
    n,
    s,
    r
  );
}
async function Hl(e, t, n, o, s) {
  return o.interaction ? op({
    projectId: e,
    runId: Number(o.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(o.interaction.nodeRunId || 0),
    interactionId: String(o.interaction.interaction.id || ""),
    data: s
  }) : rp({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(o.approval.id || 0),
    feedback: s
  });
}
function fv(e, t, n) {
  for (const o of e) {
    if (String(o.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const s = o.pending_node;
    if (!s || s.node_key !== t.id)
      continue;
    const r = Ic(s, t);
    if (!r)
      continue;
    if (vc(t, r).id === n.id)
      return { run: o, pending: s, prompt: r };
  }
  return null;
}
function Ic(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : xo(e);
  if (n?.interaction?.id)
    return yl({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const s = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, r = Mt(
      e.approval,
      Oe(e.result, "approval"),
      Oe(e.output, "approval")
    );
    r && !Array.isArray(s.approvals) && (s.approvals = [r]);
    const i = ih(s);
    return ah(i);
  }
  return dh(e, t.title);
}
function Yl(e, t, n) {
  let o = 0;
  const s = new Map(e.nodes.map((r) => [r.id, r]));
  for (const r of t) {
    const i = s.get(r.node_key), c = vr(r);
    if (!i || !_n(c) || !rt(e, e.canvasRun, r.node_key))
      continue;
    const a = di(r), u = e.canvasRun ? [e.projectId, e.canvasId, av(e.canvasRun, r), r.runTiming?.finishedAt || ""].join(":") : "";
    if (u && e.appliedResultKeys?.has(u) || c === "success" && a && n?.has(a) && (!r.runTiming || i.runTiming?.finishedAt === r.runTiming.finishedAt))
      continue;
    const l = gv(e, i, r);
    e.onNodeResult(i.id, l), u && e.appliedResultKeys?.add(u), a && n?.add(a), c === "success" && (o += 1);
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
function pv(e, t) {
  const n = cs(e).prompt.trim(), s = (t ? Zl(e.id, t.nodes, t.edges) : null)?.text.trim() || "", r = [n, s ? `上游内容：
${s}` : ""].filter(Boolean).join(`

`);
  return Array.from(r).slice(0, lw).join("");
}
function mv(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || vr(t) !== "success" || Number(t.version_id || 0) <= 0 || !nu(e) ? !1 : !["storyboard", "writing"].includes(
    Xn(e.power, e.kind, e.outputType).viewMode
  );
}
function di(e) {
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
function gv(e, t, n) {
  const o = vr(n), s = yv(n.runTiming) || hv(e, n.node_key), r = (a) => s ? { ...a, runTiming: s } : a;
  if (o === "fail") {
    const a = Jn(t, n, "后端执行结果");
    return r(
      Qi(t, {
        ...fu(a.resultOutput) ? { ...a, asset: void 0 } : { resultRef: Ya(n) },
        runError: tm(n)
      })
    );
  }
  if (o === "canceled")
    return r(
      Qi(t, { runError: "" })
    );
  const i = xm({
    result: n,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), c = (a) => Qi(t, a);
  return r(
    c(i ? {
      ...Jn(
        t,
        Tm(n, i),
        "后端执行结果"
      ),
      runError: ""
    } : {
      ...Jn(t, n, "后端执行结果"),
      runError: ""
    })
  );
}
function yv(e) {
  if (!(!e?.startedAt || !e.finishedAt || e.finishedAt < e.startedAt))
    return e;
}
function hv(e, t) {
  const n = e.getRunningNode?.(t);
  if (n?.startedAt)
    return {
      startedAt: n.startedAt,
      finishedAt: n.finishedAt || Date.now()
    };
}
function Qi(e, t) {
  const n = Ro(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function wv(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? wu(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function vv(e) {
  const t = bv(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await mp({
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
  return ca(n, o);
}
function bv(e) {
  return Math.max(0, Number(e || 0));
}
function Fo(e) {
  const t = xn(e), n = Qn(
    t,
    vi(e, t)
  );
  return Zn(n) || (n.text = jt(t, "")), n;
}
function vi(e, t) {
  const n = Wh(t);
  return e.type === "power" ? Fe(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : Fe(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function ea(e) {
  const t = Fo(e);
  if (Zn(t))
    return t;
  const n = Qn(
    xn(e),
    String(e.kind || e.power?.kind || "")
  );
  return Zn(n) || (n.text = jt(xn(e), "")), n;
}
function Cc(e) {
  return Iv(e) || Lh(e);
}
function Cn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : xn(e);
}
function Ws(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    Cn(e)
  ];
}
function Nv(e) {
  const t = e.composerDraft?.paramValues || {};
  return Fe(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function Iv(e) {
  return Eh(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function Kr(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function Cv(e, t, n, o) {
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
function Sv(e, t, n) {
  const o = Jl(e), s = Xl(
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
        dl({
          targets: i.type === "group" ? o.groupMembersById.get(i.id) || [] : [i],
          nodesByID: o.nodeById,
          hasResult: r
        })
      ])
    )
  };
}
function Jl(e) {
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
function Xl(e, t, n, o = "", s) {
  const { nodeById: r, groupMembersById: i, hasResultByNodeId: c } = n, a = (R) => {
    const x = r.get(R);
    return x ? x.type === "group" ? i.get(x.id) || [] : [x] : [];
  }, u = /* @__PURE__ */ new Set();
  for (const R of t) {
    const x = fn(R);
    if (o && x.targetNodeId !== o)
      continue;
    const { sourceNodeId: P } = x;
    for (const D of a(P))
      u.add(D.id);
  }
  const l = /* @__PURE__ */ new Map();
  for (const R of e)
    if (u.has(R.id)) {
      const x = _v(
        R,
        c.get(R.id) || !1
      );
      x && jd(x).trim() !== "" && l.set(R.id, x);
    }
  const y = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
  for (const R of t) {
    const { sourceNodeId: x, targetNodeId: P } = fn(R);
    if (!(o && P !== o || !r.has(P)))
      for (const D of a(x)) {
        if (yu(R) && Wa(D)) {
          const G = v.get(P) || [];
          G.push({ edge: R, source: D }), v.set(P, G);
        }
        const T = l.get(D.id), V = N.get(P) || /* @__PURE__ */ new Set();
        if (!T || V.has(D.id))
          continue;
        V.add(D.id), N.set(P, V);
        const te = y.get(P) || [];
        te.push(T), y.set(P, te);
      }
  }
  const I = /* @__PURE__ */ new Map();
  for (const [R, x] of v) {
    const P = s?.incomingMediaReferencesByNodeId.get(R);
    if (!P) continue;
    const D = x.map((T, V) => {
      const te = P[V];
      return te?.edge === T.edge && te.source === T.source ? te : T;
    });
    v.set(
      R,
      D.length === P.length && D.every(
        (T, V) => T === P[V]
      ) ? P : D
    );
  }
  for (const [R, x] of y)
    I.set(R, {
      sources: x,
      text: x.map(jd).join(`

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
function Zl(e, t, n) {
  const o = Jl(t);
  return Xl(
    t,
    n,
    o,
    e
  ).inputContextByNodeId.get(e) || null;
}
function _v(e, t) {
  if (!t)
    return null;
  const n = xn(e), o = vi(e, n), s = Qn(n, o);
  return Zn(s) || (s.text = jt(
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
function Rv(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, o) => {
    const s = t.sources[o];
    return n.nodeId === s.nodeId && n.title === s.title && n.type === s.type && n.kind === s.kind && n.output === s.output && n.resultRef === s.resultRef && n.preview.text === s.preview.text && n.preview.imageUrl === s.preview.imageUrl && n.preview.videoUrl === s.preview.videoUrl && n.preview.audioUrl === s.preview.audioUrl && n.preview.fileUrl === s.preview.fileUrl;
  });
}
function jd(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || Ol(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Ra(e, t) {
  return eu(e, t);
}
function kv(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function Kd(e, t, n, o) {
  const s = Js([...e.nodes, n], n.id, n), r = kv(t, n.id);
  return {
    source: s.find((i) => i.id === r.source),
    target: s.find((i) => i.id === r.target),
    nodes: s,
    edges: e.edges,
    items: o,
    referenceOnly: !0
  };
}
function ka(e, t, n, o) {
  if (e.kind === "direct" && !t) return {};
  if (e.kind === "media" && t?.kind === "media" && e.options.some(({ key: s }) => s === t.key))
    return { draft: e.draft, mediaUsage: t.key };
  if (e.kind === "text") {
    const s = cs(o);
    if (t?.kind === "lyrics" && e.lyricsAvailable)
      return { draft: bu(s, n.id) };
    if (t?.kind === "text" && e.params.some(({ key: r }) => r === t.key))
      return { draft: vu(s, n.id, t.key) };
  }
}
function Ql(e, t, n) {
  const o = n.composerDraft?.storyboardLyricsSourceNodeId;
  return !o || o === t ? e : e.filter((s) => !(Gn(s) === "media" && (s.logicalFrom || s.from) === o && (s.logicalTo || s.to) === n.id));
}
function Wn(e, t, n, o, s) {
  return !t || !n || t === n || e.some((i) => {
    const c = fn(i);
    return c.sourceNodeId === t && c.targetNodeId === n;
  }) ? e : [
    ...e,
    {
      id: `edge-${t}-${n}-${Date.now()}`,
      from: t,
      to: n,
      purpose: hu(
        o.find((i) => i.id === t),
        o.find((i) => i.id === n)
      ),
      ...s ? { mediaUsage: s } : {}
    }
  ];
}
function xa(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function Ta(e, t) {
  return e.type === "asset" && xa(e) === t;
}
function qd(e, t, n, o) {
  const s = new Map(e.map((r) => [r.id, r]));
  if (o)
    for (const r of t) {
      if (r.from !== o)
        continue;
      const i = s.get(r.to);
      if (i && Ta(i, n))
        return i;
    }
  return e.find((r) => Ta(r, n)) || null;
}
function Gd(e, t, n, o, s) {
  const r = /* @__PURE__ */ new Set();
  if (!o || !n)
    return r;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== o || c.to === s)
      continue;
    const a = i.get(c.to);
    a && Ta(a, n) && r.add(a.id);
  }
  return r;
}
function ta(e, t) {
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
function xv(e) {
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
function Tv(e) {
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
function Mv(e, t) {
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
  return fp({
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
function Av(e, t) {
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
  ), r = t.length ? e.nodes.map((c) => Dv(c, o, s)) : e.nodes, i = jg(r);
  return i === e.nodes ? e : { ...e, nodes: i };
}
function Dv(e, t, n) {
  const o = Sc(e), s = (o > 0 ? t.get(o) : void 0) || (!e.storyboardItem && (e.type === "power" || e.type === "agent" || e.type === "flow") ? n.get(e.id) : void 0);
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
function Sc(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function Pv(e) {
  if (!Qt(e, "import"))
    return null;
  const t = Sc(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function Ev(e, t) {
  return e === t || e.assetCateId === t.assetCateId && ef(e.nodes, t.nodes) && tf(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function ef(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => n === t[o]);
}
function Ov(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.status === t.status;
}
function tf(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n === s || n.id === s.id && n.from === s.from && n.to === s.to && (n.logicalFrom || "") === (s.logicalFrom || "") && (n.logicalTo || "") === (s.logicalTo || "") && (n.purpose || "") === (s.purpose || "") && (n.executionMode || "auto") === (s.executionMode || "auto") && (n.mediaUsage || "") === (s.mediaUsage || "");
  });
}
function Fv(e, t) {
  return Ra(e, t) ? { source: e.id, target: t.id } : Ra(t, e) ? { source: t.id, target: e.id } : null;
}
function Bv(e) {
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
function zv(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function Uv(e, t, n) {
  const s = new Map(n.map((i) => [i.id, i]));
  let r = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const c = s.get(i.id);
    if (!c)
      continue;
    const a = i.position.x - e.position.x, u = i.position.y - e.position.y, l = Math.sqrt(a * a + u * u);
    l < 150 && (!r || l < r.distance) && (r = { distance: l, domainNode: c });
  }
  return r;
}
function Lv(e, t, n, o, s, r, i) {
  const c = e.id === s, a = r.has(e.id), u = c || a || e.source === n || e.target === n || e.source === o || e.target === o, l = e.source === n || e.target === n ? n : o;
  return {
    highlighted: u,
    selected: c,
    highlightColor: u ? Vv(
      t.get(
        a ? i : l
      )
    ) : "var(--ws-edge)"
  };
}
function $v(e, t, n, o, s) {
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
    ([u, l]) => s.data?.[u] === l
  );
  return i.length === c.length && a && c.every(
    (u) => u === "data" || s[u] === r[u]
  ) ? s : r;
}
function Vv(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function jv(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function Kv(e) {
  return e instanceof HTMLElement ? !!(e.isContentEditable || e.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) : !1;
}
function Wd(e) {
  const t = e.target, n = t === document.body || t === document.documentElement || t instanceof Element && !!t.closest(".ws-canvas-wrap");
  return !e.defaultPrevented && !e.repeat && (e.key === "Delete" || e.key === "Backspace") && n && !Kv(t) && !(t instanceof Element && t.closest(
    '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="combobox"], [data-radix-popper-content-wrapper]'
  )) && !document.querySelector(
    '[role="dialog"][aria-modal="true"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]'
  );
}
function qv(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ f(Ka, { ...n }) : e === "import" ? /* @__PURE__ */ f(da, { ...n }) : e === "display" ? /* @__PURE__ */ f(ja, { ...n }) : e === "save" ? /* @__PURE__ */ f(Du, { ...n }) : /* @__PURE__ */ f(Pu, { ...n });
}
function bi(e) {
  return Qt(e, "start");
}
function nf(e) {
  return !!(e.type === "function" && fs(e.functionOption?.key)?.showsResult);
}
function Ni(e) {
  return nf(e) && Dt(e);
}
function Gv(e) {
  return {
    description: e
  };
}
function Wv(e, t) {
  return {
    ...Gv(t),
    resultRef: Ya({
      ...ai(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const na = { width: 620, height: 420 }, _c = 44;
function of(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && ps(t) === "image");
}
function Hv(e, t) {
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
function Ma(e) {
  if (e.type === "power" && Xn(e.power, e.kind, e.outputType).viewMode === "writing" && Xc(e))
    return gp(Rc(e));
  if (e.type === "function") {
    if (Ni(e)) {
      const n = Hd(e);
      return n ? {
        width: n.width,
        height: n.height + _c
      } : Xc(e) ? Xv(e) : { width: e.width, height: e.height };
    }
    return { width: 128, height: 46 };
  }
  const t = Hd(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Rc(e, t = e.resultOutput) {
  const n = Qr(e, e.resultOutput), o = t === e.resultOutput ? null : Qr(e, t);
  return (o ? Np(n, o) : n)?.document || sa(e.asset?.version?.content) || sa(e.resultOutput);
}
function Hd(e) {
  if (e.sizeMode === "manual")
    return null;
  const t = rf(e);
  return t ? t.kind === "image" ? na : Oa(e) ? {
    width: Math.max(e.width, na.width),
    height: Math.max(e.height, na.height)
  } : null : null;
}
function Yv(e) {
  return e.sizeMode !== "manual" || rf(e)?.kind !== "image" ? null : { ...e, ...hp(e), sizeMode: "auto" };
}
function rf(e) {
  if (!Jv(e))
    return null;
  const t = Fo(e);
  return of(e, t) ? null : Iu(
    Cn(e),
    ps(t)
  );
}
function Jv(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = Xn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function Xv(e) {
  const t = Fo(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), o = Pa({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: o.width,
    height: o.height + _c
  };
}
const Zv = {
  agent: { input: { left: "4px" }, output: { right: "4px" } },
  flow: { input: { left: "11px" }, output: { right: "11px" } },
  function: { input: { left: "0px" }, output: { right: "0px" } }
};
function sf(e) {
  return e.type === "function" && Ni(e) ? {
    input: { left: "0px", top: "19px" },
    output: { left: "128px", right: "auto", top: "19px" }
  } : Zv[e.type];
}
function Ge({
  id: e,
  type: t,
  position: n,
  className: o,
  style: s
}) {
  return Ru(wc) ? null : /* @__PURE__ */ f(
    ng,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${o}`,
      style: s,
      children: /* @__PURE__ */ f("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ f(Tu, { size: 12 }) : /* @__PURE__ */ f(Mu, { size: 12 }) })
    }
  );
}
function Qv(e, t) {
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
function In({
  node: e,
  selected: t
}) {
  if (e.embedded) return null;
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && Ni(e), o = /* @__PURE__ */ f(
    Jy,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const s = $t(e.runningNode);
    return /* @__PURE__ */ L(qt, { children: [
      o,
      /* @__PURE__ */ f(
        hh,
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
  return e.type === "asset" || e.type === "group" || e.type === "function" || !Aa(e) || !t || !e.showNodeSettings ? o : /* @__PURE__ */ L(qt, { children: [
    o,
    /* @__PURE__ */ f(
      Pe,
      {
        fallback: /* @__PURE__ */ f(De, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ f(Om, { node: e }, e.id)
      }
    )
  ] });
}
function Aa(e) {
  if (e.type === "agent")
    return !0;
  if (e.type !== "power") return !1;
  const t = Xn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return t !== "video_compose" && !(t === "writing" && ou(Rc(e)));
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
      children: /* @__PURE__ */ f(ja, { size: 14 })
    }
  );
}
const eb = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function oa({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const o = is(
    e.resultView || eb
  ), [s, r] = K(null), i = Wy(
    o,
    s
  ), [c, a] = K(!1), u = e.type === "agent" ? t?.agent : void 0, l = qm(u);
  if (!Dt(e) && !l)
    return null;
  const y = Fo(e), v = pc(e), N = Fe(
    jt(y.text, ""),
    jt(v, ""),
    jt(e.description, ""),
    e.title,
    "暂无结果"
  ), I = Cc(e), R = Cn(e), x = We(R) ? R : I ? { rich: I } : N, P = Il(y) ? y : qh(
    y,
    Qn(N, Tl(N, ""))
  ), D = e.interactive, T = Mt(
    e.resultOutput,
    e.asset?.version?.content
  ), V = e.type === "agent" ? async (te) => {
    if (!$t(t))
      try {
        await e.onRunBackendNode(e, { agentInput: te });
      } catch (G) {
        e.onNodeResult(e.id, {
          runError: G instanceof Error ? G.message : "智能体继续运行失败"
        });
      }
  } : void 0;
  return /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    Nl,
    {
      output: x,
      fallback: N,
      preview: P,
      mediaLabel: gr(P),
      className: `ws-agent-result-bubble ${c ? "is-resizing" : ""}`,
      followContent: !!(t && t.status !== "error"),
      followKey: u,
      style: {
        width: i.width,
        height: i.height,
        left: `calc(100% + 12px + ${Number(i.offsetX || 0)}px)`,
        top: `calc(50% + ${Number(i.offsetY || 0)}px)`
      },
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: ts,
      resizeControls: /* @__PURE__ */ f(
        Xy,
        {
          value: i,
          enabled: D,
          onResizeStart: () => {
            r(
              (te) => Id(
                o,
                te,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (te) => r(
            (G) => Id(
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
        Pe,
        {
          fallback: /* @__PURE__ */ f(De, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ f(
            Fm,
            {
              output: T,
              runtime: u,
              fallback: N,
              running: $t(t),
              onContinue: V
            }
          )
        }
      ) : void 0
    }
  ) });
}
function tb({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const o = Fo(e), s = Cc(e), r = Cn(e), i = Fe(
    pc(e),
    jt(o.text, ""),
    jt(e.description, ""),
    "暂无内容"
  ), c = We(r) ? r : s ? { rich: s } : i, a = !lr(c, o) && !!(o.imageUrl || o.videoUrl || o.audioUrl), u = a && !o.audioUrl ? Ys(
    e,
    e.onNodeResult,
    _c
  ) : void 0;
  return /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    Nl,
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
        uf,
        {
          preview: o,
          output: c,
          fallback: i,
          generating: t,
          showMediaCaption: !1,
          onMediaSize: u
        }
      ) : void 0
    }
  ) });
}
function ra({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = Ro(e);
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
        /* @__PURE__ */ f(Ig, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ f("span", { children: n.length }) : null
      ]
    }
  );
}
function nb(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Dt(e) {
  if (!ob(e) || !nb(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = xn(e);
  if (t == null)
    return !1;
  const n = Qn(
    t,
    vi(e, t)
  );
  return Zn(n) || hc(t);
}
function ob(e) {
  return e.type !== "function" ? !0 : nf(e);
}
async function rb(e) {
  const t = fs(e.node.functionOption?.key);
  if (!t)
    throw new Error(
      `不支持的画布功能：${e.node.functionOption?.key || e.node.title || "未配置"}`
    );
  const n = t.key, o = sb(e.inputContext);
  if (n === "display") {
    if (o == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      Jn(
        e.node,
        { output: o },
        "展示上游结果"
      )
    ), !0;
  }
  if (n === "save") {
    if (o == null)
      throw new Error("保存节点没有可保存的上游结果");
    const s = await vv({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: ab(e.node, e.inputContext),
      kind: Sm(e.node),
      content: o,
      nodeKey: e.node.id,
      requestId: dv(
        "save",
        e.node.id,
        o
      ),
      source: ib(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(s), e.onNodeResult(
      e.node.id,
      Jn(
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
function kc(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function sb(e) {
  const t = kc(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function ib(e) {
  const t = kc(e);
  return ey(t);
}
function ab(e, t) {
  const n = kc(t);
  return Fe(n?.title, e.title, "画布资产");
}
function cb({
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
  const u = se(
    () => ub(t),
    [t]
  );
  if (typeof document > "u")
    return null;
  const l = document.querySelector(".ws-page") || document.body;
  return _p(
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
                children: /* @__PURE__ */ f(Au, { size: 18 })
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
            /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载交互表单" }), children: /* @__PURE__ */ f(
              Rm,
              {
                interaction: u,
                disabled: n,
                readonly: o,
                hideHeader: !0,
                layout: "dialog",
                initialData: o ? t.values : void 0,
                onSubmit: (y) => a(
                  db(t, u, y.data)
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
                /* @__PURE__ */ f(qa, { size: 16 }),
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
function db(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function ub(e) {
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
function No(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function lb(e) {
  const t = No(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Yd(e, t) {
  if (!e)
    return;
  const n = No(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function fb(e) {
  return bi(e);
}
function pb(e) {
  return bi(e) ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function mb(e, t, n, o, s) {
  if (e.group?.origin !== "script") {
    await o(t);
    return;
  }
  const r = By({
    members: n,
    hasResult: s
  });
  await o(t, { targetNodeIds: r });
}
function af({
  group: e,
  sourceNode: t,
  members: n,
  runNode: o,
  hasResult: s,
  onError: r
}) {
  mb(e, t, n, o, s).catch(
    (i) => {
      r(i instanceof Error ? i.message : "分组运行失败");
    }
  );
}
function gb(e) {
  const { ref: t, visible: n } = Vm(), o = tg();
  ns(() => {
    if (!n) return;
    const r = window.requestAnimationFrame(
      () => o(e.id)
    );
    return () => window.cancelAnimationFrame(r);
  }, [e.id, o, n]);
  const s = sf(e.data);
  return /* @__PURE__ */ f(
    "div",
    {
      ref: t,
      style: { position: "relative", width: "100%", height: "100%" },
      children: n ? /* @__PURE__ */ f(cf, { ...e }) : /* @__PURE__ */ L(qt, { children: [
        /* @__PURE__ */ f(
          Ge,
          {
            id: "input-0",
            type: "target",
            position: qe.Left,
            className: "is-in",
            style: s?.input
          }
        ),
        /* @__PURE__ */ f(
          Ge,
          {
            id: "output-0",
            type: "source",
            position: qe.Right,
            className: "is-out",
            style: s?.output
          }
        )
      ] })
    }
  );
}
function cf({
  data: e,
  selected: t
}) {
  const [n, o] = K(""), s = Ru(wc), r = e, i = sf(r), {
    sourceNode: c,
    projectId: a,
    runningNode: u,
    onShowNodeDetail: l,
    onConfirmStoryboard: y,
    onNodeResult: v,
    onOpenFeedbackRecord: N,
    canvasReferenceItems: I,
    connectedMediaReferences: R,
    onConnectedMediaEdgeRemove: x,
    onNodeDraftChange: P,
    onOpenStoryboardGridImport: D,
    onRunBackendNode: T,
    structureLocked: V,
    storyboardSourceNode: te
  } = e, G = r.type === "power" ? Xn(r.power, r.kind, r.outputType) : null, re = G?.viewMode === "writing", F = G?.viewMode === "storyboard", ge = G?.viewMode === "setting", $ = G?.viewMode === "storyboard_grid", q = G?.viewMode === "video_compose";
  if (r.type === "group") {
    const z = r.groupMembers, Q = r.groupRuntime || oc({
      members: z,
      runningNodes: dw,
      groupState: u,
      hasResult: Dt
    }), me = r.runBlockedReason;
    let ye;
    return me || (ye = () => af({
      group: r,
      sourceNode: c,
      members: z,
      runNode: T,
      hasResult: Dt,
      onError: o
    })), /* @__PURE__ */ L(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载分组" }), children: [
      /* @__PURE__ */ f(
        Hn,
        {
          message: n,
          onDismiss: () => o("")
        }
      ),
      /* @__PURE__ */ L(
        kh,
        {
          node: r,
          memberCount: Q.memberCount,
          runnableCount: Q.runnableCount,
          completedCount: Q.completedCount,
          failedCount: Q.failedCount,
          status: Q.status,
          selected: t,
          managed: V,
          onRename: V ? void 0 : (ve) => v(r.id, { title: ve, titleMode: "manual" }),
          onEditStructure: te ? () => l(
            te,
            hl(r)
          ) : void 0,
          onRun: ye,
          runBlockedReason: me,
          children: [
            /* @__PURE__ */ f(
              Ge,
              {
                id: "input-0",
                type: "target",
                position: qe.Left,
                className: "is-in"
              }
            ),
            /* @__PURE__ */ f(
              Ge,
              {
                id: "output-0",
                type: "source",
                position: qe.Right,
                className: "is-out"
              }
            ),
            /* @__PURE__ */ f(In, { node: r, selected: t })
          ]
        }
      )
    ] });
  }
  if (r.type === "agent") {
    const z = $t(u) || u?.status === "success";
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${z ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ f(
            Ge,
            {
              id: "input-0",
              type: "target",
              position: qe.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ge,
            {
              id: "output-0",
              type: "source",
              position: qe.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ L("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ f(vg, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ f(
              Wi,
              {
                className: "ws-node-circle-title",
                title: r.title,
                onRename: v ? (Q) => v(r.id, { title: Q, titleMode: "manual" }) : void 0
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
            ra,
            {
              node: r,
              onOpenFeedbackRecord: N
            }
          ),
          /* @__PURE__ */ f(
            oa,
            {
              node: r,
              runningNode: u,
              onShowNodeDetail: l
            }
          ),
          /* @__PURE__ */ f(In, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "flow") {
    const z = $t(u) || u?.status === "success";
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
            /* @__PURE__ */ f("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ f(bg, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ f(
              Wi,
              {
                className: "ws-node-flow-title",
                title: r.title,
                onRename: v ? (Q) => v(r.id, { title: Q, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ f(
            Ge,
            {
              id: "input-0",
              type: "target",
              position: qe.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ge,
            {
              id: "output-0",
              type: "source",
              position: qe.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            ra,
            {
              node: r,
              onOpenFeedbackRecord: N
            }
          ),
          /* @__PURE__ */ f(oa, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(In, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "function") {
    const z = r.functionOption?.key || "", Q = Qt(r, "start"), { onRunFunctionNode: me, requestConfirm: ye } = r, ve = $t(u), fe = ve, he = Ni(r), Be = () => {
      me(r).catch((be) => {
        o(be instanceof Error ? be.message : "执行出错");
      });
    }, ce = () => {
      if (!fe) {
        if (fb(r)) {
          ye({
            title: `执行「${r.title}」`,
            description: pb(r),
            confirmText: "执行",
            onConfirm: Be
          });
          return;
        }
        Be();
      }
    }, ze = (be) => {
      be.preventDefault(), be.stopPropagation(), ce();
    };
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${fe ? "is-running" : ""} ${he ? "has-result-card" : ""} is-${z || "default"}`,
        children: [
          /* @__PURE__ */ f(
            Hn,
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
              onClick: ze,
              onKeyDown: (be) => {
                be.key !== "Enter" && be.key !== " " || (be.preventDefault(), be.stopPropagation(), ce());
              },
              children: [
                /* @__PURE__ */ f("div", { className: "ws-node-function-icon", children: ve ? /* @__PURE__ */ f(Do, { size: 15, className: "ws-spin" }) : qv(z, Q) }),
                /* @__PURE__ */ f("span", { className: "ws-node-function-title", children: ve ? u?.status === "waiting" ? "等待中" : "运行中" : r.title })
              ]
            }
          ),
          he ? /* @__PURE__ */ f(
            tb,
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
            Ge,
            {
              id: "input-0",
              type: "target",
              position: qe.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ge,
            {
              id: "output-0",
              type: "source",
              position: qe.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            ra,
            {
              node: r,
              onOpenFeedbackRecord: N
            }
          ),
          he ? null : /* @__PURE__ */ f(oa, { node: r, onShowNodeDetail: l }),
          /* @__PURE__ */ f(In, { node: r, selected: t })
        ]
      }
    );
  }
  if (r.type === "asset") {
    if (r.kind === "image") {
      const ce = ea(r), ze = Cn(r), be = lr(ze, ce), Et = Ys(r, v), st = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: st, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(id, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "图片资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-image-container ws-node-content-container", children: be ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          fr,
          {
            output: ze,
            fallback: ce.text || r.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : ce.imageUrl ? /* @__PURE__ */ f(
          Da,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-image-raw",
            onMediaSize: Et
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(id, { size: 24 }),
          /* @__PURE__ */ f("span", { children: ce.text || r.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ f(
          Ge,
          {
            id: "input-0",
            type: "target",
            position: qe.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          Ge,
          {
            id: "output-0",
            type: "source",
            position: qe.Right,
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
        /* @__PURE__ */ f(In, { node: r, selected: t })
      ] });
    }
    if (r.kind === "video") {
      const ce = ea(r), ze = Cn(r), be = lr(ze, ce), Et = Ys(r, v), st = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        ce.videoUrl || ce.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: st, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(ad, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: r.title || "视频资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-video-container ws-node-content-container", children: be ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          fr,
          {
            output: ze,
            fallback: ce.text || r.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : ce.videoUrl ? /* @__PURE__ */ f(
          ei,
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
          Da,
          {
            src: ce.imageUrl,
            alt: r.title,
            className: "ws-node-video-raw",
            onMediaSize: Et
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(ad, { size: 24 }),
          /* @__PURE__ */ f("span", { children: ce.text || r.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ f(
          Ge,
          {
            id: "input-0",
            type: "target",
            position: qe.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          Ge,
          {
            id: "output-0",
            type: "source",
            position: qe.Right,
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
        /* @__PURE__ */ f(In, { node: r, selected: t })
      ] });
    }
    const z = ea(r), Q = Cc(r), me = Cn(r), ye = pc(r), ve = We(me) ? me : Q ? { rich: Q } : ye || z.text, fe = lr(ve, z), he = !!(z.imageUrl || z.videoUrl || z.audioUrl), Be = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      he ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ L("div", { className: Be, children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(Ng, { size: 13, className: "ws-icon-green" }),
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
        ei,
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
        Pe,
        {
          fallback: /* @__PURE__ */ f(De, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ f(mu, { src: z.audioUrl })
        }
      ) }) : !fe && z.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ f(Ga, { size: 16 }),
        /* @__PURE__ */ f("span", { children: gr(z) || "文件内容" })
      ] }) : /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
        fr,
        {
          output: ve,
          fallback: ye || z.text || "暂无内容",
          mediaGridKind: ps(z),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ f(
        Ge,
        {
          id: "input-0",
          type: "target",
          position: qe.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ f(
        Ge,
        {
          id: "output-0",
          type: "source",
          position: qe.Right,
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
      /* @__PURE__ */ f(In, { node: r, selected: t })
    ] });
  }
  if (r.type === "power") {
    const z = $t(u), Q = ru(r.power, r.kind), me = $ ? Ba(
      z ? [u?.streamOutput, Ws(r)] : Ws(r)
    ) : null, ye = Dt(r), ve = z ? "running" : u?.status === "error" ? "error" : u?.status === "success" && !ye ? "running" : ye ? "complete" : "empty", fe = !!(!re && !F && !$ && !q && u?.streamStarted && (u.streamText || u.streamOutput) && u.status !== "success"), he = fe ? u?.streamOutput ? Qn(u.streamOutput, "audio") : {
      text: u?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : Fo(r), Be = fe ? u?.streamOutput || { text: u?.streamText || "" } : Cn(r), ce = re || F || $ || q || fe || ye, ze = !re && !F && !$ && !q && !!(he.imageUrl || he.videoUrl || he.audioUrl || he.fileUrl), be = r.embedded ? void 0 : Ys(r, v), Et = re ? Rc(
      r,
      u?.streamOutput || r.resultOutput
    ) : null, st = Et ? Et.status === "failed" : !!r.runError, to = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      re ? "is-writing" : "",
      F ? "is-storyboard" : "",
      $ ? "is-storyboard-grid" : "",
      q ? "is-video-compose" : "",
      Q ? "is-audio" : "",
      r.embedded ? "is-embedded" : "",
      ce ? "has-content" : "",
      ze ? "has-media" : ""
    ].filter(Boolean).join(" "), pe = (de) => /* @__PURE__ */ L("div", { className: "ws-node-floating-meta", children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(
          Ag,
          {
            power: r.power,
            kind: r.kind,
            outputType: r.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ f(
          Wi,
          {
            className: "ws-node-floating-title",
            title: r.title,
            onRename: v && !V ? (it) => v(r.id, { title: it, titleMode: "manual" }) : void 0
          }
        )
      ] }),
      de
    ] }), Ye = (de, it, Te) => /* @__PURE__ */ L(
      "div",
      {
        className: `${to}${Te ? " is-running" : st ? " is-error" : ""}`,
        children: [
          /* @__PURE__ */ f(
            Hn,
            {
              message: n,
              onDismiss: () => o("")
            }
          ),
          pe(it),
          /* @__PURE__ */ L("div", { className: "ws-node-power-card", children: [
            Te ? /* @__PURE__ */ L("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
          r.runError && !Te && !re ? /* @__PURE__ */ f(
            bb,
            {
              projectId: a,
              node: r,
              onOpenDetail: l ? () => l(r) : void 0
            }
          ) : null,
          /* @__PURE__ */ f(
            Ge,
            {
              id: "input-0",
              type: "target",
              position: qe.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ f(
            Ge,
            {
              id: "output-0",
              type: "source",
              position: qe.Right,
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
          /* @__PURE__ */ f(In, { node: r, selected: t })
        ]
      }
    );
    return re ? /* @__PURE__ */ f(
      Pe,
      {
        fallback: Ye(
          /* @__PURE__ */ f(De, { label: "正在加载创作工作区", compact: !0 }),
          null,
          z
        ),
        children: /* @__PURE__ */ f(
          Mm,
          {
            renderFrame: Ye,
            canvasRun: r.canvasRun,
            canvasRunStopping: r.canvasRunStopping,
            runningNode: u,
            onStopCanvasRun: () => r.onStopNodeCanvasRun(r.id),
            onCreateStoryboards: (de) => r.onCreateStoryboards(r.id, de),
            projectId: a,
            canvasId: r.canvasId,
            node: r,
            output: u?.streamOutput || Cn(r),
            running: z,
            readonly: !r.interactive,
            onAssetUpdated: (de) => Qv(r, de),
            onOpenDetail: (de) => l(
              de ? { ...r, resultOutput: { writing: de } } : r
            )
          }
        )
      }
    ) : Ye(
      /* @__PURE__ */ f(qt, { children: q ? /* @__PURE__ */ f(
        Pe,
        {
          fallback: /* @__PURE__ */ f(De, { label: "正在加载视频合成" }),
          children: /* @__PURE__ */ f(
            Dm,
            {
              teamId: r.teamId,
              projectId: a,
              canvasId: r.canvasId,
              outputAssetId: Sc(r),
              composition: r.composerDraft?.videoComposition,
              referenceItems: I.filter(
                (de) => de.source !== "current" || de.id !== r.id
              ),
              connectedMediaReferences: R,
              running: z,
              onChange: P ? (de) => P(r.id, {
                ...r.composerDraft || {},
                videoComposition: de
              }) : void 0,
              onConnectedMediaEdgeRemove: x,
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
      ) : ge ? /* @__PURE__ */ f(Pe, { fallback: /* @__PURE__ */ f(De, { label: "正在加载设定" }), children: /* @__PURE__ */ f(
        Pm,
        {
          workspace: r.storyboardWorkspace,
          readonly: !r.interactive,
          node: r,
          onOpenDetail: l ? () => l(r) : void 0
        }
      ) }) : F ? /* @__PURE__ */ L(
        Pe,
        {
          fallback: /* @__PURE__ */ f(De, { label: "正在加载分镜内容", compact: !0 }),
          children: [
            r.settingUpdateReason && /* @__PURE__ */ f("p", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
            /* @__PURE__ */ f(
              Em,
              {
                output: z ? u?.streamOutput || u?.streamText || "" : Ws(r),
                status: ve,
                completedShotCount: Number(
                  u?.streamOutput?.meta?.completed_count || 0
                ),
                targetShotCount: u?.targetCount || 0,
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
        Pe,
        {
          fallback: /* @__PURE__ */ f(De, { label: "正在加载分镜宫格", compact: !0 }),
          children: /* @__PURE__ */ f(
            am,
            {
              grid: me,
              aspectRatio: Nv(r),
              running: z,
              layout: r.composerDraft?.storyboardGridLayout,
              onLayoutChange: P ? (de) => P(r.id, {
                ...r.composerDraft || {},
                storyboardGridLayout: de
              }) : void 0,
              onImport: D ? () => D(r.id) : void 0,
              onFrameImport: D ? (de, it) => D(r.id, it) : void 0,
              onSlotImport: D ? (de) => D(r.id, de) : void 0,
              onEdit: me && l ? () => l(r) : void 0
            }
          )
        }
      ) : /* @__PURE__ */ L(qt, { children: [
        ce ? /* @__PURE__ */ f(
          uf,
          {
            preview: he,
            output: Be,
            fallback: r.description,
            streaming: z && fe,
            videoObjectFit: r.embedded ? "contain" : "cover",
            onMediaSize: be,
            compactMediaGrid: of(
              r,
              he
            )
          }
        ) : /* @__PURE__ */ f(Ib, {}),
        r.settingUpdateReason && /* @__PURE__ */ f("div", { className: "ws-node-desc", role: "status", children: r.settingUpdateReason }),
        /* @__PURE__ */ f(
          Hs,
          {
            active: z,
            message: u?.reconnecting ? "正在重新连接" : u?.statusText,
            compact: !0
          }
        )
      ] }) }),
      /* @__PURE__ */ f(
        Am,
        {
          runTiming: r.runTiming,
          runningNode: u,
          showEstimate: !s
        }
      ),
      z
    );
  }
  return /* @__PURE__ */ L("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ f(
      Ge,
      {
        id: "input-0",
        type: "target",
        position: qe.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ f(
      Ge,
      {
        id: "output-0",
        type: "source",
        position: qe.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ f("div", { className: "ws-node-title", children: r.title }),
    /* @__PURE__ */ f("div", { className: "ws-node-desc", children: r.description }),
    /* @__PURE__ */ f(rr, { node: r, onShowNodeDetail: l }),
    /* @__PURE__ */ f(In, { node: r, selected: t })
  ] });
}
function df(e, t) {
  return xc(e.data, t.data) && e.selected === t.selected;
}
function xc(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.teamId === t.teamId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && e.canvasRun === t.canvasRun && e.canvasRunStopping === t.canvasRunStopping && ef(e.groupMembers, t.groupMembers) && Ov(e.groupRuntime, t.groupRuntime) && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && yb(
    e.storyboardWorkspace,
    t.storyboardWorkspace
  ) && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && Rv(e.inputContext, t.inputContext);
}
function yb(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.stopping === t.stopping && e.executionStatus === t.executionStatus && e.currentNodeTitle === t.currentNodeTitle && e.settingSource?.title === t.settingSource?.title && e.settingSource?.onOpen === t.settingSource?.onOpen && e.onReferenceResult === t.onReferenceResult && e.runBlockedReason === t.runBlockedReason && !!e.onStop == !!t.onStop && hb(e.groups, t.groups);
}
function hb(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n.id === s.id && n.title === s.title && n.materialType === s.materialType && n.memberCount === s.memberCount && n.runnableCount === s.runnableCount && n.completedCount === s.completedCount && n.failedCount === s.failedCount && n.status === s.status && n.runBlockedReason === s.runBlockedReason && n.stopping === s.stopping && !!n.onRun == !!s.onRun && !!n.onStop == !!s.onStop && wb(n.results, s.results);
  });
}
function wb(e, t) {
  return e === t || e.length === t.length && e.every((n, o) => {
    const s = t[o];
    return n.nodeId === s.nodeId && n.status === s.status && xc(n.node, s.node);
  });
}
function vb(e, t) {
  return e === t || e.id === t.id && e.type === t.type && e.position.x === t.position.x && e.position.y === t.position.y && e.selected === t.selected && e.className === t.className && e.draggable === t.draggable && e.deletable === t.deletable && e.selectable === t.selectable && e.connectable === t.connectable && e.focusable === t.focusable && e.zIndex === t.zIndex && e.dragHandle === t.dragHandle && e.initialWidth === t.initialWidth && e.initialHeight === t.initialHeight && e.style?.width === t.style?.width && e.style?.height === t.style?.height ? e === t ? !0 : xc(
    e.data,
    t.data
  ) : !1;
}
function bb({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: o } = Bm(e, t), { summary: s } = zm(o), r = Po(t.resultOutput) ? t.resultOutput : {}, i = Po(r.meta) ? r.meta : {}, c = t.kind === "video" || t.power?.kind === "video" ? "条视频" : "张", a = i.partial === !0 && i.requested_count ? `本次已生成 ${Number(i.generated_count) || 0}/${Number(i.requested_count)} ${c} · ` : t.asset ? "本次失败，显示上次结果 · " : "", u = /* @__PURE__ */ L(qt, { children: [
    /* @__PURE__ */ f(Pu, { size: 14 }),
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
      children: u
    }
  ) : /* @__PURE__ */ f("div", { className: "ws-node-run-error", children: u });
}
function uf({
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
  const u = ne(null), l = ne(!0), y = c ? gr(e) : "", v = lr(t, e), N = ps(e), I = !!(a && Iu(t, N));
  return ue(() => {
    if (!o) {
      l.current = !0;
      return;
    }
    const R = u.current;
    !R || !l.current || (R.scrollTop = R.scrollHeight);
  }, [e.text, o]), !v && e.imageUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Da,
          {
            src: e.imageUrl,
            alt: y || "生成图片",
            onMediaSize: i
          }
        ),
        y ? /* @__PURE__ */ f("p", { children: y }) : null,
        /* @__PURE__ */ f(Hs, { active: s })
      ]
    }
  ) : !v && e.videoUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          ei,
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
        /* @__PURE__ */ f(Hs, { active: s })
      ]
    }
  ) : !v && e.audioUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media is-audio ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Pe,
          {
            fallback: /* @__PURE__ */ f(De, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ f(mu, { src: e.audioUrl, autoPlay: o })
          }
        ),
        /* @__PURE__ */ f(Hs, { active: s })
      ]
    }
  ) : !v && e.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ f(Ga, { size: 16 }),
    /* @__PURE__ */ f("span", { children: y || "文件内容" })
  ] }) : /* @__PURE__ */ f(
    "div",
    {
      ref: u,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${I ? "is-compact-media-grid" : ""}`,
      onScroll: (R) => {
        const x = R.currentTarget;
        l.current = x.scrollHeight - x.scrollTop - x.clientHeight < 12;
      },
      children: /* @__PURE__ */ f(
        fr,
        {
          output: t,
          fallback: e.text || n,
          streaming: o,
          mediaGridKind: N,
          compactMediaGrid: I,
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function Da({
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
function Hs({
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
        /* @__PURE__ */ f(Do, { size: n ? 12 : 18, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: t })
      ]
    }
  ) : null;
}
function gr(e) {
  const t = String(e.text || "").trim();
  return !t || kn(t) ? "" : t;
}
function Nb(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, o = 330, s = 340;
  let r = o, i = r / n;
  return i > s && (i = s, r = i * n), {
    width: Math.round(Jd(r, 150, o)),
    height: Math.round(Jd(i, 150, s))
  };
}
function Ys(e, t, n = 0) {
  if (!(e.groupId || !t || !Oa(e)))
    return (o, s) => {
      const r = Nb(o, s);
      if (!r)
        return;
      const i = {
        width: r.width,
        height: r.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, { ...i, sizeMode: "auto" });
    };
}
function Jd(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function Ib() {
  return /* @__PURE__ */ L("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {})
  ] });
}
function Cb(e) {
  return Sb(e.data);
}
function Sb(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function _b() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function Rb() {
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
function kb(e) {
  if (typeof window > "u")
    return !1;
  try {
    return Sp(
      window.localStorage.getItem(
        `${su}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function xb() {
  if (typeof window > "u")
    return Ui;
  try {
    return iu(
      Number(
        window.localStorage.getItem(au) || Ui
      )
    );
  } catch {
    return Ui;
  }
}
function Xd(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
export {
  Wb as WorkSpacePage
};
