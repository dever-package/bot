import { a2 as x, a1 as L, a0 as W, x as S, G as z, S as y, R as ie, Q as ae, W as B, V as T, U as ue, I as ce, O as de, a8 as j, A as le, B as M, a9 as pe } from "./writing-reference-Bgk4pNta.js";
import { ag as me, M as fe, V as ge, k as ve, K as C } from "./asset-audio-preview-Cezm24us.js";
import { j as ye } from "./space-storyboard-material-ECvLpyk_.js";
import { b as A, u as Ce, l as q, p as _e, o as we, a as D, d as be } from "./file-kind-Cq3pESGF.js";
import { ab as ke, ac as Se } from "./writing-run-labels-BAbF9nso.js";
import { w as Ae, a3 as De, a4 as Re, b as he, e as Ne, B as Ie } from "./node-detail-header-Cn59agL3.js";
import { u as Be } from "./text-content-save-actions-CrfXuWSV.js";
import { b as Te, d as m, a as f } from "./space-assistant-layout-Drz4je9C.js";
import "./space-content-view-DfYKFqXc.js";
import "./media-inspector-gallery-BR6rzcOx.js";
function b(e, t) {
  const n = String(e || "");
  return n.trim() && n.trim() === String(t || "").trim() ? "" : n;
}
function vt(e, t) {
  return !!b(e, t).trim();
}
function Me(e, t, n) {
  if (!t?.trim())
    return e;
  const r = b(e.prompt, t), s = e.promptContent, i = x(s), a = s?.parts.filter((l) => l.type === "text").map((l) => l.text).join(""), d = [i, a].some(
    (l) => !!l?.trim() && !b(l, t)
  ), u = d ? L(
    r,
    W(s)
  ) : s, o = d && !u?.parts.length ? void 0 : u;
  let c = e.paramValues;
  const p = n ? c?.[n] : void 0;
  if (n && typeof p == "string") {
    const l = b(p, t);
    l !== p && (c = { ...c, [n]: l });
  }
  return r === e.prompt && o === s && c === e.paramValues ? e : { ...e, prompt: r, promptContent: o, paramValues: c };
}
function yt(e, t, n) {
  const r = Me(
    e,
    t,
    n
  ), s = String(t || "");
  if (!s.trim())
    return r;
  const i = x(
    r.promptContent
  ), a = r.promptContent?.parts.filter((c) => c.type === "text").map((c) => c.text).join(""), d = r.prompt?.trim() ? r.prompt : a?.trim() ? i : s;
  let u = r.paramValues;
  n && u?.[n] !== d && (u = { ...u || {}, [n]: d });
  const o = r.promptContent ? L(
    d,
    W(r.promptContent)
  ) : r.promptContent;
  return d === r.prompt && o === r.promptContent && u === r.paramValues ? r : { ...r, prompt: d, promptContent: o, paramValues: u };
}
function Ct(e) {
  return !!e;
}
function _t(e, t) {
  return t.kind === "unit" && !e.units.some((n) => n.id === t.id) ? "该章节已移出目录" : "";
}
function wt(e, t, n = {}) {
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
    return S(e.units).byId.get(n.unit_id || "")?.unit?.has_body ? "" : "请先保存本章正文";
  if ((t === "generate_section" || t === "propose_edit") && n.section_id && (z(n.section_id) || ["characters", "locations", "props"].includes(n.section_id)))
    return "";
  if (["generate_chapters", "append"].includes(t) && !e.outline.overview.trim() && !e.units.some((s) => s.plan.trim() || s.has_body))
    return "请先填写故事方向或已有章节内容";
  if (t === "generate_chapters") {
    if (n.unit_ids && !n.unit_ids.length)
      return "当前页没有可更新的章节";
    if (n.unit_ids?.length) {
      if (n.unit_ids.length > y) return `每批最多更新 ${y} 章章纲`;
      if (n.unit_ids.some(
        (s) => !S(e.units).byId.has(s)
      ))
        return "部分章节已移出目录";
    } else if (e.units.length > y)
      return `请选定最多 ${y} 章章纲`;
    return "";
  }
  const r = ie(e.units);
  if (t === "append" && r.length)
    return "请先同步后续剧情，再继续创作";
  if (t === "append") {
    const s = e.preferences.planned_chapters;
    if (s > 0 && e.units.length >= s)
      return "已规划到计划总章数，可在写作设定中调整";
    if (n.count !== void 0) {
      if (!Number.isInteger(n.count) || n.count < 1 || n.count > y)
        return `本批剧情章数须为 1 到 ${y} 的整数`;
      if (s > 0 && e.units.length + n.count > s)
        return `本批最多规划剩余 ${s - e.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (t === "generate_units") {
    const s = n.count ?? ae;
    if (n.mode === "continue" && B(s))
      return B(s);
    if (n.mode === "range" && (n.unit_ids?.length || 0) > T)
      return `一次最多生成 ${T} 章正文`;
    const i = n.mode === "continue" ? ue(e.units, s).map(
      (u) => u.unit
    ) : e.units.filter(
      (u) => n.unit_ids?.includes(u.id) || u.id === n.unit_id
    );
    if (!i.length) return "请先完成章节剧情规划";
    if (i.some((u) => !u.has_body && u.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (i.some((u) => !u.title.trim() || !u.plan.trim()))
      return "请先保存章节标题与剧情";
    const a = i.find((u) => !u.has_body);
    if (!a) return "正文已完成，请使用修改建议";
    const d = e.units.indexOf(a);
    if (d > 0 && !e.units[d - 1].has_body)
      return `请先完成上一章「${e.units[d - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}
function bt(e, t, n = {}) {
  if (t === "generate_chapters" && e.units.length) {
    const r = S(e.units), s = n.unit_ids?.flatMap((i) => {
      const a = r.byId.get(i);
      return a ? [a] : [];
    });
    return n.unit_ids?.length ? `将更新${ce(s || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。` : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (t === "generate_section" && n.section_id) {
    const r = n.section_id;
    if ((r === "characters" || r === "locations" || r === "props") && e.outline[r].length)
      return `将更新当前${de.find(
        (i) => i.id === r
      ).label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
  }
  return "";
}
function kt(e) {
  return e.unit_id ? {
    kind: "unit",
    id: e.unit_id,
    tab: e.section_id === "chapter_plan" ? "plan" : "body"
  } : e.entity_id && (e.section_id === "characters" || e.section_id === "locations" || e.section_id === "props") ? { kind: "entity", section: e.section_id, id: e.entity_id } : {
    kind: "section",
    id: e.section_id && z(e.section_id) ? e.section_id : "overview"
  };
}
function St(e) {
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
function At(e) {
  const t = fe(e.result?.asset, e.result?.data?.asset);
  if (!t || Number(t.id || 0) <= 0 || !t.version?.id)
    return null;
  const r = e.previousAssets?.find(
    (a) => a.id === Number(t.id || 0)
  ), s = r ? _(r, e.previousAsset) : e.previousAsset || null, i = _(
    t,
    s
  );
  return s && j(s, i) ? s : s?.version?.content != null && Number(s.version.id || 0) === Number(i.version?.id || 0) && (!le(i.version?.content) || M(s.version) >= M(i.version)) ? _(s, i) : i.version?.id ? i : null;
}
function Dt(e, t) {
  const n = $e(e);
  return t ? {
    ...n,
    asset: t
  } : n;
}
function Rt(e, t = "") {
  return String(e.kind || e.power?.kind || t || "richtext");
}
function _(e, t) {
  const n = $(e), r = t ? $(t) : null, s = [
    ...n.versions || [],
    ...r?.versions || []
  ], i = Ee(
    [Pe(n.version)].filter(
      (a) => !!a
    ),
    s
  );
  return {
    ...r,
    ...n,
    version: n.version || r?.version,
    versions: i.length ? i : void 0
  };
}
function ht(e, t) {
  if (t.length === 0)
    return e;
  const n = new Map(t.map((s) => [s.id, s])), r = e.map((s) => {
    const i = n.get(s.id);
    return i ? (n.delete(s.id), j(s, i) ? s : _(i, s)) : s;
  });
  return [
    ...[...n.values()].map(
      (s) => _(s)
    ),
    ...r
  ];
}
function $e(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const { version: t, ...n } = e;
  return n;
}
function $(e) {
  const t = E(e.version), n = (e.versions || []).map(E).filter((r) => !!r);
  return {
    ...e,
    version: t,
    versions: n.length ? n : e.versions
  };
}
function E(e) {
  if (!e)
    return;
  const t = me(e.content);
  return t ? {
    ...e,
    content: { rich: t }
  } : e;
}
function Ee(...e) {
  const t = e.flat(), n = [], r = /* @__PURE__ */ new Map();
  for (const i of t) {
    if (!i || Number(i.id || 0) <= 0)
      continue;
    const a = String(i.id), d = r.get(a);
    if (d !== void 0) {
      n[d] = Ve(
        n[d],
        i
      );
      continue;
    }
    r.set(a, n.length), n.push(i);
  }
  let s = !1;
  return n.sort(
    (i, a) => Number(k(a)) - Number(k(i)) || Number(a.version || a.id || 0) - Number(i.version || i.id || 0)
  ).map((i) => k(i) ? s ? Oe(i) : (s = !0, i) : i);
}
function Ve(e, t) {
  const n = { ...e };
  for (const [r, s] of Object.entries(t))
    s !== void 0 && s !== "" && (n[r] = s);
  return n;
}
function k(e) {
  return !!(e.is_current || e.current);
}
function Pe(e) {
  return e ? { ...e, current: !0 } : void 0;
}
function Oe(e) {
  const { current: t, is_current: n, ...r } = e;
  return r;
}
const Ue = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" }
], xe = Object.fromEntries(
  Ue.filter((e) => e.key !== "all").map((e) => [e.key, e.label])
);
function Le(e) {
  return xe[e] || "文本";
}
function Nt(e, t = []) {
  const n = new Map(
    t.map((o) => [o.key, o])
  ), r = new Map(e.nodes.map((o) => [o.id, o])), s = new Map(
    e.nodes.filter((o) => o.type === "group").map((o) => [o.id, o])
  ), i = ze(
    e.assets,
    e.canvasId,
    e.assetCateId
  ), a = e.nodes.filter((o) => ke(o) || Ae(o, "import")).map((o) => {
    const c = n.get(`node:${o.id}`), p = i.get(o.id) || o.asset, l = o.groupId ? s.get(o.groupId) : void 0, w = l?.group?.sourceNodeId ? r.get(l.group.sourceNodeId) : void 0, g = c?.node === o && c?.asset === p, v = g ? c.output : e.nodeOutput(o);
    return {
      key: `node:${o.id}`,
      role: "material",
      title: o.title || Le(V(o)),
      sourcePath: w?.title && l?.title ? `${w.title} / ${l.title}` : l?.title,
      nodeType: V(o),
      status: g ? c.status : je(o, p, e.nodeHasResult(o)),
      preview: g ? c.preview : e.nodePreview(o),
      output: v,
      node: o,
      nodeId: o.id,
      nodeNo: o.nodeNo,
      groupId: o.groupId,
      groupTitle: l?.title,
      asset: p,
      assetId: p?.id,
      versionId: p?.version?.id || p?.version_id
    };
  }).filter((o) => !!(o.assetId && o.versionId)), u = [...e.assets.filter(
    (o) => Number(o.canvas_id || 0) === e.canvasId && Number(o.asset_cate_id || 0) === e.assetCateId && String(o.role || "material") === "work" && String(o.status || "") !== "archived"
  ).map((o) => {
    const c = n.get(`asset:${o.id}`);
    return {
      key: `asset:${o.id}`,
      role: "work",
      title: o.name || `作品 ${o.id}`,
      nodeType: H(o.kind),
      status: o.version?.id || o.version_id ? "ready" : "empty",
      preview: c?.asset === o ? c.preview : e.assetPreview(o),
      output: o.version?.content,
      asset: o,
      assetId: o.id,
      versionId: o.version?.id || o.version_id
    };
  }), ...a].filter((o) => !!(o.assetId && o.versionId)).map((o) => {
    const c = n.get(o.key);
    return c && We(c, o) ? c : o;
  });
  return u.length === t.length && u.every((o, c) => o === t[c]) ? t : u;
}
function F(e, t) {
  return e === t || e.text === t.text && e.imageUrl === t.imageUrl && e.videoUrl === t.videoUrl && e.videoPosterUrl === t.videoPosterUrl && e.audioUrl === t.audioUrl && e.fileUrl === t.fileUrl;
}
function We(e, t) {
  return e.key === t.key && e.role === t.role && e.title === t.title && e.sourcePath === t.sourcePath && e.nodeType === t.nodeType && e.status === t.status && F(e.preview, t.preview) && e.output === t.output && e.node === t.node && e.nodeId === t.nodeId && e.nodeNo === t.nodeNo && e.groupId === t.groupId && e.groupTitle === t.groupTitle && e.asset === t.asset && e.assetId === t.assetId && e.versionId === t.versionId;
}
function V(e) {
  if (e.type === "agent") return "agent";
  if (e.type === "flow") return "flow";
  const t = String(
    e.outputType || e.power?.outputType || e.power?.output?.key || ""
  ).toLowerCase(), n = String(e.power?.output?.viewMode || "").toLowerCase();
  return t === "storyboard" || n === "storyboard" ? "storyboard" : H(e.power?.kind || e.kind);
}
function H(e) {
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
function ze(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (Number(s.canvas_id || 0) !== t || Number(s.asset_cate_id || 0) !== n || String(s.role || "") !== "material" || String(s.status || "") === "archived")
      continue;
    const i = String(
      s.node_key || s.version?.node_key || ""
    ).trim();
    i && !r.has(i) && r.set(i, s);
  }
  return r;
}
function je(e, t, n) {
  const r = String(
    e.running?.status || e.resultRef?.status || ""
  ).toLowerCase();
  return r === "running" || r === "waiting" || e.running === !0 ? "running" : r === "error" || r === "failed" || r === "failure" ? "failed" : n || (t?.version?.id || t?.version_id) ? "ready" : "empty";
}
const K = _e(
  null
);
function It({
  root: e,
  children: t,
  rootMargin: n = "0px"
}) {
  const r = A(/* @__PURE__ */ new Map()), s = A(null), i = Ce(
    () => ({
      observe(a, d) {
        return r.current.set(a, d), s.current?.observe(a), () => {
          s.current?.unobserve(a), r.current.delete(a);
        };
      }
    }),
    []
  );
  return q(() => {
    const a = new IntersectionObserver(
      (d) => {
        for (const u of d)
          r.current.get(u.target)?.(
            u.isIntersecting && u.intersectionRatio > 0
          );
      },
      { root: e.current, rootMargin: n }
    );
    s.current = a;
    for (const d of r.current.keys())
      a.observe(d);
    return () => {
      a.disconnect(), s.current = null;
    };
  }, [e, n]), /* @__PURE__ */ ye(K.Provider, { value: i, children: t });
}
function Bt(e = !0) {
  const t = we(K), n = A(null), [r, s] = D(!1);
  return q(() => {
    if (!(!n.current || !t))
      return t.observe(n.current, (i) => {
        (i || !e) && s(i);
      });
  }, [t, e]), { ref: n, visible: r };
}
function Tt(e, t = []) {
  return {
    current: Fe([
      ...t,
      ...(e?.sources || []).map((n) => ({
        id: n.nodeId,
        title: n.title,
        kind: G(
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
const P = /* @__PURE__ */ new WeakMap(), O = /* @__PURE__ */ new WeakMap();
function Mt(e, t = []) {
  const n = new Map(
    t.map((s) => [`${s.source}:${s.id}`, s])
  ), r = e.flatMap((s) => {
    const i = P.get(s);
    if (i) return i;
    const a = {
      id: s.role === "material" ? s.nodeId || s.key : String(s.assetId || s.key),
      title: s.title,
      kind: G(s.preview, s.nodeType),
      role: s.role,
      source: s.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: s.assetId,
      versionID: s.versionId,
      output: s.output,
      preview: s.preview,
      asset: s.asset
    }, d = n.get(`${a.source}:${a.id}`), o = (d && U(d, a) ? O.get(d) : void 0) || pe(a).map((c) => {
      const p = n.get(
        `${c.source}:${c.id}`
      );
      return p && U(p, c) ? p : c;
    });
    return P.set(s, o), O.set(o[0], o), o;
  });
  return r.length === t.length && r.every((s, i) => s === t[i]) ? t : r;
}
function U(e, t) {
  return e.id === t.id && e.title === t.title && e.kind === t.kind && e.role === t.role && e.source === t.source && e.refType === t.refType && e.refId === t.refId && e.versionID === t.versionID && e.output === t.output && e.asset === t.asset && F(e.preview, t.preview) && qe(e.contentSelection, t.contentSelection);
}
function qe(e, t) {
  return e === t || !!(e && t && e.kind === t.kind && e.ids.length === t.ids.length && e.ids.every((n, r) => n === t.ids[r]));
}
function Fe(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e) {
    const s = `${r.source}:${r.id}`;
    n.has(s) || (n.add(s), t.push(r));
  }
  return t;
}
function G(e, t) {
  const n = String(t || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : e.imageUrl ? "image" : e.videoUrl ? "video" : e.audioUrl ? "audio" : e.fileUrl ? "file" : e.text ? "text" : n || "file";
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/stores/auth-store"]);
const R = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!R || Object.keys(R).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const He = R.joinSiteApi, h = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Ke = h.useAuthStore, Ge = Te();
function $t(e, t) {
  const n = Be(), r = Ke(
    (v) => v.auth?.accessToken || ""
  ), s = JSON.stringify([
    He("workspace/canvas_execution"),
    n,
    r
  ]), i = String(t.runError || "").trim(), a = t.id, d = Number(t.resultRef?.execution_id || 0), u = String(t.resultRef?.request_id || "").trim(), o = Number(t.resultRef?.run_id || 0), c = J(
    e,
    a,
    d,
    u,
    o
  ), [p, l] = D(i), [w, g] = D(!1);
  return be(() => {
    if (l(i), !i || !c || !De(i)) {
      g(!1);
      return;
    }
    let v = !0;
    return g(!0), Je({
      projectId: e,
      nodeId: a,
      executionId: d,
      requestId: u,
      runId: o,
      requestScopeKey: s,
      fallback: i
    }).then((I) => {
      v && I && l(I);
    }).catch(() => {
    }).finally(() => {
      v && g(!1);
    }), () => {
      v = !1;
    };
  }, [
    d,
    i,
    a,
    e,
    c,
    s,
    u,
    o
  ]), { error: p || i, loading: w };
}
function Je({
  projectId: e,
  nodeId: t,
  executionId: n,
  requestId: r,
  runId: s,
  requestScopeKey: i,
  fallback: a
}) {
  const d = JSON.stringify([
    i,
    J(e, "", n, r, s)
  ]);
  return Ge(
    d,
    () => Se({
      projectId: e,
      executionId: n,
      requestId: r,
      runId: s
    }).then(Ie)
  ).then((o) => {
    const c = [...o.node_results || []].reverse().find((l) => l.node_key === t), p = Re(c) || he(o);
    return Ne(p, a);
  });
}
function J(e, t, n, r, s) {
  const i = n ? `execution:${n}` : r ? `request:${r}` : s ? `run:${s}` : "";
  return e > 0 && i ? `${e}:${i}:${t}` : "";
}
function Et(e) {
  const t = Qe(e.trim()), n = ge(t), r = Q(n), s = t.match(/\bstatus=(\d{3})\b/), a = (r || (s && t.includes("body=") ? `请求失败（HTTP ${s[1]}），请打开详情查看原因` : t) || "节点运行失败").replace(/\s+/g, " ").trim();
  return {
    summary: a.length > 96 ? `${a.slice(0, 95)}…` : a,
    details: t
  };
}
function Q(e) {
  return ve(e) ? Q(e.error) || C(e.message) || C(e.msg) || C(e.detail) || C(e.details) || C(e.error) : "";
}
function Qe(e) {
  return e.replace(
    /\b((?:authorization|cookie|set-cookie)\s*:\s*)[^\r\n]*/gi,
    "$1REDACTED"
  ).replace(/https?:\/\/[^\s"<>]+/gi, (t) => t.replace(/^(https?:\/\/)[^/]*@/i, "$1REDACTED@").replace(/[?#].*$/, "?REDACTED")).replace(
    /((?:["']?)(?:authorization|cookie|set-cookie|(?:access[_-]?|refresh[_-]?)?token|api[_-]?key|password|passwd|pwd|secret)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'[^']*'|(?:Bearer|Basic)\s+[^\s,;}]+|[^\s,;}]+)/gi,
    '$1"REDACTED"'
  ).replace(/\b(Bearer|Basic)\s+[A-Za-z0-9+/_=.-]+/gi, "$1 REDACTED");
}
const Z = f(() => import("./space-agent-tools-D4I1Lh9b.js")), N = f(() => import("./space-asset-tools-5RDy8ssD.js")), Ze = m(
  Z,
  (e) => e.AgentInteractionPanel
), Vt = Ze.Component, X = m(
  f(() => import("./protected-6-nodes-body-work-space-space-add-node-menu-tsx-BVv0bqeR.js")),
  (e) => e.AddNodeMenu
), Pt = X.Component, Ot = X.preload, Y = m(
  N,
  (e) => e.AssetBrowser
), Ut = Y.Component, xt = Y.preload, ee = m(
  N,
  (e) => e.AssetDetailDialog
), Lt = ee.Component, Wt = ee.preload, te = m(
  N,
  (e) => e.AssetPickerDialog
), zt = te.Component, jt = te.preload, ne = m(
  f(() => import("./space-run-history-fHfQ6sqO.js")),
  (e) => e.CanvasRunHistoryDrawer
), qt = ne.Component, Ft = ne.preload, Xe = m(
  f(() => import("./protected-4-nodes-body-work-space-space-canvas-switcher-tsx-Fwsmwvxd.js")),
  (e) => e.SpaceCanvasManagerDialog
), Ht = Xe.Component, Ye = m(
  f(() => import("./protected-2-nodes-body-work-space-space-param-binding-dialog-tsx-Dbj_w_4o.js")),
  (e) => e.CanvasParamBindingDialog
), Kt = Ye.Component, se = m(
  f(() => import("./space-assistant-B4OVEWDO.js")),
  (e) => e.SpaceAssistant
), Gt = se.Component, Jt = se.preload, et = m(
  Z,
  (e) => e.CanvasAgentResultContent
), Qt = et.Component, re = m(
  f(() => import("./node-detail-dialog-D8Y4PRNN.js")),
  (e) => e.NodeDetailDialog
), Zt = re.Component, Xt = re.preload, oe = m(
  f(() => import("./space-node-settings-B-KhHp3f.js")),
  (e) => e.CanvasNodeSettings
), Yt = oe.Component, en = oe.preload, tt = m(
  f(() => import("./space-storyboard-node-sBNzDtRK.js")),
  (e) => e.StoryboardNodeContent
), tn = tt.Component, nt = m(
  f(() => import("./space-storyboard-node-sBNzDtRK.js")),
  (e) => e.StorySettingNodeContent
), nn = nt.Component, st = m(
  f(() => import("./space-storyboard-confirm-dialog-BDTdbniY.js")),
  (e) => e.StoryboardConfirmDialog
), sn = st.Component, rt = m(
  f(() => import("./space-video-compose-view-BCVVXo2i.js")),
  (e) => e.VideoComposeView
), rn = rt.Component, ot = m(
  f(() => import("./writing-preview-CM4IjN1Q.js")),
  (e) => e.WritingPreview
), on = ot.Component;
export {
  zt as A,
  Ut as B,
  Yt as C,
  sn as D,
  Pt as E,
  Lt as F,
  Wt as G,
  Xt as H,
  Rt as I,
  Kt as J,
  Vt as K,
  Ot as L,
  At as M,
  Zt as N,
  Dt as O,
  nn as P,
  tn as Q,
  Qt as R,
  Ht as S,
  rn as V,
  on as W,
  It as a,
  $t as b,
  Ct as c,
  Et as d,
  Ee as e,
  Tt as f,
  _t as g,
  wt as h,
  bt as i,
  kt as j,
  b as k,
  vt as l,
  _ as m,
  ht as n,
  Nt as o,
  en as p,
  Mt as q,
  jt as r,
  yt as s,
  Ft as t,
  Bt as u,
  Gt as v,
  St as w,
  Jt as x,
  qt as y,
  xt as z
};
