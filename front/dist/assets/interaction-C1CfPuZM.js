await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const D = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const x = D.isPlainRecord;
function z(t) {
  return !x(t) || !Array.isArray(t.artifacts) ? [] : t.artifacts.map(Y).filter((e) => !!e);
}
function Lt(t) {
  const e = {};
  for (const n of z(t)) {
    if (n.status !== "ready" || !n.url)
      continue;
    const r = et(n.kind), i = e[r], o = Array.isArray(i) ? i : [];
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
function Y(t) {
  if (!x(t))
    return null;
  const e = y(t.artifact_id ?? t.id);
  return e ? {
    id: e,
    fileID: y(t.file_id ?? t.fileID),
    displayNo: Math.floor(y(t.display_no ?? t.displayNo)),
    label: p(t.label) || `素材 ${e}`,
    name: p(t.name),
    kind: Z(t.kind),
    status: tt(t.status),
    error: p(t.error),
    url: p(t.url || t.open_url),
    previewUrl: p(t.preview_url || t.previewUrl || t.url),
    mime: p(t.mime),
    size: y(t.size),
    meta: x(t.meta) ? { ...t.meta } : {}
  } : null;
}
function Z(t) {
  const e = p(t).toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : "file";
}
function tt(t) {
  const e = p(t).toLowerCase();
  return e === "ready" || e === "failed" ? e : "generating";
}
function et(t) {
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
const v = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!v || Object.keys(v).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const w = v.isPlainRecord, M = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const rt = M.resolveAssetUrl;
function zt(t) {
  return t && typeof t.meta.intro == "string" ? t.meta.intro.trim() : "";
}
function nt(t, e) {
  const n = e.trim(), r = String(t || "").trim().split(/\n{2,}/).map(
    (i) => i.split(`
`).filter((o) => !_t(o, n)).join(`
`).trim()
  ).filter(Boolean);
  return r.filter((i, o) => i !== r[o - 1]).join(`

`);
}
function Bt(t) {
  return it(t);
}
function it(t) {
  const e = t.blocks.flatMap((n) => {
    if (n.type === "text") {
      const r = nt(
        n.text,
        t.title
      );
      return r ? [r] : [];
    }
    return n.artifacts.map(ot).filter((r) => !!r);
  });
  return t.title && e.unshift(`# ${t.title}`), e.join(`

`);
}
function ot(t) {
  const e = rt(
    String(t.url || t.previewUrl || "").trim()
  );
  if (t.status !== "ready" || !e)
    return "";
  const n = st(
    t.label || t.name || `素材 ${t.id}`
  ), r = `<${e.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll(" ", "%20")}>`;
  return t.kind === "image" ? `![${n}](${r})` : `[${n}](${r})`;
}
function st(t) {
  return String(t || "").replace(/[\\[\]]/g, "\\$&");
}
function at(t) {
  if (!w(t))
    return;
  const e = _(t.id);
  if (!e)
    return;
  const n = Array.isArray(t.blocks), r = n ? t.blocks.map(B).filter((o) => !!o).sort(G) : [], i = $(t.status);
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
    meta: w(t.meta) ? { ...t.meta } : {},
    blocks: r,
    createdAt: a(t.created_at),
    updatedAt: a(t.updated_at),
    completedAt: a(t.completed_at)
  };
}
function ut(t, e) {
  if (!e)
    return t;
  if (!t || t.id !== e.id)
    return e;
  const n = R(t.status, e.status);
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
    blocks: U(t.blocks, e.blocks)
  };
}
function Ut(t, e) {
  if (!w(e))
    return t;
  const n = at(e.document);
  let r = ut(t, n);
  const i = _(e.document_id) || n?.id || 0;
  if (!r || i && r.id !== i)
    return r;
  const o = B(e.block);
  if (o) {
    const d = U(r.blocks, [o]);
    r = {
      ...r,
      blocks: d,
      blockCount: Math.max(r.blockCount, d.length)
    };
  }
  const s = _(e.block_id) || o?.id || 0, u = K(e.artifacts), c = a(e.event).toLowerCase();
  c === "text_delta" && s && (r = ft(r, s, {
    revision: m(e.revision),
    delta: a(e.delta, !1)
  })), s && (r = V(r, s, (d) => ({
    ...d,
    status: H(
      d.status,
      pt(c, d.status)
    ),
    artifacts: u.length > 0 ? J(d.artifacts, u) : d.artifacts,
    meta: {
      ...d.meta,
      ...e.progress == null ? {} : { progress: e.progress },
      ...a(e.text) ? { progress_text: a(e.text) } : {}
    }
  })));
  const E = a(e.status);
  return c === "document_content_complete" ? r = {
    ...r,
    status: R(
      r.status,
      $(E || "generating")
    )
  } : c === "document_complete" && (r = {
    ...r,
    status: R(
      r.status,
      $(E || "ready")
    ),
    pendingJobCount: 0
  }), r;
}
function ct(t) {
  return !t || P(t.status) ? !1 : t.status === "writing" || t.status === "generating" || t.pendingJobCount > 0 || t.blocks.some(
    (e) => e.type === "media" && e.status !== "failed" && !lt(e)
  );
}
function lt(t) {
  return t.type === "media" && t.artifacts.length > 0 && t.artifacts.every(
    (e) => e.status === "ready" && !!String(e.url || e.previewUrl || "").trim()
  );
}
function Vt(t) {
  return !!(t && (!t.hydrated || ct(t) || t.blocks.some(
    (e) => e.meta.stream_out_of_sync === !0
  )));
}
function B(t) {
  if (!w(t))
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
    mediaKind: bt(t.media_kind),
    text: a(t.text, !1),
    status: wt(t.status, n),
    meta: w(t.meta) ? { ...t.meta } : {},
    artifacts: K(t.artifacts)
  };
}
function U(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id), o = i ? mt(i.meta, r.meta) : r.meta;
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        text: dt(i, r),
        status: H(i.status, r.status),
        meta: o,
        artifacts: J(i.artifacts, r.artifacts)
      } : r
    );
  }
  return Array.from(n.values()).sort(G);
}
function dt(t, e) {
  const n = m(t.meta.stream_revision), r = m(e.meta.stream_revision);
  return n > r ? t.text : e.text || t.text;
}
function ft(t, e, n) {
  return !n.revision || !n.delta ? t : V(t, e, (r) => {
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
function mt(t, e) {
  const n = { ...t, ...e }, r = m(t.stream_revision), i = m(e.stream_revision);
  return r > i ? (n.stream_revision = r, n) : (i >= r && i > 0 && delete n.stream_out_of_sync, n);
}
function V(t, e, n) {
  return {
    ...t,
    blocks: t.blocks.map(
      (r) => r.id === e ? n(r) : r
    )
  };
}
function K(t) {
  return z({ artifacts: Array.isArray(t) ? t : [] });
}
function J(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id);
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        fileID: r.fileID || i.fileID,
        status: gt(i.status, r.status),
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
function G(t, e) {
  return t.seq - e.seq || t.id - e.id;
}
function pt(t, e) {
  return t === "artifact_ready" ? "ready" : t === "artifact_failed" ? "failed" : t === "artifact_progress" ? "generating" : e;
}
function R(t, e) {
  return L(e) >= L(t) ? e : t;
}
function L(t) {
  return t === "failed" ? 3 : t === "ready" || t === "partial_failed" ? 2 : t === "generating" ? 1 : 0;
}
function P(t) {
  return t === "ready" || t === "partial_failed" || t === "failed";
}
function H(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function gt(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function _t(t, e) {
  if (!e)
    return !1;
  const n = t.trim().match(/^#{1,6}\s+(.+)$/);
  return !!(n && n[1].trim() === e);
}
function $(t) {
  const e = a(t).toLowerCase();
  return e === "generating" || e === "ready" || e === "partial_failed" || e === "failed" ? e : "writing";
}
function wt(t, e) {
  const n = a(t).toLowerCase();
  return n === "generating" || n === "failed" ? n : e === "media" && !n ? "generating" : "ready";
}
function bt(t) {
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
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const S = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!S || Object.keys(S).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const W = S.isPlainRecord;
function A(t) {
  return W(t) ? { ...t } : {};
}
function Kt(t) {
  return W(t) && Object.keys(t).length > 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const F = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const ht = F.isPlainRecord;
function N(...t) {
  for (const e of t) {
    const n = yt(e);
    if (n)
      return n;
  }
  return "";
}
function yt(t) {
  if (typeof t == "string" || typeof t == "number") {
    const e = String(t).trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    return e && Number(e[1]) > 0 && Number(e[2]) > 0 ? `${e[1]} / ${e[2]}` : "";
  }
  return Array.isArray(t) ? N(...t) : ht(t) ? N(...Object.values(t)) : "";
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output", "@/lib/stream"]);
const I = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const k = I.isPlainRecord, T = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!T || Object.keys(T).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const f = T.streamValueText, X = {
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
function Q(t) {
  const e = A(t), n = f(e.event).toLowerCase();
  if (!St(n))
    return;
  const r = k(e.meta) ? e.meta : {}, i = k(r.tool_params) ? r.tool_params : {}, o = f(r.tool_name), s = f(r.tool_call_id || o);
  if (!s)
    return;
  const u = Ct(r.tool_kind, o), c = Ft(n, r.tool_status);
  return {
    id: s,
    title: f(r.tool_title) || Dt(u) || o || "工具调用",
    kind: u,
    status: c,
    text: kt(e.text, u, c, o),
    error: f(e.error),
    progress: Nt(e.progress ?? r.progress ?? r.percent),
    count: It(r.tool_count),
    aspectRatio: N(Object.values(i)),
    anchorText: f(e.anchor_text),
    output: e
  };
}
function Ct(t, e) {
  const n = f(t).toLowerCase();
  if (n)
    return n;
  const r = e.toLowerCase();
  return r.includes("knowledge") ? "knowledge" : xt(r) ? "skill" : "";
}
function kt(t, e, n, r) {
  const i = f(t);
  return At(i) ? e === "knowledge" ? n === "succeeded" ? Mt(r) : "正在读取知识库" : e === "skill" ? vt(r, n) : i : i;
}
function At(t) {
  return t === "内容生成完成" || t === "内容生成中，请稍后";
}
function Dt(t) {
  return t === "knowledge" ? "知识库" : t === "skill" ? "技能调用" : "";
}
function xt(t) {
  return t.startsWith("skill_") || !!X[t];
}
function vt(t, e) {
  const n = e === "succeeded" ? "完成" : "中";
  return `${X[t.toLowerCase()] || "技能调用"}${n}`;
}
function Mt(t) {
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
function Jt(t) {
  const e = A(t);
  return Array.isArray(e.activities) ? e.activities.map(Q).filter((n) => !!n) : [];
}
function Rt(t, e) {
  const n = t ? [...t] : [], r = n.findIndex((i) => i.id === e.id);
  return r < 0 ? [...n, e] : (n[r] = $t(n[r], e), n);
}
function Gt(t, e) {
  return e.reduce(Rt, t || []);
}
function $t(t, e) {
  return {
    ...t,
    ...e,
    text: e.text || t.text,
    error: e.error || t.error,
    count: e.count || t.count,
    aspectRatio: e.aspectRatio || t.aspectRatio,
    anchorText: e.anchorText || t.anchorText,
    progress: Tt(t.progress, e.progress),
    output: {
      ...t.output,
      ...e.output,
      meta: Ot(t.output.meta, e.output.meta)
    }
  };
}
function St(t) {
  return ["tool_start", "tool_progress", "tool_result", "tool_error"].includes(
    t
  );
}
function Ft(t, e) {
  const n = f(e).toLowerCase();
  return t === "tool_error" || n === "failed" ? "failed" : t === "tool_result" || n === "succeeded" ? "succeeded" : "running";
}
function Nt(t) {
  if (t == null || t === "")
    return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.max(0, Math.min(100, Math.round(e))) : null;
}
function It(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e < 1 ? 1 : Math.min(8, Math.floor(e));
}
function Tt(t, e) {
  return t == null ? e : e == null ? t : Math.max(t, e);
}
function Ot(t, e) {
  return {
    ...k(t) ? t : {},
    ...k(e) ? e : {}
  };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/runtime-stream-output", "@/lib/stream"]);
const O = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!O || Object.keys(O).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const jt = O.requestRaw, b = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!b || Object.keys(b).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const C = b.isPlainRecord, qt = b.normalizeRuntimeFrameOutput, Pt = b.resolveRuntimeFrameCancelable, j = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const l = j.streamValueText;
async function Ht(t, e) {
  const n = await jt(t, "get", { request_id: e });
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
function Wt(t) {
  const e = qt(t?.output, t), n = A(e), r = l(n.semantic_event || n.event).toLowerCase(), i = l(n.text), o = t?.type === "result", s = Number(t?.status || 0) === 2, u = r === "delta" || !r && !!i && !o, c = C(n.meta) ? n.meta : {};
  return {
    requestID: l(t?.request_id),
    streamID: l(t?.stream_id),
    event: r,
    delta: u ? i : "",
    finalText: o ? i : "",
    output: n,
    activity: Q(n),
    error: l(n.error || (s ? t?.msg : "")),
    cancelable: Pt(t),
    runVersion: Number(c.run_version || 0),
    assistantMessageID: Number(c.assistant_message_id || 0),
    finished: o,
    failed: s
  };
}
function Xt(t) {
  return ["success", "fail", "canceled"].includes(t);
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const q = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!q || Object.keys(q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const h = q.isPlainRecord, Et = 8;
function Qt(t) {
  if (!h(t) || !h(t.interaction))
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
function Yt(t) {
  if (!h(t) || !Array.isArray(t.suggestions))
    return [];
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t.suggestions) {
    if (!h(r))
      continue;
    const i = g(r.label), o = g(r.prompt);
    if (!(!i || !o || e.has(o)) && (e.add(o), n.push({ label: i, prompt: o }), n.length === Et))
      break;
  }
  return n;
}
function Zt(t) {
  return h(t) ? g(t.message) : "";
}
function te(t, e) {
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
export {
  zt as a,
  Lt as b,
  Jt as c,
  at as d,
  nt as e,
  lt as f,
  N as g,
  Bt as h,
  ct as i,
  Kt as j,
  ut as k,
  Wt as l,
  Gt as m,
  A as n,
  Ut as o,
  Rt as p,
  Xt as q,
  z as r,
  Ht as s,
  Vt as t,
  Qt as u,
  te as v,
  Yt as w,
  Zt as x
};
