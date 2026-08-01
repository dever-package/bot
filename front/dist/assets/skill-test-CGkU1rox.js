import { c as Xe, a as u, j as a } from "./createLucideIcon-CEtb6KSk.js";
import { c as re, u as b, a as ie, b as Pt, r as wt, f as We } from "./runtime-entry-CIrzyMsA.js";
import { u as ft } from "./react-DlzYln-Z.js";
import { C as Ye } from "./circle-check-DjAs7CDF.js";
import { C as Qe } from "./circle-x-C9cmJm4R.js";
import { L as F } from "./loader-circle-QnfinZ3F.js";
import { S as Ze } from "./sparkles-BKIkAh44.js";
import { P as ts } from "./play-cbWwOmIe.js";
import { S as es } from "./square-BLHlcv3k.js";
import { T as ss } from "./trash-2-EsqTj1ob.js";
import { m as he, r as ns, i as h, a as ye, A as as, b as rs } from "./skill-draft-patch-butj1uQW.js";
import { m as is, a as qt } from "./stream-BdPqUizK.js";
import { m as os } from "./store-EYzASISC.js";
import { m as ls } from "./utils-ByoKKFQ_.js";
import { m as cs } from "./button-DxSljrwo.js";
import { m as nt } from "./dialog-ipYtDwR0.js";
import { m as us } from "./input-CcuZdnzx.js";
import { m as at } from "./select-CpECJwtQ.js";
import { m as ds } from "./textarea-CKNBbJNL.js";
const ps = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
], ms = Xe("cloud-upload", ps), oe = he.runAgentStream, fs = he.stopAgentStream, gs = rs.reloadStorePageSchema, hs = qt.normalizeRuntimeFrameOutput, le = qt.resolveRuntimeFrameCancelable, et = qt.runtimeErrorMessage, J = os.getStoreValueByPath, l = is.streamValueText, Ot = ls.cn, M = cs.Button, ys = nt.Dialog, bs = nt.DialogContent, xs = nt.DialogDescription, ks = nt.DialogHeader, Ss = nt.DialogTitle, $t = us.Input, _s = at.Select, As = at.SelectContent, Ds = at.SelectItem, Ns = at.SelectTrigger, Is = at.SelectValue, be = ds.Textarea, vs = "data.actionTarget.testDraft", Ts = "/bot/admin/skill_draft/test", Ps = "/bot/admin/skill_draft/publish", ws = "/bot/admin/skill_draft/publish_options", Rs = "/bot/admin/skill_draft/apply_patch", Cs = "skill-creator", Es = "min(calc(85vh - 11rem), 620px)", Os = 15, xe = 1, Rt = 2, $s = 3;
function In({ item: t, store: e }) {
  const s = String(t.meta?.draftPath || vs), i = String(t.meta?.openPath || ""), r = ft(e, () => {
    const n = J(e, s);
    return h(n) ? n : {};
  }), o = ft(e, () => l(
    J(e, String(t.meta?.agentPath || ""))
  ) || String(t.meta?.agentKey || Cs)), g = ft(
    e,
    () => l(
      J(e, String(t.meta?.agentNamePath || ""))
    )
  ), T = ft(
    e,
    () => i ? !!J(e, i) : !0
  ), m = w(r.id || r.draft_id || r.draftId), R = Number(r.status || 0) === 1, D = Number(r.status || 0) === 2, gt = re(() => tn(r), [r]), [rt, zt] = b(""), [Ft, Lt] = b({}), [Bt, N] = b([]), [v, L] = b(!1), [Vt, W] = b(!1), [C, Y] = b(!1), [B, it] = b(!1), [I, ot] = b(null), [jt, lt] = b(!1), [P, ht] = b(!1), [yt, bt] = b(D), [xt, ct] = b(!1), [Q, ut] = b(
    () => Et({})
  ), [kt, _e] = b({
    packs: [],
    cates: []
  }), [St, Ut] = b(!1), [Ae, q] = b(""), [Kt, E] = b(""), [dt, V] = b(""), [Ht, j] = b("0-0"), [Jt, $] = b(!1), [_t, At] = b(!1), S = ie(0), pt = ie(""), De = String(t.meta?.testApi || Ts), Ne = String(t.meta?.publishApi || Ps), Ie = String(
    t.meta?.publishOptionsApi || ws
  ), ve = t.meta?.reloadPageOnPublish !== !1, Te = Math.max(
    0,
    Number(t.meta?.reloadPageOnPublishDelayMs || 500)
  ), Gt = String(t.meta?.requestApi || "/bot/admin/agent/run"), Xt = String(t.meta?.streamApi || "/bot/admin/agent/stream"), Dt = String(t.meta?.stopApi || "/bot/admin/agent/stop"), Pe = String(
    t.meta?.sessionApi || "/bot/admin/assistant/session"
  ), U = String(
    t.meta?.messageApi || "/bot/admin/assistant/message"
  ), we = String(
    t.meta?.skillDraftPatchApi || Rs
  ), Re = String(
    t.meta?.draftAssistantOpenPath || "state.dialog.draftAssistant"
  ), Wt = String(
    t.meta?.draftAssistantDraftPath || "data.actionTarget.draftAgent"
  ), Ce = String(
    t.meta?.draftAssistantMetaPath || "data.actionTarget.draftAssistantMeta"
  ), Yt = Number(t.meta?.blockMs || 1e3), Qt = t.meta?.skillDraftAutoRepair !== !1, Ee = l(t.meta?.height || t.meta?.containerHeight) || Es, Oe = String(
    t.meta?.placeholder || "输入测试参数，每行一个；留空表示不带参数运行。"
  ), $e = String(
    t.meta?.emptyText || "输入一次测试参数开始测试。系统会先检查技能内容，再在沙箱中运行脚本。"
  ), Zt = m > 0 && R && !v && !C, Nt = m > 0 && C && B && !v && !P && !yt && R, Me = yt ? "当前技能已发布。" : B ? "测试已通过，可以发布。" : "测试通过后才可以发布。", te = m > 0 && !!o && !!I && C && !B && !v && !P && R;
  Pt(() => {
    T && ne();
  }, [m, T]), Pt(() => {
    !xt || St || ut(
      (n) => Hs(n, kt)
    );
  }, [xt, St, kt]);
  const Z = re(() => nn(rt), [rt]);
  Pt(() => {
    if (!Qt || !T || !o || m <= 0 || v || P || !C || B || !I || !ue(I))
      return;
    const n = js(m, I);
    !n || pt.current === n || (pt.current = n, se());
  }, [
    Qt,
    o,
    m,
    I,
    T,
    P,
    v,
    C,
    B
  ]);
  const ee = async () => {
    if (!Zt)
      return;
    const n = S.current + 1;
    S.current = n, pt.current = "", L(!0), W(!1), Y(!1), it(!1), ot(null), lt(!1), bt(D), E(""), V(""), j("0-0"), $(!1);
    const d = rt.trim() || "不带参数运行测试。", y = `test-${Date.now()}`;
    N([
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: d
      },
      {
        id: y,
        role: "assistant",
        kind: "test",
        text: "正在运行测试...",
        running: !0
      }
    ]);
    try {
      const c = await Ls(
        De,
        m,
        Z,
        en(gt, Ft)
      );
      if (S.current !== n)
        return;
      const f = c.status === 1;
      if (ot(c), it(f), N(
        (x) => x.map(
          (k) => k.id === y ? {
            ...k,
            text: c.msg,
            running: !1,
            result: c
          } : k
        )
      ), !o) {
        Y(!0);
        return;
      }
      if (!f && ue(c))
        return;
      const p = `analysis-${Date.now()}`;
      N((x) => [
        ...x,
        {
          id: p,
          role: "assistant",
          kind: "analysis",
          text: `${g || "技能创建工程师"}正在分析测试结果...`,
          running: !0
        }
      ]), await qe({
        token: n,
        messageID: p,
        testResult: c,
        args: Z
      });
    } catch (c) {
      if (S.current === n) {
        const f = et(c, "测试失败。");
        E(f), N(
          (p) => p.map(
            (x) => x.running ? {
              ...x,
              text: x.kind === "analysis" || !x.result ? f : x.text,
              running: !1,
              error: x.kind === "analysis" || !x.result ? f : x.error
            } : x
          )
        );
      }
    } finally {
      S.current === n && (L(!1), Y(!0), $(!1));
    }
  }, qe = async ({
    token: n,
    messageID: d,
    testResult: y,
    args: c
  }) => {
    await oe({
      agent: o,
      input: {
        text: "请根据这次真实技能测试结果判断是否通过；失败时说明原因和修改建议。",
        draft: Zs(r),
        skill_test: y.data,
        test_status: y.status,
        test_message: y.msg,
        test_args: c
      },
      history: [],
      requestApi: Gt,
      streamApi: Xt,
      stopApi: Dt,
      blockMs: Yt,
      onRequestID: (f) => {
        S.current === n && V(l(f));
      },
      onFrame: (f) => {
        if (S.current !== n)
          return;
        const p = l(f?.stream_id);
        p && j(p);
        const x = le(f);
        x != null && $(x);
        const k = Mt(f), K = ge(f);
        K && N(
          (z) => z.map(
            (_) => _.id === d ? {
              ..._,
              text: K,
              output: k || _.output,
              running: f.type !== "result"
            } : _
          )
        ), f.type === "result" && N(
          (z) => z.map(
            (_) => _.id === d ? {
              ..._,
              text: K || _.text || "AI 已完成测试结果分析。",
              output: k || _.output,
              running: !1
            } : _
          )
        );
      }
    });
  }, se = async () => {
    if (!te || !I)
      return;
    const n = S.current + 1;
    S.current = n, L(!0), W(!0), lt(!1), E(""), V(""), j("0-0"), $(!1);
    const d = Gs(m), y = Js(r, I, Z), c = `repair-${Date.now()}`;
    N((f) => [
      ...f,
      {
        id: `repair-user-${Date.now()}`,
        role: "user",
        text: "请根据本次测试失败结果修复技能。"
      },
      {
        id: c,
        role: "assistant",
        kind: "repair",
        text: `${g || "技能创建工程师"}正在修复技能...`,
        running: !0
      }
    ]);
    try {
      const f = await Xs({
        api: Pe,
        agentKey: o,
        agentName: g,
        contextKey: d
      }), p = f.sessionID, x = Ws(f.messages);
      await G({
        api: U,
        sessionID: p,
        agentKey: o,
        contextKey: d,
        role: "user",
        kind: "skill_draft_test_repair",
        text: y,
        data: {
          draft_id: m,
          draft: fe(r),
          skill_test: I.data,
          test_status: I.status,
          test_message: I.msg,
          test_args: Z
        }
      });
      let k = "", K = !1, z = null, _ = null;
      const He = (A) => {
        const O = l(A);
        !O || K || (K = !0, z = G({
          api: U,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: "AI 正在根据测试失败结果修复技能...",
          requestID: O,
          status: $s,
          output: X("AI 正在根据测试失败结果修复技能...")
        }));
      };
      if (await oe({
        agent: o,
        input: {
          text: y,
          draft: fe(r),
          skill_test: I.data,
          test_status: I.status,
          test_message: I.msg,
          test_args: Z,
          assistant_session_id: p
        },
        history: x,
        requestApi: Gt,
        streamApi: Xt,
        stopApi: Dt,
        blockMs: Yt,
        onRequestID: (A) => {
          S.current === n && (k = l(A), V(k), He(k));
        },
        onFrame: (A) => {
          if (S.current !== n)
            return;
          const O = l(A?.stream_id);
          O && j(O);
          const ae = le(A);
          ae != null && $(ae);
          const Tt = Mt(A), Je = ge(A);
          Tt && (_ = A.type === "result" ? Tt : _), N(
            (Ge) => Ge.map(
              (tt) => tt.id === c ? {
                ...tt,
                text: Je || tt.text,
                output: Tt || tt.output,
                running: A.type !== "result"
              } : tt
            )
          );
        }
      }), S.current !== n)
        return;
      z && await z.catch(() => {
      });
      const It = _ ? ns(_) : null;
      if (!It) {
        const A = "AI 没有返回可保存的技能修复内容。";
        throw await G({
          api: U,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: A,
          requestID: k,
          status: Rt,
          output: X(A)
        }), new Error(A);
      }
      const H = de(
        await wt(
          we,
          "post",
          Qs({
            draftID: m,
            draft: r,
            patchPayload: It,
            sessionID: p,
            agentKey: o,
            contextKey: d
          })
        ),
        "技能修复已保存。",
        "保存技能修复失败。"
      );
      if (H.status !== 1)
        throw await G({
          api: U,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: H.msg,
          requestID: k,
          status: Rt,
          output: X(H.msg)
        }), new Error(H.msg);
      Fe(H.data);
      const mt = Us(H.data);
      if (mt)
        throw await G({
          api: U,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: mt,
          requestID: k,
          status: Rt,
          output: X(mt)
        }), new Error(mt);
      const vt = "AI 已根据测试失败结果修复并保存到当前技能草稿，请重新测试。";
      await G({
        api: U,
        sessionID: p,
        agentKey: o,
        contextKey: d,
        role: "assistant",
        kind: "skill_draft_test_repair",
        text: vt,
        requestID: k,
        status: xe,
        data: {
          draft_id: m,
          patch: It.patch,
          repair_output: _
        },
        output: X(vt)
      }), lt(!0), Y(!1), it(!1), ot(null), V(""), j("0-0"), N(
        (A) => A.map(
          (O) => O.id === c ? {
            ...O,
            text: vt,
            running: !1
          } : O
        )
      );
    } catch (f) {
      if (S.current === n) {
        const p = et(f, "AI 修复失败。");
        E(p), N(
          (x) => x.map(
            (k) => k.id === c ? {
              ...k,
              text: p,
              running: !1,
              error: p
            } : k
          )
        );
      }
    } finally {
      S.current === n && (L(!1), W(!1), $(!1));
    }
  }, ze = async () => {
    if (!(!dt || !Jt || _t)) {
      At(!0);
      try {
        await fs(dt, Dt), S.current += 1, L(!1), W(!1), $(!1), N(
          (n) => n.map(
            (d) => d.running ? { ...d, running: !1, text: d.text || "已停止。" } : d
          )
        );
      } catch (n) {
        E(et(n, "停止测试分析失败。"));
      } finally {
        At(!1);
      }
    }
  }, Fe = (n) => {
    const d = h(n.draft) ? n.draft : null;
    if (!d)
      return;
    e.getState().setValueByPath(s, d), e.getState().setValueByPath(Wt, d);
    const y = J(e, "data.table.list");
    Array.isArray(y) && e.getState().setValueByPath(
      "data.table.list",
      y.map(
        (c) => h(c) && w(c.id) === m ? { ...c, ...d } : c
      )
    );
  }, Le = () => {
    if (m <= 0)
      return;
    const n = J(e, s);
    e.getState().setValueByPath(
      Wt,
      h(n) ? n : r
    ), e.getState().setValueByPath(Ce, {
      title: "继续编辑",
      description: "通过 AI 对话继续修改技能；保存后回到列表继续测试或发布。"
    }), i && e.getState().setValueByPath(i, !1), e.getState().setValueByPath(Re, !0);
  }, Be = () => {
    Nt && (ut(Et(r)), q(""), ct(!0), Ve());
  }, Ve = async () => {
    Ut(!0);
    try {
      const n = await wt(Ie, "post", {});
      _e(Ks(n));
    } catch (n) {
      q(et(n, "加载发布选项失败。"));
    } finally {
      Ut(!1);
    }
  }, je = async () => {
    if (!Nt)
      return;
    const n = Q.name.trim();
    if (!n) {
      q("技能名称不能为空。");
      return;
    }
    ht(!0), E(""), q("");
    const d = `publish-${Date.now()}`;
    N((y) => [
      ...y,
      {
        id: d,
        role: "assistant",
        kind: "publish",
        text: "正在发布技能...",
        running: !0
      }
    ]);
    try {
      const y = de(
        await wt(Ne, "post", {
          id: m,
          expected_version: w(r.version),
          name: n,
          description: Q.description.trim(),
          pack_id: w(Q.packID),
          cate_id: w(Q.cateID)
        }),
        "发布完成。",
        "发布失败。"
      ), c = y.status === 1;
      bt(c), c && (ct(!1), Ue()), c || (q(y.msg), E(y.msg)), N(
        (f) => f.map(
          (p) => p.id === d ? {
            ...p,
            text: y.msg,
            running: !1,
            error: c ? "" : y.msg
          } : p
        )
      );
    } catch (y) {
      const c = et(y, "发布失败。");
      q(c), E(c), N(
        (f) => f.map(
          (p) => p.id === d ? {
            ...p,
            text: c,
            running: !1,
            error: c
          } : p
        )
      );
    } finally {
      ht(!1);
    }
  }, Ue = () => {
    ve && window.setTimeout(() => {
      gs(e);
    }, Te);
  };
  function ne() {
    S.current += 1, pt.current = "", zt(""), Lt({}), N([]), L(!1), W(!1), Y(!1), it(!1), ot(null), lt(!1), ht(!1), bt(D), ct(!1), ut(Et({})), q(""), E(""), V(""), j("0-0"), $(!1), At(!1);
  }
  const Ke = (n) => {
    (n.metaKey || n.ctrlKey) && n.key === "Enter" && (n.preventDefault(), ee());
  };
  return /* @__PURE__ */ u(
    "div",
    {
      className: "flex min-h-0 flex-col gap-3 overflow-hidden",
      style: { height: Ee },
      children: [
        /* @__PURE__ */ u("div", { className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3", children: [
          Bt.length === 0 ? /* @__PURE__ */ a("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: $e }) : null,
          Bt.map((n) => /* @__PURE__ */ a(
            "div",
            {
              className: Ot(
                "flex",
                n.role === "user" ? "justify-end" : "justify-start"
              ),
              children: /* @__PURE__ */ a(
                "div",
                {
                  className: Ot(
                    "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                    n.role === "user" ? "border-primary/20 bg-primary text-primary-foreground" : "bg-muted/35 text-foreground"
                  ),
                  children: /* @__PURE__ */ a(qs, { message: n })
                }
              )
            },
            n.id
          ))
        ] }),
        Kt ? /* @__PURE__ */ a("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: Kt }) : null,
        /* @__PURE__ */ u("div", { className: "shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20", children: [
          gt.length > 0 ? /* @__PURE__ */ a("div", { className: "grid max-h-48 gap-3 overflow-y-auto border-b p-3 sm:grid-cols-2", children: gt.map((n) => /* @__PURE__ */ u("label", { className: "grid min-w-0 gap-1.5 text-xs", children: [
            /* @__PURE__ */ u("span", { className: "truncate font-medium text-foreground", children: [
              n.name,
              n.targetKey ? /* @__PURE__ */ u("span", { className: "ml-1 font-normal text-muted-foreground", children: [
                "(",
                n.targetKey,
                ")"
              ] }) : null,
              n.required ? /* @__PURE__ */ a("span", { className: "ml-1 text-destructive", children: "*" }) : null
            ] }),
            /* @__PURE__ */ a(
              $t,
              {
                type: n.type === "secret" ? "password" : "text",
                value: Ft[n.id] || "",
                disabled: v || P || C || m <= 0,
                autoComplete: "off",
                className: "h-9",
                onChange: (d) => {
                  const y = d.target.value;
                  Lt((c) => ({
                    ...c,
                    [n.id]: y
                  }));
                }
              }
            )
          ] }, n.id)) }) : null,
          /* @__PURE__ */ a(
            be,
            {
              value: rt,
              disabled: v || P || C || m <= 0,
              placeholder: Oe,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (n) => zt(n.target.value),
              onKeyDown: Ke
            }
          ),
          /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ a("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: m <= 0 ? "缺少技能草稿，无法测试。" : dt ? `RequestID: ${dt}${Ht !== "0-0" ? ` / ${Ht}` : ""}` : v ? Vt ? "AI 正在修复技能，修复记录会保存到继续编辑会话。" : "正在测试技能，结果会显示在上方。" : C ? "本轮测试已完成；清空后可重新测试。" : jt ? "AI 已修复草稿，请重新测试。" : "本次只执行一轮测试。" }),
            /* @__PURE__ */ u("div", { className: "flex shrink-0 items-center gap-2", children: [
              jt ? /* @__PURE__ */ a(
                M,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: v || P,
                  onClick: Le,
                  children: "查看修复记录"
                }
              ) : null,
              /* @__PURE__ */ u(
                M,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: v || P,
                  onClick: ne,
                  children: [
                    /* @__PURE__ */ a(ss, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              v ? /* @__PURE__ */ u(
                M,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !Jt || _t,
                  onClick: () => {
                    ze();
                  },
                  children: [
                    _t ? /* @__PURE__ */ a(F, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ a(es, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              C && !B && I ? /* @__PURE__ */ u(
                M,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !te,
                  onClick: () => {
                    se();
                  },
                  children: [
                    Vt ? /* @__PURE__ */ a(F, { className: "size-4 animate-spin" }) : /* @__PURE__ */ a(Ze, { className: "size-4" }),
                    "AI 修复"
                  ]
                }
              ) : null,
              /* @__PURE__ */ u(
                M,
                {
                  type: "button",
                  size: "sm",
                  disabled: !Zt,
                  onClick: () => {
                    ee();
                  },
                  children: [
                    v ? /* @__PURE__ */ a(F, { className: "size-4 animate-spin" }) : /* @__PURE__ */ a(ts, { className: "size-4" }),
                    "开始测试"
                  ]
                }
              ),
              /* @__PURE__ */ u(
                M,
                {
                  type: "button",
                  size: "sm",
                  disabled: !Nt,
                  title: Me,
                  onClick: Be,
                  children: [
                    P ? /* @__PURE__ */ a(F, { className: "size-4 animate-spin" }) : /* @__PURE__ */ a(ms, { className: "size-4" }),
                    yt ? "已发布" : "发布"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ a(
          Ms,
          {
            open: xt,
            form: Q,
            options: kt,
            loadingOptions: St,
            publishing: P,
            error: Ae,
            onOpenChange: (n) => {
              P || ct(n);
            },
            onChange: ut,
            onSubmit: () => {
              je();
            }
          }
        )
      ]
    }
  );
}
function Ms({
  open: t,
  form: e,
  options: s,
  loadingOptions: i,
  publishing: r,
  error: o,
  onOpenChange: g,
  onChange: T,
  onSubmit: m
}) {
  const R = (D) => {
    T({ ...e, ...D });
  };
  return /* @__PURE__ */ a(ys, { open: t, onOpenChange: g, children: /* @__PURE__ */ u(bs, { className: "gap-0 overflow-hidden p-0 sm:max-w-xl", children: [
    /* @__PURE__ */ u(ks, { className: "border-b px-5 py-4 text-start", children: [
      /* @__PURE__ */ a(Ss, { children: "发布设置" }),
      /* @__PURE__ */ a(xs, { children: "测试通过的技能内容不会在这里修改；这里只调整发布元信息。" })
    ] }),
    /* @__PURE__ */ u("div", { className: "space-y-4 px-5 py-4", children: [
      /* @__PURE__ */ a(st, { label: "技能标识", children: /* @__PURE__ */ a($t, { value: e.key, disabled: !0, className: "font-mono" }) }),
      /* @__PURE__ */ a(st, { label: "技能名称", required: !0, children: /* @__PURE__ */ a(
        $t,
        {
          value: e.name,
          disabled: r,
          onChange: (D) => R({ name: D.target.value })
        }
      ) }),
      /* @__PURE__ */ a(st, { label: "技能描述", children: /* @__PURE__ */ a(
        be,
        {
          value: e.description,
          disabled: r,
          className: "min-h-24 resize-none",
          onChange: (D) => R({ description: D.target.value })
        }
      ) }),
      /* @__PURE__ */ a(st, { label: "技能方案", children: /* @__PURE__ */ a(
        ce,
        {
          value: e.packID,
          disabled: r || i,
          options: s.packs,
          placeholder: i ? "正在加载..." : "请选择技能方案",
          onChange: (D) => R({ packID: D })
        }
      ) }),
      /* @__PURE__ */ a(st, { label: "技能分类", children: /* @__PURE__ */ a(
        ce,
        {
          value: e.cateID,
          disabled: r || i,
          options: s.cates,
          placeholder: i ? "正在加载..." : "请选择技能分类",
          onChange: (D) => R({ cateID: D })
        }
      ) }),
      o ? /* @__PURE__ */ a("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: o }) : null
    ] }),
    /* @__PURE__ */ u("div", { className: "flex justify-end gap-2 border-t px-5 py-3", children: [
      /* @__PURE__ */ a(
        M,
        {
          type: "button",
          variant: "outline",
          disabled: r,
          onClick: () => g(!1),
          children: "取消"
        }
      ),
      /* @__PURE__ */ u(M, { type: "button", disabled: r, onClick: m, children: [
        r ? /* @__PURE__ */ a(F, { className: "size-4 animate-spin" }) : null,
        "保存并发布"
      ] })
    ] })
  ] }) });
}
function st({
  label: t,
  required: e,
  children: s
}) {
  return /* @__PURE__ */ u("label", { className: "grid gap-2 text-sm font-medium text-foreground", children: [
    /* @__PURE__ */ u("span", { children: [
      t,
      e ? /* @__PURE__ */ a("span", { className: "ml-1 text-destructive", children: "*" }) : null
    ] }),
    s
  ] });
}
function ce({
  value: t,
  options: e,
  disabled: s,
  placeholder: i,
  onChange: r
}) {
  const o = e.some((g) => g.id === t) ? t : void 0;
  return /* @__PURE__ */ u(
    _s,
    {
      value: o,
      disabled: s,
      onValueChange: r,
      children: [
        /* @__PURE__ */ a(Ns, { children: /* @__PURE__ */ a(Is, { placeholder: i }) }),
        /* @__PURE__ */ a(As, { children: e.map((g) => /* @__PURE__ */ a(Ds, { value: g.id, children: g.name }, g.id)) })
      ]
    }
  );
}
function qs({ message: t }) {
  return t.kind === "test" && t.result ? /* @__PURE__ */ a(zs, { result: t.result }) : t.kind === "analysis" || t.kind === "repair" ? /* @__PURE__ */ a("div", { className: "space-y-2", children: t.running && !t.output ? /* @__PURE__ */ u("div", { className: "text-muted-foreground", children: [
    /* @__PURE__ */ a(F, { className: "mr-2 inline size-3.5 animate-spin align-[-2px]" }),
    t.text
  ] }) : /* @__PURE__ */ a(
    as,
    {
      output: t.output || X(t.text),
      streaming: t.running,
      emptyText: t.kind === "repair" ? "等待智能体修复技能。" : "等待智能体分析测试结果。"
    }
  ) }) : /* @__PURE__ */ u("div", { className: "whitespace-pre-wrap break-words", children: [
    t.running ? /* @__PURE__ */ a(F, { className: "mr-2 inline size-3.5 animate-spin align-[-2px]" }) : null,
    t.text
  ] });
}
function zs({ result: t }) {
  const e = t.status === 1, s = t.data, i = an(s.tests);
  i.length === 0 && h(s.test) && i.push(s.test);
  const r = Se(s.issues);
  return /* @__PURE__ */ u("div", { className: "space-y-2", children: [
    /* @__PURE__ */ u("div", { className: "flex items-center gap-2 font-medium", children: [
      e ? /* @__PURE__ */ a(Ye, { className: "size-4 text-emerald-600" }) : /* @__PURE__ */ a(Qe, { className: "size-4 text-destructive" }),
      /* @__PURE__ */ a("span", { children: t.msg || (e ? "测试通过" : "测试未通过") })
    ] }),
    r.length > 0 ? /* @__PURE__ */ a("div", { className: "rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900", children: r.map((o) => /* @__PURE__ */ u("div", { children: [
      "- ",
      o
    ] }, o)) }) : null,
    i.map((o, g) => /* @__PURE__ */ a(
      Fs,
      {
        test: o,
        showDivider: g > 0
      },
      `${l(o.target)}:${l(o.script)}:${g}`
    ))
  ] });
}
function Fs({
  test: t,
  showDivider: e
}) {
  const s = l(t.duration_ms);
  return /* @__PURE__ */ u("div", { className: Ot("space-y-2", e && "border-t pt-2"), children: [
    /* @__PURE__ */ u("div", { className: "grid gap-2 text-xs text-muted-foreground sm:grid-cols-3", children: [
      /* @__PURE__ */ u("div", { children: [
        "脚本：",
        l(t.script) || "自动选择"
      ] }),
      /* @__PURE__ */ u("div", { children: [
        "退出码：",
        l(t.exit_code) || "0"
      ] }),
      /* @__PURE__ */ u("div", { children: [
        "耗时：",
        s ? `${s}ms` : "-"
      ] })
    ] }),
    /* @__PURE__ */ a(Ct, { title: "输出", value: l(t.stdout) }),
    /* @__PURE__ */ a(Ct, { title: "错误输出", value: l(t.stderr) }),
    /* @__PURE__ */ a(Ct, { title: "异常", value: l(t.error) })
  ] });
}
function Ct({ title: t, value: e }) {
  return e ? /* @__PURE__ */ u("div", { className: "space-y-1", children: [
    /* @__PURE__ */ a("div", { className: "text-xs font-medium text-muted-foreground", children: t }),
    /* @__PURE__ */ a("pre", { className: "max-h-40 overflow-auto rounded-md bg-background p-2 text-xs leading-5 text-foreground", children: e })
  ] }) : null;
}
async function Ls(t, e, s, i) {
  const r = await Bs(t, {
    id: e,
    args: s,
    config: i,
    timeout_seconds: Os
  });
  return Vs(r);
}
async function Bs(t, e) {
  const s = await fetch(t, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      ...We({
        contentType: "application/json",
        url: t
      }),
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify(e)
  }), i = await s.text();
  if (!i)
    return {
      status: s.ok ? 1 : 2,
      msg: s.ok ? "请求成功。" : `请求失败：${s.status}`,
      data: {}
    };
  try {
    return JSON.parse(i);
  } catch {
    return {
      status: 2,
      msg: s.ok ? "响应不是有效 JSON。" : `请求失败：${s.status}`,
      data: { text: i }
    };
  }
}
function Vs(t) {
  if (!h(t))
    return {
      status: 2,
      msg: "测试失败。",
      data: {}
    };
  const e = Number(
    t.status || (Number(t.code) === 0 ? 1 : 0)
  );
  return {
    status: e === 1 ? 1 : 2,
    msg: l(t.msg || t.message) || (e === 1 ? "测试通过。" : "测试失败。"),
    data: h(t.data) ? t.data : {}
  };
}
function ue(t) {
  if (t.status === 1)
    return !1;
  const e = h(t.data) ? t.data : {};
  return ke(e.repairable);
}
function js(t, e) {
  const s = rn({ message: e.msg, data: e.data });
  return s ? `${t}:${s.slice(0, 1e3)}` : "";
}
function Us(t) {
  const e = h(t.validation) ? t.validation : null;
  if (!e || l(e.valid) === "true" || e.valid === !0)
    return "";
  const s = Se(e.issues);
  return s.length === 0 ? "" : `AI 修复已保存，但内容检查仍未通过：
${s.slice(0, 5).join(`
`)}`;
}
function de(t, e, s) {
  if (!h(t))
    return {
      status: 2,
      msg: s,
      data: {}
    };
  const i = Number(
    t.status || (Number(t.code) === 0 ? 1 : 0)
  );
  return {
    status: i === 1 ? 1 : 2,
    msg: l(t.msg || t.message) || (i === 1 ? e : s),
    data: h(t.data) ? t.data : {}
  };
}
function Ks(t) {
  if (!h(t))
    return { packs: [], cates: [] };
  const e = h(t.data) ? t.data : t;
  return {
    packs: pe(e.packs),
    cates: pe(e.cates)
  };
}
function pe(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!h(e))
      return null;
    const s = l(e.id || e.value || e.key), i = l(e.name || e.label || e.title || e.text);
    return s && i ? { id: s, name: i } : null;
  }).filter((e) => !!e) : [];
}
function Hs(t, e) {
  const s = me(t.packID, e.packs), i = me(t.cateID, e.cates);
  return s === t.packID && i === t.cateID ? t : { ...t, packID: s, cateID: i };
}
function me(t, e) {
  return t && e.some((s) => s.id === t) ? t : e[0]?.id || "";
}
function Et(t) {
  return {
    key: l(t.key),
    name: l(t.name),
    description: l(t.description),
    packID: l(t.pack_id || t.packId),
    cateID: l(t.cate_id || t.cateId)
  };
}
function Js(t, e, s) {
  return [
    "请根据本次技能测试失败结果修复当前技能草稿。",
    `技能：${l(t.name) || l(t.key) || "未命名技能"}`,
    `测试参数：${s.length > 0 ? s.join(", ") : "无"}`,
    `测试消息：${e.msg}`
  ].join(`
`);
}
function fe(t) {
  return {
    id: t.id || t.draft_id || t.draftId,
    version: t.version,
    key: t.key,
    name: t.name,
    description: t.description,
    pack_id: t.pack_id || t.packId,
    cate_id: t.cate_id || t.cateId,
    skill_md: t.skill_md || t.skillMd,
    files_json: t.files_json || t.filesJson,
    manifest: t.manifest
  };
}
function Gs(t) {
  return `skill_draft:${t}`;
}
async function Xs({
  api: t,
  agentKey: e,
  agentName: s,
  contextKey: i
}) {
  const r = await ye(t, {
    agent_key: e,
    context_key: i,
    title: s ? `${s} 会话` : "技能创建工程师会话",
    limit: 80
  }), o = h(r.session) ? r.session : {}, g = w(o.id);
  if (g <= 0)
    throw new Error("创建技能修复会话失败。");
  return {
    sessionID: g,
    messages: Array.isArray(r.messages) ? r.messages : []
  };
}
async function G({
  api: t,
  sessionID: e,
  agentKey: s,
  contextKey: i,
  role: r,
  kind: o,
  text: g,
  data: T,
  output: m,
  requestID: R,
  status: D
}) {
  return e <= 0 ? {} : await ye(t, {
    session_id: e,
    agent_key: s,
    context_key: i,
    role: r,
    kind: o,
    text: g,
    content: {
      kind: o,
      data: T || {}
    },
    output: m || {},
    request_id: R || "",
    status: D || xe
  });
}
function Ws(t) {
  return t.map((e) => Ys(e)).filter((e) => !!e);
}
function Ys(t) {
  if (!h(t))
    return null;
  const e = l(t.role) === "user" ? "user" : "assistant", s = h(t.content) ? t.content : {}, i = h(t.output) ? t.output : {}, r = {
    role: e,
    text: l(t.text)
  }, o = l(s.kind || t.kind);
  return o && (r.type = o), h(s.data) && (r.data = s.data), Object.keys(i).length > 0 && (r.output = i), r;
}
function Qs({
  draftID: t,
  draft: e,
  patchPayload: s,
  sessionID: i,
  agentKey: r,
  contextKey: o
}) {
  return {
    ...s,
    id: t,
    expected_version: w(e.version),
    pack_id: w(s.pack_id || s.packId) || w(e.pack_id || e.packId),
    cate_id: w(s.cate_id || s.cateId) || w(e.cate_id || e.cateId),
    assistant_session_id: i,
    assistant_agent_key: r,
    assistant_context_key: o
  };
}
function Mt(t) {
  const e = hs(t?.output, t);
  return h(e) ? e : null;
}
function ge(t) {
  const e = Mt(t);
  return h(e) && (l(e.text) || l(e.content) || l(e.message) || l(e.result)) || l(t?.msg);
}
function X(t) {
  return {
    text: t,
    content: {
      format: "markdown",
      text: t
    }
  };
}
function Zs(t) {
  return {
    id: t.id,
    key: t.key,
    name: t.name,
    description: t.description,
    manifest: t.manifest
  };
}
function tn(t) {
  const e = sn(t.manifest), s = Array.isArray(e.config) ? e.config : [], i = [], r = /* @__PURE__ */ new Set();
  return s.forEach((o) => {
    if (!h(o))
      return;
    const g = l(o.key).trim();
    if (!g)
      return;
    const T = l(
      o.target_key || o.targetKey || o.target
    ).trim(), m = JSON.stringify([T, g]);
    r.has(m) || (r.add(m), i.push({
      id: m,
      key: g,
      targetKey: T,
      name: l(o.name).trim() || g,
      type: l(o.type).trim().toLowerCase() === "secret" ? "secret" : "text",
      required: ke(o.required)
    }));
  }), i;
}
function en(t, e) {
  return t.flatMap((s) => {
    const i = e[s.id] || "";
    return i.trim() ? [{ key: s.key, target_key: s.targetKey, value: i }] : [];
  });
}
function sn(t) {
  if (h(t))
    return t;
  if (typeof t != "string" || !t.trim())
    return {};
  try {
    const e = JSON.parse(t);
    return h(e) ? e : {};
  } catch {
    return {};
  }
}
function ke(t) {
  return typeof t == "boolean" ? t : typeof t == "number" ? t === 1 : ["1", "true", "yes", "on"].includes(
    l(t).trim().toLowerCase()
  );
}
function nn(t) {
  return t.split(/\r?\n|,/).map((e) => e.trim()).filter(Boolean);
}
function Se(t) {
  return Array.isArray(t) ? t.map((e) => l(e)).filter(Boolean) : [];
}
function an(t) {
  return Array.isArray(t) ? t.filter(h) : [];
}
function rn(t) {
  try {
    const e = JSON.stringify(t, null, 2);
    return e.length > 6e3 ? `${e.slice(0, 6e3)}
...` : e;
  } catch {
    return l(t);
  }
}
function w(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
export {
  In as ShowSkillTest
};
