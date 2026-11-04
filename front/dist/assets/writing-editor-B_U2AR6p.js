import { j as t, a as s, F as Ne } from "./preloadable-BrN58FXf.js";
import { a as B, b as O, h as te, d as ke, u as Ie, l as Le } from "./file-kind-BSFhe2vU.js";
import { w as Ut, e as Ft, af as Jt, P as je, aH as yt, G as Kt, q as We, h as vt, A as Gt, t as De, R as Yt, r as jt, z as Qt, H as Xt, y as Zt, aA as en } from "./vendor-icons-UGaOWWu-.js";
import { e as tn, d as _t, g as nn } from "./asset-preview-D6nljO8_.js";
import { N as rn, l as sn } from "./node-detail-header-CD6P0SMz.js";
import { a as Qe, w as ut, d as Ce, p as an, e as Ae, f as He, g as on, i as ln, j as Oe, k as cn, l as kt, u as Je, m as Se, n as Ee, o as Ke, q as Nt, s as dn, r as Ct, t as St, v as $t, x as Et, y as xt, z as Rt, A as un, B as gn, C as hn, D as gt, E as fn, F as pn, G as mn, H as Pe, I as wn, J as bn, K as yn, L as vn, M as _n } from "./writing-document-YwPtpDvk.js";
import { u as Pt } from "./text-content-save-actions-DF1L6Tn3.js";
import { e as ht, m as xe, o as _e, h as kn, q as Nn, w as Bt, c as Cn, t as Sn } from "./space-optional-components-C8EUHVoE.js";
import { u as $n, s as Ue, w as En, g as Ge, h as xn, i as Rn, j as Pn, p as Bn } from "./writing-run-labels--5SZkRES.js";
import { A as At } from "./asset-text-content-editor-DHhQX3TO.js";
import { WritingDialog as Re, WritingConfirmDialog as It } from "./writing-dialog-jA3DrOYu.js";
import { B as ft } from "./content-view-0gIO2Kkv.js";
import { n as An, i as In } from "./interaction-D6_wMtPr.js";
import { m as Tn } from "./space-ordered-list-OcbtLT72.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-editor-DlEoj8as.css", import.meta.url).href]);
function Mn({
  editor: e,
  titleStatus: r,
  versions: n,
  node: c,
  mutationDisabled: i,
  navigationDisabled: o,
  previewReadonly: v,
  onClose: a,
  onRuns: d,
  onSelectVersion: g
}) {
  const { snapshot: _, viewSnapshot: k, document: f, draft: p, conflicted: b } = e, y = Qe, N = f ? f.units : [], l = p.status === "saving", u = n.versions.find(
    (E) => E.id === k?.work_version_id
  );
  return /* @__PURE__ */ t(
    rn,
    {
      node: f && c.titleMode === "auto" ? { ...c, title: f.title } : c,
      titleStatus: r,
      contentLabel: f ? N.length ? `${N.filter((E) => E.has_body).length}/${N.length} ${y.unit}正文` : ut(f) === "inspiration" ? "选择灵感" : ut(f) === "outline" ? "大纲" : "剧情规划" : y.title,
      updatedAt: _t(
        k?.work_updated_at || u?.updated_at || u?.created_at || c.asset?.version?.updated_at
      ),
      status: p.status,
      readonly: v,
      onRetry: () => {
        !i && !l && !b && p.retry();
      },
      onClose: a,
      versionSelect: _ && /* @__PURE__ */ t(
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
      actions: f && /* @__PURE__ */ s(Ne, { children: [
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "保存为新版本",
            disabled: i || l || b,
            onClick: () => {
              e.action("create_version");
            },
            children: [
              /* @__PURE__ */ t(Ut, { size: 14 }),
              /* @__PURE__ */ t("span", { children: "保存为新版本" })
            ]
          }
        ),
        /* @__PURE__ */ s(
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
              /* @__PURE__ */ t(Ft, { size: 14 }),
              /* @__PURE__ */ t("span", { children: p.status === "error" ? "重试保存" : "保存" })
            ]
          }
        ),
        /* @__PURE__ */ s(
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
              /* @__PURE__ */ t(Jt, { size: 14 }),
              /* @__PURE__ */ t("span", { children: "运行记录" })
            ]
          }
        )
      ] })
    }
  );
}
const pt = /* @__PURE__ */ new WeakMap();
function Ye(e) {
  if (!e) return "null";
  let r = pt.get(e);
  return r === void 0 && (r = JSON.stringify(e), pt.set(e, r)), r;
}
function Wn(e) {
  return `${Ye(e.document)}
${JSON.stringify(e.unit)}`;
}
function Dn(e = 20) {
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
      r.delete(n), r.set(n, c), r.size > e && r.delete(r.keys().next().value);
    }
  };
}
function Ln(e, r, n) {
  const c = (o) => [
    o.outline.characters,
    o.outline.locations,
    o.outline.props,
    o.units
  ], i = c(r);
  c(e).forEach((o, v) => {
    o.forEach((a, d) => {
      a.id.startsWith("new:") && n.set(`${v}:${a.id}`, i[v][d].id);
    });
  });
}
function On(e, r) {
  if (!r.size) return e;
  const n = (c, i) => c.map((o) => ({
    ...o,
    id: r.get(`${i}:${o.id}`) || o.id
  }));
  return {
    ...e,
    outline: {
      ...e.outline,
      characters: n(e.outline.characters, 0),
      locations: n(e.outline.locations, 1),
      props: n(e.outline.props, 2)
    },
    units: n(e.units, 3)
  };
}
function mt(e, r) {
  const n = e.checkpoint;
  if (e.document.status !== "running" || e.work_asset_id !== r.workAssetId || e.run_id !== r.runId || e.request_id !== r.requestId || n?.action !== "generate_units" || n.unit_ids.length !== r.unitIds.length || !n.unit_ids.every((i, o) => i === r.unitIds[o]))
    return;
  if (n.phase !== "body") return "";
  const c = r.unitIds[n.completed];
  return c && (!n.unit_id || n.unit_id === c) ? c : "";
}
const zn = { document: null, unit: null };
function qn({
  projectId: e,
  canvasId: r,
  node: n,
  output: c,
  onAssetUpdated: i,
  readonly: o = !1,
  running: v = !1
}) {
  const {
    snapshot: a,
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
  } = $n({ projectId: e, canvasId: r, node: n, output: c, onAssetUpdated: i }), [w, h] = B(null), R = O(w), A = w || a, [$, L] = B(null), q = O($), [T, F] = B(0), [K, j] = B(!1), [ne, ie] = B(!1), G = O(!1), ce = O({ readonly: o, running: v });
  ce.current = { readonly: o, running: v };
  const re = O(0), Q = O(null), ee = O(0), P = te(() => {
    Q.current = null, ee.current += 1;
  }, []), se = O(Dn()), fe = O({
    workAssetId: 0,
    ids: /* @__PURE__ */ new Map()
  }), we = O(null);
  ke(
    () => () => {
      re.current += 1, Q.current = null, we.current = null;
    },
    []
  );
  const M = te(() => {
    if (ce.current.readonly || R.current)
      throw new Error("当前作品只读，未保存内容已保留");
    if (ce.current.running || d.current?.document.status === "running")
      throw new Error("生成期间暂不可修改作品，请先停止生成");
  }, []), ae = te(
    async (m) => {
      const S = q.current;
      if (!S) throw new Error("请等待内容加载完成");
      let I = S.workVersion, z = S.workRevision, D = S.unitVersion;
      const X = (U, V) => {
        _(U), I = U.work_version_id, z = U.work_revision, D = m.unit && U.document.units.find(
          (Y) => Y.id === m.unit.unit_id
        )?.version_id || 0, q.current = {
          ...S,
          selection: q.current?.selection || S.selection,
          workVersion: I,
          workRevision: z,
          unitVersion: D,
          value: V
        };
      };
      if (m.document && Ye(m.document) !== Ye(S.value.document)) {
        M();
        const U = d.current.work_asset_id;
        fe.current.workAssetId !== U && (fe.current = { workAssetId: U, ids: /* @__PURE__ */ new Map() });
        const V = fe.current, Y = On(
          m.document,
          V.ids
        ), ye = await Ue(
          f(
            "save_document",
            { document: Y, expected_work_revision: z },
            I
          )
        );
        Ln(
          Y,
          ye.document,
          V.ids
        ), X(ye, { ...S.value, document: m.document });
      }
      if (m.unit && m.unit.body !== S.value.unit?.body) {
        M();
        const U = await Ue(
          f(
            "save_unit",
            {
              unit_id: m.unit.unit_id,
              expected_unit_version_id: D,
              expected_work_revision: z,
              body: m.unit.body
            },
            I
          )
        );
        X(U, m);
        const V = U.document.units.find(
          (Y) => Y.id === m.unit.unit_id
        );
        V?.version_id && se.current.delete(V.version_id);
      }
      y("");
    },
    [_, M, f, d]
  ), J = Pt({
    value: $?.value || zn,
    resetKey: `${n.id}:${T}`,
    fingerprint: Wn,
    save: ae,
    onError: b,
    autoSave: !!($ && !w && !o && !v && a?.document.status !== "running" && !ne && !K),
    debounceMs: 1200
  }), Z = O(J);
  Z.current = J;
  const de = te(
    async (m, S) => {
      let I = null, z = 0;
      if (S.kind === "unit") {
        const D = Ce(m.document.units).byId.get(
          S.id
        )?.unit;
        if (!D) throw new Error("该章节已移出目录，请重新选择");
        if (z = D.version_id, D.asset_id && D.version_id) {
          if (I = se.current.get(D.version_id) || null, !I) {
            const X = await ht({
              projectId: e,
              assetId: D.asset_id,
              versionId: D.version_id,
              reportError: !1
            });
            if (I = an(X.content), !I || I.unit_id !== D.id || I.profile !== m.document.type)
              throw new Error("章节内容与目录不一致");
            se.current.set(D.version_id, I);
          }
        } else
          I = {
            type: "writing_unit",
            schema_version: 1,
            profile: m.document.type,
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
        workVersion: m.work_version_id,
        workRevision: m.work_revision,
        unitVersion: z,
        value: { document: m.document, unit: I }
      };
    },
    [e]
  ), pe = te(
    (m) => {
      q.current = m, L(m), F((S) => S + 1), y("");
    },
    [y]
  ), ge = te(
    async (m, S = !0, I) => {
      if (S && P(), S && (G.current || !await Z.current.flush()))
        return !1;
      const z = R.current || d.current;
      if (!z || xe(z.document, m))
        return !1;
      const D = ++re.current;
      j(!0);
      try {
        const X = await de(z, m);
        return !g.current || D !== re.current || I && !I() ? !1 : (pe(X), !0);
      } catch (X) {
        return g.current && D === re.current && (!I || I()) && b(X), !1;
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
    const m = Q.current, S = a && m ? mt(a, m) : void 0;
    if (m && S === void 0 && (Q.current = null), w || !a || K || J.hasPendingChanges || G.current)
      return;
    const I = S ? { kind: "unit", id: S, tab: "body" } : $?.selection || Ae(a.document), z = JSON.stringify(I);
    if ($ && $.workVersion === a.work_version_id && $.workRevision === a.work_revision && JSON.stringify($.selection) === z || we.current?.version === a.work_version_id && we.current.revision === a.work_revision && we.current.selection === z)
      return;
    we.current = {
      version: a.work_version_id,
      revision: a.work_revision,
      selection: z
    };
    const D = He(a.document, I) && !xe(a.document, I), X = ee.current;
    ge(
      D ? I : Ae(a.document),
      !1,
      () => {
        const U = d.current;
        return ee.current === X && !R.current && !Z.current.hasPendingChanges && !!(U && U.work_version_id === a.work_version_id && U.work_revision === a.work_revision && (!m || Q.current === m && mt(U, m) === S));
      }
    );
  }, [
    $,
    w,
    J.hasPendingChanges,
    K,
    ge,
    a,
    d,
    ne
  ]);
  const H = te(
    async (m, S = {}, I, z) => {
      if (G.current || ce.current.readonly) return !1;
      G.current = !0, ie(!0);
      try {
        if (!await Z.current.flush()) return !1;
        if (m === "restore_document") {
          if (ce.current.readonly || ce.current.running || d.current?.document.status === "running")
            throw new Error("当前不可恢复版本");
        } else M();
        const D = _e(
          d.current.document,
          m,
          S
        );
        if (D) throw new Error(D);
        if (m === "propose_edit" && I && (!q.current || !I(q.current)))
          return !1;
        E(), x();
        const X = ee.current, U = S.unit_id ? d.current.document.units.find(
          (Y) => Y.id === S.unit_id
        ) : void 0, V = await Ue(
          f(m, {
            ...U && S.section_id !== "chapter_plan" ? { expected_unit_version_id: U.version_id } : {},
            ...S
          })
        );
        return _(V), (m === "generate_units" || m === "retry_generation") && X === ee.current && V.document.status === "running" && V.checkpoint?.action === "generate_units" && V.run_id && V.request_id && V.checkpoint.unit_ids.length && (Q.current = {
          workAssetId: V.work_asset_id,
          runId: V.run_id,
          requestId: V.request_id,
          unitIds: [...V.checkpoint.unit_ids]
        }), m === "restore_document" && (R.current = null, h(null)), y(""), !0;
      } catch (D) {
        return b(D), z?.(D), !1;
      } finally {
        G.current = !1, g.current && ie(!1);
      }
    },
    [
      _,
      M,
      x,
      E,
      f,
      b
    ]
  ), ue = te(async () => {
    P();
    const m = d.current;
    if (!(!m?.run_id || m.document.status !== "running" || G.current || ce.current.readonly)) {
      G.current = !0, ie(!0);
      try {
        await p(), y("");
      } catch (S) {
        b(S);
      } finally {
        G.current = !1, g.current && ie(!1);
      }
    }
  }, [P, p, b]), $e = te(async () => {
    if (!(G.current || Z.current.status === "saving")) {
      G.current = !0, ie(!0);
      try {
        await k();
        const m = q.current?.selection, S = m && d.current && He(d.current.document, m);
        await ge(
          S && m ? m : Ae(d.current.document),
          !1
        );
      } catch (m) {
        b(m);
      } finally {
        G.current = !1, g.current && ie(!1);
      }
    }
  }, [k, ge, b]), he = te(
    async (m) => {
      if (P(), G.current) return !1;
      G.current = !0, ie(!0);
      let S = 0;
      try {
        if (!await Z.current.flush()) return !1;
        const I = d.current;
        if (!I || !g.current) return !1;
        S = ++re.current, j(!0);
        let z = null;
        if (m !== I.work_version_id) {
          const Y = await ht({
            projectId: e,
            assetId: I.work_asset_id,
            versionId: m,
            reportError: !1
          });
          if (!g.current || S !== re.current)
            return !1;
          const ye = on(Y.content);
          if (!ye || ye.type !== I.document.type)
            throw new Error("历史版本与当前作品不一致");
          z = {
            ...I,
            document: ye,
            work_version_id: Y.id,
            work_revision: ln(Y),
            work_version: Y.version,
            work_updated_at: Y.updated_at || Y.created_at,
            proposal: void 0
          };
        }
        const D = z || I, X = q.current?.selection || Ae(D.document), U = He(D.document, X) && !xe(D.document, X), V = await de(
          D,
          U ? X : Ae(D.document)
        );
        return !g.current || S !== re.current ? !1 : (R.current = z, h(z), pe(V), !0);
      } catch (I) {
        return g.current && (!S || S === re.current) && b(I), !1;
      } finally {
        G.current = !1, g.current && (S && S === re.current && j(!1), ie(!1));
      }
    },
    [
      pe,
      P,
      g,
      e,
      de,
      b,
      d
    ]
  ), oe = te(
    async (m, S) => {
      if (G.current) return !1;
      const I = Z.current.draft.document;
      if (!I) return !1;
      const z = Oe(m), D = cn(I, m, S);
      let X;
      if (!await H(
        "save_document",
        { document: D },
        void 0,
        (V) => {
          X = V;
        }
      )) {
        if (X) throw X;
        return !1;
      }
      const U = d.current.document;
      if (z) {
        const V = U.outline[z], Y = V[V.length - 1];
        Y && await ge(
          { kind: "entity", section: z, id: Y.id },
          !1
        );
      } else {
        const V = U.units, Y = V?.[V.length - 1];
        Y && await ge(
          { kind: "unit", id: Y.id, tab: "body" },
          !1
        );
      }
      return !0;
    },
    [H, ge]
  ), be = !w && a?.document.status === "running" && !J.hasPendingChanges ? a.document : J.draft.document || A?.document;
  return {
    snapshot: a,
    viewSnapshot: A,
    document: be,
    historical: !!w,
    selectVersion: he,
    preview: u,
    getSnapshot: () => d.current,
    generationTiming: l,
    selection: $?.selection,
    draft: J,
    loading: K,
    busy: ne,
    error: N,
    conflicted: !!(J.hasPendingChanges && !ne && J.status !== "saving" && $ && a && (q.current?.workVersion !== a.work_version_id || q.current.workRevision !== a.work_revision)),
    action: H,
    stop: ue,
    openSelection: ge,
    cancelBodyFollow: P,
    addEntry: oe,
    reload: $e
  };
}
function Fe(e, r) {
  return !r || !e.document ? "" : kt(e.document, r, e.unit?.body);
}
function Vn(e, r, n) {
  const c = e.document;
  return r.kind === "unit" && r.tab === "plan" ? {
    ...e,
    document: {
      ...c,
      units: Je(c.units, r.id, {
        plan: n
      })
    }
  } : r.kind === "unit" && e.unit ? { ...e, unit: { ...e.unit, body: n } } : r.kind === "entity" ? {
    ...e,
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
    ...e,
    document: {
      ...c,
      outline: { ...c.outline, [r.id]: n }
    }
  } : e;
}
function Hn(e) {
  const [r, n] = B(
    null
  ), c = O(null), [i, o] = B(null), v = O(null), [a, d] = B(""), g = O(!1), _ = O(!1), k = te(() => {
    c.current?.clearSelection(), n(null);
  }, []), f = te(() => {
    o(null), d(""), k();
  }, [k]), p = e.snapshot?.proposal, b = !!(i && p && p.run_id === i.runId && e.snapshot?.document.status === "ready"), y = i && e.preview?.run_id === i.runId && e.preview.fields.replacement !== void 0 ? e.preview.fields.replacement : "", N = async (x, w, h, R) => {
    let A;
    if (!await e.action(
      "propose_edit",
      { ...x, ...h ? { selected_text: h.text } : {} },
      (q) => {
        if (JSON.stringify(q.selection) !== JSON.stringify(w))
          return d("编辑目标已变化，请重新选择后生成修改建议。"), !1;
        const T = Fe(q.value, w);
        return h && T !== R ? (d("原文已变化，请重新选择后生成修改建议。"), !1) : (A = {
          selection: w,
          text: T,
          range: h,
          unitVersion: w.kind === "unit" && w.tab !== "plan" ? q.unitVersion : 0
        }, !0);
      }
    ) || !A) return !1;
    const L = { ...A, runId: e.getSnapshot().run_id };
    return v.current = L, o(L), d(""), !0;
  };
  return {
    textSelection: r,
    onTextSelectionChange: n,
    selectionActionsRef: c,
    clearSelection: k,
    discard: f,
    run: async (x, w = {}) => {
      if (g.current) return !1;
      g.current = !0, d("");
      try {
        if (x !== "propose_edit")
          return o(null), k(), e.action(x, w);
        const h = e.selection;
        return h ? await N(
          w,
          h,
          r,
          Fe(e.draft.draft, h)
        ) : !1;
      } finally {
        g.current = !1;
      }
    },
    retry: async (x, w) => {
      if (g.current) return !1;
      const h = v.current, R = h && h.runId === e.getSnapshot()?.run_id ? h.range : null;
      if ((x.selected_text || "") !== (R?.text || ""))
        return d("原选区无法恢复，请重新选择原文后生成修改建议。"), !1;
      g.current = !0;
      try {
        return await N(x, w, R, h?.text);
      } finally {
        g.current = !1;
      }
    },
    apply: async () => {
      if (_.current || !b || !i || !p || e.historical || e.busy || e.loading)
        return;
      const x = e.getSnapshot(), w = JSON.stringify(e.selection) === JSON.stringify(i.selection), h = p.unit_id === (i.selection.kind === "unit" ? i.selection.id : void 0) && p.section_id === (i.selection.kind === "unit" && i.selection.tab === "plan" ? "chapter_plan" : i.selection.kind === "entity" ? i.selection.section : i.selection.kind === "section" ? i.selection.id : void 0) && p.entity_id === (i.selection.kind === "entity" ? i.selection.id : void 0) && p.inspiration_id === void 0 && (p.selected_text || "") === (i.range?.text || "");
      if (!w || !h || x?.work_version_id !== p.work_version_id || x.work_revision !== p.work_revision || x.work_asset_id !== p.work_asset_id || Fe(e.draft.draft, e.selection) !== i.text || i.selection.kind === "unit" && i.selection.tab !== "plan" && p.unit_version_id !== i.unitVersion) {
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
          e.draft.setDraft(
            Vn(
              e.draft.draft,
              i.selection,
              p.replacement
            )
          );
        o(null), k(), await e.draft.flush();
      } finally {
        _.current = !1;
      }
    },
    ready: b,
    pending: !!i,
    preview: b ? p.replacement : y,
    error: a
  };
}
function Un(e, r, n) {
  const [c, i] = B([]), [o, v] = B(0), [a, d] = B(0), [g, _] = B(!1), [k, f] = B(!1), [p, b] = B(!1), [y, N] = B(""), l = O(0), u = O(!1), E = te(
    async (x) => {
      if (!r) return;
      const w = ++l.current;
      u.current = !0, x === 1 ? f(!0) : b(!0), N("");
      try {
        const h = await kn({
          projectId: e,
          assetId: r,
          page: x,
          reportError: !1
        });
        if (w !== l.current) return;
        i(
          (R) => x === 1 ? h.items : [
            ...R,
            ...h.items.filter(
              (A) => !R.some(($) => $.id === A.id)
            )
          ]
        ), v(x), d(h.total), _(h.hasMore);
      } catch (h) {
        w === l.current && N(h instanceof Error ? h.message : "读取版本失败");
      } finally {
        w === l.current && (u.current = !1, f(!1), b(!1));
      }
    },
    [e, r]
  );
  return ke(() => (E(1), () => {
    l.current += 1;
  }), [E, n]), {
    versions: c,
    total: a,
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
  draft: e,
  snapshot: r,
  disabled: n,
  open: c,
  onOpen: i,
  onClose: o,
  onSave: v
}) {
  const [a, d] = B(0), [g, _] = B(""), [k, f] = B(!1), p = O(!1), b = r.checkpoint, y = b.work_asset_id !== r.work_asset_id || b.work_version_id !== r.work_version_id || b.work_revision !== r.work_revision, N = async ($) => {
    await v($);
  }, l = Pt({
    value: e.units,
    resetKey: `${e.run_id}:${e.request_id}`,
    fingerprint: JSON.stringify,
    autoSave: !1,
    save: N,
    onError: ($) => _(
      $ instanceof Error ? $.message : "保存未成功，草稿已保留"
    )
  }), u = l.draft, E = Math.min(a, u.length - 1), x = u[E], w = ($) => l.setDraft(
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
  }, R = u.length === e.expected_count && u.every(($) => $.title.trim() && $.plan.trim()), A = async () => {
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
  return /* @__PURE__ */ s("section", { className: "writing-draft-recovery", "aria-label": "未保存章纲草稿", children: [
    /* @__PURE__ */ s("p", { children: [
      "章纲草稿已保留：",
      e.units.length,
      " 章，本批要求",
      " ",
      e.expected_count,
      " 章",
      e.complete ? "。" : "；生成已中断，仅包含完整收到的章节。"
    ] }),
    /* @__PURE__ */ t("button", { disabled: n && !c, onClick: i, children: "查看并调整草稿" }),
    c && /* @__PURE__ */ s(
      Re,
      {
        title: "调整章纲草稿",
        onClose: o,
        closeDisabled: k,
        className: "writing-chapter-recovery-dialog",
        children: [
          /* @__PURE__ */ s("div", { className: "writing-chapter-recovery-layout", children: [
            /* @__PURE__ */ s(
              "nav",
              {
                className: "writing-chapter-recovery-list",
                "aria-label": "草稿章节",
                children: [
                  u.map(($, L) => /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      "aria-current": L === E ? "true" : void 0,
                      disabled: k,
                      onClick: () => d(L),
                      children: [
                        /* @__PURE__ */ s("small", { children: [
                          "第 ",
                          L + 1,
                          " 章"
                        ] }),
                        /* @__PURE__ */ t("strong", { children: $.title || "未命名章节" })
                      ]
                    },
                    `${L}:${$.id}`
                  )),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      disabled: k || u.length >= e.expected_count,
                      onClick: h,
                      children: b.unit_ids.length ? "补充下一章草稿" : "添加章节"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
              /* @__PURE__ */ s("p", { className: "writing-chapter-recovery-note", children: [
                "当前 ",
                u.length,
                " 章 · 本批需 ",
                e.expected_count,
                " ",
                "章；调整后保存，计划总章数保持不变。"
              ] }),
              y && /* @__PURE__ */ t("p", { role: "alert", children: "作品已有新修改，原草稿可查看，不能覆盖当前内容。" }),
              x && /* @__PURE__ */ s(Ne, { children: [
                /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
                  /* @__PURE__ */ t("span", { className: "writing-sr-only", children: "草稿章节标题" }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      "aria-label": "草稿章节标题",
                      value: x.title,
                      readOnly: k,
                      onChange: ($) => w({ title: $.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ t("div", { className: "writing-body", children: /* @__PURE__ */ t(
                  At,
                  {
                    kind: "richtext",
                    contentFormat: "markdown",
                    value: x.plan,
                    readonly: k,
                    onChange: ($) => w({ plan: $ })
                  }
                ) }),
                !b.unit_ids.length && /* @__PURE__ */ t(
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
              g && /* @__PURE__ */ t("p", { role: "alert", className: "writing-error", children: g })
            ] })
          ] }),
          /* @__PURE__ */ s("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            /* @__PURE__ */ t("button", { disabled: k, onClick: o, children: "返回大纲" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "is-primary",
                disabled: n || k || y || !R,
                onClick: () => {
                  A();
                },
                children: k ? "正在保存…" : `保存本批 ${e.expected_count} 章`
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function Tt(e, r, n) {
  const [c, i] = B(0), o = r && e !== void 0 ? Math.floor(e / Ee) : c;
  return o !== c && i(o), [c, (v) => {
    n?.(), i(v);
  }];
}
function wt({ document: e, section: r, readonly: n, navigationDisabled: c, onSelect: i, onAdd: o, streamTarget: v, following: a = !1, onReadPage: d }) {
  const g = new RegExp(`^outline:${r}:(\\d+)$`).exec(v || ""), [_, k] = Tt(g ? Number(g[1]) : void 0, a, d), f = e.outline[r], p = Math.max(1, Math.ceil(f.length / Ee)), b = Math.min(_, p - 1), y = { characters: "人物", locations: "地点", props: "必要道具" }[r];
  return /* @__PURE__ */ s("section", { className: "story-entities-page", "aria-label": y, "data-writing-stream-target": `outline:${r}`, children: [
    /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
      /* @__PURE__ */ t("h2", { "data-writing-stream-target": r === "characters" ? "phase:characters" : void 0, children: y }),
      /* @__PURE__ */ s("button", { disabled: n || c, onClick: () => o({ kind: "section", id: r }), children: [
        /* @__PURE__ */ t(je, { size: 14 }),
        "添加",
        y
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "story-entity-cards", children: f.slice(b * Ee, (b + 1) * Ee).map((N, l) => /* @__PURE__ */ s(
      "button",
      {
        className: `writing-outline-card story-entity-card${v === `outline:${r}:${b * Ee + l}` ? " is-streaming" : ""}`,
        disabled: c || !N.id || N.id.startsWith("preview:"),
        "data-writing-stream-target": `outline:${r}:${b * Ee + l}`,
        onClick: () => i({ kind: "entity", section: r, id: N.id }),
        children: [
          /* @__PURE__ */ t("span", { className: "writing-card-top", children: /* @__PURE__ */ t("small", { children: y }) }),
          /* @__PURE__ */ t("strong", { className: "writing-card-title", children: N.name || "正在构思…" }),
          /* @__PURE__ */ t("p", { className: "writing-list-preview", children: N.description || "暂无资料" }),
          /* @__PURE__ */ s("span", { className: "writing-entity-footer", children: [
            "查看与编辑",
            /* @__PURE__ */ t(yt, { size: 15 })
          ] })
        ]
      },
      N.id || `preview:${l}`
    )) }),
    !f.length && /* @__PURE__ */ s("p", { className: "story-outline-empty", children: [
      "暂无",
      y
    ] }),
    p > 1 && /* @__PURE__ */ s("div", { className: "story-reading-pagination", children: [
      /* @__PURE__ */ t("button", { disabled: c || !b, onClick: () => k(b - 1), children: "上一页" }),
      /* @__PURE__ */ s("span", { children: [
        b + 1,
        " / ",
        p
      ] }),
      /* @__PURE__ */ t("button", { disabled: c || b + 1 >= p, onClick: () => k(b + 1), children: "下一页" })
    ] })
  ] });
}
function Mt({
  order: e,
  id: r,
  title: n,
  view: c = "reversed"
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "writing-chapter-handle",
      "aria-label": `调整「${n}」顺序`,
      ...e.handleProps(r, c),
      children: /* @__PURE__ */ t(Kt, { size: 14 })
    }
  );
}
function Wt({
  page: e,
  onPage: r,
  onSelect: n,
  readonly: c,
  navigationDisabled: i,
  chapterOrder: o,
  activeUnitId: v,
  activeOrdinal: a
}) {
  return /* @__PURE__ */ s(Ne, { children: [
    /* @__PURE__ */ s("div", { className: "writing-chapter-pagination", "aria-label": "剧情分页", children: [
      /* @__PURE__ */ s("span", { children: [
        Ke(e.rows) || "0 章",
        " / 共 ",
        e.total,
        " 章"
      ] }),
      /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ t(
          "button",
          {
            disabled: i || !e.page,
            onClick: () => r(e.page - 1),
            children: "上一页"
          }
        ),
        /* @__PURE__ */ s("span", { children: [
          e.page + 1,
          " / ",
          e.pages
        ] }),
        /* @__PURE__ */ t(
          "button",
          {
            disabled: i || e.page + 1 >= e.pages,
            onClick: () => r(e.page + 1),
            children: "下一页"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ s("ul", { className: "writing-directory writing-chapter-grid", children: [
      e.rows.map(({ unit: d, label: g, ordinal: _ }) => {
        const k = !d.id || v === d.id || a === _;
        return /* @__PURE__ */ s(
          "li",
          {
            className: `writing-outline-card writing-chapter-card${k ? " is-streaming" : ""}`,
            "data-unit-id": d.id,
            "data-writing-stream-target": `chapter:${_ - 1}`,
            ...o.itemProps(d.id, "canonical"),
            children: [
              /* @__PURE__ */ s("div", { className: "writing-card-top", children: [
                /* @__PURE__ */ s("span", { className: "writing-card-meta", children: [
                  /* @__PURE__ */ t("small", { className: "writing-card-ordinal", children: g }),
                  /* @__PURE__ */ t("small", { className: "writing-card-status", children: k ? "生成中" : Nt(d) })
                ] }),
                /* @__PURE__ */ s("div", { className: "writing-chapter-card-tools", children: [
                  /* @__PURE__ */ t(
                    "button",
                    {
                      "data-writing-drag-ignore": !0,
                      className: "writing-card-edit",
                      "aria-label": `修改剧情：${d.title}`,
                      disabled: c || i || !d.id,
                      onClick: () => n({ kind: "unit", id: d.id, tab: "plan" }),
                      children: /* @__PURE__ */ t(We, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ t(
                    Mt,
                    {
                      order: o,
                      id: d.id,
                      title: d.title,
                      view: "canonical"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  className: "writing-entity-card",
                  disabled: i || !d.id,
                  onClick: () => n({ kind: "unit", id: d.id, tab: "body" }),
                  children: [
                    /* @__PURE__ */ t("strong", { className: "writing-card-title", children: d.title || (d.id ? "未命名章节" : "正在规划…") }),
                    /* @__PURE__ */ t("span", { className: "writing-list-preview", children: d.plan || (d.id ? "暂无剧情" : "正在展开剧情…") }),
                    /* @__PURE__ */ s("span", { className: "writing-entity-footer", children: [
                      d.has_body ? "打开正文" : "进入正文",
                      /* @__PURE__ */ t(yt, { size: 15 })
                    ] })
                  ]
                }
              )
            ]
          },
          d.id || `preview:${_}`
        );
      }),
      !e.total && /* @__PURE__ */ t("li", { className: "writing-material-empty", children: "暂无章节" })
    ] })
  ] });
}
function Jn({
  document: e,
  readonly: r,
  navigationDisabled: n,
  onSelect: c,
  onAdd: i,
  onPreferences: o,
  onEditSection: v,
  chapterOrder: a,
  activeUnitId: d,
  streamTarget: g,
  generatingBackground: _ = !1,
  following: k = !1,
  onReadPage: f,
  chapterRecovery: p
}) {
  const b = dn(e), { preferences: y } = e, N = !_ || !!e.outline.world || g === "outline:world", l = [
    { label: "题材", value: y.genre },
    {
      label: "文风",
      value: Ct.find((w) => w.value === y.style)?.label || (y.style_instructions ? "自定文风" : "")
    },
    {
      label: "叙事视角",
      value: St.find(
        (w) => w.value === y.pov
      )?.label
    },
    {
      label: "写作模式",
      value: $t.find((w) => w.value === y.mode)?.label
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
  return /* @__PURE__ */ s("div", { className: "story-outline-page", children: [
    b && /* @__PURE__ */ s("section", { className: "story-outline-inspiration", "aria-label": "已选灵感", children: [
      /* @__PURE__ */ t("span", { children: "已选灵感" }),
      /* @__PURE__ */ t("h2", { children: b.title }),
      /* @__PURE__ */ t("p", { children: b.content })
    ] }),
    /* @__PURE__ */ s(
      "section",
      {
        className: "story-outline-preferences",
        "aria-label": "写作设定",
        "data-writing-stream-target": "preferences",
        children: [
          /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
            /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:preferences", children: "写作设定" }),
            /* @__PURE__ */ s(
              "button",
              {
                disabled: r || n,
                "aria-label": "修改写作设定",
                onClick: o,
                children: [
                  /* @__PURE__ */ t(We, { size: 13 }),
                  "修改"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ t("dl", { className: "story-preference-fields", children: l.map(({ label: w, value: h }) => /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ t("dt", { children: w }),
            /* @__PURE__ */ t("dd", { className: h ? void 0 : "is-unset", children: h || "待确定" })
          ] }, w)) }),
          y.style_instructions && /* @__PURE__ */ s("div", { className: "story-style-note", children: [
            /* @__PURE__ */ t("span", { children: "文风要求" }),
            /* @__PURE__ */ t("p", { children: y.style_instructions })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s("section", { className: "story-outline-section", "aria-label": "故事总纲", children: [
      /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:direction", children: "故事总纲" }),
        /* @__PURE__ */ s(
          "button",
          {
            disabled: r || n,
            "aria-label": "修改故事总纲",
            onClick: () => v("overview"),
            children: [
              /* @__PURE__ */ t(We, { size: 13 }),
              "修改"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ t(
        "article",
        {
          className: "story-text-card",
          "data-writing-stream-target": "outline:overview",
          children: /* @__PURE__ */ t(
            ft,
            {
              fallback: e.outline.overview || "暂无故事总纲",
              className: "story-outline-prose",
              markdownClassName: "story-outline-markdown"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ t(
      wt,
      {
        document: e,
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
    /* @__PURE__ */ s("section", { className: "story-outline-section", "aria-label": "背景", children: [
      /* @__PURE__ */ t("div", { className: "story-section-heading", children: /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:background", children: "背景" }) }),
      N && /* @__PURE__ */ s(
        "article",
        {
          className: "story-text-card",
          "data-writing-stream-target": "outline:world",
          children: [
            /* @__PURE__ */ t("h3", { children: "环境与规则" }),
            /* @__PURE__ */ t(
              ft,
              {
                fallback: e.outline.world || "暂无背景",
                className: "story-outline-prose",
                markdownClassName: "story-outline-markdown"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                disabled: r || n,
                "aria-label": "修改环境与规则",
                onClick: () => v("world"),
                children: [
                  /* @__PURE__ */ t(We, { size: 13 }),
                  "修改"
                ]
              }
            )
          ]
        }
      ),
      ["locations", "props"].filter(
        (w) => !_ || e.outline[w].length > 0
      ).map((w) => /* @__PURE__ */ t(
        wt,
        {
          document: e,
          section: w,
          readonly: r,
          navigationDisabled: n,
          onSelect: c,
          onAdd: i,
          streamTarget: g,
          following: k,
          onReadPage: f
        },
        w
      ))
    ] }),
    /* @__PURE__ */ s("section", { className: "story-outline-section", "aria-label": "章节剧情", children: [
      /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:chapters", children: "章节剧情" }),
        /* @__PURE__ */ s(
          "button",
          {
            disabled: r || n,
            onClick: () => i({ kind: "section", id: "chapters" }),
            children: [
              /* @__PURE__ */ t(je, { size: 14 }),
              "添加章节"
            ]
          }
        )
      ] }),
      p,
      /* @__PURE__ */ t(
        Wt,
        {
          page: Et(
            Ce(e.units).canonical,
            E
          ),
          onPage: x,
          onSelect: c,
          readonly: r,
          navigationDisabled: n,
          chapterOrder: a,
          activeUnitId: d,
          activeOrdinal: u ? Number(u[1]) + 1 : void 0
        }
      )
    ] })
  ] });
}
function Kn({
  preferences: e,
  disabled: r,
  onSave: n,
  onClose: c
}) {
  const [i, o] = B(() => ({ ...e })), [v, a] = B(!1), [d, g] = B(""), _ = O(!1), k = r || v;
  return /* @__PURE__ */ t(
    Re,
    {
      title: "写作设定",
      className: "writing-preferences-dialog",
      closeDisabled: v,
      onClose: c,
      children: /* @__PURE__ */ s(
        "form",
        {
          className: "writing-dialog-scroll writing-preferences-form",
          onSubmit: async (f) => {
            if (f.preventDefault(), !(r || _.current)) {
              _.current = !0, a(!0), g("");
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
                _.current = !1, a(!1);
              }
            }
          },
          children: [
            /* @__PURE__ */ s("label", { className: "writing-preferences-full", children: [
              "题材",
              /* @__PURE__ */ t(
                "input",
                {
                  "aria-label": "题材",
                  placeholder: "沿用创作要求",
                  disabled: k,
                  value: i.genre,
                  onChange: (f) => o({ ...i, genre: f.target.value })
                }
              ),
              /* @__PURE__ */ t("span", { className: "writing-genre-shortcuts", children: ["悬疑", "都市", "奇幻", "言情", "日常"].map((f) => /* @__PURE__ */ t(
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
            ].map(({ key: f, label: p, options: b }) => /* @__PURE__ */ s("label", { children: [
              p,
              /* @__PURE__ */ s(
                "select",
                {
                  "aria-label": p,
                  disabled: k,
                  value: i[f],
                  onChange: (y) => o({ ...i, [f]: y.target.value }),
                  children: [
                    /* @__PURE__ */ t("option", { value: "", children: "沿用创作要求" }),
                    b.map((y) => /* @__PURE__ */ t("option", { value: y.value, children: y.label }, y.value))
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
            ].map(({ key: f, label: p, placeholder: b }) => /* @__PURE__ */ s("label", { children: [
              p,
              /* @__PURE__ */ t(
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
            /* @__PURE__ */ s("label", { className: "writing-preferences-full", children: [
              "自定义文风要求",
              /* @__PURE__ */ t(
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
            d && /* @__PURE__ */ t(
              "p",
              {
                role: "alert",
                className: "writing-preferences-full writing-inspiration-form-error",
                children: d
              }
            ),
            /* @__PURE__ */ s("div", { className: "writing-preferences-full writing-actions", children: [
              /* @__PURE__ */ t("button", { type: "button", disabled: v, onClick: c, children: "取消" }),
              /* @__PURE__ */ t("button", { type: "submit", className: "is-primary", disabled: k, children: v ? "保存中…" : "保存" })
            ] })
          ]
        }
      )
    }
  );
}
function Gn({
  document: e,
  recoverableDraft: r,
  selection: n,
  value: c,
  readonly: i,
  onChange: o,
  onSelect: v,
  chapterOrder: a,
  onDeleteChapter: d,
  directory: g,
  navigationDisabled: _,
  onTextSelectionChange: k,
  selectionActionsRef: f,
  scoped: p = !1
}) {
  const b = (w) => o({ ...c, document: w }), y = (w, h, R) => /* @__PURE__ */ t(
    "div",
    {
      className: "writing-body",
      "aria-label": w,
      "data-writing-stream-target": n.kind === "unit" ? `unit:${n.id}:${n.tab === "plan" ? "plan" : "body"}` : void 0,
      children: /* @__PURE__ */ t(
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
    const w = Ce(e.units), h = w.byId.get(n.id), R = h?.unit;
    if (!R) return null;
    const A = n.tab === "plan";
    return /* @__PURE__ */ s(Ne, { children: [
      /* @__PURE__ */ s("div", { className: "writing-manuscript-heading", children: [
        /* @__PURE__ */ t("span", { className: "writing-manuscript-ordinal", children: h.label }),
        /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
          /* @__PURE__ */ t("span", { className: "writing-sr-only", children: "标题" }),
          /* @__PURE__ */ t(
            "input",
            {
              "aria-label": "标题",
              value: R.title,
              readOnly: i,
              onChange: ($) => b({
                ...e,
                units: Je(e.units, R.id, {
                  title: $.target.value
                })
              })
            }
          )
        ] }),
        !p && /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "writing-delete-chapter is-danger",
            disabled: i || a.handleProps(R.id).disabled,
            onClick: () => d(R.id),
            children: [
              /* @__PURE__ */ t(vt, { size: 14 }),
              "删除章节"
            ]
          }
        )
      ] }),
      !p && /* @__PURE__ */ t("div", { className: "writing-chapter-neighbors", "aria-label": "切换章节", children: [
        { offset: -1, label: "上一章", Icon: Gt },
        { offset: 1, label: "下一章", Icon: De }
      ].map(({ offset: $, label: L, Icon: q }) => {
        const T = w.canonical[h.ordinal - 1 + $];
        return /* @__PURE__ */ s(
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
              /* @__PURE__ */ t(q, { size: 14 }),
              L
            ]
          },
          L
        );
      }) }),
      !A && /* @__PURE__ */ s("section", { className: "writing-plan-reference", "aria-label": "本章剧情", children: [
        /* @__PURE__ */ s("div", { className: "writing-row", children: [
          /* @__PURE__ */ t("h3", { children: "本章剧情" }),
          /* @__PURE__ */ t("button", { disabled: i || _, onClick: () => v({ ...n, tab: "plan" }), children: "修改" })
        ] }),
        /* @__PURE__ */ t("p", { children: R.plan })
      ] }),
      !A && r && !c.unit?.body && /* @__PURE__ */ s("section", { className: "writing-draft-recovery", "aria-label": "未完成正文草稿", children: [
        /* @__PURE__ */ t("p", { children: "上次生成已中断，正文草稿已保留。" }),
        /* @__PURE__ */ t("button", { disabled: i, onClick: () => c.unit && o({ ...c, unit: { ...c.unit, body: r } }), children: "恢复草稿" })
      ] }),
      !A && R.has_body && R.continuity_status === "raw_pending" && !R.dependency_stale && /* @__PURE__ */ t("p", { className: "writing-continuity-note", role: "status", children: "正文已保存，记忆待补充。" }),
      !A && R.has_body && (R.continuity_status === "pending" || R.dependency_stale) && /* @__PURE__ */ t("p", { className: "writing-continuity-note", role: "status", children: "正文已保存，剧情衔接待整理。" }),
      A ? y(
        "章纲",
        R.plan,
        ($) => b({
          ...e,
          units: Je(e.units, R.id, {
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
    return /* @__PURE__ */ t(Wt, { page: g.page, onPage: g.setPage, onSelect: v, readonly: i, navigationDisabled: _, chapterOrder: a });
  if (n.kind === "section" && Se(n.id)) {
    const w = n.id;
    return y("内容", e.outline[w], (h) => b({ ...e, outline: { ...e.outline, [w]: h } }));
  }
  const N = Oe(n);
  if (!N) return null;
  const l = xt.find((w) => w.id === N).label, u = e.outline[N];
  if (n.kind !== "entity") return null;
  const E = u.find((w) => w.id === n.id);
  if (!E) return null;
  const x = (w) => b({
    ...e,
    outline: {
      ...e.outline,
      [N]: u.map(
        (h) => h.id === E.id ? { ...h, ...w } : h
      )
    }
  });
  return /* @__PURE__ */ s(Ne, { children: [
    /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
      /* @__PURE__ */ s("span", { className: "writing-sr-only", children: [
        l,
        "名称"
      ] }),
      /* @__PURE__ */ t(
        "input",
        {
          "aria-label": `${l}名称`,
          value: E.name,
          readOnly: i,
          onChange: (w) => x({ name: w.target.value })
        }
      )
    ] }),
    y(
      `${l}描述`,
      E.description,
      (w) => x({ description: w })
    )
  ] });
}
function Yn({
  selection: e,
  disabled: r,
  closeDisabled: n,
  onSave: c,
  onClose: i
}) {
  const [o, v] = B({
    title: "",
    description: ""
  }), [a, d] = B(!1), [g, _] = B(""), k = O(!1), f = Oe(e), p = f ? xt.find((b) => b.id === f).label : "章节";
  return /* @__PURE__ */ t(
    Re,
    {
      title: `添加${p}`,
      className: "writing-entry-dialog",
      closeDisabled: n || a,
      onClose: i,
      children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ s(
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
              /* @__PURE__ */ s("label", { children: [
                p,
                "名称",
                /* @__PURE__ */ t(
                  "input",
                  {
                    "aria-label": `${p}名称`,
                    required: !0,
                    disabled: r || a,
                    value: o.title,
                    onChange: (b) => v({ ...o, title: b.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ s("label", { children: [
                f ? "描述" : "章纲（可稍后填写）",
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    "aria-label": `${p}${f ? "描述" : "章纲"}`,
                    rows: 5,
                    disabled: r || a,
                    value: o.description,
                    onChange: (b) => v({ ...o, description: b.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "is-primary",
                  type: "submit",
                  disabled: r || a || !o.title.trim(),
                  children: "保存并打开"
                }
              )
            ]
          }
        ),
        g && /* @__PURE__ */ t("p", { className: "writing-error", role: "alert", children: g })
      ] })
    }
  );
}
function Dt({
  document: e,
  savedDocument: r = e,
  selection: n,
  body: c,
  selectedCharacters: i
}) {
  const o = n.kind === "unit" ? Ce(e.units).byId.get(n.id)?.unit : void 0, v = Oe(n), a = n.kind === "section" && n.id === "chapters", d = n.kind === "section" && !!v, g = n.kind === "unit" && n.tab === "plan", k = !!kt(e, n, c).trim(), f = Rt(e, n) + (o ? g ? " · 本章剧情" : " · 正文" : "");
  let p = k ? "重写当前内容" : "生成当前内容";
  i ? p = "修改选中文字" : a ? p = e.units.length ? "添加章节" : "规划章节剧情" : d ? p = `${e.outline[v].length ? "更新" : "生成"}${f}` : n.kind === "section" && Se(n.id) && !k ? p = `生成${f}` : o && !g && !k && (p = "生成本章正文");
  const b = a ? e.units.length ? "append" : "generate_chapters" : o && !g && !k ? "generate_units" : d || g || !k ? "generate_section" : "propose_edit", y = _e(r, b, {
    section_id: g ? "chapter_plan" : v || (n.kind === "section" && Se(n.id) ? n.id : void 0),
    unit_id: o?.id,
    unit_ids: o ? [o.id] : void 0,
    mode: "single"
  });
  return {
    selected: o,
    entitySection: v,
    entityList: d,
    directory: a,
    chapterPlan: g,
    hasContent: k,
    label: f,
    primaryLabel: p,
    available: !y,
    reason: y,
    instruction: i ? "修改选中的文字，保留原意并使表达自然流畅。" : k ? "重写当前内容，保持作品设定和上下文一致。" : `生成${f}，参考作品已有设定。`,
    remaining: Ce(e.units).firstUnwritten >= 0
  };
}
function jn(e, r, n) {
  const { selection: c } = e, i = Dt(e), o = { instruction: r };
  return n ? { action: "generate_units", extra: { ...o, mode: "continue" } } : i.directory ? e.document.units.length ? { action: "append", extra: { ...o, count: 1 } } : { action: "generate_chapters", extra: o } : i.entityList ? {
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
function Qn({
  document: e,
  savedDocument: r,
  onConfirmationChange: n,
  selection: c,
  disabled: i,
  body: o,
  selectedCharacters: v,
  onClearSelection: a,
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
  const [l, u] = B(""), E = c.kind === "section" && c.id !== "chapters", [x, w] = B(
    String(un)
  ), [h, R] = B(""), A = x === "custom" ? /^\d+$/.test(h) ? Number(h) : Number.NaN : Number(x), $ = mn(A), [L, q] = B(""), T = Ie(
    () => gn(r.units),
    [r.units]
  ), F = T.slice(0, hn), K = gt(
    r.units,
    r.preferences.planned_chapters
  ), j = gt(
    r.units,
    r.preferences.planned_chapters,
    L === "" ? void 0 : Number(L)
  ), ne = _e(r, "append", {
    count: j.count
  }), ie = ne ? "规划后续章节" : `规划第 ${j.start}—${j.end} 章`, G = Ie(
    () => f && N?.length ? N.flatMap((m) => {
      const S = y.index.byId.get(m);
      return S ? [S] : [];
    }) : fn(r.units, A),
    [r.units, A, f, N, y.index]
  ), [ce, re] = B(!1), Q = O(!1), [ee, P] = B(null), [se, fe] = B(""), we = {
    document: e,
    savedDocument: r,
    selection: c,
    body: o,
    selectedCharacters: v
  }, M = Dt(we), ae = i || ce || g, J = async (m, S = {}) => {
    if (ae || Q.current || _e(r, m, S)) return !1;
    Q.current = !0, re(!0);
    try {
      const I = await d(m, {
        instruction: l.trim(),
        ...S
      });
      return I && u(""), I;
    } finally {
      Q.current = !1, re(!1);
    }
  }, Z = (m, S = {}) => {
    if (ae || Q.current || _e(r, m, S))
      return;
    const I = Nn(r, m, S);
    I ? (P({ action: m, extra: S, impact: I }), fe(""), n(!0)) : J(m, S);
  }, de = () => {
    P(null), n(!1);
  }, pe = (m = !1, S = "") => {
    const { action: I, extra: z } = jn(
      we,
      [S, l.trim()].filter(Boolean).join(`
`),
      m
    );
    Z(
      I,
      m ? { ...z, count: A } : z
    );
  }, ge = !v && (E || M.directory || M.selected && !M.chapterPlan && M.hasContent);
  let H;
  !v && !M.chapterPlan && !M.entityList && !M.selected && (r.units.length || (H = {
    label: "生成大纲与剧情",
    action: "generate_outline",
    extra: {}
  }));
  const ue = H ? _e(r, H.action, H.extra) : "", $e = T.length > 0 && c.kind !== "entity" && !M.chapterPlan && !v, he = M.selected?.has_body && (M.selected.continuity_status === "pending" || M.selected.continuity_status === "raw_pending" || M.selected.dependency_stale), oe = (E || M.directory) && r.units.length > 0 && K.count > 0, be = $e || H || he || oe || ge;
  return /* @__PURE__ */ s("div", { className: "writing-controls", role: "group", "aria-label": "AI 创作", children: [
    /* @__PURE__ */ t("h3", { children: "写作工具" }),
    !v && /* @__PURE__ */ t("p", { className: "writing-ai-current", "aria-label": "当前 AI 目标", children: M.label }),
    v > 0 && /* @__PURE__ */ s("div", { className: "writing-ai-target", children: [
      /* @__PURE__ */ t("span", { children: "修改选中文字" }),
      /* @__PURE__ */ s("div", { className: "writing-row", children: [
        /* @__PURE__ */ s("small", { children: [
          v,
          " 字"
        ] }),
        /* @__PURE__ */ t("button", { disabled: g, onClick: a, children: "清除选区" })
      ] })
    ] }),
    !g && /* @__PURE__ */ s("label", { children: [
      /* @__PURE__ */ s("span", { children: [
        "创作要求 ",
        /* @__PURE__ */ t("small", { children: "可选" })
      ] }),
      /* @__PURE__ */ t(
        "textarea",
        {
          "aria-label": "创作要求",
          rows: 4,
          disabled: ae,
          placeholder: "希望怎么写，或怎么改？",
          value: l,
          onChange: (m) => u(m.target.value)
        }
      )
    ] }),
    g ? /* @__PURE__ */ s("section", { className: "writing-proposal-preview", "aria-label": "AI 修改建议", children: [
      /* @__PURE__ */ s("div", { className: "writing-row", children: [
        /* @__PURE__ */ t("h4", { children: "修改建议" }),
        /* @__PURE__ */ t("span", { role: "status", children: _ ? "等待应用" : f ? "正在生成…" : "未完成" })
      ] }),
      /* @__PURE__ */ t(
        "div",
        {
          className: "writing-proposal-text",
          "aria-live": "off",
          "data-writing-stream-target": "proposal",
          children: k || (f ? "正在准备内容…" : "生成未完成，原文已保留。")
        }
      ),
      /* @__PURE__ */ s("div", { className: "writing-proposal-actions", children: [
        /* @__PURE__ */ t(
          "button",
          {
            className: "is-primary",
            disabled: i || !_,
            onClick: p,
            children: "应用修改"
          }
        ),
        /* @__PURE__ */ t("button", { disabled: i, onClick: b, children: "丢弃建议" })
      ] })
    ] }) : /* @__PURE__ */ s(Ne, { children: [
      be && /* @__PURE__ */ s("section", { className: "writing-ai-next", "aria-label": "接下来", children: [
        $e && /* @__PURE__ */ s(
          "section",
          {
            className: "writing-primary-action",
            "aria-label": "后续剧情同步",
            children: [
              /* @__PURE__ */ s("div", { className: "writing-ai-section-heading", children: [
                /* @__PURE__ */ s("span", { children: [
                  /* @__PURE__ */ t(Yt, { size: 14 }),
                  "后续剧情"
                ] }),
                /* @__PURE__ */ s("small", { children: [
                  T.length,
                  " 章待同步"
                ] })
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  className: "is-primary",
                  disabled: ae,
                  onClick: () => Z("generate_chapters", {
                    unit_ids: F.map(({ unit: m }) => m.id)
                  }),
                  children: [
                    "同步后续剧情 ",
                    /* @__PURE__ */ t(De, { size: 15 })
                  ]
                }
              ),
              /* @__PURE__ */ s("small", { className: "writing-batch-range", children: [
                Ke(T),
                T.length > F.length ? ` · 本批 ${F.length} 章` : ""
              ] })
            ]
          }
        ),
        H && !v && /* @__PURE__ */ s("div", { className: "writing-ai-actions writing-primary-action", children: [
          /* @__PURE__ */ s(
            "button",
            {
              className: "is-primary",
              disabled: ae || !!ue,
              title: ue || void 0,
              onClick: () => Z(H.action, H.extra),
              children: [
                H.label,
                /* @__PURE__ */ t(De, { size: 15, "aria-hidden": "true" })
              ]
            }
          ),
          ue && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: ue })
        ] }),
        he && /* @__PURE__ */ s("div", { className: "writing-primary-action", children: [
          /* @__PURE__ */ t("p", { className: "writing-ai-note", children: M.selected?.continuity_status === "raw_pending" ? "正文已保存，可继续写作。" : "正文已保存，补充剧情衔接后再继续。" }),
          /* @__PURE__ */ t(
            "button",
            {
              className: "is-primary",
              disabled: ae,
              onClick: () => Z("retry_continuity", {
                unit_id: M.selected.id,
                expected_unit_version_id: M.selected.version_id
              }),
              children: "整理本章衔接"
            }
          )
        ] }),
        oe && /* @__PURE__ */ s("div", { className: "writing-plan-more", children: [
          /* @__PURE__ */ s("div", { className: "writing-ai-section-heading", children: [
            /* @__PURE__ */ t("span", { children: "章节规划" }),
            /* @__PURE__ */ s("small", { children: [
              r.units.length,
              r.preferences.planned_chapters ? ` / ${r.preferences.planned_chapters}` : "",
              " ",
              "章"
            ] })
          ] }),
          /* @__PURE__ */ s("label", { className: "writing-count-field", children: [
            /* @__PURE__ */ t("span", { children: "本批剧情" }),
            /* @__PURE__ */ t(
              "input",
              {
                type: "number",
                min: 1,
                max: K.count,
                "aria-label": "追加剧情章数",
                value: L,
                placeholder: String(K.count),
                disabled: ae,
                onChange: (m) => q(m.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ t(
            "button",
            {
              disabled: ae || !!ne,
              title: ne || void 0,
              onClick: () => Z("append", { count: j.count }),
              children: ie
            }
          ),
          ne && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: ne })
        ] }),
        ge && /* @__PURE__ */ s(
          "section",
          {
            className: "writing-continuation",
            "aria-label": "正文批量生成",
            children: [
              /* @__PURE__ */ t("h4", { className: "writing-ai-section-title", children: "继续写正文" }),
              /* @__PURE__ */ s("label", { className: "writing-count-field", children: [
                /* @__PURE__ */ t("span", { children: "本批正文" }),
                /* @__PURE__ */ s(
                  "select",
                  {
                    "aria-label": "本批正文数量",
                    disabled: ae,
                    value: x,
                    onChange: (m) => w(m.target.value),
                    children: [
                      [1, 3, 5, 10, 20, 50, 100].map((m) => /* @__PURE__ */ s("option", { value: m, children: [
                        "最多 ",
                        m,
                        " 章"
                      ] }, m)),
                      /* @__PURE__ */ t("option", { value: "custom", children: "自定义" })
                    ]
                  }
                )
              ] }),
              x === "custom" && /* @__PURE__ */ s("label", { className: "writing-count-field writing-custom-batch", children: [
                /* @__PURE__ */ t("span", { children: "正文章数" }),
                /* @__PURE__ */ t(
                  "input",
                  {
                    "aria-label": "自定义正文章数",
                    inputMode: "numeric",
                    value: h,
                    placeholder: `1—${pn}`,
                    disabled: ae,
                    "aria-invalid": !!$,
                    onChange: (m) => R(m.target.value)
                  }
                )
              ] }),
              $ && /* @__PURE__ */ t("small", { className: "writing-ai-note", role: "alert", children: $ }),
              !$ && G.length > 0 && /* @__PURE__ */ t("small", { className: "writing-batch-range", children: Ke(G) }),
              /* @__PURE__ */ s(
                "button",
                {
                  className: "is-primary",
                  disabled: ae || !!$ || !M.remaining || !!_e(r, "generate_units", {
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
                    /* @__PURE__ */ t(De, { size: 14, "aria-hidden": "true" })
                  ]
                }
              )
            ]
          }
        )
      ] }),
      (!M.directory || !M.available) && /* @__PURE__ */ s("section", { className: "writing-ai-revision", "aria-label": "内容修改", children: [
        /* @__PURE__ */ t("h4", { className: "writing-ai-group-title", children: "内容修改" }),
        !M.directory && !M.entityList && M.hasContent && /* @__PURE__ */ t("div", { className: "writing-quick-actions", "aria-label": "快捷修改", children: [
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
        ].map((m) => /* @__PURE__ */ t(
          "button",
          {
            disabled: ae || !M.available,
            onClick: () => pe(!1, m.instruction),
            children: m.label
          },
          m.label
        )) }),
        /* @__PURE__ */ t("div", { className: "writing-ai-actions", children: !M.directory && (!E || M.hasContent) && /* @__PURE__ */ t(
          "button",
          {
            className: H && !v ? void 0 : "is-primary",
            disabled: ae || !M.available,
            onClick: () => pe(),
            children: v ? "修改选中文字" : M.hasContent && !M.directory && !M.entityList ? "生成修改建议" : M.primaryLabel
          }
        ) }),
        !M.available && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: M.reason })
      ] })
    ] }),
    ee && /* @__PURE__ */ t(
      It,
      {
        title: "确认更新范围",
        description: ee.impact,
        confirmLabel: "确认更新",
        pending: ce,
        disabled: ae,
        error: se,
        onClose: () => {
          Q.current || de();
        },
        onConfirm: async () => {
          await J(ee.action, ee.extra) ? de() : Q.current || fe("更新未成功，原内容已保留，请重试。");
        }
      }
    )
  ] });
}
function Xn({
  timing: e
}) {
  const [r] = B(Date.now), n = xn(!0), c = sn(
    Math.max(0, n - (e?.startedAt || r))
  ), i = e?.source === "server" ? `已用 ${c}` : `本次查看已用 ${c}`;
  return /* @__PURE__ */ s("span", { className: "writing-generation-clock", role: "timer", "aria-live": "off", children: [
    /* @__PURE__ */ t(Qt, { size: 13, "aria-hidden": "true" }),
    i
  ] });
}
function Zn({
  snapshot: e,
  running: r,
  generationTiming: n,
  children: c
}) {
  r && e?.document.status !== "running" && (e = null);
  const i = n && n.workAssetId === e?.work_asset_id && n.runId === e.run_id && n.requestId === e.request_id ? n : null;
  if (!r) return null;
  const o = e?.checkpoint, v = En(e), a = Number(o?.target) || 0, d = Math.max(
    0,
    Math.min(a, Number(o?.completed) || 0)
  );
  return /* @__PURE__ */ s("div", { className: "writing-generation-progress", children: [
    /* @__PURE__ */ s(
      "span",
      {
        className: "writing-generation-task",
        role: "status",
        title: Ge(e),
        children: [
          /* @__PURE__ */ t(jt, { size: 14, className: "ws-spin", "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: Ge(e) })
        ]
      }
    ),
    /* @__PURE__ */ t(
      Xn,
      {
        timing: i
      },
      `${e?.work_asset_id}:${e?.run_id}:${e?.request_id}`
    ),
    (v || a > 1) && /* @__PURE__ */ t("span", { className: `writing-generation-count${v ? " is-planning" : ""}`, children: v || `已完成 ${d}/${a}` }),
    c
  ] });
}
function ei({
  snapshot: e,
  inline: r = !1,
  preview: n,
  generationTiming: c,
  running: i,
  busy: o,
  readonly: v,
  error: a,
  conflicted: d,
  reloadDisabled: g,
  onReload: _,
  onRetry: k,
  onStop: f
}) {
  const [p, b] = B(!1), [y, N] = B(!1), l = Bt(e), u = l && e ? _e(e.document, l.action, l.extra) : "", E = e?.document.status === "stopped" && !!(e.checkpoint?.history_total && (e.checkpoint.history_completed || 0) < e.checkpoint.history_total), x = e?.checkpoint?.phase === "continuity" && !E ? "正文已保存，衔接整理未完成" : `${Ge(e)}未完成`;
  return /* @__PURE__ */ s("div", { className: `writing-feedback${r ? " is-title-status" : ""}`, children: [
    /* @__PURE__ */ t(
      Zn,
      {
        snapshot: e,
        preview: n,
        running: i,
        generationTiming: c,
        children: i && /* @__PURE__ */ s(
          "button",
          {
            disabled: o || v || !e?.run_id || e.document.status !== "running",
            onClick: () => {
              f();
            },
            children: [
              /* @__PURE__ */ t(Xt, { size: 13 }),
              "停止生成"
            ]
          }
        )
      }
    ),
    a && !d && /* @__PURE__ */ s("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t(Zt, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ t("p", { children: l ? x : "本次操作未完成" }),
      /* @__PURE__ */ t("button", { onClick: () => N(!0), children: "查看原因" }),
      !l && /* @__PURE__ */ t("button", { disabled: g, onClick: () => {
        _();
      }, children: "刷新状态" })
    ] }),
    y && a && /* @__PURE__ */ t(Re, { title: "未完成原因", onClose: () => N(!1), children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
      /* @__PURE__ */ t("p", { className: "writing-error-detail", children: a }),
      /* @__PURE__ */ s("div", { className: "writing-actions", children: [
        /* @__PURE__ */ t("button", { onClick: () => N(!1), children: "返回编辑" }),
        /* @__PURE__ */ t(
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
    d && /* @__PURE__ */ s("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t("p", { children: "作品已在其他窗口更新。当前未保存内容已保留，请先复制需要保留的修改。" }),
      /* @__PURE__ */ t("button", { disabled: o, onClick: () => b(!0), children: "载入最新版" })
    ] }),
    p && /* @__PURE__ */ t(
      Re,
      {
        title: "载入最新版",
        closeDisabled: o,
        onClose: () => b(!1),
        children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
          /* @__PURE__ */ t("p", { children: "载入最新版将放弃当前未保存修改，请先复制需要保留的内容。" }),
          /* @__PURE__ */ s("div", { className: "writing-actions", children: [
            /* @__PURE__ */ t(
              "button",
              {
                disabled: o,
                onClick: async () => {
                  await _(), b(!1);
                },
                children: "放弃修改并载入"
              }
            ),
            /* @__PURE__ */ t("button", { disabled: o, onClick: () => b(!1), children: "保留编辑" })
          ] })
        ] })
      }
    ),
    e && l && /* @__PURE__ */ s("div", { className: "writing-progress", children: [
      (E || !a) && /* @__PURE__ */ t("span", { children: E ? `前文已整理 ${e.checkpoint?.history_completed || 0}/${e.checkpoint?.history_total}` : x }),
      /* @__PURE__ */ t(
        "button",
        {
          disabled: o || v || i || d || !!u,
          title: u || void 0,
          onClick: k,
          children: E ? "继续整理" : e?.checkpoint?.action === "generate_units" ? "继续原批次" : "重试这一步"
        }
      ),
      u && /* @__PURE__ */ t("small", { children: u })
    ] })
  ] });
}
function ti({
  document: e,
  selection: r,
  disabled: n,
  mutationDisabled: c,
  onSelect: i,
  onAdd: o,
  chapterOrder: v,
  directory: a
}) {
  const d = O(null), [g, _] = B(0), [k, f] = B(400), [p, b] = B(""), [y, N] = B(""), l = a.index.byId.get(a.focus.id), u = l ? a.index.canonical.length - l.ordinal : 0;
  ke(() => {
    const h = d.current;
    if (!h) return;
    const R = new ResizeObserver(() => f(h.clientHeight));
    return R.observe(h), () => R.disconnect();
  }, []), ke(() => {
    d.current && (d.current.scrollTop = 0);
  }, [a.query]), ke(() => {
    d.current && (d.current.scrollTop = u * Pe);
  }, [a.focus, u]);
  const E = wn(a.rows.length, g, k), x = Qe, w = { kind: "section", id: "chapters" };
  return /* @__PURE__ */ s("nav", { className: "writing-nav", "aria-label": "创作目录", children: [
    /* @__PURE__ */ s(
      "button",
      {
        disabled: n,
        "aria-current": r?.kind !== "unit" && !(r?.kind === "section" && r.id === "chapters") ? "page" : void 0,
        onClick: () => i({ kind: "section", id: "overview" }),
        children: [
          /* @__PURE__ */ t(en, { size: 16 }),
          /* @__PURE__ */ t("span", { children: "大纲" })
        ]
      }
    ),
    /* @__PURE__ */ s("div", { className: "writing-unit-nav", "aria-label": x.directory, children: [
      /* @__PURE__ */ s("div", { className: "writing-directory-heading", children: [
        /* @__PURE__ */ s(
          "button",
          {
            className: "writing-directory-link",
            disabled: n || !!xe(e, w),
            title: xe(e, w) || void 0,
            "aria-current": r?.kind === "section" && r.id === "chapters" ? "page" : void 0,
            onClick: () => i(w),
            children: [
              /* @__PURE__ */ t("span", { children: x.directory }),
              /* @__PURE__ */ t("small", { children: a.index.canonical.length })
            ]
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            className: "writing-add-unit",
            "aria-label": `添加${x.append}`,
            title: `添加${x.append}`,
            disabled: n || c || !bn(e),
            onClick: () => o(w),
            children: /* @__PURE__ */ t(je, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ s("div", { className: "writing-chapter-tools", children: [
        /* @__PURE__ */ t(
          "input",
          {
            "aria-label": "搜索章节标题",
            placeholder: "搜索章节标题",
            value: a.query,
            disabled: n,
            onChange: (h) => a.search(h.target.value)
          }
        ),
        /* @__PURE__ */ s(
          "form",
          {
            onSubmit: (h) => {
              h.preventDefault();
              const R = a.byNumber(p);
              if (!R) {
                N("请输入有效章号");
                return;
              }
              N(""), r?.kind === "unit" && r.id === R.unit.id && a.locate(R.unit.id), i({
                kind: "unit",
                id: R.unit.id,
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
                  value: p,
                  disabled: n,
                  onChange: (h) => {
                    b(h.target.value), N("");
                  }
                }
              ),
              /* @__PURE__ */ t("button", { type: "submit", disabled: n || !p.trim(), children: "跳转" })
            ]
          }
        ),
        y && /* @__PURE__ */ t("small", { role: "alert", children: y }),
        a.query && /* @__PURE__ */ s("small", { children: [
          a.rows.length,
          " 个匹配章节"
        ] })
      ] }),
      /* @__PURE__ */ s(
        "div",
        {
          ref: d,
          className: "writing-chapter-viewport",
          "aria-label": "章节目录列表",
          role: "list",
          tabIndex: 0,
          onScroll: (h) => _(h.currentTarget.scrollTop),
          onKeyDown: (h) => {
            if (h.altKey || h.ctrlKey || h.metaKey || !a.rows.length)
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
              End: a.rows.length - 1,
              PageUp: A - $,
              PageDown: A + $
            };
            if (!(h.key in L)) return;
            h.preventDefault();
            const q = Math.max(
              0,
              Math.min(a.rows.length - 1, L[h.key])
            );
            h.currentTarget.scrollTop = q * Pe, _(h.currentTarget.scrollTop), requestAnimationFrame(() => {
              d.current?.querySelector(
                `[data-chapter-index="${q}"] > button:first-child`
              )?.focus();
            });
          },
          children: [
            /* @__PURE__ */ t(
              "div",
              {
                className: "writing-chapter-window",
                style: { height: E.height },
                children: a.rows.slice(E.start, E.end).map((h, R) => {
                  const { unit: A } = h, $ = {
                    kind: "unit",
                    id: A.id,
                    tab: "body"
                  }, L = xe(e, $);
                  return /* @__PURE__ */ s(
                    "div",
                    {
                      className: "writing-nav-entry",
                      role: "listitem",
                      "aria-posinset": E.start + R + 1,
                      "aria-setsize": a.rows.length,
                      "data-chapter-index": E.start + R,
                      style: {
                        position: "absolute",
                        top: (E.start + R) * Pe,
                        height: Pe
                      },
                      ...v.itemProps(A.id),
                      children: [
                        /* @__PURE__ */ t(
                          "button",
                          {
                            disabled: n || !!L,
                            title: L || void 0,
                            "aria-label": `${h.label}：${A.title}`,
                            "aria-current": r?.kind === "unit" && r.id === A.id ? "page" : void 0,
                            onClick: () => i($),
                            children: /* @__PURE__ */ s("span", { children: [
                              /* @__PURE__ */ s("span", { className: "writing-nav-meta", children: [
                                /* @__PURE__ */ t("small", { children: h.label }),
                                /* @__PURE__ */ t("small", { className: A.has_body ? "is-written" : void 0, children: Nt(A) })
                              ] }),
                              /* @__PURE__ */ t("strong", { title: A.title, children: A.title })
                            ] })
                          }
                        ),
                        /* @__PURE__ */ t(
                          Mt,
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
            !a.rows.length && /* @__PURE__ */ t("p", { className: "writing-chapter-empty", children: a.query ? "没有匹配的章节" : "暂无章节" })
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
  projectId: e,
  canvasId: r,
  workAssetId: n,
  activeRunId: c,
  busy: i,
  readonly: o,
  commandError: v,
  onStop: a,
  onClose: d
}) {
  const [g, _] = B([]), [k, f] = B(!1), [p, b] = B(!1), [y, N] = B(""), [l, u] = B(!1), [E, x] = B(!1), w = O(!1), h = O(0), R = O(!1), A = O(!0), $ = te(
    async (T = !1) => {
      if (!R.current) {
        R.current = !0, b(!0);
        try {
          const F = T ? h.current : 0, K = await Rn({
            projectId: e,
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
    [r, e, n]
  );
  ke(() => (A.current = !0, $(), () => {
    A.current = !1;
  }), [$, c]);
  const L = async () => {
    if (!(i || o || w.current)) {
      w.current = !0, u(!0), x(!0);
      try {
        await a(), await $();
      } catch (T) {
        N(T instanceof Error ? T.message : "停止运行失败");
      } finally {
        w.current = !1, u(!1);
      }
    }
  }, q = y || (E && !l ? v : "");
  return /* @__PURE__ */ t(
    Re,
    {
      title: "运行记录",
      className: "writing-runs-dialog",
      closeDisabled: l,
      onClose: d,
      children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ t("div", { className: "writing-actions", children: /* @__PURE__ */ t("button", { disabled: p || l, onClick: () => {
          $();
        }, children: "刷新" }) }),
        q && /* @__PURE__ */ t("p", { role: "alert", className: "writing-error", children: q }),
        g.map((T) => /* @__PURE__ */ s("article", { className: "writing-run-entry", children: [
          /* @__PURE__ */ s("div", { className: "writing-row", children: [
            /* @__PURE__ */ t("strong", { children: Pn(T.action) }),
            /* @__PURE__ */ t("span", { className: "writing-run-status", children: ni[An(T.status)] })
          ] }),
          /* @__PURE__ */ t("p", { className: "writing-run-time", children: _t(T.created_at || T.updated_at) }),
          T.checkpoint && T.checkpoint.target > 0 && /* @__PURE__ */ s("p", { className: "writing-run-progress", children: [
            "已完成 ",
            T.checkpoint.completed,
            "/",
            T.checkpoint.target
          ] }),
          T.instruction && /* @__PURE__ */ t("p", { className: "writing-run-instruction", children: T.instruction }),
          T.error && /* @__PURE__ */ t("p", { className: "writing-error", children: T.error }),
          T.id === c && In(T.status) && /* @__PURE__ */ t(
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
        !g.length && !p && /* @__PURE__ */ t("p", { children: "暂无运行记录" }),
        p && /* @__PURE__ */ t("p", { role: "status", children: "正在读取记录…" }),
        k && /* @__PURE__ */ t(
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
function ri(e, r) {
  const n = Ie(() => Ce(e), [e]), [c, i] = B(""), [o, v] = B(0), [a, d] = B({
    id: "",
    revision: 0
  }), g = Ie(
    () => yn(n, c),
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
    focus: a,
    page: Et(g, o),
    setPage: v,
    byNumber: (l) => {
      if (/^\d+$/.test(l.trim()))
        return n.canonical[Number(l) - 1];
    }
  };
}
function si(e) {
  return [...e].reverse();
}
function ai(e, r, n, c, i = "reversed") {
  const o = Tn(
    e,
    r,
    n,
    i === "canonical" ? c : c === "before" ? "after" : "before",
    (v) => v.id
  );
  return o.every((v, a) => v === e[a]) ? e : o;
}
function oi({
  disabled: e,
  reason: r,
  getDocument: n,
  flush: c,
  onSave: i
}) {
  const [o, v] = B(!1), [a, d] = B(null), g = O(""), [_, k] = B(""), f = O(!1), p = () => {
    g.current = "", k(""), d(null);
  }, b = async (N, l, u, E) => {
    if (e || f.current || N === l) return !1;
    f.current = !0, v(!0), p();
    try {
      if (!await c()) return !1;
      const x = n();
      if (!x) return !1;
      const w = ai(
        x.units,
        N,
        l,
        u,
        E
      );
      return w === x.units ? !1 : await i({ ...x, units: w });
    } finally {
      f.current = !1, v(!1);
    }
  }, y = e || o;
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
      "data-drop": a?.id === N ? a.placement : void 0,
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
        const E = n()?.units || [], x = l === "canonical" ? E : si(E), w = x.findIndex((R) => R.id === N), h = x[w + (u.key === "ArrowUp" ? -1 : 1)];
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
function ci(e, r, n, c) {
  const i = c?.action === "generate_outline" ? c.phase : void 0, o = r.kind === "section" && r.id !== "chapters" && i && li[i] || null;
  return !n || i && n.phase !== i ? o : di(e, r, n, c) || o;
}
function di(e, r, n, c) {
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
    const g = Number(o[1]), _ = c?.action === "generate_chapters" && c.unit_ids.length ? Ce(e.units).byId.get(
      c.unit_ids[g]
    )?.ordinal : g + (c?.action === "append" ? e.units.length : 0) + 1;
    return _ === void 0 ? null : r.kind === "section" ? `chapter:${_ - 1}` : r.kind === "unit" && r.tab === "plan" && e.units[_ - 1]?.id === r.id ? `unit:${r.id}:plan` : null;
  }
  if (r.kind !== "section" || r.id === "chapters") return null;
  const v = i.startsWith("outline.") ? i.slice(8) : i === "content" ? n.section_id : void 0;
  if (v && Se(v)) return `outline:${v}`;
  const a = /^outline\.(characters|locations|props)\.(\d+)\./.exec(i);
  if (a) return `outline:${a[1]}:${a[2]}`;
  const d = /^entities\.(\d+)\./.exec(i);
  return d && n.section_id ? `outline:${n.section_id}:${d[1]}` : null;
}
function bt({
  scope: e,
  target: r,
  revision: n,
  enabled: c = r !== null,
  forceFollow: i = !1
}) {
  const o = O(null), v = O(null), a = O({ scope: "", following: !0 }), [d, g] = B({ scope: "", following: !0 }), _ = te((y) => {
    a.current.following !== y && (a.current = { ...a.current, following: y }, g(a.current));
  }, []), k = te(() => {
    i || _(!1);
  }, [i, _]), f = O(r), p = O(null), b = c;
  return Le(() => {
    f.current = r, p.current?.();
  }, [r, n]), Le(() => {
    if (a.current.scope !== e && (a.current = { scope: e, following: !0 }, g(a.current)), !b) return;
    i && _(!0);
    const y = o.current, N = v.current;
    if (!y || !N) return;
    let l = null, u = "", E = "", x = "", w = null, h = 0, R = 0, A = null;
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
      w === null && (w = requestAnimationFrame(() => {
        if (w = null, Q(), !l || !i && !a.current.following) return;
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
        Q();
        return;
      }
      if (!l) return;
      if (i) {
        T();
        return;
      }
      const P = l.scrollTop, se = l.scrollHeight, fe = se < R && P < h && Math.abs(P - Math.max(0, se - l.clientHeight)) <= 2;
      P < h && !fe ? F() : P > h && K(), fe && a.current.following && T(), h = P, R = se;
    }, ne = (P) => {
      if (i) {
        P.ctrlKey || P.preventDefault();
        return;
      }
      P.deltaY < 0 ? F() : P.deltaY > 0 && K();
    }, ie = (P) => {
      A = P.touches[0]?.clientY ?? null;
    }, G = (P) => {
      if (i) {
        P.preventDefault();
        return;
      }
      const se = P.touches[0]?.clientY;
      se !== void 0 && A !== null && se > A ? F() : se !== void 0 && A !== null && se < A && K(), A = se ?? null;
    }, ce = (P) => {
      if (i) {
        !(P.target instanceof Element && P.target.closest("input, textarea, select, [contenteditable=true]")) && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(P.key) && P.preventDefault();
        return;
      }
      ["ArrowUp", "PageUp", "Home"].includes(P.key) || P.key === " " && P.shiftKey ? F() : ["ArrowDown", "PageDown", "End", " "].includes(P.key) && K();
    }, re = () => {
      l && (l.removeEventListener("scroll", j), l.removeEventListener("wheel", ne), l.removeEventListener("touchstart", ie), l.removeEventListener("touchmove", G), l.removeEventListener("keydown", ce), l.style.overflowAnchor = u, i && (l.style.overflowY = E, l.style.scrollbarGutter = x), l !== y && ee.unobserve(l));
    }, Q = () => {
      const P = $();
      P !== l && (re(), l = P, l && (h = l.scrollTop, R = l.scrollHeight, u = l.style.overflowAnchor, l.style.overflowAnchor = "none", i && (E = l.style.overflowY, x = l.style.scrollbarGutter, l.style.scrollbarGutter = "stable", l.style.overflowY = "hidden"), l.addEventListener("scroll", j, { passive: !0 }), l.addEventListener("wheel", ne, { passive: !i }), l.addEventListener("touchstart", ie, { passive: !0 }), l.addEventListener("touchmove", G, { passive: !i }), l.addEventListener("keydown", ce), ee.observe(l)));
    }, ee = new ResizeObserver(T);
    return ee.observe(N), ee.observe(y), Q(), p.current = () => {
      const P = l;
      Q(), l && l === P && !a.current.following && (l.scrollTop = h), l && (h = l.scrollTop), T();
    }, T(), () => {
      p.current = null, re(), ee.disconnect(), w !== null && cancelAnimationFrame(w);
    };
  }, [e, b, i, _]), { viewportRef: o, contentRef: v, following: i || d.scope !== e || d.following, pauseFollowing: k };
}
const ui = [];
function $i(e) {
  const r = qn(e), {
    snapshot: n,
    viewSnapshot: c,
    document: i,
    historical: o,
    generationTiming: v,
    selection: a,
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
    e.projectId,
    n?.work_asset_id || 0,
    n?.work_version_id || 0
  ), [x, w] = B(null), h = O(null), [R, A] = B(null), [$, L] = B(!1), [q, T] = B(!1), [F, K] = B(null), [j, ne] = B(null), [ie, G] = B(!1), [ce, re] = B(!1), Q = O(!1), ee = O(!1), P = O(!1), [se, fe] = B(!1), [we, M] = B(""), ae = Qe, J = n?.document.status === "running" || !!e.running, Z = d.status === "saving", de = !!(e.readonly || o || J || _ || g), pe = !!(q || F || j || ie || $), ge = a?.kind === "unit" && a.tab === "plan", H = a?.kind === "entity" || ge || !!R, ue = pe || ce || H, { cancelBodyFollow: $e } = r;
  Le(() => {
    ue && $e();
  }, [ue, $e]);
  const he = de || pe, oe = c?.document, be = o ? void 0 : vn(n), m = he || f || ue ? "当前状态不能调整章节顺序" : u.pending ? "请先应用或丢弃修改建议" : d.hasPendingChanges || Z ? "请先保存当前修改" : "", S = oi({
    disabled: !!m,
    reason: m,
    getDocument: () => r.getSnapshot()?.document,
    flush: d.flush,
    onSave: (C) => b("save_document", { document: C })
  }), I = ue || _ || g || Z || u.pending || S.pending, z = x?.selection || a, D = z?.kind === "unit" || z?.kind === "section" && z.id === "chapters", X = a?.kind === "unit" && i ? Ce(i.units).byId.get(a.id)?.unit : void 0, U = a?.kind === "entity", V = i && j ? i.units.find((C) => C.id === j) : void 0, { flush: Y } = d, { onClose: ye } = e, Xe = te(async () => {
    if (!(ue || _ || g || S.pending || Q.current)) {
      Q.current = !0;
      try {
        await Y() && ye();
      } finally {
        Q.current = !1;
      }
    }
  }, [ue, _, g, S.pending, Y, ye]);
  ke(() => {
    if (!d.hasPendingChanges && !F) return;
    const C = (W) => {
      W.preventDefault(), W.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [F, d.hasPendingChanges]);
  const Ze = async (C) => {
    if (ee.current) return !1;
    ee.current = !0;
    try {
      const W = ot();
      W && w(W);
      const me = await N(C);
      return me || w(null), me;
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
      P.current = !0, fe(!0), M("");
      try {
        if (!await d.flush()) return;
        const C = r.getSnapshot()?.document;
        if (!C || !C.units.some((W) => W.id === j))
          return;
        await b("save_document", {
          document: {
            ...C,
            units: C.units.filter((W) => W.id !== j)
          }
        }) ? (ne(null), u.discard(), await N({ kind: "section", id: "chapters" })) : M("删除未成功，章节和原内容已保留，请重试。");
      } finally {
        P.current = !1, fe(!1);
      }
    }
  }, nt = async () => {
    if (_ || g || u.pending || !await d.flush()) return;
    const C = x;
    await N(C?.selection || { kind: "section", id: "overview" }) && (h.current = C?.top ?? null, w(null), A(null), u.discard());
  }, Ot = async () => {
    if (!i || a?.kind !== "entity" || he || u.pending || !await d.flush()) return;
    const C = r.getSnapshot()?.document;
    if (!C) return;
    const W = {
      ...C.outline,
      [a.section]: C.outline[a.section].filter(
        (me) => me.id !== a.id
      )
    };
    await b("save_document", { document: { ...C, outline: W } }) && (u.discard(), await N(x?.selection || { kind: "section", id: "overview" }, !1) && (h.current = x?.top ?? null, w(null)));
  }, zt = async (C) => {
    if (de || f || u.pending || !await d.flush())
      return !1;
    const W = r.getSnapshot()?.document;
    return W ? JSON.stringify(W.preferences) === JSON.stringify(C) ? !0 : b("save_document", { document: { ...W, preferences: C } }) : !1;
  }, it = _n(r.preview, n) && J ? r.preview : null, le = !o && !g && !pe && it?.work_asset_id === n?.work_asset_id ? it : null, Be = Ie(() => !i || !J || u.pending || !le ? i : Object.keys(le.fields).some(
    (W) => /^(preferences|inspirations|units|outline|entities)[.[]/.test(
      W
    ) || W === "plan" && le.section_id === "chapter_plan" || W === "content" && !!(le.section_id && Se(le.section_id))
  ) ? Bn(
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
    a
  ), rt = u.run, Ve = le?.fields.body !== void 0 && X?.id === le.unit_id && !d.draft.unit?.body ? le.fields.body : "", st = `${n?.work_asset_id}:${n?.run_id}:${n?.request_id}`, at = oe && a && !H && !u.pending && !(a.kind === "unit" && a.tab !== "plan" && !Ve) ? ci(
    oe,
    a,
    le,
    n?.checkpoint
  ) : null, ve = bt({
    scope: st,
    target: at,
    revision: le?.fields || n?.checkpoint,
    enabled: J && !o && !g && !ue && !u.pending,
    forceFollow: !!(J && n?.checkpoint?.action === "generate_outline" && !D && !H)
  }), ot = () => a && i ? { selection: a, document: i, top: ve.viewportRef.current?.scrollTop || 0 } : null, Te = bt({
    scope: st,
    target: le && u.pending && le.fields.replacement !== void 0 && u.preview === le.fields.replacement ? "proposal" : null,
    revision: u.preview
  });
  Le(() => {
    if (H || h.current === null) return;
    const C = ve.viewportRef.current;
    C && (C.scrollTop = h.current), h.current = null;
  }, [H, x, a, ve.viewportRef]);
  const lt = /* @__PURE__ */ t(
    ei,
    {
      inline: !0,
      snapshot: n,
      preview: le,
      generationTiming: v,
      running: J,
      busy: _ || Z || g || S.pending,
      readonly: !!(e.readonly || o),
      error: k || u.error || (i ? "" : e.node.runError) || "",
      conflicted: f,
      reloadDisabled: !!(ue || _ || g || Z || d.hasPendingChanges),
      onReload: p,
      onRetry: async () => {
        const C = Bt(r.getSnapshot());
        if (C)
          if (C.action === "propose_edit") {
            const W = Sn(C.extra);
            await N(W) && await u.retry(C.extra, W);
          } else await rt(C.action, C.extra);
      },
      onStop: y
    }
  ), ct = (C, W) => C && i && oe && /* @__PURE__ */ t(
    Qn,
    {
      document: W ? i : x?.document || i,
      savedDocument: oe,
      directory: qe,
      activeBatchIds: n?.checkpoint?.action === "generate_units" ? n.checkpoint.unit_ids : void 0,
      onConfirmationChange: re,
      selection: C,
      disabled: !W || he || f || S.pending,
      body: d.draft.unit?.body,
      selectedCharacters: W && u.textSelection?.text.length || 0,
      onClearSelection: u.clearSelection,
      onAction: rt,
      proposalPending: W && u.pending,
      proposalReady: W && u.ready,
      proposalPreview: W ? u.preview : "",
      running: J,
      onApply: () => {
        u.apply();
      },
      onDiscard: u.discard
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}`
  ), dt = (C, W) => C && Be && oe && /* @__PURE__ */ t(
    Gn,
    {
      document: W ? Be : x?.document || Be,
      recoverableDraft: !o && !J && C.kind === "unit" && n?.checkpoint?.draft?.unit_id === C.id ? n.checkpoint.draft.body : void 0,
      savedDocument: oe,
      selection: C,
      value: Ve && d.draft.unit ? {
        ...d.draft,
        unit: { ...d.draft.unit, body: Ve }
      } : d.draft,
      readonly: he || S.pending || !W,
      onChange: d.setDraft,
      onSelect: (me) => {
        ze(me);
      },
      chapterOrder: S,
      directory: qe,
      navigationDisabled: I,
      onDeleteChapter: (me) => {
        !m && !S.pending && (M(""), ne(me));
      },
      scoped: W && H,
      onTextSelectionChange: W ? u.onTextSelectionChange : void 0,
      selectionActionsRef: W ? u.selectionActionsRef : void 0
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}:${o ? c?.work_version_id : "current"}`
  ), qt = dt(a, !0), Vt = dt(z, !H), Ht = /* @__PURE__ */ s(Ne, { children: [
    /* @__PURE__ */ s(
      "section",
      {
        className: "writing-editor nodrag nopan nowheel is-detail",
        "aria-label": `${ae.title}编辑器`,
        children: [
          o && /* @__PURE__ */ s("div", { className: "writing-history-bar", children: [
            /* @__PURE__ */ t("span", { children: "正在查看历史版本，内容只读。" }),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: _ || g,
                onClick: () => {
                  et(n.work_version_id);
                },
                children: "返回当前版本"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: e.readonly || J || _ || g,
                onClick: async () => {
                  await b("restore_document", {
                    source_work_version_id: c.work_version_id
                  }) && u.discard();
                },
                children: "恢复此版本"
              }
            ),
            k && /* @__PURE__ */ t("span", { role: "alert", children: k })
          ] }),
          !i || !oe || !Cn(oe) ? /* @__PURE__ */ t("div", { className: "writing-empty", children: "请先在画布选用一个灵感，再进入创作工作区。" }) : /* @__PURE__ */ t(Ne, { children: /* @__PURE__ */ s("div", { className: "writing-layout", children: [
            /* @__PURE__ */ t(
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
            /* @__PURE__ */ t("div", { className: "writing-workspace-content", children: /* @__PURE__ */ s("div", { className: "writing-chapter-layout", children: [
              D ? /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "writing-content-scroll",
                  ref: ve.viewportRef,
                  children: /* @__PURE__ */ t(
                    "div",
                    {
                      className: "writing-page",
                      ref: ve.contentRef,
                      children: Vt
                    }
                  )
                }
              ) }) : /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t("div", { className: "writing-content-scroll", ref: ve.viewportRef, children: /* @__PURE__ */ t("div", { ref: ve.contentRef, children: /* @__PURE__ */ t(
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
                  onPreferences: () => G(!0),
                  onEditSection: async (C) => {
                    await Ze({ kind: "section", id: C }) && (u.discard(), A(C));
                  },
                  chapterOrder: S,
                  chapterRecovery: be && n && /* @__PURE__ */ t(
                    Fn,
                    {
                      draft: be,
                      snapshot: n,
                      disabled: de || f || !!u.pending || S.pending,
                      open: $,
                      onOpen: () => L(!0),
                      onClose: () => L(!1),
                      onSave: async (C) => {
                        let W;
                        if (!await b(
                          "apply_chapter_draft",
                          {
                            units: C,
                            source_run_id: be.run_id,
                            source_request_id: be.request_id
                          },
                          void 0,
                          (Me) => {
                            W = Me;
                          }
                        ))
                          throw W || new Error("保存未成功，草稿已保留");
                        L(!1);
                      }
                    },
                    `${be.run_id}:${be.request_id}`
                  ),
                  activeUnitId: J ? n?.checkpoint?.unit_id : void 0,
                  streamTarget: at,
                  generatingBackground: !!(J && !o && !H && n?.checkpoint?.action === "generate_outline" && n.checkpoint.phase === "background"),
                  following: ve.following,
                  onReadPage: ve.pauseFollowing
                }
              ) }) }) }),
              /* @__PURE__ */ t(
                "aside",
                {
                  className: "writing-ai-rail",
                  "aria-label": "创作助手",
                  ref: H ? void 0 : Te.viewportRef,
                  inert: H,
                  "aria-hidden": H || void 0,
                  children: /* @__PURE__ */ t("div", { ref: H ? void 0 : Te.contentRef, children: ct(z, !H) })
                }
              )
            ] }) })
          ] }) })
        ]
      }
    ),
    ie && i && /* @__PURE__ */ t(
      Kn,
      {
        preferences: i.preferences,
        disabled: de || f || u.pending || S.pending,
        onSave: zt,
        onClose: () => G(!1)
      }
    ),
    H && a && i && /* @__PURE__ */ s(
      Re,
      {
        title: ge ? "修改本章剧情" : Rt(i, a),
        titleStatus: o ? void 0 : lt,
        className: "writing-outline-entity-dialog",
        closeDisabled: _ || g || Z || u.pending,
        onClose: nt,
        children: [
          /* @__PURE__ */ s("div", { className: "writing-entity-dialog-layout", children: [
            /* @__PURE__ */ t("div", { className: "writing-dialog-scroll", children: qt }),
            /* @__PURE__ */ t(
              "aside",
              {
                className: "writing-ai-rail",
                "aria-label": "创作助手",
                ref: Te.viewportRef,
                children: /* @__PURE__ */ t("div", { ref: Te.contentRef, children: ct(a, !0) })
              }
            )
          ] }),
          /* @__PURE__ */ s("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            U && /* @__PURE__ */ s("button", { className: "is-danger", disabled: he || u.pending, onClick: () => {
              Ot();
            }, children: [
              /* @__PURE__ */ t(vt, { size: 14 }),
              "删除"
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "is-primary",
                disabled: _ || g || Z || u.pending,
                onClick: () => {
                  nt();
                },
                children: e.readonly || o ? "返回大纲" : "保存并返回"
              }
            )
          ] })
        ]
      }
    ),
    q && n && /* @__PURE__ */ t(
      ii,
      {
        projectId: e.projectId,
        canvasId: e.canvasId,
        workAssetId: n.work_asset_id,
        activeRunId: n.run_id,
        busy: _,
        readonly: !!(e.readonly || o),
        commandError: k,
        onStop: y,
        onClose: () => T(!1)
      }
    ),
    F && i && /* @__PURE__ */ t(
      Yn,
      {
        document: i,
        selection: F,
        disabled: de,
        closeDisabled: _ || Z,
        onClose: () => K(null),
        onSave: async (C) => {
          const W = ot(), me = F.kind === "section" && F.id !== "chapters";
          me && W && w(W);
          const Me = await l(F, C);
          return Me ? K(null) : me && w(null), Me;
        }
      }
    ),
    V && /* @__PURE__ */ t(
      It,
      {
        title: "删除章节",
        description: `删除「${V.title}」及当前正文？历史版本仍可查看。`,
        confirmLabel: "确认删除",
        pending: se,
        disabled: de || f || u.pending,
        error: we,
        onClose: () => {
          P.current || ne(null);
        },
        onConfirm: Lt
      }
    )
  ] });
  return /* @__PURE__ */ t(
    nn,
    {
      ariaLabel: `${e.node.title || "节点"}详情`,
      onRequestClose: Xe,
      header: /* @__PURE__ */ t(
        Mn,
        {
          editor: r,
          titleStatus: !o && !H ? lt : void 0,
          versions: E,
          node: e.node,
          navigationDisabled: I,
          mutationDisabled: he || U || S.pending,
          previewReadonly: !!(e.readonly || o),
          onClose: () => {
            Xe();
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
  $i as WritingEditor
};
