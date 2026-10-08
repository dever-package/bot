import { j as n, a as l, F as tr } from "./react-CDpwMNlY.js";
import { a as d, e as S, b as Pe, h as p, u as qe, S as kr } from "./file-kind-DFeonxO2.js";
import { ah as Ee, r as le, ai as Nr, W as Sr, k as Ir, a9 as Rr, a8 as Ar, M as Mr, b as Pr, I as qr, aj as Tr, A as Er, w as xr } from "./vendor-icons-Cz5zFzlk.js";
import { t as V } from "./index-CVhTq79S.js";
import { D as Lr, B as _r, o as zr, q as $r, r as Fr, t as Hr, u as Kr, v as Ur, w as sr, i as Wr, x as Br } from "./node-detail-content-DEcv8fc7.js";
import { k as F } from "./site-config-cvPYHSmK.js";
import { u as Or, d as Gr, T as Yr } from "./asset-reference-provider-d_hsIG-H.js";
import { u as Jr, h as nr, j as Qr, m as ue, k as O, l as or, s as Xr, n as Zr, o as jr, q as et, t as rt, v as tt, g as st } from "./space-page-B7eY-TDj.js";
import { r as nt, P as ot, i as ir, a as it } from "./power-icon-Dfs_ppQs.js";
import { C as at } from "./node-detail-storyboard-grid-CH2K8EO1.js";
import { d as ar, c as cr } from "./preloadable-B6OSmL0f.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-DY0zHnl-.css", import.meta.url).href]);
function ct({
  node: t,
  contentLabel: u,
  versionSelect: f,
  updatedAt: s,
  status: D,
  readonly: G,
  actions: Y,
  downloadUrl: J,
  onRetry: Q,
  onClose: X
}) {
  const A = t.type === "power" ? nt(t.power, t.kind, t.outputType) : null, I = A && A.outputName !== u ? `${A.outputName} · ${u}` : A?.outputName || u;
  return /* @__PURE__ */ n(
    Lr,
    {
      icon: /* @__PURE__ */ n(dt, { node: t }),
      title: t.title || "节点详情",
      subtitle: I,
      versionSelect: f,
      state: G ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }) : D === "error" ? /* @__PURE__ */ n(_r, { label: "重试保存", children: /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: Q,
          children: [
            /* @__PURE__ */ n(Ee, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ l("span", { className: `wb-detail-state is-${D}`, children: [
        D === "saving" ? /* @__PURE__ */ n(le, { size: 12, className: "wb-detail-spin" }) : null,
        ut(D)
      ] }),
      updatedAt: s,
      actions: Y,
      downloadUrl: J,
      onClose: X
    }
  );
}
function ut(t) {
  return t === "dirty" ? "未保存" : t === "saving" ? "保存中" : "已保存";
}
function dt({ node: t }) {
  if (t.type === "power")
    return /* @__PURE__ */ n(
      ot,
      {
        power: t.power,
        kind: t.kind,
        outputType: t.outputType,
        size: 16
      }
    );
  const u = lt(t);
  return /* @__PURE__ */ n(u, { size: 16 });
}
function lt(t) {
  return t.type === "agent" ? Nr : t.type === "flow" ? Sr : t.type === "function" ? Ir : t.kind === "image" ? Rr : t.kind === "video" ? Ar : t.kind === "audio" ? Mr : Pr;
}
function ft({
  versions: t,
  currentVersionId: u,
  selectedVersionId: f,
  total: s,
  hasMore: D,
  loading: G,
  loadingMore: Y,
  error: J,
  onSelect: Q,
  onLoadMore: X,
  onRetry: A
}) {
  return /* @__PURE__ */ n(
    $r,
    {
      options: t.map((I) => ({
        id: Number(I.id || 0),
        version: Number(I.version || 0),
        updatedAt: String(I.updated_at || I.created_at || ""),
        value: I
      })),
      currentVersionId: u,
      selectedVersionId: f,
      total: s,
      hasMore: D,
      loading: G,
      loadingMore: Y,
      error: J,
      onSelect: Q,
      onLoadMore: X,
      onRetry: A
    }
  );
}
function mt(t) {
  return zr(t);
}
function pt({
  projectId: t,
  node: u
}) {
  const f = String(u.runError || "").trim(), { error: s, loading: D } = Jr(t, u);
  return f ? /* @__PURE__ */ l("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ n(qr, { size: 17 }),
    /* @__PURE__ */ l("div", { children: [
      /* @__PURE__ */ n("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ n("p", { children: s || f }),
      D ? /* @__PURE__ */ l("small", { children: [
        /* @__PURE__ */ n(le, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const vt = cr(
  () => import("./node-detail-editor-o3EusoPH.js")
), yt = ar(
  vt,
  (t) => t.NodeDetailEditor
), ht = yt.Component, wt = cr(
  () => import("./space-video-compose-view-CFMmQesX.js")
), gt = ar(
  wt,
  (t) => t.VideoComposeView
), bt = gt.Component;
function Tt({
  projectId: t,
  teamId: u,
  assetCateId: f,
  node: s,
  canvasReferenceItems: D,
  canvasNodes: G,
  connectedMediaReferences: Y,
  storyboardFocus: J,
  storyboardInitialSectionId: Q,
  storyboardWorkspace: X,
  onNodeDraftChange: A,
  onConnectedMediaEdgeRemove: I,
  onRunNode: xe,
  onAssetUpdated: Le,
  onConfirmStoryboard: fe,
  onClose: me
}) {
  const _e = Or({
    teamID: u,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: f
    }
  }), g = Number(s.asset?.id || 0), pe = ir(
    s.power,
    s.kind,
    s.outputType
  ), ve = it(
    s.power,
    s.kind,
    s.outputType
  ), [ye, he] = d(null), [ur, ze] = d(
    () => s.composerDraft?.videoComposition || nr()
  ), [$e, Fe] = d(!1), [C, Z] = d(s.asset), [He, H] = d(
    () => Te(s.asset)
  ), [dr, K] = d(He.length), [Ke, Ue] = d(1), [we, We] = d(!1), [Be, ge] = d(g > 0), [be, Oe] = d(!1), [lr, Ce] = d(""), [E, U] = d(
    () => N(s.asset)
  ), [Ge, x] = d(
    null
  ), [Ve, De] = d(!1), [ke, L] = d(""), [_, Ye] = d(!1), [M, j] = d(""), [Je, Qe] = d(!1), [Ne, se] = d(!1), [fr, W] = d(0), w = S(C), v = S(E), ee = S(Le), ne = S(s), B = S(0), z = S(0), re = S(null), te = S(null), R = S(null), Se = S(!1);
  w.current = C, v.current = E, ee.current = Le, ne.current = s, Pe(() => {
    if (!ve || !s.power?.id && !s.power?.key) {
      he(null);
      return;
    }
    let e = !1;
    return he(null), Qr({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || he(r);
    }).catch((r) => {
      e || V.error(F(r, "加载分镜用途配置失败"));
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
  const oe = p(
    (e) => {
      const r = ue(
        { ...e.asset, versions: e.versions },
        w.current || ne.current.asset
      ), o = r.version, a = O(
        o ? [o] : [],
        e.versions
      ), c = N(r);
      w.current = r, v.current = c, Z(r), H(a), K(Math.max(e.versionTotal, a.length)), Ue(1), We(e.hasMore), U(c), x(null), L(""), W((m) => m + 1), ee.current?.(r);
    },
    []
  ), Xe = p((e) => {
    const r = ue(
      e,
      w.current || ne.current.asset
    ), o = N(r);
    w.current = r, v.current = o, Z(r), U(o), H((a) => {
      const c = O(
        r.version ? [r.version] : [],
        a
      );
      return K((m) => Math.max(m, c.length)), c;
    }), x(null), L(""), W((a) => a + 1), ee.current?.(r);
  }, []), $ = p(async () => {
    if (!g) {
      ge(!1), Ce("");
      return;
    }
    const e = B.current + 1;
    B.current = e, ge(!0), Ce("");
    try {
      const r = await or({ projectId: t, assetId: g });
      if (e !== B.current)
        return;
      oe(r);
    } catch (r) {
      if (e !== B.current)
        return;
      Ce(F(r, "读取版本记录失败"));
    } finally {
      e === B.current && ge(!1);
    }
  }, [oe, g, t]);
  Pe(() => {
    w.current = s.asset, Z(s.asset), H(Te(s.asset)), K(Te(s.asset).length);
    const e = N(s.asset);
    return v.current = e, U(e), x(null), L(""), j(""), te.current = null, W((r) => r + 1), ze(
      s.composerDraft?.videoComposition || nr()
    ), $(), () => {
      B.current += 1, z.current += 1;
    };
  }, [$, s.id]);
  const k = N(C), P = !E || E === k, q = P ? C?.version : Ge, Ze = qe(
    () => Fr(s, q, C?.kind),
    [q, C?.kind, s]
  ), y = !!(P && Ze.mode === "rich" && (C?.kind === "text" || C?.kind === "richtext")), ie = qe(
    () => Hr(s, q, {
      includeNodeResult: P
    }),
    [q, P, s]
  ), je = qe(() => {
    const e = Kr(ie);
    return e.length === 1 ? e[0] : void 0;
  }, [ie]), mr = typeof q?.source?.prompt == "string" ? q.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), Ie = p(
    async (e, r = {}) => {
      const o = w.current, a = o?.version, c = N(o);
      if (!o?.id || !a?.id || v.current !== c)
        throw new Error("当前内容不可编辑");
      const m = await Xr({
        projectId: t,
        assetId: o.id,
        versionId: a.id,
        expectedUpdatedAt: r.saveMode !== void 0 ? a.updated_at || a.created_at || "" : void 0,
        requestId: r.requestId,
        saveMode: r.saveMode,
        content: Ur(e)
      }), h = ue(
        m,
        o
      );
      h.version && (h.version = {
        ...h.version,
        summary: e.summary
      });
      const b = N(h);
      w.current = h, v.current = b, Z(h), U(b), H(
        (Me) => O(
          Me,
          h.version ? [h.version] : []
        )
      ), b && b !== c && K((Me) => Me + 1), ee.current?.(h);
    },
    [t]
  ), i = Gr({
    value: Ze,
    resetKey: `${s.id}:${E}:${fr}`,
    fingerprint: sr,
    save: (e) => Ie(
      e,
      y ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (e) => V.error(F(e, "保存失败")),
    autoSave: !y
  }), pr = p(async () => {
    await i.flush() && (R.current = null, V.success("正文已保存"));
  }, [i.flush]), vr = p(async () => {
    const e = w.current, r = e?.version;
    if (!e?.id || !r?.id) {
      V.error("当前资产版本不可用");
      return;
    }
    const o = sr(i.draft), a = R.current?.versionId === r.id && R.current.fingerprint === o ? R.current : {
      versionId: r.id,
      fingerprint: o,
      requestId: de("manual-edit", r.id)
    };
    R.current = a, await i.flushWith(
      (m) => Ie(m, {
        saveMode: "create_version",
        requestId: a.requestId
      })
    ) && (R.current = null, V.success("已保存为新版本"));
  }, [i.draft, i.flushWith, Ie]), ae = p(() => !y || !i.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (R.current = null, i.reset(), !0) : !1, [i.hasPendingChanges, i.reset, y]), yr = p(async () => {
    if (!(M || !fe)) {
      j("confirming");
      try {
        await i.flush() && fe();
      } finally {
        j("");
      }
    }
  }, [i.flush, fe, M]), er = p(async () => {
    if (M)
      return;
    const e = w.current, r = v.current;
    if (!e?.id || !r) {
      V.error("当前分镜版本不可用");
      return;
    }
    j("revising");
    try {
      const o = te.current?.versionId === r ? te.current : {
        versionId: r,
        requestId: de("revision", r)
      };
      te.current = o;
      const a = await Zr({
        projectId: t,
        assetId: e.id,
        versionId: r,
        requestId: o.requestId,
        nodeKey: s.id
      });
      Xe(a), te.current = null, V.success("已创建新的分镜修订稿"), $();
    } catch (o) {
      V.error(F(o, "创建分镜修订稿失败"));
    } finally {
      j("");
    }
  }, [
    Xe,
    $,
    s.id,
    t,
    M
  ]), hr = p(
    async (e, r, o) => {
      const a = w.current, c = ne.current, m = N(a), h = Number(c.power?.id || 0), b = String(c.power?.key || "").trim();
      if (!a?.id || !m)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!h && !b)
        throw new Error("当前分镜节点未配置生成能力");
      return jr({
        projectId: t,
        assetId: a.id,
        versionId: m,
        flowId: Number(c.flow?.id || a.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || a.asset_cate_id || f
        ),
        requestId: de("shot", m),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: h,
        powerKey: b,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: e,
        shotId: r,
        instruction: o
      });
    },
    [f, t]
  ), wr = p(async () => {
    if (v.current === k) {
      if (y) {
        if (!ae()) return;
      } else if (!await i.flush()) return;
    }
    await $();
  }, [
    k,
    ae,
    i.flush,
    y,
    $
  ]), Re = p(
    async (e) => {
      if (!g || !e || e === k)
        return;
      const r = z.current + 1;
      z.current = r, De(!0), L(""), x(null);
      try {
        const o = await et({
          projectId: t,
          assetId: g,
          versionId: e
        });
        if (r !== z.current || v.current !== e)
          return;
        x(o), W((a) => a + 1);
      } catch (o) {
        if (r !== z.current)
          return;
        L(F(o, "读取历史版本失败"));
      } finally {
        r === z.current && De(!1);
      }
    },
    [g, k, t]
  ), rr = p(
    async (e) => {
      if (_)
        return;
      const r = Number(e.id || 0);
      if (!(!r || r === v.current)) {
        if (v.current === k) {
          if (y) {
            if (!ae()) return;
          } else if (!await i.flush()) return;
        }
        if (v.current = r, re.current = null, U(r), r === k) {
          z.current += 1, x(null), L(""), De(!1), W((o) => o + 1);
          return;
        }
        await Re(r);
      }
    },
    [
      k,
      ae,
      i.flush,
      y,
      Re,
      _
    ]
  ), gr = p(async () => {
    if (!(!g || !we || be)) {
      Oe(!0);
      try {
        const e = await rt({
          projectId: t,
          assetId: g,
          page: Ke + 1
        });
        H((r) => O(r, e.items)), Ue(e.page), K(e.total), We(e.hasMore);
      } catch (e) {
        V.error(F(e, "加载更多版本失败"));
      } finally {
        Oe(!1);
      }
    }
  }, [g, we, t, be, Ke]), br = p(async () => {
    const e = w.current, r = v.current;
    if (!(_ || !e?.id || !r || r === N(e))) {
      Ye(!0);
      try {
        const o = re.current?.versionId === r ? re.current : {
          versionId: r,
          requestId: de("restore", r)
        };
        re.current = o;
        const a = await tt({
          projectId: t,
          assetId: e.id,
          versionId: r,
          requestId: o.requestId,
          nodeKey: s.id
        }), c = ue(
          a,
          e
        );
        w.current = c, Z(c), ee.current?.(c);
        try {
          const m = await or({
            projectId: t,
            assetId: e.id
          });
          oe(m);
        } catch {
          const m = c.version;
          H(
            (b) => O(m ? [m] : [], b)
          ), K((b) => b + 1);
          const h = N(c);
          v.current = h, U(h), x(null), L(""), W((b) => b + 1);
        }
        re.current = null, V.success("已切换到所选版本");
      } catch (o) {
        V.error(F(o, "切换版本失败"));
      } finally {
        Ye(!1);
      }
    }
  }, [oe, s.id, t, _]), ce = p(async () => {
    if (Se.current)
      return;
    if (y && i.hasPendingChanges) {
      se(!0);
      return;
    }
    Se.current = !0, Qe(!0);
    let e = !0;
    const r = w.current;
    if (i.hasPendingChanges && r?.id && r?.version?.id && v.current === N(r) && (e = await i.flush()), !e) {
      Se.current = !1, Qe(!1), se(!0);
      return;
    }
    me();
  }, [i.flush, i.hasPendingChanges, y, me]);
  Pe(() => {
    const e = (r) => {
      if (r.key === "Escape") {
        if (r.preventDefault(), Ne) {
          se(!1);
          return;
        }
        ce();
      }
    };
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [ce, Ne]);
  const T = i.draft, Cr = T.mode === "storyboard" && Wr(T.value), Ae = !P || !pe && (!C?.id || !C?.version?.id) || Cr, Vr = Ae || Je || g > 0 && Be || ve && !ye, Dr = !P && (Ve || ke);
  return /* @__PURE__ */ l(
    Br,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      onRequestClose: ce,
      header: /* @__PURE__ */ n(
        ct,
        {
          node: s,
          contentLabel: Ct(
            T,
            s,
            y ? void 0 : je
          ),
          versionSelect: g ? /* @__PURE__ */ n(
            ft,
            {
              versions: He,
              currentVersionId: k,
              selectedVersionId: E || k,
              total: dr,
              hasMore: we,
              loading: Be,
              loadingMore: be,
              error: lr,
              onSelect: (e) => {
                rr(e);
              },
              onLoadMore: () => {
                gr();
              },
              onRetry: () => {
                wr();
              }
            }
          ) : void 0,
          updatedAt: mt(
            q?.updated_at || q?.created_at
          ),
          status: i.status,
          readonly: Ae,
          actions: y && !Ae ? /* @__PURE__ */ n(
            Yr,
            {
              status: i.status,
              hasPendingChanges: i.hasPendingChanges,
              onReset: () => {
                R.current = null, i.reset();
              },
              onSaveAsNewVersion: () => {
                vr();
              },
              onSave: () => {
                pr();
              }
            }
          ) : void 0,
          downloadUrl: T.downloadUrl,
          onRetry: () => {
            i.retry();
          },
          onClose: () => {
            ce();
          }
        }
      ),
      children: [
        /* @__PURE__ */ l("main", { className: "wb-detail-workspace", children: [
          P ? null : /* @__PURE__ */ l("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ n(Tr, { size: 14 }),
              "正在查看第 ",
              Ge?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    rr(
                      C?.version || { id: k }
                    );
                  },
                  children: [
                    /* @__PURE__ */ n(Er, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: _ || !!M || Ve || !!ke,
                  onClick: () => T.mode === "storyboard" ? void er() : void br(),
                  children: [
                    _ || M === "revising" ? /* @__PURE__ */ n(le, { size: 13, className: "wb-detail-spin" }) : T.mode === "storyboard" ? /* @__PURE__ */ n(xr, { size: 13 }) : /* @__PURE__ */ n(Ee, { size: 13 }),
                    T.mode === "storyboard" ? M === "revising" ? "创建中" : "基于此版本创建修订稿" : _ ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ n(pt, { projectId: t, node: s }),
            Dr ? /* @__PURE__ */ n("div", { className: "wb-detail-content-state", children: Ve ? /* @__PURE__ */ l(tr, { children: [
              /* @__PURE__ */ n(le, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ n("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ l(tr, { children: [
              /* @__PURE__ */ n("span", { children: ke }),
              /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Re(E);
                  },
                  children: [
                    /* @__PURE__ */ n(Ee, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ n(
              at.Provider,
              {
                value: _e,
                children: /* @__PURE__ */ n(
                  kr,
                  {
                    fallback: /* @__PURE__ */ n(
                      st,
                      {
                        label: pe ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: pe ? /* @__PURE__ */ n(
                      bt,
                      {
                        composition: ur,
                        referenceItems: D || [],
                        connectedMediaReferences: Y,
                        readonly: !P || Je || $e,
                        running: $e,
                        fullScreen: !0,
                        finalOutput: ie,
                        onChange: (e) => {
                          ze(e), A?.({
                            ...s.composerDraft || {},
                            videoComposition: e
                          });
                        },
                        onConnectedMediaEdgeRemove: I,
                        onRun: xe ? (e) => {
                          Fe(!0), xe({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: e
                            }
                          }).then(() => g ? $() : void 0).catch(
                            (r) => V.error(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => Fe(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ n(
                      ht,
                      {
                        content: T,
                        assetKind: C?.kind || s.kind,
                        mediaOutput: y ? void 0 : ie,
                        mediaKind: y ? void 0 : je,
                        mediaPrompt: mr,
                        readonly: Vr,
                        referenceItems: D,
                        canvasNodes: G,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: J,
                        storyboardInitialSectionId: Q,
                        storyboardWorkspace: X,
                        storyboardWorkflowAction: M,
                        storyboardWorkTypes: ye?.storyboard_work_types,
                        storyboardReferencePurposes: ye?.storyboard_reference_purposes,
                        referenceProvider: _e,
                        onConfirmStoryboard: yr,
                        onCreateStoryboardRevision: er,
                        onGenerateStoryboardShot: hr,
                        onChange: i.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        Ne ? /* @__PURE__ */ n("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ l(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ n("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ n("p", { children: y ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ l("div", { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => se(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    onClick: () => {
                      R.current = null, i.reset(), me();
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
function Te(t) {
  return O(
    t?.version ? [t.version] : [],
    t?.versions || []
  );
}
function N(t) {
  return Number(t?.version_id || t?.version?.id || 0);
}
function Ct(t, u, f) {
  return t.mode === "storyboard" ? "分镜脚本" : ir(u.power, u.kind, u.outputType) ? "视频合成" : f === "image" ? "图片内容" : f === "video" ? "视频内容" : f === "audio" ? "音频内容" : t.mode === "file" ? "文件" : u.kind === "image" || u.kind === "richtext" ? "图文内容" : u.kind === "video" ? "视频内容" : u.kind === "audio" ? "音频内容" : t.format === "markdown" ? "Markdown" : "富文本";
}
function de(t, u) {
  const f = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${u}-${f}`.slice(0, 64);
}
export {
  Tt as NodeDetailDialog
};
