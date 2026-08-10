import { j as A, a as d, F as mn } from "./_commonjsHelpers-CTFd9u1x.js";
import { a as pr, w as ku, n as xu, b as Tu } from "./agent-result-protocol-B6k77Bh9.js";
import { u as G, l as K, o as de, b as E, n as Au, m as ei, d as ue, S as Ue } from "./react-C7Xtl8sB.js";
import { a as kt, b as Zt, c as Mu } from "./preloadable-PCKj9Z7v.js";
import { N as Du, g as Eu, B as Vi, E as Pu, a as Fu, b as zu, i as Ou, M as Bu, P as ze, H as ju } from "./vendor-canvas-DEiNGL9h.js";
import { b0 as $u, b1 as qa, M as Uu, aB as Ga, x as Ha, w as ti, z as Wa, d as Vu, g as Ku, T as Lu, f as qu, L as gn, a4 as Gr, a as Gu, b2 as Hu, j as Wu, b3 as Yu, k as Xu, b as ni, F as ri, X as Ya, A as Zu, m as Ju, a9 as Qu, an as el, am as tl, aO as nl, b4 as rl, S as Xa, a0 as ol, $ as sl, N as Ki, V as Li, Y as il, b5 as al, a5 as cl, C as dl } from "./vendor-icons-Cc7Kl3It.js";
import { t as Z } from "./index-BxqXLJC9.js";
import { u as ul } from "./runtime-entry-CEEPqE_1.js";
import { m as ll } from "./theme-provider-vgtP-iBt.js";
import { t as mr, s as at, l as fl } from "./site-config-BVY1isir.js";
import { u as pl } from "./use-body-appearance-BJXSEKAq.js";
import { V as So } from "./media-inspector-gallery-nBFOIame.js";
import { m as oi } from "./in-flight-request-DlB1DJg0.js";
import { r as Ln, n as ml, e as si, a as $o, g as gl, i as yl, P as hl } from "./space-add-node-menu-pcpVf0B3.js";
import { K as gt, L as P, M as Za, N as ge, O as bn, t as qi, P as Ja, Q as Ft, B as Me, R as Qa, T as wl, U as xe, J as _l, V as fo, W as Bn, H as bl, p as ii, X as Nl, c as Il, Y as Co, Z as Ae, _ as st, $ as Fn, a0 as Fr, A as ec, a as Sl, a1 as tc, a2 as Cl, a3 as Es, a4 as vl, a5 as Rl } from "./storyboard-grid-view-CJXm84yJ.js";
import { Y as nc, j as ai, Z as kl, A as rc, z as xl, y as Tl, x as Al, w as Ml, d as Dl, _ as El, b as oc, S as sc, $ as vo, a0 as Pl, e as Fl, B as zl, T as Ol, p as Hr, i as Bl, F as ic, a1 as cr, C as dr, a2 as Uo, a3 as jl } from "./node-detail-content-DhUE_leQ.js";
import { j as ac, k as cc, d as dc, c as $l, n as Ul, l as Vl, m as Kl, o as Ll, p as ql } from "./interaction-CdOaiJOA.js";
import { I as Gl, o as Hl, J as ci, K as Wl, L as uc, M as lc, n as Gi, N as di, x as Yl, y as Xl, z as Zl, D as Jl, A as Ql, O as ef } from "./space-ordered-list-C1oWfuUW.js";
import { a as tf, C as Ve } from "./space-entry-BCsJ6Zds.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-page-D5ACD25I.css", import.meta.url).href]);
function ui(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function fc(e) {
  return ui(e) === "media";
}
const nf = { width: 720, height: 420 }, Hi = { width: 360, height: 240 }, Wi = { width: 2400, height: 1600 }, rf = 48, fs = 16;
function pc(e, t) {
  return e.filter((n) => n.groupId === t);
}
function mc(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? pc(e, n.id) : [n] : [];
}
function of(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function sf(e, t, n) {
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
function Ps(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group")
    return e;
  const o = { ...r, ...n }, s = af(e, o);
  return (r.groupId || "") === s ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: s || void 0 } : i
  );
}
function Ht(e, t) {
  const n = new Map(e.map((s) => [s.id, s])), r = /* @__PURE__ */ new Set(), o = [];
  for (const s of t) {
    const i = s.logicalFrom || s.from, a = s.logicalTo || s.to, c = n.get(i), u = n.get(a);
    if (!c || !u)
      continue;
    const l = c.groupId !== u.groupId, m = l && c.type !== "group" && c.groupId ? c.groupId : c.id, I = l && u.type !== "group" && u.groupId ? u.groupId : u.id;
    if (!m || !I || m === I)
      continue;
    const N = `${i}\0${a}\0${ui(s)}`;
    r.has(N) || (r.add(N), o.push({ ...s, from: m, to: I, logicalFrom: i, logicalTo: a }));
  }
  return o;
}
function af(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (s) => s.type === "group" && s.id !== t.id && n >= s.x + fs && n <= s.x + s.width - fs && r >= s.y + rf && r <= s.y + s.height - fs
  ).sort(
    (s, i) => s.width * s.height - i.width * i.height
  )[0]?.id || "";
}
const cf = [
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
function L_(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function q_() {
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
function gc(e) {
  const t = gt(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(uf).filter(Boolean) : [], r = gt(t.settings), o = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(mf).filter(Boolean) : [];
  return {
    version: 3,
    clips: n,
    audioTracks: o,
    settings: {
      resolution: Ie(r.resolution) || "auto",
      fps: Kn(r.fps, 0, 120, 0)
    }
  };
}
function G_(e) {
  const t = e.clips.reduce(
    (r, o) => r + Math.max(0, o.duration),
    0
  ), n = e.clips.reduce((r, o, s) => s >= e.clips.length - 1 || o.transitionToNext.type === "none" ? r : r + o.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function H_(e) {
  const t = e.clips.flatMap(
    (r, o) => r.blockingIssues.map(
      (s) => `${r.title || `镜头 ${o + 1}`}：${s}`
    )
  ), n = e.audioTracks.flatMap(
    (r, o) => r.audio ? [] : [`全片声音 ${o + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function df(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function W_(e) {
  return e ? [
    df(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function uf(e) {
  const t = gt(e), n = Ie(t.id);
  if (!n)
    return null;
  const r = Ro(
    t.visualVideo ?? t.visual_video
  ), o = Ro(
    t.originalAudioSource ?? t.original_audio_source
  ), s = gt(
    t.transitionToNext ?? t.transition_to_next
  ), i = gt(
    t.storyboardTransitionToNext ?? t.storyboard_transition_to_next
  ), a = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map(pf).filter(Boolean) : [], c = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(ff).filter(Boolean) : [], u = lf(i), l = hc(s.type), m = Ie(t.sourceEdgeId ?? t.source_edge_id);
  return {
    id: n,
    title: Ie(t.title) || r?.label || "镜头",
    ...m ? { sourceEdgeId: m } : {},
    ...r ? { visualVideo: r } : {},
    ...o ? { originalAudioSource: o } : {},
    duration: gf(t.duration),
    originalVolume: Kn(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: a,
    subtitleTracks: c,
    useOriginalVideo: wc(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: hf(t.blockingIssues ?? t.blocking_issues),
    transitionToNext: {
      type: l,
      durationMs: l === "none" ? 0 : Kn(
        s.durationMs ?? s.duration_ms,
        100,
        5e3,
        500
      )
    },
    ...u ? { storyboardTransitionToNext: u } : {}
  };
}
function lf(e) {
  if (!Object.keys(e).length)
    return;
  const t = hc(e.type);
  return {
    type: t,
    durationMs: t === "none" ? 0 : Kn(e.durationMs ?? e.duration_ms, 100, 5e3, 500)
  };
}
function ff(e) {
  const t = gt(e), n = Ie(t.id), r = Ie(t.text);
  if (!n || !r)
    return null;
  const o = Ie(t.source) === "speech" ? "speech" : "caption", s = Ie(t.speechId ?? t.speech_id), i = P(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...s ? { speechId: s } : {},
    source: o
  };
}
function pf(e) {
  const t = gt(e), n = Ie(t.id);
  if (!n)
    return null;
  const r = Ro(t.audio), o = Ie(t.kind) === "narration" ? "narration" : "dialogue", s = Ie(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    fit: yc(t.fit, "trim"),
    kind: o,
    ...s ? { characterId: s } : {},
    text: Ie(t.text),
    volume: Kn(t.volume, 0, 1, 1)
  };
}
function mf(e) {
  const t = gt(e), n = Ie(t.id);
  if (!n)
    return null;
  const r = Ro(t.audio), o = Ie(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, P(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, P(t.sourceStart ?? t.source_start)),
    kind: o,
    volume: Kn(t.volume, 0, 1, o === "music" ? 0.35 : 1),
    fit: yc(t.fit, o === "music" ? "trim" : "strict"),
    loop: o === "music" && wc(t.loop),
    fadeOut: Kn(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      o === "music" ? 1 : 0
    )
  };
}
function yc(e, t) {
  return Ie(e) === "strict" ? "strict" : Ie(e) === "trim" ? "trim" : t;
}
function gf(e) {
  const t = P(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Ro(e) {
  const t = gt(e), n = P(t.assetId ?? t.asset_id), r = P(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const o = yf(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: Ie(t.label),
    ...P(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: P(t.mediaIndex ?? t.media_index) } : {},
    ...Ie(t.mediaUrl ?? t.media_url) ? { mediaUrl: Ie(t.mediaUrl ?? t.media_url) } : {},
    ...Ie(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: Ie(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...o.length ? { mediaItems: o } : {}
  };
}
function yf(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = gt(r), s = Ie(o.url), i = P(o.index);
    if (!s && i <= 0)
      continue;
    const a = i > 0 ? `index:${i}` : `url:${s}`;
    n.has(a) || (n.add(a), t.push({
      url: s,
      index: i > 0 ? i : 0,
      ...Ie(o.usage) ? { usage: Ie(o.usage) } : {}
    }));
  }
  return t;
}
function hc(e) {
  const t = Ie(e);
  return cf.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function Ie(e) {
  return String(e ?? "").trim();
}
function hf(e) {
  return Array.isArray(e) ? e.map(Ie).filter(Boolean) : [];
}
function Kn(e, t, n, r) {
  const o = Number(e);
  return Number.isFinite(o) ? Math.min(n, Math.max(t, o)) : r;
}
function wc(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
const Fs = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, wf = { width: 180, height: 180 }, _f = { width: 240, height: 160 }, bf = { width: 620, height: 360 };
function Nf(e) {
  const t = ye(e);
  return {
    project: kf(t.project),
    team: xf(t.team),
    release: Tf(t.release),
    assetCates: Ct(t.asset_cates).map(Af),
    flows: Ct(t.flows).map(Df),
    canvases: Pf(t.canvas),
    assets: Ct(ye(t.assets).items).map(kc),
    initialAssetCateId: P(t.active_asset_cate_id)
  };
}
function po(e) {
  return {
    assetCateId: e,
    nextNodeNo: 1,
    nodes: [],
    edges: [],
    viewport: {}
  };
}
function _c(e, t = 0) {
  const n = ye(e), r = P(
    ge(n.asset_cate_id, t)
  );
  return bc({
    assetCateId: r,
    nextNodeNo: Math.max(1, P(n.next_node_no)),
    nodes: Ct(n.nodes).map(Of).filter((o) => !!o),
    edges: Ct(n.edges).map(Qf).filter((o) => !!o),
    viewport: ep(n.viewport),
    updatedAt: C(n.updated_at)
  });
}
function bc(e) {
  let t = li(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((o) => {
    if (!Nc(o) || Number(o.nodeNo || 0) > 0)
      return o;
    const s = t++, i = o.titleMode || "manual";
    return n = !0, {
      ...o,
      nodeNo: s,
      titleMode: i,
      ...i === "auto" && !o.storyboardItem ? { title: Ic(o, s) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function li(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function Nc(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function Ic(e, t) {
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
function If(e) {
  const t = ye(e);
  return {
    roles: Ct(t.roles).map(Mf),
    powers: Ct(t.powers).map(Cc),
    powerCategories: Ct(t.power_cates).map(ml),
    powerKinds: Ct(t.power_kinds).map(Ef),
    outputTypes: Ct(t.output_types).map(Rc)
  };
}
function zr(e) {
  return kc(ye(e));
}
function Sc(e) {
  return e.assetCates.length > 0 ? e.assetCates : [Fs];
}
function Sf(e) {
  return Sc(e)[0]?.id ?? 0;
}
function zs(e, t) {
  const n = e.length > 0 ? e : [Fs];
  return n.find((r) => r.id === t) || n[0] || Fs;
}
function ps(e, t) {
  return zs(e.assetCates, t);
}
function Cf(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => tp(n).has(t)).slice(0, 4);
}
function vf(e) {
  return e.create_status !== 2;
}
function Rf(e) {
  return e.createStatus !== 2;
}
function Vo(e, t, n, r, o) {
  const s = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, a = o?.asset, c = o?.flow, u = o?.functionOption, l = o?.power, m = o?.role, I = l ? Ln(l) : null, N = Number(a?.asset_cate_id || t.id), _ = {
    asset: [
      a?.name || "资产引用",
      a ? qi(a.kind) : qi(t.kind),
      a && Ja(a.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      l?.name || np(t.kind),
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
  }, [F, D, O] = _[e], L = Tc(e, l);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: F,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: D,
    description: O,
    x: s,
    y: i,
    width: L.width,
    height: L.height,
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
function kf(e) {
  const t = ye(e), n = ye(t.team);
  return {
    id: P(t.id),
    body_id: P(t.body_id),
    team_id: P(t.team_id),
    release_id: P(t.release_id),
    name: C(t.name) || "未命名作品",
    description: C(t.description),
    mode: C(t.mode) || "team",
    team: {
      id: P(n.id),
      name: C(n.name),
      version: P(n.version)
    }
  };
}
function xf(e) {
  const t = ye(e);
  return {
    id: P(t.id),
    name: C(t.name) || "自由团队",
    description: C(t.description)
  };
}
function Tf(e) {
  const t = ye(e);
  return {
    id: P(t.id),
    team_id: P(t.team_id),
    version: P(t.version),
    status: C(t.status)
  };
}
function Af(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    name: C(e.name) || "未命名资产",
    kind: C(e.kind) || "text",
    cardinality: C(e.cardinality) || "single",
    status: P(e.status),
    sort: P(e.sort)
  };
}
function Mf(e) {
  return {
    id: P(e.id),
    team_id: P(e.team_id),
    role_type: C(e.role_type),
    role_key: C(e.role_key),
    name: C(e.name),
    agent_id: P(e.agent_id),
    assignment: C(e.assignment),
    create_status: vc(e.create_status)
  };
}
function Df(e) {
  return {
    id: P(e.id),
    name: C(e.name),
    key: C(e.key),
    goal: C(e.goal),
    config: ye(e.config),
    status: P(e.status),
    sort: P(e.sort),
    output_asset_cate_ids: Mc(e.output_asset_cate_ids)
  };
}
function Cc(e) {
  const t = C(e.kind) || "text", n = Rc(ye(e.output)), r = C(e.output_type) || "general";
  return {
    id: P(e.id),
    cate_id: P(e.cate_id),
    name: C(e.name) || C(e.key) || "未命名能力",
    key: C(e.key),
    icon: C(e.icon),
    description: C(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: vc(e.create_status)
  };
}
function vc(e) {
  return Number(e) === 2 ? 2 : 1;
}
function Rc(e) {
  return {
    key: C(e.key),
    name: C(e.name),
    allowedKinds: wo(e.allowed_kinds),
    viewMode: C(e.view_mode),
    defaultWidth: P(e.default_width),
    defaultHeight: P(e.default_height),
    structured: !!e.structured,
    sort: P(e.sort)
  };
}
function Ef(e) {
  return {
    id: C(e.id),
    value: C(e.value) || C(e.name) || C(e.id)
  };
}
function kc(e) {
  const t = fi(ye(e.version)), n = pi(e.versions);
  return {
    id: P(e.id),
    project_id: P(ge(e.project_id, e.projectID)),
    body_id: P(ge(e.body_id, e.bodyID)),
    team_id: P(ge(e.team_id, e.teamID)),
    flow_id: P(ge(e.flow_id, e.flowID)),
    asset_cate_id: P(
      ge(e.asset_cate_id, e.assetCateID)
    ),
    node_key: C(ge(e.node_key, e.nodeKey)),
    name: C(e.name),
    kind: C(e.kind) || "text",
    role: C(e.role),
    version_id: P(ge(e.version_id, e.versionID)),
    status: C(e.status),
    sort: P(e.sort),
    created_at: C(ge(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function fi(e) {
  const t = P(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: P(ge(e.asset_id, e.assetID)),
      run_id: P(ge(e.run_id, e.runID)),
      node_run_id: P(ge(e.node_run_id, e.nodeRunID)),
      release_id: P(ge(e.release_id, e.releaseID)),
      request_id: C(ge(e.request_id, e.requestID)),
      node_key: C(ge(e.node_key, e.nodeKey)),
      source: ye(e.source),
      version: P(e.version),
      summary: C(e.summary),
      content: e.content,
      created_at: C(ge(e.created_at, e.createdAt)),
      updated_at: C(ge(e.updated_at, e.updatedAt))
    };
}
function pi(e) {
  return Ct(e).map(fi).filter((t) => !!t);
}
function Pf(e) {
  const t = ye(e), n = {};
  for (const [r, o] of Object.entries(t)) {
    const s = _c(o, P(r));
    n[String(s.assetCateId)] = s;
  }
  return n;
}
function Ff(e, t) {
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
function zf(e, t) {
  return Ff(
    { [String(e.assetCateId)]: e },
    t
  )[String(e.assetCateId)];
}
function Of(e) {
  const t = C(e.id), n = C(e.type);
  if (!t || !n)
    return null;
  const r = {
    id: t,
    nodeNo: P(e.node_no) || void 0,
    type: n,
    title: C(e.title),
    titleMode: C(e.title_mode) === "manual" ? "manual" : C(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: C(e.subtitle),
    description: C(e.description),
    x: P(e.x),
    y: P(e.y),
    width: P(e.width),
    height: P(e.height),
    groupId: C(e.group_id),
    group: jf(e.group),
    storyboardItem: $f(e.storyboard_item),
    storyboardMaterializedSignature: C(
      e.storyboard_materialized_signature
    ),
    assetCateId: P(e.asset_cate_id),
    outputType: C(e.output_type),
    count: e.count == null ? void 0 : P(e.count),
    functionOption: qf(e.function_option),
    composerDraft: Yf(e.composer_draft),
    resultRef: Jf(e.result_ref),
    resultOutput: e.result_output,
    resultView: Bf(e.result_view),
    runError: C(e.run_error),
    local: e.local !== !1
  }, o = C(e.kind), s = C(
    e.cardinality
  ), i = Uf(e.flow), a = Vf(e.role), c = Kf(e.asset), u = Lf(e.power);
  return o && (r.kind = o), s && (r.cardinality = s), i && (r.flow = i), a && (r.role = a), c && (r.asset = c), u && (r.power = u, r.outputType = r.outputType || u.outputType), r;
}
function Bf(e) {
  const t = ye(e), n = Ft(t.width), r = Ft(t.height);
  if (n == null || r == null || n <= 0 || r <= 0)
    return;
  const o = Ft(t.offset_x), s = Ft(t.offset_y);
  return {
    width: n,
    height: r,
    ...o == null ? {} : { offsetX: o },
    ...s == null ? {} : { offsetY: s }
  };
}
function jf(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return {
      origin: C(t.origin),
      sourceNodeId: C(t.source_node_id),
      syncKey: C(t.sync_key),
      layoutKey: C(t.layout_key)
    };
}
function $f(e) {
  const t = ye(e), n = C(t.source_node_id), r = C(t.item_type), o = C(t.item_id);
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
      generatedPrompt: C(t.generated_prompt),
      dependencyNodeIds: wo(t.dependency_node_ids),
      referenceNodeIds: wo(t.reference_node_ids),
      externalReferenceAssetIds: Mc(t.external_reference_asset_ids),
      shotId: C(t.shot_id),
      speechId: C(t.speech_id),
      speechIds: wo(t.speech_ids),
      characterId: C(t.character_id),
      speechKind: C(t.speech_kind),
      speakerMode: C(t.speaker_mode),
      startTime: Ft(t.start_time),
      shotDuration: Ft(t.shot_duration),
      continuityAnchor: C(t.continuity_anchor),
      optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true",
      sourceSignature: C(t.source_signature),
      resultSourceSignature: C(t.result_source_signature),
      stale: t.stale === !0 || t.stale === 1 || String(t.stale || "").toLowerCase() === "true"
    };
}
function Uf(e) {
  const t = ye(e), n = P(t.id), r = C(t.key), o = C(t.name);
  if (!(!n && !r && !o))
    return {
      id: n,
      key: r,
      name: o,
      goal: C(t.goal)
    };
}
function Vf(e) {
  const t = ye(e), n = P(t.id), r = C(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: C(t.role_type),
      agent_id: P(t.agent_id)
    };
}
function Kf(e) {
  const t = ye(e), n = P(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: P(t.asset_cate_id),
      name: C(t.name),
      kind: C(t.kind),
      role: C(t.role),
      version_id: P(t.version_id),
      sort: 0
    };
}
function Lf(e) {
  const t = ye(e), n = P(t.id), r = C(t.key);
  if (!(!n && !r))
    return Cc({
      ...t,
      id: n,
      key: r,
      name: C(t.name)
    });
}
function qf(e) {
  const t = ye(e), n = C(t.key);
  if (n)
    return {
      key: n,
      label: C(t.label),
      description: C(t.description)
    };
}
function xc(e) {
  const t = ye(e);
  if (!Object.keys(t).length)
    return;
  const n = C(t.storyboardGridLayout);
  return {
    prompt: C(t.prompt),
    promptContent: Zf(t.promptContent),
    paramValues: ye(t.paramValues),
    selectedTargetId: P(t.selectedTargetId),
    videoComposition: gc(t.videoComposition),
    storyboardReferences: nc(
      t.storyboardReferences
    ),
    storyboardWorkType: Xf(t.storyboardWorkType),
    storyboardGridLayout: n ? Za(n) : void 0,
    multiImageMode: Wf(t.multiImageMode)
  };
}
function mi(e) {
  return xc(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function Gf(e) {
  const t = mi(e), n = Hf(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function Yi(e) {
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
function Y_(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function Hf(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function Wf(e) {
  const t = C(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function Yf(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return xc({
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
function Xf(e) {
  const t = C(e);
  return ai(t) ? t : void 0;
}
function Zf(e) {
  const t = ye(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const o = ye(r);
    return o.type === "text" || o.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function Jf(e) {
  const t = ye(e);
  if (Object.keys(t).length)
    return {
      run_id: P(t.run_id),
      request_id: C(t.request_id),
      flow_run_id: P(t.flow_run_id),
      node_run_id: P(t.node_run_id),
      asset_id: P(t.asset_id),
      version_id: P(t.version_id),
      release_id: P(t.release_id),
      role: C(t.role),
      status: C(t.status),
      updated_at: C(t.updated_at)
    };
}
function Qf(e) {
  const t = C(e.from), n = C(e.to);
  if (!t || !n)
    return null;
  const r = C(e.purpose);
  return {
    id: C(e.id) || `edge-${t}-${n}`,
    from: t,
    to: n,
    logicalFrom: C(e.logical_from) || void 0,
    logicalTo: C(e.logical_to) || void 0,
    purpose: r === "media" || r === "structure" || r === "dependency" ? r : void 0,
    executionMode: C(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: C(e.media_usage) || void 0
  };
}
function ep(e) {
  const t = ye(e), n = {};
  return t.x != null && (n.x = P(t.x)), t.y != null && (n.y = P(t.y)), t.zoom != null && (n.zoom = P(t.zoom)), n;
}
function tp(e) {
  return new Set(e.output_asset_cate_ids);
}
function np(e) {
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
function Tc(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...nf };
    case "power":
      return Ko(t);
    default:
      return { width: 250, height: 170 };
  }
}
function Ko(e) {
  if (si(e))
    return { ..._f };
  const t = rp(e);
  return t || ($o(e) ? { ...bf } : { ...wf });
}
function rp(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function Ac(e) {
  const t = Tc(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function wo(e) {
  return Array.isArray(e) ? e.map(C).filter(Boolean) : [];
}
function Mc(e) {
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
  return Array.isArray(e) ? e.filter(bn) : [];
}
function ye(e) {
  return bn(e) ? e : {};
}
function C(e) {
  return e == null ? "" : String(e).trim();
}
function Dc(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(op),
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
function op(e) {
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
  if (_o(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), St(t, "group_id", e.groupId), e.group) {
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
  ), _o(t, "asset_cate_id", e.assetCateId), St(t, "kind", e.kind), St(t, "output_type", e.outputType), St(t, "cardinality", e.cardinality), _o(t, "count", e.count), e.flow && (t.flow = {
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
    output: ap(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = ip(e.composerDraft);
  n && (t.composer_draft = n);
  const r = lp(e.resultRef);
  r && (t.result_ref = r), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && un(e.resultOutput) && (t.result_output = e.resultOutput);
  const s = sp(e.resultView);
  return s && (t.result_view = s), St(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function sp(e) {
  if (!e)
    return;
  const t = Ft(e.width), n = Ft(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, o = Ft(e.offsetX), s = Ft(e.offsetY);
  return o != null && (r.offset_x = o), s != null && (r.offset_y = s), r;
}
function ip(e) {
  if (!bn(e))
    return null;
  const t = {};
  St(t, "prompt", e.prompt);
  const n = cp(e.promptContent);
  n && un(n) && (t.prompt_content = n), _o(t, "selected_target_id", e.selectedTargetId);
  const r = dp(e.paramValues);
  r && (t.param_values = r);
  const o = gc(e.videoComposition);
  o && un(o) && (t.video_composition = o);
  const s = nc(
    e.storyboardReferences
  );
  return s.length > 0 && un(s) && (t.storyboard_references = s), ai(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), e.storyboardGridLayout && (t.storyboard_grid_layout = Za(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function ap(e) {
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
function cp(e) {
  if (!(!bn(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function dp(e) {
  if (!bn(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    up(r) || un(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function up(e) {
  return bn(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function lp(e) {
  if (!bn(e))
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
function _o(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function un(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(un) : bn(e) ? Object.values(e).every(un) : !1;
}
const ve = oi.joinSiteApi, Re = oi.request;
async function fp(e, t = 0) {
  const n = await Re(ve("workspace/bootstrap"), "get", {
    project_id: e,
    asset_cate_id: t
  });
  return Nf(
    mr(n, "加载创作空间失败")
  );
}
async function pp(e) {
  const t = await Re(ve("workspace/canvas"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = at(t, "加载分类画布失败"), r = n.assets || {}, o = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: _c(n.canvas, e.assetCateId),
    assets: o.map(zr)
  };
}
async function mp(e) {
  const t = await Re(ve("project/canvas_config"), "get", {
    project_id: e
  });
  return If(
    mr(t, "加载能力列表失败")
  );
}
async function gp(e) {
  const t = await Re(ve("project/canvas_power_form"), "get", {
    project_id: e.projectId,
    flow_id: e.flowId || 0,
    power_id: e.powerId,
    power_key: e.powerKey,
    target_id: e.targetId || 0
  });
  return xp(
    mr(t, "加载能力参数失败")
  );
}
async function yp(e) {
  const t = await Re(ve("workspace/canvas_execute"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    start_node_id: e.startNodeId,
    request_id: e.requestId || "",
    single_node: !!e.singleNode,
    execution_scope: e.executionScope || "",
    canvas: Dc(e.canvas),
    input: e.runInput || {}
  });
  return at(t, "画布运行失败");
}
async function hp(e) {
  const t = await Re(
    ve("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    }
  ), n = at(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function Wr(e, t, n) {
  const r = at(e, t).asset;
  if (!r)
    throw new Error(n);
  return zr(r);
}
async function ms(e) {
  const t = await Re(
    ve("workspace/canvas_execution_list"),
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
  ), n = at(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function Ec(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), o = await Re(
    ve("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    }
  );
  return at(o, "读取画布运行详情失败");
}
async function wp(e) {
  const t = await Re(ve("run/approval"), "post", {
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
async function _p(e) {
  const t = await Re(ve("run/status"), "get", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || "",
    view: "summary"
  });
  return mr(t, "读取流程状态失败");
}
async function bp(e) {
  const t = await Re(ve("run/stop"), "post", {
    project_id: e.projectId,
    run_id: e.runId || 0,
    request_id: e.requestId || ""
  });
  return at(t, "停止画布运行失败");
}
async function Np(e) {
  const t = await Re(
    ve("workspace/canvas_stop_all"),
    "post",
    { project_id: e }
  ), n = at(t, "停止全部画布运行失败");
  return {
    count: Number(n.count || 0),
    stoppedCount: Number(n.stopped_count || 0),
    failedCount: Number(n.failed_count || 0),
    items: Array.isArray(n.items) ? n.items : []
  };
}
async function Ip(e) {
  const t = await Re(ve("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return mr(t, "提交信息失败");
}
async function Sp(e) {
  const t = await Re(
    ve("project/update_asset_version"),
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
async function X_(e) {
  const t = await Re(
    ve("project/restore_asset_version"),
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
async function Z_(e) {
  const t = await Re(
    ve("project/confirm_storyboard"),
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
async function J_(e) {
  const t = await Re(
    ve("project/create_storyboard_revision"),
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
async function Q_(e) {
  const t = e.storyboard.shots.findIndex(
    (s) => s.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await Re(
    ve("project/generate_storyboard_shot"),
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
  ), r = at(n, "生成镜头失败"), o = kl(r, t);
  if (!o || o.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function eb(e) {
  const t = await Re(ve("project/asset_detail"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    current_only: e.currentOnly ? 1 : 0
  }), n = at(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const o = pi(n.versions);
  return {
    asset: zr(r),
    versions: o,
    versionTotal: Number(n.version_total || o.length),
    hasMore: !!n.has_more
  };
}
async function tb(e) {
  const t = await Re(ve("project/asset_versions"), "get", {
    project_id: e.projectId,
    asset_id: e.assetId,
    page: e.page,
    page_size: e.pageSize || 20
  }), n = at(t, "读取资产版本失败"), r = pi(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function nb(e) {
  const t = await Re(
    ve("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    }
  ), n = at(t, "读取历史版本失败").version, r = fi(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function Cp(e) {
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
async function Pc(e, t) {
  const n = await Re(ve("project/save_asset"), "post", {
    ...Cp(t),
    role: e
  });
  return Wr(n, "保存资产失败", "保存资产结果为空");
}
function vp(e) {
  return Pc("work", e);
}
function Rp(e) {
  return Pc("material", e);
}
async function kp(e, t, n) {
  const r = await Re(ve("workspace/canvas"), "post", {
    project_id: e,
    asset_cate_id: t,
    base_revision: n.updatedAt || "",
    canvas: Dc(n)
  }), o = at(r, "保存画布失败");
  return {
    assetCateId: Number(o.asset_cate_id || t || 0),
    updatedAt: String(o.updated_at || n.updatedAt || "")
  };
}
function xp(e) {
  const t = e && typeof e == "object" ? e : {}, n = Mp(
    t.storyboard_work_types
  ), r = Dp(
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
const Tp = /* @__PURE__ */ new Set(["image", "video", "audio"]), Ap = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function Mp(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = n && typeof n == "object" ? n : {}, o = String(r.key || "").trim().toLowerCase();
    if (!ai(o) || t.has(o))
      throw new Error("分镜作品类型注册信息无效");
    const s = Number(r.sort || 0);
    if (!Number.isInteger(s))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(o), {
      key: o,
      name: String(r.name || "").trim() || o,
      sort: s,
      required_reference_purposes: bo(
        r.required_reference_purposes
      )
    };
  }).sort((n, r) => n.sort - r.sort);
}
function Dp(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((o) => o.key)), r = /* @__PURE__ */ new Set();
  return e.map((o) => {
    const s = o && typeof o == "object" ? o : {}, i = String(s.key || "").trim(), a = bo(s.media_kinds), c = String(
      s.scope || ""
    ).trim(), u = bo(s.work_types), l = bo(
      s.default_media_kinds
    ), m = String(s.material_type || "").trim(), I = Number(s.max_count || 0), N = Number(s.sort || 0);
    if (!i || r.has(i) || a.length === 0 || a.some((_) => !Tp.has(_)) || !Ap.has(c) || u.some((_) => !n.has(_)) || l.some((_) => !a.includes(_)) || c === "material" && m !== "character" && m !== "scene" && m !== "prop" || c !== "material" && m || !Number.isInteger(I) || I < 0 || !Number.isInteger(N))
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
function bo(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const Xi = 520, Ep = 8e3;
function Pp({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: o
}) {
  const s = G(n), i = G({}), a = G({}), c = G({}), u = G(/* @__PURE__ */ new Map()), l = G({}), m = G(0), I = G(null), [N, _] = K(0), [F, D] = K({});
  de(() => {
    s.current = n;
  }, [n]);
  const O = E((v) => {
    const T = l.current[v];
    T != null && (window.clearTimeout(T), delete l.current[v]);
  }, []), L = E(
    (v, T = Xi) => {
      if (!t || !e || typeof window > "u")
        return;
      O(v);
      const W = m.current;
      l.current[v] = window.setTimeout(() => {
        delete l.current[v], I.current?.(v, W)?.catch(() => {
        });
      }, T);
    },
    [O, t, e]
  ), H = E(
    async (v, T, W) => {
      if (T !== m.current || !t || !e)
        return;
      for (; u.current.has(v); )
        if (await u.current.get(v), T !== m.current)
          return;
      const pe = W?.revision ?? i.current[v] ?? 0;
      if (pe <= (a.current[v] || 0))
        return;
      const re = W?.canvas || s.current[v];
      if (!re)
        return;
      const he = (async () => {
        D((oe) => ({ ...oe, [v]: "saving" }));
        try {
          const oe = await kp(
            e,
            re.assetCateId,
            re
          );
          if (T !== m.current)
            return;
          a.current[v] = Math.max(
            a.current[v] || 0,
            pe
          ), c.current[v] = 0, (i.current[v] || 0) === pe ? (r((be) => {
            const Ce = be[v], le = oe.updatedAt || Ce?.updatedAt;
            return !Ce || Ce.updatedAt === le ? be : {
              ...be,
              [v]: { ...Ce, updatedAt: le }
            };
          }), D((be) => ({
            ...be,
            [v]: "saved"
          }))) : D((be) => ({
            ...be,
            [v]: "dirty"
          }));
        } catch (oe) {
          if (T !== m.current)
            return;
          const ne = (c.current[v] || 0) + 1;
          throw c.current[v] = ne, D((be) => ({ ...be, [v]: "error" })), ne === 1 && o(oe), L(
            v,
            Math.min(Ep, Xi * 2 ** ne)
          ), oe;
        } finally {
          T === m.current && (i.current[v] || 0) > (a.current[v] || 0) && (c.current[v] || 0) === 0 && L(v);
        }
      })();
      u.current.set(v, he);
      try {
        await he;
      } finally {
        u.current.get(v) === he && u.current.delete(v);
      }
    },
    [t, o, e, L, r]
  );
  I.current = H;
  const Y = E(
    async (v) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const T = String(v.assetCateId), W = m.current, pe = (i.current[T] || 0) + 1;
      if (i.current[T] = pe, c.current[T] = 0, O(T), D((re) => ({ ...re, [T]: "dirty" })), await H(T, W, { canvas: v, revision: pe }), W !== m.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [O, t, e, H]
  ), se = E((v) => {
    const T = String(v);
    i.current[T] = (i.current[T] || 0) + 1, c.current[T] = 0, D((W) => ({ ...W, [T]: "dirty" })), _((W) => W + 1);
  }, []), R = E(
    (v) => {
      m.current += 1;
      for (const W of Object.keys(l.current))
        O(W);
      i.current = {}, a.current = {}, c.current = {}, u.current.clear();
      const T = {};
      for (const W of Object.keys(v))
        T[W] = "saved";
      D(T);
    },
    [O]
  );
  return de(() => {
    for (const [v, T] of Object.entries(i.current))
      T > (a.current[v] || 0) && L(v);
  }, [L, N]), de(
    () => () => {
      m.current += 1;
      for (const v of Object.values(l.current))
        window.clearTimeout(v);
      l.current = {};
    },
    []
  ), {
    markCanvasDirty: se,
    flushCanvasSave: Y,
    resetCanvasAutosave: R,
    canvasSaveStatus: F
  };
}
const Fp = 6e4, zp = 60;
class Op {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = Bp(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, o = !1) {
    this.setScope(t, n);
    const s = this.scopeKey, i = this.catalogs.get(s) || { loadedAt: 0 };
    if (!o && i.value && Date.now() - i.loadedAt < Fp)
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
    const r = this.scopeKey, o = jp(t), s = this.powerForms.get(o);
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
    for (; this.powerForms.size > zp; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function Bp(e, t) {
  return `${e || 0}:${t || 0}`;
}
function jp(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function $p(e, t, n) {
  const r = new Map(t.map((c) => [c.id, c])), o = Up(n), s = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
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
      (!l || !Fc(l)) && a(u);
    }
  };
  return a(e), [...s];
}
function Fc(e) {
  return e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Lo(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : e.type === "function" && (e.functionOption?.key === "save" || e.functionOption?.key === "display");
}
function Up(e) {
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
function zc({
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
function Oc({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const o = e.filter(Lo), s = o.filter(
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
    status: Lp(n, i, u)
  };
}
async function Vp(e, t) {
  const n = new Map(
    e.filter(Lo).map((s) => [s.id, s])
  ), r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
  for (; n.size > 0 && (Kp(n, o), n.size !== 0); ) {
    const s = [...n.values()].filter(
      (a) => Bc(a).every(
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
function Kp(e, t) {
  let n = !0;
  for (; n; ) {
    n = !1;
    for (const r of e.values())
      Bc(r).find(
        (s) => t.has(s)
      ) && (e.delete(r.id), t.set(r.id, new Error("上游节点更新失败")), n = !0);
  }
}
function Bc(e) {
  return e.storyboardItem?.dependencyNodeIds || [];
}
function Lp(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function qp(e, t) {
  const [n, r] = K(e);
  return Au(() => {
    t || r(e);
  }, [e, t]), { flowNodes: n, setFlowNodes: r };
}
function Gp({
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
  return /* @__PURE__ */ A(mn, { children: [
    /* @__PURE__ */ d("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ A(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (I) => I.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ A("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ d(ti, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "详情" })
          ] }) : null,
          o && l ? /* @__PURE__ */ A("button", { type: "button", onClick: l, children: [
            /* @__PURE__ */ d(Wa, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "编辑分镜" })
          ] }) : null,
          s && m ? /* @__PURE__ */ A("button", { type: "button", onClick: m, children: [
            /* @__PURE__ */ d(Vu, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ A("button", { type: "button", onClick: a, children: [
            /* @__PURE__ */ d(Ku, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ A("button", { type: "button", className: "is-danger", onClick: c, children: [
            /* @__PURE__ */ d(Lu, { size: 15 }),
            /* @__PURE__ */ d("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function Hp({
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
  return /* @__PURE__ */ A("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ d(Me, { label: e ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: e ? "is-active" : "",
        onClick: r,
        "aria-label": e ? "隐藏小地图" : "显示小地图",
        children: /* @__PURE__ */ d($u, { size: 16 })
      }
    ) }),
    /* @__PURE__ */ d(Me, { label: t ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        className: t ? "is-active" : "",
        onClick: o,
        "aria-label": t ? "关闭网格吸附" : "开启网格吸附",
        children: /* @__PURE__ */ d(qa, { size: 16 })
      }
    ) }),
    /* @__PURE__ */ d(Me, { label: "重置视图", children: /* @__PURE__ */ d("button", { type: "button", onClick: s, "aria-label": "重置视图", children: /* @__PURE__ */ d(Uu, { size: 15 }) }) }),
    /* @__PURE__ */ A("div", { className: "ws-view-zoom", children: [
      /* @__PURE__ */ d(Me, { label: "缩小", children: /* @__PURE__ */ d("button", { type: "button", onClick: a, "aria-label": "缩小", children: /* @__PURE__ */ d(Ga, { size: 15 }) }) }),
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
      /* @__PURE__ */ d(Me, { label: "放大", children: /* @__PURE__ */ d("button", { type: "button", onClick: i, "aria-label": "放大", children: /* @__PURE__ */ d(Ha, { size: 15 }) }) })
    ] })
  ] });
}
const jc = [
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
], ko = 140, gi = 100, Er = 720, Zi = { width: 280, height: 64 };
function Wp(e, t, n) {
  const r = Uc(n), o = e.find((s) => s.id === t);
  return !o || Qp(o, r) ? e : e.map(
    (s) => s.id === t ? { ...s, ...r } : s
  );
}
function Yp(e, t, n) {
  const r = Or(n), o = e.find((s) => s.id === t);
  return !o || em(o.resultView, r) ? e : e.map(
    (s) => s.id === t ? { ...s, resultView: r } : s
  );
}
function Xp({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: o
}) {
  if (!t || !n || !o)
    return null;
  const s = e.type === "group", i = e.type === "power" && si(e.power, e.kind);
  return /* @__PURE__ */ d(mn, { children: jc.map((a) => /* @__PURE__ */ d(
    Du,
    {
      position: a.position,
      className: `ws-resize-control ws-node-resize-control ${a.className} nodrag nopan`,
      minWidth: s ? Hi.width : i ? Zi.width : ko,
      minHeight: s ? Hi.height : i ? Zi.height : gi,
      maxWidth: s ? Wi.width : Er,
      maxHeight: s ? Wi.height : Er,
      keepAspectRatio: !s && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (c, u) => o(e.id, Uc(u))
    },
    a.position
  )) });
}
function Zp({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: o
}) {
  const s = G(null);
  if (!t)
    return null;
  const i = (u, l) => {
    if (u.button !== 0)
      return;
    u.preventDefault(), u.stopPropagation();
    const m = Or(e), I = u.currentTarget.parentElement?.getBoundingClientRect().width || m.width;
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
    const m = Jp(
      l.startView,
      l.corner,
      (u.clientX - l.startX) / l.scale,
      (u.clientY - l.startY) / l.scale
    );
    l.currentView = m, r(m);
  }, c = (u) => {
    const l = s.current;
    !l || l.pointerId !== u.pointerId || (u.preventDefault(), u.stopPropagation(), s.current = null, u.currentTarget.hasPointerCapture(u.pointerId) && u.currentTarget.releasePointerCapture(u.pointerId), o(Or(l.currentView)));
  };
  return /* @__PURE__ */ d(mn, { children: jc.map((u) => /* @__PURE__ */ d(
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
function Jp(e, t, n, r) {
  const o = e.width / e.height, s = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * o, a = $c(
    Math.abs(s - e.width) >= Math.abs(i - e.width) ? s : i,
    o
  ), c = a / o, u = Number(e.offsetX || 0), l = Number(e.offsetY || 0);
  return Or({
    width: a,
    height: c,
    offsetX: t.left ? u + e.width - a : u,
    offsetY: t.top ? l + (e.height - c) / 2 : l + (c - e.height) / 2
  });
}
function $c(e, t) {
  const n = Math.max(ko, gi * t), r = Math.min(Er, Er * t);
  return n > r ? Math.min(Er, Math.max(ko, e)) : Math.min(r, Math.max(n, e));
}
function Or(e) {
  const t = Ji(e.width, ko), n = Ji(e.height, gi), r = t / n, o = $c(t, r);
  return {
    width: Math.round(o),
    height: Math.round(o / r),
    offsetX: Math.round(Qi(e.offsetX, 0)),
    offsetY: Math.round(Qi(e.offsetY, 0))
  };
}
function Ji(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Qi(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Uc(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function Qp(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function em(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
function tm(e, t) {
  const n = e || Vc(), r = Vl({
    type: "stream",
    output: t
  }), o = r.event, s = r.activity, i = sm(n.text, r.delta, t, o), a = im(o, s) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, c = s && !s.anchorText ? { ...s, anchorText: i } : s, u = c ? Kl(n.activities, c) : n.activities, l = Ll(
    ql(n.document, r.output),
    dc(r.output.document)
  ), m = cc(a) || n.interaction, I = ac(a);
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
function nm(e) {
  const t = rm(e);
  return {
    started: Object.keys(t).length > 0,
    text: xo(t.text),
    output: t,
    activities: $l(t),
    document: dc(t.document),
    interaction: cc(t),
    suggestions: ac(t),
    error: xo(t.error)
  };
}
function rm(e) {
  const t = Ul(e);
  if (xo(t.text))
    return t;
  const n = Qa(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function om(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function Vc() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function sm(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && xo(n.text) || e;
}
function im(e, t) {
  return !(t || e === "start" || e === "delta");
}
function xo(e) {
  return e == null ? "" : String(e);
}
function am(e) {
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
function cm(e, t) {
  const n = um(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function dm(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function ln(e, t) {
  const n = ta(e), r = t ? ta(t) : null, o = [
    ...n.versions || [],
    ...r?.versions || []
  ], s = lm(
    [pm(n.version)].filter(
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
function ea(e, t) {
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
function um(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function ta(e) {
  const t = na(e.version), n = (e.versions || []).map(na).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function na(e) {
  if (!e)
    return;
  const t = wl(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function lm(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (!s || Number(s.id || 0) <= 0)
      continue;
    const i = String(s.id), a = r.get(i);
    if (a !== void 0) {
      n[a] = fm(
        n[a],
        s
      );
      continue;
    }
    r.set(i, n.length), n.push(s);
  }
  let o = !1;
  return n.sort(
    (s, i) => Number(gs(i)) - Number(gs(s)) || Number(i.version || i.id || 0) - Number(s.version || s.id || 0)
  ).map((s) => gs(s) ? o ? mm(s) : (o = !0, s) : s);
}
function fm(e, t) {
  const n = { ...e };
  for (const [r, o] of Object.entries(t))
    o !== void 0 && o !== "" && (n[r] = o);
  return n;
}
function gs(e) {
  return !!(e.is_current || e.current);
}
function pm(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function mm(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function To(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return Mn(r, "execution_id", e?.execution_id), Mn(r, "run_id", e?.run_id || n?.run_id), ys(r, "request_id", e?.request_id), Mn(r, "flow_run_id", e?.flow_run_id), Mn(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), Mn(r, "asset_id", t?.id), Mn(r, "version_id", n?.id || t?.version_id), Mn(
    r,
    "release_id",
    n?.release_id || e?.release_id
  ), ys(r, "role", e?.role || t?.role), ys(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function gm(e) {
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
function ys(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const ym = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], hm = Object.fromEntries(
  ym.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function wm(e) {
  return hm[e] || "文本";
}
function _m(e) {
  const t = new Map(e.nodes.map((i) => [i.id, i])), n = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), r = bm(
    e.assets,
    e.assetCateId
  ), o = e.nodes.filter(Nc).map((i) => {
    const a = r.get(i.id) || i.asset, c = i.groupId ? n.get(i.groupId) : void 0, u = c?.group?.sourceNodeId ? t.get(c.group.sourceNodeId) : void 0, l = e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || wm(ra(i)),
      sourcePath: u?.title && c?.title ? `${u.title} / ${c.title}` : c?.title,
      nodeType: ra(i),
      status: Nm(
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
      nodeType: Kc(i.kind),
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
function ra(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : Kc(e.power?.kind || e.kind);
}
function Kc(e) {
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
function bm(e, t) {
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
function Nm(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function rb(e, t = []) {
  return {
    current: Sm([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: Lc(
          n.preview,
          String(n.type || "")
        ),
        source: "current",
        output: n.output,
        preview: n.preview
      }))
    ])
  };
}
function Im(e) {
  return e.map(
    (t) => ({
      id: t.role === "material" ? t.nodeId || t.key : String(t.assetId || t.key),
      title: t.title,
      kind: Lc(t.preview, t.nodeType),
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
function Sm(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = `${r.source}:${r.id}`;
    n.has(o) || (n.add(o), t.push(r));
  }
  return t;
}
function Lc(e, t) {
  return e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : String(t || "file").toLowerCase();
}
function zn(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function qc(e) {
  const t = String(e.status || "").trim();
  if (!t)
    return !1;
  const n = pr(t);
  return n === "pending" || n === "running" || n === "waiting";
}
function yn(e) {
  const t = e?.output && typeof e.output == "object" ? e.output : {}, n = e?.run && typeof e.run == "object" ? e.run : {};
  return {
    execution_id: Number(e?.execution_id || 0),
    run_id: Number(e?.run_id || n.id || 0),
    request_id: String(e?.request_id || n.request_id || ""),
    asset_cate_id: Number(e?.asset_cate_id || 0),
    start_node_id: String(e?.start_node_id || ""),
    flow_run_id: Number(e?.flow_run_id || n.flow_run_id || 0),
    release_id: Number(e?.release_id || n.release_id || 0),
    status: pr(e?.status || n.status),
    error: hn(e?.error || n.error),
    executed: Number(e?.executed || e?.output?.executed || 0),
    total: Number(e?.total || e?.output?.total || 0),
    single_node: !!e?.single_node,
    created_at: String(e?.created_at || ""),
    updated_at: String(e?.updated_at || ""),
    title: String(e?.title || ""),
    output: e?.output || n.output,
    approvals: Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [],
    interactions: Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [],
    node_results: Gc(
      e?.node_results || t.node_results
    ),
    pending_node: yi(
      e?.pending_node || t.pending_node
    ),
    execution_plan: xm(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(Mm).filter((r) => !!r) : []
  };
}
function yi(e) {
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
    error: hn(e.error),
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
function Gc(e) {
  return Array.isArray(e) ? e.map(yi).filter((t) => !!t) : [];
}
function Cm(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = Gc(e.node_results), o = n ? r.find((s) => s.node_key === n) : r[0];
  return o || yi(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function hi(e) {
  return e ? Xc(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function Hc(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => pr(
    n.status || n.result?.status
  ) === "fail");
  return Xc(
    hi(t),
    e.output?.error,
    e.error
  );
}
function vm(e, t = "节点运行失败") {
  return wi(
    hi(e),
    t
  );
}
function Wc(e, t = "画布运行失败") {
  return wi(Hc(e), t);
}
function wi(e, t = "运行失败") {
  const n = hn(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function Rm(...e) {
  for (const t of e) {
    const n = hn(t);
    if (n)
      return n;
  }
  return "";
}
const Yc = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function km(e) {
  return Yc.has(hn(e));
}
function Xc(...e) {
  let t = "";
  for (const n of e) {
    const r = hn(n);
    if (r && (t ||= r, !Yc.has(r)))
      return r;
  }
  return t;
}
function hn(e) {
  if (typeof e == "string")
    return e.trim();
  if (e instanceof Error)
    return e.message.trim();
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e, n = Rm(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = hn(t.code), o = hn(t.detail);
  return [r, o].filter(Boolean).join(": ");
}
function xm(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(Tm).filter(
    (r) => !!r
  ) : [], n = Array.isArray(e.edges) ? e.edges.map(Am).filter(
    (r) => !!r
  ) : [];
  return {
    nodes: t,
    edges: n,
    incoming: oa(e.incoming),
    outgoing: oa(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function Tm(e) {
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
function Am(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function oa(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const o = Array.isArray(r) ? r.map((s) => String(s || "")).filter(Boolean) : [];
    t.set(String(n), o);
  }
  return t;
}
function Mm(e) {
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
const Dm = oi.joinSiteApi;
async function Zc(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return ku({
    streamApi: Em(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function Em(e) {
  const t = new URL(Dm("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const Jc = "反馈已被新的运行替换";
function Pm(e) {
  return e instanceof Error && e.message === Jc;
}
function jn(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function Fm(e, t) {
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
function zm(e, t, n) {
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
function Om(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((s) => s.id === e.node.id) || e.node, o = jn(r).find(
    (s) => s.id === e.recordId
  );
  return o ? !(o.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function Bm(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: pr(t?.status || e?.status || "running"),
    output: ge(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(Vm).filter(Boolean),
    interactions: r.map($m).filter(Boolean),
    raw: e
  };
}
function jm(e) {
  const t = e.interactions.find(
    (s) => !!(s.interaction?.id && s.interaction?.type)
  );
  if (t)
    return Qc(t);
  const n = e.approvals.find(Km);
  if (!n?.id)
    return null;
  const r = Lm(n), o = _i(r);
  return {
    approval: n,
    title: xe(r.title, n.title, "补充信息"),
    description: xe(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: o,
    values: bi(r, o)
  };
}
function Qc(e) {
  const t = e.interaction, n = _i(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: xe(t.title, "补充信息"),
    description: xe(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: bi(t, n)
  };
}
function $m(e) {
  const t = xu(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function _i(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => qm(n, r)).filter((n) => !!n.key);
}
function bi(e, t) {
  const n = Gl(t), r = e.values && typeof e.values == "object" ? e.values : {}, o = {
    ...n,
    ...r
  }, s = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return s > 0 && (o.source_target_id = s), o;
}
function Um(e, t) {
  const n = Gm(e);
  if (!n)
    return null;
  const r = _i(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: xe(n.title, t, "补充信息"),
    description: xe(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: r,
    values: bi(n, r)
  };
}
function Vm(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function Km(e) {
  return e.status === "pending" || e.decision === "pending";
}
function Lm(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function qm(e, t) {
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
    accepted_kinds: sa(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: sa(
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
function sa(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function Gm(e) {
  const t = hs(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = hs(e?.interaction);
    return r && xe(r.type) ? r : null;
  }
  const n = hs(t.interaction, t.content?.interaction);
  return n && xe(n.type) ? n : null;
}
function hs(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
async function Hm(e) {
  return (await _l({
    teamID: e.teamID,
    projectID: e.projectID,
    files: e.files,
    ruleID: e.ruleID
  })).map(
    ({ sourceFile: n, uploadedFile: r, asset: o }) => Ym(r, n, o)
  );
}
function Wm(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : "file";
}
function Ym(e, t, n) {
  const r = String(
    e?.url || e?.open_url || e?.download || ""
  ), o = String(e?.kind || Wm(t));
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
function Xm({
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
  const [l, m, I] = Eu({
    sourceX: t,
    sourceY: n,
    sourcePosition: s,
    targetX: r,
    targetY: o,
    targetPosition: i
  }), N = u || {}, _ = !!N.isSelected, F = !!(N.isHighlighted || _), D = N.highlightColor || "#0ea5e9";
  return /* @__PURE__ */ A(mn, { children: [
    F ? /* @__PURE__ */ d(
      Vi,
      {
        path: l,
        style: {
          stroke: D,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ d(
      Vi,
      {
        path: l,
        markerEnd: a,
        style: {
          ...c,
          stroke: _ ? "var(--ws-edge-selected)" : F ? D : "var(--ws-edge)",
          strokeWidth: _ ? 2.8 : F ? 2.4 : 1.45,
          opacity: F ? 0.96 : 0.62,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    _ ? /* @__PURE__ */ d(Pu, { children: /* @__PURE__ */ d(
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
        children: /* @__PURE__ */ d(qu, { size: 15 })
      }
    ) }) : null,
    F ? /* @__PURE__ */ A(mn, { children: [
      /* @__PURE__ */ d("circle", { r: "3", fill: D, children: /* @__PURE__ */ d("animateMotion", { dur: "2.8s", repeatCount: "indefinite", path: l }) }),
      /* @__PURE__ */ d("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ d("animateMotion", { dur: "2.8s", repeatCount: "indefinite", path: l }) })
    ] }) : null
  ] });
}
const Zm = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function Jm({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ d(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: Zm,
      children: /* @__PURE__ */ A(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ d(gn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(Gr, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ d("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function ws({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [o, s] = K(!1), [i, a] = K(e), c = G(null);
  de(() => {
    o || a(e);
  }, [o, e]), de(() => {
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
const ia = 160, aa = 72, ca = 72, Ao = 72, Br = 24, jr = 24, $r = 40, $n = 2, Mo = { width: 180, height: 180 }, Qm = "storyboard-derived-layout-v7";
function eg(e) {
  const t = e.groups.map((_) => ({
    ..._,
    size: og(_)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(mo), o = sg(
    "workspace",
    r
  ), s = t.filter((_) => _.direction === "upstream").sort(mo), i = t.filter(
    (_) => _.direction === "downstream" && _.powerKind !== "audio"
  ).sort(mo), a = t.filter(
    (_) => _.direction === "downstream" && _.powerKind === "audio"
  ).sort(mo), c = i.reduce(
    (_, F) => Math.max(_, F.size.height),
    0
  ), u = i.length ? e.sourceNode.y - c - ca : e.sourceNode.y, l = e.sourceNode.x - ia;
  let m = u;
  for (const _ of s)
    n.set(_.key, {
      bounds: {
        x: l - _.size.width,
        y: m,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), m += _.size.height + ca;
  let I = e.sourceNode.x;
  for (const _ of i)
    n.set(_.key, {
      bounds: {
        x: I,
        y: u,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), I += _.size.width + aa;
  let N = e.sourceNode.x + e.sourceNode.width + ia;
  for (const _ of a)
    n.set(_.key, {
      bounds: {
        x: N,
        y: e.sourceNode.y,
        width: _.size.width,
        height: _.size.height
      },
      layoutKey: `${o}:${_.key}`
    }), N += _.size.width + aa;
  return n;
}
function tg(e, t, n) {
  const r = t.filter((a) => a.groupId === e.id), o = n.kind === "audio", s = o ? n.width : Math.max(Mo.width, n.width), i = o ? n.height : Math.max(Mo.height, n.height);
  for (let a = 0; a < r.length + 100; a += 1) {
    const c = a % $n, u = Math.floor(a / $n), l = {
      x: e.x + Br + c * (s + jr),
      y: e.y + Ao + u * (i + $r)
    };
    if (r.every(
      (m) => !ig(
        { ...l, width: n.width, height: n.height },
        m
      )
    ))
      return l;
  }
  return {
    x: e.x + Br,
    y: e.y + Ao
  };
}
function ng(e, t) {
  const n = t.some((s) => s.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : Mo.width,
      ...t.map((s) => s.width)
    ),
    height: Math.max(
      n ? 0 : Mo.height,
      ...t.map((s) => s.height)
    )
  }, o = /* @__PURE__ */ new Map();
  return t.forEach((s, i) => {
    const a = i % $n, c = Math.floor(i / $n);
    o.set(s.id, {
      x: e.x + Br + a * (r.width + jr),
      y: e.y + Ao + c * (r.height + $r)
    });
  }), {
    ...ed(t.length, r),
    positions: o
  };
}
function rg(e) {
  return Ko(e || void 0);
}
function og(e) {
  const t = rg(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return ed(e.itemCount, t);
}
function ed(e, t) {
  const n = Math.max(1, Math.ceil(e / $n));
  return {
    width: Br * 2 + t.width * $n + jr * ($n - 1),
    height: Ao + Br + n * t.height + (n - 1) * $r
  };
}
function sg(e, t) {
  return [
    Qm,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function mo(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function ig(e, t) {
  return !(e.x + e.width + jr <= t.x || t.x + t.width + jr <= e.x || e.y + e.height + $r <= t.y || t.y + t.height + $r <= e.y);
}
const ag = [
  "characters",
  "scenes",
  "props"
], da = {
  character: "生成一张纯角色设定图，在同一张图内依次展示当前角色的正面全身、侧面全身、背面全身，以及面部和服装关键细节；各视角互不遮挡，必须保持同一人物的五官、发型、服装、体型和比例一致，采用清晰规范的角色设定图排版，不得拆分生成多张独立图片，不得出现其他人物、文字、水印或界面元素",
  scene: "生成一张纯场景参考图，采用能够完整说明空间关系的广角主视图，清晰展示固定空间的环境、结构、光线和关键区域；只生成一个完整画面，不得使用拼图、宫格或分栏排版，不得出现任何人物、角色、动物、文字、水印或界面元素",
  prop: "生成一张纯道具参考图，采用四分之三主视角，清晰展示当前道具的造型、比例、材质和关键细节；只生成一个完整画面，不得使用拼图、宫格、分栏或多视角排版，不得出现人物、手持者、文字、水印或界面元素"
}, Os = [
  _s("characters", "角色组", "character", 0),
  _s("scenes", "场景组", "scene", 1),
  _s("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: ag,
    layoutIndex: 0,
    enabled: rc,
    items: (e) => e.shots.flatMap((t, n) => {
      if (t.continue_previous)
        return [];
      const r = gg(e, t, n);
      return [
        {
          type: "shot_image",
          id: t.id,
          title: `镜头 ${t.order || n + 1} 参考图`,
          prompt: wg(
            e,
            t,
            r.previousShot,
            r.externalReferences
          ),
          dependencyItems: r.dependencyItems,
          referenceItems: r.referenceItems,
          externalReferences: r.externalReferences,
          paramValues: Rg(e),
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
    enabled: xl,
    items: (e) => e.shots.map((t, n) => {
      const r = hg(e, t, n);
      return {
        type: "shot",
        id: t.id,
        title: `镜头 ${t.order || n + 1}`,
        prompt: _g(
          e,
          t,
          r.externalReferences
        ),
        ...r,
        paramValues: kg(e, t),
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
    enabled: Tl,
    items: cg
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
    enabled: Al,
    items: ug
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
    enabled: Ml,
    items: lg
  }
];
function _s(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (o) => rc(o) && o.materials.some((s) => s.type === n),
    items: (o) => o.materials.filter((s) => s.type === n).map((s) => {
      const i = Ng(
        o,
        s
      );
      return {
        type: n,
        id: s.id,
        title: s.name,
        prompt: pg(
          o,
          s,
          i
        ),
        externalReferences: i
      };
    })
  };
}
function cg(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, o) => {
      const s = dg(e, r);
      return {
        type: "speech",
        id: r.id,
        title: fg(
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
function dg(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function ug(e) {
  return e.shots.flatMap((t, n) => {
    const r = Dl(t);
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
function lg(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(El);
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
function fg(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const o = e.materials.find(
    (s) => s.type === "character" && s.id === t.character_id
  );
  return `镜头 ${n} ${o?.name || "角色"}配音`;
}
function pg(e, t, n) {
  const r = nd(n), o = t.prompt.trim();
  if (o)
    return vo(
      e,
      `${r}${o}。${da[t.type]}`,
      t.type
    );
  const s = e.shots.filter((a) => a.material_ids.includes(t.id)).map((a) => a.description.trim()).filter(Boolean), i = s.length ? `相关镜头：${s.join("；")}` : "保持整部作品的统一视觉风格";
  return vo(
    e,
    `${r}${sc[t.type]}“${t.name}”的素材生成图。${i}。${da[t.type]}`,
    t.type
  );
}
function mg(e, t) {
  return oc(e, t).map((n) => ({
    type: n.type,
    id: n.id
  }));
}
function gg(e, t, n) {
  const r = mg(e, t), o = Ig(e, t), s = t.match_previous ? yg(e, n) : void 0;
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
function yg(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function hg(e, t, n) {
  const r = Sg(e, t), o = n > 0 ? e.shots[n - 1] : void 0;
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
function wg(e, t, n, r = []) {
  const o = oc(e, t), s = [
    ...r.map(
      (a, c) => `参考图${c + 1}是${rd(a)}`
    ),
    n ? `参考图${r.length + 1}是前序镜头 ${n.order} 的参考画面` : "",
    ...o.map(
      (a, c) => `参考图${r.length + c + (n ? 2 : 1)}是${sc[a.type]}“${a.name}”`
    )
  ].filter(Boolean).join("，"), i = [
    `镜头 ${t.order} 的单张参考画面`,
    s ? `图片顺序说明：${s}` : "",
    s ? "必须严格按照上述图片顺序识别素材，不得交换、合并或忽略参考对象" : "",
    n ? "当前镜头明确要求匹配上一镜画面；前序镜头只用于保持共同主体状态、光线与空间关系，当前素材清单中不存在的对象不得继续保留" : "",
    td(e, t),
    `入镜关键帧状态：${t.continuity_state.entry.trim()}`,
    "当前图片只表现镜头开始时的入镜状态，不提前表现本镜头动作完成后的出镜状态",
    "严格保持参考角色的五官、发型、服装、配色和体型，保持场景结构、道具造型以及整部作品画风一致",
    "不同参考对象必须保持各自独立的轮廓、材质和尺度，不得把角色与道具融合、机械化、穿戴化或互换材质",
    "角色必须保留参考图中的发饰数量与位置以及完整服装，道具必须保持参考图中的原始尺寸比例",
    t.description.trim(),
    t.camera_instruction.trim() ? `镜头语言：${t.camera_instruction.trim()}` : "",
    sd(t),
    `画幅：${e.aspect_ratio}`,
    "画面中不要出现字幕、对白文字、水印或界面元素"
  ].filter(Boolean);
  return vo(e, od(i));
}
function _g(e, t, n = []) {
  const r = t.video_prompt.trim() || Pl(t), o = [
    td(e, t),
    `入镜状态：${t.continuity_state.entry.trim()}`,
    `出镜状态：${t.continuity_state.exit.trim()}`,
    "视频必须从入镜状态开始，只完成本镜头的主要动作，并准确停在出镜状态",
    r,
    nd(n),
    t.continue_previous ? `使用上一镜头真实尾帧继续生成。连续性锚点：${t.continuity_anchor}。保持人物、服装、道具、场景光线和动作方向一致，但不要重复上一镜头内容` : "这是新的镜头段落，以当前镜头参考图为画面锚点建立画面",
    sd(t),
    `画幅：${e.aspect_ratio}`,
    "不生成可辨识对白、旁白、字幕或背景音乐，只保留环境声、动作声和不可辨识的人物声音",
    `时长 ${t.duration} 秒`
  ].filter(Boolean);
  return vo(e, od(o));
}
function td(e, t) {
  const n = e.shots.findIndex((i) => i.id === t.id), o = (n <= 0 ? e.storyline.setup : n >= e.shots.length - 1 ? e.storyline.payoff : e.storyline.development).trim(), s = e.shots[n + 1]?.transition.trim();
  return [
    `故事目标：${e.summary.trim()}`,
    o ? `当前叙事阶段：${o}` : "",
    `本镜变化：${t.beat.trim()}`,
    t.transition.trim() ? `从上一镜进入本镜：${t.transition.trim()}` : "",
    bg(t, n),
    s ? `本镜结束需为下一镜建立：${s}` : ""
  ].filter(Boolean).join("；");
}
function bg(e, t) {
  if (t <= 0)
    return "";
  const n = Ol[e.transition_type];
  return e.transition_type === "none" ? `进入本镜的剪辑方式：${n}` : `进入本镜的剪辑方式：${n}，时长 ${e.transition_duration_ms} 毫秒；这是后期剪辑信息，画面本身不要生成转场叠影`;
}
function Ng(e, t) {
  return Ii([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Ni(e, "image")
  ]);
}
function Ig(e, t) {
  return Ii([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Ni(e, "image")
  ]);
}
function Sg(e, t) {
  return Ii([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...Ni(e, "video")
  ]);
}
const Cg = {
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
function Ni(e, t) {
  const n = Cg[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function nd(e) {
  const t = e.map(rd);
  return t.length > 0 ? `参考素材：${t.join("；")}。` : "";
}
const vg = {
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
function rd(e) {
  const t = vg[e.purpose];
  return t ? `${e.label}（${t}）` : e.label;
}
function Ii(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function od(e) {
  return e.map((t) => t.trim().replace(/[。！？!?；;，,：:]+$/g, "")).filter(Boolean).join("。");
}
function Rg(e) {
  return { aspectRatio: e.aspect_ratio, resolution: "2k" };
}
function kg(e, t) {
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration
  };
}
function sd(e) {
  return !Fl(e) || ![...zl(e)][0] ? "" : "出镜说话角色是画面中唯一清晰可识别的正脸，其他人物使用背面、侧后方、远景或遮挡构图";
}
const go = "storyboard-soundtrack";
function xg(e) {
  const t = new Map(
    (e.current?.clips || []).map((r) => [r.id, r])
  ), n = e.storyboard.shots.map(
    (r, o) => Ag({
      ...e,
      shot: r,
      index: o,
      current: t.get(r.id)
    })
  );
  return {
    version: 3,
    clips: Hl(
      n,
      (e.current?.clips || []).map((r) => r.id),
      (r) => r.id
    ),
    audioTracks: Tg(
      e.storyboard,
      e.current?.audioTracks || []
    ),
    settings: {
      resolution: e.current?.settings.resolution || "auto",
      fps: e.current?.settings.fps ?? 0
    }
  };
}
function Tg(e, t) {
  const n = e.references.find(
    (u) => u.purpose === "soundtrack"
  );
  if (!n)
    return t.filter((u) => u.id !== go);
  const r = t.find(
    (u) => u.id === go
  ), o = Number(n.asset_id || 0), s = Number(n.version_id || 0), i = {
    id: go,
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
  const c = t.flatMap((u) => u.id !== go ? [u] : a ? [] : (a = !0, [i]));
  return a ? c : [...c, i];
}
function Ag(e) {
  const t = Do(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), n = Do(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), r = Bs(t), o = n?.storyboardItem?.stale ? void 0 : Bs(n), s = !!e.current?.useOriginalVideo, i = [];
  t?.power ? r || i.push("镜头视频尚未生成") : i.push("未配置镜头视频能力");
  const a = new Map(
    (e.current?.speechTracks || []).map((_) => [_.id, _])
  ), c = e.shot.speech.filter((_) => _.text.trim()).map(
    (_) => Pg(
      e.nodes,
      e.sourceNodeId,
      _,
      a.get(_.id),
      i
    )
  ), u = Eg(
    e.nodes,
    e.sourceNodeId,
    e.shot.id
  ), l = !s && o ? o : r, m = e.storyboard.shots[e.index + 1], I = m ? {
    type: m.transition_type,
    durationMs: m.transition_type === "none" ? 0 : m.transition_duration_ms
  } : { type: "none", durationMs: 0 }, N = Mg(
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
    blockingIssues: Fg(i),
    transitionToNext: N,
    storyboardTransitionToNext: I
  };
}
function Mg(e, t) {
  if (!e)
    return t;
  const n = e.storyboardTransitionToNext;
  return n && Dg(
    e.transitionToNext,
    n
  ) ? t : e.transitionToNext;
}
function Dg(e, t) {
  return e.type === t.type && e.durationMs === t.durationMs;
}
function Eg(e, t, n) {
  const r = Do(
    e,
    t,
    "subtitle",
    n
  ), o = gt(r?.resultOutput);
  return (Array.isArray(o.tracks) ? o.tracks : []).flatMap((i) => {
    const a = gt(i), c = fo(a.id), u = fo(a.text);
    if (!c || !u)
      return [];
    const l = ua(a.end_time ?? a.endTime), m = fo(a.speech_id ?? a.speechId);
    return [
      {
        id: c,
        text: u,
        startTime: Math.max(
          0,
          ua(a.start_time ?? a.startTime)
        ),
        ...l > 0 ? { endTime: l } : {},
        ...m ? { speechId: m } : {},
        source: fo(a.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function Pg(e, t, n, r, o) {
  const s = Do(e, t, "speech", n.id), i = Bs(s);
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
function Do(e, t, n, r) {
  return e.find(
    (o) => o.storyboardItem?.sourceNodeId === t && o.storyboardItem.itemType === n && o.storyboardItem.itemId === r
  );
}
function Bs(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), o = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !o))
    return {
      assetId: r,
      versionId: o,
      label: e?.title || "素材"
    };
}
function Fg(e) {
  return [...new Set(e.filter(Boolean))];
}
function ua(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function id(e) {
  const t = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), n = String(e.composerDraft?.prompt || "").trim();
  return !!(t && n && n !== t);
}
function zg(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!n || r.trim() === n)
    return null;
  const o = new Set(
    e.storyboardItem?.referenceNodeIds || []
  ), s = t.filter((I) => o.has(I.id)).map(
    (I) => cd(
      I,
      e.storyboardItem?.itemType
    )
  ).filter((I) => !!I), i = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = lc(
    e.composerDraft?.promptContent
  ).filter((I) => i.has(I.refId)), c = t.find(
    (I) => I.id === e.storyboardItem?.sourceNodeId
  ), l = ((c ? Hr([
    c.asset?.version?.content,
    c.resultOutput
  ]) : null)?.references || []).filter((I) => i.has(I.asset_id)).map(dd), m = [
    ...s,
    ...a,
    ...l
  ];
  return {
    ...e.composerDraft || {},
    prompt: n,
    promptContent: m.length ? ci(n, m) : void 0,
    paramValues: fd(
      e.composerDraft?.paramValues,
      r,
      n
    )
  };
}
function Eo(e, t, n) {
  const r = fa(n);
  return e.find(
    (o) => Number(o.id || 0) > 0 && String(o.kind || "").trim().toLowerCase() === t && fa(o.outputType) === r
  ) || null;
}
function js(e) {
  let t = e.canvas;
  for (const n of e.canvas.nodes) {
    if (n.type !== "power" || !$o(
      n.power,
      n.kind,
      n.outputType
    ))
      continue;
    const r = Hr([
      n.asset?.version?.content,
      n.resultOutput
    ]);
    if (!r || !Bl(r))
      continue;
    const o = t.nodes.find((u) => u.id === n.id) || n, s = Og(
      o,
      r
    ), i = String(
      o.storyboardMaterializedSignature || ""
    ), a = Bg(
      t.nodes,
      o.id
    );
    t = (i ? i !== s : !a) ? Vg({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers
    }) : $g({
      canvas: t,
      storyboardNode: o,
      storyboard: r,
      assetCate: e.assetCate,
      powers: e.powers
    }), t = jg(
      t,
      o.id,
      s
    );
  }
  return t;
}
function Og(e, t) {
  return et(
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
function Bg(e, t) {
  return e.some(
    (n) => n.storyboardItem?.sourceNodeId === t || n.type === "group" && n.group?.origin === "script" && n.group.sourceNodeId === t
  );
}
function jg(e, t, n) {
  const r = e.nodes.findIndex((s) => s.id === t);
  if (r < 0 || e.nodes[r].storyboardMaterializedSignature === n)
    return e;
  const o = [...e.nodes];
  return o[r] = {
    ...o[r],
    storyboardMaterializedSignature: n
  }, { ...e, nodes: o };
}
function $g(e) {
  const t = [...e.canvas.nodes];
  let n = !1, r = "";
  const o = Os.filter(
    (a) => a.enabled(e.storyboard)
  );
  for (const a of o) {
    const c = a.local ? null : Eo(e.powers, a.powerKind, a.outputType);
    for (const u of a.items(e.storyboard)) {
      const l = t.findIndex(
        (_) => Ur(
          _,
          e.storyboardNode.id,
          u.type,
          u.id
        )
      );
      if (l < 0)
        continue;
      const m = ad(
        u,
        t,
        e.storyboardNode.id
      ), I = t[l], N = ud(
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
  if (ic(e.storyboard)) {
    const a = wd({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: Eo(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    n = n || !!a?.changed, r = a?.node.id || "";
  }
  let s = yd(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  s = hd(s, t, e.storyboardNode.id), s = r ? _d(
    s,
    t,
    e.storyboardNode.id,
    r,
    o
  ) : bd(s, e.storyboardNode.id);
  const i = s !== e.canvas.edges;
  return n || i ? {
    ...e.canvas,
    nodes: n ? t : e.canvas.nodes,
    edges: s
  } : e.canvas;
}
function Ug(e) {
  return JSON.stringify(
    e.nodes.filter(
      (t) => !!t.storyboardItem || t.type === "power" && $o(
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
function Vg(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Set(), r = new Set(
    Os.map((N) => N.itemType)
  ), o = Os.filter(
    (N) => N.enabled(e.storyboard)
  ), s = ic(
    e.storyboard
  );
  r.add("video_compose"), s && n.add(
    No(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const i = o.map((N) => ({
    spec: N,
    items: N.items(e.storyboard),
    power: N.local ? null : Eo(e.powers, N.powerKind, N.outputType)
  }));
  for (const { items: N } of i)
    for (const _ of N)
      n.add(
        No(e.storyboardNode.id, _.type, _.id)
      );
  let a = !1;
  for (let N = t.length - 1; N >= 0; N -= 1) {
    const _ = t[N].storyboardItem;
    !_ || _.sourceNodeId !== e.storyboardNode.id || !r.has(_.itemType) || n.has(
      No(
        _.sourceNodeId,
        _.itemType,
        _.itemId
      )
    ) || (t.splice(N, 1), a = !0);
  }
  const c = eg({
    sourceNode: e.storyboardNode,
    groups: i.map(({ spec: N, items: _, power: F }) => ({
      key: N.key,
      layoutIndex: N.layoutIndex,
      itemCount: _.length,
      power: F,
      powerKind: N.powerKind,
      direction: N.direction
    }))
  });
  let u = li(t, e.canvas.nextNodeNo);
  a = a || u !== e.canvas.nextNodeNo;
  for (const { spec: N, items: _, power: F } of i) {
    const D = c.get(N.key);
    if (!D)
      continue;
    const O = qg({
      nodes: t,
      storyboardNode: e.storyboardNode,
      spec: N,
      layout: D,
      assetCate: e.assetCate
    });
    a = a || O.changed;
    for (const R of _) {
      const v = ad(
        R,
        t,
        e.storyboardNode.id
      ), T = t.findIndex(
        (pe) => Ur(
          pe,
          e.storyboardNode.id,
          v.type,
          v.id
        )
      );
      if (T >= 0) {
        const pe = t[T], re = ud(
          pe,
          O.node.id,
          v,
          N,
          F
        );
        re !== pe && (t[T] = re, a = !0);
        continue;
      }
      const W = Gg({
        nodes: t,
        group: O.node,
        storyboardNode: e.storyboardNode,
        item: v,
        assetCate: e.assetCate,
        spec: N,
        power: F
      });
      W.nodeNo = u++, t.push(W), a = !0;
    }
    const L = _.map(
      (R) => t.find(
        (v) => v.groupId === O.node.id && Ur(
          v,
          e.storyboardNode.id,
          R.type,
          R.id
        )
      )
    ).filter((R) => !!R), H = ng(
      O.node,
      L
    );
    for (const R of L) {
      const v = H.positions.get(R.id);
      if (!v || R.x === v.x && R.y === v.y)
        continue;
      const T = t.indexOf(R);
      t[T] = { ...R, ...v }, a = !0;
    }
    const Y = t.findIndex((R) => R.id === O.node.id), se = t[Y];
    (se.width !== H.width || se.height !== H.height) && (t[Y] = {
      ...se,
      width: H.width,
      height: H.height
    }, a = !0);
  }
  const l = new Set(o.map((N) => N.key));
  for (let N = t.length - 1; N >= 0; N -= 1) {
    const _ = t[N];
    _.type !== "group" || _.group?.origin !== "script" || _.group.sourceNodeId !== e.storyboardNode.id || !_.group.syncKey || l.has(
      _.group.syncKey
    ) || (t.splice(N, 1), a = !0);
  }
  const m = s ? wd({
    nodes: t,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: Eo(e.powers, "video", "video_compose"),
    nextNodeNo: u
  }) : null;
  m && (u = m.nextNodeNo, a = a || m.changed);
  let I = yd(
    e.canvas.edges,
    t,
    e.storyboardNode.id,
    o
  );
  return I = hd(I, t, e.storyboardNode.id), I = m ? _d(
    I,
    t,
    e.storyboardNode.id,
    m.node.id,
    o
  ) : bd(I, e.storyboardNode.id), I !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: u, nodes: t, edges: I } : e.canvas;
}
function ad(e, t, n) {
  const r = (_) => (_ || []).map(
    (F) => t.find(
      (D) => Ur(D, n, F.type, F.id)
    )
  ).filter((F) => !!F), o = r(e.dependencyItems), s = r(e.referenceItems), i = Zg([...o, ...s]), a = e.externalReferences || [], c = {
    ...e,
    dependencyNodeIds: o.map((_) => _.id),
    referenceNodeIds: s.map((_) => _.id),
    sourceSignatureParts: [
      ...e.sourceSignatureParts || [],
      ...i.map(Jg),
      ...a.map(Lg)
    ]
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return c;
  const u = Kg(
    e.prompt,
    s,
    a
  ), l = u === e.prompt ? c : { ...c, prompt: u }, m = a.map(
    dd
  );
  if (m.push(
    ...s.map((_) => cd(_, e.type)).filter((_) => !!_)
  ), !m.length)
    return l;
  const I = ci(
    u,
    m
  ), N = Wl(I);
  return uc(I) ? { ...c, prompt: N, promptContent: I } : { ...l, prompt: N };
}
function Kg(e, t, n = []) {
  const r = [], o = /* @__PURE__ */ new Set();
  for (const s of n) {
    const i = Gi(s.label), a = i ? `@${i}` : "";
    !a || o.has(a) || e.includes(a) || (o.add(a), r.push(a));
  }
  for (const s of t) {
    const i = Gi(s.title), a = i ? `@${i}` : "";
    !a || o.has(a) || e.includes(a) || (o.add(a), r.push(a));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function cd(e, t) {
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
function dd(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function Lg(e) {
  return [
    "asset",
    e.asset_id,
    e.version_id || 0,
    e.kind,
    e.purpose
  ].join(":");
}
function qg(e) {
  const t = Si(
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
  const n = e.layout.bounds, r = Vo("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = vi(
    e.nodes,
    `script-group-${et(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function Si(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function Gg(e) {
  const t = Vo(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = vi(
    e.nodes,
    `script-item-${et(
      No(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Ko({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${Xg(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: e.item.prompt,
    promptContent: e.item.promptContent,
    paramValues: e.item.paramValues
  }, t.storyboardItem = pd(
    e.storyboardNode.id,
    e.item
  );
  const n = tg(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function ud(e, t, n, r, o, s = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const a = i.sourceSignature || md({
    ...n,
    prompt: i.generatedPrompt,
    promptContent: e.composerDraft?.promptContent
  }), c = String(e.composerDraft?.prompt || ""), u = !c.trim() || c === i.generatedPrompt, l = u ? n.prompt : c, m = l !== c, I = Hg(
    e.composerDraft?.paramValues,
    c,
    l,
    n.paramValues
  ), N = I !== e.composerDraft?.paramValues, _ = u ? n.promptContent : Wg(
    c,
    e.composerDraft?.promptContent,
    n.promptContent
  ), F = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(_ || null), D = pd(i.sourceNodeId, n), O = ld(e), L = i.resultSourceSignature || (O ? a : "");
  L && !r.local && (D.resultSourceSignature = L), D.stale = r.local ? !1 : !!(O && L !== D.sourceSignature);
  const H = s.preserveStructure && e.titleMode === "manual" ? e.title : n.title, Y = e.title !== H, se = s.preserveStructure ? e.groupId || "" : t, R = !e.power && !!o, v = e.kind !== r.powerKind, T = e.outputType !== r.outputType, W = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === se && !m && !N && !F && !Y && !R && !v && !T && !W && gd(i, D) ? e : {
    ...e,
    title: H,
    kind: r.powerKind,
    outputType: r.outputType,
    ...R ? {
      power: o || void 0,
      subtitle: o?.output?.name || o?.name || e.subtitle
    } : {},
    description: m || R ? l : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: se,
    composerDraft: m || N || F ? {
      ...e.composerDraft || {},
      prompt: l,
      promptContent: _,
      paramValues: I
    } : e.composerDraft,
    storyboardItem: D
  };
}
function ld(e) {
  return Number(e.resultRef?.version_id || 0) > 0 || Number(e.asset?.version_id || e.asset?.version?.id || 0) > 0 || e.resultOutput != null;
}
function fd(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [o, s] of Object.entries(e))
    s === t && (r ||= { ...e }, r[o] = n);
  return r || e;
}
function Hg(e, t, n, r) {
  let o = fd(
    e,
    t,
    n
  );
  for (const [s, i] of Object.entries(r || {}))
    o?.[s] !== i && (o = { ...o || {}, [s]: i });
  return o;
}
function Wg(e, t, n) {
  return !n || !uc(n) ? t : ci(
    e,
    lc(n)
  );
}
function pd(e, t) {
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
    sourceSignature: md(t),
    stale: !1
  };
}
function md(e) {
  return et(
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
function gd(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && yo(e.dependencyNodeIds, t.dependencyNodeIds) && yo(e.referenceNodeIds, t.referenceNodeIds) && yo(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.speechId === t.speechId && yo(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && e.continuityAnchor === t.continuityAnchor && !!e.optional == !!t.optional && e.sourceSignature === t.sourceSignature && e.resultSourceSignature === t.resultSourceSignature && !!e.stale == !!t.stale;
}
function Ur(e, t, n, r) {
  const o = e.storyboardItem;
  return !!(o && o.sourceNodeId === t && o.itemType === n && o.itemId === r);
}
function yd(e, t, n, r) {
  const o = r.map((c) => ({
    spec: c,
    group: t.find(
      (u) => u.type === "group" && u.group?.origin === "script" && u.group.sourceNodeId === n && u.group.syncKey === c.key
    )
  })).filter(
    (c) => !!c.group
  ), s = `script-edge-${et(n)}-`, i = e.filter((c) => !c.id.startsWith(s));
  for (const { spec: c, group: u } of o) {
    const l = c.direction === "upstream", m = (c.sourceGroupKeys || []).map((N) => Si(t, n, N)).filter((N) => !!N), I = l ? [u] : m.length ? m : [t.find((N) => N.id === n)].filter(
      (N) => !!N
    );
    for (const N of I) {
      const _ = N.id, F = l ? n : u.id;
      i.push({
        id: Ri(
          i,
          `${s}${c.key}-${et(_)}`
        ),
        from: _,
        to: F,
        logicalFrom: _,
        logicalTo: F,
        purpose: "structure",
        executionMode: l ? void 0 : "manual"
      });
    }
  }
  const a = Ht(t, i);
  return Ci(e, a) ? e : a;
}
function hd(e, t, n) {
  const r = `script-item-edge-${et(n)}-`, o = e.filter((c) => !c.id.startsWith(r)), s = t.filter(
    (c) => c.storyboardItem?.sourceNodeId === n && (!!c.groupId || c.storyboardItem.itemType === "video_compose")
  ), i = new Map(s.map((c) => [c.id, c]));
  for (const c of s)
    for (const u of c.storyboardItem?.dependencyNodeIds || []) {
      const l = i.get(u);
      !l || l.id === c.id || o.push({
        id: Ri(
          o,
          `${r}${et(l.id)}-${et(c.id)}`
        ),
        from: l.id,
        to: c.id,
        logicalFrom: l.id,
        logicalTo: c.id,
        purpose: "dependency",
        executionMode: l.groupId && l.groupId === c.groupId ? void 0 : "manual"
      });
    }
  const a = Ht(t, o);
  return Ci(e, a) ? e : a;
}
function wd(e) {
  const t = e.nodes.find(
    (a) => Ur(
      a,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = xg({
    storyboard: e.storyboard,
    sourceNodeId: e.storyboardNode.id,
    nodes: e.nodes,
    current: t?.composerDraft?.videoComposition
  }), r = Yg(n), o = {
    sourceNodeId: e.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceSignature: r,
    stale: !1
  };
  if (t) {
    const a = e.preservePosition ? { x: t.x, y: t.y } : la(e.nodes, e.storyboardNode), c = ld(t), u = t.storyboardItem?.resultSourceSignature || (c ? t.storyboardItem?.sourceSignature : "");
    u && (o.resultSourceSignature = u), o.stale = !!(c && u !== r);
    const l = !t.power && !!e.power, m = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), I = t.x !== a.x || t.y !== a.y;
    if (!l && !m && !I && t.kind === "video" && t.outputType === "video_compose" && gd(t.storyboardItem, o))
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
  const s = la(
    e.nodes,
    e.storyboardNode
  ), i = Vo(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return i.id = vi(
    e.nodes,
    `script-compose-${et(e.storyboardNode.id)}`
  ), i.nodeNo = e.nextNodeNo, i.title = "视频合成", i.kind = "video", i.outputType = "video_compose", i.description = "按镜头顺序合成画面、原声和配音。", e.power || (i.subtitle = "未配置视频合成能力", i.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), i.composerDraft = { videoComposition: n }, i.storyboardItem = o, e.nodes.push(i), {
    node: i,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function Yg(e) {
  const t = e.clips.map((n) => {
    const r = { ...n };
    return delete r.storyboardTransitionToNext, r;
  });
  return et(JSON.stringify({ ...e, clips: t }));
}
function la(e, t) {
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
function _d(e, t, n, r, o) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (l) => o.some((m) => m.key === l)
  ).map((l) => Si(t, n, l)).filter((l) => !!l), a = `script-compose-edge-${et(n)}-`, c = e.filter((l) => !l.id.startsWith(a));
  for (const l of i.length ? i : t.filter((m) => m.id === n))
    c.push({
      id: Ri(
        c,
        `${a}${et(l.id)}`
      ),
      from: l.id,
      to: r,
      logicalFrom: l.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const u = Ht(t, c);
  return Ci(e, u) ? e : u;
}
function bd(e, t) {
  const n = `script-compose-edge-${et(t)}-`, r = e.filter((o) => !o.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function Ci(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const o = n.get(r.id);
    return !!(o && r.from === o.from && r.to === o.to && (r.logicalFrom || "") === (o.logicalFrom || "") && (r.logicalTo || "") === (o.logicalTo || "") && (r.purpose || "") === (o.purpose || "") && (r.executionMode || "auto") === (o.executionMode || "auto") && (r.mediaUsage || "") === (o.mediaUsage || ""));
  });
}
function No(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function vi(e, t) {
  return Nd(new Set(e.map((n) => n.id)), t);
}
function Ri(e, t) {
  return Nd(new Set(e.map((n) => n.id)), t);
}
function Nd(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function et(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function fa(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function Xg(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function yo(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function Zg(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => t.has(n.id) ? !1 : (t.add(n.id), !0));
}
function Jg(e) {
  return [
    e.id,
    Number(e.resultRef?.version_id || 0),
    Number(e.asset?.version_id || e.asset?.version?.id || 0),
    e.storyboardItem?.sourceSignature || "",
    e.storyboardItem?.resultSourceSignature || ""
  ].join(":");
}
const Qg = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function Id(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return Qg[n] || { section: "shots" };
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
const pa = 52, ma = 72, ey = 48, ty = {
  width: 360,
  height: 52
};
function ny(e, t) {
  const n = qo(e);
  return {
    frames: Cd(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: Sd(e, n)
  };
}
function ga(e) {
  return qo(e);
}
function ry(e, t) {
  return Sd(e).get(t.id) || "";
}
function Sd(e, t = qo(e)) {
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
function Cd(e, t, n = qo(e)) {
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
    ), l = ay(c);
    r.push({
      id: ki(o),
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
function vd(e, t, n, r = new Map(t.map((o) => [o.id, o]))) {
  const o = e.workNodeIds.map((l) => r.get(l)).filter((l) => !!l), s = new Set(
    o.filter((l) => l.storyboardItem?.stale || !n(l)).map((l) => l.id)
  );
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const l of o)
      s.has(l.id) || l.storyboardItem?.itemType === "video_compose" || iy(l).some(
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
    (l) => !Lo(l)
  );
  return u ? {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: `“${u.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: c.map((l) => l.id),
    blockedReason: zc({
      targets: c,
      nodesByID: r,
      hasResult: n
    })
  };
}
function oy(e, t, n) {
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
function ya(e, t) {
  return t ? {
    x: e.bounds.x,
    y: e.bounds.y,
    ...ty
  } : e.bounds;
}
function sy(e, t, n) {
  const r = Rd(t, n);
  if (r.x === 0 && r.y === 0)
    return e;
  const o = new Set(t.memberNodeIds);
  return e.map(
    (s) => o.has(s.id) ? { ...s, x: s.x + r.x, y: s.y + r.y } : s
  );
}
function Rd(e, t) {
  return {
    x: t.x - e.bounds.x,
    y: t.y - e.bounds.y
  };
}
function ki(e) {
  return `storyboard-frame:${e}`;
}
function iy(e) {
  return [
    ...e.storyboardItem?.dependencyNodeIds || [],
    ...e.storyboardItem?.referenceNodeIds || []
  ];
}
function qo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
function ay(e) {
  let t = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY, r = Number.NEGATIVE_INFINITY, o = Number.NEGATIVE_INFINITY;
  for (const s of e) {
    const i = ha(s.width, 180), a = ha(s.height, 180);
    t = Math.min(t, s.x), n = Math.min(n, s.y), r = Math.max(r, s.x + i), o = Math.max(o, s.y + a);
  }
  return {
    x: t - pa,
    y: n - ma,
    width: r - t + pa * 2,
    height: o - n + ma + ey
  };
}
function ha(e, t) {
  return Number.isFinite(e) && e > 0 ? e : t;
}
const cy = ei(function({
  data: t
}) {
  const n = t, r = dy(n), o = n.running ? "制作区正在执行" : n.runBlockedReason || (n.completedCount > 0 ? "只执行尚未完成或上次失败的内容" : "按依赖顺序生成制作区内容");
  return /* @__PURE__ */ A(
    "section",
    {
      className: `ws-storyboard-frame ${n.collapsed ? "is-collapsed" : ""}`,
      "aria-label": `${n.title} 分镜制作区`,
      children: [
        /* @__PURE__ */ A("header", { className: "ws-storyboard-frame-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-storyboard-frame-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(Gu, { size: 15 }) }),
          /* @__PURE__ */ A("strong", { children: [
            n.title,
            " · 分镜制作区"
          ] }),
          /* @__PURE__ */ A("span", { className: "ws-storyboard-frame-progress", children: [
            n.groupCount,
            " 组 · ",
            n.completedCount,
            "/",
            n.workNodeCount,
            " ",
            "完成"
          ] }),
          n.runActionEnabled ? /* @__PURE__ */ d(Me, { label: o, children: /* @__PURE__ */ A(
            "button",
            {
              type: "button",
              className: "nodrag nopan ws-storyboard-frame-run",
              "aria-label": r,
              disabled: n.running || !!n.runBlockedReason,
              onClick: bs(n.onRun),
              children: [
                n.running ? /* @__PURE__ */ d(gn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Gr, { size: 14, fill: "currentColor" }),
                /* @__PURE__ */ d("span", { children: r })
              ]
            }
          ) }) : null,
          /* @__PURE__ */ d(Me, { label: "聚焦制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": "聚焦制作区",
              onClick: bs(n.onFocus),
              children: /* @__PURE__ */ d(Hu, { size: 14 })
            }
          ) }),
          /* @__PURE__ */ d(Me, { label: n.collapsed ? "展开制作区" : "折叠制作区", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "nodrag nopan",
              "aria-label": n.collapsed ? "展开制作区" : "折叠制作区",
              onClick: bs(n.onToggleCollapsed),
              children: n.collapsed ? /* @__PURE__ */ d(Wu, { size: 15 }) : /* @__PURE__ */ d(Yu, { size: 15 })
            }
          ) })
        ] }),
        n.collapsed ? null : /* @__PURE__ */ d("div", { className: "ws-storyboard-frame-surface", "aria-hidden": "true" })
      ]
    }
  );
});
function dy(e) {
  return e.running ? "生成中" : e.workNodeCount > 0 && e.completedCount >= e.workNodeCount ? "已完成" : e.completedCount > 0 ? "继续生成" : "开始生成";
}
function bs(e) {
  return (t) => {
    t.preventDefault(), t.stopPropagation(), e();
  };
}
const ur = /* @__PURE__ */ new Map(), uy = 100;
function ly(e, t) {
  const n = String(t.runError || "").trim(), r = t.id, o = Number(t.resultRef?.execution_id || 0), s = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), a = py(
    e,
    r,
    o,
    s,
    i
  ), [c, u] = K(n), [l, m] = K(!1);
  return de(() => {
    if (u(n), !n || !a || !km(n)) {
      m(!1);
      return;
    }
    let I = !0;
    return m(!0), fy({
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
function fy({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: o,
  cacheKey: s,
  fallback: i
}) {
  const a = ur.get(s);
  if (a)
    return a;
  const c = Ec({
    projectId: e,
    executionId: n,
    requestId: r,
    runId: o
  }).then((u) => {
    const l = yn(u), m = [...l.node_results || []].reverse().find((N) => N.node_key === t), I = hi(m) || Hc(l);
    return wi(I, i);
  });
  return ur.set(s, c), my(), c.catch(() => ur.delete(s)), c;
}
function py(e, t, n, r, o) {
  const s = n ? `execution:${n}` : r ? `request:${r}` : o ? `run:${o}` : "";
  return e > 0 && s ? `${e}:${s}:${t}` : "";
}
function my() {
  for (; ur.size > uy; ) {
    const e = ur.keys().next().value;
    if (!e)
      return;
    ur.delete(e);
  }
}
function gy({
  space: e,
  canvases: t,
  cache: n
}) {
  const [r, o] = K([]), [s, i] = K([]), [a, c] = K([]), [u, l] = K(!1), m = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, I = G(m), N = ue(
    () => u || yy(t),
    [t, u]
  );
  de(() => {
    I.current = m, o([]), i([]), c([]), l(!1);
  }, [m]);
  const _ = E(
    async (F = !1) => {
      if (!e)
        return !1;
      const D = m;
      try {
        const O = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => mp(e.project.id),
          F
        );
        return I.current !== D ? !1 : (o(O.roles), i(O.powers), c(O.powerCategories), l(!0), !0);
      } catch (O) {
        return Z.error(O instanceof Error ? O.message : "加载能力列表失败"), !1;
      }
    },
    [n, m, e]
  );
  return de(() => {
    !e || !N || u || _();
  }, [_, u, N, e]), {
    roles: r,
    powers: s,
    powerCategories: a,
    loaded: u,
    required: N,
    load: _
  };
}
function yy(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : $o(n.power, n.kind, n.outputType) ? !!Hr([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function On(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function vt(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function hy({
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
  children: _
}) {
  const [F, D] = K(!1), [O, L] = K(e.title), H = G(null), Y = i === "running" || i === "waiting", se = Y ? "分组正在执行" : a ? "制作区正在执行" : N || (n === 0 ? "分组内暂无可运行节点" : s > 0 ? `重新生成 ${s} 个已变更节点` : "运行分组"), R = !I || n === 0 || Y || a || !!N;
  de(() => {
    F || L(e.title);
  }, [F, e.title]), de(() => {
    F && (H.current?.focus(), H.current?.select());
  }, [F]);
  const v = () => {
    const T = O.trim() || "未命名分组";
    D(!1), L(T), T !== e.title && l?.(T);
  };
  return /* @__PURE__ */ A(
    "div",
    {
      className: `ws-node-group-wrap ${c ? "is-selected" : ""} ${Y ? "is-running" : ""} ${i === "error" ? "is-error" : ""} ${u ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ A("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ d("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ d(Xu, { size: 15 }) }),
          F ? /* @__PURE__ */ d(
            "input",
            {
              ref: H,
              className: "ws-node-group-title-input nodrag nowheel",
              value: O,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (T) => L(T.target.value),
              onBlur: v,
              onKeyDown: (T) => {
                T.key === "Enter" ? (T.preventDefault(), v()) : T.key === "Escape" && (T.preventDefault(), L(e.title), D(!1));
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
                  onDoubleClick: (T) => {
                    T.preventDefault(), T.stopPropagation(), !(u || !l) && D(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ d("span", { className: "ws-node-group-count", children: Y ? `${r}/${n}` : `${t} 个节点` }),
          i === "waiting" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待反馈" }) : i === "error" ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: o > 0 ? `失败 ${o}` : "运行失败" }) : N ? /* @__PURE__ */ d(Me, { label: N, children: /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待前置" }) }) : a ? /* @__PURE__ */ d("span", { className: "ws-node-group-status", children: "等待调度" }) : s > 0 ? /* @__PURE__ */ d(Me, { label: "上游素材或提示词已变化；当前结果仍可使用，重新运行可更新", children: /* @__PURE__ */ A("span", { className: "ws-node-group-status is-stale", children: [
            "可更新 ",
            s
          ] }) }) : n > 0 && r === n ? /* @__PURE__ */ A("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ d(ni, { size: 12 }),
            "已完成"
          ] }) : null,
          m ? /* @__PURE__ */ d(Me, { label: "编辑分镜结构", children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (T) => {
                T.preventDefault(), T.stopPropagation(), m();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ d(Wa, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ d(Me, { label: se, children: /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: R,
              onClick: (T) => {
                T.preventDefault(), T.stopPropagation(), I?.();
              },
              "aria-label": "运行分组",
              children: Y ? /* @__PURE__ */ d(gn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Gr, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        _
      ]
    }
  );
}
function kd({
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
  const N = G(null), _ = G(!0), F = cr(e, n), D = u != null, O = l || !D && !F && Un(n), L = !!i && (!D || l), H = [
    "ws-result-view",
    O ? "" : "nodrag",
    "nopan",
    "nowheel",
    O ? "has-pure-media" : "",
    o
  ].filter(Boolean).join(" ");
  return de(() => {
    if (!m) {
      _.current = !0;
      return;
    }
    const R = N.current;
    R && _.current && (R.scrollTop = R.scrollHeight);
  }, [m, I]), /* @__PURE__ */ A(
    "div",
    {
      role: L ? "button" : void 0,
      tabIndex: L ? 0 : void 0,
      className: H,
      style: s,
      onPointerDown: (R) => {
        (!O || Ny(R)) && R.stopPropagation();
      },
      onClick: (R) => {
        R.stopPropagation(), !(!i || $s(R.target, R.currentTarget) || by(R)) && (R.preventDefault(), i());
      },
      onPointerEnter: i ? a : void 0,
      onFocus: i ? a : void 0,
      onKeyDown: (R) => {
        R.stopPropagation(), !(!i || $s(R.target, R.currentTarget) || R.key !== "Enter" && R.key !== " ") && (R.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            ref: N,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onScroll: (R) => {
              if (!m)
                return;
              const v = R.currentTarget;
              _.current = v.scrollHeight - v.scrollTop - v.clientHeight < 16;
            },
            children: D ? u : F ? /* @__PURE__ */ d(
              dr,
              {
                output: e,
                fallback: t,
                mediaGridKind: Uo(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ d(wy, { preview: n, label: r ?? t })
          }
        ),
        c
      ]
    }
  );
}
function wy({
  preview: e,
  label: t
}) {
  return e.imageUrl ? /* @__PURE__ */ A("figure", { className: "ws-result-view-media", children: [
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
  ] }) : e.videoUrl ? /* @__PURE__ */ A("figure", { className: "ws-result-view-media", children: [
    /* @__PURE__ */ d(
      So,
      {
        src: e.videoUrl,
        poster: e.videoPosterUrl
      },
      e.videoUrl
    ),
    t ? /* @__PURE__ */ d("figcaption", { children: t }) : null
  ] }) : e.audioUrl ? /* @__PURE__ */ A("div", { className: "ws-result-view-audio", children: [
    /* @__PURE__ */ d("audio", { src: e.audioUrl, controls: !0, preload: "none" }),
    t ? /* @__PURE__ */ d("span", { children: t }) : null
  ] }) : e.fileUrl ? /* @__PURE__ */ A(
    "a",
    {
      className: "ws-result-view-file",
      href: e.fileUrl,
      target: "_blank",
      rel: "noreferrer",
      children: [
        /* @__PURE__ */ d(ri, { size: 16 }),
        /* @__PURE__ */ d("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ d(
    dr,
    {
      output: _y(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function _y(e) {
  return e ? { text: e } : void 0;
}
function Un(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function $s(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t);
}
function by(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  if (!t || t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function Ny(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  if (n instanceof HTMLVideoElement) {
    const r = n.getBoundingClientRect(), o = Math.min(56, r.height * 0.25);
    return e.clientY >= r.bottom - o;
  }
  return $s(t, e.currentTarget);
}
const xd = Zt(() => import("./space-agent-tools-CYsE7dxS.js")), Td = Zt(() => import("./space-asset-tools-DdN7KpkG.js")), Iy = kt(
  xd,
  (e) => e.AgentInteractionPanel
), Sy = Iy.Component, Ad = kt(
  Zt(() => import("./space-add-node-menu-pcpVf0B3.js").then((e) => e.s)),
  (e) => e.AddNodeMenu
), Cy = Ad.Component, vy = Ad.preload, Md = kt(
  Td,
  (e) => e.AssetBrowser
), Ry = Md.Component, ky = Md.preload, Dd = kt(
  Td,
  (e) => e.AssetPickerDialog
), wa = Dd.Component, _a = Dd.preload, Ed = kt(
  Zt(() => import("./space-run-history-DBvRjEzn.js")),
  (e) => e.CanvasRunHistoryDrawer
), xy = Ed.Component, Ty = Ed.preload, Ay = kt(
  xd,
  (e) => e.CanvasAgentResultContent
), My = Ay.Component, Pd = kt(
  Zt(() => import("./node-detail-dialog-tBaS8Kc3.js")),
  (e) => e.NodeDetailDialog
), Dy = Pd.Component, Vr = Pd.preload, Fd = kt(
  Zt(() => import("./space-node-settings-1x49671H.js")),
  (e) => e.CanvasNodeSettings
), Ey = Fd.Component, Py = Fd.preload, Fy = kt(
  Zt(() => import("./space-storyboard-node-DilBB3tS.js")),
  (e) => e.StoryboardNodeContent
), zy = Fy.Component, Oy = kt(
  Zt(() => import("./storyboard-grid-view-CJXm84yJ.js").then((e) => e.ao)),
  (e) => e.StoryboardGridCanvasView
), By = Oy.Component, jy = kt(
  Zt(() => import("./space-video-compose-view-DxZ5WKIQ.js")),
  (e) => e.VideoComposeView
), $y = jy.Component, Uy = ll.useTheme, { normalizeAgentResultOutputValue: Vy } = Tu, zd = {}, ba = [], Ky = [], Na = [], Ia = /* @__PURE__ */ new Set(), Ly = 800;
function qy(e) {
  const t = G([]), n = G(0), r = E(() => {
    n.current && (window.cancelAnimationFrame(n.current), n.current = 0);
    const s = t.current;
    t.current = [], s.length !== 0 && e(
      (i) => s.reduce((a, c) => c(a), i)
    );
  }, [e]), o = E(
    (s) => {
      t.current.push(s), !n.current && (n.current = window.requestAnimationFrame(() => {
        n.current = 0, r();
      }));
    },
    [r]
  );
  return de(
    () => () => {
      n.current && window.cancelAnimationFrame(n.current), t.current = [];
    },
    []
  ), ue(() => ({ enqueue: o, flush: r }), [o, r]);
}
function Sa(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function Od(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const o of pc(e, r.id))
        n.add(o.id);
  return n;
}
function Bd(e) {
  return Object.values(e).some(vt);
}
function Ns(e) {
  const t = e instanceof Error ? e.message : String(e || "");
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function Gy(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function Hy(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function Wy(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((o) => {
    const s = vu(o), i = o.x + s.width, a = o.y + s.height;
    return o.type === "group" ? r.left <= o.x && r.top <= o.y && r.right >= i && r.bottom >= a : r.left <= i && r.right >= o.x && r.top <= a && r.bottom >= o.y;
  }).map((o) => o.id);
}
function Yy(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const Xy = {
  workSpace: ei(h_),
  storyboardFrame: cy
}, Zy = {
  animated: Xm
}, Jy = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, Qy = [18, 18], eh = ["Control", "Meta"], th = {
  type: "animated",
  animated: !1
}, nh = { padding: 0.32, maxZoom: 0.72 };
function qt(e) {
  const t = G(e);
  return t.current = e, E((...n) => t.current(...n), []);
}
function rh({
  onInitialLoadComplete: e
}) {
  const t = ul(), n = fl(), r = ue(() => C_(), []), o = ue(() => new Op(), []), [s, i] = K(null), [a, c] = K(0), u = G(0), [l, m] = K(null), I = G(null), [N, _] = K([]), F = N[N.length - 1] || "", [D, O] = K({}), L = G(D), [H, Y] = K("create"), { resolvedTheme: se, setTheme: R } = Uy();
  pl(n.site.appearance, se);
  const [v, T] = K(null), [W, pe] = K(!0), re = G(!0), [he, oe] = K({}), ne = qy(oe), [be, Ce] = K({}), [le, ae] = K(null), [Fe, In] = K(), [q, wt] = K(
    null
  ), [Hn, Jt] = K(null), [Zr, Qt] = K(!1), [Jr, zt] = K(""), [qe, Qr] = K(null), [Ot, tt] = K(""), [Ge, Be] = K([]), [eo, gr] = K([]), [to, no] = K(!1), [ct, Wn] = K(""), [Bt, Yn] = K(!1), [en, Sn] = K(1), [xt, Xn] = K(!1), [Cn, _t] = K(() => /* @__PURE__ */ new Set()), [jt, tn] = K(!1), [He, nt] = K(null), [nn, Tt] = K(!1), je = G(null), rn = G(!1), $t = G(/* @__PURE__ */ new Set()), on = G(/* @__PURE__ */ new Set()), We = G(/* @__PURE__ */ new Set()), Se = G([]), Zn = G(!1), At = G(!1), vn = G([0]), Rn = G(null), Jn = G(/* @__PURE__ */ new Map()), yr = G(
    /* @__PURE__ */ new Map()
  ), we = G(null), {
    roles: hr,
    powers: _e,
    powerCategories: wr,
    loaded: Ye,
    required: _r,
    load: Xe
  } = gy({
    space: s,
    canvases: D,
    cache: o
  });
  de(() => {
    L.current = D;
  }, [D]), de(() => {
    u.current = a;
  }, [a]), de(() => {
    Se.current = Ge;
  }, [Ge]);
  const bt = E((f) => {
    Z.error(f instanceof Error ? f.message : "保存画布失败");
  }, []), {
    markCanvasDirty: kn,
    flushCanvasSave: Mt,
    resetCanvasAutosave: br,
    canvasSaveStatus: ro
  } = Pp({
    projectId: r,
    enabled: !!s,
    canvases: D,
    setCanvases: O,
    onError: bt
  });
  de(() => {
    if (We.current.size === 0)
      return;
    const f = [...We.current];
    We.current.clear();
    for (const g of f)
      kn(g);
  }, [D, kn]);
  const sn = E(async () => {
    if (!r) {
      tt("缺少作品 ID"), pe(!1);
      return;
    }
    pe(!0), tt("");
    try {
      const f = await fp(
        r,
        u.current
      ), g = zw(
        f.canvases || {},
        f.assets || []
      ), h = Number(f.initialAssetCateId || 0) || Sf(f);
      i(f), L.current = g, O(g), br(g), u.current = h, c(h), m(null), I.current = null, $t.current = /* @__PURE__ */ new Set(), on.current = /* @__PURE__ */ new Set(), Se.current = [], Be([]), gr([]), Sn(1), Xn(!1), vn.current = [0], or(
        r,
        f,
        g,
        "recovery",
        { assetCateId: h }
      );
    } catch (f) {
      tt(f instanceof Error ? f.message : "加载创作空间失败");
    } finally {
      pe(!1);
    }
  }, [r, br]), Dt = E((f) => {
    wt(f);
  }, []);
  de(() => {
    sn();
  }, [sn]), de(() => {
    W || !re.current || (re.current = !1, e());
  }, [W, e]);
  const Et = s?.assetCates, oo = ue(() => s ? Sc(s) : [], [s]), Nr = s ? s.assetCates.length > 0 : !1, X = ue(
    () => s ? ps(s, a) : null,
    [a, s]
  ), Ir = ue(
    () => s && X ? Cf(s, X.id) : [],
    [X, s]
  ), Qn = ue(() => hr.filter(vf), [hr]), so = ue(() => _e.filter(Rf), [_e]), ie = ue(
    () => X ? D[String(X.id)] || po(X.id) : po(0),
    [X, D]
  ), Sr = ue(
    () => Object.entries(D).map(
      ([f, g]) => `${f}:${Ug(g)}`
    ).join("|"),
    [D]
  ), Te = ue(
    () => uh(ie, be),
    [ie, be]
  ), Cr = Bn, dt = ue(
    () => _m({
      nodes: Te.nodes,
      assets: s?.assets || [],
      assetCateId: X?.id || 0,
      nodeOutput: Xt,
      nodePreview: qn,
      assetPreview: (f) => {
        const g = f.version?.content ?? f.name, h = Nn(
          g,
          String(f.kind || "")
        );
        return wn(h) || (h.text = f.name), h;
      },
      nodeHasResult: Rt
    }),
    [X?.id, Te.nodes, s?.assets]
  ), io = ue(
    () => Im(dt),
    [dt]
  );
  de(() => {
    !Et || _r && !Ye || O((f) => {
      let g = f;
      for (const [h, b] of Object.entries(f)) {
        const w = Number(h || b.assetCateId || 0), k = js({
          canvas: b,
          assetCate: zs(Et, w),
          powers: _e
        }), z = Ba(k, w);
        ja(b, z) || (g === f && (g = { ...f }), g[h] = z, We.current.add(w));
      }
      return g;
    });
  }, [
    Et,
    Ye,
    _r,
    _e,
    Sr
  ]);
  const vr = E(
    (f = "") => {
      _a(), zt(f), je.current = ie.nodes.find((g) => g.id === f) || (je.current?.id === f ? je.current : null), T(null), Y("create"), Qt(!0);
    },
    [ie.nodes]
  ), Ut = E(
    (f, g) => {
      if (!Number.isInteger(f) || f < 0)
        return;
      const h = (k) => {
        const z = String(f), U = k[z] || po(f), V = Ba(
          g(U),
          f
        );
        return ja(U, V) ? k : (We.current.add(f), {
          ...k,
          [z]: V
        });
      }, b = L.current, w = h(b);
      L.current = w, O((k) => {
        const z = k === b ? w : h(k);
        return L.current = z, z;
      });
    },
    []
  ), $e = E(
    (f) => {
      X && Ut(X.id, f);
    },
    [X, Ut]
  ), Rr = E(
    (f, g, h) => {
      Ce(
        (b) => lh(b, g, h)
      ), Ut(f, (b) => {
        const w = {
          ...b,
          nodes: b.nodes.map(
            (z) => z.id === g ? { ...z, ...h } : z
          )
        };
        return Et ? js({
          canvas: w,
          assetCate: zs(Et, f),
          powers: _e
        }) : w;
      });
    },
    [Et, _e, Ut]
  ), Ze = E(
    (f, g) => {
      Rr(Number(X?.id || 0), f, g), ae(
        (h) => h?.id === f ? { ...h, ...g } : h
      );
    },
    [X?.id, Rr]
  ), kr = E(
    (f, g, h) => {
      if (!Jh(g, h))
        return;
      const b = ru(h), w = `${g.id}:${b}`;
      if ($t.current.has(w))
        return;
      $t.current.add(w);
      const k = g.title.trim(), z = L.current[String(f)];
      hp({
        projectId: r,
        nodeKey: g.id,
        versionId: b,
        prompt: Zh(g, z)
      }).then((U) => {
        const V = U.title.trim();
        !V || V === k || U.versionId !== b || Ut(f, (j) => {
          const B = j.nodes.find(
            (Q) => Q.id === g.id
          );
          return !B || B.titleMode !== "auto" || B.title.trim() !== k || !nu(B) ? j : {
            ...j,
            nodes: j.nodes.map(
              (Q) => Q.id === g.id ? { ...Q, title: V } : Q
            )
          };
        });
      }).catch(() => {
        $t.current.delete(w);
      });
    },
    [r, Ut]
  ), an = E(
    async (f) => {
      const g = Number(f.assetCate.id || 0);
      g && kn(g);
    },
    [kn]
  ), Ee = E(
    (f, g, h) => {
      const b = {};
      $e((w) => {
        const k = w.nodes.map(
          (z) => z.id === f ? {
            ...z,
            composerDraft: mi(g)
          } : z
        );
        return b.canvas = { ...w, nodes: k }, b.canvas;
      }), h?.save === "immediate" && b.canvas && Mt(b.canvas).catch(() => {
      });
    },
    [Mt, $e]
  ), ao = E(
    (f) => {
      $e((g) => {
        const h = g.edges.filter((b) => b.id !== f);
        return h.length === g.edges.length ? g : { ...g, edges: h };
      });
    },
    [$e]
  ), Zo = E(
    (f, g) => {
      Vr(), In(g), ae(f);
    },
    []
  ), er = E(
    (f, g) => {
      Ce((h) => {
        const b = ie.nodes.find(
          (z) => z.id === f
        );
        if (!b)
          return h;
        const w = h[f] || {}, k = {
          ...b,
          ...w
        };
        return {
          ...h,
          [f]: {
            ...w,
            feedbackRequests: g(jn(k))
          }
        };
      });
    },
    [ie.nodes]
  ), xn = E((f) => {
    const g = new Set(f.filter(Boolean));
    if (g.size !== 0) {
      if (we.current && g.has(we.current.nodeId)) {
        const h = we.current;
        we.current = null, h.reject(new Error(Jc));
      }
      nt(
        (h) => h && g.has(h.node.id) ? null : h
      ), Ce((h) => {
        const b = { ...h };
        let w = !1;
        for (const k of g) {
          const z = b[k] || {};
          b[k] = {
            ...z,
            feedbackRequests: []
          }, w = !0;
        }
        return w ? b : h;
      });
    }
  }, []), Nt = E((f) => {
    !f || !f.id || i((g) => g && {
      ...g,
      assets: ea(g.assets, [f])
    });
  }, []), tr = E(
    ({ node: f, prompt: g }) => {
      const h = Ti(f, g), b = Vs(
        jn(f),
        h
      );
      return er(
        f.id,
        (w) => Vs(w, h)
      ), Tt(!1), new Promise((w, k) => {
        we.current = {
          nodeId: f.id,
          recordId: h.id,
          resolve: w,
          reject: k
        }, nt({
          node: { ...f, feedbackRequests: b },
          recordId: h.id,
          prompt: g
        });
      });
    },
    [er]
  ), Jo = E(
    async (f) => {
      const g = we.current;
      if (!(!g || nn)) {
        Tt(!0);
        try {
          await g.submit?.(f), er(
            g.nodeId,
            (h) => zm(h, g.recordId, f)
          ), we.current = null, nt(null), g.resolve(f);
        } catch (h) {
          Z.error(h instanceof Error ? h.message : "提交反馈失败");
        } finally {
          Tt(!1);
        }
      }
    },
    [er, nn]
  ), Qo = E(() => {
    nt(null);
  }, []), es = E(
    (f, g) => {
      if (we.current?.nodeId === f.id && we.current.recordId === g.id && g.status === "pending") {
        nt({
          node: f,
          recordId: g.id,
          prompt: g.prompt
        });
        return;
      }
      if (g.status === "pending") {
        const h = Xh(
          Se.current,
          f,
          g
        );
        if (h) {
          Tt(!1), we.current = {
            nodeId: f.id,
            recordId: g.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (b) => {
              await eu(
                r,
                h.run,
                h.pending,
                h.prompt,
                b
              ), Z.success("已提交反馈，流程继续执行"), window.setTimeout(() => Rn.current?.(), 0);
            }
          }, nt({
            node: f,
            recordId: g.id,
            prompt: h.prompt
          });
          return;
        }
      }
      nt({
        node: f,
        recordId: g.id,
        prompt: {
          ...g.prompt,
          values: g.values || g.prompt.values || {}
        }
      });
    },
    [r]
  ), ce = E(
    ({
      assetCate: f,
      startNode: g,
      canvas: h,
      nodes: b = h.nodes,
      ...w
    }) => {
      if (!s)
        throw new Error("创作空间尚未加载");
      return {
        projectId: r,
        assetCate: f,
        space: s,
        startNode: g,
        ...w,
        nodes: b,
        edges: h.edges,
        viewport: h.viewport,
        canvasUpdatedAt: h.updatedAt,
        flushCanvasSave: Mt,
        onNodeResult: Ze,
        onAssetCreated: Nt,
        setRunningNode: oe,
        runningNodeBatcher: ne,
        requestFlowFeedback: tr,
        requestNodeTitle: (k, z) => kr(f.id, k, z)
      };
    },
    [
      r,
      Mt,
      kr,
      tr,
      ne,
      s,
      Ze,
      Nt
    ]
  ), ut = E(
    async (f) => {
      s && await or(
        r,
        s,
        L.current,
        "recovery",
        { runIds: [Number(f?.canvasRun?.run_id || 0)] }
      );
    },
    [r, s]
  ), Tn = E(
    async (f) => {
      if (!s || !X)
        return;
      let g = null;
      try {
        xn(
          $p(
            f.id,
            Te.nodes,
            Te.edges
          )
        ), g = ce({
          assetCate: X,
          startNode: f,
          canvas: {
            nodes: Te.nodes,
            edges: Te.edges,
            viewport: ie.viewport
          }
        }), await Is(g), await an(g), Z.success("开始节点执行完成");
      } catch (h) {
        if (Pm(h) || Ns(h))
          return;
        const b = h instanceof Error ? h.message : "开始节点执行失败";
        oe((w) => ({
          ...w,
          [f.id]: {
            nodeId: f.id,
            title: f.title,
            startedAt: Date.now(),
            progress: 92,
            status: "error"
          }
        })), Z.error(b), window.setTimeout(() => {
          oe((w) => On(w, f.id));
        }, 1400);
      } finally {
        await ut(g);
      }
    },
    [
      X,
      ie.viewport,
      Te.edges,
      Te.nodes,
      xn,
      ce,
      an,
      ut,
      oe,
      s
    ]
  ), nr = E(
    async (f) => {
      if (!s || !X)
        return;
      const g = Number(X.id || 0), h = L.current[String(g)] || ie, b = h.nodes.find(
        (j) => j.id === f
      );
      if (!b) {
        Z.error("分镜脚本节点不存在");
        return;
      }
      const w = Cd(
        h.nodes,
        Rt
      ).find((j) => j.sourceNodeId === f);
      if (!w) {
        Z.error("当前分镜脚本尚未生成制作组");
        return;
      }
      const k = vd(
        w,
        h.nodes,
        Rt
      );
      if (k.blockedReason) {
        Z.error(k.blockedReason);
        return;
      }
      const z = ki(f), U = ce({
        assetCate: X,
        startNode: b,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        canvas: h
      });
      xn(k.pendingNodeIds), oe((j) => ({
        ...j,
        [z]: {
          nodeId: z,
          title: `${b.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let V = 650;
      try {
        await Is(U), Z.success("制作区执行完成");
      } catch (j) {
        if (Ns(j))
          V = 0;
        else {
          V = 1400;
          const B = j instanceof Error ? j.message : "制作区执行失败";
          oe((Q) => ({
            ...Q,
            [z]: {
              ...Q[z] || {
                nodeId: z,
                title: `${b.title || "分镜脚本"}制作区`,
                startedAt: Date.now(),
                progress: 0
              },
              status: "error"
            }
          })), Z.error(B);
        }
      } finally {
        const j = new Set(
          (U.canvasRun?.node_results || []).filter((B) => Wt(B) === "success").map((B) => B.node_key).filter(Boolean)
        );
        j.size > 0 && ($e(
          (B) => Ca({
            canvas: B,
            sourceNodeId: f,
            successfulNodeIds: j,
            assetCate: X,
            powers: _e
          })
        ), await an(U)), window.setTimeout(() => {
          oe((B) => On(B, z));
        }, V), await ut(U);
      }
    },
    [
      ie,
      X,
      xn,
      ce,
      an,
      _e,
      ut,
      s,
      $e
    ]
  ), rr = E(
    async (f, g) => {
      if (!s || !X)
        return;
      const h = L.current[String(X.id)] || ie, b = h.nodes.find((V) => V.id === f.id) || f, w = ph({
        ...b,
        composerDraft: {
          ...b.composerDraft || {},
          ...f.composerDraft || {}
        }
      }), k = h.nodes.map(
        (V) => V.id === w.id ? w : V
      ), z = gu(
        f.id,
        k,
        h.edges
      ), U = ce({
        assetCate: X,
        startNode: w,
        singleNode: !0,
        canvas: h,
        nodes: k,
        runInput: {
          _manual_input_context: z || void 0,
          _agent_turn_input: g?.agentInput,
          manual_node_id: f.id
        }
      });
      Ze(w.id, { runError: "" }), oe((V) => ({
        ...V,
        [w.id]: {
          ...V[w.id] || {},
          nodeId: w.id,
          title: w.title,
          startedAt: V[w.id]?.startedAt || Date.now(),
          progress: Math.max(V[w.id]?.progress || 0, 8),
          status: "running",
          ...g?.agentInput ? { agent: Vc() } : {}
        }
      }));
      try {
        await Is(U), await an(U);
      } catch (V) {
        if (Ns(V)) {
          Ze(w.id, { runError: "" }), oe((j) => On(j, w.id));
          return;
        }
        throw Ze(w.id, {
          runError: V instanceof Error ? V.message : "节点运行失败"
        }), oe((j) => ({
          ...j,
          [w.id]: {
            ...j[w.id] || {
              nodeId: w.id,
              title: w.title,
              startedAt: Date.now()
            },
            progress: 92,
            status: "error"
          }
        })), window.setTimeout(() => {
          oe((j) => On(j, w.id));
        }, 1400), V;
      } finally {
        await ut(U);
      }
    },
    [
      X,
      ie,
      ce,
      an,
      ut,
      oe,
      s,
      Ze
    ]
  ), lt = E(
    async (f) => {
      if (!X)
        throw new Error("当前分类不存在");
      return i_({
        node: f,
        projectId: r,
        assetCate: X,
        inputContext: f.inputContext || null,
        onNodeResult: Ze,
        onAssetCreated: Nt,
        onRunStartNode: Tn,
        onOpenImportPicker: vr
      });
    },
    [
      X,
      vr,
      r,
      Tn,
      Ze,
      Nt
    ]
  );
  de(() => {
    s && Mr(
      Ge,
      ie,
      a,
      s
    );
  }, [ie, a, Ge, s]);
  async function co(f) {
    if (I.current != null)
      return !1;
    const g = String(f);
    let h = !1;
    if (!Object.prototype.hasOwnProperty.call(L.current, g)) {
      I.current = f, m(f);
      try {
        const w = await pp({
          projectId: r,
          assetCateId: f
        }), k = Nu(
          zf(w.canvas, _e),
          w.assets
        );
        i(
          (U) => U && {
            ...U,
            assets: ea(U.assets, w.assets)
          }
        );
        const z = {
          ...L.current,
          [g]: k
        };
        L.current = z, O(z), h = !0;
      } catch (w) {
        return Z.error(w instanceof Error ? w.message : "加载分类画布失败"), !1;
      } finally {
        I.current = null, m(null);
      }
    }
    if (u.current = f, c(f), _([]), Jt(null), T(null), !s)
      return !0;
    const b = L.current[String(f)] || po(f);
    return Mr(Ge, b, f, s), h && or(
      r,
      s,
      L.current,
      "recovery",
      { assetCateId: f }
    ), !0;
  }
  function xr(f) {
    Jt((g) => ({
      nodeId: f,
      nonce: (g?.nonce || 0) + 1
    }));
  }
  const ts = E((f) => {
    Jt((g) => !g || g.nodeId !== f.nodeId || g.nonce !== f.nonce ? g : null);
  }, []);
  async function or(f, g, h, b, w = {}) {
    if (!Zn.current) {
      Zn.current = !0;
      try {
        const k = b === "active" ? Ph(Se.current) : [], z = (w.runIds || []).filter((Ne) => Ne > 0), U = z.length > 0 ? z : b === "active" ? k.map((Ne) => Number(Ne.run_id || 0)) : [], V = b === "recovery" && U.length === 0;
        let j = await ms({
          projectId: f,
          scope: b,
          assetCateId: w.assetCateId,
          runIds: U,
          summaryOnly: V
        }), B = Cs(j.items);
        if (V) {
          const Ne = Bh(B, h);
          Ne.length === 0 ? B = [] : (j = await ms({
            projectId: f,
            scope: b,
            assetCateId: w.assetCateId,
            runIds: Ne
          }), B = Cs(j.items));
        }
        if (b === "active" && k.length > 0) {
          const Ne = new Set(B.map(zn)), rt = k.filter(
            (pt) => !Ne.has(zn(pt))
          );
          if (rt.length > 0) {
            const pt = await Promise.all(
              rt.map(async (cn) => {
                try {
                  const ot = await Ec({
                    projectId: f,
                    executionId: Number(cn.execution_id || 0),
                    runId: Number(cn.run_id || 0),
                    requestId: String(cn.request_id || "")
                  });
                  return Zd(ot);
                } catch {
                  return null;
                }
              })
            );
            B = xa(
              B,
              pt.filter(
                (cn) => !!cn
              )
            );
          }
        }
        const Q = xa(
          Se.current,
          B
        );
        Se.current = Q, Be(Q);
        for (const [Ne, rt] of Object.entries(h)) {
          const pt = Number(rt.assetCateId || Ne || 0);
          Mr(B, rt, pt, g);
        }
      } catch {
      } finally {
        Zn.current = !1;
      }
    }
  }
  async function An(f, g = 0) {
    if (At.current)
      return;
    const h = vn.current[g] || 0;
    At.current = !0, no(!0), Wn("");
    try {
      const b = await ms({
        projectId: f,
        scope: "history",
        beforeId: h,
        limit: 20
      });
      gr(
        Cs(b.items)
      ), Sn(g + 1), Xn(b.hasMore);
      const w = vn.current.slice(0, g + 1);
      b.hasMore && b.beforeId > 0 && (w[g + 1] = b.beforeId), vn.current = w;
    } catch (b) {
      Wn(
        b instanceof Error ? b.message : "读取画布运行记录失败"
      );
    } finally {
      At.current = !1, no(!1);
    }
  }
  const Tr = ue(
    () => Xd(Ge),
    [Ge]
  ), Ar = Tr.length > 0, ns = Ar || Bd(he);
  async function uo(f) {
    const g = !f;
    if (g && (jt || Cn.size > 0) || !g && f?.some(
      (b) => Cn.has(zn(b))
    ))
      return;
    let h = [];
    g && tn(!0);
    try {
      let b = f || [], w = 0, k = b.length;
      if (g) {
        const V = await Np(r);
        b = V.items.map(yn), w = V.failedCount, k = V.count;
      } else
        b = Fh(b);
      if (k === 0) {
        Z.info("当前没有运行中的任务");
        return;
      }
      g || (h = b.map(zn), _t((j) => {
        const B = new Set(j);
        for (const Q of h)
          B.add(Q);
        return B;
      }), b = (await Promise.allSettled(
        b.map(
          (j) => bp({
            projectId: r,
            runId: Number(j.run_id || 0),
            requestId: String(j.request_id || "")
          })
        )
      )).flatMap((j, B) => {
        if (j.status === "rejected")
          return w += 1, [];
        const Q = yn(j.value);
        return [
          {
            ...b[B],
            status: Q.status,
            error: Q.error
          }
        ];
      }));
      const z = zh(b), U = b.filter((V) => V.status === "canceled");
      if (z.size > 0) {
        const V = (/* @__PURE__ */ new Date()).toISOString(), j = (Q) => Q.map((Ne) => {
          const rt = Oh(z, Ne);
          return rt ? { ...Ne, status: rt, updated_at: V } : Ne;
        }), B = j(Se.current);
        Se.current = B, Be(B), gr(j);
      }
      if (U.length > 0) {
        const V = new Set(
          U.flatMap((j) => Fo(j))
        );
        oe((j) => {
          if (g && w === 0)
            return zd;
          let B = j;
          for (const Q of V)
            B[Q] && (B === j && (B = { ...j }), delete B[Q]);
          return B;
        }), Z.success(
          U.length === 1 ? "已停止运行" : `已停止 ${U.length} 个运行`
        );
      } else w === 0 && Z.info("任务已经结束，无需停止");
      w > 0 && Z.error(
        w === k ? "停止运行失败，请稍后重试" : `${w} 个运行停止失败，请稍后重试`
      ), Bt && An(
        r,
        Math.max(0, en - 1)
      ), window.setTimeout(() => Rn.current?.(), 0);
    } catch (b) {
      Z.error(b instanceof Error ? b.message : "停止画布运行失败");
    } finally {
      h.length > 0 && _t((b) => {
        const w = new Set(b);
        for (const k of h)
          w.delete(k);
        return w;
      }), g && tn(!1);
    }
  }
  function rs() {
    Dt({
      title: "停止所有运行？",
      description: "停止后不会再提交后续任务。正在生成的内容会尝试取消，已经完成或已经计费的任务不会撤销。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => uo()
    });
  }
  function os(f) {
    Dt({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => uo([f])
    });
  }
  Rn.current = s ? () => {
    or(
      r,
      s,
      L.current,
      "active",
      { assetCateId: u.current }
    );
  } : null, de(() => {
    if (!s || !Ar)
      return;
    const f = window.setInterval(() => {
      Rn.current?.();
    }, Vd);
    return () => window.clearInterval(f);
  }, [Ar, r, s]), de(() => {
    const f = Jn.current, g = yr.current, h = [];
    if (s)
      for (const w of Tr) {
        const k = w.run, z = String(k.request_id || "").trim();
        z && h.push({
          key: `${r}:${z}`,
          requestId: z,
          run: k,
          managedNodeIds: w.managedNodeIds
        });
      }
    const b = new Set(h.map((w) => w.key));
    for (const [w, k] of f)
      b.has(w) || (k.controller.abort(), f.delete(w), g.delete(w));
    for (const w of h) {
      const k = f.get(w.key);
      if (k) {
        k.managedNodeIds = w.managedNodeIds;
        for (const V of Gs(w.run))
          k.finishedNodeIds.add(V);
        continue;
      }
      const z = new AbortController(), U = {
        controller: z,
        managedNodeIds: w.managedNodeIds,
        finishedNodeIds: Gs(w.run)
      };
      f.set(w.key, U), Zc({
        projectId: r,
        requestId: w.requestId,
        lastId: g.get(w.key) || "0-0",
        signal: z.signal,
        onFrame: (V) => {
          z.signal.aborted || (V.stream_id && g.set(w.key, V.stream_id), Th(
            { setRunningNode: oe, runningNodeBatcher: ne },
            V,
            U.managedNodeIds,
            U.finishedNodeIds
          ));
        }
      }).catch(() => {
        !z.signal.aborted && f.get(w.key) === U && f.delete(w.key);
      });
    }
  }, [r, Tr, ne, s]), de(
    () => () => {
      for (const f of Jn.current.values())
        f.controller.abort();
      Jn.current.clear(), yr.current.clear();
    },
    []
  );
  function Mr(f, g, h, b) {
    const w = f.filter(
      (U) => Eh(U, h) && !Jd(U, g)
    );
    if (w.length === 0)
      return;
    const k = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set();
    for (const U of w) {
      const V = new Set(
        Fo(U).filter((B) => z.has(B) ? !1 : (z.add(B), !0))
      );
      if (V.size === 0)
        continue;
      const j = (U.node_results || []).filter((B) => {
        const Q = B.node_key;
        return !Q || !V.has(Q) || k.has(Q) ? !1 : (k.add(Q), !0);
      });
      ss(
        U,
        g,
        b,
        j,
        V
      );
    }
  }
  function ss(f, g, h, b = f.node_results || [], w) {
    const k = Lh(f, g.nodes);
    if (!k)
      return;
    const z = ps(h, g.assetCateId);
    if (!z)
      return;
    const U = {
      projectId: r,
      assetCate: z,
      space: h,
      startNode: k,
      nodes: g.nodes,
      edges: g.edges,
      viewport: g.viewport,
      onNodeResult: (j, B) => Rr(g.assetCateId, j, B),
      onAssetCreated: Nt,
      setRunningNode: oe,
      requestFlowFeedback: tr,
      requestNodeTitle: (j, B) => kr(g.assetCateId, j, B),
      canvasRun: f
    }, V = b.filter((j) => {
      const B = qh(f, j);
      return !B || on.current.has(B) ? !1 : (on.current.add(B), !0);
    });
    tu(U, V), Hd(U, V), is(U, f, k), lr(U, f, w), Wd(U, f, w);
  }
  function is(f, g, h) {
    if (g.single_node || String(g.status || "").trim().toLowerCase() !== "success" || !Hr(h.resultOutput))
      return;
    const b = new Set(
      (g.node_results || []).filter((w) => Wt(w) === "success").map((w) => w.node_key).filter(Boolean)
    );
    Ut(
      f.assetCate.id,
      (w) => Ca({
        canvas: w,
        sourceNodeId: h.id,
        successfulNodeIds: b,
        assetCate: f.assetCate,
        powers: _e
      })
    );
  }
  function Vt(f, g, h) {
    if (!X)
      return null;
    const b = Vo(
      f,
      X,
      ie.nodes.length,
      g,
      h
    ), w = s ? ps(s, Xs(b) || X.id) : X;
    f === "asset" && (b.cardinality = w.cardinality);
    const k = f === "asset" && h?.replaceSingleAssetNode ? Xs(b) || Number(w.id || 0) : 0, z = k ? za(
      ie.nodes,
      ie.edges,
      k,
      h?.connectFromNodeId
    ) : null, U = z ? Oa(
      ie.nodes,
      ie.edges,
      k,
      h?.connectFromNodeId,
      z.id
    ) : /* @__PURE__ */ new Set(), V = z?.id || b.id, j = v?.connection;
    if ($e((B) => {
      let Q = B.edges;
      const Ne = k ? za(
        B.nodes,
        B.edges,
        k,
        h?.connectFromNodeId
      ) : null;
      if (Ne) {
        const pt = Oa(
          B.nodes,
          B.edges,
          k,
          h?.connectFromNodeId,
          Ne.id
        );
        if (Q = B.edges.filter(
          (ot) => !pt.has(ot.from) && !pt.has(ot.to)
        ), j) {
          const ot = Fa(
            j,
            Ne.id
          );
          Q = Dn(Q, ot.source, ot.target);
        } else h?.connectFromNodeId ? Q = Dn(
          Q,
          h.connectFromNodeId || "",
          Ne.id
        ) : h?.connectToNodeId && (Q = Dn(
          Q,
          Ne.id,
          h.connectToNodeId || ""
        ));
        const cn = B.nodes.filter((ot) => !pt.has(ot.id)).map(
          (ot) => ot.id === Ne.id ? Ts(ot, b) : ot
        );
        return {
          ...B,
          nodes: cn,
          edges: Ht(cn, Q)
        };
      }
      if (j) {
        const pt = Fa(j, b.id);
        Q = Dn(Q, pt.source, pt.target);
      } else h?.connectFromNodeId ? Q = Dn(
        Q,
        h.connectFromNodeId || "",
        b.id
      ) : h?.connectToNodeId && (Q = Dn(Q, b.id, h.connectToNodeId || ""));
      const rt = Ps(
        [...B.nodes, b],
        b.id,
        { x: b.x, y: b.y }
      );
      return {
        ...B,
        nodes: rt,
        edges: Ht(rt, Q)
      };
    }), z) {
      const B = Ts(z, b);
      Ce((Q) => {
        const Ne = { ...Q };
        for (const rt of U)
          delete Ne[rt];
        return Ne[z.id] = {
          ...Ne[z.id] || {},
          ...Pw(B)
        }, Ne;
      });
    }
    return h?.selectCreated !== !1 && (_([V]), xr(V)), Y("create"), T(null), z ? Ts(z, b) : b;
  }
  function as(f, g) {
    if (!X)
      return;
    if (ga(ie.nodes).has(f.id)) {
      Z.info("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const h = Cw(
      f,
      X.id,
      ie.nodes.length,
      g
    );
    $e((b) => {
      const w = Ps(
        [...b.nodes, h],
        h.id,
        { x: h.x, y: h.y }
      );
      return {
        ...b,
        nodes: w,
        edges: Ht(w, b.edges)
      };
    }), Ce((b) => {
      const w = b[f.id];
      return w ? { ...b, [h.id]: w } : b;
    }), _([h.id]), xr(h.id), T(null), Z.success("已复制节点");
  }
  function cs(f, g = {}) {
    const h = Od(
      ie.nodes,
      f
    );
    if (h.size === 0)
      return;
    const b = ga(ie.nodes);
    if (!g.allowStoryboardFrame && [...h].some((w) => b.has(w))) {
      Z.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
      return;
    }
    $e((w) => {
      const k = w.nodes.filter((z) => !h.has(z.id));
      return {
        ...w,
        nodes: k,
        edges: Ht(k, w.edges)
      };
    }), Ce(
      (w) => Sa(w, h)
    ), oe((w) => Sa(w, h)), _([]), Jt(
      (w) => w && h.has(w.nodeId) ? null : w
    ), ae(
      (w) => w && h.has(w.id) ? null : w
    ), zt(
      (w) => h.has(w) ? "" : w
    ), je.current && h.has(je.current.id) && (je.current = null), Z.success(
      f.length > 1 || h.size > 1 ? `已删除 ${h.size} 个节点` : "已删除节点"
    );
  }
  function lo(f, g) {
    Vt("asset", g, { asset: f });
  }
  function ds(f, g) {
    if (!f)
      return;
    const h = ie.nodes.find((w) => w.id === f) || (je.current?.id === f ? je.current : null);
    if (!h)
      return;
    const b = Oo(g.version?.content) || it(g.version?.content);
    Ze(
      f,
      fn(
        {
          ...h,
          kind: g.kind || X.kind,
          assetCateId: Number(g.asset_cate_id || X.id || 0)
        },
        {
          output: b,
          asset: g
        },
        "导入资产"
      )
    ), us(f, b);
  }
  async function us(f, g) {
    if (!f)
      return;
    const h = ie.edges.filter((b) => b.from === f).map((b) => ie.nodes.find((w) => w.id === b.to)).filter(
      (b) => !!b && b.type === "function" && b.functionOption?.key === "display"
    );
    if (h.length !== 0)
      for (const b of h)
        Ze(
          b.id,
          fn(b, { output: g }, "展示导入结果")
        );
  }
  function ls(f) {
    const g = Jr;
    if (!g) {
      lo(f);
      return;
    }
    if (!(ie.nodes.find((b) => b.id === g) || (je.current?.id === g ? je.current : null))) {
      lo(f), zt(""), je.current = null;
      return;
    }
    ds(g, f);
  }
  function p() {
    Qt(!1), zt(""), je.current = null;
  }
  function y(f, g) {
    _a(), Qr({ nodeId: f, frameIndex: g }), T(null), Y("create");
  }
  async function M(f) {
    const g = qe;
    if (!g || rn.current)
      return;
    const h = Te.nodes.find((U) => U.id === g.nodeId);
    if (!h) {
      Z.error("宫格节点不存在");
      return;
    }
    const b = f.filter(
      (U) => U.kind === "image" && U.id > 0 && U.versionID > 0
    ), w = Number.isInteger(g.frameIndex);
    if (w && b.length === 0) {
      Z.error("请选择一张图片");
      return;
    }
    if (!w && b.length === 0) {
      Z.error("请至少选择一张图片");
      return;
    }
    if (!w && b.length > Bn) {
      Z.error(`一次最多导入 ${Bn} 张图片`);
      return;
    }
    const k = ii([
      h.asset?.version?.content,
      h.resultOutput
    ]), z = w ? fh(
      k,
      Number(g.frameIndex),
      b[0],
      h.title
    ) : jd(
      b,
      k,
      h.title
    );
    if (!z) {
      Z.error("当前宫格内容不可编辑");
      return;
    }
    rn.current = !0;
    try {
      const U = Number(h.asset?.id || 0), V = Number(
        h.asset?.version?.id || h.asset?.version_id || 0
      ), j = U > 0 && V > 0 ? await Sp({
        projectId: r,
        assetId: U,
        versionId: V,
        content: z
      }) : await Rp({
        projectId: r,
        assetCateId: Number(h.assetCateId || X?.id || 0),
        name: z.title || h.title || "宫格图片",
        kind: "collection",
        content: z,
        nodeKey: h.id,
        requestId: `storyboard-grid-import:${h.id}:${Date.now()}`
      }), B = ln(
        j,
        h.asset
      );
      Nt(B), Ze(
        h.id,
        Us(h, B)
      ), Z.success(w ? "宫格图片已替换" : "图片已导入宫格");
    } catch (U) {
      Z.error(U instanceof Error ? U.message : "导入宫格图片失败");
    } finally {
      rn.current = !1;
    }
  }
  function x(f, g) {
    Vt("power", g, { power: f });
  }
  function $(f = "") {
    vr(f);
  }
  async function S(f) {
    const g = await Hm({
      projectID: r,
      teamID: Number(s?.project.team_id || 0),
      files: f
    }), h = [];
    for (const b of g) {
      const w = zr(b.asset);
      w.id && Nt(w);
      const k = bl(b.asset);
      k.id && h.push(k);
    }
    return h;
  }
  function J(f, g) {
    Vt("agent", g, { role: f });
  }
  function te(f, g) {
    Vt("flow", g, { flow: f });
  }
  function ee(f) {
    Vt("group", f);
  }
  function ke(f, g) {
    const h = Vt("function", g, { functionOption: f });
    f.key === "import" && (je.current = h, $(h?.id || ""));
  }
  function me(f, g, h) {
    vy(), Y("create"), T({
      x: f.x,
      y: f.y,
      position: g,
      connection: h
    }), Xe();
  }
  function fe() {
    R(se === "dark" ? "light" : "dark");
  }
  const Ke = qt((f) => {
    _(f), T(null);
  }), It = qt(me), Qe = qt(Vt), Je = qt(as), ft = qt(cs), Kt = qt(
    (f) => $e((g) => ({ ...g, nodes: f }))
  ), sr = qt(
    (f) => $e((g) => ({ ...g, edges: f }))
  ), Lt = qt(
    (f) => $e((g) => g.nodes.length === 0 && g.edges.length === 0 ? g : { ...g, viewport: f })
  ), Pt = qt(
    y
  );
  return W ? re.current ? null : /* @__PURE__ */ d(tf, {}) : Ot || !s || !X ? /* @__PURE__ */ d("main", { className: `ws-page is-${se} ws-loading-screen`, children: /* @__PURE__ */ d("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ d("span", { children: Ot || "创作空间不存在" }) }) }) : /* @__PURE__ */ A("main", { className: `ws-page is-${se} is-${H}-view`, children: [
    /* @__PURE__ */ d(
      ch,
      {
        activeCate: X,
        mode: H,
        interactive: H === "create",
        nodes: Te.nodes,
        edges: Te.edges,
        viewport: ie.viewport,
        selectedNodeId: F,
        selectedNodeIds: N,
        onSelectNodes: Ke,
        onOpenNodeMenu: It,
        onAddConfiguredNode: Qe,
        onCopyNode: Je,
        onDeleteNodes: ft,
        onShowNodeDetail: Zo,
        onNodesCommit: Kt,
        onEdgesCommit: sr,
        onConnectedMediaEdgeRemove: ao,
        onViewportCommit: Lt,
        focusNodeRequest: Hn,
        onFocusNodeRequestConsumed: ts,
        projectId: r,
        space: s,
        canvasReferenceItems: io,
        catalogCache: o,
        runningNodes: he,
        setRunningNode: oe,
        onNodeResult: Ze,
        onNodeDraftChange: Ee,
        onAssetCreated: Nt,
        onRunStoryboardFrame: nr,
        onRunFunctionNode: lt,
        onRunBackendNode: rr,
        onOpenStoryboardGridImport: Pt,
        onClearFeedbackRecords: xn,
        requestConfirm: Dt,
        onOpenFeedbackRecord: es
      }
    ),
    /* @__PURE__ */ d(
      oh,
      {
        space: s,
        cates: oo,
        activeCate: X,
        saveStatus: ro[String(X.id)] || "saved",
        hasAssetCates: Nr,
        loadingCateId: l,
        onBack: () => t({ to: "/bot/work" }),
        onSelectCate: co,
        onRefresh: sn,
        onOpenRunHistory: () => {
          Yn(!0), An(r, 0);
        },
        onRunHistoryIntent: Ty,
        canStopRuns: ns,
        stoppingRuns: jt || Cn.size > 0,
        onStopRuns: rs,
        theme: se,
        onToggleTheme: fe
      }
    ),
    Bt ? /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载运行历史", overlay: !0 }),
        children: /* @__PURE__ */ d(
          xy,
          {
            open: !0,
            runs: eo,
            loading: to,
            error: ct,
            page: en,
            hasNextPage: xt,
            onOpenChange: Yn,
            onRefresh: () => An(r, 0),
            onPreviousPage: () => An(
              r,
              Math.max(0, en - 2)
            ),
            onNextPage: () => An(r, en),
            stoppingRunKeys: Cn,
            onStopRun: os,
            onLocateRun: (f) => {
              const g = String(f.start_node_id || "");
              g && (Yn(!1), co(Number(f.asset_cate_id || a)).then(
                (h) => {
                  h && window.requestAnimationFrame(() => xr(g));
                }
              ));
            }
          }
        )
      }
    ) : null,
    /* @__PURE__ */ d(
      ah,
      {
        mode: H,
        onModeIntent: (f) => {
          f === "result" && ky();
        },
        onSelectMode: (f) => {
          Y(f), T(null);
        }
      }
    ),
    Zr ? /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载资产选择器", overlay: !0 }),
        children: /* @__PURE__ */ d(
          wa,
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
            onUpload: S,
            onClose: p,
            onConfirm: (f) => {
              const g = f[0];
              g && ls(zr(g));
            }
          }
        )
      }
    ) : null,
    qe ? /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载图片选择器", overlay: !0 }),
        children: /* @__PURE__ */ d(
          wa,
          {
            open: !0,
            teamID: s.project.team_id,
            scopeProjectID: s.project.id,
            title: Number.isInteger(qe.frameIndex) ? "替换宫格图片" : "导入宫格图片",
            description: Number.isInteger(qe.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${Cr} 张已有图片，或上传本地图片。`,
            initialFilters: {
              sourceType: "project",
              projectID: s.project.id,
              kind: "image"
            },
            allowedKinds: ["image"],
            multiple: !Number.isInteger(qe.frameIndex),
            maxSelection: Cr,
            confirmSelection: !0,
            contentMode: "full",
            uploadAccept: "image/*",
            validateAsset: (f) => f.kind !== "image" ? "请选择图片资产。" : f.versionID > 0 ? "" : "该图片没有可用版本，无法导入。",
            onUpload: S,
            onClose: () => Qr(null),
            onConfirm: (f) => {
              M(f);
            }
          }
        )
      }
    ) : null,
    H === "result" ? /* @__PURE__ */ d("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ d(Ue, { fallback: /* @__PURE__ */ d(Ve, { label: "正在加载资产" }), children: /* @__PURE__ */ d(
      Ry,
      {
        teamID: s.project.team_id,
        scopeProjectID: s.project.id,
        onLocalUpload: S,
        initialFilters: {
          sourceType: "project",
          projectID: s.project.id,
          assetCateID: Nr ? X.id : 0
        },
        headerAction: /* @__PURE__ */ d(Me, { label: "关闭资产", children: /* @__PURE__ */ A("button", { type: "button", onClick: () => Y("create"), children: [
          /* @__PURE__ */ d(Ya, { "aria-hidden": "true" }),
          /* @__PURE__ */ d("span", { className: "sr-only", children: "关闭资产" })
        ] }) })
      }
    ) }) }) : null,
    He ? /* @__PURE__ */ d(
      u_,
      {
        prompt: He.prompt,
        running: nn,
        readonly: Om(
          He,
          Te.nodes,
          we.current
        ),
        history: jn(
          Te.nodes.find(
            (f) => f.id === He.node.id
          ) || He.node
        ),
        activeRecordId: He.recordId,
        onSelectRecord: (f) => {
          const g = Te.nodes.find(
            (h) => h.id === He.node.id
          ) || He.node;
          nt({
            node: g,
            recordId: f.id,
            prompt: {
              ...f.prompt,
              values: f.values || f.prompt.values || {}
            }
          });
        },
        onClose: Qo,
        onSubmit: Jo
      },
      `${He.node.id}-${He.recordId}`
    ) : null,
    q ? /* @__PURE__ */ d(
      dh,
      {
        request: q,
        onClose: () => wt(null)
      }
    ) : null,
    v ? /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载节点菜单", overlay: !0 }),
        children: /* @__PURE__ */ d(
          Cy,
          {
            menu: v,
            flows: Ir,
            powers: so,
            powerCategories: wr,
            roles: Qn,
            onClose: () => T(null),
            onSelectFlow: (f) => te(f, v.position),
            onSelectFunction: (f) => ke(f, v.position),
            onSelectGroup: () => ee(v.position),
            onSelectRole: (f) => J(f, v.position),
            onSelectPower: (f) => x(f, v.position)
          }
        )
      }
    ) : null,
    le ? /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载节点详情", overlay: !0 }),
        children: /* @__PURE__ */ d(
          Dy,
          {
            projectId: s.project.id,
            teamId: s.team.id,
            assetCateId: Number(
              le.assetCateId || le.asset?.asset_cate_id || X?.id || 0
            ),
            node: le,
            storyboardFocus: Fe,
            canvasNodes: Te.nodes,
            connectedMediaReferences: mu(
              Te.nodes,
              Te.edges,
              le.id
            ),
            canvasReferenceItems: io.filter(
              (f) => f.source !== "current" || f.id !== le.id
            ),
            onNodeDraftChange: (f) => {
              f && (Ee(le.id, f), ae(
                (g) => g?.id === le.id ? { ...g, composerDraft: f } : g
              ));
            },
            onConnectedMediaEdgeRemove: ao,
            onRunNode: rr,
            onAssetUpdated: (f) => {
              const g = ln(
                f,
                le.asset
              );
              Nt(g);
              const h = Us(
                le,
                g
              );
              le.id.startsWith("asset-detail-") || Ze(le.id, h), ae(
                (b) => b?.id === le.id ? {
                  ...b,
                  ...h
                } : b
              );
            },
            onClose: () => {
              ae(null), In(void 0);
            }
          }
        )
      }
    ) : null
  ] });
}
function oh({
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
  theme: _,
  onToggleTheme: F
}) {
  const D = Math.max(
    0,
    t.findIndex((O) => O.id === n.id)
  );
  return /* @__PURE__ */ A("header", { className: "ws-topbar", children: [
    /* @__PURE__ */ A("div", { className: "ws-project-head", children: [
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "ws-back-button",
          onClick: i,
          "aria-label": "返回工作台",
          children: /* @__PURE__ */ d(Zu, { size: 18 })
        }
      ),
      /* @__PURE__ */ A("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ d("strong", { children: e.project.name }),
        /* @__PURE__ */ d("span", { children: e.team.name || e.project.team?.name || "自由团队" })
      ] })
    ] }),
    o ? /* @__PURE__ */ A(
      "nav",
      {
        className: "ws-cate-strip",
        "aria-label": "资产类型",
        style: {
          "--ws-cate-total": t.length,
          "--ws-cate-active": D
        },
        children: [
          /* @__PURE__ */ d("span", { className: "ws-cate-indicator" }),
          t.map((O) => /* @__PURE__ */ A(
            "button",
            {
              type: "button",
              className: `ws-cate ${O.id === n.id ? "is-active" : ""}`,
              disabled: s != null,
              onClick: () => {
                a(O.id);
              },
              children: [
                s === O.id ? /* @__PURE__ */ d(gn, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ d("span", { className: "ws-cate-name", children: O.name })
              ]
            },
            O.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ A("div", { className: `ws-top-actions ${m ? "has-running" : ""}`, children: [
      /* @__PURE__ */ d(sh, { status: r }),
      m ? /* @__PURE__ */ d(Me, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ A(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: I,
          onClick: N,
          children: [
            I ? /* @__PURE__ */ d(gn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(Ju, { size: 13, fill: "currentColor" }),
            I ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ d(Me, { label: "查看画布运行记录", children: /* @__PURE__ */ A(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: l,
          onFocus: l,
          onClick: u,
          children: [
            /* @__PURE__ */ d(Qu, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ A("button", { type: "button", className: "ws-action", onClick: F, children: [
        _ === "dark" ? /* @__PURE__ */ d(el, { size: 15 }) : /* @__PURE__ */ d(tl, { size: 15 }),
        _ === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ A("button", { type: "button", className: "ws-action", onClick: c, children: [
        /* @__PURE__ */ d(ni, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function sh({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ d(Me, { label: t, children: /* @__PURE__ */ A("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ d(gn, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ d(Xa, { size: 14 }),
    t
  ] }) });
}
const ih = [
  { key: "create", label: "创作", icon: nl },
  { key: "result", label: "资产", icon: rl }
];
function ah({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ d("nav", { className: "ws-dock", "aria-label": "画布视角", children: ih.map((r) => {
    const o = r.icon;
    return /* @__PURE__ */ A(
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
const ch = ei(function({
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
  onShowNodeDetail: _,
  onNodesCommit: F,
  onEdgesCommit: D,
  onConnectedMediaEdgeRemove: O,
  onViewportCommit: L,
  focusNodeRequest: H,
  onFocusNodeRequestConsumed: Y,
  projectId: se,
  space: R,
  canvasReferenceItems: v,
  catalogCache: T,
  runningNodes: W,
  setRunningNode: pe,
  onNodeResult: re,
  onNodeDraftChange: he,
  onAssetCreated: oe,
  onRunStoryboardFrame: ne,
  onRunFunctionNode: be,
  onRunBackendNode: Ce,
  onOpenStoryboardGridImport: le,
  onClearFeedbackRecords: ae,
  requestConfirm: Fe,
  onOpenFeedbackRecord: In
}) {
  const [q, wt] = K(null), [Hn, Jt] = K(""), [Zr, Qt] = K(""), [Jr, zt] = K(""), [qe, Qr] = K(null), [Ot, tt] = K(null), [Ge, Be] = K(""), [eo, gr] = K(!0), [to, no] = K(!1), [ct, Wn] = K(() => /* @__PURE__ */ new Set()), [Bt, Yn] = K(1), en = G(1), Sn = G(1), xt = G(null), [Xn, Cn] = K(null), _t = ue(
    () => new Set(c),
    [c]
  ), jt = G(null), tn = G(/* @__PURE__ */ new Map()), He = G(
    /* @__PURE__ */ new Map()
  ), nt = G(/* @__PURE__ */ new Map()), nn = G(null), Tt = G(!1), je = G(!1), rn = G(!1), $t = G(null), on = G(!1), We = G(s);
  We.current = s;
  const Se = E((p) => {
    const y = Pn(p);
    en.current = y, xt.current != null && typeof window < "u" && window.cancelAnimationFrame(xt.current), xt.current = null, Sn.current = y, Ka(jt.current, y), Yn(
      (M) => Math.abs(M - y) > 5e-3 ? y : M
    );
  }, []), Zn = E((p) => {
    const y = Pn(p);
    if (en.current = y, !(Math.abs(Sn.current - y) <= 5e-3) && xt.current == null) {
      if (typeof window > "u") {
        Sn.current = y, Yn(y);
        return;
      }
      xt.current = window.requestAnimationFrame(() => {
        xt.current = null;
        const M = en.current;
        Sn.current = M, Ka(jt.current, M);
      });
    }
  }, []);
  de(
    () => () => {
      xt.current != null && typeof window < "u" && window.cancelAnimationFrame(xt.current);
    },
    []
  );
  const At = E(
    (p) => {
      We.current = p, D(p);
    },
    [D]
  ), vn = E(
    (p) => {
      const y = Object.entries(p);
      if (y.length === 0)
        return;
      const M = new Map(y);
      let x = !1;
      const $ = We.current.map((S) => {
        if (!M.has(S.id))
          return S;
        const J = M.get(S.id) || void 0;
        return (S.mediaUsage || void 0) === J ? S : (x = !0, { ...S, mediaUsage: J });
      });
      x && At($);
    },
    [At]
  ), Rn = E(
    (p) => {
      const y = We.current.filter((M) => M.id !== p);
      y.length !== We.current.length && (We.current = y, Be((M) => M === p ? "" : M), O(p));
    },
    [O]
  ), Jn = (p, y) => {
    if (zt(""), !r)
      return;
    const M = Wp(o, p, y);
    M !== o && F(M);
  }, yr = (p, y) => {
    if (zt(""), !r)
      return;
    const M = Yp(o, p, y);
    M !== o && F(M);
  }, we = G({
    onNodeResult: re,
    onNodeDraftChange: he,
    onAssetCreated: oe,
    onRunFunctionNode: be,
    onOpenStoryboardGridImport: le,
    onClearFeedbackRecords: ae,
    onOpenFeedbackRecord: In,
    onShowNodeDetail: _,
    requestConfirm: Fe,
    onRunBackendNode: Ce,
    onConnectedMediaUsagesChange: vn,
    onConnectedMediaEdgeRemove: Rn,
    onNodeResizeStart: zt,
    onNodeResizeEnd: Jn,
    onResultViewResizeEnd: yr
  });
  we.current = {
    onNodeResult: re,
    onNodeDraftChange: he,
    onAssetCreated: oe,
    onRunFunctionNode: be,
    onOpenStoryboardGridImport: le,
    onClearFeedbackRecords: ae,
    onOpenFeedbackRecord: In,
    onShowNodeDetail: _,
    requestConfirm: Fe,
    onRunBackendNode: Ce,
    onConnectedMediaUsagesChange: vn,
    onConnectedMediaEdgeRemove: Rn,
    onNodeResizeStart: zt,
    onNodeResizeEnd: Jn,
    onResultViewResizeEnd: yr
  };
  const hr = ue(
    () => ({
      onNodeResult: (p, y) => we.current.onNodeResult(p, y),
      onNodeDraftChange: (p, y, M) => we.current.onNodeDraftChange(p, y, M),
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
  ), _e = ue(
    () => vw(o, s),
    [s, o]
  ), wr = ue(
    () => ny(
      o,
      (p) => _e.hasResultByNodeId.get(p.id) || !1
    ),
    [_e.hasResultByNodeId, o]
  ), Ye = wr.frames, _r = ue(
    () => new Map(
      Ye.map((p) => [
        p.id,
        vd(
          p,
          o,
          (y) => _e.hasResultByNodeId.get(y.id) || !1,
          _e.nodeById
        ).blockedReason
      ])
    ),
    [_e.hasResultByNodeId, o, Ye]
  ), Xe = ue(
    () => new Map(Ye.map((p) => [p.id, p])),
    [Ye]
  ), bt = wr.sourceNodeIds, kn = wr.sourceNodeIdByNodeId;
  de(() => {
    const p = new Set(Ye.map((y) => y.id));
    Wn((y) => {
      const M = new Set(
        [...y].filter(($) => p.has($))
      );
      return M.size === y.size && [...M].every(($) => y.has($)) ? y : M;
    });
  }, [Ye]);
  const Mt = ue(() => {
    const p = /* @__PURE__ */ new Set();
    for (const y of Ye)
      if (ct.has(y.id))
        for (const M of y.memberNodeIds)
          p.add(M);
    return p;
  }, [ct, Ye]), br = E(
    (p) => {
      const y = Xe.get(p), M = jt.current?.getBoundingClientRect();
      if (!y || !q || !M)
        return;
      const x = ya(
        y,
        ct.has(y.id)
      ), $ = Math.max(1, M.width - 144), S = Math.max(1, M.height - 144), J = Math.max(
        0.35,
        Math.min(
          0.9,
          $ / x.width,
          S / x.height
        )
      );
      q.setCenter?.(
        x.x + x.width / 2,
        x.y + x.height / 2,
        { zoom: J, duration: 320 }
      ), Se(J);
    },
    [
      ct,
      q,
      Se,
      Xe
    ]
  ), ro = E(
    (p) => {
      const y = Xe.get(p);
      if (!y)
        return;
      const M = !ct.has(p);
      if (Wn((x) => {
        const $ = new Set(x);
        return $.has(p) ? $.delete(p) : $.add(p), $;
      }), M) {
        const x = new Set(y.memberNodeIds);
        u(
          c.filter(($) => !x.has($))
        ), Jt(""), Be(""), tt(null);
      }
    },
    [
      ct,
      u,
      c,
      Xe
    ]
  ), sn = G({
    onRun: ne,
    onFocus: br,
    onToggle: ro
  });
  sn.current = {
    onRun: ne,
    onFocus: br,
    onToggle: ro
  };
  const Dt = ue(
    () => o.map((p) => p.id).join("\0"),
    [o]
  ), Et = ue(
    () => new Set(
      Dt ? Dt.split("\0") : []
    ),
    [Dt]
  ), oo = ue(
    () => Dt ? `${t.id}:${Dt}` : "",
    [t.id, Dt]
  ), Nr = ue(
    () => Bd(W),
    [W]
  ), X = ue(() => {
    const p = (S) => _e.hasResultByNodeId.get(S.id) || !1, y = /* @__PURE__ */ new Set(), M = o.filter((S) => !Mt.has(S.id)).map((S) => {
      y.add(S.id);
      const J = { x: S.x, y: S.y }, te = _t.has(S.id), ee = te && c.length === 1 && Js(S), ke = S.type === "power" ? Ln(S.power, S.kind, S.outputType).viewMode : "", me = ee, fe = me ? R : null, Ke = me || ke === "storyboard" || ke === "video_compose" ? v : Ky, It = (ke === "video_compose" || ee) && _e.incomingMediaReferencesByNodeId.get(S.id) || Na, Qe = bt.has(S.id), Je = kn.get(S.id) || "", ft = Je && _e.nodeById.get(Je) || null, Kt = !!(Je && vt(
        W[ki(Je)]
      )), sr = `ws-flow-node ws-flow-node-${S.type}`, Lt = W[S.id] || null, Pt = S.type === "group" && _e.groupMembersById.get(S.id) || ba, f = S.type === "group" ? Oc({
        members: Pt,
        runningNodes: W,
        groupState: Lt,
        hasResult: p
      }) : null, g = S.type === "function" && S.functionOption?.key === "start" ? Nr : !1, h = _e.inputContextByNodeId.get(S.id) || null, b = _e.runBlockedReasonByNodeId.get(S.id) || "", w = tn.current.get(S.id), k = w?.data, U = k?.sourceNode === S && k.projectId === se && k.space === fe && k.runningNode === Lt && Iu(k.groupMembers || [], Pt) && jw(k.groupRuntime, f) && k.canvasHasRunningNode === g && k.canvasReferenceItems === Ke && k.connectedMediaReferences === It && k.interactive === r && k.structureLocked === Qe && k.storyboardSourceNode === ft && k.storyboardFrameRunning === Kt && k.runBlockedReason === b && k.showNodeSettings === ee && kw(k.inputContext, h) && k ? k : {
        ...S,
        sourceNode: S,
        projectId: se,
        space: fe,
        catalogCache: T,
        runningNode: Lt,
        groupMembers: Pt,
        groupRuntime: f,
        canvasHasRunningNode: g,
        canvasReferenceItems: Ke,
        connectedMediaReferences: It,
        interactive: r,
        structureLocked: Qe,
        storyboardSourceNode: ft,
        storyboardFrameRunning: Kt,
        runBlockedReason: b,
        showNodeSettings: ee,
        setRunningNode: pe,
        ...hr,
        inputContext: h
      }, V = w?.style, j = vu(S);
      if (w && w.position.x === J.x && w.position.y === J.y && w.data === U && w.selected === te && w.className === sr && w.draggable === (r && !Qe) && w.deletable === !Qe && w.zIndex === (S.type === "group" ? 0 : S.groupId ? 2 : 1) && V?.width === j.width && V?.height === j.height)
        return w;
      const B = {
        ...w,
        id: S.id,
        type: "workSpace",
        position: J,
        data: U,
        selected: te,
        className: sr,
        draggable: r && !Qe,
        deletable: !Qe,
        zIndex: S.type === "group" ? 0 : S.groupId ? 2 : 1,
        style: {
          ...w?.style,
          width: j.width,
          height: j.height
        }
      };
      return tn.current.set(S.id, B), B;
    });
    for (const S of tn.current.keys())
      y.has(S) || tn.current.delete(S);
    const x = /* @__PURE__ */ new Set(), $ = Ye.map((S) => {
      x.add(S.id);
      const J = ct.has(S.id), te = ya(S, J), ee = _r.get(S.id) || "", ke = vt(W[S.id]) || S.workNodeIds.some(
        (Kt) => vt(W[Kt])
      ), me = nt.current.get(S.id), fe = me?.data, It = fe?.title === S.title && fe.groupCount === S.groupCount && fe.workNodeCount === S.workNodeCount && fe.completedCount === S.completedCount && fe.running === ke && fe.runBlockedReason === ee && fe.collapsed === J && fe ? fe : {
        type: "storyboardFrame",
        title: S.title,
        groupCount: S.groupCount,
        workNodeCount: S.workNodeCount,
        completedCount: S.completedCount,
        running: ke,
        runBlockedReason: ee,
        collapsed: J,
        onRun: fe?.onRun || (() => {
          sn.current.onRun(
            S.sourceNodeId
          );
        }),
        onFocus: fe?.onFocus || (() => sn.current.onFocus(S.id)),
        onToggleCollapsed: fe?.onToggleCollapsed || (() => sn.current.onToggle(S.id))
      }, Qe = _t.has(S.id), Je = me?.style;
      if (me && me.position.x === te.x && me.position.y === te.y && me.data === It && me.selected === Qe && me.draggable === r && me.selectable === r && me.focusable === r && Je?.width === te.width && Je?.height === te.height)
        return me;
      const ft = {
        ...me,
        id: S.id,
        type: "storyboardFrame",
        position: { x: te.x, y: te.y },
        data: It,
        selected: Qe,
        className: "ws-flow-node ws-flow-node-storyboard-frame",
        zIndex: -1,
        draggable: r,
        selectable: r,
        connectable: !1,
        deletable: !1,
        focusable: r,
        dragHandle: ".ws-storyboard-frame-header",
        style: {
          ...me?.style,
          width: te.width,
          height: te.height
        }
      };
      return nt.current.set(S.id, ft), ft;
    });
    for (const S of nt.current.keys())
      x.has(S) || nt.current.delete(S);
    return [...$, ...M];
  }, [
    ct,
    _e,
    Mt,
    r,
    bt,
    o,
    se,
    W,
    c.length,
    _t,
    pe,
    R,
    T,
    v,
    Nr,
    hr,
    Ye,
    _r,
    kn
  ]), { flowNodes: Ir, setFlowNodes: Qn } = qp(
    X,
    Zr || Jr
  ), so = E(
    (p) => {
      r && (Be(""), D(s.filter((y) => y.id !== p)));
    },
    [s, r, D]
  ), ie = E(
    (p) => {
      !r || !s.some((y) => y.id === p) || Fe({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => so(p)
      });
    },
    [so, s, r, Fe]
  ), Sr = E(
    (p) => {
      if (!r || p.length === 0)
        return;
      const y = Od(o, p);
      if (y.size === 0)
        return;
      if ([...y].some(
        ($) => bt.has($)
      )) {
        Z.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区");
        return;
      }
      const M = p.length === 1 ? p[0] : null, x = p.some(($) => $.type === "group");
      Fe({
        title: M ? `删除「${M.title}」` : `删除 ${y.size} 个节点`,
        description: x ? "会同时删除组内节点，并移除与这些节点相连的连线。" : M ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          Be(""), N(p);
        }
      });
    },
    [
      r,
      bt,
      o,
      N,
      Fe
    ]
  ), Te = E(
    (p, y = []) => {
      if (!r || p.length === 0)
        return;
      const M = new Set(
        p.flatMap((ee) => ee.memberNodeIds)
      ), x = /* @__PURE__ */ new Set([
        ...M,
        ...y.map((ee) => ee.id)
      ]), $ = o.filter((ee) => x.has(ee.id));
      if ($.length === 0)
        return;
      const S = p.length === 1 && y.every((ee) => M.has(ee.id)) ? p[0] : null, J = $.filter(
        (ee) => ee.type === "group"
      ).length, te = $.length - J;
      Fe({
        title: S ? `删除「${S.title}」制作区` : `删除 ${$.length} 个节点`,
        description: S ? `将删除其中 ${J} 个分组和 ${te} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          Be(""), N($, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, o, N, Fe]
  ), Cr = ue(
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
        purpose: ui(p),
        executionMode: p.executionMode,
        mediaUsage: p.mediaUsage
      }
    })),
    [Et, s, Mt]
  ), dt = ue(() => {
    const p = _e.highlightedPathEdgesByNodeId.get(a) || Ia, y = _e.highlightedPathEdgesByNodeId.get(Hn) || Ia, M = /* @__PURE__ */ new Set([
      ...p,
      ...y
    ]), x = p.size > 0 ? a : y.size > 0 ? Hn : "", $ = /* @__PURE__ */ new Set(), S = Cr.map((J) => {
      $.add(J.id);
      const te = Lw(
        J,
        _e.nodeById,
        Hn,
        a,
        Ge,
        M,
        x
      ), ee = He.current.get(J.id);
      if (ee?.baseEdge === J && ee.highlighted === te.highlighted && ee.selected === te.selected && ee.highlightColor === te.highlightColor && ee.onDeleteEdge === ie)
        return ee.renderedEdge;
      const ke = qw(
        J,
        te,
        ie
      );
      return He.current.set(J.id, {
        ...te,
        baseEdge: J,
        renderedEdge: ke,
        onDeleteEdge: ie
      }), ke;
    });
    for (const J of He.current.keys())
      $.has(J) || He.current.delete(J);
    return S;
  }, [
    Cr,
    _e,
    Hn,
    ie,
    Ge,
    a
  ]), io = ue(
    () => qe ? [...dt, qe] : dt,
    [dt, qe]
  );
  de(() => {
    if (!q || !oo || H || i.zoom != null || typeof window > "u")
      return;
    const p = setTimeout(() => {
      q.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(p);
  }, [oo, q, H, i.zoom]), de(() => {
    if (!q || !H || typeof window > "u")
      return;
    const p = o.find((x) => x.id === H.nodeId);
    if (!p) {
      Y(H);
      return;
    }
    const y = Ye.find(
      (x) => ct.has(x.id) && x.memberNodeIds.includes(p.id)
    );
    if (y) {
      Wn((x) => {
        const $ = new Set(x);
        return $.delete(y.id), $;
      });
      return;
    }
    const M = window.setTimeout(() => {
      const x = { x: p.x, y: p.y }, $ = p.type === "power" ? 1.02 : 0.96;
      q.setCenter?.(
        x.x + (p.width || 180) / 2,
        x.y + (p.height || 180) / 2,
        { zoom: $, duration: 320 }
      ), Se($), Y(H);
    }, 80);
    return () => window.clearTimeout(M);
  }, [
    ct,
    q,
    Se,
    H,
    o,
    Y,
    Ye
  ]);
  const vr = E(
    (p) => {
      if (!r)
        return;
      Qn((x) => {
        const $ = Fu(p, x);
        for (const S of $)
          tn.current.set(S.id, S);
        return $;
      });
      const y = new Set(c);
      let M = !1;
      for (const x of p)
        x.type === "select" && (M = !0, x.selected ? (y.delete(x.id), y.add(x.id)) : y.delete(x.id));
      M && u([...y]);
    },
    [r, u, c]
  ), Ut = E(
    (p) => {
      if (!r)
        return;
      let y = "", M = !1;
      for (const S of p)
        S.type === "select" && (M = !0, S.selected && (y = S.id));
      M && Be(y);
      const x = p.filter(
        (S) => S.type !== "select"
      );
      if (x.length === 0)
        return;
      const $ = zu(x, dt);
      At(Fw($));
    },
    [At, dt, r]
  ), $e = E(
    async (p, y) => {
      if (We.current.some((ee) => {
        const ke = Lr(ee);
        return ke.sourceNodeId === p && ke.targetNodeId === y;
      }))
        return;
      const x = o.find((ee) => ee.id === y), S = mc(o, p).filter(di);
      let J, te;
      if (x?.type === "power" && x.power && S.length > 0)
        try {
          const ee = Number(
            x.composerDraft?.selectedTargetId || 0
          ), ke = Number(
            R.release?.id || R.project.release_id || 0
          ), fe = (await T.loadPowerForm(
            {
              projectId: se,
              releaseId: ke,
              flowId: Number(x.flow?.id || 0),
              powerId: Number(x.power?.id || 0),
              powerKey: x.power?.key || "",
              targetId: ee
            },
            () => gp({
              projectId: se,
              flowId: Number(x.flow?.id || 0),
              powerId: Number(x.power?.id || 0),
              powerKey: x.power?.key || "",
              targetId: ee
            })
          )).params || [], Ke = xi(x), It = mu(
            o,
            We.current,
            y
          ), Qe = Yl(
            fe,
            Ke
          ), Je = Xl({
            node: x,
            content: Ke.promptContent,
            items: v,
            connections: It,
            params: fe,
            values: Qe,
            requestedMode: Ke.multiImageMode,
            additionalSources: S
          }), ft = Je.active ? Je.mode : void 0;
          if (Je.error) {
            Z.error(Je.error);
            return;
          }
          const Kt = Zl(
            fe,
            Qe,
            [
              ...It.map((Pt) => Pt.source),
              ...S
            ],
            ft
          ), sr = Jl(
            Ql(fe, Kt)
          ), Lt = ef(
            It,
            sr,
            S,
            Ke.promptContent,
            v,
            ft
          );
          if (Lt.error) {
            Z.error(Lt.error);
            return;
          }
          if (J = Lt.usage, Je.active && ft) {
            const Pt = mi({
              ...Ke,
              paramValues: Kt,
              multiImageMode: ft
            });
            Yi(Pt) !== Yi(Ke) && (te = Pt);
          }
        } catch (ee) {
          Z.error(
            ee instanceof Error ? `媒体用途加载失败，未建立连线：${ee.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      x && te && he(x.id, te), At(
        Ht(
          o,
          Dn(
            We.current,
            p,
            y,
            J
          )
        )
      );
    },
    [
      v,
      T,
      At,
      o,
      he,
      se,
      R
    ]
  ), Rr = E(
    (p) => {
      r && (Tt.current = !0, !(!p.source || !p.target || p.source === p.target) && $e(
        p.source || "",
        p.target || ""
      ));
    },
    [$e, r]
  ), Ze = E(
    (p, y) => {
      if (!r)
        return;
      const M = String(y?.nodeId || "");
      M && (rn.current = !0, u([]), tt(null)), nn.current = M ? {
        nodeId: M,
        handleId: y?.handleId || null,
        handleType: y?.handleType || null
      } : null, Tt.current = !1, Be("");
    },
    [r, u]
  ), kr = E(
    (p) => {
      if (!r) {
        nn.current = null, Tt.current = !1;
        return;
      }
      const y = nn.current;
      if (nn.current = null, y?.nodeId && typeof window < "u" && window.setTimeout(() => {
        rn.current = !1;
      }, 0), Tt.current) {
        Tt.current = !1;
        return;
      }
      if (!y?.nodeId)
        return;
      const M = Ww(p);
      M && (je.current = !0, l(
        M,
        ir(q, M),
        y
      ));
    },
    [q, r, l]
  ), an = E(
    (p, y) => {
      r && (p.preventDefault(), p.stopPropagation(), tt(null), u([]), Be(y.id));
    },
    [r, u]
  );
  de(() => {
    if (!Ge || typeof window > "u")
      return;
    function p(y) {
      !r || !$a(y) || (y.preventDefault(), ie(Ge));
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [r, ie, Ge]), de(() => {
    if (c.length === 0 || Ge || typeof window > "u")
      return;
    function p(y) {
      if (!r || !$a(y))
        return;
      const M = o.filter(
        ($) => _t.has($.id)
      ), x = c.map(($) => Xe.get($)).filter(($) => !!$);
      if (!(M.length === 0 && x.length === 0)) {
        if (y.preventDefault(), x.length > 0) {
          Te(x, M);
          return;
        }
        Sr(M);
      }
    }
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [
    r,
    o,
    Sr,
    Te,
    Ge,
    c.length,
    c,
    _t,
    Xe
  ]);
  const Ee = E((p) => {
    Qr(
      (y) => Vw(y, p) ? y : p
    );
  }, []), ao = E(
    (p) => {
      if (!r)
        return !1;
      const y = o.find(
        (x) => x.id === p.source
      ), M = o.find(
        (x) => x.id === p.target
      );
      return Ys(y, M);
    },
    [r, o]
  ), Zo = E(
    (p, y) => {
      if (!r)
        return;
      const M = Xe.get(y.id);
      if (M) {
        const te = Rd(
          M,
          y.position
        ), ee = new Set(M.memberNodeIds);
        Qn(
          (ke) => ke.map((me) => {
            if (!ee.has(me.id))
              return me;
            const fe = o.find((Ke) => Ke.id === me.id);
            return fe ? {
              ...me,
              position: {
                x: fe.x + te.x,
                y: fe.y + te.y
              }
            } : me;
          })
        ), Ee(null);
        return;
      }
      if (bt.has(y.id)) {
        Ee(null);
        return;
      }
      const x = o.find((te) => te.id === y.id);
      if (!x) {
        Ee(null);
        return;
      }
      if (x.type === "group") {
        const te = y.position.x - x.x, ee = y.position.y - x.y;
        Qn(
          (ke) => ke.map((me) => {
            const fe = o.find((Ke) => Ke.id === me.id);
            return fe?.groupId !== x.id ? me : {
              ...me,
              position: {
                x: fe.x + te,
                y: fe.y + ee
              }
            };
          })
        ), Ee(null);
        return;
      }
      if (dt.some(
        (te) => te.source === y.id || te.target === y.id
      )) {
        Ee(null);
        return;
      }
      const S = Kw(y, Ir, o);
      if (!S) {
        Ee(null);
        return;
      }
      const J = $w(
        x,
        S.domainNode
      );
      if (!J) {
        Ee(null);
        return;
      }
      Ee(Uw(J));
    },
    [
      dt,
      Ir,
      r,
      bt,
      o,
      Qn,
      Xe,
      Ee
    ]
  ), er = E(
    (p, y) => {
      if (!r) {
        Qt(""), Ee(null);
        return;
      }
      const M = Xe.get(y.id);
      if (M) {
        const J = sy(
          o,
          M,
          y.position
        );
        J !== o && F(J), Qt(""), Ee(null);
        return;
      }
      if (bt.has(y.id)) {
        Qt(""), Ee(null);
        return;
      }
      const x = o.find((J) => J.id === y.id);
      let $ = !1;
      if (x) {
        const J = sf(
          o,
          y.id,
          y.position
        ), te = Ps(
          J,
          y.id,
          y.position
        );
        $ = (x.groupId || "") !== (te.find((ke) => ke.id === x.id)?.groupId || ""), te !== o && F(te);
        const ee = Ht(te, s);
        Su(s, ee) || D(ee);
      }
      if (Qt(""), $) {
        Ee(null);
        return;
      }
      if (!qe) {
        Ee(null);
        return;
      }
      dt.some(
        (J) => J.source === qe.source && J.target === qe.target
      ) || $e(
        qe.source,
        qe.target
      ), Ee(null);
    },
    [
      s,
      $e,
      dt,
      r,
      bt,
      F,
      o,
      qe,
      Xe,
      Ee
    ]
  ), xn = E(
    (p) => {
      !r || p.button !== 2 || !Gy(p.target) || ($t.current = {
        pointerId: p.pointerId,
        start: { x: p.clientX, y: p.clientY },
        baseNodeIds: p.ctrlKey || p.metaKey ? [...c] : [],
        moved: !1
      }, on.current = !1, p.preventDefault(), p.stopPropagation(), p.currentTarget.setPointerCapture?.(p.pointerId));
    },
    [r, c]
  ), Nt = E(
    (p) => {
      const y = $t.current;
      if (!y || y.pointerId !== p.pointerId || !q || !jt.current)
        return;
      const M = p.clientX - y.start.x, x = p.clientY - y.start.y;
      if (!y.moved && Math.hypot(M, x) < 5)
        return;
      y.moved = !0, p.preventDefault(), p.stopPropagation();
      const $ = jt.current.getBoundingClientRect();
      Cn(
        Hy(
          y.start,
          {
            x: p.clientX,
            y: p.clientY
          },
          $
        )
      );
      const S = Wy(
        o,
        ir(q, y.start),
        ir(q, {
          x: p.clientX,
          y: p.clientY
        })
      );
      u(Yy(y.baseNodeIds, S)), Be(""), tt(null);
    },
    [q, o, u]
  ), tr = E(
    (p) => {
      const y = $t.current;
      !y || y.pointerId !== p.pointerId || ($t.current = null, p.currentTarget.hasPointerCapture?.(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId), Cn(null), y.moved && (on.current = !0, p.preventDefault(), p.stopPropagation()));
    },
    []
  ), Jo = E(
    (p) => {
      if (!r)
        return;
      if (je.current) {
        je.current = !1;
        return;
      }
      if (u([]), Be(""), tt(null), !("detail" in p) || p.detail !== 2)
        return;
      p.preventDefault(), p.stopPropagation();
      const y = { x: p.clientX, y: p.clientY };
      l(y, ir(q, y));
    },
    [q, r, l, u]
  ), Qo = E(
    (p) => {
      if (!r)
        return;
      if (p.preventDefault(), p.stopPropagation(), on.current) {
        on.current = !1;
        return;
      }
      const y = { x: p.clientX, y: p.clientY };
      l(y, ir(q, y));
    },
    [q, r, l]
  ), es = E(
    (p, y) => {
      if (r) {
        if (p.preventDefault(), p.stopPropagation(), Xe.has(y.id)) {
          Be(""), _t.has(y.id) || u([y.id]), tt({
            nodeId: y.id,
            x: p.clientX,
            y: p.clientY
          });
          return;
        }
        Be(""), _t.has(y.id) || u([y.id]), tt({
          nodeId: y.id,
          x: p.clientX,
          y: p.clientY
        });
      }
    },
    [r, u, _t, Xe]
  ), ce = Ot && o.find((p) => p.id === Ot.nodeId) || null, ut = Ot && Xe.get(Ot.nodeId) || null, Tn = !!(ce && bt.has(ce.id)), nr = ce && o.find(
    (p) => p.id === ry(o, ce)
  ) || null, rr = ce ? { x: ce.x, y: ce.y } : void 0;
  function lt() {
    tt(null);
  }
  function co() {
    if (!(!r || !ce)) {
      if (Tn) {
        Z.info("脚本托管节点不能复制，请在分镜脚本中修改结构"), lt();
        return;
      }
      I(
        ce,
        rr ? { x: rr.x + 34, y: rr.y + 34 } : void 0
      ), lt();
    }
  }
  function xr() {
    if (!r || !ce && !ut)
      return;
    if (ut) {
      const y = ut;
      lt(), Te([y]);
      return;
    }
    if (!ce)
      return;
    if (Tn) {
      Z.info("脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"), lt();
      return;
    }
    const p = ce;
    lt(), Sr([p]);
  }
  function ts() {
    ce && (_(ce), lt());
  }
  function or() {
    nr && (_(
      nr,
      Id(ce)
    ), lt());
  }
  function An() {
    if (!ce)
      return;
    const p = zg(ce, o);
    if (!p) {
      lt();
      return;
    }
    he(ce.id, p), Z.success("已恢复脚本生成的提示词"), lt();
  }
  const Tr = E(
    (p) => {
      r && (p.preventDefault(), p.dataTransfer && (p.dataTransfer.dropEffect = "move"));
    },
    [r]
  ), Ar = E(
    (p) => {
      if (!r || (p.preventDefault(), !q || !m)) return;
      const y = p.dataTransfer.getData(
        "application/shemic-nodetype"
      );
      if (!y) return;
      const M = p.dataTransfer.getData("application/shemic-detail"), x = M ? JSON.parse(M) : void 0, $ = q.screenToFlowPosition ? q.screenToFlowPosition({
        x: p.clientX,
        y: p.clientY
      }) : ir(q, {
        x: p.clientX,
        y: p.clientY
      });
      y === "asset" && x ? m("asset", $, { asset: x }) : y === "power" && x ? m("power", $, { power: x }) : y === "agent" && x ? m("agent", $, { role: x }) : y === "flow" && x ? m("flow", $, { flow: x }) : y === "function" && x ? m("function", $, { functionOption: x }) : m(y, $);
    },
    [q, r, m]
  ), ns = E(() => {
    q?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [q]), uo = E(
    (p) => {
      const y = Pn(p);
      Se(y), q?.zoomTo?.(y, { duration: 120 });
    },
    [q, Se]
  ), rs = E(() => {
    const p = Pn(Bt + 0.12);
    Se(p), q?.zoomIn?.({ duration: 140 });
  }, [q, Se, Bt]), os = E(() => {
    const p = Pn(Bt - 0.12);
    Se(p), q?.zoomOut?.({ duration: 140 });
  }, [q, Se, Bt]), Mr = E(() => {
    if (r) {
      if (rn.current) {
        rn.current = !1;
        return;
      }
      Be(""), tt(null);
    }
  }, [r]), ss = E(
    (p, y) => {
      r && Qt(y.id);
    },
    [r]
  ), is = E((p, y) => {
    Jt(y.id);
    const M = y.type === "workSpace" ? y.data.sourceNode : null;
    M && Js(M) && Py();
  }, []), Vt = E(() => {
    Jt("");
  }, []), as = E(
    (p) => {
      const y = p;
      wt(y), i.x != null && i.y != null && i.zoom != null ? (y.setViewport?.({
        x: i.x,
        y: i.y,
        zoom: i.zoom
      }), Se(i.zoom)) : Se(y.getZoom?.() || 1);
    },
    [Se, i.x, i.y, i.zoom]
  ), cs = E(
    (p, y) => {
      Zn(y.zoom);
    },
    [Zn]
  ), lo = E(
    (p, y) => {
      Se(y.zoom), L({
        x: y.x,
        y: y.y,
        zoom: y.zoom
      });
    },
    [Se, L]
  ), ds = E(() => {
    gr((p) => !p);
  }, []), us = E(() => {
    no((p) => !p);
  }, []), ls = [
    "ws-canvas-wrap",
    Zr ? "is-dragging" : "",
    Xn ? "is-selecting" : "",
    Jr ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ A(
    "section",
    {
      ref: jt,
      className: ls,
      style: p_(Bt),
      onPointerDownCapture: xn,
      onPointerMoveCapture: Nt,
      onPointerUpCapture: tr,
      onPointerCancelCapture: tr,
      children: [
        /* @__PURE__ */ d(
          Ou,
          {
            nodes: Ir,
            edges: io,
            onlyRenderVisibleElements: !0,
            nodeTypes: Xy,
            edgeTypes: Zy,
            onNodesChange: vr,
            onEdgesChange: Ut,
            onConnect: Rr,
            onConnectStart: Ze,
            onConnectEnd: kr,
            isValidConnection: ao,
            connectionLineStyle: Jy,
            onEdgeClick: an,
            onNodeClick: Mr,
            onNodeContextMenu: es,
            onNodeDragStart: ss,
            onNodeDrag: Zo,
            onNodeDragStop: er,
            onDragOver: Tr,
            onDrop: Ar,
            onNodeMouseEnter: is,
            onNodeMouseLeave: Vt,
            onInit: as,
            onMove: cs,
            onMoveEnd: lo,
            onPaneClick: Jo,
            onPaneContextMenu: Qo,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: eh,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: to,
            snapGrid: Qy,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: th,
            fitView: i.zoom == null,
            fitViewOptions: nh,
            children: r && eo && o.length > 0 ? /* @__PURE__ */ d(
              Bu,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeClassName: N_,
                nodeColor: I_
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
          Hp,
          {
            showMiniMap: eo,
            snapToGrid: to,
            zoom: Bt,
            onToggleMiniMap: ds,
            onToggleSnap: us,
            onReset: ns,
            onZoomIn: rs,
            onZoomOut: os,
            onZoomChange: uo
          }
        ) : null,
        r && o.length === 0 ? /* @__PURE__ */ A("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ A("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ d(qa, { size: 16 }),
            /* @__PURE__ */ d("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ d("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && Ot && (ce || ut) ? /* @__PURE__ */ d(
          Gp,
          {
            point: Ot,
            canShowDetail: !!(ce && Rt(ce)),
            canCopy: !!(ce && !Tn),
            canDelete: !!(ut || !Tn),
            canEditStructure: !!(nr && nr.id !== ce?.id),
            canResetStoryboardPrompt: !!(ce && id(ce)),
            onClose: lt,
            onCopy: co,
            onDelete: xr,
            onDetail: ts,
            onEditStructure: or,
            onResetStoryboardPrompt: An
          }
        ) : null
      ]
    }
  );
});
function dh({
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
        Z.error(i instanceof Error ? i.message : "操作失败");
      });
    } catch (i) {
      Z.error(i instanceof Error ? i.message : "操作失败");
    }
  }
  return /* @__PURE__ */ d(
    "div",
    {
      className: "ws-confirm-backdrop",
      role: "dialog",
      "aria-modal": "true",
      onMouseDown: t,
      children: /* @__PURE__ */ A(
        "section",
        {
          className: "ws-confirm-card",
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            /* @__PURE__ */ A("div", { className: "ws-confirm-copy", children: [
              /* @__PURE__ */ d("h3", { children: e.title }),
              /* @__PURE__ */ d("p", { children: e.description })
            ] }),
            /* @__PURE__ */ A("div", { className: "ws-confirm-actions", children: [
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
function uh(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function lh(e, t, n) {
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
function Ca({
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
      nodes: oy(
        s.nodes,
        t,
        n
      )
    };
    if (s = js({
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
function jd(e, t, n, r = e.length) {
  const o = Math.min(
    Bn,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: xe(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: o },
      (s, i) => e[i] ? Ud(e[i], i) : $d(i)
    )
  };
}
function fh(e, t, n, r) {
  if (t < 0 || t >= Bn || (e?.frames.length || 0) > Bn)
    return null;
  const o = e || jd([], null, r, t + 1), s = Math.min(
    Bn,
    Math.max(2, o.frames.length, t + 1)
  ), i = Ud(n, t);
  return {
    ...o,
    frames: Array.from(
      { length: s },
      (a, c) => o.frames[c] || $d(c)
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
function $d(e) {
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
function Ud(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: Sl(e.version?.content, "image")[0] || "",
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
  ), o = e.type === "agent" && r != null ? Ae(r) : Oo(r) || it(r), s = e.type === "power" && Ln(e.power, e.kind, e.outputType).viewMode === "storyboard" ? Hr([
    r,
    t?.asset?.version?.content,
    t?.version?.content,
    t?.result,
    o
  ]) : null, i = e.type === "power" && gl(e.power, e.kind, e.outputType) ? ii([
    r,
    t?.asset?.version?.content,
    t?.version?.content,
    t?.result,
    o
  ]) : null, a = xe(
    String(t?.asset?.kind || ""),
    String(t?.kind || ""),
    Go(e, o)
  ), c = Nn(o, a), u = yt(o, ""), l = xe(
    i?.title,
    s?.title
  ), m = i?.summary || s?.summary || c.text || (Yt(u) ? "" : u) || c.imageUrl || c.videoUrl || c.audioUrl || c.fileUrl || (n ? `已按提示生成：${n}` : "生成完成");
  return {
    ...l && e.titleMode === "auto" ? { title: l } : {},
    description: m,
    resultRef: To(t),
    resultOutput: i || s || o,
    asset: t?.asset || e.asset,
    kind: t?.asset?.kind || e.power?.kind || e.kind
  };
}
function Us(e, t) {
  const n = t.version?.content;
  return {
    ...fn(
      e,
      {
        asset: t,
        output: n
      },
      Ja(n)
    ),
    asset: t
  };
}
function xi(e) {
  return Gf(e.composerDraft);
}
function ph(e) {
  const t = xi(e);
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
function Ti(e, t) {
  const n = Fm(e, t);
  return {
    ...n,
    id: mh(e, t, n.id)
  };
}
function mh(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const o = String(t.interaction?.interaction?.id || "");
  if (o)
    return `${e.id}:${o}`;
  const s = Co({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return s ? `${e.id}:feedback:${Qd(s)}` : n;
}
function Vs(e, t) {
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
const va = 3600 * 1e3, Vd = 2e3, gh = 3;
async function Is(e) {
  const t = Gh(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = !1, o = "0-0";
  const s = {
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: li(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s);
  let i = await yp({
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
    const c = await yh(
      e,
      i,
      o,
      (m) => {
        const I = tu(
          e,
          m,
          n
        );
        Hd(e, m), r = r || I > 0;
      },
      () => r,
      (m) => {
        o = m;
      }
    );
    if (e.canvasRun = c, lr(e, c), Po(
      e,
      c,
      r
    ) && (c.status === "running" || c.status === "pending")) {
      Z.info("节点结果已返回，后台运行仍在收尾");
      return;
    }
    const u = Number(c.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      Qw(
        c,
        tw(c, u)
      )
    );
    const l = String(c.status || "").toLowerCase();
    if (l !== "waiting") {
      if (Wd(e, c), l === "fail" || l === "error")
        throw new Error(Wc(c));
      if (l === "canceled" || l === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await Yh(e, c), i = {
      ...c,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
async function yh(e, t, n, r, o, s) {
  let i = Pr(
    e,
    yn(t)
  );
  if (i = Ls(e, i), r(i.node_results || []), lr(e, i), i.status !== "running" && i.status !== "pending" || !i.run_id && !i.request_id)
    return i;
  const a = String(i.request_id || ""), c = new AbortController(), u = Date.now() + va;
  let l = !1, m = null;
  const I = window.setTimeout(() => {
    l = !0, c.abort();
  }, va);
  try {
    const N = await Sh(
      e,
      a,
      n,
      (_) => {
        _.stream_id && s(_.stream_id);
        const F = vh(_, e);
        if (!F) {
          Gd(e, _);
          return;
        }
        i = Pr(
          e,
          qs(i, F)
        ), r(i.node_results || []), lr(e, i);
      },
      c.signal
    );
    N && (i = Pr(
      e,
      qs(i, N)
    ), lr(e, i)), r(i.node_results || []);
  } catch (N) {
    m = N;
  } finally {
    window.clearTimeout(I), c.abort(), e.runningNodeBatcher?.flush();
  }
  if (i = Ls(e, i), Ks(e, i) && !Po(
    e,
    i,
    o()
  ))
    try {
      i = await hh(
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
  if (!Ks(e, i) || Po(
    e,
    i,
    o()
  ))
    return i;
  throw m instanceof Error && !l ? m : new Error("画布仍在运行，请稍后刷新查看结果");
}
async function hh(e, t, n, r, o, s) {
  let i = t, a = 0;
  for (; ; ) {
    if (Date.now() >= s)
      throw new Error("画布仍在运行，请稍后刷新查看结果");
    try {
      i = await _h(
        e,
        i,
        n,
        r
      ), a = 0;
    } catch (c) {
      if (a += 1, a >= gh)
        throw c;
    }
    if (!Ks(e, i) || Po(
      e,
      i,
      o()
    ))
      return i;
    await Ih(
      Math.min(Vd, s - Date.now())
    );
  }
}
function Po(e, t, n) {
  return !!(e.singleNode && !Ld(e) && n && !wh(t));
}
function wh(e) {
  return String(e.status || "").trim().toLowerCase() === "waiting" || qd(e) ? !0 : [
    e.pending_node,
    e.output,
    ...e.node_results || []
  ].some((r) => !!pn(r));
}
async function _h(e, t, n, r) {
  let o = t;
  const s = Number(o.run_id || 0), i = String(o.request_id || n || "");
  if (!s && !i)
    return o;
  const a = await _p({
    projectId: e.projectId,
    runId: s,
    requestId: i
  });
  return o = Pr(
    e,
    qs(o, yn(a))
  ), o = Ls(e, o), r(o.node_results || []), lr(e, o), o;
}
function Ks(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : !Kd(e, t);
}
function Kd(e, t) {
  return Uh(
    t
  ) ? !0 : e.singleNode ? (t.node_results || []).some(
    (n) => n.node_key === e.startNode.id && Yr(Wt(n))
  ) : !1;
}
function Ls(e, t) {
  return bh(e, t) ? {
    ...t,
    status: Nh(t.node_results || [])
  } : t;
}
function bh(e, t) {
  const n = String(t.status || "").trim().toLowerCase();
  return n !== "running" && n !== "pending" ? !1 : Kd(e, t);
}
function Nh(e) {
  for (const t of e) {
    const n = Wt(t);
    if (n === "fail")
      return "fail";
    if (n === "canceled" || n === "cancelled")
      return "canceled";
  }
  return "success";
}
function Ih(e) {
  return new Promise((t) => {
    window.setTimeout(t, e);
  });
}
async function Sh(e, t, n, r, o) {
  let s = null;
  return await Zc({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: o,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if (Ch(i))
          throw new Error(i.msg || "画布流返回失败");
        s = Pr(
          e,
          yn(i.output || {})
        );
      }
    }
  }), s;
}
function Ch(e) {
  return Number(e.status || 0) === 2;
}
function Pr(e, t) {
  if (!e.singleNode || Ld(e))
    return t;
  const n = (t.node_results || []).find(
    (c) => c.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const o = qd(t), s = ge(n?.output, t.output), i = {
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
function Ld(e) {
  return e.singleNode && e.startNode.type === "group";
}
function qd(e) {
  const t = e.output;
  return (Array.isArray(e.approvals) ? e.approvals : t && typeof t == "object" && Array.isArray(t.approvals) ? t.approvals : t && typeof t == "object" && Array.isArray(t.data?.approvals) ? t.data.approvals : []).find(
    (r) => r && typeof r == "object" && (r.status === "pending" || r.decision === "pending")
  );
}
function vh(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return yn(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const o = Rh(n, {
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
function Rh(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, o = r && typeof r == "object" ? r : {}, s = Cm(o, n);
  if (!s)
    return null;
  const i = s;
  return t.requireDisplayableResult && !xh(e, i, t.node) ? null : {
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
      kh(e, i)
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
function kh(e, t) {
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
function xh(e, t, n) {
  return e.persists_result || String(e.node_type || "") !== "function" || String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ) === "display" ? !0 : !!(t.asset || t.version || t.asset?.version || t.data?.asset || t.data?.version);
}
function Gd(e, t) {
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
        const c = Ra(n.output), u = String(n.node_type || "").toLowerCase(), l = u === "power", m = u === "agent", I = String(
          c.semantic_event || c.event || ""
        ).toLowerCase(), N = Ra(c.meta), _ = l && I === "status" && !!String(N.output_type || ""), F = _ && !!(c.json && typeof c.json == "object"), D = l && (I === "audio_ready" || F || Cl(c)), O = Number(N.generated_count || 0), L = _ ? Math.max(
          a.generatedCount || 0,
          Number.isFinite(O) ? O : 0
        ) : a.generatedCount, H = l && typeof c.text == "string" && (I === "delta" || !I) ? c.text : "", Y = D ? c : a.streamOutput;
        return {
          ...i,
          [o]: {
            ...a,
            progress: Math.max(a.progress, 72),
            streamText: H ? `${a.streamText || ""}${H}` : a.streamText,
            streamOutput: Y,
            streamStarted: a.streamStarted || !!H || !!Y,
            ..._ ? { streamStarted: !0, generatedCount: L } : {},
            agent: m ? tm(a.agent, c) : a.agent
          }
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s) : e.setRunningNode(s);
    }
  }
}
function Th(e, t, n, r) {
  const o = t.output || {}, s = String(o.event || ""), i = String(o.node_key || o.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (s === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    Gd(e, t);
  }
}
function Ra(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function qs(e, t) {
  const n = [...e.node_results || []];
  for (const r of t.node_results || []) {
    const o = zo(r), s = n.findIndex(
      (i) => zo(i) === o
    );
    s >= 0 ? n[s] = r : n.push(r);
  }
  return {
    ...e,
    ...t,
    node_runs: t.node_runs?.length ? t.node_runs : e.node_runs,
    execution_plan: t.execution_plan || e.execution_plan,
    node_results: n,
    pending_node: t.status === "waiting" ? t.pending_node || e.pending_node : t.pending_node || null
  };
}
function Hd(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => Yr(r.status)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => Ah(e, r, n)
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
function Ah(e, t, n) {
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
      agent: a?.type === "agent" ? nm(s.output) : c.agent
    }, r = !0);
  }
  return r ? o : t;
}
function Wd(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((o) => {
      const s = Ss(
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
    const i = { ...o }, a = Ss(
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
        const a = Ss(
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
function Ss(e, t, n, r) {
  const o = new Set(
    Dh(e, t).filter(
      (s) => !r || r.has(s)
    )
  );
  return Object.keys(n).filter((s) => o.has(s));
}
function Mh(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const o = Gs(t), s = /* @__PURE__ */ new Map();
  let i = !1, a = "";
  for (const l of t.node_runs || []) {
    const m = String(l.node_key || "");
    if (!m || o.has(m) || n && !n.has(m))
      continue;
    i = !0;
    const I = String(l.status || "").trim().toLowerCase();
    I === "running" ? s.set(m, "running") : I === "waiting" ? s.set(m, "waiting") : I === "pending" && !a && (a = m);
  }
  const c = String(t.pending_node?.node_key || "");
  if (c && !o.has(c) && (!n || n.has(c)) && s.set(c, "waiting"), s.size === 0 && a && s.set(a, "running"), s.size === 0 && !i) {
    const l = String(t.start_node_id || "");
    l && !o.has(l) && (!n || n.has(l)) && s.set(
      l,
      r === "waiting" ? "waiting" : "running"
    );
  }
  if (s.size === 0)
    return;
  const u = Date.parse(String(t.created_at || ""));
  e.setRunningNode((l) => {
    let m = !1;
    const I = { ...l };
    for (const [N, _] of s) {
      const F = e.nodes.find((O) => O.id === N);
      if (!F)
        continue;
      const D = l[N];
      D?.status !== _ && (I[N] = {
        nodeId: N,
        title: F.title,
        startedAt: D?.startedAt || (Number.isFinite(u) ? u : Date.now()),
        progress: _ === "waiting" ? 92 : D?.progress || 0,
        status: _
      }, m = !0);
    }
    return m ? I : l;
  });
}
function Dh(e, t) {
  const n = new Set(Fo(t));
  return e.singleNode && n.add(e.startNode.id), [...n];
}
function Eh(e, t) {
  const n = Number(e.asset_cate_id || 0);
  return n === 0 || n === Number(t || 0);
}
function Fo(e) {
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
function Gs(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Yr(Wt(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function Ph(e) {
  return Xd(e).map((t) => t.run);
}
function Fh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    qc(n) && t.set(zn(n), n);
  return [...t.values()];
}
function zh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const o of Yd(n))
        t.set(o, r);
  }
  return t;
}
function Oh(e, t) {
  for (const n of Yd(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function Yd(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function Xd(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const o = /* @__PURE__ */ new Set();
    for (const s of Fo(r))
      t.has(s) || (t.add(s), o.add(s));
    o.size !== 0 && qc(r) && n.push({ run: r, managedNodeIds: o });
  }
  return n;
}
function Cs(e) {
  return e.map(Zd).filter((t) => !!t);
}
function Zd(e) {
  const t = yn(e);
  return t.run_id || t.request_id ? t : null;
}
function Bh(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const o = Number(r.run_id || 0);
    o > 0 && !jh(r, t) && n.add(o);
  }
  return [...n];
}
function jh(e, t) {
  const n = Number(e.asset_cate_id || 0);
  return (n ? [t[String(n)]].filter(
    (o) => !!o
  ) : Object.values(t)).some(
    (o) => Jd(e, o)
  );
}
function Jd(e, t) {
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
      if (c && (i += 1, !ka(c.resultRef, e, a)))
        return !1;
    }
    return i > 0;
  }
  const o = r.get(String(e.start_node_id || ""));
  return ka(o?.resultRef, e);
}
function ka(e, t, n) {
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
function xa(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(zn(r), r);
  for (const r of t)
    n.set(zn(r), r);
  return [...n.values()].sort($h).slice(0, 50);
}
function $h(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = Ta(t) - Ta(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Ta(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function Uh(e) {
  const t = Vh(e);
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
function Vh(e) {
  const t = /* @__PURE__ */ new Set();
  for (const o of e.execution_plan?.nodes || [])
    Kh(o) && t.add(o.id);
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
function Kh(e) {
  return ["asset", "power", "agent", "flow"].includes(String(e.type || "")) ? !0 : e.type !== "function" ? !1 : e.function_key === "save" || e.function_key === "display";
}
function Lh(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((o) => o.id === n);
    if (r)
      return r;
  }
  return t.find(Zw) || t[0] || null;
}
function qh(e, t) {
  return [
    e.run_id || e.request_id || "",
    zo(t)
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
function Gh(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function Hh(e, t, n) {
  const r = typeof n == "string" ? n : Co(n), o = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${o}-${Qd(r)}`.slice(
    0,
    96
  );
}
function Qd(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function lr(e, t, n) {
  Wh(e, t), Mh(e, t, n);
}
function Wh(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((c) => c.id === n.node_key);
  if (!r)
    return;
  const o = Ai(n, r);
  if (!o)
    return;
  const s = Ti(r, o), i = jn(r), a = Vs(
    i,
    s
  );
  if (Co(i) !== Co(a)) {
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
async function Yh(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const o = Ai(n, r);
  if (!o || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const s = await e.requestFlowFeedback({ node: r, prompt: o });
  return eu(
    e.projectId,
    t,
    n,
    o,
    s
  );
}
async function eu(e, t, n, r, o) {
  return r.interaction ? Ip({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: o
  }) : wp({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: o
  });
}
function Xh(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const o = r.pending_node;
    if (!o || o.node_key !== t.id)
      continue;
    const s = Ai(o, t);
    if (!s)
      continue;
    if (Ti(t, s).id === n.id)
      return { run: r, pending: o, prompt: s };
  }
  return null;
}
function Ai(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : pn(e);
  if (n?.interaction?.id)
    return Qc({
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
    const i = Bm(o);
    return jm(i);
  }
  return Um(
    ou(e),
    t.title
  );
}
function tu(e, t, n) {
  let r = 0;
  const o = new Map(e.nodes.map((s) => [s.id, s]));
  for (const s of t) {
    const i = o.get(s.node_key), a = Wt(s);
    if (!i || !Yr(a))
      continue;
    const c = zo(s);
    if (a === "success" && c && n?.has(c))
      continue;
    const u = Qh(e, i, s);
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
function Zh(e, t) {
  const n = xi(e).prompt.trim(), o = (t ? gu(e.id, t.nodes, t.edges) : null)?.text.trim() || "", s = [n, o ? `上游内容：
${o}` : ""].filter(Boolean).join(`

`);
  return Array.from(s).slice(0, Ly).join("");
}
function Jh(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || Wt(t) !== "success" || ru(t) <= 0 || !nu(e) ? !1 : Ln(e.power, e.kind, e.outputType).viewMode !== "storyboard";
}
function nu(e) {
  const t = Number(e.nodeNo || 0);
  return t > 0 && e.title.trim() === Ic(e, t).trim();
}
function ru(e) {
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
function zo(e) {
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
function Qh(e, t, n) {
  const r = ou(n), o = Wt(n);
  if (o === "fail")
    return vs(t, {
      resultRef: To(r),
      runError: vm(n)
    });
  if (o === "canceled" || o === "cancelled")
    return vs(t, {
      resultRef: To(r),
      runError: "节点运行已取消"
    });
  const s = am({
    result: r,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), i = (a) => vs(
    t,
    ew(
      t,
      a,
      n.source_signature
    )
  );
  return i(s ? {
    ...fn(
      t,
      cm(r, s),
      "后端执行结果"
    ),
    runError: ""
  } : {
    ...fn(t, r, "后端执行结果"),
    runError: ""
  });
}
function ew(e, t, n) {
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
function vs(e, t) {
  const n = jn(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function ou(e) {
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
function tw(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? Wc(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function nw(e) {
  const t = rw(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await vp({
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
function rw(e) {
  return Math.max(0, Number(e || 0));
}
function qn(e) {
  const t = Xt(e), n = Nn(
    t,
    Go(e, t)
  );
  return wn(n) || (n.text = yt(t, "")), n;
}
function Go(e, t) {
  const n = yw(t);
  return e.type === "power" ? xe(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : xe(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function Rs(e) {
  const t = qn(e);
  if (wn(t))
    return t;
  const n = Nn(
    Xt(e),
    String(e.kind || e.power?.kind || "")
  );
  return wn(n) || (n.text = yt(Xt(e), "")), n;
}
function Mi(e) {
  return sw(e) || lw(e);
}
function dn(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : Xt(e);
}
function ks(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    dn(e)
  ];
}
function ow(e) {
  const t = e.composerDraft?.paramValues || {};
  return xe(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function sw(e) {
  return iw(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function iw(...e) {
  for (const t of e) {
    const n = Vn(t);
    if (n)
      return n;
  }
  return null;
}
function Oo(...e) {
  for (const t of e) {
    const n = su(t);
    if (De(n))
      return n;
  }
  return "";
}
function su(e) {
  const t = Ae(e), n = Xr(t);
  if (n !== t)
    return su(n);
  const r = Vy?.(t) ?? t, o = En(r, /* @__PURE__ */ new Set());
  if (De(o))
    return o;
  if (r !== t) {
    const a = En(t, /* @__PURE__ */ new Set());
    if (De(a))
      return a;
  }
  const s = Ho(t);
  if (s)
    return Es?.(s) ?? s;
  const i = Di(e);
  return i !== t && De(i) ? i : "";
}
function En(e, t) {
  const n = Ae(e), r = Xr(n);
  if (r !== n)
    return En(r, t);
  if (typeof n == "string") {
    const c = au(n);
    if (De(c))
      return c;
    const u = Fr(n);
    return u ? { text: u } : _n(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const c = n.map((u) => En(u, t)).filter(De);
    return c.length > 0 ? c : "";
  }
  if (!n || typeof n != "object")
    return n;
  if (Gn(n)) {
    const c = yu(n);
    if (c !== void 0)
      return En(c, t);
    const u = hu(n);
    if (u)
      return { text: u };
    const l = Vn(n) || st(n);
    return l ? { rich: l } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), zi(n))
    return Hs(n);
  if (cu(n))
    return n;
  for (const c of ["output", "result", "data", "content", "json", "value"]) {
    if (!(c in n))
      continue;
    const u = En(n[c], t);
    if (De(u))
      return u;
  }
  const o = Ei(n);
  if (o) {
    const c = { rich: o };
    return Es?.(c) ?? c;
  }
  const s = st(n);
  if (s)
    return { rich: s };
  const i = Ho(n);
  if (i)
    return Es?.(i) ?? i;
  const a = it(n);
  if (a !== n)
    return En(a, t);
  if (aw(n))
    return Hs(n);
  if (Xo(n)) {
    const c = xe(n.message, n.error, n.status);
    return c ? { text: c } : "";
  }
  return Wo(n) ? n : "";
}
function aw(e) {
  return e && typeof e == "object" && !Array.isArray(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files);
}
function Hs(e) {
  const t = {}, n = Ae(e.content);
  n && typeof n == "object" && !Array.isArray(n) && Ma(t, n), Ma(t, e);
  const r = cw(e);
  return r && (t.text = r), !De(t) && n && typeof n == "object" ? n : Wo(t) ? t : "";
}
function cw(e) {
  const t = xe(e.text);
  if (t)
    return t;
  const n = Ae(e.content);
  return typeof n == "string" ? n.trim() : n && typeof n == "object" && !Array.isArray(n) ? xe(n.text) : "";
}
function Di(e) {
  const t = Xr(e);
  if (t !== e)
    return Di(t);
  const n = Ho(e);
  if (n)
    return n;
  const r = au(e);
  if (De(r))
    return r;
  const o = Ae(e), s = st(o);
  if (s)
    return { rich: s };
  const i = it(o);
  if (i !== o) {
    const a = st(i);
    return a ? { rich: a } : i;
  }
  return o;
}
function Ho(e) {
  const t = Vn(e);
  return t ? { rich: t } : null;
}
function Vn(e, t = /* @__PURE__ */ new Set()) {
  const n = Ae(e), r = Xr(n);
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
    return iu(n, t) || n;
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
function iu(e, t) {
  const n = Bo(e);
  for (const r of n) {
    const o = Aa(r, t);
    if (o)
      return o;
  }
  return Aa(n.join(""), t);
}
function Aa(e, t) {
  const n = String(e || "").trim();
  if (!_n(n))
    return null;
  const r = tc(n);
  return r === n || r === e ? null : Vn(r, t);
}
function dw(e) {
  return Bo(e).join("");
}
function Bo(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => Bo(r, t));
  if (typeof e != "object")
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...Bo(e.content, t)), n;
}
function au(e) {
  const t = ht(e);
  if (t)
    return { rich: t };
  const n = Ae(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = Fr(n);
    return r ? { text: r } : "";
  }
  return "";
}
function ht(e, t = /* @__PURE__ */ new Set()) {
  const n = Ae(e);
  if (Gn(n))
    return iu(n, t) || n;
  if (Array.isArray(n))
    return st(Fi(n));
  if (!n || typeof n != "object" || t.has(n))
    return null;
  t.add(n);
  const r = n, o = Ei(r);
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
    const a = ht(i, t);
    if (a)
      return a;
  }
  for (const [i, a] of Object.entries(r)) {
    if (!wu(i) || !a || typeof a != "object")
      continue;
    const c = ht(a, t);
    if (c)
      return c;
  }
  return null;
}
function Ei(e) {
  return Gn(e) ? e : Array.isArray(e.content) && (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json" || e.type === void 0) ? st({
    type: "doc",
    content: e.content
  }) : (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json") && e.rich != null ? ht(e.rich) : (String(e.format || "").toLowerCase() === "rich_json" || String(e.content?.format || "").toLowerCase() === "rich_json") && e.content?.rich != null ? ht(e.content.rich) : null;
}
function Gn(e) {
  return !!(e && typeof e == "object" && !Array.isArray(e) && e.type === "doc" && Array.isArray(e.content));
}
function Ma(e, t) {
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
    De(t[n]) && (e[n] = n === "rich" ? uw(t[n]) : t[n]);
}
function uw(e) {
  return ht(e) || st(Fi(e)) || st(e) || e;
}
function Wo(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : De(n));
}
function cu(e) {
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
    return t.length > 0 && !_n(t) && !mt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(De) : typeof e != "object" ? !1 : ht(e) ? !0 : Xo(e) ? !1 : Wo(e);
}
function Pi(e) {
  return yt(
    Xt(e),
    e.description || e.title
  );
}
function lw(e) {
  const t = [
    Xt(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = ht(n) || st(Di(n)) || st(it(n)) || st(n);
    if (r)
      return r;
  }
  return null;
}
function yt(e, t = "") {
  const n = it(e), r = st(n), o = r ? Fn(r).trim() : "";
  if (o && !mt(o))
    return o;
  const s = Fn(n).trim();
  if (mt(s))
    return "";
  const i = Fr(s);
  if (i)
    return i;
  if (s && !_n(s))
    return s;
  if (Oi(s)) {
    const l = Fn(
      it(Ae(s))
    ).trim();
    if (l && l !== s && !mt(l))
      return l;
  }
  const a = String(t || "").trim();
  if (mt(a))
    return "";
  const c = Fr(a);
  if (c)
    return c;
  if (!_n(a))
    return a;
  const u = Fn(
    it(Ae(a))
  ).trim();
  return u && u !== a && !mt(u) ? u : "";
}
function mt(e) {
  const t = e.trim();
  return t ? fw(t) || pw(t) : !1;
}
function fw(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function pw(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function Nn(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = it(e);
  return Kr(n, r, t), !wn(n) && r !== e && Kr(n, e, t), Un(n) && _n(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= Il(e, "video").find(
    (o) => o.url === n.videoUrl
  )?.thumbnail), n;
}
function mw(e, t) {
  return {
    text: xe(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function Kr(e, t, n, r = /* @__PURE__ */ new Set(), o = 0) {
  if (o > 12 || t == null)
    return;
  if (typeof t == "string") {
    Da(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const u of t)
      if (Kr(e, u, n, r, o + 1), Un(e))
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
  const s = t, i = gw(e, s, n), a = yt(t, "");
  a && a !== i && !Yt(a) && (e.text ||= a);
  const c = ar(s.url, s.src, s.href);
  if (c && c !== i && Da(e, c, n), e.imageUrl ||= ar(
    s.image,
    s.image_url,
    s.imageUrl,
    Le(s.images),
    Le(s.imageUrls)
  ), e.videoUrl ||= ar(
    s.video,
    s.video_url,
    s.videoUrl,
    Le(s.videos),
    Le(s.videoUrls)
  ), e.audioUrl ||= ar(
    s.audio,
    s.audio_url,
    s.audioUrl,
    Le(s.audios),
    Le(s.audioUrls)
  ), e.fileUrl ||= ar(
    s.file,
    s.file_url,
    s.fileUrl,
    Le(s.files),
    Le(s.fileUrls)
  ), !Un(e)) {
    for (const u of ["output", "result", "content", "body", "data", "rich"])
      if (s[u] && typeof s[u] == "object" && (Kr(e, s[u], n, r, o + 1), Un(e)))
        return;
  }
  if (!e.text && !wn(e) && !Iw(s) && Wo(s))
    try {
      const u = JSON.stringify(t, null, 2);
      fr(u) || (e.text = u);
    } catch {
      const u = String(t);
      fr(u) || (e.text = u);
    }
}
function gw(e, t, n) {
  const r = du(
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
  const o = ar(...hw(t, r));
  return o ? (r === "image" && (e.imageUrl ||= o), r === "video" && (e.videoUrl ||= o), r === "audio" && (e.audioUrl ||= o), r === "file" && (e.fileUrl ||= o), o) : "";
}
function yw(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return du(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function du(...e) {
  for (const t of e) {
    const n = Yo(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function Yo(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function hw(e, t) {
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
    Le(e.images),
    Le(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    Le(e.videos),
    Le(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    Le(e.audios),
    Le(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    Le(e.files),
    Le(e.fileUrls),
    ...n
  ];
}
function Da(e, t, n) {
  const r = t.trim();
  if (!r || mt(r))
    return;
  if (Oi(r)) {
    const a = Ae(r);
    if (a !== r && (Kr(e, a, n), Un(e)))
      return;
    const c = yt(a, "");
    c && !Yt(c) && (e.text ||= c);
    return;
  }
  const o = Fr(r);
  if (o) {
    e.text ||= o;
    return;
  }
  const s = Fn(r);
  if (s && s !== r) {
    e.text ||= s;
    return;
  }
  const i = ww(r, n);
  if (i) {
    bw(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (Yt(r)) {
    const a = Yo(n);
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
function ww(e, t) {
  const n = uu(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const u = xs(r[2]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: ho(e, r[0], r[1])
      };
  }
  const o = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (o) {
    const u = xs(o[1]);
    if (u)
      return {
        kind: "image",
        url: u,
        caption: ho(e, o[0], "")
      };
  }
  const s = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = s.exec(e); ) {
    const u = xs(i[2]), l = Ea(u, n);
    if (l)
      return {
        kind: l,
        url: u,
        caption: ho(e, i[0], i[1])
      };
  }
  const a = Nw(e), c = Ea(a, n);
  return c ? {
    kind: c,
    url: a,
    caption: ho(e, a, "")
  } : null;
}
function uu(e, t) {
  return Yo(t) ? t : _w(e) ? "image" : t;
}
function _w(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function bw(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Ea(e, t) {
  if (!e || !Yt(e))
    return "";
  const n = Yo(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function ho(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !Yt(r) ? r : String(n || "").trim();
}
function xs(e) {
  const t = lu(e);
  return Yt(t) ? t : "";
}
function Nw(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? lu(t[0]) : "";
}
function lu(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Iw(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function wn(e) {
  const t = String(e.text || "").trim();
  return !!(t && !fr(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Sw(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (t && typeof t == "object") {
      const n = xe(
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
function ar(...e) {
  const t = Sw(...e);
  return Yt(t) ? t : "";
}
function Le(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function Yt(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function ir(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function Cw(e, t, n, r) {
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
function vw(e, t) {
  const n = fu(e), r = pu(e, t, n), o = (s) => n.hasResultByNodeId.get(s.id) || !1;
  return {
    ...n,
    ...r,
    runBlockedReasonByNodeId: new Map(
      e.map((s) => [
        s.id,
        zc({
          targets: s.type === "group" ? n.groupMembersById.get(s.id) || [] : [s],
          nodesByID: n.nodeById,
          hasResult: o
        })
      ])
    ),
    highlightedPathEdgesByNodeId: Gw(
      n.nodeById,
      t
    )
  };
}
function fu(e) {
  const t = new Map(e.map((o) => [o.id, o])), n = new Map(
    e.map((o) => [o.id, Rt(o)])
  ), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o.groupId)
      continue;
    const s = r.get(o.groupId) || [];
    s.push(o), r.set(o.groupId, s);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function pu(e, t, n, r = "") {
  const { nodeById: o, groupMembersById: s, hasResultByNodeId: i } = n, a = (_) => {
    const F = o.get(_);
    return F ? F.type === "group" ? s.get(F.id) || [] : [F] : [];
  }, c = /* @__PURE__ */ new Set();
  for (const _ of t) {
    const F = Lr(_);
    if (r && F.targetNodeId !== r)
      continue;
    const { sourceNodeId: D } = F;
    for (const O of a(D))
      c.add(O.id);
  }
  const u = /* @__PURE__ */ new Map();
  for (const _ of e)
    if (c.has(_.id)) {
      const F = Rw(
        _,
        i.get(_.id) || !1
      );
      F && Pa(F).trim() !== "" && u.set(_.id, F);
    }
  const l = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (const _ of t) {
    const { sourceNodeId: F, targetNodeId: D } = Lr(_);
    if (!(r && D !== r || !o.has(D)))
      for (const O of a(F)) {
        if (fc(_) && di(O)) {
          const se = m.get(D) || [];
          se.push({ edge: _, source: O }), m.set(D, se);
        }
        const L = u.get(O.id), H = I.get(D) || /* @__PURE__ */ new Set();
        if (!L || H.has(O.id))
          continue;
        H.add(O.id), I.set(D, H);
        const Y = l.get(D) || [];
        Y.push(L), l.set(D, Y);
      }
  }
  const N = /* @__PURE__ */ new Map();
  for (const [_, F] of l)
    N.set(_, {
      sources: F,
      text: F.map(Pa).join(`

`)
    });
  return {
    inputContextByNodeId: N,
    incomingMediaReferencesByNodeId: m
  };
}
function Lr(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function mu(e, t, n) {
  const r = [];
  for (const o of t) {
    if (!fc(o))
      continue;
    const s = Lr(o);
    if (s.targetNodeId === n)
      for (const i of mc(
        e,
        s.sourceNodeId
      ))
        di(i) && r.push({ edge: o, source: i });
  }
  return r;
}
function gu(e, t, n) {
  const r = fu(t);
  return pu(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function Rw(e, t) {
  if (!t)
    return null;
  const n = Xt(e), r = Nn(
    n,
    Go(e, n)
  );
  return wn(r) || (r.text = yt(
    n,
    e.description || e.title
  )), {
    nodeId: e.id,
    title: e.title,
    type: e.type,
    output: n,
    preview: r,
    resultRef: e.resultRef
  };
}
function kw(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const o = t.sources[r];
    return n.nodeId === o.nodeId && n.title === o.title && n.type === o.type && n.output === o.output && n.resultRef === o.resultRef && n.preview.text === o.preview.text && n.preview.imageUrl === o.preview.imageUrl && n.preview.videoUrl === o.preview.videoUrl && n.preview.audioUrl === o.preview.audioUrl && n.preview.fileUrl === o.preview.fileUrl;
  });
}
function Pa(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || bu(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function Xt(e) {
  return xw(
    Nl(e.asset?.version?.content, e.resultOutput)
  );
}
function xw(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = yu(n);
    if (r !== void 0)
      return r;
    const o = hu(n);
    if (o)
      return { text: o };
    const s = Oo(n) || it(n);
    if (De(s) || Bi(s))
      return s;
  }
  if (t !== void 0)
    return Oo(t) || it(t);
}
function yu(e) {
  const t = Ae(e), n = Gn(t) ? t : ht(t);
  if (!n)
    return;
  const r = dw(n).trim();
  if (!_n(r))
    return;
  const o = tc(r);
  if (o === r)
    return;
  const s = it(o);
  if (De(s) || Bi(s))
    return s;
}
function hu(e) {
  const t = Ae(e), n = Gn(t) ? t : ht(t);
  return Qa(n);
}
function it(e) {
  const t = Ae(e), n = Xr(t);
  if (n !== t)
    return it(n);
  if (cu(t))
    return t;
  if (zi(t)) {
    const s = Hs(t);
    if (De(s))
      return s;
  }
  const r = Ho(t);
  if (r)
    return r.rich;
  if (Gn(t))
    return t;
  const o = ht(t);
  return o || Fi(jo(t, /* @__PURE__ */ new Set()));
}
function jo(e, t) {
  if (!e || typeof e != "object" || t.has(e))
    return e;
  t.add(e);
  const n = e, r = _u(n);
  if (r !== void 0)
    return r;
  const o = Tw(n, t);
  if (o !== void 0)
    return o;
  for (const s of Aw) {
    const i = Pe(n, s);
    if (i === void 0 || i === e)
      continue;
    const a = jo(
      Ae(i),
      t
    );
    if (Ws(a))
      return a;
  }
  if (Xo(n))
    for (const s of ["output", "result", "data", "body"]) {
      if (n[s] === void 0 || n[s] === e)
        continue;
      const i = jo(
        Ae(n[s]),
        t
      );
      if (Ws(i))
        return i;
    }
  return e;
}
function Tw(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!wu(n) || !r || typeof r != "object")
      continue;
    const o = jo(Ae(r), t);
    if (Ws(o))
      return o;
  }
}
function wu(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const Aw = [
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
function _u(e) {
  const t = Ei(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Ae(e.content);
    if (n && typeof n == "object") {
      const r = _u(n);
      if (r !== void 0)
        return r;
    }
  }
}
function Fi(e) {
  const t = Ae(e);
  return t && typeof t == "object" && !Array.isArray(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function Xo(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function Ws(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !_n(n) && !mt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (typeof e != "object" || ht(e) || st(e))
    return !0;
  if (Xo(e))
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
    const r = Mw(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function Mw(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let o = r + n.length;
  for (; o < e.length && /\s/.test(e[o] || ""); )
    o += 1;
  let s = o;
  for (; s < e.length; ) {
    const i = e.indexOf("```", s), a = i >= 0 ? e.slice(o, i) : e.slice(o), c = Dw(a, t === "json");
    if (c)
      return c;
    if (i < 0)
      return;
    s = i + 3;
  }
}
function Dw(e, t = !1) {
  const n = e.trim(), r = vl(n);
  for (const o of Rl([n, r])) {
    const s = Ae(o);
    if (s !== o && (t ? Ew(s) : zi(s)))
      return s;
  }
  return null;
}
function Ew(e) {
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
function zi(e) {
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
function Oi(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function _n(e) {
  const t = String(e || "").trim();
  return !!(t && (Oi(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function bu(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return mt(e) ? "" : e;
  const t = Fn(e).trim();
  if (t && mt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return fr(n) ? "" : n;
  } catch {
    const n = String(e);
    return mt(n) ? "" : n;
  }
}
function Bi(e) {
  const t = bu(e).trim();
  return !!(t && !fr(t));
}
function fr(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || mt(t);
}
function Ys(e, t) {
  return of(e, t);
}
function Fa(e, t) {
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
    const i = Lr(s);
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
function Xs(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function Zs(e, t) {
  return e.type === "asset" && Xs(e) === t;
}
function za(e, t, n, r) {
  const o = new Map(e.map((s) => [s.id, s]));
  if (r)
    for (const s of t) {
      if (s.from !== r)
        continue;
      const i = o.get(s.to);
      if (i && Zs(i, n))
        return i;
    }
  return e.find((s) => Zs(s, n)) || null;
}
function Oa(e, t, n, r, o) {
  const s = /* @__PURE__ */ new Set();
  if (!r || !n)
    return s;
  const i = new Map(e.map((a) => [a.id, a]));
  for (const a of t) {
    if (a.from !== r || a.to === o)
      continue;
    const c = i.get(a.to);
    c && Zs(c, n) && s.add(c.id);
  }
  return s;
}
function Ts(e, t) {
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
function Pw(e) {
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
function Fw(e) {
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
function Ba(e, t) {
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
  return bc({
    assetCateId: t,
    nextNodeNo: e.nextNodeNo,
    nodes: r ? o : e.nodes,
    edges: s.length === e.edges.length ? e.edges : s,
    viewport: e.viewport || {},
    updatedAt: e.updatedAt
  });
}
function zw(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      Nu(r, t)
    ])
  );
}
function Nu(e, t) {
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
      (o) => Ow(o, n, r)
    )
  };
}
function Ow(e, t, n) {
  const r = Bw(e), o = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!o)
    return e;
  const s = Us(e, o), i = Number(s.resultRef?.run_id || 0), a = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...s,
    ...e.runError && i > a ? { runError: "" } : {},
    asset: o
  };
}
function Bw(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function ja(e, t) {
  return e === t || e.assetCateId === t.assetCateId && Iu(e.nodes, t.nodes) && Su(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function Iu(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function jw(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.staleCount === t.staleCount && e.status === t.status;
}
function Su(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const o = t[r];
    return n === o || n.id === o.id && n.from === o.from && n.to === o.to && (n.logicalFrom || "") === (o.logicalFrom || "") && (n.logicalTo || "") === (o.logicalTo || "") && (n.purpose || "") === (o.purpose || "") && (n.executionMode || "auto") === (o.executionMode || "auto") && (n.mediaUsage || "") === (o.mediaUsage || "");
  });
}
function $w(e, t) {
  return Ys(e, t) ? { source: e.id, target: t.id } : Ys(t, e) ? { source: t.id, target: e.id } : null;
}
function Uw(e) {
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
function Vw(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function Kw(e, t, n) {
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
function Lw(e, t, n, r, o, s, i) {
  const a = e.id === o, c = s.has(e.id), u = a || c || e.source === n || e.target === n || e.source === r || e.target === r, l = e.source === n || e.target === n ? n : r;
  return {
    highlighted: u,
    selected: a,
    highlightColor: u ? Hw(
      t.get(
        c ? i : l
      )
    ) : "var(--ws-edge)"
  };
}
function qw(e, t, n) {
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
function Gw(e, t) {
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
      l && Fc(l) || a.push(...n.get(u.to) || []);
    }
    s.size > 0 && r.set(o.id, s);
  }
  return r;
}
function Hw(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function Ww(e) {
  const t = e?.changedTouches?.[0] || e?.touches?.[0];
  return t ? { x: t.clientX, y: t.clientY } : typeof e?.clientX == "number" && typeof e?.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function Yw(e) {
  return e instanceof HTMLElement ? !!e.closest("input, textarea, select, [contenteditable='true']") : !1;
}
function $a(e) {
  return !e.repeat && (e.key === "Delete" || e.key === "Backspace") && !Yw(e.target);
}
function Xw(e) {
  return e === "start" ? Gr : e === "import" ? cl : e === "display" ? ti : Xa;
}
function Zw(e) {
  return e.type !== "function" ? !1 : e.functionOption?.key === "start" || e.title === "开始";
}
function Cu(e) {
  if (e.type !== "function")
    return !1;
  const t = e.functionOption?.key || "";
  return t === "import" || t === "save" || t === "display";
}
function ji(e) {
  return Cu(e) && Rt(e);
}
function Jw(e) {
  return {
    description: e
  };
}
function Qw(e, t) {
  return {
    ...Jw(t),
    resultRef: To({
      ...e,
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Ua = { width: 620, height: 420 }, $i = 44;
function vu(e) {
  if (e.type === "function") {
    if (ji(e)) {
      if (!Ac(e))
        return { width: e.width, height: e.height };
      const n = Va(e);
      return n ? {
        width: n.width,
        height: n.height + $i
      } : t_(e);
    }
    return { width: 128, height: 46 };
  }
  const t = Va(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Va(e) {
  if (!Ac(e) || !e_(e))
    return null;
  const t = qn(e);
  return jl(
    dn(e),
    Uo(t)
  ) ? {
    width: Math.max(e.width, Ua.width),
    height: Math.max(e.height, Ua.height)
  } : null;
}
function e_(e) {
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
function t_(e) {
  const t = qn(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = Ko({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + $i
  };
}
function Oe({
  id: e,
  type: t,
  position: n,
  className: r,
  style: o
}) {
  return /* @__PURE__ */ d(
    ju,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: o,
      children: /* @__PURE__ */ d("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ d(Ga, { size: 12 }) : /* @__PURE__ */ d(Ha, { size: 12 }) })
    }
  );
}
function Gt({
  node: e,
  selected: t
}) {
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && ji(e), r = /* @__PURE__ */ d(
    Xp,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const o = vt(e.runningNode);
    return /* @__PURE__ */ A(mn, { children: [
      r,
      /* @__PURE__ */ d(
        Jm,
        {
          node: e,
          running: o,
          onRun: () => {
            o || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((s) => {
              Z.error(
                s instanceof Error ? s.message : "流程运行失败"
              );
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !Js(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ A(mn, { children: [
    r,
    /* @__PURE__ */ d(
      Ue,
      {
        fallback: /* @__PURE__ */ d(Ve, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ d(Ey, { node: e }, e.id)
      }
    )
  ] });
}
function Js(e) {
  return e.type === "agent" ? !0 : e.type === "power" && !yl(e.power, e.kind, e.outputType);
}
function Dr({
  node: e,
  onShowNodeDetail: t
}) {
  return !t || !Rt(e) ? null : /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: "ws-node-quick-view nodrag nopan",
      "aria-label": "查看详情",
      onPointerEnter: Vr,
      onFocus: Vr,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ d(ti, { size: 14 })
    }
  );
}
const n_ = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function As({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = Or(
    e.resultView || n_
  ), {
    width: o,
    height: s,
    offsetX: i,
    offsetY: a
  } = r, [c, u] = K(r), [l, m] = K(!1);
  de(() => {
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
  const I = e.type === "agent" ? t?.agent : void 0, N = om(I);
  if (!Rt(e) && !N)
    return null;
  const _ = qn(e), F = Pi(e), D = xe(
    yt(_.text, ""),
    yt(F, ""),
    yt(e.description, ""),
    e.title,
    "暂无结果"
  ), O = Mi(e), L = dn(e), H = De(L) ? L : O ? { rich: O } : D, Y = Un(_) ? _ : mw(
    _,
    Nn(D, uu(D, ""))
  ), se = e.interactive, R = ge(
    e.resultOutput,
    e.asset?.version?.content
  ), v = e.type === "agent" ? async (T) => {
    if (!vt(t))
      try {
        await e.onRunBackendNode(e, { agentInput: T });
      } catch (W) {
        Z.error(
          W instanceof Error ? W.message : "智能体继续运行失败"
        );
      }
  } : void 0;
  return /* @__PURE__ */ d(Ue, { fallback: /* @__PURE__ */ d(Ve, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    kd,
    {
      output: H,
      fallback: D,
      preview: Y,
      mediaLabel: qr(Y),
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
      onOpenIntent: Vr,
      resizeControls: /* @__PURE__ */ d(
        Zp,
        {
          value: c,
          enabled: se,
          onResizeStart: () => {
            m(!0), e.onNodeResizeStart(e.id);
          },
          onResize: u,
          onResizeEnd: (T) => {
            u(T), m(!1), e.onResultViewResizeEnd(e.id, T);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ d(
        Ue,
        {
          fallback: /* @__PURE__ */ d(Ve, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ d(
            My,
            {
              output: R,
              runtime: I,
              fallback: D,
              running: vt(t),
              onContinue: v
            }
          )
        }
      ) : void 0
    }
  ) });
}
function r_({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = qn(e), o = Mi(e), s = dn(e), i = xe(
    Pi(e),
    yt(r.text, ""),
    yt(e.description, ""),
    "暂无内容"
  ), a = De(s) ? s : o ? { rich: o } : i, c = !cr(a, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), u = c && !r.audioUrl ? Io(
    e,
    e.onNodeResult,
    $i
  ) : void 0;
  return /* @__PURE__ */ d(Ue, { fallback: /* @__PURE__ */ d(Ve, { label: "正在加载节点结果" }), children: /* @__PURE__ */ d(
    kd,
    {
      output: a,
      fallback: i,
      preview: r,
      mediaLabel: qr(r),
      className: `ws-node-function-result-card ${c ? "has-media" : ""}`,
      customContentIsPureMedia: c,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Vr,
      children: c ? /* @__PURE__ */ d(
        Ru,
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
function Ms({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = jn(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (s) => s.status === "pending"
  ).length, o = [...n].reverse().find((s) => s.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ A(
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
        /* @__PURE__ */ d(al, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ d("span", { children: n.length }) : null
      ]
    }
  );
}
function o_(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function Rt(e) {
  if (!s_(e) || !o_(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = Xt(e);
  if (t == null)
    return !1;
  const n = Nn(
    t,
    Go(e, t)
  );
  return wn(n) || Bi(t);
}
function s_(e) {
  return e.type !== "function" ? !0 : Cu(e);
}
async function i_(e) {
  const t = e.node.functionOption?.key || "", n = a_(e.inputContext);
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
    ), Z.success("已展示上游结果"), !0;
  }
  if (t === "save") {
    if (n == null)
      throw new Error("保存节点没有可保存的上游结果");
    const r = await nw({
      projectId: e.projectId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: d_(e.node, e.inputContext),
      kind: dm(e.node),
      content: n,
      nodeKey: e.node.id,
      requestId: Hh(
        "save",
        e.node.id,
        n
      ),
      source: c_(e.inputContext),
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
    ), Z.success("资产已保存"), !0;
  }
  return t === "start" ? (await e.onRunStartNode(e.node), !0) : t === "import" ? (e.onOpenImportPicker(e.node.id), !0) : (e.onNodeResult(
    e.node.id,
    fn(
      e.node,
      { output: "操作已应用" },
      "操作已应用"
    )
  ), Z.success("操作已应用"), !0);
}
function Ui(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function a_(e) {
  const t = Ui(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function c_(e) {
  const t = Ui(e);
  return gm(t);
}
function d_(e, t) {
  const n = Ui(t);
  return xe(n?.title, e.title, "画布资产");
}
function u_({
  prompt: e,
  running: t,
  readonly: n,
  history: r,
  activeRecordId: o,
  onSelectRecord: s,
  onClose: i,
  onSubmit: a
}) {
  const c = ue(
    () => f_(e),
    [e]
  );
  if (typeof document > "u")
    return null;
  const u = document.querySelector(".ws-page") || document.body;
  return Mu(
    /* @__PURE__ */ d("div", { className: "ws-flow-feedback-backdrop", onMouseDown: i, children: /* @__PURE__ */ A(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (l) => l.stopPropagation(),
        children: [
          /* @__PURE__ */ A("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ A("div", { children: [
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
                children: /* @__PURE__ */ d(Ya, { size: 18 })
              }
            )
          ] }),
          r && r.length > 1 ? /* @__PURE__ */ d("div", { className: "ws-flow-feedback-tabs", children: r.map((l, m) => /* @__PURE__ */ A(
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
          /* @__PURE__ */ d("div", { className: "ws-flow-feedback-body custom-scrollbar", children: /* @__PURE__ */ d(Ue, { fallback: /* @__PURE__ */ d(Ve, { label: "正在加载交互表单" }), children: /* @__PURE__ */ d(
            Sy,
            {
              interaction: c,
              disabled: t,
              readonly: n,
              hideHeader: !0,
              layout: "dialog",
              initialData: n ? e.values : void 0,
              onSubmit: (l) => a(
                l_(e, c, l.data)
              )
            }
          ) }) }),
          n ? /* @__PURE__ */ d("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ A(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: i,
              children: [
                /* @__PURE__ */ d(ni, { size: 16 }),
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
function l_(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function f_(e) {
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
function p_(e) {
  const t = Pn(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Ka(e, t) {
  if (!e)
    return;
  const n = Pn(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function m_(e) {
  return e.type === "function" && e.functionOption?.key === "start";
}
function g_(e) {
  return e.type === "function" && e.functionOption?.key === "start" ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function y_(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const o = n.filter(Lo), s = o.filter(
    (a) => a.storyboardItem?.stale || !Rt(a)
  ), i = s.length > 0 ? s : o;
  await Vp(i, r);
}
function h_({ data: e, selected: t }) {
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
    onOpenStoryboardGridImport: _,
    onRunBackendNode: F,
    structureLocked: D,
    storyboardSourceNode: O
  } = e, L = n.type === "power" ? Ln(n.power, n.kind, n.outputType) : null, H = L?.viewMode === "storyboard", Y = L?.viewMode === "storyboard_grid", se = L?.viewMode === "video_compose";
  if (n.type === "group") {
    const R = n.groupMembers, v = n.storyboardFrameRunning, T = n.groupRuntime || Oc({
      members: R,
      runningNodes: zd,
      groupState: s,
      hasResult: Rt
    }), W = n.runBlockedReason;
    let pe;
    return !W && !v && (pe = () => {
      i((re) => ({
        ...re,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: 8,
          status: "running"
        }
      })), y_(
        n,
        r,
        R,
        F
      ).then(() => {
        i((re) => On(re, n.id));
      }).catch((re) => {
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
        })), Z.error(
          re instanceof Error ? re.message : "分组运行失败"
        ), window.setTimeout(() => {
          i((he) => On(he, n.id));
        }, 1400);
      });
    }), /* @__PURE__ */ d(Ue, { fallback: /* @__PURE__ */ d(Ve, { label: "正在加载分组" }), children: /* @__PURE__ */ A(
      hy,
      {
        node: n,
        memberCount: T.memberCount,
        runnableCount: T.runnableCount,
        completedCount: T.completedCount,
        failedCount: T.failedCount,
        staleCount: T.staleCount,
        status: T.status,
        frameRunning: v,
        selected: t,
        managed: D,
        onRename: D ? void 0 : (re) => c(n.id, { title: re, titleMode: "manual" }),
        onEditStructure: O ? () => a(
          O,
          Id(n)
        ) : void 0,
        onRun: pe,
        runBlockedReason: W,
        children: [
          /* @__PURE__ */ d(
            Oe,
            {
              id: "input-0",
              type: "target",
              position: ze.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ d(
            Oe,
            {
              id: "output-0",
              type: "source",
              position: ze.Right,
              className: "is-out"
            }
          ),
          /* @__PURE__ */ d(Gt, { node: n, selected: t })
        ]
      }
    ) });
  }
  if (n.type === "agent") {
    const R = vt(s) || s?.status === "success";
    return /* @__PURE__ */ A(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${R ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ d(
            Oe,
            {
              id: "input-0",
              type: "target",
              position: ze.Left,
              className: "is-in",
              style: { left: "4px" }
            }
          ),
          /* @__PURE__ */ d(
            Oe,
            {
              id: "output-0",
              type: "source",
              position: ze.Right,
              className: "is-out",
              style: { right: "4px" }
            }
          ),
          /* @__PURE__ */ A("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ d(ol, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ d(
              ws,
              {
                className: "ws-node-circle-title",
                title: n.title,
                onRename: c ? (v) => c(n.id, { title: v, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          R ? /* @__PURE__ */ A(
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
            Ms,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          /* @__PURE__ */ d(
            As,
            {
              node: n,
              runningNode: s,
              onShowNodeDetail: a
            }
          ),
          /* @__PURE__ */ d(Gt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "flow") {
    const R = vt(s) || s?.status === "success";
    return /* @__PURE__ */ A(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${R ? "is-running" : ""}`,
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
          R ? /* @__PURE__ */ A(
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
          /* @__PURE__ */ A("div", { className: "ws-node-flow-content", children: [
            /* @__PURE__ */ d("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ d(sl, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ d(
              ws,
              {
                className: "ws-node-flow-title",
                title: n.title,
                onRename: c ? (v) => c(n.id, { title: v, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ d(
            Oe,
            {
              id: "input-0",
              type: "target",
              position: ze.Left,
              className: "is-in",
              style: { left: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            Oe,
            {
              id: "output-0",
              type: "source",
              position: ze.Right,
              className: "is-out",
              style: { right: "11px" }
            }
          ),
          /* @__PURE__ */ d(
            Ms,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          /* @__PURE__ */ d(As, { node: n, onShowNodeDetail: a }),
          /* @__PURE__ */ d(Gt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "function") {
    const R = n.functionOption?.key || (n.title.includes("保存") ? "save" : ""), v = R === "start", T = Xw(R), { onRunFunctionNode: W, requestConfirm: pe } = n, re = vt(s), he = v && n.canvasHasRunningNode, oe = re, ne = ji(n), be = ne ? { left: "0px", top: "19px" } : { left: "0px" }, Ce = ne ? { left: "128px", right: "auto", top: "19px" } : { right: "0px" }, le = (q) => {
      i((wt) => ({
        ...wt,
        [n.id]: {
          nodeId: n.id,
          title: n.title,
          startedAt: Date.now(),
          progress: q === "success" ? 100 : q === "error" ? 92 : 0,
          status: q
        }
      })), q !== "running" && q !== "waiting" && window.setTimeout(
        () => i((wt) => On(wt, n.id)),
        q === "success" ? 650 : 1200
      );
    }, ae = () => {
      const q = !v;
      q && le("running"), W(n).then(() => {
        q && le("success");
      }).catch((wt) => {
        q && le("error"), Z.error(wt instanceof Error ? wt.message : "执行出错");
      });
    }, Fe = () => {
      if (!(oe || he)) {
        if (m_(n)) {
          pe({
            title: `执行「${n.title}」`,
            description: g_(n),
            confirmText: "执行",
            onConfirm: ae
          });
          return;
        }
        ae();
      }
    }, In = (q) => {
      q.preventDefault(), q.stopPropagation(), Fe();
    };
    return /* @__PURE__ */ A(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${oe ? "is-running" : ""} ${ne ? "has-result-card" : ""} is-${R || "default"}`,
        children: [
          /* @__PURE__ */ A(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": oe || he,
              onClick: In,
              onKeyDown: (q) => {
                q.key !== "Enter" && q.key !== " " || (q.preventDefault(), q.stopPropagation(), Fe());
              },
              children: [
                /* @__PURE__ */ d("div", { className: "ws-node-function-icon", children: re ? /* @__PURE__ */ d(gn, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ d(
                  T,
                  {
                    size: 15,
                    fill: v ? "currentColor" : "none"
                  }
                ) }),
                /* @__PURE__ */ d("span", { className: "ws-node-function-title", children: re ? s?.status === "waiting" ? "等待中" : "运行中" : n.title })
              ]
            }
          ),
          ne ? /* @__PURE__ */ d(
            r_,
            {
              node: n,
              running: oe,
              onShowNodeDetail: a
            }
          ) : null,
          /* @__PURE__ */ d(
            Oe,
            {
              id: "input-0",
              type: "target",
              position: ze.Left,
              className: "is-in",
              style: be
            }
          ),
          /* @__PURE__ */ d(
            Oe,
            {
              id: "output-0",
              type: "source",
              position: ze.Right,
              className: "is-out",
              style: Ce
            }
          ),
          /* @__PURE__ */ d(
            Ms,
            {
              node: n,
              onOpenFeedbackRecord: u
            }
          ),
          ne ? null : /* @__PURE__ */ d(As, { node: n, onShowNodeDetail: a }),
          /* @__PURE__ */ d(Gt, { node: n, selected: t })
        ]
      }
    );
  }
  if (n.type === "asset") {
    if (n.kind === "image") {
      const ne = Rs(n), be = dn(n), Ce = cr(be, ne), le = Io(n, c), ae = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        ne.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ A("div", { className: ae, children: [
        /* @__PURE__ */ A("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(Ki, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "图片资产" })
        ] }),
        /* @__PURE__ */ d("div", { className: "ws-node-image-container ws-node-content-container", children: Ce ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
          dr,
          {
            output: be,
            fallback: ne.text || n.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : ne.imageUrl ? /* @__PURE__ */ d(
          Qs,
          {
            src: ne.imageUrl,
            alt: n.title,
            className: "ws-node-image-raw",
            onMediaSize: le
          }
        ) : /* @__PURE__ */ A("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ d(Ki, { size: 24 }),
          /* @__PURE__ */ d("span", { children: ne.text || n.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ d(
          Oe,
          {
            id: "input-0",
            type: "target",
            position: ze.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          Oe,
          {
            id: "output-0",
            type: "source",
            position: ze.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Dr,
          {
            node: n,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ d(Gt, { node: n, selected: t })
      ] });
    }
    if (n.kind === "video") {
      const ne = Rs(n), be = dn(n), Ce = cr(be, ne), le = Io(n, c), ae = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        ne.videoUrl || ne.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ A("div", { className: ae, children: [
        /* @__PURE__ */ A("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ d(Li, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ d("span", { children: n.title || "视频资产" })
        ] }),
        /* @__PURE__ */ A("div", { className: "ws-node-video-container ws-node-content-container", children: [
          Ce ? /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
            dr,
            {
              output: be,
              fallback: ne.text || n.description || "视频资产",
              mediaGridKind: "video",
              className: "ws-canvas-content-view"
            }
          ) }) : ne.videoUrl ? /* @__PURE__ */ d(
            So,
            {
              src: ne.videoUrl,
              poster: ne.videoPosterUrl,
              className: "ws-node-video-raw",
              onMediaSize: le
            },
            ne.videoUrl
          ) : ne.imageUrl ? /* @__PURE__ */ d(
            Qs,
            {
              src: ne.imageUrl,
              alt: n.title,
              className: "ws-node-video-raw",
              onMediaSize: le
            }
          ) : /* @__PURE__ */ A("div", { className: "ws-node-image-empty", children: [
            /* @__PURE__ */ d(Li, { size: 24 }),
            /* @__PURE__ */ d("span", { children: ne.text || n.description || "视频资产" })
          ] }),
          Ce ? null : /* @__PURE__ */ d("div", { className: "ws-node-video-play", children: /* @__PURE__ */ d("div", { children: /* @__PURE__ */ d(Gr, { size: 14, fill: "currentColor" }) }) })
        ] }),
        /* @__PURE__ */ d(
          Oe,
          {
            id: "input-0",
            type: "target",
            position: ze.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ d(
          Oe,
          {
            id: "output-0",
            type: "source",
            position: ze.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ d(
          Dr,
          {
            node: n,
            onShowNodeDetail: a
          }
        ),
        /* @__PURE__ */ d(Gt, { node: n, selected: t })
      ] });
    }
    const R = Rs(n), v = Mi(n), T = dn(n), W = Pi(n), pe = De(T) ? T : v ? { rich: v } : W || R.text, re = cr(pe, R), he = !!(R.imageUrl || R.videoUrl || R.audioUrl), oe = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      he ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ A("div", { className: oe, children: [
      /* @__PURE__ */ A("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(il, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ d("span", { children: n.title })
      ] }),
      /* @__PURE__ */ d("div", { className: "ws-node-text-card", children: !re && R.imageUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        "img",
        {
          src: R.imageUrl,
          alt: qr(R) || n.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !re && R.videoUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media", children: /* @__PURE__ */ d(
        So,
        {
          src: R.videoUrl,
          poster: R.videoPosterUrl
        },
        R.videoUrl
      ) }) : !re && R.audioUrl ? /* @__PURE__ */ d("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ d(
        Ue,
        {
          fallback: /* @__PURE__ */ d(Ve, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ d(ec, { src: R.audioUrl })
        }
      ) }) : !re && R.fileUrl ? /* @__PURE__ */ A("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ d(ri, { size: 16 }),
        /* @__PURE__ */ d("span", { children: qr(R) || "文件内容" })
      ] }) : /* @__PURE__ */ d("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ d(
        dr,
        {
          output: pe,
          fallback: W || R.text || "暂无内容",
          mediaGridKind: Uo(R),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ d(
        Oe,
        {
          id: "input-0",
          type: "target",
          position: ze.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        Oe,
        {
          id: "output-0",
          type: "source",
          position: ze.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ d(
        Dr,
        {
          node: n,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ d(Gt, { node: n, selected: t })
    ] });
  }
  if (n.type === "power") {
    const R = vt(s), v = si(n.power, n.kind), T = Y ? ii(
      R ? [s?.streamOutput, ks(n)] : ks(n)
    ) : null, W = Rt(n), pe = R ? "running" : s?.status === "error" ? "error" : s?.status === "success" && !W ? "running" : W ? "complete" : "empty", re = !!(!H && !Y && !se && s?.streamStarted && (s.streamText || s.streamOutput) && s.status !== "success"), he = re ? s?.streamOutput ? Nn(s.streamOutput, "audio") : {
      text: s?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : qn(n), oe = re ? s?.streamOutput || { text: s?.streamText || "" } : dn(n), ne = H || Y || se || re || W, be = !H && !Y && !se && !!(he.imageUrl || he.videoUrl || he.audioUrl || he.fileUrl), Ce = Io(n, c), le = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      R ? "is-running" : "",
      n.runError && !R ? "is-error" : "",
      H ? "is-storyboard" : "",
      Y ? "is-storyboard-grid" : "",
      se ? "is-video-compose" : "",
      v ? "is-audio" : "",
      ne ? "has-content" : "",
      be ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ A("div", { className: le, children: [
      /* @__PURE__ */ A("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ d(
          hl,
          {
            power: n.power,
            kind: n.kind,
            outputType: n.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ d(
          ws,
          {
            title: n.title,
            onRename: c && !D ? (ae) => c(n.id, { title: ae, titleMode: "manual" }) : void 0
          }
        ),
        n.storyboardItem?.stale ? /* @__PURE__ */ d(Me, { label: "上游素材或提示词已变化；当前结果仍可使用，重新运行可更新", children: /* @__PURE__ */ d("span", { className: "ws-node-stale-badge", children: "可更新" }) }) : null,
        id(n) ? /* @__PURE__ */ d("span", { className: "ws-node-prompt-override-badge", children: "提示词已修改" }) : null
      ] }),
      /* @__PURE__ */ A("div", { className: "ws-node-power-card", children: [
        R ? /* @__PURE__ */ A("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
          Ue,
          {
            fallback: /* @__PURE__ */ d(Ve, { label: "正在加载视频合成" }),
            children: /* @__PURE__ */ d(
              $y,
              {
                composition: n.composerDraft?.videoComposition,
                referenceItems: l.filter(
                  (ae) => ae.source !== "current" || ae.id !== n.id
                ),
                connectedMediaReferences: m,
                running: R,
                onChange: N ? (ae) => N(n.id, {
                  ...n.composerDraft || {},
                  videoComposition: ae
                }) : void 0,
                onConnectedMediaEdgeRemove: I,
                onRun: F ? (ae) => {
                  F({
                    ...n,
                    composerDraft: {
                      ...n.composerDraft || {},
                      videoComposition: ae
                    }
                  }).catch(
                    (Fe) => Z.error(
                      Fe instanceof Error ? Fe.message : "视频合成失败"
                    )
                  );
                } : void 0,
                onOpenDetail: a ? () => a(n) : void 0
              }
            )
          }
        ) : H ? /* @__PURE__ */ d(
          Ue,
          {
            fallback: /* @__PURE__ */ d(Ve, { label: "正在加载分镜内容", compact: !0 }),
            children: /* @__PURE__ */ d(
              zy,
              {
                output: R ? s?.streamText || "" : ks(n),
                status: pe,
                started: !!s?.streamStarted,
                generatedShotCount: s?.generatedCount || 0,
                referenceItems: l.filter(
                  (ae) => ae.source !== "current" || ae.id !== n.id
                ),
                onOpenDetail: W && a ? () => a(n) : void 0
              }
            )
          }
        ) : Y ? /* @__PURE__ */ d(
          Ue,
          {
            fallback: /* @__PURE__ */ d(Ve, { label: "正在加载分镜宫格", compact: !0 }),
            children: /* @__PURE__ */ d(
              By,
              {
                grid: T,
                aspectRatio: ow(n),
                running: R,
                layout: n.composerDraft?.storyboardGridLayout,
                onLayoutChange: N ? (ae) => N(n.id, {
                  ...n.composerDraft || {},
                  storyboardGridLayout: ae
                }) : void 0,
                onImport: _ ? () => _(n.id) : void 0,
                onFrameImport: _ ? (ae, Fe) => _(n.id, Fe) : void 0,
                onSlotImport: _ ? (ae) => _(n.id, ae) : void 0,
                onEdit: T && a ? () => a(n) : void 0
              }
            )
          }
        ) : ne ? /* @__PURE__ */ d(
          Ru,
          {
            preview: he,
            output: oe,
            fallback: n.description,
            streaming: R && re,
            generating: R && be && !re,
            onMediaSize: Ce
          }
        ) : /* @__PURE__ */ d(b_, {})
      ] }),
      n.runError && !R ? /* @__PURE__ */ d(
        w_,
        {
          projectId: o,
          node: n,
          onOpenDetail: a ? () => a(n) : void 0
        }
      ) : null,
      /* @__PURE__ */ d(
        Oe,
        {
          id: "input-0",
          type: "target",
          position: ze.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ d(
        Oe,
        {
          id: "output-0",
          type: "source",
          position: ze.Right,
          className: "is-out"
        }
      ),
      H || Y || se ? null : /* @__PURE__ */ d(
        Dr,
        {
          node: n,
          onShowNodeDetail: a
        }
      ),
      /* @__PURE__ */ d(Gt, { node: n, selected: t })
    ] });
  }
  return /* @__PURE__ */ A("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ d(
      Oe,
      {
        id: "input-0",
        type: "target",
        position: ze.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ d(
      Oe,
      {
        id: "output-0",
        type: "source",
        position: ze.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ d("div", { className: "ws-node-title", children: n.title }),
    /* @__PURE__ */ d("div", { className: "ws-node-desc", children: n.description }),
    /* @__PURE__ */ d(Dr, { node: n, onShowNodeDetail: a }),
    /* @__PURE__ */ d(Gt, { node: n, selected: t })
  ] });
}
function w_({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = ly(e, t), o = /* @__PURE__ */ A(mn, { children: [
    /* @__PURE__ */ d(dl, { size: 14 }),
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
function Ru({
  preview: e,
  output: t,
  fallback: n,
  streaming: r,
  generating: o = !1,
  onMediaSize: s,
  showMediaCaption: i = !0
}) {
  const a = G(null), c = G(!0), u = i ? qr(e) : "", l = cr(t, e);
  return de(() => {
    if (!r) {
      c.current = !0;
      return;
    }
    const m = a.current;
    !m || !c.current || (m.scrollTop = m.scrollHeight);
  }, [e.text, r]), !l && e.imageUrl ? /* @__PURE__ */ A(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          Qs,
          {
            src: e.imageUrl,
            alt: u || "生成图片",
            onMediaSize: s
          }
        ),
        u ? /* @__PURE__ */ d("p", { children: u }) : null,
        /* @__PURE__ */ d(Ds, { active: o })
      ]
    }
  ) : !l && e.videoUrl ? /* @__PURE__ */ A(
    "div",
    {
      className: `ws-node-generated-media ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          So,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            onMediaSize: s
          },
          e.videoUrl
        ),
        u ? /* @__PURE__ */ d("p", { children: u }) : null,
        /* @__PURE__ */ d(Ds, { active: o })
      ]
    }
  ) : !l && e.audioUrl ? /* @__PURE__ */ A(
    "div",
    {
      className: `ws-node-generated-media is-audio ${o ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ d(
          Ue,
          {
            fallback: /* @__PURE__ */ d(Ve, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ d(ec, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ d(Ds, { active: o })
      ]
    }
  ) : !l && e.fileUrl ? /* @__PURE__ */ A("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ d(ri, { size: 16 }),
    /* @__PURE__ */ d("span", { children: u || "文件内容" })
  ] }) : /* @__PURE__ */ d(
    "div",
    {
      ref: a,
      className: "ws-node-generated-text ws-node-scroll-content nowheel",
      onScroll: (m) => {
        const I = m.currentTarget;
        c.current = I.scrollHeight - I.scrollTop - I.clientHeight < 12;
      },
      children: /* @__PURE__ */ d(
        dr,
        {
          output: t,
          fallback: e.text || n,
          streaming: r,
          mediaGridKind: Uo(e),
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function Qs({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [o, s] = K(e);
  return de(() => {
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
function Ds({ active: e }) {
  return e ? /* @__PURE__ */ A(
    "div",
    {
      className: "ws-node-media-generating nodrag nopan nowheel",
      role: "status",
      "aria-live": "polite",
      onPointerDown: (t) => t.stopPropagation(),
      onClick: (t) => t.stopPropagation(),
      children: [
        /* @__PURE__ */ d(gn, { size: 18, className: "ws-spin" }),
        /* @__PURE__ */ d("span", { children: "生成中" })
      ]
    }
  ) : null;
}
function qr(e) {
  const t = String(e.text || "").trim();
  return !t || Yt(t) ? "" : t;
}
function __(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, o = 340;
  let s = r, i = s / n;
  return i > o && (i = o, s = i * n), {
    width: Math.round(La(s, 150, r)),
    height: Math.round(La(i, 150, o))
  };
}
function Io(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, o) => {
      const s = __(r, o);
      if (!s)
        return;
      const i = {
        width: s.width,
        height: s.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function La(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function b_() {
  return /* @__PURE__ */ A("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {}),
    /* @__PURE__ */ d("span", {})
  ] });
}
function N_(e) {
  return e.type === "storyboardFrame" ? "ws-minimap-storyboard-frame" : "";
}
function I_(e) {
  return e.type === "storyboardFrame" ? "transparent" : S_(e.data);
}
function S_(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function C_() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
const ob = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: rh
}, Symbol.toStringTag, { value: "Module" }));
export {
  vt as A,
  rb as B,
  mi as C,
  Hm as D,
  zr as E,
  ob as F,
  cf as V,
  zn as a,
  wi as b,
  Hc as c,
  lm as d,
  q_ as e,
  gp as f,
  eb as g,
  Z_ as h,
  qc as i,
  J_ as j,
  Q_ as k,
  nb as l,
  ln as m,
  tb as n,
  X_ as o,
  L_ as p,
  G_ as q,
  nm as r,
  Sp as s,
  H_ as t,
  ly as u,
  W_ as v,
  df as w,
  Y_ as x,
  Gf as y,
  Yi as z
};
