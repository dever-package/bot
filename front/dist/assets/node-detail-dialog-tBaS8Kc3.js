import { a as n, j as v, F as Xe } from "./_commonjsHelpers-CTFd9u1x.js";
import { l, u as d, b as p, o as be, d as _e, S as pr } from "./react-C7Xtl8sB.js";
import { a6 as He, L as Ie, a7 as vr, $ as yr, w as wr, N as hr, V as gr, a8 as br, F as Dr, C as Cr, a9 as Vr, A as Sr, g as Nr } from "./vendor-icons-Cc7Kl3It.js";
import { t as A } from "./index-BxqXLJC9.js";
import { B as Rr, D as kr, o as Ir, q as Ar, g as Pr, w as Tr } from "./storyboard-grid-view-CJXm84yJ.js";
import { j as X } from "./site-config-BVY1isir.js";
import { u as Er, e as Ye, f as Mr, m as ke, d as de, g as Ze, s as qr, h as Fr, j as zr, k as Lr, l as _r, n as $r, o as xr } from "./space-page-D3VBae11.js";
import { r as Hr, f as Br, g as Kr, i as Ur, h as Wr } from "./node-detail-content-DhUE_leQ.js";
import { r as Or, P as Gr, i as je, a as Jr } from "./space-add-node-menu-pcpVf0B3.js";
import { u as Qr } from "./asset-reference-provider-C3LvPld5.js";
import { C as Xr } from "./node-detail-storyboard-grid-Cwlx2Bai.js";
import { C as Yr } from "./space-entry-BCsJ6Zds.js";
import { a as er, b as rr } from "./preloadable-PCKj9Z7v.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-dialog-Bk9PN_zt.css", import.meta.url).href]);
function Zr({
  node: e,
  contentLabel: u,
  versionSelect: f,
  updatedAt: s,
  status: b,
  readonly: M,
  downloadUrl: Y,
  onRetry: x,
  onClose: H
}) {
  const y = e.type === "power" ? Or(e.power, e.kind, e.outputType) : null, _ = y && y.outputName !== u ? `${y.outputName} · ${u}` : y?.outputName || u;
  return /* @__PURE__ */ n(
    kr,
    {
      icon: /* @__PURE__ */ n(et, { node: e }),
      title: e.title || "节点详情",
      subtitle: _,
      versionSelect: f,
      state: M ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }) : b === "error" ? /* @__PURE__ */ n(Rr, { label: "重试保存", children: /* @__PURE__ */ v(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: x,
          children: [
            /* @__PURE__ */ n(He, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ v("span", { className: `wb-detail-state is-${b}`, children: [
        b === "saving" ? /* @__PURE__ */ n(Ie, { size: 12, className: "wb-detail-spin" }) : null,
        jr(b)
      ] }),
      updatedAt: s,
      downloadUrl: Y,
      onClose: H
    }
  );
}
function jr(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : "已保存";
}
function et({ node: e }) {
  if (e.type === "power")
    return /* @__PURE__ */ n(
      Gr,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const u = rt(e);
  return /* @__PURE__ */ n(u, { size: 16 });
}
function rt(e) {
  return e.type === "agent" ? vr : e.type === "flow" ? yr : e.type === "function" ? wr : e.kind === "image" ? hr : e.kind === "video" ? gr : e.kind === "audio" ? br : Dr;
}
function tt({
  value: e,
  resetKey: u,
  fingerprint: f,
  save: s,
  onError: b,
  debounceMs: M = 1200
}) {
  const [Y, x] = l(e), [H, y] = l("saved"), _ = d(e), D = d(e), $ = d(f), fe = d(s), w = d(b), B = d(f(e)), N = d(0), T = d(0), R = d(null), K = d(null), me = d(async () => !1), k = d(!1), q = d(!0);
  _.current = e, $.current = f, fe.current = s, w.current = b;
  const m = p(() => {
    R.current !== null && (window.clearTimeout(R.current), R.current = null);
  }, []), S = p(
    async (h, F = !1) => {
      m();
      const z = T.current;
      for (; q.current && z === T.current; ) {
        if (K.current && (!await K.current || z !== T.current))
          return !1;
        if (!F && h !== void 0 && h !== N.current)
          return !0;
        const ve = D.current, ie = $.current(ve);
        if (ie === B.current)
          return k.current = !1, q.current && y("saved"), !0;
        const ae = N.current;
        q.current && y("saving");
        const Z = fe.current(ve).then(() => {
          if (!q.current || z !== T.current)
            return !1;
          B.current = ie, k.current = !1;
          const O = $.current(D.current);
          return y(
            O === ie ? "saved" : "dirty"
          ), !0;
        }).catch((O) => (q.current && z === T.current && (m(), k.current = !0, y("error"), w.current?.(O)), !1));
        K.current = Z;
        const De = await Z;
        if (K.current === Z && (K.current = null), !De)
          return !1;
        if (!F && ae !== N.current && R.current === null && !k.current) {
          const O = N.current;
          R.current = window.setTimeout(() => {
            R.current = null, me.current(O);
          }, M);
        }
        if (!F || ae === N.current)
          return !0;
      }
      return !1;
    },
    [m, M]
  );
  me.current = S;
  const pe = p(
    (h) => {
      m(), !k.current && (R.current = window.setTimeout(() => {
        R.current = null, S(h);
      }, M));
    },
    [m, M, S]
  ), U = p(
    (h) => {
      const F = typeof h == "function" ? h(D.current) : h, z = $.current(F);
      if (D.current = F, x(F), N.current += 1, z === B.current) {
        m(), k.current = !1, y("saved");
        return;
      }
      if (k.current) {
        y("error");
        return;
      }
      y("dirty"), pe(N.current);
    },
    [m, pe]
  ), Ae = p(async () => S(void 0, !0), [S]), W = p(async () => (k.current = !1, S(void 0, !0)), [S]);
  return be(() => {
    const h = _.current;
    T.current += 1, N.current = 0, D.current = h, B.current = $.current(h), k.current = !1, K.current = null, m(), x(h), y("saved");
  }, [m, u]), be(() => (q.current = !0, () => {
    q.current = !1, T.current += 1, m();
  }), [m]), {
    draft: Y,
    status: H,
    setDraft: U,
    flush: Ae,
    retry: W,
    hasPendingChanges: H !== "saved"
  };
}
function st({
  versions: e,
  currentVersionId: u,
  selectedVersionId: f,
  total: s,
  hasMore: b,
  loading: M,
  loadingMore: Y,
  error: x,
  onSelect: H,
  onLoadMore: y,
  onRetry: _
}) {
  return /* @__PURE__ */ n(
    Ar,
    {
      options: e.map((D) => ({
        id: Number(D.id || 0),
        version: Number(D.version || 0),
        updatedAt: String(D.updated_at || D.created_at || ""),
        value: D
      })),
      currentVersionId: u,
      selectedVersionId: f,
      total: s,
      hasMore: b,
      loading: M,
      loadingMore: Y,
      error: x,
      onSelect: H,
      onLoadMore: y,
      onRetry: _
    }
  );
}
function nt(e) {
  return Ir(e);
}
function ot({
  projectId: e,
  node: u
}) {
  const f = String(u.runError || "").trim(), { error: s, loading: b } = Er(e, u);
  return f ? /* @__PURE__ */ v("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ n(Cr, { size: 17 }),
    /* @__PURE__ */ v("div", { children: [
      /* @__PURE__ */ n("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ n("p", { children: s || f }),
      b ? /* @__PURE__ */ v("small", { children: [
        /* @__PURE__ */ n(Ie, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
const it = rr(
  () => import("./node-detail-editor-CKoBSf_3.js")
), at = er(
  it,
  (e) => e.NodeDetailEditor
), ct = at.Component, ut = rr(
  () => import("./space-video-compose-view-DxZ5WKIQ.js")
), lt = er(
  ut,
  (e) => e.VideoComposeView
), dt = lt.Component;
function Rt({
  projectId: e,
  teamId: u,
  assetCateId: f,
  node: s,
  canvasReferenceItems: b,
  canvasNodes: M,
  connectedMediaReferences: Y,
  storyboardFocus: x,
  onNodeDraftChange: H,
  onConnectedMediaEdgeRemove: y,
  onRunNode: _,
  onAssetUpdated: D,
  onClose: $
}) {
  const fe = Qr({
    teamID: u,
    scopeProjectID: e,
    initialFilters: {
      sourceType: "project",
      projectID: e,
      assetCateID: f
    }
  }), w = Number(s.asset?.id || 0), B = je(
    s.power,
    s.kind,
    s.outputType
  ), N = Jr(
    s.power,
    s.kind,
    s.outputType
  ), [T, R] = l(null), [K, me] = l(
    () => s.composerDraft?.videoComposition || Ye()
  ), [k, q] = l(!1), [m, S] = l(s.asset), [pe, U] = l(
    () => $e(s.asset)
  ), [Ae, W] = l(pe.length), [h, F] = l(1), [z, ve] = l(!1), [ie, ae] = l(w > 0), [Z, De] = l(!1), [O, Pe] = l(""), [j, ce] = l(
    () => P(s.asset)
  ), [Be, ee] = l(
    null
  ), [Te, Ee] = l(!1), [Me, re] = l(""), [te, Ke] = l(!1), [G, ye] = l(""), [Ue, We] = l(!1), [qe, Fe] = l(!1), [tr, ue] = l(0), C = d(m), g = d(j), we = d(D), Ce = d(s), le = d(0), se = d(0), he = d(null), ge = d(null), ze = d(!1);
  C.current = m, g.current = j, we.current = D, Ce.current = s, be(() => {
    if (!N || !s.power?.id && !s.power?.key) {
      R(null);
      return;
    }
    let t = !1;
    return R(null), Mr({
      projectId: e,
      flowId: Number(s.flow?.id || 0),
      powerId: Number(s.power?.id || 0),
      powerKey: String(s.power?.key || ""),
      targetId: Number(s.composerDraft?.selectedTargetId || 0)
    }).then((r) => {
      t || R(r);
    }).catch((r) => {
      t || A.error(X(r, "加载分镜用途配置失败"));
    }), () => {
      t = !0;
    };
  }, [
    N,
    s.composerDraft?.selectedTargetId,
    s.flow?.id,
    s.id,
    s.power?.id,
    s.power?.key,
    e
  ]);
  const Ve = p(
    (t) => {
      const r = ke(
        { ...t.asset, versions: t.versions },
        C.current || Ce.current.asset
      ), o = r.version, a = de(
        o ? [o] : [],
        t.versions
      ), c = P(r);
      C.current = r, g.current = c, S(r), U(a), W(Math.max(t.versionTotal, a.length)), F(1), ve(t.hasMore), ce(c), ee(null), re(""), ue((i) => i + 1), we.current?.(r);
    },
    []
  ), Se = p((t) => {
    const r = ke(
      t,
      C.current || Ce.current.asset
    ), o = P(r);
    C.current = r, g.current = o, S(r), ce(o), U((a) => {
      const c = de(
        r.version ? [r.version] : [],
        a
      );
      return W((i) => Math.max(i, c.length)), c;
    }), ee(null), re(""), ue((a) => a + 1), we.current?.(r);
  }, []), ne = p(async () => {
    if (!w) {
      ae(!1), Pe("");
      return;
    }
    const t = le.current + 1;
    le.current = t, ae(!0), Pe("");
    try {
      const r = await Ze({ projectId: e, assetId: w });
      if (t !== le.current)
        return;
      Ve(r);
    } catch (r) {
      if (t !== le.current)
        return;
      Pe(X(r, "读取版本记录失败"));
    } finally {
      t === le.current && ae(!1);
    }
  }, [Ve, w, e]);
  be(() => {
    C.current = s.asset, S(s.asset), U($e(s.asset)), W($e(s.asset).length);
    const t = P(s.asset);
    return g.current = t, ce(t), ee(null), re(""), ye(""), ge.current = null, ue((r) => r + 1), me(
      s.composerDraft?.videoComposition || Ye()
    ), ne(), () => {
      le.current += 1, se.current += 1;
    };
  }, [ne, s.id]);
  const E = P(m), oe = !j || j === E, J = oe ? m?.version : Be, sr = _e(
    () => Hr(s, J),
    [J, s]
  ), Ne = _e(
    () => Br(s, J, {
      includeNodeResult: oe
    }),
    [J, oe, s]
  ), Oe = _e(() => {
    const t = Pr(Ne);
    return t.length === 1 ? t[0] : void 0;
  }, [Ne]), nr = typeof J?.source?.prompt == "string" ? J.source.prompt.trim() : String(s.composerDraft?.prompt || "").trim(), or = p(
    async (t) => {
      const r = C.current, o = r?.version, a = P(r);
      if (!r?.id || !o?.id || g.current !== a)
        throw new Error("当前内容不可编辑");
      const c = await qr({
        projectId: e,
        assetId: r.id,
        versionId: o.id,
        content: Kr(t)
      }), i = ke(
        c,
        r
      );
      i.version && (i.version = {
        ...i.version,
        summary: t.summary
      });
      const L = P(i);
      C.current = i, g.current = L, S(i), ce(L), U(
        (I) => de(
          I,
          i.version ? [i.version] : []
        )
      ), L && L !== a && W((I) => I + 1), we.current?.(i);
    },
    [e]
  ), V = tt({
    value: sr,
    resetKey: `${s.id}:${j}:${tr}`,
    fingerprint: Wr,
    save: or,
    onError: (t) => A.error(X(t, "保存失败"))
  }), ir = p(
    async (t, r) => {
      if (G || !await V.flush())
        return !1;
      const a = C.current, c = P(a);
      if (!a?.id || !c)
        return A.error("当前分镜尚未保存，不能确认"), !1;
      ye("confirming");
      try {
        const i = await Fr({
          projectId: e,
          assetId: a.id,
          versionId: c,
          productionPlan: r
        });
        return Se(i), A.success("分镜已确认，制作组将按当前版本同步"), !0;
      } catch (i) {
        return A.error(X(i, "确认分镜失败")), !1;
      } finally {
        ye("");
      }
    },
    [Se, V.flush, e, G]
  ), Ge = p(async () => {
    if (G)
      return;
    const t = C.current, r = g.current;
    if (!t?.id || !r) {
      A.error("当前分镜版本不可用");
      return;
    }
    ye("revising");
    try {
      const o = ge.current?.versionId === r ? ge.current : {
        versionId: r,
        requestId: xe("revision", r)
      };
      ge.current = o;
      const a = await zr({
        projectId: e,
        assetId: t.id,
        versionId: r,
        requestId: o.requestId,
        nodeKey: s.id
      });
      Se(a), ge.current = null, A.success("已创建新的分镜修订稿"), ne();
    } catch (o) {
      A.error(X(o, "创建分镜修订稿失败"));
    } finally {
      ye("");
    }
  }, [
    Se,
    ne,
    s.id,
    e,
    G
  ]), ar = p(
    async (t, r, o) => {
      const a = C.current, c = Ce.current, i = P(a), L = Number(c.power?.id || 0), I = String(c.power?.key || "").trim();
      if (!a?.id || !i)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!L && !I)
        throw new Error("当前分镜节点未配置生成能力");
      return Lr({
        projectId: e,
        assetId: a.id,
        versionId: i,
        flowId: Number(c.flow?.id || a.flow_id || 0),
        assetCateId: Number(
          c.assetCateId || a.asset_cate_id || f
        ),
        requestId: xe("shot", i),
        nodeKey: c.id,
        nodeName: c.title,
        powerId: L,
        powerKey: I,
        sourceTargetId: Number(
          c.composerDraft?.selectedTargetId || 0
        ),
        params: c.composerDraft?.paramValues || {},
        storyboard: t,
        shotId: r,
        instruction: o
      });
    },
    [f, e]
  ), cr = p(async () => {
    g.current === E && !await V.flush() || await ne();
  }, [E, V.flush, ne]), Le = p(
    async (t) => {
      if (!w || !t || t === E)
        return;
      const r = se.current + 1;
      se.current = r, Ee(!0), re(""), ee(null);
      try {
        const o = await _r({
          projectId: e,
          assetId: w,
          versionId: t
        });
        if (r !== se.current || g.current !== t)
          return;
        ee(o), ue((a) => a + 1);
      } catch (o) {
        if (r !== se.current)
          return;
        re(X(o, "读取历史版本失败"));
      } finally {
        r === se.current && Ee(!1);
      }
    },
    [w, E, e]
  ), Je = p(
    async (t) => {
      if (te)
        return;
      const r = Number(t.id || 0);
      if (!(!r || r === g.current) && !(g.current === E && !await V.flush())) {
        if (g.current = r, he.current = null, ce(r), r === E) {
          se.current += 1, ee(null), re(""), Ee(!1), ue((o) => o + 1);
          return;
        }
        await Le(r);
      }
    },
    [E, V.flush, Le, te]
  ), ur = p(async () => {
    if (!(!w || !z || Z)) {
      De(!0);
      try {
        const t = await $r({
          projectId: e,
          assetId: w,
          page: h + 1
        });
        U((r) => de(r, t.items)), F(t.page), W(t.total), ve(t.hasMore);
      } catch (t) {
        A.error(X(t, "加载更多版本失败"));
      } finally {
        De(!1);
      }
    }
  }, [w, z, e, Z, h]), lr = p(async () => {
    const t = C.current, r = g.current;
    if (!(te || !t?.id || !r || r === P(t))) {
      Ke(!0);
      try {
        const o = he.current?.versionId === r ? he.current : {
          versionId: r,
          requestId: xe("restore", r)
        };
        he.current = o;
        const a = await xr({
          projectId: e,
          assetId: t.id,
          versionId: r,
          requestId: o.requestId,
          nodeKey: s.id
        }), c = ke(
          a,
          t
        );
        C.current = c, S(c), we.current?.(c);
        try {
          const i = await Ze({
            projectId: e,
            assetId: t.id
          });
          Ve(i);
        } catch {
          const i = c.version;
          U(
            (I) => de(i ? [i] : [], I)
          ), W((I) => I + 1);
          const L = P(c);
          g.current = L, ce(L), ee(null), re(""), ue((I) => I + 1);
        }
        he.current = null, A.success("已切换到所选版本");
      } catch (o) {
        A.error(X(o, "切换版本失败"));
      } finally {
        Ke(!1);
      }
    }
  }, [Ve, s.id, e, te]), Re = p(async () => {
    if (ze.current)
      return;
    ze.current = !0, We(!0);
    let t = !0;
    const r = C.current;
    if (V.hasPendingChanges && r?.id && r?.version?.id && g.current === P(r) && (t = await V.flush()), !t) {
      ze.current = !1, We(!1), Fe(!0);
      return;
    }
    $();
  }, [V.flush, V.hasPendingChanges, $]);
  be(() => {
    const t = (r) => {
      if (r.key === "Escape") {
        if (r.preventDefault(), qe) {
          Fe(!1);
          return;
        }
        Re();
      }
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [Re, qe]);
  const Q = V.draft, dr = Q.mode === "storyboard" && Ur(Q.value), Qe = !oe || !B && (!m?.id || !m?.version?.id) || dr, fr = Qe || Ue || w > 0 && ie || N && !T, mr = !oe && (Te || Me);
  return /* @__PURE__ */ v(
    Tr,
    {
      ariaLabel: `${s.title || "节点"}详情`,
      onRequestClose: Re,
      header: /* @__PURE__ */ n(
        Zr,
        {
          node: s,
          contentLabel: ft(Q, s, Oe),
          versionSelect: w ? /* @__PURE__ */ n(
            st,
            {
              versions: pe,
              currentVersionId: E,
              selectedVersionId: j || E,
              total: Ae,
              hasMore: z,
              loading: ie,
              loadingMore: Z,
              error: O,
              onSelect: (t) => {
                Je(t);
              },
              onLoadMore: () => {
                ur();
              },
              onRetry: () => {
                cr();
              }
            }
          ) : void 0,
          updatedAt: nt(
            J?.updated_at || J?.created_at
          ),
          status: V.status,
          readonly: Qe,
          downloadUrl: Q.downloadUrl,
          onRetry: () => {
            V.retry();
          },
          onClose: () => {
            Re();
          }
        }
      ),
      children: [
        /* @__PURE__ */ v("main", { className: "wb-detail-workspace", children: [
          oe ? null : /* @__PURE__ */ v("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ v("span", { children: [
              /* @__PURE__ */ n(Vr, { size: 14 }),
              "正在查看第 ",
              Be?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ v("div", { children: [
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    Je(
                      m?.version || { id: E }
                    );
                  },
                  children: [
                    /* @__PURE__ */ n(Sr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: te || !!G || Te || !!Me,
                  onClick: () => Q.mode === "storyboard" ? void Ge() : void lr(),
                  children: [
                    te || G === "revising" ? /* @__PURE__ */ n(Ie, { size: 13, className: "wb-detail-spin" }) : Q.mode === "storyboard" ? /* @__PURE__ */ n(Nr, { size: 13 }) : /* @__PURE__ */ n(He, { size: 13 }),
                    Q.mode === "storyboard" ? G === "revising" ? "创建中" : "基于此版本创建修订稿" : te ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ v("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ n(ot, { projectId: e, node: s }),
            mr ? /* @__PURE__ */ n("div", { className: "wb-detail-content-state", children: Te ? /* @__PURE__ */ v(Xe, { children: [
              /* @__PURE__ */ n(Ie, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ n("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ v(Xe, { children: [
              /* @__PURE__ */ n("span", { children: Me }),
              /* @__PURE__ */ v(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Le(j);
                  },
                  children: [
                    /* @__PURE__ */ n(He, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ n(
              Xr.Provider,
              {
                value: fe,
                children: /* @__PURE__ */ n(
                  pr,
                  {
                    fallback: /* @__PURE__ */ n(
                      Yr,
                      {
                        label: B ? "正在加载视频合成" : "正在加载节点内容"
                      }
                    ),
                    children: B ? /* @__PURE__ */ n(
                      dt,
                      {
                        composition: K,
                        referenceItems: b || [],
                        connectedMediaReferences: Y,
                        readonly: !oe || Ue || k,
                        running: k,
                        fullScreen: !0,
                        finalOutput: Ne,
                        onChange: (t) => {
                          me(t), H?.({
                            ...s.composerDraft || {},
                            videoComposition: t
                          });
                        },
                        onConnectedMediaEdgeRemove: y,
                        onRun: _ ? (t) => {
                          q(!0), _({
                            ...s,
                            composerDraft: {
                              ...s.composerDraft || {},
                              videoComposition: t
                            }
                          }).then(() => w ? ne() : void 0).catch(
                            (r) => A.error(
                              r instanceof Error ? r.message : "视频合成失败"
                            )
                          ).finally(() => q(!1));
                        } : void 0
                      }
                    ) : /* @__PURE__ */ n(
                      ct,
                      {
                        content: Q,
                        mediaOutput: Ne,
                        mediaKind: Oe,
                        mediaPrompt: nr,
                        readonly: fr,
                        referenceItems: b,
                        canvasNodes: M,
                        storyboardSourceNodeId: s.id,
                        storyboardFocus: x,
                        storyboardWorkflowAction: G,
                        storyboardWorkTypes: T?.storyboard_work_types,
                        storyboardReferencePurposes: T?.storyboard_reference_purposes,
                        referenceProvider: fe,
                        onConfirmStoryboard: ir,
                        onCreateStoryboardRevision: Ge,
                        onGenerateStoryboardShot: ar,
                        onChange: V.setDraft
                      }
                    )
                  }
                )
              }
            )
          ] })
        ] }),
        qe ? /* @__PURE__ */ n("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ v(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ n("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ n("p", { children: "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ v("div", { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => Fe(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ n("button", { type: "button", className: "is-danger", onClick: $, children: "放弃修改" })
              ] })
            ]
          }
        ) }) : null
      ]
    }
  );
}
function $e(e) {
  return de(
    e?.version ? [e.version] : [],
    e?.versions || []
  );
}
function P(e) {
  return Number(e?.version_id || e?.version?.id || 0);
}
function ft(e, u, f) {
  return e.mode === "storyboard" ? "分镜脚本" : je(u.power, u.kind, u.outputType) ? "视频合成" : f === "image" ? "图片内容" : f === "video" ? "视频内容" : f === "audio" ? "音频内容" : e.mode === "file" ? "文件" : u.kind === "image" || u.kind === "richtext" ? "图文内容" : u.kind === "video" ? "视频内容" : u.kind === "audio" ? "音频内容" : e.format === "markdown" ? "Markdown" : "富文本";
}
function xe(e, u) {
  const f = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${u}-${f}`.slice(0, 64);
}
export {
  Rt as NodeDetailDialog
};
