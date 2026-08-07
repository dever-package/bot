import { c as Ss, j as l, a as m, F as Ee } from "./createLucideIcon-fWv1XcFy.js";
import { g as xe, x as ws, b as N, e as mt, d as Y, i as rt, o as ks, c as gt, r as Ds } from "./runtime-entry-ClkZDmNs.js";
import { L as ct } from "./vanilla-BSPxkY5-.js";
import { B as Ns } from "./brain-C0oaiNVY.js";
import { E as Kn } from "./external-link-CBYzs7jk.js";
import { H as Ts } from "./history-BnF8Oyah.js";
import { P as Rs } from "./pencil-DsS_UhAq.js";
import { R as Rn } from "./content-api-CuR5pbI7.js";
import { R as Is } from "./rotate-ccw-BOBeflIt.js";
import { S as vs } from "./save-kV_dHGFf.js";
import { S as Ps } from "./send-BiLChpK4.js";
import { S as Cs } from "./square-Ds__aRY5.js";
import { T as Gn } from "./trash-2-C2PWG3er.js";
import { X as Ms } from "./in-flight-request-CXY2yBH9.js";
import { m as Os, u as ue } from "./content-view-BXwDWBA5.js";
import { a as G, r as ze, A as Es, m as Jn, c as zs, b as $s } from "./skill-draft-patch-CajVOQis.js";
import { m as Yn } from "./reference-B-56qkaz.js";
import { a as It, m as Wn } from "./stream-B1l_qwg7.js";
import { m as Ls } from "./store-Qy-gDmQw.js";
import { m as Bs } from "./runtime-stream-runner-DadR9qgq.js";
import { m as Fs } from "./utils-CHRiz5MX.js";
import { m as qs } from "./button-D8VCR9tT.js";
import { m as Wt } from "./dialog-Bzy9HxZl.js";
import { m as js } from "./input-CpVa-RSd.js";
import { m as Vs } from "./textarea-ICqTPa3p.js";
import Hs from "./interaction-panel-Cqu34wUb.js";
import { m as st } from "./stream-timing-xZXCx8RF.js";
import { m as Zt } from "./sheet-BoiQVZ1M.js";
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
], Ks = Ss("message-square-plus", Us), me = xe("@/components/assistant/reference-picker");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/assistant/reference-picker");
const $e = xe("@/components/energon/progress");
if (!$e || Object.keys($e).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/progress");
const At = Wn.streamValueText, et = It.isPlainRecord, Gs = st.StreamTimingBadge, Js = Os.EnergonContentView, Ys = $e.EnergonProgressBlock, Ws = Zt.Sheet, Zs = Zt.SheetContent, Xs = Zt.SheetDescription, Qs = Zt.SheetHeader, ti = Zt.SheetTitle;
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
  const e = At(t).trim();
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
  const n = At(t.type), r = { ...t };
  if (n === "agentAbilityPlaceholder" || n === "agentTaskPlaceholder") {
    const s = et(t.attrs) ? { ...t.attrs } : {}, a = At(
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
  const r = Qn(t.output);
  if (r.length > 0)
    return r;
  const s = tr(t.output);
  return s ? er(s) : [];
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
function Qn(t) {
  const e = et(t.content) ? t.content : {}, n = et(t.rich) ? t.rich : et(e.rich) ? e.rich : null;
  return !n || At(n.type) !== "doc" || !Array.isArray(n.content) ? [] : n.content.filter(
    (r) => et(r)
  );
}
function tr(t) {
  const e = et(t.content) ? t.content : {}, n = t;
  return At(
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
      const r = At(t[n]).trim();
      if (r)
        return [r];
    }
  const e = At(t).trim();
  return e ? [e] : [];
}
function ai(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  return t.forEach((r) => {
    const s = r.trim();
    !s || e.has(s) || (e.add(s), n.push(s));
  }), n;
}
const ci = Jn.runAgentStream, li = Jn.stopAgentStream, ui = Yn.assistantReferencePayload, di = Yn.buildAssistantReferenceMessage, nr = $s.reloadStorePageSchema, Le = It.isEmptyRuntimeOutput, f = It.isPlainRecord, Rt = It.normalizeRuntimeFrameOutput, fi = It.resolveRuntimeFrameCancelable, W = It.runtimeErrorMessage, lt = Ls.getStoreValueByPath, o = Wn.streamValueText, pi = Bs.watchRuntimeStream, Jt = Fs.cn, z = qs.Button, rr = Wt.Dialog, sr = Wt.DialogContent, ir = Wt.DialogDescription, or = Wt.DialogHeader, ar = Wt.DialogTitle, mi = js.Input, cr = Vs.Textarea, gi = Hs.AgentInteractionPanel, hi = me.AssistantReferenceList, xi = me.AssistantReferencePicker, yi = st.cancelStreamTiming, bi = st.StreamTimingBadge, Ai = st.createRuntimeStreamTiming, lr = st.createStreamTiming, Pe = st.finishStreamTiming, _i = st.isStreamTimingStatusOutput, Si = st.markStreamTimingStopping, wi = st.updateStreamTimingFromOutput, ki = st.useStreamClock, He = "z-[100]", Ue = 1e3, ur = 3, vn = "/bot/admin/agent/run", Di = "/bot/admin/agent/run_status", Ni = zi(
  "@/components/assistant/session-history-dialog",
  "AssistantSessionHistoryDialog"
), Pn = xe(
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
  const n = ws(), [r, s] = N([]), [a, u] = N(""), [p, y] = N([]), [b, v] = N(""), [S, B] = N(""), [R, J] = N(0), [F, M] = N(!1), [vt, ut] = N(!1), [ht, Pt] = N(!1), [Ct, Mt] = N(!1), [_t, x] = N([]), [Z, L] = N(!1), [St, it] = N(""), [A, te] = N(!1), [tn, Ot] = N(!1), [be, Et] = N(!1), [en, H] = N(""), [nn, ee] = N("0-0"), [zr, zt] = N(!1), [Ae, $t] = N(""), [_e, ne] = N(""), wt = mt(0), Se = mt(null), we = mt(""), ke = mt(""), rn = mt(""), ot = mt(0), sn = mt(/* @__PURE__ */ new Set()), on = mt(!1), De = Y(() => {
    const i = Se.current;
    i && Cn(i);
  }, []), w = ue(
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
  ), an = String(t.meta?.requestApi || vn), cn = String(t.meta?.streamApi || "/bot/admin/agent/stream"), ln = String(t.meta?.stopApi || "/bot/admin/agent/stop"), Ne = Object.prototype.hasOwnProperty.call(
    t.meta || {},
    "runStatusApi"
  ) ? String(t.meta?.runStatusApi || "") : an === vn ? Di : "", $r = String(
    t.meta?.paramApi || "/bot/admin/energon/power_params"
  ), P = !!t.meta?.sessionEnabled, re = P && t.meta?.historyEnabled !== !1, Lr = t.meta?.newSessionEnabled !== !1, dt = P && Ct, se = String(
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
  ), jr = t.meta?.skillDraftPatchAutoApply !== !1, U = ue(
    e,
    () => qi(t.meta?.sessionContext, e, w)
  ), yn = Number(t.meta?.blockMs || 1e3), bn = String(t.meta?.initialInput || ""), Vr = String(
    t.meta?.placeholder || "输入本轮任务，当前弹窗内的上下文会一起发送。"
  ), Hr = String(t.meta?.emptyText || ""), Ur = o(t.meta?.height || t.meta?.containerHeight).trim() || "min(calc(85vh - 11rem), 620px)", oe = rt(
    () => [...r].reverse().find(
      (i) => i.role === "assistant" && i.interaction && !i.interactionAnswered
    ),
    [r]
  ), Lt = oe?.id || "", Bt = rt(() => Ae && r.find(
    (i) => i.id === Ae && i.role === "assistant" && !!i.interaction
  ) || oe, [Ae, r, oe]), ft = rt(() => {
    if (_e)
      return r.find(
        (i) => i.id === _e && i.role === "assistant"
      );
  }, [r, _e]), Te = rt(
    () => ft ? Xt(ft) : null,
    [ft]
  ), Kr = !!ft?.running, An = rt(
    () => ft ? kr(
      ft,
      !!Te
    ) : [],
    [Te, ft]
  ), X = rt(
    () => r.some(
      (i) => i.role === "assistant" && !!i.running
    ),
    [r]
  ), Gr = rt(
    () => (a.trim().length > 0 || p.length > 0) && w.length > 0 && !F && !A && !X,
    [
      w,
      X,
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
    () => _t.filter(qe).length,
    [_t]
  );
  ks(() => {
    if (!ae || ae === we.current)
      return;
    we.current = ae;
    const i = Se.current;
    if (i)
      return Cn(i);
  }, [ae]);
  const at = Y(() => {
    ot.current += 1, we.current = "", s([]), u(bn), y([]), v(""), B(""), wt.current = 0, J(0), Mt(!1), x([]), it(""), te(!1), Ot(!1), Et(!1), H(""), ee("0-0"), zt(!1), $t(""), ne(""), ut(!1), Pt(!1);
  }, [bn]), Ft = Y(
    (i) => {
      const c = f(i) ? i : {}, d = f(c.session) ? c.session : {}, g = Number(d.id || 0), _ = Number.isFinite(g) ? g : 0;
      wt.current = _, J(_), Mt(!!c.memory_enabled), s(Yi(c.messages)), x(Vn(c.memories)), De();
    },
    [De]
  ), qt = Y(
    async (i = !1) => {
      if (!(!P || !w)) {
        M(!0);
        try {
          const c = await G(
            i ? mn : se,
            {
              agent_key: w,
              context_key: U,
              title: xt ? `${xt} 会话` : "新会话",
              limit: 80
            }
          );
          Ft(c), H("");
        } catch (c) {
          H(W(c, "加载会话失败。"));
        } finally {
          M(!1);
        }
      }
    },
    [
      w,
      xt,
      Ft,
      mn,
      se,
      U,
      P
    ]
  ), Wr = async () => {
    if (!P || !R || A) {
      at();
      return;
    }
    M(!0);
    try {
      const i = await G(Br, {
        session_id: R
      });
      Ft(i);
    } catch (i) {
      H(W(i, "清空会话失败。"));
    } finally {
      M(!1);
    }
  }, Zr = Y(
    async (i) => {
      if (!re || !w)
        return so(i);
      const c = await G(un, {
        agent_key: w,
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
    [w, re, U, un]
  ), kt = Y(async () => {
    if (!dt || !w) {
      x([]);
      return;
    }
    L(!0);
    try {
      const i = R || wt.current, c = await G(gn, {
        agent_key: w,
        context_key: U,
        session_id: i || void 0,
        scope: "current",
        status: "all",
        page: 1,
        page_size: 50
      }), d = f(c) ? c : {};
      x(Vn(d.memories)), it(""), H("");
    } catch (i) {
      it(W(i, "加载长期记忆失败。"));
    } finally {
      L(!1);
    }
  }, [
    w,
    gn,
    dt,
    U,
    R
  ]), Xr = Y(() => {
    Pt(!0);
  }, []), Qr = Y(
    async (i, c) => {
      if (!dt || i <= 0)
        return;
      const d = R || wt.current, g = await G(hn, {
        id: i,
        ...c,
        agent_key: w,
        context_key: U,
        session_id: d || void 0
      }), _ = f(g) ? g : {}, h = Dr(_.memory);
      h ? x((I) => vo(I, h)) : await kt(), it("");
    },
    [
      w,
      kt,
      dt,
      U,
      R,
      hn
    ]
  ), ts = Y(
    async (i) => {
      !dt || i <= 0 || (await G(xn, { id: i }), x(
        (c) => c.map(
          (d) => d.id === i ? { ...d, status: 2 } : d
        )
      ), it(""));
    },
    [xn, dt]
  ), es = Y(
    async (i) => {
      await G(dn, {
        session_id: i
      });
    },
    [dn]
  ), ns = Y(
    async (i) => {
      await G(fn, {
        session_id: i
      });
    },
    [fn]
  ), rs = Y(
    async (i, c) => {
      const d = await G(pn, {
        session_id: i,
        title: c
      });
      return pr(
        f(d) ? d.session : null
      );
    },
    [pn]
  ), ss = async (i) => {
    if (!(!i || A)) {
      M(!0);
      try {
        const c = await G(se, {
          session_id: i,
          agent_key: w,
          context_key: U,
          limit: 80
        });
        Ft(c), ut(!1), H("");
      } catch (c) {
        H(W(c, "打开会话失败。"));
      } finally {
        M(!1);
      }
    }
  }, is = async () => {
    if (!P || A) {
      at();
      return;
    }
    at(), await qt(!0);
  }, os = async () => {
    if (!P)
      return 0;
    if (R > 0)
      return R;
    const i = await G(se, {
      agent_key: w,
      context_key: U,
      title: xt ? `${xt} 会话` : "新会话",
      limit: 80
    });
    Ft(i);
    const c = f(i) && f(i.session) ? i.session : {}, d = Number(c.id || 0);
    return Number.isFinite(d) ? d : 0;
  }, ce = async (i, c, d) => {
    if (!(!P || i <= 0))
      return await G(Fr, {
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
        output: d?.output || c.output || {},
        request_id: d?.requestID || c.requestID || "",
        status: d?.status || 1
      });
  }, as = async (i, c) => {
    const d = En(i);
    if (!d)
      return;
    const g = await Mn(
      Ne,
      d
    ).catch(() => null), _ = On(g, d);
    if (!_ || Number(_.status) === 2)
      return;
    const h = Rt(_?.output, _), I = Kt(h), k = Gt(h) || o(_?.msg), T = {
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
    !P || R <= 0 || r.forEach((i) => {
      const c = En(i);
      !c || sn.current.has(c) || (sn.current.add(c), as(i, R));
    });
  }, [r, Ne, P, R]), gt(() => {
    nt && (yt && !on.current && !A && at(), on.current = yt);
  }, [yt, nt, at, A]), gt(() => {
    at();
  }, [w, at]), gt(() => {
    !P || !w || nt && !yt || A || Lt || qt(!1);
  }, [
    w,
    qt,
    yt,
    nt,
    Lt,
    A,
    P
  ]), gt(() => {
    ht && kt();
  }, [kt, ht]), gt(() => {
    if (!P || !w || A || F || nt && !yt || !X)
      return;
    const i = window.setTimeout(() => {
      qt(!1);
    }, 2e3);
    return () => {
      window.clearTimeout(i);
    };
  }, [
    w,
    X,
    qt,
    yt,
    nt,
    A,
    P,
    F
  ]), gt(() => {
    Lt && ($t(Lt), zt(!0));
  }, [Lt]);
  const cs = (i) => {
    $t(i), zt(!0);
  }, ls = (i) => {
    zt(i), i || $t("");
  }, Sn = async () => {
    const i = p, c = a.trim() || (i.length > 0 ? "请根据参考资料和当前任务进行分析。" : "");
    if (!c || A || X)
      return;
    const d = ui(i);
    i.length > 0 && (y([]), v("")), await Re(
      {
        text: c,
        ...d ? { reference_files: d } : {}
      },
      {
        role: "user",
        text: di(c, i),
        kind: "chat",
        data: d ? { reference_files: d } : void 0
      },
      r
    );
  }, wn = async (i) => {
    const c = i.prompt.trim();
    !c || A || X || (ne(""), await Re(
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
    const c = Bt;
    if (!c?.interaction || c.interactionAnswered || A)
      return;
    const d = Qi(
      r,
      c.id,
      i.data
    );
    zt(!1), $t(""), await Re(
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
  }, Re = async (i, c, d, g = "", _) => {
    if (!w) {
      H("未选择智能体。");
      return;
    }
    let h = 0;
    if (P)
      try {
        h = await os();
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
      actionTiming: lr("等待智能体返回")
    }, j = po(d), Q = io(
      i,
      pe(t.meta?.inputContext, e)
    );
    h > 0 && (Q.assistant_session_id = h), ot.current = I, ke.current = "", s((D) => [...g ? D.map(
      (tt) => tt.id === g ? {
        ...tt,
        interactionAnswered: !0,
        interactionData: _
      } : tt
    ) : D, k, q]), De(), u(""), te(!0), Ot(!1), Et(!1), H(""), B(""), ee("0-0");
    try {
      await ce(h, k);
    } catch (D) {
      H(W(D, "保存用户消息失败。"));
    }
    let V = !1, K = "", O = "0-0", bt = !1, Dt = null;
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
          status: ur
        }
      ));
    }, Ie = (D, E, tt) => {
      (async () => (Dt && await Dt.catch(() => {
      }), await ce(h, D, {
        requestID: D.requestID || K || S,
        output: E,
        status: tt
      })))().then((pt) => xs(T, pt));
    };
    try {
      await ci({
        agent: w,
        input: Q,
        history: j,
        requestApi: an,
        streamApi: cn,
        stopApi: ln,
        blockMs: yn,
        onRequestID: (D) => {
          K = o(D), B(K), Vt(K);
        },
        onFrame: (D) => {
          if (ot.current !== I)
            return;
          const E = o(D?.stream_id);
          if (E && (O = E, ee(E)), Nn(T, D), kn(D, T), h > 0 && D?.type === "result" && !V) {
            V = !0;
            const tt = Rt(
              D?.output,
              D
            ), pt = Kt(tt), Ht = o(D?.request_id) || K || S, ve = Gt(tt) || o(D?.msg);
            Ie(
              {
                ...q,
                text: ve,
                output: {
                  text: ve,
                  finalOutput: $(
                    tt,
                    ve
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
        if (Be(E) ? await ds({
          activeSessionID: h,
          assistantMessage: q,
          requestID: K || S,
          lastID: O,
          streamApi: cn,
          runStatusApi: Ne,
          blockMs: yn,
          token: I,
          isAlreadySaved: () => V,
          markSaved: () => {
            V = !0;
          },
          applyFrame: (pt) => {
            const Ht = o(pt?.stream_id);
            Ht && (O = Ht, ee(Ht)), Nn(T, pt), kn(pt, T);
          },
          saveFinal: Ie
        }) : !1)
          return;
        H(E), As(T, E), h > 0 && !V && !Be(E) && (V = !0, Ie(
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
      ot.current === I && (te(!1), Ot(!1), Et(!1), _s(T));
    }
  }, ds = async ({
    activeSessionID: i,
    assistantMessage: c,
    requestID: d,
    lastID: g,
    streamApi: _,
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
    const V = (O) => {
      if (j(O), O?.type !== "result")
        return !1;
      if (i > 0 && !T()) {
        q();
        const bt = Rt(O?.output, O), Dt = Kt(bt), Vt = Gt(bt) || o(O?.msg);
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
            requestID: o(O?.request_id) || d
          },
          bt,
          Number(O.status) === 2 ? 2 : 1
        );
      }
      return Number(O.status) !== 2;
    };
    let K = !1;
    try {
      await pi({
        streamApi: _,
        requestID: d,
        lastID: g || "0-0",
        blockMs: I,
        transport: "poll",
        stopOnResult: !0,
        recoverOnError: !0,
        acceptErrorResult: !0,
        onFrame: (O) => {
          if (ot.current !== k)
            return !1;
          if (O?.type !== "result") {
            j(O);
            return;
          }
          return V(O), K = !0, !1;
        }
      });
    } catch {
      K = !1;
    }
    return K ? !0 : h ? await fs({
      runStatusApi: h,
      requestID: d,
      token: k,
      applyResultFrame: V
    }) : !1;
  }, fs = async ({
    runStatusApi: i,
    requestID: c,
    token: d,
    applyResultFrame: g
  }) => {
    const _ = Date.now() + Ti;
    let h = 0, I = 0;
    const k = /* @__PURE__ */ new Set();
    for (; ot.current === d && Date.now() < _ && I < Ii; ) {
      I += 1;
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
        k
      )) {
        const Q = o(j.stream_id);
        if (Q && k.add(Q), g(j))
          return !0;
      }
      const q = On(T, c);
      if (q)
        return g(q), !0;
      await Ei(Ri);
    }
    return !1;
  }, ps = async () => {
    if (!(!S || !tn || be)) {
      Et(!0), ys();
      try {
        await li(S, ln), ot.current += 1, te(!1), Ot(!1), bs();
      } catch (i) {
        H(W(i, "停止智能体失败。"));
      } finally {
        Et(!1);
      }
    }
  }, ms = (i) => {
    (i.metaKey || i.ctrlKey) && i.key === "Enter" && (i.preventDefault(), Sn());
  }, kn = (i, c) => {
    if (gs(i, c), i?.type !== "result" || t.meta?.reloadPageOnFinal !== !0 || Number(i.status) === 2)
      return;
    const d = Rt(i?.output, i), g = o(d.kind || d.type || d.event).trim().toLowerCase();
    if (g === "skill_draft_patch" && ie || !Oo(g, t.meta?.reloadPageOnFinalKinds))
      return;
    const _ = [i.request_id, i.stream_id, g].map(o).join(":");
    if (ke.current === _)
      return;
    ke.current = _;
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
    const d = Rt(i?.output, i), g = ze(d);
    if (!g)
      return;
    const _ = [i.request_id, i.stream_id, "skill_draft_patch"].map(o).join(":");
    if (rn.current === _)
      return;
    rn.current = _;
    const h = pe(
      t.meta?.skillDraftPatchContext,
      e
    ), I = {
      ...g,
      ...h,
      ...zn(
        P,
        R || wt.current,
        w,
        U
      )
    };
    Dn(c, I);
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
    }), G(ie, c).then(async (d) => {
      Vi(
        e,
        t.meta?.skillDraftPatchTargetPath,
        c,
        d
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
        d
      ), le(i, {
        status: "saved",
        draft_id: C(d, "draft_id", "draftId", "id") || C(c, "id", "draft_id", "draftId"),
        message: "技能已保存。"
      }), t.meta?.skillDraftPatchCloseOnSave === !0 && nt && e.getState().setValueByPath(nt, !1);
    }).catch((d) => {
      const g = W(d, "保存技能失败。");
      le(i, {
        status: "failed",
        message: g
      }), H(g);
    });
  }, hs = (i, c) => {
    if (!ie || !c)
      return;
    const d = ze(c);
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
    ), _ = {
      ...d,
      ...g,
      ...zn(
        P,
        R || wt.current,
        w,
        U
      )
    };
    Dn(i, _);
  }, Nn = (i, c, d) => {
    const g = Rt(c?.output, c);
    if (Le(g) && c?.type !== "result")
      return;
    const _ = fi(c);
    _ != null && Ot(_), jt(i, (h) => {
      const I = h.output || Ce, k = {
        text: I.text,
        finalOutput: I.finalOutput
      }, T = Je(g), q = Kt(g);
      if (c?.type !== "result" && gr(T))
        return ho(h, g, c);
      let j = h.actionTiming;
      _i(g) && (j = wi(j, g));
      const Q = yo(
        h.resultDetail,
        g,
        c
      );
      if (c?.type === "result") {
        let V = Le(g) ? $({
          text: k.text || o(c?.msg)
        }) : g;
        ye(V) && k.text.trim() && (V = $({
          ...V,
          event: "final",
          text: k.text
        })), k.finalOutput = V;
        const K = o(V.text) || k.text, O = We(
          Q,
          Ye(V)
        );
        return {
          ...h,
          text: K,
          interaction: q || h.interaction,
          output: k,
          resultDetail: O,
          running: !1,
          requestID: o(c?.request_id) || h.requestID,
          actionTiming: Pe(
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
  }, xs = (i, c) => {
    const d = f(c) && f(c.message) ? c.message : {}, g = f(d.output) ? d.output : {}, _ = Nr(g.memory_review);
    _ && Ct && (jt(i, (h) => ({
      ...h,
      output: {
        ...h.output || Ce,
        finalOutput: {
          ...h.output?.finalOutput || {},
          memory_review: _
        }
      }
    })), kt());
  }, Tn = (i) => {
    s(
      (c) => c.map(
        (d) => d.role === "assistant" && d.running ? i(d) : d
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
    jt(i, (d) => ({
      ...d,
      error: c,
      running: !1,
      actionTiming: Pe(d.actionTiming, "failed")
    }));
  }, _s = (i) => {
    jt(i, (c) => ({
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
            ref: Se,
            className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3",
            children: [
              r.length === 0 ? /* @__PURE__ */ l("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: Hr || `输入一次任务开始测试${xt ? `「${xt}」` : "智能体"}。` }) : null,
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
                          memoryEnabled: Ct,
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
            open: !!Bt?.interaction && zr,
            interaction: Bt?.interaction,
            paramApi: $r,
            readonly: !!Bt?.interactionAnswered,
            initialData: Bt?.interactionData,
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
            open: !!ft,
            detail: Te,
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
            open: vt,
            onOpenChange: ut,
            agentKey: w,
            contextKey: U,
            activeSessionID: R,
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
        dt ? /* @__PURE__ */ l(
          co,
          {
            open: ht,
            memories: _t,
            loading: Z,
            error: St,
            disabled: A || F,
            onOpenChange: Pt,
            onRefresh: kt,
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
              disabled: A || X,
              onRemove: (i) => y(
                (c) => c.filter((d, g) => g !== i)
              )
            }
          ) }) : null,
          /* @__PURE__ */ l(
            cr,
            {
              value: a,
              disabled: A || X,
              placeholder: Vr,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (i) => u(i.target.value),
              onKeyDown: ms
            }
          ),
          /* @__PURE__ */ m("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ l("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: S ? `RequestID: ${S}${nn !== "0-0" ? ` / ${nn}` : ""}` : X ? "智能体正在执行，结果会自动同步。" : b || (P ? F ? "正在加载历史会话。" : R ? "会话已保存，刷新后可继续。" : "本次会话会保存到后台。" : "关闭弹窗后会清空本次测试上下文。") }),
            /* @__PURE__ */ m("div", { className: "flex shrink-0 items-center gap-2", children: [
              dt ? /* @__PURE__ */ m(
                z,
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
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: A || F,
                  onClick: () => ut(!0),
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
                  disabled: A || X,
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
                  disabled: A || F,
                  onClick: () => P ? void Wr() : at(),
                  children: [
                    /* @__PURE__ */ l(Gn, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              Lr ? /* @__PURE__ */ m(
                z,
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
                z,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !tn || be,
                  onClick: () => {
                    ps();
                  },
                  children: [
                    be ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Cs, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              /* @__PURE__ */ m(
                z,
                {
                  type: "button",
                  size: "sm",
                  disabled: !Gr,
                  onClick: () => {
                    Sn();
                  },
                  children: [
                    A || X ? /* @__PURE__ */ l(ct, { className: "size-4 animate-spin" }) : /* @__PURE__ */ l(Ps, { className: "size-4" }),
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
  if (!f(n))
    return {};
  const r = Number(n.status || 0), s = Number(n.code || 0);
  if (r === 2 || s === 401)
    throw new Error(o(n.msg || n.message) || "请求失败");
  return f(n.data) ? n.data : {};
}
function On(t, e) {
  const n = f(t?.run) ? t.run : {}, r = o(n.status).toLowerCase();
  if (!dr(r))
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
  const n = f(t) ? t : {}, r = f(n.payload) ? n.payload : f(t) ? t : {}, s = f(r.output) ? r.output : {}, a = Je(s), u = o(r.type || "stream").toLowerCase();
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
  const n = f(t.output) ? t.output : {}, r = Ye(n);
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
  const n = xe(t)?.[e];
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
  const s = C(
    { id: lt(e, r) },
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
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = f(n.patch) ? n.patch : {}, u = lt(t, s), p = f(u) ? u : {}, y = f(r.draft) ? r.draft : {}, b = {
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
  const a = o(e).trim() || "data.table.list", u = lt(t, a);
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
  const v = u.map((S) => f(S) && C(S, "id") === y ? (b = !0, { ...S, ...p }) : S);
  b || (v.unshift(p), Ki(t, a)), t.getState().setValueByPath(a, v);
}
function Ui(t, e, n, r) {
  const s = o(e).trim() || "data.actionTarget.draftAgent", a = lt(t, s), u = f(a) ? a : {}, p = f(r.draft) ? r.draft : {}, y = f(n.patch) ? n.patch : {};
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
  const r = Number(lt(t, n));
  Number.isFinite(r) && t.getState().setValueByPath(n, r + 1);
}
function fr(t) {
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
function de(t, e, n, ...r) {
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
  if (f(n) || Array.isArray(n))
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
  if (!f(t))
    return null;
  const n = o(t.role) === "user" ? "user" : "assistant", r = Number(t.status || 0) === ur, s = o(t.text) || (r ? "智能体正在处理..." : ""), a = f(t.content) ? t.content : {}, u = f(t.output) ? t.output : {}, p = o(a.kind || t.kind), y = r ? lr("等待智能体返回") : Zi(t, u), b = {
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
  const v = Ve(a.interaction) || Kt(u);
  return v && (b.interaction = v, b.interactionAnswered = !!a.interaction_answered, f(a.interaction_data) && (b.interactionData = a.interaction_data)), b;
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
  const e = f(t.result) ? t.result : {}, n = f(t.content) ? t.content : {}, r = f(e.content) ? e.content : {};
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
  return (Array.isArray(t) ? t : []).map(pr).filter((n) => !!n);
}
function pr(t) {
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
  const b = Xt(t), v = !!t.interaction, S = !v && wo(b), B = Sr(t), R = S || Qe(B), J = kr(t, R), F = t.interaction ? o(t.interaction.title) || "补充交互信息" : "", M = t.interaction ? o(t.interaction.description) : "", vt = No(t), ut = t.output?.finalOutput ? ze(t.output.finalOutput) : null, ht = !!(t.actionTiming && !S);
  return /* @__PURE__ */ m("div", { className: "space-y-2", children: [
    ht ? /* @__PURE__ */ m("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ l(Fn, { message: t, hasOutput: R }),
      /* @__PURE__ */ l(bi, { timing: t.actionTiming, now: e })
    ] }) : /* @__PURE__ */ l(Fn, { message: t, hasOutput: R }),
    S && b ? /* @__PURE__ */ l(
      ei,
      {
        detail: b,
        running: !!t.running,
        timing: t.actionTiming,
        now: e,
        onOpen: a
      }
    ) : R ? /* @__PURE__ */ l(Es, { output: B }) : null,
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
        /* @__PURE__ */ l("span", { className: "block truncate text-foreground", children: t.interactionAnswered ? "交互信息已提交。" : F }),
        M ? /* @__PURE__ */ l("span", { className: "block truncate", children: M }) : null
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
      mr,
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
  const [b, v] = N(0), [S, B] = N({ title: "", content: "" }), [R, J] = N(0), [F, M] = N("");
  gt(() => {
    t || (v(0), B({ title: "", content: "" }), J(0), M(""));
  }, [t]);
  const vt = (x) => {
    v(x.id), B({ title: x.title, content: x.content }), M("");
  }, ut = async () => {
    if (b <= 0)
      return;
    const x = S.title.trim(), Z = S.content.trim();
    if (!x || !Z) {
      M("标题和内容不能为空。");
      return;
    }
    J(b);
    try {
      await p(b, { title: x, content: Z }), v(0), B({ title: "", content: "" }), M("");
    } catch (L) {
      M(W(L, "保存长期记忆失败。"));
    } finally {
      J(0);
    }
  }, ht = async (x, Z) => {
    J(x);
    try {
      await p(x, { status: Z }), M("");
    } catch (L) {
      M(W(L, "更新长期记忆失败。"));
    } finally {
      J(0);
    }
  }, Pt = async (x) => {
    J(x);
    try {
      await y(x), b === x && v(0), M("");
    } catch (Z) {
      M(W(Z, "停用长期记忆失败。"));
    } finally {
      J(0);
    }
  }, Ct = () => {
    v(0), B({ title: "", content: "" }), M("");
  }, Mt = e.filter(qe).length, _t = e.length - Mt;
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
            Mt,
            " 条",
            _t > 0 ? `，已停用 ${_t} 条` : ""
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
                n ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Rn, { className: "size-3.5" }),
                "刷新"
              ]
            }
          )
        ] }),
        r || F ? /* @__PURE__ */ l("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: F || r }) : null,
        /* @__PURE__ */ l("div", { className: "max-h-[56vh] space-y-2 overflow-y-auto pr-1", children: n && e.length === 0 ? /* @__PURE__ */ m("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: [
          /* @__PURE__ */ l(ct, { className: "mr-2 size-4 animate-spin" }),
          "正在加载长期记忆"
        ] }) : e.length === 0 ? /* @__PURE__ */ l("div", { className: "flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", children: "当前上下文还没有长期记忆。" }) : e.map((x) => {
          const Z = b === x.id, L = R === x.id, St = qe(x);
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
                    /* @__PURE__ */ l("span", { className: "rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground", children: Po(x.kind) }),
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
                      Mo(x.source),
                      " / 重要度",
                      " ",
                      x.importance
                    ] })
                  ] }),
                  Z ? /* @__PURE__ */ m("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ l(
                      mi,
                      {
                        value: S.title,
                        disabled: L,
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
                        disabled: L,
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
                /* @__PURE__ */ l("div", { className: "flex shrink-0 flex-wrap items-center gap-1 sm:justify-end", children: Z ? /* @__PURE__ */ m(Ee, { children: [
                  /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || L,
                      onClick: () => {
                        ut();
                      },
                      children: [
                        L ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(vs, { className: "size-3.5" }),
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
                      disabled: L,
                      onClick: Ct,
                      children: /* @__PURE__ */ l(Ms, { className: "size-3.5" })
                    }
                  )
                ] }) : /* @__PURE__ */ m(Ee, { children: [
                  /* @__PURE__ */ m(
                    z,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "h-8 px-2",
                      disabled: s || L,
                      onClick: () => vt(x),
                      children: [
                        /* @__PURE__ */ l(Rs, { className: "size-3.5" }),
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
                      disabled: s || L,
                      onClick: () => {
                        Pt(x.id);
                      },
                      children: [
                        L ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Gn, { className: "size-3.5" }),
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
                      disabled: s || L,
                      onClick: () => {
                        ht(x.id, 1);
                      },
                      children: [
                        L ? /* @__PURE__ */ l(ct, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ l(Rn, { className: "size-3.5" }),
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
        ] }) : a ? u : /* @__PURE__ */ m(Ee, { children: [
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
      ye(s) || (r.output = s);
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
  return e?.result ? $(e.result, t.text) : $(
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
  const e = f(t.result) ? $(t.result) : void 0, n = br(t.tasks);
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
function Ye(t) {
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
  const n = f(t.meta) ? t.meta : {};
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
  const n = $({
    ...t,
    event: "final"
  });
  return ye(n) ? void 0 : n;
}
function Fe(t, e) {
  const n = f(t.meta) ? t.meta : {}, r = o(
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
function Sr(t) {
  const e = Xt(t);
  if (e)
    return ko(e) && e.result ? Zn(e.result, e.tasks) : void 0;
  if (t.running || t.interaction)
    return;
  if (!t.output)
    return t.text ? jn(t.text) : void 0;
  if (t.output.finalOutput) {
    const r = $(
      t.output.finalOutput,
      t.text
    );
    return o(r.event).toLowerCase() === "interaction" || ye(r) ? void 0 : r;
  }
  const n = [];
  return t.output.text && !Xe(t.output.text) && n.push(jn(t.output.text)), n;
}
function jn(t) {
  const e = zs(t);
  return $({
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
  return ge(t.mode);
}
function ge(t) {
  return o(t).trim().toLowerCase() === "inline" ? "inline" : "artifact";
}
function kr(t, e) {
  if (t.running || t.error || t.interaction || !e)
    return [];
  const n = t.output?.finalOutput ? $(t.output.finalOutput, t.text) : $({ text: t.text }), r = Qo(
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
  if (!f(e))
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
function $(t, e = "") {
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
  Tr(t);
  const r = Mr(e), s = o(e.power || e.name).trim(), a = o(e.tool || e.name).trim(), u = r === "call_power" ? `能力调用：${s || "未指定能力"}` : `工具调用：${a || "未指定工具"}`, p = n || "智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。";
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
function ye(t) {
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
  if (!f(t) || Cr(t))
    return !1;
  const e = Or(
    o(t.kind || t.type || t.event)
  );
  return e === "final_result" || e === "tool_result" || "content" in t || "tasks" in t || "suggestions" in t || he(t) || f(t.content) && he(t.content);
}
function Cr(t) {
  if (!f(t))
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
  if (!f(t))
    return typeof t == "string" ? o(t) : "";
  if (o(t.text))
    return o(t.text);
  const e = t.content;
  return f(e) ? o(e.text) : typeof e == "string" ? o(e) : "";
}
function Hn(t) {
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
      return [Un(e.trim())];
    if (!f(e))
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
  if (f(t)) {
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
  }), !Yt(t.rich) && f(e.value) && (t.rich = e.value);
}
function he(t) {
  return Ke.some((e) => Yt(t[e])) || f(t.value);
}
function Er(t) {
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
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.some(Qe) : f(t) ? Object.keys(t).length > 0 : !0;
}
function Ve(t) {
  if (!(!f(t) || !o(t.type)))
    return t;
}
function Kt(t) {
  if (f(t))
    return Ve(t.interaction) || (f(t.content) ? Ve(t.content.interaction) : void 0);
}
export {
  Pa as ShowAgent
};
