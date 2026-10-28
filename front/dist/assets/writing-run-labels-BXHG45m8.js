import { a as L, j as f, d as pr, r as cn, c as tl, g as vc, F as en, b as qm, h as Gm } from "./react-5Z-wsVEn.js";
import { X as Nc, k as Sc, q as nl, s as Wm, w as Hm, h as Ym, m as Xm, bb as Zm, bc as rl, Q as Jm, aw as ol, P as sl, L as $a, c as Qm, bd as eg, r as ur, j as Cc, z as tg, i as ng, C as kc, b as Rc, aX as rg, A as og, H as sg, ah as ig, b2 as ag, b1 as cg, aU as dg, be as ug, l as lg, W as fg, a7 as Ed, a6 as Pd, a9 as pg, bf as mg, e as il, y as al } from "./vendor-icons-fVDtJt66.js";
import { e as gg, a9 as Hi, a5 as yg, $ as ar, as as ja, al as $r, ak as hg, aj as _g, ap as Od, ao as Fd, an as wg, ab as cl, ah as dl, aw as bg, ax as Ig, ay as ul, a3 as Cs, a4 as ms, az as vg, aA as Ng, aB as xc, aC as mr, aD as wn, o as Sg, aE as ll, n as Bd, aF as Cg, aG as zd, h as kg, i as Po, aH as Ac, aI as fl, R as Rg, S as xg, U as Ag, T as pl, aJ as Tg, aK as La, aL as ml, av as $d, aM as Mg, aN as Dg, aO as Eg, am as Pg, ai as Og, aP as Fg, aQ as Bg } from "./space-ordered-list-CBeUyd80.js";
import { s as qe, v as zo, q as zg, r as $g } from "./site-config-kAiWSd_3.js";
import { b as W, a as q, d as ue, h as E, u as de, l as Zr, m as gl, o as Tc, A as jg, S as Be, p as Mc } from "./file-kind-D6bMOzYN.js";
import { b as Lg, d as vt, a as Lt, c as Vg } from "./preloadable-CT3tMmBD.js";
import { i as Ug, a as Kg, e as yl, n as $o, N as qg, w as Gg, b as Wg, g as Hg, B as jd, E as Yg, c as Xg, f as Zg, d as Jg, M as Qg, h as ey, P as He, H as ty } from "./interaction-3oJt9_4e.js";
import { u as ny } from "./project-dialogs--X3J9YnN.js";
import { aL as Xt, aM as $, a1 as Ie, aN as hl, aO as _l, aP as wl, k as Xe, aQ as Jr, aR as Dc, z as Ld, aS as bl, aT as zt, aU as Il, aV as vl, a4 as Ec, aW as Nl, a3 as Pc, l as bn, m as Es, aX as ry, aY as oy, B as pt, j as Sl, aZ as sy, a2 as $e, aE as Cl, aD as iy, aC as kl, aB as Rl, aA as xl, a_ as ks, a$ as ay, b0 as Al, b1 as cy, b2 as dy, a6 as Tl, b3 as uy, b4 as Ml, ah as ly, b5 as Oc, b6 as Pn, b7 as Dl, b8 as fy, aK as El, b9 as Pl, ba as Vd, e as Ol, bb as Fc, Y as py, bc as Ao, C as To, bd as Ps, be as Ri, bf as my, X as gy, bg as Os, bh as Vr, bi as Fs, bj as Bs, bk as Ur, p as Ke, o as yy, s as $t, bl as zs, bm as Va, bn as hy, bo as _y, bp as ci, bq as Kr, F as Bc, g as xi, br as Fl, A as Bl, bs as wy } from "./asset-preview-BZxHU4Mm.js";
import { n as by, P as Iy } from "./power-icon-CSEV3sD6.js";
import { z as zl, x as $l, f as jl, e as vy, p as Ny, s as Sy, o as Cy, q as ky, n as Ry } from "./runtime-DQ2rFFvP.js";
import { n as xy, i as Ay } from "./text-content-save-actions-C7rwLAWt.js";
import { u as Ty } from "./asset-upload-progress-BIgxpzPg.js";
import "./media-inspector-gallery-BJGVC-F2.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-run-labels-BuSrfG4U.css", import.meta.url).href]);
function sr({
  message: e,
  onDismiss: t,
  floating: n = !1
}) {
  return e ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-operation-error nodrag nowheel${n ? " is-floating" : ""}`,
      role: "alert",
      onPointerDown: (r) => r.stopPropagation(),
      children: [
        /* @__PURE__ */ f("span", { children: e }),
        /* @__PURE__ */ f("button", { type: "button", "aria-label": "关闭错误提示", onClick: t, children: /* @__PURE__ */ f(Nc, { size: 14 }) })
      ]
    }
  ) : null;
}
function zc(e) {
  const t = e && gg(e);
  return !!(t?.title.trim() && t.content.trim());
}
function HC(e, t) {
  if (!zc(e)) return "请先在画布选用一个灵感";
  if (t.kind === "section" && Hi(t.id) || yg(t)) return "";
  if (t.kind === "unit") {
    const n = ar(e.units).byId.get(
      t.id
    )?.unit;
    if (!n) return "该章节已移出目录";
    if (t.tab === "body" || !t.tab)
      return n.has_body || n.title.trim() && n.plan.trim() ? "" : "请先保存本章标题与剧情";
    if (n.plan.trim() || n.has_body || ja(e))
      return "";
  } else if (e.units.length || ja(e))
    return "";
  return "请先完成大纲规划";
}
function YC(e, t, n = {}) {
  if ([
    "save_document",
    "save_unit",
    "create_version",
    "restore_document"
  ].includes(t))
    return "";
  if (t === "generate_inspirations" || t === "select_inspiration")
    return e.selected_inspiration_id ? "选定灵感后不能更换或修改方向" : "";
  if (!zc(e)) return "请先选用一个灵感";
  if (t === "generate_outline" || t === "retry_planning") return "";
  if (t === "retry_continuity")
    return ar(e.units).byId.get(n.unit_id || "")?.unit?.has_body ? "" : "请先保存本章正文";
  if ((t === "generate_section" || t === "propose_edit") && n.section_id && (Hi(n.section_id) || ["characters", "locations", "props"].includes(n.section_id)))
    return "";
  if (!ja(e))
    return "请先保存完整大纲";
  if (t === "generate_chapters") {
    if (n.unit_ids && !n.unit_ids.length)
      return "当前页没有可更新的章节";
    if (n.unit_ids?.length) {
      if (n.unit_ids.length > $r) return `每批最多更新 ${$r} 章章纲`;
      if (n.unit_ids.some(
        (s) => !ar(e.units).byId.has(s)
      ))
        return "部分章节已移出目录";
    } else if (e.units.length > $r)
      return `请选定最多 ${$r} 章章纲`;
    return "";
  }
  const r = hg(e.units);
  if (t === "append" && r.length)
    return "请先同步后续剧情，再继续创作";
  if (t === "append") {
    const s = e.preferences.planned_chapters;
    if (s > 0 && e.units.length >= s)
      return "已规划到计划总章数，可在写作设定中调整";
    if (n.count !== void 0) {
      if (!Number.isInteger(n.count) || n.count < 1 || n.count > $r)
        return `本批剧情章数须为 1 到 ${$r} 的整数`;
      if (s > 0 && e.units.length + n.count > s)
        return `本批最多规划剩余 ${s - e.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (t === "generate_units") {
    const s = n.count ?? _g;
    if (n.mode === "continue" && Od(s))
      return Od(s);
    if (n.mode === "range" && (n.unit_ids?.length || 0) > Fd)
      return `一次最多生成 ${Fd} 章正文`;
    const o = n.mode === "continue" ? wg(e.units, s).map(
      (a) => a.unit
    ) : e.units.filter(
      (a) => n.unit_ids?.includes(a.id) || a.id === n.unit_id
    );
    if (!o.length) return "请先完成章节剧情规划";
    if (o.some((a) => !a.has_body && a.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (o.some((a) => !a.title.trim() || !a.plan.trim()))
      return "请先保存章节标题与剧情";
    const i = o.find((a) => !a.has_body);
    if (!i) return "正文已完成，请使用修改建议";
    const c = e.units.indexOf(i);
    if (c > 0 && !e.units[c - 1].has_body)
      return `请先完成上一章「${e.units[c - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}
function XC(e, t, n = {}) {
  if (t === "generate_chapters" && e.units.length) {
    const r = ar(e.units), s = n.unit_ids?.flatMap((o) => {
      const i = r.byId.get(o);
      return i ? [i] : [];
    });
    return n.unit_ids?.length ? `将更新${cl(s || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。` : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (t === "generate_section" && n.section_id) {
    const r = n.section_id;
    if ((r === "characters" || r === "locations" || r === "props") && e.outline[r].length)
      return `将更新当前${dl.find(
        (o) => o.id === r
      ).label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
  }
  return "";
}
function ZC(e) {
  return e.unit_id ? {
    kind: "unit",
    id: e.unit_id,
    tab: e.section_id === "chapter_plan" ? "plan" : "body"
  } : e.entity_id && (e.section_id === "characters" || e.section_id === "locations" || e.section_id === "props") ? { kind: "entity", section: e.section_id, id: e.entity_id } : {
    kind: "section",
    id: e.section_id && Hi(e.section_id) ? e.section_id : "overview"
  };
}
function JC(e) {
  if (!e || !["failed", "stopped"].includes(e.document.status))
    return null;
  const t = e.checkpoint;
  if (!t) return null;
  const n = {
    instruction: t.instruction
  };
  if (t.count && (n.count = t.count), t.selected_text && (n.selected_text = t.selected_text), t.section_id && (n.section_id = t.section_id), t.entity_id && (n.entity_id = t.entity_id), t.inspiration_id && (n.inspiration_id = t.inspiration_id), t.unit_id && (n.unit_id = t.unit_id), t.action === "generate_chapters" && t.unit_ids.length && (n.unit_ids = t.unit_ids), t.action === "generate_outline" || ["generate_chapters", "append"].includes(t.action) && Number(t.draft?.accepted_count) > 0)
    return { action: "retry_planning", extra: {} };
  const r = t.unit_ids[t.completed], s = t.action === "generate_units", o = s && !!r && !ar(e.document.units).byId.get(r)?.unit.has_body;
  if (s && !o && t.phase === "continuity" || t.action === "retry_continuity") {
    const i = r || t.unit_id || t.continuity_unit_id || "", c = ar(e.document.units).byId.get(i)?.unit;
    return c?.has_body ? { action: "retry_continuity", extra: { unit_id: i, expected_unit_version_id: c.version_id } } : null;
  }
  if (s) {
    const i = t.unit_ids.slice(t.completed).filter(
      (c) => !ar(e.document.units).byId.get(c)?.unit.has_body
    );
    if (!i.length) return null;
    n.mode = i.length === 1 ? "single" : "range", n.unit_ids = i;
  }
  return [
    "generate_outline",
    "generate_chapters",
    "generate_section",
    "generate_units",
    "propose_edit",
    "append"
  ].includes(t.action) ? { action: t.action, extra: n } : null;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Ai = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Ai || Object.keys(Ai).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ll = Ai.joinSiteApi, Vl = Ai.request;
async function My(e) {
  const t = qe(
    await Vl(Ll("project/writing_command"), "post", e, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), n = bg(t);
  if (!n) throw new Error("创作响应缺少已保存版本");
  return n;
}
async function QC(e) {
  const t = qe(
    await Vl(
      Ll("project/writing_runs"),
      "get",
      {
        project_id: e.projectId,
        canvas_id: e.canvasId,
        work_asset_id: e.workAssetId,
        before_id: e.beforeId || 0
      },
      { reportError: !1 }
    ),
    "读取创作运行记录失败"
  );
  return {
    items: (Array.isArray(t.items) ? t.items : []).map(
      (n) => ({
        ...n,
        checkpoint: Ig(n.checkpoint)
      })
    ),
    hasMore: !!t.has_more,
    beforeId: Number(t.before_id || 0)
  };
}
function hn(e) {
  return e.purpose ? e.purpose : e.id.startsWith("script-item-edge-") || e.id.startsWith("script-compose-edge-") ? "dependency" : e.id.startsWith("script-edge-") ? "structure" : "media";
}
function Ul(e) {
  return hn(e) === "media";
}
function Dy(e, t, n) {
  const r = new Map(n.map((o) => [o.id, o])), s = new Set(e.map((o) => o.id));
  return [
    ...e.flatMap((o) => {
      if (!t.has(o.id))
        return [o];
      const i = r.get(o.id);
      return i ? [i] : [];
    }),
    ...n.filter((o) => !s.has(o.id))
  ];
}
const Ey = { width: 720, height: 420 }, Ud = { width: 360, height: 240 }, Kd = { width: 2400, height: 1600 }, Kl = 48, Mo = 16;
function ql(e, t) {
  return e.filter((n) => n.groupId === t);
}
function Gl(e, t) {
  const n = e.find((r) => r.id === t);
  return n ? n.type === "group" ? ql(e, n.id) : [n] : [];
}
function Py(e, t) {
  return !(!e || !t || e.id === t.id || e.type === "group" && t.groupId === e.id || t.type === "group" && e.groupId === t.id || e.groupId !== t.groupId && t.type !== "group" && t.groupId);
}
function qd(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.x === n.x && r.y === n.y)
    return e;
  const s = n.x - r.x, o = n.y - r.y;
  return e.map((i) => i.id === t ? { ...i, ...n } : r.type === "group" && i.groupId === r.id ? {
    ...i,
    x: i.x + s,
    y: i.y + o
  } : i);
}
function ha(e, t, n) {
  const r = e.find((c) => c.id === t), s = r ? Wl(e, r) : void 0;
  if (!r || !s)
    return n;
  const o = Gd(
    n.x,
    s.x + Mo,
    s.x + s.width - Mo - r.width
  ), i = Gd(
    n.y,
    s.y + Kl,
    s.y + s.height - Mo - r.height
  );
  return o === n.x && i === n.y ? n : { x: o, y: i };
}
function Ua(e, t, n) {
  const r = e.find((i) => i.id === t);
  if (!r || r.type === "group" || Wl(e, r))
    return e;
  const s = { ...r, ...n }, o = Oy(e, s);
  return (r.groupId || "") === o ? e : e.map(
    (i) => i.id === t ? { ...i, groupId: o || void 0 } : i
  );
}
function sn(e, t) {
  const n = new Map(e.map((o) => [o.id, o])), r = /* @__PURE__ */ new Set(), s = [];
  for (const o of t) {
    const i = o.logicalFrom || o.from, c = o.logicalTo || o.to, a = n.get(i), d = n.get(c);
    if (!a || !d)
      continue;
    const u = a.groupId !== d.groupId, y = u && a.type !== "group" && a.groupId ? a.groupId : a.id, h = u && d.type !== "group" && d.groupId ? d.groupId : d.id;
    if (!y || !h || y === h)
      continue;
    const I = `${i}\0${c}\0${hn(o)}`;
    r.has(I) || (r.add(I), s.push({ ...o, from: y, to: h, logicalFrom: i, logicalTo: c }));
  }
  return s;
}
function Oy(e, t) {
  const n = t.x + t.width / 2, r = t.y + t.height / 2;
  return e.filter(
    (o) => o.type === "group" && o.id !== t.id && n >= o.x + Mo && n <= o.x + o.width - Mo && r >= o.y + Kl && r <= o.y + o.height - Mo
  ).sort(
    (o, i) => o.width * o.height - i.width * i.height
  )[0]?.id || "";
}
function Wl(e, t) {
  if (!(!t.groupId || t.type === "group"))
    return e.find(
      (n) => n.id === t.groupId && n.type === "group" && n.group?.origin === "script"
    );
}
function Gd(e, t, n) {
  return Math.min(Math.max(e, t), Math.max(t, n));
}
const Fy = [
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
function e0(e) {
  const t = Math.round(e * 10) / 10;
  return Number.isInteger(t) ? t.toString() : t.toFixed(1);
}
function t0() {
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
function $c(e) {
  const t = Xt(e);
  if (Number(t.version || 0) !== 3)
    return;
  const n = Array.isArray(t.clips) ? t.clips.map(Wd).filter(Boolean) : [], r = Xt(t.settings), s = Array.isArray(t.audioTracks ?? t.audio_tracks) ? (t.audioTracks ?? t.audio_tracks).map(Hd).filter(Boolean) : [], o = Xt(t.storyboardBaseline);
  return {
    version: 3,
    ...Array.isArray(o.clips) && Array.isArray(o.audioTracks) ? {
      storyboardBaseline: {
        clips: o.clips.map(Wd).filter(Boolean),
        audioTracks: o.audioTracks.map(Hd).filter(Boolean)
      }
    } : {},
    clips: n,
    audioTracks: s,
    settings: {
      resolution: De(r.resolution) || "auto",
      fps: Oo(r.fps, 0, 120, 0)
    }
  };
}
function n0(e) {
  const t = e.clips.reduce(
    (r, s) => r + Math.max(0, s.duration),
    0
  ), n = e.clips.reduce((r, s, o) => o >= e.clips.length - 1 || s.transitionToNext.type === "none" ? r : r + s.transitionToNext.durationMs / 1e3, 0);
  return Math.max(0, t - n);
}
function r0(e) {
  const t = e.clips.flatMap(
    (r, s) => Yi(r).map(
      (o) => `${r.title || `镜头 ${s + 1}`}：${o}`
    )
  ), n = e.audioTracks.flatMap(
    (r, s) => r.audio ? [] : [`全片声音 ${s + 1}：缺少音频素材`]
  );
  return [...t, ...n];
}
function Yi(e) {
  const t = [];
  e.visualVideo || t.push("缺少镜头视频素材");
  for (const n of e.speechTracks)
    n.audio || t.push(`语音“${n.text}”缺少音频素材`);
  for (const n of e.subtitleTracks)
    n.speechId && !e.speechTracks.some((r) => r.id === n.speechId) && t.push(`字幕“${n.text}”未找到对应语音`);
  return [...new Set(t)];
}
function By(e) {
  return e ? `${e.assetId}:${e.versionId}` : "";
}
function o0(e) {
  return e ? [
    By(e),
    Number(e.mediaIndex || 0),
    e.mediaUrl || ""
  ].join(":") : "";
}
function Wd(e) {
  const t = Xt(e), n = De(t.id);
  if (!n)
    return null;
  const r = Ti(
    t.visualVideo ?? t.visual_video
  ), s = Ti(
    t.originalAudioSource ?? t.original_audio_source
  ), o = Xt(
    t.transitionToNext ?? t.transition_to_next
  ), i = Array.isArray(t.speechTracks ?? t.speech_tracks) ? (t.speechTracks ?? t.speech_tracks).map($y).filter(Boolean) : [], c = Array.isArray(
    t.subtitleTracks ?? t.subtitle_tracks
  ) ? (t.subtitleTracks ?? t.subtitle_tracks).map(zy).filter(Boolean) : [], a = Vy(o.type), d = De(t.sourceEdgeId ?? t.source_edge_id), u = {
    id: n,
    title: De(t.title) || r?.label || "镜头",
    ...d ? { sourceEdgeId: d } : {},
    ...r ? { visualVideo: r } : {},
    ...s ? { originalAudioSource: s } : {},
    duration: jy(t.duration),
    originalVolume: Oo(
      t.originalVolume ?? t.original_volume,
      0,
      1,
      1
    ),
    speechTracks: i,
    subtitleTracks: c,
    useOriginalVideo: Yl(
      t.useOriginalVideo ?? t.use_original_video
    ),
    blockingIssues: [],
    transitionToNext: {
      type: a,
      durationMs: a === "none" ? 0 : Oo(
        o.durationMs ?? o.duration_ms,
        100,
        5e3,
        500
      )
    }
  };
  return u.blockingIssues = Yi(u), u;
}
function zy(e) {
  const t = Xt(e), n = De(t.id), r = De(t.text);
  if (!n || !r)
    return null;
  const s = De(t.source) === "speech" ? "speech" : "caption", o = De(t.speechId ?? t.speech_id), i = $(t.endTime ?? t.end_time);
  return {
    id: n,
    text: r,
    startTime: Math.max(0, $(t.startTime ?? t.start_time)),
    ...i > 0 ? { endTime: i } : {},
    ...o ? { speechId: o } : {},
    source: s
  };
}
function $y(e) {
  const t = Xt(e), n = De(t.id);
  if (!n)
    return null;
  const r = Ti(t.audio), s = De(t.kind) === "narration" ? "narration" : "dialogue", o = De(t.characterId ?? t.character_id);
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, $(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, $(t.sourceStart ?? t.source_start)),
    fit: Hl(t.fit, "trim"),
    kind: s,
    ...o ? { characterId: o } : {},
    text: De(t.text),
    volume: Oo(t.volume, 0, 1, 1)
  };
}
function Hd(e) {
  const t = Xt(e), n = De(t.id);
  if (!n)
    return null;
  const r = Ti(t.audio), s = De(t.kind) === "narration" ? "narration" : "music";
  return {
    id: n,
    ...r ? { audio: r } : {},
    startTime: Math.max(0, $(t.startTime ?? t.start_time)),
    sourceStart: Math.max(0, $(t.sourceStart ?? t.source_start)),
    kind: s,
    volume: Oo(t.volume, 0, 1, s === "music" ? 0.35 : 1),
    fit: Hl(t.fit, s === "music" ? "trim" : "strict"),
    loop: s === "music" && Yl(t.loop),
    fadeOut: Oo(
      t.fadeOut ?? t.fade_out,
      0,
      10,
      s === "music" ? 1 : 0
    )
  };
}
function Hl(e, t) {
  return De(e) === "strict" ? "strict" : De(e) === "trim" ? "trim" : t;
}
function jy(e) {
  const t = $(e);
  return t > 0 ? Math.max(1, Math.floor(t)) : 0;
}
function Ti(e) {
  const t = Xt(e), n = $(t.assetId ?? t.asset_id), r = $(t.versionId ?? t.version_id);
  if (!n || !r)
    return;
  const s = Ly(
    t.mediaItems ?? t.media_items ?? t.refMediaItems ?? t.ref_media_items
  );
  return {
    assetId: n,
    versionId: r,
    label: De(t.label),
    ...$(t.mediaIndex ?? t.media_index) > 0 ? { mediaIndex: $(t.mediaIndex ?? t.media_index) } : {},
    ...De(t.mediaUrl ?? t.media_url) ? { mediaUrl: De(t.mediaUrl ?? t.media_url) } : {},
    ...De(
      t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
    ) ? {
      mediaThumbnail: De(
        t.mediaThumbnail ?? t.media_thumbnail ?? t.thumbnail ?? t.poster
      )
    } : {},
    ...s.length ? { mediaItems: s } : {}
  };
}
function Ly(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const s = Xt(r), o = De(s.url), i = $(s.index);
    if (!o && i <= 0)
      continue;
    const c = i > 0 ? `index:${i}` : `url:${o}`;
    n.has(c) || (n.add(c), t.push({
      url: o,
      index: i > 0 ? i : 0,
      ...De(s.usage) ? { usage: De(s.usage) } : {}
    }));
  }
  return t;
}
function Vy(e) {
  const t = De(e);
  return Fy.some(
    (n) => n.options.some((r) => r.key === t)
  ) ? t : "none";
}
function De(e) {
  return String(e ?? "").trim();
}
function Oo(e, t, n, r) {
  const s = Number(e);
  return Number.isFinite(s) ? Math.min(n, Math.max(t, s)) : r;
}
function Yl(e) {
  return e === !0 || e === 1 || e === "1" || e === "true";
}
function $s(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return;
  const t = e, n = gs(t.started_at ?? t.startedAt);
  if (n == null)
    return;
  const r = gs(t.finished_at ?? t.finishedAt);
  return {
    startedAt: n,
    ...r != null && r >= n ? { finishedAt: r } : {}
  };
}
function Xl(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.round(t) : void 0;
}
function jc({
  nodeRunTiming: e,
  runCreatedAt: t,
  currentStartedAt: n,
  now: r = Date.now()
}) {
  return gs(e?.startedAt) ?? gs(t) ?? gs(n) ?? r;
}
function di(e) {
  const t = Math.max(0, Math.floor(e / 1e3)), n = t % 60, r = Math.floor(t / 60), s = r % 60, o = Math.floor(r / 60);
  return o > 0 ? `${o}:${ui(s)}:${ui(n)}` : `${ui(r)}:${ui(n)}`;
}
function Uy(e, t, n) {
  const r = di(e);
  if (!t)
    return {
      elapsed: `用时 ${r}`,
      estimate: "",
      tooltip: `本次运行总耗时 ${r}`
    };
  const s = Xl(n);
  if (!s)
    return {
      elapsed: `已用 ${r}`,
      estimate: "剩余估算中",
      tooltip: `已运行 ${r}，暂无历史平均用时，无法估算剩余时间`
    };
  const o = e >= s ? `已超预计 ${di(e - s)}` : `剩余约 ${di(s - e)}`;
  return {
    elapsed: `已用 ${r}`,
    estimate: o,
    tooltip: `已运行 ${r}，历史平均约 ${di(s)}，${o}`
  };
}
function gs(e) {
  if (typeof e == "number" && Number.isFinite(e) && e > 0)
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim())
    return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}
function ui(e) {
  return String(e).padStart(2, "0");
}
function Tt(e) {
  const t = Number(e.execution_id || 0);
  if (t > 0)
    return `execution:${t}`;
  const n = Number(e.run_id || 0);
  return n > 0 ? `run:${n}` : `request:${String(e.request_id || "")}`;
}
function _n(e) {
  const t = String(e.status || "").trim();
  return t ? Ug(t) || Kg(t) : !1;
}
function js(e) {
  if (!e)
    return "";
  const t = String(
    e.status || e.result?.status || ""
  ).trim();
  return t ? $o(t) : "";
}
function Fn(e) {
  const t = String(e || "").trim();
  return !!t && yl(t);
}
function Ky(e, t) {
  const n = e.target_node_ids || [];
  if (!Fn(e.status) || n.length === 0)
    return !1;
  const r = Number(e.canvas_id || 0), s = Number(e.asset_cate_id || 0), o = r ? [t[String(r)]].filter(Boolean) : Object.values(t).filter(
    (i) => !s || i.assetCateId === s
  );
  return o.length > 0 && o.every((i) => {
    const c = new Set(i.nodes.map((a) => a.id));
    return n.every((a) => !c.has(a));
  });
}
function lr(e) {
  const t = e?.output && typeof e.output == "object" ? e.output : {}, n = e?.run && typeof e.run == "object" ? e.run : {};
  return {
    execution_id: Number(e?.execution_id || 0),
    canvas_id: Number(e?.canvas_id || 0),
    run_id: Number(e?.run_id || n.id || 0),
    request_id: String(e?.request_id || n.request_id || ""),
    asset_cate_id: Number(e?.asset_cate_id || 0),
    start_node_id: String(e?.start_node_id || ""),
    target_node_ids: Array.isArray(e?.target_node_ids) ? e.target_node_ids.filter(
      (r) => typeof r == "string" && !!r.trim()
    ) : [],
    execution_scope: String(
      e?.execution_scope || t.execution_scope || ""
    ),
    flow_run_id: Number(e?.flow_run_id || n.flow_run_id || 0),
    release_id: Number(e?.release_id || n.release_id || 0),
    status: $o(e?.status || n.status),
    error: Bn(e?.error || n.error),
    executed: Number(e?.executed || e?.output?.executed || 0),
    total: Number(e?.total || e?.output?.total || 0),
    single_node: !!e?.single_node,
    created_at: String(e?.created_at || ""),
    updated_at: String(e?.updated_at || ""),
    title: String(e?.title || ""),
    output: e?.output || n.output,
    approvals: Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [],
    interactions: Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [],
    node_results: Zl(
      e?.node_results || t.node_results
    ),
    pending_node: Lc(
      e?.pending_node || t.pending_node
    ),
    execution_plan: Yy(e?.execution_plan),
    node_runs: Array.isArray(e?.node_runs) ? e.node_runs.map(Jy).filter((r) => !!r) : []
  };
}
function Lc(e) {
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
    status: $o(e.status || e.result?.status),
    error: Bn(e.error),
    output: e.output,
    asset: e.asset,
    version: e.version,
    result: e.result,
    approval: e.approval,
    interaction: e.interaction,
    persists_result: !!e.persists_result,
    agent_run_id: Number(e.agent_run_id || 0),
    runTiming: $s(e.run_timing)
  } : null;
}
function Zl(e) {
  return Array.isArray(e) ? e.map(Lc).filter((t) => !!t) : [];
}
function qy(e, t = "") {
  if (!e || typeof e != "object")
    return null;
  const n = String(t || "").trim(), r = Zl(e.node_results), s = n ? r.find((o) => o.node_key === n) : r[0];
  return s || Lc(
    n && !String(e.node_key || "").trim() ? { ...e, node_key: n } : e
  );
}
function Vc(e) {
  return e ? tf(
    e.error,
    e.result?.error,
    e.output?.error
  ) : "";
}
function Jl(e) {
  if (!e)
    return "";
  const t = [...e.node_results || []].reverse().find((n) => $o(
    n.status || n.result?.status
  ) === "fail");
  return tf(
    Vc(t),
    e.output?.error,
    e.error
  );
}
function Gy(e, t = "节点运行失败") {
  return Uc(
    Vc(e),
    t
  );
}
function Ql(e, t = "画布运行失败") {
  return Uc(Jl(e), t);
}
function Uc(e, t = "运行失败") {
  const n = Bn(e);
  return n ? n.includes("InputImageSensitiveContentDetected") || n.includes("PrivacyInformation") ? "参考图片可能包含真人或隐私信息，请更换参考图后重试。" : n.includes("资产当前版本已变化") ? "引用的资产版本已变化，请刷新画布后重试。" : n.length > 500 ? `${n.slice(0, 497)}...` : n : t;
}
function Wy(...e) {
  for (const t of e) {
    const n = Bn(t);
    if (n)
      return n;
  }
  return "";
}
const ef = /* @__PURE__ */ new Set([
  "画布运行失败",
  "节点运行失败",
  "节点执行失败",
  "运行失败",
  "执行出错"
]);
function Hy(e) {
  return ef.has(Bn(e));
}
function ys(e) {
  const t = Bn(e);
  return t.includes("运行已取消") || t.includes("运行已停止");
}
function tf(...e) {
  let t = "";
  for (const n of e) {
    const r = Bn(n);
    if (r && (t ||= r, !ef.has(r)))
      return r;
  }
  return t;
}
function Bn(e) {
  if (typeof e == "string")
    return e.trim();
  if (e instanceof Error)
    return e.message.trim();
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e, n = Wy(t.error, t.message, t.msg);
  if (n)
    return n;
  const r = Bn(t.code), s = Bn(t.detail);
  return [r, s].filter(Boolean).join(": ");
}
function Yy(e) {
  if (!e || typeof e != "object")
    return null;
  const t = Array.isArray(e.nodes) ? e.nodes.map(Xy).filter((r) => !!r) : [], n = Array.isArray(e.edges) ? e.edges.map(Zy).filter((r) => !!r) : [];
  return {
    nodes: t,
    edges: n,
    incoming: Yd(e.incoming),
    outgoing: Yd(e.outgoing),
    order: Array.isArray(e.order) ? e.order.map((r) => String(r || "")).filter(Boolean) : t.map((r) => r.id)
  };
}
function Xy(e) {
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
function Zy(e) {
  const t = String(e?.source || ""), n = String(e?.target || "");
  return !t || !n ? null : {
    id: String(e?.id || `${t}-${n}`),
    source: t,
    target: n
  };
}
function Yd(e) {
  const t = /* @__PURE__ */ new Map();
  if (!e || typeof e != "object" || Array.isArray(e))
    return t;
  for (const [n, r] of Object.entries(e)) {
    const s = Array.isArray(r) ? r.map((o) => String(o || "")).filter(Boolean) : [];
    t.set(String(n), s);
  }
  return t;
}
function Jy(e) {
  const t = String(e?.node_key || ""), n = Number(e?.node_run_id || 0);
  return !t || n <= 0 ? null : {
    node_run_id: n,
    node_id: Number(e?.node_id || 0),
    node_key: t,
    node_type: String(e?.node_type || ""),
    status: $o(e?.status),
    persists_result: !!e?.persists_result,
    runTiming: $s(e?.run_timing)
  };
}
const wi = "primary_text", Qy = /* @__PURE__ */ new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string"
]), eh = /* @__PURE__ */ new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document"
]), jo = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function th(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const s = String(r.key || "").trim(), o = String(r.type || "").trim().toLowerCase(), i = String(r.value_type || "string").trim().toLowerCase();
    !s || jo.has(s) || t.has(s) || !Qy.has(o) || i === "number" || (t.add(s), n.push(s === r.key ? r : { ...r, key: s }));
  }
  return n;
}
function nf(e, t, n) {
  const r = n.trim(), s = gr(t?.paramBindings);
  return th(e).filter(
    (o) => of(s, o.key, r)
  );
}
function nh(e, t, n) {
  return of(
    gr(e?.paramBindings),
    t,
    n
  );
}
function rh(e) {
  if (e.length !== 1)
    return;
  const t = e[0], n = String(t.key || "").trim();
  return n && !jo.has(n) ? n : void 0;
}
function Ka(e) {
  const t = rh(e);
  return t ? { kind: "automatic", targetParamKey: t } : e.length > 1 ? { kind: "choose", params: e } : { kind: "unavailable" };
}
function oh(e, t, n = !1) {
  const r = (t?.length || 0) + (n ? 1 : 0);
  if (e) {
    let s = r;
    (e.purpose === "storyboard_lyrics" && n || e.purpose !== "storyboard_lyrics" && e.targetParamKey && t?.some((i) => i.key === e.targetParamKey)) && (s -= 1);
    const o = !!(t && s > 0);
    return {
      label: e.label,
      interactive: o,
      showChevron: o,
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
function sh(e, t, n) {
  const r = gr(t?.paramBindings), s = new Set(
    Object.values(r || {}).map((a) => a.sourceNodeId)
  ), o = [
    ...new Set(e.map((a) => a.trim()).filter(Boolean))
  ].filter((a) => !s.has(a));
  if (o.length !== 1)
    return;
  const i = o[0], c = Ka(
    nf(n, t, i)
  );
  return c.kind === "automatic" ? { sourceNodeId: i, targetParamKey: c.targetParamKey } : void 0;
}
function ih(e) {
  return qa(e.type) === "prompt" || qa(e.key) === "prompt" ? "提示词" : String(e.name || "").trim() || "文本参数";
}
function vo(e) {
  return e ? e.type === "agent" ? !0 : e.type === "power" ? wa(e.power?.kind, e.kind, e.outputType) : e.type === "asset" ? wa(e.asset?.kind, e.kind, e.outputType) : wa(e.kind, e.outputType) : !1;
}
function li(e) {
  return !!(e?.type === "power" && e.composerDraft?.storyboardWorkType === "mv" && pr(e.power, e.kind, e.outputType));
}
function gr(e) {
  const t = Xd(e), n = [];
  for (const [r, s] of Object.entries(t)) {
    const o = r.trim(), i = Xd(s), c = String(
      i.sourceNodeId ?? i.source_node_id ?? ""
    ).trim(), a = String(
      i.sourceOutput ?? i.source_output ?? wi
    ).trim().toLowerCase();
    !o || jo.has(o) || !c || a !== wi || n.push([
      o,
      {
        sourceNodeId: c,
        sourceOutput: wi
      }
    ]);
  }
  return n.length > 0 ? Object.fromEntries(n) : void 0;
}
function ah(e) {
  const t = gr(e);
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
function ch(e, t, n) {
  const r = t.trim(), s = n.trim();
  return !r || jo.has(r) || !s ? e : {
    ...e,
    paramBindings: {
      ...gr(e.paramBindings) || {},
      [r]: {
        sourceNodeId: s,
        sourceOutput: wi
      }
    }
  };
}
function dh(e, t, n) {
  const r = t.trim();
  if (!r)
    return e;
  const s = n.trim();
  return !s || jo.has(s) ? e : ch(
    Mi(e, r),
    s,
    r
  );
}
function uh(e, t, n = []) {
  const r = t.trim(), s = gr(e?.paramBindings);
  if (!r || !s)
    return;
  const o = Object.entries(s).filter(([, a]) => a.sourceNodeId === r).map(([a]) => a).sort();
  if (o.length === 0)
    return;
  const i = new Map(
    n.map((a) => [a.key.trim(), ih(a)])
  ), c = o.map(
    (a) => i.get(a) || "文本参数"
  );
  return {
    targetParamKeys: o,
    targetParamKey: o.length === 1 ? o[0] : void 0,
    label: c.length === 1 ? c[0] : `${c[0]} +${c.length - 1}`
  };
}
function _a(e, t, n = []) {
  const r = t.trim();
  if (r && String(e?.storyboardLyricsSourceNodeId || "").trim() === r)
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词"
    };
  const s = uh(e, r, n);
  return s ? { ...s, purpose: "param" } : void 0;
}
function lh(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = rf(e, n);
  return r.storyboardLyricsSourceNodeId === n ? r : { ...r, storyboardLyricsSourceNodeId: n };
}
function rf(e, t) {
  const n = t.trim(), r = gr(e.paramBindings);
  if (!n || !r)
    return e;
  const s = Object.fromEntries(
    Object.entries(r).filter(
      ([, o]) => o.sourceNodeId !== n
    )
  );
  return Object.keys(s).length === Object.keys(r).length ? e : ph(e, s);
}
function Mi(e, t) {
  const n = t.trim();
  if (!n)
    return e;
  const r = rf(e, n);
  if (String(r.storyboardLyricsSourceNodeId || "").trim() !== n)
    return r;
  const { storyboardLyricsSourceNodeId: s, ...o } = r;
  return o;
}
function fh(e, t) {
  if (t.size === 0)
    return e;
  let n = !1;
  const r = e.map((s) => {
    let o = s.composerDraft;
    if (!o?.paramBindings && !o?.storyboardLyricsSourceNodeId)
      return s;
    for (const i of t)
      o = Mi(o, i);
    return o === s.composerDraft ? s : (n = !0, { ...s, composerDraft: o });
  });
  return n ? r : e;
}
function qa(e) {
  return String(e || "").trim().toLowerCase();
}
function wa(...e) {
  const t = e.map(qa).find(Boolean) || "";
  return eh.has(t);
}
function ph(e, t) {
  const { paramBindings: n, ...r } = e;
  return Object.keys(t).length > 0 ? { ...r, paramBindings: t } : r;
}
function of(e, t, n) {
  const r = t.trim(), s = n.trim();
  if (!r || jo.has(r) || !s)
    return !1;
  const o = e?.[r];
  return !o || o.sourceNodeId === s;
}
function Xd(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const sf = [
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
], mh = new Map(
  sf.map((e) => [e.key, e])
), s0 = sf.map(({ key: e, label: t, description: n }) => ({
  key: e,
  label: t,
  description: n
}));
function eo(e) {
  return mh.get(
    String(e || "").trim()
  );
}
function gh(e, t = "") {
  const n = hh(e), r = as(n.key), s = eo(
    r || yh(t)
  );
  if (!s)
    return r ? {
      key: r,
      label: as(n.label),
      description: as(n.description)
    } : void 0;
  const o = as(n.label), i = as(n.description);
  return {
    key: s.key,
    label: s.key === "import" && o === "导入" ? s.label : o || s.label,
    description: s.key === "import" && i === "导入资产并连接到当前节点。" ? s.description : i || s.description
  };
}
function Fo(e, t) {
  if (e.type !== "function")
    return !1;
  const n = eo(e.functionOption?.key);
  return !!(n && (!t || n.key === t));
}
function yh(e) {
  const t = e.trim();
  return t === "开始" ? "start" : t === "导入" || t === "引用" ? "import" : t === "展示" ? "display" : t.includes("保存") ? "save" : "";
}
function hh(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function as(e) {
  return typeof e == "string" ? e.trim() : "";
}
const Ga = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: !0
}, _h = { width: 180, height: 180 }, wh = { width: 240, height: 160 }, Zd = { width: 620, height: 360 }, Wa = { width: 800, height: 460 }, Jd = { width: 560, height: 520 };
function bh(e) {
  const t = Se(e);
  return {
    project: Rh(t.project),
    team: xh(t.team),
    release: Ah(t.release),
    assetCates: Yt(t.asset_cates).map(Th),
    flows: Yt(t.flows).map(Dh),
    canvasList: Yt(t.canvas_list).map(Xi),
    canvases: Ph(t.canvas),
    assets: Yt(Se(t.assets).items).map(yf),
    assistant: Ih(t.assistant),
    initialCanvasId: $(t.active_canvas_id),
    initialAssetCateId: $(t.active_asset_cate_id)
  };
}
function Xi(e) {
  const t = Se(e);
  return {
    id: $(t.id),
    projectId: $(t.project_id),
    assetCateId: $(t.asset_cate_id),
    name: P(t.name) || "第一幕",
    sort: $(t.sort),
    status: $(t.status),
    updatedAt: P(t.updated_at),
    deletedAt: P(t.deleted_at)
  };
}
function Ih(e) {
  const t = Se(e);
  return {
    available: !!t.available,
    reason: P(t.reason),
    releaseID: $(t.release_id),
    roleID: $(t.role_id),
    roleType: P(t.role_type),
    name: P(t.name) || "画布助手",
    assignment: P(t.assignment),
    agentID: $(t.agent_id),
    agentKey: P(t.agent_key),
    contextKey: P(t.context_key),
    openingEnabled: !!t.opening_enabled
  };
}
function Qd(e, t = 0, n = "第一幕") {
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
function Kc(e, t = 0) {
  const n = Se(e), r = $(
    Ie(n.asset_cate_id, t)
  );
  return af({
    id: $(n.id),
    name: P(n.name) || "第一幕",
    sort: $(n.sort),
    status: $(n.status) || 1,
    assetCateId: r,
    nextNodeNo: Math.max(1, $(n.next_node_no)),
    nodes: Yt(n.nodes).map(Fh).filter((s) => !!s),
    edges: Yt(n.edges).map(Xh).filter((s) => !!s),
    viewport: Zh(n.viewport),
    updatedAt: P(n.updated_at)
  });
}
function af(e) {
  let t = qc(e.nodes, e.nextNodeNo), n = t !== e.nextNodeNo;
  const r = e.nodes.map((s) => {
    if (!cf(s) || Number(s.nodeNo || 0) > 0)
      return s;
    const o = t++, i = s.titleMode || "manual";
    return n = !0, {
      ...s,
      nodeNo: o,
      titleMode: i,
      ...i === "auto" && !s.storyboardItem ? { title: df(s, o) } : {}
    };
  });
  return n ? { ...e, nextNodeNo: t, nodes: r } : e;
}
function qc(e, t = 1) {
  return Math.max(
    1,
    Number(t || 1),
    ...e.map((n) => Number(n.nodeNo || 0) + 1)
  );
}
function cf(e) {
  return e.type === "power" || e.type === "agent" || e.type === "flow";
}
function df(e, t) {
  let n = "节点";
  return e.type === "power" ? n = e.power?.name.trim() || lf(e) : e.type === "agent" ? n = String(e.role?.name || "智能体").trim() || "智能体" : e.type === "flow" && (n = String(e.flow?.name || "流程").trim() || "流程"), `${n}-${t}`;
}
function uf(e) {
  const t = Number(e.nodeNo || 0);
  if (t <= 0)
    return !1;
  const n = e.title.trim();
  return n === df(e, t).trim() ? !0 : e.type === "power" && n === `${lf(e)}-${t}`.trim();
}
function lf(e) {
  const t = cn(
    e.power,
    e.kind,
    e.outputType
  );
  return t.outputType !== "general" && t.outputName || t.kindName;
}
function vh(e) {
  const t = Se(e);
  return {
    roles: Yt(t.roles).map(Mh),
    powers: Yt(t.powers).map(pf),
    powerCategories: Yt(t.power_cates).map(by),
    powerKinds: Yt(t.power_kinds).map(Eh),
    outputTypes: Yt(t.output_types).map(gf)
  };
}
function ir(e) {
  return yf(Se(e));
}
function ff(e) {
  return e.assetCates.length > 0 ? e.assetCates : [Ga];
}
function Nh(e) {
  return ff(e)[0]?.id ?? 0;
}
function Ha(e, t) {
  const n = e.length > 0 ? e : [Ga];
  return n.find((r) => r.id === t) || n[0] || Ga;
}
function ba(e, t) {
  return Ha(e.assetCates, t);
}
function Sh(e, t) {
  return t === 0 ? e.flows.slice(0, 4) : e.flows.filter((n) => Jh(n).has(t)).slice(0, 4);
}
function Ch(e) {
  return e.create_status !== 2;
}
function kh(e) {
  return e.createStatus !== 2;
}
function Zi(e, t, n, r, s) {
  const o = r?.x ?? 420 + n % 3 * 190, i = r?.y ?? 610 + Math.floor(n / 3) * 170, c = s?.asset, a = s?.flow, d = s?.functionOption, u = s?.power, y = s?.role, h = u ? cn(u) : null, I = Number(c?.asset_cate_id || t.id), w = {
    asset: [
      c?.name || "资产引用",
      c ? Ld(c.kind) : Ld(t.kind),
      c && bl(c.version?.content) || "引用已有资产，作为其他节点的上下文。"
    ],
    power: [
      u?.name || Qh(t.kind),
      h?.outputName || h?.kindName || "能力节点",
      u ? `调用 ${u.name} 能力，按参数生成内容。` : "输入提示词和参数，直接生成文本、图片、视频或音频。"
    ],
    agent: [
      y?.name || "智能体节点",
      y?.role_type || "角色执行",
      y?.assignment || "调用团队角色或指定智能体完成一段任务。"
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
  }, [C, S, x] = w[e], T = wf(e, u);
  return {
    id: `local-${e}-${Date.now()}-${n}`,
    type: e,
    title: C,
    titleMode: e === "power" || e === "agent" || e === "flow" ? "auto" : void 0,
    subtitle: S,
    description: x,
    x: o,
    y: i,
    width: T.width,
    height: T.height,
    assetCateId: I,
    kind: c?.kind || u?.kind || t.kind,
    outputType: u?.outputType,
    cardinality: t.cardinality,
    asset: c,
    flow: a,
    functionOption: d,
    power: u,
    role: y,
    group: e === "group" ? { origin: "manual" } : void 0,
    local: !0
  };
}
function Rh(e) {
  const t = Se(e), n = Se(t.team);
  return {
    id: $(t.id),
    body_id: $(t.body_id),
    team_id: $(t.team_id),
    release_id: $(t.release_id),
    name: P(t.name) || "未命名作品",
    description: P(t.description),
    mode: P(t.mode) || "team",
    team: {
      id: $(n.id),
      name: P(n.name),
      version: $(n.version)
    }
  };
}
function xh(e) {
  const t = Se(e);
  return {
    id: $(t.id),
    name: P(t.name) || "自由团队",
    description: P(t.description)
  };
}
function Ah(e) {
  const t = Se(e);
  return {
    id: $(t.id),
    team_id: $(t.team_id),
    version: $(t.version),
    status: P(t.status)
  };
}
function Th(e) {
  return {
    id: $(e.id),
    team_id: $(e.team_id),
    name: P(e.name) || "未命名资产",
    kind: P(e.kind) || "text",
    cardinality: P(e.cardinality) || "single",
    status: $(e.status),
    sort: $(e.sort)
  };
}
function Mh(e) {
  return {
    id: $(e.id),
    team_id: $(e.team_id),
    role_type: P(e.role_type),
    role_key: P(e.role_key),
    name: P(e.name),
    agent_id: $(e.agent_id),
    assignment: P(e.assignment),
    create_status: mf(e.create_status)
  };
}
function Dh(e) {
  return {
    id: $(e.id),
    name: P(e.name),
    key: P(e.key),
    goal: P(e.goal),
    config: Se(e.config),
    status: $(e.status),
    sort: $(e.sort),
    output_asset_cate_ids: If(e.output_asset_cate_ids)
  };
}
function pf(e) {
  const t = P(e.kind) || "text", n = gf(Se(e.output)), r = P(e.output_type) || "general";
  return {
    id: $(e.id),
    cate_id: $(e.cate_id),
    name: P(e.name) || P(e.key) || "未命名能力",
    key: P(e.key),
    icon: P(e.icon),
    description: P(e.description),
    outputType: r,
    output: n.key ? n : void 0,
    kind: t,
    createStatus: mf(e.create_status)
  };
}
function mf(e) {
  return Number(e) === 2 ? 2 : 1;
}
function gf(e) {
  return {
    key: P(e.key),
    name: P(e.name),
    allowedKinds: bi(e.allowed_kinds),
    viewMode: P(e.view_mode),
    defaultWidth: $(e.default_width),
    defaultHeight: $(e.default_height),
    structured: !!e.structured,
    sort: $(e.sort)
  };
}
function Eh(e) {
  return {
    id: P(e.id),
    value: P(e.value) || P(e.name) || P(e.id)
  };
}
function yf(e) {
  const t = Gc(Se(e.version)), n = Wc(e.versions);
  return {
    id: $(e.id),
    project_id: $(Ie(e.project_id, e.projectID)),
    body_id: $(Ie(e.body_id, e.bodyID)),
    team_id: $(Ie(e.team_id, e.teamID)),
    flow_id: $(Ie(e.flow_id, e.flowID)),
    canvas_id: $(Ie(e.canvas_id, e.canvasID)),
    asset_cate_id: $(
      Ie(e.asset_cate_id, e.assetCateID)
    ),
    node_key: P(Ie(e.node_key, e.nodeKey)),
    name: P(e.name),
    kind: P(e.kind) || "text",
    role: P(e.role),
    version_id: $(Ie(e.version_id, e.versionID)),
    status: P(e.status),
    sort: $(e.sort),
    created_at: P(Ie(e.created_at, e.createdAt)),
    version: t,
    versions: n.length ? n : void 0
  };
}
function Gc(e) {
  const t = $(e.id);
  if (!(!t && e.content == null))
    return {
      id: t,
      asset_id: $(Ie(e.asset_id, e.assetID)),
      run_id: $(Ie(e.run_id, e.runID)),
      node_run_id: $(Ie(e.node_run_id, e.nodeRunID)),
      release_id: $(Ie(e.release_id, e.releaseID)),
      request_id: P(Ie(e.request_id, e.requestID)),
      node_key: P(Ie(e.node_key, e.nodeKey)),
      source: Se(e.source),
      version: $(e.version),
      summary: P(e.summary),
      content: e.content,
      created_at: P(Ie(e.created_at, e.createdAt)),
      updated_at: P(Ie(e.updated_at, e.updatedAt))
    };
}
function Wc(e) {
  return Yt(e).map(Gc).filter((t) => !!t);
}
function Ph(e) {
  const t = Se(e), n = {};
  for (const [r, s] of Object.entries(t)) {
    const o = Kc(s), i = o.id || $(r);
    i > 0 && (n[String(i)] = { ...o, id: i });
  }
  return n;
}
function Oh(e, t) {
  const n = new Map(
    t.filter((s) => s.id > 0).map((s) => [s.id, s])
  ), r = new Map(
    t.filter((s) => s.key).map((s) => [s.key, s])
  );
  for (const s of Object.values(e))
    s.nodes = s.nodes.map((o) => {
      if (o.type !== "power" || !o.power)
        return o;
      const i = n.get(Number(o.power.id || 0)) || r.get(o.power.key);
      if (!i)
        return o;
      const c = o.outputType || o.power.outputType || i.outputType;
      return {
        ...o,
        outputType: c,
        power: {
          ...i,
          outputType: c,
          output: i.outputType === c ? i.output : o.power.output
        }
      };
    });
  return e;
}
function No(e, t) {
  const n = String(e.id);
  return Oh({ [n]: e }, t)[n];
}
function Fh(e) {
  const t = P(e.id), n = P(e.type);
  if (!t || !n)
    return null;
  const r = P(e.run_error), s = P(e.title), o = gh(
    e.function_option,
    s
  ), i = P(e.description), c = o?.key === "import", a = {
    id: t,
    nodeNo: $(e.node_no) || void 0,
    type: n,
    title: c && s === "导入" ? "引用" : s,
    titleMode: P(e.title_mode) === "manual" ? "manual" : P(e.title_mode) === "auto" ? "auto" : void 0,
    subtitle: P(e.subtitle),
    description: c && (!i || i === "导入资产并连接到当前节点。") ? "选择资产并引用到当前节点。" : i,
    x: $(e.x),
    y: $(e.y),
    width: $(e.width),
    height: $(e.height),
    groupId: P(e.group_id),
    group: zh(e.group),
    storyboardItem: $h(e.storyboard_item),
    storyboardMaterializedSignature: P(
      e.storyboard_materialized_signature
    ),
    storyboardFramePlanVersion: Jr(
      e.storyboard_frame_plan_version
    ),
    assetCateId: $(e.asset_cate_id),
    outputType: P(e.output_type),
    count: e.count == null ? void 0 : $(e.count),
    functionOption: o,
    composerDraft: Wh(e.composer_draft),
    resultRef: Yh(e.result_ref),
    runTiming: $s(e.run_timing),
    resultOutput: e.result_output,
    resultView: Bh(e.result_view),
    runError: ys(r) ? "" : r,
    local: e.local !== !1
  }, d = P(e.kind), u = P(
    e.cardinality
  ), y = jh(e.flow), h = Lh(e.role), I = Vh(e.asset), w = Uh(e.power);
  return d && (a.kind = d), u && (a.cardinality = u), y && (a.flow = y), h && (a.role = h), I && (a.asset = I), w && (a.power = w, a.outputType = a.outputType || w.outputType, pr(w) && a.width === Zd.width && a.height === Zd.height && (a.width = Wa.width, a.height = Wa.height)), a;
}
function Bh(e) {
  const t = Se(e), n = zt(t.width), r = zt(t.height);
  if (n == null || r == null || n <= 0 || r <= 0)
    return;
  const s = zt(t.offset_x), o = zt(t.offset_y);
  return {
    width: n,
    height: r,
    ...s == null ? {} : { offsetX: s },
    ...o == null ? {} : { offsetY: o }
  };
}
function zh(e) {
  const t = Se(e);
  if (Object.keys(t).length)
    return {
      origin: P(t.origin),
      sourceNodeId: P(t.source_node_id),
      syncKey: P(t.sync_key),
      layoutKey: P(t.layout_key)
    };
}
function $h(e) {
  const t = Se(e), n = P(t.source_node_id), r = P(t.item_type), s = P(t.item_id);
  if (!n || !s || ![
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
    "speech",
    "subtitle",
    "lip_sync",
    "video_compose"
  ].includes(r))
    return;
  const o = Xe(t.generated_inputs) ? {
    referenceContent: _f(
      t.generated_inputs.reference_content
    ),
    voice: typeof t.generated_inputs.voice == "string" ? t.generated_inputs.voice : void 0
  } : void 0;
  return {
    sourceNodeId: n,
    itemType: r,
    itemId: s,
    generatedPrompt: P(t.generated_prompt),
    generatedInputs: o,
    dependencyNodeIds: bi(t.dependency_node_ids),
    referenceNodeIds: bi(t.reference_node_ids),
    externalReferenceAssetIds: If(t.external_reference_asset_ids),
    shotId: P(t.shot_id),
    shotImageMode: Pc(t.shot_image_mode),
    frameRole: Nl(t.frame_role),
    frameMediaItems: Ec(t.frame_media_items),
    imageSequenceFrames: vl(
      t.image_sequence_frames
    ),
    speechId: P(t.speech_id),
    speechIds: bi(t.speech_ids),
    characterId: P(t.character_id),
    speechKind: P(t.speech_kind),
    speakerMode: P(t.speaker_mode),
    startTime: zt(t.start_time),
    shotDuration: zt(t.shot_duration),
    requiredDurationValues: Il(
      t.required_duration_values
    ),
    continuityAnchor: P(t.continuity_anchor),
    sharedEndShotId: P(t.shared_end_shot_id),
    optional: t.optional === !0 || t.optional === 1 || String(t.optional || "").toLowerCase() === "true"
  };
}
function jh(e) {
  const t = Se(e), n = $(t.id), r = P(t.key), s = P(t.name);
  if (!(!n && !r && !s))
    return {
      id: n,
      key: r,
      name: s,
      goal: P(t.goal)
    };
}
function Lh(e) {
  const t = Se(e), n = $(t.id), r = P(t.name);
  if (!(!n && !r))
    return {
      id: n,
      name: r,
      role_type: P(t.role_type),
      agent_id: $(t.agent_id)
    };
}
function Vh(e) {
  const t = Se(e), n = $(t.id);
  if (n)
    return {
      id: n,
      project_id: 0,
      body_id: 0,
      team_id: 0,
      flow_id: 0,
      asset_cate_id: $(t.asset_cate_id),
      name: P(t.name),
      kind: P(t.kind),
      role: P(t.role),
      version_id: $(t.version_id),
      sort: 0
    };
}
function Uh(e) {
  const t = Se(e), n = $(t.id), r = P(t.key);
  if (!(!n && !r))
    return pf({
      ...t,
      id: n,
      key: r,
      name: P(t.name)
    });
}
function hf(e) {
  const t = Se(e);
  if (!Object.keys(t).length)
    return;
  const n = P(t.storyboardGridLayout);
  return {
    prompt: P(t.prompt),
    promptContent: _f(t.promptContent),
    paramValues: Se(t.paramValues),
    paramBindings: gr(t.paramBindings),
    selectedTargetId: $(t.selectedTargetId),
    videoComposition: $c(t.videoComposition),
    storyboardReferences: wl(
      t.storyboardReferences
    ),
    storyboardWorkType: Hh(t.storyboardWorkType),
    storyboardLyricsSourceNodeId: P(t.storyboardLyricsSourceNodeId),
    minShotDuration: _l(t.minShotDuration),
    storyboardRangeStartMs: tu(
      t.storyboardRangeStartMs,
      !0
    ),
    storyboardRangeEndMs: tu(
      t.storyboardRangeEndMs,
      !1
    ),
    storyboardGridLayout: n ? hl(n) : void 0,
    multiImageMode: Gh(t.multiImageMode)
  };
}
function Hc(e) {
  return hf(e) || {
    prompt: "",
    paramValues: {},
    selectedTargetId: 0
  };
}
function Kh(e) {
  const t = Hc(e), n = qh(t.promptContent);
  return n ? { ...t, prompt: n } : t;
}
function eu(e) {
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
function i0(e) {
  return JSON.stringify(
    (e?.parts || []).filter((t) => t.type === "reference")
  );
}
function qh(e) {
  return e?.parts?.some((t) => t.type === "reference") ? e.parts.map((t) => {
    if (t.type === "text")
      return t.text;
    const n = String(t.label || "").trim();
    return n.startsWith("@") ? n : `@${n}`;
  }).join("") : "";
}
function Gh(e) {
  const t = P(e);
  return t === "per_image" || t === "shared_reference" ? t : void 0;
}
function Wh(e) {
  const t = Se(e);
  if (Object.keys(t).length)
    return hf({
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
function Hh(e) {
  const t = P(e);
  return Dc(t) ? t : void 0;
}
function tu(e, t) {
  const n = zt(e);
  if (!(n == null || !Number.isInteger(n) || n < (t ? 0 : 1)))
    return n;
}
function _f(e) {
  const t = Se(e), n = Array.isArray(t.parts) ? t.parts.filter((r) => {
    const s = Se(r);
    return s.type === "text" || s.type === "reference";
  }) : [];
  if (!(Number(t.version) !== 1 || n.length === 0))
    return { version: 1, parts: n };
}
function Yh(e) {
  const t = Se(e);
  if (Object.keys(t).length)
    return {
      run_id: $(t.run_id),
      request_id: P(t.request_id),
      flow_run_id: $(t.flow_run_id),
      node_run_id: $(t.node_run_id),
      asset_id: $(t.asset_id),
      version_id: $(t.version_id),
      release_id: $(t.release_id),
      role: P(t.role),
      status: P(t.status),
      updated_at: P(t.updated_at)
    };
}
function Xh(e) {
  const t = P(e.from), n = P(e.to);
  if (!t || !n)
    return null;
  const r = P(e.purpose);
  return {
    id: P(e.id) || `edge-${t}-${n}`,
    from: t,
    to: n,
    logicalFrom: P(e.logical_from) || void 0,
    logicalTo: P(e.logical_to) || void 0,
    purpose: r === "media" || r === "structure" || r === "dependency" ? r : void 0,
    executionMode: P(e.execution_mode) === "manual" ? "manual" : void 0,
    mediaUsage: P(e.media_usage) || void 0
  };
}
function Zh(e) {
  const t = Se(e), n = {};
  return t.x != null && (n.x = $(t.x)), t.y != null && (n.y = $(t.y)), t.zoom != null && (n.zoom = $(t.zoom)), n;
}
function Jh(e) {
  return new Set(e.output_asset_cate_ids);
}
function Qh(e) {
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
function wf(e, t) {
  switch (e) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...Ey };
    case "power":
      return Ji(t);
    default:
      return { width: 250, height: 170 };
  }
}
function Ji(e) {
  if (tl(e))
    return bf();
  if (vc(e))
    return { ...wh };
  if (pr(e))
    return { ...Wa };
  const t = e_(e);
  return t || { ..._h };
}
function bf(e) {
  return {
    ...Jd,
    height: e?.selected_inspiration_id ? 210 : Jd.height
  };
}
function e_(e) {
  const t = Number(e?.output?.defaultWidth || 0), n = Number(e?.output?.defaultHeight || 0);
  return t > 0 && n > 0 ? { width: t, height: n } : null;
}
function Ya(e) {
  const t = wf(
    e.type,
    e.power || {
      kind: String(e.kind || ""),
      outputType: e.outputType || ""
    }
  );
  return e.width === t.width && e.height === t.height;
}
function bi(e) {
  return Array.isArray(e) ? e.map(P).filter(Boolean) : [];
}
function If(e) {
  if (!Array.isArray(e))
    return [];
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const s = $(r);
    !s || s <= 0 || n.has(s) || (n.add(s), t.push(s));
  }
  return t;
}
function Yt(e) {
  return Array.isArray(e) ? e.filter(Xe) : [];
}
function Se(e) {
  return Xe(e) ? e : {};
}
function P(e) {
  return e == null ? "" : String(e).trim();
}
function t_(e) {
  const t = new Map(e.nodes.map((s) => [s.id, s]));
  let n = !1;
  const r = e.nodes.map((s) => {
    const o = s.storyboardItem?.dependencyNodeIds || [];
    if (s.storyboardItem?.itemType !== "shot" || !s.storyboardItem.continuityAnchor || o.length !== 1)
      return s;
    const i = o[0], c = n_(t.get(i)), a = (s.storyboardItem.referenceNodeIds || []).filter(
      (I) => I !== i
    ), d = s.composerDraft?.promptContent, u = d && {
      ...d,
      parts: d.parts.filter(
        (I) => I.type !== "reference" || I.ref_type !== "asset" || !c || Number(I.ref_id || 0) !== c
      )
    }, y = a.length !== (s.storyboardItem.referenceNodeIds || []).length, h = u?.parts.length !== d?.parts.length;
    return !y && !h ? s : (n = !0, {
      ...s,
      storyboardItem: {
        ...s.storyboardItem,
        referenceNodeIds: a
      },
      composerDraft: s.composerDraft ? { ...s.composerDraft, promptContent: u } : s.composerDraft
    });
  });
  return n ? { ...e, nodes: r } : e;
}
function n_(e) {
  return Number(e?.asset?.id || e?.resultRef?.asset_id || 0);
}
function vf(e) {
  return {
    asset_cate_id: Number(e.assetCateId || 0),
    next_node_no: Math.max(1, Number(e.nextNodeNo || 1)),
    nodes: e.nodes.map(r_),
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
function r_(e) {
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
  if (ps(t, "node_no", e.nodeNo), e.titleMode && (t.title_mode = e.titleMode), Ht(t, "group_id", e.groupId), e.group) {
    const i = {};
    Ht(i, "origin", e.group.origin), Ht(i, "source_node_id", e.group.sourceNodeId), Ht(i, "sync_key", e.group.syncKey), Ht(i, "layout_key", e.group.layoutKey), Object.keys(i).length > 0 && (t.group = i);
  }
  if (e.storyboardItem) {
    const i = e.storyboardItem, c = Pc(i.shotImageMode), a = Nl(i.frameRole), d = Ec(
      i.frameMediaItems
    ), u = vl(
      i.imageSequenceFrames
    ), y = Il(
      i.requiredDurationValues
    );
    t.storyboard_item = {
      source_node_id: i.sourceNodeId,
      item_type: i.itemType,
      item_id: i.itemId,
      ...i.generatedPrompt ? { generated_prompt: i.generatedPrompt } : {},
      ...i.generatedInputs ? {
        generated_inputs: {
          reference_content: i.generatedInputs.referenceContent,
          voice: i.generatedInputs.voice
        }
      } : {},
      dependency_node_ids: i.dependencyNodeIds || [],
      reference_node_ids: i.referenceNodeIds || [],
      external_reference_asset_ids: i.externalReferenceAssetIds || [],
      ...i.shotId ? { shot_id: i.shotId } : {},
      ...c ? { shot_image_mode: c } : {},
      ...a ? { frame_role: a } : {},
      ...d.length ? {
        frame_media_items: d.map((h) => ({
          frame_role: h.frameRole,
          media_index: h.mediaIndex
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
      ...y.length > 0 ? { required_duration_values: y } : {},
      ...i.sharedEndShotId ? { shared_end_shot_id: i.sharedEndShotId } : {},
      ...i.continuityAnchor ? { continuity_anchor: i.continuityAnchor } : {},
      ...i.optional ? { optional: !0 } : {}
    };
  }
  Ht(
    t,
    "storyboard_materialized_signature",
    e.storyboardMaterializedSignature
  ), ps(
    t,
    "storyboard_frame_plan_version",
    Jr(e.storyboardFramePlanVersion)
  ), ps(t, "asset_cate_id", e.assetCateId), Ht(t, "kind", e.kind), Ht(t, "output_type", e.outputType), Ht(t, "cardinality", e.cardinality), ps(t, "count", e.count), e.flow && (t.flow = {
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
    output: i_(e.power.output)
  }), e.functionOption && (t.function_option = {
    key: e.functionOption.key,
    label: e.functionOption.label,
    description: e.functionOption.description
  });
  const n = s_(e.composerDraft);
  n && (t.composer_draft = n);
  const r = u_(e.resultRef);
  r && (t.result_ref = r), e.runTiming?.startedAt && e.runTiming.finishedAt && (t.run_timing = {
    started_at: e.runTiming.startedAt,
    finished_at: e.runTiming.finishedAt
  }), !(Number(r?.asset_id || 0) > 0 && Number(r?.version_id || 0) > 0) && e.resultOutput != null && cr(e.resultOutput) && (t.result_output = e.resultOutput);
  const o = o_(e.resultView);
  return o && (t.result_view = o), ys(e.runError) || Ht(t, "run_error", e.runError), e.local != null && (t.local = e.local), t;
}
function o_(e) {
  if (!e)
    return;
  const t = zt(e.width), n = zt(e.height);
  if (t == null || n == null || t <= 0 || n <= 0)
    return;
  const r = { width: t, height: n }, s = zt(e.offsetX), o = zt(e.offsetY);
  return s != null && (r.offset_x = s), o != null && (r.offset_y = o), r;
}
function s_(e) {
  if (!Xe(e))
    return null;
  const t = {};
  Ht(t, "prompt", e.prompt);
  const n = a_(e.promptContent);
  n && cr(n) && (t.prompt_content = n), ps(t, "selected_target_id", e.selectedTargetId);
  const r = c_(e.paramValues);
  r && (t.param_values = r);
  const s = ah(e.paramBindings);
  s && (t.param_bindings = s);
  const o = $c(e.videoComposition);
  o && cr(o) && (t.video_composition = o);
  const i = wl(
    e.storyboardReferences
  );
  i.length > 0 && cr(i) && (t.storyboard_references = i), Dc(e.storyboardWorkType) && (t.storyboard_work_type = e.storyboardWorkType), Ht(
    t,
    "storyboard_lyrics_source_node_id",
    e.storyboardLyricsSourceNodeId
  );
  const c = _l(e.minShotDuration);
  c != null && (t.min_shot_duration = c);
  const a = zt(e.storyboardRangeStartMs);
  a != null && Number.isInteger(a) && a >= 0 && (t.storyboard_range_start_ms = a);
  const d = zt(e.storyboardRangeEndMs);
  return d != null && Number.isInteger(d) && d > 0 && (t.storyboard_range_end_ms = d), e.storyboardGridLayout && (t.storyboard_grid_layout = hl(
    e.storyboardGridLayout
  )), (e.multiImageMode === "per_image" || e.multiImageMode === "shared_reference") && (t.multi_image_mode = e.multiImageMode), Object.keys(t).length ? t : null;
}
function i_(e) {
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
function a_(e) {
  if (!(!Xe(e) || Number(e.version || 0) !== 1 || !Array.isArray(e.parts)))
    return e;
}
function c_(e) {
  if (!Xe(e))
    return null;
  const t = {};
  for (const [n, r] of Object.entries(e))
    d_(r) || cr(r) && (t[n] = r);
  return Object.keys(t).length ? t : null;
}
function d_(e) {
  return Xe(e) ? !!(e.file || e.blob || e.preview || e.progress != null || e.uploading != null) : !1;
}
function u_(e) {
  if (!Xe(e))
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
    r != null && cr(r) && (t[n] = r);
  }
  return Object.keys(t).length ? t : null;
}
function Ht(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n);
}
function ps(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function cr(e) {
  return e == null || ["string", "number", "boolean"].includes(typeof e) ? !0 : Array.isArray(e) ? e.every(cr) : Xe(e) ? Object.values(e).every(cr) : !1;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Di = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Di || Object.keys(Di).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ce = Di.joinSiteApi, ke = Di.request;
async function l_(e, t = 0, n = 0) {
  const r = await ke(Ce("workspace/bootstrap"), "get", {
    project_id: e,
    canvas_id: t,
    asset_cate_id: n
  });
  return bh(
    zo(r, "加载创作空间失败")
  );
}
async function cs(e) {
  const t = await ke(Ce("workspace/canvas"), "get", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    asset_cate_id: e.assetCateId || 0
  }), n = qe(t, "加载分类画布失败"), r = n.assets || {}, s = Array.isArray(r.items) ? r.items : Array.isArray(r) ? r : [];
  return {
    canvas: Kc(n.canvas, e.assetCateId || 0),
    assets: s.map(ir),
    canvasList: Array.isArray(n.canvas_list) ? n.canvas_list.map(Xi) : []
  };
}
function Ls(e) {
  const t = Xe(e) ? e : {}, n = Xe(t.canvas) ? t.canvas : null;
  return {
    canvas: n && Array.isArray(n.nodes) ? Kc(n) : void 0,
    canvasList: Array.isArray(t.canvas_list) ? t.canvas_list.map(Xi) : [],
    activeCanvasId: Number(t.active_canvas_id || 0) || void 0
  };
}
async function f_(e) {
  const t = await ke(Ce("workspace/canvas_create"), "post", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId,
    name: e.name || ""
  });
  return Ls(
    qe(t, "创建画布失败")
  );
}
async function p_(e) {
  const t = await ke(Ce("workspace/canvas_rename"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId,
    name: e.name
  });
  return Ls(
    qe(t, "重命名画布失败")
  );
}
async function m_(e) {
  const t = await ke(
    Ce("workspace/canvas_reorder"),
    "post",
    {
      project_id: e.projectId,
      asset_cate_id: e.assetCateId,
      canvas_ids: e.canvasIds
    }
  );
  return Ls(
    qe(t, "调整画布顺序失败")
  );
}
async function g_(e) {
  const t = await ke(Ce("workspace/canvas_delete"), "post", {
    project_id: e.projectId,
    canvas_id: e.canvasId
  });
  return Ls(
    qe(t, "删除画布失败")
  );
}
async function y_(e) {
  const t = await ke(Ce("workspace/canvas_deleted"), "get", {
    project_id: e.projectId,
    asset_cate_id: e.assetCateId
  }), n = qe(t, "加载已删除画布失败");
  return Array.isArray(n.items) ? n.items.map(Xi) : [];
}
async function h_(e) {
  const t = await ke(
    Ce("workspace/canvas_restore"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId
    }
  );
  return Ls(
    qe(t, "恢复画布失败")
  );
}
async function __(e) {
  const t = await ke(Ce("project/canvas_config"), "get", {
    project_id: e
  });
  return vh(
    zo(t, "加载能力列表失败")
  );
}
async function w_(e) {
  const t = await ke(
    Ce("project/canvas_power_form"),
    "get",
    {
      project_id: e.projectId,
      flow_id: e.flowId || 0,
      power_id: e.powerId,
      power_key: e.powerKey,
      target_id: e.targetId || 0
    }
  );
  return E_(
    zo(t, "加载能力参数失败")
  );
}
async function b_(e) {
  const t = vf(t_(e.canvas)), n = e.canvas.nodes.find(
    (a) => a.id === e.startNodeId
  ), r = n?.group?.origin === "script" ? n.group : e.canvas.nodes.find((a) => a.id === n?.groupId)?.group, s = e.executionScope === "storyboard_frame" ? n?.id : n?.storyboardItem?.sourceNodeId || (r?.origin === "script" ? r.sourceNodeId : void 0), o = e.canvas.nodes.find(
    (a) => a.id === s
  ), i = [
    o?.asset?.version?.content,
    o?.resultOutput
  ].find((a) => {
    const d = bn(a);
    return d && Es(d);
  });
  if (i != null) {
    const a = t.nodes.find((d) => d.id === s);
    a && (a.result_output = i);
  }
  const c = await ke(
    Ce("workspace/canvas_execute"),
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
  return qe(c, "画布运行失败");
}
async function I_(e) {
  const t = await ke(
    Ce("workspace/canvas_node_title"),
    "post",
    {
      project_id: e.projectId,
      node_key: e.nodeKey,
      version_id: e.versionId,
      prompt: e.prompt || ""
    },
    { reportError: !1 }
  ), n = qe(t, "生成节点标题失败");
  return {
    nodeKey: String(n.node_key || e.nodeKey),
    versionId: Number(n.version_id || e.versionId || 0),
    title: String(n.title || "").trim()
  };
}
function Vs(e, t, n) {
  const r = qe(e, t).asset;
  if (!r)
    throw new Error(n);
  return ir(r);
}
async function Ei(e) {
  const t = await ke(
    Ce("workspace/canvas_execution_list"),
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
    },
    // 恢复观察自行重试，历史列表在画布面板显示错误。
    { reportError: !1 }
  ), n = qe(t, "读取画布运行记录失败");
  return {
    count: Number(n.count || 0),
    items: Array.isArray(n.items) ? n.items : [],
    hasMore: !!n.has_more,
    beforeId: Number(n.before_id || 0)
  };
}
async function Ia(e, t) {
  const n = [...new Set((e.runIds || []).filter((i) => i > 0))], r = [], s = 50;
  if (n.length > 0) {
    for (let i = 0; i < n.length; i += s) {
      t?.throwIfAborted();
      const c = await Ei({
        ...e,
        runIds: n.slice(i, i + s),
        limit: s
      });
      t?.throwIfAborted(), r.push(...c.items);
    }
    return r;
  }
  let o = e.beforeId || 0;
  for (; ; ) {
    t?.throwIfAborted();
    const i = await Ei({ ...e, beforeId: o, limit: s });
    if (t?.throwIfAborted(), r.push(...i.items), !i.hasMore) return r;
    if (i.beforeId <= 0 || o > 0 && i.beforeId >= o)
      throw new Error("读取画布运行记录的分页位置无效");
    o = i.beforeId;
  }
}
async function v_(e) {
  const t = Number(e.executionId || 0), n = String(e.requestId || "").trim(), r = Number(e.runId || 0), s = await ke(
    Ce("workspace/canvas_execution"),
    "get",
    {
      project_id: e.projectId,
      execution_id: t,
      request_id: t > 0 ? "" : n,
      run_id: t > 0 || n ? 0 : r
    },
    { reportError: !1 }
  );
  return qe(s, "读取画布运行详情失败");
}
async function N_(e) {
  const t = await ke(Ce("run/approval"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    request_id: e.requestId,
    node_key: e.nodeKey,
    approval_id: e.approvalId || 0,
    data: e.feedback || {},
    decision: e.decision || "approved",
    comment: e.comment || ""
  });
  return zo(t, "继续画布运行失败");
}
async function S_(e) {
  const t = await ke(
    Ce("run/status"),
    "get",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || "",
      view: "summary"
    },
    { reportError: e.reportError }
  );
  return zo(t, "读取流程状态失败");
}
async function Nf(e) {
  const t = await ke(
    Ce("run/stop"),
    "post",
    {
      project_id: e.projectId,
      run_id: e.runId || 0,
      request_id: e.requestId || ""
    },
    { reportError: e.reportError }
  );
  return qe(t, "停止画布运行失败");
}
async function C_(e, t) {
  const n = await ke(
    Ce("workspace/canvas_stop_all"),
    "post",
    { project_id: e, canvas_id: t }
  ), r = qe(n, "停止全部画布运行失败");
  return {
    count: Number(r.count || 0),
    stoppedCount: Number(r.stopped_count || 0),
    failedCount: Number(r.failed_count || 0),
    items: Array.isArray(r.items) ? r.items : []
  };
}
async function k_(e) {
  const t = await ke(Ce("run/interaction"), "post", {
    project_id: e.projectId,
    run_id: e.runId,
    node_run_id: e.nodeRunId || 0,
    interaction_id: e.interactionId,
    data: e.data
  });
  return zo(t, "提交信息失败");
}
async function R_(e) {
  const t = await ke(
    Ce("project/update_asset_version"),
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
  return Vs(
    t,
    "保存资产版本失败",
    "资产版本保存结果为空"
  );
}
async function a0(e) {
  const t = await ke(
    Ce("project/restore_asset_version"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Vs(
    t,
    "恢复资产版本失败",
    "资产版本恢复结果为空"
  );
}
async function x_(e) {
  const t = await ke(
    Ce("project/confirm_storyboard"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      production_plan: e.productionPlan
    }
  );
  return Vs(t, "确认分镜失败", "确认分镜结果为空");
}
async function c0(e) {
  const t = await ke(
    Ce("project/create_storyboard_revision"),
    "post",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId,
      request_id: e.requestId,
      node_key: e.nodeKey
    }
  );
  return Vs(
    t,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空"
  );
}
async function d0(e) {
  const t = e.storyboard.shots.findIndex(
    (o) => o.id === e.shotId
  );
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = await ke(
    Ce("project/generate_storyboard_shot"),
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
  ), r = qe(n, "生成镜头失败"), s = oy(r, t);
  if (!s || s.shot.id !== e.shotId)
    throw new Error("生成镜头结果格式无效");
  return s;
}
async function A_(e) {
  const t = await ke(
    Ce("project/asset_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      current_only: e.currentOnly ? 1 : 0
    },
    { reportError: e.reportError }
  ), n = qe(t, "读取资产详情失败"), r = n.asset;
  if (!r)
    throw new Error("资产详情为空");
  const s = Wc(n.versions);
  return {
    asset: ir(r),
    versions: s,
    versionTotal: Number(n.version_total || s.length),
    hasMore: !!n.has_more
  };
}
async function u0(e) {
  const t = await ke(
    Ce("project/asset_versions"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      page: e.page,
      page_size: e.pageSize || 20
    },
    { reportError: e.reportError }
  ), n = qe(t, "读取资产版本失败"), r = Wc(n.items);
  return {
    items: r,
    page: Number(n.page || e.page || 1),
    pageSize: Number(n.page_size || e.pageSize || 20),
    total: Number(n.total || r.length),
    hasMore: !!n.has_more
  };
}
async function l0(e) {
  const t = await ke(
    Ce("project/asset_version_detail"),
    "get",
    {
      project_id: e.projectId,
      asset_id: e.assetId,
      version_id: e.versionId
    },
    { reportError: e.reportError }
  ), n = qe(t, "读取历史版本失败").version, r = Gc(
    n && typeof n == "object" && !Array.isArray(n) ? n : {}
  );
  if (!r?.id)
    throw new Error("历史版本内容为空");
  return r;
}
function T_(e) {
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
async function Sf(e, t) {
  const n = await ke(Ce("project/save_asset"), "post", {
    ...T_(t),
    role: e
  });
  return Vs(n, "保存资产失败", "保存资产结果为空");
}
function M_(e) {
  return Sf("work", e);
}
function nu(e) {
  return Sf("material", e);
}
async function D_(e) {
  const t = await ke(
    Ce("workspace/canvas"),
    "post",
    {
      project_id: e.projectId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      canvas: vf(e.canvas)
    },
    // 保存状态、首次失败和重试由 useCanvasAutosave 统一处理。
    { reportError: !1 }
  ), n = qe(t, "保存画布失败");
  return {
    canvasId: Number(n.canvas_id || e.canvasId || 0),
    assetCateId: Number(n.asset_cate_id || e.assetCateId || 0),
    updatedAt: String(n.updated_at || e.canvas.updatedAt || "")
  };
}
function E_(e) {
  const t = Xe(e) ? e : {}, n = Xe(t.power) ? t.power : {}, r = Xe(n.output) ? n.output : {}, s = B_(
    t.storyboard_work_types
  ), o = z_(
    t.storyboard_reference_purposes,
    s
  ), i = ry(
    t.storyboard_min_shot_durations
  ), c = String(n.output_type || n.outputType || "").trim(), a = String(
    r.view_mode || r.viewMode || ""
  ).trim();
  if ((c === "storyboard" || a === "storyboard") && (s.length === 0 || o.length === 0 || i.length === 0))
    throw new Error("分镜作品类型、参考用途或最短时长注册信息缺失");
  const d = new Set(
    o.map((u) => u.key)
  );
  if (s.some(
    (u) => u.required_reference_purposes.some(
      (y) => !d.has(y)
    )
  ))
    throw new Error("分镜作品类型引用了未知的参考用途");
  return {
    ...t,
    sources: P_(t.sources),
    params: Array.isArray(t.params) ? t.params : [],
    selected_target_id: Number(t.selected_target_id || 0),
    source_rule: Number(t.source_rule || 0),
    primary_param_key: String(t.primary_param_key || ""),
    storyboard_work_types: s,
    storyboard_reference_purposes: o,
    storyboard_min_shot_durations: i
  };
}
function P_(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = Xe(t) ? t : {}, r = Xe(n.supported_options) ? Object.fromEntries(
      Object.entries(n.supported_options).map(([s, o]) => [s.trim(), hs(o)]).filter(([s, o]) => s !== "" && o.length > 0)
    ) : void 0;
    return {
      ...n,
      supported_options: r && Object.keys(r).length > 0 ? r : void 0
    };
  }) : [];
}
const O_ = /* @__PURE__ */ new Set(["image", "video", "audio"]), F_ = /* @__PURE__ */ new Set([
  "global",
  "material",
  "shot",
  "composition",
  "context"
]);
function B_(e) {
  if (!Array.isArray(e))
    return [];
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => {
    const r = Xe(n) ? n : {}, s = String(r.key || "").trim().toLowerCase();
    if (!Dc(s) || t.has(s))
      throw new Error("分镜作品类型注册信息无效");
    const o = Number(r.sort || 0);
    if (!Number.isInteger(o))
      throw new Error("分镜作品类型注册信息无效");
    return t.add(s), {
      key: s,
      name: String(r.name || "").trim() || s,
      sort: o,
      required_reference_purposes: hs(
        r.required_reference_purposes
      )
    };
  }).sort((n, r) => n.sort - r.sort);
}
function z_(e, t) {
  if (!Array.isArray(e))
    return [];
  const n = new Set(t.map((s) => s.key)), r = /* @__PURE__ */ new Set();
  return e.map((s) => {
    const o = Xe(s) ? s : {}, i = String(o.key || "").trim(), c = hs(o.media_kinds), a = String(
      o.scope || ""
    ).trim(), d = hs(
      o.work_types
    ), u = hs(
      o.default_media_kinds
    ), y = String(o.material_type || "").trim(), h = Number(o.max_count || 0), I = Number(o.sort || 0);
    if (!i || r.has(i) || c.length === 0 || c.some(
      (w) => !O_.has(w)
    ) || !F_.has(a) || d.some((w) => !n.has(w)) || u.some((w) => !c.includes(w)) || a === "material" && y !== "character" && y !== "scene" && y !== "prop" || a !== "material" && y || !Number.isInteger(h) || h < 0 || !Number.isInteger(I))
      throw new Error("分镜参考用途注册信息无效");
    return r.add(i), {
      key: i,
      name: String(o.name || "").trim() || i,
      media_kinds: c,
      work_types: d,
      scope: a,
      material_type: y,
      default_media_kinds: u,
      max_count: h,
      sort: I
    };
  }).sort((s, o) => s.sort - o.sort);
}
function hs(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
const ru = 520, $_ = 8e3;
function j_({
  projectId: e,
  enabled: t,
  canvases: n,
  setCanvases: r,
  onError: s
}) {
  const o = W(n), i = W({}), c = W({}), a = W({}), d = W(/* @__PURE__ */ new Map()), u = W({}), y = W(0), h = W(null), [I, w] = q(0), [C, S] = q({});
  ue(() => {
    o.current = n;
  }, [n]);
  const x = E((D) => {
    const V = u.current[D];
    V != null && (window.clearTimeout(V), delete u.current[D]);
  }, []), T = E(
    (D, V = ru) => {
      if (!t || !e || typeof window > "u")
        return;
      x(D);
      const G = y.current;
      u.current[D] = window.setTimeout(() => {
        delete u.current[D], h.current?.(D, G)?.catch(() => {
        });
      }, V);
    },
    [x, t, e]
  ), U = E(
    async (D, V, G) => {
      if (V !== y.current || !t || !e)
        return;
      for (; d.current.has(D); )
        if (await d.current.get(D), V !== y.current)
          return;
      const K = G?.revision ?? i.current[D] ?? 0;
      if (K <= (c.current[D] || 0))
        return;
      const ne = G?.canvas || o.current[D];
      if (!ne)
        return;
      const H = (async () => {
        S((fe) => ({ ...fe, [D]: "saving" }));
        try {
          const fe = await D_({
            projectId: e,
            canvasId: ne.id,
            assetCateId: ne.assetCateId,
            canvas: ne
          });
          if (V !== y.current)
            return;
          c.current[D] = Math.max(
            c.current[D] || 0,
            K
          ), a.current[D] = 0, (i.current[D] || 0) === K ? (r((pe) => {
            const Ee = pe[D], Le = fe.updatedAt || Ee?.updatedAt;
            return !Ee || Ee.updatedAt === Le ? pe : {
              ...pe,
              [D]: { ...Ee, updatedAt: Le }
            };
          }), S((pe) => ({
            ...pe,
            [D]: "saved"
          }))) : S((pe) => ({
            ...pe,
            [D]: "dirty"
          }));
        } catch (fe) {
          if (V !== y.current)
            return;
          const be = (a.current[D] || 0) + 1;
          throw a.current[D] = be, S((pe) => ({ ...pe, [D]: "error" })), be === 1 && s(fe), T(
            D,
            Math.min($_, ru * 2 ** be)
          ), fe;
        } finally {
          V === y.current && (i.current[D] || 0) > (c.current[D] || 0) && (a.current[D] || 0) === 0 && T(D);
        }
      })();
      d.current.set(D, H);
      try {
        await H;
      } finally {
        d.current.get(D) === H && d.current.delete(D);
      }
    },
    [t, s, e, T, r]
  );
  h.current = U;
  const ee = E(
    async (D) => {
      if (!t || !e)
        throw new Error("画布尚未就绪，无法开始运行");
      const V = String(D.id), G = y.current, K = (i.current[V] || 0) + 1;
      if (i.current[V] = K, a.current[V] = 0, x(V), S((ne) => ({ ...ne, [V]: "dirty" })), await U(V, G, { canvas: D, revision: K }), G !== y.current)
        throw new Error("画布状态已更新，请重新运行");
    },
    [x, t, e, U]
  ), Z = E((D) => {
    const V = String(D);
    i.current[V] = (i.current[V] || 0) + 1, a.current[V] = 0, S((G) => ({ ...G, [V]: "dirty" })), w((G) => G + 1);
  }, []), oe = E((D) => {
    if (D != null) {
      const V = String(D);
      return d.current.has(V) || (i.current[V] || 0) > (c.current[V] || 0);
    }
    return d.current.size > 0 || Object.entries(i.current).some(
      ([V, G]) => G > (c.current[V] || 0)
    );
  }, []), X = E(async () => {
    const D = y.current;
    for (; oe(); ) {
      const V = /* @__PURE__ */ new Set([
        ...d.current.keys(),
        ...Object.keys(i.current).filter(
          (G) => i.current[G] > (c.current[G] || 0)
        )
      ]);
      if (await Promise.all(
        [...V].map(async (G) => {
          x(G), await U(G, D);
        })
      ), D !== y.current)
        throw new Error("画布状态已更新，请重试");
    }
  }, [x, oe, U]), O = E(
    (D) => {
      y.current += 1, o.current = D;
      for (const G of Object.keys(u.current))
        x(G);
      i.current = {}, c.current = {}, a.current = {}, d.current.clear();
      const V = {};
      for (const G of Object.keys(D))
        V[G] = "saved";
      S(V);
    },
    [x]
  ), we = E(
    (D) => {
      const V = String(D.id);
      x(V);
      const G = (i.current[V] || 0) + 1;
      i.current[V] = G, c.current[V] = G, a.current[V] = 0, S((K) => ({ ...K, [V]: "saved" }));
    },
    [x]
  ), ve = E(
    (D) => {
      const V = String(D);
      x(V), delete i.current[V], delete c.current[V], delete a.current[V], S((G) => {
        if (!Object.prototype.hasOwnProperty.call(G, V))
          return G;
        const K = { ...G };
        return delete K[V], K;
      });
    },
    [x]
  );
  return ue(() => {
    for (const [D, V] of Object.entries(i.current))
      V > (c.current[D] || 0) && T(D);
  }, [T, I]), ue(
    () => () => {
      y.current += 1;
      for (const D of Object.values(u.current))
        window.clearTimeout(D);
      u.current = {};
    },
    []
  ), {
    markCanvasDirty: Z,
    flushCanvasSave: ee,
    flushPendingCanvasSaves: X,
    hasPendingCanvasSaves: oe,
    adoptCanvasSnapshot: we,
    forgetCanvasSnapshot: ve,
    resetCanvasAutosave: O,
    canvasSaveStatus: C
  };
}
function L_() {
  const e = /* @__PURE__ */ new Map(), t = (n, r, s) => JSON.stringify([n, r, s]);
  return {
    subscribe(n, r, s, o) {
      const i = t(n, r, s), c = e.get(i) || /* @__PURE__ */ new Set();
      return c.add(o), e.set(i, c), () => {
        c.delete(o), c.size === 0 && e.delete(i);
      };
    },
    publish(n, r) {
      const s = t(
        n,
        Number(r.canvas_id || 0),
        String(r.request_id || "")
      );
      for (const o of e.get(s) || []) o(r);
    },
    clear() {
      e.clear();
    }
  };
}
const V_ = 6e4, U_ = 60;
class K_ {
  scopeKey = "";
  catalogs = /* @__PURE__ */ new Map();
  powerForms = /* @__PURE__ */ new Map();
  setScope(t, n) {
    const r = q_(t, n);
    this.scopeKey !== r && (this.scopeKey = r, this.catalogs.clear(), this.powerForms.clear());
  }
  loadCatalog(t, n, r, s = !1) {
    this.setScope(t, n);
    const o = this.scopeKey, i = this.catalogs.get(o) || { loadedAt: 0 };
    if (!s && i.value && Date.now() - i.loadedAt < V_)
      return Promise.resolve(i.value);
    if (i.inFlight)
      return i.inFlight;
    const c = r().then((a) => (this.scopeKey === o && this.catalogs.set(o, { value: a, loadedAt: Date.now() }), a)).catch((a) => {
      throw this.scopeKey === o && this.catalogs.set(o, {
        value: i.value,
        loadedAt: i.loadedAt
      }), a;
    });
    return this.catalogs.set(o, { ...i, inFlight: c }), c;
  }
  loadPowerForm(t, n) {
    this.setScope(t.projectId, t.releaseId);
    const r = this.scopeKey, s = G_(t), o = this.powerForms.get(s);
    if (o?.value)
      return this.touchPowerForm(s, o), Promise.resolve(o.value);
    if (o?.inFlight)
      return o.inFlight;
    const i = n().then((c) => (this.scopeKey === r && (this.touchPowerForm(s, { value: c }), this.trimPowerForms()), c)).catch((c) => {
      throw this.scopeKey === r && this.powerForms.delete(s), c;
    });
    return this.touchPowerForm(s, { inFlight: i }), this.trimPowerForms(), i;
  }
  touchPowerForm(t, n) {
    this.powerForms.delete(t), this.powerForms.set(t, n);
  }
  trimPowerForms() {
    for (; this.powerForms.size > U_; ) {
      const t = this.powerForms.keys().next().value;
      if (!t)
        return;
      this.powerForms.delete(t);
    }
  }
}
function q_(e, t) {
  return `${e || 0}:${t || 0}`;
}
function G_(e) {
  return [
    e.projectId || 0,
    e.releaseId || 0,
    e.flowId || 0,
    e.powerId || 0,
    e.powerKey || "",
    e.targetId || 0
  ].join(":");
}
function W_(e, t = []) {
  return [...new Set([e, ...t].filter(Boolean))];
}
function H_(e, t) {
  return String(t || "").trim() ? "" : String(e || "").trim();
}
function Y_(e, t) {
  const n = new Set(t);
  return e.map(
    (r) => n.has(r.id) && r.runError ? { ...r, runError: "" } : r
  );
}
function X_(e, t, n) {
  const r = new Map(t.map((a) => [a.id, a])), s = Z_(n), o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
  for (const a of t)
    a.groupId && i.set(a.groupId, [
      ...i.get(a.groupId) || [],
      a.id
    ]);
  const c = (a) => {
    for (const d of s.get(a) || []) {
      if (o.has(d))
        continue;
      o.add(d);
      const u = r.get(d);
      if (u?.type === "group")
        for (const y of i.get(u.id) || [])
          o.has(y) || (o.add(y), c(y));
      (!u || !Cf(u)) && c(d);
    }
  };
  return c(e), [...o];
}
function Cf(e) {
  return !!(e.type === "function" && eo(e.functionOption?.key)?.stopsExecution);
}
function Yc(e) {
  return e.type === "power" ? !!(Number(e.power?.id || 0) > 0 || e.power?.key) : ["asset", "agent", "flow"].includes(e.type) ? !0 : !!(e.type === "function" && eo(e.functionOption?.key)?.runsInBackend);
}
function Z_(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.from || !n.to || n.executionMode === "manual")
      continue;
    const r = n.logicalFrom || n.from, s = n.logicalTo || n.to;
    t.set(r, [
      ...t.get(r) || [],
      s
    ]);
  }
  return t;
}
function J_({
  members: e,
  hasResult: t
}) {
  const n = e.filter(Yc), r = n.filter(
    (s) => !t(s)
  );
  return (r.length > 0 ? r : n).map(
    (s) => s.id
  );
}
function kf({
  targets: e,
  nodesByID: t,
  hasResult: n
}) {
  const r = new Set(e.map((s) => s.id));
  for (const s of e) {
    const o = s.storyboardItem;
    if (!o)
      continue;
    const i = /* @__PURE__ */ new Set([
      ...o.dependencyNodeIds || [],
      ...o.referenceNodeIds || []
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
function Xc({
  members: e,
  runningNodes: t,
  groupState: n,
  hasResult: r
}) {
  const s = e.filter(Yc), o = s.map((d) => t[d.id]).filter((d) => !!d), c = n?.status === "running" || n?.status === "waiting" ? s.filter((d) => {
    const u = t[d.id];
    return u?.status === "success" || !u && r(d);
  }).length : s.filter((d) => {
    const u = t[d.id];
    return u?.status === "success" ? !0 : u ? !1 : r(d);
  }).length, a = o.filter(
    (d) => d.status === "error"
  ).length;
  return {
    memberCount: e.length,
    runnableCount: s.length,
    completedCount: c,
    failedCount: a,
    status: Q_(n, o, a)
  };
}
function Q_(e, t, n) {
  return t.some((r) => r.status === "running") ? "running" : e?.status === "waiting" || t.some((r) => r.status === "waiting") ? "waiting" : e?.status === "error" || n > 0 ? "error" : e?.status === "running" ? "running" : "idle";
}
function ew({
  point: e,
  canShowDetail: t,
  canCopy: n = !0,
  canDelete: r = !0,
  canEditStructure: s = !1,
  canResetStoryboardPrompt: o = !1,
  onClose: i,
  onCopy: c,
  onDelete: a,
  onDetail: d,
  onEditStructure: u,
  onResetStoryboardPrompt: y
}) {
  return /* @__PURE__ */ L(en, { children: [
    /* @__PURE__ */ f("div", { className: "ws-node-action-backdrop", onMouseDown: i }),
    /* @__PURE__ */ L(
      "section",
      {
        className: "ws-node-action-menu",
        style: { left: e.x, top: e.y },
        onMouseDown: (h) => h.stopPropagation(),
        children: [
          t ? /* @__PURE__ */ L("button", { type: "button", onClick: d, children: [
            /* @__PURE__ */ f(Sc, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "详情" })
          ] }) : null,
          s && u ? /* @__PURE__ */ L("button", { type: "button", onClick: u, children: [
            /* @__PURE__ */ f(nl, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "编辑分镜" })
          ] }) : null,
          o && y ? /* @__PURE__ */ L("button", { type: "button", onClick: y, children: [
            /* @__PURE__ */ f(Wm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "恢复脚本提示词" })
          ] }) : null,
          n ? /* @__PURE__ */ L("button", { type: "button", onClick: c, children: [
            /* @__PURE__ */ f(Hm, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "复制" })
          ] }) : null,
          r ? /* @__PURE__ */ L("button", { type: "button", className: "is-danger", onClick: a, children: [
            /* @__PURE__ */ f(Ym, { size: 15 }),
            /* @__PURE__ */ f("span", { children: "删除" })
          ] }) : null
        ]
      }
    )
  ] });
}
function tw({
  canvasCount: e,
  activeCanvasName: t,
  canvasManagerOpen: n,
  showViewTools: r,
  showMiniMap: s,
  snapToGrid: o,
  zoom: i,
  onToggleMiniMap: c,
  onToggleSnap: a,
  onReset: d,
  onZoomIn: u,
  onZoomOut: y,
  onZoomChange: h,
  onOpenCanvasManager: I
}) {
  const w = `画布管理 · ${t || "第一幕"}${e > 1 ? `（${e}）` : ""}`;
  return /* @__PURE__ */ L("div", { className: "ws-view-controls nodrag nopan", children: [
    /* @__PURE__ */ f(pt, { label: w, children: /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: n ? "is-active" : "",
        "aria-label": "画布管理",
        "aria-expanded": n,
        onClick: I,
        children: /* @__PURE__ */ f(Xm, { size: 16 })
      }
    ) }),
    r ? /* @__PURE__ */ L(en, { children: [
      /* @__PURE__ */ f("span", { className: "ws-view-controls-divider", "aria-hidden": "true" }),
      /* @__PURE__ */ f(pt, { label: s ? "隐藏小地图" : "显示小地图", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: s ? "is-active" : "",
          onClick: c,
          "aria-label": s ? "隐藏小地图" : "显示小地图",
          children: /* @__PURE__ */ f(Zm, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(pt, { label: o ? "关闭网格吸附" : "开启网格吸附", children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: o ? "is-active" : "",
          onClick: a,
          "aria-label": o ? "关闭网格吸附" : "开启网格吸附",
          children: /* @__PURE__ */ f(rl, { size: 16 })
        }
      ) }),
      /* @__PURE__ */ f(pt, { label: "重置视图", children: /* @__PURE__ */ f("button", { type: "button", onClick: d, "aria-label": "重置视图", children: /* @__PURE__ */ f(Jm, { size: 15 }) }) }),
      /* @__PURE__ */ L("div", { className: "ws-view-zoom", children: [
        /* @__PURE__ */ f(pt, { label: "缩小", children: /* @__PURE__ */ f("button", { type: "button", onClick: y, "aria-label": "缩小", children: /* @__PURE__ */ f(ol, { size: 15 }) }) }),
        /* @__PURE__ */ f(
          "input",
          {
            type: "range",
            min: "0.35",
            max: "1.45",
            step: "0.01",
            value: Math.max(0.35, Math.min(1.45, i)),
            onChange: (C) => h(Number(C.target.value)),
            "aria-label": "画布缩放"
          }
        ),
        /* @__PURE__ */ f(pt, { label: "放大", children: /* @__PURE__ */ f("button", { type: "button", onClick: u, "aria-label": "放大", children: /* @__PURE__ */ f(sl, { size: 15 }) }) })
      ] })
    ] }) : null
  ] });
}
const nw = [
  "position",
  "measured",
  "width",
  "height",
  "dragging",
  "resizing"
];
function Rf(e, t) {
  return e && t?.interactionId === e ? t : null;
}
function xf(e, t, n) {
  const r = Rf(t, n);
  if (!r)
    return e;
  const s = new Map(r.baseNodes.map((c) => [c.id, c])), o = new Map(r.nodes.map((c) => [c.id, c])), i = e.map((c) => {
    const a = s.get(c.id), d = o.get(c.id);
    if (!a || !d)
      return c;
    if (c === a)
      return d;
    let u = c;
    for (const y of nw)
      d[y] === a[y] || d[y] === c[y] || (u === c && (u = { ...c }), Object.assign(u, { [y]: d[y] }));
    return u;
  });
  return i.every((c, a) => c === e[a]) ? e : i.length === r.nodes.length && i.every((c, a) => c === r.nodes[a]) ? r.nodes : i;
}
function rw(e, t, n, r) {
  if (!n)
    return e;
  const s = xf(
    t,
    n,
    e
  );
  return {
    interactionId: n,
    baseNodes: t,
    nodes: typeof r == "function" ? r(s) : r
  };
}
function ow(e, t) {
  const [n, r] = q(null), s = de(
    () => xf(e, t, n),
    [e, t, n]
  );
  ue(() => {
    r(
      (i) => Rf(t, i)
    );
  }, [t]);
  const o = E(
    (i) => {
      r(
        (c) => rw(c, e, t, i)
      );
    },
    [e, t]
  );
  return { flowNodes: s, setFlowNodes: o };
}
function sw(e, t) {
  const n = W([]);
  return de(() => {
    const r = iw(
      e,
      n.current,
      t
    );
    return n.current = r, r;
  }, [t, e]);
}
function iw(e, t, n) {
  const r = new Map(t.map((o) => [o.id, o])), s = e.map((o) => {
    const i = r.get(o.id);
    return i && n(i, o) ? i : o;
  });
  return t.length === s.length && s.every((o, i) => o === t[i]) ? t : s;
}
function aw(e) {
  return (...t) => e.current(...t);
}
function cw(e, t) {
  return t && Zc(t.source, e) ? t.value : e;
}
function ou(e, t, n) {
  return {
    source: t && Zc(t.source, e) ? t.source : e,
    value: n
  };
}
function Zc(e, t) {
  return e?.width === t.width && e?.height === t.height && Number(e?.offsetX || 0) === Number(t.offsetX || 0) && Number(e?.offsetY || 0) === Number(t.offsetY || 0);
}
const Af = [
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
], Pi = 140, Jc = 100, _s = 720, su = { width: 280, height: 64 };
function dw(e, t, n) {
  const r = Mf(n), s = e.find((o) => o.id === t);
  return !s || mw(s, r) ? e : e.map(
    (o) => o.id === t ? { ...o, ...r } : o
  );
}
function uw(e, t, n) {
  const r = Rs(n), s = e.find((o) => o.id === t);
  return !s || Zc(s.resultView, r) ? e : e.map(
    (o) => o.id === t ? { ...o, resultView: r } : o
  );
}
function lw({
  node: e,
  enabled: t,
  resizable: n,
  onResizeStart: r,
  onResizeEnd: s
}) {
  if (!t || !n || !s)
    return null;
  const o = e.type === "group", i = e.type === "power" && vc(e.power, e.kind);
  return /* @__PURE__ */ f(en, { children: Af.map((c) => /* @__PURE__ */ f(
    qg,
    {
      position: c.position,
      className: `ws-resize-control ws-node-resize-control ${c.className} nodrag nopan`,
      minWidth: o ? Ud.width : i ? su.width : Pi,
      minHeight: o ? Ud.height : i ? su.height : Jc,
      maxWidth: o ? Kd.width : _s,
      maxHeight: o ? Kd.height : _s,
      keepAspectRatio: !o && !i,
      onResizeStart: () => r?.(e.id),
      onResizeEnd: (a, d) => s(e.id, Mf(d))
    },
    c.position
  )) });
}
function fw({
  value: e,
  enabled: t,
  onResizeStart: n,
  onResize: r,
  onResizeEnd: s
}) {
  const o = W(null);
  if (!t)
    return null;
  const i = (d, u) => {
    if (d.button !== 0)
      return;
    d.preventDefault(), d.stopPropagation();
    const y = Rs(e), h = d.currentTarget.parentElement?.getBoundingClientRect().width || y.width;
    o.current = {
      pointerId: d.pointerId,
      startX: d.clientX,
      startY: d.clientY,
      startView: y,
      currentView: y,
      corner: u,
      scale: Math.max(0.01, h / y.width)
    }, d.currentTarget.setPointerCapture(d.pointerId), n?.();
  }, c = (d) => {
    const u = o.current;
    if (!u || u.pointerId !== d.pointerId)
      return;
    d.preventDefault(), d.stopPropagation();
    const y = pw(
      u.startView,
      u.corner,
      (d.clientX - u.startX) / u.scale,
      (d.clientY - u.startY) / u.scale
    );
    u.currentView = y, r(y);
  }, a = (d) => {
    const u = o.current;
    !u || u.pointerId !== d.pointerId || (d.preventDefault(), d.stopPropagation(), o.current = null, d.currentTarget.hasPointerCapture(d.pointerId) && d.currentTarget.releasePointerCapture(d.pointerId), s(Rs(u.currentView)));
  };
  return /* @__PURE__ */ f(en, { children: Af.map((d) => /* @__PURE__ */ f(
    "div",
    {
      className: `ws-resize-control ws-floating-resize-control ${d.className} nodrag nopan nowheel`,
      onPointerDown: (u) => i(u, d),
      onPointerMove: c,
      onPointerUp: a,
      onPointerCancel: a,
      onClick: (u) => {
        u.preventDefault(), u.stopPropagation();
      }
    },
    d.position
  )) });
}
function pw(e, t, n, r) {
  const s = e.width / e.height, o = e.width + t.horizontalDirection * n, i = (e.height + t.verticalDirection * r) * s, c = Tf(
    Math.abs(o - e.width) >= Math.abs(i - e.width) ? o : i,
    s
  ), a = c / s, d = Number(e.offsetX || 0), u = Number(e.offsetY || 0);
  return Rs({
    width: c,
    height: a,
    offsetX: t.left ? d + e.width - c : d,
    offsetY: t.top ? u + (e.height - a) / 2 : u + (a - e.height) / 2
  });
}
function Tf(e, t) {
  const n = Math.max(Pi, Jc * t), r = Math.min(_s, _s * t);
  return n > r ? Math.min(_s, Math.max(Pi, e)) : Math.min(r, Math.max(n, e));
}
function Rs(e) {
  const t = iu(e.width, Pi), n = iu(e.height, Jc), r = t / n, s = Tf(t, r);
  return {
    width: Math.round(s),
    height: Math.round(s / r),
    offsetX: Math.round(au(e.offsetX, 0)),
    offsetY: Math.round(au(e.offsetY, 0))
  };
}
function iu(e, t) {
  const n = Number(e);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function au(e, t) {
  const n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Mf(e) {
  return {
    x: Math.round(e.x),
    y: Math.round(e.y),
    width: Math.round(e.width),
    height: Math.round(e.height)
  };
}
function mw(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function gw(e, t) {
  const n = e || Df(), r = Ny({
    type: "stream",
    output: t
  }), s = r.event, o = r.activity, i = ww(n.text, r.delta, t, s), c = bw(s, o) ? {
    ...n.output,
    ...r.output,
    ...i ? { text: i } : {}
  } : n.output, a = o && !o.anchorText ? { ...o, anchorText: i } : o, d = a ? Sy(n.activities, a) : n.activities, u = Cy(
    ky(n.document, r.output),
    jl(r.output.document)
  ), y = $l(c) || n.interaction, h = zl(c);
  return {
    started: !0,
    text: i,
    output: c,
    activities: d,
    document: u,
    interaction: y,
    suggestions: h.length > 0 ? h : n.suggestions,
    error: r.error || n.error
  };
}
function yw(e) {
  const t = hw(e);
  return {
    started: Object.keys(t).length > 0,
    text: Oi(t.text),
    output: t,
    activities: vy(t),
    document: jl(t.document),
    interaction: $l(t),
    suggestions: zl(t),
    error: Oi(t.error)
  };
}
function hw(e) {
  const t = Ry(e);
  if (Oi(t.text))
    return t;
  const n = Sl(e);
  if (!n)
    return t;
  const r = { ...t, text: n };
  return delete r.rich, r;
}
function _w(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function Df() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function ww(e, t, n, r) {
  return t ? `${e}${t}` : r === "final" && Oi(n.text) || e;
}
function bw(e, t) {
  return !(t || e === "start" || e === "delta");
}
function Oi(e) {
  return e == null ? "" : String(e);
}
function Iw(e) {
  const t = Ie(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (i) => i.id === Number(t.id || 0)
  ), s = r ? dr(r, e.previousAsset) : e.previousAsset || null, o = dr(
    t,
    s
  );
  return s && ul(s, o) ? s : s?.version?.content != null && Number(s.version.id || 0) === Number(o.version?.id || 0) && (!Cs(o.version?.content) || ms(s.version) >= ms(o.version)) ? dr(s, o) : o.version?.id ? o : null;
}
function vw(e, t) {
  const n = Sw(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function Nw(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function dr(e, t) {
  const n = cu(e), r = t ? cu(t) : null, s = [
    ...n.versions || [],
    ...r?.versions || []
  ], o = Cw(
    [Rw(n.version)].filter(
      (i) => !!i
    ),
    s
  );
  return {
    ...r,
    ...n,
    version: n.version || r?.version,
    versions: o.length ? o : void 0
  };
}
function So(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((s) => [s.id, s])), r = e.map((s) => {
    const o = n.get(s.id);
    return o ? (n.delete(s.id), ul(s, o) ? s : dr(o, s)) : s;
  });
  return [
    ...[...n.values()].map(
      (s) => dr(s)
    ),
    ...r
  ];
}
function Sw(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function cu(e) {
  const t = du(e.version), n = (e.versions || []).map(du).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function du(e) {
  if (!e)
    return;
  const t = sy(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function Cw(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const o of t) {
    if (!o || Number(o.id || 0) <= 0)
      continue;
    const i = String(o.id), c = r.get(i);
    if (c !== void 0) {
      n[c] = kw(
        n[c],
        o
      );
      continue;
    }
    r.set(i, n.length), n.push(o);
  }
  let s = !1;
  return n.sort(
    (o, i) => Number(va(i)) - Number(va(o)) || Number(i.version || i.id || 0) - Number(o.version || o.id || 0)
  ).map((o) => va(o) ? s ? xw(o) : (s = !0, o) : o);
}
function kw(e, t) {
  const n = { ...e };
  for (const [r, s] of Object.entries(t))
    s !== void 0 && s !== "" && (n[r] = s);
  return n;
}
function va(e) {
  return !!(e.is_current || e.current);
}
function Rw(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function xw(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
function Qc(e) {
  const t = e?.asset || e?.data?.asset, n = e?.version || t?.version || e?.data?.version, r = {};
  return Br(r, "execution_id", e?.execution_id), Br(r, "run_id", e?.run_id || n?.run_id), Na(r, "request_id", e?.request_id), Br(r, "flow_run_id", e?.flow_run_id), Br(
    r,
    "node_run_id",
    e?.node_run_id || n?.node_run_id
  ), Br(r, "asset_id", e?.asset_id || t?.id), Br(
    r,
    "version_id",
    e?.version_id || n?.id || t?.version_id
  ), Br(
    r,
    "release_id",
    e?.release_id || n?.release_id
  ), Na(r, "role", e?.role || t?.role), Na(r, "status", e?.status), Object.keys(r).length > 0 && (r.updated_at = (/* @__PURE__ */ new Date()).toISOString()), Object.keys(r).length > 0 ? r : void 0;
}
function Xa(e, t, n) {
  const r = e?.resultRef;
  if (r) {
    const s = Number(t.execution_id || 0), o = Number(r.execution_id || 0);
    if (s > 0 && o > 0 && o >= s)
      return !0;
    const i = Number(t.run_id || 0), c = Number(r.run_id || 0);
    if (i > 0 && c > 0 && c >= i)
      return !0;
    const a = Number(n?.node_run_id || 0), d = Number(r.node_run_id || 0);
    if (a > 0 && d > 0 && d >= a)
      return !0;
    const u = String(n?.request_id || t.request_id || "");
    if (u && r.request_id === u)
      return !0;
  }
  return Aw(e, n);
}
function Aw(e, t) {
  if (String(t?.status || "").trim().toLowerCase() !== "success")
    return !1;
  const n = Number(
    e?.asset?.id || e?.resultRef?.asset_id || 0
  ), r = Number(
    e?.asset?.version_id || e?.asset?.version?.id || e?.resultRef?.version_id || 0
  ), s = Number(t?.asset_id || 0), o = Number(t?.version_id || 0);
  return n > 0 && n === s && r > 0 && o > 0 && r !== o;
}
function Tw(e) {
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
function Br(e, t, n) {
  const r = Number(n || 0);
  r > 0 && (e[t] = r);
}
function Na(e, t, n) {
  typeof n == "string" && n.trim() && (e[t] = n.trim());
}
const Mw = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], Dw = Object.fromEntries(
  Mw.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Ew(e) {
  return Dw[e] || "文本";
}
function Pw(e, t = []) {
  const n = new Map(
    t.map((d) => [d.key, d])
  ), r = new Map(e.nodes.map((d) => [d.id, d])), s = new Map(
    e.nodes.filter((d) => d.type === "group").map((d) => [d.id, d])
  ), o = Fw(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), i = e.nodes.filter(cf).map((d) => {
    const u = n.get(`node:${d.id}`), y = o.get(d.id) || d.asset, h = d.groupId ? s.get(d.groupId) : void 0, I = h?.group?.sourceNodeId ? r.get(h.group.sourceNodeId) : void 0, w = u?.node === d && u?.asset === y, C = w ? u.output : e.nodeOutput(d);
    return {
      key: `node:${d.id}`,
      role: "material",
      title: d.title || Ew(uu(d)),
      sourcePath: I?.title && h?.title ? `${I.title} / ${h.title}` : h?.title,
      nodeType: uu(d),
      status: w ? u.status : Bw(d, y, e.nodeHasResult(d)),
      preview: w ? u.preview : e.nodePreview(d),
      output: C,
      node: d,
      nodeId: d.id,
      nodeNo: d.nodeNo,
      groupId: d.groupId,
      groupTitle: h?.title,
      asset: y,
      assetId: y?.id,
      versionId: y?.version?.id || y?.version_id
    };
  }).filter((d) => !!(d.assetId && d.versionId)), a = [...e.assets.filter(
    (d) => Number(d.canvas_id || 0) === e.canvasId && Number(d.asset_cate_id || 0) === e.assetCateId && String(d.role || "material") === "work" && String(d.status || "") !== "archived"
  ).map((d) => {
    const u = n.get(`asset:${d.id}`);
    return {
      key: `asset:${d.id}`,
      role: "work",
      title: d.name || `作品 ${d.id}`,
      nodeType: Pf(d.kind),
      status: d.version?.id || d.version_id ? "ready" : "empty",
      preview: u?.asset === d ? u.preview : e.assetPreview(d),
      output: d.version?.content,
      asset: d,
      assetId: d.id,
      versionId: d.version?.id || d.version_id
    };
  }), ...i].filter((d) => !!(d.assetId && d.versionId)).map((d) => {
    const u = n.get(d.key);
    return u && Ow(u, d) ? u : d;
  });
  return a.length === t.length && a.every((d, u) => d === t[u]) ? t : a;
}
function Ef(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function Ow(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && Ef(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function uu(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : Pf(e.power?.kind || e.kind);
}
function Pf(e) {
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
function Fw(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (Number(s.canvas_id || 0) !== t || Number(s.asset_cate_id || 0) !== n || String(s.role || "") !== "material" || String(s.status || "") === "archived")
      continue;
    const o = String(
      s.node_key || s.version?.node_key || ""
    ).trim();
    o && !r.has(o) && r.set(o, s);
  }
  return r;
}
function Bw(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
const Of = gl(
  null
);
function zw({
  root: e,
  children: t,
  rootMargin: n = "0px"
}) {
  const r = W(/* @__PURE__ */ new Map()), s = W(null), o = de(
    () => ({
      observe(i, c) {
        return r.current.set(i, c), s.current?.observe(i), () => {
          s.current?.unobserve(i), r.current.delete(i);
        };
      }
    }),
    []
  );
  return Zr(() => {
    const i = new IntersectionObserver(
      (c) => {
        for (const a of c)
          r.current.get(a.target)?.(
            a.isIntersecting && a.intersectionRatio > 0
          );
      },
      { root: e.current, rootMargin: n }
    );
    s.current = i;
    for (const c of r.current.keys())
      i.observe(c);
    return () => {
      i.disconnect(), s.current = null;
    };
  }, [e, n]), /* @__PURE__ */ f(Of.Provider, { value: o, children: t });
}
function $w(e = !0) {
  const t = Tc(Of), n = W(null), [r, s] = q(!1);
  return Zr(() => {
    if (!(!n.current || !t))
      return t.observe(n.current, (o) => {
        (o || !e) && s(o);
      });
  }, [t, e]), { ref: n, visible: r };
}
function f0(e, t = []) {
  return {
    current: Vw([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: Ff(
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
const lu = /* @__PURE__ */ new WeakMap(), fu = /* @__PURE__ */ new WeakMap();
function jw(e, t = []) {
  const n = new Map(
    t.map((s) => [`${s.source}:${s.id}`, s])
  ), r = e.flatMap((s) => {
    const o = lu.get(s);
    if (o) return o;
    const i = {
      id: s.role === "material" ? s.nodeId || s.key : String(s.assetId || s.key),
      title: s.title,
      kind: Ff(s.preview, s.nodeType),
      role: s.role,
      source: s.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: s.assetId,
      versionID: s.versionId,
      output: s.output,
      preview: s.preview,
      asset: s.asset
    }, c = n.get(`${i.source}:${i.id}`), d = (c && pu(c, i) ? fu.get(c) : void 0) || vg(i).map((u) => {
      const y = n.get(
        `${u.source}:${u.id}`
      );
      return y && pu(y, u) ? y : u;
    });
    return lu.set(s, d), fu.set(d[0], d), d;
  });
  return r.length === t.length && r.every((s, o) => s === t[o]) ? t : r;
}
function pu(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && Ef(e.preview, t.preview) && Lw(e.contentSelection, t.contentSelection);
}
function Lw(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((n, r) => n === t.ids[r]));
}
function Vw(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const s = `${r.source}:${r.id}`;
    n.has(s) || (n.add(s), t.push(r));
  }
  return t;
}
function Ff(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
function Uw() {
  const e = /* @__PURE__ */ new Map();
  let t;
  function n(r, s, o, i) {
    let c = e.get(r);
    c || (c = /* @__PURE__ */ new Map(), e.set(r, c));
    const a = c.get(s);
    if (a && a.dependencies.length === o.length && o.every(
      (u, y) => Object.is(u, a.dependencies[y])
    ))
      return a.value;
    const d = i();
    return c.set(s, { dependencies: o, value: d }), d;
  }
  return {
    reuse: n,
    retain(r) {
      if (r !== t) {
        t = r;
        for (const s of e.values())
          for (const o of s.keys())
            r.has(o) || s.delete(o);
      }
    }
  };
}
function Kw() {
  let e;
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  return {
    update(r, s) {
      const o = new Map(
        r.map((a) => [
          a.id,
          Fo(a, "start") ? "start" : Cf(a) ? "stop" : "other"
        ])
      ), i = e;
      if (i && o.size === i.semantics.size && [...o].every(
        ([a, d]) => i.semantics.get(a) === d
      ) && s.length === i.edges.length && s.every((a, d) => {
        const u = i.edges[d];
        return a.id === u.id && a.from === u.from && a.to === u.to;
      }))
        return;
      const c = /* @__PURE__ */ new Map();
      for (const a of s) {
        const d = c.get(a.from) || [];
        d.push({ id: a.id, to: a.to }), c.set(a.from, d);
      }
      e = {
        semantics: o,
        edges: s.map(({ id: a, from: d, to: u }) => ({ id: a, from: d, to: u })),
        outgoing: c
      }, t.clear();
    },
    get(r) {
      if (!e || e.semantics.get(r) !== "start") return n;
      const s = t.get(r);
      if (s)
        return t.delete(r), t.set(r, s), s;
      const o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set([r]), c = [...e.outgoing.get(r) || []];
      for (let a = 0; a < c.length; a += 1) {
        const d = c[a];
        o.has(d.id) || (o.add(d.id), !i.has(d.to) && (i.add(d.to), e.semantics.get(d.to) !== "stop" && c.push(...e.outgoing.get(d.to) || [])));
      }
      return t.size >= 2 && t.delete(t.keys().next().value), t.set(r, o), o;
    }
  };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Za = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Za || Object.keys(Za).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const qw = Za.joinSiteApi;
async function ed(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return Gg({
    streamApi: Gw(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: e.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (n, r) => (e.onFrame(r), n)
  });
}
function Gw(e) {
  const t = new URL(qw("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
const Bf = "反馈已被新的运行替换";
function Ww(e) {
  return e instanceof Error && e.message === Bf;
}
function qr(e) {
  return (Array.isArray(e?.feedbackRequests) ? e.feedbackRequests : []).filter((n) => n && n.id);
}
function Hw(e, t) {
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
function Yw(e, t, n) {
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
function Xw(e, t, n) {
  if (!e)
    return !1;
  const r = t.find((o) => o.id === e.node.id) || e.node, s = qr(r).find(
    (o) => o.id === e.recordId
  );
  return s ? !(s.status === "pending" && n?.nodeId === e.node.id && n.recordId === e.recordId) : !1;
}
function Zw(e) {
  const t = e?.run || e?.data?.run || e || {}, n = Array.isArray(e?.approvals) ? e.approvals : Array.isArray(e?.data?.approvals) ? e.data.approvals : [], r = Array.isArray(e?.interactions) ? e.interactions : Array.isArray(e?.data?.interactions) ? e.data.interactions : [];
  return {
    runId: Number(t?.id || e?.run_id || 0),
    requestId: String(t?.request_id || e?.request_id || ""),
    status: $o(t?.status || e?.status || "running"),
    output: Ie(t?.output, e?.output, e?.data?.output),
    error: String(t?.error || e?.error || ""),
    approvals: n.map(tb).filter(Boolean),
    interactions: r.map(Qw).filter(Boolean),
    raw: e
  };
}
function Jw(e) {
  const t = e.interactions.find(
    (o) => !!(o.interaction?.id && o.interaction?.type)
  );
  if (t)
    return zf(t);
  const n = e.approvals.find(nb);
  if (!n?.id)
    return null;
  const r = rb(n), s = td(r);
  return {
    approval: n,
    title: $e(r.title, n.title, "补充信息"),
    description: $e(
      r.description,
      "补充信息后继续执行流程。"
    ),
    fields: s,
    values: nd(r, s)
  };
}
function zf(e) {
  const t = e.interaction, n = td(t);
  return {
    approval: {
      id: 0,
      title: String(t.title || ""),
      status: "pending",
      decision: "pending",
      content: {}
    },
    interaction: e,
    title: $e(t.title, "补充信息"),
    description: $e(
      t.description,
      "补充信息后继续执行流程。"
    ),
    fields: n,
    values: nd(t, n)
  };
}
function Qw(e) {
  const t = Wg(e);
  return {
    runId: t.runId,
    nodeRunId: t.nodeRunId,
    interaction: t.interaction
  };
}
function td(e) {
  return (Array.isArray(e.fields) ? e.fields : Array.isArray(e.params) ? e.params : []).map((n, r) => ob(n, r)).filter((n) => !!n.key);
}
function nd(e, t) {
  const n = Ng(t), r = e.values && typeof e.values == "object" ? e.values : {}, s = {
    ...n,
    ...r
  }, o = Number(
    e.source_target_id || e.sourceTargetId || 0
  );
  return o > 0 && (s.source_target_id = o), s;
}
function eb(e, t) {
  const n = sb(e);
  if (!n)
    return null;
  const r = td(n);
  return {
    approval: {
      id: 0,
      title: t,
      status: "pending",
      decision: "pending",
      content: { kind: "agent_interaction", interaction: n }
    },
    title: $e(n.title, t, "补充信息"),
    description: $e(
      n.description,
      "补充信息后继续执行智能体。"
    ),
    fields: r,
    values: nd(n, r)
  };
}
function tb(e) {
  const t = e?.content && typeof e.content == "object" ? e.content : {};
  return {
    id: Number(e?.id || e?.approval_id || 0),
    title: String(e?.title || ""),
    status: String(e?.status || ""),
    decision: String(e?.decision || ""),
    content: t
  };
}
function nb(e) {
  return e.status === "pending" || e.decision === "pending";
}
function rb(e) {
  const t = e.content || {}, n = t.interaction;
  return n && typeof n == "object" ? n : t;
}
function ob(e, t) {
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
    accepted_kinds: mu(
      e?.accepted_kinds ?? e?.acceptedKinds
    ),
    asset_kinds: mu(
      e?.asset_kinds ?? e?.assetKinds
    ),
    required: !!e?.required,
    sort: Number(e?.sort || t + 1),
    options: n.map((r, s) => ({
      id: Number(r?.id || s + 1),
      name: String(r?.name || r?.label || r?.value || ""),
      value: String(
        r?.value || r?.id || r?.label || r?.name || ""
      ),
      native_value: String(r?.native_value || r?.nativeValue || ""),
      preview_url: String(r?.preview_url || r?.previewUrl || ""),
      sort: Number(r?.sort || s + 1)
    }))
  };
}
function mu(e) {
  return Array.isArray(e) ? e.map((t) => String(t || "").trim()).filter(Boolean) : [];
}
function sb(e) {
  const t = Sa(
    e?.output,
    e?.data?.output,
    e?.content,
    e
  );
  if (!t)
    return null;
  if (!String(t.event || "").toLowerCase().includes("interaction")) {
    const r = Sa(e?.interaction);
    return r && $e(r.type) ? r : null;
  }
  const n = Sa(t.interaction, t.content?.interaction);
  return n && $e(n.type) ? n : null;
}
function Sa(...e) {
  for (const t of e)
    if (t && typeof t == "object" && !Array.isArray(t))
      return t;
  return null;
}
function ib({
  id: e,
  sourceX: t,
  sourceY: n,
  targetX: r,
  targetY: s,
  sourcePosition: o,
  targetPosition: i,
  markerEnd: c,
  style: a,
  data: d
}) {
  const [u, y, h] = Hg({
    sourceX: t,
    sourceY: n,
    sourcePosition: o,
    targetX: r,
    targetY: s,
    targetPosition: i
  }), I = d || {}, w = !!I.isSelected, C = !!(I.isHighlighted || w), S = I.highlightColor || "#0ea5e9", x = w ? "var(--ws-edge-selected)" : C ? S : "var(--ws-edge)", T = w ? 2.8 : C ? 2.4 : 1.45, U = C ? 0.96 : 0.62, ee = String(I.bindingLabel || "").trim(), Z = !!I.bindingInteractive, oe = !!ee, X = oe || w;
  return /* @__PURE__ */ L(en, { children: [
    C ? /* @__PURE__ */ f(
      jd,
      {
        path: u,
        style: {
          stroke: S,
          strokeWidth: 7,
          opacity: 0.12
        }
      }
    ) : null,
    /* @__PURE__ */ f(
      jd,
      {
        path: u,
        markerEnd: c,
        style: {
          ...a,
          stroke: x,
          strokeWidth: T,
          opacity: U,
          transition: "stroke 160ms ease, stroke-width 160ms ease, opacity 160ms ease"
        }
      }
    ),
    X ? /* @__PURE__ */ f(Yg, { children: /* @__PURE__ */ L(
      "div",
      {
        className: [
          "ws-edge-actions nodrag nopan",
          ee ? "is-bound" : "",
          I.bindingInvalid ? "is-invalid" : ""
        ].filter(Boolean).join(" "),
        style: {
          transform: `translate(-50%, -50%) translate(${y}px, ${h}px)`
        },
        onMouseDown: (O) => {
          O.preventDefault(), O.stopPropagation();
        },
        children: [
          oe ? Z ? /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: "ws-edge-binding",
              "aria-label": `调整参数连接，当前为${ee}`,
              onClick: (O) => {
                O.preventDefault(), O.stopPropagation(), I.onEditBinding?.(String(e));
              },
              children: [
                /* @__PURE__ */ f($a, { size: 14, "aria-hidden": "true" }),
                /* @__PURE__ */ f("span", { children: ee }),
                I.bindingShowChevron ? /* @__PURE__ */ f(Qm, { size: 13, "aria-hidden": "true" }) : null
              ]
            }
          ) : /* @__PURE__ */ L("div", { className: "ws-edge-binding is-static", children: [
            /* @__PURE__ */ f($a, { size: 14, "aria-hidden": "true" }),
            /* @__PURE__ */ f("span", { children: ee })
          ] }) : null,
          w ? /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-edge-delete",
              "aria-label": "删除连线",
              onClick: (O) => {
                O.preventDefault(), O.stopPropagation(), I.onDelete?.(String(e));
              },
              children: /* @__PURE__ */ f(eg, { size: 15 })
            }
          ) : null
        ]
      }
    ) }) : null,
    C ? /* @__PURE__ */ L(en, { children: [
      /* @__PURE__ */ f("circle", { r: "3", fill: S, children: /* @__PURE__ */ f(
        "animateMotion",
        {
          dur: "2.8s",
          repeatCount: "indefinite",
          path: u
        }
      ) }),
      /* @__PURE__ */ f("circle", { r: "1.8", fill: "rgba(255, 255, 255, 0.92)", children: /* @__PURE__ */ f(
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
const ab = {
  zIndex: 999,
  "--ws-node-overlay-scale": "1",
  "--ws-node-overlay-gap": "16px"
};
function cb({
  node: e,
  running: t,
  onRun: n
}) {
  return e.type !== "flow" || !e.flow ? null : /* @__PURE__ */ f(
    "div",
    {
      className: "ws-node-bottom-settings is-flow-run-only nodrag nowheel",
      onClick: (r) => r.stopPropagation(),
      style: ab,
      children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-node-flow-run",
          disabled: t,
          onClick: n,
          children: [
            t ? /* @__PURE__ */ f(ur, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(Cc, { size: 15, fill: "currentColor" }),
            /* @__PURE__ */ f("span", { children: t ? "运行中" : "执行" })
          ]
        }
      )
    }
  );
}
function Ca({
  title: e,
  className: t,
  fallback: n = "未命名节点",
  onRename: r
}) {
  const [s, o] = q(!1), [i, c] = q(e), a = W(null);
  ue(() => {
    s || c(e);
  }, [s, e]), ue(() => {
    s && (a.current?.focus(), a.current?.select());
  }, [s]);
  const d = () => {
    const u = i.trim() || n;
    o(!1), c(u), u !== e && r?.(u);
  };
  return s && r ? /* @__PURE__ */ f(
    "input",
    {
      ref: a,
      className: `ws-canvas-node-title-input nodrag nowheel ${t || ""}`.trim(),
      value: i,
      maxLength: 64,
      "aria-label": "节点名称",
      onChange: (u) => c(u.target.value),
      onBlur: d,
      onPointerDown: (u) => u.stopPropagation(),
      onKeyDown: (u) => {
        u.stopPropagation(), u.key === "Enter" ? (u.preventDefault(), d()) : u.key === "Escape" && (u.preventDefault(), c(e), o(!1));
      }
    }
  ) : /* @__PURE__ */ f(pt, { label: r ? "双击重命名" : e, children: /* @__PURE__ */ f(
    "span",
    {
      className: t,
      onDoubleClick: r ? (u) => {
        u.preventDefault(), u.stopPropagation(), o(!0);
      } : void 0,
      children: e || n
    }
  ) });
}
const gu = 160, yu = 72, hu = 72, Fi = 72, xs = 24, As = 24, Ts = 40, Gr = 2, Bi = { width: 180, height: 180 }, db = "storyboard-derived-layout-v7";
function ub(e) {
  const t = e.groups.map((w) => ({
    ...w,
    size: mb(w)
  })), n = /* @__PURE__ */ new Map(), r = [...t].sort(fi), s = gb(
    "workspace",
    r
  ), o = t.filter((w) => w.direction === "upstream").sort(fi), i = t.filter(
    (w) => w.direction === "downstream" && w.powerKind !== "audio"
  ).sort(fi), c = t.filter(
    (w) => w.direction === "downstream" && w.powerKind === "audio"
  ).sort(fi), a = i.reduce(
    (w, C) => Math.max(w, C.size.height),
    0
  ), d = i.length ? e.sourceNode.y - a - hu : e.sourceNode.y, u = e.sourceNode.x - gu;
  let y = d;
  for (const w of o)
    n.set(w.key, {
      bounds: {
        x: u - w.size.width,
        y,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${s}:${w.key}`
    }), y += w.size.height + hu;
  let h = e.sourceNode.x;
  for (const w of i)
    n.set(w.key, {
      bounds: {
        x: h,
        y: d,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${s}:${w.key}`
    }), h += w.size.width + yu;
  let I = e.sourceNode.x + e.sourceNode.width + gu;
  for (const w of c)
    n.set(w.key, {
      bounds: {
        x: I,
        y: e.sourceNode.y,
        width: w.size.width,
        height: w.size.height
      },
      layoutKey: `${s}:${w.key}`
    }), I += w.size.width + yu;
  return n;
}
function lb(e, t, n) {
  const r = t.filter((c) => c.groupId === e.id), s = n.kind === "audio", o = s ? n.width : Math.max(Bi.width, n.width), i = s ? n.height : Math.max(Bi.height, n.height);
  for (let c = 0; c < r.length + 100; c += 1) {
    const a = c % Gr, d = Math.floor(c / Gr), u = {
      x: e.x + xs + a * (o + As),
      y: e.y + Fi + d * (i + Ts)
    };
    if (r.every(
      (y) => !yb(
        { ...u, width: n.width, height: n.height },
        y
      )
    ))
      return u;
  }
  return {
    x: e.x + xs,
    y: e.y + Fi
  };
}
function fb(e, t) {
  const n = t.some((o) => o.kind === "audio"), r = {
    width: Math.max(
      n ? 0 : Bi.width,
      ...t.map((o) => o.width)
    ),
    height: Math.max(
      n ? 0 : Bi.height,
      ...t.map((o) => o.height)
    )
  }, s = /* @__PURE__ */ new Map();
  return t.forEach((o, i) => {
    const c = i % Gr, a = Math.floor(i / Gr);
    s.set(o.id, {
      x: e.x + xs + c * (r.width + As),
      y: e.y + Fi + a * (r.height + Ts)
    });
  }), {
    ...$f(t.length, r),
    positions: s
  };
}
function pb(e) {
  return Ji(e || void 0);
}
function mb(e) {
  const t = pb(
    e.power || { kind: e.powerKind, outputType: "" }
  );
  return $f(e.itemCount, t);
}
function $f(e, t) {
  const n = Math.max(1, Math.ceil(e / Gr));
  return {
    width: xs * 2 + t.width * Gr + As * (Gr - 1),
    height: Fi + xs + n * t.height + (n - 1) * Ts
  };
}
function gb(e, t) {
  return [
    db,
    e,
    ...t.map(
      (n) => `${n.key}:${n.itemCount}:${n.size.width}x${n.size.height}`
    )
  ].join("|");
}
function fi(e, t) {
  return e.layoutIndex - t.layoutIndex || e.key.localeCompare(t.key);
}
function yb(e, t) {
  return !(e.x + e.width + As <= t.x || t.x + t.width + As <= e.x || e.y + e.height + Ts <= t.y || t.y + t.height + Ts <= e.y);
}
const hb = [
  "characters",
  "scenes",
  "props"
], Ja = [
  ka("characters", "角色组", "character", 0),
  ka("scenes", "场景组", "scene", 1),
  ka("props", "道具组", "prop", 2),
  {
    key: "shot_images",
    title: "镜头参考图组",
    itemType: "shot_image",
    powerKind: "image",
    outputType: "general",
    direction: "downstream",
    sourceGroupKeys: hb,
    layoutIndex: 0,
    enabled: Cl,
    items: wb
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
    enabled: iy,
    items: _b
  },
  {
    key: "speech",
    title: "角色配音组",
    itemType: "speech",
    powerKind: "audio",
    outputType: "speech",
    direction: "downstream",
    layoutIndex: 2,
    enabled: kl,
    items: Sb
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
    enabled: Rl,
    items: kb
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
    enabled: xl,
    items: Rb
  }
];
function _b(e, t) {
  const n = ay(e), r = ks(t?.framePlanVersion) ? Al(e.shots) : [];
  return e.shots.map((s, o) => {
    const i = ks(t?.framePlanVersion) ? r[o] : void 0, c = Fb(
      e,
      s,
      o,
      t?.framePlanVersion,
      i
    );
    return {
      type: "shot",
      id: s.id,
      title: `镜头 ${s.order || o + 1}`,
      prompt: Vb(
        e,
        s,
        c.externalReferences,
        t?.framePlanVersion
      ),
      ...c,
      paramValues: qb(
        e,
        s,
        t?.framePlanVersion,
        i
      ),
      shotId: s.id,
      shotImageMode: i?.mode,
      sharedEndShotId: i?.mode === "next_first" ? s.shared_end_shot_id : void 0,
      shotDuration: s.duration,
      requiredDurationValues: n,
      continuityAnchor: s.continuity_anchor
    };
  });
}
function wb(e, t) {
  return ks(t?.framePlanVersion) ? Ib(e) : bb(e);
}
function bb(e) {
  return e.shots.flatMap((t, n) => {
    if (t.continue_previous)
      return [];
    const r = Mb(e, t, n);
    return [
      {
        type: "shot_image",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 参考图`,
        prompt: zb(
          e,
          t,
          r.previousShot,
          r.externalReferences
        ),
        dependencyItems: r.dependencyItems,
        referenceItems: r.referenceItems,
        externalReferences: r.externalReferences,
        paramValues: Uf(e),
        shotId: t.id
      }
    ];
  });
}
function Ib(e) {
  const t = Al(e.shots);
  return e.shots.flatMap((n, r) => {
    const s = t[r];
    if (s.nodeMode === "none")
      return [];
    const o = s.nodeMode === "last_frame" ? "end" : "start", i = Db(
      e,
      n,
      r,
      o
    ), c = Nb(
      e,
      n,
      s.nodeMode,
      i
    );
    return [
      {
        type: "shot_image",
        id: n.id,
        title: vb(
          n.order || r + 1,
          s.nodeMode
        ),
        prompt: c.prompt,
        dependencyItems: i.dependencyItems,
        referenceItems: i.referenceItems,
        externalReferences: i.externalReferences,
        paramValues: Uf(e),
        shotId: n.id,
        shotImageMode: s.nodeMode,
        frameMediaItems: s.frameMediaItems,
        imageSequenceFrames: c.frames
      }
    ];
  });
}
function vb(e, t) {
  return `镜头 ${e} ${ly[t]}`;
}
function Nb(e, t, n, r) {
  switch (n) {
    case "first_last": {
      const s = jb(e, t);
      return {
        prompt: Lb(s),
        frames: s
      };
    }
    case "references":
      return {
        prompt: $b(e, t)
      };
    case "last_frame":
      return {
        prompt: _u(
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
        prompt: _u(
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
function ka(e, t, n, r) {
  return {
    key: e,
    title: t,
    itemType: n,
    powerKind: "image",
    outputType: "general",
    direction: "upstream",
    layoutIndex: r,
    enabled: (s) => Cl(s) && s.materials.some((o) => o.type === n),
    items: (s) => s.materials.filter((o) => o.type === n).map((o) => {
      const i = Ub(
        s,
        o
      );
      return {
        type: n,
        id: o.id,
        title: o.name,
        prompt: Ab(o),
        externalReferences: i
      };
    })
  };
}
function Sb(e) {
  return e.shots.flatMap(
    (t, n) => t.speech.filter((r) => r.text.trim()).map((r, s) => {
      const o = Cb(e, r);
      return {
        type: "speech",
        id: r.id,
        title: xb(
          e,
          r,
          t.order || n + 1,
          s
        ),
        prompt: r.text.trim(),
        ...o ? { paramValues: { voice: o } } : {},
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
function Cb(e, t) {
  return t.kind === "narration" ? e.narrator_voice.trim() : (e.materials.find(
    (n) => n.type === "character" && n.id === t.character_id
  )?.voice || "").trim();
}
function kb(e) {
  return e.shots.flatMap((t, n) => {
    const r = cy(t);
    return r.length ? [
      {
        type: "subtitle",
        id: t.id,
        title: `镜头 ${t.order || n + 1} 字幕`,
        prompt: r.map((s) => s.text).join(" / "),
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
function Rb(e) {
  return e.shots.flatMap((t, n) => {
    const r = t.speech.filter(dy);
    if (!r.length)
      return [];
    const s = r.map((c) => c.id), o = r[0]?.character_id, i = t.speech.filter((c) => c.text.trim()).map((c) => c.id);
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
        speechIds: s,
        characterId: o,
        shotDuration: t.duration,
        optional: !0
      }
    ];
  });
}
function xb(e, t, n, r) {
  if (t.kind === "narration")
    return `镜头 ${n} 旁白 ${r + 1}`;
  const s = e.materials.find(
    (o) => o.type === "character" && o.id === t.character_id
  );
  return `镜头 ${n} ${s?.name || "角色"}配音`;
}
function Ab(e) {
  return e.prompt.trim() || `${e.name}素材`;
}
function Tb(e, t) {
  return jf(
    Ml(e, t)
  );
}
function jf(e) {
  return e.map((t) => ({
    type: t.type,
    id: t.id
  }));
}
function Mb(e, t, n) {
  const r = Tb(e, t), s = Kb(e, t), o = t.match_previous ? Ob(e, n) : void 0;
  if (!o)
    return {
      previousShot: void 0,
      dependencyItems: [],
      referenceItems: r,
      externalReferences: s
    };
  const i = {
    type: "shot_image",
    id: o.id
  };
  return {
    previousShot: o,
    dependencyItems: [i],
    referenceItems: [i, ...r],
    externalReferences: s
  };
}
function Db(e, t, n, r) {
  const s = uy(
    e.shots,
    n,
    r
  ), o = new Set(s.materialIDs), i = Ml(e, t).filter(
    (y) => o.has(y.id)
  ), c = jf(i), a = Eb(
    e,
    s.referenceKeys,
    s.includeGlobalReferences,
    i
  ), d = s.anchorID, u = d ? { type: "shot_image", id: d } : void 0;
  return {
    anchorLabel: Pb(
      e,
      t,
      n,
      r,
      s
    ),
    dependencyItems: u ? [u] : [],
    referenceItems: [...u ? [u] : [], ...c],
    referenceMaterials: i,
    externalReferences: a
  };
}
function Eb(e, t, n, r) {
  const s = new Set(
    r.flatMap((i) => i.reference_keys)
  );
  if (r.length)
    for (const i of Qi(e, "image"))
      s.add(i.key);
  const o = new Set(t);
  return ea(
    e.references.filter(
      (i) => i.kind === "image" && !s.has(i.key) && (Vf.image.has(i.purpose) ? n : o.has(i.key))
    )
  );
}
function Pb(e, t, n, r, s) {
  const { anchorID: o, anchorFrameRole: i, anchorShotIndex: c } = s;
  if (!o)
    return "";
  if (o === t.id)
    return "本镜头首帧";
  const a = e.shots[c];
  if (!a)
    return "";
  const d = c === n - 1 ? "上一镜头" : "镜头", u = i === "end" ? "尾帧" : "连续性参考帧";
  return r === "start" ? `${d} ${a.order || c + 1} 的${u}` : `${d} ${a.order || c + 1} 的${u}规划图`;
}
function Ob(e, t) {
  for (let n = t - 1; n >= 0; n -= 1) {
    const r = e.shots[n];
    if (!r.continue_previous)
      return r;
  }
}
function Fb(e, t, n, r, s) {
  if (ks(r))
    return Bb(
      e,
      t,
      n,
      s || Tl(t)
    );
  const o = Lf(e, t), i = n > 0 ? e.shots[n - 1] : void 0;
  if (t.continue_previous && i) {
    const c = { type: "shot", id: i.id };
    return {
      dependencyItems: [c],
      referenceItems: [c],
      externalReferences: o
    };
  }
  return {
    dependencyItems: [],
    referenceItems: [{ type: "shot_image", id: t.id }],
    externalReferences: o
  };
}
function Bb(e, t, n, r) {
  const s = Lf(e, t), o = {
    type: "shot_image",
    id: t.id
  }, i = r.nodeMode === "none" ? [] : [o];
  if (r.mode === "next_first" && t.shared_end_shot_id) {
    const a = { type: "shot_image", id: t.shared_end_shot_id };
    return {
      dependencyItems: [],
      referenceItems: [...i, a],
      externalReferences: s
    };
  }
  const c = n > 0 ? e.shots[n - 1] : void 0;
  if (t.continue_previous && c) {
    const a = { type: "shot", id: c.id };
    return {
      dependencyItems: [a],
      referenceItems: [a, ...i],
      externalReferences: s
    };
  }
  return {
    dependencyItems: [],
    referenceItems: i,
    externalReferences: s
  };
}
function zb(e, t, n, r = []) {
  return zi(t, "start");
}
function _u(e, t, n, r, s, o = []) {
  return zi(t, n);
}
function $b(e, t, n) {
  return rd([
    `镜头画面：${t.description.trim()}`,
    t.spatial_layout.trim() ? `空间关系：${t.spatial_layout.trim()}` : "",
    `起始状态：${t.continuity_state.entry.trim()}`,
    t.start_framing?.trim() ? `静态构图：${t.start_framing.trim()}` : ""
  ]);
}
function jb(e, t, n) {
  const r = zi(t, "start"), s = zi(t, "end");
  return [
    {
      title: "首帧",
      description: t.continuity_state.entry.trim(),
      prompt: r
    },
    {
      title: "尾帧",
      description: t.continuity_state.exit.trim(),
      prompt: s
    }
  ];
}
function Lb(e) {
  return [
    `首帧：${e[0]?.prompt || ""}`,
    `尾帧：${e[1]?.prompt || ""}`
  ].join(`

`);
}
function zi(e, t) {
  const n = t === "end" ? e.continuity_state.exit.trim() : e.continuity_state.entry.trim();
  return rd([
    `镜头画面：${e.description.trim()}`,
    e.spatial_layout.trim() ? `空间关系：${e.spatial_layout.trim()}` : "",
    `${t === "end" ? "尾帧" : "首帧"}状态：${n}`,
    (t === "end" ? e.end_framing : e.start_framing)?.trim() ? `静态构图：${(t === "end" ? e.end_framing : e.start_framing)?.trim()}` : ""
  ]);
}
function Vb(e, t, n = [], r, s) {
  return rd([
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
function rd(e) {
  return e.filter(Boolean).join(`
`);
}
function Ub(e, t) {
  return ea([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Qi(e, "image")
  ]);
}
function Kb(e, t) {
  return ea([
    ...e.references.filter(
      (n) => n.kind === "image" && t.reference_keys.includes(n.key)
    ),
    ...Qi(e, "image")
  ]);
}
function Lf(e, t) {
  return ea([
    ...e.references.filter(
      (n) => n.kind === "video" && t.reference_keys.includes(n.key)
    ),
    ...Qi(e, "video")
  ]);
}
const Vf = {
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
function Qi(e, t) {
  const n = Vf[t];
  return e.references.filter(
    (r) => r.kind === t && n.has(r.purpose)
  );
}
function ea(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    n.has(r.asset_id) || (n.add(r.asset_id), t.push(r));
  return t;
}
function Uf(e) {
  return { aspectRatio: e.aspect_ratio };
}
function qb(e, t, n, r) {
  const s = r || Tl(t);
  return {
    aspectRatio: e.aspect_ratio,
    duration: t.duration,
    ...ks(n) && s.referenceMode ? { referenceMode: s.referenceMode } : {}
  };
}
function ws(e, t) {
  const n = String(e || "");
  return n.trim() && n.trim() === String(t || "").trim() ? "" : n;
}
function Gb(e, t) {
  return !!ws(e, t).trim();
}
function Wb(e, t, n) {
  if (!t?.trim())
    return e;
  const r = ws(e.prompt, t), s = e.promptContent, o = xc(s), i = s?.parts.filter((h) => h.type === "text").map((h) => h.text).join(""), c = [o, i].some(
    (h) => !!h?.trim() && !ws(h, t)
  ), a = c ? mr(
    r,
    wn(s)
  ) : s, d = c && !a?.parts.length ? void 0 : a;
  let u = e.paramValues;
  const y = n ? u?.[n] : void 0;
  if (n && typeof y == "string") {
    const h = ws(y, t);
    h !== y && (u = { ...u, [n]: h });
  }
  return r === e.prompt && d === s && u === e.paramValues ? e : { ...e, prompt: r, promptContent: d, paramValues: u };
}
function p0(e, t, n) {
  const r = Wb(
    e,
    t,
    n
  ), s = String(t || "");
  if (!s.trim())
    return r;
  const o = xc(
    r.promptContent
  ), i = r.promptContent?.parts.filter((u) => u.type === "text").map((u) => u.text).join(""), c = r.prompt?.trim() ? r.prompt : i?.trim() ? o : s;
  let a = r.paramValues;
  n && a?.[n] !== c && (a = { ...a || {}, [n]: c });
  const d = r.promptContent ? mr(
    c,
    wn(r.promptContent)
  ) : r.promptContent;
  return c === r.prompt && d === r.promptContent && a === r.paramValues ? r : { ...r, prompt: c, promptContent: d, paramValues: a };
}
const Kf = "storyboard-soundtrack";
function Hb(e) {
  let t = !1;
  const n = e.map((r) => {
    if (r.storyboardItem?.itemType !== "video_compose" || !r.composerDraft?.videoComposition?.storyboardBaseline)
      return r;
    const s = r.storyboardItem.sourceNodeId, o = e.find((a) => a.id === s);
    if (!o) return r;
    const i = bn([
      o.asset?.version?.content,
      o.resultOutput
    ]);
    if (!i || !Es(i)) return r;
    const c = qf({
      storyboard: i,
      sourceNodeId: s,
      nodes: e,
      current: r.composerDraft.videoComposition
    });
    return JSON.stringify(c) === JSON.stringify(r.composerDraft.videoComposition) ? r : (t = !0, {
      ...r,
      composerDraft: { ...r.composerDraft, videoComposition: c }
    });
  });
  return t ? n : e;
}
function qf(e) {
  const t = new Map(
    (e.current?.clips || []).map((a) => [a.id, a])
  ), n = e.storyboard.shots.map(
    (a, d) => Qb({
      ...e,
      shot: a,
      index: d,
      current: t.get(a.id)
    })
  ), r = $c({
    version: 3,
    clips: Jb(
      n,
      e.storyboard.timeline_duration_ms
    ),
    audioTracks: Xb(e.storyboard),
    settings: e.current?.settings || { resolution: "auto", fps: 0 }
  }), s = e.current?.storyboardBaseline, o = Oc(e.storyboard), i = ec(
    r.clips,
    s?.clips || [],
    e.current?.clips || [],
    (a, d, u) => Yb(a, d, u, o)
  ), c = ec(
    r.audioTracks,
    s?.audioTracks || [],
    e.current?.audioTracks || [],
    (a, d, u) => Qa(a, d, u, [
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
    ...r,
    clips: o ? i.map((a) => ({
      ...a,
      originalVolume: 0,
      speechTracks: [],
      subtitleTracks: []
    })) : i,
    audioTracks: o ? c.filter((a) => a.id === Kf).map((a) => ({ ...a, volume: 1, kind: "music" })) : c,
    storyboardBaseline: {
      clips: r.clips.map(Gf),
      audioTracks: r.audioTracks
    }
  };
}
function Yb(e, t, n, r) {
  const s = Qa(e, t, n, [
    "title",
    "visualVideo",
    "originalAudioSource",
    "duration",
    "originalVolume",
    "useOriginalVideo",
    "transitionToNext"
  ]);
  return s.speechTracks = r ? [] : ec(
    e.speechTracks,
    t?.speechTracks || [],
    n.speechTracks,
    (o, i, c) => Qa(o, i, c, [
      "audio",
      "startTime",
      "sourceStart",
      "fit",
      "kind",
      "characterId",
      "text",
      "volume"
    ])
  ), s.subtitleTracks = e.subtitleTracks, (!t || n.originalVolume === t.originalVolume) && (s.originalVolume = s.speechTracks.length ? 0.45 : 1), r && (s.originalVolume = 0), Gf(s);
}
function Gf(e) {
  const t = {
    ...e,
    subtitleTracks: eI(
      e.subtitleTracks,
      e.speechTracks,
      e.duration
    )
  };
  return {
    ...t,
    blockingIssues: Yi(t)
  };
}
function Qa(e, t, n, r) {
  if (!t) return e;
  const s = { ...e };
  for (const o of r)
    JSON.stringify(n[o]) !== JSON.stringify(t[o]) && (s[o] = n[o]);
  return s;
}
function ec(e, t, n, r) {
  const s = new Map(t.map((d) => [d.id, d])), o = new Map(n.map((d) => [d.id, d])), i = new Set(e.map((d) => d.id)), c = e.flatMap((d) => {
    const u = s.get(d.id), y = o.get(d.id);
    return u && !y ? [] : [r(d, u, y || d)];
  }), a = n.filter(
    (d) => !s.has(d.id) && !i.has(d.id)
  );
  return Sg(
    [...c, ...a],
    n.map((d) => d.id),
    (d) => d.id
  );
}
function Xb(e) {
  const t = e.references.find(
    (s) => s.purpose === "soundtrack"
  );
  if (!t) return [];
  const n = Number(t.asset_id || 0), r = Number(t.version_id || 0);
  return [
    {
      id: Kf,
      ...n > 0 && r > 0 ? {
        audio: { assetId: n, versionId: r, label: t.label || "主音轨" }
      } : {},
      startTime: 0,
      sourceStart: (e.storyboard_range_start_ms || 0) / 1e3,
      kind: "music",
      volume: Oc(e) ? 1 : 0.35,
      fit: "trim",
      loop: !1,
      fadeOut: Zb(e) ? 0 : 1
    }
  ];
}
function Zb(e) {
  const t = e.storyboard_range_start_ms, n = e.storyboard_range_end_ms, r = e.storyboard_soundtrack_duration_ms;
  return t != null && n != null && r != null && (t > 0 || n < r);
}
function Jb(e, t) {
  if (!t || t <= 0 || e.length === 0)
    return e;
  const n = Math.round(
    e.reduce((u, y) => u + y.duration, 0) * 1e3
  );
  let r = Math.max(
    0,
    n - t
  ), s = 0;
  const o = e.map((u) => {
    const y = u.transitionToNext.type === "none" ? 0 : Math.max(0, u.transitionToNext.durationMs), h = Math.min(
      y,
      r
    );
    return r -= h, h < 100 ? {
      ...u,
      transitionToNext: { type: "none", durationMs: 0 }
    } : (s += h, {
      ...u,
      transitionToNext: { ...u.transitionToNext, durationMs: h }
    });
  }), i = n - s - t;
  if (i <= 0)
    return o;
  const c = o.length - 1, a = o[c], d = a.duration - i / 1e3;
  return d <= 0 || (o[c] = { ...a, duration: d }), o;
}
function Qb(e) {
  const t = Oc(e.storyboard), n = $i(
    e.nodes,
    e.sourceNodeId,
    "shot",
    e.shot.id
  ), r = $i(
    e.nodes,
    e.sourceNodeId,
    "lip_sync",
    e.shot.id
  ), s = tc(n), o = xl(e.storyboard) ? tc(r) : void 0, i = !!e.current?.useOriginalVideo, c = kl(e.storyboard) ? e.shot.speech.filter((I) => I.text.trim()).map(
    (I) => nI(e.nodes, e.sourceNodeId, I)
  ) : [], a = Rl(e.storyboard) ? tI(e.nodes, e.sourceNodeId, e.shot.id) : [], d = !i && o ? o : s, u = e.storyboard.shots[e.index + 1], y = u ? {
    type: u.transition_type,
    durationMs: u.transition_type === "none" ? 0 : u.transition_duration_ms
  } : { type: "none", durationMs: 0 }, h = {
    id: e.shot.id,
    title: `镜头 ${e.shot.order || e.index + 1}`,
    ...d ? { visualVideo: d } : {},
    ...s ? { originalAudioSource: s } : {},
    duration: e.shot.duration,
    originalVolume: t ? 0 : c.length ? 0.45 : 1,
    speechTracks: c,
    subtitleTracks: a,
    useOriginalVideo: i,
    blockingIssues: [],
    transitionToNext: y
  };
  return {
    ...h,
    blockingIssues: Yi(h)
  };
}
function eI(e, t, n) {
  return e.map((r) => {
    if (!r.speechId || t.some((c) => c.id === r.speechId))
      return r;
    const { speechId: s, ...o } = r, i = Math.min(
      n,
      ...e.filter((c) => c.startTime > r.startTime).map((c) => c.startTime)
    );
    return { ...o, endTime: r.endTime ?? i };
  });
}
function tI(e, t, n) {
  const r = $i(e, t, "subtitle", n), s = Xt(r?.resultOutput);
  return (Array.isArray(s.tracks) ? s.tracks : []).flatMap((i) => {
    const c = Xt(i), a = Pn(c.id), d = Pn(c.text);
    if (!a || !d)
      return [];
    const u = wu(c.end_time ?? c.endTime), y = Pn(c.speech_id ?? c.speechId);
    return [
      {
        id: a,
        text: d,
        startTime: Math.max(
          0,
          wu(c.start_time ?? c.startTime)
        ),
        ...u > 0 ? { endTime: u } : {},
        ...y ? { speechId: y } : {},
        source: Pn(c.source) === "speech" ? "speech" : "caption"
      }
    ];
  });
}
function nI(e, t, n) {
  const r = $i(e, t, "speech", n.id), s = tc(r);
  return {
    id: n.id,
    ...s ? { audio: s } : {},
    startTime: n.start_time,
    sourceStart: 0,
    fit: "trim",
    kind: n.kind,
    ...n.character_id ? { characterId: n.character_id } : {},
    text: n.text,
    volume: 1
  };
}
function $i(e, t, n, r) {
  return e.find(
    (s) => s.storyboardItem?.sourceNodeId === t && s.storyboardItem.itemType === n && s.storyboardItem.itemId === r
  );
}
function tc(e) {
  const t = Number(e?.resultRef?.asset_id || 0), n = Number(e?.resultRef?.version_id || 0), r = t && n ? t : Number(e?.asset?.id || 0), s = t && n ? n : Number(e?.asset?.version_id || e?.asset?.version?.id || 0);
  if (!(!r || !s))
    return {
      assetId: r,
      versionId: s,
      label: e?.title || "素材"
    };
}
function wu(e) {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
}
function bu(e) {
  const t = e.storyboardItem, n = [
    t.shotImageMode,
    t.sharedEndShotId || "",
    t.referenceNodeIds,
    t.dependencyNodeIds
  ];
  return t.itemType === "shot_image" ? [
    ...n,
    t.generatedPrompt,
    e.composerDraft?.prompt?.trim(),
    t.frameMediaItems,
    t.imageSequenceFrames
  ] : n;
}
function Iu(e) {
  return JSON.stringify([
    e.asset?.id,
    e.asset?.version_id || e.asset?.version?.id,
    e.resultRef?.asset_id,
    e.resultRef?.version_id,
    e.asset?.version?.content,
    e.resultOutput
  ]);
}
function nc(e, t, n, r) {
  const s = new Map(t.map((h) => [h.id, h])), o = /* @__PURE__ */ new Set(), i = (h) => h.storyboardItem?.sourceNodeId === n;
  for (const h of e) {
    if (!i(h)) continue;
    const I = h.storyboardItem.itemType;
    if (I !== "shot_image" && I !== "shot") continue;
    const w = s.get(h.id);
    (!w || JSON.stringify(bu(h)) !== JSON.stringify(bu(w))) && o.add(h.id);
  }
  const c = /* @__PURE__ */ new Map();
  for (const h of [...e, ...t]) {
    if (!i(h)) continue;
    const I = h.storyboardItem;
    for (const w of [
      ...I.referenceNodeIds || [],
      ...I.dependencyNodeIds || []
    ]) {
      const C = c.get(w) || /* @__PURE__ */ new Set();
      C.add(h.id), c.set(w, C);
    }
  }
  const a = t.filter(
    (h) => i(h) && h.storyboardItem?.itemType === "video_compose"
  );
  for (const h of [...e, ...t]) {
    if (!i(h) || h.storyboardItem?.itemType !== "shot") continue;
    const I = c.get(h.id) || /* @__PURE__ */ new Set();
    a.forEach((w) => I.add(w.id)), c.set(h.id, I);
  }
  const d = (h, I = 0) => {
    const w = [...h], C = new Set(w);
    for (let S = 0; S < w.length; S += 1)
      for (const x of c.get(w[S]) || [])
        C.has(x) || (C.add(x), !(I > 0 && s.get(x)?.resultRef?.execution_id === I) && (o.add(x), w.push(x)));
  };
  d(o);
  const u = new Set(
    t.filter(
      (h) => i(h) && h.storyboardItem?.itemType === "shot" && h.storyboardItem.shotImageMode === "next_first"
    ).map((h) => h.storyboardItem.sharedEndShotId)
  );
  for (const h of r || []) {
    if (!i(h) || h.storyboardItem?.itemType !== "shot_image" || !u.has(h.storyboardItem.itemId))
      continue;
    const I = s.get(h.id);
    if (!I || Iu(h) === Iu(I)) continue;
    const w = Number(I.resultRef?.execution_id || 0), C = w !== Number(h.resultRef?.execution_id || 0) ? w : 0;
    d([I.id], C);
  }
  let y = !1;
  return t.forEach((h, I) => {
    if (!i(h) || !o.has(h.id) || !h.asset && !h.resultRef && h.resultOutput == null)
      return;
    const w = { ...h };
    delete w.asset, delete w.resultRef, delete w.resultOutput, delete w.resultView, t[I] = w, y = !0;
  }), y;
}
function rI(e, t) {
  return e ? t ? "materialize" : "defer-materialize" : "refresh";
}
function oI(e, t, n, r) {
  return !t || rc(e, t) !== rc(n, r);
}
function rc(e, t) {
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
function sI(e) {
  return !!e.storyboardItem && Gb(
    e.composerDraft?.prompt,
    e.storyboardItem?.generatedPrompt
  );
}
function iI(e, t) {
  const n = String(
    e.storyboardItem?.generatedPrompt || ""
  ).trim(), r = String(e.composerDraft?.prompt || "");
  if (!r.trim() || r.trim() === n)
    return null;
  const s = new Set(e.storyboardItem?.referenceNodeIds || []), o = e.storyboardItem ? {
    type: e.storyboardItem.itemType,
    continuityAnchor: e.storyboardItem.continuityAnchor,
    sharedEndShotId: e.storyboardItem.sharedEndShotId
  } : void 0, i = t.filter((I) => s.has(I.id)).map((I) => Yf(I, o)).filter((I) => !!I), c = new Set(
    e.storyboardItem?.externalReferenceAssetIds || []
  ), a = wn(
    e.composerDraft?.promptContent
  ).filter((I) => c.has(I.refId)), d = t.find(
    (I) => I.id === e.storyboardItem?.sourceNodeId
  ), y = ((d ? bn([
    d.asset?.version?.content,
    d.resultOutput
  ]) : null)?.references || []).filter((I) => c.has(I.asset_id)).map(Xf), h = [
    ...i,
    ...a,
    ...y
  ];
  return {
    ...e.composerDraft || {},
    prompt: "",
    promptContent: h.length ? mr("", h) : void 0,
    paramValues: Jf(
      e.composerDraft?.paramValues,
      r,
      ""
    )
  };
}
function ji(e, t, n) {
  const r = Cu(n);
  return e.find(
    (s) => Number(s.id || 0) > 0 && String(s.kind || "").trim().toLowerCase() === t && Cu(s.outputType) === r
  ) || null;
}
function vu(e) {
  return Wf(e, "materialize");
}
function Ra(e) {
  return Wf(e, "refresh");
}
function Wf(e, t) {
  let n = e.canvas;
  const r = e.sourceNodeIds ? new Set(e.sourceNodeIds) : null;
  for (const s of e.canvas.nodes) {
    if (t === "materialize" && s.id !== e.sourceNodeId || t === "refresh" && r?.has(s.id) === !1 || s.type !== "power" || !pr(
      s.power,
      s.kind,
      s.outputType
    ))
      continue;
    const o = bn([
      s.asset?.version?.content,
      s.resultOutput
    ]);
    if (!o || !Es(o))
      continue;
    const i = n.nodes.find((y) => y.id === s.id) || s;
    if (t === "refresh") {
      n = Nu({
        canvas: n,
        previousNodes: e.previousNodes,
        storyboardNode: i,
        storyboard: o,
        assetCate: e.assetCate,
        powers: e.powers,
        framePlanVersion: Jr(
          i.storyboardFramePlanVersion
        )
      });
      continue;
    }
    const c = cI(
      i,
      o
    ), a = Jr(
      i.storyboardFramePlanVersion
    ) || 0, d = i.storyboardMaterializedSignature !== c || a < Dl, u = fy(
      i.storyboardFramePlanVersion,
      d
    );
    n = d ? uI({
      canvas: n,
      storyboardNode: i,
      storyboard: o,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: u
    }) : Nu({
      canvas: n,
      storyboardNode: i,
      storyboard: o,
      assetCate: e.assetCate,
      powers: e.powers,
      framePlanVersion: u
    }), n = dI(
      n,
      i.id,
      c,
      u
    );
  }
  return n;
}
function aI(e, t) {
  if (!e || e.type !== "power" || !pr(e.power, e.kind, e.outputType))
    return !1;
  const n = { ...e, ...t }, r = bn([
    n.asset?.version?.content,
    n.resultOutput
  ]);
  if (!r || !Es(r))
    return !1;
  const s = bn([
    e.asset?.version?.content,
    e.resultOutput
  ]);
  return oI(
    e,
    s,
    n,
    r
  );
}
function cI(e, t) {
  return Zt(rc(e, t));
}
function dI(e, t, n, r) {
  const s = e.nodes.findIndex(
    (c) => c.id === t
  ), o = Jr(r);
  if (s < 0 || e.nodes[s].storyboardMaterializedSignature === n && Jr(
    e.nodes[s].storyboardFramePlanVersion
  ) === o)
    return e;
  const i = [...e.nodes];
  return i[s] = {
    ...i[s],
    storyboardMaterializedSignature: n,
    storyboardFramePlanVersion: o
  }, { ...e, nodes: i };
}
function Nu(e) {
  const t = [...e.canvas.nodes], n = /* @__PURE__ */ new Map();
  t.forEach((o, i) => {
    const c = o.storyboardItem;
    c?.sourceNodeId === e.storyboardNode.id && n.set(
      Do(c.sourceNodeId, c.itemType, c.itemId),
      i
    );
  });
  let r = !1;
  const s = Ja.filter(
    (o) => o.enabled(e.storyboard)
  );
  for (const o of s) {
    const i = o.local ? null : ji(e.powers, o.powerKind, o.outputType);
    for (const c of o.items(e.storyboard, {
      framePlanVersion: e.framePlanVersion
    })) {
      const a = n.get(
        Do(
          e.storyboardNode.id,
          c.type,
          c.id
        )
      ) ?? -1;
      if (a < 0)
        continue;
      const d = Hf(
        c,
        t,
        e.storyboardNode.id
      ), u = t[a], y = Zf(
        u,
        u.groupId || "",
        d,
        o,
        i,
        { preserveStructure: !0, nodes: t }
      );
      y !== u && (t[a] = y, r = !0);
    }
    (o.itemType === "shot_image" || o.itemType === "shot") && (r = nc(
      e.canvas.nodes,
      t,
      e.storyboardNode.id,
      e.previousNodes
    ) || r);
  }
  if (El(e.storyboard)) {
    const o = np({
      nodes: t,
      storyboardNode: e.storyboardNode,
      storyboard: e.storyboard,
      assetCate: e.assetCate,
      power: ji(e.powers, "video", "video_compose"),
      nextNodeNo: e.canvas.nextNodeNo,
      createMissing: !1,
      preservePosition: !0
    });
    r = r || !!o?.changed;
  }
  return r ? { ...e.canvas, nodes: t } : e.canvas;
}
function uI(e) {
  const t = Jr(e.framePlanVersion) || Dl, n = [...e.canvas.nodes], r = /* @__PURE__ */ new Set(), s = new Set(
    Ja.map((w) => w.itemType)
  ), o = Ja.filter(
    (w) => w.enabled(e.storyboard)
  ), i = El(
    e.storyboard
  );
  s.add("video_compose"), i && r.add(
    Do(
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  );
  const c = o.map((w) => ({
    spec: w,
    items: w.items(e.storyboard, { framePlanVersion: t }),
    power: w.local ? null : ji(e.powers, w.powerKind, w.outputType)
  }));
  for (const { items: w } of c)
    for (const C of w)
      r.add(
        Do(e.storyboardNode.id, C.type, C.id)
      );
  let a = !1;
  for (let w = n.length - 1; w >= 0; w -= 1) {
    const C = n[w].storyboardItem;
    !C || C.sourceNodeId !== e.storyboardNode.id || !s.has(C.itemType) || r.has(
      Do(
        C.sourceNodeId,
        C.itemType,
        C.itemId
      )
    ) || (n.splice(w, 1), a = !0);
  }
  const d = ub({
    sourceNode: e.storyboardNode,
    groups: c.map(({ spec: w, items: C, power: S }) => ({
      key: w.key,
      layoutIndex: w.layoutIndex,
      itemCount: C.length,
      power: S,
      powerKind: w.powerKind,
      direction: w.direction
    }))
  });
  let u = qc(n, e.canvas.nextNodeNo);
  a = a || u !== e.canvas.nextNodeNo;
  for (const { spec: w, items: C, power: S } of c) {
    const x = d.get(w.key);
    if (!x)
      continue;
    const T = pI({
      nodes: n,
      storyboardNode: e.storyboardNode,
      spec: w,
      layout: x,
      assetCate: e.assetCate
    });
    a = a || T.changed;
    for (const X of C) {
      const O = Hf(
        X,
        n,
        e.storyboardNode.id
      ), we = n.findIndex(
        (D) => Li(
          D,
          e.storyboardNode.id,
          O.type,
          O.id
        )
      );
      if (we >= 0) {
        const D = n[we], V = Zf(
          D,
          T.node.id,
          O,
          w,
          S,
          { nodes: n }
        );
        V !== D && (n[we] = V, a = !0);
        continue;
      }
      const ve = mI({
        nodes: n,
        group: T.node,
        storyboardNode: e.storyboardNode,
        item: O,
        assetCate: e.assetCate,
        spec: w,
        power: S
      });
      ve.nodeNo = u++, n.push(ve), a = !0;
    }
    (w.itemType === "shot_image" || w.itemType === "shot") && (a = nc(
      e.canvas.nodes,
      n,
      e.storyboardNode.id
    ) || a);
    const U = C.map(
      (X) => n.find(
        (O) => O.groupId === T.node.id && Li(
          O,
          e.storyboardNode.id,
          X.type,
          X.id
        )
      )
    ).filter((X) => !!X), ee = fb(
      T.node,
      U
    );
    for (const X of U) {
      const O = ee.positions.get(X.id);
      if (!O || X.x === O.x && X.y === O.y)
        continue;
      const we = n.indexOf(X);
      n[we] = { ...X, ...O }, a = !0;
    }
    const Z = n.findIndex((X) => X.id === T.node.id), oe = n[Z];
    (oe.width !== ee.width || oe.height !== ee.height) && (n[Z] = {
      ...oe,
      width: ee.width,
      height: ee.height
    }, a = !0);
  }
  const y = new Set(o.map((w) => w.key));
  for (let w = n.length - 1; w >= 0; w -= 1) {
    const C = n[w];
    C.type !== "group" || C.group?.origin !== "script" || C.group.sourceNodeId !== e.storyboardNode.id || !C.group.syncKey || y.has(
      C.group.syncKey
    ) || (n.splice(w, 1), a = !0);
  }
  a = nc(
    e.canvas.nodes,
    n,
    e.storyboardNode.id
  ) || a;
  const h = i ? np({
    nodes: n,
    storyboardNode: e.storyboardNode,
    storyboard: e.storyboard,
    assetCate: e.assetCate,
    power: ji(e.powers, "video", "video_compose"),
    nextNodeNo: u
  }) : null;
  h && (u = h.nextNodeNo, a = a || h.changed);
  let I = II(
    e.canvas.edges,
    n,
    e.storyboardNode.id,
    o
  );
  return I = vI(I, n, e.storyboardNode.id), I = h ? NI(
    I,
    n,
    e.storyboardNode.id,
    h.node.id,
    o
  ) : SI(I, e.storyboardNode.id), I !== e.canvas.edges && (a = !0), a ? { ...e.canvas, nextNodeNo: u, nodes: n, edges: I } : e.canvas;
}
function Hf(e, t, n) {
  const r = (I) => (I || []).map(
    (w) => t.find(
      (C) => Li(C, n, w.type, w.id)
    )
  ).filter((w) => !!w), s = r(e.dependencyItems), o = r(e.referenceItems), i = e.externalReferences || [], c = {
    ...e,
    dependencyNodeIds: s.map((I) => I.id),
    referenceNodeIds: o.map((I) => I.id)
  };
  if (!["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
    e.type
  ))
    return c;
  const a = lI(
    e.prompt,
    o,
    i
  ), d = a === e.prompt ? c : { ...c, prompt: a }, u = i.map(
    Xf
  );
  if (u.push(
    ...o.map((I) => Yf(I, e)).filter((I) => !!I)
  ), !u.length)
    return d;
  const y = mr(
    a,
    u
  ), h = xc(y);
  return ll(y) ? { ...c, prompt: h, promptContent: y } : { ...d, prompt: h };
}
function lI(e, t, n = []) {
  const r = [], s = /* @__PURE__ */ new Set();
  for (const o of n) {
    const i = Bd(o.label), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), r.push(c));
  }
  for (const o of t) {
    const i = Bd(o.title), c = i ? `@${i}` : "";
    !c || s.has(c) || e.includes(c) || (s.add(c), r.push(c));
  }
  return [r.join(" "), e].filter(Boolean).join(" ").trim();
}
function Yf(e, t) {
  const n = Number(e.resultRef?.asset_id || e.asset?.id || 0), r = Number(
    e.resultRef?.version_id || e.asset?.version_id || e.asset?.version?.id || 0
  );
  if (!n || !r)
    return null;
  const s = Ec(
    e.storyboardItem?.frameMediaItems
  ), o = Pc(
    e.storyboardItem?.shotImageMode
  ), i = fI(
    e.storyboardItem?.itemType,
    t,
    s,
    e.storyboardItem?.shotId || e.storyboardItem?.itemId
  );
  return {
    refType: "asset",
    refId: n,
    versionId: r,
    label: e.title,
    origin: "storyboard",
    originID: e.id,
    ...i,
    ...!i.mediaIndex && !i.mediaItems ? {
      usage: t?.type === "shot" && e.storyboardItem?.itemType === "shot_image" ? o === "references" ? "reference" : Pl(e.storyboardItem.frameRole) : void 0
    } : {}
  };
}
function fI(e, t, n, r) {
  if (e !== "shot_image" || !n.length)
    return {};
  if (t?.type === "shot" && t.sharedEndShotId) {
    const s = n.find((o) => o.frameRole === "start");
    return {
      mediaItems: s ? [
        {
          url: "",
          index: s.mediaIndex,
          usage: r === t.sharedEndShotId ? "lastFrame" : "firstFrame"
        }
      ] : []
    };
  }
  if (t?.type === "shot") {
    const s = n.find((i) => i.frameRole === "end") || n.find((i) => i.frameRole === "start");
    return {
      mediaItems: (t.continuityAnchor ? s ? [s] : [] : n).map((i) => ({
        url: "",
        index: i.mediaIndex,
        usage: Pl(i.frameRole)
      }))
    };
  }
  if (t?.type === "shot_image") {
    const s = Vd(n, "end") || Vd(n, "start");
    return s ? { mediaIndex: s } : {};
  }
  return {};
}
function Xf(e) {
  return {
    refType: "asset",
    refId: e.asset_id,
    versionId: e.version_id,
    label: e.label
  };
}
function pI(e) {
  const t = od(
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
    const o = e.layout.bounds.x - t.x, i = e.layout.bounds.y - t.y;
    let c = t;
    for (const [a, d] of e.nodes.entries()) {
      if (d.id !== t.id && d.groupId !== t.id)
        continue;
      const u = {
        ...d,
        x: d.x + o,
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
      e.nodes[a] = u, d.id === t.id && (c = u);
    }
    return { node: c, changed: !0 };
  }
  const n = e.layout.bounds, r = Zi("group", e.assetCate, e.nodes.length, {
    x: n.x,
    y: n.y
  });
  return r.id = id(
    e.nodes,
    `script-group-${Zt(e.storyboardNode.id)}-${e.spec.key}`
  ), r.title = e.spec.title, r.width = n.width, r.height = n.height, r.group = {
    origin: "script",
    sourceNodeId: e.storyboardNode.id,
    syncKey: e.spec.key,
    layoutKey: e.layout.layoutKey
  }, e.nodes.push(r), { node: r, changed: !0 };
}
function od(e, t, n) {
  return e.find(
    (r) => r.type === "group" && r.group?.origin === "script" && r.group.sourceNodeId === t && r.group.syncKey === n
  );
}
function mI(e) {
  const t = Zi(
    "power",
    e.assetCate,
    e.nodes.length,
    { x: e.group.x, y: e.group.y },
    e.power ? { power: e.power } : void 0
  );
  t.id = id(
    e.nodes,
    `script-item-${Zt(
      Do(
        e.storyboardNode.id,
        e.item.type,
        e.item.id
      )
    )}`
  ), t.title = e.item.title, t.description = e.item.prompt, t.kind = e.spec.powerKind, t.outputType = e.spec.outputType, e.power || Object.assign(
    t,
    Ji({
      kind: e.spec.powerKind,
      outputType: e.spec.outputType
    })
  ), !e.power && !e.spec.local && (t.subtitle = `未配置${CI(e.spec)}能力`, t.description = `${t.subtitle}。配置并启用能力后可运行此条目。`), e.spec.local && (t.subtitle = "本地字幕轨", t.description = e.item.prompt || "当前镜头字幕轨", t.resultOutput = e.item.localOutput), t.groupId = e.group.id, t.composerDraft = {
    prompt: "",
    promptContent: Qf(
      "",
      void 0,
      e.item.promptContent
    ),
    paramValues: e.item.paramValues
  }, t.storyboardItem = ep(
    e.storyboardNode.id,
    e.item
  );
  const n = lb(
    e.group,
    e.nodes,
    t
  );
  return t.x = n.x, t.y = n.y, t;
}
function Zf(e, t, n, r, s, o = {}) {
  const i = e.storyboardItem;
  if (!i)
    return e;
  const c = String(e.composerDraft?.prompt || ""), a = ws(
    c,
    i.generatedPrompt
  ), d = a !== c, u = gI(
    e.composerDraft?.paramValues,
    c,
    a,
    n.paramValues,
    n.type === "speech" ? i.generatedInputs?.voice : void 0,
    n.type === "speech"
  ), y = u !== e.composerDraft?.paramValues, h = o.nodes || [], I = _I(
    e,
    h
  ), w = Qf(
    a,
    I,
    n.promptContent,
    wI(
      e,
      n,
      h,
      I
    ),
    h
  ), C = JSON.stringify(e.composerDraft?.promptContent || null) !== JSON.stringify(w || null), S = ep(i.sourceNodeId, n), x = o.preserveStructure && e.titleMode === "manual" ? e.title : n.title, T = e.title !== x, U = i.generatedPrompt !== n.prompt, ee = o.preserveStructure ? e.groupId || "" : t, Z = !e.power && !!s, oe = e.kind !== r.powerKind, X = e.outputType !== r.outputType, O = r.local && JSON.stringify(e.resultOutput || null) !== JSON.stringify(n.localOutput || null);
  return (e.groupId || "") === ee && !d && !y && !C && !T && !Z && !oe && !X && !O && tp(i, S) ? e : {
    ...e,
    title: x,
    kind: r.powerKind,
    outputType: r.outputType,
    ...Z ? {
      power: s || void 0,
      subtitle: s?.output?.name || s?.name || e.subtitle
    } : {},
    description: U || Z ? n.prompt : e.description,
    ...r.local ? { resultOutput: n.localOutput } : {},
    groupId: ee,
    composerDraft: d || y || C ? {
      ...e.composerDraft || {},
      prompt: a,
      promptContent: w,
      paramValues: u
    } : e.composerDraft,
    storyboardItem: S
  };
}
function Jf(e, t, n) {
  if (!e || !t || t === n)
    return e;
  let r;
  for (const [s, o] of Object.entries(e))
    o === t && (r ||= { ...e }, r[s] = n);
  return r || e;
}
function gI(e, t, n, r, s, o = !1) {
  let i = Jf(
    e,
    t,
    n
  );
  for (const [c, a] of Object.entries(r || {}))
    o && c === "voice" && String(e?.voice || "") !== String(s || "") || i?.[c] !== a && (i = { ...i || {}, [c]: a });
  return o && !r?.voice && s && e?.voice === s && (i = { ...i || {} }, delete i.voice), i;
}
function Qf(e, t, n, r, s = []) {
  const o = wn(n), i = wn(r);
  if (!o.length && !i.length)
    return t;
  const c = new Map(
    i.map((h) => [
      ds(h),
      h
    ])
  ), a = new Map(
    o.map((h) => [
      ds(h),
      h
    ])
  ), d = wn(t), u = new Set(d.map(ds)), y = d.flatMap((h) => {
    const I = ds(h), w = c.get(I);
    if (!w)
      return [h];
    const C = a.get(I);
    return C ? [
      yI(h, w, C, s)
    ] : bI(h, w) ? [] : [h];
  });
  for (const h of o) {
    const I = ds(h);
    !u.has(I) && !c.has(I) && !d.some(
      (w) => w.refType === h.refType && w.refId === h.refId
    ) && y.push(h);
  }
  return mr(e, y);
}
function ds(e) {
  return JSON.stringify([
    e.refType,
    e.origin === "storyboard" && e.originID ? null : e.refId,
    e.origin || "",
    e.originID || ""
  ]);
}
function yI(e, t, n, r) {
  if (e.refId !== t.refId && e.refId !== n.refId)
    return e;
  let s = n;
  for (const o of [
    "usage",
    "purpose",
    "mediaURL",
    "mediaIndex",
    "mediaItems",
    "contentSelection"
  ])
    JSON.stringify(e[o] ?? null) !== JSON.stringify(t[o] ?? null) && (s = { ...s, [o]: e[o] });
  return e.contentSelection ? { ...s, versionId: e.versionId } : hI(e, s, r);
}
function hI(e, t, n) {
  if (e.refId === t.refId && e.versionId === t.versionId || !t.mediaURL && !t.mediaIndex && !t.mediaItems?.length)
    return t;
  const r = n.find((a) => a.id === t.originID), s = r?.kind, o = r && (s === "image" || s === "video" || s === "audio") ? Ol(Cg(r), s) : [], i = (a, d) => {
    const u = d && d > 0 ? d - 1 : o.indexOf(a || "");
    return o[u] ? { url: o[u], index: u + 1 } : null;
  };
  if (t.mediaItems?.length) {
    const a = t.mediaItems.map((d) => {
      const u = i(d.url, d.index);
      return u ? { ...d, ...u } : null;
    });
    return a.every((d) => d !== null) ? {
      ...t,
      mediaURL: void 0,
      mediaIndex: void 0,
      mediaItems: a,
      mediaCount: o.length
    } : e;
  }
  const c = i(t.mediaURL, t.mediaIndex);
  return c ? {
    ...t,
    mediaURL: c.url,
    mediaIndex: c.index,
    mediaCount: o.length
  } : e;
}
function _I(e, t) {
  if (e.storyboardItem?.generatedInputs)
    return e.composerDraft?.promptContent;
  const n = new Set(e.storyboardItem?.referenceNodeIds || []), r = wn(
    e.composerDraft?.promptContent
  );
  let s = !1;
  const o = r.map((i) => {
    if (i.originID)
      return i;
    const c = t.find(
      (a) => n.has(a.id) && Number(a.resultRef?.asset_id || a.asset?.id || 0) === i.refId
    );
    return c ? (s = !0, { ...i, origin: "storyboard", originID: c.id }) : i;
  });
  return s ? mr(
    String(e.composerDraft?.prompt || ""),
    o
  ) : e.composerDraft?.promptContent;
}
function wI(e, t, n, r) {
  const s = e.storyboardItem;
  if (s?.generatedInputs)
    return s.generatedInputs.referenceContent;
  const o = new Set(s?.referenceNodeIds || []), i = /* @__PURE__ */ new Set([
    ...s?.externalReferenceAssetIds || [],
    ...n.filter((u) => o.has(u.id)).map(
      (u) => Number(u.resultRef?.asset_id || u.asset?.id || 0)
    )
  ]), c = new Set(
    wn(t.promptContent).map(
      (u) => u.refId
    )
  ), a = new Set(s?.externalReferenceAssetIds || []), d = wn(r).filter(
    (u) => i.has(u.refId) && !c.has(u.refId)
  ).map(
    (u) => a.has(u.refId) ? {
      ...u,
      usage: void 0,
      purpose: void 0,
      mediaURL: void 0,
      mediaIndex: void 0,
      mediaItems: void 0,
      contentSelection: void 0
    } : u
  );
  return d.length ? mr("", d) : void 0;
}
function bI(e, t) {
  const n = (r) => [
    r.refId,
    r.contentSelection ? r.versionId || 0 : null,
    r.mediaURL || "",
    r.mediaIndex || 0,
    r.mediaItems || [],
    r.contentSelection || null,
    r.usage || "",
    r.purpose || ""
  ];
  return JSON.stringify(n(e)) === JSON.stringify(n(t));
}
function ep(e, t) {
  return {
    sourceNodeId: e,
    itemType: t.type,
    itemId: t.id,
    generatedPrompt: t.prompt,
    generatedInputs: {
      referenceContent: ll(t.promptContent) ? mr(
        "",
        wn(t.promptContent)
      ) : void 0,
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
    optional: t.optional
  };
}
function tp(e, t) {
  return e.sourceNodeId === t.sourceNodeId && e.itemType === t.itemType && e.itemId === t.itemId && e.generatedPrompt === t.generatedPrompt && JSON.stringify(e.generatedInputs || null) === JSON.stringify(t.generatedInputs || null) && zr(e.dependencyNodeIds, t.dependencyNodeIds) && zr(e.referenceNodeIds, t.referenceNodeIds) && zr(
    e.externalReferenceAssetIds,
    t.externalReferenceAssetIds
  ) && e.shotId === t.shotId && e.shotImageMode === t.shotImageMode && e.frameRole === t.frameRole && zr(e.frameMediaItems, t.frameMediaItems) && zr(e.imageSequenceFrames, t.imageSequenceFrames) && e.speechId === t.speechId && zr(e.speechIds, t.speechIds) && e.characterId === t.characterId && e.speechKind === t.speechKind && e.speakerMode === t.speakerMode && e.startTime === t.startTime && e.shotDuration === t.shotDuration && zr(e.requiredDurationValues, t.requiredDurationValues) && e.continuityAnchor === t.continuityAnchor && e.sharedEndShotId === t.sharedEndShotId && !!e.optional == !!t.optional;
}
function Li(e, t, n, r) {
  const s = e.storyboardItem;
  return !!(s && s.sourceNodeId === t && s.itemType === n && s.itemId === r);
}
function II(e, t, n, r) {
  const s = r.map((a) => ({
    spec: a,
    group: t.find(
      (d) => d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId === n && d.group.syncKey === a.key
    )
  })).filter(
    (a) => !!a.group
  ), o = `script-edge-${Zt(n)}-`, i = e.filter((a) => !a.id.startsWith(o));
  for (const { spec: a, group: d } of s) {
    const u = a.direction === "upstream", y = (a.sourceGroupKeys || []).map((I) => od(t, n, I)).filter((I) => !!I), h = u ? [d] : y.length ? y : [t.find((I) => I.id === n)].filter(
      (I) => !!I
    );
    for (const I of h) {
      const w = I.id, C = u ? n : d.id;
      i.push({
        id: ad(i, `${o}${a.key}-${Zt(w)}`),
        from: w,
        to: C,
        logicalFrom: w,
        logicalTo: C,
        purpose: "structure",
        executionMode: u ? void 0 : "manual"
      });
    }
  }
  const c = sn(t, i);
  return sd(e, c) ? e : c;
}
function vI(e, t, n) {
  const r = `script-item-edge-${Zt(n)}-`, s = e.filter((a) => !a.id.startsWith(r)), o = t.filter(
    (a) => a.storyboardItem?.sourceNodeId === n && (!!a.groupId || a.storyboardItem.itemType === "video_compose")
  ), i = new Map(o.map((a) => [a.id, a]));
  for (const a of o)
    for (const d of a.storyboardItem?.dependencyNodeIds || []) {
      const u = i.get(d);
      !u || u.id === a.id || s.push({
        id: ad(
          s,
          `${r}${Zt(u.id)}-${Zt(a.id)}`
        ),
        from: u.id,
        to: a.id,
        logicalFrom: u.id,
        logicalTo: a.id,
        purpose: "dependency",
        executionMode: u.groupId && u.groupId === a.groupId ? void 0 : "manual"
      });
    }
  const c = sn(t, s);
  return sd(e, c) ? e : c;
}
function np(e) {
  const t = e.nodes.find(
    (i) => Li(
      i,
      e.storyboardNode.id,
      "video_compose",
      "composition"
    )
  ), n = qf({
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
    const i = e.preservePosition ? { x: t.x, y: t.y } : Su(e.nodes, e.storyboardNode), c = !t.power && !!e.power, a = JSON.stringify(t.composerDraft?.videoComposition || null) !== JSON.stringify(n), d = t.x !== i.x || t.y !== i.y;
    if (!c && !a && !d && t.kind === "video" && t.outputType === "video_compose" && tp(t.storyboardItem, r))
      return {
        node: t,
        changed: !1,
        nextNodeNo: e.nextNodeNo
      };
    const u = {
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
    return e.nodes[e.nodes.indexOf(t)] = u, {
      node: u,
      changed: !0,
      nextNodeNo: e.nextNodeNo
    };
  }
  if (e.createMissing === !1)
    return null;
  const s = Su(
    e.nodes,
    e.storyboardNode
  ), o = Zi(
    "power",
    e.assetCate,
    e.nodes.length,
    s,
    e.power ? { power: e.power } : void 0
  );
  return o.id = id(
    e.nodes,
    `script-compose-${Zt(e.storyboardNode.id)}`
  ), o.nodeNo = e.nextNodeNo, o.title = "视频合成", o.kind = "video", o.outputType = "video_compose", o.description = "按镜头顺序合成画面、原声和配音。", e.power || (o.subtitle = "未配置视频合成能力", o.description = "未配置视频合成能力。配置并启用后可生成最终视频。"), o.composerDraft = { videoComposition: n }, o.storyboardItem = r, e.nodes.push(o), {
    node: o,
    changed: !0,
    nextNodeNo: e.nextNodeNo + 1
  };
}
function Su(e, t) {
  const n = e.filter(
    (o) => o.type === "group" && o.group?.origin === "script" && o.group.sourceNodeId === t.id
  ), r = n.reduce(
    (o, i) => Math.max(o, i.x + i.width),
    t.x + t.width + 160
  ), s = n.reduce(
    (o, i) => Math.min(o, i.y),
    t.y
  );
  return { x: r + 72, y: s };
}
function NI(e, t, n, r, s) {
  const i = ["shots", "speech", "subtitles", "lip_sync"].filter(
    (u) => s.some((y) => y.key === u)
  ).map((u) => od(t, n, u)).filter((u) => !!u), c = `script-compose-edge-${Zt(n)}-`, a = e.filter((u) => !u.id.startsWith(c));
  for (const u of i.length ? i : t.filter((y) => y.id === n))
    a.push({
      id: ad(a, `${c}${Zt(u.id)}`),
      from: u.id,
      to: r,
      logicalFrom: u.id,
      logicalTo: r,
      purpose: "dependency",
      executionMode: "manual"
    });
  const d = sn(t, a);
  return sd(e, d) ? e : d;
}
function SI(e, t) {
  const n = `script-compose-edge-${Zt(t)}-`, r = e.filter((s) => !s.id.startsWith(n));
  return r.length === e.length ? e : r;
}
function sd(e, t) {
  if (e.length !== t.length)
    return !1;
  const n = new Map(t.map((r) => [r.id, r]));
  return e.every((r) => {
    const s = n.get(r.id);
    return !!(s && r.from === s.from && r.to === s.to && (r.logicalFrom || "") === (s.logicalFrom || "") && (r.logicalTo || "") === (s.logicalTo || "") && (r.purpose || "") === (s.purpose || "") && (r.executionMode || "auto") === (s.executionMode || "auto") && (r.mediaUsage || "") === (s.mediaUsage || ""));
  });
}
function Do(e, t, n) {
  return `${e}\0${t}\0${n}`;
}
function id(e, t) {
  return rp(new Set(e.map((n) => n.id)), t);
}
function ad(e, t) {
  return rp(new Set(e.map((n) => n.id)), t);
}
function rp(e, t) {
  if (!e.has(t))
    return t;
  let n = 2;
  for (; e.has(`${t}-${n}`); )
    n += 1;
  return `${t}-${n}`;
}
function Zt(e) {
  let t = 2166136261;
  for (const n of e)
    t ^= n.codePointAt(0) || 0, t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function Cu(e) {
  return String(e || "general").trim().toLowerCase() || "general";
}
function CI(e) {
  return e.outputType === "speech" ? "语音合成" : e.outputType === "lip_sync" ? "口型同步" : e.powerKind === "image" ? "图片" : "视频";
}
function zr(e, t) {
  return JSON.stringify(e || []) === JSON.stringify(t || []);
}
function kI(e, t) {
  const n = /* @__PURE__ */ new Set(), r = e.find((o) => o.id === t);
  if (!r)
    return [];
  r.type === "power" && pr(
    r.power,
    r.kind,
    r.outputType
  ) && n.add(r.id), r.storyboardItem?.sourceNodeId && n.add(r.storyboardItem.sourceNodeId);
  const s = Number(
    r.resultRef?.asset_id || r.asset?.id || 0
  );
  for (const o of e) {
    const i = o.storyboardItem;
    i && (i.referenceNodeIds?.includes(t) || i.dependencyNodeIds?.includes(t) || s > 0 && i.externalReferenceAssetIds?.includes(s)) && n.add(i.sourceNodeId);
  }
  return [...n];
}
const RI = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" }
};
function op(e) {
  if (!e)
    return;
  if (e.type === "group") {
    const n = String(e.group?.syncKey || "");
    return RI[n] || { section: "shots" };
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
function xI(e, t) {
  const n = na(e);
  return {
    frames: ip(e, t, n),
    sourceNodeIds: n,
    sourceNodeIdByNodeId: sp(e, n)
  };
}
function ku(e) {
  return na(e);
}
function AI(e, t) {
  return sp(e).get(t.id) || "";
}
function sp(e, t = na(e)) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e)
    s.type === "group" && s.group?.origin === "script" && n.set(s.id, s.group.sourceNodeId || "");
  const r = /* @__PURE__ */ new Map();
  for (const s of e) {
    let o = "";
    s.storyboardItem?.sourceNodeId ? o = s.storyboardItem.sourceNodeId : s.type === "group" && s.group?.origin === "script" ? o = s.group.sourceNodeId || "" : t.has(s.id) ? o = s.id : s.groupId && (o = n.get(s.groupId) || ""), o && r.set(s.id, o);
  }
  return r;
}
function ip(e, t, n = na(e)) {
  const r = new Map(e.map((d) => [d.id, d])), s = /* @__PURE__ */ new Map();
  for (const d of e)
    d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId && s.set(d.id, d.group.sourceNodeId);
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const d of e) {
    const u = /* @__PURE__ */ new Set();
    if (n.has(d.id) && u.add(d.id), d.group?.sourceNodeId && u.add(d.group.sourceNodeId), d.storyboardItem?.sourceNodeId && u.add(d.storyboardItem.sourceNodeId), d.groupId) {
      const y = s.get(d.groupId);
      y && u.add(y);
    }
    for (const y of u)
      xa(o, y, d);
    d.type === "group" && d.group?.origin === "script" && d.group.sourceNodeId && xa(
      i,
      d.group.sourceNodeId,
      d
    ), d.storyboardItem?.sourceNodeId && !d.storyboardItem.optional && xa(
      c,
      d.storyboardItem.sourceNodeId,
      d
    );
  }
  const a = [];
  for (const d of n) {
    const u = r.get(d);
    if (!u)
      continue;
    const y = o.get(d) || [];
    if (y.length <= 1)
      continue;
    const h = i.get(d) || [], I = c.get(d) || [];
    a.push({
      id: ta(d),
      sourceNodeId: d,
      title: u.title || "分镜脚本",
      memberNodeIds: y.map((w) => w.id),
      workNodeIds: I.map((w) => w.id),
      groupCount: h.length,
      workNodeCount: I.length,
      completedCount: I.filter(t).length
    });
  }
  return a;
}
function xa(e, t, n) {
  const r = e.get(t);
  r ? r.push(n) : e.set(t, [n]);
}
function ap(e, t, n, r = new Map(t.map((s) => [s.id, s]))) {
  const o = e.workNodeIds.map((c) => r.get(c)).filter((c) => !!c).filter((c) => !n(c));
  if (o.length === 0)
    return { pendingNodeIds: [], blockedReason: "制作区已完成" };
  const i = o.find(
    (c) => !Yc(c)
  );
  return i ? {
    pendingNodeIds: o.map((c) => c.id),
    blockedReason: `“${i.title || "未命名节点"}”未配置可用能力`
  } : {
    pendingNodeIds: o.map((c) => c.id),
    blockedReason: kf({
      targets: o,
      nodesByID: r,
      hasResult: n
    })
  };
}
function ta(e) {
  return `storyboard-frame:${e}`;
}
function na(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    n.storyboardMaterializedSignature && t.add(n.id), n.group?.origin === "script" && n.group.sourceNodeId && t.add(n.group.sourceNodeId), n.storyboardItem?.sourceNodeId && t.add(n.storyboardItem.sourceNodeId);
  return t;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const oc = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!oc || Object.keys(oc).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const TI = oc.joinSiteApi, sc = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!sc || Object.keys(sc).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const MI = sc.useAuthStore, DI = Lg();
function EI(e, t) {
  const n = Ty(), r = MI(
    (C) => C.auth?.accessToken || ""
  ), s = JSON.stringify([
    TI("workspace/canvas_execution"),
    n,
    r
  ]), o = String(t.runError || "").trim(), i = t.id, c = Number(t.resultRef?.execution_id || 0), a = String(t.resultRef?.request_id || "").trim(), d = Number(t.resultRef?.run_id || 0), u = cp(
    e,
    i,
    c,
    a,
    d
  ), [y, h] = q(o), [I, w] = q(!1);
  return ue(() => {
    if (h(o), !o || !u || !Hy(o)) {
      w(!1);
      return;
    }
    let C = !0;
    return w(!0), PI({
      projectId: e,
      nodeId: i,
      executionId: c,
      requestId: a,
      runId: d,
      requestScopeKey: s,
      fallback: o
    }).then((S) => {
      C && S && h(S);
    }).catch(() => {
    }).finally(() => {
      C && w(!1);
    }), () => {
      C = !1;
    };
  }, [
    c,
    o,
    i,
    e,
    u,
    s,
    a,
    d
  ]), { error: y || o, loading: I };
}
function PI({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: s,
  requestScopeKey: o,
  fallback: i
}) {
  const c = JSON.stringify([
    o,
    cp(e, "", n, r, s)
  ]);
  return DI(
    c,
    () => v_({
      projectId: e,
      executionId: n,
      requestId: r,
      runId: s
    }).then(lr)
  ).then((d) => {
    const u = [...d.node_results || []].reverse().find((h) => h.node_key === t), y = Vc(u) || Jl(d);
    return Uc(y, i);
  });
}
function cp(e, t, n, r, s) {
  const o = n ? `execution:${n}` : r ? `request:${r}` : s ? `run:${s}` : "";
  return e > 0 && o ? `${e}:${o}:${t}` : "";
}
function OI(e) {
  const t = FI(e.trim()), n = Fc(t), r = dp(n), s = t.match(/\bstatus=(\d{3})\b/), i = (r || (s && t.includes("body=") ? `请求失败（HTTP ${s[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: i.length > 96 ? `${i.slice(0, 95)}…` : i,
    details: t
  };
}
function dp(e) {
  return Xe(e) ? dp(e.error) || Pn(e.message) || Pn(e.msg) || Pn(e.detail) || Pn(e.details) || Pn(e.error) : "";
}
function FI(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const pi = /* @__PURE__ */ new Set();
let ic = Date.now(), us;
function BI(e) {
  return pi.add(e), us == null && typeof window < "u" && (ic = Date.now(), us = window.setInterval(() => {
    ic = Date.now(), pi.forEach((t) => t());
  }, 1e3)), () => {
    pi.delete(e), pi.size === 0 && us != null && (window.clearInterval(us), us = void 0);
  };
}
function zI() {
  return () => {
  };
}
function Ru() {
  return ic;
}
function $I(e) {
  return jg(
    e ? BI : zI,
    Ru,
    Ru
  );
}
function up(e, t) {
  if (!Object.prototype.hasOwnProperty.call(e, t))
    return e;
  const n = { ...e };
  return delete n[t], n;
}
function It(e) {
  return e?.status === "running" || e?.status === "waiting";
}
function cd(e) {
  return It(e) ? {} : {
    statusText: void 0,
    reconnecting: void 0,
    generatedCount: void 0,
    targetCount: void 0
  };
}
function jI({
  runTiming: e,
  runningNode: t,
  showEstimate: n = !0,
  active: r,
  observed: s = !1
}) {
  const o = r ?? It(t), i = r !== void 0 ? e : o ? { startedAt: t?.startedAt || 0, finishedAt: void 0 } : LI(t) || e, c = $I(!!(o && i?.startedAt));
  if (!i?.startedAt || !o && (!i.finishedAt || i.finishedAt < i.startedAt))
    return null;
  const a = Math.max(
    0,
    (o ? c : i.finishedAt || i.startedAt) - i.startedAt
  ), d = Uy(
    a,
    o,
    t?.estimatedDurationMs
  ), u = `${s ? "本次查看" : ""}${d.elapsed}`, y = s ? u : n ? d.tooltip : u;
  return /* @__PURE__ */ f(pt, { label: y, side: "top", sideOffset: 6, children: /* @__PURE__ */ L(
    "span",
    {
      className: `ws-node-run-timing${o ? " is-active" : ""}`,
      "aria-label": y,
      children: [
        /* @__PURE__ */ f(tg, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: u })
      ]
    }
  ) });
}
function LI(e) {
  if (!(!e?.startedAt || !e.finishedAt))
    return {
      startedAt: e.startedAt,
      finishedAt: e.finishedAt
    };
}
function VI(e, t) {
  const n = String(
    t.semantic_event || t.event || ""
  ).toLowerCase(), r = Xe(t.meta) ? t.meta : {}, s = n === "status", o = s && !!String(r.output_type || ""), i = o && !!(t.json && typeof t.json == "object" || r.storyboard_preview && typeof r.storyboard_preview == "object");
  let c = e.streamOutput;
  (n === "audio_ready" || i || py(t)) && (c = t, s && "text" in t && (c = { ...t }, delete c.text));
  const a = typeof t.text == "string" && (n === "delta" || !n) ? t.text : "", d = Number(r.generated_count), u = Number(r.target_count);
  return {
    ...e,
    streamText: a ? `${e.streamText || ""}${a}` : e.streamText,
    streamOutput: c,
    streamStarted: e.streamStarted || !!a || !!c || o,
    ...s ? {
      statusText: typeof t.text == "string" && t.text.trim() ? t.text.trim() : e.statusText,
      generatedCount: Number.isInteger(d) && d >= 0 ? Math.max(e.generatedCount || 0, d) : e.generatedCount,
      targetCount: Number.isInteger(u) && u > 0 ? u : e.targetCount
    } : {}
  };
}
function ze({
  label: e,
  overlay: t = !1,
  compact: n = !1,
  delay: r = 160
}) {
  const [s, o] = q(r <= 0);
  return ue(() => {
    if (r <= 0) {
      o(!0);
      return;
    }
    const i = window.setTimeout(() => o(!0), r);
    return () => window.clearTimeout(i);
  }, [r]), s ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${n ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ f(ur, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: e })
      ]
    }
  ) : null;
}
function UI({
  space: e,
  canvases: t,
  cache: n,
  onError: r
}) {
  const [s, o] = q([]), [i, c] = q([]), [a, d] = q([]), [u, y] = q(!1), h = `${e?.project.id || 0}:${e?.release.id || e?.project.release_id || 0}`, I = W(h), w = de(
    () => u || KI(t),
    [t, u]
  );
  ue(() => {
    I.current = h, o([]), c([]), d([]), y(!1);
  }, [h]);
  const C = E(
    async (S = !1) => {
      if (!e)
        return !1;
      const x = h;
      try {
        const T = await n.loadCatalog(
          e.project.id,
          Number(e.release?.id || e.project.release_id || 0),
          () => __(e.project.id),
          S
        );
        return I.current !== x ? !1 : (o(T.roles), c(T.powers), d(T.powerCategories), y(!0), !0);
      } catch (T) {
        return I.current === x && r(T instanceof Error ? T.message : "加载能力列表失败"), !1;
      }
    },
    [n, r, h, e]
  );
  return ue(() => {
    !e || !w || u || C();
  }, [C, u, w, e]), {
    roles: s,
    powers: i,
    powerCategories: a,
    loaded: u,
    required: w,
    load: C
  };
}
function KI(e) {
  return Object.values(e).some(
    (t) => t.nodes.some((n) => n.type !== "power" ? !1 : n.storyboardItem && !n.power ? !0 : pr(n.power, n.kind, n.outputType) ? !!bn([
      n.asset?.version?.content,
      n.resultOutput
    ]) : !1)
  );
}
function qI(e, t, n) {
  const r = e.get(t);
  e.set(
    t,
    r ? (s) => n(r(s)) : n
  );
}
function GI(e, t) {
  let n = e;
  for (const [r, s] of t) {
    const o = e[r], i = s(o);
    i !== o && (n === e && (n = { ...e }), i ? n[r] = i : delete n[r]);
  }
  return n;
}
function WI({
  node: e,
  memberCount: t,
  runnableCount: n,
  completedCount: r,
  failedCount: s,
  status: o,
  frameRunning: i = !1,
  selected: c,
  managed: a = !1,
  onRename: d,
  onEditStructure: u,
  onRun: y,
  runBlockedReason: h = "",
  children: I
}) {
  const [w, C] = q(!1), [S, x] = q(e.title), T = W(null), U = o === "running" || o === "waiting", ee = U ? "分组正在执行" : i ? "制作区正在执行" : h || (n === 0 ? "分组内暂无可运行节点" : "运行分组"), Z = !y || n === 0 || U || i || !!h;
  ue(() => {
    w || x(e.title);
  }, [w, e.title]), ue(() => {
    w && (T.current?.focus(), T.current?.select());
  }, [w]);
  const oe = () => {
    const X = S.trim() || "未命名分组";
    C(!1), x(X), X !== e.title && d?.(X);
  };
  return /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-group-wrap ${c ? "is-selected" : ""} ${U ? "is-running" : ""} ${o === "error" ? "is-error" : ""} ${a ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ L("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ f("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(ng, { size: 15 }) }),
          w ? /* @__PURE__ */ f(
            "input",
            {
              ref: T,
              className: "ws-node-group-title-input nodrag nowheel",
              value: S,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (X) => x(X.target.value),
              onBlur: oe,
              onKeyDown: (X) => {
                X.key === "Enter" ? (X.preventDefault(), oe()) : X.key === "Escape" && (X.preventDefault(), x(e.title), C(!1));
              }
            }
          ) : /* @__PURE__ */ f(
            pt,
            {
              label: a ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ f(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (X) => {
                    X.preventDefault(), X.stopPropagation(), !(a || !d) && C(!0);
                  },
                  children: e.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ f("span", { className: "ws-node-group-count", children: U ? `${r}/${n}` : `${t} 个节点` }),
          o === "waiting" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待反馈" }) : o === "error" ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: s > 0 ? `失败 ${s}` : "运行失败" }) : h ? /* @__PURE__ */ f(pt, { label: h, children: /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待前置" }) }) : i ? /* @__PURE__ */ f("span", { className: "ws-node-group-status", children: "等待调度" }) : n > 0 && r === n ? /* @__PURE__ */ L("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ f(kc, { size: 12 }),
            "已完成"
          ] }) : null,
          u ? /* @__PURE__ */ f(pt, { label: "编辑分镜结构", children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (X) => {
                X.preventDefault(), X.stopPropagation(), u();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ f(nl, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ f(pt, { label: ee, children: /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: Z,
              onClick: (X) => {
                X.preventDefault(), X.stopPropagation(), y?.();
              },
              "aria-label": "运行分组",
              children: U ? /* @__PURE__ */ f(ur, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(Cc, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        I
      ]
    }
  );
}
function lp({
  output: e,
  fallback: t,
  preview: n,
  mediaLabel: r,
  className: s = "",
  style: o,
  onOpen: i,
  onOpenIntent: c,
  openOnContentClick: a = !1,
  resizeControls: d,
  children: u,
  customContentIsPureMedia: y = !1,
  followContent: h = !1,
  followKey: I
}) {
  const w = W(null), C = W(!0), S = Ao(e, n), x = u != null, T = y || !x && !S && fp(n), U = !!i && (!x || y), ee = [
    "ws-result-view",
    T ? "" : "nodrag",
    "nopan",
    "nowheel",
    T ? "has-pure-media" : "",
    s
  ].filter(Boolean).join(" ");
  return ue(() => {
    if (!h) {
      C.current = !0;
      return;
    }
    const O = w.current;
    O && C.current && (O.scrollTop = O.scrollHeight);
  }, [h, I]), /* @__PURE__ */ L(
    "div",
    {
      role: U ? "button" : void 0,
      tabIndex: U ? 0 : void 0,
      className: ee,
      style: o,
      onPointerDown: (O) => {
        (!T || ZI(O)) && O.stopPropagation();
      },
      onClick: (O) => {
        O.stopPropagation(), !(!i || Ii(O.target, O.currentTarget) || XI(O)) && (O.preventDefault(), i());
      },
      onPointerEnter: i ? c : void 0,
      onFocus: i ? c : void 0,
      onKeyDown: (O) => {
        O.stopPropagation(), !(!i || Ii(O.target, O.currentTarget) || O.key !== "Enter" && O.key !== " ") && (O.preventDefault(), i());
      },
      children: [
        /* @__PURE__ */ f(
          "div",
          {
            ref: w,
            className: "ws-result-view-scroll ws-node-scroll-content nowheel",
            onClickCapture: (O) => {
              !a || !i || Ii(O.target, O.currentTarget) || pp(O, O.currentTarget) || (O.preventDefault(), O.stopPropagation(), i());
            },
            onScroll: (O) => {
              if (!h)
                return;
              const we = O.currentTarget;
              C.current = we.scrollHeight - we.scrollTop - we.clientHeight < 16;
            },
            children: x ? u : S ? /* @__PURE__ */ f(
              To,
              {
                output: e,
                fallback: t,
                mediaGridKind: Ps(n),
                className: "ws-canvas-content-view ws-result-content-view"
              }
            ) : /* @__PURE__ */ f(HI, { preview: n, label: r ?? t })
          }
        ),
        d
      ]
    }
  );
}
function HI({
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
      Ri,
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
        /* @__PURE__ */ f(Rc, { size: 16 }),
        /* @__PURE__ */ f("span", { children: t || "查看文件" })
      ]
    }
  ) : /* @__PURE__ */ f(
    To,
    {
      output: YI(t),
      fallback: t,
      className: "ws-canvas-content-view ws-result-content-view"
    }
  );
}
function YI(e) {
  return e ? { text: e } : void 0;
}
function fp(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Ii(e, t) {
  if (!(e instanceof Element))
    return !1;
  const n = e.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control"
  );
  return !!(n && n !== t && t.contains(n));
}
function XI(e) {
  const t = e.currentTarget.querySelector(
    ":scope > .ws-result-view-scroll"
  );
  return t ? pp(e, t) : !1;
}
function pp(e, t) {
  if (t.scrollHeight <= t.clientHeight)
    return !1;
  const n = t.getBoundingClientRect();
  return e.clientX >= n.right - 10;
}
function ZI(e) {
  const t = e.target;
  if (!(t instanceof Element))
    return !1;
  const n = t.closest("video[controls]");
  return n instanceof HTMLVideoElement ? my(n, e.clientY) : Ii(t, e.currentTarget);
}
const mp = Lt(() => import("./space-agent-tools-CtyGaIuK.js")), dd = Lt(() => import("./space-asset-tools-DwCsO_Xz.js")), JI = vt(
  mp,
  (e) => e.AgentInteractionPanel
), QI = JI.Component, gp = vt(
  Lt(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-9lVN0Xnh.js")),
  (e) => e.AddNodeMenu
), ev = gp.Component, tv = gp.preload, yp = vt(
  dd,
  (e) => e.AssetBrowser
), nv = yp.Component, rv = yp.preload, hp = vt(
  dd,
  (e) => e.AssetDetailDialog
), ov = hp.Component, sv = hp.preload, _p = vt(
  dd,
  (e) => e.AssetPickerDialog
), xu = _p.Component, Au = _p.preload, wp = vt(
  Lt(() => import("./space-run-history-C8uyVvqm.js")),
  (e) => e.CanvasRunHistoryDrawer
), iv = wp.Component, av = wp.preload, cv = vt(
  Lt(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-B9wm-ofk.js")),
  (e) => e.SpaceCanvasManagerDialog
), dv = cv.Component, uv = vt(
  Lt(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-BI-nfvRK.js")),
  (e) => e.CanvasParamBindingDialog
), lv = uv.Component, bp = vt(
  Lt(() => import("./space-assistant-D7w5vzWo.js")),
  (e) => e.SpaceAssistant
), fv = bp.Component, pv = bp.preload, mv = vt(
  mp,
  (e) => e.CanvasAgentResultContent
), gv = mv.Component, Ip = vt(
  Lt(() => import("./node-detail-dialog-CO39yBfk.js").then((e) => e.n)),
  (e) => e.NodeDetailDialog
), yv = Ip.Component, Ms = Ip.preload, vp = vt(
  Lt(() => import("./space-node-settings-BMzYanmo.js")),
  (e) => e.CanvasNodeSettings
), hv = vp.Component, _v = vp.preload, wv = vt(
  Lt(() => import("./space-storyboard-node-BPES2zuz.js")),
  (e) => e.StoryboardNodeContent
), bv = wv.Component, Iv = vt(
  Lt(() => import("./space-storyboard-confirm-dialog-0RNJcSS4.js").then((e) => e.a)),
  (e) => e.StoryboardConfirmDialog
), vv = Iv.Component, Nv = vt(
  Lt(() => import("./space-video-compose-view-BaTxAEdm.js")),
  (e) => e.VideoComposeView
), Sv = Nv.Component, Cv = vt(
  Lt(() => import("./writing-preview-DjKHdQSk.js")),
  (e) => e.WritingPreview
), kv = Cv.Component;
function Rv({
  assistantName: e,
  onIntent: t,
  onOpen: n
}) {
  const r = `打开${e || "画布助手"}`;
  return /* @__PURE__ */ f("div", { className: "ws-assistant-launcher", "data-assistant-layer": "true", children: /* @__PURE__ */ f(pt, { label: r, side: "left", children: /* @__PURE__ */ f(
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
      children: /* @__PURE__ */ f(rg, { size: 20, "aria-hidden": "true" })
    }
  ) }) });
}
const vi = 520, xv = 440, Av = 720, Np = "bot.canvasAssistant.width", Sp = "bot.canvasAssistant.open";
function Cp(e) {
  return Number.isFinite(e) ? Math.min(
    Av,
    Math.max(xv, Math.round(e))
  ) : vi;
}
function Tv(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function Mv(e) {
  return e === "1";
}
await window.DeverFront?.ensureCompat?.(["@/lib/agent-result-protocol"]);
const ac = window.DeverFront?.sdk?.getCompatModule("@/lib/agent-result-protocol");
if (!ac || Object.keys(ac).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent-result-protocol");
const Tu = zs(), Mu = zs(), mi = zs(), Du = zs(), Eu = zs();
function Je(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const { normalizeAgentResultOutputValue: Dv } = ac;
function Ev(...e) {
  for (const t of e) {
    const n = Wr(t);
    if (n)
      return n;
  }
  return null;
}
function Vi(...e) {
  for (const t of e) {
    const n = kp(t);
    if (Ze(n))
      return n;
  }
  return "";
}
function kp(e) {
  const t = Os(Tu, e);
  return t !== Fs ? t : Vr(
    Tu,
    e,
    Pv(e)
  );
}
function Pv(e) {
  const t = Ke(e), n = Us(t);
  if (n !== t)
    return kp(n);
  const r = Dv?.(t) ?? t, s = jr(r, /* @__PURE__ */ new Set());
  if (Ze(s))
    return s;
  if (r !== t) {
    const c = jr(t, /* @__PURE__ */ new Set());
    if (Ze(c))
      return c;
  }
  const o = ra(t);
  if (o)
    return Va?.(o) ?? o;
  const i = ud(e);
  return i !== t && Ze(i) ? i : "";
}
function jr(e, t) {
  const n = Ke(e), r = Us(n);
  if (r !== n)
    return jr(r, t);
  if (typeof n == "string") {
    const a = xp(n);
    if (Ze(a))
      return a;
    const d = Bs(n);
    return d ? { text: d } : hr(n) ? "" : n;
  }
  if (Array.isArray(n)) {
    const a = n.map((d) => jr(d, t)).filter(Ze);
    return a.length > 0 ? a : "";
  }
  if (!Je(n))
    return n;
  if (to(n)) {
    const a = Ep(n);
    if (a !== void 0)
      return jr(a, t);
    const d = Pp(n);
    if (d)
      return { text: d };
    const u = Wr(n) || $t(n);
    return u ? { rich: u } : n;
  }
  if (t.has(n))
    return "";
  if (t.add(n), md(n))
    return cc(n);
  if (Ap(n))
    return n;
  for (const a of ["output", "result", "data", "content", "json", "value"]) {
    if (!(a in n))
      continue;
    const d = jr(n[a], t);
    if (Ze(d))
      return d;
  }
  const s = ld(n);
  if (s) {
    const a = { rich: s };
    return Va?.(a) ?? a;
  }
  const o = $t(n);
  if (o)
    return { rich: o };
  const i = ra(n);
  if (i)
    return Va?.(i) ?? i;
  const c = jt(n);
  if (c !== n)
    return jr(c, t);
  if (Ov(n))
    return cc(n);
  if (ia(n)) {
    const a = $e(n.message, n.error, n.status);
    return a ? { text: a } : "";
  }
  return oa(n) ? n : "";
}
function Ov(e) {
  return !!(Je(e) && (e.format || e.result_mode || e.rich || e.images || e.videos || e.audios || e.files));
}
function cc(e) {
  const t = {}, n = Ke(e.content);
  Je(n) && Ou(t, n), Ou(t, e);
  const r = Fv(e);
  return r && (t.text = r), !Ze(t) && n && typeof n == "object" ? n : oa(t) ? t : "";
}
function Fv(e) {
  const t = $e(e.text);
  if (t)
    return t;
  const n = Ke(e.content);
  return typeof n == "string" ? n.trim() : Je(n) ? $e(n.text) : "";
}
function ud(e) {
  const t = Us(e);
  if (t !== e)
    return ud(t);
  const n = ra(e);
  if (n)
    return n;
  const r = xp(e);
  if (Ze(r))
    return r;
  const s = Ke(e), o = $t(s);
  if (o)
    return { rich: o };
  const i = jt(s);
  if (i !== s) {
    const c = $t(i);
    return c ? { rich: c } : i;
  }
  return s;
}
function ra(e) {
  const t = Wr(e);
  return t ? { rich: t } : null;
}
function Wr(e, t = /* @__PURE__ */ new Set()) {
  const n = Ke(e), r = Us(n);
  if (r !== n)
    return Wr(r, t);
  if (Array.isArray(n)) {
    if (t.has(n))
      return null;
    t.add(n);
    for (const i of n) {
      const c = Wr(i, t);
      if (c)
        return c;
    }
    return null;
  }
  if (!Je(n) || t.has(n))
    return null;
  if (t.add(n), to(n))
    return Rp(n, t) || n;
  const s = n, o = [
    rt(s, ["output", "content", "rich"]),
    rt(s, ["output", "rich"]),
    rt(s, ["content", "rich"]),
    s.content,
    s.rich,
    s.text,
    s.summary
  ];
  for (const i of o) {
    if (i === n)
      continue;
    const c = Wr(i, t);
    if (c)
      return c;
  }
  return null;
}
function Rp(e, t) {
  const n = Ui(e);
  for (const r of n) {
    const s = Pu(r, t);
    if (s)
      return s;
  }
  return Pu(n.join(""), t);
}
function Pu(e, t) {
  const n = String(e || "").trim();
  if (!hr(n))
    return null;
  const r = Fc(n);
  return r === n || r === e ? null : Wr(r, t);
}
function Bv(e) {
  return Ui(e).join("");
}
function Ui(e, t = /* @__PURE__ */ new Set()) {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e.flatMap((r) => Ui(r, t));
  if (!Je(e))
    return [];
  if (t.has(e))
    return [];
  t.add(e);
  const n = [];
  return typeof e.text == "string" && n.push(e.text), Array.isArray(e.content) && n.push(...Ui(e.content, t)), n;
}
function xp(e) {
  const t = tn(e);
  if (t)
    return { rich: t };
  const n = Ke(e);
  if (!n)
    return "";
  if (typeof n == "string") {
    const r = Bs(n);
    return r ? { text: r } : "";
  }
  return "";
}
function tn(e, t = /* @__PURE__ */ new Set()) {
  const n = Ke(e);
  if (to(n))
    return Rp(n, t) || n;
  if (Array.isArray(n))
    return $t(pd(n));
  if (!Je(n) || t.has(n))
    return null;
  t.add(n);
  const r = n, s = ld(r);
  if (s)
    return s;
  const o = [
    rt(r, ["output", "content", "rich"]),
    rt(r, ["output", "content"]),
    rt(r, ["output", "rich"]),
    rt(r, ["content", "output", "content", "rich"]),
    rt(r, ["content", "output", "content"]),
    rt(r, ["content", "rich"]),
    rt(r, ["data", "output", "content", "rich"]),
    rt(r, ["data", "output", "content"]),
    rt(r, ["data", "content", "rich"]),
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
  for (const i of o) {
    if (i == null || i === n)
      continue;
    const c = tn(i, t);
    if (c)
      return c;
  }
  for (const [i, c] of Object.entries(r)) {
    if (!Op(i) || !c || typeof c != "object")
      continue;
    const a = tn(c, t);
    if (a)
      return a;
  }
  return null;
}
function ld(e) {
  if (to(e))
    return e;
  const t = Je(e.content) ? e.content : null, n = String(e.format || "").toLowerCase(), r = String(t?.format || "").toLowerCase();
  return Array.isArray(e.content) && (n === "rich_json" || e.type === void 0) ? $t({
    type: "doc",
    content: e.content
  }) : (n === "rich_json" || r === "rich_json") && e.rich != null ? tn(e.rich) : (n === "rich_json" || r === "rich_json") && t?.rich != null ? tn(t.rich) : null;
}
function to(e) {
  return !!(Je(e) && e.type === "doc" && Array.isArray(e.content));
}
function Ou(e, t) {
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
    Ze(t[n]) && (e[n] = n === "rich" ? zv(t[n]) : t[n]);
}
function zv(e) {
  return tn(e) || $t(pd(e)) || $t(e) || e;
}
function oa(e) {
  return Object.entries(e).some(([t, n]) => t.startsWith("_") || t === "format" ? !1 : Ze(n));
}
function Ap(e) {
  return !Je(e) || "output" in e || "result" in e || "data" in e || "content" in e || "kind" in e || "event" in e ? !1 : [
    "text",
    "rich",
    "images",
    "videos",
    "audios",
    "files",
    "json",
    "error"
  ].some((t) => Ze(e[t]));
}
function Ze(e) {
  if (e == null || e === "")
    return !1;
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 && !hr(t) && !Qt(t);
  }
  return typeof e == "number" || typeof e == "boolean" ? !0 : Array.isArray(e) ? e.some(Ze) : Je(e) ? tn(e) ? !0 : ia(e) ? !1 : oa(e) : !1;
}
function fd(e) {
  return Jt(
    $n(e),
    e.description || e.title
  );
}
function $v(e) {
  const t = [
    $n(e),
    e.asset?.version?.content,
    e.description
  ];
  for (const n of t) {
    const r = tn(n) || $t(ud(n)) || $t(jt(n)) || $t(n);
    if (r)
      return r;
  }
  return null;
}
function Jt(e, t = "") {
  const n = Os(Du, e), r = n !== Fs ? n : Vr(
    Du,
    e,
    jv(e)
  );
  if (r !== null) return r;
  const s = String(t || "").trim();
  if (Qt(s))
    return "";
  const o = Bs(s);
  if (o)
    return o;
  if (!hr(s))
    return s;
  const i = Ur(
    jt(Ke(s))
  ).trim();
  return i && i !== s && !Qt(i) ? i : "";
}
function jv(e) {
  const t = jt(e), n = $t(t), r = n ? Ur(n).trim() : "";
  if (r && !Qt(r))
    return r;
  const s = Ur(t).trim();
  if (Qt(s))
    return "";
  const o = Bs(s);
  if (o)
    return o;
  if (s && !hr(s))
    return s;
  if (gd(s)) {
    const i = Ur(
      jt(Ke(s))
    ).trim();
    if (i && i !== s && !Qt(i))
      return i;
  }
  return null;
}
function Qt(e) {
  const t = e.trim();
  return t ? Lv(t) || Vv(t) : !1;
}
function Lv(e) {
  const t = e.trim();
  return t === "map[]" || t === "<nil>";
}
function Vv(e) {
  const t = e.trim();
  return t ? /^(i\s+(will|ll|'ll)\s+(start|begin)|let'?s\s+(list|check|inspect)|first,\s*i\s+(will|ll|'ll)|i'?m\s+going\s+to\s+(check|inspect))/i.test(
    t
  ) : !1;
}
function yr(e, t) {
  const n = Os(Eu, e), r = n === Fs ? /* @__PURE__ */ new Map() : n, s = r.get(t);
  if (s) return { ...s };
  const o = Uv(e, t);
  return r.set(t, o), Vr(Eu, e, r), { ...o };
}
function Uv(e, t) {
  const n = {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: ""
  }, r = jt(e);
  return Ds(n, r, t), !fr(n) && r !== e && Ds(n, e, t), bs(n) && hr(n.text) && (n.text = ""), n.videoUrl && (n.videoPosterUrl ||= yy(e, "video").find(
    (s) => s.url === n.videoUrl
  )?.thumbnail), n;
}
function Kv(e, t) {
  return {
    text: $e(e.text, t.text),
    imageUrl: e.imageUrl || t.imageUrl,
    videoUrl: e.videoUrl || t.videoUrl,
    videoPosterUrl: e.videoPosterUrl || t.videoPosterUrl,
    audioUrl: e.audioUrl || t.audioUrl,
    fileUrl: e.fileUrl || t.fileUrl
  };
}
function Ds(e, t, n, r = /* @__PURE__ */ new Set(), s = 0) {
  if (s > 12 || t == null)
    return;
  if (typeof t == "string") {
    Fu(e, t, n);
    return;
  }
  if (Array.isArray(t)) {
    for (const d of t)
      if (Ds(e, d, n, r, s + 1), bs(e))
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
  const o = t, i = qv(e, o, n), c = Jt(t, "");
  c && c !== i && !zn(c) && (e.text ||= c);
  const a = Ro(o.url, o.src, o.href);
  if (a && a !== i && Fu(e, a, n), e.imageUrl ||= Ro(
    o.image,
    o.image_url,
    o.imageUrl,
    bt(o.images),
    bt(o.imageUrls)
  ), e.videoUrl ||= Ro(
    o.video,
    o.video_url,
    o.videoUrl,
    bt(o.videos),
    bt(o.videoUrls)
  ), e.audioUrl ||= Ro(
    o.audio,
    o.audio_url,
    o.audioUrl,
    bt(o.audios),
    bt(o.audioUrls)
  ), e.fileUrl ||= Ro(
    o.file,
    o.file_url,
    o.fileUrl,
    bt(o.files),
    bt(o.fileUrls)
  ), !bs(e)) {
    for (const d of ["output", "result", "content", "body", "data", "rich"])
      if (o[d] && typeof o[d] == "object" && (Ds(e, o[d], n, r, s + 1), bs(e)))
        return;
  }
  if (!e.text && !fr(e) && !Jv(o) && oa(o))
    try {
      const d = JSON.stringify(t, null, 2);
      Bo(d) || (e.text = d);
    } catch {
      const d = String(t);
      Bo(d) || (e.text = d);
    }
}
function qv(e, t, n) {
  const r = Tp(
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
  const s = Ro(...Wv(t, r));
  return s ? (r === "image" && (e.imageUrl ||= s), r === "video" && (e.videoUrl ||= s), r === "audio" && (e.audioUrl ||= s), r === "file" && (e.fileUrl ||= s), s) : "";
}
function Gv(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return "";
  const t = e;
  return Tp(
    t.kind,
    t.media_kind,
    t.mediaKind,
    t.media_type,
    t.mediaType,
    t.type,
    t.name
  );
}
function Tp(...e) {
  for (const t of e) {
    const n = sa(String(t || ""));
    if (n)
      return n;
  }
  return "";
}
function sa(e) {
  const t = e.trim().toLowerCase();
  return t === "image" || t === "images" || t === "picture" || t === "pictures" || t === "mediaimage" || t === "editor media image" || t === "editormediaimage" || t.includes("image") || t === "图片" || t === "图像" ? "image" : t === "video" || t === "videos" || t === "mediavideo" || t === "editor media video" || t === "editormediavideo" || t.includes("video") || t === "视频" ? "video" : t === "audio" || t === "audios" || t === "music" || t === "voice" || t === "mediaaudio" || t === "editor media audio" || t === "editormediaaudio" || t.includes("audio") || t === "音频" || t === "音乐" || t === "语音" ? "audio" : t === "file" || t === "files" || t === "attachment" || t === "attachments" || t === "mediafile" || t === "editorfile" || t === "editor media file" || t === "editormediafile" || t === "文件" || t === "附件" ? "file" : "";
}
function Wv(e, t) {
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
    rt(e, ["attrs", "src"]),
    rt(e, ["attrs", "url"]),
    rt(e, ["attrs", "href"])
  ];
  return t === "image" ? [
    e.image,
    e.image_url,
    e.imageUrl,
    bt(e.images),
    bt(e.imageUrls),
    ...n
  ] : t === "video" ? [
    e.video,
    e.video_url,
    e.videoUrl,
    bt(e.videos),
    bt(e.videoUrls),
    ...n
  ] : t === "audio" ? [
    e.audio,
    e.audio_url,
    e.audioUrl,
    bt(e.audios),
    bt(e.audioUrls),
    ...n
  ] : [
    e.file,
    e.file_url,
    e.fileUrl,
    bt(e.files),
    bt(e.fileUrls),
    ...n
  ];
}
function Fu(e, t, n) {
  const r = t.trim();
  if (!r || Qt(r))
    return;
  if (gd(r)) {
    const c = Ke(r);
    if (c !== r && (Ds(e, c, n), bs(e)))
      return;
    const a = Jt(c, "");
    a && !zn(a) && (e.text ||= a);
    return;
  }
  const s = Bs(r);
  if (s) {
    e.text ||= s;
    return;
  }
  const o = Ur(r);
  if (o && o !== r) {
    e.text ||= o;
    return;
  }
  const i = Hv(r, n);
  if (i) {
    Xv(e, i.kind, i.url), e.text ||= i.caption;
    return;
  }
  if (zn(r)) {
    const c = sa(n);
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
function Hv(e, t) {
  const n = Mp(e, t), r = e.match(
    /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/
  );
  if (r) {
    const d = Aa(r[2]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: gi(e, r[0], r[1])
      };
  }
  const s = e.match(
    /!\[[^\]]*]\(\s*<?((?:https?:\/\/|data:|blob:)[^\s<>)]+)/i
  );
  if (s) {
    const d = Aa(s[1]);
    if (d)
      return {
        kind: "image",
        url: d,
        caption: gi(e, s[0], "")
      };
  }
  const o = /\[([^\]]+)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  let i;
  for (; i = o.exec(e); ) {
    const d = Aa(i[2]), u = Bu(d, n);
    if (u)
      return {
        kind: u,
        url: d,
        caption: gi(e, i[0], i[1])
      };
  }
  const c = Zv(e), a = Bu(c, n);
  return a ? {
    kind: a,
    url: c,
    caption: gi(e, c, "")
  } : null;
}
function Mp(e, t) {
  return sa(t) ? t : Yv(e) ? "image" : t;
}
function Yv(e) {
  const t = /(?:图片|图像|image|photo|picture).{0,40}(?:https?:\/\/|data:|blob:)/i;
  return /!\[[^\]]*]\(/.test(e) || t.test(e);
}
function Xv(e, t, n) {
  t === "image" && (e.imageUrl ||= n), t === "video" && (e.videoUrl ||= n), t === "audio" && (e.audioUrl ||= n), t === "file" && (e.fileUrl ||= n);
}
function Bu(e, t) {
  if (!e || !zn(e))
    return "";
  const n = sa(t);
  return n === "image" || /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(e) ? "image" : n === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(e) ? "video" : n === "audio" || /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(e) ? "audio" : n === "file" ? "file" : "";
}
function gi(e, t, n) {
  const r = e.replace(t, "").replace(/\s+/g, " ").trim();
  return r && r !== e.trim() && !zn(r) ? r : String(n || "").trim();
}
function Aa(e) {
  const t = Dp(e);
  return zn(t) ? t : "";
}
function Zv(e) {
  const t = e.match(/(?:https?:\/\/|data:|blob:)[^\s<>)]+/i);
  return t ? Dp(t[0]) : "";
}
function Dp(e) {
  return String(e || "").trim().replace(/^<|>$/g, "").replace(/[.,，。；;]+$/g, "");
}
function Jv(e) {
  return !!(e.output || e.result || e.content || e.rich || e.agent_run_id || e.approval_id);
}
function fr(e) {
  const t = String(e.text || "").trim();
  return !!(t && !Bo(t) || e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function bs(e) {
  return !!(e.imageUrl || e.videoUrl || e.audioUrl || e.fileUrl);
}
function Qv(...e) {
  for (const t of e) {
    if (typeof t == "string" && t.trim())
      return t.trim();
    if (Je(t)) {
      const n = $e(
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
        rt(t, ["attrs", "src"]),
        rt(t, ["attrs", "url"]),
        rt(t, ["attrs", "href"])
      );
      if (n)
        return n;
    }
  }
  return "";
}
function Ro(...e) {
  const t = Qv(...e);
  return zn(t) ? t : "";
}
function bt(e) {
  return Array.isArray(e) ? e[0] : void 0;
}
function zn(e) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(e);
}
function $n(e) {
  return eN(
    gy(e.asset?.version?.content, e.resultOutput)
  );
}
function eN(...e) {
  let t;
  for (const n of e) {
    if (n == null)
      continue;
    t === void 0 && (t = n);
    const r = Os(mi, n);
    if (r !== Fs) return r;
    const s = Ep(n);
    if (s !== void 0)
      return Vr(mi, n, s);
    const o = Pp(n);
    if (o)
      return Vr(mi, n, {
        text: o
      });
    const i = Vi(n) || jt(n);
    if (Ze(i) || yd(i))
      return Vr(mi, n, i);
  }
  if (t !== void 0)
    return Vi(t) || jt(t);
}
function Ep(e) {
  const t = Ke(e), n = to(t) ? t : tn(t);
  if (!n)
    return;
  const r = Bv(n).trim();
  if (!hr(r))
    return;
  const s = Fc(r);
  if (s === r)
    return;
  const o = jt(s);
  if (Ze(o) || yd(o))
    return o;
}
function Pp(e) {
  const t = Ke(e), n = to(t) ? t : tn(t);
  return Sl(n);
}
function jt(e) {
  const t = Os(Mu, e);
  return t !== Fs ? t : Vr(
    Mu,
    e,
    tN(e)
  );
}
function tN(e) {
  const t = Ke(e), n = Us(t);
  if (n !== t)
    return jt(n);
  if (Ap(t))
    return t;
  if (Je(t) && md(t)) {
    const o = cc(t);
    if (Ze(o))
      return o;
  }
  const r = ra(t);
  if (r)
    return r.rich;
  if (to(t))
    return t;
  const s = tn(t);
  return s || pd(Ki(t, /* @__PURE__ */ new Set()));
}
function Ki(e, t) {
  if (!Je(e) || t.has(e))
    return e;
  t.add(e);
  const n = e, r = Fp(n);
  if (r !== void 0)
    return r;
  const s = nN(n, t);
  if (s !== void 0)
    return s;
  for (const o of rN) {
    const i = rt(n, o);
    if (i === void 0 || i === e)
      continue;
    const c = Ki(
      Ke(i),
      t
    );
    if (dc(c))
      return c;
  }
  if (ia(n))
    for (const o of ["output", "result", "data", "body"]) {
      if (n[o] === void 0 || n[o] === e)
        continue;
      const i = Ki(
        Ke(n[o]),
        t
      );
      if (dc(i))
        return i;
    }
  return e;
}
function nN(e, t) {
  for (const [n, r] of Object.entries(e)) {
    if (!Op(n) || !r || typeof r != "object")
      continue;
    const s = Ki(Ke(r), t);
    if (dc(s))
      return s;
  }
}
function Op(e) {
  return /^(node|step|task|power|agent)[_-]?\d+$/i.test(e);
}
const rN = [
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
function Fp(e) {
  const t = ld(e);
  if (t)
    return t;
  if (String(e.result_mode || "").toLowerCase() === "inline" && e.content != null) {
    const n = Ke(e.content);
    if (Je(n)) {
      const r = Fp(n);
      if (r !== void 0)
        return r;
    }
  }
}
function pd(e) {
  const t = Ke(e);
  return Je(t) && !t.type && Array.isArray(t.content) ? {
    type: "doc",
    content: t.content
  } : Array.isArray(t) ? {
    type: "doc",
    content: t
  } : t;
}
function ia(e) {
  return !!(e.agent_run_id || e.approval_id || e.node_run_id || e.request_id || e.approved !== void 0 || e.message !== void 0);
}
function dc(e) {
  if (e == null)
    return !1;
  if (typeof e == "string") {
    const n = e.trim();
    return n.length > 0 && !hr(n) && !Qt(n);
  }
  if (Array.isArray(e))
    return e.length > 0;
  if (!Je(e) || tn(e) || $t(e))
    return !0;
  if (ia(e))
    return !1;
  const t = Ur(e).trim();
  return !!(t && !Bo(t));
}
function rt(e, t) {
  let n = e;
  for (const r of t) {
    if (!Je(n) || !(r in n))
      return;
    n = n[r];
  }
  return n;
}
function Us(e) {
  if (typeof e != "string")
    return e;
  const t = e.trim();
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = oN(t, n);
    if (r !== void 0)
      return r;
  }
  return e;
}
function oN(e, t) {
  const n = `\`\`\`${t}`, r = e.toLowerCase().indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < e.length && /\s/.test(e[s] || ""); )
    s += 1;
  let o = s;
  for (; o < e.length; ) {
    const i = e.indexOf("```", o), c = i >= 0 ? e.slice(s, i) : e.slice(s), a = sN(c, t === "json");
    if (a)
      return a;
    if (i < 0)
      return;
    o = i + 3;
  }
}
function sN(e, t = !1) {
  const n = e.trim(), r = hy(n);
  for (const s of _y([n, r])) {
    const o = Ke(s);
    if (o !== s && (t ? iN(o) : md(o)))
      return o;
  }
  return null;
}
function iN(e) {
  if (!Je(e))
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
function md(e) {
  if (!Je(e))
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
  ].some((n) => Ze(e[n]));
}
function gd(e) {
  const t = String(e || "").trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function hr(e) {
  const t = String(e || "").trim();
  return !!(t && (gd(t) || t.startsWith("{") || t.startsWith("[") || t.includes('"agent_run_id"') || t.includes('"node_run_id"') || t.includes('"approval_id"')));
}
function Bp(e) {
  if (e == null)
    return "";
  if (typeof e == "string")
    return Qt(e) ? "" : e;
  const t = Ur(e).trim();
  if (t && Qt(t))
    return "";
  try {
    const n = JSON.stringify(e);
    return Bo(n) ? "" : n;
  } catch {
    const n = String(e);
    return Qt(n) ? "" : n;
  }
}
function yd(e) {
  const t = Bp(e).trim();
  return !!(t && !Bo(t));
}
function Bo(e) {
  const t = e.trim();
  return !t || t === "{}" || t === "[]" || t === "null" || Qt(t);
}
await window.DeverFront?.ensureCompat?.(["@/context/theme-provider"]);
const uc = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!uc || Object.keys(uc).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const aN = uc.useTheme;
function Ks(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function qi(e) {
  return Ks(e) ? e : {};
}
function Fe(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!Ks(n))
      return;
    n = n[r];
  }
  return n;
}
const cN = {}, Ni = [], dN = [], zu = [], uN = 800;
function lN(e) {
  const t = W(/* @__PURE__ */ new Map()), n = W(0), r = E(() => {
    n.current && (window.clearTimeout(n.current), n.current = 0);
    const o = t.current;
    t.current = /* @__PURE__ */ new Map(), o.size !== 0 && e((i) => GI(i, o));
  }, [e]), s = E(
    (o, i) => {
      qI(t.current, o, i), !n.current && (n.current = window.setTimeout(() => {
        n.current = 0, r();
      }, FN));
    },
    [r]
  );
  return ue(
    () => () => {
      n.current && window.clearTimeout(n.current), t.current = /* @__PURE__ */ new Map();
    },
    []
  ), de(() => ({ enqueue: s, flush: r }), [s, r]);
}
function $u(e, t) {
  let n = null;
  for (const r of t)
    Object.prototype.hasOwnProperty.call(e, r) && (n ||= { ...e }, delete n[r]);
  return n || e;
}
function zp(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of t)
    if (n.add(r.id), r.type === "group")
      for (const s of ql(e, r.id))
        n.add(s.id);
  return n;
}
function $p(e) {
  return Object.values(e).some(It);
}
function fN(e) {
  return e instanceof Element && e.classList.contains("react-flow__pane");
}
function pN(e, t, n) {
  return {
    left: Math.min(e.x, t.x) - n.left,
    top: Math.min(e.y, t.y) - n.top,
    width: Math.abs(t.x - e.x),
    height: Math.abs(t.y - e.y)
  };
}
function mN(e, t, n) {
  const r = {
    left: Math.min(t.x, n.x),
    top: Math.min(t.y, n.y),
    right: Math.max(t.x, n.x),
    bottom: Math.max(t.y, n.y)
  };
  return e.filter((s) => {
    const o = dm(s), i = s.x + o.width, c = s.y + o.height;
    return s.type === "group" ? r.left <= s.x && r.top <= s.y && r.right >= i && r.bottom >= c : r.left <= i && r.right >= s.x && r.top <= c && r.bottom >= s.y;
  }).map((s) => s.id);
}
function gN(e, t) {
  return [.../* @__PURE__ */ new Set([...e, ...t])];
}
const yN = {
  workSpace: Mc(mC, pm)
}, hd = gl(!1), hN = Mc(fm, pm), _N = {
  animated: ib
}, wN = {
  stroke: "var(--ws-green)",
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeDasharray: "8 6"
}, bN = [18, 18], IN = ["Control", "Meta"], vN = {
  type: "animated",
  animated: !1
}, NN = { padding: 0.32, maxZoom: 0.72 };
function nt(e) {
  const t = W(e);
  return Zr(() => {
    t.current = e;
  }, [e]), de(() => aw(t), []);
}
function SN({
  onInitialLoadComplete: e
}) {
  const t = qm(), [n, r] = q(""), s = zg(), o = de(() => SC(), []), i = de(() => CC(), []), c = de(() => new K_(), []), [a, d] = q(null), [u, y] = q(i), h = W(i), [I, w] = q(0), C = W(0), [S, x] = q(null), T = W(null), [U, ee] = q([]), Z = U[U.length - 1] || "", [oe, X] = q({}), O = W(oe), [we, ve] = q(!1), [D, V] = q([]), [G, K] = q(!1), ne = W(0), [H, fe] = q("create"), [be, pe] = q(
    () => kC(o)
  ), [Ee, Le] = q(!1), [xe, In] = q(
    () => RC()
  ), { resolvedTheme: nn, setTheme: vn } = aN();
  ny(s.site.appearance, nn);
  const [mt, ge] = q(null), [Ae, rn] = q(!0), Te = W(!0), [ro, Nn] = q({}), oo = W(ro);
  oo.current = ro;
  const so = W(/* @__PURE__ */ new Set()), Sn = lN(Nn), [Vo, Vt] = q({}), [Qe, jn] = q(null), [Ln, Mt] = q(null), Nt = E(
    (l) => {
      jn(l), Mt(l);
    },
    []
  ), [ot, st] = q(null), dn = W(null), [Vn, io] = q(!1), [_r, Pe] = q(null), [Gs, ao] = q(), [Ws, Uo] = q(), [Cn, Ko] = q(
    null
  ), [qo, kn] = q(null), [un, wr] = q(!1), [Go, Ot] = q(""), [Ut, Rn] = q(null), [Un, br] = q(""), [Dt, ln] = q([]), [Kn, Ve] = q([]), [St, Ir] = q(!1), [it, vr] = q(""), [co, qn] = q(!1), [Gn, Nr] = q(1), [Ge, Wn] = q(!1), [Hn, ye] = q(() => /* @__PURE__ */ new Set()), [uo, Ct] = q(!1), [Kt, at] = q(null), [Sr, xn] = q(!1), Ue = W(null), Yn = W(!1), kt = W(/* @__PURE__ */ new Set()), Cr = W(/* @__PURE__ */ new Set()), gt = W(/* @__PURE__ */ new Set()), et = W([]), Wo = W(/* @__PURE__ */ new Set()), fn = W(null), qt = W(new AbortController()), Xn = W(new AbortController()), kr = W(L_());
  Zr(() => {
    const l = new AbortController();
    return Xn.current = l, () => l.abort();
  }, [u]), ue(() => {
    qt.current.signal.aborted && (qt.current = new AbortController());
    const l = qt.current, p = kr.current;
    return () => {
      l.abort(), p.clear();
    };
  }, []);
  const Gt = W([0]), pn = W(null), lo = W(/* @__PURE__ */ new Map()), fo = W(
    /* @__PURE__ */ new Map()
  ), Rr = W(/* @__PURE__ */ new Set()), [
    po,
    Ho
  ] = q(() => /* @__PURE__ */ new Set()), [
    Yo,
    xr
  ] = q({}), Rt = W(null), {
    roles: mo,
    powers: Oe,
    powerCategories: Hs,
    loaded: mn,
    load: Ar
  } = UI({
    space: a,
    canvases: oe,
    cache: c,
    onError: r
  });
  ue(() => {
    xr({});
  }, [a?.project.id, a?.project.release_id, a?.release?.id]), ue(() => {
    O.current = oe;
  }, [oe]), ue(() => {
    C.current = I;
  }, [I]), ue(() => {
    h.current = u;
  }, [u]), ue(() => {
    et.current = Dt;
  }, [Dt]);
  const Zn = E(
    (l, p) => {
      if (l = l.trim(), !l)
        return;
      const g = Rr.current;
      if (g.has(l) === p)
        return;
      const v = new Set(g);
      p ? v.add(l) : v.delete(l), Rr.current = v, Ho(v);
    },
    []
  ), An = E(
    (l) => {
      const p = Xp(l);
      if (!p)
        return;
      const g = String(p.request_id || "").trim();
      g && Zn(g, _n(p));
      const v = Da(
        et.current,
        [p]
      );
      et.current = v, ln(v);
    },
    [Zn]
  ), Jn = E(
    (l) => {
      const p = String(l?.request_id || "").trim();
      p && Zn(p, !1);
    },
    [Zn]
  ), gn = E((l) => {
    r(l instanceof Error ? l.message : "保存画布失败");
  }, []), {
    markCanvasDirty: on,
    flushCanvasSave: yt,
    flushPendingCanvasSaves: Ys,
    hasPendingCanvasSaves: Tr,
    adoptCanvasSnapshot: yn,
    forgetCanvasSnapshot: Xo,
    resetCanvasAutosave: go,
    canvasSaveStatus: Zo
  } = j_({
    projectId: o,
    enabled: !!a,
    canvases: oe,
    setCanvases: X,
    onError: gn
  }), tt = nt(
    wo
  ), yo = nt(
    hm
  );
  ue(() => {
    if (gt.current.size === 0)
      return;
    const l = [...gt.current];
    gt.current.clear();
    for (const p of l)
      on(p);
  }, [oe, on]);
  const Jo = E(async () => {
    if (!o) {
      br("缺少作品 ID"), rn(!1);
      return;
    }
    rn(!0), br("");
    try {
      const l = await l_(
        o,
        h.current,
        C.current
      ), p = MS(
        l.canvases || {},
        l.assets || []
      ), g = Number(l.initialCanvasId || 0) || Number(Object.values(p)[0]?.id || 0), v = Number(l.initialAssetCateId || 0) || Nh(l);
      d(l), O.current = p, X(p), go(p), h.current = g, y(g), C.current = v, w(v), ko(g), x(null), T.current = null, ne.current += 1, ve(!1), V([]), K(!1), kt.current = /* @__PURE__ */ new Set(), Cr.current = /* @__PURE__ */ new Set(), et.current = [], ln([]), Rr.current = /* @__PURE__ */ new Set(), Ho(/* @__PURE__ */ new Set()), fn.current = null, Ir(!1), Ve([]), Nr(1), Wn(!1), Gt.current = [0], tt(o, l, p, "recovery", {
        canvasId: g
      });
    } catch (l) {
      br(l instanceof Error ? l.message : "加载创作空间失败");
    } finally {
      rn(!1);
    }
  }, [tt, o, go]);
  ue(() => {
    const l = (p) => {
      !Tr() && gt.current.size === 0 || (p.preventDefault(), p.returnValue = "");
    };
    return window.addEventListener("beforeunload", l), () => window.removeEventListener("beforeunload", l);
  }, [Tr]);
  async function Mr(l) {
    if (me(C.current))
      try {
        for (const p of gt.current)
          on(p);
        gt.current.clear(), await Ys(), await l();
      } catch (p) {
        gn(p);
      } finally {
        ie();
      }
  }
  const Qo = E((l) => {
    Ko(l);
  }, []);
  ue(() => {
    Jo();
  }, [Jo]), ue(() => {
    Ae || !Te.current || (Te.current = !1, e());
  }, [Ae, e]);
  const Tn = a?.assetCates, Xs = de(() => a ? ff(a) : [], [a]), Zs = Xs.length > 1, se = de(
    () => a ? ba(a, I) : null,
    [I, a]
  ), da = de(
    () => a && se ? Sh(a, se.id) : [],
    [se, a]
  ), ua = de(() => mo.filter(Ch), [mo]), ct = de(() => Oe.filter(kh), [Oe]), la = de(
    () => Oe.some(
      (l) => Number(l.id || 0) > 0 && String(l.kind || "").trim().toLowerCase() === "video" && cn(l).outputType === "lip_sync"
    ),
    [Oe]
  ), Q = de(() => {
    const l = a?.canvasList.find(
      (p) => p.id === u
    );
    return oe[String(u)] || Qd(
      l?.assetCateId || se?.id || 0,
      u,
      l?.name || "第一幕"
    );
  }, [u, se?.id, oe, a?.canvasList]), es = de(
    () => (a?.canvasList || []).filter((l) => l.assetCateId === se?.id).sort((l, p) => l.sort - p.sort || l.id - p.id),
    [se?.id, a?.canvasList]
  ), ts = E(
    async (l) => {
      const p = ne.current + 1;
      ne.current = p, K(!0);
      try {
        const g = await y_({
          projectId: o,
          assetCateId: l
        });
        ne.current === p && V(g);
      } catch (g) {
        ne.current === p && (V([]), r(
          g instanceof Error ? g.message : "加载已删除画布失败"
        ));
      } finally {
        ne.current === p && K(!1);
      }
    },
    [o]
  ), Qn = E(() => {
    se && (ve(!0), V([]), ts(se.id));
  }, [se, ts]), je = de(
    () => MN(Q, Vo),
    [Q, Vo]
  ), fa = de(() => {
    const l = new Set(U);
    return je.nodes.filter((p) => l.has(p.id));
  }, [je.nodes, U]), Js = E(
    async (l) => {
      const p = String(l), g = qt.current.signal;
      g.throwIfAborted();
      const v = O.current[p], b = () => gt.current.has(l) || Tr(l);
      if (b())
        throw new Error("画布有未保存的修改，请保存后重新采用助手结果");
      const N = await cs({
        projectId: o,
        canvasId: l
      });
      if (g.throwIfAborted(), b() || O.current[p] !== v)
        throw new Error("加载期间画布已修改，已保留本地草稿，请重新采用助手结果");
      const k = xo(
        No(N.canvas, Oe),
        N.assets
      );
      d(
        (z) => z && {
          ...z,
          assets: So(z.assets, N.assets),
          canvasList: N.canvasList.length > 0 ? N.canvasList : z.canvasList
        }
      );
      const A = {
        ...O.current,
        [p]: k
      };
      O.current = A, X(A), yn(k);
    },
    [yn, Tr, Oe, o]
  ), pa = E((l) => {
    const p = Cp(l);
    In(p), el(
      Np,
      String(p)
    );
  }, []), Qs = E(
    (l) => {
      pe(l), l || Le(!1), el(
        `${Sp}:${o}`,
        l ? "1" : "0"
      );
    },
    [o]
  ), ei = Kr, Re = W([]), er = de(() => {
    const l = Pw(
      {
        nodes: je.nodes,
        assets: a?.assets || [],
        canvasId: Q.id,
        assetCateId: se?.id || 0,
        nodeOutput: $n,
        nodePreview: no,
        assetPreview: (p) => {
          const g = p.version?.content ?? p.name, v = yr(
            g,
            String(p.kind || "")
          );
          return fr(v) || (v.text = p.name), v;
        },
        nodeHasResult: an
      },
      Re.current
    );
    return Re.current = l, l;
  }, [Q.id, se?.id, je.nodes, a?.assets]), Dr = W([]), Er = de(() => {
    const l = jw(
      er,
      Dr.current
    );
    return Dr.current = l, l;
  }, [er]), Pr = E(
    (l = "") => {
      Au(), Ot(l), Ue.current = Q.nodes.find((p) => p.id === l) || (Ue.current?.id === l ? Ue.current : null), ge(null), fe("create"), wr(!0);
    },
    [Q.nodes]
  ), We = E(
    (l, p) => {
      if (!Number.isInteger(l) || l <= 0)
        return;
      const g = (N) => {
        const k = String(l), A = N[k];
        if (!A) return N;
        const z = TS(
          p(A),
          A.assetCateId
        );
        return PS(A, z) ? N : (gt.current.add(l), {
          ...N,
          [k]: z
        });
      }, v = O.current, b = g(v);
      O.current = b, X((N) => {
        const k = N === v ? b : g(N);
        return O.current = k, k;
      });
    },
    []
  ), Et = E(
    (l) => {
      se && We(Q.id, l);
    },
    [Q.id, se, We]
  ), Or = E(
    (l, p, g) => {
      const b = O.current[String(l)]?.nodes.find(
        (k) => k.id === p
      );
      if (zd(b, g)) return;
      const N = rI(
        aI(b, g),
        mn && !!Tn
      );
      N === "defer-materialize" && (xr((k) => ({
        ...k,
        [`${l}:${p}`]: { canvasId: l, nodeId: p }
      })), mn || Ar()), h.current === l && Vt(
        (k) => DN(k, p, g)
      ), We(l, (k) => {
        const A = k.assetCateId, z = {
          ...k,
          nodes: k.nodes.map(
            (re) => re.id === p ? { ...re, ...g } : re
          )
        };
        if (!Tn)
          return z;
        const ce = {
          canvas: z,
          assetCate: Ha(Tn, A),
          powers: Oe
        };
        if (N === "materialize")
          return vu({
            ...ce,
            sourceNodeId: p
          });
        if (N === "defer-materialize")
          return z;
        const ae = kI(
          z.nodes,
          p
        );
        return ae.length ? Ra({
          ...ce,
          sourceNodeIds: ae,
          previousNodes: k.nodes
        }) : z;
      });
    },
    [
      Tn,
      Ar,
      mn,
      Oe,
      We
    ]
  );
  ue(() => {
    if (!mn || !Tn || Object.keys(Yo).length === 0)
      return;
    const l = Object.values(Yo);
    xr({});
    for (const { canvasId: p, nodeId: g } of l)
      We(
        p,
        (v) => vu({
          canvas: v,
          assetCate: Ha(Tn, v.assetCateId),
          powers: Oe,
          sourceNodeId: g
        })
      );
  }, [
    Tn,
    Yo,
    mn,
    Oe,
    We
  ]);
  const dt = E(
    (l, p) => {
      Or(Q.id, l, p), h.current === Q.id && Nt(
        (g) => g?.id === l && !zd(g, p) ? { ...g, ...p } : g
      );
    },
    [Q.id, Or, Nt]
  ), ns = E(
    (l, p, g) => {
      if (!gS(p, g))
        return;
      const v = Number(g.version_id || 0), b = `${l}:${p.id}:${v}`;
      if (kt.current.has(b))
        return;
      kt.current.add(b);
      const N = p.title.trim(), k = O.current[String(l)];
      I_({
        projectId: o,
        nodeKey: p.id,
        versionId: v,
        prompt: mS(p, k)
      }).then((A) => {
        const z = A.title.trim();
        !z || z === N || A.versionId !== v || We(l, (ce) => {
          const ae = ce.nodes.find(
            (re) => re.id === p.id
          );
          return !ae || ae.titleMode !== "auto" || ae.title.trim() !== N || !uf(ae) ? ce : {
            ...ce,
            nodes: ce.nodes.map(
              (re) => re.id === p.id ? { ...re, title: z } : re
            )
          };
        });
      }).catch(() => {
        kt.current.delete(b);
      });
    },
    [o, We]
  ), tr = E(
    async (l) => {
      l.canvasId && on(l.canvasId);
    },
    [on]
  ), ti = E(
    (l, p, g) => {
      const v = {};
      Et((b) => {
        const N = b.nodes.map(
          (k) => k.id === l ? {
            ...k,
            composerDraft: Hc(p)
          } : k
        );
        return v.canvas = { ...b, nodes: N }, v.canvas;
      }), g?.save === "immediate" && v.canvas && yt(v.canvas).catch(() => {
      });
    },
    [yt, Et]
  ), ni = E(
    (l) => {
      Et((p) => {
        const g = p.edges.filter((v) => v.id !== l);
        return g.length === p.edges.length ? p : { ...p, edges: g };
      });
    },
    [Et]
  ), ho = nt(
    (l, p, g) => {
      if (tl(l.power, l.kind, l.outputType) && !zc(
        Po(l, l.resultOutput)?.document
      ))
        return;
      const v = !!(Qe && Qe.id !== l.id && pr(
        Qe.power,
        Qe.kind,
        Qe.outputType
      )), b = ES(l);
      if (Mt(null), b) {
        sv(), v || (jn(null), ao(void 0), Uo(void 0)), Pe(b);
        return;
      }
      if (Ms(), Pe(null), v) {
        Mt(l);
        return;
      }
      ao(p), Uo(g), jn(l);
    }
  ), ma = E((l) => {
    Nt(
      (p) => p?.id === l.id && p !== l ? l : p
    );
  }, [Nt]), ri = nt(
    (l, p) => {
      st({ canvasId: Q.id, nodeId: l, onConfirmed: p });
    }
  ), Ft = ot?.canvasId === Q.id ? je.nodes.find((l) => l.id === ot.nodeId) : void 0, rs = Ft ? bn(Si(Ft)) : null;
  async function ga(l) {
    if (Vn || !Ft)
      return !1;
    const p = Number(
      Ft.asset?.id || Ft.resultRef?.asset_id || 0
    ), g = Number(
      Ft.asset?.version_id || Ft.asset?.version?.id || Ft.resultRef?.version_id || 0
    );
    if (!p || !g)
      return r("当前分镜尚未保存，不能确认"), !1;
    io(!0);
    try {
      const v = await x_({
        projectId: o,
        assetId: p,
        versionId: g,
        productionPlan: l
      });
      return oi(Ft, v), ot?.onConfirmed?.(v), st(null), !0;
    } catch (v) {
      return r($g(v, "确认分镜失败")), !1;
    } finally {
      io(!1);
    }
  }
  const _o = E(
    (l, p) => {
      Vt((g) => {
        const v = Q.nodes.find(
          (k) => k.id === l
        );
        if (!v)
          return g;
        const b = g[l] || {}, N = {
          ...v,
          ...b
        };
        return {
          ...g,
          [l]: {
            ...b,
            feedbackRequests: p(qr(N))
          }
        };
      });
    },
    [Q.nodes]
  ), Fr = E((l) => {
    const p = new Set(l.filter(Boolean));
    if (p.size !== 0) {
      if (Rt.current && p.has(Rt.current.nodeId)) {
        const g = Rt.current;
        Rt.current = null, g.reject(new Error(Bf));
      }
      at(
        (g) => g && p.has(g.node.id) ? null : g
      ), Vt((g) => {
        const v = { ...g };
        let b = !1;
        for (const N of p) {
          const k = v[N] || {};
          v[N] = {
            ...k,
            feedbackRequests: []
          }, b = !0;
        }
        return b ? v : g;
      });
    }
  }, []), xt = E((l) => {
    !l || !l.id || d((p) => p && {
      ...p,
      assets: So(p.assets, [l])
    });
  }, []), oi = E(
    (l, p) => {
      const g = dr(
        p,
        l.asset
      );
      xt(g);
      const v = Is(l, g);
      l.id.startsWith("asset-detail-") || dt(l.id, v), Nt(
        (b) => b?.id === l.id ? { ...b, ...v } : b
      );
    },
    [dt, xt, Nt]
  ), ya = E(
    (l) => {
      if (!_r)
        return;
      const p = Q.nodes.find(
        (b) => b.id === _r.nodeId
      );
      if (!p)
        return;
      const g = ir(l), v = Is(
        p,
        g
      );
      xt(g), dt(p.id, v);
    },
    [
      Q.nodes,
      _r,
      dt,
      xt
    ]
  ), os = E(
    ({ node: l, prompt: p }) => {
      const g = _d(l, p), v = lc(
        qr(l),
        g
      );
      return _o(
        l.id,
        (b) => lc(b, g)
      ), xn(!1), new Promise((b, N) => {
        Rt.current = {
          nodeId: l.id,
          recordId: g.id,
          resolve: b,
          reject: N
        }, at({
          node: { ...l, feedbackRequests: v },
          recordId: g.id,
          prompt: p
        });
      });
    },
    [_o]
  ), m = E(
    async (l) => {
      const p = Rt.current;
      if (!(!p || Sr)) {
        xn(!0);
        try {
          await p.submit?.(l), _o(
            p.nodeId,
            (g) => Yw(g, p.recordId, l)
          ), Rt.current = null, at(null), p.resolve(l);
        } catch (g) {
          r(g instanceof Error ? g.message : "提交反馈失败");
        } finally {
          xn(!1);
        }
      }
    },
    [_o, Sr]
  ), _ = E(() => {
    at(null);
  }, []), R = E(
    (l, p) => {
      if (Rt.current?.nodeId === l.id && Rt.current.recordId === p.id && p.status === "pending") {
        at({
          node: l,
          recordId: p.id,
          prompt: p.prompt
        });
        return;
      }
      if (p.status === "pending") {
        const g = pS(
          et.current,
          l,
          p
        );
        if (g) {
          xn(!1), Rt.current = {
            nodeId: l.id,
            recordId: p.id,
            resolve: () => {
            },
            reject: () => {
            },
            submit: async (v) => {
              await Jp(
                o,
                g.run,
                g.pending,
                g.prompt,
                v
              ), window.setTimeout(() => pn.current?.(), 0);
            }
          }, at({
            node: l,
            recordId: p.id,
            prompt: g.prompt
          });
          return;
        }
      }
      at({
        node: l,
        recordId: p.id,
        prompt: {
          ...p.prompt,
          values: p.values || p.prompt.values || {}
        }
      });
    },
    [o]
  ), B = E(
    (l) => {
      const p = AbortSignal.any([
        qt.current.signal,
        Xn.current.signal
      ]), g = (b) => {
        Nn((N) => p.aborted || h.current !== l ? N : typeof b == "function" ? b(N) : b);
      }, v = {
        enqueue: (b, N) => Sn.enqueue(
          b,
          (k) => !p.aborted && h.current === l ? N(k) : k
        ),
        flush: Sn.flush
      };
      return {
        setRunningNode: g,
        getRunningNode: (b) => !p.aborted && h.current === l ? oo.current[b] : void 0,
        runningNodeBatcher: v,
        consumerSignal: p,
        subscribeRun: (b, N) => {
          const k = kr.current.subscribe(
            o,
            l,
            b,
            N
          ), A = et.current.find(
            (z) => z.canvas_id === l && z.request_id === b && Fn(z.status)
          );
          return A && N(A), k;
        }
      };
    },
    [o, Sn]
  ), F = E(
    ({
      assetCate: l,
      startNode: p,
      canvas: g,
      nodes: v = g.nodes,
      ...b
    }) => {
      if (!a)
        throw new Error("创作空间尚未加载");
      const N = g.id;
      return {
        projectId: o,
        canvasId: N,
        assetCate: l,
        space: a,
        startNode: p,
        onCanvasRunChange: An,
        appliedResultKeys: Cr.current,
        ownsNodeResult: (k, A) => Ea(
          et.current,
          N,
          k,
          A
        ),
        ...b,
        nodes: v,
        edges: g.edges,
        viewport: g.viewport,
        canvasUpdatedAt: g.updatedAt,
        flushCanvasSave: yt,
        onNodeResult: dt,
        onAssetCreated: xt,
        ...B(N),
        requestFlowFeedback: os,
        requestNodeTitle: (k, A) => ns(g.id, k, A)
      };
    },
    [
      o,
      An,
      yt,
      ns,
      os,
      B,
      a,
      dt,
      xt
    ]
  ), j = E(
    async (l) => {
      !a || l?.consumerSignal?.aborted || await tt(
        o,
        a,
        O.current,
        "recovery",
        {
          canvasId: l?.canvasId || h.current,
          runIds: [Number(l?.canvasRun?.run_id || 0)]
        }
      );
    },
    [tt, o, a]
  ), le = E(
    async (l) => {
      if (!a || !se)
        return;
      let p = null;
      try {
        Fr(
          X_(
            l.id,
            je.nodes,
            je.edges
          )
        ), p = F({
          assetCate: se,
          startNode: l,
          canvas: {
            ...Q,
            nodes: je.nodes,
            edges: je.edges,
            viewport: Q.viewport
          }
        }), await Ma(p), await tr(p);
      } catch (g) {
        if (p?.consumerSignal?.aborted || Ww(g) || ys(g))
          return;
        const v = g instanceof Error ? g.message : "开始节点执行失败", b = p;
        if (b && !ft(
          b,
          b.canvasRun,
          l.id
        ))
          return;
        b?.setRunningNode?.(
          (N) => ft(
            b,
            b.canvasRun,
            l.id
          ) ? {
            ...N,
            [l.id]: {
              nodeId: l.id,
              title: l.title,
              startedAt: Date.now(),
              progress: 92,
              status: "error"
            }
          } : N
        ), r(v), b && Ns(b, [l.id], 1400);
      } finally {
        Jn(p?.canvasRun), await j(p);
      }
    },
    [
      se,
      Q,
      je.edges,
      je.nodes,
      Fr,
      F,
      tr,
      j,
      Jn,
      a
    ]
  ), M = E(
    async (l) => {
      if (!a || !se)
        return;
      const p = O.current[String(Q.id)] || Q, g = p.nodes.find(
        (z) => z.id === l
      );
      if (!g) {
        r("分镜脚本节点不存在");
        return;
      }
      const v = ip(
        p.nodes,
        an
      ).find((z) => z.sourceNodeId === l);
      if (!v) {
        r("当前分镜脚本尚未生成制作组");
        return;
      }
      const b = ap(
        v,
        p.nodes,
        an
      );
      if (b.blockedReason) {
        r(b.blockedReason);
        return;
      }
      const N = ta(l), k = F({
        assetCate: se,
        startNode: g,
        executionScope: "storyboard_frame",
        patchStartNodeResult: !1,
        onCanvasRunChange: An,
        canvas: p
      });
      Fr(b.pendingNodeIds), k.setRunningNode?.((z) => ({
        ...z,
        [N]: {
          nodeId: N,
          title: `${g.title || "分镜脚本"}制作区`,
          startedAt: Date.now(),
          progress: 0,
          status: "running"
        }
      }));
      let A = 650;
      try {
        await Ma(k);
      } catch (z) {
        if (k.consumerSignal?.aborted || ys(z))
          A = 0;
        else if (ft(k, k.canvasRun, N)) {
          A = 1400;
          const ce = z instanceof Error ? z.message : "制作区执行失败";
          k.setRunningNode?.(
            (ae) => ft(k, k.canvasRun, N) ? {
              ...ae,
              [N]: {
                ...ae[N] || {
                  nodeId: N,
                  title: `${g.title || "分镜脚本"}制作区`,
                  startedAt: Date.now(),
                  progress: 0
                },
                status: "error"
              }
            } : ae
          ), r(ce);
        }
      } finally {
        Jn(k.canvasRun), (k.canvasRun?.node_results || []).some(
          (ce) => ce.node_key && js(ce) === "success"
        ) && !k.consumerSignal?.aborted && (Et(
          (ce) => Ra({
            canvas: ce,
            sourceNodeIds: [l],
            assetCate: se,
            powers: Oe
          })
        ), await tr(k)), k.consumerSignal?.aborted || Ns(k, [N], A), await j(k);
      }
    },
    [
      Q,
      se,
      Fr,
      F,
      tr,
      Oe,
      j,
      Jn,
      An,
      a,
      Et
    ]
  ), Y = E(
    async (l, p) => {
      if (!a || !se)
        return;
      const g = O.current[String(Q.id)] || Q, v = g.nodes.find((J) => J.id === l.id) || l, b = PN({
        ...v,
        composerDraft: {
          ...v.composerDraft || {},
          ...l.composerDraft || {}
        }
      });
      if (kg(b)) {
        const J = Po(
          b,
          b.resultOutput
        );
        if (!J) throw new Error("请等待作品加载完成后再发送");
        if (J.document.selected_inspiration_id) {
          ho(b);
          return;
        }
        if (H !== "create") throw new Error("当前作品只读，无法重新生成");
        const _e = `${g.id}:${b.id}`;
        if (J.document.status === "running" || It(oo.current[b.id]) || so.current.has(_e))
          throw new Error("当前灵感正在生成，请等待完成后再发送");
        so.current.add(_e);
        try {
          const Ne = await My({
            project_id: o,
            canvas_id: g.id,
            work_asset_id: J.work_asset_id,
            expected_work_version_id: J.work_version_id,
            expected_work_revision: J.work_revision,
            action: "generate_inspirations",
            instruction: b.composerDraft?.prompt || ""
          });
          Or(g.id, b.id, {
            resultOutput: Ne,
            runError: ""
          });
        } finally {
          so.current.delete(_e);
        }
        return;
      }
      const N = W_(
        b.id,
        p?.targetNodeIds
      ), k = Y_(
        g.nodes.map(
          (J) => J.id === b.id ? b : J
        ),
        N
      ), A = new Map(
        k.map((J) => [J.id, J])
      ), z = N.map((J) => A.get(J)).filter((J) => !!J), ce = (J) => {
        let _e = J;
        for (const Ne of N)
          !_e[Ne] || !ft(re, re.canvasRun, Ne) || (_e === J && (_e = { ...J }), delete _e[Ne]);
        return _e;
      }, ae = rm(
        l.id,
        k,
        g.edges
      ), re = F({
        assetCate: se,
        startNode: b,
        singleNode: !0,
        targetNodeIds: p?.targetNodeIds,
        onCanvasRunChange: An,
        canvas: g,
        nodes: k,
        runInput: {
          _manual_input_context: ae || void 0,
          _agent_turn_input: p?.agentInput,
          manual_node_id: l.id
        }
      });
      for (const J of z)
        dt(J.id, { runError: "" });
      re.setRunningNode?.((J) => {
        const _e = { ...J };
        for (const Ne of z) {
          const _t = J[Ne.id];
          _e[Ne.id] = {
            ..._t || {},
            ...cd(_t),
            nodeId: Ne.id,
            title: Ne.title,
            startedAt: _t?.startedAt || Date.now(),
            progress: Math.max(_t?.progress || 0, 8),
            status: "running",
            ...Ne.id === b.id && p?.agentInput ? { agent: Df() } : {}
          };
        }
        return _e;
      });
      try {
        await Ma(re), await tr(re);
      } catch (J) {
        if (re.consumerSignal?.aborted || !ft(re, re.canvasRun, b.id))
          return;
        if (ys(J)) {
          dt(b.id, { runError: "" }), re.setRunningNode?.(ce);
          return;
        }
        throw dt(b.id, {
          runError: J instanceof Error ? J.message : "节点运行失败"
        }), re.setRunningNode?.(
          (_e) => ft(re, re.canvasRun, b.id) ? {
            ..._e,
            [b.id]: {
              ..._e[b.id] || {
                nodeId: b.id,
                title: b.title,
                startedAt: Date.now()
              },
              progress: 92,
              status: "error"
            }
          } : _e
        ), Ns(re, N, 1400), J;
      } finally {
        Jn(re.canvasRun), await j(re);
      }
    },
    [
      se,
      Q,
      F,
      tr,
      o,
      j,
      Jn,
      An,
      a,
      ho,
      Or,
      dt,
      H
    ]
  ), te = E(
    async (l) => {
      if (!se)
        throw new Error("当前分类不存在");
      const p = B(Q.id);
      let g;
      const v = (N) => {
        const k = g;
        g = {
          nodeId: l.id,
          title: l.title,
          startedAt: k?.startedAt || Date.now(),
          progress: N === "success" ? 100 : N === "error" ? 92 : 0,
          status: N
        };
        const A = g;
        p.setRunningNode(
          (z) => k && z[l.id] !== k ? z : { ...z, [l.id]: A }
        ), (N === "success" || N === "error") && window.setTimeout(
          () => p.setRunningNode(
            (z) => z[l.id] === A ? up(z, l.id) : z
          ),
          N === "success" ? 650 : 1200
        );
      }, b = !qs(l);
      b && v("running");
      try {
        const N = await rC({
          node: l,
          projectId: o,
          canvasId: Q.id,
          assetCate: se,
          inputContext: l.inputContext || null,
          onNodeResult: dt,
          onAssetCreated: xt,
          onRunStartNode: le,
          onOpenImportPicker: Pr
        });
        return b && v("success"), N;
      } catch (N) {
        throw b && v("error"), N;
      }
    },
    [
      Q.id,
      se,
      B,
      Pr,
      o,
      le,
      dt,
      xt
    ]
  );
  ue(() => {
    a && yo(Dt, Q, a);
  }, [Q, yo, Dt, a]);
  function me(l) {
    return T.current != null ? !1 : (T.current = l, x(l), !0);
  }
  function ie() {
    T.current = null, x(null);
  }
  async function he() {
    const l = O.current[String(h.current)] || Q;
    if (!l.id)
      return !0;
    try {
      return await yt(l), !0;
    } catch {
      return !1;
    }
  }
  function Me() {
    ee([]), Vt({}), Nn({}), kn(null), ge(null), jn(null), Mt(null), st(null), Pe(null), ao(void 0), wr(!1), Ot(""), Ue.current = null, Rn(null), qn(!1), fn.current = null, Gt.current = [0], Ve([]), Nr(1), Wn(!1), Ir(!1), vr("");
  }
  async function ut(l) {
    if (l === h.current) return !0;
    if (T.current != null)
      return !1;
    const p = a?.canvasList.find((g) => g.id === l);
    if (!p)
      return r("目标画布不存在"), !1;
    if (!me(p.assetCateId)) return !1;
    try {
      if (!await he()) return !1;
      const g = String(l);
      if (!Object.prototype.hasOwnProperty.call(O.current, g))
        try {
          const b = await cs({
            projectId: o,
            canvasId: l
          }), N = xo(
            No(b.canvas, Oe),
            b.assets
          );
          d(
            (A) => A && {
              ...A,
              assets: So(A.assets, b.assets),
              canvasList: b.canvasList.length > 0 ? b.canvasList : A.canvasList
            }
          );
          const k = {
            ...O.current,
            [g]: N
          };
          O.current = k, X(k), yn(N);
        } catch (b) {
          return r(b instanceof Error ? b.message : "加载画布失败"), !1;
        }
      if (h.current = l, y(l), C.current = p.assetCateId, w(p.assetCateId), ko(l), Me(), !a)
        return !0;
      const v = O.current[g] || Qd(p.assetCateId, l, p.name);
      return yo(Dt, v, a), tt(
        o,
        a,
        O.current,
        "recovery",
        { canvasId: l }
      ), !0;
    } finally {
      ie();
    }
  }
  async function At(l) {
    const p = (a?.canvasList || []).filter((g) => g.assetCateId === l).sort((g, v) => g.sort - v.sort || g.id - v.id)[0];
    if (p) return ut(p.id);
    if (!a || T.current != null || !me(l)) return !1;
    try {
      if (!await he()) return !1;
      const g = await cs({
        projectId: o,
        canvasId: 0,
        assetCateId: l
      }), v = xo(
        No(g.canvas, Oe),
        g.assets
      ), b = v.id, N = {
        ...O.current,
        [String(b)]: v
      };
      return O.current = N, X(N), yn(v), d(
        (k) => k && {
          ...k,
          assets: So(k.assets, g.assets),
          canvasList: g.canvasList.length > 0 ? g.canvasList : k.canvasList
        }
      ), h.current = b, y(b), C.current = l, w(l), ko(b), Me(), tt(o, a, N, "recovery", {
        canvasId: b
      }), !0;
    } catch (g) {
      return r(
        g instanceof Error ? g.message : "加载输出类型失败"
      ), !1;
    } finally {
      ie();
    }
  }
  async function ht(l) {
    if (se) {
      if (!me(se.id))
        throw new Error("正在切换画布，请稍后重试");
      try {
        if (!await he())
          throw new Error("当前画布保存失败，未创建新画布");
        const p = await f_({
          projectId: o,
          assetCateId: se.id,
          name: l
        }), g = p.canvas;
        if (!g?.id) throw new Error("新画布数据为空");
        const v = No(g, Oe), b = {
          ...O.current,
          [String(g.id)]: v
        };
        O.current = b, X(b), yn(v), d(
          (N) => N && {
            ...N,
            canvasList: p.canvasList,
            initialCanvasId: g.id,
            initialAssetCateId: g.assetCateId
          }
        ), h.current = g.id, y(g.id), C.current = g.assetCateId, w(g.assetCateId), ko(g.id), Me(), nr();
      } catch (p) {
        throw r(p instanceof Error ? p.message : "创建画布失败"), p;
      } finally {
        ie();
      }
    }
  }
  async function Pt(l, p) {
    try {
      const g = await p_({ projectId: o, canvasId: l, name: p });
      d(
        (v) => v && { ...v, canvasList: g.canvasList }
      ), X((v) => {
        const b = v[String(l)];
        if (!b) return v;
        const N = {
          ...v,
          [String(l)]: { ...b, name: p }
        };
        return O.current = N, N;
      }), nr();
    } catch (g) {
      throw r(g instanceof Error ? g.message : "重命名画布失败"), g;
    }
  }
  async function Wt(l) {
    if (se)
      try {
        const p = await m_({
          projectId: o,
          assetCateId: se.id,
          canvasIds: l
        });
        d(
          (g) => g && { ...g, canvasList: p.canvasList }
        );
      } catch (p) {
        throw r(
          p instanceof Error ? p.message : "调整画布顺序失败"
        ), p;
      }
  }
  async function Mn(l) {
    if (!me(C.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      const p = l === h.current, g = O.current[String(l)];
      g && await yt(g);
      const v = await g_({ projectId: o, canvasId: l });
      if (Xo(l), d(
        (b) => b && { ...b, canvasList: v.canvasList }
      ), O.current[String(l)]) {
        const b = { ...O.current };
        delete b[String(l)], O.current = b, X(b);
      }
      if (p && v.activeCanvasId) {
        const b = v.canvasList.find(
          (k) => k.id === v.activeCanvasId
        );
        let N = O.current[String(v.activeCanvasId)];
        if (!N) {
          const k = await cs({
            projectId: o,
            canvasId: v.activeCanvasId
          });
          N = xo(
            No(k.canvas, Oe),
            k.assets
          );
          const A = {
            ...O.current,
            [String(N.id)]: N
          };
          O.current = A, X(A), d(
            (z) => z && {
              ...z,
              assets: So(z.assets, k.assets),
              canvasList: v.canvasList
            }
          );
        }
        yn(N), h.current = N.id, y(N.id), C.current = b?.assetCateId || N.assetCateId, w(b?.assetCateId || N.assetCateId), ko(N.id), Me(), a && tt(
          o,
          a,
          O.current,
          "recovery",
          { canvasId: N.id }
        );
      }
      ts(C.current), nr();
    } catch (p) {
      throw r(p instanceof Error ? p.message : "删除画布失败"), p;
    } finally {
      ie();
    }
  }
  async function ss(l) {
    if (!me(C.current))
      throw new Error("正在切换画布，请稍后重试");
    try {
      if (!await he())
        throw new Error("当前画布保存失败，未恢复画布");
      const p = await h_({ projectId: o, canvasId: l });
      if (!p.canvas?.id)
        throw new Error("恢复后的画布数据为空");
      let g = p.canvas, v = [], b = p.canvasList, N = "";
      try {
        const z = await cs({
          projectId: o,
          canvasId: p.canvas.id
        });
        g = z.canvas, v = z.assets, z.canvasList.length > 0 && (b = z.canvasList);
      } catch (z) {
        N = z instanceof Error ? `画布已恢复，但资产加载失败：${z.message}` : "画布已恢复，但资产加载失败，请刷新页面";
      }
      const k = xo(
        No(g, Oe),
        v
      ), A = {
        ...O.current,
        [String(k.id)]: k
      };
      O.current = A, X(A), yn(k), d(
        (z) => z && {
          ...z,
          assets: So(z.assets, v),
          canvasList: b,
          initialCanvasId: k.id,
          initialAssetCateId: k.assetCateId
        }
      ), h.current = k.id, y(k.id), C.current = k.assetCateId, w(k.assetCateId), ko(k.id), V(
        (z) => z.filter((ce) => ce.id !== k.id)
      ), ve(!1), Me(), nr(), a && tt(o, a, A, "recovery", {
        canvasId: k.id
      }), N && r(N);
    } catch (p) {
      throw r(p instanceof Error ? p.message : "恢复画布失败"), p;
    } finally {
      ie();
    }
  }
  function nr() {
    const l = Number(a?.project.team_id || 0);
    Ay(l > 0 ? { teamID: l } : void 0);
  }
  function rr(l) {
    kn((p) => ({
      nodeId: l,
      nonce: (p?.nonce || 0) + 1
    }));
  }
  const si = E((l) => {
    kn((p) => !p || p.nodeId !== l.nodeId || p.nonce !== l.nonce ? p : null);
  }, []);
  async function wo(l, p, g, v, b = {}) {
    const N = qt.current?.signal, k = JSON.stringify([
      l,
      b.canvasId || 0,
      v,
      v === "active" ? [] : [...new Set(b.runIds || [])].sort((z, ce) => z - ce)
    ]), A = Wo.current;
    if (!(N?.aborted || A.has(k))) {
      A.add(k);
      try {
        const z = b.canvasId ? g[String(b.canvasId)] : void 0, ce = z ? et.current.filter(
          (wt) => yi(wt, z)
        ) : et.current, ae = v === "active" ? eS(ce) : [], re = [...new Set(
          (b.runIds?.length ? b.runIds : [
            ...ae,
            ...ce.filter((wt) => wt.detailsPending)
          ].map((wt) => Number(wt.run_id || 0))).filter((wt) => wt > 0)
        )];
        if (v === "active" && re.length === 0) return;
        const J = {
          projectId: l,
          scope: v,
          canvasId: b.canvasId,
          runIds: re,
          summaryOnly: !0
        };
        let _e;
        if (v === "recovery" && re.length === 0) {
          const wt = await Ei({ ...J, limit: 50 }), Km = await Ia(
            { ...J, scope: "active" },
            N
          );
          _e = Da(
            fs(wt.items),
            fs(Km)
          );
        } else
          _e = fs(
            await Ia(J, N)
          );
        const Ne = oS(
          _e,
          ce,
          v === "recovery" ? g : void 0
        );
        if (Ne.length === 0 || N?.aborted) return;
        const _t = new Set(Ne);
        is(
          l,
          _e.filter((wt) => _t.has(Number(wt.run_id || 0))).map((wt) => ({ ...wt, detailsPending: !0 })),
          g,
          p
        );
        const lt = fs(
          await Ia(
            { ...J, runIds: Ne, summaryOnly: !1 },
            N
          )
        );
        if (N?.aborted) return;
        is(
          l,
          lt,
          g,
          p
        );
      } catch {
      } finally {
        A.delete(k);
      }
    }
  }
  function is(l, p, g, v) {
    const b = Da(
      et.current,
      p
    );
    et.current = b, ln(b);
    const N = new Map(b.map((A) => [Tt(A), A])), k = p.map((A) => N.get(Tt(A))).filter((A) => !!A);
    for (const A of Object.values(g))
      yo(k, A, v);
    for (const A of k)
      kr.current.publish(l, A);
  }
  async function or(l, p = 0) {
    const g = h.current, v = qt.current?.signal;
    if (fn.current || v?.aborted) return;
    const b = {}, N = () => !v?.aborted && h.current === g && fn.current === b, k = Gt.current[p] || 0;
    fn.current = b, Ir(!0), vr("");
    try {
      const A = await Ei({
        projectId: l,
        canvasId: g,
        scope: "history",
        beforeId: k,
        limit: 20
      });
      if (!N()) return;
      Ve(
        fs(A.items)
      ), Nr(p + 1), Wn(A.hasMore);
      const z = Gt.current.slice(0, p + 1);
      A.hasMore && A.beforeId > 0 && (z[p + 1] = A.beforeId), Gt.current = z;
    } catch (A) {
      if (!N()) return;
      vr(
        A instanceof Error ? A.message : "读取画布运行记录失败"
      );
    } finally {
      N() && (fn.current = null, Ir(!1));
    }
  }
  const bo = de(
    () => Yp(
      Dt.filter(
        (l) => yi(l, Q)
      )
    ),
    [Q, Dt]
  ), ii = bo.length > 0, kd = ii || Dt.some(
    (l) => l.detailsPending && yi(l, Q)
  ), gm = ii || $p(ro);
  async function Rd(l) {
    const p = !l, g = h.current, v = O.current[String(g)], b = B(g).consumerSignal, N = () => !b.aborted && h.current === g;
    if (p && (uo || Hn.size > 0) || !p && l?.some(
      (A) => Hn.has(Tt(A))
    ))
      return;
    let k = [];
    p && Ct(!0);
    try {
      let A = l || [], z = 0, ce = A.length;
      if (p) {
        const J = await C_(o, g);
        A = J.items.map(lr), z = J.failedCount, ce = J.count;
      } else
        A = tS(A);
      if (ce === 0)
        return;
      p || (k = A.map(Tt), ye((_e) => {
        const Ne = new Set(_e);
        for (const _t of k)
          Ne.add(_t);
        return Ne;
      }), A = (await Promise.allSettled(
        A.map(
          (_e) => Nf({
            projectId: o,
            runId: Number(_e.run_id || 0),
            requestId: String(_e.request_id || "")
          })
        )
      )).flatMap((_e, Ne) => {
        if (_e.status === "rejected")
          return z += 1, [];
        const _t = lr(_e.value);
        return [
          {
            ...A[Ne],
            status: _t.status,
            error: _t.error
          }
        ];
      }));
      const ae = nS(A), re = A.filter((J) => J.status === "canceled");
      if (ae.size > 0) {
        const J = (/* @__PURE__ */ new Date()).toISOString(), _e = (_t) => _t.map((lt) => {
          const wt = rS(ae, lt);
          return wt ? { ...lt, status: wt, updated_at: J } : lt;
        }), Ne = _e(et.current);
        et.current = Ne, ln(Ne), N() && Ve(_e);
      }
      if (v && a)
        for (const J of re)
          Ad(
            { ...J, canvas_id: g },
            v,
            a,
            []
          );
      z > 0 && N() && r(
        z === ce ? "停止运行失败，请稍后重试" : `${z} 个运行停止失败，请稍后重试`
      ), co && N() && or(
        o,
        Math.max(0, Gn - 1)
      ), window.setTimeout(() => {
        N() && pn.current?.();
      }, 0);
    } catch (A) {
      N() && r(
        A instanceof Error ? A.message : "停止画布运行失败"
      );
    } finally {
      k.length > 0 && ye((A) => {
        const z = new Set(A);
        for (const ce of k)
          z.delete(ce);
        return z;
      }), p && Ct(!1);
    }
  }
  function ym() {
    Qo({
      title: "停止当前画布的所有运行？",
      description: "只停止当前画布。停止后不会再提交后续任务，正在生成的内容会尝试取消；其他画布和已经完成或计费的任务不受影响。",
      confirmText: "停止全部",
      tone: "danger",
      onConfirm: () => Rd()
    });
  }
  function xd(l) {
    Qo({
      title: "停止这次运行？",
      description: "停止后不会再提交这次运行的后续任务，正在生成的内容会尝试取消。",
      confirmText: "停止运行",
      tone: "danger",
      onConfirm: () => Rd([l])
    });
  }
  pn.current = a ? () => tt(
    o,
    a,
    O.current,
    "active",
    { canvasId: h.current }
  ) : null, ue(() => {
    if (!a || !kd)
      return;
    let l = !1, p = !1, g;
    const v = async () => {
      if (!(l || p)) {
        window.clearTimeout(g), p = !0;
        try {
          await pn.current?.();
        } finally {
          p = !1, l || (g = window.setTimeout(
            v,
            document.hidden ? 15e3 : fc
          ));
        }
      }
    }, b = () => {
      document.hidden || v();
    };
    return v(), window.addEventListener("online", b), window.addEventListener("focus", b), document.addEventListener("visibilitychange", b), () => {
      l = !0, window.clearTimeout(g), window.removeEventListener("online", b), window.removeEventListener("focus", b), document.removeEventListener("visibilitychange", b);
    };
  }, [u, kd, o, a]), ue(() => {
    const l = lo.current, p = fo.current, g = [];
    if (a)
      for (const b of bo) {
        const N = b.run, k = String(N.request_id || "").trim();
        !k || po.has(k) || g.push({
          key: `${o}:${k}`,
          canvasId: Number(N.canvas_id || h.current),
          requestId: k,
          run: N,
          managedNodeIds: b.managedNodeIds
        });
      }
    const v = new Set(g.map((b) => b.key));
    for (const [b, N] of l)
      v.has(b) || (N.controller.abort(), l.delete(b), p.delete(b));
    for (const b of g) {
      const N = l.get(b.key);
      if (N) {
        N.managedNodeIds = b.managedNodeIds;
        for (const ae of mc(b.run))
          N.finishedNodeIds.add(ae);
        continue;
      }
      const k = new AbortController(), A = {
        controller: k,
        managedNodeIds: b.managedNodeIds,
        finishedNodeIds: mc(b.run)
      };
      l.set(b.key, A);
      const z = {
        ...B(b.canvasId),
        canUpdateNode: (ae) => !k.signal.aborted && A.managedNodeIds.has(ae) && !A.finishedNodeIds.has(ae) && Ea(
          et.current,
          b.canvasId,
          b.run,
          ae
        )
      };
      (async () => {
        for (; !k.signal.aborted; ) {
          try {
            await ed({
              projectId: o,
              requestId: b.requestId,
              lastId: p.get(b.key) || "0-0",
              signal: k.signal,
              onFrame: (ae) => {
                k.signal.aborted || h.current !== b.canvasId || (ae.stream_id && p.set(b.key, ae.stream_id), vs(z, A.managedNodeIds, !1), GN(
                  z,
                  ae,
                  A.managedNodeIds,
                  A.finishedNodeIds
                ));
              }
            });
            return;
          } catch {
            if (k.signal.aborted) return;
          }
          vs(z, A.managedNodeIds, !0), await Kp(fc, k.signal);
        }
      })().catch(() => {
      });
    }
  }, [
    po,
    o,
    bo,
    B,
    a
  ]), ue(
    () => () => {
      for (const l of lo.current.values())
        l.controller.abort();
      lo.current.clear(), fo.current.clear();
    },
    []
  );
  function hm(l, p, g) {
    const v = l.filter(
      (A) => yi(A, p)
    );
    if (v.length === 0)
      return;
    const b = new Map(p.nodes.map((A) => [A.id, A])), N = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set();
    for (const A of v) {
      const z = new Set(
        Xr(A).filter((re) => k.has(re) ? !1 : (k.add(re), !0))
      );
      if (z.size === 0)
        continue;
      const ae = gc(
        A,
        p
      ) ? [] : (A.node_results || []).filter((re) => {
        const J = re.node_key;
        return !J || !z.has(J) || N.has(J) || Xa(b.get(J), A, re) ? !1 : (N.add(J), !0);
      });
      Ad(
        A,
        p,
        g,
        ae,
        z
      );
    }
  }
  function Ad(l, p, g, v = l.node_results || [], b) {
    const N = aS(l, p.nodes);
    if (!N)
      return;
    const k = ba(g, p.assetCateId);
    if (!k)
      return;
    const A = {
      projectId: o,
      canvasId: p.id,
      assetCate: k,
      space: g,
      startNode: N,
      nodes: p.nodes,
      edges: p.edges,
      viewport: p.viewport,
      onNodeResult: (z, ce) => Or(p.id, z, ce),
      onAssetCreated: xt,
      ...B(p.id),
      consumerSignal: qt.current?.signal,
      requestFlowFeedback: os,
      requestNodeTitle: (z, ce) => ns(p.id, z, ce),
      canvasRun: l,
      appliedResultKeys: Cr.current,
      ownsNodeResult: (z, ce) => Ea(
        et.current,
        p.id,
        z,
        ce
      )
    };
    Qp(A, v), Wp(A, v), _m(A, l, N), Ss(A, l, b), wd(A, l, b);
  }
  function _m(l, p, g) {
    p.single_node || String(p.status || "").trim().toLowerCase() !== "success" || !bn(g.resultOutput) || We(
      l.canvasId,
      (v) => Ra({
        canvas: v,
        sourceNodeIds: [g.id],
        assetCate: l.assetCate,
        powers: Oe
      })
    );
  }
  function Io(l, p, g) {
    if (!se)
      return null;
    const v = Zi(
      l,
      se,
      Q.nodes.length,
      p,
      g
    ), b = a ? ba(a, hc(v) || se.id) : se;
    l === "asset" && (v.cardinality = b.cardinality);
    const N = l === "asset" && g?.replaceSingleAssetNode ? hc(v) || Number(b.id || 0) : 0, k = N ? Wu(
      Q.nodes,
      Q.edges,
      N,
      g?.connectFromNodeId
    ) : null, A = k ? Hu(
      Q.nodes,
      Q.edges,
      N,
      g?.connectFromNodeId,
      k.id
    ) : /* @__PURE__ */ new Set(), z = k?.id || v.id, ce = mt?.connection;
    if (Et((ae) => {
      let re = ae.edges;
      const J = N ? Wu(
        ae.nodes,
        ae.edges,
        N,
        g?.connectFromNodeId
      ) : null;
      if (J) {
        const Ne = Hu(
          ae.nodes,
          ae.edges,
          N,
          g?.connectFromNodeId,
          J.id
        );
        if (re = ae.edges.filter(
          (lt) => !Ne.has(lt.from) && !Ne.has(lt.to)
        ), ce) {
          const lt = Gu(
            ce,
            J.id
          );
          re = En(re, lt.source, lt.target);
        } else g?.connectFromNodeId ? re = En(
          re,
          g.connectFromNodeId || "",
          J.id
        ) : g?.connectToNodeId && (re = En(
          re,
          J.id,
          g.connectToNodeId || ""
        ));
        const _t = ae.nodes.filter((lt) => !Ne.has(lt.id)).map(
          (lt) => lt.id === J.id ? Fa(lt, v) : lt
        );
        return {
          ...ae,
          nodes: _t,
          edges: sn(_t, re)
        };
      }
      if (ce) {
        const Ne = Gu(ce, v.id);
        re = En(re, Ne.source, Ne.target);
      } else g?.connectFromNodeId ? re = En(
        re,
        g.connectFromNodeId || "",
        v.id
      ) : g?.connectToNodeId && (re = En(re, v.id, g.connectToNodeId || ""));
      const _e = Ua(
        [...ae.nodes, v],
        v.id,
        { x: v.x, y: v.y }
      );
      return {
        ...ae,
        nodes: _e,
        edges: sn(_e, re)
      };
    }), k) {
      const ae = Fa(k, v);
      Vt((re) => {
        const J = { ...re };
        for (const _e of A)
          delete J[_e];
        return J[k.id] = {
          ...J[k.id] || {},
          ...xS(ae)
        }, J;
      });
    }
    return g?.selectCreated !== !1 && (ee([z]), rr(z)), fe("create"), ge(null), k ? Fa(k, v) : v;
  }
  function wm(l, p) {
    if (!se)
      return;
    if (ku(Q.nodes).has(l.id)) {
      r("脚本托管节点不能复制，请在分镜脚本中修改结构");
      return;
    }
    const g = SS(
      l,
      se.id,
      Q.nodes.length,
      p
    );
    Et((v) => {
      const b = Ua(
        [...v.nodes, g],
        g.id,
        { x: g.x, y: g.y }
      );
      return {
        ...v,
        nodes: b,
        edges: sn(b, v.edges)
      };
    }), Vt((v) => {
      const b = v[l.id];
      return b ? { ...v, [g.id]: b } : v;
    }), ee([g.id]), rr(g.id), ge(null);
  }
  function bm(l, p = {}) {
    const g = zp(
      Q.nodes,
      l
    );
    if (g.size === 0)
      return;
    const v = ku(Q.nodes);
    if (!p.allowStoryboardFrame && [...g].some((b) => v.has(b))) {
      r(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      );
      return;
    }
    Et((b) => {
      const N = fh(
        b.nodes,
        g
      ).filter((k) => !g.has(k.id));
      return {
        ...b,
        nodes: N,
        edges: sn(N, b.edges)
      };
    }), Vt(
      (b) => $u(b, g)
    ), Nn((b) => $u(b, g)), ee([]), kn(
      (b) => b && g.has(b.nodeId) ? null : b
    ), jn(
      (b) => b && g.has(b.id) ? null : b
    ), Mt(
      (b) => b && (g.has(b.id) || Qe && g.has(Qe.id)) ? null : b
    ), Pe(
      (b) => b && g.has(b.nodeId) ? null : b
    ), Ot(
      (b) => g.has(b) ? "" : b
    ), Ue.current && g.has(Ue.current.id) && (Ue.current = null);
  }
  function Td(l, p) {
    Io("asset", p, { asset: l });
  }
  function Im(l, p, g) {
    if (!l)
      return;
    const v = Q.nodes.find((N) => N.id === l) || (g?.id === l ? g : Ue.current?.id === l ? Ue.current : null);
    if (!v)
      return;
    const b = Vi(p.version?.content) || jt(p.version?.content);
    dt(
      l,
      Qr(
        {
          ...v,
          kind: p.kind || se.kind,
          assetCateId: Number(p.asset_cate_id || se.id || 0)
        },
        {
          output: b,
          asset: p
        },
        "引用资产"
      )
    ), vm(l, b);
  }
  async function vm(l, p) {
    if (!l)
      return;
    const g = Q.edges.filter((v) => v.from === l).map((v) => Q.nodes.find((b) => b.id === v.to)).filter(
      (v) => !!v && Fo(v, "display")
    );
    if (g.length !== 0)
      for (const v of g)
        dt(
          v.id,
          Qr(v, { output: p }, "展示引用结果")
        );
  }
  function Md(l, p = Go, g = Ue.current) {
    if (!p) {
      Td(l);
      return;
    }
    if (!(Q.nodes.find((b) => b.id === p) || (g?.id === p ? g : Ue.current?.id === p ? Ue.current : null))) {
      Td(l), Ot(""), Ue.current = null;
      return;
    }
    Im(p, l, g);
  }
  async function Nm(l, p = Go, g = Ue.current) {
    if (l.libraryType !== "material") {
      Md(
        ir(l),
        p,
        g
      );
      return;
    }
    if (!ci(l)) {
      r("该素材没有可用内容，无法引用");
      return;
    }
    const v = Number(se?.id || 0), b = p || `new-${Date.now()}`;
    try {
      const N = await nu({
        projectId: o,
        canvasId: Q.id,
        assetCateId: v,
        name: l.name || "素材库资产",
        kind: l.kind,
        content: l.version?.content,
        nodeKey: p,
        requestId: `official-material:${l.id}:${b}`
      }), k = ir(N);
      xt(k), Md(k, p, g);
    } catch (N) {
      r(
        N instanceof Error ? N.message : "引用素材库资产失败"
      );
    }
  }
  function Sm() {
    wr(!1), Ot(""), Ue.current = null;
  }
  function Cm(l, p) {
    Au(), Rn({ nodeId: l, frameIndex: p }), ge(null), fe("create");
  }
  async function km(l) {
    const p = Ut;
    if (!p || Yn.current)
      return;
    const g = je.nodes.find((A) => A.id === p.nodeId);
    if (!g) {
      r("宫格节点不存在");
      return;
    }
    const v = l.filter(
      (A) => A.kind === "image" && ci(A)
    ), b = Number.isInteger(p.frameIndex);
    if (b && v.length === 0) {
      r("请选择一张图片");
      return;
    }
    if (!b && v.length === 0) {
      r("请至少选择一张图片");
      return;
    }
    if (!b && v.length > Kr) {
      r(`一次最多导入 ${Kr} 张图片`);
      return;
    }
    const N = Bc([
      g.asset?.version?.content,
      g.resultOutput
    ]), k = b ? EN(
      N,
      Number(p.frameIndex),
      v[0],
      g.title
    ) : jp(
      v,
      N,
      g.title
    );
    if (!k) {
      r("当前宫格内容不可编辑");
      return;
    }
    Yn.current = !0;
    try {
      const A = Number(g.asset?.id || 0), z = Number(
        g.asset?.version?.id || g.asset?.version_id || 0
      ), ce = A > 0 && z > 0 ? await R_({
        projectId: o,
        assetId: A,
        versionId: z,
        content: k
      }) : await nu({
        projectId: o,
        canvasId: Q.id,
        assetCateId: Number(g.assetCateId || se?.id || 0),
        name: k.title || g.title || "宫格图片",
        kind: "collection",
        content: k,
        nodeKey: g.id,
        requestId: `storyboard-grid-import:${g.id}:${Date.now()}`
      }), ae = dr(
        ce,
        g.asset
      );
      xt(ae), dt(
        g.id,
        Is(g, ae)
      );
    } catch (A) {
      r(
        A instanceof Error ? A.message : "导入宫格图片失败"
      );
    } finally {
      Yn.current = !1;
    }
  }
  function Rm(l, p) {
    Io("power", p, { power: l });
  }
  function xm(l = "") {
    Pr(l);
  }
  async function ai(l, p) {
    const { uploadSpaceFiles: g } = await import("./space-upload-1ncl2HCu.js").then((N) => N.c), v = await g({
      projectID: o,
      canvasID: Q.id,
      teamID: Number(a?.project.team_id || 0),
      files: l,
      onProgress: p?.onProgress
    }), b = [];
    for (const N of v) {
      const k = ir(N.asset);
      k.id && xt(k);
      const A = xy(N.asset);
      A.id && b.push(A);
    }
    return b;
  }
  function Am(l, p) {
    Io("agent", p, { role: l });
  }
  function Tm(l, p) {
    Io("flow", p, { flow: l });
  }
  function Mm(l) {
    Io("group", l);
  }
  function Dm(l, p) {
    const g = Io("function", p, { functionOption: l });
    g && Fo(g, "import") && (Ue.current = g, xm(g?.id || ""));
  }
  function Em(l, p, g) {
    tv(), fe("create"), ge({
      x: l.x,
      y: l.y,
      position: p,
      connection: g
    }), Ar();
  }
  function Pm() {
    vn(nn === "dark" ? "light" : "dark");
  }
  const Om = nt((l) => {
    ee(l), ge(null);
  }), Fm = nt(Em), Bm = nt(wm), zm = nt(bm), $m = nt(
    (l) => Et((p) => ({ ...p, nodes: l }))
  ), jm = nt(
    (l) => Et((p) => ({ ...p, edges: l }))
  ), Lm = nt(
    (l) => Et((p) => p.nodes.length === 0 && p.edges.length === 0 ? p : { ...p, viewport: l })
  ), Vm = nt(
    Cm
  );
  if (Ae)
    return null;
  if (Un || !a || !se)
    return /* @__PURE__ */ f("main", { className: `ws-page is-${nn} ws-loading-screen`, children: /* @__PURE__ */ f("div", { className: "ws-loading-card ws-error-card", children: /* @__PURE__ */ f("span", { children: Un || "创作空间不存在" }) }) });
  const {
    launcherVisible: Um,
    panelVisible: Dd
  } = Tv(a.assistant.available, be);
  return /* @__PURE__ */ L(
    "main",
    {
      ref: dn,
      className: `ws-page is-${nn} is-${H}-view ${Dd ? "is-assistant-open" : ""} ${Ee ? "is-assistant-expanded" : ""}`,
      style: {
        "--ws-assistant-width": `${xe}px`
      },
      children: [
        /* @__PURE__ */ f(
          sr,
          {
            message: n,
            onDismiss: () => r(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(
          AN,
          {
            activeCate: se,
            mode: H,
            interactive: H === "create",
            canvasCount: es.length,
            activeCanvasName: Q.name,
            canvasManagerOpen: we,
            onOpenCanvasManager: Qn,
            nodes: je.nodes,
            edges: je.edges,
            viewport: Q.viewport,
            canvasId: Q.id,
            selectedNodeId: Z,
            selectedNodeIds: U,
            onSelectNodes: Om,
            onOpenNodeMenu: Fm,
            onCopyNode: Bm,
            onDeleteNodes: zm,
            onShowNodeDetail: ho,
            detailNodeId: Qe?.id || "",
            onDetailNodeProjection: ma,
            onConfirmStoryboard: ri,
            onNodesCommit: $m,
            onEdgesCommit: jm,
            onConnectedMediaEdgeRemove: ni,
            onViewportCommit: Lm,
            focusNodeRequest: qo,
            onFocusNodeRequestConsumed: si,
            projectId: o,
            space: a,
            canvasReferenceItems: Er,
            catalogCache: c,
            runningNodes: ro,
            onNodeResult: dt,
            onNodeDraftChange: ti,
            onAssetCreated: xt,
            canvasRunRecords: Dt,
            stoppingCanvasRunKeys: Hn,
            onStopCanvasRun: xd,
            onRunStoryboardFrame: M,
            onRunFunctionNode: te,
            onRunBackendNode: Y,
            onOpenStoryboardGridImport: Vm,
            onClearFeedbackRecords: Fr,
            requestConfirm: Qo,
            onOpenFeedbackRecord: R
          },
          Q.id
        ),
        /* @__PURE__ */ f(
          CN,
          {
            space: a,
            cates: Xs,
            activeCate: se,
            canvases: es,
            activeCanvas: Q,
            saveStatus: Zo[String(Q.id)] || "saved",
            hasAssetCates: Zs,
            loadingCateId: S,
            onBack: () => {
              Mr(() => t({ to: "/bot/work" }));
            },
            onSelectCate: At,
            onRefresh: () => {
              Mr(Jo);
            },
            onOpenRunHistory: () => {
              qn(!0), or(o, 0);
            },
            onRunHistoryIntent: av,
            canStopRuns: gm,
            stoppingRuns: uo || Hn.size > 0,
            onStopRuns: ym,
            theme: nn,
            onToggleTheme: Pm
          }
        ),
        we ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载画布管理", overlay: !0 }),
            children: /* @__PURE__ */ f(
              dv,
              {
                errorFeedback: /* @__PURE__ */ f(
                  sr,
                  {
                    message: n,
                    onDismiss: () => r("")
                  }
                ),
                open: !0,
                canvases: es,
                deletedCanvases: D,
                deletedLoading: G,
                activeCanvasId: Q.id,
                disabled: S != null,
                onClose: () => ve(!1),
                onSelect: ut,
                onCreate: ht,
                onRename: Pt,
                onReorder: Wt,
                onDelete: Mn,
                onRestore: ss
              }
            )
          }
        ) : null,
        Dd ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(
              "aside",
              {
                className: "ws-assistant-panel",
                style: {
                  "--ws-assistant-panel-width": `${xe}px`
                },
                children: /* @__PURE__ */ f(ze, { label: "正在加载画布助手" })
              }
            ),
            children: /* @__PURE__ */ f(
              fv,
              {
                assistant: a.assistant,
                project: a.project,
                team: a.team,
                activeAssetCateID: se.id,
                activeCanvas: Q,
                selectedNodes: fa,
                width: xe,
                expanded: Ee,
                onWidthChange: pa,
                onToggleExpanded: () => Le((l) => !l),
                onClose: () => Qs(!1),
                onFlushCanvas: yt,
                onCanvasChanged: Js,
                onUploadAssets: ai
              }
            )
          }
        ) : null,
        Um ? /* @__PURE__ */ f(
          Rv,
          {
            assistantName: a.assistant.name,
            onIntent: pv,
            onOpen: () => Qs(!0)
          }
        ) : null,
        co ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载运行历史", overlay: !0 }),
            children: /* @__PURE__ */ f(
              iv,
              {
                open: !0,
                runs: Kn,
                loading: St,
                error: it,
                page: Gn,
                hasNextPage: Ge,
                onOpenChange: qn,
                onRefresh: () => or(o, 0),
                onPreviousPage: () => or(
                  o,
                  Math.max(0, Gn - 2)
                ),
                onNextPage: () => or(o, Gn),
                stoppingRunKeys: Hn,
                onStopRun: xd,
                onLocateRun: (l) => {
                  const p = String(l.start_node_id || "");
                  if (!p)
                    return;
                  qn(!1), (Number(l.canvas_id || 0) ? ut(Number(l.canvas_id)) : At(Number(l.asset_cate_id || I))).then((v) => {
                    v && window.requestAnimationFrame(() => rr(p));
                  });
                }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ f(
          xN,
          {
            mode: H,
            onModeIntent: (l) => {
              l === "result" && rv();
            },
            onSelectMode: (l) => {
              fe(l), ge(null);
            }
          }
        ),
        un ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载资产选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              xu,
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
                  canvasID: Q.id
                },
                confirmSelection: !0,
                contentMode: "full",
                validateAsset: (l) => ci(l) ? "" : "该资产没有可用内容，无法引用。",
                onUpload: ai,
                onClose: Sm,
                onConfirm: (l) => {
                  const p = l[0];
                  p && Nm(p);
                }
              }
            )
          }
        ) : null,
        Ut ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载图片选择器", overlay: !0 }),
            children: /* @__PURE__ */ f(
              xu,
              {
                notificationMode: "inline",
                open: !0,
                teamID: a.project.team_id,
                scopeProjectID: a.project.id,
                title: Number.isInteger(Ut.frameIndex) ? "替换宫格图片" : "导入宫格图片",
                description: Number.isInteger(Ut.frameIndex) ? "选择一张已有图片或上传本地图片。" : `选择 1-${ei} 张已有图片，或上传本地图片。`,
                initialFilters: {
                  sourceType: "project",
                  projectID: a.project.id,
                  canvasID: Q.id,
                  kind: "image"
                },
                allowedKinds: ["image"],
                multiple: !Number.isInteger(Ut.frameIndex),
                maxSelection: ei,
                confirmSelection: !0,
                contentMode: "full",
                uploadAccept: "image/*",
                validateAsset: (l) => l.kind !== "image" ? "请选择图片资产。" : ci(l) ? "" : "该图片没有可用内容，无法导入。",
                onUpload: ai,
                onClose: () => Rn(null),
                onConfirm: (l) => {
                  km(l);
                }
              }
            )
          }
        ) : null,
        H === "result" ? /* @__PURE__ */ f("div", { className: "ws-workspace-overlay ws-asset-workspace", children: /* @__PURE__ */ f(Be, { fallback: /* @__PURE__ */ f(ze, { label: "正在加载资产" }), children: /* @__PURE__ */ f(
          nv,
          {
            notificationMode: "inline",
            teamID: a.project.team_id,
            scopeProjectID: a.project.id,
            scopeCanvasID: Q.id,
            onLocalUpload: ai,
            initialFilters: {
              sourceType: "project",
              projectID: a.project.id,
              canvasID: Q.id,
              assetCateID: Zs ? se.id : 0
            },
            headerAction: /* @__PURE__ */ f(pt, { label: "关闭资产", children: /* @__PURE__ */ L("button", { type: "button", onClick: () => fe("create"), children: [
              /* @__PURE__ */ f(Nc, { "aria-hidden": "true" }),
              /* @__PURE__ */ f("span", { className: "sr-only", children: "关闭资产" })
            ] }) })
          }
        ) }) }) : null,
        Kt ? /* @__PURE__ */ f(
          aC,
          {
            errorFeedback: /* @__PURE__ */ f(
              sr,
              {
                message: n,
                onDismiss: () => r("")
              }
            ),
            prompt: Kt.prompt,
            running: Sr,
            readonly: Xw(
              Kt,
              je.nodes,
              Rt.current
            ),
            history: qr(
              je.nodes.find(
                (l) => l.id === Kt.node.id
              ) || Kt.node
            ),
            activeRecordId: Kt.recordId,
            onSelectRecord: (l) => {
              const p = je.nodes.find(
                (g) => g.id === Kt.node.id
              ) || Kt.node;
              at({
                node: p,
                recordId: l.id,
                prompt: {
                  ...l.prompt,
                  values: l.values || l.prompt.values || {}
                }
              });
            },
            onClose: _,
            onSubmit: m
          },
          `${Kt.node.id}-${Kt.recordId}`
        ) : null,
        Cn ? /* @__PURE__ */ f(
          TN,
          {
            onError: r,
            request: Cn,
            onClose: () => Ko(null)
          }
        ) : null,
        Ft && rs && !Es(rs) ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载分镜确认", overlay: !0 }),
            children: /* @__PURE__ */ f(
              vv,
              {
                errorFeedback: /* @__PURE__ */ f(
                  sr,
                  {
                    message: n,
                    onDismiss: () => r("")
                  }
                ),
                storyboard: rs,
                lipSyncAvailable: la,
                submitting: Vn,
                portalContainer: dn.current,
                onClose: () => st(null),
                onEditIssue: (l) => {
                  st(null), ho(Ft, {
                    shotId: l.shotId,
                    materialId: l.materialId
                  });
                },
                onConfirm: ga
              }
            )
          }
        ) : null,
        mt ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载节点菜单", overlay: !0 }),
            children: /* @__PURE__ */ f(
              ev,
              {
                menu: mt,
                flows: da,
                powers: ct,
                powerCategories: Hs,
                roles: ua,
                onClose: () => ge(null),
                onSelectFlow: (l) => Tm(l, mt.position),
                onSelectFunction: (l) => Dm(l, mt.position),
                onSelectGroup: () => Mm(mt.position),
                onSelectRole: (l) => Am(l, mt.position),
                onSelectPower: (l) => Rm(l, mt.position)
              }
            )
          }
        ) : null,
        [Qe, Ln].map((l, p) => l ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载节点详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              yv,
              {
                layer: p ? "nested" : "default",
                projectId: a.project.id,
                teamId: a.team.id,
                assetCateId: Number(
                  l.assetCateId || l.asset?.asset_cate_id || se?.id || 0
                ),
                node: l,
                readonly: H !== "create",
                storyboardFocus: p ? void 0 : Gs,
                storyboardInitialSectionId: p ? void 0 : Ws,
                storyboardWorkspace: l.storyboardWorkspace,
                canvasNodes: je.nodes,
                connectedMediaReferences: nm(
                  je.nodes,
                  je.edges,
                  l.id
                ),
                canvasReferenceItems: Er.filter(
                  (g) => g.source !== "current" || g.id !== l.id
                ),
                onNodeDraftChange: (g) => {
                  g && (ti(l.id, g), Nt(
                    (v) => v?.id === l.id ? { ...v, composerDraft: g } : v
                  ));
                },
                onConnectedMediaEdgeRemove: ni,
                onRunNode: Y,
                onAssetUpdated: (g) => oi(l, g),
                onConfirmStoryboard: (g) => ri(l.id, g),
                onClose: () => {
                  Mt(null), !p && (Pe(null), jn(null), ao(void 0), Uo(void 0));
                }
              }
            )
          },
          l.id
        ) : null),
        _r ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载资产详情", overlay: !0 }),
            children: /* @__PURE__ */ f(
              ov,
              {
                notificationMode: "inline",
                teamID: a.project.team_id,
                assetID: _r.assetID,
                layer: "nested",
                onAssetChanged: ya,
                onClose: () => Pe(null)
              }
            )
          }
        ) : null
      ]
    }
  );
}
function CN({
  space: e,
  cates: t,
  activeCate: n,
  canvases: r,
  activeCanvas: s,
  saveStatus: o,
  hasAssetCates: i,
  loadingCateId: c,
  onBack: a,
  onSelectCate: d,
  onRefresh: u,
  onOpenRunHistory: y,
  onRunHistoryIntent: h,
  canStopRuns: I,
  stoppingRuns: w,
  onStopRuns: C,
  theme: S,
  onToggleTheme: x
}) {
  const T = Math.max(
    0,
    t.findIndex((U) => U.id === n.id)
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
          children: /* @__PURE__ */ f(og, { size: 18 })
        }
      ),
      /* @__PURE__ */ L("div", { className: "ws-project-copy", children: [
        /* @__PURE__ */ L("div", { className: "ws-project-title-row", children: [
          /* @__PURE__ */ f("strong", { children: e.project.name }),
          r.length > 1 ? /* @__PURE__ */ L("span", { className: "ws-project-canvas-name", children: [
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
          "--ws-cate-active": T
        },
        children: [
          /* @__PURE__ */ f("span", { className: "ws-cate-indicator" }),
          t.map((U) => /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: `ws-cate ${U.id === n.id ? "is-active" : ""}`,
              disabled: c != null,
              onClick: () => {
                d(U.id);
              },
              children: [
                c === U.id ? /* @__PURE__ */ f(ur, { size: 12, className: "animate-spin" }) : null,
                /* @__PURE__ */ f("span", { className: "ws-cate-name", children: U.name })
              ]
            },
            U.id
          ))
        ]
      }
    ) : null,
    /* @__PURE__ */ L("div", { className: `ws-top-actions ${I ? "has-running" : ""}`, children: [
      /* @__PURE__ */ f(kN, { status: o }),
      I ? /* @__PURE__ */ f(pt, { label: "停止画布中所有运行中的任务", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action ws-stop-action",
          disabled: w,
          onClick: C,
          children: [
            w ? /* @__PURE__ */ f(ur, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ f(sg, { size: 13, fill: "currentColor" }),
            w ? "停止中" : "停止全部"
          ]
        }
      ) }) : null,
      /* @__PURE__ */ f(pt, { label: "查看画布运行记录", children: /* @__PURE__ */ L(
        "button",
        {
          type: "button",
          className: "ws-action",
          onPointerEnter: h,
          onFocus: h,
          onClick: y,
          children: [
            /* @__PURE__ */ f(ig, { size: 15 }),
            "运行记录"
          ]
        }
      ) }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: x, children: [
        S === "dark" ? /* @__PURE__ */ f(ag, { size: 15 }) : /* @__PURE__ */ f(cg, { size: 15 }),
        S === "dark" ? "亮色" : "暗色"
      ] }),
      /* @__PURE__ */ L("button", { type: "button", className: "ws-action", onClick: u, children: [
        /* @__PURE__ */ f(kc, { size: 15 }),
        "刷新"
      ] })
    ] })
  ] });
}
function kN({ status: e }) {
  const t = e === "saving" ? "保存中" : e === "error" ? "保存失败，正在重试" : e === "dirty" ? "未保存" : "已保存";
  return /* @__PURE__ */ f(pt, { label: t, children: /* @__PURE__ */ L("span", { className: `ws-save-indicator is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ f(ur, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ f(il, { size: 14 }),
    t
  ] }) });
}
const RN = [
  { key: "create", label: "创作", icon: dg },
  { key: "result", label: "资产", icon: ug }
];
function xN({
  mode: e,
  onModeIntent: t,
  onSelectMode: n
}) {
  return /* @__PURE__ */ f("nav", { className: "ws-dock", "aria-label": "画布视角", children: RN.map((r) => {
    const s = r.icon;
    return /* @__PURE__ */ L(
      "button",
      {
        type: "button",
        className: `ws-dock-button ${r.key === e ? "is-active" : ""}`,
        onPointerEnter: () => t(r.key),
        onFocus: () => t(r.key),
        onClick: () => n(r.key),
        children: [
          /* @__PURE__ */ f(s, { size: 20 }),
          r.label
        ]
      },
      r.key
    );
  }) });
}
const AN = Mc(function({
  activeCate: t,
  mode: n,
  interactive: r,
  canvasCount: s,
  activeCanvasName: o,
  canvasManagerOpen: i,
  onOpenCanvasManager: c,
  nodes: a,
  edges: d,
  viewport: u,
  canvasId: y,
  selectedNodeId: h,
  selectedNodeIds: I,
  onSelectNodes: w,
  onOpenNodeMenu: C,
  onCopyNode: S,
  onDeleteNodes: x,
  onShowNodeDetail: T,
  detailNodeId: U,
  onDetailNodeProjection: ee,
  onConfirmStoryboard: Z,
  onNodesCommit: oe,
  onEdgesCommit: X,
  onConnectedMediaEdgeRemove: O,
  onViewportCommit: we,
  focusNodeRequest: ve,
  onFocusNodeRequestConsumed: D,
  projectId: V,
  space: G,
  canvasReferenceItems: K,
  catalogCache: ne,
  runningNodes: H,
  onNodeResult: fe,
  onNodeDraftChange: be,
  onAssetCreated: pe,
  canvasRunRecords: Ee,
  stoppingCanvasRunKeys: Le,
  onStopCanvasRun: xe,
  onRunStoryboardFrame: In,
  onRunFunctionNode: nn,
  onRunBackendNode: vn,
  onOpenStoryboardGridImport: mt,
  onClearFeedbackRecords: ge,
  requestConfirm: Ae,
  onOpenFeedbackRecord: rn
}) {
  const [Te, ro] = q(null), [Nn, oo] = q(""), [so, Sn] = q(""), [Vo, Vt] = q(""), [Qe, jn] = q(null), [Ln, Mt] = q(null), [Nt, ot] = q(""), [st, dn] = q(null), [Vn, io] = q(() => /* @__PURE__ */ new Map()), [_r, Pe] = q(""), [Gs, ao] = q(!1), [Ws, Uo] = q(!1), [Cn, Ko] = q(1), qo = W(1), kn = W(1), un = W(null), [wr, Go] = q(null), Ot = de(
    () => new Set(I),
    [I]
  ), Ut = W(null), Rn = W(null), Un = W(!1), br = W(!1), Dt = W(!1), ln = W(null), Kn = W(!1), Ve = W(d);
  Zr(() => {
    Ve.current = d;
  }, [d]);
  const St = E((m) => {
    const _ = Lr(m);
    qo.current = _, un.current != null && typeof window < "u" && window.cancelAnimationFrame(un.current), un.current = null, kn.current = _, Ju(Ut.current, _), Ko(
      (R) => Math.abs(R - _) > 5e-3 ? _ : R
    );
  }, []), Ir = E((m) => {
    const _ = Lr(m);
    if (qo.current = _, !(Math.abs(kn.current - _) <= 5e-3) && un.current == null) {
      if (typeof window > "u") {
        kn.current = _, Ko(_);
        return;
      }
      un.current = window.requestAnimationFrame(() => {
        un.current = null;
        const R = qo.current;
        kn.current = R, Ju(Ut.current, R);
      });
    }
  }, []);
  ue(
    () => () => {
      Rn.current = null, un.current != null && typeof window < "u" && window.cancelAnimationFrame(un.current);
    },
    []
  );
  const it = E(
    (m, _ = {}) => {
      const R = Ve.current;
      Ve.current = m, X(m);
      const B = new Set(
        m.filter((M) => hn(M) === "media").map((M) => {
          const Y = Bt(M);
          return `${Y.sourceNodeId}\0${Y.targetNodeId}`;
        })
      ), F = /* @__PURE__ */ new Map();
      for (const M of R) {
        if (hn(M) !== "media")
          continue;
        const Y = Bt(M), te = `${Y.sourceNodeId}\0${Y.targetNodeId}`;
        if (B.has(te))
          continue;
        const me = F.get(Y.targetNodeId) || /* @__PURE__ */ new Set();
        me.add(Y.sourceNodeId), F.set(Y.targetNodeId, me);
      }
      const j = new Map(_.draftByNodeId);
      for (const [M, Y] of F) {
        const te = a.find((he) => he.id === M), me = te?.composerDraft;
        let ie = j.get(M) || me;
        if (!(!te || !ie)) {
          for (const he of Y)
            ie = Mi(
              ie,
              he
            );
          ie !== me ? j.set(te.id, ie) : j.delete(te.id);
        }
      }
      const le = [...j].map(([M, Y]) => ({
        nodeId: M,
        draft: Y
      }));
      le.forEach((M, Y) => {
        be(
          M.nodeId,
          M.draft,
          Y === le.length - 1 ? { save: "immediate" } : void 0
        );
      });
    },
    [a, X, be]
  ), vr = E(
    (m) => {
      const _ = Object.entries(m);
      if (_.length === 0)
        return;
      const R = new Map(_);
      let B = !1;
      const F = Ve.current.map((j) => {
        if (!R.has(j.id))
          return j;
        const le = R.get(j.id) || void 0;
        return (j.mediaUsage || void 0) === le ? j : (B = !0, { ...j, mediaUsage: le });
      });
      B && it(F);
    },
    [it]
  ), co = E(
    (m) => {
      const _ = Ve.current.filter((R) => R.id !== m);
      _.length !== Ve.current.length && (Ve.current = _, ot((R) => R === m ? "" : R), O(m));
    },
    [O]
  ), qn = E(
    (m, _) => {
      const R = Ve.current, B = R.filter((le) => {
        const M = Bt(le);
        return !(hn(le) === "media" && M.sourceNodeId === m && M.targetNodeId === _);
      });
      if (B.length !== R.length) {
        ot(""), it(B);
        return;
      }
      const F = a.find((le) => le.id === _);
      if (!F?.composerDraft)
        return;
      const j = Mi(
        F.composerDraft,
        m
      );
      j !== F.composerDraft && be(_, j, { save: "immediate" });
    },
    [it, a, be]
  ), Gn = E(
    (m, _) => {
      if (Vt(""), !r)
        return;
      const R = dw(a, m, _);
      R !== a && oe(R);
    },
    [r, a, oe]
  ), Nr = E(
    (m, _) => {
      if (Vt(""), !r)
        return;
      const R = uw(a, m, _);
      R !== a && oe(R);
    },
    [r, a, oe]
  ), Ge = W({
    onNodeResult: fe,
    onNodeDraftChange: be,
    onAssetCreated: pe,
    onRunFunctionNode: nn,
    onOpenStoryboardGridImport: mt,
    onClearFeedbackRecords: ge,
    onOpenFeedbackRecord: rn,
    onShowNodeDetail: T,
    onConfirmStoryboard: Z,
    requestConfirm: Ae,
    onRunBackendNode: vn,
    onConnectedMediaUsagesChange: vr,
    onConnectedMediaEdgeRemove: co,
    onTextParamConnectionRemove: qn,
    onNodeResizeStart: Vt,
    onNodeResizeEnd: Gn,
    onResultViewResizeEnd: Nr
  });
  Zr(() => {
    Ge.current = {
      onNodeResult: fe,
      onNodeDraftChange: be,
      onAssetCreated: pe,
      onRunFunctionNode: nn,
      onOpenStoryboardGridImport: mt,
      onClearFeedbackRecords: ge,
      onOpenFeedbackRecord: rn,
      onShowNodeDetail: T,
      onConfirmStoryboard: Z,
      requestConfirm: Ae,
      onRunBackendNode: vn,
      onConnectedMediaUsagesChange: vr,
      onConnectedMediaEdgeRemove: co,
      onTextParamConnectionRemove: qn,
      onNodeResizeStart: Vt,
      onNodeResizeEnd: Gn,
      onResultViewResizeEnd: Nr
    };
  }, [
    pe,
    ge,
    be,
    fe,
    rn,
    mt,
    vn,
    nn,
    T,
    Z,
    co,
    qn,
    Ae,
    Gn,
    Nr,
    vr
  ]);
  const Wn = de(
    () => ({
      onNodeResult: (m, _) => Ge.current.onNodeResult(m, _),
      onNodeDraftChange: (m, _, R) => Ge.current.onNodeDraftChange(m, _, R),
      onAssetCreated: (m) => Ge.current.onAssetCreated(m),
      onRunFunctionNode: (m) => Ge.current.onRunFunctionNode(m),
      onOpenStoryboardGridImport: (m, _) => Ge.current.onOpenStoryboardGridImport(m, _),
      onClearFeedbackRecords: (m) => Ge.current.onClearFeedbackRecords(m),
      onOpenFeedbackRecord: (m, _) => Ge.current.onOpenFeedbackRecord(m, _),
      onShowNodeDetail: (m, _, R) => Ge.current.onShowNodeDetail(
        m,
        _,
        R
      ),
      onConfirmStoryboard: (m) => Ge.current.onConfirmStoryboard(m),
      requestConfirm: (m) => Ge.current.requestConfirm(m),
      onRunBackendNode: (m, _) => Ge.current.onRunBackendNode(m, _),
      onConnectedMediaUsagesChange: (m) => Ge.current.onConnectedMediaUsagesChange(m),
      onConnectedMediaEdgeRemove: (m) => Ge.current.onConnectedMediaEdgeRemove(m),
      onTextParamConnectionRemove: (m, _) => Ge.current.onTextParamConnectionRemove(
        m,
        _
      ),
      onNodeResizeStart: (m) => Ge.current.onNodeResizeStart(m),
      onNodeResizeEnd: (m, _) => Ge.current.onNodeResizeEnd(m, _),
      onResultViewResizeEnd: (m, _) => Ge.current.onResultViewResizeEnd(m, _)
    }),
    []
  ), Hn = W(void 0), ye = de(() => {
    const m = CS(
      a,
      d,
      Hn.current
    );
    return Hn.current = m, m;
  }, [d, a]), uo = de(
    () => xI(
      a,
      (m) => ye.hasResultByNodeId.get(m.id) || !1
    ),
    [ye.hasResultByNodeId, a]
  ), Ct = uo.frames, Kt = de(
    () => new Map(Ct.map((m) => [m.id, m])),
    [Ct]
  ), at = de(
    () => new Map(Ct.map((m) => [m.sourceNodeId, m])),
    [Ct]
  ), Sr = de(
    () => new Map(
      Ct.map((m) => [
        m.id,
        ap(
          m,
          a,
          (_) => ye.hasResultByNodeId.get(_.id) || !1,
          ye.nodeById
        )
      ])
    ),
    [
      ye.hasResultByNodeId,
      ye.nodeById,
      a,
      Ct
    ]
  ), xn = de(() => {
    const m = /* @__PURE__ */ new Map();
    for (const _ of Ee) {
      if (!Lo(_))
        continue;
      const R = Number(_.canvas_id || 0);
      if (R > 0 && R !== y)
        continue;
      const B = String(_.start_node_id || "").trim();
      B && !m.has(B) && m.set(B, _);
    }
    return m;
  }, [y, Ee]), { latestCanvasRunByStartNodeId: Ue, activeCanvasRunByStartNodeId: Yn } = de(() => {
    const m = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
    for (const R of Ee) {
      const B = Number(R.canvas_id || 0);
      if (B > 0 && B !== y) continue;
      const F = String(R.start_node_id || "").trim();
      F && (m.has(F) || m.set(F, R), _n(R) && !_.has(F) && _.set(F, R));
    }
    return { latestCanvasRunByStartNodeId: m, activeCanvasRunByStartNodeId: _ };
  }, [y, Ee]), kt = uo.sourceNodeIds, Cr = uo.sourceNodeIdByNodeId, gt = de(
    () => new Set(
      Ct.flatMap(
        (m) => m.memberNodeIds.filter(
          (_) => _ !== m.sourceNodeId
        )
      )
    ),
    [Ct]
  ), et = nt(
    (m, _) => {
      const R = Kt.get(m), B = Sr.get(m);
      if (!R || !B)
        return;
      const F = B.pendingNodeIds.length, j = Math.max(0, R.workNodeCount - F);
      Ae({
        title: `执行“${R.title}”制作区？`,
        description: `将执行 ${F} 个待处理节点${j > 0 ? `，跳过 ${j} 个已有有效结果的节点` : ""}。执行期间不能单独运行该制作区内的节点。`,
        confirmText: "执行制作区",
        tone: "primary",
        onConfirm: () => In(_)
      });
    }
  ), Wo = nt(
    (m) => {
      const _ = xn.get(m);
      _ && _n(_) && xe(_);
    }
  ), fn = nt((m) => {
    const _ = ye.nodeById.get(m);
    _ && lm({
      group: _,
      sourceNode: _,
      members: ye.groupMembersById.get(m) || Ni,
      runNode: vn,
      onError: Pe
    });
  }), qt = nt((m) => {
    const _ = ye.nodeById.get(m);
    _ && vn(_).catch(
      (R) => Pe(
        R instanceof Error ? R.message : "节点运行失败"
      )
    );
  }), Xn = nt((m) => {
    const _ = Yn.get(m);
    _ && xe(_);
  }), kr = nt((m) => {
    const _ = ye.nodeById.get(m);
    _ && T(_);
  }), Gt = de(
    () => a.map((m) => m.id).join("\0"),
    [a]
  ), pn = de(
    () => new Set(
      Gt ? Gt.split("\0") : []
    ),
    [Gt]
  ), lo = de(
    () => Gt ? `${t.id}:${Gt}` : "",
    [t.id, Gt]
  ), fo = de(
    () => $p(H),
    [H]
  ), Rr = nt(
    (m, _) => /* @__PURE__ */ f(hd.Provider, { value: !0, children: /* @__PURE__ */ f(hN, { data: m, selected: _ }) })
  ), [po] = q(Uw), Ho = de(
    () => /* @__PURE__ */ new Set([...pn, ...Ct.map((m) => m.id)]),
    [pn, Ct]
  ), Yo = de(() => {
    const m = po.reuse, _ = [
      V,
      y,
      G,
      ne,
      K,
      r,
      Wn,
      ye,
      fo,
      fn,
      qt,
      kr,
      Xn
    ], R = (M) => ye.hasResultByNodeId.get(M.id) || !1, B = (M, Y = !1) => {
      const me = !Y && Ot.has(M.id) && I.length === 1 && wc(M), ie = M.type === "power" ? cn(M.power, M.kind, M.outputType).viewMode : "", he = Y || me, Me = he ? G : null, ut = he || ie === "storyboard" || ie === "video_compose" ? K : dN, At = (Y || ie === "video_compose" || me) && ye.incomingMediaReferencesByNodeId.get(M.id) || zu, ht = kt.has(M.id), Pt = Cr.get(M.id) || "", Wt = Pt && ye.nodeById.get(Pt) || null, Mn = Pt ? xn.get(Pt) : void 0, ss = !!(Pt && (Mn && _n(Mn) || It(
        H[ta(Pt)]
      ))), nr = H[M.id] || null, rr = Ue.get(M.id), si = !!(rr && Le.has(Tt(rr))), wo = M.type === "group" && ye.groupMembersById.get(M.id) || Ni, is = qs(M) ? fo : !1, or = ye.inputContextByNodeId.get(M.id) || null, bo = ss ? "制作区正在执行" : ye.runBlockedReasonByNodeId.get(M.id) || "";
      return m(
        Y ? "embedded" : "node",
        M.id,
        [
          M,
          V,
          y,
          Me,
          ne,
          nr,
          rr,
          si,
          wo,
          ...wo.map((ii) => H[ii.id]),
          is,
          ut,
          At,
          r,
          ht,
          Wt,
          ss,
          bo,
          me,
          Wn,
          or,
          Xn
        ],
        () => ({
          ...M,
          sourceNode: M,
          projectId: V,
          canvasId: y,
          space: Me,
          catalogCache: ne,
          runningNode: nr,
          canvasRun: rr,
          canvasRunStopping: si,
          onStopNodeCanvasRun: Xn,
          groupMembers: wo,
          groupRuntime: M.type === "group" ? Xc({
            members: wo,
            runningNodes: H,
            groupState: nr,
            hasResult: R
          }) : null,
          canvasHasRunningNode: is,
          canvasReferenceItems: ut,
          connectedMediaReferences: At,
          interactive: r,
          structureLocked: ht,
          storyboardSourceNode: Wt,
          storyboardFrameRunning: ss,
          runBlockedReason: bo,
          showNodeSettings: me,
          ...Y ? { embedded: !0 } : {},
          ...Wn,
          inputContext: or
        })
      );
    }, F = (M) => {
      const Y = Sr.get(M.id), te = xn.get(
        M.sourceNodeId
      ), me = !!(te && _n(te) && Le.has(Tt(te)));
      return m(
        "frame",
        M.id,
        [
          M,
          Y,
          te,
          H[M.id],
          ..._,
          et,
          Wo,
          Rr,
          ...M.memberNodeIds.flatMap((ie) => {
            const he = Ue.get(ie), Me = Yn.get(ie);
            return [
              H[ie],
              he,
              Me,
              !!(he && Le.has(Tt(he))),
              !!(Me && Le.has(Tt(Me)))
            ];
          }),
          me
        ],
        () => {
          const ie = te && _n(te) ? te : void 0, he = !!ie || It(H[M.id]), Me = M.memberNodeIds.some(
            (ht) => It(H[ht])
          ), ut = he ? "" : Me ? "制作区内有节点正在执行" : Y?.blockedReason || "", At = YN(
            M,
            ie,
            H,
            ye.nodeById
          ) || (he ? "准备执行" : "");
          return {
            frameId: M.id,
            sourceNodeId: M.sourceNodeId,
            groupCount: M.groupCount + Number(
              M.workNodeIds.some(
                (ht) => ye.nodeById.get(ht)?.storyboardItem?.itemType === "video_compose"
              )
            ),
            workNodeCount: M.workNodeCount,
            completedCount: M.completedCount,
            running: he,
            stopping: me,
            executionStatus: XN(
              te,
              H[M.id],
              me
            ),
            currentNodeTitle: At,
            runBlockedReason: ut,
            groups: ZN({
              frame: M,
              nodeById: ye.nodeById,
              groupMembersById: ye.groupMembersById,
              runBlockedReasonByNodeId: ye.runBlockedReasonByNodeId,
              runningNodes: H,
              frameRunning: he,
              activeRunByStartNodeId: Yn,
              stoppingCanvasRunKeys: Le,
              hasResult: R,
              onRunGroup: fn,
              onRunNode: qt,
              onStopRun: Xn,
              onOpenNode: kr,
              projectNode: (ht) => B(ht, !0),
              reuse: m,
              projectionDependencies: (ht) => [
                ..._,
                ...ht.flatMap((Pt) => {
                  const Wt = Ue.get(Pt.id);
                  return [
                    Wt,
                    !!(Wt && Le.has(Tt(Wt))),
                    kt.has(Pt.id),
                    Cr.get(Pt.id)
                  ];
                })
              ]
            }),
            renderNode: Rr,
            onRun: () => et(M.id, M.sourceNodeId),
            onStop: ie ? () => Wo(M.sourceNodeId) : void 0
          };
        }
      );
    }, j = (M) => {
      const Y = { x: M.x, y: M.y }, te = Ot.has(M.id), me = B(M), ie = at.get(M.id), he = ie ? F(ie) : void 0;
      return m(
        "flow",
        M.id,
        [me, he, te, r],
        () => {
          const Me = he ? { ...me, storyboardWorkspace: he } : me, ut = M.type === "group" ? 1 : M.groupId ? 3 : 2, At = dm(M);
          return {
            id: M.id,
            type: "workSpace",
            position: Y,
            data: Me,
            selected: te,
            className: `ws-flow-node ws-flow-node-${M.type}`,
            draggable: r && (!Me.structureLocked || !!ie),
            deletable: !Me.structureLocked,
            zIndex: ut,
            ...HS(At)
          };
        }
      );
    }, le = a.filter((M) => !gt.has(M.id)).map(j);
    return po.retain(Ho), le;
  }, [
    Yn,
    Ue,
    ye,
    xn,
    gt,
    r,
    po,
    Ho,
    kt,
    a,
    y,
    V,
    H,
    I.length,
    Ot,
    G,
    ne,
    K,
    fo,
    fn,
    qt,
    et,
    Rr,
    kr,
    Xn,
    Wo,
    Wn,
    at,
    Sr,
    Cr,
    Le
  ]), xr = sw(
    Yo,
    _C
  ), Rt = de(() => {
    if (U)
      for (const m of xr) {
        const _ = m.data;
        if (_.id === U) return _;
        for (const R of _.storyboardWorkspace?.groups || []) {
          const B = R.results.find(
            (F) => F.nodeId === U
          );
          if (B) return B.node;
        }
      }
  }, [U, xr]);
  ue(() => {
    Rt && ee(Rt);
  }, [ee, Rt]);
  const { flowNodes: mo, setFlowNodes: Oe } = ow(
    xr,
    so || Vo
  ), Hs = E(
    (m) => {
      r && (ot(""), it(d.filter((_) => _.id !== m)));
    },
    [it, d, r]
  ), mn = E(
    (m) => {
      !r || !d.some((_) => _.id === m) || Ae({
        title: "删除连线",
        description: "删除后，上下游节点将不再通过这条连线传递内容。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => Hs(m)
      });
    },
    [Hs, d, r, Ae]
  ), Ar = E(
    (m) => {
      if (!r || m.length === 0)
        return;
      const _ = zp(a, m);
      if (_.size === 0)
        return;
      if ([..._].some(
        (F) => kt.has(F)
      )) {
        Pe(
          "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
        );
        return;
      }
      const R = m.length === 1 ? m[0] : null, B = m.some((F) => F.type === "group");
      Ae({
        title: R ? `删除「${R.title}」` : `删除 ${_.size} 个节点`,
        description: B ? "会同时删除组内节点，并移除与这些节点相连的连线。" : R ? "会同时移除与该节点相连的连线。" : "会同时移除与这些节点相连的连线。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          ot(""), x(m);
        }
      });
    },
    [
      r,
      kt,
      a,
      x,
      Ae
    ]
  ), Zn = E(
    (m, _ = []) => {
      if (!r || m.length === 0)
        return;
      const R = new Set(
        m.flatMap((Y) => Y.memberNodeIds)
      ), B = /* @__PURE__ */ new Set([
        ...R,
        ..._.map((Y) => Y.id)
      ]), F = a.filter((Y) => B.has(Y.id));
      if (F.length === 0)
        return;
      const j = m.length === 1 && _.every((Y) => R.has(Y.id)) ? m[0] : null, le = F.filter(
        (Y) => Y.type === "group"
      ).length, M = F.length - le;
      Ae({
        title: j ? `删除「${j.title}」制作区` : `删除 ${F.length} 个节点`,
        description: j ? `将删除其中 ${le} 个分组和 ${M} 个节点，并移除相关连线。已生成素材会归档保留。` : "会同时删除所选制作区内的节点、分组及相关连线；已生成素材会归档保留。",
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => {
          ot(""), x(F, { allowStoryboardFrame: !0 });
        }
      });
    },
    [r, a, x, Ae]
  ), An = de(
    () => d.filter(
      (m) => pn.has(m.from) && pn.has(m.to) && !gt.has(m.from) && !gt.has(m.to)
    ).map((m) => {
      const _ = Bt(m), R = ye.nodeById.get(
        _.sourceNodeId
      ), B = ye.nodeById.get(
        _.targetNodeId
      ), F = _a(
        B?.composerDraft,
        _.sourceNodeId,
        Vn.get(_.targetNodeId)
      ), j = !!(hn(m) === "media" && B?.type === "power" && B.power && (F || vo(R))), le = Vn.get(
        _.targetNodeId
      ), M = j && B && le ? Ta(
        B,
        le,
        _.sourceNodeId
      ) : void 0, Y = li(B), te = j ? oh(
        F,
        M,
        Y
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
          purpose: hn(m),
          executionMode: m.executionMode,
          mediaUsage: m.mediaUsage,
          bindingLabel: te?.label,
          bindingInteractive: te?.interactive,
          bindingShowChevron: te?.showChevron,
          bindingInvalid: te?.invalid
        }
      };
    }),
    [
      Vn,
      pn,
      ye.nodeById,
      d,
      gt
    ]
  );
  ue(() => {
    if (!Te || !lo || ve || u.zoom != null || typeof window > "u")
      return;
    const m = setTimeout(() => {
      Te.fitView?.({ padding: 0.32, duration: 250, maxZoom: 0.72 });
    }, 150);
    return () => clearTimeout(m);
  }, [lo, Te, ve, u.zoom]), ue(() => {
    if (!Te || !ve || typeof window > "u")
      return;
    const m = a.find(
      (F) => F.id === ve.nodeId
    );
    if (!m) {
      D(ve);
      return;
    }
    const _ = gt.has(m.id) ? Ct.find(
      (F) => F.memberNodeIds.includes(m.id)
    ) : void 0, R = _ && a.find((F) => F.id === _.sourceNodeId) || m, B = window.setTimeout(() => {
      const F = { x: R.x, y: R.y }, j = R.type === "power" ? 1.02 : 0.96;
      Te.setCenter?.(
        F.x + (R.width || 180) / 2,
        F.y + (R.height || 180) / 2,
        { zoom: j, duration: 320 }
      ), St(j), D(ve);
    }, 80);
    return () => window.clearTimeout(B);
  }, [
    Te,
    St,
    ve,
    gt,
    a,
    D,
    Ct
  ]);
  const Jn = E(
    (m) => {
      if (!r)
        return;
      const _ = m.map((F) => {
        if (F.type !== "position" || !F.position)
          return F;
        const j = ha(
          a,
          F.id,
          F.position
        );
        return j === F.position ? F : {
          ...F,
          position: j,
          ...F.positionAbsolute ? { positionAbsolute: j } : {}
        };
      });
      Oe((F) => Xg(_, F));
      const R = new Set(I);
      let B = !1;
      for (const F of m)
        F.type === "select" && (B = !0, F.selected ? (R.delete(F.id), R.add(F.id)) : R.delete(F.id));
      B && w([...R]);
    },
    [r, a, w, I, Oe]
  ), gn = E(
    (m) => {
      const _ = Number(m.composerDraft?.selectedTargetId || 0), R = Number(
        G.release?.id || G.project.release_id || 0
      );
      return ne.loadPowerForm(
        {
          projectId: V,
          releaseId: R,
          flowId: Number(m.flow?.id || 0),
          powerId: Number(m.power?.id || 0),
          powerKey: m.power?.key || "",
          targetId: _
        },
        () => w_({
          projectId: V,
          flowId: Number(m.flow?.id || 0),
          powerId: Number(m.power?.id || 0),
          powerKey: m.power?.key || "",
          targetId: _
        })
      );
    },
    [ne, V, G.project.release_id, G.release?.id]
  ), on = de(() => {
    const m = new Set(
      d.flatMap((_) => {
        if (hn(_) !== "media")
          return [];
        const R = Bt(_), B = ye.nodeById.get(
          R.sourceNodeId
        ), F = ye.nodeById.get(
          R.targetNodeId
        );
        return F?.type === "power" && F.power && vo(B) ? [F.id] : [];
      })
    );
    for (const _ of a)
      _.type === "power" && _.power && (Object.keys(_.composerDraft?.paramBindings || {}).length > 0 || _.composerDraft?.storyboardLyricsSourceNodeId) && m.add(_.id);
    return a.filter((_) => m.has(_.id));
  }, [ye.nodeById, d, a]);
  ue(() => {
    if (on.length === 0)
      return;
    let m = !1;
    return Promise.all(
      on.map(
        async (_) => {
          try {
            const R = await gn(_);
            return [_.id, R.params || []];
          } catch {
            return null;
          }
        }
      )
    ).then((_) => {
      m || io(
        new Map(
          _.filter(
            (R) => !!R
          )
        )
      );
    }), () => {
      m = !0;
    };
  }, [gn, on]);
  const yt = E(
    (m, _, R) => {
      const B = a.some((M) => M.id === m), F = a.find((M) => M.id === _);
      if (!B || !F) {
        Pe("节点已变化，请重新连接");
        return;
      }
      const j = Hr(F);
      if (!nh(
        j,
        R,
        m
      )) {
        Pe("该参数已被其他文本连接占用，请重新选择");
        return;
      }
      const le = dh(
        j,
        m,
        R
      );
      it(
        sn(
          a,
          En(Ve.current, m, _)
        ),
        le !== j ? { draftByNodeId: /* @__PURE__ */ new Map([[F.id, le]]) } : void 0
      );
    },
    [it, a]
  ), Ys = E(
    (m, _) => {
      const R = a.find((Y) => Y.id === m), B = a.find((Y) => Y.id === _);
      if (!B || !vo(R) || !li(B)) {
        Pe("节点已变化，请重新连接");
        return;
      }
      const F = Hr(B), j = String(
        F.storyboardLyricsSourceNodeId || ""
      ).trim(), le = lh(
        F,
        m
      ), M = Ve.current.filter((Y) => {
        if (!j || j === m || hn(Y) !== "media")
          return !0;
        const te = Bt(Y);
        return !(te.sourceNodeId === j && te.targetNodeId === _);
      });
      M.length !== Ve.current.length && ot(""), it(
        sn(
          a,
          En(M, m, _)
        ),
        { draftByNodeId: /* @__PURE__ */ new Map([[B.id, le]]) }
      );
    },
    [it, a]
  );
  ue(() => {
    for (const m of on) {
      const _ = Vn.get(m.id);
      if (!_)
        continue;
      const R = d.flatMap((F) => {
        if (hn(F) !== "media")
          return [];
        const j = Bt(F);
        if (j.targetNodeId !== m.id)
          return [];
        const le = ye.nodeById.get(
          j.sourceNodeId
        );
        return m.composerDraft?.storyboardLyricsSourceNodeId === j.sourceNodeId ? [] : vo(le) ? [j.sourceNodeId] : [];
      }), B = sh(
        R,
        m.composerDraft,
        Up(m, _)
      );
      B && yt(
        B.sourceNodeId,
        m.id,
        B.targetParamKey
      );
    }
  }, [
    Vn,
    ye.nodeById,
    yt,
    d,
    on
  ]);
  const Tr = E(
    async (m) => {
      if (!r)
        return;
      const _ = Ve.current.find(
        (M) => M.id === m
      );
      if (!_)
        return;
      const { sourceNodeId: R, targetNodeId: B } = Bt(_), F = a.find((M) => M.id === R), j = a.find((M) => M.id === B), le = _a(
        j?.composerDraft,
        R
      );
      if (!(j?.type !== "power" || !j.power || !le && !vo(F)))
        try {
          const M = await gn(j), Y = Ta(
            j,
            M.params || [],
            R
          ), te = _a(
            j.composerDraft,
            R,
            M.params || []
          ), me = li(j);
          if (io((he) => {
            const Me = new Map(he);
            return Me.set(B, M.params || []), Me;
          }), ot(m), me) {
            dn({
              sourceNodeId: R,
              targetNodeId: B,
              sourceTitle: F?.title || "上游节点",
              targetTitle: j.title || j.power.name,
              params: Y,
              selectedParamKey: te?.purpose === "param" ? te.targetParamKey : void 0,
              lyricsAvailable: !0,
              lyricsSelected: te?.purpose === "storyboard_lyrics",
              editing: !0
            });
            return;
          }
          const ie = Ka(Y);
          if (ie.kind === "unavailable") {
            Pe("当前能力没有可用的文本参数");
            return;
          }
          if (ie.kind === "automatic") {
            te?.targetParamKey !== ie.targetParamKey && yt(
              R,
              B,
              ie.targetParamKey
            );
            return;
          }
          dn({
            sourceNodeId: R,
            targetNodeId: B,
            sourceTitle: F?.title || "上游节点",
            targetTitle: j.title || j.power.name,
            params: ie.params,
            selectedParamKey: te?.targetParamKey,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !0
          });
        } catch (M) {
          Pe(
            M instanceof Error ? M.message : "参数列表加载失败"
          );
        }
    },
    [yt, r, gn, a]
  ), yn = E(
    (m) => {
      Tr(m);
    },
    [Tr]
  ), [Xo] = q(Kw), go = de(() => (Xo.update(a, d), Xo), [Xo, a, d]), Zo = W([]), tt = de(() => {
    const m = new Map(
      Zo.current.map((Y) => [Y.id, Y])
    ), _ = go.get(h), R = go.get(Nn), B = /* @__PURE__ */ new Set([
      ..._,
      ...R
    ]), F = _.size > 0 ? h : R.size > 0 ? Nn : "", j = An.map((Y) => {
      const te = jS(
        Y,
        ye.nodeById,
        Nn,
        h,
        Nt,
        B,
        F
      );
      return LS(
        Y,
        te,
        mn,
        yn,
        m.get(Y.id)
      );
    }), le = Zo.current, M = j.length === le.length && j.every((Y, te) => Y === le[te]) ? le : j;
    return Zo.current = M, M;
  }, [
    An,
    ye,
    go,
    Nn,
    mn,
    yn,
    Nt,
    h
  ]), yo = de(
    () => [...tt, ...Qe ? [Qe] : []],
    [tt, Qe]
  ), Jo = E(
    (m) => {
      if (!r)
        return;
      let _ = "", R = !1;
      for (const j of m)
        j.type === "select" && (R = !0, j.selected && (_ = j.id));
      R && ot(_);
      const B = m.filter(
        (j) => j.type !== "select"
      );
      if (B.length === 0)
        return;
      const F = Zg(B, tt);
      it(
        Dy(
          Ve.current,
          new Set(tt.map((j) => j.id)),
          AS(F)
        )
      );
    },
    [it, tt, r]
  ), Mr = E(
    async (m, _) => {
      if (Ve.current.some((te) => {
        const me = Bt(te);
        return me.sourceNodeId === m && me.targetNodeId === _;
      }))
        return;
      const B = a.find((te) => te.id === _), F = a.find((te) => te.id === m), le = Gl(a, m).filter(Ac);
      let M, Y;
      if (B?.type === "power" && B.power && le.length > 0)
        try {
          const me = (await gn(B)).params || [], ie = Hr(B), he = nm(
            a,
            Ve.current,
            _
          ), Me = fl(
            me,
            ie
          ), ut = Rg(
            me,
            Me,
            [
              ...he.map((Mn) => Mn.source),
              ...le
            ]
          ), At = xg({
            node: B,
            content: ie.promptContent,
            items: K,
            connections: he,
            params: me,
            values: ut,
            requestedMode: ie.multiImageMode,
            additionalSources: le
          }), ht = At.active ? At.mode : void 0;
          if (At.error) {
            Pe(At.error);
            return;
          }
          const Pt = Ag(
            pl(me, ut)
          ), Wt = Tg(
            he,
            Pt,
            le,
            ie.promptContent,
            K,
            ht
          );
          if (Wt.error) {
            Pe(Wt.error);
            return;
          }
          if (M = Wt.usage, At.active && ht) {
            const Mn = Hc({
              ...ie,
              paramValues: ut,
              multiImageMode: ht
            });
            eu(Mn) !== eu(ie) && (Y = Mn);
          }
        } catch (te) {
          Pe(
            te instanceof Error ? `媒体用途加载失败，未建立连线：${te.message}` : "媒体用途加载失败，未建立连线"
          );
          return;
        }
      else if (B?.type === "power" && B.power && vo(F))
        try {
          const te = await gn(B), me = Ta(
            B,
            te.params || [],
            m
          ), ie = li(B);
          if (io((Me) => {
            const ut = new Map(Me);
            return ut.set(_, te.params || []), ut;
          }), ie) {
            dn({
              sourceNodeId: m,
              targetNodeId: _,
              sourceTitle: F?.title || "上游节点",
              targetTitle: B.title || B.power.name,
              params: me,
              lyricsAvailable: !0,
              lyricsSelected: !1,
              editing: !1
            });
            return;
          }
          const he = Ka(me);
          if (he.kind === "unavailable") {
            Pe("当前能力没有可用的文本参数，未建立连线");
            return;
          }
          if (he.kind === "automatic") {
            yt(
              m,
              _,
              he.targetParamKey
            );
            return;
          }
          dn({
            sourceNodeId: m,
            targetNodeId: _,
            sourceTitle: F?.title || "上游节点",
            targetTitle: B.title || B.power.name,
            params: he.params,
            lyricsAvailable: !1,
            lyricsSelected: !1,
            editing: !1
          });
          return;
        } catch (te) {
          Pe(
            te instanceof Error ? `参数列表加载失败，未建立连线：${te.message}` : "参数列表加载失败，未建立连线"
          );
          return;
        }
      B && Y && be(B.id, Y), it(
        sn(
          a,
          En(
            Ve.current,
            m,
            _,
            M
          )
        )
      );
    },
    [
      K,
      yt,
      it,
      gn,
      a,
      be
    ]
  ), Qo = E(
    (m) => {
      const _ = st;
      _ && (dn(null), yt(
        _.sourceNodeId,
        _.targetNodeId,
        m
      ));
    },
    [yt, st]
  ), Tn = E(() => {
    const m = st;
    m?.lyricsAvailable && (dn(null), Ys(
      m.sourceNodeId,
      m.targetNodeId
    ));
  }, [Ys, st]), Xs = E(() => {
    dn(null);
  }, []), Zs = E(
    (m) => {
      r && (Un.current = !0, !(!m.source || !m.target || m.source === m.target) && Mr(
        m.source || "",
        m.target || ""
      ));
    },
    [Mr, r]
  ), se = E(
    (m, _) => {
      if (!r)
        return;
      const R = String(_?.nodeId || "");
      R && (Dt.current = !0, w([]), Mt(null)), Rn.current = R ? {
        nodeId: R,
        handleId: _?.handleId || null,
        handleType: _?.handleType || null
      } : null, Un.current = !1, ot("");
    },
    [r, w]
  ), da = E(
    (m) => {
      if (!r) {
        Rn.current = null, Un.current = !1;
        return;
      }
      const _ = Rn.current;
      if (Rn.current = null, _?.nodeId && typeof window < "u" && window.setTimeout(() => {
        Dt.current = !1;
      }, 0), Un.current) {
        Un.current = !1;
        return;
      }
      if (!_?.nodeId)
        return;
      const R = US(m);
      R && (br.current = !0, C(
        R,
        hi(Te, R),
        _
      ));
    },
    [Te, r, C]
  ), ua = E(
    (m, _) => {
      r && (m.preventDefault(), m.stopPropagation(), Mt(null), w([]), ot(_.id));
    },
    [r, w]
  );
  ue(() => {
    if (!Nt || typeof window > "u")
      return;
    function m(_) {
      !r || !Yu(_) || (_.preventDefault(), mn(Nt));
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [r, mn, Nt]), ue(() => {
    if (I.length === 0 || Nt || typeof window > "u")
      return;
    function m(_) {
      if (!r || !Yu(_))
        return;
      const R = a.filter(
        (F) => Ot.has(F.id)
      ), B = I.map((F) => at.get(F)).filter((F) => !!F);
      if (!(R.length === 0 && B.length === 0)) {
        if (_.preventDefault(), B.length > 0) {
          Zn(B, R);
          return;
        }
        Ar(R);
      }
    }
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [
    r,
    a,
    Ar,
    Zn,
    Nt,
    I.length,
    I,
    Ot,
    at
  ]);
  const ct = E((m) => {
    jn(
      (_) => zS(_, m) ? _ : m
    );
  }, []), la = E(
    (m) => {
      if (!r)
        return !1;
      const _ = a.find(
        (B) => B.id === m.source
      ), R = a.find(
        (B) => B.id === m.target
      );
      return yc(_, R);
    },
    [r, a]
  ), Q = E(
    (m, _) => {
      if (!r)
        return;
      if (at.has(_.id)) {
        ct(null);
        return;
      }
      if (kt.has(_.id)) {
        ct(null);
        return;
      }
      const R = ye.nodeById.get(_.id);
      if (!R) {
        ct(null);
        return;
      }
      const B = ha(
        a,
        _.id,
        _.position
      ), F = B === _.position ? _ : { ..._, position: B };
      if (R.type === "group") {
        const Y = _.position.x - R.x, te = _.position.y - R.y;
        Oe(
          (me) => me.map((ie) => {
            const he = ye.nodeById.get(ie.id);
            return he?.groupId !== R.id ? ie : {
              ...ie,
              position: {
                x: he.x + Y,
                y: he.y + te
              }
            };
          })
        ), ct(null);
        return;
      }
      if (tt.some(
        (Y) => Y.source === _.id || Y.target === _.id
      )) {
        ct(null);
        return;
      }
      const le = $S(
        F,
        mo,
        a
      );
      if (!le) {
        ct(null);
        return;
      }
      const M = FS(
        R,
        le.domainNode
      );
      if (!M) {
        ct(null);
        return;
      }
      ct(BS(M));
    },
    [
      ye.nodeById,
      tt,
      mo,
      r,
      kt,
      a,
      Oe,
      at,
      ct
    ]
  ), es = E(
    (m, _) => {
      if (!r) {
        Sn(""), ct(null);
        return;
      }
      if (at.has(_.id)) {
        const j = qd(
          a,
          _.id,
          _.position
        );
        j !== a && oe(j), Sn(""), ct(null);
        return;
      }
      if (kt.has(_.id)) {
        Sn(""), ct(null);
        return;
      }
      const R = a.find((j) => j.id === _.id);
      let B = !1;
      if (R) {
        const j = ha(
          a,
          _.id,
          _.position
        ), le = qd(a, _.id, j), M = Ua(
          le,
          _.id,
          j
        );
        B = (R.groupId || "") !== (M.find((te) => te.id === R.id)?.groupId || ""), M !== a && oe(M);
        const Y = sn(M, d);
        im(d, Y) || it(Y);
      }
      if (Sn(""), B) {
        ct(null);
        return;
      }
      if (!Qe) {
        ct(null);
        return;
      }
      tt.some(
        (j) => j.source === Qe.source && j.target === Qe.target
      ) || Mr(
        Qe.source,
        Qe.target
      ), ct(null);
    },
    [
      d,
      Mr,
      it,
      tt,
      r,
      kt,
      oe,
      a,
      Qe,
      at,
      ct
    ]
  ), ts = E(
    (m) => {
      !r || m.button !== 2 || (Kn.current = !1, fN(m.target) && (ln.current = {
        pointerId: m.pointerId,
        start: { x: m.clientX, y: m.clientY },
        baseNodeIds: m.ctrlKey || m.metaKey ? [...I] : [],
        moved: !1,
        contextMenuHandled: !1
      }, m.preventDefault(), m.stopPropagation(), m.currentTarget.setPointerCapture?.(m.pointerId)));
    },
    [r, I]
  ), Qn = E(
    (m) => {
      C(m, hi(Te, m));
    },
    [Te, C]
  ), je = E(
    (m) => {
      const _ = ln.current;
      !r || !_ && !Kn.current || (m.preventDefault(), m.stopPropagation(), Kn.current = !1, _ && (_.contextMenuHandled = !0));
    },
    [r]
  ), fa = E(
    (m) => {
      const _ = ln.current;
      if (!_ || _.pointerId !== m.pointerId || !Te || !Ut.current)
        return;
      const R = m.clientX - _.start.x, B = m.clientY - _.start.y;
      if (!_.moved && Math.hypot(R, B) < 5)
        return;
      _.moved = !0, m.preventDefault(), m.stopPropagation();
      const F = Ut.current.getBoundingClientRect();
      Go(
        pN(
          _.start,
          {
            x: m.clientX,
            y: m.clientY
          },
          F
        )
      );
      const j = mN(
        a,
        hi(Te, _.start),
        hi(Te, {
          x: m.clientX,
          y: m.clientY
        })
      );
      w(gN(_.baseNodeIds, j)), ot(""), Mt(null);
    },
    [Te, a, w]
  ), Js = E(
    (m) => {
      const _ = ln.current;
      if (!_ || _.pointerId !== m.pointerId)
        return;
      ln.current = null, m.currentTarget.hasPointerCapture?.(m.pointerId) && m.currentTarget.releasePointerCapture(m.pointerId), Go(null);
      const R = !_.moved && m.type === "pointerup";
      Kn.current = !R && !_.contextMenuHandled, m.preventDefault(), m.stopPropagation(), R && _.contextMenuHandled && Qn({
        x: m.clientX,
        y: m.clientY
      });
    },
    [Qn]
  ), pa = E(
    (m) => {
      if (r) {
        if (br.current) {
          br.current = !1;
          return;
        }
        w([]), ot(""), Mt(null), !(!("detail" in m) || m.detail !== 2) && (m.preventDefault(), m.stopPropagation(), Qn({ x: m.clientX, y: m.clientY }));
      }
    },
    [r, w, Qn]
  ), Qs = E(
    (m) => {
      if (r) {
        if (m.preventDefault(), m.stopPropagation(), Kn.current) {
          Kn.current = !1;
          return;
        }
        Qn({ x: m.clientX, y: m.clientY });
      }
    },
    [r, Qn]
  ), ei = E(
    (m, _) => {
      r && (m.preventDefault(), m.stopPropagation(), ot(""), Ot.has(_.id) || w([_.id]), Mt({
        nodeId: _.id,
        x: m.clientX,
        y: m.clientY
      }));
    },
    [r, w, Ot]
  ), Re = Ln && a.find((m) => m.id === Ln.nodeId) || null, er = Ln && at.get(Ln.nodeId) || null, Dr = !!(Re && kt.has(Re.id)), Er = Re && a.find(
    (m) => m.id === AI(a, Re)
  ) || null, Pr = Re ? { x: Re.x, y: Re.y } : void 0;
  function We() {
    Mt(null);
  }
  function Et() {
    if (!(!r || !Re)) {
      if (Dr) {
        Pe("脚本托管节点不能复制，请在分镜脚本中修改结构"), We();
        return;
      }
      S(
        Re,
        Pr ? { x: Pr.x + 34, y: Pr.y + 34 } : void 0
      ), We();
    }
  }
  function Or() {
    if (!r || !Re && !er)
      return;
    if (er) {
      const _ = er;
      We(), Zn([_]);
      return;
    }
    if (!Re)
      return;
    if (Dr) {
      Pe(
        "脚本托管节点不能单独删除，请编辑分镜脚本或删除整个制作区"
      ), We();
      return;
    }
    const m = Re;
    We(), Ar([m]);
  }
  function dt() {
    Re && (T(Re), We());
  }
  function ns() {
    Er && (T(
      Er,
      op(Re)
    ), We());
  }
  function tr() {
    if (!Re)
      return;
    const m = iI(Re, a);
    if (!m) {
      We();
      return;
    }
    be(Re.id, m), We();
  }
  const ti = E(() => {
    Te?.fitView?.({ padding: 0.32, duration: 260, maxZoom: 0.9 });
  }, [Te]), ni = E(
    (m) => {
      const _ = Lr(m);
      St(_), Te?.zoomTo?.(_, { duration: 120 });
    },
    [Te, St]
  ), ho = E(() => {
    const m = Lr(Cn + 0.12);
    St(m), Te?.zoomIn?.({ duration: 140 });
  }, [Te, St, Cn]), ma = E(() => {
    const m = Lr(Cn - 0.12);
    St(m), Te?.zoomOut?.({ duration: 140 });
  }, [Te, St, Cn]), ri = E(() => {
    if (r) {
      if (Dt.current) {
        Dt.current = !1;
        return;
      }
      ot(""), Mt(null);
    }
  }, [r]), Ft = E(
    (m, _) => {
      r && Sn(_.id);
    },
    [r]
  ), rs = E((m, _) => {
    oo(_.id);
    const R = _.type === "workSpace" ? _.data.sourceNode : null;
    R && wc(R) && _v();
  }, []), ga = E(() => {
    oo("");
  }, []), _o = E(
    (m) => {
      const _ = m;
      ro(_), u.x != null && u.y != null && u.zoom != null ? (_.setViewport?.({
        x: u.x,
        y: u.y,
        zoom: u.zoom
      }), St(u.zoom)) : St(_.getZoom?.() || 1);
    },
    [St, u.x, u.y, u.zoom]
  ), Fr = E(
    (m, _) => {
      Ir(_.zoom);
    },
    [Ir]
  ), xt = E(
    (m, _) => {
      St(_.zoom), we({
        x: _.x,
        y: _.y,
        zoom: _.zoom
      });
    },
    [St, we]
  ), oi = E(() => {
    ao((m) => !m);
  }, []), ya = E(() => {
    Uo((m) => !m);
  }, []), os = [
    "ws-canvas-wrap",
    so ? "is-dragging" : "",
    wr ? "is-selecting" : "",
    Vo ? "is-resizing" : "",
    r ? "is-interactive" : "is-passive",
    n === "result" ? "is-result-mode" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ L(
    "section",
    {
      ref: Ut,
      className: os,
      style: uC(Cn),
      onPointerDownCapture: ts,
      onPointerMoveCapture: fa,
      onPointerUpCapture: Js,
      onPointerCancelCapture: Js,
      onContextMenuCapture: je,
      children: [
        /* @__PURE__ */ f(
          sr,
          {
            message: _r,
            onDismiss: () => Pe(""),
            floating: !0
          }
        ),
        /* @__PURE__ */ f(zw, { root: Ut, children: /* @__PURE__ */ f(
          Jg,
          {
            nodes: mo,
            edges: yo,
            onlyRenderVisibleElements: !0,
            defaultViewport: u.x != null && u.y != null && u.zoom != null ? { x: u.x, y: u.y, zoom: u.zoom } : void 0,
            nodeTypes: yN,
            edgeTypes: _N,
            onNodesChange: Jn,
            onEdgesChange: Jo,
            onConnect: Zs,
            onConnectStart: se,
            onConnectEnd: da,
            isValidConnection: la,
            connectionLineStyle: wN,
            onEdgeClick: ua,
            onNodeClick: ri,
            onNodeContextMenu: ei,
            onNodeDragStart: Ft,
            onNodeDrag: Q,
            onNodeDragStop: es,
            onNodeMouseEnter: rs,
            onNodeMouseLeave: ga,
            onInit: _o,
            onMove: Fr,
            onMoveEnd: xt,
            onPaneClick: pa,
            onPaneContextMenu: Qs,
            nodesDraggable: r,
            nodesConnectable: r,
            nodesFocusable: r,
            edgesFocusable: r,
            elementsSelectable: r,
            deleteKeyCode: null,
            multiSelectionKeyCode: IN,
            panOnDrag: r,
            panOnScroll: !1,
            zoomOnScroll: r,
            zoomOnPinch: r,
            snapToGrid: Ws,
            snapGrid: bN,
            zoomOnDoubleClick: !1,
            minZoom: 0.35,
            maxZoom: 1.45,
            defaultEdgeOptions: vN,
            fitView: u.zoom == null,
            fitViewOptions: NN,
            children: r && Gs && a.length > 0 ? /* @__PURE__ */ f(
              Qg,
              {
                position: "bottom-left",
                pannable: !0,
                zoomable: !0,
                nodeColor: vC
              }
            ) : null
          }
        ) }),
        wr ? /* @__PURE__ */ f(
          "div",
          {
            className: "ws-canvas-selection-marquee",
            style: wr,
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ f(
          tw,
          {
            canvasCount: s,
            activeCanvasName: o,
            canvasManagerOpen: i,
            showViewTools: r,
            showMiniMap: Gs,
            snapToGrid: Ws,
            zoom: Cn,
            onOpenCanvasManager: c,
            onToggleMiniMap: oi,
            onToggleSnap: ya,
            onReset: ti,
            onZoomIn: ho,
            onZoomOut: ma,
            onZoomChange: ni
          }
        ),
        r && a.length === 0 ? /* @__PURE__ */ L("div", { className: "ws-empty-note", role: "note", children: [
          /* @__PURE__ */ L("span", { className: "ws-empty-action", children: [
            /* @__PURE__ */ f(rl, { size: 16 }),
            /* @__PURE__ */ f("strong", { children: "双击屏幕" })
          ] }),
          /* @__PURE__ */ f("span", { className: "ws-empty-copy", children: "画布自由生成" })
        ] }) : null,
        r && Ln && (Re || er) ? /* @__PURE__ */ f(
          ew,
          {
            point: Ln,
            canShowDetail: !!(Re && an(Re)),
            canCopy: !!(Re && !Dr),
            canDelete: !!(er || !Dr),
            canEditStructure: !!(Er && Er.id !== Re?.id),
            canResetStoryboardPrompt: !!(Re && sI(Re)),
            onClose: We,
            onCopy: Et,
            onDelete: Or,
            onDetail: dt,
            onEditStructure: ns,
            onResetStoryboardPrompt: tr
          }
        ) : null,
        st ? /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载参数绑定", overlay: !0 }),
            children: /* @__PURE__ */ f(
              lv,
              {
                sourceTitle: st.sourceTitle,
                targetTitle: st.targetTitle,
                params: st.params,
                selectedParamKey: st.selectedParamKey,
                lyricsAvailable: st.lyricsAvailable,
                lyricsSelected: st.lyricsSelected,
                editing: st.editing,
                onClose: Xs,
                onSelect: Qo,
                onSelectLyrics: Tn
              }
            )
          }
        ) : null
      ]
    }
  );
});
function TN({
  request: e,
  onClose: t,
  onError: n
}) {
  const [r, s] = q(!1);
  async function o() {
    if (r)
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
              /* @__PURE__ */ f("button", { type: "button", disabled: r, onClick: t, children: "取消" }),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: e.tone === "danger" ? "is-danger" : "is-primary",
                  disabled: r,
                  onClick: () => {
                    o();
                  },
                  children: r ? "处理中..." : e.confirmText || "确认"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function MN(e, t) {
  return Object.keys(t).length === 0 ? e : {
    ...e,
    nodes: e.nodes.map((n) => {
      const r = t[n.id];
      return r ? { ...n, ...r } : n;
    })
  };
}
function DN(e, t, n) {
  const r = e[t];
  if (!r)
    return e;
  const s = Object.keys(n);
  if (!s.some(
    (c) => Object.prototype.hasOwnProperty.call(r, c)
  ))
    return e;
  const o = { ...r };
  for (const c of s)
    delete o[c];
  const i = { ...e };
  return Object.keys(o).length === 0 ? delete i[t] : i[t] = o, i;
}
function jp(e, t, n, r = e.length) {
  const s = Math.min(
    Kr,
    Math.max(2, e.length, r)
  );
  return {
    type: "storyboard_grid",
    version: Math.max(1, Number(t?.version || 1)),
    title: $e(t?.title, n, "宫格图片"),
    summary: t?.summary || "",
    frames: Array.from(
      { length: s },
      (o, i) => e[i] ? Vp(e[i], i) : Lp(i)
    )
  };
}
function EN(e, t, n, r) {
  if (t < 0 || t >= Kr || (e?.frames.length || 0) > Kr)
    return null;
  const s = e || jp([], null, r, t + 1), o = Math.min(
    Kr,
    Math.max(2, s.frames.length, t + 1)
  ), i = Vp(n, t);
  return {
    ...s,
    frames: Array.from(
      { length: o },
      (c, a) => s.frames[a] || Lp(a)
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
function Lp(e) {
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
function Vp(e, t) {
  const n = t + 1;
  return {
    id: `frame-${String(n).padStart(2, "0")}`,
    order: n,
    title: e.name || `画面 ${String(n).padStart(2, "0")}`,
    description: "",
    prompt: "",
    status: "success",
    image: Ol(e.version?.content, "image")[0] || "",
    error: "",
    assetID: e.libraryType === "asset" ? e.id : 0,
    assetVersionID: e.libraryType === "asset" ? e.versionID : 0
  };
}
function Qr(e, t, n) {
  const r = Fe(t, "asset"), s = Ks(r) ? ir(r) : void 0, o = Ie(
    Fe(t, "output"),
    Fe(t, "asset", "version", "content"),
    Fe(t, "version", "content"),
    Fe(t, "result", "output"),
    Fe(t, "result", "asset", "version", "content"),
    Fe(t, "data", "output"),
    Fe(t, "data", "content"),
    Fe(t, "data", "result"),
    Fe(t, "data")
  ), i = e.type === "agent" && o != null ? Ke(o) : Vi(o) || jt(o), c = e.type === "power" && cn(e.power, e.kind, e.outputType).viewMode === "storyboard" ? bn([
    o,
    Fe(t, "asset", "version", "content"),
    Fe(t, "version", "content"),
    Fe(t, "result"),
    i
  ]) : null, a = e.type === "power" && Gm(e.power, e.kind, e.outputType) ? Bc([
    o,
    Fe(t, "asset", "version", "content"),
    Fe(t, "version", "content"),
    Fe(t, "result"),
    i
  ]) : null, d = $e(
    String(Fe(t, "asset", "kind") || ""),
    String(Fe(t, "kind") || ""),
    aa(e, i)
  ), u = yr(i, d), y = Jt(i, ""), h = e.type === "power" && cn(e.power, e.kind, e.outputType).viewMode === "writing" ? [s?.version?.content, o, i].map(
    (S) => La(S)?.document || Cs(S)
  ).find(Boolean) : null, I = $e(
    h?.title,
    a?.title,
    c?.title
  ), w = ls(n), C = ls(a?.summary) || ls(c?.summary) || ls(u.text) || ls(y) || (w ? `已按提示生成：${w}` : "生成完成");
  return {
    ...I && e.titleMode === "auto" ? { title: I } : {},
    description: C,
    resultRef: Qc(t),
    resultOutput: a || c || i,
    asset: s || e.asset,
    kind: s?.kind || e.power?.kind || e.kind
  };
}
function ls(e) {
  const t = $e(e);
  return zn(t) ? "" : t;
}
function Is(e, t) {
  const n = t.version?.content;
  return {
    ...Qr(
      e,
      {
        asset: t,
        output: n
      },
      bl(n)
    ),
    asset: t
  };
}
function Hr(e) {
  return Kh(e.composerDraft);
}
function Ta(e, t, n) {
  return nf(
    Up(e, t),
    Hr(e),
    n
  );
}
function Up(e, t) {
  const n = Hr(e), r = fl(t, n);
  return pl(t, r);
}
function PN(e) {
  const t = Hr(e);
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
function _d(e, t) {
  const n = Hw(e, t);
  return {
    ...n,
    id: ON(e, t, n.id)
  };
}
function ON(e, t, n) {
  const r = Number(t.approval?.id || 0);
  if (r > 0)
    return `${e.id}:${r}`;
  const s = String(t.interaction?.interaction?.id || "");
  if (s)
    return `${e.id}:${s}`;
  const o = xi({
    title: t.title,
    fields: (t.fields || []).map((i) => i.key),
    content: t.approval?.content
  });
  return o ? `${e.id}:feedback:${Zp(o)}` : n;
}
function lc(e, t) {
  const n = Number(t.prompt?.approval?.id || 0), r = e.findIndex(
    (s) => s.id === t.id || n > 0 && Number(s.prompt?.approval?.id || 0) === n
  );
  return r < 0 ? [...e, t] : e.map((s, o) => {
    if (o !== r)
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
const fc = 3e3, FN = 80;
async function Ma(e) {
  e.consumerSignal?.throwIfAborted();
  const t = dS(e.startNode.id), n = /* @__PURE__ */ new Set();
  let r = "0-0";
  const s = {
    id: e.canvasId,
    name: "",
    sort: 0,
    status: 1,
    assetCateId: Number(e.assetCate.id || 0),
    nextNodeNo: qc(e.nodes),
    nodes: e.nodes,
    edges: e.edges,
    viewport: e.viewport || {},
    updatedAt: e.canvasUpdatedAt
  };
  await e.flushCanvasSave?.(s), e.consumerSignal?.throwIfAborted();
  let o = await b_({
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
  e.consumerSignal?.throwIfAborted(), ju(e, lr(o));
  for (let i = 0; i < 8; i += 1) {
    const c = await BN(
      e,
      o,
      r,
      (u) => {
        Qp(
          e,
          u,
          n
        ), Wp(e, u);
      },
      (u) => {
        r = u;
      }
    );
    e.canvasRun = c, ju(e, c), Ss(e, c);
    const a = Number(c.executed || 0);
    !e.singleNode && e.patchStartNodeResult !== !1 && e.onNodeResult(
      e.startNode.id,
      WS(
        c,
        wS(c, a)
      )
    );
    const d = String(c.status || "").toLowerCase();
    if (d !== "waiting") {
      if (wd(e, c), d === "fail" || d === "error")
        throw new Error(Ql(c));
      if (d === "canceled" || d === "cancelled")
        throw new Error("画布运行已取消");
      return;
    }
    await fS(e, c), o = {
      ...c,
      status: "running",
      pending_node: null
    };
  }
  throw new Error("画布运行多次等待反馈，请稍后继续");
}
function ju(e, t) {
  const n = {
    ...t,
    canvas_id: Number(t.canvas_id || e.canvasId),
    asset_cate_id: Number(t.asset_cate_id || e.assetCate.id || 0),
    start_node_id: String(t.start_node_id || e.startNode.id),
    execution_scope: String(t.execution_scope || e.executionScope || "")
  };
  e.canvasRun = n, e.onCanvasRunChange?.(n);
}
async function BN(e, t, n, r, s) {
  e.consumerSignal?.throwIfAborted();
  let o = pc(
    e,
    lr(t)
  );
  if (r(o.node_results || []), Ss(e, o), o.status !== "running" && o.status !== "pending")
    return o;
  const i = String(o.request_id || "");
  if (!i) return o;
  const c = new AbortController();
  let a = !1, d = n, u, y;
  const h = new Promise((T, U) => {
    u = T, y = U;
  }), I = () => {
    a || (a = !0, y(e.consumerSignal?.reason)), c.abort();
  }, w = (T) => {
    if (a || e.consumerSignal?.aborted) return;
    const U = Gp(o, T);
    if (o = U.detailsPending ? U : pc(e, U), e.canvasRun = o, o.detailsPending) {
      Ss(e, o), Fn(o.status) && (vs(e, Xr(o), !1), wd(e, o), c.abort());
      return;
    }
    r(o.node_results || []), Ss(e, o), !(o.status === "running" || o.status === "pending") && (a = !0, u(o), c.abort());
  }, C = e.subscribeRun(i, w);
  e.consumerSignal?.addEventListener("abort", I, {
    once: !0
  }), e.consumerSignal?.aborted && I();
  const S = {
    ...e,
    canUpdateNode: (T) => !c.signal.aborted && !e.consumerSignal?.aborted && ft(e, o, T)
  };
  (async () => {
    for (; !c.signal.aborted; ) {
      try {
        const T = await zN(
          e,
          i,
          d,
          (U) => {
            if (a || e.consumerSignal?.aborted) return;
            U.stream_id && (d = U.stream_id, s(d)), vs(
              S,
              Xr(o),
              !1
            );
            const ee = VN(U, e);
            if (ee) w(ee);
            else {
              const Z = String(
                U.output?.node_key || U.output?.node_id || ""
              );
              (!Z || ft(e, o, Z)) && qp(S, U);
            }
          },
          c.signal
        );
        T && w(T);
      } catch {
        if (c.signal.aborted) return;
      }
      if (c.signal.aborted) return;
      vs(
        S,
        Xr(o),
        !0
      ), await Kp(
        fc,
        c.signal
      );
    }
  })().catch((T) => {
    c.signal.aborted && o.detailsPending && Fn(o.status) || a || (a = !0, y(T));
  });
  try {
    return await h;
  } finally {
    C(), e.consumerSignal?.removeEventListener("abort", I), c.abort(), e.consumerSignal?.aborted || e.runningNodeBatcher?.flush();
  }
}
function vs(e, t, n) {
  const r = [...t];
  e.setRunningNode?.((s) => {
    let o = s;
    for (const i of r) {
      const c = s[i];
      !c || e.canUpdateNode?.(i) === !1 || c.status !== "running" || !!c.reconnecting === n || (o === s && (o = { ...s }), o[i] = { ...c, reconnecting: n });
    }
    return o;
  });
}
function Kp(e, t) {
  return new Promise((n, r) => {
    const s = () => {
      window.clearTimeout(o), t?.removeEventListener("abort", s), r(t?.reason);
    }, o = window.setTimeout(() => {
      t?.removeEventListener("abort", s), n();
    }, e);
    t?.addEventListener("abort", s, { once: !0 }), t?.aborted && s();
  });
}
async function zN(e, t, n, r, s) {
  let o = null;
  return await ed({
    projectId: e.projectId,
    requestId: t,
    lastId: n,
    signal: s,
    onFrame: (i) => {
      if (r(i), String(i.type || "").toLowerCase() === "result") {
        if ($N(i))
          throw new Error(i.msg || "画布流返回失败");
        o = pc(
          e,
          lr(i.output || {})
        );
      }
    }
  }), o;
}
function $N(e) {
  return Number(e.status || 0) === 2;
}
function pc(e, t) {
  if (!e.singleNode || jN(e))
    return t;
  const n = (t.node_results || []).find(
    (a) => a.node_key === e.startNode.id
  ), r = String(t.status || n?.status || "");
  if (n && (r !== "waiting" || t.pending_node))
    return t;
  const s = LN(t), o = Ie(n?.output, t.output), i = {
    execution_id: Number(t.execution_id || n?.execution_id || 0),
    node_key: e.startNode.id,
    node_type: e.startNode.type,
    node_run_id: Number(n?.node_run_id || 0),
    run_id: Number(t.run_id || n?.run_id || 0),
    request_id: String(t.request_id || n?.request_id || ""),
    status: r || "success",
    error: n?.error || t.error,
    output: o,
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
      output: o,
      approval: s
    },
    approval: Ie(n?.approval, s),
    interaction: Ie(
      n?.interaction,
      Yr(n?.result),
      Yr(t.pending_node),
      Yr(t.output)
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
function jN(e) {
  return e.singleNode && e.startNode.type === "group";
}
function LN(e) {
  const t = qi(e.output), n = qi(t.data);
  return (Array.isArray(e.approvals) ? e.approvals : Array.isArray(t.approvals) ? t.approvals : Array.isArray(n.approvals) ? n.approvals : []).find(
    (s) => Ks(s) && (s.status === "pending" || s.decision === "pending")
  );
}
function VN(e, t) {
  if (String(e.type || "").toLowerCase() === "result")
    return lr(e.output || {});
  const n = e.output || {}, r = String(n.event || "");
  if (String(n.scope || "") === "canvas_child" && r !== "waiting" || r !== "node_finished" && r !== "waiting")
    return null;
  const s = UN(n, {
    requireDisplayableResult: r !== "waiting",
    node: t?.nodes.find(
      (o) => o.id === String(n.node_key || n.node_id || "")
    )
  });
  return s ? {
    execution_id: Number(n.execution_id || 0),
    request_id: String(e.request_id || n.parent_request_id || ""),
    run_id: Number(n.parent_run_id || n.run_id || 0),
    flow_run_id: Number(n.parent_flow_run_id || n.flow_run_id || 0),
    release_id: Number(n.release_id || 0),
    status: r === "waiting" ? "waiting" : "running",
    node_results: [s],
    pending_node: r === "waiting" ? s : null
  } : null;
}
function UN(e, t = {}) {
  const n = String(e.node_key || e.node_id || "");
  if (!n)
    return null;
  const r = e.output, s = Ks(r) ? r : {}, o = qy(s, n);
  if (!o)
    return null;
  const i = o;
  return t.requireDisplayableResult && !qN(e, i, t.node) ? null : {
    ...o,
    node_key: n,
    execution_id: Number(
      e.execution_id || o.execution_id || s.execution_id || 0
    ),
    node_type: String(e.node_type || o.node_type || ""),
    node_run_id: Number(e.node_run_id || o.node_run_id || 0),
    run_id: Number(e.run_id || o.run_id || s.run_id || 0),
    request_id: String(
      e.request_id || o.request_id || s.request_id || ""
    ),
    child_run_id: Number(
      e.child_run_id || o.child_run_id || s.child_run_id || 0
    ),
    child_request_id: String(
      e.child_request_id || o.child_request_id || s.child_request_id || ""
    ),
    status: String(e.status || o.status || ""),
    error: String(e.error || o.error || s.error || ""),
    output: o.output ?? s.output ?? r,
    asset: o.asset ?? s.asset,
    version: o.version ?? s.version ?? o.asset?.version,
    result: o.result ?? o,
    approval: Ie(
      o.approval,
      KN(e, i)
    ),
    interaction: Ie(
      e.interaction,
      o.interaction,
      Yr(o)
    ),
    persists_result: !!(e.persists_result || o.persists_result),
    agent_run_id: Number(
      e.agent_run_id || o.agent_run_id || s.agent_run_id || 0
    ),
    runTiming: $s(
      Ie(e.run_timing, o.runTiming, s.run_timing)
    )
  };
}
function KN(e, t) {
  const n = qi(t.result), r = Ie(
    e.approval,
    t.approval,
    n.approval
  );
  if (r && typeof r == "object")
    return r;
  const s = Number(
    Ie(
      e.approval_id,
      t.approval_id,
      n.approval_id
    ) || 0
  );
  return s > 0 ? { id: s } : void 0;
}
function Yr(e, t = 0) {
  if (!e || typeof e != "object" || Array.isArray(e) || t > 6)
    return;
  const n = e;
  if (n.interaction && typeof n.interaction == "object" && !Array.isArray(n.interaction))
    return n.interaction;
  for (const s of ["result", "pending_node"]) {
    const o = Yr(n[s], t + 1);
    if (o)
      return o;
  }
  const r = Array.isArray(n.node_results) ? n.node_results : [];
  for (const s of r) {
    const o = Yr(s, t + 1);
    if (o)
      return o;
  }
}
function qN(e, t, n) {
  if (e.persists_result || String(e.node_type || "") !== "function")
    return !0;
  const s = String(
    e.function_key || t.function_key || n?.functionOption?.key || ""
  ), o = eo(s);
  return o?.runsInBackend && !o.persistsResult ? !0 : !!(t.asset || t.version || Fe(t, "asset", "version") || Fe(t, "data", "asset") || Fe(t, "data", "version"));
}
function qp(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.output || {}, r = String(n.event || ""), s = String(n.node_key || n.node_id || "");
  if (s) {
    if (r !== "node_output" && e.runningNodeBatcher?.flush(), r === "node_started") {
      e.setRunningNode((o) => {
        if (e.canUpdateNode?.(s) === !1) return o;
        const i = o[s];
        return {
          ...o,
          [s]: {
            ...i,
            ...cd(i),
            nodeId: s,
            title: String(n.node_name || n.node_key || s),
            startedAt: jc({
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
      const o = (i) => {
        if (!i || i.status !== "running" || e.canUpdateNode?.(s) === !1)
          return i;
        const c = Lu(n.output), a = String(n.node_type || "").toLowerCase(), d = a === "power", u = a === "agent", y = Lu(c.meta), h = Xl(
          Ie(
            y.estimated_duration_ms,
            y.estimatedDurationMs
          )
        ), I = {
          ...i,
          progress: Math.max(i.progress, 72),
          estimatedDurationMs: h || i.estimatedDurationMs
        };
        return {
          ...d ? VI(I, c) : I,
          agent: u ? gw(i.agent, c) : i.agent
        };
      };
      e.runningNodeBatcher ? e.runningNodeBatcher.enqueue(s, o) : e.setRunningNode((i) => {
        const c = o(i[s]);
        return c === i[s] ? i : c ? { ...i, [s]: c } : up(i, s);
      });
    }
  }
}
function GN(e, t, n, r) {
  const s = t.output || {}, o = String(s.event || ""), i = String(s.node_key || s.node_id || "");
  if (!(!i || n.size > 0 && !n.has(i) || r.has(i))) {
    if (o === "node_finished") {
      r.add(i), e.runningNodeBatcher?.flush();
      return;
    }
    qp(e, t);
  }
}
function Lu(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? {} : e;
}
function Gp(e, t) {
  if (e.request_id && t.request_id && e.request_id !== t.request_id || e.run_id && t.run_id && e.run_id !== t.run_id || Fn(e.status) && !Fn(t.status))
    return e;
  const n = [...e.node_results || []], r = /* @__PURE__ */ new Map();
  n.forEach((s, o) => {
    const i = Wi(s);
    r.has(i) || r.set(i, o);
  });
  for (const s of t.node_results || []) {
    const o = Wi(s), i = r.get(o);
    i !== void 0 ? n[i] = s : (r.set(o, n.length), n.push(s));
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
function Wp(e, t) {
  if (!e.setRunningNode)
    return;
  const n = t.filter(
    (r) => Fn(r.status) && ft(e, e.canvasRun, r.node_key)
  );
  n.length !== 0 && (e.setRunningNode(
    (r) => WN(e, r, n)
  ), Ns(
    e,
    n.map((r) => r.node_key),
    650
  ));
}
function Ns(e, t, n, r = e.canvasRun) {
  const s = /* @__PURE__ */ new Map();
  e.setRunningNode?.((o) => {
    for (const i of t) {
      const c = o[i];
      c && (c.status === "success" || c.status === "error") && ft(e, r, i) && s.set(i, c);
    }
    return o;
  }), window.setTimeout(() => {
    e.setRunningNode?.((o) => {
      let i = o;
      for (const [c, a] of s)
        o[c] !== a || !ft(e, r, c) || (i === o && (i = { ...o }), delete i[c]);
      return i;
    });
  }, n);
}
function WN(e, t, n) {
  let r = !1;
  const s = { ...t };
  for (const o of n) {
    const i = o.node_key;
    if (!ft(e, e.canvasRun, i)) continue;
    const c = e.nodes.find((d) => d.id === i);
    if (o.status === "canceled") {
      s[i] && (delete s[i], r = !0);
      continue;
    }
    if (o.status === "waiting") {
      s[i] = {
        nodeId: i,
        title: c?.title || i,
        startedAt: jc({
          nodeRunTiming: o.runTiming,
          currentStartedAt: t[i]?.startedAt
        }),
        progress: 92,
        status: "waiting"
      }, r = !0;
      continue;
    }
    const a = s[i];
    a && (s[i] = {
      ...a,
      startedAt: o.runTiming?.startedAt || a.startedAt,
      finishedAt: o.runTiming?.finishedAt || Date.now(),
      progress: 100,
      status: o.status === "success" ? "success" : "error",
      reconnecting: !1,
      agent: c?.type === "agent" ? yw(o.output) : a.agent
    }, r = !0);
  }
  return r ? s : t;
}
function wd(e, t, n) {
  if (!e.setRunningNode || t.status === "running" || t.status === "pending" || t.status === "waiting")
    return;
  if (t.status === "canceled") {
    e.setRunningNode((s) => {
      const o = Vu(
        e,
        t,
        s,
        n
      );
      if (o.length === 0)
        return s;
      const i = { ...s };
      for (const c of o)
        delete i[c];
      return i;
    });
    return;
  }
  const r = t.status === "success" ? "success" : "error";
  e.setRunningNode((s) => {
    let o = !1;
    const i = { ...s }, c = Vu(
      e,
      t,
      s,
      n
    );
    for (const a of c) {
      const d = i[a];
      d && (i[a] = {
        ...d,
        progress: r === "success" ? 100 : Math.max(d.progress, 92),
        status: r,
        reconnecting: !1
      }, o = !0);
    }
    return o ? i : s;
  }), Ns(
    e,
    Hp(e, t).filter(
      (s) => s === Lo(t) || !n || n.has(s)
    ),
    r === "success" ? 650 : 1200,
    t
  );
}
function Vu(e, t, n, r) {
  const s = Lo(t), o = new Set(
    Hp(e, t).filter(
      (i) => i === s || !r || r.has(i)
    )
  );
  return Object.keys(n).filter(
    (i) => o.has(i) && ft(e, t, i)
  );
}
function HN(e, t, n) {
  if (!e.setRunningNode)
    return;
  const r = String(t.status || "").trim().toLowerCase();
  if (!["running", "pending", "waiting"].includes(r))
    return;
  const s = mc(t), o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const y of t.node_runs || [])
    y.node_key && y.runTiming && i.set(String(y.node_key), y.runTiming);
  for (const y of t.node_results || [])
    y.node_key && y.runTiming && i.set(y.node_key, y.runTiming);
  const c = Lo(t);
  let a = !1, d = "";
  for (const y of t.node_runs || []) {
    const h = String(y.node_key || "");
    if (!h || s.has(h) || n && !n.has(h))
      continue;
    a = !0;
    const I = String(y.status || "").trim().toLowerCase();
    I === "running" ? o.set(h, "running") : I === "waiting" ? o.set(h, "waiting") : I === "pending" && !d && (d = h);
  }
  const u = String(t.pending_node?.node_key || "");
  if (u && !s.has(u) && (!n || n.has(u)) && o.set(u, "waiting"), o.size === 0 && d && o.set(d, "running"), o.size === 0 && !a) {
    const y = H_(
      t.start_node_id,
      c
    );
    y && !s.has(y) && (!n || n.has(y)) && o.set(
      y,
      r === "waiting" ? "waiting" : "running"
    );
  }
  c && o.set(
    c,
    r === "waiting" ? "waiting" : "running"
  ), o.size !== 0 && e.setRunningNode((y) => {
    let h = !1;
    const I = { ...y };
    for (const [w, C] of o) {
      if (!ft(e, t, w)) continue;
      const S = e.nodes.find((ee) => ee.id === w), x = w === c;
      if (!S && !x)
        continue;
      const T = y[w], U = jc({
        nodeRunTiming: i.get(w),
        runCreatedAt: t.created_at,
        currentStartedAt: T?.startedAt
      });
      T?.status === C && T.startedAt === U || (I[w] = {
        ...T,
        ...cd(T),
        nodeId: w,
        title: x ? `${e.startNode.title || "分镜脚本"}制作区` : S?.title || w,
        startedAt: U,
        progress: C === "waiting" ? 92 : T?.progress || 0,
        status: C
      }, h = !0);
    }
    return h ? I : y;
  });
}
function Hp(e, t) {
  const n = new Set(Xr(t)), r = Lo(t);
  return r && n.add(r), e.singleNode && n.add(e.startNode.id), [...n];
}
function YN(e, t, n, r) {
  const s = new Set(
    e.memberNodeIds.filter(
      (i) => It(n[i])
    )
  );
  if (s.size === 0 && t) {
    for (const i of t.node_runs || []) {
      const c = String(i.status || "").trim().toLowerCase();
      (c === "running" || c === "waiting") && s.add(String(i.node_key || ""));
    }
    s.size === 0 && t.pending_node?.node_key && s.add(t.pending_node.node_key);
  }
  const o = [...s].filter(Boolean).map((i) => r.get(i)?.title || i).filter((i, c, a) => a.indexOf(i) === c);
  return o.length > 1 ? `${o[0]} 等 ${o.length} 个节点` : o[0] || "";
}
function XN(e, t, n) {
  if (n)
    return "停止中";
  const r = String(e?.status || "").trim().toLowerCase();
  if (It(t) || e && _n(e))
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
function ZN({
  frame: e,
  nodeById: t,
  groupMembersById: n,
  runBlockedReasonByNodeId: r,
  runningNodes: s,
  frameRunning: o,
  activeRunByStartNodeId: i,
  stoppingCanvasRunKeys: c,
  hasResult: a,
  onRunGroup: d,
  onRunNode: u,
  onStopRun: y,
  onOpenNode: h,
  projectNode: I,
  reuse: w,
  projectionDependencies: C
}) {
  const S = e.memberNodeIds.map((T) => t.get(T)).filter(
    (T) => T?.type === "group" && T.group?.origin === "script"
  ).map((T) => {
    const U = n.get(T.id) || Ni;
    return Uu({
      executionNode: T,
      members: U,
      runBlockedReasonByNodeId: r,
      runningNodes: s,
      frameRunning: o,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => d(T.id),
      onStopRun: y,
      onOpenNode: h,
      projectNode: I,
      reuse: w,
      projectionDependencies: C
    });
  }), x = e.workNodeIds.map((T) => t.get(T)).find((T) => T?.storyboardItem?.itemType === "video_compose");
  return x && S.push(
    Uu({
      executionNode: x,
      members: [x],
      runBlockedReasonByNodeId: r,
      runningNodes: s,
      frameRunning: o,
      activeRunByStartNodeId: i,
      stoppingCanvasRunKeys: c,
      hasResult: a,
      onRun: () => u(x.id),
      onStopRun: y,
      onOpenNode: h,
      projectNode: I,
      reuse: w,
      projectionDependencies: C
    })
  ), S;
}
function Uu({
  executionNode: e,
  members: t,
  runBlockedReasonByNodeId: n,
  runningNodes: r,
  frameRunning: s,
  activeRunByStartNodeId: o,
  stoppingCanvasRunKeys: i,
  hasResult: c,
  onRun: a,
  onStopRun: d,
  onOpenNode: u,
  projectNode: y,
  reuse: h,
  projectionDependencies: I
}) {
  const w = o.get(e.id), C = !!(w && i.has(Tt(w)));
  return h(
    "group",
    e.id,
    [
      e,
      ...t,
      t.length,
      s,
      w,
      C,
      n.get(e.id),
      r[e.id],
      ...t.flatMap((S) => [r[S.id], c(S)]),
      d,
      u,
      ...I(t)
    ],
    () => {
      const S = Xc({
        members: t,
        runningNodes: r,
        groupState: r[e.id],
        hasResult: c
      }), x = String(w?.status || "").trim().toLowerCase(), T = w && S.status === "idle" ? x === "waiting" ? "waiting" : "running" : S.status, U = T === "running" || T === "waiting", ee = S.runnableCount === 0, Z = U ? "" : s ? "制作区正在执行" : n.get(e.id) || (ee ? "当前分组未配置可用能力" : "");
      return {
        id: e.id,
        title: e.title || "未命名分组",
        memberCount: S.memberCount,
        runnableCount: S.runnableCount,
        completedCount: S.completedCount,
        failedCount: S.failedCount,
        status: T,
        runBlockedReason: Z,
        stopping: C,
        results: t.map(
          (oe) => JN(
            oe,
            r[oe.id],
            c(oe),
            u,
            y,
            h
          )
        ),
        onRun: !U && !Z ? a : void 0,
        onStop: w ? () => d(e.id) : void 0
      };
    }
  );
}
function JN(e, t, n, r, s, o) {
  const i = s(e), c = QN(t, n);
  return o("result", e.id, [i, c, r], () => ({
    nodeId: e.id,
    status: c,
    node: i,
    onOpen: () => r(e.id)
  }));
}
function QN(e, t) {
  return e?.status === "running" ? "running" : e?.status === "waiting" ? "waiting" : e?.status === "error" ? "error" : t ? "complete" : "pending";
}
function Lo(e) {
  if (String(e.execution_scope || "").trim() !== "storyboard_frame")
    return "";
  const t = String(e.start_node_id || "").trim();
  return t ? ta(t) : "";
}
function yi(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) return n === t.id;
  const r = Number(e.asset_cate_id || 0);
  return r === 0 || r === t.assetCateId;
}
function Xr(e) {
  const t = /* @__PURE__ */ new Set(), n = String(e.start_node_id || "");
  n && t.add(n);
  for (const r of e.target_node_ids || [])
    t.add(r);
  for (const r of e.node_runs || [])
    r.node_key && t.add(r.node_key);
  for (const r of e.node_results || [])
    r.node_key && t.add(r.node_key);
  for (const r of e.execution_plan?.nodes || [])
    r.id && t.add(r.id);
  return [...t];
}
function mc(e) {
  return new Set(
    (e.node_results || []).filter(
      (t) => Fn(js(t))
    ).map((t) => t.node_key).filter(Boolean)
  );
}
function eS(e) {
  return Yp(e).map((t) => t.run);
}
function tS(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    _n(n) && t.set(Tt(n), n);
  return [...t.values()];
}
function nS(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const r = String(n.status || "").trim();
    if (r)
      for (const s of Gi(n))
        t.set(s, r);
  }
  return t;
}
function rS(e, t) {
  for (const n of Gi(t)) {
    const r = e.get(n);
    if (r)
      return r;
  }
  return "";
}
function Gi(e) {
  const t = [];
  Number(e.execution_id || 0) > 0 && t.push(`execution:${Number(e.execution_id)}`), Number(e.run_id || 0) > 0 && t.push(`run:${Number(e.run_id)}`);
  const n = String(e.request_id || "").trim();
  return n && t.push(`request:${n}`), t;
}
function Yp(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const r of e) {
    const s = /* @__PURE__ */ new Set();
    for (const o of Xr(r))
      t.has(o) || (t.add(o), s.add(o));
    s.size !== 0 && _n(r) && n.push({ run: r, managedNodeIds: s });
  }
  return n;
}
function fs(e) {
  return e.map(Xp).filter((t) => !!t);
}
function Xp(e) {
  const t = lr(e);
  return t.run_id || t.request_id ? t : null;
}
function oS(e, t, n) {
  const r = new Map(t.map((o) => [Tt(o), o])), s = /* @__PURE__ */ new Set();
  for (const o of e) {
    const i = Number(o.run_id || 0);
    if (!i || n && Ky(o, n))
      continue;
    const c = r.get(Tt(o));
    !c?.detailsPending && n && sS(o, n) || (!c || c.detailsPending || c.status !== o.status || c.executed !== o.executed || c.total !== o.total || c.error !== o.error || o.status === "waiting" && !c.pending_node) && s.add(i);
  }
  return [...s];
}
function sS(e, t) {
  const n = Number(e.canvas_id || 0);
  if (n > 0) {
    const o = t[String(n)];
    return o ? gc(e, o) : !1;
  }
  const r = Number(e.asset_cate_id || 0);
  return (r ? Object.values(t).filter(
    (o) => o.assetCateId === r
  ) : Object.values(t)).some(
    (o) => gc(e, o)
  );
}
function gc(e, t) {
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
      const u = r.get(d.node_key);
      if (u && (a += 1, !Xa(u, e, d)))
        return !1;
    }
    return a > 0;
  }
  const s = String(e.start_node_id || ""), o = r.get(s), i = (e.node_results || []).find(
    (c) => c.node_key === s
  );
  return Xa(o, e, i);
}
function Da(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e)
    n.set(Tt(s), s);
  for (const s of t) {
    const o = Tt(s), i = n.get(o);
    n.set(o, i ? Gp(i, s) : s);
  }
  let r = 0;
  return [...n.values()].sort(iS).filter((s) => _n(s) || s.detailsPending || r++ < 50);
}
function iS(e, t) {
  const n = Number(t.execution_id || 0) - Number(e.execution_id || 0);
  if (n !== 0)
    return n;
  const r = Ku(t) - Ku(e);
  return r !== 0 ? r : Number(t.run_id || 0) - Number(e.run_id || 0);
}
function Ku(e) {
  const t = Date.parse(String(e.updated_at || e.created_at || ""));
  return Number.isFinite(t) ? t : 0;
}
function aS(e, t) {
  const n = e.start_node_id || e.execution_plan?.order?.[0] || e.execution_plan?.nodes?.[0]?.id || "";
  if (n) {
    const r = t.find((s) => s.id === n);
    if (r)
      return r;
  }
  return t.find(qs) || t[0] || null;
}
function cS(e, t) {
  return [
    e.run_id || e.request_id || "",
    Wi(t)
  ].join(":");
}
function Ea(e, t, n, r) {
  const s = e.find(
    (o) => o.canvas_id === t && Xr(o).includes(r)
  );
  return s ? Gi(s).some(
    (o) => Gi(n).includes(o)
  ) : !0;
}
function ft(e, t, n) {
  const r = n === Lo(t || {}) ? e.startNode.id : n;
  return !t || !e.ownsNodeResult || e.ownsNodeResult(t, r);
}
function dS(e) {
  return `canvas-${typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}-${e}`.slice(0, 64);
}
function uS(e, t, n) {
  const r = typeof n == "string" ? n : xi(n), s = Math.floor(Date.now() / 5e3);
  return `${e}-${t}-${s}-${Zp(r)}`.slice(
    0,
    96
  );
}
function Zp(e) {
  let t = 5381;
  for (let n = 0; n < e.length; n += 1)
    t = t * 33 ^ e.charCodeAt(n);
  return (t >>> 0).toString(36);
}
function Ss(e, t, n) {
  lS(e, t), HN(e, t, n);
}
function lS(e, t) {
  if (t.status !== "waiting")
    return;
  const n = t.pending_node;
  if (!n?.node_key)
    return;
  const r = e.nodes.find((a) => a.id === n.node_key);
  if (!r || !ft(e, t, r.id))
    return;
  const s = bd(n, r);
  if (!s)
    return;
  const o = _d(r, s), i = qr(r), c = lc(
    i,
    o
  );
  if (xi(i) !== xi(c)) {
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
async function fS(e, t) {
  const n = t.pending_node;
  if (!n?.node_key)
    throw new Error("画布运行等待反馈，但缺少等待节点");
  const r = e.nodes.find((i) => i.id === n.node_key);
  if (!r)
    throw new Error("画布运行等待节点不存在");
  const s = bd(n, r);
  if (!s || !e.requestFlowFeedback)
    throw new Error(`${r.title} 需要补充信息，请单独处理后继续`);
  const o = await e.requestFlowFeedback({ node: r, prompt: s });
  return Jp(
    e.projectId,
    t,
    n,
    s,
    o
  );
}
async function Jp(e, t, n, r, s) {
  return r.interaction ? k_({
    projectId: e,
    runId: Number(r.interaction.runId || n.child_run_id || 0),
    nodeRunId: Number(r.interaction.nodeRunId || 0),
    interactionId: String(r.interaction.interaction.id || ""),
    data: s
  }) : N_({
    projectId: e,
    runId: Number(t.run_id || 0),
    requestId: String(t.request_id || ""),
    nodeKey: n.node_key,
    approvalId: Number(r.approval.id || 0),
    feedback: s
  });
}
function pS(e, t, n) {
  for (const r of e) {
    if (String(r.status || "").trim().toLowerCase() !== "waiting")
      continue;
    const s = r.pending_node;
    if (!s || s.node_key !== t.id)
      continue;
    const o = bd(s, t);
    if (!o)
      continue;
    if (_d(t, o).id === n.id)
      return { run: r, pending: s, prompt: o };
  }
  return null;
}
function bd(e, t) {
  const n = e.interaction && typeof e.interaction == "object" ? e.interaction : Yr(e);
  if (n?.interaction?.id)
    return zf({
      runId: Number(n.run_id || e.child_run_id || 0),
      nodeRunId: Number(n.node_run_id || 0),
      interaction: n.interaction
    });
  if ((e.node_type || t.type) === "flow") {
    const s = e.output && typeof e.output == "object" ? { ...e.output } : e.result && typeof e.result == "object" ? { ...e.result } : {}, o = Ie(
      e.approval,
      Fe(e.result, "approval"),
      Fe(e.output, "approval")
    );
    o && !Array.isArray(s.approvals) && (s.approvals = [o]);
    const i = Zw(s);
    return Jw(i);
  }
  return eb(e, t.title);
}
function Qp(e, t, n) {
  let r = 0;
  const s = new Map(e.nodes.map((o) => [o.id, o]));
  for (const o of t) {
    const i = s.get(o.node_key), c = js(o);
    if (!i || !Fn(c) || !ft(e, e.canvasRun, o.node_key))
      continue;
    const a = Wi(o), d = e.canvasRun ? [e.projectId, e.canvasId, cS(e.canvasRun, o), o.runTiming?.finishedAt || ""].join(":") : "";
    if (d && e.appliedResultKeys?.has(d) || c === "success" && a && n?.has(a) && (!o.runTiming || i.runTiming?.finishedAt === o.runTiming.finishedAt))
      continue;
    const u = yS(e, i, o);
    e.onNodeResult(i.id, u), d && e.appliedResultKeys?.add(d), a && n?.add(a), c === "success" && (r += 1);
    const y = {
      ...i,
      ...u
    };
    s.set(i.id, y), e.nodes = e.nodes.map(
      (h) => h.id === i.id ? y : h
    ), c === "success" && u.asset && e.onAssetCreated(u.asset), c === "success" && e.requestNodeTitle?.(y, o);
  }
  return r;
}
function mS(e, t) {
  const n = Hr(e).prompt.trim(), s = (t ? rm(e.id, t.nodes, t.edges) : null)?.text.trim() || "", o = [n, s ? `上游内容：
${s}` : ""].filter(Boolean).join(`

`);
  return Array.from(o).slice(0, uN).join("");
}
function gS(e, t) {
  return e.type !== "power" || e.titleMode !== "auto" || e.storyboardItem || js(t) !== "success" || Number(t.version_id || 0) <= 0 || !uf(e) ? !1 : !["storyboard", "writing"].includes(
    cn(e.power, e.kind, e.outputType).viewMode
  );
}
function Wi(e) {
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
function yS(e, t, n) {
  const r = js(n), s = hS(n.runTiming) || _S(e, n.node_key), o = (a) => s ? { ...a, runTiming: s } : a;
  if (r === "fail")
    return o(
      Pa(t, {
        resultRef: Qc(n),
        runError: Gy(n)
      })
    );
  if (r === "canceled")
    return o(
      Pa(t, { runError: "" })
    );
  const i = Iw({
    result: n,
    previousAsset: t.asset,
    previousAssets: e.space.assets
  }), c = (a) => Pa(t, a);
  return o(
    c(i ? {
      ...Qr(
        t,
        vw(n, i),
        "后端执行结果"
      ),
      runError: ""
    } : {
      ...Qr(t, n, "后端执行结果"),
      runError: ""
    })
  );
}
function hS(e) {
  if (!(!e?.startedAt || !e.finishedAt || e.finishedAt < e.startedAt))
    return e;
}
function _S(e, t) {
  const n = e.getRunningNode?.(t);
  if (n?.startedAt)
    return {
      startedAt: n.startedAt,
      finishedAt: n.finishedAt || Date.now()
    };
}
function Pa(e, t) {
  const n = qr(e);
  return n.length === 0 || Array.isArray(t.feedbackRequests) ? t : {
    ...t,
    feedbackRequests: n
  };
}
function wS(e, t) {
  return e.status === "waiting" ? `已执行 ${t} 个连接节点，等待补充信息` : e.status === "fail" || e.status === "error" ? Ql(
    e,
    `画布运行失败，已执行 ${t} 个连接节点`
  ) : `已执行 ${t} 个连接节点`;
}
async function bS(e) {
  const t = IS(e.assetCateId);
  if (!t)
    throw new Error("当前团队没有配置资产分类，不能保存作品");
  const n = await M_({
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
  }), r = e.previousAsset || e.previousAssets?.find((s) => s.id === n.id) || null;
  return dr(n, r);
}
function IS(e) {
  return Math.max(0, Number(e || 0));
}
function no(e) {
  const t = $n(e), n = yr(
    t,
    aa(e, t)
  );
  return fr(n) || (n.text = Jt(t, "")), n;
}
function aa(e, t) {
  const n = Gv(t);
  return e.type === "power" ? $e(
    String(e.power?.kind || ""),
    n,
    String(e.asset?.kind || ""),
    String(e.kind || "")
  ) : $e(
    String(e.asset?.kind || ""),
    String(e.power?.kind || ""),
    n,
    String(e.kind || "")
  );
}
function Oa(e) {
  const t = no(e);
  if (fr(t))
    return t;
  const n = yr(
    $n(e),
    String(e.kind || e.power?.kind || "")
  );
  return fr(n) || (n.text = Jt($n(e), "")), n;
}
function Id(e) {
  return NS(e) || $v(e);
}
function On(e) {
  return e.storyboardItem?.itemType === "subtitle" ? { text: e.description || "字幕轨已准备" } : $n(e);
}
function Si(e) {
  return [
    e.asset?.version?.content,
    e.resultOutput,
    On(e)
  ];
}
function vS(e) {
  const t = e.composerDraft?.paramValues || {};
  return $e(
    t.aspectRatio,
    t.aspect_ratio,
    t.ratio
  );
}
function NS(e) {
  return Ev(
    e.asset?.version?.content,
    e.resultOutput
  );
}
function hi(e, t) {
  return e?.screenToFlowPosition ? e.screenToFlowPosition(t) : e?.project ? e.project(t) : t;
}
function SS(e, t, n, r) {
  const s = r?.x ?? e.x + 34, o = r?.y ?? e.y + 34;
  return {
    ...e,
    id: `local-${e.type}-${Date.now()}-${n}`,
    nodeNo: void 0,
    title: `${e.title} 副本`,
    titleMode: "manual",
    x: s,
    y: o,
    assetCateId: e.assetCateId || t,
    group: e.type === "group" && e.group?.origin === "script" ? { origin: "manual" } : e.group,
    storyboardItem: void 0,
    storyboardMaterializedSignature: void 0,
    storyboardFramePlanVersion: void 0,
    composerDraft: e.composerDraft ? { ...e.composerDraft, paramBindings: void 0 } : void 0,
    local: !0
  };
}
function CS(e, t, n) {
  const r = em(e), s = tm(
    e,
    t,
    r,
    "",
    n
  ), o = (i) => r.hasResultByNodeId.get(i.id) || !1;
  return {
    ...r,
    ...s,
    runBlockedReasonByNodeId: new Map(
      e.map((i) => [
        i.id,
        kf({
          targets: i.type === "group" ? r.groupMembersById.get(i.id) || [] : [i],
          nodesByID: r.nodeById,
          hasResult: o
        })
      ])
    )
  };
}
function em(e) {
  const t = new Map(e.map((s) => [s.id, s])), n = new Map(
    e.map((s) => [s.id, an(s)])
  ), r = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!s.groupId)
      continue;
    const o = r.get(s.groupId) || [];
    o.push(s), r.set(s.groupId, o);
  }
  return { nodeById: t, groupMembersById: r, hasResultByNodeId: n };
}
function tm(e, t, n, r = "", s) {
  const { nodeById: o, groupMembersById: i, hasResultByNodeId: c } = n, a = (C) => {
    const S = o.get(C);
    return S ? S.type === "group" ? i.get(S.id) || [] : [S] : [];
  }, d = /* @__PURE__ */ new Set();
  for (const C of t) {
    const S = Bt(C);
    if (r && S.targetNodeId !== r)
      continue;
    const { sourceNodeId: x } = S;
    for (const T of a(x))
      d.add(T.id);
  }
  const u = /* @__PURE__ */ new Map();
  for (const C of e)
    if (d.has(C.id)) {
      const S = kS(
        C,
        c.get(C.id) || !1
      );
      S && qu(S).trim() !== "" && u.set(C.id, S);
    }
  const y = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  for (const C of t) {
    const { sourceNodeId: S, targetNodeId: x } = Bt(C);
    if (!(r && x !== r || !o.has(x)))
      for (const T of a(S)) {
        if (Ul(C) && Ac(T)) {
          const oe = h.get(x) || [];
          oe.push({ edge: C, source: T }), h.set(x, oe);
        }
        const U = u.get(T.id), ee = I.get(x) || /* @__PURE__ */ new Set();
        if (!U || ee.has(T.id))
          continue;
        ee.add(T.id), I.set(x, ee);
        const Z = y.get(x) || [];
        Z.push(U), y.set(x, Z);
      }
  }
  const w = /* @__PURE__ */ new Map();
  for (const [C, S] of h) {
    const x = s?.incomingMediaReferencesByNodeId.get(C);
    if (!x) continue;
    const T = S.map((U, ee) => {
      const Z = x[ee];
      return Z?.edge === U.edge && Z.source === U.source ? Z : U;
    });
    h.set(
      C,
      T.length === x.length && T.every(
        (U, ee) => U === x[ee]
      ) ? x : T
    );
  }
  for (const [C, S] of y)
    w.set(C, {
      sources: S,
      text: S.map(qu).join(`

`)
    });
  return {
    inputContextByNodeId: w,
    incomingMediaReferencesByNodeId: h
  };
}
function Bt(e) {
  return {
    sourceNodeId: e.logicalFrom || e.from,
    targetNodeId: e.logicalTo || e.to
  };
}
function nm(e, t, n) {
  const r = [];
  for (const s of t) {
    if (!Ul(s))
      continue;
    const o = Bt(s);
    if (o.targetNodeId === n)
      for (const i of Gl(
        e,
        o.sourceNodeId
      ))
        Ac(i) && r.push({ edge: s, source: i });
  }
  return r;
}
function rm(e, t, n) {
  const r = em(t);
  return tm(
    t,
    n,
    r,
    e
  ).inputContextByNodeId.get(e) || null;
}
function kS(e, t) {
  if (!t)
    return null;
  const n = $n(e), r = aa(e, n), s = yr(n, r);
  return fr(s) || (s.text = Jt(
    n,
    e.description || e.title
  )), {
    nodeId: e.id,
    title: e.title,
    type: e.type,
    kind: r,
    output: n,
    preview: s,
    resultRef: e.resultRef
  };
}
function RS(e, t) {
  return e === t ? !0 : !e || !t || e.text !== t.text ? !1 : e.sources.length === t.sources.length && e.sources.every((n, r) => {
    const s = t.sources[r];
    return n.nodeId === s.nodeId && n.title === s.title && n.type === s.type && n.kind === s.kind && n.output === s.output && n.resultRef === s.resultRef && n.preview.text === s.preview.text && n.preview.imageUrl === s.preview.imageUrl && n.preview.videoUrl === s.preview.videoUrl && n.preview.audioUrl === s.preview.audioUrl && n.preview.fileUrl === s.preview.fileUrl;
  });
}
function qu(e) {
  const t = e.preview, n = t.text || t.imageUrl || t.videoUrl || t.audioUrl || t.fileUrl || Bp(e.output);
  return String(n || "").trim() ? `[${e.title}]
${n}` : "";
}
function yc(e, t) {
  return Py(e, t);
}
function Gu(e, t) {
  return e.handleType === "target" ? {
    source: t,
    target: e.nodeId
  } : {
    source: e.nodeId,
    target: t
  };
}
function En(e, t, n, r) {
  return !t || !n || t === n || e.some((o) => {
    const i = Bt(o);
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
function hc(e) {
  return Number(e.asset?.asset_cate_id || e.assetCateId || 0);
}
function _c(e, t) {
  return e.type === "asset" && hc(e) === t;
}
function Wu(e, t, n, r) {
  const s = new Map(e.map((o) => [o.id, o]));
  if (r)
    for (const o of t) {
      if (o.from !== r)
        continue;
      const i = s.get(o.to);
      if (i && _c(i, n))
        return i;
    }
  return e.find((o) => _c(o, n)) || null;
}
function Hu(e, t, n, r, s) {
  const o = /* @__PURE__ */ new Set();
  if (!r || !n)
    return o;
  const i = new Map(e.map((c) => [c.id, c]));
  for (const c of t) {
    if (c.from !== r || c.to === s)
      continue;
    const a = i.get(c.to);
    a && _c(a, n) && o.add(a.id);
  }
  return o;
}
function Fa(e, t) {
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
function xS(e) {
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
function AS(e) {
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
function TS(e, t) {
  const n = new Set(e.nodes.map((i) => i.id));
  let r = !1;
  const s = e.nodes.map((i) => {
    const c = Number(i.assetCateId ?? t), a = i.local !== !1;
    return i.assetCateId === c && i.local === a ? i : (r = !0, {
      ...i,
      assetCateId: c,
      local: a
    });
  }), o = e.edges.filter(
    (i) => n.has(i.from) && n.has(i.to)
  );
  return af({
    id: e.id,
    name: e.name,
    sort: e.sort,
    status: e.status,
    assetCateId: t,
    nextNodeNo: e.nextNodeNo,
    nodes: r ? s : e.nodes,
    edges: o.length === e.edges.length ? e.edges : o,
    viewport: e.viewport || {},
    updatedAt: e.updatedAt
  });
}
function MS(e, t) {
  return Object.fromEntries(
    Object.entries(e).map(([n, r]) => [
      n,
      xo(r, t)
    ])
  );
}
function xo(e, t) {
  const n = t.filter(
    (c) => Number(c.canvas_id || 0) === e.id
  ), r = new Map(t.map((c) => [c.id, c])), s = new Map(
    n.filter(
      (c) => String(c.role || "") === "material" && String(c.status || "") !== "archived" && String(c.node_key || c.version?.node_key || "").trim()
    ).map((c) => [
      String(c.node_key || c.version?.node_key || "").trim(),
      c
    ])
  ), o = t.length ? e.nodes.map((c) => DS(c, r, s)) : e.nodes, i = Hb(o);
  return i === e.nodes ? e : { ...e, nodes: i };
}
function DS(e, t, n) {
  const r = om(e), s = (r > 0 ? t.get(r) : void 0) || (e.type === "power" || e.type === "agent" || e.type === "flow" ? n.get(e.id) : void 0);
  if (!s)
    return e;
  const o = Is(e, s), i = Number(o.resultRef?.run_id || 0), c = Number(e.resultRef?.run_id || 0);
  return {
    ...e,
    ...o,
    ...e.runError && i > c ? { runError: "" } : {},
    asset: s
  };
}
function om(e) {
  return Number(e.resultRef?.asset_id || e.asset?.id || 0);
}
function ES(e) {
  if (!Fo(e, "import"))
    return null;
  const t = om(e);
  return t > 0 ? { nodeId: e.id, assetID: t } : null;
}
function PS(e, t) {
  return e === t || e.assetCateId === t.assetCateId && sm(e.nodes, t.nodes) && im(e.edges, t.edges) && e.viewport.x === t.viewport.x && e.viewport.y === t.viewport.y && e.viewport.zoom === t.viewport.zoom && e.updatedAt === t.updatedAt;
}
function sm(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => n === t[r]);
}
function OS(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.memberCount === t.memberCount && e.runnableCount === t.runnableCount && e.completedCount === t.completedCount && e.failedCount === t.failedCount && e.status === t.status;
}
function im(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const s = t[r];
    return n === s || n.id === s.id && n.from === s.from && n.to === s.to && (n.logicalFrom || "") === (s.logicalFrom || "") && (n.logicalTo || "") === (s.logicalTo || "") && (n.purpose || "") === (s.purpose || "") && (n.executionMode || "auto") === (s.executionMode || "auto") && (n.mediaUsage || "") === (s.mediaUsage || "");
  });
}
function FS(e, t) {
  return yc(e, t) ? { source: e.id, target: t.id } : yc(t, e) ? { source: t.id, target: e.id } : null;
}
function BS(e) {
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
function zS(e, t) {
  return !e && !t ? !0 : !e || !t ? !1 : e.source === t.source && e.target === t.target;
}
function $S(e, t, n) {
  const s = new Map(n.map((i) => [i.id, i]));
  let o = null;
  for (const i of t) {
    if (i.id === e.id)
      continue;
    const c = s.get(i.id);
    if (!c)
      continue;
    const a = i.position.x - e.position.x, d = i.position.y - e.position.y, u = Math.sqrt(a * a + d * d);
    u < 150 && (!o || u < o.distance) && (o = { distance: u, domainNode: c });
  }
  return o;
}
function jS(e, t, n, r, s, o, i) {
  const c = e.id === s, a = o.has(e.id), d = c || a || e.source === n || e.target === n || e.source === r || e.target === r, u = e.source === n || e.target === n ? n : r;
  return {
    highlighted: d,
    selected: c,
    highlightColor: d ? VS(
      t.get(
        a ? i : u
      )
    ) : "var(--ws-edge)"
  };
}
function LS(e, t, n, r, s) {
  const o = {
    ...e,
    data: {
      ...e.data,
      isHighlighted: t.highlighted,
      isSelected: t.selected,
      highlightColor: t.highlightColor,
      onDelete: n,
      onEditBinding: r
    }
  };
  if (!s) return o;
  const i = Object.keys(s), c = Object.keys(o), a = Object.keys(s.data || {}).length === Object.keys(o.data || {}).length && Object.entries(o.data || {}).every(
    ([d, u]) => s.data?.[d] === u
  );
  return i.length === c.length && a && c.every(
    (d) => d === "data" || s[d] === o[d]
  ) ? s : o;
}
function VS(e) {
  return e?.type === "asset" ? "#10b981" : e?.type === "power" ? "#8b5cf6" : e?.type === "agent" ? "#f59e0b" : e?.type === "flow" ? "#3b82f6" : e?.type === "function" || e?.type === "group" ? "#f43f5e" : "#3b82f6";
}
function US(e) {
  const t = "changedTouches" in e ? e.changedTouches[0] || e.touches[0] : void 0;
  return t ? { x: t.clientX, y: t.clientY } : "clientX" in e && typeof e.clientX == "number" && typeof e.clientY == "number" ? { x: e.clientX, y: e.clientY } : null;
}
function KS(e) {
  return e instanceof HTMLElement ? !!(e.isContentEditable || e.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) : !1;
}
function Yu(e) {
  const t = e.target, n = t === document.body || t === document.documentElement || t instanceof Element && !!t.closest(".ws-canvas-wrap");
  return !e.defaultPrevented && !e.repeat && (e.key === "Delete" || e.key === "Backspace") && n && !KS(t) && !(t instanceof Element && t.closest(
    '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="combobox"], [data-radix-popper-content-wrapper]'
  )) && !document.querySelector(
    '[role="dialog"][aria-modal="true"], [role="alertdialog"], [role="menu"], [role="listbox"], [data-radix-popper-content-wrapper]'
  );
}
function qS(e, t) {
  const n = { size: 15, fill: t ? "currentColor" : "none" };
  return e === "start" ? /* @__PURE__ */ f(Cc, { ...n }) : e === "import" ? /* @__PURE__ */ f($a, { ...n }) : e === "display" ? /* @__PURE__ */ f(Sc, { ...n }) : e === "save" ? /* @__PURE__ */ f(il, { ...n }) : /* @__PURE__ */ f(al, { ...n });
}
function qs(e) {
  return Fo(e, "start");
}
function am(e) {
  return !!(e.type === "function" && eo(e.functionOption?.key)?.showsResult);
}
function ca(e) {
  return am(e) && an(e);
}
function GS(e) {
  return {
    description: e
  };
}
function WS(e, t) {
  return {
    ...GS(t),
    resultRef: Qc({
      ...qi(e),
      asset: void 0,
      version: void 0,
      role: void 0
    })
  };
}
const Xu = { width: 620, height: 420 }, vd = 44;
function cm(e, t) {
  return !!(e.groupId && e.storyboardItem && t.imageUrl && Ps(t) === "image");
}
function HS(e, t) {
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
function dm(e) {
  if (e.type === "power" && cn(e.power, e.kind, e.outputType).viewMode === "writing" && Ya(e))
    return bf(Nd(e));
  if (e.type === "function") {
    if (ca(e)) {
      if (!Ya(e))
        return { width: e.width, height: e.height };
      const n = Zu(e);
      return n ? {
        width: n.width,
        height: n.height + vd
      } : XS(e);
    }
    return { width: 128, height: 46 };
  }
  const t = Zu(e);
  return t || {
    width: e.width,
    height: e.height
  };
}
function Nd(e, t = e.resultOutput) {
  const n = Po(e, e.resultOutput), r = t === e.resultOutput ? null : Po(e, t);
  return (r ? ml(n, r) : n)?.document || Cs(e.asset?.version?.content) || Cs(e.resultOutput);
}
function Zu(e) {
  if (!Ya(e) || !YS(e))
    return null;
  const t = no(e);
  return !Fl(
    On(e),
    Ps(t)
  ) || cm(e, t) ? null : {
    width: Math.max(e.width, Xu.width),
    height: Math.max(e.height, Xu.height)
  };
}
function YS(e) {
  if (e.type === "asset" || e.type === "function")
    return !0;
  if (e.type !== "power")
    return !1;
  const t = cn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return !["storyboard", "storyboard_grid", "video_compose"].includes(t);
}
function XS(e) {
  const t = no(e), n = t.audioUrl ? "audio" : t.videoUrl ? "video" : t.imageUrl ? "image" : String(e.kind || ""), r = Ji({
    kind: n,
    outputType: "",
    output: void 0
  });
  return {
    width: r.width,
    height: r.height + vd
  };
}
const ZS = {
  agent: { input: { left: "4px" }, output: { right: "4px" } },
  flow: { input: { left: "11px" }, output: { right: "11px" } },
  function: { input: { left: "0px" }, output: { right: "0px" } }
};
function um(e) {
  return e.type === "function" && ca(e) ? {
    input: { left: "0px", top: "19px" },
    output: { left: "128px", right: "auto", top: "19px" }
  } : ZS[e.type];
}
function Ye({
  id: e,
  type: t,
  position: n,
  className: r,
  style: s
}) {
  return Tc(hd) ? null : /* @__PURE__ */ f(
    ty,
    {
      id: e,
      type: t,
      position: n,
      className: `ws-rf-handle ${r}`,
      style: s,
      children: /* @__PURE__ */ f("span", { "aria-hidden": "true", children: t === "target" ? /* @__PURE__ */ f(ol, { size: 12 }) : /* @__PURE__ */ f(sl, { size: 12 }) })
    }
  );
}
function JS(e, t) {
  e.onAssetCreated(t), e.onNodeResult(e.id, {
    ...Is(e, t),
    resultRef: {
      ...e.resultRef,
      asset_id: t.id,
      version_id: t.version_id
    },
    ...t.version_id > (e.asset?.version_id || e.resultRef?.version_id || 0) ? { runError: "" } : {}
  });
}
function Dn({
  node: e,
  selected: t
}) {
  if (e.embedded) return null;
  const n = e.type === "asset" || e.type === "power" || e.type === "group" || e.type === "function" && ca(e), r = /* @__PURE__ */ f(
    lw,
    {
      node: e,
      enabled: e.interactive && !e.structureLocked,
      resizable: n,
      onResizeStart: e.onNodeResizeStart,
      onResizeEnd: e.onNodeResizeEnd
    }
  );
  if (e.type === "flow") {
    const s = It(e.runningNode);
    return /* @__PURE__ */ L(en, { children: [
      r,
      /* @__PURE__ */ f(
        cb,
        {
          node: e,
          running: s,
          onRun: () => {
            s || (e.onClearFeedbackRecords([e.id]), e.onRunBackendNode(e).catch((o) => {
              e.onNodeResult(e.id, {
                runError: o instanceof Error ? o.message : "流程运行失败"
              });
            }));
          }
        }
      )
    ] });
  }
  return e.type === "asset" || e.type === "group" || e.type === "function" || !wc(e) || !t || !e.showNodeSettings ? r : /* @__PURE__ */ L(en, { children: [
    r,
    /* @__PURE__ */ f(
      Be,
      {
        fallback: /* @__PURE__ */ f(ze, { label: "正在加载参数编辑器", compact: !0 }),
        children: /* @__PURE__ */ f(hv, { node: e }, e.id)
      }
    )
  ] });
}
function wc(e) {
  if (e.type === "agent")
    return !0;
  if (e.type !== "power") return !1;
  const t = cn(
    e.power,
    e.kind,
    e.outputType
  ).viewMode;
  return t !== "video_compose" && !(t === "writing" && Nd(e)?.selected_inspiration_id);
}
function Co({
  node: e,
  onShowNodeDetail: t
}) {
  return !t || !an(e) ? null : /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "ws-node-quick-view nodrag nopan",
      "aria-label": "查看详情",
      onPointerEnter: Ms,
      onFocus: Ms,
      onMouseDown: (n) => n.stopPropagation(),
      onClick: (n) => {
        n.preventDefault(), n.stopPropagation(), t(e);
      },
      children: /* @__PURE__ */ f(Sc, { size: 14 })
    }
  );
}
const QS = {
  width: 270,
  height: 250,
  offsetX: 0,
  offsetY: 0
};
function Ba({
  node: e,
  runningNode: t,
  onShowNodeDetail: n
}) {
  const r = Rs(
    e.resultView || QS
  ), [s, o] = q(null), i = cw(
    r,
    s
  ), [c, a] = q(!1), d = e.type === "agent" ? t?.agent : void 0, u = _w(d);
  if (!an(e) && !u)
    return null;
  const y = no(e), h = fd(e), I = $e(
    Jt(y.text, ""),
    Jt(h, ""),
    Jt(e.description, ""),
    e.title,
    "暂无结果"
  ), w = Id(e), C = On(e), S = Ze(C) ? C : w ? { rich: w } : I, x = fp(y) ? y : Kv(
    y,
    yr(I, Mp(I, ""))
  ), T = e.interactive, U = Ie(
    e.resultOutput,
    e.asset?.version?.content
  ), ee = e.type === "agent" ? async (Z) => {
    if (!It(t))
      try {
        await e.onRunBackendNode(e, { agentInput: Z });
      } catch (oe) {
        e.onNodeResult(e.id, {
          runError: oe instanceof Error ? oe.message : "智能体继续运行失败"
        });
      }
  } : void 0;
  return /* @__PURE__ */ f(Be, { fallback: /* @__PURE__ */ f(ze, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    lp,
    {
      output: S,
      fallback: I,
      preview: x,
      mediaLabel: Eo(x),
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
      onOpenIntent: Ms,
      resizeControls: /* @__PURE__ */ f(
        fw,
        {
          value: i,
          enabled: T,
          onResizeStart: () => {
            o(
              (Z) => ou(
                r,
                Z,
                i
              )
            ), a(!0), e.onNodeResizeStart(e.id);
          },
          onResize: (Z) => o(
            (oe) => ou(
              r,
              oe,
              Z
            )
          ),
          onResizeEnd: (Z) => {
            a(!1), e.onResultViewResizeEnd(e.id, Z), o(null);
          }
        }
      ),
      children: e.type === "agent" ? /* @__PURE__ */ f(
        Be,
        {
          fallback: /* @__PURE__ */ f(ze, { label: "正在加载智能体结果", compact: !0 }),
          children: /* @__PURE__ */ f(
            gv,
            {
              output: U,
              runtime: d,
              fallback: I,
              running: It(t),
              onContinue: ee
            }
          )
        }
      ) : void 0
    }
  ) });
}
function eC({
  node: e,
  running: t = !1,
  onShowNodeDetail: n
}) {
  const r = no(e), s = Id(e), o = On(e), i = $e(
    fd(e),
    Jt(r.text, ""),
    Jt(e.description, ""),
    "暂无内容"
  ), c = Ze(o) ? o : s ? { rich: s } : i, a = !Ao(c, r) && !!(r.imageUrl || r.videoUrl || r.audioUrl), d = a && !r.audioUrl ? ki(
    e,
    e.onNodeResult,
    vd
  ) : void 0;
  return /* @__PURE__ */ f(Be, { fallback: /* @__PURE__ */ f(ze, { label: "正在加载节点结果" }), children: /* @__PURE__ */ f(
    lp,
    {
      output: c,
      fallback: i,
      preview: r,
      mediaLabel: Eo(r),
      className: `ws-node-function-result-card ${a ? "has-media" : ""}`,
      customContentIsPureMedia: a,
      onOpen: n ? () => n(e) : void 0,
      onOpenIntent: Ms,
      openOnContentClick: !0,
      children: a ? /* @__PURE__ */ f(
        mm,
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
function za({
  node: e,
  onOpenFeedbackRecord: t
}) {
  const n = qr(e);
  if (!t || n.length === 0)
    return null;
  const r = n.filter(
    (o) => o.status === "pending"
  ).length, s = [...n].reverse().find((o) => o.status === "pending") || n[n.length - 1];
  return /* @__PURE__ */ L(
    "button",
    {
      type: "button",
      className: `ws-node-feedback-beacon nodrag nopan ${r > 0 ? "is-pending" : "is-done"}`,
      "aria-label": r > 0 ? "继续填写反馈" : "查看反馈记录",
      onMouseDown: (o) => o.stopPropagation(),
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), t(e, s);
      },
      children: [
        /* @__PURE__ */ f(mg, { size: 15, fill: "currentColor" }),
        n.length > 1 ? /* @__PURE__ */ f("span", { children: n.length }) : null
      ]
    }
  );
}
function tC(e) {
  const t = e.resultRef;
  return !!(t?.run_id || t?.node_run_id || t?.asset_id || t?.version_id || t?.request_id);
}
function an(e) {
  if (!nC(e) || !tC(e) && e.asset?.version?.content == null && e.resultOutput == null)
    return !1;
  const t = $n(e);
  if (t == null)
    return !1;
  const n = yr(
    t,
    aa(e, t)
  );
  return fr(n) || yd(t);
}
function nC(e) {
  return e.type !== "function" ? !0 : am(e);
}
async function rC(e) {
  const t = eo(e.node.functionOption?.key);
  if (!t)
    throw new Error(
      `不支持的画布功能：${e.node.functionOption?.key || e.node.title || "未配置"}`
    );
  const n = t.key, r = oC(e.inputContext);
  if (n === "display") {
    if (r == null)
      throw new Error("展示节点没有可展示的上游结果");
    return e.onNodeResult(
      e.node.id,
      Qr(
        e.node,
        { output: r },
        "展示上游结果"
      )
    ), !0;
  }
  if (n === "save") {
    if (r == null)
      throw new Error("保存节点没有可保存的上游结果");
    const s = await bS({
      projectId: e.projectId,
      canvasId: e.canvasId,
      assetCateId: Number(e.node.assetCateId || e.assetCate?.id || 0),
      name: iC(e.node, e.inputContext),
      kind: Nw(e.node),
      content: r,
      nodeKey: e.node.id,
      requestId: uS(
        "save",
        e.node.id,
        r
      ),
      source: sC(e.inputContext),
      previousAsset: e.node.asset
    });
    return e.onAssetCreated?.(s), e.onNodeResult(
      e.node.id,
      Qr(
        e.node,
        {
          output: s.version?.content || r,
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
function Sd(e) {
  const t = e?.sources || [];
  return t.length > 0 ? t[t.length - 1] : null;
}
function oC(e) {
  const t = Sd(e);
  return t?.output != null ? t.output : e?.text ? { text: e.text } : null;
}
function sC(e) {
  const t = Sd(e);
  return Tw(t);
}
function iC(e, t) {
  const n = Sd(t);
  return $e(n?.title, e.title, "画布资产");
}
function aC({
  errorFeedback: e,
  prompt: t,
  running: n,
  readonly: r,
  history: s,
  activeRecordId: o,
  onSelectRecord: i,
  onClose: c,
  onSubmit: a
}) {
  const d = de(
    () => dC(t),
    [t]
  );
  if (typeof document > "u")
    return null;
  const u = document.querySelector(".ws-page") || document.body;
  return Vg(
    /* @__PURE__ */ f("div", { className: "ws-flow-feedback-backdrop", onMouseDown: c, children: /* @__PURE__ */ L(
      "div",
      {
        className: "ws-flow-feedback-modal",
        onMouseDown: (y) => y.stopPropagation(),
        children: [
          /* @__PURE__ */ L("header", { className: "ws-flow-feedback-head", children: [
            /* @__PURE__ */ L("div", { children: [
              /* @__PURE__ */ f("strong", { children: t.title || "补充信息" }),
              r ? /* @__PURE__ */ f("span", { children: "已提交的反馈记录，可查看之前填写的内容。" }) : t.description ? /* @__PURE__ */ f("span", { children: t.description }) : null
            ] }),
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "ws-flow-feedback-close",
                disabled: n,
                onClick: c,
                "aria-label": "关闭",
                children: /* @__PURE__ */ f(Nc, { size: 18 })
              }
            )
          ] }),
          s && s.length > 1 ? /* @__PURE__ */ f("div", { className: "ws-flow-feedback-tabs", children: s.map((y, h) => /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: y.id === o ? "is-active" : "",
              onClick: () => i?.(y),
              children: [
                /* @__PURE__ */ f("span", { children: h + 1 }),
                y.status === "pending" ? "待反馈" : "已提交"
              ]
            },
            y.id
          )) }) : null,
          /* @__PURE__ */ L("div", { className: "ws-flow-feedback-body custom-scrollbar", children: [
            e,
            /* @__PURE__ */ f(Be, { fallback: /* @__PURE__ */ f(ze, { label: "正在加载交互表单" }), children: /* @__PURE__ */ f(
              QI,
              {
                interaction: d,
                disabled: n,
                readonly: r,
                hideHeader: !0,
                layout: "dialog",
                initialData: r ? t.values : void 0,
                onSubmit: (y) => a(
                  cC(t, d, y.data)
                )
              }
            ) })
          ] }),
          r ? /* @__PURE__ */ f("footer", { className: "ws-flow-feedback-foot", children: /* @__PURE__ */ L(
            "button",
            {
              type: "button",
              className: "ws-flow-feedback-submit",
              onClick: c,
              children: [
                /* @__PURE__ */ f(kc, { size: 16 }),
                /* @__PURE__ */ f("span", { children: "知道了" })
              ]
            }
          ) }) : null
        ]
      }
    ) }),
    u
  );
}
function cC(e, t, n) {
  return String(t.type || "").toLowerCase() === "power_params" ? n : {
    ...e.values || {},
    ...n
  };
}
function dC(e) {
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
function Lr(e) {
  return Math.max(0.35, Math.min(1.45, Number.isFinite(e) ? e : 1));
}
function uC(e) {
  const t = Lr(e);
  return {
    "--ws-node-overlay-scale": String(1 / t),
    "--ws-node-overlay-gap": `${16 / t}px`
  };
}
function Ju(e, t) {
  if (!e)
    return;
  const n = Lr(t);
  e.style.setProperty("--ws-node-overlay-scale", String(1 / n)), e.style.setProperty("--ws-node-overlay-gap", `${16 / n}px`);
}
function lC(e) {
  return qs(e);
}
function fC(e) {
  return qs(e) ? "将从该开始节点沿连接线执行后续节点，直到保存或展示。" : e.type === "agent" ? "将把当前提示词、文件和上下文发送给该智能体。" : e.type === "power" ? "将使用当前参数运行该能力节点。" : "确认后开始执行该节点。";
}
async function pC(e, t, n, r) {
  if (e.group?.origin !== "script") {
    await r(t);
    return;
  }
  const s = J_({
    members: n,
    hasResult: an
  });
  await r(t, { targetNodeIds: s });
}
function lm({
  group: e,
  sourceNode: t,
  members: n,
  runNode: r,
  onError: s
}) {
  pC(e, t, n, r).catch(
    (o) => {
      s(o instanceof Error ? o.message : "分组运行失败");
    }
  );
}
function mC(e) {
  const { ref: t, visible: n } = $w(), r = ey();
  Zr(() => {
    if (!n) return;
    const o = window.requestAnimationFrame(
      () => r(e.id)
    );
    return () => window.cancelAnimationFrame(o);
  }, [e.id, r, n]);
  const s = um(e.data);
  return /* @__PURE__ */ f(
    "div",
    {
      ref: t,
      style: { position: "relative", width: "100%", height: "100%" },
      children: n ? /* @__PURE__ */ f(fm, { ...e }) : /* @__PURE__ */ L(en, { children: [
        /* @__PURE__ */ f(
          Ye,
          {
            id: "input-0",
            type: "target",
            position: He.Left,
            className: "is-in",
            style: s?.input
          }
        ),
        /* @__PURE__ */ f(
          Ye,
          {
            id: "output-0",
            type: "source",
            position: He.Right,
            className: "is-out",
            style: s?.output
          }
        )
      ] })
    }
  );
}
function fm({
  data: e,
  selected: t
}) {
  const [n, r] = q(""), s = Tc(hd), o = e, i = um(o), {
    sourceNode: c,
    projectId: a,
    runningNode: d,
    onShowNodeDetail: u,
    onConfirmStoryboard: y,
    onNodeResult: h,
    onOpenFeedbackRecord: I,
    canvasReferenceItems: w,
    connectedMediaReferences: C,
    onConnectedMediaEdgeRemove: S,
    onNodeDraftChange: x,
    onOpenStoryboardGridImport: T,
    onRunBackendNode: U,
    structureLocked: ee,
    storyboardSourceNode: Z
  } = e, oe = o.type === "power" ? cn(o.power, o.kind, o.outputType) : null, X = oe?.viewMode === "writing", O = oe?.viewMode === "storyboard", we = oe?.viewMode === "storyboard_grid", ve = oe?.viewMode === "video_compose";
  if (o.type === "group") {
    const D = o.groupMembers, V = o.storyboardFrameRunning, G = o.groupRuntime || Xc({
      members: D,
      runningNodes: cN,
      groupState: d,
      hasResult: an
    }), K = o.runBlockedReason;
    let ne;
    return !K && !V && (ne = () => lm({
      group: o,
      sourceNode: c,
      members: D,
      runNode: U,
      onError: r
    })), /* @__PURE__ */ L(Be, { fallback: /* @__PURE__ */ f(ze, { label: "正在加载分组" }), children: [
      /* @__PURE__ */ f(
        sr,
        {
          message: n,
          onDismiss: () => r("")
        }
      ),
      /* @__PURE__ */ L(
        WI,
        {
          node: o,
          memberCount: G.memberCount,
          runnableCount: G.runnableCount,
          completedCount: G.completedCount,
          failedCount: G.failedCount,
          status: G.status,
          frameRunning: V,
          selected: t,
          managed: ee,
          onRename: ee ? void 0 : (H) => h(o.id, { title: H, titleMode: "manual" }),
          onEditStructure: Z ? () => u(
            Z,
            op(o)
          ) : void 0,
          onRun: ne,
          runBlockedReason: K,
          children: [
            /* @__PURE__ */ f(
              Ye,
              {
                id: "input-0",
                type: "target",
                position: He.Left,
                className: "is-in"
              }
            ),
            /* @__PURE__ */ f(
              Ye,
              {
                id: "output-0",
                type: "source",
                position: He.Right,
                className: "is-out"
              }
            ),
            /* @__PURE__ */ f(Dn, { node: o, selected: t })
          ]
        }
      )
    ] });
  }
  if (o.type === "agent") {
    const D = It(d) || d?.status === "success";
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-agent-wrap ${t ? "is-selected" : ""} ${D ? "is-running" : ""}`,
        children: [
          /* @__PURE__ */ f(
            Ye,
            {
              id: "input-0",
              type: "target",
              position: He.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "output-0",
              type: "source",
              position: He.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ L("div", { className: "ws-node-circle", children: [
            /* @__PURE__ */ f("div", { className: "ws-node-circle-avatar", children: /* @__PURE__ */ f(lg, { size: 20, className: "ws-icon-amber" }) }),
            /* @__PURE__ */ f(
              Ca,
              {
                className: "ws-node-circle-title",
                title: o.title,
                onRename: h ? (V) => h(o.id, { title: V, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          D ? /* @__PURE__ */ L(
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
            za,
            {
              node: o,
              onOpenFeedbackRecord: I
            }
          ),
          /* @__PURE__ */ f(
            Ba,
            {
              node: o,
              runningNode: d,
              onShowNodeDetail: u
            }
          ),
          /* @__PURE__ */ f(Dn, { node: o, selected: t })
        ]
      }
    );
  }
  if (o.type === "flow") {
    const D = It(d) || d?.status === "success";
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-flow-wrap ${t ? "is-selected" : ""} ${D ? "is-running" : ""}`,
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
          D ? /* @__PURE__ */ L(
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
            /* @__PURE__ */ f("div", { className: "ws-node-flow-avatar", children: /* @__PURE__ */ f(fg, { size: 16, className: "ws-icon-blue" }) }),
            /* @__PURE__ */ f(
              Ca,
              {
                className: "ws-node-flow-title",
                title: o.title,
                onRename: h ? (V) => h(o.id, { title: V, titleMode: "manual" }) : void 0
              }
            )
          ] }),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "input-0",
              type: "target",
              position: He.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "output-0",
              type: "source",
              position: He.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            za,
            {
              node: o,
              onOpenFeedbackRecord: I
            }
          ),
          /* @__PURE__ */ f(Ba, { node: o, onShowNodeDetail: u }),
          /* @__PURE__ */ f(Dn, { node: o, selected: t })
        ]
      }
    );
  }
  if (o.type === "function") {
    const D = o.functionOption?.key || "", V = Fo(o, "start"), { onRunFunctionNode: G, requestConfirm: K } = o, ne = It(d), H = V && o.canvasHasRunningNode, fe = ne, be = ca(o), pe = () => {
      G(o).catch((xe) => {
        r(xe instanceof Error ? xe.message : "执行出错");
      });
    }, Ee = () => {
      if (!(fe || H)) {
        if (lC(o)) {
          K({
            title: `执行「${o.title}」`,
            description: fC(o),
            confirmText: "执行",
            onConfirm: pe
          });
          return;
        }
        pe();
      }
    }, Le = (xe) => {
      xe.preventDefault(), xe.stopPropagation(), Ee();
    };
    return /* @__PURE__ */ L(
      "div",
      {
        className: `ws-node-function-wrap ${t ? "is-selected" : ""} ${fe ? "is-running" : ""} ${be ? "has-result-card" : ""} is-${D || "default"}`,
        children: [
          /* @__PURE__ */ f(
            sr,
            {
              message: n,
              onDismiss: () => r("")
            }
          ),
          /* @__PURE__ */ L(
            "div",
            {
              className: "ws-node-function-pill",
              role: "button",
              tabIndex: 0,
              "aria-disabled": fe || H,
              onClick: Le,
              onKeyDown: (xe) => {
                xe.key !== "Enter" && xe.key !== " " || (xe.preventDefault(), xe.stopPropagation(), Ee());
              },
              children: [
                /* @__PURE__ */ f("div", { className: "ws-node-function-icon", children: ne ? /* @__PURE__ */ f(ur, { size: 15, className: "ws-spin" }) : qS(D, V) }),
                /* @__PURE__ */ f("span", { className: "ws-node-function-title", children: ne ? d?.status === "waiting" ? "等待中" : "运行中" : o.title })
              ]
            }
          ),
          be ? /* @__PURE__ */ f(
            eC,
            {
              node: o,
              running: fe,
              onShowNodeDetail: u
            }
          ) : null,
          /* @__PURE__ */ f(
            Co,
            {
              node: o,
              onShowNodeDetail: u
            }
          ),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "input-0",
              type: "target",
              position: He.Left,
              className: "is-in",
              style: i?.input
            }
          ),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "output-0",
              type: "source",
              position: He.Right,
              className: "is-out",
              style: i?.output
            }
          ),
          /* @__PURE__ */ f(
            za,
            {
              node: o,
              onOpenFeedbackRecord: I
            }
          ),
          be ? null : /* @__PURE__ */ f(Ba, { node: o, onShowNodeDetail: u }),
          /* @__PURE__ */ f(Dn, { node: o, selected: t })
        ]
      }
    );
  }
  if (o.type === "asset") {
    if (o.kind === "image") {
      const pe = Oa(o), Ee = On(o), Le = Ao(Ee, pe), xe = ki(o, h), In = [
        "ws-node-image-wrap",
        t ? "is-selected" : "",
        pe.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: In, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(Ed, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: o.title || "图片资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-image-container ws-node-content-container", children: Le ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          To,
          {
            output: Ee,
            fallback: pe.text || o.description || "图片资产",
            mediaGridKind: "image",
            className: "ws-canvas-content-view"
          }
        ) }) : pe.imageUrl ? /* @__PURE__ */ f(
          bc,
          {
            src: pe.imageUrl,
            alt: o.title,
            className: "ws-node-image-raw",
            onMediaSize: xe
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(Ed, { size: 24 }),
          /* @__PURE__ */ f("span", { children: pe.text || o.description || "图片资产" })
        ] }) }),
        /* @__PURE__ */ f(
          Ye,
          {
            id: "input-0",
            type: "target",
            position: He.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          Ye,
          {
            id: "output-0",
            type: "source",
            position: He.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ f(
          Co,
          {
            node: o,
            onShowNodeDetail: u
          }
        ),
        /* @__PURE__ */ f(Dn, { node: o, selected: t })
      ] });
    }
    if (o.kind === "video") {
      const pe = Oa(o), Ee = On(o), Le = Ao(Ee, pe), xe = ki(o, h), In = [
        "ws-node-video-wrap",
        t ? "is-selected" : "",
        pe.videoUrl || pe.imageUrl ? "has-media" : ""
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ L("div", { className: In, children: [
        /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
          /* @__PURE__ */ f(Pd, { size: 13, className: "ws-icon-green" }),
          /* @__PURE__ */ f("span", { children: o.title || "视频资产" })
        ] }),
        /* @__PURE__ */ f("div", { className: "ws-node-video-container ws-node-content-container", children: Le ? /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
          To,
          {
            output: Ee,
            fallback: pe.text || o.description || "视频资产",
            mediaGridKind: "video",
            className: "ws-canvas-content-view"
          }
        ) }) : pe.videoUrl ? /* @__PURE__ */ f(
          Ri,
          {
            src: pe.videoUrl,
            poster: pe.videoPosterUrl,
            className: "ws-node-video-raw",
            ariaLabel: o.title || "视频资产",
            objectFit: "contain",
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: xe
          },
          pe.videoUrl
        ) : pe.imageUrl ? /* @__PURE__ */ f(
          bc,
          {
            src: pe.imageUrl,
            alt: o.title,
            className: "ws-node-video-raw",
            onMediaSize: xe
          }
        ) : /* @__PURE__ */ L("div", { className: "ws-node-image-empty", children: [
          /* @__PURE__ */ f(Pd, { size: 24 }),
          /* @__PURE__ */ f("span", { children: pe.text || o.description || "视频资产" })
        ] }) }),
        /* @__PURE__ */ f(
          Ye,
          {
            id: "input-0",
            type: "target",
            position: He.Left,
            className: "is-in"
          }
        ),
        /* @__PURE__ */ f(
          Ye,
          {
            id: "output-0",
            type: "source",
            position: He.Right,
            className: "is-out"
          }
        ),
        /* @__PURE__ */ f(
          Co,
          {
            node: o,
            onShowNodeDetail: u
          }
        ),
        /* @__PURE__ */ f(Dn, { node: o, selected: t })
      ] });
    }
    const D = Oa(o), V = Id(o), G = On(o), K = fd(o), ne = Ze(G) ? G : V ? { rich: V } : K || D.text, H = Ao(ne, D), fe = !!(D.imageUrl || D.videoUrl || D.audioUrl), be = [
      "ws-node-text-wrap",
      t ? "is-selected" : "",
      fe ? "has-media" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ L("div", { className: be, children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(pg, { size: 13, className: "ws-icon-green" }),
        /* @__PURE__ */ f("span", { children: o.title })
      ] }),
      /* @__PURE__ */ f("div", { className: "ws-node-text-card", children: !H && D.imageUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        "img",
        {
          src: D.imageUrl,
          alt: Eo(D) || o.title,
          loading: "lazy",
          decoding: "async"
        }
      ) }) : !H && D.videoUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media", children: /* @__PURE__ */ f(
        Ri,
        {
          src: D.videoUrl,
          poster: D.videoPosterUrl,
          ariaLabel: Eo(D) || o.title,
          objectFit: "cover",
          allowDragFromVideo: !0,
          playButtonOnly: !0
        },
        D.videoUrl
      ) }) : !H && D.audioUrl ? /* @__PURE__ */ f("div", { className: "ws-node-text-media is-audio", children: /* @__PURE__ */ f(
        Be,
        {
          fallback: /* @__PURE__ */ f(ze, { label: "正在加载音频", compact: !0 }),
          children: /* @__PURE__ */ f(Bl, { src: D.audioUrl })
        }
      ) }) : !H && D.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-text-file", children: [
        /* @__PURE__ */ f(Rc, { size: 16 }),
        /* @__PURE__ */ f("span", { children: Eo(D) || "文件内容" })
      ] }) : /* @__PURE__ */ f("div", { className: "ws-node-scroll-content nowheel", children: /* @__PURE__ */ f(
        To,
        {
          output: ne,
          fallback: K || D.text || "暂无内容",
          mediaGridKind: Ps(D),
          className: "ws-canvas-content-view"
        }
      ) }) }),
      /* @__PURE__ */ f(
        Ye,
        {
          id: "input-0",
          type: "target",
          position: He.Left,
          className: "is-in"
        }
      ),
      /* @__PURE__ */ f(
        Ye,
        {
          id: "output-0",
          type: "source",
          position: He.Right,
          className: "is-out"
        }
      ),
      /* @__PURE__ */ f(
        Co,
        {
          node: o,
          onShowNodeDetail: u
        }
      ),
      /* @__PURE__ */ f(Dn, { node: o, selected: t })
    ] });
  }
  if (o.type === "power") {
    const D = It(d), V = vc(o.power, o.kind), G = we ? Bc(
      D ? [d?.streamOutput, Si(o)] : Si(o)
    ) : null, K = an(o), ne = D ? "running" : d?.status === "error" ? "error" : d?.status === "success" && !K ? "running" : K ? "complete" : "empty", H = !!(!X && !O && !we && !ve && d?.streamStarted && (d.streamText || d.streamOutput) && d.status !== "success"), fe = H ? d?.streamOutput ? yr(d.streamOutput, "audio") : {
      text: d?.streamText || "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      fileUrl: ""
    } : no(o), be = H ? d?.streamOutput || { text: d?.streamText || "" } : On(o), pe = X || O || we || ve || H || K, Ee = !X && !O && !we && !ve && !!(fe.imageUrl || fe.videoUrl || fe.audioUrl || fe.fileUrl), Le = o.embedded ? void 0 : ki(o, h), xe = X ? Nd(
      o,
      d?.streamOutput || o.resultOutput
    ) : null, In = xe ? xe.status === "failed" : !!o.runError, nn = [
      "ws-node-power-wrap",
      t ? "is-selected" : "",
      X ? "is-writing" : "",
      O ? "is-storyboard" : "",
      we ? "is-storyboard-grid" : "",
      ve ? "is-video-compose" : "",
      V ? "is-audio" : "",
      o.embedded ? "is-embedded" : "",
      pe ? "has-content" : "",
      Ee ? "has-media" : ""
    ].filter(Boolean).join(" "), vn = (ge) => /* @__PURE__ */ L("div", { className: "ws-node-floating-meta", children: [
      /* @__PURE__ */ L("div", { className: "ws-node-floating-label", children: [
        /* @__PURE__ */ f(
          Iy,
          {
            power: o.power,
            kind: o.kind,
            outputType: o.outputType,
            size: 13,
            className: "ws-icon-violet"
          }
        ),
        /* @__PURE__ */ f(
          Ca,
          {
            className: "ws-node-floating-title",
            title: o.title,
            onRename: h && !ee ? (Ae) => h(o.id, { title: Ae, titleMode: "manual" }) : void 0
          }
        )
      ] }),
      ge
    ] }), mt = (ge, Ae, rn) => /* @__PURE__ */ L(
      "div",
      {
        className: `${nn}${rn ? " is-running" : In ? " is-error" : ""}`,
        children: [
          /* @__PURE__ */ f(
            sr,
            {
              message: n,
              onDismiss: () => r("")
            }
          ),
          vn(Ae),
          /* @__PURE__ */ L("div", { className: "ws-node-power-card", children: [
            rn ? /* @__PURE__ */ L("svg", { className: "ws-node-running-border is-spin", "aria-hidden": "true", children: [
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
            ge
          ] }),
          o.runError && !rn && !X ? /* @__PURE__ */ f(
            wC,
            {
              projectId: a,
              node: o,
              onOpenDetail: u ? () => u(o) : void 0
            }
          ) : null,
          /* @__PURE__ */ f(
            Ye,
            {
              id: "input-0",
              type: "target",
              position: He.Left,
              className: "is-in"
            }
          ),
          /* @__PURE__ */ f(
            Ye,
            {
              id: "output-0",
              type: "source",
              position: He.Right,
              className: "is-out"
            }
          ),
          X || O || we || ve ? null : /* @__PURE__ */ f(
            Co,
            {
              node: o,
              onShowNodeDetail: u
            }
          ),
          /* @__PURE__ */ f(Dn, { node: o, selected: t })
        ]
      }
    );
    return X ? /* @__PURE__ */ f(
      Be,
      {
        fallback: mt(
          /* @__PURE__ */ f(ze, { label: "正在加载创作工作区", compact: !0 }),
          null,
          D
        ),
        children: /* @__PURE__ */ f(
          kv,
          {
            renderFrame: mt,
            canvasRun: o.canvasRun,
            canvasRunStopping: o.canvasRunStopping,
            runningNode: d,
            onStopCanvasRun: () => o.onStopNodeCanvasRun(o.id),
            projectId: a,
            canvasId: o.canvasId,
            node: o,
            output: d?.streamOutput || On(o),
            running: D,
            readonly: !o.interactive,
            onAssetUpdated: (ge) => JS(o, ge),
            onOpenDetail: (ge) => u(
              ge ? { ...o, resultOutput: { writing: ge } } : o
            )
          }
        )
      }
    ) : mt(
      /* @__PURE__ */ f(en, { children: ve ? /* @__PURE__ */ f(
        Be,
        {
          fallback: /* @__PURE__ */ f(ze, { label: "正在加载视频合成" }),
          children: /* @__PURE__ */ f(
            Sv,
            {
              composition: o.composerDraft?.videoComposition,
              referenceItems: w.filter(
                (ge) => ge.source !== "current" || ge.id !== o.id
              ),
              connectedMediaReferences: C,
              running: D,
              onChange: x ? (ge) => x(o.id, {
                ...o.composerDraft || {},
                videoComposition: ge
              }) : void 0,
              onConnectedMediaEdgeRemove: S,
              onRun: U ? (ge) => {
                U({
                  ...o,
                  composerDraft: {
                    ...o.composerDraft || {},
                    videoComposition: ge
                  }
                }).catch(
                  (Ae) => r(
                    Ae instanceof Error ? Ae.message : "视频合成失败"
                  )
                );
              } : void 0,
              onOpenDetail: u ? () => u(o) : void 0
            }
          )
        }
      ) : O ? /* @__PURE__ */ f(
        Be,
        {
          fallback: /* @__PURE__ */ f(ze, { label: "正在加载分镜内容", compact: !0 }),
          children: /* @__PURE__ */ f(
            bv,
            {
              output: D ? d?.streamOutput || d?.streamText || "" : Si(o),
              status: ne,
              completedShotCount: Number(
                d?.streamOutput?.meta?.completed_count || 0
              ),
              targetShotCount: d?.targetCount || 0,
              workspace: o.storyboardWorkspace,
              referenceItems: w.filter(
                (ge) => ge.source !== "current" || ge.id !== o.id
              ),
              onOpenDetail: K && u ? (ge, Ae) => u(o, Ae, ge) : void 0,
              onConfirm: o.interactive && K ? () => y(o.id) : void 0
            }
          )
        }
      ) : we ? /* @__PURE__ */ f(
        Be,
        {
          fallback: /* @__PURE__ */ f(ze, { label: "正在加载分镜宫格", compact: !0 }),
          children: /* @__PURE__ */ f(
            wy,
            {
              grid: G,
              aspectRatio: vS(o),
              running: D,
              layout: o.composerDraft?.storyboardGridLayout,
              onLayoutChange: x ? (ge) => x(o.id, {
                ...o.composerDraft || {},
                storyboardGridLayout: ge
              }) : void 0,
              onImport: T ? () => T(o.id) : void 0,
              onFrameImport: T ? (ge, Ae) => T(o.id, Ae) : void 0,
              onSlotImport: T ? (ge) => T(o.id, ge) : void 0,
              onEdit: G && u ? () => u(o) : void 0
            }
          )
        }
      ) : /* @__PURE__ */ L(en, { children: [
        pe ? /* @__PURE__ */ f(
          mm,
          {
            preview: fe,
            output: be,
            fallback: o.description,
            streaming: D && H,
            videoObjectFit: "cover",
            onMediaSize: Le,
            compactMediaGrid: cm(
              o,
              fe
            )
          }
        ) : /* @__PURE__ */ f(IC, {}),
        /* @__PURE__ */ f(
          Ci,
          {
            active: D,
            message: d?.reconnecting ? "正在重新连接" : d?.statusText,
            compact: !0
          }
        )
      ] }) }),
      /* @__PURE__ */ f(
        jI,
        {
          runTiming: o.runTiming,
          runningNode: d,
          showEstimate: !s
        }
      ),
      D
    );
  }
  return /* @__PURE__ */ L("div", { className: `ws-node ${t ? "is-selected" : ""}`, children: [
    /* @__PURE__ */ f(
      Ye,
      {
        id: "input-0",
        type: "target",
        position: He.Left,
        className: "is-in"
      }
    ),
    /* @__PURE__ */ f(
      Ye,
      {
        id: "output-0",
        type: "source",
        position: He.Right,
        className: "is-out"
      }
    ),
    /* @__PURE__ */ f("div", { className: "ws-node-title", children: o.title }),
    /* @__PURE__ */ f("div", { className: "ws-node-desc", children: o.description }),
    /* @__PURE__ */ f(Co, { node: o, onShowNodeDetail: u }),
    /* @__PURE__ */ f(Dn, { node: o, selected: t })
  ] });
}
function pm(e, t) {
  return Cd(e.data, t.data) && e.selected === t.selected;
}
function Cd(e, t) {
  return e === t || e.sourceNode === t.sourceNode && e.projectId === t.projectId && e.canvasId === t.canvasId && e.space === t.space && e.catalogCache === t.catalogCache && e.runningNode === t.runningNode && e.canvasRun === t.canvasRun && e.canvasRunStopping === t.canvasRunStopping && sm(e.groupMembers, t.groupMembers) && OS(e.groupRuntime, t.groupRuntime) && e.canvasHasRunningNode === t.canvasHasRunningNode && e.canvasReferenceItems === t.canvasReferenceItems && e.connectedMediaReferences === t.connectedMediaReferences && e.interactive === t.interactive && e.structureLocked === t.structureLocked && e.storyboardSourceNode === t.storyboardSourceNode && e.storyboardFrameRunning === t.storyboardFrameRunning && gC(
    e.storyboardWorkspace,
    t.storyboardWorkspace
  ) && e.runBlockedReason === t.runBlockedReason && e.showNodeSettings === t.showNodeSettings && RS(e.inputContext, t.inputContext);
}
function gC(e, t) {
  return e === t ? !0 : !e || !t ? !1 : e.frameId === t.frameId && e.sourceNodeId === t.sourceNodeId && e.groupCount === t.groupCount && e.workNodeCount === t.workNodeCount && e.completedCount === t.completedCount && e.running === t.running && e.stopping === t.stopping && e.executionStatus === t.executionStatus && e.currentNodeTitle === t.currentNodeTitle && e.runBlockedReason === t.runBlockedReason && !!e.onStop == !!t.onStop && yC(e.groups, t.groups);
}
function yC(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const s = t[r];
    return n.id === s.id && n.title === s.title && n.memberCount === s.memberCount && n.runnableCount === s.runnableCount && n.completedCount === s.completedCount && n.failedCount === s.failedCount && n.status === s.status && n.runBlockedReason === s.runBlockedReason && n.stopping === s.stopping && !!n.onRun == !!s.onRun && !!n.onStop == !!s.onStop && hC(n.results, s.results);
  });
}
function hC(e, t) {
  return e === t || e.length === t.length && e.every((n, r) => {
    const s = t[r];
    return n.nodeId === s.nodeId && n.status === s.status && Cd(n.node, s.node);
  });
}
function _C(e, t) {
  return e === t || e.id === t.id && e.type === t.type && e.position.x === t.position.x && e.position.y === t.position.y && e.selected === t.selected && e.className === t.className && e.draggable === t.draggable && e.deletable === t.deletable && e.selectable === t.selectable && e.connectable === t.connectable && e.focusable === t.focusable && e.zIndex === t.zIndex && e.dragHandle === t.dragHandle && e.initialWidth === t.initialWidth && e.initialHeight === t.initialHeight && e.style?.width === t.style?.width && e.style?.height === t.style?.height ? e === t ? !0 : Cd(
    e.data,
    t.data
  ) : !1;
}
function wC({
  projectId: e,
  node: t,
  onOpenDetail: n
}) {
  const { error: r } = EI(e, t), { summary: s } = OI(r), o = /* @__PURE__ */ L(en, { children: [
    /* @__PURE__ */ f(al, { size: 14 }),
    /* @__PURE__ */ f("span", { children: s })
  ] });
  return n ? /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "ws-node-run-error is-action nodrag nowheel",
      "aria-label": `打开错误详情：${s}`,
      onClick: (i) => {
        i.stopPropagation(), n();
      },
      children: o
    }
  ) : /* @__PURE__ */ f("div", { className: "ws-node-run-error", children: o });
}
function mm({
  preview: e,
  output: t,
  fallback: n,
  streaming: r,
  generating: s = !1,
  videoObjectFit: o = "contain",
  onMediaSize: i,
  showMediaCaption: c = !0,
  compactMediaGrid: a = !1
}) {
  const d = W(null), u = W(!0), y = c ? Eo(e) : "", h = Ao(t, e), I = Ps(e), w = !!(a && Fl(t, I));
  return ue(() => {
    if (!r) {
      u.current = !0;
      return;
    }
    const C = d.current;
    !C || !u.current || (C.scrollTop = C.scrollHeight);
  }, [e.text, r]), !h && e.imageUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          bc,
          {
            src: e.imageUrl,
            alt: y || "生成图片",
            onMediaSize: i
          }
        ),
        y ? /* @__PURE__ */ f("p", { children: y }) : null,
        /* @__PURE__ */ f(Ci, { active: s })
      ]
    }
  ) : !h && e.videoUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Ri,
          {
            src: e.videoUrl,
            poster: e.videoPosterUrl,
            className: "nopan nowheel",
            ariaLabel: y || "生成视频",
            objectFit: o,
            allowDragFromVideo: !0,
            playButtonOnly: !0,
            onMediaSize: i
          },
          e.videoUrl
        ),
        y ? /* @__PURE__ */ f("p", { children: y }) : null,
        /* @__PURE__ */ f(Ci, { active: s })
      ]
    }
  ) : !h && e.audioUrl ? /* @__PURE__ */ L(
    "div",
    {
      className: `ws-node-generated-media is-audio ${s ? "is-generating" : ""}`,
      children: [
        /* @__PURE__ */ f(
          Be,
          {
            fallback: /* @__PURE__ */ f(ze, { label: "正在加载音频", compact: !0 }),
            children: /* @__PURE__ */ f(Bl, { src: e.audioUrl, autoPlay: r })
          }
        ),
        /* @__PURE__ */ f(Ci, { active: s })
      ]
    }
  ) : !h && e.fileUrl ? /* @__PURE__ */ L("div", { className: "ws-node-generated-file", children: [
    /* @__PURE__ */ f(Rc, { size: 16 }),
    /* @__PURE__ */ f("span", { children: y || "文件内容" })
  ] }) : /* @__PURE__ */ f(
    "div",
    {
      ref: d,
      className: `ws-node-generated-text ws-node-scroll-content nowheel ${w ? "is-compact-media-grid" : ""}`,
      onScroll: (C) => {
        const S = C.currentTarget;
        u.current = S.scrollHeight - S.scrollTop - S.clientHeight < 12;
      },
      children: /* @__PURE__ */ f(
        To,
        {
          output: t,
          fallback: e.text || n,
          streaming: r,
          mediaGridKind: I,
          compactMediaGrid: w,
          className: "ws-canvas-content-view"
        }
      )
    }
  );
}
function bc({
  src: e,
  alt: t,
  className: n,
  onMediaSize: r
}) {
  const [s, o] = q(e);
  return ue(() => {
    if (!e || e === s)
      return;
    let i = !0;
    const c = new Image();
    return c.onload = () => {
      (c.decode?.() || Promise.resolve()).catch(() => {
      }).then(() => {
        i && o(e);
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
      onLoad: (i) => r?.(
        i.currentTarget.naturalWidth,
        i.currentTarget.naturalHeight
      )
    }
  );
}
function Ci({
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
      onPointerDown: (r) => r.stopPropagation(),
      onClick: (r) => r.stopPropagation(),
      children: [
        /* @__PURE__ */ f(ur, { size: n ? 12 : 18, className: "ws-spin", "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: t })
      ]
    }
  ) : null;
}
function Eo(e) {
  const t = String(e.text || "").trim();
  return !t || zn(t) ? "" : t;
}
function bC(e, t) {
  if (!Number.isFinite(e) || !Number.isFinite(t) || e <= 0 || t <= 0)
    return null;
  const n = e / t, r = 330, s = 340;
  let o = r, i = o / n;
  return i > s && (i = s, o = i * n), {
    width: Math.round(Qu(o, 150, r)),
    height: Math.round(Qu(i, 150, s))
  };
}
function ki(e, t, n = 0) {
  if (!(e.groupId || !t))
    return (r, s) => {
      const o = bC(r, s);
      if (!o)
        return;
      const i = {
        width: o.width,
        height: o.height + n
      };
      Math.abs((e.width || 0) - i.width) <= 2 && Math.abs((e.height || 0) - i.height) <= 2 || t(e.id, i);
    };
}
function Qu(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function IC() {
  return /* @__PURE__ */ L("div", { className: "ws-node-power-empty", "aria-hidden": "true", children: [
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {}),
    /* @__PURE__ */ f("span", {})
  ] });
}
function vC(e) {
  return NC(e.data);
}
function NC(e) {
  return e.type === "group" ? "#e85d75" : e.type === "asset" ? "#23c483" : e.type === "power" ? "#8b5cf6" : e.type === "agent" ? "#f59e0b" : e.type === "flow" ? "#3b82f6" : "#e85d75";
}
function SC() {
  if (typeof window > "u")
    return 0;
  const e = new URLSearchParams(window.location.search);
  return Number(e.get("project_id") || e.get("id") || 0);
}
function CC() {
  return typeof window > "u" ? 0 : Number(
    new URLSearchParams(window.location.search).get("canvas_id") || 0
  );
}
function ko(e) {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  e > 0 ? t.searchParams.set("canvas_id", String(e)) : t.searchParams.delete("canvas_id"), window.History.prototype.replaceState.call(
    window.history,
    window.history.state,
    "",
    t
  );
}
function kC(e) {
  if (typeof window > "u")
    return !1;
  try {
    return Mv(
      window.localStorage.getItem(
        `${Sp}:${e}`
      )
    );
  } catch {
    return !1;
  }
}
function RC() {
  if (typeof window > "u")
    return vi;
  try {
    return Cp(
      Number(
        window.localStorage.getItem(Np) || vi
      )
    );
  } catch {
    return vi;
  }
}
function el(e, t) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(e, t);
    } catch {
    }
}
const m0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkSpacePage: SN
}, Symbol.toStringTag, { value: "Module" })), _i = /* @__PURE__ */ new Map(), xC = 15e3;
function AC(e, t) {
  const n = JSON.stringify([
    e.projectId,
    e.workAssetId,
    e.runId,
    e.requestId
  ]);
  let r = _i.get(n);
  r || (r = TC(e), _i.set(n, r));
  const s = r.subscribe(t);
  return () => {
    s(), r.size || (r.dispose(), _i.get(n) === r && _i.delete(n));
  };
}
function TC(e) {
  const t = new AbortController(), n = /* @__PURE__ */ new Set();
  let r, s = !1, o = !1, i = !1, c = !1, a, d, u;
  const y = () => !t.signal.aborted && !o, h = () => {
    clearTimeout(r), t.abort();
  }, I = (S) => {
    if (y()) {
      o = !0, u = S, h();
      for (const x of n)
        S ? x.onError(S) : x.onEnd();
    }
  }, w = async () => {
    if (y()) {
      if (clearTimeout(r), i) {
        c = !0;
        return;
      }
      i = !0;
      try {
        const S = await S_({
          projectId: e.projectId,
          runId: e.runId,
          requestId: e.requestId,
          reportError: !1
        });
        if (!y()) return;
        const x = S?.run;
        if (!x || Number(x.id) !== e.runId || String(x.request_id) !== e.requestId) {
          I(new Error("运行状态与当前故事不匹配"));
          return;
        }
        d = x;
        for (const T of n) T.onStatus(x);
        (yl(x.status) || !e.running) && I();
      } catch (S) {
        if (!y()) return;
        const x = Number(S?.code);
        (x === 401 || x === 403 || !e.running) && I(S);
      } finally {
        i = !1, y() && c ? (c = !1, w()) : y() && (r = setTimeout(w, xC));
      }
    }
  }, C = () => {
    s || (s = !0, w(), !(!e.running || !y()) && ed({
      projectId: e.projectId,
      requestId: e.requestId,
      signal: t.signal,
      recoverOnError: !0,
      onFrame: (S) => {
        if (y()) {
          a = S;
          for (const x of n) x.onFrame(S);
        }
      }
    }).then(() => {
      y() && w();
    }).catch((S) => I(S)));
  };
  return {
    get size() {
      return n.size;
    },
    subscribe(S) {
      return n.add(S), d && S.onStatus(d), a && S.onFrame(a), o && (u ? S.onError(u) : S.onEnd()), C(), () => n.delete(S);
    },
    dispose: h
  };
}
function MC({
  projectId: e,
  snapshot: t,
  snapshotRef: n,
  workAssetIdRef: r,
  scopeRef: s,
  scope: o,
  mounted: i,
  acceptSnapshot: c,
  loadWork: a,
  reportError: d,
  observeCompletedRuns: u = !0
}) {
  const [y, h] = q(""), [I, w] = q(null), [C, S] = q(null), x = W(""), T = W(/* @__PURE__ */ new Set()), U = E(() => {
    S(null), x.current = "", T.current.clear();
  }, []), ee = E(() => h(""), []);
  return ue(() => {
    const Z = n.current;
    if (!Z?.run_id || !Z.request_id || !u && Z.document.status !== "running" || r.current && Z.work_asset_id !== r.current)
      return;
    const oe = s.current;
    let X = !1;
    const O = (K) => !!(K && K.work_asset_id === Z.work_asset_id && K.run_id === Z.run_id && K.request_id === Z.request_id), we = () => !X && i.current && s.current === oe && O(n.current), ve = {
      workAssetId: Z.work_asset_id,
      runId: Z.run_id,
      requestId: Z.request_id
    }, D = Date.now(), V = () => w((K) => {
      const H = K?.runId === Z.run_id && K?.requestId === Z.request_id && K?.workAssetId === Z.work_asset_id ? K : { ...ve, startedAt: D, source: "observed" };
      return n.current?.document.status === "running" ? H : { ...H, finishedAt: H.finishedAt || Date.now() };
    });
    x.current = "", T.current.clear(), V();
    const G = AC(
      {
        ...ve,
        projectId: e,
        running: Z.document.status === "running"
      },
      {
        onStatus: (K) => {
          if (!we()) return;
          const ne = La(K.output);
          ne && O(ne) && c(ne);
          const H = $s(K);
          H ? w((fe) => ({
            ...ve,
            ...H,
            source: "server",
            ...n.current?.document.status !== "running" ? {
              finishedAt: H.finishedAt || fe?.finishedAt || Date.now()
            } : {}
          })) : V(), (K.status === "fail" || n.current?.document.status === "failed") && h(
            String(K.error || "生成失败，已完成内容已保留")
          );
        },
        onFrame: (K) => {
          if (!we()) return;
          const ne = Dg(K.output);
          if ($d(ne, n.current)) {
            if (T.current.has(ne.step_request_id)) return;
            x.current !== ne.step_request_id && x.current && T.current.add(x.current), x.current = ne.step_request_id, S(ne);
          }
          const H = La(K.output);
          H && O(H) && c(H), K.type === "result" && Number(K.status) === 2 && h(K.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          we() && a().catch((K) => {
            we() && d(K);
          });
        },
        onError: (K) => {
          we() && (V(), d(K));
        }
      }
    );
    return () => {
      X = !0, G();
    };
  }, [
    c,
    i,
    s,
    n,
    r,
    a,
    e,
    d,
    o,
    u,
    t?.work_asset_id,
    t?.run_id,
    t?.request_id
  ]), {
    generationError: t?.document.status === "running" || t?.document.status === "ready" ? "" : y,
    generationTiming: I,
    preview: $d(C, t) ? C : Mg(t),
    clearPreview: U,
    clearGenerationError: ee
  };
}
function g0({
  projectId: e,
  canvasId: t,
  node: n,
  output: r,
  onAssetUpdated: s,
  readOnMount: o = !0
}) {
  const [i, c] = q(
    () => Po(n, r)
  ), a = W(i), d = n.asset?.id || n.resultRef?.asset_id, u = `${e}:${t}:${n.id}:${d || 0}`, y = W(u), h = W(d), I = W(n.asset), w = W(s), C = W(0), S = W(!0), [x, T] = q(""), U = E(
    (G) => T(G instanceof Error ? G.message : "创作操作失败"),
    []
  );
  ue(() => {
    y.current = u, h.current = d, I.current = n.asset, w.current = s;
  }, [u, d, n.asset, s]), ue(() => (S.current = !0, () => {
    S.current = !1;
  }), []);
  const ee = E((G) => {
    if (!S.current || h.current && G.work_asset_id !== h.current)
      return G;
    const K = ml(a.current, G);
    if (a.current = K, c(K), I.current?.id === K.work_asset_id && K === G) {
      const ne = I.current, H = {
        ...ne,
        name: K.document.title,
        version_id: K.work_version_id,
        version: {
          ...ne.version,
          id: K.work_version_id,
          asset_id: K.work_asset_id,
          version: K.work_version || ne.version?.version || 1,
          updated_at: K.work_updated_at,
          content: {
            json: K.document,
            writing_revision: K.work_revision
          }
        }
      };
      I.current = H, w.current?.(H);
    }
    return K;
  }, []), Z = E(async () => {
    const G = y.current, K = n.asset?.id || n.resultRef?.asset_id || a.current?.work_asset_id;
    if (!K) return;
    const ne = ++C.current, H = await A_({
      projectId: e,
      assetId: K,
      currentOnly: !0,
      reportError: !1
    });
    if (!S.current || ne !== C.current || y.current !== G)
      return;
    const fe = Cs(H.asset.version?.content);
    if (!fe) throw new Error("作品内容格式不正确");
    I.current = H.asset;
    const be = a.current;
    ee({
      work_asset_id: K,
      work_version_id: H.asset.version_id,
      work_revision: ms(H.asset.version),
      work_version: H.asset.version?.version,
      work_updated_at: H.asset.version?.updated_at || H.asset.version?.created_at,
      document: fe,
      run_id: fe.active_run_id,
      request_id: fe.active_request_id,
      status: fe.status,
      checkpoint: be?.run_id === fe.active_run_id && be.work_revision === ms(H.asset.version) ? be.checkpoint : void 0,
      proposal: be?.run_id === fe.active_run_id && be.work_revision === ms(H.asset.version) ? be.proposal : void 0
    });
  }, [ee, n.asset?.id, n.resultRef?.asset_id, e]);
  ue(() => {
    o && Z().catch(U);
  }, [Z, o, U]), ue(() => {
    const G = n.asset?.id || n.resultRef?.asset_id, K = n.asset?.version_id || n.resultRef?.version_id, ne = a.current;
    o && ne && ne.work_asset_id === G && K && K > ne.work_version_id && Z().catch(U);
  }, [
    Z,
    o,
    n.asset?.id,
    n.asset?.version_id,
    n.resultRef?.asset_id,
    n.resultRef?.version_id,
    U
  ]), ue(() => {
    const G = Po(n, r, a.current);
    G && ee(G);
  }, [ee, n, r]);
  const {
    generationTiming: oe,
    generationError: X,
    preview: O,
    clearPreview: we,
    clearGenerationError: ve
  } = MC({
    projectId: e,
    snapshot: i,
    snapshotRef: a,
    workAssetIdRef: h,
    scopeRef: y,
    scope: u,
    mounted: S,
    acceptSnapshot: ee,
    loadWork: Z,
    reportError: U,
    observeCompletedRuns: o
  }), D = E(
    (G, K = {}, ne) => {
      const H = a.current;
      if (!H) throw new Error("请等待作品加载完成");
      return {
        project_id: e,
        canvas_id: t,
        work_asset_id: H.work_asset_id,
        expected_work_version_id: ne ?? H.work_version_id,
        expected_work_revision: H.work_revision,
        action: G,
        ...K
      };
    },
    [t, e]
  ), V = E(async () => {
    const G = a.current;
    !G?.run_id || G.document.status !== "running" || (await Nf({
      projectId: e,
      runId: G.run_id,
      requestId: G.request_id,
      reportError: !1
    }), await Z());
  }, [Z, e]);
  return {
    snapshot: i,
    snapshotRef: a,
    mounted: S,
    acceptSnapshot: ee,
    loadWork: Z,
    command: D,
    stopRun: V,
    reportError: U,
    setError: T,
    error: x || X || (!i && n.asset?.version?.content != null ? "作品内容格式不正确" : ""),
    generationTiming: oe,
    preview: O,
    clearPreview: we,
    clearGenerationError: ve
  };
}
function y0(e, t, n, r) {
  if (!t || !Object.keys(t.fields).length) return e;
  const s = { ...e }, o = (a, d, u) => {
    s.outline === e.outline && (s.outline = { ...e.outline }), s.outline[a] === e.outline[a] && (s.outline[a] = [...e.outline[a]]);
    const y = s.outline[a];
    return y[d] ? y[d] === e.outline[a][d] && (y[d] = { ...y[d] }) : y[d] = { id: u, name: "", description: "" }, y[d];
  }, i = (a) => (s.units === e.units && (s.units = [...e.units]), s.units[a] ? s.units[a] === e.units[a] && (s.units[a] = { ...s.units[a] }) : s.units[a] = {
    id: "",
    title: "",
    plan: "",
    unit_type: "chapter",
    children: [],
    asset_id: 0,
    version_id: 0,
    has_body: !1,
    continuity_valid: !1,
    dependency_stale: !1
  }, s.units[a]), c = t.values || {};
  for (const a of ["characters", "locations", "props"])
    for (let d = 0; ; d++) {
      const u = c[`outline.${a}.${d}.id`];
      if (typeof u != "string") break;
      o(a, d, u).id = u;
    }
  for (const [a, d] of Object.entries(t.fields)) {
    const u = a.replace(/\[(\d+)\]/g, ".$1"), y = /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
      u
    );
    if (y) {
      const S = y[1];
      if (e.preferences[S]) continue;
      const x = S === "chapter_words" || S === "planned_chapters" ? c[u] : d, T = { ...s.preferences, [S]: x };
      Eg(T) && (s.preferences = T);
      continue;
    }
    const h = /^inspirations\.(\d+)\.(title|content)$/.exec(u), I = /^units\.(\d+)\.(title|plan)$/.exec(u), w = /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
      u
    ), C = u.startsWith("outline.") ? u.slice(8) : u === "content" ? t.section_id : void 0;
    if (C && Hi(C))
      s.outline === e.outline && (s.outline = { ...e.outline }), s.outline[C] = d;
    else if (h) {
      const S = t.inspiration_id ? s.inspirations.findIndex(
        (x) => x.id === t.inspiration_id
      ) : Number(h[1]);
      if (S < 0) continue;
      s.inspirations === e.inspirations && (s.inspirations = [...e.inspirations]), s.inspirations[S] && s.inspirations[S] === e.inspirations[S] && (s.inspirations[S] = { ...s.inspirations[S] }), s.inspirations[S] ||= { id: "", title: "", content: "" }, s.inspirations[S][h[2]] = d;
    } else if (I) {
      const S = Number(I[1]), x = n === "generate_chapters" && r?.length ? s.units.findIndex(
        (T) => T.id === r[S]
      ) : S + (n === "append" ? e.units.length : 0);
      if (x < 0 || r?.length && n === "generate_chapters" && !r[S])
        continue;
      i(x)[I[2]] = d;
    } else if (w) {
      const S = w[1] || t.section_id;
      if (S !== "characters" && S !== "locations" && S !== "props")
        continue;
      const x = t.entity_id ? s.outline[S].findIndex(
        (T) => T.id === t.entity_id
      ) : Number(w[2]);
      if (x < 0) continue;
      o(S, x, `preview:${S}:${x}`)[w[3]] = d;
    } else if (t.section_id === "chapter_plan" && t.unit_id && u === "plan") {
      const S = s.units.findIndex(
        (x) => x.id === t.unit_id
      );
      S >= 0 && (i(S).plan = d);
    }
  }
  return s;
}
const DC = {
  generate_inspirations: "生成灵感",
  select_inspiration: "选定灵感",
  generate_outline: "生成大纲",
  generate_chapters: "规划剧情",
  retry_continuity: "整理剧情衔接",
  propose_edit: "生成修改建议",
  generate_section: "生成内容",
  generate_units: "生成正文",
  append: "追加规划"
};
function EC(e) {
  return DC[e] || "创作任务";
}
const Ic = [
  { id: "preferences", label: "生成写作设定" },
  { id: "direction", label: "生成故事总纲" },
  { id: "characters", label: "生成人物" },
  { id: "background", label: "生成背景" },
  { id: "chapters", label: "规划章节剧情" }
];
function h0(e) {
  if (e?.checkpoint?.action !== "generate_outline") return "";
  const t = Ic.findIndex(
    ({ id: n }) => n === e.checkpoint?.phase
  );
  return t >= 0 ? `第${t + 1}/${Ic.length}步` : "";
}
function _0(e) {
  const t = e?.checkpoint;
  if (!e) return "正在准备创作";
  if (!t) return "创作任务";
  const { document: n } = e;
  if (t.phase) {
    const i = Ic.find(({ id: u }) => u === t.phase), c = t.phase === "continuity" ? t.continuity_unit_id || t.unit_id : t.unit_id || t.unit_ids?.[t.completed], a = c ? n.units.findIndex((u) => u.id === c) : -1, d = t.phase === "continuity" && t.history_total ? `正在整理前文 ${t.history_completed || 0}/${t.history_total}` : i ? `${n.status === "running" ? "正在" : ""}${i.label}` : t.phase === "body" ? "正在写正文" : "正文已保存，整理剧情衔接";
    if (t.phase === "chapters") {
      const u = Math.min(
        $r,
        t.count || n.preferences.planned_chapters || (n.preferences.mode === "serial" ? 10 : 5)
      );
      return `${d} · 第 1—${u} 章`;
    }
    return `${d}${a >= 0 ? ` · 第 ${a + 1} 章` : ""}`;
  }
  const r = EC(t.action);
  if (t.action === "append") {
    const i = Pg(
      n.units,
      n.preferences.planned_chapters,
      t.count
    );
    return `${r} · 第 ${i.start}—${i.end} 章`;
  }
  if (t.action === "generate_chapters" && t.unit_ids.length) {
    const i = ar(n.units), c = t.unit_ids.flatMap((a) => {
      const d = i.byId.get(a);
      return d ? [d] : [];
    });
    return `${r} · ${cl(c)}`;
  }
  const s = t.unit_ids?.[t.completed] || t.unit_id, o = n.units.find((i) => i.id === s);
  if (o)
    return `${r} · ${Og(n, { kind: "unit", id: o.id })}${t.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (t.action === "generate_section" || t.action === "propose_edit") {
    const i = [...dl, ...Fg].find(
      (a) => a.id === t.section_id
    ), c = Bg.flatMap(({ id: a }) => n.outline[a]).find((a) => a.id === t.entity_id);
    return `${r}${i ? ` · ${i.label}` : ""}${c ? ` · ${c.name}` : ""}`;
  }
  return r;
}
export {
  di as $,
  R_ as A,
  c0 as B,
  hv as C,
  d0 as D,
  l0 as E,
  u0 as F,
  a0 as G,
  e0 as H,
  o0 as I,
  $c as J,
  n0 as K,
  r0 as L,
  By as M,
  i0 as N,
  Kh as O,
  p0 as P,
  Hc as Q,
  eu as R,
  sr as S,
  f0 as T,
  ir as U,
  Fy as V,
  HC as W,
  YC as X,
  XC as Y,
  h0 as Z,
  $I as _,
  ih as a,
  JC as a0,
  QC as a1,
  EC as a2,
  ZC as a3,
  m0 as a4,
  Cp as b,
  s0 as c,
  Jl as d,
  Tt as e,
  Uc as f,
  zw as g,
  g0 as h,
  _n as i,
  _0 as j,
  It as k,
  jI as l,
  y0 as m,
  zc as n,
  ze as o,
  _v as p,
  EI as q,
  yw as r,
  My as s,
  OI as t,
  $w as u,
  t0 as v,
  w_ as w,
  dr as x,
  Cw as y,
  A_ as z
};
