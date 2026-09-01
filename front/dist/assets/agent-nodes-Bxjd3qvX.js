import { j as u, a as m, F as je } from "./preloadable-Bomi5PEU.js";
import { a as S, d as lt, e as Z, u as it, g as qs, b as ut } from "./_commonjsHelpers-61wyk6v6.js";
import { r as ht, aH as gr, af as Vs, aj as Hs, h as hr, s as Us, Q as Ks, ax as Gs, aI as Js, R as Jn, e as Ys, X as Ws, q as Zs } from "./vendor-icons-DwjYEojZ.js";
import { a as Qs, u as Dt } from "./react-C4Ibrr0U.js";
import { a as Y, r as Be, A as Xs, b as ti, i as Ie } from "./skill-draft-patch-BIImx0jc.js";
await window.DeverFront?.ensureCompat?.(["@/lib/stream", "@/lib/runtime-stream-output", "@/components/stream-timing", "@/components/energon/content-view", "@/components/energon/progress", "@/components/ui/sheet"]);
const Le = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!Le || Object.keys(Le).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const Nt = Le.streamValueText, $e = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!$e || Object.keys($e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const ot = $e.isPlainRecord, qe = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!qe || Object.keys(qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const ei = qe.StreamTimingBadge, Ve = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Ve || Object.keys(Ve).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ni = Ve.EnergonContentView, He = window.DeverFront?.sdk?.getCompatModule("@/components/energon/progress");
if (!He || Object.keys(He).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/progress");
const ri = He.EnergonProgressBlock, vt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/sheet");
if (!vt || Object.keys(vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/sheet");
const si = vt.Sheet, ii = vt.SheetContent, oi = vt.SheetDescription, ai = vt.SheetHeader, ci = vt.SheetTitle;
function li({
  detail: t,
  running: e,
  timing: n,
  now: r,
  onOpen: s
}) {
  const a = t.tasks.filter((x) => x.status === "failed"), l = t.tasks.filter((x) => x.status === "succeeded"), d = t.tasks.length > 0 ? `素材 ${l.length}/${t.tasks.length}${a.length ? `，失败 ${a.length}` : ""}` : "正文已生成";
  return /* @__PURE__ */ m(
    "button",
    {
      type: "button",
      className: "block w-full rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/40",
      onClick: s,
      children: [
        n ? /* @__PURE__ */ u("div", { className: "mb-2", children: /* @__PURE__ */ u(ei, { timing: n, now: r, className: "max-w-full" }) }) : null,
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ m("div", { className: "min-w-0", children: [
            /* @__PURE__ */ u("div", { className: "truncate text-sm font-medium", children: "内容已生成" }),
            /* @__PURE__ */ u("div", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: d })
          ] }),
          /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2 text-xs text-primary", children: [
            e ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : null,
            "查看结果",
            /* @__PURE__ */ u(gr, { className: "size-3.5" })
          ] })
        ] })
      ]
    }
  );
}
function ui({
  open: t,
  detail: e,
  running: n,
  suggestions: r,
  onOpenChange: s
}) {
  const a = e?.title || "最终结果", l = e?.result ? xr(e.result, e.tasks) : void 0, d = di(e?.progressText);
  return /* @__PURE__ */ u(si, { open: t, onOpenChange: s, children: /* @__PURE__ */ m(
    ii,
    {
      side: "right",
      className: "flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
      children: [
        /* @__PURE__ */ m(ai, { className: "border-b px-5 py-4 text-start", children: [
          /* @__PURE__ */ u(ci, { className: "truncate", children: a }),
          /* @__PURE__ */ u(oi, { children: n ? "内容和素材仍在更新。" : "最终结果可在这里完整查看。" })
        ] }),
        /* @__PURE__ */ m("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 py-4", children: [
          d ? /* @__PURE__ */ u("div", { className: "mb-4", children: /* @__PURE__ */ u(
            ri,
            {
              message: d,
              percent: e.progress
            }
          ) }) : null,
          l ? /* @__PURE__ */ u(ni, { output: l, emptyText: "暂无结果内容。" }) : /* @__PURE__ */ u("div", { className: "rounded-md border bg-muted/25 px-3 py-2 text-sm text-muted-foreground", children: "正在准备结果内容。" })
        ] }),
        r ? /* @__PURE__ */ u("div", { className: "border-t px-5 py-3", children: r }) : null
      ]
    }
  ) });
}
function di(t) {
  const e = Nt(t).trim();
  return e ? [
    "内容已生成，点击查看结果。",
    "等待生成结果",
    "等待智能体返回",
    "图片生成中，请稍后",
    "素材生成中，请稍后",
    "内容生成中，请稍后",
    "生成中，请稍后"
  ].some((r) => e.includes(r)) ? "" : e : "";
}
function xr(t, e) {
  if (e.length === 0)
    return t;
  const n = /* @__PURE__ */ new Map();
  e.forEach((a) => {
    a.placeholderID && n.set(a.placeholderID, a), n.set(a.id, a);
  });
  const r = { ...t }, s = Yn(r.rich, n);
  if (s && (r.rich = s), ot(r.content)) {
    const a = { ...r.content }, l = Yn(a.rich, n);
    l && (a.rich = l, r.content = a);
  }
  return r;
}
function Yn(t, e) {
  if (!ot(t))
    return t;
  const n = yr(t, e);
  return n.length === 1 ? n[0] : t;
}
function yr(t, e) {
  const n = Nt(t.type), r = { ...t };
  if (n === "agentAbilityPlaceholder" || n === "agentTaskPlaceholder") {
    const s = ot(t.attrs) ? { ...t.attrs } : {}, a = Nt(
      s.placeholder_id || s.placeholderId || s.id
    ), l = e.get(a);
    if (l) {
      const d = fi(l);
      if (d.length > 0)
        return d;
      r.attrs = {
        ...s,
        status: l.status,
        progress: l.progress,
        title: l.title,
        kind: l.kind,
        text: l.text,
        error: l.error
      };
    }
    return [r];
  }
  if (Array.isArray(t.content)) {
    const s = [];
    t.content.forEach((a) => {
      ot(a) ? s.push(...yr(a, e)) : s.push(a);
    }), r.content = s;
  }
  return [r];
}
function fi(t) {
  if (t.status !== "succeeded" || !t.output)
    return [];
  const e = t.kind.toLowerCase();
  if (e === "image" || e === "images" || e === "cover") {
    const a = Pt(
      "editorMediaImage",
      Et(t.output, "images", "image"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "video" || e === "videos") {
    const a = Pt(
      "editorMediaVideo",
      Et(t.output, "videos", "video"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "audio" || e === "audios" || e === "song" || e === "music") {
    const a = Pt(
      "editorMediaAudio",
      Et(t.output, "audios", "audio"),
      t.title
    );
    if (a.length > 0)
      return [...a, ...pi(t.output)];
  }
  const n = [
    ...Pt(
      "editorMediaImage",
      Et(t.output, "images", "image"),
      t.title
    ),
    ...Pt(
      "editorMediaVideo",
      Et(t.output, "videos", "video"),
      t.title
    ),
    ...Pt(
      "editorMediaAudio",
      Et(t.output, "audios", "audio"),
      t.title
    )
  ];
  if (n.length > 0)
    return n;
  const r = br(t.output);
  if (r.length > 0)
    return r;
  const s = wr(t.output);
  return s ? _r(s) : [];
}
function Pt(t, e, n) {
  return e.map((r) => ({
    type: t,
    attrs: {
      src: r,
      title: n,
      alt: n
    }
  }));
}
function Et(t, e, n) {
  const r = ot(t.content) ? t.content : {};
  return gi([
    ...Jt(r[e]),
    ...Jt(r[n]),
    ...Jt(t[e]),
    ...Jt(t[n])
  ]);
}
function br(t) {
  const e = ot(t.content) ? t.content : {}, n = ot(t.rich) ? t.rich : ot(e.rich) ? e.rich : null;
  return !n || Nt(n.type) !== "doc" || !Array.isArray(n.content) ? [] : n.content.filter(
    (r) => ot(r)
  );
}
function wr(t) {
  const e = ot(t.content) ? t.content : {}, n = t;
  return Nt(
    t.text || e.text || n.lyrics || e.lyrics || n.lyric || e.lyric || n.lrc || e.lrc || n.song_lyrics || e.song_lyrics || n.songLyrics || e.songLyrics || t.title || e.title
  ).trim();
}
function pi(t) {
  const e = br(t);
  if (e.length > 0)
    return e;
  const n = wr(t);
  return n ? _r(n) : [];
}
function _r(t) {
  return t.split(/\n{2,}/).map((e) => e.trim()).filter(Boolean).map((e) => ({
    type: "paragraph",
    content: mi(e)
  }));
}
function mi(t) {
  const e = t.split(/\n/), n = [];
  return e.forEach((r, s) => {
    s > 0 && n.push({ type: "hardBreak" }), r && n.push({ type: "text", text: r });
  }), n;
}
function Jt(t) {
  if (t == null)
    return [];
  if (typeof t == "string") {
    const n = t.trim();
    return n ? [n] : [];
  }
  if (Array.isArray(t))
    return t.flatMap((n) => Jt(n));
  if (ot(t))
    for (const n of ["url", "src", "uri", "href"]) {
      const r = Nt(t[n]).trim();
      if (r)
        return [r];
    }
  const e = Nt(t).trim();
  return e ? [e] : [];
}
function gi(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  return t.forEach((r) => {
    const s = r.trim();
    !s || e.has(s) || (e.add(s), n.push(s));
  }), n;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/agent/runner", "@/lib/assistant/reference", "@/lib/page-schema-reload", "@/lib/runtime-stream-output", "@/lib/store", "@/lib/stream", "@/lib/runtime-stream-runner", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/components/ui/textarea", "@/components/agent/interaction-panel", "@/components/assistant/reference-picker", "@/components/stream-timing", "@/components/assistant/session-history-dialog", "@/lib/page-data-reload"]);
const Ue = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Ue || Object.keys(Ue).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const hi = Ue.request, me = window.DeverFront?.sdk?.getCompatModule("@/lib/agent/runner");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent/runner");
const xi = me.runAgentStream, yi = me.stopAgentStream, ge = window.DeverFront?.sdk?.getCompatModule("@/lib/assistant/reference");
if (!ge || Object.keys(ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/assistant/reference");
const bi = ge.assistantReferencePayload, wi = ge.buildAssistantReferenceMessage, Ke = window.DeverFront?.sdk?.getCompatModule("@/lib/page-schema-reload");
if (!Ke || Object.keys(Ke).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-schema-reload");
const kr = Ke.reloadStorePageSchema, Ct = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!Ct || Object.keys(Ct).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const Ge = Ct.isEmptyRuntimeOutput, p = Ct.isPlainRecord, zt = Ct.normalizeRuntimeFrameOutput, _i = Ct.resolveRuntimeFrameCancelable, Q = Ct.runtimeErrorMessage, Je = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!Je || Object.keys(Je).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const xt = Je.getStoreValueByPath, Ye = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!Ye || Object.keys(Ye).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const o = Ye.streamValueText, We = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!We || Object.keys(We).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const ki = We.watchRuntimeStream, Ze = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Ze || Object.keys(Ze).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Zt = Ze.cn, Qe = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Qe || Object.keys(Qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const L = Qe.Button, Tt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!Tt || Object.keys(Tt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const Sr = Tt.Dialog, Ar = Tt.DialogContent, Dr = Tt.DialogDescription, Nr = Tt.DialogHeader, vr = Tt.DialogTitle, Xe = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!Xe || Object.keys(Xe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const Si = Xe.Input, tn = window.DeverFront?.sdk?.getCompatModule("@/components/ui/textarea");
if (!tn || Object.keys(tn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/textarea");
const Cr = tn.Textarea, en = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!en || Object.keys(en).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const Ai = en.AgentInteractionPanel, he = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/reference-picker");
if (!he || Object.keys(he).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/reference-picker");
const Di = he.AssistantReferenceList, Ni = he.AssistantReferencePicker, at = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!at || Object.keys(at).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const vi = at.cancelStreamTiming, Ci = at.StreamTimingBadge, Ti = at.createRuntimeStreamTiming, Tr = at.createStreamTiming, Oe = at.finishStreamTiming, Ri = at.isStreamTimingStatusOutput, Mi = at.markStreamTimingStopping, Ii = at.updateStreamTimingFromOutput, Oi = at.useStreamClock, nn = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/session-history-dialog");
if (!nn || Object.keys(nn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/session-history-dialog");
const rn = window.DeverFront?.sdk?.getCompatModule("@/lib/page-data-reload");
if (!rn || Object.keys(rn).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-data-reload");
const dn = "z-[100]", fn = 1e3, Rr = 3, Wn = "/bot/admin/agent/run", Pi = "/bot/admin/agent/run_status", Zn = nn.AssistantSessionHistoryDialog, Ei = typeof Zn == "function" ? Zn : Ki, Qn = rn.reloadStoreDataContainer, pn = [
  "title",
  "rich",
  "images",
  "videos",
  "audios",
  "files",
  "json"
], Pe = {
  text: "",
  finalOutput: null
}, zi = 15 * 1e3, Fi = 1500, ji = 6;
function Bi({ item: t, store: e }) {
  const n = Qs(), [r, s] = S([]), [a, l] = S(""), [d, x] = S([]), [b, C] = S(""), [_, z] = S(""), [D, I] = S(0), [O, T] = S(!1), [yt, X] = S(!1), [dt, F] = S(!1), [G, tt] = S(!1), [ft, y] = S([]), [et, q] = S(!1), [Rt, pt] = S(""), [w, ee] = S(!1), [_n, Ft] = S(!1), [we, jt] = S(!1), [kn, K] = S(""), [Sn, ne] = S("0-0"), [ns, Bt] = S(!1), [_e, Lt] = S(""), [ke, re] = S(""), Mt = lt(0), Se = lt(null), Ae = lt(""), De = lt(""), An = lt(""), mt = lt(0), Dn = lt(/* @__PURE__ */ new Set()), Nn = lt(!1), Ne = Z(() => {
    const i = Se.current;
    i && Xn(i);
  }, []), A = Dt(
    e,
    () => o(xt(e, String(t.meta?.agentPath || "")))
  ), kt = Dt(
    e,
    () => o(
      xt(e, String(t.meta?.agentNamePath || ""))
    )
  ), ct = String(t.meta?.openPath || ""), St = Dt(
    e,
    () => ct ? !!xt(e, ct) : !0
  ), vn = String(t.meta?.requestApi || Wn), Cn = String(t.meta?.streamApi || "/bot/admin/agent/stream"), Tn = String(t.meta?.stopApi || "/bot/admin/agent/stop"), ve = Object.prototype.hasOwnProperty.call(
    t.meta || {},
    "runStatusApi"
  ) ? String(t.meta?.runStatusApi || "") : vn === Wn ? Pi : "", rs = String(
    t.meta?.paramApi || "/bot/admin/energon/power_params"
  ), P = !!t.meta?.sessionEnabled, se = P && t.meta?.historyEnabled !== !1, ss = t.meta?.newSessionEnabled !== !1, bt = P && G, ie = String(
    t.meta?.sessionApi || "/bot/admin/assistant/session"
  ), Rn = String(
    t.meta?.sessionsApi || "/bot/admin/assistant/sessions"
  ), Mn = String(
    t.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session"
  ), In = String(
    t.meta?.restoreSessionApi || "/bot/admin/assistant/restore_session"
  ), On = String(
    t.meta?.renameSessionApi || "/bot/admin/assistant/rename_session"
  ), Pn = String(
    t.meta?.newSessionApi || "/bot/admin/assistant/new_session"
  ), is = String(
    t.meta?.clearSessionApi || "/bot/admin/assistant/clear_session"
  ), os = String(
    t.meta?.messageApi || "/bot/admin/assistant/message"
  ), En = String(
    t.meta?.memoriesApi || "/bot/admin/assistant/memories"
  ), zn = String(
    t.meta?.updateMemoryApi || "/bot/admin/assistant/update_memory"
  ), Fn = String(
    t.meta?.forgetMemoryApi || "/bot/admin/assistant/forget_memory"
  ), oe = String(t.meta?.skillDraftPatchApi || ""), as = String(
    t.meta?.skillDraftPatchListPath || "/bot/agent/skill_draft/list"
  ), cs = t.meta?.skillDraftPatchAutoApply !== !1, J = Dt(
    e,
    () => Wi(t.meta?.sessionContext, e, A)
  ), jn = Number(t.meta?.blockMs || 1e3), Bn = String(t.meta?.initialInput || ""), ls = String(
    t.meta?.placeholder || "输入本轮任务，当前弹窗内的上下文会一起发送。"
  ), us = String(t.meta?.emptyText || ""), ds = o(t.meta?.height || t.meta?.containerHeight).trim() || "min(calc(85vh - 11rem), 620px)", ae = it(
    () => [...r].reverse().find(
      (i) => i.role === "assistant" && i.interaction && !i.interactionAnswered
    ),
    [r]
  ), $t = ae?.id || "", qt = it(() => _e && r.find(
    (i) => i.id === _e && i.role === "assistant" && !!i.interaction
  ) || ae, [_e, r, ae]), wt = it(() => {
    if (ke)
      return r.find(
        (i) => i.id === ke && i.role === "assistant"
      );
  }, [r, ke]), Ce = it(
    () => wt ? Xt(wt) : null,
    [wt]
  ), fs = !!wt?.running, Ln = it(
    () => wt ? Hr(
      wt,
      !!Ce
    ) : [],
    [Ce, wt]
  ), nt = it(
    () => r.some(
      (i) => i.role === "assistant" && !!i.running
    ),
    [r]
  ), ps = it(
    () => (a.trim().length > 0 || d.length > 0) && A.length > 0 && !O && !w && !nt,
    [
      A,
      nt,
      a,
      d.length,
      w,
      O
    ]
  ), ms = it(
    () => r.some(
      (i) => i.actionTiming && i.actionTiming.status === "running"
    ),
    [r]
  ), gs = Oi(ms), ce = it(
    () => Li(r),
    [r]
  ), $n = it(
    () => ft.filter(an).length,
    [ft]
  );
  qs(() => {
    if (!ce || ce === Ae.current)
      return;
    Ae.current = ce;
    const i = Se.current;
    if (i)
      return Xn(i);
  }, [ce]);
  const gt = Z(() => {
    mt.current += 1, Ae.current = "", s([]), l(Bn), x([]), C(""), z(""), Mt.current = 0, I(0), tt(!1), y([]), pt(""), ee(!1), Ft(!1), jt(!1), K(""), ne("0-0"), Bt(!1), Lt(""), re(""), X(!1), F(!1);
  }, [Bn]), Vt = Z(
    (i) => {
      const c = p(i) ? i : {}, f = p(c.session) ? c.session : {}, g = Number(f.id || 0), k = Number.isFinite(g) ? g : 0;
      Mt.current = k, I(k), tt(!!c.memory_enabled), s(so(c.messages)), y(ur(c.memories)), Ne();
    },
    [Ne]
  ), Ht = Z(
    async (i = !1) => {
      if (!(!P || !A)) {
        T(!0);
        try {
          const c = await Y(
            i ? Pn : ie,
            {
              agent_key: A,
              context_key: J,
              title: kt ? `${kt} 会话` : "新会话",
              limit: 80
            }
          );
          Vt(c), K("");
        } catch (c) {
          K(Q(c, "加载会话失败。"));
        } finally {
          T(!1);
        }
      }
    },
    [
      A,
      kt,
      Vt,
      Pn,
      ie,
      J,
      P
    ]
  ), hs = async () => {
    if (!P || !D || w) {
      gt();
      return;
    }
    T(!0);
    try {
      const i = await Y(is, {
        session_id: D
      });
      Vt(i);
    } catch (i) {
      K(Q(i, "清空会话失败。"));
    } finally {
      T(!1);
    }
  }, xs = Z(
    async (i) => {
      if (!se || !A)
        return mo(i);
      const c = await Y(Rn, {
        agent_key: A,
        context_key: J,
        page: i.page,
        page_size: i.pageSize,
        keyword: i.keyword,
        status: i.status
      }), f = p(c) ? c : {};
      return K(""), {
        sessions: fo(f.sessions),
        pagination: po(f.pagination, i)
      };
    },
    [A, se, J, Rn]
  ), It = Z(async () => {
    if (!bt || !A) {
      y([]);
      return;
    }
    q(!0);
    try {
      const i = D || Mt.current, c = await Y(En, {
        agent_key: A,
        context_key: J,
        session_id: i || void 0,
        scope: "current",
        status: "all",
        page: 1,
        page_size: 50
      }), f = p(c) ? c : {};
      y(ur(f.memories)), pt(""), K("");
    } catch (i) {
      pt(Q(i, "加载长期记忆失败。"));
    } finally {
      q(!1);
    }
  }, [
    A,
    En,
    bt,
    J,
    D
  ]), ys = Z(() => {
    F(!0);
  }, []), bs = Z(
    async (i, c) => {
      if (!bt || i <= 0)
        return;
      const f = D || Mt.current, g = await Y(zn, {
        id: i,
        ...c,
        agent_key: A,
        context_key: J,
        session_id: f || void 0
      }), k = p(g) ? g : {}, h = Ur(k.memory);
      h ? y((M) => Bo(M, h)) : await It(), pt("");
    },
    [
      A,
      It,
      bt,
      J,
      D,
      zn
    ]
  ), ws = Z(
    async (i) => {
      !bt || i <= 0 || (await Y(Fn, { id: i }), y(
        (c) => c.map(
          (f) => f.id === i ? { ...f, status: 2 } : f
        )
      ), pt(""));
    },
    [Fn, bt]
  ), _s = Z(
    async (i) => {
      await Y(Mn, {
        session_id: i
      });
    },
    [Mn]
  ), ks = Z(
    async (i) => {
      await Y(In, {
        session_id: i
      });
    },
    [In]
  ), Ss = Z(
    async (i, c) => {
      const f = await Y(On, {
        session_id: i,
        title: c
      });
      return Or(
        p(f) ? f.session : null
      );
    },
    [On]
  ), As = async (i) => {
    if (!(!i || w)) {
      T(!0);
      try {
        const c = await Y(ie, {
          session_id: i,
          agent_key: A,
          context_key: J,
          limit: 80
        });
        Vt(c), X(!1), K("");
      } catch (c) {
        K(Q(c, "打开会话失败。"));
      } finally {
        T(!1);
      }
    }
  }, Ds = async () => {
    if (!P || w) {
      gt();
      return;
    }
    gt(), await Ht(!0);
  }, Ns = async () => {
    if (!P)
      return 0;
    if (D > 0)
      return D;
    const i = await Y(ie, {
      agent_key: A,
      context_key: J,
      title: kt ? `${kt} 会话` : "新会话",
      limit: 80
    });
    Vt(i);
    const c = p(i) && p(i.session) ? i.session : {}, f = Number(c.id || 0);
    return Number.isFinite(f) ? f : 0;
  }, le = async (i, c, f) => {
    if (!(!P || i <= 0))
      return await Y(os, {
        session_id: i,
        agent_key: A,
        context_key: J,
        role: c.role,
        kind: c.kind || "chat",
        text: c.text,
        content: {
          kind: c.kind,
          data: c.data,
          interaction: c.interaction,
          interaction_answered: c.interactionAnswered,
          interaction_data: c.interactionData
        },
        output: f?.output || c.output || {},
        request_id: f?.requestID || c.requestID || "",
        status: f?.status || 1
      });
  }, vs = async (i, c) => {
    const f = nr(i);
    if (!f)
      return;
    const g = await tr(
      ve,
      f
    ).catch(() => null), k = er(g, f);
    if (!k || Number(k.status) === 2)
      return;
    const h = zt(k?.output, k), M = Yt(h), N = Wt(h) || o(k?.msg), R = {
      ...i,
      text: N,
      output: {
        text: N,
        finalOutput: $(h, N)
      },
      interaction: M,
      interactionAnswered: M ? !1 : void 0,
      running: !1,
      error: void 0,
      requestID: f
    };
    s(
      (V) => V.map(
        (H) => H.id === i.id ? R : H
      )
    ), await le(c, R, {
      requestID: f,
      output: h,
      status: 1
    });
  };
  ut(() => {
    !P || D <= 0 || r.forEach((i) => {
      const c = nr(i);
      !c || Dn.current.has(c) || (Dn.current.add(c), vs(i, D));
    });
  }, [r, ve, P, D]), ut(() => {
    ct && (St && !Nn.current && !w && gt(), Nn.current = St);
  }, [St, ct, gt, w]), ut(() => {
    gt();
  }, [A, gt]), ut(() => {
    !P || !A || ct && !St || w || $t || Ht(!1);
  }, [
    A,
    Ht,
    St,
    ct,
    $t,
    w,
    P
  ]), ut(() => {
    dt && It();
  }, [It, dt]), ut(() => {
    if (!P || !A || w || O || ct && !St || !nt)
      return;
    const i = window.setTimeout(() => {
      Ht(!1);
    }, 2e3);
    return () => {
      window.clearTimeout(i);
    };
  }, [
    A,
    nt,
    Ht,
    St,
    ct,
    w,
    P,
    O
  ]), ut(() => {
    $t && (Lt($t), Bt(!0));
  }, [$t]);
  const Cs = (i) => {
    Lt(i), Bt(!0);
  }, Ts = (i) => {
    Bt(i), i || Lt("");
  }, qn = async () => {
    const i = d, c = a.trim() || (i.length > 0 ? "请根据参考资料和当前任务进行分析。" : "");
    if (!c || w || nt)
      return;
    const f = bi(i);
    i.length > 0 && (x([]), C("")), await Te(
      {
        text: c,
        ...f ? { reference_files: f } : {}
      },
      {
        role: "user",
        text: wi(c, i),
        kind: "chat",
        data: f ? { reference_files: f } : void 0
      },
      r
    );
  }, Vn = async (i) => {
    const c = i.prompt.trim();
    !c || w || nt || (re(""), await Te(
      { text: c },
      {
        role: "user",
        text: c,
        kind: "chat"
      },
      r,
      "",
      void 0
    ));
  }, Rs = async (i) => {
    const c = qt;
    if (!c?.interaction || c.interactionAnswered || w)
      return;
    const f = co(
      r,
      c.id,
      i.data
    );
    Bt(!1), Lt(""), await Te(
      {
        type: "interaction_result",
        interaction_id: c.interaction.id || "",
        interaction_type: c.interaction.type || "",
        interaction: c.interaction,
        data: i.data,
        user_feedback: i.data,
        feedback: i.data,
        text: i.text
      },
      {
        role: "user",
        text: i.text,
        kind: "interaction_result",
        data: i.data
      },
      f,
      c.id,
      i.data
    );
  }, Te = async (i, c, f, g = "", k) => {
    if (!A) {
      K("未选择智能体。");
      return;
    }
    let h = 0;
    if (P)
      try {
        h = await Ns();
      } catch (v) {
        K(Q(v, "创建会话失败。"));
        return;
      }
    const M = mt.current + 1, N = {
      id: `${M}-user-${Date.now()}`,
      ...c
    }, R = `${M}-assistant-${Date.now()}`, V = {
      id: R,
      role: "assistant",
      text: "",
      output: Pe,
      running: !0,
      actionTiming: Tr("等待智能体返回")
    }, H = ko(f), rt = go(
      i,
      pe(t.meta?.inputContext, e)
    );
    h > 0 && (rt.assistant_session_id = h), mt.current = M, De.current = "", s((v) => [...g ? v.map(
      (st) => st.id === g ? {
        ...st,
        interactionAnswered: !0,
        interactionData: k
      } : st
    ) : v, N, V]), Ne(), l(""), ee(!0), Ft(!1), jt(!1), K(""), z(""), ne("0-0");
    try {
      await le(h, N);
    } catch (v) {
      K(Q(v, "保存用户消息失败。"));
    }
    let U = !1, W = "", j = "0-0", At = !1, Ot = null;
    const Kt = (v) => {
      const B = o(v);
      !B || h <= 0 || At || (At = !0, Ot = le(
        h,
        {
          ...V,
          text: "智能体正在处理...",
          requestID: B
        },
        {
          requestID: B,
          output: {
            event: "running",
            text: "智能体正在处理..."
          },
          status: Rr
        }
      ));
    }, Re = (v, B, st) => {
      (async () => (Ot && await Ot.catch(() => {
      }), await le(h, v, {
        requestID: v.requestID || W || _,
        output: B,
        status: st
      })))().then((_t) => Fs(R, _t));
    };
    try {
      await xi({
        agent: A,
        input: rt,
        history: H,
        requestApi: vn,
        streamApi: Cn,
        stopApi: Tn,
        blockMs: jn,
        onRequestID: (v) => {
          W = o(v), z(W), Kt(W);
        },
        onFrame: (v) => {
          if (mt.current !== M)
            return;
          const B = o(v?.stream_id);
          if (B && (j = B, ne(B)), Kn(R, v), Hn(v, R), h > 0 && v?.type === "result" && !U) {
            U = !0;
            const st = zt(
              v?.output,
              v
            ), _t = Yt(st), Gt = o(v?.request_id) || W || _, Me = Wt(st) || o(v?.msg);
            Re(
              {
                ...V,
                text: Me,
                output: {
                  text: Me,
                  finalOutput: $(
                    st,
                    Me
                  )
                },
                interaction: _t,
                interactionAnswered: _t ? !1 : void 0,
                running: !1,
                requestID: Gt
              },
              st,
              Number(v.status) === 2 ? 2 : 1
            );
          }
        }
      });
    } catch (v) {
      if (mt.current === M) {
        const B = Q(v, "智能体测试失败。");
        if (sn(B) ? await Ms({
          activeSessionID: h,
          assistantMessage: V,
          requestID: W || _,
          lastID: j,
          streamApi: Cn,
          runStatusApi: ve,
          blockMs: jn,
          token: M,
          isAlreadySaved: () => U,
          markSaved: () => {
            U = !0;
          },
          applyFrame: (_t) => {
            const Gt = o(_t?.stream_id);
            Gt && (j = Gt, ne(Gt)), Kn(R, _t), Hn(_t, R);
          },
          saveFinal: Re
        }) : !1)
          return;
        K(B), Ls(R, B), h > 0 && !U && !sn(B) && (U = !0, Re(
          {
            ...V,
            text: B,
            requestID: W || _
          },
          { error: B, text: B },
          2
        ));
      }
    } finally {
      mt.current === M && (ee(!1), Ft(!1), jt(!1), $s(R));
    }
  }, Ms = async ({
    activeSessionID: i,
    assistantMessage: c,
    requestID: f,
    lastID: g,
    streamApi: k,
    runStatusApi: h,
    blockMs: M,
    token: N,
    isAlreadySaved: R,
    markSaved: V,
    applyFrame: H,
    saveFinal: rt
  }) => {
    if (!f || R())
      return !1;
    const U = (j) => {
      if (H(j), j?.type !== "result")
        return !1;
      if (i > 0 && !R()) {
        V();
        const At = zt(j?.output, j), Ot = Yt(At), Kt = Wt(At) || o(j?.msg);
        rt(
          {
            ...c,
            text: Kt,
            output: {
              text: Kt,
              finalOutput: $(At, Kt)
            },
            interaction: Ot,
            interactionAnswered: Ot ? !1 : void 0,
            running: !1,
            requestID: o(j?.request_id) || f
          },
          At,
          Number(j.status) === 2 ? 2 : 1
        );
      }
      return Number(j.status) !== 2;
    };
    let W = !1;
    try {
      await ki({
        streamApi: k,
        requestID: f,
        lastID: g || "0-0",
        blockMs: M,
        transport: "poll",
        stopOnResult: !0,
        recoverOnError: !0,
        acceptErrorResult: !0,
        onFrame: (j) => {
          if (mt.current !== N)
            return !1;
          if (j?.type !== "result") {
            H(j);
            return;
          }
          return U(j), W = !0, !1;
        }
      });
    } catch {
      W = !1;
    }
    return W ? !0 : h ? await Is({
      runStatusApi: h,
      requestID: f,
      token: N,
      applyResultFrame: U
    }) : !1;
  }, Is = async ({
    runStatusApi: i,
    requestID: c,
    token: f,
    applyResultFrame: g
  }) => {
    const k = Date.now() + zi;
    let h = 0, M = 0;
    const N = /* @__PURE__ */ new Set();
    for (; mt.current === f && Date.now() < k && M < ji; ) {
      M += 1;
      const R = await tr(
        i,
        c
      ).catch(() => (h += 1, null));
      if (h >= 3)
        return !1;
      R && (h = 0);
      for (const H of $i(
        R,
        c,
        N
      )) {
        const rt = o(H.stream_id);
        if (rt && N.add(rt), g(H))
          return !0;
      }
      const V = er(R, c);
      if (V)
        return g(V), !0;
      await Ui(Fi);
    }
    return !1;
  }, Os = async () => {
    if (!(!_ || !_n || we)) {
      jt(!0), js();
      try {
        await yi(_, Tn), mt.current += 1, ee(!1), Ft(!1), Bs();
      } catch (i) {
        K(Q(i, "停止智能体失败。"));
      } finally {
        jt(!1);
      }
    }
  }, Ps = (i) => {
    (i.metaKey || i.ctrlKey) && i.key === "Enter" && (i.preventDefault(), qn());
  }, Hn = (i, c) => {
    if (Es(i, c), i?.type !== "result" || t.meta?.reloadPageOnFinal !== !0 || Number(i.status) === 2)
      return;
    const f = zt(i?.output, i), g = o(f.kind || f.type || f.event).trim().toLowerCase();
    if (g === "skill_draft_patch" && oe || !Vo(g, t.meta?.reloadPageOnFinalKinds))
      return;
    const k = [i.request_id, i.stream_id, g].map(o).join(":");
    if (De.current === k)
      return;
    De.current = k;
    const h = Math.max(
      0,
      Number(t.meta?.reloadPageOnFinalDelayMs || 0)
    );
    window.setTimeout(() => {
      kr(e);
    }, h);
  }, Es = (i, c) => {
    if (i?.type !== "result" || !oe || !cs || Number(i.status) === 2)
      return;
    const f = zt(i?.output, i), g = Be(f);
    if (!g)
      return;
    const k = [i.request_id, i.stream_id, "skill_draft_patch"].map(o).join(":");
    if (An.current === k)
      return;
    An.current = k;
    const h = pe(
      t.meta?.skillDraftPatchContext,
      e
    ), M = {
      ...g,
      ...h,
      ...rr(
        P,
        D || Mt.current,
        A,
        J
      )
    };
    Un(c, M);
  }, Un = (i, c) => {
    ue(i, {
      status: "saving",
      draft_id: E(
        c,
        "id",
        "draft_id",
        "draftId"
      ),
      message: "正在保存技能..."
    }), Y(oe, c).then(async (f) => {
      Qi(
        e,
        t.meta?.skillDraftPatchTargetPath,
        c,
        f
      ), await Ji(
        e,
        t.meta?.skillDraftPatchReloadDataKeys,
        t.meta?.skillDraftPatchReloadDataKey,
        t.meta?.skillDraftPatchReloadPageOnSave
      ), Xi(
        e,
        t.meta?.skillDraftPatchTablePath,
        t.meta?.skillDraftPatchTargetPath,
        c,
        f
      ), ue(i, {
        status: "saved",
        draft_id: E(f, "draft_id", "draftId", "id") || E(c, "id", "draft_id", "draftId"),
        message: "技能已保存。"
      }), t.meta?.skillDraftPatchCloseOnSave === !0 && ct && e.getState().setValueByPath(ct, !1);
    }).catch((f) => {
      const g = Q(f, "保存技能失败。");
      ue(i, {
        status: "failed",
        message: g
      }), K(g);
    });
  }, zs = (i, c) => {
    if (!oe || !c)
      return;
    const f = Be(c);
    if (!f) {
      ue(i, {
        status: "failed",
        message: "没有找到可保存的技能内容。"
      });
      return;
    }
    const g = pe(
      t.meta?.skillDraftPatchContext,
      e
    ), k = {
      ...f,
      ...g,
      ...rr(
        P,
        D || Mt.current,
        A,
        J
      )
    };
    Un(i, k);
  }, Kn = (i, c, f) => {
    const g = zt(c?.output, c);
    if (Ge(g) && c?.type !== "result")
      return;
    const k = _i(c);
    k != null && Ft(k), Ut(i, (h) => {
      const M = h.output || Pe, N = {
        text: M.text,
        finalOutput: M.finalOutput
      }, R = gn(g), V = Yt(g);
      if (c?.type !== "result" && Er(R))
        return Do(h, g, c);
      let H = h.actionTiming;
      Ri(g) && (H = Ii(H, g));
      const rt = vo(
        h.resultDetail,
        g,
        c
      );
      if (c?.type === "result") {
        let U = Ge(g) ? $({
          text: N.text || o(c?.msg)
        }) : g;
        be(U) && N.text.trim() && (U = $({
          ...U,
          event: "final",
          text: N.text
        })), N.finalOutput = U;
        const W = o(U.text) || N.text, j = xn(
          rt,
          hn(U)
        );
        return {
          ...h,
          text: W,
          interaction: V || h.interaction,
          output: N,
          resultDetail: j,
          running: !1,
          requestID: o(c?.request_id) || h.requestID,
          actionTiming: Oe(
            H,
            Number(c.status) === 2 ? "failed" : "done"
          )
        };
      }
      return R === "interaction" ? (g.text && (N.text = o(g.text)), {
        ...h,
        text: N.text,
        interaction: V || h.interaction,
        output: N,
        resultDetail: rt,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: H
      }) : ((R === "delta" || !R && g.text) && (N.text += o(g.text)), {
        ...h,
        text: N.text,
        interaction: V || h.interaction,
        output: N,
        resultDetail: rt,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: H
      });
    });
  }, Ut = (i, c) => {
    s(
      (f) => f.map(
        (g) => g.id === i && g.role === "assistant" ? c(g) : g
      )
    );
  }, ue = (i, c) => {
    i && Ut(i, (f) => ({
      ...f,
      data: {
        ...f.data || {},
        skillDraftPatch: c
      }
    }));
  }, Fs = (i, c) => {
    const f = p(c) && p(c.message) ? c.message : {}, g = p(f.output) ? f.output : {}, k = Kr(g.memory_review);
    k && G && (Ut(i, (h) => ({
      ...h,
      output: {
        ...h.output || Pe,
        finalOutput: {
          ...h.output?.finalOutput || {},
          memory_review: k
        }
      }
    })), It());
  }, Gn = (i) => {
    s(
      (c) => c.map(
        (f) => f.role === "assistant" && f.running ? i(f) : f
      )
    );
  }, js = () => {
    Gn((i) => ({
      ...i,
      actionTiming: Mi(i.actionTiming)
    }));
  }, Bs = () => {
    Gn((i) => ({
      ...i,
      running: !1,
      actionTiming: vi(i.actionTiming)
    }));
  }, Ls = (i, c) => {
    Ut(i, (f) => ({
      ...f,
      error: c,
      running: !1,
      actionTiming: Oe(f.actionTiming, "failed")
    }));
  }, $s = (i) => {
    Ut(i, (c) => ({
      ...c,
      running: !1,
      actionTiming: Oe(c.actionTiming, "done")
    }));
  };
  return /* @__PURE__ */ m(
    "div",
    {
      className: "flex min-h-0 flex-col gap-3 overflow-hidden",
      style: { height: ds },
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            ref: Se,
            className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3",
            children: [
              r.length === 0 ? /* @__PURE__ */ u("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: us || `输入一次任务开始测试${kt ? `「${kt}」` : "智能体"}。` }) : null,
              r.map((i) => /* @__PURE__ */ u(
                "div",
                {
                  className: Zt(
                    "flex",
                    i.role === "user" ? "justify-end" : "justify-start"
                  ),
                  children: /* @__PURE__ */ u(
                    "div",
                    {
                      className: Zt(
                        "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                        i.role === "user" ? "border-primary/20 bg-primary text-primary-foreground" : "bg-muted/35 text-foreground"
                      ),
                      children: i.role === "user" ? /* @__PURE__ */ u("div", { className: "whitespace-pre-wrap break-all", children: i.text }) : /* @__PURE__ */ u(
                        ho,
                        {
                          message: i,
                          now: gs,
                          running: w,
                          memoryEnabled: G,
                          onOpenInteraction: Cs,
                          onOpenResult: () => re(i.id),
                          onOpenDraftBox: () => n({ to: as }),
                          onApplySkillDraftPatch: (c) => zs(i.id, c),
                          onSendSuggestion: (c) => {
                            Vn(c);
                          }
                        }
                      )
                    }
                  )
                },
                i.id
              ))
            ]
          }
        ),
        /* @__PURE__ */ u(
          ua,
          {
            open: !!qt?.interaction && ns,
            interaction: qt?.interaction,
            paramApi: rs,
            readonly: !!qt?.interactionAnswered,
            initialData: qt?.interactionData,
            disabled: w,
            onOpenChange: Ts,
            onSubmit: (i) => {
              Rs(i);
            }
          }
        ),
        /* @__PURE__ */ u(
          ui,
          {
            open: !!wt,
            detail: Ce,
            running: fs,
            suggestions: Ln.length > 0 ? /* @__PURE__ */ u(
              Pr,
              {
                suggestions: Ln,
                disabled: w,
                onSelect: (i) => {
                  Vn(i);
                }
              }
            ) : null,
            onOpenChange: (i) => {
              i || re("");
            }
          }
        ),
        se ? /* @__PURE__ */ u(
          Ei,
          {
            open: yt,
            onOpenChange: X,
            agentKey: A,
            contextKey: J,
            activeSessionID: D,
            disabled: w || O,
            assistantLayer: !0,
            layerClassName: dn,
            layerZIndex: fn,
            loadSessions: xs,
            onOpenSession: (i) => As(i),
            onArchiveSession: _s,
            onRestoreSession: ks,
            onRenameSession: Ss
          }
        ) : null,
        bt ? /* @__PURE__ */ u(
          yo,
          {
            open: dt,
            memories: ft,
            loading: et,
            error: Rt,
            disabled: w || O,
            onOpenChange: F,
            onRefresh: It,
            onUpdate: bs,
            onForget: ws
          }
        ) : null,
        kn ? /* @__PURE__ */ u("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: kn }) : null,
        /* @__PURE__ */ m("div", { className: "shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20", children: [
          d.length > 0 ? /* @__PURE__ */ u("div", { className: "border-b px-3 py-2", children: /* @__PURE__ */ u(
            Di,
            {
              references: d,
              disabled: w || nt,
              onRemove: (i) => x(
                (c) => c.filter((f, g) => g !== i)
              )
            }
          ) }) : null,
          /* @__PURE__ */ u(
            Cr,
            {
              value: a,
              disabled: w || nt,
              placeholder: ls,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (i) => l(i.target.value),
              onKeyDown: Ps
            }
          ),
          /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ u("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: _ ? `RequestID: ${_}${Sn !== "0-0" ? ` / ${Sn}` : ""}` : nt ? "智能体正在执行，结果会自动同步。" : b || (P ? O ? "正在加载历史会话。" : D ? "会话已保存，刷新后可继续。" : "本次会话会保存到后台。" : "关闭弹窗后会清空本次测试上下文。") }),
            /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2", children: [
              bt ? /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || O,
                  onClick: ys,
                  children: [
                    /* @__PURE__ */ u(Vs, { className: "size-3.5" }),
                    $n > 0 ? `记忆 ${$n}` : "记忆"
                  ]
                }
              ) : null,
              se ? /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || O,
                  onClick: () => X(!0),
                  children: [
                    /* @__PURE__ */ u(Hs, { className: "size-3.5" }),
                    "历史"
                  ]
                }
              ) : null,
              /* @__PURE__ */ u(
                Ni,
                {
                  references: d,
                  disabled: w || nt,
                  buttonLabel: "素材",
                  onReferencesChange: x,
                  onMessage: C
                }
              ),
              /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || O,
                  onClick: () => P ? void hs() : gt(),
                  children: [
                    /* @__PURE__ */ u(hr, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              ss ? /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || O,
                  onClick: () => P ? void Ds() : gt(),
                  children: [
                    /* @__PURE__ */ u(Us, { className: "size-3.5" }),
                    P ? "新会话" : "新对话"
                  ]
                }
              ) : null,
              w ? /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !_n || we,
                  onClick: () => {
                    Os();
                  },
                  children: [
                    we ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ u(Ks, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              /* @__PURE__ */ m(
                L,
                {
                  type: "button",
                  size: "sm",
                  disabled: !ps,
                  onClick: () => {
                    qn();
                  },
                  children: [
                    w || nt ? /* @__PURE__ */ u(ht, { className: "size-4 animate-spin" }) : /* @__PURE__ */ u(Gs, { className: "size-4" }),
                    "发送"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Li(t) {
  for (let e = t.length - 1; e >= 0; e -= 1) {
    const n = t[e];
    if (!(n.role !== "assistant" || n.running || n.error || n.interaction) && (Xt(n) || wn(qr(n))))
      return n.id;
  }
  return "";
}
function Ee(t) {
  t.scrollTop = t.scrollHeight;
}
function Xn(t) {
  Ee(t);
  const e = window.requestAnimationFrame(() => {
    Ee(t);
  }), n = window.setTimeout(() => {
    Ee(t);
  }, 120);
  return () => {
    window.cancelAnimationFrame(e), window.clearTimeout(n);
  };
}
async function tr(t, e) {
  const n = await hi(t, "get", { request_id: e });
  if (!p(n))
    return {};
  const r = Number(n.status || 0), s = Number(n.code || 0);
  if (r === 2 || s === 401)
    throw new Error(o(n.msg || n.message) || "请求失败");
  return p(n.data) ? n.data : {};
}
function er(t, e) {
  const n = p(t?.run) ? t.run : {}, r = o(n.status).toLowerCase();
  if (!Mr(r))
    return null;
  const s = p(n.output) ? n.output : {}, a = o(n.error) || o(s.error) || o(s.text) || "智能体运行失败。", l = r === "success" ? 1 : 2, d = l === 2 && !o(s.text) ? {
    ...s,
    event: "status",
    text: a,
    error: a
  } : s;
  return {
    request_id: o(n.request_id) || e,
    type: "result",
    status: l,
    msg: l === 2 ? a : "",
    output: d
  };
}
function $i(t, e, n) {
  const r = p(t?.run) ? t.run : {}, s = Array.isArray(r.stream) ? r.stream : [], a = [];
  for (const d of s) {
    const x = qi(d, e);
    if (!x)
      continue;
    const b = o(x.stream_id);
    b && n?.has(b) || a.push(x);
  }
  const l = Vi(r, e);
  if (l) {
    const d = o(l.stream_id);
    (!d || !n?.has(d)) && a.push(l);
  }
  return a;
}
function qi(t, e) {
  const n = p(t) ? t : {}, r = p(n.payload) ? n.payload : p(t) ? t : {}, s = p(r.output) ? r.output : {}, a = gn(s), l = o(r.type || "stream").toLowerCase();
  return l !== "result" && !Er(a) ? null : {
    request_id: o(r.request_id) || e,
    stream_id: o(r.stream_id) || o(n.id),
    type: l || "stream",
    status: Number(r.status || 0) || 1,
    msg: o(r.msg),
    output: s
  };
}
function Vi(t, e) {
  if (Mr(o(t.status).toLowerCase()))
    return null;
  const n = p(t.output) ? t.output : {}, r = hn(n);
  if (!r || !r.result && r.tasks.length === 0)
    return null;
  const s = r.id || o(n.result_id) || e, a = Hi(r);
  return {
    request_id: o(t.request_id) || e,
    stream_id: `run-output:${s}:${a}`,
    type: "stream",
    status: 1,
    msg: "",
    output: {
      event: "result_detail",
      result_id: s,
      result_mode: r.mode || "artifact",
      title: r.title,
      result: r.result,
      tasks: n.tasks || r.result?.tasks || r.tasks,
      progress: r.progress,
      progress_text: r.progressText
    }
  };
}
function Hi(t) {
  const e = t.tasks.map(
    (n) => [
      n.id,
      n.placeholderID,
      n.status,
      n.progress ?? "",
      n.text,
      n.error,
      n.output ? "output" : ""
    ].join(",")
  ).join("|");
  return encodeURIComponent(
    [t.progress ?? "", t.progressText, e].join("|")
  ).slice(0, 500);
}
function Mr(t) {
  return ["success", "fail", "canceled"].includes(t);
}
function sn(t) {
  return /network|failed to fetch|读取运行流失败\((408|425|429|500|502|503|504)\)|timeout|超时/i.test(
    t
  );
}
function nr(t) {
  return t.role !== "assistant" || !t.requestID || !t.error || !sn(t.error) ? "" : t.requestID;
}
function Ui(t) {
  return new Promise((e) => {
    window.setTimeout(e, t);
  });
}
function Ki() {
  return null;
}
async function Gi(t, e) {
  return typeof Qn != "function" ? !1 : !!await Qn(t, e);
}
async function Ji(t, e, n, r) {
  for (const s of Yi(
    e,
    n
  ))
    try {
      await Gi(t, s);
    } catch {
    }
  if (r !== !1)
    try {
      await kr(t);
    } catch {
    }
}
function Yi(t, e) {
  const n = [];
  if (Array.isArray(t))
    for (const s of t) {
      const a = o(s).trim();
      a && !n.includes(a) && n.push(a);
    }
  else {
    const s = o(t).trim();
    if (s)
      for (const a of s.split(",")) {
        const l = a.trim();
        l && !n.includes(l) && n.push(l);
      }
  }
  const r = o(e).trim() || "table";
  return n.length === 0 && r && n.push(r), n;
}
function Wi(t, e, n) {
  if (p(t)) {
    const s = Zi(
      t,
      e
    );
    if (s)
      return s;
    const a = pe(t, e), l = Object.entries(a).filter(([, d]) => d != null && d !== "").sort(([d], [x]) => d.localeCompare(x));
    if (l.length > 0)
      return l.map(([d, x]) => `${d}:${o(x)}`).join("|");
  }
  const r = o(t).trim();
  return r ? r.replaceAll("{agent}", n) : n ? `agent:${n}` : "agent";
}
function Zi(t, e) {
  const n = o(t.prefix).trim(), r = o(t.idPath || t.id_path).trim();
  if (!n || !r)
    return "";
  const s = E(
    { id: xt(e, r) },
    "id"
  );
  return s > 0 ? `${n}:${s}` : o(t.fallback).trim();
}
function rr(t, e, n, r) {
  if (!t)
    return {};
  const s = {};
  return e > 0 && (s.assistant_session_id = e), n && (s.assistant_agent_key = n), r && (s.assistant_context_key = r), s;
}
function Qi(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = p(n.patch) ? n.patch : {}, l = xt(t, s), d = p(l) ? l : {}, x = p(r.draft) ? r.draft : {}, b = {
    ...d,
    ...Ir(a),
    ...x
  }, C = E(r, "draft_id", "draftId", "id") || E(n, "id", "draft_id", "draftId") || E(d, "id");
  C > 0 && (b.id = C);
  const _ = E(n, "pack_id", "packId") || E(a, "pack_id", "packId") || E(d, "pack_id", "packId");
  _ > 0 && (b.pack_id = _);
  const z = E(n, "cate_id", "cateId") || E(a, "cate_id", "cateId") || E(d, "cate_id", "cateId");
  z > 0 && (b.cate_id = z), t.getState().setValueByPath(s, b);
}
function Xi(t, e, n, r, s) {
  const a = o(e).trim() || "data.table.list", l = xt(t, a);
  if (!Array.isArray(l))
    return;
  const d = to(
    t,
    n,
    r,
    s
  ), x = E(d, "id", "draft_id", "draftId");
  if (x <= 0)
    return;
  d.id = x;
  let b = !1;
  const C = l.map((_) => p(_) && E(_, "id") === x ? (b = !0, { ..._, ...d }) : _);
  b || (C.unshift(d), eo(t, a)), t.getState().setValueByPath(a, C);
}
function to(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = xt(t, s), l = p(a) ? a : {}, d = p(r.draft) ? r.draft : {}, x = p(n.patch) ? n.patch : {};
  return {
    ...l,
    ...Ir(x),
    ...d,
    id: E(r, "draft_id", "draftId", "id") || E(d, "id", "draft_id", "draftId") || E(n, "id", "draft_id", "draftId") || E(l, "id")
  };
}
function eo(t, e) {
  const n = e.endsWith(".list") ? `${e.slice(0, -5)}.total` : "";
  if (!n)
    return;
  const r = Number(xt(t, n));
  Number.isFinite(r) && t.getState().setValueByPath(n, r + 1);
}
function Ir(t) {
  const e = {};
  return de(e, t, "key", "key"), de(e, t, "name", "name"), de(e, t, "description", "description", "desc"), de(
    e,
    t,
    "skill_md",
    "skill_md",
    "skillMd",
    "skill",
    "content",
    "markdown"
  ), sr(
    e,
    t,
    "files_json",
    "files_json",
    "filesJson",
    "files"
  ), sr(
    e,
    t,
    "manifest",
    "manifest",
    "runtime_config",
    "runtimeConfig"
  ), ir(e, t, "pack_id", "pack_id", "packId"), ir(e, t, "cate_id", "cate_id", "cateId"), e;
}
function de(t, e, n, ...r) {
  const s = no(e, ...r);
  s && (t[n] = s);
}
function sr(t, e, n, ...r) {
  const s = ro(e, ...r);
  s && (t[n] = s);
}
function ir(t, e, n, ...r) {
  const s = E(e, ...r);
  s > 0 && (t[n] = s);
}
function no(t, ...e) {
  const n = mn(t, e);
  return o(n).trim();
}
function ro(t, ...e) {
  const n = mn(t, e);
  if (n == null)
    return "";
  if (typeof n == "string")
    return n.trim();
  if (p(n) || Array.isArray(n))
    try {
      return JSON.stringify(n);
    } catch {
      return "";
    }
  return "";
}
function E(t, ...e) {
  const n = mn(t, e), r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function mn(t, e) {
  for (const n of e)
    if (Object.prototype.hasOwnProperty.call(t, n))
      return t[n];
}
function so(t) {
  const e = Array.isArray(t) ? t : [];
  return lo(
    e.map((n, r) => io(n, r)).filter((n) => !!n)
  );
}
function io(t, e) {
  if (!p(t))
    return null;
  const n = o(t.role) === "user" ? "user" : "assistant", r = Number(t.status || 0) === Rr, s = o(t.text) || (r ? "智能体正在处理..." : ""), a = p(t.content) ? t.content : {}, l = p(t.output) ? t.output : {}, d = o(a.kind || t.kind), x = r ? Tr("等待智能体返回") : oo(t, l), b = {
    id: `saved-${o(t.id) || e}`,
    role: n,
    text: s,
    kind: d || "chat",
    data: p(a.data) ? a.data : void 0,
    requestID: o(t.request_id),
    running: r,
    actionTiming: x
  };
  if (n === "assistant") {
    const _ = Ge(l) ? $({ text: s }) : $(l, s);
    b.output = {
      text: s,
      finalOutput: _
    }, Number(t.status) === 2 && (b.error = s);
  }
  const C = ln(a.interaction) || Yt(l);
  return C && (b.interaction = C, b.interactionAnswered = !!a.interaction_answered, p(a.interaction_data) && (b.interactionData = a.interaction_data)), b;
}
function oo(t, e) {
  const n = ao(e), r = or(
    t,
    e,
    n,
    "started_at_ms",
    "started_at"
  );
  if (r == null)
    return;
  const s = or(
    t,
    e,
    n,
    "finished_at_ms",
    "finished_at"
  );
  return Ti({
    status: Number(t.status || 0) === 2 ? "failed" : "done",
    startedAt: r,
    finishedAt: s,
    label: "内容生成完成"
  });
}
function ao(t) {
  const e = p(t.result) ? t.result : {}, n = p(t.content) ? t.content : {}, r = p(e.content) ? e.content : {};
  return {
    result: e,
    content: n,
    resultContent: r
  };
}
function or(t, e, n, r, s) {
  for (const a of [
    t,
    e,
    n.result,
    n.content,
    n.resultContent
  ]) {
    if (a[r] != null && a[r] !== "")
      return a[r];
    if (a[s] != null && a[s] !== "")
      return a[s];
  }
}
function co(t, e, n) {
  return t.map(
    (r) => r.id === e && r.interaction ? {
      ...r,
      interactionAnswered: !0,
      interactionData: n
    } : r
  );
}
function lo(t) {
  let e = t;
  return t.forEach((n, r) => {
    if (n.role !== "user" || n.kind !== "interaction_result")
      return;
    const s = uo(
      e,
      r,
      n
    );
    if (s < 0)
      return;
    const a = e[s];
    if (!a)
      return;
    const l = p(n.data) ? n.data : void 0;
    e = e.map(
      (d, x) => x === s ? {
        ...a,
        interactionAnswered: !0,
        interactionData: l
      } : d
    );
  }), e;
}
function uo(t, e, n) {
  const r = o(
    n.data?.interaction_id || n.data?.interactionId
  );
  for (let s = e - 1; s >= 0; s -= 1) {
    const a = t[s];
    if (a && !(a.role !== "assistant" || !a.interaction || a.interactionAnswered) && !(r && o(a.interaction.id) && o(a.interaction.id) !== r))
      return s;
  }
  return -1;
}
function fo(t) {
  return (Array.isArray(t) ? t : []).map(Or).filter((n) => !!n);
}
function Or(t) {
  if (!p(t))
    return null;
  const e = Number(t.id || 0);
  return !Number.isFinite(e) || e <= 0 ? null : {
    id: e,
    title: o(t.title),
    context_key: o(t.context_key),
    agent_key: o(t.agent_key),
    status: Number(t.status || 0),
    message_count: Number(t.message_count || 0),
    last_message_at: o(t.last_message_at)
  };
}
function po(t, e) {
  const n = p(t) ? t : {};
  return {
    page: fe(n.page, e.page),
    page_size: fe(n.page_size ?? n.pageSize, e.pageSize),
    total: fe(n.total, 0),
    total_pages: fe(n.total_pages ?? n.totalPages, 0)
  };
}
function mo(t) {
  return {
    sessions: [],
    pagination: {
      page: t.page,
      page_size: t.pageSize,
      total: 0,
      total_pages: 0
    }
  };
}
function fe(t, e) {
  const n = Number(t);
  return !Number.isFinite(n) || n < 0 ? e : n;
}
function pe(t, e) {
  if (!p(t))
    return {};
  const n = {};
  for (const [r, s] of Object.entries(t)) {
    const a = String(r || "").trim(), l = String(s || "").trim();
    !a || !l || (n[a] = xt(e, l));
  }
  return n;
}
function go(t, e) {
  const n = Object.fromEntries(
    Object.entries(e).filter(
      ([, s]) => s != null && s !== ""
    )
  );
  if (!Object.keys(n).length)
    return t;
  const r = p(t.context) ? t.context : {};
  return {
    ...t,
    context: {
      ...r,
      ...n
    }
  };
}
function ho({
  message: t,
  now: e,
  running: n,
  memoryEnabled: r,
  onOpenInteraction: s,
  onOpenResult: a,
  onOpenDraftBox: l,
  onApplySkillDraftPatch: d,
  onSendSuggestion: x
}) {
  const b = Xt(t), C = !!t.interaction, _ = !C && Io(b), z = qr(t), D = _ || wn(z), I = Hr(t, D), O = t.interaction ? o(t.interaction.title) || "补充交互信息" : "", T = t.interaction ? o(t.interaction.description) : "", yt = Eo(t), X = t.output?.finalOutput ? Be(t.output.finalOutput) : null, dt = !!(t.actionTiming && !_);
  return /* @__PURE__ */ m("div", { className: "space-y-2", children: [
    dt ? /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ u(ar, { message: t, hasOutput: D }),
      /* @__PURE__ */ u(Ci, { timing: t.actionTiming, now: e })
    ] }) : /* @__PURE__ */ u(ar, { message: t, hasOutput: D }),
    _ && b ? /* @__PURE__ */ u(
      li,
      {
        detail: b,
        running: !!t.running,
        timing: t.actionTiming,
        now: e,
        onOpen: a
      }
    ) : D ? /* @__PURE__ */ u(Xs, { output: z }) : null,
    b && !C && !_ ? /* @__PURE__ */ u(xo, { onOpen: a }) : null,
    /* @__PURE__ */ u(
      bo,
      {
        progress: yt,
        hasPendingPatch: !!X,
        onApply: () => d(t.output?.finalOutput),
        onOpenDraftBox: l
      }
    ),
    t.error ? /* @__PURE__ */ u("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive", children: t.error }) : null,
    t.interaction ? /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ m("span", { className: "min-w-0", children: [
        /* @__PURE__ */ u("span", { className: "block truncate text-foreground", children: t.interactionAnswered ? "交互信息已提交。" : O }),
        T ? /* @__PURE__ */ u("span", { className: "block truncate", children: T }) : null
      ] }),
      /* @__PURE__ */ u(
        L,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          className: "h-7 px-2 text-xs",
          disabled: n && !t.interactionAnswered,
          onClick: () => s(t.id),
          children: t.interactionAnswered ? "查看参数" : "填写参数"
        }
      )
    ] }) : null,
    r ? /* @__PURE__ */ u(wo, { review: Po(t) }) : null,
    /* @__PURE__ */ u(
      Pr,
      {
        suggestions: I,
        disabled: n,
        onSelect: x
      }
    ),
    t.requestID ? /* @__PURE__ */ u("div", { className: "truncate border-t pt-1 font-mono text-[11px] text-muted-foreground", children: t.requestID }) : null
  ] });
}
function xo({ onOpen: t }) {
  return /* @__PURE__ */ u("div", { className: "flex justify-end", children: /* @__PURE__ */ m(
    L,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 px-2 text-xs",
      onClick: t,
      children: [
        "查看详情",
        /* @__PURE__ */ u(gr, { className: "size-3.5" })
      ]
    }
  ) });
}
function yo({
  open: t,
  memories: e,
  loading: n,
  error: r,
  disabled: s,
  onOpenChange: a,
  onRefresh: l,
  onUpdate: d,
  onForget: x
}) {
  const [b, C] = S(0), [_, z] = S({ title: "", content: "" }), [D, I] = S(0), [O, T] = S("");
  ut(() => {
    t || (C(0), z({ title: "", content: "" }), I(0), T(""));
  }, [t]);
  const yt = (y) => {
    C(y.id), z({ title: y.title, content: y.content }), T("");
  }, X = async () => {
    if (b <= 0)
      return;
    const y = _.title.trim(), et = _.content.trim();
    if (!y || !et) {
      T("标题和内容不能为空。");
      return;
    }
    I(b);
    try {
      await d(b, { title: y, content: et }), C(0), z({ title: "", content: "" }), T("");
    } catch (q) {
      T(Q(q, "保存长期记忆失败。"));
    } finally {
      I(0);
    }
  }, dt = async (y, et) => {
    I(y);
    try {
      await d(y, { status: et }), T("");
    } catch (q) {
      T(Q(q, "更新长期记忆失败。"));
    } finally {
      I(0);
    }
  }, F = async (y) => {
    I(y);
    try {
      await x(y), b === y && C(0), T("");
    } catch (et) {
      T(Q(et, "停用长期记忆失败。"));
    } finally {
      I(0);
    }
  }, G = () => {
    C(0), z({ title: "", content: "" }), T("");
  }, tt = e.filter(an).length, ft = e.length - tt;
  return /* @__PURE__ */ u(Sr, { open: t, onOpenChange: a, children: /* @__PURE__ */ m(
    Ar,
    {
      "data-assistant-layer": "true",
      layerClassName: dn,
      layerZIndex: fn,
      className: "max-h-[86vh] max-w-3xl",
      children: [
        /* @__PURE__ */ m(Nr, { children: [
          /* @__PURE__ */ u(vr, { children: "长期记忆" }),
          /* @__PURE__ */ u(Dr, { children: "当前智能体和上下文会带入已启用记忆；停用后不会再参与后续运行。" })
        ] }),
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ m("div", { className: "min-w-0 text-muted-foreground", children: [
            "已启用 ",
            tt,
            " 条",
            ft > 0 ? `，已停用 ${ft} 条` : ""
          ] }),
          /* @__PURE__ */ m(
            L,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: s || n,
              onClick: () => {
                l();
              },
              children: [
                n ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ u(Jn, { className: "size-3.5" }),
                "刷新"
              ]
            }
          )
        ] }),
        r || O ? /* @__PURE__ */ u("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: O || r }) : null,
        /* @__PURE__ */ u("div", { className: "max-h-[56vh] space-y-2 overflow-y-auto pr-1", children: n && e.length === 0 ? /* @__PURE__ */ m("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: [
          /* @__PURE__ */ u(ht, { className: "mr-2 size-4 animate-spin" }),
          "正在加载长期记忆"
        ] }) : e.length === 0 ? /* @__PURE__ */ u("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: "当前上下文还没有长期记忆。" }) : e.map((y) => {
          const et = b === y.id, q = D === y.id, Rt = an(y);
          return /* @__PURE__ */ u(
            "div",
            {
              className: Zt(
                "rounded-md border bg-background p-3 text-sm",
                !Rt && "bg-muted/20 text-muted-foreground"
              ),
              children: /* @__PURE__ */ m("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ m("div", { className: "min-w-0 flex-1 space-y-2", children: [
                  /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ u("span", { className: "rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground", children: Lo(y.kind) }),
                    /* @__PURE__ */ u(
                      "span",
                      {
                        className: Zt(
                          "rounded-full px-2 py-0.5 text-[11px]",
                          Rt ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                        ),
                        children: Rt ? "启用" : "停用"
                      }
                    ),
                    /* @__PURE__ */ m("span", { className: "text-[11px] text-muted-foreground", children: [
                      qo(y.source),
                      " / 重要度",
                      " ",
                      y.importance
                    ] })
                  ] }),
                  et ? /* @__PURE__ */ m("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ u(
                      Si,
                      {
                        value: _.title,
                        disabled: q,
                        placeholder: "记忆标题",
                        onChange: (pt) => z((w) => ({
                          ...w,
                          title: pt.target.value
                        }))
                      }
                    ),
                    /* @__PURE__ */ u(
                      Cr,
                      {
                        value: _.content,
                        disabled: q,
                        placeholder: "记忆内容",
                        className: "min-h-24 resize-y",
                        onChange: (pt) => z((w) => ({
                          ...w,
                          content: pt.target.value
                        }))
                      }
                    )
                  ] }) : /* @__PURE__ */ m("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ u("div", { className: "break-words font-medium text-foreground", children: y.title || "未命名记忆" }),
                    /* @__PURE__ */ u("div", { className: "whitespace-pre-wrap break-words leading-6", children: y.content || "无内容" })
                  ] }),
                  /* @__PURE__ */ m("div", { className: "flex flex-wrap gap-2 text-[11px] text-muted-foreground", children: [
                    y.scope ? /* @__PURE__ */ m("span", { children: [
                      "作用域：",
                      $o(y.scope)
                    ] }) : null,
                    y.created_at ? /* @__PURE__ */ m("span", { children: [
                      "创建：",
                      y.created_at
                    ] }) : null,
                    y.tags.length > 0 ? /* @__PURE__ */ m("span", { children: [
                      "标签：",
                      y.tags.join("、")
                    ] }) : null
                  ] })
                ] }),
                /* @__PURE__ */ u("div", { className: "flex shrink-0 flex-wrap items-center gap-1 sm:justify-end", children: et ? /* @__PURE__ */ m(je, { children: [
                  /* @__PURE__ */ m(
                    L,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || q,
                      onClick: () => {
                        X();
                      },
                      children: [
                        q ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ u(Ys, { className: "size-3.5" }),
                        "保存"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    L,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: q,
                      onClick: G,
                      children: /* @__PURE__ */ u(Ws, { className: "size-3.5" })
                    }
                  )
                ] }) : /* @__PURE__ */ m(je, { children: [
                  /* @__PURE__ */ m(
                    L,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || q,
                      onClick: () => yt(y),
                      children: [
                        /* @__PURE__ */ u(Zs, { className: "size-3.5" }),
                        "编辑"
                      ]
                    }
                  ),
                  Rt ? /* @__PURE__ */ m(
                    L,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || q,
                      onClick: () => {
                        F(y.id);
                      },
                      children: [
                        q ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ u(hr, { className: "size-3.5" }),
                        "停用"
                      ]
                    }
                  ) : /* @__PURE__ */ m(
                    L,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || q,
                      onClick: () => {
                        dt(y.id, 1);
                      },
                      children: [
                        q ? /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ u(Jn, { className: "size-3.5" }),
                        "启用"
                      ]
                    }
                  )
                ] }) })
              ] })
            },
            y.id
          );
        }) })
      ]
    }
  ) });
}
function bo({
  progress: t,
  hasPendingPatch: e,
  onApply: n,
  onOpenDraftBox: r
}) {
  if (!t && !e)
    return null;
  if (!t && e)
    return /* @__PURE__ */ u("div", { className: "rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900", children: /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ u("div", { className: "min-w-0 flex-1 leading-5", children: "已生成技能内容，确认后保存为未发布版本。" }),
      /* @__PURE__ */ u("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ u(
        L,
        {
          type: "button",
          size: "sm",
          className: "h-7 px-2 text-xs",
          onClick: n,
          children: "保存"
        }
      ) })
    ] }) });
  const s = t.status === "saving", a = t.status === "failed", l = t.message || (a ? "技能保存失败。" : s ? "正在保存技能..." : "技能已保存。");
  return /* @__PURE__ */ u(
    "div",
    {
      className: Zt(
        "rounded-md border px-2.5 py-2 text-xs",
        a ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-emerald-200 bg-emerald-50 text-emerald-900"
      ),
      children: /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ u("div", { className: "min-w-0 flex-1 leading-5", children: s ? /* @__PURE__ */ m("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ u(ht, { className: "size-3.5 animate-spin" }),
          l
        ] }) : a ? l : /* @__PURE__ */ m(je, { children: [
          l,
          t.draft_id ? ` ID: ${t.draft_id}` : "",
          /* @__PURE__ */ u("span", { className: "ml-1 text-emerald-700", children: "下一步在技能草稿页校验、测试和发布。" })
        ] }) }),
        a && e ? /* @__PURE__ */ u("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ u(
          L,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "h-7 px-2 text-xs",
            onClick: n,
            children: "重新保存"
          }
        ) }) : !s && !a ? /* @__PURE__ */ u("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ u(
          L,
          {
            type: "button",
            size: "sm",
            className: "h-7 px-2 text-xs",
            onClick: r,
            children: "查看技能草稿"
          }
        ) }) : null
      ] })
    }
  );
}
function ar({
  message: t,
  hasOutput: e
}) {
  const n = Uo(t, e);
  return n ? /* @__PURE__ */ u("div", { className: "inline-flex rounded-full border bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: n }) : null;
}
function Pr({
  suggestions: t,
  disabled: e,
  onSelect: n
}) {
  return t.length === 0 ? null : /* @__PURE__ */ u("div", { className: "flex flex-wrap items-center gap-2 border-t pt-2", children: t.map((r, s) => /* @__PURE__ */ m(
    L,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 rounded-full px-2.5 text-xs",
      disabled: e,
      title: r.prompt,
      onClick: () => n(r),
      children: [
        /* @__PURE__ */ u(Js, { className: "size-3.5" }),
        r.label
      ]
    },
    `${r.label}-${s}`
  )) });
}
function wo({
  review: t
}) {
  return !t || t.status === "pending" ? null : /* @__PURE__ */ m("div", { className: "rounded-md border bg-background/80 px-2 py-2 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ u("div", { className: "font-medium text-foreground", children: t.text || _o(t.status) }),
    t.content || t.title ? /* @__PURE__ */ m("div", { className: "mt-1 leading-5", children: [
      t.title ? /* @__PURE__ */ u("div", { className: "text-foreground", children: t.title }) : null,
      t.content ? /* @__PURE__ */ u("div", { children: t.content }) : null
    ] }) : null,
    t.error ? /* @__PURE__ */ u("div", { className: "mt-1 text-destructive", children: t.error }) : null
  ] });
}
function _o(t) {
  switch (t) {
    case "saved":
      return "已自动保存长期记忆";
    case "updated":
      return "已自动更新长期记忆";
    case "deduped":
      return "已更新长期记忆权重";
    case "forgot":
      return "已清理相关长期记忆";
    default:
      return "长期记忆已处理";
  }
}
function ko(t) {
  return t.map((e) => {
    const n = So(e), r = {
      role: e.role,
      text: n
    };
    if (e.kind && (r.type = e.kind), e.data && (r.data = e.data), e.output?.finalOutput) {
      const s = Ao(e);
      be(s) || (r.output = s);
    }
    return e.interaction && (r.interaction = e.interaction, r.interaction_answered = !!e.interactionAnswered, e.interactionData && (r.interaction_data = e.interactionData)), r;
  }).filter(
    (e) => o(e.text).trim().length > 0 || !!e.interaction || !!e.data || !!e.output
  );
}
function So(t) {
  return bn(t.text) ? "" : t.text;
}
function Ao(t) {
  const e = Xt(t);
  return e?.result ? $(e.result, t.text) : $(
    t.output?.finalOutput || {},
    t.text
  );
}
function Er(t) {
  return t === "result_detail" || t === "result_task" || t === "result_progress" || t === "result_created" || t === "task_progress" || t === "task_done";
}
function Do(t, e, n) {
  const r = gn(e);
  let s = t.resultDetail;
  return r === "result_detail" || r === "result_created" ? s = xn(
    s,
    No(e)
  ) : r === "result_task" || r === "task_progress" || r === "task_done" ? s = zr(
    s,
    Lr(e),
    o(e.result_id)
  ) : r === "result_progress" && (s = Ro(
    s,
    o(e.result_id),
    o(e.text),
    te(e.progress)
  )), {
    ...t,
    text: t.text || "内容已生成，点击查看结果。",
    resultDetail: s,
    requestID: o(n?.request_id) || t.requestID
  };
}
function gn(t) {
  return o(t.semantic_event || t.event).toLowerCase();
}
function Xt(t) {
  const e = xn(
    t.resultDetail,
    hn(t.output?.finalOutput)
  );
  return e && (e.result || e.tasks.length) ? e : null;
}
function No(t) {
  if (!t)
    return;
  const e = p(t.result) ? $(t.result) : void 0, n = Br(t.tasks);
  return {
    id: o(t.result_id) || o(e?.result_id),
    title: o(t.title || e?.title) || "最终结果",
    mode: xe(
      t.result_mode || t.display_mode || e?.result_mode
    ),
    result: e,
    tasks: n,
    progress: te(t.progress),
    progressText: o(t.progress_text)
  };
}
function hn(t) {
  if (!t)
    return;
  const e = o(t.event).toLowerCase(), n = xe(
    t.result_mode || t.display_mode
  );
  if (e !== "result_card" && n === "inline" || e !== "result_card" && !p(t.result) && !o(t.result_mode || t.display_mode))
    return;
  const r = p(t.result) ? $(t.result) : $(t);
  return {
    id: o(t.result_id || r.result_id),
    title: o(t.title || r.title) || "最终结果",
    mode: e === "result_card" ? "artifact" : xe(
      t.result_mode || t.display_mode || r.result_mode
    ),
    result: r,
    tasks: Br(t.tasks || r.tasks),
    progress: te(t.progress),
    progressText: o(t.progress_text)
  };
}
function vo(t, e, n) {
  const r = Co(e, n);
  if (!r)
    return t;
  const s = on(e, n), a = t || {
    ...yn(s),
    title: "能力生成结果"
  }, l = zr(a, r, s);
  return {
    ...l,
    title: a.title || "能力生成结果",
    progress: r.progress ?? l.progress,
    progressText: r.text || l.progressText
  };
}
function Co(t, e) {
  const n = p(t.meta) ? t.meta : {};
  if (o(n.action).toLowerCase() !== "call_power")
    return null;
  const s = o(n.power || t.meta?.power).trim(), a = o(t.event).toLowerCase(), l = o(t.error).trim(), d = To(t), x = l ? "failed" : d || a === "final" ? "succeeded" : "running";
  return {
    id: on(t, e),
    placeholderID: on(t, e),
    title: s ? `生成 ${s}` : "能力生成",
    kind: o(s || t.kind).trim(),
    power: s,
    execution: "async",
    status: x,
    text: $r(t.text || t.progress_text),
    error: l,
    progress: te(
      t.progress ?? n.progress ?? n.percent
    ),
    output: d,
    sort: 0
  };
}
function To(t) {
  const e = o(t.event).toLowerCase();
  if (!es(t) && e !== "final")
    return;
  const n = $({
    ...t,
    event: "final"
  });
  return be(n) ? void 0 : n;
}
function on(t, e) {
  const n = p(t.meta) ? t.meta : {}, r = o(
    n.power || t.power
  ).trim();
  return [o(e?.request_id).trim(), r || "power"].filter(Boolean).join(":") || "power-action";
}
function xn(t, e) {
  return e ? t ? {
    id: e.id || t.id,
    title: e.title || t.title,
    mode: e.mode || t.mode,
    result: e.result || t.result,
    tasks: Fr(t.tasks, e.tasks),
    progress: e.progress ?? t.progress,
    progressText: e.progressText || t.progressText
  } : {
    ...e,
    mode: e.mode || "artifact",
    tasks: jr(e.tasks)
  } : t;
}
function zr(t, e, n) {
  const r = t || yn(n);
  return e ? {
    ...r,
    tasks: Fr(r.tasks, [e])
  } : r;
}
function Ro(t, e, n, r) {
  const s = t || yn(e), a = s.progress == null ? r : r == null ? s.progress : Math.max(s.progress, r);
  return {
    ...s,
    progress: a,
    progressText: n || s.progressText
  };
}
function yn(t) {
  return {
    id: t,
    title: "最终结果",
    mode: "artifact",
    tasks: [],
    progress: null,
    progressText: ""
  };
}
function Fr(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r) => n.set(r.id, r)), e.forEach((r) => {
    const s = n.get(r.id);
    n.set(r.id, s ? Mo(s, r) : r);
  }), jr([...n.values()]);
}
function Mo(t, e) {
  const n = t.progress, r = e.progress, s = n == null ? r : r == null ? n : Math.max(n, r), a = cr(t.status), l = cr(e.status), d = a > l;
  return {
    ...t,
    ...e,
    status: d ? t.status : e.status,
    text: d ? t.text : e.text,
    error: d ? t.error : e.error,
    output: d ? t.output : e.output,
    progress: s
  };
}
function cr(t) {
  switch (t) {
    case "succeeded":
    case "failed":
      return 3;
    case "running":
      return 2;
    case "pending":
      return 1;
    default:
      return 0;
  }
}
function jr(t) {
  return [...t].sort((e, n) => e.sort - n.sort);
}
function Br(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(Lr).filter((n) => n != null).sort((n, r) => n.sort - r.sort);
}
function Lr(t) {
  if (!p(t))
    return null;
  const e = o(t.id || t.task_id || t.taskId).trim(), n = o(
    t.placeholder_id || t.placeholderId || e
  ).trim(), r = e || n;
  if (!r)
    return null;
  const s = p(t.meta) ? t.meta : {}, a = p(t.output) ? t.output : p(s.output) ? s.output : void 0, l = a ? $(a) : void 0;
  return {
    id: r,
    placeholderID: n,
    title: o(
      t.title || t.name || t.label || t.power
    ).trim() || "素材任务",
    kind: o(t.kind || t.media_type || t.mediaType).trim(),
    power: o(t.power).trim(),
    execution: o(t.execution || t.mode).trim() || "async",
    status: o(t.status || t.state).trim() || "pending",
    text: $r(t.text || t.message),
    error: o(t.error).trim(),
    progress: te(
      t.progress ?? s.progress ?? s.percent
    ),
    output: l,
    sort: Number(t.sort || 0)
  };
}
function te(t) {
  const e = Number(t);
  return Number.isFinite(e) ? Math.max(0, Math.min(100, Math.round(e))) : null;
}
function $r(t) {
  const e = o(t).trim();
  return e ? [
    "等待生成结果",
    "等待智能体返回",
    "图片生成中，请稍后",
    "素材生成中，请稍后",
    "内容生成中，请稍后",
    "生成中，请稍后"
  ].some((r) => e.includes(r)) ? "" : e : "";
}
function qr(t) {
  const e = Xt(t);
  if (e)
    return Oo(e) && e.result ? xr(e.result, e.tasks) : void 0;
  if (t.running || t.interaction)
    return;
  if (!t.output)
    return t.text ? lr(t.text) : void 0;
  if (t.output.finalOutput) {
    const r = $(
      t.output.finalOutput,
      t.text
    );
    return o(r.event).toLowerCase() === "interaction" || be(r) ? void 0 : r;
  }
  const n = [];
  return t.output.text && !bn(t.output.text) && n.push(lr(t.output.text)), n;
}
function lr(t) {
  const e = ti(t);
  return $({
    text: e,
    content: {
      format: "markdown",
      text: e
    }
  });
}
function Io(t) {
  return !!(t && Vr(t) === "artifact");
}
function Oo(t) {
  return !!(t && Vr(t) === "inline");
}
function Vr(t) {
  return xe(t.mode);
}
function xe(t) {
  return o(t).trim().toLowerCase() === "inline" ? "inline" : "artifact";
}
function Hr(t, e) {
  if (t.running || t.error || t.interaction || !e)
    return [];
  const n = t.output?.finalOutput ? $(t.output.finalOutput, t.text) : $({ text: t.text }), r = ca(
    n.suggestions || n.meta?.suggestions
  );
  return r.length > 0 ? r : [];
}
function Po(t) {
  const e = t.output?.finalOutput || {};
  return Kr(e.memory_review);
}
function Eo(t) {
  const e = t.data?.skillDraftPatch;
  if (!p(e))
    return null;
  const n = o(e.status).trim();
  return n !== "saving" && n !== "saved" && n !== "failed" ? null : {
    status: n,
    draft_id: E(e, "draft_id", "draftId", "id") || void 0,
    message: o(e.message)
  };
}
function ur(t) {
  return (Array.isArray(t) ? t : []).map(Ur).filter((n) => n != null);
}
function Ur(t) {
  if (!p(t))
    return null;
  const e = Number(t.id || t.memory_id || t.memoryId || 0);
  return !Number.isFinite(e) || e <= 0 ? null : {
    id: e,
    kind: o(t.kind || t.type),
    title: o(t.title || t.name),
    content: o(t.content || t.text),
    tags: zo(t.tags),
    importance: Fo(t.importance),
    scope: o(t.scope),
    source: o(t.source),
    status: jo(t.status),
    created_at: o(t.created_at || t.createdAt)
  };
}
function zo(t) {
  return Array.isArray(t) ? t.map(o).map((e) => e.trim()).filter(Boolean) : o(t).split(",").map((e) => e.trim()).filter(Boolean);
}
function Fo(t) {
  const e = Number(t || 0);
  return !Number.isFinite(e) || e <= 0 ? 60 : Math.round(Math.max(1, Math.min(100, e)));
}
function jo(t) {
  return Number(t || 0) === 2 ? 2 : 1;
}
function an(t) {
  return t.status !== 2;
}
function Bo(t, e) {
  let n = !1;
  const r = t.map((s) => s.id !== e.id ? s : (n = !0, e));
  return n ? r : [e, ...r];
}
function Lo(t) {
  return {
    working: "工作记忆",
    episodic: "事件记忆",
    semantic: "语义记忆",
    procedural: "流程记忆",
    persona: "人格记忆",
    content: "内容记忆"
  }[t] || "长期记忆";
}
function $o(t) {
  return {
    global: "全局",
    agent: "智能体",
    context: "当前上下文",
    session: "当前会话"
  }[t] || t;
}
function qo(t) {
  return {
    manual: "手动",
    auto: "自动",
    llm: "模型抽取"
  }[t] || "自动";
}
function Kr(t) {
  if (!p(t))
    return null;
  const e = o(t.status);
  if (!e)
    return null;
  const n = p(t.memory) ? t.memory : {};
  return {
    status: e,
    type: o(t.type),
    text: o(t.text),
    source_message_id: Number(t.source_message_id || 0) || void 0,
    title: o(t.title || n.title),
    content: o(t.content || n.content),
    reason: o(t.reason),
    existing: p(t.existing) ? t.existing : void 0,
    error: o(t.error)
  };
}
function Vo(t, e) {
  const n = t.trim().toLowerCase(), r = Ho(e);
  return r.length === 0 ? !0 : r.includes(n);
}
function Ho(t) {
  return (Array.isArray(t) ? t : [t]).map((n) => o(n).trim().toLowerCase()).filter(Boolean);
}
function Uo(t, e) {
  if (t.interaction && !t.interactionAnswered)
    return "需要用户参与";
  const n = t.output?.finalOutput, r = o(n?.kind || n?.type).toLowerCase(), s = o(n?.meta?.action).toLowerCase();
  return r === "tool_result" || s === "call_power" ? "工具结果" : e ? "最终结果" : "";
}
function $(t, e = "") {
  const n = { ...t };
  delete n.reasoning;
  const r = Yo(
    o(n.text) || e
  );
  if (r)
    return Ko(
      n,
      r.payload,
      r.cleanText
    );
  const s = Jo(
    o(n.text) || e
  );
  if (s) {
    Gr(n);
    const l = dr(s.payload.content);
    l && ze(n, l), ze(n, s.payload);
    const d = Wt(s.payload) || s.cleanText;
    return d ? n.text = d : delete n.text, n.kind = ts(
      o(
        s.payload.kind || s.payload.type || s.payload.event
      )
    ), n.suggestions = s.payload.suggestions, n.content = l || s.payload.content, n.tasks = s.payload.tasks || l?.tasks, n;
  }
  const a = dr(n.content);
  if (a && (n.content = a), p(n.content) && ze(n, n.content), !o(n.text)) {
    const l = Wt(n);
    l && (n.text = l);
  }
  if (oa(n.text)) {
    const l = aa(n.text);
    l ? n.text = l : delete n.text;
  }
  return n;
}
function Ko(t, e, n) {
  Gr(t);
  const r = Xr(e), s = o(e.power || e.name).trim(), a = o(e.tool || e.name).trim(), l = r === "call_power" ? `能力调用：${s || "未指定能力"}` : `工具调用：${a || "未指定工具"}`, d = n || "智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。";
  return t.event = "result_card", t.kind = "tool_result", t.title = l, t.text = d, t.result_mode = "artifact", t.result = {
    title: l,
    text: d
  }, t.meta = {
    ...p(t.meta) ? t.meta : {},
    action: r,
    power: s,
    tool: a,
    input: e.input || e.params || e.arguments
  }, r === "call_power" && (t.tasks = [
    {
      id: Go(e),
      title: l,
      kind: o(e.kind || s).trim(),
      power: s,
      status: "pending",
      text: "等待能力执行结果",
      input: e.input || e.params || e.arguments
    }
  ]), t;
}
function Go(t) {
  const e = o(
    t.id || t.task_id || t.power || t.name
  ).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return e ? `action-${e}` : "action-call-power";
}
function Gr(t) {
  const e = t;
  pn.forEach((n) => {
    delete e[n];
  }), delete e.content;
}
function be(t) {
  const e = o(t.event).toLowerCase();
  return ["start", "progress", "status", "reasoning", "warning"].includes(e) ? !0 : bn(o(t.text)) ? !es(t) : !1;
}
function bn(t) {
  const e = o(t).trim();
  return e ? !!(e.includes("```agent-interaction") || e.includes("```agent-action") || e.includes("```agent-result") || e.includes("```agent-output")) : !1;
}
function Jo(t) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Qo(t, n);
    if (r)
      return r;
  }
  const e = Yr(t);
  if (e)
    return {
      cleanText: "",
      payload: e
    };
}
function Yo(t) {
  const e = Wo(t, "agent-action");
  if (e)
    return e;
  const n = Jr(t);
  return n ? { cleanText: "", payload: n } : void 0;
}
function Wo(t, e) {
  const n = `\`\`\`${e}`, r = t.indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < t.length && Zr(t[s]); )
    s += 1;
  const a = t.indexOf("```", s), l = a < 0 ? t.slice(s) : t.slice(s, a), d = Jr(l);
  return d ? {
    cleanText: a < 0 ? t.slice(0, r).trim() : `${t.slice(0, r)}${t.slice(a + 3)}`.trim(),
    payload: d
  } : void 0;
}
function Jr(t) {
  const e = t.trim(), n = Wr(e), r = Zo(n), s = [e, n, r];
  for (const a of s)
    if (a.trim())
      try {
        const l = JSON.parse(a);
        if (Qr(l))
          return l;
      } catch {
      }
}
function Zo(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : t.replace(/\\"/g, '"');
}
function Qo(t, e) {
  const n = `\`\`\`${e}`, r = t.indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < t.length && Zr(t[s]); )
    s += 1;
  let a = s;
  for (; a < t.length; ) {
    const l = t.indexOf("```", a);
    if (l < 0)
      return;
    const d = Yr(t.slice(s, l));
    if (d)
      return {
        cleanText: `${t.slice(0, r)}${t.slice(l + 3)}`.trim(),
        payload: d
      };
    a = l + 3;
  }
}
function Yr(t) {
  const e = t.trim(), n = Wr(e), r = n === e ? [e] : [e, n];
  for (const s of r) {
    const a = Xo(s);
    if (a)
      return a;
  }
}
function Xo(t) {
  try {
    const e = JSON.parse(t);
    return na(e) ? e : void 0;
  } catch {
    return;
  }
}
function Wr(t) {
  let e = "", n = !1, r = !1;
  for (const s of t) {
    if (r) {
      e += s, r = !1;
      continue;
    }
    if (s === "\\") {
      e += s, r = n;
      continue;
    }
    if (s === '"') {
      n = !n, e += s;
      continue;
    }
    if (n && ta(s)) {
      e += ea(s);
      continue;
    }
    e += s;
  }
  return e;
}
function ta(t) {
  return t.length > 0 && t.charCodeAt(0) < 32;
}
function ea(t) {
  switch (t) {
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${t.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}
function Zr(t) {
  return t === " " || t === "	" || t === "\r" || t === `
`;
}
function na(t) {
  if (!p(t) || Qr(t))
    return !1;
  const e = ts(
    o(t.kind || t.type || t.event)
  );
  return e === "final_result" || e === "tool_result" || "content" in t || "tasks" in t || "suggestions" in t || ye(t) || p(t.content) && ye(t.content);
}
function Qr(t) {
  if (!p(t))
    return !1;
  const e = Xr(t);
  return e ? e === "call_power" ? !!o(t.power || t.name).trim() : !!o(t.tool || t.name).trim() : !1;
}
function Xr(t) {
  const e = o(t.type || t.action).toLowerCase().trim();
  return e === "power" ? "call_power" : e === "tool" ? "call_tool" : e === "call_power" || e === "call_tool" ? e : "";
}
function ts(t) {
  const e = t.toLowerCase().trim();
  return ["tool", "tool_result", "call_power", "power_result"].includes(e) ? "tool_result" : ["final", "result", "final_result", "answer"].includes(e) ? "final_result" : e || "final_result";
}
function Wt(t) {
  if (!p(t))
    return typeof t == "string" ? o(t) : "";
  if (o(t.text))
    return o(t.text);
  const e = t.content;
  return p(e) ? o(e.text) : typeof e == "string" ? o(e) : "";
}
function dr(t) {
  if (p(t))
    return t;
  if (typeof t == "string" && t.trim())
    return {
      format: "markdown",
      text: t.trim()
    };
  const e = ra(t);
  return e ? {
    format: "markdown",
    text: e
  } : null;
}
function ra(t) {
  const e = sa(t);
  return e.length === 0 ? "" : ia(e);
}
function sa(t) {
  return Array.isArray(t) ? t.flatMap((e) => {
    if (typeof e == "string" && e.trim())
      return [fr(e.trim())];
    if (!p(e))
      return [];
    if (o(e.type) === "text") {
      const r = o(e.text).trim();
      return r ? [fr(r)] : [];
    }
    return [e];
  }) : [];
}
function fr(t) {
  return {
    type: "paragraph",
    content: [{ type: "text", text: t }]
  };
}
function ia(t) {
  const e = [];
  return t.forEach((n) => cn(n, e)), e.join(`

`).trim();
}
function cn(t, e) {
  if (Array.isArray(t)) {
    t.forEach((n) => cn(n, e));
    return;
  }
  if (p(t)) {
    if (o(t.type) === "text") {
      const n = o(t.text).trim();
      n && e.push(n);
      return;
    }
    cn(t.content, e);
  }
}
function oa(t) {
  const e = o(t).trim();
  return /^\[?map\[/.test(e) && e.includes("type:text");
}
function aa(t) {
  return [
    ...o(t).trim().matchAll(/map\[[^\]]*?text:([^\]]*?)(?:\s+type:text|\])/g)
  ].map((r) => r[1]?.trim() || "").filter(Boolean).join(`

`);
}
function ze(t, e) {
  const n = t;
  pn.forEach((r) => {
    const s = e[r];
    Qt(s) && (n[r] = s);
  }), !Qt(t.rich) && p(e.value) && (t.rich = e.value);
}
function ye(t) {
  return pn.some((e) => Qt(t[e])) || p(t.value);
}
function es(t) {
  const e = p(t.content) ? t.content : null;
  return ye(t) || Qt(t.error) || e != null && (ye(e) || Qt(e.text));
}
function Qt(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim().length > 0 : Array.isArray(t) ? t.length > 0 : p(t) ? Object.keys(t).length > 0 : !0;
}
function ca(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(la).filter((n) => n != null).slice(0, 5);
}
function la(t) {
  if (!p(t)) {
    const r = o(t).trim();
    return r ? { label: r, prompt: r } : null;
  }
  const e = o(
    t.prompt || t.text || t.value || t.input
  ).trim(), n = o(
    t.label || t.name || t.title || e
  ).trim();
  return !n || !e ? null : { label: n, prompt: e };
}
function ua({
  open: t,
  interaction: e,
  paramApi: n,
  readonly: r,
  initialData: s,
  disabled: a,
  onOpenChange: l,
  onSubmit: d
}) {
  if (!e)
    return null;
  const x = o(e.title) || "补充交互信息", b = o(e.description) || (r ? "已提交的交互信息，只读查看。" : "填写这些参数后，智能体会继续执行当前任务。");
  return /* @__PURE__ */ u(Sr, { open: t, onOpenChange: l, children: /* @__PURE__ */ m(
    Ar,
    {
      "data-assistant-layer": "true",
      layerClassName: dn,
      layerZIndex: fn,
      className: "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
      children: [
        /* @__PURE__ */ m(Nr, { className: "border-b px-5 py-4 text-start", children: [
          /* @__PURE__ */ u(vr, { children: x }),
          /* @__PURE__ */ u(Dr, { children: b })
        ] }),
        /* @__PURE__ */ u("div", { className: "min-h-0 overflow-hidden", children: /* @__PURE__ */ u(
          Ai,
          {
            interaction: e,
            paramApi: n,
            readonly: r,
            initialData: s,
            disabled: a,
            layout: "dialog",
            hideHeader: !0,
            onSubmit: r ? void 0 : d
          }
        ) })
      ]
    }
  ) });
}
function wn(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.some(wn) : p(t) ? Object.keys(t).length > 0 : !0;
}
function ln(t) {
  if (!(!p(t) || !o(t.type)))
    return t;
}
function Yt(t) {
  if (p(t))
    return ln(t.interaction) || (p(t.content) ? ln(t.content.interaction) : void 0);
}
await window.DeverFront?.ensureCompat?.(["@/lib/store"]);
const un = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!un || Object.keys(un).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const Fe = un.getStoreValueByPath, da = "data.actionTarget.draftAgent";
function ya({ item: t, store: e }) {
  const n = String(t.meta?.draftPath || da), r = String(t.meta?.openPath || ""), s = Dt(
    e,
    () => r ? !!Fe(e, r) : !0
  ), a = Dt(e, () => {
    const F = Fe(e, n);
    if (!Ie(F))
      return 0;
    const G = Number(F.id || 0);
    return Number.isFinite(G) && G > 0 ? G : 0;
  }), l = Dt(e, () => {
    const F = Fe(e, n);
    return Ie(F) ? F : {};
  }), d = pr(
    l.source_skill_id || l.sourceSkillId || 0
  ), x = pr(
    l.pack_id || l.packId || 0
  ), b = String(
    t.meta?.ensureDraftApi || "/bot/admin/skill_draft/from_skill"
  ), [C, _] = S(""), [z, D] = S(!1), I = lt(""), O = String(
    t.meta?.newDraftSessionContext || ""
  ).trim(), [T, yt] = S(
    () => O || mr()
  ), X = lt(s);
  ut(() => {
    if (O) {
      yt(O);
      return;
    }
    !s && X.current && yt(mr()), X.current = s;
  }, [O, s]), ut(() => {
    if (!s || a > 0 || d <= 0 || !b)
      return;
    const F = `${d}:${x || 0}`;
    if (I.current === F)
      return;
    I.current = F, D(!0), _("");
    let G = !1;
    return Y(b, {
      skill_id: d,
      pack_id: x
    }).then((tt) => {
      if (G || I.current !== F)
        return;
      const ft = Ie(tt.draft) ? tt.draft : null;
      ft && e.getState().setValueByPath(n, ft);
    }).catch((tt) => {
      G || I.current !== F || (I.current = "", _(
        tt instanceof Error ? tt.message : "创建未发布版本失败。"
      ));
    }).finally(() => {
      !G && I.current === F && D(!1);
    }), () => {
      G = !0, I.current === F && (I.current = "", D(!1));
    };
  }, [
    a,
    n,
    b,
    s,
    x,
    d,
    e
  ]);
  const dt = it(
    () => ({
      ...t,
      meta: {
        ...t.meta || {},
        sessionEnabled: !0,
        historyEnabled: !1,
        newSessionEnabled: !1,
        skillDraftPatchAutoApply: !1,
        skillDraftPatchCloseOnSave: t.meta?.skillDraftPatchCloseOnSave !== !1,
        sessionContext: a > 0 ? `skill_draft:${a}` : T,
        placeholder: t.meta?.placeholder || "描述要创建或修改的 skill。需要脚本、配置项、MCP、依赖或引用代码时直接说明。",
        emptyText: t.meta?.emptyText || "描述你要创建的技能。AI 会先生成可保存内容，确认后点击“保存”。"
      }
    }),
    [a, t, T]
  );
  return s && z && a <= 0 && d > 0 ? /* @__PURE__ */ u("div", { className: "flex min-h-48 items-center justify-center text-sm text-muted-foreground", children: "正在准备未发布版本..." }) : s && C ? /* @__PURE__ */ u("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: C }) : /* @__PURE__ */ u(Bi, { item: dt, store: e });
}
function pr(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function mr() {
  return `skill_draft:new:${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}
export {
  Bi as ShowAgent,
  ya as ShowSkillCreator
};
