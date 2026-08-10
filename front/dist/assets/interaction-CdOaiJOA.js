import { a as g, m as T } from "./stream-Y1y6FALE.js";
import { m as M } from "./in-flight-request-DlB1DJg0.js";
const k = g.isPlainRecord;
function P(t) {
  return !k(t) || !Array.isArray(t.artifacts) ? [] : t.artifacts.map(E).filter((e) => !!e);
}
function Lt(t) {
  const e = {};
  for (const n of P(t)) {
    if (n.status !== "ready" || !n.url)
      continue;
    const r = G(n.kind), i = e[r], s = Array.isArray(i) ? i : [];
    e[r] = [
      ...s,
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
function E(t) {
  if (!k(t))
    return null;
  const e = x(t.artifact_id ?? t.id);
  return e ? {
    id: e,
    fileID: x(t.file_id ?? t.fileID),
    displayNo: Math.floor(x(t.display_no ?? t.displayNo)),
    label: p(t.label) || `素材 ${e}`,
    name: p(t.name),
    kind: K(t.kind),
    status: J(t.status),
    error: p(t.error),
    url: p(t.url || t.open_url),
    previewUrl: p(t.preview_url || t.previewUrl || t.url),
    mime: p(t.mime),
    size: x(t.size),
    meta: k(t.meta) ? { ...t.meta } : {}
  } : null;
}
function K(t) {
  const e = p(t).toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : "file";
}
function J(t) {
  const e = p(t).toLowerCase();
  return e === "ready" || e === "failed" ? e : "generating";
}
function G(t) {
  return t === "image" ? "images" : t === "video" ? "videos" : t === "audio" ? "audios" : "files";
}
function x(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function p(t) {
  return t == null ? "" : String(t).trim();
}
const h = g.isPlainRecord, H = M.resolveAssetUrl;
function zt(t) {
  return t && typeof t.meta.intro == "string" ? t.meta.intro.trim() : "";
}
function W(t, e) {
  const n = e.trim(), r = String(t || "").trim().split(/\n{2,}/).map(
    (i) => i.split(`
`).filter((s) => !ut(s, n)).join(`
`).trim()
  ).filter(Boolean);
  return r.filter((i, s) => i !== r[s - 1]).join(`

`);
}
function Bt(t) {
  return X(t);
}
function X(t) {
  const e = t.blocks.flatMap((n) => {
    if (n.type === "text") {
      const r = W(
        n.text,
        t.title
      );
      return r ? [r] : [];
    }
    return n.artifacts.map(Q).filter((r) => !!r);
  });
  return t.title && e.unshift(`# ${t.title}`), e.join(`

`);
}
function Q(t) {
  const e = H(
    String(t.url || t.previewUrl || "").trim()
  );
  if (t.status !== "ready" || !e)
    return "";
  const n = Y(
    t.label || t.name || `素材 ${t.id}`
  ), r = `<${e.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll(" ", "%20")}>`;
  return t.kind === "image" ? `![${n}](${r})` : `[${n}](${r})`;
}
function Y(t) {
  return String(t || "").replace(/[\\[\]]/g, "\\$&");
}
function Z(t) {
  if (!h(t))
    return;
  const e = y(t.id);
  if (!e)
    return;
  const n = Array.isArray(t.blocks), r = n ? t.blocks.map(L).filter((s) => !!s).sort(O) : [], i = R(t.status);
  return {
    id: e,
    hydrated: n,
    sessionID: y(t.session_id),
    messageID: y(t.message_id),
    runID: y(t.run_id),
    title: a(t.title),
    status: i,
    blockCount: m(t.block_count) || r.length,
    pendingJobCount: N(i) ? 0 : m(t.pending_job_count),
    meta: h(t.meta) ? { ...t.meta } : {},
    blocks: r,
    createdAt: a(t.created_at),
    updatedAt: a(t.updated_at),
    completedAt: a(t.completed_at)
  };
}
function tt(t, e) {
  if (!e)
    return t;
  if (!t || t.id !== e.id)
    return e;
  const n = D(t.status, e.status);
  return {
    ...t,
    ...e,
    sessionID: e.sessionID || t.sessionID,
    messageID: e.messageID || t.messageID,
    runID: e.runID || t.runID,
    title: e.title || t.title,
    status: n,
    pendingJobCount: N(n) ? 0 : e.pendingJobCount,
    hydrated: t.hydrated || e.hydrated,
    meta: { ...t.meta, ...e.meta },
    blocks: z(t.blocks, e.blocks)
  };
}
function qt(t, e) {
  if (!h(e))
    return t;
  const n = Z(e.document);
  let r = tt(t, n);
  const i = y(e.document_id) || n?.id || 0;
  if (!r || i && r.id !== i)
    return r;
  const s = L(e.block);
  if (s) {
    const l = z(r.blocks, [s]);
    r = {
      ...r,
      blocks: l,
      blockCount: Math.max(r.blockCount, l.length)
    };
  }
  const o = y(e.block_id) || s?.id || 0, u = q(e.artifacts), c = a(e.event).toLowerCase();
  c === "text_delta" && o && (r = it(r, o, {
    revision: m(e.revision),
    delta: a(e.delta, !1)
  })), o && (r = B(r, o, (l) => ({
    ...l,
    status: U(
      l.status,
      ot(c, l.status)
    ),
    artifacts: u.length > 0 ? F(l.artifacts, u) : l.artifacts,
    meta: {
      ...l.meta,
      ...e.progress == null ? {} : { progress: e.progress },
      ...a(e.text) ? { progress_text: a(e.text) } : {}
    }
  })));
  const $ = a(e.status);
  return c === "document_content_complete" ? r = {
    ...r,
    status: D(
      r.status,
      R($ || "generating")
    )
  } : c === "document_complete" && (r = {
    ...r,
    status: D(
      r.status,
      R($ || "ready")
    ),
    pendingJobCount: 0
  }), r;
}
function et(t) {
  return !t || N(t.status) ? !1 : t.status === "writing" || t.status === "generating" || t.pendingJobCount > 0 || t.blocks.some(
    (e) => e.type === "media" && e.status !== "failed" && !rt(e)
  );
}
function rt(t) {
  return t.type === "media" && t.artifacts.length > 0 && t.artifacts.every(
    (e) => e.status === "ready" && !!String(e.url || e.previewUrl || "").trim()
  );
}
function Ft(t) {
  return !!(t && (!t.hydrated || et(t) || t.blocks.some(
    (e) => e.meta.stream_out_of_sync === !0
  )));
}
function L(t) {
  if (!h(t))
    return null;
  const e = y(t.id);
  if (!e)
    return null;
  const n = a(t.type) === "media" ? "media" : "text";
  return {
    id: e,
    seq: m(t.seq),
    type: n,
    format: a(t.format) || (n === "media" ? "artifact" : "markdown"),
    mediaKind: ft(t.media_kind),
    text: a(t.text, !1),
    status: ct(t.status, n),
    meta: h(t.meta) ? { ...t.meta } : {},
    artifacts: q(t.artifacts)
  };
}
function z(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id), s = i ? st(i.meta, r.meta) : r.meta;
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        text: nt(i, r),
        status: U(i.status, r.status),
        meta: s,
        artifacts: F(i.artifacts, r.artifacts)
      } : r
    );
  }
  return Array.from(n.values()).sort(O);
}
function nt(t, e) {
  const n = m(t.meta.stream_revision), r = m(e.meta.stream_revision);
  return n > r ? t.text : e.text || t.text;
}
function it(t, e, n) {
  return !n.revision || !n.delta ? t : B(t, e, (r) => {
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
    const s = { ...r.meta, stream_revision: n.revision };
    return delete s.stream_out_of_sync, { ...r, text: `${r.text}${n.delta}`, meta: s };
  });
}
function st(t, e) {
  const n = { ...t, ...e }, r = m(t.stream_revision), i = m(e.stream_revision);
  return r > i ? (n.stream_revision = r, n) : (i >= r && i > 0 && delete n.stream_out_of_sync, n);
}
function B(t, e, n) {
  return {
    ...t,
    blocks: t.blocks.map(
      (r) => r.id === e ? n(r) : r
    )
  };
}
function q(t) {
  return P({ artifacts: Array.isArray(t) ? t : [] });
}
function F(t, e) {
  const n = new Map(t.map((r) => [r.id, r]));
  for (const r of e) {
    const i = n.get(r.id);
    n.set(
      r.id,
      i ? {
        ...i,
        ...r,
        fileID: r.fileID || i.fileID,
        status: at(i.status, r.status),
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
function O(t, e) {
  return t.seq - e.seq || t.id - e.id;
}
function ot(t, e) {
  return t === "artifact_ready" ? "ready" : t === "artifact_failed" ? "failed" : t === "artifact_progress" ? "generating" : e;
}
function D(t, e) {
  return I(e) >= I(t) ? e : t;
}
function I(t) {
  return t === "failed" ? 3 : t === "ready" || t === "partial_failed" ? 2 : t === "generating" ? 1 : 0;
}
function N(t) {
  return t === "ready" || t === "partial_failed" || t === "failed";
}
function U(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function at(t, e) {
  return t !== "generating" && e === "generating" ? t : e;
}
function ut(t, e) {
  if (!e)
    return !1;
  const n = t.trim().match(/^#{1,6}\s+(.+)$/);
  return !!(n && n[1].trim() === e);
}
function R(t) {
  const e = a(t).toLowerCase();
  return e === "generating" || e === "ready" || e === "partial_failed" || e === "failed" ? e : "writing";
}
function ct(t, e) {
  const n = a(t).toLowerCase();
  return n === "generating" || n === "failed" ? n : e === "media" && !n ? "generating" : "ready";
}
function ft(t) {
  const e = a(t).toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : "file";
}
function y(t) {
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
const v = g.isPlainRecord;
function C(t) {
  return v(t) ? { ...t } : {};
}
function Ot(t) {
  return v(t) && Object.keys(t).length > 0;
}
const lt = g.isPlainRecord;
function S(...t) {
  for (const e of t) {
    const n = dt(e);
    if (n)
      return n;
  }
  return "";
}
function dt(t) {
  if (typeof t == "string" || typeof t == "number") {
    const e = String(t).trim().match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    return e && Number(e[1]) > 0 && Number(e[2]) > 0 ? `${e[1]} / ${e[2]}` : "";
  }
  return Array.isArray(t) ? S(...t) : lt(t) ? S(...Object.values(t)) : "";
}
const w = g.isPlainRecord, d = T.streamValueText, j = {
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
function V(t) {
  const e = C(t), n = d(e.event).toLowerCase();
  if (!wt(n))
    return;
  const r = w(e.meta) ? e.meta : {}, i = w(r.tool_params) ? r.tool_params : {}, s = d(r.tool_name), o = d(r.tool_call_id || s);
  if (!o)
    return;
  const u = mt(r.tool_kind, s), c = Ct(n, r.tool_status);
  return {
    id: o,
    title: d(r.tool_title) || _t(u) || s || "工具调用",
    kind: u,
    status: c,
    text: gt(e.text, u, c, s),
    error: d(e.error),
    progress: kt(e.progress ?? r.progress ?? r.percent),
    count: Dt(r.tool_count),
    aspectRatio: S(Object.values(i)),
    anchorText: d(e.anchor_text),
    output: e
  };
}
function mt(t, e) {
  const n = d(t).toLowerCase();
  if (n)
    return n;
  const r = e.toLowerCase();
  return r.includes("knowledge") ? "knowledge" : yt(r) ? "skill" : "";
}
function gt(t, e, n, r) {
  const i = d(t);
  return pt(i) ? e === "knowledge" ? n === "succeeded" ? At(r) : "正在读取知识库" : e === "skill" ? ht(r, n) : i : i;
}
function pt(t) {
  return t === "内容生成完成" || t === "内容生成中，请稍后";
}
function _t(t) {
  return t === "knowledge" ? "知识库" : t === "skill" ? "技能调用" : "";
}
function yt(t) {
  return t.startsWith("skill_") || !!j[t];
}
function ht(t, e) {
  const n = e === "succeeded" ? "完成" : "中";
  return `${j[t.toLowerCase()] || "技能调用"}${n}`;
}
function At(t) {
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
function Ut(t) {
  const e = C(t);
  return Array.isArray(e.activities) ? e.activities.map(V).filter((n) => !!n) : [];
}
function xt(t, e) {
  const n = t ? [...t] : [], r = n.findIndex((i) => i.id === e.id);
  return r < 0 ? [...n, e] : (n[r] = bt(n[r], e), n);
}
function vt(t, e) {
  return e.reduce(xt, t || []);
}
function bt(t, e) {
  return {
    ...t,
    ...e,
    text: e.text || t.text,
    error: e.error || t.error,
    count: e.count || t.count,
    aspectRatio: e.aspectRatio || t.aspectRatio,
    anchorText: e.anchorText || t.anchorText,
    progress: Rt(t.progress, e.progress),
    output: {
      ...t.output,
      ...e.output,
      meta: St(t.output.meta, e.output.meta)
    }
  };
}
function wt(t) {
  return ["tool_start", "tool_progress", "tool_result", "tool_error"].includes(
    t
  );
}
function Ct(t, e) {
  const n = d(e).toLowerCase();
  return t === "tool_error" || n === "failed" ? "failed" : t === "tool_result" || n === "succeeded" ? "succeeded" : "running";
}
function kt(t) {
  if (t == null || t === "")
    return null;
  const e = Number(t);
  return Number.isFinite(e) ? Math.max(0, Math.min(100, Math.round(e))) : null;
}
function Dt(t) {
  const e = Number(t);
  return !Number.isFinite(e) || e < 1 ? 1 : Math.min(8, Math.floor(e));
}
function Rt(t, e) {
  return t == null ? e : e == null ? t : Math.max(t, e);
}
function St(t, e) {
  return {
    ...w(t) ? t : {},
    ...w(e) ? e : {}
  };
}
const Nt = M.requestRaw, b = g.isPlainRecord, $t = g.normalizeRuntimeFrameOutput, It = g.resolveRuntimeFrameCancelable, f = T.streamValueText;
async function jt(t, e) {
  const n = await Nt(t, "get", { request_id: e });
  if (!b(n))
    throw new Error("读取智能体运行状态失败");
  const r = Number(n.code || 0), i = Number(n.status || 0);
  if (r !== 0 || i === 2)
    throw new Error(
      f(n.message || n.msg) || "读取智能体运行状态失败"
    );
  const s = b(n.data) ? n.data : {}, o = b(s.run) ? s.run : {}, u = C(o.output);
  return {
    requestID: f(o.request_id) || e,
    status: f(o.status).toLowerCase(),
    runVersion: Number(o.version || 0),
    text: f(u.text),
    output: u,
    error: f(o.error || u.error)
  };
}
function Vt(t) {
  const e = $t(t?.output, t), n = C(e), r = f(n.semantic_event || n.event).toLowerCase(), i = f(n.text), s = t?.type === "result", o = Number(t?.status || 0) === 2, u = r === "delta" || !r && !!i && !s, c = b(n.meta) ? n.meta : {};
  return {
    requestID: f(t?.request_id),
    streamID: f(t?.stream_id),
    event: r,
    delta: u ? i : "",
    finalText: s ? i : "",
    output: n,
    activity: V(n),
    error: f(n.error || (o ? t?.msg : "")),
    cancelable: It(t),
    runVersion: Number(c.run_version || 0),
    assistantMessageID: Number(c.assistant_message_id || 0),
    finished: s,
    failed: o
  };
}
function Et(t) {
  return ["success", "fail", "canceled"].includes(t);
}
const A = g.isPlainRecord, Tt = 8;
function Kt(t) {
  if (!A(t) || !A(t.interaction))
    return;
  const e = t.interaction, n = _(e.id), r = Array.isArray(e.fields) ? e.fields : [];
  if (!(!n || r.length === 0))
    return {
      ...e,
      id: n,
      type: _(e.type) || "form",
      presentation: _(e.presentation),
      title: _(e.title) || "需要补充信息",
      description: _(e.description),
      fields: r
    };
}
function Jt(t) {
  if (!A(t) || !Array.isArray(t.suggestions))
    return [];
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const r of t.suggestions) {
    if (!A(r))
      continue;
    const i = _(r.label), s = _(r.prompt);
    if (!(!i || !s || e.has(s)) && (e.add(s), n.push({ label: i, prompt: s }), n.length === Tt))
      break;
  }
  return n;
}
function Gt(t) {
  return A(t) ? _(t.message) : "";
}
function Ht(t, e) {
  for (const n of t) {
    if (n.role !== "user")
      continue;
    const r = n.content?.interaction_response;
    if (r?.interaction_id === e)
      return { data: r.data };
  }
}
function _(t) {
  return t == null ? "" : String(t).trim();
}
export {
  zt as a,
  Lt as b,
  Ut as c,
  Z as d,
  W as e,
  rt as f,
  S as g,
  Bt as h,
  et as i,
  Jt as j,
  Kt as k,
  Vt as l,
  xt as m,
  C as n,
  tt as o,
  qt as p,
  vt as q,
  P as r,
  Ot as s,
  Et as t,
  jt as u,
  Ft as v,
  Ht as w,
  Gt as x
};
