import { j as o, a as v, b as xe, c as Te, F as sr } from "./preloadable-B6QZqbLd.js";
import { S as qr } from "./space-node-runtime-DoeIrVE7.js";
import { S as dr, a as d, b as R, d as nr, h, u as Ie } from "./file-kind-Cq3pESGF.js";
import { x as Pr, r as Pe, ah as xr, A as Tr, ag as _r, af as or } from "./vendor-icons-IZIW7U43.js";
import { o as Lr, q as zr, c as Fr, n as Wr } from "./asset-audio-preview-CWf3Wq_n.js";
import { r as O } from "./asset-upload-progress-BKzeQB8G.js";
import { u as Hr, T as Or } from "./text-content-save-actions-BnQTlGfX.js";
import { l as Ur, m as $r, f as ir, s as Kr, c as Br, o as Gr, q as Jr, t as Qr } from "./writing-reference-Co5JVp43.js";
import { u as Xr, c as Yr, m as ae, d as Q, r as Zr, e as jr, f as et, g as ar, C as ur, N as rt } from "./node-detail-header-DivpGPu9.js";
import { u as tt } from "./asset-reference-provider-DibP2rOu.js";
import { C as st } from "./node-detail-storyboard-grid-NFxghCLU.js";
import { l as nt, k as lr, m as ot } from "./space-assistant-layout-B9KyeCM0.js";
import { f as cr } from "./space-story-setting-reference-HUiOpGO8.js";
import { o as it } from "./asset-preview-CF7Cok8_.js";
import { c as at } from "./writing-run-labels-LBbhWSQU.js";
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
  error: ce,
  onSelect: de,
  onLoadMore: ue,
  onRetry: le
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
      error: ce,
      onSelect: de,
      onLoadMore: ue,
      onRetry: le
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
  () => import("./node-detail-editor-C-tH9ak6.js")
), ft = xe(
  lt,
  (t) => t.NodeDetailEditor
), mt = ft.Component, vt = Te(
  () => import("./space-video-compose-view-MZmtGLvQ.js")
), yt = xe(
  vt,
  (t) => t.VideoComposeView
), ht = yt.Component;
function _t(t) {
  return nt(
    t.node.power,
    t.node.kind,
    t.node.outputType
  ) ? at(
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
  Te(() => import("./writing-editor-D6zj13r8.js")),
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
  canvasEdges: ce,
  connectedMediaReferences: de,
  storyboardFocus: ue,
  storyboardInitialSectionId: le,
  storyboardWorkspace: k,
  onNodeDraftChange: fr,
  onConnectedMediaEdgeRemove: mr,
  onRunNode: _e,
  onAssetUpdated: Le,
  onConfirmStoryboard: fe,
  onClose: me,
  layer: vr
}) {
  const [yr, A] = d(""), ze = tt({
    notificationMode: "inline",
    teamID: w,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: X
    }
  }), y = Number(s.asset?.id || 0), ve = lr(
    s.power,
    s.kind,
    s.outputType
  ), ye = ot(
    s.power,
    s.kind,
    s.outputType
  ), [he, pe] = d(null), [hr, Fe] = d(
    () => s.composerDraft?.videoComposition || cr()
  ), [We, He] = d(!1), [b, Z] = d(s.asset), [Oe, $] = d(
    () => Me(s.asset)
  ), [pr, K] = d(Oe.length), [Ue, $e] = d(1), [ge, Ke] = d(!1), [Be, we] = d(y > 0), [be, Ge] = d(!1), [gr, Ce] = d(""), [E, B] = d(
    () => D(s.asset)
  ), [Je, T] = d(
    null
  ), [Ve, Se] = d(!1), [De, _] = d(""), [L, Qe] = d(!1), [C, z] = d(""), [Xe, Ye] = d(!1), [Ze, re] = d(!1), [wr, F] = d(0), p = R(b), u = R(E), G = R(Le), W = R(s), P = R(0), I = R(0), j = R(null), ee = R(null), M = R(null), Ae = R(!1);
  p.current = b, u.current = E, G.current = Le, W.current = s, nr(() => {
    if (!ye || !s.power?.id && !s.power?.key) {
      pe(null);
      return;
    }
    let e = !1;
    return pe(null), $r({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || pe(r);
    }).catch((r) => {
      e || A(O(r, "加载分镜用途配置失败"));
    }), () => {
      e = !0;
    };
  }, [
    ye,
    s.composerDraft?.selectedTargetId,
    s.flow?.id,
    s.id,
    s.power?.id,
    s.power?.key,
    t
  ]);
  const te = h(
    (e) => {
      const r = ae(
        { ...e.asset, versions: e.versions },
        p.current || W.current.asset
      ), n = r.version, a = Q(
        n ? [n] : [],
        e.versions
      ), c = D(r);
      p.current = r, u.current = c, Z(r), $(a), K(Math.max(e.versionTotal, a.length)), $e(1), Ke(e.hasMore), B(c), T(null), _(""), F((f) => f + 1), G.current?.(r);
    },
    []
  ), J = h(
    (e, r = !0) => {
      const n = ae(
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
  ), H = h(async () => {
    if (!y) {
      we(!1), Ce("");
      return;
    }
    const e = P.current + 1;
    P.current = e, we(!0), Ce("");
    try {
      const r = await ir({ projectId: t, assetId: y });
      if (e !== P.current)
        return;
      te(r);
    } catch (r) {
      if (e !== P.current)
        return;
      Ce(O(r, "读取版本记录失败"));
    } finally {
      e === P.current && we(!1);
    }
  }, [te, y, t]);
  nr(() => {
    p.current = s.asset, Z(s.asset), $(Me(s.asset)), K(Me(s.asset).length);
    const e = D(s.asset);
    return u.current = e, B(e), T(null), _(""), z(""), ee.current = null, F((r) => r + 1), Fe(
      s.composerDraft?.videoComposition || cr()
    ), H(), () => {
      P.current += 1, I.current += 1;
    };
  }, [H, s.id]);
  const S = D(b), N = !E || E === S, x = N ? b?.version : Je, je = Ie(
    () => Zr(s, x, b?.kind),
    [x, b?.kind, s]
  ), g = !!(N && je.mode === "rich" && (b?.kind === "text" || b?.kind === "richtext")), se = Ie(
    () => jr(s, x, {
      includeNodeResult: N
    }),
    [x, N, s]
  ), er = Ie(() => {
    const e = Fr(se);
    return e.length === 1 ? e[0] : void 0;
  }, [se]), br = typeof x?.source?.prompt == "string" ? x.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), ne = h(
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
        content: et(e)
      }), m = ae(
        f,
        n
      );
      m.version && (m.version = {
        ...m.version,
        summary: e.summary
      });
      const V = D(m);
      p.current = m, u.current = V, Z(m), B(V), $(
        (Ee) => Q(
          Ee,
          m.version ? [m.version] : []
        )
      ), V && V !== c && K((Ee) => Ee + 1), G.current?.(m);
    },
    [t]
  ), i = Hr({
    value: je,
    resetKey: `${s.id}:${E}:${wr}`,
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
  }, Vr = h(async () => {
    await i.flush() && (M.current = null);
  }, [i.flush]), Sr = h(async () => {
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
  }, [i.draft, i.flushWith, ne]), oe = h(() => !g || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (M.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, g]), Dr = h(async () => {
    if (!(C || !fe)) {
      z("confirming");
      try {
        if (await i.flush()) {
          const e = P.current, r = I.current, n = W.current.id, a = u.current, c = p.current;
          if (!c?.version || c.version.id !== a) {
            A("分镜版本已变化，请刷新核对后再确认");
            return;
          }
          fe(c, (f) => {
            e !== P.current || r !== I.current || n !== W.current.id || a !== u.current || J(f, !1);
          });
        }
      } finally {
        z("");
      }
    }
  }, [
    J,
    i.flush,
    fe,
    C
  ]), rr = h(async () => {
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
  ]), Ar = h(
    async (e, r, n) => {
      if (C || !await i.flush())
        throw new Error("请先保存当前分镜再生成镜头");
      const a = p.current, c = W.current;
      if (!a?.id || u.current !== D(a))
        throw new Error("当前分镜版本不可编辑");
      z("generating_shot");
      try {
        const { editSpaceStoryboardShot: f } = await import("./space-storyboard-shot-request-D_x0u-ae.js").then((V) => V.a), m = await f({
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
  ), Nr = h(async () => {
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
  ]), Ne = h(
    async (e) => {
      if (!y || !e || e === S)
        return;
      const r = I.current + 1;
      I.current = r, Se(!0), _(""), T(null);
      try {
        const n = await Gr({
          projectId: t,
          assetId: y,
          versionId: e
        });
        if (r !== I.current || u.current !== e)
          return;
        T(n), F((a) => a + 1);
      } catch (n) {
        if (r !== I.current)
          return;
        _(O(n, "读取历史版本失败"));
      } finally {
        r === I.current && Se(!1);
      }
    },
    [y, S, t]
  ), tr = h(
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
          I.current += 1, T(null), _(""), Se(!1), F((n) => n + 1);
          return;
        }
        await Ne(r);
      }
    },
    [
      S,
      oe,
      i.flush,
      g,
      Ne,
      L
    ]
  ), Rr = h(async () => {
    if (!(!y || !ge || be)) {
      Ge(!0);
      try {
        const e = await Jr({
          projectId: t,
          assetId: y,
          page: Ue + 1
        });
        $((r) => Q(r, e.items)), $e(e.page), K(e.total), Ke(e.hasMore);
      } catch (e) {
        A(O(e, "加载更多版本失败"));
      } finally {
        Ge(!1);
      }
    }
  }, [y, ge, t, be, Ue]), kr = h(async () => {
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
        }), c = ae(
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
  }, [te, s.id, t, L]), Re = h(async () => {
    if (Ae.current || C === "generating_shot")
      return;
    if (g && i.hasPendingChanges) {
      re(!0);
      return;
    }
    Ae.current = !0, Ye(!0);
    let e = !0;
    const r = p.current;
    if (i.hasPendingChanges && r?.id && r?.version?.id && u.current === D(r) && (e = await i.flush()), !e) {
      Ae.current = !1, Ye(!1), re(!0);
      return;
    }
    me();
  }, [i.flush, i.hasPendingChanges, g, me, C]), q = i.draft, ke = N || q.mode !== "storyboard", Er = q.mode === "storyboard" && it(q.value), ie = !N || !ve && (!b?.id || !b?.version?.id) || Er, Ir = ie || Xe || y > 0 && Be || ye && !he, Mr = !N && (Ve || De);
  return /* @__PURE__ */ v(
    Wr,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      layer: vr,
      onRequestClose: Re,
      onEscape: () => {
        if (Ze) re(!1);
        else return Re();
      },
      header: /* @__PURE__ */ o(
        rt,
        {
          node: s,
          contentLabel: bt(
            q,
            s,
            g ? void 0 : er
          ),
          versionSelect: y ? /* @__PURE__ */ o(
            ct,
            {
              versions: Oe,
              currentVersionId: S,
              selectedVersionId: E || S,
              total: pr,
              hasMore: ge,
              loading: Be,
              loadingMore: be,
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
          readonly: ie,
          actions: g && !ie ? /* @__PURE__ */ o(
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
            Re();
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
                  disabled: L || !!C || Ve || !!De,
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
            Mr ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: Ve ? /* @__PURE__ */ v(sr, { children: [
              /* @__PURE__ */ o(Pe, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ o("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ v(sr, { children: [
              /* @__PURE__ */ o("span", { children: De }),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ne(E);
                  },
                  children: [
                    /* @__PURE__ */ o(or, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ o(
              st.Provider,
              {
                value: ze,
                children: /* @__PURE__ */ o(
                  dr,
                  {
                    fallback: /* @__PURE__ */ o(
                      ur,
                      {
                        label: ve ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: ve ? /* @__PURE__ */ o(
                      ht,
                      {
                        teamId: w,
                        projectId: t,
                        canvasId: l,
                        outputAssetId: Number(s.resultRef?.asset_id || y),
                        composition: hr,
                        referenceItems: (U || []).filter(
                          (e) => e.source !== "current" || e.id !== s.id
                        ),
                        connectedMediaReferences: de,
                        readonly: ie || !N || Xe || We,
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
                          }).then(() => y ? H() : void 0).catch(
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
                        readonly: Ir,
                        referenceItems: U,
                        canvasNodes: ke ? Y : void 0,
                        canvasEdges: ke ? ce : void 0,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: ue,
                        storyboardInitialSectionId: le,
                        storyboardWorkspace: ke ? k : void 0,
                        storyboardWorkflowAction: C,
                        storyboardWorkTypes: he?.storyboard_work_types,
                        storyboardReferencePurposes: he?.storyboard_reference_purposes,
                        referenceProvider: ze,
                        onConfirmStoryboard: Dr,
                        onCreateStoryboardRevision: N && !k?.running ? rr : void 0,
                        onGenerateStoryboardShot: k?.running ? void 0 : Ar,
                        onSaveStoryboardShotEdit: Cr,
                        storyboardPromptVersion: y && E ? {
                          projectId: t,
                          assetId: y,
                          versionId: E
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
                      M.current = null, i.reset(), me();
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
