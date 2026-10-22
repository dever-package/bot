await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const x = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!x || Object.keys(x).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const z = x.isPlainRecord;
function C(t) {
  return z(t) ? { ...t } : {};
}
function zt(t) {
  return z(t) && Object.keys(t).length > 0;
}
await window.DeverFront?.ensureCompat?.(["@/lib/runtime-stream-output"]);
const D = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Y = D.isPlainRecord;
function v(...t) {
  for (const e of t) {
    const r = Z(e);
    if (r)
      return r;
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
const k = M.isPlainRecord, $ = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!$ || Object.keys($).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const f = $.streamValueText, B = {
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
  const e = C(t), r = f(e.event).toLowerCase();
  if (!ct(r))
    return;
  const n = k(e.meta) ? e.meta : {}, i = k(n.tool_params) ? n.tool_params : {}, o = f(n.tool_name), s = f(n.tool_call_id || o);
  if (!s)
    return;
  const u = tt(n.tool_kind, o), c = lt(r, n.tool_status);
  return {
    id: s,
    title: f(n.tool_title) || nt(u) || o || "工具调用",
    kind: u,
    status: c,
    text: et(e.text, u, c, o),
    error: f(e.error),
    progress: dt(
      e.progress ?? n.progress ?? n.percent
    ),
    count: ft(n.tool_count),
    aspectRatio: v(Object.values(i)),
    anchorText: f(e.anchor_text),
    output: e
  };
}
function tt(t, e) {
  const r = f(t).toLowerCase();
  if (r)
    return r;
  const n = e.toLowerCase();
  return n.includes("knowledge") ? "knowledge" : it(n) ? "skill" : "";
}
function et(t, e, r, n) {
  const i = f(t);
  return rt(i) ? e === "knowledge" ? r === "succeeded" ? st(n) : "正在读取知识库" : e === "skill" ? ot(n, r) : i : i;
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
  const r = e === "succeeded" ? "完成" : "中";
  return `${B[t.toLowerCase()] || "技能调用"}${r}`;
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
function Bt(t) {
  const e = C(t);
  return Array.isArray(e.activities) ? e.activities.map(U).filter((r) => !!r) : [];
}
function at(t, e) {
  const r = t ? [...t] : [], n = r.findIndex((i) => i.id === e.id);
  return n < 0 ? [...r, e] : (r[n] = ut(r[n], e), r);
}
function Ut(t, e) {
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
  const r = f(e).toLowerCase();
  return t === "tool_error" || r === "failed" ? "failed" : r === "running" ? "running" : t === "tool_result" || t === "interaction" || r === "succeeded" ? "succeeded" : "running";
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
const R = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!R || Object.keys(R).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const b = R.isPlainRecord, gt = 8;
function Vt(t) {
  if (!b(t) || !b(t.interaction))
    return;
  const e = t.interaction, r = g(e.id), n = Array.isArray(e.fields) ? e.fields : [];
  if (!(!r || n.length === 0))
    return {
      ...e,
      id: r,
      type: g(e.type) || "form",
      presentation: g(e.presentation),
      title: g(e.title) || "需要补充信息",
      description: g(e.description),
      fields: n
    };
}
function Kt(t) {
  if (!b(t) || !Array.isArray(t.suggestions))
    return [];
  const e = /* @__PURE__ */ new Set(), r = [];
  for (const n of t.suggestions) {
    if (!b(n))
      continue;
    const i = g(n.label), o = g(n.prompt);
    if (!(!i || !o || e.has(o)) && (e.add(o), r.push({ label: i, prompt: o }), r.length === gt))
      break;
  }
  return r;
}
function Jt(t) {
  return b(t) ? g(t.message) : "";
}
function Gt(t, e) {
  for (const r of t) {
    if (r.role !== "user")
      continue;
    const n = r.content?.interaction_response;
    if (n?.interaction_id === e)
      return { data: n.data };
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
function Ht(t) {
  const e = {};
  for (const r of V(t)) {
    if (r.status !== "ready" || !r.url)
      continue;
    const n = yt(r.kind), i = e[n], o = Array.isArray(i) ? i : [];
    e[n] = [
      ...o,
      {
        id: r.fileID,
        name: r.name || r.label,
        url: r.url,
        thumbnail: r.previewUrl,
        mime: r.mime,
        size: r.size
      }
    ];
  }
  return e;
}
function _t(t) {
  if (!F(t))
    return null;
  const e = A(t.artifact_id ?? t.id);
  return e ? {
    id: e,
    fileID: A(t.file_id ?? t.fileID),
    displayNo: Math.floor(A(t.display_no ?? t.displayNo)),
    label: p(t.label) || `素材 ${e}`,
    name: p(t.name),
    kind: wt(t.kind),
    status: bt(t.status),
    error: p(t.error),
    url: p(t.url || t.open_url),
    previewUrl: p(t.preview_url || t.previewUrl || t.url),
    mime: p(t.mime),
    size: A(t.size),
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
function yt(t) {
  return t === "image" ? "images" : t === "video" ? "videos" : t === "audio" ? "audios" : "files";
}
function A(t) {
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
const y = N.isPlainRecord, I = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ht = I.resolveAssetUrl;
function Wt(t) {
  return t && typeof t.meta.intro == "string" ? t.meta.intro.trim() : "";
}
function Xt(t, e) {
  if (!t || !e) return e;
  const r = t.title.trim() || "内容", n = {
    writing: `${r}正在生成。`,
    generating: `${r}正文已完成，所需素材正在生成。`,
    ready: `${r}已完成。`,
    partial_failed: `${r}正文已完成，但部分素材未能生成。`,
    failed: `${r}生成失败，请重试或调整要求。`
  };
  return Object.values(n).includes(e) ? n[t.status] : e;
}
function Ct(t, e) {
  const r = e.trim(), n = String(t || "").trim().split(/\n{2,}/).map(
    (i) => i.split(`
`).filter((o) => !Tt(o, r)).join(`
`).trim()
  ).filter(Boolean);
  return n.filter((i, o) => i !== n[o - 1]).join(`

`);
}
function Qt(t) {
  return At(t);
}
function At(t) {
  const e = t.blocks.flatMap((r) => {
    if (r.type === "text") {
      const n = Ct(
        r.text,
        t.title
      );
      return n ? [n] : [];
    }
    return r.artifacts.map(kt).filter((n) => !!n);
  });
  return t.title && e.unshift(`# ${t.title}`), e.join(`

`);
}
function kt(t) {
  const e = ht(
    String(t.url || t.previewUrl || "").trim()
  );
  if (t.status !== "ready" || !e)
    return "";
  const r = xt(
    t.label || t.name || `素材 ${t.id}`
  ), n = `<${e.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll(" ", "%20")}>`;
  return t.kind === "image" ? `![${r}](${n})` : `[${r}](${n})`;
}
function xt(t) {
  return String(t || "").replace(/[\\[\]]/g, "\\$&");
}
function Dt(t) {
  if (!y(t))
    return;
  const e = _(t.id);
  if (!e)
    return;
  const r = Array.isArray(t.blocks), n = r ? t.blocks.map(K).filter((o) => !!o).sort(X) : [], i = O(t.status);
  return {
    id: e,
    hydrated: r,
    sessionID: _(t.session_id),
    messageID: _(t.message_id),
    runID: _(t.run_id),
    title: a(t.title),
    status: i,
    blockCount: m(t.block_count) || n.length,
    pendingJobCount: q(i) ? 0 : m(t.pending_job_count),
    meta: y(t.meta) ? { ...t.meta } : {},
    blocks: n,
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
  const r = T(t.status, e.status);
  return {
    ...t,
    ...e,
    sessionID: e.sessionID || t.sessionID,
    messageID: e.messageID || t.messageID,
    runID: e.runID || t.runID,
    title: e.title || t.title,
    status: r,
    pendingJobCount: q(r) ? 0 : e.pendingJobCount,
    hydrated: t.hydrated || e.hydrated,
    meta: { ...t.meta, ...e.meta },
    blocks: J(t.blocks, e.blocks)
  };
}
function Yt(t, e) {
  if (!y(e))
    return t;
  const r = Dt(e.document);
  let n = vt(t, r);
  const i = _(e.document_id) || r?.id || 0;
  if (!n || i && n.id !== i)
    return n;
  const o = K(e.block);
  if (o) {
    const d = J(n.blocks, [o]);
    n = {
      ...n,
      blocks: d,
      blockCount: Math.max(n.blockCount, d.length)
    };
  }
  const s = _(e.block_id) || o?.id || 0, u = H(e.artifacts), c = a(e.event).toLowerCase();
  c === "text_delta" && s && (n = St(n, s, {
    revision: m(e.revision),
    delta: a(e.delta, !1)
  })), s && (n = G(n, s, (d) => ({
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
  return c === "document_content_complete" ? n = {
    ...n,
    status: T(
      n.status,
      O(E || "generating")
    )
  } : c === "document_complete" && (n = {
    ...n,
    status: T(
      n.status,
      O(E || "ready")
    ),
    pendingJobCount: 0
  }), n;
}
function Mt(t) {
  return !t || q(t.status) ? !1 : t.status === "writing" || t.status === "generating" || t.pendingJobCount > 0 || t.blocks.some(
    (e) => e.type === "media" && e.status !== "failed" && !$t(e)
  );
}
function $t(t) {
  return t.type === "media" && t.artifacts.length > 0 && t.artifacts.every(
    (e) => e.status === "ready" && !!String(e.url || e.previewUrl || "").trim()
  );
}
function Zt(t) {
  return !!(t && (!t.hydrated || Mt(t) || t.blocks.some(
    (e) => e.meta.stream_out_of_sync === !0
  )));
}
function K(t) {
  if (!y(t))
    return null;
  const e = _(t.id);
  if (!e)
    return null;
  const r = a(t.type) === "media" ? "media" : "text";
  return {
    id: e,
    seq: m(t.seq),
    type: r,
    format: a(t.format) || (r === "media" ? "artifact" : "markdown"),
    mediaKind: jt(t.media_kind),
    text: a(t.text, !1),
    status: Ot(t.status, r),
    meta: y(t.meta) ? { ...t.meta } : {},
    artifacts: H(t.artifacts)
  };
}
function J(t, e) {
  const r = new Map(t.map((n) => [n.id, n]));
  for (const n of e) {
    const i = r.get(n.id), o = i ? Ft(i.meta, n.meta) : n.meta;
    r.set(
      n.id,
      i ? {
        ...i,
        ...n,
        text: Rt(i, n),
        status: Q(i.status, n.status),
        meta: o,
        artifacts: W(i.artifacts, n.artifacts)
      } : n
    );
  }
  return Array.from(r.values()).sort(X);
}
function Rt(t, e) {
  const r = m(t.meta.stream_revision), n = m(e.meta.stream_revision);
  return r > n ? t.text : e.text || t.text;
}
function St(t, e, r) {
  return !r.revision || !r.delta ? t : G(t, e, (n) => {
    if (n.type !== "text")
      return n;
    const i = m(n.meta.stream_revision);
    if (r.revision <= i)
      return n;
    if (r.revision !== i + 1)
      return {
        ...n,
        meta: { ...n.meta, stream_out_of_sync: !0 }
      };
    const o = { ...n.meta, stream_revision: r.revision };
    return delete o.stream_out_of_sync, { ...n, text: `${n.text}${r.delta}`, meta: o };
  });
}
function Ft(t, e) {
  const r = { ...t, ...e }, n = m(t.stream_revision), i = m(e.stream_revision);
  return n > i ? (r.stream_revision = n, r) : (i >= n && i > 0 && delete r.stream_out_of_sync, r);
}
function G(t, e, r) {
  return {
    ...t,
    blocks: t.blocks.map(
      (n) => n.id === e ? r(n) : n
    )
  };
}
function H(t) {
  return V({ artifacts: Array.isArray(t) ? t : [] });
}
function W(t, e) {
  const r = new Map(t.map((n) => [n.id, n]));
  for (const n of e) {
    const i = r.get(n.id);
    r.set(
      n.id,
      i ? {
        ...i,
        ...n,
        fileID: n.fileID || i.fileID,
        status: It(i.status, n.status),
        url: n.url || i.url,
        previewUrl: n.previewUrl || i.previewUrl,
        mime: n.mime || i.mime,
        size: n.size || i.size
      } : n
    );
  }
  return Array.from(r.values()).sort(
    (n, i) => n.displayNo - i.displayNo || n.id - i.id
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
function q(t) {
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
  const r = t.trim().match(/^#{1,6}\s+(.+)$/);
  return !!(r && r[1].trim() === e);
}
function O(t) {
  const e = a(t).toLowerCase();
  return e === "generating" || e === "ready" || e === "partial_failed" || e === "failed" ? e : "writing";
}
function Ot(t, e) {
  const r = a(t).toLowerCase();
  return r === "generating" || r === "failed" ? r : e === "media" && !r ? "generating" : "ready";
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
  const r = t == null ? "" : String(t);
  return e ? r.trim() : r;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/runtime-stream-output", "@/lib/stream"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Pt = j.requestRaw, h = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const w = h.isPlainRecord, qt = h.normalizeRuntimeFrameOutput, Et = h.resolveRuntimeFrameCancelable, P = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!P || Object.keys(P).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const l = P.streamValueText;
function Lt(t) {
  const r = C(t).runtime_status;
  if (!(!w(r) || r.type !== "generation_start" || typeof r.text != "string" || !r.text.trim()))
    return { type: "generation_start", text: r.text.trim() };
}
async function te(t, e) {
  const r = await Pt(t, "get", { request_id: e });
  if (!w(r))
    throw new Error("读取智能体运行状态失败");
  const n = Number(r.code || 0), i = Number(r.status || 0);
  if (n !== 0 || i === 2)
    throw new Error(
      l(r.message || r.msg) || "读取智能体运行状态失败"
    );
  const o = w(r.data) ? r.data : {}, s = w(o.run) ? o.run : {}, u = C(s.output);
  return {
    requestID: l(s.request_id) || e,
    status: l(s.status).toLowerCase(),
    runVersion: Number(s.version || 0),
    text: l(u.text),
    output: u,
    error: l(s.error || u.error)
  };
}
function ee(t) {
  const e = qt(t?.output, t), r = C(e), n = l(r.semantic_event || r.event).toLowerCase(), i = l(r.text), o = t?.type === "result", s = Number(t?.status || 0) === 2, u = n === "delta" || !n && !!i && !o, c = w(r.meta) ? r.meta : {};
  return {
    requestID: l(t?.request_id),
    streamID: l(t?.stream_id),
    event: n,
    delta: u ? i : "",
    finalText: o ? i : "",
    output: r,
    activity: U(r),
    runtimeStatus: Lt(r),
    error: l(r.error || (s ? t?.msg : "")),
    cancelable: Et(t),
    runVersion: Number(c.run_version || 0),
    assistantMessageID: Number(c.assistant_message_id || 0),
    finished: o,
    failed: s
  };
}
function re(t) {
  return ["success", "fail", "canceled"].includes(t);
}
export {
  Wt as a,
  Ht as b,
  Xt as c,
  Jt as d,
  Bt as e,
  Dt as f,
  Ct as g,
  $t as h,
  Mt as i,
  v as j,
  Qt as k,
  zt as l,
  Ut as m,
  C as n,
  vt as o,
  ee as p,
  Yt as q,
  V as r,
  at as s,
  re as t,
  te as u,
  Zt as v,
  Lt as w,
  Vt as x,
  Gt as y,
  Kt as z
};
