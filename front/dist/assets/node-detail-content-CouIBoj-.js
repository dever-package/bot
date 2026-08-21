import { j as h, a as F, F as Le } from "./preloadable-Bomi5PEU.js";
import { u as I, a as K, d as _e, b as ae } from "./_commonjsHelpers-61wyk6v6.js";
import { B as Te, b3 as je, aR as Ee, aJ as Je, b4 as fe, b5 as ze, q as Be, b as We, b6 as me, ak as qe, u as Ve, av as Ge, ax as M, au as pe, ah as He, aE as Xe, ac as R, b7 as ye, p as Qe, b8 as he, b9 as Ye, ba as Ze, ay as J, ab as et, aj as j, bb as ge, aw as ke } from "./upload-asset-api-CJCwVOwh.js";
import { X as tt } from "./vendor-icons-B3DKX3la.js";
import { d as nt } from "./file-kind-UfTAlHnR.js";
import { k as rt } from "./site-config-C63CM9jT.js";
import { A as it, c as ot } from "./asset-page-D9DFDknb.js";
function be({
  open: e,
  teamID: t,
  scopeProjectID: n = 0,
  title: r = "选择资产",
  description: i = "使用资产当前版本",
  initialFilters: a,
  allowedKinds: o,
  initialSelectedAssetIDs: l = [],
  usedAssetIDs: m = [],
  multiple: f = !1,
  maxSelection: p = 1,
  confirmSelection: y = !1,
  contentMode: w = "preview",
  validateAsset: C,
  uploadAccept: g,
  onUpload: v,
  onClose: k,
  onConfirm: N
}) {
  const L = JSON.stringify(l), c = I(
    () => de(JSON.parse(L)),
    [L]
  ), A = JSON.stringify(a || {}), S = I(
    () => JSON.parse(A),
    [A]
  ), [x, _] = K(
    c
  ), [Oe, P] = K(/* @__PURE__ */ new Map()), [De, re] = K(
    S
  ), [ie, O] = K(""), [$, W] = K(!1), [Fe, B] = K(null), [Ie, Pe] = K(0), oe = _e(null), D = f ? Math.max(1, p) : 1;
  ae(() => {
    e && (_(c.slice(0, D)), P(/* @__PURE__ */ new Map()), re(S), O(""), W(!1), B(null));
  }, [
    S,
    c,
    e,
    D,
    n,
    t
  ]), ae(() => {
    if (!e) return;
    const s = (u) => {
      u.key === "Escape" && !$ && k();
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [k, e, $]);
  async function $e(s) {
    const u = Array.from(s.target.files || []);
    if (s.target.value = "", !v || u.length === 0 || $) return;
    const d = f ? Math.max(D - x.length, 0) : 1;
    if (d <= 0) {
      O(`最多选择 ${D} 项资产。`);
      return;
    }
    const b = u.slice(0, d), T = je(
      b,
      B
    );
    W(!0), B(null), O("");
    const q = [], V = [];
    try {
      for (const [E, G] of b.entries()) {
        T.start(E);
        try {
          const H = await v([G], {
            onProgress: (U) => T.report(
              E,
              U.loaded,
              U.total,
              U.phase
            )
          });
          for (const U of H) {
            const se = C?.(U) || "";
            se ? V.push(`${G.name}：${se}`) : U.id > 0 && q.push(U);
          }
        } catch (H) {
          V.push(`${G.name}：${rt(H, "上传失败")}`);
        } finally {
          T.complete(E);
        }
      }
      q.length > 0 && (Ue(q), re({
        sourceType: "upload",
        kind: o?.length === 1 ? o[0] : ""
      }), Pe((E) => E + 1)), O(V.join("；"));
    } finally {
      W(!1), B(null);
    }
  }
  function Ue(s) {
    const u = Array.from(
      new Map(s.map((d) => [d.id, d])).values()
    );
    P((d) => {
      const b = new Map(d);
      return u.forEach((T) => b.set(T.id, T)), b;
    }), _(
      (d) => f ? de([
        ...d,
        ...u.map((b) => b.id)
      ]).slice(0, D) : u[0] ? [u[0].id] : d
    );
  }
  function Ke(s) {
    if (y && f && x.includes(s.id)) {
      _((d) => d.filter((b) => b !== s.id)), P((d) => {
        const b = new Map(d);
        return b.delete(s.id), b;
      }), O("");
      return;
    }
    const u = C?.(s) || "";
    if (u) {
      O(u);
      return;
    }
    if (O(""), !y) {
      N([s], [s.id]), k();
      return;
    }
    if (!f) {
      _([s.id]), P(/* @__PURE__ */ new Map([[s.id, s]]));
      return;
    }
    if (x.length >= D) {
      O(`最多选择 ${D} 项资产。`);
      return;
    }
    _((d) => [...d, s.id]), P((d) => new Map(d).set(s.id, s));
  }
  function Ce() {
    const s = x.map((u) => Oe.get(u)).filter((u) => !!u);
    N(s, x), k();
  }
  return !e || typeof document > "u" ? null : nt(
    /* @__PURE__ */ h(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": r,
        onMouseDown: (s) => {
          s.target === s.currentTarget && !$ && k();
        },
        children: /* @__PURE__ */ F("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ F("header", { children: [
            /* @__PURE__ */ F("div", { children: [
              /* @__PURE__ */ h("h2", { children: r }),
              /* @__PURE__ */ h("p", { children: i })
            ] }),
            /* @__PURE__ */ h(Te, { label: "关闭", children: /* @__PURE__ */ F("button", { type: "button", disabled: $, onClick: k, children: [
              /* @__PURE__ */ h(tt, { "aria-hidden": "true" }),
              /* @__PURE__ */ h("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          ie ? /* @__PURE__ */ h("p", { className: "wb-asset-picker-message", children: ie }) : null,
          /* @__PURE__ */ h(
            it,
            {
              teamID: t,
              scopeProjectID: n,
              initialFilters: De,
              allowedKinds: o,
              contentMode: w,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetIDs: x,
              usedAssetIDs: m,
              reloadSignal: Ie,
              onAssetChanged: (s) => {
                x.includes(s.id) && P(
                  (u) => new Map(u).set(s.id, s)
                );
              },
              onAssetRemoved: (s) => {
                _(
                  (u) => u.filter((d) => d !== s)
                ), P((u) => {
                  const d = new Map(u);
                  return d.delete(s), d;
                });
              },
              headerAction: v ? /* @__PURE__ */ F(Le, { children: [
                /* @__PURE__ */ h(
                  ot,
                  {
                    uploading: $,
                    progress: Fe,
                    onClick: () => oe.current?.click()
                  }
                ),
                /* @__PURE__ */ h(
                  "input",
                  {
                    ref: oe,
                    type: "file",
                    hidden: !0,
                    multiple: f,
                    accept: g,
                    onChange: $e
                  }
                )
              ] }) : void 0,
              onSelect: Ke
            }
          ),
          y ? /* @__PURE__ */ F("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ F("span", { children: [
              "已选 ",
              x.length,
              f ? ` / ${D}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ F("div", { children: [
              /* @__PURE__ */ h("button", { type: "button", onClick: k, children: "取消" }),
              /* @__PURE__ */ h(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: $ || x.length === 0,
                  onClick: Ce,
                  children: "确认使用"
                }
              )
            ] })
          ] }) : null
        ] })
      }
    ),
    document.body
  );
}
function de(e) {
  return Array.from(
    new Set(e.map(Number).filter((t) => Number.isFinite(t) && t > 0))
  );
}
function Lt({
  teamID: e,
  scopeProjectID: t = 0,
  initialFilters: n,
  allowedKinds: r,
  onSelect: i,
  onUpload: a
}) {
  const o = JSON.stringify(n || {}), l = JSON.stringify(r || []), m = I(
    () => JSON.parse(o),
    [o]
  ), f = I(
    () => JSON.parse(l),
    [l]
  );
  return I(
    () => ({
      trigger: "@",
      referenceTypes: ["asset"],
      loadPreview: async (p) => {
        const y = await Ee(e, p.refId), w = ee(y.asset);
        return {
          refType: "asset",
          refId: y.asset.id,
          title: y.asset.name,
          text: y.asset.summary,
          media: w,
          content: w.length > 0 ? void 0 : Je(
            y.asset.kind,
            y.asset.version?.content
          )
        };
      },
      renderPicker: (p) => /* @__PURE__ */ h(
        st,
        {
          ...p,
          teamID: e,
          scopeProjectID: t,
          initialFilters: m,
          allowedKinds: f,
          onReferenceSelect: i,
          onUpload: a
        }
      )
    }),
    [i, a, t, m, f, e]
  );
}
function st({
  open: e,
  teamID: t,
  scopeProjectID: n,
  initialFilters: r,
  allowedKinds: i,
  acceptedKinds: a,
  preferredUsage: o,
  maxSelection: l = 1,
  selectedReferences: m = [],
  onReferenceSelect: f,
  onUpload: p,
  onSelect: y,
  onSelectMany: w,
  onClose: C
}) {
  if (!e)
    return null;
  const g = dt(a), v = ct(
    i || [],
    g
  ), k = Math.max(1, Number(l || 1)), N = Array.from(
    new Set(
      m.flatMap(
        (c) => c.ref_type === "asset" && Number(c.ref_id || 0) > 0 ? [Number(c.ref_id)] : []
      )
    )
  ), L = new Set(N);
  return /* @__PURE__ */ h(
    be,
    {
      open: !0,
      teamID: t,
      scopeProjectID: n,
      title: "选择资产",
      description: "插入资产当前版本",
      initialFilters: r,
      allowedKinds: v,
      multiple: k > 1,
      maxSelection: k,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetIDs: N,
      validateAsset: (c) => L.has(c.id) ? "该素材已使用" : ee(c).length > 0 ? "" : "该资产当前版本没有可用文件，无法用于此参数。",
      uploadAccept: fe(v),
      onUpload: p ? (c, A) => p(c, {
        preferredUsage: o,
        acceptedKinds: v,
        onProgress: A?.onProgress
      }) : void 0,
      onClose: C,
      onConfirm: (c) => {
        const A = c.map(
          (S) => at(S, o)
        );
        for (const S of A)
          f?.(S);
        if (w) {
          w(A);
          return;
        }
        for (const S of A)
          y(S);
      }
    }
  );
}
function at(e, t = "") {
  const n = ee(e);
  return {
    key: `asset:${e.id}:${e.versionID}`,
    refType: "asset",
    refId: e.id,
    versionID: e.versionID,
    trigger: "@",
    usage: t,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: n[0]?.kind || e.kind,
      url: n[0]?.url
    },
    output: e.version?.content,
    asset: e,
    mediaCount: n.length
  };
}
function dt(e) {
  const t = /* @__PURE__ */ new Set([
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ]);
  return Array.from(
    new Set(
      (e || []).flatMap((n) => {
        const r = String(n || "").trim();
        return t.has(r) ? [r] : [];
      })
    )
  );
}
function ct(e, t) {
  if (e.length === 0)
    return t;
  if (t.length === 0)
    return e;
  const n = new Set(t);
  return e.filter((r) => n.has(r));
}
const ut = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function ee(e) {
  const t = e.version?.content, n = lt(t, e.kind), r = n.length > 0 ? n : ut.has(e.kind) ? ze(t, e.kind).map((i) => ({
    kind: e.kind,
    url: i
  })) : [];
  return r.map((i, a) => ({
    refType: "asset",
    refId: e.id,
    kind: i.kind,
    label: r.length > 1 ? `${e.name} · ${a + 1}` : e.name,
    url: i.url,
    index: a + 1
  }));
}
function lt(e, t) {
  const n = Be(e), r = ft(t);
  return (r && n.includes(r) ? [r] : n).flatMap(
    (a) => We(e, a).map((o) => ({ kind: a, url: o }))
  );
}
function ft(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
const mt = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function _t({
  teamID: e,
  open: t,
  param: n,
  files: r,
  resourceKind: i,
  multiple: a,
  maxSelection: o,
  onOpenChange: l,
  onConfirm: m
}) {
  const f = I(
    () => pt(i, n.asset_kinds),
    [n.asset_kinds, i]
  ), p = I(() => yt(r), [r]), y = I(
    () => r.filter((g) => !we(g.id)),
    [r]
  ), w = a ? Math.max(o - y.length, 0) : 1, C = Array.from(p.keys()).slice(
    0,
    w
  );
  return /* @__PURE__ */ h(
    be,
    {
      open: t,
      teamID: e,
      title: `${n.name}资产库`,
      description: `选择当前团队的${gt(f)}资产`,
      allowedKinds: f,
      initialSelectedAssetIDs: C,
      multiple: a,
      maxSelection: Math.max(w, 1),
      confirmSelection: !0,
      uploadAccept: fe(f),
      onUpload: (g, v) => kt({
        teamID: e,
        ruleID: Number(n.upload_rule_id || 0),
        kind: i,
        files: g,
        onProgress: v?.onProgress
      }),
      validateAsset: (g) => w <= 0 ? `当前参数最多只能选择 ${o} 个文件。` : f.includes(g.kind) ? me(g.version?.content, g.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。" : "该资产类型不适用于当前参数。",
      onClose: () => l(!1),
      onConfirm: (g, v) => {
        const k = new Map(
          g.map((c) => [c.id, c])
        ), N = v.map((c) => {
          const A = k.get(c);
          return A ? ht(A) : p.get(c);
        }).filter((c) => !!c), L = a ? [...y, ...N].slice(0, o) : N.slice(0, 1);
        m(L);
      }
    }
  );
}
function pt(e, t) {
  const n = ce(e);
  if (n) return [n];
  const r = Array.from(
    new Set(
      (t || []).map(ce).filter((i) => !!i)
    )
  );
  return r.length > 0 ? r : ["image", "audio", "video", "file"];
}
function ce(e) {
  const t = String(e || "");
  return mt.has(t) ? t : void 0;
}
function yt(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n) => {
    const r = we(n.id);
    r && t.set(r.assetID, n);
  }), t;
}
function we(e) {
  const t = /^asset:(\d+):(\d+)$/.exec(String(e || ""));
  return t ? {
    assetID: Number(t[1]),
    versionID: Number(t[2])
  } : null;
}
function ht(e) {
  const t = me(e.version?.content, e.kind);
  if (t)
    return {
      id: `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function gt(e) {
  const t = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件"
  };
  return e.map((n) => t[n]).join("、");
}
async function kt(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await qe({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind,
    onProgress: e.onProgress
  })).map(({ asset: n }) => Ve(n)).filter((n) => n.id > 0);
}
function Tt(e, t) {
  const n = wt(e, t), r = pe(n);
  if (r)
    return {
      mode: "storyboard_grid",
      value: r,
      format: "json",
      summary: Ae(r),
      downloadUrl: ""
    };
  const i = Qe(n);
  if (i)
    return {
      mode: "storyboard",
      value: i,
      format: "json",
      summary: he(i),
      downloadUrl: ""
    };
  const a = Se(n);
  if (a) {
    const p = Nt(n) ? null : Ye(a);
    return p && (e.kind === "text" || Ze(p.plainText)) ? X(p.markdown) : ue(a);
  }
  const o = Y(n);
  if (o)
    return {
      mode: "file",
      value: o,
      format: "json",
      summary: o.description || o.name || "文件内容",
      downloadUrl: o.url
    };
  const l = xt(n);
  if (l)
    return X(l);
  const m = vt(n);
  if (m)
    return ue(m);
  const f = Z(n) || e.description || "";
  return X(f);
}
function jt(e, t, n = {}) {
  const r = n.includeNodeResult === !1 ? t?.content : Ge(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    xe(e, "result", "output")
  ), i = M(r);
  if (pe(i))
    return;
  const a = He(i);
  for (const l of [i, M(a)])
    if (Xe(l))
      return bt(l);
  const o = St(e.kind, i);
  if (o)
    return o;
}
function bt(e) {
  const n = ye(e).map((r) => {
    if (!R(r) || r.json === void 0)
      return r;
    const i = { ...r };
    return delete i.json, i;
  });
  return n.length === 1 ? n[0] : n;
}
function wt(e, t) {
  return et(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    xe(e, "result", "output"),
    e.description
  );
}
function ve(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return Mt(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : J(M(t)) || Rt(t);
}
function Et(e) {
  return ke(ve(e));
}
function Jt(e, t) {
  const n = { ...e, value: t };
  if (n.mode === "storyboard")
    n.summary = he(t);
  else if (n.mode === "storyboard_grid")
    n.summary = Ae(t);
  else if (n.mode === "file") {
    const r = t;
    n.summary = r.description || r.name || "文件内容", n.downloadUrl = r.url;
  } else
    n.summary = te(ge(ve(n)));
  return n;
}
function Ae(e) {
  return j(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function ue(e) {
  const t = ge(e);
  return {
    mode: "rich",
    value: ke(e),
    format: "json",
    summary: te(t),
    downloadUrl: Me(e)
  };
}
function X(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: te(e),
    downloadUrl: ""
  };
}
function vt(e) {
  if (typeof e == "string" && M(e) === e)
    return null;
  const t = ye(e), n = [];
  return Q(
    t,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : J({ type: "doc", content: n });
}
function Q(e, t, n, r, i, a) {
  if (e == null || a > 12)
    return;
  const o = M(e);
  if (typeof o == "string") {
    le(t, o, r);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (m) => Q(
        m,
        t,
        n,
        r,
        i,
        a + 1
      )
    );
    return;
  }
  if (!R(o) || n.has(o))
    return;
  n.add(o);
  const l = Se(o);
  if (l) {
    for (const m of l.content || [])
      t.push(m);
    return;
  }
  le(
    t,
    j(o.title, o.text),
    r
  ), At(o, t, i);
  for (const m of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[m] !== void 0 && Q(
      o[m],
      t,
      n,
      r,
      i,
      a + 1
    );
}
function At(e, t, n) {
  const r = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of r)
    for (const a of i.values)
      for (const o of z(a)) {
        const l = `${i.kind}:${o}`;
        n.has(l) || (n.add(l), t.push({
          type: Ot(i.kind),
          attrs: { src: o }
        }));
      }
}
function le(e, t, n) {
  const r = String(t || "").trim();
  !r || Ne(r) || ne(r) || n.has(r) || (n.add(r), e.push({
    type: "paragraph",
    content: [{ type: "text", text: r }]
  }));
}
function z(e) {
  return Array.isArray(e) ? e.flatMap(z) : typeof e == "string" ? Ne(e.trim()) ? [e.trim()] : [] : R(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(z) : [];
}
function Y(e) {
  const t = M(e);
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = Y(r);
      if (i)
        return i;
    }
    return null;
  }
  if (!R(t))
    return null;
  const n = Dt(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (n)
    return {
      url: n,
      name: j(t.name, t.filename, t.title) || Re(n),
      description: j(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = Y(t[r]);
      if (i)
        return i;
    }
  return null;
}
function Mt(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || Re(e.url),
    description: e.description.trim()
  };
}
function St(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = z(t);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function Z(e) {
  const t = M(e);
  if (typeof t == "string")
    return ne(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(Z).filter(Boolean).join(`

`);
  if (!R(t))
    return "";
  const n = j(
    t.text,
    t.summary,
    t.description
  );
  if (n)
    return n;
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = Z(t[r]);
      if (i)
        return i;
    }
  return "";
}
function xt(e) {
  const t = M(e);
  return typeof t == "string" ? ne(t) ? "" : t : R(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? j(t.text, t.markdown) : "";
}
function Rt(e) {
  const t = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function Me(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const n = Me(t);
    if (n)
      return n;
  }
  return "";
}
function Se(e) {
  const t = M(e);
  if (!R(t))
    return null;
  if (String(t.type || "") === "doc")
    return J(t);
  const n = Object.keys(t).filter((r) => r !== "format");
  return n.length === 1 && n[0] === "rich" ? J(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? J(t.rich ?? t.content) : null;
}
function Nt(e) {
  const t = M(e);
  return R(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function Ot(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Dt(...e) {
  for (const t of e) {
    const n = z(t)[0];
    if (n)
      return n;
  }
  return "";
}
function xe(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!R(n))
      return;
    n = n[r];
  }
  return n;
}
function Re(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function te(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function Ne(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function ne(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
export {
  be as A,
  _t as a,
  jt as b,
  Et as c,
  Jt as n,
  Tt as r,
  ve as s,
  Lt as u
};
