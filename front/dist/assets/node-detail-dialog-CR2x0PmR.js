import { a as m, j as s, F as Je } from "./createLucideIcon-fWv1XcFy.js";
import { b as y, i as Ie, g as vr, e as h, d as b, c as ke } from "./runtime-entry-ClkZDmNs.js";
import { L as Ae } from "./vanilla-BSPxkY5-.js";
import { A as pr } from "./arrow-left-8fGzp-c8.js";
import { C as yr } from "./copy-BlmHyHAH.js";
import { H as hr } from "./history-BnF8Oyah.js";
import { S as wr, N as gr, A as br, d as Dr, g as Ze, R as _e, D as Cr, j as Nr, k as Vr, c as Sr, t as Rr } from "./storyboard-grid-view-BldHSQpc.js";
import { t as E } from "./index-Cf7idtTi.js";
import { k as ie } from "./site-config-DrnclGFw.js";
import { u as Ir, e as Qe, m as Re, b as de, f as Xe, s as kr, d as Ar, g as Tr, h as Er, i as Mr, j as Pr, k as xr } from "./space-page-jOKilSym.js";
import { n as he, S as Fr, r as qr, a as zr, s as Lr, b as _r } from "./space-storyboard-view-Cu6ZkcmQ.js";
import { D as Hr, I as $r, V as Gr } from "./first-frame-video-DlIx6mwp.js";
import { F as je } from "./file-text-GWInsYzS.js";
import { C as er, i as Ur } from "./space-content-view-TucLzffi.js";
import { M as Br } from "./media-inspector-gallery-TNes-xFo.js";
import { B as Wr } from "./bot-JFFKszUF.js";
import { E as Kr } from "./eye-D9RIhpvx.js";
import { M as Or, V as Jr } from "./space-video-compose-view-BzR4cTvy.js";
import { W as Qr } from "./workflow-DCWxX26l.js";
import { r as Xr, P as Yr, i as rr } from "./power-icon-B4F9A-tn.js";
import { C as Zr } from "./circle-alert-B2uOyl1_.js";
import { u as jr } from "./asset-reference-provider-5wXqToZ6.js";
import { a as et } from "./space-reference-editor-CmgVWTz3.js";
function rt({
  grid: e,
  readonly: o,
  referenceProvider: i,
  onChange: n
}) {
  const [c, v] = y(null), F = Ie(
    () => tt(e),
    [e]
  );
  function k(a, w) {
    n({
      ...e,
      frames: e.frames.map(
        (g, A) => A === a ? { ...g, ...w } : g
      )
    });
  }
  async function M(a) {
    if (!(c === null || a.refType !== "asset"))
      try {
        const w = await st(i, a);
        if (!w) {
          E.error("所选资产当前版本没有可用图片");
          return;
        }
        k(c, {
          image: w,
          assetID: a.refId,
          assetVersionID: Number(a.versionID || 0),
          status: "success",
          error: ""
        }), v(null);
      } catch (w) {
        E.error(w instanceof Error ? w.message : "读取图片资产失败");
      }
  }
  return /* @__PURE__ */ m("div", { className: "ws-node-detail-storyboard-grid", children: [
    /* @__PURE__ */ s(
      wr,
      {
        grid: e,
        variant: "detail",
        readonly: o,
        onFrameChange: k,
        renderFrameAction: !o && i?.renderPicker ? (a, w) => /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-storyboard-grid-output-replace",
            onClick: () => v(w),
            children: [
              /* @__PURE__ */ s(gr, { size: 14 }),
              /* @__PURE__ */ s("span", { children: a.image ? "替换图片" : "导入图片" })
            ]
          }
        ) : void 0
      }
    ),
    i?.renderPicker?.({
      open: c !== null,
      acceptedKinds: ["image"],
      maxSelection: 1,
      selectedReferences: F,
      onSelect: (a) => {
        M(a);
      },
      onClose: () => v(null)
    })
  ] });
}
function tt(e) {
  return e.frames.flatMap(
    (o) => o.assetID > 0 ? [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: o.assetID,
        ref_version_id: o.assetVersionID || void 0,
        label: o.title
      }
    ] : []
  );
}
async function st(e, o) {
  const i = o.preview?.sourceUrl || o.preview?.url;
  return i || e?.loadPreview && (await e.loadPreview({
    refType: o.refType,
    refId: o.refId,
    label: o.label,
    trigger: o.trigger,
    versionId: o.versionID
  })).media.find((c) => c.kind === "image")?.url || "";
}
const { RichTextEditor: Ye } = vr("@/components/rich-text-editor");
function nt({
  content: e,
  mediaOutput: o,
  mediaKind: i,
  mediaPrompt: n,
  readonly: c,
  referenceItems: v,
  canvasNodes: F,
  storyboardSourceNodeId: k,
  storyboardFocus: M,
  storyboardWorkflowAction: a,
  referenceProvider: w,
  onConfirmStoryboard: g,
  onCreateStoryboardRevision: A,
  onGenerateStoryboardShot: Z,
  onChange: p
}) {
  if (o !== void 0 && (i === "image" || i === "video"))
    return /* @__PURE__ */ s(ot, { kind: i, output: o });
  if (o !== void 0 && i === "audio")
    return /* @__PURE__ */ s("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ s(br, { kind: "audio", content: o, prompt: n }) });
  if (o !== void 0)
    return /* @__PURE__ */ s(
      er,
      {
        className: "ws-node-detail-media",
        output: o,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ s(
      rt,
      {
        grid: e.value,
        readonly: c,
        referenceProvider: w,
        onChange: (D) => p(he(e, D))
      }
    );
  if (e.mode === "storyboard")
    return /* @__PURE__ */ s("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ s(
      Fr,
      {
        storyboard: e.value,
        layout: "split",
        editable: !c,
        referenceItems: v,
        canvasNodes: F,
        storyboardSourceNodeId: k,
        focus: M,
        workflowAction: a,
        onConfirm: g,
        onCreateRevision: A,
        onGenerateShot: Z,
        onChange: (D) => p(he(e, D)),
        showSaveStatus: !1
      }
    ) });
  if (e.mode === "file")
    return /* @__PURE__ */ s(
      it,
      {
        content: e,
        readonly: c,
        onChange: p
      }
    );
  const L = String(e.value || "");
  return /* @__PURE__ */ s("div", { className: "ws-node-detail-editor", children: Ye ? /* @__PURE__ */ s(
    Ye,
    {
      value: L,
      onChange: (D) => p(he(e, D)),
      contentFormat: e.format,
      placeholder: "编辑内容",
      disabled: c,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "ws-node-detail-rich-editor"
    }
  ) : /* @__PURE__ */ s(
    "textarea",
    {
      className: "ws-node-detail-fallback-editor",
      readOnly: c,
      value: L,
      onChange: (D) => p(he(e, D.target.value)),
      placeholder: "编辑内容"
    }
  ) });
}
function ot({
  kind: e,
  output: o
}) {
  const i = Dr(o, e);
  return i.length === 0 ? /* @__PURE__ */ s(
    er,
    {
      className: "ws-node-detail-media",
      output: o,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ s(
    Br,
    {
      kind: e,
      urls: i,
      downloadable: !0,
      className: "ws-node-detail-media-gallery"
    }
  );
}
function it({
  content: e,
  readonly: o,
  onChange: i
}) {
  const n = e.value, c = (v) => {
    i(he(e, { ...n, ...v }));
  };
  return /* @__PURE__ */ m("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ m("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ s("span", { "aria-hidden": "true", children: /* @__PURE__ */ s(je, { size: 24 }) }),
      /* @__PURE__ */ m("div", { children: [
        o ? /* @__PURE__ */ s("strong", { children: n.name || "文件" }) : /* @__PURE__ */ s(
          "input",
          {
            value: n.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (v) => c({ name: v.target.value })
          }
        ),
        /* @__PURE__ */ s("small", { children: n.url })
      ] }),
      /* @__PURE__ */ s(Ze, { label: "下载文件", children: /* @__PURE__ */ s("a", { href: n.url, download: !0, "aria-label": "下载文件", children: /* @__PURE__ */ s(Hr, { size: 17 }) }) })
    ] }),
    o ? /* @__PURE__ */ s("p", { children: n.description || "暂无文件说明" }) : /* @__PURE__ */ s(
      "textarea",
      {
        value: n.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (v) => c({ description: v.target.value })
      }
    )
  ] });
}
function at({
  node: e,
  contentLabel: o,
  versionSelect: i,
  updatedAt: n,
  status: c,
  readonly: v,
  downloadUrl: F,
  onRetry: k,
  onClose: M
}) {
  const a = e.type === "power" ? Xr(e.power, e.kind, e.outputType) : null, w = a && a.outputName !== o ? `${a.outputName} · ${o}` : a?.outputName || o;
  return /* @__PURE__ */ s(
    Cr,
    {
      icon: /* @__PURE__ */ s(ut, { node: e }),
      title: e.title || "节点详情",
      subtitle: w,
      versionSelect: i,
      state: v ? /* @__PURE__ */ s("span", { className: "wb-detail-state", children: "只读预览" }) : c === "error" ? /* @__PURE__ */ s(Ze, { label: "重试保存", children: /* @__PURE__ */ m(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: k,
          children: [
            /* @__PURE__ */ s(_e, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ m("span", { className: `wb-detail-state is-${c}`, children: [
        c === "saving" ? /* @__PURE__ */ s(Ae, { size: 12, className: "wb-detail-spin" }) : null,
        ct(c)
      ] }),
      updatedAt: n,
      downloadUrl: F,
      onClose: M
    }
  );
}
function ct(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : "已保存";
}
function ut({ node: e }) {
  if (e.type === "power")
    return /* @__PURE__ */ s(
      Yr,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const o = lt(e);
  return /* @__PURE__ */ s(o, { size: 16 });
}
function lt(e) {
  return e.type === "agent" ? Wr : e.type === "flow" ? Qr : e.type === "function" ? Kr : e.kind === "image" ? $r : e.kind === "video" ? Gr : e.kind === "audio" ? Or : je;
}
function dt({
  value: e,
  resetKey: o,
  fingerprint: i,
  save: n,
  onError: c,
  debounceMs: v = 1200
}) {
  const [F, k] = y(e), [M, a] = y("saved"), w = h(e), g = h(e), A = h(i), Z = h(n), p = h(c), L = h(i(e)), D = h(0), _ = h(0), q = h(null), W = h(null), H = h(async () => !1), N = h(!1), $ = h(!0);
  w.current = e, A.current = i, Z.current = n, p.current = c;
  const C = b(() => {
    q.current !== null && (window.clearTimeout(q.current), q.current = null);
  }, []), K = b(
    async (V, G = !1) => {
      C();
      const U = _.current;
      for (; $.current && U === _.current; ) {
        if (W.current && (!await W.current || U !== _.current))
          return !1;
        if (!G && V !== void 0 && V !== D.current)
          return !0;
        const ae = g.current, ce = A.current(ae);
        if (ce === L.current)
          return N.current = !1, $.current && a("saved"), !0;
        const be = D.current;
        $.current && a("saving");
        const j = Z.current(ae).then(() => {
          if (!$.current || U !== _.current)
            return !1;
          L.current = ce, N.current = !1;
          const T = A.current(g.current);
          return a(
            T === ce ? "saved" : "dirty"
          ), !0;
        }).catch((T) => ($.current && U === _.current && (C(), N.current = !0, a("error"), p.current?.(T)), !1));
        W.current = j;
        const J = await j;
        if (W.current === j && (W.current = null), !J)
          return !1;
        if (!G && be !== D.current && q.current === null && !N.current) {
          const T = D.current;
          q.current = window.setTimeout(() => {
            q.current = null, H.current(T);
          }, v);
        }
        if (!G || be === D.current)
          return !0;
      }
      return !1;
    },
    [C, v]
  );
  H.current = K;
  const O = b(
    (V) => {
      C(), !N.current && (q.current = window.setTimeout(() => {
        q.current = null, K(V);
      }, v));
    },
    [C, v, K]
  ), we = b(
    (V) => {
      const G = typeof V == "function" ? V(g.current) : V, U = A.current(G);
      if (g.current = G, k(G), D.current += 1, U === L.current) {
        C(), N.current = !1, a("saved");
        return;
      }
      if (N.current) {
        a("error");
        return;
      }
      a("dirty"), O(D.current);
    },
    [C, O]
  ), ge = b(async () => K(void 0, !0), [K]), fe = b(async () => (N.current = !1, K(void 0, !0)), [K]);
  return ke(() => {
    const V = w.current;
    _.current += 1, D.current = 0, g.current = V, L.current = A.current(V), N.current = !1, W.current = null, C(), k(V), a("saved");
  }, [C, o]), ke(() => ($.current = !0, () => {
    $.current = !1, _.current += 1, C();
  }), [C]), {
    draft: F,
    status: M,
    setDraft: we,
    flush: ge,
    retry: fe,
    hasPendingChanges: M !== "saved"
  };
}
function ft({
  versions: e,
  currentVersionId: o,
  selectedVersionId: i,
  total: n,
  hasMore: c,
  loading: v,
  loadingMore: F,
  error: k,
  onSelect: M,
  onLoadMore: a,
  onRetry: w
}) {
  return /* @__PURE__ */ s(
    Vr,
    {
      options: e.map((g) => ({
        id: Number(g.id || 0),
        version: Number(g.version || 0),
        updatedAt: String(g.updated_at || g.created_at || ""),
        value: g
      })),
      currentVersionId: o,
      selectedVersionId: i,
      total: n,
      hasMore: c,
      loading: v,
      loadingMore: F,
      error: k,
      onSelect: M,
      onLoadMore: a,
      onRetry: w
    }
  );
}
function mt(e) {
  return Nr(e);
}
function vt({
  projectId: e,
  node: o
}) {
  const i = String(o.runError || "").trim(), { error: n, loading: c } = Ir(e, o);
  return i ? /* @__PURE__ */ m("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ s(Zr, { size: 17 }),
    /* @__PURE__ */ m("div", { children: [
      /* @__PURE__ */ s("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ s("p", { children: n || i }),
      c ? /* @__PURE__ */ m("small", { children: [
        /* @__PURE__ */ s(Ae, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
function _t({
  projectId: e,
  teamId: o,
  assetCateId: i,
  node: n,
  canvasReferenceItems: c,
  canvasNodes: v,
  connectedMediaReferences: F,
  storyboardFocus: k,
  onNodeDraftChange: M,
  onConnectedMediaEdgeRemove: a,
  onRunNode: w,
  onAssetUpdated: g,
  onClose: A
}) {
  const Z = jr({
    teamID: o,
    scopeProjectID: e,
    initialFilters: {
      sourceType: "project",
      projectID: e,
      assetCateID: i
    }
  }), p = Number(n.asset?.id || 0), L = rr(
    n.power,
    n.kind,
    n.outputType
  ), [D, _] = y(
    () => n.composerDraft?.videoComposition || Qe()
  ), [q, W] = y(!1), [H, N] = y(n.asset), [$, C] = y(
    () => ze(n.asset)
  ), [K, O] = y($.length), [we, ge] = y(1), [fe, V] = y(!1), [G, U] = y(p > 0), [ae, ce] = y(!1), [be, j] = y(""), [J, T] = y(
    () => x(n.asset)
  ), [He, ee] = y(
    null
  ), [Te, Ee] = y(!1), [Me, re] = y(""), [te, $e] = y(!1), [Q, me] = y(""), [Ge, Ue] = y(!1), [Pe, xe] = y(!1), [tr, ue] = y(0), R = h(H), S = h(J), ve = h(g), De = h(n), le = h(0), se = h(0), pe = h(null), ye = h(null), Fe = h(!1);
  R.current = H, S.current = J, ve.current = g, De.current = n;
  const Ce = b(
    (t) => {
      const r = Re(
        { ...t.asset, versions: t.versions },
        R.current || De.current.asset
      ), u = r.version, d = de(
        u ? [u] : [],
        t.versions
      ), f = x(r);
      R.current = r, S.current = f, N(r), C(d), O(Math.max(t.versionTotal, d.length)), ge(1), V(t.hasMore), T(f), ee(null), re(""), ue((l) => l + 1), ve.current?.(r);
    },
    []
  ), Ne = b((t) => {
    const r = Re(
      t,
      R.current || De.current.asset
    ), u = x(r);
    R.current = r, S.current = u, N(r), T(u), C((d) => {
      const f = de(
        r.version ? [r.version] : [],
        d
      );
      return O((l) => Math.max(l, f.length)), f;
    }), ee(null), re(""), ue((d) => d + 1), ve.current?.(r);
  }, []), ne = b(async () => {
    if (!p) {
      U(!1), j("");
      return;
    }
    const t = le.current + 1;
    le.current = t, U(!0), j("");
    try {
      const r = await Xe({ projectId: e, assetId: p });
      if (t !== le.current)
        return;
      Ce(r);
    } catch (r) {
      if (t !== le.current)
        return;
      j(ie(r, "读取版本记录失败"));
    } finally {
      t === le.current && U(!1);
    }
  }, [Ce, p, e]);
  ke(() => {
    R.current = n.asset, N(n.asset), C(ze(n.asset)), O(ze(n.asset).length);
    const t = x(n.asset);
    return S.current = t, T(t), ee(null), re(""), me(""), ye.current = null, ue((r) => r + 1), _(
      n.composerDraft?.videoComposition || Qe()
    ), ne(), () => {
      le.current += 1, se.current += 1;
    };
  }, [ne, n.id]);
  const z = x(H), oe = !J || J === z, X = oe ? H?.version : He, sr = Ie(
    () => qr(n, X),
    [X, n]
  ), Ve = Ie(
    () => zr(n, X, {
      includeNodeResult: oe
    }),
    [X, oe, n]
  ), Be = Ie(() => {
    const t = Sr(Ve);
    return t.length === 1 ? t[0] : void 0;
  }, [Ve]), nr = typeof X?.source?.prompt == "string" ? X.source.prompt.trim() : String(n.composerDraft?.prompt || "").trim(), or = b(
    async (t) => {
      const r = R.current, u = r?.version, d = x(r);
      if (!r?.id || !u?.id || S.current !== d)
        throw new Error("当前内容不可编辑");
      const f = await kr({
        projectId: e,
        assetId: r.id,
        versionId: u.id,
        content: Lr(t)
      }), l = Re(
        f,
        r
      );
      l.version && (l.version = {
        ...l.version,
        summary: t.summary
      });
      const B = x(l);
      R.current = l, S.current = B, N(l), T(B), C(
        (P) => de(
          P,
          l.version ? [l.version] : []
        )
      ), B && B !== d && O((P) => P + 1), ve.current?.(l);
    },
    [e]
  ), I = dt({
    value: sr,
    resetKey: `${n.id}:${J}:${tr}`,
    fingerprint: _r,
    save: or,
    onError: (t) => E.error(ie(t, "保存失败"))
  }), ir = b(
    async (t, r) => {
      if (Q || !await I.flush())
        return !1;
      const d = R.current, f = x(d);
      if (!d?.id || !f)
        return E.error("当前分镜尚未保存，不能确认"), !1;
      me("confirming");
      try {
        const l = await Ar({
          projectId: e,
          assetId: d.id,
          versionId: f,
          productionPlan: r
        });
        return Ne(l), E.success("分镜已确认，制作组将按当前版本同步"), !0;
      } catch (l) {
        return E.error(ie(l, "确认分镜失败")), !1;
      } finally {
        me("");
      }
    },
    [Ne, I.flush, e, Q]
  ), We = b(async () => {
    if (Q)
      return;
    const t = R.current, r = S.current;
    if (!t?.id || !r) {
      E.error("当前分镜版本不可用");
      return;
    }
    me("revising");
    try {
      const u = ye.current?.versionId === r ? ye.current : {
        versionId: r,
        requestId: Le("revision", r)
      };
      ye.current = u;
      const d = await Tr({
        projectId: e,
        assetId: t.id,
        versionId: r,
        requestId: u.requestId,
        nodeKey: n.id
      });
      Ne(d), ye.current = null, E.success("已创建新的分镜修订稿"), ne();
    } catch (u) {
      E.error(ie(u, "创建分镜修订稿失败"));
    } finally {
      me("");
    }
  }, [
    Ne,
    ne,
    n.id,
    e,
    Q
  ]), ar = b(
    async (t, r, u) => {
      const d = R.current, f = De.current, l = x(d), B = Number(f.power?.id || 0), P = String(f.power?.key || "").trim();
      if (!d?.id || !l)
        throw new Error("当前分镜尚未保存，不能生成镜头");
      if (!B && !P)
        throw new Error("当前分镜节点未配置生成能力");
      return Er({
        projectId: e,
        assetId: d.id,
        versionId: l,
        flowId: Number(f.flow?.id || d.flow_id || 0),
        assetCateId: Number(
          f.assetCateId || d.asset_cate_id || i
        ),
        requestId: Le("shot", l),
        nodeKey: f.id,
        nodeName: f.title,
        powerId: B,
        powerKey: P,
        sourceTargetId: Number(
          f.composerDraft?.selectedTargetId || 0
        ),
        params: f.composerDraft?.paramValues || {},
        storyboard: t,
        shotId: r,
        instruction: u
      });
    },
    [i, e]
  ), cr = b(async () => {
    S.current === z && !await I.flush() || await ne();
  }, [z, I.flush, ne]), qe = b(
    async (t) => {
      if (!p || !t || t === z)
        return;
      const r = se.current + 1;
      se.current = r, Ee(!0), re(""), ee(null);
      try {
        const u = await Mr({
          projectId: e,
          assetId: p,
          versionId: t
        });
        if (r !== se.current || S.current !== t)
          return;
        ee(u), ue((d) => d + 1);
      } catch (u) {
        if (r !== se.current)
          return;
        re(ie(u, "读取历史版本失败"));
      } finally {
        r === se.current && Ee(!1);
      }
    },
    [p, z, e]
  ), Ke = b(
    async (t) => {
      if (te)
        return;
      const r = Number(t.id || 0);
      if (!(!r || r === S.current) && !(S.current === z && !await I.flush())) {
        if (S.current = r, pe.current = null, T(r), r === z) {
          se.current += 1, ee(null), re(""), Ee(!1), ue((u) => u + 1);
          return;
        }
        await qe(r);
      }
    },
    [z, I.flush, qe, te]
  ), ur = b(async () => {
    if (!(!p || !fe || ae)) {
      ce(!0);
      try {
        const t = await Pr({
          projectId: e,
          assetId: p,
          page: we + 1
        });
        C((r) => de(r, t.items)), ge(t.page), O(t.total), V(t.hasMore);
      } catch (t) {
        E.error(ie(t, "加载更多版本失败"));
      } finally {
        ce(!1);
      }
    }
  }, [p, fe, e, ae, we]), lr = b(async () => {
    const t = R.current, r = S.current;
    if (!(te || !t?.id || !r || r === x(t))) {
      $e(!0);
      try {
        const u = pe.current?.versionId === r ? pe.current : {
          versionId: r,
          requestId: Le("restore", r)
        };
        pe.current = u;
        const d = await xr({
          projectId: e,
          assetId: t.id,
          versionId: r,
          requestId: u.requestId,
          nodeKey: n.id
        }), f = Re(
          d,
          t
        );
        R.current = f, N(f), ve.current?.(f);
        try {
          const l = await Xe({
            projectId: e,
            assetId: t.id
          });
          Ce(l);
        } catch {
          const l = f.version;
          C(
            (P) => de(l ? [l] : [], P)
          ), O((P) => P + 1);
          const B = x(f);
          S.current = B, T(B), ee(null), re(""), ue((P) => P + 1);
        }
        pe.current = null, E.success("已切换到所选版本");
      } catch (u) {
        E.error(ie(u, "切换版本失败"));
      } finally {
        $e(!1);
      }
    }
  }, [Ce, n.id, e, te]), Se = b(async () => {
    if (Fe.current)
      return;
    Fe.current = !0, Ue(!0);
    let t = !0;
    const r = R.current;
    if (I.hasPendingChanges && r?.id && r?.version?.id && S.current === x(r) && (t = await I.flush()), !t) {
      Fe.current = !1, Ue(!1), xe(!0);
      return;
    }
    A();
  }, [I.flush, I.hasPendingChanges, A]);
  ke(() => {
    const t = (r) => {
      if (r.key === "Escape") {
        if (r.preventDefault(), Pe) {
          xe(!1);
          return;
        }
        Se();
      }
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [Se, Pe]);
  const Y = I.draft, dr = Y.mode === "storyboard" && Ur(Y.value), Oe = !oe || !L && (!H?.id || !H?.version?.id) || dr, fr = Oe || Ge || p > 0 && G, mr = !oe && (Te || Me);
  return /* @__PURE__ */ m(
    Rr,
    {
      ariaLabel: `${n.title || "节点"}详情`,
      onRequestClose: Se,
      header: /* @__PURE__ */ s(
        at,
        {
          node: n,
          contentLabel: pt(Y, n, Be),
          versionSelect: p ? /* @__PURE__ */ s(
            ft,
            {
              versions: $,
              currentVersionId: z,
              selectedVersionId: J || z,
              total: K,
              hasMore: fe,
              loading: G,
              loadingMore: ae,
              error: be,
              onSelect: (t) => {
                Ke(t);
              },
              onLoadMore: () => {
                ur();
              },
              onRetry: () => {
                cr();
              }
            }
          ) : void 0,
          updatedAt: mt(
            X?.updated_at || X?.created_at
          ),
          status: I.status,
          readonly: Oe,
          downloadUrl: Y.downloadUrl,
          onRetry: () => {
            I.retry();
          },
          onClose: () => {
            Se();
          }
        }
      ),
      children: [
        /* @__PURE__ */ m("main", { className: "wb-detail-workspace", children: [
          oe ? null : /* @__PURE__ */ m("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ m("span", { children: [
              /* @__PURE__ */ s(hr, { size: 14 }),
              "正在查看第 ",
              He?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ m("div", { children: [
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    Ke(
                      H?.version || { id: z }
                    );
                  },
                  children: [
                    /* @__PURE__ */ s(pr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: te || !!Q || Te || !!Me,
                  onClick: () => Y.mode === "storyboard" ? void We() : void lr(),
                  children: [
                    te || Q === "revising" ? /* @__PURE__ */ s(Ae, { size: 13, className: "wb-detail-spin" }) : Y.mode === "storyboard" ? /* @__PURE__ */ s(yr, { size: 13 }) : /* @__PURE__ */ s(_e, { size: 13 }),
                    Y.mode === "storyboard" ? Q === "revising" ? "创建中" : "基于此版本创建修订稿" : te ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ m("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ s(vt, { projectId: e, node: n }),
            mr ? /* @__PURE__ */ s("div", { className: "wb-detail-content-state", children: Te ? /* @__PURE__ */ m(Je, { children: [
              /* @__PURE__ */ s(Ae, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ s("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ m(Je, { children: [
              /* @__PURE__ */ s("span", { children: Me }),
              /* @__PURE__ */ m(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    qe(J);
                  },
                  children: [
                    /* @__PURE__ */ s(_e, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ s(
              et.Provider,
              {
                value: Z,
                children: L ? /* @__PURE__ */ s(
                  Jr,
                  {
                    composition: D,
                    referenceItems: c || [],
                    connectedMediaReferences: F,
                    readonly: !oe || Ge || q,
                    running: q,
                    fullScreen: !0,
                    finalOutput: Ve,
                    onChange: (t) => {
                      _(t), M?.({
                        ...n.composerDraft || {},
                        videoComposition: t
                      });
                    },
                    onConnectedMediaEdgeRemove: a,
                    onRun: w ? (t) => {
                      W(!0), w({
                        ...n,
                        composerDraft: {
                          ...n.composerDraft || {},
                          videoComposition: t
                        }
                      }).then(() => p ? ne() : void 0).catch(
                        (r) => E.error(
                          r instanceof Error ? r.message : "视频合成失败"
                        )
                      ).finally(() => W(!1));
                    } : void 0
                  }
                ) : /* @__PURE__ */ s(
                  nt,
                  {
                    content: Y,
                    mediaOutput: Ve,
                    mediaKind: Be,
                    mediaPrompt: nr,
                    readonly: fr,
                    referenceItems: c,
                    canvasNodes: v,
                    storyboardSourceNodeId: n.id,
                    storyboardFocus: k,
                    storyboardWorkflowAction: Q,
                    referenceProvider: Z,
                    onConfirmStoryboard: ir,
                    onCreateStoryboardRevision: We,
                    onGenerateStoryboardShot: ar,
                    onChange: I.setDraft
                  }
                )
              }
            )
          ] })
        ] }),
        Pe ? /* @__PURE__ */ s("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ m(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ s("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ s("p", { children: "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ m("div", { children: [
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    onClick: () => xe(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ s("button", { type: "button", className: "is-danger", onClick: A, children: "放弃修改" })
              ] })
            ]
          }
        ) }) : null
      ]
    }
  );
}
function ze(e) {
  return de(
    e?.version ? [e.version] : [],
    e?.versions || []
  );
}
function x(e) {
  return Number(e?.version_id || e?.version?.id || 0);
}
function pt(e, o, i) {
  return e.mode === "storyboard" ? "分镜脚本" : rr(o.power, o.kind, o.outputType) ? "视频合成" : i === "image" ? "图片内容" : i === "video" ? "视频内容" : i === "audio" ? "音频内容" : e.mode === "file" ? "文件" : o.kind === "image" || o.kind === "richtext" ? "图文内容" : o.kind === "video" ? "视频内容" : o.kind === "audio" ? "音频内容" : e.format === "markdown" ? "Markdown" : "富文本";
}
function Le(e, o) {
  const i = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${o}-${i}`.slice(0, 64);
}
export {
  _t as NodeDetailDialog
};
