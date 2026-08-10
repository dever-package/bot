import { a as i, j as y, F as ht } from "./_commonjsHelpers-CTFd9u1x.js";
import { m as rr } from "./reference-composer-CvyqrYax.js";
import { m as L } from "./space-sequence-card-CzyxbAhV.js";
import { d as z, l as m, u as M, o as j, b as X, q as nr } from "./react-C7Xtl8sB.js";
import { a9 as xt, X as sr, L as ke, R as ir, aA as or, m as ar } from "./vendor-icons-Cc7Kl3It.js";
import { m as lr } from "./content-view-DKqPlRti.js";
import { m as ur } from "./button-CpfaQlDK.js";
import { m as cr } from "./searchable-option-picker-ruTkZ6EF.js";
import { m as kt } from "./in-flight-request-DlB1DJg0.js";
import { m as _t } from "./runtime-stream-runner-BrsTPWU1.js";
import { m as dr, a as Ce } from "./stream-Y1y6FALE.js";
import { m as mr } from "./store-BMgfmVDY.js";
import { A as At, c as fr } from "./clipboard-B77WuM2Y.js";
import { m as ie } from "./stream-timing-B0L-jg0F.js";
import { u as pr } from "./asset-reference-provider-C3LvPld5.js";
import { e as gr, I as Ct, J as hr, H as yr } from "./storyboard-grid-view-CJXm84yJ.js";
import { a as wr } from "./asset-page-PUYGD6nC.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./stream-request-CXdEYuqM.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/hooks/use-upload-rule-metas"]);
const it = window.DeverFront?.sdk?.getCompatModule("@/hooks/use-upload-rule-metas");
if (!it || Object.keys(it).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/hooks/use-upload-rule-metas");
const br = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function vr({
  teamID: e,
  open: t,
  param: r,
  files: s,
  resourceKind: o,
  multiple: l,
  maxSelection: f,
  onOpenChange: g,
  onConfirm: k
}) {
  const _ = z(
    () => Sr(o, r.asset_kinds),
    [r.asset_kinds, o]
  ), T = z(() => Pr(s), [s]), S = z(
    () => s.filter((u) => !Ot(u.id)),
    [s]
  ), A = l ? Math.max(f - S.length, 0) : 1, F = Array.from(T.keys()).slice(
    0,
    A
  );
  return /* @__PURE__ */ i(
    wr,
    {
      open: t,
      teamID: e,
      title: `${r.name}资产库`,
      description: `选择当前团队的${Rr(_)}资产`,
      allowedKinds: _,
      initialSelectedAssetIDs: F,
      multiple: l,
      maxSelection: Math.max(A, 1),
      confirmSelection: !0,
      uploadAccept: gr(_),
      onUpload: (u) => Ir({
        teamID: e,
        ruleID: Number(r.upload_rule_id || 0),
        kind: o,
        files: u
      }),
      validateAsset: (u) => A <= 0 ? `当前参数最多只能选择 ${f} 个文件。` : _.includes(u.kind) ? Ct(u.version?.content, u.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。" : "该资产类型不适用于当前参数。",
      onClose: () => g(!1),
      onConfirm: (u, ve) => {
        const Q = new Map(
          u.map(($) => [$.id, $])
        ), pe = ve.map(($) => {
          const E = Q.get($);
          return E ? Dr(E) : T.get($);
        }).filter(($) => !!$), oe = l ? [...S, ...pe].slice(0, f) : pe.slice(0, 1);
        k(oe);
      }
    }
  );
}
function Sr(e, t) {
  const r = yt(e);
  if (r) return [r];
  const s = Array.from(
    new Set(
      (t || []).map(yt).filter((o) => !!o)
    )
  );
  return s.length > 0 ? s : ["image", "audio", "video", "file"];
}
function yt(e) {
  const t = String(e || "");
  return br.has(t) ? t : void 0;
}
function Pr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const s = Ot(r.id);
    s && t.set(s.assetID, r);
  }), t;
}
function Ot(e) {
  const t = /^asset:(\d+):(\d+)$/.exec(String(e || ""));
  return t ? {
    assetID: Number(t[1]),
    versionID: Number(t[2])
  } : null;
}
function Dr(e) {
  const t = Ct(e.version?.content, e.kind);
  if (t)
    return {
      id: `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function Rr(e) {
  const t = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件"
  };
  return e.map((r) => t[r]).join("、");
}
async function Ir(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await hr({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind
  })).map(({ asset: r }) => yr(r)).filter((r) => r.id > 0);
}
const Nr = 12, xr = 2e3, kr = [1500, 5e3, 21e3];
function _r(e) {
  const [t, r] = m([]), [s, o] = m(0), [l, f] = m(!1), [g, k] = m(0), [_, T] = m(0), [S, A] = m(null), [F, u] = m(null), [ve, Q] = m(!1), [pe, oe] = m(!1), [$, E] = m(!1), [Oe, W] = m(!1), [Me, I] = m(""), [Se, Z] = m(""), ee = M(/* @__PURE__ */ new Map()), C = M(0), K = M(0), O = M(0), N = M(0), ne = M(0), ae = M(0), Y = M([]);
  j(() => {
    N.current = g;
  }, [g]);
  const te = X(
    async (c, x = !1) => {
      if (!e || c <= 0)
        return null;
      const v = ee.current.get(c);
      if (v && !x)
        return A(v), v;
      const P = C.current, H = O.current + 1;
      O.current = H, v || W(!0);
      try {
        const R = await e.loadDetail(c);
        return P !== C.current || H !== O.current ? null : (Cr(ee.current, R), r((B) => nt(B, [R])), N.current === c && A(R), Z(""), R);
      } catch (R) {
        return P === C.current && H === O.current && Z(
          bt(R, "读取工具历史详情失败")
        ), null;
      } finally {
        P === C.current && H === O.current && W(!1);
      }
    },
    [e]
  ), q = X(
    async (c = "initial") => {
      if (!e)
        return;
      const x = c === "append", v = C.current, P = K.current + 1;
      K.current = P;
      const H = x ? ae.current : 0;
      x ? E(!0) : oe(!0);
      try {
        const R = await e.loadPage(H || void 0);
        if (v !== C.current || P !== K.current)
          return;
        if (r((B) => nt(B, R.items)), o(R.total), c === "refresh" ? f((B) => B || R.hasMore) : (f(R.hasMore), ae.current = R.beforeID), I(""), c === "initial" && e.selectLatest !== !1 && N.current === 0 && R.items[0]) {
          const B = R.items[0].id, he = ee.current.get(B) || null;
          N.current = B, k(B), A(he), W(!he), T((Ue) => Ue + 1);
        }
      } catch (R) {
        v === C.current && P === K.current && I(bt(R, "读取工具历史失败"));
      } finally {
        v === C.current && P === K.current && (oe(!1), E(!1));
      }
    },
    [e]
  );
  j(() => (C.current += 1, K.current += 1, O.current += 1, Ve(Y), ee.current.clear(), N.current = 0, ne.current = 0, ae.current = 0, r([]), o(0), f(!1), k(0), T(0), A(null), u(null), Q(!1), oe(!1), E(!1), W(!1), I(""), Z(""), e && q("initial"), () => {
    C.current += 1, K.current += 1, O.current += 1, Ve(Y);
  }), [e?.scopeKey]), j(() => {
    if (!e || g <= 0 || g === F?.historyID) {
      A(null), W(!1);
      return;
    }
    te(g);
  }, [e, F?.historyID, te, g]), j(() => {
    if (!e || !S || S.id !== g || !Tt(S.status))
      return;
    const c = window.setInterval(() => {
      te(S.id, !0);
    }, xr);
    return () => window.clearInterval(c);
  }, [e, te, S, g]);
  const se = X(() => {
    Ve(Y), k(0), N.current = 0, ne.current = 0, A(null), u(null), Q(!1), Z("");
  }, []), le = X(
    (c) => {
      if (c.historyID <= 0)
        return;
      const x = t.some((P) => P.id === c.historyID), v = (/* @__PURE__ */ new Date()).toISOString();
      ne.current = c.historyID, u(c), k(c.historyID), N.current = c.historyID, A(null), r(
        (P) => nt(P, [
          {
            id: c.historyID,
            runID: c.runID,
            requestID: c.requestID,
            title: c.title,
            titleSource: "auto",
            inputSummary: c.inputSummary,
            status: "running",
            error: "",
            createdAt: v,
            startedAt: v,
            finishedAt: ""
          }
        ])
      ), x || o((P) => P + 1);
    },
    [t]
  ), ge = X(
    (c, x, v) => {
      c <= 0 || r(
        (P) => P.map(
          (H) => H.id === c && (H.status !== x || H.error !== v) ? { ...H, status: x, error: v } : H
        )
      );
    },
    []
  ), U = X(() => {
    if (!e || ne.current <= 0)
      return;
    Ve(Y), q("refresh");
    const c = e.refreshDelaysMs ?? kr;
    Y.current = c.map(
      (x) => window.setTimeout(() => {
        q("refresh");
      }, x)
    );
  }, [e, q]), Te = X(() => {
    Q(!0), e && q("refresh");
  }, [e, q]), ue = X(() => {
    Q(!1);
  }, []), Fe = X((c) => {
    const x = ee.current.get(c) || null;
    k(c), N.current = c, A(x), T((v) => v + 1), W(!x), Q(!1), Z("");
  }, []), ce = X(() => {
    g > 0 && te(g, !0);
  }, [te, g]), Ee = z(
    () => t.find((c) => c.id === g) || null,
    [t, g]
  );
  return {
    enabled: !!e,
    items: t,
    total: s,
    hasMore: l,
    selectedID: g,
    selectionRevision: _,
    selectedItem: Ee,
    selectedDetail: S,
    liveRun: F,
    panelOpen: ve,
    loading: pe,
    loadingMore: $,
    detailLoading: Oe,
    listError: Me,
    detailError: Se,
    beginRun: se,
    registerLiveRun: le,
    syncLiveRun: ge,
    finishLiveRun: U,
    openPanel: Te,
    closePanel: ue,
    selectHistory: Fe,
    loadMore: () => {
      q("append");
    },
    retryList: () => {
      q("initial");
    },
    retryDetail: ce
  };
}
function wt({
  controller: e,
  label: t
}) {
  return e.enabled ? /* @__PURE__ */ i(At, { label: "运行历史", children: /* @__PURE__ */ y(
    "button",
    {
      type: "button",
      className: "stream-power-history-trigger",
      "aria-label": "打开运行历史",
      onClick: e.openPanel,
      children: [
        /* @__PURE__ */ i(xt, {}),
        t ? /* @__PURE__ */ i("span", { className: "stream-power-history-trigger-label", children: t }) : null,
        e.total > 0 ? /* @__PURE__ */ i("span", { className: "stream-power-history-trigger-count", children: e.total }) : null
      ]
    }
  ) }) : null;
}
function Ar({
  controller: e
}) {
  return j(() => {
    if (!e.panelOpen)
      return;
    const r = (s) => {
      s.key === "Escape" && e.closePanel();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e.closePanel, e.panelOpen]), !e.enabled || !e.panelOpen ? null : /* @__PURE__ */ i(
    "div",
    {
      className: "stream-power-history-layer",
      role: "presentation",
      onMouseDown: (r) => {
        r.target === r.currentTarget && e.closePanel();
      },
      children: /* @__PURE__ */ y("aside", { className: "stream-power-history-panel", "aria-label": "工具运行历史", children: [
        /* @__PURE__ */ y("header", { className: "stream-power-history-header", children: [
          /* @__PURE__ */ y("div", { children: [
            /* @__PURE__ */ i("strong", { children: "运行历史" }),
            /* @__PURE__ */ i("small", { children: e.total ? `共 ${e.total} 条` : "暂无记录" })
          ] }),
          /* @__PURE__ */ i(At, { label: "关闭", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "关闭运行历史",
              onClick: e.closePanel,
              children: /* @__PURE__ */ i(sr, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ i("div", { className: "stream-power-history-list", children: e.loading && e.items.length === 0 ? /* @__PURE__ */ i(
          rt,
          {
            icon: /* @__PURE__ */ i(ke, { className: "animate-spin" }),
            text: "读取历史"
          }
        ) : e.listError && e.items.length === 0 ? /* @__PURE__ */ i(
          rt,
          {
            icon: /* @__PURE__ */ i(ir, {}),
            text: e.listError,
            action: "重试",
            onAction: e.retryList
          }
        ) : e.items.length === 0 ? /* @__PURE__ */ i(rt, { icon: /* @__PURE__ */ i(xt, {}), text: "还没有运行记录" }) : e.items.map((r) => /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            className: "stream-power-history-item",
            "data-active": e.selectedID === r.id,
            onClick: () => e.selectHistory(r.id),
            children: [
              /* @__PURE__ */ i("span", { className: "stream-power-history-item-title", children: r.title || "未命名运行" }),
              r.inputSummary ? /* @__PURE__ */ i("span", { className: "stream-power-history-item-summary", children: r.inputSummary }) : null,
              /* @__PURE__ */ y("span", { className: "stream-power-history-item-meta", children: [
                /* @__PURE__ */ i("i", { "data-status": r.status }),
                /* @__PURE__ */ i("span", { children: Mt(r.status) }),
                /* @__PURE__ */ i("time", { children: Or(r.createdAt) })
              ] })
            ]
          },
          r.id
        )) }),
        e.items.length > 0 && e.hasMore ? /* @__PURE__ */ y(
          "button",
          {
            type: "button",
            className: "stream-power-history-more",
            disabled: e.loadingMore,
            onClick: e.loadMore,
            children: [
              e.loadingMore ? /* @__PURE__ */ i(ke, { className: "animate-spin" }) : null,
              e.loadingMore ? "加载中" : "加载更多"
            ]
          }
        ) : null
      ] })
    }
  );
}
function rt({
  icon: e,
  text: t,
  action: r,
  onAction: s
}) {
  return /* @__PURE__ */ y("div", { className: "stream-power-history-state", children: [
    e,
    /* @__PURE__ */ i("span", { children: t }),
    r && s ? /* @__PURE__ */ i("button", { type: "button", onClick: s, children: r }) : null
  ] });
}
function Mt(e) {
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
function Tt(e) {
  return e === "pending" || e === "running" || e === "waiting";
}
function nt(e, t) {
  const r = /* @__PURE__ */ new Map();
  return e.forEach((s) => r.set(s.id, s)), t.forEach((s) => {
    const o = r.get(s.id);
    r.set(s.id, o ? { ...o, ...s } : s);
  }), [...r.values()].sort((s, o) => o.id - s.id);
}
function Cr(e, t) {
  for (e.delete(t.id), e.set(t.id, t); e.size > Nr; ) {
    const r = e.keys().next().value;
    if (typeof r != "number")
      return;
    e.delete(r);
  }
}
function Or(e) {
  const t = new Date(e);
  if (!e || Number.isNaN(t.getTime()))
    return "";
  const r = /* @__PURE__ */ new Date();
  return t.toDateString() === r.toDateString() ? t.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }) : t.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}
function bt(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
function Ve(e) {
  e.current.forEach((t) => window.clearTimeout(t)), e.current = [];
}
const Ft = kt.request;
function Mr({
  scopeKey: e,
  listApi: t,
  detailApi: r,
  scope: s,
  selectLatest: o = !1
}) {
  if (!(!e || !t || !r))
    return {
      scopeKey: e,
      selectLatest: o,
      loadPage: (l) => Tr(t, s, l),
      loadDetail: (l) => Fr(r, s, l)
    };
}
async function Tr(e, t, r, s = 20) {
  const o = await Ft(e, "get", {
    ...t,
    before_id: r || void 0,
    limit: s
  }), l = Lt(o, "读取工具历史失败");
  return {
    items: $r(l.items).map(Et).filter((f) => f.id > 0),
    total: qr(l.total),
    hasMore: !!l.has_more,
    beforeID: Ae(l.before_id)
  };
}
async function Fr(e, t, r) {
  const s = await Ft(e, "get", {
    ...t,
    history_id: r
  }), o = Lt(s, "读取工具历史详情失败"), l = Et(o.history);
  if (!l.id)
    throw new Error("工具历史详情为空");
  const f = _e(o.history);
  return {
    ...l,
    input: _e(f.input),
    output: Er(f.output),
    targetAssetID: Ae(f.target_asset_id),
    sourceTargetID: Ae(f.source_target_id)
  };
}
function Et(e) {
  const t = _e(e);
  return {
    id: Ae(t.id),
    runID: Ae(t.run_id),
    requestID: J(t.request_id),
    title: J(t.title) || "未命名运行",
    titleSource: Lr(t.title_source),
    inputSummary: J(t.input_summary),
    status: J(t.status) || "unavailable",
    error: J(t.error),
    createdAt: J(t.created_at),
    startedAt: J(t.started_at),
    finishedAt: J(t.finished_at)
  };
}
function Er(e) {
  return $t(e) ? e : null;
}
function Lr(e) {
  const t = J(e);
  return t === "llm" || t === "manual" ? t : "auto";
}
function Lt(e, t) {
  const r = _e(e);
  if (Number(r.code) !== 0 && Number(r.status) !== 1)
    throw new Error(J(r.message || r.msg) || t);
  return _e(r.data);
}
function $r(e) {
  return Array.isArray(e) ? e : [];
}
function _e(e) {
  return $t(e) ? e : {};
}
function $t(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Ae(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function qr(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function J(e) {
  return e == null ? "" : String(e).trim();
}
const Hr = lr.EnergonContentView, qt = ur.Button, Br = cr.SearchableOptionPicker, Vr = kt.request, jr = _t.runRuntimeStream, zr = _t.stopRuntimeStream, V = dr.streamValueText, Ur = mr.getStoreValueByPath, vt = Ce.isEmptyRuntimeOutput, we = Ce.isPlainRecord, Kr = Ce.normalizeRuntimeFrameOutput, Yr = Ce.resolveRuntimeFrameCancelable, St = Ce.runtimeErrorMessage, Gr = it.useUploadRuleMetas, Xr = L.PowerParamPopover, Jr = L.PowerParamField, Qr = L.buildDefaultParamValues, Wr = L.buildRequestInput, Zr = L.filterActivePowerParams, be = L.inputKeyForParam, en = L.isHiddenParam, tn = L.isMainParam, rn = L.isSelectedOptionValue, Pt = L.isToolbarParam, nn = L.normalizePowerParamConfig, sn = L.paramFilesRequestValue, on = L.shouldDisplayPowerParam, an = L.validateMainParams, ln = ie.StreamTimingBadge, un = ie.cancelStreamTiming, cn = ie.createStreamTiming, Dt = ie.finishStreamTiming, dn = ie.isStreamTimingStatusOutput, mn = ie.markStreamTimingStopping, fn = ie.updateStreamTimingFromOutput, pn = ie.useStreamClock, Ht = rr.ReferenceEditor, gn = L.isPromptParam, je = 2, Rt = {
  text: "",
  reasoning: "",
  liveOutput: null,
  finalOutput: null
};
function hn({ item: e, store: t }) {
  const r = nr(
    t,
    () => V(Ur(t, String(e.meta?.powerPath || "")))
  ), s = String(e.meta?.historyApi || ""), o = String(e.meta?.historyDetailApi || ""), l = z(
    () => r ? Mr({
      scopeKey: `admin-power:${s}:${o}:${r}`,
      listApi: s,
      detailApi: o,
      scope: { power: r }
    }) : void 0,
    [s, o, r]
  );
  return /* @__PURE__ */ i(
    Bt,
    {
      powerKey: r,
      requestApi: String(e.meta?.requestApi || "/bot/admin/energon/request"),
      paramApi: String(e.meta?.paramApi || "/bot/admin/energon/power_params"),
      streamApi: String(e.meta?.streamApi || "/bot/admin/energon/stream"),
      stopApi: String(e.meta?.stopApi || "/bot/admin/energon/stream_stop"),
      blockMs: Number(e.meta?.blockMs || 1e3),
      history: l
    }
  );
}
function Bt({
  powerKey: e,
  requestApi: t,
  paramApi: r,
  streamApi: s,
  stopApi: o,
  blockMs: l = 1e3,
  requestScope: f,
  paramScope: g = f,
  height: k = "min(60vh, 600px)",
  resultTitle: _ = "测试结果",
  formHeader: T,
  renderResultActions: S,
  referenceProviders: A = [],
  assetReferenceTeamID: F = 0,
  appearance: u = "default",
  uploadBizKey: ve,
  uploadBizName: Q,
  allowResourceLibrary: pe = !0,
  onUploadedFiles: oe,
  history: $
}) {
  const [E, Oe] = m(""), [W, Me] = m("0-0"), [I, Se] = m(!1), [Z, ee] = m(!1), [C, K] = m(!1), [O, N] = m(""), [ne, ae] = m(!1), [Y, te] = m(Rt), [q, se] = m(), [le, ge] = m(!1), [U, Te] = m([]), [ue, Fe] = m([]), [ce, Ee] = m(1), [c, x] = m({ power: "", id: "" }), [v, P] = m({}), [H, R] = m({}), [B, he] = m({}), [Ue, jt] = m(0), [zt, Ke] = m(!1), [Pe, Le] = m("input"), de = M(0), De = M(null), Ye = M({}), Re = M(""), Ge = M(""), $e = M(null), qe = M(null), Xe = M(!0), d = _r($), Ie = d.liveRun?.historyID || 0, b = !d.enabled || d.selectedID === 0 || d.selectedID === Ie, re = c.power === e ? c.id : "", He = X(
    (n, a) => {
      const p = Nn(n, a);
      P(p.values), R(p.files), he(p.referenceContents), jt((w) => w + 1);
    },
    []
  );
  j(() => {
    x({ power: "", id: "" }), Re.current = "", Ge.current = "";
  }, [$?.scopeKey, e]);
  const ye = z(
    () => Zr(U, v),
    [v, U]
  ), ot = z(
    () => ye.filter(
      (n) => on(n, U)
    ),
    [ye, U]
  ), Ut = z(
    () => ye.map((n) => Number(n.upload_rule_id || 0)).filter((n) => Number.isFinite(n) && n > 0),
    [ye]
  ), Kt = Gr(Ut), at = z(
    () => ot.filter(
      (n) => !en(n) && (tn(n) || Pt(n))
    ),
    [ot]
  ), lt = z(
    () => wn(ye),
    [ye]
  ), Je = U.length > 0, Yt = z(
    () => ue.map((n) => ({
      id: n.id,
      value: u === "body" ? V(n.service_name) || "未命名服务" : n.name
    })),
    [u, ue]
  ), ut = ce !== je || re.length > 0, Gt = pn(q?.status === "running"), Qe = u === "body" && F > 0 ? (n) => /* @__PURE__ */ i(vr, { ...n, teamID: F }) : void 0, Xt = z(
    () => Je && ut && !I && !le && e.length > 0,
    [Je, le, e, I, ut]
  );
  j(() => () => {
    de.current += 1, De.current?.abort(), Nt($e);
  }, []), j(() => {
    Le("input");
  }, [e]), j(() => {
    let n = !1;
    if (Te([]), Fe([]), P({}), R({}), he({}), Ye.current = {}, Re.current = "", N(""), ae(!1), !e)
      return Ee(1), ge(!1), () => {
        n = !0;
      };
    async function a() {
      ge(!0);
      const p = await Vr(r, "get", {
        ...g,
        power: e,
        include_sources: 1,
        source_target_id: re
      });
      if (n)
        return;
      if (p.code !== 0 && p.status !== 1) {
        ge(!1), N(p.message || p.msg || "读取能力参数失败。");
        return;
      }
      const w = we(p.data) ? p.data : {}, h = nn(p.data), D = h.params, fe = we(w.initial_input) ? w.initial_input : {};
      Ee(h.sourceRule), Fe(h.sources), h.selectedSourceID && h.selectedSourceID !== re && x({ power: e, id: h.selectedSourceID }), Re.current = "", Te(D), He(D, fe), ge(!1);
    }
    return a(), () => {
      n = !0;
    };
  }, [re, He, r, g, e]), j(() => {
    if (!b)
      return;
    const n = qe.current;
    if (!n || !Xe.current)
      return;
    st(n);
    const a = window.setTimeout(() => st(n), 0);
    return () => {
      window.clearTimeout(a);
    };
  }, [Y, I, b]), j(() => {
    const n = qe.current;
    if (n) {
      if (b) {
        st(n);
        return;
      }
      n.scrollTop = 0;
    }
  }, [d.selectedID, b]);
  const Jt = () => {
    const n = qe.current;
    n && (Xe.current = Pn(n));
  }, ct = async () => {
    if (!(!E || !Z || C)) {
      K(!0), N(""), se((n) => mn(n)), De.current?.abort();
      try {
        await zr(E, o), de.current += 1, Se(!1), ee(!1), se((n) => un(n)), d.finishLiveRun();
      } catch (n) {
        N(St(n, "停止任务失败。"));
      } finally {
        K(!1);
      }
    }
  }, Qt = async () => {
    if (!e) {
      N("未选择能力。");
      return;
    }
    const n = an(U, v);
    if (n) {
      N(n);
      return;
    }
    const a = bn(
      B,
      lt
    );
    if (a) {
      N(a);
      return;
    }
    const p = de.current + 1;
    de.current = p, d.beginRun(), u === "body" && Le("result"), Se(!0), N(""), ae(!1), te(Rt), se(cn("正在连接模型")), Oe(""), Ke(!1), Me("0-0"), ee(!1), K(!1), Xe.current = !0;
    const w = new AbortController();
    De.current = w;
    try {
      const h = Wr(U, v);
      Object.keys(B).length > 0 && (h._reference_contents = B), Ye.current = { ...h };
      const D = {
        ...f,
        power: e,
        input: h,
        params_complete: !0,
        history: [],
        options: {
          stream: !0
        }
      };
      ce === je && re && (D.source_target_id = re), await jr({
        requestApi: t,
        streamApi: s,
        stopApi: o,
        stopOnAbort: !1,
        body: D,
        blockMs: l,
        signal: w.signal,
        onRequestID: Oe,
        onFrame: (fe) => {
          if (de.current !== p || w.signal.aborted)
            return;
          const gt = V(fe?.stream_id);
          gt && Me(gt), Wt(fe);
        }
      });
    } catch (h) {
      de.current === p && (N(St(h, "测试失败。")), se((D) => Dt(D, "failed")), d.finishLiveRun());
    } finally {
      de.current === p && Se(!1), De.current === w && (De.current = null);
    }
  }, Wt = (n) => {
    const a = Kr(n?.output, n);
    if (vt(a) && n.type !== "result")
      return;
    const p = Yr(n);
    p != null && ee(p);
    const w = V(a.event).toLowerCase();
    if (w === "start") {
      const h = a, D = we(h.meta) ? h.meta : {}, fe = ze(D.history_id);
      fe > 0 && d.registerLiveRun({
        historyID: fe,
        runID: ze(D.run_id),
        requestID: V(n?.request_id),
        title: V(D.history_title) || "未命名运行",
        inputSummary: V(D.history_input_summary),
        input: { ...Ye.current },
        targetAssetID: ze(D.target_asset_id),
        sourceTargetID: ze(D.source_target_id)
      });
    }
    dn(a) && se((h) => fn(h, a)), n.type === "result" && (ae(Number(n.status) === 2), se(
      (h) => Dt(
        h,
        Number(n.status) === 2 ? "failed" : "done"
      )
    ), d.finishLiveRun()), te((h) => {
      if (V(a.event).toLowerCase() === "control")
        return h;
      if (n.type === "result")
        return {
          ...h,
          finalOutput: vt(a) ? { text: h.text || V(n?.msg) } : a
        };
      const D = {
        text: h.text,
        reasoning: h.reasoning,
        liveOutput: h.liveOutput,
        finalOutput: h.finalOutput
      };
      return w === "audio_ready" && (D.liveOutput = a), (w === "delta" || !w && a.text) && (D.text += V(a.text)), (w === "reasoning" || a.reasoning) && (D.reasoning += V(a.reasoning || a.text)), D;
    });
  }, dt = (n, a) => {
    const p = be(n);
    p && P((w) => ({
      ...w,
      [p]: a
    }));
  }, Zt = (n, a) => {
    const p = be(n);
    p && (R((w) => ({
      ...w,
      [p]: a
    })), P((w) => ({
      ...w,
      [p]: sn(n, a)
    })));
  }, er = async () => {
    const n = E.trim();
    if (n)
      try {
        await fr(n), Ke(!0), Nt($e), $e.current = window.setTimeout(() => {
          Ke(!1), $e.current = null;
        }, 1200);
      } catch {
        N("复制 RequestID 失败。");
      }
  }, We = !!(E && Y.finalOutput && !I && !ne && !O), tr = vn({
    running: I,
    stopping: C,
    failed: !!(O || ne),
    canceled: q?.status === "canceled",
    successful: We
  }), Ze = Sn({
    running: I,
    stopping: C,
    failed: !!(O || ne),
    canceled: q?.status === "canceled",
    successful: We
  });
  j(() => {
    Ie > 0 && d.syncLiveRun(Ie, Ze, O);
  }, [O, d.syncLiveRun, Ie, Ze]);
  const G = b ? null : d.selectedDetail, et = b ? d.liveRun?.input : G?.input, Ne = b ? d.liveRun?.sourceTargetID || 0 : G?.sourceTargetID || 0;
  j(() => {
    const n = d.selectedID;
    if (!d.enabled || n <= 0 || !et || U.length === 0)
      return;
    const a = [
      $?.scopeKey || "",
      n,
      d.selectionRevision
    ].join(":");
    if (Ge.current !== a && (Ge.current = a, ce === je && Ne > 0 && ue.some(
      (p) => p.id === String(Ne)
    ) && String(Ne) !== re)) {
      x({
        power: e,
        id: String(Ne)
      });
      return;
    }
    Re.current !== a && (Re.current = a, He(U, et));
  }, [
    re,
    He,
    $?.scopeKey,
    d.enabled,
    d.selectedID,
    d.selectionRevision,
    e,
    U,
    ue,
    et,
    Ne,
    ce
  ]);
  const me = d.selectedItem, Be = b ? Ze : G?.status || me?.status || "pending", mt = b ? tr : Mt(Be), ft = b ? Y.finalOutput : G?.output || null, tt = {
    historyID: b ? Ie : G?.id || me?.id || 0,
    runID: b ? d.liveRun?.runID || 0 : G?.runID || me?.runID || 0,
    requestID: b ? E : G?.requestID || me?.requestID || "",
    title: b ? me?.title || d.liveRun?.title || "" : G?.title || me?.title || "",
    targetAssetID: b ? d.liveRun?.targetAssetID || 0 : G?.targetAssetID || 0,
    output: ft,
    running: b ? I : Tt(Be),
    successful: b ? We : !!(G && Be === "success"),
    status: Be,
    error: b ? O : G?.error || me?.error || ""
  }, pt = /* @__PURE__ */ y(ht, { children: [
    b && q ? /* @__PURE__ */ i("div", { className: "stream-power-timing mb-3", children: /* @__PURE__ */ i(ln, { timing: q, now: Gt }) }) : null,
    !b && d.detailError ? /* @__PURE__ */ y("div", { className: "stream-power-history-detail-error", children: [
      /* @__PURE__ */ i("span", { children: d.detailError }),
      /* @__PURE__ */ i("button", { type: "button", onClick: d.retryDetail, children: "重试" })
    ] }) : null,
    !b && !d.detailError && tt.error ? /* @__PURE__ */ i("div", { className: "stream-power-history-detail-error", children: /* @__PURE__ */ i("span", { children: tt.error }) }) : null,
    /* @__PURE__ */ i(
      Hr,
      {
        output: b ? Dn(Y) : ft,
        streaming: b && I && !Y.finalOutput,
        emptyText: !b && d.detailLoading ? "正在读取历史结果。" : u === "body" ? "生成结果会显示在这里。" : "AI 返回内容会显示在这里。",
        className: u === "body" ? "stream-power-content-view" : void 0,
        markdownClassName: u === "body" ? "stream-power-markdown" : void 0
      }
    )
  ] }), xe = (u === "body" ? !!e : Je) ? /* @__PURE__ */ y(ht, { children: [
    I ? /* @__PURE__ */ i(
      It,
      {
        cancelable: Z,
        stopping: C,
        onStop: ct
      }
    ) : null,
    u !== "body" ? /* @__PURE__ */ i(
      wt,
      {
        controller: d,
        label: "历史"
      }
    ) : null,
    /* @__PURE__ */ y(
      qt,
      {
        type: "button",
        size: "sm",
        className: "stream-power-generate-action",
        disabled: !Xt,
        onClick: () => {
          Qt();
        },
        children: [
          I ? /* @__PURE__ */ i(ke, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ i(or, { className: "mr-2 size-4" }),
          I ? "生成中..." : "生成"
        ]
      }
    )
  ] }) : null;
  return /* @__PURE__ */ y(
    "div",
    {
      "data-stream-power-appearance": u,
      "data-mobile-view": u === "body" ? Pe : void 0,
      className: "stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden",
      style: { height: k },
      children: [
        u === "body" ? /* @__PURE__ */ y("div", { className: "stream-power-mobile-tabs", role: "tablist", "aria-label": "工具运行视图", children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Pe === "input",
              "data-active": Pe === "input",
              onClick: () => Le("input"),
              children: "输入"
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Pe === "result",
              "data-active": Pe === "result",
              onClick: () => Le("result"),
              children: "结果"
            }
          )
        ] }) : null,
        /* @__PURE__ */ y("div", { className: "stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0", children: [
          T || u === "body" && xe ? /* @__PURE__ */ y("div", { className: "stream-power-form-header shrink-0", children: [
            T ? /* @__PURE__ */ i("div", { className: "stream-power-form-header-content", children: T }) : null,
            u === "body" && xe ? /* @__PURE__ */ i("div", { className: "stream-power-header-actions stream-power-run-actions", children: xe }) : null
          ] }) : null,
          /* @__PURE__ */ y("div", { className: "stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3", children: [
            le ? /* @__PURE__ */ y("span", { className: "stream-power-loading mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ i(ke, { className: "size-3 animate-spin" }),
              "读取参数"
            ] }) : null,
            ce === je && ue.length > 0 ? /* @__PURE__ */ y("div", { className: "stream-power-source mb-3", children: [
              u === "body" ? /* @__PURE__ */ i("span", { className: "stream-power-source-label", children: "选择模型" }) : null,
              /* @__PURE__ */ i("div", { className: "stream-power-source-picker", children: /* @__PURE__ */ i(
                Br,
                {
                  value: re || void 0,
                  options: Yt,
                  disabled: I || le,
                  placeholder: u === "body" ? "请选择模型" : "请选择来源",
                  searchPlaceholder: u === "body" ? "搜索模型..." : void 0,
                  clearable: !1,
                  onChange: (n) => {
                    const a = Array.isArray(n) ? n[0] || "" : n;
                    x({ power: e, id: String(a || "") });
                  }
                }
              ) })
            ] }) : null,
            at.length > 0 ? /* @__PURE__ */ i(
              "div",
              {
                className: "stream-power-param-list flex flex-wrap items-center gap-3",
                children: at.map((n) => {
                  const a = be(n), p = {
                    param: n,
                    value: v[a],
                    files: H[a] || [],
                    uploadRuleMeta: Kt.get(
                      Number(n.upload_rule_id || 0)
                    ),
                    disabled: I,
                    uploadBizKey: ve,
                    uploadBizName: Q,
                    allowResourceLibrary: pe,
                    fileLibraryOnly: !!Qe,
                    fileLibraryLabel: Qe ? "添加" : void 0,
                    renderFileLibrary: Qe,
                    onUploadedFiles: oe,
                    onChange: (w) => dt(n, w),
                    onFilesChange: (w) => Zt(n, w)
                  };
                  return Pt(n) ? /* @__PURE__ */ i(
                    Xr,
                    {
                      ...p
                    },
                    `${n.id}-${a}`
                  ) : gn?.(n) && Ht && (F > 0 || A.length > 0) ? /* @__PURE__ */ i(
                    "div",
                    {
                      className: "stream-power-main-param",
                      children: /* @__PURE__ */ i(
                        yn,
                        {
                          param: n,
                          value: String(v[a] || ""),
                          content: B[a],
                          providers: A,
                          assetReferenceTeamID: F,
                          usageOptions: lt,
                          disabled: I,
                          onChange: (w, h) => {
                            dt(n, w), he((D) => ({
                              ...D,
                              [a]: h
                            }));
                          }
                        }
                      )
                    },
                    `${n.id}-${a}`
                  ) : /* @__PURE__ */ i(
                    "div",
                    {
                      className: "stream-power-main-param stream-power-param-field",
                      children: /* @__PURE__ */ i(Jr, { ...p })
                    },
                    `${n.id}-${a}`
                  );
                })
              },
              `params-${Ue}`
            ) : le ? null : /* @__PURE__ */ i("div", { className: "stream-power-empty rounded-lg px-3 py-8 text-center text-sm text-muted-foreground", children: "暂无参数配置。" }),
            O ? /* @__PURE__ */ i("div", { className: "stream-power-error mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: O }) : null
          ] }),
          u !== "body" && xe ? /* @__PURE__ */ i("div", { className: "stream-power-actions stream-power-run-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3", children: xe }) : null
        ] }),
        /* @__PURE__ */ i("div", { className: "stream-power-divider hidden w-px shrink-0 bg-border md:block", "aria-hidden": "true" }),
        /* @__PURE__ */ y("div", { className: "stream-power-result relative flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0", children: [
          /* @__PURE__ */ y("div", { className: "stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2", children: [
            u === "body" ? /* @__PURE__ */ y("div", { className: "stream-power-result-heading", children: [
              /* @__PURE__ */ i("span", { children: _ }),
              /* @__PURE__ */ i("small", { "data-status": mt, children: mt })
            ] }) : /* @__PURE__ */ i("span", { className: "text-sm font-medium text-foreground", children: _ }),
            /* @__PURE__ */ y("div", { className: "stream-power-result-actions flex min-w-0 items-center justify-end gap-2", children: [
              u === "body" && I ? /* @__PURE__ */ i(
                It,
                {
                  className: "stream-power-mobile-stop",
                  cancelable: Z,
                  stopping: C,
                  onStop: ct
                }
              ) : null,
              S?.(tt),
              u === "body" ? /* @__PURE__ */ i(wt, { controller: d }) : null,
              u !== "body" ? E ? /* @__PURE__ */ y(
                "button",
                {
                  type: "button",
                  className: "flex min-w-0 max-w-[70%] items-center justify-end rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  title: `双击复制完整 RequestID：${E}${W !== "0-0" ? ` / StreamID: ${W}` : ""}`,
                  onDoubleClick: () => {
                    er();
                  },
                  children: [
                    /* @__PURE__ */ i("span", { className: "mr-1 shrink-0", children: "RequestID:" }),
                    /* @__PURE__ */ i("span", { className: "min-w-0 truncate font-mono", children: E }),
                    zt ? /* @__PURE__ */ i("span", { className: "ml-2 shrink-0 text-primary", children: "已复制" }) : null
                  ]
                }
              ) : /* @__PURE__ */ i("span", { className: "text-xs text-muted-foreground", children: "暂无 RequestID" }) : null
            ] })
          ] }),
          /* @__PURE__ */ i(
            "div",
            {
              ref: qe,
              onScroll: Jt,
              style: { scrollbarGutter: "stable" },
              className: "stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3",
              children: u === "body" ? /* @__PURE__ */ i("div", { className: "stream-power-result-content", children: pt }) : pt
            }
          ),
          /* @__PURE__ */ i(Ar, { controller: d })
        ] })
      ]
    }
  );
}
function yn({
  param: e,
  value: t,
  content: r,
  providers: s,
  assetReferenceTeamID: o,
  usageOptions: l,
  disabled: f,
  onChange: g
}) {
  const k = pr({
    teamID: o,
    allowedKinds: Vt(e)
  }), _ = z(
    () => o > 0 ? [
      k,
      ...s.filter((S) => S.trigger !== "@")
    ] : s,
    [k, o, s]
  ), T = l.map(
    (S) => [
      S.key,
      S.label,
      S.maxFiles || 0,
      ...S.acceptedKinds || []
    ].join(":")
  ).join("|");
  return /* @__PURE__ */ y("div", { className: "stream-power-param-field stream-power-prompt-field space-y-2 rounded-xl bg-muted/30 p-3", children: [
    /* @__PURE__ */ y("div", { className: "stream-power-prompt-heading", children: [
      /* @__PURE__ */ y("span", { className: "text-sm font-medium text-foreground", children: [
        e.name,
        e.required ? /* @__PURE__ */ i("span", { className: "ml-0.5 text-destructive", children: "*" }) : null
      ] }),
      /* @__PURE__ */ i("small", { children: "输入 @ 引用资产" })
    ] }),
    /* @__PURE__ */ i(
      Ht,
      {
        value: t,
        content: r,
        references: [],
        placeholder: e.placeholder || `请输入${e.name}`,
        disabled: f,
        providers: _,
        usageOptions: l,
        showMediaAliases: !0,
        allowMultiMediaSelection: !0,
        onChange: g
      },
      T
    )
  ] });
}
function wn(e) {
  return e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = be(t);
    return r ? [
      {
        key: r,
        label: String(t.name || r),
        acceptedKinds: Vt(t),
        maxFiles: t.type === "files" ? Math.max(0, Number(t.max_files || 0)) : 1
      }
    ] : [];
  });
}
function Vt(e) {
  const t = /* @__PURE__ */ new Set(["image", "video", "audio", "file"]), r = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map((o) => String(o || "").trim().toLowerCase()).filter((o) => t.has(o))
    )
  );
  if (r.length > 0)
    return r;
  const s = `${e.name || ""} ${e.key || ""}`.toLowerCase();
  return /video|视频/.test(s) ? ["video"] : /audio|music|音频|音乐/.test(s) ? ["audio"] : /image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(s) ? ["image"] : ["image", "video", "audio", "file"];
}
function bn(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const s of Object.values(e))
    for (const o of s.parts || []) {
      if (o.type !== "reference" || o.ref_type !== "asset")
        continue;
      const l = String(o.usage || "").trim(), f = l ? t.find((F) => F.key === l) : t.length === 1 ? t[0] : void 0;
      if (!f) {
        if (l)
          return `“${o.label || "引用素材"}”的素材用途与当前能力参数不兼容。`;
        if (t.length > 1)
          return `请为“${o.label || "引用素材"}”选择素材用途。`;
        continue;
      }
      const g = Array.isArray(o.ref_media_items) ? o.ref_media_items.filter(
        (F) => !!String(F?.url || "").trim() || Number(F?.index || 0) > 0
      ) : [], k = !!(String(o.ref_media_url || "").trim() || Number(o.ref_media_index || 0) > 0), _ = Math.max(1, Number(o.ref_media_count || 0)), T = g.length ? g.length : k ? 1 : _, S = Math.max(0, Number(f.maxFiles || 0)), A = r.get(f.key) || 0;
      if (S > 0 && A + T > S)
        return !k && g.length === 0 && _ > 1 ? `“${o.label || "引用素材"}”包含 ${_} 项素材，请从引用中选择具体素材。` : `${f.label}参数最多接收 ${S} 个素材。`;
      r.set(f.key, A + T);
    }
  return "";
}
function It({
  cancelable: e,
  stopping: t,
  className: r,
  onStop: s
}) {
  return /* @__PURE__ */ y(
    qt,
    {
      type: "button",
      variant: "outline",
      size: "sm",
      className: `stream-power-stop-action ${r || ""}`.trim(),
      disabled: !e || t,
      onClick: () => {
        s();
      },
      children: [
        t ? /* @__PURE__ */ i(ke, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ i(ar, { className: "mr-2 size-3.5" }),
        e ? "停止" : "不可停止"
      ]
    }
  );
}
function vn({
  running: e,
  stopping: t,
  failed: r,
  canceled: s,
  successful: o
}) {
  return t ? "正在停止" : e ? "生成中" : r ? "生成失败" : s ? "已停止" : o ? "已完成" : "等待生成";
}
function Sn({
  running: e,
  stopping: t,
  failed: r,
  canceled: s,
  successful: o
}) {
  return t || e ? "running" : r ? "fail" : s ? "canceled" : o ? "success" : "pending";
}
function Pn(e) {
  return e.scrollHeight - e.scrollTop - e.clientHeight <= 24;
}
function st(e) {
  e.scrollTop = e.scrollHeight;
}
function Dn(e) {
  if (e.finalOutput)
    return e.finalOutput;
  const t = [];
  return e.liveOutput && t.push(e.liveOutput), e.reasoning && t.push({ event: "reasoning", reasoning: e.reasoning }), e.text && t.push({ text: e.text }), t;
}
function Nt(e) {
  e.current != null && (window.clearTimeout(e.current), e.current = null);
}
function ze(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function Rn(e, t, r) {
  let s = t;
  for (const o of e) {
    const l = be(o);
    if (!l || !Object.prototype.hasOwnProperty.call(r, l))
      continue;
    const f = xn(r[l]);
    In(o, f) && (Object.is(s[l], f) || (s === t && (s = { ...t }), s[l] = f));
  }
  return s;
}
function In(e, t) {
  const r = e.options || [];
  if (e.type !== "option" || r.length === 0)
    return !0;
  const s = V(t);
  return s.length > 0 && r.some(
    (o) => rn(o, [s], r)
  );
}
function Nn(e, t) {
  return {
    values: Rn(e, Qr(e), t),
    files: _n(e, t),
    referenceContents: kn(t)
  };
}
function xn(e) {
  return Array.isArray(e) ? [...e] : we(e) ? { ...e } : e;
}
function kn(e) {
  const t = we(e._reference_contents) ? e._reference_contents : {}, r = {};
  for (const [s, o] of Object.entries(t))
    we(o) && (r[s] = o);
  return r;
}
function _n(e, t) {
  const r = {};
  for (const s of e) {
    if (s.type !== "file" && s.type !== "files")
      continue;
    const o = be(s);
    if (!o || !Object.prototype.hasOwnProperty.call(t, o))
      continue;
    const l = An(t[o]), f = s.type === "files" ? l : l.slice(0, 1);
    f.length !== 0 && (r[o] = f.map((g, k) => {
      const _ = (s.accepted_kinds || s.asset_kinds)?.[0];
      return {
        id: `replay:${o}:${k}`,
        name: Cn(g, k),
        kind: _,
        url: g,
        thumbnail: _ === "image" ? g : void 0
      };
    }));
  }
  return r;
}
function An(e) {
  return (Array.isArray(e) ? e : [e]).map((r) => V(r)).filter((r) => r.length > 0);
}
function Cn(e, t) {
  const s = (e.split(/[?#]/, 1)[0] || "").split("/").pop() || "";
  if (s)
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  return `历史文件 ${t + 1}`;
}
const Jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowStreamRequest: hn,
  StreamPowerRunner: Bt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Bt as S,
  Tr as a,
  Fr as l,
  Jn as s
};
