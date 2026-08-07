import { j as p } from "./createLucideIcon-fWv1XcFy.js";
import { i as D, k as I, m as L, g as U } from "./runtime-entry-ClkZDmNs.js";
import { c as P, n as j, a as O } from "./space-storyboard-shot-card-DVUe0KAE.js";
const T = U(
  "@/components/reference-composer"
), x = T.ReferenceEditor, b = T.ReferenceContentView, $ = L(void 0);
function Z({
  value: e,
  content: n,
  items: t,
  placeholder: r,
  disabled: i,
  textEditable: o,
  autoFocus: d,
  className: c,
  layerZIndex: v,
  usageOptions: l = [],
  pickerRequest: s,
  onPickerRequestConsumed: a,
  onReferenceDelete: u,
  onReferenceUsageChange: C,
  onChange: w,
  onSubmit: k,
  assetReferenceProvider: y
}) {
  const M = N(t);
  return /* @__PURE__ */ p(
    z,
    {
      value: e,
      content: n,
      adapter: M,
      placeholder: r,
      disabled: i,
      textEditable: o,
      autoFocus: d,
      className: c,
      layerZIndex: v,
      usageOptions: l,
      pickerRequest: s,
      onPickerRequestConsumed: a,
      onReferenceDelete: u,
      onReferenceUsageChange: C,
      onChange: w,
      onSubmit: k,
      assetReferenceProvider: y
    }
  );
}
function z({
  value: e,
  content: n,
  adapter: t,
  placeholder: r,
  disabled: i,
  textEditable: o = !0,
  autoFocus: d,
  className: c,
  layerZIndex: v,
  usageOptions: l = [],
  pickerRequest: s,
  onPickerRequestConsumed: a,
  onReferenceDelete: u,
  onReferenceUsageChange: C,
  onChange: w,
  onSubmit: k,
  assetReferenceProvider: y
}) {
  const M = I(
    $
  ), h = y || M, A = n || P(e, t.options), S = l.map(
    (f) => [
      f.key,
      f.label,
      f.maxFiles || 0,
      ...f.acceptedKinds || []
    ].join(":")
  ).join("|");
  return x ? /* @__PURE__ */ p(
    x,
    {
      value: e,
      content: A,
      references: t.options,
      placeholder: r,
      disabled: i,
      textEditable: o,
      autoFocus: d,
      className: c,
      layerZIndex: v,
      pickerScopes: ["current"],
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: t.loadReferences,
      loadPreview: t.loadPreview,
      providers: h ? [h] : void 0,
      usageOptions: l,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: s,
      onPickerRequestConsumed: a,
      onReferenceDelete: u,
      onReferenceUsageChange: C,
      onChange: w,
      onSubmit: k
    },
    S
  ) : /* @__PURE__ */ p(
    "textarea",
    {
      className: c,
      value: e,
      disabled: i,
      readOnly: !o,
      placeholder: r,
      onChange: (f) => w(f.target.value),
      onKeyDown: (f) => {
        k && (f.metaKey || f.ctrlKey) && f.key === "Enter" && (f.preventDefault(), k());
      }
    }
  );
}
function q({
  value: e,
  content: n,
  adapter: t,
  placeholder: r = "",
  className: i = ""
}) {
  const o = I(
    $
  ), d = n ? F(n, t.options) : P(e, t.options);
  return !b || !d?.parts.length ? /* @__PURE__ */ p("span", { className: i, children: e || r }) : /* @__PURE__ */ p("span", { className: `ws-canvas-reference-text ${i}`.trim(), children: /* @__PURE__ */ p(
    b,
    {
      content: d,
      fallback: e || r,
      references: t.options,
      showMediaAliases: !0,
      loadPreview: (c) => c.refType === "asset" && o?.loadPreview ? o.loadPreview(c) : t.loadPreview(c)
    }
  ) });
}
function F(e, n) {
  const t = new Map(
    n.map((r) => [
      g(r.refType, r.refId),
      r.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (r) => r.type === "reference" ? {
        ...r,
        label: j(
          t.get(g(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function N(e) {
  return D(() => {
    const n = V(e), t = /* @__PURE__ */ new Map(), r = n.flatMap((i) => {
      const o = Number(i.refId || 0), d = Number(i.versionID || 0);
      if (o <= 0 || d <= 0)
        return [];
      const c = W(i, o);
      return t.set(
        g(c.refType, c.refId),
        i
      ), [c];
    });
    return {
      options: r,
      loadReferences: async (i) => ({
        items: i.scope === "current" ? J(r, i.query) : []
      }),
      loadPreview: async (i) => _(
        t.get(
          g(i.refType, i.refId)
        ),
        i
      )
    };
  }, [e]);
}
function V(e) {
  const n = [], t = /* @__PURE__ */ new Set();
  for (const r of e) {
    const i = m(r.title);
    if (!i)
      continue;
    const o = `${r.source}:${r.id}`;
    t.has(o) || (t.add(o), n.push({ ...r, title: i }));
  }
  return n;
}
function W(e, n) {
  const t = E(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    label: m(e.title),
    description: R(e),
    preview: {
      text: R(e),
      kind: t[0]?.kind || e.kind,
      url: t[0]?.url || ""
    },
    mediaCount: t.length
  };
}
function _(e, n) {
  if (!e)
    return {
      refType: n.refType,
      refId: n.refId,
      title: n.label,
      text: "引用内容已不可用",
      media: []
    };
  const t = E(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: m(e.title),
    text: R(e),
    media: t,
    content: t.length > 0 ? void 0 : e.output
  };
}
function g(e, n) {
  return `${e}:${n}`;
}
function E(e) {
  const n = K(e.kind), t = B(e.output, n), r = G(e), i = t.length > 0 ? t : r, o = m(e.title), d = /* @__PURE__ */ new Set(), c = i.flatMap((s) => {
    const a = s.url.trim(), u = `${s.kind}:${a}`;
    return !a || d.has(u) ? [] : (d.add(u), [{ ...s, url: a }]);
  }), v = c.reduce((s, a) => (s.set(a.kind, (s.get(a.kind) || 0) + 1), s), /* @__PURE__ */ new Map()), l = /* @__PURE__ */ new Map();
  return c.map((s) => {
    const a = (l.get(s.kind) || 0) + 1;
    return l.set(s.kind, a), {
      kind: s.kind,
      url: s.url,
      index: a,
      label: (v.get(s.kind) || 0) > 1 ? `${o} · ${H(s.kind)} ${a}` : o
    };
  });
}
function B(e, n) {
  const r = ["image", "video", "audio"].flatMap(
    (o) => O(e, o).map((d) => ({ kind: o, url: d }))
  );
  if (!n || n === "file")
    return r;
  const i = r.filter(
    (o) => o.kind === n
  );
  return i.length > 0 ? i : r;
}
function G(e) {
  const n = [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ], t = K(e.kind), r = t ? n.filter((i) => i.kind === t && i.url) : [];
  return r.length > 0 ? r : n.filter((i) => i.url);
}
function K(e) {
  const n = String(e || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : "";
}
function H(e) {
  switch (e) {
    case "image":
      return "图片";
    case "video":
      return "视频";
    case "audio":
      return "音频";
    default:
      return "文件";
  }
}
function R(e) {
  const n = String(e.preview.text || "").trim();
  return !n || n === e.title ? e.kind === "text" ? "画布文本内容" : "画布生成素材" : n.length > 160 ? `${n.slice(0, 160)}...` : n;
}
function J(e, n) {
  const t = n.trim().toLowerCase();
  return t ? e.filter(
    (r) => [r.label, r.description, r.preview?.kind].some(
      (i) => String(i || "").toLowerCase().includes(t)
    )
  ) : e;
}
function m(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
export {
  Z as C,
  $ as a,
  q as b,
  z as c,
  N as u
};
