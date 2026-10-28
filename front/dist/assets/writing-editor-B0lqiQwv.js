import { j as e, a, F as Ne } from "./react-5Z-wsVEn.js";
import { a as B, b as O, h as te, d as ke, u as Ie, l as Le } from "./file-kind-D6bMOzYN.js";
import { w as Ut, e as Ft, ah as Jt, P as je, aI as yt, G as Kt, q as Me, h as vt, A as Yt, t as De, R as Gt, r as jt, z as Xt, H as Qt, y as Zt, aB as en } from "./vendor-icons-fVDtJt66.js";
import { u as tn, t as _t, aw as ut, v as nn } from "./asset-preview-BZxHU4Mm.js";
import { N as rn } from "./node-detail-dialog-CO39yBfk.js";
import { f as Xe, d as gt, $ as Ce, a0 as an, a1 as Ae, a2 as He, a3 as sn, a4 as on, a5 as Oe, a6 as ln, a7 as kt, a8 as Je, a9 as Se, aa as Ee, ab as Ke, ac as Nt, e as cn, ad as Ct, ae as St, af as $t, ag as Et, ah as xt, ai as Rt, aj as dn, ak as un, al as gn, am as ht, an as hn, ao as fn, ap as pn, aq as Pe, ar as mn, as as wn, at as bn, v as yn, au as vn, av as _n } from "./space-ordered-list-CBeUyd80.js";
import { u as Pt } from "./text-content-save-actions-C7rwLAWt.js";
import { h as kn, s as Ue, E as ft, W as xe, X as _e, F as Nn, Y as Cn, Z as Sn, j as Ye, _ as $n, $ as En, a0 as Bt, a1 as xn, a2 as Rn, m as Pn, n as Bn, a3 as An } from "./writing-run-labels-BXHG45m8.js";
import { A as At } from "./asset-text-content-editor-DjQTC5qk.js";
import { WritingDialog as Re, WritingConfirmDialog as It } from "./writing-dialog-D-lRMpvq.js";
import { n as In, i as Tn } from "./interaction-3oJt9_4e.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-editor-DlEoj8as.css", import.meta.url).href]);
function Wn({
  editor: t,
  titleStatus: r,
  versions: n,
  node: c,
  mutationDisabled: i,
  navigationDisabled: o,
  previewReadonly: v,
  onClose: s,
  onRuns: d,
  onSelectVersion: g
}) {
  const { snapshot: _, viewSnapshot: k, document: f, draft: p, conflicted: b } = t, y = Xe, N = f ? f.units : [], l = p.status === "saving", u = n.versions.find(
    (E) => E.id === k?.work_version_id
  );
  return /* @__PURE__ */ e(
    rn,
    {
      node: f && c.titleMode === "auto" ? { ...c, title: f.title } : c,
      titleStatus: r,
      contentLabel: f ? N.length ? `${N.filter((E) => E.has_body).length}/${N.length} ${y.unit}正文` : gt(f) === "inspiration" ? "选择灵感" : gt(f) === "outline" ? "大纲" : "剧情规划" : y.title,
      updatedAt: _t(
        k?.work_updated_at || u?.updated_at || u?.created_at || c.asset?.version?.updated_at
      ),
      status: p.status,
      readonly: v,
      onRetry: () => {
        !i && !l && !b && p.retry();
      },
      onClose: s,
      versionSelect: _ && /* @__PURE__ */ e(
        tn,
        {
          options: n.versions.map((E) => ({
            id: E.id,
            version: E.version,
            updatedAt: String(
              (E.id === _.work_version_id ? _.work_updated_at : void 0) || E.updated_at || E.created_at || ""
            ),
            value: E
          })),
          currentVersionId: _.work_version_id,
          selectedVersionId: k?.work_version_id || _.work_version_id,
          total: n.total,
          hasMore: n.hasMore,
          loading: n.loading,
          loadingMore: n.loadingMore,
          error: n.error,
          disabled: o,
          onSelect: (E) => {
            g(E.id);
          },
          onLoadMore: n.onLoadMore,
          onRetry: n.onRetry
        }
      ),
      actions: f && /* @__PURE__ */ a(Ne, { children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "保存为新版本",
            disabled: i || l || b,
            onClick: () => {
              t.action("create_version");
            },
            children: [
              /* @__PURE__ */ e(Ut, { size: 14 }),
              /* @__PURE__ */ e("span", { children: "保存为新版本" })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": p.status === "error" ? "重试保存" : "保存",
            disabled: i || l || b || !p.hasPendingChanges,
            onClick: () => {
              p.status === "error" ? p.retry() : p.flush();
            },
            children: [
              /* @__PURE__ */ e(Ft, { size: 14 }),
              /* @__PURE__ */ e("span", { children: p.status === "error" ? "重试保存" : "保存" })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "运行记录",
            disabled: o,
            onClick: async () => {
              await p.flush() && d();
            },
            children: [
              /* @__PURE__ */ e(Jt, { size: 14 }),
              /* @__PURE__ */ e("span", { children: "运行记录" })
            ]
          }
        )
      ] })
    }
  );
}
const pt = /* @__PURE__ */ new WeakMap();
function Ge(t) {
  if (!t) return "null";
  let r = pt.get(t);
  return r === void 0 && (r = JSON.stringify(t), pt.set(t, r)), r;
}
function Mn(t) {
  return `${Ge(t.document)}
${JSON.stringify(t.unit)}`;
}
function Dn(t = 20) {
  const r = /* @__PURE__ */ new Map();
  return {
    get(n) {
      const c = r.get(n);
      return c && (r.delete(n), r.set(n, c)), c;
    },
    delete(n) {
      r.delete(n);
    },
    set(n, c) {
      r.delete(n), r.set(n, c), r.size > t && r.delete(r.keys().next().value);
    }
  };
}
function Ln(t, r, n) {
  const c = (o) => [
    o.outline.characters,
    o.outline.locations,
    o.outline.props,
    o.units
  ], i = c(r);
  c(t).forEach((o, v) => {
    o.forEach((s, d) => {
      s.id.startsWith("new:") && n.set(`${v}:${s.id}`, i[v][d].id);
    });
  });
}
function On(t, r) {
  if (!r.size) return t;
  const n = (c, i) => c.map((o) => ({
    ...o,
    id: r.get(`${i}:${o.id}`) || o.id
  }));
  return {
    ...t,
    outline: {
      ...t.outline,
      characters: n(t.outline.characters, 0),
      locations: n(t.outline.locations, 1),
      props: n(t.outline.props, 2)
    },
    units: n(t.units, 3)
  };
}
function mt(t, r) {
  const n = t.checkpoint;
  if (t.document.status !== "running" || t.work_asset_id !== r.workAssetId || t.run_id !== r.runId || t.request_id !== r.requestId || n?.action !== "generate_units" || n.unit_ids.length !== r.unitIds.length || !n.unit_ids.every((i, o) => i === r.unitIds[o]))
    return;
  if (n.phase !== "body") return "";
  const c = r.unitIds[n.completed];
  return c && (!n.unit_id || n.unit_id === c) ? c : "";
}
const zn = { document: null, unit: null };
function qn({
  projectId: t,
  canvasId: r,
  node: n,
  output: c,
  onAssetUpdated: i,
  readonly: o = !1,
  running: v = !1
}) {
  const {
    snapshot: s,
    snapshotRef: d,
    mounted: g,
    acceptSnapshot: _,
    loadWork: k,
    command: f,
    stopRun: p,
    reportError: b,
    setError: y,
    error: N,
    generationTiming: l,
    preview: u,
    clearPreview: E,
    clearGenerationError: x
  } = kn({ projectId: t, canvasId: r, node: n, output: c, onAssetUpdated: i }), [m, h] = B(null), R = O(m), A = m || s, [$, L] = B(null), q = O($), [T, F] = B(0), [K, j] = B(!1), [ne, ie] = B(!1), Y = O(!1), ce = O({ readonly: o, running: v });
  ce.current = { readonly: o, running: v };
  const re = O(0), X = O(null), ee = O(0), P = te(() => {
    X.current = null, ee.current += 1;
  }, []), ae = O(Dn()), fe = O({
    workAssetId: 0,
    ids: /* @__PURE__ */ new Map()
  }), we = O(null);
  ke(
    () => () => {
      re.current += 1, X.current = null, we.current = null;
    },
    []
  );
  const W = te(() => {
    if (ce.current.readonly || R.current)
      throw new Error("当前作品只读，未保存内容已保留");
    if (ce.current.running || d.current?.document.status === "running")
      throw new Error("生成期间暂不可修改作品，请先停止生成");
  }, []), se = te(
    async (w) => {
      const S = q.current;
      if (!S) throw new Error("请等待内容加载完成");
      let I = S.workVersion, z = S.workRevision, D = S.unitVersion;
      const Q = (U, V) => {
        _(U), I = U.work_version_id, z = U.work_revision, D = w.unit && U.document.units.find(
          (G) => G.id === w.unit.unit_id
        )?.version_id || 0, q.current = {
          ...S,
          selection: q.current?.selection || S.selection,
          workVersion: I,
          workRevision: z,
          unitVersion: D,
          value: V
        };
      };
      if (w.document && Ge(w.document) !== Ge(S.value.document)) {
        W();
        const U = d.current.work_asset_id;
        fe.current.workAssetId !== U && (fe.current = { workAssetId: U, ids: /* @__PURE__ */ new Map() });
        const V = fe.current, G = On(
          w.document,
          V.ids
        ), ye = await Ue(
          f(
            "save_document",
            { document: G, expected_work_revision: z },
            I
          )
        );
        Ln(
          G,
          ye.document,
          V.ids
        ), Q(ye, { ...S.value, document: w.document });
      }
      if (w.unit && w.unit.body !== S.value.unit?.body) {
        W();
        const U = await Ue(
          f(
            "save_unit",
            {
              unit_id: w.unit.unit_id,
              expected_unit_version_id: D,
              expected_work_revision: z,
              body: w.unit.body
            },
            I
          )
        );
        Q(U, w);
        const V = U.document.units.find(
          (G) => G.id === w.unit.unit_id
        );
        V?.version_id && ae.current.delete(V.version_id);
      }
      y("");
    },
    [_, W, f, d]
  ), J = Pt({
    value: $?.value || zn,
    resetKey: `${n.id}:${T}`,
    fingerprint: Mn,
    save: se,
    onError: b,
    autoSave: !!($ && !m && !o && !v && s?.document.status !== "running" && !ne && !K),
    debounceMs: 1200
  }), Z = O(J);
  Z.current = J;
  const de = te(
    async (w, S) => {
      let I = null, z = 0;
      if (S.kind === "unit") {
        const D = Ce(w.document.units).byId.get(
          S.id
        )?.unit;
        if (!D) throw new Error("该章节已移出目录，请重新选择");
        if (z = D.version_id, D.asset_id && D.version_id) {
          if (I = ae.current.get(D.version_id) || null, !I) {
            const Q = await ft({
              projectId: t,
              assetId: D.asset_id,
              versionId: D.version_id,
              reportError: !1
            });
            if (I = an(Q.content), !I || I.unit_id !== D.id || I.profile !== w.document.type)
              throw new Error("章节内容与目录不一致");
            ae.current.set(D.version_id, I);
          }
        } else
          I = {
            type: "writing_unit",
            schema_version: 1,
            profile: w.document.type,
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
        selection: S,
        workVersion: w.work_version_id,
        workRevision: w.work_revision,
        unitVersion: z,
        value: { document: w.document, unit: I }
      };
    },
    [t]
  ), pe = te(
    (w) => {
      q.current = w, L(w), F((S) => S + 1), y("");
    },
    [y]
  ), ge = te(
    async (w, S = !0, I) => {
      if (S && P(), S && (Y.current || !await Z.current.flush()))
        return !1;
      const z = R.current || d.current;
      if (!z || xe(z.document, w))
        return !1;
      const D = ++re.current;
      j(!0);
      try {
        const Q = await de(z, w);
        return !g.current || D !== re.current || I && !I() ? !1 : (pe(Q), !0);
      } catch (Q) {
        return g.current && D === re.current && (!I || I()) && b(Q), !1;
      } finally {
        g.current && D === re.current && j(!1);
      }
    },
    [
      P,
      pe,
      g,
      de,
      b,
      d
    ]
  );
  ke(() => {
    const w = X.current, S = s && w ? mt(s, w) : void 0;
    if (w && S === void 0 && (X.current = null), m || !s || K || J.hasPendingChanges || Y.current)
      return;
    const I = S ? { kind: "unit", id: S, tab: "body" } : $?.selection || Ae(s.document), z = JSON.stringify(I);
    if ($ && $.workVersion === s.work_version_id && $.workRevision === s.work_revision && JSON.stringify($.selection) === z || we.current?.version === s.work_version_id && we.current.revision === s.work_revision && we.current.selection === z)
      return;
    we.current = {
      version: s.work_version_id,
      revision: s.work_revision,
      selection: z
    };
    const D = He(s.document, I) && !xe(s.document, I), Q = ee.current;
    ge(
      D ? I : Ae(s.document),
      !1,
      () => {
        const U = d.current;
        return ee.current === Q && !R.current && !Z.current.hasPendingChanges && !!(U && U.work_version_id === s.work_version_id && U.work_revision === s.work_revision && (!w || X.current === w && mt(U, w) === S));
      }
    );
  }, [
    $,
    m,
    J.hasPendingChanges,
    K,
    ge,
    s,
    d,
    ne
  ]);
  const H = te(
    async (w, S = {}, I, z) => {
      if (Y.current || ce.current.readonly) return !1;
      Y.current = !0, ie(!0);
      try {
        if (!await Z.current.flush()) return !1;
        if (w === "restore_document") {
          if (ce.current.readonly || ce.current.running || d.current?.document.status === "running")
            throw new Error("当前不可恢复版本");
        } else W();
        const D = _e(
          d.current.document,
          w,
          S
        );
        if (D) throw new Error(D);
        if (w === "propose_edit" && I && (!q.current || !I(q.current)))
          return !1;
        E(), x();
        const Q = ee.current, U = S.unit_id ? d.current.document.units.find(
          (G) => G.id === S.unit_id
        ) : void 0, V = await Ue(
          f(w, {
            ...U && S.section_id !== "chapter_plan" ? { expected_unit_version_id: U.version_id } : {},
            ...S
          })
        );
        return _(V), w === "generate_units" && Q === ee.current && V.document.status === "running" && V.checkpoint?.action === "generate_units" && V.run_id && V.request_id && V.checkpoint.unit_ids.length && (X.current = {
          workAssetId: V.work_asset_id,
          runId: V.run_id,
          requestId: V.request_id,
          unitIds: [...V.checkpoint.unit_ids]
        }), w === "restore_document" && (R.current = null, h(null)), y(""), !0;
      } catch (D) {
        return b(D), z?.(D), !1;
      } finally {
        Y.current = !1, g.current && ie(!1);
      }
    },
    [
      _,
      W,
      x,
      E,
      f,
      b
    ]
  ), ue = te(async () => {
    P();
    const w = d.current;
    if (!(!w?.run_id || w.document.status !== "running" || Y.current || ce.current.readonly)) {
      Y.current = !0, ie(!0);
      try {
        await p(), y("");
      } catch (S) {
        b(S);
      } finally {
        Y.current = !1, g.current && ie(!1);
      }
    }
  }, [P, p, b]), $e = te(async () => {
    if (!(Y.current || Z.current.status === "saving")) {
      Y.current = !0, ie(!0);
      try {
        await k();
        const w = q.current?.selection, S = w && d.current && He(d.current.document, w);
        await ge(
          S && w ? w : Ae(d.current.document),
          !1
        );
      } catch (w) {
        b(w);
      } finally {
        Y.current = !1, g.current && ie(!1);
      }
    }
  }, [k, ge, b]), he = te(
    async (w) => {
      if (P(), Y.current) return !1;
      Y.current = !0, ie(!0);
      let S = 0;
      try {
        if (!await Z.current.flush()) return !1;
        const I = d.current;
        if (!I || !g.current) return !1;
        S = ++re.current, j(!0);
        let z = null;
        if (w !== I.work_version_id) {
          const G = await ft({
            projectId: t,
            assetId: I.work_asset_id,
            versionId: w,
            reportError: !1
          });
          if (!g.current || S !== re.current)
            return !1;
          const ye = sn(G.content);
          if (!ye || ye.type !== I.document.type)
            throw new Error("历史版本与当前作品不一致");
          z = {
            ...I,
            document: ye,
            work_version_id: G.id,
            work_revision: on(G),
            work_version: G.version,
            work_updated_at: G.updated_at || G.created_at,
            proposal: void 0
          };
        }
        const D = z || I, Q = q.current?.selection || Ae(D.document), U = He(D.document, Q) && !xe(D.document, Q), V = await de(
          D,
          U ? Q : Ae(D.document)
        );
        return !g.current || S !== re.current ? !1 : (R.current = z, h(z), pe(V), !0);
      } catch (I) {
        return g.current && (!S || S === re.current) && b(I), !1;
      } finally {
        Y.current = !1, g.current && (S && S === re.current && j(!1), ie(!1));
      }
    },
    [
      pe,
      P,
      g,
      t,
      de,
      b,
      d
    ]
  ), oe = te(
    async (w, S) => {
      if (Y.current) return !1;
      const I = Z.current.draft.document;
      if (!I) return !1;
      const z = Oe(w), D = ln(I, w, S);
      let Q;
      if (!await H(
        "save_document",
        { document: D },
        void 0,
        (V) => {
          Q = V;
        }
      )) {
        if (Q) throw Q;
        return !1;
      }
      const U = d.current.document;
      if (z) {
        const V = U.outline[z], G = V[V.length - 1];
        G && await ge(
          { kind: "entity", section: z, id: G.id },
          !1
        );
      } else {
        const V = U.units, G = V?.[V.length - 1];
        G && await ge(
          { kind: "unit", id: G.id, tab: "body" },
          !1
        );
      }
      return !0;
    },
    [H, ge]
  ), be = !m && s?.document.status === "running" && !J.hasPendingChanges ? s.document : J.draft.document || A?.document;
  return {
    snapshot: s,
    viewSnapshot: A,
    document: be,
    historical: !!m,
    selectVersion: he,
    preview: u,
    getSnapshot: () => d.current,
    generationTiming: l,
    selection: $?.selection,
    draft: J,
    loading: K,
    busy: ne,
    error: N,
    conflicted: !!(J.hasPendingChanges && !ne && J.status !== "saving" && $ && s && (q.current?.workVersion !== s.work_version_id || q.current.workRevision !== s.work_revision)),
    action: H,
    stop: ue,
    openSelection: ge,
    cancelBodyFollow: P,
    addEntry: oe,
    reload: $e
  };
}
function Fe(t, r) {
  return !r || !t.document ? "" : kt(t.document, r, t.unit?.body);
}
function Vn(t, r, n) {
  const c = t.document;
  return r.kind === "unit" && r.tab === "plan" ? {
    ...t,
    document: {
      ...c,
      units: Je(c.units, r.id, {
        plan: n
      })
    }
  } : r.kind === "unit" && t.unit ? { ...t, unit: { ...t.unit, body: n } } : r.kind === "entity" ? {
    ...t,
    document: {
      ...c,
      outline: {
        ...c.outline,
        [r.section]: c.outline[r.section].map(
          (i) => i.id === r.id ? { ...i, description: n } : i
        )
      }
    }
  } : r.kind === "section" && Se(r.id) ? {
    ...t,
    document: {
      ...c,
      outline: { ...c.outline, [r.id]: n }
    }
  } : t;
}
function Hn(t) {
  const [r, n] = B(
    null
  ), c = O(null), [i, o] = B(null), v = O(null), [s, d] = B(""), g = O(!1), _ = O(!1), k = te(() => {
    c.current?.clearSelection(), n(null);
  }, []), f = te(() => {
    o(null), d(""), k();
  }, [k]), p = t.snapshot?.proposal, b = !!(i && p && p.run_id === i.runId && t.snapshot?.document.status === "ready"), y = i && t.preview?.run_id === i.runId && t.preview.fields.replacement !== void 0 ? t.preview.fields.replacement : "", N = async (x, m, h, R) => {
    let A;
    if (!await t.action(
      "propose_edit",
      { ...x, ...h ? { selected_text: h.text } : {} },
      (q) => {
        if (JSON.stringify(q.selection) !== JSON.stringify(m))
          return d("编辑目标已变化，请重新选择后生成修改建议。"), !1;
        const T = Fe(q.value, m);
        return h && T !== R ? (d("原文已变化，请重新选择后生成修改建议。"), !1) : (A = {
          selection: m,
          text: T,
          range: h,
          unitVersion: m.kind === "unit" && m.tab !== "plan" ? q.unitVersion : 0
        }, !0);
      }
    ) || !A) return !1;
    const L = { ...A, runId: t.getSnapshot().run_id };
    return v.current = L, o(L), d(""), !0;
  };
  return {
    textSelection: r,
    onTextSelectionChange: n,
    selectionActionsRef: c,
    clearSelection: k,
    discard: f,
    run: async (x, m = {}) => {
      if (g.current) return !1;
      g.current = !0, d("");
      try {
        if (x !== "propose_edit")
          return o(null), k(), t.action(x, m);
        const h = t.selection;
        return h ? await N(
          m,
          h,
          r,
          Fe(t.draft.draft, h)
        ) : !1;
      } finally {
        g.current = !1;
      }
    },
    retry: async (x, m) => {
      if (g.current) return !1;
      const h = v.current, R = h && h.runId === t.getSnapshot()?.run_id ? h.range : null;
      if ((x.selected_text || "") !== (R?.text || ""))
        return d("原选区无法恢复，请重新选择原文后生成修改建议。"), !1;
      g.current = !0;
      try {
        return await N(x, m, R, h?.text);
      } finally {
        g.current = !1;
      }
    },
    apply: async () => {
      if (_.current || !b || !i || !p || t.historical || t.busy || t.loading)
        return;
      const x = t.getSnapshot(), m = JSON.stringify(t.selection) === JSON.stringify(i.selection), h = p.unit_id === (i.selection.kind === "unit" ? i.selection.id : void 0) && p.section_id === (i.selection.kind === "unit" && i.selection.tab === "plan" ? "chapter_plan" : i.selection.kind === "entity" ? i.selection.section : i.selection.kind === "section" ? i.selection.id : void 0) && p.entity_id === (i.selection.kind === "entity" ? i.selection.id : void 0) && p.inspiration_id === void 0 && (p.selected_text || "") === (i.range?.text || "");
      if (!m || !h || x?.work_version_id !== p.work_version_id || x.work_revision !== p.work_revision || x.work_asset_id !== p.work_asset_id || Fe(t.draft.draft, t.selection) !== i.text || i.selection.kind === "unit" && i.selection.tab !== "plan" && p.unit_version_id !== i.unitVersion) {
        d("内容或版本已变化，请丢弃此建议后重新生成。");
        return;
      }
      _.current = !0;
      try {
        if (i.range) {
          if (!c.current?.replaceSelection(
            i.range,
            p.replacement
          )) {
            d("选区已变化，请重新选择后生成。");
            return;
          }
        } else
          t.draft.setDraft(
            Vn(
              t.draft.draft,
              i.selection,
              p.replacement
            )
          );
        o(null), k(), await t.draft.flush();
      } finally {
        _.current = !1;
      }
    },
    ready: b,
    pending: !!i,
    preview: b ? p.replacement : y,
    error: s
  };
}
function Un(t, r, n) {
  const [c, i] = B([]), [o, v] = B(0), [s, d] = B(0), [g, _] = B(!1), [k, f] = B(!1), [p, b] = B(!1), [y, N] = B(""), l = O(0), u = O(!1), E = te(
    async (x) => {
      if (!r) return;
      const m = ++l.current;
      u.current = !0, x === 1 ? f(!0) : b(!0), N("");
      try {
        const h = await Nn({
          projectId: t,
          assetId: r,
          page: x,
          reportError: !1
        });
        if (m !== l.current) return;
        i(
          (R) => x === 1 ? h.items : [
            ...R,
            ...h.items.filter(
              (A) => !R.some(($) => $.id === A.id)
            )
          ]
        ), v(x), d(h.total), _(h.hasMore);
      } catch (h) {
        m === l.current && N(h instanceof Error ? h.message : "读取版本失败");
      } finally {
        m === l.current && (u.current = !1, f(!1), b(!1));
      }
    },
    [t, r]
  );
  return ke(() => (E(1), () => {
    l.current += 1;
  }), [E, n]), {
    versions: c,
    total: s,
    hasMore: g,
    loading: k,
    loadingMore: p,
    error: y,
    onLoadMore: () => {
      !u.current && g && E(o + 1);
    },
    onRetry: () => {
      u.current || E(o || 1);
    }
  };
}
function Fn({
  draft: t,
  snapshot: r,
  disabled: n,
  open: c,
  onOpen: i,
  onClose: o,
  onSave: v
}) {
  const [s, d] = B(0), [g, _] = B(""), [k, f] = B(!1), p = O(!1), b = r.checkpoint, y = b.work_asset_id !== r.work_asset_id || b.work_version_id !== r.work_version_id || b.work_revision !== r.work_revision, N = async ($) => {
    await v($);
  }, l = Pt({
    value: t.units,
    resetKey: `${t.run_id}:${t.request_id}`,
    fingerprint: JSON.stringify,
    autoSave: !1,
    save: N,
    onError: ($) => _(
      $ instanceof Error ? $.message : "保存未成功，草稿已保留"
    )
  }), u = l.draft, E = Math.min(s, u.length - 1), x = u[E], m = ($) => l.setDraft(
    u.map(
      (L, q) => q === E ? { ...L, ...$ } : L
    )
  ), h = () => {
    const $ = b.unit_ids[u.length] || "", L = r.document.units.find((q) => q.id === $)?.title || "";
    l.setDraft([
      ...u,
      {
        id: $,
        unit_type: "chapter",
        title: L,
        plan: "",
        children: [],
        asset_id: 0,
        version_id: 0,
        has_body: !1,
        continuity_valid: !1,
        dependency_stale: !1
      }
    ]), d(u.length);
  }, R = u.length === t.expected_count && u.every(($) => $.title.trim() && $.plan.trim()), A = async () => {
    if (!(n || y || !R || p.current)) {
      p.current = !0, f(!0), _("");
      try {
        if (l.hasPendingChanges) {
          if (!await l.flush()) return;
        } else await N(u);
        o();
      } catch ($) {
        _(
          $ instanceof Error ? $.message : "保存未成功，草稿已保留"
        );
      } finally {
        p.current = !1, f(!1);
      }
    }
  };
  return /* @__PURE__ */ a("section", { className: "writing-draft-recovery", "aria-label": "未保存章纲草稿", children: [
    /* @__PURE__ */ a("p", { children: [
      "章纲草稿已保留：",
      t.units.length,
      " 章，本批要求",
      " ",
      t.expected_count,
      " 章",
      t.complete ? "。" : "；生成已中断，仅包含完整收到的章节。"
    ] }),
    /* @__PURE__ */ e("button", { disabled: n && !c, onClick: i, children: "查看并调整草稿" }),
    c && /* @__PURE__ */ a(
      Re,
      {
        title: "调整章纲草稿",
        onClose: o,
        closeDisabled: k,
        className: "writing-chapter-recovery-dialog",
        children: [
          /* @__PURE__ */ a("div", { className: "writing-chapter-recovery-layout", children: [
            /* @__PURE__ */ a(
              "nav",
              {
                className: "writing-chapter-recovery-list",
                "aria-label": "草稿章节",
                children: [
                  u.map(($, L) => /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      "aria-current": L === E ? "true" : void 0,
                      disabled: k,
                      onClick: () => d(L),
                      children: [
                        /* @__PURE__ */ a("small", { children: [
                          "第 ",
                          L + 1,
                          " 章"
                        ] }),
                        /* @__PURE__ */ e("strong", { children: $.title || "未命名章节" })
                      ]
                    },
                    `${L}:${$.id}`
                  )),
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      disabled: k || u.length >= t.expected_count,
                      onClick: h,
                      children: b.unit_ids.length ? "补充下一章草稿" : "添加章节"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
              /* @__PURE__ */ a("p", { className: "writing-chapter-recovery-note", children: [
                "当前 ",
                u.length,
                " 章 · 本批需 ",
                t.expected_count,
                " ",
                "章；调整后保存，计划总章数保持不变。"
              ] }),
              y && /* @__PURE__ */ e("p", { role: "alert", children: "作品已有新修改，原草稿可查看，不能覆盖当前内容。" }),
              x && /* @__PURE__ */ a(Ne, { children: [
                /* @__PURE__ */ a("label", { className: "writing-title-field", children: [
                  /* @__PURE__ */ e("span", { className: "writing-sr-only", children: "草稿章节标题" }),
                  /* @__PURE__ */ e(
                    "input",
                    {
                      "aria-label": "草稿章节标题",
                      value: x.title,
                      readOnly: k,
                      onChange: ($) => m({ title: $.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ e("div", { className: "writing-body", children: /* @__PURE__ */ e(
                  At,
                  {
                    kind: "richtext",
                    contentFormat: "markdown",
                    value: x.plan,
                    readonly: k,
                    onChange: ($) => m({ plan: $ })
                  }
                ) }),
                !b.unit_ids.length && /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    disabled: k,
                    onClick: () => l.setDraft(
                      u.filter(($, L) => L !== E)
                    ),
                    children: "移除此章草稿"
                  }
                )
              ] }),
              g && /* @__PURE__ */ e("p", { role: "alert", className: "writing-error", children: g })
            ] })
          ] }),
          /* @__PURE__ */ a("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            /* @__PURE__ */ e("button", { disabled: k, onClick: o, children: "返回大纲" }),
            /* @__PURE__ */ e(
              "button",
              {
                className: "is-primary",
                disabled: n || k || y || !R,
                onClick: () => {
                  A();
                },
                children: k ? "正在保存…" : `保存本批 ${t.expected_count} 章`
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function Tt(t, r, n) {
  const [c, i] = B(0), o = r && t !== void 0 ? Math.floor(t / Ee) : c;
  return o !== c && i(o), [c, (v) => {
    n?.(), i(v);
  }];
}
function wt({ document: t, section: r, readonly: n, navigationDisabled: c, onSelect: i, onAdd: o, streamTarget: v, following: s = !1, onReadPage: d }) {
  const g = new RegExp(`^outline:${r}:(\\d+)$`).exec(v || ""), [_, k] = Tt(g ? Number(g[1]) : void 0, s, d), f = t.outline[r], p = Math.max(1, Math.ceil(f.length / Ee)), b = Math.min(_, p - 1), y = { characters: "人物", locations: "地点", props: "必要道具" }[r];
  return /* @__PURE__ */ a("section", { className: "story-entities-page", "aria-label": y, "data-writing-stream-target": `outline:${r}`, children: [
    /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
      /* @__PURE__ */ e("h2", { "data-writing-stream-target": r === "characters" ? "phase:characters" : void 0, children: y }),
      /* @__PURE__ */ a("button", { disabled: n || c, onClick: () => o({ kind: "section", id: r }), children: [
        /* @__PURE__ */ e(je, { size: 14 }),
        "添加",
        y
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "story-entity-cards", children: f.slice(b * Ee, (b + 1) * Ee).map((N, l) => /* @__PURE__ */ a(
      "button",
      {
        className: `writing-outline-card story-entity-card${v === `outline:${r}:${b * Ee + l}` ? " is-streaming" : ""}`,
        disabled: c || !N.id || N.id.startsWith("preview:"),
        "data-writing-stream-target": `outline:${r}:${b * Ee + l}`,
        onClick: () => i({ kind: "entity", section: r, id: N.id }),
        children: [
          /* @__PURE__ */ e("span", { className: "writing-card-top", children: /* @__PURE__ */ e("small", { children: y }) }),
          /* @__PURE__ */ e("strong", { className: "writing-card-title", children: N.name || "正在构思…" }),
          /* @__PURE__ */ e("p", { className: "writing-list-preview", children: N.description || "暂无资料" }),
          /* @__PURE__ */ a("span", { className: "writing-entity-footer", children: [
            "查看与编辑",
            /* @__PURE__ */ e(yt, { size: 15 })
          ] })
        ]
      },
      N.id || `preview:${l}`
    )) }),
    !f.length && /* @__PURE__ */ a("p", { className: "story-outline-empty", children: [
      "暂无",
      y
    ] }),
    p > 1 && /* @__PURE__ */ a("div", { className: "story-reading-pagination", children: [
      /* @__PURE__ */ e("button", { disabled: c || !b, onClick: () => k(b - 1), children: "上一页" }),
      /* @__PURE__ */ a("span", { children: [
        b + 1,
        " / ",
        p
      ] }),
      /* @__PURE__ */ e("button", { disabled: c || b + 1 >= p, onClick: () => k(b + 1), children: "下一页" })
    ] })
  ] });
}
function Wt({
  order: t,
  id: r,
  title: n,
  view: c = "reversed"
}) {
  return /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "writing-chapter-handle",
      "aria-label": `调整「${n}」顺序`,
      ...t.handleProps(r, c),
      children: /* @__PURE__ */ e(Kt, { size: 14 })
    }
  );
}
function Mt({
  page: t,
  onPage: r,
  onSelect: n,
  readonly: c,
  navigationDisabled: i,
  chapterOrder: o,
  activeUnitId: v,
  activeOrdinal: s
}) {
  return /* @__PURE__ */ a(Ne, { children: [
    /* @__PURE__ */ a("div", { className: "writing-chapter-pagination", "aria-label": "剧情分页", children: [
      /* @__PURE__ */ a("span", { children: [
        Ke(t.rows) || "0 章",
        " / 共 ",
        t.total,
        " 章"
      ] }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ e(
          "button",
          {
            disabled: i || !t.page,
            onClick: () => r(t.page - 1),
            children: "上一页"
          }
        ),
        /* @__PURE__ */ a("span", { children: [
          t.page + 1,
          " / ",
          t.pages
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            disabled: i || t.page + 1 >= t.pages,
            onClick: () => r(t.page + 1),
            children: "下一页"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a("ul", { className: "writing-directory writing-chapter-grid", children: [
      t.rows.map(({ unit: d, label: g, ordinal: _ }) => {
        const k = !d.id || v === d.id || s === _;
        return /* @__PURE__ */ a(
          "li",
          {
            className: `writing-outline-card writing-chapter-card${k ? " is-streaming" : ""}`,
            "data-unit-id": d.id,
            "data-writing-stream-target": `chapter:${_ - 1}`,
            ...o.itemProps(d.id, "canonical"),
            children: [
              /* @__PURE__ */ a("div", { className: "writing-card-top", children: [
                /* @__PURE__ */ a("span", { className: "writing-card-meta", children: [
                  /* @__PURE__ */ e("small", { className: "writing-card-ordinal", children: g }),
                  /* @__PURE__ */ e("small", { className: "writing-card-status", children: k ? "生成中" : Nt(d) })
                ] }),
                /* @__PURE__ */ a("div", { className: "writing-chapter-card-tools", children: [
                  /* @__PURE__ */ e(
                    "button",
                    {
                      "data-writing-drag-ignore": !0,
                      className: "writing-card-edit",
                      "aria-label": `修改剧情：${d.title}`,
                      disabled: c || i || !d.id,
                      onClick: () => n({ kind: "unit", id: d.id, tab: "plan" }),
                      children: /* @__PURE__ */ e(Me, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    Wt,
                    {
                      order: o,
                      id: d.id,
                      title: d.title,
                      view: "canonical"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ a(
                "button",
                {
                  className: "writing-entity-card",
                  disabled: i || !d.id,
                  onClick: () => n({ kind: "unit", id: d.id, tab: "body" }),
                  children: [
                    /* @__PURE__ */ e("strong", { className: "writing-card-title", children: d.title || (d.id ? "未命名章节" : "正在规划…") }),
                    /* @__PURE__ */ e("span", { className: "writing-list-preview", children: d.plan || (d.id ? "暂无剧情" : "正在展开剧情…") }),
                    /* @__PURE__ */ a("span", { className: "writing-entity-footer", children: [
                      d.has_body ? "打开正文" : "进入正文",
                      /* @__PURE__ */ e(yt, { size: 15 })
                    ] })
                  ]
                }
              )
            ]
          },
          d.id || `preview:${_}`
        );
      }),
      !t.total && /* @__PURE__ */ e("li", { className: "writing-material-empty", children: "暂无章节" })
    ] })
  ] });
}
function Jn({
  document: t,
  readonly: r,
  navigationDisabled: n,
  onSelect: c,
  onAdd: i,
  onPreferences: o,
  onEditSection: v,
  chapterOrder: s,
  activeUnitId: d,
  streamTarget: g,
  generatingBackground: _ = !1,
  following: k = !1,
  onReadPage: f,
  chapterRecovery: p
}) {
  const b = cn(t), { preferences: y } = t, N = !_ || !!t.outline.world || g === "outline:world", l = [
    { label: "题材", value: y.genre },
    {
      label: "文风",
      value: Ct.find((m) => m.value === y.style)?.label || (y.style_instructions ? "自定文风" : "")
    },
    {
      label: "叙事视角",
      value: St.find(
        (m) => m.value === y.pov
      )?.label
    },
    {
      label: "写作模式",
      value: $t.find((m) => m.value === y.mode)?.label
    },
    {
      label: "计划章数",
      value: y.planned_chapters ? `${y.planned_chapters} 章` : ""
    },
    {
      label: "每章字数",
      value: y.chapter_words ? `约 ${y.chapter_words} 字` : ""
    }
  ], u = /^chapter:(\d+)$/.exec(g || ""), [E, x] = Tt(
    u ? Number(u[1]) : void 0,
    k,
    f
  );
  return /* @__PURE__ */ a("div", { className: "story-outline-page", children: [
    b && /* @__PURE__ */ a("section", { className: "story-outline-inspiration", "aria-label": "已选灵感", children: [
      /* @__PURE__ */ e("span", { children: "已选灵感" }),
      /* @__PURE__ */ e("h2", { children: b.title }),
      /* @__PURE__ */ e("p", { children: b.content })
    ] }),
    /* @__PURE__ */ a(
      "section",
      {
        className: "story-outline-preferences",
        "aria-label": "写作设定",
        "data-writing-stream-target": "preferences",
        children: [
          /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
            /* @__PURE__ */ e("h2", { "data-writing-stream-target": "phase:preferences", children: "写作设定" }),
            /* @__PURE__ */ a(
              "button",
              {
                disabled: r || n,
                "aria-label": "修改写作设定",
                onClick: o,
                children: [
                  /* @__PURE__ */ e(Me, { size: 13 }),
                  "修改"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ e("dl", { className: "story-preference-fields", children: l.map(({ label: m, value: h }) => /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e("dt", { children: m }),
            /* @__PURE__ */ e("dd", { className: h ? void 0 : "is-unset", children: h || "待确定" })
          ] }, m)) }),
          y.style_instructions && /* @__PURE__ */ a("div", { className: "story-style-note", children: [
            /* @__PURE__ */ e("span", { children: "文风要求" }),
            /* @__PURE__ */ e("p", { children: y.style_instructions })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "故事总纲", children: [
      /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ e("h2", { "data-writing-stream-target": "phase:direction", children: "故事总纲" }),
        /* @__PURE__ */ a(
          "button",
          {
            disabled: r || n,
            "aria-label": "修改故事总纲",
            onClick: () => v("overview"),
            children: [
              /* @__PURE__ */ e(Me, { size: 13 }),
              "修改"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e(
        "article",
        {
          className: "story-text-card",
          "data-writing-stream-target": "outline:overview",
          children: /* @__PURE__ */ e(
            ut,
            {
              fallback: t.outline.overview || "暂无故事总纲",
              className: "story-outline-prose",
              markdownClassName: "story-outline-markdown"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ e(
      wt,
      {
        document: t,
        section: "characters",
        readonly: r,
        navigationDisabled: n,
        onSelect: c,
        onAdd: i,
        streamTarget: g,
        following: k,
        onReadPage: f
      }
    ),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "背景", children: [
      /* @__PURE__ */ e("div", { className: "story-section-heading", children: /* @__PURE__ */ e("h2", { "data-writing-stream-target": "phase:background", children: "背景" }) }),
      N && /* @__PURE__ */ a(
        "article",
        {
          className: "story-text-card",
          "data-writing-stream-target": "outline:world",
          children: [
            /* @__PURE__ */ e("h3", { children: "环境与规则" }),
            /* @__PURE__ */ e(
              ut,
              {
                fallback: t.outline.world || "暂无背景",
                className: "story-outline-prose",
                markdownClassName: "story-outline-markdown"
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                disabled: r || n,
                "aria-label": "修改环境与规则",
                onClick: () => v("world"),
                children: [
                  /* @__PURE__ */ e(Me, { size: 13 }),
                  "修改"
                ]
              }
            )
          ]
        }
      ),
      ["locations", "props"].filter(
        (m) => !_ || t.outline[m].length > 0
      ).map((m) => /* @__PURE__ */ e(
        wt,
        {
          document: t,
          section: m,
          readonly: r,
          navigationDisabled: n,
          onSelect: c,
          onAdd: i,
          streamTarget: g,
          following: k,
          onReadPage: f
        },
        m
      ))
    ] }),
    /* @__PURE__ */ a("section", { className: "story-outline-section", "aria-label": "章节剧情", children: [
      /* @__PURE__ */ a("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ e("h2", { "data-writing-stream-target": "phase:chapters", children: "章节剧情" }),
        /* @__PURE__ */ a(
          "button",
          {
            disabled: r || n,
            onClick: () => i({ kind: "section", id: "chapters" }),
            children: [
              /* @__PURE__ */ e(je, { size: 14 }),
              "添加章节"
            ]
          }
        )
      ] }),
      p,
      /* @__PURE__ */ e(
        Mt,
        {
          page: Et(
            Ce(t.units).canonical,
            E
          ),
          onPage: x,
          onSelect: c,
          readonly: r,
          navigationDisabled: n,
          chapterOrder: s,
          activeUnitId: d,
          activeOrdinal: u ? Number(u[1]) + 1 : void 0
        }
      )
    ] })
  ] });
}
function Kn({
  preferences: t,
  disabled: r,
  onSave: n,
  onClose: c
}) {
  const [i, o] = B(() => ({ ...t })), [v, s] = B(!1), [d, g] = B(""), _ = O(!1), k = r || v;
  return /* @__PURE__ */ e(
    Re,
    {
      title: "写作设定",
      className: "writing-preferences-dialog",
      closeDisabled: v,
      onClose: c,
      children: /* @__PURE__ */ a(
        "form",
        {
          className: "writing-dialog-scroll writing-preferences-form",
          onSubmit: async (f) => {
            if (f.preventDefault(), !(r || _.current)) {
              _.current = !0, s(!0), g("");
              try {
                await n({
                  ...i,
                  genre: i.genre.trim(),
                  style_instructions: i.style_instructions.trim()
                }) ? c() : g("未能保存，请重试。设置已保留。");
              } catch (p) {
                g(
                  p instanceof Error ? p.message : "保存失败，设置已保留。"
                );
              } finally {
                _.current = !1, s(!1);
              }
            }
          },
          children: [
            /* @__PURE__ */ a("label", { className: "writing-preferences-full", children: [
              "题材",
              /* @__PURE__ */ e(
                "input",
                {
                  "aria-label": "题材",
                  placeholder: "沿用创作要求",
                  disabled: k,
                  value: i.genre,
                  onChange: (f) => o({ ...i, genre: f.target.value })
                }
              ),
              /* @__PURE__ */ e("span", { className: "writing-genre-shortcuts", children: ["悬疑", "都市", "奇幻", "言情", "日常"].map((f) => /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  "aria-pressed": i.genre === f,
                  disabled: k,
                  onClick: () => o({ ...i, genre: f }),
                  children: f
                },
                f
              )) })
            ] }),
            [
              { key: "style", label: "文风", options: Ct },
              { key: "pov", label: "叙事视角", options: St },
              { key: "mode", label: "写作模式", options: $t }
            ].map(({ key: f, label: p, options: b }) => /* @__PURE__ */ a("label", { children: [
              p,
              /* @__PURE__ */ a(
                "select",
                {
                  "aria-label": p,
                  disabled: k,
                  value: i[f],
                  onChange: (y) => o({ ...i, [f]: y.target.value }),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "沿用创作要求" }),
                    b.map((y) => /* @__PURE__ */ e("option", { value: y.value, children: y.label }, y.value))
                  ]
                }
              )
            ] }, f)),
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
            ].map(({ key: f, label: p, placeholder: b }) => /* @__PURE__ */ a("label", { children: [
              p,
              /* @__PURE__ */ e(
                "input",
                {
                  "aria-label": p,
                  type: "number",
                  min: 1,
                  step: 1,
                  max: Number.MAX_SAFE_INTEGER,
                  placeholder: b,
                  disabled: k,
                  value: i[f] || "",
                  onChange: (y) => o({
                    ...i,
                    [f]: y.target.value === "" ? 0 : Number(y.target.value)
                  })
                }
              )
            ] }, f)),
            /* @__PURE__ */ a("label", { className: "writing-preferences-full", children: [
              "自定义文风要求",
              /* @__PURE__ */ e(
                "textarea",
                {
                  "aria-label": "自定义文风要求",
                  rows: 3,
                  placeholder: "例如：少用比喻，通过对话和动作表现情绪",
                  disabled: k,
                  value: i.style_instructions,
                  onChange: (f) => o({ ...i, style_instructions: f.target.value })
                }
              )
            ] }),
            d && /* @__PURE__ */ e(
              "p",
              {
                role: "alert",
                className: "writing-preferences-full writing-inspiration-form-error",
                children: d
              }
            ),
            /* @__PURE__ */ a("div", { className: "writing-preferences-full writing-actions", children: [
              /* @__PURE__ */ e("button", { type: "button", disabled: v, onClick: c, children: "取消" }),
              /* @__PURE__ */ e("button", { type: "submit", className: "is-primary", disabled: k, children: v ? "保存中…" : "保存" })
            ] })
          ]
        }
      )
    }
  );
}
function Yn({
  document: t,
  recoverableDraft: r,
  selection: n,
  value: c,
  readonly: i,
  onChange: o,
  onSelect: v,
  chapterOrder: s,
  onDeleteChapter: d,
  directory: g,
  navigationDisabled: _,
  onTextSelectionChange: k,
  selectionActionsRef: f,
  scoped: p = !1
}) {
  const b = (m) => o({ ...c, document: m }), y = (m, h, R) => /* @__PURE__ */ e(
    "div",
    {
      className: "writing-body",
      "aria-label": m,
      "data-writing-stream-target": n.kind === "unit" ? `unit:${n.id}:${n.tab === "plan" ? "plan" : "body"}` : void 0,
      children: /* @__PURE__ */ e(
        At,
        {
          kind: "richtext",
          contentFormat: "markdown",
          value: h,
          readonly: i,
          onTextSelectionChange: k,
          selectionActionsRef: f,
          onChange: R
        }
      )
    }
  );
  if (n.kind === "unit") {
    const m = Ce(t.units), h = m.byId.get(n.id), R = h?.unit;
    if (!R) return null;
    const A = n.tab === "plan";
    return /* @__PURE__ */ a(Ne, { children: [
      /* @__PURE__ */ a("div", { className: "writing-manuscript-heading", children: [
        /* @__PURE__ */ e("span", { className: "writing-manuscript-ordinal", children: h.label }),
        /* @__PURE__ */ a("label", { className: "writing-title-field", children: [
          /* @__PURE__ */ e("span", { className: "writing-sr-only", children: "标题" }),
          /* @__PURE__ */ e(
            "input",
            {
              "aria-label": "标题",
              value: R.title,
              readOnly: i,
              onChange: ($) => b({
                ...t,
                units: Je(t.units, R.id, {
                  title: $.target.value
                })
              })
            }
          )
        ] }),
        !p && /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "writing-delete-chapter is-danger",
            disabled: i || s.handleProps(R.id).disabled,
            onClick: () => d(R.id),
            children: [
              /* @__PURE__ */ e(vt, { size: 14 }),
              "删除章节"
            ]
          }
        )
      ] }),
      !p && /* @__PURE__ */ e("div", { className: "writing-chapter-neighbors", "aria-label": "切换章节", children: [
        { offset: -1, label: "上一章", Icon: Yt },
        { offset: 1, label: "下一章", Icon: De }
      ].map(({ offset: $, label: L, Icon: q }) => {
        const T = m.canonical[h.ordinal - 1 + $];
        return /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            disabled: _ || !T,
            title: T ? `${T.label}：${T.unit.title}` : void 0,
            onClick: () => T && v({
              kind: "unit",
              id: T.unit.id,
              tab: "body"
            }),
            children: [
              /* @__PURE__ */ e(q, { size: 14 }),
              L
            ]
          },
          L
        );
      }) }),
      !A && /* @__PURE__ */ a("section", { className: "writing-plan-reference", "aria-label": "本章剧情", children: [
        /* @__PURE__ */ a("div", { className: "writing-row", children: [
          /* @__PURE__ */ e("h3", { children: "本章剧情" }),
          /* @__PURE__ */ e("button", { disabled: i || _, onClick: () => v({ ...n, tab: "plan" }), children: "修改" })
        ] }),
        /* @__PURE__ */ e("p", { children: R.plan })
      ] }),
      !A && r && !c.unit?.body && /* @__PURE__ */ a("section", { className: "writing-draft-recovery", "aria-label": "未完成正文草稿", children: [
        /* @__PURE__ */ e("p", { children: "上次生成已中断，正文草稿已保留。" }),
        /* @__PURE__ */ e("button", { disabled: i, onClick: () => c.unit && o({ ...c, unit: { ...c.unit, body: r } }), children: "恢复草稿" })
      ] }),
      !A && R.has_body && R.continuity_status === "raw_pending" && !R.dependency_stale && /* @__PURE__ */ e("p", { className: "writing-continuity-note", role: "status", children: "正文已保存，记忆待补充。" }),
      !A && R.has_body && (R.continuity_status === "pending" || R.dependency_stale) && /* @__PURE__ */ e("p", { className: "writing-continuity-note", role: "status", children: "正文已保存，剧情衔接待整理。" }),
      A ? y(
        "章纲",
        R.plan,
        ($) => b({
          ...t,
          units: Je(t.units, R.id, {
            plan: $
          })
        })
      ) : c.unit && y(
        "正文",
        c.unit.body,
        ($) => o({ ...c, unit: { ...c.unit, body: $ } })
      )
    ] });
  }
  if (n.kind === "section" && n.id === "chapters")
    return /* @__PURE__ */ e(Mt, { page: g.page, onPage: g.setPage, onSelect: v, readonly: i, navigationDisabled: _, chapterOrder: s });
  if (n.kind === "section" && Se(n.id)) {
    const m = n.id;
    return y("内容", t.outline[m], (h) => b({ ...t, outline: { ...t.outline, [m]: h } }));
  }
  const N = Oe(n);
  if (!N) return null;
  const l = xt.find((m) => m.id === N).label, u = t.outline[N];
  if (n.kind !== "entity") return null;
  const E = u.find((m) => m.id === n.id);
  if (!E) return null;
  const x = (m) => b({
    ...t,
    outline: {
      ...t.outline,
      [N]: u.map(
        (h) => h.id === E.id ? { ...h, ...m } : h
      )
    }
  });
  return /* @__PURE__ */ a(Ne, { children: [
    /* @__PURE__ */ a("label", { className: "writing-title-field", children: [
      /* @__PURE__ */ a("span", { className: "writing-sr-only", children: [
        l,
        "名称"
      ] }),
      /* @__PURE__ */ e(
        "input",
        {
          "aria-label": `${l}名称`,
          value: E.name,
          readOnly: i,
          onChange: (m) => x({ name: m.target.value })
        }
      )
    ] }),
    y(
      `${l}描述`,
      E.description,
      (m) => x({ description: m })
    )
  ] });
}
function Gn({
  selection: t,
  disabled: r,
  closeDisabled: n,
  onSave: c,
  onClose: i
}) {
  const [o, v] = B({
    title: "",
    description: ""
  }), [s, d] = B(!1), [g, _] = B(""), k = O(!1), f = Oe(t), p = f ? xt.find((b) => b.id === f).label : "章节";
  return /* @__PURE__ */ e(
    Re,
    {
      title: `添加${p}`,
      className: "writing-entry-dialog",
      closeDisabled: n || s,
      onClose: i,
      children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ a(
          "form",
          {
            className: "writing-new-form",
            onSubmit: async (b) => {
              if (b.preventDefault(), !(r || k.current)) {
                k.current = !0, d(!0), _("");
                try {
                  await c(o) || _("保存未成功，输入已保留，请重试。");
                } catch (y) {
                  _(
                    y instanceof Error ? y.message : "保存失败，输入已保留。"
                  );
                } finally {
                  k.current = !1, d(!1);
                }
              }
            },
            children: [
              /* @__PURE__ */ a("label", { children: [
                p,
                "名称",
                /* @__PURE__ */ e(
                  "input",
                  {
                    "aria-label": `${p}名称`,
                    required: !0,
                    disabled: r || s,
                    value: o.title,
                    onChange: (b) => v({ ...o, title: b.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ a("label", { children: [
                f ? "描述" : "章纲（可稍后填写）",
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    "aria-label": `${p}${f ? "描述" : "章纲"}`,
                    rows: 5,
                    disabled: r || s,
                    value: o.description,
                    onChange: (b) => v({ ...o, description: b.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ e(
                "button",
                {
                  className: "is-primary",
                  type: "submit",
                  disabled: r || s || !o.title.trim(),
                  children: "保存并打开"
                }
              )
            ]
          }
        ),
        g && /* @__PURE__ */ e("p", { className: "writing-error", role: "alert", children: g })
      ] })
    }
  );
}
function Dt({
  document: t,
  savedDocument: r = t,
  selection: n,
  body: c,
  selectedCharacters: i
}) {
  const o = n.kind === "unit" ? Ce(t.units).byId.get(n.id)?.unit : void 0, v = Oe(n), s = n.kind === "section" && n.id === "chapters", d = n.kind === "section" && !!v, g = n.kind === "unit" && n.tab === "plan", k = !!kt(t, n, c).trim(), f = Rt(t, n) + (o ? g ? " · 本章剧情" : " · 正文" : "");
  let p = k ? "重写当前内容" : "生成当前内容";
  i ? p = "修改选中文字" : s ? p = t.units.length ? "添加章节" : "规划章节剧情" : d ? p = `${t.outline[v].length ? "更新" : "生成"}${f}` : n.kind === "section" && Se(n.id) && !k ? p = `生成${f}` : o && !g && !k && (p = "生成本章正文");
  const b = s ? t.units.length ? "append" : "generate_chapters" : o && !g && !k ? "generate_units" : d || g || !k ? "generate_section" : "propose_edit", y = _e(r, b, {
    section_id: g ? "chapter_plan" : v || (n.kind === "section" && Se(n.id) ? n.id : void 0),
    unit_id: o?.id,
    unit_ids: o ? [o.id] : void 0,
    mode: "single"
  });
  return {
    selected: o,
    entitySection: v,
    entityList: d,
    directory: s,
    chapterPlan: g,
    hasContent: k,
    label: f,
    primaryLabel: p,
    available: !y,
    reason: y,
    instruction: i ? "修改选中的文字，保留原意并使表达自然流畅。" : k ? "重写当前内容，保持作品设定和上下文一致。" : `生成${f}，参考作品已有设定。`,
    remaining: Ce(t.units).firstUnwritten >= 0
  };
}
function jn(t, r, n) {
  const { selection: c } = t, i = Dt(t), o = { instruction: r };
  return n ? { action: "generate_units", extra: { ...o, mode: "continue" } } : i.directory ? t.document.units.length ? { action: "append", extra: { ...o, count: 1 } } : { action: "generate_chapters", extra: o } : i.entityList ? {
    action: "generate_section",
    extra: { ...o, section_id: i.entitySection }
  } : i.selected && i.chapterPlan && !i.hasContent ? {
    action: "generate_section",
    extra: {
      ...o,
      section_id: "chapter_plan",
      unit_id: i.selected.id
    }
  } : i.selected && !i.chapterPlan && !i.hasContent ? {
    action: "generate_units",
    extra: { ...o, mode: "single", unit_ids: [i.selected.id] }
  } : c.kind === "section" && Se(c.id) && !i.hasContent ? {
    action: "generate_section",
    extra: { ...o, section_id: c.id }
  } : (i.selected ? (o.unit_id = i.selected.id, i.chapterPlan && (o.section_id = "chapter_plan")) : (o.section_id = i.entitySection || (c.kind === "section" && Se(c.id) ? c.id : void 0), c.kind === "entity" && (o.entity_id = c.id)), o.instruction ||= i.instruction, { action: "propose_edit", extra: o });
}
function Xn({
  document: t,
  savedDocument: r,
  onConfirmationChange: n,
  selection: c,
  disabled: i,
  body: o,
  selectedCharacters: v,
  onClearSelection: s,
  onAction: d,
  proposalPending: g,
  proposalReady: _,
  proposalPreview: k,
  running: f,
  onApply: p,
  onDiscard: b,
  directory: y,
  activeBatchIds: N
}) {
  const [l, u] = B(""), E = c.kind === "section" && c.id !== "chapters", [x, m] = B(
    String(dn)
  ), [h, R] = B(""), A = x === "custom" ? /^\d+$/.test(h) ? Number(h) : Number.NaN : Number(x), $ = pn(A), [L, q] = B(""), T = Ie(
    () => un(r.units),
    [r.units]
  ), F = T.slice(0, gn), K = ht(
    r.units,
    r.preferences.planned_chapters
  ), j = ht(
    r.units,
    r.preferences.planned_chapters,
    L === "" ? void 0 : Number(L)
  ), ne = _e(r, "append", {
    count: j.count
  }), ie = ne ? "规划后续章节" : `规划第 ${j.start}—${j.end} 章`, Y = Ie(
    () => f && N?.length ? N.flatMap((w) => {
      const S = y.index.byId.get(w);
      return S ? [S] : [];
    }) : hn(r.units, A),
    [r.units, A, f, N, y.index]
  ), [ce, re] = B(!1), X = O(!1), [ee, P] = B(null), [ae, fe] = B(""), we = {
    document: t,
    savedDocument: r,
    selection: c,
    body: o,
    selectedCharacters: v
  }, W = Dt(we), se = i || ce || g, J = async (w, S = {}) => {
    if (se || X.current || _e(r, w, S)) return !1;
    X.current = !0, re(!0);
    try {
      const I = await d(w, {
        instruction: l.trim(),
        ...S
      });
      return I && u(""), I;
    } finally {
      X.current = !1, re(!1);
    }
  }, Z = (w, S = {}) => {
    if (se || X.current || _e(r, w, S))
      return;
    const I = Cn(r, w, S);
    I ? (P({ action: w, extra: S, impact: I }), fe(""), n(!0)) : J(w, S);
  }, de = () => {
    P(null), n(!1);
  }, pe = (w = !1, S = "") => {
    const { action: I, extra: z } = jn(
      we,
      [S, l.trim()].filter(Boolean).join(`
`),
      w
    );
    Z(
      I,
      w ? { ...z, count: A } : z
    );
  }, ge = !v && (E || W.directory || W.selected && !W.chapterPlan && W.hasContent);
  let H;
  !v && !W.chapterPlan && !W.entityList && !W.selected && (r.units.length || (H = {
    label: "生成大纲与剧情",
    action: "generate_outline",
    extra: {}
  }));
  const ue = H ? _e(r, H.action, H.extra) : "", $e = T.length > 0 && c.kind !== "entity" && !W.chapterPlan && !v, he = W.selected?.has_body && (W.selected.continuity_status === "pending" || W.selected.continuity_status === "raw_pending" || W.selected.dependency_stale), oe = (E || W.directory) && r.units.length > 0 && K.count > 0, be = $e || H || he || oe || ge;
  return /* @__PURE__ */ a("div", { className: "writing-controls", role: "group", "aria-label": "AI 创作", children: [
    /* @__PURE__ */ e("h3", { children: "写作工具" }),
    !v && /* @__PURE__ */ e("p", { className: "writing-ai-current", "aria-label": "当前 AI 目标", children: W.label }),
    v > 0 && /* @__PURE__ */ a("div", { className: "writing-ai-target", children: [
      /* @__PURE__ */ e("span", { children: "修改选中文字" }),
      /* @__PURE__ */ a("div", { className: "writing-row", children: [
        /* @__PURE__ */ a("small", { children: [
          v,
          " 字"
        ] }),
        /* @__PURE__ */ e("button", { disabled: g, onClick: s, children: "清除选区" })
      ] })
    ] }),
    !g && /* @__PURE__ */ a("label", { children: [
      /* @__PURE__ */ a("span", { children: [
        "创作要求 ",
        /* @__PURE__ */ e("small", { children: "可选" })
      ] }),
      /* @__PURE__ */ e(
        "textarea",
        {
          "aria-label": "创作要求",
          rows: 4,
          disabled: se,
          placeholder: "希望怎么写，或怎么改？",
          value: l,
          onChange: (w) => u(w.target.value)
        }
      )
    ] }),
    g ? /* @__PURE__ */ a("section", { className: "writing-proposal-preview", "aria-label": "AI 修改建议", children: [
      /* @__PURE__ */ a("div", { className: "writing-row", children: [
        /* @__PURE__ */ e("h4", { children: "修改建议" }),
        /* @__PURE__ */ e("span", { role: "status", children: _ ? "等待应用" : f ? "正在生成…" : "未完成" })
      ] }),
      /* @__PURE__ */ e(
        "div",
        {
          className: "writing-proposal-text",
          "aria-live": "off",
          "data-writing-stream-target": "proposal",
          children: k || (f ? "正在准备内容…" : "生成未完成，原文已保留。")
        }
      ),
      /* @__PURE__ */ a("div", { className: "writing-proposal-actions", children: [
        /* @__PURE__ */ e(
          "button",
          {
            className: "is-primary",
            disabled: i || !_,
            onClick: p,
            children: "应用修改"
          }
        ),
        /* @__PURE__ */ e("button", { disabled: i, onClick: b, children: "丢弃建议" })
      ] })
    ] }) : /* @__PURE__ */ a(Ne, { children: [
      be && /* @__PURE__ */ a("section", { className: "writing-ai-next", "aria-label": "接下来", children: [
        $e && /* @__PURE__ */ a(
          "section",
          {
            className: "writing-primary-action",
            "aria-label": "后续剧情同步",
            children: [
              /* @__PURE__ */ a("div", { className: "writing-ai-section-heading", children: [
                /* @__PURE__ */ a("span", { children: [
                  /* @__PURE__ */ e(Gt, { size: 14 }),
                  "后续剧情"
                ] }),
                /* @__PURE__ */ a("small", { children: [
                  T.length,
                  " 章待同步"
                ] })
              ] }),
              /* @__PURE__ */ a(
                "button",
                {
                  className: "is-primary",
                  disabled: se,
                  onClick: () => Z("generate_chapters", {
                    unit_ids: F.map(({ unit: w }) => w.id)
                  }),
                  children: [
                    "同步后续剧情 ",
                    /* @__PURE__ */ e(De, { size: 15 })
                  ]
                }
              ),
              /* @__PURE__ */ a("small", { className: "writing-batch-range", children: [
                Ke(T),
                T.length > F.length ? ` · 本批 ${F.length} 章` : ""
              ] })
            ]
          }
        ),
        H && !v && /* @__PURE__ */ a("div", { className: "writing-ai-actions writing-primary-action", children: [
          /* @__PURE__ */ a(
            "button",
            {
              className: "is-primary",
              disabled: se || !!ue,
              title: ue || void 0,
              onClick: () => Z(H.action, H.extra),
              children: [
                H.label,
                /* @__PURE__ */ e(De, { size: 15, "aria-hidden": "true" })
              ]
            }
          ),
          ue && /* @__PURE__ */ e("p", { className: "writing-ai-note", children: ue })
        ] }),
        he && /* @__PURE__ */ a("div", { className: "writing-primary-action", children: [
          /* @__PURE__ */ e("p", { className: "writing-ai-note", children: W.selected?.continuity_status === "raw_pending" ? "正文已保存，可继续写作。" : "正文已保存，补充剧情衔接后再继续。" }),
          /* @__PURE__ */ e(
            "button",
            {
              className: "is-primary",
              disabled: se,
              onClick: () => Z("retry_continuity", {
                unit_id: W.selected.id,
                expected_unit_version_id: W.selected.version_id
              }),
              children: "整理本章衔接"
            }
          )
        ] }),
        oe && /* @__PURE__ */ a("div", { className: "writing-plan-more", children: [
          /* @__PURE__ */ a("div", { className: "writing-ai-section-heading", children: [
            /* @__PURE__ */ e("span", { children: "章节规划" }),
            /* @__PURE__ */ a("small", { children: [
              r.units.length,
              r.preferences.planned_chapters ? ` / ${r.preferences.planned_chapters}` : "",
              " ",
              "章"
            ] })
          ] }),
          /* @__PURE__ */ a("label", { className: "writing-count-field", children: [
            /* @__PURE__ */ e("span", { children: "本批剧情" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                min: 1,
                max: K.count,
                "aria-label": "追加剧情章数",
                value: L,
                placeholder: String(K.count),
                disabled: se,
                onChange: (w) => q(w.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ e(
            "button",
            {
              disabled: se || !!ne,
              title: ne || void 0,
              onClick: () => Z("append", { count: j.count }),
              children: ie
            }
          ),
          ne && /* @__PURE__ */ e("p", { className: "writing-ai-note", children: ne })
        ] }),
        ge && /* @__PURE__ */ a(
          "section",
          {
            className: "writing-continuation",
            "aria-label": "正文批量生成",
            children: [
              /* @__PURE__ */ e("h4", { className: "writing-ai-section-title", children: "继续写正文" }),
              /* @__PURE__ */ a("label", { className: "writing-count-field", children: [
                /* @__PURE__ */ e("span", { children: "本批正文" }),
                /* @__PURE__ */ a(
                  "select",
                  {
                    "aria-label": "本批正文数量",
                    disabled: se,
                    value: x,
                    onChange: (w) => m(w.target.value),
                    children: [
                      [1, 3, 5, 10, 20, 50, 100].map((w) => /* @__PURE__ */ a("option", { value: w, children: [
                        "最多 ",
                        w,
                        " 章"
                      ] }, w)),
                      /* @__PURE__ */ e("option", { value: "custom", children: "自定义" })
                    ]
                  }
                )
              ] }),
              x === "custom" && /* @__PURE__ */ a("label", { className: "writing-count-field writing-custom-batch", children: [
                /* @__PURE__ */ e("span", { children: "正文章数" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    "aria-label": "自定义正文章数",
                    inputMode: "numeric",
                    value: h,
                    placeholder: `1—${fn}`,
                    disabled: se,
                    "aria-invalid": !!$,
                    onChange: (w) => R(w.target.value)
                  }
                )
              ] }),
              $ && /* @__PURE__ */ e("small", { className: "writing-ai-note", role: "alert", children: $ }),
              !$ && Y.length > 0 && /* @__PURE__ */ e("small", { className: "writing-batch-range", children: Ke(Y) }),
              /* @__PURE__ */ a(
                "button",
                {
                  className: "is-primary",
                  disabled: se || !!$ || !W.remaining || !!_e(r, "generate_units", {
                    mode: "continue",
                    count: A
                  }),
                  title: _e(r, "generate_units", {
                    mode: "continue",
                    count: A
                  }) || void 0,
                  onClick: () => pe(!0),
                  children: [
                    "生成本批正文",
                    /* @__PURE__ */ e(De, { size: 14, "aria-hidden": "true" })
                  ]
                }
              )
            ]
          }
        )
      ] }),
      (!W.directory || !W.available) && /* @__PURE__ */ a("section", { className: "writing-ai-revision", "aria-label": "内容修改", children: [
        /* @__PURE__ */ e("h4", { className: "writing-ai-group-title", children: "内容修改" }),
        !W.directory && !W.entityList && W.hasContent && /* @__PURE__ */ e("div", { className: "writing-quick-actions", "aria-label": "快捷修改", children: [
          {
            label: "润色",
            instruction: "润色表达，保留原意与事实。"
          },
          {
            label: "扩写",
            instruction: "扩写细节，保持人物和情节一致。"
          },
          {
            label: "精简",
            instruction: "精简冗余表达，保留关键信息。"
          }
        ].map((w) => /* @__PURE__ */ e(
          "button",
          {
            disabled: se || !W.available,
            onClick: () => pe(!1, w.instruction),
            children: w.label
          },
          w.label
        )) }),
        /* @__PURE__ */ e("div", { className: "writing-ai-actions", children: !W.directory && (!E || W.hasContent) && /* @__PURE__ */ e(
          "button",
          {
            className: H && !v ? void 0 : "is-primary",
            disabled: se || !W.available,
            onClick: () => pe(),
            children: v ? "修改选中文字" : W.hasContent && !W.directory && !W.entityList ? "生成修改建议" : W.primaryLabel
          }
        ) }),
        !W.available && /* @__PURE__ */ e("p", { className: "writing-ai-note", children: W.reason })
      ] })
    ] }),
    ee && /* @__PURE__ */ e(
      It,
      {
        title: "确认更新范围",
        description: ee.impact,
        confirmLabel: "确认更新",
        pending: ce,
        disabled: se,
        error: ae,
        onClose: () => {
          X.current || de();
        },
        onConfirm: async () => {
          await J(ee.action, ee.extra) ? de() : X.current || fe("更新未成功，原内容已保留，请重试。");
        }
      }
    )
  ] });
}
function Qn({
  timing: t
}) {
  const [r] = B(Date.now), n = $n(!0), c = En(
    Math.max(0, n - (t?.startedAt || r))
  ), i = t?.source === "server" ? `已用 ${c}` : `本次查看已用 ${c}`;
  return /* @__PURE__ */ a("span", { className: "writing-generation-clock", role: "timer", "aria-live": "off", children: [
    /* @__PURE__ */ e(Xt, { size: 13, "aria-hidden": "true" }),
    i
  ] });
}
function Zn({
  snapshot: t,
  running: r,
  generationTiming: n,
  children: c
}) {
  r && t?.document.status !== "running" && (t = null);
  const i = n && n.workAssetId === t?.work_asset_id && n.runId === t.run_id && n.requestId === t.request_id ? n : null;
  if (!r) return null;
  const o = t?.checkpoint, v = Sn(t), s = Number(o?.target) || 0, d = Math.max(
    0,
    Math.min(s, Number(o?.completed) || 0)
  );
  return /* @__PURE__ */ a("div", { className: "writing-generation-progress", children: [
    /* @__PURE__ */ a(
      "span",
      {
        className: "writing-generation-task",
        role: "status",
        title: Ye(t),
        children: [
          /* @__PURE__ */ e(jt, { size: 14, className: "ws-spin", "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: Ye(t) })
        ]
      }
    ),
    /* @__PURE__ */ e(
      Qn,
      {
        timing: i
      },
      `${t?.work_asset_id}:${t?.run_id}:${t?.request_id}`
    ),
    (v || s > 1) && /* @__PURE__ */ e("span", { className: `writing-generation-count${v ? " is-planning" : ""}`, children: v || `已完成 ${d}/${s}` }),
    c
  ] });
}
function ei({
  snapshot: t,
  inline: r = !1,
  preview: n,
  generationTiming: c,
  running: i,
  busy: o,
  readonly: v,
  error: s,
  conflicted: d,
  reloadDisabled: g,
  onReload: _,
  onRetry: k,
  onStop: f
}) {
  const [p, b] = B(!1), [y, N] = B(!1), l = Bt(t), u = l && t ? _e(t.document, l.action, l.extra) : "", E = t?.document.status === "stopped" && !!(t.checkpoint?.history_total && (t.checkpoint.history_completed || 0) < t.checkpoint.history_total), x = l?.action === "retry_continuity" && !E ? "正文已保存，衔接整理未完成" : `${Ye(t)}未完成`;
  return /* @__PURE__ */ a("div", { className: `writing-feedback${r ? " is-title-status" : ""}`, children: [
    /* @__PURE__ */ e(
      Zn,
      {
        snapshot: t,
        preview: n,
        running: i,
        generationTiming: c,
        children: i && /* @__PURE__ */ a(
          "button",
          {
            disabled: o || v || !t?.run_id || t.document.status !== "running",
            onClick: () => {
              f();
            },
            children: [
              /* @__PURE__ */ e(Qt, { size: 13 }),
              "停止生成"
            ]
          }
        )
      }
    ),
    s && !d && /* @__PURE__ */ a("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ e(Zt, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ e("p", { children: l ? x : "本次操作未完成" }),
      /* @__PURE__ */ e("button", { onClick: () => N(!0), children: "查看原因" }),
      !l && /* @__PURE__ */ e("button", { disabled: g, onClick: () => {
        _();
      }, children: "刷新状态" })
    ] }),
    y && s && /* @__PURE__ */ e(Re, { title: "未完成原因", onClose: () => N(!1), children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
      /* @__PURE__ */ e("p", { className: "writing-error-detail", children: s }),
      /* @__PURE__ */ a("div", { className: "writing-actions", children: [
        /* @__PURE__ */ e("button", { onClick: () => N(!1), children: "返回编辑" }),
        /* @__PURE__ */ e(
          "button",
          {
            disabled: g,
            onClick: async () => {
              await _(), N(!1);
            },
            children: "刷新状态"
          }
        )
      ] })
    ] }) }),
    d && /* @__PURE__ */ a("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ e("p", { children: "作品已在其他窗口更新。当前未保存内容已保留，请先复制需要保留的修改。" }),
      /* @__PURE__ */ e("button", { disabled: o, onClick: () => b(!0), children: "载入最新版" })
    ] }),
    p && /* @__PURE__ */ e(
      Re,
      {
        title: "载入最新版",
        closeDisabled: o,
        onClose: () => b(!1),
        children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
          /* @__PURE__ */ e("p", { children: "载入最新版将放弃当前未保存修改，请先复制需要保留的内容。" }),
          /* @__PURE__ */ a("div", { className: "writing-actions", children: [
            /* @__PURE__ */ e(
              "button",
              {
                disabled: o,
                onClick: async () => {
                  await _(), b(!1);
                },
                children: "放弃修改并载入"
              }
            ),
            /* @__PURE__ */ e("button", { disabled: o, onClick: () => b(!1), children: "保留编辑" })
          ] })
        ] })
      }
    ),
    t && l && /* @__PURE__ */ a("div", { className: "writing-progress", children: [
      (E || !s) && /* @__PURE__ */ e("span", { children: E ? `前文已整理 ${t.checkpoint?.history_completed || 0}/${t.checkpoint?.history_total}` : x }),
      /* @__PURE__ */ e(
        "button",
        {
          disabled: o || v || i || d || !!u,
          title: u || void 0,
          onClick: k,
          children: E ? "继续整理" : "重试这一步"
        }
      ),
      u && /* @__PURE__ */ e("small", { children: u })
    ] })
  ] });
}
function ti({
  document: t,
  selection: r,
  disabled: n,
  mutationDisabled: c,
  onSelect: i,
  onAdd: o,
  chapterOrder: v,
  directory: s
}) {
  const d = O(null), [g, _] = B(0), [k, f] = B(400), [p, b] = B(""), [y, N] = B(""), l = s.index.byId.get(s.focus.id), u = l ? s.index.canonical.length - l.ordinal : 0;
  ke(() => {
    const h = d.current;
    if (!h) return;
    const R = new ResizeObserver(() => f(h.clientHeight));
    return R.observe(h), () => R.disconnect();
  }, []), ke(() => {
    d.current && (d.current.scrollTop = 0);
  }, [s.query]), ke(() => {
    d.current && (d.current.scrollTop = u * Pe);
  }, [s.focus, u]);
  const E = mn(s.rows.length, g, k), x = Xe, m = { kind: "section", id: "chapters" };
  return /* @__PURE__ */ a("nav", { className: "writing-nav", "aria-label": "创作目录", children: [
    /* @__PURE__ */ a(
      "button",
      {
        disabled: n,
        "aria-current": r?.kind !== "unit" && !(r?.kind === "section" && r.id === "chapters") ? "page" : void 0,
        onClick: () => i({ kind: "section", id: "overview" }),
        children: [
          /* @__PURE__ */ e(en, { size: 16 }),
          /* @__PURE__ */ e("span", { children: "大纲" })
        ]
      }
    ),
    /* @__PURE__ */ a("div", { className: "writing-unit-nav", "aria-label": x.directory, children: [
      /* @__PURE__ */ a("div", { className: "writing-directory-heading", children: [
        /* @__PURE__ */ a(
          "button",
          {
            className: "writing-directory-link",
            disabled: n || !!xe(t, m),
            title: xe(t, m) || void 0,
            "aria-current": r?.kind === "section" && r.id === "chapters" ? "page" : void 0,
            onClick: () => i(m),
            children: [
              /* @__PURE__ */ e("span", { children: x.directory }),
              /* @__PURE__ */ e("small", { children: s.index.canonical.length })
            ]
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            className: "writing-add-unit",
            "aria-label": `添加${x.append}`,
            title: `添加${x.append}`,
            disabled: n || c || !wn(t),
            onClick: () => o(m),
            children: /* @__PURE__ */ e(je, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ a("div", { className: "writing-chapter-tools", children: [
        /* @__PURE__ */ e(
          "input",
          {
            "aria-label": "搜索章节标题",
            placeholder: "搜索章节标题",
            value: s.query,
            disabled: n,
            onChange: (h) => s.search(h.target.value)
          }
        ),
        /* @__PURE__ */ a(
          "form",
          {
            onSubmit: (h) => {
              h.preventDefault();
              const R = s.byNumber(p);
              if (!R) {
                N("请输入有效章号");
                return;
              }
              N(""), r?.kind === "unit" && r.id === R.unit.id && s.locate(R.unit.id), i({
                kind: "unit",
                id: R.unit.id,
                tab: "body"
              });
            },
            children: [
              /* @__PURE__ */ e(
                "input",
                {
                  "aria-label": "跳转章号",
                  inputMode: "numeric",
                  placeholder: "章号",
                  value: p,
                  disabled: n,
                  onChange: (h) => {
                    b(h.target.value), N("");
                  }
                }
              ),
              /* @__PURE__ */ e("button", { type: "submit", disabled: n || !p.trim(), children: "跳转" })
            ]
          }
        ),
        y && /* @__PURE__ */ e("small", { role: "alert", children: y }),
        s.query && /* @__PURE__ */ a("small", { children: [
          s.rows.length,
          " 个匹配章节"
        ] })
      ] }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          className: "writing-chapter-viewport",
          "aria-label": "章节目录列表",
          role: "list",
          tabIndex: 0,
          onScroll: (h) => _(h.currentTarget.scrollTop),
          onKeyDown: (h) => {
            if (h.altKey || h.ctrlKey || h.metaKey || !s.rows.length)
              return;
            const R = h.target instanceof Element ? Number(
              h.target.closest("[data-chapter-index]")?.dataset.chapterIndex ?? -1
            ) : -1, A = R < 0 ? Math.floor(g / Pe) : R, $ = Math.max(
              1,
              Math.floor(k / Pe)
            ), L = {
              ArrowUp: A - 1,
              ArrowDown: A + 1,
              Home: 0,
              End: s.rows.length - 1,
              PageUp: A - $,
              PageDown: A + $
            };
            if (!(h.key in L)) return;
            h.preventDefault();
            const q = Math.max(
              0,
              Math.min(s.rows.length - 1, L[h.key])
            );
            h.currentTarget.scrollTop = q * Pe, _(h.currentTarget.scrollTop), requestAnimationFrame(() => {
              d.current?.querySelector(
                `[data-chapter-index="${q}"] > button:first-child`
              )?.focus();
            });
          },
          children: [
            /* @__PURE__ */ e(
              "div",
              {
                className: "writing-chapter-window",
                style: { height: E.height },
                children: s.rows.slice(E.start, E.end).map((h, R) => {
                  const { unit: A } = h, $ = {
                    kind: "unit",
                    id: A.id,
                    tab: "body"
                  }, L = xe(t, $);
                  return /* @__PURE__ */ a(
                    "div",
                    {
                      className: "writing-nav-entry",
                      role: "listitem",
                      "aria-posinset": E.start + R + 1,
                      "aria-setsize": s.rows.length,
                      "data-chapter-index": E.start + R,
                      style: {
                        position: "absolute",
                        top: (E.start + R) * Pe,
                        height: Pe
                      },
                      ...v.itemProps(A.id),
                      children: [
                        /* @__PURE__ */ e(
                          "button",
                          {
                            disabled: n || !!L,
                            title: L || void 0,
                            "aria-label": `${h.label}：${A.title}`,
                            "aria-current": r?.kind === "unit" && r.id === A.id ? "page" : void 0,
                            onClick: () => i($),
                            children: /* @__PURE__ */ a("span", { children: [
                              /* @__PURE__ */ a("span", { className: "writing-nav-meta", children: [
                                /* @__PURE__ */ e("small", { children: h.label }),
                                /* @__PURE__ */ e("small", { className: A.has_body ? "is-written" : void 0, children: Nt(A) })
                              ] }),
                              /* @__PURE__ */ e("strong", { title: A.title, children: A.title })
                            ] })
                          }
                        ),
                        /* @__PURE__ */ e(
                          Wt,
                          {
                            order: v,
                            id: A.id,
                            title: A.title
                          }
                        )
                      ]
                    },
                    A.id || h.ordinal
                  );
                })
              }
            ),
            !s.rows.length && /* @__PURE__ */ e("p", { className: "writing-chapter-empty", children: s.query ? "没有匹配的章节" : "暂无章节" })
          ]
        }
      )
    ] })
  ] });
}
const ni = {
  pending: "等待中",
  running: "运行中",
  waiting: "等待处理",
  success: "已完成",
  fail: "失败",
  canceled: "已停止"
};
function ii({
  projectId: t,
  canvasId: r,
  workAssetId: n,
  activeRunId: c,
  busy: i,
  readonly: o,
  commandError: v,
  onStop: s,
  onClose: d
}) {
  const [g, _] = B([]), [k, f] = B(!1), [p, b] = B(!1), [y, N] = B(""), [l, u] = B(!1), [E, x] = B(!1), m = O(!1), h = O(0), R = O(!1), A = O(!0), $ = te(
    async (T = !1) => {
      if (!R.current) {
        R.current = !0, b(!0);
        try {
          const F = T ? h.current : 0, K = await xn({
            projectId: t,
            canvasId: r,
            workAssetId: n,
            beforeId: F
          });
          if (!A.current) return;
          _(
            (j) => T ? [
              ...j,
              ...K.items.filter(
                (ne) => !j.some((ie) => ie.id === ne.id)
              )
            ] : K.items
          ), h.current = K.beforeId, f(
            K.hasMore && K.beforeId > 0 && K.beforeId !== F
          ), N("");
        } catch (F) {
          A.current && N(F instanceof Error ? F.message : "读取运行记录失败");
        } finally {
          R.current = !1, A.current && b(!1);
        }
      }
    },
    [r, t, n]
  );
  ke(() => (A.current = !0, $(), () => {
    A.current = !1;
  }), [$, c]);
  const L = async () => {
    if (!(i || o || m.current)) {
      m.current = !0, u(!0), x(!0);
      try {
        await s(), await $();
      } catch (T) {
        N(T instanceof Error ? T.message : "停止运行失败");
      } finally {
        m.current = !1, u(!1);
      }
    }
  }, q = y || (E && !l ? v : "");
  return /* @__PURE__ */ e(
    Re,
    {
      title: "运行记录",
      className: "writing-runs-dialog",
      closeDisabled: l,
      onClose: d,
      children: /* @__PURE__ */ a("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ e("div", { className: "writing-actions", children: /* @__PURE__ */ e("button", { disabled: p || l, onClick: () => {
          $();
        }, children: "刷新" }) }),
        q && /* @__PURE__ */ e("p", { role: "alert", className: "writing-error", children: q }),
        g.map((T) => /* @__PURE__ */ a("article", { className: "writing-run-entry", children: [
          /* @__PURE__ */ a("div", { className: "writing-row", children: [
            /* @__PURE__ */ e("strong", { children: Rn(T.action) }),
            /* @__PURE__ */ e("span", { className: "writing-run-status", children: ni[In(T.status)] })
          ] }),
          /* @__PURE__ */ e("p", { className: "writing-run-time", children: _t(T.created_at || T.updated_at) }),
          T.checkpoint && T.checkpoint.target > 0 && /* @__PURE__ */ a("p", { className: "writing-run-progress", children: [
            "已完成 ",
            T.checkpoint.completed,
            "/",
            T.checkpoint.target
          ] }),
          T.instruction && /* @__PURE__ */ e("p", { className: "writing-run-instruction", children: T.instruction }),
          T.error && /* @__PURE__ */ e("p", { className: "writing-error", children: T.error }),
          T.id === c && Tn(T.status) && /* @__PURE__ */ e(
            "button",
            {
              disabled: i || o || l,
              onClick: () => {
                L();
              },
              children: l ? "正在停止…" : "停止本次运行"
            }
          )
        ] }, T.id)),
        !g.length && !p && /* @__PURE__ */ e("p", { children: "暂无运行记录" }),
        p && /* @__PURE__ */ e("p", { role: "status", children: "正在读取记录…" }),
        k && /* @__PURE__ */ e(
          "button",
          {
            disabled: p || l,
            onClick: () => {
              $(!0);
            },
            children: "加载更多"
          }
        )
      ] })
    }
  );
}
function ri(t, r) {
  const n = Ie(() => Ce(t), [t]), [c, i] = B(""), [o, v] = B(0), [s, d] = B({
    id: "",
    revision: 0
  }), g = Ie(
    () => bn(n, c),
    [n, c]
  ), _ = te(
    (l) => {
      const u = n.byId.get(l);
      return u ? (i(""), v(
        Math.floor(
          (n.canonical.length - u.ordinal) / Ee
        )
      ), d((E) => ({ id: l, revision: E.revision + 1 })), !0) : !1;
    },
    [n]
  ), k = r?.kind === "unit" ? r.id : "", f = n.byId.get(k)?.ordinal || 0, p = `${k}:${f}`, [b, y] = B(""), N = te((l) => {
    i(l), v(0);
  }, []);
  return p !== b && (y(p), k && _(k)), {
    index: n,
    rows: g,
    query: c,
    search: N,
    locate: _,
    focus: s,
    page: Et(g, o),
    setPage: v,
    byNumber: (l) => {
      if (/^\d+$/.test(l.trim()))
        return n.canonical[Number(l) - 1];
    }
  };
}
function ai(t) {
  return [...t].reverse();
}
function si(t, r, n, c, i = "reversed") {
  const o = yn(
    t,
    r,
    n,
    i === "canonical" ? c : c === "before" ? "after" : "before",
    (v) => v.id
  );
  return o.every((v, s) => v === t[s]) ? t : o;
}
function oi({
  disabled: t,
  reason: r,
  getDocument: n,
  flush: c,
  onSave: i
}) {
  const [o, v] = B(!1), [s, d] = B(null), g = O(""), [_, k] = B(""), f = O(!1), p = () => {
    g.current = "", k(""), d(null);
  }, b = async (N, l, u, E) => {
    if (t || f.current || N === l) return !1;
    f.current = !0, v(!0), p();
    try {
      if (!await c()) return !1;
      const x = n();
      if (!x) return !1;
      const m = si(
        x.units,
        N,
        l,
        u,
        E
      );
      return m === x.units ? !1 : await i({ ...x, units: m });
    } finally {
      f.current = !1, v(!1);
    }
  }, y = t || o;
  return {
    pending: o,
    itemProps: (N, l = "reversed") => ({
      draggable: !y && !!N,
      "data-dragging": !!N && _ === N || void 0,
      onDragStart: (u) => {
        if (y || !N || u.target instanceof Element && u.target.closest("input,textarea,select,[contenteditable=true],[data-writing-drag-ignore]")) {
          u.preventDefault();
          return;
        }
        g.current = N, k(N), u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", N);
      },
      onDragEnd: p,
      "data-drop": s?.id === N ? s.placement : void 0,
      onDragOver: (u) => {
        if (y || !g.current || g.current === N) return;
        u.preventDefault(), u.dataTransfer.dropEffect = "move";
        const E = u.currentTarget.getBoundingClientRect();
        d({
          id: N,
          placement: u.clientY < E.top + E.height / 2 ? "before" : "after"
        });
      },
      onDragLeave: (u) => {
        u.currentTarget.contains(u.relatedTarget) || d(null);
      },
      onDrop: (u) => {
        if (y || !g.current) return;
        u.preventDefault();
        const E = u.currentTarget.getBoundingClientRect();
        return b(
          g.current,
          N,
          u.clientY < E.top + E.height / 2 ? "before" : "after",
          l
        );
      }
    }),
    handleProps: (N, l = "reversed") => ({
      disabled: y || !N,
      title: y ? r || "正在保存章节顺序" : "拖动排序，或按 Alt + ↑ / ↓ 调整位置",
      onKeyDown: (u) => {
        if (!u.altKey || !["ArrowUp", "ArrowDown"].includes(u.key) || (u.preventDefault(), y)) return;
        const E = n()?.units || [], x = l === "canonical" ? E : ai(E), m = x.findIndex((R) => R.id === N), h = x[m + (u.key === "ArrowUp" ? -1 : 1)];
        if (h)
          return b(
            N,
            h.id,
            u.key === "ArrowUp" ? "before" : "after",
            l
          );
      }
    })
  };
}
const li = {
  preferences: "phase:preferences",
  direction: "phase:direction",
  characters: "phase:characters",
  background: "phase:background",
  chapters: "phase:chapters"
};
function ci(t, r, n, c) {
  const i = c?.action === "generate_outline" ? c.phase : void 0, o = r.kind === "section" && r.id !== "chapters" && i && li[i] || null;
  return !n || i && n.phase !== i ? o : di(t, r, n, c) || o;
}
function di(t, r, n, c) {
  const i = n.active_field.replace(/\[(\d+)\]/g, ".$1");
  if (i.startsWith("preferences.")) return r.kind === "section" ? "preferences" : null;
  if (!i || i === "replacement" || r.kind === "entity")
    return null;
  if (r.kind === "unit") {
    const g = r.tab === "plan";
    if (n.unit_id === r.id && i === (g ? "plan" : "body") && (!g || n.section_id === "chapter_plan"))
      return `unit:${r.id}:${g ? "plan" : "body"}`;
  }
  const o = /^units\.(\d+)\.(title|plan)$/.exec(i);
  if (o) {
    const g = Number(o[1]), _ = c?.action === "generate_chapters" && c.unit_ids.length ? Ce(t.units).byId.get(
      c.unit_ids[g]
    )?.ordinal : g + (c?.action === "append" ? t.units.length : 0) + 1;
    return _ === void 0 ? null : r.kind === "section" ? `chapter:${_ - 1}` : r.kind === "unit" && r.tab === "plan" && t.units[_ - 1]?.id === r.id ? `unit:${r.id}:plan` : null;
  }
  if (r.kind !== "section" || r.id === "chapters") return null;
  const v = i.startsWith("outline.") ? i.slice(8) : i === "content" ? n.section_id : void 0;
  if (v && Se(v)) return `outline:${v}`;
  const s = /^outline\.(characters|locations|props)\.(\d+)\./.exec(i);
  if (s) return `outline:${s[1]}:${s[2]}`;
  const d = /^entities\.(\d+)\./.exec(i);
  return d && n.section_id ? `outline:${n.section_id}:${d[1]}` : null;
}
function bt({
  scope: t,
  target: r,
  revision: n,
  enabled: c = r !== null,
  forceFollow: i = !1
}) {
  const o = O(null), v = O(null), s = O({ scope: "", following: !0 }), [d, g] = B({ scope: "", following: !0 }), _ = te((y) => {
    s.current.following !== y && (s.current = { ...s.current, following: y }, g(s.current));
  }, []), k = te(() => {
    i || _(!1);
  }, [i, _]), f = O(r), p = O(null), b = c;
  return Le(() => {
    f.current = r, p.current?.();
  }, [r, n]), Le(() => {
    if (s.current.scope !== t && (s.current = { scope: t, following: !0 }, g(s.current)), !b) return;
    i && _(!0);
    const y = o.current, N = v.current;
    if (!y || !N) return;
    let l = null, u = "", E = "", x = "", m = null, h = 0, R = 0, A = null;
    const $ = () => {
      if (i) return y;
      let P = y;
      for (; P && !/auto|scroll/.test(getComputedStyle(P).overflowY); )
        P = P.parentElement;
      return P;
    }, L = () => {
      const P = f.current;
      return P === null ? null : N.querySelector(
        `[data-writing-stream-target="${CSS.escape(P)}"]`
      );
    }, q = () => {
      const P = L();
      return !P || !l ? null : Math.max(
        0,
        Math.min(
          l.scrollHeight - l.clientHeight,
          l.scrollTop + P.getBoundingClientRect().bottom - l.getBoundingClientRect().top - l.clientTop - l.clientHeight + 20
        )
      );
    }, T = () => {
      m === null && (m = requestAnimationFrame(() => {
        if (m = null, X(), !l || !i && !s.current.following) return;
        const P = q();
        P !== null && (l.scrollTop = P, h = l.scrollTop, R = l.scrollHeight);
      }));
    }, F = () => {
      _(!1);
    }, K = () => {
      if (!l) return;
      const P = q();
      (P !== null && Math.abs(l.scrollTop - P) <= 2 || l.scrollHeight - l.clientHeight - l.scrollTop <= 2) && (_(!0), T());
    }, j = () => {
      if (l !== $()) {
        X();
        return;
      }
      if (!l) return;
      if (i) {
        T();
        return;
      }
      const P = l.scrollTop, ae = l.scrollHeight, fe = ae < R && P < h && Math.abs(P - Math.max(0, ae - l.clientHeight)) <= 2;
      P < h && !fe ? F() : P > h && K(), fe && s.current.following && T(), h = P, R = ae;
    }, ne = (P) => {
      if (i) {
        P.ctrlKey || P.preventDefault();
        return;
      }
      P.deltaY < 0 ? F() : P.deltaY > 0 && K();
    }, ie = (P) => {
      A = P.touches[0]?.clientY ?? null;
    }, Y = (P) => {
      if (i) {
        P.preventDefault();
        return;
      }
      const ae = P.touches[0]?.clientY;
      ae !== void 0 && A !== null && ae > A ? F() : ae !== void 0 && A !== null && ae < A && K(), A = ae ?? null;
    }, ce = (P) => {
      if (i) {
        !(P.target instanceof Element && P.target.closest("input, textarea, select, [contenteditable=true]")) && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(P.key) && P.preventDefault();
        return;
      }
      ["ArrowUp", "PageUp", "Home"].includes(P.key) || P.key === " " && P.shiftKey ? F() : ["ArrowDown", "PageDown", "End", " "].includes(P.key) && K();
    }, re = () => {
      l && (l.removeEventListener("scroll", j), l.removeEventListener("wheel", ne), l.removeEventListener("touchstart", ie), l.removeEventListener("touchmove", Y), l.removeEventListener("keydown", ce), l.style.overflowAnchor = u, i && (l.style.overflowY = E, l.style.scrollbarGutter = x), l !== y && ee.unobserve(l));
    }, X = () => {
      const P = $();
      P !== l && (re(), l = P, l && (h = l.scrollTop, R = l.scrollHeight, u = l.style.overflowAnchor, l.style.overflowAnchor = "none", i && (E = l.style.overflowY, x = l.style.scrollbarGutter, l.style.scrollbarGutter = "stable", l.style.overflowY = "hidden"), l.addEventListener("scroll", j, { passive: !0 }), l.addEventListener("wheel", ne, { passive: !i }), l.addEventListener("touchstart", ie, { passive: !0 }), l.addEventListener("touchmove", Y, { passive: !i }), l.addEventListener("keydown", ce), ee.observe(l)));
    }, ee = new ResizeObserver(T);
    return ee.observe(N), ee.observe(y), X(), p.current = () => {
      const P = l;
      X(), l && l === P && !s.current.following && (l.scrollTop = h), l && (h = l.scrollTop), T();
    }, T(), () => {
      p.current = null, re(), ee.disconnect(), m !== null && cancelAnimationFrame(m);
    };
  }, [t, b, i, _]), { viewportRef: o, contentRef: v, following: i || d.scope !== t || d.following, pauseFollowing: k };
}
const ui = [];
function Ni(t) {
  const r = qn(t), {
    snapshot: n,
    viewSnapshot: c,
    document: i,
    historical: o,
    generationTiming: v,
    selection: s,
    draft: d,
    loading: g,
    busy: _,
    error: k,
    conflicted: f,
    reload: p,
    action: b,
    stop: y,
    openSelection: N,
    addEntry: l
  } = r, u = Hn(r), E = Un(
    t.projectId,
    n?.work_asset_id || 0,
    n?.work_version_id || 0
  ), [x, m] = B(null), h = O(null), [R, A] = B(null), [$, L] = B(!1), [q, T] = B(!1), [F, K] = B(null), [j, ne] = B(null), [ie, Y] = B(!1), [ce, re] = B(!1), X = O(!1), ee = O(!1), P = O(!1), [ae, fe] = B(!1), [we, W] = B(""), se = Xe, J = n?.document.status === "running" || !!t.running, Z = d.status === "saving", de = !!(t.readonly || o || J || _ || g), pe = !!(q || F || j || ie || $), ge = s?.kind === "unit" && s.tab === "plan", H = s?.kind === "entity" || ge || !!R, ue = pe || ce || H, { cancelBodyFollow: $e } = r;
  Le(() => {
    ue && $e();
  }, [ue, $e]);
  const he = de || pe, oe = c?.document, be = o ? void 0 : vn(n), w = he || f || ue ? "当前状态不能调整章节顺序" : u.pending ? "请先应用或丢弃修改建议" : d.hasPendingChanges || Z ? "请先保存当前修改" : "", S = oi({
    disabled: !!w,
    reason: w,
    getDocument: () => r.getSnapshot()?.document,
    flush: d.flush,
    onSave: (C) => b("save_document", { document: C })
  }), I = ue || _ || g || Z || u.pending || S.pending, z = x?.selection || s, D = z?.kind === "unit" || z?.kind === "section" && z.id === "chapters", Q = s?.kind === "unit" && i ? Ce(i.units).byId.get(s.id)?.unit : void 0, U = s?.kind === "entity", V = i && j ? i.units.find((C) => C.id === j) : void 0, { flush: G } = d, { onClose: ye } = t, Qe = te(async () => {
    if (!(ue || _ || g || S.pending || X.current)) {
      X.current = !0;
      try {
        await G() && ye();
      } finally {
        X.current = !1;
      }
    }
  }, [ue, _, g, S.pending, G, ye]);
  ke(() => {
    if (!d.hasPendingChanges && !F) return;
    const C = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [F, d.hasPendingChanges]);
  const Ze = async (C) => {
    if (ee.current) return !1;
    ee.current = !0;
    try {
      const M = ot();
      M && m(M);
      const me = await N(C);
      return me || m(null), me;
    } finally {
      ee.current = !1;
    }
  }, ze = async (C) => {
    if (I || !oe || xe(oe, C))
      return;
    await (C.kind === "entity" || C.kind === "unit" && C.tab === "plan" ? Ze(C) : N(C)) && u.discard();
  }, et = async (C) => {
    I || await r.selectVersion(C) && u.discard();
  }, tt = async (C) => {
    !he && !I && await d.flush() && (u.discard(), K(C));
  }, Lt = async () => {
    if (!(!j || de || f || u.pending || P.current)) {
      P.current = !0, fe(!0), W("");
      try {
        if (!await d.flush()) return;
        const C = r.getSnapshot()?.document;
        if (!C || !C.units.some((M) => M.id === j))
          return;
        await b("save_document", {
          document: {
            ...C,
            units: C.units.filter((M) => M.id !== j)
          }
        }) ? (ne(null), u.discard(), await N({ kind: "section", id: "chapters" })) : W("删除未成功，章节和原内容已保留，请重试。");
      } finally {
        P.current = !1, fe(!1);
      }
    }
  }, nt = async () => {
    if (_ || g || u.pending || !await d.flush()) return;
    const C = x;
    await N(C?.selection || { kind: "section", id: "overview" }) && (h.current = C?.top ?? null, m(null), A(null), u.discard());
  }, Ot = async () => {
    if (!i || s?.kind !== "entity" || he || u.pending || !await d.flush()) return;
    const C = r.getSnapshot()?.document;
    if (!C) return;
    const M = {
      ...C.outline,
      [s.section]: C.outline[s.section].filter(
        (me) => me.id !== s.id
      )
    };
    await b("save_document", { document: { ...C, outline: M } }) && (u.discard(), await N(x?.selection || { kind: "section", id: "overview" }, !1) && (h.current = x?.top ?? null, m(null)));
  }, zt = async (C) => {
    if (de || f || u.pending || !await d.flush())
      return !1;
    const M = r.getSnapshot()?.document;
    return M ? JSON.stringify(M.preferences) === JSON.stringify(C) ? !0 : b("save_document", { document: { ...M, preferences: C } }) : !1;
  }, it = _n(r.preview, n) && J ? r.preview : null, le = !o && !g && !pe && it?.work_asset_id === n?.work_asset_id ? it : null, Be = Ie(() => !i || !J || u.pending || !le ? i : Object.keys(le.fields).some(
    (M) => /^(preferences|inspirations|units|outline|entities)[.[]/.test(
      M
    ) || M === "plan" && le.section_id === "chapter_plan" || M === "content" && !!(le.section_id && Se(le.section_id))
  ) ? Pn(
    i,
    le,
    n?.checkpoint?.action,
    n?.checkpoint?.unit_ids
  ) : i, [
    i,
    J,
    u.pending,
    le,
    n?.checkpoint?.action,
    n?.checkpoint?.unit_ids
  ]), qe = ri(
    Be?.units || ui,
    s
  ), rt = u.run, Ve = le?.fields.body !== void 0 && Q?.id === le.unit_id && !d.draft.unit?.body ? le.fields.body : "", at = `${n?.work_asset_id}:${n?.run_id}:${n?.request_id}`, st = oe && s && !H && !u.pending && !(s.kind === "unit" && s.tab !== "plan" && !Ve) ? ci(
    oe,
    s,
    le,
    n?.checkpoint
  ) : null, ve = bt({
    scope: at,
    target: st,
    revision: le?.fields || n?.checkpoint,
    enabled: J && !o && !g && !ue && !u.pending,
    forceFollow: !!(J && n?.checkpoint?.action === "generate_outline" && !D && !H)
  }), ot = () => s && i ? { selection: s, document: i, top: ve.viewportRef.current?.scrollTop || 0 } : null, Te = bt({
    scope: at,
    target: le && u.pending && le.fields.replacement !== void 0 && u.preview === le.fields.replacement ? "proposal" : null,
    revision: u.preview
  });
  Le(() => {
    if (H || h.current === null) return;
    const C = ve.viewportRef.current;
    C && (C.scrollTop = h.current), h.current = null;
  }, [H, x, s, ve.viewportRef]);
  const lt = /* @__PURE__ */ e(
    ei,
    {
      inline: !0,
      snapshot: n,
      preview: le,
      generationTiming: v,
      running: J,
      busy: _ || Z || g || S.pending,
      readonly: !!(t.readonly || o),
      error: k || u.error || (i ? "" : t.node.runError) || "",
      conflicted: f,
      reloadDisabled: !!(ue || _ || g || Z || d.hasPendingChanges),
      onReload: p,
      onRetry: async () => {
        const C = Bt(r.getSnapshot());
        if (C)
          if (C.action === "propose_edit") {
            const M = An(C.extra);
            await N(M) && await u.retry(C.extra, M);
          } else await rt(C.action, C.extra);
      },
      onStop: y
    }
  ), ct = (C, M) => C && i && oe && /* @__PURE__ */ e(
    Xn,
    {
      document: M ? i : x?.document || i,
      savedDocument: oe,
      directory: qe,
      activeBatchIds: n?.checkpoint?.action === "generate_units" ? n.checkpoint.unit_ids : void 0,
      onConfirmationChange: re,
      selection: C,
      disabled: !M || he || f || S.pending,
      body: d.draft.unit?.body,
      selectedCharacters: M && u.textSelection?.text.length || 0,
      onClearSelection: u.clearSelection,
      onAction: rt,
      proposalPending: M && u.pending,
      proposalReady: M && u.ready,
      proposalPreview: M ? u.preview : "",
      running: J,
      onApply: () => {
        u.apply();
      },
      onDiscard: u.discard
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}`
  ), dt = (C, M) => C && Be && oe && /* @__PURE__ */ e(
    Yn,
    {
      document: M ? Be : x?.document || Be,
      recoverableDraft: !o && !J && C.kind === "unit" && n?.checkpoint?.draft?.unit_id === C.id ? n.checkpoint.draft.body : void 0,
      savedDocument: oe,
      selection: C,
      value: Ve && d.draft.unit ? {
        ...d.draft,
        unit: { ...d.draft.unit, body: Ve }
      } : d.draft,
      readonly: he || S.pending || !M,
      onChange: d.setDraft,
      onSelect: (me) => {
        ze(me);
      },
      chapterOrder: S,
      directory: qe,
      navigationDisabled: I,
      onDeleteChapter: (me) => {
        !w && !S.pending && (W(""), ne(me));
      },
      scoped: M && H,
      onTextSelectionChange: M ? u.onTextSelectionChange : void 0,
      selectionActionsRef: M ? u.selectionActionsRef : void 0
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}:${o ? c?.work_version_id : "current"}`
  ), qt = dt(s, !0), Vt = dt(z, !H), Ht = /* @__PURE__ */ a(Ne, { children: [
    /* @__PURE__ */ a(
      "section",
      {
        className: "writing-editor nodrag nopan nowheel is-detail",
        "aria-label": `${se.title}编辑器`,
        children: [
          o && /* @__PURE__ */ a("div", { className: "writing-history-bar", children: [
            /* @__PURE__ */ e("span", { children: "正在查看历史版本，内容只读。" }),
            /* @__PURE__ */ e(
              "button",
              {
                disabled: _ || g,
                onClick: () => {
                  et(n.work_version_id);
                },
                children: "返回当前版本"
              }
            ),
            /* @__PURE__ */ e(
              "button",
              {
                disabled: t.readonly || J || _ || g,
                onClick: async () => {
                  await b("restore_document", {
                    source_work_version_id: c.work_version_id
                  }) && u.discard();
                },
                children: "恢复此版本"
              }
            ),
            k && /* @__PURE__ */ e("span", { role: "alert", children: k })
          ] }),
          !i || !oe || !Bn(oe) ? /* @__PURE__ */ e("div", { className: "writing-empty", children: "请先在画布选用一个灵感，再进入创作工作区。" }) : /* @__PURE__ */ e(Ne, { children: /* @__PURE__ */ a("div", { className: "writing-layout", children: [
            /* @__PURE__ */ e(
              ti,
              {
                document: oe,
                selection: z,
                disabled: I,
                mutationDisabled: he || U || S.pending,
                onSelect: (C) => {
                  ze(C);
                },
                onAdd: (C) => {
                  tt(C);
                },
                chapterOrder: S,
                directory: qe
              }
            ),
            /* @__PURE__ */ e("div", { className: "writing-workspace-content", children: /* @__PURE__ */ a("div", { className: "writing-chapter-layout", children: [
              D ? /* @__PURE__ */ e("main", { className: "writing-main", children: /* @__PURE__ */ e(
                "div",
                {
                  className: "writing-content-scroll",
                  ref: ve.viewportRef,
                  children: /* @__PURE__ */ e(
                    "div",
                    {
                      className: "writing-page",
                      ref: ve.contentRef,
                      children: Vt
                    }
                  )
                }
              ) }) : /* @__PURE__ */ e("main", { className: "writing-main", children: /* @__PURE__ */ e("div", { className: "writing-content-scroll", ref: ve.viewportRef, children: /* @__PURE__ */ e("div", { ref: ve.contentRef, children: /* @__PURE__ */ e(
                Jn,
                {
                  document: x?.document || Be,
                  readonly: he || f || S.pending || !!u.pending,
                  navigationDisabled: I,
                  onSelect: (C) => {
                    ze(C);
                  },
                  onAdd: (C) => {
                    tt(C);
                  },
                  onPreferences: () => Y(!0),
                  onEditSection: async (C) => {
                    await Ze({ kind: "section", id: C }) && (u.discard(), A(C));
                  },
                  chapterOrder: S,
                  chapterRecovery: be && n && /* @__PURE__ */ e(
                    Fn,
                    {
                      draft: be,
                      snapshot: n,
                      disabled: de || f || !!u.pending || S.pending,
                      open: $,
                      onOpen: () => L(!0),
                      onClose: () => L(!1),
                      onSave: async (C) => {
                        let M;
                        if (!await b(
                          "apply_chapter_draft",
                          {
                            units: C,
                            source_run_id: be.run_id,
                            source_request_id: be.request_id
                          },
                          void 0,
                          (We) => {
                            M = We;
                          }
                        ))
                          throw M || new Error("保存未成功，草稿已保留");
                        L(!1);
                      }
                    },
                    `${be.run_id}:${be.request_id}`
                  ),
                  activeUnitId: J ? n?.checkpoint?.unit_id : void 0,
                  streamTarget: st,
                  generatingBackground: !!(J && !o && !H && n?.checkpoint?.action === "generate_outline" && n.checkpoint.phase === "background"),
                  following: ve.following,
                  onReadPage: ve.pauseFollowing
                }
              ) }) }) }),
              /* @__PURE__ */ e(
                "aside",
                {
                  className: "writing-ai-rail",
                  "aria-label": "创作助手",
                  ref: H ? void 0 : Te.viewportRef,
                  inert: H,
                  "aria-hidden": H || void 0,
                  children: /* @__PURE__ */ e("div", { ref: H ? void 0 : Te.contentRef, children: ct(z, !H) })
                }
              )
            ] }) })
          ] }) })
        ]
      }
    ),
    ie && i && /* @__PURE__ */ e(
      Kn,
      {
        preferences: i.preferences,
        disabled: de || f || u.pending || S.pending,
        onSave: zt,
        onClose: () => Y(!1)
      }
    ),
    H && s && i && /* @__PURE__ */ a(
      Re,
      {
        title: ge ? "修改本章剧情" : Rt(i, s),
        titleStatus: o ? void 0 : lt,
        className: "writing-outline-entity-dialog",
        closeDisabled: _ || g || Z || u.pending,
        onClose: nt,
        children: [
          /* @__PURE__ */ a("div", { className: "writing-entity-dialog-layout", children: [
            /* @__PURE__ */ e("div", { className: "writing-dialog-scroll", children: qt }),
            /* @__PURE__ */ e(
              "aside",
              {
                className: "writing-ai-rail",
                "aria-label": "创作助手",
                ref: Te.viewportRef,
                children: /* @__PURE__ */ e("div", { ref: Te.contentRef, children: ct(s, !0) })
              }
            )
          ] }),
          /* @__PURE__ */ a("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            U && /* @__PURE__ */ a("button", { className: "is-danger", disabled: he || u.pending, onClick: () => {
              Ot();
            }, children: [
              /* @__PURE__ */ e(vt, { size: 14 }),
              "删除"
            ] }),
            /* @__PURE__ */ e(
              "button",
              {
                className: "is-primary",
                disabled: _ || g || Z || u.pending,
                onClick: () => {
                  nt();
                },
                children: t.readonly || o ? "返回大纲" : "保存并返回"
              }
            )
          ] })
        ]
      }
    ),
    q && n && /* @__PURE__ */ e(
      ii,
      {
        projectId: t.projectId,
        canvasId: t.canvasId,
        workAssetId: n.work_asset_id,
        activeRunId: n.run_id,
        busy: _,
        readonly: !!(t.readonly || o),
        commandError: k,
        onStop: y,
        onClose: () => T(!1)
      }
    ),
    F && i && /* @__PURE__ */ e(
      Gn,
      {
        document: i,
        selection: F,
        disabled: de,
        closeDisabled: _ || Z,
        onClose: () => K(null),
        onSave: async (C) => {
          const M = ot(), me = F.kind === "section" && F.id !== "chapters";
          me && M && m(M);
          const We = await l(F, C);
          return We ? K(null) : me && m(null), We;
        }
      }
    ),
    V && /* @__PURE__ */ e(
      It,
      {
        title: "删除章节",
        description: `删除「${V.title}」及当前正文？历史版本仍可查看。`,
        confirmLabel: "确认删除",
        pending: ae,
        disabled: de || f || u.pending,
        error: we,
        onClose: () => {
          P.current || ne(null);
        },
        onConfirm: Lt
      }
    )
  ] });
  return /* @__PURE__ */ e(
    nn,
    {
      ariaLabel: `${t.node.title || "节点"}详情`,
      onRequestClose: Qe,
      header: /* @__PURE__ */ e(
        Wn,
        {
          editor: r,
          titleStatus: !o && !H ? lt : void 0,
          versions: E,
          node: t.node,
          navigationDisabled: I,
          mutationDisabled: he || U || S.pending,
          previewReadonly: !!(t.readonly || o),
          onClose: () => {
            Qe();
          },
          onRuns: () => T(!0),
          onSelectVersion: et
        }
      ),
      children: Ht
    }
  );
}
export {
  Ni as WritingEditor
};
