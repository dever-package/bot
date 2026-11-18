import { j as o, a as v, F as tr } from "./space-storyboard-material-ECvLpyk_.js";
import { j as Mr, d as Pe, a as Te, h as cr, k as qr, S as Er } from "./space-assistant-layout-Drz4je9C.js";
import { S as dr, a as d, b as S, d as sr, h as p, u as Me } from "./file-kind-Cq3pESGF.js";
import { w as Pr, r as Ee, ag as Tr, A as xr, Q as _r, ah as nr } from "./vendor-icons-BZHLe0mm.js";
import { q as Lr, r as zr, d as Wr, t as Fr } from "./asset-audio-preview-Cezm24us.js";
import { r as F } from "./site-config-CGpZr2qF.js";
import { a as Hr, T as Or } from "./text-content-save-actions-CrfXuWSV.js";
import { a as Ur, f as or, s as $r, c as Kr, b as Br, d as Gr, e as Qr, r as Jr } from "./writing-run-labels-BAbF9nso.js";
import { b as Xr, d as Yr, c as Zr, m as oe, e as G } from "./space-optional-components-u700_erT.js";
import { k as jr, l as et, m as rt, o as tt, q as ir } from "./writing-reference-Bgk4pNta.js";
import { g as ar, C as ur, N as st } from "./node-detail-header-Cn59agL3.js";
import { u as nt } from "./asset-reference-provider-C7PdpEWk.js";
import { C as ot } from "./node-detail-storyboard-grid-BTpwDOfS.js";
import { i as it } from "./asset-preview-Bb3VoJnt.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-C4MRlvC-.css", import.meta.url).href]);
function at({
  versions: t,
  currentVersionId: u,
  selectedVersionId: b,
  total: P,
  hasMore: s,
  loading: H,
  loadingMore: Q,
  error: ae,
  onSelect: ce,
  onLoadMore: de,
  onRetry: ue
}) {
  return /* @__PURE__ */ o(
    zr,
    {
      options: t.map((T) => ({
        id: Number(T.id || 0),
        version: Number(T.version || 0),
        updatedAt: String(T.updated_at || T.created_at || ""),
        value: T
      })),
      currentVersionId: u,
      selectedVersionId: b,
      total: P,
      hasMore: s,
      loading: H,
      loadingMore: Q,
      error: ae,
      onSelect: ce,
      onLoadMore: de,
      onRetry: ue
    }
  );
}
function ct(t) {
  return Lr(t);
}
function dt({
  projectId: t,
  node: u
}) {
  const b = String(u.runError || "").trim(), { error: P, loading: s } = Xr(t, u), { summary: H, details: Q } = Yr(P || b);
  return b ? /* @__PURE__ */ v("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ o(Pr, { size: 17 }),
    /* @__PURE__ */ v("div", { style: { minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ o("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ o("p", { children: H }),
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
            children: Q
          }
        )
      ] }),
      s ? /* @__PURE__ */ v("small", { children: [
        /* @__PURE__ */ o(Ee, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const ut = Te(
  () => import("./node-detail-editor-BttUfQxu.js")
), lt = Pe(
  ut,
  (t) => t.NodeDetailEditor
), ft = lt.Component, mt = Te(
  () => import("./space-video-compose-view-BCVVXo2i.js")
), vt = Pe(
  mt,
  (t) => t.VideoComposeView
), pt = vt.Component;
function Tt(t) {
  return Mr(
    t.node.power,
    t.node.kind,
    t.node.outputType
  ) ? Zr(
    jr(t.node, t.node.resultOutput)?.document
  ) ? /* @__PURE__ */ o(dr, { fallback: /* @__PURE__ */ o(ur, { label: "正在加载创作工作区" }), children: /* @__PURE__ */ o(
    ht,
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
  ) }) : null : /* @__PURE__ */ o(gt, { ...t });
}
const yt = Pe(
  Te(() => import("./writing-editor-CtbBgqPE.js")),
  (t) => t.WritingEditor
), ht = yt.Component;
function gt({
  projectId: t,
  canvasId: u,
  teamId: b,
  assetCateId: P,
  node: s,
  canvasReferenceItems: H,
  canvasNodes: Q,
  canvasEdges: ae,
  connectedMediaReferences: ce,
  storyboardFocus: de,
  storyboardInitialSectionId: ue,
  storyboardWorkspace: T,
  onNodeDraftChange: lr,
  onConnectedMediaEdgeRemove: fr,
  onRunNode: xe,
  onAssetUpdated: _e,
  onConfirmStoryboard: le,
  onClose: fe,
  layer: mr
}) {
  const [vr, N] = d(""), Le = nt({
    notificationMode: "inline",
    teamID: b,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: P
    }
  }), g = Number(s.asset?.id || 0), me = cr(
    s.power,
    s.kind,
    s.outputType
  ), ve = qr(
    s.power,
    s.kind,
    s.outputType
  ), [pe, ye] = d(null), [pr, ze] = d(
    () => s.composerDraft?.videoComposition || ar()
  ), [We, Fe] = d(!1), [C, J] = d(s.asset), [He, O] = d(
    () => qe(s.asset)
  ), [yr, U] = d(He.length), [Oe, Ue] = d(1), [he, $e] = d(!1), [Ke, ge] = d(g > 0), [we, Be] = d(!1), [hr, be] = d(""), [x, $] = d(
    () => D(s.asset)
  ), [Ge, _] = d(
    null
  ), [Ce, Ve] = d(!1), [De, L] = d(""), [z, Qe] = d(!1), [R, X] = d(""), [Je, Xe] = d(!1), [Ye, ee] = d(!1), [gr, K] = d(0), h = S(C), l = S(x), Y = S(_e), B = S(s), A = S(0), I = S(0), Z = S(null), j = S(null), k = S(null), Se = S(!1);
  h.current = C, l.current = x, Y.current = _e, B.current = s, sr(() => {
    if (!ve || !s.power?.id && !s.power?.key) {
      ye(null);
      return;
    }
    let e = !1;
    return ye(null), Ur({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || ye(r);
    }).catch((r) => {
      e || N(F(r, "加载分镜用途配置失败"));
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
        h.current || B.current.asset
      ), n = r.version, a = G(
        n ? [n] : [],
        e.versions
      ), c = D(r);
      h.current = r, l.current = c, J(r), O(a), U(Math.max(e.versionTotal, a.length)), Ue(1), $e(e.hasMore), $(c), _(null), L(""), K((f) => f + 1), Y.current?.(r);
    },
    []
  ), te = p(
    (e, r = !0) => {
      const n = oe(
        e,
        h.current || B.current.asset
      ), a = D(n);
      h.current = n, l.current = a, J(n), $(a), O((c) => {
        const f = G(
          n.version ? [n.version] : [],
          c
        );
        return U((m) => Math.max(m, f.length)), f;
      }), _(null), L(""), K((c) => c + 1), r && Y.current?.(n);
    },
    []
  ), W = p(async () => {
    if (!g) {
      ge(!1), be("");
      return;
    }
    const e = A.current + 1;
    A.current = e, ge(!0), be("");
    try {
      const r = await or({ projectId: t, assetId: g });
      if (e !== A.current)
        return;
      re(r);
    } catch (r) {
      if (e !== A.current)
        return;
      be(F(r, "读取版本记录失败"));
    } finally {
      e === A.current && ge(!1);
    }
  }, [re, g, t]);
  sr(() => {
    h.current = s.asset, J(s.asset), O(qe(s.asset)), U(qe(s.asset).length);
    const e = D(s.asset);
    return l.current = e, $(e), _(null), L(""), X(""), j.current = null, K((r) => r + 1), ze(
      s.composerDraft?.videoComposition || ar()
    ), W(), () => {
      A.current += 1, I.current += 1;
    };
  }, [W, s.id]);
  const V = D(C), M = !x || x === V, q = M ? C?.version : Ge, Ze = Me(
    () => et(s, q, C?.kind),
    [q, C?.kind, s]
  ), y = !!(M && Ze.mode === "rich" && (C?.kind === "text" || C?.kind === "richtext")), se = Me(
    () => rt(s, q, {
      includeNodeResult: M
    }),
    [q, M, s]
  ), je = Me(() => {
    const e = Wr(se);
    return e.length === 1 ? e[0] : void 0;
  }, [se]), wr = typeof q?.source?.prompt == "string" ? q.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), Ne = p(
    async (e, r = {}) => {
      const n = h.current, a = n?.version, c = D(n);
      if (!n?.id || !a?.id || l.current !== c)
        throw new Error("当前内容不可编辑");
      const f = await $r({
        projectId: t,
        assetId: n.id,
        versionId: a.id,
        expectedUpdatedAt: e.mode === "storyboard" || r.saveMode !== void 0 ? a.updated_at || a.created_at || "" : void 0,
        requestId: r.requestId,
        saveMode: r.saveMode,
        content: tt(e)
      }), m = oe(
        f,
        n
      );
      m.version && (m.version = {
        ...m.version,
        summary: e.summary
      });
      const w = D(m);
      h.current = m, l.current = w, J(m), $(w), O(
        (Ae) => G(
          Ae,
          m.version ? [m.version] : []
        )
      ), w && w !== c && U((Ae) => Ae + 1), Y.current?.(m);
    },
    [t]
  ), i = Hr({
    value: Ze,
    resetKey: `${s.id}:${x}:${gr}`,
    fingerprint: ir,
    save: (e) => Ne(
      e,
      y ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (e) => N(F(e, "保存失败")),
    autoSave: !y
  }), br = p(async () => {
    await i.flush() && (k.current = null);
  }, [i.flush]), Cr = p(async () => {
    const e = h.current, r = e?.version;
    if (!e?.id || !r?.id) {
      N("当前资产版本不可用");
      return;
    }
    const n = ir(i.draft), a = k.current?.versionId === r.id && k.current.fingerprint === n ? k.current : {
      versionId: r.id,
      fingerprint: n,
      requestId: ie("manual-edit", r.id)
    };
    k.current = a, await i.flushWith(
      (f) => Ne(f, {
        saveMode: "create_version",
        requestId: a.requestId
      })
    ) && (k.current = null);
  }, [i.draft, i.flushWith, Ne]), ne = p(() => !y || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (k.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, y]), Vr = p(async () => {
    if (!(R || !le)) {
      X("confirming");
      try {
        if (await i.flush()) {
          const e = A.current, r = I.current, n = B.current.id, a = l.current;
          le((c) => {
            e !== A.current || r !== I.current || n !== B.current.id || a !== l.current || te(c, !1);
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
    R
  ]), er = p(async () => {
    if (R)
      return;
    const e = h.current, r = l.current;
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
      const a = await Kr({
        projectId: t,
        assetId: e.id,
        versionId: r,
        requestId: n.requestId,
        nodeKey: s.id
      });
      te(a), j.current = null, W();
    } catch (n) {
      N(F(n, "创建分镜修订稿失败"));
    } finally {
      X("");
    }
  }, [
    te,
    W,
    s.id,
    t,
    R
  ]), Dr = p(
    async (e, r, n) => {
      const a = h.current, c = B.current, f = D(a), m = Number(c.power?.id || 0), w = String(c.power?.key || "").trim();
      if (!a?.id || !f)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!m && !w)
        throw new Error("当前分镜节点未配置生成能力");
      return Br({
        projectId: t,
        canvasId: u,
        assetId: a.id,
        versionId: f,
        flowId: Number(c.flow?.id || a.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || a.asset_cate_id || P
        ),
        requestId: ie("shot", f),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: m,
        powerKey: w,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: e,
        shotId: r,
        instruction: n
      });
    },
    [P, t, u]
  ), Sr = p(async () => {
    if (l.current === V) {
      if (y) {
        if (!ne()) return;
      } else if (!await i.flush()) return;
    }
    await W();
  }, [
    V,
    ne,
    i.flush,
    y,
    W
  ]), Ie = p(
    async (e) => {
      if (!g || !e || e === V)
        return;
      const r = I.current + 1;
      I.current = r, Ve(!0), L(""), _(null);
      try {
        const n = await Gr({
          projectId: t,
          assetId: g,
          versionId: e
        });
        if (r !== I.current || l.current !== e)
          return;
        _(n), K((a) => a + 1);
      } catch (n) {
        if (r !== I.current)
          return;
        L(F(n, "读取历史版本失败"));
      } finally {
        r === I.current && Ve(!1);
      }
    },
    [g, V, t]
  ), rr = p(
    async (e) => {
      if (z)
        return;
      const r = Number(e.id || 0);
      if (!(!r || r === l.current)) {
        if (l.current === V) {
          if (y) {
            if (!ne()) return;
          } else if (!await i.flush()) return;
        }
        if (l.current = r, Z.current = null, $(r), r === V) {
          I.current += 1, _(null), L(""), Ve(!1), K((n) => n + 1);
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
      z
    ]
  ), Nr = p(async () => {
    if (!(!g || !he || we)) {
      Be(!0);
      try {
        const e = await Qr({
          projectId: t,
          assetId: g,
          page: Oe + 1
        });
        O((r) => G(r, e.items)), Ue(e.page), U(e.total), $e(e.hasMore);
      } catch (e) {
        N(F(e, "加载更多版本失败"));
      } finally {
        Be(!1);
      }
    }
  }, [g, he, t, we, Oe]), Ir = p(async () => {
    const e = h.current, r = l.current;
    if (!(z || !e?.id || !r || r === D(e))) {
      Qe(!0);
      try {
        const n = Z.current?.versionId === r ? Z.current : {
          versionId: r,
          requestId: ie("restore", r)
        };
        Z.current = n;
        const a = await Jr({
          projectId: t,
          assetId: e.id,
          versionId: r,
          requestId: n.requestId,
          nodeKey: s.id
        }), c = oe(
          a,
          e
        );
        h.current = c, J(c), Y.current?.(c);
        try {
          const f = await or({
            projectId: t,
            assetId: e.id
          });
          re(f);
        } catch {
          const f = c.version;
          O(
            (w) => G(f ? [f] : [], w)
          ), U((w) => w + 1);
          const m = D(c);
          l.current = m, $(m), _(null), L(""), K((w) => w + 1);
        }
        Z.current = null;
      } catch (n) {
        N(F(n, "切换版本失败"));
      } finally {
        Qe(!1);
      }
    }
  }, [re, s.id, t, z]), ke = p(async () => {
    if (Se.current)
      return;
    if (y && i.hasPendingChanges) {
      ee(!0);
      return;
    }
    Se.current = !0, Xe(!0);
    let e = !0;
    const r = h.current;
    if (i.hasPendingChanges && r?.id && r?.version?.id && l.current === D(r) && (e = await i.flush()), !e) {
      Se.current = !1, Xe(!1), ee(!0);
      return;
    }
    fe();
  }, [i.flush, i.hasPendingChanges, y, fe]), E = i.draft, kr = E.mode === "storyboard" && it(E.value), Re = !M || !me && (!C?.id || !C?.version?.id) || kr, Rr = Re || Je || g > 0 && Ke || ve && !pe, Ar = !M && (Ce || De);
  return /* @__PURE__ */ v(
    Fr,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      layer: mr,
      onRequestClose: ke,
      onEscape: () => {
        if (Ye) ee(!1);
        else return ke();
      },
      header: /* @__PURE__ */ o(
        st,
        {
          node: s,
          contentLabel: wt(
            E,
            s,
            y ? void 0 : je
          ),
          versionSelect: g ? /* @__PURE__ */ o(
            at,
            {
              versions: He,
              currentVersionId: V,
              selectedVersionId: x || V,
              total: yr,
              hasMore: he,
              loading: Ke,
              loadingMore: we,
              error: hr,
              onSelect: (e) => {
                rr(e);
              },
              onLoadMore: () => {
                Nr();
              },
              onRetry: () => {
                Sr();
              }
            }
          ) : void 0,
          updatedAt: ct(
            q?.updated_at || q?.created_at
          ),
          status: i.status,
          readonly: Re,
          actions: y && !Re ? /* @__PURE__ */ o(
            Or,
            {
              status: i.status,
              hasPendingChanges: i.hasPendingChanges,
              onReset: () => {
                k.current = null, i.reset();
              },
              onSaveAsNewVersion: () => {
                Cr();
              },
              onSave: () => {
                br();
              }
            }
          ) : void 0,
          downloadUrl: E.downloadUrl,
          onRetry: () => {
            i.retry();
          },
          onClose: () => {
            ke();
          }
        }
      ),
      children: [
        /* @__PURE__ */ v("main", { className: "wb-detail-workspace", children: [
          M ? null : /* @__PURE__ */ v("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ v("span", { children: [
              /* @__PURE__ */ o(Tr, { size: 14 }),
              "正在查看第 ",
              Ge?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ v("div", { children: [
              /* @__PURE__ */ v(
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
                    /* @__PURE__ */ o(xr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: z || !!R || Ce || !!De,
                  onClick: () => E.mode === "storyboard" ? void er() : void Ir(),
                  children: [
                    z || R === "revising" ? /* @__PURE__ */ o(Ee, { size: 13, className: "wb-detail-spin" }) : E.mode === "storyboard" ? /* @__PURE__ */ o(_r, { size: 13 }) : /* @__PURE__ */ o(nr, { size: 13 }),
                    E.mode === "storyboard" ? R === "revising" ? "创建中" : "基于此版本创建修订稿" : z ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ v("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ o(
              Er,
              {
                message: vr,
                onDismiss: () => N("")
              }
            ),
            /* @__PURE__ */ o(dt, { projectId: t, node: s }),
            Ar ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: Ce ? /* @__PURE__ */ v(tr, { children: [
              /* @__PURE__ */ o(Ee, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ o("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ v(tr, { children: [
              /* @__PURE__ */ o("span", { children: De }),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ie(x);
                  },
                  children: [
                    /* @__PURE__ */ o(nr, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ o(
              ot.Provider,
              {
                value: Le,
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
                      pt,
                      {
                        composition: pr,
                        referenceItems: H || [],
                        connectedMediaReferences: ce,
                        readonly: !M || Je || We,
                        running: We,
                        fullScreen: !0,
                        finalOutput: se,
                        onChange: (e) => {
                          ze(e), lr?.({
                            ...s.composerDraft || {},
                            videoComposition: e
                          });
                        },
                        onConnectedMediaEdgeRemove: fr,
                        onRun: xe ? (e) => {
                          Fe(!0), xe({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: e
                            }
                          }).then(() => g ? W() : void 0).catch(
                            (r) => N(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => Fe(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ o(
                      ft,
                      {
                        content: E,
                        assetKind: C?.kind || s.kind,
                        mediaOutput: y ? void 0 : se,
                        mediaKind: y ? void 0 : je,
                        mediaPrompt: wr,
                        readonly: Rr,
                        referenceItems: H,
                        canvasNodes: Q,
                        canvasEdges: ae,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: de,
                        storyboardInitialSectionId: ue,
                        storyboardWorkspace: T,
                        storyboardWorkflowAction: R,
                        storyboardWorkTypes: pe?.storyboard_work_types,
                        storyboardReferencePurposes: pe?.storyboard_reference_purposes,
                        referenceProvider: Le,
                        onConfirmStoryboard: Vr,
                        onCreateStoryboardRevision: er,
                        onGenerateStoryboardShot: Dr,
                        onChange: i.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        Ye ? /* @__PURE__ */ o("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ v(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ o("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ o("p", { children: y ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ v("div", { children: [
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
                      k.current = null, i.reset(), fe();
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
function qe(t) {
  return G(
    t?.version ? [t.version] : [],
    t?.versions || []
  );
}
function D(t) {
  return Number(t?.version_id || t?.version?.id || 0);
}
function wt(t, u, b) {
  return t.mode === "setting" ? "设定" : t.mode === "storyboard" ? "分镜脚本" : cr(u.power, u.kind, u.outputType) ? "视频合成" : b === "image" ? "图片内容" : b === "video" ? "视频内容" : b === "audio" ? "音频内容" : t.mode === "file" ? "文件" : u.kind === "image" || u.kind === "richtext" ? "图文内容" : u.kind === "video" ? "视频内容" : u.kind === "audio" ? "音频内容" : t.format === "markdown" ? "Markdown" : "富文本";
}
function ie(t, u) {
  const b = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${u}-${b}`.slice(0, 64);
}
export {
  Tt as NodeDetailDialog
};
