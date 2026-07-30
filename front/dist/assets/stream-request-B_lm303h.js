import { j as s, a as g, F as ht } from "./createLucideIcon-Gw0gLVQ5.js";
import { g as Ye, c as G, u as m, a as _, b as B, e as Y } from "./runtime-entry-CkPHMDB1.js";
import { u as Zt, m as er, a as Oe } from "./stream-DlOGAsXV.js";
import { L as ke } from "./loader-circle-3ZsHTZm7.js";
import { S as tr } from "./send-MRBuD5_A.js";
import { S as rr } from "./square-CuZYXq82.js";
import { m as nr } from "./content-view-BWYCBIVh.js";
import { m as sr } from "./button-DF4roUfC.js";
import { m as ir } from "./searchable-option-picker-CNFrI5hh.js";
import { m as xt } from "./request-DpEDwvYb.js";
import { m as kt } from "./runtime-stream-runner-5OE2JsJo.js";
import { m as or } from "./store-BeRODhS3.js";
import { A as _t, c as ar } from "./clipboard-B5e8l_LF.js";
import { m as oe } from "./stream-timing-BGlT8cN-.js";
import { A as lr, u as ur } from "./asset-reference-provider-B61UjrJy.js";
import { d as cr, f as At, u as dr, n as mr } from "./upload-asset-api-JzPGB3fW.js";
import { H as Ot } from "./history-Bm7AbadN.js";
import { R as fr } from "./refresh-cw-Dj0geApF.js";
import { X as pr } from "./x-CDJG94MJ.js";
const ot = Ye("@/hooks/use-upload-rule-metas");
if (!ot || Object.keys(ot).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/hooks/use-upload-rule-metas");
const q = Ye("@/components/agent/stream-request-params");
if (!q || Object.keys(q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const gr = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function hr({
  teamID: e,
  open: t,
  param: r,
  files: i,
  resourceKind: o,
  multiple: f,
  maxSelection: h,
  onOpenChange: y,
  onConfirm: T
}) {
  const L = G(
    () => yr(o, r.asset_kinds),
    [r.asset_kinds, o]
  ), X = G(() => br(i), [i]), V = G(
    () => i.filter((u) => !Ct(u.id)),
    [i]
  ), A = f ? Math.max(h - V.length, 0) : 1, J = Array.from(X.keys()).slice(
    0,
    A
  );
  return /* @__PURE__ */ s(
    lr,
    {
      open: t,
      teamID: e,
      title: `${r.name}资产库`,
      description: `选择当前团队的${vr(L)}资产`,
      allowedKinds: L,
      initialSelectedAssetIDs: J,
      multiple: f,
      maxSelection: Math.max(A, 1),
      confirmSelection: !0,
      uploadAccept: cr(L),
      onUpload: (u) => Sr({
        teamID: e,
        ruleID: Number(r.upload_rule_id || 0),
        kind: o,
        files: u
      }),
      validateAsset: (u) => A <= 0 ? `当前参数最多只能选择 ${h} 个文件。` : L.includes(u.kind) ? At(u.version?.content, u.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。" : "该资产类型不适用于当前参数。",
      onClose: () => y(!1),
      onConfirm: (u, ge) => {
        const K = new Map(
          u.map((E) => [E.id, E])
        ), ae = ge.map((E) => {
          const O = K.get(E);
          return O ? wr(O) : X.get(E);
        }).filter((E) => !!E), ne = f ? [...V, ...ae].slice(0, h) : ae.slice(0, 1);
        T(ne);
      }
    }
  );
}
function yr(e, t) {
  const r = yt(e);
  if (r) return [r];
  const i = Array.from(
    new Set(
      (t || []).map(yt).filter((o) => !!o)
    )
  );
  return i.length > 0 ? i : ["image", "audio", "video", "file"];
}
function yt(e) {
  const t = String(e || "");
  return gr.has(t) ? t : void 0;
}
function br(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const i = Ct(r.id);
    i && t.set(i.assetID, r);
  }), t;
}
function Ct(e) {
  const t = /^asset:(\d+):(\d+)$/.exec(String(e || ""));
  return t ? {
    assetID: Number(t[1]),
    versionID: Number(t[2])
  } : null;
}
function wr(e) {
  const t = At(e.version?.content, e.kind);
  if (t)
    return {
      id: `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function vr(e) {
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
async function Sr(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await dr({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind
  })).map(({ asset: r }) => mr(r)).filter((r) => r.id > 0);
}
const Rr = 12, Dr = 2e3, Pr = [1500, 5e3, 21e3];
function Ir(e) {
  const [t, r] = m([]), [i, o] = m(0), [f, h] = m(!1), [y, T] = m(0), [L, X] = m(0), [V, A] = m(null), [J, u] = m(null), [ge, K] = m(!1), [ae, ne] = m(!1), [E, O] = m(!1), [Ce, W] = m(!1), [Te, R] = m(""), [Se, Z] = m(""), ee = _(/* @__PURE__ */ new Map()), x = _(0), j = _(0), k = _(0), I = _(0), se = _(0), le = _(0), z = _([]);
  B(() => {
    I.current = y;
  }, [y]);
  const te = Y(
    async (c, P = !1) => {
      if (!e || c <= 0)
        return null;
      const v = ee.current.get(c);
      if (v && !P)
        return A(v), v;
      const S = x.current, C = k.current + 1;
      k.current = C, v || W(!0);
      try {
        const D = await e.loadDetail(c);
        return S !== x.current || C !== k.current ? null : (xr(ee.current, D), r(($) => st($, [D])), I.current === c && A(D), Z(""), D);
      } catch (D) {
        return S === x.current && C === k.current && Z(
          wt(D, "读取工具历史详情失败")
        ), null;
      } finally {
        S === x.current && C === k.current && W(!1);
      }
    },
    [e]
  ), M = Y(
    async (c = "initial") => {
      if (!e)
        return;
      const P = c === "append", v = x.current, S = j.current + 1;
      j.current = S;
      const C = P ? le.current : 0;
      P ? O(!0) : ne(!0);
      try {
        const D = await e.loadPage(C || void 0);
        if (v !== x.current || S !== j.current)
          return;
        if (r(($) => st($, D.items)), o(D.total), c === "refresh" ? h(($) => $ || D.hasMore) : (h(D.hasMore), le.current = D.beforeID), R(""), c === "initial" && e.selectLatest !== !1 && I.current === 0 && D.items[0]) {
          const $ = D.items[0].id, ye = ee.current.get($) || null;
          I.current = $, T($), A(ye), W(!ye), X((Fe) => Fe + 1);
        }
      } catch (D) {
        v === x.current && S === j.current && R(wt(D, "读取工具历史失败"));
      } finally {
        v === x.current && S === j.current && (ne(!1), O(!1));
      }
    },
    [e]
  );
  B(() => (x.current += 1, j.current += 1, k.current += 1, je(z), ee.current.clear(), I.current = 0, se.current = 0, le.current = 0, r([]), o(0), h(!1), T(0), X(0), A(null), u(null), K(!1), ne(!1), O(!1), W(!1), R(""), Z(""), e && M("initial"), () => {
    x.current += 1, j.current += 1, k.current += 1, je(z);
  }), [e?.scopeKey]), B(() => {
    if (!e || y <= 0 || y === J?.historyID) {
      A(null), W(!1);
      return;
    }
    te(y);
  }, [e, J?.historyID, te, y]), B(() => {
    if (!e || !V || V.id !== y || !Lt(V.status))
      return;
    const c = window.setInterval(() => {
      te(V.id, !0);
    }, Dr);
    return () => window.clearInterval(c);
  }, [e, te, V, y]);
  const ie = Y(() => {
    je(z), T(0), I.current = 0, se.current = 0, A(null), u(null), K(!1), Z("");
  }, []), ue = Y(
    (c) => {
      if (c.historyID <= 0)
        return;
      const P = t.some((S) => S.id === c.historyID), v = (/* @__PURE__ */ new Date()).toISOString();
      se.current = c.historyID, u(c), T(c.historyID), I.current = c.historyID, A(null), r(
        (S) => st(S, [
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
      ), P || o((S) => S + 1);
    },
    [t]
  ), he = Y(
    (c, P, v) => {
      c <= 0 || r(
        (S) => S.map(
          (C) => C.id === c && (C.status !== P || C.error !== v) ? { ...C, status: P, error: v } : C
        )
      );
    },
    []
  ), F = Y(() => {
    if (!e || se.current <= 0)
      return;
    je(z), M("refresh");
    const c = e.refreshDelaysMs ?? Pr;
    z.current = c.map(
      (P) => window.setTimeout(() => {
        M("refresh");
      }, P)
    );
  }, [e, M]), Le = Y(() => {
    K(!0), e && M("refresh");
  }, [e, M]), ce = Y(() => {
    K(!1);
  }, []), Ee = Y((c) => {
    const P = ee.current.get(c) || null;
    T(c), I.current = c, A(P), X((v) => v + 1), W(!P), K(!1), Z("");
  }, []), de = Y(() => {
    y > 0 && te(y, !0);
  }, [te, y]), Me = G(
    () => t.find((c) => c.id === y) || null,
    [t, y]
  );
  return {
    enabled: !!e,
    items: t,
    total: i,
    hasMore: f,
    selectedID: y,
    selectionRevision: L,
    selectedItem: Me,
    selectedDetail: V,
    liveRun: J,
    panelOpen: ge,
    loading: ae,
    loadingMore: E,
    detailLoading: Ce,
    listError: Te,
    detailError: Se,
    beginRun: ie,
    registerLiveRun: ue,
    syncLiveRun: he,
    finishLiveRun: F,
    openPanel: Le,
    closePanel: ce,
    selectHistory: Ee,
    loadMore: () => {
      M("append");
    },
    retryList: () => {
      M("initial");
    },
    retryDetail: de
  };
}
function bt({
  controller: e,
  label: t
}) {
  return e.enabled ? /* @__PURE__ */ s(_t, { label: "运行历史", children: /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: "stream-power-history-trigger",
      "aria-label": "打开运行历史",
      onClick: e.openPanel,
      children: [
        /* @__PURE__ */ s(Ot, {}),
        t ? /* @__PURE__ */ s("span", { className: "stream-power-history-trigger-label", children: t }) : null,
        e.total > 0 ? /* @__PURE__ */ s("span", { className: "stream-power-history-trigger-count", children: e.total }) : null
      ]
    }
  ) }) : null;
}
function Nr({
  controller: e
}) {
  return B(() => {
    if (!e.panelOpen)
      return;
    const r = (i) => {
      i.key === "Escape" && e.closePanel();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e.closePanel, e.panelOpen]), !e.enabled || !e.panelOpen ? null : /* @__PURE__ */ s(
    "div",
    {
      className: "stream-power-history-layer",
      role: "presentation",
      onMouseDown: (r) => {
        r.target === r.currentTarget && e.closePanel();
      },
      children: /* @__PURE__ */ g("aside", { className: "stream-power-history-panel", "aria-label": "工具运行历史", children: [
        /* @__PURE__ */ g("header", { className: "stream-power-history-header", children: [
          /* @__PURE__ */ g("div", { children: [
            /* @__PURE__ */ s("strong", { children: "运行历史" }),
            /* @__PURE__ */ s("small", { children: e.total ? `共 ${e.total} 条` : "暂无记录" })
          ] }),
          /* @__PURE__ */ s(_t, { label: "关闭", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              "aria-label": "关闭运行历史",
              onClick: e.closePanel,
              children: /* @__PURE__ */ s(pr, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ s("div", { className: "stream-power-history-list", children: e.loading && e.items.length === 0 ? /* @__PURE__ */ s(
          nt,
          {
            icon: /* @__PURE__ */ s(ke, { className: "animate-spin" }),
            text: "读取历史"
          }
        ) : e.listError && e.items.length === 0 ? /* @__PURE__ */ s(
          nt,
          {
            icon: /* @__PURE__ */ s(fr, {}),
            text: e.listError,
            action: "重试",
            onAction: e.retryList
          }
        ) : e.items.length === 0 ? /* @__PURE__ */ s(nt, { icon: /* @__PURE__ */ s(Ot, {}), text: "还没有运行记录" }) : e.items.map((r) => /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "stream-power-history-item",
            "data-active": e.selectedID === r.id,
            onClick: () => e.selectHistory(r.id),
            children: [
              /* @__PURE__ */ s("span", { className: "stream-power-history-item-title", children: r.title || "未命名运行" }),
              r.inputSummary ? /* @__PURE__ */ s("span", { className: "stream-power-history-item-summary", children: r.inputSummary }) : null,
              /* @__PURE__ */ g("span", { className: "stream-power-history-item-meta", children: [
                /* @__PURE__ */ s("i", { "data-status": r.status }),
                /* @__PURE__ */ s("span", { children: Tt(r.status) }),
                /* @__PURE__ */ s("time", { children: kr(r.createdAt) })
              ] })
            ]
          },
          r.id
        )) }),
        e.items.length > 0 && e.hasMore ? /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "stream-power-history-more",
            disabled: e.loadingMore,
            onClick: e.loadMore,
            children: [
              e.loadingMore ? /* @__PURE__ */ s(ke, { className: "animate-spin" }) : null,
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
  action: r,
  onAction: i
}) {
  return /* @__PURE__ */ g("div", { className: "stream-power-history-state", children: [
    e,
    /* @__PURE__ */ s("span", { children: t }),
    r && i ? /* @__PURE__ */ s("button", { type: "button", onClick: i, children: r }) : null
  ] });
}
function Tt(e) {
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
  const r = /* @__PURE__ */ new Map();
  return e.forEach((i) => r.set(i.id, i)), t.forEach((i) => {
    const o = r.get(i.id);
    r.set(i.id, o ? { ...o, ...i } : i);
  }), [...r.values()].sort((i, o) => o.id - i.id);
}
function xr(e, t) {
  for (e.delete(t.id), e.set(t.id, t); e.size > Rr; ) {
    const r = e.keys().next().value;
    if (typeof r != "number")
      return;
    e.delete(r);
  }
}
function kr(e) {
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
function wt(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
function je(e) {
  e.current.forEach((t) => window.clearTimeout(t)), e.current = [];
}
const Et = xt.request;
function _r({
  scopeKey: e,
  listApi: t,
  detailApi: r,
  scope: i,
  selectLatest: o = !1
}) {
  if (!(!e || !t || !r))
    return {
      scopeKey: e,
      selectLatest: o,
      loadPage: (f) => Ar(t, i, f),
      loadDetail: (f) => Or(r, i, f)
    };
}
async function Ar(e, t, r, i = 20) {
  const o = await Et(e, "get", {
    ...t,
    before_id: r || void 0,
    limit: i
  }), f = Ft(o, "读取工具历史失败");
  return {
    items: Lr(f.items).map(Mt).filter((h) => h.id > 0),
    total: Er(f.total),
    hasMore: !!f.has_more,
    beforeID: Ae(f.before_id)
  };
}
async function Or(e, t, r) {
  const i = await Et(e, "get", {
    ...t,
    history_id: r
  }), o = Ft(i, "读取工具历史详情失败"), f = Mt(o.history);
  if (!f.id)
    throw new Error("工具历史详情为空");
  const h = _e(o.history);
  return {
    ...f,
    input: _e(h.input),
    output: Cr(h.output),
    targetAssetID: Ae(h.target_asset_id),
    sourceTargetID: Ae(h.source_target_id)
  };
}
function Mt(e) {
  const t = _e(e);
  return {
    id: Ae(t.id),
    runID: Ae(t.run_id),
    requestID: Q(t.request_id),
    title: Q(t.title) || "未命名运行",
    titleSource: Tr(t.title_source),
    inputSummary: Q(t.input_summary),
    status: Q(t.status) || "unavailable",
    error: Q(t.error),
    createdAt: Q(t.created_at),
    startedAt: Q(t.started_at),
    finishedAt: Q(t.finished_at)
  };
}
function Cr(e) {
  return qt(e) ? e : null;
}
function Tr(e) {
  const t = Q(e);
  return t === "llm" || t === "manual" ? t : "auto";
}
function Ft(e, t) {
  const r = _e(e);
  if (Number(r.code) !== 0 && Number(r.status) !== 1)
    throw new Error(Q(r.message || r.msg) || t);
  return _e(r.data);
}
function Lr(e) {
  return Array.isArray(e) ? e : [];
}
function _e(e) {
  return qt(e) ? e : {};
}
function qt(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Ae(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function Er(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function Q(e) {
  return e == null ? "" : String(e).trim();
}
const Mr = nr.EnergonContentView, $t = sr.Button, Fr = ir.SearchableOptionPicker, qr = xt.request, $r = kt.runRuntimeStream, Hr = kt.stopRuntimeStream, H = er.streamValueText, Br = or.getStoreValueByPath, vt = Oe.isEmptyRuntimeOutput, ve = Oe.isPlainRecord, Vr = Oe.normalizeRuntimeFrameOutput, jr = Oe.resolveRuntimeFrameCancelable, St = Oe.runtimeErrorMessage, zr = ot.useUploadRuleMetas, Ur = q.PowerParamPopover, Yr = q.PowerParamField, Gr = q.buildDefaultParamValues, Xr = q.buildRequestInput, we = q.inputKeyForParam, Rt = q.isHiddenParam, Jr = q.isMainParam, Kr = q.isSelectedOptionValue, Qr = q.isToolbarParam, Wr = q.normalizePowerParamConfig, Zr = q.paramFilesRequestValue, en = q.validateMainParams, tn = oe.StreamTimingBadge, rn = oe.cancelStreamTiming, nn = oe.createStreamTiming, Dt = oe.finishStreamTiming, sn = oe.isStreamTimingStatusOutput, on = oe.markStreamTimingStopping, an = oe.updateStreamTimingFromOutput, ln = oe.useStreamClock, Ht = Ye(
  "@/components/reference-composer"
).ReferenceEditor, un = Ye(
  "@/components/agent/stream-request-params"
).isPromptParam, ze = 2, Pt = {
  text: "",
  reasoning: "",
  liveOutput: null,
  finalOutput: null
};
function cn({ item: e, store: t }) {
  const r = Zt(
    t,
    () => H(Br(t, String(e.meta?.powerPath || "")))
  ), i = String(e.meta?.historyApi || ""), o = String(e.meta?.historyDetailApi || ""), f = G(
    () => r ? _r({
      scopeKey: `admin-power:${i}:${o}:${r}`,
      listApi: i,
      detailApi: o,
      scope: { power: r }
    }) : void 0,
    [i, o, r]
  );
  return /* @__PURE__ */ s(
    Bt,
    {
      powerKey: r,
      requestApi: String(e.meta?.requestApi || "/bot/admin/energon/request"),
      paramApi: String(e.meta?.paramApi || "/bot/admin/energon/power_params"),
      streamApi: String(e.meta?.streamApi || "/bot/admin/energon/stream"),
      stopApi: String(e.meta?.stopApi || "/bot/admin/energon/stream_stop"),
      blockMs: Number(e.meta?.blockMs || 1e3),
      history: f
    }
  );
}
function Bt({
  powerKey: e,
  requestApi: t,
  paramApi: r,
  streamApi: i,
  stopApi: o,
  blockMs: f = 1e3,
  requestScope: h,
  paramScope: y = h,
  height: T = "min(60vh, 600px)",
  resultTitle: L = "测试结果",
  formHeader: X,
  renderResultActions: V,
  referenceProviders: A = [],
  assetReferenceTeamID: J = 0,
  appearance: u = "default",
  uploadBizKey: ge,
  uploadBizName: K,
  allowResourceLibrary: ae = !0,
  onUploadedFiles: ne,
  history: E
}) {
  const [O, Ce] = m(""), [W, Te] = m("0-0"), [R, Se] = m(!1), [Z, ee] = m(!1), [x, j] = m(!1), [k, I] = m(""), [se, le] = m(!1), [z, te] = m(Pt), [M, ie] = m(), [ue, he] = m(!1), [F, Le] = m([]), [ce, Ee] = m([]), [de, Me] = m(1), [c, P] = m({ power: "", id: "" }), [v, S] = m({}), [C, D] = m({}), [$, ye] = m({}), [Fe, Vt] = m(0), [jt, Ge] = m(!1), [Re, qe] = m("input"), me = _(0), De = _(null), Xe = _({}), Pe = _(""), Je = _(""), $e = _(null), He = _(null), Ke = _(!0), d = Ir(E), Ie = d.liveRun?.historyID || 0, b = !d.enabled || d.selectedID === 0 || d.selectedID === Ie, re = c.power === e ? c.id : "", Be = Y(
    (n, a) => {
      const l = bn(n, a);
      S(l.values), D(l.files), ye(l.referenceContents), Vt((w) => w + 1);
    },
    []
  );
  B(() => {
    P({ power: "", id: "" }), Pe.current = "", Je.current = "";
  }, [E?.scopeKey, e]);
  const zt = G(
    () => F.map((n) => Number(n.upload_rule_id || 0)).filter((n) => Number.isFinite(n) && n > 0),
    [F]
  ), at = zr(zt), lt = G(
    () => F.filter((n) => Jr(n) && !Rt(n)),
    [F]
  ), ut = G(
    () => F.filter((n) => Qr(n) && !Rt(n)),
    [F]
  ), Qe = F.length > 0, Ut = G(
    () => ce.map((n) => ({
      id: n.id,
      value: u === "body" ? H(n.service_name) || "未命名服务" : n.name
    })),
    [u, ce]
  ), ct = de !== ze || re.length > 0, Yt = ln(M?.status === "running"), be = u === "body" && J > 0 ? (n) => /* @__PURE__ */ s(hr, { ...n, teamID: J }) : void 0, Gt = G(
    () => Qe && ct && !R && !ue && e.length > 0,
    [Qe, ue, e, R, ct]
  );
  B(() => () => {
    me.current += 1, De.current?.abort(), Nt($e);
  }, []), B(() => {
    qe("input");
  }, [e]), B(() => {
    let n = !1;
    if (Le([]), Ee([]), S({}), D({}), ye({}), Xe.current = {}, Pe.current = "", I(""), le(!1), !e)
      return Me(1), he(!1), () => {
        n = !0;
      };
    async function a() {
      he(!0);
      const l = await qr(r, "get", {
        ...y,
        power: e,
        include_sources: 1,
        source_target_id: re
      });
      if (n)
        return;
      if (l.code !== 0 && l.status !== 1) {
        he(!1), I(l.message || l.msg || "读取能力参数失败。");
        return;
      }
      const w = ve(l.data) ? l.data : {}, p = Wr(l.data), N = p.params, pe = ve(w.initial_input) ? w.initial_input : {};
      Me(p.sourceRule), Ee(p.sources), p.selectedSourceID && p.selectedSourceID !== re && P({ power: e, id: p.selectedSourceID }), Pe.current = "", Le(N), Be(N, pe), he(!1);
    }
    return a(), () => {
      n = !0;
    };
  }, [re, Be, r, y, e]), B(() => {
    if (!b)
      return;
    const n = He.current;
    if (!n || !Ke.current)
      return;
    it(n);
    const a = window.setTimeout(() => it(n), 0);
    return () => {
      window.clearTimeout(a);
    };
  }, [z, R, b]), B(() => {
    const n = He.current;
    if (n) {
      if (b) {
        it(n);
        return;
      }
      n.scrollTop = 0;
    }
  }, [d.selectedID, b]);
  const Xt = () => {
    const n = He.current;
    n && (Ke.current = pn(n));
  }, dt = async () => {
    if (!(!O || !Z || x)) {
      j(!0), I(""), ie((n) => on(n)), De.current?.abort();
      try {
        await Hr(O, o), me.current += 1, Se(!1), ee(!1), ie((n) => rn(n)), d.finishLiveRun();
      } catch (n) {
        I(St(n, "停止任务失败。"));
      } finally {
        j(!1);
      }
    }
  }, Jt = async () => {
    if (!e) {
      I("未选择能力。");
      return;
    }
    const n = en(F, v);
    if (n) {
      I(n);
      return;
    }
    const a = me.current + 1;
    me.current = a, d.beginRun(), u === "body" && qe("result"), Se(!0), I(""), le(!1), te(Pt), ie(nn("正在连接模型")), Ce(""), Ge(!1), Te("0-0"), ee(!1), j(!1), Ke.current = !0;
    const l = new AbortController();
    De.current = l;
    try {
      const w = Xr(F, v);
      Object.keys($).length > 0 && (w._reference_contents = $), Xe.current = { ...w };
      const p = {
        ...h,
        power: e,
        input: w,
        params_complete: !0,
        history: [],
        options: {
          stream: !0
        }
      };
      de === ze && re && (p.source_target_id = re), await $r({
        requestApi: t,
        streamApi: i,
        stopApi: o,
        stopOnAbort: !1,
        body: p,
        blockMs: f,
        signal: l.signal,
        onRequestID: Ce,
        onFrame: (N) => {
          if (me.current !== a || l.signal.aborted)
            return;
          const pe = H(N?.stream_id);
          pe && Te(pe), Kt(N);
        }
      });
    } catch (w) {
      me.current === a && (I(St(w, "测试失败。")), ie((p) => Dt(p, "failed")), d.finishLiveRun());
    } finally {
      me.current === a && Se(!1), De.current === l && (De.current = null);
    }
  }, Kt = (n) => {
    const a = Vr(n?.output, n);
    if (vt(a) && n.type !== "result")
      return;
    const l = jr(n);
    l != null && ee(l);
    const w = H(a.event).toLowerCase();
    if (w === "start") {
      const p = a, N = ve(p.meta) ? p.meta : {}, pe = Ue(N.history_id);
      pe > 0 && d.registerLiveRun({
        historyID: pe,
        runID: Ue(N.run_id),
        requestID: H(n?.request_id),
        title: H(N.history_title) || "未命名运行",
        inputSummary: H(N.history_input_summary),
        input: { ...Xe.current },
        targetAssetID: Ue(N.target_asset_id),
        sourceTargetID: Ue(N.source_target_id)
      });
    }
    sn(a) && ie((p) => an(p, a)), n.type === "result" && (le(Number(n.status) === 2), ie(
      (p) => Dt(
        p,
        Number(n.status) === 2 ? "failed" : "done"
      )
    ), d.finishLiveRun()), te((p) => {
      if (H(a.event).toLowerCase() === "control")
        return p;
      if (n.type === "result")
        return {
          ...p,
          finalOutput: vt(a) ? { text: p.text || H(n?.msg) } : a
        };
      const N = {
        text: p.text,
        reasoning: p.reasoning,
        liveOutput: p.liveOutput,
        finalOutput: p.finalOutput
      };
      return w === "audio_ready" && (N.liveOutput = a), (w === "delta" || !w && a.text) && (N.text += H(a.text)), (w === "reasoning" || a.reasoning) && (N.reasoning += H(a.reasoning || a.text)), N;
    });
  }, We = (n, a) => {
    const l = we(n);
    l && S((w) => ({
      ...w,
      [l]: a
    }));
  }, mt = (n, a) => {
    const l = we(n);
    l && (D((w) => ({
      ...w,
      [l]: a
    })), S((w) => ({
      ...w,
      [l]: Zr(n, a)
    })));
  }, Qt = async () => {
    const n = O.trim();
    if (n)
      try {
        await ar(n), Ge(!0), Nt($e), $e.current = window.setTimeout(() => {
          Ge(!1), $e.current = null;
        }, 1200);
      } catch {
        I("复制 RequestID 失败。");
      }
  }, Ze = !!(O && z.finalOutput && !R && !se && !k), Wt = mn({
    running: R,
    stopping: x,
    failed: !!(k || se),
    canceled: M?.status === "canceled",
    successful: Ze
  }), et = fn({
    running: R,
    stopping: x,
    failed: !!(k || se),
    canceled: M?.status === "canceled",
    successful: Ze
  });
  B(() => {
    Ie > 0 && d.syncLiveRun(Ie, et, k);
  }, [k, d.syncLiveRun, Ie, et]);
  const U = b ? null : d.selectedDetail, tt = b ? d.liveRun?.input : U?.input, Ne = b ? d.liveRun?.sourceTargetID || 0 : U?.sourceTargetID || 0;
  B(() => {
    const n = d.selectedID;
    if (!d.enabled || n <= 0 || !tt || F.length === 0)
      return;
    const a = [
      E?.scopeKey || "",
      n,
      d.selectionRevision
    ].join(":");
    if (Je.current !== a && (Je.current = a, de === ze && Ne > 0 && ce.some(
      (l) => l.id === String(Ne)
    ) && String(Ne) !== re)) {
      P({
        power: e,
        id: String(Ne)
      });
      return;
    }
    Pe.current !== a && (Pe.current = a, Be(F, tt));
  }, [
    re,
    Be,
    E?.scopeKey,
    d.enabled,
    d.selectedID,
    d.selectionRevision,
    e,
    F,
    ce,
    tt,
    Ne,
    de
  ]);
  const fe = d.selectedItem, Ve = b ? et : U?.status || fe?.status || "pending", ft = b ? Wt : Tt(Ve), pt = b ? z.finalOutput : U?.output || null, rt = {
    historyID: b ? Ie : U?.id || fe?.id || 0,
    runID: b ? d.liveRun?.runID || 0 : U?.runID || fe?.runID || 0,
    requestID: b ? O : U?.requestID || fe?.requestID || "",
    title: b ? fe?.title || d.liveRun?.title || "" : U?.title || fe?.title || "",
    targetAssetID: b ? d.liveRun?.targetAssetID || 0 : U?.targetAssetID || 0,
    output: pt,
    running: b ? R : Lt(Ve),
    successful: b ? Ze : !!(U && Ve === "success"),
    status: Ve,
    error: b ? k : U?.error || fe?.error || ""
  }, gt = /* @__PURE__ */ g(ht, { children: [
    b && M ? /* @__PURE__ */ s("div", { className: "stream-power-timing mb-3", children: /* @__PURE__ */ s(tn, { timing: M, now: Yt }) }) : null,
    !b && d.detailError ? /* @__PURE__ */ g("div", { className: "stream-power-history-detail-error", children: [
      /* @__PURE__ */ s("span", { children: d.detailError }),
      /* @__PURE__ */ s("button", { type: "button", onClick: d.retryDetail, children: "重试" })
    ] }) : null,
    !b && !d.detailError && rt.error ? /* @__PURE__ */ s("div", { className: "stream-power-history-detail-error", children: /* @__PURE__ */ s("span", { children: rt.error }) }) : null,
    /* @__PURE__ */ s(
      Mr,
      {
        output: b ? gn(z) : pt,
        streaming: b && R && !z.finalOutput,
        emptyText: !b && d.detailLoading ? "正在读取历史结果。" : u === "body" ? "生成结果会显示在这里。" : "AI 返回内容会显示在这里。",
        className: u === "body" ? "stream-power-content-view" : void 0,
        markdownClassName: u === "body" ? "stream-power-markdown" : void 0
      }
    )
  ] }), xe = (u === "body" ? !!e : Qe) ? /* @__PURE__ */ g(ht, { children: [
    R ? /* @__PURE__ */ s(
      It,
      {
        cancelable: Z,
        stopping: x,
        onStop: dt
      }
    ) : null,
    u !== "body" ? /* @__PURE__ */ s(
      bt,
      {
        controller: d,
        label: "历史"
      }
    ) : null,
    /* @__PURE__ */ g(
      $t,
      {
        type: "button",
        size: "sm",
        className: "stream-power-generate-action",
        disabled: !Gt,
        onClick: () => {
          Jt();
        },
        children: [
          R ? /* @__PURE__ */ s(ke, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ s(tr, { className: "mr-2 size-4" }),
          R ? "生成中..." : "生成"
        ]
      }
    )
  ] }) : null;
  return /* @__PURE__ */ g(
    "div",
    {
      "data-stream-power-appearance": u,
      "data-mobile-view": u === "body" ? Re : void 0,
      className: "stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden",
      style: { height: T },
      children: [
        u === "body" ? /* @__PURE__ */ g("div", { className: "stream-power-mobile-tabs", role: "tablist", "aria-label": "工具运行视图", children: [
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Re === "input",
              "data-active": Re === "input",
              onClick: () => qe("input"),
              children: "输入"
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Re === "result",
              "data-active": Re === "result",
              onClick: () => qe("result"),
              children: "结果"
            }
          )
        ] }) : null,
        /* @__PURE__ */ g("div", { className: "stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0", children: [
          X || u === "body" && xe ? /* @__PURE__ */ g("div", { className: "stream-power-form-header shrink-0", children: [
            X ? /* @__PURE__ */ s("div", { className: "stream-power-form-header-content", children: X }) : null,
            u === "body" && xe ? /* @__PURE__ */ s("div", { className: "stream-power-header-actions stream-power-run-actions", children: xe }) : null
          ] }) : null,
          /* @__PURE__ */ g("div", { className: "stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3", children: [
            ue ? /* @__PURE__ */ g("span", { className: "stream-power-loading mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ s(ke, { className: "size-3 animate-spin" }),
              "读取参数"
            ] }) : null,
            de === ze && ce.length > 0 ? /* @__PURE__ */ g("div", { className: "stream-power-source mb-3", children: [
              u === "body" ? /* @__PURE__ */ s("span", { className: "stream-power-source-label", children: "选择模型" }) : null,
              /* @__PURE__ */ s("div", { className: "stream-power-source-picker", children: /* @__PURE__ */ s(
                Fr,
                {
                  value: re || void 0,
                  options: Ut,
                  disabled: R || ue,
                  placeholder: u === "body" ? "请选择模型" : "请选择来源",
                  searchPlaceholder: u === "body" ? "搜索模型..." : void 0,
                  clearable: !1,
                  onChange: (n) => {
                    const a = Array.isArray(n) ? n[0] || "" : n;
                    P({ power: e, id: String(a || "") });
                  }
                }
              ) })
            ] }) : null,
            lt.length > 0 ? /* @__PURE__ */ s(
              "div",
              {
                className: "stream-power-param-list space-y-3",
                children: lt.map((n) => {
                  const a = we(n);
                  return un?.(n) && Ht && (J > 0 || A.length > 0) ? /* @__PURE__ */ s(
                    dn,
                    {
                      param: n,
                      value: String(v[a] || ""),
                      content: $[a],
                      providers: A,
                      assetReferenceTeamID: J,
                      disabled: R,
                      onChange: (l, w) => {
                        We(n, l), ye((p) => ({
                          ...p,
                          [a]: w
                        }));
                      }
                    },
                    `${n.id}-${a}`
                  ) : /* @__PURE__ */ s("div", { className: "stream-power-param-field", children: /* @__PURE__ */ s(
                    Yr,
                    {
                      param: n,
                      value: v[a],
                      files: C[a] || [],
                      uploadRuleMeta: at.get(Number(n.upload_rule_id || 0)),
                      disabled: R,
                      uploadBizKey: ge,
                      uploadBizName: K,
                      allowResourceLibrary: ae,
                      fileLibraryOnly: !!be,
                      fileLibraryLabel: be ? "添加" : void 0,
                      renderFileLibrary: be,
                      onUploadedFiles: ne,
                      onChange: (l) => We(n, l),
                      onFilesChange: (l) => mt(n, l)
                    }
                  ) }, `${n.id}-${a}`);
                })
              },
              `main-${Fe}`
            ) : ue ? null : /* @__PURE__ */ s("div", { className: "stream-power-empty rounded-lg px-3 py-8 text-center text-sm text-muted-foreground", children: "暂无参数配置。" }),
            ut.length > 0 ? /* @__PURE__ */ s(
              "div",
              {
                className: "stream-power-toolbar-params mt-3 flex flex-wrap items-center gap-2 border-t pt-3",
                children: ut.map((n) => {
                  const a = we(n);
                  return /* @__PURE__ */ s(
                    Ur,
                    {
                      param: n,
                      value: v[a],
                      files: C[a] || [],
                      uploadRuleMeta: at.get(Number(n.upload_rule_id || 0)),
                      disabled: R,
                      uploadBizKey: ge,
                      uploadBizName: K,
                      allowResourceLibrary: ae,
                      fileLibraryOnly: !!be,
                      fileLibraryLabel: be ? "添加" : void 0,
                      renderFileLibrary: be,
                      onUploadedFiles: ne,
                      onChange: (l) => We(n, l),
                      onFilesChange: (l) => mt(n, l)
                    },
                    `${n.id}-${a}`
                  );
                })
              },
              `toolbar-${Fe}`
            ) : null,
            k ? /* @__PURE__ */ s("div", { className: "stream-power-error mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: k }) : null
          ] }),
          u !== "body" && xe ? /* @__PURE__ */ s("div", { className: "stream-power-actions stream-power-run-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3", children: xe }) : null
        ] }),
        /* @__PURE__ */ s("div", { className: "stream-power-divider hidden w-px shrink-0 bg-border md:block", "aria-hidden": "true" }),
        /* @__PURE__ */ g("div", { className: "stream-power-result relative flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0", children: [
          /* @__PURE__ */ g("div", { className: "stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2", children: [
            u === "body" ? /* @__PURE__ */ g("div", { className: "stream-power-result-heading", children: [
              /* @__PURE__ */ s("span", { children: L }),
              /* @__PURE__ */ s("small", { "data-status": ft, children: ft })
            ] }) : /* @__PURE__ */ s("span", { className: "text-sm font-medium text-foreground", children: L }),
            /* @__PURE__ */ g("div", { className: "stream-power-result-actions flex min-w-0 items-center justify-end gap-2", children: [
              u === "body" && R ? /* @__PURE__ */ s(
                It,
                {
                  className: "stream-power-mobile-stop",
                  cancelable: Z,
                  stopping: x,
                  onStop: dt
                }
              ) : null,
              V?.(rt),
              u === "body" ? /* @__PURE__ */ s(bt, { controller: d }) : null,
              u !== "body" ? O ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "flex min-w-0 max-w-[70%] items-center justify-end rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  title: `双击复制完整 RequestID：${O}${W !== "0-0" ? ` / StreamID: ${W}` : ""}`,
                  onDoubleClick: () => {
                    Qt();
                  },
                  children: [
                    /* @__PURE__ */ s("span", { className: "mr-1 shrink-0", children: "RequestID:" }),
                    /* @__PURE__ */ s("span", { className: "min-w-0 truncate font-mono", children: O }),
                    jt ? /* @__PURE__ */ s("span", { className: "ml-2 shrink-0 text-primary", children: "已复制" }) : null
                  ]
                }
              ) : /* @__PURE__ */ s("span", { className: "text-xs text-muted-foreground", children: "暂无 RequestID" }) : null
            ] })
          ] }),
          /* @__PURE__ */ s(
            "div",
            {
              ref: He,
              onScroll: Xt,
              style: { scrollbarGutter: "stable" },
              className: "stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3",
              children: u === "body" ? /* @__PURE__ */ s("div", { className: "stream-power-result-content", children: gt }) : gt
            }
          ),
          /* @__PURE__ */ s(Nr, { controller: d })
        ] })
      ]
    }
  );
}
function dn({
  param: e,
  value: t,
  content: r,
  providers: i,
  assetReferenceTeamID: o,
  disabled: f,
  onChange: h
}) {
  const y = ur({
    teamID: o,
    allowedKinds: e.asset_kinds
  }), T = G(
    () => o > 0 ? [
      y,
      ...i.filter((L) => L.trigger !== "@")
    ] : i,
    [y, o, i]
  );
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
        content: r,
        references: [],
        placeholder: e.placeholder || `请输入${e.name}`,
        disabled: f,
        providers: T,
        onChange: h
      }
    )
  ] });
}
function It({
  cancelable: e,
  stopping: t,
  className: r,
  onStop: i
}) {
  return /* @__PURE__ */ g(
    $t,
    {
      type: "button",
      variant: "outline",
      size: "sm",
      className: `stream-power-stop-action ${r || ""}`.trim(),
      disabled: !e || t,
      onClick: () => {
        i();
      },
      children: [
        t ? /* @__PURE__ */ s(ke, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ s(rr, { className: "mr-2 size-3.5" }),
        e ? "停止" : "不可停止"
      ]
    }
  );
}
function mn({
  running: e,
  stopping: t,
  failed: r,
  canceled: i,
  successful: o
}) {
  return t ? "正在停止" : e ? "生成中" : r ? "生成失败" : i ? "已停止" : o ? "已完成" : "等待生成";
}
function fn({
  running: e,
  stopping: t,
  failed: r,
  canceled: i,
  successful: o
}) {
  return t || e ? "running" : r ? "fail" : i ? "canceled" : o ? "success" : "pending";
}
function pn(e) {
  return e.scrollHeight - e.scrollTop - e.clientHeight <= 24;
}
function it(e) {
  e.scrollTop = e.scrollHeight;
}
function gn(e) {
  if (e.finalOutput)
    return e.finalOutput;
  const t = [];
  return e.liveOutput && t.push(e.liveOutput), e.reasoning && t.push({ event: "reasoning", reasoning: e.reasoning }), e.text && t.push({ text: e.text }), t;
}
function Nt(e) {
  e.current != null && (window.clearTimeout(e.current), e.current = null);
}
function Ue(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function hn(e, t, r) {
  let i = t;
  for (const o of e) {
    const f = we(o);
    if (!f || !Object.prototype.hasOwnProperty.call(r, f))
      continue;
    const h = wn(r[f]);
    yn(o, h) && (Object.is(i[f], h) || (i === t && (i = { ...t }), i[f] = h));
  }
  return i;
}
function yn(e, t) {
  const r = e.options || [];
  if (e.type !== "option" || r.length === 0)
    return !0;
  const i = H(t);
  return i.length > 0 && r.some((o) => Kr(o, [i]));
}
function bn(e, t) {
  return {
    values: hn(e, Gr(e), t),
    files: Sn(e, t),
    referenceContents: vn(t)
  };
}
function wn(e) {
  return Array.isArray(e) ? [...e] : ve(e) ? { ...e } : e;
}
function vn(e) {
  const t = ve(e._reference_contents) ? e._reference_contents : {}, r = {};
  for (const [i, o] of Object.entries(t))
    ve(o) && (r[i] = o);
  return r;
}
function Sn(e, t) {
  const r = {};
  for (const i of e) {
    if (i.type !== "file" && i.type !== "files")
      continue;
    const o = we(i);
    if (!o || !Object.prototype.hasOwnProperty.call(t, o))
      continue;
    const f = Rn(t[o]), h = i.type === "files" ? f : f.slice(0, 1);
    h.length !== 0 && (r[o] = h.map((y, T) => {
      const L = i.asset_kinds?.[0];
      return {
        id: `replay:${o}:${T}`,
        name: Dn(y, T),
        kind: L,
        url: y,
        thumbnail: L === "image" ? y : void 0
      };
    }));
  }
  return r;
}
function Rn(e) {
  return (Array.isArray(e) ? e : [e]).map((r) => H(r)).filter((r) => r.length > 0);
}
function Dn(e, t) {
  const i = (e.split(/[?#]/, 1)[0] || "").split("/").pop() || "";
  if (i)
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  return `历史文件 ${t + 1}`;
}
const zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowStreamRequest: cn,
  StreamPowerRunner: Bt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Bt as S,
  Ar as a,
  Or as l,
  zn as s
};
