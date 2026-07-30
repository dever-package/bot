import { c as Ss, j as l, a as m, F as Ee } from "./createLucideIcon-Gw0gLVQ5.js";
import { g as ye, m as ws, u as D, a as ht, e as W, c as rt, h as ks, b as xt, r as Ds } from "./runtime-entry-CkPHMDB1.js";
import { L as lt } from "./loader-circle-3ZsHTZm7.js";
import { B as Ns } from "./brain-kmD23rg1.js";
import { E as Kn } from "./external-link-YRs6ZQq6.js";
import { H as Ts } from "./history-Bm7AbadN.js";
import { P as Rs } from "./pencil-WDd5tOSC.js";
import { R as Rn } from "./refresh-cw-Dj0geApF.js";
import { R as Is } from "./rotate-ccw-CYQko_-D.js";
import { S as vs } from "./save-C3QU3I8o.js";
import { S as Ps } from "./send-MRBuD5_A.js";
import { S as Cs } from "./square-CuZYXq82.js";
import { T as Gn } from "./trash-2-Cga0ORNu.js";
import { X as Ms } from "./x-CDJG94MJ.js";
import { a as vt, m as Jn, u as de } from "./stream-DlOGAsXV.js";
import { a as K, r as ze, A as Os, m as Yn, c as Es, b as zs } from "./skill-draft-patch-DKvqZi29.js";
import { m as Wn } from "./reference-DfEQ4AD9.js";
import { m as $s } from "./store-BeRODhS3.js";
import { m as Ls } from "./runtime-stream-runner-5OE2JsJo.js";
import { m as Bs } from "./utils-DDwUJ6_F.js";
import { m as Fs } from "./button-DF4roUfC.js";
import { m as Wt } from "./dialog-C65rQcQf.js";
import { m as qs } from "./input-CELCGXqo.js";
import { m as js } from "./textarea-SZl8yDfD.js";
import { m as Vs } from "./interaction-panel-Cle1Og4M.js";
import { m as st } from "./stream-timing-BGlT8cN-.js";
import { m as Hs } from "./content-view-BWYCBIVh.js";
import { m as Zt } from "./sheet-D2kGbZbn.js";
const Us = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M12 8v6", key: "1ib9pf" }],
  ["path", { d: "M9 11h6", key: "1fldmi" }]
], Ks = Ss("message-square-plus", Us), ge = ye("@/components/assistant/reference-picker");
if (!ge || Object.keys(ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/reference-picker");
const $e = ye("@/components/energon/progress");
if (!$e || Object.keys($e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/progress");
const St = Jn.streamValueText, et = vt.isPlainRecord, Gs = st.StreamTimingBadge, Js = Hs.EnergonContentView, Ys = $e.EnergonProgressBlock, Ws = Zt.Sheet, Zs = Zt.SheetContent, Xs = Zt.SheetDescription, Qs = Zt.SheetHeader, ti = Zt.SheetTitle;
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
            e ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : null,
            "查看结果",
            /* @__PURE__ */ l(Kn, { className: "size-3.5" })
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
  const a = e?.title || "最终结果", u = e?.result ? Zn(e.result, e.tasks) : void 0, p = ri(e?.progressText);
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
  const e = St(t).trim();
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
function Zn(t, e) {
  if (e.length === 0)
    return t;
  const n = /* @__PURE__ */ new Map();
  e.forEach((a) => {
    a.placeholderID && n.set(a.placeholderID, a), n.set(a.id, a);
  });
  const r = { ...t }, s = In(r.rich, n);
  if (s && (r.rich = s), et(r.content)) {
    const a = { ...r.content }, u = In(a.rich, n);
    u && (a.rich = u, r.content = a);
  }
  return r;
}
function In(t, e) {
  if (!et(t))
    return t;
  const n = Xn(t, e);
  return n.length === 1 ? n[0] : t;
}
function Xn(t, e) {
  const n = St(t.type), r = { ...t };
  if (n === "agentAbilityPlaceholder" || n === "agentTaskPlaceholder") {
    const s = et(t.attrs) ? { ...t.attrs } : {}, a = St(
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
      et(a) ? s.push(...Xn(a, e)) : s.push(a);
    }), r.content = s;
  }
  return [r];
}
function si(t) {
  if (t.status !== "succeeded" || !t.output)
    return [];
  const e = t.kind.toLowerCase();
  if (e === "image" || e === "images" || e === "cover") {
    const a = Tt(
      "editorMediaImage",
      Rt(t.output, "images", "image"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "video" || e === "videos") {
    const a = Tt(
      "editorMediaVideo",
      Rt(t.output, "videos", "video"),
      t.title
    );
    if (a.length > 0)
      return a;
  }
  if (e === "audio" || e === "audios" || e === "song" || e === "music") {
    const a = Tt(
      "editorMediaAudio",
      Rt(t.output, "audios", "audio"),
      t.title
    );
    if (a.length > 0)
      return [...a, ...ii(t.output)];
  }
  const n = [
    ...Tt(
      "editorMediaImage",
      Rt(t.output, "images", "image"),
      t.title
    ),
    ...Tt(
      "editorMediaVideo",
      Rt(t.output, "videos", "video"),
      t.title
    ),
    ...Tt(
      "editorMediaAudio",
      Rt(t.output, "audios", "audio"),
      t.title
    )
  ];
  if (n.length > 0)
    return n;
  const r = Qn(t.output);
  if (r.length > 0)
    return r;
  const s = tr(t.output);
  return s ? er(s) : [];
}
function Tt(t, e, n) {
  return e.map((r) => ({
    type: t,
    attrs: {
      src: r,
      title: n,
      alt: n
    }
  }));
}
function Rt(t, e, n) {
  const r = et(t.content) ? t.content : {};
  return ai([
    ...Ut(r[e]),
    ...Ut(r[n]),
    ...Ut(t[e]),
    ...Ut(t[n])
  ]);
}
function Qn(t) {
  const e = et(t.content) ? t.content : {}, n = et(t.rich) ? t.rich : et(e.rich) ? e.rich : null;
  return !n || St(n.type) !== "doc" || !Array.isArray(n.content) ? [] : n.content.filter(
    (r) => et(r)
  );
}
function tr(t) {
  const e = et(t.content) ? t.content : {}, n = t;
  return St(
    t.text || e.text || n.lyrics || e.lyrics || n.lyric || e.lyric || n.lrc || e.lrc || n.song_lyrics || e.song_lyrics || n.songLyrics || e.songLyrics || t.title || e.title
  ).trim();
}
function ii(t) {
  const e = Qn(t);
  if (e.length > 0)
    return e;
  const n = tr(t);
  return n ? er(n) : [];
}
function er(t) {
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
      const r = St(t[n]).trim();
      if (r)
        return [r];
    }
  const e = St(t).trim();
  return e ? [e] : [];
}
function ai(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  return t.forEach((r) => {
    const s = r.trim();
    !s || e.has(s) || (e.add(s), n.push(s));
  }), n;
}
const ci = Yn.runAgentStream, li = Yn.stopAgentStream, ui = Wn.assistantReferencePayload, di = Wn.buildAssistantReferenceMessage, nr = zs.reloadStorePageSchema, Le = vt.isEmptyRuntimeOutput, d = vt.isPlainRecord, It = vt.normalizeRuntimeFrameOutput, fi = vt.resolveRuntimeFrameCancelable, Z = vt.runtimeErrorMessage, ut = $s.getStoreValueByPath, o = Jn.streamValueText, pi = Ls.watchRuntimeStream, Jt = Bs.cn, E = Fs.Button, rr = Wt.Dialog, sr = Wt.DialogContent, ir = Wt.DialogDescription, or = Wt.DialogHeader, ar = Wt.DialogTitle, mi = qs.Input, cr = js.Textarea, gi = Vs.AgentInteractionPanel, hi = ge.AssistantReferenceList, xi = ge.AssistantReferencePicker, yi = st.cancelStreamTiming, bi = st.StreamTimingBadge, Ai = st.createRuntimeStreamTiming, lr = st.createStreamTiming, Pe = st.finishStreamTiming, _i = st.isStreamTimingStatusOutput, Si = st.markStreamTimingStopping, wi = st.updateStreamTimingFromOutput, ki = st.useStreamClock, He = "z-[100]", Ue = 1e3, ur = 3, vn = "/bot/admin/agent/run", Di = "/bot/admin/agent/run_status", Ni = zi(
  "@/components/assistant/session-history-dialog",
  "AssistantSessionHistoryDialog"
), Pn = ye(
  "@/lib/page-data-reload"
).reloadStoreDataContainer, Ke = [
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
}, Ti = 15 * 1e3, Ri = 1500, Ii = 6;
function Pa({ item: t, store: e }) {
  const n = ws(), [r, s] = D([]), [a, u] = D(""), [p, y] = D([]), [b, v] = D(""), [S, B] = D(""), [I, G] = D(0), [F, M] = D(!1), [Pt, dt] = D(!1), [yt, Ct] = D(!1), [Mt, Ot] = D(!1), [wt, x] = D([]), [X, $] = D(!1), [kt, it] = D(""), [A, te] = D(!1), [tn, Et] = D(!1), [Ae, zt] = D(!1), [en, q] = D(""), [nn, ee] = D("0-0"), [zr, $t] = D(!1), [_e, Lt] = D(""), [Se, ne] = D(""), Dt = ht(0), we = ht(null), ke = ht(""), De = ht(""), rn = ht(""), ot = ht(0), sn = ht(/* @__PURE__ */ new Set()), on = ht(!1), Ne = W(() => {
    const i = we.current;
    i && Cn(i);
  }, []), w = de(
    e,
    () => o(ut(e, String(t.meta?.agentPath || "")))
  ), bt = de(
    e,
    () => o(
      ut(e, String(t.meta?.agentNamePath || ""))
    )
  ), nt = String(t.meta?.openPath || ""), At = de(
    e,
    () => nt ? !!ut(e, nt) : !0
  ), an = String(t.meta?.requestApi || vn), cn = String(t.meta?.streamApi || "/bot/admin/agent/stream"), ln = String(t.meta?.stopApi || "/bot/admin/agent/stop"), Te = Object.prototype.hasOwnProperty.call(
    t.meta || {},
    "runStatusApi"
  ) ? String(t.meta?.runStatusApi || "") : an === vn ? Di : "", $r = String(
    t.meta?.paramApi || "/bot/admin/energon/power_params"
  ), P = !!t.meta?.sessionEnabled, re = P && t.meta?.historyEnabled !== !1, Lr = t.meta?.newSessionEnabled !== !1, ft = P && Mt, se = String(
    t.meta?.sessionApi || "/bot/admin/assistant/session"
  ), un = String(
    t.meta?.sessionsApi || "/bot/admin/assistant/sessions"
  ), dn = String(
    t.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session"
  ), fn = String(
    t.meta?.restoreSessionApi || "/bot/admin/assistant/restore_session"
  ), pn = String(
    t.meta?.renameSessionApi || "/bot/admin/assistant/rename_session"
  ), mn = String(
    t.meta?.newSessionApi || "/bot/admin/assistant/new_session"
  ), Br = String(
    t.meta?.clearSessionApi || "/bot/admin/assistant/clear_session"
  ), Fr = String(
    t.meta?.messageApi || "/bot/admin/assistant/message"
  ), gn = String(
    t.meta?.memoriesApi || "/bot/admin/assistant/memories"
  ), hn = String(
    t.meta?.updateMemoryApi || "/bot/admin/assistant/update_memory"
  ), xn = String(
    t.meta?.forgetMemoryApi || "/bot/admin/assistant/forget_memory"
  ), ie = String(t.meta?.skillDraftPatchApi || ""), qr = String(
    t.meta?.skillDraftPatchListPath || "/bot/agent/skill_draft/list"
  ), jr = t.meta?.skillDraftPatchAutoApply !== !1, U = de(
    e,
    () => qi(t.meta?.sessionContext, e, w)
  ), yn = Number(t.meta?.blockMs || 1e3), bn = String(t.meta?.initialInput || ""), Vr = String(
    t.meta?.placeholder || "输入本轮任务，当前弹窗内的上下文会一起发送。"
  ), Hr = String(t.meta?.emptyText || ""), Ur = o(t.meta?.height || t.meta?.containerHeight).trim() || "min(calc(85vh - 11rem), 620px)", oe = rt(
    () => [...r].reverse().find(
      (i) => i.role === "assistant" && i.interaction && !i.interactionAnswered
    ),
    [r]
  ), Bt = oe?.id || "", Ft = rt(() => _e && r.find(
    (i) => i.id === _e && i.role === "assistant" && !!i.interaction
  ) || oe, [_e, r, oe]), pt = rt(() => {
    if (Se)
      return r.find(
        (i) => i.id === Se && i.role === "assistant"
      );
  }, [r, Se]), Re = rt(
    () => pt ? Xt(pt) : null,
    [pt]
  ), Kr = !!pt?.running, An = rt(
    () => pt ? kr(
      pt,
      !!Re
    ) : [],
    [Re, pt]
  ), Q = rt(
    () => r.some(
      (i) => i.role === "assistant" && !!i.running
    ),
    [r]
  ), Gr = rt(
    () => (a.trim().length > 0 || p.length > 0) && w.length > 0 && !F && !A && !Q,
    [
      w,
      Q,
      a,
      p.length,
      A,
      F
    ]
  ), Jr = rt(
    () => r.some(
      (i) => i.actionTiming && i.actionTiming.status === "running"
    ),
    [r]
  ), Yr = ki(Jr), ae = rt(
    () => vi(r),
    [r]
  ), _n = rt(
    () => wt.filter(qe).length,
    [wt]
  );
  ks(() => {
    if (!ae || ae === ke.current)
      return;
    ke.current = ae;
    const i = we.current;
    if (i)
      return Cn(i);
  }, [ae]);
  const at = W(() => {
    ot.current += 1, ke.current = "", s([]), u(bn), y([]), v(""), B(""), Dt.current = 0, G(0), Ot(!1), x([]), it(""), te(!1), Et(!1), zt(!1), q(""), ee("0-0"), $t(!1), Lt(""), ne(""), dt(!1), Ct(!1);
  }, [bn]), qt = W(
    (i) => {
      const c = d(i) ? i : {}, f = d(c.session) ? c.session : {}, g = Number(f.id || 0), _ = Number.isFinite(g) ? g : 0;
      Dt.current = _, G(_), Ot(!!c.memory_enabled), s(Yi(c.messages)), x(Vn(c.memories)), Ne();
    },
    [Ne]
  ), jt = W(
    async (i = !1) => {
      if (!(!P || !w)) {
        M(!0);
        try {
          const c = await K(
            i ? mn : se,
            {
              agent_key: w,
              context_key: U,
              title: bt ? `${bt} 会话` : "新会话",
              limit: 80
            }
          );
          qt(c), q("");
        } catch (c) {
          q(Z(c, "加载会话失败。"));
        } finally {
          M(!1);
        }
      }
    },
    [
      w,
      bt,
      qt,
      mn,
      se,
      U,
      P
    ]
  ), Wr = async () => {
    if (!P || !I || A) {
      at();
      return;
    }
    M(!0);
    try {
      const i = await K(Br, {
        session_id: I
      });
      qt(i);
    } catch (i) {
      q(Z(i, "清空会话失败。"));
    } finally {
      M(!1);
    }
  }, Zr = W(
    async (i) => {
      if (!re || !w)
        return so(i);
      const c = await K(un, {
        agent_key: w,
        context_key: U,
        page: i.page,
        page_size: i.pageSize,
        keyword: i.keyword,
        status: i.status
      }), f = d(c) ? c : {};
      return q(""), {
        sessions: no(f.sessions),
        pagination: ro(f.pagination, i)
      };
    },
    [w, re, U, un]
  ), Nt = W(async () => {
    if (!ft || !w) {
      x([]);
      return;
    }
    $(!0);
    try {
      const i = I || Dt.current, c = await K(gn, {
        agent_key: w,
        context_key: U,
        session_id: i || void 0,
        scope: "current",
        status: "all",
        page: 1,
        page_size: 50
      }), f = d(c) ? c : {};
      x(Vn(f.memories)), it(""), q("");
    } catch (i) {
      it(Z(i, "加载长期记忆失败。"));
    } finally {
      $(!1);
    }
  }, [
    w,
    gn,
    ft,
    U,
    I
  ]), Xr = W(() => {
    Ct(!0);
  }, []), Qr = W(
    async (i, c) => {
      if (!ft || i <= 0)
        return;
      const f = I || Dt.current, g = await K(hn, {
        id: i,
        ...c,
        agent_key: w,
        context_key: U,
        session_id: f || void 0
      }), _ = d(g) ? g : {}, h = Dr(_.memory);
      h ? x((R) => vo(R, h)) : await Nt(), it("");
    },
    [
      w,
      Nt,
      ft,
      U,
      I,
      hn
    ]
  ), ts = W(
    async (i) => {
      !ft || i <= 0 || (await K(xn, { id: i }), x(
        (c) => c.map(
          (f) => f.id === i ? { ...f, status: 2 } : f
        )
      ), it(""));
    },
    [xn, ft]
  ), es = W(
    async (i) => {
      await K(dn, {
        session_id: i
      });
    },
    [dn]
  ), ns = W(
    async (i) => {
      await K(fn, {
        session_id: i
      });
    },
    [fn]
  ), rs = W(
    async (i, c) => {
      const f = await K(pn, {
        session_id: i,
        title: c
      });
      return pr(
        d(f) ? f.session : null
      );
    },
    [pn]
  ), ss = async (i) => {
    if (!(!i || A)) {
      M(!0);
      try {
        const c = await K(se, {
          session_id: i,
          agent_key: w,
          context_key: U,
          limit: 80
        });
        qt(c), dt(!1), q("");
      } catch (c) {
        q(Z(c, "打开会话失败。"));
      } finally {
        M(!1);
      }
    }
  }, is = async () => {
    if (!P || A) {
      at();
      return;
    }
    at(), await jt(!0);
  }, os = async () => {
    if (!P)
      return 0;
    if (I > 0)
      return I;
    const i = await K(se, {
      agent_key: w,
      context_key: U,
      title: bt ? `${bt} 会话` : "新会话",
      limit: 80
    });
    qt(i);
    const c = d(i) && d(i.session) ? i.session : {}, f = Number(c.id || 0);
    return Number.isFinite(f) ? f : 0;
  }, ce = async (i, c, f) => {
    if (!(!P || i <= 0))
      return await K(Fr, {
        session_id: i,
        agent_key: w,
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
        output: f?.output || c.output || {},
        request_id: f?.requestID || c.requestID || "",
        status: f?.status || 1
      });
  }, as = async (i, c) => {
    const f = En(i);
    if (!f)
      return;
    const g = await Mn(
      Te,
      f
    ).catch(() => null), _ = On(g, f);
    if (!_ || Number(_.status) === 2)
      return;
    const h = It(_?.output, _), R = Kt(h), N = Gt(h) || o(_?.msg), T = {
      ...i,
      text: N,
      output: {
        text: N,
        finalOutput: z(h, N)
      },
      interaction: R,
      interactionAnswered: R ? !1 : void 0,
      running: !1,
      error: void 0,
      requestID: f
    };
    s(
      (L) => L.map(
        (j) => j.id === i.id ? T : j
      )
    ), await ce(c, T, {
      requestID: f,
      output: h,
      status: 1
    });
  };
  xt(() => {
    !P || I <= 0 || r.forEach((i) => {
      const c = En(i);
      !c || sn.current.has(c) || (sn.current.add(c), as(i, I));
    });
  }, [r, Te, P, I]), xt(() => {
    nt && (At && !on.current && !A && at(), on.current = At);
  }, [At, nt, at, A]), xt(() => {
    at();
  }, [w, at]), xt(() => {
    !P || !w || nt && !At || A || Bt || jt(!1);
  }, [
    w,
    jt,
    At,
    nt,
    Bt,
    A,
    P
  ]), xt(() => {
    yt && Nt();
  }, [Nt, yt]), xt(() => {
    if (!P || !w || A || F || nt && !At || !Q)
      return;
    const i = window.setTimeout(() => {
      jt(!1);
    }, 2e3);
    return () => {
      window.clearTimeout(i);
    };
  }, [
    w,
    Q,
    jt,
    At,
    nt,
    A,
    P,
    F
  ]), xt(() => {
    Bt && (Lt(Bt), $t(!0));
  }, [Bt]);
  const cs = (i) => {
    Lt(i), $t(!0);
  }, ls = (i) => {
    $t(i), i || Lt("");
  }, Sn = async () => {
    const i = p, c = a.trim() || (i.length > 0 ? "请根据参考资料和当前任务进行分析。" : "");
    if (!c || A || Q)
      return;
    const f = ui(i);
    i.length > 0 && (y([]), v("")), await Ie(
      {
        text: c,
        ...f ? { reference_files: f } : {}
      },
      {
        role: "user",
        text: di(c, i),
        kind: "chat",
        data: f ? { reference_files: f } : void 0
      },
      r
    );
  }, wn = async (i) => {
    const c = i.prompt.trim();
    !c || A || Q || (ne(""), await Ie(
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
  }, us = async (i) => {
    const c = Ft;
    if (!c?.interaction || c.interactionAnswered || A)
      return;
    const f = Qi(
      r,
      c.id,
      i.data
    );
    $t(!1), Lt(""), await Ie(
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
  }, Ie = async (i, c, f, g = "", _) => {
    if (!w) {
      q("未选择智能体。");
      return;
    }
    let h = 0;
    if (P)
      try {
        h = await os();
      } catch (k) {
        q(Z(k, "创建会话失败。"));
        return;
      }
    const R = ot.current + 1, N = {
      id: `${R}-user-${Date.now()}`,
      ...c
    }, T = `${R}-assistant-${Date.now()}`, L = {
      id: T,
      role: "assistant",
      text: "",
      output: Ce,
      running: !0,
      actionTiming: lr("等待智能体返回")
    }, j = po(f), J = io(
      i,
      me(t.meta?.inputContext, e)
    );
    h > 0 && (J.assistant_session_id = h), ot.current = R, De.current = "", s((k) => [...g ? k.map(
      (tt) => tt.id === g ? {
        ...tt,
        interactionAnswered: !0,
        interactionData: _
      } : tt
    ) : k, N, L]), Ne(), u(""), te(!0), Et(!1), zt(!1), q(""), B(""), ee("0-0");
    try {
      await ce(h, N);
    } catch (k) {
      q(Z(k, "保存用户消息失败。"));
    }
    let V = !1, Y = "", ct = "0-0", H = !1, mt = null;
    const ue = (k) => {
      const O = o(k);
      !O || h <= 0 || H || (H = !0, mt = ce(
        h,
        {
          ...L,
          text: "智能体正在处理...",
          requestID: O
        },
        {
          requestID: O,
          output: {
            event: "running",
            text: "智能体正在处理..."
          },
          status: ur
        }
      ));
    }, _t = (k, O, tt) => {
      (async () => (mt && await mt.catch(() => {
      }), await ce(h, k, {
        requestID: k.requestID || Y || S,
        output: O,
        status: tt
      })))().then((gt) => xs(T, gt));
    };
    try {
      await ci({
        agent: w,
        input: J,
        history: j,
        requestApi: an,
        streamApi: cn,
        stopApi: ln,
        blockMs: yn,
        onRequestID: (k) => {
          Y = o(k), B(Y), ue(Y);
        },
        onFrame: (k) => {
          if (ot.current !== R)
            return;
          const O = o(k?.stream_id);
          if (O && (ct = O, ee(O)), Nn(T, k), kn(k, T), h > 0 && k?.type === "result" && !V) {
            V = !0;
            const tt = It(
              k?.output,
              k
            ), gt = Kt(tt), Ht = o(k?.request_id) || Y || S, ve = Gt(tt) || o(k?.msg);
            _t(
              {
                ...L,
                text: ve,
                output: {
                  text: ve,
                  finalOutput: z(
                    tt,
                    ve
                  )
                },
                interaction: gt,
                interactionAnswered: gt ? !1 : void 0,
                running: !1,
                requestID: Ht
              },
              tt,
              Number(k.status) === 2 ? 2 : 1
            );
          }
        }
      });
    } catch (k) {
      if (ot.current === R) {
        const O = Z(k, "智能体测试失败。");
        if (Be(O) ? await ds({
          assistantID: T,
          activeSessionID: h,
          assistantMessage: L,
          requestID: Y || S,
          lastID: ct,
          streamApi: cn,
          runStatusApi: Te,
          blockMs: yn,
          token: R,
          isAlreadySaved: () => V,
          markSaved: () => {
            V = !0;
          },
          applyFrame: (gt) => {
            const Ht = o(gt?.stream_id);
            Ht && (ct = Ht, ee(Ht)), Nn(T, gt), kn(gt, T);
          },
          saveFinal: _t
        }) : !1)
          return;
        q(O), As(T, O), h > 0 && !V && !Be(O) && (V = !0, _t(
          {
            ...L,
            text: O,
            requestID: Y || S
          },
          { error: O, text: O },
          2
        ));
      }
    } finally {
      ot.current === R && (te(!1), Et(!1), zt(!1), _s(T));
    }
  }, ds = async ({
    assistantID: i,
    activeSessionID: c,
    assistantMessage: f,
    requestID: g,
    lastID: _,
    streamApi: h,
    runStatusApi: R,
    blockMs: N,
    token: T,
    isAlreadySaved: L,
    markSaved: j,
    applyFrame: J,
    saveFinal: V
  }) => {
    if (!g || L())
      return !1;
    const Y = (H) => {
      if (J(H), H?.type !== "result")
        return !1;
      if (c > 0 && !L()) {
        j();
        const mt = It(H?.output, H), ue = Kt(mt), _t = Gt(mt) || o(H?.msg);
        V(
          {
            ...f,
            text: _t,
            output: {
              text: _t,
              finalOutput: z(mt, _t)
            },
            interaction: ue,
            interactionAnswered: ue ? !1 : void 0,
            running: !1,
            requestID: o(H?.request_id) || g
          },
          mt,
          Number(H.status) === 2 ? 2 : 1
        );
      }
      return Number(H.status) !== 2;
    };
    let ct = !1;
    try {
      await pi({
        streamApi: h,
        requestID: g,
        lastID: _ || "0-0",
        blockMs: N,
        transport: "poll",
        stopOnResult: !0,
        recoverOnError: !0,
        acceptErrorResult: !0,
        onFrame: (H) => {
          if (ot.current !== T)
            return !1;
          if (H?.type !== "result") {
            J(H);
            return;
          }
          return Y(H), ct = !0, !1;
        }
      });
    } catch {
      ct = !1;
    }
    return ct ? !0 : R ? await fs({
      runStatusApi: R,
      requestID: g,
      token: T,
      applyResultFrame: Y
    }) : !1;
  }, fs = async ({
    runStatusApi: i,
    requestID: c,
    token: f,
    applyResultFrame: g
  }) => {
    const _ = Date.now() + Ti;
    let h = 0, R = 0;
    const N = /* @__PURE__ */ new Set();
    for (; ot.current === f && Date.now() < _ && R < Ii; ) {
      R += 1;
      const T = await Mn(
        i,
        c
      ).catch(() => (h += 1, null));
      if (h >= 3)
        return !1;
      T && (h = 0);
      for (const j of Pi(
        T,
        c,
        N
      )) {
        const J = o(j.stream_id);
        if (J && N.add(J), g(j))
          return !0;
      }
      const L = On(T, c);
      if (L)
        return g(L), !0;
      await Ei(Ri);
    }
    return !1;
  }, ps = async () => {
    if (!(!S || !tn || Ae)) {
      zt(!0), ys();
      try {
        await li(S, ln), ot.current += 1, te(!1), Et(!1), bs();
      } catch (i) {
        q(Z(i, "停止智能体失败。"));
      } finally {
        zt(!1);
      }
    }
  }, ms = (i) => {
    (i.metaKey || i.ctrlKey) && i.key === "Enter" && (i.preventDefault(), Sn());
  }, kn = (i, c) => {
    if (gs(i, c), i?.type !== "result" || t.meta?.reloadPageOnFinal !== !0 || Number(i.status) === 2)
      return;
    const f = It(i?.output, i), g = o(f.kind || f.type || f.event).trim().toLowerCase();
    if (g === "skill_draft_patch" && ie || !Oo(g, t.meta?.reloadPageOnFinalKinds))
      return;
    const _ = [i.request_id, i.stream_id, g].map(o).join(":");
    if (De.current === _)
      return;
    De.current = _;
    const h = Math.max(
      0,
      Number(t.meta?.reloadPageOnFinalDelayMs || 0)
    );
    window.setTimeout(() => {
      nr(e);
    }, h);
  }, gs = (i, c) => {
    if (i?.type !== "result" || !ie || !jr || Number(i.status) === 2)
      return;
    const f = It(i?.output, i), g = ze(f);
    if (!g)
      return;
    const _ = [i.request_id, i.stream_id, "skill_draft_patch"].map(o).join(":");
    if (rn.current === _)
      return;
    rn.current = _;
    const h = me(
      t.meta?.skillDraftPatchContext,
      e
    ), R = {
      ...g,
      ...h,
      ...zn(
        P,
        I || Dt.current,
        w,
        U
      )
    };
    Dn(c, R);
  }, Dn = (i, c) => {
    le(i, {
      status: "saving",
      draft_id: C(
        c,
        "id",
        "draft_id",
        "draftId"
      ),
      message: "正在保存技能..."
    }), K(ie, c).then(async (f) => {
      Vi(
        e,
        t.meta?.skillDraftPatchTargetPath,
        c,
        f
      ), await Bi(
        e,
        t.meta?.skillDraftPatchReloadDataKeys,
        t.meta?.skillDraftPatchReloadDataKey,
        t.meta?.skillDraftPatchReloadPageOnSave
      ), Hi(
        e,
        t.meta?.skillDraftPatchTablePath,
        t.meta?.skillDraftPatchTargetPath,
        c,
        f
      ), le(i, {
        status: "saved",
        draft_id: C(f, "draft_id", "draftId", "id") || C(c, "id", "draft_id", "draftId"),
        message: "技能已保存。"
      }), t.meta?.skillDraftPatchCloseOnSave === !0 && nt && e.getState().setValueByPath(nt, !1);
    }).catch((f) => {
      const g = Z(f, "保存技能失败。");
      le(i, {
        status: "failed",
        message: g
      }), q(g);
    });
  }, hs = (i, c) => {
    if (!ie || !c)
      return;
    const f = ze(c);
    if (!f) {
      le(i, {
        status: "failed",
        message: "没有找到可保存的技能内容。"
      });
      return;
    }
    const g = me(
      t.meta?.skillDraftPatchContext,
      e
    ), _ = {
      ...f,
      ...g,
      ...zn(
        P,
        I || Dt.current,
        w,
        U
      )
    };
    Dn(i, _);
  }, Nn = (i, c, f) => {
    const g = It(c?.output, c);
    if (Le(g) && c?.type !== "result")
      return;
    const _ = fi(c);
    _ != null && Et(_), Vt(i, (h) => {
      const R = h.output || Ce, N = {
        text: R.text,
        finalOutput: R.finalOutput
      }, T = Je(g), L = Kt(g);
      if (c?.type !== "result" && gr(T))
        return ho(h, g, c);
      let j = h.actionTiming;
      _i(g) && (j = wi(j, g));
      const J = yo(
        h.resultDetail,
        g,
        c
      );
      if (c?.type === "result") {
        let V = Le(g) ? z({
          text: N.text || o(c?.msg)
        }) : g;
        be(V) && N.text.trim() && (V = z({
          ...V,
          event: "final",
          text: N.text
        })), N.finalOutput = V;
        const Y = o(V.text) || N.text, ct = We(
          J,
          Ye(V)
        );
        return {
          ...h,
          text: Y,
          interaction: L || h.interaction,
          output: N,
          resultDetail: ct,
          running: !1,
          requestID: o(c?.request_id) || h.requestID,
          actionTiming: Pe(
            j,
            Number(c.status) === 2 ? "failed" : "done"
          )
        };
      }
      return T === "interaction" ? (g.text && (N.text = o(g.text)), {
        ...h,
        text: N.text,
        interaction: L || h.interaction,
        output: N,
        resultDetail: J,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: j
      }) : ((T === "delta" || !T && g.text) && (N.text += o(g.text)), {
        ...h,
        text: N.text,
        interaction: L || h.interaction,
        output: N,
        resultDetail: J,
        requestID: o(c?.request_id) || h.requestID,
        actionTiming: j
      });
    });
  }, Vt = (i, c) => {
    s(
      (f) => f.map(
        (g) => g.id === i && g.role === "assistant" ? c(g) : g
      )
    );
  }, le = (i, c) => {
    i && Vt(i, (f) => ({
      ...f,
      data: {
        ...f.data || {},
        skillDraftPatch: c
      }
    }));
  }, xs = (i, c) => {
    const f = d(c) && d(c.message) ? c.message : {}, g = d(f.output) ? f.output : {}, _ = Nr(g.memory_review);
    _ && Mt && (Vt(i, (h) => ({
      ...h,
      output: {
        ...h.output || Ce,
        finalOutput: {
          ...h.output?.finalOutput || {},
          memory_review: _
        }
      }
    })), Nt());
  }, Tn = (i) => {
    s(
      (c) => c.map(
        (f) => f.role === "assistant" && f.running ? i(f) : f
      )
    );
  }, ys = () => {
    Tn((i) => ({
      ...i,
      actionTiming: Si(i.actionTiming)
    }));
  }, bs = () => {
    Tn((i) => ({
      ...i,
      running: !1,
      actionTiming: yi(i.actionTiming)
    }));
  }, As = (i, c) => {
    Vt(i, (f) => ({
      ...f,
      error: c,
      running: !1,
      actionTiming: Pe(f.actionTiming, "failed")
    }));
  }, _s = (i) => {
    Vt(i, (c) => ({
      ...c,
      running: !1,
      actionTiming: Pe(c.actionTiming, "done")
    }));
  };
  return /* @__PURE__ */ m(
    "div",
    {
      className: "flex min-h-0 flex-col gap-3 overflow-hidden",
      style: { height: Ur },
      children: [
        /* @__PURE__ */ m(
          "div",
          {
            ref: we,
            className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3",
            children: [
              r.length === 0 ? /* @__PURE__ */ l("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: Hr || `输入一次任务开始测试${bt ? `「${bt}」` : "智能体"}。` }) : null,
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
                          now: Yr,
                          running: A,
                          memoryEnabled: Mt,
                          onOpenInteraction: cs,
                          onOpenResult: () => ne(i.id),
                          onOpenDraftBox: () => n({ to: qr }),
                          onApplySkillDraftPatch: (c) => hs(i.id, c),
                          onSendSuggestion: (c) => {
                            wn(c);
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
            open: !!Ft?.interaction && zr,
            interaction: Ft?.interaction,
            paramApi: $r,
            readonly: !!Ft?.interactionAnswered,
            initialData: Ft?.interactionData,
            disabled: A,
            onOpenChange: ls,
            onSubmit: (i) => {
              us(i);
            }
          }
        ),
        /* @__PURE__ */ l(
          ni,
          {
            open: !!pt,
            detail: Re,
            running: Kr,
            suggestions: An.length > 0 ? /* @__PURE__ */ l(
              mr,
              {
                suggestions: An,
                disabled: A,
                onSelect: (i) => {
                  wn(i);
                }
              }
            ) : null,
            onOpenChange: (i) => {
              i || ne("");
            }
          }
        ),
        re ? /* @__PURE__ */ l(
          Ni,
          {
            open: Pt,
            onOpenChange: dt,
            agentKey: w,
            contextKey: U,
            activeSessionID: I,
            disabled: A || F,
            assistantLayer: !0,
            layerClassName: He,
            layerZIndex: Ue,
            loadSessions: Zr,
            onOpenSession: (i) => ss(i),
            onArchiveSession: es,
            onRestoreSession: ns,
            onRenameSession: rs
          }
        ) : null,
        ft ? /* @__PURE__ */ l(
          co,
          {
            open: yt,
            memories: wt,
            loading: X,
            error: kt,
            disabled: A || F,
            onOpenChange: Ct,
            onRefresh: Nt,
            onUpdate: Qr,
            onForget: ts
          }
        ) : null,
        en ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: en }) : null,
        /* @__PURE__ */ m("div", { className: "shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20", children: [
          p.length > 0 ? /* @__PURE__ */ l("div", { className: "border-b px-3 py-2", children: /* @__PURE__ */ l(
            hi,
            {
              references: p,
              disabled: A || Q,
              onRemove: (i) => y(
                (c) => c.filter((f, g) => g !== i)
              )
            }
          ) }) : null,
          /* @__PURE__ */ l(
            cr,
            {
              value: a,
              disabled: A || Q,
              placeholder: Vr,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (i) => u(i.target.value),
              onKeyDown: ms
            }
          ),
          /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ l("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: S ? `RequestID: ${S}${nn !== "0-0" ? ` / ${nn}` : ""}` : Q ? "智能体正在执行，结果会自动同步。" : b || (P ? F ? "正在加载历史会话。" : I ? "会话已保存，刷新后可继续。" : "本次会话会保存到后台。" : "关闭弹窗后会清空本次测试上下文。") }),
            /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2", children: [
              ft ? /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: A || F,
                  onClick: Xr,
                  children: [
                    /* @__PURE__ */ l(Ns, { className: "size-3.5" }),
                    _n > 0 ? `记忆 ${_n}` : "记忆"
                  ]
                }
              ) : null,
              re ? /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: A || F,
                  onClick: () => dt(!0),
                  children: [
                    /* @__PURE__ */ l(Ts, { className: "size-3.5" }),
                    "历史"
                  ]
                }
              ) : null,
              /* @__PURE__ */ l(
                xi,
                {
                  references: p,
                  disabled: A || Q,
                  buttonLabel: "素材",
                  onReferencesChange: y,
                  onMessage: v
                }
              ),
              /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: A || F,
                  onClick: () => P ? void Wr() : at(),
                  children: [
                    /* @__PURE__ */ l(Gn, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              Lr ? /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: A || F,
                  onClick: () => P ? void is() : at(),
                  children: [
                    /* @__PURE__ */ l(Is, { className: "size-3.5" }),
                    P ? "新会话" : "新对话"
                  ]
                }
              ) : null,
              A ? /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !tn || Ae,
                  onClick: () => {
                    ps();
                  },
                  children: [
                    Ae ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Cs, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              /* @__PURE__ */ m(
                E,
                {
                  type: "button",
                  size: "sm",
                  disabled: !Gr,
                  onClick: () => {
                    Sn();
                  },
                  children: [
                    A || Q ? /* @__PURE__ */ l(lt, { className: "size-4 animate-spin" }) : /* @__PURE__ */ l(Ps, { className: "size-4" }),
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
function vi(t) {
  for (let e = t.length - 1; e >= 0; e -= 1) {
    const n = t[e];
    if (!(n.role !== "assistant" || n.running || n.error || n.interaction) && (Xt(n) || Qe(Sr(n))))
      return n.id;
  }
  return "";
}
function Me(t) {
  t.scrollTop = t.scrollHeight;
}
function Cn(t) {
  Me(t);
  const e = window.requestAnimationFrame(() => {
    Me(t);
  }), n = window.setTimeout(() => {
    Me(t);
  }, 120);
  return () => {
    window.cancelAnimationFrame(e), window.clearTimeout(n);
  };
}
async function Mn(t, e) {
  const n = await Ds(t, "get", { request_id: e });
  if (!d(n))
    return {};
  const r = Number(n.status || 0), s = Number(n.code || 0);
  if (r === 2 || s === 401)
    throw new Error(o(n.msg || n.message) || "请求失败");
  return d(n.data) ? n.data : {};
}
function On(t, e) {
  const n = d(t?.run) ? t.run : {}, r = o(n.status).toLowerCase();
  if (!dr(r))
    return null;
  const s = d(n.output) ? n.output : {}, a = o(n.error) || o(s.error) || o(s.text) || "智能体运行失败。", u = r === "success" ? 1 : 2, p = u === 2 && !o(s.text) ? {
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
  const r = d(t?.run) ? t.run : {}, s = Array.isArray(r.stream) ? r.stream : [], a = [];
  for (const p of s) {
    const y = Ci(p, e);
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
function Ci(t, e) {
  const n = d(t) ? t : {}, r = d(n.payload) ? n.payload : d(t) ? t : {}, s = d(r.output) ? r.output : {}, a = Je(s), u = o(r.type || "stream").toLowerCase();
  return u !== "result" && !gr(a) ? null : {
    request_id: o(r.request_id) || e,
    stream_id: o(r.stream_id) || o(n.id),
    type: u || "stream",
    status: Number(r.status || 0) || 1,
    msg: o(r.msg),
    output: s
  };
}
function Mi(t, e) {
  if (dr(o(t.status).toLowerCase()))
    return null;
  const n = d(t.output) ? t.output : {}, r = Ye(n);
  if (!r || !r.result && r.tasks.length === 0)
    return null;
  const s = r.id || o(n.result_id) || e, a = Oi(r);
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
function Oi(t) {
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
function dr(t) {
  return ["success", "fail", "canceled"].includes(t);
}
function Be(t) {
  return /network|failed to fetch|读取运行流失败\((408|425|429|500|502|503|504)\)|timeout|超时/i.test(
    t
  );
}
function En(t) {
  return t.role !== "assistant" || !t.requestID || !t.error || !Be(t.error) ? "" : t.requestID;
}
function Ei(t) {
  return new Promise((e) => {
    window.setTimeout(e, t);
  });
}
function zi(t, e) {
  const n = ye(t)?.[e];
  return typeof n == "function" ? n : $i;
}
function $i() {
  return null;
}
async function Li(t, e) {
  return typeof Pn != "function" ? !1 : !!await Pn(t, e);
}
async function Bi(t, e, n, r) {
  for (const s of Fi(
    e,
    n
  ))
    try {
      await Li(t, s);
    } catch {
    }
  if (r !== !1)
    try {
      await nr(t);
    } catch {
    }
}
function Fi(t, e) {
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
  if (d(t)) {
    const s = ji(
      t,
      e
    );
    if (s)
      return s;
    const a = me(t, e), u = Object.entries(a).filter(([, p]) => p != null && p !== "").sort(([p], [y]) => p.localeCompare(y));
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
  const s = C(
    { id: ut(e, r) },
    "id"
  );
  return s > 0 ? `${n}:${s}` : o(t.fallback).trim();
}
function zn(t, e, n, r) {
  if (!t)
    return {};
  const s = {};
  return e > 0 && (s.assistant_session_id = e), n && (s.assistant_agent_key = n), r && (s.assistant_context_key = r), s;
}
function Vi(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = d(n.patch) ? n.patch : {}, u = ut(t, s), p = d(u) ? u : {}, y = d(r.draft) ? r.draft : {}, b = {
    ...p,
    ...fr(a),
    ...y
  }, v = C(r, "draft_id", "draftId", "id") || C(n, "id", "draft_id", "draftId") || C(p, "id");
  v > 0 && (b.id = v);
  const S = C(n, "pack_id", "packId") || C(a, "pack_id", "packId") || C(p, "pack_id", "packId");
  S > 0 && (b.pack_id = S);
  const B = C(n, "cate_id", "cateId") || C(a, "cate_id", "cateId") || C(p, "cate_id", "cateId");
  B > 0 && (b.cate_id = B), t.getState().setValueByPath(s, b);
}
function Hi(t, e, n, r, s) {
  const a = o(e).trim() || "data.table.list", u = ut(t, a);
  if (!Array.isArray(u))
    return;
  const p = Ui(
    t,
    n,
    r,
    s
  ), y = C(p, "id", "draft_id", "draftId");
  if (y <= 0)
    return;
  p.id = y;
  let b = !1;
  const v = u.map((S) => d(S) && C(S, "id") === y ? (b = !0, { ...S, ...p }) : S);
  b || (v.unshift(p), Ki(t, a)), t.getState().setValueByPath(a, v);
}
function Ui(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = ut(t, s), u = d(a) ? a : {}, p = d(r.draft) ? r.draft : {}, y = d(n.patch) ? n.patch : {};
  return {
    ...u,
    ...fr(y),
    ...p,
    id: C(r, "draft_id", "draftId", "id") || C(p, "id", "draft_id", "draftId") || C(n, "id", "draft_id", "draftId") || C(u, "id")
  };
}
function Ki(t, e) {
  const n = e.endsWith(".list") ? `${e.slice(0, -5)}.total` : "";
  if (!n)
    return;
  const r = Number(ut(t, n));
  Number.isFinite(r) && t.getState().setValueByPath(n, r + 1);
}
function fr(t) {
  const e = {};
  return fe(e, t, "key", "key"), fe(e, t, "name", "name"), fe(e, t, "description", "description", "desc"), fe(
    e,
    t,
    "skill_md",
    "skill_md",
    "skillMd",
    "skill",
    "content",
    "markdown"
  ), $n(
    e,
    t,
    "files_json",
    "files_json",
    "filesJson",
    "files"
  ), $n(
    e,
    t,
    "manifest",
    "manifest",
    "runtime_config",
    "runtimeConfig"
  ), Ln(e, t, "pack_id", "pack_id", "packId"), Ln(e, t, "cate_id", "cate_id", "cateId"), e;
}
function fe(t, e, n, ...r) {
  const s = Gi(e, ...r);
  s && (t[n] = s);
}
function $n(t, e, n, ...r) {
  const s = Ji(e, ...r);
  s && (t[n] = s);
}
function Ln(t, e, n, ...r) {
  const s = C(e, ...r);
  s > 0 && (t[n] = s);
}
function Gi(t, ...e) {
  const n = Ge(t, e);
  return o(n).trim();
}
function Ji(t, ...e) {
  const n = Ge(t, e);
  if (n == null)
    return "";
  if (typeof n == "string")
    return n.trim();
  if (d(n) || Array.isArray(n))
    try {
      return JSON.stringify(n);
    } catch {
      return "";
    }
  return "";
}
function C(t, ...e) {
  const n = Ge(t, e), r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function Ge(t, e) {
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
  if (!d(t))
    return null;
  const n = o(t.role) === "user" ? "user" : "assistant", r = Number(t.status || 0) === ur, s = o(t.text) || (r ? "智能体正在处理..." : ""), a = d(t.content) ? t.content : {}, u = d(t.output) ? t.output : {}, p = o(a.kind || t.kind), y = r ? lr("等待智能体返回") : Zi(t, u), b = {
    id: `saved-${o(t.id) || e}`,
    role: n,
    text: s,
    kind: p || "chat",
    data: d(a.data) ? a.data : void 0,
    requestID: o(t.request_id),
    running: r,
    actionTiming: y
  };
  if (n === "assistant") {
    const S = Le(u) ? z({ text: s }) : z(u, s);
    b.output = {
      text: s,
      finalOutput: S
    }, Number(t.status) === 2 && (b.error = s);
  }
  const v = Ve(a.interaction) || Kt(u);
  return v && (b.interaction = v, b.interactionAnswered = !!a.interaction_answered, d(a.interaction_data) && (b.interactionData = a.interaction_data)), b;
}
function Zi(t, e) {
  const n = Xi(e), r = Bn(
    t,
    e,
    n,
    "started_at_ms",
    "started_at"
  );
  if (r == null)
    return;
  const s = Bn(
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
  const e = d(t.result) ? t.result : {}, n = d(t.content) ? t.content : {}, r = d(e.content) ? e.content : {};
  return {
    result: e,
    content: n,
    resultContent: r
  };
}
function Bn(t, e, n, r, s) {
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
    const u = d(n.data) ? n.data : void 0;
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
  return (Array.isArray(t) ? t : []).map(pr).filter((n) => !!n);
}
function pr(t) {
  if (!d(t))
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
  const n = d(t) ? t : {};
  return {
    page: pe(n.page, e.page),
    page_size: pe(n.page_size ?? n.pageSize, e.pageSize),
    total: pe(n.total, 0),
    total_pages: pe(n.total_pages ?? n.totalPages, 0)
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
function pe(t, e) {
  const n = Number(t);
  return !Number.isFinite(n) || n < 0 ? e : n;
}
function me(t, e) {
  if (!d(t))
    return {};
  const n = {};
  for (const [r, s] of Object.entries(t)) {
    const a = String(r || "").trim(), u = String(s || "").trim();
    !a || !u || (n[a] = ut(e, u));
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
  const r = d(t.context) ? t.context : {};
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
  const b = Xt(t), v = !!t.interaction, S = !v && wo(b), B = Sr(t), I = S || Qe(B), G = kr(t, I), F = t.interaction ? o(t.interaction.title) || "补充交互信息" : "", M = t.interaction ? o(t.interaction.description) : "", Pt = No(t), dt = t.output?.finalOutput ? ze(t.output.finalOutput) : null, yt = !!(t.actionTiming && !S);
  return /* @__PURE__ */ m("div", { className: "space-y-2", children: [
    yt ? /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ l(Fn, { message: t, hasOutput: I }),
      /* @__PURE__ */ l(bi, { timing: t.actionTiming, now: e })
    ] }) : /* @__PURE__ */ l(Fn, { message: t, hasOutput: I }),
    S && b ? /* @__PURE__ */ l(
      ei,
      {
        detail: b,
        running: !!t.running,
        timing: t.actionTiming,
        now: e,
        onOpen: a
      }
    ) : I ? /* @__PURE__ */ l(Os, { output: B }) : null,
    b && !v && !S ? /* @__PURE__ */ l(ao, { onOpen: a }) : null,
    /* @__PURE__ */ l(
      lo,
      {
        progress: Pt,
        hasPendingPatch: !!dt,
        onApply: () => p(t.output?.finalOutput),
        onOpenDraftBox: u
      }
    ),
    t.error ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive", children: t.error }) : null,
    t.interaction ? /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ m("span", { className: "min-w-0", children: [
        /* @__PURE__ */ l("span", { className: "block truncate text-foreground", children: t.interactionAnswered ? "交互信息已提交。" : F }),
        M ? /* @__PURE__ */ l("span", { className: "block truncate", children: M }) : null
      ] }),
      /* @__PURE__ */ l(
        E,
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
      mr,
      {
        suggestions: G,
        disabled: n,
        onSelect: y
      }
    ),
    t.requestID ? /* @__PURE__ */ l("div", { className: "truncate border-t pt-1 font-mono text-[11px] text-muted-foreground", children: t.requestID }) : null
  ] });
}
function ao({ onOpen: t }) {
  return /* @__PURE__ */ l("div", { className: "flex justify-end", children: /* @__PURE__ */ m(
    E,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 px-2 text-xs",
      onClick: t,
      children: [
        "查看详情",
        /* @__PURE__ */ l(Kn, { className: "size-3.5" })
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
  const [b, v] = D(0), [S, B] = D({ title: "", content: "" }), [I, G] = D(0), [F, M] = D("");
  xt(() => {
    t || (v(0), B({ title: "", content: "" }), G(0), M(""));
  }, [t]);
  const Pt = (x) => {
    v(x.id), B({ title: x.title, content: x.content }), M("");
  }, dt = async () => {
    if (b <= 0)
      return;
    const x = S.title.trim(), X = S.content.trim();
    if (!x || !X) {
      M("标题和内容不能为空。");
      return;
    }
    G(b);
    try {
      await p(b, { title: x, content: X }), v(0), B({ title: "", content: "" }), M("");
    } catch ($) {
      M(Z($, "保存长期记忆失败。"));
    } finally {
      G(0);
    }
  }, yt = async (x, X) => {
    G(x);
    try {
      await p(x, { status: X }), M("");
    } catch ($) {
      M(Z($, "更新长期记忆失败。"));
    } finally {
      G(0);
    }
  }, Ct = async (x) => {
    G(x);
    try {
      await y(x), b === x && v(0), M("");
    } catch (X) {
      M(Z(X, "停用长期记忆失败。"));
    } finally {
      G(0);
    }
  }, Mt = () => {
    v(0), B({ title: "", content: "" }), M("");
  }, Ot = e.filter(qe).length, wt = e.length - Ot;
  return /* @__PURE__ */ l(rr, { open: t, onOpenChange: a, children: /* @__PURE__ */ m(
    sr,
    {
      "data-assistant-layer": "true",
      layerClassName: He,
      layerZIndex: Ue,
      className: "max-h-[86vh] max-w-3xl",
      children: [
        /* @__PURE__ */ m(or, { children: [
          /* @__PURE__ */ l(ar, { children: "长期记忆" }),
          /* @__PURE__ */ l(ir, { children: "当前智能体和上下文会带入已启用记忆；停用后不会再参与后续运行。" })
        ] }),
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ m("div", { className: "min-w-0 text-muted-foreground", children: [
            "已启用 ",
            Ot,
            " 条",
            wt > 0 ? `，已停用 ${wt} 条` : ""
          ] }),
          /* @__PURE__ */ m(
            E,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: s || n,
              onClick: () => {
                u();
              },
              children: [
                n ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Rn, { className: "size-3.5" }),
                "刷新"
              ]
            }
          )
        ] }),
        r || F ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: F || r }) : null,
        /* @__PURE__ */ l("div", { className: "max-h-[56vh] space-y-2 overflow-y-auto pr-1", children: n && e.length === 0 ? /* @__PURE__ */ m("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: [
          /* @__PURE__ */ l(lt, { className: "mr-2 size-4 animate-spin" }),
          "正在加载长期记忆"
        ] }) : e.length === 0 ? /* @__PURE__ */ l("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: "当前上下文还没有长期记忆。" }) : e.map((x) => {
          const X = b === x.id, $ = I === x.id, kt = qe(x);
          return /* @__PURE__ */ l(
            "div",
            {
              className: Jt(
                "rounded-md border bg-background p-3 text-sm",
                !kt && "bg-muted/20 text-muted-foreground"
              ),
              children: /* @__PURE__ */ m("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ m("div", { className: "min-w-0 flex-1 space-y-2", children: [
                  /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ l("span", { className: "rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground", children: Po(x.kind) }),
                    /* @__PURE__ */ l(
                      "span",
                      {
                        className: Jt(
                          "rounded-full px-2 py-0.5 text-[11px]",
                          kt ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
                        ),
                        children: kt ? "启用" : "停用"
                      }
                    ),
                    /* @__PURE__ */ m("span", { className: "text-[11px] text-muted-foreground", children: [
                      Mo(x.source),
                      " / 重要度",
                      " ",
                      x.importance
                    ] })
                  ] }),
                  X ? /* @__PURE__ */ m("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ l(
                      mi,
                      {
                        value: S.title,
                        disabled: $,
                        placeholder: "记忆标题",
                        onChange: (it) => B((A) => ({
                          ...A,
                          title: it.target.value
                        }))
                      }
                    ),
                    /* @__PURE__ */ l(
                      cr,
                      {
                        value: S.content,
                        disabled: $,
                        placeholder: "记忆内容",
                        className: "min-h-24 resize-y",
                        onChange: (it) => B((A) => ({
                          ...A,
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
                      Co(x.scope)
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
                /* @__PURE__ */ l("div", { className: "flex shrink-0 flex-wrap items-center gap-1 sm:justify-end", children: X ? /* @__PURE__ */ m(Ee, { children: [
                  /* @__PURE__ */ m(
                    E,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || $,
                      onClick: () => {
                        dt();
                      },
                      children: [
                        $ ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(vs, { className: "size-3.5" }),
                        "保存"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    E,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: $,
                      onClick: Mt,
                      children: /* @__PURE__ */ l(Ms, { className: "size-3.5" })
                    }
                  )
                ] }) : /* @__PURE__ */ m(Ee, { children: [
                  /* @__PURE__ */ m(
                    E,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || $,
                      onClick: () => Pt(x),
                      children: [
                        /* @__PURE__ */ l(Rs, { className: "size-3.5" }),
                        "编辑"
                      ]
                    }
                  ),
                  kt ? /* @__PURE__ */ m(
                    E,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || $,
                      onClick: () => {
                        Ct(x.id);
                      },
                      children: [
                        $ ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Gn, { className: "size-3.5" }),
                        "停用"
                      ]
                    }
                  ) : /* @__PURE__ */ m(
                    E,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || $,
                      onClick: () => {
                        yt(x.id, 1);
                      },
                      children: [
                        $ ? /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Rn, { className: "size-3.5" }),
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
        E,
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
          /* @__PURE__ */ l(lt, { className: "size-3.5 animate-spin" }),
          u
        ] }) : a ? u : /* @__PURE__ */ m(Ee, { children: [
          u,
          t.draft_id ? ` ID: ${t.draft_id}` : "",
          /* @__PURE__ */ l("span", { className: "ml-1 text-emerald-700", children: "下一步在技能草稿页校验、测试和发布。" })
        ] }) }),
        a && e ? /* @__PURE__ */ l("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ l(
          E,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            className: "h-7 px-2 text-xs",
            onClick: n,
            children: "重新保存"
          }
        ) }) : !s && !a ? /* @__PURE__ */ l("div", { className: "flex shrink-0 items-center gap-2", children: /* @__PURE__ */ l(
          E,
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
function Fn({
  message: t,
  hasOutput: e
}) {
  const n = zo(t, e);
  return n ? /* @__PURE__ */ l("div", { className: "inline-flex rounded-full border bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground", children: n }) : null;
}
function mr({
  suggestions: t,
  disabled: e,
  onSelect: n
}) {
  return t.length === 0 ? null : /* @__PURE__ */ l("div", { className: "flex flex-wrap items-center gap-2 border-t pt-2", children: t.map((r, s) => /* @__PURE__ */ m(
    E,
    {
      type: "button",
      size: "sm",
      variant: "outline",
      className: "h-7 rounded-full px-2.5 text-xs",
      disabled: e,
      title: r.prompt,
      onClick: () => n(r),
      children: [
        /* @__PURE__ */ l(Ks, { className: "size-3.5" }),
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
      be(s) || (r.output = s);
    }
    return e.interaction && (r.interaction = e.interaction, r.interaction_answered = !!e.interactionAnswered, e.interactionData && (r.interaction_data = e.interactionData)), r;
  }).filter(
    (e) => o(e.text).trim().length > 0 || !!e.interaction || !!e.data || !!e.output
  );
}
function mo(t) {
  return Xe(t.text) ? "" : t.text;
}
function go(t) {
  const e = Xt(t);
  return e?.result ? z(e.result, t.text) : z(
    t.output?.finalOutput || {},
    t.text
  );
}
function gr(t) {
  return t === "result_detail" || t === "result_task" || t === "result_progress" || t === "result_created" || t === "task_progress" || t === "task_done";
}
function ho(t, e, n) {
  const r = Je(e);
  let s = t.resultDetail;
  return r === "result_detail" || r === "result_created" ? s = We(
    s,
    xo(e)
  ) : r === "result_task" || r === "task_progress" || r === "task_done" ? s = hr(
    s,
    Ar(e),
    o(e.result_id)
  ) : r === "result_progress" && (s = _o(
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
function Je(t) {
  return o(t.semantic_event || t.event).toLowerCase();
}
function Xt(t) {
  const e = We(
    t.resultDetail,
    Ye(t.output?.finalOutput)
  );
  return e && (e.result || e.tasks.length) ? e : null;
}
function xo(t) {
  if (!t)
    return;
  const e = d(t.result) ? z(t.result) : void 0, n = br(t.tasks);
  return {
    id: o(t.result_id) || o(e?.result_id),
    title: o(t.title || e?.title) || "最终结果",
    mode: he(
      t.result_mode || t.display_mode || e?.result_mode
    ),
    result: e,
    tasks: n,
    progress: Qt(t.progress),
    progressText: o(t.progress_text)
  };
}
function Ye(t) {
  if (!t)
    return;
  const e = o(t.event).toLowerCase(), n = he(
    t.result_mode || t.display_mode
  );
  if (e !== "result_card" && n === "inline" || e !== "result_card" && !d(t.result) && !o(t.result_mode || t.display_mode))
    return;
  const r = d(t.result) ? z(t.result) : z(t);
  return {
    id: o(t.result_id || r.result_id),
    title: o(t.title || r.title) || "最终结果",
    mode: e === "result_card" ? "artifact" : he(
      t.result_mode || t.display_mode || r.result_mode
    ),
    result: r,
    tasks: br(t.tasks || r.tasks),
    progress: Qt(t.progress),
    progressText: o(t.progress_text)
  };
}
function yo(t, e, n) {
  const r = bo(e, n);
  if (!r)
    return t;
  const s = Fe(e, n), a = t || {
    ...Ze(s),
    title: "能力生成结果"
  }, u = hr(a, r, s);
  return {
    ...u,
    title: a.title || "能力生成结果",
    progress: r.progress ?? u.progress,
    progressText: r.text || u.progressText
  };
}
function bo(t, e) {
  const n = d(t.meta) ? t.meta : {};
  if (o(n.action).toLowerCase() !== "call_power")
    return null;
  const s = o(n.power || t.meta?.power).trim(), a = o(t.event).toLowerCase(), u = o(t.error).trim(), p = Ao(t), y = u ? "failed" : p || a === "final" ? "succeeded" : "running";
  return {
    id: Fe(t, e),
    placeholderID: Fe(t, e),
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
function Ao(t) {
  const e = o(t.event).toLowerCase();
  if (!Er(t) && e !== "final")
    return;
  const n = z({
    ...t,
    event: "final"
  });
  return be(n) ? void 0 : n;
}
function Fe(t, e) {
  const n = d(t.meta) ? t.meta : {}, r = o(
    n.power || t.power
  ).trim();
  return [o(e?.request_id).trim(), r || "power"].filter(Boolean).join(":") || "power-action";
}
function We(t, e) {
  return e ? t ? {
    id: e.id || t.id,
    title: e.title || t.title,
    mode: e.mode || t.mode,
    result: e.result || t.result,
    tasks: xr(t.tasks, e.tasks),
    progress: e.progress ?? t.progress,
    progressText: e.progressText || t.progressText
  } : {
    ...e,
    mode: e.mode || "artifact",
    tasks: yr(e.tasks)
  } : t;
}
function hr(t, e, n) {
  const r = t || Ze(n);
  return e ? {
    ...r,
    tasks: xr(r.tasks, [e])
  } : r;
}
function _o(t, e, n, r) {
  const s = t || Ze(e), a = s.progress == null ? r : r == null ? s.progress : Math.max(s.progress, r);
  return {
    ...s,
    progress: a,
    progressText: n || s.progressText
  };
}
function Ze(t) {
  return {
    id: t,
    title: "最终结果",
    mode: "artifact",
    tasks: [],
    progress: null,
    progressText: ""
  };
}
function xr(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.forEach((r) => n.set(r.id, r)), e.forEach((r) => {
    const s = n.get(r.id);
    n.set(r.id, s ? So(s, r) : r);
  }), yr([...n.values()]);
}
function So(t, e) {
  const n = t.progress, r = e.progress, s = n == null ? r : r == null ? n : Math.max(n, r), a = qn(t.status), u = qn(e.status), p = a > u;
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
function qn(t) {
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
function yr(t) {
  return [...t].sort((e, n) => e.sort - n.sort);
}
function br(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(Ar).filter((n) => n != null).sort((n, r) => n.sort - r.sort);
}
function Ar(t) {
  if (!d(t))
    return null;
  const e = o(t.id || t.task_id || t.taskId).trim(), n = o(
    t.placeholder_id || t.placeholderId || e
  ).trim(), r = e || n;
  if (!r)
    return null;
  const s = d(t.meta) ? t.meta : {}, a = d(t.output) ? t.output : d(s.output) ? s.output : void 0, u = a ? z(a) : void 0;
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
function Sr(t) {
  const e = Xt(t);
  if (e)
    return ko(e) && e.result ? Zn(e.result, e.tasks) : void 0;
  if (t.running || t.interaction)
    return;
  if (!t.output)
    return t.text ? jn(t.text) : void 0;
  if (t.output.finalOutput) {
    const r = z(
      t.output.finalOutput,
      t.text
    );
    return o(r.event).toLowerCase() === "interaction" || be(r) ? void 0 : r;
  }
  const n = [];
  return t.output.text && !Xe(t.output.text) && n.push(jn(t.output.text)), n;
}
function jn(t) {
  const e = Es(t);
  return z({
    text: e,
    content: {
      format: "markdown",
      text: e
    }
  });
}
function wo(t) {
  return !!(t && wr(t) === "artifact");
}
function ko(t) {
  return !!(t && wr(t) === "inline");
}
function wr(t) {
  return he(t.mode);
}
function he(t) {
  return o(t).trim().toLowerCase() === "inline" ? "inline" : "artifact";
}
function kr(t, e) {
  if (t.running || t.error || t.interaction || !e)
    return [];
  const n = t.output?.finalOutput ? z(t.output.finalOutput, t.text) : z({ text: t.text }), r = Qo(
    n.suggestions || n.meta?.suggestions
  );
  return r.length > 0 ? r : [];
}
function Do(t) {
  const e = t.output?.finalOutput || {};
  return Nr(e.memory_review);
}
function No(t) {
  const e = t.data?.skillDraftPatch;
  if (!d(e))
    return null;
  const n = o(e.status).trim();
  return n !== "saving" && n !== "saved" && n !== "failed" ? null : {
    status: n,
    draft_id: C(e, "draft_id", "draftId", "id") || void 0,
    message: o(e.message)
  };
}
function Vn(t) {
  return (Array.isArray(t) ? t : []).map(Dr).filter((n) => n != null);
}
function Dr(t) {
  if (!d(t))
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
function qe(t) {
  return t.status !== 2;
}
function vo(t, e) {
  let n = !1;
  const r = t.map((s) => s.id !== e.id ? s : (n = !0, e));
  return n ? r : [e, ...r];
}
function Po(t) {
  return {
    working: "工作记忆",
    episodic: "事件记忆",
    semantic: "语义记忆",
    procedural: "流程记忆",
    persona: "人格记忆",
    content: "内容记忆"
  }[t] || "长期记忆";
}
function Co(t) {
  return {
    global: "全局",
    agent: "智能体",
    context: "当前上下文",
    session: "当前会话"
  }[t] || t;
}
function Mo(t) {
  return {
    manual: "手动",
    auto: "自动",
    llm: "模型抽取"
  }[t] || "自动";
}
function Nr(t) {
  if (!d(t))
    return null;
  const e = o(t.status);
  if (!e)
    return null;
  const n = d(t.memory) ? t.memory : {};
  return {
    status: e,
    type: o(t.type),
    text: o(t.text),
    source_message_id: Number(t.source_message_id || 0) || void 0,
    title: o(t.title || n.title),
    content: o(t.content || n.content),
    reason: o(t.reason),
    existing: d(t.existing) ? t.existing : void 0,
    error: o(t.error)
  };
}
function Oo(t, e) {
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
function z(t, e = "") {
  const n = { ...t };
  delete n.reasoning;
  const r = Fo(
    o(n.text) || e
  );
  if (r)
    return $o(
      n,
      r.payload,
      r.cleanText
    );
  const s = Bo(
    o(n.text) || e
  );
  if (s) {
    Tr(n);
    const u = Hn(s.payload.content);
    u && Oe(n, u), Oe(n, s.payload);
    const p = Gt(s.payload) || s.cleanText;
    return p ? n.text = p : delete n.text, n.kind = Or(
      o(
        s.payload.kind || s.payload.type || s.payload.event
      )
    ), n.suggestions = s.payload.suggestions, n.content = u || s.payload.content, n.tasks = s.payload.tasks || u?.tasks, n;
  }
  const a = Hn(n.content);
  if (a && (n.content = a), d(n.content) && Oe(n, n.content), !o(n.text)) {
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
  Tr(t);
  const r = Mr(e), s = o(e.power || e.name).trim(), a = o(e.tool || e.name).trim(), u = r === "call_power" ? `能力调用：${s || "未指定能力"}` : `工具调用：${a || "未指定工具"}`, p = n || "智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。";
  return t.event = "result_card", t.kind = "tool_result", t.title = u, t.text = p, t.result_mode = "artifact", t.result = {
    title: u,
    text: p
  }, t.meta = {
    ...d(t.meta) ? t.meta : {},
    action: r,
    power: s,
    tool: a,
    input: e.input || e.params || e.arguments
  }, r === "call_power" && (t.tasks = [
    {
      id: Lo(e),
      title: u,
      kind: o(e.kind || s).trim(),
      power: s,
      status: "pending",
      text: "等待能力执行结果",
      input: e.input || e.params || e.arguments
    }
  ]), t;
}
function Lo(t) {
  const e = o(
    t.id || t.task_id || t.power || t.name
  ).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return e ? `action-${e}` : "action-call-power";
}
function Tr(t) {
  const e = t;
  Ke.forEach((n) => {
    delete e[n];
  }), delete e.content;
}
function be(t) {
  const e = o(t.event).toLowerCase();
  return ["start", "progress", "status", "reasoning", "warning"].includes(e) ? !0 : Xe(o(t.text)) ? !Er(t) : !1;
}
function Xe(t) {
  const e = o(t).trim();
  return e ? !!(e.includes("```agent-interaction") || e.includes("```agent-action") || e.includes("```agent-result") || e.includes("```agent-output")) : !1;
}
function Bo(t) {
  for (const n of ["agent-result", "agent-output", "json"]) {
    const r = Vo(t, n);
    if (r)
      return r;
  }
  const e = Ir(t);
  if (e)
    return {
      cleanText: "",
      payload: e
    };
}
function Fo(t) {
  const e = qo(t, "agent-action");
  if (e)
    return e;
  const n = Rr(t);
  return n ? { cleanText: "", payload: n } : void 0;
}
function qo(t, e) {
  const n = `\`\`\`${e}`, r = t.indexOf(n);
  if (r < 0)
    return;
  let s = r + n.length;
  for (; s < t.length && Pr(t[s]); )
    s += 1;
  const a = t.indexOf("```", s), u = a < 0 ? t.slice(s) : t.slice(s, a), p = Rr(u);
  return p ? {
    cleanText: a < 0 ? t.slice(0, r).trim() : `${t.slice(0, r)}${t.slice(a + 3)}`.trim(),
    payload: p
  } : void 0;
}
function Rr(t) {
  const e = t.trim(), n = vr(e), r = jo(n), s = [e, n, r];
  for (const a of s)
    if (a.trim())
      try {
        const u = JSON.parse(a);
        if (Cr(u))
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
  for (; s < t.length && Pr(t[s]); )
    s += 1;
  let a = s;
  for (; a < t.length; ) {
    const u = t.indexOf("```", a);
    if (u < 0)
      return;
    const p = Ir(t.slice(s, u));
    if (p)
      return {
        cleanText: `${t.slice(0, r)}${t.slice(u + 3)}`.trim(),
        payload: p
      };
    a = u + 3;
  }
}
function Ir(t) {
  const e = t.trim(), n = vr(e), r = n === e ? [e] : [e, n];
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
function vr(t) {
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
function Pr(t) {
  return t === " " || t === "	" || t === "\r" || t === `
`;
}
function Go(t) {
  if (!d(t) || Cr(t))
    return !1;
  const e = Or(
    o(t.kind || t.type || t.event)
  );
  return e === "final_result" || e === "tool_result" || "content" in t || "tasks" in t || "suggestions" in t || xe(t) || d(t.content) && xe(t.content);
}
function Cr(t) {
  if (!d(t))
    return !1;
  const e = Mr(t);
  return e ? e === "call_power" ? !!o(t.power || t.name).trim() : !!o(t.tool || t.name).trim() : !1;
}
function Mr(t) {
  const e = o(t.type || t.action).toLowerCase().trim();
  return e === "power" ? "call_power" : e === "tool" ? "call_tool" : e === "call_power" || e === "call_tool" ? e : "";
}
function Or(t) {
  const e = t.toLowerCase().trim();
  return ["tool", "tool_result", "call_power", "power_result"].includes(e) ? "tool_result" : ["final", "result", "final_result", "answer"].includes(e) ? "final_result" : e || "final_result";
}
function Gt(t) {
  if (!d(t))
    return typeof t == "string" ? o(t) : "";
  if (o(t.text))
    return o(t.text);
  const e = t.content;
  return d(e) ? o(e.text) : typeof e == "string" ? o(e) : "";
}
function Hn(t) {
  if (d(t))
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
      return [Un(e.trim())];
    if (!d(e))
      return [];
    if (o(e.type) === "text") {
      const r = o(e.text).trim();
      return r ? [Un(r)] : [];
    }
    return [e];
  }) : [];
}
function Un(t) {
  return {
    type: "paragraph",
    content: [{ type: "text", text: t }]
  };
}
function Wo(t) {
  const e = [];
  return t.forEach((n) => je(n, e)), e.join(`

`).trim();
}
function je(t, e) {
  if (Array.isArray(t)) {
    t.forEach((n) => je(n, e));
    return;
  }
  if (d(t)) {
    if (o(t.type) === "text") {
      const n = o(t.text).trim();
      n && e.push(n);
      return;
    }
    je(t.content, e);
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
  Ke.forEach((r) => {
    const s = e[r];
    Yt(s) && (n[r] = s);
  }), !Yt(t.rich) && d(e.value) && (t.rich = e.value);
}
function xe(t) {
  return Ke.some((e) => Yt(t[e])) || d(t.value);
}
function Er(t) {
  const e = d(t.content) ? t.content : null;
  return xe(t) || Yt(t.error) || e != null && (xe(e) || Yt(e.text));
}
function Yt(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim().length > 0 : Array.isArray(t) ? t.length > 0 : d(t) ? Object.keys(t).length > 0 : !0;
}
function Qo(t) {
  return (Array.isArray(t) ? t : t == null ? [] : [t]).map(ta).filter((n) => n != null).slice(0, 5);
}
function ta(t) {
  if (!d(t)) {
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
  return /* @__PURE__ */ l(rr, { open: t, onOpenChange: u, children: /* @__PURE__ */ m(
    sr,
    {
      "data-assistant-layer": "true",
      layerClassName: He,
      layerZIndex: Ue,
      className: "flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
      children: [
        /* @__PURE__ */ m(or, { className: "border-b px-5 py-4 text-start", children: [
          /* @__PURE__ */ l(ar, { children: y }),
          /* @__PURE__ */ l(ir, { children: b })
        ] }),
        /* @__PURE__ */ l("div", { className: "min-h-0 overflow-hidden", children: /* @__PURE__ */ l(
          gi,
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
function Qe(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.some(Qe) : d(t) ? Object.keys(t).length > 0 : !0;
}
function Ve(t) {
  if (!(!d(t) || !o(t.type)))
    return t;
}
function Kt(t) {
  if (d(t))
    return Ve(t.interaction) || (d(t.content) ? Ve(t.content.interaction) : void 0);
}
export {
  Pa as ShowAgent
};
