import { r as Ar, j as n, a as l, c as Rr, i as cr, d as Mr, F as sr } from "./react-5Z-wsVEn.js";
import { q as Pr, t as Er, n as Tr, v as nr, w as qr, x as de, y as Y, z as or, A as xr, B as _r, D as zr, E as Wr, F as Lr, G as Fr, S as Hr, o as ur } from "./writing-run-labels-BXHG45m8.js";
import { S as dr, a as d, b as k, d as ir, h as y, u as Ee } from "./file-kind-D6bMOzYN.js";
import { af as qe, r as fe, ag as Or, W as $r, k as Ur, a7 as Kr, a6 as Br, M as Gr, b as Yr, y as Jr, ah as Qr, A as Xr, w as Zr } from "./vendor-icons-fVDtJt66.js";
import { r as jr, B as et, t as rt, u as tt, d as st, m as nt, v as ot } from "./asset-preview-BZxHU4Mm.js";
import { r as O } from "./site-config-kAiWSd_3.js";
import { u as it, T as at } from "./text-content-save-actions-C7rwLAWt.js";
import { i as ct, j as ut, k as dt, l as lt, m as ar } from "./space-ordered-list-CBeUyd80.js";
import { P as ft } from "./power-icon-CSEV3sD6.js";
import { u as mt } from "./asset-reference-provider-Bz7yn1Di.js";
import { C as pt } from "./space-reference-provider-context-DMWNuQBI.js";
import { d as xe, a as _e } from "./preloadable-CT3tMmBD.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-DY0zHnl-.css", import.meta.url).href]);
function vt({
  node: e,
  contentLabel: u,
  titleStatus: v,
  versionSelect: s,
  updatedAt: M,
  status: N,
  readonly: _,
  actions: J,
  downloadUrl: Q,
  onRetry: X,
  onClose: Z
}) {
  const C = e.type === "power" ? Ar(e.power, e.kind, e.outputType) : null, ne = C && C.outputName !== u ? `${C.outputName} · ${u}` : C?.outputName || u;
  return /* @__PURE__ */ n(
    jr,
    {
      icon: /* @__PURE__ */ n(ht, { node: e }),
      title: e.title || "节点详情",
      subtitle: ne,
      titleStatus: v,
      versionSelect: s,
      state: _ ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }) : N === "error" ? /* @__PURE__ */ n(et, { label: "重试保存", children: /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: X,
          children: [
            /* @__PURE__ */ n(qe, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ l("span", { className: `wb-detail-state is-${N}`, children: [
        N === "saving" ? /* @__PURE__ */ n(fe, { size: 12, className: "wb-detail-spin" }) : null,
        yt(N)
      ] }),
      updatedAt: M,
      actions: J,
      downloadUrl: Q,
      onClose: Z
    }
  );
}
function yt(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : "已保存";
}
function ht({ node: e }) {
  if (e.type === "power")
    return /* @__PURE__ */ n(
      ft,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const u = wt(e);
  return /* @__PURE__ */ n(u, { size: 16 });
}
function wt(e) {
  return e.type === "agent" ? Or : e.type === "flow" ? $r : e.type === "function" ? Ur : e.kind === "image" ? Kr : e.kind === "video" ? Br : e.kind === "audio" ? Gr : Yr;
}
function gt({
  versions: e,
  currentVersionId: u,
  selectedVersionId: v,
  total: s,
  hasMore: M,
  loading: N,
  loadingMore: _,
  error: J,
  onSelect: Q,
  onLoadMore: X,
  onRetry: Z
}) {
  return /* @__PURE__ */ n(
    tt,
    {
      options: e.map((C) => ({
        id: Number(C.id || 0),
        version: Number(C.version || 0),
        updatedAt: String(C.updated_at || C.created_at || ""),
        value: C
      })),
      currentVersionId: u,
      selectedVersionId: v,
      total: s,
      hasMore: M,
      loading: N,
      loadingMore: _,
      error: J,
      onSelect: Q,
      onLoadMore: X,
      onRetry: Z
    }
  );
}
function bt(e) {
  return rt(e);
}
function Ct({
  projectId: e,
  node: u
}) {
  const v = String(u.runError || "").trim(), { error: s, loading: M } = Pr(e, u), { summary: N, details: _ } = Er(s || v);
  return v ? /* @__PURE__ */ l("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ n(Jr, { size: 17 }),
    /* @__PURE__ */ l("div", { style: { minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ n("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ n("p", { children: N }),
      /* @__PURE__ */ l("details", { style: { marginTop: 6, fontSize: 11 }, children: [
        /* @__PURE__ */ n("summary", { style: { cursor: "pointer" }, children: "技术详情" }),
        /* @__PURE__ */ n(
          "pre",
          {
            style: {
              maxHeight: 240,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              fontSize: "inherit",
              margin: "6px 0 0"
            },
            children: _
          }
        )
      ] }),
      M ? /* @__PURE__ */ l("small", { children: [
        /* @__PURE__ */ n(fe, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const Dt = _e(
  () => import("./node-detail-editor-D8yjTxzY.js")
), Vt = xe(
  Dt,
  (e) => e.NodeDetailEditor
), St = Vt.Component, Nt = _e(
  () => import("./space-video-compose-view-BaTxAEdm.js")
), kt = xe(
  Nt,
  (e) => e.VideoComposeView
), It = kt.Component;
function At(e) {
  return Rr(
    e.node.power,
    e.node.kind,
    e.node.outputType
  ) ? Tr(
    ct(e.node, e.node.resultOutput)?.document
  ) ? /* @__PURE__ */ n(dr, { fallback: /* @__PURE__ */ n(ur, { label: "正在加载创作工作区" }), children: /* @__PURE__ */ n(
    Mt,
    {
      projectId: e.projectId,
      canvasId: e.node.asset?.canvas_id || 0,
      node: e.node,
      output: e.node.resultOutput,
      onAssetUpdated: e.onAssetUpdated,
      readonly: e.readonly,
      onClose: e.onClose
    },
    e.node.id
  ) }) : null : /* @__PURE__ */ n(Pt, { ...e });
}
const Rt = xe(
  _e(() => import("./writing-editor-B0lqiQwv.js")),
  (e) => e.WritingEditor
), Mt = Rt.Component;
function Pt({
  projectId: e,
  teamId: u,
  assetCateId: v,
  node: s,
  canvasReferenceItems: M,
  canvasNodes: N,
  connectedMediaReferences: _,
  storyboardFocus: J,
  storyboardInitialSectionId: Q,
  storyboardWorkspace: X,
  onNodeDraftChange: Z,
  onConnectedMediaEdgeRemove: C,
  onRunNode: ne,
  onAssetUpdated: ze,
  onConfirmStoryboard: me,
  onClose: pe,
  layer: lr
}) {
  const [fr, I] = d(""), We = mt({
    notificationMode: "inline",
    teamID: u,
    scopeProjectID: e,
    initialFilters: {
      sourceType: "project",
      projectID: e,
      assetCateID: v
    }
  }), g = Number(s.asset?.id || 0), ve = cr(
    s.power,
    s.kind,
    s.outputType
  ), ye = Mr(
    s.power,
    s.kind,
    s.outputType
  ), [he, we] = d(null), [mr, Le] = d(
    () => s.composerDraft?.videoComposition || nr()
  ), [Fe, He] = d(!1), [D, j] = d(s.asset), [Oe, $] = d(
    () => Te(s.asset)
  ), [pr, U] = d(Oe.length), [$e, Ue] = d(1), [ge, Ke] = d(!1), [Be, be] = d(g > 0), [Ce, Ge] = d(!1), [vr, De] = d(""), [z, K] = d(
    () => S(s.asset)
  ), [Ye, W] = d(
    null
  ), [Ve, Se] = d(!1), [Ne, L] = d(""), [F, Je] = d(!1), [P, ee] = d(""), [Qe, Xe] = d(!1), [Ze, oe] = d(!1), [yr, B] = d(0), w = k(D), f = k(z), re = k(ze), G = k(s), E = k(0), A = k(0), te = k(null), se = k(null), R = k(null), ke = k(!1);
  w.current = D, f.current = z, re.current = ze, G.current = s, ir(() => {
    if (!ye || !s.power?.id && !s.power?.key) {
      we(null);
      return;
    }
    let r = !1;
    return we(null), qr({
      projectId: e,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((t) => {
      r || we(t);
    }).catch((t) => {
      r || I(O(t, "加载分镜用途配置失败"));
    }), () => {
      r = !0;
    };
  }, [
    ye,
    s.composerDraft?.selectedTargetId,
    s.flow?.id,
    s.id,
    s.power?.id,
    s.power?.key,
    e
  ]);
  const ie = y(
    (r) => {
      const t = de(
        { ...r.asset, versions: r.versions },
        w.current || G.current.asset
      ), o = t.version, a = Y(
        o ? [o] : [],
        r.versions
      ), c = S(t);
      w.current = t, f.current = c, j(t), $(a), U(Math.max(r.versionTotal, a.length)), Ue(1), Ke(r.hasMore), K(c), W(null), L(""), B((m) => m + 1), re.current?.(t);
    },
    []
  ), ae = y(
    (r, t = !0) => {
      const o = de(
        r,
        w.current || G.current.asset
      ), a = S(o);
      w.current = o, f.current = a, j(o), K(a), $((c) => {
        const m = Y(
          o.version ? [o.version] : [],
          c
        );
        return U((p) => Math.max(p, m.length)), m;
      }), W(null), L(""), B((c) => c + 1), t && re.current?.(o);
    },
    []
  ), H = y(async () => {
    if (!g) {
      be(!1), De("");
      return;
    }
    const r = E.current + 1;
    E.current = r, be(!0), De("");
    try {
      const t = await or({ projectId: e, assetId: g });
      if (r !== E.current)
        return;
      ie(t);
    } catch (t) {
      if (r !== E.current)
        return;
      De(O(t, "读取版本记录失败"));
    } finally {
      r === E.current && be(!1);
    }
  }, [ie, g, e]);
  ir(() => {
    w.current = s.asset, j(s.asset), $(Te(s.asset)), U(Te(s.asset).length);
    const r = S(s.asset);
    return f.current = r, K(r), W(null), L(""), ee(""), se.current = null, B((t) => t + 1), Le(
      s.composerDraft?.videoComposition || nr()
    ), H(), () => {
      E.current += 1, A.current += 1;
    };
  }, [H, s.id]);
  const V = S(D), T = !z || z === V, q = T ? D?.version : Ye, je = Ee(
    () => ut(s, q, D?.kind),
    [q, D?.kind, s]
  ), h = !!(T && je.mode === "rich" && (D?.kind === "text" || D?.kind === "richtext")), ce = Ee(
    () => dt(s, q, {
      includeNodeResult: T
    }),
    [q, T, s]
  ), er = Ee(() => {
    const r = st(ce);
    return r.length === 1 ? r[0] : void 0;
  }, [ce]), hr = typeof q?.source?.prompt == "string" ? q.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), Ie = y(
    async (r, t = {}) => {
      const o = w.current, a = o?.version, c = S(o);
      if (!o?.id || !a?.id || f.current !== c)
        throw new Error("当前内容不可编辑");
      const m = await xr({
        projectId: e,
        assetId: o.id,
        versionId: a.id,
        expectedUpdatedAt: r.mode === "storyboard" || t.saveMode !== void 0 ? a.updated_at || a.created_at || "" : void 0,
        requestId: t.requestId,
        saveMode: t.saveMode,
        content: lt(r)
      }), p = de(
        m,
        o
      );
      p.version && (p.version = {
        ...p.version,
        summary: r.summary
      });
      const b = S(p);
      w.current = p, f.current = b, j(p), K(b), $(
        (Pe) => Y(
          Pe,
          p.version ? [p.version] : []
        )
      ), b && b !== c && U((Pe) => Pe + 1), re.current?.(p);
    },
    [e]
  ), i = it({
    value: je,
    resetKey: `${s.id}:${z}:${yr}`,
    fingerprint: ar,
    save: (r) => Ie(
      r,
      h ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (r) => I(O(r, "保存失败")),
    autoSave: !h
  }), wr = y(async () => {
    await i.flush() && (R.current = null);
  }, [i.flush]), gr = y(async () => {
    const r = w.current, t = r?.version;
    if (!r?.id || !t?.id) {
      I("当前资产版本不可用");
      return;
    }
    const o = ar(i.draft), a = R.current?.versionId === t.id && R.current.fingerprint === o ? R.current : {
      versionId: t.id,
      fingerprint: o,
      requestId: le("manual-edit", t.id)
    };
    R.current = a, await i.flushWith(
      (m) => Ie(m, {
        saveMode: "create_version",
        requestId: a.requestId
      })
    ) && (R.current = null);
  }, [i.draft, i.flushWith, Ie]), ue = y(() => !h || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (R.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, h]), br = y(async () => {
    if (!(P || !me)) {
      ee("confirming");
      try {
        if (await i.flush()) {
          const r = E.current, t = A.current, o = G.current.id, a = f.current;
          me((c) => {
            r !== E.current || t !== A.current || o !== G.current.id || a !== f.current || ae(c, !1);
          });
        }
      } finally {
        ee("");
      }
    }
  }, [
    ae,
    i.flush,
    me,
    P
  ]), rr = y(async () => {
    if (P)
      return;
    const r = w.current, t = f.current;
    if (!r?.id || !t) {
      I("当前分镜版本不可用");
      return;
    }
    ee("revising");
    try {
      const o = se.current?.versionId === t ? se.current : {
        versionId: t,
        requestId: le("revision", t)
      };
      se.current = o;
      const a = await _r({
        projectId: e,
        assetId: r.id,
        versionId: t,
        requestId: o.requestId,
        nodeKey: s.id
      });
      ae(a), se.current = null, H();
    } catch (o) {
      I(O(o, "创建分镜修订稿失败"));
    } finally {
      ee("");
    }
  }, [
    ae,
    H,
    s.id,
    e,
    P
  ]), Cr = y(
    async (r, t, o) => {
      const a = w.current, c = G.current, m = S(a), p = Number(c.power?.id || 0), b = String(c.power?.key || "").trim();
      if (!a?.id || !m)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!p && !b)
        throw new Error("当前分镜节点未配置生成能力");
      return zr({
        projectId: e,
        assetId: a.id,
        versionId: m,
        flowId: Number(c.flow?.id || a.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || a.asset_cate_id || v
        ),
        requestId: le("shot", m),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: p,
        powerKey: b,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: r,
        shotId: t,
        instruction: o
      });
    },
    [v, e]
  ), Dr = y(async () => {
    if (f.current === V) {
      if (h) {
        if (!ue()) return;
      } else if (!await i.flush()) return;
    }
    await H();
  }, [
    V,
    ue,
    i.flush,
    h,
    H
  ]), Ae = y(
    async (r) => {
      if (!g || !r || r === V)
        return;
      const t = A.current + 1;
      A.current = t, Se(!0), L(""), W(null);
      try {
        const o = await Wr({
          projectId: e,
          assetId: g,
          versionId: r
        });
        if (t !== A.current || f.current !== r)
          return;
        W(o), B((a) => a + 1);
      } catch (o) {
        if (t !== A.current)
          return;
        L(O(o, "读取历史版本失败"));
      } finally {
        t === A.current && Se(!1);
      }
    },
    [g, V, e]
  ), tr = y(
    async (r) => {
      if (F)
        return;
      const t = Number(r.id || 0);
      if (!(!t || t === f.current)) {
        if (f.current === V) {
          if (h) {
            if (!ue()) return;
          } else if (!await i.flush()) return;
        }
        if (f.current = t, te.current = null, K(t), t === V) {
          A.current += 1, W(null), L(""), Se(!1), B((o) => o + 1);
          return;
        }
        await Ae(t);
      }
    },
    [
      V,
      ue,
      i.flush,
      h,
      Ae,
      F
    ]
  ), Vr = y(async () => {
    if (!(!g || !ge || Ce)) {
      Ge(!0);
      try {
        const r = await Lr({
          projectId: e,
          assetId: g,
          page: $e + 1
        });
        $((t) => Y(t, r.items)), Ue(r.page), U(r.total), Ke(r.hasMore);
      } catch (r) {
        I(O(r, "加载更多版本失败"));
      } finally {
        Ge(!1);
      }
    }
  }, [g, ge, e, Ce, $e]), Sr = y(async () => {
    const r = w.current, t = f.current;
    if (!(F || !r?.id || !t || t === S(r))) {
      Je(!0);
      try {
        const o = te.current?.versionId === t ? te.current : {
          versionId: t,
          requestId: le("restore", t)
        };
        te.current = o;
        const a = await Fr({
          projectId: e,
          assetId: r.id,
          versionId: t,
          requestId: o.requestId,
          nodeKey: s.id
        }), c = de(
          a,
          r
        );
        w.current = c, j(c), re.current?.(c);
        try {
          const m = await or({
            projectId: e,
            assetId: r.id
          });
          ie(m);
        } catch {
          const m = c.version;
          $(
            (b) => Y(m ? [m] : [], b)
          ), U((b) => b + 1);
          const p = S(c);
          f.current = p, K(p), W(null), L(""), B((b) => b + 1);
        }
        te.current = null;
      } catch (o) {
        I(O(o, "切换版本失败"));
      } finally {
        Je(!1);
      }
    }
  }, [ie, s.id, e, F]), Re = y(async () => {
    if (ke.current)
      return;
    if (h && i.hasPendingChanges) {
      oe(!0);
      return;
    }
    ke.current = !0, Xe(!0);
    let r = !0;
    const t = w.current;
    if (i.hasPendingChanges && t?.id && t?.version?.id && f.current === S(t) && (r = await i.flush()), !r) {
      ke.current = !1, Xe(!1), oe(!0);
      return;
    }
    pe();
  }, [i.flush, i.hasPendingChanges, h, pe]), x = i.draft, Nr = x.mode === "storyboard" && nt(x.value), Me = !T || !ve && (!D?.id || !D?.version?.id) || Nr, kr = Me || Qe || g > 0 && Be || ye && !he, Ir = !T && (Ve || Ne);
  return /* @__PURE__ */ l(
    ot,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      layer: lr,
      onRequestClose: Re,
      onEscape: () => {
        if (Ze) oe(!1);
        else return Re();
      },
      header: /* @__PURE__ */ n(
        vt,
        {
          node: s,
          contentLabel: Et(
            x,
            s,
            h ? void 0 : er
          ),
          versionSelect: g ? /* @__PURE__ */ n(
            gt,
            {
              versions: Oe,
              currentVersionId: V,
              selectedVersionId: z || V,
              total: pr,
              hasMore: ge,
              loading: Be,
              loadingMore: Ce,
              error: vr,
              onSelect: (r) => {
                tr(r);
              },
              onLoadMore: () => {
                Vr();
              },
              onRetry: () => {
                Dr();
              }
            }
          ) : void 0,
          updatedAt: bt(
            q?.updated_at || q?.created_at
          ),
          status: i.status,
          readonly: Me,
          actions: h && !Me ? /* @__PURE__ */ n(
            at,
            {
              status: i.status,
              hasPendingChanges: i.hasPendingChanges,
              onReset: () => {
                R.current = null, i.reset();
              },
              onSaveAsNewVersion: () => {
                gr();
              },
              onSave: () => {
                wr();
              }
            }
          ) : void 0,
          downloadUrl: x.downloadUrl,
          onRetry: () => {
            i.retry();
          },
          onClose: () => {
            Re();
          }
        }
      ),
      children: [
        /* @__PURE__ */ l("main", { className: "wb-detail-workspace", children: [
          T ? null : /* @__PURE__ */ l("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ n(Qr, { size: 14 }),
              "正在查看第 ",
              Ye?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    tr(
                      D?.version || { id: V }
                    );
                  },
                  children: [
                    /* @__PURE__ */ n(Xr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: F || !!P || Ve || !!Ne,
                  onClick: () => x.mode === "storyboard" ? void rr() : void Sr(),
                  children: [
                    F || P === "revising" ? /* @__PURE__ */ n(fe, { size: 13, className: "wb-detail-spin" }) : x.mode === "storyboard" ? /* @__PURE__ */ n(Zr, { size: 13 }) : /* @__PURE__ */ n(qe, { size: 13 }),
                    x.mode === "storyboard" ? P === "revising" ? "创建中" : "基于此版本创建修订稿" : F ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ n(
              Hr,
              {
                message: fr,
                onDismiss: () => I("")
              }
            ),
            /* @__PURE__ */ n(Ct, { projectId: e, node: s }),
            Ir ? /* @__PURE__ */ n("div", { className: "wb-detail-content-state", children: Ve ? /* @__PURE__ */ l(sr, { children: [
              /* @__PURE__ */ n(fe, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ n("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ l(sr, { children: [
              /* @__PURE__ */ n("span", { children: Ne }),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ae(z);
                  },
                  children: [
                    /* @__PURE__ */ n(qe, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ n(
              pt.Provider,
              {
                value: We,
                children: /* @__PURE__ */ n(
                  dr,
                  {
                    fallback: /* @__PURE__ */ n(
                      ur,
                      {
                        label: ve ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: ve ? /* @__PURE__ */ n(
                      It,
                      {
                        composition: mr,
                        referenceItems: M || [],
                        connectedMediaReferences: _,
                        readonly: !T || Qe || Fe,
                        running: Fe,
                        fullScreen: !0,
                        finalOutput: ce,
                        onChange: (r) => {
                          Le(r), Z?.({
                            ...s.composerDraft || {},
                            videoComposition: r
                          });
                        },
                        onConnectedMediaEdgeRemove: C,
                        onRun: ne ? (r) => {
                          He(!0), ne({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: r
                            }
                          }).then(() => g ? H() : void 0).catch(
                            (t) => I(
                              t instanceof Error ? t.message : "视频合成失败"
                            )
                          ).finally(() => He(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ n(
                      St,
                      {
                        content: x,
                        assetKind: D?.kind || s.kind,
                        mediaOutput: h ? void 0 : ce,
                        mediaKind: h ? void 0 : er,
                        mediaPrompt: hr,
                        readonly: kr,
                        referenceItems: M,
                        canvasNodes: N,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: J,
                        storyboardInitialSectionId: Q,
                        storyboardWorkspace: X,
                        storyboardWorkflowAction: P,
                        storyboardWorkTypes: he?.storyboard_work_types,
                        storyboardReferencePurposes: he?.storyboard_reference_purposes,
                        referenceProvider: We,
                        onConfirmStoryboard: br,
                        onCreateStoryboardRevision: rr,
                        onGenerateStoryboardShot: Cr,
                        onChange: i.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        Ze ? /* @__PURE__ */ n("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ l(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ n("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ n("p", { children: h ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => oe(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    onClick: () => {
                      R.current = null, i.reset(), pe();
                    },
                    children: "放弃修改"
                  }
                )
              ] })
            ]
          }
        ) }) : null
      ]
    }
  );
}
function Te(e) {
  return Y(
    e?.version ? [e.version] : [],
    e?.versions || []
  );
}
function S(e) {
  return Number(e?.version_id || e?.version?.id || 0);
}
function Et(e, u, v) {
  return e.mode === "storyboard" ? "分镜脚本" : cr(u.power, u.kind, u.outputType) ? "视频合成" : v === "image" ? "图片内容" : v === "video" ? "视频内容" : v === "audio" ? "音频内容" : e.mode === "file" ? "文件" : u.kind === "image" || u.kind === "richtext" ? "图文内容" : u.kind === "video" ? "视频内容" : u.kind === "audio" ? "音频内容" : e.format === "markdown" ? "Markdown" : "富文本";
}
function le(e, u) {
  const v = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${u}-${v}`.slice(0, 64);
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailDialog: At
}, Symbol.toStringTag, { value: "Module" }));
export {
  vt as N,
  Kt as n
};
