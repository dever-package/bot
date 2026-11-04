import { s as le } from "./site-config-D0c23URW.js";
import { S as Re, T as Ee, U as fe, g as pe, i as P, M as te, V as Te, W as $e, O as ne, b as re, P as xe, X as Ne, m as De, C as qe, D as Me, d as Oe, o as Be, z as Pe, y as je, Y as Fe, Z as Ve } from "./writing-document-YwPtpDvk.js";
import { z as me, x as ve, f as _e, e as ze, p as We, s as Ue, o as Le, q as Ge, n as Ke } from "./runtime-DQ2rFFvP.js";
import { h as He, X as Je, n as Xe, z as Ye, i as Ze, t as O } from "./content-view-0gIO2Kkv.js";
import { l as Qe, j as ge, i as we, h as he } from "./space-reference-content-K_sxMShu.js";
import { aE as et, aF as tt, aG as nt, b as rt, aw as st } from "./space-optional-components-C8EUHVoE.js";
import { a as x, d as T, E as it, b as C, h as $ } from "./file-kind-BSFhe2vU.js";
import { u as ot, i as at } from "./space-node-runtime-CxMQ_W2k.js";
import { a as ct } from "./space-loading-FH4pJ97O.js";
import { S as ut, T as dt, b as lt, e as ft, t as pt, U as mt, O as vt } from "./node-detail-header-CD6P0SMz.js";
import { j as H, a as _t } from "./preloadable-BrN58FXf.js";
import { z as gt } from "./vendor-icons-UGaOWWu-.js";
import { B as wt } from "./asset-preview-D6nljO8_.js";
import { w as ht, h as kt } from "./interaction-D6_wMtPr.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const U = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ke = U.joinSiteApi, be = U.request;
async function bn(e) {
  const t = le(
    await be(ke("project/writing_command"), "post", e, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), n = Re(t);
  if (!n) throw new Error("创作响应缺少已保存版本");
  return n;
}
async function Sn(e) {
  const t = le(
    await be(
      ke("project/writing_runs"),
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
        checkpoint: Ee(n.checkpoint)
      })
    ),
    hasMore: !!t.has_more,
    beforeId: Number(t.before_id || 0)
  };
}
function An(e, t) {
  const n = e || St(), i = We({
    type: "stream",
    output: t
  }), r = i.event, o = i.activity, c = At(n.text, i.delta, t, r), l = yt(r, o) ? {
    ...n.output,
    ...i.output,
    ...c ? { text: c } : {}
  } : n.output, u = o && !o.anchorText ? { ...o, anchorText: c } : o, s = u ? Ue(n.activities, u) : n.activities, a = Le(
    Ge(n.document, i.output),
    _e(i.output.document)
  ), f = ve(l) || n.interaction, m = me(l);
  return {
    started: !0,
    text: c,
    output: l,
    activities: s,
    document: a,
    interaction: f,
    suggestions: m.length > 0 ? m : n.suggestions,
    error: i.error || n.error
  };
}
function yn(e) {
  const t = bt(e);
  return {
    started: Object.keys(t).length > 0,
    text: L(t.text),
    output: t,
    activities: ze(t),
    document: _e(t.document),
    interaction: ve(t),
    suggestions: me(t),
    error: L(t.error)
  };
}
function bt(e) {
  const t = Ke(e);
  if (L(t.text))
    return t;
  const n = He(e);
  if (!n)
    return t;
  const i = { ...t, text: n };
  return delete i.rich, i;
}
function Cn(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function St() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function At(e, t, n, i) {
  return t ? `${e}${t}` : i === "final" && L(n.text) || e;
}
function yt(e, t) {
  return !(t || e === "start" || e === "delta");
}
function L(e) {
  return e == null ? "" : String(e);
}
function In(e) {
  const t = Xe(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const i = e.previousAssets?.find(
    (c) => c.id === Number(t.id || 0)
  ), r = i ? j(i, e.previousAsset) : e.previousAsset || null, o = j(
    t,
    r
  );
  return r && fe(r, o) ? r : r?.version?.content != null && Number(r.version.id || 0) === Number(o.version?.id || 0) && (!pe(o.version?.content) || P(r.version) >= P(o.version)) ? j(r, o) : o.version?.id ? o : null;
}
function Rn(e, t) {
  const n = Ct(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function En(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function j(e, t) {
  const n = se(e), i = t ? se(t) : null, r = [
    ...n.versions || [],
    ...i?.versions || []
  ], o = It(
    [Et(n.version)].filter(
      (c) => !!c
    ),
    r
  );
  return {
    ...i,
    ...n,
    version: n.version || i?.version,
    versions: o.length ? o : void 0
  };
}
function Tn(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((r) => [r.id, r])), i = e.map((r) => {
    const o = n.get(r.id);
    return o ? (n.delete(r.id), fe(r, o) ? r : j(o, r)) : r;
  });
  return [
    ...[...n.values()].map(
      (r) => j(r)
    ),
    ...i
  ];
}
function Ct(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function se(e) {
  const t = ie(e.version), n = (e.versions || []).map(ie).filter((i) => !!i);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function ie(e) {
  if (!e)
    return;
  const t = Je(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function It(...e) {
  const t = e.flat(), n = [], i = /* @__PURE__ */ new Map();
  for (const o of t) {
    if (!o || Number(o.id || 0) <= 0)
      continue;
    const c = String(o.id), l = i.get(c);
    if (l !== void 0) {
      n[l] = Rt(
        n[l],
        o
      );
      continue;
    }
    i.set(c, n.length), n.push(o);
  }
  let r = !1;
  return n.sort(
    (o, c) => Number(J(c)) - Number(J(o)) || Number(c.version || c.id || 0) - Number(o.version || o.id || 0)
  ).map((o) => J(o) ? r ? Tt(o) : (r = !0, o) : o);
}
function Rt(e, t) {
  const n = { ...e };
  for (const [i, r] of Object.entries(t))
    r !== void 0 && r !== "" && (n[i] = r);
  return n;
}
function J(e) {
  return !!(e.is_current || e.current);
}
function Et(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Tt(e) {
  const { current: t, is_current: n, ...i } = e;
  return i;
}
const $t = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], xt = Object.fromEntries(
  $t.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Nt(e) {
  return xt[e] || "文本";
}
function $n(e, t = []) {
  const n = new Map(
    t.map((s) => [s.key, s])
  ), i = new Map(e.nodes.map((s) => [s.id, s])), r = new Map(
    e.nodes.filter((s) => s.type === "group").map((s) => [s.id, s])
  ), o = qt(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), c = e.nodes.filter(et).map((s) => {
    const a = n.get(`node:${s.id}`), f = o.get(s.id) || s.asset, m = s.groupId ? r.get(s.groupId) : void 0, b = m?.group?.sourceNodeId ? i.get(m.group.sourceNodeId) : void 0, g = a?.node === s && a?.asset === f, S = g ? a.output : e.nodeOutput(s);
    return {
      key: `node:${s.id}`,
      role: "material",
      title: s.title || Nt(oe(s)),
      sourcePath: b?.title && m?.title ? `${b.title} / ${m.title}` : m?.title,
      nodeType: oe(s),
      status: g ? a.status : Mt(s, f, e.nodeHasResult(s)),
      preview: g ? a.preview : e.nodePreview(s),
      output: S,
      node: s,
      nodeId: s.id,
      nodeNo: s.nodeNo,
      groupId: s.groupId,
      groupTitle: m?.title,
      asset: f,
      assetId: f?.id,
      versionId: f?.version?.id || f?.version_id
    };
  }).filter((s) => !!(s.assetId && s.versionId)), u = [...e.assets.filter(
    (s) => Number(s.canvas_id || 0) === e.canvasId && Number(s.asset_cate_id || 0) === e.assetCateId && String(s.role || "material") === "work" && String(s.status || "") !== "archived"
  ).map((s) => {
    const a = n.get(`asset:${s.id}`);
    return {
      key: `asset:${s.id}`,
      role: "work",
      title: s.name || `作品 ${s.id}`,
      nodeType: Ae(s.kind),
      status: s.version?.id || s.version_id ? "ready" : "empty",
      preview: a?.asset === s ? a.preview : e.assetPreview(s),
      output: s.version?.content,
      asset: s,
      assetId: s.id,
      versionId: s.version?.id || s.version_id
    };
  }), ...c].filter((s) => !!(s.assetId && s.versionId)).map((s) => {
    const a = n.get(s.key);
    return a && Dt(a, s) ? a : s;
  });
  return u.length === t.length && u.every((s, a) => s === t[a]) ? t : u;
}
function Se(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function Dt(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && Se(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function oe(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : Ae(e.power?.kind || e.kind);
}
function Ae(e) {
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
function qt(e, t, n) {
  const i = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (Number(r.canvas_id || 0) !== t || Number(r.asset_cate_id || 0) !== n || String(r.role || "") !== "material" || String(r.status || "") === "archived")
      continue;
    const o = String(
      r.node_key || r.version?.node_key || ""
    ).trim();
    o && !i.has(o) && i.set(o, r);
  }
  return i;
}
function Mt(e, t, n) {
  const i = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return i === "running" || i === "waiting" || e.running === !0 ? "running" : i === "error" || i === "failed" || i === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function xn(e, t = []) {
  return {
    current: Bt([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: ye(
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
const ae = /* @__PURE__ */ new WeakMap(), ce = /* @__PURE__ */ new WeakMap();
function Nn(e, t = []) {
  const n = new Map(
    t.map((r) => [`${r.source}:${r.id}`, r])
  ), i = e.flatMap((r) => {
    const o = ae.get(r);
    if (o) return o;
    const c = {
      id: r.role === "material" ? r.nodeId || r.key : String(r.assetId || r.key),
      title: r.title,
      kind: ye(r.preview, r.nodeType),
      role: r.role,
      source: r.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: r.assetId,
      versionID: r.versionId,
      output: r.output,
      preview: r.preview,
      asset: r.asset
    }, l = n.get(`${c.source}:${c.id}`), s = (l && ue(l, c) ? ce.get(l) : void 0) || Qe(c).map((a) => {
      const f = n.get(
        `${a.source}:${a.id}`
      );
      return f && ue(f, a) ? f : a;
    });
    return ae.set(r, s), ce.set(s[0], s), s;
  });
  return i.length === t.length && i.every((r, o) => r === t[o]) ? t : i;
}
function ue(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && Se(e.preview, t.preview) && Ot(e.contentSelection, t.contentSelection);
}
function Ot(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((n, i) => n === t.ids[i]));
}
function Bt(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const i of e) {
    const r = `${i.source}:${i.id}`;
    n.has(r) || (n.add(r), t.push(i));
  }
  return t;
}
function ye(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const X = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!X || Object.keys(X).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Pt = X.joinSiteApi;
async function jt(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return ht({
    streamApi: Ft(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: e.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (n, i) => (e.onFrame(i), n)
  });
}
function Ft(e) {
  const t = new URL(Pt("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
function W(e, t) {
  const n = String(e || "");
  return n.trim() && n.trim() === String(t || "").trim() ? "" : n;
}
function Dn(e, t) {
  return !!W(e, t).trim();
}
function Vt(e, t, n) {
  if (!t?.trim())
    return e;
  const i = W(e.prompt, t), r = e.promptContent, o = ge(r), c = r?.parts.filter((m) => m.type === "text").map((m) => m.text).join(""), l = [o, c].some(
    (m) => !!m?.trim() && !W(m, t)
  ), u = l ? we(
    i,
    he(r)
  ) : r, s = l && !u?.parts.length ? void 0 : u;
  let a = e.paramValues;
  const f = n ? a?.[n] : void 0;
  if (n && typeof f == "string") {
    const m = W(f, t);
    m !== f && (a = { ...a, [n]: m });
  }
  return i === e.prompt && s === r && a === e.paramValues ? e : { ...e, prompt: i, promptContent: s, paramValues: a };
}
function qn(e, t, n) {
  const i = Vt(
    e,
    t,
    n
  ), r = String(t || "");
  if (!r.trim())
    return i;
  const o = ge(
    i.promptContent
  ), c = i.promptContent?.parts.filter((a) => a.type === "text").map((a) => a.text).join(""), l = i.prompt?.trim() ? i.prompt : c?.trim() ? o : r;
  let u = i.paramValues;
  n && u?.[n] !== l && (u = { ...u || {}, [n]: l });
  const s = i.promptContent ? we(
    l,
    he(i.promptContent)
  ) : i.promptContent;
  return l === i.prompt && s === i.promptContent && u === i.paramValues ? i : { ...i, prompt: l, promptContent: s, paramValues: u };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const zt = Y.joinSiteApi, Z = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!Z || Object.keys(Z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Wt = Z.useAuthStore, Ut = ct();
function Mn(e, t) {
  const n = ot(), i = Wt(
    (S) => S.auth?.accessToken || ""
  ), r = JSON.stringify([
    zt("workspace/canvas_execution"),
    n,
    i
  ]), o = String(t.runError || "").trim(), c = t.id, l = Number(t.resultRef?.execution_id || 0), u = String(t.resultRef?.request_id || "").trim(), s = Number(t.resultRef?.run_id || 0), a = Ce(
    e,
    c,
    l,
    u,
    s
  ), [f, m] = x(o), [b, g] = x(!1);
  return T(() => {
    if (m(o), !o || !a || !ut(o)) {
      g(!1);
      return;
    }
    let S = !0;
    return g(!0), Lt({
      projectId: e,
      nodeId: c,
      executionId: l,
      requestId: u,
      runId: s,
      requestScopeKey: r,
      fallback: o
    }).then((d) => {
      S && d && m(d);
    }).catch(() => {
    }).finally(() => {
      S && g(!1);
    }), () => {
      S = !1;
    };
  }, [
    l,
    o,
    c,
    e,
    a,
    r,
    u,
    s
  ]), { error: f || o, loading: b };
}
function Lt({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: i,
  runId: r,
  requestScopeKey: o,
  fallback: c
}) {
  const l = JSON.stringify([
    o,
    Ce(e, "", n, i, r)
  ]);
  return Ut(
    l,
    () => tt({
      projectId: e,
      executionId: n,
      requestId: i,
      runId: r
    }).then(pt)
  ).then((s) => {
    const a = [...s.node_results || []].reverse().find((m) => m.node_key === t), f = dt(a) || lt(s);
    return ft(f, c);
  });
}
function Ce(e, t, n, i, r) {
  const o = n ? `execution:${n}` : i ? `request:${i}` : r ? `run:${r}` : "";
  return e > 0 && o ? `${e}:${o}:${t}` : "";
}
function On(e) {
  const t = Gt(e.trim()), n = Ye(t), i = Ie(n), r = t.match(/\bstatus=(\d{3})\b/), c = (i || (r && t.includes("body=") ? `请求失败（HTTP ${r[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: c.length > 96 ? `${c.slice(0, 95)}…` : c,
    details: t
  };
}
function Ie(e) {
  return Ze(e) ? Ie(e.error) || O(e.message) || O(e.msg) || O(e.detail) || O(e.details) || O(e.error) : "";
}
function Gt(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const V = /* @__PURE__ */ new Set();
let Q = Date.now(), B;
function Kt(e) {
  return V.add(e), B == null && typeof window < "u" && (Q = Date.now(), B = window.setInterval(() => {
    Q = Date.now(), V.forEach((t) => t());
  }, 1e3)), () => {
    V.delete(e), V.size === 0 && B != null && (window.clearInterval(B), B = void 0);
  };
}
function Ht() {
  return () => {
  };
}
function de() {
  return Q;
}
function Jt(e) {
  return it(
    e ? Kt : Ht,
    de,
    de
  );
}
function Bn({
  runTiming: e,
  runningNode: t,
  showEstimate: n = !0,
  active: i,
  observed: r = !1
}) {
  const o = i ?? at(t), c = i !== void 0 ? e : o ? { startedAt: t?.startedAt || 0, finishedAt: void 0 } : Xt(t) || e, l = Jt(!!(o && c?.startedAt));
  if (!c?.startedAt || !o && (!c.finishedAt || c.finishedAt < c.startedAt))
    return null;
  const u = Math.max(
    0,
    (o ? l : c.finishedAt || c.startedAt) - c.startedAt
  ), s = mt(
    u,
    o,
    t?.estimatedDurationMs
  ), a = `${r ? "本次查看" : ""}${s.elapsed}`, f = r ? a : n ? s.tooltip : a;
  return /* @__PURE__ */ H(wt, { label: f, side: "top", sideOffset: 6, children: /* @__PURE__ */ _t(
    "span",
    {
      className: `ws-node-run-timing${o ? " is-active" : ""}`,
      "aria-label": f,
      children: [
        /* @__PURE__ */ H(gt, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ H("span", { children: a })
      ]
    }
  ) });
}
function Xt(e) {
  if (!(!e?.startedAt || !e.finishedAt))
    return {
      startedAt: e.startedAt,
      finishedAt: e.finishedAt
    };
}
const Yt = 520, Zt = 440, Qt = 720, Pn = "bot.canvasAssistant.width", jn = "bot.canvasAssistant.open";
function Fn(e) {
  return Number.isFinite(e) ? Math.min(
    Qt,
    Math.max(Zt, Math.round(e))
  ) : Yt;
}
function Vn(e, t) {
  const n = e && t;
  return {
    launcherVisible: e && !n,
    panelVisible: n
  };
}
function zn(e) {
  return e === "1";
}
const z = /* @__PURE__ */ new Map(), en = 15e3;
function tn(e, t) {
  const n = JSON.stringify([
    e.projectId,
    e.workAssetId,
    e.runId,
    e.requestId
  ]);
  let i = z.get(n);
  i || (i = nn(e), z.set(n, i));
  const r = i.subscribe(t);
  return () => {
    r(), i.size || (i.dispose(), z.get(n) === i && z.delete(n));
  };
}
function nn(e) {
  const t = new AbortController(), n = /* @__PURE__ */ new Set();
  let i, r = !1, o = !1, c = !1, l = !1, u, s, a;
  const f = () => !t.signal.aborted && !o, m = () => {
    clearTimeout(i), t.abort();
  }, b = (d) => {
    if (f()) {
      o = !0, a = d, m();
      for (const v of n)
        d ? v.onError(d) : v.onEnd();
    }
  }, g = async () => {
    if (f()) {
      if (clearTimeout(i), c) {
        l = !0;
        return;
      }
      c = !0;
      try {
        const d = await nt({
          projectId: e.projectId,
          runId: e.runId,
          requestId: e.requestId,
          reportError: !1
        });
        if (!f()) return;
        const v = d?.run;
        if (!v || Number(v.id) !== e.runId || String(v.request_id) !== e.requestId) {
          b(new Error("运行状态与当前故事不匹配"));
          return;
        }
        s = v;
        for (const A of n) A.onStatus(v);
        (kt(v.status) || !e.running) && b();
      } catch (d) {
        if (!f()) return;
        const v = Number(d?.code);
        (v === 401 || v === 403 || !e.running) && b(d);
      } finally {
        c = !1, f() && l ? (l = !1, g()) : f() && (i = setTimeout(g, en));
      }
    }
  }, S = () => {
    r || (r = !0, g(), !(!e.running || !f()) && jt({
      projectId: e.projectId,
      requestId: e.requestId,
      signal: t.signal,
      recoverOnError: !0,
      onFrame: (d) => {
        if (f()) {
          u = d;
          for (const v of n) v.onFrame(d);
        }
      }
    }).then(() => {
      f() && g();
    }).catch((d) => b(d)));
  };
  return {
    get size() {
      return n.size;
    },
    subscribe(d) {
      return n.add(d), s && d.onStatus(s), u && d.onFrame(u), o && (a ? d.onError(a) : d.onEnd()), S(), () => n.delete(d);
    },
    dispose: m
  };
}
function rn({
  projectId: e,
  snapshot: t,
  snapshotRef: n,
  workAssetIdRef: i,
  scopeRef: r,
  scope: o,
  mounted: c,
  acceptSnapshot: l,
  loadWork: u,
  reportError: s,
  observeCompletedRuns: a = !0
}) {
  const [f, m] = x(""), [b, g] = x(null), [S, d] = x(null), v = C(""), A = C(/* @__PURE__ */ new Set()), I = $(() => {
    d(null), v.current = "", A.current.clear();
  }, []), R = $(() => m(""), []);
  return T(() => {
    const w = n.current;
    if (!w?.run_id || !w.request_id || !a && w.document.status !== "running" || i.current && w.work_asset_id !== i.current)
      return;
    const G = r.current;
    let F = !1;
    const D = (p) => !!(p && p.work_asset_id === w.work_asset_id && p.run_id === w.run_id && p.request_id === w.request_id), E = () => !F && c.current && r.current === G && D(n.current), q = {
      workAssetId: w.work_asset_id,
      runId: w.run_id,
      requestId: w.request_id
    }, K = Date.now(), M = () => g((p) => {
      const _ = p?.runId === w.run_id && p?.requestId === w.request_id && p?.workAssetId === w.work_asset_id ? p : { ...q, startedAt: K, source: "observed" };
      return n.current?.document.status === "running" ? _ : { ..._, finishedAt: _.finishedAt || Date.now() };
    });
    v.current = "", A.current.clear(), M();
    const h = tn(
      {
        ...q,
        projectId: e,
        running: w.document.status === "running"
      },
      {
        onStatus: (p) => {
          if (!E()) return;
          const k = ne(p.output);
          k && D(k) && l(k);
          const _ = vt(p);
          _ ? g((y) => ({
            ...q,
            ..._,
            source: "server",
            ...n.current?.document.status !== "running" ? {
              finishedAt: _.finishedAt || y?.finishedAt || Date.now()
            } : {}
          })) : M(), (p.status === "fail" || n.current?.document.status === "failed") && m(
            String(p.error || "生成失败，已完成内容已保留")
          );
        },
        onFrame: (p) => {
          if (!E()) return;
          const k = $e(p.output);
          if (te(k, n.current)) {
            if (A.current.has(k.step_request_id)) return;
            v.current !== k.step_request_id && v.current && A.current.add(v.current), v.current = k.step_request_id, d(k);
          }
          const _ = ne(p.output);
          _ && D(_) && l(_), p.type === "result" && Number(p.status) === 2 && m(p.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          E() && u().catch((p) => {
            E() && s(p);
          });
        },
        onError: (p) => {
          E() && (M(), s(p));
        }
      }
    );
    return () => {
      F = !0, h();
    };
  }, [
    l,
    c,
    r,
    n,
    i,
    u,
    e,
    s,
    o,
    a,
    t?.work_asset_id,
    t?.run_id,
    t?.request_id
  ]), {
    generationError: t?.document.status === "running" || t?.document.status === "ready" ? "" : f,
    generationTiming: b,
    preview: te(S, t) ? S : Te(t),
    clearPreview: I,
    clearGenerationError: R
  };
}
function Wn({
  projectId: e,
  canvasId: t,
  node: n,
  output: i,
  onAssetUpdated: r,
  readOnMount: o = !0
}) {
  const [c, l] = x(
    () => re(n, i)
  ), u = C(c), s = n.asset?.id || n.resultRef?.asset_id, a = `${e}:${t}:${n.id}:${s || 0}`, f = C(a), m = C(s), b = C(n.asset), g = C(r), S = C(0), d = C(!0), [v, A] = x(""), I = $(
    (h) => A(h instanceof Error ? h.message : "创作操作失败"),
    []
  );
  T(() => {
    f.current = a, m.current = s, b.current = n.asset, g.current = r;
  }, [a, s, n.asset, r]), T(() => (d.current = !0, () => {
    d.current = !1;
  }), []);
  const R = $((h) => {
    if (!d.current || m.current && h.work_asset_id !== m.current)
      return h;
    const p = xe(u.current, h);
    if (u.current = p, l(p), b.current?.id === p.work_asset_id && p === h) {
      const k = b.current, _ = {
        ...k,
        name: p.document.title,
        version_id: p.work_version_id,
        version: {
          ...k.version,
          id: p.work_version_id,
          asset_id: p.work_asset_id,
          version: p.work_version || k.version?.version || 1,
          updated_at: p.work_updated_at,
          content: {
            json: p.document,
            writing_revision: p.work_revision
          }
        }
      };
      b.current = _, g.current?.(_);
    }
    return p;
  }, []), w = $(async () => {
    const h = f.current, p = n.asset?.id || n.resultRef?.asset_id || u.current?.work_asset_id;
    if (!p) return;
    const k = ++S.current, _ = await rt({
      projectId: e,
      assetId: p,
      currentOnly: !0,
      reportError: !1
    });
    if (!d.current || k !== S.current || f.current !== h)
      return;
    const y = pe(_.asset.version?.content);
    if (!y) throw new Error("作品内容格式不正确");
    b.current = _.asset;
    const N = u.current;
    R({
      work_asset_id: p,
      work_version_id: _.asset.version_id,
      work_revision: P(_.asset.version),
      work_version: _.asset.version?.version,
      work_updated_at: _.asset.version?.updated_at || _.asset.version?.created_at,
      document: y,
      run_id: y.active_run_id,
      request_id: y.active_request_id,
      status: y.status,
      checkpoint: N?.run_id === y.active_run_id && N.work_revision === P(_.asset.version) ? N.checkpoint : void 0,
      proposal: N?.run_id === y.active_run_id && N.work_revision === P(_.asset.version) ? N.proposal : void 0
    });
  }, [R, n.asset?.id, n.resultRef?.asset_id, e]);
  T(() => {
    o && w().catch(I);
  }, [w, o, I]), T(() => {
    const h = n.asset?.id || n.resultRef?.asset_id, p = n.asset?.version_id || n.resultRef?.version_id, k = u.current;
    o && k && k.work_asset_id === h && p && p > k.work_version_id && w().catch(I);
  }, [
    w,
    o,
    n.asset?.id,
    n.asset?.version_id,
    n.resultRef?.asset_id,
    n.resultRef?.version_id,
    I
  ]), T(() => {
    const h = re(n, i, u.current);
    h && R(h);
  }, [R, n, i]);
  const {
    generationTiming: G,
    generationError: F,
    preview: D,
    clearPreview: E,
    clearGenerationError: q
  } = rn({
    projectId: e,
    snapshot: c,
    snapshotRef: u,
    workAssetIdRef: m,
    scopeRef: f,
    scope: a,
    mounted: d,
    acceptSnapshot: R,
    loadWork: w,
    reportError: I,
    observeCompletedRuns: o
  }), K = $(
    (h, p = {}, k) => {
      const _ = u.current;
      if (!_) throw new Error("请等待作品加载完成");
      return {
        project_id: e,
        canvas_id: t,
        work_asset_id: _.work_asset_id,
        expected_work_version_id: k ?? _.work_version_id,
        expected_work_revision: _.work_revision,
        action: h,
        ...p
      };
    },
    [t, e]
  ), M = $(async () => {
    const h = u.current;
    !h?.run_id || h.document.status !== "running" || (await st({
      projectId: e,
      runId: h.run_id,
      requestId: h.request_id,
      reportError: !1
    }), await w());
  }, [w, e]);
  return {
    snapshot: c,
    snapshotRef: u,
    mounted: d,
    acceptSnapshot: R,
    loadWork: w,
    command: K,
    stopRun: M,
    reportError: I,
    setError: A,
    error: v || F || (!c && n.asset?.version?.content != null ? "作品内容格式不正确" : ""),
    generationTiming: G,
    preview: D,
    clearPreview: E,
    clearGenerationError: q
  };
}
function Un(e, t, n, i) {
  if (!t || !Object.keys(t.fields).length) return e;
  const r = { ...e }, o = (u, s, a) => {
    r.outline === e.outline && (r.outline = { ...e.outline }), r.outline[u] === e.outline[u] && (r.outline[u] = [...e.outline[u]]);
    const f = r.outline[u];
    return f[s] ? f[s] === e.outline[u][s] && (f[s] = { ...f[s] }) : f[s] = { id: a, name: "", description: "" }, f[s];
  }, c = (u) => (r.units === e.units && (r.units = [...e.units]), r.units[u] ? r.units[u] === e.units[u] && (r.units[u] = { ...r.units[u] }) : r.units[u] = {
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
  }, r.units[u]), l = t.values || {};
  for (const u of ["characters", "locations", "props"])
    for (let s = 0; ; s++) {
      const a = l[`outline.${u}.${s}.id`];
      if (typeof a != "string") break;
      o(u, s, a).id = a;
    }
  for (const [u, s] of Object.entries(t.fields)) {
    const a = u.replace(/\[(\d+)\]/g, ".$1"), f = /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
      a
    );
    if (f) {
      const d = f[1];
      if (e.preferences[d]) continue;
      const v = d === "chapter_words" || d === "planned_chapters" ? l[a] : s, A = { ...r.preferences, [d]: v };
      Ne(A) && (r.preferences = A);
      continue;
    }
    const m = /^inspirations\.(\d+)\.(title|content)$/.exec(a), b = /^units\.(\d+)\.(title|plan)$/.exec(a), g = /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
      a
    ), S = a.startsWith("outline.") ? a.slice(8) : a === "content" ? t.section_id : void 0;
    if (S && De(S))
      r.outline === e.outline && (r.outline = { ...e.outline }), r.outline[S] = s;
    else if (m) {
      const d = t.inspiration_id ? r.inspirations.findIndex(
        (v) => v.id === t.inspiration_id
      ) : Number(m[1]);
      if (d < 0) continue;
      r.inspirations === e.inspirations && (r.inspirations = [...e.inspirations]), r.inspirations[d] && r.inspirations[d] === e.inspirations[d] && (r.inspirations[d] = { ...r.inspirations[d] }), r.inspirations[d] ||= { id: "", title: "", content: "" }, r.inspirations[d][m[2]] = s;
    } else if (b) {
      const d = Number(b[1]), v = n === "generate_chapters" && i?.length ? r.units.findIndex(
        (A) => A.id === i[d]
      ) : d + (n === "append" ? e.units.length : 0);
      if (v < 0 || i?.length && n === "generate_chapters" && !i[d])
        continue;
      c(v)[b[2]] = s;
    } else if (g) {
      const d = g[1] || t.section_id;
      if (d !== "characters" && d !== "locations" && d !== "props")
        continue;
      const v = t.entity_id ? r.outline[d].findIndex(
        (A) => A.id === t.entity_id
      ) : Number(g[2]);
      if (v < 0) continue;
      o(d, v, `preview:${d}:${v}`)[g[3]] = s;
    } else if (t.section_id === "chapter_plan" && t.unit_id && a === "plan") {
      const d = r.units.findIndex(
        (v) => v.id === t.unit_id
      );
      d >= 0 && (c(d).plan = s);
    }
  }
  return r;
}
const sn = {
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
function on(e) {
  return sn[e] || "创作任务";
}
const ee = [
  { id: "preferences", label: "生成写作设定" },
  { id: "direction", label: "生成故事总纲" },
  { id: "characters", label: "生成人物" },
  { id: "background", label: "生成背景" },
  { id: "chapters", label: "规划章节剧情" }
];
function Ln(e) {
  if (e?.checkpoint?.action !== "generate_outline") return "";
  const t = ee.findIndex(
    ({ id: n }) => n === e.checkpoint?.phase
  );
  return t >= 0 ? `第${t + 1}/${ee.length}步` : "";
}
function Gn(e) {
  const t = e?.checkpoint;
  if (!e) return "正在准备创作";
  if (!t) return "创作任务";
  const { document: n } = e;
  if (t.phase) {
    const c = ee.find(({ id: a }) => a === t.phase), l = t.phase === "continuity" ? t.continuity_unit_id || t.unit_id : t.unit_id || t.unit_ids?.[t.completed], u = l ? n.units.findIndex((a) => a.id === l) : -1, s = t.phase === "continuity" && t.history_total ? `正在整理前文 ${t.history_completed || 0}/${t.history_total}` : c ? `${n.status === "running" ? "正在" : ""}${c.label}` : t.phase === "body" ? "正在写正文" : "正文已保存，整理剧情衔接";
    if (t.phase === "chapters") {
      const a = Math.min(
        qe,
        t.count || n.preferences.planned_chapters || (n.preferences.mode === "serial" ? 10 : 5)
      );
      return `${s} · 第 1—${a} 章`;
    }
    return `${s}${u >= 0 ? ` · 第 ${u + 1} 章` : ""}`;
  }
  const i = on(t.action);
  if (t.action === "append") {
    const c = Me(
      n.units,
      n.preferences.planned_chapters,
      t.count
    );
    return `${i} · 第 ${c.start}—${c.end} 章`;
  }
  if (t.action === "generate_chapters" && t.unit_ids.length) {
    const c = Oe(n.units), l = t.unit_ids.flatMap((u) => {
      const s = c.byId.get(u);
      return s ? [s] : [];
    });
    return `${i} · ${Be(l)}`;
  }
  const r = t.unit_ids?.[t.completed] || t.unit_id, o = n.units.find((c) => c.id === r);
  if (o)
    return `${i} · ${Pe(n, { kind: "unit", id: o.id })}${t.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (t.action === "generate_section" || t.action === "propose_edit") {
    const c = [...je, ...Fe].find(
      (u) => u.id === t.section_id
    ), l = Ve.flatMap(({ id: u }) => n.outline[u]).find((u) => u.id === t.entity_id);
    return `${i}${c ? ` · ${c.label}` : ""}${l ? ` · ${l.name}` : ""}`;
  }
  return i;
}
export {
  En as A,
  jt as B,
  Bn as C,
  In as D,
  Rn as E,
  An as F,
  Cn as G,
  jn as S,
  Mn as a,
  On as b,
  Fn as c,
  It as d,
  qn as e,
  xn as f,
  Gn as g,
  Jt as h,
  Sn as i,
  on as j,
  Dn as k,
  W as l,
  j as m,
  Tn as n,
  $n as o,
  Un as p,
  Nn as q,
  yn as r,
  bn as s,
  St as t,
  Wn as u,
  Vn as v,
  Ln as w,
  zn as x,
  Yt as y,
  Pn as z
};
