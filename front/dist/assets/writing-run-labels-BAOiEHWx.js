import { G as z, P as V, $ as E, _ as rt, Z as st, a3 as J, a2 as X, a1 as ot, R as Q, X as H, a as ut, a8 as Y, a_ as ct, a$ as at, aQ as Z, l as K, aZ as dt, f as lt, J as ft, K as L, aX as _t, b0 as pt, a0 as gt, Y as ht, b1 as vt, b2 as wt } from "./writing-reference-DgnCfuWu.js";
import { z as U, x as tt, f as et, e as mt, p as bt, s as yt, o as kt, q as $t, n as St } from "./runtime-DQ2rFFvP.js";
import { f as Ct } from "./asset-audio-preview-DlcU6JQ0.js";
import { j as It } from "./preloadable-CbkzeflN.js";
import { b as $, u as Rt, l as nt, p as At, o as Et, a as T, h as q, d as O } from "./file-kind-X0KKJPkQ.js";
import "./interaction-B8o82vSU.js";
import { y as qt } from "./space-assistant-layout-B9KyeCM0.js";
import { P as Pt } from "./node-detail-header-YT4Fy3hu.js";
import { Y as Ot } from "./space-story-setting-reference-Dmqa_708.js";
function Ht(e) {
  return !!e;
}
function Ut(e, t) {
  return t.kind === "unit" && !e.units.some((n) => n.id === t.id) ? "该章节已移出目录" : "";
}
function te(e, t, n = {}) {
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
    return z(e.units).byId.get(n.unit_id || "")?.unit?.has_body ? "" : "请先保存本章正文";
  if ((t === "generate_section" || t === "propose_edit") && n.section_id && (V(n.section_id) || ["characters", "locations", "props"].includes(n.section_id)))
    return "";
  if (["generate_chapters", "append"].includes(t) && !e.outline.overview.trim() && !e.units.some((i) => i.plan.trim() || i.has_body))
    return "请先填写故事方向或已有章节内容";
  if (t === "generate_chapters") {
    if (n.unit_ids && !n.unit_ids.length)
      return "当前页没有可更新的章节";
    if (n.unit_ids?.length) {
      if (n.unit_ids.length > E) return `每批最多更新 ${E} 章章纲`;
      if (n.unit_ids.some(
        (i) => !z(e.units).byId.has(i)
      ))
        return "部分章节已移出目录";
    } else if (e.units.length > E)
      return `请选定最多 ${E} 章章纲`;
    return "";
  }
  const s = rt(e.units);
  if (t === "append" && s.length)
    return "请先同步后续剧情，再继续创作";
  if (t === "append") {
    const i = e.preferences.planned_chapters;
    if (i > 0 && e.units.length >= i)
      return "已规划到计划总章数，可在写作设定中调整";
    if (n.count !== void 0) {
      if (!Number.isInteger(n.count) || n.count < 1 || n.count > E)
        return `本批剧情章数须为 1 到 ${E} 的整数`;
      if (i > 0 && e.units.length + n.count > i)
        return `本批最多规划剩余 ${i - e.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (t === "generate_units") {
    const i = n.count ?? st;
    if (n.mode === "continue" && J(i))
      return J(i);
    if (n.mode === "range" && (n.unit_ids?.length || 0) > X)
      return `一次最多生成 ${X} 章正文`;
    const d = n.mode === "continue" ? ot(e.units, i).map(
      (r) => r.unit
    ) : e.units.filter(
      (r) => n.unit_ids?.includes(r.id) || r.id === n.unit_id
    );
    if (!d.length) return "请先完成章节剧情规划";
    if (d.some((r) => !r.has_body && r.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (d.some((r) => !r.title.trim() || !r.plan.trim()))
      return "请先保存章节标题与剧情";
    const u = d.find((r) => !r.has_body);
    if (!u) return "正文已完成，请使用修改建议";
    const _ = e.units.indexOf(u);
    if (_ > 0 && !e.units[_ - 1].has_body)
      return `请先完成上一章「${e.units[_ - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}
function ee(e, t, n = {}) {
  if (t === "generate_chapters" && e.units.length) {
    const s = z(e.units), i = n.unit_ids?.flatMap((d) => {
      const u = s.byId.get(d);
      return u ? [u] : [];
    });
    return n.unit_ids?.length ? `将更新${Q(i || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。` : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (t === "generate_section" && n.section_id) {
    const s = n.section_id;
    if ((s === "characters" || s === "locations" || s === "props") && e.outline[s].length)
      return `将更新当前${H.find(
        (d) => d.id === s
      ).label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
  }
  return "";
}
function ne(e) {
  return e.unit_id ? {
    kind: "unit",
    id: e.unit_id,
    tab: e.section_id === "chapter_plan" ? "plan" : "body"
  } : e.entity_id && (e.section_id === "characters" || e.section_id === "locations" || e.section_id === "props") ? { kind: "entity", section: e.section_id, id: e.entity_id } : {
    kind: "section",
    id: e.section_id && V(e.section_id) ? e.section_id : "overview"
  };
}
function ie(e) {
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
function re(e, t) {
  const n = e || Nt(), s = bt({
    type: "stream",
    output: t
  }), i = s.event, d = s.activity, u = xt(n.text, s.delta, t, i), _ = Bt(i, d) ? {
    ...n.output,
    ...s.output,
    ...u ? { text: u } : {}
  } : n.output, r = d && !d.anchorText ? { ...d, anchorText: u } : d, a = r ? yt(n.activities, r) : n.activities, f = kt(
    $t(n.document, s.output),
    et(s.output.document)
  ), g = tt(_) || n.interaction, m = U(_);
  return {
    started: !0,
    text: u,
    output: _,
    activities: a,
    document: f,
    interaction: g,
    suggestions: m.length > 0 ? m : n.suggestions,
    error: s.error || n.error
  };
}
function se(e) {
  const t = Tt(e);
  return {
    started: Object.keys(t).length > 0,
    text: j(t.text),
    output: t,
    activities: mt(t),
    document: et(t.document),
    interaction: tt(t),
    suggestions: U(t),
    error: j(t.error)
  };
}
function Tt(e) {
  const t = St(e);
  if (j(t.text))
    return t;
  const n = Ct(e);
  if (!n)
    return t;
  const s = { ...t, text: n };
  return delete s.rich, s;
}
function oe(e) {
  return !!(e && (e.started || e.text || e.activities.length > 0 || e.document || e.interaction || e.suggestions.length > 0 || Object.keys(e.output).length > 0));
}
function Nt() {
  return {
    started: !1,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: ""
  };
}
function xt(e, t, n, s) {
  return t ? `${e}${t}` : s === "final" && j(n.text) || e;
}
function Bt(e, t) {
  return !(t || e === "start" || e === "delta");
}
function j(e) {
  return e == null ? "" : String(e);
}
const it = At(
  null
);
function ue({
  root: e,
  children: t,
  rootMargin: n = "0px"
}) {
  const s = $(/* @__PURE__ */ new Map()), i = $(null), d = Rt(
    () => ({
      observe(u, _) {
        return s.current.set(u, _), i.current?.observe(u), () => {
          i.current?.unobserve(u), s.current.delete(u);
        };
      }
    }),
    []
  );
  return nt(() => {
    const u = new IntersectionObserver(
      (_) => {
        for (const r of _)
          s.current.get(r.target)?.(
            r.isIntersecting && r.intersectionRatio > 0
          );
      },
      { root: e.current, rootMargin: n }
    );
    i.current = u;
    for (const _ of s.current.keys())
      u.observe(_);
    return () => {
      u.disconnect(), i.current = null;
    };
  }, [e, n]), /* @__PURE__ */ It(it.Provider, { value: d, children: t });
}
function ce(e = !0) {
  const t = Et(it), n = $(null), [s, i] = T(!1);
  return nt(() => {
    if (!(!n.current || !t))
      return t.observe(n.current, (d) => {
        (d || !e) && i(d);
      });
  }, [t, e]), { ref: n, visible: s };
}
const W = /* @__PURE__ */ new Map(), Ft = 15e3;
function Wt(e, t) {
  const n = JSON.stringify([
    e.projectId,
    e.workAssetId,
    e.runId,
    e.requestId
  ]);
  let s = W.get(n);
  s || (s = zt(e), W.set(n, s));
  const i = s.subscribe(t);
  return () => {
    i(), s.size || (s.dispose(), W.get(n) === s && W.delete(n));
  };
}
function zt(e) {
  const t = new AbortController(), n = /* @__PURE__ */ new Set();
  let s, i = !1, d = !1, u = !1, _ = !1, r, a, f;
  const g = () => !t.signal.aborted && !d, m = () => {
    clearTimeout(s), t.abort();
  }, b = (o) => {
    if (g()) {
      d = !0, f = o, m();
      for (const l of n)
        o ? l.onError(o) : l.onEnd();
    }
  }, k = async () => {
    if (g()) {
      if (clearTimeout(s), u) {
        _ = !0;
        return;
      }
      u = !0;
      try {
        const o = await ut({
          projectId: e.projectId,
          runId: e.runId,
          requestId: e.requestId,
          reportError: !1
        });
        if (!g()) return;
        const l = o?.run;
        if (!l || Number(l.id) !== e.runId || String(l.request_id) !== e.requestId) {
          b(new Error("运行状态与当前故事不匹配"));
          return;
        }
        a = l;
        for (const y of n) y.onStatus(l);
        (qt(l.status) || !e.running) && b();
      } catch (o) {
        if (!g()) return;
        const l = Number(o?.code);
        (l === 401 || l === 403 || !e.running) && b(o);
      } finally {
        u = !1, g() && _ ? (_ = !1, k()) : g() && (s = setTimeout(k, Ft));
      }
    }
  }, S = () => {
    i || (i = !0, k(), !(!e.running || !g()) && Pt({
      projectId: e.projectId,
      requestId: e.requestId,
      signal: t.signal,
      recoverOnError: !0,
      onFrame: (o) => {
        if (g()) {
          r = o;
          for (const l of n) l.onFrame(o);
        }
      }
    }).then(() => {
      g() && k();
    }).catch((o) => b(o)));
  };
  return {
    get size() {
      return n.size;
    },
    subscribe(o) {
      return n.add(o), a && o.onStatus(a), r && o.onFrame(r), d && (f ? o.onError(f) : o.onEnd()), S(), () => n.delete(o);
    },
    dispose: m
  };
}
function jt({
  projectId: e,
  snapshot: t,
  snapshotRef: n,
  workAssetIdRef: s,
  scopeRef: i,
  scope: d,
  mounted: u,
  acceptSnapshot: _,
  loadWork: r,
  reportError: a,
  observeCompletedRuns: f = !0
}) {
  const [g, m] = T(""), [b, k] = T(null), [S, o] = T(null), l = $(""), y = $(/* @__PURE__ */ new Set()), I = q(() => {
    o(null), l.current = "", y.current.clear();
  }, []), R = q(() => m(""), []);
  return O(() => {
    const h = n.current;
    if (!h?.run_id || !h.request_id || !f && h.document.status !== "running" || s.current && h.work_asset_id !== s.current)
      return;
    const D = i.current;
    let F = !1;
    const N = (c) => !!(c && c.work_asset_id === h.work_asset_id && c.run_id === h.run_id && c.request_id === h.request_id), A = () => !F && u.current && i.current === D && N(n.current), x = {
      workAssetId: h.work_asset_id,
      runId: h.run_id,
      requestId: h.request_id
    }, G = Date.now(), B = () => k((c) => {
      const p = c?.runId === h.run_id && c?.requestId === h.request_id && c?.workAssetId === h.work_asset_id ? c : { ...x, startedAt: G, source: "observed" };
      return n.current?.document.status === "running" ? p : { ...p, finishedAt: p.finishedAt || Date.now() };
    });
    l.current = "", y.current.clear(), B();
    const v = Wt(
      {
        ...x,
        projectId: e,
        running: h.document.status === "running"
      },
      {
        onStatus: (c) => {
          if (!A()) return;
          const w = Z(c.output);
          w && N(w) && _(w);
          const p = Ot(c);
          p ? k((C) => ({
            ...x,
            ...p,
            source: "server",
            ...n.current?.document.status !== "running" ? {
              finishedAt: p.finishedAt || C?.finishedAt || Date.now()
            } : {}
          })) : B(), (c.status === "fail" || n.current?.document.status === "failed") && m(
            String(c.error || "生成失败，已完成内容已保留")
          );
        },
        onFrame: (c) => {
          if (!A()) return;
          const w = at(c.output);
          if (Y(w, n.current)) {
            if (y.current.has(w.step_request_id)) return;
            l.current !== w.step_request_id && l.current && y.current.add(l.current), l.current = w.step_request_id, o(w);
          }
          const p = Z(c.output);
          p && N(p) && _(p), c.type === "result" && Number(c.status) === 2 && m(c.msg || "生成中断，已完成内容已保留");
        },
        onEnd: () => {
          A() && r().catch((c) => {
            A() && a(c);
          });
        },
        onError: (c) => {
          A() && (B(), a(c));
        }
      }
    );
    return () => {
      F = !0, v();
    };
  }, [
    _,
    u,
    i,
    n,
    s,
    r,
    e,
    a,
    d,
    f,
    t?.work_asset_id,
    t?.run_id,
    t?.request_id
  ]), {
    generationError: t?.document.status === "running" || t?.document.status === "ready" ? "" : g,
    generationTiming: b,
    preview: Y(S, t) ? S : ct(t),
    clearPreview: I,
    clearGenerationError: R
  };
}
function ae({
  projectId: e,
  canvasId: t,
  node: n,
  output: s,
  onAssetUpdated: i,
  readOnMount: d = !0
}) {
  const [u, _] = T(
    () => K(n, s)
  ), r = $(u), a = n.asset?.id || n.resultRef?.asset_id, f = `${e}:${t}:${n.id}:${a || 0}`, g = $(f), m = $(a), b = $(n.asset), k = $(i), S = $(0), o = $(!0), [l, y] = T(""), I = q(
    (v) => y(v instanceof Error ? v.message : "创作操作失败"),
    []
  );
  O(() => {
    g.current = f, m.current = a, b.current = n.asset, k.current = i;
  }, [f, a, n.asset, i]), O(() => (o.current = !0, () => {
    o.current = !1;
  }), []);
  const R = q((v) => {
    if (!o.current || m.current && v.work_asset_id !== m.current)
      return v;
    const c = dt(r.current, v);
    if (r.current = c, _(c), b.current?.id === c.work_asset_id && c === v) {
      const w = b.current, p = {
        ...w,
        name: c.document.title,
        version_id: c.work_version_id,
        version: {
          ...w.version,
          id: c.work_version_id,
          asset_id: c.work_asset_id,
          version: c.work_version || w.version?.version || 1,
          updated_at: c.work_updated_at,
          content: {
            json: c.document,
            writing_revision: c.work_revision
          }
        }
      };
      b.current = p, k.current?.(p);
    }
    return c;
  }, []), h = q(async () => {
    const v = g.current, c = n.asset?.id || n.resultRef?.asset_id || r.current?.work_asset_id;
    if (!c) return;
    const w = ++S.current, p = await lt({
      projectId: e,
      assetId: c,
      currentOnly: !0,
      reportError: !1
    });
    if (!o.current || w !== S.current || g.current !== v)
      return;
    const C = ft(p.asset.version?.content);
    if (!C) throw new Error("作品内容格式不正确");
    b.current = p.asset;
    const P = r.current;
    R({
      work_asset_id: c,
      work_version_id: p.asset.version_id,
      work_revision: L(p.asset.version),
      work_version: p.asset.version?.version,
      work_updated_at: p.asset.version?.updated_at || p.asset.version?.created_at,
      document: C,
      run_id: C.active_run_id,
      request_id: C.active_request_id,
      status: C.status,
      checkpoint: P?.run_id === C.active_run_id && P.work_revision === L(p.asset.version) ? P.checkpoint : void 0,
      proposal: P?.run_id === C.active_run_id && P.work_revision === L(p.asset.version) ? P.proposal : void 0
    });
  }, [R, n.asset?.id, n.resultRef?.asset_id, e]);
  O(() => {
    d && h().catch(I);
  }, [h, d, I]), O(() => {
    const v = n.asset?.id || n.resultRef?.asset_id, c = n.asset?.version_id || n.resultRef?.version_id, w = r.current;
    d && w && w.work_asset_id === v && c && c > w.work_version_id && h().catch(I);
  }, [
    h,
    d,
    n.asset?.id,
    n.asset?.version_id,
    n.resultRef?.asset_id,
    n.resultRef?.version_id,
    I
  ]), O(() => {
    const v = K(n, s, r.current);
    v && R(v);
  }, [R, n, s]);
  const {
    generationTiming: D,
    generationError: F,
    preview: N,
    clearPreview: A,
    clearGenerationError: x
  } = jt({
    projectId: e,
    snapshot: u,
    snapshotRef: r,
    workAssetIdRef: m,
    scopeRef: g,
    scope: f,
    mounted: o,
    acceptSnapshot: R,
    loadWork: h,
    reportError: I,
    observeCompletedRuns: d
  }), G = q(
    (v, c = {}, w) => {
      const p = r.current;
      if (!p) throw new Error("请等待作品加载完成");
      return {
        project_id: e,
        canvas_id: t,
        work_asset_id: p.work_asset_id,
        expected_work_version_id: w ?? p.work_version_id,
        expected_work_revision: p.work_revision,
        action: v,
        ...c
      };
    },
    [t, e]
  ), B = q(async () => {
    const v = r.current;
    !v?.run_id || v.document.status !== "running" || (await _t({
      projectId: e,
      runId: v.run_id,
      requestId: v.request_id,
      reportError: !1
    }), await h());
  }, [h, e]);
  return {
    snapshot: u,
    snapshotRef: r,
    mounted: o,
    acceptSnapshot: R,
    loadWork: h,
    command: G,
    stopRun: B,
    reportError: I,
    setError: y,
    error: l || F || (!u && n.asset?.version?.content != null ? "作品内容格式不正确" : ""),
    generationTiming: D,
    preview: N,
    clearPreview: A,
    clearGenerationError: x
  };
}
function de(e, t, n, s) {
  if (!t || !Object.keys(t.fields).length) return e;
  const i = { ...e }, d = (r, a, f) => {
    i.outline === e.outline && (i.outline = { ...e.outline }), i.outline[r] === e.outline[r] && (i.outline[r] = [...e.outline[r]]);
    const g = i.outline[r];
    return g[a] ? g[a] === e.outline[r][a] && (g[a] = { ...g[a] }) : g[a] = { id: f, name: "", description: "" }, g[a];
  }, u = (r) => (i.units === e.units && (i.units = [...e.units]), i.units[r] ? i.units[r] === e.units[r] && (i.units[r] = { ...i.units[r] }) : i.units[r] = {
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
  }, i.units[r]), _ = t.values || {};
  for (const r of ["characters", "locations", "props"])
    for (let a = 0; ; a++) {
      const f = _[`outline.${r}.${a}.id`];
      if (typeof f != "string") break;
      d(r, a, f).id = f;
    }
  for (const [r, a] of Object.entries(t.fields)) {
    const f = r.replace(/\[(\d+)\]/g, ".$1"), g = /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
      f
    );
    if (g) {
      const o = g[1];
      if (e.preferences[o]) continue;
      const l = o === "chapter_words" || o === "planned_chapters" ? _[f] : a, y = { ...i.preferences, [o]: l };
      pt(y) && (i.preferences = y);
      continue;
    }
    const m = /^inspirations\.(\d+)\.(title|content)$/.exec(f), b = /^units\.(\d+)\.(title|plan)$/.exec(f), k = /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
      f
    ), S = f.startsWith("outline.") ? f.slice(8) : f === "content" ? t.section_id : void 0;
    if (S && V(S))
      i.outline === e.outline && (i.outline = { ...e.outline }), i.outline[S] = a;
    else if (m) {
      const o = t.inspiration_id ? i.inspirations.findIndex(
        (l) => l.id === t.inspiration_id
      ) : Number(m[1]);
      if (o < 0) continue;
      i.inspirations === e.inspirations && (i.inspirations = [...e.inspirations]), i.inspirations[o] && i.inspirations[o] === e.inspirations[o] && (i.inspirations[o] = { ...i.inspirations[o] }), i.inspirations[o] ||= { id: "", title: "", content: "" }, i.inspirations[o][m[2]] = a;
    } else if (b) {
      const o = Number(b[1]), l = n === "generate_chapters" && s?.length ? i.units.findIndex(
        (y) => y.id === s[o]
      ) : o + (n === "append" ? e.units.length : 0);
      if (l < 0 || s?.length && n === "generate_chapters" && !s[o])
        continue;
      u(l)[b[2]] = a;
    } else if (k) {
      const o = k[1] || t.section_id;
      if (o !== "characters" && o !== "locations" && o !== "props")
        continue;
      const l = t.entity_id ? i.outline[o].findIndex(
        (y) => y.id === t.entity_id
      ) : Number(k[2]);
      if (l < 0) continue;
      d(o, l, `preview:${o}:${l}`)[k[3]] = a;
    } else if (t.section_id === "chapter_plan" && t.unit_id && f === "plan") {
      const o = i.units.findIndex(
        (l) => l.id === t.unit_id
      );
      o >= 0 && (u(o).plan = a);
    }
  }
  return i;
}
const Dt = {
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
function Gt(e) {
  return Dt[e] || "创作任务";
}
const M = [
  { id: "preferences", label: "生成写作设定" },
  { id: "direction", label: "生成故事总纲" },
  { id: "characters", label: "生成人物" },
  { id: "background", label: "生成背景" },
  { id: "chapters", label: "规划章节剧情" }
];
function le(e) {
  if (e?.checkpoint?.action !== "generate_outline") return "";
  const t = M.findIndex(
    ({ id: n }) => n === e.checkpoint?.phase
  );
  return t >= 0 ? `第${t + 1}/${M.length}步` : "";
}
function fe(e) {
  const t = e?.checkpoint;
  if (!e) return "正在准备创作";
  if (!t) return "创作任务";
  const { document: n } = e;
  if (t.phase) {
    const u = M.find(({ id: f }) => f === t.phase), _ = t.phase === "continuity" ? t.continuity_unit_id || t.unit_id : t.unit_id || t.unit_ids?.[t.completed], r = _ ? n.units.findIndex((f) => f.id === _) : -1, a = t.phase === "continuity" && t.history_total ? `正在整理前文 ${t.history_completed || 0}/${t.history_total}` : u ? `${n.status === "running" ? "正在" : ""}${u.label}` : t.phase === "body" ? "正在写正文" : "正文已保存，整理剧情衔接";
    if (t.phase === "chapters") {
      const f = Math.min(
        E,
        t.count || n.preferences.planned_chapters || (n.preferences.mode === "serial" ? 10 : 5)
      );
      return `${a} · 第 1—${f} 章`;
    }
    return `${a}${r >= 0 ? ` · 第 ${r + 1} 章` : ""}`;
  }
  const s = Gt(t.action);
  if (t.action === "append") {
    const u = gt(
      n.units,
      n.preferences.planned_chapters,
      t.count
    );
    return `${s} · 第 ${u.start}—${u.end} 章`;
  }
  if (t.action === "generate_chapters" && t.unit_ids.length) {
    const u = z(n.units), _ = t.unit_ids.flatMap((r) => {
      const a = u.byId.get(r);
      return a ? [a] : [];
    });
    return `${s} · ${Q(_)}`;
  }
  const i = t.unit_ids?.[t.completed] || t.unit_id, d = n.units.find((u) => u.id === i);
  if (d)
    return `${s} · ${ht(n, { kind: "unit", id: d.id })}${t.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (t.action === "generate_section" || t.action === "propose_edit") {
    const u = [...H, ...vt].find(
      (r) => r.id === t.section_id
    ), _ = wt.flatMap(({ id: r }) => n.outline[r]).find((r) => r.id === t.entity_id);
    return `${s}${u ? ` · ${u.label}` : ""}${_ ? ` · ${_.name}` : ""}`;
  }
  return s;
}
export {
  ue as C,
  ce as a,
  Ut as b,
  Ht as c,
  te as d,
  ee as e,
  le as f,
  fe as g,
  Gt as h,
  ne as i,
  Nt as j,
  re as k,
  oe as l,
  de as p,
  se as r,
  ae as u,
  ie as w
};
