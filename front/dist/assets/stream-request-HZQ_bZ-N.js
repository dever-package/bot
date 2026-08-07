import { j as n, a as f, F as ot } from "./createLucideIcon-fWv1XcFy.js";
import { g as Ue, i as G, b as m, e as U, c as Y, d as oe } from "./runtime-entry-ClkZDmNs.js";
import { u as ar, m as lr } from "./content-view-BXwDWBA5.js";
import { L as ke } from "./vanilla-BSPxkY5-.js";
import { S as cr } from "./send-BiLChpK4.js";
import { S as ur } from "./square-Ds__aRY5.js";
import { m as dr } from "./button-D8VCR9tT.js";
import { m as mr } from "./searchable-option-picker-B2bxMM1v.js";
import { m as _t } from "./request-m1WJL1Tm.js";
import { m as Mt } from "./runtime-stream-runner-DadR9qgq.js";
import { m as fr, a as Ee } from "./stream-B1l_qwg7.js";
import { m as pr } from "./store-Qy-gDmQw.js";
import { A as Ot, c as gr } from "./clipboard-CS1yff3P.js";
import { m as we } from "./stream-timing-xZXCx8RF.js";
import { u as hr } from "./asset-reference-provider-5wXqToZ6.js";
import { g as bt, b as yr, Q as Ct, T as br, y as wr } from "./storyboard-grid-view-BldHSQpc.js";
import { U as vr } from "./upload-BAn1zipX.js";
import { X as Tt } from "./in-flight-request-CXY2yBH9.js";
import { c as Sr, k as Pr } from "./site-config-DrnclGFw.js";
import { A as Rr } from "./asset-page-C3BMxAAc.js";
import { H as Ft } from "./history-BnF8Oyah.js";
import { R as Dr } from "./content-api-CuR5pbI7.js";
const at = Ue("@/hooks/use-upload-rule-metas");
if (!at || Object.keys(at).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/hooks/use-upload-rule-metas");
const K = Ue("@/components/agent/stream-request-params");
if (!K || Object.keys(K).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
function Et({
  open: e,
  teamID: t,
  scopeProjectID: r = 0,
  title: s = "选择资产",
  description: o = "使用资产当前版本",
  initialFilters: u,
  allowedKinds: p,
  initialSelectedAssetIDs: h = [],
  usedAssetIDs: O = [],
  multiple: P = !1,
  maxSelection: z = 1,
  confirmSelection: R = !1,
  contentMode: C = "preview",
  validateAsset: $,
  uploadAccept: d,
  onUpload: me,
  onClose: V,
  onConfirm: fe
}) {
  const ae = JSON.stringify(h), q = G(
    () => wt(JSON.parse(ae)),
    [ae]
  ), H = JSON.stringify(u || {}), ye = G(
    () => JSON.parse(H),
    [H]
  ), [E, ne] = m(
    q
  ), [A, ee] = m(/* @__PURE__ */ new Map()), [se, re] = m(
    ye
  ), [L, T] = m(""), [D, k] = m(!1), [le, pe] = m(0), Q = U(null), B = P ? Math.max(1, z) : 1;
  Y(() => {
    e && (ne(q.slice(0, B)), ee(/* @__PURE__ */ new Map()), re(ye), T(""), k(!1));
  }, [
    ye,
    q,
    e,
    B,
    r,
    t
  ]), Y(() => {
    if (!e) return;
    const a = (v) => {
      v.key === "Escape" && !D && V();
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, [V, e, D]);
  async function J(a) {
    const v = Array.from(a.target.files || []);
    if (a.target.value = "", !me || v.length === 0 || D) return;
    const y = P ? Math.max(B - E.length, 0) : 1;
    if (y <= 0) {
      T(`最多选择 ${B} 项资产。`);
      return;
    }
    k(!0), T("");
    const j = [], W = [];
    try {
      for (const ue of v.slice(0, y))
        try {
          const c = await me([ue]);
          for (const x of c) {
            const N = $?.(x) || "";
            N ? W.push(`${ue.name}：${N}`) : x.id > 0 && j.push(x);
          }
        } catch (c) {
          W.push(`${ue.name}：${Pr(c, "上传失败")}`);
        }
      j.length > 0 && (ce(j), re({
        sourceType: "upload",
        kind: p?.length === 1 ? p[0] : ""
      }), pe((ue) => ue + 1)), T(W.join("；"));
    } finally {
      k(!1);
    }
  }
  function ce(a) {
    const v = Array.from(
      new Map(a.map((y) => [y.id, y])).values()
    );
    ee((y) => {
      const j = new Map(y);
      return v.forEach((W) => j.set(W.id, W)), j;
    }), ne(
      (y) => P ? wt([
        ...y,
        ...v.map((j) => j.id)
      ]).slice(0, B) : v[0] ? [v[0].id] : y
    );
  }
  function ge(a) {
    if (R && P && E.includes(a.id)) {
      ne((y) => y.filter((j) => j !== a.id)), ee((y) => {
        const j = new Map(y);
        return j.delete(a.id), j;
      }), T("");
      return;
    }
    const v = $?.(a) || "";
    if (v) {
      T(v);
      return;
    }
    if (T(""), !R) {
      fe([a], [a.id]), V();
      return;
    }
    if (!P) {
      ne([a.id]), ee(/* @__PURE__ */ new Map([[a.id, a]]));
      return;
    }
    if (E.length >= B) {
      T(`最多选择 ${B} 项资产。`);
      return;
    }
    ne((y) => [...y, a.id]), ee((y) => new Map(y).set(a.id, a));
  }
  function be() {
    const a = E.map((v) => A.get(v)).filter((v) => !!v);
    fe(a, E), V();
  }
  return !e || typeof document > "u" ? null : Sr(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": s,
        onMouseDown: (a) => {
          a.target === a.currentTarget && !D && V();
        },
        children: /* @__PURE__ */ f("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ f("header", { children: [
            /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ n("h2", { children: s }),
              /* @__PURE__ */ n("p", { children: o })
            ] }),
            /* @__PURE__ */ n(bt, { label: "关闭", children: /* @__PURE__ */ f("button", { type: "button", disabled: D, onClick: V, children: [
              /* @__PURE__ */ n(Tt, { "aria-hidden": "true" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          L ? /* @__PURE__ */ n("p", { className: "wb-asset-picker-message", children: L }) : null,
          /* @__PURE__ */ n(
            Rr,
            {
              teamID: t,
              scopeProjectID: r,
              initialFilters: se,
              allowedKinds: p,
              contentMode: C,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetIDs: E,
              usedAssetIDs: O,
              reloadSignal: le,
              onAssetChanged: (a) => {
                E.includes(a.id) && ee(
                  (v) => new Map(v).set(a.id, a)
                );
              },
              onAssetRemoved: (a) => {
                ne(
                  (v) => v.filter((y) => y !== a)
                ), ee((v) => {
                  const y = new Map(v);
                  return y.delete(a), y;
                });
              },
              headerAction: me ? /* @__PURE__ */ f(ot, { children: [
                /* @__PURE__ */ n(bt, { label: "本地上传", children: /* @__PURE__ */ f(
                  "button",
                  {
                    type: "button",
                    className: "wb-asset-local-upload",
                    disabled: D,
                    onClick: () => Q.current?.click(),
                    children: [
                      D ? /* @__PURE__ */ n(ke, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(vr, { "aria-hidden": "true" }),
                      /* @__PURE__ */ n("span", { children: D ? "上传中" : "本地上传" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    ref: Q,
                    type: "file",
                    hidden: !0,
                    multiple: P,
                    accept: d,
                    onChange: J
                  }
                )
              ] }) : void 0,
              onSelect: ge
            }
          ),
          R ? /* @__PURE__ */ f("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ f("span", { children: [
              "已选 ",
              E.length,
              P ? ` / ${B}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ n("button", { type: "button", onClick: V, children: "取消" }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: D || E.length === 0,
                  onClick: be,
                  children: "确认使用"
                }
              )
            ] })
          ] }) : null
        ] })
      }
    ),
    document.body
  );
}
function wt(e) {
  return Array.from(
    new Set(e.map(Number).filter((t) => Number.isFinite(t) && t > 0))
  );
}
const as = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AssetPickerDialog: Et
}, Symbol.toStringTag, { value: "Module" })), Nr = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function Ir({
  teamID: e,
  open: t,
  param: r,
  files: s,
  resourceKind: o,
  multiple: u,
  maxSelection: p,
  onOpenChange: h,
  onConfirm: O
}) {
  const P = G(
    () => kr(o, r.asset_kinds),
    [r.asset_kinds, o]
  ), z = G(() => xr(s), [s]), R = G(
    () => s.filter((d) => !Lt(d.id)),
    [s]
  ), C = u ? Math.max(p - R.length, 0) : 1, $ = Array.from(z.keys()).slice(
    0,
    C
  );
  return /* @__PURE__ */ n(
    Et,
    {
      open: t,
      teamID: e,
      title: `${r.name}资产库`,
      description: `选择当前团队的${_r(P)}资产`,
      allowedKinds: P,
      initialSelectedAssetIDs: $,
      multiple: u,
      maxSelection: Math.max(C, 1),
      confirmSelection: !0,
      uploadAccept: yr(P),
      onUpload: (d) => Mr({
        teamID: e,
        ruleID: Number(r.upload_rule_id || 0),
        kind: o,
        files: d
      }),
      validateAsset: (d) => C <= 0 ? `当前参数最多只能选择 ${p} 个文件。` : P.includes(d.kind) ? Ct(d.version?.content, d.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。" : "该资产类型不适用于当前参数。",
      onClose: () => h(!1),
      onConfirm: (d, me) => {
        const V = new Map(
          d.map((q) => [q.id, q])
        ), fe = me.map((q) => {
          const H = V.get(q);
          return H ? Ar(H) : z.get(q);
        }).filter((q) => !!q), ae = u ? [...R, ...fe].slice(0, p) : fe.slice(0, 1);
        O(ae);
      }
    }
  );
}
function kr(e, t) {
  const r = vt(e);
  if (r) return [r];
  const s = Array.from(
    new Set(
      (t || []).map(vt).filter((o) => !!o)
    )
  );
  return s.length > 0 ? s : ["image", "audio", "video", "file"];
}
function vt(e) {
  const t = String(e || "");
  return Nr.has(t) ? t : void 0;
}
function xr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const s = Lt(r.id);
    s && t.set(s.assetID, r);
  }), t;
}
function Lt(e) {
  const t = /^asset:(\d+):(\d+)$/.exec(String(e || ""));
  return t ? {
    assetID: Number(t[1]),
    versionID: Number(t[2])
  } : null;
}
function Ar(e) {
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
function _r(e) {
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
async function Mr(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await br({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind
  })).map(({ asset: r }) => wr(r)).filter((r) => r.id > 0);
}
const Or = 12, Cr = 2e3, Tr = [1500, 5e3, 21e3];
function Fr(e) {
  const [t, r] = m([]), [s, o] = m(0), [u, p] = m(!1), [h, O] = m(0), [P, z] = m(0), [R, C] = m(null), [$, d] = m(null), [me, V] = m(!1), [fe, ae] = m(!1), [q, H] = m(!1), [ye, E] = m(!1), [ne, A] = m(""), [ee, se] = m(""), re = U(/* @__PURE__ */ new Map()), L = U(0), T = U(0), D = U(0), k = U(0), le = U(0), pe = U(0), Q = U([]);
  Y(() => {
    k.current = h;
  }, [h]);
  const B = oe(
    async (c, x = !1) => {
      if (!e || c <= 0)
        return null;
      const N = re.current.get(c);
      if (N && !x)
        return C(N), N;
      const _ = L.current, X = D.current + 1;
      D.current = X, N || E(!0);
      try {
        const F = await e.loadDetail(c);
        return _ !== L.current || X !== D.current ? null : (Lr(re.current, F), r((Z) => st(Z, [F])), k.current === c && C(F), se(""), F);
      } catch (F) {
        return _ === L.current && X === D.current && se(
          Pt(F, "读取工具历史详情失败")
        ), null;
      } finally {
        _ === L.current && X === D.current && E(!1);
      }
    },
    [e]
  ), J = oe(
    async (c = "initial") => {
      if (!e)
        return;
      const x = c === "append", N = L.current, _ = T.current + 1;
      T.current = _;
      const X = x ? pe.current : 0;
      x ? H(!0) : ae(!0);
      try {
        const F = await e.loadPage(X || void 0);
        if (N !== L.current || _ !== T.current)
          return;
        if (r((Z) => st(Z, F.items)), o(F.total), c === "refresh" ? p((Z) => Z || F.hasMore) : (p(F.hasMore), pe.current = F.beforeID), A(""), c === "initial" && e.selectLatest !== !1 && k.current === 0 && F.items[0]) {
          const Z = F.items[0].id, Re = re.current.get(Z) || null;
          k.current = Z, O(Z), C(Re), E(!Re), z((Je) => Je + 1);
        }
      } catch (F) {
        N === L.current && _ === T.current && A(Pt(F, "读取工具历史失败"));
      } finally {
        N === L.current && _ === T.current && (ae(!1), H(!1));
      }
    },
    [e]
  );
  Y(() => (L.current += 1, T.current += 1, D.current += 1, je(Q), re.current.clear(), k.current = 0, le.current = 0, pe.current = 0, r([]), o(0), p(!1), O(0), z(0), C(null), d(null), V(!1), ae(!1), H(!1), E(!1), A(""), se(""), e && J("initial"), () => {
    L.current += 1, T.current += 1, D.current += 1, je(Q);
  }), [e?.scopeKey]), Y(() => {
    if (!e || h <= 0 || h === $?.historyID) {
      C(null), E(!1);
      return;
    }
    B(h);
  }, [e, $?.historyID, B, h]), Y(() => {
    if (!e || !R || R.id !== h || !qt(R.status))
      return;
    const c = window.setInterval(() => {
      B(R.id, !0);
    }, Cr);
    return () => window.clearInterval(c);
  }, [e, B, R, h]);
  const ce = oe(() => {
    je(Q), O(0), k.current = 0, le.current = 0, C(null), d(null), V(!1), se("");
  }, []), ge = oe(
    (c) => {
      if (c.historyID <= 0)
        return;
      const x = t.some((_) => _.id === c.historyID), N = (/* @__PURE__ */ new Date()).toISOString();
      le.current = c.historyID, d(c), O(c.historyID), k.current = c.historyID, C(null), r(
        (_) => st(_, [
          {
            id: c.historyID,
            runID: c.runID,
            requestID: c.requestID,
            title: c.title,
            titleSource: "auto",
            inputSummary: c.inputSummary,
            status: "running",
            error: "",
            createdAt: N,
            startedAt: N,
            finishedAt: ""
          }
        ])
      ), x || o((_) => _ + 1);
    },
    [t]
  ), be = oe(
    (c, x, N) => {
      c <= 0 || r(
        (_) => _.map(
          (X) => X.id === c && (X.status !== x || X.error !== N) ? { ...X, status: x, error: N } : X
        )
      );
    },
    []
  ), a = oe(() => {
    if (!e || le.current <= 0)
      return;
    je(Q), J("refresh");
    const c = e.refreshDelaysMs ?? Tr;
    Q.current = c.map(
      (x) => window.setTimeout(() => {
        J("refresh");
      }, x)
    );
  }, [e, J]), v = oe(() => {
    V(!0), e && J("refresh");
  }, [e, J]), y = oe(() => {
    V(!1);
  }, []), j = oe((c) => {
    const x = re.current.get(c) || null;
    O(c), k.current = c, C(x), z((N) => N + 1), E(!x), V(!1), se("");
  }, []), W = oe(() => {
    h > 0 && B(h, !0);
  }, [B, h]), ue = G(
    () => t.find((c) => c.id === h) || null,
    [t, h]
  );
  return {
    enabled: !!e,
    items: t,
    total: s,
    hasMore: u,
    selectedID: h,
    selectionRevision: P,
    selectedItem: ue,
    selectedDetail: R,
    liveRun: $,
    panelOpen: me,
    loading: fe,
    loadingMore: q,
    detailLoading: ye,
    listError: ne,
    detailError: ee,
    beginRun: ce,
    registerLiveRun: ge,
    syncLiveRun: be,
    finishLiveRun: a,
    openPanel: v,
    closePanel: y,
    selectHistory: j,
    loadMore: () => {
      J("append");
    },
    retryList: () => {
      J("initial");
    },
    retryDetail: W
  };
}
function St({
  controller: e,
  label: t
}) {
  return e.enabled ? /* @__PURE__ */ n(Ot, { label: "运行历史", children: /* @__PURE__ */ f(
    "button",
    {
      type: "button",
      className: "stream-power-history-trigger",
      "aria-label": "打开运行历史",
      onClick: e.openPanel,
      children: [
        /* @__PURE__ */ n(Ft, {}),
        t ? /* @__PURE__ */ n("span", { className: "stream-power-history-trigger-label", children: t }) : null,
        e.total > 0 ? /* @__PURE__ */ n("span", { className: "stream-power-history-trigger-count", children: e.total }) : null
      ]
    }
  ) }) : null;
}
function Er({
  controller: e
}) {
  return Y(() => {
    if (!e.panelOpen)
      return;
    const r = (s) => {
      s.key === "Escape" && e.closePanel();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e.closePanel, e.panelOpen]), !e.enabled || !e.panelOpen ? null : /* @__PURE__ */ n(
    "div",
    {
      className: "stream-power-history-layer",
      role: "presentation",
      onMouseDown: (r) => {
        r.target === r.currentTarget && e.closePanel();
      },
      children: /* @__PURE__ */ f("aside", { className: "stream-power-history-panel", "aria-label": "工具运行历史", children: [
        /* @__PURE__ */ f("header", { className: "stream-power-history-header", children: [
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ n("strong", { children: "运行历史" }),
            /* @__PURE__ */ n("small", { children: e.total ? `共 ${e.total} 条` : "暂无记录" })
          ] }),
          /* @__PURE__ */ n(Ot, { label: "关闭", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "关闭运行历史",
              onClick: e.closePanel,
              children: /* @__PURE__ */ n(Tt, {})
            }
          ) })
        ] }),
        /* @__PURE__ */ n("div", { className: "stream-power-history-list", children: e.loading && e.items.length === 0 ? /* @__PURE__ */ n(
          nt,
          {
            icon: /* @__PURE__ */ n(ke, { className: "animate-spin" }),
            text: "读取历史"
          }
        ) : e.listError && e.items.length === 0 ? /* @__PURE__ */ n(
          nt,
          {
            icon: /* @__PURE__ */ n(Dr, {}),
            text: e.listError,
            action: "重试",
            onAction: e.retryList
          }
        ) : e.items.length === 0 ? /* @__PURE__ */ n(nt, { icon: /* @__PURE__ */ n(Ft, {}), text: "还没有运行记录" }) : e.items.map((r) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "stream-power-history-item",
            "data-active": e.selectedID === r.id,
            onClick: () => e.selectHistory(r.id),
            children: [
              /* @__PURE__ */ n("span", { className: "stream-power-history-item-title", children: r.title || "未命名运行" }),
              r.inputSummary ? /* @__PURE__ */ n("span", { className: "stream-power-history-item-summary", children: r.inputSummary }) : null,
              /* @__PURE__ */ f("span", { className: "stream-power-history-item-meta", children: [
                /* @__PURE__ */ n("i", { "data-status": r.status }),
                /* @__PURE__ */ n("span", { children: $t(r.status) }),
                /* @__PURE__ */ n("time", { children: $r(r.createdAt) })
              ] })
            ]
          },
          r.id
        )) }),
        e.items.length > 0 && e.hasMore ? /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            className: "stream-power-history-more",
            disabled: e.loadingMore,
            onClick: e.loadMore,
            children: [
              e.loadingMore ? /* @__PURE__ */ n(ke, { className: "animate-spin" }) : null,
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
  onAction: s
}) {
  return /* @__PURE__ */ f("div", { className: "stream-power-history-state", children: [
    e,
    /* @__PURE__ */ n("span", { children: t }),
    r && s ? /* @__PURE__ */ n("button", { type: "button", onClick: s, children: r }) : null
  ] });
}
function $t(e) {
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
function qt(e) {
  return e === "pending" || e === "running" || e === "waiting";
}
function st(e, t) {
  const r = /* @__PURE__ */ new Map();
  return e.forEach((s) => r.set(s.id, s)), t.forEach((s) => {
    const o = r.get(s.id);
    r.set(s.id, o ? { ...o, ...s } : s);
  }), [...r.values()].sort((s, o) => o.id - s.id);
}
function Lr(e, t) {
  for (e.delete(t.id), e.set(t.id, t); e.size > Or; ) {
    const r = e.keys().next().value;
    if (typeof r != "number")
      return;
    e.delete(r);
  }
}
function $r(e) {
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
function Pt(e, t) {
  return e instanceof Error && e.message ? e.message : t;
}
function je(e) {
  e.current.forEach((t) => window.clearTimeout(t)), e.current = [];
}
const Ht = _t.request;
function qr({
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
      loadPage: (u) => Hr(t, s, u),
      loadDetail: (u) => Br(r, s, u)
    };
}
async function Hr(e, t, r, s = 20) {
  const o = await Ht(e, "get", {
    ...t,
    before_id: r || void 0,
    limit: s
  }), u = jt(o, "读取工具历史失败");
  return {
    items: Vr(u.items).map(Bt).filter((p) => p.id > 0),
    total: Ur(u.total),
    hasMore: !!u.has_more,
    beforeID: Fe(u.before_id)
  };
}
async function Br(e, t, r) {
  const s = await Ht(e, "get", {
    ...t,
    history_id: r
  }), o = jt(s, "读取工具历史详情失败"), u = Bt(o.history);
  if (!u.id)
    throw new Error("工具历史详情为空");
  const p = Te(o.history);
  return {
    ...u,
    input: Te(p.input),
    output: jr(p.output),
    targetAssetID: Fe(p.target_asset_id),
    sourceTargetID: Fe(p.source_target_id)
  };
}
function Bt(e) {
  const t = Te(e);
  return {
    id: Fe(t.id),
    runID: Fe(t.run_id),
    requestID: de(t.request_id),
    title: de(t.title) || "未命名运行",
    titleSource: zr(t.title_source),
    inputSummary: de(t.input_summary),
    status: de(t.status) || "unavailable",
    error: de(t.error),
    createdAt: de(t.created_at),
    startedAt: de(t.started_at),
    finishedAt: de(t.finished_at)
  };
}
function jr(e) {
  return zt(e) ? e : null;
}
function zr(e) {
  const t = de(e);
  return t === "llm" || t === "manual" ? t : "auto";
}
function jt(e, t) {
  const r = Te(e);
  if (Number(r.code) !== 0 && Number(r.status) !== 1)
    throw new Error(de(r.message || r.msg) || t);
  return Te(r.data);
}
function Vr(e) {
  return Array.isArray(e) ? e : [];
}
function Te(e) {
  return zt(e) ? e : {};
}
function zt(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Fe(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function Ur(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function de(e) {
  return e == null ? "" : String(e).trim();
}
const Jr = lr.EnergonContentView, Vt = dr.Button, Kr = mr.SearchableOptionPicker, Yr = _t.request, Gr = Mt.runRuntimeStream, Qr = Mt.stopRuntimeStream, te = fr.streamValueText, Wr = pr.getStoreValueByPath, Rt = Ee.isEmptyRuntimeOutput, Ne = Ee.isPlainRecord, Xr = Ee.normalizeRuntimeFrameOutput, Zr = Ee.resolveRuntimeFrameCancelable, Dt = Ee.runtimeErrorMessage, en = at.useUploadRuleMetas, tn = K.PowerParamPopover, rn = K.PowerParamField, nn = K.buildDefaultParamValues, sn = K.buildRequestInput, on = K.filterActivePowerParams, Ie = K.inputKeyForParam, an = K.isHiddenParam, ln = K.isMainParam, cn = K.isSelectedOptionValue, Nt = K.isToolbarParam, un = K.normalizePowerParamConfig, dn = K.paramFilesRequestValue, mn = K.shouldDisplayPowerParam, fn = K.validateMainParams, pn = we.StreamTimingBadge, gn = we.cancelStreamTiming, hn = we.createStreamTiming, It = we.finishStreamTiming, yn = we.isStreamTimingStatusOutput, bn = we.markStreamTimingStopping, wn = we.updateStreamTimingFromOutput, vn = we.useStreamClock, Ut = Ue(
  "@/components/reference-composer"
).ReferenceEditor, Sn = Ue(
  "@/components/agent/stream-request-params"
).isPromptParam, ze = 2, kt = {
  text: "",
  reasoning: "",
  liveOutput: null,
  finalOutput: null
};
function Pn({ item: e, store: t }) {
  const r = ar(
    t,
    () => te(Wr(t, String(e.meta?.powerPath || "")))
  ), s = String(e.meta?.historyApi || ""), o = String(e.meta?.historyDetailApi || ""), u = G(
    () => r ? qr({
      scopeKey: `admin-power:${s}:${o}:${r}`,
      listApi: s,
      detailApi: o,
      scope: { power: r }
    }) : void 0,
    [s, o, r]
  );
  return /* @__PURE__ */ n(
    Jt,
    {
      powerKey: r,
      requestApi: String(e.meta?.requestApi || "/bot/admin/energon/request"),
      paramApi: String(e.meta?.paramApi || "/bot/admin/energon/power_params"),
      streamApi: String(e.meta?.streamApi || "/bot/admin/energon/stream"),
      stopApi: String(e.meta?.stopApi || "/bot/admin/energon/stream_stop"),
      blockMs: Number(e.meta?.blockMs || 1e3),
      history: u
    }
  );
}
function Jt({
  powerKey: e,
  requestApi: t,
  paramApi: r,
  streamApi: s,
  stopApi: o,
  blockMs: u = 1e3,
  requestScope: p,
  paramScope: h = p,
  height: O = "min(60vh, 600px)",
  resultTitle: P = "测试结果",
  formHeader: z,
  renderResultActions: R,
  referenceProviders: C = [],
  assetReferenceTeamID: $ = 0,
  appearance: d = "default",
  uploadBizKey: me,
  uploadBizName: V,
  allowResourceLibrary: fe = !0,
  onUploadedFiles: ae,
  history: q
}) {
  const [H, ye] = m(""), [E, ne] = m("0-0"), [A, ee] = m(!1), [se, re] = m(!1), [L, T] = m(!1), [D, k] = m(""), [le, pe] = m(!1), [Q, B] = m(kt), [J, ce] = m(), [ge, be] = m(!1), [a, v] = m([]), [y, j] = m([]), [W, ue] = m(1), [c, x] = m({ power: "", id: "" }), [N, _] = m({}), [X, F] = m({}), [Z, Re] = m({}), [Je, Yt] = m(0), [Gt, Ke] = m(!1), [xe, Le] = m("input"), ve = U(0), Ae = U(null), Ye = U({}), _e = U(""), Ge = U(""), $e = U(null), qe = U(null), Qe = U(!0), g = Fr(q), Me = g.liveRun?.historyID || 0, I = !g.enabled || g.selectedID === 0 || g.selectedID === Me, he = c.power === e ? c.id : "", He = oe(
    (i, l) => {
      const b = On(i, l);
      _(b.values), F(b.files), Re(b.referenceContents), Yt((S) => S + 1);
    },
    []
  );
  Y(() => {
    x({ power: "", id: "" }), _e.current = "", Ge.current = "";
  }, [q?.scopeKey, e]);
  const De = G(
    () => on(a, N),
    [N, a]
  ), lt = G(
    () => De.filter(
      (i) => mn(i, a)
    ),
    [De, a]
  ), Qt = G(
    () => De.map((i) => Number(i.upload_rule_id || 0)).filter((i) => Number.isFinite(i) && i > 0),
    [De]
  ), Wt = en(Qt), ct = G(
    () => lt.filter(
      (i) => !an(i) && (ln(i) || Nt(i))
    ),
    [lt]
  ), ut = G(
    () => Dn(De),
    [De]
  ), We = a.length > 0, Xt = G(
    () => y.map((i) => ({
      id: i.id,
      value: d === "body" ? te(i.service_name) || "未命名服务" : i.name
    })),
    [d, y]
  ), dt = W !== ze || he.length > 0, Zt = vn(J?.status === "running"), Xe = d === "body" && $ > 0 ? (i) => /* @__PURE__ */ n(Ir, { ...i, teamID: $ }) : void 0, er = G(
    () => We && dt && !A && !ge && e.length > 0,
    [We, ge, e, A, dt]
  );
  Y(() => () => {
    ve.current += 1, Ae.current?.abort(), At($e);
  }, []), Y(() => {
    Le("input");
  }, [e]), Y(() => {
    let i = !1;
    if (v([]), j([]), _({}), F({}), Re({}), Ye.current = {}, _e.current = "", k(""), pe(!1), !e)
      return ue(1), be(!1), () => {
        i = !0;
      };
    async function l() {
      be(!0);
      const b = await Yr(r, "get", {
        ...h,
        power: e,
        include_sources: 1,
        source_target_id: he
      });
      if (i)
        return;
      if (b.code !== 0 && b.status !== 1) {
        be(!1), k(b.message || b.msg || "读取能力参数失败。");
        return;
      }
      const S = Ne(b.data) ? b.data : {}, w = un(b.data), M = w.params, Pe = Ne(S.initial_input) ? S.initial_input : {};
      ue(w.sourceRule), j(w.sources), w.selectedSourceID && w.selectedSourceID !== he && x({ power: e, id: w.selectedSourceID }), _e.current = "", v(M), He(M, Pe), be(!1);
    }
    return l(), () => {
      i = !0;
    };
  }, [he, He, r, h, e]), Y(() => {
    if (!I)
      return;
    const i = qe.current;
    if (!i || !Qe.current)
      return;
    it(i);
    const l = window.setTimeout(() => it(i), 0);
    return () => {
      window.clearTimeout(l);
    };
  }, [Q, A, I]), Y(() => {
    const i = qe.current;
    if (i) {
      if (I) {
        it(i);
        return;
      }
      i.scrollTop = 0;
    }
  }, [g.selectedID, I]);
  const tr = () => {
    const i = qe.current;
    i && (Qe.current = xn(i));
  }, mt = async () => {
    if (!(!H || !se || L)) {
      T(!0), k(""), ce((i) => bn(i)), Ae.current?.abort();
      try {
        await Qr(H, o), ve.current += 1, ee(!1), re(!1), ce((i) => gn(i)), g.finishLiveRun();
      } catch (i) {
        k(Dt(i, "停止任务失败。"));
      } finally {
        T(!1);
      }
    }
  }, rr = async () => {
    if (!e) {
      k("未选择能力。");
      return;
    }
    const i = fn(a, N);
    if (i) {
      k(i);
      return;
    }
    const l = Nn(
      Z,
      ut
    );
    if (l) {
      k(l);
      return;
    }
    const b = ve.current + 1;
    ve.current = b, g.beginRun(), d === "body" && Le("result"), ee(!0), k(""), pe(!1), B(kt), ce(hn("正在连接模型")), ye(""), Ke(!1), ne("0-0"), re(!1), T(!1), Qe.current = !0;
    const S = new AbortController();
    Ae.current = S;
    try {
      const w = sn(a, N);
      Object.keys(Z).length > 0 && (w._reference_contents = Z), Ye.current = { ...w };
      const M = {
        ...p,
        power: e,
        input: w,
        params_complete: !0,
        history: [],
        options: {
          stream: !0
        }
      };
      W === ze && he && (M.source_target_id = he), await Gr({
        requestApi: t,
        streamApi: s,
        stopApi: o,
        stopOnAbort: !1,
        body: M,
        blockMs: u,
        signal: S.signal,
        onRequestID: ye,
        onFrame: (Pe) => {
          if (ve.current !== b || S.signal.aborted)
            return;
          const yt = te(Pe?.stream_id);
          yt && ne(yt), nr(Pe);
        }
      });
    } catch (w) {
      ve.current === b && (k(Dt(w, "测试失败。")), ce((M) => It(M, "failed")), g.finishLiveRun());
    } finally {
      ve.current === b && ee(!1), Ae.current === S && (Ae.current = null);
    }
  }, nr = (i) => {
    const l = Xr(i?.output, i);
    if (Rt(l) && i.type !== "result")
      return;
    const b = Zr(i);
    b != null && re(b);
    const S = te(l.event).toLowerCase();
    if (S === "start") {
      const w = l, M = Ne(w.meta) ? w.meta : {}, Pe = Ve(M.history_id);
      Pe > 0 && g.registerLiveRun({
        historyID: Pe,
        runID: Ve(M.run_id),
        requestID: te(i?.request_id),
        title: te(M.history_title) || "未命名运行",
        inputSummary: te(M.history_input_summary),
        input: { ...Ye.current },
        targetAssetID: Ve(M.target_asset_id),
        sourceTargetID: Ve(M.source_target_id)
      });
    }
    yn(l) && ce((w) => wn(w, l)), i.type === "result" && (pe(Number(i.status) === 2), ce(
      (w) => It(
        w,
        Number(i.status) === 2 ? "failed" : "done"
      )
    ), g.finishLiveRun()), B((w) => {
      if (te(l.event).toLowerCase() === "control")
        return w;
      if (i.type === "result")
        return {
          ...w,
          finalOutput: Rt(l) ? { text: w.text || te(i?.msg) } : l
        };
      const M = {
        text: w.text,
        reasoning: w.reasoning,
        liveOutput: w.liveOutput,
        finalOutput: w.finalOutput
      };
      return S === "audio_ready" && (M.liveOutput = l), (S === "delta" || !S && l.text) && (M.text += te(l.text)), (S === "reasoning" || l.reasoning) && (M.reasoning += te(l.reasoning || l.text)), M;
    });
  }, ft = (i, l) => {
    const b = Ie(i);
    b && _((S) => ({
      ...S,
      [b]: l
    }));
  }, sr = (i, l) => {
    const b = Ie(i);
    b && (F((S) => ({
      ...S,
      [b]: l
    })), _((S) => ({
      ...S,
      [b]: dn(i, l)
    })));
  }, ir = async () => {
    const i = H.trim();
    if (i)
      try {
        await gr(i), Ke(!0), At($e), $e.current = window.setTimeout(() => {
          Ke(!1), $e.current = null;
        }, 1200);
      } catch {
        k("复制 RequestID 失败。");
      }
  }, Ze = !!(H && Q.finalOutput && !A && !le && !D), or = In({
    running: A,
    stopping: L,
    failed: !!(D || le),
    canceled: J?.status === "canceled",
    successful: Ze
  }), et = kn({
    running: A,
    stopping: L,
    failed: !!(D || le),
    canceled: J?.status === "canceled",
    successful: Ze
  });
  Y(() => {
    Me > 0 && g.syncLiveRun(Me, et, D);
  }, [D, g.syncLiveRun, Me, et]);
  const ie = I ? null : g.selectedDetail, tt = I ? g.liveRun?.input : ie?.input, Oe = I ? g.liveRun?.sourceTargetID || 0 : ie?.sourceTargetID || 0;
  Y(() => {
    const i = g.selectedID;
    if (!g.enabled || i <= 0 || !tt || a.length === 0)
      return;
    const l = [
      q?.scopeKey || "",
      i,
      g.selectionRevision
    ].join(":");
    if (Ge.current !== l && (Ge.current = l, W === ze && Oe > 0 && y.some(
      (b) => b.id === String(Oe)
    ) && String(Oe) !== he)) {
      x({
        power: e,
        id: String(Oe)
      });
      return;
    }
    _e.current !== l && (_e.current = l, He(a, tt));
  }, [
    he,
    He,
    q?.scopeKey,
    g.enabled,
    g.selectedID,
    g.selectionRevision,
    e,
    a,
    y,
    tt,
    Oe,
    W
  ]);
  const Se = g.selectedItem, Be = I ? et : ie?.status || Se?.status || "pending", pt = I ? or : $t(Be), gt = I ? Q.finalOutput : ie?.output || null, rt = {
    historyID: I ? Me : ie?.id || Se?.id || 0,
    runID: I ? g.liveRun?.runID || 0 : ie?.runID || Se?.runID || 0,
    requestID: I ? H : ie?.requestID || Se?.requestID || "",
    title: I ? Se?.title || g.liveRun?.title || "" : ie?.title || Se?.title || "",
    targetAssetID: I ? g.liveRun?.targetAssetID || 0 : ie?.targetAssetID || 0,
    output: gt,
    running: I ? A : qt(Be),
    successful: I ? Ze : !!(ie && Be === "success"),
    status: Be,
    error: I ? D : ie?.error || Se?.error || ""
  }, ht = /* @__PURE__ */ f(ot, { children: [
    I && J ? /* @__PURE__ */ n("div", { className: "stream-power-timing mb-3", children: /* @__PURE__ */ n(pn, { timing: J, now: Zt }) }) : null,
    !I && g.detailError ? /* @__PURE__ */ f("div", { className: "stream-power-history-detail-error", children: [
      /* @__PURE__ */ n("span", { children: g.detailError }),
      /* @__PURE__ */ n("button", { type: "button", onClick: g.retryDetail, children: "重试" })
    ] }) : null,
    !I && !g.detailError && rt.error ? /* @__PURE__ */ n("div", { className: "stream-power-history-detail-error", children: /* @__PURE__ */ n("span", { children: rt.error }) }) : null,
    /* @__PURE__ */ n(
      Jr,
      {
        output: I ? An(Q) : gt,
        streaming: I && A && !Q.finalOutput,
        emptyText: !I && g.detailLoading ? "正在读取历史结果。" : d === "body" ? "生成结果会显示在这里。" : "AI 返回内容会显示在这里。",
        className: d === "body" ? "stream-power-content-view" : void 0,
        markdownClassName: d === "body" ? "stream-power-markdown" : void 0
      }
    )
  ] }), Ce = (d === "body" ? !!e : We) ? /* @__PURE__ */ f(ot, { children: [
    A ? /* @__PURE__ */ n(
      xt,
      {
        cancelable: se,
        stopping: L,
        onStop: mt
      }
    ) : null,
    d !== "body" ? /* @__PURE__ */ n(
      St,
      {
        controller: g,
        label: "历史"
      }
    ) : null,
    /* @__PURE__ */ f(
      Vt,
      {
        type: "button",
        size: "sm",
        className: "stream-power-generate-action",
        disabled: !er,
        onClick: () => {
          rr();
        },
        children: [
          A ? /* @__PURE__ */ n(ke, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ n(cr, { className: "mr-2 size-4" }),
          A ? "生成中..." : "生成"
        ]
      }
    )
  ] }) : null;
  return /* @__PURE__ */ f(
    "div",
    {
      "data-stream-power-appearance": d,
      "data-mobile-view": d === "body" ? xe : void 0,
      className: "stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden",
      style: { height: O },
      children: [
        d === "body" ? /* @__PURE__ */ f("div", { className: "stream-power-mobile-tabs", role: "tablist", "aria-label": "工具运行视图", children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": xe === "input",
              "data-active": xe === "input",
              onClick: () => Le("input"),
              children: "输入"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": xe === "result",
              "data-active": xe === "result",
              onClick: () => Le("result"),
              children: "结果"
            }
          )
        ] }) : null,
        /* @__PURE__ */ f("div", { className: "stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0", children: [
          z || d === "body" && Ce ? /* @__PURE__ */ f("div", { className: "stream-power-form-header shrink-0", children: [
            z ? /* @__PURE__ */ n("div", { className: "stream-power-form-header-content", children: z }) : null,
            d === "body" && Ce ? /* @__PURE__ */ n("div", { className: "stream-power-header-actions stream-power-run-actions", children: Ce }) : null
          ] }) : null,
          /* @__PURE__ */ f("div", { className: "stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3", children: [
            ge ? /* @__PURE__ */ f("span", { className: "stream-power-loading mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ n(ke, { className: "size-3 animate-spin" }),
              "读取参数"
            ] }) : null,
            W === ze && y.length > 0 ? /* @__PURE__ */ f("div", { className: "stream-power-source mb-3", children: [
              d === "body" ? /* @__PURE__ */ n("span", { className: "stream-power-source-label", children: "选择模型" }) : null,
              /* @__PURE__ */ n("div", { className: "stream-power-source-picker", children: /* @__PURE__ */ n(
                Kr,
                {
                  value: he || void 0,
                  options: Xt,
                  disabled: A || ge,
                  placeholder: d === "body" ? "请选择模型" : "请选择来源",
                  searchPlaceholder: d === "body" ? "搜索模型..." : void 0,
                  clearable: !1,
                  onChange: (i) => {
                    const l = Array.isArray(i) ? i[0] || "" : i;
                    x({ power: e, id: String(l || "") });
                  }
                }
              ) })
            ] }) : null,
            ct.length > 0 ? /* @__PURE__ */ n(
              "div",
              {
                className: "stream-power-param-list flex flex-wrap items-center gap-3",
                children: ct.map((i) => {
                  const l = Ie(i), b = {
                    param: i,
                    value: N[l],
                    files: X[l] || [],
                    uploadRuleMeta: Wt.get(
                      Number(i.upload_rule_id || 0)
                    ),
                    disabled: A,
                    uploadBizKey: me,
                    uploadBizName: V,
                    allowResourceLibrary: fe,
                    fileLibraryOnly: !!Xe,
                    fileLibraryLabel: Xe ? "添加" : void 0,
                    renderFileLibrary: Xe,
                    onUploadedFiles: ae,
                    onChange: (S) => ft(i, S),
                    onFilesChange: (S) => sr(i, S)
                  };
                  return Nt(i) ? /* @__PURE__ */ n(
                    tn,
                    {
                      ...b
                    },
                    `${i.id}-${l}`
                  ) : Sn?.(i) && Ut && ($ > 0 || C.length > 0) ? /* @__PURE__ */ n(
                    "div",
                    {
                      className: "stream-power-main-param",
                      children: /* @__PURE__ */ n(
                        Rn,
                        {
                          param: i,
                          value: String(N[l] || ""),
                          content: Z[l],
                          providers: C,
                          assetReferenceTeamID: $,
                          usageOptions: ut,
                          disabled: A,
                          onChange: (S, w) => {
                            ft(i, S), Re((M) => ({
                              ...M,
                              [l]: w
                            }));
                          }
                        }
                      )
                    },
                    `${i.id}-${l}`
                  ) : /* @__PURE__ */ n(
                    "div",
                    {
                      className: "stream-power-main-param stream-power-param-field",
                      children: /* @__PURE__ */ n(rn, { ...b })
                    },
                    `${i.id}-${l}`
                  );
                })
              },
              `params-${Je}`
            ) : ge ? null : /* @__PURE__ */ n("div", { className: "stream-power-empty rounded-lg px-3 py-8 text-center text-sm text-muted-foreground", children: "暂无参数配置。" }),
            D ? /* @__PURE__ */ n("div", { className: "stream-power-error mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: D }) : null
          ] }),
          d !== "body" && Ce ? /* @__PURE__ */ n("div", { className: "stream-power-actions stream-power-run-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3", children: Ce }) : null
        ] }),
        /* @__PURE__ */ n("div", { className: "stream-power-divider hidden w-px shrink-0 bg-border md:block", "aria-hidden": "true" }),
        /* @__PURE__ */ f("div", { className: "stream-power-result relative flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0", children: [
          /* @__PURE__ */ f("div", { className: "stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2", children: [
            d === "body" ? /* @__PURE__ */ f("div", { className: "stream-power-result-heading", children: [
              /* @__PURE__ */ n("span", { children: P }),
              /* @__PURE__ */ n("small", { "data-status": pt, children: pt })
            ] }) : /* @__PURE__ */ n("span", { className: "text-sm font-medium text-foreground", children: P }),
            /* @__PURE__ */ f("div", { className: "stream-power-result-actions flex min-w-0 items-center justify-end gap-2", children: [
              d === "body" && A ? /* @__PURE__ */ n(
                xt,
                {
                  className: "stream-power-mobile-stop",
                  cancelable: se,
                  stopping: L,
                  onStop: mt
                }
              ) : null,
              R?.(rt),
              d === "body" ? /* @__PURE__ */ n(St, { controller: g }) : null,
              d !== "body" ? H ? /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "flex min-w-0 max-w-[70%] items-center justify-end rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  title: `双击复制完整 RequestID：${H}${E !== "0-0" ? ` / StreamID: ${E}` : ""}`,
                  onDoubleClick: () => {
                    ir();
                  },
                  children: [
                    /* @__PURE__ */ n("span", { className: "mr-1 shrink-0", children: "RequestID:" }),
                    /* @__PURE__ */ n("span", { className: "min-w-0 truncate font-mono", children: H }),
                    Gt ? /* @__PURE__ */ n("span", { className: "ml-2 shrink-0 text-primary", children: "已复制" }) : null
                  ]
                }
              ) : /* @__PURE__ */ n("span", { className: "text-xs text-muted-foreground", children: "暂无 RequestID" }) : null
            ] })
          ] }),
          /* @__PURE__ */ n(
            "div",
            {
              ref: qe,
              onScroll: tr,
              style: { scrollbarGutter: "stable" },
              className: "stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3",
              children: d === "body" ? /* @__PURE__ */ n("div", { className: "stream-power-result-content", children: ht }) : ht
            }
          ),
          /* @__PURE__ */ n(Er, { controller: g })
        ] })
      ]
    }
  );
}
function Rn({
  param: e,
  value: t,
  content: r,
  providers: s,
  assetReferenceTeamID: o,
  usageOptions: u,
  disabled: p,
  onChange: h
}) {
  const O = hr({
    teamID: o,
    allowedKinds: Kt(e)
  }), P = G(
    () => o > 0 ? [
      O,
      ...s.filter((R) => R.trigger !== "@")
    ] : s,
    [O, o, s]
  ), z = u.map(
    (R) => [
      R.key,
      R.label,
      R.maxFiles || 0,
      ...R.acceptedKinds || []
    ].join(":")
  ).join("|");
  return /* @__PURE__ */ f("div", { className: "stream-power-param-field stream-power-prompt-field space-y-2 rounded-xl bg-muted/30 p-3", children: [
    /* @__PURE__ */ f("div", { className: "stream-power-prompt-heading", children: [
      /* @__PURE__ */ f("span", { className: "text-sm font-medium text-foreground", children: [
        e.name,
        e.required ? /* @__PURE__ */ n("span", { className: "ml-0.5 text-destructive", children: "*" }) : null
      ] }),
      /* @__PURE__ */ n("small", { children: "输入 @ 引用资产" })
    ] }),
    /* @__PURE__ */ n(
      Ut,
      {
        value: t,
        content: r,
        references: [],
        placeholder: e.placeholder || `请输入${e.name}`,
        disabled: p,
        providers: P,
        usageOptions: u,
        showMediaAliases: !0,
        allowMultiMediaSelection: !0,
        onChange: h
      },
      z
    )
  ] });
}
function Dn(e) {
  return e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = Ie(t);
    return r ? [
      {
        key: r,
        label: String(t.name || r),
        acceptedKinds: Kt(t),
        maxFiles: t.type === "files" ? Math.max(0, Number(t.max_files || 0)) : 1
      }
    ] : [];
  });
}
function Kt(e) {
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
function Nn(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const s of Object.values(e))
    for (const o of s.parts || []) {
      if (o.type !== "reference" || o.ref_type !== "asset")
        continue;
      const u = String(o.usage || "").trim(), p = u ? t.find(($) => $.key === u) : t.length === 1 ? t[0] : void 0;
      if (!p) {
        if (u)
          return `“${o.label || "引用素材"}”的素材用途与当前能力参数不兼容。`;
        if (t.length > 1)
          return `请为“${o.label || "引用素材"}”选择素材用途。`;
        continue;
      }
      const h = Array.isArray(o.ref_media_items) ? o.ref_media_items.filter(
        ($) => !!String($?.url || "").trim() || Number($?.index || 0) > 0
      ) : [], O = !!(String(o.ref_media_url || "").trim() || Number(o.ref_media_index || 0) > 0), P = Math.max(1, Number(o.ref_media_count || 0)), z = h.length ? h.length : O ? 1 : P, R = Math.max(0, Number(p.maxFiles || 0)), C = r.get(p.key) || 0;
      if (R > 0 && C + z > R)
        return !O && h.length === 0 && P > 1 ? `“${o.label || "引用素材"}”包含 ${P} 项素材，请从引用中选择具体素材。` : `${p.label}参数最多接收 ${R} 个素材。`;
      r.set(p.key, C + z);
    }
  return "";
}
function xt({
  cancelable: e,
  stopping: t,
  className: r,
  onStop: s
}) {
  return /* @__PURE__ */ f(
    Vt,
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
        t ? /* @__PURE__ */ n(ke, { className: "mr-2 size-3.5 animate-spin" }) : /* @__PURE__ */ n(ur, { className: "mr-2 size-3.5" }),
        e ? "停止" : "不可停止"
      ]
    }
  );
}
function In({
  running: e,
  stopping: t,
  failed: r,
  canceled: s,
  successful: o
}) {
  return t ? "正在停止" : e ? "生成中" : r ? "生成失败" : s ? "已停止" : o ? "已完成" : "等待生成";
}
function kn({
  running: e,
  stopping: t,
  failed: r,
  canceled: s,
  successful: o
}) {
  return t || e ? "running" : r ? "fail" : s ? "canceled" : o ? "success" : "pending";
}
function xn(e) {
  return e.scrollHeight - e.scrollTop - e.clientHeight <= 24;
}
function it(e) {
  e.scrollTop = e.scrollHeight;
}
function An(e) {
  if (e.finalOutput)
    return e.finalOutput;
  const t = [];
  return e.liveOutput && t.push(e.liveOutput), e.reasoning && t.push({ event: "reasoning", reasoning: e.reasoning }), e.text && t.push({ text: e.text }), t;
}
function At(e) {
  e.current != null && (window.clearTimeout(e.current), e.current = null);
}
function Ve(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? t : 0;
}
function _n(e, t, r) {
  let s = t;
  for (const o of e) {
    const u = Ie(o);
    if (!u || !Object.prototype.hasOwnProperty.call(r, u))
      continue;
    const p = Cn(r[u]);
    Mn(o, p) && (Object.is(s[u], p) || (s === t && (s = { ...t }), s[u] = p));
  }
  return s;
}
function Mn(e, t) {
  const r = e.options || [];
  if (e.type !== "option" || r.length === 0)
    return !0;
  const s = te(t);
  return s.length > 0 && r.some(
    (o) => cn(o, [s], r)
  );
}
function On(e, t) {
  return {
    values: _n(e, nn(e), t),
    files: Fn(e, t),
    referenceContents: Tn(t)
  };
}
function Cn(e) {
  return Array.isArray(e) ? [...e] : Ne(e) ? { ...e } : e;
}
function Tn(e) {
  const t = Ne(e._reference_contents) ? e._reference_contents : {}, r = {};
  for (const [s, o] of Object.entries(t))
    Ne(o) && (r[s] = o);
  return r;
}
function Fn(e, t) {
  const r = {};
  for (const s of e) {
    if (s.type !== "file" && s.type !== "files")
      continue;
    const o = Ie(s);
    if (!o || !Object.prototype.hasOwnProperty.call(t, o))
      continue;
    const u = En(t[o]), p = s.type === "files" ? u : u.slice(0, 1);
    p.length !== 0 && (r[o] = p.map((h, O) => {
      const P = (s.accepted_kinds || s.asset_kinds)?.[0];
      return {
        id: `replay:${o}:${O}`,
        name: Ln(h, O),
        kind: P,
        url: h,
        thumbnail: P === "image" ? h : void 0
      };
    }));
  }
  return r;
}
function En(e) {
  return (Array.isArray(e) ? e : [e]).map((r) => te(r)).filter((r) => r.length > 0);
}
function Ln(e, t) {
  const s = (e.split(/[?#]/, 1)[0] || "").split("/").pop() || "";
  if (s)
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  return `历史文件 ${t + 1}`;
}
const ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShowStreamRequest: Pn,
  StreamPowerRunner: Jt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Jt as S,
  Hr as a,
  as as b,
  Br as l,
  ls as s
};
