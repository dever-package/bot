import { p as Ue } from "./space-content-view-BQ0Psq2a.js";
import { J as Ve, p as g, t as ne, h as Le, I as Fe, e as y, a4 as oe, a1 as H, g as L, a2 as qe, s as A, f as se, H as ie, G as k, a0 as ze, Q as We, F as h, B as ae, m as He } from "./asset-audio-preview-Du5K0btg.js";
import { p as Ke, ak as ue } from "./asset-preview-DpK5-z_L.js";
import { aa as ce, a8 as de, a7 as le, b0 as Je, b1 as Ge, b2 as pe, F as Qe, G as K, b3 as Xe, b4 as Ye, b5 as Ze } from "./writing-reference-DlogpT9K.js";
import { s as me } from "./asset-upload-progress-BKzeQB8G.js";
import { u as et, a1 as tt, a2 as rt, b as nt, e as ot, D as st, a3 as it } from "./space-story-setting-reference-B-1GhfJK.js";
import { w as at } from "./interaction-D704R7sS.js";
import { a as E, d as fe, E as ut } from "./file-kind-Cq3pESGF.js";
import { u as ct, i as dt } from "./space-node-runtime-mQKAQcW3.js";
import { a as lt, r as pt } from "./space-assistant-layout-B9KyeCM0.js";
import { j as v, a as x, b as m, c as f } from "./preloadable-R-5sHdlM.js";
import { y as mt, r as ve, af as ft, aQ as vt, W as gt, k as yt, a8 as wt, a9 as Ct, M as bt, b as kt } from "./vendor-icons-IZIW7U43.js";
import "./media-inspector-gallery-a93u-E1M.js";
import { P as ht } from "./power-icon-DnoEnQhv.js";
function Tr(e, t, r) {
  const n = At(e, t), o = r || e.kind, i = ne(n);
  if (i)
    return {
      mode: "storyboard_grid",
      value: i,
      format: "json",
      summary: ye(i),
      downloadUrl: ""
    };
  const a = Ke(n);
  if (a)
    return {
      mode: "storyboard",
      value: a,
      format: "json",
      summary: ue(a),
      downloadUrl: ""
    };
  const c = Ue(n);
  if (c) return { mode: "setting", value: c, format: "json", summary: c.title, downloadUrl: "" };
  const d = Ce(n);
  if (d) {
    if (o === "text") {
      const w = H(d);
      return N(w?.markdown || L(d));
    }
    const C = Tt(n) ? null : H(d);
    return C && qe(C.plainText) ? N(C.markdown) : J(d);
  }
  const s = B(n);
  if (s)
    return {
      mode: "file",
      value: s,
      format: "json",
      summary: s.description || s.name || "文件内容",
      downloadUrl: s.url
    };
  const u = Mt(n);
  if (u)
    return N(u);
  const l = Dt(n);
  if (l)
    return J(l);
  const p = j(n) || e.description || "";
  return N(p);
}
function _r(e, t, r = {}) {
  const n = r.includeNodeResult === !1 ? t?.content : Ve(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    be(e, "result", "output")
  ), o = g(n);
  if (ne(o))
    return;
  const i = Le(o);
  for (const c of [o, g(i)])
    if (Fe(c))
      return St(c);
  const a = It(e.kind, o);
  if (a)
    return a;
}
function St(e) {
  const r = oe(e).map((n) => {
    if (!y(n) || n.json === void 0)
      return n;
    const o = { ...n };
    return delete o.json, o;
  });
  return r.length === 1 ? r[0] : r;
}
function At(e, t) {
  return ie(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    be(e, "result", "output"),
    e.description
  );
}
function ge(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid" || e.mode === "setting")
    return e.value;
  if (e.mode === "file")
    return Nt(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : A(g(t)) || xt(t);
}
function Er(e) {
  return se(ge(e));
}
function $r(e, t) {
  const r = { ...e, value: t };
  if (r.mode === "storyboard")
    r.summary = ue(t);
  else if (r.mode === "setting")
    r.summary = t.title;
  else if (r.mode === "storyboard_grid")
    r.summary = ye(t);
  else if (r.mode === "file") {
    const n = t;
    r.summary = n.description || n.name || "文件内容", r.downloadUrl = n.url;
  } else
    r.summary = F(L(ge(r)));
  return r;
}
function ye(e) {
  return k(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function J(e) {
  const t = L(e);
  return {
    mode: "rich",
    value: se(e),
    format: "json",
    summary: F(t),
    downloadUrl: we(e)
  };
}
function N(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: F(e),
    downloadUrl: ""
  };
}
function Dt(e) {
  if (typeof e == "string" && g(e) === e)
    return null;
  const t = oe(e), r = [];
  return $(
    t,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : A({ type: "doc", content: r });
}
function $(e, t, r, n, o, i) {
  if (e == null || i > 12)
    return;
  const a = g(e);
  if (typeof a == "string") {
    G(t, a, n);
    return;
  }
  if (Array.isArray(a)) {
    a.forEach(
      (d) => $(
        d,
        t,
        r,
        n,
        o,
        i + 1
      )
    );
    return;
  }
  if (!y(a) || r.has(a))
    return;
  r.add(a);
  const c = Ce(a);
  if (c) {
    for (const d of c.content || [])
      t.push(d);
    return;
  }
  G(
    t,
    k(a.title, a.text),
    n
  ), Rt(a, t, o);
  for (const d of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    a[d] !== void 0 && $(
      a[d],
      t,
      r,
      n,
      o,
      i + 1
    );
}
function Rt(e, t, r) {
  const n = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const o of n)
    for (const i of o.values)
      for (const a of R(i)) {
        const c = `${o.kind}:${a}`;
        r.has(c) || (r.add(c), t.push({
          type: _t(o.kind),
          attrs: { src: a }
        }));
      }
}
function G(e, t, r) {
  const n = String(t || "").trim();
  !n || he(n) || q(n) || r.has(n) || (r.add(n), e.push({
    type: "paragraph",
    content: [{ type: "text", text: n }]
  }));
}
function R(e) {
  return Array.isArray(e) ? e.flatMap(R) : typeof e == "string" ? he(e.trim()) ? [e.trim()] : [] : y(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(R) : [];
}
function B(e) {
  const t = g(e);
  if (Array.isArray(t)) {
    for (const n of t) {
      const o = B(n);
      if (o)
        return o;
    }
    return null;
  }
  if (!y(t))
    return null;
  const r = Et(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (r)
    return {
      url: r,
      name: k(t.name, t.filename, t.title) || ke(r),
      description: k(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const o = B(t[n]);
      if (o)
        return o;
    }
  return null;
}
function Nt(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || ke(e.url),
    description: e.description.trim()
  };
}
function It(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const r = R(t);
  if (r.length !== 0)
    return {
      [`${e}s`]: r
    };
}
function j(e) {
  const t = g(e);
  if (typeof t == "string")
    return q(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(j).filter(Boolean).join(`

`);
  if (!y(t))
    return "";
  const r = k(
    t.text,
    t.summary,
    t.description
  );
  if (r)
    return r;
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const o = j(t[n]);
      if (o)
        return o;
    }
  return "";
}
function Mt(e) {
  const t = g(e);
  return typeof t == "string" ? q(t) ? "" : t : y(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? k(t.text, t.markdown) : "";
}
function xt(e) {
  const t = e.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function we(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const r = we(t);
    if (r)
      return r;
  }
  return "";
}
function Ce(e) {
  const t = g(e);
  if (!y(t))
    return null;
  if (String(t.type || "") === "doc")
    return A(t);
  const r = Object.keys(t).filter((n) => n !== "format");
  return r.length === 1 && r[0] === "rich" ? A(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? A(t.rich ?? t.content) : null;
}
function Tt(e) {
  const t = g(e);
  return y(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function _t(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Et(...e) {
  for (const t of e) {
    const r = R(t)[0];
    if (r)
      return r;
  }
  return "";
}
function be(e, ...t) {
  let r = e;
  for (const n of t) {
    if (!y(r))
      return;
    r = r[n];
  }
  return r;
}
function ke(e) {
  const r = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function F(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function he(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function q(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function M(e, t) {
  const r = String(e || "");
  return r.trim() && r.trim() === String(t || "").trim() ? "" : r;
}
function Br(e, t) {
  return !!M(e, t).trim();
}
function $t(e, t, r) {
  if (!t?.trim())
    return e;
  const n = M(e.prompt, t), o = e.promptContent, i = ce(o), a = o?.parts.filter((p) => p.type === "text").map((p) => p.text).join(""), c = [i, a].some(
    (p) => !!p?.trim() && !M(p, t)
  ), d = c ? de(
    n,
    le(o)
  ) : o, s = c && !d?.parts.length ? void 0 : d;
  let u = e.paramValues;
  const l = r ? u?.[r] : void 0;
  if (r && typeof l == "string") {
    const p = M(l, t);
    p !== l && (u = { ...u, [r]: p });
  }
  return n === e.prompt && s === o && u === e.paramValues ? e : { ...e, prompt: n, promptContent: s, paramValues: u };
}
function jr(e, t, r) {
  const n = $t(
    e,
    t,
    r
  ), o = String(t || "");
  if (!o.trim())
    return n;
  const i = ce(
    n.promptContent
  ), a = n.promptContent?.parts.filter((u) => u.type === "text").map((u) => u.text).join(""), c = n.prompt?.trim() ? n.prompt : a?.trim() ? i : o;
  let d = n.paramValues;
  r && d?.[r] !== c && (d = { ...d || {}, [r]: c });
  const s = n.promptContent ? de(
    c,
    le(n.promptContent)
  ) : n.promptContent;
  return c === n.prompt && s === n.promptContent && d === n.paramValues ? n : { ...n, prompt: c, promptContent: s, paramValues: d };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const T = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!T || Object.keys(T).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Se = T.joinSiteApi, Ae = T.request;
async function Pr(e) {
  const t = me(
    await Ae(Se("project/writing_command"), "post", e, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), r = Je(t);
  if (!r) throw new Error("创作响应缺少已保存版本");
  return r;
}
async function Or(e) {
  const t = me(
    await Ae(
      Se("project/writing_runs"),
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
      (r) => ({
        ...r,
        checkpoint: Ge(r.checkpoint)
      })
    ),
    hasMore: !!t.has_more,
    beforeId: Number(t.before_id || 0)
  };
}
function Ur(e) {
  const t = ie(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const n = e.previousAssets?.find(
    (a) => a.id === Number(t.id || 0)
  ), o = n ? D(n, e.previousAsset) : e.previousAsset || null, i = D(
    t,
    o
  );
  return o && pe(o, i) ? o : o?.version?.content != null && Number(o.version.id || 0) === Number(i.version?.id || 0) && (!Qe(i.version?.content) || K(o.version) >= K(i.version)) ? D(o, i) : i.version?.id ? i : null;
}
function Vr(e, t) {
  const r = Bt(e);
  return t ? {
    ...r,
    asset: t
  } : r;
}
function Lr(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function D(e, t) {
  const r = Q(e), n = t ? Q(t) : null, o = [
    ...r.versions || [],
    ...n?.versions || []
  ], i = jt(
    [Ot(r.version)].filter(
      (a) => !!a
    ),
    o
  );
  return {
    ...n,
    ...r,
    version: r.version || n?.version,
    versions: i.length ? i : void 0
  };
}
function Fr(e, t) {
  if (t.length === 0)
    return e;
  const r = new Map(t.map((o) => [o.id, o])), n = e.map((o) => {
    const i = r.get(o.id);
    return i ? (r.delete(o.id), pe(o, i) ? o : D(i, o)) : o;
  });
  return [
    ...[...r.values()].map(
      (o) => D(o)
    ),
    ...n
  ];
}
function Bt(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...r } = e;
  return r;
}
function Q(e) {
  const t = X(e.version), r = (e.versions || []).map(X).filter((n) => !!n);
  return {
    ...e,
    version: t,
    versions: r.length ? r : e.versions
  };
}
function X(e) {
  if (!e)
    return;
  const t = ze(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function jt(...e) {
  const t = e.flat(), r = [], n = /* @__PURE__ */ new Map();
  for (const i of t) {
    if (!i || Number(i.id || 0) <= 0)
      continue;
    const a = String(i.id), c = n.get(a);
    if (c !== void 0) {
      r[c] = Pt(
        r[c],
        i
      );
      continue;
    }
    n.set(a, r.length), r.push(i);
  }
  let o = !1;
  return r.sort(
    (i, a) => Number(_(a)) - Number(_(i)) || Number(a.version || a.id || 0) - Number(i.version || i.id || 0)
  ).map((i) => _(i) ? o ? Ut(i) : (o = !0, i) : i);
}
function Pt(e, t) {
  const r = { ...e };
  for (const [n, o] of Object.entries(t))
    o !== void 0 && o !== "" && (r[n] = o);
  return r;
}
function _(e) {
  return !!(e.is_current || e.current);
}
function Ot(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Ut(e) {
  const { current: t, is_current: r, ...n } = e;
  return n;
}
const Vt = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], Lt = Object.fromEntries(
  Vt.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Ft(e) {
  return Lt[e] || "文本";
}
function qr(e, t = []) {
  const r = new Map(
    t.map((s) => [s.key, s])
  ), n = new Map(e.nodes.map((s) => [s.id, s])), o = new Map(
    e.nodes.filter((s) => s.type === "group").map((s) => [s.id, s])
  ), i = zt(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), a = e.nodes.filter((s) => Xe(s) || et(s, "import")).map((s) => {
    const u = r.get(`node:${s.id}`), l = i.get(s.id) || s.asset, p = s.groupId ? o.get(s.groupId) : void 0, C = p?.group?.sourceNodeId ? n.get(p.group.sourceNodeId) : void 0, w = u?.node === s && u?.asset === l, b = w ? u.output : e.nodeOutput(s);
    return {
      key: `node:${s.id}`,
      role: "material",
      title: s.title || Ft(Y(s)),
      sourcePath: C?.title && p?.title ? `${C.title} / ${p.title}` : p?.title,
      nodeType: Y(s),
      status: w ? u.status : Wt(s, l, e.nodeHasResult(s)),
      preview: w ? u.preview : e.nodePreview(s),
      output: b,
      node: s,
      nodeId: s.id,
      nodeNo: s.nodeNo,
      groupId: s.groupId,
      groupTitle: p?.title,
      asset: l,
      assetId: l?.id,
      versionId: l?.version?.id || l?.version_id
    };
  }).filter((s) => !!(s.assetId && s.versionId)), d = [...e.assets.filter(
    (s) => Number(s.canvas_id || 0) === e.canvasId && Number(s.asset_cate_id || 0) === e.assetCateId && String(s.role || "material") === "work" && String(s.status || "") !== "archived"
  ).map((s) => {
    const u = r.get(`asset:${s.id}`);
    return {
      key: `asset:${s.id}`,
      role: "work",
      title: s.name || `作品 ${s.id}`,
      nodeType: Re(s.kind),
      status: s.version?.id || s.version_id ? "ready" : "empty",
      preview: u?.asset === s ? u.preview : e.assetPreview(s),
      output: s.version?.content,
      asset: s,
      assetId: s.id,
      versionId: s.version?.id || s.version_id
    };
  }), ...a].filter((s) => !!(s.assetId && s.versionId)).map((s) => {
    const u = r.get(s.key);
    return u && qt(u, s) ? u : s;
  });
  return d.length === t.length && d.every((s, u) => s === t[u]) ? t : d;
}
function De(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function qt(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && De(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function Y(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), r = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || r === "storyboard" ? "storyboard" : Re(e.power?.kind || e.kind);
}
function Re(e) {
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
function zt(e, t, r) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (Number(o.canvas_id || 0) !== t || Number(o.asset_cate_id || 0) !== r || String(o.role || "") !== "material" || String(o.status || "") === "archived")
      continue;
    const i = String(
      o.node_key || o.version?.node_key || ""
    ).trim();
    i && !n.has(i) && n.set(i, o);
  }
  return n;
}
function Wt(e, t, r) {
  const n = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return n === "running" || n === "waiting" || e.running === !0 ? "running" : n === "error" || n === "failed" || n === "failure" ? "failed" : r || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function zr(e, t = []) {
  return {
    current: Kt([
      ...t,
      ...(e?.sources || []).map((r) => ({
        id: r.nodeId,
        title: r.title,
        kind: Ne(
          r.preview,
          String(r.kind || r.type || "")
        ),
        source: "current",
        output: r.output,
        preview: r.preview
      }))
    ])
  };
}
const Z = /* @__PURE__ */ new WeakMap(), ee = /* @__PURE__ */ new WeakMap();
function Wr(e, t = []) {
  const r = new Map(
    t.map((o) => [`${o.source}:${o.id}`, o])
  ), n = e.flatMap((o) => {
    const i = Z.get(o);
    if (i) return i;
    const a = {
      id: o.role === "material" ? o.nodeId || o.key : String(o.assetId || o.key),
      title: o.title,
      kind: Ne(o.preview, o.nodeType),
      role: o.role,
      source: o.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: o.assetId,
      versionID: o.versionId,
      output: o.output,
      preview: o.preview,
      asset: o.asset
    }, c = r.get(`${a.source}:${a.id}`), s = (c && te(c, a) ? ee.get(c) : void 0) || Ye(a).map((u) => {
      const l = r.get(
        `${u.source}:${u.id}`
      );
      return l && te(l, u) ? l : u;
    });
    return Z.set(o, s), ee.set(s[0], s), s;
  });
  return n.length === t.length && n.every((o, i) => o === t[i]) ? t : n;
}
function te(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && De(e.preview, t.preview) && Ht(e.contentSelection, t.contentSelection);
}
function Ht(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((r, n) => r === t.ids[n]));
}
function Kt(e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e) {
    const o = `${n.source}:${n.id}`;
    r.has(o) || (r.add(o), t.push(n));
  }
  return t;
}
function Ne(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(r) ? r : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : r || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const P = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!P || Object.keys(P).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Jt = P.joinSiteApi;
async function Hr(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return at({
    streamApi: Gt(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: e.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (r, n) => (e.onFrame(n), r)
  });
}
function Gt(e) {
  const t = new URL(Jt("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const O = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!O || Object.keys(O).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Qt = O.joinSiteApi, U = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Xt = U.useAuthStore, Yt = lt();
function Kr(e, t) {
  const r = ct(), n = Xt(
    (b) => b.auth?.accessToken || ""
  ), o = JSON.stringify([
    Qt("workspace/canvas_execution"),
    r,
    n
  ]), i = String(t.runError || "").trim(), a = t.id, c = Number(t.resultRef?.execution_id || 0), d = String(t.resultRef?.request_id || "").trim(), s = Number(t.resultRef?.run_id || 0), u = Ie(
    e,
    a,
    c,
    d,
    s
  ), [l, p] = E(i), [C, w] = E(!1);
  return fe(() => {
    if (p(i), !i || !u || !tt(i)) {
      w(!1);
      return;
    }
    let b = !0;
    return w(!0), Zt({
      projectId: e,
      nodeId: a,
      executionId: c,
      requestId: d,
      runId: s,
      requestScopeKey: o,
      fallback: i
    }).then((W) => {
      b && W && p(W);
    }).catch(() => {
    }).finally(() => {
      b && w(!1);
    }), () => {
      b = !1;
    };
  }, [
    c,
    i,
    a,
    e,
    u,
    o,
    d,
    s
  ]), { error: l || i, loading: C };
}
function Zt({
  projectId: e,
  nodeId: t,
  executionId: r,
  requestId: n,
  runId: o,
  requestScopeKey: i,
  fallback: a
}) {
  const c = JSON.stringify([
    i,
    Ie(e, "", r, n, o)
  ]);
  return Yt(
    c,
    () => Ze({
      projectId: e,
      executionId: r,
      requestId: n,
      runId: o
    }).then(st)
  ).then((s) => {
    const u = [...s.node_results || []].reverse().find((p) => p.node_key === t), l = rt(u) || nt(s);
    return ot(l, a);
  });
}
function Ie(e, t, r, n, o) {
  const i = r ? `execution:${r}` : n ? `request:${n}` : o ? `run:${o}` : "";
  return e > 0 && i ? `${e}:${i}:${t}` : "";
}
function Jr(e) {
  const t = er(e.trim()), r = We(t), n = Me(r), o = t.match(/\bstatus=(\d{3})\b/), a = (n || (o && t.includes("body=") ? `请求失败（HTTP ${o[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: a.length > 96 ? `${a.slice(0, 95)}…` : a,
    details: t
  };
}
function Me(e) {
  return y(e) ? Me(e.error) || h(e.message) || h(e.msg) || h(e.detail) || h(e.details) || h(e.error) : "";
}
function er(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const I = /* @__PURE__ */ new Set();
let V = Date.now(), S;
function tr(e) {
  return I.add(e), S == null && typeof window < "u" && (V = Date.now(), S = window.setInterval(() => {
    V = Date.now(), I.forEach((t) => t());
  }, 1e3)), () => {
    I.delete(e), I.size === 0 && S != null && (window.clearInterval(S), S = void 0);
  };
}
function rr() {
  return () => {
  };
}
function re() {
  return V;
}
function nr(e) {
  return ut(
    e ? tr : rr,
    re,
    re
  );
}
function Gr({
  runTiming: e,
  runningNode: t,
  showEstimate: r = !0,
  active: n,
  observed: o = !1
}) {
  const i = n ?? dt(t), a = n !== void 0 ? e : i ? { startedAt: t?.startedAt || 0, finishedAt: void 0 } : or(t) || e, c = nr(!!(i && a?.startedAt));
  if (!a?.startedAt || !i && (!a.finishedAt || a.finishedAt < a.startedAt))
    return null;
  const d = Math.max(
    0,
    (i ? c : a.finishedAt || a.startedAt) - a.startedAt
  ), s = it(
    d,
    i,
    t?.estimatedDurationMs
  ), u = `${o ? "本次查看" : ""}${s.elapsed}`, l = o ? u : r ? s.tooltip : u;
  return /* @__PURE__ */ v(ae, { label: l, side: "top", sideOffset: 6, children: /* @__PURE__ */ x(
    "span",
    {
      className: `ws-node-run-timing${i ? " is-active" : ""}`,
      "aria-label": l,
      children: [
        /* @__PURE__ */ v(mt, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ v("span", { children: u })
      ]
    }
  ) });
}
function or(e) {
  if (!(!e?.startedAt || !e.finishedAt))
    return {
      startedAt: e.startedAt,
      finishedAt: e.finishedAt
    };
}
function Qr({
  label: e,
  overlay: t = !1,
  compact: r = !1,
  delay: n = 160
}) {
  const [o, i] = E(n <= 0);
  return fe(() => {
    if (n <= 0) {
      i(!0);
      return;
    }
    const a = window.setTimeout(() => i(!0), n);
    return () => window.clearTimeout(a);
  }, [n]), o ? /* @__PURE__ */ x(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${r ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ v(ve, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ v("span", { children: e })
      ]
    }
  ) : null;
}
const xe = f(() => import("./space-agent-tools-Cd5SrFjO.js")), z = f(() => import("./space-asset-tools-BvdrvXPr.js")), sr = m(
  xe,
  (e) => e.AgentInteractionPanel
), Xr = sr.Component, Te = m(
  f(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-CLMy_a-r.js")),
  (e) => e.AddNodeMenu
), Yr = Te.Component, Zr = Te.preload, _e = m(
  z,
  (e) => e.AssetBrowser
), en = _e.Component, tn = _e.preload, Ee = m(
  z,
  (e) => e.AssetDetailDialog
), rn = Ee.Component, nn = Ee.preload, $e = m(
  z,
  (e) => e.AssetPickerDialog
), on = $e.Component, sn = $e.preload, Be = m(
  f(() => import("./space-run-history-9tdILA2t.js")),
  (e) => e.CanvasRunHistoryDrawer
), an = Be.Component, un = Be.preload, ir = m(
  f(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-DxU_Au4b.js")),
  (e) => e.SpaceCanvasManagerDialog
), cn = ir.Component, ar = m(
  f(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-v6iZKZBs.js")),
  (e) => e.CanvasParamBindingDialog
), dn = ar.Component, je = m(
  f(() => import("./space-assistant-CnosoP7l.js")),
  (e) => e.SpaceAssistant
), ln = je.Component, pn = je.preload, ur = m(
  xe,
  (e) => e.CanvasAgentResultContent
), mn = ur.Component, Pe = m(
  f(() => import("./node-detail-dialog-B_3Vjv-x.js")),
  (e) => e.NodeDetailDialog
), fn = Pe.Component, vn = Pe.preload, Oe = m(
  f(() => import("./space-node-settings-CTRYj0dn.js")),
  (e) => e.CanvasNodeSettings
), gn = Oe.Component, yn = Oe.preload, cr = m(
  f(() => import("./space-storyboard-node-YpXWnrP6.js")),
  (e) => e.StoryboardNodeContent
), wn = cr.Component, dr = m(
  f(() => import("./space-storyboard-node-YpXWnrP6.js")),
  (e) => e.StorySettingNodeContent
), Cn = dr.Component, lr = m(
  f(() => import("./space-storyboard-confirm-dialog--t6l6PDp.js")),
  (e) => e.StoryboardConfirmDialog
), bn = lr.Component, pr = m(
  f(() => import("./space-video-compose-view-pLgQwPmi.js")),
  (e) => e.VideoComposeView
), kn = pr.Component, mr = m(
  f(() => import("./writing-preview-nqvgPFYR.js")),
  (e) => e.WritingPreview
), hn = mr.Component;
function Sn({
  node: e,
  contentLabel: t,
  titleStatus: r,
  versionSelect: n,
  updatedAt: o,
  status: i,
  readonly: a,
  actions: c,
  downloadUrl: d,
  onRetry: s,
  onClose: u
}) {
  const l = e.type === "power" ? pt(e.power, e.kind, e.outputType) : null, p = l && l.outputName !== t ? `${l.outputName} · ${t}` : l?.outputName || t;
  return /* @__PURE__ */ v(
    He,
    {
      icon: /* @__PURE__ */ v(vr, { node: e }),
      title: e.title || "节点详情",
      subtitle: p,
      titleStatus: r,
      versionSelect: n,
      state: a ? /* @__PURE__ */ v("span", { className: "wb-detail-state", children: "只读预览" }) : i === "error" ? /* @__PURE__ */ v(ae, { label: "重试保存", children: /* @__PURE__ */ x(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: s,
          children: [
            /* @__PURE__ */ v(ft, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ x("span", { className: `wb-detail-state is-${i}`, children: [
        i === "saving" ? /* @__PURE__ */ v(ve, { size: 12, className: "wb-detail-spin" }) : null,
        fr(i)
      ] }),
      updatedAt: o,
      actions: c,
      downloadUrl: d,
      onClose: u
    }
  );
}
function fr(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : "已保存";
}
function vr({ node: e }) {
  if (e.type === "power")
    return /* @__PURE__ */ v(
      ht,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const t = gr(e);
  return /* @__PURE__ */ v(t, { size: 16 });
}
function gr(e) {
  return e.type === "agent" ? vt : e.type === "flow" ? gt : e.type === "function" ? yt : e.kind === "image" ? wt : e.kind === "video" ? Ct : e.kind === "audio" ? bt : kt;
}
export {
  on as A,
  an as B,
  Qr as C,
  tn as D,
  en as E,
  bn as F,
  Yr as G,
  dn as H,
  fn as I,
  rn as J,
  nn as K,
  vn as L,
  Lr as M,
  Sn as N,
  Hr as O,
  Xr as P,
  Zr as Q,
  Ur as R,
  cn as S,
  Vr as T,
  Cn as U,
  kn as V,
  hn as W,
  wn as X,
  mn as Y,
  Gr as a,
  gn as b,
  Jr as c,
  jt as d,
  _r as e,
  ge as f,
  Er as g,
  jr as h,
  zr as i,
  nr as j,
  Or as k,
  M as l,
  D as m,
  $r as n,
  Br as o,
  yn as p,
  Fr as q,
  Tr as r,
  Pr as s,
  qr as t,
  Kr as u,
  Wr as v,
  sn as w,
  un as x,
  ln as y,
  pn as z
};
