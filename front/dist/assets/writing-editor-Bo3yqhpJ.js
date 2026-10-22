import { j as t, a, F as he } from "./react-D9GkiX5b.js";
import { a as S, b as V, d as me, h as ne, u as xe, l as Xe } from "./file-kind-D6bMOzYN.js";
import { w as Ct, e as St, ah as $t, P as Ue, G as xt, aI as Et, q as Ve, h as at, A as Rt, t as Ae, ab as Ze, r as ot, z as Pt, H as At, aB as Tt } from "./vendor-icons-fVDtJt66.js";
import { u as Wt, t as lt, v as Bt } from "./asset-preview-qznc7rjG.js";
import { N as It } from "./node-detail-dialog-BE6C3dCd.js";
import { f as He, d as et, $ as _e, a0 as Mt, a1 as $e, a2 as Le, a3 as Lt, a4 as zt, a5 as We, a6 as Dt, a7 as ct, a8 as Oe, a9 as be, aa as ye, ab as Te, ac as dt, e as Vt, ad as Ot, ae as ut, af as qt, ag as Ft, ah as Ut, ai as ft, aj as pt, ak as Ht, al as Jt, am as tt, an as Kt, ao as Ce, ap as Yt, aq as jt, ar as Gt, v as Qt } from "./space-ordered-list-BzuXThI0.js";
import { u as Xt } from "./text-content-save-actions-CJZJZrHM.js";
import { h as Zt, s as ze, E as nt, W as ve, X as ge, F as en, Y as tn, j as qe, Z as nn, _ as rn, $ as gt, a0 as sn, a1 as an, m as on, n as ln, a2 as cn } from "./writing-run-labels-CtoDipVX.js";
import { WritingDialog as Ee, WritingConfirmDialog as ht } from "./writing-dialog-BtBlVuUd.js";
import { A as dn } from "./asset-text-content-editor--oujusOn.js";
import { n as un, i as fn } from "./interaction-BzXkk2tH.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-editor-BQh7RoU_.css", import.meta.url).href]);
function pn({
  editor: e,
  titleStatus: n,
  versions: i,
  node: c,
  mutationDisabled: r,
  navigationDisabled: l,
  previewReadonly: p,
  onClose: s,
  onRuns: o,
  onSelectVersion: u
}) {
  const { snapshot: b, viewSnapshot: y, document: g, draft: h, conflicted: f } = e, m = He, d = g ? g.units : [], k = h.status === "saving", w = i.versions.find(
    (E) => E.id === y?.work_version_id
  );
  return /* @__PURE__ */ t(
    It,
    {
      node: g && c.titleMode === "auto" ? { ...c, title: g.title } : c,
      titleStatus: n,
      contentLabel: g ? d.length ? `${d.filter((E) => E.has_body).length}/${d.length} ${m.unit}正文` : et(g) === "inspiration" ? "选择灵感" : et(g) === "outline" ? "大纲" : "剧情规划" : m.title,
      updatedAt: lt(
        y?.work_updated_at || w?.updated_at || w?.created_at || c.asset?.version?.updated_at
      ),
      status: h.status,
      readonly: p,
      onRetry: () => {
        !r && !k && !f && h.retry();
      },
      onClose: s,
      versionSelect: b && /* @__PURE__ */ t(
        Wt,
        {
          options: i.versions.map((E) => ({
            id: E.id,
            version: E.version,
            updatedAt: String(
              (E.id === b.work_version_id ? b.work_updated_at : void 0) || E.updated_at || E.created_at || ""
            ),
            value: E
          })),
          currentVersionId: b.work_version_id,
          selectedVersionId: y?.work_version_id || b.work_version_id,
          total: i.total,
          hasMore: i.hasMore,
          loading: i.loading,
          loadingMore: i.loadingMore,
          error: i.error,
          disabled: l,
          onSelect: (E) => {
            u(E.id);
          },
          onLoadMore: i.onLoadMore,
          onRetry: i.onRetry
        }
      ),
      actions: g && /* @__PURE__ */ a(he, { children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "保存为新版本",
            disabled: r || k || f,
            onClick: () => {
              e.action("create_version");
            },
            children: [
              /* @__PURE__ */ t(Ct, { size: 14 }),
              /* @__PURE__ */ t("span", { children: "保存为新版本" })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": h.status === "error" ? "重试保存" : "保存",
            disabled: r || k || f || !h.hasPendingChanges,
            onClick: () => {
              h.status === "error" ? h.retry() : h.flush();
            },
            children: [
              /* @__PURE__ */ t(St, { size: 14 }),
              /* @__PURE__ */ t("span", { children: h.status === "error" ? "重试保存" : "保存" })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "运行记录",
            disabled: l,
            onClick: async () => {
              await h.flush() && o();
            },
            children: [
              /* @__PURE__ */ t($t, { size: 14 }),
              /* @__PURE__ */ t("span", { children: "运行记录" })
            ]
          }
        )
      ] })
    }
  );
}
const it = /* @__PURE__ */ new WeakMap();
function Fe(e) {
  if (!e) return "null";
  let n = it.get(e);
  return n === void 0 && (n = JSON.stringify(e), it.set(e, n)), n;
}
function gn(e) {
  return `${Fe(e.document)}
${JSON.stringify(e.unit)}`;
}
function hn(e = 20) {
  const n = /* @__PURE__ */ new Map();
  return {
    get(i) {
      const c = n.get(i);
      return c && (n.delete(i), n.set(i, c)), c;
    },
    delete(i) {
      n.delete(i);
    },
    set(i, c) {
      n.delete(i), n.set(i, c), n.size > e && n.delete(n.keys().next().value);
    }
  };
}
function mn(e, n, i) {
  const c = (l) => [
    l.outline.characters,
    l.outline.locations,
    l.outline.props,
    l.units
  ], r = c(n);
  c(e).forEach((l, p) => {
    l.forEach((s, o) => {
      s.id.startsWith("new:") && i.set(`${p}:${s.id}`, r[p][o].id);
    });
  });
}
function wn(e, n) {
  if (!n.size) return e;
  const i = (c, r) => c.map((l) => ({
    ...l,
    id: n.get(`${r}:${l.id}`) || l.id
  }));
  return {
    ...e,
    outline: {
      ...e.outline,
      characters: i(e.outline.characters, 0),
      locations: i(e.outline.locations, 1),
      props: i(e.outline.props, 2)
    },
    units: i(e.units, 3)
  };
}
const bn = { document: null, unit: null };
function yn({
  projectId: e,
  canvasId: n,
  node: i,
  output: c,
  onAssetUpdated: r,
  readonly: l = !1,
  running: p = !1
}) {
  const {
    snapshot: s,
    snapshotRef: o,
    mounted: u,
    acceptSnapshot: b,
    loadWork: y,
    command: g,
    stopRun: h,
    reportError: f,
    setError: m,
    error: d,
    generationTiming: k,
    preview: w,
    clearPreview: E,
    clearGenerationError: _
  } = Zt({ projectId: e, canvasId: n, node: i, output: c, onAssetUpdated: r }), [$, v] = S(null), A = V($), R = $ || s, [x, T] = S(null), W = V(x), [I, K] = S(0), [Y, Q] = S(!1), [j, q] = S(!1), U = V(!1), P = V({ readonly: l, running: p });
  P.current = { readonly: l, running: p };
  const Z = V(0), fe = V(hn()), we = V({
    workAssetId: 0,
    ids: /* @__PURE__ */ new Map()
  }), B = V(
    null
  );
  me(
    () => () => {
      Z.current += 1, B.current = null;
    },
    []
  );
  const J = ne(() => {
    if (P.current.readonly || A.current)
      throw new Error("当前作品只读，未保存内容已保留");
    if (P.current.running || o.current?.document.status === "running")
      throw new Error("生成期间暂不可修改作品，请先停止生成");
  }, []), ue = ne(
    async (N) => {
      const M = W.current;
      if (!M) throw new Error("请等待内容加载完成");
      let z = M.workVersion, H = M.workRevision, D = M.unitVersion;
      const se = (G, ie) => {
        b(G), z = G.work_version_id, H = G.work_revision, D = N.unit && G.document.units.find(
          (ae) => ae.id === N.unit.unit_id
        )?.version_id || 0, W.current = {
          ...M,
          selection: W.current?.selection || M.selection,
          workVersion: z,
          workRevision: H,
          unitVersion: D,
          value: ie
        };
      };
      if (N.document && Fe(N.document) !== Fe(M.value.document)) {
        J();
        const G = o.current.work_asset_id;
        we.current.workAssetId !== G && (we.current = { workAssetId: G, ids: /* @__PURE__ */ new Map() });
        const ie = we.current, ae = wn(
          N.document,
          ie.ids
        ), pe = await ze(
          g(
            "save_document",
            { document: ae, expected_work_revision: H },
            z
          )
        );
        mn(
          ae,
          pe.document,
          ie.ids
        ), se(pe, { ...M.value, document: N.document });
      }
      if (N.unit && N.unit.body !== M.value.unit?.body) {
        J();
        const G = await ze(
          g(
            "save_unit",
            {
              unit_id: N.unit.unit_id,
              expected_unit_version_id: D,
              expected_work_revision: H,
              body: N.unit.body
            },
            z
          )
        );
        se(G, N);
        const ie = G.document.units.find(
          (ae) => ae.id === N.unit.unit_id
        );
        ie?.version_id && fe.current.delete(ie.version_id);
      }
      m("");
    },
    [b, J, g, o]
  ), te = Xt({
    value: x?.value || bn,
    resetKey: `${i.id}:${I}`,
    fingerprint: gn,
    save: ue,
    onError: f,
    autoSave: !!(x && !$ && !l && !p && s?.document.status !== "running" && !j && !Y),
    debounceMs: 1200
  }), ce = V(te);
  ce.current = te;
  const oe = ne(
    async (N, M) => {
      let z = null, H = 0;
      if (M.kind === "unit") {
        const D = _e(N.document.units).byId.get(
          M.id
        )?.unit;
        if (!D) throw new Error("该章节已移出目录，请重新选择");
        if (H = D.version_id, D.asset_id && D.version_id) {
          if (z = fe.current.get(D.version_id) || null, !z) {
            const se = await nt({
              projectId: e,
              assetId: D.asset_id,
              versionId: D.version_id,
              reportError: !1
            });
            if (z = Mt(se.content), !z || z.unit_id !== D.id || z.profile !== N.document.type)
              throw new Error("章节内容与目录不一致");
            fe.current.set(D.version_id, z);
          }
        } else
          z = {
            type: "writing_unit",
            schema_version: 1,
            profile: N.document.type,
            unit_id: D.id,
            title: D.title,
            body: "",
            synopsis: "",
            end_state: "",
            open_threads: "",
            ending: "",
            continuity_valid: !1,
            predecessor_version_id: 0
          };
      }
      return {
        selection: M,
        workVersion: N.work_version_id,
        workRevision: N.work_revision,
        unitVersion: H,
        value: { document: N.document, unit: z }
      };
    },
    [e]
  ), de = ne(
    (N) => {
      W.current = N, T(N), K((M) => M + 1), m("");
    },
    [m]
  ), O = ne(
    async (N, M = !0) => {
      if (M && (U.current || !await ce.current.flush()))
        return !1;
      const z = A.current || o.current;
      if (!z || ve(z.document, N))
        return !1;
      const H = ++Z.current;
      Q(!0);
      try {
        const D = await oe(z, N);
        return !u.current || H !== Z.current ? !1 : (de(D), !0);
      } catch (D) {
        return u.current && H === Z.current && f(D), !1;
      } finally {
        u.current && H === Z.current && Q(!1);
      }
    },
    [de, u, oe, f, o]
  );
  me(() => {
    if ($ || !s || Y || te.hasPendingChanges || U.current || x && x.workVersion === s.work_version_id && x.workRevision === s.work_revision || B.current?.version === s.work_version_id && B.current.revision === s.work_revision)
      return;
    B.current = {
      version: s.work_version_id,
      revision: s.work_revision
    };
    const N = x?.selection || $e(s.document), M = Le(s.document, N) && !ve(s.document, N);
    O(
      M ? N : $e(s.document),
      !1
    );
  }, [
    x,
    $,
    te.hasPendingChanges,
    Y,
    O,
    s,
    j
  ]);
  const ee = ne(
    async (N, M = {}, z) => {
      if (U.current || P.current.readonly) return !1;
      U.current = !0, q(!0);
      try {
        if (!await ce.current.flush()) return !1;
        if (N === "restore_document") {
          if (P.current.readonly || P.current.running || o.current?.document.status === "running")
            throw new Error("当前不可恢复版本");
        } else J();
        const H = ge(
          o.current.document,
          N,
          M
        );
        if (H) throw new Error(H);
        if (N === "propose_edit" && z && (!W.current || !z(W.current)))
          return !1;
        E(), _();
        const D = M.unit_id ? o.current.document.units.find(
          (G) => G.id === M.unit_id
        ) : void 0, se = await ze(
          g(N, {
            ...D && M.section_id !== "chapter_plan" ? { expected_unit_version_id: D.version_id } : {},
            ...M
          })
        );
        return b(se), N === "restore_document" && (A.current = null, v(null)), m(""), !0;
      } catch (H) {
        return f(H), !1;
      } finally {
        U.current = !1, u.current && q(!1);
      }
    },
    [
      b,
      J,
      _,
      E,
      g,
      f
    ]
  ), L = ne(async () => {
    const N = o.current;
    if (!(!N?.run_id || N.document.status !== "running" || U.current || P.current.readonly)) {
      U.current = !0, q(!0);
      try {
        await h(), m("");
      } catch (M) {
        f(M);
      } finally {
        U.current = !1, u.current && q(!1);
      }
    }
  }, [h, f]), F = ne(async () => {
    if (!(U.current || ce.current.status === "saving")) {
      U.current = !0, q(!0);
      try {
        await y();
        const N = W.current?.selection, M = N && o.current && Le(o.current.document, N);
        await O(
          M && N ? N : $e(o.current.document),
          !1
        );
      } catch (N) {
        f(N);
      } finally {
        U.current = !1, u.current && q(!1);
      }
    }
  }, [y, O, f]), re = ne(
    async (N) => {
      if (U.current) return !1;
      U.current = !0, q(!0);
      let M = 0;
      try {
        if (!await ce.current.flush()) return !1;
        const z = o.current;
        if (!z || !u.current) return !1;
        M = ++Z.current, Q(!0);
        let H = null;
        if (N !== z.work_version_id) {
          const ae = await nt({
            projectId: e,
            assetId: z.work_asset_id,
            versionId: N,
            reportError: !1
          });
          if (!u.current || M !== Z.current)
            return !1;
          const pe = Lt(ae.content);
          if (!pe || pe.type !== z.document.type)
            throw new Error("历史版本与当前作品不一致");
          H = {
            ...z,
            document: pe,
            work_version_id: ae.id,
            work_revision: zt(ae),
            work_version: ae.version,
            work_updated_at: ae.updated_at || ae.created_at,
            proposal: void 0
          };
        }
        const D = H || z, se = W.current?.selection || $e(D.document), G = Le(D.document, se) && !ve(D.document, se), ie = await oe(
          D,
          G ? se : $e(D.document)
        );
        return !u.current || M !== Z.current ? !1 : (A.current = H, v(H), de(ie), !0);
      } catch (z) {
        return u.current && (!M || M === Z.current) && f(z), !1;
      } finally {
        U.current = !1, u.current && (M && M === Z.current && Q(!1), q(!1));
      }
    },
    [
      de,
      u,
      e,
      oe,
      f,
      o
    ]
  ), ke = ne(
    async (N, M) => {
      if (U.current) return !1;
      const z = ce.current.draft.document;
      if (!z) return !1;
      const H = We(N), D = Dt(z, N, M);
      if (!await ee("save_document", { document: D })) return !1;
      const se = o.current.document;
      if (H) {
        const G = se.outline[H], ie = G[G.length - 1];
        ie && await O(
          { kind: "entity", section: H, id: ie.id },
          !1
        );
      } else {
        const G = se.units, ie = G?.[G.length - 1];
        ie && await O(
          { kind: "unit", id: ie.id, tab: "body" },
          !1
        );
      }
      return !0;
    },
    [ee, O]
  ), Be = !$ && s?.document.status === "running" && !te.hasPendingChanges ? s.document : te.draft.document || R?.document;
  return {
    snapshot: s,
    viewSnapshot: R,
    document: Be,
    historical: !!$,
    selectVersion: re,
    preview: w,
    getSnapshot: () => o.current,
    generationTiming: k,
    selection: x?.selection,
    draft: te,
    loading: Y,
    busy: j,
    error: d,
    conflicted: !!(te.hasPendingChanges && !j && te.status !== "saving" && x && s && (W.current?.workVersion !== s.work_version_id || W.current.workRevision !== s.work_revision)),
    action: ee,
    stop: L,
    openSelection: O,
    addEntry: ke,
    reload: F
  };
}
function De(e, n) {
  return !n || !e.document ? "" : ct(e.document, n, e.unit?.body);
}
function vn(e, n, i) {
  const c = e.document;
  return n.kind === "unit" && n.tab === "plan" ? {
    ...e,
    document: {
      ...c,
      units: Oe(c.units, n.id, {
        plan: i
      })
    }
  } : n.kind === "unit" && e.unit ? { ...e, unit: { ...e.unit, body: i } } : n.kind === "entity" ? {
    ...e,
    document: {
      ...c,
      outline: {
        ...c.outline,
        [n.section]: c.outline[n.section].map(
          (r) => r.id === n.id ? { ...r, description: i } : r
        )
      }
    }
  } : n.kind === "section" && be(n.id) ? {
    ...e,
    document: {
      ...c,
      outline: { ...c.outline, [n.id]: i }
    }
  } : e;
}
function _n(e) {
  const [n, i] = S(
    null
  ), c = V(null), [r, l] = S(null), p = V(null), [s, o] = S(""), u = V(!1), b = V(!1), y = V(!1), g = ne(() => {
    c.current?.clearSelection(), i(null);
  }, []), h = ne(() => {
    y.current = !1, l(null), o(""), g();
  }, [g]), f = e.snapshot?.proposal, m = !!(r && f && f.run_id === r.runId && e.snapshot?.document.status === "ready"), d = r && e.preview?.run_id === r.runId && e.preview.fields.replacement !== void 0 ? e.preview.fields.replacement : "", k = async (x, T, W, I) => {
    let K;
    if (!await e.action(
      "propose_edit",
      { ...x, ...W ? { selected_text: W.text } : {} },
      (j) => {
        if (JSON.stringify(j.selection) !== JSON.stringify(T))
          return o("编辑目标已变化，请重新选择后生成修改建议。"), !1;
        const q = De(j.value, T);
        return W && q !== I ? (o("原文已变化，请重新选择后生成修改建议。"), !1) : (K = {
          selection: T,
          text: q,
          range: W,
          unitVersion: T.kind === "unit" && T.tab !== "plan" ? j.unitVersion : 0
        }, !0);
      }
    ) || !K) return !1;
    const Q = { ...K, runId: e.getSnapshot().run_id };
    return p.current = Q, l(Q), o(""), !0;
  }, w = async (x, T = {}) => {
    if (u.current) return !1;
    u.current = !0, o("");
    try {
      if (x !== "propose_edit") {
        if (l(null), g(), x === "generate_units") {
          const K = e.getSnapshot(), Q = (K ? K.document.units : []).find(
            (j) => !j.has_body && (!T.unit_ids || T.unit_ids.includes(j.id))
          );
          if (Q && !await e.openSelection({ kind: "unit", id: Q.id }))
            return !1;
          y.current = !0;
        }
        const I = await e.action(x, T);
        return I || (y.current = !1), I;
      }
      const W = e.selection;
      return W ? await k(
        T,
        W,
        n,
        De(e.draft.draft, W)
      ) : !1;
    } finally {
      u.current = !1;
    }
  }, E = async (x, T) => {
    if (u.current) return !1;
    const W = p.current, I = W && W.runId === e.getSnapshot()?.run_id ? W.range : null;
    if ((x.selected_text || "") !== (I?.text || ""))
      return o("原选区无法恢复，请重新选择原文后生成修改建议。"), !1;
    u.current = !0;
    try {
      return await k(x, T, I, W?.text);
    } finally {
      u.current = !1;
    }
  }, _ = e.preview, { openSelection: $, snapshot: v, loading: A } = e;
  return me(() => {
    !y.current || A || v?.document.status !== "running" || _?.run_id !== v.run_id || _?.fields.body === void 0 || !_.unit_id || e.selection?.kind === "unit" && e.selection.id === _.unit_id || $({ kind: "unit", id: _.unit_id });
  }, [
    _?.run_id,
    _?.fields.body,
    _?.unit_id,
    e.selection,
    A,
    $,
    v?.run_id,
    v?.document.status
  ]), {
    textSelection: n,
    onTextSelectionChange: i,
    selectionActionsRef: c,
    clearSelection: g,
    discard: h,
    run: w,
    retry: E,
    apply: async () => {
      if (b.current || !m || !r || !f || e.historical || e.busy || e.loading)
        return;
      const x = e.getSnapshot(), T = JSON.stringify(e.selection) === JSON.stringify(r.selection), W = f.unit_id === (r.selection.kind === "unit" ? r.selection.id : void 0) && f.section_id === (r.selection.kind === "unit" && r.selection.tab === "plan" ? "chapter_plan" : r.selection.kind === "entity" ? r.selection.section : r.selection.kind === "section" ? r.selection.id : void 0) && f.entity_id === (r.selection.kind === "entity" ? r.selection.id : void 0) && f.inspiration_id === void 0 && (f.selected_text || "") === (r.range?.text || "");
      if (!T || !W || x?.work_version_id !== f.work_version_id || x.work_revision !== f.work_revision || x.work_asset_id !== f.work_asset_id || De(e.draft.draft, e.selection) !== r.text || r.selection.kind === "unit" && r.selection.tab !== "plan" && f.unit_version_id !== r.unitVersion) {
        o("内容或版本已变化，请丢弃此建议后重新生成。");
        return;
      }
      b.current = !0;
      try {
        if (r.range) {
          if (!c.current?.replaceSelection(
            r.range,
            f.replacement
          )) {
            o("选区已变化，请重新选择后生成。");
            return;
          }
        } else
          e.draft.setDraft(
            vn(
              e.draft.draft,
              r.selection,
              f.replacement
            )
          );
        l(null), g(), await e.draft.flush();
      } finally {
        b.current = !1;
      }
    },
    ready: m,
    pending: !!r,
    preview: m ? f.replacement : d,
    error: s
  };
}
function kn(e, n, i) {
  const [c, r] = S([]), [l, p] = S(0), [s, o] = S(0), [u, b] = S(!1), [y, g] = S(!1), [h, f] = S(!1), [m, d] = S(""), k = V(0), w = V(!1), E = ne(
    async (_) => {
      if (!n) return;
      const $ = ++k.current;
      w.current = !0, _ === 1 ? g(!0) : f(!0), d("");
      try {
        const v = await en({
          projectId: e,
          assetId: n,
          page: _,
          reportError: !1
        });
        if ($ !== k.current) return;
        r(
          (A) => _ === 1 ? v.items : [
            ...A,
            ...v.items.filter(
              (R) => !A.some((x) => x.id === R.id)
            )
          ]
        ), p(_), o(v.total), b(v.hasMore);
      } catch (v) {
        $ === k.current && d(v instanceof Error ? v.message : "读取版本失败");
      } finally {
        $ === k.current && (w.current = !1, g(!1), f(!1));
      }
    },
    [e, n]
  );
  return me(() => (E(1), () => {
    k.current += 1;
  }), [E, i]), {
    versions: c,
    total: s,
    hasMore: u,
    loading: y,
    loadingMore: h,
    error: m,
    onLoadMore: () => {
      !w.current && u && E(l + 1);
    },
    onRetry: () => {
      w.current || E(l || 1);
    }
  };
}
function mt(e, n, i) {
  const [c, r] = S(0), l = n && e !== void 0 ? Math.floor(e / ye) : c;
  return l !== c && r(l), [c, (p) => {
    i?.(), r(p);
  }];
}
function rt({ document: e, section: n, readonly: i, navigationDisabled: c, onSelect: r, onAdd: l, streamTarget: p, following: s = !1, onReadPage: o }) {
  const u = new RegExp(`^outline:${n}:(\\d+)$`).exec(p || ""), [b, y] = mt(u ? Number(u[1]) : void 0, s, o), g = e.outline[n], h = Math.max(1, Math.ceil(g.length / ye)), f = Math.min(b, h - 1), m = { characters: "人物", locations: "地点", props: "必要道具" }[n];
  return /* @__PURE__ */ a("section", { className: "story-entities-page", "aria-label": m, "data-writing-stream-target": `outline:${n}`, children: [
    /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
      /* @__PURE__ */ t("h2", { children: m }),
      /* @__PURE__ */ a("button", { disabled: i || c, onClick: () => l({ kind: "section", id: n }), children: [
        /* @__PURE__ */ t(Ue, { size: 14 }),
        "添加",
        m
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "story-entity-cards", children: g.slice(f * ye, (f + 1) * ye).map((d, k) => /* @__PURE__ */ a(
      "button",
      {
        className: `story-entity-card${p === `outline:${n}:${f * ye + k}` ? " is-streaming" : ""}`,
        disabled: c || !d.id || d.id.startsWith("preview:"),
        "data-writing-stream-target": `outline:${n}:${f * ye + k}`,
        onClick: () => r({ kind: "entity", section: n, id: d.id }),
        children: [
          /* @__PURE__ */ t("strong", { children: d.name || "正在构思…" }),
          /* @__PURE__ */ t("p", { children: d.description || "暂无资料" }),
          /* @__PURE__ */ t("span", { children: "查看与编辑 →" })
        ]
      },
      d.id || `preview:${k}`
    )) }),
    !g.length && /* @__PURE__ */ a("p", { className: "story-outline-empty", children: [
      "暂无",
      m
    ] }),
    h > 1 && /* @__PURE__ */ a("div", { className: "story-reading-pagination", children: [
      /* @__PURE__ */ t("button", { disabled: c || !f, onClick: () => y(f - 1), children: "上一页" }),
      /* @__PURE__ */ a("span", { children: [
        f + 1,
        " / ",
        h
      ] }),
      /* @__PURE__ */ t("button", { disabled: c || f + 1 >= h, onClick: () => y(f + 1), children: "下一页" })
    ] })
  ] });
}
function wt({
  order: e,
  id: n,
  title: i
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "writing-chapter-handle",
      "aria-label": `调整「${i}」顺序`,
      ...e.handleProps(n),
      children: /* @__PURE__ */ t(xt, { size: 14 })
    }
  );
}
function bt({ page: e, onPage: n, onSelect: i, readonly: c, navigationDisabled: r, chapterOrder: l, activeUnitId: p, activeOrdinal: s }) {
  return /* @__PURE__ */ a(he, { children: [
    /* @__PURE__ */ a("div", { className: "writing-chapter-pagination", "aria-label": "剧情分页", children: [
      /* @__PURE__ */ a("span", { children: [
        Te(e.rows) || "0 章",
        " / 共 ",
        e.total,
        " 章"
      ] }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("button", { disabled: r || !e.page, onClick: () => n(e.page - 1), children: "上一页" }),
        /* @__PURE__ */ a("span", { children: [
          e.page + 1,
          " / ",
          e.pages
        ] }),
        /* @__PURE__ */ t("button", { disabled: r || e.page + 1 >= e.pages, onClick: () => n(e.page + 1), children: "下一页" })
      ] })
    ] }),
    /* @__PURE__ */ a("ul", { className: "writing-directory writing-chapter-grid", children: [
      e.rows.map(({ unit: o, label: u, ordinal: b }) => /* @__PURE__ */ a(
        "li",
        {
          className: `writing-chapter-card${!o.id || p === o.id || s === b ? " is-streaming" : ""}`,
          "data-unit-id": o.id,
          "data-writing-stream-target": `chapter:${b - 1}`,
          ...l.itemProps(o.id),
          children: [
            /* @__PURE__ */ a(
              "button",
              {
                className: "writing-entity-card",
                disabled: r || !o.id,
                onClick: () => i({ kind: "unit", id: o.id, tab: "body" }),
                children: [
                  /* @__PURE__ */ a("span", { className: "writing-card-top", children: [
                    /* @__PURE__ */ t("small", { className: "writing-card-ordinal", children: u }),
                    /* @__PURE__ */ t("small", { children: p === o.id ? "生成中" : dt(o) })
                  ] }),
                  /* @__PURE__ */ t("strong", { children: o.title || (o.id ? "未命名章节" : "正在规划…") }),
                  /* @__PURE__ */ t("span", { className: "writing-list-preview", children: o.plan || (o.id ? "暂无剧情" : "正在展开剧情…") }),
                  /* @__PURE__ */ a("span", { className: "writing-entity-footer", children: [
                    o.has_body ? "打开正文" : "进入正文",
                    /* @__PURE__ */ t(Et, { size: 15 })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ a("div", { className: "writing-chapter-card-tools", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  className: "writing-card-edit",
                  "aria-label": `修改剧情：${o.title}`,
                  disabled: c || r || !o.id,
                  onClick: () => i({ kind: "unit", id: o.id, tab: "plan" }),
                  children: /* @__PURE__ */ t(Ve, { size: 13 })
                }
              ),
              /* @__PURE__ */ t(wt, { order: l, id: o.id, title: o.title })
            ] })
          ]
        },
        o.id || `preview:${b}`
      )),
      !e.total && /* @__PURE__ */ t("li", { className: "writing-material-empty", children: "暂无章节" })
    ] })
  ] });
}
function Nn({ document: e, readonly: n, navigationDisabled: i, onSelect: c, onAdd: r, onPreferences: l, onEditSection: p, chapterOrder: s, activeUnitId: o, streamTarget: u, following: b = !1, onReadPage: y }) {
  const g = Vt(e), h = /^chapter:(\d+)$/.exec(u || ""), [f, m] = mt(h ? Number(h[1]) : void 0, b, y);
  return /* @__PURE__ */ a("div", { className: "story-outline-page", children: [
    g && /* @__PURE__ */ a("section", { className: "story-outline-inspiration", "aria-label": "已选灵感", children: [
      /* @__PURE__ */ t("span", { children: "已选灵感" }),
      /* @__PURE__ */ t("h2", { children: g.title }),
      /* @__PURE__ */ t("p", { children: g.content })
    ] }),
    /* @__PURE__ */ a("section", { className: "story-outline-preferences", "aria-label": "写作设定", "data-writing-stream-target": "preferences", children: [
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("h3", { children: "写作设定" }),
        /* @__PURE__ */ t("p", { children: Ot(e.preferences) }),
        e.preferences.style_instructions && /* @__PURE__ */ t("p", { className: "story-style-note", children: e.preferences.style_instructions })
      ] }),
      /* @__PURE__ */ t("button", { disabled: n, onClick: l, children: "修改" })
    ] }),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "故事走向", children: [
      /* @__PURE__ */ t("div", { className: "story-section-heading", children: /* @__PURE__ */ t("h2", { children: "故事走向" }) }),
      /* @__PURE__ */ a("article", { className: "story-text-card", "data-writing-stream-target": "outline:overview", children: [
        /* @__PURE__ */ t("p", { children: e.outline.overview || "故事走向会在这里逐步展开。" }),
        /* @__PURE__ */ a("button", { disabled: n || i, "aria-label": "修改故事走向", onClick: () => p("overview"), children: [
          /* @__PURE__ */ t(Ve, { size: 13 }),
          "修改"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ t(rt, { document: e, section: "characters", readonly: n, navigationDisabled: i, onSelect: c, onAdd: r, streamTarget: u, following: b, onReadPage: y }),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "背景", children: [
      /* @__PURE__ */ t("div", { className: "story-section-heading", children: /* @__PURE__ */ t("h2", { children: "背景" }) }),
      /* @__PURE__ */ a("article", { className: "story-text-card", "data-writing-stream-target": "outline:world", children: [
        /* @__PURE__ */ t("h3", { children: "环境与规则" }),
        /* @__PURE__ */ t("p", { children: e.outline.world || "暂无背景" }),
        /* @__PURE__ */ a("button", { disabled: n || i, "aria-label": "修改环境与规则", onClick: () => p("world"), children: [
          /* @__PURE__ */ t(Ve, { size: 13 }),
          "修改"
        ] })
      ] }),
      ["locations", "props"].map((d) => /* @__PURE__ */ t(rt, { document: e, section: d, readonly: n, navigationDisabled: i, onSelect: c, onAdd: r, streamTarget: u, following: b, onReadPage: y }, d))
    ] }),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "剧情大纲", children: [
      /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ t("h2", { children: "剧情大纲" }),
        /* @__PURE__ */ a("button", { disabled: n || i, onClick: () => r({ kind: "section", id: "chapters" }), children: [
          /* @__PURE__ */ t(Ue, { size: 14 }),
          "添加章节"
        ] })
      ] }),
      /* @__PURE__ */ t(bt, { page: ut(_e(e.units).canonical, f), onPage: m, onSelect: c, readonly: n, navigationDisabled: i, chapterOrder: s, activeUnitId: o, activeOrdinal: h ? Number(h[1]) + 1 : void 0 })
    ] })
  ] });
}
function Cn({
  preferences: e,
  disabled: n,
  onSave: i,
  onClose: c
}) {
  const [r, l] = S(() => ({ ...e })), [p, s] = S(!1), [o, u] = S(""), b = V(!1), y = n || p;
  return /* @__PURE__ */ t(
    Ee,
    {
      title: "写作设置",
      className: "writing-preferences-dialog",
      closeDisabled: p,
      onClose: c,
      children: /* @__PURE__ */ a(
        "form",
        {
          className: "writing-dialog-scroll writing-preferences-form",
          onSubmit: async (g) => {
            if (g.preventDefault(), !(n || b.current)) {
              b.current = !0, s(!0), u("");
              try {
                await i({
                  ...r,
                  genre: r.genre.trim(),
                  style_instructions: r.style_instructions.trim()
                }) ? c() : u("未能保存，请重试。设置已保留。");
              } catch (h) {
                u(
                  h instanceof Error ? h.message : "保存失败，设置已保留。"
                );
              } finally {
                b.current = !1, s(!1);
              }
            }
          },
          children: [
            /* @__PURE__ */ a("label", { className: "writing-preferences-full", children: [
              "题材",
              /* @__PURE__ */ t(
                "input",
                {
                  "aria-label": "题材",
                  placeholder: "沿用创作要求",
                  disabled: y,
                  value: r.genre,
                  onChange: (g) => l({ ...r, genre: g.target.value })
                }
              ),
              /* @__PURE__ */ t("span", { className: "writing-genre-shortcuts", children: ["悬疑", "都市", "奇幻", "言情", "日常"].map((g) => /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  "aria-pressed": r.genre === g,
                  disabled: y,
                  onClick: () => l({ ...r, genre: g }),
                  children: g
                },
                g
              )) })
            ] }),
            [
              { key: "style", label: "文风", options: qt },
              { key: "pov", label: "叙事视角", options: Ft },
              { key: "mode", label: "写作模式", options: Ut }
            ].map(({ key: g, label: h, options: f }) => /* @__PURE__ */ a("label", { children: [
              h,
              /* @__PURE__ */ a(
                "select",
                {
                  "aria-label": h,
                  disabled: y,
                  value: r[g],
                  onChange: (m) => l({ ...r, [g]: m.target.value }),
                  children: [
                    /* @__PURE__ */ t("option", { value: "", children: "沿用创作要求" }),
                    f.map((m) => /* @__PURE__ */ t("option", { value: m.value, children: m.label }, m.value))
                  ]
                }
              )
            ] }, g)),
            [
              {
                key: "chapter_words",
                label: "每章目标字数",
                placeholder: "不限定"
              },
              {
                key: "planned_chapters",
                label: "计划总章数",
                placeholder: "暂不确定"
              }
            ].map(({ key: g, label: h, placeholder: f }) => /* @__PURE__ */ a("label", { children: [
              h,
              /* @__PURE__ */ t(
                "input",
                {
                  "aria-label": h,
                  type: "number",
                  min: 1,
                  step: 1,
                  max: Number.MAX_SAFE_INTEGER,
                  placeholder: f,
                  disabled: y,
                  value: r[g] || "",
                  onChange: (m) => l({
                    ...r,
                    [g]: m.target.value === "" ? 0 : Number(m.target.value)
                  })
                }
              )
            ] }, g)),
            /* @__PURE__ */ a("label", { className: "writing-preferences-full", children: [
              "自定义文风要求",
              /* @__PURE__ */ t(
                "textarea",
                {
                  "aria-label": "自定义文风要求",
                  rows: 3,
                  placeholder: "例如：少用比喻，通过对话和动作表现情绪",
                  disabled: y,
                  value: r.style_instructions,
                  onChange: (g) => l({ ...r, style_instructions: g.target.value })
                }
              )
            ] }),
            o && /* @__PURE__ */ t(
              "p",
              {
                role: "alert",
                className: "writing-preferences-full writing-inspiration-form-error",
                children: o
              }
            ),
            /* @__PURE__ */ a("div", { className: "writing-preferences-full writing-actions", children: [
              /* @__PURE__ */ t("button", { type: "button", disabled: p, onClick: c, children: "取消" }),
              /* @__PURE__ */ t("button", { type: "submit", className: "is-primary", disabled: y, children: p ? "保存中…" : "保存" })
            ] })
          ]
        }
      )
    }
  );
}
function Sn({
  document: e,
  recoverableDraft: n,
  selection: i,
  value: c,
  readonly: r,
  onChange: l,
  onSelect: p,
  chapterOrder: s,
  onDeleteChapter: o,
  directory: u,
  navigationDisabled: b,
  onTextSelectionChange: y,
  selectionActionsRef: g
}) {
  const h = (_) => l({ ...c, document: _ }), f = (_, $, v, A = !1) => /* @__PURE__ */ t(
    "div",
    {
      className: "writing-body",
      "aria-label": _,
      "data-writing-stream-target": i.kind === "unit" ? `unit:${i.id}:${i.tab === "plan" ? "plan" : "body"}` : void 0,
      children: /* @__PURE__ */ t(
        dn,
        {
          kind: A ? "richtext" : "text",
          contentFormat: "markdown",
          value: $,
          readonly: r,
          onTextSelectionChange: y,
          selectionActionsRef: g,
          onChange: v
        }
      )
    }
  );
  if (i.kind === "unit") {
    const _ = u.index.byId.get(i.id), $ = _?.unit;
    if (!$) return null;
    const v = i.tab === "plan";
    return /* @__PURE__ */ a(he, { children: [
      /* @__PURE__ */ a("div", { className: "writing-manuscript-heading", children: [
        /* @__PURE__ */ t("span", { className: "writing-manuscript-ordinal", children: _.label }),
        /* @__PURE__ */ a("label", { className: "writing-title-field", children: [
          /* @__PURE__ */ t("span", { className: "writing-sr-only", children: "标题" }),
          /* @__PURE__ */ t(
            "input",
            {
              "aria-label": "标题",
              value: $.title,
              readOnly: r,
              onChange: (A) => h({
                ...e,
                units: Oe(e.units, $.id, {
                  title: A.target.value
                })
              })
            }
          )
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "writing-delete-chapter is-danger",
            disabled: r || s.handleProps($.id).disabled,
            onClick: () => o($.id),
            children: [
              /* @__PURE__ */ t(at, { size: 14 }),
              "删除章节"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ t("div", { className: "writing-chapter-neighbors", "aria-label": "切换章节", children: [
        { offset: -1, label: "上一章", Icon: Rt },
        { offset: 1, label: "下一章", Icon: Ae }
      ].map(({ offset: A, label: R, Icon: x }) => {
        const T = u.index.canonical[_.ordinal - 1 + A];
        return /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            disabled: b || !T,
            title: T ? `${T.label}：${T.unit.title}` : void 0,
            onClick: () => T && p({
              kind: "unit",
              id: T.unit.id,
              tab: "body"
            }),
            children: [
              /* @__PURE__ */ t(x, { size: 14 }),
              R
            ]
          },
          R
        );
      }) }),
      !v && /* @__PURE__ */ a("section", { className: "writing-plan-reference", "aria-label": "本章剧情", children: [
        /* @__PURE__ */ a("div", { className: "writing-row", children: [
          /* @__PURE__ */ t("h3", { children: "本章剧情" }),
          /* @__PURE__ */ t("button", { disabled: r || b, onClick: () => p({ ...i, tab: "plan" }), children: "修改" })
        ] }),
        /* @__PURE__ */ t("p", { children: $.plan })
      ] }),
      !v && n && !c.unit?.body && /* @__PURE__ */ a("section", { className: "writing-draft-recovery", "aria-label": "未完成正文草稿", children: [
        /* @__PURE__ */ t("p", { children: "上次生成已中断，正文草稿已保留。" }),
        /* @__PURE__ */ t("button", { disabled: r, onClick: () => c.unit && l({ ...c, unit: { ...c.unit, body: n } }), children: "恢复草稿" })
      ] }),
      !v && $.has_body && ($.continuity_status === "pending" || $.dependency_stale) && /* @__PURE__ */ t("p", { className: "writing-continuity-note", role: "status", children: "正文已保存，剧情衔接待整理。" }),
      !v && !!$.continuity_findings?.length && /* @__PURE__ */ t("ul", { className: "writing-continuity-findings", "aria-label": "剧情核对结果", children: $.continuity_findings.map((A, R) => /* @__PURE__ */ a("li", { children: [
        A.message,
        A.evidence && /* @__PURE__ */ t("small", { children: A.evidence })
      ] }, R)) }),
      v ? f(
        "章纲",
        $.plan,
        (A) => h({
          ...e,
          units: Oe(e.units, $.id, {
            plan: A
          })
        })
      ) : c.unit && f(
        "正文",
        c.unit.body,
        (A) => l({ ...c, unit: { ...c.unit, body: A } }),
        !0
      )
    ] });
  }
  if (i.kind === "section" && i.id === "chapters")
    return /* @__PURE__ */ t(bt, { page: u.page, onPage: u.setPage, onSelect: p, readonly: r, navigationDisabled: b, chapterOrder: s });
  if (i.kind === "section" && be(i.id)) {
    const _ = i.id;
    return f("内容", e.outline[_], ($) => h({ ...e, outline: { ...e.outline, [_]: $ } }));
  }
  const m = We(i);
  if (!m) return null;
  const d = ft.find((_) => _.id === m).label, k = e.outline[m];
  if (i.kind !== "entity") return null;
  const w = k.find((_) => _.id === i.id);
  if (!w) return null;
  const E = (_) => h({
    ...e,
    outline: {
      ...e.outline,
      [m]: k.map(
        ($) => $.id === w.id ? { ...$, ..._ } : $
      )
    }
  });
  return /* @__PURE__ */ a(he, { children: [
    /* @__PURE__ */ a("label", { className: "writing-title-field", children: [
      /* @__PURE__ */ a("span", { className: "writing-sr-only", children: [
        d,
        "名称"
      ] }),
      /* @__PURE__ */ t(
        "input",
        {
          "aria-label": `${d}名称`,
          value: w.name,
          readOnly: r,
          onChange: (_) => E({ name: _.target.value })
        }
      )
    ] }),
    f(
      `${d}描述`,
      w.description,
      (_) => E({ description: _ })
    )
  ] });
}
function $n({
  selection: e,
  disabled: n,
  closeDisabled: i,
  error: c,
  onSave: r,
  onClose: l
}) {
  const [p, s] = S({
    title: "",
    description: ""
  }), [o, u] = S(!1), b = V(!1), y = We(e), g = y ? ft.find((h) => h.id === y).label : "章节";
  return /* @__PURE__ */ t(
    Ee,
    {
      title: `添加${g}`,
      className: "writing-entry-dialog",
      closeDisabled: i || o,
      onClose: l,
      children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ a(
          "form",
          {
            className: "writing-new-form",
            onSubmit: async (h) => {
              if (h.preventDefault(), !(n || b.current)) {
                b.current = !0, u(!0);
                try {
                  await r(p);
                } finally {
                  b.current = !1, u(!1);
                }
              }
            },
            children: [
              /* @__PURE__ */ a("label", { children: [
                g,
                "名称",
                /* @__PURE__ */ t(
                  "input",
                  {
                    "aria-label": `${g}名称`,
                    required: !0,
                    disabled: n || o,
                    value: p.title,
                    onChange: (h) => s({ ...p, title: h.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ a("label", { children: [
                y ? "描述" : "章纲（可稍后填写）",
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    "aria-label": `${g}${y ? "描述" : "章纲"}`,
                    rows: 5,
                    disabled: n || o,
                    value: p.description,
                    onChange: (h) => s({ ...p, description: h.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "is-primary",
                  type: "submit",
                  disabled: n || o || !p.title.trim(),
                  children: "保存并打开"
                }
              )
            ]
          }
        ),
        c && /* @__PURE__ */ t("p", { className: "writing-error", role: "alert", children: c })
      ] })
    }
  );
}
function yt({
  document: e,
  savedDocument: n = e,
  selection: i,
  body: c,
  selectedCharacters: r
}) {
  const l = i.kind === "unit" ? _e(e.units).byId.get(i.id)?.unit : void 0, p = We(i), s = i.kind === "section" && i.id === "chapters", o = i.kind === "section" && !!p, u = i.kind === "unit" && i.tab === "plan", y = !!ct(e, i, c).trim(), g = pt(e, i) + (l ? u ? " · 本章剧情" : " · 正文" : "");
  let h = y ? "重写当前内容" : "生成当前内容";
  r ? h = "修改选中文字" : s ? h = e.units.length ? "添加章节" : "规划章节剧情" : o ? h = `${e.outline[p].length ? "更新" : "生成"}${g}` : i.kind === "section" && be(i.id) && !y ? h = `生成${g}` : l && !u && !y && (h = "生成本章正文");
  const f = s ? e.units.length ? "append" : "generate_chapters" : l && !u && !y ? "generate_units" : o || u || !y ? "generate_section" : "propose_edit", m = ge(n, f, {
    section_id: u ? "chapter_plan" : p || (i.kind === "section" && be(i.id) ? i.id : void 0),
    unit_id: l?.id,
    unit_ids: l ? [l.id] : void 0,
    mode: "single"
  });
  return {
    selected: l,
    entitySection: p,
    entityList: o,
    directory: s,
    chapterPlan: u,
    hasContent: y,
    label: g,
    primaryLabel: h,
    available: !m,
    reason: m,
    instruction: r ? "修改选中的文字，保留原意并使表达自然流畅。" : y ? "重写当前内容，保持作品设定和上下文一致。" : `生成${g}，参考作品已有设定。`,
    remaining: _e(e.units).firstUnwritten >= 0
  };
}
function xn(e, n, i) {
  const { selection: c } = e, r = yt(e), l = { instruction: n };
  return i ? { action: "generate_units", extra: { ...l, mode: "continue" } } : r.directory ? e.document.units.length ? { action: "append", extra: { ...l, count: 1 } } : { action: "generate_chapters", extra: l } : r.entityList ? {
    action: "generate_section",
    extra: { ...l, section_id: r.entitySection }
  } : r.selected && r.chapterPlan && !r.hasContent ? {
    action: "generate_section",
    extra: {
      ...l,
      section_id: "chapter_plan",
      unit_id: r.selected.id
    }
  } : r.selected && !r.chapterPlan && !r.hasContent ? {
    action: "generate_units",
    extra: { ...l, mode: "single", unit_ids: [r.selected.id] }
  } : c.kind === "section" && be(c.id) && !r.hasContent ? {
    action: "generate_section",
    extra: { ...l, section_id: c.id }
  } : (r.selected ? (l.unit_id = r.selected.id, r.chapterPlan && (l.section_id = "chapter_plan")) : (l.section_id = r.entitySection || (c.kind === "section" && be(c.id) ? c.id : void 0), c.kind === "entity" && (l.entity_id = c.id)), l.instruction ||= r.instruction, { action: "propose_edit", extra: l });
}
function En({
  document: e,
  savedDocument: n,
  onConfirmationChange: i,
  selection: c,
  disabled: r,
  body: l,
  selectedCharacters: p,
  onClearSelection: s,
  onAction: o,
  proposalPending: u,
  proposalReady: b,
  proposalPreview: y,
  running: g,
  onApply: h,
  onDiscard: f,
  directory: m,
  activeBatchIds: d
}) {
  const [k, w] = S(""), E = c.kind === "section" && c.id !== "chapters", [_, $] = S(10), [v, A] = S(""), R = xe(() => Ht(n.units), [n.units]), x = R.slice(0, Jt), T = tt(n.units, n.preferences.planned_chapters), W = tt(n.units, n.preferences.planned_chapters, v === "" ? void 0 : Number(v)), I = ge(n, "append", { count: W.count }), K = I ? "规划后续章节" : `规划第 ${W.start}—${W.end} 章`, Y = xe(
    () => g && d?.length ? d.flatMap((L) => {
      const F = m.index.byId.get(L);
      return F ? [F] : [];
    }) : Kt(n.units, _),
    [n.units, _, g, d, m.index]
  ), [Q, j] = S(!1), q = V(!1), [U, P] = S(null), [Z, fe] = S(""), we = {
    document: e,
    savedDocument: n,
    selection: c,
    body: l,
    selectedCharacters: p
  }, B = yt(we), J = r || Q || u, ue = async (L, F = {}) => {
    if (J || q.current || ge(n, L, F)) return !1;
    q.current = !0, j(!0);
    try {
      const re = await o(L, {
        instruction: k.trim(),
        ...F
      });
      return re && w(""), re;
    } finally {
      q.current = !1, j(!1);
    }
  }, te = (L, F = {}) => {
    if (J || q.current || ge(n, L, F))
      return;
    const re = tn(n, L, F);
    re ? (P({ action: L, extra: F, impact: re }), fe(""), i(!0)) : ue(L, F);
  }, ce = () => {
    P(null), i(!1);
  }, oe = (L = !1, F = "") => {
    const { action: re, extra: ke } = xn(
      we,
      [F, k.trim()].filter(Boolean).join(`
`),
      L
    );
    te(
      re,
      L ? { ...ke, count: _ } : ke
    );
  }, de = E || B.directory || B.selected && !B.chapterPlan && B.hasContent;
  let O;
  !p && !B.chapterPlan && !B.entityList && !B.selected && (n.units.length ? Y.length && !Y.some(({ unit: L }) => L.plan_stale) ? O = { label: "继续写正文", action: "generate_units", extra: { mode: "continue", count: _ } } : !R.length && T.count && (O = { label: K, action: "append", extra: { count: W.count } }) : O = { label: "生成大纲与剧情", action: "generate_outline", extra: {} });
  const ee = O ? ge(n, O.action, O.extra) : "";
  return /* @__PURE__ */ a("div", { className: "writing-controls", role: "group", "aria-label": "AI 创作", children: [
    /* @__PURE__ */ a("h3", { children: [
      /* @__PURE__ */ t(Ze, { size: 16, "aria-hidden": "true" }),
      "AI 创作"
    ] }),
    !p && /* @__PURE__ */ t("p", { className: "writing-ai-current", "aria-label": "当前 AI 目标", children: B.label }),
    p > 0 && /* @__PURE__ */ a("div", { className: "writing-ai-target", children: [
      /* @__PURE__ */ t("span", { children: "修改选中文字" }),
      /* @__PURE__ */ a("div", { className: "writing-row", children: [
        /* @__PURE__ */ a("small", { children: [
          p,
          " 字"
        ] }),
        /* @__PURE__ */ t("button", { disabled: u, onClick: s, children: "清除选区" })
      ] })
    ] }),
    u ? /* @__PURE__ */ a("section", { className: "writing-proposal-preview", "aria-label": "AI 修改建议", children: [
      /* @__PURE__ */ a("div", { className: "writing-row", children: [
        /* @__PURE__ */ t("h4", { children: "修改建议" }),
        /* @__PURE__ */ t("span", { role: "status", children: b ? "等待应用" : g ? "正在生成…" : "未完成" })
      ] }),
      /* @__PURE__ */ t(
        "div",
        {
          className: "writing-proposal-text",
          "aria-live": "off",
          "data-writing-stream-target": "proposal",
          children: y || (g ? "正在准备内容…" : "生成未完成，原文已保留。")
        }
      ),
      /* @__PURE__ */ a("div", { className: "writing-proposal-actions", children: [
        /* @__PURE__ */ t(
          "button",
          {
            className: "is-primary",
            disabled: r || !b,
            onClick: h,
            children: "应用修改"
          }
        ),
        /* @__PURE__ */ t("button", { disabled: r, onClick: f, children: "丢弃建议" })
      ] })
    ] }) : /* @__PURE__ */ a(he, { children: [
      R.length > 0 && c.kind !== "entity" && !B.chapterPlan && !p && /* @__PURE__ */ a("section", { className: "writing-primary-action", "aria-label": "后续剧情同步", children: [
        /* @__PURE__ */ a("p", { className: "writing-ai-note", children: [
          "待同步：",
          Te(R)
        ] }),
        /* @__PURE__ */ a("button", { className: "is-primary", disabled: J, onClick: () => te("generate_chapters", { unit_ids: x.map(({ unit: L }) => L.id) }), children: [
          "同步后续剧情 ",
          /* @__PURE__ */ t(Ae, { size: 15 })
        ] }),
        /* @__PURE__ */ a("small", { className: "writing-batch-range", children: [
          "本批 ",
          Te(x),
          R.length > x.length ? ` · 其余 ${R.length - x.length} 章下一批同步` : ""
        ] }),
        n.units.some((L) => L.has_body) && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: "已写正文保留；需要调整时，打开对应章节生成修改建议。" })
      ] }),
      O && !p && /* @__PURE__ */ a("div", { className: "writing-ai-actions writing-primary-action", children: [
        /* @__PURE__ */ a(
          "button",
          {
            className: "is-primary",
            disabled: J || !!ee,
            title: ee || void 0,
            onClick: () => te(O.action, O.extra),
            children: [
              O.label,
              /* @__PURE__ */ t(Ae, { size: 15, "aria-hidden": "true" })
            ]
          }
        ),
        ee && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: ee })
      ] }),
      B.selected?.has_body && (B.selected.continuity_status === "pending" || B.selected.dependency_stale) && /* @__PURE__ */ a("div", { className: "writing-primary-action", children: [
        /* @__PURE__ */ t("p", { className: "writing-ai-note", children: "正文已保存，补充剧情衔接后再继续。" }),
        /* @__PURE__ */ t("button", { className: "is-primary", disabled: J, onClick: () => te("retry_continuity", { unit_id: B.selected.id, expected_unit_version_id: B.selected.version_id }), children: "整理本章衔接" })
      ] }),
      /* @__PURE__ */ a("label", { children: [
        /* @__PURE__ */ a("span", { children: [
          "修改要求 ",
          /* @__PURE__ */ t("small", { children: "可选" })
        ] }),
        /* @__PURE__ */ t(
          "textarea",
          {
            "aria-label": "创作要求",
            rows: 4,
            disabled: J,
            placeholder: "希望怎么写，或怎么改？",
            value: k,
            onChange: (L) => w(L.target.value)
          }
        )
      ] }),
      !B.directory && !B.entityList && B.hasContent && /* @__PURE__ */ t("div", { className: "writing-quick-actions", "aria-label": "快捷修改", children: [
        { label: "润色", instruction: "润色表达，保留原意与事实。" },
        {
          label: "扩写",
          instruction: "扩写细节，保持人物和情节一致。"
        },
        { label: "精简", instruction: "精简冗余表达，保留关键信息。" }
      ].map((L) => /* @__PURE__ */ t(
        "button",
        {
          disabled: J || !B.available,
          onClick: () => oe(!1, L.instruction),
          children: L.label
        },
        L.label
      )) }),
      /* @__PURE__ */ t("div", { className: "writing-ai-actions", children: !B.directory && (!E || B.hasContent) && /* @__PURE__ */ a(
        "button",
        {
          className: O && !p ? void 0 : "is-primary",
          disabled: J || !B.available,
          onClick: () => oe(),
          children: [
            /* @__PURE__ */ t(Ze, { size: 15, "aria-hidden": "true" }),
            p ? "修改选中文字" : B.hasContent && !B.directory && !B.entityList ? "生成修改建议" : B.primaryLabel
          ]
        }
      ) }),
      !B.available && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: B.reason }),
      (E || B.directory) && n.units.length > 0 && /* @__PURE__ */ a("div", { className: "writing-plan-more", children: [
        /* @__PURE__ */ a("p", { className: "writing-ai-note", children: [
          "已规划 1—",
          n.units.length,
          " 章",
          n.preferences.planned_chapters ? ` / 计划 ${n.preferences.planned_chapters} 章` : ""
        ] }),
        T.count > 0 ? /* @__PURE__ */ a(he, { children: [
          /* @__PURE__ */ a("label", { className: "writing-count-field", children: [
            /* @__PURE__ */ t("span", { children: "本批剧情" }),
            /* @__PURE__ */ t("input", { type: "number", min: 1, max: T.count, "aria-label": "追加剧情章数", value: v, placeholder: String(T.count), disabled: J, onChange: (L) => A(L.target.value) })
          ] }),
          O?.action !== "append" && /* @__PURE__ */ a(he, { children: [
            /* @__PURE__ */ t("button", { disabled: J || !!I, title: I || void 0, onClick: () => te("append", { count: W.count }), children: K }),
            I && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: I })
          ] })
        ] }) : /* @__PURE__ */ t("small", { className: "writing-batch-range", children: "已规划至计划总章数" })
      ] }),
      de && /* @__PURE__ */ a("div", { className: "writing-continuation", children: [
        /* @__PURE__ */ a("label", { className: "writing-count-field", children: [
          /* @__PURE__ */ t("span", { children: "本批正文" }),
          /* @__PURE__ */ t(
            "select",
            {
              "aria-label": "本批正文数量",
              disabled: J,
              value: _,
              onChange: (L) => $(Number(L.target.value)),
              children: [1, 3, 5, 10].map((L) => /* @__PURE__ */ a("option", { value: L, children: [
                "最多 ",
                L,
                " 章"
              ] }, L))
            }
          )
        ] }),
        Y.length > 0 && /* @__PURE__ */ t("small", { className: "writing-batch-range", children: Te(Y) }),
        O?.action !== "generate_units" && /* @__PURE__ */ a(
          "button",
          {
            disabled: J || !B.remaining || !!ge(n, "generate_units", {
              mode: "continue",
              count: _
            }),
            title: ge(n, "generate_units", {
              mode: "continue",
              count: _
            }) || void 0,
            onClick: () => oe(!0),
            children: [
              "生成本批正文",
              /* @__PURE__ */ t(Ae, { size: 14, "aria-hidden": "true" })
            ]
          }
        )
      ] })
    ] }),
    U && /* @__PURE__ */ t(
      ht,
      {
        title: "确认更新范围",
        description: U.impact,
        confirmLabel: "确认更新",
        pending: Q,
        disabled: J,
        error: Z,
        onClose: () => {
          q.current || ce();
        },
        onConfirm: async () => {
          await ue(U.action, U.extra) ? ce() : q.current || fe("更新未成功，原内容已保留，请重试。");
        }
      }
    )
  ] });
}
function Rn({
  timing: e
}) {
  const [n] = S(Date.now), i = nn(!0), c = rn(
    Math.max(0, i - (e?.startedAt || n))
  ), r = e?.source === "server" ? `已用 ${c}` : `本次查看已用 ${c}`;
  return /* @__PURE__ */ a("span", { className: "writing-generation-clock", role: "timer", "aria-live": "off", children: [
    /* @__PURE__ */ t(Pt, { size: 13, "aria-hidden": "true" }),
    r
  ] });
}
function Pn({
  snapshot: e,
  running: n,
  generationTiming: i,
  children: c
}) {
  n && e?.document.status !== "running" && (e = null);
  const r = i && i.workAssetId === e?.work_asset_id && i.runId === e.run_id && i.requestId === e.request_id ? i : null;
  if (!n) return null;
  const l = e?.checkpoint, p = Number(l?.target) || 0, s = Math.max(
    0,
    Math.min(p, Number(l?.completed) || 0)
  );
  return /* @__PURE__ */ a("div", { className: "writing-generation-progress", children: [
    /* @__PURE__ */ a(
      "span",
      {
        className: "writing-generation-task",
        role: "status",
        title: qe(e),
        children: [
          /* @__PURE__ */ t(ot, { size: 14, className: "ws-spin", "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: qe(e) })
        ]
      }
    ),
    /* @__PURE__ */ t(
      Rn,
      {
        timing: r
      },
      `${e?.work_asset_id}:${e?.run_id}:${e?.request_id}`
    ),
    p > 1 && /* @__PURE__ */ a("span", { className: "writing-generation-count", children: [
      "已完成 ",
      s,
      "/",
      p
    ] }),
    c
  ] });
}
function An({
  snapshot: e,
  inline: n = !1,
  preview: i,
  generationTiming: c,
  running: r,
  busy: l,
  readonly: p,
  error: s,
  conflicted: o,
  reloadDisabled: u,
  onReload: b,
  onRetry: y,
  onStop: g
}) {
  const [h, f] = S(!1), m = gt(e), d = m && e ? ge(e.document, m.action, m.extra) : "", k = e?.document.status === "stopped" && !!(e.checkpoint?.history_total && (e.checkpoint.history_completed || 0) < e.checkpoint.history_total);
  return /* @__PURE__ */ a("div", { className: `writing-feedback${n ? " is-title-status" : ""}`, children: [
    /* @__PURE__ */ t(
      Pn,
      {
        snapshot: e,
        preview: i,
        running: r,
        generationTiming: c,
        children: r && /* @__PURE__ */ a(
          "button",
          {
            disabled: l || p || !e?.run_id || e.document.status !== "running",
            onClick: () => {
              g();
            },
            children: [
              /* @__PURE__ */ t(At, { size: 13 }),
              "停止生成"
            ]
          }
        )
      }
    ),
    s && !o && /* @__PURE__ */ a("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t("p", { title: s, children: s }),
      /* @__PURE__ */ t("button", { disabled: u, onClick: () => {
        b();
      }, children: "刷新状态" })
    ] }),
    o && /* @__PURE__ */ a("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t("p", { children: "作品已在其他窗口更新。当前未保存内容已保留，请先复制需要保留的修改。" }),
      /* @__PURE__ */ t("button", { disabled: l, onClick: () => f(!0), children: "载入最新版" })
    ] }),
    h && /* @__PURE__ */ t(
      Ee,
      {
        title: "载入最新版",
        closeDisabled: l,
        onClose: () => f(!1),
        children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
          /* @__PURE__ */ t("p", { children: "载入最新版将放弃当前未保存修改，请先复制需要保留的内容。" }),
          /* @__PURE__ */ a("div", { className: "writing-actions", children: [
            /* @__PURE__ */ t(
              "button",
              {
                disabled: l,
                onClick: async () => {
                  await b(), f(!1);
                },
                children: "放弃修改并载入"
              }
            ),
            /* @__PURE__ */ t("button", { disabled: l, onClick: () => f(!1), children: "保留编辑" })
          ] })
        ] })
      }
    ),
    e && m && /* @__PURE__ */ a("div", { className: "writing-progress", children: [
      /* @__PURE__ */ t("span", { children: k ? `前文已整理 ${e.checkpoint?.history_completed || 0}/${e.checkpoint?.history_total}` : `${qe(e)}未完成` }),
      /* @__PURE__ */ t(
        "button",
        {
          disabled: l || p || r || o || !!d,
          title: d || void 0,
          onClick: y,
          children: k ? "继续整理" : "重试这一步"
        }
      ),
      d && /* @__PURE__ */ t("small", { children: d })
    ] })
  ] });
}
function Tn({
  document: e,
  selection: n,
  disabled: i,
  mutationDisabled: c,
  onSelect: r,
  onAdd: l,
  chapterOrder: p,
  directory: s
}) {
  const o = V(null), [u, b] = S(0), [y, g] = S(400), [h, f] = S(""), [m, d] = S(""), k = s.index.byId.get(s.focus.id), w = k ? s.index.canonical.length - k.ordinal : 0;
  me(() => {
    const v = o.current;
    if (!v) return;
    const A = new ResizeObserver(() => g(v.clientHeight));
    return A.observe(v), () => A.disconnect();
  }, []), me(() => {
    o.current && (o.current.scrollTop = 0);
  }, [s.query]), me(() => {
    o.current && (o.current.scrollTop = w * Ce);
  }, [s.focus, w]);
  const E = Yt(s.rows.length, u, y), _ = He, $ = { kind: "section", id: "chapters" };
  return /* @__PURE__ */ a("nav", { className: "writing-nav", "aria-label": "创作目录", children: [
    /* @__PURE__ */ a(
      "button",
      {
        disabled: i,
        "aria-current": n?.kind !== "unit" && !(n?.kind === "section" && n.id === "chapters") ? "page" : void 0,
        onClick: () => r({ kind: "section", id: "overview" }),
        children: [
          /* @__PURE__ */ t(Tt, { size: 16 }),
          /* @__PURE__ */ t("span", { children: "大纲" })
        ]
      }
    ),
    /* @__PURE__ */ a("div", { className: "writing-unit-nav", "aria-label": _.directory, children: [
      /* @__PURE__ */ a("div", { className: "writing-directory-heading", children: [
        /* @__PURE__ */ a(
          "button",
          {
            className: "writing-directory-link",
            disabled: i || !!ve(e, $),
            title: ve(e, $) || void 0,
            "aria-current": n?.kind === "section" && n.id === "chapters" ? "page" : void 0,
            onClick: () => r($),
            children: [
              /* @__PURE__ */ t("span", { children: _.directory }),
              /* @__PURE__ */ t("small", { children: s.index.canonical.length })
            ]
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            className: "writing-add-unit",
            "aria-label": `添加${_.append}`,
            title: `添加${_.append}`,
            disabled: i || c || !jt(e),
            onClick: () => l($),
            children: /* @__PURE__ */ t(Ue, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ a("div", { className: "writing-chapter-tools", children: [
        /* @__PURE__ */ t(
          "input",
          {
            "aria-label": "搜索章节标题",
            placeholder: "搜索章节标题",
            value: s.query,
            disabled: i,
            onChange: (v) => s.search(v.target.value)
          }
        ),
        /* @__PURE__ */ a(
          "form",
          {
            onSubmit: (v) => {
              v.preventDefault();
              const A = s.byNumber(h);
              if (!A) {
                d("请输入有效章号");
                return;
              }
              d(""), n?.kind === "unit" && n.id === A.unit.id && s.locate(A.unit.id), r({
                kind: "unit",
                id: A.unit.id,
                tab: "body"
              });
            },
            children: [
              /* @__PURE__ */ t(
                "input",
                {
                  "aria-label": "跳转章号",
                  inputMode: "numeric",
                  placeholder: "章号",
                  value: h,
                  disabled: i,
                  onChange: (v) => {
                    f(v.target.value), d("");
                  }
                }
              ),
              /* @__PURE__ */ t("button", { type: "submit", disabled: i || !h.trim(), children: "跳转" })
            ]
          }
        ),
        m && /* @__PURE__ */ t("small", { role: "alert", children: m }),
        s.query && /* @__PURE__ */ a("small", { children: [
          s.rows.length,
          " 个匹配章节"
        ] })
      ] }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: o,
          className: "writing-chapter-viewport",
          "aria-label": "章节目录列表",
          role: "list",
          tabIndex: 0,
          onScroll: (v) => b(v.currentTarget.scrollTop),
          onKeyDown: (v) => {
            if (v.altKey || v.ctrlKey || v.metaKey || !s.rows.length)
              return;
            const A = v.target instanceof Element ? Number(
              v.target.closest("[data-chapter-index]")?.dataset.chapterIndex ?? -1
            ) : -1, R = A < 0 ? Math.floor(u / Ce) : A, x = Math.max(
              1,
              Math.floor(y / Ce)
            ), T = {
              ArrowUp: R - 1,
              ArrowDown: R + 1,
              Home: 0,
              End: s.rows.length - 1,
              PageUp: R - x,
              PageDown: R + x
            };
            if (!(v.key in T)) return;
            v.preventDefault();
            const W = Math.max(
              0,
              Math.min(s.rows.length - 1, T[v.key])
            );
            v.currentTarget.scrollTop = W * Ce, b(v.currentTarget.scrollTop), requestAnimationFrame(() => {
              o.current?.querySelector(
                `[data-chapter-index="${W}"] > button:first-child`
              )?.focus();
            });
          },
          children: [
            /* @__PURE__ */ t(
              "div",
              {
                className: "writing-chapter-window",
                style: { height: E.height },
                children: s.rows.slice(E.start, E.end).map((v, A) => {
                  const { unit: R } = v, x = {
                    kind: "unit",
                    id: R.id,
                    tab: "body"
                  }, T = ve(e, x);
                  return /* @__PURE__ */ a(
                    "div",
                    {
                      className: "writing-nav-entry",
                      role: "listitem",
                      "aria-posinset": E.start + A + 1,
                      "aria-setsize": s.rows.length,
                      "data-chapter-index": E.start + A,
                      style: {
                        position: "absolute",
                        top: (E.start + A) * Ce,
                        height: Ce
                      },
                      ...p.itemProps(R.id),
                      children: [
                        /* @__PURE__ */ a(
                          "button",
                          {
                            disabled: i || !!T,
                            title: T || void 0,
                            "aria-label": `${v.label}：${R.title}`,
                            "aria-current": n?.kind === "unit" && n.id === R.id ? "page" : void 0,
                            onClick: () => r(x),
                            children: [
                              /* @__PURE__ */ a("span", { children: [
                                /* @__PURE__ */ t("small", { children: v.label }),
                                /* @__PURE__ */ t("strong", { title: R.title, children: R.title })
                              ] }),
                              /* @__PURE__ */ t(
                                "small",
                                {
                                  className: R.has_body ? "is-written" : void 0,
                                  children: dt(R)
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ t(
                          wt,
                          {
                            order: p,
                            id: R.id,
                            title: R.title
                          }
                        )
                      ]
                    },
                    R.id || v.ordinal
                  );
                })
              }
            ),
            !s.rows.length && /* @__PURE__ */ t("p", { className: "writing-chapter-empty", children: s.query ? "没有匹配的章节" : "暂无章节" })
          ]
        }
      )
    ] })
  ] });
}
const Wn = {
  pending: "等待中",
  running: "运行中",
  waiting: "等待处理",
  success: "已完成",
  fail: "失败",
  canceled: "已停止"
};
function Bn({
  projectId: e,
  canvasId: n,
  workAssetId: i,
  activeRunId: c,
  busy: r,
  readonly: l,
  commandError: p,
  onStop: s,
  onClose: o
}) {
  const [u, b] = S([]), [y, g] = S(!1), [h, f] = S(!1), [m, d] = S(""), [k, w] = S(!1), [E, _] = S(!1), $ = V(!1), v = V(0), A = V(!1), R = V(!0), x = ne(
    async (I = !1) => {
      if (!A.current) {
        A.current = !0, f(!0);
        try {
          const K = I ? v.current : 0, Y = await sn({
            projectId: e,
            canvasId: n,
            workAssetId: i,
            beforeId: K
          });
          if (!R.current) return;
          b(
            (Q) => I ? [
              ...Q,
              ...Y.items.filter(
                (j) => !Q.some((q) => q.id === j.id)
              )
            ] : Y.items
          ), v.current = Y.beforeId, g(
            Y.hasMore && Y.beforeId > 0 && Y.beforeId !== K
          ), d("");
        } catch (K) {
          R.current && d(K instanceof Error ? K.message : "读取运行记录失败");
        } finally {
          A.current = !1, R.current && f(!1);
        }
      }
    },
    [n, e, i]
  );
  me(() => (R.current = !0, x(), () => {
    R.current = !1;
  }), [x, c]);
  const T = async () => {
    if (!(r || l || $.current)) {
      $.current = !0, w(!0), _(!0);
      try {
        await s(), await x();
      } catch (I) {
        d(I instanceof Error ? I.message : "停止运行失败");
      } finally {
        $.current = !1, w(!1);
      }
    }
  }, W = m || (E && !k ? p : "");
  return /* @__PURE__ */ t(
    Ee,
    {
      title: "运行记录",
      className: "writing-runs-dialog",
      closeDisabled: k,
      onClose: o,
      children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ t("div", { className: "writing-actions", children: /* @__PURE__ */ t("button", { disabled: h || k, onClick: () => {
          x();
        }, children: "刷新" }) }),
        W && /* @__PURE__ */ t("p", { role: "alert", className: "writing-error", children: W }),
        u.map((I) => /* @__PURE__ */ a("article", { className: "writing-run-entry", children: [
          /* @__PURE__ */ a("div", { className: "writing-row", children: [
            /* @__PURE__ */ t("strong", { children: an(I.action) }),
            /* @__PURE__ */ t("span", { className: "writing-run-status", children: Wn[un(I.status)] })
          ] }),
          /* @__PURE__ */ t("p", { className: "writing-run-time", children: lt(I.created_at || I.updated_at) }),
          I.checkpoint && I.checkpoint.target > 0 && /* @__PURE__ */ a("p", { className: "writing-run-progress", children: [
            "已完成 ",
            I.checkpoint.completed,
            "/",
            I.checkpoint.target
          ] }),
          I.instruction && /* @__PURE__ */ t("p", { className: "writing-run-instruction", children: I.instruction }),
          I.error && /* @__PURE__ */ t("p", { className: "writing-error", children: I.error }),
          I.id === c && fn(I.status) && /* @__PURE__ */ t(
            "button",
            {
              disabled: r || l || k,
              onClick: () => {
                T();
              },
              children: k ? "正在停止…" : "停止本次运行"
            }
          )
        ] }, I.id)),
        !u.length && !h && /* @__PURE__ */ t("p", { children: "暂无运行记录" }),
        h && /* @__PURE__ */ t("p", { role: "status", children: "正在读取记录…" }),
        y && /* @__PURE__ */ t(
          "button",
          {
            disabled: h || k,
            onClick: () => {
              x(!0);
            },
            children: "加载更多"
          }
        )
      ] })
    }
  );
}
function In(e, n) {
  const i = xe(() => _e(e), [e]), [c, r] = S(""), [l, p] = S(0), [s, o] = S({
    id: "",
    revision: 0
  }), u = xe(
    () => Gt(i, c),
    [i, c]
  ), b = ne(
    (k) => {
      const w = i.byId.get(k);
      return w ? (r(""), p(
        Math.floor(
          (i.canonical.length - w.ordinal) / ye
        )
      ), o((E) => ({ id: k, revision: E.revision + 1 })), !0) : !1;
    },
    [i]
  ), y = n?.kind === "unit" ? n.id : "", g = i.byId.get(y)?.ordinal || 0, h = `${y}:${g}`, [f, m] = S(""), d = ne((k) => {
    r(k), p(0);
  }, []);
  return h !== f && (m(h), y && b(y)), {
    index: i,
    rows: u,
    query: c,
    search: d,
    locate: b,
    focus: s,
    page: ut(u, l),
    setPage: p,
    byNumber: (k) => {
      if (/^\d+$/.test(k.trim()))
        return i.canonical[Number(k) - 1];
    }
  };
}
function Mn(e) {
  return [...e].reverse();
}
function Ln(e, n, i, c) {
  const r = Qt(
    e,
    n,
    i,
    c === "before" ? "after" : "before",
    (l) => l.id
  );
  return r.every((l, p) => l === e[p]) ? e : r;
}
function zn({
  disabled: e,
  reason: n,
  getDocument: i,
  flush: c,
  onSave: r
}) {
  const [l, p] = S(!1), [s, o] = S(null), u = V(""), b = V(!1), y = () => {
    u.current = "", o(null);
  }, g = async (f, m, d) => {
    if (e || b.current || f === m) return !1;
    b.current = !0, p(!0), y();
    try {
      if (!await c()) return !1;
      const k = i();
      if (!k) return !1;
      const w = Ln(
        k.units,
        f,
        m,
        d
      );
      return w === k.units ? !1 : await r({ ...k, units: w });
    } finally {
      b.current = !1, p(!1);
    }
  }, h = e || l;
  return {
    pending: l,
    itemProps: (f) => ({
      "data-drop": s?.id === f ? s.placement : void 0,
      onDragOver: (m) => {
        if (h || !u.current || u.current === f) return;
        m.preventDefault(), m.dataTransfer.dropEffect = "move";
        const d = m.currentTarget.getBoundingClientRect();
        o({
          id: f,
          placement: m.clientY < d.top + d.height / 2 ? "before" : "after"
        });
      },
      onDragLeave: (m) => {
        m.currentTarget.contains(m.relatedTarget) || o(null);
      },
      onDrop: (m) => {
        if (h || !u.current) return;
        m.preventDefault();
        const d = m.currentTarget.getBoundingClientRect();
        return g(
          u.current,
          f,
          m.clientY < d.top + d.height / 2 ? "before" : "after"
        );
      }
    }),
    handleProps: (f) => ({
      disabled: h || !f,
      draggable: !h && !!f,
      title: h ? n || "正在保存章节顺序" : "拖动排序，或按 Alt + ↑ / ↓ 调整位置",
      onDragStart: (m) => {
        if (h || !f) {
          m.preventDefault();
          return;
        }
        u.current = f, m.dataTransfer.effectAllowed = "move", m.dataTransfer.setData("text/plain", f);
      },
      onDragEnd: y,
      onKeyDown: (m) => {
        if (!m.altKey || !["ArrowUp", "ArrowDown"].includes(m.key) || (m.preventDefault(), h)) return;
        const d = Mn(i()?.units || []), k = d.findIndex((E) => E.id === f), w = d[k + (m.key === "ArrowUp" ? -1 : 1)];
        if (w)
          return g(
            f,
            w.id,
            m.key === "ArrowUp" ? "before" : "after"
          );
      }
    })
  };
}
function Dn(e, n, i, c) {
  const r = i.active_field.replace(/\[(\d+)\]/g, ".$1");
  if (r.startsWith("preferences.")) return n.kind === "section" ? "preferences" : null;
  if (!r || r === "replacement" || n.kind === "entity")
    return null;
  if (n.kind === "unit") {
    const u = n.tab === "plan";
    if (i.unit_id === n.id && r === (u ? "plan" : "body") && (!u || i.section_id === "chapter_plan"))
      return `unit:${n.id}:${u ? "plan" : "body"}`;
  }
  const l = /^units\.(\d+)\.(title|plan)$/.exec(r);
  if (l) {
    const u = Number(l[1]), b = c?.action === "generate_chapters" && c.unit_ids.length ? _e(e.units).byId.get(
      c.unit_ids[u]
    )?.ordinal : u + (c?.action === "append" ? e.units.length : 0) + 1;
    return b === void 0 ? null : n.kind === "section" ? `chapter:${b - 1}` : n.kind === "unit" && n.tab === "plan" && e.units[b - 1]?.id === n.id ? `unit:${n.id}:plan` : null;
  }
  if (n.kind !== "section" || n.id === "chapters") return null;
  const p = r.startsWith("outline.") ? r.slice(8) : r === "content" ? i.section_id : void 0;
  if (p && be(p)) return `outline:${p}`;
  const s = /^outline\.(characters|locations|props)\.(\d+)\./.exec(r);
  if (s) return `outline:${s[1]}:${s[2]}`;
  const o = /^entities\.(\d+)\./.exec(r);
  return o && i.section_id ? `outline:${i.section_id}:${o[1]}` : null;
}
function st({
  scope: e,
  target: n,
  revision: i,
  enabled: c = n !== null
}) {
  const r = V(null), l = V(null), p = V({ scope: "", following: !0 }), [s, o] = S({ scope: "", following: !0 }), u = ne((f) => {
    p.current.following !== f && (p.current = { ...p.current, following: f }, o(p.current));
  }, []), b = ne(() => u(!1), [u]), y = V(n), g = V(null), h = c;
  return Xe(() => {
    y.current = n, g.current?.();
  }, [n, i]), Xe(() => {
    if (p.current.scope !== e && (p.current = { scope: e, following: !0 }, o(p.current)), !h) return;
    const f = r.current, m = l.current;
    if (!f || !m) return;
    let d = null, k = "", w = null, E = 0, _ = null;
    const $ = () => {
      let P = f;
      for (; P && !/auto|scroll/.test(getComputedStyle(P).overflowY); )
        P = P.parentElement;
      return P;
    }, v = () => {
      const P = y.current;
      return P === null ? null : m.querySelector(
        `[data-writing-stream-target="${CSS.escape(P)}"]`
      );
    }, A = () => {
      const P = v();
      return !P || !d ? null : Math.max(
        0,
        Math.min(
          d.scrollHeight - d.clientHeight,
          d.scrollTop + P.getBoundingClientRect().bottom - d.getBoundingClientRect().top - d.clientTop - d.clientHeight + 20
        )
      );
    }, R = () => {
      w === null && (w = requestAnimationFrame(() => {
        if (w = null, q(), !d || !p.current.following) return;
        const P = A();
        P !== null && (d.scrollTop = P, E = d.scrollTop);
      }));
    }, x = () => {
      u(!1);
    }, T = () => {
      if (!d) return;
      const P = A();
      (P !== null && Math.abs(d.scrollTop - P) <= 2 || d.scrollHeight - d.clientHeight - d.scrollTop <= 2) && (u(!0), R());
    }, W = () => {
      if (d !== $()) {
        q();
        return;
      }
      if (!d) return;
      const P = d.scrollTop;
      P < E ? x() : P > E && T(), E = P;
    }, I = (P) => {
      P.deltaY < 0 ? x() : P.deltaY > 0 && T();
    }, K = (P) => {
      _ = P.touches[0]?.clientY ?? null;
    }, Y = (P) => {
      const Z = P.touches[0]?.clientY;
      Z !== void 0 && _ !== null && Z > _ ? x() : Z !== void 0 && _ !== null && Z < _ && T(), _ = Z ?? null;
    }, Q = (P) => {
      ["ArrowUp", "PageUp", "Home"].includes(P.key) || P.key === " " && P.shiftKey ? x() : ["ArrowDown", "PageDown", "End", " "].includes(P.key) && T();
    }, j = () => {
      d && (d.removeEventListener("scroll", W), d.removeEventListener("wheel", I), d.removeEventListener("touchstart", K), d.removeEventListener("touchmove", Y), d.removeEventListener("keydown", Q), d.style.overflowAnchor = k, d !== f && U.unobserve(d));
    }, q = () => {
      const P = $();
      P !== d && (j(), d = P, d && (E = d.scrollTop, k = d.style.overflowAnchor, d.style.overflowAnchor = "none", d.addEventListener("scroll", W, { passive: !0 }), d.addEventListener("wheel", I, { passive: !0 }), d.addEventListener("touchstart", K, { passive: !0 }), d.addEventListener("touchmove", Y, { passive: !0 }), d.addEventListener("keydown", Q), U.observe(d)));
    }, U = new ResizeObserver(R);
    return U.observe(m), U.observe(f), q(), g.current = () => {
      const P = d;
      q(), d && d === P && !p.current.following && (d.scrollTop = E), d && (E = d.scrollTop), R();
    }, R(), () => {
      g.current = null, j(), U.disconnect(), w !== null && cancelAnimationFrame(w);
    };
  }, [e, h, u]), { viewportRef: r, contentRef: l, following: s.scope !== e || s.following, pauseFollowing: b };
}
const Vn = [];
function Xn(e) {
  const n = yn(e), {
    snapshot: i,
    viewSnapshot: c,
    document: r,
    historical: l,
    generationTiming: p,
    selection: s,
    draft: o,
    loading: u,
    busy: b,
    error: y,
    conflicted: g,
    reload: h,
    action: f,
    stop: m,
    openSelection: d,
    addEntry: k
  } = n, w = _n(n), E = kn(
    e.projectId,
    i?.work_asset_id || 0,
    i?.work_version_id || 0
  ), [_, $] = S(null), [v, A] = S(!1), [R, x] = S(null), [T, W] = S(null), [I, K] = S(!1), [Y, Q] = S(!1), j = V(!1), q = V(!1), [U, P] = S(!1), [Z, fe] = S(""), we = He, B = i?.document.status === "running" || !!e.running, J = o.status === "saving", ue = !!(e.readonly || l || B || b || u), te = !!(v || R || T || I), ce = s?.kind === "unit" && s.tab === "plan", oe = s?.kind === "entity" || ce || !!_, de = te || Y || oe, O = ue || te, ee = c?.document, L = O || g || de ? "当前状态不能调整章节顺序" : w.pending ? "请先应用或丢弃修改建议" : o.hasPendingChanges || J ? "请先保存当前修改" : "", F = zn({
    disabled: !!L,
    reason: L,
    getDocument: () => n.getSnapshot()?.document,
    flush: o.flush,
    onSave: (C) => f("save_document", { document: C })
  }), re = de || b || u || J || w.pending || F.pending, ke = s?.kind === "unit" && !ce || s?.kind === "section" && s.id === "chapters", Be = s?.kind === "unit" && r ? _e(r.units).byId.get(s.id)?.unit : void 0, N = s?.kind === "entity", M = r && T ? r.units.find((C) => C.id === T) : void 0, { flush: z } = o, { onClose: H } = e, D = ne(async () => {
    if (!(de || b || u || F.pending || j.current)) {
      j.current = !0;
      try {
        await z() && H();
      } finally {
        j.current = !1;
      }
    }
  }, [de, b, u, F.pending, z, H]);
  me(() => {
    if (!o.hasPendingChanges && !R) return;
    const C = (X) => {
      X.preventDefault(), X.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [R, o.hasPendingChanges]);
  const se = async (C) => {
    re || !ee || ve(ee, C) || await d(C) && w.discard();
  }, G = async (C) => {
    re || await n.selectVersion(C) && w.discard();
  }, ie = async (C) => {
    !O && !re && await o.flush() && (w.discard(), x(C));
  }, ae = async () => {
    if (!(!T || ue || g || w.pending || q.current)) {
      q.current = !0, P(!0), fe("");
      try {
        if (!await o.flush()) return;
        const C = n.getSnapshot()?.document;
        if (!C || !C.units.some((X) => X.id === T))
          return;
        await f("save_document", {
          document: {
            ...C,
            units: C.units.filter((X) => X.id !== T)
          }
        }) ? (W(null), w.discard(), await d({ kind: "section", id: "chapters" })) : fe("删除未成功，章节和原内容已保留，请重试。");
      } finally {
        q.current = !1, P(!1);
      }
    }
  }, pe = async () => {
    b || u || w.pending || !await o.flush() || await d({ kind: "section", id: "overview" }) && ($(null), w.discard());
  }, vt = async () => {
    if (!r || s?.kind !== "entity" || O || w.pending || !await o.flush()) return;
    const C = n.getSnapshot()?.document;
    if (!C) return;
    const X = {
      ...C.outline,
      [s.section]: C.outline[s.section].filter(
        (Nt) => Nt.id !== s.id
      )
    };
    await f("save_document", { document: { ...C, outline: X } }) && (w.discard(), await d({ kind: "section", id: s.section }, !1));
  }, _t = async (C) => {
    if (ue || g || w.pending || !await o.flush())
      return !1;
    const X = n.getSnapshot()?.document;
    return X ? JSON.stringify(X.preferences) === JSON.stringify(C) ? !0 : f("save_document", { document: { ...X, preferences: C } }) : !1;
  }, Se = n.preview && n.preview.run_id === i?.run_id && n.preview.request_id === i?.request_id && B ? n.preview : null, le = !l && !u && !te && Se?.work_asset_id === i?.work_asset_id ? Se : null, Re = xe(() => !r || !B || w.pending || !le ? r : Object.keys(le.fields).some(
    (X) => /^(preferences|inspirations|units|outline|entities)[.[]/.test(
      X
    ) || X === "plan" && le.section_id === "chapter_plan" || X === "content" && !!(le.section_id && be(le.section_id))
  ) ? on(
    r,
    le,
    i?.checkpoint?.action,
    i?.checkpoint?.unit_ids
  ) : r, [
    r,
    B,
    w.pending,
    le,
    i?.checkpoint?.action,
    i?.checkpoint?.unit_ids
  ]), Ie = In(
    Re?.units || Vn,
    s
  ), Je = async (C, X = {}) => await w.run(C, X) ? ((C === "generate_chapters" || C === "append") && await d({ kind: "section", id: "overview" }, !1), !0) : !1, Me = Se?.fields.body !== void 0 && Be?.id === Se.unit_id && !o.draft.unit?.body ? Se.fields.body : "", Ke = `${i?.work_asset_id}:${i?.run_id}:${i?.request_id}`, Ye = le && ee && s && !oe && !w.pending && !(s.kind === "unit" && s.tab !== "plan" && !Me) ? Dn(
    ee,
    s,
    le,
    i?.checkpoint
  ) : null, Ne = st({
    scope: Ke,
    target: Ye,
    revision: le?.fields,
    enabled: B && !l && !u && !de && !w.pending
  }), Pe = st({
    scope: Ke,
    target: le && w.pending && le.fields.replacement !== void 0 && w.preview === le.fields.replacement ? "proposal" : null,
    revision: w.preview
  }), je = /* @__PURE__ */ t(
    An,
    {
      inline: !0,
      snapshot: i,
      preview: le,
      generationTiming: p,
      running: B,
      busy: b || J || u || F.pending,
      readonly: !!(e.readonly || l),
      error: y || w.error || (r ? "" : e.node.runError) || "",
      conflicted: g,
      reloadDisabled: !!(de || b || u || J || o.hasPendingChanges),
      onReload: h,
      onRetry: async () => {
        const C = gt(n.getSnapshot());
        if (C)
          if (C.action === "propose_edit") {
            const X = cn(C.extra);
            await d(X) && await w.retry(C.extra, X);
          } else await Je(C.action, C.extra);
      },
      onStop: m
    }
  ), Ge = s && r && ee && /* @__PURE__ */ t(
    En,
    {
      document: r,
      savedDocument: ee,
      directory: Ie,
      activeBatchIds: i?.checkpoint?.action === "generate_units" ? i.checkpoint.unit_ids : void 0,
      onConfirmationChange: Q,
      selection: s,
      disabled: O || g || F.pending,
      body: o.draft.unit?.body,
      selectedCharacters: w.textSelection?.text.length || 0,
      onClearSelection: w.clearSelection,
      onAction: Je,
      proposalPending: w.pending,
      proposalReady: w.ready,
      proposalPreview: w.preview,
      running: B,
      onApply: () => {
        w.apply();
      },
      onDiscard: w.discard
    },
    `${s.kind}:${s.id}:${s.kind === "unit" ? s.tab || "body" : ""}`
  ), Qe = s && Re && ee && /* @__PURE__ */ t(
    Sn,
    {
      document: Re,
      recoverableDraft: !l && !B && s.kind === "unit" && i?.checkpoint?.draft?.unit_id === s.id ? i.checkpoint.draft.body : void 0,
      savedDocument: ee,
      selection: s,
      value: Me && o.draft.unit ? {
        ...o.draft,
        unit: { ...o.draft.unit, body: Me }
      } : o.draft,
      readonly: O || F.pending,
      onChange: o.setDraft,
      onSelect: (C) => {
        se(C);
      },
      chapterOrder: F,
      directory: Ie,
      navigationDisabled: re,
      onDeleteChapter: (C) => {
        !L && !F.pending && (fe(""), W(C));
      },
      onTextSelectionChange: w.onTextSelectionChange,
      selectionActionsRef: w.selectionActionsRef
    },
    `${s.kind}:${s.id}:${s.kind === "unit" ? s.tab || "body" : ""}:${l ? c?.work_version_id : "current"}`
  ), kt = /* @__PURE__ */ a(he, { children: [
    /* @__PURE__ */ a(
      "section",
      {
        className: "writing-editor nodrag nopan nowheel is-detail",
        "aria-label": `${we.title}编辑器`,
        children: [
          l && /* @__PURE__ */ a("div", { className: "writing-history-bar", children: [
            /* @__PURE__ */ t("span", { children: "正在查看历史版本，内容只读。" }),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: b || u,
                onClick: () => {
                  G(i.work_version_id);
                },
                children: "返回当前版本"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: e.readonly || B || b || u,
                onClick: async () => {
                  await f("restore_document", {
                    source_work_version_id: c.work_version_id
                  }) && w.discard();
                },
                children: "恢复此版本"
              }
            ),
            y && /* @__PURE__ */ t("span", { role: "alert", children: y })
          ] }),
          !r || !ee || !ln(ee) ? /* @__PURE__ */ t("div", { className: "writing-empty", children: "请先在画布选用一个灵感，再进入创作工作区。" }) : /* @__PURE__ */ t(he, { children: /* @__PURE__ */ a("div", { className: "writing-layout", children: [
            /* @__PURE__ */ t(
              Tn,
              {
                document: ee,
                selection: s,
                disabled: re,
                mutationDisabled: O || N || F.pending,
                onSelect: (C) => {
                  se(C);
                },
                onAdd: (C) => {
                  ie(C);
                },
                chapterOrder: F,
                directory: Ie
              }
            ),
            /* @__PURE__ */ t("div", { className: "writing-workspace-content", children: /* @__PURE__ */ a("div", { className: "writing-chapter-layout", children: [
              ke ? /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "writing-content-scroll",
                  ref: Ne.viewportRef,
                  children: /* @__PURE__ */ t(
                    "div",
                    {
                      className: "writing-page",
                      ref: Ne.contentRef,
                      children: u ? /* @__PURE__ */ a("p", { role: "status", className: "writing-loading", children: [
                        /* @__PURE__ */ t(ot, { size: 16, className: "ws-spin" }),
                        "正在读取内容…"
                      ] }) : Qe
                    }
                  )
                }
              ) }) : /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t("div", { className: "writing-content-scroll", ref: Ne.viewportRef, children: /* @__PURE__ */ t("div", { ref: Ne.contentRef, children: /* @__PURE__ */ t(
                Nn,
                {
                  document: Re,
                  readonly: O || g || F.pending || !!w.pending,
                  navigationDisabled: re,
                  onSelect: (C) => {
                    se(C);
                  },
                  onAdd: (C) => {
                    ie(C);
                  },
                  onPreferences: () => K(!0),
                  onEditSection: async (C) => {
                    await d({ kind: "section", id: C }) && (w.discard(), $(C));
                  },
                  chapterOrder: F,
                  activeUnitId: B ? i?.checkpoint?.unit_id : void 0,
                  streamTarget: Ye,
                  following: Ne.following,
                  onReadPage: Ne.pauseFollowing
                }
              ) }) }) }),
              !oe && /* @__PURE__ */ t(
                "aside",
                {
                  className: "writing-ai-rail",
                  "aria-label": "创作助手",
                  ref: Pe.viewportRef,
                  children: /* @__PURE__ */ t("div", { ref: Pe.contentRef, children: Ge })
                }
              )
            ] }) })
          ] }) })
        ]
      }
    ),
    I && r && /* @__PURE__ */ t(
      Cn,
      {
        preferences: r.preferences,
        disabled: ue || g || w.pending || F.pending,
        onSave: _t,
        onClose: () => K(!1)
      }
    ),
    oe && s && r && /* @__PURE__ */ t(
      Ee,
      {
        title: ce ? "修改本章剧情" : pt(r, s),
        titleStatus: l ? void 0 : je,
        className: "writing-outline-entity-dialog",
        closeDisabled: b || u || J || w.pending,
        onClose: pe,
        children: /* @__PURE__ */ a("div", { className: "writing-entity-dialog-layout", children: [
          /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
            Qe,
            /* @__PURE__ */ a("div", { className: "writing-actions writing-entity-dialog-actions", children: [
              N && /* @__PURE__ */ a("button", { className: "is-danger", disabled: O || w.pending, onClick: () => {
                vt();
              }, children: [
                /* @__PURE__ */ t(at, { size: 14 }),
                "删除"
              ] }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "is-primary",
                  disabled: b || u || J || w.pending,
                  onClick: () => {
                    pe();
                  },
                  children: "完成"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t(
            "aside",
            {
              className: "writing-ai-rail",
              "aria-label": "创作助手",
              ref: Pe.viewportRef,
              children: /* @__PURE__ */ t("div", { ref: Pe.contentRef, children: Ge })
            }
          )
        ] })
      }
    ),
    v && i && /* @__PURE__ */ t(
      Bn,
      {
        projectId: e.projectId,
        canvasId: e.canvasId,
        workAssetId: i.work_asset_id,
        activeRunId: i.run_id,
        busy: b,
        readonly: !!(e.readonly || l),
        commandError: y,
        onStop: m,
        onClose: () => A(!1)
      }
    ),
    R && r && /* @__PURE__ */ t(
      $n,
      {
        document: r,
        selection: R,
        disabled: ue,
        closeDisabled: b || J,
        error: y,
        onClose: () => x(null),
        onSave: async (C) => {
          await k(R, C) && x(null);
        }
      }
    ),
    M && /* @__PURE__ */ t(
      ht,
      {
        title: "删除章节",
        description: `删除「${M.title}」及当前正文？历史版本仍可查看。`,
        confirmLabel: "确认删除",
        pending: U,
        disabled: ue || g || w.pending,
        error: Z || y,
        onClose: () => {
          q.current || W(null);
        },
        onConfirm: ae
      }
    )
  ] });
  return /* @__PURE__ */ t(
    Bt,
    {
      ariaLabel: `${e.node.title || "节点"}详情`,
      onRequestClose: D,
      header: /* @__PURE__ */ t(
        pn,
        {
          editor: n,
          titleStatus: !l && !oe ? je : void 0,
          versions: E,
          node: e.node,
          navigationDisabled: re,
          mutationDisabled: O || N || F.pending,
          previewReadonly: !!(e.readonly || l),
          onClose: () => {
            D();
          },
          onRuns: () => A(!0),
          onSelectVersion: G
        }
      ),
      children: kt
    }
  );
}
export {
  Xn as WritingEditor
};
