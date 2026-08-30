import { j as b, a as N, F as Je } from "./preloadable-Bomi5PEU.js";
import { u as K, a as C, d as ze, b as fe } from "./_commonjsHelpers-61wyk6v6.js";
import { B as Be, bz as O, bD as We, bp as Ge, bj as Ve, b8 as qe, bE as be, be as He, bF as Xe, r as Qe, m as Ye, bq as ke, aB as Ze, v as et, aT as tt, aX as A, b2 as we, ay as rt, b6 as nt, an as x, bG as ve, p as it, bH as Ae, bI as me, bg as ne, bJ as ot, aU as z, b3 as Me, aj as st, aA as E } from "./upload-asset-api-DDv34zo1.js";
import { X as at } from "./vendor-icons-DwjYEojZ.js";
import { b as dt } from "./file-kind-CYMG3EzQ.js";
import { k as ct } from "./site-config-C63CM9jT.js";
import { A as lt, d as ut } from "./asset-page-B8_TS_uu.js";
function Se({
  open: e,
  teamID: t,
  scopeProjectID: r = 0,
  title: n = "选择资产",
  description: i = "使用资产当前版本",
  initialFilters: a,
  allowedKinds: o,
  initialSelectedAssetIDs: l = [],
  initialSelectedAssetKeys: u = [],
  usedAssetIDs: k = [],
  usedAssetKeys: y = [],
  includeOfficial: h = !0,
  multiple: f = !1,
  maxSelection: F = 1,
  confirmSelection: g = !1,
  contentMode: M = "preview",
  validateAsset: P,
  uploadAccept: T,
  onUpload: U,
  onClose: s,
  onConfirm: w
}) {
  const D = JSON.stringify({
    initialSelectedAssetIDs: l,
    initialSelectedAssetKeys: u
  }), V = K(
    () => pe([
      ...u,
      ...l.map((c) => `asset:${c}`)
    ]),
    [D]
  ), ae = JSON.stringify(a || {}), q = K(
    () => JSON.parse(ae),
    [ae]
  ), [S, j] = C(
    V
  ), [Te, L] = C(/* @__PURE__ */ new Map()), [Ue, de] = C(
    q
  ), [ce, R] = C(""), [I, H] = C(!1), [De, W] = C(null), [Le, Ie] = C(0), le = ze(null), $ = f ? Math.max(1, F) : 1;
  fe(() => {
    e && (j(V.slice(0, $)), L(/* @__PURE__ */ new Map()), de(q), R(""), H(!1), W(null));
  }, [
    q,
    V,
    e,
    $,
    r,
    t
  ]), fe(() => {
    if (!e) return;
    const c = (d) => {
      d.key === "Escape" && !I && s();
    };
    return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
  }, [s, e, I]);
  async function _e(c) {
    const d = Array.from(c.target.files || []);
    if (c.target.value = "", !U || d.length === 0 || I) return;
    const m = f ? Math.max($ - S.length, 0) : 1;
    if (m <= 0) {
      R(`最多选择 ${$} 项素材。`);
      return;
    }
    const p = d.slice(0, m), v = We(
      p,
      W
    );
    H(!0), W(null), R("");
    const X = [], Q = [];
    try {
      for (const [J, Y] of p.entries()) {
        v.start(J);
        try {
          const Z = await U([Y], {
            onProgress: (_) => v.report(
              J,
              _.loaded,
              _.total,
              _.phase
            )
          });
          for (const _ of Z) {
            const ue = P?.(_) || "";
            ue ? Q.push(`${Y.name}：${ue}`) : _.id > 0 && X.push(_);
          }
        } catch (Z) {
          Q.push(`${Y.name}：${ct(Z, "上传失败")}`);
        } finally {
          v.complete(J);
        }
      }
      X.length > 0 && (Ce(X), de({
        sourceType: "upload",
        kind: o?.length === 1 ? o[0] : ""
      }), Ie((J) => J + 1)), R(Q.join("；"));
    } finally {
      H(!1), W(null);
    }
  }
  function Ce(c) {
    const d = Array.from(
      new Map(c.map((m) => [O(m), m])).values()
    );
    L((m) => {
      const p = new Map(m);
      return d.forEach((v) => p.set(O(v), v)), p;
    }), j(
      (m) => f ? pe([
        ...m,
        ...d.map(O)
      ]).slice(0, $) : d[0] ? [O(d[0])] : m
    );
  }
  function je(c) {
    const d = O(c);
    if (g && f && S.includes(d)) {
      j(
        (p) => p.filter((v) => v !== d)
      ), L((p) => {
        const v = new Map(p);
        return v.delete(d), v;
      }), R("");
      return;
    }
    const m = P?.(c) || "";
    if (m) {
      R(m);
      return;
    }
    if (R(""), !g) {
      w([c], [d]), s();
      return;
    }
    if (!f) {
      j([d]), L(/* @__PURE__ */ new Map([[d, c]]));
      return;
    }
    if (S.length >= $) {
      R(`最多选择 ${$} 项素材。`);
      return;
    }
    j((p) => [...p, d]), L((p) => new Map(p).set(d, c));
  }
  function Ee() {
    const c = S.map((d) => Te.get(d)).filter((d) => !!d);
    w(c, S), s();
  }
  return !e || typeof document > "u" ? null : dt(
    /* @__PURE__ */ b(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": n,
        onMouseDown: (c) => {
          c.target === c.currentTarget && !I && s();
        },
        children: /* @__PURE__ */ N("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ N("header", { children: [
            /* @__PURE__ */ N("div", { children: [
              /* @__PURE__ */ b("h2", { children: n }),
              /* @__PURE__ */ b("p", { children: i })
            ] }),
            /* @__PURE__ */ b(Be, { label: "关闭", children: /* @__PURE__ */ N("button", { type: "button", disabled: I, onClick: s, children: [
              /* @__PURE__ */ b(at, { "aria-hidden": "true" }),
              /* @__PURE__ */ b("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          ce ? /* @__PURE__ */ b("p", { className: "wb-asset-picker-message", children: ce }) : null,
          /* @__PURE__ */ b(
            lt,
            {
              teamID: t,
              scopeProjectID: r,
              initialFilters: Ue,
              allowedKinds: o,
              contentMode: M,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetKeys: S,
              usedAssetIDs: k,
              usedAssetKeys: y,
              includeOfficial: h,
              reloadSignal: Le,
              onAssetChanged: (c) => {
                const d = O(c);
                S.includes(d) && L(
                  (m) => new Map(m).set(d, c)
                );
              },
              onAssetRemoved: (c) => {
                const d = `asset:${c}`;
                j(
                  (m) => m.filter((p) => p !== d)
                ), L((m) => {
                  const p = new Map(m);
                  return p.delete(d), p;
                });
              },
              headerAction: U ? /* @__PURE__ */ N(Je, { children: [
                /* @__PURE__ */ b(
                  ut,
                  {
                    uploading: I,
                    progress: De,
                    onClick: () => le.current?.click()
                  }
                ),
                /* @__PURE__ */ b(
                  "input",
                  {
                    ref: le,
                    type: "file",
                    hidden: !0,
                    multiple: f,
                    accept: T,
                    onChange: _e
                  }
                )
              ] }) : void 0,
              onSelect: je
            }
          ),
          g ? /* @__PURE__ */ N("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ N("span", { children: [
              "已选 ",
              S.length,
              f ? ` / ${$}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ N("div", { children: [
              /* @__PURE__ */ b("button", { type: "button", onClick: s, children: "取消" }),
              /* @__PURE__ */ b(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: I || S.length === 0,
                  onClick: Ee,
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
function pe(e) {
  return Array.from(
    new Set(
      e.map((t) => String(t || "").trim()).filter((t) => /^(asset|material):[1-9]\d*$/.test(t))
    )
  );
}
function zt({
  teamID: e,
  scopeProjectID: t = 0,
  initialFilters: r,
  allowedKinds: n,
  onSelect: i,
  onUpload: a
}) {
  const o = JSON.stringify(r || {}), l = JSON.stringify(n || []), u = K(
    () => JSON.parse(o),
    [o]
  ), k = K(
    () => JSON.parse(l),
    [l]
  );
  return K(
    () => ({
      trigger: "@",
      referenceTypes: ["asset", "material"],
      loadPreview: async (y) => {
        const h = y.refType === "material" ? await Ge(e, y.refId) : (await Ve(e, y.refId)).asset, f = ie(h);
        return {
          refType: y.refType,
          refId: h.id,
          title: h.name,
          text: h.summary,
          media: f,
          content: f.length > 0 ? void 0 : qe(h.kind, h.version?.content)
        };
      },
      renderPicker: (y) => /* @__PURE__ */ b(
        ft,
        {
          ...y,
          teamID: e,
          scopeProjectID: t,
          initialFilters: u,
          allowedKinds: k,
          onReferenceSelect: i,
          onUpload: a
        }
      )
    }),
    [i, a, t, u, k, e]
  );
}
function ft({
  open: e,
  teamID: t,
  scopeProjectID: r,
  initialFilters: n,
  allowedKinds: i,
  acceptedKinds: a,
  preferredUsage: o,
  maxSelection: l = 1,
  selectedReferences: u = [],
  onReferenceSelect: k,
  onUpload: y,
  onSelect: h,
  onSelectMany: f,
  onClose: F
}) {
  if (!e)
    return null;
  const g = pt(a), M = yt(
    i || [],
    g
  ), P = Math.max(1, Number(l || 1)), T = Array.from(
    new Set(
      u.flatMap(
        (s) => (s.ref_type === "asset" || s.ref_type === "material") && Number(s.ref_id || 0) > 0 ? [`${s.ref_type}:${Number(s.ref_id)}`] : []
      )
    )
  ), U = new Set(T);
  return /* @__PURE__ */ b(
    Se,
    {
      open: !0,
      teamID: t,
      scopeProjectID: r,
      title: "选择素材",
      description: `从个人资产或团队${He("official")}中选择`,
      initialFilters: n,
      allowedKinds: M,
      multiple: P > 1,
      maxSelection: P,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetKeys: T,
      validateAsset: (s) => U.has(O(s)) ? "该素材已使用" : s.kind === "text" || s.kind === "richtext" || ie(s).length > 0 ? "" : "该素材没有可用文件，无法使用。",
      uploadAccept: be(M),
      onUpload: y ? (s, w) => y(s, {
        preferredUsage: o,
        acceptedKinds: M,
        onProgress: w?.onProgress
      }) : void 0,
      onClose: F,
      onConfirm: (s) => {
        const w = s.map(
          (D) => mt(D, o)
        );
        for (const D of w)
          k?.(D);
        if (f) {
          f(w);
          return;
        }
        for (const D of w)
          h(D);
      }
    }
  );
}
function mt(e, t = "") {
  const r = ie(e), n = e.libraryType === "material" ? "material" : "asset";
  return {
    key: n === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
    refType: n,
    refId: e.id,
    versionID: n === "asset" ? e.versionID : void 0,
    trigger: "@",
    usage: t,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: r[0]?.kind || e.kind,
      url: r[0]?.url
    },
    output: e.version?.content,
    asset: e,
    mediaCount: r.length
  };
}
function pt(e) {
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
      (e || []).flatMap((r) => {
        const n = String(r || "").trim();
        return t.has(n) ? [n] : [];
      })
    )
  );
}
function yt(e, t) {
  if (e.length === 0)
    return t;
  if (t.length === 0)
    return e;
  const r = new Set(t);
  return e.filter((n) => r.has(n));
}
const ht = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function ie(e) {
  const t = e.version?.content, r = gt(t, e.kind), n = r.length > 0 ? r : ht.has(e.kind) ? Xe(t, e.kind).map((i) => ({
    kind: e.kind,
    url: i
  })) : [];
  return n.map((i, a) => ({
    refType: e.libraryType === "material" ? "material" : "asset",
    refId: e.id,
    kind: i.kind,
    label: n.length > 1 ? `${e.name} · ${a + 1}` : e.name,
    url: i.url,
    index: a + 1
  }));
}
function gt(e, t) {
  const r = Qe(e), n = bt(t);
  return (n && r.includes(n) ? [n] : r).flatMap(
    (a) => Ye(e, a).map((o) => ({ kind: a, url: o }))
  );
}
function bt(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
const kt = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function Bt({
  teamID: e,
  open: t,
  param: r,
  files: n,
  resourceKind: i,
  multiple: a,
  maxSelection: o,
  onOpenChange: l,
  onConfirm: u
}) {
  const k = K(
    () => wt(i, r.asset_kinds),
    [r.asset_kinds, i]
  ), y = K(() => vt(n), [n]), h = K(
    () => n.filter((g) => !xe(g.id)),
    [n]
  ), f = a ? Math.max(o - h.length, 0) : 1, F = Array.from(y.keys()).slice(
    0,
    f
  );
  return /* @__PURE__ */ b(
    Se,
    {
      open: t,
      teamID: e,
      title: `${r.name}素材库`,
      description: `选择当前团队可用的${Mt(k)}素材`,
      allowedKinds: k,
      initialSelectedAssetKeys: F,
      multiple: a,
      maxSelection: Math.max(f, 1),
      confirmSelection: !0,
      uploadAccept: be(k),
      onUpload: (g, M) => St({
        teamID: e,
        ruleID: Number(r.upload_rule_id || 0),
        kind: i,
        files: g,
        onProgress: M?.onProgress
      }),
      validateAsset: (g) => f <= 0 ? `当前参数最多只能选择 ${o} 个文件。` : k.includes(g.kind) ? ke(g.version?.content, g.kind) ? "" : "该素材没有可用文件，无法用于此参数。" : "该素材类型不适用于当前参数。",
      onClose: () => l(!1),
      onConfirm: (g, M) => {
        const P = new Map(
          g.map((s) => [O(s), s])
        ), T = M.map((s) => {
          const w = P.get(s);
          return w ? At(w) : y.get(s);
        }).filter((s) => !!s), U = a ? [...h, ...T].slice(0, o) : T.slice(0, 1);
        u(U);
      }
    }
  );
}
function wt(e, t) {
  const r = ye(e);
  if (r) return [r];
  const n = Array.from(
    new Set(
      (t || []).map(ye).filter((i) => !!i)
    )
  );
  return n.length > 0 ? n : ["image", "audio", "video", "file"];
}
function ye(e) {
  const t = String(e || "");
  return kt.has(t) ? t : void 0;
}
function vt(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const n = xe(r.id);
    n && t.set(n.key, r);
  }), t;
}
function xe(e) {
  const t = String(e || ""), r = /^asset:(\d+):(\d+)$/.exec(t);
  if (r)
    return { key: `asset:${Number(r[1])}` };
  const n = /^material:(\d+)$/.exec(t);
  return n ? { key: `material:${Number(n[1])}` } : null;
}
function At(e) {
  const t = ke(e.version?.content, e.kind);
  if (t)
    return {
      id: e.libraryType === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function Mt(e) {
  const t = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件"
  };
  return e.map((r) => t[r]).join("、");
}
async function St(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await Ze({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind,
    onProgress: e.onProgress
  })).map(({ asset: r }) => et(r)).filter((r) => r.id > 0);
}
function Wt(e, t, r) {
  const n = Rt(e, t), i = r || e.kind, a = we(n);
  if (a)
    return {
      mode: "storyboard_grid",
      value: a,
      format: "json",
      summary: $e(a),
      downloadUrl: ""
    };
  const o = it(n);
  if (o)
    return {
      mode: "storyboard",
      value: o,
      format: "json",
      summary: Ae(o),
      downloadUrl: ""
    };
  const l = Oe(n);
  if (l) {
    if (i === "text") {
      const F = me(l);
      return G(F?.markdown || ne(l));
    }
    const f = Tt(n) ? null : me(l);
    return f && ot(f.plainText) ? G(f.markdown) : he(l);
  }
  const u = te(n);
  if (u)
    return {
      mode: "file",
      value: u,
      format: "json",
      summary: u.description || u.name || "文件内容",
      downloadUrl: u.url
    };
  const k = Ft(n);
  if (k)
    return G(k);
  const y = $t(n);
  if (y)
    return he(y);
  const h = re(n) || e.description || "";
  return G(h);
}
function Gt(e, t, r = {}) {
  const n = r.includeNodeResult === !1 ? t?.content : tt(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ke(e, "result", "output")
  ), i = A(n);
  if (we(i))
    return;
  const a = rt(i);
  for (const l of [i, A(a)])
    if (nt(l))
      return xt(l);
  const o = Kt(e.kind, i);
  if (o)
    return o;
}
function xt(e) {
  const r = ve(e).map((n) => {
    if (!x(n) || n.json === void 0)
      return n;
    const i = { ...n };
    return delete i.json, i;
  });
  return r.length === 1 ? r[0] : r;
}
function Rt(e, t) {
  return st(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ke(e, "result", "output"),
    e.description
  );
}
function Re(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return Ot(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : z(A(t)) || Pt(t);
}
function Vt(e) {
  return Me(Re(e));
}
function qt(e, t) {
  const r = { ...e, value: t };
  if (r.mode === "storyboard")
    r.summary = Ae(t);
  else if (r.mode === "storyboard_grid")
    r.summary = $e(t);
  else if (r.mode === "file") {
    const n = t;
    r.summary = n.description || n.name || "文件内容", r.downloadUrl = n.url;
  } else
    r.summary = oe(ne(Re(r)));
  return r;
}
function $e(e) {
  return E(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function he(e) {
  const t = ne(e);
  return {
    mode: "rich",
    value: Me(e),
    format: "json",
    summary: oe(t),
    downloadUrl: Ne(e)
  };
}
function G(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: oe(e),
    downloadUrl: ""
  };
}
function $t(e) {
  if (typeof e == "string" && A(e) === e)
    return null;
  const t = ve(e), r = [];
  return ee(
    t,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : z({ type: "doc", content: r });
}
function ee(e, t, r, n, i, a) {
  if (e == null || a > 12)
    return;
  const o = A(e);
  if (typeof o == "string") {
    ge(t, o, n);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (u) => ee(
        u,
        t,
        r,
        n,
        i,
        a + 1
      )
    );
    return;
  }
  if (!x(o) || r.has(o))
    return;
  r.add(o);
  const l = Oe(o);
  if (l) {
    for (const u of l.content || [])
      t.push(u);
    return;
  }
  ge(
    t,
    E(o.title, o.text),
    n
  ), Nt(o, t, i);
  for (const u of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[u] !== void 0 && ee(
      o[u],
      t,
      r,
      n,
      i,
      a + 1
    );
}
function Nt(e, t, r) {
  const n = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of n)
    for (const a of i.values)
      for (const o of B(a)) {
        const l = `${i.kind}:${o}`;
        r.has(l) || (r.add(l), t.push({
          type: Ut(i.kind),
          attrs: { src: o }
        }));
      }
}
function ge(e, t, r) {
  const n = String(t || "").trim();
  !n || Pe(n) || se(n) || r.has(n) || (r.add(n), e.push({
    type: "paragraph",
    content: [{ type: "text", text: n }]
  }));
}
function B(e) {
  return Array.isArray(e) ? e.flatMap(B) : typeof e == "string" ? Pe(e.trim()) ? [e.trim()] : [] : x(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(B) : [];
}
function te(e) {
  const t = A(e);
  if (Array.isArray(t)) {
    for (const n of t) {
      const i = te(n);
      if (i)
        return i;
    }
    return null;
  }
  if (!x(t))
    return null;
  const r = Dt(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (r)
    return {
      url: r,
      name: E(t.name, t.filename, t.title) || Fe(r),
      description: E(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const i = te(t[n]);
      if (i)
        return i;
    }
  return null;
}
function Ot(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || Fe(e.url),
    description: e.description.trim()
  };
}
function Kt(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const r = B(t);
  if (r.length !== 0)
    return {
      [`${e}s`]: r
    };
}
function re(e) {
  const t = A(e);
  if (typeof t == "string")
    return se(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(re).filter(Boolean).join(`

`);
  if (!x(t))
    return "";
  const r = E(
    t.text,
    t.summary,
    t.description
  );
  if (r)
    return r;
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const i = re(t[n]);
      if (i)
        return i;
    }
  return "";
}
function Ft(e) {
  const t = A(e);
  return typeof t == "string" ? se(t) ? "" : t : x(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? E(t.text, t.markdown) : "";
}
function Pt(e) {
  const t = e.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function Ne(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const r = Ne(t);
    if (r)
      return r;
  }
  return "";
}
function Oe(e) {
  const t = A(e);
  if (!x(t))
    return null;
  if (String(t.type || "") === "doc")
    return z(t);
  const r = Object.keys(t).filter((n) => n !== "format");
  return r.length === 1 && r[0] === "rich" ? z(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? z(t.rich ?? t.content) : null;
}
function Tt(e) {
  const t = A(e);
  return x(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function Ut(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Dt(...e) {
  for (const t of e) {
    const r = B(t)[0];
    if (r)
      return r;
  }
  return "";
}
function Ke(e, ...t) {
  let r = e;
  for (const n of t) {
    if (!x(r))
      return;
    r = r[n];
  }
  return r;
}
function Fe(e) {
  const r = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function oe(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function Pe(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function se(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
export {
  Se as A,
  Bt as a,
  Gt as b,
  Vt as c,
  qt as n,
  Wt as r,
  Re as s,
  zt as u
};
