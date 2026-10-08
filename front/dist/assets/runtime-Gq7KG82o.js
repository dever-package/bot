await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const D = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const z = D.isPlainRecord;
function A(t) {
  return z(t) ? { ...t } : {};
}
function Lt(t) {
  return z(t) && Object.keys(t).length > 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const x = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!x || Object.keys(x).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Y = x.isPlainRecord;
function v(...t) {
  for (const e of t) {
    const n = Z(e);
    if (n)
      return n;
  }
  return "";
}
function Z(t) {
  if (typeof t == "string" || typeof t == "number") {
    const e = String(t).trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    return e && Number(e[1]) > 0 && Number(e[2]) > 0 ? `${e[1]} / ${e[2]}` : "";
  }
  return Array.isArray(t) ? v(...t) : Y(t) ? v(...Object.values(t)) : "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output", "@/lib/stream"]);
const M = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const k = M.isPlainRecord, R = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!R || Object.keys(R).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const f = R.streamValueText, B = {
  load_skill: "技能加载",
  list_skill_files: "技能目录读取",
  read_skill_file: "技能文件读取",
  read_temp_file: "技能文件读取",
  write_temp_file: "技能文件准备",
  run_skill_script: "技能执行",
  http_request: "技能请求",
  curl_request: "技能请求",
  mcp_call: "技能工具调用"
};
function U(t) {
  const e = A(t), n = f(e.event).toLowerCase();
  if (!ct(n))
    return;
  const r = k(e.meta) ? e.meta : {}, i = k(r.tool_params) ? r.tool_params : {}, o = f(r.tool_name), s = f(r.tool_call_id || o);
  if (!s)
    return;
  const u = tt(r.tool_kind, o), c = lt(n, r.tool_status);
  return {
    id: s,
    title: f(r.tool_title) || nt(u) || o || "工具调用",
    kind: u,
    status: c,
    text: et(e.text, u, c, o),
    error: f(e.error),
    progress: dt(
      e.progress ?? r.progress ?? r.percent
    ),
    count: ft(r.tool_count),
    aspectRatio: v(Object.values(i)),
    anchorText: f(e.anchor_text),
    output: e
  };
}
function tt(t, e) {
  const n = f(t).toLowerCase();
  if (n)
    return n;
  const r = e.toLowerCase();
  return r.includes("knowledge") ? "knowledge" : it(r) ? "skill" : "";
}
function et(t, e, n, r) {
  const i = f(t);
  return rt(i) ? e === "knowledge" ? n === "succeeded" ? st(r) : "正在读取知识库" : e === "skill" ? ot(r, n) : i : i;
}
function rt(t) {
  return t === "内容生成完成" || t === "内容生成中，请稍后";
}
function nt(t) {
  return t === "knowledge" ? "知识库" : t === "skill" ? "技能调用" : "";
}
function it(t) {
  return t.startsWith("skill_") || !!B[t];
}
function ot(t, e) {
  const n = e === "succeeded" ? "完成" : "中";
  return `${B[t.toLowerCase()] || "技能调用"}${n}`;
}
function st(t) {
  switch (t.toLowerCase()) {
    case "open_knowledge_init":
      return "已读取知识库说明";
    case "list_knowledge_files":
    case "list_knowledge_tree":
    case "expand_knowledge_node":
      return "已读取知识库结构";
    case "search_knowledge_files":
    case "search_knowledge_nodes":
    case "find_related_knowledge":
    case "debug_knowledge_retrieval":
      return "已完成知识库搜索";
    case "read_knowledge_file":
    case "open_knowledge_node":
      return "已读取知识库文件";
    default:
      return "已参考知识库";
  }
}
function zt(t) {
  const e = A(t);
  return Array.isArray(e.activities) ? e.activities.map(U).filter((n) => !!n) : [];
}
function at(t, e) {
  const n = t ? [...t] : [], r = n.findIndex((i) => i.id === e.id);
  return r < 0 ? [...n, e] : (n[r] = ut(n[r], e), n);
}
function Bt(t, e) {
  return e.reduce(at, t || []);
}
function ut(t, e) {
  return {
    ...t,
    ...e,
    text: e.text || t.text,
    error: e.error || t.error,
    count: e.count || t.count,
    aspectRatio: e.aspectRatio || t.aspectRatio,
    anchorText: e.anchorText || t.anchorText,
    progress: mt(t.progress, e.progress),
    output: {
      ...t.output,
      ...e.output,
      meta: pt(t.output.meta, e.output.meta)
    }
  };
}
function ct(t) {
  return [
    "tool_start",
    "tool_progress",
    "tool_result",
    "tool_error",
    "interaction"
  ].includes(t);
}
function lt(t, e) {
  const n = f(e).toLowerCase();
  return t === "tool_error" || n === "failed" ? "failed" : t === "tool_result" || t === "interaction" || n === "succeeded" ? "succeeded" : "running";
}
function dt(t) {
  if (t == null || t === "")
    return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.max(0, Math.min(100, Math.round(e))) : null;
}
function ft(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e < 1 ? 1 : Math.min(8, Math.floor(e));
}
function mt(t, e) {
  return t == null ? e : e == null ? t : Math.max(t, e);
}
function pt(t, e) {
  return {
    ...k(t) ? t : {},
    ...k(e) ? e : {}
  };
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const $ = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!$ || Object.keys($).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const w = $.isPlainRecord, gt = 8;
function Ut(t) {
  if (!w(t) || !w(t.interaction))
    return;
  const e = t.interaction, n = g(e.id), r = Array.isArray(e.fields) ? e.fields : [];
  if (!(!n || r.length === 0))
    return {
      ...e,
      id: n,
      type: g(e.type) || "form",
      presentation: g(e.presentation),
      title: g(e.title) || "需要补充信息",
      description: g(e.description),
      fields: r
    };
}
function Vt(t) {
  if (!w(t) || !Array.isArray(t.suggestions))
    return [];
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t.suggestions) {
    if (!w(r))
      continue;
    const i = g(r.label), o = g(r.prompt);
    if (!(!i || !o || e.has(o)) && (e.add(o), n.push({ label: i, prompt: o }), n.length === gt))
      break;
  }
  return n;
}
function Kt(t) {
  return w(t) ? g(t.message) : "";
}
function Jt(t, e) {
  for (const n of t) {
    if (n.role !== "user")
      continue;
    const r = n.content?.interaction_response;
    if (r?.interaction_id === e)
      return { data: r.data };
  }
}
function g(t) {
  return t == null ? "" : String(t).trim();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const S = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!S || Object.keys(S).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const F = S.isPlainRecord;
function V(t) {
  return !F(t) || !Array.isArray(t.artifacts) ? [] : t.artifacts.map(_t).filter((e) => !!e);
}
function Gt(t) {
  const e = {};
  for (const n of V(t)) {
    if (n.status !== "ready" || !n.url)
      continue;
    const r = ht(n.kind), i = e[r], o = Array.isArray(i) ? i : [];
    e[r] = [
      ...o,
      {
        id: n.fileID,
        name: n.name || n.label,
        url: n.url,
        thumbnail: n.previewUrl,
        mime: n.mime,
        size: n.size
      }
    ];
  }
  return e;
}
function _t(t) {
  if (!F(t))
    return null;
  const e = y(t.artifact_id ?? t.id);
  return e ? {
    id: e,
    fileID: y(t.file_id ?? t.fileID),
    displayNo: Math.floor(y(t.display_no ?? t.displayNo)),
    label: p(t.label) || `素材 ${e}`,
    name: p(t.name),
    kind: wt(t.kind),
    status: bt(t.status),
    error: p(t.error),
    url: p(t.url || t.open_url),
    previewUrl: p(t.preview_url || t.previewUrl || t.url),
    mime: p(t.mime),
    size: y(t.size),
    meta: F(t.meta) ? { ...t.meta } : {}
  } : null;
}
function wt(t) {
  const e = p(t).toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : "file";
}
function bt(t) {
  const e = p(t).toLowerCase();
  return e === "ready" || e === "failed" ? e : "generating";
}
function ht(t) {
  return t === "image" ? "images" : t === "video" ? "videos" : t === "audio" ? "audios" : "files";
}
function y(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function p(t) {
  return t == null ? "" : String(t).trim();
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output", "@/lib/request"]);
const N = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!N || Object.keys(N).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const b = N.isPlainRecord, I = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const yt = I.resolveAssetUrl;
function Ht(t) {
  return t && typeof t.meta.intro == "string" ? t.meta.intro.trim() : "";
}
function Ct(t, e) {
  const n = e.trim(), r = String(t || "").trim().split(/\n{2,}/).map(
    (i) => i.split(`
`).filter((o) => !Tt(o, n)).join(`
`).trim()
  ).filter(Boolean);
  return r.filter((i, o) => i !== r[o - 1]).join(`

`);
}
function Wt(t) {
  return kt(t);
}
function kt(t) {
  const e = t.blocks.flatMap((n) => {
    if (n.type === "text") {
      const r = Ct(
        n.text,
        t.title
      );
      return r ? [r] : [];
    }
    return n.artifacts.map(At).filter((r) => !!r);
  });
  return t.title && e.unshift(`# ${t.title}`), e.join(`

`);
}
function At(t) {
  const e = yt(
    String(t.url || t.previewUrl || "").trim()
  );
  if (t.status !== "ready" || !e)
    return "";
  const n = Dt(
    t.label || t.name || `素材 ${t.id}`
  ), r = `<${e.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll(" ", "%20")}>`;
  return t.kind === "image" ? `![${n}](${r})` : `[${n}](${r})`;
}
function Dt(t) {
  return String(t || "").replace(/[\\[\]]/g, "\\$&");
}
function xt(t) {
  if (!b(t))
    return;
  const e = _(t.id);
  if (!e)
    return;
  const n = Array.isArray(t.blocks), r = n ? t.blocks.map(K).filter((o) => !!o).sort(X) : [], i = O(t.status);
  return {
    id: e,
    hydrated: n,
    sessionID: _(t.session_id),
    messageID: _(t.message_id),
    runID: _(t.run_id),
    title: a(t.title),
    status: i,
    blockCount: m(t.block_count) || r.length,
    pendingJobCount: P(i) ? 0 : m(t.pending_job_count),
    meta: b(t.meta) ? { ...t.meta } : {},
    blocks: r,
    createdAt: a(t.created_at),
    updatedAt: a(t.updated_at),
    completedAt: a(t.completed_at)
  };
}
function vt(t, e) {
  if (!e)
    return t;
  if (!t || t.id !== e.id)
    return e;
  const n = T(t.status, e.status);
  return {
    ...t,
    ...e,
    sessionID: e.sessionID || t.sessionID,
    messageID: e.messageID || t.messageID,
    runID: e.runID || t.runID,
    title: e.title || t.title,
    status: n,
    pendingJobCount: P(n) ? 0 : e.pendingJobCount,
    hydrated: t.hydrated || e.hydrated,
    meta: { ...t.meta, ...e.meta },
    blocks: J(t.blocks, e.blocks)
  };
}
function Xt(t, e) {
  if (!b(e))
    return t;
  const n = xt(e.document);
  let r = vt(t, n);
  const i = _(e.document_id) || n?.id || 0;
  if (!r || i && r.id !== i)
    return r;
  const o = K(e.block);
  if (o) {
    const d = J(r.blocks, [o]);
    r = {
      ...r,
      blocks: d,
      blockCount: Math.max(r.blockCount, d.length)
    };
  }
  const s = _(e.block_id) || o?.id || 0, u = H(e.artifacts), c = a(e.event).toLowerCase();
  c === "text_delta" && s && (r = St(r, s, {
    revision: m(e.revision),
    delta: a(e.delta, !1)
  })), s && (r = G(r, s, (d) => ({
    ...d,
    status: Q(
      d.status,
      Nt(c, d.status)
    ),
    artifacts: u.length > 0 ? W(d.artifacts, u) : d.artifacts,
    meta: {
      ...d.meta,
      ...e.progress == null ? {} : { progress: e.progress },
      ...a(e.text) ? { progress_text: a(e.text) } : {}
    }
  })));
  const E = a(e.status);
  return c === "document_content_complete" ? r = {
    ...r,
    status: T(
      r.status,
      O(E || "generating")
    )
  } : c === "document_complete" && (r = {
    ...r,
    status: T(
      r.status,
      O(E || "ready")
    ),
    pendingJobCount: 0
  }), r;
}
function Mt(t) {
  return !t || P(t.status) ? !1 : t.status === "writing" || t.status === "generating" || t.pendingJobCount > 0 || t.blocks.some(
    (e) => e.type === "media" && e.status !== "failed" && !Rt(e)
  );
}
function Rt(t) {
  return t.type === "media" && t.artifacts.length > 0 && t.artifacts.every(
    (e) => e.status === "ready" && !!String(e.url || e.previewUrl || "").trim()
  );
}
function Qt(t) {
  return !!(t && (!t.hydrated || Mt(t) || t.blocks.some(
    (e) => e.meta.stream_out_of_sync === !0
  )));
}
function K(t) {
  if (!b(t))
    return null;
  const e = _(t.id);
  if (!e)
    return null;
  const n = a(t.type) === "media" ? "media" : "text";
  return {
    id: e,
    seq: m(t.seq),
    type: n,
    format: a(t.format) || (n === "media" ? "artifact" : "markdown"),
    mediaKind: jt(t.media_kind),
    text: a(t.text, !1),
    status: Ot(t.status, n),
    meta: b(t.meta) ? { ...t.meta } : {},
    artifacts: H(t.artifacts)
  };
}
function J(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id), o = i ? Ft(i.meta, r.meta) : r.meta;
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        text: $t(i, r),
        status: Q(i.status, r.status),
        meta: o,
        artifacts: W(i.artifacts, r.artifacts)
      } : r
    );
  }
  return Array.from(n.values()).sort(X);
}
function $t(t, e) {
  const n = m(t.meta.stream_revision), r = m(e.meta.stream_revision);
  return n > r ? t.text : e.text || t.text;
}
function St(t, e, n) {
  return !n.revision || !n.delta ? t : G(t, e, (r) => {
    if (r.type !== "text")
      return r;
    const i = m(r.meta.stream_revision);
    if (n.revision <= i)
      return r;
    if (n.revision !== i + 1)
      return {
        ...r,
        meta: { ...r.meta, stream_out_of_sync: !0 }
      };
    const o = { ...r.meta, stream_revision: n.revision };
    return delete o.stream_out_of_sync, { ...r, text: `${r.text}${n.delta}`, meta: o };
  });
}
function Ft(t, e) {
  const n = { ...t, ...e }, r = m(t.stream_revision), i = m(e.stream_revision);
  return r > i ? (n.stream_revision = r, n) : (i >= r && i > 0 && delete n.stream_out_of_sync, n);
}
function G(t, e, n) {
  return {
    ...t,
    blocks: t.blocks.map(
      (r) => r.id === e ? n(r) : r
    )
  };
}
function H(t) {
  return V({ artifacts: Array.isArray(t) ? t : [] });
}
function W(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id);
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        fileID: r.fileID || i.fileID,
        status: It(i.status, r.status),
        url: r.url || i.url,
        previewUrl: r.previewUrl || i.previewUrl,
        mime: r.mime || i.mime,
        size: r.size || i.size
      } : r
    );
  }
  return Array.from(n.values()).sort(
    (r, i) => r.displayNo - i.displayNo || r.id - i.id
  );
}
function X(t, e) {
  return t.seq - e.seq || t.id - e.id;
}
function Nt(t, e) {
  return t === "artifact_ready" ? "ready" : t === "artifact_failed" ? "failed" : t === "artifact_progress" ? "generating" : e;
}
function T(t, e) {
  return L(e) >= L(t) ? e : t;
}
function L(t) {
  return t === "failed" ? 3 : t === "ready" || t === "partial_failed" ? 2 : t === "generating" ? 1 : 0;
}
function P(t) {
  return t === "ready" || t === "partial_failed" || t === "failed";
}
function Q(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function It(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function Tt(t, e) {
  if (!e)
    return !1;
  const n = t.trim().match(/^#{1,6}\s+(.+)$/);
  return !!(n && n[1].trim() === e);
}
function O(t) {
  const e = a(t).toLowerCase();
  return e === "generating" || e === "ready" || e === "partial_failed" || e === "failed" ? e : "writing";
}
function Ot(t, e) {
  const n = a(t).toLowerCase();
  return n === "generating" || n === "failed" ? n : e === "media" && !n ? "generating" : "ready";
}
function jt(t) {
  const e = a(t).toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : "file";
}
function _(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? Math.floor(e) : 0;
}
function m(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? Math.floor(e) : 0;
}
function a(t, e = !0) {
  const n = t == null ? "" : String(t);
  return e ? n.trim() : n;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/runtime-stream-output", "@/lib/stream"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const qt = j.requestRaw, h = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const C = h.isPlainRecord, Pt = h.normalizeRuntimeFrameOutput, Et = h.resolveRuntimeFrameCancelable, q = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!q || Object.keys(q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const l = q.streamValueText;
async function Yt(t, e) {
  const n = await qt(t, "get", { request_id: e });
  if (!C(n))
    throw new Error("读取智能体运行状态失败");
  const r = Number(n.code || 0), i = Number(n.status || 0);
  if (r !== 0 || i === 2)
    throw new Error(
      l(n.message || n.msg) || "读取智能体运行状态失败"
    );
  const o = C(n.data) ? n.data : {}, s = C(o.run) ? o.run : {}, u = A(s.output);
  return {
    requestID: l(s.request_id) || e,
    status: l(s.status).toLowerCase(),
    runVersion: Number(s.version || 0),
    text: l(u.text),
    output: u,
    error: l(s.error || u.error)
  };
}
function Zt(t) {
  const e = Pt(t?.output, t), n = A(e), r = l(n.semantic_event || n.event).toLowerCase(), i = l(n.text), o = t?.type === "result", s = Number(t?.status || 0) === 2, u = r === "delta" || !r && !!i && !o, c = C(n.meta) ? n.meta : {};
  return {
    requestID: l(t?.request_id),
    streamID: l(t?.stream_id),
    event: r,
    delta: u ? i : "",
    finalText: o ? i : "",
    output: n,
    activity: U(n),
    error: l(n.error || (s ? t?.msg : "")),
    cancelable: Et(t),
    runVersion: Number(c.run_version || 0),
    assistantMessageID: Number(c.assistant_message_id || 0),
    finished: o,
    failed: s
  };
}
function te(t) {
  return ["success", "fail", "canceled"].includes(t);
}
export {
  Ht as a,
  Gt as b,
  zt as c,
  xt as d,
  Ct as e,
  Rt as f,
  v as g,
  Wt as h,
  Mt as i,
  Lt as j,
  vt as k,
  Zt as l,
  Bt as m,
  A as n,
  Xt as o,
  at as p,
  te as q,
  V as r,
  Yt as s,
  Qt as t,
  Ut as u,
  Jt as v,
  Vt as w,
  Kt as x
};
