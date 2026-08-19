import { j as p, a as R, F as Ce } from "./preloadable-Bomi5PEU.js";
import { u as $, a as T, d as Ke, b as re } from "./_commonjsHelpers-61wyk6v6.js";
import { B as ie, aR as Le, aJ as Ue, b3 as ce, b4 as _e, q as Te, b as je, b5 as ue, ak as Pe, u as Ee, av as Je, ax as v, au as le, ah as ze, aE as Be, ac as O, b6 as fe, p as We, b7 as me, b8 as qe, b9 as Ve, ay as E, ab as Ge, aj as j, ba as pe, aw as ye } from "./upload-asset-api-MyhTP8sK.js";
import { X as He, L as Xe, U as Qe } from "./vendor-icons-B3DKX3la.js";
import { d as Ye } from "./file-kind-UfTAlHnR.js";
import { k as Ze } from "./site-config-C63CM9jT.js";
import { A as et } from "./asset-page-BzKeaXwO.js";
function he({
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
  maxSelection: y = 1,
  confirmSelection: h = !1,
  contentMode: w = "preview",
  validateAsset: K,
  uploadAccept: g,
  onUpload: A,
  onClose: k,
  onConfirm: D
}) {
  const L = JSON.stringify(l), c = $(
    () => oe(JSON.parse(L)),
    [L]
  ), M = JSON.stringify(a || {}), S = $(
    () => JSON.parse(M),
    [M]
  ), [x, U] = T(
    c
  ), [xe, C] = T(/* @__PURE__ */ new Map()), [Ne, Z] = T(
    S
  ), [ee, F] = T(""), [N, z] = T(!1), [Re, Oe] = T(0), te = Ke(null), I = f ? Math.max(1, y) : 1;
  re(() => {
    e && (U(c.slice(0, I)), C(/* @__PURE__ */ new Map()), Z(S), F(""), z(!1));
  }, [
    S,
    c,
    e,
    I,
    n,
    t
  ]), re(() => {
    if (!e) return;
    const s = (u) => {
      u.key === "Escape" && !N && k();
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [k, e, N]);
  async function De(s) {
    const u = Array.from(s.target.files || []);
    if (s.target.value = "", !A || u.length === 0 || N) return;
    const d = f ? Math.max(I - x.length, 0) : 1;
    if (d <= 0) {
      F(`最多选择 ${I} 项资产。`);
      return;
    }
    z(!0), F("");
    const b = [], _ = [];
    try {
      for (const P of u.slice(0, d))
        try {
          const B = await A([P]);
          for (const W of B) {
            const ne = K?.(W) || "";
            ne ? _.push(`${P.name}：${ne}`) : W.id > 0 && b.push(W);
          }
        } catch (B) {
          _.push(`${P.name}：${Ze(B, "上传失败")}`);
        }
      b.length > 0 && (Fe(b), Z({
        sourceType: "upload",
        kind: o?.length === 1 ? o[0] : ""
      }), Oe((P) => P + 1)), F(_.join("；"));
    } finally {
      z(!1);
    }
  }
  function Fe(s) {
    const u = Array.from(
      new Map(s.map((d) => [d.id, d])).values()
    );
    C((d) => {
      const b = new Map(d);
      return u.forEach((_) => b.set(_.id, _)), b;
    }), U(
      (d) => f ? oe([
        ...d,
        ...u.map((b) => b.id)
      ]).slice(0, I) : u[0] ? [u[0].id] : d
    );
  }
  function Ie(s) {
    if (h && f && x.includes(s.id)) {
      U((d) => d.filter((b) => b !== s.id)), C((d) => {
        const b = new Map(d);
        return b.delete(s.id), b;
      }), F("");
      return;
    }
    const u = K?.(s) || "";
    if (u) {
      F(u);
      return;
    }
    if (F(""), !h) {
      D([s], [s.id]), k();
      return;
    }
    if (!f) {
      U([s.id]), C(/* @__PURE__ */ new Map([[s.id, s]]));
      return;
    }
    if (x.length >= I) {
      F(`最多选择 ${I} 项资产。`);
      return;
    }
    U((d) => [...d, s.id]), C((d) => new Map(d).set(s.id, s));
  }
  function $e() {
    const s = x.map((u) => xe.get(u)).filter((u) => !!u);
    D(s, x), k();
  }
  return !e || typeof document > "u" ? null : Ye(
    /* @__PURE__ */ p(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": r,
        onMouseDown: (s) => {
          s.target === s.currentTarget && !N && k();
        },
        children: /* @__PURE__ */ R("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ R("header", { children: [
            /* @__PURE__ */ R("div", { children: [
              /* @__PURE__ */ p("h2", { children: r }),
              /* @__PURE__ */ p("p", { children: i })
            ] }),
            /* @__PURE__ */ p(ie, { label: "关闭", children: /* @__PURE__ */ R("button", { type: "button", disabled: N, onClick: k, children: [
              /* @__PURE__ */ p(He, { "aria-hidden": "true" }),
              /* @__PURE__ */ p("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          ee ? /* @__PURE__ */ p("p", { className: "wb-asset-picker-message", children: ee }) : null,
          /* @__PURE__ */ p(
            et,
            {
              teamID: t,
              scopeProjectID: n,
              initialFilters: Ne,
              allowedKinds: o,
              contentMode: w,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetIDs: x,
              usedAssetIDs: m,
              reloadSignal: Re,
              onAssetChanged: (s) => {
                x.includes(s.id) && C(
                  (u) => new Map(u).set(s.id, s)
                );
              },
              onAssetRemoved: (s) => {
                U(
                  (u) => u.filter((d) => d !== s)
                ), C((u) => {
                  const d = new Map(u);
                  return d.delete(s), d;
                });
              },
              headerAction: A ? /* @__PURE__ */ R(Ce, { children: [
                /* @__PURE__ */ p(ie, { label: "本地上传", children: /* @__PURE__ */ R(
                  "button",
                  {
                    type: "button",
                    className: "wb-asset-local-upload",
                    disabled: N,
                    onClick: () => te.current?.click(),
                    children: [
                      N ? /* @__PURE__ */ p(Xe, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ p(Qe, { "aria-hidden": "true" }),
                      /* @__PURE__ */ p("span", { children: N ? "上传中" : "本地上传" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ p(
                  "input",
                  {
                    ref: te,
                    type: "file",
                    hidden: !0,
                    multiple: f,
                    accept: g,
                    onChange: De
                  }
                )
              ] }) : void 0,
              onSelect: Ie
            }
          ),
          h ? /* @__PURE__ */ R("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ R("span", { children: [
              "已选 ",
              x.length,
              f ? ` / ${I}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ R("div", { children: [
              /* @__PURE__ */ p("button", { type: "button", onClick: k, children: "取消" }),
              /* @__PURE__ */ p(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: N || x.length === 0,
                  onClick: $e,
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
function oe(e) {
  return Array.from(
    new Set(e.map(Number).filter((t) => Number.isFinite(t) && t > 0))
  );
}
function $t({
  teamID: e,
  scopeProjectID: t = 0,
  initialFilters: n,
  allowedKinds: r,
  onSelect: i,
  onUpload: a
}) {
  const o = JSON.stringify(n || {}), l = JSON.stringify(r || []), m = $(
    () => JSON.parse(o),
    [o]
  ), f = $(
    () => JSON.parse(l),
    [l]
  );
  return $(
    () => ({
      trigger: "@",
      referenceTypes: ["asset"],
      loadPreview: async (y) => {
        const h = await Le(e, y.refId), w = X(h.asset);
        return {
          refType: "asset",
          refId: h.asset.id,
          title: h.asset.name,
          text: h.asset.summary,
          media: w,
          content: w.length > 0 ? void 0 : Ue(
            h.asset.kind,
            h.asset.version?.content
          )
        };
      },
      renderPicker: (y) => /* @__PURE__ */ p(
        tt,
        {
          ...y,
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
function tt({
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
  onUpload: y,
  onSelect: h,
  onSelectMany: w,
  onClose: K
}) {
  if (!e)
    return null;
  const g = rt(a), A = it(
    i || [],
    g
  ), k = Math.max(1, Number(l || 1)), D = Array.from(
    new Set(
      m.flatMap(
        (c) => c.ref_type === "asset" && Number(c.ref_id || 0) > 0 ? [Number(c.ref_id)] : []
      )
    )
  ), L = new Set(D);
  return /* @__PURE__ */ p(
    he,
    {
      open: !0,
      teamID: t,
      scopeProjectID: n,
      title: "选择资产",
      description: "插入资产当前版本",
      initialFilters: r,
      allowedKinds: A,
      multiple: k > 1,
      maxSelection: k,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetIDs: D,
      validateAsset: (c) => L.has(c.id) ? "该素材已使用" : X(c).length > 0 ? "" : "该资产当前版本没有可用文件，无法用于此参数。",
      uploadAccept: ce(A),
      onUpload: y ? (c) => y(c, {
        preferredUsage: o,
        acceptedKinds: A
      }) : void 0,
      onClose: K,
      onConfirm: (c) => {
        const M = c.map(
          (S) => nt(S, o)
        );
        for (const S of M)
          f?.(S);
        if (w) {
          w(M);
          return;
        }
        for (const S of M)
          h(S);
      }
    }
  );
}
function nt(e, t = "") {
  const n = X(e);
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
function rt(e) {
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
function it(e, t) {
  if (e.length === 0)
    return t;
  if (t.length === 0)
    return e;
  const n = new Set(t);
  return e.filter((r) => n.has(r));
}
const ot = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function X(e) {
  const t = e.version?.content, n = st(t, e.kind), r = n.length > 0 ? n : ot.has(e.kind) ? _e(t, e.kind).map((i) => ({
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
function st(e, t) {
  const n = Te(e), r = at(t);
  return (r && n.includes(r) ? [r] : n).flatMap(
    (a) => je(e, a).map((o) => ({ kind: a, url: o }))
  );
}
function at(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
const dt = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function Ct({
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
  const f = $(
    () => ct(i, n.asset_kinds),
    [n.asset_kinds, i]
  ), y = $(() => ut(r), [r]), h = $(
    () => r.filter((g) => !ge(g.id)),
    [r]
  ), w = a ? Math.max(o - h.length, 0) : 1, K = Array.from(y.keys()).slice(
    0,
    w
  );
  return /* @__PURE__ */ p(
    he,
    {
      open: t,
      teamID: e,
      title: `${n.name}资产库`,
      description: `选择当前团队的${ft(f)}资产`,
      allowedKinds: f,
      initialSelectedAssetIDs: K,
      multiple: a,
      maxSelection: Math.max(w, 1),
      confirmSelection: !0,
      uploadAccept: ce(f),
      onUpload: (g) => mt({
        teamID: e,
        ruleID: Number(n.upload_rule_id || 0),
        kind: i,
        files: g
      }),
      validateAsset: (g) => w <= 0 ? `当前参数最多只能选择 ${o} 个文件。` : f.includes(g.kind) ? ue(g.version?.content, g.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。" : "该资产类型不适用于当前参数。",
      onClose: () => l(!1),
      onConfirm: (g, A) => {
        const k = new Map(
          g.map((c) => [c.id, c])
        ), D = A.map((c) => {
          const M = k.get(c);
          return M ? lt(M) : y.get(c);
        }).filter((c) => !!c), L = a ? [...h, ...D].slice(0, o) : D.slice(0, 1);
        m(L);
      }
    }
  );
}
function ct(e, t) {
  const n = se(e);
  if (n) return [n];
  const r = Array.from(
    new Set(
      (t || []).map(se).filter((i) => !!i)
    )
  );
  return r.length > 0 ? r : ["image", "audio", "video", "file"];
}
function se(e) {
  const t = String(e || "");
  return dt.has(t) ? t : void 0;
}
function ut(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n) => {
    const r = ge(n.id);
    r && t.set(r.assetID, n);
  }), t;
}
function ge(e) {
  const t = /^asset:(\d+):(\d+)$/.exec(String(e || ""));
  return t ? {
    assetID: Number(t[1]),
    versionID: Number(t[2])
  } : null;
}
function lt(e) {
  const t = ue(e.version?.content, e.kind);
  if (t)
    return {
      id: `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function ft(e) {
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
async function mt(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await Pe({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind
  })).map(({ asset: n }) => Ee(n)).filter((n) => n.id > 0);
}
function Kt(e, t) {
  const n = yt(e, t), r = le(n);
  if (r)
    return {
      mode: "storyboard_grid",
      value: r,
      format: "json",
      summary: ke(r),
      downloadUrl: ""
    };
  const i = We(n);
  if (i)
    return {
      mode: "storyboard",
      value: i,
      format: "json",
      summary: me(i),
      downloadUrl: ""
    };
  const a = ve(n);
  if (a) {
    const y = At(n) ? null : qe(a);
    return y && (e.kind === "text" || Ve(y.plainText)) ? q(y.markdown) : ae(a);
  }
  const o = G(n);
  if (o)
    return {
      mode: "file",
      value: o,
      format: "json",
      summary: o.description || o.name || "文件内容",
      downloadUrl: o.url
    };
  const l = wt(n);
  if (l)
    return q(l);
  const m = ht(n);
  if (m)
    return ae(m);
  const f = H(n) || e.description || "";
  return q(f);
}
function Lt(e, t, n = {}) {
  const r = n.includeNodeResult === !1 ? t?.content : Je(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ae(e, "result", "output")
  ), i = v(r);
  if (le(i))
    return;
  const a = ze(i);
  for (const l of [i, v(a)])
    if (Be(l))
      return pt(l);
  const o = kt(e.kind, i);
  if (o)
    return o;
}
function pt(e) {
  const n = fe(e).map((r) => {
    if (!O(r) || r.json === void 0)
      return r;
    const i = { ...r };
    return delete i.json, i;
  });
  return n.length === 1 ? n[0] : n;
}
function yt(e, t) {
  return Ge(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    Ae(e, "result", "output"),
    e.description
  );
}
function be(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return bt(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : E(v(t)) || vt(t);
}
function Ut(e) {
  return ye(be(e));
}
function _t(e, t) {
  const n = { ...e, value: t };
  if (n.mode === "storyboard")
    n.summary = me(t);
  else if (n.mode === "storyboard_grid")
    n.summary = ke(t);
  else if (n.mode === "file") {
    const r = t;
    n.summary = r.description || r.name || "文件内容", n.downloadUrl = r.url;
  } else
    n.summary = Q(pe(be(n)));
  return n;
}
function ke(e) {
  return j(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function ae(e) {
  const t = pe(e);
  return {
    mode: "rich",
    value: ye(e),
    format: "json",
    summary: Q(t),
    downloadUrl: we(e)
  };
}
function q(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: Q(e),
    downloadUrl: ""
  };
}
function ht(e) {
  if (typeof e == "string" && v(e) === e)
    return null;
  const t = fe(e), n = [];
  return V(
    t,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : E({ type: "doc", content: n });
}
function V(e, t, n, r, i, a) {
  if (e == null || a > 12)
    return;
  const o = v(e);
  if (typeof o == "string") {
    de(t, o, r);
    return;
  }
  if (Array.isArray(o)) {
    o.forEach(
      (m) => V(
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
  if (!O(o) || n.has(o))
    return;
  n.add(o);
  const l = ve(o);
  if (l) {
    for (const m of l.content || [])
      t.push(m);
    return;
  }
  de(
    t,
    j(o.title, o.text),
    r
  ), gt(o, t, i);
  for (const m of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    o[m] !== void 0 && V(
      o[m],
      t,
      n,
      r,
      i,
      a + 1
    );
}
function gt(e, t, n) {
  const r = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of r)
    for (const a of i.values)
      for (const o of J(a)) {
        const l = `${i.kind}:${o}`;
        n.has(l) || (n.add(l), t.push({
          type: Mt(i.kind),
          attrs: { src: o }
        }));
      }
}
function de(e, t, n) {
  const r = String(t || "").trim();
  !r || Se(r) || Y(r) || n.has(r) || (n.add(r), e.push({
    type: "paragraph",
    content: [{ type: "text", text: r }]
  }));
}
function J(e) {
  return Array.isArray(e) ? e.flatMap(J) : typeof e == "string" ? Se(e.trim()) ? [e.trim()] : [] : O(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(J) : [];
}
function G(e) {
  const t = v(e);
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = G(r);
      if (i)
        return i;
    }
    return null;
  }
  if (!O(t))
    return null;
  const n = St(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (n)
    return {
      url: n,
      name: j(t.name, t.filename, t.title) || Me(n),
      description: j(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (t[r] !== void 0) {
      const i = G(t[r]);
      if (i)
        return i;
    }
  return null;
}
function bt(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || Me(e.url),
    description: e.description.trim()
  };
}
function kt(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = J(t);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function H(e) {
  const t = v(e);
  if (typeof t == "string")
    return Y(t) ? "" : t;
  if (Array.isArray(t))
    return t.map(H).filter(Boolean).join(`

`);
  if (!O(t))
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
      const i = H(t[r]);
      if (i)
        return i;
    }
  return "";
}
function wt(e) {
  const t = v(e);
  return typeof t == "string" ? Y(t) ? "" : t : O(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? j(t.text, t.markdown) : "";
}
function vt(e) {
  const t = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function we(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const n = we(t);
    if (n)
      return n;
  }
  return "";
}
function ve(e) {
  const t = v(e);
  if (!O(t))
    return null;
  if (String(t.type || "") === "doc")
    return E(t);
  const n = Object.keys(t).filter((r) => r !== "format");
  return n.length === 1 && n[0] === "rich" ? E(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? E(t.rich ?? t.content) : null;
}
function At(e) {
  const t = v(e);
  return O(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function Mt(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function St(...e) {
  for (const t of e) {
    const n = J(t)[0];
    if (n)
      return n;
  }
  return "";
}
function Ae(e, ...t) {
  let n = e;
  for (const r of t) {
    if (!O(n))
      return;
    n = n[r];
  }
  return n;
}
function Me(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function Q(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function Se(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function Y(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
export {
  he as A,
  Ct as a,
  Lt as b,
  Ut as c,
  _t as n,
  Kt as r,
  be as s,
  $t as u
};
