import { aa as ue, a8 as ce, a7 as de, C as U, L as Y, X as A, W as ye, V as be, $ as Z, _ as X, Z as ke, N as le, T as fe, aX as pe, F as _e, G as x, aY as Se, aZ as $e, a_ as Ie, a as Ce, a4 as Q, a$ as Re, b0 as Ee, aO as ee, l as te, aW as Ae, f as Te, aS as Ne, b1 as qe, Y as Be, U as De, b2 as Me, b3 as Pe } from "./writing-reference-CGBoN4Mc.js";
import { $ as Ve, H as xe, Q as Fe, e as Oe, F as V } from "./asset-audio-preview-CsYcyVm8.js";
import { u as We, a1 as Le, a2 as Ue, b as ze, e as je, D as Ge, Y as Ke } from "./space-story-setting-reference-CenSO-Ot.js";
import { a as q, d as T, b as I, h as N } from "./file-kind-Cq3pESGF.js";
import { u as He } from "./space-node-runtime-694G12tD.js";
import { a as Je, y as Ye } from "./space-assistant-layout-B9KyeCM0.js";
import "./interaction-SMvIaTBF.js";
import { F as Ze } from "./node-detail-header-MEc7Zf1L.js";
function L(e, t) {
  const n = String(e || "");
  return n.trim() && n.trim() === String(t || "").trim() ? "" : n;
}
function Nt(e, t) {
  return !!L(e, t).trim();
}
function Xe(e, t, n) {
  if (!t?.trim())
    return e;
  const s = L(e.prompt, t), r = e.promptContent, o = ue(r), c = r?.parts.filter((_) => _.type === "text").map((_) => _.text).join(""), l = [o, c].some(
    (_) => !!_?.trim() && !L(_, t)
  ), a = l ? ce(
    s,
    de(r)
  ) : r, i = l && !a?.parts.length ? void 0 : a;
  let u = e.paramValues;
  const p = n ? u?.[n] : void 0;
  if (n && typeof p == "string") {
    const _ = L(p, t);
    _ !== p && (u = { ...u, [n]: _ });
  }
  return s === e.prompt && i === r && u === e.paramValues ? e : { ...e, prompt: s, promptContent: i, paramValues: u };
}
function qt(e, t, n) {
  const s = Xe(
    e,
    t,
    n
  ), r = String(t || "");
  if (!r.trim())
    return s;
  const o = ue(
    s.promptContent
  ), c = s.promptContent?.parts.filter((u) => u.type === "text").map((u) => u.text).join(""), l = s.prompt?.trim() ? s.prompt : c?.trim() ? o : r;
  let a = s.paramValues;
  n && a?.[n] !== l && (a = { ...a || {}, [n]: l });
  const i = s.promptContent ? ce(
    l,
    de(s.promptContent)
  ) : s.promptContent;
  return l === s.prompt && i === s.promptContent && a === s.paramValues ? s : { ...s, prompt: l, promptContent: i, paramValues: a };
}
function Bt(e) {
  return !!e;
}
function Dt(e, t) {
  return t.kind === "unit" && !e.units.some((n) => n.id === t.id) ? "该章节已移出目录" : "";
}
function Mt(e, t, n = {}) {
  if ([
    "save_document",
    "save_unit",
    "create_version",
    "restore_document"
  ].includes(t))
    return "";
  if (t === "generate_inspirations" || t === "select_inspiration")
    return e.selected_inspiration_id ? "选定灵感后不能更换或修改方向" : "";
  if (t === "retry_generation" || t === "generate_outline") return "";
  if (t === "retry_continuity")
    return U(e.units).byId.get(n.unit_id || "")?.unit?.has_body ? "" : "请先保存本章正文";
  if ((t === "generate_section" || t === "propose_edit") && n.section_id && (Y(n.section_id) || ["characters", "locations", "props"].includes(n.section_id)))
    return "";
  if (["generate_chapters", "append"].includes(t) && !e.outline.overview.trim() && !e.units.some((r) => r.plan.trim() || r.has_body))
    return "请先填写故事方向或已有章节内容";
  if (t === "generate_chapters") {
    if (n.unit_ids && !n.unit_ids.length)
      return "当前页没有可更新的章节";
    if (n.unit_ids?.length) {
      if (n.unit_ids.length > A) return `每批最多更新 ${A} 章章纲`;
      if (n.unit_ids.some(
        (r) => !U(e.units).byId.has(r)
      ))
        return "部分章节已移出目录";
    } else if (e.units.length > A)
      return `请选定最多 ${A} 章章纲`;
    return "";
  }
  const s = ye(e.units);
  if (t === "append" && s.length)
    return "请先同步后续剧情，再继续创作";
  if (t === "append") {
    const r = e.preferences.planned_chapters;
    if (r > 0 && e.units.length >= r)
      return "已规划到计划总章数，可在写作设定中调整";
    if (n.count !== void 0) {
      if (!Number.isInteger(n.count) || n.count < 1 || n.count > A)
        return `本批剧情章数须为 1 到 ${A} 的整数`;
      if (r > 0 && e.units.length + n.count > r)
        return `本批最多规划剩余 ${r - e.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (t === "generate_units") {
    const r = n.count ?? be;
    if (n.mode === "continue" && Z(r))
      return Z(r);
    if (n.mode === "range" && (n.unit_ids?.length || 0) > X)
      return `一次最多生成 ${X} 章正文`;
    const o = n.mode === "continue" ? ke(e.units, r).map(
      (a) => a.unit
    ) : e.units.filter(
      (a) => n.unit_ids?.includes(a.id) || a.id === n.unit_id
    );
    if (!o.length) return "请先完成章节剧情规划";
    if (o.some((a) => !a.has_body && a.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (o.some((a) => !a.title.trim() || !a.plan.trim()))
      return "请先保存章节标题与剧情";
    const c = o.find((a) => !a.has_body);
    if (!c) return "正文已完成，请使用修改建议";
    const l = e.units.indexOf(c);
    if (l > 0 && !e.units[l - 1].has_body)
      return `请先完成上一章「${e.units[l - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}
function Pt(e, t, n = {}) {
  if (t === "generate_chapters" && e.units.length) {
    const s = U(e.units), r = n.unit_ids?.flatMap((o) => {
      const c = s.byId.get(o);
      return c ? [c] : [];
    });
    return n.unit_ids?.length ? `将更新${le(r || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。` : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (t === "generate_section" && n.section_id) {
    const s = n.section_id;
    if ((s === "characters" || s === "locations" || s === "props") && e.outline[s].length)
      return `将更新当前${fe.find(
        (o) => o.id === s
      ).label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
  }
  return "";
}
function Vt(e) {
  return e.unit_id ? {
    kind: "unit",
    id: e.unit_id,
    tab: e.section_id === "chapter_plan" ? "plan" : "body"
  } : e.entity_id && (e.section_id === "characters" || e.section_id === "locations" || e.section_id === "props") ? { kind: "entity", section: e.section_id, id: e.entity_id } : {
    kind: "section",
    id: e.section_id && Y(e.section_id) ? e.section_id : "overview"
  };
}
function xt(e) {
  if (!e || !["failed", "stopped"].includes(e.document.status))
    return null;
  const t = e.checkpoint;
  if (!t || t.completed >= t.target) return null;
  if ([
    "generate_inspirations",
    "generate_outline",
    "generate_chapters",
    "generate_units",
    "generate_section",
    "append",
    "retry_continuity"
  ].includes(t.action))
    return { action: "retry_generation", extra: {} };
  if (t.action !== "propose_edit") return null;
  const n = {
    instruction: t.instruction
  };
  return t.count && (n.count = t.count), t.selected_text && (n.selected_text = t.selected_text), t.section_id && (n.section_id = t.section_id), t.entity_id && (n.entity_id = t.entity_id), t.inspiration_id && (n.inspiration_id = t.inspiration_id), t.unit_id && (n.unit_id = t.unit_id), { action: "propose_edit", extra: n };
}
function Ft(e) {
  const t = xe(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const s = e.previousAssets?.find(
    (c) => c.id === Number(t.id || 0)
  ), r = s ? F(s, e.previousAsset) : e.previousAsset || null, o = F(
    t,
    r
  );
  return r && pe(r, o) ? r : r?.version?.content != null && Number(r.version.id || 0) === Number(o.version?.id || 0) && (!_e(o.version?.content) || x(r.version) >= x(o.version)) ? F(r, o) : o.version?.id ? o : null;
}
function Ot(e, t) {
  const n = Qe(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function Wt(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function F(e, t) {
  const n = ne(e), s = t ? ne(t) : null, r = [
    ...n.versions || [],
    ...s?.versions || []
  ], o = et(
    [nt(n.version)].filter(
      (c) => !!c
    ),
    r
  );
  return {
    ...s,
    ...n,
    version: n.version || s?.version,
    versions: o.length ? o : void 0
  };
}
function Lt(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((r) => [r.id, r])), s = e.map((r) => {
    const o = n.get(r.id);
    return o ? (n.delete(r.id), pe(r, o) ? r : F(o, r)) : r;
  });
  return [
    ...[...n.values()].map(
      (r) => F(r)
    ),
    ...s
  ];
}
function Qe(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function ne(e) {
  const t = re(e.version), n = (e.versions || []).map(re).filter((s) => !!s);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function re(e) {
  if (!e)
    return;
  const t = Ve(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function et(...e) {
  const t = e.flat(), n = [], s = /* @__PURE__ */ new Map();
  for (const o of t) {
    if (!o || Number(o.id || 0) <= 0)
      continue;
    const c = String(o.id), l = s.get(c);
    if (l !== void 0) {
      n[l] = tt(
        n[l],
        o
      );
      continue;
    }
    s.set(c, n.length), n.push(o);
  }
  let r = !1;
  return n.sort(
    (o, c) => Number(G(c)) - Number(G(o)) || Number(c.version || c.id || 0) - Number(o.version || o.id || 0)
  ).map((o) => G(o) ? r ? rt(o) : (r = !0, o) : o);
}
function tt(e, t) {
  const n = { ...e };
  for (const [s, r] of Object.entries(t))
    r !== void 0 && r !== "" && (n[s] = r);
  return n;
}
function G(e) {
  return !!(e.is_current || e.current);
}
function nt(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function rt(e) {
  const { current: t, is_current: n, ...s } = e;
  return s;
}
const it = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], st = Object.fromEntries(
  it.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function ot(e) {
  return st[e] || "文本";
}
function Ut(e, t = []) {
  const n = new Map(
    t.map((i) => [i.key, i])
  ), s = new Map(e.nodes.map((i) => [i.id, i])), r = new Map(
    e.nodes.filter((i) => i.type === "group").map((i) => [i.id, i])
  ), o = ut(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), c = e.nodes.filter((i) => Se(i) || We(i, "import")).map((i) => {
    const u = n.get(`node:${i.id}`), p = o.get(i.id) || i.asset, _ = i.groupId ? r.get(i.groupId) : void 0, b = _?.group?.sourceNodeId ? s.get(_.group.sourceNodeId) : void 0, m = u?.node === i && u?.asset === p, k = m ? u.output : e.nodeOutput(i);
    return {
      key: `node:${i.id}`,
      role: "material",
      title: i.title || ot(ie(i)),
      sourcePath: b?.title && _?.title ? `${b.title} / ${_.title}` : _?.title,
      nodeType: ie(i),
      status: m ? u.status : ct(i, p, e.nodeHasResult(i)),
      preview: m ? u.preview : e.nodePreview(i),
      output: k,
      node: i,
      nodeId: i.id,
      nodeNo: i.nodeNo,
      groupId: i.groupId,
      groupTitle: _?.title,
      asset: p,
      assetId: p?.id,
      versionId: p?.version?.id || p?.version_id
    };
  }).filter((i) => !!(i.assetId && i.versionId)), a = [...e.assets.filter(
    (i) => Number(i.canvas_id || 0) === e.canvasId && Number(i.asset_cate_id || 0) === e.assetCateId && String(i.role || "material") === "work" && String(i.status || "") !== "archived"
  ).map((i) => {
    const u = n.get(`asset:${i.id}`);
    return {
      key: `asset:${i.id}`,
      role: "work",
      title: i.name || `作品 ${i.id}`,
      nodeType: ve(i.kind),
      status: i.version?.id || i.version_id ? "ready" : "empty",
      preview: u?.asset === i ? u.preview : e.assetPreview(i),
      output: i.version?.content,
      asset: i,
      assetId: i.id,
      versionId: i.version?.id || i.version_id
    };
  }), ...c].filter((i) => !!(i.assetId && i.versionId)).map((i) => {
    const u = n.get(i.key);
    return u && at(u, i) ? u : i;
  });
  return a.length === t.length && a.every((i, u) => i === t[u]) ? t : a;
}
function ge(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function at(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && ge(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function ie(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : ve(e.power?.kind || e.kind);
}
function ve(e) {
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
function ut(e, t, n) {
  const s = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (Number(r.canvas_id || 0) !== t || Number(r.asset_cate_id || 0) !== n || String(r.role || "") !== "material" || String(r.status || "") === "archived")
      continue;
    const o = String(
      r.node_key || r.version?.node_key || ""
    ).trim();
    o && !s.has(o) && s.set(o, r);
  }
  return s;
}
function ct(e, t, n) {
  const s = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return s === "running" || s === "waiting" || e.running === !0 ? "running" : s === "error" || s === "failed" || s === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
function zt(e, t = []) {
  return {
    current: lt([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: me(
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
const se = /* @__PURE__ */ new WeakMap(), oe = /* @__PURE__ */ new WeakMap();
function jt(e, t = []) {
  const n = new Map(
    t.map((r) => [`${r.source}:${r.id}`, r])
  ), s = e.flatMap((r) => {
    const o = se.get(r);
    if (o) return o;
    const c = {
      id: r.role === "material" ? r.nodeId || r.key : String(r.assetId || r.key),
      title: r.title,
      kind: me(r.preview, r.nodeType),
      role: r.role,
      source: r.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: r.assetId,
      versionID: r.versionId,
      output: r.output,
      preview: r.preview,
      asset: r.asset
    }, l = n.get(`${c.source}:${c.id}`), i = (l && ae(l, c) ? oe.get(l) : void 0) || $e(c).map((u) => {
      const p = n.get(
        `${u.source}:${u.id}`
      );
      return p && ae(p, u) ? p : u;
    });
    return se.set(r, i), oe.set(i[0], i), i;
  });
  return s.length === t.length && s.every((r, o) => r === t[o]) ? t : s;
}
function ae(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && ge(e.preview, t.preview) && dt(e.contentSelection, t.contentSelection);
}
function dt(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((n, s) => n === t.ids[s]));
}
function lt(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const s of e) {
    const r = `${s.source}:${s.id}`;
    n.has(r) || (n.add(r), t.push(s));
  }
  return t;
}
function me(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const K = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ft = K.joinSiteApi, H = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const pt = H.useAuthStore, _t = Je();
function Gt(e, t) {
  const n = He(), s = pt(
    (k) => k.auth?.accessToken || ""
  ), r = JSON.stringify([
    ft("workspace/canvas_execution"),
    n,
    s
  ]), o = String(t.runError || "").trim(), c = t.id, l = Number(t.resultRef?.execution_id || 0), a = String(t.resultRef?.request_id || "").trim(), i = Number(t.resultRef?.run_id || 0), u = we(
    e,
    c,
    l,
    a,
    i
  ), [p, _] = q(o), [b, m] = q(!1);
  return T(() => {
    if (_(o), !o || !u || !Le(o)) {
      m(!1);
      return;
    }
    let k = !0;
    return m(!0), gt({
      projectId: e,
      nodeId: c,
      executionId: l,
      requestId: a,
      runId: i,
      requestScopeKey: r,
      fallback: o
    }).then((d) => {
      k && d && _(d);
    }).catch(() => {
    }).finally(() => {
      k && m(!1);
    }), () => {
      k = !1;
    };
  }, [
    l,
    o,
    c,
    e,
    u,
    r,
    a,
    i
  ]), { error: p || o, loading: b };
}
function gt({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: s,
  runId: r,
  requestScopeKey: o,
  fallback: c
}) {
  const l = JSON.stringify([
    o,
    we(e, "", n, s, r)
  ]);
  return _t(
    l,
    () => Ie({
      projectId: e,
      executionId: n,
      requestId: s,
      runId: r
    }).then(Ge)
  ).then((i) => {
    const u = [...i.node_results || []].reverse().find((_) => _.node_key === t), p = Ue(u) || ze(i);
    return je(p, c);
  });
}
function we(e, t, n, s, r) {
  const o = n ? `execution:${n}` : s ? `request:${s}` : r ? `run:${r}` : "";
  return e > 0 && o ? `${e}:${o}:${t}` : "";
}
function Kt(e) {
  const t = vt(e.trim()), n = Fe(t), s = he(n), r = t.match(/\bstatus=(\d{3})\b/), c = (s || (r && t.includes("body=") ? `请求失败（HTTP ${r[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: c.length > 96 ? `${c.slice(0, 95)}…` : c,
    details: t
  };
}
function he(e) {
  return Oe(e) ? he(e.error) || V(e.message) || V(e.msg) || V(e.detail) || V(e.details) || V(e.error) : "";
}
function vt(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const W = /* @__PURE__ */ new Map(), mt = 15e3;
function wt(e, t) {
  const n = JSON.stringify([
    e.projectId,
    e.workAssetId,
    e.runId,
    e.requestId
  ]);
  let s = W.get(n);
  s || (s = ht(e), W.set(n, s));
  const r = s.subscribe(t);
  return () => {
    r(), s.size || (s.dispose(), W.get(n) === s && W.delete(n));
  };
}
function ht(e) {
  const t = new AbortController(), n = /* @__PURE__ */ new Set();
  let s, r = !1, o = !1, c = !1, l = !1, a, i, u;
  const p = () => !t.signal.aborted && !o, _ = () => {
    clearTimeout(s), t.abort();
  }, b = (d) => {
    if (p()) {
      o = !0, u = d, _();
      for (const g of n)
        d ? g.onError(d) : g.onEnd();
    }
  }, m = async () => {
    if (p()) {
      if (clearTimeout(s), c) {
        l = !0;
        return;
      }
      c = !0;
      try {
        const d = await Ce({
          projectId: e.projectId,
          runId: e.runId,
          requestId: e.requestId,
          reportError: !1
        });
        if (!p()) return;
        const g = d?.run;
        if (!g || Number(g.id) !== e.runId || String(g.request_id) !== e.requestId) {
          b(new Error("运行状态与当前故事不匹配"));
          return;
        }
        i = g;
        for (const S of n) S.onStatus(g);
        (Ye(g.status) || !e.running) && b();
      } catch (d) {
        if (!p()) return;
        const g = Number(d?.code);
        (g === 401 || g === 403 || !e.running) && b(d);
      } finally {
        c = !1, p() && l ? (l = !1, m()) : p() && (s = setTimeout(m, mt));
      }
    }
  }, k = () => {
    r || (r = !0, m(), !(!e.running || !p()) && Ze({
      projectId: e.projectId,
      requestId: e.requestId,
      signal: t.signal,
      recoverOnError: !0,
      onFrame: (d) => {
        if (p()) {
          a = d;
          for (const g of n) g.onFrame(d);
        }
      }
    }).then(() => {
      p() && m();
    }).catch((d) => b(d)));
  };
  return {
    get size() {
      return n.size;
    },
    subscribe(d) {
      return n.add(d), i && d.onStatus(i), a && d.onFrame(a), o && (u ? d.onError(u) : d.onEnd()), k(), () => n.delete(d);
    },
    dispose: _
  };
}
function yt({
  projectId: e,
  snapshot: t,
  snapshotRef: n,
  workAssetIdRef: s,
  scopeRef: r,
  scope: o,
  mounted: c,
  acceptSnapshot: l,
  loadWork: a,
  reportError: i,
  observeCompletedRuns: u = !0
}) {
  const [p, _] = q(""), [b, m] = q(null), [k, d] = q(null), g = I(""), S = I(/* @__PURE__ */ new Set()), C = N(() => {
    d(null), g.current = "", S.current.clear();
  }, []), R = N(() => _(""), []);
  return T(() => {
    const w = n.current;
    if (!w?.run_id || !w.request_id || !u && w.document.status !== "running" || s.current && w.work_asset_id !== s.current)
      return;
    const z = r.current;
    let O = !1;
    const D = (f) => !!(f && f.work_asset_id === w.work_asset_id && f.run_id === w.run_id && f.request_id === w.request_id), E = () => !O && c.current && r.current === z && D(n.current), M = {
      workAssetId: w.work_asset_id,
      runId: w.run_id,
      requestId: w.request_id
    }, j = Date.now(), P = () => m((f) => {
      const v = f?.runId === w.run_id && f?.requestId === w.request_id && f?.workAssetId === w.work_asset_id ? f : { ...M, startedAt: j, source: "observed" };
      return n.current?.document.status === "running" ? v : { ...v, finishedAt: v.finishedAt || Date.now() };
    });
    g.current = "", S.current.clear(), P();
    const h = wt(
      {
        ...M,
        projectId: e,
        running: w.document.status === "running"
      },
      {
        onStatus: (f) => {
          if (!E()) return;
          const y = ee(f.output);
          y && D(y) && l(y);
          const v = Ke(f);
          v ? m(($) => ({
            ...M,
            ...v,
            source: "server",
            ...n.current?.document.status !== "running" ? {
              finishedAt: v.finishedAt || $?.finishedAt || Date.now()
            } : {}
          })) : P(), (f.status === "fail" || n.current?.document.status === "failed") && _(
            String(f.error || "生成失败，已完成内容已保留")
          );
        },
        onFrame: (f) => {
          if (!E()) return;
          const y = Ee(f.output);
          if (Q(y, n.current)) {
            if (S.current.has(y.step_request_id)) return;
            g.current !== y.step_request_id && g.current && S.current.add(g.current), g.current = y.step_request_id, d(y);
          }
          const v = ee(f.output);
          v && D(v) && l(v), f.type === "result" && Number(f.status) === 2 && _(f.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          E() && a().catch((f) => {
            E() && i(f);
          });
        },
        onError: (f) => {
          E() && (P(), i(f));
        }
      }
    );
    return () => {
      O = !0, h();
    };
  }, [
    l,
    c,
    r,
    n,
    s,
    a,
    e,
    i,
    o,
    u,
    t?.work_asset_id,
    t?.run_id,
    t?.request_id
  ]), {
    generationError: t?.document.status === "running" || t?.document.status === "ready" ? "" : p,
    generationTiming: b,
    preview: Q(k, t) ? k : Re(t),
    clearPreview: C,
    clearGenerationError: R
  };
}
function Ht({
  projectId: e,
  canvasId: t,
  node: n,
  output: s,
  onAssetUpdated: r,
  readOnMount: o = !0
}) {
  const [c, l] = q(
    () => te(n, s)
  ), a = I(c), i = n.asset?.id || n.resultRef?.asset_id, u = `${e}:${t}:${n.id}:${i || 0}`, p = I(u), _ = I(i), b = I(n.asset), m = I(r), k = I(0), d = I(!0), [g, S] = q(""), C = N(
    (h) => S(h instanceof Error ? h.message : "创作操作失败"),
    []
  );
  T(() => {
    p.current = u, _.current = i, b.current = n.asset, m.current = r;
  }, [u, i, n.asset, r]), T(() => (d.current = !0, () => {
    d.current = !1;
  }), []);
  const R = N((h) => {
    if (!d.current || _.current && h.work_asset_id !== _.current)
      return h;
    const f = Ae(a.current, h);
    if (a.current = f, l(f), b.current?.id === f.work_asset_id && f === h) {
      const y = b.current, v = {
        ...y,
        name: f.document.title,
        version_id: f.work_version_id,
        version: {
          ...y.version,
          id: f.work_version_id,
          asset_id: f.work_asset_id,
          version: f.work_version || y.version?.version || 1,
          updated_at: f.work_updated_at,
          content: {
            json: f.document,
            writing_revision: f.work_revision
          }
        }
      };
      b.current = v, m.current?.(v);
    }
    return f;
  }, []), w = N(async () => {
    const h = p.current, f = n.asset?.id || n.resultRef?.asset_id || a.current?.work_asset_id;
    if (!f) return;
    const y = ++k.current, v = await Te({
      projectId: e,
      assetId: f,
      currentOnly: !0,
      reportError: !1
    });
    if (!d.current || y !== k.current || p.current !== h)
      return;
    const $ = _e(v.asset.version?.content);
    if (!$) throw new Error("作品内容格式不正确");
    b.current = v.asset;
    const B = a.current;
    R({
      work_asset_id: f,
      work_version_id: v.asset.version_id,
      work_revision: x(v.asset.version),
      work_version: v.asset.version?.version,
      work_updated_at: v.asset.version?.updated_at || v.asset.version?.created_at,
      document: $,
      run_id: $.active_run_id,
      request_id: $.active_request_id,
      status: $.status,
      checkpoint: B?.run_id === $.active_run_id && B.work_revision === x(v.asset.version) ? B.checkpoint : void 0,
      proposal: B?.run_id === $.active_run_id && B.work_revision === x(v.asset.version) ? B.proposal : void 0
    });
  }, [R, n.asset?.id, n.resultRef?.asset_id, e]);
  T(() => {
    o && w().catch(C);
  }, [w, o, C]), T(() => {
    const h = n.asset?.id || n.resultRef?.asset_id, f = n.asset?.version_id || n.resultRef?.version_id, y = a.current;
    o && y && y.work_asset_id === h && f && f > y.work_version_id && w().catch(C);
  }, [
    w,
    o,
    n.asset?.id,
    n.asset?.version_id,
    n.resultRef?.asset_id,
    n.resultRef?.version_id,
    C
  ]), T(() => {
    const h = te(n, s, a.current);
    h && R(h);
  }, [R, n, s]);
  const {
    generationTiming: z,
    generationError: O,
    preview: D,
    clearPreview: E,
    clearGenerationError: M
  } = yt({
    projectId: e,
    snapshot: c,
    snapshotRef: a,
    workAssetIdRef: _,
    scopeRef: p,
    scope: u,
    mounted: d,
    acceptSnapshot: R,
    loadWork: w,
    reportError: C,
    observeCompletedRuns: o
  }), j = N(
    (h, f = {}, y) => {
      const v = a.current;
      if (!v) throw new Error("请等待作品加载完成");
      return {
        project_id: e,
        canvas_id: t,
        work_asset_id: v.work_asset_id,
        expected_work_version_id: y ?? v.work_version_id,
        expected_work_revision: v.work_revision,
        action: h,
        ...f
      };
    },
    [t, e]
  ), P = N(async () => {
    const h = a.current;
    !h?.run_id || h.document.status !== "running" || (await Ne({
      projectId: e,
      runId: h.run_id,
      requestId: h.request_id,
      reportError: !1
    }), await w());
  }, [w, e]);
  return {
    snapshot: c,
    snapshotRef: a,
    mounted: d,
    acceptSnapshot: R,
    loadWork: w,
    command: j,
    stopRun: P,
    reportError: C,
    setError: S,
    error: g || O || (!c && n.asset?.version?.content != null ? "作品内容格式不正确" : ""),
    generationTiming: z,
    preview: D,
    clearPreview: E,
    clearGenerationError: M
  };
}
function Jt(e, t, n, s) {
  if (!t || !Object.keys(t.fields).length) return e;
  const r = { ...e }, o = (a, i, u) => {
    r.outline === e.outline && (r.outline = { ...e.outline }), r.outline[a] === e.outline[a] && (r.outline[a] = [...e.outline[a]]);
    const p = r.outline[a];
    return p[i] ? p[i] === e.outline[a][i] && (p[i] = { ...p[i] }) : p[i] = { id: u, name: "", description: "" }, p[i];
  }, c = (a) => (r.units === e.units && (r.units = [...e.units]), r.units[a] ? r.units[a] === e.units[a] && (r.units[a] = { ...r.units[a] }) : r.units[a] = {
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
  }, r.units[a]), l = t.values || {};
  for (const a of ["characters", "locations", "props"])
    for (let i = 0; ; i++) {
      const u = l[`outline.${a}.${i}.id`];
      if (typeof u != "string") break;
      o(a, i, u).id = u;
    }
  for (const [a, i] of Object.entries(t.fields)) {
    const u = a.replace(/\[(\d+)\]/g, ".$1"), p = /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
      u
    );
    if (p) {
      const d = p[1];
      if (e.preferences[d]) continue;
      const g = d === "chapter_words" || d === "planned_chapters" ? l[u] : i, S = { ...r.preferences, [d]: g };
      qe(S) && (r.preferences = S);
      continue;
    }
    const _ = /^inspirations\.(\d+)\.(title|content)$/.exec(u), b = /^units\.(\d+)\.(title|plan)$/.exec(u), m = /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
      u
    ), k = u.startsWith("outline.") ? u.slice(8) : u === "content" ? t.section_id : void 0;
    if (k && Y(k))
      r.outline === e.outline && (r.outline = { ...e.outline }), r.outline[k] = i;
    else if (_) {
      const d = t.inspiration_id ? r.inspirations.findIndex(
        (g) => g.id === t.inspiration_id
      ) : Number(_[1]);
      if (d < 0) continue;
      r.inspirations === e.inspirations && (r.inspirations = [...e.inspirations]), r.inspirations[d] && r.inspirations[d] === e.inspirations[d] && (r.inspirations[d] = { ...r.inspirations[d] }), r.inspirations[d] ||= { id: "", title: "", content: "" }, r.inspirations[d][_[2]] = i;
    } else if (b) {
      const d = Number(b[1]), g = n === "generate_chapters" && s?.length ? r.units.findIndex(
        (S) => S.id === s[d]
      ) : d + (n === "append" ? e.units.length : 0);
      if (g < 0 || s?.length && n === "generate_chapters" && !s[d])
        continue;
      c(g)[b[2]] = i;
    } else if (m) {
      const d = m[1] || t.section_id;
      if (d !== "characters" && d !== "locations" && d !== "props")
        continue;
      const g = t.entity_id ? r.outline[d].findIndex(
        (S) => S.id === t.entity_id
      ) : Number(m[2]);
      if (g < 0) continue;
      o(d, g, `preview:${d}:${g}`)[m[3]] = i;
    } else if (t.section_id === "chapter_plan" && t.unit_id && u === "plan") {
      const d = r.units.findIndex(
        (g) => g.id === t.unit_id
      );
      d >= 0 && (c(d).plan = i);
    }
  }
  return r;
}
const bt = {
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
function kt(e) {
  return bt[e] || "创作任务";
}
const J = [
  { id: "preferences", label: "生成写作设定" },
  { id: "direction", label: "生成故事总纲" },
  { id: "characters", label: "生成人物" },
  { id: "background", label: "生成背景" },
  { id: "chapters", label: "规划章节剧情" }
];
function Yt(e) {
  if (e?.checkpoint?.action !== "generate_outline") return "";
  const t = J.findIndex(
    ({ id: n }) => n === e.checkpoint?.phase
  );
  return t >= 0 ? `第${t + 1}/${J.length}步` : "";
}
function Zt(e) {
  const t = e?.checkpoint;
  if (!e) return "正在准备创作";
  if (!t) return "创作任务";
  const { document: n } = e;
  if (t.phase) {
    const c = J.find(({ id: u }) => u === t.phase), l = t.phase === "continuity" ? t.continuity_unit_id || t.unit_id : t.unit_id || t.unit_ids?.[t.completed], a = l ? n.units.findIndex((u) => u.id === l) : -1, i = t.phase === "continuity" && t.history_total ? `正在整理前文 ${t.history_completed || 0}/${t.history_total}` : c ? `${n.status === "running" ? "正在" : ""}${c.label}` : t.phase === "body" ? "正在写正文" : "正文已保存，整理剧情衔接";
    if (t.phase === "chapters") {
      const u = Math.min(
        A,
        t.count || n.preferences.planned_chapters || (n.preferences.mode === "serial" ? 10 : 5)
      );
      return `${i} · 第 1—${u} 章`;
    }
    return `${i}${a >= 0 ? ` · 第 ${a + 1} 章` : ""}`;
  }
  const s = kt(t.action);
  if (t.action === "append") {
    const c = Be(
      n.units,
      n.preferences.planned_chapters,
      t.count
    );
    return `${s} · 第 ${c.start}—${c.end} 章`;
  }
  if (t.action === "generate_chapters" && t.unit_ids.length) {
    const c = U(n.units), l = t.unit_ids.flatMap((a) => {
      const i = c.byId.get(a);
      return i ? [i] : [];
    });
    return `${s} · ${le(l)}`;
  }
  const r = t.unit_ids?.[t.completed] || t.unit_id, o = n.units.find((c) => c.id === r);
  if (o)
    return `${s} · ${De(n, { kind: "unit", id: o.id })}${t.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (t.action === "generate_section" || t.action === "propose_edit") {
    const c = [...fe, ...Me].find(
      (a) => a.id === t.section_id
    ), l = Pe.flatMap(({ id: a }) => n.outline[a]).find((a) => a.id === t.entity_id);
    return `${s}${c ? ` · ${c.label}` : ""}${l ? ` · ${l.name}` : ""}`;
  }
  return s;
}
export {
  Gt as a,
  Kt as b,
  Bt as c,
  et as d,
  zt as e,
  Dt as f,
  Zt as g,
  Mt as h,
  Pt as i,
  Yt as j,
  kt as k,
  Vt as l,
  F as m,
  L as n,
  Nt as o,
  Jt as p,
  Lt as q,
  Ut as r,
  qt as s,
  jt as t,
  Ht as u,
  Wt as v,
  xt as w,
  Ft as x,
  Ot as y
};
