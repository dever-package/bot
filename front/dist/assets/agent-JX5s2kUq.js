import { a as l, j as m, F as Me } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as N, u as mt, b as Y, q as ue, d as rt, n as ks, o as gt } from "./react-C7Xtl8sB.js";
import { L as ct, ai as Jn, a2 as Ds, a9 as Ns, T as Yn, d as Ts, m as Rs, aA as Is, aI as vs, R as In, S as Cs, X as Ps, z as Os } from "./vendor-icons-Cc7Kl3It.js";
import { u as Ms } from "./runtime-entry-CEEPqE_1.js";
import { m as Es } from "./in-flight-request-DlB1DJg0.js";
import { a as G, r as Ee, A as zs, m as Wn, c as $s, b as Fs } from "./skill-draft-patch-BV1e7A5R.js";
import { m as Zn } from "./reference-CNJf8KLT.js";
import { a as It, m as Xn } from "./stream-Y1y6FALE.js";
import { m as Ls } from "./store-BMgfmVDY.js";
import { m as Bs } from "./runtime-stream-runner-BrsTPWU1.js";
import { m as qs } from "./utils-B_fxI2dk.js";
import { m as js } from "./button-CpfaQlDK.js";
import { m as Wt } from "./dialog-Oss_U0H4.js";
import { m as Vs } from "./input-DLnnH2-7.js";
import { m as Hs } from "./textarea-FN7P8RjV.js";
import { m as Us } from "./interaction-panel-Cd_uLE-L.js";
import { m as st } from "./stream-timing-B0L-jg0F.js";
import { m as Ks } from "./content-view-DKqPlRti.js";
import { m as Zt } from "./sheet-CM50TMuv.js";
await window.DeverFront?.ensureCompat?.(["@/components/assistant/session-history-dialog"]);
const ze = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/session-history-dialog");
if (!ze || Object.keys(ze).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/session-history-dialog");
await window.DeverFront?.ensureCompat?.(["@/lib/page-data-reload"]);
const $e = window.DeverFront?.sdk?.getCompatModule("@/lib/page-data-reload");
if (!$e || Object.keys($e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-data-reload");
await window.DeverFront?.ensureCompat?.(["@/components/assistant/reference-picker"]);
const me = window.DeverFront?.sdk?.getCompatModule("@/components/assistant/reference-picker");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/reference-picker");
await window.DeverFront?.ensureCompat?.(["@/components/energon/progress"]);
const Fe = window.DeverFront?.sdk?.getCompatModule("@/components/energon/progress");
if (!Fe || Object.keys(Fe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/progress");
const wt = Xn.streamValueText, et = It.isPlainRecord, Gs = st.StreamTimingBadge, Js = Ks.EnergonContentView, Ys = Fe.EnergonProgressBlock, Ws = Zt.Sheet, Zs = Zt.SheetContent, Xs = Zt.SheetDescription, Qs = Zt.SheetHeader, ti = Zt.SheetTitle;
function ei({
  detail: t,
  running: e,
  timing: n,
  now: r,
  onOpen: s
}) {
  const a = t.tasks.filter((y) => y.status === "failed"), u = t.tasks.filter((y) => y.status === "succeeded"), p = t.tasks.length > 0 ? `素材 ${u.length}/${t.tasks.length}${a.length ? `，失败 ${a.length}` : ""}` : "正文已生成";
  return /* @__PURE__ */ m(
    "button",
    {
      type: "button",
      className: "block w-full rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/40",
      onClick: s,
      children: [
        n ? /* @__PURE__ */ l("div", { className: "mb-2", children: /* @__PURE__ */ l(Gs, { timing: n, now: r, className: "max-w-full" }) }) : null,
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ m("div", { className: "min-w-0", children: [
            /* @__PURE__ */ l("div", { className: "truncate text-sm font-medium", children: "内容已生成" }),
            /* @__PURE__ */ l("div", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: p })
          ] }),
          /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2 text-xs text-primary", children: [
            e ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : null,
            "查看结果",
            /* @__PURE__ */ l(Jn, { className: "size-3.5" })
          ] })
        ] })
      ]
    }
  );
}
function ni({
  open: t,
  detail: e,
  running: n,
  suggestions: r,
  onOpenChange: s
}) {
  const a = e?.title || "最终结果", u = e?.result ? Qn(e.result, e.tasks) : void 0, p = ri(e?.progressText);
  return /* @__PURE__ */ l(Ws, { open: t, onOpenChange: s, children: /* @__PURE__ */ m(
    Zs,
    {
      side: "right",
      className: "flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
      children: [
        /* @__PURE__ */ m(Qs, { className: "border-b px-5 py-4 text-start", children: [
          /* @__PURE__ */ l(ti, { className: "truncate", children: a }),
          /* @__PURE__ */ l(Xs, { children: n ? "内容和素材仍在更新。" : "最终结果可在这里完整查看。" })
        ] }),
        /* @__PURE__ */ m("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 py-4", children: [
          p ? /* @__PURE__ */ l("div", { className: "mb-4", children: /* @__PURE__ */ l(
            Ys,
            {
              message: p,
              percent: e.progress
            }
          ) }) : null,
          u ? /* @__PURE__ */ l(Js, { output: u, emptyText: "暂无结果内容。" }) : /* @__PURE__ */ l("div", { className: "rounded-md border bg-muted/25 px-3 py-2 text-sm text-muted-foreground", children: "正在准备结果内容。" })
        ] }),
        r ? /* @__PURE__ */ l("div", { className: "border-t px-5 py-3", children: r }) : null
      ]
    }
  ) });
}
function ri(t) {
  const e = wt(t).trim();
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
function Qn(t, e) {
  if (e.length === 0)
    return t;
  const n = /* @__PURE__ */ new Map();
  e.forEach((a) => {
    a.placeholderID && n.set(a.placeholderID, a), n.set(a.id, a);
  });
  const r = { ...t }, s = vn(r.rich, n);
  if (s && (r.rich = s), et(r.content)) {
    const a = { ...r.content }, u = vn(a.rich, n);
    u && (a.rich = u, r.content = a);
  }
  return r;
}
function vn(t, e) {
  if (!et(t))
    return t;
  const n = tr(t, e);
  return n.length === 1 ? n[0] : t;
}
function tr(t, e) {
  const n = wt(t.type), r = { ...t };
  if (n === "agentAbilityPlaceholder" || n === "agentTaskPlaceholder") {
    const s = et(t.attrs) ? { ...t.attrs } : {}, a = wt(
      s.placeholder_id || s.placeholderId || s.id
    ), u = e.get(a);
    if (u) {
      const p = si(u);
      if (p.length > 0)
        return p;
      r.attrs = {
        ...s,
        status: u.status,
        progress: u.progress,
        title: u.title,
        kind: u.kind,
        text: u.text,
        error: u.error
      };
    }
    return [r];
  }
  if (Array.isArray(t.content)) {
    const s = [];
    t.content.forEach((a) => {
      et(a) ? s.push(...tr(a, e)) : s.push(a);
    }), r.content = s;
  }
  return [r];
}
function si(t) {
  if (t.status !== "succeeded" || !t.output)
    return [];
  const e = t.kind.toLowerCase();
  if (e === "image" || e === "images" || e === "cover") {
    const a = Nt(
      "editorMediaImage",
      Tt(t.output, "images", "image"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "video" || e === "videos") {
    const a = Nt(
      "editorMediaVideo",
      Tt(t.output, "videos", "video"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "audio" || e === "audios" || e === "song" || e === "music") {
    const a = Nt(
      "editorMediaAudio",
      Tt(t.output, "audios", "audio"),
      t.title
    );
    if (a.length > 0)
      return [...a, ...ii(t.output)];
  }
  const n = [
    ...Nt(
      "editorMediaImage",
      Tt(t.output, "images", "image"),
      t.title
    ),
    ...Nt(
      "editorMediaVideo",
      Tt(t.output, "videos", "video"),
      t.title
    ),
    ...Nt(
      "editorMediaAudio",
      Tt(t.output, "audios", "audio"),
      t.title
    )
  ];
  if (n.length > 0)
    return n;
  const r = er(t.output);
  if (r.length > 0)
    return r;
  const s = nr(t.output);
  return s ? rr(s) : [];
}
function Nt(t, e, n) {
  return e.map((r) => ({
    type: t,
    attrs: {
      src: r,
      title: n,
      alt: n
    }
  }));
}
function Tt(t, e, n) {
  const r = et(t.content) ? t.content : {};
  return ai([
    ...Ut(r[e]),
    ...Ut(r[n]),
    ...Ut(t[e]),
    ...Ut(t[n])
  ]);
}
function er(t) {
  const e = et(t.content) ? t.content : {}, n = et(t.rich) ? t.rich : et(e.rich) ? e.rich : null;
  return !n || wt(n.type) !== "doc" || !Array.isArray(n.content) ? [] : n.content.filter(
    (r) => et(r)
  );
}
function nr(t) {
  const e = et(t.content) ? t.content : {}, n = t;
  return wt(
    t.text || e.text || n.lyrics || e.lyrics || n.lyric || e.lyric || n.lrc || e.lrc || n.song_lyrics || e.song_lyrics || n.songLyrics || e.songLyrics || t.title || e.title
  ).trim();
}
function ii(t) {
  const e = er(t);
  if (e.length > 0)
    return e;
  const n = nr(t);
  return n ? rr(n) : [];
}
function rr(t) {
  return t.split(/\n{2,}/).map((e) => e.trim()).filter(Boolean).map((e) => ({
    type: "paragraph",
    content: oi(e)
  }));
}
function oi(t) {
  const e = t.split(/\n/), n = [];
  return e.forEach((r, s) => {
    s > 0 && n.push({ type: "hardBreak" }), r && n.push({ type: "text", text: r });
  }), n;
}
function Ut(t) {
  if (t == null)
    return [];
  if (typeof t == "string") {
    const n = t.trim();
    return n ? [n] : [];
  }
  if (Array.isArray(t))
    return t.flatMap((n) => Ut(n));
  if (et(t))
    for (const n of ["url", "src", "uri", "href"]) {
      const r = wt(t[n]).trim();
      if (r)
        return [r];
    }
  const e = wt(t).trim();
  return e ? [e] : [];
}
function ai(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  return t.forEach((r) => {
    const s = r.trim();
    !s || e.has(s) || (e.add(s), n.push(s));
  }), n;
}
const ci = Es.request, li = Wn.runAgentStream, ui = Wn.stopAgentStream, di = Zn.assistantReferencePayload, fi = Zn.buildAssistantReferenceMessage, sr = Fs.reloadStorePageSchema, Le = It.isEmptyRuntimeOutput, f = It.isPlainRecord, Rt = It.normalizeRuntimeFrameOutput, pi = It.resolveRuntimeFrameCancelable, W = It.runtimeErrorMessage, lt = Ls.getStoreValueByPath, o = Xn.streamValueText, mi = Bs.watchRuntimeStream, Jt = qs.cn, z = js.Button, ir = Wt.Dialog, or = Wt.DialogContent, ar = Wt.DialogDescription, cr = Wt.DialogHeader, lr = Wt.DialogTitle, gi = Vs.Input, ur = Hs.Textarea, hi = Us.AgentInteractionPanel, xi = me.AssistantReferenceList, yi = me.AssistantReferencePicker, bi = st.cancelStreamTiming, wi = st.StreamTimingBadge, Ai = st.createRuntimeStreamTiming, dr = st.createStreamTiming, ve = st.finishStreamTiming, Si = st.isStreamTimingStatusOutput, _i = st.markStreamTimingStopping, ki = st.updateStreamTimingFromOutput, Di = st.useStreamClock, Ue = "z-[100]", Ke = 1e3, fr = 3, Cn = "/bot/admin/agent/run", Ni = "/bot/admin/agent/run_status", Pn = ze.AssistantSessionHistoryDialog, Ti = typeof Pn == "function" ? Pn : $i, On = $e.reloadStoreDataContainer, Ge = [
  "title",
  "rich",
  "images",
  "videos",
  "audios",
  "files",
  "json"
], Ce = {
  text: "",
  finalOutput: null
}, Ri = 15 * 1e3, Ii = 1500, vi = 6;
function Sa({ item: t, store: e }) {
  const n = Ms(), [r, s] = N([]), [a, u] = N(""), [p, y] = N([]), [b, v] = N(""), [S, L] = N(""), [R, J] = N(0), [B, O] = N(!1), [vt, ut] = N(!1), [ht, Ct] = N(!1), [Pt, Ot] = N(!1), [At, x] = N([]), [Z, F] = N(!1), [St, it] = N(""), [w, te] = N(!1), [en, Mt] = N(!1), [ye, Et] = N(!1), [nn, H] = N(""), [rn, ee] = N("0-0"), [Fr, zt] = N(!1), [be, $t] = N(""), [we, ne] = N(""), _t = mt(0), Ae = mt(null), Se = mt(""), _e = mt(""), sn = mt(""), ot = mt(0), on = mt(/* @__PURE__ */ new Set()), an = mt(!1), ke = Y(() => {
    const i = Ae.current;
    i && Mn(i);
  }, []), _ = ue(
    e,
    () => o(lt(e, String(t.meta?.agentPath || "")))
  ), xt = ue(
    e,
    () => o(
      lt(e, String(t.meta?.agentNamePath || ""))
    )
  ), nt = String(t.meta?.openPath || ""), yt = ue(
    e,
    () => nt ? !!lt(e, nt) : !0
  ), cn = String(t.meta?.requestApi || Cn), ln = String(t.meta?.streamApi || "/bot/admin/agent/stream"), un = String(t.meta?.stopApi || "/bot/admin/agent/stop"), De = Object.prototype.hasOwnProperty.call(
    t.meta || {},
    "runStatusApi"
  ) ? String(t.meta?.runStatusApi || "") : cn === Cn ? Ni : "", Lr = String(
    t.meta?.paramApi || "/bot/admin/energon/power_params"
  ), C = !!t.meta?.sessionEnabled, re = C && t.meta?.historyEnabled !== !1, Br = t.meta?.newSessionEnabled !== !1, dt = C && Pt, se = String(
    t.meta?.sessionApi || "/bot/admin/assistant/session"
  ), dn = String(
    t.meta?.sessionsApi || "/bot/admin/assistant/sessions"
  ), fn = String(
    t.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session"
  ), pn = String(
    t.meta?.restoreSessionApi || "/bot/admin/assistant/restore_session"
  ), mn = String(
    t.meta?.renameSessionApi || "/bot/admin/assistant/rename_session"
  ), gn = String(
    t.meta?.newSessionApi || "/bot/admin/assistant/new_session"
  ), qr = String(
    t.meta?.clearSessionApi || "/bot/admin/assistant/clear_session"
  ), jr = String(
    t.meta?.messageApi || "/bot/admin/assistant/message"
  ), hn = String(
    t.meta?.memoriesApi || "/bot/admin/assistant/memories"
  ), xn = String(
    t.meta?.updateMemoryApi || "/bot/admin/assistant/update_memory"
  ), yn = String(
    t.meta?.forgetMemoryApi || "/bot/admin/assistant/forget_memory"
  ), ie = String(t.meta?.skillDraftPatchApi || ""), Vr = String(
    t.meta?.skillDraftPatchListPath || "/bot/agent/skill_draft/list"
  ), Hr = t.meta?.skillDraftPatchAutoApply !== !1, U = ue(
    e,
    () => qi(t.meta?.sessionContext, e, _)
  ), bn = Number(t.meta?.blockMs || 1e3), wn = String(t.meta?.initialInput || ""), Ur = String(
    t.meta?.placeholder || "输入本轮任务，当前弹窗内的上下文会一起发送。"
  ), Kr = String(t.meta?.emptyText || ""), Gr = o(t.meta?.height || t.meta?.containerHeight).trim() || "min(calc(85vh - 11rem), 620px)", oe = rt(
    () => [...r].reverse().find(
      (i) => i.role === "assistant" && i.interaction && !i.interactionAnswered
    ),
    [r]
  ), Ft = oe?.id || "", Lt = rt(() => be && r.find(
    (i) => i.id === be && i.role === "assistant" && !!i.interaction
  ) || oe, [be, r, oe]), ft = rt(() => {
    if (we)
      return r.find(
        (i) => i.id === we && i.role === "assistant"
      );
  }, [r, we]), Ne = rt(
    () => ft ? Xt(ft) : null,
    [ft]
  ), Jr = !!ft?.running, An = rt(
    () => ft ? Nr(
      ft,
      !!Ne
    ) : [],
    [Ne, ft]
  ), X = rt(
    () => r.some(
      (i) => i.role === "assistant" && !!i.running
    ),
    [r]
  ), Yr = rt(
    () => (a.trim().length > 0 || p.length > 0) && _.length > 0 && !B && !w && !X,
    [
      _,
      X,
      a,
      p.length,
      w,
      B
    ]
  ), Wr = rt(
    () => r.some(
      (i) => i.actionTiming && i.actionTiming.status === "running"
    ),
    [r]
  ), Zr = Di(Wr), ae = rt(
    () => Ci(r),
    [r]
  ), Sn = rt(
    () => At.filter(je).length,
    [At]
  );
  ks(() => {
    if (!ae || ae === Se.current)
      return;
    Se.current = ae;
    const i = Ae.current;
    if (i)
      return Mn(i);
  }, [ae]);
  const at = Y(() => {
    ot.current += 1, Se.current = "", s([]), u(wn), y([]), v(""), L(""), _t.current = 0, J(0), Ot(!1), x([]), it(""), te(!1), Mt(!1), Et(!1), H(""), ee("0-0"), zt(!1), $t(""), ne(""), ut(!1), Ct(!1);
  }, [wn]), Bt = Y(
    (i) => {
      const c = f(i) ? i : {}, d = f(c.session) ? c.session : {}, g = Number(d.id || 0), A = Number.isFinite(g) ? g : 0;
      _t.current = A, J(A), Ot(!!c.memory_enabled), s(Yi(c.messages)), x(Un(c.memories)), ke();
    },
    [ke]
  ), qt = Y(
    async (i = !1) => {
      if (!(!C || !_)) {
        O(!0);
        try {
          const c = await G(
            i ? gn : se,
            {
              agent_key: _,
              context_key: U,
              title: xt ? `${xt} 会话` : "新会话",
              limit: 80
            }
          );
          Bt(c), H("");
        } catch (c) {
          H(W(c, "加载会话失败。"));
        } finally {
          O(!1);
        }
      }
    },
    [
      _,
      xt,
      Bt,
      gn,
      se,
      U,
      C
    ]
  ), Xr = async () => {
    if (!C || !R || w) {
      at();
      return;
    }
    O(!0);
    try {
      const i = await G(qr, {
        session_id: R
      });
      Bt(i);
    } catch (i) {
      H(W(i, "清空会话失败。"));
    } finally {
      O(!1);
    }
  }, Qr = Y(
    async (i) => {
      if (!re || !_)
        return so(i);
      const c = await G(dn, {
        agent_key: _,
        context_key: U,
        page: i.page,
        page_size: i.pageSize,
        keyword: i.keyword,
        status: i.status
      }), d = f(c) ? c : {};
      return H(""), {
        sessions: no(d.sessions),
        pagination: ro(d.pagination, i)
      };
    },
    [_, re, U, dn]
  ), kt = Y(async () => {
    if (!dt || !_) {
      x([]);
      return;
    }
    F(!0);
    try {
      const i = R || _t.current, c = await G(hn, {
        agent_key: _,
        context_key: U,
        session_id: i || void 0,
        scope: "current",
        status: "all",
        page: 1,
        page_size: 50
      }), d = f(c) ? c : {};
      x(Un(d.memories)), it(""), H("");
    } catch (i) {
      it(W(i, "加载长期记忆失败。"));
    } finally {
      F(!1);
    }
  }, [
    _,
    hn,
    dt,
    U,
    R
  ]), ts = Y(() => {
    Ct(!0);
  }, []), es = Y(
    async (i, c) => {
      if (!dt || i <= 0)
        return;
      const d = R || _t.current, g = await G(xn, {
        id: i,
        ...c,
        agent_key: _,
        context_key: U,
        session_id: d || void 0
      }), A = f(g) ? g : {}, h = Tr(A.memory);
      h ? x((I) => vo(I, h)) : await kt(), it("");
    },
    [
      _,
      kt,
      dt,
      U,
      R,
      xn
    ]
  ), ns = Y(
    async (i) => {
      !dt || i <= 0 || (await G(yn, { id: i }), x(
        (c) => c.map(
          (d) => d.id === i ? { ...d, status: 2 } : d
        )
      ), it(""));
    },
    [yn, dt]
  ), rs = Y(
    async (i) => {
      await G(fn, {
        session_id: i
      });
    },
    [fn]
  ), ss = Y(
    async (i) => {
      await G(pn, {
        session_id: i
      });
    },
    [pn]
  ), is = Y(
    async (i, c) => {
      const d = await G(mn, {
        session_id: i,
        title: c
      });
      return gr(
        f(d) ? d.session : null
      );
    },
    [mn]
  ), os = async (i) => {
    if (!(!i || w)) {
      O(!0);
      try {
        const c = await G(se, {
          session_id: i,
          agent_key: _,
          context_key: U,
          limit: 80
        });
        Bt(c), ut(!1), H("");
      } catch (c) {
        H(W(c, "打开会话失败。"));
      } finally {
        O(!1);
      }
    }
  }, as = async () => {
    if (!C || w) {
      at();
      return;
    }
    at(), await qt(!0);
  }, cs = async () => {
    if (!C)
      return 0;
    if (R > 0)
      return R;
    const i = await G(se, {
      agent_key: _,
      context_key: U,
      title: xt ? `${xt} 会话` : "新会话",
      limit: 80
    });
    Bt(i);
    const c = f(i) && f(i.session) ? i.session : {}, d = Number(c.id || 0);
    return Number.isFinite(d) ? d : 0;
  }, ce = async (i, c, d) => {
    if (!(!C || i <= 0))
      return await G(jr, {
        session_id: i,
        agent_key: _,
        context_key: U,
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
        output: d?.output || c.output || {},
        request_id: d?.requestID || c.requestID || "",
        status: d?.status || 1
      });
  }, ls = async (i, c) => {
    const d = $n(i);
    if (!d)
      return;
    const g = await En(
      De,
      d
    ).catch(() => null), A = zn(g, d);
    if (!A || Number(A.status) === 2)
      return;
    const h = Rt(A?.output, A), I = Kt(h), k = Gt(h) || o(A?.msg), T = {
      ...i,
      text: k,
      output: {
        text: k,
        finalOutput: $(h, k)
      },
      interaction: I,
      interactionAnswered: I ? !1 : void 0,
      running: !1,
      error: void 0,
      requestID: d
    };
    s(
      (q) => q.map(
        (j) => j.id === i.id ? T : j
      )
    ), await ce(c, T, {
      requestID: d,
      output: h,
      status: 1
    });
  };
  gt(() => {
    !C || R <= 0 || r.forEach((i) => {
      const c = $n(i);
      !c || on.current.has(c) || (on.current.add(c), ls(i, R));
    });
  }, [r, De, C, R]), gt(() => {
    nt && (yt && !an.current && !w && at(), an.current = yt);
  }, [yt, nt, at, w]), gt(() => {
    at();
  }, [_, at]), gt(() => {
    !C || !_ || nt && !yt || w || Ft || qt(!1);
  }, [
    _,
    qt,
    yt,
    nt,
    Ft,
    w,
    C
  ]), gt(() => {
    ht && kt();
  }, [kt, ht]), gt(() => {
    if (!C || !_ || w || B || nt && !yt || !X)
      return;
    const i = window.setTimeout(() => {
      qt(!1);
    }, 2e3);
    return () => {
      window.clearTimeout(i);
    };
  }, [
    _,
    X,
    qt,
    yt,
    nt,
    w,
    C,
    B
  ]), gt(() => {
    Ft && ($t(Ft), zt(!0));
  }, [Ft]);
  const us = (i) => {
    $t(i), zt(!0);
  }, ds = (i) => {
    zt(i), i || $t("");
  }, _n = async () => {
    const i = p, c = a.trim() || (i.length > 0 ? "请根据参考资料和当前任务进行分析。" : "");
    if (!c || w || X)
      return;
    const d = di(i);
    i.length > 0 && (y([]), v("")), await Te(
      {
        text: c,
        ...d ? { reference_files: d } : {}
      },
      {
        role: "user",
        text: fi(c, i),
        kind: "chat",
        data: d ? { reference_files: d } : void 0
      },
      r
    );
  }, kn = async (i) => {
    const c = i.prompt.trim();
    !c || w || X || (ne(""), await Te(
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
  }, fs = async (i) => {
    const c = Lt;
    if (!c?.interaction || c.interactionAnswered || w)
      return;
    const d = Qi(
      r,
      c.id,
      i.data
    );
    zt(!1), $t(""), await Te(
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
      d,
      c.id,
      i.data
    );
  }, Te = async (i, c, d, g = "", A) => {
    if (!_) {
      H("未选择智能体。");
      return;
    }
    let h = 0;
    if (C)
      try {
        h = await cs();
      } catch (D) {
        H(W(D, "创建会话失败。"));
        return;
      }
    const I = ot.current + 1, k = {
      id: `${I}-user-${Date.now()}`,
      ...c
    }, T = `${I}-assistant-${Date.now()}`, q = {
      id: T,
      role: "assistant",
      text: "",
      output: Ce,
      running: !0,
      actionTiming: dr("等待智能体返回")
    }, j = po(d), Q = io(
      i,
      pe(t.meta?.inputContext, e)
    );
    h > 0 && (Q.assistant_session_id = h), ot.current = I, _e.current = "", s((D) => [...g ? D.map(
      (tt) => tt.id === g ? {
        ...tt,
        interactionAnswered: !0,
        interactionData: A
      } : tt
    ) : D, k, q]), ke(), u(""), te(!0), Mt(!1), Et(!1), H(""), L(""), ee("0-0");
    try {
      await ce(h, k);
    } catch (D) {
      H(W(D, "保存用户消息失败。"));
    }
    let V = !1, K = "", M = "0-0", bt = !1, Dt = null;
    const Vt = (D) => {
      const E = o(D);
      !E || h <= 0 || bt || (bt = !0, Dt = ce(
        h,
        {
          ...q,
          text: "智能体正在处理...",
          requestID: E
        },
        {
          requestID: E,
          output: {
            event: "running",
            text: "智能体正在处理..."
          },
          status: fr
        }
      ));
    }, Re = (D, E, tt) => {
      (async () => (Dt && await Dt.catch(() => {
      }), await ce(h, D, {
        requestID: D.requestID || K || S,
        output: E,
        status: tt
      })))().then((pt) => bs(T, pt));
    };
    try {
      await li({
        agent: _,
        input: Q,
        history: j,
        requestApi: cn,
        streamApi: ln,
        stopApi: un,
        blockMs: bn,
        onRequestID: (D) => {
          K = o(D), L(K), Vt(K);
        },
        onFrame: (D) => {
          if (ot.current !== I)
            return;
          const E = o(D?.stream_id);
          if (E && (M = E, ee(E)), Tn(T, D), Dn(D, T), h > 0 && D?.type === "result" && !V) {
            V = !0;
            const tt = Rt(
              D?.output,
              D
            ), pt = Kt(tt), Ht = o(D?.request_id) || K || S, Ie = Gt(tt) || o(D?.msg);
            Re(
              {
                ...q,
                text: Ie,
                output: {
                  text: Ie,
                  finalOutput: $(
                    tt,
                    Ie
                  )
                },
                interaction: pt,
                interactionAnswered: pt ? !1 : void 0,
                running: !1,
                requestID: Ht
              },
              tt,
              Number(D.status) === 2 ? 2 : 1
            );
          }
        }
      });
    } catch (D) {
      if (ot.current === I) {
        const E = W(D, "智能体测试失败。");
        if (Be(E) ? await ps({
          activeSessionID: h,
          assistantMessage: q,
          requestID: K || S,
          lastID: M,
          streamApi: ln,
          runStatusApi: De,
          blockMs: bn,
          token: I,
          isAlreadySaved: () => V,
          markSaved: () => {
            V = !0;
          },
          applyFrame: (pt) => {
            const Ht = o(pt?.stream_id);
            Ht && (M = Ht, ee(Ht)), Tn(T, pt), Dn(pt, T);
          },
          saveFinal: Re
        }) : !1)
          return;
        H(E), Ss(T, E), h > 0 && !V && !Be(E) && (V = !0, Re(
          {
            ...q,
            text: E,
            requestID: K || S
          },
          { error: E, text: E },
          2
        ));
      }
    } finally {
      ot.current === I && (te(!1), Mt(!1), Et(!1), _s(T));
    }
  }, ps = async ({
    activeSessionID: i,
    assistantMessage: c,
    requestID: d,
    lastID: g,
    streamApi: A,
    runStatusApi: h,
    blockMs: I,
    token: k,
    isAlreadySaved: T,
    markSaved: q,
    applyFrame: j,
    saveFinal: Q
  }) => {
    if (!d || T())
      return !1;
    const V = (M) => {
      if (j(M), M?.type !== "result")
        return !1;
      if (i > 0 && !T()) {
        q();
        const bt = Rt(M?.output, M), Dt = Kt(bt), Vt = Gt(bt) || o(M?.msg);
        Q(
          {
            ...c,
            text: Vt,
            output: {
              text: Vt,
              finalOutput: $(bt, Vt)
            },
            interaction: Dt,
            interactionAnswered: Dt ? !1 : void 0,
            running: !1,
            requestID: o(M?.request_id) || d
          },
          bt,
          Number(M.status) === 2 ? 2 : 1
        );
      }
      return Number(M.status) !== 2;
    };
    let K = !1;
    try {
      await mi({
        streamApi: A,
        requestID: d,
        lastID: g || "0-0",
        blockMs: I,
        transport: "poll",
        stopOnResult: !0,
        recoverOnError: !0,
        acceptErrorResult: !0,
        onFrame: (M) => {
          if (ot.current !== k)
            return !1;
          if (M?.type !== "result") {
            j(M);
            return;
          }
          return V(M), K = !0, !1;
        }
      });
    } catch {
      K = !1;
    }
    return K ? !0 : h ? await ms({
      runStatusApi: h,
      requestID: d,
      token: k,
      applyResultFrame: V
    }) : !1;
  }, ms = async ({
    runStatusApi: i,
    requestID: c,
    token: d,
    applyResultFrame: g
  }) => {
    const A = Date.now() + Ri;
    let h = 0, I = 0;
    const k = /* @__PURE__ */ new Set();
    for (; ot.current === d && Date.now() < A && I < vi; ) {
      I += 1;
      const T = await En(
        i,
        c
      ).catch(() => (h += 1, null));
      if (h >= 3)
        return !1;
      T && (h = 0);
      for (const j of Pi(
        T,
        c,
        k
      )) {
        const Q = o(j.stream_id);
        if (Q && k.add(Q), g(j))
          return !0;
      }
      const q = zn(T, c);
      if (q)
        return g(q), !0;
      await zi(Ii);
    }
    return !1;
  }, gs = async () => {
    if (!(!S || !en || ye)) {
      Et(!0), ws();
      try {
        await ui(S, un), ot.current += 1, te(!1), Mt(!1), As();
      } catch (i) {
        H(W(i, "停止智能体失败。"));
      } finally {
        Et(!1);
      }
    }
  }, hs = (i) => {
    (i.metaKey || i.ctrlKey) && i.key === "Enter" && (i.preventDefault(), _n());
  }, Dn = (i, c) => {
    if (xs(i, c), i?.type !== "result" || t.meta?.reloadPageOnFinal !== !0 || Number(i.status) === 2)
      return;
    const d = Rt(i?.output, i), g = o(d.kind || d.type || d.event).trim().toLowerCase();
    if (g === "skill_draft_patch" && ie || !Mo(g, t.meta?.reloadPageOnFinalKinds))
      return;
    const A = [i.request_id, i.stream_id, g].map(o).join(":");
    if (_e.current === A)
      return;
    _e.current = A;
    const h = Math.max(
      0,
      Number(t.meta?.reloadPageOnFinalDelayMs || 0)
    );
    window.setTimeout(() => {
      sr(e);
    }, h);
  }, xs = (i, c) => {
    if (i?.type !== "result" || !ie || !Hr || Number(i.status) === 2)
      return;
    const d = Rt(i?.output, i), g = Ee(d);
    if (!g)
      return;
    const A = [i.request_id, i.stream_id, "skill_draft_patch"].map(o).join(":");
    if (sn.current === A)
      return;
    sn.current = A;
    const h = pe(
      t.meta?.skillDraftPatchContext,
      e
    ), I = {
      ...g,
      ...h,
      ...Fn(
        C,
        R || _t.current,
        _,
        U
      )
    };
    Nn(c, I);
  }, Nn = (i, c) => {
    le(i, {
      status: "saving",
      draft_id: P(
        c,
        "id",
        "draft_id",
        "draftId"
      ),
      message: "正在保存技能..."
    }), G(ie, c).then(async (d) => {
      Vi(
        e,
        t.meta?.skillDraftPatchTargetPath,
        c,
        d
      ), await Li(
        e,
        t.meta?.skillDraftPatchReloadDataKeys,
        t.meta?.skillDraftPatchReloadDataKey,
        t.meta?.skillDraftPatchReloadPageOnSave
      ), Hi(
        e,
        t.meta?.skillDraftPatchTablePath,
        t.meta?.skillDraftPatchTargetPath,
        c,
        d
      ), le(i, {
        status: "saved",
        draft_id: P(d, "draft_id", "draftId", "id") || P(c, "id", "draft_id", "draftId"),
        message: "技能已保存。"
      }), t.meta?.skillDraftPatchCloseOnSave === !0 && nt && e.getState().setValueByPath(nt, !1);
    }).catch((d) => {
      const g = W(d, "保存技能失败。");
      le(i, {
        status: "failed",
        message: g
      }), H(g);
    });
  }, ys = (i, c) => {
    if (!ie || !c)
      return;
    const d = Ee(c);
    if (!d) {
      le(i, {
        status: "failed",
        message: "没有找到可保存的技能内容。"
      });
      return;
    }
    const g = pe(
      t.meta?.skillDraftPatchContext,
      e
    ), A = {
      ...d,
      ...g,
      ...Fn(
        C,
        R || _t.current,
        _,
        U
      )
    };
    Nn(i, A);
  }, Tn = (i, c, d) => {
    const g = Rt(c?.output, c);
    if (Le(g) && c?.type !== "result")
      return;
    const A = pi(c);
    A != null && Mt(A), jt(i, (h) => {
      const I = h.output || Ce, k = {
        text: I.text,
        finalOutput: I.finalOutput
      }, T = Ye(g), q = Kt(g);
      if (c?.type !== "result" && xr(T))
        return ho(h, g, c);
      let j = h.actionTiming;
      Si(g) && (j = ki(j, g));
      const Q = yo(
        h.resultDetail,
        g,
        c
      );
      if (c?.type === "result") {
        let V = Le(g) ? $({
          text: k.text || o(c?.msg)
        }) : g;
        xe(V) && k.text.trim() && (V = $({
          ...V,
          event: "final",
          text: k.text
        })), k.finalOutput = V;
        const K = o(V.text) || k.text, M = Ze(
          Q,
          We(V)
        );
        return {
          ...h,
          text: K,
          interaction: q || h.interaction,
          output: k,
          resultDetail: M,
          running: !1,
          requestID: o(c?.request_id) || h.requestID,
          actionTiming: ve(
            j,
            Number(c.status) === 2 ? "failed" : "done"
          )
        };
      }
      return T === "interaction" ? (g.text && (k.text = o(g.text)), {
        ...h,
        text: k.text,
        interaction: q || h.interaction,
        output: k,
        resultDetail: Q,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: j
      }) : ((T === "delta" || !T && g.text) && (k.text += o(g.text)), {
        ...h,
        text: k.text,
        interaction: q || h.interaction,
        output: k,
        resultDetail: Q,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: j
      });
    });
  }, jt = (i, c) => {
    s(
      (d) => d.map(
        (g) => g.id === i && g.role === "assistant" ? c(g) : g
      )
    );
  }, le = (i, c) => {
    i && jt(i, (d) => ({
      ...d,
      data: {
        ...d.data || {},
        skillDraftPatch: c
      }
    }));
  }, bs = (i, c) => {
    const d = f(c) && f(c.message) ? c.message : {}, g = f(d.output) ? d.output : {}, A = Rr(g.memory_review);
    A && Pt && (jt(i, (h) => ({
      ...h,
      output: {
        ...h.output || Ce,
        finalOutput: {
          ...h.output?.finalOutput || {},
          memory_review: A
        }
      }
    })), kt());
  }, Rn = (i) => {
    s(
      (c) => c.map(
        (d) => d.role === "assistant" && d.running ? i(d) : d
      )
    );
  }, ws = () => {
    Rn((i) => ({
      ...i,
      actionTiming: _i(i.actionTiming)
    }));
  }, As = () => {
    Rn((i) => ({
      ...i,
      running: !1,
      actionTiming: bi(i.actionTiming)
    }));
  }, Ss = (i, c) => {
    jt(i, (d) => ({
      ...d,
      error: c,
      running: !1,
      actionTiming: ve(d.actionTiming, "failed")
    }));
  }, _s = (i) => {
    jt(i, (c) => ({
      ...c,
      running: !1,
      actionTiming: ve(c.actionTiming, "done")
    }));
  };
  return /* @__PURE__ */ m(
    "div",
    {
      className: "flex min-h-0 flex-col gap-3 overflow-hidden",
      style: { height: Gr },
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            ref: Ae,
            className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3",
            children: [
              r.length === 0 ? /* @__PURE__ */ l("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: Kr || `输入一次任务开始测试${xt ? `「${xt}」` : "智能体"}。` }) : null,
              r.map((i) => /* @__PURE__ */ l(
                "div",
                {
                  className: Jt(
                    "flex",
                    i.role === "user" ? "justify-end" : "justify-start"
                  ),
                  children: /* @__PURE__ */ l(
                    "div",
                    {
                      className: Jt(
                        "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                        i.role === "user" ? "border-primary/20 bg-primary text-primary-foreground" : "bg-muted/35 text-foreground"
                      ),
                      children: i.role === "user" ? /* @__PURE__ */ l("div", { className: "whitespace-pre-wrap break-all", children: i.text }) : /* @__PURE__ */ l(
                        oo,
                        {
                          message: i,
                          now: Zr,
                          running: w,
                          memoryEnabled: Pt,
                          onOpenInteraction: us,
                          onOpenResult: () => ne(i.id),
                          onOpenDraftBox: () => n({ to: Vr }),
                          onApplySkillDraftPatch: (c) => ys(i.id, c),
                          onSendSuggestion: (c) => {
                            kn(c);
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
        /* @__PURE__ */ l(
          ea,
          {
            open: !!Lt?.interaction && Fr,
            interaction: Lt?.interaction,
            paramApi: Lr,
            readonly: !!Lt?.interactionAnswered,
            initialData: Lt?.interactionData,
            disabled: w,
            onOpenChange: ds,
            onSubmit: (i) => {
              fs(i);
            }
          }
        ),
        /* @__PURE__ */ l(
          ni,
          {
            open: !!ft,
            detail: Ne,
            running: Jr,
            suggestions: An.length > 0 ? /* @__PURE__ */ l(
              hr,
              {
                suggestions: An,
                disabled: w,
                onSelect: (i) => {
                  kn(i);
                }
              }
            ) : null,
            onOpenChange: (i) => {
              i || ne("");
            }
          }
        ),
        re ? /* @__PURE__ */ l(
          Ti,
          {
            open: vt,
            onOpenChange: ut,
            agentKey: _,
            contextKey: U,
            activeSessionID: R,
            disabled: w || B,
            assistantLayer: !0,
            layerClassName: Ue,
            layerZIndex: Ke,
            loadSessions: Qr,
            onOpenSession: (i) => os(i),
            onArchiveSession: rs,
            onRestoreSession: ss,
            onRenameSession: is
          }
        ) : null,
        dt ? /* @__PURE__ */ l(
          co,
          {
            open: ht,
            memories: At,
            loading: Z,
            error: St,
            disabled: w || B,
            onOpenChange: Ct,
            onRefresh: kt,
            onUpdate: es,
            onForget: ns
          }
        ) : null,
        nn ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: nn }) : null,
        /* @__PURE__ */ m("div", { className: "shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20", children: [
          p.length > 0 ? /* @__PURE__ */ l("div", { className: "border-b px-3 py-2", children: /* @__PURE__ */ l(
            xi,
            {
              references: p,
              disabled: w || X,
              onRemove: (i) => y(
                (c) => c.filter((d, g) => g !== i)
              )
            }
          ) }) : null,
          /* @__PURE__ */ l(
            ur,
            {
              value: a,
              disabled: w || X,
              placeholder: Ur,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (i) => u(i.target.value),
              onKeyDown: hs
            }
          ),
          /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ l("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: S ? `RequestID: ${S}${rn !== "0-0" ? ` / ${rn}` : ""}` : X ? "智能体正在执行，结果会自动同步。" : b || (C ? B ? "正在加载历史会话。" : R ? "会话已保存，刷新后可继续。" : "本次会话会保存到后台。" : "关闭弹窗后会清空本次测试上下文。") }),
            /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2", children: [
              dt ? /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || B,
                  onClick: ts,
                  children: [
                    /* @__PURE__ */ l(Ds, { className: "size-3.5" }),
                    Sn > 0 ? `记忆 ${Sn}` : "记忆"
                  ]
                }
              ) : null,
              re ? /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || B,
                  onClick: () => ut(!0),
                  children: [
                    /* @__PURE__ */ l(Ns, { className: "size-3.5" }),
                    "历史"
                  ]
                }
              ) : null,
              /* @__PURE__ */ l(
                yi,
                {
                  references: p,
                  disabled: w || X,
                  buttonLabel: "素材",
                  onReferencesChange: y,
                  onMessage: v
                }
              ),
              /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || B,
                  onClick: () => C ? void Xr() : at(),
                  children: [
                    /* @__PURE__ */ l(Yn, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              Br ? /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: w || B,
                  onClick: () => C ? void as() : at(),
                  children: [
                    /* @__PURE__ */ l(Ts, { className: "size-3.5" }),
                    C ? "新会话" : "新对话"
                  ]
                }
              ) : null,
              w ? /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !en || ye,
                  onClick: () => {
                    gs();
                  },
                  children: [
                    ye ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Rs, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  size: "sm",
                  disabled: !Yr,
                  onClick: () => {
                    _n();
                  },
                  children: [
                    w || X ? /* @__PURE__ */ l(ct, { className: "size-4 animate-spin" }) : /* @__PURE__ */ l(Is, { className: "size-4" }),
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
function Ci(t) {
  for (let e = t.length - 1; e >= 0; e -= 1) {
    const n = t[e];
    if (!(n.role !== "assistant" || n.running || n.error || n.interaction) && (Xt(n) || tn(kr(n))))
      return n.id;
  }
  return "";
}
function Pe(t) {
  t.scrollTop = t.scrollHeight;
}
function Mn(t) {
  Pe(t);
  const e = window.requestAnimationFrame(() => {
    Pe(t);
  }), n = window.setTimeout(() => {
    Pe(t);
  }, 120);
  return () => {
    window.cancelAnimationFrame(e), window.clearTimeout(n);
  };
}
async function En(t, e) {
  const n = await ci(t, "get", { request_id: e });
  if (!f(n))
    return {};
  const r = Number(n.status || 0), s = Number(n.code || 0);
  if (r === 2 || s === 401)
    throw new Error(o(n.msg || n.message) || "请求失败");
  return f(n.data) ? n.data : {};
}
function zn(t, e) {
  const n = f(t?.run) ? t.run : {}, r = o(n.status).toLowerCase();
  if (!pr(r))
    return null;
  const s = f(n.output) ? n.output : {}, a = o(n.error) || o(s.error) || o(s.text) || "智能体运行失败。", u = r === "success" ? 1 : 2, p = u === 2 && !o(s.text) ? {
    ...s,
    event: "status",
    text: a,
    error: a
  } : s;
  return {
    request_id: o(n.request_id) || e,
    type: "result",
    status: u,
    msg: u === 2 ? a : "",
    output: p
  };
}
function Pi(t, e, n) {
  const r = f(t?.run) ? t.run : {}, s = Array.isArray(r.stream) ? r.stream : [], a = [];
  for (const p of s) {
    const y = Oi(p, e);
    if (!y)
      continue;
    const b = o(y.stream_id);
    b && n?.has(b) || a.push(y);
  }
  const u = Mi(r, e);
  if (u) {
    const p = o(u.stream_id);
    (!p || !n?.has(p)) && a.push(u);
  }
  return a;
}
function Oi(t, e) {
  const n = f(t) ? t : {}, r = f(n.payload) ? n.payload : f(t) ? t : {}, s = f(r.output) ? r.output : {}, a = Ye(s), u = o(r.type || "stream").toLowerCase();
  return u !== "result" && !xr(a) ? null : {
    request_id: o(r.request_id) || e,
    stream_id: o(r.stream_id) || o(n.id),
    type: u || "stream",
    status: Number(r.status || 0) || 1,
    msg: o(r.msg),
    output: s
  };
}
function Mi(t, e) {
  if (pr(o(t.status).toLowerCase()))
    return null;
  const n = f(t.output) ? t.output : {}, r = We(n);
  if (!r || !r.result && r.tasks.length === 0)
    return null;
  const s = r.id || o(n.result_id) || e, a = Ei(r);
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
function Ei(t) {
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
function pr(t) {
  return ["success", "fail", "canceled"].includes(t);
}
function Be(t) {
  return /network|failed to fetch|读取运行流失败\((408|425|429|500|502|503|504)\)|timeout|超时/i.test(
    t
  );
}
function $n(t) {
  return t.role !== "assistant" || !t.requestID || !t.error || !Be(t.error) ? "" : t.requestID;
}
function zi(t) {
  return new Promise((e) => {
    window.setTimeout(e, t);
  });
}
function $i() {
  return null;
}
async function Fi(t, e) {
  return typeof On != "function" ? !1 : !!await On(t, e);
}
async function Li(t, e, n, r) {
  for (const s of Bi(
    e,
    n
  ))
    try {
      await Fi(t, s);
    } catch {
    }
  if (r !== !1)
    try {
      await sr(t);
    } catch {
    }
}
function Bi(t, e) {
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
        const u = a.trim();
        u && !n.includes(u) && n.push(u);
      }
  }
  const r = o(e).trim() || "table";
  return n.length === 0 && r && n.push(r), n;
}
function qi(t, e, n) {
  if (f(t)) {
    const s = ji(
      t,
      e
    );
    if (s)
      return s;
    const a = pe(t, e), u = Object.entries(a).filter(([, p]) => p != null && p !== "").sort(([p], [y]) => p.localeCompare(y));
    if (u.length > 0)
      return u.map(([p, y]) => `${p}:${o(y)}`).join("|");
  }
  const r = o(t).trim();
  return r ? r.replaceAll("{agent}", n) : n ? `agent:${n}` : "agent";
}
function ji(t, e) {
  const n = o(t.prefix).trim(), r = o(t.idPath || t.id_path).trim();
  if (!n || !r)
    return "";
  const s = P(
    { id: lt(e, r) },
    "id"
  );
  return s > 0 ? `${n}:${s}` : o(t.fallback).trim();
}
function Fn(t, e, n, r) {
  if (!t)
    return {};
  const s = {};
  return e > 0 && (s.assistant_session_id = e), n && (s.assistant_agent_key = n), r && (s.assistant_context_key = r), s;
}
function Vi(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = f(n.patch) ? n.patch : {}, u = lt(t, s), p = f(u) ? u : {}, y = f(r.draft) ? r.draft : {}, b = {
    ...p,
    ...mr(a),
    ...y
  }, v = P(r, "draft_id", "draftId", "id") || P(n, "id", "draft_id", "draftId") || P(p, "id");
  v > 0 && (b.id = v);
  const S = P(n, "pack_id", "packId") || P(a, "pack_id", "packId") || P(p, "pack_id", "packId");
  S > 0 && (b.pack_id = S);
  const L = P(n, "cate_id", "cateId") || P(a, "cate_id", "cateId") || P(p, "cate_id", "cateId");
  L > 0 && (b.cate_id = L), t.getState().setValueByPath(s, b);
}
function Hi(t, e, n, r, s) {
  const a = o(e).trim() || "data.table.list", u = lt(t, a);
  if (!Array.isArray(u))
    return;
  const p = Ui(
    t,
    n,
    r,
    s
  ), y = P(p, "id", "draft_id", "draftId");
  if (y <= 0)
    return;
  p.id = y;
  let b = !1;
  const v = u.map((S) => f(S) && P(S, "id") === y ? (b = !0, { ...S, ...p }) : S);
  b || (v.unshift(p), Ki(t, a)), t.getState().setValueByPath(a, v);
}
function Ui(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = lt(t, s), u = f(a) ? a : {}, p = f(r.draft) ? r.draft : {}, y = f(n.patch) ? n.patch : {};
  return {
    ...u,
    ...mr(y),
    ...p,
    id: P(r, "draft_id", "draftId", "id") || P(p, "id", "draft_id", "draftId") || P(n, "id", "draft_id", "draftId") || P(u, "id")
  };
}
function Ki(t, e) {
  const n = e.endsWith(".list") ? `${e.slice(0, -5)}.total` : "";
  if (!n)
    return;
  const r = Number(lt(t, n));
  Number.isFinite(r) && t.getState().setValueByPath(n, r + 1);
}
function mr(t) {
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
  ), Ln(
    e,
    t,
    "files_json",
    "files_json",
    "filesJson",
    "files"
  ), Ln(
    e,
    t,
    "manifest",
    "manifest",
    "runtime_config",
    "runtimeConfig"
  ), Bn(e, t, "pack_id", "pack_id", "packId"), Bn(e, t, "cate_id", "cate_id", "cateId"), e;
}
function de(t, e, n, ...r) {
  const s = Gi(e, ...r);
  s && (t[n] = s);
}
function Ln(t, e, n, ...r) {
  const s = Ji(e, ...r);
  s && (t[n] = s);
}
function Bn(t, e, n, ...r) {
  const s = P(e, ...r);
  s > 0 && (t[n] = s);
}
function Gi(t, ...e) {
  const n = Je(t, e);
  return o(n).trim();
}
function Ji(t, ...e) {
  const n = Je(t, e);
  if (n == null)
    return "";
  if (typeof n == "string")
    return n.trim();
  if (f(n) || Array.isArray(n))
    try {
      return JSON.stringify(n);
    } catch {
      return "";
    }
  return "";
}
function P(t, ...e) {
  const n = Je(t, e), r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function Je(t, e) {
  for (const n of e)
    if (Object.prototype.hasOwnProperty.call(t, n))
      return t[n];
}
function Yi(t) {
  const e = Array.isArray(t) ? t : [];
  return to(
    e.map((n, r) => Wi(n, r)).filter((n) => !!n)
  );
}
function Wi(t, e) {
  if (!f(t))
    return null;
  const n = o(t.role) === "user" ? "user" : "assistant", r = Number(t.status || 0) === fr, s = o(t.text) || (r ? "智能体正在处理..." : ""), a = f(t.content) ? t.content : {}, u = f(t.output) ? t.output : {}, p = o(a.kind || t.kind), y = r ? dr("等待智能体返回") : Zi(t, u), b = {
    id: `saved-${o(t.id) || e}`,
    role: n,
    text: s,
    kind: p || "chat",
    data: f(a.data) ? a.data : void 0,
    requestID: o(t.request_id),
    running: r,
    actionTiming: y
  };
  if (n === "assistant") {
    const S = Le(u) ? $({ text: s }) : $(u, s);
    b.output = {
      text: s,
      finalOutput: S
    }, Number(t.status) === 2 && (b.error = s);
  }
  const v = He(a.interaction) || Kt(u);
  return v && (b.interaction = v, b.interactionAnswered = !!a.interaction_answered, f(a.interaction_data) && (b.interactionData = a.interaction_data)), b;
}
function Zi(t, e) {
  const n = Xi(e), r = qn(
    t,
    e,
    n,
    "started_at_ms",
    "started_at"
  );
  if (r == null)
    return;
  const s = qn(
    t,
    e,
    n,
    "finished_at_ms",
    "finished_at"
  );
  return Ai({
    status: Number(t.status || 0) === 2 ? "failed" : "done",
    startedAt: r,
    finishedAt: s,
    label: "内容生成完成"
  });
}
function Xi(t) {
  const e = f(t.result) ? t.result : {}, n = f(t.content) ? t.content : {}, r = f(e.content) ? e.content : {};
  return {
    result: e,
    content: n,
    resultContent: r
  };
}
function qn(t, e, n, r, s) {
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
function Qi(t, e, n) {
  return t.map(
    (r) => r.id === e && r.interaction ? {
      ...r,
      interactionAnswered: !0,
      interactionData: n
    } : r
  );
}
function to(t) {
  let e = t;
  return t.forEach((n, r) => {
    if (n.role !== "user" || n.kind !== "interaction_result")
      return;
    const s = eo(
      e,
      r,
      n
    );
    if (s < 0)
      return;
    const a = e[s];
    if (!a)
      return;
    const u = f(n.data) ? n.data : void 0;
    e = e.map(
      (p, y) => y === s ? {
        ...a,
        interactionAnswered: !0,
        interactionData: u
      } : p
    );
  }), e;
}
function eo(t, e, n) {
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
function no(t) {
  return (Array.isArray(t) ? t : []).map(gr).filter((n) => !!n);
}
function gr(t) {
  if (!f(t))
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
function ro(t, e) {
  const n = f(t) ? t : {};
  return {
    page: fe(n.page, e.page),
    page_size: fe(n.page_size ?? n.pageSize, e.pageSize),
    total: fe(n.total, 0),
    total_pages: fe(n.total_pages ?? n.totalPages, 0)
  };
}
function so(t) {
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
  if (!f(t))
    return {};
  const n = {};
  for (const [r, s] of Object.entries(t)) {
    const a = String(r || "").trim(), u = String(s || "").trim();
    !a || !u || (n[a] = lt(e, u));
  }
  return n;
}
function io(t, e) {
  const n = Object.fromEntries(
    Object.entries(e).filter(
      ([, s]) => s != null && s !== ""
    )
  );
  if (!Object.keys(n).length)
    return t;
  const r = f(t.context) ? t.context : {};
  return {
    ...t,
    context: {
      ...r,
      ...n
    }
  };
}
function oo({
  message: t,
  now: e,
  running: n,
  memoryEnabled: r,
  onOpenInteraction: s,
  onOpenResult: a,
  onOpenDraftBox: u,
  onApplySkillDraftPatch: p,
  onSendSuggestion: y
}) {
  const b = Xt(t), v = !!t.interaction, S = !v && _o(b), L = kr(t), R = S || tn(L), J = Nr(t, R), B = t.interaction ? o(t.interaction.title) || "补充交互信息" : "", O = t.interaction ? o(t.interaction.description) : "", vt = No(t), ut = t.output?.finalOutput ? Ee(t.output.finalOutput) : null, ht = !!(t.actionTiming && !S);
  return /* @__PURE__ */ m("div", { className: "space-y-2", children: [
    ht ? /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ l(jn, { message: t, hasOutput: R }),
      /* @__PURE__ */ l(wi, { timing: t.actionTiming, now: e })
    ] }) : /* @__PURE__ */ l(jn, { message: t, hasOutput: R }),
    S && b ? /* @__PURE__ */ l(
      ei,
      {
        detail: b,
        running: !!t.running,
        timing: t.actionTiming,
        now: e,
        onOpen: a
      }
    ) : R ? /* @__PURE__ */ l(zs, { output: L }) : null,
    b && !v && !S ? /* @__PURE__ */ l(ao, { onOpen: a }) : null,
    /* @__PURE__ */ l(
      lo,
      {
        progress: vt,
        hasPendingPatch: !!ut,
        onApply: () => p(t.output?.finalOutput),
        onOpenDraftBox: u
      }
    ),
    t.error ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive", children: t.error }) : null,
    t.interaction ? /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ m("span", { className: "min-w-0", children: [
        /* @__PURE__ */ l("span", { className: "block truncate text-foreground", children: t.interactionAnswered ? "交互信息已提交。" : B }),
        O ? /* @__PURE__ */ l("span", { className: "block truncate", children: O }) : null
      ] }),
      /* @__PURE__ */ l(
        z,
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
    r ? /* @__PURE__ */ l(uo, { review: Do(t) }) : null,
    /* @__PURE__ */ l(
      hr,
      {
        suggestions: J,
        disabled: n,
        onSelect: y
      }
    ),
    t.requestID ? /* @__PURE__ */ l("div", { className: "truncate border-t pt-1 font-mono text-[11px] text-muted-foreground", children: t.requestID }) : null
  ] });
}
function ao({ onOpen: t }) {
  return /* @__PURE__ */ l("div", { className: "flex justify-end", children: /* @__PURE__ */ m(
    z,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 px-2 text-xs",
      onClick: t,
      children: [
        "查看详情",
        /* @__PURE__ */ l(Jn, { className: "size-3.5" })
      ]
    }
  ) });
}
function co({
  open: t,
  memories: e,
  loading: n,
  error: r,
  disabled: s,
  onOpenChange: a,
  onRefresh: u,
  onUpdate: p,
  onForget: y
}) {
  const [b, v] = N(0), [S, L] = N({ title: "", content: "" }), [R, J] = N(0), [B, O] = N("");
  gt(() => {
    t || (v(0), L({ title: "", content: "" }), J(0), O(""));
  }, [t]);
  const vt = (x) => {
    v(x.id), L({ title: x.title, content: x.content }), O("");
  }, ut = async () => {
    if (b <= 0)
      return;
    const x = S.title.trim(), Z = S.content.trim();
    if (!x || !Z) {
      O("标题和内容不能为空。");
      return;
    }
    J(b);
    try {
      await p(b, { title: x, content: Z }), v(0), L({ title: "", content: "" }), O("");
    } catch (F) {
      O(W(F, "保存长期记忆失败。"));
    } finally {
      J(0);
    }
  }, ht = async (x, Z) => {
    J(x);
    try {
      await p(x, { status: Z }), O("");
    } catch (F) {
      O(W(F, "更新长期记忆失败。"));
    } finally {
      J(0);
    }
  }, Ct = async (x) => {
    J(x);
    try {
      await y(x), b === x && v(0), O("");
    } catch (Z) {
      O(W(Z, "停用长期记忆失败。"));
    } finally {
      J(0);
    }
  }, Pt = () => {
    v(0), L({ title: "", content: "" }), O("");
  }, Ot = e.filter(je).length, At = e.length - Ot;
  return /* @__PURE__ */ l(ir, { open: t, onOpenChange: a, children: /* @__PURE__ */ m(
    or,
    {
      "data-assistant-layer": "true",
      layerClassName: Ue,
      layerZIndex: Ke,
      className: "max-h-[86vh] max-w-3xl",
      children: [
        /* @__PURE__ */ m(cr, { children: [
          /* @__PURE__ */ l(lr, { children: "长期记忆" }),
          /* @__PURE__ */ l(ar, { children: "当前智能体和上下文会带入已启用记忆；停用后不会再参与后续运行。" })
        ] }),
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ m("div", { className: "min-w-0 text-muted-foreground", children: [
            "已启用 ",
            Ot,
            " 条",
            At > 0 ? `，已停用 ${At} 条` : ""
          ] }),
          /* @__PURE__ */ m(
            z,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: s || n,
              onClick: () => {
                u();
              },
              children: [
                n ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(In, { className: "size-3.5" }),
                "刷新"
              ]
            }
          )
        ] }),
        r || B ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: B || r }) : null,
        /* @__PURE__ */ l("div", { className: "max-h-[56vh] space-y-2 overflow-y-auto pr-1", children: n && e.length === 0 ? /* @__PURE__ */ m("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: [
          /* @__PURE__ */ l(ct, { className: "mr-2 size-4 animate-spin" }),
          "正在加载长期记忆"
        ] }) : e.length === 0 ? /* @__PURE__ */ l("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: "当前上下文还没有长期记忆。" }) : e.map((x) => {
          const Z = b === x.id, F = R === x.id, St = je(x);
          return /* @__PURE__ */ l(
            "div",
            {
              className: Jt(
                "rounded-md border bg-background p-3 text-sm",
                !St && "bg-muted/20 text-muted-foreground"
              ),
              children: /* @__PURE__ */ m("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ m("div", { className: "min-w-0 flex-1 space-y-2", children: [
                  /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ l("span", { className: "rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground", children: Co(x.kind) }),
                    /* @__PURE__ */ l(
                      "span",
                      {
                        className: Jt(
                          "rounded-full px-2 py-0.5 text-[11px]",
                          St ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                        ),
                        children: St ? "启用" : "停用"
                      }
                    ),
                    /* @__PURE__ */ m("span", { className: "text-[11px] text-muted-foreground", children: [
                      Oo(x.source),
                      " / 重要度",
                      " ",
                      x.importance
                    ] })
                  ] }),
                  Z ? /* @__PURE__ */ m("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ l(
                      gi,
                      {
                        value: S.title,
                        disabled: F,
                        placeholder: "记忆标题",
                        onChange: (it) => L((w) => ({
                          ...w,
                          title: it.target.value
                        }))
                      }
                    ),
                    /* @__PURE__ */ l(
                      ur,
                      {
                        value: S.content,
                        disabled: F,
                        placeholder: "记忆内容",
                        className: "min-h-24 resize-y",
                        onChange: (it) => L((w) => ({
                          ...w,
                          content: it.target.value
                        }))
                      }
                    )
                  ] }) : /* @__PURE__ */ m("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ l("div", { className: "break-words font-medium text-foreground", children: x.title || "未命名记忆" }),
                    /* @__PURE__ */ l("div", { className: "whitespace-pre-wrap break-words leading-6", children: x.content || "无内容" })
                  ] }),
                  /* @__PURE__ */ m("div", { className: "flex flex-wrap gap-2 text-[11px] text-muted-foreground", children: [
                    x.scope ? /* @__PURE__ */ m("span", { children: [
                      "作用域：",
                      Po(x.scope)
                    ] }) : null,
                    x.created_at ? /* @__PURE__ */ m("span", { children: [
                      "创建：",
                      x.created_at
                    ] }) : null,
                    x.tags.length > 0 ? /* @__PURE__ */ m("span", { children: [
                      "标签：",
                      x.tags.join("、")
                    ] }) : null
                  ] })
                ] }),
                /* @__PURE__ */ l("div", { className: "flex shrink-0 flex-wrap items-center gap-1 sm:justify-end", children: Z ? /* @__PURE__ */ m(Me, { children: [
                  /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || F,
                      onClick: () => {
                        ut();
                      },
                      children: [
                        F ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Cs, { className: "size-3.5" }),
                        "保存"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: F,
                      onClick: Pt,
                      children: /* @__PURE__ */ l(Ps, { className: "size-3.5" })
                    }
                  )
                ] }) : /* @__PURE__ */ m(Me, { children: [
                  /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || F,
                      onClick: () => vt(x),
                      children: [
                        /* @__PURE__ */ l(Os, { className: "size-3.5" }),
                        "编辑"
                      ]
                    }
                  ),
                  St ? /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || F,
                      onClick: () => {
                        Ct(x.id);
                      },
                      children: [
                        F ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Yn, { className: "size-3.5" }),
                        "停用"
                      ]
                    }
                  ) : /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || F,
                      onClick: () => {
                        ht(x.id, 1);
                      },
                      children: [
                        F ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(In, { className: "size-3.5" }),
                        "启用"
                      ]
                    }
                  )
                ] }) })
              ] })
            },
            x.id
          );
        }) })
      ]
    }
  ) });
}
function lo({
  progress: t,
  hasPendingPatch: e,
  onApply: n,
  onOpenDraftBox: r
}) {
  if (!t && !e)
    return null;
  if (!t && e)
    return /* @__PURE__ */ l("div", { className: "rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900", children: /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ l("div", { className: "min-w-0 flex-1 leading-5", children: "已生成技能内容，确认后保存为未发布版本。" }),
      /* @__PURE__ */ l("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ l(
        z,
        {
          type: "button",
          size: "sm",
          className: "h-7 px-2 text-xs",
          onClick: n,
          children: "保存"
        }
      ) })
    ] }) });
  const s = t.status === "saving", a = t.status === "failed", u = t.message || (a ? "技能保存失败。" : s ? "正在保存技能..." : "技能已保存。");
  return /* @__PURE__ */ l(
    "div",
    {
      className: Jt(
        "rounded-md border px-2.5 py-2 text-xs",
        a ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-emerald-200 bg-emerald-50 text-emerald-900"
      ),
      children: /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
        /* @__PURE__ */ l("div", { className: "min-w-0 flex-1 leading-5", children: s ? /* @__PURE__ */ m("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }),
          u
        ] }) : a ? u : /* @__PURE__ */ m(Me, { children: [
          u,
          t.draft_id ? ` ID: ${t.draft_id}` : "",
          /* @__PURE__ */ l("span", { className: "ml-1 text-emerald-700", children: "下一步在技能草稿页校验、测试和发布。" })
        ] }) }),
        a && e ? /* @__PURE__ */ l("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ l(
          z,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "h-7 px-2 text-xs",
            onClick: n,
            children: "重新保存"
          }
        ) }) : !s && !a ? /* @__PURE__ */ l("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ l(
          z,
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
function jn({
  message: t,
  hasOutput: e
}) {
  const n = zo(t, e);
  return n ? /* @__PURE__ */ l("div", { className: "inline-flex rounded-full border bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: n }) : null;
}
function hr({
  suggestions: t,
  disabled: e,
  onSelect: n
}) {
  return t.length === 0 ? null : /* @__PURE__ */ l("div", { className: "flex flex-wrap items-center gap-2 border-t pt-2", children: t.map((r, s) => /* @__PURE__ */ m(
    z,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 rounded-full px-2.5 text-xs",
      disabled: e,
      title: r.prompt,
      onClick: () => n(r),
      children: [
        /* @__PURE__ */ l(vs, { className: "size-3.5" }),
        r.label
      ]
    },
    `${r.label}-${s}`
  )) });
}
function uo({
  review: t
}) {
  return !t || t.status === "pending" ? null : /* @__PURE__ */ m("div", { className: "rounded-md border bg-background/80 px-2 py-2 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ l("div", { className: "font-medium text-foreground", children: t.text || fo(t.status) }),
    t.content || t.title ? /* @__PURE__ */ m("div", { className: "mt-1 leading-5", children: [
      t.title ? /* @__PURE__ */ l("div", { className: "text-foreground", children: t.title }) : null,
      t.content ? /* @__PURE__ */ l("div", { children: t.content }) : null
    ] }) : null,
    t.error ? /* @__PURE__ */ l("div", { className: "mt-1 text-destructive", children: t.error }) : null
  ] });
}
function fo(t) {
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
function po(t) {
  return t.map((e) => {
    const n = mo(e), r = {
      role: e.role,
      text: n
    };
    if (e.kind && (r.type = e.kind), e.data && (r.data = e.data), e.output?.finalOutput) {
      const s = go(e);
      xe(s) || (r.output = s);
    }
    return e.interaction && (r.interaction = e.interaction, r.interaction_answered = !!e.interactionAnswered, e.interactionData && (r.interaction_data = e.interactionData)), r;
  }).filter(
    (e) => o(e.text).trim().length > 0 || !!e.interaction || !!e.data || !!e.output
  );
}
function mo(t) {
  return Qe(t.text) ? "" : t.text;
}
function go(t) {
  const e = Xt(t);
  return e?.result ? $(e.result, t.text) : $(
    t.output?.finalOutput || {},
    t.text
  );
}
function xr(t) {
  return t === "result_detail" || t === "result_task" || t === "result_progress" || t === "result_created" || t === "task_progress" || t === "task_done";
}
function ho(t, e, n) {
  const r = Ye(e);
  let s = t.resultDetail;
  return r === "result_detail" || r === "result_created" ? s = Ze(
    s,
    xo(e)
  ) : r === "result_task" || r === "task_progress" || r === "task_done" ? s = yr(
    s,
    Sr(e),
    o(e.result_id)
  ) : r === "result_progress" && (s = Ao(
    s,
    o(e.result_id),
    o(e.text),
    Qt(e.progress)
  )), {
    ...t,
    text: t.text || "内容已生成，点击查看结果。",
    resultDetail: s,
    requestID: o(n?.request_id) || t.requestID
  };
}
function Ye(t) {
  return o(t.semantic_event || t.event).toLowerCase();
}
function Xt(t) {
  const e = Ze(
    t.resultDetail,
    We(t.output?.finalOutput)
  );
  return e && (e.result || e.tasks.length) ? e : null;
}
function xo(t) {
  if (!t)
    return;
  const e = f(t.result) ? $(t.result) : void 0, n = Ar(t.tasks);
  return {
    id: o(t.result_id) || o(e?.result_id),
    title: o(t.title || e?.title) || "最终结果",
    mode: ge(
      t.result_mode || t.display_mode || e?.result_mode
    ),
    result: e,
    tasks: n,
    progress: Qt(t.progress),
    progressText: o(t.progress_text)
  };
}
function We(t) {
  if (!t)
    return;
  const e = o(t.event).toLowerCase(), n = ge(
    t.result_mode || t.display_mode
  );
  if (e !== "result_card" && n === "inline" || e !== "result_card" && !f(t.result) && !o(t.result_mode || t.display_mode))
    return;
  const r = f(t.result) ? $(t.result) : $(t);
  return {
    id: o(t.result_id || r.result_id),
    title: o(t.title || r.title) || "最终结果",
    mode: e === "result_card" ? "artifact" : ge(
      t.result_mode || t.display_mode || r.result_mode
    ),
    result: r,
    tasks: Ar(t.tasks || r.tasks),
    progress: Qt(t.progress),
    progressText: o(t.progress_text)
  };
}
function yo(t, e, n) {
  const r = bo(e, n);
  if (!r)
    return t;
  const s = qe(e, n), a = t || {
    ...Xe(s),
    title: "能力生成结果"
  }, u = yr(a, r, s);
  return {
    ...u,
    title: a.title || "能力生成结果",
    progress: r.progress ?? u.progress,
    progressText: r.text || u.progressText
  };
}
function bo(t, e) {
  const n = f(t.meta) ? t.meta : {};
  if (o(n.action).toLowerCase() !== "call_power")
    return null;
  const s = o(n.power || t.meta?.power).trim(), a = o(t.event).toLowerCase(), u = o(t.error).trim(), p = wo(t), y = u ? "failed" : p || a === "final" ? "succeeded" : "running";
  return {
    id: qe(t, e),
    placeholderID: qe(t, e),
    title: s ? `生成 ${s}` : "能力生成",
    kind: o(s || t.kind).trim(),
    power: s,
    execution: "async",
    status: y,
    text: _r(t.text || t.progress_text),
    error: u,
    progress: Qt(
      t.progress ?? n.progress ?? n.percent
    ),
    output: p,
    sort: 0
  };
}
function wo(t) {
  const e = o(t.event).toLowerCase();
  if (!$r(t) && e !== "final")
    return;
  const n = $({
    ...t,
    event: "final"
  });
  return xe(n) ? void 0 : n;
}
function qe(t, e) {
  const n = f(t.meta) ? t.meta : {}, r = o(
    n.power || t.power
  ).trim();
  return [o(e?.request_id).trim(), r || "power"].filter(Boolean).join(":") || "power-action";
}
function Ze(t, e) {
  return e ? t ? {
    id: e.id || t.id,
    title: e.title || t.title,
    mode: e.mode || t.mode,
    result: e.result || t.result,
    tasks: br(t.tasks, e.tasks),
    progress: e.progress ?? t.progress,
    progressText: e.progressText || t.progressText
  } : {
    ...e,
    mode: e.mode || "artifact",
    tasks: wr(e.tasks)
  } : t;
}
function yr(t, e, n) {
  const r = t || Xe(n);
  return e ? {
    ...r,
    tasks: br(r.tasks, [e])
  } : r;
}
function Ao(t, e, n, r) {
  const s = t || Xe(e), a = s.progress == null ? r : r == null ? s.progress : Math.max(s.progress, r);
  return {
    ...s,
    progress: a,
    progressText: n || s.progressText
  };
}
function Xe(t) {
  return {
    id: t,
    title: "最终结果",
    mode: "artifact",
    tasks: [],
    progress: null,
    progressText: ""
  };
}
function br(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r) => n.set(r.id, r)), e.forEach((r) => {
    const s = n.get(r.id);
    n.set(r.id, s ? So(s, r) : r);
  }), wr([...n.values()]);
}
function So(t, e) {
  const n = t.progress, r = e.progress, s = n == null ? r : r == null ? n : Math.max(n, r), a = Vn(t.status), u = Vn(e.status), p = a > u;
  return {
    ...t,
    ...e,
    status: p ? t.status : e.status,
    text: p ? t.text : e.text,
    error: p ? t.error : e.error,
    output: p ? t.output : e.output,
    progress: s
  };
}
function Vn(t) {
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
function wr(t) {
  return [...t].sort((e, n) => e.sort - n.sort);
}
function Ar(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(Sr).filter((n) => n != null).sort((n, r) => n.sort - r.sort);
}
function Sr(t) {
  if (!f(t))
    return null;
  const e = o(t.id || t.task_id || t.taskId).trim(), n = o(
    t.placeholder_id || t.placeholderId || e
  ).trim(), r = e || n;
  if (!r)
    return null;
  const s = f(t.meta) ? t.meta : {}, a = f(t.output) ? t.output : f(s.output) ? s.output : void 0, u = a ? $(a) : void 0;
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
    text: _r(t.text || t.message),
    error: o(t.error).trim(),
    progress: Qt(
      t.progress ?? s.progress ?? s.percent
    ),
    output: u,
    sort: Number(t.sort || 0)
  };
}
function Qt(t) {
  const e = Number(t);
  return Number.isFinite(e) ? Math.max(0, Math.min(100, Math.round(e))) : null;
}
function _r(t) {
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
function kr(t) {
  const e = Xt(t);
  if (e)
    return ko(e) && e.result ? Qn(e.result, e.tasks) : void 0;
  if (t.running || t.interaction)
    return;
  if (!t.output)
    return t.text ? Hn(t.text) : void 0;
  if (t.output.finalOutput) {
    const r = $(
      t.output.finalOutput,
      t.text
    );
    return o(r.event).toLowerCase() === "interaction" || xe(r) ? void 0 : r;
  }
  const n = [];
  return t.output.text && !Qe(t.output.text) && n.push(Hn(t.output.text)), n;
}
function Hn(t) {
  const e = $s(t);
  return $({
    text: e,
    content: {
      format: "markdown",
      text: e
    }
  });
}
function _o(t) {
  return !!(t && Dr(t) === "artifact");
}
function ko(t) {
  return !!(t && Dr(t) === "inline");
}
function Dr(t) {
  return ge(t.mode);
}
function ge(t) {
  return o(t).trim().toLowerCase() === "inline" ? "inline" : "artifact";
}
function Nr(t, e) {
  if (t.running || t.error || t.interaction || !e)
    return [];
  const n = t.output?.finalOutput ? $(t.output.finalOutput, t.text) : $({ text: t.text }), r = Qo(
    n.suggestions || n.meta?.suggestions
  );
  return r.length > 0 ? r : [];
}
function Do(t) {
  const e = t.output?.finalOutput || {};
  return Rr(e.memory_review);
}
function No(t) {
  const e = t.data?.skillDraftPatch;
  if (!f(e))
    return null;
  const n = o(e.status).trim();
  return n !== "saving" && n !== "saved" && n !== "failed" ? null : {
    status: n,
    draft_id: P(e, "draft_id", "draftId", "id") || void 0,
    message: o(e.message)
  };
}
function Un(t) {
  return (Array.isArray(t) ? t : []).map(Tr).filter((n) => n != null);
}
function Tr(t) {
  if (!f(t))
    return null;
  const e = Number(t.id || t.memory_id || t.memoryId || 0);
  return !Number.isFinite(e) || e <= 0 ? null : {
    id: e,
    kind: o(t.kind || t.type),
    title: o(t.title || t.name),
    content: o(t.content || t.text),
    tags: To(t.tags),
    importance: Ro(t.importance),
    scope: o(t.scope),
    source: o(t.source),
    status: Io(t.status),
    created_at: o(t.created_at || t.createdAt)
  };
}
function To(t) {
  return Array.isArray(t) ? t.map(o).map((e) => e.trim()).filter(Boolean) : o(t).split(",").map((e) => e.trim()).filter(Boolean);
}
function Ro(t) {
  const e = Number(t || 0);
  return !Number.isFinite(e) || e <= 0 ? 60 : Math.round(Math.max(1, Math.min(100, e)));
}
function Io(t) {
  return Number(t || 0) === 2 ? 2 : 1;
}
function je(t) {
  return t.status !== 2;
}
function vo(t, e) {
  let n = !1;
  const r = t.map((s) => s.id !== e.id ? s : (n = !0, e));
  return n ? r : [e, ...r];
}
function Co(t) {
  return {
    working: "工作记忆",
    episodic: "事件记忆",
    semantic: "语义记忆",
    procedural: "流程记忆",
    persona: "人格记忆",
    content: "内容记忆"
  }[t] || "长期记忆";
}
function Po(t) {
  return {
    global: "全局",
    agent: "智能体",
    context: "当前上下文",
    session: "当前会话"
  }[t] || t;
}
function Oo(t) {
  return {
    manual: "手动",
    auto: "自动",
    llm: "模型抽取"
  }[t] || "自动";
}
function Rr(t) {
  if (!f(t))
    return null;
  const e = o(t.status);
  if (!e)
    return null;
  const n = f(t.memory) ? t.memory : {};
  return {
    status: e,
    type: o(t.type),
    text: o(t.text),
    source_message_id: Number(t.source_message_id || 0) || void 0,
    title: o(t.title || n.title),
    content: o(t.content || n.content),
    reason: o(t.reason),
    existing: f(t.existing) ? t.existing : void 0,
    error: o(t.error)
  };
}
function Mo(t, e) {
  const n = t.trim().toLowerCase(), r = Eo(e);
  return r.length === 0 ? !0 : r.includes(n);
}
function Eo(t) {
  return (Array.isArray(t) ? t : [t]).map((n) => o(n).trim().toLowerCase()).filter(Boolean);
}
function zo(t, e) {
  if (t.interaction && !t.interactionAnswered)
    return "需要用户参与";
  const n = t.output?.finalOutput, r = o(n?.kind || n?.type).toLowerCase(), s = o(n?.meta?.action).toLowerCase();
  return r === "tool_result" || s === "call_power" ? "工具结果" : e ? "最终结果" : "";
}
function $(t, e = "") {
  const n = { ...t };
  delete n.reasoning;
  const r = Bo(
    o(n.text) || e
  );
  if (r)
    return $o(
      n,
      r.payload,
      r.cleanText
    );
  const s = Lo(
    o(n.text) || e
  );
  if (s) {
    Ir(n);
    const u = Kn(s.payload.content);
    u && Oe(n, u), Oe(n, s.payload);
    const p = Gt(s.payload) || s.cleanText;
    return p ? n.text = p : delete n.text, n.kind = zr(
      o(
        s.payload.kind || s.payload.type || s.payload.event
      )
    ), n.suggestions = s.payload.suggestions, n.content = u || s.payload.content, n.tasks = s.payload.tasks || u?.tasks, n;
  }
  const a = Kn(n.content);
  if (a && (n.content = a), f(n.content) && Oe(n, n.content), !o(n.text)) {
    const u = Gt(n);
    u && (n.text = u);
  }
  if (Zo(n.text)) {
    const u = Xo(n.text);
    u ? n.text = u : delete n.text;
  }
  return n;
}
function $o(t, e, n) {
  Ir(t);
  const r = Er(e), s = o(e.power || e.name).trim(), a = o(e.tool || e.name).trim(), u = r === "call_power" ? `能力调用：${s || "未指定能力"}` : `工具调用：${a || "未指定工具"}`, p = n || "智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。";
  return t.event = "result_card", t.kind = "tool_result", t.title = u, t.text = p, t.result_mode = "artifact", t.result = {
    title: u,
    text: p
  }, t.meta = {
    ...f(t.meta) ? t.meta : {},
    action: r,
    power: s,
    tool: a,
    input: e.input || e.params || e.arguments
  }, r === "call_power" && (t.tasks = [
    {
      id: Fo(e),
      title: u,
      kind: o(e.kind || s).trim(),
      power: s,
      status: "pending",
      text: "等待能力执行结果",
      input: e.input || e.params || e.arguments
    }
  ]), t;
}
function Fo(t) {
  const e = o(
    t.id || t.task_id || t.power || t.name
  ).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return e ? `action-${e}` : "action-call-power";
}
function Ir(t) {
  const e = t;
  Ge.forEach((n) => {
    delete e[n];
  }), delete e.content;
}
function xe(t) {
  const e = o(t.event).toLowerCase();
  return ["start", "progress", "status", "reasoning", "warning"].includes(e) ? !0 : Qe(o(t.text)) ? !$r(t) : !1;
}
function Qe(t) {
  const e = o(t).trim();
  return e ? !!(e.includes("```agent-interaction") || e.includes("```agent-action") || e.includes("```agent-result") || e.includes("```agent-output")) : !1;
}
function Lo(t) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Vo(t, n);
    if (r)
      return r;
  }
  const e = Cr(t);
  if (e)
    return {
      cleanText: "",
      payload: e
    };
}
function Bo(t) {
  const e = qo(t, "agent-action");
  if (e)
    return e;
  const n = vr(t);
  return n ? { cleanText: "", payload: n } : void 0;
}
function qo(t, e) {
  const n = `\`\`\`${e}`, r = t.indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < t.length && Or(t[s]); )
    s += 1;
  const a = t.indexOf("```", s), u = a < 0 ? t.slice(s) : t.slice(s, a), p = vr(u);
  return p ? {
    cleanText: a < 0 ? t.slice(0, r).trim() : `${t.slice(0, r)}${t.slice(a + 3)}`.trim(),
    payload: p
  } : void 0;
}
function vr(t) {
  const e = t.trim(), n = Pr(e), r = jo(n), s = [e, n, r];
  for (const a of s)
    if (a.trim())
      try {
        const u = JSON.parse(a);
        if (Mr(u))
          return u;
      } catch {
      }
}
function jo(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : t.replace(/\\"/g, '"');
}
function Vo(t, e) {
  const n = `\`\`\`${e}`, r = t.indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < t.length && Or(t[s]); )
    s += 1;
  let a = s;
  for (; a < t.length; ) {
    const u = t.indexOf("```", a);
    if (u < 0)
      return;
    const p = Cr(t.slice(s, u));
    if (p)
      return {
        cleanText: `${t.slice(0, r)}${t.slice(u + 3)}`.trim(),
        payload: p
      };
    a = u + 3;
  }
}
function Cr(t) {
  const e = t.trim(), n = Pr(e), r = n === e ? [e] : [e, n];
  for (const s of r) {
    const a = Ho(s);
    if (a)
      return a;
  }
}
function Ho(t) {
  try {
    const e = JSON.parse(t);
    return Go(e) ? e : void 0;
  } catch {
    return;
  }
}
function Pr(t) {
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
    if (n && Uo(s)) {
      e += Ko(s);
      continue;
    }
    e += s;
  }
  return e;
}
function Uo(t) {
  return t.length > 0 && t.charCodeAt(0) < 32;
}
function Ko(t) {
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
function Or(t) {
  return t === " " || t === "	" || t === "\r" || t === `
`;
}
function Go(t) {
  if (!f(t) || Mr(t))
    return !1;
  const e = zr(
    o(t.kind || t.type || t.event)
  );
  return e === "final_result" || e === "tool_result" || "content" in t || "tasks" in t || "suggestions" in t || he(t) || f(t.content) && he(t.content);
}
function Mr(t) {
  if (!f(t))
    return !1;
  const e = Er(t);
  return e ? e === "call_power" ? !!o(t.power || t.name).trim() : !!o(t.tool || t.name).trim() : !1;
}
function Er(t) {
  const e = o(t.type || t.action).toLowerCase().trim();
  return e === "power" ? "call_power" : e === "tool" ? "call_tool" : e === "call_power" || e === "call_tool" ? e : "";
}
function zr(t) {
  const e = t.toLowerCase().trim();
  return ["tool", "tool_result", "call_power", "power_result"].includes(e) ? "tool_result" : ["final", "result", "final_result", "answer"].includes(e) ? "final_result" : e || "final_result";
}
function Gt(t) {
  if (!f(t))
    return typeof t == "string" ? o(t) : "";
  if (o(t.text))
    return o(t.text);
  const e = t.content;
  return f(e) ? o(e.text) : typeof e == "string" ? o(e) : "";
}
function Kn(t) {
  if (f(t))
    return t;
  if (typeof t == "string" && t.trim())
    return {
      format: "markdown",
      text: t.trim()
    };
  const e = Jo(t);
  return e ? {
    format: "markdown",
    text: e
  } : null;
}
function Jo(t) {
  const e = Yo(t);
  return e.length === 0 ? "" : Wo(e);
}
function Yo(t) {
  return Array.isArray(t) ? t.flatMap((e) => {
    if (typeof e == "string" && e.trim())
      return [Gn(e.trim())];
    if (!f(e))
      return [];
    if (o(e.type) === "text") {
      const r = o(e.text).trim();
      return r ? [Gn(r)] : [];
    }
    return [e];
  }) : [];
}
function Gn(t) {
  return {
    type: "paragraph",
    content: [{ type: "text", text: t }]
  };
}
function Wo(t) {
  const e = [];
  return t.forEach((n) => Ve(n, e)), e.join(`

`).trim();
}
function Ve(t, e) {
  if (Array.isArray(t)) {
    t.forEach((n) => Ve(n, e));
    return;
  }
  if (f(t)) {
    if (o(t.type) === "text") {
      const n = o(t.text).trim();
      n && e.push(n);
      return;
    }
    Ve(t.content, e);
  }
}
function Zo(t) {
  const e = o(t).trim();
  return /^\[?map\[/.test(e) && e.includes("type:text");
}
function Xo(t) {
  return [
    ...o(t).trim().matchAll(/map\[[^\]]*?text:([^\]]*?)(?:\s+type:text|\])/g)
  ].map((r) => r[1]?.trim() || "").filter(Boolean).join(`

`);
}
function Oe(t, e) {
  const n = t;
  Ge.forEach((r) => {
    const s = e[r];
    Yt(s) && (n[r] = s);
  }), !Yt(t.rich) && f(e.value) && (t.rich = e.value);
}
function he(t) {
  return Ge.some((e) => Yt(t[e])) || f(t.value);
}
function $r(t) {
  const e = f(t.content) ? t.content : null;
  return he(t) || Yt(t.error) || e != null && (he(e) || Yt(e.text));
}
function Yt(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim().length > 0 : Array.isArray(t) ? t.length > 0 : f(t) ? Object.keys(t).length > 0 : !0;
}
function Qo(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(ta).filter((n) => n != null).slice(0, 5);
}
function ta(t) {
  if (!f(t)) {
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
function ea({
  open: t,
  interaction: e,
  paramApi: n,
  readonly: r,
  initialData: s,
  disabled: a,
  onOpenChange: u,
  onSubmit: p
}) {
  if (!e)
    return null;
  const y = o(e.title) || "补充交互信息", b = o(e.description) || (r ? "已提交的交互信息，只读查看。" : "填写这些参数后，智能体会继续执行当前任务。");
  return /* @__PURE__ */ l(ir, { open: t, onOpenChange: u, children: /* @__PURE__ */ m(
    or,
    {
      "data-assistant-layer": "true",
      layerClassName: Ue,
      layerZIndex: Ke,
      className: "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
      children: [
        /* @__PURE__ */ m(cr, { className: "border-b px-5 py-4 text-start", children: [
          /* @__PURE__ */ l(lr, { children: y }),
          /* @__PURE__ */ l(ar, { children: b })
        ] }),
        /* @__PURE__ */ l("div", { className: "min-h-0 overflow-hidden", children: /* @__PURE__ */ l(
          hi,
          {
            interaction: e,
            paramApi: n,
            readonly: r,
            initialData: s,
            disabled: a,
            layout: "dialog",
            hideHeader: !0,
            onSubmit: r ? void 0 : p
          }
        ) })
      ]
    }
  ) });
}
function tn(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.some(tn) : f(t) ? Object.keys(t).length > 0 : !0;
}
function He(t) {
  if (!(!f(t) || !o(t.type)))
    return t;
}
function Kt(t) {
  if (f(t))
    return He(t.interaction) || (f(t.content) ? He(t.content.interaction) : void 0);
}
export {
  Sa as ShowAgent
};
