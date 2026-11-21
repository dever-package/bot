import { j as o, a as v, b as xe, c as Te, F as sr } from "./preloadable-CnUP9jgB.js";
import { S as qr } from "./space-node-runtime-694G12tD.js";
import { S as dr, a as d, b as R, d as nr, h as y, u as Ee } from "./file-kind-Cq3pESGF.js";
import { x as Pr, r as Pe, ah as xr, A as Tr, ag as _r, af as or } from "./vendor-icons-B8sieP24.js";
import { o as Lr, q as zr, c as Fr, n as Wr } from "./asset-audio-preview-CsYcyVm8.js";
import { r as O } from "./asset-upload-progress-BKzeQB8G.js";
import { u as Hr, T as Or } from "./text-content-save-actions-0xSf1irm.js";
import { l as Ur, m as $r, f as ir, s as Kr, c as Br, o as Gr, q as Jr, t as Qr } from "./writing-reference-CGBoN4Mc.js";
import { a as Xr, b as Yr, c as Zr, m as ie, d as Q } from "./writing-run-labels-xukZ9QE8.js";
import { d as jr, e as et, f as rt, g as ar, C as ur, N as tt } from "./node-detail-header-MEc7Zf1L.js";
import { u as st } from "./asset-reference-provider-DxlbYzPl.js";
import { C as nt } from "./node-detail-storyboard-grid-COBpsGyF.js";
import { l as ot, k as lr, m as it } from "./space-assistant-layout-B9KyeCM0.js";
import { f as cr } from "./space-story-setting-reference-CenSO-Ot.js";
import { o as at } from "./asset-preview-DonyTaaN.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-DBuvx8_c.css", import.meta.url).href]);
function ct({
  versions: t,
  currentVersionId: l,
  selectedVersionId: w,
  total: X,
  hasMore: s,
  loading: U,
  loadingMore: Y,
  error: ae,
  onSelect: ce,
  onLoadMore: de,
  onRetry: ue
}) {
  return /* @__PURE__ */ o(
    zr,
    {
      options: t.map((k) => ({
        id: Number(k.id || 0),
        version: Number(k.version || 0),
        updatedAt: String(k.updated_at || k.created_at || ""),
        value: k
      })),
      currentVersionId: l,
      selectedVersionId: w,
      total: X,
      hasMore: s,
      loading: U,
      loadingMore: Y,
      error: ae,
      onSelect: ce,
      onLoadMore: de,
      onRetry: ue
    }
  );
}
function dt(t) {
  return Lr(t);
}
function ut({
  projectId: t,
  node: l
}) {
  const w = String(l.runError || "").trim(), { error: X, loading: s } = Xr(t, l), { summary: U, details: Y } = Yr(X || w);
  return w ? /* @__PURE__ */ v("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ o(Pr, { size: 17 }),
    /* @__PURE__ */ v("div", { style: { minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ o("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ o("p", { children: U }),
      /* @__PURE__ */ v("details", { style: { marginTop: 6, fontSize: 11 }, children: [
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
            children: Y
          }
        )
      ] }),
      s ? /* @__PURE__ */ v("small", { children: [
        /* @__PURE__ */ o(Pe, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const lt = Te(
  () => import("./node-detail-editor-CIfzx-9A.js")
), ft = xe(
  lt,
  (t) => t.NodeDetailEditor
), mt = ft.Component, vt = Te(
  () => import("./space-video-compose-view-D3zFP-ba.js")
), yt = xe(
  vt,
  (t) => t.VideoComposeView
), ht = yt.Component;
function _t(t) {
  return ot(
    t.node.power,
    t.node.kind,
    t.node.outputType
  ) ? Zr(
    Ur(t.node, t.node.resultOutput)?.document
  ) ? /* @__PURE__ */ o(dr, { fallback: /* @__PURE__ */ o(ur, { label: "正在加载创作工作区" }), children: /* @__PURE__ */ o(
    gt,
    {
      projectId: t.projectId,
      canvasId: t.canvasId,
      node: t.node,
      output: t.node.resultOutput,
      onAssetUpdated: t.onAssetUpdated,
      readonly: t.readonly,
      onClose: t.onClose
    },
    t.node.id
  ) }) : null : /* @__PURE__ */ o(wt, { ...t });
}
const pt = xe(
  Te(() => import("./writing-editor--mr3ke40.js")),
  (t) => t.WritingEditor
), gt = pt.Component;
function wt({
  projectId: t,
  canvasId: l,
  teamId: w,
  assetCateId: X,
  node: s,
  canvasReferenceItems: U,
  canvasNodes: Y,
  canvasEdges: ae,
  connectedMediaReferences: ce,
  storyboardFocus: de,
  storyboardInitialSectionId: ue,
  storyboardWorkspace: k,
  onNodeDraftChange: fr,
  onConnectedMediaEdgeRemove: mr,
  onRunNode: _e,
  onAssetUpdated: Le,
  onConfirmStoryboard: le,
  onClose: fe,
  layer: vr
}) {
  const [yr, A] = d(""), ze = st({
    notificationMode: "inline",
    teamID: w,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: X
    }
  }), h = Number(s.asset?.id || 0), me = lr(
    s.power,
    s.kind,
    s.outputType
  ), ve = it(
    s.power,
    s.kind,
    s.outputType
  ), [ye, he] = d(null), [hr, Fe] = d(
    () => s.composerDraft?.videoComposition || cr()
  ), [We, He] = d(!1), [b, Z] = d(s.asset), [Oe, $] = d(
    () => Me(s.asset)
  ), [pr, K] = d(Oe.length), [Ue, $e] = d(1), [pe, Ke] = d(!1), [Be, ge] = d(h > 0), [we, Ge] = d(!1), [gr, be] = d(""), [I, B] = d(
    () => D(s.asset)
  ), [Je, T] = d(
    null
  ), [Ce, Ve] = d(!1), [Se, _] = d(""), [L, Qe] = d(!1), [C, z] = d(""), [Xe, Ye] = d(!1), [Ze, re] = d(!1), [wr, F] = d(0), p = R(b), u = R(I), G = R(Le), W = R(s), P = R(0), E = R(0), j = R(null), ee = R(null), M = R(null), De = R(!1);
  p.current = b, u.current = I, G.current = Le, W.current = s, nr(() => {
    if (!ve || !s.power?.id && !s.power?.key) {
      he(null);
      return;
    }
    let e = !1;
    return he(null), $r({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || he(r);
    }).catch((r) => {
      e || A(O(r, "加载分镜用途配置失败"));
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
  const te = y(
    (e) => {
      const r = ie(
        { ...e.asset, versions: e.versions },
        p.current || W.current.asset
      ), n = r.version, a = Q(
        n ? [n] : [],
        e.versions
      ), c = D(r);
      p.current = r, u.current = c, Z(r), $(a), K(Math.max(e.versionTotal, a.length)), $e(1), Ke(e.hasMore), B(c), T(null), _(""), F((f) => f + 1), G.current?.(r);
    },
    []
  ), J = y(
    (e, r = !0) => {
      const n = ie(
        e,
        p.current || W.current.asset
      ), a = D(n);
      p.current = n, u.current = a, Z(n), B(a), $((c) => {
        const f = Q(
          n.version ? [n.version] : [],
          c
        );
        return K((m) => Math.max(m, f.length)), f;
      }), T(null), _(""), F((c) => c + 1), r && G.current?.(n);
    },
    []
  ), H = y(async () => {
    if (!h) {
      ge(!1), be("");
      return;
    }
    const e = P.current + 1;
    P.current = e, ge(!0), be("");
    try {
      const r = await ir({ projectId: t, assetId: h });
      if (e !== P.current)
        return;
      te(r);
    } catch (r) {
      if (e !== P.current)
        return;
      be(O(r, "读取版本记录失败"));
    } finally {
      e === P.current && ge(!1);
    }
  }, [te, h, t]);
  nr(() => {
    p.current = s.asset, Z(s.asset), $(Me(s.asset)), K(Me(s.asset).length);
    const e = D(s.asset);
    return u.current = e, B(e), T(null), _(""), z(""), ee.current = null, F((r) => r + 1), Fe(
      s.composerDraft?.videoComposition || cr()
    ), H(), () => {
      P.current += 1, E.current += 1;
    };
  }, [H, s.id]);
  const S = D(b), N = !I || I === S, x = N ? b?.version : Je, je = Ee(
    () => jr(s, x, b?.kind),
    [x, b?.kind, s]
  ), g = !!(N && je.mode === "rich" && (b?.kind === "text" || b?.kind === "richtext")), se = Ee(
    () => et(s, x, {
      includeNodeResult: N
    }),
    [x, N, s]
  ), er = Ee(() => {
    const e = Fr(se);
    return e.length === 1 ? e[0] : void 0;
  }, [se]), br = typeof x?.source?.prompt == "string" ? x.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), ne = y(
    async (e, r = {}) => {
      const n = p.current, a = n?.version, c = D(n);
      if (!n?.id || !a?.id || u.current !== c)
        throw new Error("当前内容不可编辑");
      const f = await Kr({
        projectId: t,
        assetId: n.id,
        versionId: a.id,
        expectedUpdatedAt: e.mode === "storyboard" || r.saveMode !== void 0 ? a.updated_at || a.created_at || "" : void 0,
        requestId: r.requestId,
        saveMode: r.saveMode,
        content: rt(e)
      }), m = ie(
        f,
        n
      );
      m.version && (m.version = {
        ...m.version,
        summary: e.summary
      });
      const V = D(m);
      p.current = m, u.current = V, Z(m), B(V), $(
        (Ie) => Q(
          Ie,
          m.version ? [m.version] : []
        )
      ), V && V !== c && K((Ie) => Ie + 1), G.current?.(m);
    },
    [t]
  ), i = Hr({
    value: je,
    resetKey: `${s.id}:${I}:${wr}`,
    fingerprint: ar,
    save: (e) => ne(
      e,
      g ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (e) => A(O(e, "保存失败")),
    autoSave: !g
  }), Cr = async (e) => {
    if (!await i.flush()) throw new Error("当前分镜还有未保存的改动，请重试");
    await ne(e), F((r) => r + 1);
  }, Vr = y(async () => {
    await i.flush() && (M.current = null);
  }, [i.flush]), Sr = y(async () => {
    const e = p.current, r = e?.version;
    if (!e?.id || !r?.id) {
      A("当前资产版本不可用");
      return;
    }
    const n = ar(i.draft), a = M.current?.versionId === r.id && M.current.fingerprint === n ? M.current : {
      versionId: r.id,
      fingerprint: n,
      requestId: qe("manual-edit", r.id)
    };
    M.current = a, await i.flushWith(
      (f) => ne(f, {
        saveMode: "create_version",
        requestId: a.requestId
      })
    ) && (M.current = null);
  }, [i.draft, i.flushWith, ne]), oe = y(() => !g || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (M.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, g]), Dr = y(async () => {
    if (!(C || !le)) {
      z("confirming");
      try {
        if (await i.flush()) {
          const e = P.current, r = E.current, n = W.current.id, a = u.current, c = p.current;
          if (!c?.version || c.version.id !== a) {
            A("分镜版本已变化，请刷新核对后再确认");
            return;
          }
          le(c, (f) => {
            e !== P.current || r !== E.current || n !== W.current.id || a !== u.current || J(f, !1);
          });
        }
      } finally {
        z("");
      }
    }
  }, [
    J,
    i.flush,
    le,
    C
  ]), rr = y(async () => {
    if (C)
      return;
    const e = p.current, r = u.current;
    if (!e?.id || !r) {
      A("当前分镜版本不可用");
      return;
    }
    z("revising");
    try {
      const n = ee.current?.versionId === r ? ee.current : {
        versionId: r,
        requestId: qe("revision", r)
      };
      ee.current = n;
      const a = await Br({
        projectId: t,
        assetId: e.id,
        versionId: r,
        expectedCurrentVersionId: e.version_id,
        requestId: n.requestId,
        nodeKey: s.id
      });
      J(a), ee.current = null, H();
    } catch (n) {
      A(O(n, "创建分镜修订稿失败"));
    } finally {
      z("");
    }
  }, [
    J,
    H,
    s.id,
    t,
    C
  ]), Ar = y(
    async (e, r, n) => {
      if (C || !await i.flush())
        throw new Error("请先保存当前分镜再生成镜头");
      const a = p.current, c = W.current;
      if (!a?.id || u.current !== D(a))
        throw new Error("当前分镜版本不可编辑");
      z("generating_shot");
      try {
        const { editSpaceStoryboardShot: f } = await import("./space-storyboard-shot-request-BnB4b_4q.js").then((V) => V.a), m = await f({
          projectId: t,
          canvasId: l,
          node: c,
          asset: a,
          storyboard: e,
          shotId: r,
          instruction: n
        });
        W.current.id === c.id && u.current === a.version_id ? J(m) : G.current?.(m);
      } finally {
        z("");
      }
    },
    [J, C, i.flush, t, l]
  ), Nr = y(async () => {
    if (u.current === S) {
      if (g) {
        if (!oe()) return;
      } else if (!await i.flush()) return;
    }
    await H();
  }, [
    S,
    oe,
    i.flush,
    g,
    H
  ]), Ae = y(
    async (e) => {
      if (!h || !e || e === S)
        return;
      const r = E.current + 1;
      E.current = r, Ve(!0), _(""), T(null);
      try {
        const n = await Gr({
          projectId: t,
          assetId: h,
          versionId: e
        });
        if (r !== E.current || u.current !== e)
          return;
        T(n), F((a) => a + 1);
      } catch (n) {
        if (r !== E.current)
          return;
        _(O(n, "读取历史版本失败"));
      } finally {
        r === E.current && Ve(!1);
      }
    },
    [h, S, t]
  ), tr = y(
    async (e) => {
      if (L)
        return;
      const r = Number(e.id || 0);
      if (!(!r || r === u.current)) {
        if (u.current === S) {
          if (g) {
            if (!oe()) return;
          } else if (!await i.flush()) return;
        }
        if (u.current = r, j.current = null, B(r), r === S) {
          E.current += 1, T(null), _(""), Ve(!1), F((n) => n + 1);
          return;
        }
        await Ae(r);
      }
    },
    [
      S,
      oe,
      i.flush,
      g,
      Ae,
      L
    ]
  ), Rr = y(async () => {
    if (!(!h || !pe || we)) {
      Ge(!0);
      try {
        const e = await Jr({
          projectId: t,
          assetId: h,
          page: Ue + 1
        });
        $((r) => Q(r, e.items)), $e(e.page), K(e.total), Ke(e.hasMore);
      } catch (e) {
        A(O(e, "加载更多版本失败"));
      } finally {
        Ge(!1);
      }
    }
  }, [h, pe, t, we, Ue]), kr = y(async () => {
    const e = p.current, r = u.current;
    if (!(L || !e?.id || !r || r === D(e))) {
      Qe(!0);
      try {
        const n = j.current?.versionId === r ? j.current : {
          versionId: r,
          requestId: qe("restore", r)
        };
        j.current = n;
        const a = await Qr({
          projectId: t,
          assetId: e.id,
          versionId: r,
          requestId: n.requestId,
          nodeKey: s.id
        }), c = ie(
          a,
          e
        );
        p.current = c, Z(c), G.current?.(c);
        try {
          const f = await ir({
            projectId: t,
            assetId: e.id
          });
          te(f);
        } catch {
          const f = c.version;
          $(
            (V) => Q(f ? [f] : [], V)
          ), K((V) => V + 1);
          const m = D(c);
          u.current = m, B(m), T(null), _(""), F((V) => V + 1);
        }
        j.current = null;
      } catch (n) {
        A(O(n, "切换版本失败"));
      } finally {
        Qe(!1);
      }
    }
  }, [te, s.id, t, L]), Ne = y(async () => {
    if (De.current || C === "generating_shot")
      return;
    if (g && i.hasPendingChanges) {
      re(!0);
      return;
    }
    De.current = !0, Ye(!0);
    let e = !0;
    const r = p.current;
    if (i.hasPendingChanges && r?.id && r?.version?.id && u.current === D(r) && (e = await i.flush()), !e) {
      De.current = !1, Ye(!1), re(!0);
      return;
    }
    fe();
  }, [i.flush, i.hasPendingChanges, g, fe, C]), q = i.draft, Re = N || q.mode !== "storyboard", Ir = q.mode === "storyboard" && at(q.value), ke = !N || !me && (!b?.id || !b?.version?.id) || Ir, Er = ke || Xe || h > 0 && Be || ve && !ye, Mr = !N && (Ce || Se);
  return /* @__PURE__ */ v(
    Wr,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      layer: vr,
      onRequestClose: Ne,
      onEscape: () => {
        if (Ze) re(!1);
        else return Ne();
      },
      header: /* @__PURE__ */ o(
        tt,
        {
          node: s,
          contentLabel: bt(
            q,
            s,
            g ? void 0 : er
          ),
          versionSelect: h ? /* @__PURE__ */ o(
            ct,
            {
              versions: Oe,
              currentVersionId: S,
              selectedVersionId: I || S,
              total: pr,
              hasMore: pe,
              loading: Be,
              loadingMore: we,
              error: gr,
              onSelect: (e) => {
                tr(e);
              },
              onLoadMore: () => {
                Rr();
              },
              onRetry: () => {
                Nr();
              }
            }
          ) : void 0,
          updatedAt: dt(
            x?.updated_at || x?.created_at
          ),
          status: i.status,
          readonly: ke,
          actions: g && !ke ? /* @__PURE__ */ o(
            Or,
            {
              status: i.status,
              hasPendingChanges: i.hasPendingChanges,
              onReset: () => {
                M.current = null, i.reset();
              },
              onSaveAsNewVersion: () => {
                Sr();
              },
              onSave: () => {
                Vr();
              }
            }
          ) : void 0,
          downloadUrl: q.downloadUrl,
          onRetry: () => {
            i.retry();
          },
          onClose: () => {
            Ne();
          }
        }
      ),
      children: [
        /* @__PURE__ */ v("main", { className: "wb-detail-workspace", children: [
          N ? null : /* @__PURE__ */ v("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ v("span", { children: [
              /* @__PURE__ */ o(xr, { size: 14 }),
              "正在查看第 ",
              Je?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ v("div", { children: [
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    tr(
                      b?.version || { id: S }
                    );
                  },
                  children: [
                    /* @__PURE__ */ o(Tr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: L || !!C || Ce || !!Se,
                  onClick: () => q.mode === "storyboard" ? void rr() : void kr(),
                  children: [
                    L || C === "revising" ? /* @__PURE__ */ o(Pe, { size: 13, className: "wb-detail-spin" }) : q.mode === "storyboard" ? /* @__PURE__ */ o(_r, { size: 13 }) : /* @__PURE__ */ o(or, { size: 13 }),
                    q.mode === "storyboard" ? C === "revising" ? "创建中" : "基于此版本创建修订稿" : L ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ v("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ o(
              qr,
              {
                message: yr,
                onDismiss: () => A("")
              }
            ),
            /* @__PURE__ */ o(ut, { projectId: t, node: s }),
            Mr ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: Ce ? /* @__PURE__ */ v(sr, { children: [
              /* @__PURE__ */ o(Pe, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ o("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ v(sr, { children: [
              /* @__PURE__ */ o("span", { children: Se }),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ae(I);
                  },
                  children: [
                    /* @__PURE__ */ o(or, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ o(
              nt.Provider,
              {
                value: ze,
                children: /* @__PURE__ */ o(
                  dr,
                  {
                    fallback: /* @__PURE__ */ o(
                      ur,
                      {
                        label: me ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: me ? /* @__PURE__ */ o(
                      ht,
                      {
                        composition: hr,
                        referenceItems: U || [],
                        connectedMediaReferences: ce,
                        readonly: !N || Xe || We,
                        running: We,
                        fullScreen: !0,
                        finalOutput: se,
                        onChange: (e) => {
                          Fe(e), fr?.({
                            ...s.composerDraft || {},
                            videoComposition: e
                          });
                        },
                        onConnectedMediaEdgeRemove: mr,
                        onRun: _e ? (e) => {
                          He(!0), _e({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: e
                            }
                          }).then(() => h ? H() : void 0).catch(
                            (r) => A(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => He(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ o(
                      mt,
                      {
                        content: q,
                        assetKind: b?.kind || s.kind,
                        mediaOutput: g ? void 0 : se,
                        mediaKind: g ? void 0 : er,
                        mediaPrompt: br,
                        readonly: Er,
                        referenceItems: U,
                        canvasNodes: Re ? Y : void 0,
                        canvasEdges: Re ? ae : void 0,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: de,
                        storyboardInitialSectionId: ue,
                        storyboardWorkspace: Re ? k : void 0,
                        storyboardWorkflowAction: C,
                        storyboardWorkTypes: ye?.storyboard_work_types,
                        storyboardReferencePurposes: ye?.storyboard_reference_purposes,
                        referenceProvider: ze,
                        onConfirmStoryboard: Dr,
                        onCreateStoryboardRevision: N && !k?.running ? rr : void 0,
                        onGenerateStoryboardShot: k?.running ? void 0 : Ar,
                        onSaveStoryboardShotEdit: Cr,
                        storyboardPromptVersion: h && I ? {
                          projectId: t,
                          assetId: h,
                          versionId: I
                        } : void 0,
                        onChange: i.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        Ze ? /* @__PURE__ */ o("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ v(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ o("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ o("p", { children: g ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ v("div", { children: [
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    onClick: () => re(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    onClick: () => {
                      M.current = null, i.reset(), fe();
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
function Me(t) {
  return Q(
    t?.version ? [t.version] : [],
    t?.versions || []
  );
}
function D(t) {
  return Number(t?.version_id || t?.version?.id || 0);
}
function bt(t, l, w) {
  return t.mode === "setting" ? "设定" : t.mode === "storyboard" ? "分镜脚本" : lr(l.power, l.kind, l.outputType) ? "视频合成" : w === "image" ? "图片内容" : w === "video" ? "视频内容" : w === "audio" ? "音频内容" : t.mode === "file" ? "文件" : l.kind === "image" || l.kind === "richtext" ? "图文内容" : l.kind === "video" ? "视频内容" : l.kind === "audio" ? "音频内容" : t.format === "markdown" ? "Markdown" : "富文本";
}
function qe(t, l) {
  const w = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${l}-${w}`.slice(0, 64);
}
export {
  _t as NodeDetailDialog
};
