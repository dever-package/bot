import { p as bt } from "./space-content-view-YfCrbd08.js";
import { J as At, p as g, r as B, h as W, I as kt, e as y, a0 as q, a1 as U, g as T, a2 as Dt, s as C, f as F, H as St, G as w, B as H, m as xt } from "./asset-audio-preview-CsYcyVm8.js";
import { p as Rt, ag as J } from "./asset-preview-DonyTaaN.js";
import { s as G } from "./asset-upload-progress-BKzeQB8G.js";
import { b4 as Nt, b5 as Mt } from "./writing-reference-CGBoN4Mc.js";
import { z as K, x as Q, f as X, e as It, p as Ot, s as jt, o as Pt, q as Tt, n as _t } from "./runtime-DQ2rFFvP.js";
import { j as d, a as D, b as c, c as l } from "./preloadable-CnUP9jgB.js";
import { b as N, u as Et, l as Y, p as zt, o as Ut, a as Z, E as $t, d as Vt } from "./file-kind-Cq3pESGF.js";
import { w as Lt } from "./interaction-SMvIaTBF.js";
import { y as Bt, r as tt, af as Wt, aQ as qt, W as Ft, k as Ht, a8 as Jt, a9 as Gt, M as Kt, b as Qt } from "./vendor-icons-B8sieP24.js";
import { i as Xt } from "./space-node-runtime-694G12tD.js";
import { a3 as Yt } from "./space-story-setting-reference-CenSO-Ot.js";
import "./media-inspector-gallery-BOUXOYjy.js";
import { r as Zt } from "./space-assistant-layout-B9KyeCM0.js";
import { P as te } from "./power-icon-BQMmKgyk.js";
function Ke(t, e, r) {
  const n = re(t, e), i = r || t.kind, s = B(n);
  if (s)
    return {
      mode: "storyboard_grid",
      value: s,
      format: "json",
      summary: rt(s),
      downloadUrl: ""
    };
  const o = Rt(n);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: J(o),
      downloadUrl: ""
    };
  const a = bt(n);
  if (a) return { mode: "setting", value: a, format: "json", summary: a.title, downloadUrl: "" };
  const u = ot(n);
  if (u) {
    if (i === "text") {
      const Ct = U(u);
      return A(Ct?.markdown || T(u));
    }
    const R = ce(n) ? null : U(u);
    return R && Dt(R.plainText) ? A(R.markdown) : $(u);
  }
  const f = I(n);
  if (f)
    return {
      mode: "file",
      value: f,
      format: "json",
      summary: f.description || f.name || "文件内容",
      downloadUrl: f.url
    };
  const p = ae(n);
  if (p)
    return A(p);
  const m = ne(n);
  if (m)
    return $(m);
  const v = O(n) || t.description || "";
  return A(v);
}
function Qe(t, e, r = {}) {
  const n = r.includeNodeResult === !1 ? e?.content : At(
    e?.content,
    t.asset?.version?.content,
    t.resultOutput,
    it(t, "result", "output")
  ), i = g(n);
  if (B(i))
    return;
  const s = W(i);
  for (const a of [i, g(s)])
    if (kt(a))
      return ee(a);
  const o = se(t.kind, i);
  if (o)
    return o;
}
function ee(t) {
  const r = q(t).map((n) => {
    if (!y(n) || n.json === void 0)
      return n;
    const i = { ...n };
    return delete i.json, i;
  });
  return r.length === 1 ? r[0] : r;
}
function re(t, e) {
  return St(
    e?.content,
    t.asset?.version?.content,
    t.resultOutput,
    it(t, "result", "output"),
    t.description
  );
}
function et(t) {
  if (t.mode === "storyboard" || t.mode === "storyboard_grid" || t.mode === "setting")
    return t.value;
  if (t.mode === "file")
    return ie(t.value);
  const e = String(t.value || "");
  return t.format === "markdown" ? { format: "markdown", text: e } : C(g(e)) || ue(e);
}
function Xe(t) {
  return F(et(t));
}
function Ye(t, e) {
  const r = { ...t, value: e };
  if (r.mode === "storyboard")
    r.summary = J(e);
  else if (r.mode === "setting")
    r.summary = e.title;
  else if (r.mode === "storyboard_grid")
    r.summary = rt(e);
  else if (r.mode === "file") {
    const n = e;
    r.summary = n.description || n.name || "文件内容", r.downloadUrl = n.url;
  } else
    r.summary = _(T(et(r)));
  return r;
}
function rt(t) {
  return w(
    t.summary,
    `${t.title || "宫格图片"} · ${t.frames.length} 张`
  );
}
function $(t) {
  const e = T(t);
  return {
    mode: "rich",
    value: F(t),
    format: "json",
    summary: _(e),
    downloadUrl: nt(t)
  };
}
function A(t) {
  return {
    mode: "rich",
    value: t,
    format: "markdown",
    summary: _(t),
    downloadUrl: ""
  };
}
function ne(t) {
  if (typeof t == "string" && g(t) === t)
    return null;
  const e = q(t), r = [];
  return M(
    e,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : C({ type: "doc", content: r });
}
function M(t, e, r, n, i, s) {
  if (t == null || s > 12)
    return;
  const o = g(t);
  if (typeof o == "string") {
    V(e, o, n);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (u) => M(
        u,
        e,
        r,
        n,
        i,
        s + 1
      )
    );
    return;
  }
  if (!y(o) || r.has(o))
    return;
  r.add(o);
  const a = ot(o);
  if (a) {
    for (const u of a.content || [])
      e.push(u);
    return;
  }
  V(
    e,
    w(o.title, o.text),
    n
  ), oe(o, e, i);
  for (const u of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[u] !== void 0 && M(
      o[u],
      e,
      r,
      n,
      i,
      s + 1
    );
}
function oe(t, e, r) {
  const n = [
    { kind: "image", values: [t.image, t.image_url, t.imageUrl, t.images] },
    { kind: "video", values: [t.video, t.video_url, t.videoUrl, t.videos] },
    { kind: "audio", values: [t.audio, t.audio_url, t.audioUrl, t.audios] }
  ];
  for (const i of n)
    for (const s of i.values)
      for (const o of b(s)) {
        const a = `${i.kind}:${o}`;
        r.has(a) || (r.add(a), e.push({
          type: de(i.kind),
          attrs: { src: o }
        }));
      }
}
function V(t, e, r) {
  const n = String(e || "").trim();
  !n || at(n) || E(n) || r.has(n) || (r.add(n), t.push({
    type: "paragraph",
    content: [{ type: "text", text: n }]
  }));
}
function b(t) {
  return Array.isArray(t) ? t.flatMap(b) : typeof t == "string" ? at(t.trim()) ? [t.trim()] : [] : y(t) ? [
    t.url,
    t.src,
    t.path,
    t.download_url,
    t.downloadUrl
  ].flatMap(b) : [];
}
function I(t) {
  const e = g(t);
  if (Array.isArray(e)) {
    for (const n of e) {
      const i = I(n);
      if (i)
        return i;
    }
    return null;
  }
  if (!y(e))
    return null;
  const r = le(
    e.file,
    e.file_url,
    e.fileUrl,
    e.files
  );
  if (r)
    return {
      url: r,
      name: w(e.name, e.filename, e.title) || st(r),
      description: w(
        e.description,
        e.text,
        e.summary
      )
    };
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (e[n] !== void 0) {
      const i = I(e[n]);
      if (i)
        return i;
    }
  return null;
}
function ie(t) {
  return {
    type: "file",
    file_url: t.url,
    name: t.name || st(t.url),
    description: t.description.trim()
  };
}
function se(t, e) {
  if (t !== "image" && t !== "video" && t !== "audio")
    return;
  const r = b(e);
  if (r.length !== 0)
    return {
      [`${t}s`]: r
    };
}
function O(t) {
  const e = g(t);
  if (typeof e == "string")
    return E(e) ? "" : e;
  if (Array.isArray(e))
    return e.map(O).filter(Boolean).join(`

`);
  if (!y(e))
    return "";
  const r = w(
    e.text,
    e.summary,
    e.description
  );
  if (r)
    return r;
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (e[n] !== void 0) {
      const i = O(e[n]);
      if (i)
        return i;
    }
  return "";
}
function ae(t) {
  const e = g(t);
  return typeof e == "string" ? E(e) ? "" : e : y(e) && String(e.format || "").trim().toLowerCase() === "markdown" ? w(e.text, e.markdown) : "";
}
function ue(t) {
  const e = t.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (e.length ? e : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function nt(t) {
  if (!t || typeof t != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(t.type || "")
  ))
    return String(t.attrs?.src || "").trim();
  for (const e of Array.isArray(t.content) ? t.content : []) {
    const r = nt(e);
    if (r)
      return r;
  }
  return "";
}
function ot(t) {
  const e = g(t);
  if (!y(e))
    return null;
  if (String(e.type || "") === "doc")
    return C(e);
  const r = Object.keys(e).filter((n) => n !== "format");
  return r.length === 1 && r[0] === "rich" ? C(e.rich) : String(e.format || "").trim().toLowerCase() === "rich_json" ? C(e.rich ?? e.content) : null;
}
function ce(t) {
  const e = g(t);
  return y(e) && String(e.format || "").trim().toLowerCase() === "rich_json";
}
function de(t) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[t];
}
function le(...t) {
  for (const e of t) {
    const r = b(e)[0];
    if (r)
      return r;
  }
  return "";
}
function it(t, ...e) {
  let r = t;
  for (const n of e) {
    if (!y(r))
      return;
    r = r[n];
  }
  return r;
}
function st(t) {
  const r = (t.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function _(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  return e.length > 120 ? `${e.slice(0, 120)}…` : e || "暂无内容";
}
function at(t) {
  return /^(https?:\/\/|\/|data:)/i.test(t);
}
function E(t) {
  const e = t.trim();
  return e.startsWith("{") && e.endsWith("}") || e.startsWith("[") && e.endsWith("]");
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const S = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!S || Object.keys(S).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ut = S.joinSiteApi, ct = S.request;
async function Ze(t) {
  const e = G(
    await ct(ut("project/writing_command"), "post", t, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), r = Nt(e);
  if (!r) throw new Error("创作响应缺少已保存版本");
  return r;
}
async function tr(t) {
  const e = G(
    await ct(
      ut("project/writing_runs"),
      "get",
      {
        project_id: t.projectId,
        canvas_id: t.canvasId,
        work_asset_id: t.workAssetId,
        before_id: t.beforeId || 0
      },
      { reportError: !1 }
    ),
    "读取创作运行记录失败"
  );
  return {
    items: (Array.isArray(e.items) ? e.items : []).map(
      (r) => ({
        ...r,
        checkpoint: Mt(r.checkpoint)
      })
    ),
    hasMore: !!e.has_more,
    beforeId: Number(e.before_id || 0)
  };
}
function er(t, e) {
  const r = t || me(), n = Ot({
    type: "stream",
    output: e
  }), i = n.event, s = n.activity, o = pe(r.text, n.delta, e, i), a = ge(i, s) ? {
    ...r.output,
    ...n.output,
    ...o ? { text: o } : {}
  } : r.output, u = s && !s.anchorText ? { ...s, anchorText: o } : s, f = u ? jt(r.activities, u) : r.activities, p = Pt(
    Tt(r.document, n.output),
    X(n.output.document)
  ), m = Q(a) || r.interaction, v = K(a);
  return {
    started: !0,
    text: o,
    output: a,
    activities: f,
    document: p,
    interaction: m,
    suggestions: v.length > 0 ? v : r.suggestions,
    error: n.error || r.error
  };
}
function rr(t) {
  const e = fe(t);
  return {
    started: Object.keys(e).length > 0,
    text: x(e.text),
    output: e,
    activities: It(e),
    document: X(e.document),
    interaction: Q(e),
    suggestions: K(e),
    error: x(e.error)
  };
}
function fe(t) {
  const e = _t(t);
  if (x(e.text))
    return e;
  const r = W(t);
  if (!r)
    return e;
  const n = { ...e, text: r };
  return delete n.rich, n;
}
function nr(t) {
  return !!(t && (t.started || t.text || t.activities.length > 0 || t.document || t.interaction || t.suggestions.length > 0 || Object.keys(t.output).length > 0));
}
function me() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function pe(t, e, r, n) {
  return e ? `${t}${e}` : n === "final" && x(r.text) || t;
}
function ge(t, e) {
  return !(e || t === "start" || t === "delta");
}
function x(t) {
  return t == null ? "" : String(t);
}
const dt = zt(
  null
);
function or({
  root: t,
  children: e,
  rootMargin: r = "0px"
}) {
  const n = N(/* @__PURE__ */ new Map()), i = N(null), s = Et(
    () => ({
      observe(o, a) {
        return n.current.set(o, a), i.current?.observe(o), () => {
          i.current?.unobserve(o), n.current.delete(o);
        };
      }
    }),
    []
  );
  return Y(() => {
    const o = new IntersectionObserver(
      (a) => {
        for (const u of a)
          n.current.get(u.target)?.(
            u.isIntersecting && u.intersectionRatio > 0
          );
      },
      { root: t.current, rootMargin: r }
    );
    i.current = o;
    for (const a of n.current.keys())
      o.observe(a);
    return () => {
      o.disconnect(), i.current = null;
    };
  }, [t, r]), /* @__PURE__ */ d(dt.Provider, { value: s, children: e });
}
function ir(t = !0) {
  const e = Ut(dt), r = N(null), [n, i] = Z(!1);
  return Y(() => {
    if (!(!r.current || !e))
      return e.observe(r.current, (s) => {
        (s || !t) && i(s);
      });
  }, [e, t]), { ref: r, visible: n };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ye = j.joinSiteApi;
async function sr(t) {
  const e = String(t.requestId || "").trim();
  if (!e)
    throw new Error("request_id 不能为空");
  return Lt({
    streamApi: ve(t.projectId),
    requestID: e,
    lastID: t.lastId || "0-0",
    blockMs: 15e3,
    signal: t.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: t.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (r, n) => (t.onFrame(n), r)
  });
}
function ve(t) {
  const e = new URL(ye("run/stream"), window.location.origin);
  return e.searchParams.set("project_id", String(t || 0)), e.toString();
}
const k = /* @__PURE__ */ new Set();
let P = Date.now(), h;
function we(t) {
  return k.add(t), h == null && typeof window < "u" && (P = Date.now(), h = window.setInterval(() => {
    P = Date.now(), k.forEach((e) => e());
  }, 1e3)), () => {
    k.delete(t), k.size === 0 && h != null && (window.clearInterval(h), h = void 0);
  };
}
function he() {
  return () => {
  };
}
function L() {
  return P;
}
function Ce(t) {
  return $t(
    t ? we : he,
    L,
    L
  );
}
function ar({
  runTiming: t,
  runningNode: e,
  showEstimate: r = !0,
  active: n,
  observed: i = !1
}) {
  const s = n ?? Xt(e), o = n !== void 0 ? t : s ? { startedAt: e?.startedAt || 0, finishedAt: void 0 } : be(e) || t, a = Ce(!!(s && o?.startedAt));
  if (!o?.startedAt || !s && (!o.finishedAt || o.finishedAt < o.startedAt))
    return null;
  const u = Math.max(
    0,
    (s ? a : o.finishedAt || o.startedAt) - o.startedAt
  ), f = Yt(
    u,
    s,
    e?.estimatedDurationMs
  ), p = `${i ? "本次查看" : ""}${f.elapsed}`, m = i ? p : r ? f.tooltip : p;
  return /* @__PURE__ */ d(H, { label: m, side: "top", sideOffset: 6, children: /* @__PURE__ */ D(
    "span",
    {
      className: `ws-node-run-timing${s ? " is-active" : ""}`,
      "aria-label": m,
      children: [
        /* @__PURE__ */ d(Bt, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: p })
      ]
    }
  ) });
}
function be(t) {
  if (!(!t?.startedAt || !t.finishedAt))
    return {
      startedAt: t.startedAt,
      finishedAt: t.finishedAt
    };
}
function ur({
  label: t,
  overlay: e = !1,
  compact: r = !1,
  delay: n = 160
}) {
  const [i, s] = Z(n <= 0);
  return Vt(() => {
    if (n <= 0) {
      s(!0);
      return;
    }
    const o = window.setTimeout(() => s(!0), n);
    return () => window.clearTimeout(o);
  }, [n]), i ? /* @__PURE__ */ D(
    "div",
    {
      className: `ws-module-loading ${e ? "is-overlay" : ""} ${r ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ d(tt, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ d("span", { children: t })
      ]
    }
  ) : null;
}
const lt = l(() => import("./space-agent-tools-O2QfQ88T.js")), z = l(() => import("./space-asset-tools-CzhvB7aq.js")), Ae = c(
  lt,
  (t) => t.AgentInteractionPanel
), cr = Ae.Component, ft = c(
  l(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-DBl2ONix.js")),
  (t) => t.AddNodeMenu
), dr = ft.Component, lr = ft.preload, mt = c(
  z,
  (t) => t.AssetBrowser
), fr = mt.Component, mr = mt.preload, pt = c(
  z,
  (t) => t.AssetDetailDialog
), pr = pt.Component, gr = pt.preload, gt = c(
  z,
  (t) => t.AssetPickerDialog
), yr = gt.Component, vr = gt.preload, yt = c(
  l(() => import("./space-run-history-DOgx2dy3.js")),
  (t) => t.CanvasRunHistoryDrawer
), wr = yt.Component, hr = yt.preload, ke = c(
  l(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-Ba8VdJk_.js")),
  (t) => t.SpaceCanvasManagerDialog
), Cr = ke.Component, De = c(
  l(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-Bc0mcTK_.js")),
  (t) => t.CanvasParamBindingDialog
), br = De.Component, vt = c(
  l(() => import("./space-assistant-Bm5r_7aO.js")),
  (t) => t.SpaceAssistant
), Ar = vt.Component, kr = vt.preload, Se = c(
  lt,
  (t) => t.CanvasAgentResultContent
), Dr = Se.Component, wt = c(
  l(() => import("./node-detail-dialog-Ds1sAp-c.js")),
  (t) => t.NodeDetailDialog
), Sr = wt.Component, xr = wt.preload, ht = c(
  l(() => import("./space-node-settings-TKQU7J4U.js")),
  (t) => t.CanvasNodeSettings
), Rr = ht.Component, Nr = ht.preload, xe = c(
  l(() => import("./space-storyboard-node-BG_-YGWW.js")),
  (t) => t.StoryboardNodeContent
), Mr = xe.Component, Re = c(
  l(() => import("./space-storyboard-node-BG_-YGWW.js")),
  (t) => t.StorySettingNodeContent
), Ir = Re.Component, Ne = c(
  l(() => import("./space-storyboard-confirm-dialog-Cbpe5BNM.js")),
  (t) => t.StoryboardConfirmDialog
), Or = Ne.Component, Me = c(
  l(() => import("./space-video-compose-view-D3zFP-ba.js")),
  (t) => t.VideoComposeView
), jr = Me.Component, Ie = c(
  l(() => import("./writing-preview-DEcrs19H.js")),
  (t) => t.WritingPreview
), Pr = Ie.Component;
function Tr({
  node: t,
  contentLabel: e,
  titleStatus: r,
  versionSelect: n,
  updatedAt: i,
  status: s,
  readonly: o,
  actions: a,
  downloadUrl: u,
  onRetry: f,
  onClose: p
}) {
  const m = t.type === "power" ? Zt(t.power, t.kind, t.outputType) : null, v = m && m.outputName !== e ? `${m.outputName} · ${e}` : m?.outputName || e;
  return /* @__PURE__ */ d(
    xt,
    {
      icon: /* @__PURE__ */ d(je, { node: t }),
      title: t.title || "节点详情",
      subtitle: v,
      titleStatus: r,
      versionSelect: n,
      state: o ? /* @__PURE__ */ d("span", { className: "wb-detail-state", children: "只读预览" }) : s === "error" ? /* @__PURE__ */ d(H, { label: "重试保存", children: /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: f,
          children: [
            /* @__PURE__ */ d(Wt, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ D("span", { className: `wb-detail-state is-${s}`, children: [
        s === "saving" ? /* @__PURE__ */ d(tt, { size: 12, className: "wb-detail-spin" }) : null,
        Oe(s)
      ] }),
      updatedAt: i,
      actions: a,
      downloadUrl: u,
      onClose: p
    }
  );
}
function Oe(t) {
  return t === "dirty" ? "未保存" : t === "saving" ? "保存中" : "已保存";
}
function je({ node: t }) {
  if (t.type === "power")
    return /* @__PURE__ */ d(
      te,
      {
        power: t.power,
        kind: t.kind,
        outputType: t.outputType,
        size: 16
      }
    );
  const e = Pe(t);
  return /* @__PURE__ */ d(e, { size: 16 });
}
function Pe(t) {
  return t.type === "agent" ? qt : t.type === "flow" ? Ft : t.type === "function" ? Ht : t.kind === "image" ? Jt : t.kind === "video" ? Gt : t.kind === "audio" ? Kt : Qt;
}
export {
  yr as A,
  pr as B,
  ur as C,
  gr as D,
  xr as E,
  sr as F,
  cr as G,
  lr as H,
  er as I,
  Ir as J,
  Mr as K,
  nr as L,
  Dr as M,
  Tr as N,
  Cr as S,
  jr as V,
  Pr as W,
  ar as a,
  Rr as b,
  or as c,
  Ke as d,
  Qe as e,
  et as f,
  Xe as g,
  Ce as h,
  tr as i,
  vr as j,
  me as k,
  hr as l,
  Ar as m,
  Ye as n,
  kr as o,
  Nr as p,
  wr as q,
  rr as r,
  Ze as s,
  mr as t,
  ir as u,
  fr as v,
  Or as w,
  dr as x,
  br as y,
  Sr as z
};
