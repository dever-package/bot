import { j as s, a as g, i as je, F as Rt } from "./preloadable-Bomi5PEU.js";
import { a as c, d as O, b as H, e as G, u as te } from "./_commonjsHelpers-61wyk6v6.js";
import { aj as Ft, X as nr, r as _e, R as sr, ax as or, Q as ir } from "./vendor-icons-DwjYEojZ.js";
import { A as Tt, c as ar } from "./clipboard-BLzb9wLn.js";
import { a as lr, u as ur } from "./node-detail-content-CiCW3n62.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./stream-power-history-api-CXdEYuqM.css", import.meta.url).href]);
const cr = 12, dr = 2e3, mr = [1500, 5e3, 21e3];
function fr(e) {
  const [t, n] = c([]), [o, i] = c(0), [d, p] = c(!1), [h, x] = c(0), [L, j] = c(0), [R, E] = c(null), [A, w] = c(null), [ze, se] = c(!1), [Ue, ye] = c(!1), [fe, $] = c(!1), [Ce, J] = c(!1), [Me, I] = c(""), [be, W] = c(""), Z = O(/* @__PURE__ */ new Map()), C = O(0), z = O(0), M = O(0), N = O(0), re = O(0), oe = O(0), U = O([]);
  H(() => {
    N.current = h;
  }, [h]);
  const K = G(
    async (l, _ = !1) => {
      if (!e || l <= 0)
        return null;
      const v = Z.current.get(l);
      if (v && !_)
        return E(v), v;
      const P = C.current, T = M.current + 1;
      M.current = T, v || J(!0);
      try {
        const D = await e.loadDetail(l);
        return P !== C.current || T !== M.current ? null : (gr(Z.current, D), n((q) => st(q, [D])), N.current === l && E(D), W(""), D);
      } catch (D) {
        return P === C.current && T === M.current && W(
          Nt(D, "读取工具历史详情失败")
        ), null;
      } finally {
        P === C.current && T === M.current && J(!1);
      }
    },
    [e]
  ), F = G(
    async (l = "initial") => {
      if (!e)
        return;
      const _ = l === "append", v = C.current, P = z.current + 1;
      z.current = P;
      const T = _ ? oe.current : 0;
      _ ? $(!0) : ye(!0);
      try {
        const D = await e.loadPage(T || void 0);
        if (v !== C.current || P !== z.current)
          return;
        if (n((q) => st(q, D.items)), i(D.total), l === "refresh" ? p((q) => q || D.hasMore) : (p(D.hasMore), oe.current = D.beforeID), I(""), l === "initial" && e.selectLatest !== !1 && N.current === 0 && D.items[0]) {
          const q = D.items[0].id, ge = Z.current.get(q) || null;
          N.current = q, x(q), E(ge), J(!ge), j((Ye) => Ye + 1);
        }
      } catch (D) {
        v === C.current && P === z.current && I(Nt(D, "读取工具历史失败"));
      } finally {
        v === C.current && P === z.current && (ye(!1), $(!1));
      }
    },
    [e]
  );
  H(() => (C.current += 1, z.current += 1, M.current += 1, $e(U), Z.current.clear(), N.current = 0, re.current = 0, oe.current = 0, n([]), i(0), p(!1), x(0), j(0), E(null), w(null), se(!1), ye(!1), $(!1), J(!1), I(""), W(""), e && F("initial"), () => {
    C.current += 1, z.current += 1, M.current += 1, $e(U);
  }), [e?.scopeKey]), H(() => {
    if (!e || h <= 0 || h === A?.historyID) {
      E(null), J(!1);
      return;
    }
    K(h);
  }, [e, A?.historyID, K, h]), H(() => {
    if (!e || !R || R.id !== h || !Lt(R.status))
      return;
    const l = window.setInterval(() => {
      K(R.id, !0);
    }, dr);
    return () => window.clearInterval(l);
  }, [e, K, R, h]);
  const ne = G(() => {
    $e(U), x(0), N.current = 0, re.current = 0, E(null), w(null), se(!1), W("");
  }, []), ie = G(
    (l) => {
      if (l.historyID <= 0)
        return;
      const _ = t.some((P) => P.id === l.historyID), v = (/* @__PURE__ */ new Date()).toISOString();
      re.current = l.historyID, w(l), x(l.historyID), N.current = l.historyID, E(null), n(
        (P) => st(P, [
          {
            id: l.historyID,
            runID: l.runID,
            requestID: l.requestID,
            title: l.title,
            titleSource: "auto",
            inputSummary: l.inputSummary,
            status: "running",
            error: "",
            createdAt: v,
            startedAt: v,
            finishedAt: ""
          }
        ])
      ), _ || i((P) => P + 1);
    },
    [t]
  ), pe = G(
    (l, _, v) => {
      l <= 0 || n(
        (P) => P.map(
          (T) => T.id === l && (T.status !== _ || T.error !== v) ? { ...T, status: _, error: v } : T
        )
      );
    },
    []
  ), V = G(() => {
    if (!e || re.current <= 0)
      return;
    $e(U), F("refresh");
    const l = e.refreshDelaysMs ?? mr;
    U.current = l.map(
      (_) => window.setTimeout(() => {
        F("refresh");
      }, _)
    );
  }, [e, F]), Oe = G(() => {
    se(!0), e && F("refresh");
  }, [e, F]), ae = G(() => {
    se(!1);
  }, []), Ee = G((l) => {
    const _ = Z.current.get(l) || null;
    x(l), N.current = l, E(_), j((v) => v + 1), J(!_), se(!1), W("");
  }, []), le = G(() => {
    h > 0 && K(h, !0);
  }, [K, h]), Fe = te(
    () => t.find((l) => l.id === h) || null,
    [t, h]
  );
  return {
    enabled: !!e,
    items: t,
    total: o,
    hasMore: d,
    selectedID: h,
    selectionRevision: L,
    selectedItem: Fe,
    selectedDetail: R,
    liveRun: A,
    panelOpen: ze,
    loading: Ue,
    loadingMore: fe,
    detailLoading: Ce,
    listError: Me,
    detailError: be,
    beginRun: ne,
    registerLiveRun: ie,
    syncLiveRun: pe,
    finishLiveRun: V,
    openPanel: Oe,
    closePanel: ae,
    selectHistory: Ee,
    loadMore: () => {
      F("append");
    },
    retryList: () => {
      F("initial");
    },
    retryDetail: le
  };
}
function It({
  controller: e,
  label: t
}) {
  return e.enabled ? /* @__PURE__ */ s(Tt, { label: "运行历史", children: /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: "stream-power-history-trigger",
      "aria-label": "打开运行历史",
      onClick: e.openPanel,
      children: [
        /* @__PURE__ */ s(Ft, {}),
        t ? /* @__PURE__ */ s("span", { className: "stream-power-history-trigger-label", children: t }) : null,
        e.total > 0 ? /* @__PURE__ */ s("span", { className: "stream-power-history-trigger-count", children: e.total }) : null
      ]
    }
  ) }) : null;
}
function pr({
  controller: e
}) {
  return H(() => {
    if (!e.panelOpen)
      return;
    const n = (o) => {
      o.key === "Escape" && e.closePanel();
    };
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [e.closePanel, e.panelOpen]), !e.enabled || !e.panelOpen ? null : /* @__PURE__ */ s(
    "div",
    {
      className: "stream-power-history-layer",
      role: "presentation",
      onMouseDown: (n) => {
        n.target === n.currentTarget && e.closePanel();
      },
      children: /* @__PURE__ */ g("aside", { className: "stream-power-history-panel", "aria-label": "工具运行历史", children: [
        /* @__PURE__ */ g("header", { className: "stream-power-history-header", children: [
          /* @__PURE__ */ g("div", { children: [
            /* @__PURE__ */ s("strong", { children: "运行历史" }),
            /* @__PURE__ */ s("small", { children: e.total ? `共 ${e.total} 条` : "暂无记录" })
          ] }),
          /* @__PURE__ */ s(Tt, { label: "关闭", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              "aria-label": "关闭运行历史",
              onClick: e.closePanel,
              children: /* @__PURE__ */ s(nr, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ s("div", { className: "stream-power-history-list", children: e.loading && e.items.length === 0 ? /* @__PURE__ */ s(
          nt,
          {
            icon: /* @__PURE__ */ s(_e, { className: "animate-spin" }),
            text: "读取历史"
          }
        ) : e.listError && e.items.length === 0 ? /* @__PURE__ */ s(
          nt,
          {
            icon: /* @__PURE__ */ s(sr, {}),
            text: e.listError,
            action: "重试",
            onAction: e.retryList
          }
        ) : e.items.length === 0 ? /* @__PURE__ */ s(nt, { icon: /* @__PURE__ */ s(Ft, {}), text: "还没有运行记录" }) : e.items.map((n) => /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "stream-power-history-item",
            "data-active": e.selectedID === n.id,
            onClick: () => e.selectHistory(n.id),
            children: [
              /* @__PURE__ */ s("span", { className: "stream-power-history-item-title", children: n.title || "未命名运行" }),
              n.inputSummary ? /* @__PURE__ */ s("span", { className: "stream-power-history-item-summary", children: n.inputSummary }) : null,
              /* @__PURE__ */ g("span", { className: "stream-power-history-item-meta", children: [
                /* @__PURE__ */ s("i", { "data-status": n.status }),
                /* @__PURE__ */ s("span", { children: qt(n.status) }),
                /* @__PURE__ */ s("time", { children: hr(n.createdAt) })
              ] })
            ]
          },
          n.id
        )) }),
        e.items.length > 0 && e.hasMore ? /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "stream-power-history-more",
            disabled: e.loadingMore,
            onClick: e.loadMore,
            children: [
              e.loadingMore ? /* @__PURE__ */ s(_e, { className: "animate-spin" }) : null,
              e.loadingMore ? "加载中" : "加载更多"
            ]
          }
        ) : null
      ] })
    }
  );
}
function nt({
  icon: e,
  text: t,
  action: n,
  onAction: o
}) {
  return /* @__PURE__ */ g("div", { className: "stream-power-history-state", children: [
    e,
    /* @__PURE__ */ s("span", { children: t }),
    n && o ? /* @__PURE__ */ s("button", { type: "button", onClick: o, children: n }) : null
  ] });
}
function qt(e) {
  switch (e) {
    case "pending":
      return "等待生成";
    case "running":
      return "生成中";
    case "waiting":
      return "等待处理";
    case "success":
      return "已完成";
    case "fail":
      return "生成失败";
    case "canceled":
      return "已停止";
    case "unavailable":
      return "不可用";
    default:
      return e || "等待生成";
  }
}
function Lt(e) {
  return e === "pending" || e === "running" || e === "waiting";
}
function st(e, t) {
  const n = /* @__PURE__ */ new Map();
  return e.forEach((o) => n.set(o.id, o)), t.forEach((o) => {
    const i = n.get(o.id);
    n.set(o.id, i ? { ...i, ...o } : o);
  }), [...n.values()].sort((o, i) => i.id - o.id);
}
function gr(e, t) {
  for (e.delete(t.id), e.set(t.id, t); e.size > cr; ) {
    const n = e.keys().next().value;
    if (typeof n != "number")
      return;
    e.delete(n);
  }
}
function hr(e) {
  const t = new Date(e);
  if (!e || Number.isNaN(t.getTime()))
    return "";
  const n = /* @__PURE__ */ new Date();
  return t.toDateString() === n.toDateString() ? t.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }) : t.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}
function Nt(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
function $e(e) {
  e.current.forEach((t) => window.clearTimeout(t)), e.current = [];
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/components/ui/button", "@/components/searchable-option-picker", "@/lib/request", "@/lib/runtime-stream-runner", "@/lib/stream", "@/lib/runtime-stream-output", "@/hooks/use-upload-rule-metas", "@/components/agent/stream-request-params", "@/components/stream-timing", "@/components/reference-composer"]);
const it = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!it || Object.keys(it).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const wr = it.EnergonContentView, at = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!at || Object.keys(at).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const At = at.Button, lt = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!lt || Object.keys(lt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const yr = lt.SearchableOptionPicker, ut = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ut || Object.keys(ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const br = ut.request, Be = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-runner");
if (!Be || Object.keys(Be).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-runner");
const vr = Be.runRuntimeStream, Pr = Be.stopRuntimeStream, ct = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!ct || Object.keys(ct).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const B = ct.streamValueText, me = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const _t = me.isEmptyRuntimeOutput, we = me.isPlainRecord, Sr = me.normalizeRuntimeFrameOutput, Dr = me.resolveRuntimeFrameCancelable, kt = me.runtimeErrorMessage, dt = window.DeverFront?.sdk?.getCompatModule("@/hooks/use-upload-rule-metas");
if (!dt || Object.keys(dt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/hooks/use-upload-rule-metas");
const Rr = dt.useUploadRuleMetas, k = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!k || Object.keys(k).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const Ir = k.PowerParamPopover, Nr = k.buildPowerParamFileUsageOptions, _r = k.PowerParamField, kr = k.buildDefaultParamValues, xr = k.buildRequestInput, Cr = k.filterActivePowerParams, Ne = k.inputKeyForParam, Mr = k.isHiddenParam, Or = k.isMainParam, Er = k.isSelectedOptionValue, xt = k.isToolbarParam, Fr = k.normalizePowerParamConfig, Tr = k.paramFilesRequestValue, qr = k.resolvePowerParamFileKinds, Lr = k.shouldDisplayPowerParam, Ar = k.validateMainParams, Q = window.DeverFront?.sdk?.getCompatModule("@/components/stream-timing");
if (!Q || Object.keys(Q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/stream-timing");
const Hr = Q.StreamTimingBadge, jr = Q.cancelStreamTiming, $r = Q.createStreamTiming, Ct = Q.finishStreamTiming, Vr = Q.isStreamTimingStatusOutput, Br = Q.markStreamTimingStopping, zr = Q.updateStreamTimingFromOutput, Ur = Q.useStreamClock, mt = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!mt || Object.keys(mt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const Ht = mt.ReferenceEditor, Yr = k.isPromptParam, Mt = {
  text: "",
  reasoning: "",
  liveOutput: null,
  finalOutput: null
};
function vn({
  powerKey: e,
  requestApi: t,
  paramApi: n,
  streamApi: o,
  stopApi: i,
  blockMs: d = 1e3,
  requestScope: p,
  paramScope: h = p,
  height: x = "min(60vh, 600px)",
  resultTitle: L = "测试结果",
  formHeader: j,
  renderResultActions: R,
  referenceProviders: E = [],
  assetReferenceTeamID: A = 0,
  appearance: w = "default",
  uploadBizKey: ze,
  uploadBizName: se,
  allowResourceLibrary: Ue = !0,
  onUploadedFiles: ye,
  history: fe
}) {
  const [$, Ce] = c(""), [J, Me] = c("0-0"), [I, be] = c(!1), [W, Z] = c(!1), [C, z] = c(!1), [M, N] = c(""), [re, oe] = c(!1), [U, K] = c(Mt), [F, ne] = c(), [ie, pe] = c(!1), [V, Oe] = c([]), [ae, Ee] = c([]), [le, Fe] = c(1), [l, _] = c({ power: "", id: "" }), [v, P] = c({}), [T, D] = c({}), [q, ge] = c({}), [Ye, zt] = c(0), [Ut, Ge] = c(!1), [ve, Te] = c("input"), ue = O(0), Pe = O(null), Xe = O({}), Se = O(""), Qe = O(""), qe = O(null), Le = O(null), Je = O(!0), u = fr(fe), De = u.liveRun?.historyID || 0, b = !u.enabled || u.selectedID === 0 || u.selectedID === De, ee = l.power === e ? l.id : "", Ae = G(
    (r, a) => {
      const m = tn(r, a);
      P(m.values), D(m.files), ge(m.referenceContents), zt((y) => y + 1);
    },
    []
  );
  H(() => {
    _({ power: "", id: "" }), Se.current = "", Qe.current = "";
  }, [fe?.scopeKey, e]);
  const he = te(
    () => Cr(V, v),
    [v, V]
  ), pt = te(
    () => he.filter(
      (r) => Lr(r, V)
    ),
    [he, V]
  ), Yt = te(
    () => he.map((r) => Number(r.upload_rule_id || 0)).filter((r) => Number.isFinite(r) && r > 0),
    [he]
  ), Gt = Rr(Yt), gt = te(
    () => pt.filter(
      (r) => !Mr(r) && (Or(r) || xt(r))
    ),
    [pt]
  ), ht = te(
    () => Nr(he),
    [he]
  ), We = V.length > 0, Xt = te(
    () => ae.map((r) => ({
      id: r.id,
      value: w === "body" ? B(r.service_name) || "未命名服务" : r.name
    })),
    [w, ae]
  ), wt = !je(le) || ee.length > 0, Qt = Ur(F?.status === "running"), Ze = w === "body" && A > 0 ? (r) => /* @__PURE__ */ s(lr, { ...r, teamID: A }) : void 0, Jt = te(
    () => We && wt && !I && !ie && e.length > 0,
    [We, ie, e, I, wt]
  );
  H(() => () => {
    ue.current += 1, Pe.current?.abort(), Et(qe);
  }, []), H(() => {
    Te("input");
  }, [e]), H(() => {
    let r = !1;
    if (Oe([]), Ee([]), P({}), D({}), ge({}), Xe.current = {}, Se.current = "", N(""), oe(!1), !e)
      return Fe(1), pe(!1), () => {
        r = !0;
      };
    async function a() {
      pe(!0);
      const m = await br(n, "get", {
        ...h,
        power: e,
        include_sources: 1,
        source_target_id: ee
      });
      if (r)
        return;
      if (m.code !== 0 && m.status !== 1) {
        pe(!1), N(m.message || m.msg || "读取能力参数失败。");
        return;
      }
      const y = we(m.data) ? m.data : {}, f = Fr(m.data), S = f.params, de = we(y.initial_input) ? y.initial_input : {};
      Fe(f.sourceRule), Ee(f.sources), f.selectedSourceID && f.selectedSourceID !== ee && _({ power: e, id: f.selectedSourceID }), Se.current = "", Oe(S), Ae(S, de), pe(!1);
    }
    return a(), () => {
      r = !0;
    };
  }, [ee, Ae, n, h, e]), H(() => {
    if (!b)
      return;
    const r = Le.current;
    if (!r || !Je.current)
      return;
    ot(r);
    const a = window.setTimeout(() => ot(r), 0);
    return () => {
      window.clearTimeout(a);
    };
  }, [U, I, b]), H(() => {
    const r = Le.current;
    if (r) {
      if (b) {
        ot(r);
        return;
      }
      r.scrollTop = 0;
    }
  }, [u.selectedID, b]);
  const Wt = () => {
    const r = Le.current;
    r && (Je.current = Wr(r));
  }, yt = async () => {
    if (!(!$ || !W || C)) {
      z(!0), N(""), ne((r) => Br(r)), Pe.current?.abort();
      try {
        await Pr($, i), ue.current += 1, be(!1), Z(!1), ne((r) => jr(r)), u.finishLiveRun();
      } catch (r) {
        N(kt(r, "停止任务失败。"));
      } finally {
        z(!1);
      }
    }
  }, Zt = async () => {
    if (!e) {
      N("未选择能力。");
      return;
    }
    const r = Ar(V, v);
    if (r) {
      N(r);
      return;
    }
    const a = Xr(
      q,
      ht
    );
    if (a) {
      N(a);
      return;
    }
    const m = ue.current + 1;
    ue.current = m, u.beginRun(), w === "body" && Te("result"), be(!0), N(""), oe(!1), K(Mt), ne($r("正在连接模型")), Ce(""), Ge(!1), Me("0-0"), Z(!1), z(!1), Je.current = !0;
    const y = new AbortController();
    Pe.current = y;
    try {
      const f = xr(V, v);
      Object.keys(q).length > 0 && (f._reference_contents = q), Xe.current = { ...f };
      const S = {
        ...p,
        power: e,
        input: f,
        params_complete: !0,
        history: [],
        options: {
          stream: !0
        }
      };
      je(le) && ee && (S.source_target_id = ee), await vr({
        requestApi: t,
        streamApi: o,
        stopApi: i,
        stopOnAbort: !1,
        body: S,
        blockMs: d,
        signal: y.signal,
        onRequestID: Ce,
        onFrame: (de) => {
          if (ue.current !== m || y.signal.aborted)
            return;
          const Dt = B(de?.stream_id);
          Dt && Me(Dt), Kt(de);
        }
      });
    } catch (f) {
      ue.current === m && (N(kt(f, "测试失败。")), ne((S) => Ct(S, "failed")), u.finishLiveRun());
    } finally {
      ue.current === m && be(!1), Pe.current === y && (Pe.current = null);
    }
  }, Kt = (r) => {
    const a = Sr(r?.output, r);
    if (_t(a) && r.type !== "result")
      return;
    const m = Dr(r);
    m != null && Z(m);
    const y = B(a.event).toLowerCase();
    if (y === "start") {
      const f = a, S = we(f.meta) ? f.meta : {}, de = Ve(S.history_id);
      de > 0 && u.registerLiveRun({
        historyID: de,
        runID: Ve(S.run_id),
        requestID: B(r?.request_id),
        title: B(S.history_title) || "未命名运行",
        inputSummary: B(S.history_input_summary),
        input: { ...Xe.current },
        targetAssetID: Ve(S.target_asset_id),
        sourceTargetID: Ve(S.source_target_id)
      });
    }
    Vr(a) && ne((f) => zr(f, a)), r.type === "result" && (oe(Number(r.status) === 2), ne(
      (f) => Ct(
        f,
        Number(r.status) === 2 ? "failed" : "done"
      )
    ), u.finishLiveRun()), K((f) => {
      if (B(a.event).toLowerCase() === "control")
        return f;
      if (r.type === "result")
        return {
          ...f,
          finalOutput: _t(a) ? { text: f.text || B(r?.msg) } : a
        };
      const S = {
        text: f.text,
        reasoning: f.reasoning,
        liveOutput: f.liveOutput,
        finalOutput: f.finalOutput
      };
      return y === "audio_ready" && (S.liveOutput = a), (y === "delta" || !y && a.text) && (S.text += B(a.text)), (y === "reasoning" || a.reasoning) && (S.reasoning += B(a.reasoning || a.text)), S;
    });
  }, bt = (r, a) => {
    const m = Ne(r);
    m && P((y) => ({
      ...y,
      [m]: a
    }));
  }, er = (r, a) => {
    const m = Ne(r);
    m && (D((y) => ({
      ...y,
      [m]: a
    })), P((y) => ({
      ...y,
      [m]: Tr(r, a)
    })));
  }, tr = async () => {
    const r = $.trim();
    if (r)
      try {
        await ar(r), Ge(!0), Et(qe), qe.current = window.setTimeout(() => {
          Ge(!1), qe.current = null;
        }, 1200);
      } catch {
        N("复制 RequestID 失败。");
      }
  }, Ke = !!($ && U.finalOutput && !I && !re && !M), rr = Qr({
    running: I,
    stopping: C,
    failed: !!(M || re),
    canceled: F?.status === "canceled",
    successful: Ke
  }), et = Jr({
    running: I,
    stopping: C,
    failed: !!(M || re),
    canceled: F?.status === "canceled",
    successful: Ke
  });
  H(() => {
    De > 0 && u.syncLiveRun(De, et, M);
  }, [M, u.syncLiveRun, De, et]);
  const Y = b ? null : u.selectedDetail, tt = b ? u.liveRun?.input : Y?.input, Re = b ? u.liveRun?.sourceTargetID || 0 : Y?.sourceTargetID || 0;
  H(() => {
    const r = u.selectedID;
    if (!u.enabled || r <= 0 || !tt || V.length === 0)
      return;
    const a = [
      fe?.scopeKey || "",
      r,
      u.selectionRevision
    ].join(":");
    if (Qe.current !== a && (Qe.current = a, je(le) && Re > 0 && ae.some(
      (m) => m.id === String(Re)
    ) && String(Re) !== ee)) {
      _({
        power: e,
        id: String(Re)
      });
      return;
    }
    Se.current !== a && (Se.current = a, Ae(V, tt));
  }, [
    ee,
    Ae,
    fe?.scopeKey,
    u.enabled,
    u.selectedID,
    u.selectionRevision,
    e,
    V,
    ae,
    tt,
    Re,
    le
  ]);
  const ce = u.selectedItem, He = b ? et : Y?.status || ce?.status || "pending", vt = b ? rr : qt(He), Pt = b ? U.finalOutput : Y?.output || null, rt = {
    historyID: b ? De : Y?.id || ce?.id || 0,
    runID: b ? u.liveRun?.runID || 0 : Y?.runID || ce?.runID || 0,
    requestID: b ? $ : Y?.requestID || ce?.requestID || "",
    title: b ? ce?.title || u.liveRun?.title || "" : Y?.title || ce?.title || "",
    targetAssetID: b ? u.liveRun?.targetAssetID || 0 : Y?.targetAssetID || 0,
    output: Pt,
    running: b ? I : Lt(He),
    successful: b ? Ke : !!(Y && He === "success"),
    status: He,
    error: b ? M : Y?.error || ce?.error || ""
  }, St = /* @__PURE__ */ g(Rt, { children: [
    b && F ? /* @__PURE__ */ s("div", { className: "stream-power-timing mb-3", children: /* @__PURE__ */ s(Hr, { timing: F, now: Qt }) }) : null,
    !b && u.detailError ? /* @__PURE__ */ g("div", { className: "stream-power-history-detail-error", children: [
      /* @__PURE__ */ s("span", { children: u.detailError }),
      /* @__PURE__ */ s("button", { type: "button", onClick: u.retryDetail, children: "重试" })
    ] }) : null,
    !b && !u.detailError && rt.error ? /* @__PURE__ */ s("div", { className: "stream-power-history-detail-error", children: /* @__PURE__ */ s("span", { children: rt.error }) }) : null,
    /* @__PURE__ */ s(
      wr,
      {
        output: b ? Zr(U) : Pt,
        streaming: b && I && !U.finalOutput,
        emptyText: !b && u.detailLoading ? "正在读取历史结果。" : w === "body" ? "生成结果会显示在这里。" : "AI 返回内容会显示在这里。",
        className: w === "body" ? "stream-power-content-view" : void 0,
        markdownClassName: w === "body" ? "stream-power-markdown" : void 0
      }
    )
  ] }), Ie = (w === "body" ? !!e : We) ? /* @__PURE__ */ g(Rt, { children: [
    I ? /* @__PURE__ */ s(
      Ot,
      {
        cancelable: W,
        stopping: C,
        onStop: yt
      }
    ) : null,
    w !== "body" ? /* @__PURE__ */ s(
      It,
      {
        controller: u,
        label: "历史"
      }
    ) : null,
    /* @__PURE__ */ g(
      At,
      {
        type: "button",
        size: "sm",
        className: "stream-power-generate-action",
        disabled: !Jt,
        onClick: () => {
          Zt();
        },
        children: [
          I ? /* @__PURE__ */ s(_e, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ s(or, { className: "mr-2 size-4" }),
          I ? "生成中..." : "生成"
        ]
      }
    )
  ] }) : null;
  return /* @__PURE__ */ g(
    "div",
    {
      "data-stream-power-appearance": w,
      "data-mobile-view": w === "body" ? ve : void 0,
      className: "stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden",
      style: { height: x },
      children: [
        w === "body" ? /* @__PURE__ */ g("div", { className: "stream-power-mobile-tabs", role: "tablist", "aria-label": "工具运行视图", children: [
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": ve === "input",
              "data-active": ve === "input",
              onClick: () => Te("input"),
              children: "输入"
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": ve === "result",
              "data-active": ve === "result",
              onClick: () => Te("result"),
              children: "结果"
            }
          )
        ] }) : null,
        /* @__PURE__ */ g("div", { className: "stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0", children: [
          j || w === "body" && Ie ? /* @__PURE__ */ g("div", { className: "stream-power-form-header shrink-0", children: [
            j ? /* @__PURE__ */ s("div", { className: "stream-power-form-header-content", children: j }) : null,
            w === "body" && Ie ? /* @__PURE__ */ s("div", { className: "stream-power-header-actions stream-power-run-actions", children: Ie }) : null
          ] }) : null,
          /* @__PURE__ */ g("div", { className: "stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3", children: [
            ie ? /* @__PURE__ */ g("span", { className: "stream-power-loading mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ s(_e, { className: "size-3 animate-spin" }),
              "读取参数"
            ] }) : null,
            je(le) && ae.length > 0 ? /* @__PURE__ */ g("div", { className: "stream-power-source mb-3", children: [
              w === "body" ? /* @__PURE__ */ s("span", { className: "stream-power-source-label", children: "选择模型" }) : null,
              /* @__PURE__ */ s("div", { className: "stream-power-source-picker", children: /* @__PURE__ */ s(
                yr,
                {
                  value: ee || void 0,
                  options: Xt,
                  disabled: I || ie,
                  placeholder: w === "body" ? "请选择模型" : "请选择来源",
                  searchPlaceholder: w === "body" ? "搜索模型..." : void 0,
                  clearable: !1,
                  onChange: (r) => {
                    const a = Array.isArray(r) ? r[0] || "" : r;
                    _({ power: e, id: String(a || "") });
                  }
                }
              ) })
            ] }) : null,
            gt.length > 0 ? /* @__PURE__ */ s(
              "div",
              {
                className: "stream-power-param-list flex flex-wrap items-center gap-3",
                children: gt.map((r) => {
                  const a = Ne(r), m = {
                    param: r,
                    value: v[a],
                    files: T[a] || [],
                    uploadRuleMeta: Gt.get(
                      Number(r.upload_rule_id || 0)
                    ),
                    disabled: I,
                    uploadBizKey: ze,
                    uploadBizName: se,
                    allowResourceLibrary: Ue,
                    fileLibraryOnly: !!Ze,
                    fileLibraryLabel: Ze ? "添加" : void 0,
                    renderFileLibrary: Ze,
                    onUploadedFiles: ye,
                    onChange: (y) => bt(r, y),
                    onFilesChange: (y) => er(r, y)
                  };
                  return xt(r) ? /* @__PURE__ */ s(
                    Ir,
                    {
                      ...m
                    },
                    `${r.id}-${a}`
                  ) : Yr?.(r) && Ht && (A > 0 || E.length > 0) ? /* @__PURE__ */ s(
                    "div",
                    {
                      className: "stream-power-main-param w-full min-w-0 basis-full",
                      children: /* @__PURE__ */ s(
                        Gr,
                        {
                          param: r,
                          value: String(v[a] || ""),
                          content: q[a],
                          providers: E,
                          assetReferenceTeamID: A,
                          usageOptions: ht,
                          disabled: I,
                          onChange: (y, f) => {
                            bt(r, y), ge((S) => ({
                              ...S,
                              [a]: f
                            }));
                          }
                        }
                      )
                    },
                    `${r.id}-${a}`
                  ) : /* @__PURE__ */ s(
                    "div",
                    {
                      className: "stream-power-main-param stream-power-param-field w-full min-w-0 basis-full",
                      children: /* @__PURE__ */ s(_r, { ...m })
                    },
                    `${r.id}-${a}`
                  );
                })
              },
              `params-${Ye}`
            ) : ie ? null : /* @__PURE__ */ s("div", { className: "stream-power-empty rounded-lg px-3 py-8 text-center text-sm text-muted-foreground", children: "暂无参数配置。" }),
            M ? /* @__PURE__ */ s("div", { className: "stream-power-error mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: M }) : null
          ] }),
          w !== "body" && Ie ? /* @__PURE__ */ s("div", { className: "stream-power-actions stream-power-run-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3", children: Ie }) : null
        ] }),
        /* @__PURE__ */ s("div", { className: "stream-power-divider hidden w-px shrink-0 bg-border md:block", "aria-hidden": "true" }),
        /* @__PURE__ */ g("div", { className: "stream-power-result relative flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0", children: [
          /* @__PURE__ */ g("div", { className: "stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2", children: [
            w === "body" ? /* @__PURE__ */ g("div", { className: "stream-power-result-heading", children: [
              /* @__PURE__ */ s("span", { children: L }),
              /* @__PURE__ */ s("small", { "data-status": vt, children: vt })
            ] }) : /* @__PURE__ */ s("span", { className: "text-sm font-medium text-foreground", children: L }),
            /* @__PURE__ */ g("div", { className: "stream-power-result-actions flex min-w-0 items-center justify-end gap-2", children: [
              w === "body" && I ? /* @__PURE__ */ s(
                Ot,
                {
                  className: "stream-power-mobile-stop",
                  cancelable: W,
                  stopping: C,
                  onStop: yt
                }
              ) : null,
              R?.(rt),
              w === "body" ? /* @__PURE__ */ s(It, { controller: u }) : null,
              w !== "body" ? $ ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "flex min-w-0 max-w-[70%] items-center justify-end rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  title: `双击复制完整 RequestID：${$}${J !== "0-0" ? ` / StreamID: ${J}` : ""}`,
                  onDoubleClick: () => {
                    tr();
                  },
                  children: [
                    /* @__PURE__ */ s("span", { className: "mr-1 shrink-0", children: "RequestID:" }),
                    /* @__PURE__ */ s("span", { className: "min-w-0 truncate font-mono", children: $ }),
                    Ut ? /* @__PURE__ */ s("span", { className: "ml-2 shrink-0 text-primary", children: "已复制" }) : null
                  ]
                }
              ) : /* @__PURE__ */ s("span", { className: "text-xs text-muted-foreground", children: "暂无 RequestID" }) : null
            ] })
          ] }),
          /* @__PURE__ */ s(
            "div",
            {
              ref: Le,
              onScroll: Wt,
              style: { scrollbarGutter: "stable" },
              className: "stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3",
              children: w === "body" ? /* @__PURE__ */ s("div", { className: "stream-power-result-content", children: St }) : St
            }
          ),
          /* @__PURE__ */ s(pr, { controller: u })
        ] })
      ]
    }
  );
}
function Gr({
  param: e,
  value: t,
  content: n,
  providers: o,
  assetReferenceTeamID: i,
  usageOptions: d,
  disabled: p,
  onChange: h
}) {
  const x = ur({
    teamID: i,
    allowedKinds: qr(e)
  }), L = te(
    () => i > 0 ? [
      x,
      ...o.filter((R) => R.trigger !== "@")
    ] : o,
    [x, i, o]
  ), j = d.map(
    (R) => [
      R.key,
      R.label,
      R.maxFiles || 0,
      ...R.acceptedKinds || []
    ].join(":")
  ).join("|");
  return /* @__PURE__ */ g("div", { className: "stream-power-param-field stream-power-prompt-field space-y-2 rounded-xl bg-muted/30 p-3", children: [
    /* @__PURE__ */ g("div", { className: "stream-power-prompt-heading", children: [
      /* @__PURE__ */ g("span", { className: "text-sm font-medium text-foreground", children: [
        e.name,
        e.required ? /* @__PURE__ */ s("span", { className: "ml-0.5 text-destructive", children: "*" }) : null
      ] }),
      /* @__PURE__ */ s("small", { children: "输入 @ 引用资产" })
    ] }),
    /* @__PURE__ */ s(
      Ht,
      {
        value: t,
        content: n,
        references: [],
        placeholder: e.placeholder || `请输入${e.name}`,
        disabled: p,
        providers: L,
        usageOptions: d,
        showMediaAliases: !0,
        allowMultiMediaSelection: !0,
        onChange: h
      },
      j
    )
  ] });
}
function Xr(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of Object.values(e))
    for (const i of o.parts || []) {
      if (i.type !== "reference" || i.ref_type !== "asset")
        continue;
      const d = String(i.usage || "").trim(), p = d ? t.find((A) => A.key === d) : t.length === 1 ? t[0] : void 0;
      if (!p) {
        if (d)
          return `“${i.label || "引用素材"}”的素材用途与当前能力参数不兼容。`;
        if (t.length > 1)
          return `请为“${i.label || "引用素材"}”选择素材用途。`;
        continue;
      }
      const h = Array.isArray(i.ref_media_items) ? i.ref_media_items.filter(
        (A) => !!String(A?.url || "").trim() || Number(A?.index || 0) > 0
      ) : [], x = !!(String(i.ref_media_url || "").trim() || Number(i.ref_media_index || 0) > 0), L = Math.max(1, Number(i.ref_media_count || 0)), j = h.length ? h.length : x ? 1 : L, R = Math.max(0, Number(p.maxFiles || 0)), E = n.get(p.key) || 0;
      if (R > 0 && E + j > R)
        return !x && h.length === 0 && L > 1 ? `“${i.label || "引用素材"}”包含 ${L} 项素材，请从引用中选择具体素材。` : `${p.label}参数最多接收 ${R} 个素材。`;
      n.set(p.key, E + j);
    }
  return "";
}
function Ot({
  cancelable: e,
  stopping: t,
  className: n,
  onStop: o
}) {
  return /* @__PURE__ */ g(
    At,
    {
      type: "button",
      variant: "outline",
      size: "sm",
      className: `stream-power-stop-action ${n || ""}`.trim(),
      disabled: !e || t,
      onClick: () => {
        o();
      },
      children: [
        t ? /* @__PURE__ */ s(_e, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ s(ir, { className: "mr-2 size-3.5" }),
        e ? "停止" : "不可停止"
      ]
    }
  );
}
function Qr({
  running: e,
  stopping: t,
  failed: n,
  canceled: o,
  successful: i
}) {
  return t ? "正在停止" : e ? "生成中" : n ? "生成失败" : o ? "已停止" : i ? "已完成" : "等待生成";
}
function Jr({
  running: e,
  stopping: t,
  failed: n,
  canceled: o,
  successful: i
}) {
  return t || e ? "running" : n ? "fail" : o ? "canceled" : i ? "success" : "pending";
}
function Wr(e) {
  return e.scrollHeight - e.scrollTop - e.clientHeight <= 24;
}
function ot(e) {
  e.scrollTop = e.scrollHeight;
}
function Zr(e) {
  if (e.finalOutput)
    return e.finalOutput;
  const t = [];
  return e.liveOutput && t.push(e.liveOutput), e.reasoning && t.push({ event: "reasoning", reasoning: e.reasoning }), e.text && t.push({ text: e.text }), t;
}
function Et(e) {
  e.current != null && (window.clearTimeout(e.current), e.current = null);
}
function Ve(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function Kr(e, t, n) {
  let o = t;
  for (const i of e) {
    const d = Ne(i);
    if (!d || !Object.prototype.hasOwnProperty.call(n, d))
      continue;
    const p = rn(n[d]);
    en(i, p) && (Object.is(o[d], p) || (o === t && (o = { ...t }), o[d] = p));
  }
  return o;
}
function en(e, t) {
  const n = e.options || [];
  if (e.type !== "option" || n.length === 0)
    return !0;
  const o = B(t);
  return o.length > 0 && n.some(
    (i) => Er(i, [o], n)
  );
}
function tn(e, t) {
  return {
    values: Kr(e, kr(e), t),
    files: sn(e, t),
    referenceContents: nn(t)
  };
}
function rn(e) {
  return Array.isArray(e) ? [...e] : we(e) ? { ...e } : e;
}
function nn(e) {
  const t = we(e._reference_contents) ? e._reference_contents : {}, n = {};
  for (const [o, i] of Object.entries(t))
    we(i) && (n[o] = i);
  return n;
}
function sn(e, t) {
  const n = {};
  for (const o of e) {
    if (o.type !== "file" && o.type !== "files")
      continue;
    const i = Ne(o);
    if (!i || !Object.prototype.hasOwnProperty.call(t, i))
      continue;
    const d = on(t[i]), p = o.type === "files" ? d : d.slice(0, 1);
    p.length !== 0 && (n[i] = p.map((h, x) => {
      const L = (o.accepted_kinds || o.asset_kinds)?.[0];
      return {
        id: `replay:${i}:${x}`,
        name: an(h, x),
        kind: L,
        url: h,
        thumbnail: L === "image" ? h : void 0
      };
    }));
  }
  return n;
}
function on(e) {
  return (Array.isArray(e) ? e : [e]).map((n) => B(n)).filter((n) => n.length > 0);
}
function an(e, t) {
  const o = (e.split(/[?#]/, 1)[0] || "").split("/").pop() || "";
  if (o)
    try {
      return decodeURIComponent(o);
    } catch {
      return o;
    }
  return `历史文件 ${t + 1}`;
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const ft = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ft || Object.keys(ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const jt = ft.request;
function Pn({
  scopeKey: e,
  listApi: t,
  detailApi: n,
  scope: o,
  selectLatest: i = !1
}) {
  if (!(!e || !t || !n))
    return {
      scopeKey: e,
      selectLatest: i,
      loadPage: (d) => ln(t, o, d),
      loadDetail: (d) => un(n, o, d)
    };
}
async function ln(e, t, n, o = 20) {
  const i = await jt(e, "get", {
    ...t,
    before_id: n || void 0,
    limit: o
  }), d = Vt(i, "读取工具历史失败");
  return {
    items: mn(d.items).map($t).filter((p) => p.id > 0),
    total: fn(d.total),
    hasMore: !!d.has_more,
    beforeID: xe(d.before_id)
  };
}
async function un(e, t, n) {
  const o = await jt(e, "get", {
    ...t,
    history_id: n
  }), i = Vt(o, "读取工具历史详情失败"), d = $t(i.history);
  if (!d.id)
    throw new Error("工具历史详情为空");
  const p = ke(i.history);
  return {
    ...d,
    input: ke(p.input),
    output: cn(p.output),
    targetAssetID: xe(p.target_asset_id),
    sourceTargetID: xe(p.source_target_id)
  };
}
function $t(e) {
  const t = ke(e);
  return {
    id: xe(t.id),
    runID: xe(t.run_id),
    requestID: X(t.request_id),
    title: X(t.title) || "未命名运行",
    titleSource: dn(t.title_source),
    inputSummary: X(t.input_summary),
    status: X(t.status) || "unavailable",
    error: X(t.error),
    createdAt: X(t.created_at),
    startedAt: X(t.started_at),
    finishedAt: X(t.finished_at)
  };
}
function cn(e) {
  return Bt(e) ? e : null;
}
function dn(e) {
  const t = X(e);
  return t === "llm" || t === "manual" ? t : "auto";
}
function Vt(e, t) {
  const n = ke(e);
  if (Number(n.code) !== 0 && Number(n.status) !== 1)
    throw new Error(X(n.message || n.msg) || t);
  return ke(n.data);
}
function mn(e) {
  return Array.isArray(e) ? e : [];
}
function ke(e) {
  return Bt(e) ? e : {};
}
function Bt(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function xe(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function fn(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function X(e) {
  return e == null ? "" : String(e).trim();
}
export {
  vn as S,
  ln as a,
  Pn as c,
  un as l
};
