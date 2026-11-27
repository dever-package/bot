import { p as Pe } from "./space-content-view-BelgOwBR.js";
import { ab as Be, e as g, L as re, f as Oe, aa as Ue, i as y, aL as ne, p as je, aR as oe, aG as W, aH as Le, d as se, a9 as ie, a8 as C, ag as Ve, $ as h } from "./asset-audio-preview-DlcU6JQ0.js";
import { d as L, s as A, G as qe, B as ae, g as ze } from "./asset-preview-B63J-8X6.js";
import { s as ue } from "./asset-upload-progress-DID-32U3.js";
import { b3 as Fe, b4 as We, b5 as ce, J as Ke, K, b6 as He, b7 as Je, b8 as Ge } from "./writing-reference-DgnCfuWu.js";
import { u as Qe, a1 as Ze, a2 as Xe, b as Ye, e as et, D as tt, a3 as rt } from "./space-story-setting-reference-Dmqa_708.js";
import { w as nt } from "./interaction-B8o82vSU.js";
import { a as T, d as de, E as ot, G as st, S as it } from "./file-kind-X0KKJPkQ.js";
import { u as at, i as ut } from "./space-node-runtime-CTTiHQ3e.js";
import { a as ct, r as dt } from "./space-assistant-layout-B9KyeCM0.js";
import { j as f, a as M, b as p, c as v } from "./preloadable-CbkzeflN.js";
import { y as lt, r as le, af as pt, aQ as mt, W as ft, k as vt, a8 as gt, a9 as yt, M as wt, b as bt } from "./vendor-icons-B1zF1_4n.js";
import "./media-inspector-gallery-B_v3I6YB.js";
import { P as kt } from "./power-icon-D3f9lTzM.js";
function xr(e, t, r) {
  const o = ht(e, t), n = r || e.kind, i = re(o);
  if (i)
    return {
      mode: "storyboard_grid",
      value: i,
      format: "json",
      summary: me(i),
      downloadUrl: ""
    };
  const a = je(o);
  if (a)
    return {
      mode: "storyboard",
      value: a,
      format: "json",
      summary: oe(a),
      downloadUrl: ""
    };
  const c = Pe(o);
  if (c) return { mode: "setting", value: c, format: "json", summary: c.title, downloadUrl: "" };
  const d = ve(o);
  if (d) {
    if (n === "text") {
      const w = W(d);
      return N(w?.markdown || L(d));
    }
    const b = Mt(o) ? null : W(d);
    return b && Le(b.plainText) ? N(b.markdown) : H(d);
  }
  const s = $(o);
  if (s)
    return {
      mode: "file",
      value: s,
      format: "json",
      summary: s.description || s.name || "文件内容",
      downloadUrl: s.url
    };
  const u = Nt(o);
  if (u)
    return N(u);
  const l = St(o);
  if (l)
    return H(l);
  const m = P(o) || e.description || "";
  return N(m);
}
function Tr(e, t, r = {}) {
  const o = r.includeNodeResult === !1 ? t?.content : Be(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    ge(e, "result", "output")
  ), n = g(o);
  if (re(n))
    return;
  const i = Oe(n);
  for (const c of [n, g(i)])
    if (Ue(c))
      return Ct(c);
  const a = Rt(e.kind, n);
  if (a)
    return a;
}
function Ct(e) {
  const r = ne(e).map((o) => {
    if (!y(o) || o.json === void 0)
      return o;
    const n = { ...o };
    return delete n.json, n;
  });
  return r.length === 1 ? r[0] : r;
}
function ht(e, t) {
  return ie(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    ge(e, "result", "output"),
    e.description
  );
}
function pe(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid" || e.mode === "setting")
    return e.value;
  if (e.mode === "file")
    return Dt(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : A(g(t)) || It(t);
}
function Er(e) {
  return se(pe(e));
}
function $r(e, t) {
  const r = { ...e, value: t };
  if (r.mode === "storyboard")
    r.summary = oe(t);
  else if (r.mode === "setting")
    r.summary = t.title;
  else if (r.mode === "storyboard_grid")
    r.summary = me(t);
  else if (r.mode === "file") {
    const o = t;
    r.summary = o.description || o.name || "文件内容", r.downloadUrl = o.url;
  } else
    r.summary = V(L(pe(r)));
  return r;
}
function me(e) {
  return C(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function H(e) {
  const t = L(e);
  return {
    mode: "rich",
    value: se(e),
    format: "json",
    summary: V(t),
    downloadUrl: fe(e)
  };
}
function N(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: V(e),
    downloadUrl: ""
  };
}
function St(e) {
  if (typeof e == "string" && g(e) === e)
    return null;
  const t = ne(e), r = [];
  return E(
    t,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : A({ type: "doc", content: r });
}
function E(e, t, r, o, n, i) {
  if (e == null || i > 12)
    return;
  const a = g(e);
  if (typeof a == "string") {
    J(t, a, o);
    return;
  }
  if (Array.isArray(a)) {
    a.forEach(
      (d) => E(
        d,
        t,
        r,
        o,
        n,
        i + 1
      )
    );
    return;
  }
  if (!y(a) || r.has(a))
    return;
  r.add(a);
  const c = ve(a);
  if (c) {
    for (const d of c.content || [])
      t.push(d);
    return;
  }
  J(
    t,
    C(a.title, a.text),
    o
  ), At(a, t, n);
  for (const d of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    a[d] !== void 0 && E(
      a[d],
      t,
      r,
      o,
      n,
      i + 1
    );
}
function At(e, t, r) {
  const o = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const n of o)
    for (const i of n.values)
      for (const a of R(i)) {
        const c = `${n.kind}:${a}`;
        r.has(c) || (r.add(c), t.push({
          type: _t(n.kind),
          attrs: { src: a }
        }));
      }
}
function J(e, t, r) {
  const o = String(t || "").trim();
  !o || we(o) || q(o) || r.has(o) || (r.add(o), e.push({
    type: "paragraph",
    content: [{ type: "text", text: o }]
  }));
}
function R(e) {
  return Array.isArray(e) ? e.flatMap(R) : typeof e == "string" ? we(e.trim()) ? [e.trim()] : [] : y(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(R) : [];
}
function $(e) {
  const t = g(e);
  if (Array.isArray(t)) {
    for (const o of t) {
      const n = $(o);
      if (n)
        return n;
    }
    return null;
  }
  if (!y(t))
    return null;
  const r = xt(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (r)
    return {
      url: r,
      name: C(t.name, t.filename, t.title) || ye(r),
      description: C(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const o of ["content", "output", "result", "data", "body", "value"])
    if (t[o] !== void 0) {
      const n = $(t[o]);
      if (n)
        return n;
    }
  return null;
}
function Dt(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || ye(e.url),
    description: e.description.trim()
  };
}
function Rt(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const r = R(t);
  if (r.length !== 0)
    return {
      [`${e}s`]: r
    };
}
function P(e) {
  const t = g(e);
  if (typeof t == "string")
    return q(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(P).filter(Boolean).join(`

`);
  if (!y(t))
    return "";
  const r = C(
    t.text,
    t.summary,
    t.description
  );
  if (r)
    return r;
  for (const o of ["content", "output", "result", "data", "body", "value"])
    if (t[o] !== void 0) {
      const n = P(t[o]);
      if (n)
        return n;
    }
  return "";
}
function Nt(e) {
  const t = g(e);
  return typeof t == "string" ? q(t) ? "" : t : y(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? C(t.text, t.markdown) : "";
}
function It(e) {
  const t = e.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function fe(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const r = fe(t);
    if (r)
      return r;
  }
  return "";
}
function ve(e) {
  const t = g(e);
  if (!y(t))
    return null;
  if (String(t.type || "") === "doc")
    return A(t);
  const r = Object.keys(t).filter((o) => o !== "format");
  return r.length === 1 && r[0] === "rich" ? A(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? A(t.rich ?? t.content) : null;
}
function Mt(e) {
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
function xt(...e) {
  for (const t of e) {
    const r = R(t)[0];
    if (r)
      return r;
  }
  return "";
}
function ge(e, ...t) {
  let r = e;
  for (const o of t) {
    if (!y(r))
      return;
    r = r[o];
  }
  return r;
}
function ye(e) {
  const r = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function V(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function we(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function q(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function Tt(e, t) {
  const r = String(e || "");
  return r.trim() && r.trim() === String(t || "").trim() ? "" : r;
}
function Et(e) {
  return e?.itemType === "shot" || e?.itemType === "shot_image";
}
function Pr(e, t) {
  return Et(t) ? e?.storyboardPromptOverride || "" : Tt(e?.prompt, t?.generatedPrompt);
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const _ = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const be = _.joinSiteApi, ke = _.request;
async function Br(e) {
  const t = ue(
    await ke(be("project/writing_command"), "post", e, {
      reportError: !1
    }),
    "保存创作内容失败"
  ), r = Fe(t);
  if (!r) throw new Error("创作响应缺少已保存版本");
  return r;
}
async function Or(e) {
  const t = ue(
    await ke(
      be("project/writing_runs"),
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
        checkpoint: We(r.checkpoint)
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
  const o = e.previousAssets?.find(
    (a) => a.id === Number(t.id || 0)
  ), n = o ? D(o, e.previousAsset) : e.previousAsset || null, i = D(
    t,
    n
  );
  return n && ce(n, i) ? n : n?.version?.content != null && Number(n.version.id || 0) === Number(i.version?.id || 0) && (!Ke(i.version?.content) || K(n.version) >= K(i.version)) ? D(n, i) : i.version?.id ? i : null;
}
function jr(e, t) {
  const r = $t(e);
  return t ? {
    ...r,
    asset: t
  } : r;
}
function Lr(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function D(e, t) {
  const r = G(e), o = t ? G(t) : null, n = [
    ...r.versions || [],
    ...o?.versions || []
  ], i = Pt(
    [Ot(r.version)].filter(
      (a) => !!a
    ),
    n
  );
  return {
    ...o,
    ...r,
    version: r.version || o?.version,
    versions: i.length ? i : void 0
  };
}
function Vr(e, t) {
  if (t.length === 0)
    return e;
  const r = new Map(t.map((n) => [n.id, n])), o = e.map((n) => {
    const i = r.get(n.id);
    return i ? (r.delete(n.id), ce(n, i) ? n : D(i, n)) : n;
  });
  return [
    ...[...r.values()].map(
      (n) => D(n)
    ),
    ...o
  ];
}
function $t(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...r } = e;
  return r;
}
function G(e) {
  const t = Q(e.version), r = (e.versions || []).map(Q).filter((o) => !!o);
  return {
    ...e,
    version: t,
    versions: r.length ? r : e.versions
  };
}
function Q(e) {
  if (!e)
    return;
  const t = qe(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function Pt(...e) {
  const t = e.flat(), r = [], o = /* @__PURE__ */ new Map();
  for (const i of t) {
    if (!i || Number(i.id || 0) <= 0)
      continue;
    const a = String(i.id), c = o.get(a);
    if (c !== void 0) {
      r[c] = Bt(
        r[c],
        i
      );
      continue;
    }
    o.set(a, r.length), r.push(i);
  }
  let n = !1;
  return r.sort(
    (i, a) => Number(x(a)) - Number(x(i)) || Number(a.version || a.id || 0) - Number(i.version || i.id || 0)
  ).map((i) => x(i) ? n ? Ut(i) : (n = !0, i) : i);
}
function Bt(e, t) {
  const r = { ...e };
  for (const [o, n] of Object.entries(t))
    n !== void 0 && n !== "" && (r[o] = n);
  return r;
}
function x(e) {
  return !!(e.is_current || e.current);
}
function Ot(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Ut(e) {
  const { current: t, is_current: r, ...o } = e;
  return o;
}
const jt = [
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
  jt.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Vt(e) {
  return Lt[e] || "文本";
}
function qr(e, t = []) {
  const r = new Map(
    t.map((s) => [s.key, s])
  ), o = new Map(e.nodes.map((s) => [s.id, s])), n = new Map(
    e.nodes.filter((s) => s.type === "group").map((s) => [s.id, s])
  ), i = zt(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), a = e.nodes.filter((s) => He(s) || Qe(s, "import")).map((s) => {
    const u = r.get(`node:${s.id}`), l = i.get(s.id) || s.asset, m = s.groupId ? n.get(s.groupId) : void 0, b = m?.group?.sourceNodeId ? o.get(m.group.sourceNodeId) : void 0, w = u?.node === s && u?.asset === l, k = w ? u.output : e.nodeOutput(s);
    return {
      key: `node:${s.id}`,
      role: "material",
      title: s.title || Vt(Z(s)),
      sourcePath: b?.title && m?.title ? `${b.title} / ${m.title}` : m?.title,
      nodeType: Z(s),
      status: w ? u.status : Ft(s, l, e.nodeHasResult(s)),
      preview: w ? u.preview : e.nodePreview(s),
      output: k,
      node: s,
      nodeId: s.id,
      nodeNo: s.nodeNo,
      groupId: s.groupId,
      groupTitle: m?.title,
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
      nodeType: he(s.kind),
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
function Ce(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function qt(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && Ce(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function Z(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), r = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || r === "storyboard" ? "storyboard" : he(e.power?.kind || e.kind);
}
function he(e) {
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
  const o = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (Number(n.canvas_id || 0) !== t || Number(n.asset_cate_id || 0) !== r || String(n.role || "") !== "material" || String(n.status || "") === "archived")
      continue;
    const i = String(
      n.node_key || n.version?.node_key || ""
    ).trim();
    i && !o.has(i) && o.set(i, n);
  }
  return o;
}
function Ft(e, t, r) {
  const o = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return o === "running" || o === "waiting" || e.running === !0 ? "running" : o === "error" || o === "failed" || o === "failure" ? "failed" : r || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function zr(e, t = []) {
  return {
    current: Kt([
      ...t,
      ...(e?.sources || []).map((r) => ({
        id: r.nodeId,
        title: r.title,
        kind: Se(
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
const X = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap();
function Fr(e, t = []) {
  const r = new Map(
    t.map((n) => [`${n.source}:${n.id}`, n])
  ), o = e.flatMap((n) => {
    const i = X.get(n);
    if (i) return i;
    const a = {
      id: n.role === "material" ? n.nodeId || n.key : String(n.assetId || n.key),
      title: n.title,
      kind: Se(n.preview, n.nodeType),
      role: n.role,
      source: n.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: n.assetId,
      versionID: n.versionId,
      output: n.output,
      preview: n.preview,
      asset: n.asset
    }, c = r.get(`${a.source}:${a.id}`), s = (c && ee(c, a) ? Y.get(c) : void 0) || Je(a).map((u) => {
      const l = r.get(
        `${u.source}:${u.id}`
      );
      return l && ee(l, u) ? l : u;
    });
    return X.set(n, s), Y.set(s[0], s), s;
  });
  return o.length === t.length && o.every((n, i) => n === t[i]) ? t : o;
}
function ee(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && Ce(e.preview, t.preview) && Wt(e.contentSelection, t.contentSelection);
}
function Wt(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((r, o) => r === t.ids[o]));
}
function Kt(e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e) {
    const n = `${o.source}:${o.id}`;
    r.has(n) || (r.add(n), t.push(o));
  }
  return t;
}
function Se(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(r) ? r : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : r || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ht = B.joinSiteApi;
async function Wr(e) {
  const t = String(e.requestId || "").trim();
  if (!t)
    throw new Error("request_id 不能为空");
  return nt({
    streamApi: Jt(e.projectId),
    requestID: t,
    lastID: e.lastId || "0-0",
    blockMs: 15e3,
    signal: e.signal,
    acceptErrorResult: !0,
    // 画布由页面统一核对状态并恢复 SSE，避免 SDK 隐式切成逐运行轮询。
    recoverOnError: e.recoverOnError ?? !1,
    fallbackToPoll: !1,
    initialState: null,
    reduceFrame: (r, o) => (e.onFrame(o), r)
  });
}
function Jt(e) {
  const t = new URL(Ht("run/stream"), window.location.origin);
  return t.searchParams.set("project_id", String(e || 0)), t.toString();
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const O = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!O || Object.keys(O).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Gt = O.joinSiteApi, U = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Qt = U.useAuthStore, Zt = ct();
function Kr(e, t) {
  const r = at(), o = Qt(
    (k) => k.auth?.accessToken || ""
  ), n = JSON.stringify([
    Gt("workspace/canvas_execution"),
    r,
    o
  ]), i = String(t.runError || "").trim(), a = t.id, c = Number(t.resultRef?.execution_id || 0), d = String(t.resultRef?.request_id || "").trim(), s = Number(t.resultRef?.run_id || 0), u = Ae(
    e,
    a,
    c,
    d,
    s
  ), [l, m] = T(i), [b, w] = T(!1);
  return de(() => {
    if (m(i), !i || !u || !Ze(i)) {
      w(!1);
      return;
    }
    let k = !0;
    return w(!0), Xt({
      projectId: e,
      nodeId: a,
      executionId: c,
      requestId: d,
      runId: s,
      requestScopeKey: n,
      fallback: i
    }).then((F) => {
      k && F && m(F);
    }).catch(() => {
    }).finally(() => {
      k && w(!1);
    }), () => {
      k = !1;
    };
  }, [
    c,
    i,
    a,
    e,
    u,
    n,
    d,
    s
  ]), { error: l || i, loading: b };
}
function Xt({
  projectId: e,
  nodeId: t,
  executionId: r,
  requestId: o,
  runId: n,
  requestScopeKey: i,
  fallback: a
}) {
  const c = JSON.stringify([
    i,
    Ae(e, "", r, o, n)
  ]);
  return Zt(
    c,
    () => Ge({
      projectId: e,
      executionId: r,
      requestId: o,
      runId: n
    }).then(tt)
  ).then((s) => {
    const u = [...s.node_results || []].reverse().find((m) => m.node_key === t), l = Xe(u) || Ye(s);
    return et(l, a);
  });
}
function Ae(e, t, r, o, n) {
  const i = r ? `execution:${r}` : o ? `request:${o}` : n ? `run:${n}` : "";
  return e > 0 && i ? `${e}:${i}:${t}` : "";
}
function Hr(e) {
  const t = Yt(e.trim()), r = Ve(t), o = De(r), n = t.match(/\bstatus=(\d{3})\b/), a = (o || (n && t.includes("body=") ? `请求失败（HTTP ${n[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: a.length > 96 ? `${a.slice(0, 95)}…` : a,
    details: t
  };
}
function De(e) {
  return y(e) ? De(e.error) || h(e.message) || h(e.msg) || h(e.detail) || h(e.details) || h(e.error) : "";
}
function Yt(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const I = /* @__PURE__ */ new Set();
let j = Date.now(), S;
function er(e) {
  return I.add(e), S == null && typeof window < "u" && (j = Date.now(), S = window.setInterval(() => {
    j = Date.now(), I.forEach((t) => t());
  }, 1e3)), () => {
    I.delete(e), I.size === 0 && S != null && (window.clearInterval(S), S = void 0);
  };
}
function tr() {
  return () => {
  };
}
function te() {
  return j;
}
function rr(e) {
  return ot(
    e ? er : tr,
    te,
    te
  );
}
function Jr({
  runTiming: e,
  runningNode: t,
  showEstimate: r = !0,
  active: o,
  observed: n = !1
}) {
  const i = o ?? ut(t), a = o !== void 0 ? e : i ? { startedAt: t?.startedAt || 0, finishedAt: void 0 } : nr(t) || e, c = rr(!!(i && a?.startedAt));
  if (!a?.startedAt || !i && (!a.finishedAt || a.finishedAt < a.startedAt))
    return null;
  const d = Math.max(
    0,
    (i ? c : a.finishedAt || a.startedAt) - a.startedAt
  ), s = rt(
    d,
    i,
    t?.estimatedDurationMs
  ), u = `${n ? "本次查看" : ""}${s.elapsed}`, l = n ? u : r ? s.tooltip : u;
  return /* @__PURE__ */ f(ae, { label: l, side: "top", sideOffset: 6, children: /* @__PURE__ */ M(
    "span",
    {
      className: `ws-node-run-timing${i ? " is-active" : ""}`,
      "aria-label": l,
      children: [
        /* @__PURE__ */ f(lt, { size: 11, "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: u })
      ]
    }
  ) });
}
function nr(e) {
  if (!(!e?.startedAt || !e.finishedAt))
    return {
      startedAt: e.startedAt,
      finishedAt: e.finishedAt
    };
}
class Gr extends st {
  state = { failed: !1 };
  static getDerivedStateFromError() {
    return { failed: !0 };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : /* @__PURE__ */ f(it, { fallback: /* @__PURE__ */ f(or, { label: "正在加载节点详情", overlay: !0 }), children: this.props.children });
  }
}
function or({
  label: e,
  overlay: t = !1,
  compact: r = !1,
  delay: o = 160
}) {
  const [n, i] = T(o <= 0);
  return de(() => {
    if (o <= 0) {
      i(!0);
      return;
    }
    const a = window.setTimeout(() => i(!0), o);
    return () => window.clearTimeout(a);
  }, [o]), n ? /* @__PURE__ */ M(
    "div",
    {
      className: `ws-module-loading ${t ? "is-overlay" : ""} ${r ? "is-compact" : ""}`,
      role: "status",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ f(le, { size: 20, "aria-hidden": "true" }),
        /* @__PURE__ */ f("span", { children: e })
      ]
    }
  ) : null;
}
const Re = v(() => import("./space-agent-tools-CKjyAfQA.js")), z = v(() => import("./space-asset-tools-pGmlusv5.js")), sr = p(
  Re,
  (e) => e.AgentInteractionPanel
), Qr = sr.Component, Ne = p(
  v(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-Cy8qGUYb.js")),
  (e) => e.AddNodeMenu
), Zr = Ne.Component, Xr = Ne.preload, Ie = p(
  z,
  (e) => e.AssetBrowser
), Yr = Ie.Component, en = Ie.preload, Me = p(
  z,
  (e) => e.AssetDetailDialog
), tn = Me.Component, rn = Me.preload, _e = p(
  z,
  (e) => e.AssetPickerDialog
), nn = _e.Component, on = _e.preload, xe = p(
  v(() => import("./space-run-history-CyqYVSp4.js")),
  (e) => e.CanvasRunHistoryDrawer
), sn = xe.Component, an = xe.preload, ir = p(
  v(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-BGC0OZuC.js")),
  (e) => e.SpaceCanvasManagerDialog
), un = ir.Component, ar = p(
  v(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-Qvss1-Ia.js")),
  (e) => e.CanvasParamBindingDialog
), cn = ar.Component, Te = p(
  v(() => import("./space-assistant-DbMi4QXQ.js")),
  (e) => e.SpaceAssistant
), dn = Te.Component, ln = Te.preload, ur = p(
  Re,
  (e) => e.CanvasAgentResultContent
), pn = ur.Component, Ee = p(
  v(() => import("./node-detail-dialog-Cc9F4Nvw.js")),
  (e) => e.NodeDetailDialog
), mn = Ee.Component, fn = Ee.preload, $e = p(
  v(() => import("./space-node-settings-BG0enjCQ.js")),
  (e) => e.CanvasNodeSettings
), vn = $e.Component, gn = $e.preload, cr = p(
  v(() => import("./space-storyboard-node-Df63k1R6.js")),
  (e) => e.StoryboardNodeContent
), yn = cr.Component, dr = p(
  v(() => import("./space-storyboard-node-Df63k1R6.js")),
  (e) => e.StorySettingNodeContent
), wn = dr.Component, lr = p(
  v(() => import("./space-storyboard-confirm-dialog-ycFXjrxb.js")),
  (e) => e.StoryboardConfirmDialog
), bn = lr.Component, pr = p(
  v(() => import("./space-video-compose-view-Ctpb2ZJL.js")),
  (e) => e.VideoComposeView
), kn = pr.Component, mr = p(
  v(() => import("./writing-preview-Bi9MJ0Je.js")),
  (e) => e.WritingPreview
), Cn = mr.Component;
function hn({
  node: e,
  contentLabel: t,
  titleStatus: r,
  versionSelect: o,
  updatedAt: n,
  status: i,
  readonly: a,
  actions: c,
  downloadUrl: d,
  onRetry: s,
  onClose: u
}) {
  const l = e.type === "power" ? dt(e.power, e.kind, e.outputType) : null, m = l && l.outputName !== t ? `${l.outputName} · ${t}` : l?.outputName || t;
  return /* @__PURE__ */ f(
    ze,
    {
      icon: /* @__PURE__ */ f(vr, { node: e }),
      title: e.title || "节点详情",
      subtitle: m,
      titleStatus: r,
      versionSelect: o,
      state: a ? /* @__PURE__ */ f("span", { className: "wb-detail-state", children: "只读预览" }) : i === "error" ? /* @__PURE__ */ f(ae, { label: "重试保存", children: /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: s,
          children: [
            /* @__PURE__ */ f(pt, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ M("span", { className: `wb-detail-state is-${i}`, children: [
        i === "saving" ? /* @__PURE__ */ f(le, { size: 12, className: "wb-detail-spin" }) : null,
        fr(i)
      ] }),
      updatedAt: n,
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
    return /* @__PURE__ */ f(
      kt,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const t = gr(e);
  return /* @__PURE__ */ f(t, { size: 16 });
}
function gr(e) {
  return e.type === "agent" ? mt : e.type === "flow" ? ft : e.type === "function" ? vt : e.kind === "image" ? gt : e.kind === "video" ? yt : e.kind === "audio" ? wt : bt;
}
export {
  nn as A,
  sn as B,
  or as C,
  en as D,
  Yr as E,
  bn as F,
  Zr as G,
  cn as H,
  Gr as I,
  mn as J,
  tn as K,
  rn as L,
  fn as M,
  hn as N,
  Lr as O,
  Wr as P,
  Qr as Q,
  Xr as R,
  un as S,
  Ur as T,
  jr as U,
  kn as V,
  Cn as W,
  wn as X,
  yn as Y,
  pn as Z,
  Jr as a,
  vn as b,
  Hr as c,
  Pt as d,
  Tr as e,
  pe as f,
  Er as g,
  Pr as h,
  Et as i,
  Tt as j,
  zr as k,
  rr as l,
  D as m,
  $r as n,
  Or as o,
  gn as p,
  Vr as q,
  xr as r,
  Br as s,
  qr as t,
  Kr as u,
  Fr as v,
  on as w,
  an as x,
  dn as y,
  ln as z
};
