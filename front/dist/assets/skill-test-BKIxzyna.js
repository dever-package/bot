import { u as gt, a as c, j as r } from "./react-CDpwMNlY.js";
import { u as fe, a as y, e as ge, b as Et } from "./file-kind-DFeonxO2.js";
import { h as sn, r as z, H as rn, ae as an, j as on, aw as ln, C as un, g as cn } from "./vendor-icons-Cz5zFzlk.js";
import { r as dn, i as h, a as De, A as pn } from "./skill-draft-patch-cin0oHIs.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/agent/runner", "@/lib/page-schema-reload", "@/lib/runtime-stream-output", "@/lib/store", "@/lib/stream", "@/lib/utils", "@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/components/ui/select", "@/components/ui/textarea"]);
const ht = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ht || Object.keys(ht).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const mn = ht.buildRuntimeRequestHeaders, Mt = ht.request, bt = window.DeverFront?.sdk?.getCompatModule("@/lib/agent/runner");
if (!bt || Object.keys(bt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/agent/runner");
const he = bt.runAgentStream, fn = bt.stopAgentStream, qt = window.DeverFront?.sdk?.getCompatModule("@/lib/page-schema-reload");
if (!qt || Object.keys(qt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/page-schema-reload");
const gn = qt.reloadStorePageSchema, at = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!at || Object.keys(at).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const hn = at.normalizeRuntimeFrameOutput, be = at.resolveRuntimeFrameCancelable, st = at.runtimeErrorMessage, jt = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!jt || Object.keys(jt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const X = jt.getStoreValueByPath, zt = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!zt || Object.keys(zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const l = zt.streamValueText, $t = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!$t || Object.keys($t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Bt = $t.cn, Vt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Vt || Object.keys(Vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const F = Vt.Button, $ = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!$ || Object.keys($).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const bn = $.Dialog, yn = $.DialogContent, kn = $.DialogDescription, xn = $.DialogHeader, _n = $.DialogTitle, Lt = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!Lt || Object.keys(Lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const Ut = Lt.Input, B = window.DeverFront?.sdk?.getCompatModule("@/components/ui/select");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/select");
const wn = B.Select, vn = B.SelectContent, Sn = B.SelectItem, Dn = B.SelectTrigger, An = B.SelectValue, Ht = window.DeverFront?.sdk?.getCompatModule("@/components/ui/textarea");
if (!Ht || Object.keys(Ht).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/textarea");
const Ae = Ht.Textarea, Nn = "data.actionTarget.testDraft", In = "/bot/admin/skill_draft/test", Tn = "/bot/admin/skill_draft/publish", Cn = "/bot/admin/skill_draft/publish_options", Pn = "/bot/admin/skill_draft/apply_patch", En = "skill-creator", Mn = "min(calc(85vh - 11rem), 620px)", Rn = 15, Ne = 1, Rt = 2, On = 3;
function cs({ item: t, store: e }) {
  const n = String(t.meta?.draftPath || Nn), i = String(t.meta?.openPath || ""), a = gt(e, () => {
    const s = X(e, n);
    return h(s) ? s : {};
  }), o = gt(e, () => l(
    X(e, String(t.meta?.agentPath || ""))
  ) || String(t.meta?.agentKey || En)), g = gt(
    e,
    () => l(
      X(e, String(t.meta?.agentNamePath || ""))
    )
  ), I = gt(
    e,
    () => i ? !!X(e, i) : !0
  ), m = C(a.id || a.draft_id || a.draftId), P = Number(a.status || 0) === 1, S = Number(a.status || 0) === 2, yt = fe(() => ts(a), [a]), [it, Jt] = y(""), [Gt, Xt] = y({}), [Wt, D] = y([]), [N, V] = y(!1), [Yt, Q] = y(!1), [E, Z] = y(!1), [L, ot] = y(!1), [A, lt] = y(null), [Qt, ut] = y(!1), [T, kt] = y(!1), [xt, _t] = y(S), [wt, ct] = y(!1), [tt, dt] = y(
    () => Ft({})
  ), [vt, Ce] = y({
    packs: [],
    cates: []
  }), [St, Zt] = y(!1), [Pe, q] = y(""), [te, M] = y(""), [pt, U] = y(""), [ee, H] = y("0-0"), [ne, O] = y(!1), [Dt, At] = y(!1), _ = ge(0), mt = ge(""), Ee = String(t.meta?.testApi || In), Me = String(t.meta?.publishApi || Tn), Re = String(
    t.meta?.publishOptionsApi || Cn
  ), Oe = t.meta?.reloadPageOnPublish !== !1, Fe = Math.max(
    0,
    Number(t.meta?.reloadPageOnPublishDelayMs || 500)
  ), se = String(t.meta?.requestApi || "/bot/admin/agent/run"), re = String(t.meta?.streamApi || "/bot/admin/agent/stream"), Nt = String(t.meta?.stopApi || "/bot/admin/agent/stop"), qe = String(
    t.meta?.sessionApi || "/bot/admin/assistant/session"
  ), K = String(
    t.meta?.messageApi || "/bot/admin/assistant/message"
  ), je = String(
    t.meta?.skillDraftPatchApi || Pn
  ), ze = String(
    t.meta?.draftAssistantOpenPath || "state.dialog.draftAssistant"
  ), ae = String(
    t.meta?.draftAssistantDraftPath || "data.actionTarget.draftAgent"
  ), $e = String(
    t.meta?.draftAssistantMetaPath || "data.actionTarget.draftAssistantMeta"
  ), ie = Number(t.meta?.blockMs || 1e3), oe = t.meta?.skillDraftAutoRepair !== !1, Be = l(t.meta?.height || t.meta?.containerHeight) || Mn, Ve = String(
    t.meta?.placeholder || "输入测试参数，每行一个；留空表示不带参数运行。"
  ), Le = String(
    t.meta?.emptyText || "输入一次测试参数开始测试。系统会先检查技能内容，再在沙箱中运行脚本。"
  ), le = m > 0 && P && !N && !E, It = m > 0 && E && L && !N && !T && !xt && P, Ue = xt ? "当前技能已发布。" : L ? "测试已通过，可以发布。" : "测试通过后才可以发布。", ue = m > 0 && !!o && !!A && E && !L && !N && !T && P;
  Et(() => {
    I && pe();
  }, [m, I]), Et(() => {
    !wt || St || dt(
      (s) => Kn(s, vt)
    );
  }, [wt, St, vt]);
  const et = fe(() => ss(it), [it]);
  Et(() => {
    if (!oe || !I || !o || m <= 0 || N || T || !E || L || !A || !ke(A))
      return;
    const s = Ln(m, A);
    !s || mt.current === s || (mt.current = s, de());
  }, [
    oe,
    o,
    m,
    A,
    I,
    T,
    N,
    E,
    L
  ]);
  const ce = async () => {
    if (!le)
      return;
    const s = _.current + 1;
    _.current = s, mt.current = "", V(!0), Q(!1), Z(!1), ot(!1), lt(null), ut(!1), _t(S), M(""), U(""), H("0-0"), O(!1);
    const d = it.trim() || "不带参数运行测试。", b = `test-${Date.now()}`;
    D([
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: d
      },
      {
        id: b,
        role: "assistant",
        kind: "test",
        text: "正在运行测试...",
        running: !0
      }
    ]);
    try {
      const u = await $n(
        Ee,
        m,
        et,
        es(yt, Gt)
      );
      if (_.current !== s)
        return;
      const f = u.status === 1;
      if (lt(u), ot(f), D(
        (k) => k.map(
          (x) => x.id === b ? {
            ...x,
            text: u.msg,
            running: !1,
            result: u
          } : x
        )
      ), !o) {
        Z(!0);
        return;
      }
      if (!f && ke(u))
        return;
      const p = `analysis-${Date.now()}`;
      D((k) => [
        ...k,
        {
          id: p,
          role: "assistant",
          kind: "analysis",
          text: `${g || "技能创建工程师"}正在分析测试结果...`,
          running: !0
        }
      ]), await He({
        token: s,
        messageID: p,
        testResult: u,
        args: et
      });
    } catch (u) {
      if (_.current === s) {
        const f = st(u, "测试失败。");
        M(f), D(
          (p) => p.map(
            (k) => k.running ? {
              ...k,
              text: k.kind === "analysis" || !k.result ? f : k.text,
              running: !1,
              error: k.kind === "analysis" || !k.result ? f : k.error
            } : k
          )
        );
      }
    } finally {
      _.current === s && (V(!1), Z(!0), O(!1));
    }
  }, He = async ({
    token: s,
    messageID: d,
    testResult: b,
    args: u
  }) => {
    await he({
      agent: o,
      input: {
        text: "请根据这次真实技能测试结果判断是否通过；失败时说明原因和修改建议。",
        draft: Zn(a),
        skill_test: b.data,
        test_status: b.status,
        test_message: b.msg,
        test_args: u
      },
      history: [],
      requestApi: se,
      streamApi: re,
      stopApi: Nt,
      blockMs: ie,
      onRequestID: (f) => {
        _.current === s && U(l(f));
      },
      onFrame: (f) => {
        if (_.current !== s)
          return;
        const p = l(f?.stream_id);
        p && H(p);
        const k = be(f);
        k != null && O(k);
        const x = Kt(f), J = Se(f);
        J && D(
          (j) => j.map(
            (w) => w.id === d ? {
              ...w,
              text: J,
              output: x || w.output,
              running: f.type !== "result"
            } : w
          )
        ), f.type === "result" && D(
          (j) => j.map(
            (w) => w.id === d ? {
              ...w,
              text: J || w.text || "AI 已完成测试结果分析。",
              output: x || w.output,
              running: !1
            } : w
          )
        );
      }
    });
  }, de = async () => {
    if (!ue || !A)
      return;
    const s = _.current + 1;
    _.current = s, V(!0), Q(!0), ut(!1), M(""), U(""), H("0-0"), O(!1);
    const d = Gn(m), b = Jn(a, A, et), u = `repair-${Date.now()}`;
    D((f) => [
      ...f,
      {
        id: `repair-user-${Date.now()}`,
        role: "user",
        text: "请根据本次测试失败结果修复技能。"
      },
      {
        id: u,
        role: "assistant",
        kind: "repair",
        text: `${g || "技能创建工程师"}正在修复技能...`,
        running: !0
      }
    ]);
    try {
      const f = await Xn({
        api: qe,
        agentKey: o,
        agentName: g,
        contextKey: d
      }), p = f.sessionID, k = Wn(f.messages);
      await W({
        api: K,
        sessionID: p,
        agentKey: o,
        contextKey: d,
        role: "user",
        kind: "skill_draft_test_repair",
        text: b,
        data: {
          draft_id: m,
          draft: ve(a),
          skill_test: A.data,
          test_status: A.status,
          test_message: A.msg,
          test_args: et
        }
      });
      let x = "", J = !1, j = null, w = null;
      const tn = (v) => {
        const R = l(v);
        !R || J || (J = !0, j = W({
          api: K,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: "AI 正在根据测试失败结果修复技能...",
          requestID: R,
          status: On,
          output: Y("AI 正在根据测试失败结果修复技能...")
        }));
      };
      if (await he({
        agent: o,
        input: {
          text: b,
          draft: ve(a),
          skill_test: A.data,
          test_status: A.status,
          test_message: A.msg,
          test_args: et,
          assistant_session_id: p
        },
        history: k,
        requestApi: se,
        streamApi: re,
        stopApi: Nt,
        blockMs: ie,
        onRequestID: (v) => {
          _.current === s && (x = l(v), U(x), tn(x));
        },
        onFrame: (v) => {
          if (_.current !== s)
            return;
          const R = l(v?.stream_id);
          R && H(R);
          const me = be(v);
          me != null && O(me);
          const Pt = Kt(v), en = Se(v);
          Pt && (w = v.type === "result" ? Pt : w), D(
            (nn) => nn.map(
              (nt) => nt.id === u ? {
                ...nt,
                text: en || nt.text,
                output: Pt || nt.output,
                running: v.type !== "result"
              } : nt
            )
          );
        }
      }), _.current !== s)
        return;
      j && await j.catch(() => {
      });
      const Tt = w ? dn(w) : null;
      if (!Tt) {
        const v = "AI 没有返回可保存的技能修复内容。";
        throw await W({
          api: K,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: v,
          requestID: x,
          status: Rt,
          output: Y(v)
        }), new Error(v);
      }
      const G = xe(
        await Mt(
          je,
          "post",
          Qn({
            draftID: m,
            draft: a,
            patchPayload: Tt,
            sessionID: p,
            agentKey: o,
            contextKey: d
          })
        ),
        "技能修复已保存。",
        "保存技能修复失败。"
      );
      if (G.status !== 1)
        throw await W({
          api: K,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: G.msg,
          requestID: x,
          status: Rt,
          output: Y(G.msg)
        }), new Error(G.msg);
      Je(G.data);
      const ft = Un(G.data);
      if (ft)
        throw await W({
          api: K,
          sessionID: p,
          agentKey: o,
          contextKey: d,
          role: "assistant",
          kind: "skill_draft_test_repair",
          text: ft,
          requestID: x,
          status: Rt,
          output: Y(ft)
        }), new Error(ft);
      const Ct = "AI 已根据测试失败结果修复并保存到当前技能草稿，请重新测试。";
      await W({
        api: K,
        sessionID: p,
        agentKey: o,
        contextKey: d,
        role: "assistant",
        kind: "skill_draft_test_repair",
        text: Ct,
        requestID: x,
        status: Ne,
        data: {
          draft_id: m,
          patch: Tt.patch,
          repair_output: w
        },
        output: Y(Ct)
      }), ut(!0), Z(!1), ot(!1), lt(null), U(""), H("0-0"), D(
        (v) => v.map(
          (R) => R.id === u ? {
            ...R,
            text: Ct,
            running: !1
          } : R
        )
      );
    } catch (f) {
      if (_.current === s) {
        const p = st(f, "AI 修复失败。");
        M(p), D(
          (k) => k.map(
            (x) => x.id === u ? {
              ...x,
              text: p,
              running: !1,
              error: p
            } : x
          )
        );
      }
    } finally {
      _.current === s && (V(!1), Q(!1), O(!1));
    }
  }, Ke = async () => {
    if (!(!pt || !ne || Dt)) {
      At(!0);
      try {
        await fn(pt, Nt), _.current += 1, V(!1), Q(!1), O(!1), D(
          (s) => s.map(
            (d) => d.running ? { ...d, running: !1, text: d.text || "已停止。" } : d
          )
        );
      } catch (s) {
        M(st(s, "停止测试分析失败。"));
      } finally {
        At(!1);
      }
    }
  }, Je = (s) => {
    const d = h(s.draft) ? s.draft : null;
    if (!d)
      return;
    e.getState().setValueByPath(n, d), e.getState().setValueByPath(ae, d);
    const b = X(e, "data.table.list");
    Array.isArray(b) && e.getState().setValueByPath(
      "data.table.list",
      b.map(
        (u) => h(u) && C(u.id) === m ? { ...u, ...d } : u
      )
    );
  }, Ge = () => {
    if (m <= 0)
      return;
    const s = X(e, n);
    e.getState().setValueByPath(
      ae,
      h(s) ? s : a
    ), e.getState().setValueByPath($e, {
      title: "继续编辑",
      description: "通过 AI 对话继续修改技能；保存后回到列表继续测试或发布。"
    }), i && e.getState().setValueByPath(i, !1), e.getState().setValueByPath(ze, !0);
  }, Xe = () => {
    It && (dt(Ft(a)), q(""), ct(!0), We());
  }, We = async () => {
    Zt(!0);
    try {
      const s = await Mt(Re, "post", {});
      Ce(Hn(s));
    } catch (s) {
      q(st(s, "加载发布选项失败。"));
    } finally {
      Zt(!1);
    }
  }, Ye = async () => {
    if (!It)
      return;
    const s = tt.name.trim();
    if (!s) {
      q("技能名称不能为空。");
      return;
    }
    kt(!0), M(""), q("");
    const d = `publish-${Date.now()}`;
    D((b) => [
      ...b,
      {
        id: d,
        role: "assistant",
        kind: "publish",
        text: "正在发布技能...",
        running: !0
      }
    ]);
    try {
      const b = xe(
        await Mt(Me, "post", {
          id: m,
          expected_version: C(a.version),
          name: s,
          description: tt.description.trim(),
          pack_id: C(tt.packID),
          cate_id: C(tt.cateID)
        }),
        "发布完成。",
        "发布失败。"
      ), u = b.status === 1;
      _t(u), u && (ct(!1), Qe()), u || (q(b.msg), M(b.msg)), D(
        (f) => f.map(
          (p) => p.id === d ? {
            ...p,
            text: b.msg,
            running: !1,
            error: u ? "" : b.msg
          } : p
        )
      );
    } catch (b) {
      const u = st(b, "发布失败。");
      q(u), M(u), D(
        (f) => f.map(
          (p) => p.id === d ? {
            ...p,
            text: u,
            running: !1,
            error: u
          } : p
        )
      );
    } finally {
      kt(!1);
    }
  }, Qe = () => {
    Oe && window.setTimeout(() => {
      gn(e);
    }, Fe);
  };
  function pe() {
    _.current += 1, mt.current = "", Jt(""), Xt({}), D([]), V(!1), Q(!1), Z(!1), ot(!1), lt(null), ut(!1), kt(!1), _t(S), ct(!1), dt(Ft({})), q(""), M(""), U(""), H("0-0"), O(!1), At(!1);
  }
  const Ze = (s) => {
    (s.metaKey || s.ctrlKey) && s.key === "Enter" && (s.preventDefault(), ce());
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: "flex min-h-0 flex-col gap-3 overflow-hidden",
      style: { height: Be },
      children: [
        /* @__PURE__ */ c("div", { className: "min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3", children: [
          Wt.length === 0 ? /* @__PURE__ */ r("div", { className: "flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground", children: Le }) : null,
          Wt.map((s) => /* @__PURE__ */ r(
            "div",
            {
              className: Bt(
                "flex",
                s.role === "user" ? "justify-end" : "justify-start"
              ),
              children: /* @__PURE__ */ r(
                "div",
                {
                  className: Bt(
                    "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                    s.role === "user" ? "border-primary/20 bg-primary text-primary-foreground" : "bg-muted/35 text-foreground"
                  ),
                  children: /* @__PURE__ */ r(qn, { message: s })
                }
              )
            },
            s.id
          ))
        ] }),
        te ? /* @__PURE__ */ r("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: te }) : null,
        /* @__PURE__ */ c("div", { className: "shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20", children: [
          yt.length > 0 ? /* @__PURE__ */ r("div", { className: "grid max-h-48 gap-3 overflow-y-auto border-b p-3 sm:grid-cols-2", children: yt.map((s) => /* @__PURE__ */ c("label", { className: "grid min-w-0 gap-1.5 text-xs", children: [
            /* @__PURE__ */ c("span", { className: "truncate font-medium text-foreground", children: [
              s.name,
              s.targetKey ? /* @__PURE__ */ c("span", { className: "ml-1 font-normal text-muted-foreground", children: [
                "(",
                s.targetKey,
                ")"
              ] }) : null,
              s.required ? /* @__PURE__ */ r("span", { className: "ml-1 text-destructive", children: "*" }) : null
            ] }),
            /* @__PURE__ */ r(
              Ut,
              {
                type: s.type === "secret" ? "password" : "text",
                value: Gt[s.id] || "",
                disabled: N || T || E || m <= 0,
                autoComplete: "off",
                className: "h-9",
                onChange: (d) => {
                  const b = d.target.value;
                  Xt((u) => ({
                    ...u,
                    [s.id]: b
                  }));
                }
              }
            )
          ] }, s.id)) }) : null,
          /* @__PURE__ */ r(
            Ae,
            {
              value: it,
              disabled: N || T || E || m <= 0,
              placeholder: Ve,
              className: "min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0",
              onChange: (s) => Jt(s.target.value),
              onKeyDown: Ze
            }
          ),
          /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-3 border-t px-3 py-2", children: [
            /* @__PURE__ */ r("div", { className: "min-w-0 truncate text-xs text-muted-foreground", children: m <= 0 ? "缺少技能草稿，无法测试。" : pt ? `RequestID: ${pt}${ee !== "0-0" ? ` / ${ee}` : ""}` : N ? Yt ? "AI 正在修复技能，修复记录会保存到继续编辑会话。" : "正在测试技能，结果会显示在上方。" : E ? "本轮测试已完成；清空后可重新测试。" : Qt ? "AI 已修复草稿，请重新测试。" : "本次只执行一轮测试。" }),
            /* @__PURE__ */ c("div", { className: "flex shrink-0 items-center gap-2", children: [
              Qt ? /* @__PURE__ */ r(
                F,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: N || T,
                  onClick: Ge,
                  children: "查看修复记录"
                }
              ) : null,
              /* @__PURE__ */ c(
                F,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: N || T,
                  onClick: pe,
                  children: [
                    /* @__PURE__ */ r(sn, { className: "size-3.5" }),
                    "清空"
                  ]
                }
              ),
              N ? /* @__PURE__ */ c(
                F,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !ne || Dt,
                  onClick: () => {
                    Ke();
                  },
                  children: [
                    Dt ? /* @__PURE__ */ r(z, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ r(rn, { className: "size-3.5" }),
                    "停止"
                  ]
                }
              ) : null,
              E && !L && A ? /* @__PURE__ */ c(
                F,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: !ue,
                  onClick: () => {
                    de();
                  },
                  children: [
                    Yt ? /* @__PURE__ */ r(z, { className: "size-4 animate-spin" }) : /* @__PURE__ */ r(an, { className: "size-4" }),
                    "AI 修复"
                  ]
                }
              ) : null,
              /* @__PURE__ */ c(
                F,
                {
                  type: "button",
                  size: "sm",
                  disabled: !le,
                  onClick: () => {
                    ce();
                  },
                  children: [
                    N ? /* @__PURE__ */ r(z, { className: "size-4 animate-spin" }) : /* @__PURE__ */ r(on, { className: "size-4" }),
                    "开始测试"
                  ]
                }
              ),
              /* @__PURE__ */ c(
                F,
                {
                  type: "button",
                  size: "sm",
                  disabled: !It,
                  title: Ue,
                  onClick: Xe,
                  children: [
                    T ? /* @__PURE__ */ r(z, { className: "size-4 animate-spin" }) : /* @__PURE__ */ r(ln, { className: "size-4" }),
                    xt ? "已发布" : "发布"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ r(
          Fn,
          {
            open: wt,
            form: tt,
            options: vt,
            loadingOptions: St,
            publishing: T,
            error: Pe,
            onOpenChange: (s) => {
              T || ct(s);
            },
            onChange: dt,
            onSubmit: () => {
              Ye();
            }
          }
        )
      ]
    }
  );
}
function Fn({
  open: t,
  form: e,
  options: n,
  loadingOptions: i,
  publishing: a,
  error: o,
  onOpenChange: g,
  onChange: I,
  onSubmit: m
}) {
  const P = (S) => {
    I({ ...e, ...S });
  };
  return /* @__PURE__ */ r(bn, { open: t, onOpenChange: g, children: /* @__PURE__ */ c(yn, { className: "gap-0 overflow-hidden p-0 sm:max-w-xl", children: [
    /* @__PURE__ */ c(xn, { className: "border-b px-5 py-4 text-start", children: [
      /* @__PURE__ */ r(_n, { children: "发布设置" }),
      /* @__PURE__ */ r(kn, { children: "测试通过的技能内容不会在这里修改；这里只调整发布元信息。" })
    ] }),
    /* @__PURE__ */ c("div", { className: "space-y-4 px-5 py-4", children: [
      /* @__PURE__ */ r(rt, { label: "技能标识", children: /* @__PURE__ */ r(Ut, { value: e.key, disabled: !0, className: "font-mono" }) }),
      /* @__PURE__ */ r(rt, { label: "技能名称", required: !0, children: /* @__PURE__ */ r(
        Ut,
        {
          value: e.name,
          disabled: a,
          onChange: (S) => P({ name: S.target.value })
        }
      ) }),
      /* @__PURE__ */ r(rt, { label: "技能描述", children: /* @__PURE__ */ r(
        Ae,
        {
          value: e.description,
          disabled: a,
          className: "min-h-24 resize-none",
          onChange: (S) => P({ description: S.target.value })
        }
      ) }),
      /* @__PURE__ */ r(rt, { label: "技能方案", children: /* @__PURE__ */ r(
        ye,
        {
          value: e.packID,
          disabled: a || i,
          options: n.packs,
          placeholder: i ? "正在加载..." : "请选择技能方案",
          onChange: (S) => P({ packID: S })
        }
      ) }),
      /* @__PURE__ */ r(rt, { label: "技能分类", children: /* @__PURE__ */ r(
        ye,
        {
          value: e.cateID,
          disabled: a || i,
          options: n.cates,
          placeholder: i ? "正在加载..." : "请选择技能分类",
          onChange: (S) => P({ cateID: S })
        }
      ) }),
      o ? /* @__PURE__ */ r("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: o }) : null
    ] }),
    /* @__PURE__ */ c("div", { className: "flex justify-end gap-2 border-t px-5 py-3", children: [
      /* @__PURE__ */ r(
        F,
        {
          type: "button",
          variant: "outline",
          disabled: a,
          onClick: () => g(!1),
          children: "取消"
        }
      ),
      /* @__PURE__ */ c(F, { type: "button", disabled: a, onClick: m, children: [
        a ? /* @__PURE__ */ r(z, { className: "size-4 animate-spin" }) : null,
        "保存并发布"
      ] })
    ] })
  ] }) });
}
function rt({
  label: t,
  required: e,
  children: n
}) {
  return /* @__PURE__ */ c("label", { className: "grid gap-2 text-sm font-medium text-foreground", children: [
    /* @__PURE__ */ c("span", { children: [
      t,
      e ? /* @__PURE__ */ r("span", { className: "ml-1 text-destructive", children: "*" }) : null
    ] }),
    n
  ] });
}
function ye({
  value: t,
  options: e,
  disabled: n,
  placeholder: i,
  onChange: a
}) {
  const o = e.some((g) => g.id === t) ? t : void 0;
  return /* @__PURE__ */ c(
    wn,
    {
      value: o,
      disabled: n,
      onValueChange: a,
      children: [
        /* @__PURE__ */ r(Dn, { children: /* @__PURE__ */ r(An, { placeholder: i }) }),
        /* @__PURE__ */ r(vn, { children: e.map((g) => /* @__PURE__ */ r(Sn, { value: g.id, children: g.name }, g.id)) })
      ]
    }
  );
}
function qn({ message: t }) {
  return t.kind === "test" && t.result ? /* @__PURE__ */ r(jn, { result: t.result }) : t.kind === "analysis" || t.kind === "repair" ? /* @__PURE__ */ r("div", { className: "space-y-2", children: t.running && !t.output ? /* @__PURE__ */ c("div", { className: "text-muted-foreground", children: [
    /* @__PURE__ */ r(z, { className: "mr-2 inline size-3.5 animate-spin align-[-2px]" }),
    t.text
  ] }) : /* @__PURE__ */ r(
    pn,
    {
      output: t.output || Y(t.text),
      streaming: t.running,
      emptyText: t.kind === "repair" ? "等待智能体修复技能。" : "等待智能体分析测试结果。"
    }
  ) }) : /* @__PURE__ */ c("div", { className: "whitespace-pre-wrap break-words", children: [
    t.running ? /* @__PURE__ */ r(z, { className: "mr-2 inline size-3.5 animate-spin align-[-2px]" }) : null,
    t.text
  ] });
}
function jn({ result: t }) {
  const e = t.status === 1, n = t.data, i = rs(n.tests);
  i.length === 0 && h(n.test) && i.push(n.test);
  const a = Te(n.issues);
  return /* @__PURE__ */ c("div", { className: "space-y-2", children: [
    /* @__PURE__ */ c("div", { className: "flex items-center gap-2 font-medium", children: [
      e ? /* @__PURE__ */ r(un, { className: "size-4 text-emerald-600" }) : /* @__PURE__ */ r(cn, { className: "size-4 text-destructive" }),
      /* @__PURE__ */ r("span", { children: t.msg || (e ? "测试通过" : "测试未通过") })
    ] }),
    a.length > 0 ? /* @__PURE__ */ r("div", { className: "rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900", children: a.map((o) => /* @__PURE__ */ c("div", { children: [
      "- ",
      o
    ] }, o)) }) : null,
    i.map((o, g) => /* @__PURE__ */ r(
      zn,
      {
        test: o,
        showDivider: g > 0
      },
      `${l(o.target)}:${l(o.script)}:${g}`
    ))
  ] });
}
function zn({
  test: t,
  showDivider: e
}) {
  const n = l(t.duration_ms);
  return /* @__PURE__ */ c("div", { className: Bt("space-y-2", e && "border-t pt-2"), children: [
    /* @__PURE__ */ c("div", { className: "grid gap-2 text-xs text-muted-foreground sm:grid-cols-3", children: [
      /* @__PURE__ */ c("div", { children: [
        "脚本：",
        l(t.script) || "自动选择"
      ] }),
      /* @__PURE__ */ c("div", { children: [
        "退出码：",
        l(t.exit_code) || "0"
      ] }),
      /* @__PURE__ */ c("div", { children: [
        "耗时：",
        n ? `${n}ms` : "-"
      ] })
    ] }),
    /* @__PURE__ */ r(Ot, { title: "输出", value: l(t.stdout) }),
    /* @__PURE__ */ r(Ot, { title: "错误输出", value: l(t.stderr) }),
    /* @__PURE__ */ r(Ot, { title: "异常", value: l(t.error) })
  ] });
}
function Ot({ title: t, value: e }) {
  return e ? /* @__PURE__ */ c("div", { className: "space-y-1", children: [
    /* @__PURE__ */ r("div", { className: "text-xs font-medium text-muted-foreground", children: t }),
    /* @__PURE__ */ r("pre", { className: "max-h-40 overflow-auto rounded-md bg-background p-2 text-xs leading-5 text-foreground", children: e })
  ] }) : null;
}
async function $n(t, e, n, i) {
  const a = await Bn(t, {
    id: e,
    args: n,
    config: i,
    timeout_seconds: Rn
  });
  return Vn(a);
}
async function Bn(t, e) {
  const n = await fetch(t, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      ...mn({
        contentType: "application/json",
        url: t
      }),
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify(e)
  }), i = await n.text();
  if (!i)
    return {
      status: n.ok ? 1 : 2,
      msg: n.ok ? "请求成功。" : `请求失败：${n.status}`,
      data: {}
    };
  try {
    return JSON.parse(i);
  } catch {
    return {
      status: 2,
      msg: n.ok ? "响应不是有效 JSON。" : `请求失败：${n.status}`,
      data: { text: i }
    };
  }
}
function Vn(t) {
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
function ke(t) {
  if (t.status === 1)
    return !1;
  const e = h(t.data) ? t.data : {};
  return Ie(e.repairable);
}
function Ln(t, e) {
  const n = as({ message: e.msg, data: e.data });
  return n ? `${t}:${n.slice(0, 1e3)}` : "";
}
function Un(t) {
  const e = h(t.validation) ? t.validation : null;
  if (!e || l(e.valid) === "true" || e.valid === !0)
    return "";
  const n = Te(e.issues);
  return n.length === 0 ? "" : `AI 修复已保存，但内容检查仍未通过：
${n.slice(0, 5).join(`
`)}`;
}
function xe(t, e, n) {
  if (!h(t))
    return {
      status: 2,
      msg: n,
      data: {}
    };
  const i = Number(
    t.status || (Number(t.code) === 0 ? 1 : 0)
  );
  return {
    status: i === 1 ? 1 : 2,
    msg: l(t.msg || t.message) || (i === 1 ? e : n),
    data: h(t.data) ? t.data : {}
  };
}
function Hn(t) {
  if (!h(t))
    return { packs: [], cates: [] };
  const e = h(t.data) ? t.data : t;
  return {
    packs: _e(e.packs),
    cates: _e(e.cates)
  };
}
function _e(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!h(e))
      return null;
    const n = l(e.id || e.value || e.key), i = l(e.name || e.label || e.title || e.text);
    return n && i ? { id: n, name: i } : null;
  }).filter((e) => !!e) : [];
}
function Kn(t, e) {
  const n = we(t.packID, e.packs), i = we(t.cateID, e.cates);
  return n === t.packID && i === t.cateID ? t : { ...t, packID: n, cateID: i };
}
function we(t, e) {
  return t && e.some((n) => n.id === t) ? t : e[0]?.id || "";
}
function Ft(t) {
  return {
    key: l(t.key),
    name: l(t.name),
    description: l(t.description),
    packID: l(t.pack_id || t.packId),
    cateID: l(t.cate_id || t.cateId)
  };
}
function Jn(t, e, n) {
  return [
    "请根据本次技能测试失败结果修复当前技能草稿。",
    `技能：${l(t.name) || l(t.key) || "未命名技能"}`,
    `测试参数：${n.length > 0 ? n.join(", ") : "无"}`,
    `测试消息：${e.msg}`
  ].join(`
`);
}
function ve(t) {
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
function Gn(t) {
  return `skill_draft:${t}`;
}
async function Xn({
  api: t,
  agentKey: e,
  agentName: n,
  contextKey: i
}) {
  const a = await De(t, {
    agent_key: e,
    context_key: i,
    title: n ? `${n} 会话` : "技能创建工程师会话",
    limit: 80
  }), o = h(a.session) ? a.session : {}, g = C(o.id);
  if (g <= 0)
    throw new Error("创建技能修复会话失败。");
  return {
    sessionID: g,
    messages: Array.isArray(a.messages) ? a.messages : []
  };
}
async function W({
  api: t,
  sessionID: e,
  agentKey: n,
  contextKey: i,
  role: a,
  kind: o,
  text: g,
  data: I,
  output: m,
  requestID: P,
  status: S
}) {
  return e <= 0 ? {} : await De(t, {
    session_id: e,
    agent_key: n,
    context_key: i,
    role: a,
    kind: o,
    text: g,
    content: {
      kind: o,
      data: I || {}
    },
    output: m || {},
    request_id: P || "",
    status: S || Ne
  });
}
function Wn(t) {
  return t.map((e) => Yn(e)).filter((e) => !!e);
}
function Yn(t) {
  if (!h(t))
    return null;
  const e = l(t.role) === "user" ? "user" : "assistant", n = h(t.content) ? t.content : {}, i = h(t.output) ? t.output : {}, a = {
    role: e,
    text: l(t.text)
  }, o = l(n.kind || t.kind);
  return o && (a.type = o), h(n.data) && (a.data = n.data), Object.keys(i).length > 0 && (a.output = i), a;
}
function Qn({
  draftID: t,
  draft: e,
  patchPayload: n,
  sessionID: i,
  agentKey: a,
  contextKey: o
}) {
  return {
    ...n,
    id: t,
    expected_version: C(e.version),
    pack_id: C(n.pack_id || n.packId) || C(e.pack_id || e.packId),
    cate_id: C(n.cate_id || n.cateId) || C(e.cate_id || e.cateId),
    assistant_session_id: i,
    assistant_agent_key: a,
    assistant_context_key: o
  };
}
function Kt(t) {
  const e = hn(t?.output, t);
  return h(e) ? e : null;
}
function Se(t) {
  const e = Kt(t);
  return h(e) && (l(e.text) || l(e.content) || l(e.message) || l(e.result)) || l(t?.msg);
}
function Y(t) {
  return {
    text: t,
    content: {
      format: "markdown",
      text: t
    }
  };
}
function Zn(t) {
  return {
    id: t.id,
    key: t.key,
    name: t.name,
    description: t.description,
    manifest: t.manifest
  };
}
function ts(t) {
  const e = ns(t.manifest), n = Array.isArray(e.config) ? e.config : [], i = [], a = /* @__PURE__ */ new Set();
  return n.forEach((o) => {
    if (!h(o))
      return;
    const g = l(o.key).trim();
    if (!g)
      return;
    const I = l(
      o.target_key || o.targetKey || o.target
    ).trim(), m = JSON.stringify([I, g]);
    a.has(m) || (a.add(m), i.push({
      id: m,
      key: g,
      targetKey: I,
      name: l(o.name).trim() || g,
      type: l(o.type).trim().toLowerCase() === "secret" ? "secret" : "text",
      required: Ie(o.required)
    }));
  }), i;
}
function es(t, e) {
  return t.flatMap((n) => {
    const i = e[n.id] || "";
    return i.trim() ? [{ key: n.key, target_key: n.targetKey, value: i }] : [];
  });
}
function ns(t) {
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
function Ie(t) {
  return typeof t == "boolean" ? t : typeof t == "number" ? t === 1 : ["1", "true", "yes", "on"].includes(
    l(t).trim().toLowerCase()
  );
}
function ss(t) {
  return t.split(/\r?\n|,/).map((e) => e.trim()).filter(Boolean);
}
function Te(t) {
  return Array.isArray(t) ? t.map((e) => l(e)).filter(Boolean) : [];
}
function rs(t) {
  return Array.isArray(t) ? t.filter(h) : [];
}
function as(t) {
  try {
    const e = JSON.stringify(t, null, 2);
    return e.length > 6e3 ? `${e.slice(0, 6e3)}
...` : e;
  } catch {
    return l(t);
  }
}
function C(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
export {
  cs as ShowSkillTest
};
