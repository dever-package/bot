import { j as t, a as s, F as Ce } from "./preloadable-CnUP9jgB.js";
import { a as B, b as O, h as te, d as Ne, u as Be, l as De } from "./file-kind-Cq3pESGF.js";
import { D as Ht, ag as Ft, e as Kt, ah as Yt, P as Qe, G as jt, q as Me, aH as Gt, A as Jt, t as Le, h as yt, R as Qt, r as Xt, y as Zt, z as en, x as tn, aB as nn } from "./vendor-icons-B8sieP24.js";
import { q as rn, o as vt, n as sn } from "./asset-audio-preview-CsYcyVm8.js";
import { N as an, s as Ue, h as on, i as ln } from "./node-detail-header-MEc7Zf1L.js";
import { j as Xe, e as gt, o as Ke, B as _t, C as Se, D as Ie, E as He, F as cn, G as dn, H as Oe, I as un, J as kt, K as Ye, L as $e, q as gn, M as Ee, N as je, O as Nt, g as hn, P as Ct, Q as St, R as $t, S as Et, T as xt, U as Rt, V as pn, W as fn, X as mn, Y as ht, Z as wn, _ as bn, $ as yn, a0 as Pe, a1 as vn, a2 as _n, a3 as kn, a4 as Nn } from "./writing-reference-CGBoN4Mc.js";
import { u as Pt } from "./text-content-save-actions-0xSf1irm.js";
import { u as Cn, f as xe, h as ke, i as Sn, j as $n, g as Ge, w as Bt, k as En, p as xn, c as Rn, l as Pn } from "./writing-run-labels-xukZ9QE8.js";
import { A as At } from "./asset-text-content-editor-D9BjrpSr.js";
import { WritingDialog as Re, WritingConfirmDialog as It } from "./writing-dialog-UsK3Vb3M.js";
import { R as pt } from "./asset-preview-DonyTaaN.js";
import { m as Bn } from "./space-story-setting-reference-CenSO-Ot.js";
import "./interaction-SMvIaTBF.js";
import { j as An, g as In } from "./space-assistant-layout-B9KyeCM0.js";
import { m as Tn } from "./space-content-view-YfCrbd08.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./writing-editor-C2s5EMCR.css", import.meta.url).href]);
function Wn({
  editor: e,
  titleStatus: r,
  versions: i,
  node: o,
  mutationDisabled: n,
  navigationDisabled: a,
  previewReadonly: b,
  onClose: l,
  onRuns: c,
  onSelectVersion: h
}) {
  const { snapshot: v, viewSnapshot: k, document: f, draft: p, conflicted: w } = e, y = Xe, N = f ? f.units : [], d = p.status === "saving", u = i.versions.find(
    (R) => R.id === k?.work_version_id
  ), [S, $] = B(!1), [g, _] = B(""), A = async () => {
    if (!(S || !b && !await p.flush())) {
      $(!0), _("");
      try {
        const R = b ? k : e.getSnapshot();
        if (!R) throw new Error("作品尚未载入");
        const x = [`# ${R.document.title}`];
        for (const [T, V] of R.document.units.entries()) {
          if (!V.has_body) continue;
          const K = await Ke({ projectId: Number(o.asset?.project_id || 0), assetId: V.asset_id, versionId: V.version_id, reportError: !1 }), Y = _t(K.content);
          if (!Y || Y.unit_id !== V.id) throw new Error("正文来源不匹配，导出已停止");
          x.push(`## 第 ${T + 1} 章 ${V.title}

${Y.body}`);
        }
        const z = URL.createObjectURL(new Blob([x.join(`

`)], { type: "text/markdown;charset=utf-8" })), D = window.document.createElement("a");
        D.href = z, D.download = R.document.title.replace(/[\/:*?"<>|]/g, "_") + ".md", window.document.body.appendChild(D), D.click(), D.remove(), window.setTimeout(() => URL.revokeObjectURL(z), 0);
      } catch (R) {
        _(String(R?.message || R));
      } finally {
        $(!1);
      }
    }
  };
  return /* @__PURE__ */ t(
    an,
    {
      node: f && o.titleMode === "auto" ? { ...o, title: f.title } : o,
      titleStatus: r,
      contentLabel: f ? N.length ? `${N.filter((R) => R.has_body).length}/${N.length} ${y.unit}正文` : gt(f) === "inspiration" ? "选择灵感" : gt(f) === "outline" ? "大纲" : "剧情规划" : y.title,
      updatedAt: vt(
        k?.work_updated_at || u?.updated_at || u?.created_at || o.asset?.version?.updated_at
      ),
      status: p.status,
      readonly: b,
      onRetry: () => {
        !n && !d && !w && p.retry();
      },
      onClose: l,
      versionSelect: v && /* @__PURE__ */ t(
        rn,
        {
          options: i.versions.map((R) => ({
            id: R.id,
            version: R.version,
            updatedAt: String(
              (R.id === v.work_version_id ? v.work_updated_at : void 0) || R.updated_at || R.created_at || ""
            ),
            value: R
          })),
          currentVersionId: v.work_version_id,
          selectedVersionId: k?.work_version_id || v.work_version_id,
          total: i.total,
          hasMore: i.hasMore,
          loading: i.loading,
          loadingMore: i.loadingMore,
          error: i.error,
          disabled: a,
          onSelect: (R) => {
            h(R.id);
          },
          onLoadMore: i.onLoadMore,
          onRetry: i.onRetry
        }
      ),
      actions: f && /* @__PURE__ */ s(Ce, { children: [
        /* @__PURE__ */ s("button", { type: "button", className: "wb-detail-command", disabled: a || S, title: g || "导出已保存的小说正文", onClick: () => {
          A();
        }, children: [
          /* @__PURE__ */ t(Ht, { size: 14 }),
          /* @__PURE__ */ t("span", { children: S ? "导出中" : "导出小说" })
        ] }),
        g && /* @__PURE__ */ t("span", { role: "alert", children: g }),
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "wb-detail-command",
            "aria-label": "保存为新版本",
            disabled: n || d || w,
            onClick: () => {
              e.action("create_version");
            },
            children: [
              /* @__PURE__ */ t(Ft, { size: 14 }),
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
            disabled: n || d || w || !p.hasPendingChanges,
            onClick: () => {
              p.status === "error" ? p.retry() : p.flush();
            },
            children: [
              /* @__PURE__ */ t(Kt, { size: 14 }),
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
            disabled: a,
            onClick: async () => {
              await p.flush() && c();
            },
            children: [
              /* @__PURE__ */ t(Yt, { size: 14 }),
              /* @__PURE__ */ t("span", { children: "运行记录" })
            ]
          }
        )
      ] })
    }
  );
}
const ft = /* @__PURE__ */ new WeakMap();
function Je(e) {
  if (!e) return "null";
  let r = ft.get(e);
  return r === void 0 && (r = JSON.stringify(e), ft.set(e, r)), r;
}
function Mn(e) {
  return `${Je(e.document)}
${JSON.stringify(e.unit)}`;
}
function Ln(e = 20) {
  const r = /* @__PURE__ */ new Map();
  return {
    get(i) {
      const o = r.get(i);
      return o && (r.delete(i), r.set(i, o)), o;
    },
    delete(i) {
      r.delete(i);
    },
    set(i, o) {
      r.delete(i), r.set(i, o), r.size > e && r.delete(r.keys().next().value);
    }
  };
}
function Dn(e, r, i) {
  const o = (a) => [
    a.outline.characters,
    a.outline.locations,
    a.outline.props,
    a.units
  ], n = o(r);
  o(e).forEach((a, b) => {
    a.forEach((l, c) => {
      l.id.startsWith("new:") && i.set(`${b}:${l.id}`, n[b][c].id);
    });
  });
}
function On(e, r) {
  if (!r.size) return e;
  const i = (o, n) => o.map((a) => ({
    ...a,
    id: r.get(`${n}:${a.id}`) || a.id
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
function mt(e, r) {
  const i = e.checkpoint;
  if (e.document.status !== "running" || e.work_asset_id !== r.workAssetId || e.run_id !== r.runId || e.request_id !== r.requestId || i?.action !== "generate_units" || i.unit_ids.length !== r.unitIds.length || !i.unit_ids.every((n, a) => n === r.unitIds[a]))
    return;
  if (i.phase !== "body") return "";
  const o = r.unitIds[i.completed];
  return o && (!i.unit_id || i.unit_id === o) ? o : "";
}
const qn = { document: null, unit: null };
function zn({
  projectId: e,
  canvasId: r,
  node: i,
  output: o,
  onAssetUpdated: n,
  readonly: a = !1,
  running: b = !1
}) {
  const {
    snapshot: l,
    snapshotRef: c,
    mounted: h,
    acceptSnapshot: v,
    loadWork: k,
    command: f,
    stopRun: p,
    reportError: w,
    setError: y,
    error: N,
    generationTiming: d,
    preview: u,
    clearPreview: S,
    clearGenerationError: $
  } = Cn({ projectId: e, canvasId: r, node: i, output: o, onAssetUpdated: n }), [g, _] = B(null), A = O(g), R = g || l, [x, z] = B(null), D = O(x), [T, V] = B(0), [K, Y] = B(!1), [ne, ie] = B(!1), G = O(!1), de = O({ readonly: a, running: b });
  de.current = { readonly: a, running: b };
  const re = O(0), Q = O(null), ee = O(0), P = te(() => {
    Q.current = null, ee.current += 1;
  }, []), se = O(Ln()), pe = O({
    workAssetId: 0,
    ids: /* @__PURE__ */ new Map()
  }), ye = O(null);
  Ne(
    () => () => {
      re.current += 1, Q.current = null, ye.current = null;
    },
    []
  );
  const W = te(() => {
    if (de.current.readonly || A.current)
      throw new Error("当前作品只读，未保存内容已保留");
    if ((de.current.running || c.current?.document.status === "running") && c.current?.checkpoint?.phase !== "continuity")
      throw new Error("生成期间暂不可修改作品，请先停止生成");
  }, []), ae = te(
    async (m) => {
      const E = D.current;
      if (!E) throw new Error("请等待内容加载完成");
      let I = E.workVersion, q = E.workRevision, L = E.unitVersion;
      const X = (F, U) => {
        v(F), I = F.work_version_id, q = F.work_revision, L = m.unit && F.document.units.find(
          (J) => J.id === m.unit.unit_id
        )?.version_id || 0, D.current = {
          ...E,
          selection: D.current?.selection || E.selection,
          workVersion: I,
          workRevision: q,
          unitVersion: L,
          value: U
        };
      };
      if (m.document && Je(m.document) !== Je(E.value.document)) {
        W();
        const F = c.current.work_asset_id;
        pe.current.workAssetId !== F && (pe.current = { workAssetId: F, ids: /* @__PURE__ */ new Map() });
        const U = pe.current, J = On(
          m.document,
          U.ids
        ), ve = await Ue(
          f(
            "save_document",
            { document: J, expected_work_revision: q },
            I
          )
        );
        Dn(
          J,
          ve.document,
          U.ids
        ), X(ve, { ...E.value, document: m.document });
      }
      if (m.unit && m.unit.body !== E.value.unit?.body) {
        W();
        const F = await Ue(
          f(
            "save_unit",
            {
              unit_id: m.unit.unit_id,
              expected_unit_version_id: L,
              expected_work_revision: q,
              body: m.unit.body
            },
            I
          )
        );
        X(F, m);
        const U = F.document.units.find(
          (J) => J.id === m.unit.unit_id
        );
        U?.version_id && se.current.delete(U.version_id);
      }
      y("");
    },
    [v, W, f, c]
  ), j = Pt({
    value: x?.value || qn,
    resetKey: `${i.id}:${T}`,
    fingerprint: Mn,
    save: ae,
    onError: w,
    autoSave: !!(x && !g && !a && !b && l?.document.status !== "running" && !ne && !K),
    debounceMs: 1200
  }), Z = O(j);
  Z.current = j;
  const ue = te(
    async (m, E) => {
      let I = null, q = 0;
      if (E.kind === "unit") {
        const L = Se(m.document.units).byId.get(
          E.id
        )?.unit;
        if (!L) throw new Error("该章节已移出目录，请重新选择");
        if (q = L.version_id, L.asset_id && L.version_id) {
          if (I = se.current.get(L.version_id) || null, !I) {
            const X = await Ke({
              projectId: e,
              assetId: L.asset_id,
              versionId: L.version_id,
              reportError: !1
            });
            if (I = _t(X.content), !I || I.unit_id !== L.id || I.profile !== m.document.type)
              throw new Error("章节内容与目录不一致");
            se.current.set(L.version_id, I);
          }
        } else
          I = {
            type: "writing_unit",
            schema_version: 1,
            profile: m.document.type,
            unit_id: L.id,
            title: L.title,
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
        selection: E,
        workVersion: m.work_version_id,
        workRevision: m.work_revision,
        unitVersion: q,
        value: { document: m.document, unit: I }
      };
    },
    [e]
  ), fe = te(
    (m) => {
      D.current = m, z(m), V((E) => E + 1), y("");
    },
    [y]
  ), ge = te(
    async (m, E = !0, I) => {
      if (E && P(), E && (G.current || !await Z.current.flush()))
        return !1;
      const q = A.current || c.current;
      if (!q || xe(q.document, m))
        return !1;
      const L = ++re.current;
      Y(!0);
      try {
        const X = await ue(q, m);
        return !h.current || L !== re.current || I && !I() ? !1 : (fe(X), !0);
      } catch (X) {
        return h.current && L === re.current && (!I || I()) && w(X), !1;
      } finally {
        h.current && L === re.current && Y(!1);
      }
    },
    [
      P,
      fe,
      h,
      ue,
      w,
      c
    ]
  );
  Ne(() => {
    const m = Q.current, E = l && m ? mt(l, m) : void 0;
    if (m && E === void 0 && (Q.current = null), g || !l || K || j.hasPendingChanges || G.current)
      return;
    const I = E ? { kind: "unit", id: E, tab: "body" } : x?.selection || Ie(l.document), q = JSON.stringify(I);
    if (x && x.workVersion === l.work_version_id && x.workRevision === l.work_revision && JSON.stringify(x.selection) === q || ye.current?.version === l.work_version_id && ye.current.revision === l.work_revision && ye.current.selection === q)
      return;
    ye.current = {
      version: l.work_version_id,
      revision: l.work_revision,
      selection: q
    };
    const L = He(l.document, I) && !xe(l.document, I), X = ee.current;
    ge(
      L ? I : Ie(l.document),
      !1,
      () => {
        const F = c.current;
        return ee.current === X && !A.current && !Z.current.hasPendingChanges && !!(F && F.work_version_id === l.work_version_id && F.work_revision === l.work_revision && (!m || Q.current === m && mt(F, m) === E));
      }
    );
  }, [
    x,
    g,
    j.hasPendingChanges,
    K,
    ge,
    l,
    c,
    ne
  ]);
  const H = te(
    async (m, E = {}, I, q) => {
      if (G.current || de.current.readonly) return !1;
      G.current = !0, ie(!0);
      try {
        if (!await Z.current.flush()) return !1;
        if (m === "restore_document") {
          if (de.current.readonly || de.current.running || c.current?.document.status === "running")
            throw new Error("当前不可恢复版本");
        } else W();
        const L = ke(
          c.current.document,
          m,
          E
        );
        if (L) throw new Error(L);
        if (m === "propose_edit" && I && (!D.current || !I(D.current)))
          return !1;
        S(), $();
        const X = ee.current, F = E.unit_id ? c.current.document.units.find(
          (J) => J.id === E.unit_id
        ) : void 0, U = await Ue(
          f(m, {
            ...F && E.section_id !== "chapter_plan" ? { expected_unit_version_id: F.version_id } : {},
            ...E
          })
        );
        return v(U), (m === "generate_units" || m === "retry_generation") && X === ee.current && U.document.status === "running" && U.checkpoint?.action === "generate_units" && U.run_id && U.request_id && U.checkpoint.unit_ids.length && (Q.current = {
          workAssetId: U.work_asset_id,
          runId: U.run_id,
          requestId: U.request_id,
          unitIds: [...U.checkpoint.unit_ids]
        }), m === "restore_document" && (A.current = null, _(null)), y(""), !0;
      } catch (L) {
        return w(L), q?.(L), !1;
      } finally {
        G.current = !1, h.current && ie(!1);
      }
    },
    [
      v,
      W,
      $,
      S,
      f,
      w
    ]
  ), he = te(async () => {
    P();
    const m = c.current;
    if (!(!m?.run_id || m.document.status !== "running" || G.current || de.current.readonly)) {
      G.current = !0, ie(!0);
      try {
        await p(), y("");
      } catch (E) {
        w(E);
      } finally {
        G.current = !1, h.current && ie(!1);
      }
    }
  }, [P, p, w]), we = te(async () => {
    if (!(G.current || Z.current.status === "saving")) {
      G.current = !0, ie(!0);
      try {
        await k();
        const m = D.current?.selection, E = m && c.current && He(c.current.document, m);
        await ge(
          E && m ? m : Ie(c.current.document),
          !1
        );
      } catch (m) {
        w(m);
      } finally {
        G.current = !1, h.current && ie(!1);
      }
    }
  }, [k, ge, w]), oe = te(
    async (m) => {
      if (P(), G.current) return !1;
      G.current = !0, ie(!0);
      let E = 0;
      try {
        if (!await Z.current.flush()) return !1;
        const I = c.current;
        if (!I || !h.current) return !1;
        E = ++re.current, Y(!0);
        let q = null;
        if (m !== I.work_version_id) {
          const J = await Ke({
            projectId: e,
            assetId: I.work_asset_id,
            versionId: m,
            reportError: !1
          });
          if (!h.current || E !== re.current)
            return !1;
          const ve = cn(J.content);
          if (!ve || ve.type !== I.document.type)
            throw new Error("历史版本与当前作品不一致");
          q = {
            ...I,
            document: ve,
            work_version_id: J.id,
            work_revision: dn(J),
            work_version: J.version,
            work_updated_at: J.updated_at || J.created_at,
            proposal: void 0
          };
        }
        const L = q || I, X = D.current?.selection || Ie(L.document), F = He(L.document, X) && !xe(L.document, X), U = await ue(
          L,
          F ? X : Ie(L.document)
        );
        return !h.current || E !== re.current ? !1 : (A.current = q, _(q), fe(U), !0);
      } catch (I) {
        return h.current && (!E || E === re.current) && w(I), !1;
      } finally {
        G.current = !1, h.current && (E && E === re.current && Y(!1), ie(!1));
      }
    },
    [
      fe,
      P,
      h,
      e,
      ue,
      w,
      c
    ]
  ), le = te(
    async (m, E) => {
      if (G.current) return !1;
      const I = Z.current.draft.document;
      if (!I) return !1;
      const q = Oe(m), L = un(I, m, E);
      let X;
      if (!await H(
        "save_document",
        { document: L },
        void 0,
        (U) => {
          X = U;
        }
      )) {
        if (X) throw X;
        return !1;
      }
      const F = c.current.document;
      if (q) {
        const U = F.outline[q], J = U[U.length - 1];
        J && await ge(
          { kind: "entity", section: q, id: J.id },
          !1
        );
      } else {
        const U = F.units, J = U?.[U.length - 1];
        J && await ge(
          { kind: "unit", id: J.id, tab: "body" },
          !1
        );
      }
      return !0;
    },
    [H, ge]
  ), be = !g && l?.document.status === "running" && !j.hasPendingChanges ? l.document : j.draft.document || R?.document;
  return {
    snapshot: l,
    viewSnapshot: R,
    document: be,
    historical: !!g,
    selectVersion: oe,
    preview: u,
    getSnapshot: () => c.current,
    generationTiming: d,
    selection: x?.selection,
    draft: j,
    loading: K,
    busy: ne,
    error: N,
    conflicted: !!(j.hasPendingChanges && !ne && j.status !== "saving" && x && l && (D.current?.workVersion !== l.work_version_id || D.current.workRevision !== l.work_revision)),
    action: H,
    stop: he,
    openSelection: ge,
    cancelBodyFollow: P,
    addEntry: le,
    reload: we
  };
}
function Fe(e, r) {
  return !r || !e.document ? "" : kt(e.document, r, e.unit?.body);
}
function Vn(e, r, i) {
  const o = e.document;
  return r.kind === "unit" && r.tab === "plan" ? {
    ...e,
    document: {
      ...o,
      units: Ye(o.units, r.id, {
        plan: i
      })
    }
  } : r.kind === "unit" && e.unit ? { ...e, unit: { ...e.unit, body: i } } : r.kind === "entity" ? {
    ...e,
    document: {
      ...o,
      outline: {
        ...o.outline,
        [r.section]: o.outline[r.section].map(
          (n) => n.id === r.id ? { ...n, description: i } : n
        )
      }
    }
  } : r.kind === "section" && $e(r.id) ? {
    ...e,
    document: {
      ...o,
      outline: { ...o.outline, [r.id]: i }
    }
  } : e;
}
function Un(e) {
  const [r, i] = B(
    null
  ), o = O(null), [n, a] = B(null), b = O(null), [l, c] = B(""), h = O(!1), v = O(!1), k = te(() => {
    o.current?.clearSelection(), i(null);
  }, []), f = te(() => {
    a(null), c(""), k();
  }, [k]), p = e.snapshot?.proposal, w = !!(n && p && p.run_id === n.runId && e.snapshot?.document.status === "ready"), y = n && e.preview?.run_id === n.runId && e.preview.fields.replacement !== void 0 ? e.preview.fields.replacement : "", N = async ($, g, _, A) => {
    let R;
    if (!await e.action(
      "propose_edit",
      { ...$, ..._ ? { selected_text: _.text } : {} },
      (D) => {
        if (JSON.stringify(D.selection) !== JSON.stringify(g))
          return c("编辑目标已变化，请重新选择后生成修改建议。"), !1;
        const T = Fe(D.value, g);
        return _ && T !== A ? (c("原文已变化，请重新选择后生成修改建议。"), !1) : (R = {
          selection: g,
          text: T,
          range: _,
          unitVersion: g.kind === "unit" && g.tab !== "plan" ? D.unitVersion : 0
        }, !0);
      }
    ) || !R) return !1;
    const z = { ...R, runId: e.getSnapshot().run_id };
    return b.current = z, a(z), c(""), !0;
  };
  return {
    textSelection: r,
    onTextSelectionChange: i,
    selectionActionsRef: o,
    clearSelection: k,
    discard: f,
    run: async ($, g = {}) => {
      if (h.current) return !1;
      h.current = !0, c("");
      try {
        if ($ !== "propose_edit")
          return a(null), k(), e.action($, g);
        const _ = e.selection;
        return _ ? await N(
          g,
          _,
          r,
          Fe(e.draft.draft, _)
        ) : !1;
      } finally {
        h.current = !1;
      }
    },
    retry: async ($, g) => {
      if (h.current) return !1;
      const _ = b.current, A = _ && _.runId === e.getSnapshot()?.run_id ? _.range : null;
      if (($.selected_text || "") !== (A?.text || ""))
        return c("原选区无法恢复，请重新选择原文后生成修改建议。"), !1;
      h.current = !0;
      try {
        return await N($, g, A, _?.text);
      } finally {
        h.current = !1;
      }
    },
    apply: async () => {
      if (v.current || !w || !n || !p || e.historical || e.busy || e.loading)
        return;
      const $ = e.getSnapshot(), g = JSON.stringify(e.selection) === JSON.stringify(n.selection), _ = p.unit_id === (n.selection.kind === "unit" ? n.selection.id : void 0) && p.section_id === (n.selection.kind === "unit" && n.selection.tab === "plan" ? "chapter_plan" : n.selection.kind === "entity" ? n.selection.section : n.selection.kind === "section" ? n.selection.id : void 0) && p.entity_id === (n.selection.kind === "entity" ? n.selection.id : void 0) && p.inspiration_id === void 0 && (p.selected_text || "") === (n.range?.text || "");
      if (!g || !_ || $?.work_version_id !== p.work_version_id || $.work_revision !== p.work_revision || $.work_asset_id !== p.work_asset_id || Fe(e.draft.draft, e.selection) !== n.text || n.selection.kind === "unit" && n.selection.tab !== "plan" && p.unit_version_id !== n.unitVersion) {
        c("内容或版本已变化，请丢弃此建议后重新生成。");
        return;
      }
      v.current = !0;
      try {
        if (n.range) {
          if (!o.current?.replaceSelection(
            n.range,
            p.replacement
          )) {
            c("选区已变化，请重新选择后生成。");
            return;
          }
        } else
          e.draft.setDraft(
            Vn(
              e.draft.draft,
              n.selection,
              p.replacement
            )
          );
        a(null), k(), await e.draft.flush();
      } finally {
        v.current = !1;
      }
    },
    ready: w,
    pending: !!n,
    preview: w ? p.replacement : y,
    error: l
  };
}
function Hn(e, r, i) {
  const [o, n] = B([]), [a, b] = B(0), [l, c] = B(0), [h, v] = B(!1), [k, f] = B(!1), [p, w] = B(!1), [y, N] = B(""), d = O(0), u = O(!1), S = te(
    async ($) => {
      if (!r) return;
      const g = ++d.current;
      u.current = !0, $ === 1 ? f(!0) : w(!0), N("");
      try {
        const _ = await gn({
          projectId: e,
          assetId: r,
          page: $,
          reportError: !1
        });
        if (g !== d.current) return;
        n(
          (A) => $ === 1 ? _.items : [
            ...A,
            ..._.items.filter(
              (R) => !A.some((x) => x.id === R.id)
            )
          ]
        ), b($), c(_.total), v(_.hasMore);
      } catch (_) {
        g === d.current && N(_ instanceof Error ? _.message : "读取版本失败");
      } finally {
        g === d.current && (u.current = !1, f(!1), w(!1));
      }
    },
    [e, r]
  );
  return Ne(() => (S(1), () => {
    d.current += 1;
  }), [S, i]), {
    versions: o,
    total: l,
    hasMore: h,
    loading: k,
    loadingMore: p,
    error: y,
    onLoadMore: () => {
      !u.current && h && S(a + 1);
    },
    onRetry: () => {
      u.current || S(a || 1);
    }
  };
}
function Fn({
  draft: e,
  snapshot: r,
  disabled: i,
  open: o,
  onOpen: n,
  onClose: a,
  onSave: b
}) {
  const [l, c] = B(0), [h, v] = B(""), [k, f] = B(!1), p = O(!1), w = r.checkpoint, y = w.work_asset_id !== r.work_asset_id || w.work_version_id !== r.work_version_id || w.work_revision !== r.work_revision, N = async (x) => {
    await b(x);
  }, d = Pt({
    value: e.units,
    resetKey: `${e.run_id}:${e.request_id}`,
    fingerprint: JSON.stringify,
    autoSave: !1,
    save: N,
    onError: (x) => v(
      x instanceof Error ? x.message : "保存未成功，草稿已保留"
    )
  }), u = d.draft, S = Math.min(l, u.length - 1), $ = u[S], g = (x) => d.setDraft(
    u.map(
      (z, D) => D === S ? { ...z, ...x } : z
    )
  ), _ = () => {
    const x = w.unit_ids[u.length] || "", z = r.document.units.find((D) => D.id === x)?.title || "";
    d.setDraft([
      ...u,
      {
        id: x,
        unit_type: "chapter",
        title: z,
        plan: "",
        children: [],
        asset_id: 0,
        version_id: 0,
        has_body: !1,
        continuity_valid: !1,
        dependency_stale: !1
      }
    ]), c(u.length);
  }, A = u.length === e.expected_count && u.every((x) => x.title.trim() && x.plan.trim()), R = async () => {
    if (!(i || y || !A || p.current)) {
      p.current = !0, f(!0), v("");
      try {
        if (d.hasPendingChanges) {
          if (!await d.flush()) return;
        } else await N(u);
        a();
      } catch (x) {
        v(
          x instanceof Error ? x.message : "保存未成功，草稿已保留"
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
    /* @__PURE__ */ t("button", { disabled: i && !o, onClick: n, children: "查看并调整草稿" }),
    o && /* @__PURE__ */ s(
      Re,
      {
        title: "调整章纲草稿",
        onClose: a,
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
                  u.map((x, z) => /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      "aria-current": z === S ? "true" : void 0,
                      disabled: k,
                      onClick: () => c(z),
                      children: [
                        /* @__PURE__ */ s("small", { children: [
                          "第 ",
                          z + 1,
                          " 章"
                        ] }),
                        /* @__PURE__ */ t("strong", { children: x.title || "未命名章节" })
                      ]
                    },
                    `${z}:${x.id}`
                  )),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      disabled: k || u.length >= e.expected_count,
                      onClick: _,
                      children: w.unit_ids.length ? "补充下一章草稿" : "添加章节"
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
              $ && /* @__PURE__ */ s(Ce, { children: [
                /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
                  /* @__PURE__ */ t("span", { className: "writing-sr-only", children: "草稿章节标题" }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      "aria-label": "草稿章节标题",
                      value: $.title,
                      readOnly: k,
                      onChange: (x) => g({ title: x.target.value })
                    }
                  )
                ] }),
                /* @__PURE__ */ t("div", { className: "writing-body", children: /* @__PURE__ */ t(
                  At,
                  {
                    kind: "richtext",
                    contentFormat: "markdown",
                    value: $.plan,
                    readonly: k,
                    onChange: (x) => g({ plan: x })
                  }
                ) }),
                !w.unit_ids.length && /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "is-danger",
                    disabled: k,
                    onClick: () => d.setDraft(
                      u.filter((x, z) => z !== S)
                    ),
                    children: "移除此章草稿"
                  }
                )
              ] }),
              h && /* @__PURE__ */ t("p", { role: "alert", className: "writing-error", children: h })
            ] })
          ] }),
          /* @__PURE__ */ s("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            /* @__PURE__ */ t("button", { disabled: k, onClick: a, children: "返回大纲" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "is-primary",
                disabled: i || k || y || !A,
                onClick: () => {
                  R();
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
function Tt(e, r, i) {
  const [o, n] = B(0), a = r && e !== void 0 ? Math.floor(e / Ee) : o;
  return a !== o && n(a), [o, (b) => {
    i?.(), n(b);
  }];
}
function wt({ document: e, section: r, readonly: i, navigationDisabled: o, onSelect: n, onAdd: a, streamTarget: b, following: l = !1, onReadPage: c }) {
  const h = new RegExp(`^outline:${r}:(\\d+)$`).exec(b || ""), [v, k] = Tt(h ? Number(h[1]) : void 0, l, c), f = e.outline[r], p = Math.max(1, Math.ceil(f.length / Ee)), w = Math.min(v, p - 1), y = { characters: "人物", locations: "地点", props: "必要道具" }[r];
  return /* @__PURE__ */ s("section", { className: "story-entities-page", "aria-label": y, "data-writing-stream-target": `outline:${r}`, children: [
    /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
      /* @__PURE__ */ t("h2", { "data-writing-stream-target": r === "characters" ? "phase:characters" : void 0, children: y }),
      /* @__PURE__ */ s("button", { disabled: i || o, onClick: () => a({ kind: "section", id: r }), children: [
        /* @__PURE__ */ t(Qe, { size: 14 }),
        "添加",
        y
      ] })
    ] }),
    /* @__PURE__ */ t("div", { className: "story-entity-cards", children: f.slice(w * Ee, (w + 1) * Ee).map((N, d) => /* @__PURE__ */ s(
      "button",
      {
        className: `writing-outline-card story-entity-card${b === `outline:${r}:${w * Ee + d}` ? " is-streaming" : ""}`,
        disabled: o || !N.id || N.id.startsWith("preview:"),
        "data-writing-stream-target": `outline:${r}:${w * Ee + d}`,
        onClick: () => n({ kind: "entity", section: r, id: N.id }),
        children: [
          /* @__PURE__ */ t("strong", { className: "writing-card-title", children: N.name || "正在构思…" }),
          /* @__PURE__ */ t("p", { className: "writing-list-preview", children: N.description || "暂无资料" })
        ]
      },
      N.id || `preview:${d}`
    )) }),
    !f.length && /* @__PURE__ */ s("p", { className: "story-outline-empty", children: [
      "暂无",
      y
    ] }),
    p > 1 && /* @__PURE__ */ s("div", { className: "story-reading-pagination", children: [
      /* @__PURE__ */ t("button", { disabled: o || !w, onClick: () => k(w - 1), children: "上一页" }),
      /* @__PURE__ */ s("span", { children: [
        w + 1,
        " / ",
        p
      ] }),
      /* @__PURE__ */ t("button", { disabled: o || w + 1 >= p, onClick: () => k(w + 1), children: "下一页" })
    ] })
  ] });
}
function Wt({
  order: e,
  id: r,
  title: i,
  view: o = "reversed"
}) {
  return /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: "writing-chapter-handle",
      "aria-label": `调整「${i}」顺序`,
      ...e.handleProps(r, o),
      children: /* @__PURE__ */ t(jt, { size: 14 })
    }
  );
}
function Mt({
  page: e,
  onPage: r,
  onSelect: i,
  readonly: o,
  navigationDisabled: n,
  chapterOrder: a,
  activeUnitId: b,
  activeOrdinal: l
}) {
  return /* @__PURE__ */ s(Ce, { children: [
    /* @__PURE__ */ s("div", { className: "writing-chapter-pagination", "aria-label": "剧情分页", children: [
      /* @__PURE__ */ s("span", { children: [
        je(e.rows) || "0 章",
        " / 共 ",
        e.total,
        " 章"
      ] }),
      /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ t(
          "button",
          {
            disabled: n || !e.page,
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
            disabled: n || e.page + 1 >= e.pages,
            onClick: () => r(e.page + 1),
            children: "下一页"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ s("ul", { className: "writing-directory writing-chapter-grid", children: [
      e.rows.map(({ unit: c, label: h, ordinal: v }) => {
        const k = !c.id || b === c.id || l === v;
        return /* @__PURE__ */ s(
          "li",
          {
            className: `writing-outline-card writing-chapter-card${k ? " is-streaming" : ""}`,
            "data-unit-id": c.id,
            "data-writing-stream-target": `chapter:${v - 1}`,
            ...a.itemProps(c.id, "canonical"),
            children: [
              /* @__PURE__ */ s("div", { className: "writing-card-top", children: [
                /* @__PURE__ */ s("span", { className: "writing-card-meta", children: [
                  /* @__PURE__ */ t("small", { className: "writing-card-ordinal", children: h }),
                  /* @__PURE__ */ t("small", { className: "writing-card-status", children: k ? "生成中" : Nt(c) })
                ] }),
                /* @__PURE__ */ s("div", { className: "writing-chapter-card-tools", children: [
                  /* @__PURE__ */ t(
                    "button",
                    {
                      "data-writing-drag-ignore": !0,
                      className: "writing-card-edit",
                      "aria-label": `修改剧情：${c.title}`,
                      disabled: o || n || !c.id,
                      onClick: () => i({ kind: "unit", id: c.id, tab: "plan" }),
                      children: /* @__PURE__ */ t(Me, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ t(
                    Wt,
                    {
                      order: a,
                      id: c.id,
                      title: c.title,
                      view: "canonical"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  className: "writing-entity-card",
                  disabled: n || !c.id,
                  onClick: () => i({ kind: "unit", id: c.id, tab: "body" }),
                  children: [
                    /* @__PURE__ */ t("strong", { className: "writing-card-title", children: c.title || (c.id ? "未命名章节" : "正在规划…") }),
                    /* @__PURE__ */ t("span", { className: "writing-list-preview", children: c.plan || (c.id ? "暂无剧情" : "正在展开剧情…") }),
                    /* @__PURE__ */ s("span", { className: "writing-entity-footer", children: [
                      c.has_body ? "打开正文" : "进入正文",
                      /* @__PURE__ */ t(Gt, { size: 15 })
                    ] })
                  ]
                }
              )
            ]
          },
          c.id || `preview:${v}`
        );
      }),
      !e.total && /* @__PURE__ */ t("li", { className: "writing-material-empty", children: "暂无章节" })
    ] })
  ] });
}
function Kn({
  document: e,
  readonly: r,
  navigationDisabled: i,
  onSelect: o,
  onAdd: n,
  onPreferences: a,
  onEditSection: b,
  chapterOrder: l,
  activeUnitId: c,
  streamTarget: h,
  generatingBackground: v = !1,
  following: k = !1,
  onReadPage: f,
  chapterRecovery: p
}) {
  const w = hn(e), { preferences: y } = e, N = !v || !!e.outline.world || h === "outline:world", d = [
    { label: "题材", value: y.genre },
    {
      label: "文风",
      value: Ct.find((g) => g.value === y.style)?.label || (y.style_instructions ? "自定文风" : "")
    },
    {
      label: "叙事视角",
      value: St.find(
        (g) => g.value === y.pov
      )?.label
    },
    {
      label: "写作模式",
      value: $t.find((g) => g.value === y.mode)?.label
    },
    {
      label: "计划章数",
      value: y.planned_chapters ? `${y.planned_chapters} 章` : ""
    },
    {
      label: "每章字数",
      value: y.chapter_words ? `约 ${y.chapter_words} 字` : ""
    }
  ], u = /^chapter:(\d+)$/.exec(h || ""), [S, $] = Tt(
    u ? Number(u[1]) : void 0,
    k,
    f
  );
  return /* @__PURE__ */ s("div", { className: "story-outline-page", children: [
    w && /* @__PURE__ */ s("section", { className: "story-outline-inspiration", "aria-label": "已选灵感", children: [
      /* @__PURE__ */ t("span", { children: "已选灵感" }),
      /* @__PURE__ */ t("h2", { children: w.title }),
      /* @__PURE__ */ t("p", { children: w.content })
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
                disabled: r || i,
                "aria-label": "修改写作设定",
                onClick: a,
                children: [
                  /* @__PURE__ */ t(Me, { size: 13 }),
                  "修改"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ t("dl", { className: "story-preference-fields", children: d.map(({ label: g, value: _ }) => /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ t("dt", { children: g }),
            /* @__PURE__ */ t("dd", { className: _ ? void 0 : "is-unset", children: _ || "待确定" })
          ] }, g)) }),
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
            disabled: r || i,
            "aria-label": "修改故事总纲",
            onClick: () => b("overview"),
            children: [
              /* @__PURE__ */ t(Me, { size: 13 }),
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
            pt,
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
        navigationDisabled: i,
        onSelect: o,
        onAdd: n,
        streamTarget: h,
        following: k,
        onReadPage: f
      }
    ),
    /* @__PURE__ */ s("section", { className: "story-outline-section", "aria-label": "背景", children: [
      /* @__PURE__ */ t("div", { className: "story-section-heading", children: /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:background", children: "背景" }) }),
      ["locations", "props"].filter(
        (g) => !v || e.outline[g].length > 0
      ).map((g) => /* @__PURE__ */ t(
        wt,
        {
          document: e,
          section: g,
          readonly: r,
          navigationDisabled: i,
          onSelect: o,
          onAdd: n,
          streamTarget: h,
          following: k,
          onReadPage: f
        },
        g
      )),
      N && /* @__PURE__ */ s(
        "article",
        {
          className: "story-text-card story-world-section",
          "data-writing-stream-target": "outline:world",
          children: [
            /* @__PURE__ */ t("h3", { children: "环境与规则" }),
            /* @__PURE__ */ t(
              pt,
              {
                fallback: e.outline.world || "暂无背景",
                className: "story-outline-prose",
                markdownClassName: "story-outline-markdown"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                disabled: r || i,
                "aria-label": "修改环境与规则",
                onClick: () => b("world"),
                children: [
                  /* @__PURE__ */ t(Me, { size: 13 }),
                  "修改"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s("section", { className: "story-outline-section", "aria-label": "章节剧情", children: [
      /* @__PURE__ */ s("div", { className: "story-section-heading", children: [
        /* @__PURE__ */ t("h2", { "data-writing-stream-target": "phase:chapters", children: "章节剧情" }),
        /* @__PURE__ */ s(
          "button",
          {
            disabled: r || i,
            onClick: () => n({ kind: "section", id: "chapters" }),
            children: [
              /* @__PURE__ */ t(Qe, { size: 14 }),
              "添加章节"
            ]
          }
        )
      ] }),
      p,
      /* @__PURE__ */ t(
        Mt,
        {
          page: Et(
            Se(e.units).canonical,
            S
          ),
          onPage: $,
          onSelect: o,
          readonly: r,
          navigationDisabled: i,
          chapterOrder: l,
          activeUnitId: c,
          activeOrdinal: u ? Number(u[1]) + 1 : void 0
        }
      )
    ] })
  ] });
}
function Yn({
  preferences: e,
  disabled: r,
  onSave: i,
  onClose: o
}) {
  const [n, a] = B(() => ({ ...e })), [b, l] = B(!1), [c, h] = B(""), v = O(!1), k = r || b;
  return /* @__PURE__ */ t(
    Re,
    {
      title: "写作设定",
      className: "writing-preferences-dialog",
      closeDisabled: b,
      onClose: o,
      children: /* @__PURE__ */ s(
        "form",
        {
          className: "writing-dialog-scroll writing-preferences-form",
          onSubmit: async (f) => {
            if (f.preventDefault(), !(r || v.current)) {
              v.current = !0, l(!0), h("");
              try {
                await i({
                  ...n,
                  genre: n.genre.trim(),
                  style_instructions: n.style_instructions.trim()
                }) ? o() : h("未能保存，请重试。设置已保留。");
              } catch (p) {
                h(
                  p instanceof Error ? p.message : "保存失败，设置已保留。"
                );
              } finally {
                v.current = !1, l(!1);
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
                  value: n.genre,
                  onChange: (f) => a({ ...n, genre: f.target.value })
                }
              ),
              /* @__PURE__ */ t("span", { className: "writing-genre-shortcuts", children: ["悬疑", "都市", "奇幻", "言情", "日常"].map((f) => /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  "aria-pressed": n.genre === f,
                  disabled: k,
                  onClick: () => a({ ...n, genre: f }),
                  children: f
                },
                f
              )) })
            ] }),
            [
              { key: "style", label: "文风", options: Ct },
              { key: "pov", label: "叙事视角", options: St },
              { key: "mode", label: "写作模式", options: $t }
            ].map(({ key: f, label: p, options: w }) => /* @__PURE__ */ s("label", { children: [
              p,
              /* @__PURE__ */ s(
                "select",
                {
                  "aria-label": p,
                  disabled: k,
                  value: n[f],
                  onChange: (y) => a({ ...n, [f]: y.target.value }),
                  children: [
                    /* @__PURE__ */ t("option", { value: "", children: "沿用创作要求" }),
                    w.map((y) => /* @__PURE__ */ t("option", { value: y.value, children: y.label }, y.value))
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
            ].map(({ key: f, label: p, placeholder: w }) => /* @__PURE__ */ s("label", { children: [
              p,
              /* @__PURE__ */ t(
                "input",
                {
                  "aria-label": p,
                  type: "number",
                  min: 1,
                  step: 1,
                  max: Number.MAX_SAFE_INTEGER,
                  placeholder: w,
                  disabled: k,
                  value: n[f] || "",
                  onChange: (y) => a({
                    ...n,
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
                  value: n.style_instructions,
                  onChange: (f) => a({ ...n, style_instructions: f.target.value })
                }
              )
            ] }),
            c && /* @__PURE__ */ t(
              "p",
              {
                role: "alert",
                className: "writing-preferences-full writing-inspiration-form-error",
                children: c
              }
            ),
            /* @__PURE__ */ s("div", { className: "writing-preferences-full writing-actions", children: [
              /* @__PURE__ */ t("button", { type: "button", disabled: b, onClick: o, children: "取消" }),
              /* @__PURE__ */ t("button", { type: "submit", className: "is-primary", disabled: k, children: b ? "保存中…" : "保存" })
            ] })
          ]
        }
      )
    }
  );
}
function jn({
  document: e,
  recoverableDraft: r,
  selection: i,
  value: o,
  readonly: n,
  onChange: a,
  onSelect: b,
  chapterOrder: l,
  onDeleteChapter: c,
  directory: h,
  navigationDisabled: v,
  onTextSelectionChange: k,
  selectionActionsRef: f,
  scoped: p = !1
}) {
  const w = (g) => a({ ...o, document: g }), y = (g, _, A) => /* @__PURE__ */ t(
    "div",
    {
      className: "writing-body",
      "aria-label": g,
      "data-writing-stream-target": i.kind === "unit" ? `unit:${i.id}:${i.tab === "plan" ? "plan" : "body"}` : void 0,
      children: /* @__PURE__ */ t(
        At,
        {
          kind: "richtext",
          contentFormat: "markdown",
          value: _,
          readonly: n,
          onTextSelectionChange: k,
          selectionActionsRef: f,
          onChange: A
        }
      )
    }
  );
  if (i.kind === "unit") {
    const g = Se(e.units), _ = g.byId.get(i.id), A = _?.unit;
    if (!A) return null;
    const R = i.tab === "plan" || !A.has_body && !o.unit?.body && !r;
    return /* @__PURE__ */ s(Ce, { children: [
      /* @__PURE__ */ s("div", { className: "writing-manuscript-heading", children: [
        /* @__PURE__ */ t("span", { className: "writing-manuscript-ordinal", children: _.label }),
        /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
          /* @__PURE__ */ t("span", { className: "writing-sr-only", children: "标题" }),
          /* @__PURE__ */ t(
            "input",
            {
              "aria-label": "标题",
              value: A.title,
              readOnly: n,
              onChange: (x) => w({
                ...e,
                units: Ye(e.units, A.id, {
                  title: x.target.value
                })
              })
            }
          )
        ] }),
        !p && /* @__PURE__ */ t("div", { className: "writing-chapter-neighbors", "aria-label": "切换章节", children: [
          { offset: -1, label: "上一章", Icon: Jt },
          { offset: 1, label: "下一章", Icon: Le }
        ].map(({ offset: x, label: z, Icon: D }) => {
          const T = g.canonical[_.ordinal - 1 + x];
          return /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: v || !T,
              title: T ? `${T.label}：${T.unit.title}` : void 0,
              onClick: () => T && b({
                kind: "unit",
                id: T.unit.id,
                tab: "body"
              }),
              children: [
                /* @__PURE__ */ t(D, { size: 14 }),
                z
              ]
            },
            z
          );
        }) }),
        !p && /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "writing-delete-chapter is-danger",
            disabled: n || l.handleProps(A.id).disabled,
            onClick: () => c(A.id),
            children: [
              /* @__PURE__ */ t(yt, { size: 14 }),
              "删除章节"
            ]
          }
        )
      ] }),
      R && i.tab !== "plan" && !A.has_body && /* @__PURE__ */ t("button", { className: "writing-plan-adopt", disabled: n || !o.unit || !A.plan.trim(), onClick: () => a({ ...o, unit: { ...o.unit, body: A.plan } }), children: "将当前内容作为正文保存" }),
      !R && r && !o.unit?.body && /* @__PURE__ */ s("section", { className: "writing-draft-recovery", "aria-label": "未完成正文草稿", children: [
        /* @__PURE__ */ t("p", { children: "上次生成已中断，正文草稿已保留。" }),
        /* @__PURE__ */ t("button", { disabled: n, onClick: () => o.unit && a({ ...o, unit: { ...o.unit, body: r } }), children: "恢复草稿" })
      ] }),
      R ? y(
        "章纲或正文草稿",
        A.plan,
        (x) => w({
          ...e,
          units: Ye(e.units, A.id, {
            plan: x
          })
        })
      ) : o.unit && y(
        "正文",
        o.unit.body,
        (x) => a({ ...o, unit: { ...o.unit, body: x } })
      )
    ] });
  }
  if (i.kind === "section" && i.id === "chapters")
    return /* @__PURE__ */ t(Mt, { page: h.page, onPage: h.setPage, onSelect: b, readonly: n, navigationDisabled: v, chapterOrder: l });
  if (i.kind === "section" && $e(i.id)) {
    const g = i.id;
    return y("内容", e.outline[g], (_) => w({ ...e, outline: { ...e.outline, [g]: _ } }));
  }
  const N = Oe(i);
  if (!N) return null;
  const d = xt.find((g) => g.id === N).label, u = e.outline[N];
  if (i.kind !== "entity") return null;
  const S = u.find((g) => g.id === i.id);
  if (!S) return null;
  const $ = (g) => w({
    ...e,
    outline: {
      ...e.outline,
      [N]: u.map(
        (_) => _.id === S.id ? { ..._, ...g } : _
      )
    }
  });
  return /* @__PURE__ */ s(Ce, { children: [
    /* @__PURE__ */ s("label", { className: "writing-title-field", children: [
      /* @__PURE__ */ s("span", { className: "writing-sr-only", children: [
        d,
        "名称"
      ] }),
      /* @__PURE__ */ t(
        "input",
        {
          "aria-label": `${d}名称`,
          value: S.name,
          readOnly: n,
          onChange: (g) => $({ name: g.target.value })
        }
      )
    ] }),
    y(
      `${d}描述`,
      S.description,
      (g) => $({ description: g })
    )
  ] });
}
function Gn({
  selection: e,
  disabled: r,
  closeDisabled: i,
  onSave: o,
  onClose: n
}) {
  const [a, b] = B({
    title: "",
    description: ""
  }), [l, c] = B(!1), [h, v] = B(""), k = O(!1), f = Oe(e), p = f ? xt.find((w) => w.id === f).label : "章节";
  return /* @__PURE__ */ t(
    Re,
    {
      title: `添加${p}`,
      className: "writing-entry-dialog",
      closeDisabled: i || l,
      onClose: n,
      children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ s(
          "form",
          {
            className: "writing-new-form",
            onSubmit: async (w) => {
              if (w.preventDefault(), !(r || k.current)) {
                k.current = !0, c(!0), v("");
                try {
                  await o(a) || v("保存未成功，输入已保留，请重试。");
                } catch (y) {
                  v(
                    y instanceof Error ? y.message : "保存失败，输入已保留。"
                  );
                } finally {
                  k.current = !1, c(!1);
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
                    disabled: r || l,
                    value: a.title,
                    onChange: (w) => b({ ...a, title: w.target.value })
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
                    disabled: r || l,
                    value: a.description,
                    onChange: (w) => b({ ...a, description: w.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ t(
                "button",
                {
                  className: "is-primary",
                  type: "submit",
                  disabled: r || l || !a.title.trim(),
                  children: "保存并打开"
                }
              )
            ]
          }
        ),
        h && /* @__PURE__ */ t("p", { className: "writing-error", role: "alert", children: h })
      ] })
    }
  );
}
function Lt({
  document: e,
  savedDocument: r = e,
  selection: i,
  body: o,
  selectedCharacters: n
}) {
  const a = i.kind === "unit" ? Se(e.units).byId.get(i.id)?.unit : void 0, b = Oe(i), l = i.kind === "section" && i.id === "chapters", c = i.kind === "section" && !!b, h = i.kind === "unit" && i.tab === "plan", k = !!kt(e, i, o).trim(), f = Rt(e, i) + (a ? h ? " · 本章剧情" : " · 正文" : "");
  let p = k ? "重写当前内容" : "生成当前内容";
  n ? p = "修改选中文字" : l ? p = e.units.length ? "添加章节" : "规划章节剧情" : c ? p = `${e.outline[b].length ? "更新" : "生成"}${f}` : i.kind === "section" && $e(i.id) && !k ? p = `生成${f}` : a && !h && !k && (p = "生成本章正文");
  const w = l ? e.units.length ? "append" : "generate_chapters" : a && !h && !k ? "generate_units" : c || h || !k ? "generate_section" : "propose_edit", y = ke(r, w, {
    section_id: h ? "chapter_plan" : b || (i.kind === "section" && $e(i.id) ? i.id : void 0),
    unit_id: a?.id,
    unit_ids: a ? [a.id] : void 0,
    mode: "single"
  });
  return {
    selected: a,
    entitySection: b,
    entityList: c,
    directory: l,
    chapterPlan: h,
    hasContent: k,
    label: f,
    primaryLabel: p,
    available: !y,
    reason: y,
    instruction: n ? "修改选中的文字，保留原意并使表达自然流畅。" : k ? "重写当前内容，保持作品设定和上下文一致。" : `生成${f}，参考作品已有设定。`,
    remaining: Se(e.units).firstUnwritten >= 0
  };
}
function Jn(e, r, i) {
  const { selection: o } = e, n = Lt(e), a = { instruction: r };
  return i ? { action: "generate_units", extra: { ...a, mode: "continue" } } : n.directory ? e.document.units.length ? { action: "append", extra: { ...a, count: 1 } } : { action: "generate_chapters", extra: a } : n.entityList ? {
    action: "generate_section",
    extra: { ...a, section_id: n.entitySection }
  } : n.selected && n.chapterPlan && !n.hasContent ? {
    action: "generate_section",
    extra: {
      ...a,
      section_id: "chapter_plan",
      unit_id: n.selected.id
    }
  } : n.selected && !n.chapterPlan && !n.hasContent ? {
    action: "generate_units",
    extra: { ...a, mode: "single", unit_ids: [n.selected.id] }
  } : o.kind === "section" && $e(o.id) && !n.hasContent ? {
    action: "generate_section",
    extra: { ...a, section_id: o.id }
  } : (n.selected ? (a.unit_id = n.selected.id, n.chapterPlan && (a.section_id = "chapter_plan")) : (a.section_id = n.entitySection || (o.kind === "section" && $e(o.id) ? o.id : void 0), o.kind === "entity" && (a.entity_id = o.id)), a.instruction ||= n.instruction, { action: "propose_edit", extra: a });
}
function Qn({
  document: e,
  savedDocument: r,
  onConfirmationChange: i,
  selection: o,
  disabled: n,
  body: a,
  selectedCharacters: b,
  onClearSelection: l,
  onAction: c,
  proposalPending: h,
  proposalReady: v,
  proposalPreview: k,
  running: f,
  onApply: p,
  onDiscard: w,
  directory: y,
  activeBatchIds: N
}) {
  const [d, u] = B(""), S = o.kind === "section" && o.id !== "chapters", [$, g] = B(
    String(pn)
  ), [_, A] = B(""), R = $ === "custom" ? /^\d+$/.test(_) ? Number(_) : Number.NaN : Number($), x = yn(R), [z, D] = B(""), T = Be(
    () => fn(r.units),
    [r.units]
  ), V = T.slice(0, mn), K = ht(
    r.units,
    r.preferences.planned_chapters
  ), Y = ht(
    r.units,
    r.preferences.planned_chapters,
    z === "" ? void 0 : Number(z)
  ), ne = ke(r, "append", {
    count: Y.count
  }), ie = ne ? "规划后续章节" : `规划第 ${Y.start}—${Y.end} 章`, G = Be(
    () => f && N?.length ? N.flatMap((m) => {
      const E = y.index.byId.get(m);
      return E ? [E] : [];
    }) : wn(r.units, R),
    [r.units, R, f, N, y.index]
  ), [de, re] = B(!1), Q = O(!1), [ee, P] = B(null), [se, pe] = B(""), ye = {
    document: e,
    savedDocument: r,
    selection: o,
    body: a,
    selectedCharacters: b
  }, W = Lt(ye), ae = n || de || h, j = async (m, E = {}) => {
    if (ae || Q.current || ke(r, m, E)) return !1;
    Q.current = !0, re(!0);
    try {
      const I = await c(m, {
        instruction: d.trim(),
        ...E
      });
      return I && u(""), I;
    } finally {
      Q.current = !1, re(!1);
    }
  }, Z = (m, E = {}) => {
    if (ae || Q.current || ke(r, m, E))
      return;
    const I = Sn(r, m, E);
    I ? (P({ action: m, extra: E, impact: I }), pe(""), i(!0)) : j(m, E);
  }, ue = () => {
    P(null), i(!1);
  }, fe = (m = !1, E = "") => {
    const { action: I, extra: q } = Jn(
      ye,
      [E, d.trim()].filter(Boolean).join(`
`),
      m
    );
    Z(
      I,
      m ? { ...q, count: R } : q
    );
  }, ge = !b && (S || W.directory || W.selected && !W.chapterPlan && W.hasContent);
  let H;
  !b && !W.chapterPlan && !W.entityList && !W.selected && (r.units.length || (H = {
    label: "生成大纲与剧情",
    action: "generate_outline",
    extra: {}
  }));
  const he = H ? ke(r, H.action, H.extra) : "", we = T.length > 0 && o.kind !== "entity" && !W.chapterPlan && !b, oe = W.selected?.has_body && (W.selected.continuity_status === "pending" || W.selected.continuity_status === "raw_pending" || W.selected.dependency_stale), le = (S || W.directory) && r.units.length > 0 && K.count > 0, be = we || H || oe || le || ge;
  return /* @__PURE__ */ s("div", { className: "writing-controls", role: "group", "aria-label": "AI 创作", children: [
    !b && /* @__PURE__ */ t("p", { className: "writing-ai-current", "aria-label": "当前 AI 目标", children: W.label }),
    b > 0 && /* @__PURE__ */ s("div", { className: "writing-ai-target", children: [
      /* @__PURE__ */ t("span", { children: "修改选中文字" }),
      /* @__PURE__ */ s("div", { className: "writing-row", children: [
        /* @__PURE__ */ s("small", { children: [
          b,
          " 字"
        ] }),
        /* @__PURE__ */ t("button", { disabled: h, onClick: l, children: "清除选区" })
      ] })
    ] }),
    !h && /* @__PURE__ */ s("label", { children: [
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
          value: d,
          onChange: (m) => u(m.target.value)
        }
      )
    ] }),
    h ? /* @__PURE__ */ s("section", { className: "writing-proposal-preview", "aria-label": "AI 修改建议", children: [
      /* @__PURE__ */ s("div", { className: "writing-row", children: [
        /* @__PURE__ */ t("h4", { children: "修改建议" }),
        /* @__PURE__ */ t("span", { role: "status", children: v ? "等待应用" : f ? "正在生成…" : "未完成" })
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
            disabled: n || !v,
            onClick: p,
            children: "应用修改"
          }
        ),
        /* @__PURE__ */ t("button", { disabled: n, onClick: w, children: "丢弃建议" })
      ] })
    ] }) : /* @__PURE__ */ s(Ce, { children: [
      be && /* @__PURE__ */ s("section", { className: "writing-ai-next", "aria-label": "接下来", children: [
        we && /* @__PURE__ */ s(
          "section",
          {
            className: "writing-primary-action",
            "aria-label": "后续剧情同步",
            children: [
              /* @__PURE__ */ s("div", { className: "writing-ai-section-heading", children: [
                /* @__PURE__ */ s("span", { children: [
                  /* @__PURE__ */ t(Qt, { size: 14 }),
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
                    unit_ids: V.map(({ unit: m }) => m.id)
                  }),
                  children: [
                    "同步后续剧情 ",
                    /* @__PURE__ */ t(Le, { size: 15 })
                  ]
                }
              ),
              /* @__PURE__ */ s("small", { className: "writing-batch-range", children: [
                je(T),
                T.length > V.length ? ` · 本批 ${V.length} 章` : ""
              ] })
            ]
          }
        ),
        H && !b && /* @__PURE__ */ s("div", { className: "writing-ai-actions writing-primary-action", children: [
          /* @__PURE__ */ s(
            "button",
            {
              className: "is-primary",
              disabled: ae || !!he,
              title: he || void 0,
              onClick: () => Z(H.action, H.extra),
              children: [
                H.label,
                /* @__PURE__ */ t(Le, { size: 15, "aria-hidden": "true" })
              ]
            }
          ),
          he && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: he })
        ] }),
        oe && /* @__PURE__ */ s("details", { className: "writing-ai-more", open: !we, children: [
          /* @__PURE__ */ t("summary", { children: "整理本章衔接" }),
          /* @__PURE__ */ s("div", { className: "writing-primary-action", children: [
            /* @__PURE__ */ t("p", { className: "writing-ai-note", children: W.selected?.continuity_status === "raw_pending" ? "正文已保存，可继续写作。" : "正文已保存，补充剧情衔接后再继续。" }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "is-primary",
                disabled: ae,
                onClick: () => Z("retry_continuity", {
                  unit_id: W.selected.id,
                  expected_unit_version_id: W.selected.version_id
                }),
                children: "整理本章衔接"
              }
            )
          ] })
        ] }),
        le && /* @__PURE__ */ s(
          "details",
          {
            className: "writing-ai-more",
            open: !ge && !we && !oe,
            children: [
              /* @__PURE__ */ t("summary", { children: "规划更多章节" }),
              /* @__PURE__ */ s("div", { className: "writing-plan-more", children: [
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
                      value: z,
                      placeholder: String(K.count),
                      disabled: ae,
                      onChange: (m) => D(m.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ t(
                  "button",
                  {
                    disabled: ae || !!ne,
                    title: ne || void 0,
                    onClick: () => Z("append", { count: Y.count }),
                    children: ie
                  }
                ),
                ne && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: ne })
              ] })
            ]
          }
        ),
        ge && /* @__PURE__ */ s("details", { className: "writing-ai-more", open: !we && !oe, children: [
          /* @__PURE__ */ t("summary", { children: "继续写正文" }),
          /* @__PURE__ */ s(
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
                      value: $,
                      onChange: (m) => g(m.target.value),
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
                $ === "custom" && /* @__PURE__ */ s("label", { className: "writing-count-field writing-custom-batch", children: [
                  /* @__PURE__ */ t("span", { children: "正文章数" }),
                  /* @__PURE__ */ t(
                    "input",
                    {
                      "aria-label": "自定义正文章数",
                      inputMode: "numeric",
                      value: _,
                      placeholder: `1—${bn}`,
                      disabled: ae,
                      "aria-invalid": !!x,
                      onChange: (m) => A(m.target.value)
                    }
                  )
                ] }),
                x && /* @__PURE__ */ t("small", { className: "writing-ai-note", role: "alert", children: x }),
                !x && G.length > 0 && /* @__PURE__ */ t("small", { className: "writing-batch-range", children: je(G) }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    className: !we && !oe ? "is-primary" : void 0,
                    disabled: ae || !!x || !W.remaining || !!ke(r, "generate_units", {
                      mode: "continue",
                      count: R
                    }),
                    title: ke(r, "generate_units", {
                      mode: "continue",
                      count: R
                    }) || void 0,
                    onClick: () => fe(!0),
                    children: [
                      "生成本批正文",
                      /* @__PURE__ */ t(Le, { size: 14, "aria-hidden": "true" })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      (!W.directory || !W.available) && /* @__PURE__ */ s(
        "details",
        {
          className: "writing-ai-more",
          open: !be || b > 0,
          children: [
            /* @__PURE__ */ t("summary", { children: "修改当前内容" }),
            /* @__PURE__ */ s("section", { className: "writing-ai-revision", "aria-label": "内容修改", children: [
              !W.directory && !W.entityList && W.hasContent && /* @__PURE__ */ t("div", { className: "writing-quick-actions", "aria-label": "快捷修改", children: [
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
                  disabled: ae || !W.available,
                  onClick: () => fe(!1, m.instruction),
                  children: m.label
                },
                m.label
              )) }),
              /* @__PURE__ */ t("div", { className: "writing-ai-actions", children: !W.directory && (!S || W.hasContent) && /* @__PURE__ */ t(
                "button",
                {
                  className: H && !b ? void 0 : "is-primary",
                  disabled: ae || !W.available,
                  onClick: () => fe(),
                  children: b ? "修改选中文字" : W.hasContent && !W.directory && !W.entityList ? "生成修改建议" : W.primaryLabel
                }
              ) }),
              !W.available && /* @__PURE__ */ t("p", { className: "writing-ai-note", children: W.reason })
            ] })
          ]
        }
      )
    ] }),
    ee && /* @__PURE__ */ t(
      It,
      {
        title: "确认更新范围",
        description: ee.impact,
        confirmLabel: "确认更新",
        pending: de,
        disabled: ae,
        error: se,
        onClose: () => {
          Q.current || ue();
        },
        onConfirm: async () => {
          await j(ee.action, ee.extra) ? ue() : Q.current || pe("更新未成功，原内容已保留，请重试。");
        }
      }
    )
  ] });
}
function Xn({
  timing: e
}) {
  const [r] = B(Date.now), i = on(!0), o = Bn(
    Math.max(0, i - (e?.startedAt || r))
  ), n = e?.source === "server" ? `已用 ${o}` : `本次查看已用 ${o}`;
  return /* @__PURE__ */ s("span", { className: "writing-generation-clock", role: "timer", "aria-live": "off", children: [
    /* @__PURE__ */ t(Zt, { size: 13, "aria-hidden": "true" }),
    n
  ] });
}
function Zn({
  snapshot: e,
  running: r,
  generationTiming: i,
  children: o
}) {
  r && e?.document.status !== "running" && (e = null);
  const n = i && i.workAssetId === e?.work_asset_id && i.runId === e.run_id && i.requestId === e.request_id ? i : null;
  if (!r) return null;
  const a = e?.checkpoint, b = $n(e), l = Number(a?.target) || 0, c = Math.max(
    0,
    Math.min(l, Number(a?.completed) || 0)
  );
  return /* @__PURE__ */ s("div", { className: "writing-generation-progress", children: [
    /* @__PURE__ */ s(
      "span",
      {
        className: "writing-generation-task",
        role: "status",
        title: Ge(e),
        children: [
          /* @__PURE__ */ t(Xt, { size: 14, className: "ws-spin", "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: Ge(e) })
        ]
      }
    ),
    /* @__PURE__ */ t(
      Xn,
      {
        timing: n
      },
      `${e?.work_asset_id}:${e?.run_id}:${e?.request_id}`
    ),
    (b || l > 1) && /* @__PURE__ */ t("span", { className: `writing-generation-count${b ? " is-planning" : ""}`, children: b || `已完成 ${c}/${l}` }),
    o
  ] });
}
function ei({
  snapshot: e,
  inline: r = !1,
  preview: i,
  generationTiming: o,
  running: n,
  busy: a,
  readonly: b,
  error: l,
  conflicted: c,
  reloadDisabled: h,
  onReload: v,
  onRetry: k,
  onStop: f
}) {
  const [p, w] = B(!1), [y, N] = B(!1), u = (e?.document.units.filter((R) => R.continuity_status === "raw_pending") || []).map((R) => `${R.title}：${R.continuity_findings?.find((x) => x.code === "continuity_generation")?.message || "剧情衔接尚未整理完成，可在写作工具中重新整理。"}`).join(`
`), S = l || (n ? "" : u), $ = Bt(e), g = $ && e ? ke(e.document, $.action, $.extra) : "", _ = e?.document.status === "stopped" && !!(e.checkpoint?.history_total && (e.checkpoint.history_completed || 0) < e.checkpoint.history_total), A = e?.checkpoint?.phase === "continuity" && !_ ? "正文已保存，衔接整理未完成" : `${Ge(e)}未完成`;
  return /* @__PURE__ */ s("div", { className: `writing-feedback${r ? " is-title-status" : ""}`, children: [
    /* @__PURE__ */ t(
      Zn,
      {
        snapshot: e,
        preview: i,
        running: n,
        generationTiming: o,
        children: n && /* @__PURE__ */ s(
          "button",
          {
            disabled: a || b || !e?.run_id || e.document.status !== "running",
            onClick: () => {
              f();
            },
            children: [
              /* @__PURE__ */ t(en, { size: 13 }),
              "停止生成"
            ]
          }
        )
      }
    ),
    S && !c && /* @__PURE__ */ s("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t(tn, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ t("p", { children: l ? $ ? A : "本次操作未完成" : "正文已保存，剧情衔接待整理" }),
      /* @__PURE__ */ t("button", { onClick: () => N(!0), children: "查看原因" }),
      !$ && /* @__PURE__ */ t("button", { disabled: h, onClick: () => {
        v();
      }, children: "刷新状态" })
    ] }),
    y && S && /* @__PURE__ */ t(Re, { title: "未完成原因", onClose: () => N(!1), children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
      /* @__PURE__ */ t("p", { className: "writing-error-detail", children: S }),
      /* @__PURE__ */ s("div", { className: "writing-actions", children: [
        /* @__PURE__ */ t("button", { onClick: () => N(!1), children: "返回编辑" }),
        /* @__PURE__ */ t(
          "button",
          {
            disabled: h,
            onClick: async () => {
              await v(), N(!1);
            },
            children: "刷新状态"
          }
        )
      ] })
    ] }) }),
    c && /* @__PURE__ */ s("div", { role: "alert", className: "writing-error", children: [
      /* @__PURE__ */ t("p", { children: "作品已在其他窗口更新。当前未保存内容已保留，请先复制需要保留的修改。" }),
      /* @__PURE__ */ t("button", { disabled: a, onClick: () => w(!0), children: "载入最新版" })
    ] }),
    p && /* @__PURE__ */ t(
      Re,
      {
        title: "载入最新版",
        closeDisabled: a,
        onClose: () => w(!1),
        children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
          /* @__PURE__ */ t("p", { children: "载入最新版将放弃当前未保存修改，请先复制需要保留的内容。" }),
          /* @__PURE__ */ s("div", { className: "writing-actions", children: [
            /* @__PURE__ */ t(
              "button",
              {
                disabled: a,
                onClick: async () => {
                  await v(), w(!1);
                },
                children: "放弃修改并载入"
              }
            ),
            /* @__PURE__ */ t("button", { disabled: a, onClick: () => w(!1), children: "保留编辑" })
          ] })
        ] })
      }
    ),
    e && $ && /* @__PURE__ */ s("div", { className: "writing-progress", children: [
      (_ || !l) && /* @__PURE__ */ t("span", { children: _ ? `前文已整理 ${e.checkpoint?.history_completed || 0}/${e.checkpoint?.history_total}` : A }),
      /* @__PURE__ */ t(
        "button",
        {
          disabled: a || b || n || c || !!g,
          title: g || void 0,
          onClick: k,
          children: _ ? "继续整理" : e?.checkpoint?.action === "generate_units" ? "继续原批次" : "重试这一步"
        }
      ),
      g && /* @__PURE__ */ t("small", { children: g })
    ] })
  ] });
}
function ti({
  document: e,
  selection: r,
  disabled: i,
  mutationDisabled: o,
  onSelect: n,
  onAdd: a,
  chapterOrder: b,
  directory: l
}) {
  const c = O(null), [h, v] = B(0), [k, f] = B(400), p = Be(() => [...l.rows].reverse(), [l.rows]), w = l.index.byId.get(l.focus.id), y = w ? w.ordinal - 1 : 0;
  Ne(() => {
    const S = c.current;
    if (!S) return;
    const $ = new ResizeObserver(() => f(S.clientHeight));
    return $.observe(S), () => $.disconnect();
  }, []), Ne(() => {
    c.current && (c.current.scrollTop = 0);
  }, [l.query]), Ne(() => {
    c.current && (c.current.scrollTop = y * Pe);
  }, [l.focus, y]);
  const N = vn(p.length, h, k), d = Xe, u = { kind: "section", id: "chapters" };
  return /* @__PURE__ */ s("nav", { className: "writing-nav", "aria-label": "创作目录", children: [
    /* @__PURE__ */ s(
      "button",
      {
        disabled: i,
        "aria-current": r?.kind !== "unit" && !(r?.kind === "section" && r.id === "chapters") ? "page" : void 0,
        onClick: () => n({ kind: "section", id: "overview" }),
        children: [
          /* @__PURE__ */ t(nn, { size: 16 }),
          /* @__PURE__ */ t("span", { children: "大纲" })
        ]
      }
    ),
    /* @__PURE__ */ s("div", { className: "writing-unit-nav", "aria-label": d.directory, children: [
      /* @__PURE__ */ s("div", { className: "writing-directory-heading", children: [
        /* @__PURE__ */ s(
          "button",
          {
            className: "writing-directory-link",
            disabled: i || !!xe(e, u),
            title: xe(e, u) || void 0,
            "aria-current": r?.kind === "section" && r.id === "chapters" ? "page" : void 0,
            onClick: () => n(u),
            children: [
              /* @__PURE__ */ t("span", { children: d.directory }),
              /* @__PURE__ */ t("small", { children: l.index.canonical.length })
            ]
          }
        ),
        /* @__PURE__ */ t(
          "button",
          {
            className: "writing-add-unit",
            "aria-label": `添加${d.append}`,
            title: `添加${d.append}`,
            disabled: i || o,
            onClick: () => a(u),
            children: /* @__PURE__ */ t(Qe, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ s("div", { className: "writing-chapter-tools", children: [
        /* @__PURE__ */ t(
          "input",
          {
            "aria-label": "搜索章节标题",
            placeholder: "查找章节名或章号",
            value: l.query,
            disabled: i,
            onChange: (S) => l.search(S.target.value)
          }
        ),
        l.query && /* @__PURE__ */ s("small", { children: [
          p.length,
          " 个匹配章节"
        ] })
      ] }),
      /* @__PURE__ */ s(
        "div",
        {
          ref: c,
          className: "writing-chapter-viewport",
          "aria-label": "章节目录列表",
          role: "list",
          tabIndex: 0,
          onScroll: (S) => v(S.currentTarget.scrollTop),
          onKeyDown: (S) => {
            if (S.altKey || S.ctrlKey || S.metaKey || !p.length)
              return;
            const $ = S.target instanceof Element ? Number(
              S.target.closest("[data-chapter-index]")?.dataset.chapterIndex ?? -1
            ) : -1, g = $ < 0 ? Math.floor(h / Pe) : $, _ = Math.max(
              1,
              Math.floor(k / Pe)
            ), A = {
              ArrowUp: g - 1,
              ArrowDown: g + 1,
              Home: 0,
              End: p.length - 1,
              PageUp: g - _,
              PageDown: g + _
            };
            if (!(S.key in A)) return;
            S.preventDefault();
            const R = Math.max(
              0,
              Math.min(p.length - 1, A[S.key])
            );
            S.currentTarget.scrollTop = R * Pe, v(S.currentTarget.scrollTop), requestAnimationFrame(() => {
              c.current?.querySelector(
                `[data-chapter-index="${R}"] > button:first-child`
              )?.focus();
            });
          },
          children: [
            /* @__PURE__ */ t(
              "div",
              {
                className: "writing-chapter-window",
                style: { height: N.height },
                children: l.rows.slice(N.start, N.end).map((S, $) => {
                  const { unit: g } = S, _ = {
                    kind: "unit",
                    id: g.id,
                    tab: "body"
                  }, A = xe(e, _);
                  return /* @__PURE__ */ s(
                    "div",
                    {
                      className: "writing-nav-entry",
                      role: "listitem",
                      "aria-posinset": N.start + $ + 1,
                      "aria-setsize": p.length,
                      "data-chapter-index": N.start + $,
                      style: {
                        position: "absolute",
                        top: (N.start + $) * Pe,
                        height: Pe
                      },
                      ...b.itemProps(g.id),
                      children: [
                        /* @__PURE__ */ t(
                          "button",
                          {
                            disabled: i || !!A,
                            title: A || void 0,
                            "aria-label": `${S.label}：${g.title}`,
                            "aria-current": r?.kind === "unit" && r.id === g.id ? "page" : void 0,
                            onClick: () => n(_),
                            children: /* @__PURE__ */ s("span", { children: [
                              /* @__PURE__ */ s("span", { className: "writing-nav-meta", children: [
                                /* @__PURE__ */ t("small", { children: S.label }),
                                /* @__PURE__ */ t("small", { className: g.has_body ? "is-written" : void 0, children: Nt(g) })
                              ] }),
                              /* @__PURE__ */ t("strong", { title: g.title, children: g.title })
                            ] })
                          }
                        ),
                        /* @__PURE__ */ t(
                          Wt,
                          {
                            order: b,
                            id: g.id,
                            title: g.title
                          }
                        )
                      ]
                    },
                    g.id || S.ordinal
                  );
                })
              }
            ),
            !p.length && /* @__PURE__ */ t("p", { className: "writing-chapter-empty", children: l.query ? "没有匹配的章节" : "暂无章节" })
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
  workAssetId: i,
  activeRunId: o,
  busy: n,
  readonly: a,
  commandError: b,
  onStop: l,
  onClose: c
}) {
  const [h, v] = B([]), [k, f] = B(!1), [p, w] = B(!1), [y, N] = B(""), [d, u] = B(!1), [S, $] = B(!1), g = O(!1), _ = O(0), A = O(!1), R = O(!0), x = te(
    async (T = !1) => {
      if (!A.current) {
        A.current = !0, w(!0);
        try {
          const V = T ? _.current : 0, K = await ln({
            projectId: e,
            canvasId: r,
            workAssetId: i,
            beforeId: V
          });
          if (!R.current) return;
          v(
            (Y) => T ? [
              ...Y,
              ...K.items.filter(
                (ne) => !Y.some((ie) => ie.id === ne.id)
              )
            ] : K.items
          ), _.current = K.beforeId, f(
            K.hasMore && K.beforeId > 0 && K.beforeId !== V
          ), N("");
        } catch (V) {
          R.current && N(V instanceof Error ? V.message : "读取运行记录失败");
        } finally {
          A.current = !1, R.current && w(!1);
        }
      }
    },
    [r, e, i]
  );
  Ne(() => (R.current = !0, x(), () => {
    R.current = !1;
  }), [x, o]);
  const z = async () => {
    if (!(n || a || g.current)) {
      g.current = !0, u(!0), $(!0);
      try {
        await l(), await x();
      } catch (T) {
        N(T instanceof Error ? T.message : "停止运行失败");
      } finally {
        g.current = !1, u(!1);
      }
    }
  }, D = y || (S && !d ? b : "");
  return /* @__PURE__ */ t(
    Re,
    {
      title: "运行记录",
      className: "writing-runs-dialog",
      closeDisabled: d,
      onClose: c,
      children: /* @__PURE__ */ s("div", { className: "writing-dialog-scroll", children: [
        /* @__PURE__ */ t("div", { className: "writing-actions", children: /* @__PURE__ */ t("button", { disabled: p || d, onClick: () => {
          x();
        }, children: "刷新" }) }),
        D && /* @__PURE__ */ t("p", { role: "alert", className: "writing-error", children: D }),
        h.map((T) => /* @__PURE__ */ s("article", { className: "writing-run-entry", children: [
          /* @__PURE__ */ s("div", { className: "writing-row", children: [
            /* @__PURE__ */ t("strong", { children: En(T.action) }),
            /* @__PURE__ */ t("span", { className: "writing-run-status", children: ni[An(T.status)] })
          ] }),
          /* @__PURE__ */ t("p", { className: "writing-run-time", children: vt(T.created_at || T.updated_at) }),
          T.checkpoint && T.checkpoint.target > 0 && /* @__PURE__ */ s("p", { className: "writing-run-progress", children: [
            "已完成 ",
            T.checkpoint.completed,
            "/",
            T.checkpoint.target
          ] }),
          T.instruction && /* @__PURE__ */ t("p", { className: "writing-run-instruction", children: T.instruction }),
          T.error && /* @__PURE__ */ t("p", { className: "writing-error", children: T.error }),
          T.id === o && In(T.status) && /* @__PURE__ */ t(
            "button",
            {
              disabled: n || a || d,
              onClick: () => {
                z();
              },
              children: d ? "正在停止…" : "停止本次运行"
            }
          )
        ] }, T.id)),
        !h.length && !p && /* @__PURE__ */ t("p", { children: "暂无运行记录" }),
        p && /* @__PURE__ */ t("p", { role: "status", children: "正在读取记录…" }),
        k && /* @__PURE__ */ t(
          "button",
          {
            disabled: p || d,
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
function ri(e, r) {
  const i = Be(() => Se(e), [e]), [o, n] = B(""), [a, b] = B(0), [l, c] = B({
    id: "",
    revision: 0
  }), h = Be(
    () => _n(i, o),
    [i, o]
  ), v = te(
    (d) => {
      const u = i.byId.get(d);
      return u ? (n(""), b(
        Math.floor(
          (i.canonical.length - u.ordinal) / Ee
        )
      ), c((S) => ({ id: d, revision: S.revision + 1 })), !0) : !1;
    },
    [i]
  ), k = r?.kind === "unit" ? r.id : "", f = i.byId.get(k)?.ordinal || 0, p = `${k}:${f}`, [w, y] = B(""), N = te((d) => {
    n(d), b(0);
  }, []);
  return p !== w && (y(p), k && v(k)), {
    index: i,
    rows: h,
    query: o,
    search: N,
    locate: v,
    focus: l,
    page: Et(h, a),
    setPage: b,
    byNumber: (d) => {
      if (/^\d+$/.test(d.trim()))
        return i.canonical[Number(d) - 1];
    }
  };
}
function si(e) {
  return [...e].reverse();
}
function ai(e, r, i, o, n = "reversed") {
  const a = Tn(
    e,
    r,
    i,
    n === "canonical" ? o : o === "before" ? "after" : "before",
    (b) => b.id
  );
  return a.every((b, l) => b === e[l]) ? e : a;
}
function oi({
  disabled: e,
  reason: r,
  getDocument: i,
  flush: o,
  onSave: n
}) {
  const [a, b] = B(!1), [l, c] = B(null), h = O(""), [v, k] = B(""), f = O(!1), p = () => {
    h.current = "", k(""), c(null);
  }, w = async (N, d, u, S) => {
    if (e || f.current || N === d) return !1;
    f.current = !0, b(!0), p();
    try {
      if (!await o()) return !1;
      const $ = i();
      if (!$) return !1;
      const g = ai(
        $.units,
        N,
        d,
        u,
        S
      );
      return g === $.units ? !1 : await n({ ...$, units: g });
    } finally {
      f.current = !1, b(!1);
    }
  }, y = e || a;
  return {
    pending: a,
    itemProps: (N, d = "reversed") => ({
      draggable: !y && !!N,
      "data-dragging": !!N && v === N || void 0,
      onDragStart: (u) => {
        if (y || !N || u.target instanceof Element && u.target.closest("input,textarea,select,[contenteditable=true],[data-writing-drag-ignore]")) {
          u.preventDefault();
          return;
        }
        h.current = N, k(N), u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", N);
      },
      onDragEnd: p,
      "data-drop": l?.id === N ? l.placement : void 0,
      onDragOver: (u) => {
        if (y || !h.current || h.current === N) return;
        u.preventDefault(), u.dataTransfer.dropEffect = "move";
        const S = u.currentTarget.getBoundingClientRect();
        c({
          id: N,
          placement: u.clientY < S.top + S.height / 2 ? "before" : "after"
        });
      },
      onDragLeave: (u) => {
        u.currentTarget.contains(u.relatedTarget) || c(null);
      },
      onDrop: (u) => {
        if (y || !h.current) return;
        u.preventDefault();
        const S = u.currentTarget.getBoundingClientRect();
        return w(
          h.current,
          N,
          u.clientY < S.top + S.height / 2 ? "before" : "after",
          d
        );
      }
    }),
    handleProps: (N, d = "reversed") => ({
      disabled: y || !N,
      title: y ? r || "正在保存章节顺序" : "拖动排序，或按 Alt + ↑ / ↓ 调整位置",
      onKeyDown: (u) => {
        if (!u.altKey || !["ArrowUp", "ArrowDown"].includes(u.key) || (u.preventDefault(), y)) return;
        const S = i()?.units || [], $ = d === "canonical" ? S : si(S), g = $.findIndex((A) => A.id === N), _ = $[g + (u.key === "ArrowUp" ? -1 : 1)];
        if (_)
          return w(
            N,
            _.id,
            u.key === "ArrowUp" ? "before" : "after",
            d
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
function ci(e, r, i, o) {
  const n = o?.action === "generate_outline" ? o.phase : void 0, a = r.kind === "section" && r.id !== "chapters" && n && li[n] || null;
  return !i || n && i.phase !== n ? a : di(e, r, i, o) || a;
}
function di(e, r, i, o) {
  const n = i.active_field.replace(/\[(\d+)\]/g, ".$1");
  if (n.startsWith("preferences.")) return r.kind === "section" ? "preferences" : null;
  if (!n || n === "replacement" || r.kind === "entity")
    return null;
  if (r.kind === "unit") {
    const h = r.tab === "plan";
    if (i.unit_id === r.id && n === (h ? "plan" : "body") && (!h || i.section_id === "chapter_plan"))
      return `unit:${r.id}:${h ? "plan" : "body"}`;
  }
  const a = /^units\.(\d+)\.(title|plan)$/.exec(n);
  if (a) {
    const h = Number(a[1]), v = o?.action === "generate_chapters" && o.unit_ids.length ? Se(e.units).byId.get(
      o.unit_ids[h]
    )?.ordinal : h + (o?.action === "append" ? e.units.length : 0) + 1;
    return v === void 0 ? null : r.kind === "section" ? `chapter:${v - 1}` : r.kind === "unit" && r.tab === "plan" && e.units[v - 1]?.id === r.id ? `unit:${r.id}:plan` : null;
  }
  if (r.kind !== "section" || r.id === "chapters") return null;
  const b = n.startsWith("outline.") ? n.slice(8) : n === "content" ? i.section_id : void 0;
  if (b && $e(b)) return `outline:${b}`;
  const l = /^outline\.(characters|locations|props)\.(\d+)\./.exec(n);
  if (l) return `outline:${l[1]}:${l[2]}`;
  const c = /^entities\.(\d+)\./.exec(n);
  return c && i.section_id ? `outline:${i.section_id}:${c[1]}` : null;
}
function bt({
  scope: e,
  target: r,
  revision: i,
  enabled: o = r !== null,
  forceFollow: n = !1
}) {
  const a = O(null), b = O(null), l = O({ scope: "", following: !0 }), [c, h] = B({ scope: "", following: !0 }), v = te((y) => {
    l.current.following !== y && (l.current = { ...l.current, following: y }, h(l.current));
  }, []), k = te(() => {
    n || v(!1);
  }, [n, v]), f = O(r), p = O(null), w = o;
  return De(() => {
    f.current = r, p.current?.();
  }, [r, i]), De(() => {
    if (l.current.scope !== e && (l.current = { scope: e, following: !0 }, h(l.current)), !w) return;
    n && v(!0);
    const y = a.current, N = b.current;
    if (!y || !N) return;
    let d = null, u = "", S = "", $ = "", g = null, _ = 0, A = 0, R = null;
    const x = () => {
      if (n) return y;
      let P = y;
      for (; P && !/auto|scroll/.test(getComputedStyle(P).overflowY); )
        P = P.parentElement;
      return P;
    }, z = () => {
      const P = f.current;
      return P === null ? null : N.querySelector(
        `[data-writing-stream-target="${CSS.escape(P)}"]`
      );
    }, D = () => {
      const P = z();
      return !P || !d ? null : Math.max(
        0,
        Math.min(
          d.scrollHeight - d.clientHeight,
          d.scrollTop + P.getBoundingClientRect().bottom - d.getBoundingClientRect().top - d.clientTop - d.clientHeight + 20
        )
      );
    }, T = () => {
      g === null && (g = requestAnimationFrame(() => {
        if (g = null, Q(), !d || !n && !l.current.following) return;
        const P = D();
        P !== null && (d.scrollTop = P, _ = d.scrollTop, A = d.scrollHeight);
      }));
    }, V = () => {
      v(!1);
    }, K = () => {
      if (!d) return;
      const P = D();
      (P !== null && Math.abs(d.scrollTop - P) <= 2 || d.scrollHeight - d.clientHeight - d.scrollTop <= 2) && (v(!0), T());
    }, Y = () => {
      if (d !== x()) {
        Q();
        return;
      }
      if (!d) return;
      if (n) {
        T();
        return;
      }
      const P = d.scrollTop, se = d.scrollHeight, pe = se < A && P < _ && Math.abs(P - Math.max(0, se - d.clientHeight)) <= 2;
      P < _ && !pe ? V() : P > _ && K(), pe && l.current.following && T(), _ = P, A = se;
    }, ne = (P) => {
      if (n) {
        P.ctrlKey || P.preventDefault();
        return;
      }
      P.deltaY < 0 ? V() : P.deltaY > 0 && K();
    }, ie = (P) => {
      R = P.touches[0]?.clientY ?? null;
    }, G = (P) => {
      if (n) {
        P.preventDefault();
        return;
      }
      const se = P.touches[0]?.clientY;
      se !== void 0 && R !== null && se > R ? V() : se !== void 0 && R !== null && se < R && K(), R = se ?? null;
    }, de = (P) => {
      if (n) {
        !(P.target instanceof Element && P.target.closest("input, textarea, select, [contenteditable=true]")) && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(P.key) && P.preventDefault();
        return;
      }
      ["ArrowUp", "PageUp", "Home"].includes(P.key) || P.key === " " && P.shiftKey ? V() : ["ArrowDown", "PageDown", "End", " "].includes(P.key) && K();
    }, re = () => {
      d && (d.removeEventListener("scroll", Y), d.removeEventListener("wheel", ne), d.removeEventListener("touchstart", ie), d.removeEventListener("touchmove", G), d.removeEventListener("keydown", de), d.style.overflowAnchor = u, n && (d.style.overflowY = S, d.style.scrollbarGutter = $), d !== y && ee.unobserve(d));
    }, Q = () => {
      const P = x();
      P !== d && (re(), d = P, d && (_ = d.scrollTop, A = d.scrollHeight, u = d.style.overflowAnchor, d.style.overflowAnchor = "none", n && (S = d.style.overflowY, $ = d.style.scrollbarGutter, d.style.scrollbarGutter = "stable", d.style.overflowY = "hidden"), d.addEventListener("scroll", Y, { passive: !0 }), d.addEventListener("wheel", ne, { passive: !n }), d.addEventListener("touchstart", ie, { passive: !0 }), d.addEventListener("touchmove", G, { passive: !n }), d.addEventListener("keydown", de), ee.observe(d)));
    }, ee = new ResizeObserver(T);
    return ee.observe(N), ee.observe(y), Q(), p.current = () => {
      const P = d;
      Q(), d && d === P && !l.current.following && (d.scrollTop = _), d && (_ = d.scrollTop), T();
    }, T(), () => {
      p.current = null, re(), ee.disconnect(), g !== null && cancelAnimationFrame(g);
    };
  }, [e, w, n, v]), { viewportRef: a, contentRef: b, following: n || c.scope !== e || c.following, pauseFollowing: k };
}
const ui = [];
function Ei(e) {
  const r = zn(e), {
    snapshot: i,
    viewSnapshot: o,
    document: n,
    historical: a,
    generationTiming: b,
    selection: l,
    draft: c,
    loading: h,
    busy: v,
    error: k,
    conflicted: f,
    reload: p,
    action: w,
    stop: y,
    openSelection: N,
    addEntry: d
  } = r, u = Un(r), S = Hn(
    e.projectId,
    i?.work_asset_id || 0,
    i?.work_version_id || 0
  ), [$, g] = B(null), _ = O(null), [A, R] = B(null), [x, z] = B(!1), [D, T] = B(!1), [V, K] = B(null), [Y, ne] = B(null), [ie, G] = B(!1), [de, re] = B(!1), Q = O(!1), ee = O(!1), P = O(!1), [se, pe] = B(!1), [ye, W] = B(""), ae = Xe, j = i?.document.status === "running" || !!e.running, Z = c.status === "saving", ue = !!(e.readonly || a || j && i?.checkpoint?.phase !== "continuity" || v || h), fe = !!(D || V || Y || ie || x), ge = l?.kind === "unit" && l.tab === "plan", H = l?.kind === "entity" || ge || !!A, he = fe || de || H, { cancelBodyFollow: we } = r;
  De(() => {
    he && we();
  }, [he, we]);
  const oe = ue || fe, le = o?.document, be = a ? void 0 : kn(i), m = oe || f || he ? "当前状态不能调整章节顺序" : u.pending ? "请先应用或丢弃修改建议" : c.hasPendingChanges || Z ? "请先保存当前修改" : "", E = oi({
    disabled: !!m,
    reason: m,
    getDocument: () => r.getSnapshot()?.document,
    flush: c.flush,
    onSave: (C) => w("save_document", { document: C })
  }), I = he || v || h || Z || u.pending || E.pending, q = $?.selection || l, L = q?.kind === "unit" || q?.kind === "section" && q.id === "chapters", X = l?.kind === "unit" && n ? Se(n.units).byId.get(l.id)?.unit : void 0, F = l?.kind === "entity", U = n && Y ? n.units.find((C) => C.id === Y) : void 0, { flush: J } = c, { onClose: ve } = e, Ze = te(async () => {
    if (!(he || v || h || E.pending || Q.current)) {
      Q.current = !0;
      try {
        await J() && ve();
      } finally {
        Q.current = !1;
      }
    }
  }, [he, v, h, E.pending, J, ve]);
  Ne(() => {
    if (!c.hasPendingChanges && !V) return;
    const C = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [V, c.hasPendingChanges]);
  const et = async (C) => {
    if (ee.current) return !1;
    ee.current = !0;
    try {
      const M = lt();
      M && g(M);
      const me = await N(C);
      return me || g(null), me;
    } finally {
      ee.current = !1;
    }
  }, qe = async (C) => {
    if (I || !le || xe(le, C))
      return;
    await (C.kind === "entity" || C.kind === "unit" && C.tab === "plan" ? et(C) : N(C)) && u.discard();
  }, tt = async (C) => {
    I || await r.selectVersion(C) && u.discard();
  }, nt = async (C) => {
    !oe && !I && await c.flush() && (u.discard(), K(C));
  }, Dt = async () => {
    if (!(!Y || ue || f || u.pending || P.current)) {
      P.current = !0, pe(!0), W("");
      try {
        if (!await c.flush()) return;
        const C = r.getSnapshot()?.document;
        if (!C || !C.units.some((M) => M.id === Y))
          return;
        await w("save_document", {
          document: {
            ...C,
            units: C.units.filter((M) => M.id !== Y)
          }
        }) ? (ne(null), u.discard(), await N({ kind: "section", id: "chapters" })) : W("删除未成功，章节和原内容已保留，请重试。");
      } finally {
        P.current = !1, pe(!1);
      }
    }
  }, it = async () => {
    if (v || h || u.pending || !await c.flush()) return;
    const C = $;
    await N(C?.selection || { kind: "section", id: "overview" }) && (_.current = C?.top ?? null, g(null), R(null), u.discard());
  }, Ot = async () => {
    if (!n || l?.kind !== "entity" || oe || u.pending || !await c.flush()) return;
    const C = r.getSnapshot()?.document;
    if (!C) return;
    const M = {
      ...C.outline,
      [l.section]: C.outline[l.section].filter(
        (me) => me.id !== l.id
      )
    };
    await w("save_document", { document: { ...C, outline: M } }) && (u.discard(), await N($?.selection || { kind: "section", id: "overview" }, !1) && (_.current = $?.top ?? null, g(null)));
  }, qt = async (C) => {
    if (ue || f || u.pending || !await c.flush())
      return !1;
    const M = r.getSnapshot()?.document;
    return M ? JSON.stringify(M.preferences) === JSON.stringify(C) ? !0 : w("save_document", { document: { ...M, preferences: C } }) : !1;
  }, rt = Nn(r.preview, i) && j ? r.preview : null, ce = !a && !h && !fe && rt?.work_asset_id === i?.work_asset_id ? rt : null, Ae = Be(() => !n || !j || u.pending || !ce ? n : Object.keys(ce.fields).some(
    (M) => /^(preferences|inspirations|units|outline|entities)[.[]/.test(
      M
    ) || M === "plan" && ce.section_id === "chapter_plan" || M === "content" && !!(ce.section_id && $e(ce.section_id))
  ) ? xn(
    n,
    ce,
    i?.checkpoint?.action,
    i?.checkpoint?.unit_ids
  ) : n, [
    n,
    j,
    u.pending,
    ce,
    i?.checkpoint?.action,
    i?.checkpoint?.unit_ids
  ]), ze = ri(
    Ae?.units || ui,
    l
  ), st = u.run, Ve = ce?.fields.body !== void 0 && X?.id === ce.unit_id && !c.draft.unit?.body ? ce.fields.body : "", at = `${i?.work_asset_id}:${i?.run_id}:${i?.request_id}`, ot = le && l && !H && !u.pending && !(l.kind === "unit" && l.tab !== "plan" && !Ve) ? ci(
    le,
    l,
    ce,
    i?.checkpoint
  ) : null, _e = bt({
    scope: at,
    target: ot,
    revision: ce?.fields || i?.checkpoint,
    enabled: j && !a && !h && !he && !u.pending,
    forceFollow: !!(j && i?.checkpoint?.action === "generate_outline" && !L && !H)
  }), lt = () => l && n ? { selection: l, document: n, top: _e.viewportRef.current?.scrollTop || 0 } : null, Te = bt({
    scope: at,
    target: ce && u.pending && ce.fields.replacement !== void 0 && u.preview === ce.fields.replacement ? "proposal" : null,
    revision: u.preview
  });
  De(() => {
    if (H || _.current === null) return;
    const C = _e.viewportRef.current;
    C && (C.scrollTop = _.current), _.current = null;
  }, [H, $, l, _e.viewportRef]);
  const ct = /* @__PURE__ */ t(
    ei,
    {
      inline: !0,
      snapshot: i,
      preview: ce,
      generationTiming: b,
      running: j,
      busy: v || Z || h || E.pending,
      readonly: !!(e.readonly || a),
      error: k || u.error || (n ? "" : e.node.runError) || "",
      conflicted: f,
      reloadDisabled: !!(he || v || h || Z || c.hasPendingChanges),
      onReload: p,
      onRetry: async () => {
        const C = Bt(r.getSnapshot());
        if (C)
          if (C.action === "propose_edit") {
            const M = Pn(C.extra);
            await N(M) && await u.retry(C.extra, M);
          } else await st(C.action, C.extra);
      },
      onStop: y
    }
  ), dt = (C, M) => C && n && le && /* @__PURE__ */ t(
    Qn,
    {
      document: M ? n : $?.document || n,
      savedDocument: le,
      directory: ze,
      activeBatchIds: i?.checkpoint?.action === "generate_units" ? i.checkpoint.unit_ids : void 0,
      onConfirmationChange: re,
      selection: C,
      disabled: !M || oe || f || E.pending,
      body: c.draft.unit?.body,
      selectedCharacters: M && u.textSelection?.text.length || 0,
      onClearSelection: u.clearSelection,
      onAction: st,
      proposalPending: M && u.pending,
      proposalReady: M && u.ready,
      proposalPreview: M ? u.preview : "",
      running: j,
      onApply: () => {
        u.apply();
      },
      onDiscard: u.discard
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}`
  ), ut = (C, M) => C && Ae && le && /* @__PURE__ */ t(
    jn,
    {
      document: M ? Ae : $?.document || Ae,
      recoverableDraft: !a && !j && C.kind === "unit" && i?.checkpoint?.draft?.unit_id === C.id ? i.checkpoint.draft.body : void 0,
      savedDocument: le,
      selection: C,
      value: Ve && c.draft.unit ? {
        ...c.draft,
        unit: { ...c.draft.unit, body: Ve }
      } : c.draft,
      readonly: oe || E.pending || !M,
      onChange: c.setDraft,
      onSelect: (me) => {
        qe(me);
      },
      chapterOrder: E,
      directory: ze,
      navigationDisabled: I,
      onDeleteChapter: (me) => {
        !m && !E.pending && (W(""), ne(me));
      },
      scoped: M && H,
      onTextSelectionChange: M ? u.onTextSelectionChange : void 0,
      selectionActionsRef: M ? u.selectionActionsRef : void 0
    },
    `${C.kind}:${C.id}:${C.kind === "unit" ? C.tab || "body" : ""}:${a ? o?.work_version_id : "current"}`
  ), zt = ut(l, !0), Vt = ut(q, !H), Ut = /* @__PURE__ */ s(Ce, { children: [
    /* @__PURE__ */ s(
      "section",
      {
        className: "writing-editor nodrag nopan nowheel is-detail",
        "aria-label": `${ae.title}编辑器`,
        children: [
          a && /* @__PURE__ */ s("div", { className: "writing-history-bar", children: [
            /* @__PURE__ */ t("span", { children: "正在查看历史版本，内容只读。" }),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: v || h,
                onClick: () => {
                  tt(i.work_version_id);
                },
                children: "返回当前版本"
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                disabled: e.readonly || j || v || h,
                onClick: async () => {
                  await w("restore_document", {
                    source_work_version_id: o.work_version_id
                  }) && u.discard();
                },
                children: "恢复此版本"
              }
            ),
            k && /* @__PURE__ */ t("span", { role: "alert", children: k })
          ] }),
          !n || !le || !Rn(le) ? /* @__PURE__ */ t("div", { className: "writing-empty", children: "请先在画布选用一个灵感，再进入创作工作区。" }) : /* @__PURE__ */ t(Ce, { children: /* @__PURE__ */ s("div", { className: "writing-layout", children: [
            /* @__PURE__ */ t(
              ti,
              {
                document: le,
                selection: q,
                disabled: I,
                mutationDisabled: oe || F || E.pending,
                onSelect: (C) => {
                  qe(C);
                },
                onAdd: (C) => {
                  nt(C);
                },
                chapterOrder: E,
                directory: ze
              }
            ),
            /* @__PURE__ */ t("div", { className: "writing-workspace-content", children: /* @__PURE__ */ s("div", { className: "writing-chapter-layout", children: [
              L ? /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t(
                "div",
                {
                  className: "writing-content-scroll",
                  ref: _e.viewportRef,
                  children: /* @__PURE__ */ t(
                    "div",
                    {
                      className: "writing-page",
                      ref: _e.contentRef,
                      children: Vt
                    }
                  )
                }
              ) }) : /* @__PURE__ */ t("main", { className: "writing-main", children: /* @__PURE__ */ t("div", { className: "writing-content-scroll", ref: _e.viewportRef, children: /* @__PURE__ */ t("div", { ref: _e.contentRef, children: /* @__PURE__ */ t(
                Kn,
                {
                  document: $?.document || Ae,
                  readonly: oe || f || E.pending || !!u.pending,
                  navigationDisabled: I,
                  onSelect: (C) => {
                    qe(C);
                  },
                  onAdd: (C) => {
                    nt(C);
                  },
                  onPreferences: () => G(!0),
                  onEditSection: async (C) => {
                    await et({ kind: "section", id: C }) && (u.discard(), R(C));
                  },
                  chapterOrder: E,
                  chapterRecovery: be && i && /* @__PURE__ */ t(
                    Fn,
                    {
                      draft: be,
                      snapshot: i,
                      disabled: ue || f || !!u.pending || E.pending,
                      open: x,
                      onOpen: () => z(!0),
                      onClose: () => z(!1),
                      onSave: async (C) => {
                        let M;
                        if (!await w(
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
                        z(!1);
                      }
                    },
                    `${be.run_id}:${be.request_id}`
                  ),
                  activeUnitId: j ? i?.checkpoint?.unit_id : void 0,
                  streamTarget: ot,
                  generatingBackground: !!(j && !a && !H && i?.checkpoint?.action === "generate_outline" && i.checkpoint.phase === "background"),
                  following: _e.following,
                  onReadPage: _e.pauseFollowing
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
                  children: /* @__PURE__ */ t("div", { ref: H ? void 0 : Te.contentRef, children: dt(q, !H) })
                }
              )
            ] }) })
          ] }) })
        ]
      }
    ),
    ie && n && /* @__PURE__ */ t(
      Yn,
      {
        preferences: n.preferences,
        disabled: ue || f || u.pending || E.pending,
        onSave: qt,
        onClose: () => G(!1)
      }
    ),
    H && l && n && /* @__PURE__ */ s(
      Re,
      {
        title: ge ? "修改本章剧情" : Rt(n, l),
        titleStatus: a ? void 0 : ct,
        className: "writing-outline-entity-dialog",
        closeDisabled: v || h || Z || u.pending,
        onClose: it,
        children: [
          /* @__PURE__ */ s("div", { className: "writing-entity-dialog-layout", children: [
            /* @__PURE__ */ t("div", { className: "writing-dialog-scroll", children: zt }),
            /* @__PURE__ */ t(
              "aside",
              {
                className: "writing-ai-rail",
                "aria-label": "创作助手",
                ref: Te.viewportRef,
                children: /* @__PURE__ */ t("div", { ref: Te.contentRef, children: dt(l, !0) })
              }
            )
          ] }),
          /* @__PURE__ */ s("footer", { className: "writing-actions writing-entity-dialog-actions", children: [
            F && /* @__PURE__ */ s("button", { className: "is-danger", disabled: oe || u.pending, onClick: () => {
              Ot();
            }, children: [
              /* @__PURE__ */ t(yt, { size: 14 }),
              "删除"
            ] }),
            /* @__PURE__ */ t(
              "button",
              {
                className: "is-primary",
                disabled: v || h || Z || u.pending,
                onClick: () => {
                  it();
                },
                children: e.readonly || a ? "返回大纲" : "保存并返回"
              }
            )
          ] })
        ]
      }
    ),
    D && i && /* @__PURE__ */ t(
      ii,
      {
        projectId: e.projectId,
        canvasId: e.canvasId,
        workAssetId: i.work_asset_id,
        activeRunId: i.run_id,
        busy: v,
        readonly: !!(e.readonly || a),
        commandError: k,
        onStop: y,
        onClose: () => T(!1)
      }
    ),
    V && n && /* @__PURE__ */ t(
      Gn,
      {
        document: n,
        selection: V,
        disabled: ue,
        closeDisabled: v || Z,
        onClose: () => K(null),
        onSave: async (C) => {
          const M = lt(), me = V.kind === "section" && V.id !== "chapters";
          me && M && g(M);
          const We = await d(V, C);
          return We ? K(null) : me && g(null), We;
        }
      }
    ),
    U && /* @__PURE__ */ t(
      It,
      {
        title: "删除章节",
        description: `删除「${U.title}」及当前正文？历史版本仍可查看。`,
        confirmLabel: "确认删除",
        pending: se,
        disabled: ue || f || u.pending,
        error: ye,
        onClose: () => {
          P.current || ne(null);
        },
        onConfirm: Dt
      }
    )
  ] });
  return /* @__PURE__ */ t(
    sn,
    {
      ariaLabel: `${e.node.title || "节点"}详情`,
      onRequestClose: Ze,
      header: /* @__PURE__ */ t(
        Wn,
        {
          editor: r,
          titleStatus: !a && !H ? ct : void 0,
          versions: S,
          node: e.node,
          navigationDisabled: I,
          mutationDisabled: oe || F || E.pending,
          previewReadonly: !!(e.readonly || a),
          onClose: () => {
            Ze();
          },
          onRuns: () => T(!0),
          onSelectVersion: tt
        }
      ),
      children: Ut
    }
  );
}
export {
  Ei as WritingEditor
};
