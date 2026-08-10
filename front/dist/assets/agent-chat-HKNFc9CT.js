import { a, j as R, F as ze } from "./_commonjsHelpers-CTFd9u1x.js";
import { b as w, l as z, u as j, o as Z, d as Ae, q as De } from "./react-C7Xtl8sB.js";
import { z as Ht, T as Wt, y as Gt, x as It, L as Ce, b6 as Ut, b3 as Yt, j as Xt, a7 as Zt, ax as Jt, g as Qt, c as Kt, A as en, X as tn } from "./vendor-icons-Cc7Kl3It.js";
import { m as nn } from "./store-BMgfmVDY.js";
import { m as kt, a as We } from "./stream-Y1y6FALE.js";
import { m as Re } from "./utils-B_fxI2dk.js";
import { m as Ge } from "./button-CpfaQlDK.js";
import { m as re } from "./dialog-Oss_U0H4.js";
import { G as an, H as rn, I as he, J as X, K as Fe, L as sn } from "./vendor-assistant-BFRzuzys.js";
import { t as St, f as on, l as cn, g as ln, h as dn, i as un, j as xe, k as Ze, r as mn, m as gn, n as pn, o as fn, p as Je, c as hn, S as xn, A as bn, a as vn, q as wn, s as yn, d as Dn, u as In, e as kn, v as Sn, w as Cn } from "./interaction-view-yUCy8jJQ.js";
import { c as Mn } from "./preloadable-PCKj9Z7v.js";
import { m as An } from "./input-DLnnH2-7.js";
import { A as Ct, a as Me, c as Nn, b as Rn, d as Tn } from "./clipboard-B77WuM2Y.js";
import { m as Te } from "./runtime-stream-runner-BrsTPWU1.js";
import { c as Mt, d as En, q as Pn, s as Ln, o as Ee, l as _n, p as At, m as qn, t as On, u as Qe, n as Bn, v as $n, i as Ne, r as Nt, a as zn, k as Fn, w as Vn, j as jn, x as Hn, h as Wn } from "./interaction-CdOaiJOA.js";
import { m as Gn } from "./reference-composer-CvyqrYax.js";
function Un({
  controller: e,
  children: t
}) {
  const o = w(
    async (l) => {
      const d = l.content.filter((m) => m.type === "text").map((m) => m.text).join("").trim();
      d && await e.send(St(d));
    },
    [e.send]
  ), r = w(() => e.stop(), [e.stop]), s = an({
    messages: e.messages,
    isRunning: e.running,
    isLoading: e.sessionLoading,
    isDisabled: e.sessionLoading,
    isSendDisabled: e.sendDisabled,
    convertMessage: Yn,
    onNew: o,
    onCancel: r
  });
  return /* @__PURE__ */ a(rn, { runtime: s, children: t });
}
function Yn(e) {
  return e.role === "user" ? {
    id: e.id,
    role: "user",
    content: e.text ? [{ type: "text", text: e.text }] : [],
    metadata: {
      custom: Ke(e)
    }
  } : {
    id: e.id,
    role: "assistant",
    content: on(e),
    status: e.running ? { type: "running" } : e.error ? { type: "incomplete", reason: "error", error: e.text } : { type: "complete", reason: "stop" },
    metadata: {
      custom: Ke(e)
    }
  };
}
function Ke(e) {
  return {
    recordID: e.recordID || 0,
    requestID: e.requestID || "",
    output: e.output,
    activities: e.activities || [],
    sourceText: e.text,
    createdAt: e.createdAt,
    content: e.content,
    document: e.document
  };
}
const be = Ge.Button, et = re.Dialog, tt = re.DialogContent, nt = re.DialogDescription, at = re.DialogFooter, rt = re.DialogHeader, st = re.DialogTitle, Xn = An.Input, Zn = Re.cn, Ve = 152, ot = 76, it = 6, ve = 8;
function Jn({
  session: e,
  active: t,
  controller: o
}) {
  const [r, s] = z(!1), [l, d] = z(!1), [m, v] = z(e.title), [g, b] = z(""), [k, T] = z(!1), [p, E] = z(!1), [A, C] = z(!1), [q, J] = z({
    top: 0,
    left: 0
  }), M = j(null), S = j(null);
  Z(() => {
    if (!A)
      return;
    const D = (B) => {
      const Q = B.target;
      Q instanceof Node && (M.current?.contains(Q) || S.current?.contains(Q) || C(!1));
    }, V = (B) => {
      B.key === "Escape" && C(!1);
    }, _ = () => C(!1);
    return document.addEventListener("pointerdown", D, !0), document.addEventListener("keydown", V), document.addEventListener("scroll", _, !0), window.addEventListener("resize", _), () => {
      document.removeEventListener("pointerdown", D, !0), document.removeEventListener("keydown", V), document.removeEventListener("scroll", _, !0), window.removeEventListener("resize", _);
    };
  }, [A]);
  const L = () => {
    C(!1), v(e.title), b(""), s(!0);
  }, G = async (D) => {
    D.preventDefault();
    const V = m.trim();
    if (!V) {
      b("请输入会话标题");
      return;
    }
    T(!0), b("");
    try {
      await o.renameSession(e.id, V), s(!1);
    } catch (_) {
      b(ct(_, "编辑标题失败"));
    } finally {
      T(!1);
    }
  }, O = async () => {
    E(!0), b("");
    try {
      await o.deleteSession(e.id), d(!1);
    } catch (D) {
      b(ct(D, "删除会话失败"));
    } finally {
      E(!1);
    }
  }, Y = (D) => {
    if (D.stopPropagation(), A) {
      C(!1);
      return;
    }
    M.current && (J(Qn(M.current)), C(!0));
  }, F = A && typeof document < "u" ? Mn(
    /* @__PURE__ */ R(
      "div",
      {
        ref: S,
        role: "menu",
        "aria-label": `管理会话：${e.title}`,
        "data-assistant-layer": "true",
        className: "rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        style: {
          position: "fixed",
          top: q.top,
          left: q.left,
          width: Ve,
          zIndex: Me,
          pointerEvents: "auto"
        },
        onClick: (D) => D.stopPropagation(),
        children: [
          /* @__PURE__ */ R(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent",
              onClick: L,
              children: [
                /* @__PURE__ */ a(Ht, { className: "size-4 shrink-0" }),
                "编辑标题"
              ]
            }
          ),
          /* @__PURE__ */ R(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: !!e.running,
              className: "flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50",
              onClick: () => {
                C(!1), b(""), d(!0);
              },
              children: [
                /* @__PURE__ */ a(Wt, { className: "size-4 shrink-0" }),
                "删除"
              ]
            }
          )
        ]
      }
    ),
    Kn(M.current)
  ) : null;
  return /* @__PURE__ */ R(ze, { children: [
    /* @__PURE__ */ a("span", { ref: M, className: "flex shrink-0", children: /* @__PURE__ */ a(Ct, { label: "会话操作", children: /* @__PURE__ */ a(
      be,
      {
        type: "button",
        variant: "ghost",
        size: "icon",
        className: Zn(
          "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
          t ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        ),
        "aria-label": `管理会话：${e.title}`,
        "aria-haspopup": "menu",
        "aria-expanded": A,
        onClick: Y,
        children: /* @__PURE__ */ a(Gt, { className: "size-4" })
      }
    ) }) }),
    F,
    /* @__PURE__ */ a(
      et,
      {
        open: r,
        onOpenChange: (D) => {
          k || s(D);
        },
        children: /* @__PURE__ */ R(
          tt,
          {
            "data-assistant-layer": "true",
            layerZIndex: Me,
            showCloseButton: !k,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ R(rt, { children: [
                /* @__PURE__ */ a(st, { children: "编辑标题" }),
                /* @__PURE__ */ a(nt, { children: "修改左侧显示的会话标题。" })
              ] }),
              /* @__PURE__ */ R("form", { className: "space-y-4", onSubmit: G, children: [
                /* @__PURE__ */ a(
                  Xn,
                  {
                    autoFocus: !0,
                    value: m,
                    maxLength: 255,
                    disabled: k,
                    "aria-label": "会话标题",
                    onChange: (D) => v(D.target.value)
                  }
                ),
                g ? /* @__PURE__ */ a("p", { className: "text-sm text-destructive", children: g }) : null,
                /* @__PURE__ */ R(at, { children: [
                  /* @__PURE__ */ a(
                    be,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: k,
                      onClick: () => s(!1),
                      children: "取消"
                    }
                  ),
                  /* @__PURE__ */ a(be, { type: "submit", disabled: k || !m.trim(), children: k ? "保存中..." : "保存" })
                ] })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ a(
      et,
      {
        open: l,
        onOpenChange: (D) => {
          p || d(D);
        },
        children: /* @__PURE__ */ R(
          tt,
          {
            "data-assistant-layer": "true",
            layerZIndex: Me,
            showCloseButton: !p,
            className: "sm:max-w-md",
            children: [
              /* @__PURE__ */ R(rt, { children: [
                /* @__PURE__ */ a(st, { children: "删除对话？" }),
                /* @__PURE__ */ R(nt, { children: [
                  "删除后，“",
                  e.title,
                  "”将从历史会话中移除。"
                ] })
              ] }),
              g ? /* @__PURE__ */ a("p", { className: "text-sm text-destructive", children: g }) : null,
              /* @__PURE__ */ R(at, { children: [
                /* @__PURE__ */ a(
                  be,
                  {
                    type: "button",
                    variant: "outline",
                    disabled: p,
                    onClick: () => d(!1),
                    children: "取消"
                  }
                ),
                /* @__PURE__ */ a(
                  be,
                  {
                    type: "button",
                    variant: "destructive",
                    disabled: p,
                    onClick: () => {
                      O();
                    },
                    children: p ? "删除中..." : "删除"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function ct(e, t) {
  return e instanceof Error && e.message.trim() ? e.message.trim() : t;
}
function Qn(e) {
  const t = e.getBoundingClientRect(), o = Math.max(
    ve,
    window.innerWidth - Ve - ve
  ), r = Math.min(
    o,
    Math.max(ve, t.right - Ve)
  ), s = t.bottom + it;
  return { top: s + ot <= window.innerHeight - ve ? s : Math.max(ve, t.top - ot - it), left: r };
}
function Kn(e) {
  return e?.closest('[data-agent-chat-layer="true"]') || document.body;
}
const ea = Ge.Button, lt = Re.cn;
function dt({
  agentName: e,
  title: t,
  agentReady: o,
  controller: r,
  collapsed: s = !1,
  mobile: l = !1,
  onOpenSession: d,
  onStartNewSession: m
}) {
  return /* @__PURE__ */ R(
    "aside",
    {
      className: lt(
        "agent-chat-sidebar h-full shrink-0 flex-col bg-muted/25",
        l ? "flex w-full md:hidden" : "hidden border-r",
        !l && !s && "md:flex"
      ),
      style: l ? void 0 : {
        width: "var(--agent-chat-sidebar-width, 300px)",
        minWidth: "var(--agent-chat-sidebar-width, 300px)",
        flexBasis: "var(--agent-chat-sidebar-width, 300px)"
      },
      children: [
        /* @__PURE__ */ a("div", { className: "agent-chat-sidebar-header shrink-0 border-b p-3", children: /* @__PURE__ */ R("div", { className: "agent-chat-sidebar-controls flex min-w-0 items-center gap-2", children: [
          /* @__PURE__ */ a("div", { className: "agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground", children: t ?? (e || "智能体") }),
          /* @__PURE__ */ R(
            ea,
            {
              type: "button",
              variant: "outline",
              className: "agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3",
              disabled: r.sessionLoading || !o,
              onClick: () => {
                m ? m() : r.startNewSession();
              },
              children: [
                /* @__PURE__ */ a("span", { className: "agent-chat-new-session-icon contents", children: /* @__PURE__ */ a(It, { className: "size-4" }) }),
                /* @__PURE__ */ a("span", { children: "新对话" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ R("div", { className: "agent-chat-session-section flex min-h-0 flex-1 flex-col", children: [
          /* @__PURE__ */ a("div", { className: "agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground", children: "历史会话" }),
          /* @__PURE__ */ a(
            "div",
            {
              ref: r.sessionListRef,
              className: "agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3",
              onScroll: (v) => r.handleSessionListScroll(v.currentTarget),
              children: r.sessionsLoading && r.sessions.length === 0 ? /* @__PURE__ */ a("div", { className: "flex h-24 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ a(Ce, { className: "size-4 animate-spin" }) }) : r.sessions.length === 0 ? /* @__PURE__ */ a("div", { className: "px-2 py-6 text-center text-xs leading-5 text-muted-foreground", children: "暂无历史会话" }) : /* @__PURE__ */ R("div", { className: "space-y-1", children: [
                r.sessions.map((v) => /* @__PURE__ */ R(
                  "div",
                  {
                    className: lt(
                      "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                      v.id === r.sessionID ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    ),
                    children: [
                      /* @__PURE__ */ R(
                        "button",
                        {
                          type: "button",
                          className: "agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm",
                          onClick: () => {
                            d ? d(v.id) : r.openSession(v.id);
                          },
                          children: [
                            v.running ? /* @__PURE__ */ a(Ce, { className: "size-3.5 shrink-0 animate-spin" }) : /* @__PURE__ */ a(Ut, { className: "size-3.5 shrink-0" }),
                            /* @__PURE__ */ a("span", { className: "min-w-0 flex-1 truncate", children: v.title })
                          ]
                        }
                      ),
                      /* @__PURE__ */ a(
                        Jn,
                        {
                          session: v,
                          active: v.id === r.sessionID,
                          controller: r
                        }
                      )
                    ]
                  },
                  v.id
                )),
                r.sessionsLoadingMore ? /* @__PURE__ */ a("div", { className: "flex h-10 items-center justify-center text-muted-foreground", children: /* @__PURE__ */ a(Ce, { className: "size-4 animate-spin" }) }) : null
              ] })
            }
          )
        ] })
      ]
    }
  );
}
const ta = 32;
function na(e, t, o = ta) {
  let r = e, s = null, l = !0, d = 0;
  const m = () => {
    s != null && (clearTimeout(s), s = null);
  }, v = () => {
    m(), d = ut(), t(r);
  }, g = () => {
    if (s != null)
      return;
    const b = ut() - d, k = Math.max(0, o - b);
    s = setTimeout(v, k);
  };
  return {
    get text() {
      return r;
    },
    append(b) {
      if (b) {
        if (r += b, l) {
          l = !1, v();
          return;
        }
        g();
      }
    },
    reset(b = "") {
      m(), r = b, l = !0, d = 0;
    },
    flush: v,
    dispose() {
      m();
    }
  };
}
function ut() {
  return typeof performance > "u" ? Date.now() : performance.now();
}
const aa = Te.runRuntimeStream, ra = Te.stopRuntimeStream, sa = Te.watchRuntimeStream, _e = We.runtimeErrorMessage, mt = kt.streamValueText;
function oa({
  agentKey: e,
  contextKey: t,
  modalOpen: o,
  sessionLoading: r,
  sessionID: s,
  messages: l,
  blockMs: d,
  runtimeApi: m,
  requestScope: v,
  getActiveSessionID: g,
  getSessionTitle: b,
  getSessionMessages: k,
  updateSessionMessages: T,
  updateSessionTitle: p,
  syncSessionTitle: E,
  setSessionRunning: A,
  setError: C
}) {
  const [q, J] = z({}), M = j(/* @__PURE__ */ new Map()), S = w(
    (n) => {
      n.detached || (J((c) => ({
        ...c,
        [n.sessionID]: {
          requestID: n.requestID,
          cancelable: n.cancelable,
          stopping: n.stopping
        }
      })), A(n.sessionID, !0));
    },
    [A]
  ), L = w(
    (n) => {
      const c = M.current.get(n.sessionID);
      return c && c !== n ? !1 : (M.current.set(n.sessionID, n), S(n), !0);
    },
    [S]
  ), G = w(
    (n) => {
      M.current.get(n.sessionID) === n && (n.buffer.dispose(), M.current.delete(n.sessionID), J((c) => {
        const u = { ...c };
        return delete u[n.sessionID], u;
      }), A(n.sessionID, !1));
    },
    [A]
  ), O = w(
    (n, c) => {
      n.detached || T(
        n.sessionID,
        (u) => u.map(
          (x) => je(x, n) ? {
            ...x,
            ...typeof c == "function" ? c(x) : c
          } : x
        )
      );
    },
    [T]
  ), Y = w(
    (n, c) => {
      M.current.get(n.sessionID) === n && (n.buffer.flush(), O(n, (u) => {
        const x = Mt(c.output), I = En(
          c.output?.document
        ), P = {
          text: c.text,
          requestID: c.requestID || n.requestID || void 0,
          running: !1,
          error: !!c.error,
          activities: Pn(
            u.activities,
            x
          )
        };
        return Ln(c.output) && (P.output = c.output), P.document = Ee(
          u.document,
          I
        ), I && u.document?.id !== I.id && (P.autoOpenDocument = !0), P;
      }), G(n), n.kind !== "opening" && E(n.sessionID));
    },
    [G, E, O]
  ), F = w(
    (n, c) => {
      if (n.detached || M.current.get(n.sessionID) !== n)
        return !1;
      const u = _n(c);
      if (u.requestID && !n.requestID && (n.requestID = u.requestID), u.streamID && (n.lastStreamID = u.streamID), u.runVersion > 0) {
        if (n.runVersion > u.runVersion)
          return !0;
        n.runVersion = u.runVersion;
      }
      u.assistantMessageID > 0 && O(n, { recordID: u.assistantMessageID }), u.cancelable != null && u.cancelable !== n.cancelable && (n.cancelable = u.cancelable, S(n)), ia(u.event, u.output) && O(n, (I) => {
        const P = At(
          I.document,
          u.output
        );
        return {
          document: P,
          autoOpenDocument: I.autoOpenDocument || u.event === "document_start" && !!P && I.document?.id !== P?.id,
          requestID: u.requestID || n.requestID || void 0,
          running: !0
        };
      }), u.event === "reset" && (n.replayPending = !1, n.buffer.reset(mt(u.output.text)), n.buffer.flush()), u.delta && (n.replayPending && (n.replayPending = !1, n.buffer.reset()), n.buffer.append(u.delta));
      const x = u.activity;
      if (x) {
        n.buffer.flush();
        const I = x.anchorText ? x : { ...x, anchorText: n.buffer.text };
        O(n, (P) => ({
          activities: qn(
            P.activities,
            I
          ),
          requestID: u.requestID || n.requestID || void 0,
          running: !0
        }));
      }
      return n.kind === "opening" && u.finished && u.event === "opening_skipped" ? (T(
        n.sessionID,
        (I) => I.filter((P) => !je(P, n))
      ), G(n), !1) : u.finished ? (Y(n, {
        text: gt({
          text: u.finalText,
          streamedText: n.buffer.text,
          error: u.error,
          failed: u.failed
        }),
        error: u.failed,
        requestID: u.requestID,
        output: u.output
      }), !1) : !0;
    },
    [Y, S, G, O, T]
  ), D = w(
    (n) => {
      let c;
      const u = na(n.text || "", (x) => {
        O(c, {
          text: x,
          requestID: c.requestID || void 0,
          running: !0,
          error: !1
        });
      });
      return c = {
        kind: n.kind || "chat",
        sessionID: n.sessionID,
        requestID: n.requestID || "",
        userMessageID: n.userMessageID,
        assistantMessageID: n.assistantMessageID,
        createdAt: n.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        input: n.prompt || "",
        content: n.content,
        buffer: u,
        lastStreamID: "0-0",
        cancelable: !1,
        stopping: !1,
        stopped: !1,
        detached: !1,
        replayPending: !!n.replayPending,
        runVersion: 0,
        controller: new AbortController()
      }, c;
    },
    [O]
  ), V = w(
    (n, c) => {
      if (!On(c.status))
        return !1;
      const u = c.status === "fail", x = c.status === "canceled", I = gt({
        text: c.text,
        streamedText: n.buffer.text,
        error: c.error,
        failed: u,
        canceled: x
      });
      return Y(n, {
        text: I,
        error: u,
        requestID: c.requestID,
        output: c.output
      }), u && g() === n.sessionID && C(c.error.trim() || I), !0;
    },
    [Y, g, C]
  ), _ = w(
    async (n, c) => {
      const u = c.requestID || "";
      if (!u || !n || M.current.has(n))
        return;
      const x = D({
        kind: c.kind === "opening" ? "opening" : "chat",
        sessionID: n,
        requestID: u,
        userMessageID: "",
        assistantMessageID: c.id,
        createdAt: c.createdAt,
        text: c.text,
        replayPending: !!c.text
      });
      if (!L(x)) {
        x.buffer.dispose();
        return;
      }
      try {
        const I = await Qe(
          m.status,
          u
        );
        if (x.detached || M.current.get(n) !== x || (x.runVersion = Math.max(x.runVersion, I.runVersion), V(x, I)) || (await sa({
          streamApi: m.stream,
          requestID: u,
          lastID: x.lastStreamID,
          blockMs: d,
          signal: x.controller.signal,
          // applyFrame only returns false for the current run version. Old
          // terminal frames from an interrupted attempt must not stop replay.
          stopOnResult: !1,
          recoverOnError: !0,
          fallbackToPoll: !1,
          onFrame: (U) => F(x, U) ? void 0 : !1
        }), x.detached || x.controller.signal.aborted || M.current.get(n) !== x))
          return;
        const P = await Qe(
          m.status,
          u
        );
        V(x, P);
      } catch (I) {
        if (x.detached || x.controller.signal.aborted || M.current.get(n) !== x)
          return;
        const P = _e(
          I,
          "恢复智能体运行失败。"
        );
        Y(x, {
          text: x.buffer.text.trim() || P,
          error: !0,
          requestID: u
        }), g() === n && C(P);
      }
    },
    [
      F,
      d,
      D,
      Y,
      V,
      g,
      L,
      m.status,
      m.stream,
      C
    ]
  );
  Z(() => {
    if (!o || r || !s)
      return;
    const n = l.find(
      (c) => c.role === "assistant" && c.running && !!c.requestID
    );
    n && _(s, n);
  }, [l, o, _, s, r]);
  const B = w(
    async (n, c, u) => {
      C("");
      try {
        const x = await aa({
          requestApi: c,
          streamApi: m.stream,
          stopApi: m.stop,
          stopOnAbort: !1,
          fallbackToPoll: !1,
          blockMs: d,
          signal: n.controller.signal,
          body: u,
          onRequestID: (U) => {
            n.detached || (n.requestID = U, S(n), O(n, { requestID: U }));
          },
          onFrame: (U) => {
            F(n, U);
          }
        });
        if (n.detached || n.stopped || M.current.get(n.sessionID) !== n)
          return;
        const I = Bn(x.finalOutput), P = mt(
          x.finalOutput?.text || x.textOutput || n.buffer.text
        ).trim();
        Y(n, {
          text: P,
          output: I,
          requestID: x.requestID
        });
      } catch (x) {
        if (n.detached || n.stopped || M.current.get(n.sessionID) !== n)
          return;
        const I = _e(
          x,
          n.kind === "opening" ? "智能体开场失败。" : "智能体运行失败。"
        );
        Y(n, {
          text: n.buffer.text.trim() || I,
          error: !0,
          requestID: n.requestID
        }), g() === n.sessionID && C(I);
      }
    },
    [
      F,
      d,
      Y,
      g,
      S,
      m.stop,
      m.stream,
      C,
      O
    ]
  ), Q = w(
    async (n) => {
      const c = n.text.trim(), u = g();
      if (!c || !e || !u || M.current.has(u))
        return;
      const x = Date.now(), I = new Date(x).toISOString(), P = {
        id: `${u}-user-${x}`,
        role: "user",
        text: c,
        createdAt: I,
        content: n.content
      }, U = `${u}-assistant-${x}`, W = D({
        sessionID: u,
        userMessageID: P.id,
        assistantMessageID: U,
        createdAt: I,
        prompt: c,
        content: n.content
      });
      if (!L(W)) {
        W.buffer.dispose();
        return;
      }
      p(
        u,
        la(b(u), c)
      ), T(u, (le) => [
        ...le,
        P,
        {
          id: U,
          role: "assistant",
          text: "",
          createdAt: I,
          running: !0
        }
      ]), await B(W, m.request, {
        ...v,
        agent: e,
        session_id: u,
        context_key: t,
        input: {
          text: c,
          content: n.content,
          params: n.params
        }
      });
    },
    [
      e,
      t,
      D,
      B,
      g,
      b,
      L,
      v,
      m.request,
      T,
      p
    ]
  ), oe = w(
    async (n) => {
      const c = m.opening?.trim() || "";
      if (!c || !e || !n || M.current.has(n))
        return;
      const u = Date.now(), x = new Date(u).toISOString(), I = k(n).find(
        (W) => W.role === "assistant" && W.kind === "opening" && !!W.requestID
      ), P = I?.id || `${n}-opening-${u}`, U = D({
        kind: "opening",
        sessionID: n,
        requestID: I?.requestID,
        userMessageID: "",
        assistantMessageID: P,
        createdAt: I?.createdAt || x,
        text: I?.text,
        replayPending: !!(I?.running && I.text)
      });
      if (!L(U)) {
        U.buffer.dispose();
        return;
      }
      I || T(n, (W) => [
        ...W,
        {
          id: P,
          role: "assistant",
          kind: "opening",
          text: "",
          createdAt: x,
          running: !0
        }
      ]), await B(U, c, {
        ...v,
        agent: e,
        session_id: n,
        context_key: t
      });
    },
    [
      e,
      t,
      D,
      B,
      k,
      L,
      v,
      m.opening,
      T
    ]
  ), H = w(async () => {
    const n = g(), c = M.current.get(n);
    if (!(!c?.requestID || !c.cancelable || c.stopping)) {
      c.stopping = !0, S(c), C("");
      try {
        if (await ra(c.requestID, m.stop), M.current.get(n) !== c)
          return;
        c.stopped = !0, c.controller.abort(), Y(c, {
          text: c.buffer.text.trim() || "已停止生成",
          requestID: c.requestID
        });
      } catch (u) {
        if (M.current.get(n) !== c)
          return;
        c.stopping = !1, S(c), g() === n && C(_e(u, "停止生成失败。"));
      }
    }
  }, [Y, g, S, m.stop, C]), K = w(
    (n) => M.current.has(n),
    []
  ), se = w(
    (n, c) => ca(c, M.current.get(n)),
    []
  ), ne = w(() => {
    for (const n of M.current.values())
      n.detached = !0, n.buffer.dispose(), n.controller.abort(), A(n.sessionID, !1);
    M.current.clear(), J({});
  }, [A]);
  Z(() => () => {
    for (const n of M.current.values())
      n.detached = !0, n.buffer.dispose(), n.controller.abort();
    M.current.clear();
  }, []);
  const ee = q[s];
  return {
    running: !!(ee || l.some(
      (n) => n.role === "assistant" && n.running
    )),
    stopping: !!ee?.stopping,
    cancelable: !!ee?.cancelable,
    hasRun: K,
    mergeMessages: se,
    reset: ne,
    send: Q,
    startOpening: oe,
    stop: H
  };
}
function je(e, t) {
  return e.id === t.assistantMessageID || !!(t.requestID && e.requestID === t.requestID);
}
function ia(e, t) {
  return !!(t.document || t.document_id) || [
    "document_start",
    "block_commit",
    "text_delta",
    "media_block_append",
    "artifact_progress",
    "artifact_ready",
    "artifact_failed",
    "document_content_complete",
    "document_complete"
  ].includes(e);
}
function ca(e, t) {
  if (!t)
    return e;
  let o = !1;
  const r = e.map((s) => je(s, t) ? (o = !0, {
    ...s,
    requestID: t.requestID || s.requestID,
    text: t.buffer.text || s.text,
    running: !0,
    error: !1
  }) : s);
  return o ? r : [
    ...r,
    ...t.input ? [
      {
        id: t.userMessageID,
        role: "user",
        text: t.input,
        createdAt: t.createdAt,
        content: t.content
      }
    ] : [],
    {
      id: t.assistantMessageID,
      role: "assistant",
      text: t.buffer.text,
      createdAt: t.createdAt,
      requestID: t.requestID || void 0,
      running: !0,
      error: !1
    }
  ];
}
function la(e, t) {
  return e.trim() && e.trim() !== "新会话" ? e : Array.from(t.trim().replace(/\s+/g, " ")).slice(0, 40).join("") || "新会话";
}
function gt(e) {
  const t = e.text?.trim() || e.streamedText?.trim() || "";
  return t || (e.canceled ? "已停止生成" : e.failed ? e.error?.trim() || "智能体运行失败。" : "");
}
const da = Te.watchRuntimeStream, ua = We.normalizeRuntimeFrameOutput;
function ma({
  modalOpen: e,
  sessionID: t,
  messages: o,
  blockMs: r,
  runtimeApi: s,
  updateDocument: l
}) {
  const d = j(/* @__PURE__ */ new Map());
  Z(() => {
    const m = d.current;
    if (!e || !t) {
      pt(m);
      return;
    }
    const v = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
    for (const b of o)
      b.document && (v.set(b.document.id, b.document), $n(b.document) && g.set(b.document.id, b.document));
    for (const [b, k] of m) {
      const T = v.get(b);
      if (!T || k.sessionID !== t) {
        k.controller.abort(), m.delete(b);
        continue;
      }
      k.document = Ee(k.document, T) || T;
    }
    for (const b of g.values()) {
      if (m.has(b.id))
        continue;
      const k = {
        sessionID: t,
        controller: new AbortController(),
        document: b
      };
      m.set(b.id, k), ga({
        watch: k,
        watches: m,
        blockMs: r,
        runtimeApi: s,
        updateDocument: l
      });
    }
  }, [r, o, e, s, t, l]), Z(() => {
    const m = d.current;
    return () => pt(m);
  }, []);
}
async function ga(e) {
  const { watch: t, watches: o, blockMs: r, runtimeApi: s, updateDocument: l } = e, d = t.document.id;
  let m = null, v = 0, g = 0;
  const b = (p) => {
    !p || t.controller.signal.aborted || (t.document = p, l(t.sessionID, d, p));
  }, k = async () => {
    const p = await cn(
      s.document,
      d
    );
    return b(Ee(t.document, p)), p;
  }, T = () => {
    if (m || t.controller.signal.aborted)
      return;
    const p = new AbortController(), E = () => p.abort();
    m = p, v = Date.now(), t.controller.signal.addEventListener("abort", E, { once: !0 }), da({
      streamApi: s.documentStream,
      requestID: `document:${d}`,
      blockMs: r,
      signal: p.signal,
      stopOnResult: !1,
      recoverOnError: !0,
      fallbackToPoll: !1,
      onFrame: (A) => {
        v = Date.now();
        const C = ha(A);
        b(At(t.document, C)), xa(C) === "document_complete" && k().catch(() => {
        });
      }
    }).catch(() => {
    }).finally(() => {
      t.controller.signal.removeEventListener("abort", E), m === p && (m = null);
    });
  };
  try {
    T();
    try {
      const p = await k();
      if (!Ne(p))
        return;
    } catch {
      if (t.controller.signal.aborted)
        return;
      g = 1;
    }
    for (; !t.controller.signal.aborted; ) {
      if (await fa(
        t.controller.signal,
        pa(g)
      ), t.controller.signal.aborted)
        return;
      if (!(m !== null && Date.now() - v < Math.max(6e3, r * 3)))
        try {
          const E = await k();
          if (!Ne(E))
            return;
          g = Math.min(g + 1, 3), T();
        } catch {
          if (t.controller.signal.aborted)
            return;
          g = Math.min(g + 1, 3);
        }
    }
  } finally {
    m?.abort(), o.get(d) === t && o.delete(d);
  }
}
function pa(e) {
  const t = [2e3, 4e3, 8e3, 12e3];
  return t[Math.min(e, t.length - 1)] ?? t[t.length - 1];
}
function fa(e, t) {
  return new Promise((o) => {
    if (e.aborted) {
      o();
      return;
    }
    const r = window.setTimeout(s, t);
    e.addEventListener("abort", s, { once: !0 });
    function s() {
      window.clearTimeout(r), e.removeEventListener("abort", s), o();
    }
  });
}
function ha(e) {
  return ua(e.output, e);
}
function xa(e) {
  return String(e.event || e.semantic_event || "").trim().toLowerCase();
}
function pt(e) {
  for (const t of e.values())
    t.controller.abort();
  e.clear();
}
const Ie = [800, 1500, 3e3, 5e3, 8e3];
function ba({
  modalOpen: e,
  sessionID: t,
  messages: o,
  refreshSession: r
}) {
  const s = wa(o);
  Z(() => {
    if (!e || !t || !s)
      return;
    const l = new AbortController();
    return va(t, l.signal, r), () => l.abort();
  }, [e, s, r, t]);
}
async function va(e, t, o) {
  let r = 0;
  for (; !t.aborted; ) {
    const s = Ie[Math.min(r, Ie.length - 1)] ?? Ie[Ie.length - 1];
    if (await ya(t, s), t.aborted)
      return;
    try {
      await o(e);
    } catch {
    }
    r += 1;
  }
}
function wa(e) {
  return e.filter((t) => !t.document).flatMap(
    (t) => Nt(t.output).filter((o) => o.status === "generating").map((o) => o.id)
  ).sort((t, o) => t - o).join(":");
}
function ya(e, t) {
  return new Promise((o) => {
    if (e.aborted) {
      o();
      return;
    }
    const r = window.setTimeout(s, t);
    e.addEventListener("abort", s, { once: !0 });
    function s() {
      window.clearTimeout(r), e.removeEventListener("abort", s), o();
    }
  });
}
function ft(e, t, o) {
  const r = e.findIndex(
    (s) => s.id === t.id
  );
  return o || r < 0 ? [
    t,
    ...e.filter((s) => s.id !== t.id)
  ] : e.map(
    (s) => s.id === t.id ? t : s
  );
}
function Da(e, t) {
  const o = new Set(e.map((r) => r.id));
  return [
    ...e,
    ...t.filter((r) => !o.has(r.id))
  ];
}
function Ia(e, t) {
  const o = new Set(
    e.map((s) => s.recordID).filter((s) => !!s)
  );
  return [...t.filter(
    (s) => !s.recordID || !o.has(s.recordID)
  ), ...e];
}
function ht(e, t) {
  const o = new Map(
    e.filter((l) => !!l.recordID).map((l) => [l.recordID, l])
  ), r = new Set(
    t.map((l) => l.recordID).filter((l) => !!l)
  );
  return [
    ...e.filter(
      (l) => !!l.recordID && !r.has(l.recordID)
    ),
    ...t.map((l) => ({
      ...l,
      autoOpenDocument: l.autoOpenDocument || o.get(l.recordID || 0)?.autoOpenDocument
    }))
  ];
}
function qe(e) {
  return e.map((t, o) => ({
    id: t.id ? `saved-${t.id}` : `saved-${o}`,
    recordID: t.id || void 0,
    role: t.role,
    kind: t.kind,
    text: t.text,
    createdAt: t.createdAt,
    content: t.content,
    output: t.output,
    activities: Mt(t.output),
    requestID: t.requestID || void 0,
    running: t.status === 3,
    error: t.status === 2,
    document: t.document
  }));
}
const ue = We.runtimeErrorMessage, xt = 20, ke = 20, bt = 10, Oe = 48, ka = [500, 1e3, 2e3, 4e3, 8e3, 8e3];
function Sa({
  agentKey: e,
  contextKey: t,
  modalOpen: o,
  blockMs: r,
  lazySession: s = !1,
  proactiveOpening: l = !1,
  assistantApi: d,
  runtimeApi: m,
  requestScope: v
}) {
  const g = t?.trim() || (e ? `agent-runtime:${e}` : ""), [b, k] = z([]), [T, p] = z(0), [E, A] = z("新会话"), [C, q] = z([]), [J, M] = z(!1), [S, L] = z(!1), [G, O] = z(!1), [Y, F] = z(""), [D, V] = z([]), _ = j(0), B = j(/* @__PURE__ */ new Map()), Q = j(
    /* @__PURE__ */ new Map()
  ), oe = j(""), H = j(0), K = j(0), se = j(0), ne = j(!1), ee = j(!1), n = j(!1), c = j(0), u = j(null), x = j(null), I = w(
    (i, h) => {
      _.current = i, p(i), A(h.title), q(h.messages), c.current = 0;
    },
    []
  ), P = w(
    (i, h) => {
      B.current.set(i, h), _.current === i && (A(h.title), q(h.messages));
    },
    []
  ), U = w(() => _.current, []), W = w((i) => B.current.get(i)?.title || "新会话", []), le = w((i) => B.current.get(i)?.messages || [], []), ie = w(
    (i, h) => {
      const f = B.current.get(i);
      f && P(i, {
        ...f,
        messages: h(f.messages)
      });
    },
    [P]
  ), ye = w(
    (i, h, f) => {
      ie(
        i,
        (y) => y.map(
          (N) => N.document?.id === h || f.messageID > 0 && N.recordID === f.messageID ? {
            ...N,
            document: Ee(N.document, f) || f
          } : N
        )
      );
    },
    [ie]
  ), ge = w(
    (i, h) => {
      const f = B.current.get(i);
      f && P(i, { ...f, title: h }), k(
        (y) => y.map(
          (N) => N.id === i ? { ...N, title: h } : N
        )
      );
    },
    [P]
  ), Pt = w(
    async (i) => {
      const h = `${e}:${g}`;
      for (const f of ka) {
        if (await Ca(f), oe.current !== h)
          return;
        try {
          const y = await ln(d, {
            agentKey: e,
            contextKey: g,
            sessionID: i
          });
          if (!y)
            return;
          if (y.titleSource === "llm" || y.titleSource === "manual") {
            ge(i, y.title);
            return;
          }
        } catch {
        }
      }
    },
    [e, d, g, ge]
  ), Lt = w(
    (i, h) => {
      k((f) => {
        const y = f.find(
          (N) => N.id === i
        );
        return y ? ft(f, { ...y, running: h }, h) : f;
      });
    },
    []
  ), _t = w(
    (i) => dn(
      {
        api: d,
        agentKey: e,
        contextKey: g,
        sessionID: _.current
      },
      i
    ),
    [e, d, g]
  ), qt = w(
    (i) => {
      const h = _.current;
      if (!h || !e)
        return Promise.reject(new Error("当前会话不可用"));
      const f = `${h}:${i.refType}:${i.refId}`, y = Q.current.get(f);
      if (y)
        return y;
      const N = un(
        m.referencePreview,
        { agentKey: e, sessionID: h },
        i
      );
      return Q.current.set(f, N), N.catch(() => {
        Q.current.get(f) === N && Q.current.delete(f);
      }), N;
    },
    [e, m.referencePreview]
  ), $ = oa({
    agentKey: e,
    contextKey: g,
    modalOpen: o,
    sessionLoading: G,
    sessionID: T,
    messages: C,
    blockMs: r,
    runtimeApi: m,
    requestScope: v,
    getActiveSessionID: U,
    getSessionTitle: W,
    getSessionMessages: le,
    updateSessionMessages: ie,
    updateSessionTitle: ge,
    syncSessionTitle: Pt,
    setSessionRunning: Lt,
    setError: F
  });
  ma({
    modalOpen: o,
    sessionID: T,
    messages: C,
    blockMs: r,
    runtimeApi: m,
    updateDocument: ye
  });
  const Ot = w(
    async (i) => {
      if (!e || !g || _.current !== i)
        return;
      const h = await xe(d, {
        agentKey: e,
        contextKey: g,
        sessionID: i,
        limit: ke
      });
      if (_.current !== i)
        return;
      const f = $.mergeMessages(
        i,
        qe(h.messages)
      );
      ie(
        i,
        (y) => ht(y, f)
      );
    },
    [
      e,
      d,
      g,
      $.mergeMessages,
      ie
    ]
  );
  ba({
    modalOpen: o,
    sessionID: T,
    messages: C,
    refreshSession: Ot
  });
  const me = w(
    (i, h = !1) => {
      const f = i.session?.id || 0;
      if (!f)
        return;
      const y = $.mergeMessages(
        f,
        qe(i.messages)
      ), N = B.current.get(f), te = N ? ht(N.messages, y) : y, ae = {
        title: i.session?.title || "新会话",
        messages: te,
        oldestMessageID: N?.oldestMessageID || i.messages[0]?.id || 0,
        canLoadOlder: N?.canLoadOlder ?? i.messages.length > 0
      };
      if (B.current.set(f, ae), I(f, ae), i.session) {
        const de = {
          ...i.session,
          running: $.hasRun(f) || te.some((ce) => ce.running)
        };
        k(
          (ce) => ft(ce, de, h)
        );
      }
    },
    [$.hasRun, $.mergeMessages, I]
  ), Ye = w(async () => {
    if (!e || !g)
      return;
    const i = ++H.current, h = ++K.current;
    ee.current = !0, M(!0), L(!1), _.current || O(!0), F("");
    try {
      const f = await Ze(d, {
        agentKey: e,
        contextKey: g,
        limit: xt
      });
      if (H.current !== i || K.current !== h)
        return;
      k(
        f.sessions.map((ae) => ({
          ...ae,
          running: !!ae.running || $.hasRun(ae.id)
        }))
      ), se.current = f.sessions[f.sessions.length - 1]?.id || 0, ne.current = f.hasMore, M(!1);
      const y = f.sessions[0], N = y ? B.current.get(y.id) : void 0;
      if (y && N && (I(y.id, N), O(!1)), !y && s && !l) {
        _.current = 0, p(0), A("新会话"), q([]);
        return;
      }
      const te = await xe(d, {
        agentKey: e,
        contextKey: g,
        sessionID: y?.id,
        create: !y && !l,
        title: "新会话",
        limit: ke
      });
      H.current === i && (me(te, !y), !y && l && te.session?.id && $.startOpening(te.session.id));
    } catch (f) {
      H.current === i && K.current === h && F(ue(f, "加载会话失败。"));
    } finally {
      H.current === i && K.current === h && (ee.current = !1, M(!1), O(!1));
    }
  }, [
    e,
    me,
    d,
    g,
    s,
    l,
    $.hasRun,
    $.startOpening,
    I
  ]), pe = w(
    async (i, h = !1) => {
      if (!e || !g)
        return;
      const f = ++H.current;
      n.current = !1;
      const y = h ? void 0 : B.current.get(i);
      y ? (I(i, y), O(!1)) : (h && (_.current = 0, p(0), A("新会话"), q([])), O(!0)), F("");
      try {
        const N = await xe(d, {
          agentKey: e,
          contextKey: g,
          sessionID: i || void 0,
          create: h,
          title: "新会话",
          limit: h ? ke : bt
        });
        H.current === f && (me(N, h), h && l && N.session?.id && $.startOpening(N.session.id));
      } catch (N) {
        H.current === f && F(ue(N, "加载会话失败。"));
      } finally {
        H.current === f && O(!1);
      }
    },
    [
      e,
      me,
      d,
      g,
      l,
      $.startOpening,
      I
    ]
  ), Xe = w(() => {
    H.current += 1, n.current = !1, _.current = 0, p(0), A("新会话"), q([]), O(!1), F("");
  }, []), Pe = w(
    async () => {
      if (s && !l) {
        Xe();
        return;
      }
      await pe(0, !0);
    },
    [s, Xe, pe, l]
  ), Bt = w(
    async (i, h) => {
      try {
        const f = await mn(
          d,
          i,
          h
        );
        ge(i, f.title), F("");
      } catch (f) {
        const y = ue(f, "编辑标题失败。");
        throw F(y), new Error(y);
      }
    },
    [d, ge]
  ), $t = w(
    async (i) => {
      if ($.hasRun(i))
        throw new Error("当前会话正在生成，暂时不能删除。");
      const h = b.findIndex(
        (y) => y.id === i
      ), f = b.filter(
        (y) => y.id !== i
      );
      try {
        if (await gn(d, i), B.current.delete(i), k(f), F(""), _.current !== i)
          return;
        const y = Math.min(
          Math.max(0, h),
          Math.max(0, f.length - 1)
        ), N = f[y];
        N ? await pe(N.id, !1) : await Pe();
      } catch (y) {
        const N = ue(y, "删除会话失败。");
        throw F(N), new Error(N);
      }
    },
    [d, pe, $.hasRun, b, Pe]
  ), Le = w(async () => {
    if (!e || !g || !ne.current || ee.current)
      return;
    const i = K.current, h = se.current;
    ee.current = !0, L(!0);
    try {
      const f = await Ze(d, {
        agentKey: e,
        contextKey: g,
        limit: xt,
        lastSessionID: se.current
      });
      if (K.current !== i)
        return;
      if (f.sessions.length === 0) {
        ne.current = !1;
        return;
      }
      const y = f.sessions[f.sessions.length - 1]?.id || 0;
      k(
        (N) => Da(
          N,
          f.sessions.map((te) => ({
            ...te,
            running: !!te.running || $.hasRun(te.id)
          }))
        )
      ), se.current = y, ne.current = f.hasMore && y > 0 && y !== h;
    } catch (f) {
      K.current === i && F(ue(f, "加载更多会话失败。"));
    } finally {
      K.current === i && (ee.current = !1, L(!1));
    }
  }, [e, d, g, $.hasRun]), fe = w(async () => {
    const i = _.current, h = B.current.get(i);
    if (!i || !h?.canLoadOlder || !h.oldestMessageID || !e || !g || n.current)
      return;
    const f = x.current, y = f?.scrollHeight || 0, N = f?.scrollTop || 0, te = H.current;
    n.current = !0;
    try {
      const ae = await xe(d, {
        agentKey: e,
        contextKey: g,
        sessionID: i,
        limit: bt,
        lastMessageID: h.oldestMessageID
      });
      if (H.current !== te || _.current !== i)
        return;
      const de = B.current.get(i);
      if (!de)
        return;
      if (ae.messages.length === 0) {
        P(i, {
          ...de,
          canLoadOlder: !1
        });
        return;
      }
      P(i, {
        ...de,
        messages: Ia(
          de.messages,
          qe(ae.messages)
        ),
        oldestMessageID: ae.messages[0]?.id || de.oldestMessageID,
        canLoadOlder: !0
      }), window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const ce = x.current;
          !ce || _.current !== i || (ce.scrollTop = N + ce.scrollHeight - y, c.current = ce.scrollTop);
        });
      });
    } catch (ae) {
      H.current === te && _.current === i && F(ue(ae, "加载历史消息失败。"));
    } finally {
      H.current === te && _.current === i && (n.current = !1);
    }
  }, [e, d, g, P]), zt = w((i) => {
    const h = i || u.current;
    h && h.scrollHeight - h.scrollTop - h.clientHeight <= Oe && Le();
  }, [Le]), Ft = w(() => {
    const i = x.current;
    if (!i)
      return;
    const h = c.current, f = i.scrollTop;
    c.current = f, f < h && f <= Oe && fe();
  }, [fe]), Vt = w(
    (i) => {
      i.deltaY < 0 && i.currentTarget.scrollTop <= Oe && fe();
    },
    [fe]
  );
  Z(() => {
    if (!o || !e)
      return;
    const i = `${e}:${g}`;
    return oe.current !== i && (oe.current = i, $.reset(), B.current.clear(), Q.current.clear(), k([]), _.current = 0, p(0), A("新会话"), q([]), se.current = 0, ne.current = !1, c.current = 0), Ye(), () => {
      H.current += 1, K.current += 1, ee.current = !1, n.current = !1;
    };
  }, [e, g, Ye, o, $.reset]), Z(() => {
    if (!o || !e) {
      V([]);
      return;
    }
    V([]);
    let i = !0;
    return pn(m.inputConfig, e).then((h) => {
      i && V(h);
    }).catch(() => {
      i && V([]);
    }), () => {
      i = !1;
    };
  }, [e, o, m.inputConfig]);
  const jt = w(
    async (i) => {
      if (!(!i.text.trim() || !e)) {
        if (!_.current && s) {
          O(!0), F("");
          try {
            const h = await xe(d, {
              agentKey: e,
              contextKey: g,
              create: !0,
              title: "新会话",
              limit: ke
            });
            me(h, !0);
          } catch (h) {
            F(ue(h, "创建会话失败。"));
            return;
          } finally {
            O(!1);
          }
        }
        await $.send(i);
      }
    },
    [
      e,
      me,
      d,
      g,
      s,
      $.send
    ]
  );
  return {
    sessionID: T,
    sessionTitle: E,
    sessions: b,
    messages: C,
    sessionsLoading: J,
    sessionsLoadingMore: S,
    sessionLoading: G,
    running: $.running,
    stopping: $.stopping,
    cancelable: $.cancelable,
    sendDisabled: !e || !T && !s || G || $.running,
    error: Y,
    inputParams: D,
    sessionListRef: u,
    messageListRef: x,
    openSession: (i) => pe(i, !1),
    startNewSession: Pe,
    renameSession: Bt,
    deleteSession: $t,
    loadMoreSessions: Le,
    loadOlderMessages: fe,
    handleSessionListScroll: zt,
    handleMessageListScroll: Ft,
    handleMessageListWheel: Vt,
    loadReferences: _t,
    loadReferencePreview: qt,
    send: jt,
    stop: $.stop
  };
}
function Ca(e) {
  return new Promise((t) => window.setTimeout(t, e));
}
const we = 10;
function Ma({
  controller: e
}) {
  const t = Ae(
    () => e.messages.filter(Aa),
    [e.messages]
  ), o = JSON.stringify(
    t.map((p) => p.id)
  ), [r, s] = z(""), [l, d] = z(0), m = j(null);
  Z(() => {
    const p = e.messageListRef.current, E = JSON.parse(o);
    if (!p || E.length === 0) {
      s("");
      return;
    }
    let A = 0;
    const C = () => {
      A = 0;
      const J = Na(p, E);
      s(
        (M) => M === J ? M : J
      );
    }, q = () => {
      A || (A = window.requestAnimationFrame(C));
    };
    return p.addEventListener("scroll", q, { passive: !0 }), window.addEventListener("resize", q), q(), () => {
      p.removeEventListener("scroll", q), window.removeEventListener("resize", q), A && window.cancelAnimationFrame(A);
    };
  }, [e.messageListRef, o]), Z(() => {
    const p = JSON.parse(o), E = p.indexOf(r);
    d((A) => E < 0 ? He(A, p.length) : Ta(E, p.length));
  }, [r, o]), Z(() => {
    m.current && r && Ea(m.current, r);
  }, [r, o]);
  const v = w(
    (p) => {
      const E = e.messageListRef.current, A = E ? Ra(E, p) : null;
      if (!E || !A)
        return;
      const C = E.getBoundingClientRect(), q = A.getBoundingClientRect();
      s(p), E.scrollTo({
        top: Math.max(
          0,
          E.scrollTop + q.top - C.top - 24
        ),
        behavior: "smooth"
      });
    },
    [e.messageListRef]
  ), g = w(
    (p) => {
      d(
        (E) => He(
          E + p * we,
          t.length
        )
      );
    },
    [t.length]
  );
  if (t.length < 2)
    return null;
  const b = t.slice(
    l,
    l + we
  ), k = l > 0, T = l + we < t.length;
  return /* @__PURE__ */ R("nav", { className: "agent-chat-message-navigator", "aria-label": "用户消息快速跳转", children: [
    /* @__PURE__ */ a("style", { children: Pa }),
    /* @__PURE__ */ R("div", { className: "agent-chat-message-navigator-controls", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示上一组消息",
          "aria-label": "显示上一组用户消息",
          disabled: !k,
          onClick: () => g(-1),
          children: /* @__PURE__ */ a(Yt, {})
        }
      ),
      /* @__PURE__ */ a("div", { className: "agent-chat-message-navigator-rail", children: b.map((p, E) => /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-mark",
          "data-active": p.id === r ? "true" : void 0,
          title: `跳转到：${vt(p.text)}`,
          "aria-label": `跳转到第 ${l + E + 1} 条用户消息`,
          "aria-current": p.id === r ? "location" : void 0,
          onClick: () => v(p.id)
        },
        p.id
      )) }),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "agent-chat-message-navigator-page",
          title: "显示下一组消息",
          "aria-label": "显示下一组用户消息",
          disabled: !T,
          onClick: () => g(1),
          children: /* @__PURE__ */ a(Xt, {})
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { ref: m, className: "agent-chat-message-navigator-panel", children: b.map((p) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "agent-chat-message-navigator-item",
        "data-navigator-message-id": p.id,
        "data-active": p.id === r ? "true" : void 0,
        onClick: () => v(p.id),
        children: vt(p.text)
      },
      p.id
    )) })
  ] });
}
function Aa(e) {
  return e.role === "user";
}
function Na(e, t) {
  const o = e.getBoundingClientRect(), r = o.top + Math.min(o.height * 0.28, 220), s = Rt(e);
  let l = t[0] || "";
  for (const d of t) {
    const m = s.get(d);
    if (m) {
      if (m.getBoundingClientRect().top > r)
        break;
      l = d;
    }
  }
  return l;
}
function Ra(e, t) {
  return Rt(e).get(t);
}
function Rt(e) {
  return new Map(
    Array.from(
      e.querySelectorAll("[data-message-id]")
    ).map((t) => [t.dataset.messageId || "", t])
  );
}
function vt(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  if (!t)
    return "空消息";
  const o = Array.from(t);
  return o.length > 46 ? `${o.slice(0, 46).join("")}...` : t;
}
function Ta(e, t) {
  return He(
    e - Math.floor(we / 2),
    t
  );
}
function He(e, t) {
  return Math.min(
    Math.max(0, t - we),
    Math.max(0, e)
  );
}
function Ea(e, t) {
  const o = Array.from(
    e.querySelectorAll("[data-navigator-message-id]")
  ).find((m) => m.dataset.navigatorMessageId === t);
  if (!o)
    return;
  const r = o.offsetTop, s = r + o.offsetHeight, l = e.scrollTop + 8, d = e.scrollTop + e.clientHeight - 8;
  r < l ? e.scrollTop = Math.max(0, r - 8) : s > d && (e.scrollTop = s - e.clientHeight + 8);
}
const Pa = `
.agent-chat-message-navigator {
  position: absolute;
  top: 45%;
  right: 16px;
  z-index: 9;
  width: 26px;
  transform: translateY(-50%);
}

.agent-chat-message-navigator-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.agent-chat-message-navigator-page {
  display: flex;
  width: 26px;
  height: 22px;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-page:hover,
.agent-chat-message-navigator-page:focus-visible {
  outline: none;
  background: var(--muted);
  color: var(--foreground);
}

.agent-chat-message-navigator-page:disabled {
  visibility: hidden;
  pointer-events: none;
}

.agent-chat-message-navigator-page svg {
  width: 15px;
  height: 15px;
}

.agent-chat-message-navigator-rail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
  padding: 5px 2px;
}

.agent-chat-message-navigator-mark {
  display: block;
  width: 22px;
  height: 2px;
  flex: 0 0 2px;
  border: 0;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 52%, transparent);
  cursor: pointer;
  transition: width 140ms ease, height 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-mark:hover,
.agent-chat-message-navigator-mark:focus-visible {
  width: 24px;
  height: 3px;
  flex-basis: 3px;
  outline: none;
  background: var(--foreground);
}

.agent-chat-message-navigator-mark[data-active="true"] {
  height: 3px;
  flex-basis: 3px;
  background: var(--foreground);
}

.agent-chat-message-navigator-panel {
  position: absolute;
  top: 50%;
  right: 26px;
  box-sizing: border-box;
  display: flex;
  width: min(360px, calc(100vw - 96px));
  max-height: 54vh;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  visibility: hidden;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--background);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.14),
    0 4px 14px rgba(15, 23, 42, 0.08);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(8px) scale(0.98);
  transform-origin: right center;
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    visibility 140ms ease;
  scrollbar-color: color-mix(in oklab, var(--muted-foreground) 42%, transparent) transparent;
  scrollbar-width: thin;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar {
  width: 6px;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 42%, transparent);
}

.agent-chat-message-navigator:hover .agent-chat-message-navigator-panel,
.agent-chat-message-navigator:focus-within .agent-chat-message-navigator-panel {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(-50%) translateX(0) scale(1);
}

.agent-chat-message-navigator-item {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: transparent;
  padding: 9px 12px;
  color: var(--foreground);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.agent-chat-message-navigator-item:hover,
.agent-chat-message-navigator-item:focus-visible,
.agent-chat-message-navigator-item[data-active="true"] {
  outline: none;
  background: var(--muted);
}

@media (max-width: 767px) {
  .agent-chat-message-navigator {
    display: none;
  }
}
`, Ue = Re.cn, Tt = Gn, La = Tt.ReferenceComposer, _a = Tt.ReferenceContentView, wt = "agent-chat-column";
function qa({
  controller: e,
  clipboardImageUploadRuleId: t,
  uploadBizKey: o,
  uploadBizName: r,
  allowResourceLibrary: s,
  onUploadedFiles: l,
  renderMessageActions: d,
  renderArtifactActions: m,
  onOpenDocument: v,
  referenceProviders: g = []
}) {
  const b = [
    ...g,
    {
      trigger: "#",
      referenceTypes: ["message", "artifact", "upload_file", "session"],
      loadReferences: e.loadReferences,
      loadPreview: e.loadReferencePreview,
      availableScopes: ["current", "history"],
      searchPlaceholder: "搜索消息或会话"
    }
  ], k = Fa(
    b,
    e.loadReferencePreview
  );
  return /* @__PURE__ */ R(he.Root, { className: "agent-chat-thread relative flex min-h-0 flex-1 flex-col bg-background", children: [
    /* @__PURE__ */ a("style", { children: Ha }),
    /* @__PURE__ */ R(he.ViewportProvider, { children: [
      /* @__PURE__ */ a(
        he.Viewport,
        {
          ref: e.messageListRef,
          autoScroll: !0,
          turnAnchor: "bottom",
          scrollToBottomOnInitialize: !0,
          scrollToBottomOnRunStart: !0,
          className: "relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto",
          style: { scrollbarGutter: "stable" },
          onScroll: e.handleMessageListScroll,
          onWheel: e.handleMessageListWheel,
          children: /* @__PURE__ */ a(
            "div",
            {
              className: Ue(
                wt,
                "agent-chat-message-column flex min-h-full flex-col"
              ),
              children: e.sessionLoading && e.messages.length === 0 ? /* @__PURE__ */ a("div", { className: "agent-chat-empty-state text-muted-foreground", children: /* @__PURE__ */ a(Ce, { className: "size-5 animate-spin" }) }) : e.messages.length === 0 ? /* @__PURE__ */ R("div", { className: "agent-chat-empty-state", children: [
                /* @__PURE__ */ a("span", { className: "flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ a(Zt, { className: "size-5" }) }),
                /* @__PURE__ */ a("span", { className: "text-sm text-muted-foreground", children: "开始一段新对话" })
              ] }) : /* @__PURE__ */ a("div", { className: "agent-chat-message-stack flex flex-col", children: /* @__PURE__ */ a(he.Messages, { children: () => /* @__PURE__ */ a(
                Oa,
                {
                  controller: e,
                  loadPreview: k,
                  renderMessageActions: d,
                  renderArtifactActions: m,
                  onOpenDocument: v
                }
              ) }) })
            }
          )
        }
      ),
      /* @__PURE__ */ a(Ma, { controller: e }),
      /* @__PURE__ */ R(
        "footer",
        {
          className: "agent-chat-footer shrink-0",
          style: {
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
          },
          children: [
            /* @__PURE__ */ a(
              he.ScrollToBottom,
              {
                behavior: "smooth",
                className: "agent-chat-scroll-to-bottom",
                title: "回到底部",
                "aria-label": "回到底部",
                children: /* @__PURE__ */ a(Jt, {})
              }
            ),
            /* @__PURE__ */ R("div", { className: wt, children: [
              e.error ? /* @__PURE__ */ a("div", { className: "mb-2 text-sm text-destructive", children: e.error }) : null,
              /* @__PURE__ */ a(
                za,
                {
                  controller: e,
                  referenceProviders: b,
                  clipboardImageUploadRuleId: t,
                  uploadBizKey: o,
                  uploadBizName: r,
                  allowResourceLibrary: s,
                  onUploadedFiles: l
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Oa({
  controller: e,
  loadPreview: t,
  renderMessageActions: o,
  renderArtifactActions: r,
  onOpenDocument: s
}) {
  return X((d) => d.message.role) === "user" ? /* @__PURE__ */ a(
    Ba,
    {
      controller: e,
      loadPreview: t,
      renderMessageActions: o
    }
  ) : /* @__PURE__ */ a(
    $a,
    {
      controller: e,
      loadPreview: t,
      renderMessageActions: o,
      renderArtifactActions: r,
      onOpenDocument: s
    }
  );
}
function Ba({
  controller: e,
  loadPreview: t,
  renderMessageActions: o
}) {
  const r = X(
    (l) => l.message.metadata.custom?.content
  ), s = X(
    (l) => l.message.metadata.custom?.sourceText
  );
  return /* @__PURE__ */ R(Fe.Root, { className: "agent-chat-message agent-chat-user-message relative flex flex-col items-end pl-6 md:pl-20", children: [
    /* @__PURE__ */ a("div", { className: "agent-chat-user-bubble max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full", children: /* @__PURE__ */ a(
      _a,
      {
        content: r,
        fallback: typeof s == "string" ? s : "",
        loadPreview: t
      }
    ) }),
    /* @__PURE__ */ a(
      Et,
      {
        role: "user",
        sessionTitle: e.sessionTitle,
        renderMessageActions: o
      }
    )
  ] });
}
function $a({
  controller: e,
  loadPreview: t,
  renderMessageActions: o,
  renderArtifactActions: r,
  onOpenDocument: s
}) {
  const l = X((S) => S.message.status), d = X((S) => S.message.metadata.custom?.output), m = X(
    (S) => S.message.metadata.custom?.activities
  ), v = X(
    (S) => S.message.metadata.custom?.sourceText
  ), g = X(
    (S) => S.message.metadata.custom?.document
  ), b = zn(g), k = Number(
    X((S) => S.message.metadata.custom?.recordID) || 0
  ), T = Array.isArray(m) ? m : [], p = Fn(d), E = p?.id ? Vn(e.messages, p.id) : void 0, A = jn(d), C = Hn(d), q = l?.type === "incomplete" && l.reason === "error", J = !!(g && l?.type === "running" && !Ne(g) && !C), M = ja(
    l?.type === "running",
    T,
    v
  );
  return /* @__PURE__ */ a(
    Fe.Root,
    {
      className: Ue(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        q && "text-destructive"
      ),
      children: /* @__PURE__ */ R(
        fn,
        {
          messageID: k,
          render: r,
          children: [
            g ? /* @__PURE__ */ R(ze, { children: [
              b ? /* @__PURE__ */ a(Je, { text: b, error: q }) : null,
              /* @__PURE__ */ a(
                hn,
                {
                  document: g,
                  onOpen: s
                }
              ),
              J ? /* @__PURE__ */ a(yt, {}) : null,
              C ? /* @__PURE__ */ a(
                Je,
                {
                  text: C,
                  error: q,
                  className: "mt-4"
                }
              ) : null
            ] }) : /* @__PURE__ */ R(ze, { children: [
              /* @__PURE__ */ a(Fe.Parts, { children: ({ part: S }) => {
                if (S.type === "text")
                  return S.status.type === "running" && !S.text && T.length === 0 ? /* @__PURE__ */ a(Va, {}) : S.text ? /* @__PURE__ */ a(xn, { error: q }) : null;
                if (S.type === "tool-call") {
                  const L = T.find(
                    (G) => G.id === S.toolCallId
                  );
                  return /* @__PURE__ */ a(bn, { activity: L });
                }
                return null;
              } }),
              M ? /* @__PURE__ */ a(yt, {}) : null,
              /* @__PURE__ */ a(
                vn,
                {
                  output: d,
                  excludeOutputs: T.map(
                    (S) => S.output
                  ),
                  excludeText: typeof v == "string" ? v : ""
                }
              )
            ] }),
            p ? /* @__PURE__ */ a(
              wn,
              {
                interaction: p,
                response: E,
                disabled: e.sendDisabled,
                onSubmit: (S) => {
                  e.send(
                    yn(
                      p.id || "",
                      S.text,
                      S.data
                    )
                  );
                }
              }
            ) : null,
            /* @__PURE__ */ a(
              Dn,
              {
                suggestions: A,
                disabled: e.sendDisabled,
                onSelect: (S) => {
                  e.send(St(S.prompt));
                }
              }
            ),
            /* @__PURE__ */ a(
              Et,
              {
                role: "assistant",
                sessionTitle: e.sessionTitle,
                renderMessageActions: o
              }
            )
          ]
        }
      )
    }
  );
}
function Et({
  role: e,
  sessionTitle: t,
  renderMessageActions: o
}) {
  const r = X((L) => L.message.status), s = Number(
    X((L) => L.message.metadata.custom?.recordID) || 0
  ), l = String(
    X((L) => L.message.metadata.custom?.requestID) || ""
  ), d = String(
    X((L) => L.message.metadata.custom?.createdAt) || ""
  ), m = X(
    (L) => L.message.metadata.custom?.sourceText
  ), v = X(
    (L) => L.message.metadata.custom?.document
  ), g = X((L) => L.message.metadata.custom?.output), b = X(
    (L) => L.message.parts.filter((G) => G.type === "text").map((G) => G.text).join(`
`)
  ), k = v?.hydrated ? Wn(v) : typeof m == "string" && m.trim() ? m : b, [T, p] = z(!1), [E, A] = z(!1), C = j(null);
  Z(
    () => () => {
      C.current != null && window.clearTimeout(C.current);
    },
    []
  );
  const q = () => {
    C.current != null && window.clearTimeout(C.current), C.current = window.setTimeout(() => {
      p(!1), A(!1), C.current = null;
    }, 1800);
  }, J = async () => {
    if (k.trim()) {
      A(!1);
      try {
        await Nn(k), p(!0);
      } catch {
        p(!1), A(!0);
      }
      q();
    }
  }, M = !k.trim() || e === "assistant" && r?.type === "running", S = Nt(g).some(
    (L) => L.status === "generating"
  ) || !!(v && Ne(v));
  return /* @__PURE__ */ R(
    sn.Root,
    {
      className: Ue(
        "agent-chat-message-actions",
        e === "user" && "justify-end"
      ),
      "data-message-role": e,
      children: [
        /* @__PURE__ */ a(
          Ct,
          {
            label: E ? "复制失败，请手动选择消息文本" : T ? "已复制" : "复制",
            children: /* @__PURE__ */ R(
              "button",
              {
                type: "button",
                className: "agent-chat-message-action agent-chat-copy-action",
                "aria-label": T ? "消息已复制" : "复制消息",
                "data-copied": T ? "true" : void 0,
                "data-copy-failed": E ? "true" : void 0,
                disabled: M,
                onClick: () => {
                  J();
                },
                children: [
                  /* @__PURE__ */ a(Qt, { className: "agent-chat-copy-icon", "aria-hidden": "true" }),
                  /* @__PURE__ */ a(Kt, { className: "agent-chat-copied-icon", "aria-hidden": "true" })
                ]
              }
            )
          }
        ),
        o?.({
          role: e,
          recordID: s,
          requestID: l,
          sessionTitle: t,
          createdAt: d,
          running: r?.type === "running",
          error: r?.type === "incomplete",
          hasPendingArtifacts: S,
          document: v
        })
      ]
    }
  );
}
function za({
  controller: e,
  clipboardImageUploadRuleId: t,
  uploadBizKey: o,
  uploadBizName: r,
  allowResourceLibrary: s,
  onUploadedFiles: l,
  referenceProviders: d
}) {
  return /* @__PURE__ */ a(
    La,
    {
      placeholder: "发消息",
      disabled: e.sendDisabled && !e.running,
      running: e.running,
      stopping: e.stopping,
      cancelable: e.cancelable,
      layerZIndex: Me,
      clipboardImageUploadRuleId: t,
      uploadBizKey: o,
      uploadBizName: r,
      allowResourceLibrary: s,
      onUploadedFiles: l,
      parameters: e.inputParams,
      providers: d,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      loadReferences: e.loadReferences,
      loadPreview: e.loadReferencePreview,
      onSubmit: e.send,
      onCancel: e.stop
    }
  );
}
function Fa(e, t) {
  return (o) => {
    const r = e.find(
      (s) => s.referenceTypes.includes(o.refType)
    );
    return r?.loadPreview ? r.loadPreview(o) : t(o);
  };
}
function Va() {
  return /* @__PURE__ */ a(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在生成",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((e) => /* @__PURE__ */ a(
        "span",
        {
          className: "agent-chat-waiting-dot",
          style: { animationDelay: `${e * 140}ms` }
        },
        e
      ))
    }
  );
}
function yt() {
  return /* @__PURE__ */ a(
    "div",
    {
      role: "status",
      "aria-label": "智能体正在执行下一步",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ a("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
function ja(e, t, o) {
  if (!e)
    return !1;
  const r = t.at(-1);
  return !r || r.kind !== "knowledge" && r.kind !== "skill" || r.status === "running" ? !1 : String(o || "").trimEnd() === r.anchorText.trimEnd();
}
const Ha = `
.agent-chat-column {
  box-sizing: border-box;
  width: 100%;
  max-width: 1040px;
  margin-inline: auto;
  padding-inline: 24px;
}

.agent-chat-message-column {
  padding-top: 24px;
}

.agent-chat-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  pointer-events: none;
}

.agent-chat-message-stack {
  gap: 28px;
  padding-bottom: 88px;
}

.agent-chat-document {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-chat-document .agent-chat-message-output,
.agent-chat-document .agent-chat-media-grid {
  margin-top: 0;
}

.agent-chat-interaction[data-presentation="stepper"] {
  width: min(52%, 560px);
  min-width: min(100%, 480px);
}

.agent-chat-media-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-width: 968px;
  gap: 8px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.agent-chat-media-grid[data-kind="audio"],
.agent-chat-media-grid[data-kind="file"] {
  max-width: 560px;
  grid-template-columns: minmax(0, 1fr);
}

.agent-chat-media-placeholder {
  isolation: isolate;
  background-color: color-mix(in oklab, var(--muted) 34%, transparent);
  animation: agent-chat-media-surface 1.65s ease-in-out infinite;
}

.agent-chat-media-placeholder::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  background: linear-gradient(
    105deg,
    transparent 20%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 40%,
    color-mix(in oklab, var(--background) 90%, transparent) 50%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 60%,
    transparent 80%
  );
  transform: translateX(-110%);
  animation: agent-chat-media-shimmer 1.65s ease-in-out infinite;
  pointer-events: none;
}

.agent-chat-media-placeholder-icon {
  z-index: 2;
  animation: agent-chat-media-icon 1.65s ease-in-out infinite;
}

.agent-chat-media-spinner {
  animation: agent-chat-media-spinner 0.95s linear infinite;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 968px !important;
  gap: 8px !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div {
  min-width: 0;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button {
  width: 100% !important;
  aspect-ratio: var(--agent-chat-media-aspect-ratio, 4 / 3) !important;
  border-radius: 8px !important;
  background: transparent !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button > img {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px !important;
  object-fit: cover !important;
}

.agent-chat-user-message {
  scroll-margin-top: 24px;
}

.agent-chat-message-actions {
  display: flex;
  width: 100%;
  min-height: 28px;
  margin-top: 4px;
  align-items: center;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.agent-chat-message:hover .agent-chat-message-actions,
.agent-chat-message:focus-within .agent-chat-message-actions,
.agent-chat-message-actions:hover {
  opacity: 1;
  pointer-events: auto;
}

.agent-chat-message-action {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

.agent-chat-message-action:hover:not(:disabled),
.agent-chat-message-action:focus-visible {
  background: var(--muted);
  color: var(--foreground);
  outline: none;
}

.agent-chat-message-action:disabled {
  opacity: 0.38;
  cursor: default;
}

.agent-chat-message-action svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

.agent-chat-copied-icon,
.agent-chat-copy-action[data-copied="true"] .agent-chat-copy-icon {
  display: none;
}

.agent-chat-copy-action[data-copied="true"] .agent-chat-copied-icon {
  display: block;
}

.agent-chat-copy-action[data-copy-failed="true"] {
  color: var(--destructive);
}

.agent-chat-footer {
  position: relative;
  z-index: 5;
  padding-top: 12px;
  background: linear-gradient(to bottom, transparent, var(--background) 24px);
}

.agent-chat-scroll-to-bottom {
  position: absolute;
  top: -50px;
  left: 50%;
  z-index: 6;
  display: flex !important;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--background);
  color: var(--foreground);
  opacity: 1;
  box-shadow:
    0 8px 22px rgba(15, 23, 42, 0.12),
    0 2px 7px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transform: translateX(-50%);
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.agent-chat-scroll-to-bottom:hover:not(:disabled) {
  box-shadow:
    0 10px 26px rgba(15, 23, 42, 0.16),
    0 3px 9px rgba(15, 23, 42, 0.1);
  transform: translateX(-50%) translateY(-1px);
}

.agent-chat-scroll-to-bottom:disabled {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(8px);
}

.agent-chat-scroll-to-bottom svg {
  width: 20px;
  height: 20px;
}

@keyframes agent-chat-waiting-dot {
  0%, 60%, 100% { opacity: 0.22; transform: translateY(0); }
  30% { opacity: 0.82; transform: translateY(-2px); }
}

@keyframes agent-chat-media-shimmer {
  0% { transform: translateX(-110%); }
  58%, 100% { transform: translateX(110%); }
}

@keyframes agent-chat-media-surface {
  0%, 100% {
    border-color: color-mix(in oklab, var(--border) 82%, transparent);
    background-color: color-mix(in oklab, var(--muted) 30%, transparent);
  }
  50% {
    border-color: color-mix(in oklab, var(--foreground) 14%, transparent);
    background-color: color-mix(in oklab, var(--muted) 50%, transparent);
  }
}

@keyframes agent-chat-media-icon {
  0%, 100% { opacity: 0.28; transform: scale(0.96); }
  50% { opacity: 0.58; transform: scale(1); }
}

@keyframes agent-chat-media-spinner {
  to { transform: rotate(360deg); }
}

@keyframes agent-chat-streaming-tail {
  0%, 100% { opacity: 0.24; transform: scale(0.78); }
  50% { opacity: 0.9; transform: scale(1); }
}

.agent-chat-waiting-indicator {
  display: flex;
  height: 18px;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
}

.agent-chat-waiting-dot {
  display: block;
  width: 4px;
  height: 4px;
  flex: 0 0 4px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-waiting-dot 1.05s ease-in-out infinite;
}

.agent-chat-next-step-indicator {
  display: flex;
  height: 18px;
  margin-top: 4px;
  align-items: center;
  color: var(--foreground);
}

.agent-chat-pulse-dot {
  display: block;
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

.agent-chat-markdown[data-status="running"] > :last-child:not(ul):not(ol)::after,
.agent-chat-markdown[data-status="running"] > :last-child:is(ul, ol) > li:last-child::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 9999px;
  vertical-align: 0.08em;
  pointer-events: none;
  background: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-column {
  padding-inline: 20px;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-media-grid,
[data-agent-chat-layer="true"][data-media-inspector-open="true"]
  .agent-chat-media-result[data-kind="image"]
  .agent-chat-activity-output
  .grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-message-navigator {
  display: none;
}

@media (max-width: 767px) {
  .agent-chat-column {
    padding-inline: 14px;
  }

  .agent-chat-message-column {
    padding-top: 16px;
  }

  .agent-chat-message-stack {
    gap: 20px;
    padding-bottom: 56px;
  }

  .agent-chat-interaction[data-presentation="stepper"] {
    width: 100%;
    min-width: 0;
  }

  .agent-chat-media-grid {
    max-width: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
    max-width: none !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .agent-chat-footer {
    padding-top: 8px;
  }

  .agent-chat-scroll-to-bottom {
    top: -44px;
    width: 36px;
    height: 36px;
  }

  .agent-chat-scroll-to-bottom svg {
    width: 18px;
    height: 18px;
  }

}

@media (hover: none) {
  .agent-chat-message-actions {
    opacity: 1;
    pointer-events: auto;
  }
}

`, Se = nn.getStoreValueByPath, Be = kt.streamValueText, Dt = Re.cn, $e = Ge.Button, Wa = re.Dialog, Ga = re.DialogContent, Ua = re.DialogDescription, Ya = re.DialogHeader, Xa = re.DialogTitle;
function Za({ item: e, store: t }) {
  const o = De(
    t,
    () => Be(Se(t, String(e.meta?.agentPath || "")))
  ), r = De(
    t,
    () => Be(
      Se(t, String(e.meta?.agentNamePath || ""))
    )
  ), s = String(e.meta?.openPath || ""), l = De(
    t,
    () => s ? !!Se(t, s) : !0
  ), d = String(e.meta?.openingEnabledPath || ""), m = De(
    t,
    () => d ? !!Se(t, d) : !!e.meta?.proactiveOpening
  ), v = Ae(
    () => ({
      session: String(e.meta?.sessionApi || "/bot/admin/assistant/session"),
      sessions: String(
        e.meta?.sessionsApi || "/bot/admin/assistant/sessions"
      ),
      newSession: String(
        e.meta?.newSessionApi || "/bot/admin/assistant/new_session"
      ),
      renameSession: String(
        e.meta?.renameSessionApi || "/bot/admin/assistant/rename_session"
      ),
      archiveSession: String(
        e.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session"
      )
    }),
    [
      e.meta?.archiveSessionApi,
      e.meta?.newSessionApi,
      e.meta?.renameSessionApi,
      e.meta?.sessionApi,
      e.meta?.sessionsApi
    ]
  ), g = Ae(
    () => ({
      request: String(e.meta?.requestApi || "/bot/admin/agent_runtime/run"),
      opening: String(
        e.meta?.openingApi || "/bot/admin/agent_runtime/opening"
      ),
      stream: String(e.meta?.streamApi || "/bot/admin/agent_runtime/stream"),
      stop: String(e.meta?.stopApi || "/bot/admin/agent_runtime/stop"),
      status: String(e.meta?.statusApi || "/bot/admin/agent_runtime/status"),
      referencePreview: String(
        e.meta?.referencePreviewApi || "/bot/admin/agent_runtime/reference_preview"
      ),
      inputConfig: String(
        e.meta?.inputConfigApi || "/bot/admin/agent_runtime/input_config"
      ),
      document: String(
        e.meta?.documentApi || "/bot/admin/agent_runtime/document"
      ),
      documentStream: String(
        e.meta?.documentStreamApi || "/bot/admin/agent_runtime/document_stream"
      )
    }),
    [
      e.meta?.documentApi,
      e.meta?.documentStreamApi,
      e.meta?.inputConfigApi,
      e.meta?.openingApi,
      e.meta?.referencePreviewApi,
      e.meta?.requestApi,
      e.meta?.statusApi,
      e.meta?.stopApi,
      e.meta?.streamApi
    ]
  ), b = w(() => {
    s && t.getState().setValueByPath(s, !1);
  }, [s, t]);
  return /* @__PURE__ */ a(
    Ja,
    {
      agentKey: o,
      agentName: r,
      open: l,
      fullScreen: !!s,
      height: Be(e.meta?.height || e.meta?.containerHeight) || "min(78dvh, 720px)",
      clipboardImageUploadRuleId: Number(
        e.meta?.clipboardImageUploadRuleId || 0
      ),
      blockMs: Number(e.meta?.blockMs || 1e3),
      proactiveOpening: m,
      assistantApi: v,
      runtimeApi: g,
      onClose: b
    }
  );
}
function Ja({
  agentKey: e,
  agentName: t = "",
  contextKey: o,
  open: r = !0,
  height: s = "min(78dvh, 720px)",
  minHeight: l = "min(420px, 78dvh)",
  fullScreen: d = !1,
  lazySession: m = !1,
  proactiveOpening: v = !1,
  mobileSessionNavigation: g = !1,
  appearance: b = "default",
  sidebarTitle: k,
  clipboardImageUploadRuleId: T = 0,
  uploadBizKey: p,
  uploadBizName: E,
  allowResourceLibrary: A = !0,
  onUploadedFiles: C,
  blockMs: q = 1e3,
  assistantApi: J,
  runtimeApi: M,
  requestScope: S,
  referenceProviders: L,
  renderMessageActions: G,
  renderArtifactActions: O,
  renderDocumentActions: Y,
  onClose: F
}) {
  const D = Sa({
    agentKey: e,
    contextKey: o,
    modalOpen: r,
    blockMs: q,
    lazySession: m,
    proactiveOpening: v,
    assistantApi: J,
    runtimeApi: M,
    requestScope: S
  }), V = In(), _ = V.open && V.request?.kind !== "audio" && V.request?.kind !== "file", [B, Q] = z("chat"), oe = j(null), [H, K] = z(0), [se, ne] = z(!1), ee = j(/* @__PURE__ */ new Set()), n = Ae(
    () => D.messages.find(
      (W) => W.document?.id === H
    ),
    [H, D.messages]
  ), c = n?.document, u = !!(se && c && !_);
  Z(() => {
    V.closePreview();
  }, [e, D.sessionID, V.closePreview, r]), Z(() => {
    Q("chat");
  }, [e, o, g]), Z(() => {
    K(0), ne(!1);
  }, [e, o, D.sessionID]), Z(() => {
    ee.current.clear();
  }, [e, o]), Z(() => {
    const le = [...D.messages].reverse().find((ye) => ye.autoOpenDocument && ye.document)?.document?.id || 0, ie = `${D.sessionID}:${le}`;
    !le || ee.current.has(ie) || (ee.current.add(ie), K(le), ne(!0));
  }, [D.messages, D.sessionID]);
  const x = w((W) => {
    K(W.id), ne(!0);
  }, []), I = w(
    async (W) => {
      await D.openSession(W), Q("chat");
    },
    [D.openSession]
  ), P = w(async () => {
    await D.startNewSession(), Q("chat");
  }, [D.startNewSession]);
  if (!r)
    return null;
  const U = /* @__PURE__ */ a(Cn, { controller: V, children: /* @__PURE__ */ R(
    "div",
    {
      ref: oe,
      "data-agent-chat-layer": "true",
      "data-agent-chat-appearance": b,
      "data-media-inspector-open": _ ? "true" : void 0,
      className: Dt(
        "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        d ? "h-full flex-1" : "border-y"
      ),
      style: d ? void 0 : { height: s, minHeight: l },
      children: [
        /* @__PURE__ */ a(
          dt,
          {
            agentName: t,
            title: k,
            agentReady: !!e,
            controller: D,
            collapsed: _
          }
        ),
        g && B === "sessions" ? /* @__PURE__ */ a(
          dt,
          {
            mobile: !0,
            agentName: t,
            title: k,
            agentReady: !!e,
            controller: D,
            onOpenSession: I,
            onStartNewSession: P
          }
        ) : null,
        /* @__PURE__ */ R(
          "section",
          {
            className: Dt(
              "min-h-0 min-w-0 flex-1 flex-col bg-background",
              g && B === "sessions" ? "hidden md:flex" : "flex",
              _ && "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none"
            ),
            children: [
              /* @__PURE__ */ R("header", { className: "agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6", children: [
                g ? /* @__PURE__ */ R(
                  $e,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "返回会话列表",
                    onClick: () => Q("sessions"),
                    children: [
                      /* @__PURE__ */ a(en, { className: "size-4" }),
                      /* @__PURE__ */ a("span", { className: "sr-only", children: "返回会话列表" })
                    ]
                  }
                ) : null,
                /* @__PURE__ */ a("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ a("div", { className: "truncate text-sm font-semibold text-foreground", children: D.sessionTitle || "新会话" }) }),
                /* @__PURE__ */ R(
                  $e,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:hidden",
                    title: "新对话",
                    disabled: D.sessionLoading || !e,
                    onClick: () => {
                      P();
                    },
                    children: [
                      /* @__PURE__ */ a(It, { className: "size-4" }),
                      /* @__PURE__ */ a("span", { className: "sr-only", children: "新对话" })
                    ]
                  }
                ),
                d && !V.open ? /* @__PURE__ */ R(
                  $e,
                  {
                    type: "button",
                    size: "icon",
                    variant: "ghost",
                    className: "size-10 shrink-0 md:size-8",
                    title: "关闭运行智能体",
                    onClick: F,
                    children: [
                      /* @__PURE__ */ a(tn, { className: "size-4" }),
                      /* @__PURE__ */ a("span", { className: "sr-only", children: "关闭运行智能体" })
                    ]
                  }
                ) : null
              ] }),
              /* @__PURE__ */ a(
                Un,
                {
                  controller: D,
                  children: /* @__PURE__ */ a(
                    qa,
                    {
                      controller: D,
                      clipboardImageUploadRuleId: T,
                      uploadBizKey: p,
                      uploadBizName: E,
                      allowResourceLibrary: A,
                      onUploadedFiles: C,
                      referenceProviders: L,
                      renderMessageActions: G,
                      renderArtifactActions: O,
                      onOpenDocument: x
                    }
                  )
                },
                `${e}:${o || "default"}:${D.sessionID || "draft"}`
              )
            ]
          }
        ),
        c ? /* @__PURE__ */ a(
          kn,
          {
            open: u,
            portalContainer: oe.current,
            document: c,
            messageID: n?.recordID || 0,
            renderArtifactActions: O,
            renderDocumentActions: Y,
            onClose: () => ne(!1)
          }
        ) : null,
        /* @__PURE__ */ a(
          Sn,
          {
            controller: V,
            renderArtifactActions: O
          }
        )
      ]
    }
  ) });
  return d ? /* @__PURE__ */ a(
    Wa,
    {
      open: r,
      onOpenChange: (W) => {
        W || F?.();
      },
      children: /* @__PURE__ */ R(
        Ga,
        {
          layerClassName: Tn,
          layerZIndex: Rn,
          showCloseButton: !1,
          className: "!fixed !left-0 !top-0 !flex !h-[100dvh] !max-h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 !flex-col !gap-0 !overflow-hidden !rounded-none !border-0 bg-background !p-0 text-foreground shadow-none sm:!max-w-none",
          style: {
            position: "fixed",
            inset: 0,
            left: 0,
            top: 0,
            width: "100vw",
            maxWidth: "none",
            height: "100dvh",
            maxHeight: "100dvh",
            transform: "none",
            translate: "0 0",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            padding: 0,
            border: 0,
            borderRadius: 0,
            boxSizing: "border-box",
            pointerEvents: "auto"
          },
          children: [
            /* @__PURE__ */ R(Ya, { className: "sr-only", children: [
              /* @__PURE__ */ a(Xa, { children: "运行智能体" }),
              /* @__PURE__ */ a(Ua, { children: t || e || "智能体对话" })
            ] }),
            U
          ]
        }
      )
    }
  ) : U;
}
const pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowAgentChat: Za
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ja as A,
  pr as a
};
