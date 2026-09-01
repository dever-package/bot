import { j as v } from "./preloadable-Bomi5PEU.js";
import { u as g, i as _, e as K } from "./_commonjsHelpers-61wyk6v6.js";
import { c as D, n as Y, a as B } from "./space-sequence-card-XcUb-m_s.js";
import { C as L } from "./node-detail-storyboard-grid-BekWU79W.js";
await window.DeverFront?.ensureCompat?.(["@/components/reference-composer"]);
const x = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!x || Object.keys(x).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const H = ["current"], N = [], U = x, $ = U.ReferenceEditor, S = U.ReferenceContentView;
function fe({
  value: e,
  content: n,
  items: o,
  placeholder: t,
  disabled: r,
  textEditable: i,
  autoFocus: a,
  className: f,
  layerZIndex: d,
  usageOptions: l = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: p = !0,
  pickerRequest: h,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: C,
  onBlur: m,
  onSubmit: w,
  assetReferenceProvider: I
}) {
  const b = X(o);
  return /* @__PURE__ */ v(
    J,
    {
      value: e,
      content: n,
      adapter: b,
      placeholder: t,
      disabled: r,
      textEditable: i,
      autoFocus: a,
      className: f,
      layerZIndex: d,
      usageOptions: l,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: p,
      pickerRequest: h,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: C,
      onBlur: m,
      onSubmit: w,
      assetReferenceProvider: I
    }
  );
}
function J({
  value: e,
  content: n,
  adapter: o,
  placeholder: t,
  disabled: r,
  textEditable: i = !0,
  autoFocus: a,
  className: f,
  layerZIndex: d,
  usageOptions: l = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: p = !0,
  pickerRequest: h,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: C,
  onBlur: m,
  onSubmit: w,
  assetReferenceProvider: I
}) {
  const b = _(
    L
  ), k = I || b, V = g(
    () => k ? [k] : void 0,
    [k]
  ), z = K(
    (u) => j(u, o, k),
    [k, o]
  ), W = g(
    () => n || D(e, o.options),
    [o.options, n, e]
  ), G = g(
    () => `${s}:${A(
      l
    )}:${A(c || [])}`,
    [c, s, l]
  );
  return $ ? /* @__PURE__ */ v(
    $,
    {
      value: e,
      content: W,
      references: o.options,
      placeholder: t,
      disabled: r,
      textEditable: i,
      autoFocus: a,
      className: f,
      layerZIndex: d,
      pickerScopes: H,
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: o.loadReferences,
      loadPreview: z,
      providers: V,
      usageOptions: l,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: p,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: h,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: C,
      onBlur: m,
      onSubmit: w
    },
    G
  ) : /* @__PURE__ */ v(
    "textarea",
    {
      className: f,
      value: e,
      disabled: r,
      readOnly: !i,
      placeholder: t,
      onChange: (u) => C(u.target.value),
      onBlur: m,
      onKeyDown: (u) => {
        w && (u.metaKey || u.ctrlKey) && u.key === "Enter" && (u.preventDefault(), w());
      }
    }
  );
}
function A(e) {
  return e.map(
    (n) => [
      n.key,
      n.label,
      n.maxFiles || 0,
      ...n.acceptedKinds || []
    ].join(":")
  ).join("|");
}
function de({
  value: e,
  content: n,
  adapter: o,
  placeholder: t = "",
  className: r = ""
}) {
  const i = _(
    L
  ), a = K(
    (d) => j(d, o, i),
    [o, i]
  ), f = n ? Q(n, o.options) : D(e, o.options);
  return !S || !f?.parts.length ? /* @__PURE__ */ v("span", { className: r, children: e || t }) : /* @__PURE__ */ v("span", { className: `ws-canvas-reference-text ${r}`.trim(), children: /* @__PURE__ */ v(
    S,
    {
      content: f,
      fallback: e || t,
      references: o.options,
      showMediaAliases: !0,
      loadPreview: a
    }
  ) });
}
async function j(e, n, o) {
  const t = o?.loadPreview;
  if (!t)
    return n.loadPreview(e);
  try {
    const r = await t(e);
    if (r.media.length > 0 || r.content != null)
      return {
        refType: e.refType,
        refId: Number(r.refId || e.refId),
        title: r.title,
        text: r.text,
        media: r.media,
        content: r.content
      };
  } catch {
  }
  return n.loadPreview(e);
}
function Q(e, n) {
  const o = new Map(
    n.map((t) => [
      y(t.refType, t.refId),
      t.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (t) => t.type === "reference" ? {
        ...t,
        label: Y(
          o.get(y(t.ref_type, t.ref_id)) || t.label
        )
      } : t
    )
  };
}
function X(e) {
  return g(() => {
    const n = Z(e), o = /* @__PURE__ */ new Map(), t = n.flatMap((r) => {
      const i = Number(r.refId || 0), a = Number(r.versionID || 0), f = r.refType || "asset";
      if (i <= 0 || f === "asset" && a <= 0)
        return [];
      const d = q(r, i);
      return o.set(
        y(d.refType, d.refId),
        r
      ), [d];
    });
    return {
      options: t,
      loadReferences: async (r) => ({
        items: r.scope === "current" ? oe(t, r.query) : []
      }),
      loadPreview: async (r) => ee(
        o.get(
          y(r.refType, r.refId)
        ),
        r
      )
    };
  }, [e]);
}
function Z(e) {
  const n = [], o = /* @__PURE__ */ new Set();
  for (const t of e) {
    const r = R(t.title);
    if (!r)
      continue;
    const i = `${t.source}:${t.id}`;
    o.has(i) || (o.add(i), n.push({ ...t, title: r }));
  }
  return n;
}
function q(e, n) {
  const o = O(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: e.refType || "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    label: R(e.title),
    description: T(e),
    preview: {
      text: T(e),
      kind: o[0]?.kind || e.kind,
      url: o[0]?.url || ""
    },
    mediaCount: o.length
  };
}
function ee(e, n) {
  if (!e)
    return {
      refType: n.refType,
      refId: n.refId,
      title: n.label,
      text: "引用内容已不可用",
      media: []
    };
  const o = O(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: R(e.title),
    text: T(e),
    media: o,
    content: o.length > 0 ? void 0 : e.output
  };
}
function y(e, n) {
  return `${e}:${n}`;
}
function O(e) {
  const n = F(e.kind), o = ne(e.output, n), t = re(e), r = o.length > 0 ? o : t, i = R(e.title), a = /* @__PURE__ */ new Set(), f = r.flatMap((s) => {
    const c = s.url.trim(), p = `${s.kind}:${c}`;
    return !c || a.has(p) ? [] : (a.add(p), [{ ...s, url: c }]);
  }), d = f.reduce((s, c) => (s.set(c.kind, (s.get(c.kind) || 0) + 1), s), /* @__PURE__ */ new Map()), l = /* @__PURE__ */ new Map();
  return f.map((s) => {
    const c = (l.get(s.kind) || 0) + 1;
    return l.set(s.kind, c), {
      kind: s.kind,
      url: s.url,
      index: c,
      label: (d.get(s.kind) || 0) > 1 ? `${i} · ${te(s.kind)} ${c}` : i
    };
  });
}
function ne(e, n) {
  const t = ["image", "video", "audio"].flatMap(
    (i) => B(e, i).map((a) => ({ kind: i, url: a }))
  );
  if (!n || n === "file")
    return t;
  const r = t.filter(
    (i) => i.kind === n
  );
  return r.length > 0 ? r : t;
}
function re(e) {
  const n = [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ], o = F(e.kind), t = o ? n.filter((r) => r.kind === o && r.url) : [];
  return t.length > 0 ? t : n.filter((r) => r.url);
}
function F(e) {
  const n = String(e || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : "";
}
function te(e) {
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
function T(e) {
  const n = String(e.preview.text || "").trim();
  return !n || n === e.title ? e.kind === "text" ? "画布文本内容" : "画布生成素材" : n.length > 160 ? `${n.slice(0, 160)}...` : n;
}
function oe(e, n) {
  const o = n.trim().toLowerCase();
  return o ? e.filter(
    (t) => [t.label, t.description, t.preview?.kind].some(
      (r) => String(r || "").toLowerCase().includes(o)
    )
  ) : e;
}
function R(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
export {
  fe as C,
  de as a,
  J as b,
  X as u
};
