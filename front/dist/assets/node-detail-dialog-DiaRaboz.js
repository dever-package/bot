import { j as n, a as f, F as er, b as nr, c as or } from "./preloadable-Bomi5PEU.js";
import { a as l, d as I, b as Pe, e as p, u as Te, S as Vr } from "./_commonjsHelpers-61wyk6v6.js";
import { ah as Ee, r as fe, ai as Dr, W as Sr, k as kr, a9 as Nr, a8 as Ir, M as Ar, b as Rr, v as Mr, aj as Pr, A as Tr, z as qr } from "./vendor-icons-DwjYEojZ.js";
import { t as g } from "./index-BqbNvFGg.js";
import { B as Er, D as xr, o as _r, q as Lr, r as zr, i as $r, t as Fr } from "./upload-asset-api-DDv34zo1.js";
import { k as E } from "./site-config-C63CM9jT.js";
import { u as Hr, T as Kr } from "./asset-page-B8_TS_uu.js";
import { u as Ur, f as rr, g as Wr, m as de, h as O, j as tr, s as Br, k as Or, l as Gr, n as Zr, o as Jr, p as Qr, q as Xr, C as Yr } from "./space-page-DNcfUpZn.js";
import { u as jr, r as et, b as rt, s as tt, c as sr } from "./node-detail-content-BcHQCibx.js";
import { r as st, P as nt, i as ir, a as ot } from "./power-icon-DzGqVPMs.js";
import { C as it } from "./node-detail-storyboard-grid-BaQl8hZ4.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-DZhwTxuA.css", import.meta.url).href]);
function at({
  node: t,
  contentLabel: u,
  versionSelect: m,
  updatedAt: s,
  status: S,
  readonly: G,
  actions: Z,
  downloadUrl: J,
  onRetry: Q,
  onClose: X
}) {
  const R = t.type === "power" ? st(t.power, t.kind, t.outputType) : null, N = R && R.outputName !== u ? `${R.outputName} · ${u}` : R?.outputName || u;
  return /* @__PURE__ */ n(
    xr,
    {
      icon: /* @__PURE__ */ n(ut, { node: t }),
      title: t.title || "节点详情",
      subtitle: N,
      versionSelect: m,
      state: G ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }) : S === "error" ? /* @__PURE__ */ n(Er, { label: "重试保存", children: /* @__PURE__ */ f(
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
      ) }) : /* @__PURE__ */ f("span", { className: `wb-detail-state is-${S}`, children: [
        S === "saving" ? /* @__PURE__ */ n(fe, { size: 12, className: "wb-detail-spin" }) : null,
        ct(S)
      ] }),
      updatedAt: s,
      actions: Z,
      downloadUrl: J,
      onClose: X
    }
  );
}
function ct(t) {
  return t === "dirty" ? "未保存" : t === "saving" ? "保存中" : "已保存";
}
function ut({ node: t }) {
  if (t.type === "power")
    return /* @__PURE__ */ n(
      nt,
      {
        power: t.power,
        kind: t.kind,
        outputType: t.outputType,
        size: 16
      }
    );
  const u = dt(t);
  return /* @__PURE__ */ n(u, { size: 16 });
}
function dt(t) {
  return t.type === "agent" ? Dr : t.type === "flow" ? Sr : t.type === "function" ? kr : t.kind === "image" ? Nr : t.kind === "video" ? Ir : t.kind === "audio" ? Ar : Rr;
}
function lt({
  versions: t,
  currentVersionId: u,
  selectedVersionId: m,
  total: s,
  hasMore: S,
  loading: G,
  loadingMore: Z,
  error: J,
  onSelect: Q,
  onLoadMore: X,
  onRetry: R
}) {
  return /* @__PURE__ */ n(
    Lr,
    {
      options: t.map((N) => ({
        id: Number(N.id || 0),
        version: Number(N.version || 0),
        updatedAt: String(N.updated_at || N.created_at || ""),
        value: N
      })),
      currentVersionId: u,
      selectedVersionId: m,
      total: s,
      hasMore: S,
      loading: G,
      loadingMore: Z,
      error: J,
      onSelect: Q,
      onLoadMore: X,
      onRetry: R
    }
  );
}
function ft(t) {
  return _r(t);
}
function mt({
  projectId: t,
  node: u
}) {
  const m = String(u.runError || "").trim(), { error: s, loading: S } = Ur(t, u);
  return m ? /* @__PURE__ */ f("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ n(Mr, { size: 17 }),
    /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ n("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ n("p", { children: s || m }),
      S ? /* @__PURE__ */ f("small", { children: [
        /* @__PURE__ */ n(fe, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const pt = or(
  () => import("./node-detail-editor-DVPIxsgx.js")
), vt = nr(
  pt,
  (t) => t.NodeDetailEditor
), yt = vt.Component, ht = or(
  () => import("./space-video-compose-view-Ct3NyK92.js")
), wt = nr(
  ht,
  (t) => t.VideoComposeView
), gt = wt.Component;
function Tt({
  projectId: t,
  teamId: u,
  assetCateId: m,
  node: s,
  canvasReferenceItems: S,
  canvasNodes: G,
  lipSyncAvailable: Z,
  connectedMediaReferences: J,
  storyboardFocus: Q,
  onNodeDraftChange: X,
  onConnectedMediaEdgeRemove: R,
  onRunNode: N,
  onAssetUpdated: xe,
  onClose: me
}) {
  const _e = jr({
    teamID: u,
    scopeProjectID: t,
    initialFilters: {
      sourceType: "project",
      projectID: t,
      assetCateID: m
    }
  }), b = Number(s.asset?.id || 0), pe = ir(
    s.power,
    s.kind,
    s.outputType
  ), ve = ot(
    s.power,
    s.kind,
    s.outputType
  ), [ye, he] = l(null), [ar, Le] = l(
    () => s.composerDraft?.videoComposition || rr()
  ), [ze, $e] = l(!1), [V, Y] = l(s.asset), [Fe, H] = l(
    () => qe(s.asset)
  ), [cr, K] = l(Fe.length), [He, Ke] = l(1), [we, Ue] = l(!1), [We, ge] = l(b > 0), [be, Be] = l(!1), [ur, Ce] = l(""), [x, U] = l(
    () => D(s.asset)
  ), [Oe, _] = l(
    null
  ), [Ve, De] = l(!1), [Se, L] = l(""), [z, Ge] = l(!1), [M, j] = l(""), [Ze, Je] = l(!1), [ke, se] = l(!1), [dr, W] = l(0), v = I(V), y = I(x), ee = I(xe), ne = I(s), B = I(0), $ = I(0), re = I(null), te = I(null), A = I(null), Ne = I(!1);
  v.current = V, y.current = x, ee.current = xe, ne.current = s, Pe(() => {
    if (!ve || !s.power?.id && !s.power?.key) {
      he(null);
      return;
    }
    let e = !1;
    return he(null), Wr({
      projectId: t,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      e || he(r);
    }).catch((r) => {
      e || g.error(E(r, "加载分镜用途配置失败"));
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
      const r = de(
        { ...e.asset, versions: e.versions },
        v.current || ne.current.asset
      ), o = r.version, i = O(
        o ? [o] : [],
        e.versions
      ), c = D(r);
      v.current = r, y.current = c, Y(r), H(i), K(Math.max(e.versionTotal, i.length)), Ke(1), Ue(e.hasMore), U(c), _(null), L(""), W((d) => d + 1), ee.current?.(r);
    },
    []
  ), ie = p((e) => {
    const r = de(
      e,
      v.current || ne.current.asset
    ), o = D(r);
    v.current = r, y.current = o, Y(r), U(o), H((i) => {
      const c = O(
        r.version ? [r.version] : [],
        i
      );
      return K((d) => Math.max(d, c.length)), c;
    }), _(null), L(""), W((i) => i + 1), ee.current?.(r);
  }, []), F = p(async () => {
    if (!b) {
      ge(!1), Ce("");
      return;
    }
    const e = B.current + 1;
    B.current = e, ge(!0), Ce("");
    try {
      const r = await tr({ projectId: t, assetId: b });
      if (e !== B.current)
        return;
      oe(r);
    } catch (r) {
      if (e !== B.current)
        return;
      Ce(E(r, "读取版本记录失败"));
    } finally {
      e === B.current && ge(!1);
    }
  }, [oe, b, t]);
  Pe(() => {
    v.current = s.asset, Y(s.asset), H(qe(s.asset)), K(qe(s.asset).length);
    const e = D(s.asset);
    return y.current = e, U(e), _(null), L(""), j(""), te.current = null, W((r) => r + 1), Le(
      s.composerDraft?.videoComposition || rr()
    ), F(), () => {
      B.current += 1, $.current += 1;
    };
  }, [F, s.id]);
  const k = D(V), P = !x || x === k, T = P ? V?.version : Oe, Qe = Te(
    () => et(s, T, V?.kind),
    [T, V?.kind, s]
  ), h = !!(P && Qe.mode === "rich" && (V?.kind === "text" || V?.kind === "richtext")), ae = Te(
    () => rt(s, T, {
      includeNodeResult: P
    }),
    [T, P, s]
  ), Xe = Te(() => {
    const e = zr(ae);
    return e.length === 1 ? e[0] : void 0;
  }, [ae]), lr = typeof T?.source?.prompt == "string" ? T.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), Ie = p(
    async (e, r = {}) => {
      const o = v.current, i = o?.version, c = D(o);
      if (!o?.id || !i?.id || y.current !== c)
        throw new Error("当前内容不可编辑");
      const d = await Br({
        projectId: t,
        assetId: o.id,
        versionId: i.id,
        expectedUpdatedAt: r.saveMode !== void 0 ? i.updated_at || i.created_at || "" : void 0,
        requestId: r.requestId,
        saveMode: r.saveMode,
        content: tt(e)
      }), w = de(
        d,
        o
      );
      w.version && (w.version = {
        ...w.version,
        summary: e.summary
      });
      const C = D(w);
      v.current = w, y.current = C, Y(w), U(C), H(
        (Me) => O(
          Me,
          w.version ? [w.version] : []
        )
      ), C && C !== c && K((Me) => Me + 1), ee.current?.(w);
    },
    [t]
  ), a = Hr({
    value: Qe,
    resetKey: `${s.id}:${x}:${dr}`,
    fingerprint: sr,
    save: (e) => Ie(
      e,
      h ? { saveMode: "overwrite_current" } : void 0
    ),
    onError: (e) => g.error(E(e, "保存失败")),
    autoSave: !h
  }), fr = p(async () => {
    await a.flush() && (A.current = null, g.success("正文已保存"));
  }, [a.flush]), mr = p(async () => {
    const e = v.current, r = e?.version;
    if (!e?.id || !r?.id) {
      g.error("当前资产版本不可用");
      return;
    }
    const o = sr(a.draft), i = A.current?.versionId === r.id && A.current.fingerprint === o ? A.current : {
      versionId: r.id,
      fingerprint: o,
      requestId: le("manual-edit", r.id)
    };
    A.current = i, await a.flushWith(
      (d) => Ie(d, {
        saveMode: "create_version",
        requestId: i.requestId
      })
    ) && (A.current = null, g.success("已保存为新版本"));
  }, [a.draft, a.flushWith, Ie]), ce = p(() => !h || !a.hasPendingChanges ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (A.current = null, a.reset(), !0) : !1, [a.hasPendingChanges, a.reset, h]), pr = p(
    async (e, r) => {
      if (M || !await a.flush())
        return !1;
      const i = v.current, c = D(i);
      if (!i?.id || !c)
        return g.error("当前分镜尚未保存，不能确认"), !1;
      j("confirming");
      try {
        const d = await Or({
          projectId: t,
          assetId: i.id,
          versionId: c,
          productionPlan: r
        });
        return ie(d), g.success("分镜已确认，制作组将按当前版本同步"), !0;
      } catch (d) {
        return g.error(E(d, "确认分镜失败")), !1;
      } finally {
        j("");
      }
    },
    [ie, a.flush, t, M]
  ), Ye = p(async () => {
    if (M)
      return;
    const e = v.current, r = y.current;
    if (!e?.id || !r) {
      g.error("当前分镜版本不可用");
      return;
    }
    j("revising");
    try {
      const o = te.current?.versionId === r ? te.current : {
        versionId: r,
        requestId: le("revision", r)
      };
      te.current = o;
      const i = await Gr({
        projectId: t,
        assetId: e.id,
        versionId: r,
        requestId: o.requestId,
        nodeKey: s.id
      });
      ie(i), te.current = null, g.success("已创建新的分镜修订稿"), F();
    } catch (o) {
      g.error(E(o, "创建分镜修订稿失败"));
    } finally {
      j("");
    }
  }, [
    ie,
    F,
    s.id,
    t,
    M
  ]), vr = p(
    async (e, r, o) => {
      const i = v.current, c = ne.current, d = D(i), w = Number(c.power?.id || 0), C = String(c.power?.key || "").trim();
      if (!i?.id || !d)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!w && !C)
        throw new Error("当前分镜节点未配置生成能力");
      return Zr({
        projectId: t,
        assetId: i.id,
        versionId: d,
        flowId: Number(c.flow?.id || i.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || i.asset_cate_id || m
        ),
        requestId: le("shot", d),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: w,
        powerKey: C,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: e,
        shotId: r,
        instruction: o
      });
    },
    [m, t]
  ), yr = p(async () => {
    if (y.current === k) {
      if (h) {
        if (!ce()) return;
      } else if (!await a.flush()) return;
    }
    await F();
  }, [
    k,
    ce,
    a.flush,
    h,
    F
  ]), Ae = p(
    async (e) => {
      if (!b || !e || e === k)
        return;
      const r = $.current + 1;
      $.current = r, De(!0), L(""), _(null);
      try {
        const o = await Jr({
          projectId: t,
          assetId: b,
          versionId: e
        });
        if (r !== $.current || y.current !== e)
          return;
        _(o), W((i) => i + 1);
      } catch (o) {
        if (r !== $.current)
          return;
        L(E(o, "读取历史版本失败"));
      } finally {
        r === $.current && De(!1);
      }
    },
    [b, k, t]
  ), je = p(
    async (e) => {
      if (z)
        return;
      const r = Number(e.id || 0);
      if (!(!r || r === y.current)) {
        if (y.current === k) {
          if (h) {
            if (!ce()) return;
          } else if (!await a.flush()) return;
        }
        if (y.current = r, re.current = null, U(r), r === k) {
          $.current += 1, _(null), L(""), De(!1), W((o) => o + 1);
          return;
        }
        await Ae(r);
      }
    },
    [
      k,
      ce,
      a.flush,
      h,
      Ae,
      z
    ]
  ), hr = p(async () => {
    if (!(!b || !we || be)) {
      Be(!0);
      try {
        const e = await Qr({
          projectId: t,
          assetId: b,
          page: He + 1
        });
        H((r) => O(r, e.items)), Ke(e.page), K(e.total), Ue(e.hasMore);
      } catch (e) {
        g.error(E(e, "加载更多版本失败"));
      } finally {
        Be(!1);
      }
    }
  }, [b, we, t, be, He]), wr = p(async () => {
    const e = v.current, r = y.current;
    if (!(z || !e?.id || !r || r === D(e))) {
      Ge(!0);
      try {
        const o = re.current?.versionId === r ? re.current : {
          versionId: r,
          requestId: le("restore", r)
        };
        re.current = o;
        const i = await Xr({
          projectId: t,
          assetId: e.id,
          versionId: r,
          requestId: o.requestId,
          nodeKey: s.id
        }), c = de(
          i,
          e
        );
        v.current = c, Y(c), ee.current?.(c);
        try {
          const d = await tr({
            projectId: t,
            assetId: e.id
          });
          oe(d);
        } catch {
          const d = c.version;
          H(
            (C) => O(d ? [d] : [], C)
          ), K((C) => C + 1);
          const w = D(c);
          y.current = w, U(w), _(null), L(""), W((C) => C + 1);
        }
        re.current = null, g.success("已切换到所选版本");
      } catch (o) {
        g.error(E(o, "切换版本失败"));
      } finally {
        Ge(!1);
      }
    }
  }, [oe, s.id, t, z]), ue = p(async () => {
    if (Ne.current)
      return;
    if (h && a.hasPendingChanges) {
      se(!0);
      return;
    }
    Ne.current = !0, Je(!0);
    let e = !0;
    const r = v.current;
    if (a.hasPendingChanges && r?.id && r?.version?.id && y.current === D(r) && (e = await a.flush()), !e) {
      Ne.current = !1, Je(!1), se(!0);
      return;
    }
    me();
  }, [a.flush, a.hasPendingChanges, h, me]);
  Pe(() => {
    const e = (r) => {
      if (r.key === "Escape") {
        if (r.preventDefault(), ke) {
          se(!1);
          return;
        }
        ue();
      }
    };
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [ue, ke]);
  const q = a.draft, gr = q.mode === "storyboard" && $r(q.value), Re = !P || !pe && (!V?.id || !V?.version?.id) || gr, br = Re || Ze || b > 0 && We || ve && !ye, Cr = !P && (Ve || Se);
  return /* @__PURE__ */ f(
    Fr,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      onRequestClose: ue,
      header: /* @__PURE__ */ n(
        at,
        {
          node: s,
          contentLabel: bt(
            q,
            s,
            h ? void 0 : Xe
          ),
          versionSelect: b ? /* @__PURE__ */ n(
            lt,
            {
              versions: Fe,
              currentVersionId: k,
              selectedVersionId: x || k,
              total: cr,
              hasMore: we,
              loading: We,
              loadingMore: be,
              error: ur,
              onSelect: (e) => {
                je(e);
              },
              onLoadMore: () => {
                hr();
              },
              onRetry: () => {
                yr();
              }
            }
          ) : void 0,
          updatedAt: ft(
            T?.updated_at || T?.created_at
          ),
          status: a.status,
          readonly: Re,
          actions: h && !Re ? /* @__PURE__ */ n(
            Kr,
            {
              status: a.status,
              hasPendingChanges: a.hasPendingChanges,
              onReset: () => {
                A.current = null, a.reset();
              },
              onSaveAsNewVersion: () => {
                mr();
              },
              onSave: () => {
                fr();
              }
            }
          ) : void 0,
          downloadUrl: q.downloadUrl,
          onRetry: () => {
            a.retry();
          },
          onClose: () => {
            ue();
          }
        }
      ),
      children: [
        /* @__PURE__ */ f("main", { className: "wb-detail-workspace", children: [
          P ? null : /* @__PURE__ */ f("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ f("span", { children: [
              /* @__PURE__ */ n(Pr, { size: 14 }),
              "正在查看第 ",
              Oe?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    je(
                      V?.version || { id: k }
                    );
                  },
                  children: [
                    /* @__PURE__ */ n(Tr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: z || !!M || Ve || !!Se,
                  onClick: () => q.mode === "storyboard" ? void Ye() : void wr(),
                  children: [
                    z || M === "revising" ? /* @__PURE__ */ n(fe, { size: 13, className: "wb-detail-spin" }) : q.mode === "storyboard" ? /* @__PURE__ */ n(qr, { size: 13 }) : /* @__PURE__ */ n(Ee, { size: 13 }),
                    q.mode === "storyboard" ? M === "revising" ? "创建中" : "基于此版本创建修订稿" : z ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ f("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ n(mt, { projectId: t, node: s }),
            Cr ? /* @__PURE__ */ n("div", { className: "wb-detail-content-state", children: Ve ? /* @__PURE__ */ f(er, { children: [
              /* @__PURE__ */ n(fe, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ n("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ f(er, { children: [
              /* @__PURE__ */ n("span", { children: Se }),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Ae(x);
                  },
                  children: [
                    /* @__PURE__ */ n(Ee, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ n(
              it.Provider,
              {
                value: _e,
                children: /* @__PURE__ */ n(
                  Vr,
                  {
                    fallback: /* @__PURE__ */ n(
                      Yr,
                      {
                        label: pe ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: pe ? /* @__PURE__ */ n(
                      gt,
                      {
                        composition: ar,
                        referenceItems: S || [],
                        connectedMediaReferences: J,
                        readonly: !P || Ze || ze,
                        running: ze,
                        fullScreen: !0,
                        finalOutput: ae,
                        onChange: (e) => {
                          Le(e), X?.({
                            ...s.composerDraft || {},
                            videoComposition: e
                          });
                        },
                        onConnectedMediaEdgeRemove: R,
                        onRun: N ? (e) => {
                          $e(!0), N({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: e
                            }
                          }).then(() => b ? F() : void 0).catch(
                            (r) => g.error(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => $e(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ n(
                      yt,
                      {
                        content: q,
                        assetKind: V?.kind || s.kind,
                        mediaOutput: h ? void 0 : ae,
                        mediaKind: h ? void 0 : Xe,
                        mediaPrompt: lr,
                        readonly: br,
                        referenceItems: S,
                        canvasNodes: G,
                        lipSyncAvailable: Z,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: Q,
                        storyboardWorkflowAction: M,
                        storyboardWorkTypes: ye?.storyboard_work_types,
                        storyboardReferencePurposes: ye?.storyboard_reference_purposes,
                        referenceProvider: _e,
                        onConfirmStoryboard: pr,
                        onCreateStoryboardRevision: Ye,
                        onGenerateStoryboardShot: vr,
                        onChange: a.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        ke ? /* @__PURE__ */ n("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ f(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ n("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ n("p", { children: h ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。" : "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ f("div", { children: [
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
                      A.current = null, a.reset(), me();
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
  return O(
    t?.version ? [t.version] : [],
    t?.versions || []
  );
}
function D(t) {
  return Number(t?.version_id || t?.version?.id || 0);
}
function bt(t, u, m) {
  return t.mode === "storyboard" ? "分镜脚本" : ir(u.power, u.kind, u.outputType) ? "视频合成" : m === "image" ? "图片内容" : m === "video" ? "视频内容" : m === "audio" ? "音频内容" : t.mode === "file" ? "文件" : u.kind === "image" || u.kind === "richtext" ? "图文内容" : u.kind === "video" ? "视频内容" : u.kind === "audio" ? "音频内容" : t.format === "markdown" ? "Markdown" : "富文本";
}
function le(t, u) {
  const m = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${t}-${u}-${m}`.slice(0, 64);
}
export {
  Tt as NodeDetailDialog
};
