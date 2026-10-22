import { j as v } from "./react-D9GkiX5b.js";
import { w as J, c as K, p as L, n as Q, a as X, r as Z } from "./space-ordered-list-BzuXThI0.js";
import { u as k, o as N, h as O } from "./file-kind-D6bMOzYN.js";
import { C as U } from "./space-reference-provider-context-DMWNuQBI.js";
await window.DeverFront?.ensureCompat?.(["@/components/reference-composer"]);
const x = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!x || Object.keys(x).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const q = ["current"], j = [], F = x, A = F.ReferenceEditor, _ = F.ReferenceContentView;
function ve({
  value: e,
  content: n,
  items: o,
  placeholder: r,
  disabled: t,
  textEditable: i,
  autoFocus: d,
  className: a,
  layerZIndex: l,
  usageOptions: u = j,
  usageField: c = "usage",
  mediaUsageOptions: s,
  autoAssignUsage: p = !0,
  pickerRequest: I,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: C,
  onBlur: R,
  onSubmit: w,
  assetReferenceProvider: S
}) {
  const b = re(o);
  return /* @__PURE__ */ v(
    ee,
    {
      value: e,
      content: n,
      adapter: b,
      placeholder: r,
      disabled: t,
      textEditable: i,
      autoFocus: d,
      className: a,
      layerZIndex: l,
      usageOptions: u,
      usageField: c,
      mediaUsageOptions: s,
      autoAssignUsage: p,
      pickerRequest: I,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: C,
      onBlur: R,
      onSubmit: w,
      assetReferenceProvider: S
    }
  );
}
function ee({
  value: e,
  content: n,
  adapter: o,
  placeholder: r,
  disabled: t,
  textEditable: i = !0,
  autoFocus: d,
  className: a,
  layerZIndex: l,
  usageOptions: u = j,
  usageField: c = "usage",
  mediaUsageOptions: s,
  autoAssignUsage: p = !0,
  pickerRequest: I,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: C,
  onBlur: R,
  onSubmit: w,
  assetReferenceProvider: S
}) {
  const b = N(
    U
  ), g = S || b, G = k(
    () => g ? [g] : void 0,
    [g]
  ), Y = O(
    (f) => V(f, o, g),
    [g, o]
  ), m = k(
    () => n || K(
      e,
      o.options.map((f) => ({
        ...f,
        versionId: f.versionID
      }))
    ),
    [o.options, n, e]
  ), $ = k(
    () => L(o.options, m),
    [o.options, m]
  ), B = k(
    () => `${c}:${D(
      u
    )}:${D(s || [])}`,
    [s, c, u]
  );
  return A ? /* @__PURE__ */ v(
    A,
    {
      value: e,
      content: m,
      references: $,
      placeholder: r,
      disabled: t,
      textEditable: i,
      autoFocus: d,
      className: a,
      layerZIndex: l,
      pickerScopes: q,
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: o.loadReferences,
      loadPreview: Y,
      providers: G,
      usageOptions: u,
      usageField: c,
      mediaUsageOptions: s,
      autoAssignUsage: p,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: I,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: (f, H) => C(
        f,
        Z(
          H,
          m,
          $
        )
      ),
      onBlur: R,
      onSubmit: w
    },
    B
  ) : /* @__PURE__ */ v(
    "textarea",
    {
      className: a,
      value: e,
      disabled: t,
      readOnly: !i,
      placeholder: r,
      onChange: (f) => C(f.target.value),
      onBlur: R,
      onKeyDown: (f) => {
        w && (f.metaKey || f.ctrlKey) && f.key === "Enter" && (f.preventDefault(), w());
      }
    }
  );
}
function D(e) {
  return e.map(
    (n) => [
      n.key,
      n.label,
      n.maxFiles || 0,
      ...n.acceptedKinds || []
    ].join(":")
  ).join("|");
}
function we({
  value: e,
  content: n,
  adapter: o,
  placeholder: r = "",
  className: t = ""
}) {
  const i = N(
    U
  ), d = O(
    (u) => V(u, o, i),
    [o, i]
  ), a = n ? ne(n, o.options) : K(e, o.options), l = L(
    o.options,
    a
  );
  return !_ || !a?.parts.length ? /* @__PURE__ */ v("span", { className: t, children: e || r }) : /* @__PURE__ */ v("span", { className: `ws-canvas-reference-text ${t}`.trim(), children: /* @__PURE__ */ v(
    _,
    {
      content: a,
      fallback: e || r,
      references: l,
      showMediaAliases: !0,
      loadPreview: d
    }
  ) });
}
async function V(e, n, o) {
  const r = o?.loadPreview;
  if (!r)
    return n.loadPreview(e);
  try {
    const t = await r(e);
    if (t.media.length > 0 || t.content != null)
      return {
        refType: e.refType,
        refId: Number(t.refId || e.refId),
        title: t.title,
        text: t.text,
        media: t.media,
        content: t.content
      };
  } catch {
  }
  return n.loadPreview(e);
}
function ne(e, n) {
  const o = new Map(
    n.filter((r) => !r.contentSelection).map((r) => [
      y(r.refType, r.refId),
      r.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (r) => r.type === "reference" && !r.ref_content_selection ? {
        ...r,
        label: Q(
          o.get(y(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function re(e) {
  return k(() => {
    const n = te(e), o = /* @__PURE__ */ new Map(), r = n.flatMap((t) => {
      const i = Number(t.refId || 0), d = Number(t.versionID || 0), a = t.refType || "asset";
      if (i <= 0 || a === "asset" && d <= 0)
        return [];
      const l = oe(t, i);
      return o.set(
        y(l.refType, l.refId),
        t
      ), [l];
    });
    return {
      options: r,
      loadReferences: async (t) => ({
        items: t.scope === "current" ? fe(r, t.query) : []
      }),
      loadPreview: async (t) => ie(
        o.get(
          y(t.refType, t.refId)
        ),
        t
      )
    };
  }, [e]);
}
function te(e) {
  const n = [], o = /* @__PURE__ */ new Set();
  for (const r of e) {
    const t = h(r.title);
    if (!t)
      continue;
    const i = `${r.source}:${r.id}`;
    o.has(i) || (o.add(i), n.push({ ...r, title: t }));
  }
  return n;
}
function oe(e, n) {
  const o = W(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: e.refType || "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    contentSelection: e.contentSelection,
    ...e.contentSelection ? {
      origin: "writing",
      originID: J(e.contentSelection)
    } : {},
    label: h(e.title),
    description: T(e),
    preview: {
      text: T(e),
      kind: o[0]?.kind || e.kind,
      url: o[0]?.url || ""
    },
    mediaCount: o.length
  };
}
function ie(e, n) {
  if (!e)
    return {
      refType: n.refType,
      refId: n.refId,
      title: n.label,
      text: "引用内容已不可用",
      media: []
    };
  const o = W(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: h(e.title),
    text: T(e),
    media: o,
    content: o.length > 0 ? void 0 : e.output
  };
}
function y(e, n) {
  return `${e}:${n}`;
}
function W(e) {
  const n = z(e.kind), o = ce(e.output, n), r = se(e), t = o.length > 0 ? o : r, i = h(e.title), d = /* @__PURE__ */ new Set(), a = t.flatMap((c) => {
    const s = c.url.trim(), p = `${c.kind}:${s}`;
    return !s || d.has(p) ? [] : (d.add(p), [{ ...c, url: s }]);
  }), l = a.reduce((c, s) => (c.set(s.kind, (c.get(s.kind) || 0) + 1), c), /* @__PURE__ */ new Map()), u = /* @__PURE__ */ new Map();
  return a.map((c) => {
    const s = (u.get(c.kind) || 0) + 1;
    return u.set(c.kind, s), {
      kind: c.kind,
      url: c.url,
      index: s,
      label: (l.get(c.kind) || 0) > 1 ? `${i} · ${ae(c.kind)} ${s}` : i
    };
  });
}
function ce(e, n) {
  const r = ["image", "video", "audio"].flatMap(
    (i) => X(e, i).map((d) => ({ kind: i, url: d }))
  );
  if (!n || n === "file")
    return r;
  const t = r.filter(
    (i) => i.kind === n
  );
  return t.length > 0 ? t : r;
}
function se(e) {
  const n = [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ], o = z(e.kind), r = o ? n.filter((t) => t.kind === o && t.url) : [];
  return r.length > 0 ? r : n.filter((t) => t.url);
}
function z(e) {
  const n = String(e || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : "";
}
function ae(e) {
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
function fe(e, n) {
  const o = n.trim().toLowerCase();
  return o ? e.filter(
    (r) => [r.label, r.description, r.preview?.kind].some(
      (t) => String(t || "").toLowerCase().includes(o)
    )
  ) : e;
}
function h(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
export {
  ve as C,
  we as a,
  ee as b,
  re as u
};
