import { j as o, a as m, e as Pe, c as Te, F as tr } from "./preloadable-BrN58FXf.js";
import { S as kr } from "./space-node-runtime-CxMQ_W2k.js";
import { S as cr, a as d, b as S, d as sr, h as p, u as Me } from "./file-kind-BSFhe2vU.js";
import { y as Ar, r as qe, af as Mr, A as Er, w as qr, ag as nr } from "./vendor-icons-UGaOWWu-.js";
import { d as Pr, e as Tr, b as xr, g as _r } from "./asset-preview-D6nljO8_.js";
import { r as W } from "./site-config-D0c23URW.js";
import { u as Lr, T as zr } from "./text-content-save-actions-DF1L6Tn3.js";
import { c as Wr, f as Fr, b as or, s as Hr, d as Or, g as Ur, e as $r, h as Kr, r as Br } from "./space-optional-components-C8EUHVoE.js";
import { a as Gr, b as Jr, m as oe, d as B } from "./writing-run-labels--5SZkRES.js";
import { b as Qr, d as Xr, s as Yr, e as ir } from "./space-reference-content-K_sxMShu.js";
import { f as ar, N as Zr } from "./node-detail-header-CD6P0SMz.js";
import { u as jr } from "./asset-reference-provider-DkAAvSU_.js";
import { C as et } from "./node-detail-storyboard-grid-DgcSbIw2.js";
import { e as rt, d as dr, f as tt, C as ur } from "./space-loading-FH4pJ97O.js";
import { c as st } from "./content-view-0gIO2Kkv.js";
import { b as nt } from "./writing-document-YwPtpDvk.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-C4MRlvC-.css", import.meta.url).href]);
function ot({
  versions: t,
  currentVersionId: v,
  selectedVersionId: h,
  total: s,
  hasMore: F,
  loading: G,
  loadingMore: J,
  error: ae,
  onSelect: ce,
  onLoadMore: de,
  onRetry: ue
}) {
  return /* @__PURE__ */ o(
    Tr,
    {
      options: t.map((P) => ({
        id: Number(P.id || 0),
        version: Number(P.version || 0),
        updatedAt: String(P.updated_at || P.created_at || ""),
        value: P
      })),
      currentVersionId: v,
      selectedVersionId: h,
      total: s,
      hasMore: F,
      loading: G,
      loadingMore: J,
      error: ae,
      onSelect: ce,
      onLoadMore: de,
      onRetry: ue
    }
  );
}
function it(t) {
  return Pr(t);
}
function at({
  projectId: t,
  node: v
}) {
  const h = String(v.runError || "").trim(), { error: s, loading: F } = Gr(t, v), { summary: G, details: J } = Jr(s || h);
  return h ? /* @__PURE__ */ m("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ o(Ar, { size: 17 }),
    /* @__PURE__ */ m("div", { style: { minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ o("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ o("p", { children: G }),
      /* @__PURE__ */ m("details", { style: { marginTop: 6, fontSize: 11 }, children: [
        /* @__PURE__ */ o("summary", { style: { cursor: "pointer" }, children: "技术详情" }),
        /* @__PURE__ */ o(
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
            children: J
          }
        )
      ] }),
      F ? /* @__PURE__ */ m("small", { children: [
        /* @__PURE__ */ o(qe, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const ct = Te(
  () => import("./node-detail-editor-C9E7dT5m.js")
), dt = Pe(
  ct,
  (t) => t.NodeDetailEditor
), ut = dt.Component, lt = Te(
  () => import("./space-video-compose-view-CPjlzUmQ.js")
), ft = Pe(
  lt,
  (t) => t.VideoComposeView
), mt = ft.Component;
function Tt(t) {
  return rt(
    t.node.power,
    t.node.kind,
    t.node.outputType
  ) ? Wr(
    nt(t.node, t.node.resultOutput)?.document
  ) ? /* @__PURE__ */ o(cr, { fallback: /* @__PURE__ */ o(ur, { label: "正在加载创作工作区" }), children: /* @__PURE__ */ o(
    pt,
    {
      projectId: t.projectId,
      canvasId: t.node.asset?.canvas_id || 0,
      node: t.node,
      output: t.node.resultOutput,
      onAssetUpdated: t.onAssetUpdated,
      readonly: t.readonly,
      onClose: t.onClose
    },
    t.node.id
  ) }) : null : /* @__PURE__ */ o(yt, { ...t });
}
const vt = Pe(
  Te(() => import("./writing-editor-B_U2AR6p.js")),
  (t) => t.WritingEditor
), pt = vt.Component;
function yt({
  projectId: t,
  teamId: v,
  assetCateId: h,
  node: s,
  canvasReferenceItems: F,
  canvasNodes: G,
  connectedMediaReferences: J,
  storyboardFocus: ae,
  storyboardInitialSectionId: ce,
  storyboardWorkspace: de,
  onNodeDraftChange: ue,
  onConnectedMediaEdgeRemove: P,
  onRunNode: xe,
  onAssetUpdated: _e,
  onConfirmStoryboard: le,
  onClose: fe,
  layer: lr
}) {
  const [fr, N] = d(""), Le = jr({
    notificationMode: "inline",
    teamID: v,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: h
    }
  }), w = Number(s.asset?.id || 0), me = dr(
    s.power,
    s.kind,
    s.outputType
  ), ve = tt(
    s.power,
    s.kind,
    s.outputType
  ), [pe, ye] = d(null), [mr, ze] = d(
    () => s.composerDraft?.videoComposition || ar()
  ), [We, Fe] = d(!1), [C, Q] = d(s.asset), [He, H] = d(
    () => Ee(s.asset)
  ), [vr, O] = d(He.length), [Oe, Ue] = d(1), [he, $e] = d(!1), [Ke, ge] = d(w > 0), [we, Be] = d(!1), [pr, be] = d(""), [T, U] = d(
    () => D(s.asset)
  ), [Ge, x] = d(
    null
  ), [Ce, Ve] = d(!1), [De, _] = d(""), [L, Je] = d(!1), [k, X] = d(""), [Qe, Xe] = d(!1), [Ye, ee] = d(!1), [yr, $] = d(0), g = S(C), u = S(T), Y = S(_e), K = S(s), A = S(0), I = S(0), Z = S(null), j = S(null), R = S(null), Se = S(!1);
  g.current = C, u.current = T, Y.current = _e, K.current = s, sr(() => {
    if (!ve || !s.power?.id && !s.power?.key) {
      ye(null);
      return;
    }
    let e = !1;
    return ye(null), Fr({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || ye(r);
    }).catch((r) => {
      e || N(W(r, "加载分镜用途配置失败"));
    }), () => {
      e = !0;
    };
  }, [
    ve,
    s.composerDraft?.selectedTargetId,
    s.flow?.id,
    s.id,
    s.power?.id,
    s.power?.key,
    t
  ]);
  const re = p(
    (e) => {
      const r = oe(
        { ...e.asset, versions: e.versions },
        g.current || K.current.asset
      ), n = r.version, a = B(
        n ? [n] : [],
        e.versions
      ), c = D(r);
      g.current = r, u.current = c, Q(r), H(a), O(Math.max(e.versionTotal, a.length)), Ue(1), $e(e.hasMore), U(c), x(null), _(""), $((l) => l + 1), Y.current?.(r);
    },
    []
  ), te = p(
    (e, r = !0) => {
      const n = oe(
        e,
        g.current || K.current.asset
      ), a = D(n);
      g.current = n, u.current = a, Q(n), U(a), H((c) => {
        const l = B(
          n.version ? [n.version] : [],
          c
        );
        return O((f) => Math.max(f, l.length)), l;
      }), x(null), _(""), $((c) => c + 1), r && Y.current?.(n);
    },
    []
  ), z = p(async () => {
    if (!w) {
      ge(!1), be("");
      return;
    }
    const e = A.current + 1;
    A.current = e, ge(!0), be("");
    try {
      const r = await or({ projectId: t, assetId: w });
      if (e !== A.current)
        return;
      re(r);
    } catch (r) {
      if (e !== A.current)
        return;
      be(W(r, "读取版本记录失败"));
    } finally {
      e === A.current && ge(!1);
    }
  }, [re, w, t]);
  sr(() => {
    g.current = s.asset, Q(s.asset), H(Ee(s.asset)), O(Ee(s.asset).length);
    const e = D(s.asset);
    return u.current = e, U(e), x(null), _(""), X(""), j.current = null, $((r) => r + 1), ze(
      s.composerDraft?.videoComposition || ar()
    ), z(), () => {
      A.current += 1, I.current += 1;
    };
  }, [z, s.id]);
  const V = D(C), M = !T || T === V, E = M ? C?.version : Ge, Ze = Me(
    () => Qr(s, E, C?.kind),
    [E, C?.kind, s]
  ), y = !!(M && Ze.mode === "rich" && (C?.kind === "text" || C?.kind === "richtext")), se = Me(
    () => Xr(s, E, {
      includeNodeResult: M
    }),
    [E, M, s]
  ), je = Me(() => {
    const e = st(se);
    return e.length === 1 ? e[0] : void 0;
  }, [se]), hr = typeof E?.source?.prompt == "string" ? E.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), Ne = p(
    async (e, r = {}) => {
      const n = g.current, a = n?.version, c = D(n);
      if (!n?.id || !a?.id || u.current !== c)
        throw new Error("当前内容不可编辑");
      const l = await Hr({
        projectId: t,
        assetId: n.id,
        versionId: a.id,
        expectedUpdatedAt: e.mode === "storyboard" || r.saveMode !== void 0 ? a.updated_at || a.created_at || "" : void 0,
        requestId: r.requestId,
        saveMode: r.saveMode,
        content: Yr(e)
      }), f = oe(
        l,
        n
      );
      f.version && (f.version = {
        ...f.version,
        summary: e.summary
      });
      const b = D(f);
      g.current = f, u.current = b, Q(f), U(b), H(
        (Ae) => B(
          Ae,
          f.version ? [f.version] : []
        )
      ), b && b !== c && O((Ae) => Ae + 1), Y.current?.(f);
    },
    [t]
  ), i = Lr({
    value: Ze,
    resetKey: `${s.id}:${T}:${yr}`,
    fingerprint: ir,
    save: (e) => Ne(
      e,
      y ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (e) => N(W(e, "保存失败")),
    autoSave: !y
  }), gr = p(async () => {
    await i.flush() && (R.current = null);
  }, [i.flush]), wr = p(async () => {
    const e = g.current, r = e?.version;
    if (!e?.id || !r?.id) {
      N("当前资产版本不可用");
      return;
    }
    const n = ir(i.draft), a = R.current?.versionId === r.id && R.current.fingerprint === n ? R.current : {
      versionId: r.id,
      fingerprint: n,
      requestId: ie("manual-edit", r.id)
    };
    R.current = a, await i.flushWith(
      (l) => Ne(l, {
        saveMode: "create_version",
        requestId: a.requestId
      })
    ) && (R.current = null);
  }, [i.draft, i.flushWith, Ne]), ne = p(() => !y || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (R.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, y]), br = p(async () => {
    if (!(k || !le)) {
      X("confirming");
      try {
        if (await i.flush()) {
          const e = A.current, r = I.current, n = K.current.id, a = u.current;
          le((c) => {
            e !== A.current || r !== I.current || n !== K.current.id || a !== u.current || te(c, !1);
          });
        }
      } finally {
        X("");
      }
    }
  }, [
    te,
    i.flush,
    le,
    k
  ]), er = p(async () => {
    if (k)
      return;
    const e = g.current, r = u.current;
    if (!e?.id || !r) {
      N("当前分镜版本不可用");
      return;
    }
    X("revising");
    try {
      const n = j.current?.versionId === r ? j.current : {
        versionId: r,
        requestId: ie("revision", r)
      };
      j.current = n;
      const a = await Or({
        projectId: t,
        assetId: e.id,
        versionId: r,
        requestId: n.requestId,
        nodeKey: s.id
      });
      te(a), j.current = null, z();
    } catch (n) {
      N(W(n, "创建分镜修订稿失败"));
    } finally {
      X("");
    }
  }, [
    te,
    z,
    s.id,
    t,
    k
  ]), Cr = p(
    async (e, r, n) => {
      const a = g.current, c = K.current, l = D(a), f = Number(c.power?.id || 0), b = String(c.power?.key || "").trim();
      if (!a?.id || !l)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!f && !b)
        throw new Error("当前分镜节点未配置生成能力");
      return Ur({
        projectId: t,
        assetId: a.id,
        versionId: l,
        flowId: Number(c.flow?.id || a.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || a.asset_cate_id || h
        ),
        requestId: ie("shot", l),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: f,
        powerKey: b,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: e,
        shotId: r,
        instruction: n
      });
    },
    [h, t]
  ), Vr = p(async () => {
    if (u.current === V) {
      if (y) {
        if (!ne()) return;
      } else if (!await i.flush()) return;
    }
    await z();
  }, [
    V,
    ne,
    i.flush,
    y,
    z
  ]), Ie = p(
    async (e) => {
      if (!w || !e || e === V)
        return;
      const r = I.current + 1;
      I.current = r, Ve(!0), _(""), x(null);
      try {
        const n = await $r({
          projectId: t,
          assetId: w,
          versionId: e
        });
        if (r !== I.current || u.current !== e)
          return;
        x(n), $((a) => a + 1);
      } catch (n) {
        if (r !== I.current)
          return;
        _(W(n, "读取历史版本失败"));
      } finally {
        r === I.current && Ve(!1);
      }
    },
    [w, V, t]
  ), rr = p(
    async (e) => {
      if (L)
        return;
      const r = Number(e.id || 0);
      if (!(!r || r === u.current)) {
        if (u.current === V) {
          if (y) {
            if (!ne()) return;
          } else if (!await i.flush()) return;
        }
        if (u.current = r, Z.current = null, U(r), r === V) {
          I.current += 1, x(null), _(""), Ve(!1), $((n) => n + 1);
          return;
        }
        await Ie(r);
      }
    },
    [
      V,
      ne,
      i.flush,
      y,
      Ie,
      L
    ]
  ), Dr = p(async () => {
    if (!(!w || !he || we)) {
      Be(!0);
      try {
        const e = await Kr({
          projectId: t,
          assetId: w,
          page: Oe + 1
        });
        H((r) => B(r, e.items)), Ue(e.page), O(e.total), $e(e.hasMore);
      } catch (e) {
        N(W(e, "加载更多版本失败"));
      } finally {
        Be(!1);
      }
    }
  }, [w, he, t, we, Oe]), Sr = p(async () => {
    const e = g.current, r = u.current;
    if (!(L || !e?.id || !r || r === D(e))) {
      Je(!0);
      try {
        const n = Z.current?.versionId === r ? Z.current : {
          versionId: r,
          requestId: ie("restore", r)
        };
        Z.current = n;
        const a = await Br({
          projectId: t,
          assetId: e.id,
          versionId: r,
          requestId: n.requestId,
          nodeKey: s.id
        }), c = oe(
          a,
          e
        );
        g.current = c, Q(c), Y.current?.(c);
        try {
          const l = await or({
            projectId: t,
            assetId: e.id
          });
          re(l);
        } catch {
          const l = c.version;
          H(
            (b) => B(l ? [l] : [], b)
          ), O((b) => b + 1);
          const f = D(c);
          u.current = f, U(f), x(null), _(""), $((b) => b + 1);
        }
        Z.current = null;
      } catch (n) {
        N(W(n, "切换版本失败"));
      } finally {
        Je(!1);
      }
    }
  }, [re, s.id, t, L]), Re = p(async () => {
    if (Se.current)
      return;
    if (y && i.hasPendingChanges) {
      ee(!0);
      return;
    }
    Se.current = !0, Xe(!0);
    let e = !0;
    const r = g.current;
    if (i.hasPendingChanges && r?.id && r?.version?.id && u.current === D(r) && (e = await i.flush()), !e) {
      Se.current = !1, Xe(!1), ee(!0);
      return;
    }
    fe();
  }, [i.flush, i.hasPendingChanges, y, fe]), q = i.draft, Nr = q.mode === "storyboard" && xr(q.value), ke = !M || !me && (!C?.id || !C?.version?.id) || Nr, Ir = ke || Qe || w > 0 && Ke || ve && !pe, Rr = !M && (Ce || De);
  return /* @__PURE__ */ m(
    _r,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      layer: lr,
      onRequestClose: Re,
      onEscape: () => {
        if (Ye) ee(!1);
        else return Re();
      },
      header: /* @__PURE__ */ o(
        Zr,
        {
          node: s,
          contentLabel: ht(
            q,
            s,
            y ? void 0 : je
          ),
          versionSelect: w ? /* @__PURE__ */ o(
            ot,
            {
              versions: He,
              currentVersionId: V,
              selectedVersionId: T || V,
              total: vr,
              hasMore: he,
              loading: Ke,
              loadingMore: we,
              error: pr,
              onSelect: (e) => {
                rr(e);
              },
              onLoadMore: () => {
                Dr();
              },
              onRetry: () => {
                Vr();
              }
            }
          ) : void 0,
          updatedAt: it(
            E?.updated_at || E?.created_at
          ),
          status: i.status,
          readonly: ke,
          actions: y && !ke ? /* @__PURE__ */ o(
            zr,
            {
              status: i.status,
              hasPendingChanges: i.hasPendingChanges,
              onReset: () => {
                R.current = null, i.reset();
              },
              onSaveAsNewVersion: () => {
                wr();
              },
              onSave: () => {
                gr();
              }
            }
          ) : void 0,
          downloadUrl: q.downloadUrl,
          onRetry: () => {
            i.retry();
          },
          onClose: () => {
            Re();
          }
        }
      ),
      children: [
        /* @__PURE__ */ m("main", { className: "wb-detail-workspace", children: [
          M ? null : /* @__PURE__ */ m("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ m("span", { children: [
              /* @__PURE__ */ o(Mr, { size: 14 }),
              "正在查看第 ",
              Ge?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ m("div", { children: [
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    rr(
                      C?.version || { id: V }
                    );
                  },
                  children: [
                    /* @__PURE__ */ o(Er, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: L || !!k || Ce || !!De,
                  onClick: () => q.mode === "storyboard" ? void er() : void Sr(),
                  children: [
                    L || k === "revising" ? /* @__PURE__ */ o(qe, { size: 13, className: "wb-detail-spin" }) : q.mode === "storyboard" ? /* @__PURE__ */ o(qr, { size: 13 }) : /* @__PURE__ */ o(nr, { size: 13 }),
                    q.mode === "storyboard" ? k === "revising" ? "创建中" : "基于此版本创建修订稿" : L ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ m("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ o(
              kr,
              {
                message: fr,
                onDismiss: () => N("")
              }
            ),
            /* @__PURE__ */ o(at, { projectId: t, node: s }),
            Rr ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: Ce ? /* @__PURE__ */ m(tr, { children: [
              /* @__PURE__ */ o(qe, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ o("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ m(tr, { children: [
              /* @__PURE__ */ o("span", { children: De }),
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ie(T);
                  },
                  children: [
                    /* @__PURE__ */ o(nr, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ o(
              et.Provider,
              {
                value: Le,
                children: /* @__PURE__ */ o(
                  cr,
                  {
                    fallback: /* @__PURE__ */ o(
                      ur,
                      {
                        label: me ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: me ? /* @__PURE__ */ o(
                      mt,
                      {
                        composition: mr,
                        referenceItems: F || [],
                        connectedMediaReferences: J,
                        readonly: !M || Qe || We,
                        running: We,
                        fullScreen: !0,
                        finalOutput: se,
                        onChange: (e) => {
                          ze(e), ue?.({
                            ...s.composerDraft || {},
                            videoComposition: e
                          });
                        },
                        onConnectedMediaEdgeRemove: P,
                        onRun: xe ? (e) => {
                          Fe(!0), xe({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: e
                            }
                          }).then(() => w ? z() : void 0).catch(
                            (r) => N(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => Fe(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ o(
                      ut,
                      {
                        content: q,
                        assetKind: C?.kind || s.kind,
                        mediaOutput: y ? void 0 : se,
                        mediaKind: y ? void 0 : je,
                        mediaPrompt: hr,
                        readonly: Ir,
                        referenceItems: F,
                        canvasNodes: G,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: ae,
                        storyboardInitialSectionId: ce,
                        storyboardWorkspace: de,
                        storyboardWorkflowAction: k,
                        storyboardWorkTypes: pe?.storyboard_work_types,
                        storyboardReferencePurposes: pe?.storyboard_reference_purposes,
                        referenceProvider: Le,
                        onConfirmStoryboard: br,
                        onCreateStoryboardRevision: er,
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
        Ye ? /* @__PURE__ */ o("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ m(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ o("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ o("p", { children: y ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ m("div", { children: [
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    onClick: () => {
                      R.current = null, i.reset(), fe();
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
function Ee(t) {
  return B(
    t?.version ? [t.version] : [],
    t?.versions || []
  );
}
function D(t) {
  return Number(t?.version_id || t?.version?.id || 0);
}
function ht(t, v, h) {
  return t.mode === "storyboard" ? "分镜脚本" : dr(v.power, v.kind, v.outputType) ? "视频合成" : h === "image" ? "图片内容" : h === "video" ? "视频内容" : h === "audio" ? "音频内容" : t.mode === "file" ? "文件" : v.kind === "image" || v.kind === "richtext" ? "图文内容" : v.kind === "video" ? "视频内容" : v.kind === "audio" ? "音频内容" : t.format === "markdown" ? "Markdown" : "富文本";
}
function ie(t, v) {
  const h = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${v}-${h}`.slice(0, 64);
}
export {
  Tt as NodeDetailDialog
};
