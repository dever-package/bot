import { j as v } from "./preloadable-R-5sHdlM.js";
import { w as Z, b as O, p as U, n as q, r as ee } from "./writing-reference-DlogpT9K.js";
import { u as k, o as j, h as F } from "./file-kind-Cq3pESGF.js";
import { c as ne } from "./space-media-references-_pbyPR9I.js";
import { C as V } from "./node-detail-storyboard-grid-BROcLy6T.js";
await window.DeverFront?.ensureCompat?.(["@/components/reference-composer"]);
const A = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!A || Object.keys(A).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const re = ["current"], W = [], z = A, K = z.ReferenceEditor, L = z.ReferenceContentView;
function Ce({
  value: e,
  content: n,
  items: o,
  placeholder: r,
  disabled: t,
  textEditable: i,
  autoFocus: d,
  className: a,
  layerZIndex: l,
  usageOptions: u = W,
  usageField: c = "usage",
  mediaUsageOptions: s,
  mediaSelectionMaxFiles: p,
  mediaSelectionUsages: I,
  onReferenceMediaUsageSelect: E,
  autoAssignUsage: M = !0,
  pickerRequest: P,
  onPickerRequestConsumed: S,
  onReferenceDelete: b,
  onReferenceUsageChange: x,
  onChange: C,
  onBlur: R,
  onSubmit: w,
  assetReferenceProvider: T
}) {
  const $ = ie(o);
  return /* @__PURE__ */ v(
    te,
    {
      value: e,
      content: n,
      adapter: $,
      placeholder: r,
      disabled: t,
      textEditable: i,
      autoFocus: d,
      className: a,
      layerZIndex: l,
      usageOptions: u,
      usageField: c,
      mediaUsageOptions: s,
      mediaSelectionMaxFiles: p,
      mediaSelectionUsages: I,
      onReferenceMediaUsageSelect: E,
      autoAssignUsage: M,
      pickerRequest: P,
      onPickerRequestConsumed: S,
      onReferenceDelete: b,
      onReferenceUsageChange: x,
      onChange: C,
      onBlur: R,
      onSubmit: w,
      assetReferenceProvider: T
    }
  );
}
function te({
  value: e,
  content: n,
  adapter: o,
  placeholder: r,
  disabled: t,
  textEditable: i = !0,
  autoFocus: d,
  className: a,
  layerZIndex: l,
  usageOptions: u = W,
  usageField: c = "usage",
  mediaUsageOptions: s,
  mediaSelectionMaxFiles: p,
  mediaSelectionUsages: I,
  onReferenceMediaUsageSelect: E,
  autoAssignUsage: M = !0,
  pickerRequest: P,
  onPickerRequestConsumed: S,
  onReferenceDelete: b,
  onReferenceUsageChange: x,
  onChange: C,
  onBlur: R,
  onSubmit: w,
  assetReferenceProvider: T
}) {
  const $ = j(
    V
  ), g = T || $, H = k(
    () => g ? [g] : void 0,
    [g]
  ), J = F(
    (f) => G(f, o, g),
    [g, o]
  ), m = k(
    () => n || O(
      e,
      o.options.map((f) => ({
        ...f,
        versionId: f.versionID
      }))
    ),
    [o.options, n, e]
  ), D = k(
    () => U(o.options, m),
    [o.options, m]
  ), Q = k(
    () => `${c}:${N(
      u
    )}:${N(s || [])}`,
    [s, c, u]
  );
  return K ? /* @__PURE__ */ v(
    K,
    {
      value: e,
      content: m,
      references: D,
      placeholder: r,
      disabled: t,
      textEditable: i,
      autoFocus: d,
      className: a,
      layerZIndex: l,
      pickerScopes: re,
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: o.loadReferences,
      loadPreview: J,
      providers: H,
      usageOptions: u,
      usageField: c,
      mediaUsageOptions: s,
      mediaSelectionMaxFiles: p,
      mediaSelectionUsages: I,
      onReferenceMediaUsageSelect: E,
      autoAssignUsage: M,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: P,
      onPickerRequestConsumed: S,
      onReferenceDelete: b,
      onReferenceUsageChange: x,
      onChange: (f, X) => C(
        f,
        ee(
          X,
          m,
          D
        )
      ),
      onBlur: R,
      onSubmit: w
    },
    Q
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
function N(e) {
  return e.map(
    (n) => [
      n.key,
      n.label,
      n.maxFiles || 0,
      ...n.acceptedKinds || []
    ].join(":")
  ).join("|");
}
function Re({
  value: e,
  content: n,
  adapter: o,
  placeholder: r = "",
  className: t = ""
}) {
  const i = j(
    V
  ), d = F(
    (u) => G(u, o, i),
    [o, i]
  ), a = n ? oe(n, o.options) : O(e, o.options), l = U(
    o.options,
    a
  );
  return !L || !a?.parts.length ? /* @__PURE__ */ v("span", { className: t, children: e || r }) : /* @__PURE__ */ v("span", { className: `ws-canvas-reference-text ${t}`.trim(), children: /* @__PURE__ */ v(
    L,
    {
      content: a,
      fallback: e || r,
      references: l,
      showMediaAliases: !0,
      loadPreview: d
    }
  ) });
}
async function G(e, n, o) {
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
function oe(e, n) {
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
        label: q(
          o.get(y(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function ie(e) {
  return k(() => {
    const n = ce(e), o = /* @__PURE__ */ new Map(), r = n.flatMap((t) => {
      const i = Number(t.refId || 0), d = Number(t.versionID || 0), a = t.refType || "asset";
      if (i <= 0 || a === "asset" && d <= 0)
        return [];
      const l = se(t, i);
      return o.set(
        y(l.refType, l.refId),
        t
      ), [l];
    });
    return {
      options: r,
      loadReferences: async (t) => ({
        items: t.scope === "current" ? ue(r, t.query) : []
      }),
      loadPreview: async (t) => ae(
        o.get(
          y(t.refType, t.refId)
        ),
        t
      )
    };
  }, [e]);
}
function ce(e) {
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
function se(e, n) {
  const o = Y(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: e.refType || "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    contentSelection: e.contentSelection,
    ...e.contentSelection ? {
      origin: "writing",
      originID: Z(e.contentSelection)
    } : {},
    label: h(e.title),
    description: _(e),
    preview: {
      text: _(e),
      kind: o[0]?.kind || e.kind,
      url: o[0]?.url || ""
    },
    mediaCount: o.length
  };
}
function ae(e, n) {
  if (!e)
    return {
      refType: n.refType,
      refId: n.refId,
      title: n.label,
      text: "引用内容已不可用",
      media: []
    };
  const o = Y(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: h(e.title),
    text: _(e),
    media: o,
    content: o.length > 0 ? void 0 : e.output
  };
}
function y(e, n) {
  return `${e}:${n}`;
}
function Y(e) {
  const n = B(e.kind), o = fe(e.output, n), r = de(e), t = o.length > 0 ? o : r, i = h(e.title), d = /* @__PURE__ */ new Set(), a = t.flatMap((c) => {
    const s = c.url.trim(), p = `${c.kind}:${s}`;
    return !s || d.has(p) ? [] : (d.add(p), [{ ...c, url: s }]);
  }), l = a.reduce((c, s) => (c.set(s.kind, (c.get(s.kind) || 0) + 1), c), /* @__PURE__ */ new Map()), u = /* @__PURE__ */ new Map();
  return a.map((c) => {
    const s = (u.get(c.kind) || 0) + 1;
    return u.set(c.kind, s), {
      kind: c.kind,
      url: c.url,
      index: s,
      label: (l.get(c.kind) || 0) > 1 ? `${i} · ${le(c.kind)} ${s}` : i
    };
  });
}
function fe(e, n) {
  const r = ["image", "video", "audio"].flatMap(
    (i) => ne(e, i).map((d) => ({ kind: i, url: d }))
  );
  if (!n || n === "file")
    return r;
  const t = r.filter(
    (i) => i.kind === n
  );
  return t.length > 0 ? t : r;
}
function de(e) {
  const n = [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ], o = B(e.kind), r = o ? n.filter((t) => t.kind === o && t.url) : [];
  return r.length > 0 ? r : n.filter((t) => t.url);
}
function B(e) {
  const n = String(e || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(n) ? n : "";
}
function le(e) {
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
function _(e) {
  const n = String(e.preview.text || "").trim();
  return !n || n === e.title ? e.kind === "text" ? "画布文本内容" : "画布生成素材" : n.length > 160 ? `${n.slice(0, 160)}...` : n;
}
function ue(e, n) {
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
  Re as C,
  Ce as a,
  ie as u
};
